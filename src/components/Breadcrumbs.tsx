import React from 'react';
import { Link } from '@/i18n/routing';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbsProps {
    items: {
        label: string;
        href: string;
        active?: boolean;
    }[];
    className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Link
                    href="/"
                    className="text-zinc-600 hover:text-white transition-colors flex items-center gap-1"
                >
                    <Home className="w-3 h-3" />
                    Vault
                </Link>
                
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <ChevronRight className="w-3 h-3 text-zinc-800" />
                        {item.active ? (
                            <span className="text-zinc-400 select-none">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-zinc-600 hover:text-white transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </nav>
    );
};
