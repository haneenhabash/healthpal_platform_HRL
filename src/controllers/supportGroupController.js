const { SupportGroup, Patient, Doctor, GroupMessage, GroupSession } = require('../models');

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await SupportGroup.findAll({
            where: { isActive: true },
            include: [{
                model: Doctor,
                as: 'moderator',
                attributes: ['name', 'specialty']
            }]
        });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// 2. انضمام مريض لمجموعة
exports.joinGroup = async (req, res) => {
    try {
        const { groupId, patientId } = req.body;

        const group = await SupportGroup.findByPk(groupId);
        const patient = await Patient.findByPk(patientId);

        if (!group || !patient) {
            return res.status(404).json({ msg: 'Group or Patient not found' });
        }

        // التحقق مما إذا كانت المجموعة ممتلئة
        const currentMembersCount = await group.countPatients();
        if (currentMembersCount >= group.maxParticipants) {
            return res.status(400).json({ msg: 'Group is full' });
        }

        // التحقق مما إذا كان منضماً بالفعل
        const isMember = await group.hasPatient(patient);
        if (isMember) {
            return res.status(400).json({ msg: 'Patient is already in this group' });
        }

        await group.addPatient(patient);

        res.json({ msg: `Successfully joined ${group.name}` });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// 3. مغادرة المجموعة
exports.leaveGroup = async (req, res) => {
    try {
        const { groupId, patientId } = req.body;
        const group = await SupportGroup.findByPk(groupId);
        const patient = await Patient.findByPk(patientId);

        if (!group || !patient) {
            return res.status(404).json({ msg: 'Group or Patient not found' });
        }

        await group.removePatient(patient);

        res.json({ msg: 'Left group successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// 4. إنشاء مجموعة (للأطباء)
exports.createGroup = async (req, res) => {
    try {
        const newGroup = await SupportGroup.create(req.body);
        res.status(201).json({ msg: 'Group created', group: newGroup });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// 5. عرض مجموعات المريض الخاصة
exports.getPatientGroups = async (req, res) => {
    try {
        const { patientId } = req.params;
        const patient = await Patient.findByPk(patientId, {
            include: [{
                model: SupportGroup,
                through: { attributes: [] }
            }]
        });

        if (!patient) return res.status(404).json({ msg: 'Patient not found' });

        res.json(patient.SupportGroups);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
}; // <--- تم الإغلاق هنا بشكل صحيح، والآن الدوال التالية مستقلة

// 6. إرسال رسالة
exports.postMessage = async (req, res) => {
    try {
        const { groupId, senderId, senderType, content, isAnonymous } = req.body;

        // تحديد الاسم الذي سيظهر
        let displayName = 'Anonymous';

        if (!isAnonymous) {
            if (senderType === 'Doctor') {
                const doc = await Doctor.findByPk(senderId);
                displayName = doc ? `Dr. ${doc.name}` : 'Doctor';
            } else {
                const pat = await Patient.findByPk(senderId);
                displayName = pat ? (pat.nickname || pat.name) : 'Member';
            }
        }

        const message = await GroupMessage.create({
            groupId,
            senderId,
            senderType,
            senderName: displayName,
            content,
            isAnonymous
        });

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 7. جلب رسائل المجموعة
exports.getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const messages = await GroupMessage.findAll({
            where: { groupId },
            order: [['createdAt', 'ASC']]
        });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 8. جدولة جلسة جديدة
exports.scheduleSession = async (req, res) => {
    try {
        const session = await GroupSession.create(req.body);
        res.status(201).json({ msg: 'Session Scheduled', session });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 9. جلب الجلسات القادمة لمجموعة
exports.getGroupSessions = async (req, res) => {
    try {
        const { groupId } = req.params;
        const sessions = await GroupSession.findAll({
            where: { groupId },
            order: [['scheduledAt', 'ASC']]
        });
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};