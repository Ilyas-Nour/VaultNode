"use client";

import React, { memo } from 'react';
import { Shield, Lock, FileText, FilePlus, Scissors, Key, Image, Video, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Image-backed sub-renderers ───────────────────────────────────────────────

const RedactorProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
            backgroundImage: `url('${type === 'before'
                ? '/confidential_document_before_1772656258732.png'
                : '/confidential_document_after_1772656279868.png'}')`
        }}
    >
        <Label text={type === 'before' ? 'Raw Document' : 'Secured Asset'} type={type} />
    </div>
));
RedactorProof.displayName = 'RedactorProof';

const ImageProof = memo(({ type, url, beforeLabel, afterLabel }: {
    type: 'before' | 'after'; url: string; beforeLabel: string; afterLabel: string;
}) => (
    <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${url}')` }}>
        <Label text={type === 'before' ? beforeLabel : afterLabel} type={type} />
    </div>
));
ImageProof.displayName = 'ImageProof';

const CleanExifProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-950">
        <img
            src={type === 'before' ? '/clean_exif_before_1772656297208.png' : '/clean_exif_after_1772656317043.png'}
            className="w-full h-full object-contain"
            alt={type === 'before' ? 'Before EXIF cleaning' : 'After EXIF cleaning'}
        />
        <Label text={type === 'before' ? 'Raw EXIF Data' : 'Clean & Private'} type={type} />
    </div>
));
CleanExifProof.displayName = 'CleanExifProof';

const BlurProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-950">
        <img
            src={type === 'before' ? '/blur_after_1772656353991.png' : '/blur_before_1772656334995.png'}
            className="w-full h-full object-contain"
            alt={type === 'before' ? 'Blurry image' : 'Sharp clear image'}
        />
        <Label text={type === 'before' ? 'Blurry / Low Quality' : 'Sharp & Clear'} type={type} />
    </div>
));
BlurProof.displayName = 'BlurProof';

// ─── CSS-based mockups ────────────────────────────────────────────────────────

/** Encrypt: plaintext → cipher text */
const EncryptProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex flex-col gap-4 p-8 font-mono text-sm">
        <Label text={type === 'before' ? 'Plain Text' : 'AES-256 Encrypted'} type={type} />
        {type === 'before' ? (
            <div className="space-y-2 mt-8">
                <div className="text-zinc-300 text-xs leading-relaxed">
                    <span className="text-zinc-600">To: </span>alice@example.com
                </div>
                <div className="text-zinc-300 text-xs leading-relaxed">
                    <span className="text-zinc-600">Subject: </span>Contract Details
                </div>
                <hr className="border-zinc-800 my-3" />
                <p className="text-zinc-200 text-xs leading-loose">
                    Hi Alice,<br />
                    Please find the account number:<br />
                    <span className="text-white font-bold">ACCT: 4829-0011-3847-0293</span><br />
                    Password: <span className="text-white font-bold">Sunf1ower#99</span>
                </p>
            </div>
        ) : (
            <div className="space-y-3 mt-8">
                <div className="text-[10px] text-zinc-600 uppercase tracking-widest">AES-256-GCM · IV attached</div>
                <div className="bg-zinc-900 border border-zinc-800 rounded p-4 break-all text-[10px] text-emerald-400 leading-relaxed font-mono">
                    U2FsdGVkX1+mK9vXzT2qR8bN3cWpL7sH<br />
                    4eA1YdFvGs6JtPw0lQrZ9uMxCk8nVhOi<br />
                    XbD2EyR5TsW3aF7gJ6cN4pKmHqUvBeLw<br />
                    <span className="text-zinc-600">···</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-emerald-500">
                    <Lock className="w-3 h-3" />
                    <span>Decryptable only with your key</span>
                </div>
            </div>
        )}
    </div>
));
EncryptProof.displayName = 'EncryptProof';

