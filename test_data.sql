-- Temporarily disable RLS for testing
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;

-- Insert test data
INSERT INTO teams (name, country_code, confederation) VALUES 
('Mexico', 'MEX', 'CONCACAF'), 
('USA', 'USA', 'CONCACAF');

-- Re-enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Test query
SELECT name, country_code FROM teams;
