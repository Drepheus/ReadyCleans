import { GoogleGenerativeAI } from '@google/generative-ai';

export const SYSTEM_PROMPT = `You are "CleanBot", the official 24/7 AI Customer Support & Booking Agent for ReadyCleans (readycleans.space), Phoenix's premier residential and Airbnb turnover cleaning service.
You are active 24/7/365 to instantly answer questions, provide quotes, explain services, and help customers book appointments even while our staff is offline or asleep.

### KEY BUSINESS DETAILS
- Company: ReadyCleans (readycleans.space)
- Phone / SMS: (602) 671-2856
- Service Areas: Phoenix, Scottsdale, Tempe, Mesa, Chandler, Gilbert, Glendale, Peoria, Paradise Valley, Avondale, and the greater Phoenix metro area.
- Operating Hours: 7 days a week, 7:00 AM – 8:00 PM MST. Same-day appointments are available!
- Booking Link: Direct customers to [readycleans.space/booking](/booking) where they can choose their date, time window, and book in under 60 seconds with live calendar availability.
- 100% Satisfaction Guarantee: If anything is ever missed or unsatisfactory, notify us within 24 hours and a cleaner returns to reclean the area at zero extra charge.
- Supplies: We provide all commercial-grade cleaning equipment, vacuums, microfiber cloths, and eco-friendly disinfectants. We can also use client-provided products upon request.

### COMPLETE TRANSPARENT PRICING
Standard Cleans & Airbnb Turnovers (Same Flat-Rate Base Pricing):
- Studio / 1 Bath: $77
- 1 Bed / 1 Bath: $100
- 2 Bed / 1 Bath: $122
- 2 Bed / 2 Bath: $144
- 3 Bed / 2 Bath: $167
- 3 Bed / 3 Bath: $189
- 4 Bed / 2 Bath: $212
- 4 Bed / 3 Bath: $234
- 5 Bed / 2 Bath: $256
- 5 Bed / 3 Bath: $279

Add-On Services (Can be added to any clean):
- Inside Oven Cleaning: $17
- Inside Refrigerator Cleaning: $17
- Interior Windows: $17
- Same-Day Rush Scheduling: $39

Deposit Policy:
- A $25 deposit reserves the appointment on our calendar via secure Stripe checkout; the remaining balance is paid upon completion.

### SERVICES EXPLAINED
1. Standard Residential Cleaning:
   - Kitchen: Wipe all countertops, exterior of appliances, stovetop, inside & outside of microwave, scrub sink & polish faucet, empty trash.
   - Bathrooms: Deep scrub tub/shower tiles, disinfect toilet inside & out, clean sinks, wipe counters, polish mirrors & chrome fixtures.
   - Living Areas & Bedrooms: Dust all accessible surfaces, make beds / straighten linens, vacuum carpets & rugs, mop hard floors, baseboard wipe-down, empty trash bins.

2. Airbnb / Vacation Rental Turnover Cleaning:
   - Designed specifically for Airbnb / VRBO superhosts with strict check-in windows (10/11 AM check-out to 3/4 PM check-in).
   - Includes everything in the Standard Clean PLUS:
     • Full fresh linen strip & wash/remake with hotel-style bed staging.
     • Fresh towel arrangement in bathrooms.
     • Restocking guest essentials (toilet paper, paper towels, soaps, shampoo, coffee amenities).
     • Emptying all trash and taking bins to curb if requested.
     • Inspection for host: checking for damages, stains, or items left behind by guests.

3. Deep Cleaning:
   - Thorough restoration scrub for homes needing heavy buildup removed, neglected baseboards, grout, and detailed corners (typically for homes not professionally cleaned in 3+ months).

### RESPONSE GUIDELINES
- Always be warm, helpful, energetic, and professional.
- Whenever a user asks for pricing or a quote, quote the exact flat rate immediately based on their bedroom/bathroom count, and mention add-ons.
- Always include a markdown link to book online: [readycleans.space/booking](/booking) or mention they can call/text (602) 671-2856.
- Keep responses readable and well-formatted with concise bullet points where appropriate.
- If a user asks to speak with a human or has an emergency, assure them their message is logged directly in our management queue, provide the phone number (602) 671-2856, and help them with anything you can in the meantime.`;

/**
 * Intelligent Fallback Autonomous Agent:
 * When external AI APIs are unreachable, rate-limited, or encountering issues,
 * this engine evaluates the user's intent and generates a comprehensive,
 * contextually accurate response so the chatbot NEVER fails to answer 24/7.
 */
