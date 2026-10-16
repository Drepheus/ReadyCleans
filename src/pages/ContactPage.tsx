import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, ArrowRight, ArrowLeft, Bot } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const ContactPage = () => {
    const [view, setView] = useState<'chat' | 'email'>('chat');

    const handleOpenChat = () => {
        // Target the floating chat toggle button
        const chatTrigger = document.getElementById('chat-toggle-button') ||
            document.querySelector('button[aria-label*="chat"]') ||
            document.querySelector('button[aria-label="Toggle chat"]');
        if (chatTrigger instanceof HTMLElement) {
            chatTrigger.click();
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#09090b]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Support That Never Sleeps</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Whether you have a surprise inspection or a last-minute Airbnb turnover, our team in Phoenix is ready to help.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <Card className="bg-[#18181b] border-[#27272a] overflow-hidden min-h-[500px] flex flex-col relative">

                        {/* Tab Toggle (Visual Only) */}
                        <div className="flex border-b border-[#27272a]">
                            <button
                                onClick={() => setView('chat')}
                                className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${view === 'chat' ? 'bg-[#27272a] text-white border-b-2 border-green-500' : 'text-gray-400 hover:text-white hover:bg-[#27272a]/50'}`}
                            >
                                <Bot size={18} /> AI Chat Support
                            </button>
                            <button
                                onClick={() => setView('email')}
                                className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${view === 'email' ? 'bg-[#27272a] text-white border-b-2 border-green-500' : 'text-gray-400 hover:text-white hover:bg-[#27272a]/50'}`}
                            >
                                <Mail size={18} /> Email Support
                            </button>
                        </div>

                        <div className="p-8 md:p-12 flex-1 flex flex-col">
                            {view === 'chat' ? (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
                                >
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                        <Bot size={48} className="text-green-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-white">Instant Answers with AI</h2>
                                        <p className="text-gray-400 max-w-md mx-auto">
                                            Our advanced AI assistant can help you check availability, get quotes, and manage bookings instantly.
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                                        <Button size="lg" variant="accent" onClick={handleOpenChat} className="flex-1 shadow-lg shadow-green-500/20">
                                            <MessageSquare className="mr-2" size={20} /> Start Chatting
                                        </Button>
                                        <Button size="lg" variant="outline" onClick={() => window.location.href = 'tel:6233965203'} className="flex-1">
                                            <Phone className="mr-2" size={20} /> Call Now
                                        </Button>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-4">
                                        Rather send an email? <button onClick={() => setView('email')} className="text-green-500 hover:underline">Click here</button>
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="max-w-xl mx-auto w-full"
                                >
                                    <div className="flex items-center gap-2 mb-6 cursor-pointer text-gray-400 hover:text-white" onClick={() => setView('chat')}>
                                        <ArrowLeft size={16} /> <span>Back to Chat</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                                    <form className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <Input placeholder="First Name" />
                                            <Input placeholder="Last Name" />
                                        </div>
                                        <Input placeholder="Email Address" type="email" />
                                        <Input placeholder="Phone Number" type="tel" />
                                        <div className="flex flex-col gap-2 w-full">
                                            <label className="text-sm font-medium text-gray-300">How can we help?</label>
                                            <textarea className="w-full rounded-lg border border-[#3f3f46] bg-[#09090b] px-4 py-3 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 min-h-[120px]" placeholder="Tell us about your property..."></textarea>
                                        </div>
                                        <Button fullWidth size="lg" variant="accent">
                                            Send Message <ArrowRight className="ml-2" size={18} />
                                        </Button>
                                    </form>
                                </motion.div>
                            )}
                        </div>
                    </Card>

                    {/* Location Footer (Subtle) */}
                    <div className="mt-8 flex justify-center text-gray-500 gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} /> Phoenix, AZ
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={14} /> (623) 396-5203
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={14} /> support@readycleans.com
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
