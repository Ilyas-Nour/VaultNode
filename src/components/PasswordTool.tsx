"use client";

import React, { useState, useEffect, useCallback } from "react";
import { KeyRound, ShieldCheck, Copy, CheckCircle2, ChevronLeft, RefreshCcw, Shield, ShieldAlert, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function PasswordTool() {
    const tc = useTranslations("Tools.common");
    const t = useTranslations("Tools.password");

    const [password, setPassword] = useState("");
    const [length, setLength] = useState(32);
    const [useUpper, setUseUpper] = useState(true);
    const [useLower, setUseLower] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useSymbols, setUseSymbols] = useState(true);
    const [copied, setCopied] = useState(false);

    const generatePassword = useCallback(() => {
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lower = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

        let chars = "";
        if (useUpper) chars += upper;
        if (useLower) chars += lower;
        if (useNumbers) chars += numbers;
        if (useSymbols) chars += symbols;

        if (chars === "") {
            setPassword("");
            return;
        }

        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        let generated = "";
        for (let i = 0; i < length; i++) {
            generated += chars[array[i] % chars.length];
        }

        setPassword(generated);
        setCopied(false);
    }, [length, useUpper, useLower, useNumbers, useSymbols]);

    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    const handleCopy = async () => {
        if (!password) return;
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getSecurityLevel = () => {
        let poolSize = 0;
        if (useUpper) poolSize += 26;
        if (useLower) poolSize += 26;
        if (useNumbers) poolSize += 10;
        if (useSymbols) poolSize += 32;

        if (poolSize === 0) return { label: "None", color: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20", icon: ShieldAlert };

        const entropy = length * Math.log2(poolSize);

        if (entropy < 40) return { label: t('weak'), color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: ShieldAlert };
        if (entropy < 60) return { label: t('medium'), color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: Shield };
        if (entropy < 100) return { label: t('strong'), color: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/20", icon: ShieldCheck };
        return { label: t('alien'), color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: Globe };
    };

    const security = getSecurityLevel();

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-teal-500/30 font-sans pb-24">
            {/* Header */}
            <header className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:group-hover:translate-x-1 rtl:rotate-180" />
                        <span className="text-sm font-bold uppercase tracking-widest">{tc('backHome')}</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-600 font-bold tracking-widest uppercase text-xs">{tc('vaultNode')}</span>
                        <span className="text-teal-500 font-black uppercase italic tracking-tighter text-sm">{t('titleHighlight')}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 pt-12 lg:pt-20 space-y-12">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(20,184,166,0.1)]">
                        <KeyRound className="w-8 h-8 text-teal-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                        {t('titleHighlight')} <span className="text-teal-500">GEN</span>
                    </h1>
                </div>

                <div className="space-y-8">
                    {/* Output Card */}
                    <Card className="p-8 bg-zinc-900/20 border-zinc-800 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center min-h-[240px] shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                        <div className="z-10 w-full space-y-8 text-center pt-8">
                            <div className="relative group cursor-pointer" onClick={handleCopy}>
                                <div className="text-2xl sm:text-4xl md:text-5xl font-mono text-teal-500 tracking-[0.1em] break-all px-4 transition-transform group-hover:scale-105">
                                    {password || "..."}
                                </div>
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to copy
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <div className={`inline-flex items-center gap-2 ${security.bg} border ${security.border} ${security.color} px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors`}>
                                    <security.icon className="w-4 h-4" />
                                    <span>{security.label}</span>
                                </div>
                                <Button
                                    onClick={handleCopy}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl h-9 px-4 font-bold text-xs uppercase tracking-widest transition-all"
                                >
                                    {copied ? <CheckCircle2 className="w-4 h-4 me-2 text-teal-400" /> : <Copy className="w-4 h-4 me-2" />}
                                    {copied ? t('copied') : t('copy')}
                                </Button>
                                <Button
                                    onClick={generatePassword}
                                    variant="outline"
                                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl h-9 px-4 font-bold text-xs uppercase tracking-widest transition-all"
                                >
                                    <RefreshCcw className="w-4 h-4 me-2" />
                                    {t('generateNew')}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Controls */}
                    <Card className="p-8 bg-zinc-900/50 border-zinc-800 rounded-[2.5rem] backdrop-blur-xl">
                        <div className="space-y-8">
                            {/* Length Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-bold tracking-widest uppercase">
                                    <span className="text-zinc-400">{t('length')}</span>
                                    <span className="text-teal-500 text-xl">{length}</span>
                                </div>
                                <input
                                    type="range"
                                    min="8"
                                    max="128"
                                    value={length}
                                    onChange={(e) => setLength(Number(e.target.value))}
                                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                />
                            </div>

                            <div className="h-px bg-zinc-800 w-full" />

                            {/* Toggles */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { id: 'upper', label: t('uppercase'), state: useUpper, setter: setUseUpper },
                                    { id: 'lower', label: t('lowercase'), state: useLower, setter: setUseLower },
                                    { id: 'numbers', label: t('numbers'), state: useNumbers, setter: setUseNumbers },
                                    { id: 'symbols', label: t('symbols'), state: useSymbols, setter: setUseSymbols },
                                ].map((toggle) => (
                                    <label key={toggle.id} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-950 cursor-pointer hover:border-zinc-700 transition-colors group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={toggle.state}
                                                onChange={(e) => toggle.setter(e.target.checked)}
                                                className="peer sr-only"
                                            />
                                            <div className="w-6 h-6 rounded border-2 border-zinc-700 peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-colors" />
                                            <CheckCircle2 className="w-4 h-4 text-zinc-950 absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="font-bold text-sm text-zinc-300 group-hover:text-white transition-colors">{toggle.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="flex items-center justify-center gap-2 text-zinc-600 font-black text-[10px] uppercase tracking-widest pt-4">
                        <Shield className="w-3 h-3" />
                        <span>crypto.getRandomValues API Local Engine</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
