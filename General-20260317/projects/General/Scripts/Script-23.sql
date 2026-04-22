-- 1. Delete the old, strict table
DROP TABLE IF EXISTS users CASCADE;

-- 2. Create a new, flexible table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    password_hash VARCHAR(100),
    full_name VARCHAR(100),  -- We will use this one column for names
    position VARCHAR(100),   -- Simple text (No more strict ENUM errors!)
    department VARCHAR(100),
    email VARCHAR(100)
);