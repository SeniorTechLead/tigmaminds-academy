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

-- ═══════════════════════════════════════════
-- FIREFLIES (The Firefly Festival of Majuli)
-- Connects to Level 4 capstone: Kuramoto synchronization model
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS firefly_species (
    id INTEGER PRIMARY KEY,
    species TEXT NOT NULL,
    flash_hz REAL,             -- natural flash frequency in Hz
    glow_color TEXT,           -- yellow, green, orange
    sync_tendency TEXT          -- 'strong', 'weak', 'none'
);

CREATE TABLE IF NOT EXISTS firefly_surveys (
    id INTEGER PRIMARY KEY,
    species_id INTEGER NOT NULL,
    location TEXT NOT NULL,
    date DATE NOT NULL,
    count INTEGER DEFAULT 1,
    sync_observed INTEGER DEFAULT 0,  -- 1 if group synchronization seen
    observer TEXT,
    FOREIGN KEY (species_id) REFERENCES firefly_species(id)
);

INSERT OR IGNORE INTO firefly_species (id, species, flash_hz, glow_color, sync_tendency) VALUES
    (1, 'Pteroptyx malaccae',    3.0, 'yellow',  'strong'),
    (2, 'Luciola praeusta',      1.5, 'green',   'weak'),
    (3, 'Asymmetricata circumdata', 2.2, 'orange', 'strong'),
    (4, 'Colophotia brevis',     4.0, 'yellow',  'none'),
    (5, 'Luciola ficta',         1.8, 'green',   'weak');

INSERT OR IGNORE INTO firefly_surveys (id, species_id, location, date, count, sync_observed, observer) VALUES
    (1,  1, 'Majuli North Bank',    '2026-02-10', 200, 1, 'Rina'),
    (2,  1, 'Majuli South Bank',    '2026-02-10', 350, 1, 'Rina'),
    (3,  2, 'Kaziranga Edge',       '2026-02-12', 80,  0, 'Bhaskar'),
    (4,  3, 'Majuli North Bank',    '2026-02-15', 120, 1, 'Rina'),
    (5,  4, 'Manas Riverbank',      '2026-02-18', 45,  0, 'Deepa'),
    (6,  1, 'Majuli North Bank',    '2026-03-01', 500, 1, 'Bhaskar'),
    (7,  2, 'Majuli South Bank',    '2026-03-01', 150, 1, 'Rina'),
    (8,  5, 'Hollongapar Forest',   '2026-03-05', 30,  0, 'Deepa'),
    (9,  3, 'Majuli South Bank',    '2026-03-10', 220, 1, 'Bhaskar'),
    (10, 1, 'Majuli North Bank',    '2026-03-15', 800, 1, 'Rina'),
    (11, 2, 'Kaziranga Edge',       '2026-03-15', 60,  0, 'Deepa'),
    (12, 4, 'Manas Riverbank',      '2026-03-20', 25,  0, 'Bhaskar');

