export type UserRole = "producer" | "driver" | "admin";

export type TruckType = "3/4" | "toco" | "truck" | "carreta" | "julieta";

export type FreightStatus =
  | "pending"
  | "negotiating"
  | "accepted"
  | "in_transit"
  | "delivered"
  | "paid"
  | "cancelled";

export type PaymentMethod = "pix" | "credit_card" | "cash";

export type NegotiationStatus = "pending" | "accepted" | "rejected" | "countered";

export type PaymentStatus = "pending" | "processing" | "completed" | "failed";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string;
  document: string;
  avatar_url: string | null;
  city: string;
  state: string;
  rating_avg: number;
  rating_count: number;
  is_active: boolean;
  created_at: string;
}

export interface Vehicle {
  id: string;
  driver_id: string;
  type: TruckType;
  plate: string;
  capacity_heads: number;
  brand: string;
  model: string;
  year: number;
  is_active: boolean;
}

export interface Freight {
  id: string;
  code: string;
  producer_id: string;
  driver_id: string | null;
  origin_address: string;
  origin_lat: number;
  origin_lng: number;
  destination_address: string;
  dest_lat: number;
  dest_lng: number;
  distance_km: number;
  cargo_type: string;
  cargo_quantity: number;
  truck_type_required: TruckType;
  status: FreightStatus;
  final_rate_per_km: number | null;
  total_value: number | null;
  platform_fee: number | null;
  payment_method: PaymentMethod | null;
  created_at: string;
  accepted_at: string | null;
  delivered_at: string | null;
  paid_at: string | null;
  producer?: Profile;
  driver?: Profile;
}

export interface Negotiation {
  id: string;
  freight_id: string;
  sender_id: string;
  sender_role: UserRole;
  rate_per_km: number;
  total_value: number;
  message: string | null;
  status: NegotiationStatus;
  created_at: string;
  sender?: Profile;
}

export interface DriverLocation {
  id: string;
  driver_id: string;
  lat: number;
  lng: number;
  is_online: boolean;
  heading: number;
  updated_at: string;
  driver?: Profile;
  vehicle?: Vehicle;
  distance_km?: number;
}

export interface Payment {
  id: string;
  freight_id: string;
  payer_id: string;
  payee_id: string;
  total_amount: number;
  platform_fee: number;
  driver_amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  mp_transaction_id: string | null;
  created_at: string;
}

export interface DriverWallet {
  id: string;
  driver_id: string;
  balance: number;
  total_earned: number;
  total_fees_paid: number;
  is_blocked: boolean;
}

export interface Rating {
  id: string;
  freight_id: string;
  rater_id: string;
  rated_id: string;
  score: number;
  comment: string | null;
  created_at: string;
  rater?: Profile;
}

export interface Message {
  id: string;
  freight_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}
