"use client";

import { BottomNav } from "@/components/layout/BottomNav";

export default function ProducerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto">{children}</div>
      <BottomNav role="producer" />
    </div>
  );
}
