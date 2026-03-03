"use client";

import React, { useState, useEffect, useCallback } from "react";
import { KeyRound, ShieldCheck, Copy, CheckCircle2, RefreshCcw, Shield, ShieldAlert, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ToolContainer } from "@/components/ToolContainer";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PasswordClient() {
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
        <ToolContainer
            title={t('titleHighlight')}
            description="Generate cryptographically secure passwords locally."
            icon={KeyRound}
            category="vault"
            settingsContent={
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-zinc-500">{t('length')}</span>
                            <span className="text-emerald-500">{length}</span>
                        </div>
                        <Slider
                            value={[length]}
                            min={8}
                            max={128}
                            step={1}
                            onValueChange={(val) => setLength(val[0])}
                            className="py-4"
                        />
                    </div>
                    <div className="space-y-3">
                        {[
                            { id: 'upper', label: t('uppercase'), state: useUpper, setter: setUseUpper },
                            { id: 'lower', label: t('lowercase'), state: useLower, setter: setUseLower },
                            { id: 'numbers', label: t('numbers'), state: useNumbers, setter: setUseNumbers },
                            { id: 'symbols', label: t('symbols'), state: useSymbols, setter: setUseSymbols },
                        ].map((toggle) => (
                            <div key={toggle.id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-900/40">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{toggle.label}</span>
                                <Checkbox
                                    checked={toggle.state}
                                    onCheckedChange={(checked) => toggle.setter(!!checked)}
                                    className="border-zinc-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            }
            howItWorks={[
                { title: "Hardware Entropy", description: "Uses window.crypto.getRandomValues for true randomness from your CPU." },
                { title: "Zero Latency", description: "Generated in microseconds directly in your browser's RAM session." },
                { title: "Local Safety", description: "Your passwords never touch our servers. They exist only on your screen." }
            ]}
        >
            <div className="p-12 md:p-20 space-y-12 text-center">
                <div className="absolute inset-0 bg-[url('/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

                <div className="relative group cursor-pointer inline-block max-w-full" onClick={handleCopy}>
                    <motion.div
                        key={password}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-mono text-emerald-500 tracking-[0.1em] break-all px-4 transition-transform group-hover:scale-[1.02]"
                    >
                        {password || "..."}
                    </motion.div>
                    <div className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to copy sequence
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className={cn(
                        "inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                        security.bg, security.border, security.color
                    )}>
                        <security.icon className="w-4 h-4" />
                        <span>Security Level: {security.label}</span>
                    </div>

                    <Button
                        onClick={handleCopy}
                        className="h-12 px-6 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all italic"
                    >
                        {copied ? <CheckCircle2 className="w-4 h-4 me-2 text-emerald-400" /> : <Copy className="w-4 h-4 me-2" />}
                        {copied ? t('copied') : t('copy')}
                    </Button>

                    <Button
                        onClick={generatePassword}
                        variant="outline"
                        className="h-12 px-6 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all italic"
                    >
                        <RefreshCcw className="w-4 h-4 me-2" />
                        {t('generateNew')}
                    </Button>
                </div>
            </div>
        </ToolContainer>
    );
}
