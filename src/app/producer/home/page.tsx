"use client";

import { MapPin, Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

export default function ProducerHomePage() {
  const { user } = useAuthStore();

  return (
    <div className="h-full flex flex-col">
      <Header
        title={`Ola, ${user?.full_name?.split(" ")[0] || "Produtor"}`}
        right={
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">
              {user?.full_name?.charAt(0) || "P"}
            </span>
          </div>
        }
      />

      <div className="flex-1 bg-secondary relative flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Mapa sera carregado na Fase 2</p>
          <p className="text-xs mt-1 opacity-60">Ji-Parana, RO</p>
        </div>

        <Button
          size="lg"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 shadow-lg shadow-primary/20 gap-2 px-8"
        >
          <Plus className="w-5 h-5" />
          Solicitar Transporte
        </Button>
      </div>
    </div>
  );
}
