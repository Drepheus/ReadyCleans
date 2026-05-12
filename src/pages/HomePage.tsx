import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

import { TestimonialsCarousel } from '../components/ui/TestimonialsCarousel';
import { ShieldCheck, ArrowRight, Star, CheckCircle2, DollarSign, Building2, Home, XCircle, Sparkles, Key } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

import { isValidZipCode } from '../utils/validation';

export const HomePage = () => {
    const navigate = useNavigate();
    const { updateState, resetBooking } = useBooking();
    const [zipCode, setZipCode] = useState('');
    const [error, setError] = useState(''); // Restore error state


    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const heroVideos = ['/videos/hero-1.mp4', '/videos/hero-2.mp4'];

    const handleVideoEnded = () => {
        setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
    };

    const handleStartBooking = () => {
        if (zipCode) {
            if (isValidZipCode(zipCode)) {
                resetBooking();
                updateState({ zip: zipCode });
                navigate('/booking');
            } else {
                setError('Sorry, we are not in your area of service yet.');
            }
        }
    };

    const handlePricingClick = (serviceType: 'standard' | 'airbnb') => {
        resetBooking();
        updateState({ serviceType });
        navigate('/booking');
    };



    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <div className="flex flex-col">
            <Helmet>
                <title>ReadyCleans | Phoenix's #1 Standard & Airbnb Cleaning</title>
                <meta name="description" content="Professional standard residential cleaning and Airbnb turnover services in Phoenix, AZ. Flat-rate pricing, easy online booking, and 100% satisfaction guarantee." />
                <link rel="canonical" href="https://readycleans.space/" />
            </Helmet>

            {/* Dark Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#09090b]">
                {/* Background Video & Gradients */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <video
                        key={currentVideoIndex}
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleVideoEnded}
                        className="absolute w-full h-full object-cover opacity-70 transition-opacity duration-1000"
                    >
                        <source src={heroVideos[currentVideoIndex]} type="video/mp4" />
                    </video>

                    {/* Dark Overlay to ensure readability */}
                    <div className="absolute inset-0 bg-[#09090b]/40"></div>

                    {/* Gradient Accents */}
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left Content */}
                        <div className="max-w-xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 mb-6"
                            >
                                <div className="flex text-yellow-500">
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <span className="text-sm font-medium text-gray-400">#1 Rated in Phoenix, AZ</span>
                                <div className="h-4 w-px bg-[#333]"></div>
                                <span className="text-sm font-bold text-emerald-500 flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Next-Day Availability
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-white"
                            >
                                A Satisfying Transition. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">Clean On Standby.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed"
                            >
                                Standard & Airbnb Turnover specialists. Flat pricing. Book online. No phone calls required.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center gap-4"
                            >
                                <Button size="lg" variant="accent" onClick={() => navigate('/booking')}>
                                    Book Now
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                                    Contact Us
                                </Button>
                            </motion.div>
                        </div>

                        {/* Right Booking Widget */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="relative z-20 perspective-1000"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            >
                                <div className="relative">
                                    <Card className="bg-[#09090b]/80 backdrop-blur-md border-[#333] p-0 shadow-2xl relative overflow-hidden">
                                        {/* Progress Line */}
                                        <div className="h-1 w-full bg-[#27272a]">
                                            <div className="h-full w-1/5 bg-green-500"></div>
                                        </div>

                                        <div className="p-8">
                                            <div className="flex justify-between items-center mb-8">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-1">Where do you need cleaning?</h3>
                                                </div>
                                                <div className="text-sm font-semibold text-[#52525b]">
                                                    Step 1 of 5
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-sm font-medium text-gray-400">Enter your zip code</label>
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <Input
                                                        placeholder="85001"
                                                        className="h-12 text-lg bg-[#18181b] border-[#3f3f46] focus:border-white focus:ring-0"
                                                        value={zipCode}
                                                        onChange={(e) => {
                                                            setZipCode(e.target.value);
                                                            setError('');
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleStartBooking();
                                                        }}
                                                    />
                                                    <Button
                                                        variant="accent"
                                                        className="h-12 px-8 whitespace-nowrap shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 font-bold tracking-wide transition-all hover:scale-[1.02]"
                                                        onClick={handleStartBooking}
                                                    >
                                                        Book It Now <ArrowRight className="ml-2 w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="mt-6">
                                                {error ? (
                                                    <p className="text-sm text-red-500 font-medium animate-pulse">
                                                        {error}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-green-500">
                                                        Checking availability for Phoenix Metro Area...
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Trust Badge */}
                                    <div className="absolute -bottom-6 -left-6 bg-[#18181b] border border-[#333] p-4 rounded-xl flex items-center gap-3 shadow-xl">
                                        <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400">Inspection Ready</div>
                                            <div className="text-sm font-bold text-white">100% Guaranteed</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-10 bg-[#111113] border-b border-[#27272a]">
                <div className="container mx-auto px-4">
                    <p className="text-center text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-8">Trusted by Phoenix's Top Property Managers</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder Logos - In a real app these would be SVGs */}
                        <div className="flex items-center gap-2 text-white font-bold text-xl"><Building2 className="text-emerald-500" /> Apex Living</div>
                        <div className="flex items-center gap-2 text-white font-bold text-xl"><Home className="text-emerald-400" /> StaySimple</div>
                        <div className="flex items-center gap-2 text-white font-bold text-xl"><Key className="text-purple-500" /> KeyHost</div>
                        <div className="flex items-center gap-2 text-white font-bold text-xl"><ShieldCheck className="text-gray-400" /> SecureStays</div>
                    </div>
                </div>
            </section>

            {/* Features Grid - Light Mode */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.1 }} className="text-center group">
                            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 transition-all shadow-md group-hover:scale-105 group-hover:bg-emerald-100">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Pristine Results</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">High-quality standard cleaning for your home or apartment. 100% satisfaction guaranteed.</p>
                        </motion.div>
                        <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="text-center group">
                            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-700 transition-all shadow-md group-hover:scale-105 group-hover:bg-gray-100">
                                <ShieldCheck size={24} fill="currentColor" className="text-gray-700" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Bonded & Insured</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Fully vetted crews. Your property is safe in our hands.</p>
                        </motion.div>
                        <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.3 }} className="text-center group">
                            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 transition-all shadow-md group-hover:scale-105 group-hover:bg-emerald-100">
                                <Star size={24} fill="currentColor" className="text-emerald-700" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Guest Ready</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">For turnover services, we ensure 5-star standard cleanliness every time.</p>
                        </motion.div>
                        <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.4 }} className="text-center group">
                            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-700 transition-all shadow-md group-hover:scale-105 group-hover:bg-gray-100">
                                <DollarSign size={24} fill="currentColor" className="text-gray-700" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Flat Pricing</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Fixed rates based on bedroom count. No upsells or surprises.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-50 border-y border-gray-200 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Phoenix Hosts Choose ReadyCleans</h2>
                        <p className="text-gray-500">Deadlines don't wait. Neither do we.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        {/* Left: Image Grid */}
                        <div className="relative">
                            <div className="relative z-10 grid grid-cols-2 gap-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="relative rounded-2xl overflow-hidden shadow-2xl h-64 md:h-80"
                                >
                                    <img src="/images/interior.png" alt="Modern clean interior" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="relative rounded-2xl overflow-hidden shadow-2xl h-64 md:h-80 mt-12"
                                >
                                    <img src="/images/supplies.png" alt="Premium supplies" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </motion.div>
                            </div>

                            {/* Decorative Blob */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-200/20 blur-[100px] rounded-full -z-0"></div>
                        </div>

                        {/* Right: Content */}
                        <div className="space-y-8">
                            {/* ReadyCleans */}
                            <Card className="relative bg-white border-green-100 p-8 shadow-xl ring-1 ring-green-50 transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 rounded-full bg-green-50 text-green-600">
                                        <Sparkles size={32} />
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-xs font-bold text-green-600 uppercase">ReadyCleans</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">On-Demand Reliability</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Instant Booking Online",
                                        "Weekends & Holidays Included",
                                        "Fixed Flat-Rate Pricing",
                                        "Automated Confirmations"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                            <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            {/* Traditional */}
                            <div className="pl-6 border-l-2 border-gray-200">
                                <h3 className="text-xl font-bold text-gray-400 mb-2">The Old Way</h3>
                                <div className="space-y-2">
                                    <p className="flex items-center gap-2 text-gray-400 text-sm"><XCircle size={16} /> Quote forms & Waiting</p>
                                    <p className="flex items-center gap-2 text-gray-400 text-sm"><XCircle size={16} /> Hourly billing surprises</p>
                                    <p className="flex items-center gap-2 text-gray-400 text-sm"><XCircle size={16} /> Inconsistent quality</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section >

            {/* Testimonials */}
            < TestimonialsCarousel />

            {/* Target Audiences */}
            < section className="py-24 bg-[#111113] border-t border-[#27272a]" >
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Who We Serve</h2>
                        <p className="text-gray-400">Specialized cleaning for specialized needs.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="bg-[#18181b] border-[#27272a] p-8 hover:border-green-500/50 transition-colors flex flex-col items-center text-center md:items-start md:text-left">
                            <Home className="text-green-500 mb-4" size={32} />
                            <h3 className="text-xl font-bold text-white mb-2">Homeowners & Renters</h3>
                            <p className="text-gray-400 text-sm">
                                Professional residential cleaning for your daily life. We handle the chores so you can focus on what matters.
                            </p>
                        </Card>
                        <Card className="bg-[#18181b] border-[#27272a] p-8 hover:border-blue-500/50 transition-colors flex flex-col items-center text-center md:items-start md:text-left">
                            <Key className="text-emerald-500 mb-4" size={32} />
                            <h3 className="text-xl font-bold text-white mb-2">Airbnb Hosts</h3>
                            <p className="text-gray-400 text-sm">
                                Fast turnovers between guests. We check for damages, restock essentials (if provided), and clean to a 5-star standard.
                            </p>
                        </Card>
                        <Card className="bg-[#18181b] border-[#27272a] p-8 hover:border-purple-500/50 transition-colors flex flex-col items-center text-center md:items-start md:text-left">
                            <Building2 className="text-purple-500 mb-4" size={32} />
                            <h3 className="text-xl font-bold text-white mb-2">Property Managers</h3>
                            <p className="text-gray-400 text-sm">
                                Reliable, invoice-ready cleaning for your entire portfolio. Volume discounts available.
                            </p>
                        </Card>
                    </div>
                </div>
            </section >

            {/* Visual Checklist Section */}
            <section className="py-24 bg-[#09090b]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Standard of Clean</h2>
                        <p className="text-gray-400">See the difference in the details.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { title: "Deep Kitchen Detail", img: "/images/kitchen-detail.png", desc: "Appliances, sinks, and fixtures polished to perfection." },
                            { title: "Resort-Style Bathrooms", img: "/images/bathroom-detail.png", desc: "Spa-like sanitation for glass, tile, and vanities." },
                            { title: "Pristine Living Areas", img: "/images/living-detail.png", desc: "Vacuum lines and dust-free surfaces throughout." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="group relative rounded-2xl overflow-hidden h-80"
                            >
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute bottom-0 left-0 w-full p-6 z-20 bg-gradient-to-t from-black/90 to-transparent">
                                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-300 text-sm">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            < section id="how" className="py-24 bg-white relative overflow-hidden" >
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Simple 3-Step Process</h2>
                        <p className="text-gray-500">Automated booking from start to finish.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
                        {/* Connector Line */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 z-0"></div>

                        {[
                            { step: "1", title: "Select Service", desc: "Choose Standard or Airbnb, plus your unit size ($69+)." },
                            { step: "2", title: "We Clean", desc: "Our team brings all supplies and equipment. Lockbox or keypad entry supported." },
                            { step: "3", title: "Fresh Start", desc: "Walk into a spotless home ready for you or your guests." }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                className="relative z-10 text-center"
                                {...fadeInUp}
                                transition={{ delay: i * 0.2 }}
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white border-2 border-emerald-100 flex items-center justify-center shadow-md group transition-all duration-500 hover:border-emerald-500 hover:shadow-lg">
                                    <span className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{step.step}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-500 leading-relaxed max-w-xs mx-auto text-sm">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Plans / Pricing Section */}
            < section id="plans" className="py-24 bg-[#111113] relative overflow-hidden" >
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Simple Flat-Rate Pricing</h2>
                        <p className="text-gray-400">Based on bedroom count. No hidden fees.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

                        {/* Standard Clean */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ y: -8 }}
                            className="h-full"
                        >
                            <Card
                                className="bg-[#18181b] border-[#27272a] h-full flex flex-col hover:border-gray-600 transition-colors"
                            >
                                <div className="mb-6 text-center">
                                    <h3 className="text-2xl font-bold mb-2 text-white">Standard Clean</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-gray-400">from</span>
                                        <span className="text-4xl font-bold text-white">$69</span>
                                    </div>
                                    <p className="text-gray-500 mt-4 text-sm">For homeowners and residents.</p>
                                </div>
                                <div className="space-y-4 flex-1 max-w-sm mx-auto w-full">
                                    <div className="h-px bg-[#27272a] my-4"></div>
                                    <div className="flex justify-between text-gray-300 text-sm"><span>Studio / 1 Bath</span> <span className="font-bold text-white">$69</span></div>
                                    <div className="flex justify-between text-gray-300 text-sm"><span>1 Bed / 1 Bath</span> <span className="font-bold text-white">$89</span></div>
                                    <div className="flex justify-between text-gray-300 text-sm"><span>2 Bed / 2 Bath</span> <span className="font-bold text-white">$129</span></div>
                                    <div className="flex justify-between text-gray-300 text-sm"><span>3 Bed / 2 Bath</span> <span className="font-bold text-white">$149</span></div>
                                    <div className="flex justify-between text-gray-300 text-sm"><span>4 Bed / 3 Bath</span> <span className="font-bold text-white">$209</span></div>
                                    <div className="flex justify-between text-gray-300 text-sm"><span>5 Bed / 3 Bath</span> <span className="font-bold text-white">$249</span></div>
                                </div>
                                <div className="mt-8">
                                    <Button fullWidth variant="outline" onClick={() => handlePricingClick('standard')}>Book Standard</Button>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Airbnb */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            whileHover={{ y: -12 }}
                            className="relative transform lg:-translate-y-4 h-full"
                        >
                            <div className="absolute inset-0 bg-green-600/20 blur-xl rounded-2xl"></div>
                            <Card
                                className="relative bg-[#18181b] border-green-500/50 h-full flex flex-col shadow-2xl"
                            >
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#22c55e] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg z-10"
                                >
                                    Host Favorite
                                </motion.div>
                                <div className="mb-6 text-center">
                                    <h3 className="text-2xl font-bold mb-2 text-white">Airbnb Turnover</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-gray-400">from</span>
                                        <span className="text-4xl font-bold text-white">$69</span>
                                    </div>
                                    <p className="text-gray-500 mt-4 text-sm">Recurring standard for short-term rentals.</p>
                                </div>
                                <div className="space-y-4 flex-1 max-w-sm mx-auto w-full">
                                    <div className="h-px bg-green-500/20 my-4"></div>
                                    <div className="flex justify-between text-gray-300 text-sm"><span>Studio / 1 Bath</span> <span className="font-bold text-white">$69</span></div>
                                    <div className="flex justify-between text-gray-300 text-sm"><span>1 Bed / 1 Bath</span> <span className="font-bold text-white">$89</span></div>
                                    <div className="flex justify-between text-gray-300 text-sm"><span>2 Bed / 2 Bath</span> <span className="font-bold text-white">$129</span></div>
                                    <div className="flex justify-between text-gray-300 text-sm"><span>3 Bed / 2 Bath</span> <span className="font-bold text-white">$149</span></div>
                                    <div className="flex justify-between text-gray-300 text-sm"><span>4 Bed / 3 Bath</span> <span className="font-bold text-white">$209</span></div>
                                    <div className="flex justify-between text-gray-300 text-sm"><span>5 Bed / 3 Bath</span> <span className="font-bold text-white">$249</span></div>
                                </div>
                                <div className="mt-8">
                                    <Button fullWidth variant="accent" onClick={() => handlePricingClick('airbnb')}>Book Turnover</Button>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* Certifications Section */}
            {/* Certifications Section */}
            <section className="py-24 bg-[#09090b] relative overflow-hidden border-t border-[#27272a]">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-16"
                    >
                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">Arizona's Top Rated Cleaners</h3>
                        <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-sm">Award Winning Service</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
                        {[
                            { label: "5-Star Reviews", value: "500+", desc: "Across Google & Yelp" },
                            { label: "Satisfaction", value: "100%", desc: "Or we re-clean for free" },
                            { label: "Vetted Crews", value: "100%", desc: "Background checked" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-2xl bg-[#18181b] border border-[#27272a]"
                            >
                                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-emerald-400 font-bold mb-1">{stat.label}</div>
                                <div className="text-gray-500 text-sm">{stat.desc}</div>
                            </motion.div>
                        ))}
                    </div>


                </div>
            </section>
        </div>
    );
};
