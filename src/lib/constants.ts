export const PLATFORM_FEE_PERCENT = 10;
export const SEARCH_RADIUS_KM = 100;
export const LOCATION_UPDATE_INTERVAL_MS = 4000;

export const TRUCK_TYPES = [
  { value: "3/4", label: "3/4", capacity: "4-6 cabecas" },
  { value: "toco", label: "Toco", capacity: "8-12 cabecas" },
  { value: "truck", label: "Truck", capacity: "12-18 cabecas" },
  { value: "carreta", label: "Carreta", capacity: "18-27 cabecas" },
  { value: "julieta", label: "Julieta", capacity: "27-42 cabecas" },
] as const;

export const FREIGHT_STATUS_LABELS: Record<string, string> = {
  pending: "Aguardando motorista",
  negotiating: "Em negociacao",
  accepted: "Aceito",
  in_transit: "Em transito",
  delivered: "Entregue",
  paid: "Pago",
  cancelled: "Cancelado",
};

export const FREIGHT_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  negotiating: "bg-blue-500/20 text-blue-400",
  accepted: "bg-green-500/20 text-green-400",
  in_transit: "bg-purple-500/20 text-purple-400",
  delivered: "bg-emerald-500/20 text-emerald-400",
  paid: "bg-primary/20 text-primary",
  cancelled: "bg-red-500/20 text-red-400",
};

export const PAYMENT_METHODS = [
  { value: "pix", label: "PIX", icon: "Smartphone" },
  { value: "credit_card", label: "Cartao de Credito", icon: "CreditCard" },
  { value: "cash", label: "Dinheiro", icon: "Banknote" },
] as const;

export const DARK_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
export const DARK_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

export const DEFAULT_CENTER = { lat: -10.8833, lng: -61.9514 }; // Ji-Parana, Rondonia
export const DEFAULT_ZOOM = 12;