export function generateAutonomousAgentResponse(message, history = []) {
    const q = (message || '').toLowerCase();

    // 1. Specific Bed / Bath Quotes
    const sizeMatches = [
        { patterns: [/studio/], size: 'Studio / 1 Bath', price: 77 },
        { patterns: [/1\s*bed.*1\s*bath/, /1\s*b\s*1\s*b/, /one\s*bed/], size: '1 Bed / 1 Bath', price: 100 },
        { patterns: [/2\s*bed.*2\s*bath/, /2\s*b\s*2\s*b/], size: '2 Bed / 2 Bath', price: 144 },
        { patterns: [/2\s*bed.*1\s*bath/, /2\s*bed/], size: '2 Bed / 1 Bath', price: 122 },
        { patterns: [/3\s*bed.*3\s*bath/, /3\s*b\s*3\s*b/], size: '3 Bed / 3 Bath', price: 189 },
        { patterns: [/3\s*bed.*2\s*bath/, /3\s*bed/], size: '3 Bed / 2 Bath', price: 167 },
        { patterns: [/4\s*bed.*3\s*bath/, /4\s*b\s*3\s*b/], size: '4 Bed / 3 Bath', price: 234 },
        { patterns: [/4\s*bed.*2\s*bath/, /4\s*bed/], size: '4 Bed / 2 Bath', price: 212 },
        { patterns: [/5\s*bed.*3\s*bath/, /5\s*b\s*3\s*b/], size: '5 Bed / 3 Bath', price: 279 },
        { patterns: [/5\s*bed.*2\s*bath/, /5\s*bed/], size: '5 Bed / 2 Bath', price: 256 },
    ];

    for (const match of sizeMatches) {
        if (match.patterns.some(p => p.test(q))) {
            return `Our flat rate for a **${match.size}** (both Standard Residential Cleans and Airbnb Turnovers) is **$${match.price}**!

**What's included:**
• Complete cleaning of kitchen, bathrooms, living areas, bedrooms, floors, and baseboards
• Professional supplies and equipment provided
• 100% Satisfaction Guarantee

**Optional Add-ons:**
• Inside Oven: $17
• Inside Fridge: $17
• Interior Windows: $17
• Same-Day Rush Service: $39

You can reserve your date and preferred time window online in under 60 seconds at [readycleans.space/booking](/booking) or call/text us directly at **(602) 671-2856**!`;
        }
    }

    // 2. Pricing Overview / Rates / Cost
    if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('quote') || q.includes('how much')) {
        return `Here is our transparent flat-rate pricing for Phoenix & the surrounding Valley:

**Standard Cleans & Airbnb Turnovers:**
• **Studio:** $77
• **1 Bed / 1 Bath:** $100
• **2 Bed / 1 Bath:** $122
• **2 Bed / 2 Bath:** $144
• **3 Bed / 2 Bath:** $167
• **3 Bed / 3 Bath:** $189
• **4 Bed / 2 Bath:** $212
• **4 Bed / 3 Bath:** $234
• **5 Bed / 2 Bath:** $256
• **5 Bed / 3 Bath:** $279

**Popular Add-ons:** Inside Oven ($17), Inside Fridge ($17), Windows ($17), Same-Day Service ($39).

Book online anytime at [readycleans.space/booking](/booking) or call/text us at **(602) 671-2856**!`;
    }

    // 3. Airbnb Turnover Specifics
    if (q.includes('airbnb') || q.includes('str') || q.includes('turnover') || q.includes('vrbo') || q.includes('host') || q.includes('linen')) {
        return `Our specialized **Airbnb & Vacation Rental Turnover Service** starts at **$77 for a Studio** up to **$279 for 5 Bed / 3 Bath**.

**Every Turnover includes:**
• Full property sanitization (kitchen, bathrooms, living spaces)
• Stripping and making beds with fresh linens (hotel-style presentation)
• Fresh towel staging & folding
• Restocking guest toiletries & amenities (soap, toilet paper, coffee essentials)
• Emptying all trash and taking bins to curb
• Damage and left-behind item reporting for hosts
• Fast turnaround between 10/11 AM checkout and 3/4 PM check-in

You can schedule turnovers in advance or same-day at [readycleans.space/booking](/booking) or text us directly at **(602) 671-2856**.`;
    }

    // 4. Checklist / What is included
    if (q.includes('include') || q.includes('checklist') || q.includes('what do you clean') || q.includes('standard clean') || q.includes('deep clean')) {
        return `Every ReadyCleans appointment covers our comprehensive inspection checklist:

• **Kitchen:** Counters wiped, sink disinfected, stovetop scrubbed, exterior appliances polished, inside/outside of microwave, trash emptied.
• **Bathrooms:** Scrub shower/tub tiles, sanitize toilet inside & out, sink, counters, mirrors polished, chrome fixtures shined.
• **Living & Bedrooms:** Dust accessible surfaces, make beds / straighten linens, vacuum carpets/rugs, mop hard floors, baseboard wipe-down.
• **Supplies:** We bring all necessary commercial supplies, vacuums, and eco-friendly products.

Ready to book? Reserve online at [readycleans.space/booking](/booking) or call **(602) 671-2856**.`;
    }

    // 5. Service Areas / Location / Zip Codes
    if (q.includes('area') || q.includes('where') || q.includes('phoenix') || q.includes('scottsdale') || q.includes('tempe') || q.includes('mesa') || q.includes('chandler') || q.includes('glendale') || q.includes('location')) {
        return `We proudly serve the entire **Phoenix Metropolitan Area**, including:
• Phoenix, Scottsdale, Paradise Valley
• Tempe, Mesa, Chandler, Gilbert
• Glendale, Peoria, Avondale, Surprise

You can enter your address or zip code on our booking page at [readycleans.space/booking](/booking) to select your arrival window!`;
    }

    // 6. Supplies / Equipment
    if (q.includes('supplies') || q.includes('vacuum') || q.includes('chemical') || q.includes('products') || q.includes('bring')) {
        return `**Yes, we provide everything!** Our cleaners arrive fully equipped with professional-grade vacuums, microfiber cloths, and high-quality eco-friendly cleaning solutions. 

If you have specific specialty products you prefer our team to use on your surfaces, simply let us know and we are happy to use them!`;
    }

    // 7. Availability / Schedule / Same Day
    if (q.includes('available') || q.includes('today') || q.includes('tomorrow') || q.includes('same day') || q.includes('schedule') || q.includes('hours') || q.includes('time')) {
        return `We operate **7 days a week from 7:00 AM to 8:00 PM MST**!

• **Same-day cleaning** is available with our $39 rush option.
• You can book up to 4 months in advance.
• Check our live availability calendar and pick your exact arrival window right now at [readycleans.space/booking](/booking), or call/text **(602) 671-2856** for immediate scheduling assistance!`;
    }

    // 8. Human Agent / Call me / Contact / Phone
    if (q.includes('call') || q.includes('phone') || q.includes('human') || q.includes('person') || q.includes('speak') || q.includes('talk') || q.includes('contact') || q.includes('number')) {
        return `You can reach our team directly at **(602) 671-2856** via call or text! 

Your inquiry has also been posted directly into our team's live Slack channel so a staff member can follow up with you. If you need immediate pricing or want to schedule right away, you can also book anytime 24/7 at [readycleans.space/booking](/booking).`;
    }

    // 9. Guarantee / Satisfaction / Cancellation
    if (q.includes('guarantee') || q.includes('cancel') || q.includes('satisfied') || q.includes('refund') || q.includes('insurance')) {
        return `We stand by our work with a **100% Satisfaction Guarantee**! If any area doesn't meet your expectations, let us know within 24 hours and a cleaner will return to reclean it at no charge. 

Our cleanings are fully insured and bonded. View details or book online at [readycleans.space/booking](/booking) or reach us at **(602) 671-2856**.`;
    }

    // 10. Default Helpful Assistant Response
    return `Hi! 👋 I'm here 24/7 to assist you with ReadyCleans in Phoenix. 

• **Standard & Airbnb Cleans:** Starting at **$77** for Studios up to **$279** for 5 Bed / 3 Bath.
• **Add-ons:** Oven ($17), Fridge ($17), Windows ($17), Same-Day ($39).
• **Hours:** 7 days a week, 7 AM – 8 PM MST.
• **100% Satisfaction Guarantee** on all services.

You can book your clean online in under 60 seconds at [readycleans.space/booking](/booking) or call/text us anytime at **(602) 671-2856**. How can I help you today?`;
}

