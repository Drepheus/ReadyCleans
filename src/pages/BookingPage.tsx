import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ArrowLeft, Check, Loader2, X, Sparkles, Home } from 'lucide-react';
import { type ServiceType, type UnitSize, type AddOnType, PRICING } from '../types';
import { isValidZipCode } from '../utils/validation';

// Step Components
const LocationStep = () => {
    const { state, updateState, nextStep } = useBooking();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (state.city && state.zip && state.contact.phone) {
            if (isValidZipCode(state.zip)) {
                try {
                    await fetch('/api/notify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            text: `*New Booking Started*\n*Address:* ${state.address}, ${state.city} ${state.zip}\n*Phone:* ${state.contact.phone}`
                        })
                    });
                } catch (err) {
                    console.error("Failed to send notification", err);
                }
                nextStep();
            } else {
                setError('Sorry, we are currently only serving the Phoenix Metro area.');
            }
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Where do you need cleaning?</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Street Address"
                    value={state.address}
                    onChange={(e) => updateState({ address: e.target.value })}
                    placeholder="123 Main St"
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-400">City</label>
                        <select
                            value={state.city}
                            onChange={(e) => updateState({ city: e.target.value })}
                            className="w-full h-12 px-4 rounded-lg bg-[#18181b] border border-[#3f3f46] text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all appearance-none"
                            required
                        >
                            <option value="" disabled>Select City</option>
                            {['Phoenix', 'Scottsdale', 'Mesa', 'Chandler', 'Gilbert', 'Glendale', 'Tempe', 'Peoria', 'Surprise', 'Avondale', 'Goodyear', 'Buckeye', 'Queen Creek'].map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Zip Code"
                        value={state.zip}
                        onChange={(e) => {
                            updateState({ zip: e.target.value });
                            setError('');
                        }}
                        placeholder="85001"
                        required
                    />
                </div>

                <Input
                    label="Phone Number"
                    type="tel"
                    value={state.contact.phone}
                    onChange={(e) => updateState({ contact: { ...state.contact, phone: e.target.value } })}
                    placeholder="(555) 555-5555"
                    required
                />

                {error && (
                    <p className="text-sm text-red-500 font-medium animate-pulse">
                        {error}
                    </p>
                )}

                <Button type="submit" fullWidth variant="accent" disabled={!state.zip || !state.city || !state.address || !state.contact.phone}>
                    Continue
                </Button>
            </form>
        </div>
    );
};

const ServiceStep = () => {
    const { state, updateState, nextStep } = useBooking();

    const services: { id: ServiceType; label: string; description: string; icon: any }[] = [
        {
            id: 'standard',
            label: 'Standard Cleaning',
            description: 'High-quality residential cleaning for your home or apartment. Kitchen, bathrooms, floors, and dusting.',
            icon: Home
        },
        {
            id: 'airbnb',
            label: 'Airbnb Turnover',
            description: 'Between guest stays. Includes making unit guest-ready + standard inspection-ready clean.',
            icon: Sparkles
        },
    ];

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Select Service Type</h2>
                <p className="text-gray-400">What kind of cleaning do you need?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                    <Card
                        key={service.id}
                        hover
                        selected={state.serviceType === service.id}
                        onClick={() => updateState({ serviceType: service.id })}
                        className="flex flex-col items-start gap-4 p-6 cursor-pointer"
                    >
                        <div className={`p-3 rounded-full transition-colors ${state.serviceType === service.id ? 'bg-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-[#27272a] text-gray-500 group-hover:text-gray-300'}`}>
                            <service.icon size={24} />
                        </div>
                        <div>
                            <h3 className={`font-bold text-lg mb-2 ${state.serviceType === service.id ? 'text-white' : 'text-gray-200'}`}>
                                {service.label}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            <Button
                fullWidth
                variant="accent"
                onClick={nextStep}
            >
                Continue
            </Button>
        </div>
    );
};

