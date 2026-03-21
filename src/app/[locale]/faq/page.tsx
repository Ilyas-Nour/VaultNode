"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { HelpCircle, Shield, Cpu, Zap, CreditCard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';

export default function FAQPage() {
    const t = useTranslations('FAQPage');

    const faqs = [
        { q: t('questions.q1'), a: t('questions.a1'), icon: Shield },
        { q: t('questions.q2'), a: t('questions.a2'), icon: Cpu },
        { q: t('questions.q3'), a: t('questions.a3'), icon: Zap },
        { q: t('questions.q4'), a: t('questions.a4'), icon: CreditCard }
    ];

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white mb-6">
                        <div className="w-1.5 h-1.5 bg-white/40" />
                        RESOURCE CENTER
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase">
                        {t('title')}
                    </h1>
                    <p className="text-lg text-zinc-500 max-w-xl leading-relaxed">
                        {t('subtitle')}
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <AccordionItem 
                            key={idx}
                            question={faq.q}
                            answer={faq.a}
                            icon={faq.icon}
                        />
                    ))}
                </div>

                {/* Final Help */}
                <div className="mt-24 p-8 border border-white/5 bg-zinc-900/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] -translate-y-1/2 translate-x-1/2 rotate-45" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Still have questions?</h3>
                            <p className="text-zinc-500 text-sm">Our technical team is ready to help with any complex inquiries.</p>
                        </div>
                        <Link 
                            href="/contact"
                            className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors shrink-0"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AccordionItem({ question, answer, icon: Icon }: { question: string, answer: string, icon: any }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className={`border border-white/5 transition-all duration-300 ${isOpen ? 'bg-zinc-900/40 border-white/10' : 'bg-transparent hover:border-white/10'}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex items-start gap-6 text-left group"
            >
                <div className={`shrink-0 w-10 h-10 flex items-center justify-center border transition-colors duration-300 ${isOpen ? 'bg-white border-white text-black' : 'bg-zinc-950 border-white/10 text-zinc-500'}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 flex items-center justify-between gap-4">
                    <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                        {question}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isOpen ? 'rotate-180 text-white' : 'text-zinc-700'}`} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-8 ml-16 text-zinc-500 leading-relaxed text-base border-t border-white/[0.03] pt-6">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
