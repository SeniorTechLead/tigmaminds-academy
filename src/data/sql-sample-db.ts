/**
 * Sample database schema and data for the SQL playground.
 * Matches the elephants/sightings/parks examples used throughout
 * the Databases & SQL reference sections.
 */
export const SQL_SAMPLE_DB_INIT = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS elephants (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    weight REAL CHECK(weight > 0),
    species TEXT DEFAULT 'Asian',
    park TEXT,
    last_seen DATE
);

CREATE TABLE IF NOT EXISTS parks (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT
);

CREATE TABLE IF NOT EXISTS sightings (
    id INTEGER PRIMARY KEY,
    elephant_id INTEGER NOT NULL,
    date DATE NOT NULL,
    location TEXT,
    park_id INTEGER,
    group_size INTEGER DEFAULT 1,
    FOREIGN KEY (elephant_id) REFERENCES elephants(id) ON DELETE CASCADE,
    FOREIGN KEY (park_id) REFERENCES parks(id)
);

CREATE TABLE IF NOT EXISTS park_elephants (
    elephant_id INTEGER,
    park_id INTEGER,
    first_seen DATE,
    PRIMARY KEY (elephant_id, park_id),
    FOREIGN KEY (elephant_id) REFERENCES elephants(id),
    FOREIGN KEY (park_id) REFERENCES parks(id)
);

-- Parks
INSERT OR IGNORE INTO parks (id, name, state) VALUES (1, 'Kaziranga', 'Assam');
INSERT OR IGNORE INTO parks (id, name, state) VALUES (2, 'Manas', 'Assam');
INSERT OR IGNORE INTO parks (id, name, state) VALUES (3, 'Nameri', 'Assam');

-- Elephants (5 animals, matching reference examples)
-- Tara has NULL last_seen (for NULL query examples)
-- Bala has NULL last_seen (for COUNT(*) vs COUNT(column) demo)
INSERT OR IGNORE INTO elephants (id, name, weight, species, park, last_seen) VALUES
    (1, 'Ranga',  4500, 'Asian', 'Kaziranga', '2026-03-15'),
    (2, 'Mohini', 3800, 'Asian', 'Manas',     '2026-02-20'),
    (3, 'Gaja',   5200, 'Asian', 'Kaziranga', '2026-03-28'),
    (4, 'Tara',   4100, 'Asian', 'Kaziranga',  NULL),
    (5, 'Bala',   3200, 'Asian', 'Manas',      NULL);

-- Sightings (Ranga has 2, Mohini has 1, Gaja has 2, Tara has 0, Bala has 1)
INSERT OR IGNORE INTO sightings (id, elephant_id, date, location, park_id, group_size) VALUES
    (1, 1, '2026-01-15', 'Kaziranga East',    1, 3),
    (2, 1, '2026-02-20', 'Kaziranga Central',  1, 5),
    (3, 2, '2026-01-22', 'Manas NP',           2, 2),
    (4, 3, '2026-03-01', 'Kaziranga East',     1, 8),
    (5, 3, '2026-03-15', 'Kaziranga West',     1, 4),
    (6, 5, '2026-02-10', 'Manas South',        2, 1);

-- Park-elephant associations (many-to-many)
INSERT OR IGNORE INTO park_elephants (elephant_id, park_id, first_seen) VALUES
    (1, 1, '2020-03-15'),
    (1, 2, '2022-06-10'),
    (2, 2, '2019-11-01'),
    (3, 1, '2021-01-20'),
    (4, 1, '2023-05-05'),
    (5, 2, '2024-08-12');

-- ═══════════════════════════════════════════
-- LIBRARY (The Boy Who Built a Library)
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT,
    pages INTEGER,
    year_published INTEGER,
    available INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    joined DATE
);

CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    loan_date DATE NOT NULL,
    return_date DATE,
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
);

INSERT OR IGNORE INTO books (id, title, author, genre, pages, year_published, available) VALUES
    (1, 'The Jungle Book', 'Rudyard Kipling', 'fiction', 277, 1894, 0),
    (2, 'A Brief History of Time', 'Stephen Hawking', 'science', 256, 1988, 1),
    (3, 'The Story of My Experiments with Truth', 'M.K. Gandhi', 'autobiography', 480, 1927, 1),
    (4, 'Wings of Fire', 'A.P.J. Abdul Kalam', 'autobiography', 180, 1999, 0),
    (5, 'Discovery of India', 'Jawaharlal Nehru', 'history', 595, 1946, 1),
    (6, 'Gitanjali', 'Rabindranath Tagore', 'poetry', 103, 1910, 1),
    (7, 'The God of Small Things', 'Arundhati Roy', 'fiction', 321, 1997, 0),
    (8, 'Ignited Minds', 'A.P.J. Abdul Kalam', 'science', 198, 2002, 1);

INSERT OR IGNORE INTO members (id, name, age, joined) VALUES
    (1, 'Anamika', 14, '2025-06-01'),
    (2, 'Rishi', 12, '2025-07-15'),
    (3, 'Priya', 15, '2025-06-01'),
    (4, 'Dev', 13, '2025-09-10'),
    (5, 'Meera', 11, '2025-08-20');

