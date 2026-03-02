import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VaultNode | Private Local PDF Tools",
  description: "100% client-side PDF and media processing. Your files never leave your browser. Fast, secure, and private.",
  openGraph: {
    title: "VaultNode | Private Local PDF Tools",
    description: "Zero-upload PDF editing and media compression.",
    type: "website",
    url: "https://vaultnode.com",
  },
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
