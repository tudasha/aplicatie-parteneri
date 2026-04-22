-- =========================
-- Users
-- =========================
INSERT INTO Users (username, email, password_hash) VALUES
('daria', 'daria@example.com', 'hash1'),
('abi', 'abi@example.com', 'hash2'),
('marius', 'marius@example.com', 'hash3'),
('ioana', 'ioana@example.com', 'hash4'),
('andrei', 'andrei@example.com', 'hash5');

-- =========================
-- Authors (15 classics)
-- =========================
INSERT INTO Authors (full_name, birth_year, death_year) VALUES
('F. Scott Fitzgerald', 1896, 1940),
('Haruki Murakami', 1949, NULL),
('Leo Tolstoy', 1828, 1910),
('Fyodor Dostoevsky', 1821, 1881),
('Jane Austen', 1775, 1817),
('Charles Dickens', 1812, 1870),
('George Orwell', 1903, 1950),
('Mary Shelley', 1797, 1851),
('Victor Hugo', 1802, 1885),
('Gustave Flaubert', 1821, 1880),
('Emily Brontë', 1818, 1848),
('Charlotte Brontë', 1816, 1855),
('J.D. Salinger', 1919, 2010),
('Harper Lee', 1926, 2016),
('Albert Camus', 1913, 1960);

-- =========================
-- Books (2 per author = 30)
-- =========================
INSERT INTO Books (title, publisher, publication_year, isbn, page_count, description) VALUES
('The Great Gatsby', 'Scribner', 1925, '9780743273565', 180, 'A critique of the American Dream.'),
('Tender Is the Night', 'Scribner', 1934, '9780684801544', 317, 'A tragic romance set in the French Riviera.'),

('Norwegian Wood', 'Kodansha', 1987, '9780375704024', 296, 'A nostalgic tale of love and loss.'),
('Kafka on the Shore', 'Shinchosha', 2002, '9781400079278', 505, 'Parallel fates in surreal Japan.'),

('Anna Karenina', 'The Russian Messenger', 1877, '9780143035008', 864, 'A tragic love story in Imperial Russia.'),
('War and Peace', 'The Russian Messenger', 1869, '9780199232765', 1225, 'Epic of Napoleonic wars and Russian society.'),

('Crime and Punishment', 'The Russian Messenger', 1866, '9780140449136', 671, 'Psychological drama of guilt and redemption.'),
('The Brothers Karamazov', 'The Russian Messenger', 1880, '9780374528379', 824, 'A philosophical novel of faith and doubt.'),

('Pride and Prejudice', 'T. Egerton', 1813, '9780141439518', 432, 'Classic romance and social commentary.'),
('Sense and Sensibility', 'T. Egerton', 1811, '9780141439662', 368, 'Love and manners in Regency England.'),

('Great Expectations', 'Chapman & Hall', 1861, '9780141439563', 505, 'Coming-of-age story of Pip.'),
('A Tale of Two Cities', 'Chapman & Hall', 1859, '9780141439600', 489, 'French Revolution and sacrifice.'),

('1984', 'Secker & Warburg', 1949, '9780451524935', 328, 'Dystopian vision of surveillance and control.'),
('Animal Farm', 'Secker & Warburg', 1945, '9780451526342', 112, 'Political allegory with farm animals.'),

('Frankenstein', 'Lackington, Hughes, Harding, Mavor & Jones', 1818, '9780141439471', 280, 'The tale of Victor Frankenstein and his creature.'),
('The Last Man', 'Henry Colburn', 1826, '9780140439687', 340, 'Apocalyptic vision of humanity’s end.'),

('Les Misérables', 'A. Lacroix', 1862, '9780451419439', 1232, 'Epic of justice, love, and redemption.'),
('The Hunchback of Notre-Dame', 'Gosselin', 1831, '9780140443530', 940, 'Tragedy of Quasimodo and Esmeralda.'),

('Madame Bovary', 'Revue de Paris', 1856, '9780140449129', 329, 'A woman’s tragic pursuit of passion.'),
('Sentimental Education', 'Michel Lévy', 1869, '9780140447927', 448, 'Love and politics in 19th-century France.'),

('Wuthering Heights', 'Thomas Cautley Newby', 1847, '9780141439556', 416, 'Dark romance on the Yorkshire moors.'),
('Poems by Currer, Ellis, and Acton Bell', 'Aylott & Jones', 1846, '9780140423524', 200, 'Collection of Brontë poetry.'),

('Jane Eyre', 'Smith, Elder & Co.', 1847, '9780141441146', 500, 'A governess’s journey of love and independence.'),
('Villette', 'Smith, Elder & Co.', 1853, '9780140434797', 600, 'A woman’s struggle in a foreign land.'),

('The Catcher in the Rye', 'Little, Brown and Company', 1951, '9780316769488', 277, 'Holden Caulfield’s teenage alienation.'),
('Nine Stories', 'Little, Brown and Company', 1953, '9780316769501', 198, 'Short story collection.'),

('To Kill a Mockingbird', 'J.B. Lippincott & Co.', 1960, '9780061120084', 324, 'A child’s view of racial injustice.'),
('Go Set a Watchman', 'HarperCollins', 2015, '9780062409850', 278, 'Sequel to Mockingbird.'),

('The Stranger', 'Gallimard', 1942, '9780679720201', 123, 'Existential novel of absurdity.'),
('The Plague', 'Gallimard', 1947, '9780679720218', 308, 'Allegory of human resilience in crisis.');

-- =========================
-- BookAuthors (linking books to authors)
-- =========================
INSERT INTO BookAuthors (book_id, author_id) VALUES
(1,1),(2,1),(3,2),(4,2),(5,3),(6,3),(7,4),(8,4),
(9,5),(10,5),(11,6),(12,6),(13,7),(14,7),(15,8),(16,8),
(17,9),(18,9),(19,10),(20,10),(21,11),(22,11),(23,12),(24,12),
(25,13),(26,13),(27,14),(28,14),(29,15),(30,15);

-- =========================
-- Genres
-- =========================
INSERT INTO Genres (name) VALUES
('Romance'),('Tragedy'),('Philosophical'),('Dystopian'),
('Horror'),('Drama'),('Satire'),('Magical Realism');

-- =========================
-- BookGenres (assign genres)
-- =========================
INSERT INTO BookGenres (book_id, genre_id) VALUES
(1,2),(2,2),(3,1),(4,1),(5,1),(6,2),(7,2),(8,3),(9,1),(10,1),
(11,2),(12,2),(13,4),(14,4),(15,5),(16,5),(17,2),(18,2),(19,1),(20,1),
(21,2),(22,2),(23,1),(24,1),(25,6),(26,6),(27,2),(28,2),(29,3),(30,3);

-- =========================
-- Reviews (sample reviews)
-- =========================
INSERT INTO Reviews (book_id, user_id, rating, review_text) VALUES
(1,1,5,'A timeless critique of wealth and illusion.'),
(2,2,4,'Fitzgerald’s tragic romance still resonates.'),
(3,3,5,'Tolstoy captures human emotion perfectly.'),
(4,4,5,'Dostoevsky’s masterpiece of psychology.'),
(5,5,4,'Short but deeply moving.'),
(6,1,