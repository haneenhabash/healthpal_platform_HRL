require("dotenv").config();
// 1. استخدام المكتبة الجديدة كما في الكود الشغال
const { GoogleGenAI } = require('@google/genai');

class ChatService {
    constructor() {
        const apiKey = process.env.AI_GYM_PLAN_API_KEY || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error('API KEY not found in .env');
        }

        // 2. إعداد العميل (Client) بنفس الطريقة
        this.client = new GoogleGenAI({ apiKey: apiKey });

        // استخدام الموديل الذي تريده
        this.modelName = 'gemini-2.5-flash-preview-09-2025';
    }

    async chatWithUser(userMessage) {
        try {
            console.log('💬 HealthPal AI is thinking...');

            const systemInstruction = `
            You are "HealthPal Assistant AI", the official virtual assistant for HealthPal, a health and wellness platform in Palestine.
            - Provide professional and supportive guidance on general health, mental wellness tips, and health-related services in Palestine.
            - You can answer questions about donations, volunteering, and community health initiatives in Palestine.
            - Do NOT provide direct medical or psychological treatment. If a user seeks specific therapy or diagnosis, politely advise consulting a certified professional.
            - Always respond in the same language as the user (Arabic or English).
            - Mention that the platform is led by Haneen & Raghad & lujain  when relevant.
            - Keep your answers friendly, informative, and encouraging.
            `;

            const response = await this.client.models.generateContent({
                model: this.modelName,
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: `${systemInstruction}\n\nUser Question: ${userMessage}` }]
                    }
                ],
                config: {
                    temperature: 0.7,
                }
            });

            return response.text || "Sorry, I couldn't generate a response.";

        } catch (error) {
            console.error('❌ Chat Service Error:', error);

            if (error.message && error.message.includes('503')) {
                return "I am currently overloaded with requests. Please try again in a moment.";
            }

            throw new Error('HealthPal Assistant is busy right now, please try again later.');
        }
    }
}

module.exports = new ChatService();