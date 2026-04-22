-- 1. CLEAN SLATE (Delete old data)
TRUNCATE TABLE pachete_sponsorizare, companii RESTART IDENTITY CASCADE;

-- 2. INSERT COMPANIES (Combined list from 2026 & 2025)
INSERT INTO companii (nume, domeniu, website, is_confirmed) VALUES 
('Porsche Engineering', 'Engineering Services', 'www.porscheengineering.com', true),
('CSi Romania', 'Metal Manufacturing', 'https://www.csiportal.com', true),
('MasterMilling', 'Milling', 'https://master-milling.ro', true),
('Nova Tooling', 'CNC parts manufacturing', 'https://novagrup.ro', true),
('Mars Outpost', 'Modelling and 3D printing', 'https://marsoutpost.net', true),
('Ulma Packaging', 'Packaging machinery', 'https://www.ulmapackaging.ro', true),
('Color Control Support SRL', 'Manufacturing', 'https://www.colorcontrol.ro', true),
('ProCam', 'Manufacturing', '', true),
('Easy Composites', 'Composites suppliers', '', true),
('ASKUBAL', 'Manufacturing', 'http://www.askubal.de', true),
('Liner DP', 'Printing house', 'https://liner-dp.com', true),
('Marple', 'Software', 'https://www.marpledata.com', true),
('NKON', 'Battery cells suppliers', 'https://www.nkon.nl', true),
('Oz racing', 'Rims suppliers', 'https://www.ozracing.com', true),
('Hoosier Rennreifen', 'Tires suppliers', 'https://www.hoosiertire.com', true),
('Trambus Waterjet', 'Water Jet', 'http://www.trambus.ro', true),
('Daisler', 'Printing House', 'www.daisler.ro', true),
('CAD INTER SRL', 'Engineering Services', 'https://cadinter.ro', true),
('EXSTEEL Engineering', 'Industrial Equipments', 'https://www.exsteel.ro', true),
('EMUGE FRANKEN', 'Industrial Equipments', 'www.emuge.ro', true),
('INOTERV', 'Professional Engineering Services', 'https://inoterv.com', true),
('OMV', 'Fuel', 'https://www.omv.com', true),
('Perficient', 'Digital consulting', 'https://www.perficient.com', true),
('RAAL Bistrița', 'Cooling Systems', 'https://www.raal.ro', true),
('ROGRANEX', 'Industrial Equipments', 'https://rogranex.ro', true),
('Eurocompozite', 'Composite Manufacturing', 'https://www.eurocompozite.ro', true),
('INAS', 'Engineering Services', 'https://www.inas.ro', true),
('BelcoAvia', 'Composites Manufacturing', 'www.belcoavia.ro', true),
('Transilvania Mobility Hub', 'Dealership', '', true),
('Nanil Catering Sibiu', 'Catering', 'https://catering-sibiu.ro', true),
('Server Config', 'IT tech provider', 'https://www.server-config.ro', true),
('Tecosim', 'Engineering Services', 'https://tecosim.com', true),
('Fundația Autonom', 'Rent a Car', 'https://fundatia.autonom.ro', true),
('T&T Karting Transilvania', 'Karting', 'https://kartingtransilvania.ro', true),
('Catena', 'Pharmacy', 'https://www.catena.ro', true),
('ARRK Research & Development', 'Engineering Services', 'https://engineering.arrk.com', true),
('BT Leasing', 'Bank', 'https://www.btleasing.ro', true);

-- 3. INSERT PACKAGES FOR 2026
INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Porsche Engineering'), 'Platinum', 20000, '2026');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='CSi Romania'), 'Platinum', 20000, '2026');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Marple'), 'Gold', 0, '2026');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Color Control Support SRL'), 'Silver', 0, '2026');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) VALUES 
((SELECT companie_id FROM companii WHERE nume='Mars Outpost'), 'Supporter', 0, '2026'),
((SELECT companie_id FROM companii WHERE nume='Ulma Packaging'), 'Supporter', 0, '2026'),
((SELECT companie_id FROM companii WHERE nume='ProCam'), 'Supporter', 0, '2026'),
((SELECT companie_id FROM companii WHERE nume='Easy Composites'), 'Supporter', 0, '2026'),
((SELECT companie_id FROM companii WHERE nume='ASKUBAL'), 'Supporter', 0, '2026'),
((SELECT companie_id FROM companii WHERE nume='Liner DP'), 'Supporter', 0, '2026'),
((SELECT companie_id FROM companii WHERE nume='NKON'), 'Supporter', 0, '2026'),
((SELECT companie_id FROM companii WHERE nume='Oz racing'), 'Supporter', 0, '2026'),
((SELECT companie_id FROM companii WHERE nume='Hoosier Rennreifen'), 'Supporter', 0, '2026'),
((SELECT companie_id FROM companii WHERE nume='Trambus Waterjet'), 'Supporter', 0, '2026'),
((SELECT companie_id FROM companii WHERE nume='Daisler'), 'Supporter', 0, '2026'),
((SELECT companie_id FROM companii WHERE nume='MasterMilling'), 'TBD', 0, '2026'),
((SELECT companie_id FROM companii WHERE nume='Nova Tooling'), 'TBD', 0, '2026');


-- 4. INSERT PACKAGES FOR 2025
INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='CAD INTER SRL'), 'Bronze', 400, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Color Control Support SRL'), 'Bronze', 0, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='CSi Romania'), 'Platinum', 20000, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Daisler'), 'Bronze', 0, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='EXSTEEL Engineering'), 'Bronze', 200, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='EMUGE FRANKEN'), 'Bronze', 600, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='INOTERV'), 'Bronze', 0, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='OMV'), 'Bronze', 800, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Perficient'), 'Bronze', 470, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='RAAL Bistrița'), 'Bronze', 300, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='ROGRANEX'), 'Bronze', 320, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Eurocompozite'), 'Bronze', 800, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Ulma Packaging'), 'Bronze', 840, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='INAS'), 'Platinum', 22320, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Nova Tooling'), 'Bronze', 945, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='BelcoAvia'), 'Silver', 0, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Trambus Waterjet'), 'Bronze', 0, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Transilvania Mobility Hub'), 'Silver', 2500, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Nanil Catering Sibiu'), 'Bronze', 4000, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Server Config'), 'Bronze', 1550, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Tecosim'), 'Bronze', 1000, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Fundația Autonom'), 'Bronze', 1000, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Mars Outpost'), 'Supporter', 0, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='T&T Karting Transilvania'), 'Bronze', 0, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='Catena'), 'Bronze', 0, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='ARRK Research & Development'), 'Bronze', 0, '2025');

INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) 
VALUES ((SELECT companie_id FROM companii WHERE nume='BT Leasing'), 'Silver', 5000, '2025');