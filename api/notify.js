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
        const { text, channel, blocks } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const isBooked = channel === 'booked' || channel === '#booked';
        const targetChannel = channel ? (channel.startsWith('#') ? channel : `#${channel}`) : undefined;

        // Check if Slack Bot Token is provided for direct channel posting
        if (process.env.SLACK_BOT_TOKEN) {
            try {
                const botRes = await fetch('https://slack.com/api/chat.postMessage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
                    },
                    body: JSON.stringify({
                        channel: targetChannel || '#social',
                        text,
                        ...(blocks ? { blocks } : {})
                    })
                });
                const botData = await botRes.json();
                if (botData.ok) {
                    return res.status(200).json({ success: true, via: 'bot' });
                }
                console.warn('Slack bot postMessage non-ok, falling back to webhook:', botData.error);
            } catch (botErr) {
                console.error('Slack Bot API Error:', botErr);
            }
        }

        // Webhook routing: prefer dedicated booked webhook for booked channel
        const webhookUrl = isBooked
            ? (process.env.SLACK_BOOKED_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL_BOOKED || process.env.SLACK_WEBHOOK_URL)
            : process.env.SLACK_WEBHOOK_URL;

        if (webhookUrl) {
            const payload = {
                text,
                ...(targetChannel ? { channel: targetChannel } : {}),
                ...(blocks ? { blocks } : {})
            };

            const slackRes = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!slackRes.ok) {
                const errText = await slackRes.text().catch(() => '');
                console.error(`Slack webhook error: ${slackRes.status} ${errText}`);
            }
        } else {
            console.warn('No Slack Webhook URL configured in environment variables');
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Notification API Error:', error);
        return res.status(500).json({ error: 'Failed to send notification' });
    }
}