/** Password: weak → strong entropy */
const PasswordProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center gap-6 p-8">
        <Label text={type === 'before' ? 'Weak Password' : 'Entropy-Hardened'} type={type} />
        {type === 'before' ? (
            <div className="space-y-5 w-full max-w-xs">
                <div className="space-y-2">
                    {['password123', 'abc123', 'iloveyou'].map((p, i) => (
                        <div key={i} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2.5">
                            <Key className="w-3.5 h-3.5 text-zinc-600" />
                            <span className="text-zinc-400 font-mono text-sm">{p}</span>
                            <span className="ml-auto text-[9px] text-red-500 uppercase tracking-widest">Weak</span>
                        </div>
                    ))}
                </div>
                <div className="w-full bg-zinc-900 h-1.5">
                    <div className="bg-red-500 h-full" style={{ width: '15%' }} />
                </div>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest text-center">Crackable in &lt; 1 second</p>
            </div>
        ) : (
            <div className="space-y-5 w-full max-w-xs">
                <div className="space-y-2">
                    {['Qx#7mK$2pL!vR9', 'bN@5zW$3jF&8cT', 'rV!4hY#6nS$2kP'].map((p, i) => (
                        <div key={i} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2.5">
                            <Key className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-300 font-mono text-sm tracking-wider">{p}</span>
                        </div>
                    ))}
                </div>
                <div className="w-full bg-zinc-900 h-1.5">
                    <div className="bg-emerald-500 h-full w-full" />
                </div>
                <p className="text-emerald-600 text-[10px] uppercase tracking-widest text-center">128-bit entropy · Zero patterns</p>
            </div>
        )}
    </div>
));
PasswordProof.displayName = 'PasswordProof';

/** PDF Merge: multiple files → single file */
const MergeProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-8 gap-6">
        <Label text={type === 'before' ? '3 Separate Files' : '1 Merged Document'} type={type} />
        {type === 'before' ? (
            <div className="flex flex-col gap-3 mt-8">
                {['Contract_p1.pdf', 'Exhibit_A.pdf', 'Signatures.pdf'].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-5 py-3 w-52">
                        <FileText className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300 text-xs font-mono">{f}</span>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center gap-4 mt-8">
                <div className="relative">
                    <div className="absolute -top-2 -left-2 w-48 h-60 bg-zinc-800 border border-zinc-700" />
                    <div className="absolute -top-1 -left-1 w-48 h-60 bg-zinc-850 border border-zinc-700" />
                    <div className="relative w-48 h-60 bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center gap-3">
                        <FilePlus className="w-8 h-8 text-emerald-500" />
                        <span className="text-emerald-400 font-mono text-xs">Full_Document.pdf</span>
                        <span className="text-zinc-600 text-[10px]">3 files merged</span>
                    </div>
                </div>
            </div>
        )}
    </div>
));
MergeProof.displayName = 'MergeProof';

/** HEIC → JPG */
const HeicProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-8 gap-8">
        <Label text={type === 'before' ? 'HEIC (Apple Format)' : 'Universal JPEG'} type={type} />
        <div className="flex flex-col items-center gap-5 mt-8">
            <div className={cn(
                "w-44 h-44 border-2 flex flex-col items-center justify-center gap-3",
                type === 'before' ? "border-zinc-700 bg-zinc-900" : "border-emerald-500/30 bg-zinc-900"
            )}>
                <Image className={cn("w-10 h-10", type === 'before' ? "text-zinc-600" : "text-emerald-500")} />
                <span className={cn("font-mono text-xs font-bold", type === 'before' ? "text-zinc-500" : "text-emerald-400")}>
                    {type === 'before' ? 'IMG_4928.HEIC' : 'IMG_4928.jpg'}
                </span>
                <span className="text-zinc-600 text-[10px]">
                    {type === 'before' ? '3.2 MB · Apple only' : '1.8 MB · Universal'}
                </span>
            </div>
            {type === 'before' ? (
                <div className="text-[10px] text-zinc-600 uppercase tracking-widest text-center">
                    ✗ Won&apos;t open on Windows<br />✗ Won&apos;t open on Android
                </div>
            ) : (
                <div className="text-[10px] text-emerald-600 uppercase tracking-widest text-center">
                    ✓ Opens everywhere<br />✓ Web compatible
                </div>
            )}
        </div>
    </div>
));
HeicProof.displayName = 'HeicProof';

