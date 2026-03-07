"use client";

import { Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default function ProducerHistoryPage() {
  return (
    <div className="h-full flex flex-col">
      <Header title="Meus Fretes" />
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground px-6">
        <Clock className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm font-medium">Nenhum frete ainda</p>
        <p className="text-xs mt-1 opacity-60 text-center">
          Seus fretes aparecerao aqui
        </p>
      </div>
    </div>
  );
}