-- ═══════════════════════════════════════════
-- DOLPHINS (The River Dolphin's Secret)
-- Connects to Level 4 capstone: underwater acoustic modem
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS river_dolphins (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    species TEXT DEFAULT 'Ganges River Dolphin',
    length_cm REAL,
    estimated_age INTEGER,
    river_section TEXT
);

CREATE TABLE IF NOT EXISTS sonar_clicks (
    id INTEGER PRIMARY KEY,
    dolphin_id INTEGER NOT NULL,
    date DATE NOT NULL,
    frequency_khz REAL,        -- echolocation click frequency
    duration_ms REAL,          -- click duration
    depth_m REAL,              -- water depth at recording
    prey_detected INTEGER DEFAULT 0,
    FOREIGN KEY (dolphin_id) REFERENCES river_dolphins(id)
);

INSERT OR IGNORE INTO river_dolphins (id, name, species, length_cm, estimated_age, river_section) VALUES
    (1, 'Ganga',   'Ganges River Dolphin', 210, 12, 'Brahmaputra Upper'),
    (2, 'Sisu',    'Ganges River Dolphin', 180, 8,  'Brahmaputra Middle'),
    (3, 'Makara',  'Ganges River Dolphin', 240, 18, 'Brahmaputra Upper'),
    (4, 'Jala',    'Ganges River Dolphin', 160, 5,  'Brahmaputra Lower'),
    (5, 'Dhara',   'Ganges River Dolphin', 195, 10, 'Brahmaputra Middle');

INSERT OR IGNORE INTO sonar_clicks (id, dolphin_id, date, frequency_khz, duration_ms, depth_m, prey_detected) VALUES
    (1,  1, '2026-03-01', 65.2, 0.12, 4.5, 1),
    (2,  1, '2026-03-01', 72.8, 0.08, 4.5, 0),
    (3,  2, '2026-03-02', 58.0, 0.15, 3.2, 1),
    (4,  3, '2026-03-02', 80.5, 0.06, 6.0, 1),
    (5,  3, '2026-03-03', 75.0, 0.09, 5.8, 0),
    (6,  4, '2026-03-04', 55.0, 0.18, 2.5, 1),
    (7,  4, '2026-03-04', 60.0, 0.14, 2.5, 1),
    (8,  5, '2026-03-05', 68.3, 0.11, 4.0, 0),
    (9,  2, '2026-03-06', 62.0, 0.13, 3.5, 1),
    (10, 1, '2026-03-07', 70.0, 0.10, 5.0, 1),
    (11, 3, '2026-03-08', 85.0, 0.05, 6.2, 1),
    (12, 5, '2026-03-08', 66.0, 0.12, 3.8, 0);

-- ═══════════════════════════════════════════
-- SILK (Why the Muga Silk Is Golden)
-- Connects to Level 4 capstone: materials science / fiber analysis
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS silk_fibers (
    id INTEGER PRIMARY KEY,
    fiber_type TEXT NOT NULL,          -- 'muga', 'eri', 'pat', 'mulberry'
    origin_district TEXT,
    tensile_strength_mpa REAL,        -- megapascals
    elongation_pct REAL,              -- stretch before breaking
    luster_score REAL,                -- 1-10 subjective quality
    golden_hue INTEGER DEFAULT 0      -- 1 if naturally golden
);

CREATE TABLE IF NOT EXISTS silk_production (
    id INTEGER PRIMARY KEY,
    fiber_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    cocoons_kg REAL,
    raw_silk_kg REAL,
    village TEXT,
    weaver TEXT,
    FOREIGN KEY (fiber_id) REFERENCES silk_fibers(id)
);

INSERT OR IGNORE INTO silk_fibers (id, fiber_type, origin_district, tensile_strength_mpa, elongation_pct, luster_score, golden_hue) VALUES
    (1, 'muga',     'Sivasagar',  400, 26.0, 9.2, 1),
    (2, 'muga',     'Jorhat',     385, 24.5, 8.8, 1),
    (3, 'eri',      'Kamrup',     280, 18.0, 6.5, 0),
    (4, 'pat',      'Sualkuchi',  350, 22.0, 7.8, 0),
    (5, 'mulberry', 'Karnataka',  320, 20.0, 7.0, 0),
    (6, 'muga',     'Dibrugarh',  410, 27.5, 9.5, 1);

INSERT OR IGNORE INTO silk_production (id, fiber_id, year, cocoons_kg, raw_silk_kg, village, weaver) VALUES
    (1,  1, 2024, 120.0, 8.5,  'Simaluguri',  'Bina Borah'),
    (2,  1, 2025, 145.0, 10.2, 'Simaluguri',  'Bina Borah'),
    (3,  2, 2024, 95.0,  6.8,  'Titabar',     'Hema Gogoi'),
    (4,  2, 2025, 110.0, 7.9,  'Titabar',     'Hema Gogoi'),
    (5,  3, 2024, 200.0, 12.0, 'Palasbari',   'Rina Das'),
    (6,  3, 2025, 220.0, 13.5, 'Palasbari',   'Rina Das'),
    (7,  4, 2024, 180.0, 11.0, 'Sualkuchi',   'Moni Kalita'),
    (8,  4, 2025, 175.0, 10.8, 'Sualkuchi',   'Moni Kalita'),
    (9,  5, 2024, 300.0, 22.0, 'Ramanagara',  'Lakshmi Devi'),
    (10, 5, 2025, 310.0, 23.0, 'Ramanagara',  'Lakshmi Devi'),
    (11, 6, 2024, 80.0,  5.5,  'Lahowal',     'Juri Phukan'),
    (12, 6, 2025, 100.0, 7.0,  'Lahowal',     'Juri Phukan');
`;
