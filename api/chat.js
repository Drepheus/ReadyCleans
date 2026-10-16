import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are a helpful AI assistant for ReadyCleans, a professional cleaning service specializing in Standard residential cleans and Airbnb turnover cleaning in Phoenix, AZ.
- Standard Cleans: Start at $77 for Studio, up to $279 for 5 Bed / 3 Bath
- Airbnb Turnovers: Start at $77 for Studio, up to $279 for 5 Bed / 3 Bath
- Add-ons: Oven ($17), Fridge ($17), Windows ($17), Same-Day ($39)
- We cover all standard points: Kitchen, Bathrooms, Floors, Baseboards.
- 100% Satisfaction Guarantee.
- Direct users to book online at readycleans.space/booking or call/text (602) 671-2856.
- Be friendly, professional, and concise.`;

async function sendToSlack(text) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) return;

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
    } catch (e) {
        console.error("Slack Notification Error:", e);
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

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        const trimmedMessage = message.trim();
        const timeString = new Date().toLocaleTimeString('en-US', { timeZone: 'America/Phoenix', hour: 'numeric', minute: '2-digit', hour12: true });

        // 1. Immediately send customer chat message to Slack so no lead is missed
        await sendToSlack(`💬 *Live Customer Chat Message*\n*Customer:* "${trimmedMessage}"\n*Time:* ${timeString} MST`);

        let responseText = '';

        // 2. Try generating response with Gemini if API key is configured
        if (process.env.GEMINI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({
                    model: "gemini-2.0-flash",
                    systemInstruction: SYSTEM_PROMPT
                });

                // Prepare clean alternating history for Gemini multiturn chat
                const cleanHistory = [];
                for (const msg of history) {
                    if (!msg || !msg.text) continue;
                    const role = msg.sender === 'user' ? 'user' : 'model';
                    // Gemini requires strict alternating turns
                    if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== role) {
                        cleanHistory.push({
                            role,
                            parts: [{ text: msg.text }]
                        });
                    }
                }
                // If history ends with user, remove it so current user message doesn't double
                if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === 'user') {
                    cleanHistory.pop();
                }

                const chat = model.startChat({
                    history: cleanHistory,
                    generationConfig: { maxOutputTokens: 500 },
                });

                const result = await chat.sendMessage(trimmedMessage);
                responseText = result.response.text();
            } catch (geminiError) {
                console.error('Gemini API Error:', geminiError);
                // Try fallback to gemini-1.5-flash if 2.0-flash errored
                try {
                    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                    const fallbackModel = genAI.getGenerativeModel({
                        model: "gemini-1.5-flash",
                        systemInstruction: SYSTEM_PROMPT
                    });
                    const fallbackResult = await fallbackModel.generateContent(trimmedMessage);
                    responseText = fallbackResult.response.text();
                } catch (fallbackError) {
                    console.error('Gemini Fallback Error:', fallbackError);
                }
            }
        }

        // 3. If Gemini didn't return text (e.g. no key, rate limit, network issue), provide friendly fallback response
        if (!responseText) {
            responseText = "Thanks for messaging us! Our team has received your inquiry directly in our Slack queue and will assist you shortly. If you'd like to book an appointment right now, you can reserve your spot online at [readycleans.space/booking](/booking) or call/text us directly at (602) 671-2856.";
        } else {
            // Also notify Slack with the AI response so the team can see what was answered
            await sendToSlack(`🤖 *AI Response:* ${responseText.substring(0, 300)}${responseText.length > 300 ? '...' : ''}`);
        }

        return res.status(200).json({ response: responseText });

    } catch (error) {
        console.error('Chat API Error:', error);
        // Even in catch block, return 200 with fallback so customer is never stranded
        const fallbackText = "Thanks for contacting ReadyCleans! Your message was sent to our support team. You can also view pricing and book anytime at [readycleans.space/booking](/booking) or reach us directly at (602) 671-2856.";
        return res.status(200).json({ response: fallbackText });
    }
}
