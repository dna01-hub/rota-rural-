-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE freights ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all profiles but only update their own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Vehicles: public read, driver can manage their own
CREATE POLICY "vehicles_select" ON vehicles FOR SELECT USING (true);
CREATE POLICY "vehicles_insert" ON vehicles FOR INSERT WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "vehicles_update" ON vehicles FOR UPDATE USING (auth.uid() = driver_id);
CREATE POLICY "vehicles_delete" ON vehicles FOR DELETE USING (auth.uid() = driver_id);

-- Freights: producer and driver can see their own, pending visible to drivers
CREATE POLICY "freights_select" ON freights FOR SELECT USING (
  auth.uid() = producer_id OR
  auth.uid() = driver_id OR
  status = 'pending'
);
CREATE POLICY "freights_insert" ON freights FOR INSERT WITH CHECK (auth.uid() = producer_id);
CREATE POLICY "freights_update" ON freights FOR UPDATE USING (
  auth.uid() = producer_id OR auth.uid() = driver_id
);

-- Negotiations: participants can see negotiations for their freights
CREATE POLICY "negotiations_select" ON negotiations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM freights
    WHERE freights.id = negotiations.freight_id
    AND (freights.producer_id = auth.uid() OR freights.driver_id = auth.uid() OR negotiations.sender_id = auth.uid())
  )
);
CREATE POLICY "negotiations_insert" ON negotiations FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "negotiations_update" ON negotiations FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM freights
    WHERE freights.id = negotiations.freight_id
    AND (freights.producer_id = auth.uid() OR freights.driver_id = auth.uid())
  )
);

-- Driver locations: public read for online, driver manages their own
CREATE POLICY "driver_locations_select" ON driver_locations FOR SELECT USING (true);
CREATE POLICY "driver_locations_insert" ON driver_locations FOR INSERT WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "driver_locations_update" ON driver_locations FOR UPDATE USING (auth.uid() = driver_id);

-- Payments: only payer and payee can see
CREATE POLICY "payments_select" ON payments FOR SELECT USING (
  auth.uid() = payer_id OR auth.uid() = payee_id
);
CREATE POLICY "payments_insert" ON payments FOR INSERT WITH CHECK (auth.uid() = payer_id);

-- Driver wallets: only the driver can see their wallet
CREATE POLICY "driver_wallets_select" ON driver_wallets FOR SELECT USING (auth.uid() = driver_id);
CREATE POLICY "driver_wallets_insert" ON driver_wallets FOR INSERT WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "driver_wallets_update" ON driver_wallets FOR UPDATE USING (auth.uid() = driver_id);

-- Ratings: public read, authenticated insert
CREATE POLICY "ratings_select" ON ratings FOR SELECT USING (true);
CREATE POLICY "ratings_insert" ON ratings FOR INSERT WITH CHECK (auth.uid() = rater_id);

-- Messages: ONLY producer and driver of that freight can read/send
-- This ensures phone/personal data never leak between users
CREATE POLICY "messages_select" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM freights
    WHERE freights.id = messages.freight_id
    AND (freights.producer_id = auth.uid() OR freights.driver_id = auth.uid())
  )
);
CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM freights
    WHERE freights.id = messages.freight_id
    AND (freights.producer_id = auth.uid() OR freights.driver_id = auth.uid())
  )
);
CREATE POLICY "messages_update" ON messages FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM freights
    WHERE freights.id = messages.freight_id
    AND (freights.producer_id = auth.uid() OR freights.driver_id = auth.uid())
  )
);