/** Unlock PDF */
const UnlockProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center gap-6 p-8">
        <Label text={type === 'before' ? 'Password Protected' : 'Unlocked & Free'} type={type} />
        <div className={cn(
            "relative w-48 h-64 border-2 flex flex-col items-start p-4 gap-2 mt-4",
            type === 'before' ? "border-zinc-700 bg-zinc-900" : "border-emerald-500/30 bg-zinc-900"
        )}>
            <div className="h-2 w-32 bg-zinc-800 rounded" />
            <div className="h-2 w-full bg-zinc-800 rounded" />
            <div className="h-2 w-full bg-zinc-800 rounded" />
            {type === 'before' && (
                <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-zinc-400" />
                    </div>
                    <span className="text-zinc-500 text-[10px] uppercase tracking-widest">Password Required</span>
                </div>
            )}
            {type === 'after' && (
                <>
                    <div className="h-2 w-full bg-zinc-800 rounded" />
                    <div className="h-2 w-3/4 bg-zinc-800 rounded" />
                    <div className="h-20 w-full bg-zinc-800/40 border border-zinc-800 rounded mt-2" />
                    <div className="mt-auto flex items-center gap-2 text-emerald-500">
                        <Lock className="w-3 h-3" />
                        <span className="text-[9px] uppercase tracking-widest">Restrictions Removed</span>
                    </div>
                </>
            )}
        </div>
    </div>
));
UnlockProof.displayName = 'UnlockProof';

/** SVG → PNG */
const SvgToPngProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-8">
        <Label text={type === 'before' ? 'SVG Vector' : 'PNG Raster'} type={type} />
        <div className="flex flex-col items-center gap-6 mt-8">
            <div className={cn(
                "w-48 h-48 border-2 flex items-center justify-center",
                type === 'before' ? "border-zinc-700 bg-zinc-900" : "border-emerald-500/30 bg-zinc-900"
            )}>
                {type === 'before' ? (
                    <div className="text-center space-y-2">
                        <Code className="w-10 h-10 text-zinc-500 mx-auto" />
                        <div className="font-mono text-[9px] text-zinc-600 text-left leading-relaxed px-4">
                            {`<svg viewBox="0 0 24 24">`}<br />
                            {`  <path d="M12 2L2`}<br />
                            {`  22h20L12 2z"/>`}<br />
                            {`</svg>`}
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-2">
                        <div className="w-20 h-20 mx-auto relative">
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#27272a_0px,#27272a_4px,#1c1c1e_4px,#1c1c1e_8px)]" />
                            <div className="absolute inset-4 bg-emerald-500 clip-triangle" style={{
                                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                            }} />
                        </div>
                        <span className="text-emerald-400 font-mono text-[10px]">2048 × 2048 px</span>
                    </div>
                )}
            </div>
            <span className="text-zinc-600 text-[10px] uppercase tracking-widest">
                {type === 'before' ? 'Vector markup — no pixels' : 'Pixel-perfect raster export'}
            </span>
        </div>
    </div>
));
SvgToPngProof.displayName = 'SvgToPngProof';

/** PDF → Word */
const PdfToDocxProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-8">
        <Label text={type === 'before' ? 'Locked PDF' : 'Editable DOCX'} type={type} />
        <div className="flex flex-col items-center gap-4 mt-8">
            <div className={cn(
                "w-44 h-56 border-2 flex flex-col p-3 gap-2",
                type === 'before' ? "border-zinc-700 bg-zinc-900" : "border-emerald-500/30 bg-zinc-900"
            )}>
                <div className={cn("text-[10px] font-bold uppercase tracking-widest mb-2",
                    type === 'before' ? "text-zinc-600" : "text-emerald-500")}>
                    {type === 'before' ? 'report.pdf' : 'report.docx'}
                </div>
                {[100, 75, 100, 50, 85, 65].map((w, i) => (
                    <div key={i} className={cn("h-1.5 rounded-sm", type === 'before' ? "bg-zinc-800" : "bg-zinc-700")}
                        style={{ width: `${w}%` }} />
                ))}
                {type === 'before' ? (
                    <div className="mt-auto flex items-center justify-center py-2 border border-zinc-800 text-zinc-600 text-[9px] uppercase tracking-widest gap-1">
                        <Lock className="w-2.5 h-2.5" /> Read-only
                    </div>
                ) : (
                    <div className="mt-auto flex items-center justify-center py-2 border border-emerald-500/30 text-emerald-500 text-[9px] uppercase tracking-widest gap-1">
                        ✏️ Fully Editable
                    </div>
                )}
            </div>
        </div>
    </div>
));
PdfToDocxProof.displayName = 'PdfToDocxProof';

