'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface ToolIconProps {
    icon: any;
    color: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const ToolIcon = ({ icon: Icon, color, className, size = 'md' }: ToolIconProps) => {
    const sizeClasses = {
        sm: 'w-7 h-7',
        md: 'w-12 h-12',
        lg: 'w-14 h-14',
    };

    const iconSizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-7 h-7',
    };

    return (
        <div className={cn(
            "relative flex items-center justify-center border border-white/10 transition-all duration-300 group-hover:border-white/40",
            sizeClasses[size],
            className
        )}>
            {/* Dark technical background */}
            <div className="absolute inset-0 bg-zinc-950/80" />
            
            {/* Corner Markers (Technical aesthetic) */}
            <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white/30" />
            <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-white/30" />
            <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-white/30" />
            <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white/30" />

            {/* Main Icon */}
            <Icon 
                className={cn(
                    iconSizeClasses[size], 
                    "relative z-10 text-white transition-all duration-500 group-hover:scale-110",
                    // Forced sharp look: stroke-miterlimit
                )} 
                strokeWidth={1.5}
            />
        </div>
    );
};
