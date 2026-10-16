import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ArrowLeft, Check, Loader2, X, Sparkles, Home, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
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
    const { state, updateState, nextStep } = useBooking();

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    // Expand bookable dates to 4 months in advance
    const maxDate = useMemo(() => {
        const d = new Date(today.getFullYear(), today.getMonth() + 5, 0);
        d.setHours(23, 59, 59, 999);
        return d;
    }, [today]);

    // Initial selected date (from state if already chosen and valid, otherwise today)
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        if (state.date) {
            const saved = new Date(state.date);
            if (!isNaN(saved.getTime()) && saved >= today && saved <= maxDate) {
                return saved;
            }
        }
        return new Date(today);
    });

    // Month currently being viewed in the calendar
    const [viewDate, setViewDate] = useState<Date>(() => {
        return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    });

    const timeWindows = useMemo(() => [
        { 
            id: 'morning', 
            label: '8:00 AM - 11:00 AM', 
            name: 'Morning Window', 
            specificSlots: ['8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM'] 
        },
        { 
            id: 'midday', 
            label: '11:00 AM - 2:00 PM', 
            name: 'Midday Window', 
            specificSlots: ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM'] 
        },
        { 
            id: 'afternoon', 
            label: '2:00 PM - 5:00 PM', 
            name: 'Afternoon Window', 
            specificSlots: ['2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'] 
        },
    ], []);

    const initialIsSpecific = useMemo(() => {
        if (!state.time) return false;
        return !timeWindows.some(w => w.label === state.time);
    }, [state.time, timeWindows]);

    const [selectedWindow, setSelectedWindow] = useState<string>(() => {
        if (state.time) {
            const matched = timeWindows.find(w => 
                w.label === state.time || 
                w.specificSlots.some(s => state.time.includes(s))
            );
            if (matched) return matched.label;
        }
        return timeWindows[0].label;
    });

    const [isSpecificTime, setIsSpecificTime] = useState<boolean>(initialIsSpecific);
    const [specificTime, setSpecificTime] = useState<string>(() => {
        if (state.time && initialIsSpecific) {
            return state.time.replace(' (Exact Time)', '');
        }
        return '9:00 AM';
    });

    const handleSelectWindow = (windowLabel: string) => {
        setSelectedWindow(windowLabel);
        const win = timeWindows.find(w => w.label === windowLabel);
        if (win && win.specificSlots.length > 2) {
            setSpecificTime(win.specificSlots[2]);
        }
    };

    const currentWindow = timeWindows.find(w => w.label === selectedWindow) || timeWindows[0];

    const effectiveTime = isSpecificTime 
        ? `${specificTime} (Exact Time)` 
        : selectedWindow;

    // Quick selection options for convenience
    const quickOptions = useMemo(() => {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const inOneWeek = new Date(today);
        inOneWeek.setDate(today.getDate() + 7);

        return [
            { label: 'Today', date: today },
            { label: 'Tomorrow', date: tomorrow },
            { label: 'In 1 Week', date: inOneWeek },
        ];
    }, [today]);

    const isSameDay = (d1: Date, d2: Date) => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    const minMonthDate = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today]);
    const maxMonthDate = useMemo(() => new Date(today.getFullYear(), today.getMonth() + 4, 1), [today]);

    const canGoPrev = viewDate.getTime() > minMonthDate.getTime();
    const canGoNext = viewDate.getTime() < maxMonthDate.getTime();

    const handlePrevMonth = () => {
        if (canGoPrev) {
            setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
        }
    };

    const handleNextMonth = () => {
        if (canGoNext) {
            setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
        }
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthTitle = `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

    const calendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        const daysList: {
            dayNum: number | null;
            date: Date | null;
            isSelectable: boolean;
            isToday: boolean;
            key: string;
        }[] = [];

        // Empty padding slots
        for (let i = 0; i < firstDayIndex; i++) {
            daysList.push({
                dayNum: null,
                date: null,
                isSelectable: false,
                isToday: false,
                key: `pad-${i}`
            });
        }

        // Real days of month
        for (let d = 1; d <= totalDays; d++) {
            const current = new Date(year, month, d);
            current.setHours(0, 0, 0, 0);

            const isToday = isSameDay(current, today);
            const isPast = current.getTime() < today.getTime();
            const isBeyondMax = current.getTime() > maxDate.getTime();
            const isSelectable = !isPast && !isBeyondMax;

            daysList.push({
                dayNum: d,
                date: current,
                isSelectable,
                isToday,
                key: `day-${year}-${month}-${d}`
            });
        }

        return daysList;
    }, [viewDate, today, maxDate]);

    const handleSelectDate = (d: Date) => {
        setSelectedDate(d);
        if (d.getMonth() !== viewDate.getMonth() || d.getFullYear() !== viewDate.getFullYear()) {
            setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
        }
    };

    const handleNext = () => {
        const appointmentDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            12, 0, 0
        );
        updateState({
            date: appointmentDate,
            time: effectiveTime
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
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase">Available Dates</h3>
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                            Booking open 3+ months out
                        </span>
                    </div>

                    {/* Quick Selection Shortcuts */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {quickOptions.map((opt) => {
                            const active = isSameDay(opt.date, selectedDate);
                            return (
                                <button
                                    key={opt.label}
                                    type="button"
                                    onClick={() => handleSelectDate(opt.date)}
                                    className={`py-2 px-3 border rounded-xl text-xs font-medium transition-all duration-200 flex flex-col items-center justify-center gap-0.5 ${
                                        active
                                            ? 'border-emerald-500 bg-emerald-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                            : 'border-[#27272a] bg-[#18181b] text-gray-400 hover:border-[#3f3f46] hover:bg-[#202023] hover:text-white'
                                    }`}
                                >
                                    <span>{opt.label}</span>
                                    <span className={`text-[10px] ${active ? 'text-white/90' : 'opacity-60'}`}>
                                        {opt.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Interactive Calendar Container */}
                    <div className="p-4 rounded-xl border border-[#27272a] bg-[#141416]">
                        {/* Month Navigation Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-emerald-500" />
                                <span className="font-bold text-white text-base">
                                    {monthTitle}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    disabled={!canGoPrev}
                                    onClick={handlePrevMonth}
                                    className={`p-2 rounded-lg border border-[#27272a] transition-all ${
                                        canGoPrev
                                            ? 'text-gray-300 hover:text-white hover:bg-[#202023] hover:border-[#3f3f46]'
                                            : 'text-gray-600 opacity-25 cursor-not-allowed border-transparent'
                                    }`}
                                    aria-label="Previous Month"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    type="button"
                                    disabled={!canGoNext}
                                    onClick={handleNextMonth}
                                    className={`p-2 rounded-lg border border-[#27272a] transition-all ${
                                        canGoNext
                                            ? 'text-gray-300 hover:text-white hover:bg-[#202023] hover:border-[#3f3f46]'
                                            : 'text-gray-600 opacity-25 cursor-not-allowed border-transparent'
                                    }`}
                                    aria-label="Next Month"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Weekday Labels */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dw) => (
                                <div key={dw} className="text-xs font-semibold text-gray-500 py-1">
                                    {dw}
                                </div>
                            ))}
                        </div>

                        {/* Day Cells Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {calendarDays.map((cell) => {
                                if (!cell.date) {
                                    return <div key={cell.key} className="h-10 w-full" />;
                                }

                                const selected = isSameDay(cell.date, selectedDate);

                                return (
                                    <button
                                        key={cell.key}
                                        type="button"
                                        disabled={!cell.isSelectable}
                                        onClick={() => cell.date && handleSelectDate(cell.date)}
                                        className={`h-10 w-full rounded-lg text-sm font-medium transition-all duration-150 relative flex flex-col items-center justify-center ${
                                            selected
                                                ? 'bg-emerald-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.35)] ring-2 ring-emerald-400'
                                                : cell.isSelectable
                                                ? 'border border-[#27272a] bg-[#18181b] text-gray-300 hover:border-emerald-500/50 hover:bg-[#202023] hover:text-white'
                                                : 'text-gray-600 bg-transparent cursor-not-allowed opacity-25'
                                        }`}
                                    >
                                        <span>{cell.dayNum}</span>
                                        {cell.isToday && !selected && (
                                            <span className="w-1 h-1 rounded-full bg-emerald-400 absolute bottom-1" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selected Date Confirmation Banner */}
                    <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-[#18181b] border border-[#27272a]">
                        <div className="flex items-center gap-2">
                            <Check size={16} className="text-emerald-500" />
                            <span className="text-xs text-gray-400">Chosen Date:</span>
                            <span className="text-sm font-semibold text-white">
                                {selectedDate.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                        <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            {effectiveTime}
                        </span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase">1. Arrival Window</h3>
                        <span className="text-[11px] text-gray-500">Standard 3-hour arrival window</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        {timeWindows.map((tw) => {
                            const isSelected = selectedWindow === tw.label;
                            return (
                                <button
                                    key={tw.id}
                                    type="button"
                                    onClick={() => handleSelectWindow(tw.label)}
                                    className={`p-4 border rounded-xl text-left flex justify-between items-center group transition-all duration-300 relative overflow-hidden ${
                                        isSelected
                                            ? 'border-transparent text-white'
                                            : 'border-[#27272a] bg-[#18181b] text-gray-400 hover:bg-[#202023] hover:border-[#3f3f46]'
                                    }`}
                                >
                                    {isSelected && (
                                        <>
                                            <div className="absolute inset-0 rounded-xl border-2 border-emerald-500 z-0" />
                                            <div className="absolute inset-[1px] bg-emerald-600 rounded-[11px] -z-10" />
                                        </>
                                    )}
                                    <div className="flex flex-col relative z-10">
                                        <span className="font-semibold text-white">{tw.label}</span>
                                        <span className={`text-xs ${isSelected ? 'text-white/85' : 'text-gray-500'}`}>{tw.name}</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border relative z-10 ${isSelected ? 'border-white bg-white' : 'border-gray-500'}`}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-600 m-auto mt-0.5" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Specific Time Customization Card */}
                    <div className="mt-4 p-4 rounded-xl bg-[#141416] border border-[#27272a] space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-emerald-500" />
                                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                                    Need a Specific Time?
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsSpecificTime(!isSpecificTime)}
                                className={`text-xs px-3 py-1 rounded-full border transition-all font-medium ${
                                    isSpecificTime
                                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                        : 'bg-[#1e1e24] border-[#3f3f46] text-gray-300 hover:text-white hover:border-emerald-500/40'
                                }`}
                            >
                                {isSpecificTime ? '✓ Specific Time Active' : '+ Set Exact Time'}
                            </button>
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed">
                            Cleaners normally arrive anytime within your selected window. If you require a <strong>specific exact start time</strong>, click above to choose your preferred time.
                        </p>

                        {isSpecificTime && (
                            <div className="pt-3 border-t border-[#27272a] space-y-3">
                                <div>
                                    <span className="text-xs text-emerald-400 font-medium block mb-2">
                                        Popular times for your {currentWindow.name}:
                                    </span>
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                                        {currentWindow.specificSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => setSpecificTime(slot)}
                                                className={`py-2 px-1 text-xs rounded-lg border font-medium transition-all ${
                                                    specificTime === slot
                                                        ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                                        : 'bg-[#18181b] border-[#27272a] text-gray-300 hover:border-[#3f3f46] hover:bg-[#202023]'
                                                }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                                    <span>Or pick any exact time:</span>
                                    <select
                                        value={specificTime}
                                        onChange={(e) => setSpecificTime(e.target.value)}
                                        className="bg-[#18181b] border border-[#3f3f46] text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
                                    >
                                        {[
                                            '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', 
                                            '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
                                            '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
                                            '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM'
                                        ].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
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

        // 2. Send Slack Confirmation to #booked channel
        try {
            const dateStr = state.date
                ? new Date(state.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                : 'Not specified';
            const unitLabel = state.unitSize
                .replace(/(\d+)bed(\d+)bath/, '$1 Bed / $2 Bath')
                .replace('studio', 'Studio / 1 Bath');
            const serviceLabel = state.serviceType === 'airbnb' ? 'Airbnb Turnover' : 'Standard Cleaning';
            const addonsLabel = state.addOns.length > 0
                ? state.addOns.map(a => a.charAt(0).toUpperCase() + a.slice(1).replace('-', ' ')).join(', ')
                : 'None';

            const bookingConfirmationText = [
                `🎉 *NEW BOOKING CONFIRMED — DEPOSIT COMPLETED* 🎉`,
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                `👤 *Customer:* ${state.contact.firstName} ${state.contact.lastName}`,
                `📞 *Phone:* ${state.contact.phone}`,
                `✉️ *Email:* ${state.contact.email}`,
                ``,
                `📍 *Address:* ${state.address}, ${state.city} ${state.zip}`,
                `🗓️ *Date:* ${dateStr}`,
                `⏰ *Time:* ${state.time}`,
                ``,
                `🧹 *Service:* ${serviceLabel}`,
                `🏠 *Unit Size:* ${unitLabel}`,
                `✨ *Add-ons:* ${addonsLabel}`,
                ``,
                `💰 *Total Value:* $${total}.00`,
                `💳 *Deposit Paid / Due:* $${DEPOSIT_AMOUNT}.00`,
                `💵 *Remaining Due at Clean:* $${remaining}.00`,
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                `✅ *Status:* Confirmed (Deposit Step Completed)`
            ].join('\n');

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            await fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    text: bookingConfirmationText,
                    channel: '#booked'
                })
            });
            clearTimeout(timeoutId);
        } catch (error) {
            console.error("Slack booking confirmation notification failed", error);
        }

        // 3. Redirect to Stripe
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
                {state.date && (
                    <div className="flex justify-between">
                        <span className="text-gray-400">Appointment</span>
                        <span className="font-semibold text-white">
                            {state.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ({state.time})
                        </span>
                    </div>
                )}
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

    const isSuccessRedirect = typeof window !== 'undefined' && (
        new URLSearchParams(window.location.search).get('status') === 'success' ||
        new URLSearchParams(window.location.search).get('session_id') !== null
    );

    if (isSuccessRedirect) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <Check size={44} className="text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Booking Confirmed!</h1>
                    <p className="text-gray-300">
                        Thank you! Your deposit has been received and your cleaning appointment is officially confirmed.
                    </p>
                    <div className="bg-[#18181b] border border-[#333] p-5 rounded-xl text-left space-y-2 text-sm text-gray-300">
                        <p><strong className="text-white">What happens next?</strong></p>
                        <p>• Our team will review your booking details and reach out via phone or text with access instructions.</p>
                        <p>• We will arrive promptly during your scheduled arrival window.</p>
                        <p>• If you need to make any changes, call or text us at <a href="tel:6026712856" className="text-green-400 font-semibold hover:underline">(602) 671-2856</a>.</p>
                    </div>
                    <Button fullWidth variant="accent" onClick={() => window.location.href = '/'}>
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }


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
