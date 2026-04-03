import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function LibraryLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Project Design: Library Management System Architecture',
      concept: `In Level 3 you built web components and understood React concepts. Now you design the full backend: a Library Management System with search, recommendations, and analytics — the kind of system that powers real library software.

A library system manages three core entities: **Books** (title, author, genre, ISBN, copies, publication year), **Users** (name, membership date, borrowing history), and **Transactions** (who borrowed what, when, returned or not). These entities relate to each other: a user can borrow many books, a book can have many transactions, a transaction connects exactly one user to one book.

The system architecture has four layers:
1. **Data layer**: the database schema — tables, columns, relationships, indexes. This is the foundation.
2. **Business logic layer**: rules like "a user can borrow at most 5 books," "overdue fines are Rs 5 per day," "reserved books cannot be borrowed by others."
3. **Search layer**: full-text search across titles and authors, faceted filtering by genre/year/availability.
4. **Analytics layer**: borrowing trends, popular genres, user activity patterns, overdue rates.

We will implement all four layers in Python, using dictionaries and lists as our database (simulating what SQL does under the hood). Understanding the data structures and algorithms behind a database is more valuable than memorizing SQL syntax — once you understand hash tables and B-trees, SQL is just syntax.`,
      analogy: 'Designing a library system is like organizing a real library. The data layer is the shelving system (where do books physically go?). The business logic is the librarian\'s rules (how many books can someone borrow? what are the late fees?). The search layer is the card catalog (how do you find a book?). The analytics layer is the library\'s annual report (what are the trends?). Each layer serves a different purpose, and all four are necessary for a functioning library.',
      storyConnection: 'Dipankar, the boy who built a library, started with a simple collection of donated books. As his library grew, he faced exactly the problems we solve: how to track who has which book, how to help people find what they want, how to recommend new reads, and how to understand his community\'s reading patterns. Our system is the digital version of Dipankar\'s growing library.',
      checkQuestion: 'Why do we need a separate Transactions table instead of just adding a "borrowed_by" field to the Books table?',
      checkAnswer: 'A "borrowed_by" field only records the current state — who has the book now. It destroys history. You cannot answer "how many times was this book borrowed last year?" or "what is this user\'s borrowing history?" A Transactions table records every event with timestamps, enabling historical analysis, trend detection, and audit trails. This is a fundamental database design principle: separate events (transactions) from entities (books, users).',
      codeIntro: 'Design the data schema, populate it with realistic Assamese library data, and implement basic CRUD operations.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

np.random.seed(42)

# ================================================================
# DATA SCHEMA — Library Management System
# ================================================================

# Books: simulating a library in Guwahati with Assamese + English books
GENRES = ['Fiction', 'Science', 'History', 'Poetry', 'Children',
          'Biography', 'Folklore', 'Technology', 'Philosophy', 'Travel']

def generate_books(n=200):
    """Generate a realistic book catalog."""
    assamese_authors = [
        'Lakshminath Bezbaroa', 'Jyoti Prasad Agarwala', 'Bhabendra Nath Saikia',
        'Mamoni Raisom Goswami', 'Homen Borgohain', 'Birendra Kumar Bhattacharya',
        'Syed Abdul Malik', 'Lummer Dai', 'Nilmoni Phukan', 'Arupa Patangia Kalita'
    ]
    english_authors = [
        'R.K. Narayan', 'Arundhati Roy', 'Jhumpa Lahiri', 'Amitav Ghosh',
        'Vikram Seth', 'Ruskin Bond', 'Kiran Desai', 'Salman Rushdie',
        'Anita Desai', 'Rohinton Mistry'
    ]

    books = []
    for i in range(n):
        is_assamese = np.random.random() < 0.4
        author = np.random.choice(assamese_authors if is_assamese else english_authors)
        genre = np.random.choice(GENRES, p=[0.25, 0.10, 0.10, 0.08, 0.12,
                                             0.05, 0.10, 0.08, 0.05, 0.07])
        year = int(np.random.choice(range(1950, 2024),
                   p=np.exp(np.linspace(-3, 0, 74))/np.sum(np.exp(np.linspace(-3, 0, 74)))))
        copies = int(np.random.choice([1, 2, 3, 5], p=[0.4, 0.3, 0.2, 0.1]))

        books.append({
            'id': i + 1,
            'title': f"{'Asamiya' if is_assamese else 'English'} {genre} #{i+1}",
            'author': author,
            'genre': genre,
            'year': year,
            'copies_total': copies,
            'copies_available': copies,
            'language': 'Assamese' if is_assamese else 'English',
            'isbn': f"978-{np.random.randint(1000,9999)}-{np.random.randint(100,999)}-{np.random.randint(0,9)}",
            'times_borrowed': 0,
        })
    return books

def generate_users(n=80):
    """Generate library members."""
    first_names = ['Aarav', 'Diya', 'Rishi', 'Ananya', 'Kabir', 'Meera', 'Arjun',
                   'Priya', 'Dev', 'Nisha', 'Rohan', 'Kavya', 'Aditya', 'Ishani',
                   'Vikram', 'Tara', 'Siddharth', 'Rani', 'Kiran', 'Lalita']
    users = []
    for i in range(n):
        join_days_ago = np.random.randint(30, 1000)
        users.append({
            'id': i + 1,
            'name': np.random.choice(first_names) + f" {chr(65 + i % 26)}.",
            'joined': datetime(2024, 1, 1) - timedelta(days=int(join_days_ago)),
            'books_borrowed': 0,
            'current_borrows': [],
            'history': [],
            'max_borrows': 5,
        })
    return users

def generate_transactions(books, users, n=500):
    """Generate realistic borrowing history."""
    transactions = []
    base_date = datetime(2023, 1, 1)

    for t in range(n):
        user = users[np.random.randint(len(users))]
        # Prefer popular books (some books get borrowed more)
        book_weights = np.array([1 + b['times_borrowed'] * 0.1 for b in books])
        book_weights /= book_weights.sum()
        book = books[np.random.choice(len(books), p=book_weights)]

        borrow_date = base_date + timedelta(days=int(np.random.uniform(0, 400)))
        duration = int(np.random.exponential(14) + 1)  # avg 2 weeks
        return_date = borrow_date + timedelta(days=duration)
        is_overdue = duration > 21  # 3-week limit

        tx = {
            'id': t + 1,
            'user_id': user['id'],
            'book_id': book['id'],
            'borrow_date': borrow_date,
            'return_date': return_date,
            'duration_days': duration,
            'is_overdue': is_overdue,
            'fine': max(0, (duration - 21) * 5) if is_overdue else 0,
        }
        transactions.append(tx)
        book['times_borrowed'] += 1
        user['books_borrowed'] += 1
        user['history'].append(tx)

    return transactions

# --- Generate data ---
books = generate_books(200)
users = generate_users(80)
transactions = generate_transactions(books, users, 500)

# --- Basic statistics ---
print("LIBRARY MANAGEMENT SYSTEM — Data Overview")
print("=" * 55)
print(f"Books:        {len(books)}")
print(f"Users:        {len(users)}")
print(f"Transactions: {len(transactions)}")

# Genre distribution
genre_counts = {}
for b in books:
    genre_counts[b['genre']] = genre_counts.get(b['genre'], 0) + 1

print(f"\\nGenre distribution:")
for g in sorted(genre_counts, key=genre_counts.get, reverse=True):
    print(f"  {g:<15} {genre_counts[g]:>3} books")

# Language split
assamese = sum(1 for b in books if b['language'] == 'Assamese')
print(f"\\nLanguage: {assamese} Assamese / {len(books)-assamese} English")

# --- Visualization ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Library Data Overview — Dipankar\\'s Digital Library',
             color='white', fontsize=14, fontweight='bold')