const SizeStep = () => {
    const { state, updateState, nextStep } = useBooking();

    const sizes: { id: UnitSize; label: string }[] = [
        { id: 'studio', label: 'Studio / 1 Bath' },
        { id: '1bed1bath', label: '1 Bed / 1 Bath' },
        { id: '2bed1bath', label: '2 Bed / 1 Bath' },
        { id: '2bed2bath', label: '2 Bed / 2 Bath' },
        { id: '3bed2bath', label: '3 Bed / 2 Bath' },
        { id: '3bed3bath', label: '3 Bed / 3 Bath' },
        { id: '4bed2bath', label: '4 Bed / 2 Bath' },
        { id: '4bed3bath', label: '4 Bed / 3 Bath' },
        { id: '5bed2bath', label: '5 Bed / 2 Bath' },
        { id: '5bed3bath', label: '5 Bed / 3 Bath' },
    ];

    const handleNext = async () => {
        try {
            await fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: `*Unit Size Selected*\n*Size:* ${state.unitSize.replace(/(\d)bed(\d)bath/, '$1 Bd / $2 Ba').replace('studio', 'Studio')}\n*Phone:* ${state.contact.phone}`
                })
            });
        } catch (err) {
            console.error("Failed to send notification", err);
        }
        nextStep();
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Unit Size</h2>
                <p className="text-gray-400">Select the size of your property</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {sizes.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => updateState({ unitSize: s.id })}
                        className={`py-4 px-6 border rounded-xl text-left transition-all duration-300 relative overflow-hidden group flex justify-between items-center ${state.unitSize === s.id
                            ? 'border-transparent text-white'
                            : 'border-[#27272a] bg-[#18181b] hover:bg-[#202023] hover:border-[#3f3f46] text-gray-400'
                            }`}
                    >
                        {state.unitSize === s.id && (
                            <>
                                <div className="absolute inset-[-50%] -z-10 animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#10b981_50%,#00000000_100%)] opacity-100" />
                                <div className="absolute inset-[1px] bg-[#18181b] rounded-[11px] -z-10" />
                                <div className="absolute inset-0 bg-emerald-500/5 -z-10" />
                            </>
                        )}
                        <span className="font-medium text-lg relative z-10">{s.label}</span>
                        <span className="font-bold relative z-10 text-white">
                            ${PRICING[state.serviceType][s.id]}
                        </span>
                    </button>
                ))}
            </div>

            <Button fullWidth variant="accent" onClick={handleNext}>Continue</Button>
        </div>
    );
};

const AddOnStep = () => {
    const { state, updateState, nextStep } = useBooking();

    const addons: { id: AddOnType; label: string; price: number }[] = [
        { id: 'oven', label: 'Inside Oven', price: PRICING.addons.oven },
        { id: 'fridge', label: 'Inside Fridge', price: PRICING.addons.fridge },
        { id: 'windows', label: 'Interior Windows', price: PRICING.addons.windows },
        { id: 'same-day', label: 'Same-day Service', price: PRICING.addons['same-day'] },
    ];

    const toggleAddOn = (id: AddOnType) => {
        const current = state.addOns;
        const updated = current.includes(id)
            ? current.filter(item => item !== id)
            : [...current, id];
        updateState({ addOns: updated });
    };

    // Safely calculate basePrice ensuring PRICING keys exist
    const basePrice = PRICING[state.serviceType]?.[state.unitSize] || 0;
    const addOnsPrice = state.addOns.reduce((acc, curr) => acc + (PRICING.addons[curr] || 0), 0);
    const total = basePrice + addOnsPrice;

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Optional Add-Ons</h2>
                <p className="text-gray-400">Need a little extra?</p>
            </div>

            <div className="space-y-3">
                {addons.map((addon) => (
                    <button
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`w-full p-4 border rounded-xl flex justify-between items-center transition-all duration-300 relative overflow-hidden group ${state.addOns.includes(addon.id)
                            ? 'border-transparent text-white'
                            : 'border-[#27272a] bg-[#18181b] hover:bg-[#202023] hover:border-[#3f3f46] text-gray-400'
                            }`}
                    >
                        {state.addOns.includes(addon.id) && (
                            <>
                                <div className="absolute inset-[-50%] -z-10 animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#10b981_50%,#00000000_100%)] opacity-100" />
                                <div className="absolute inset-[1px] bg-[#18181b] rounded-[11px] -z-10" />
                                <div className="absolute inset-0 bg-emerald-500/5 -z-10" />
                            </>
                        )}
                        <div className="flex items-center gap-3 relative z-10">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${state.addOns.includes(addon.id) ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                                {state.addOns.includes(addon.id) && <Check size={14} className="text-white" />}
                            </div>
                            <span className="font-medium">{addon.label}</span>
                        </div>
                        <span className="text-sm font-semibold relative z-10 text-gray-400">+${addon.price}</span>
                    </button>
                ))}
            </div>

            <div className="bg-[#18181b] p-4 rounded-xl border border-[#333]">
                <div className="flex justify-between items-center text-gray-400 mb-2">
                    <span>Base Price ({state.unitSize.replace(/(\d)bed(\d)bath/, '$1 Bd / $2 Ba').replace('studio', 'Studio')})</span>
                    <span>${basePrice}</span>
                </div>
                {state.addOns.length > 0 && (
                    <div className="flex justify-between items-center text-gray-400 mb-2">
                        <span>Add-Ons</span>
                        <span>+${addOnsPrice}</span>
                    </div>
                )}
                <div className="h-px bg-[#333] my-2"></div>
                <div className="flex justify-between items-center text-white font-bold text-lg">
                    <span>Total</span>
                    <span>${total}</span>
                </div>
            </div>

            <Button fullWidth variant="accent" onClick={nextStep}>Confirm & Schedule</Button>
        </div>
    );
};

