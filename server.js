import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4242;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Services
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// --- Blog Automation Engine ---

const DATA_DIR = path.join(__dirname, 'data');
const BLOGS_FILE = path.join(DATA_DIR, 'blogs.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

let cronTask = null;

// Helper: Read/Write Data
const readJson = (file) => {
    try {
        if (!fs.existsSync(file)) return null;
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        console.error(`Error reading ${file}:`, e);
        return null;
    }
};

const writeJson = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Automation Logic
const generateBlogPost = async () => {
    console.log('[Blog Engine] Starting generation task...');
    try {
        const config = readJson(CONFIG_FILE);
        let blogs = readJson(BLOGS_FILE) || [];

        // 0. Check for "stub" blogs (existing but no content) to backfill
        // We'll define a stub as one with missing "content" or "image"
        // Note: Our initial mock data has generated simulated content, 
        // but if the user adds empty stubs, this would pick them up.
        // For now, we'll just focus on creating NEW content to keep it simple as requested.

        // 1. Pick a topic
        const topics = config?.topics || ["Cleaning Tips"];
        const topic = topics[Math.floor(Math.random() * topics.length)];

        console.log(`[Blog Engine] Selected topic: ${topic}`);

        // 2. Prompt Gemini
        const prompt = `
            You are an expert content writer for "ReadyCleans", a premium cleaning service in Phoenix, AZ.
            Write a high-quality, SEO-optimized blog post about: "${topic}".
            
            Return ONLY a valid JSON object with the following fields:
            {
                "title": "A catchy, SEO-friendly title",
                "slug": "url-friendly-slug",
                "excerpt": "A compelling 2-sentence summary",
                "content": "The full blog post content in Markdown format. Use H2 (##) for subtitles. Make it professional, helpful, and sophisticated. Include a call to action at the end.",
                "category": "One word category (e.g., Cleaning, Hosting, Lifestyle)",
                "image_prompt": "A detailed, artistic text description of an image to represent this article (no text in image, photorealistic, premium interior design, 8k)"
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean markdown code blocks if present
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const articleData = JSON.parse(jsonStr);

        // 3. Generate Image URL (using Pollinations.ai for dynamic AI images)
        // We encode the prompt to be URL safe
        const imagePrompt = encodeURIComponent(`${articleData.image_prompt} high quality, 8k, photorealistic, cinematic lighting`);
        const imageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?width=1280&height=720&nologo=true&seed=${Date.now()}`;

        // 4. Create Blog Object
        const newBlog = {
            id: Date.now().toString(),
            ...articleData,
            date: new Date().toISOString().split('T')[0],
            author: "ReadyCleans AI",
            readTime: "5 min read",
            image: imageUrl
        };

        // 5. Save
        blogs.unshift(newBlog); // Add to top
        writeJson(BLOGS_FILE, blogs);

        console.log(`[Blog Engine] Successfully created: "${newBlog.title}"`);

        // Notify via Slack
        if (process.env.SLACK_WEBHOOK_URL) {
            sendToSlack("System Event: Blog Generated", `New Blog Published: ${newBlog.title}`, 0);
        }

        // 6. AUTO-DEPLOY: Commit and Push to GitHub
        // This makes it appear on Vercel automatically!
        const { exec } = await import('child_process');
        exec('git add data/blogs.json', (err) => {
            if (err) return console.error('Git Add Failed:', err);

            exec(`git commit -m "content: Auto-published '${newBlog.title}'"`, (err) => {
                if (err) return console.error('Git Commit Failed:', err);

                exec('git push origin main', (err) => {
                    if (err) console.error('Git Push Failed:', err);
                    else console.log('[Blog Engine] 🚀 Successfully pushed to live site!');
                });
            });
        });

    } catch (error) {
        console.error('[Blog Engine] Generation failed:', error);
    }
};

const setupScheduler = () => {
    const config = readJson(CONFIG_FILE);
    if (cronTask) cronTask.stop();

    if (config && config.autoGenerate) {
        const minutes = config.intervalMinutes || 60;
        const cronSchedule = `*/${minutes} * * * *`; // Every X minutes

        console.log(`[Blog Engine] Scheduler active: Running every ${minutes} minutes.`);

        cronTask = cron.schedule(cronSchedule, () => {
            generateBlogPost();
        });
    } else {
        console.log('[Blog Engine] Scheduler is paused.');
    }
};

// Initialize Scheduler on Server Start
setupScheduler();


// --- API Endpoints ---

// Get All Blogs
app.get('/api/blogs', (req, res) => {
    const blogs = readJson(BLOGS_FILE) || [];
    res.json(blogs);
});

// Get Single Blog
app.get('/api/blogs/:id', (req, res) => {
    const blogs = readJson(BLOGS_FILE) || [];
    const blog = blogs.find(b => b.id === req.params.id);
    if (blog) res.json(blog);
    else res.status(404).json({ error: "Blog not found" });
});

// Control Automation
app.post('/api/admin/config', (req, res) => {
    const { autoGenerate, intervalMinutes } = req.body;
    let config = readJson(CONFIG_FILE) || {};

    if (typeof autoGenerate === 'boolean') config.autoGenerate = autoGenerate;
    if (typeof intervalMinutes === 'number') config.intervalMinutes = intervalMinutes;

    writeJson(CONFIG_FILE, config);
    setupScheduler(); // Restart with new settings

    res.json({ message: "Configuration updated", config });
});

// Manual Trigger
app.post('/api/admin/generate', async (req, res) => {
    // Run asynchronously to not block response
    generateBlogPost();
    res.json({ message: "Generation task triggered" });
});

// Slack & Chat Logic
async function sendToSlack(text, channel) {
    const isBooked = channel === 'booked' || channel === '#booked';
    const targetChannel = channel ? (channel.startsWith('#') ? channel : `#${channel}`) : undefined;

    const webhookUrl = isBooked
        ? (process.env.SLACK_BOOKED_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL_BOOKED || process.env.SLACK_WEBHOOK_URL)
        : process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) return;

    try {
        const payload = {
            text,
            ...(targetChannel ? { channel: targetChannel } : {})
        };
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) { console.error("Slack Error", e); }
}

