"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    KeyRound, ShieldCheck, Copy, CheckCircle2,
    RefreshCcw, Shield, ShieldAlert, Globe,
    ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/ui/slider";
import { ToolContainer } from "@/components/ToolContainer";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PasswordTool() {
    const tc = useTranslations("Tools.common");
    const t = useTranslations("Tools.password");

    const [password, setPassword] = useState("");
    const [length, setLength] = useState([32]);
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

        const entropy = length[0] * Math.log2(poolSize);

        if (entropy < 40) return { label: t('weak'), color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: ShieldAlert };
        if (entropy < 60) return { label: t('medium'), color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: Shield };
        if (entropy < 100) return { label: t('strong'), color: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/20", icon: ShieldCheck };
        return { label: t('alien'), color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: Globe };
    };

    const security = getSecurityLevel();

    return (
        <ToolContainer
            title={t('titleHighlight')}
            description="Generate high-entropy, cryptographically secure passkeys locally."
            icon={KeyRound}
            category="vault"
            settingsContent={
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('length')}</span>
                            <span className="text-[10px] font-black text-emerald-500">{length[0]}</span>
                        </div>
                        <Slider
                            value={length}
                            onValueChange={setLength}
                            min={8}
                            max={128}
                            step={1}
                            className="py-4"
                        />
                    </div>

                    <div className="space-y-2">
                        {[
                            { id: 'upper', label: t('uppercase'), state: useUpper, setter: setUseUpper },
                            { id: 'lower', label: t('lowercase'), state: useLower, setter: setUseLower },
                            { id: 'numbers', label: t('numbers'), state: useNumbers, setter: setUseNumbers },
                            { id: 'symbols', label: t('symbols'), state: useSymbols, setter: setUseSymbols },
                        ].map((toggle) => (
                            <label key={toggle.id} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-900 bg-zinc-900/20 cursor-pointer hover:border-zinc-800 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={toggle.state}
                                    onChange={(e) => toggle.setter(e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="w-4 h-4 rounded border border-zinc-700 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-colors flex items-center justify-center">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-950 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 peer-checked:text-white transition-colors">{toggle.label}</span>
                            </label>
                        ))}
                    </div>

                    <div className="space-y-3 pt-4">
                        <Button
                            onClick={handleCopy}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {copied ? <CheckCircle2 className="w-4 h-4 me-2" /> : <Copy className="w-4 h-4 me-2" />}
                            {copied ? t('copied') : t('copy')}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={generatePassword}
                            className="w-full h-12 border-zinc-800 text-zinc-400 hover:bg-zinc-900 text-[10px] font-black uppercase tracking-widest italic"
                        >
                            <RefreshCcw className="w-4 h-4 me-2" />
                            {t('generateNew')}
                        </Button>
                    </div>

                    <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Local Entropy</span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase">
                            Generated via window.crypto.getRandomValues.
                            The result is never stored outside RAM.
                        </p>
                    </div>
                </div>
            }
            howItWorks={[
                { title: "CSPRNG Engine", description: "Uses the browser's native Cryptographically Secure Pseudo-Random Number Generator." },
                { title: "Entropy Calculation", description: "Quantifies the mathematical complexity of the string based on pool size and length." },
                { title: "Volatile Synthesis", description: "Strings are constructed character-by-character in a private memory space." }
            ]}
        >
            <div className="flex flex-col items-center justify-center p-6 md:p-12 h-full min-h-[450px]">
                <div className="w-full max-w-2xl bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-12 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl group">
                    <div className="absolute inset-0 bg-[url('/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

                    <div className="z-10 w-full space-y-12 text-center">
                        <motion.div
                            key={password}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative"
                        >
                            <div
                                onClick={handleCopy}
                                className="text-2xl sm:text-4xl md:text-5xl font-mono text-emerald-500 tracking-[0.1em] break-all px-4 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95 py-8"
                            >
                                {password || "..."}
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-zinc-600 opacity-60 italic">
                                Click to Copy to Buffer
                            </div>
                        </motion.div>

                        <div className="flex items-center justify-center gap-4">
                            <div className={cn(
                                "inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                security.bg, security.border, security.color
                            )}>
                                <security.icon className="w-4 h-4" />
                                <span>{security.label} STATUS</span>
                            </div>
                            <div className="px-6 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">
                                {length[0]} BITS
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-8 flex items-center gap-6 opacity-20 group-hover:opacity-40 transition-opacity">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-black text-white uppercase">Active Cipher</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75" />
                            <span className="text-[8px] font-black text-white uppercase">Vault Guard</span>
                        </div>
                    </div>
                </div>
            </div>
        </ToolContainer>
    );
}
