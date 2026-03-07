"use client";

import { TrendingUp } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { formatCurrency } from "@/lib/utils";

export default function DriverWalletPage() {
  return (
    <div className="h-full flex flex-col">
      <Header title="Carteira" />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="p-6 rounded-2xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Saldo disponivel</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(0)}</p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Total ganho</p>
              <p className="text-sm font-semibold text-foreground">{formatCurrency(0)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Taxas pagas</p>
              <p className="text-sm font-semibold text-foreground">{formatCurrency(0)}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-16 text-muted-foreground">
          <TrendingUp className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">Sem movimentacoes</p>
          <p className="text-xs mt-1 opacity-60 text-center">Complete fretes para ver seu historico financeiro</p>
        </div>
      </div>
    </div>
  );
}
