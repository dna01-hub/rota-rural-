"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  FileText,
  MapPin,
  Star,
  LogOut,
  Truck,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useAuthStore } from "@/stores/auth-store";
import { createClient } from "@/lib/supabase/client";
import { vehicleSchema, type VehicleFormData } from "@/lib/validators";
import { TRUCK_TYPES } from "@/lib/constants";

export default function DriverProfilePage() {
  const router = useRouter();
  const { user, vehicle, logout, setVehicle } = useAuthStore();
  const [showVehicleForm, setShowVehicleForm] = useState(!vehicle);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle
      ? {
          type: vehicle.type,
          plate: vehicle.plate,
          capacity_heads: vehicle.capacity_heads,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
        }
      : undefined,
  });

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    logout();
    toast.success("Ate mais!");
    router.replace("/login");
  };

  const onSubmitVehicle = async (data: VehicleFormData) => {
    if (!user) return;
    setLoading(true);
    try {
      const supabase = createClient();

      if (vehicle) {
        const { data: updated, error } = await supabase
          .from("vehicles")
          .update({ ...data })
          .eq("id", vehicle.id)
          .select()
          .single();
        if (error) throw error;
        if (updated) {
          setVehicle(updated);
          toast.success("Veiculo atualizado!");
        }
      } else {
        const { data: created, error } = await supabase
          .from("vehicles")
          .insert({
            driver_id: user.id,
            ...data,
            is_active: true,
          })
          .select()
          .single();
        if (error) throw error;
        if (created) {
          setVehicle(created);
          toast.success("Veiculo cadastrado!");
        }
      }
      setShowVehicleForm(false);
    } catch {
      toast.error("Erro ao salvar veiculo");
    } finally {
      setLoading(false);
    }
  };

  const infoItems = [
    { icon: <Phone className="w-4 h-4" />, label: "Telefone", value: user?.phone || "-" },
    { icon: <FileText className="w-4 h-4" />, label: "Documento", value: user?.document || "-" },
    { icon: <MapPin className="w-4 h-4" />, label: "Cidade", value: user?.city && user?.state ? `${user.city}, ${user.state}` : "Nao informado" },
    { icon: <Star className="w-4 h-4" />, label: "Avaliacao", value: user?.rating_count && user.rating_count > 0 ? `${user.rating_avg?.toFixed(1)} (${user.rating_count})` : "Sem avaliacoes" },
  ];

  return (
    <div className="h-full flex flex-col">
      <Header title="Meu Perfil" />

      <div className="flex-1 overflow-y-auto">
        {/* Avatar */}
        <motion.div className="flex flex-col items-center py-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-primary">{user?.full_name?.charAt(0) || "M"}</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">{user?.full_name || "Motorista"}</h2>
          <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full mt-1">Motorista</span>
        </motion.div>

        {/* Info */}
        <div className="px-4 space-y-1 mb-4">
          {infoItems.map((item, i) => (
            <motion.div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-card" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="text-muted-foreground">{item.icon}</div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm text-foreground">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Vehicle section */}
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              Meu Veiculo
            </h3>
            {vehicle && !showVehicleForm && (
              <button type="button" onClick={() => setShowVehicleForm(true)} className="text-xs text-primary hover:underline">
                Editar
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {vehicle && !showVehicleForm ? (
              <motion.div key="vehicle-info" className="p-4 rounded-2xl bg-card border border-border" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{vehicle.brand} {vehicle.model}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.year}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {TRUCK_TYPES.find((t) => t.value === vehicle.type)?.label || vehicle.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 pt-3 border-t border-border text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Placa</p>
                    <p className="font-mono text-foreground">{vehicle.plate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Capacidade</p>
                    <p className="text-foreground">{vehicle.capacity_heads} cabecas</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.form key="vehicle-form" className="p-4 rounded-2xl bg-card border border-border space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onSubmit={handleSubmit(onSubmitVehicle)}>
                <p className="text-sm font-medium text-foreground mb-2">
                  {vehicle ? "Editar veiculo" : "Cadastrar veiculo"}
                </p>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select {...register("type")}>
                    <option value="">Selecione o tipo</option>
                    {TRUCK_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label} ({t.capacity})</option>
                    ))}
                  </Select>
                  {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Marca</Label>
                    <Input placeholder="Mercedes" {...register("brand")} />
                    {errors.brand && <p className="text-xs text-destructive">{errors.brand.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Modelo</Label>
                    <Input placeholder="Atego" {...register("model")} />
                    {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Placa</Label>
                    <Input placeholder="ABC1D23" className="uppercase font-mono" {...register("plate")} />
                    {errors.plate && <p className="text-xs text-destructive">{errors.plate.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Ano</Label>
                    <Input type="number" placeholder="2020" {...register("year", { valueAsNumber: true })} />
                    {errors.year && <p className="text-xs text-destructive">{errors.year.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Capacidade</Label>
                    <Input type="number" placeholder="20" {...register("capacity_heads", { valueAsNumber: true })} />
                    {errors.capacity_heads && <p className="text-xs text-destructive">{errors.capacity_heads.message}</p>}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {vehicle && (
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowVehicleForm(false)}>
                      Cancelar
                    </Button>
                  )}
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" />Salvar</>}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Logout */}
        <div className="px-4 py-6">
          <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair da conta
          </Button>
        </div>
      </div>
    </div>
  );
}
