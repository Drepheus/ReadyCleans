import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are a helpful AI assistant for ReadyCleans, a professional cleaning service specializing in Standard residential cleans and Airbnb turnover cleaning in Phoenix, AZ.
- Standard Cleans: Start at $69 for Studio, up to $249 for 5 Bed / 3 Bath
- Airbnb Turnovers: Start at $69 for Studio, up to $249 for 5 Bed / 3 Bath
- Add-ons: Oven ($15), Fridge ($15), Windows ($15), Same-Day ($35)
- We cover all standard points: Kitchen, Bathrooms, Floors, Baseboards.
- 100% Satisfaction Guarantee.
- Be friendly, professional, and concise. Direct users to book at readycleans.space/booking.`;

async function sendToSlack(customerMessage, aiResponse, webhookUrl) {
    if (!webhookUrl) return;

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: `*New Chat Message*\n*User:* ${customerMessage}\n*AI Response:* ${aiResponse.substring(0, 500)}...`
            })
        });
    } catch (e) {
        console.error("Slack Error", e);
    }
}

export default async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const chatHistory = [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: 'Understood. I am ready to help customers with ReadyCleans inquiries.' }] },
            ...history.map((msg) => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            })),
        ];

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: { maxOutputTokens: 500 },
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        // Send to Slack
        await sendToSlack(message, responseText, process.env.SLACK_WEBHOOK_URL);

        return res.status(200).json({ response: responseText });

    } catch (error) {
        console.error('Chat API Error:', error);
        return res.status(500).json({ error: 'Failed to get AI response' });
    }
}
