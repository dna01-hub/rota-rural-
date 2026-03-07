"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Phone,
  FileText,
  MapPin,
  Star,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { createClient } from "@/lib/supabase/client";

export default function ProducerProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    logout();
    toast.success("Ate mais!");
    router.replace("/login");
  };

  const infoItems = [
    { icon: <Phone className="w-4 h-4" />, label: "Telefone", value: user?.phone || "-" },
    { icon: <FileText className="w-4 h-4" />, label: "Documento", value: user?.document || "-" },
    { icon: <MapPin className="w-4 h-4" />, label: "Cidade", value: user?.city && user?.state ? `${user.city}, ${user.state}` : "Nao informado" },
    { icon: <Star className="w-4 h-4" />, label: "Avaliacao", value: user?.rating_count && user.rating_count > 0 ? `${user.rating_avg?.toFixed(1)} (${user.rating_count} avaliacoes)` : "Sem avaliacoes" },
  ];

  return (
    <div className="h-full flex flex-col">
      <Header title="Meu Perfil" />
      <div className="flex-1 overflow-y-auto">
        <motion.div className="flex flex-col items-center py-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-primary">{user?.full_name?.charAt(0) || "P"}</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">{user?.full_name || "Produtor"}</h2>
          <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full mt-1">Produtor</span>
        </motion.div>

        <div className="px-4 space-y-1">
          {infoItems.map((item, i) => (
            <motion.div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-card" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="text-muted-foreground">{item.icon}</div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm text-foreground">{item.value}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </motion.div>
          ))}
        </div>

        <div className="px-4 py-8">
          <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair da conta
          </Button>
        </div>
      </div>
    </div>
  );
}