const ScheduleStep = () => {
    const { updateState, nextStep } = useBooking();

    // Generate relative dates
    const dates = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const datesArr = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i <= 6; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            datesArr.push({
                label: i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : days[d.getDay()]),
                date: `${months[d.getMonth()]} ${d.getDate()}`,
                full: d.toISOString(),
                blocked: false // Removed random block
            });
        }
        return datesArr;
    }, []);

    const times = ['8:00 AM - 11:00 AM', '11:00 AM - 2:00 PM', '2:00 PM - 5:00 PM'];
    const [selectedDate, setSelectedDate] = useState<string>(dates[0].full);
    const [selectedTime, setSelectedTime] = useState(times[0]);

    const handleNext = () => {
        updateState({
            date: new Date(selectedDate),
            time: selectedTime
        });
        nextStep();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Select Date & Time</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Available Days</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {dates.slice(0, 6).map((d: any) => (
                            <button
                                key={d.full}
                                disabled={d.blocked}
                                onClick={() => !d.blocked && setSelectedDate(d.full)}
                                className={`p-3 border rounded-xl text-sm font-medium transition-all duration-300 flex flex-col items-center justify-center gap-1 relative overflow-hidden group ${selectedDate === d.full
                                    ? 'border-transparent text-white'
                                    : d.blocked
                                        ? 'border-[#222] bg-[#121212] text-gray-700 cursor-not-allowed opacity-40'
                                        : 'border-[#27272a] bg-[#18181b] text-gray-400 hover:border-[#3f3f46] hover:bg-[#202023]'
                                    }`}
                            >
                                {selectedDate === d.full && (
                                    <>
                                        <div className="absolute inset-0 rounded-xl border-2 border-emerald-500 z-0" />
                                        <div className="absolute inset-[1px] bg-emerald-600 rounded-[11px] -z-10" />
                                    </>
                                )}
                                {selectedDate === d.full && (
                                    <div className="absolute top-1 right-1 bg-white text-green-600 rounded-full p-0.5 z-20">
                                        <Check size={8} strokeWidth={4} />
                                    </div>
                                )}
                                <span className={`${selectedDate === d.full ? 'font-bold text-white' : ''} relative z-10`}>{d.label}</span>
                                <span className={`text-xs ${selectedDate === d.full ? 'text-white/90' : 'opacity-60'} relative z-10`}>{d.date}</span>
                                {d.blocked && <span className="text-[10px] text-red-900 font-bold uppercase mt-1 relative z-10">Booked</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Time Window</h3>
                    <div className="flex flex-col gap-2">
                        {times.map((t) => (
                            <button
                                key={t}
                                onClick={() => setSelectedTime(t)}
                                className={`p-4 border rounded-xl text-left flex justify-between items-center group transition-all duration-300 relative overflow-hidden ${selectedTime === t
                                    ? 'border-transparent text-white'
                                    : 'border-[#27272a] bg-[#18181b] text-gray-400 hover:bg-[#202023] hover:border-[#3f3f46]'
                                    }`}
                            >
                                {selectedTime === t && (
                                    <>
                                        <div className="absolute inset-0 rounded-xl border-2 border-emerald-500 z-0" />
                                        <div className="absolute inset-[1px] bg-emerald-600 rounded-[11px] -z-10" />
                                    </>
                                )}
                                <span className="relative z-10">{t}</span>
                                <div className={`w-4 h-4 rounded-full border relative z-10 ${selectedTime === t ? 'border-green-500 bg-green-500' : 'border-gray-500'}`}></div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Button fullWidth variant="accent" onClick={handleNext}>Proceed to Payment</Button>
        </div>
    );
};

const ContactStep = () => {
    const { state, updateState, nextStep } = useBooking();

    const handleChange = (field: keyof typeof state.contact, value: string) => {
        updateState({
            contact: {
                ...state.contact,
                [field]: value
            }
        });
    };

    const handleNext = async () => {
        try {
            await fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: `*Booking Progress - Step 6 Completed*\n*Name:* ${state.contact.firstName} ${state.contact.lastName}\n*Email:* ${state.contact.email}\n*Phone:* ${state.contact.phone}\n*Date:* ${state.date?.toLocaleDateString()} at ${state.time}`
                })
            });
        } catch (err) {
            console.error("Failed to send notification", err);
        }
        nextStep();
    };

    const isValid = state.contact.firstName && state.contact.lastName && state.contact.email && state.contact.phone;

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Contact Details</h2>
                <p className="text-gray-400">Where should we send your receipt?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="First Name"
                    value={state.contact.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="Jane"
                    required
                />
                <Input
                    label="Last Name"
                    value={state.contact.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Doe"
                    required
                />
            </div>

            <Input
                label="Email Address"
                type="email"
                value={state.contact.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="jane@example.com"
                required
            />

            <Input
                label="Phone Number"
                type="tel"
                value={state.contact.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(555) 555-5555"
                required
            />

            <Button fullWidth variant="accent" disabled={!isValid} onClick={handleNext}>
                Continue to Payment
            </Button>
        </div>
    );
};

const CheckoutStep = () => {
    const { state } = useBooking();
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Price Calculations
    const basePrice = PRICING[state.serviceType]?.[state.unitSize] || 0;
    const addOnsPrice = state.addOns.reduce((acc, curr) => acc + (PRICING.addons[curr] || 0), 0);
    const total = basePrice + addOnsPrice;
    const DEPOSIT_AMOUNT = 50;
    const remaining = total - DEPOSIT_AMOUNT;

    useEffect(() => {
        const notifyPaywall = async () => {
            try {
                await fetch('/api/notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: `*Customer Reached Paywall*\n*Phone:* ${state.contact.phone}\n*Total Value:* $${total}.00\n*Deposit Due:* $${DEPOSIT_AMOUNT}.00`
                    })
                });
            } catch (err) {
                console.error("Failed to send paywall notification", err);
            }
        };
        notifyPaywall();
    }, []); // Run once when component mounts

    // Configuration
    const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/dRm6oH2XPaJN82N0HSdfG0h';
    // PASTE YOUR GOOGLE SHEETS WEB APP URL HERE
    const GOOGLE_SHEETS_URL = 'https://sheetdb.io/api/v1/nonxdgios85e1';

    const handlePayment = async () => {
        if (!termsAccepted || isSubmitting) return;
        setIsSubmitting(true);

        // 1. Submit to Google Sheets (SheetDB)
        if (GOOGLE_SHEETS_URL) {
            try {
                // Flatten data for the spreadsheet
                const sheetData = {
                    Timestamp: new Date().toLocaleString(),
                    Status: 'Pending Deposit',
                    Name: `${state.contact.firstName} ${state.contact.lastName}`,
                    Email: state.contact.email,
                    Phone: state.contact.phone,
                    Address: `${state.address}, ${state.city} ${state.zip}`,
                    Service: state.serviceType,
                    Unit: state.unitSize,
                    Addons: state.addOns.join(', '),
                    Date: state.date?.toString(),
                    Time: state.time,
                    Total: total
                };

                await fetch(GOOGLE_SHEETS_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sheetData)
                });
            } catch (error) {
                console.error("Booking save failed", error);
            }
        }

        // 2. Redirect to Stripe
        const bookingRef = `${state.serviceType}_${state.unitSize}_${state.addOns.length}Addons`;
        const params = new URLSearchParams({
            prefilled_email: state.contact.email,
            client_reference_id: bookingRef.substring(0, 200)
        });

        window.location.href = `${STRIPE_PAYMENT_LINK}?${params.toString()}`;
    };

    return (
        <div className="space-y-6">
            <div className="text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/20 blur-[50px] rounded-full pointer-events-none"></div>

                <div className="w-20 h-20 bg-[#18181b] rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border border-green-500/30 relative z-10 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <Loader2 size={40} className="animate-spin text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Secure Booking</h2>
                <p className="text-gray-400 text-lg">Final step to confirm your cleaning.</p>
            </div>

            <div className="bg-[#18181b] border border-[#333] p-6 rounded-xl space-y-4 shadow-lg">
                <div className="flex justify-between">
                    <span className="text-gray-400">Service</span>
                    <span className="font-semibold text-white capitalize">{state.serviceType === 'standard' ? 'Standard Clean' : 'Airbnb Turnover'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Unit Size</span>
                    <span className="font-semibold text-white capitalize">{state.unitSize.replace(/(\d)bed(\d)bath/, '$1 Bd / $2 Ba').replace('studio', 'Studio')}</span>
                </div>
                {state.addOns.length > 0 && (
                    <div className="flex justify-between flex-wrap gap-2 text-right">
                        <span className="text-gray-400">Add-ons</span>
                        <span className="font-semibold text-white text-sm">
                            {state.addOns.map(a => a.replace('-', ' ')).join(', ')}
                        </span>
                    </div>
                )}

                <div className="h-px bg-[#333]"></div>

                <div className="flex justify-between items-center text-gray-400 text-sm">
                    <span>Total Service Value</span>
                    <span>${total}.00</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 text-sm">
                    <span>Due After Service</span>
                    <span>${remaining}.00</span>
                </div>


                <div className="h-px bg-[#333]"></div>

                <div className="flex justify-between items-end">
                    <span className="text-white font-medium">Deposit Due Now</span>
                    <div className="text-right">
                        <span className="block text-2xl font-bold text-green-500">${DEPOSIT_AMOUNT}.00</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">To Secure Spot</span>
                    </div>
                </div>
            </div>



            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-[#18181b] rounded-xl border border-[#333]">
                <div className="relative flex items-center">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-500 bg-[#27272a] checked:border-green-500 checked:bg-green-500 transition-all"
                    />
                    <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <div className="text-sm text-gray-400">
                    I agree to the <a href="/terms" target="_blank" className="text-green-500 cursor-pointer hover:underline">Terms of Service</a>. I understand the <strong>${DEPOSIT_AMOUNT} deposit</strong> is non-refundable if cancelled less than 24 hours before the appointment.
                </div>
            </div>

            <button
                onClick={handlePayment}
                disabled={!termsAccepted || isSubmitting}
                className={`w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-5 text-lg transition-all transform hover:scale-[1.01] shadow-[0_0_30px_rgba(22,163,74,0.4)] ring-1 ring-white/10 ${(!termsAccepted || isSubmitting) ? 'opacity-50 cursor-not-allowed filter grayscale' : 'hover:from-green-500 hover:to-emerald-500'}`}
            >
                <div className={`absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] transition-transform duration-1000 ${termsAccepted && !isSubmitting ? 'group-hover:translate-x-[100%]' : ''}`}></div>
                {isSubmitting ? 'Processing...' : `Pay $${DEPOSIT_AMOUNT}.00 Deposit`}
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> AES-256 Encryption</span>
                <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> Satisfaction Guaranteed</span>
            </div>
        </div>
    );
};

import { ConfirmationModal } from '../components/ui/ConfirmationModal';

export const BookingPage = () => {
    const { currentStep, prevStep } = useBooking();
    const [showExitConfirm, setShowExitConfirm] = useState(false);


    const steps = [
        { title: 'Location', component: LocationStep },
        { title: 'Service', component: ServiceStep },
        { title: 'Size', component: SizeStep },
        { title: 'Add-Ons', component: AddOnStep },
        { title: 'Schedule', component: ScheduleStep },
        { title: 'Contact', component: ContactStep },
        { title: 'Checkout', component: CheckoutStep },
    ];

    const CurrentComponent = steps[currentStep].component;

    const progress = ((currentStep + 1) / steps.length) * 100;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentStep]);

    return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center py-12 px-4">
            <div className="max-w-xl w-full">
                {/* Header / Progress */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            {currentStep > 0 ? (
                                <button onClick={prevStep} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors">
                                    <ArrowLeft size={16} /> Back
                                </button>
                            ) : (
                                <button onClick={() => window.history.back()} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors">
                                    <ArrowLeft size={16} /> Home
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-xs font-semibold text-gray-500 tracking-wider">
                                STEP {currentStep + 1} OF {steps.length}
                            </span>
                            <button
                                onClick={() => setShowExitConfirm(true)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Cancel Booking"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="h-1 bg-[#27272a] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-green-600 to-green-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Content */}
                <Card variant="default" className="shadow-2xl border-[#333]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <CurrentComponent />
                        </motion.div>
                    </AnimatePresence>
                </Card>
                <ConfirmationModal
                    isOpen={showExitConfirm}
                    onClose={() => setShowExitConfirm(false)}
                    onConfirm={() => {
                        window.location.href = '/';
                    }}
                    title="Cancel Booking?"
                    description="Are you sure you want to leave? All your progress will be lost and you'll have to start over."
                    confirmText="Yes, Cancel"
                    cancelText="Keep Booking"
                />
            </div>
        </div>
    );
};
