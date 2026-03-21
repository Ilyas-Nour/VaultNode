'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    FileText, FilePlus, FileMinus, FileSearch, 
    ArrowRight, ArrowDown, ChevronRight,
    Search, Image as ImageIcon, Video, Camera,
    FileCode, Scissors, FileStack, Hash, LayoutGrid, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileFormat } from '@/lib/tools-data';

interface DescriptiveIconProps {
    type?: 'conversion' | 'standard' | 'grid' | 'file';
    sourceFormat?: FileFormat;
    destFormat?: FileFormat;
    iconLabel?: string;
    icon?: any;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const FormatBox = ({ format, size = 'md', className }: { format?: FileFormat; size?: 'sm' | 'md' | 'lg'; className?: string }) => {
    const configs: Record<string, { color: string; label: string; icon?: any }> = {
        pdf: { color: 'bg-red-500', label: 'PDF' },
        docx: { color: 'bg-blue-600', label: 'W' },
        xlsx: { color: 'bg-green-600', label: 'X' },
        pptx: { color: 'bg-orange-600', label: 'P' },
        html: { color: 'bg-zinc-600', label: '</>', icon: FileCode },
        text: { color: 'bg-gray-500', label: 'TXT', icon: FileText },
        img: { color: 'bg-pink-500', label: 'IMG', icon: ImageIcon },
        video: { color: 'bg-purple-500', label: 'VID', icon: Video },
        camera: { color: 'bg-rose-500', label: 'CAM', icon: Camera },
    };

    const config = configs[format || 'pdf'] || configs.pdf;

    const sizeClasses = {
        sm: 'w-6 h-7 text-[8px]',
        md: 'w-10 h-12 text-[10px]',
        lg: 'w-14 h-18 text-[14px]',
    };

    return (
        <div className={cn(
            "relative rounded-[4px] flex flex-col items-center justify-center font-black text-white shadow-lg shrink-0",
            config.color,
            sizeClasses[size],
            className
        )}>
            {/* Folded corner effect */}
            <div className="absolute top-0 right-0 w-2 h-2 bg-white/20 rounded-bl-[2px]" />
            
            {config.icon ? (
                <config.icon className={cn(size === 'lg' ? 'w-6 h-6' : 'w-4 h-4')} />
            ) : (
                <span className="tracking-tighter">{config.label}</span>
            )}
        </div>
    );
};

export const DescriptiveIcon = ({ 
    type = 'standard', 
    sourceFormat, 
    destFormat, 
    iconLabel, 
    icon: Icon,
    className,
    size = 'md'
}: DescriptiveIconProps) => {

    if (type === 'conversion' && sourceFormat && destFormat) {
        return (
            <div className={cn("relative flex items-center justify-center", className)}>
                {/* Source format (back) */}
                <motion.div
                    initial={{ x: -5, opacity: 0.8 }}
                    className="z-0"
                >
                    <FormatBox format={sourceFormat} size="sm" className="opacity-60 scale-90 translate-x-2 -translate-y-1" />
                </motion.div>
                
                {/* Connecting Arrow */}
                <motion.div 
                    animate={{ x: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="z-10 mx-[-4px] bg-white rounded-full p-0.5 shadow-md border border-zinc-100"
                >
                    <ChevronRight className="w-3 h-3 text-zinc-500" strokeWidth={3} />
                </motion.div>

                {/* Destination format (front) */}
                <motion.div
                    initial={{ x: 5 }}
                    className="z-20"
                >
                    <FormatBox format={destFormat} size="md" className="shadow-xl" />
                </motion.div>
            </div>
        );
    }

    if (type === 'grid') {
        if (iconLabel === '1234') {
            return (
                <div className={cn("grid grid-cols-2 gap-1 px-1", className)}>
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="w-4 h-4 rounded-[3px] bg-slate-500/20 border border-slate-500/30 flex items-center justify-center text-[10px] font-black text-slate-500">
                            {n}
                        </div>
                    ))}
                </div>
            );
        }
        if (iconLabel === 'split') {
            return (
                <div className={cn("relative w-12 h-12 flex items-center justify-center", className)}>
                    <FormatBox format="pdf" size="md" className="absolute -translate-x-1 -translate-y-1 scale-90" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
                        <Scissors className="w-5 h-5 text-white drop-shadow-lg" />
                    </div>
                </div>
            );
        }
        if (iconLabel === 'merge') {
            return (
                <div className={cn("relative w-12 h-12 flex items-center justify-center", className)}>
                    <FormatBox format="pdf" size="sm" className="absolute -translate-x-2 -translate-y-1 rotate-[-10deg]" />
                    <FormatBox format="pdf" size="sm" className="absolute translate-x-2 translate-y-1 rotate-[10deg]" />
                    <div className="z-20 bg-emerald-500 rounded-full p-1 shadow-lg ring-2 ring-white">
                        <FileStack className="w-4 h-4 text-white" />
                    </div>
                </div>
            );
        }
        if (iconLabel === '9box') {
            return (
                <div className={cn("grid grid-cols-3 gap-0.5", className)}>
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="w-2.5 h-2.5 rounded-[2px] bg-zinc-400 opacity-60" />
                    ))}
                </div>
            );
        }
    }

    if (type === 'file' && destFormat) {
        return (
            <div className={cn("relative", className)}>
                <FormatBox format={destFormat} size="lg" />
                {Icon && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
            </div>
        );
    }

    // Default: themed Lucide icon
    return (
        <div className={cn("relative p-3 rounded-2xl transition-all duration-300 group-hover:scale-110", className)}>
            {Icon && <Icon className="w-8 h-8 relative z-10" />}
            {/* Optional sparkle for premium feel */}
            <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-1 -right-1 z-20"
            >
                <Sparkles className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            </motion.div>
        </div>
    );
};
