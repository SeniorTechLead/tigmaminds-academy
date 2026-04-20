import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'databases-and-sql',
  title: 'Databases & SQL',
  category: 'database',
  icon: '📊',
  tagline: 'Store, query, and organize data — the foundation of every app, website, and AI system.',

  understand: [
    {
      title: 'What Is a Database?',
      beginnerContent:
        'Click around the table above. Click a column header, a row, a cell, a data type. Every part has a name. Put these names together and you can describe where any piece of data lives in any database on Earth — *this row, in this column, in this table*.\n\n' +
        'A database is just an organized collection of data. But why not use a spreadsheet? For a hundred rows, a spreadsheet works fine. For a million rows, it crashes. For 10 million products, 50 million customers, and billions of orders — the scale of any real app you use daily (Instagram, Zomato, your bank) — a spreadsheet isn\'t even in the conversation. Databases are built specifically for this scale, and they answer queries in **milliseconds**.\n\n' +
        'Most databases organize data into **tables** — rectangles with columns (categories like name, email, age) and rows (each individual record — one customer, one elephant, one order). A students table has columns for roll_number, name, class, marks. Each student is one row. Simple.\n\n' +
        'The real superpower: tables can **relate** to each other. A "marks" table references the "students" table by roll_number — that\'s why this is called a *relational* database. Store each student\'s name once in the students table; every other table just points to it. Update the name in one place and the entire system stays consistent.',
      advancedContent:
        'When your database grows, two problems appear: **redundancy** (the same data stored in multiple places) and **speed** (finding data in millions of rows).\n\n' +
        '**The redundancy problem.** Imagine you store each elephant\'s park name directly in the sightings table: every time Ranga is sighted, "Kaziranga National Park, Assam, India" is written again. Now Kaziranga changes its official name. You have to find and update every single sighting row — miss one, and your data contradicts itself. The fix: store park information once in a `parks` table, and in sightings just store `park_id = 1`. One update to the parks table fixes everything. This process of removing redundancy is called **normalization**.\n\n' +
        '**The speed problem.** Searching 10 million rows one by one is slow. An **index** is like a book\'s index — instead of reading every page to find "Kaziranga", you look up "K" in the index and jump directly to the right page. Databases use B-tree indexes: `CREATE INDEX idx_park ON elephants(park)` lets `WHERE park = \'Kaziranga\'` skip straight to matching rows instead of scanning all 10 million.\n\n' +
        '**The safety problem.** If you transfer money between two bank accounts — debit Account A, then credit Account B — and the system crashes between those two steps, the money vanishes. **Transactions** group operations so they either ALL succeed or ALL roll back: `BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;` — if anything fails, neither account changes.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'A database is just a fancy name for a spreadsheet.', answer: false, explanation: 'Databases are purpose-built software that can handle millions of records, enforce data rules, and support many users at once — far beyond what spreadsheets can do.' },
            { text: 'In a relational database, data is organized into tables with rows and columns.', answer: true, explanation: 'Tables (with columns for categories and rows for records) are the fundamental structure of relational databases.' },
          ],
        },
      },
      diagram: 'SQLTableDiagram',
    },
    {
      title: 'SQL Basics: SELECT, FROM, WHERE',
      beginnerContent:
        'Watch a query execute in the diagram above. A SQL query isn\'t one action — it\'s a pipeline. The database reads `FROM table`, filters with `WHERE`, picks columns with `SELECT`, and hands you the result. Three steps, one English-like sentence, powered by decades of optimisation.\n\n' +
        'SQL (Structured Query Language, pronounced "sequel") is how you talk to a relational database. The most common thing you do is read data, and the basic shape is:\n\n' +
        '```sql\nSELECT column1, column2 FROM table_name WHERE condition;\n```\n\n' +
        '`SELECT name, marks FROM students WHERE class = 10;` asks: *"give me the name and marks of every student in class 10."* That\'s it. `SELECT *` means "all columns." No WHERE clause = every row in the table.\n\n' +
        'Here\'s the superpower: SQL is **declarative**. You describe *what* you want, not *how* to get it. Compare finding top students in Python vs SQL:\n\n' +
        '```python\n# Python — imperative, you write every step\nresults = []\nfor student in students:\n    if student["marks"] > 80:\n        results.append(student["name"])\n```\n\n' +
        '```sql\n-- SQL — declarative, describe the goal\nSELECT name FROM students WHERE marks > 80;\n```\n\n' +
        'The database figures out the fastest path to those rows — maybe it reads sequentially, maybe it uses an index, maybe it parallelises. You don\'t care. **This is why SQL, designed in the 1970s, is still the standard 50 years later.** Every app you use — Instagram, Google, Zomato, your bank — is firing SQL queries behind every button tap.',
      diagram: 'SQLQueryFlowDiagram',
    },
    {
      title: 'Filtering and Sorting: ORDER BY, LIMIT, LIKE, AND/OR',
      beginnerContent:
        'Play with the filters above. Tick conditions, change the sort direction, set a limit — watch rows appear and disappear. This is exactly how leaderboards, search results, and "top 10" lists work in every app.\n\n' +
        '**`ORDER BY`** sorts your results. `SELECT name, marks FROM students ORDER BY marks DESC;` returns students ranked from highest to lowest. Add `LIMIT 5` to get only the top five. That\'s how leaderboards, best-selling lists, and "trending now" sections work.\n\n' +
        '**`LIKE`** searches for text patterns. `SELECT name FROM students WHERE name LIKE \'A%\';` finds every name starting with A. `%` means "anything can follow." This is the building block of search-as-you-type, autocomplete, and fuzzy lookups.\n\n' +
        '**`AND` / `OR`** combine conditions: `WHERE class = 10 AND marks > 80` finds high-scoring 10th graders; `WHERE class = 10 OR class = 12` finds any student in either class. No loops, no if-statements — just describe the data you want, and the database finds it.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each SQL clause to its purpose',
          pairs: [
            ['ORDER BY', 'Sort results by a column'],
            ['LIMIT', 'Restrict the number of rows returned'],
            ['LIKE', 'Search for text patterns using wildcards'],
            ['AND', 'Require multiple conditions to be true'],
            ['WHERE', 'Filter rows that match a condition'],
          ],
        },
      },
      diagram: 'SQLFilterSortDiagram',
    },
    {
      title: 'Joins: Combining Tables',
      beginnerContent:
        'Toggle between INNER, LEFT, RIGHT, and FULL in the diagram above. Watch the Venn diagrams light up and the result table change. The difference between join types is visual — once you see it, you never forget it.\n\n' +
        'Real databases split data across many tables. A students table (roll_number, name, class) and a marks table (roll_number, subject, score). To see each student\'s name alongside their marks, you need to **combine** the two — that\'s a **join**:\n\n' +
        '```sql\nSELECT students.name, marks.subject, marks.score\nFROM students JOIN marks ON students.roll_number = marks.roll_number;\n```\n\n' +
        'The `JOIN ... ON` clause tells the database which column connects the two tables. This is a **one-to-many** relationship: one student has many marks rows (one per subject). Without joins, you\'d have to repeat the student\'s name and class in every single marks row — massive duplication, guaranteed errors.\n\n' +
        'Three common join types:\n\n' +
        '- **INNER JOIN** (the default) — only rows where BOTH tables have a match. Students who have marks recorded.\n' +
        '- **LEFT JOIN** — all rows from the left table, even if no match in the right. Useful for "which students haven\'t submitted marks yet?"\n' +
        '- **RIGHT JOIN** — the mirror image. All rows from the right.\n\n' +
        '**Joins are the single most important SQL concept.** Real-world data is always split across related tables, and combining them is the daily job of anyone working with a database.',
      diagram: 'SQLJoinDiagram',
    },
    {
      title: 'Creating and Modifying Data',
      beginnerContent:
        'Pick an operation in the diagram above — INSERT, UPDATE, or DELETE — and watch rows change. Each operation changes the table in a specific, irreversible way. This is the dangerous, powerful side of SQL.\n\n' +
        'Reading data is only half the story. The four big write operations:\n\n' +
        '```sql\n-- Add a new row\nINSERT INTO students (name, class) VALUES (\'Ananya\', 10);\n\n-- Change existing data\nUPDATE students SET class = 11 WHERE name = \'Ananya\';\n\n-- Remove a row\nDELETE FROM students WHERE roll_number = 42;\n\n-- Define a new table from scratch\nCREATE TABLE students (\n  roll_number INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  class INTEGER,\n  marks REAL\n);\n```\n\n' +
        '**Constraints** are the guardrails. `PRIMARY KEY` forbids duplicates. `NOT NULL` forbids missing values. `FOREIGN KEY` forbids pointing to a non-existent row in another table. These aren\'t suggestions — the database **refuses** to accept bad data. That\'s why they\'re called constraints, not recommendations.\n\n' +
        'And here\'s the single most important concept in this section: the **transaction**. A transaction is a group of operations that either ALL succeed or ALL fail — nothing in between. Transfer money between bank accounts: debit Account A, credit Account B. If the system crashes between those two lines, the money would vanish. Transactions make that impossible:\n\n' +
        '```sql\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n```\n\n' +
        'If anything in this block fails, the whole thing rolls back. Neither account changes. This property — **atomicity** — is why banks, airlines, and hospitals have trusted SQL databases for 50 years. The world\'s money moves through transactions.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'DELETE FROM students; (with no WHERE clause) will delete every row in the table.', answer: true, explanation: 'Without a WHERE clause, DELETE applies to all rows. This is why production databases have backups and access controls.' },
            { text: 'A PRIMARY KEY column can contain duplicate values.', answer: false, explanation: 'A primary key must be unique for every row — the database will reject any insert that duplicates an existing key.' },
            { text: 'Transactions ensure that a group of database operations either all succeed or all fail.', answer: true, explanation: 'This "all or nothing" property (called atomicity) prevents data corruption during failures.' },
          ],
        },
      },
      diagram: 'SQLMutationDiagram',
    },
  ],

  build: [
    {
      id: 'sql-select',
      title: 'SELECT — Reading Data',
      beginnerContent:
        'Try a few queries in the flow diagram above. See how every query breaks into clear stages: pick a table, filter rows, pick columns, return. That\'s SELECT.\n\n' +
        '`SELECT` is the most common SQL statement. It reads data from one or more tables.\n\n' +
        '**Basic pattern:** `SELECT columns FROM table WHERE condition ORDER BY column LIMIT n;`\n\n' +
        '**SELECT *:** returns all columns — convenient for exploration, but in production name the columns you need. Why? With `SELECT *` the database sends every column (name, weight, park, species, created_at, notes, photo_url...) when you only needed name and weight. That\'s wasted memory and network bandwidth, especially with millions of rows.\n\n' +
        '**WHERE operators:** `=`, `!=`, `<`, `>`, `<=`, `>=`, `BETWEEN ... AND ...`, `IN (...)`, `LIKE` (pattern matching with `%` and `_` wildcards), `IS NULL` / `IS NOT NULL`.\n\n' +
        '**Combining conditions:** `AND` (both must be true), `OR` (either), `NOT` (invert). Use parentheses to group: `WHERE (park = "Kaziranga" OR park = "Manas") AND weight > 4000`.\n\n' +
        '**DISTINCT:** `SELECT DISTINCT park FROM elephants` returns each park name only once — removes duplicate rows from the result.',
      code: `-- All elephants
SELECT * FROM elephants;

-- Specific columns
SELECT name, weight FROM elephants;

-- Filter with WHERE
SELECT name, weight
FROM elephants
WHERE weight > 4000;

-- Multiple conditions
SELECT name, weight, park
FROM elephants
WHERE park = 'Kaziranga' AND weight > 4000;

-- Pattern matching
SELECT name FROM elephants
WHERE name LIKE 'R%';     -- starts with R
-- WHERE name LIKE '%a';  -- ends with a
-- WHERE name LIKE '_a%'; -- second letter is a

-- IN: match any value in a list
SELECT name, park FROM elephants
WHERE park IN ('Kaziranga', 'Manas');

-- BETWEEN: range (inclusive)
SELECT name, weight FROM elephants
WHERE weight BETWEEN 3500 AND 5000;

-- NULL checks
SELECT name FROM elephants
WHERE last_seen IS NULL;  -- never seen

-- Sort + limit
SELECT name, weight
FROM elephants
ORDER BY weight DESC   -- heaviest first
LIMIT 5;               -- top 5 only

-- Unique values
SELECT DISTINCT park FROM elephants;
-- Returns: Kaziranga, Manas (no duplicates)

-- Aliases make output readable
SELECT name AS elephant_name,
     weight AS weight_kg,
     weight * 2.2 AS weight_lbs
FROM elephants;`,
      diagram: 'SQLQueryFlowDiagram',
      interactive: {
        type: 'sql-playground',
        props: {
          starterCode: "-- Try these queries on the sample database\nSELECT * FROM elephants;\n\n-- Filter by weight\nSELECT name, weight FROM elephants\nWHERE weight > 4000\nORDER BY weight DESC;",
          title: 'Try SELECT Queries',
        },
      },
    },
    {
      id: 'sql-aggregate',
      title: 'Aggregates & GROUP BY',
      beginnerContent:
        'Watch the alias diagram above — see how table aliases and column aliases get resolved at different stages of query execution. This is the single most common trap in SQL: you write `WHERE avg_weight > 4000` and it fails, because the alias doesn\'t exist yet when WHERE runs.\n\n' +
        '**Aggregate functions** collapse multiple rows into a single value: `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`.\n\n' +
        '**GROUP BY** splits rows into groups and applies aggregates to each group separately. `SELECT park, COUNT(*) FROM elephants GROUP BY park` gives the count per park.\n\n' +
        '**HAVING** filters groups (like WHERE, but runs after GROUP BY). `HAVING COUNT(*) > 2` keeps only groups with more than 2 rows.\n\n' +
        '**Execution order matters:** FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.\n\n' +
        'There are two kinds of aliases in SQL. **Table aliases** are nicknames for tables, defined in FROM: `FROM elephants e` — these work everywhere because FROM runs first. **Column aliases** are nicknames for result columns, defined in SELECT: `SELECT AVG(weight) AS avg_w` — these are the ones that cause trouble, because SELECT runs near the end.\n\n' +
        'Since WHERE runs before SELECT, column aliases don\'t exist yet when WHERE is evaluated:\n\n' +
        '```\n-- ❌ FAILS: avg_w is a column alias created in SELECT — WHERE runs before SELECT\nSELECT park, AVG(weight) AS avg_w FROM elephants WHERE avg_w > 4000;\n\n-- ✅ WORKS: HAVING runs after GROUP BY, so the aggregate is available\nSELECT park, AVG(weight) AS avg_w FROM elephants GROUP BY park HAVING AVG(weight) > 4000;\n\n-- ✅ Table alias works fine — FROM runs before WHERE\nSELECT e.name FROM elephants e WHERE e.weight > 4000;\n```\n\n' +
        '**COUNT(*) vs COUNT(column):** `COUNT(*)` counts all rows including NULLs. `COUNT(column)` skips NULLs. Example: if 3 elephants have a `last_seen` date and 2 don\'t, `COUNT(*)` = 5 but `COUNT(last_seen)` = 3.',
      code: `-- Count all elephants
SELECT COUNT(*) AS total FROM elephants;
-- total: 5

-- Count per park
SELECT park, COUNT(*) AS num_elephants
FROM elephants
GROUP BY park;
-- Kaziranga | 3
-- Manas     | 2

-- Average weight per park
SELECT park,
     COUNT(*) AS count,
     ROUND(AVG(weight), 1) AS avg_weight,
     MIN(weight) AS lightest,
     MAX(weight) AS heaviest
FROM elephants
GROUP BY park;

-- HAVING: filter groups (not rows!)
SELECT park, AVG(weight) AS avg_w
FROM elephants
GROUP BY park
HAVING AVG(weight) > 4000;
-- Only Kaziranga (avg 4600) — Manas (avg 3500) excluded

-- SUM: total weight across all elephants
SELECT SUM(weight) AS total_weight FROM elephants;

-- Count sightings per elephant, sorted
SELECT e.name, COUNT(s.id) AS sighting_count
FROM elephants e
LEFT JOIN sightings s ON e.id = s.elephant_id
GROUP BY e.name
ORDER BY sighting_count DESC;

-- Combining WHERE and GROUP BY
-- WHERE filters rows BEFORE grouping
SELECT park, AVG(weight) AS avg_weight
FROM elephants
WHERE species = 'Asian'    -- filter first
GROUP BY park              -- then group
HAVING COUNT(*) >= 2       -- then filter groups
ORDER BY avg_weight DESC;  -- then sort

-- COUNT(*) vs COUNT(column) — the NULL difference
-- Suppose 2 elephants have NULL for last_seen:
SELECT COUNT(*) AS total_rows,       -- 5 (counts every row)
     COUNT(last_seen) AS with_date -- 3 (skips NULLs)
FROM elephants;

-- ❌ THIS FAILS — can't use alias in WHERE
-- SELECT park, AVG(weight) AS avg_w
-- FROM elephants WHERE avg_w > 4000;
-- Error: no such column: avg_w

-- ✅ Use HAVING instead (runs after SELECT)
SELECT park, AVG(weight) AS avg_w
FROM elephants
GROUP BY park
HAVING AVG(weight) > 4000;`,
      diagram: 'SQLAliasDiagram',
      interactive: {
        type: 'sql-playground',
        props: {
          starterCode: "-- Count elephants per park\nSELECT park, COUNT(*) AS num_elephants\nFROM elephants\nGROUP BY park;\n\n-- Average weight per park (only parks with 2+ elephants)\n-- SELECT park, ROUND(AVG(weight), 1) AS avg_weight\n-- FROM elephants\n-- GROUP BY park\n-- HAVING COUNT(*) >= 2;",
          title: 'Try GROUP BY Queries',
        },
      },
    },
    {
      id: 'sql-joins',
      title: 'Joins — Combining Tables',
      beginnerContent:
        'Click through the join types in the diagram above: INNER, LEFT, RIGHT, FULL. Watch the Venn diagram change, watch the result table change. This single diagram explains 80% of SQL\'s power.\n\n' +
        '**JOIN** combines rows from two or more tables based on a related column (usually a foreign key).\n\n' +
        '**INNER JOIN:** Returns only rows where both tables have a match. If an elephant has no sightings, it won\'t appear. If a sighting references a deleted elephant, it won\'t appear.\n\n' +
        '**LEFT JOIN:** All rows from the left table + matching rows from the right. If no match, right-side columns are NULL. Perfect for "show all elephants, even those never sighted."\n\n' +
        '**RIGHT JOIN:** Mirror of LEFT JOIN. All rows from the right table.\n\n' +
        '**FULL OUTER JOIN:** All rows from both tables. NULLs fill in wherever there\'s no match on either side.\n\n' +
        '**Table aliases** (`elephants e`, `sightings s`) keep queries short. Always qualify ambiguous column names — both tables have an `id` column, so `SELECT id` is ambiguous and will error. Write `SELECT e.id` or `SELECT s.id` to be explicit.',
      code: `-- Setup: two related tables
-- elephants: id, name, weight, park
-- sightings: id, elephant_id, date, location

-- INNER JOIN: only elephants WITH sightings
SELECT e.name, s.date, s.location
FROM elephants e
INNER JOIN sightings s ON e.id = s.elephant_id;

-- LEFT JOIN: ALL elephants, sightings if they exist
SELECT e.name, s.date, s.location
FROM elephants e
LEFT JOIN sightings s ON e.id = s.elephant_id;
-- Tara | NULL | NULL  (she has no sightings)

-- Find elephants with ZERO sightings
SELECT e.name
FROM elephants e
LEFT JOIN sightings s ON e.id = s.elephant_id
WHERE s.id IS NULL;

-- Count sightings per elephant (including zero)
SELECT e.name, COUNT(s.id) AS num_sightings
FROM elephants e
LEFT JOIN sightings s ON e.id = s.elephant_id
GROUP BY e.name
ORDER BY num_sightings DESC;

-- Join THREE tables
SELECT e.name, s.date, p.name AS park_name
FROM elephants e
JOIN sightings s ON e.id = s.elephant_id
JOIN parks p ON s.park_id = p.id
WHERE s.date >= '2025-01-01';

-- Self-join: find elephant pairs with similar weight
SELECT a.name, b.name, ABS(a.weight - b.weight) AS diff
FROM elephants a
JOIN elephants b ON a.id < b.id
WHERE ABS(a.weight - b.weight) < 500;`,
      diagram: 'SQLJoinDiagram',
      interactive: {
        type: 'sql-playground',
        props: {
          starterCode: "-- LEFT JOIN: all elephants, even those with no sightings\nSELECT e.name, s.date, s.location\nFROM elephants e\nLEFT JOIN sightings s ON e.id = s.elephant_id;",
          title: 'Try JOIN Queries',
        },
      },
    },
    {
      id: 'sql-relationships',
      title: 'Relationships & Foreign Keys',
      beginnerContent:
        'Hover over arrows in the diagram above — each one is a **foreign key** linking one table to another. These arrows are the glue that makes tables *relational*. Without them, every table would be an isolated spreadsheet.\n\n' +
        'Tables relate to each other through **foreign keys** — a column in one table that references the primary key of another.\n\n' +
        '**One-to-Many (1:N):** One elephant has many sightings. The sightings table has `elephant_id` pointing to `elephants.id`. This is the most common relationship.\n\n' +
        '**Many-to-Many (M:N):** An elephant visits many parks, and a park has many elephants. This requires a **junction table** (also called a bridge or linking table) with two foreign keys: `park_elephants(elephant_id, park_id)`.\n\n' +
        '**One-to-One (1:1):** Rare — one elephant has one GPS collar. Usually just extra columns on the same table.\n\n' +
        '**Referential integrity:** `FOREIGN KEY` constraints prevent orphan records:\n\n' +
        '```\n-- ❌ FAILS: no elephant with id=99 exists\nINSERT INTO sightings (elephant_id, date, location)\n  VALUES (99, \'2025-01-01\', \'Kaziranga\');\n-- Error: FOREIGN KEY constraint failed\n```\n\n' +
        '`ON DELETE CASCADE` means: when you delete an elephant, all its sightings are automatically deleted too. Without it, you\'d have to manually delete the sightings first, or the database would refuse to delete the elephant.',
      code: `-- One-to-Many: elephants → sightings
CREATE TABLE elephants (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  weight REAL CHECK(weight > 0),
  species TEXT DEFAULT 'Asian'
);

CREATE TABLE sightings (
  id INTEGER PRIMARY KEY,
  elephant_id INTEGER NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  group_size INTEGER DEFAULT 1,
  FOREIGN KEY (elephant_id)
      REFERENCES elephants(id)
      ON DELETE CASCADE  -- delete sightings if elephant removed
);

-- Many-to-Many: elephants ↔ parks (via junction table)
CREATE TABLE parks (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT
);

CREATE TABLE park_elephants (
  elephant_id INTEGER,
  park_id INTEGER,
  first_seen DATE,
  PRIMARY KEY (elephant_id, park_id),  -- composite PK
  FOREIGN KEY (elephant_id) REFERENCES elephants(id),
  FOREIGN KEY (park_id) REFERENCES parks(id)
);

-- Insert with relationships
INSERT INTO elephants (id, name, weight) VALUES (1, 'Ranga', 4500);
INSERT INTO parks (id, name, state) VALUES (1, 'Kaziranga', 'Assam');
INSERT INTO park_elephants (elephant_id, park_id, first_seen)
  VALUES (1, 1, '2020-03-15');

-- Query through the junction table
SELECT e.name, p.name AS park, pe.first_seen
FROM elephants e
JOIN park_elephants pe ON e.id = pe.elephant_id
JOIN parks p ON pe.park_id = p.id;

-- FK violation: this INSERT will FAIL
-- INSERT INTO sightings (elephant_id, date, location)
--   VALUES (99, '2025-01-01', 'Kaziranga');
-- Error: FOREIGN KEY constraint failed (no elephant with id=99)

-- CASCADE in action:
DELETE FROM elephants WHERE id = 1;
-- Because sightings has ON DELETE CASCADE,
-- all sightings with elephant_id = 1 are automatically deleted too.
-- Without CASCADE, this DELETE would fail because sightings still reference id=1.`,
      diagram: 'SQLRelationshipDiagram',
      interactive: {
        type: 'sql-playground',
        props: {
          starterCode: "-- Query through the junction table\nSELECT e.name, p.name AS park, pe.first_seen\nFROM elephants e\nJOIN park_elephants pe ON e.id = pe.elephant_id\nJOIN parks p ON pe.park_id = p.id;",
          title: 'Try Relationship Queries',
        },
      },
    },
    {
      id: 'sql-create-modify',
      title: 'CREATE, INSERT, UPDATE, DELETE',
      beginnerContent:
        'Interact with the table above. Try INSERTing, UPDATEing, or DELETing rows — watch the table state change. These are the four operations that do real work: creating, reading, updating, deleting (the classic **CRUD** cycle every app is built on).\n\n' +
        '**DDL (Data Definition Language):** `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE` — define and change the structure.\n\n' +
        '**DML (Data Manipulation Language):** `INSERT`, `UPDATE`, `DELETE` — add, change, and remove data.\n\n' +
        '**Constraints** enforce data rules: `PRIMARY KEY` (unique identifier), `NOT NULL` (required), `UNIQUE` (no duplicates), `CHECK` (value rules), `DEFAULT` (auto-fill), `FOREIGN KEY` (must reference existing row).\n\n' +
        '**Transactions** (`BEGIN`, `COMMIT`, `ROLLBACK`) group operations atomically — all succeed or all fail. Without a transaction, a bank transfer could debit Account A but crash before crediting Account B — money vanishes. With a transaction, the crash triggers `ROLLBACK` and Account A\'s balance is restored.\n\n' +
        '**Safety tip:** Always use WHERE with UPDATE and DELETE. `DELETE FROM elephants;` (no WHERE) deletes every row. Test with SELECT first: if `SELECT * FROM elephants WHERE id = 3` returns the right row, then `DELETE FROM elephants WHERE id = 3` is safe.',
      code: `-- CREATE TABLE with constraints
CREATE TABLE elephants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  weight REAL CHECK(weight > 0),
  species TEXT DEFAULT 'Asian',
  park TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- INSERT: add rows
INSERT INTO elephants (name, weight, park)
VALUES ('Ranga', 4500, 'Kaziranga');

-- Insert multiple rows
INSERT INTO elephants (name, weight, park) VALUES
  ('Mohini', 3800, 'Manas'),
  ('Gaja', 5200, 'Kaziranga'),
  ('Tara', 4100, 'Kaziranga');

-- UPDATE: modify existing rows (always use WHERE!)
UPDATE elephants
SET weight = 4600, park = 'Kaziranga Central'
WHERE name = 'Ranga';

-- DELETE: remove rows (always use WHERE!)
DELETE FROM elephants WHERE name = 'Tara';

-- Safety: test with SELECT first
SELECT * FROM elephants WHERE weight < 3000;
-- If that looks right, then:
-- DELETE FROM elephants WHERE weight < 3000;

-- ALTER TABLE: change structure
ALTER TABLE elephants ADD COLUMN last_seen DATE;

-- Transactions: all or nothing
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;
COMMIT;
-- If anything fails between BEGIN and COMMIT,
-- ROLLBACK undoes everything

-- DROP TABLE: delete entire table (irreversible!)
-- DROP TABLE elephants;  -- be very careful!`,
      diagram: 'SQLTableDiagram',
      interactive: {
        type: 'sql-playground',
        props: {
          starterCode: "-- Insert a new elephant\nINSERT INTO elephants (id, name, weight, park)\nVALUES (6, 'Lakshmi', 3900, 'Nameri');\n\n-- Verify it was added\nSELECT * FROM elephants;",
          title: 'Try INSERT / UPDATE / DELETE',
        },
      },
    },
    {
      id: 'sql-subqueries',
      title: 'Subqueries & Advanced Patterns',
      beginnerContent:
        'Watch the subquery unfold above. The inner query runs first, produces a result, and that result becomes the input to the outer query. Queries within queries — it\'s SQL\'s way of letting you answer multi-step questions in one statement.\n\n' +
        'A **subquery** is a SELECT inside another query. It lets you use the result of one query as input to another.\n\n' +
        '**WHERE subqueries:** `WHERE id IN (SELECT ...)` filters rows based on another query\'s results. `WHERE weight > (SELECT AVG(weight) FROM elephants)` compares against a computed value.\n\n' +
        '**FROM subqueries:** Use a query result as a temporary table: `SELECT * FROM (SELECT ...) AS temp`.\n\n' +
        '**EXISTS:** `WHERE EXISTS (SELECT 1 FROM sightings WHERE ...)` returns true if the subquery has any results. EXISTS stops as soon as it finds one match (short-circuits), while `IN` must build the full list first — so EXISTS is faster when the subquery could return thousands of rows but you only care whether *any* match exists.\n\n' +
        '**Common Table Expressions (CTEs):** `WITH name AS (SELECT ...) SELECT ... FROM name` — like naming a subquery. Cleaner, reusable, and can be recursive.\n\n' +
        '**Window functions:** `ROW_NUMBER()`, `RANK()`, `SUM() OVER (...)` compute values across rows **without collapsing them**. Compare: `SELECT park, COUNT(*) FROM elephants GROUP BY park` gives 2 rows (one per park). But `SELECT name, park, COUNT(*) OVER (PARTITION BY park) AS park_count FROM elephants` gives 5 rows — every elephant, each annotated with how many elephants share its park.',
      code: `-- Subquery in WHERE: elephants heavier than average
SELECT name, weight
FROM elephants
WHERE weight > (SELECT AVG(weight) FROM elephants);

-- Subquery with IN: elephants seen in Kaziranga
SELECT name FROM elephants
WHERE id IN (
  SELECT elephant_id FROM sightings
  WHERE location = 'Kaziranga East'
);

-- EXISTS: elephants that HAVE been sighted
SELECT name FROM elephants e
WHERE EXISTS (
  SELECT 1 FROM sightings s
  WHERE s.elephant_id = e.id
);

-- CTE (Common Table Expression): named subquery
WITH heavy AS (
  SELECT name, weight, park
  FROM elephants
  WHERE weight > 4000
)
SELECT park, COUNT(*) AS heavy_count
FROM heavy
GROUP BY park;

-- Multiple CTEs
WITH
  kaz AS (SELECT * FROM elephants WHERE park = 'Kaziranga'),
  sighting_counts AS (
      SELECT elephant_id, COUNT(*) AS cnt
      FROM sightings GROUP BY elephant_id
  )
SELECT k.name, COALESCE(sc.cnt, 0) AS times_seen
FROM kaz k
LEFT JOIN sighting_counts sc ON k.id = sc.elephant_id;

-- Window function: rank elephants by weight
SELECT name, weight,
     RANK() OVER (ORDER BY weight DESC) AS weight_rank
FROM elephants;

-- Running total (cumulative sum)
SELECT date, group_size,
     SUM(group_size) OVER (ORDER BY date) AS cumulative
FROM sightings;

-- Partition: rank within each park
SELECT name, park, weight,
     ROW_NUMBER() OVER (
         PARTITION BY park
         ORDER BY weight DESC
     ) AS rank_in_park
FROM elephants;

-- Window vs GROUP BY — see the difference:
-- GROUP BY collapses to 2 rows (one per park):
--   SELECT park, COUNT(*) FROM elephants GROUP BY park;
--   Kaziranga | 3
--   Manas     | 2

-- Window keeps all 5 rows, adds the count to each:
SELECT name, park,
     COUNT(*) OVER (PARTITION BY park) AS elephants_in_park
FROM elephants;
-- Ranga    | Kaziranga | 3
-- Gaja     | Kaziranga | 3
-- Tara     | Kaziranga | 3
-- Mohini   | Manas     | 2
-- Bala     | Manas     | 2`,
      diagram: 'SQLSubqueryDiagram',
      interactive: {
        type: 'sql-playground',
        props: {
          starterCode: "-- Elephants heavier than average\nSELECT name, weight\nFROM elephants\nWHERE weight > (SELECT AVG(weight) FROM elephants);\n\n-- Rank by weight using a window function\n-- SELECT name, weight,\n--        RANK() OVER (ORDER BY weight DESC) AS rank\n-- FROM elephants;",
          title: 'Try Subqueries & Window Functions',
        },
      },
    },
    {
      id: 'sql-normalization',
      title: 'Normalization — Why We Split Tables',
      beginnerContent:
        'Compare the two diagrams above. On one side: one fat "denormalized" table with duplicated data everywhere. On the other: two separate tables with a foreign key connecting them. Same information — wildly different quality. **Normalization** is the formal name for cleaning up that mess.\n\n' +
        'Imagine a wildlife ranger keeps one giant spreadsheet for everything:\n\n' +
        '| sighting_id | elephant_name | elephant_weight | park_name | park_state | date | location |\n' +
        '|---|---|---|---|---|---|---|\n' +
        '| 1 | Ranga | 4500 | Kaziranga National Park | Assam | 2026-01-15 | East Range |\n' +
        '| 2 | Ranga | 4500 | Kaziranga National Park | Assam | 2026-02-20 | Central Range |\n' +
        '| 3 | Ranga | 4500 | Manas National Park | Assam | 2026-03-10 | West Zone |\n\n' +
        'See the problem? "Ranga" and "4500" appear three times. "Kaziranga National Park, Assam" appears twice. Now imagine 10,000 sightings.\n\n' +
        '**What goes wrong with duplication:**\n' +
        '- **Update problem:** Ranga\'s weight changes to 4600. You have to find and update EVERY row that mentions Ranga. Miss one → your data contradicts itself.\n' +
        '- **Delete problem:** You delete all sightings for Manas park. Oops — you just lost the fact that Manas exists, because it was only stored inside sighting rows.\n' +
        '- **Insert problem:** A new park opens but has no sightings yet. You can\'t add it to this table — there\'s no sighting to attach it to.\n\n' +
        '**The fix: split into separate tables.** Store each elephant once in an `elephants` table. Store each park once in a `parks` table. The `sightings` table only stores IDs that point back:\n\n' +
        '`sightings: sighting_id, elephant_id, park_id, date, location`\n\n' +
        'Now Ranga\'s weight is stored once. Update it in one place → every query that joins to elephants automatically sees the new weight. This process of removing duplication by splitting tables is called **normalization.**\n\n' +
        '**Check yourself:** In the original spreadsheet, what happens if someone misspells "Kaziranga" as "Kaziranaga" in one row? With normalized tables, could that mistake happen?',
      intermediateContent:
        'Database textbooks give the steps of normalization formal names. Here\'s how they map to what you just learned:\n\n' +
        '**First Normal Form (1NF):** No repeating groups in a single cell. Instead of storing `parks_visited: "Kaziranga, Manas, Nameri"` as one text field, create a separate `park_elephants` table with one row per visit. You did this when you split the messy spreadsheet into separate tables.\n\n' +
        '**Second Normal Form (2NF):** Every column depends on the *entire* primary key. If your sightings table has a composite key `(elephant_id, date)` and you also store `elephant_name` — that name depends only on `elephant_id`, not on the date. Move it to the elephants table. You did this when you stopped storing elephant data inside sighting rows.\n\n' +
        '**Third Normal Form (3NF):** No column depends on another non-key column. If you store `park_name` and `park_state` in the elephants table, `park_state` depends on `park_name`, not on the elephant. Move both to a parks table. You did this when you created the parks table.\n\n' +
        '**How far do you split?** The practical test: "If I change this value, do I have to change it in more than one row?" If yes → split it into its own table. If parks just have a name → a text column is fine. If parks have name, state, area, ranger_count → a separate table avoids repeating all that data.',
      advancedContent:
        '**Denormalization — intentionally adding duplication back.** Sometimes a normalized database is too slow because a frequent query requires joining 5 tables. The fix: store a copy of the data you need in the table you\'re querying. For example, storing `elephant_name` directly in the sightings table so you don\'t have to JOIN elephants every time you list sightings.\n\n' +
        'The tradeoff is explicit: reads get faster (no JOIN), but writes get more complex (update the name in BOTH tables). This is common in read-heavy applications — dashboards, analytics, feeds — where the same query runs millions of times but data changes rarely.\n\n' +
        '**How real apps handle this:** Many applications normalize first (correct data), then add strategic denormalization for performance (fast reads). Tools like materialized views automate this — a materialized view is a pre-computed JOIN result that the database keeps up to date automatically when the source tables change.',
      code: `-- THE PROBLEM: one big messy table
-- (Don't do this in real databases)
CREATE TABLE bad_sightings (
  id INTEGER PRIMARY KEY,
  elephant_name TEXT,
  elephant_weight REAL,
  park_name TEXT,
  park_state TEXT,
  date DATE,
  location TEXT
);

INSERT INTO bad_sightings VALUES
  (1, 'Ranga', 4500, 'Kaziranga NP', 'Assam', '2026-01-15', 'East'),
  (2, 'Ranga', 4500, 'Kaziranga NP', 'Assam', '2026-02-20', 'Central'),
  (3, 'Ranga', 4500, 'Manas NP',     'Assam', '2026-03-10', 'West');

-- How many times is "Ranga" stored?
SELECT elephant_name, COUNT(*) AS times_duplicated
FROM bad_sightings
GROUP BY elephant_name;
-- Ranga | 3  (wasteful and dangerous)

-- THE FIX: normalized tables (already in our sample DB)
-- Ranga's weight stored ONCE:
SELECT name, weight FROM elephants WHERE name = 'Ranga';

-- Sightings just reference the ID:
SELECT s.id, s.elephant_id, s.date, s.location
FROM sightings s
WHERE s.elephant_id = 1;

-- Need the full picture? JOIN puts it back together:
SELECT e.name, e.weight, s.date, s.location, p.name AS park
FROM sightings s
JOIN elephants e ON s.elephant_id = e.id
JOIN parks p ON s.park_id = p.id
WHERE e.name = 'Ranga';

-- Update weight in ONE place — all queries see it instantly
UPDATE elephants SET weight = 4600 WHERE name = 'Ranga';

-- Clean up our bad example
DROP TABLE bad_sightings;`,
      diagram: 'SQLNormalizationDiagram',
      interactive: {
        type: 'sql-playground',
        props: {
          starterCode: "-- See the normalized version in action:\n-- Elephant data stored once\nSELECT * FROM elephants;\n\n-- Sightings reference by ID, not by copying names\nSELECT * FROM sightings;\n\n-- JOIN reconstructs the full picture\nSELECT e.name, e.weight, s.date, s.location\nFROM sightings s\nJOIN elephants e ON s.elephant_id = e.id;",
          title: 'Normalized vs Denormalized',
        },
      },
    },
    {
      id: 'sql-sorting',
      title: 'Sorting & Pagination',
      beginnerContent:
        'Play with the sort controls above — flip ASC/DESC, try multi-column sort, move the LIMIT/OFFSET sliders. Every infinite-scroll feed, every paginated search result, every leaderboard in every app uses this exact pattern.\n\n' +
        '`ORDER BY` sorts your results. By default, sorting is **ascending** (ASC) — smallest first for numbers, A→Z for text. Add `DESC` for descending — largest first, Z→A.\n\n' +
        '**Multi-column sorting:** `ORDER BY park ASC, weight DESC` — first sorts by park alphabetically, then within each park, sorts by weight heaviest first.\n\n' +
        '**Pagination with LIMIT + OFFSET:** Real apps don\'t show 10,000 results at once. `LIMIT 10` returns only 10 rows. `OFFSET 20` skips the first 20. Together: `LIMIT 10 OFFSET 20` = rows 21-30 (page 3 of 10-per-page).\n\n' +
        '**NULLs in sorting:** NULL values sort last in ASC order and first in DESC order (in SQLite). If you need different behavior: `ORDER BY last_seen IS NULL, last_seen DESC` — this puts non-NULL rows first.\n\n' +
        '**Check yourself:** `LIMIT 5 OFFSET 10` — which rows does this return from a 100-row table? (Answer: rows 11-15.)',
      code: `-- ASC (default) vs DESC
SELECT name, weight FROM elephants ORDER BY weight ASC;   -- lightest first
SELECT name, weight FROM elephants ORDER BY weight DESC;  -- heaviest first

-- Multi-column sort: by park, then weight within park
SELECT name, park, weight FROM elephants
ORDER BY park ASC, weight DESC;
-- Kaziranga: Gaja(5200), Ranga(4500), Tara(4100)
-- Manas: Mohini(3800), Bala(3200)

-- Pagination: 2 per page
SELECT name, weight FROM elephants
ORDER BY weight DESC
LIMIT 2 OFFSET 0;  -- Page 1: Gaja, Ranga

SELECT name, weight FROM elephants
ORDER BY weight DESC
LIMIT 2 OFFSET 2;  -- Page 2: Tara, Mohini

-- NULLs: put sighted elephants first
SELECT name, last_seen FROM elephants
ORDER BY last_seen IS NULL, last_seen DESC;

-- Sort by computed value
SELECT name, weight, ROUND(weight * 2.2, 0) AS weight_lbs
FROM elephants
ORDER BY weight_lbs DESC;`,
      diagram: 'SQLSortPaginationDiagram',
      interactive: { type: 'sql-playground', props: { starterCode: "-- Try multi-column sort\nSELECT name, park, weight FROM elephants\nORDER BY park ASC, weight DESC;", title: 'Try Sorting' } },
    },
    {
      id: 'sql-case',
      title: 'CASE, COALESCE & Conditional Logic',
      beginnerContent:
        'Watch the flowchart above. `CASE WHEN` is SQL\'s answer to if/else — it walks through conditions in order and returns a value from whichever branch matches first. Same shape as a decision tree in code, but happening row-by-row inside the database.\n\n' +
        '`CASE WHEN` is SQL\'s if/else. It tests conditions for each row and returns a value based on which condition matches first:\n\n' +
        '```\nCASE\n  WHEN weight > 4500 THEN \'heavy\'\n  WHEN weight > 3500 THEN \'medium\'\n  ELSE \'light\'\nEND\n```\n\n' +
        'Conditions are checked **in order** — the first match wins. If Gaja (5200kg) matches "weight > 4500", it gets "heavy" and the remaining conditions are skipped.\n\n' +
        '**COALESCE** returns the first non-NULL value from a list: `COALESCE(last_seen, \'Never\')` — if `last_seen` is NULL, returns "Never".\n\n' +
        '**IIF** is a shorthand for simple two-way choices: `IIF(weight > 4000, \'heavy\', \'light\')` — same as `CASE WHEN weight > 4000 THEN \'heavy\' ELSE \'light\' END`.\n\n' +
        '**Computed columns** — you can do math in SELECT: `weight * 2.2 AS weight_lbs` creates a new column that doesn\'t exist in the table.',
      code: `-- CASE WHEN: classify elephants by weight
SELECT name, weight,
CASE
  WHEN weight > 4500 THEN 'heavy'
  WHEN weight > 3500 THEN 'medium'
  ELSE 'light'
END AS category
FROM elephants;

-- COALESCE: replace NULL with a default
SELECT name, COALESCE(last_seen, 'Never sighted') AS status
FROM elephants;

-- IIF: simple two-way choice
SELECT name, IIF(weight > 4000, 'big', 'small') AS size
FROM elephants;

-- Computed column
SELECT name, weight,
     weight * 2.2 AS weight_lbs,
     ROUND(weight / 1000.0, 1) AS weight_tons
FROM elephants;

-- CASE inside aggregation
SELECT
SUM(CASE WHEN park = 'Kaziranga' THEN 1 ELSE 0 END) AS kaziranga_count,
SUM(CASE WHEN park = 'Manas' THEN 1 ELSE 0 END) AS manas_count
FROM elephants;

-- Conditional counting with CASE
SELECT park,
COUNT(*) AS total,
SUM(CASE WHEN last_seen IS NOT NULL THEN 1 ELSE 0 END) AS sighted,
SUM(CASE WHEN last_seen IS NULL THEN 1 ELSE 0 END) AS unsighted
FROM elephants
GROUP BY park;`,
      diagram: 'SQLCaseDiagram',
      interactive: { type: 'sql-playground', props: { starterCode: "-- Classify elephants by weight\nSELECT name, weight,\n  CASE\n    WHEN weight > 4500 THEN 'heavy'\n    WHEN weight > 3500 THEN 'medium'\n    ELSE 'light'\n  END AS category\nFROM elephants;", title: 'Try CASE WHEN' } },
    },
    {
      id: 'sql-string-date',
      title: 'String & Date Functions',
      beginnerContent:
        'Try the playground above — pick a string function, see the transformation applied to each row instantly. This is what SQL does best: apply one operation to millions of rows in parallel.\n\n' +
        'SQL has built-in functions for manipulating text and dates.\n\n' +
        '**String functions:**\n' +
        '- `UPPER(name)` → "RANGA" — converts to uppercase\n' +
        '- `LOWER(name)` → "ranga" — converts to lowercase\n' +
        '- `LENGTH(name)` → 5 — character count\n' +
        '- `SUBSTR(name, 1, 3)` → "Ran" — extract characters (position starts at 1)\n' +
        '- `REPLACE(park, \'NP\', \'National Park\')` — substitute text\n' +
        '- `name || \' (ID: \' || id || \')\'` → "Ranga (ID: 1)" — concatenate with ||\n\n' +
        '**Date functions (SQLite):**\n' +
        '- `date(\'now\')` → today\'s date\n' +
        '- `julianday(date1) - julianday(date2)` → days between two dates\n' +
        '- `date(last_seen, \'+30 days\')` → add 30 days\n' +
        '- `strftime(\'%Y\', date)` → extract year\n\n' +
        '**ROUND** — round a number: `ROUND(weight * 2.2, 1)` → 9900.0\n\n' +
        '**CAST** — convert types: `CAST(weight AS TEXT)` — number to string',
      code: `-- String functions
SELECT name,
     UPPER(name) AS upper_name,
     LOWER(name) AS lower_name,
     LENGTH(name) AS name_length,
     SUBSTR(name, 1, 3) AS short_name
FROM elephants;

-- Concatenation with ||
SELECT name || ' weighs ' || weight || 'kg' AS description
FROM elephants;

-- ID code: first 2 letters of park + elephant id
SELECT name, SUBSTR(park, 1, 2) || '-' || id AS code
FROM elephants;

-- REPLACE
SELECT REPLACE(park, 'Kaziranga', 'KNP') AS short_park, name
FROM elephants;

-- Date functions
SELECT name, last_seen,
     CAST(julianday('2026-04-04') - julianday(last_seen) AS INTEGER) AS days_ago
FROM elephants
WHERE last_seen IS NOT NULL;

-- ROUND
SELECT name, weight,
     ROUND(weight * 2.2, 0) AS lbs,
     ROUND(weight / 1000.0, 2) AS tons
FROM elephants;

-- CAST
SELECT name, CAST(weight AS TEXT) || 'kg' AS weight_text
FROM elephants;`,
      diagram: 'SQLStringFuncDiagram',
      interactive: { type: 'sql-playground', props: { starterCode: "-- Try string functions\nSELECT name,\n       UPPER(name) AS caps,\n       LENGTH(name) AS len,\n       SUBSTR(name, 1, 3) AS short\nFROM elephants;", title: 'Try String Functions' } },
    },
    {
      id: 'sql-set-operations',
      title: 'Set Operations & Views',
      beginnerContent:
        'Flip through UNION, INTERSECT, and EXCEPT in the diagram above. Set theory, applied to rows: combine them, find the overlap, or subtract one from the other. These operations treat query results as mathematical sets — a whole new way to slice your data.\n\n' +
        '**Set operations** combine the results of two SELECT queries:\n\n' +
        '- **UNION** — all rows from both queries, duplicates removed\n' +
        '- **UNION ALL** — all rows from both, duplicates kept\n' +
        '- **INTERSECT** — only rows that appear in BOTH queries\n' +
        '- **EXCEPT** — rows in the first query but NOT in the second\n\n' +
        'Both queries must have the **same number of columns** and compatible types.\n\n' +
        '**Views** — a saved query you can use like a table:\n\n' +
        '`CREATE VIEW heavy_elephants AS SELECT * FROM elephants WHERE weight > 4000;`\n\n' +
        'Now `SELECT * FROM heavy_elephants` works as if it were a real table. Views don\'t store data — they re-run the query each time.\n\n' +
        '**GROUP_CONCAT** — concatenates values from multiple rows into one string:\n\n' +
        '`SELECT park, GROUP_CONCAT(name, \', \') FROM elephants GROUP BY park`\n→ "Kaziranga | Ranga, Gaja, Tara"',
      code: `-- UNION: combine two queries, remove duplicates
SELECT name FROM elephants WHERE park = 'Kaziranga'
UNION
SELECT name FROM elephants WHERE weight > 4000;
-- Returns: Gaja, Ranga, Tara (no duplicates)

-- UNION ALL: keep duplicates
SELECT name FROM elephants WHERE park = 'Kaziranga'
UNION ALL
SELECT name FROM elephants WHERE weight > 4000;
-- Ranga and Gaja and Tara appear twice

-- INTERSECT: only in both
SELECT name FROM elephants WHERE park = 'Kaziranga'
INTERSECT
SELECT name FROM elephants WHERE weight > 4000;
-- Ranga, Gaja, Tara (all Kaziranga elephants are > 4000)

-- EXCEPT: in first but not second
SELECT name FROM elephants
EXCEPT
SELECT e.name FROM elephants e
JOIN sightings s ON e.id = s.elephant_id;
-- Tara (in elephants but has no sightings)

-- CREATE VIEW: save a query as a virtual table
CREATE VIEW IF NOT EXISTS heavy_elephants AS
SELECT name, weight, park FROM elephants WHERE weight > 4000;

SELECT * FROM heavy_elephants;

DROP VIEW IF EXISTS heavy_elephants;

-- GROUP_CONCAT: combine values into one string
SELECT park, GROUP_CONCAT(name, ', ') AS elephants
FROM elephants
GROUP BY park;
-- Kaziranga | Ranga, Gaja, Tara
-- Manas     | Mohini, Bala`,
      diagram: 'SQLSetOperationsDiagram',
      interactive: { type: 'sql-playground', props: { starterCode: "-- Try UNION: Kaziranga elephants + heavy elephants\nSELECT name FROM elephants WHERE park = 'Kaziranga'\nUNION\nSELECT name FROM elephants WHERE weight > 4000;", title: 'Try Set Operations' } },
    },
  ],
};
