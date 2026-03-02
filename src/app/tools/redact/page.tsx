import type { Metadata } from "next";
import RedactClient from "@/components/RedactClient";

export const metadata: Metadata = {
    title: "Secure PDF Redactor",
    description: "Permanently blackout sensitive information in PDFs. 100% client-side rasterization ensures zero-trace data removal.",
    keywords: ["pdf redaction tool", "secure blackout pdf", "private pdf editor", "offline redaction", "vaultnode redact"]
};

export default function RedactPage() {
    return <RedactClient />;
}
