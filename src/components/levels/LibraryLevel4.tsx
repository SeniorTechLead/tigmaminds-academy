import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LibraryLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Database Design: Books, Members, and Loans',
      concept: `Every library system starts with a database. Before you write a single line of HTML, you need to decide how data is stored. A relational database organizes data into **tables** — each table holds one type of thing (books, members, loans). Rows are individual records. Columns are attributes.

The three tables for our library:

**books** stores the catalog. Every book has an \`id\` (unique identifier assigned automatically), a \`title\`, an \`author\`, a \`genre\`, a \`published_year\`, and \`copies_available\`. The \`id\` column is the **PRIMARY KEY** — the one column guaranteed to be unique for every row. No two books share an \`id\`.

**members** stores library users. Each member has an \`id\`, \`name\`, \`email\`, and \`joined_date\`. Again, \`id\` is the primary key.

**loans** records who borrowed what and when. This is a **junction table** — it connects books to members. Each loan has its own \`id\`, plus \`book_id\` and \`member_id\` that reference the other tables. These are **FOREIGN KEYS**: they point to a primary key in another table. A foreign key enforces a rule — you cannot create a loan for a book or member that does not exist. The loan also has \`checkout_date\`, \`due_date\`, and \`returned_date\` (NULL if not yet returned).

Data types matter. \`INTEGER\` for IDs and years. \`TEXT\` for names and titles. \`DATE\` for dates. Using the right type prevents bad data — you cannot accidentally store "abc" in an INTEGER column.

\`AUTOINCREMENT\` on the primary key means the database assigns the next number automatically. You never choose an ID yourself — the database guarantees uniqueness.

The relationship between tables is called a **schema**. Drawing it out: books 1---* loans *---1 members. One book can appear in many loans. One member can have many loans. But each loan connects exactly one book to one member. This is a **many-to-many** relationship, mediated by the loans table.`,
      analogy: 'Think of a physical library with three filing cabinets. One cabinet holds a card for every book (title, author, shelf location). Another holds a card for every member (name, address, membership number). The third holds checkout slips — each slip says "Member #47 checked out Book #312 on March 5, due March 19." The checkout slips connect the other two cabinets. If you tried to file a checkout slip for a member who does not exist, the librarian would reject it — that is what a foreign key does automatically.',
      storyConnection: 'Dipankar started his library with a notebook — scribbling names and book titles. As his collection grew to hundreds of books and dozens of members, the notebook became chaos. He could not answer basic questions: "Who has my copy of Jyoti Prasad Agarwala\'s poems?" A database solves this. Every checkout is recorded, every return is tracked, and any question can be answered with a query.',
      checkQuestion: 'Why does the loans table need its own id column? Could we just use the combination of book_id and member_id as the key?',
      checkAnswer: 'A member can borrow the same book multiple times — once in January, once in June. If the key were just (book_id, member_id), you could only store one loan per member-book pair, destroying the history. The separate id column lets you record every individual loan event. This is a fundamental database design principle: use a surrogate key when the natural key is not truly unique.',
      codeIntro: 'Write SQL to create the three tables with proper types, keys, and constraints, then populate them with sample data from Dipankar\'s library.',
      code: `import sqlite3

# Create an in-memory database — Dipankar's Library Management System
conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# ============================================================
# Table 1: Books catalog
# ============================================================
cursor.execute('''
CREATE TABLE books (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    author        TEXT NOT NULL,
    genre         TEXT NOT NULL,
    published_year INTEGER,
    copies_available INTEGER DEFAULT 1,
    CHECK (copies_available >= 0)
)
''')

# ============================================================
# Table 2: Library members
# ============================================================
cursor.execute('''
CREATE TABLE members (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    joined_date DATE DEFAULT CURRENT_DATE
)
''')

# ============================================================
# Table 3: Loan records (junction table)
# ============================================================
cursor.execute('''
CREATE TABLE loans (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id       INTEGER NOT NULL,
    member_id     INTEGER NOT NULL,
    checkout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date      DATE NOT NULL,
    returned_date DATE,
    FOREIGN KEY (book_id)   REFERENCES books(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
)
''')

# ============================================================
# SAMPLE DATA: Assamese + English books
# ============================================================
cursor.executemany(
    'INSERT INTO books (title, author, genre, published_year, copies_available) VALUES (?,?,?,?,?)',
    [
        ('Miri Jiyori',               'Rajanikanta Bordoloi',    'Fiction',    1894, 2),
        ('Burhi Aair Sadhu',          'Lakshminath Bezbaroa',    'Folklore',   1911, 3),
        ('Pita Putra',                'Bhabendra Nath Saikia',   'Fiction',    1972, 1),
        ('Mamore Dhora Tarowal',      'Jyoti Prasad Agarwala',   'Poetry',     1939, 2),
        ('The Shadow Lines',          'Amitav Ghosh',            'Fiction',    1988, 2),
        ('The God of Small Things',   'Arundhati Roy',           'Fiction',    1997, 3),
        ('Homen Borgohain Stories',   'Homen Borgohain',         'Fiction',    1980, 1),
        ('Interpreter of Maladies',   'Jhumpa Lahiri',           'Fiction',    1999, 2),
        ('A Brief History of Time',   'Stephen Hawking',         'Science',    1988, 1),
        ('Datal Hatir Uye Khowa Howdah', 'Mamoni R. Goswami',   'Fiction',    1988, 2),
        ('The Room on the Roof',      'Ruskin Bond',             'Fiction',    1956, 3),
        ('Wings of Fire',             'A.P.J. Abdul Kalam',      'Biography',  1999, 2),
        ('Ramayana Retold',           'C. Rajagopalachari',      'Mythology',  1951, 1),
        ('Gitanjali',                 'Rabindranath Tagore',     'Poetry',     1910, 2),
        ('Discovery of India',        'Jawaharlal Nehru',        'History',    1946, 1),
    ]
)

cursor.executemany(
    'INSERT INTO members (name, email, joined_date) VALUES (?,?,?)',
    [
        ('Dipankar Sharma',   'dipankar@library.org',   '2024-01-15'),
        ('Ananya Bora',       'ananya@library.org',     '2024-02-20'),
        ('Rishi Kalita',      'rishi@library.org',      '2024-03-10'),
        ('Meera Hazarika',    'meera@library.org',      '2024-04-05'),
        ('Kabir Deka',        'kabir@library.org',      '2024-05-18'),
        ('Priya Choudhury',   'priya@library.org',      '2024-06-01'),
        ('Arjun Nath',        'arjun@library.org',      '2024-07-22'),
        ('Tara Goswami',      'tara@library.org',       '2024-08-14'),
    ]
)

cursor.executemany(
    'INSERT INTO loans (book_id, member_id, checkout_date, due_date, returned_date) VALUES (?,?,?,?,?)',
    [
        (1,  1, '2025-01-10', '2025-01-24', '2025-01-22'),
        (2,  2, '2025-01-15', '2025-01-29', '2025-01-28'),
        (5,  3, '2025-02-01', '2025-02-15', None),
        (6,  1, '2025-02-05', '2025-02-19', '2025-02-18'),
        (3,  4, '2025-02-10', '2025-02-24', None),
        (8,  5, '2025-02-12', '2025-02-26', '2025-02-25'),
        (1,  6, '2025-02-20', '2025-03-06', None),
        (9,  7, '2025-03-01', '2025-03-15', '2025-03-14'),
        (11, 2, '2025-03-05', '2025-03-19', None),
        (14, 8, '2025-03-10', '2025-03-24', '2025-03-20'),
        (4,  3, '2025-03-12', '2025-03-26', None),
        (6,  4, '2025-03-15', '2025-03-29', '2025-03-27'),
        (7,  1, '2025-03-18', '2025-04-01', None),
        (12, 5, '2025-03-20', '2025-04-03', None),
        (10, 6, '2025-03-22', '2025-04-05', None),
    ]
)
conn.commit()

# Verify: show all tables with row counts
print("=== Database Summary ===")
for table in ['books', 'members', 'loans']:
    count = cursor.execute(f'SELECT COUNT(*) FROM {table}').fetchone()[0]
    print(f"{table}: {count} rows")

print("\
=== Sample Books ===")
for row in cursor.execute('SELECT id, title, author, genre FROM books LIMIT 5').fetchall():
    print(row)

print("\
=== Sample Members ===")
for row in cursor.execute('SELECT id, name, email FROM members LIMIT 5').fetchall():
    print(row)

print("\
=== Sample Loans ===")
for row in cursor.execute('SELECT id, book_id, member_id, due_date, returned_date FROM loans LIMIT 5').fetchall():
    print(row)

conn.close()`,
      challenge: 'Add a fourth table called reservations with columns: id, book_id, member_id, reserved_date, and status (either "waiting" or "fulfilled"). Add proper foreign keys and insert 3 sample reservations.',
      successHint: 'A well-designed schema is the foundation of every web application. The tables, types, and foreign keys you wrote here are exactly what a real library system uses. Every web framework — Django, Rails, Express — generates SQL like this under the hood. You just wrote the real thing.',
    },
    {
      title: 'SQL Queries: Asking Questions of Your Data',
      concept: `A database is only useful if you can ask it questions. SQL queries are how you extract information from tables. The basic pattern is SELECT (which columns) FROM (which table) WHERE (which rows). But real applications need much more: joining tables, grouping results, sorting, and aggregating.

**JOIN** connects rows from different tables. When you write \`SELECT * FROM loans JOIN books ON loans.book_id = books.id\`, the database matches each loan to its book. Without JOIN you would have to manually look up book titles from IDs — JOIN does it in one step.

There are different kinds of joins. **INNER JOIN** (the default) only returns rows that have matches in both tables. **LEFT JOIN** returns all rows from the left table even if there is no match on the right — unmatched columns get NULL. This is crucial: if you want to find members who have never borrowed a book, you need LEFT JOIN members to loans, then filter for NULL loan IDs.

**WHERE** filters rows. You can use comparison operators (\`=\`, \`<\`, \`>\`, \`!=\`), pattern matching (\`LIKE '%pattern%'\`), NULL checks (\`IS NULL\`, \`IS NOT NULL\`), and date comparisons. Combine conditions with \`AND\` and \`OR\`.

**GROUP BY** collapses rows that share a value into one summary row. Combined with aggregate functions — \`COUNT()\`, \`SUM()\`, \`AVG()\`, \`MAX()\`, \`MIN()\` — it answers questions like "how many loans per member?" or "which genre is most popular?"

**ORDER BY** sorts results. \`ASC\` for ascending (A-Z, smallest first), \`DESC\` for descending. \`LIMIT\` caps the number of results — useful for "top 5" queries.

**HAVING** is like WHERE but works on grouped results. WHERE filters individual rows before grouping; HAVING filters groups after aggregation. "Show genres with more than 3 books" uses HAVING.

Subqueries let you nest one query inside another. The inner query runs first, and its result is used by the outer query. This is how you answer multi-step questions: "Which members have borrowed books by authors who wrote more than one book in our catalog?"`,
      analogy: 'SQL queries are like asking a very literal librarian questions. If you say "Show me all books," they dump the entire catalog on the desk. If you say "Show me fiction books published after 1990, sorted by author," they filter, sort, and hand you a neat stack. JOIN is like asking them to cross-reference two lists: "For each checkout slip, look up the book title and member name." GROUP BY is asking for a summary: "How many books did each member borrow?" The librarian is infinitely patient but follows instructions exactly — ambiguous questions get ambiguous answers.',
      storyConnection: 'As Dipankar\'s library grew, villagers would ask: "Which books are overdue?" "Who borrows the most?" "Do we need more fiction or science books?" Each question requires a different SQL query. The queries below are the real questions a librarian needs answered daily. Dipankar\'s notebook could not answer these — but a database can, instantly.',
      checkQuestion: 'What is the difference between WHERE and HAVING? Why can\'t you use WHERE to filter on COUNT(*)?',
      checkAnswer: 'WHERE filters individual rows before any grouping happens. At that point, COUNT(*) does not exist yet — it is computed during grouping. HAVING filters after GROUP BY, so aggregate values like COUNT(*) are available. Example: WHERE genre = "Fiction" filters rows before grouping. HAVING COUNT(*) > 2 filters groups after counting. Using WHERE with COUNT(*) is a syntax error because the count has not been calculated yet.',
      codeIntro: 'Write queries to answer real library questions: overdue books, popular authors, active members, and genre statistics.',
      code: `import sqlite3

# Rebuild the database (same schema from Lesson 1)
conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

cursor.execute('''CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL,
    author TEXT NOT NULL, genre TEXT NOT NULL,
    published_year INTEGER, copies_available INTEGER DEFAULT 1)''')

cursor.execute('''CREATE TABLE members (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL, joined_date DATE)''')

cursor.execute('''CREATE TABLE loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL, member_id INTEGER NOT NULL,
    checkout_date DATE NOT NULL, due_date DATE NOT NULL,
    returned_date DATE,
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (member_id) REFERENCES members(id))''')

cursor.executemany(
    'INSERT INTO books (title, author, genre, published_year, copies_available) VALUES (?,?,?,?,?)',
    [
        ('Miri Jiyori','Rajanikanta Bordoloi','Fiction',1894,2),
        ('Burhi Aair Sadhu','Lakshminath Bezbaroa','Folklore',1911,3),
        ('Pita Putra','Bhabendra Nath Saikia','Fiction',1972,1),
        ('Mamore Dhora Tarowal','Jyoti Prasad Agarwala','Poetry',1939,2),
        ('The Shadow Lines','Amitav Ghosh','Fiction',1988,2),
        ('The God of Small Things','Arundhati Roy','Fiction',1997,3),
        ('Homen Borgohain Stories','Homen Borgohain','Fiction',1980,1),
        ('Interpreter of Maladies','Jhumpa Lahiri','Fiction',1999,2),
        ('A Brief History of Time','Stephen Hawking','Science',1988,1),
        ('Datal Hatir Uye Khowa Howdah','Mamoni R. Goswami','Fiction',1988,2),
        ('The Room on the Roof','Ruskin Bond','Fiction',1956,3),
        ('Wings of Fire','A.P.J. Abdul Kalam','Biography',1999,2),
        ('Ramayana Retold','C. Rajagopalachari','Mythology',1951,1),
        ('Gitanjali','Rabindranath Tagore','Poetry',1910,2),
        ('Discovery of India','Jawaharlal Nehru','History',1946,1),
    ])

cursor.executemany(
    'INSERT INTO members (name, email, joined_date) VALUES (?,?,?)',
    [
        ('Dipankar Sharma','dipankar@library.org','2024-01-15'),
        ('Ananya Bora','ananya@library.org','2024-02-20'),
        ('Rishi Kalita','rishi@library.org','2024-03-10'),
        ('Meera Hazarika','meera@library.org','2024-04-05'),
        ('Kabir Deka','kabir@library.org','2024-05-18'),
        ('Priya Choudhury','priya@library.org','2024-06-01'),
        ('Arjun Nath','arjun@library.org','2024-07-22'),
        ('Tara Goswami','tara@library.org','2024-08-14'),
    ])

cursor.executemany(
    'INSERT INTO loans (book_id, member_id, checkout_date, due_date, returned_date) VALUES (?,?,?,?,?)',
    [
        (1,1,'2025-01-10','2025-01-24','2025-01-22'),
        (2,2,'2025-01-15','2025-01-29','2025-01-28'),
        (5,3,'2025-02-01','2025-02-15',None),
        (6,1,'2025-02-05','2025-02-19','2025-02-18'),
        (3,4,'2025-02-10','2025-02-24',None),
        (8,5,'2025-02-12','2025-02-26','2025-02-25'),
        (1,6,'2025-02-20','2025-03-06',None),
        (9,7,'2025-03-01','2025-03-15','2025-03-14'),
        (11,2,'2025-03-05','2025-03-19',None),
        (14,8,'2025-03-10','2025-03-24','2025-03-20'),
        (4,3,'2025-03-12','2025-03-26',None),
        (6,4,'2025-03-15','2025-03-29','2025-03-27'),
        (7,1,'2025-03-18','2025-04-01',None),
        (12,5,'2025-03-20','2025-04-03',None),
        (10,6,'2025-03-22','2025-04-05',None),
    ])
conn.commit()

# ============================================================
# QUERY 1: Find all currently overdue books
# A book is overdue if returned_date IS NULL and
# due_date < today
# ============================================================
print("=== QUERY 1: Currently Overdue Books ===")
rows = cursor.execute('''
    SELECT
        b.title,
        b.author,
        m.name       AS borrower,
        l.checkout_date,
        l.due_date,
        CAST(JULIANDAY('2025-04-05') - JULIANDAY(l.due_date) AS INTEGER) AS days_overdue
    FROM loans l
    JOIN books b   ON l.book_id = b.id
    JOIN members m ON l.member_id = m.id
    WHERE l.returned_date IS NULL
      AND l.due_date < '2025-04-05'
    ORDER BY days_overdue DESC
''').fetchall()
for r in rows:
    print(f"  {r[0]} by {r[1]} | Borrower: {r[2]} | Due: {r[4]} | {r[5]} days overdue")

# ============================================================
# QUERY 2: Most popular authors (by total loans)
# ============================================================
print("\
=== QUERY 2: Most Popular Authors ===")
rows = cursor.execute('''
    SELECT
        b.author,
        COUNT(*)        AS total_loans,
        COUNT(DISTINCT l.member_id) AS unique_borrowers
    FROM loans l
    JOIN books b ON l.book_id = b.id
    GROUP BY b.author
    ORDER BY total_loans DESC
    LIMIT 5
''').fetchall()
for r in rows:
    print(f"  {r[0]}: {r[1]} loans, {r[2]} unique borrowers")

# ============================================================
# QUERY 3: Members who currently have unreturned books
# ============================================================
print("\
=== QUERY 3: Members with Unreturned Books ===")
rows = cursor.execute('''
    SELECT
        m.name,
        m.email,
        COUNT(l.id) AS books_out,
        GROUP_CONCAT(b.title, ', ') AS titles
    FROM members m
    JOIN loans l ON l.member_id = m.id
    JOIN books b ON l.book_id = b.id
    WHERE l.returned_date IS NULL
    GROUP BY m.id
    ORDER BY books_out DESC
''').fetchall()
for r in rows:
    print(f"  {r[0]} ({r[1]}): {r[2]} books out — {r[3]}")

# ============================================================
# QUERY 4: Genre popularity breakdown
# ============================================================
print("\
=== QUERY 4: Genre Popularity ===")
rows = cursor.execute('''
    SELECT
        b.genre,
        COUNT(DISTINCT b.id) AS books_in_catalog,
        COUNT(l.id)          AS total_loans,
        ROUND(COUNT(l.id) * 1.0 / COUNT(DISTINCT b.id), 1)
                             AS loans_per_book
    FROM books b
    LEFT JOIN loans l ON l.book_id = b.id
    GROUP BY b.genre
    ORDER BY total_loans DESC
''').fetchall()
for r in rows:
    print(f"  {r[0]}: {r[1]} books, {r[2]} loans, {r[3]} loans/book")

# ============================================================
# QUERY 5: Members who have NEVER borrowed a book
# Uses LEFT JOIN: members with no matching loans get NULL
# ============================================================
print("\
=== QUERY 5: Members Who Never Borrowed ===")
rows = cursor.execute('''
    SELECT
        m.name,
        m.email,
        m.joined_date
    FROM members m
    LEFT JOIN loans l ON l.member_id = m.id
    WHERE l.id IS NULL
''').fetchall()
if rows:
    for r in rows:
        print(f"  {r[0]} ({r[1]}) — joined {r[2]}")
else:
    print("  All members have borrowed at least one book.")

# ============================================================
# QUERY 6: Books borrowed more than once
# ============================================================
print("\
=== QUERY 6: Books Borrowed More Than Once ===")
rows = cursor.execute('''
    SELECT
        b.title,
        b.author,
        COUNT(l.id) AS times_borrowed
    FROM books b
    JOIN loans l ON l.book_id = b.id
    GROUP BY b.id
    HAVING COUNT(l.id) > 1
    ORDER BY times_borrowed DESC
''').fetchall()
for r in rows:
    print(f"  {r[0]} by {r[1]}: borrowed {r[2]} times")

conn.close()`,
      challenge: 'Write a query that finds the average loan duration (in days) for each genre, but only for books that have been returned. Use JULIANDAY(returned_date) - JULIANDAY(checkout_date) to compute duration. Which genre do people read fastest?',
      successHint: 'These queries are not toy examples. Real library software runs exactly these queries — overdue reports, patron activity, collection analysis. A developer who can write JOIN, GROUP BY, HAVING, and subqueries fluently can work with any database-backed application.',
    },
    {
      title: 'HTML Structure: Building the Library Catalog Page',
      concept: `HTML is the skeleton of every web page. It defines what content exists and what it means — not how it looks (that is CSS) or how it behaves (that is JavaScript). Writing semantic HTML means choosing tags that describe the content's purpose, not its appearance.

The key structural tags for a page:

**\`<header>\`** contains the site branding, title, and navigation. It appears at the top of the page and tells the user where they are.

**\`<nav>\`** wraps navigation links. Screen readers announce it as a navigation region, so visually impaired users can skip straight to it. Always use \`<nav>\` for menus, never a plain \`<div>\`.

**\`<main>\`** wraps the primary content — the one thing this page is about. There should be exactly one \`<main>\` per page. Search engines use it to identify the core content.

**\`<article>\`** represents a self-contained piece of content that could stand alone — a blog post, a product card, a book entry. Our book cards are \`<article>\` elements because each one is a complete unit: title, author, genre, availability.

**\`<section>\`** groups related content with a heading. The search form and results are separate sections.

**\`<form>\`** wraps interactive inputs. Our search bar is a form with an \`<input>\` and a \`<button>\`. The \`<label>\` tag associates text with an input — critical for accessibility. Screen readers read the label when the input is focused.

**\`<footer>\`** contains secondary information: copyright, contact, links.

The \`class\` attribute is how we hook CSS styles to elements. We use descriptive class names: \`book-card\`, \`search-form\`, \`catalog-grid\`. IDs (\`id\`) are for unique elements that JavaScript needs to target.

**Data attributes** (\`data-genre\`, \`data-author\`) store custom metadata on elements. JavaScript can read these to filter and sort without querying the DOM for text content. They are invisible to the user but invaluable to the developer.

Semantic HTML is not optional decoration. It determines how screen readers navigate your page, how search engines index it, and how maintainable your code is. A \`<div>\` with a click handler is not a button — it lacks keyboard focus, ARIA roles, and enter-key activation. Use the right tag for the right job.`,
      analogy: 'HTML is like the architectural blueprint of a building. The blueprint does not specify paint colors or furniture — it defines rooms, doors, walls, and their purpose. A \`<header>\` is the lobby. \`<nav>\` is the directory sign. \`<main>\` is the open floor area. Each \`<article>\` is a display shelf. The blueprint ensures the building is structurally sound and navigable, even before interior design (CSS) and electronics (JavaScript) are added.',
      storyConnection: 'When Dipankar organized his physical library, he did not just pile books randomly. He created sections (fiction shelf, science shelf), put a sign at the entrance, and made a card for each book with title and author. Our HTML does the same thing digitally — each structural element has a purpose, and the book cards contain the same information Dipankar wrote on his index cards.',
      checkQuestion: 'Why use <article> for book cards instead of <div>? They look the same in the browser.',
      checkAnswer: 'They render identically, but they communicate different meaning to machines. Screen readers announce <article> as a distinct content block — a user can press a key to jump between articles. Search engines treat <article> content as a standalone unit. Automated tools (RSS readers, content extractors) can pull <article> elements meaningfully. Using <div> discards all this semantic information. The browser does not care, but users with assistive technology, search engine crawlers, and your future self reading the code all benefit from semantic tags.',
      codeIntro: 'Build the complete HTML structure for the library catalog page — header, search form, and book cards with data attributes for filtering. We generate the HTML with Python so you can see how server-side templating works.',
      code: `# ============================================================
# Generate the library catalog HTML using Python
# This mirrors how server-side frameworks (Django, Flask, Rails)
# build HTML from database records.
# ============================================================

# Book data — in a real app this comes from the database
books = [
    {"id": 1,  "title": "Miri Jiyori",             "author": "Rajanikanta Bordoloi",  "genre": "Fiction",    "year": 1894, "available": 2},
    {"id": 2,  "title": "Burhi Aair Sadhu",         "author": "Lakshminath Bezbaroa",  "genre": "Folklore",   "year": 1911, "available": 3},
    {"id": 3,  "title": "Pita Putra",               "author": "Bhabendra Nath Saikia", "genre": "Fiction",    "year": 1972, "available": 1},
    {"id": 5,  "title": "The Shadow Lines",          "author": "Amitav Ghosh",          "genre": "Fiction",    "year": 1988, "available": 2},
    {"id": 6,  "title": "The God of Small Things",   "author": "Arundhati Roy",         "genre": "Fiction",    "year": 1997, "available": 0},
    {"id": 9,  "title": "A Brief History of Time",   "author": "Stephen Hawking",       "genre": "Science",    "year": 1988, "available": 1},
]

# Collect unique genres for the filter dropdown
genres = sorted(set(b["genre"] for b in books))

def generate_book_card(book):
    """Generate one <article> card for a book."""
    genre_class = f"genre-{book['genre'].lower()}"
    avail = book["available"]
    if avail > 0:
        avail_class = "available"
        avail_text = f"{avail} {'copy' if avail == 1 else 'copies'} available"
        btn = f'<button class="checkout-btn" data-book-id="{book["id"]}">Check Out</button>'
    else:
        avail_class = "unavailable"
        avail_text = "0 copies — checked out"
        btn = f'<button class="checkout-btn" disabled data-book-id="{book["id"]}">Unavailable</button>'

    return f"""            <article class="book-card" data-genre="{book['genre']}"
                     data-author="{book['author']}"
                     data-available="{avail}">
                <div class="card-badge {genre_class}">{book['genre']}</div>
                <h3 class="card-title">{book['title']}</h3>
                <p class="card-author">{book['author']}</p>
                <p class="card-year">{book['year']}</p>
                <div class="card-footer">
                    <span class="availability {avail_class}">
                        {avail_text}
                    </span>
                    {btn}
                </div>
            </article>"""

# Build genre <option> tags
genre_options = '\
                    '.join(
    [f'<option value="all">All Genres</option>'] +
    [f'<option value="{g}">{g}</option>' for g in genres]
)

# Build all book cards
book_cards = "\
\
".join(generate_book_card(b) for b in books)

# Assemble the full HTML page
html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dipankar's Library — Catalog</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

<header class="site-header">
    <h1>Dipankar's Library</h1>
    <p class="tagline">A village library for everyone</p>
    <nav class="main-nav">
        <a href="#catalog" class="nav-link active">Catalog</a>
        <a href="#members" class="nav-link">Members</a>
        <a href="#loans" class="nav-link">Loans</a>
        <a href="#stats" class="nav-link">Statistics</a>
    </nav>
</header>

<main>
    <!-- Search and Filter Section -->
    <section class="search-section" aria-label="Search books">
        <form class="search-form" id="searchForm">
            <label for="searchInput" class="sr-only">
                Search by title or author
            </label>
            <input
                type="search"
                id="searchInput"
                class="search-input"
                placeholder="Search by title or author..."
                autocomplete="off"
            >
            <div class="filter-group">
                <label for="genreFilter">Genre:</label>
                <select id="genreFilter" class="filter-select">
                    {genre_options}
                </select>
            </div>
            <button type="submit" class="search-btn">Search</button>
        </form>
    </section>

    <!-- Book Catalog Grid -->
    <section class="catalog-section" aria-label="Book catalog">
        <h2>All Books <span id="bookCount" class="count-badge">{len(books)}</span></h2>
        <div class="catalog-grid" id="catalogGrid">

{book_cards}

        </div>
    </section>
</main>

<footer class="site-footer">
    <p>&copy; 2025 Dipankar's Library. Open to all.</p>
</footer>

<script src="app.js"></script>
</body>
</html>"""

print(html)
print("\
--- HTML generation complete ---")
print(f"Generated {len(books)} book cards from data.")
print(f"Genres in filter: {', '.join(genres)}")
print("\
Copy this HTML into an index.html file to use it!")`,
      challenge: 'Add a "Recently Returned" section below the catalog grid. Use an <aside> element with an ordered list (<ol>) showing the 3 most recently returned books. Each list item should include the title, who returned it, and the return date.',
      successHint: 'This HTML is production-grade. Every element has semantic meaning, every interactive element is accessible, and the data attributes make JavaScript filtering trivial. A screen reader can navigate this page. A search engine can index it. A developer can maintain it. That is the power of semantic HTML.',
    },
    {
      title: 'CSS Styling: Grid Layout, Cards, and Dark Mode',
      concept: `CSS transforms raw HTML into a visual experience. We will use two layout systems: **CSS Grid** for the page-level catalog layout, and **Flexbox** for arranging elements within individual cards.

**CSS Grid** is a two-dimensional layout system. You define rows and columns on a container, and child elements snap into the grid cells. \`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))\` creates a responsive grid: as many columns as will fit, each at least 280px wide, stretching equally to fill available space. No media queries needed for basic responsiveness — the grid handles it.

**Flexbox** is a one-dimensional layout system (row or column). Inside each card, Flexbox arranges the badge, title, author, and footer vertically with \`flex-direction: column\`, and spaces the footer items horizontally with \`justify-content: space-between\`.

**Custom properties** (CSS variables) define your color scheme in one place: \`--color-primary: #2563eb\`. Change one variable and the entire theme updates. This is how professional design systems work — no hunting through hundreds of lines to change a color.

**Hover effects** provide visual feedback. When a user hovers over a book card, a subtle shadow and slight upward shift (\`transform: translateY(-2px)\`) signal that it is interactive. The \`transition\` property animates the change smoothly over 200 milliseconds.

**Dark mode** uses the \`prefers-color-scheme\` media query. This detects the user's operating system preference — if they use dark mode on their device, your site automatically switches. You define a second set of CSS variables inside \`@media (prefers-color-scheme: dark)\` and every element using those variables updates instantly.

**Responsive typography** scales text based on viewport width. Using \`clamp(1rem, 2.5vw, 1.5rem)\` sets a font size that is at least 1rem, at most 1.5rem, and scales fluidly between. No abrupt breakpoint jumps.

The \`.sr-only\` class hides content visually but keeps it accessible to screen readers. The search label needs to exist for accessibility but is visually redundant when there is a placeholder — \`.sr-only\` solves this.`,
      analogy: 'If HTML is the architectural blueprint, CSS is the interior design plan. Grid is like deciding the room layout — how many bookshelves per wall, how much space between them. Flexbox is like arranging items on a single shelf — book spine left, price tag right. Custom properties are like the paint catalog — pick a color once, apply it everywhere. Dark mode is like having a dimmer switch for the whole building.',
      storyConnection: 'Dipankar\'s library was not just shelves of books — he painted the walls, put up signs, arranged reading nooks, and made it welcoming. The CSS does the same for our digital library. The card layout mirrors how physical libraries display new arrivals — cover visible, key information at a glance, easy to browse. The dark mode respects users who read at night, just as Dipankar kept a dim lamp corner for evening readers.',
      checkQuestion: 'Why use CSS Grid for the catalog layout instead of Flexbox? Both can create multi-column layouts.',
      checkAnswer: 'Flexbox wraps items onto new rows, but each row is independent — items in different rows do not align to the same columns. Grid creates a true two-dimensional grid where items in different rows align perfectly. For a catalog of cards that should line up in neat columns, Grid is the correct choice. Flexbox would work for a single row of navigation links, but a card grid needs Grid. The rule: Flexbox for one axis, Grid for two.',
      codeIntro: 'Build a CSS design system with Python — define colors, compute contrasts, and generate the full stylesheet programmatically. This is how design-token tools work.',
      code: `# ============================================================
# CSS Design System Generator
# Build a complete stylesheet from design tokens using Python.
# This is how tools like Style Dictionary and Tailwind work
# under the hood — data in, CSS out.
# ============================================================

# --- Design tokens: the single source of truth ---
light_theme = {
    "color-primary":    "#2563eb",
    "color-primary-dk": "#1d4ed8",
    "color-accent":     "#7c3aed",
    "color-success":    "#059669",
    "color-danger":     "#dc2626",
    "color-bg":         "#f8fafc",
    "color-surface":    "#ffffff",
    "color-text":       "#1e293b",
    "color-text-muted": "#64748b",
    "color-border":     "#e2e8f0",
}

dark_theme = {
    "color-bg":         "#0f172a",
    "color-surface":    "#1e293b",
    "color-text":       "#f1f5f9",
    "color-text-muted": "#94a3b8",
    "color-border":     "#334155",
}

shadows_light = {
    "shadow-sm": "0 1px 2px rgba(0,0,0,0.05)",
    "shadow-md": "0 4px 6px rgba(0,0,0,0.07)",
    "shadow-lg": "0 10px 15px rgba(0,0,0,0.1)",
}

shadows_dark = {
    "shadow-sm": "0 1px 2px rgba(0,0,0,0.3)",
    "shadow-md": "0 4px 6px rgba(0,0,0,0.4)",
    "shadow-lg": "0 10px 15px rgba(0,0,0,0.5)",
}

genre_colors = {
    "fiction":    ("#dbeafe", "#1e40af"),
    "folklore":  ("#fef3c7", "#92400e"),
    "science":   ("#d1fae5", "#065f46"),
    "biography": ("#ede9fe", "#5b21b6"),
    "poetry":    ("#fce7f3", "#9d174d"),
    "history":   ("#fed7aa", "#9a3412"),
    "mythology": ("#e0e7ff", "#3730a3"),
}

def tokens_to_vars(tokens, indent="    "):
    """Convert a dict of tokens to CSS custom property declarations."""
    return "\
".join(f"{indent}--{k}: {v};" for k, v in tokens.items())

def generate_genre_badges(genres):
    """Generate CSS rules for genre badge colors."""
    rules = []
    for genre, (bg, fg) in genres.items():
        rules.append(f".genre-{genre}   {{ background: {bg}; color: {fg}; }}")
    return "\
".join(rules)

# --- Assemble the full stylesheet ---
css = f"""/* ============================================================
   DESIGN SYSTEM: Custom Properties
   ============================================================ */
:root {{
{tokens_to_vars({**light_theme, **shadows_light})}
    --radius:     0.75rem;
    --transition: 200ms ease;
}}

/* ============================================================
   DARK MODE: Automatic via OS preference
   ============================================================ */
@media (prefers-color-scheme: dark) {{
    :root {{
{tokens_to_vars({**dark_theme, **shadows_dark}, "        ")}
    }}
}}

/* ============================================================
   BASE RESET & TYPOGRAPHY
   ============================================================ */
*, *::before, *::after {{ box-sizing: border-box; margin: 0; }}

body {{
    font-family: system-ui, -apple-system, sans-serif;
    background: var(--color-bg);
    color: var(--color-text);
    line-height: 1.6;
}}

/* Screen-reader only — visually hidden, accessible */
.sr-only {{
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); border: 0;
}}

/* ============================================================
   HEADER
   ============================================================ */
.site-header {{
    background: var(--color-primary);
    color: white;
    padding: 1.5rem 2rem;
    text-align: center;
}}
.site-header h1 {{
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 800;
}}
.tagline {{ opacity: 0.85; font-size: 1rem; margin-top: 0.25rem; }}
.main-nav {{
    display: flex; justify-content: center;
    gap: 1.5rem; margin-top: 1rem;
}}
.nav-link {{
    color: rgba(255,255,255,0.8); text-decoration: none;
    font-weight: 600; padding: 0.25rem 0;
    border-bottom: 2px solid transparent;
    transition: all var(--transition);
}}
.nav-link:hover, .nav-link.active {{
    color: white; border-bottom-color: white;
}}

/* ============================================================
   SEARCH FORM
   ============================================================ */
.search-section {{ max-width: 900px; margin: 2rem auto; padding: 0 1rem; }}
.search-form {{
    display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;
}}
.search-input {{
    flex: 1; min-width: 200px; padding: 0.75rem 1rem;
    border: 2px solid var(--color-border); border-radius: var(--radius);
    font-size: 1rem; background: var(--color-surface);
    color: var(--color-text); transition: border-color var(--transition);
}}
.search-input:focus {{ outline: none; border-color: var(--color-primary); }}
.filter-select {{
    padding: 0.75rem 1rem; border: 2px solid var(--color-border);
    border-radius: var(--radius); background: var(--color-surface);
    color: var(--color-text); font-size: 1rem;
}}
.search-btn {{
    padding: 0.75rem 1.5rem; background: var(--color-primary);
    color: white; border: none; border-radius: var(--radius);
    font-weight: 600; cursor: pointer;
    transition: background var(--transition);
}}
.search-btn:hover {{ background: var(--color-primary-dk); }}

/* ============================================================
   CATALOG GRID — CSS Grid, responsive
   ============================================================ */
.catalog-section {{ max-width: 1200px; margin: 0 auto; padding: 1rem; }}
.catalog-section h2 {{ font-size: 1.5rem; margin-bottom: 1rem; }}
.count-badge {{
    background: var(--color-primary); color: white;
    font-size: 0.85rem; padding: 0.15rem 0.6rem;
    border-radius: 999px; vertical-align: middle;
}}
.catalog-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}}

/* ============================================================
   BOOK CARDS — Flexbox interior
   ============================================================ */
.book-card {{
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius); padding: 1.25rem;
    display: flex; flex-direction: column; gap: 0.5rem;
    box-shadow: var(--shadow-sm);
    transition: transform var(--transition), box-shadow var(--transition);
}}
.book-card:hover {{
    transform: translateY(-2px); box-shadow: var(--shadow-lg);
}}
.card-badge {{
    align-self: flex-start; font-size: 0.75rem; font-weight: 700;
    text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 4px;
}}
{generate_genre_badges(genre_colors)}

.card-title  {{ font-size: 1.1rem; font-weight: 700; }}
.card-author {{ color: var(--color-text-muted); }}
.card-year   {{ font-size: 0.85rem; color: var(--color-text-muted); }}

.card-footer {{
    margin-top: auto; display: flex;
    justify-content: space-between; align-items: center;
    padding-top: 0.75rem; border-top: 1px solid var(--color-border);
}}
.availability {{ font-size: 0.85rem; font-weight: 600; }}
.available   {{ color: var(--color-success); }}
.unavailable {{ color: var(--color-danger); }}

.checkout-btn {{
    padding: 0.4rem 1rem; background: var(--color-accent);
    color: white; border: none; border-radius: 6px;
    font-weight: 600; cursor: pointer;
    transition: background var(--transition);
}}
.checkout-btn:hover:not(:disabled) {{ background: #6d28d9; }}
.checkout-btn:disabled {{
    background: var(--color-text-muted);
    cursor: not-allowed; opacity: 0.6;
}}

/* ============================================================
   FOOTER
   ============================================================ */
.site-footer {{
    text-align: center; padding: 2rem;
    color: var(--color-text-muted); font-size: 0.9rem;
    border-top: 1px solid var(--color-border); margin-top: 3rem;
}}

/* ============================================================
   RESPONSIVE: Stack search on narrow screens
   ============================================================ */
@media (max-width: 600px) {{
    .search-form {{ flex-direction: column; }}
    .search-input {{ min-width: 100%; }}
    .catalog-grid {{ grid-template-columns: 1fr; }}
}}"""

print(css)

# --- Summary ---
print("\
--- CSS generation complete ---")
print(f"Light theme: {len(light_theme)} tokens")
print(f"Dark theme:  {len(dark_theme)} overrides")
print(f"Genre badges: {len(genre_colors)} genres")
print("\
Copy this CSS into a styles.css file to use it!")`,
      challenge: 'Add a .book-card.featured class that gives featured books a left border of 4px solid gold and a subtle golden background tint. Then add a print stylesheet (@media print) that hides the nav, search form, and checkout buttons — only the book list should print.',
      successHint: 'This stylesheet uses every major CSS layout technique: Grid for the catalog, Flexbox for cards and nav, custom properties for theming, media queries for responsiveness and dark mode. This is the CSS you would write for a real production web application — no frameworks, no preprocessors, just clean modern CSS.',
    },
    {
      title: 'JavaScript Interactivity: Search, Filter, and Checkout',
      concept: `JavaScript brings the page to life. HTML defines structure, CSS defines appearance, and JavaScript defines behavior — what happens when the user searches, filters, clicks, or interacts.

**DOM manipulation** is how JavaScript changes the page. The Document Object Model (DOM) is the browser's in-memory representation of your HTML. JavaScript can find elements (\`document.getElementById\`, \`document.querySelectorAll\`), read their attributes, change their content, show or hide them, and add new elements.

**Event listeners** connect user actions to code. \`element.addEventListener('click', handleClick)\` runs the \`handleClick\` function whenever the element is clicked. Events bubble up the DOM tree: a click on a button inside a card also triggers click handlers on the card and its parent. **Event delegation** exploits this — instead of attaching a listener to every button, you attach one listener to the parent and check which child was clicked. This is more efficient and handles dynamically added elements.

**Filtering** works by iterating over all book cards and toggling their visibility. For each card, check if it matches the search text and the selected genre. If both match, show it (\`card.style.display = ''\`). If not, hide it (\`card.style.display = 'none'\`). The \`textContent\` property gives you the visible text of an element, and \`dataset\` gives you the \`data-*\` attributes.

**State management** in vanilla JavaScript means keeping track of the application's current state in variables. We track checked-out books by updating the \`data-available\` attribute and the displayed text. In a real application you would send a fetch request to the server — here we simulate it with a timeout to show how asynchronous updates work.

The **\`fetch\` API** sends HTTP requests to a server. We simulate a checkout by wrapping the UI update in a \`setTimeout\` (pretending it takes 500ms for the server to respond). In production, this would be \`fetch('/api/checkout', { method: 'POST', body: JSON.stringify({ bookId }) })\`. The pattern is the same: disable the button, show a loading state, wait for the response, update the UI.

**\`DOMContentLoaded\`** is the event that fires when the HTML has been fully parsed. All your setup code goes inside this event listener, ensuring that DOM elements exist before JavaScript tries to access them.`,
      analogy: 'JavaScript is like the library staff. The building (HTML) and its decor (CSS) exist, but nothing happens until someone works there. When a visitor asks "Do you have any science books?" the librarian (JavaScript) walks through the shelves, pulls out matching books, and hides the rest. When someone checks out a book, the librarian updates the record and puts an "unavailable" sign on the shelf. Event listeners are like the bell on the front desk — when someone rings it (clicks a button), the librarian responds.',
      storyConnection: 'Dipankar could not be at the library every hour. He trained volunteers to handle common tasks: answer search questions, check out books, keep the log updated. Our JavaScript is that trained volunteer — it responds to every user action according to rules we define. The search function mirrors how Dipankar taught his helpers to find books: "Look at the title and author, check if it matches what they asked for."',
      checkQuestion: 'Why use event delegation (one listener on the parent) instead of adding a click listener to each checkout button individually?',
      checkAnswer: 'Three reasons. First, efficiency: 1000 books means 1000 listeners versus 1 listener. Each listener consumes memory. Second, dynamically added cards: if you add a new book card via JavaScript, you would need to manually add a listener to its button. With delegation, the parent listener automatically handles new children. Third, cleanup: removing the parent removes one listener instead of tracking and removing hundreds. Event delegation is a fundamental pattern in professional JavaScript.',
      codeIntro: 'Implement the search, filter, and checkout logic in Python — the same algorithms that power the JavaScript version. This demonstrates that programming concepts transfer across languages.',
      code: `# ============================================================
# Library Catalog — Search, Filter, and Checkout Logic
# The same algorithms that power the browser JavaScript,
# implemented in Python. Concepts transfer across languages.
# ============================================================

import json
from datetime import datetime

# --- Book catalog (mirrors the HTML data attributes) ---
books = [
    {"id": 1,  "title": "Miri Jiyori",             "author": "Rajanikanta Bordoloi",  "genre": "Fiction",    "year": 1894, "available": 2},
    {"id": 2,  "title": "Burhi Aair Sadhu",         "author": "Lakshminath Bezbaroa",  "genre": "Folklore",   "year": 1911, "available": 3},
    {"id": 3,  "title": "Pita Putra",               "author": "Bhabendra Nath Saikia", "genre": "Fiction",    "year": 1972, "available": 1},
    {"id": 4,  "title": "Mamore Dhora Tarowal",     "author": "Jyoti Prasad Agarwala", "genre": "Poetry",     "year": 1939, "available": 2},
    {"id": 5,  "title": "The Shadow Lines",          "author": "Amitav Ghosh",          "genre": "Fiction",    "year": 1988, "available": 2},
    {"id": 6,  "title": "The God of Small Things",   "author": "Arundhati Roy",         "genre": "Fiction",    "year": 1997, "available": 0},
    {"id": 7,  "title": "Homen Borgohain Stories",   "author": "Homen Borgohain",       "genre": "Fiction",    "year": 1980, "available": 1},
    {"id": 8,  "title": "Interpreter of Maladies",   "author": "Jhumpa Lahiri",         "genre": "Fiction",    "year": 1999, "available": 2},
    {"id": 9,  "title": "A Brief History of Time",   "author": "Stephen Hawking",       "genre": "Science",    "year": 1988, "available": 1},
    {"id": 10, "title": "Datal Hatir Uye Khowa Howdah","author":"Mamoni R. Goswami",    "genre": "Fiction",    "year": 1988, "available": 2},
    {"id": 11, "title": "The Room on the Roof",      "author": "Ruskin Bond",           "genre": "Fiction",    "year": 1956, "available": 3},
    {"id": 12, "title": "Wings of Fire",             "author": "A.P.J. Abdul Kalam",    "genre": "Biography",  "year": 1999, "available": 2},
    {"id": 13, "title": "Ramayana Retold",           "author": "C. Rajagopalachari",    "genre": "Mythology",  "year": 1951, "available": 1},
    {"id": 14, "title": "Gitanjali",                 "author": "Rabindranath Tagore",   "genre": "Poetry",     "year": 1910, "available": 2},
    {"id": 15, "title": "Discovery of India",        "author": "Jawaharlal Nehru",      "genre": "History",    "year": 1946, "available": 1},
]

# Checkout log — simulates the event log from JavaScript
checkout_log = []

# ========================================================
# SEARCH + FILTER: same algorithm as the JS filterBooks()
# ========================================================
def filter_books(query="", genre="all"):
    """Filter books by text query (title/author) and genre.

    This is the exact same logic as the JavaScript filterBooks():
    - Text match: title OR author contains query (case-insensitive)
    - Genre match: 'all' passes everything, else exact match
    """
    query = query.lower().strip()
    results = []
    for book in books:
        text_match = (
            not query
            or query in book["title"].lower()
            or query in book["author"].lower()
        )
        genre_match = (genre == "all" or book["genre"] == genre)
        if text_match and genre_match:
            results.append(book)
    return results

# ========================================================
# CHECKOUT: same pattern as the JS event delegation handler
# ========================================================
def checkout_book(book_id):
    """Simulate checking out a book.

    In JavaScript this uses event delegation on the catalog grid.
    The pattern is identical: find the book, check availability,
    decrement, log the event.
    """
    book = next((b for b in books if b["id"] == book_id), None)
    if not book:
        return f"Error: Book ID {book_id} not found"
    if book["available"] <= 0:
        return f"'{book['title']}' is unavailable (0 copies)"

    # Decrement availability (same as: card.dataset.available -= 1)
    book["available"] -= 1

    # Log the checkout (same as: console.log('[Checkout]', ...))
    log_entry = {
        "bookId": book_id,
        "title": book["title"],
        "remaining": book["available"],
        "timestamp": datetime.now().isoformat(),
    }
    checkout_log.append(log_entry)

    status = "LAST COPY" if book["available"] == 0 else f"{book['available']} left"
    return f"Checked out: '{book['title']}' ({status})"


# ========================================================
# DEMO: Run the same operations a user would perform
# ========================================================
print("=== SEARCH: 'ghosh' ===")
results = filter_books(query="ghosh")
for b in results:
    print(f"  [{b['id']}] {b['title']} by {b['author']} ({b['available']} avail)")

print("\
=== FILTER: genre = 'Poetry' ===")
results = filter_books(genre="Poetry")
for b in results:
    print(f"  [{b['id']}] {b['title']} by {b['author']} ({b['available']} avail)")

print("\
=== FILTER: genre = 'Fiction', query = 'roy' ===")
results = filter_books(query="roy", genre="Fiction")
for b in results:
    print(f"  [{b['id']}] {b['title']} by {b['author']} ({b['available']} avail)")

print("\
=== CHECKOUT SIMULATION ===")
print(checkout_book(3))   # Pita Putra — 1 copy, becomes 0
print(checkout_book(3))   # Should say unavailable now
print(checkout_book(5))   # The Shadow Lines — 2 copies, becomes 1
print(checkout_book(99))  # Non-existent book

print("\
=== CHECKOUT LOG (like console.log in JS) ===")
for entry in checkout_log:
    print(f"  {json.dumps(entry)}")

print("\
=== ALL UNAVAILABLE BOOKS ===")
unavailable = [b for b in books if b["available"] == 0]
for b in unavailable:
    print(f"  {b['title']} by {b['author']} — checked out")

# ========================================================
# GENERATE app.js — the actual JavaScript for the browser
# ========================================================
print("\
=== GENERATED app.js (copy to use in browser) ===")
js_code = """
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    const searchForm  = document.getElementById('searchForm');
    const catalogGrid = document.getElementById('catalogGrid');
    const bookCount   = document.getElementById('bookCount');
    const allCards    = catalogGrid.querySelectorAll('.book-card');

    function filterBooks() {
        const query = searchInput.value.toLowerCase().trim();
        const genre = genreFilter.value;
        let visible = 0;
        allCards.forEach(card => {
            const title  = card.querySelector('.card-title').textContent.toLowerCase();
            const author = card.querySelector('.card-author').textContent.toLowerCase();
            const textMatch  = !query || title.includes(query) || author.includes(query);
            const genreMatch = genre === 'all' || card.dataset.genre === genre;
            card.style.display = (textMatch && genreMatch) ? '' : 'none';
            if (textMatch && genreMatch) visible++;
        });
        bookCount.textContent = visible;
    }

    searchInput.addEventListener('input', filterBooks);
    genreFilter.addEventListener('change', filterBooks);
    searchForm.addEventListener('submit', e => { e.preventDefault(); filterBooks(); });

    catalogGrid.addEventListener('click', e => {
        const btn = e.target.closest('.checkout-btn');
        if (!btn || btn.disabled) return;
        const card = btn.closest('.book-card');
        const title = card.querySelector('.card-title').textContent;
        let available = parseInt(card.dataset.available, 10);
        if (available <= 0) return;
        btn.disabled = true;
        btn.textContent = 'Processing...';
        setTimeout(() => {
            available -= 1;
            card.dataset.available = available;
            const avail = card.querySelector('.availability');
            if (available > 0) {
                avail.textContent = available + (available === 1 ? ' copy available' : ' copies available');
                btn.textContent = 'Check Out';
                btn.disabled = false;
            } else {
                avail.textContent = '0 copies — checked out';
                avail.classList.replace('available', 'unavailable');
                btn.textContent = 'Unavailable';
            }
        }, 500);
    });

    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    });
});
""".strip()
print(js_code)`,
      challenge: 'Add a "Return Book" feature: when a book has 0 copies available, show a "Return" button next to "Unavailable." Clicking it increments the availability, updates the display, and re-enables the checkout button. Use the same event delegation pattern.',
      successHint: 'You have written production-quality JavaScript: event delegation for efficiency, simulated async API calls, toast notifications, keyboard shortcuts, and clean DOM manipulation. This is exactly how interactive web applications work before frameworks — and understanding this foundation makes you a better React/Vue/Svelte developer, because every framework is just automating these same DOM operations.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (web development fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project builds a full-stack Library Management System using SQL, HTML, CSS, and JavaScript. Click to start the code playground.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Code Playground</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}