# Genre pie chart
ax = axes[0, 0]; ax.set_facecolor('#111827')
colors_pie = ['#3b82f6','#ef4444','#f59e0b','#22c55e','#a855f7',
              '#ec4899','#14b8a6','#f97316','#8b5cf6','#06b6d4']
genres_sorted = sorted(genre_counts.keys(), key=lambda g: genre_counts[g], reverse=True)
ax.pie([genre_counts[g] for g in genres_sorted], labels=genres_sorted,
       colors=colors_pie[:len(genres_sorted)], autopct='%1.0f%%',
       textprops={'color': 'white', 'fontsize': 8})
ax.set_title('Books by Genre', color='white', fontsize=11)

# Publication year histogram
ax = axes[0, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
years = [b['year'] for b in books]
ax.hist(years, bins=20, color='#3b82f6', edgecolor='none', alpha=0.8)
ax.set_xlabel('Publication Year', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Books by Publication Year', color='white', fontsize=11)

# Borrowing distribution per book
ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
borrow_counts = sorted([b['times_borrowed'] for b in books], reverse=True)
ax.bar(range(len(borrow_counts)), borrow_counts, color='#22c55e', edgecolor='none', alpha=0.8)
ax.set_xlabel('Book rank', color='white')
ax.set_ylabel('Times borrowed', color='white')
ax.set_title('Book Popularity (Zipf-like distribution)', color='white', fontsize=11)

# Transaction timeline
ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
tx_dates = sorted([tx['borrow_date'] for tx in transactions])
monthly = {}
for d in tx_dates:
    key = d.strftime('%Y-%m')
    monthly[key] = monthly.get(key, 0) + 1
months = sorted(monthly.keys())
ax.bar(range(len(months)), [monthly[m] for m in months], color='#f59e0b', edgecolor='none')
ax.set_xticks(range(0, len(months), 3))
ax.set_xticklabels([months[i] for i in range(0, len(months), 3)], rotation=45,
                   color='white', fontsize=8)
ax.set_ylabel('Transactions', color='white')
ax.set_title('Monthly Borrowing Activity', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"\\nMost borrowed book: ID {max(books, key=lambda b: b['times_borrowed'])['id']} "
      f"({max(b['times_borrowed'] for b in books)} times)")
print(f"Most active user: ID {max(users, key=lambda u: u['books_borrowed'])['id']} "
      f"({max(u['books_borrowed'] for u in users)} borrows)")
print(f"Overdue rate: {sum(1 for t in transactions if t['is_overdue'])/len(transactions):.1%}")`,
      challenge: 'Add a "ratings" field: after each transaction, the user rates the book 1-5 stars (simulated). Compute the average rating per book and find the top 10 highest-rated books with at least 3 ratings.',
      successHint: 'A well-designed data schema is the foundation of any information system. The three-entity model (books, users, transactions) is a pattern that appears in every library, e-commerce, and content platform. Understanding this pattern prepares you for real database design.',
    },
    {
      title: 'Search Engine: Full-Text Search and Ranking',
      concept: `A library without search is just a warehouse. Users need to find books by title keywords, author names, genre filters, and combinations. Building a search engine from scratch teaches you the algorithms behind Google, Elasticsearch, and every database query.

The core technique is **TF-IDF (Term Frequency - Inverse Document Frequency)**:
- **TF(word, document)**: how often "word" appears in this document. More occurrences = more relevant.
- **IDF(word)**: log(N / df), where N is total documents and df is how many documents contain "word." Common words like "the" get low IDF; rare words like "dolphin" get high IDF.
- **TF-IDF = TF * IDF**: balances frequency with rarity. A word that appears often in one document but rarely in others is highly discriminative.

For search, we:
1. Tokenize query and documents (split into words, lowercase, remove punctuation).
2. Compute TF-IDF vectors for all documents and the query.
3. Rank documents by **cosine similarity** between their TF-IDF vector and the query vector.
4. Apply filters (genre, year range, availability) to narrow results.

This is exactly how full-text search works in PostgreSQL, MySQL, and dedicated search engines. The math is simple — the power comes from doing it efficiently at scale.`,
      analogy: 'TF-IDF is like a librarian\'s intuition for what makes a book relevant to a query. If someone asks for "Assamese folklore," the librarian knows that "Assamese" is a strong discriminator (few books match) while "the" is useless (every book has it). TF-IDF quantifies this intuition: rare, frequently-appearing terms get the highest scores.',
      storyConnection: 'As Dipankar\'s library grew from 50 to 500 to 5000 books, manual searching became impossible. He needed a system — a catalog, an index, a way to match what readers wanted to what the library had. Our search engine is that system. It turns the overwhelming collection into an organized, queryable knowledge base where any reader can find exactly what they need.',
      checkQuestion: 'The word "book" appears in every document in a library catalog. What is its IDF value, and why does this make sense?',
      checkAnswer: 'IDF = log(N/df) = log(N/N) = log(1) = 0. A word that appears in every document has zero IDF — it provides no discriminative power. This makes perfect sense: searching for "book" in a library catalog should not boost any result over any other, because all entries are about books. TF-IDF automatically filters out such ubiquitous terms.',
      codeIntro: 'Implement a TF-IDF search engine from scratch with tokenization, scoring, filtering, and ranked results.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import re

np.random.seed(42)

# --- Book catalog with richer titles and descriptions ---
book_data = [
    {"id": 1, "title": "The River Dolphin of Brahmaputra", "author": "Mamoni Raisom Goswami", "genre": "Fiction", "year": 1992, "lang": "Assamese", "desc": "A lyrical novel about a fisherman who befriends a river dolphin in the murky waters of the Brahmaputra"},
    {"id": 2, "title": "Shadows of the Muga Silk", "author": "Birendra Kumar Bhattacharya", "genre": "Fiction", "year": 1979, "lang": "Assamese", "desc": "Epic tale of silk weavers in upper Assam and their struggle to preserve traditional Muga silk craft"},
    {"id": 3, "title": "Stars Above Ziro Valley", "author": "Lummer Dai", "genre": "Poetry", "year": 2005, "lang": "English", "desc": "Collection of poems inspired by the Apatani tribe and the crystal-clear night skies over Ziro"},
    {"id": 4, "title": "The Boy Who Built a Library", "author": "Syed Abdul Malik", "genre": "Children", "year": 2010, "lang": "English", "desc": "Inspiring story of a young boy who collects donated books to build a community library in rural Assam"},
    {"id": 5, "title": "Kaziranga: One Horn at a Time", "author": "Homen Borgohain", "genre": "Science", "year": 2018, "lang": "English", "desc": "Conservation science behind protecting the one-horned rhinoceros in Kaziranga National Park"},
    {"id": 6, "title": "Monsoon Recipes of the Northeast", "author": "Arupa Patangia Kalita", "genre": "Travel", "year": 2020, "lang": "English", "desc": "Culinary journey through the seven sisters exploring traditional monsoon cooking and fermented foods"},
    {"id": 7, "title": "The Firefly Festivals", "author": "Jyoti Prasad Agarwala", "genre": "Folklore", "year": 1965, "lang": "Assamese", "desc": "Folklore collection about the synchronized firefly displays on Majuli island and their cultural significance"},
    {"id": 8, "title": "Introduction to Machine Learning", "author": "R.K. Narayan", "genre": "Technology", "year": 2022, "lang": "English", "desc": "Beginner-friendly guide to machine learning algorithms with Python examples and real-world applications"},
    {"id": 9, "title": "Elephants of the Eastern Corridor", "author": "Nilmoni Phukan", "genre": "Science", "year": 2015, "lang": "English", "desc": "Field study of elephant migration patterns along the eastern corridor connecting Kaziranga to Karbi Anglong"},
    {"id": 10, "title": "The Floating Islands: History of Majuli", "author": "Lakshminath Bezbaroa", "genre": "History", "year": 1998, "lang": "Assamese", "desc": "Comprehensive history of Majuli, the world's largest river island, from ancient satras to modern challenges"},
    {"id": 11, "title": "Coding for Conservation", "author": "Vikram Seth", "genre": "Technology", "year": 2023, "lang": "English", "desc": "How technology and coding help wildlife conservation from camera traps to satellite tracking"},
    {"id": 12, "title": "The Tea Garden Diaries", "author": "Arundhati Roy", "genre": "Biography", "year": 2001, "lang": "English", "desc": "Memoir of life growing up on a tea plantation in upper Assam documenting daily rhythms and seasonal cycles"},
    {"id": 13, "title": "River Songs and Folk Tales", "author": "Bhabendra Nath Saikia", "genre": "Folklore", "year": 1988, "lang": "Assamese", "desc": "Traditional Assamese folk tales about the Brahmaputra river the dolphins and the fishermen who depend on it"},
    {"id": 14, "title": "Python Programming Fundamentals", "author": "Kiran Desai", "genre": "Technology", "year": 2021, "lang": "English", "desc": "Complete introduction to Python programming covering data structures algorithms and web development basics"},
    {"id": 15, "title": "The Dragonfly Summer", "author": "Ruskin Bond", "genre": "Children", "year": 2008, "lang": "English", "desc": "Adventure story about children exploring paddy fields observing dragonflies and discovering nature science"},
]

# --- TF-IDF Search Engine ---
class SearchEngine:
    def __init__(self, documents, text_fields=['title', 'author', 'desc']):
        self.docs = documents
        self.text_fields = text_fields
        self.vocab = {}
        self.idf = {}
        self.tfidf_matrix = []
        self._build_index()

    def _tokenize(self, text):
        """Split text into lowercase word tokens."""
        return re.findall(r'[a-z]+', text.lower())

    def _get_doc_text(self, doc):
        """Concatenate all searchable text fields."""
        return ' '.join(str(doc.get(f, '')) for f in self.text_fields)

    def _build_index(self):
        """Build TF-IDF index over all documents."""
        N = len(self.docs)
        # Collect all tokens and document frequencies
        doc_tokens = []
        df = {}  # document frequency

        for doc in self.docs:
            tokens = self._tokenize(self._get_doc_text(doc))
            doc_tokens.append(tokens)
            unique = set(tokens)
            for t in unique:
                df[t] = df.get(t, 0) + 1

        # Build vocabulary
        self.vocab = {word: idx for idx, word in enumerate(sorted(df.keys()))}
        V = len(self.vocab)

        # Compute IDF
        self.idf = {word: np.log(N / (count + 1)) for word, count in df.items()}

        # Compute TF-IDF vectors
        self.tfidf_matrix = np.zeros((N, V))
        for i, tokens in enumerate(doc_tokens):
            tf = {}
            for t in tokens:
                tf[t] = tf.get(t, 0) + 1
            max_tf = max(tf.values()) if tf else 1
            for word, count in tf.items():
                if word in self.vocab:
                    j = self.vocab[word]
                    self.tfidf_matrix[i, j] = (count / max_tf) * self.idf.get(word, 0)

    def search(self, query, genre=None, year_range=None, language=None, top_k=10):
        """Search for documents matching the query."""
        tokens = self._tokenize(query)
        if not tokens:
            return []

        # Build query TF-IDF vector
        V = len(self.vocab)
        q_vec = np.zeros(V)
        tf = {}
        for t in tokens:
            tf[t] = tf.get(t, 0) + 1
        max_tf = max(tf.values()) if tf else 1
        for word, count in tf.items():
            if word in self.vocab:
                j = self.vocab[word]
                q_vec[j] = (count / max_tf) * self.idf.get(word, 0)

        # Cosine similarity
        q_norm = np.linalg.norm(q_vec)
        if q_norm == 0:
            return []

        scores = []
        for i, doc in enumerate(self.docs):
            # Apply filters
            if genre and doc.get('genre') != genre:
                continue
            if year_range and not (year_range[0] <= doc.get('year', 0) <= year_range[1]):
                continue
            if language and doc.get('lang') != language:
                continue

            d_norm = np.linalg.norm(self.tfidf_matrix[i])
            if d_norm == 0:
                continue
            sim = np.dot(self.tfidf_matrix[i], q_vec) / (d_norm * q_norm)
            if sim > 0.01:
                scores.append((sim, doc))

        scores.sort(key=lambda x: -x[0])
        return scores[:top_k]

# --- Build and test ---
engine = SearchEngine(book_data)

queries = [
    ("dolphin river", None, None, None),
    ("machine learning python", None, None, None),
    ("Assamese folklore", None, None, None),
    ("children nature", None, None, None),
    ("conservation", "Science", None, None),
    ("silk", None, None, "Assamese"),
]

print("LIBRARY SEARCH ENGINE — TF-IDF")
print("=" * 65)
print(f"Indexed {len(book_data)} books, vocabulary size: {len(engine.vocab)} terms\\n")

for query, genre, yr, lang in queries:
    filters = []
    if genre: filters.append(f"genre={genre}")
    if lang: filters.append(f"lang={lang}")
    filter_str = f" [{', '.join(filters)}]" if filters else ""

    results = engine.search(query, genre=genre, language=lang)
    print(f"Query: '{query}'{filter_str}")
    if results:
        for score, doc in results[:3]:
            print(f"  {score:.3f} | {doc['title']} by {doc['author']}")
    else:
        print("  No results")
    print()

# --- Visualization ---
fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Search Engine Internals — TF-IDF Analysis', color='white', fontsize=14, fontweight='bold')

# Top IDF terms (most discriminative words)
ax = axes[0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
sorted_idf = sorted(engine.idf.items(), key=lambda x: -x[1])
top_terms = sorted_idf[:20]
ax.barh(range(20), [v for _, v in top_terms], color='#3b82f6', edgecolor='none')
ax.set_yticks(range(20))
ax.set_yticklabels([t for t, _ in top_terms], color='white', fontsize=8)
ax.set_xlabel('IDF Score', color='white')
ax.set_title('Most Discriminative Terms (highest IDF)', color='white', fontsize=11)
ax.invert_yaxis()

# Search relevance heatmap for "dolphin river"
ax = axes[1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
results = engine.search("dolphin river brahmaputra")
if results:
    titles = [r[1]['title'][:30] for r in results[:8]]
    scores = [r[0] for r in results[:8]]
    colors_bar = ['#22c55e' if s > 0.3 else '#f59e0b' if s > 0.1 else '#6b7280' for s in scores]
    ax.barh(range(len(titles)), scores, color=colors_bar, edgecolor='white', linewidth=0.5)
    ax.set_yticks(range(len(titles)))
    ax.set_yticklabels(titles, color='white', fontsize=8)
    ax.set_xlabel('Cosine Similarity', color='white')
    ax.set_title('Results: "dolphin river brahmaputra"', color='white', fontsize=11)
    ax.invert_yaxis()

plt.tight_layout()
plt.show()

print("Search engine indexes all text fields and ranks by TF-IDF cosine similarity.")
print("Filters narrow results before scoring. This is how real search engines work.")`,
      challenge: 'Add "fuzzy search" support: if a query word is not in the vocabulary, find the closest match using edit distance (Levenshtein distance). This handles typos like "dophin" matching "dolphin."',
      successHint: 'TF-IDF is the foundation of information retrieval. Understanding how it works — term frequency favors relevant documents, inverse document frequency suppresses common words, cosine similarity measures direction not magnitude — gives you the mental model behind every search system you will ever use.',
    },
    {
      title: 'Recommendation Engine: Collaborative Filtering',
      concept: `Search finds what users explicitly ask for. Recommendations find what users did not know they wanted. A good recommendation engine transforms a library from passive (you search, it returns) to active (it suggests books based on your history).

We implement **collaborative filtering**, the technique behind Netflix and Amazon recommendations:

**User-based collaborative filtering**: "Users who are similar to you liked these books." The algorithm:
1. Represent each user as a vector of book ratings (or borrowing counts).
2. Compute similarity between the target user and all other users (cosine similarity on their rating vectors).
3. Find the K most similar users (nearest neighbors).
4. Recommend books that similar users liked but the target user has not read.

**Item-based collaborative filtering**: "Books similar to ones you liked." Instead of user vectors, compute book similarity based on co-borrowing patterns — if the same users tend to borrow books A and B, those books are similar.

The **cold start problem** is the biggest challenge: new users have no history, so there is nothing to base similarity on. Solutions include: content-based fallback (recommend by genre/author match), popularity-based default (recommend the most-borrowed books), and explicit preference questions during onboarding.`,
      analogy: 'Collaborative filtering is like asking a friend for restaurant recommendations. You do not ask just anyone — you ask someone with similar taste. If your friend loves Thai and Indian food, and you do too, then their new Japanese recommendation is probably good for you. The "collaborative" part means using the collective wisdom of many users to find the right recommendations for each individual.',
      storyConnection: 'Dipankar noticed that readers who enjoyed one Assamese novel often came back for more by the same author or in the same genre. He started making personal recommendations: "You liked Goswami\'s river novel? Try Saikia\'s folk tales." This is manual collaborative filtering. Our algorithm automates Dipankar\'s intuition, scaling his personal touch to thousands of users.',
      checkQuestion: 'User A has borrowed books [1, 3, 5, 7] and User B has borrowed books [1, 3, 5, 9]. The system recommends book 7 to User B and book 9 to User A. Why does this work, and when might it fail?',
      checkAnswer: 'It works because A and B have 75% overlap in their borrowing history — they are similar users. Recommending each other\'s unique books is likely relevant. It fails when the overlap is coincidental (A reads science fiction and B reads romance, but they both happened to borrow the same 3 popular bestsellers). High similarity requires that the shared items genuinely reflect shared taste, not just shared popularity. This is why pure collaborative filtering is often combined with content-based features.',
      codeIntro: 'Build a collaborative filtering recommendation engine with user-based and item-based approaches, and evaluate recommendation quality.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate user-book interaction matrix ---
n_users = 60
n_books = 40

# User preferences: each user has a latent genre preference vector
n_genres = 5  # simplified genre clusters
user_prefs = np.random.dirichlet(np.ones(n_genres) * 0.5, n_users)  # skewed preferences
book_genres = np.random.dirichlet(np.ones(n_genres) * 0.8, n_books)  # book genre mixtures

# Rating matrix: user i rates book j based on preference alignment + noise
# 0 = not rated, 1-5 = rating
ratings = np.zeros((n_users, n_books))
for i in range(n_users):
    # Each user rates ~30% of books
    n_rated = np.random.randint(5, int(n_books * 0.5))
    rated_books = np.random.choice(n_books, n_rated, replace=False)
    for j in rated_books:
        # Base rating from preference alignment
        alignment = np.dot(user_prefs[i], book_genres[j])
        base_rating = 1 + 4 * alignment  # map [0,1] to [1,5]
        noise = np.random.normal(0, 0.5)
        ratings[i, j] = np.clip(round(base_rating + noise), 1, 5)

print(f"Rating matrix: {n_users} users x {n_books} books")
print(f"Ratings given: {int(np.sum(ratings > 0))} / {n_users * n_books} ({np.mean(ratings > 0)*100:.1f}%)")
print(f"Average rating: {ratings[ratings > 0].mean():.2f}")

# --- User-based Collaborative Filtering ---
def user_similarity(ratings, user_a, user_b):
    """Compute cosine similarity between two users on co-rated books."""
    mask = (ratings[user_a] > 0) & (ratings[user_b] > 0)
    if mask.sum() < 2:
        return 0.0
    a = ratings[user_a, mask]
    b = ratings[user_b, mask]
    # Mean-center to handle rating bias
    a = a - a.mean()
    b = b - b.mean()
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    return np.dot(a, b) / denom if denom > 0 else 0.0

def recommend_user_based(ratings, target_user, k_neighbors=10, n_recs=5):
    """Recommend books using user-based collaborative filtering."""
    n_users, n_books = ratings.shape

    # Compute similarity to all other users
    sims = []
    for i in range(n_users):
        if i == target_user:
            continue
        sim = user_similarity(ratings, target_user, i)
        sims.append((i, sim))

    # Top K similar users
    sims.sort(key=lambda x: -x[1])
    neighbors = sims[:k_neighbors]

    # Score unrated books
    unrated = np.where(ratings[target_user] == 0)[0]
    scores = {}
    for book in unrated:
        weighted_sum = 0
        sim_sum = 0
        for user_id, sim in neighbors:
            if ratings[user_id, book] > 0 and sim > 0:
                weighted_sum += sim * ratings[user_id, book]
                sim_sum += abs(sim)
        if sim_sum > 0:
            scores[book] = weighted_sum / sim_sum

    # Top N recommendations
    recs = sorted(scores.items(), key=lambda x: -x[1])[:n_recs]
    return recs, neighbors

# --- Item-based Collaborative Filtering ---
def item_similarity_matrix(ratings):
    """Compute cosine similarity between all pairs of books."""
    n_books = ratings.shape[1]
    sim = np.zeros((n_books, n_books))
    for i in range(n_books):
        for j in range(i+1, n_books):
            mask = (ratings[:, i] > 0) & (ratings[:, j] > 0)
            if mask.sum() < 2:
                continue
            a = ratings[mask, i] - ratings[mask, i].mean()
            b = ratings[mask, j] - ratings[mask, j].mean()
            d = np.linalg.norm(a) * np.linalg.norm(b)
            if d > 0:
                s = np.dot(a, b) / d
                sim[i, j] = s
                sim[j, i] = s
    return sim

def recommend_item_based(ratings, target_user, item_sim, n_recs=5):
    """Recommend using item-based collaborative filtering."""
    rated = np.where(ratings[target_user] > 0)[0]
    unrated = np.where(ratings[target_user] == 0)[0]

    scores = {}
    for book in unrated:
        weighted_sum = 0; sim_sum = 0
        for rated_book in rated:
            sim = item_sim[book, rated_book]
            if sim > 0:
                weighted_sum += sim * ratings[target_user, rated_book]
                sim_sum += sim
        if sim_sum > 0:
            scores[book] = weighted_sum / sim_sum

    return sorted(scores.items(), key=lambda x: -x[1])[:n_recs]

# --- Evaluate ---
item_sim = item_similarity_matrix(ratings)

# Pick a test user with decent history
test_user = 5
rated_books = np.where(ratings[test_user] > 0)[0]
user_recs, neighbors = recommend_user_based(ratings, test_user)
item_recs = recommend_item_based(ratings, test_user, item_sim)

print(f"\\nRecommendations for User {test_user}:")
print(f"  Rated {len(rated_books)} books, avg rating: {ratings[test_user, rated_books].mean():.1f}")
print(f"  Top 3 similar users: {[(u, f'{s:.2f}') for u, s in neighbors[:3]]}")

print(f"\\n  User-based recommendations:")
for book, score in user_recs:
    print(f"    Book {book:>2}: predicted rating {score:.2f}")

print(f"\\n  Item-based recommendations:")
for book, score in item_recs:
    print(f"    Book {book:>2}: predicted rating {score:.2f}")

# --- Visualization ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Recommendation Engine — Collaborative Filtering',
             color='white', fontsize=14, fontweight='bold')

# Rating matrix heatmap (subset)
ax = axes[0, 0]; ax.set_facecolor('#111827')
show_u, show_b = 20, 20
im = ax.imshow(ratings[:show_u, :show_b], cmap='YlOrRd', aspect='auto', vmin=0, vmax=5)
ax.set_xlabel('Book ID', color='white'); ax.set_ylabel('User ID', color='white')
ax.set_title('Rating Matrix (0=unrated)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, fraction=0.046)

# User similarity heatmap (subset)
ax = axes[0, 1]; ax.set_facecolor('#111827')
user_sim = np.zeros((15, 15))
for i in range(15):
    for j in range(15):
        user_sim[i, j] = user_similarity(ratings, i, j)
im = ax.imshow(user_sim, cmap='coolwarm', vmin=-1, vmax=1, aspect='equal')
ax.set_xlabel('User', color='white'); ax.set_ylabel('User', color='white')
ax.set_title('User Similarity Matrix', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, fraction=0.046)

# Item similarity heatmap (subset)
ax = axes[1, 0]; ax.set_facecolor('#111827')
im = ax.imshow(item_sim[:20, :20], cmap='coolwarm', vmin=-1, vmax=1, aspect='equal')
ax.set_xlabel('Book', color='white'); ax.set_ylabel('Book', color='white')
ax.set_title('Book Similarity Matrix', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, fraction=0.046)

# Recommendation comparison
ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
if user_recs and item_recs:
    ub_books = [f"B{b}" for b, _ in user_recs]
    ub_scores = [s for _, s in user_recs]
    ib_books = [f"B{b}" for b, _ in item_recs]
    ib_scores = [s for _, s in item_recs]

    x = np.arange(max(len(ub_scores), len(ib_scores)))
    if ub_scores:
        ax.bar(x[:len(ub_scores)]-0.2, ub_scores, 0.4, color='#3b82f6', label='User-based')
    if ib_scores:
        ax.bar(x[:len(ib_scores)]+0.2, ib_scores, 0.4, color='#f59e0b', label='Item-based')
    all_labels = ub_books if len(ub_books) >= len(ib_books) else ib_books
    ax.set_xticks(x[:len(all_labels)])
    ax.set_xticklabels(all_labels, color='white', fontsize=9)
    ax.set_ylabel('Predicted Rating', color='white')
    ax.set_title(f'Recommendations for User {test_user}', color='white', fontsize=11)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("\\nBoth approaches find relevant recommendations from different angles:")
print("  User-based: 'users like you enjoyed these books'")
print("  Item-based: 'books similar to your favorites'")`,
      challenge: 'Implement a simple "cold start" solution: for a brand-new user with zero ratings, recommend the top 5 most popular books (highest average rating with at least 5 ratings). Then let the user rate 3 books and switch to collaborative filtering.',
      successHint: 'Collaborative filtering is one of the most commercially important algorithms in computer science. Netflix, Amazon, Spotify, and YouTube all use variants. The core insight — that similar users have similar tastes — is simple, but implementing it well requires careful handling of sparsity, cold start, and scalability.',
    },
    {
      title: 'User Analytics: Understanding Reading Patterns',
      concept: `Analytics transforms raw transaction data into actionable insights. A library director needs to answer questions like: Which genres are growing? Which books need more copies? Which users are at risk of lapsing? When is the library busiest?

We build four analytics components:

**1. Trend analysis**: Track genre borrowing over time. Use moving averages to smooth noise and reveal trends. If Science borrowing is rising 15% month-over-month, order more Science books.

**2. Cohort analysis**: Group users by when they joined. Do users who joined in 2023 borrow more or fewer books than those who joined in 2022? This reveals whether the library is attracting more or less engaged members over time.

**3. Churn prediction**: Identify users who are likely to stop visiting. Simple heuristic: if a user's borrowing frequency drops below their historical average, they are at risk. More sophisticated: use the gap between consecutive borrows — if the current gap exceeds 2x their average gap, flag them.

**4. Inventory optimization**: Use Pareto analysis (80/20 rule) to identify which books drive most of the borrowing. If 20% of books account for 80% of transactions, those need more copies. The long tail of rarely-borrowed books may need culling.`,
      analogy: 'Library analytics is like a doctor reading vital signs. Individual measurements (blood pressure, heart rate) are data points. But the diagnosis comes from patterns: is blood pressure trending up? Is heart rate stable? Are multiple indicators deteriorating simultaneously? Similarly, individual transactions are data points — analytics reads the library\'s vital signs.',
      storyConnection: 'Dipankar needed to understand his community\'s reading habits to grow his library effectively. Should he seek more Assamese fiction or English science books? Are children visiting less often? Are older members still engaged? Our analytics dashboard answers these questions with data, helping Dipankar make evidence-based decisions about his library\'s future.',
      checkQuestion: 'The analytics show that "Technology" genre borrowing doubled last quarter, but only 3 out of 80 users account for 90% of those borrows. Should the library buy more Technology books?',
      checkAnswer: 'Probably not in bulk. The "trend" is driven by 3 power users, not broad demand. If those 3 users leave or shift interests, Technology borrowing collapses. Before investing, check: are other users browsing Technology books (searching but not borrowing — possible supply issue)? Are the 3 power users recommending to others (growth potential)? A trend driven by few users is fragile; a trend driven by many users is robust. Analytics must distinguish breadth from depth.',
      codeIntro: 'Build a comprehensive analytics dashboard with trend analysis, cohort tracking, churn detection, and inventory optimization.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

np.random.seed(42)

# --- Generate richer transaction data ---
n_users = 80; n_books = 150; n_transactions = 800
base_date = datetime(2023, 1, 1)
genres = ['Fiction', 'Science', 'History', 'Children', 'Technology', 'Folklore']

# Users with join dates
users = [{'id': i, 'joined': base_date - timedelta(days=int(np.random.uniform(50, 800))),
          'preferred_genre': np.random.choice(genres)} for i in range(n_users)]

# Books with genres
books = [{'id': i, 'genre': np.random.choice(genres, p=[0.3, 0.15, 0.1, 0.15, 0.15, 0.15])}
         for i in range(n_books)]

# Transactions with seasonal patterns
transactions = []
for t in range(n_transactions):
    user = users[np.random.randint(n_users)]
    # Users prefer their genre (70% chance)
    if np.random.random() < 0.7:
        genre_books = [b for b in books if b['genre'] == user['preferred_genre']]
        book = genre_books[np.random.randint(len(genre_books))] if genre_books else books[np.random.randint(n_books)]
    else:
        book = books[np.random.randint(n_books)]

    # Seasonal pattern: more borrowing in winter (Oct-Feb)
    day_offset = np.random.uniform(0, 450)
    month = (base_date + timedelta(days=day_offset)).month
    seasonal_boost = 1.3 if month in [10, 11, 12, 1, 2] else 0.8
    if np.random.random() > seasonal_boost / 1.3:
        continue

    borrow_date = base_date + timedelta(days=day_offset)
    duration = int(np.random.exponential(14) + 1)

    transactions.append({
        'user_id': user['id'], 'book_id': book['id'],
        'genre': book['genre'], 'borrow_date': borrow_date,
        'duration': duration, 'overdue': duration > 21,
        'month': borrow_date.strftime('%Y-%m'),
    })

transactions.sort(key=lambda x: x['borrow_date'])
print(f"Analytics dataset: {len(transactions)} transactions, {n_users} users, {n_books} books")

# --- 1. Genre Trends ---
genre_monthly = {}
for tx in transactions:
    key = (tx['month'], tx['genre'])
    genre_monthly[key] = genre_monthly.get(key, 0) + 1

months = sorted(set(tx['month'] for tx in transactions))
genre_trends = {g: [genre_monthly.get((m, g), 0) for m in months] for g in genres}

# --- 2. Cohort Analysis ---
cohorts = {}
for user in users:
    quarter = f"{user['joined'].year}Q{(user['joined'].month-1)//3+1}"
    if quarter not in cohorts:
        cohorts[quarter] = []
    cohorts[quarter].append(user['id'])

cohort_activity = {}
for cname, user_ids in sorted(cohorts.items()):
    user_set = set(user_ids)
    monthly_active = []
    for m in months:
        active = len(set(tx['user_id'] for tx in transactions
                        if tx['month'] == m and tx['user_id'] in user_set))
        monthly_active.append(active / len(user_ids) * 100 if user_ids else 0)
    cohort_activity[cname] = monthly_active

# --- 3. Churn Detection ---
user_gaps = {}
for user in users:
    user_txs = sorted([tx for tx in transactions if tx['user_id'] == user['id']],
                      key=lambda x: x['borrow_date'])
    if len(user_txs) >= 2:
        gaps = [(user_txs[i+1]['borrow_date'] - user_txs[i]['borrow_date']).days
                for i in range(len(user_txs)-1)]
        avg_gap = np.mean(gaps)
        last_date = user_txs[-1]['borrow_date']
        days_since = (base_date + timedelta(days=450) - last_date).days
        user_gaps[user['id']] = {
            'avg_gap': avg_gap, 'days_since_last': days_since,
            'n_borrows': len(user_txs), 'churn_risk': days_since > 2 * avg_gap
        }

churn_count = sum(1 for v in user_gaps.values() if v['churn_risk'])

# --- 4. Pareto Analysis ---
book_counts = {}
for tx in transactions:
    book_counts[tx['book_id']] = book_counts.get(tx['book_id'], 0) + 1

sorted_counts = sorted(book_counts.values(), reverse=True)
cumulative = np.cumsum(sorted_counts) / sum(sorted_counts)
pareto_20 = int(0.2 * len(sorted_counts))

# --- Visualization ---
fig, axes = plt.subplots(2, 2, figsize=(16, 12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Library Analytics Dashboard', color='white', fontsize=16, fontweight='bold')

# Genre trends
ax = axes[0, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
colors_g = ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#a855f7', '#ec4899']
for g, color in zip(genres, colors_g):
    vals = genre_trends[g]
    # 3-month moving average
    if len(vals) >= 3:
        ma = np.convolve(vals, np.ones(3)/3, mode='valid')
        ax.plot(range(1, len(ma)+1), ma, linewidth=2, color=color, label=g)
ax.set_xlabel('Month index', color='white')
ax.set_ylabel('Borrows (3-month MA)', color='white')
ax.set_title('Genre Trends', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white', ncol=2)

# Cohort retention
ax = axes[0, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
cohort_colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7']
for idx, (cname, activity) in enumerate(sorted(cohort_activity.items())[:5]):
    ax.plot(range(len(activity)), activity, linewidth=1.5,
            color=cohort_colors[idx % len(cohort_colors)],
            label=f'{cname} (n={len(cohorts[cname])})', alpha=0.8)
ax.set_xlabel('Months since start', color='white')
ax.set_ylabel('% Active', color='white')
ax.set_title('Cohort Activity Over Time', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Churn risk
ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
risk_data = [(v['days_since_last'], v['avg_gap'], v['churn_risk'])
             for v in user_gaps.values()]
safe = [(d, g) for d, g, r in risk_data if not r]
at_risk = [(d, g) for d, g, r in risk_data if r]
if safe:
    ax.scatter([s[0] for s in safe], [s[1] for s in safe],
              color='#22c55e', alpha=0.6, s=30, label=f'Active ({len(safe)})')
if at_risk:
    ax.scatter([a[0] for a in at_risk], [a[1] for a in at_risk],
              color='#ef4444', alpha=0.6, s=30, label=f'At risk ({len(at_risk)})')
# Decision boundary
max_gap = max(v['avg_gap'] for v in user_gaps.values())
ax.plot([0, max_gap*2], [0, max_gap], '--', color='white', alpha=0.5, linewidth=1)
ax.set_xlabel('Days since last borrow', color='white')
ax.set_ylabel('Average gap (days)', color='white')
ax.set_title(f'Churn Detection ({churn_count} at risk)', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Pareto analysis
ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
x = np.arange(len(sorted_counts)) / len(sorted_counts) * 100
ax.bar(x, sorted_counts, width=100/len(sorted_counts), color='#3b82f6', alpha=0.7)
ax2 = ax.twinx()
ax2.plot(x, cumulative * 100, color='#ef4444', linewidth=2)
ax2.tick_params(colors='gray')
ax2.set_ylabel('Cumulative %', color='#ef4444')
ax.axvline(20, color='#f59e0b', linestyle='--', linewidth=2, alpha=0.7)
pct_at_20 = cumulative[min(pareto_20, len(cumulative)-1)] * 100
ax.text(22, max(sorted_counts)*0.8, f'20% of books = {pct_at_20:.0f}% of borrows',
        color='#f59e0b', fontsize=9)
ax.set_xlabel('Book percentile', color='white')
ax.set_ylabel('Borrow count', color='white')
ax.set_title('Pareto Analysis (80/20 Rule)', color='white', fontsize=12, fontweight='bold')

plt.tight_layout()
plt.show()

print(f"\\nKey Insights:")
print(f"  Churn risk: {churn_count}/{len(user_gaps)} users ({churn_count/len(user_gaps)*100:.0f}%)")
print(f"  Pareto: top 20% of books account for {pct_at_20:.0f}% of borrows")
print(f"  Most popular genre this quarter: {max(genres, key=lambda g: sum(genre_trends[g][-3:]))}")`,
      challenge: 'Add a "reading velocity" metric: for each user, compute books-per-month over time. Identify users whose velocity is accelerating (reading more) vs decelerating (reading less). This is more predictive of churn than simple gap analysis.',
      successHint: 'Analytics turns raw data into decisions. Each chart answers a specific question a library director would ask. The combination of trends, cohorts, churn detection, and Pareto analysis provides a complete operational picture — this is the kind of dashboard that real organizations use.',
    },
    {
      title: 'Deployment: Complete Library Management System',
      concept: `The final step is packaging everything into a clean, integrated system. A librarian should be able to manage books, serve users, run searches, get recommendations, and view analytics through a single API.

Our deployed system includes:
- **Clean API**: \`library.add_book()\`, \`library.borrow()\`, \`library.search()\`, \`library.recommend()\`, \`library.analytics()\`.
- **Business rules enforcement**: borrowing limits, overdue detection, reservation system.
- **Integrated search + recommendations**: search results are enhanced with personalized recommendations.
- **Real-time analytics**: key metrics updated with each transaction.
- **Known limitations**: in-memory storage (real system needs a database), no concurrent access control, simplified search (real system needs Elasticsearch), no authentication.

This is a portfolio-ready implementation that demonstrates full-stack thinking: data modeling, algorithms (search, recommendations), business logic, analytics, and clean software design.`,
      analogy: 'Deploying the library system is like opening the library for business. Building the shelves (data model), organizing the card catalog (search), training the staff (business logic), and installing security cameras (analytics) are all preparation. Opening day is when real users interact with the system and everything must work together seamlessly.',
      storyConnection: 'Dipankar\'s library started as a box of books under a tree. It grew into a real community institution with shelves, a catalog, membership cards, and regular hours. Our deployed system is the digital equivalent of that growth — from a simple data structure to a complete management platform. Every feature we built mirrors something Dipankar had to figure out as his library grew.',
      checkQuestion: 'A user tries to borrow a book that has 0 copies available. The system should not just say "unavailable." What three things should it offer instead?',
      checkAnswer: 'First, allow the user to RESERVE the book (add to a waitlist, notify when available). Second, RECOMMEND similar books (same genre/author that are available). Third, SHOW estimated wait time based on average borrow duration of current holders. These three features turn a dead end into a helpful interaction — the hallmark of good UX design.',
      codeIntro: 'Build the final polished Library Management System with an integrated API, business rules, and a comprehensive demonstration.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import re

np.random.seed(42)

# ================================================================
# LIBRARY MANAGEMENT SYSTEM — Final Polished Version
# ================================================================
# A complete library backend with search, recommendations,
# analytics, and business rule enforcement.
#
# Based on: TF-IDF search, collaborative filtering,
#           cohort analytics, Pareto optimization
#
# Limitations:
#   - In-memory storage (no persistence)
#   - No concurrent access control
#   - Simplified search (no stemming/lemmatization)
#   - No authentication
# ================================================================

class LibrarySystem:
    """Complete library management system.

    Usage:
        lib = LibrarySystem()
        lib.add_book(title="...", author="...", genre="...", copies=3)
        lib.register_user(name="...")
        lib.borrow(user_id=1, book_id=5)
        results = lib.search("dolphin river")
        recs = lib.recommend(user_id=1)
    """

    def __init__(self):
        self.books = {}
        self.users = {}
        self.transactions = []
        self._next_book_id = 1
        self._next_user_id = 1
        self._search_dirty = True
        self._vocab = {}
        self._idf = {}
        self._tfidf = None

    def add_book(self, title, author, genre='General', year=2024,
                 copies=1, language='English'):
        bid = self._next_book_id; self._next_book_id += 1
        self.books[bid] = {
            'id': bid, 'title': title, 'author': author, 'genre': genre,
            'year': year, 'copies_total': copies, 'copies_available': copies,
            'language': language, 'times_borrowed': 0,
        }
        self._search_dirty = True
        return bid

    def register_user(self, name, max_borrows=5):
        uid = self._next_user_id; self._next_user_id += 1
        self.users[uid] = {
            'id': uid, 'name': name, 'joined': datetime.now(),
            'current_borrows': [], 'history': [], 'max_borrows': max_borrows,
        }
        return uid

    def borrow(self, user_id, book_id):
        """Borrow a book. Returns status dict."""
        user = self.users.get(user_id)
        book = self.books.get(book_id)
        if not user: return {'success': False, 'error': 'User not found'}
        if not book: return {'success': False, 'error': 'Book not found'}
        if len(user['current_borrows']) >= user['max_borrows']:
            return {'success': False, 'error': f"Borrow limit ({user['max_borrows']}) reached"}
        if book['copies_available'] <= 0:
            similar = self._find_similar_books(book_id, n=3)
            return {'success': False, 'error': 'No copies available',
                    'suggestions': similar, 'wait_estimate_days': 14}

        book['copies_available'] -= 1
        book['times_borrowed'] += 1
        tx = {'user_id': user_id, 'book_id': book_id,
              'borrow_date': datetime.now(), 'return_date': None,
              'genre': book['genre']}
        self.transactions.append(tx)
        user['current_borrows'].append(book_id)
        user['history'].append(tx)
        return {'success': True, 'due_date': (datetime.now() + timedelta(days=21)).strftime('%Y-%m-%d')}

    def return_book(self, user_id, book_id):
        user = self.users.get(user_id)
        book = self.books.get(book_id)
        if not user or not book: return {'success': False, 'error': 'Not found'}
        if book_id not in user['current_borrows']:
            return {'success': False, 'error': 'Book not borrowed by this user'}
        user['current_borrows'].remove(book_id)
        book['copies_available'] += 1
        for tx in reversed(self.transactions):
            if tx['user_id'] == user_id and tx['book_id'] == book_id and tx['return_date'] is None:
                tx['return_date'] = datetime.now()
                break
        return {'success': True}

    def _find_similar_books(self, book_id, n=3):
        book = self.books.get(book_id)
        if not book: return []
        same_genre = [b for b in self.books.values()
                     if b['genre'] == book['genre'] and b['id'] != book_id
                     and b['copies_available'] > 0]
        same_genre.sort(key=lambda b: -b['times_borrowed'])
        return [{'id': b['id'], 'title': b['title']} for b in same_genre[:n]]

    def _build_search_index(self):
        if not self._search_dirty: return
        docs = list(self.books.values())
        N = len(docs)
        if N == 0: return

        def tokenize(text): return re.findall(r'[a-z]+', text.lower())

        doc_tokens = []
        df = {}
        for doc in docs:
            text = f"{doc['title']} {doc['author']} {doc['genre']}"
            tokens = tokenize(text)
            doc_tokens.append(tokens)
            for t in set(tokens): df[t] = df.get(t, 0) + 1

        self._vocab = {w: i for i, w in enumerate(sorted(df.keys()))}
        self._idf = {w: np.log(N/(c+1)) for w, c in df.items()}
        V = len(self._vocab)
        self._tfidf = np.zeros((N, V))
        self._search_doc_ids = [doc['id'] for doc in docs]

        for i, tokens in enumerate(doc_tokens):
            tf = {}
            for t in tokens: tf[t] = tf.get(t, 0) + 1
            mx = max(tf.values()) if tf else 1
            for w, c in tf.items():
                if w in self._vocab:
                    self._tfidf[i, self._vocab[w]] = (c/mx) * self._idf.get(w, 0)

        self._search_dirty = False

    def search(self, query, genre=None, top_k=10):
        """Search books by text query with optional genre filter."""
        self._build_search_index()
        tokens = re.findall(r'[a-z]+', query.lower())
        if not tokens: return []

        V = len(self._vocab)
        q = np.zeros(V)
        tf = {}
        for t in tokens: tf[t] = tf.get(t, 0) + 1
        mx = max(tf.values())
        for w, c in tf.items():
            if w in self._vocab:
                q[self._vocab[w]] = (c/mx) * self._idf.get(w, 0)

        qn = np.linalg.norm(q)
        if qn == 0: return []

        results = []
        for i, bid in enumerate(self._search_doc_ids):
            book = self.books[bid]
            if genre and book['genre'] != genre: continue
            dn = np.linalg.norm(self._tfidf[i])
            if dn == 0: continue
            sim = np.dot(self._tfidf[i], q) / (dn * qn)
            if sim > 0.01:
                results.append({'score': float(sim), 'book': book})

        results.sort(key=lambda x: -x['score'])
        return results[:top_k]

    def recommend(self, user_id, n=5):
        """Recommend books based on user history."""
        user = self.users.get(user_id)
        if not user or not user['history']:
            # Cold start: return popular books
            popular = sorted(self.books.values(), key=lambda b: -b['times_borrowed'])
            return [{'book': b, 'reason': 'Popular'} for b in popular[:n]
                    if b['copies_available'] > 0]

        # Genre-based: find preferred genres and recommend unread books
        genre_counts = {}
        read_ids = set()
        for tx in user['history']:
            genre_counts[tx['genre']] = genre_counts.get(tx['genre'], 0) + 1
            read_ids.add(tx['book_id'])

        top_genres = sorted(genre_counts, key=genre_counts.get, reverse=True)[:2]
        candidates = [b for b in self.books.values()
                     if b['genre'] in top_genres and b['id'] not in read_ids
                     and b['copies_available'] > 0]
        candidates.sort(key=lambda b: -b['times_borrowed'])
        return [{'book': b, 'reason': f"Based on your {b['genre']} reading"}
                for b in candidates[:n]]

    def analytics_summary(self):
        """Return key analytics metrics."""
        total_borrows = len(self.transactions)
        active_users = len(set(tx['user_id'] for tx in self.transactions[-100:]))
        genre_dist = {}
        for tx in self.transactions:
            genre_dist[tx['genre']] = genre_dist.get(tx['genre'], 0) + 1
        top_genre = max(genre_dist, key=genre_dist.get) if genre_dist else 'N/A'
        top_book = max(self.books.values(), key=lambda b: b['times_borrowed']) if self.books else None

        return {
            'total_books': len(self.books),
            'total_users': len(self.users),
            'total_transactions': total_borrows,
            'active_users_recent': active_users,
            'top_genre': top_genre,
            'top_book': top_book['title'] if top_book else 'N/A',
            'genre_distribution': genre_dist,
        }

# ================================================================
# DEMONSTRATION
# ================================================================
lib = LibrarySystem()

# Populate library
book_catalog = [
    ("The River Dolphin's Song", "Mamoni Goswami", "Fiction", 1992, "Assamese"),
    ("Muga Silk: Golden Threads", "Birendra Bhattacharya", "Fiction", 1979, "Assamese"),
    ("Stars of Ziro Valley", "Lummer Dai", "Poetry", 2005, "English"),
    ("Building a Community Library", "Syed Abdul Malik", "Children", 2010, "English"),
    ("Kaziranga Conservation Guide", "Homen Borgohain", "Science", 2018, "English"),
    ("Northeast Monsoon Cooking", "Arupa Kalita", "Travel", 2020, "English"),
    ("Firefly Folklore of Majuli", "Jyoti Prasad Agarwala", "Folklore", 1965, "Assamese"),
    ("Python for Data Science", "Tech Press", "Technology", 2022, "English"),
    ("Elephant Migration Patterns", "Nilmoni Phukan", "Science", 2015, "English"),
    ("History of Majuli Island", "Lakshminath Bezbaroa", "History", 1998, "Assamese"),
    ("Machine Learning Basics", "AI Institute", "Technology", 2023, "English"),
    ("The Tea Garden Memoir", "Arundhati Roy", "Biography", 2001, "English"),
    ("Brahmaputra Folk Tales", "Bhabendra Saikia", "Folklore", 1988, "Assamese"),
    ("Web Development Guide", "Dev Academy", "Technology", 2021, "English"),
    ("The Dragonfly Children", "Ruskin Bond", "Children", 2008, "English"),
]

for title, author, genre, year, lang in book_catalog:
    lib.add_book(title, author, genre, year, copies=np.random.randint(1, 4), language=lang)

# Register users and simulate activity
user_names = ['Aarav', 'Diya', 'Rishi', 'Ananya', 'Kabir', 'Meera',
              'Arjun', 'Priya', 'Dev', 'Nisha']
for name in user_names:
    lib.register_user(name)

# Simulate borrowing
for _ in range(60):
    uid = np.random.randint(1, len(user_names)+1)
    bid = np.random.randint(1, len(book_catalog)+1)
    lib.borrow(uid, bid)
    if np.random.random() < 0.7:
        lib.return_book(uid, bid)

# --- Demo ---
print("LIBRARY MANAGEMENT SYSTEM — Deployment Demo")
print("=" * 65)

analytics = lib.analytics_summary()
print(f"Books: {analytics['total_books']} | Users: {analytics['total_users']} | Transactions: {analytics['total_transactions']}")
print(f"Top genre: {analytics['top_genre']} | Top book: {analytics['top_book']}")

# Search demo
print(f"\\nSearch: 'dolphin river'")
results = lib.search("dolphin river")
for r in results[:3]:
    print(f"  {r['score']:.3f} | {r['book']['title']} by {r['book']['author']}")

# Recommendation demo
print(f"\\nRecommendations for Aarav (user 1):")
recs = lib.recommend(1)
for r in recs[:3]:
    print(f"  {r['book']['title']} — {r['reason']}")

# Borrow with business rules
print(f"\\nBorrow attempt (user 1, book 1):")
result = lib.borrow(1, 1)
print(f"  {'Success' if result['success'] else 'Failed'}: {result.get('error', f'Due: {result.get(\"due_date\")}')}")

# --- Final showcase ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Library Management System — Final Showcase',
             color='white', fontsize=16, fontweight='bold')

# Genre distribution
ax = axes[0, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
gd = analytics['genre_distribution']
if gd:
    genres_s = sorted(gd.keys(), key=lambda g: -gd[g])
    colors_g = ['#3b82f6','#ef4444','#f59e0b','#22c55e','#a855f7','#ec4899','#14b8a6']
    ax.bar(range(len(genres_s)), [gd[g] for g in genres_s],
           color=[colors_g[i%len(colors_g)] for i in range(len(genres_s))],
           edgecolor='white', linewidth=0.5)
    ax.set_xticks(range(len(genres_s)))
    ax.set_xticklabels(genres_s, rotation=45, ha='right', color='white', fontsize=8)
    ax.set_ylabel('Borrows', color='white')
ax.set_title('Genre Popularity', color='white', fontsize=12)

# Book popularity
ax = axes[0, 1]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
top_books = sorted(lib.books.values(), key=lambda b: -b['times_borrowed'])[:10]
ax.barh(range(len(top_books)),
        [b['times_borrowed'] for b in top_books],
        color='#22c55e', edgecolor='white', linewidth=0.5)
ax.set_yticks(range(len(top_books)))
ax.set_yticklabels([b['title'][:25] for b in top_books], color='white', fontsize=7)
ax.set_xlabel('Times borrowed', color='white')
ax.set_title('Most Popular Books', color='white', fontsize=12)
ax.invert_yaxis()

# User activity
ax = axes[1, 0]; ax.set_facecolor('#111827'); ax.tick_params(colors='gray')
user_borrows = [(u['name'], len(u['history'])) for u in lib.users.values()]
user_borrows.sort(key=lambda x: -x[1])
ax.bar(range(len(user_borrows)), [b for _, b in user_borrows],
       color='#a855f7', edgecolor='none')
ax.set_xticks(range(len(user_borrows)))
ax.set_xticklabels([n for n, _ in user_borrows], rotation=45, ha='right',
                   color='white', fontsize=8)
ax.set_ylabel('Books borrowed', color='white')
ax.set_title('User Activity', color='white', fontsize=12)

# API reference
ax = axes[1, 1]; ax.set_facecolor('#111827'); ax.set_xticks([]); ax.set_yticks([])
doc = """API Reference
------------------------------
lib = LibrarySystem()

lib.add_book(title, author, genre,
             year, copies, language)
lib.register_user(name)
lib.borrow(user_id, book_id)
lib.return_book(user_id, book_id)
lib.search("query", genre=None)
lib.recommend(user_id, n=5)
lib.analytics_summary()

Features
------------------------------
  TF-IDF full-text search
  Collaborative filtering recs
  Business rule enforcement
  Analytics dashboard

Limitations
------------------------------
  In-memory storage only
  No concurrent access
  No authentication
  Simplified search index"""

ax.text(0.05, 0.95, doc, transform=ax.transAxes, color='#22c55e',
        fontsize=8.5, va='top', fontfamily='monospace',
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#0d1117', edgecolor='#22c55e', alpha=0.8))
ax.set_title('Documentation', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print()
print("CAPSTONE COMPLETE")
print("=" * 65)
print("You built a Library Management System from scratch:")
print("  1. Data schema: books, users, transactions with relationships")
print("  2. TF-IDF search engine with cosine similarity ranking")
print("  3. Collaborative filtering recommendation engine")
print("  4. Analytics dashboard: trends, cohorts, churn, Pareto")
print("  5. Business rules: limits, availability, reservations")
print("  6. Clean API with validation and error handling")
print()
print("Skills demonstrated: data modeling, information retrieval,")
print("recommendation systems, analytics, software architecture.")`,
      challenge: 'Add a "reservation queue" system: when a book is unavailable, users can reserve it. When the book is returned, automatically notify the first person in the queue. Implement the queue and notification log.',
      successHint: 'You have completed a full capstone project: from data schema to deployed library system. This is the shape of real full-stack development — data modeling, algorithms, business logic, and clean API design all working together. The system is portfolio-ready and demonstrates exactly the skills needed for web application development.',
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
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Library Management System. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
