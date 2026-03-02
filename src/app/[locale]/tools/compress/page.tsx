import type { Metadata } from "next";
import CompressClient from "@/components/CompressClient";

export const metadata: Metadata = {
    title: "Smart Image Compressor",
    description: "Shrink images without data leaks. Fast, 100% local browser-side compression for JPG, PNG, and WebP.",
    keywords: ["image compressor", "private image shrinker", "client-side photo compression", "secure image optimization", "vaultnode compress"]
};

export default function CompressPage() {
    return <CompressClient />;
}
