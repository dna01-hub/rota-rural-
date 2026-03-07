"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, User, Map, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const producerNav: NavItem[] = [
  { href: "/producer/home", icon: <Map className="w-5 h-5" />, label: "Inicio" },
  { href: "/producer/history", icon: <Clock className="w-5 h-5" />, label: "Fretes" },
  { href: "/producer/profile", icon: <User className="w-5 h-5" />, label: "Perfil" },
];

const driverNav: NavItem[] = [
  { href: "/driver/home", icon: <Home className="w-5 h-5" />, label: "Inicio" },
  { href: "/driver/wallet", icon: <Wallet className="w-5 h-5" />, label: "Carteira" },
  { href: "/driver/history", icon: <Clock className="w-5 h-5" />, label: "Fretes" },
  { href: "/driver/profile", icon: <User className="w-5 h-5" />, label: "Perfil" },
];

export function BottomNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = role === "producer" ? producerNav : driverNav;

  return (
    <nav className="flex-shrink-0 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
