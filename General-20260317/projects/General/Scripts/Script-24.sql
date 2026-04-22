-- 1. CLEAN UP (Delete old data to prevent ID conflicts)
TRUNCATE TABLE pachete_sponsorizare, companii RESTART IDENTITY CASCADE;

-- 2. INSERT COMPANIES (IDs 1 to 24)
INSERT INTO companii (nume, domeniu, website, is_confirmed) VALUES 
('Bosch', 'Automotive', 'bosch.ro', true),
('Continental', 'Automotive', 'continental.com', true),
('Emerson', 'Automation', 'emerson.com', true),
('Telenav', 'Software', 'telenav.com', true),
('Accenture', 'Consulting', 'accenture.com', true),
('Porsche Engineering', 'Automotive', 'porsche.com', true),
('Endava', 'Software', 'endava.com', true),
('Cognizant', 'IT Services', 'cognizant.com', true),
('NTT Data', 'IT Services', 'nttdata.com', true),
('Betfair', 'Gambling/Tech', 'betfair.com', false),
('MHP', 'Consulting', 'mhp.com', true),
('Vertiv', 'Infrastructure', 'vertiv.com', false),
('Arobs', 'Software', 'arobs.com', true),
('Fortech', 'Software', 'fortech.ro', true),
('Garmin', 'Consumer Electronics', 'garmin.com', true),
('National Instruments', 'Test & Measurement', 'ni.com', true),
('Siemens', 'Industrial', 'siemens.com', true),
('Bitdefender', 'Cybersecurity', 'bitdefender.com', false),
('UiPath', 'RPA', 'uipath.com', true),
('Deloitte', 'Financial', 'deloitte.com', true),
('KPMG', 'Financial', 'kpmg.com', false),
('PwC', 'Financial', 'pwc.com', false),
('EY', 'Financial', 'ey.com', true),
('Transilvania Bank', 'Banking', 'bancatransilvania.ro', true);

-- 3. INSERT PACKAGES (Linked to Companies by ID)
INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) VALUES 
(1,  'Gold',     5000.00, '2024'),
(2,  'Platinum', 8000.00, '2024'),
(3,  'Silver',   3000.00, '2023'),
(4,  'Bronze',   1500.00, '2024'),
(5,  'Gold',     5500.00, '2024'),
(6,  'Diamond', 10000.00, '2024'),
(7,  'Silver',   3200.00, '2023'),
(8,  'Gold',     4800.00, '2024'),
(9,  'Platinum', 7500.00, '2024'),
(10, 'Bronze',   1000.00, '2025'), -- Pending
(11, 'Silver',   2500.00, '2023'),
(12, 'Gold',     6000.00, '2024'),
(13, 'Silver',   3000.00, '2024'),
(14, 'Platinum', 9000.00, '2024'),
(15, 'Gold',     5200.00, '2024'),
(16, 'Bronze',   1800.00, '2023'),
(17, 'Diamond', 12000.00, '2024'),
(18, 'Silver',   3500.00, '2025'),
(19, 'Platinum', 8500.00, '2024'),
(20, 'Gold',     5000.00, '2024'),
(21, 'Bronze',   1200.00, '2025'),
(22, 'Silver',   2800.00, '2025'),
(23, 'Gold',     5400.00, '2024'),
(24, 'Diamond', 15000.00, '2024');