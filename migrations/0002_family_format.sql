-- Add fields for the standard Sinhala invitation format, custom map link and section visibility
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('family_title', 'මෙන්න සුභ මංගල්ලේ..'),
  ('bride_lines', '["කුලවල ගමේ දී පදිංචි","ගෙ. එස්. සී නවරත්න කුමාර මහතාගේ","නා චිත්‍රා වීරක්කොඩියාගේ","ආදරණිය දියණිය"]'),
  ('bride_family_name', 'කුමාරි නිම්මහා'),
  ('groom_lines', '["කැන්දගම ගමේ දී පදිංචි","ආර්. එමි නන්ද චන්ද්‍රසිරි මහතාගේ","නා චිත්‍රා වීරක්කොඩියාගේ","ආදරණිය පුත්"]'),
  ('groom_family_name', 'ලක්මාල්'),
  ('map_link', ''),
  ('hidden_sections', '[]');
