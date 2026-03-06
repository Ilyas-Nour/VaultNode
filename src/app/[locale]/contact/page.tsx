"use client";

import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
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
            const response = await fetch('https://formspree.io/f/privaflow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    topic: form.topic,
                    message: form.message,
                    _subject: `[PrivaFlow ${form.topic}] from ${form.name}`,
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
        <div className="min-h-screen bg-black text-white">
            <div className="w-full px-6 lg:px-12 py-20 lg:py-32">

                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">{t('label')}</span>
                        <h1 className="mt-4 text-5xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9]">
                            {t('title')}
                        </h1>
                    </div>
                    <div className="flex flex-col justify-end gap-6 text-zinc-400 leading-relaxed">
                        <p>
                            {t('body1')}
                        </p>
                        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-700">
                            {t('response24h')}
                        </p>
                    </div>
                </div>

                {/* Main grid: Form left, Info right */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/[0.06]">

                    {/* Form — 2/3 width */}
                    <div className="lg:col-span-2 bg-black p-10 lg:p-14">
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center gap-6 py-20 text-center"
                            >
                                <CheckCircle className="w-16 h-16 text-white/30" />
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight">{t('successTitle')}</h2>
                                    <p className="mt-3 text-zinc-500 max-w-sm mx-auto">
                                        {t('successDesc')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                                >
                                    {t('sendAnother')}
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                                {/* Row 1: Name + Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label={t('fieldName')} error={errors.name}>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder={t('placeholderName')}
                                            className="field-input"
                                            autoComplete="name"
                                        />
                                    </Field>
                                    <Field label={t('fieldEmail')} error={errors.email}>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder={t('placeholderEmail')}
                                            className="field-input"
                                            autoComplete="email"
                                        />
                                    </Field>
                                </div>

                                {/* Topic */}
                                <Field label={t('fieldTopic')}>
                                    <select
                                        name="topic"
                                        value={form.topic}
                                        onChange={handleChange}
                                        className="field-input"
                                    >
                                        <option value="feedback">{t('topics.feedback')}</option>
                                        <option value="bug">{t('topics.bug')}</option>
                                        <option value="feature">{t('topics.feature')}</option>
                                        <option value="partnership">{t('topics.partnership')}</option>
                                        <option value="other">{t('topics.other')}</option>
                                    </select>
                                </Field>

                                {/* Message */}
                                <Field label={t('fieldMessage')} error={errors.message}>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        rows={7}
                                        placeholder={t('placeholderMessage')}
                                        className="field-input resize-none"
                                    />
                                </Field>

                                {/* Error banner */}
                                {status === 'error' && (
                                    <div className="flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/5 text-red-400 text-sm">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {t('errorGeneral')}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="group h-14 px-10 bg-white hover:bg-zinc-100 text-black font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === 'sending' ? (
                                        <>
                                            <span className="animate-pulse">{t('sending')}</span>
                                        </>
                                    ) : (
                                        <>
                                            {t('sendBtn')}
                                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Info sidebar — 1/3 width */}
                    <div className="bg-black p-10 lg:p-14 space-y-12">

                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">{t('sidebarTitle')}</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-zinc-600 uppercase tracking-widest font-semibold mb-1">{t('sidebarEmail')}</p>
                                        <a
                                            href="mailto:hello@privaflow.com"
                                            className="text-sm text-white hover:text-zinc-300 transition-colors"
                                        >
                                            hello@privaflow.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MessageSquare className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-zinc-600 uppercase tracking-widest font-semibold mb-1">{t('sidebarResponse')}</p>
                                        <p className="text-sm text-white">{t('response24h')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">{t('expectTitle')}</h3>
                            <ul className="space-y-3">
                                {[
                                    t('expectItems.item1'),
                                    t('expectItems.item2'),
                                    t('expectItems.item3'),
                                    t('expectItems.item4'),
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-500">
                                        <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-zinc-700" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-6 border-t border-white/[0.06]">
                            <p className="text-xs text-zinc-700 leading-relaxed">
                                {t('privacyNote')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline styles for form fields */}
            <style jsx>{`
                .field-input {
                    width: 100%;
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.08);
                    color: white;
                    padding: 12px 16px;
                    font-size: 14px;
                    font-family: inherit;
                    outline: none;
                    transition: border-color 0.2s;
                    -webkit-appearance: none;
                    border-radius: 0;
                }
                .field-input:focus {
                    border-color: rgba(255,255,255,0.3);
                }
                .field-input::placeholder {
                    color: rgba(255,255,255,0.2);
                }
                .field-input option {
                    background: #111;
                    color: white;
                }
            `}</style>
        </div>
    );
}

// ─── Field ─────────────────────────────────────────────────────────────────────

function Field({ label, error, children }: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                {label}
            </label>
            {children}
            {error && (
                <p className="text-[11px] text-red-400 font-semibold">{error}</p>
            )}
        </div>
    );
}
