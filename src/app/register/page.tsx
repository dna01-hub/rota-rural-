"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  FileText,
  Eye,
  EyeOff,
  Loader2,
  Truck,
  Tractor,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterFormData } from "@/lib/validators";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
type RegisterRole = "producer" | "driver";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"role" | "form">("role");
  const [selectedRole, setSelectedRole] = useState<RegisterRole | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectRole = (role: RegisterRole) => {
    setSelectedRole(role);
    setValue("role", role);
    setStep("form");
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const supabase = createClient();

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: data.role,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (authData.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            role: data.role,
            full_name: data.full_name,
            phone: data.phone,
            document: data.document,
            city: "",
            state: "RO",
          })
          .select()
          .single();

        if (profileError) {
          toast.error("Erro ao criar perfil");
          return;
        }

        if (profile) {
          setUser(profile);
          toast.success("Conta criada com sucesso!");

          if (data.role === "driver") {
            router.replace("/driver/profile");
          } else {
            router.replace("/producer/home");
          }
        }
      }
    } catch {
      toast.error("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  if (step === "role") {
    return (
      <div className="h-screen flex flex-col bg-background safe-top safe-bottom">
        <motion.div
          className="flex-1 flex flex-col items-center justify-center px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">Como voce quer usar?</h1>
          <p className="text-sm text-muted-foreground mb-10 text-center">Escolha seu perfil para comecar</p>

          <div className="w-full space-y-4">
            <motion.button
              type="button"
              className={cn("w-full p-6 rounded-2xl border-2 border-border bg-card flex items-center gap-4 transition-all", "hover:border-primary/50 active:scale-[0.98]")}
              onClick={() => selectRole("producer")}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Tractor className="w-7 h-7 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-foreground">Produtor</h3>
                <p className="text-sm text-muted-foreground">Preciso transportar meu gado</p>
              </div>
            </motion.button>

            <motion.button
              type="button"
              className={cn("w-full p-6 rounded-2xl border-2 border-border bg-card flex items-center gap-4 transition-all", "hover:border-primary/50 active:scale-[0.98]")}
              onClick={() => selectRole("driver")}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Truck className="w-7 h-7 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-foreground">Motorista</h3>
                <p className="text-sm text-muted-foreground">Quero fazer fretes de gado</p>
              </div>
            </motion.button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Ja tem conta?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">Fazer login</Link>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background safe-top safe-bottom overflow-y-auto">
      <motion.div className="flex-shrink-0 pt-4 pb-4 px-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <button
          type="button"
          onClick={() => setStep("role")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Voltar</span>
        </button>
      </motion.div>

      <motion.div className="px-6 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <h1 className="text-2xl font-bold text-foreground">
          Criar conta como {selectedRole === "producer" ? "Produtor" : "Motorista"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Preencha seus dados para comecar</p>
      </motion.div>

      <motion.form
        className="flex-1 px-6 pb-8 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input type="hidden" {...register("role")} />

        <div className="space-y-2">
          <Label htmlFor="full_name">Nome completo</Label>
          <Input id="full_name" placeholder="Seu nome completo" icon={<User className="w-4 h-4" />} {...register("full_name")} />
          {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="seu@email.com" icon={<Mail className="w-4 h-4" />} {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" type="tel" placeholder="(69) 99999-9999" icon={<Phone className="w-4 h-4" />} {...register("phone")} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="document">CPF ou CNPJ</Label>
          <Input id="document" placeholder="000.000.000-00" icon={<FileText className="w-4 h-4" />} {...register("document")} />
          {errors.document && <p className="text-xs text-destructive">{errors.document.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="Minimo 6 caracteres" icon={<Lock className="w-4 h-4" />} {...register("password")} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password">Confirmar senha</Label>
          <Input id="confirm_password" type="password" placeholder="Repita a senha" icon={<Lock className="w-4 h-4" />} {...register("confirm_password")} />
          {errors.confirm_password && <p className="text-xs text-destructive">{errors.confirm_password.message}</p>}
        </div>

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar conta"}
        </Button>
      </motion.form>
    </div>
  );
}
