import {
    Eraser, ImageMinus, KeyRound, Lock, Zap, ImagePlus,
    Video, FileUp, FileText, FileStack, Unlock, Wand2, Images, Scissors, Eye,
    PenTool, Stamp, Wrench, Hash, LayoutGrid, Sparkles, UserCircle,
    Projector, Table, FileSpreadsheet, Code, Camera
} from 'lucide-react';

export interface ToolMetadata {
    id: string;
    category: 'vault' | 'media' | 'docs';
    titleKey: string;
    descKey: string;
    icon: any;
    href: string;
    color: string;
}

export const toolsData: ToolMetadata[] = [
    // VAULT
    { id: 'redactor', category: 'vault', titleKey: 'launchRedactor', descKey: 'toolDescriptions.redactor', icon: Eraser, href: '/tools/redact', color: 'text-white' },
    { id: 'clean-exif', category: 'vault', titleKey: 'cleanExif', descKey: 'toolDescriptions.cleanExif', icon: ImageMinus, href: '/tools/clean-exif', color: 'text-white' },
    { id: 'password', category: 'vault', titleKey: 'password', descKey: 'toolDescriptions.password', icon: KeyRound, href: '/tools/password', color: 'text-white' },
    { id: 'encrypt', category: 'vault', titleKey: 'textEncryptor', descKey: 'toolDescriptions.textEncryptor', icon: Lock, href: '/tools/encrypt', color: 'text-white' },
    { id: 'repair', category: 'vault', titleKey: 'repair', descKey: 'toolDescriptions.repair', icon: Wrench, href: '/tools/repair', color: 'text-white' },

    // MEDIA
    { id: 'compress', category: 'media', titleKey: 'imageCompressor', descKey: 'toolDescriptions.compress', icon: Zap, href: '/tools/compress', color: 'text-white' },
    { id: 'heic', category: 'media', titleKey: 'heicToJpg', descKey: 'toolDescriptions.heic', icon: ImagePlus, href: '/tools/heic-to-jpg', color: 'text-white' },
    { id: 'media-converter', category: 'media', titleKey: 'mediaConverter', descKey: 'toolDescriptions.mediaConverter', icon: Video, href: '/tools/media-converter', color: 'text-white' },
    { id: 'svg-to-png', category: 'media', titleKey: 'svgToPng', descKey: 'toolDescriptions.svgToPng', icon: Wand2, href: '/tools/svg-to-png', color: 'text-white' },
    { id: 'enhancer', category: 'media', titleKey: 'imageEnhancer', descKey: 'toolDescriptions.enhancer', icon: Sparkles, href: '/tools/enhancer', color: 'text-white' },
    { id: 'bg-remover', category: 'media', titleKey: 'bgRemover', descKey: 'toolDescriptions.bgRemover', icon: UserCircle, href: '/tools/bg-remover', color: 'text-white' },
    { id: 'blur', category: 'media', titleKey: 'blurTool', descKey: 'toolDescriptions.blur', icon: Eye, href: '/tools/blur', color: 'text-white' },
    { id: 'stamp', category: 'media', titleKey: 'stamp', descKey: 'toolDescriptions.stamp', icon: Stamp, href: '/tools/stamp', color: 'text-white' },

    // DOCS
    { id: 'merger', category: 'docs', titleKey: 'pdfMerger', descKey: 'toolDescriptions.merger', icon: FileStack, href: '/tools/pdf-merge', color: 'text-white' },
    { id: 'pdf-to-word', category: 'docs', titleKey: 'pdfToDocx', descKey: 'toolDescriptions.pdfToWord', icon: FileUp, href: '/tools/pdf-to-docx', color: 'text-white' },
    { id: 'unlock', category: 'docs', titleKey: 'unlockPdf', descKey: 'toolDescriptions.unlock', icon: Unlock, href: '/tools/unlock-pdf', color: 'text-white' },
    { id: 'pdf-to-img', category: 'docs', titleKey: 'pdfToImg', descKey: 'toolDescriptions.pdfToImg', icon: Images, href: '/tools/pdf-to-img', color: 'text-white' },
    { id: 'split', category: 'docs', titleKey: 'pdfSplit', descKey: 'toolDescriptions.split', icon: Scissors, href: '/tools/pdf-split', color: 'text-white' },
    { id: 'sign', category: 'docs', titleKey: 'sign', descKey: 'toolDescriptions.sign', icon: PenTool, href: '/tools/sign', color: 'text-white' },
    { id: 'number-pages', category: 'docs', titleKey: 'numberPages', descKey: 'toolDescriptions.numberPages', icon: Hash, href: '/tools/number-pages', color: 'text-white' },
    { id: 'organize-pages', category: 'docs', titleKey: 'organizePages', descKey: 'toolDescriptions.organizePages', icon: LayoutGrid, href: '/tools/organize-pages', color: 'text-white' },
    { id: 'text-to-word', category: 'docs', titleKey: 'textToDocx', descKey: 'toolDescriptions.textToDocx', icon: FileUp, href: '/tools/text-to-word', color: 'text-white' },
    { id: 'word-to-text', category: 'docs', titleKey: 'docxToText', descKey: 'toolDescriptions.docxToText', icon: FileText, href: '/tools/word-to-text', color: 'text-white' },
    { id: 'word-to-pdf', category: 'docs', titleKey: 'wordToPdf', descKey: 'toolDescriptions.wordToPdf', icon: FileText, href: '/tools/word-to-pdf', color: 'text-white' },
    { id: 'pdf-to-ppt', category: 'docs', titleKey: 'pdfToPpt', descKey: 'toolDescriptions.pdfToPpt', icon: Projector, href: '/tools/pdf-to-ppt', color: 'text-white' },
    { id: 'ppt-to-pdf', category: 'docs', titleKey: 'pptToPdf', descKey: 'toolDescriptions.pptToPdf', icon: FileUp, href: '/tools/ppt-to-pdf', color: 'text-white' },
    { id: 'excel-to-pdf', category: 'docs', titleKey: 'excelToPdf', descKey: 'toolDescriptions.excelToPdf', icon: Table, href: '/tools/excel-to-pdf', color: 'text-white' },
    { id: 'pdf-to-excel', category: 'docs', titleKey: 'pdfToExcel', descKey: 'toolDescriptions.pdfToExcel', icon: FileSpreadsheet, href: '/tools/pdf-to-excel', color: 'text-white' },
    { id: 'html-to-pdf', category: 'docs', titleKey: 'htmlToPdf', descKey: 'toolDescriptions.htmlToPdf', icon: Code, href: '/tools/html-to-pdf', color: 'text-white' },
    { id: 'scan-to-pdf', category: 'docs', titleKey: 'scanToPdf', descKey: 'toolDescriptions.scanToPdf', icon: Camera, href: '/tools/scan-to-pdf', color: 'text-white' },
    { id: 'image-to-text', category: 'docs', titleKey: 'imageToText', descKey: 'toolDescriptions.imageToText', icon: ImagePlus, href: '/tools/image-to-text', color: 'text-white' },
];
