-- Aim & More — extras (run after supabase_schema.sql)
-- 1. Editable website content (Admin → Website)
-- 2. Automatic WhatsApp message to Shea for every new booking

-- ─── 1. Site content ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_content (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON site_content TO authenticated;
REVOKE TRUNCATE ON site_content FROM anon, authenticated;

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site content" ON site_content;
CREATE POLICY "Public can read site content"
  ON site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage site content" ON site_content;
CREATE POLICY "Admin can manage site content"
  ON site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── 2. WhatsApp booking notification ─────────────────────────────
-- Uses a WhatsApp gateway (CallMeBot = free, or TextMeBot = paid) through pg_net.
-- The settings live in a private schema that the website can never read.
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS private.notify_settings (
  id       INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled  BOOLEAN NOT NULL DEFAULT false,
  provider TEXT    NOT NULL DEFAULT 'callmebot' CHECK (provider IN ('callmebot', 'textmebot')),
  phone    TEXT,   -- Shea's WhatsApp number, e.g. +5977173636
  apikey   TEXT,   -- key from the gateway (keep secret)
  admin_url TEXT   DEFAULT 'https://aim-n-more-mu.vercel.app/admin'
);
INSERT INTO private.notify_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
-- No policies on purpose: only the database itself (the trigger) may read this
ALTER TABLE private.notify_settings ENABLE ROW LEVEL SECURITY;

-- One message per booking (a booking with 3 treatments = 1 message).
CREATE OR REPLACE FUNCTION private.notify_new_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, extensions
AS $$
DECLARE
  cfg  private.notify_settings%ROWTYPE;
  b    RECORD;
  msg  TEXT;
BEGIN
  SELECT * INTO cfg FROM private.notify_settings WHERE id = 1;
  IF cfg IS NULL OR NOT cfg.enabled OR cfg.phone IS NULL OR cfg.apikey IS NULL THEN
    RETURN NULL;
  END IF;

  FOR b IN
    SELECT n.client_name,
           n.client_phone,
           n.date_time,
           max(n.notes) AS notes,
           string_agg('• ' || s.name || ' (SRD ' || COALESCE(s.deal_price, s.price)::TEXT || ')', E'\n' ORDER BY s.name) AS treatments,
           sum(COALESCE(s.deal_price, s.price)) AS total,
           sum(s.duration_minutes) AS minutes
    FROM new_rows n
    JOIN services s ON s.id = n.service_id
    GROUP BY n.client_name, n.client_phone, n.date_time
  LOOP
    msg :=
      '*Nieuwe boeking – Aim & More* ✨' || E'\n\n' ||
      '👤 ' || b.client_name || E'\n' ||
      '📞 ' || b.client_phone || E'\n' ||
      '📅 ' || to_char(b.date_time AT TIME ZONE 'America/Paramaribo', 'DD-MM-YYYY') ||
      ' om ' || to_char(b.date_time AT TIME ZONE 'America/Paramaribo', 'HH24:MI') ||
      ' (' || b.minutes || ' min)' || E'\n\n' ||
      b.treatments || E'\n\n' ||
      '💰 Totaal: SRD ' || b.total::TEXT ||
      CASE WHEN b.notes IS NOT NULL AND b.notes <> '' THEN E'\n📝 ' || b.notes ELSE '' END ||
      E'\n\nBevestigen: ' || COALESCE(cfg.admin_url, '');

    BEGIN
      IF cfg.provider = 'textmebot' THEN
        PERFORM net.http_get(
          url    := 'https://api.textmebot.com/send.php',
          params := jsonb_build_object('recipient', cfg.phone, 'apikey', cfg.apikey, 'text', msg)
        );
      ELSE
        PERFORM net.http_get(
          url    := 'https://api.callmebot.com/whatsapp.php',
          params := jsonb_build_object('phone', cfg.phone, 'apikey', cfg.apikey, 'text', msg)
        );
      END IF;
    EXCEPTION WHEN OTHERS THEN
      -- Never let a notification problem block a booking
      RAISE WARNING 'WhatsApp notification failed: %', SQLERRM;
    END;
  END LOOP;

  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION private.notify_new_booking() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS notify_new_booking ON appointments;
CREATE TRIGGER notify_new_booking
  AFTER INSERT ON appointments
  REFERENCING NEW TABLE AS new_rows
  FOR EACH STATEMENT
  EXECUTE FUNCTION private.notify_new_booking();

-- To switch it on later (in the SQL editor, with the real values):
--   UPDATE private.notify_settings
--   SET enabled = true, provider = 'callmebot', phone = '+5977173636', apikey = 'THE-KEY'
--   WHERE id = 1;