INSERT OR IGNORE INTO loans (id, book_id, member_id, loan_date, return_date) VALUES
    (1, 1, 1, '2026-01-05', '2026-01-20'),
    (2, 4, 1, '2026-01-25', NULL),
    (3, 2, 2, '2026-02-01', '2026-02-14'),
    (4, 7, 3, '2026-02-10', NULL),
    (5, 1, 2, '2026-02-15', '2026-03-01'),
    (6, 6, 5, '2026-03-01', NULL),
    (7, 3, 4, '2026-03-05', '2026-03-20'),
    (8, 8, 3, '2026-03-10', NULL);

-- ═══════════════════════════════════════════
-- BUTTERFLIES (The Boy Who Counted Butterflies)
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS butterflies (
    id INTEGER PRIMARY KEY,
    species TEXT NOT NULL,
    color TEXT,
    wingspan_cm REAL,
    endangered INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS butterfly_sightings (
    id INTEGER PRIMARY KEY,
    butterfly_id INTEGER NOT NULL,
    observer TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT,
    count INTEGER DEFAULT 1,
    FOREIGN KEY (butterfly_id) REFERENCES butterflies(id)
);

INSERT OR IGNORE INTO butterflies (id, species, color, wingspan_cm, endangered) VALUES
    (1, 'Golden Birdwing', 'yellow-black', 19.5, 1),
    (2, 'Kaiser-i-Hind', 'green-gold', 12.0, 1),
    (3, 'Common Jezebel', 'white-yellow', 7.5, 0),
    (4, 'Blue Mormon', 'blue-black', 15.0, 0),
    (5, 'Orange Oakleaf', 'orange-brown', 8.5, 0),
    (6, 'Krishna Peacock', 'blue-green', 9.0, 1);

INSERT OR IGNORE INTO butterfly_sightings (id, butterfly_id, observer, date, location, count) VALUES
    (1, 1, 'Arjun', '2026-03-15', 'Namdapha', 2),
    (2, 3, 'Arjun', '2026-03-15', 'Namdapha', 15),
    (3, 4, 'Priya', '2026-03-18', 'Kaziranga Edge', 4),
    (4, 2, 'Arjun', '2026-03-20', 'Eaglenest', 1),
    (5, 5, 'Meera', '2026-03-22', 'Manas Buffer', 8),
    (6, 3, 'Priya', '2026-03-22', 'Kaziranga Edge', 22),
    (7, 6, 'Arjun', '2026-03-25', 'Eaglenest', 3),
    (8, 4, 'Meera', '2026-03-28', 'Hollongapar', 6),
    (9, 1, 'Priya', '2026-04-01', 'Namdapha', 1),
    (10, 5, 'Arjun', '2026-04-02', 'Manas Buffer', 12);

-- ═══════════════════════════════════════════
-- WEATHER (The Fisherman's Daughter and the Storm)
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS weather_stations (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT,
    elevation_m INTEGER
);

CREATE TABLE IF NOT EXISTS weather_readings (
    id INTEGER PRIMARY KEY,
    station_id INTEGER NOT NULL,
    date DATE NOT NULL,
    temp_c REAL,
    humidity_pct INTEGER,
    wind_kph REAL,
    rainfall_mm REAL DEFAULT 0,
    FOREIGN KEY (station_id) REFERENCES weather_stations(id)
);

INSERT OR IGNORE INTO weather_stations (id, name, district, elevation_m) VALUES
    (1, 'Jorhat AWS', 'Jorhat', 86),
    (2, 'Majuli Island', 'Majuli', 70),
    (3, 'Kaziranga Gate', 'Golaghat', 60),
    (4, 'Tezpur North', 'Sonitpur', 48);

INSERT OR IGNORE INTO weather_readings (id, station_id, date, temp_c, humidity_pct, wind_kph, rainfall_mm) VALUES
    (1,  1, '2026-06-01', 32.5, 85, 12.0, 0),
    (2,  1, '2026-06-02', 31.0, 92, 18.5, 45.2),
    (3,  1, '2026-06-03', 28.5, 95, 35.0, 120.8),
    (4,  2, '2026-06-01', 33.0, 82, 10.0, 0),
    (5,  2, '2026-06-02', 30.5, 90, 22.0, 38.5),
    (6,  2, '2026-06-03', 27.0, 98, 48.0, 185.3),
    (7,  3, '2026-06-01', 34.0, 78, 8.0, 0),
    (8,  3, '2026-06-02', 32.0, 88, 15.0, 22.0),
    (9,  3, '2026-06-03', 29.0, 94, 30.0, 95.6),
    (10, 4, '2026-06-01', 33.5, 80, 9.0, 0),
    (11, 4, '2026-06-02', 31.5, 86, 20.0, 30.0),
    (12, 4, '2026-06-03', 28.0, 96, 42.0, 155.0);
`;
