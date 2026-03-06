import React, { memo } from 'react';

// ─── PrivaFlow Logo — Square Lock Mark ──────────────────────────────────────
//
//  Design rationale:
//  ┌──────────────────────────────────────────────────────────────────────────┐
//  │  Concept: The "Zero-Curve Vault"                                        │
//  │                                                                          │
//  │  A padlock where every element is a hard right angle — no curves        │
//  │  anywhere. This mirrors the brand's values: absolute, uncompromising,   │
//  │  no gray areas. It is also visually distinctive because every other      │
//  │  padlock logo relies on a rounded arch for the shackle and a circular   │
//  │  keyhole. Ours has neither.                                              │
//  │                                                                          │
//  │  Construction (on a 32×32 grid):                                        │
//  │  • Shackle: perfect squared U-shape (3px stroke, 90° corners)           │
//  │  • Body: solid rectangle, deliberately wider than the shackle span       │
//  │  • Keyhole: a rotated square (diamond) — not the usual circle+slot       │
//  │  • Layer order: bg → shackle strokes → body fills over shackle base     │
//  │                                                                          │
//  │  Scalability: optical marks at 16px, 24px, 32px, 48px versions          │
//  └──────────────────────────────────────────────────────────────────────────┘

interface LogoMarkProps {
    size?: number;
    fg?: string;   // mark color
    bg?: string;   // background color
    className?: string;
}

export const LogoMark = memo(({ size = 32, fg = '#ffffff', bg = '#000000', className = '' }: LogoMarkProps) => {
    // Scale-aware stroke weight: looks great from 16px to 96px
    const sw = size < 24 ? 2 : size < 40 ? 2.5 : 3;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="PrivaFlow"
        >
            {/* Background */}
            <rect width="32" height="32" fill={bg} />

            {/* ── SHACKLE (drawn first, body will cover its lower portion) ── */}
            {/* Left arm */}
            <line x1="10" y1="6" x2="10" y2="17" stroke={fg} strokeWidth={sw} strokeLinecap="square" />
            {/* Top crossbar */}
            <line x1="10" y1="6" x2="22" y2="6" stroke={fg} strokeWidth={sw} strokeLinecap="square" />
            {/* Right arm */}
            <line x1="22" y1="6" x2="22" y2="17" stroke={fg} strokeWidth={sw} strokeLinecap="square" />

            {/* ── BODY (covers lower 2px of shackle — creates "enters body" illusion) ── */}
            <rect x="4" y="14" width="24" height="14" fill={fg} />

            {/* ── DIAMOND KEYHOLE (negative space, right-angle geometry) ── */}
            {/* Points: top-center, right-middle, bottom-center, left-middle */}
            <polygon
                points="16,17  19.5,21.5  16,26  12.5,21.5"
                fill={bg}
            />
        </svg>
    );
});
LogoMark.displayName = 'LogoMark';

// ─── Full lockup: Mark + Wordmark ────────────────────────────────────────────

interface LogoProps {
    size?: 'xs' | 'sm' | 'md' | 'lg';
    invert?: boolean;
    showTagline?: boolean;
    className?: string;
}

export const Logo = memo(({ size = 'md', invert = false, showTagline = false, className = '' }: LogoProps) => {
    const map = { xs: 20, sm: 24, md: 32, lg: 44 };
    const markSize = map[size];
    const fg = invert ? '#000000' : '#ffffff';
    const bg = invert ? '#ffffff' : '#000000';
    const nameSize = { xs: 10, sm: 11, md: 13, lg: 16 }[size];
    const tagSize = { xs: 7, sm: 7, md: 8, lg: 10 }[size];

    return (
        <div className={`flex items-center gap-2.5 ${className}`} style={{ userSelect: 'none' }}>
            <LogoMark size={markSize} fg={fg} bg={bg} />
            <div className="flex flex-col leading-none gap-0.5">
                <span
                    style={{
                        fontSize: nameSize,
                        fontWeight: 900,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: fg,
                        fontFamily: 'var(--font-outfit, system-ui, sans-serif)',
                    }}
                >
                    PrivaFlow
                </span>
                {showTagline && (
                    <span
                        style={{
                            fontSize: tagSize,
                            fontWeight: 700,
                            letterSpacing: '0.28em',
                            textTransform: 'uppercase',
                            color: invert ? '#71717a' : '#52525b',
                            fontFamily: 'var(--font-outfit, system-ui, sans-serif)',
                        }}
                    >
                        Private · Local · Free
                    </span>
                )}
            </div>
        </div>
    );
});
Logo.displayName = 'Logo';

// ─── Standalone icon (for favicon/avatar placements) ─────────────────────────
export const LogoIcon = memo(({ size = 32, invert = false }: { size?: number; invert?: boolean }) => (
    <LogoMark size={size} fg={invert ? '#000000' : '#ffffff'} bg={invert ? '#ffffff' : '#000000'} />
));
LogoIcon.displayName = 'LogoIcon';
