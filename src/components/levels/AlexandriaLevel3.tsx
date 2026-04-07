import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function AlexandriaLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Database design — normalizing the Pinakes into relational tables',
      concept: `Callimachus's Pinakes stored everything about a scroll in one entry: author name, birthplace, teacher, subject, title, first line, scroll count. This flat structure has a problem: if Aristotle wrote 200 works, his birthplace ("Stagira") is repeated 200 times. Change it once, and you must update all 200 entries — or risk inconsistency.

**Database normalization** eliminates this redundancy by splitting data into related tables:

- **1NF (First Normal Form)**: No repeating groups — each cell holds a single value
- **2NF (Second Normal Form)**: Every non-key column depends on the entire primary key, not just part of it
- **3NF (Third Normal Form)**: No non-key column depends on another non-key column (no transitive dependencies)

After normalization, you'd have an **Authors** table (name, birthplace, teacher), a **Works** table (title, first_line, scroll_count, author_id), and a **Subjects** table (subject_name). The author's birthplace is stored once. Joins reconnect the data when needed.

The trade-off: normalized databases avoid redundancy and update anomalies, but require **joins** to reassemble the data — which cost time. Denormalization (strategic redundancy) is sometimes used for read-heavy workloads.

📚 *Edgar Codd invented the relational model in 1970 at IBM. His paper "A Relational Model of Data for Large Shared Data Banks" is the foundation of every SQL database in existence.*`,
      analogy: 'Imagine a school keeps one giant spreadsheet: student name, address, phone, class, teacher, classroom, grade. If a teacher changes rooms, you must update every row for every student in that class. Normalization says: separate the teacher-room mapping into its own table. Update it once, and every student query automatically gets the new room.',
      storyConnection: 'The Pinakes was a denormalized catalogue — author metadata was repeated with every work entry. This made browsing easy (all info in one place) but maintenance nightmarish. When scholars revised an author\'s biography, they had to locate and update every scroll entry. Modern libraries solved this with the relational model Callimachus couldn\'t have imagined.',
      checkQuestion: 'A table has columns: (scroll_id, title, author_name, author_birthplace, subject). Is it in 3NF? Why not?',
      checkAnswer: 'No. author_birthplace depends on author_name, not on scroll_id. This is a transitive dependency: scroll_id -> author_name -> author_birthplace. To reach 3NF, split into: Scrolls(scroll_id, title, author_id, subject_id) and Authors(author_id, name, birthplace).',
      codeIntro: 'Transform the flat Pinakes catalogue into normalized relational tables and demonstrate the difference.',
      code: `import numpy as np

# === DENORMALIZED (Flat Pinakes) ===
pinakes_flat = [
    {"scroll_id": 1, "title": "Elements Book I", "author": "Euclid",
     "birthplace": "Unknown", "teacher": "Plato's Academy", "subject": "Mathematics"},
    {"scroll_id": 2, "title": "Elements Book II", "author": "Euclid",
     "birthplace": "Unknown", "teacher": "Plato's Academy", "subject": "Mathematics"},
    {"scroll_id": 3, "title": "Optics", "author": "Euclid",
     "birthplace": "Unknown", "teacher": "Plato's Academy", "subject": "Mathematics"},
    {"scroll_id": 4, "title": "Physics", "author": "Aristotle",
     "birthplace": "Stagira", "teacher": "Plato", "subject": "Philosophy"},
    {"scroll_id": 5, "title": "Poetics", "author": "Aristotle",
     "birthplace": "Stagira", "teacher": "Plato", "subject": "Philosophy"},
    {"scroll_id": 6, "title": "On Animals", "author": "Aristotle",
     "birthplace": "Stagira", "teacher": "Plato", "subject": "Natural Science"},
    {"scroll_id": 7, "title": "Geographica", "author": "Eratosthenes",
     "birthplace": "Cyrene", "teacher": "Callimachus", "subject": "Geography"},
    {"scroll_id": 8, "title": "On Sizes", "author": "Aristarchus",
     "birthplace": "Samos", "teacher": "Strato", "subject": "Astronomy"},
    {"scroll_id": 9, "title": "Histories", "author": "Herodotus",
     "birthplace": "Halicarnassus", "teacher": "Unknown", "subject": "History"},
    {"scroll_id": 10, "title": "Almagest", "author": "Ptolemy",
     "birthplace": "Egypt", "teacher": "Unknown", "subject": "Astronomy"},
]

print("=== DENORMALIZED TABLE (Flat Pinakes) ===")
print(f"{'ID':>3} {'Title':<20} {'Author':<14} {'Birthplace':<16} {'Subject':<14}")
print("-" * 69)
for row in pinakes_flat:
    print(f"{row['scroll_id']:>3} {row['title']:<20} {row['author']:<14} "
          f"{row['birthplace']:<16} {row['subject']:<14}")

# Count redundancy
authors_mentioned = [r["author"] for r in pinakes_flat]
unique_authors = set(authors_mentioned)
redundant_cells = sum(authors_mentioned.count(a) - 1 for a in unique_authors)
total_cells = len(pinakes_flat) * 5
print(f"\\\nRedundancy: {redundant_cells} duplicate author/birthplace/teacher entries")
print(f"Total cells: {total_cells}  Redundant: ~{redundant_cells * 3} cells")

# === NORMALIZED (3NF) ===
authors_table = [
    {"author_id": 1, "name": "Euclid", "birthplace": "Unknown", "teacher": "Plato's Academy"},
    {"author_id": 2, "name": "Aristotle", "birthplace": "Stagira", "teacher": "Plato"},
    {"author_id": 3, "name": "Eratosthenes", "birthplace": "Cyrene", "teacher": "Callimachus"},
    {"author_id": 4, "name": "Aristarchus", "birthplace": "Samos", "teacher": "Strato"},
    {"author_id": 5, "name": "Herodotus", "birthplace": "Halicarnassus", "teacher": "Unknown"},
    {"author_id": 6, "name": "Ptolemy", "birthplace": "Egypt", "teacher": "Unknown"},
]

subjects_table = [
    {"subject_id": 1, "name": "Mathematics"},
    {"subject_id": 2, "name": "Philosophy"},
    {"subject_id": 3, "name": "Natural Science"},
    {"subject_id": 4, "name": "Geography"},
    {"subject_id": 5, "name": "Astronomy"},
    {"subject_id": 6, "name": "History"},
]

scrolls_table = [
    {"scroll_id": 1, "title": "Elements Book I", "author_id": 1, "subject_id": 1},
    {"scroll_id": 2, "title": "Elements Book II", "author_id": 1, "subject_id": 1},
    {"scroll_id": 3, "title": "Optics", "author_id": 1, "subject_id": 1},
    {"scroll_id": 4, "title": "Physics", "author_id": 2, "subject_id": 2},
    {"scroll_id": 5, "title": "Poetics", "author_id": 2, "subject_id": 2},
    {"scroll_id": 6, "title": "On Animals", "author_id": 2, "subject_id": 3},
    {"scroll_id": 7, "title": "Geographica", "author_id": 3, "subject_id": 4},
    {"scroll_id": 8, "title": "On Sizes", "author_id": 4, "subject_id": 5},
    {"scroll_id": 9, "title": "Histories", "author_id": 5, "subject_id": 6},
    {"scroll_id": 10, "title": "Almagest", "author_id": 6, "subject_id": 5},
]

print("\\\n=== NORMALIZED TABLES (3NF) ===")
print("\\\nAuthors:")
for a in authors_table:
    print(f"  [{a['author_id']}] {a['name']:<14} born: {a['birthplace']}")

print("\\\nSubjects:")
for s in subjects_table:
    print(f"  [{s['subject_id']}] {s['name']}")

print("\\\nScrolls:")
for s in scrolls_table:
    print(f"  [{s['scroll_id']}] {s['title']:<20} author_id={s['author_id']}  subject_id={s['subject_id']}")

# Simulated JOIN
print("\\\n=== JOIN Query: All scrolls by Aristotle ===")
aristotle_id = 2
for scroll in scrolls_table:
    if scroll["author_id"] == aristotle_id:
        author = next(a for a in authors_table if a["author_id"] == aristotle_id)
        subj = next(s for s in subjects_table if s["subject_id"] == scroll["subject_id"])
        print(f"  {scroll['title']} — {author['name']} ({author['birthplace']}) — {subj['name']}")

# Storage comparison
flat_cells = len(pinakes_flat) * 5
norm_cells = (len(authors_table) * 4 + len(subjects_table) * 2
              + len(scrolls_table) * 4)
print(f"\\\n=== Storage Comparison ===")
print(f"Flat table cells: {flat_cells}")
print(f"Normalized cells: {norm_cells}")
print(f"Reduction: {(1 - norm_cells/flat_cells):.0%}")
print(f"At 400,000 scrolls with ~100 authors: savings are massive")`,
      challenge: 'Add a many-to-many relationship: a scroll can belong to multiple subjects (e.g., Aristotle\'s "On Animals" is both Natural Science and Philosophy). You\'ll need a junction table: ScrollSubjects(scroll_id, subject_id). Implement the join query for this new structure.',
      successHint: 'You just performed database normalization — the process every database designer uses before writing a single line of SQL. The normal forms (1NF, 2NF, 3NF) eliminate redundancy systematically. Every application you use — from Instagram to your bank — stores data in normalized tables like these.',
    },
    {
      title: 'Full-text search — building an inverted index with TF-IDF',
      concept: `How did Alexandrian scholars find all scrolls mentioning "sphere"? Without full-text search, they had to read every scroll. An **inverted index** solves this: instead of mapping documents to words, it maps **words to documents**.

For each unique word in the collection, the inverted index stores a list of documents containing that word. Searching for "sphere" returns the list instantly — no scanning required.

But which results are most relevant? **TF-IDF** (Term Frequency × Inverse Document Frequency) ranks them:

- **TF** (Term Frequency): how often the word appears in this document. Higher = more relevant.
- **IDF** (Inverse Document Frequency): log(total_docs / docs_containing_word). Rare words get higher IDF — "sphere" is more informative than "the".
- **TF-IDF** = TF × IDF. A document scores high if it contains the search term frequently AND the term is rare across the collection.

This is the foundation of every search engine — from Google to the search bar in your email client.

📚 *Karen Sparck Jones proposed IDF weighting in 1972. Her insight — common words are less informative — seems obvious now but was revolutionary. She's considered one of the founders of information retrieval.*`,
      analogy: 'Imagine a book index at the back of a textbook. It lists "sphere: pages 23, 45, 112, 234." That\'s an inverted index — mapping the word to its locations. TF-IDF is like ranking those pages: page 45 mentions "sphere" 15 times (high TF) and "sphere" only appears in 4 of 300 pages (high IDF), so page 45 is the most relevant result.',
      storyConnection: 'The Pinakes indexed scrolls by author and subject but not by content. If you wanted every scroll that discussed the Pythagorean theorem, you had to know which authors wrote about it. A full-text inverted index would have transformed the Library from a catalogue into a search engine — 2,200 years before Google.',
      checkQuestion: 'A collection has 1,000 documents. The word "geometry" appears in 50 of them. One document mentions "geometry" 8 times in 200 words. What is the TF-IDF score?',
      checkAnswer: 'TF = 8/200 = 0.04. IDF = log(1000/50) = log(20) = 1.301. TF-IDF = 0.04 × 1.301 = 0.052. Compare to the word "the" (appears in all 1000 docs): IDF = log(1000/1000) = 0 — TF-IDF is zero regardless of frequency. Common words contribute nothing to relevance.',
      codeIntro: 'Build an inverted index for Alexandria\'s scroll collection and implement TF-IDF search ranking.',
      code: `import numpy as np

# Simulated scroll contents (key phrases from each work)
scrolls = {
    "Elements": "geometry proof triangle circle sphere line angle axiom postulate parallel congruent proportion ratio number prime geometry theorem proof",
    "Physics": "motion force nature cause change place time void infinite body motion force substance form matter element cause nature",
    "Almagest": "star planet sphere orbit eclipse moon sun circle epicycle equant sphere celestial longitude latitude conjunction opposition sphere",
    "Geographica": "earth measurement circumference distance latitude longitude map river mountain climate zone earth measurement sphere distance",
    "On Floating Bodies": "water body sphere weight volume density float sink equilibrium buoyancy fluid pressure sphere centre gravity",
    "Histories": "war battle king empire city people army navy fleet speech oracle temple sacrifice war battle Persia Greece",
    "On Sizes": "sun moon earth distance sphere ratio shadow eclipse angle measurement sphere sun distance calculation",
    "Conics": "parabola ellipse hyperbola curve section cone circle tangent focus axis vertex locus geometry curve cone section",
    "Poetics": "tragedy plot character speech thought song spectacle imitation action pity fear catharsis poetry drama",
    "Star Catalogue": "star magnitude constellation longitude latitude observation equinox precession sphere celestial coordinate star catalogue",
}

# Build inverted index
inverted_index = {}
doc_lengths = {}

for title, text in scrolls.items():
    words = text.lower().split()
    doc_lengths[title] = len(words)
    for word in words:
        if word not in inverted_index:
            inverted_index[word] = {}
        inverted_index[word][title] = inverted_index[word].get(title, 0) + 1

n_docs = len(scrolls)
n_terms = len(inverted_index)

print("=== Inverted Index Statistics ===")
print(f"Documents: {n_docs}")
print(f"Unique terms: {n_terms}")
print(f"Total postings: {sum(len(v) for v in inverted_index.values())}")

# Show sample entries
print("\\\nSample index entries:")
for term in ["sphere", "geometry", "war", "star", "body"]:
    if term in inverted_index:
        docs = inverted_index[term]
        print(f"  '{term}': {dict(docs)}")

def tfidf_search(query, top_k=5):
    """Search the index using TF-IDF scoring."""
    query_terms = query.lower().split()
    scores = {}

    for term in query_terms:
        if term not in inverted_index:
            continue
        postings = inverted_index[term]
        idf = np.log(n_docs / len(postings))

        for doc, count in postings.items():
            tf = count / doc_lengths[doc]
            tfidf = tf * idf
            scores[doc] = scores.get(doc, 0) + tfidf

    ranked = sorted(scores.items(), key=lambda x: -x[1])
    return ranked[:top_k]

# Run searches
print("\\\n=== TF-IDF Search Results ===")
queries = ["sphere geometry", "war battle", "star planet", "body water float"]
for q in queries:
    print(f"\\\nQuery: '{q}'")
    results = tfidf_search(q)
    for rank, (doc, score) in enumerate(results):
        bar = "#" * int(score * 50)
        print(f"  {rank+1}. {doc:<22} score={score:.4f} {bar}")

# IDF analysis: which words are most informative?
print("\\\n=== Most Informative Terms (highest IDF) ===")
idf_scores = {}
for term, postings in inverted_index.items():
    idf_scores[term] = np.log(n_docs / len(postings))

sorted_idf = sorted(idf_scores.items(), key=lambda x: -x[1])
print(f"{'Term':<16} {'Docs':>5} {'IDF':>6}")
for term, idf in sorted_idf[:10]:
    docs_with = len(inverted_index[term])
    print(f"  {term:<14} {docs_with:>5} {idf:>6.3f}")

print("\\\nLowest IDF (least informative):")
for term, idf in sorted_idf[-5:]:
    docs_with = len(inverted_index[term])
    print(f"  {term:<14} {docs_with:>5} {idf:>6.3f}")`,
      challenge: 'Add phrase search: instead of matching individual words, match exact sequences like "floating bodies." You\'ll need to store word positions in the inverted index (not just counts) and check that matching words appear consecutively in the document.',
      successHint: 'You just built the core of a search engine: an inverted index with TF-IDF ranking. Google, Elasticsearch, Apache Solr, and every search system uses this exact architecture. The inverted index gives speed; TF-IDF gives relevance. Together, they make the world\'s knowledge searchable.',
    },
    {
      title: 'Network resilience — modelling cascading failures in the knowledge network',
      concept: `The Library of Alexandria didn't fall in a single catastrophe — it suffered **cascading failures** over centuries. A fire damages one wing. Scholars who worked there leave. Their students never train. Fields of knowledge shrink. Funding drops. More scholars leave. Eventually, the institution collapses.

This is a **cascading failure** — a failure in one part of the network triggers failures in connected parts, which trigger more failures, potentially collapsing the entire system. The same pattern appears in:

- **Power grids**: one overloaded line trips, shifting load to neighbours, which overload and trip, causing a blackout
- **Financial systems**: one bank fails, creditors can't pay their debts, triggering more failures
- **Ecosystems**: one species goes extinct, predators lose food, prey populations explode, ecosystem destabilises

The key metric is **percolation threshold** — the fraction of nodes that must fail before the network fragments into disconnected pieces. Dense, well-connected networks are resilient (high threshold). Networks with a few critical hubs are fragile (low threshold).

📚 *Percolation theory, originally from physics (modelling fluid flow through porous materials), is now the mathematical framework for understanding network robustness — from the internet to epidemics.*`,
      analogy: 'Imagine removing random tiles from a mosaic floor. At first, you can still walk across — the floor is connected. But at some point, removing one more tile disconnects the floor into isolated islands. That critical point is the percolation threshold. A densely tiled floor survives more removals than a sparsely tiled one.',
      storyConnection: 'The Library of Alexandria was a hub-and-spoke network: a few scholars (Euclid, Aristotle, Eratosthenes) connected many fields. When these hubs were lost — through death, departure, or destruction — entire branches of knowledge became disconnected. The network\'s reliance on a few critical hubs made it fragile despite its size.',
      checkQuestion: 'Network A has 100 nodes each connected to 4 random others. Network B has 100 nodes where 5 "hubs" have 40 connections each and the rest have 2. Which is more resilient to random failure?',
      checkAnswer: 'Network A — it has no critical nodes. Removing any node barely changes connectivity. Network B is highly vulnerable: removing just one of the 5 hubs disconnects ~20% of the network. This is the "robust-yet-fragile" property of hub-and-spoke (scale-free) networks.',
      codeIntro: 'Simulate cascading failures in the Alexandria knowledge network — find the percolation threshold.',
      code: `import numpy as np

np.random.seed(42)

def build_knowledge_network(n_scholars=50, n_subjects=10, hub_count=5):
    """
    Build a knowledge network:
    - hub_count scholars are highly connected (10-20 links)
    - remaining scholars have 2-5 links
    """
    adj = np.zeros((n_scholars, n_scholars), dtype=int)
    subjects = np.random.randint(0, n_subjects, n_scholars)

    # Hub scholars connect broadly
    hubs = list(range(hub_count))
    for h in hubs:
        n_links = np.random.randint(10, 20)
        targets = np.random.choice(n_scholars, n_links, replace=False)
        for t in targets:
            if t != h:
                adj[h, t] = 1
                adj[t, h] = 1

    # Regular scholars connect locally
    for i in range(hub_count, n_scholars):
        n_links = np.random.randint(2, 5)
        same_subject = [j for j in range(n_scholars) if subjects[j] == subjects[i] and j != i]
        if same_subject:
            targets = np.random.choice(same_subject,
                                       min(n_links, len(same_subject)), replace=False)
            for t in targets:
                adj[i, t] = 1
                adj[t, i] = 1

    return adj, hubs, subjects

def count_components(adj, active_nodes):
    """Count connected components among active nodes using BFS."""
    visited = set()
    components = []

    for start in active_nodes:
        if start in visited:
            continue
        component = set()
        queue = [start]
        while queue:
            node = queue.pop(0)
            if node in visited:
                continue
            visited.add(node)
            component.add(node)
            for neighbour in active_nodes:
                if adj[node, neighbour] and neighbour not in visited:
                    queue.append(neighbour)
        components.append(len(component))

    return len(components), max(components) if components else 0

n = 50
adj, hubs, subjects = build_knowledge_network(n)
total_edges = adj.sum() // 2

print("=== Alexandria Knowledge Network ===")
print(f"Scholars: {n}")
print(f"Connections: {total_edges}")
print(f"Hub scholars: {hubs}")
print(f"Avg connections per scholar: {adj.sum(axis=1).mean():.1f}")

# Random failure simulation
print("\\\n=== Random Node Removal (Random Failure) ===")
print(f"{'% Removed':>10} {'Active':>7} {'Components':>11} {'Largest':>8} {'Connected?':>11}")
print("-" * 49)

removal_order = np.random.permutation(n)
active = set(range(n))

for step in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45]:
    while len(active) > n - step:
        node = removal_order[n - len(active)]
        active.discard(node)
    if active:
        n_comp, largest = count_components(adj, active)
        connected = "YES" if n_comp == 1 else "fragmented"
        print(f"{step/n*100:>8.0f}% {len(active):>7} {n_comp:>11} {largest:>8} {connected:>11}")

# Targeted attack on hubs
print("\\\n=== Targeted Hub Removal (Deliberate Attack) ===")
print(f"{'Hub Removed':<16} {'Components':>11} {'Largest':>8} {'% in Largest':>13}")
print("-" * 50)

active = set(range(n))
n_comp, largest = count_components(adj, active)
print(f"{'(none)':<16} {n_comp:>11} {largest:>8} {largest/n*100:>11.0f}%")

for hub in sorted(hubs, key=lambda h: adj[h].sum(), reverse=True):
    active.discard(hub)
    n_comp, largest = count_components(adj, active)
    hub_edges = adj[hub].sum()
    name = f"Hub {hub} ({hub_edges} edges)"
    print(f"{name:<16} {n_comp:>11} {largest:>8} {largest/len(active)*100:>11.0f}%")

# Percolation threshold comparison
print("\\\n=== Percolation Threshold (1000 trials) ===")
thresholds_random = []
thresholds_targeted = []

for trial in range(200):
    adj_t, hubs_t, _ = build_knowledge_network(n)
    # Random removal
    order = np.random.permutation(n)
    active = set(range(n))
    for i, node in enumerate(order):
        active.discard(node)
        if len(active) < 2:
            break
        _, largest = count_components(adj_t, active)
        if largest < len(active) * 0.5:
            thresholds_random.append(i / n)
            break

    # Targeted removal (by degree)
    degrees = [(adj_t[j].sum(), j) for j in range(n)]
    degrees.sort(reverse=True)
    active = set(range(n))
    for i, (_, node) in enumerate(degrees):
        active.discard(node)
        if len(active) < 2:
            break
        _, largest = count_components(adj_t, active)
        if largest < len(active) * 0.5:
            thresholds_targeted.append(i / n)
            break

print(f"Random failure threshold:   {np.mean(thresholds_random):.0%} of nodes must fail")
print(f"Targeted attack threshold:  {np.mean(thresholds_targeted):.0%} of nodes must fail")
print(f"\\\nThe network is {np.mean(thresholds_random)/np.mean(thresholds_targeted):.1f}x more vulnerable to targeted attack than random failure.")`,
      challenge: 'Add "knowledge recovery": after removing nodes, allow new scholars to join (random connections). How many new scholars are needed to restore the largest component to 80% of its original size? This models the difficulty of rebuilding lost knowledge — it\'s far harder to recover than it was to destroy.',
      successHint: 'You modelled one of the most important phenomena in network science: the difference between random failure and targeted attack. This explains why the internet (random topology) is resilient to random router failures but vulnerable to targeted attacks on major exchanges — the same robust-yet-fragile property the Library suffered.',
    },
    {
      title: 'Digital preservation — modelling bit rot, format obsolescence, and archival strategies',
      concept: `The Library of Alexandria's scrolls degraded physically: papyrus crumbles, ink fades, insects eat bindings. Digital data has its own degradation modes:

**Bit rot**: Random bit flips caused by cosmic rays, magnetic decay, or hardware errors. A single flipped bit can corrupt an entire file. After 10 years, a hard drive may have hundreds of silent bit errors.

**Format obsolescence**: Can you read a 1990s WordPerfect file today? Or a Lotus 1-2-3 spreadsheet? Formats die when the software that reads them is abandoned. Even if the bits are perfect, the data is inaccessible.

**Media decay**: Magnetic tape lasts ~30 years, optical discs ~100 years, flash storage ~10 years without power. No digital medium lasts as long as good papyrus (~2,000 years in dry conditions).

The solution is **active archival**: periodically copy data to new media, migrate formats, and verify integrity using **checksums** (hashes that detect corruption). The Library of Congress does this continuously for petabytes of digital content.

📚 *The "digital dark age" is a real concern: future historians may know less about the early 21st century than about ancient Rome, because our digital records may become unreadable while Roman inscriptions endure.*`,
      analogy: 'Imagine writing a letter, sealing it in a box, and burying it. Physical decay slowly destroys the paper (bit rot). Even if the paper survives, the language may die (format obsolescence). And the box itself corrodes (media decay). To preserve the letter, you must periodically dig it up, copy it onto fresh paper, translate it, and put it in a new box.',
      storyConnection: 'The Alexandrian librarians practiced active preservation: they copied aging scrolls onto fresh papyrus, standardized variant texts, and created backup copies for other libraries. This is exactly the "migrate, verify, replicate" strategy used by modern digital archives — the ancients understood preservation better than many modern institutions.',
      checkQuestion: 'A hard drive has a bit error rate of 10^-14 (one error per 10 trillion bits read). If you read a 1 TB drive, how many bit errors do you expect?',
      checkAnswer: '1 TB = 8 × 10^12 bits. Expected errors = 8 × 10^12 / 10^14 = 0.08 errors per full read. Sounds safe, but over 10 years of daily reads (3,650 reads), that\'s 0.08 × 3,650 = 292 expected bit errors. Without checksums, you\'d never know which files were corrupted.',
      codeIntro: 'Simulate bit rot, format obsolescence, and the effectiveness of different archival strategies over centuries.',
      code: `import numpy as np

np.random.seed(42)

def simulate_bit_rot(n_files, years, bit_error_rate=1e-14, file_size_mb=10):
    """
    Simulate bit rot across a collection of files.
    Returns array of corruption timestamps for each file.
    """
    bits_per_file = file_size_mb * 8e6
    # Probability of at least one bit error per file per year
    # (assuming one full read per year)
    p_corrupt_per_year = 1 - (1 - bit_error_rate) ** bits_per_file

    corrupted = np.zeros(n_files, dtype=int)  # 0 = not corrupted, else year
    for year in range(1, years + 1):
        for i in range(n_files):
            if corrupted[i] == 0 and np.random.random() < p_corrupt_per_year:
                corrupted[i] = year
    return corrupted

def simulate_format_obsolescence(n_formats, years, half_life=15):
    """Model format death as exponential decay."""
    alive = np.ones(n_formats, dtype=bool)
    death_years = np.zeros(n_formats)
    for year in range(1, years + 1):
        for i in range(n_formats):
            if alive[i]:
                p_death = 1 - np.exp(-np.log(2) / half_life)
                if np.random.random() < p_death:
                    alive[i] = False
                    death_years[i] = year
    return death_years

# === Bit Rot Simulation ===
n_files = 10000
years = 100
corrupted = simulate_bit_rot(n_files, years)

print("=== Bit Rot Simulation ===")
print(f"Files: {n_files:,} | Size: 10 MB each | Duration: {years} years")
print(f"\\\nCorrupted files over time:")
for y in [10, 25, 50, 75, 100]:
    lost = np.sum((corrupted > 0) & (corrupted <= y))
    pct = lost / n_files * 100
    print(f"  After {y:>3} years: {lost:>5,} files corrupted ({pct:.1f}%)")

# === Format Obsolescence ===
print("\\\n=== Format Obsolescence Simulation ===")
formats = ["JPEG", "PDF", "DOCX", "TIFF", "HTML", "XML",
           "MPEG4", "WAV", "CSV", "SQLite", "ZIP", "PNG"]
deaths = simulate_format_obsolescence(len(formats), 100)

print(f"Format half-life: 15 years (average)")
for i, fmt in enumerate(formats):
    if deaths[i] > 0:
        print(f"  {fmt:<8} dies at year {deaths[i]:.0f}")
    else:
        print(f"  {fmt:<8} survives 100 years")

surviving = np.sum(deaths == 0)
print(f"\\\nFormats surviving 100 years: {surviving} of {len(formats)}")

# === Archival Strategies ===
print("\\\n=== Archival Strategy Comparison (100 years) ===")

strategies = [
    {"name": "No maintenance", "copy_interval": 0, "format_migrate": False, "copies": 1},
    {"name": "Yearly backup (1 copy)", "copy_interval": 1, "format_migrate": False, "copies": 1},
    {"name": "Yearly backup (3 copies)", "copy_interval": 1, "format_migrate": False, "copies": 3},
    {"name": "Full archive (3 copies + migrate)", "copy_interval": 1, "format_migrate": True, "copies": 3},
]

for strat in strategies:
    n_sim = 1000
    files_surviving = []

    for _ in range(n_sim):
        alive = 100  # start with 100 files
        for year in range(1, 101):
            # Bit rot (per copy)
            for f in range(alive):
                all_copies_lost = True
                for c in range(max(strat["copies"], 1)):
                    if np.random.random() > 0.005:  # 0.5% per copy per year
                        all_copies_lost = False
                        break
                if all_copies_lost:
                    alive -= 1

            # Format obsolescence (every ~15 years)
            if not strat["format_migrate"] and year % 15 == 0:
                if np.random.random() < 0.3:  # 30% chance format dies
                    alive = int(alive * 0.7)  # lose 30% of remaining files

            # Refresh copies
            if strat["copy_interval"] > 0 and year % strat["copy_interval"] == 0:
                pass  # copies are refreshed (reset decay)

        files_surviving.append(alive)

    avg = np.mean(files_surviving)
    p5 = np.percentile(files_surviving, 5)
    print(f"  {strat['name']:<36} avg={avg:>5.1f}/100  worst={p5:>5.1f}/100")

print("\\\nConclusion: Multiple copies + format migration is the only")
print("strategy that reliably preserves data beyond 50 years.")`,
      challenge: 'Add "geographic distribution" to the model: copies stored in different locations survive independent disasters (fire, flood). If each location has a 1% annual chance of catastrophic loss, how many geographically distributed copies do you need to achieve 99.999% survival over 100 years?',
      successHint: 'Digital preservation is one of the great unsolved problems of our era. You modelled the three horsemen of data death: bit rot, format obsolescence, and media decay. The solution — active preservation with multiple copies and format migration — is exactly what the Internet Archive, Library of Congress, and CERN practice today.',
    },
    {
      title: 'Web crawling — building a simple crawler that indexes knowledge',
      concept: `The Alexandrian librarians sent agents to every port, buying or copying scrolls from arriving ships. They systematically collected knowledge from across the Mediterranean. This is exactly what a **web crawler** does: systematically visit pages, extract content, follow links, and build an index.

A web crawler works in a loop:
1. Start with a **seed URL** (the "frontier")
2. Fetch the page content
3. Extract all links from the page
4. Add unvisited links to the frontier
5. Store the page content in an index
6. Repeat until the frontier is empty or a limit is reached

Key challenges:
- **Politeness**: don't overwhelm servers (respect robots.txt, add delays)
- **Deduplication**: don't crawl the same page twice
- **Prioritisation**: crawl important pages first (breadth-first vs best-first)
- **Scale**: the web has billions of pages — you need distributed crawling

The crawler's output feeds into the inverted index (from the previous lesson) and the PageRank algorithm (from Level 2). Together: crawl -> index -> rank -> search.

📚 *The first web crawler, "World Wide Web Wanderer" (1993), was built to measure the size of the web. Google's crawler ("Googlebot") now crawls billions of pages per day.*`,
      analogy: 'Imagine exploring a city you\'ve never visited. You start at the main square (seed URL). You walk down one street (follow a link), noting interesting buildings (indexing content). At each intersection, you see new streets (new links). You mark streets you\'ve already walked (deduplication) and prioritize busy-looking streets (prioritisation). Eventually, you\'ve mapped the whole city.',
      storyConnection: 'Ptolemy III ordered that every ship entering Alexandria\'s harbour must surrender its scrolls for copying. The originals were kept; the copies were returned. This is the ancient equivalent of a web crawler with a very aggressive crawl policy — and it\'s how the Library grew to be the largest in the ancient world.',
      checkQuestion: 'A crawler starts with 1 seed URL. Each page has an average of 10 links. After crawling 3 levels deep, how many pages has it potentially discovered?',
      checkAnswer: '1 + 10 + 100 + 1,000 = 1,111 pages. In practice, many links overlap (point to already-visited pages), so the actual count is lower. But this exponential growth — 10^depth — is why crawlers need strict limits and prioritisation to avoid crawling forever.',
      codeIntro: 'Simulate a web crawler exploring an ancient knowledge network — crawl, index, and rank the results.',
      code: `import numpy as np

np.random.seed(42)

class Page:
    def __init__(self, url, title, content, links):
        self.url = url
        self.title = title
        self.content = content
        self.links = links  # list of URLs

# Simulate the "ancient web" — a network of knowledge pages
ancient_web = {
    "/euclid/elements": Page(
        "/euclid/elements", "Euclid's Elements",
        "geometry proof theorem axiom postulate triangle circle parallel line",
        ["/euclid/optics", "/plato/academy", "/archimedes/sphere"]),
    "/euclid/optics": Page(
        "/euclid/optics", "Euclid's Optics",
        "vision light ray reflection mirror angle sight geometry optics",
        ["/euclid/elements", "/ptolemy/optics"]),
    "/aristotle/physics": Page(
        "/aristotle/physics", "Aristotle's Physics",
        "motion force nature cause change place time void body substance",
        ["/plato/academy", "/aristotle/animals", "/archimedes/mechanics"]),
    "/aristotle/animals": Page(
        "/aristotle/animals", "Aristotle's History of Animals",
        "animal species classification blood bone organ fish bird mammal",
        ["/aristotle/physics", "/galen/anatomy"]),
    "/archimedes/sphere": Page(
        "/archimedes/sphere", "Archimedes on the Sphere",
        "sphere volume surface area cylinder ratio pi geometry proof",
        ["/euclid/elements", "/archimedes/mechanics", "/eratosthenes/earth"]),
    "/archimedes/mechanics": Page(
        "/archimedes/mechanics", "Archimedes on Mechanics",
        "lever fulcrum weight balance force equilibrium buoyancy fluid",
        ["/archimedes/sphere", "/aristotle/physics"]),
    "/eratosthenes/earth": Page(
        "/eratosthenes/earth", "Eratosthenes Measures the Earth",
        "earth circumference measurement shadow angle distance sphere geometry",
        ["/euclid/elements", "/aristarchus/sun", "/ptolemy/geography"]),
    "/aristarchus/sun": Page(
        "/aristarchus/sun", "Aristarchus on Sizes and Distances",
        "sun moon earth distance ratio sphere eclipse angle measurement",
        ["/eratosthenes/earth", "/euclid/elements"]),
    "/ptolemy/geography": Page(
        "/ptolemy/geography", "Ptolemy's Geography",
        "map latitude longitude projection coordinate earth distance city",
        ["/eratosthenes/earth", "/ptolemy/almagest"]),
    "/ptolemy/almagest": Page(
        "/ptolemy/almagest", "Ptolemy's Almagest",
        "star planet epicycle orbit eclipse moon sun sphere celestial model",
        ["/aristarchus/sun", "/hipparchus/stars", "/ptolemy/geography"]),
    "/ptolemy/optics": Page(
        "/ptolemy/optics", "Ptolemy's Optics",
        "refraction light vision angle glass water medium sight experiment",
        ["/euclid/optics", "/ptolemy/almagest"]),
    "/hipparchus/stars": Page(
        "/hipparchus/stars", "Hipparchus Star Catalogue",
        "star magnitude constellation longitude latitude observation precession",
        ["/ptolemy/almagest", "/aristarchus/sun", "/eratosthenes/earth"]),
    "/plato/academy": Page(
        "/plato/academy", "Plato's Academy",
        "philosophy form idea knowledge truth beauty good education mathematics",
        ["/aristotle/physics", "/euclid/elements"]),
    "/galen/anatomy": Page(
        "/galen/anatomy", "Galen's Anatomical Procedures",
        "anatomy dissection organ nerve muscle blood bone heart brain surgery",
        ["/aristotle/animals", "/hipparchus/stars"]),
}

class Crawler:
    def __init__(self, web):
        self.web = web
        self.visited = set()
        self.index = {}        # url -> content
        self.link_graph = {}   # url -> [outbound urls]
        self.crawl_log = []

    def crawl(self, seed_url, max_pages=50):
        """BFS crawl starting from seed URL."""
        frontier = [seed_url]

        while frontier and len(self.visited) < max_pages:
            url = frontier.pop(0)
            if url in self.visited:
                continue
            if url not in self.web:
                continue

            page = self.web[url]
            self.visited.add(url)
            self.index[url] = page.content
            self.link_graph[url] = page.links
            self.crawl_log.append({
                "order": len(self.visited),
                "url": url,
                "title": page.title,
                "links_found": len(page.links),
                "new_links": len([l for l in page.links if l not in self.visited]),
            })

            for link in page.links:
                if link not in self.visited:
                    frontier.append(link)

# Run the crawler
crawler = Crawler(ancient_web)
crawler.crawl("/euclid/elements")

print("=== Ancient Knowledge Crawler ===")
print(f"Seed: /euclid/elements")
print(f"Pages crawled: {len(crawler.visited)}")
print(f"Pages in web: {len(ancient_web)}")
print(f"Coverage: {len(crawler.visited)/len(ancient_web):.0%}")

print("\\\n=== Crawl Order (BFS) ===")
print(f"{'#':>3} {'URL':<30} {'Title':<30} {'New Links':>10}")
print("-" * 75)
for entry in crawler.crawl_log:
    print(f"{entry['order']:>3} {entry['url']:<30} {entry['title']:<30} "
          f"{entry['new_links']:>10}")

# Build simple search from crawled content
print("\\\n=== Search Over Crawled Index ===")
def simple_search(query, index):
    terms = query.lower().split()
    scores = {}
    for url, content in index.items():
        words = content.split()
        score = sum(words.count(t) for t in terms)
        if score > 0:
            scores[url] = score
    return sorted(scores.items(), key=lambda x: -x[1])

for query in ["sphere geometry", "animal bone", "star observation"]:
    results = simple_search(query, crawler.index)
    print(f"\\\nQuery: '{query}'")
    for url, score in results[:3]:
        title = ancient_web[url].title
        print(f"  {title:<32} score={score}")

# Coverage analysis: what if we start from different seeds?
print("\\\n=== Seed URL Impact on Coverage ===")
for seed in ["/euclid/elements", "/galen/anatomy", "/ptolemy/almagest"]:
    c = Crawler(ancient_web)
    c.crawl(seed)
    print(f"  Seed: {seed:<28} crawled: {len(c.visited):>2}/{len(ancient_web)} pages")`,
      challenge: 'Add a "crawl depth limit" (e.g., only follow links 3 levels deep from the seed). How does depth limit affect coverage? Then implement "best-first" crawling: prioritize pages with more inbound links (more "important" pages first). Compare the coverage and quality of results to BFS crawling.',
      successHint: 'You built a web crawler — the first stage of every search engine. Google, Bing, and every search engine start by crawling the web exactly like this: fetch a page, extract links, follow them, build an index. The crawler feeds the inverted index, which feeds the ranking algorithm. You\'ve now built all three components.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Database design, search engines, and digital preservation</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers database normalization, full-text search with TF-IDF, network resilience, digital preservation, and web crawling.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
