-- Aim N More — Supabase Schema
-- Run this in your Supabase SQL editor at: https://supabase.com/dashboard

-- ─── Services ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT        NOT NULL,
  category         TEXT        NOT NULL,
  price            NUMERIC     NOT NULL,
  deal_price       NUMERIC,
  active           BOOLEAN     NOT NULL DEFAULT true,
  duration_minutes INTEGER     NOT NULL DEFAULT 60,
  image_url        TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Appointments ─────────────────────────────────────────────────
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'done', 'cancelled');

CREATE TABLE IF NOT EXISTS appointments (
  id           UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name  TEXT               NOT NULL,
  client_phone TEXT               NOT NULL,
  service_id   UUID               NOT NULL REFERENCES services(id),
  date_time    TIMESTAMPTZ        NOT NULL,
  status       appointment_status NOT NULL DEFAULT 'pending',
  paid         BOOLEAN            NOT NULL DEFAULT false,
  notes        TEXT,
  created_at   TIMESTAMPTZ        NOT NULL DEFAULT now()
);

-- ─── Availability ─────────────────────────────────────────────────
-- day_of_week: 0=Sunday … 6=Saturday (NULL means specific_date is used)
-- specific_date: used to override/block a specific calendar date
CREATE TABLE IF NOT EXISTS availability (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week   INTEGER     CHECK (day_of_week BETWEEN 0 AND 6),
  specific_date DATE,
  open_time     TIME        NOT NULL DEFAULT '10:00',
  close_time    TIME        NOT NULL DEFAULT '19:00',
  is_closed     BOOLEAN     NOT NULL DEFAULT false,
  CONSTRAINT chk_day_or_date CHECK (
    (day_of_week IS NOT NULL) <> (specific_date IS NOT NULL)
  )
);

-- ─── Data API access (needed when new tables are not exposed automatically) ──
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON services, availability TO anon;
GRANT INSERT ON appointments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON services, appointments, availability TO authenticated;

-- ─── Row Level Security ───────────────────────────────────────────
ALTER TABLE services     ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Services: public can read active ones
CREATE POLICY "Public can view active services"
  ON services FOR SELECT USING (active = true);

-- Services: authenticated (admin) can do everything
CREATE POLICY "Admin can manage services"
  ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Appointments: public can insert (book)
-- Visitors can only create a fresh, unpaid, pending booking for an active service
CREATE POLICY "Public can create appointment"
  ON appointments FOR INSERT TO anon
  WITH CHECK (
    status = 'pending'
    AND paid = false
    AND date_time > now()
    AND length(client_name) BETWEEN 1 AND 100
    AND length(client_phone) BETWEEN 5 AND 30
    AND (notes IS NULL OR length(notes) <= 1000)
    AND EXISTS (SELECT 1 FROM services s WHERE s.id = service_id AND s.active)
  );

-- Appointments: authenticated (admin) can read and update
CREATE POLICY "Admin can manage appointments"
  ON appointments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Availability: public can read
CREATE POLICY "Public can read availability"
  ON availability FOR SELECT USING (true);

-- Availability: admin can manage
CREATE POLICY "Admin can manage availability"
  ON availability FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── Seed: default working hours (Tue–Sat 10:00–19:00) ───────────
INSERT INTO availability (day_of_week, open_time, close_time, is_closed)
VALUES
  (0, '10:00', '19:00', true),   -- Sunday:   closed
  (1, '10:00', '19:00', true),   -- Monday:   closed
  (2, '10:00', '19:00', false),  -- Tuesday:  open
  (3, '10:00', '19:00', false),  -- Wednesday:open
  (4, '10:00', '19:00', false),  -- Thursday: open
  (5, '10:00', '19:00', false),  -- Friday:   open
  (6, '10:00', '19:00', false)   -- Saturday: open
ON CONFLICT DO NOTHING;

-- ─── Seed: services ───────────────────────────────────────────────
INSERT INTO services (name, category, price, duration_minutes) VALUES
  -- Facials
  ('Classic Facial',          'Facials', 550,  60),
  ('Vitamin C Treatment',     'Facials', 750,  75),
  ('Dermaplaning',            'Facials', 975,  90),
  -- Mani / Pedi
  ('Russian Pedicure',        'Mani / Pedi', 550, 90),
  ('Spa Pedicure',            'Mani / Pedi', 750, 90),
  ('Pedicure + Gellak',       'Mani / Pedi', 850, 105),
  ('Manicure',                'Mani / Pedi', 350, 45),
  ('Manicure + Gellak',       'Mani / Pedi', 600, 60),
  -- Waxing
  ('Eyebrows',                'Waxing', 200,  15),
  ('Sideburns',               'Waxing', 150,  10),
  ('Upper Lip',               'Waxing', 100,  10),
  ('Chin',                    'Waxing', 200,  10),
  ('Beard',                   'Waxing', 350,  20),
  ('Full Face',               'Waxing', 350,  30),
  ('Underarms',               'Waxing', 250,  15),
  ('Brazilian',               'Waxing', 550,  45),
  ('Lower Arm',               'Waxing', 300,  20),
  ('Full Arm',                'Waxing', 400,  30),
  ('Toes',                    'Waxing', 100,  10),
  ('Lower Leg',               'Waxing', 450,  30),
  ('Full Leg',                'Waxing', 600,  45),
  -- PMU
  ('Ombre Powder Brows (incl. touch-up)', 'PMU', 2500, 180),
  ('Lipblush (incl. touch-up)',           'PMU', 2500, 180)
ON CONFLICT DO NOTHING;

-- ─── Storage Setup ────────────────────────────────────────────────
-- Create bucket for service images
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to service-images
CREATE POLICY "Public Read Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');

-- Policy: Allow authenticated users (admin) to upload new objects to service-images
CREATE POLICY "Admin Upload Access" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'service-images');

-- Policy: Allow authenticated users (admin) to update/delete objects in service-images
CREATE POLICY "Admin Update Delete Access" ON storage.objects
  FOR ALL TO authenticated USING (bucket_id = 'service-images') WITH CHECK (bucket_id = 'service-images');


-- ─── Booked time slots (for the public booking page) ──────────────
-- Visitors may not read appointments (privacy), so this function only
-- returns busy blocks: start time + total length, no names or phones.
-- Services in one booking share a start time and run back to back.
CREATE OR REPLACE FUNCTION get_booked_slots(day DATE)
RETURNS TABLE (start_time TIMESTAMPTZ, duration_minutes INTEGER)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.date_time AS start_time,
         SUM(s.duration_minutes)::INTEGER AS duration_minutes
  FROM appointments a
  JOIN services s ON s.id = a.service_id
  WHERE a.status <> 'cancelled'
    AND (a.date_time AT TIME ZONE 'America/Paramaribo')::DATE = day
  GROUP BY a.client_phone, a.date_time;
$$;

REVOKE ALL ON FUNCTION get_booked_slots(DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_booked_slots(DATE) TO anon, authenticated;
