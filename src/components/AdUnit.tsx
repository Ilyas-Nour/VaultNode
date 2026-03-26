"use client";

import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdUnitProps {
    type: "sidebar" | "banner-wide" | "banner-slim" | "skyscraper";
    className?: string;
}

export default function AdUnit({ type, className }: AdUnitProps) {
    const isSidebar = type === "sidebar";
    const isSkyscraper = type === "skyscraper";
    const isBannerWide = type === "banner-wide";
    const isBannerSlim = type === "banner-slim";

    return null;
}