/** PDF → Images */
const PdfToImgProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-8">
        <Label text={type === 'before' ? 'PDF Document' : 'PNG Pages'} type={type} />
        {type === 'before' ? (
            <div className="flex flex-col items-center gap-4 mt-8">
                <div className="w-40 h-52 bg-zinc-900 border border-zinc-700 flex flex-col p-4 gap-2">
                    <div className="h-2 w-full bg-zinc-800 rounded" />
                    <div className="h-2 w-3/4 bg-zinc-800 rounded" />
                    <div className="h-32 bg-zinc-800/40 border border-zinc-800 rounded mt-2" />
                    <div className="h-2 w-full bg-zinc-800 rounded mt-2" />
                </div>
                <span className="text-zinc-600 text-[10px] uppercase tracking-widest">12-page document</span>
            </div>
        ) : (
            <div className="flex flex-col items-center gap-4 mt-8">
                <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="w-24 h-32 bg-zinc-900 border border-emerald-500/20 flex flex-col items-center justify-center gap-2">
                            <Image className="w-5 h-5 text-emerald-500" />
                            <span className="text-[9px] text-zinc-500 font-mono">page_{i}.png</span>
                        </div>
                    ))}
                </div>
                <span className="text-emerald-600 text-[10px] uppercase tracking-widest">High-res · Lossless</span>
            </div>
        )}
    </div>
));
PdfToImgProof.displayName = 'PdfToImgProof';

