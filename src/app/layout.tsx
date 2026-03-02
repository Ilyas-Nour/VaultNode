import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | VaultNode",
    default: "VaultNode | 100% Private Local Media Tools",
  },
  description: "Secure, 100% private, and local browser processing for your media. Zero uploads. VaultNode handles PDFs and images directly in your RAM using WebAssembly.",
  keywords: ["private pdf redactor", "local image compressor", "secure media tools", "browser-side pdf editing", "zero upload privacy", "offline media tools"],
  openGraph: {
    title: "VaultNode | Private Local Media Tools",
    description: "Zero-upload PDF editing and media compression. Your privacy is our architecture.",
    type: "website",
    url: "https://vaultnode.com",
    siteName: "VaultNode",
  },
  twitter: {
    card: "summary_large_image",
    title: "VaultNode | 100% Private Media Tools",
    description: "Pure client-side processing. No servers. No uploads. Just privacy.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
