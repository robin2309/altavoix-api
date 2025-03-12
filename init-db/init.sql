-- Create a new database if not exists
SELECT 'CREATE DATABASE altavoix' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'altavoix')\gexec

-- Connect to the new database
\c altavoix;

-- Create tables
CREATE TABLE deputies (
    id TEXT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    picture_url TEXT,
    website TEXT,
    email TEXT,
    political_group TEXT,
    political_group_code TEXT,
    region TEXT,
    department TEXT
);

CREATE TABLE bills (
    id SERIAL PRIMARY KEY,
    bill_number TEXT,
    title TEXT NOT NULL,
    description TEXT
);

CREATE TABLE polls (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    bill_id INT,
    FOREIGN KEY (bill_id) REFERENCES bills(id),
    voted_at DATE
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    deputy_id TEXT NOT NULL,
    poll_id TEXT NOT NULL,
    standing VARCHAR(20) CHECK (standing IN ('in favor', 'against', 'abstention', 'absent')),
    FOREIGN KEY (deputy_id) REFERENCES deputies(id),
    FOREIGN KEY (poll_id) REFERENCES polls(id),
    UNIQUE(deputy_id, poll_id)
);
