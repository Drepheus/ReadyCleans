import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

const testimonials = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Renter",
        location: "Scottsdale, AZ",
        text: "I needed a reliable regular cleaning service for my apartment. ReadyCleans exceeded my expectations. The attention to detail is remarkable!",
        rating: 5,
        type: "residential"
    },
    {
        id: 2,
        name: "Mike Ross",
        role: "Airbnb Superhost",
        company: "Phx Stays",
        text: "My previous cleaner flaked on a same-day turnover. ReadyCleans saved me. The place was 5-star ready in 3 hours. I use them for all my units now.",
        rating: 5,
        type: "commercial"
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        role: "Property Manager",
        company: "Vista Apartments",
        text: "As a property manager, I need cleaners I can trust. ReadyCleans' automated booking and flat-rates make my life so much easier.",
        rating: 5,
        type: "commercial"
    },
    {
        id: 4,
        name: "David Chen",
        role: "Homeowner",
        location: "Gilbert, AZ",
        text: "Sold my house and needed a deep clean before closing. They came the next morning. Efficient, thorough, and no hidden fees.",
        rating: 5,
        type: "residential"
    },
    {
        id: 5,
        name: "Marcus Thorne",
        role: "Landlord",
        location: "Mesa, AZ",
        text: "I used to clean units myself between tenants. Never again. For $150, the time I save is worth every penny. Highly recommend.",
        rating: 5,
        type: "residential"
    }
];

export const TestimonialsCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 bg-[#0c0c0e] relative overflow-hidden border-t border-[#27272a]">
            {/* Background accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-green-600/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Trusted by Phoenix</h2>
                    <p className="text-gray-400">What Phoenix homeowners and hosts say.</p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="relative">
                        <div className="overflow-hidden min-h-[300px]">
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full"
                                >
                                    <Card className="bg-[#18181b]/50 backdrop-blur-md border-[#27272a] p-8 md:p-12 relative mx-auto max-w-4xl">
                                        <Quote className="absolute top-6 left-6 md:top-10 md:left-10 text-green-500/10 rotate-180" size={80} />

                                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                            {/* Avatar / Initial */}
                                            <div className="flex-shrink-0">
                                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-green-500/20">
                                                    {testimonials[currentIndex].name.charAt(0)}
                                                </div>
                                            </div>

                                            <div className="flex-1 text-center md:text-left">
                                                <div className="flex justify-center md:justify-start gap-1 text-yellow-500 mb-4">
                                                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                                        <Star key={i} size={20} fill="currentColor" />
                                                    ))}
                                                </div>
                                                <p className="text-xl md:text-2xl text-gray-200 leading-relaxed italic mb-6">
                                                    "{testimonials[currentIndex].text}"
                                                </p>

                                                <div>
                                                    <h4 className="text-white font-bold text-lg">{testimonials[currentIndex].name}</h4>
                                                    <div className="text-sm flex flex-col md:flex-row gap-1 md:gap-2 text-gray-500 justify-center md:justify-start">
                                                        <span>{testimonials[currentIndex].role}</span>
                                                        {testimonials[currentIndex].company && (
                                                            <>
                                                                <span className="hidden md:inline">•</span>
                                                                <span className="text-green-400">{testimonials[currentIndex].company}</span>
                                                            </>
                                                        )}
                                                        {testimonials[currentIndex].location && (
                                                            <>
                                                                <span className="hidden md:inline">•</span>
                                                                <span className="text-gray-500">{testimonials[currentIndex].location}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-20">
                            <Button variant="outline" size="sm" onClick={prev} className="rounded-full w-12 h-12 p-0 border-[#333] bg-[#09090b] hover:bg-[#222] text-white">
                                <ChevronLeft size={24} />
                            </Button>
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-20">
                            <Button variant="outline" size="sm" onClick={next} className="rounded-full w-12 h-12 p-0 border-[#333] bg-[#09090b] hover:bg-[#222] text-white">
                                <ChevronRight size={24} />
                            </Button>
                        </div>
                    </div>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-green-500' : 'w-2 bg-[#333] hover:bg-[#444]'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
