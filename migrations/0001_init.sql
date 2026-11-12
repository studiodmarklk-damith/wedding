-- Wedding invitation: settings key/value store + visit counter
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT
);

INSERT INTO visits (id, count) VALUES (1, 0) ON CONFLICT DO NOTHING;

INSERT OR IGNORE INTO settings (key, value) VALUES
  ('groom', 'Sandun'),
  ('bride', 'Nimesha'),
  ('wedding_date', '2027-03-06'),
  ('poruwa_time', '9:12 AM'),
  ('lunch_time', '12:30 PM'),
  ('reception_time', '6:30 PM'),
  ('invitation_message', 'request the honour of your presence as they unite in marriage. Join us in celebrating the beginning of a lifetime of love, laughter and togetherness.'),
  ('venue_name', 'Grand Orchid Ballroom'),
  ('venue_address', 'Colombo, Sri Lanka'),
  ('map_query', 'Colombo Sri Lanka'),
  ('timeline', '[{"time":"9:00 AM","text":"Grand procession of the couple to the Poruwa"},{"time":"9:12 AM","text":"Ashtaka & Jayamangala Gatha blessings"},{"time":"9:25 AM","text":"Lighting of the oil lamp & binding of hands with gold thread, with the pouring of water"},{"time":"9:40 AM","text":"Exchange of rings & ceremonial gifts"},{"time":"10:00 AM","text":"Sharing of kiribath & blessings of the elders"}]'),
  ('details_lines', '["Dress code: Traditional / White & Gold","Complimentary parking is available at the venue","Gifts: Your presence is the greatest gift of all","Kindly be seated by 9:00 AM for the Poruwa ceremony","Kindly RSVP by 1st February"]'),
  ('rsvp_deadline', '1st February'),
  ('rsvp_phone', '+94771234567'),
  ('whatsapp_number', '94771234567');
