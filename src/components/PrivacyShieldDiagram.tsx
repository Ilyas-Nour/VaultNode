/**
 * 🛡️ PRIVAFLOW | Privacy Shield Engine
 * ---------------------------------------------------------
 * A high-fidelity vector visualization demonstrating
 * the "PrivaFlow Shield" protecting user devices.
 * 
 * Performance: Optimized (Static Memoization)
 * Aesthetics: Cyber-Premium / Motion-Rich
 */

"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Monitor, Smartphone, Lock, CheckCircle2 } from 'lucide-react';

/**
 * 🛡️ PrivacyShieldDiagram Component
 * Visual centerpiece for the philosophy section.
 */
export const PrivacyShieldDiagram = memo(() => {
    return (
        <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center">
            {/* 🌌 AMBIENT ATMOSPHERE */}
            <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute inset-1/4 bg-emerald-400/5 blur-[80px] rounded-full" />

            {/* 🛡️ CORE SHIELD APPARATUS */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 w-full h-full flex items-center justify-center"
            >
                <div className="relative">
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 1, 0, -1, 0]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 5,
                            ease: "easeInOut"
                        }}
                        className="relative"
                    >
                        <Shield className="w-64 h-64 text-emerald-500 stroke-[0.5] fill-emerald-500/5 backdrop-blur-sm" />

                        {/* 📱 PROTECTED NODE ECOSYSTEM */}
                        <div className="absolute inset-0 flex items-center justify-center gap-4">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Monitor className="w-16 h-16 text-emerald-400/80" />
                            </motion.div>
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <Smartphone className="w-12 h-12 text-emerald-400/60" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* 🛰️ KINETIC ORBITALS */}
                    <div className="absolute inset-0 -z-10">
                        {[0, 120, 240].map((angle, i) => (
                            <motion.div
                                key={i}
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 15 + i * 5, ease: "linear" }}
                                className="absolute inset-0"
                            >
                                <motion.div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                    style={{ transformOrigin: '0 128px' }}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* 🎖️ VERIFICATION BADGES */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="absolute -top-4 -right-4 bg-zinc-950 border border-emerald-500/50 p-3 rounded-2xl shadow-2xl"
                    >
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2, type: "spring" }}
                        className="absolute -bottom-4 -left-4 bg-zinc-950 border border-emerald-500/50 p-3 rounded-2xl shadow-2xl"
                    >
                        <Lock className="w-6 h-6 text-emerald-500" />
                    </motion.div>
                </div>
            </motion.div>

            {/* ⚡ QUANTUM REFLECTION */}
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        </div>
    );
});

PrivacyShieldDiagram.displayName = 'PrivacyShieldDiagram';
