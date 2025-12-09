// src/utils/medicalTests.js

const tests = {
    // 1. PTSD Screening (Based on PC-PTSD-5)
    // Target: War survivors and trauma patients
    'PTSD_Checklist': {
        title: "Trauma & PTSD Screening",
        description: "Please answer the following based on your experiences in the past month.",
        questions: [
            {
                id: 1,
                text: "Have you had nightmares about the event(s) or thought about it when you didn't want to?",
                weight: 1
            },
            {
                id: 2,
                text: "Have you tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of it?",
                weight: 1
            },
            {
                id: 3,
                text: "Have you felt constantly on guard, watchful, or easily startled?",
                weight: 1
            },
            {
                id: 4,
                text: "Have you felt numb or detached from people, activities, or your surroundings?",
                weight: 1
            },
            {
                id: 5,
                text: "Do you feel guilty or unable to stop blaming yourself or others for the event(s)?",
                weight: 1
            }
        ],
        // Logic: Higher score = Higher risk
        calculateRisk: (score) => {
            if (score >= 4) return 'Critical';
            if (score === 3) return 'High';
            if (score === 2) return 'Moderate';
            return 'Low';
        }
    },

    // 2. Child Mood & Trauma Screen (Simplified for Guardians/Children)
    // Target: Children affected by conflict
    'Child_Mood_Screen': {
        title: "Child Emotional Health Check",
        description: "How has the child been feeling lately? (To be answered by child or guardian)",
        questions: [
            {
                id: 1,
                text: "Does the child feel sad or cry more than usual?",
                weight: 1
            },
            {
                id: 2,
                text: "Has the child lost interest in playing with friends or toys?",
                weight: 1
            },
            {
                id: 3,
                text: "Does the child get angry, fight, or have temper tantrums frequently?",
                weight: 1
            },
            {
                id: 4,
                text: "Is the child having trouble sleeping or wetting the bed?",
                weight: 1
            },
            {
                id: 5,
                text: "Does the child seem scared to be left alone (separation anxiety)?",
                weight: 1
            }
        ],
        calculateRisk: (score) => {
            if (score >= 4) return 'Critical';
            if (score >= 2) return 'High';
            if (score === 1) return 'Moderate';
            return 'Low';
        }
    },

    // 3. General Anxiety (GAD-Short)
    // Target: General stress assessment
    'Anxiety_Screening': {
        title: "General Anxiety Assessment",
        description: "Over the last 2 weeks, how often have you been bothered by the following problems?",
        questions: [
            {
                id: 1,
                text: "Feeling nervous, anxious, or on edge?",
                weight: 1
            },
            {
                id: 2,
                text: "Not being able to stop or control worrying?",
                weight: 1
            },
            {
                id: 3,
                text: "Trouble relaxing?",
                weight: 1
            },
            {
                id: 4,
                text: "Becoming easily annoyed or irritable?",
                weight: 1
            }
        ],
        calculateRisk: (score) => {
            if (score >= 3) return 'High';
            if (score === 2) return 'Moderate';
            return 'Low';
        }
    }
};

module.exports = tests;