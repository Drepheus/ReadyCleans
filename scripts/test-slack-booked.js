import 'dotenv/config';

const GOOGLE_SHEETS_URL = 'https://sheetdb.io/api/v1/nonxdgios85e1';

async function runTest() {
    console.log('--- READYCLEANS SLACK BOOKING TEST ---');

    // 1. Fetch latest booking from SheetDB
    let booking = null;
    try {
        console.log(`Fetching latest booking from SheetDB (${GOOGLE_SHEETS_URL})...`);
        const res = await fetch(GOOGLE_SHEETS_URL);
        if (res.ok) {
            const bookings = await res.json();
            if (Array.isArray(bookings) && bookings.length > 0) {
                // Find Andrea or take the last booking
                const andreaBooking = bookings.find(b => b.Name && b.Name.toLowerCase().includes('andrea'));
                booking = andreaBooking || bookings[bookings.length - 1];
                console.log(`Found booking in database for: ${booking.Name}`);
            }
        }
    } catch (err) {
        console.warn('Could not fetch from SheetDB, using cached Andrea booking details:', err.message);
    }

    if (!booking) {
        booking = {
            Timestamp: '10/8/2026, 10:40:36 AM',
            Status: 'Pending Deposit',
            Name: 'Andrea Carper',
            Email: 'annielcarper@gmail.com',
            Phone: '6784512153',
            Address: '2332 N 7th st  apt 415, Phoenix 85006',
            Service: 'airbnb',
            Unit: '1bed1bath',
            Addons: '',
            Date: 'Sat Oct 10 2026 12:00:00 GMT-0700 (Mountain Standard Time)',
            Time: '8:00 AM - 11:00 AM',
            Total: 89
        };
    }

    // Format fields
    const dateFormatted = booking.Date
        ? new Date(booking.Date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        : 'Saturday, Oct 10, 2026';
    const unitFormatted = (booking.Unit || '1bed1bath')
        .replace(/(\d+)bed(\d+)bath/, '$1 Bed / $2 Bath')
        .replace('studio', 'Studio / 1 Bath');
    const serviceFormatted = (booking.Service || 'airbnb') === 'airbnb' ? 'Airbnb Turnover' : 'Standard Cleaning';
    const addonsFormatted = booking.Addons && booking.Addons.trim().length > 0
        ? booking.Addons.split(',').map(s => s.trim()).filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
        : 'None';
    
    const total = Number(booking.Total) || 89;
    const deposit = 50;
    const remaining = total - deposit;

    // Phone format: (XXX) XXX-XXXX if 10 digits
    const rawPhone = String(booking.Phone || '').replace(/\D/g, '');
    const phoneFormatted = rawPhone.length === 10
        ? `(${rawPhone.slice(0, 3)}) ${rawPhone.slice(3, 6)}-${rawPhone.slice(6)}`
        : booking.Phone;

    const slackMessage = [
        `🎉 *NEW BOOKING CONFIRMED — DEPOSIT COMPLETED* 🎉`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `👤 *Customer:* ${booking.Name}`,
        `📞 *Phone:* ${phoneFormatted}`,
        `✉️ *Email:* ${booking.Email}`,
        ``,
        `📍 *Address:* ${booking.Address}`,
        `🗓️ *Date:* ${dateFormatted}`,
        `⏰ *Time:* ${booking.Time}`,
        ``,
        `🧹 *Service:* ${serviceFormatted}`,
        `🏠 *Unit Size:* ${unitFormatted}`,
        `✨ *Add-ons:* ${addonsFormatted}`,
        ``,
        `💰 *Total Value:* $${total}.00`,
        `💳 *Deposit Paid / Due:* $${deposit}.00`,
        `💵 *Remaining Due at Clean:* $${remaining}.00`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `✅ *Status:* Confirmed (Deposit Step Completed)`
    ].join('\n');

    console.log('\n--- SLACK MESSAGE PAYLOAD ---');
    console.log(slackMessage);
    console.log('-----------------------------\n');

    const targetChannel = '#booked';
    const webhookUrl = process.env.SLACK_BOOKED_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL_BOOKED || process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error('ERROR: No SLACK_WEBHOOK_URL or SLACK_BOOKED_WEBHOOK_URL found in environment variables.');
        process.exit(1);
    }

    console.log(`Sending to Slack (Channel: ${targetChannel})...`);
    console.log(`Webhook URL in use: ${webhookUrl.slice(0, 35)}...`);

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                channel: targetChannel,
                text: slackMessage
            })
        });

        const respText = await response.text();
        if (response.ok) {
            console.log(`SUCCESS! Slack returned status ${response.status}: "${respText}"`);
        } else {
            console.error(`Slack returned error status ${response.status}: "${respText}"`);
        }
    } catch (e) {
        console.error('Failed to send to Slack:', e);
    }
}

runTest();
