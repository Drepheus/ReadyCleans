import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, ChevronDown, Phone, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp?: string;
}

const QUICK_ACTIONS = [
    { label: "💰 Pricing & Rates", prompt: "What are your standard cleaning and Airbnb turnover rates?" },
    { label: "📅 Book a Clean", prompt: "How do I schedule an appointment?" },
    { label: "✨ What's Included?", prompt: "What standard inspection points do you clean?" },
];

const getClientFallbackResponse = (query: string): string => {
    const q = (query || '').toLowerCase();
    if (q.includes('2 bed') && q.includes('2 bath')) {
        return "Our flat rate for a **2 Bed / 2 Bath** is **$144** for both Standard Cleans and Airbnb Turnovers in Phoenix! Optional add-ons: Oven ($17), Fridge ($17), Windows ($17), Same-Day ($39). You can book online at [readycleans.space/booking](/booking) or call/text (602) 671-2856.";
    }
    if (q.includes('price') || q.includes('rate') || q.includes('cost') || q.includes('quote') || q.includes('how much')) {
        return "Our pricing starts at **$77 for Studios**, **$100 for 1 Bed / 1 Bath**, up to **$279 for 5 Bed / 3 Bath** with transparent flat rates! View all rates and reserve online at [readycleans.space/booking](/booking) or call/text (602) 671-2856.";
    }
    if (q.includes('airbnb') || q.includes('turnover') || q.includes('vrbo') || q.includes('str')) {
        return "Our specialized **Airbnb Turnover Cleanings** start at **$77** and include full sanitization, fresh linen changes, bed styling, towel staging, guest amenity restocking, and damage inspections. Book 24/7 at [readycleans.space/booking](/booking) or text (602) 671-2856!";
    }
    if (q.includes('area') || q.includes('where') || q.includes('phoenix') || q.includes('scottsdale')) {
        return "We serve the entire **Phoenix Metro Area** including Phoenix, Scottsdale, Tempe, Mesa, Chandler, Gilbert, Glendale, Peoria, and Paradise Valley. Book online anytime at [readycleans.space/booking](/booking)!";
    }
    return "Thanks for your question! We're here 24/7 to help you with cleaning services in Phoenix. Our standard and Airbnb cleans start at $77 up to $279. You can check live availability and reserve online at [readycleans.space/booking](/booking) or call/text us directly at **(602) 671-2856**.";
};

