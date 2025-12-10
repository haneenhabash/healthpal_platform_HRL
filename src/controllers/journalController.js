const { Journal } = require('../models');

// 1. إنشاء مذكرة جديدة (تم التعديل لدعم الملفات)
exports.createEntry = async (req, res) => {
    try {
        // ننسخ البيانات من الـ body
        let entryData = { ...req.body };

        // [إضافة] التعامل مع الملف المرفوع (صورة أو صوت)
        // هذا يتطلب استخدام middleware مثل 'multer' في ملف الـ routes
        if (req.file) {
            // تخزين مسار الملف ليتمكن الفرونت إند من عرضه
            entryData.mediaUrl = `/uploads/${req.file.filename}`;

            // تحديد النوع تلقائياً إذا لم يرسله الفرونت
            if (!entryData.entryType) {
                if (req.file.mimetype.startsWith('image')) entryData.entryType = 'Drawing';
                else if (req.file.mimetype.startsWith('audio')) entryData.entryType = 'Voice';
            }
        }

        const entry = await Journal.create(entryData);
        res.status(201).json({ msg: 'Entry saved successfully', entry });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// 2. جلب مذكرات المريض (للمريض نفسه - يرى كل شيء)
exports.getPatientEntries = async (req, res) => {
    try {
        const entries = await Journal.findAll({
            where: { patientId: req.params.patientId },
            order: [['createdAt', 'DESC']]
        });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. [جديد] جلب المذكرات للطبيب (يرى فقط ما تمت مشاركته)
exports.getDoctorView = async (req, res) => {
    try {
        const { patientId } = req.params;

        const sharedEntries = await Journal.findAll({
            where: {
                patientId: patientId,
                isSharedWithDoctor: true // شرط أساسي للخصوصية
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(sharedEntries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. تغيير حالة المشاركة (Share/Unshare)
exports.toggleShareStatus = async (req, res) => {
    try {
        const entry = await Journal.findByPk(req.params.id);
        if (!entry) return res.status(404).json({ msg: 'Entry not found' });

        // عكس الحالة الحالية
        entry.isSharedWithDoctor = !entry.isSharedWithDoctor;
        await entry.save();

        res.json({
            msg: entry.isSharedWithDoctor ? 'Shared with doctor' : 'Unshared from doctor',
            isShared: entry.isSharedWithDoctor
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. [جديد] حذف مذكرة (مهم لراحة المريض النفسية)
exports.deleteEntry = async (req, res) => {
    try {
        const entry = await Journal.findByPk(req.params.id);
        if (!entry) return res.status(404).json({ msg: 'Entry not found' });

        await entry.destroy();
        res.json({ msg: 'Journal entry deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};