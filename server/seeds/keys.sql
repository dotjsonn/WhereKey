INSERT INTO keys (code, name, location)
VALUES
  ('KEY-001', 'Main Entrance',       'Ground Floor — Reception'),
  ('KEY-002', 'Conference Room A',   'Second Floor — East Wing'),
  ('KEY-003', 'Conference Room B',   'Second Floor — West Wing'),
  ('KEY-004', 'IT Storage',         'Third Floor — IT Department'),
  ('KEY-005', 'Supply Cabinet',     'Ground Floor — Admin Office'),
  ('KEY-006', 'Training Room',      'Second Floor — Training Area'),
  ('KEY-007', 'Records Room',       'Third Floor — Admin Department'),
  ('KEY-008', 'Maintenance Storage','Ground Floor — Service Area')
ON CONFLICT (code) DO NOTHING;