"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
  className?: string;
}

export function Header({ title, showBack = false, right, className }: HeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "flex-shrink-0 h-14 flex items-center justify-between px-4 bg-card border-b border-border safe-top",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      {right && <div>{right}</div>}
    </header>
  );
}
