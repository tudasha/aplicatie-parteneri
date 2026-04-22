-- Create companii table
CREATE TABLE IF NOT EXISTS companii (
    companie_id SERIAL PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    domeniu VARCHAR(255),
    website VARCHAR(255),
    is_confirmed BOOLEAN DEFAULT FALSE
);

-- Create pachete_sponsorizare table
CREATE TABLE IF NOT EXISTS pachete_sponsorizare (
    companie_id INT REFERENCES companii(companie_id) ON DELETE CASCADE,
    pachet_nume VARCHAR(255),
    valoare_totala_estimata_eur NUMERIC(15, 2),
    sezon VARCHAR(50)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(100) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    position VARCHAR(100), -- This is used as 'role' in the app (e.g., 'Team Leader')
    department VARCHAR(100),
    email VARCHAR(255) UNIQUE
);

-- Create company_assignments table (who is responsible for contacting)
CREATE TABLE IF NOT EXISTS company_assignments (
    assignment_id SERIAL PRIMARY KEY,
    companie_id INT REFERENCES companii(companie_id) ON DELETE CASCADE,
    username VARCHAR(100) REFERENCES users(username) ON DELETE SET NULL,
    assigned_date TIMESTAMP DEFAULT NOW(),
    UNIQUE(companie_id)
);

-- Create company_notes table (notations, email/phone templates, satisfaction rating)
CREATE TABLE IF NOT EXISTS company_notes (
    note_id SERIAL PRIMARY KEY,
    companie_id INT REFERENCES companii(companie_id) ON DELETE CASCADE,
    author_username VARCHAR(100) REFERENCES users(username) ON DELETE SET NULL,
    note_text TEXT,
    email_model TEXT,
    phone_script TEXT,
    satisfaction_rating INT CHECK (satisfaction_rating BETWEEN 1 AND 10),
    sezon VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin user
-- Position must be 'Team Leader' to have administrative privileges in the app
INSERT INTO users (username, password_hash, full_name, position, department, email)
VALUES ('admin', 'admin', 'Administrator', 'Team Leader', 'Management', 'admin@arttu.ro')
ON CONFLICT (username) DO NOTHING;
