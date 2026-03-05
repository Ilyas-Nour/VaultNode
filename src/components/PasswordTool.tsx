/**
 * 🔑 PRIVAFLOW | Entropy-Grade Password Architect
 * ---------------------------------------------------------
 * A local-first cryptographic utility for generating high-entropy
 * passwords. No data ever leaves the client-side memory space.
 * 
 * Logic: window.crypto CSPRNG
 * Performance: Optimized (Memoized Generation & Metrics)
 * Aesthetics: Crypt-Industrial / Monochro-Emerald
 */

"use client";

import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import {
    KeyRound, ShieldCheck, Copy, CheckCircle2,
    RefreshCcw, Shield, ShieldAlert, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/ui/slider";
import { ToolContainer } from "@/components/ToolContainer";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 🔑 PasswordTool Component
 * The primary utility for generating secure, volatile passwords.
 */
const PasswordTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.password");

    // 📂 STATE ORCHESTRATION
    const [password, setPassword] = useState("");
    const [length, setLength] = useState([32]);
    const [useUpper, setUseUpper] = useState(true);
    const [useLower, setUseLower] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useSymbols, setUseSymbols] = useState(true);
    const [copied, setCopied] = useState(false);

    /**
     * ⚡ CSPRNG Generation Engine
     * Leverages Web Crypto API for cryptographically secure random values.
     */
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

        const array = new Uint32Array(length[0]);
        window.crypto.getRandomValues(array);

        let generated = "";
        for (let i = 0; i < length[0]; i++) {
            generated += chars[array[i] % chars.length];
        }

        setPassword(generated);
        setCopied(false);
    }, [length, useUpper, useLower, useNumbers, useSymbols]);

    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    const handleCopy = useCallback(async () => {
        if (!password) return;
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [password]);

    /**
     * 📊 Entropy & Security Analyst
     * Calculates the mathematical strength based on character pool and length.
     */
    const security = useMemo(() => {
        let poolSize = 0;
        if (useUpper) poolSize += 26;
        if (useLower) poolSize += 26;
        if (useNumbers) poolSize += 10;
        if (useSymbols) poolSize += 32;

        if (poolSize === 0) return { label: "None", color: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20", icon: ShieldAlert };

        const entropy = length[0] * Math.log2(poolSize);

        if (entropy < 40) return { label: t('weak'), color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: ShieldAlert };
        if (entropy < 60) return { label: t('medium'), color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: Shield };
        if (entropy < 100) return { label: t('strong'), color: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/20", icon: ShieldCheck };
        return { label: t('alien'), color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: Globe };
    }, [length, useUpper, useLower, useNumbers, useSymbols, t]);

    // 📦 HOW IT WORKS REGISTRY (Memoized)
    const howItWorks = useMemo(() => [
        { title: "CSPRNG Engine", description: "Uses the browser's native Cryptographically Secure Pseudo-Random Number Generator." },
        { title: "Entropy Calculation", description: "Quantifies the mathematical complexity of the string based on pool size and length." },
        { title: "Volatile Synthesis", description: "Strings are constructed character-by-character in a private memory space." }
    ], []);

    return (
        <ToolContainer
            title={t('title')}
            description={t('description')}
            icon={KeyRound}
            category="vault"
            toolId="password"
            settingsContent={
                <div className="space-y-6">
                    {/* 🎚️ PARAMETER CONTROL */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 italic">{t('length')}</span>
                            <span className="text-sm font-black text-emerald-500 tabular-nums">{length[0]}</span>
                        </div>
                        <Slider
                            value={length}
                            onValueChange={setLength}
                            min={8}
                            max={128}
                            step={1}
                            className="py-6"
                        />
                    </div>

                    {/* 🔘 TOGGLE GRID */}
                    <div className="grid grid-cols-1 gap-2.5">
                        {[
                            { id: 'upper', label: t('uppercase'), state: useUpper, setter: setUseUpper },
                            { id: 'lower', label: t('lowercase'), state: useLower, setter: setUseLower },
                            { id: 'numbers', label: t('numbers'), state: useNumbers, setter: setUseNumbers },
                            { id: 'symbols', label: t('symbols'), state: useSymbols, setter: setUseSymbols },
                        ].map((toggle) => (
                            <label key={toggle.id} className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-zinc-900 bg-zinc-900/20 cursor-pointer hover:border-zinc-800 transition-all hover:bg-zinc-900/40 group">
                                <input
                                    type="checkbox"
                                    checked={toggle.state}
                                    onChange={(e) => toggle.setter(e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 rounded-lg border border-zinc-700 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center shadow-inner group-hover:scale-110">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 peer-checked:text-white transition-colors italic">{toggle.label}</span>
                            </label>
                        ))}
                    </div>

                    {/* 🕹️ ACTIONS CONTROL HUB */}
                    <div className="space-y-3.5 pt-4">
                        <Button
                            onClick={handleCopy}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[11px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {copied ? <CheckCircle2 className="w-5 h-5 me-2" /> : <Copy className="w-5 h-5 me-2" />}
                            {copied ? t('copied') : t('copy')}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={generatePassword}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[11px] font-black uppercase tracking-widest italic rounded-xl"
                        >
                            <RefreshCcw className="w-4 h-4 me-2" />
                            {t('generateNew')}
                        </Button>
                    </div>

                    {/* 🧪 SECURITY REPORT */}
                    <div className="p-5 rounded-3xl border border-zinc-900 bg-zinc-900/40 space-y-4 shadow-inner">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Local Entropy</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-tight">
                            Generated via window.crypto.getRandomValues.
                            The result is never stored outside your screen.
                        </p>
                    </div>
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="flex flex-col items-center justify-center p-6 md:p-12 h-full min-h-[420px]">
                <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800/50 rounded-[3rem] p-10 relative overflow-hidden flex flex-col items-center justify-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] group backdrop-blur-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50" />

                    {/* 🖼️ CIPHER DISPLAY */}
                    <div className="z-10 w-full space-y-10 text-center">
                        <motion.div
                            key={password}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="relative"
                        >
                            <div
                                onClick={handleCopy}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono text-emerald-500 tracking-[0.1em] break-all px-6 cursor-pointer hover:scale-[1.02] transition-all active:scale-95 py-10 selection:bg-emerald-500/20 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            >
                                {password || "..."}
                            </div>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-zinc-900/50 backdrop-blur-md rounded-full border border-zinc-800/80 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 opacity-60 italic group-hover:opacity-100 transition-all group-hover:bg-zinc-900">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
                                Click to Copy to Buffer
                            </div>
                        </motion.div>

                        {/* 📟 METRIC HUB */}
                        <div className="flex items-center justify-center gap-6 pt-4">
                            <div className={cn(
                                "inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl backdrop-blur-xl border border-white/5",
                                security.bg, security.color, "hover:scale-105"
                            )}>
                                <security.icon className="w-4 h-4 shadow-[0_0_10px_currentColor]" />
                                <span>{security.label} STATUS</span>
                            </div>
                            <div className="px-8 py-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400 italic shadow-xl backdrop-blur-xl transition-all hover:scale-105 border-white/5 tabular-nums">
                                {length[0]} BITS
                            </div>
                        </div>
                    </div>

                    {/* 🛸 STATUS BEACONS */}
                    <div className="absolute bottom-10 flex items-center gap-8 opacity-20 group-hover:opacity-60 transition-all duration-700">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Active Cipher</span>
                        </div>
                        <div className="w-px h-3 bg-zinc-800" />
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Vault Guard</span>
                        </div>
                    </div>
                </div>
            </div>
        </ToolContainer>
    );
});

PasswordTool.displayName = 'PasswordTool';

export default PasswordTool;
