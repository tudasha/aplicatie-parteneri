--- 1. CATEGORII
INSERT INTO categories (category_name) VALUES 
('Streetwear'), ('Formal'), ('Sport'), ('Outerwear'), ('Denim'), 
('Casual'), ('Bijuterii'), ('Genti'), ('Lenjerie'), ('Accesorii Cap');

--- 2. HAINE (Haine cu mărimi standard S, M, L, XL)
INSERT INTO clothes (name, type, size, price, category_id) VALUES 
('Hanorac Oversize', 'Cotton', 'L', 180.00, 1),
('Camasă Oxford', 'Linen', 'M', 145.00, 2),
('Tricou Alergare', 'Polyester', 'S', 75.00, 3),
('Palton Lana', 'Wool', 'XL', 850.00, 4),
('Blugi Mom Fit', 'Denim', 'M', 190.00, 5),
('Geacă Puf', 'Nylon', 'L', 520.00, 4),
('Pantaloni Scurti Gym', 'Spandex', 'M', 65.00, 3),
('Rochie Eleganta', 'Silk', 'S', 400.00, 2),
('Tricou Grafic', 'Cotton', 'L', 95.00, 1),
('Jeans Cargo', 'Denim', 'M', 210.00, 5);

--- 3. ACCESORII (Toate marimea M conform cerintei tale)
INSERT INTO accessories (name, type, size, price, category_id) VALUES 
('Ceas Metalic', 'Steel', 'M', 320.00, 7),
('Rucsac Laptop', 'Canvas', 'M', 250.00, 8),
('Ochelari Soare', 'Plastic', 'M', 110.00, 7),
('Caciula Iarna', 'Wool', 'M', 45.00, 10),
('Curea Piele', 'Leather', 'M', 85.00, 7),
('Geanta Plic', 'Leather', 'M', 180.00, 8),
('Sapca Snapback', 'Cotton', 'M', 130.00, 10),
('Esarfa Matase', 'Silk', 'M', 90.00, 7),
('Portofel Slim', 'Leather', 'M', 70.00, 8),
('Bratara Argint', 'Silver', 'M', 150.00, 7);

--- 4. INVENTAR (Folosim item_type 'clothes' si 'accessories')
INSERT INTO inventory (item_type, item_id, quantity) 
SELECT 'clothes', clothes_id, floor(random() * 40 + 10)::int FROM clothes;

INSERT INTO inventory (item_type, item_id, quantity) 
SELECT 'accessories', accessory_id, floor(random() * 20 + 5)::int FROM accessories;

--- 5. COMENZI
INSERT INTO orders (order_date, customer_name) VALUES 
('2026-01-10', 'Ion Popescu'), ('2026-01-11', 'Ana Maria'), 
('2026-01-12', 'Mihai Radu'), ('2026-01-13', 'Elena Sandu'),
('2026-01-14', 'Vlad Ionescu'), ('2026-01-15', 'Carmen Dan'),
('2026-01-16', 'George Enache'), ('2026-01-17', 'Lucia Sava'),
('2026-01-18', 'Andrei Oprea'), ('2026-01-19', 'Sonia Veres');

--- 6. DETALII COMENZI (Order Items)
INSERT INTO order_items (order_id, item_type, item_id, quantity) VALUES 
(1, 'clothes', 1, 1), (1, 'accessories', 2, 1),
(2, 'clothes', 3, 2), (3, 'accessories', 5, 1),
(4, 'clothes', 4, 1), (5, 'clothes', 5, 1),
(6, 'accessories', 1, 1), (7, 'clothes', 2, 1),
(8, 'clothes', 10, 1), (8, 'accessories', 4, 1),
(9, 'accessories', 7, 2), (10, 'clothes', 8, 1);