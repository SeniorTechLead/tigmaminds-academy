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
`;