/** PDF Split */
const PdfSplitProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-8">
        <Label text={type === 'before' ? 'Single PDF' : 'Split into Ranges'} type={type} />
        {type === 'before' ? (
            <div className="flex flex-col items-center gap-4 mt-8">
                <div className="relative w-36 h-48">
                    {[2, 1, 0].map(i => (
                        <div key={i} className="absolute w-36 h-48 bg-zinc-900 border border-zinc-700"
                            style={{ top: i * 4, left: i * 4 }}>
                        </div>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-zinc-500 text-xs font-mono">24 pages</span>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex gap-3 mt-8">
                {[
                    { label: 'pp. 1–8', color: 'border-emerald-500/30 text-emerald-500' },
                    { label: 'pp. 9–16', color: 'border-zinc-700 text-zinc-500' },
                    { label: 'pp. 17–24', color: 'border-zinc-700 text-zinc-500' },
                ].map((s, i) => (
                    <div key={i} className={cn("w-24 h-32 bg-zinc-900 border-2 flex flex-col items-center justify-center gap-2", s.color)}>
                        <Scissors className={cn("w-4 h-4", s.color.includes('emerald') ? 'text-emerald-500' : 'text-zinc-600')} />
                        <span className={cn("text-[9px] font-mono text-center", s.color)}>{s.label}</span>
                    </div>
                ))}
            </div>
        )}
    </div>
));
PdfSplitProof.displayName = 'PdfSplitProof';

/** Media Converter */
const MediaConverterProof = memo(({ type }: { type: 'before' | 'after' }) => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center p-8">
        <Label text={type === 'before' ? 'MP4 Video' : 'MP3 Audio'} type={type} />
        <div className="flex flex-col items-center gap-6 mt-8">
            {type === 'before' ? (
                <div className="w-56 h-32 bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center gap-3">
                    <Video className="w-8 h-8 text-zinc-500" />
                    <span className="text-zinc-400 font-mono text-xs">interview.mp4 · 148 MB</span>
                    <div className="flex gap-2 items-center">
                        <div className="w-20 h-1 bg-zinc-700 rounded">
                            <div className="w-8 h-1 bg-zinc-500 rounded" />
                        </div>
                        <span className="text-zinc-600 text-[9px]">2:34</span>
                    </div>
                </div>
            ) : (
                <div className="w-56 h-32 bg-zinc-900 border border-emerald-500/30 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-emerald-400 font-mono text-xs">interview.mp3 · 3.2 MB</span>
                    <div className="flex gap-1 items-end h-5">
                        {[3, 6, 4, 8, 5, 7, 3, 6, 4, 8, 5, 7, 4].map((h, i) => (
                            <div key={i} className="w-1 bg-emerald-500/60 rounded-sm" style={{ height: `${h * 2}px` }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
));
MediaConverterProof.displayName = 'MediaConverterProof';

// ─── Shared Label ─────────────────────────────────────────────────────────────

const Label = memo(({ text, type }: { text: string; type: 'before' | 'after' }) => (
    <div className={cn(
        "absolute top-4 left-4 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest z-10",
        type === 'before' ? "bg-white text-black" : "bg-black text-white border border-white/20"
    )}>
        {text}
    </div>
));
Label.displayName = 'Label';

// ─── Main VisualProof ─────────────────────────────────────────────────────────

interface VisualProofProps {
    toolId: string;
    mode?: 'card' | 'full';
    className?: string;
}

const captions: Record<string, string> = {
    'redactor': 'Before & After: PDF Redaction',
    'compress': 'Before & After: Image Compression',
    'clean-exif': 'Before & After: Metadata Cleaning',
    'blur': 'Before & After: Image Enhancement',
    'encrypt': 'Before & After: Text Encryption',
    'password': 'Before & After: Password Generation',
    'merger': 'Before & After: PDF Merging',
    'heic': 'Before & After: HEIC Conversion',
    'unlock': 'Before & After: PDF Unlocking',
    'svg-to-png': 'Before & After: SVG → PNG',
    'pdf-to-docx': 'Before & After: PDF → Word',
    'pdf-to-img': 'Before & After: PDF → Images',
    'pdf-split': 'Before & After: PDF Splitting',
    'media-converter': 'Before & After: Media Conversion',
};

export const VisualProof = memo(({ toolId, mode = 'full', className }: VisualProofProps) => {
    const caption = captions[toolId] || 'Privacy in Action';

    const render = (type: 'before' | 'after') => {
        switch (toolId) {
            case 'redactor': return <RedactorProof type={type} />;
            case 'compress': return (
                <ImageProof
                    type={type}
                    url="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800"
                    beforeLabel="12.5 MB"
                    afterLabel="0.8 MB"
                />
            );
            case 'clean-exif': return <CleanExifProof type={type} />;
            case 'blur': return <BlurProof type={type} />;
            case 'encrypt': return <EncryptProof type={type} />;
            case 'password': return <PasswordProof type={type} />;
            case 'merger': return <MergeProof type={type} />;
            case 'heic': return <HeicProof type={type} />;
            case 'unlock': return <UnlockProof type={type} />;
            case 'svg-to-png': return <SvgToPngProof type={type} />;
            case 'pdf-to-docx': return <PdfToDocxProof type={type} />;
            case 'pdf-to-img': return <PdfToImgProof type={type} />;
            case 'pdf-split': return <PdfSplitProof type={type} />;
            case 'media-converter': return <MediaConverterProof type={type} />;
            default: return (
                <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
                    <span className="text-zinc-700 font-mono text-xs">{toolId} · {type}</span>
                </div>
            );
        }
    };

    return (
        <div className={cn("w-full space-y-6", className)}>
            {/* Label */}
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Visual Proof</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <h3 className="text-xl font-black uppercase tracking-tight text-white">
                {caption}
            </h3>

            {/* Full-width split */}
            <div className="w-full grid grid-cols-2 gap-2 overflow-hidden">
                <div className="relative aspect-video bg-black overflow-hidden">
                    <div className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest text-white/30 z-10">before</div>
                    {render('before')}
                </div>
                <div className="relative aspect-video bg-black overflow-hidden">
                    <div className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest text-white/30 z-10">after</div>
                    {render('after')}
                </div>
            </div>

            {/* Footer badges */}
            <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-zinc-600">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">Full Bit Integrity</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">Zero Cloud Metadata</span>
                </div>
            </div>
        </div>
    );
});

VisualProof.displayName = 'VisualProof';
