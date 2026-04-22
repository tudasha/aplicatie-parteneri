-- -------------------------
-- Categories
-- -------------------------
INSERT INTO Categories (category_name) VALUES
('Clothing'),
('Accessories');

-- -------------------------
-- Clothes (XS–XL)
-- -------------------------
INSERT INTO Clothes (name, type, size, price, category_id) VALUES
('T-Shirt Classic', 'Shirt', 'S', 19.99, 1),
('T-Shirt Classic', 'Shirt', 'M', 19.99, 1),
('Jeans Slim', 'Pants', 'M', 49.99, 1),
('Jacket Winter', 'Jacket', 'L', 89.99, 1),
('Hoodie Casual', 'Hoodie', 'XL', 39.99, 1);

-- -------------------------
-- Accessories (all size M)
-- -------------------------
INSERT INTO Accessories (name, type, size, price, category_id) VALUES
('Leather Belt', 'Belt', 'M', 25.99, 2),
('Baseball Cap', 'Hat', 'M', 15.99, 2),
('Wool Scarf', 'Scarf', 'M', 29.99, 2);

-- -------------------------
-- Inventory
-- -------------------------
INSERT INTO Inventory (item_type, item_id, quantity) VALUES
('clothes', 1, 50),
('clothes', 2, 40),
('clothes', 3, 30),
('clothes', 4, 20),
('clothes', 5, 15),
('accessory', 1, 25),
('accessory', 2, 35),
('accessory', 3, 20);

-- -------------------------
-- Orders
-- -------------------------
INSERT INTO Orders (customer_name) VALUES
('Alice Smith'),
('Bob Johnson');

-- -------------------------
-- Order_Items
-- -------------------------
INSERT INTO Order_Items (order_id, item_type, item_id, quantity) VALUES
(1, 'clothes', 2, 2),
(1, 'accessory', 2, 1),
(2, 'clothes', 3, 1),
(2, 'clothes', 4, 1);


