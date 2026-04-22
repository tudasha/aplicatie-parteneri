

-- Connect to movies_db before running the rest

-- =========================
-- 1. Genres
-- =========================
CREATE TABLE genres (
    genre_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- =========================
-- 2. Movies
-- =========================
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    release_year INT,
    duration_minutes INT,
    rating NUMERIC(3,1), -- e.g. 7.8
    genre_id INT REFERENCES genres(genre_id),
    director_id INT
);

-- =========================
-- 3. Actors
-- =========================
CREATE TABLE actors (
    actor_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    birth_date DATE
);

-- =========================
-- 4. Directors
-- =========================
CREATE TABLE directors (
    director_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    birth_date DATE
);

-- Add FK from movies to directors
ALTER TABLE movies
ADD CONSTRAINT movies_director_fk FOREIGN KEY (director_id) REFERENCES directors(director_id);

-- =========================
-- 5. Movie Cast
-- =========================
CREATE TABLE movie_cast (
    cast_id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    actor_id INT REFERENCES actors(actor_id) ON DELETE CASCADE,
    role VARCHAR(100)
);

-- =========================
-- Sample Data
-- =========================

-- Genres
INSERT INTO genres (name) VALUES 
('Action'), 
('Drama'), 
('Comedy'),
('Sci-Fi'),
('Thriller');

-- Directors
INSERT INTO directors (first_name, last_name, birth_date) VALUES
('Christopher', 'Nolan', '1970-07-30'),
('Francis', 'Coppola', '1939-04-07'),
('Steven', 'Spielberg', '1946-12-18'),
('Quentin', 'Tarantino', '1963-03-27'),
('Martin', 'Scorsese', '1942-11-17');

-- Movies (15 entries)
-- Insert requested movies into movies table
INSERT INTO movies (title, release_year, duration_minutes, rating, genre_id, director_id) VALUES
('Harry Potter and the Goblet of Fire', 2005, 157, 7.7, 4, 1),   -- Fantasy/Sci-Fi, Director placeholder
('Schindler''s List', 1993, 195, 9.0, 2, 3),                     -- Drama, Spielberg
('Mean Girls', 2004, 97, 7.1, 3, 5),                             
('10 Things I Hate About You', 1999, 97, 7.3, 3, 5),             
('The Hunger Games', 2012, 142, 7.2, 4, 2),                      
('The Hunger Games: Catching Fire', 2013, 146, 7.5, 4, 2),
('The Hunger Games: Mockingjay Part 1', 2014, 123, 6.6, 4, 2),
('Alice in Wonderland', 2010, 108, 6.4, 4, 1),                   
('Interstellar', 2014, 169, 8.6, 4, 1),                          
('The Great Gatsby', 2013, 143, 7.2, 2, 5),                    


('The Matrix', 1999, 136, 8.7, 4, 1),
('Titanic', 1997, 195, 7.9, 2, 5),
('Avengers: Endgame', 2019, 181, 8.4, 1, 1),
('Forrest Gump', 1994, 142, 8.8, 2, 3),
('The Shawshank Redemption', 1994, 142, 9.3, 2, 3);



-- Actors (sample)
INSERT INTO actors (first_name, last_name, birth_date) VALUES
('Leonardo', 'DiCaprio', '1974-11-11'),
('Marlon', 'Brando', '1924-04-03'),
('Samuel', 'Jackson', '1948-12-21'),
('Robert', 'De Niro', '1943-08-17'),
('Al', 'Pacino', '1940-04-25')
('Matthew', 'McConaughey', '1969-11-04'),
('Anne', 'Hathaway', '1982-11-12'),
('Jessica', 'Chastain', '1977-03-24'),
('Michael', 'Caine', '1933-03-14'),
('Casey', 'Affleck', '1975-08-12'),
('Mackenzie', 'Foy', '2000-11-10'),
('Timothée', 'Chalamet', '1995-12-27'),
('Ellen', 'Burstyn', '1932-12-07'),
('John', 'Lithgow', '1945-10-19'),
('Wes', 'Bentley', '1978-09-04'),
('David', 'Gyasi', '1980-01-02'),
('Bill', 'Irwin', '1950-04-11'),
('Josh', 'Stewart', '1977-02-06'),
('Matt', 'Damon', '1970-10-08');
-- Movie Cast (sample links)
INSERT INTO movie_cast (movie_id, actor_id, role) VALUES
(1, 1, 'Lead'),
(2, 2, 'Lead'),
(4, 3, 'Supporting'),
(9, 4, 'Lead'),
(2, 5, 'Supporting')
(9, 1, 'Cooper'),              -- Matthew McConaughey
(9, 2, 'Brand'),               -- Anne Hathaway
(9, 3, 'Murph (adult)'),       -- Jessica Chastain
(9, 4, 'Professor Brand'),     -- Michael Caine
(9, 5, 'Tom (adult)'),         -- Casey Affleck
(9, 6, 'Murph (young)'),       -- Mackenzie Foy
(9, 7, 'Tom (teen)'),          -- Timothée Chalamet
(9, 8, 'Murph (elderly)'),     -- Ellen Burstyn
(9, 9, 'Donald'),              -- John Lithgow
(9, 10, 'Doyle'),              -- Wes Bentley
(9, 11, 'Romilly'),            -- David Gyasi
(9, 12, 'TARS (voice)'),       -- Bill Irwin
(9, 13, 'CASE (voice)'),       -- Josh Stewart
(9, 14, 'Dr. Mann');           -- Matt Damon
