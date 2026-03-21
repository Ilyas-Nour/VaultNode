"use client";

import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle, ArrowRight, Shield, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function ContactPage() {
    const t = useTranslations('ContactPage');
    const [status, setStatus] = useState<FormStatus>('idle');
    const [form, setForm] = useState({
        name: '',
        email: '',
        topic: 'feedback',
        message: ''
    });
    const [errors, setErrors] = useState<Partial<typeof form>>({});

    const validate = () => {
        const e: Partial<typeof form> = {};
        if (!form.name.trim()) e.name = t('validation.name');
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('validation.email');
        if (!form.message.trim() || form.message.length < 10) e.message = t('validation.message');
        return e;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setStatus('sending');
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    topic: form.topic,
                    message: form.message,
                }),
            });

            if (response.ok) {
                setStatus('success');
                setForm({ name: '', email: '', topic: 'feedback', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="w-full px-6 lg:px-12 py-20 lg:py-32 relative z-10">

                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24"
                >
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white">
                                <div className="w-1.5 h-1.5 bg-white/40" />
                                {t('label')}
                            </div>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                            {t('title')}
                        </h1>
                    </div>
                    <div className="flex flex-col justify-end gap-8 text-zinc-500 lg:ps-12 border-l border-white/5">
                        <p className="text-lg leading-relaxed max-w-md">
                            {t('body1')}
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-700 mb-1">{t('response24h')}</span>
                                <span className="text-[11px] font-bold text-white/40 uppercase">24h Response</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/[0.08] border-y border-white/[0.08]">

                    {/* Form area */}
                    <div className="lg:col-span-2 bg-black p-8 lg:p-20">
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center gap-8 py-20 text-center"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-white/40" />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black uppercase tracking-tight">{t('successTitle')}</h2>
                                    <p className="text-zinc-500 max-w-xs mx-auto text-lg">
                                        {t('successDesc')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-colors"
                                >
                                    {t('sendAnother')}
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-12" noValidate>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                                        <Field label={t('fieldName')} error={errors.name}>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder={t('placeholderName')}
                                                className="field-input"
                                            />
                                        </Field>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                                        <Field label={t('fieldEmail')} error={errors.email}>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder={t('placeholderEmail')}
                                                className="field-input"
                                            />
                                        </Field>
                                    </motion.div>
                                </div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                    <Field label={t('fieldTopic')}>
                                        <div className="relative">
                                            <select
                                                name="topic"
                                                value={form.topic}
                                                onChange={handleChange}
                                                className="field-input appearance-none cursor-pointer pr-10"
                                            >
                                                <option value="feedback">{t('topics.feedback')}</option>
                                                <option value="bug">{t('topics.bug')}</option>
                                                <option value="feature">{t('topics.feature')}</option>
                                                <option value="partnership">{t('topics.partnership')}</option>
                                                <option value="other">{t('topics.other')}</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                                        </div>
                                    </Field>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                    <Field label={t('fieldMessage')} error={errors.message}>
                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            rows={6}
                                            placeholder={t('placeholderMessage')}
                                            className="field-input resize-none min-h-[160px]"
                                        />
                                    </Field>
                                </motion.div>

                                {status === 'error' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-5 border border-red-500/20 bg-red-500/5 text-red-500 text-[11px] font-bold uppercase tracking-widest">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {t('errorGeneral')}
                                    </motion.div>
                                )}

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="group relative h-16 w-full md:w-auto px-12 bg-white hover:bg-zinc-100 text-black font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {status === 'sending' ? (
                                        <span className="animate-pulse">{t('sending')}</span>
                                    ) : (
                                        <>
                                            {t('sendBtn')}
                                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    <div className="bg-black lg:border-l border-white/[0.08] flex flex-col">
                        <div className="p-8 lg:p-14 space-y-16 flex-1">
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">{t('sidebarTitle')}</h3>
                                <div className="space-y-8">
                                    <div className="group">
                                        <p className="text-[9px] text-zinc-700 uppercase tracking-widest font-black mb-3">{t('sidebarEmail')}</p>
                                        <a href="mailto:hello@privaflow.com" className="text-xl font-bold text-zinc-400 group-hover:text-white transition-colors tracking-tight">
                                            hello@privaflow.com
                                        </a>
                                    </div>
                                    <div className="group">
                                        <p className="text-[9px] text-zinc-700 uppercase tracking-widest font-black mb-3">{t('sidebarResponse')}</p>
                                        <p className="text-xl font-bold text-white tracking-tight">{t('response24h')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">{t('expectTitle')}</h3>
                                <div className="space-y-4">
                                    {[
                                        t('expectItems.item1'),
                                        t('expectItems.item2'),
                                        t('expectItems.item3'),
                                        t('expectItems.item4'),
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 text-xs font-bold text-zinc-500 uppercase tracking-wider group">
                                            <div className="w-1 h-1 bg-zinc-800" />
                                            <span className="group-hover:text-zinc-300 transition-colors">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 lg:p-14 border-t border-white/[0.08] bg-white/[0.01]">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-4 h-4 text-zinc-800" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-800 underline decoration-zinc-900 underline-offset-4">Security Protocol Active</span>
                            </div>
                            <p className="text-[11px] text-zinc-600 leading-relaxed font-medium">
                                {t('privacyNote')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Style overrides */}
            <style jsx>{`
                .field-input {
                    width: 100%;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: white;
                    padding: 16px 20px;
                    font-size: 15px;
                    font-weight: 500;
                    letter-spacing: -0.01em;
                    outline: none;
                    transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
                    border-radius: 0;
                }
                .field-input:focus {
                    background: rgba(255,255,255,0.04);
                    border-color: rgba(255,255,255,0.2);
                    box-shadow: 0 0 40px -20px rgba(255,255,255,0.1);
                }
                .field-input::placeholder {
                    color: rgba(255,255,255,0.15);
                }
                .field-input option {
                    background: #0a0a0a;
                    color: white;
                }
            `}</style>
        </div>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 block">
                    {label}
                </label>
            </div>
            {children}
            {error && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 font-black uppercase tracking-widest mt-2">{error}</motion.p>
            )}
        </div>
    );
}