app.post('/api/notify', async (req, res) => {
    try {
        const { text, channel } = req.body;
        if (!text) return res.status(400).json({ error: 'Text is required' });

        await sendToSlack(text, channel);
        res.json({ success: true });
    } catch (err) {
        console.error('Notify Error:', err);
        res.status(500).json({ error: 'Failed to notify' });
    }
});

const SYSTEM_PROMPT = `You are a helpful AI assistant for ReadyCleans, a professional cleaning service specializing in Standard residential cleans and Airbnb turnover cleaning in Phoenix, AZ.
- Standard Cleans: Start at $77 for Studio, up to $279 for 5 Bed / 3 Bath
- Airbnb Turnovers: Start at $77 for Studio, up to $279 for 5 Bed / 3 Bath
- Add-ons: Oven ($17), Fridge ($17), Windows ($17), Same-Day ($39)
- We cover all standard points: Kitchen, Bathrooms, Floors, Baseboards.
- 100% Satisfaction Guarantee.
- Direct users to book online at readycleans.space/booking or call/text (602) 671-2856.
- Be friendly, professional, and concise.`;

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        const trimmed = message.trim();
        const timeString = new Date().toLocaleTimeString('en-US', { timeZone: 'America/Phoenix', hour: 'numeric', minute: '2-digit', hour12: true });

        // Immediately notify Slack
        await sendToSlack(`💬 *Live Customer Chat Message*\n*Customer:* "${trimmed}"\n*Time:* ${timeString} MST`);

        let responseText = '';

        if (model) {
            try {
                const cleanHistory = [];
                for (const msg of history) {
                    if (!msg || !msg.text) continue;
                    const role = msg.sender === 'user' ? 'user' : 'model';
                    if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== role) {
                        cleanHistory.push({ role, parts: [{ text: msg.text }] });
                    }
                }
                if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === 'user') {
                    cleanHistory.pop();
                }

                const chat = model.startChat({
                    history: cleanHistory,
                    generationConfig: { maxOutputTokens: 500 },
                });

                const result = await chat.sendMessage(trimmed);
                responseText = result.response.text();
            } catch (err) {
                console.error('Gemini Error:', err);
            }
        }

        if (!responseText) {
            responseText = "Thanks for messaging us! Our team has received your inquiry directly in our Slack queue and will assist you shortly. If you'd like to book an appointment right now, you can reserve your spot online at [readycleans.space/booking](/booking) or call/text us directly at (602) 671-2856.";
        } else {
            await sendToSlack(`🤖 *AI Response:* ${responseText.substring(0, 300)}`);
        }

        res.json({ response: responseText });

    } catch (error) {
        console.error('Chat endpoint error:', error);
        res.json({
            response: "Thanks for reaching out! We've received your message and sent it directly to our team. For instant pricing and scheduling, you can book online at [readycleans.space/booking](/booking) or call/text us at (602) 671-2856."
        });
    }
});

app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd' } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount, currency, automatic_payment_methods: { enabled: true }
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
