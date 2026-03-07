import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "Minimo 6 caracteres"),
});

export const registerSchema = z
  .object({
    full_name: z.string().min(3, "Nome completo obrigatorio"),
    email: z.string().email("Email invalido"),
    phone: z
      .string()
      .min(10, "Telefone invalido")
      .max(15, "Telefone invalido"),
    document: z.string().min(11, "CPF/CNPJ invalido").max(18, "CPF/CNPJ invalido"),
    password: z.string().min(6, "Minimo 6 caracteres"),
    confirm_password: z.string(),
    role: z.enum(["producer", "driver"]),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Senhas nao conferem",
    path: ["confirm_password"],
  });

export const vehicleSchema = z.object({
  type: z.enum(["3/4", "toco", "truck", "carreta", "julieta"]),
  plate: z.string().min(7, "Placa invalida").max(8, "Placa invalida"),
  capacity_heads: z.number().min(1, "Capacidade obrigatoria").max(50),
  brand: z.string().min(2, "Marca obrigatoria"),
  model: z.string().min(2, "Modelo obrigatorio"),
  year: z.number().min(1990, "Ano minimo 1990").max(new Date().getFullYear() + 1, "Ano invalido"),
});

export const freightSchema = z.object({
  origin_address: z.string().min(5, "Endereco de origem obrigatorio"),
  origin_lat: z.number(),
  origin_lng: z.number(),
  destination_address: z.string().min(5, "Endereco de destino obrigatorio"),
  dest_lat: z.number(),
  dest_lng: z.number(),
  cargo_type: z.string().default("gado"),
  cargo_quantity: z.coerce.number().min(1, "Quantidade obrigatoria"),
  truck_type_required: z.enum(["3/4", "toco", "truck", "carreta", "julieta"]),
});

export const negotiationSchema = z.object({
  rate_per_km: z.coerce.number().min(0.5, "Valor minimo R$0,50/km"),
  message: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VehicleFormData = z.infer<typeof vehicleSchema>;
export type FreightFormData = z.infer<typeof freightSchema>;
export type NegotiationFormData = z.infer<typeof negotiationSchema>;
