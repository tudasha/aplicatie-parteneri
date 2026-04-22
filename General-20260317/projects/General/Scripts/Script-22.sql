-- This adds the columns without deleting your current users or breaking connections
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS position VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(50);

-- If full_name must be NOT NULL, we give it a default value first for existing rows
UPDATE users SET full_name = username WHERE full_name IS NULL;
ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;