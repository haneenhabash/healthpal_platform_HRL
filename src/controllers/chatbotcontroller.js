const ChatService = require("../Services/ChatbotService");

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Please send a message"
            });
        }

        const reply = await ChatService.chatWithUser(message);

        res.status(200).json({
            success: true,
            reply: reply
        });

    } catch (error) {
        console.error("❌ Chat Controller Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};