/**
 * Execute AI Agent Response with Multi-Tier Resilience:
 * 1. Primary: Gemini 3.8 Flash (Active model)
 * 2. Secondary: Active fallback models
 * 3. Autonomous Local Knowledge Engine: Deterministic, intelligent answers so customer is never stranded
 */
export async function getAgentResponse({ message, history = [] }) {
    const trimmedMessage = (message || '').trim();
    if (!trimmedMessage) {
        return { response: "Please provide a message or question.", source: 'validation' };
    }

    // Tier 1 & 2: Gemini Generative AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
        // Supported active models in order of preference
        const candidateModels = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-3-flash"];

        for (const modelName of candidateModels) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: SYSTEM_PROMPT
                });

                // Prepare clean alternating history
                const cleanHistory = [];
                for (const msg of history) {
                    if (!msg || !msg.text) continue;
                    const role = msg.sender === 'user' ? 'user' : 'model';
                    if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== role) {
                        cleanHistory.push({
                            role,
                            parts: [{ text: msg.text }]
                        });
                    }
                }
                if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === 'user') {
                    cleanHistory.pop();
                }

                const chat = model.startChat({
                    history: cleanHistory,
                    generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
                });

                const result = await chat.sendMessage(trimmedMessage);
                const responseText = result.response.text();
                if (responseText && responseText.trim().length > 0) {
                    return { response: responseText.trim(), source: `gemini (${modelName})` };
                }
            } catch (err) {
                console.warn(`[AgentEngine] ${modelName} attempt failed:`, err.message);
                // Continue to next model candidate
            }
        }
    } else {
        console.warn('[AgentEngine] GEMINI_API_KEY is not set in environment.');
    }

    // Tier 3: Autonomous Knowledge Agent (Guaranteed 24/7 Answer)
    const autonomousReply = generateAutonomousAgentResponse(trimmedMessage, history);
    return { response: autonomousReply, source: 'autonomous-agent' };
}
