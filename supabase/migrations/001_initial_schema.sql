-- Enums
CREATE TYPE user_role AS ENUM ('producer', 'driver', 'admin');
CREATE TYPE truck_type AS ENUM ('3/4', 'toco', 'truck', 'carreta', 'julieta');
CREATE TYPE freight_status AS ENUM ('pending', 'negotiating', 'accepted', 'in_transit', 'delivered', 'paid', 'cancelled');
CREATE TYPE payment_method AS ENUM ('pix', 'credit_card', 'cash');
CREATE TYPE negotiation_status AS ENUM ('pending', 'accepted', 'rejected', 'countered');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  document TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  city TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  rating_avg DECIMAL(2,1) NOT NULL DEFAULT 0,
  rating_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vehicles
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type truck_type NOT NULL,
  plate TEXT NOT NULL,
  capacity_heads INT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(driver_id, is_active)
);

-- Freights
CREATE TABLE freights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  producer_id UUID NOT NULL REFERENCES profiles(id),
  driver_id UUID REFERENCES profiles(id),
  origin_address TEXT NOT NULL,
  origin_lat DECIMAL NOT NULL,
  origin_lng DECIMAL NOT NULL,
  destination_address TEXT NOT NULL,
  dest_lat DECIMAL NOT NULL,
  dest_lng DECIMAL NOT NULL,
  distance_km DECIMAL NOT NULL,
  cargo_type TEXT NOT NULL DEFAULT 'gado',
  cargo_quantity INT NOT NULL,
  truck_type_required truck_type NOT NULL,
  status freight_status NOT NULL DEFAULT 'pending',
  final_rate_per_km DECIMAL,
  total_value DECIMAL,
  platform_fee DECIMAL,
  payment_method payment_method,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

-- Negotiations
CREATE TABLE negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freight_id UUID NOT NULL REFERENCES freights(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  sender_role user_role NOT NULL,
  rate_per_km DECIMAL NOT NULL,
  total_value DECIMAL NOT NULL,
  message TEXT,
  status negotiation_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Driver locations
CREATE TABLE driver_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  lat DECIMAL NOT NULL,
  lng DECIMAL NOT NULL,
  is_online BOOLEAN NOT NULL DEFAULT false,
  heading DECIMAL NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freight_id UUID NOT NULL REFERENCES freights(id),
  payer_id UUID NOT NULL REFERENCES profiles(id),
  payee_id UUID NOT NULL REFERENCES profiles(id),
  total_amount DECIMAL NOT NULL,
  platform_fee DECIMAL NOT NULL,
  driver_amount DECIMAL NOT NULL,
  method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  mp_transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Driver wallets
CREATE TABLE driver_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL NOT NULL DEFAULT 0,
  total_earned DECIMAL NOT NULL DEFAULT 0,
  total_fees_paid DECIMAL NOT NULL DEFAULT 0,
  is_blocked BOOLEAN NOT NULL DEFAULT false
);

-- Ratings
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freight_id UUID NOT NULL REFERENCES freights(id),
  rater_id UUID NOT NULL REFERENCES profiles(id),
  rated_id UUID NOT NULL REFERENCES profiles(id),
  score INT NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(freight_id, rater_id)
);

-- Messages (chat in-app)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freight_id UUID NOT NULL REFERENCES freights(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_freights_producer ON freights(producer_id);
CREATE INDEX idx_freights_driver ON freights(driver_id);
CREATE INDEX idx_freights_status ON freights(status);
CREATE INDEX idx_negotiations_freight ON negotiations(freight_id);
CREATE INDEX idx_driver_locations_online ON driver_locations(is_online) WHERE is_online = true;
CREATE INDEX idx_messages_freight ON messages(freight_id);
CREATE INDEX idx_messages_created ON messages(freight_id, created_at);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE driver_locations;
ALTER PUBLICATION supabase_realtime ADD TABLE negotiations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE freights;
