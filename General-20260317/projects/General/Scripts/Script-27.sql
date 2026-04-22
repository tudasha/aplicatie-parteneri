--1
--SELECT name, price, size 
--FROM clothes 
--WHERE price > 100 
--ORDER BY price DESC;

--2 join
--SELECT c.name, cat.category_name, c.price
--FROM clothes c
--JOIN categories cat ON c.category_id = cat.category_id;

--3 top 3 most selled items
--SELECT cat.category_name, COUNT(oi.order_item_id) as total_sold
--FROM order_items oi
--JOIN clothes c ON oi.item_id = c.clothes_id
--JOIN categories cat ON c.category_id = cat.category_id
--GROUP BY cat.category_name
--ORDER BY total_sold DESC
--LIMIT 3;

--4 prezent the inventory
SELECT 
    c.name, 
    c.size, 
   i.quantity AS stoc_disponibil
FROM clothes c
JOIN inventory i ON c.clothes_id = i.item_id
WHERE i.item_type = 'clothes'
ORDER BY i.quantity ASC;