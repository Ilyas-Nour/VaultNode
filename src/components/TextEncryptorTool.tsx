/**
 * 🔐 PRIVAFLOW | Client-Side Cryptographic Vault
 * ---------------------------------------------------------
 * A high-security text encryption engine utilizing the native
 * Web Crypto API. Implements PBKDF2 key derivation and
 * AES-256-GCM authenticated encryption.
 * 
 * Logic: WebCrypto AES-GCM 256
 * Performance: Optimized (Memoized State & Callbacks)
 * Aesthetics: Cyber-Premium / Emerald-Dark
 */

"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import {
    Lock, Unlock, Copy, Check,
    Shield, Key, Eye, EyeOff, Terminal, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/ToolContainer";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 🔐 TextEncryptorTool Component
 * The primary utility for local text encryption and decryption.
 */
const TextEncryptorTool = memo(() => {
    // ✨ HOOKS & TRANSLATIONS
    const t = useTranslations("Tools.common");

    // 📂 STATE ORCHESTRATION
    const [input, setInput] = useState("");
    const [password, setPassword] = useState("");
    const [output, setOutput] = useState("");
    const [isLockMode, setIsLockMode] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    /**
     * ⚡ Cryptographic Processing Core
     * Executes AES-GCM operations within the browser's secure context.
     */
    const handleProcess = useCallback(async () => {
        if (!input || !password) return;
        setIsProcessing(true);
        setCopied(false);

        try {
            const encoder = new TextEncoder();
            const pwd = encoder.encode(password);

            if (isLockMode) {
                // 🔐 ENCRYPTION SEQUENCE
                const data = encoder.encode(input);
                const key = await crypto.subtle.importKey(
                    "raw", pwd, "PBKDF2", false, ["deriveKey"]
                );

                const salt = crypto.getRandomValues(new Uint8Array(16));
                const derivedKey = await crypto.subtle.deriveKey(
                    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
                    key, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
                );

                const iv = crypto.getRandomValues(new Uint8Array(12));
                const encrypted = await crypto.subtle.encrypt(
                    { name: "AES-GCM", iv }, derivedKey, data
                );

                const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
                combined.set(salt);
                combined.set(iv, salt.length);
                combined.set(new Uint8Array(encrypted), salt.length + iv.length);

                setOutput(btoa(String.fromCharCode(...combined)));
            } else {
                // 🔓 DECRYPTION SEQUENCE
                const combined = new Uint8Array(atob(input).split("").map(c => c.charCodeAt(0)));
                const salt = combined.slice(0, 16);
                const iv = combined.slice(16, 28);
                const encrypted = combined.slice(28);

                const key = await crypto.subtle.importKey(
                    "raw", pwd, "PBKDF2", false, ["deriveKey"]
                );

                const derivedKey = await crypto.subtle.deriveKey(
                    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
                    key, { name: "AES-GCM", length: 256 }, false, ["decrypt"]
                );

                const decrypted = await crypto.subtle.decrypt(
                    { name: "AES-GCM", iv }, derivedKey, encrypted
                );

                setOutput(new TextDecoder().decode(decrypted));
            }
        } catch (error) {
            console.error("Crypto error:", error);
            setOutput("ERROR: Invalid cipher or incorrect key.");
        } finally {
            setIsProcessing(false);
        }
    }, [input, password, isLockMode]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [output]);

    // 📦 HOW IT WORKS REGISTRY (Memoized)
    const howItWorks = useMemo(() => [
        { title: 'Type Your Message', description: 'Write or paste any text you want to protect — a note, password, or private message.' },
        { title: 'Set a Password', description: 'Choose a password that only you (and whoever you share it with) will know.' },
        { title: 'Encrypt or Decrypt', description: 'Hit Encrypt to scramble your text, or paste encrypted text with the same password to read it again.' }
    ], []);

    return (
        <ToolContainer
            title={isLockMode ? "Text Encryptor" : "Text Decryptor"}
            description="Military-grade AES-GCM encryption for your sensitive messages."
            icon={isLockMode ? Lock : Unlock}
            category="vault"
            toolId="encrypt"
            settingsContent={
                <div className="space-y-6">
                    {/* 🔘 OPERATION MODE SELECTOR */}
                    <div className="space-y-4">
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Crypto Protocol</span>
                        <div className="space-y-2">
                            {[
                                { val: true, label: "Encryption Mode", icon: Lock },
                                { val: false, label: "Decryption Mode", icon: Unlock },
                            ].map((m) => (
                                <button
                                    key={m.label}
                                    onClick={() => { setIsLockMode(m.val); setOutput(""); }}
                                    className={cn(
                                        "w-full p-4 rounded-xl border flex items-center gap-4 transition-all italic",
                                        isLockMode === m.val
                                            ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500"
                                            : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                                    )}
                                >
                                    <m.icon className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase tracking-widest">{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 🕹️ ACTIONS CONTROL HUB */}
                    <div className="space-y-3 pt-2">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Security Key</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-14 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 font-mono tracking-widest"
                                    placeholder="Enter password..."
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white p-2"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            onClick={handleProcess}
                            disabled={!input || !password || isProcessing}
                            className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl text-xs uppercase tracking-widest italic transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : isLockMode ? <Lock className="w-5 h-5 me-2" /> : <Unlock className="w-5 h-5 me-2" />}
                            {isProcessing ? "Processing..." : isLockMode ? "Lock Message" : "Unlock Message"}
                        </Button>
                    </div>

                    {/* 📊 PROTOCOL REPORT */}
                    <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/40 space-y-4">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <Shield className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">Web Crypto API</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase">
                            Uses PBKDF2 for key derivation and AES-256-GCM for authenticated encryption.
                            Keys never leave browser memory.
                        </p>
                    </div>
                </div>
            }
            howItWorks={howItWorks}
        >
            <div className="flex flex-col flex-1 p-6 md:p-12 space-y-8 h-full min-h-[500px]">
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[300px]">
                    {/* 📟 SOURCE NODE AREA */}
                    <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-xs font-black uppercase tracking-widest text-zinc-600 italic">Source Node</span>
                            <Terminal className="w-4 h-4 text-zinc-700" />
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isLockMode ? "Enter raw text to encrypt..." : "Paste cipher text here..."}
                            className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 text-base font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none transition-all scrollbar-hide"
                        />
                    </div>

                    {/* 📟 BUFFER OUTPUT AREA */}
                    <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-500 italic">Encrypted Buffer</span>
                            <Key className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex-1 bg-zinc-950 border border-zinc-900 rounded-3xl p-6 relative group border-dashed">
                            <AnimatePresence mode="wait">
                                {output ? (
                                    <motion.div
                                        key="output"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="w-full h-full flex flex-col"
                                    >
                                        <div className="flex-1 text-sm font-mono text-emerald-500/80 break-all overflow-y-auto scrollbar-hide">
                                            {output}
                                        </div>
                                        <div className="pt-4 flex justify-end">
                                            <Button
                                                onClick={handleCopy}
                                                className={cn(
                                                    "h-12 px-8 rounded-xl text-xs font-black uppercase tracking-widest transition-all italic",
                                                    copied ? "bg-emerald-500 text-emerald-950" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                                )}
                                            >
                                                {copied ? <Check className="w-4 h-4 me-2" /> : <Copy className="w-4 h-4 me-2" />}
                                                {copied ? "Copied" : "Copy"}
                                            </Button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 shadow-inner">
                                            {isLockMode ? <Lock className="w-8 h-8 text-zinc-700" /> : <Unlock className="w-8 h-8 text-zinc-700" />}
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-widest text-zinc-700">Awaiting Node Synthesis</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* 📟 FLOW INDICATORS */}
                <div className="flex items-center justify-center gap-10 py-5 bg-zinc-900/30 border border-zinc-900 rounded-3xl">
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 rounded-full h-2.5 bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Cipher Integrity Active</span>
                    </div>
                    <div className="w-px h-4 bg-zinc-800" />
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 rounded-full h-2.5 bg-emerald-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Volatile Key Store</span>
                    </div>
                </div>
            </div>
        </ToolContainer>
    );
});

TextEncryptorTool.displayName = 'TextEncryptorTool';

export default TextEncryptorTool;
