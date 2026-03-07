"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, Power } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export default function DriverHomePage() {
  const { user } = useAuthStore();
  const [isOnline, setIsOnline] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <Header
        title={`Ola, ${user?.full_name?.split(" ")[0] || "Motorista"}`}
        right={
          <button
            type="button"
            onClick={() => setIsOnline(!isOnline)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              isOnline ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
            )}
          >
            <Power className="w-3 h-3" />
            {isOnline ? "Online" : "Offline"}
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!isOnline ? (
          <motion.div className="flex-1 flex flex-col items-center justify-center h-full text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Power className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Voce esta offline</p>
            <p className="text-sm mt-1 text-center px-8 opacity-60">Fique online para receber solicitacoes de frete</p>
          </motion.div>
        ) : (
          <motion.div className="flex flex-col items-center justify-center h-full text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Package className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Aguardando fretes</p>
            <p className="text-sm mt-1 text-center px-8 opacity-60">Novos fretes aparecerao aqui quando produtores solicitarem na sua regiao</p>
            <div className="flex items-center gap-1 mt-4 text-xs text-primary">
              <MapPin className="w-3 h-3" />
              <span>Raio de 100km ativo</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