export const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi there! 👋 Welcome to **ReadyCleans**. How can we help you today? Ask about our standard cleaning rates, Airbnb turnover specials, or booking availability!",
            sender: 'ai',
            timestamp: 'Just now'
        }
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            // Focus input on open if on non-touch device
            if (window.innerWidth > 640) {
                setTimeout(() => inputRef.current?.focus(), 150);
            }
        }
    }, [messages, isOpen]);

    // Handle Escape key and outside click to close
    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (
                isOpen &&
                chatContainerRef.current &&
                !chatContainerRef.current.contains(e.target as Node)
            ) {
                // Ignore if clicked on the toggle button itself
                const toggleBtn = document.getElementById('chat-toggle-button');
                if (toggleBtn && toggleBtn.contains(e.target as Node)) {
                    return;
                }
                handleClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, handleClose]);

    const handleSend = async (messageToSend?: string) => {
        const text = (messageToSend || input).trim();
        if (!text || isLoading) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: timeStr };
        
        setMessages(prev => [...prev, userMsg]);
        if (!messageToSend) setInput('');
        setIsLoading(true);

        try {
            // Get conversation history (excluding initial greeting)
            const history = messages.filter(msg => msg.id !== '1');

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    history: history,
                }),
            });

            if (!response.ok) {
                throw new Error('Server returned an error');
            }

            const data = await response.json();
            const replyText = data.response || "Thanks for your message! Our team has received your inquiry directly and will assist you shortly.";

            setMessages(prev => [...prev, {
                id: 'ai-' + Date.now(),
                text: replyText,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            // Backup notification to Slack via /api/notify if /api/chat network call failed
            try {
                await fetch('/api/notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: `💬 *Customer Chat Message (Client Backup)*\n*Customer:* "${text}"\n*Time:* ${new Date().toLocaleTimeString('en-US', { timeZone: 'America/Phoenix' })} MST`
                    })
                });
            } catch (err) {
                console.error('Backup notify error:', err);
            }

            // Intelligent local fallback response so customer is never stranded
            const fallbackReply = getClientFallbackResponse(text);
            setMessages(prev => [...prev, {
                id: 'ai-' + Date.now(),
                text: fallbackReply,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Launcher Button */}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[70]">
                <motion.button
                    id="chat-toggle-button"
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close live chat" : "Open live chat"}
                    className={`w-14 h-14 rounded-full shadow-[0_8px_30px_rgba(16,185,129,0.35)] flex items-center justify-center transition-all duration-300 border border-white/20 ${
                        isOpen 
                            ? 'bg-[#27272a] text-white hover:bg-[#3f3f46]' 
                            : 'bg-gradient-to-tr from-emerald-600 to-green-500 text-white hover:brightness-110'
                    }`}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <X size={24} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="relative"
                            >
                                <MessageSquare size={24} />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#18181b] animate-ping" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#18181b]" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Chat Box Modal / Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={chatContainerRef}
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] bg-[#121215]/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-[#27272a] overflow-hidden z-[70] flex flex-col h-[520px] max-h-[82vh]"
                    >
                        {/* Modern Header */}
                        <div className="bg-[#18181b]/90 backdrop-blur-md px-4 py-3.5 flex justify-between items-center border-b border-[#27272a]/80">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                        <Bot size={20} />
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#18181b] rounded-full" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-bold text-sm text-white">ReadyCleans Support</h3>
                                        <Sparkles size={12} className="text-emerald-400" />
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[11px] text-gray-400 font-medium">Online • Instant Help</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <a
                                    href="tel:6026712856"
                                    title="Call ReadyCleans directly"
                                    className="p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-white/5 transition-colors"
                                >
                                    <Phone size={17} />
                                </a>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    title="Minimize"
                                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                    aria-label="Minimize chat"
                                >
                                    <ChevronDown size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    title="Close chat"
                                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                    aria-label="Close chat"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0d0d10] scroll-smooth">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                                            msg.sender === 'user'
                                                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-br-xs shadow-md shadow-emerald-950/30'
                                                : 'bg-[#1a1a1e] text-gray-200 rounded-tl-xs border border-white/5 shadow-sm'
                                        }`}
                                    >
                                        {msg.sender === 'ai' ? (
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                                    li: ({ children }) => <li className="ml-1">{children}</li>,
                                                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                                                    em: ({ children }) => <em className="italic">{children}</em>,
                                                    a: ({ href, children }) => (
                                                        <a
                                                            href={href}
                                                            className="text-emerald-400 hover:underline font-medium underline-offset-2"
                                                            target={href?.startsWith('http') ? '_blank' : undefined}
                                                            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                        >
                                                            {children}
                                                        </a>
                                                    ),
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        ) : (
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        )}
                                    </div>
                                    {msg.timestamp && (
                                        <span className="text-[10px] text-gray-500 mt-1 px-1">
                                            {msg.timestamp}
                                        </span>
                                    )}
                                </div>
                            ))}

                            {/* Thinking / Typing Dots Indicator */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#1a1a1e] rounded-2xl rounded-tl-xs border border-white/5 px-4 py-3 flex items-center gap-1.5 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Prompts */}
                        {messages.length === 1 && !isLoading && (
                            <div className="px-3 py-2 bg-[#0d0d10] border-t border-[#27272a]/50 flex gap-1.5 overflow-x-auto no-scrollbar">
                                {QUICK_ACTIONS.map((action) => (
                                    <button
                                        key={action.label}
                                        type="button"
                                        onClick={() => handleSend(action.prompt)}
                                        className="whitespace-nowrap text-xs bg-[#18181b] hover:bg-[#27272a] text-gray-300 hover:text-white border border-[#27272a] rounded-full px-3 py-1.5 transition-colors"
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-3 bg-[#18181b] border-t border-[#27272a] flex flex-col gap-1.5">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="flex gap-2 items-center"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your question..."
                                    disabled={isLoading}
                                    className="flex-1 bg-[#121215] border border-[#27272a] text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-500 disabled:opacity-50 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    aria-label="Send message"
                                    className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-md shadow-emerald-950/40"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                            <div className="flex justify-between items-center px-1 text-[10px] text-gray-500">
                                <span>Sent directly to our team via Slack</span>
                                <a href="tel:6026712856" className="text-emerald-500 hover:underline">
                                    (602) 671-2856
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
