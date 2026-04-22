

-- =========================
-- Authors (20 classics)
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
('Albert Camus', 1913, 1960),
('Gabriel García Márquez', 1927, 2014),
('Oscar Wilde', 1854, 1900),
('Franz Kafka', 1883, 1924),
('Alexandre Dumas', 1802, 1870),
('Ernest Hemingway', 1899, 1961);

-- =========================
-- Books (2 per author = 40)
-- =========================
INSERT INTO Books (title, publisher, publication_year, isbn, page_count, description) VALUES
-- Fitzgerald
('The Great Gatsby', 'Scribner', 1925, '9780743273565', 180, 'A critique of the American Dream.'),
('Tender Is the Night', 'Scribner', 1934, '9780684801544', 317, 'A tragic romance set in the French Riviera.'),

-- Murakami
('Norwegian Wood', 'Kodansha', 1987, '9780375704024', 296, 'A nostalgic tale of love and loss.'),
('Kafka on the Shore', 'Shinchosha', 2002, '9781400079278', 505, 'Parallel fates in surreal Japan.'),

-- Tolstoy
('Anna Karenina', 'The Russian Messenger', 1877, '9780143035008', 864, 'A tragic love story in Imperial Russia.'),
('War and Peace', 'The Russian Messenger', 1869, '9780199232765', 1225, 'Epic of Napoleonic wars and Russian society.'),

-- Dostoevsky
('Crime and Punishment', 'The Russian Messenger', 1866, '9780140449136', 671, 'Psychological drama of guilt and redemption.'),
('The Brothers Karamazov', 'The Russian Messenger', 1880, '9780374528379', 824, 'A philosophical novel of faith and doubt.'),

-- Austen
('Pride and Prejudice', 'T. Egerton', 1813, '9780141439518', 432, 'Classic romance and social commentary.'),
('Sense and Sensibility', 'T. Egerton', 1811, '9780141439662', 368, 'Love and manners in Regency England.'),

-- Dickens
('Great Expectations', 'Chapman & Hall', 1861, '9780141439563', 505, 'Coming-of-age story of Pip.'),
('A Tale of Two Cities', 'Chapman & Hall', 1859, '9780141439600', 489, 'French Revolution and sacrifice.'),

-- Orwell
('1984', 'Secker & Warburg', 1949, '9780451524935', 328, 'Dystopian vision of surveillance and control.'),
('Animal Farm', 'Secker & Warburg', 1945, '9780451526342', 112, 'Political allegory with farm animals.'),

-- Shelley
('Frankenstein', 'Lackington, Hughes, Harding, Mavor & Jones', 1818, '9780141439471', 280, 'The tale of Victor Frankenstein and his creature.'),
('The Last Man', 'Henry Colburn', 1826, '9780140439687', 340, 'Apocalyptic vision of humanity’s end.'),

-- Hugo
('Les Misérables', 'A. Lacroix', 1862, '9780451419439', 1232, 'Epic of justice, love, and redemption.'),
('The Hunchback of Notre-Dame', 'Gosselin', 1831, '9780140443530', 940, 'Tragedy of Quasimodo and Esmeralda.'),

-- Flaubert
('Madame Bovary', 'Revue de Paris', 1856, '9780140449129', 329, 'A woman’s tragic pursuit of passion.'),
('Sentimental Education', 'Michel Lévy', 1869, '9780140447927', 448, 'Love and politics in 19th-century France.'),

-- Emily Brontë
('Wuthering Heights', 'Thomas Cautley Newby', 1847, '9780141439556', 416, 'Dark romance on the Yorkshire moors.'),
('Poems by Currer, Ellis, and Acton Bell', 'Aylott & Jones', 1846, '9780140423524', 200, 'Collection of Brontë poetry.'),

-- Charlotte Brontë
('Jane Eyre', 'Smith, Elder & Co.', 1847, '9780141441146', 500, 'A governess’s journey of love and independence.'),
('Villette', 'Smith, Elder & Co.', 1853, '9780140434797', 600, 'A woman’s struggle in a foreign land.'),

-- Salinger
('The Catcher in the Rye', 'Little, Brown and Company', 1951, '9780316769488', 277, 'Holden Caulfield’s teenage alienation.'),
('Nine Stories', 'Little, Brown and Company', 1953, '9780316769501', 198, 'Short story collection.'),

-- Harper Lee
('To Kill a Mockingbird', 'J.B. Lippincott & Co.', 1960, '9780061120084', 324, 'A child’s view of racial injustice.'),
('Go Set a Watchman', 'HarperCollins', 2015, '9780062409850', 278, 'Sequel to Mockingbird.'),

-- Camus
('The Stranger', 'Gallimard', 1942, '9780679720201', 123, 'Existential novel of absurdity.'),
('The Plague', 'Gallimard', 1947, '9780679720218', 308, 'Allegory of human resilience in crisis.'),

-- Márquez
('One Hundred Years of Solitude', 'Editorial Sudamericana', 1967, '9780060883287', 417, 'Magical realism in Macondo.'),
('Love in the Time of Cholera', 'Editorial Oveja Negra', 1985, '9780307389732', 348, 'Enduring love across decades.'),

-- Wilde
('The Picture of Dorian Gray', 'Ward, Lock & Co.', 1890, '9780141439570', 254, 'A man’s portrait ages while he stays young.'),
('The Importance of Being Earnest', 'L. Smithers', 1895, '9780140436068', 76, 'Comedy of manners.'),

-- Kafka
('The Metamorphosis', 'Kurt Wolff Verlag', 1915, '9780141185095', 201, 'Kafka’s surreal tale of transformation.'),
('The Trial', 'Verlag Die Schmiede', 1925, '9780805209990', 255, 'A man faces a mysterious court.'),

-- Dumas
('The Count of Monte Cristo', 'Penguin Classics', 1844, '9780140449262', 1276, 'Revenge and redemption in France.'),
('The Three Musketeers', 'Penguin Classics', 1844, '9780140449279', 704, 'Adventure of d’Artagnan and musketeers.'),

-- Hemingway
('The Old Man and the Sea', 'Charles Scribner’s Sons', 1952, '9780684801223', 127, 'Hemingway’s tale of struggle and dignity.'),
('A Farewell to Arms', 'Charles Scribner’s Sons', 

