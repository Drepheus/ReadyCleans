import { getAgentResponse } from './agentEngine.js';

async function sendToSlack(text) {
    // If Slack Bot Token is configured, can use Slack Web API
    if (process.env.SLACK_BOT_TOKEN) {
        try {
            await fetch('https://slack.com/api/chat.postMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
                },
                body: JSON.stringify({
                    channel: '#social',
                    text
                })
            });
            return;
        } catch (e) {
            console.error("Slack Bot Error:", e);
        }
    }

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
        const timeString = new Date().toLocaleTimeString('en-US', {
            timeZone: 'America/Phoenix',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        // 1. Send live customer chat message to Slack immediately
        const lowerMsg = trimmedMessage.toLowerCase();
        const isUrgent = lowerMsg.includes('urgent') || lowerMsg.includes('emergency') || lowerMsg.includes('human') || lowerMsg.includes('call me');
        const alertPrefix = isUrgent ? '🚨 *URGENT CHAT — ATTENTION REQUIRED*\n' : '';

        await sendToSlack(`${alertPrefix}💬 *Live Customer Chat Message*\n*Customer:* "${trimmedMessage}"\n*Time:* ${timeString} MST`);

        // 2. Multi-tier AI Agent handles response 24/7/365
        const { response: responseText } = await getAgentResponse({
            message: trimmedMessage,
            history
        });

        // 3. Send AI Agent response to Slack so the owner can see the full thread
        const preview = responseText.length > 350 ? responseText.substring(0, 350) + '...' : responseText;
        await sendToSlack(`🤖 *AI Agent Response (24/7 Assistant):*\n${preview}`);

        return res.status(200).json({ response: responseText });

    } catch (error) {
        console.error('Chat API Error:', error);
        // Even in unexpected errors, provide helpful, authoritative response
        const fallback = "Thanks for contacting ReadyCleans! Our standard and Airbnb cleanings in Phoenix start at $77 for studios up to $279 for 5 Bed / 3 Bath. You can check live availability and book anytime at [readycleans.space/booking](/booking) or reach our team directly at (602) 671-2856.";
        return res.status(200).json({ response: fallback });
    }
}
