----1--Creates view of all customers
--create view all_customers as
--select company_name
--from public.customers c 
--order by c.company_name , c.country 

--select * from all_customers

--2--
--select *
--from public.orders o 
--order by o.order_date 

--3--how many orders where placed in 
--create view nr_orders_1997 as
select count(*)
from public.orders o
where extract(year from o.order_date ) = 1997

--select * from nr_orders_1997

--4
--create view contact_persons as
--select contact_name
--from public.customers c 
--where c.contact_title like '%Manager%'
--order by c.contact_name 

--select * from contact_persons

--5
--select *
--from public.orders o 
--where extract(year from o.order_date ) = 1997 and extract(month from o.order_date ) = 5 and extract(day from o.order_date ) = 19

--6
--select *
--from public.orders o join public.customers c on o.customer_id = c.customer_id 
--where extract(year from o.order_date ) = 1996

--7--
select e.city, count(employee_id), count(customer_id)
from public.employees e left join public.customers c on e.city = c.city 
where e.city in (select city from public.employees e2)
group by e.city 

--8
--select c.city, count(customer_id), count(employee_id)
--from public.employees e right join public.customers c  on e.city  = c.city
--where c.city in(select city from public.customers)
--group by c.city

--9
--SELECT
--    COALESCE(e.city, c.city) AS city,
--    COUNT(e.city),
--    COUNT(c.city)
--FROM public.employees e
--FULL OUTER JOIN public.customers c
--    ON e.city = c.city
--GROUP BY COALESCE(e.city, c.city)
--ORDER BY city;

--10
--SELECT 
--    o.order_id,
--    e.first_name || ' ' || e.last_name AS employee_name
--FROM 
--    orders AS o
--JOIN 
--    employees AS e ON o.employee_id = e.employee_id
--WHERE 
--    o.shipped_date > o.required_date;

--11
--SELECT 
--    p.product_name,
--    SUM(od.quantity) AS total_quantity
--FROM 
--    order_details AS od
--JOIN 
--    products AS p ON od.product_id = p.product_id
--GROUP BY 
--    p.product_name
--HAVING 
--    SUM(od.quantity) < 200;

--12
--select
--	customer_id, count(order_id)
--from
--	public.orders o
--where extract(year from o.order_date) >= 1997
--group by o.customer_id 
--having count(order_id) > 15

--13
--INSERT INTO employees (
--    employee_id,
--    last_name,
--    first_name,
--    title,
--    title_of_courtesy,
--    birth_date,
--    hire_date,
--    address,
--    city,
--    region,
--    postal_code,
--    country,
--    home_phone,
--    extension,
--    notes,
--    reports_to,
--    photo_path
--)
--VALUES (
--    10,
--    'Comsa',
--    'Darian',
--    'Developer',
--    'Mr.',
--    '2005-01-16',
--    '2025-11-11',
--    'Nr 532',
--    'Mihalt',
--    'AB',
--    '12312',
--    'Romania',
--    '0784531864',
--    '101',
--    NULL,   -- notes (optional)
--    NULL,   -- reports_to (optional)
--    NULL    -- photo_path (optional)
--);

--14
--INSERT INTO orders (
--    order_id,
--    customer_id,
--    employee_id,
--    order_date,
--    required_date,
--    shipped_date,
--    ship_via,
--    freight,
--    ship_name,
--    ship_address,
--    ship_city,
--    ship_region,
--    ship_postal_code,
--    ship_country
--)
--VALUES (
--    11078,          
--    'ALFKI',        
--    10,            
--    '2025-11-11',
--    '2025-11-18',
--    '2025-11-13',
--    1,             
--    25.50,
--    'Alfreds Futterkiste',
--    'Obere Str. 57',
--    'Berlin',
--    NULL,
--    '12209',
--    'Germany'
--);

--15
--UPDATE employees
--SET home_phone = '0784864531'
--WHERE employee_id = 10;

--16
--UPDATE order_details
--SET quantity = quantity * 2
--WHERE order_id = 11078
--  AND product_id = 5;

--17
--DELETE FROM public.orders o
--WHERE o.order_id = 11078;

--18
SELECT SUM(od.quantity * od.unit_price * (1 - od.discount))
FROM public.orders o
JOIN public.order_details od ON o.order_id = od.order_id
WHERE extract(year from o.order_date) = 1997;

--19
--SELECT c.customer_id, c.company_name, 
--       SUM(od.quantity * od.unit_price * (1 - od.discount)) as total_paid
--FROM public.customers c
--JOIN public.orders o ON c.customer_id = o.customer_id
--JOIN public.order_details od ON o.order_id = od.order_id
--GROUP BY c.customer_id, c.company_name

--20
--SELECT p.product_id, p.product_name,
--       SUM(od.quantity) as total_quantity_sold
--FROM public.products p
--JOIN public.order_details od ON p.product_id = od.product_id
--GROUP BY p.product_id, p.product_name
--ORDER BY total_quantity_sold DESC
--LIMIT 10;

--21
--SELECT c.customer_id, c.company_name,
--       SUM(od.quantity * od.unit_price * (1 - od.discount)) as total_revenue
--FROM customers c
--JOIN orders o ON c.customer_id = o.customer_id
--JOIN order_details od ON o.order_id = od.order_id
--GROUP BY c.customer_id, c.company_name
--ORDER BY total_revenue DESC;

--22
--SELECT c.customer_id, c.company_name,
--       SUM(od.quantity * od.unit_price * (1 - od.discount)) as total_paid
--FROM customers c
--JOIN orders o ON c.customer_id = o.customer_id
--JOIN order_details od ON o.order_id = od.order_id
--WHERE c.country = 'UK'
--GROUP BY c.customer_id, c.company_name
--HAVING SUM(od.quantity * od.unit_price * (1 - od.discount)) > 1000
--ORDER BY total_paid DESC;

--23
--SELECT 
--    c.customer_id,
--    c.company_name,
--    SUM(od.quantity * od.unit_price * (1 - od.discount)) as total_paid_all_time,
--    SUM(CASE WHEN extract(year from o.order_date) = 1997 
--             THEN od.quantity * od.unit_price * (1 - od.discount) 
--             ELSE 0 END) as total_paid_1997
--FROM customers c
--JOIN orders o ON c.customer_id = o.customer_id
--JOIN order_details od ON o.order_id = od.order_id
--GROUP BY c.customer_id, c.company_name
--ORDER BY total_paid_all_time DESC;