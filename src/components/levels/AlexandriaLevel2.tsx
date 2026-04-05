import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function AlexandriaLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Hash tables — O(1) lookup for the Pinakes catalogue',
      concept: `The Library of Alexandria held an estimated 400,000 scrolls. Callimachus created the **Pinakes** — a 120-volume catalogue that let scholars find any scroll by subject or author. The modern equivalent is a **hash table**: a data structure that maps keys to values in **O(1) constant time**.

A hash table works by running each key through a **hash function** — a formula that converts the key (e.g. "Euclid") into an array index (e.g. 47). The value is stored at that index. To retrieve it, you hash the key again and jump directly to the right slot — no searching required.

The problem: two different keys can hash to the **same index**. This is a **collision**. There are two main strategies: **chaining** (store a linked list at each slot) and **open addressing** (probe the next empty slot). The choice of strategy and hash function determines real-world performance.

The **load factor** (items / slots) controls the trade-off: more slots = fewer collisions = faster lookup, but more wasted memory.

📚 *Every Python dictionary, JavaScript object, and database index uses hash tables. They are the single most important data structure in computer science.*`,
      analogy: 'Imagine a library with 100 shelves. Instead of searching every shelf for a book, you use a formula: take the first letter of the author\'s name, convert it to a number, and go directly to that shelf. "Euclid" -> shelf 5, "Aristotle" -> shelf 1. Occasionally two authors map to the same shelf (collision), and you need a way to handle that — but most lookups are instant.',
      storyConnection: 'Callimachus\'s Pinakes was history\'s first library catalogue — organized by subject (rhetoric, law, epic poetry, tragedy, comedy, lyric poetry, history, medicine, mathematics, natural science). Each entry listed author, title, first line, and scroll count. This is exactly a hash table: subject is the hash bucket, entries are the values.',
      checkQuestion: 'A hash table has 100 slots and 80 entries. What is the load factor? If you insert 30 more entries, what happens to collision rate?',
      checkAnswer: 'Load factor = 80/100 = 0.8 (80%). After 30 more: 110/100 = 1.1 — the table is overfull. Collision rate increases dramatically above 0.7. The table should be resized (doubled) to 200 slots, bringing the load factor back to 0.55.',
      codeIntro: 'Build a hash table from scratch — implement insertion, lookup, and collision handling for a scroll catalogue.',
      code: `import numpy as np

class ScrollHashTable:
    """Hash table for the Library of Alexandria's scroll catalogue."""

    def __init__(self, size=16):
        self.size = size
        self.slots = [[] for _ in range(size)]  # chaining
        self.count = 0

    def _hash(self, key):
        """Simple hash: sum of character codes mod table size."""
        h = 0
        for ch in key:
            h = (h * 31 + ord(ch)) % self.size
        return h

    def insert(self, key, value):
        idx = self._hash(key)
        # Check for existing key (update)
        for i, (k, v) in enumerate(self.slots[idx]):
            if k == key:
                self.slots[idx][i] = (key, value)
                return
        self.slots[idx].append((key, value))
        self.count += 1

    def lookup(self, key):
        idx = self._hash(key)
        for k, v in self.slots[idx]:
            if k == key:
                return v
        return None

    def load_factor(self):
        return self.count / self.size

# Build the Alexandria catalogue
catalogue = ScrollHashTable(size=16)

scrolls = [
    ("Euclid", "Elements — 13 books of geometry and number theory"),
    ("Aristotle", "Physics — nature of motion and causality"),
    ("Homer", "Iliad — the wrath of Achilles at Troy"),
    ("Herodotus", "Histories — the Greco-Persian Wars"),
    ("Archimedes", "On Floating Bodies — principles of buoyancy"),
    ("Eratosthenes", "Geographica — measurement of the Earth"),
    ("Hipparchus", "Star catalogue — 850 stars with coordinates"),
    ("Ptolemy", "Almagest — geocentric model of the cosmos"),
    ("Galen", "On Anatomical Procedures — human dissection"),
    ("Euripides", "Medea — tragedy of betrayal and revenge"),
    ("Apollonius", "Conics — parabolas, ellipses, hyperbolas"),
    ("Aristarchus", "On the Sizes and Distances — heliocentric model"),
]

for author, work in scrolls:
    catalogue.insert(author, work)

print("=== Alexandria Scroll Catalogue (Hash Table) ===")
print(f"Table size: {catalogue.size} slots")
print(f"Entries: {catalogue.count}")
print(f"Load factor: {catalogue.load_factor():.2f}")

# Show bucket distribution
print("\\nBucket distribution:")
lengths = [len(slot) for slot in catalogue.slots]
for i, slot in enumerate(catalogue.slots):
    bar = "#" * len(slot)
    names = ", ".join(k for k, v in slot)
    print(f"  Slot {i:>2}: {bar:<6} {names}")

print(f"\\nMax chain length: {max(lengths)} (ideal = 1)")
print(f"Empty slots: {lengths.count(0)} of {catalogue.size}")

# Lookup test
print("\\n=== Lookup Tests ===")
for query in ["Euclid", "Archimedes", "Plato"]:
    result = catalogue.lookup(query)
    print(f"  lookup('{query}'): {result or 'NOT FOUND'}")

# Collision analysis for different table sizes
print("\\n=== Load Factor vs Collisions ===")
for size in [8, 16, 32, 64, 128]:
    ht = ScrollHashTable(size=size)
    for author, work in scrolls:
        ht.insert(author, work)
    chains = [len(s) for s in ht.slots]
    collisions = sum(1 for c in chains if c > 1)
    print(f"  Size {size:>3}: load={ht.load_factor():.2f}  "
          f"max_chain={max(chains)}  buckets_with_collisions={collisions}")`,
      challenge: 'Add a `resize` method that doubles the table when the load factor exceeds 0.7. All existing entries must be rehashed into the new, larger table. Test it by inserting 50 scrolls into a size-8 table — it should auto-resize multiple times.',
      successHint: 'You just built the most fundamental data structure in computing. Every database query, every dictionary lookup, every web cache, and every compiler symbol table uses hash tables. The O(1) average-case lookup is what makes modern software fast.',
    },
    {
      title: 'B-trees — indexing millions of records like a database',
      concept: `The Pinakes catalogue grew as the Library acquired more scrolls. At 400,000 entries, a flat list is too slow — even a hash table struggles when data lives on disk (scrolls on shelves). What you need is a **B-tree**: a balanced tree structure that minimises the number of "shelf visits" needed to find a record.

A B-tree of order *m* has these properties:
- Each node holds up to *m-1* keys (sorted)
- Each internal node has between *m/2* and *m* children
- All leaves are at the same depth
- Searching requires at most **log_m(n)** node visits

For a B-tree of order 100 holding 1 million records: log_100(1,000,000) = 3 levels. You find any record by visiting just **3 nodes** — compared to 20 for a binary tree or 1,000,000 for a linear scan.

This is why every modern database (PostgreSQL, MySQL, SQLite) uses B-trees for indexing. Each "node visit" is a disk read, and disk reads are 100,000x slower than memory reads — so minimising them is critical.

📚 *B-trees were invented in 1972 by Rudolf Bayer and Edward McCreight at Boeing. The "B" likely stands for "Boeing" or "balanced" — the inventors never said.*`,
      analogy: 'Think of a multi-level phone book. The top page says "A-F: page 2, G-M: page 3, N-Z: page 4." You flip to page 3 for "Homer", which says "G-I: page 7, J-L: page 8, M: page 9." Two page flips and you\'re at the right section. A B-tree works exactly like this — each level narrows the search by a factor of m.',
      storyConnection: 'The Pinakes was organized hierarchically: first by subject (10 categories), then by author (alphabetical), then by work. This three-level hierarchy is structurally identical to a B-tree of order 10 — Callimachus invented the concept 2,200 years before computer scientists formalized it.',
      checkQuestion: 'A B-tree of order 50 holds 5 million records. How many levels deep is it? How many node reads are needed to find any record?',
      checkAnswer: 'log_50(5,000,000) = log(5,000,000)/log(50) = 6.7/1.7 = 3.9, so 4 levels. Any record can be found in at most 4 disk reads — compared to ~23 for a binary tree or 5,000,000 for a linear scan.',
      codeIntro: 'Simulate B-tree indexing performance — compare lookup costs across different tree orders and dataset sizes.',
      code: `import numpy as np

def btree_depth(n_records, order):
    """Calculate the depth of a B-tree with given order and record count."""
    if n_records <= 0:
        return 0
    return int(np.ceil(np.log(n_records) / np.log(order)))

def btree_lookup_cost(depth, node_read_ms=10):
    """Cost of a lookup = depth × cost per node read."""
    return depth * node_read_ms

def linear_scan_cost(n_records, record_read_ms=0.01):
    """Average cost of linear scan = n/2 reads."""
    return n_records / 2 * record_read_ms

def binary_tree_cost(n_records, node_read_ms=10):
    """Binary tree depth = log2(n)."""
    depth = int(np.ceil(np.log2(max(n_records, 1))))
    return depth * node_read_ms

# Alexandria's growing collection
sizes = [1000, 10_000, 100_000, 400_000, 1_000_000, 10_000_000]

print("=== B-Tree vs Other Index Structures ===")
print(f"{'Records':>12} {'B-tree(100)':>14} {'B-tree(500)':>14} "
      f"{'Binary Tree':>14} {'Linear Scan':>14}")
print(f"{'':>12} {'depth / ms':>14} {'depth / ms':>14} "
      f"{'depth / ms':>14} {'avg ms':>14}")
print("-" * 70)

for n in sizes:
    d100 = btree_depth(n, 100)
    d500 = btree_depth(n, 500)
    bt = int(np.ceil(np.log2(max(n, 1))))
    lin = n / 2 * 0.01

    print(f"{n:>12,} {d100:>6}L / {btree_lookup_cost(d100):>4.0f}ms"
          f" {d500:>6}L / {btree_lookup_cost(d500):>4.0f}ms"
          f" {bt:>6}L / {binary_tree_cost(n):>4.0f}ms"
          f" {lin:>12.0f}ms")

# Space usage analysis
print("\\n=== B-Tree Space Overhead ===")
record_size_bytes = 200  # author + title + metadata
for order in [10, 50, 100, 500]:
    n = 400_000  # Alexandria's collection
    depth = btree_depth(n, order)
    # Internal nodes: approximately n / (order/2) at each level
    internal_nodes = sum(int(n / (order/2)**lvl) for lvl in range(1, depth+1))
    pointer_overhead = internal_nodes * order * 8  # 8 bytes per pointer
    total_mb = (n * record_size_bytes + pointer_overhead) / 1e6
    print(f"  Order {order:>3}: depth={depth}, ~{internal_nodes:,} internal nodes, "
          f"total size: {total_mb:.1f} MB")

# Insertion cost: splitting nodes
print("\\n=== B-Tree Node Splits During Bulk Insert ===")
for order in [10, 50, 100, 500]:
    splits = 0
    node_count = 1
    items_in_root = 0
    # Simplified split counting
    for i in range(400_000):
        items_in_root += 1
        if items_in_root >= order:
            splits += 1
            items_in_root = order // 2
    print(f"  Order {order:>3}: ~{splits:,} splits for 400,000 insertions")`,
      challenge: 'Real databases choose the B-tree order based on disk page size (typically 4 KB or 8 KB). If each key is 50 bytes and each pointer is 8 bytes, how many keys fit in a 4 KB page? That gives you the optimal order. Calculate it and compare lookup depth to order-100.',
      successHint: 'B-trees are the backbone of every database on Earth. When you run a SQL query with a WHERE clause, the database uses a B-tree index to find matching rows in logarithmic time. Understanding B-trees is understanding how databases actually work under the hood.',
    },
    {
      title: 'Graph algorithms — PageRank on the knowledge network',
      concept: `The Library of Alexandria was not just a collection of scrolls — it was a **knowledge network**. Euclid cited Eudoxus. Aristotle referenced Plato. Eratosthenes built on Aristarchus. These citation links form a **directed graph** where each node is a scholar and each edge is a citation.

**PageRank** (invented by Larry Page for Google) assigns an importance score to each node based on who links to it. A scholar cited by many important scholars gets a high score. The algorithm works iteratively:

1. Start: give every node equal rank (1/N)
2. Each iteration: each node distributes its rank equally among the nodes it cites
3. Each node's new rank = sum of rank received from all nodes citing it
4. Repeat until ranks stabilize (converge)

**Betweenness centrality** measures how often a node lies on the shortest path between other nodes — identifying "bridge" scholars who connected different fields.

📚 *PageRank is an eigenvector problem: the final ranks are the principal eigenvector of the citation matrix. Google built a trillion-dollar company on this linear algebra.*`,
      analogy: 'Imagine a room of scholars. Each scholar points at the people whose work they admire. A scholar pointed at by many people is "important." But a scholar pointed at by other important scholars is even more important. PageRank captures this recursive definition of importance — it\'s reputation by association.',
      storyConnection: 'Eratosthenes, the Library\'s third head librarian, was called "Beta" — second-best in every field. But his betweenness centrality would have been the highest: he connected mathematics (Euclid), astronomy (Aristarchus), geography (his own field), and poetry. He was the ultimate bridge scholar.',
      checkQuestion: 'Scholar A is cited by 10 obscure scholars. Scholar B is cited by 3 highly-cited scholars. Who has higher PageRank?',
      checkAnswer: 'Scholar B — because the 3 scholars citing B have high PageRank themselves, so they pass more "rank" to B. PageRank is not about quantity of citations but quality. This is why Google uses PageRank, not just link counting — a link from Wikipedia matters more than a link from a spam site.',
      codeIntro: 'Build an Alexandria citation network and compute PageRank and betweenness centrality.',
      code: `import numpy as np

# Alexandria's knowledge network (simplified)
scholars = [
    "Euclid", "Aristotle", "Plato", "Eratosthenes", "Archimedes",
    "Hipparchus", "Aristarchus", "Homer", "Herodotus", "Ptolemy",
    "Galen", "Apollonius", "Euripides", "Callimachus",
]
n = len(scholars)
idx = {name: i for i, name in enumerate(scholars)}

# Citation edges: (citer, cited) — "citer references cited"
citations = [
    ("Euclid", "Plato"), ("Euclid", "Aristotle"),
    ("Aristotle", "Plato"), ("Aristotle", "Homer"),
    ("Eratosthenes", "Euclid"), ("Eratosthenes", "Aristarchus"),
    ("Eratosthenes", "Homer"), ("Eratosthenes", "Aristotle"),
    ("Archimedes", "Euclid"), ("Archimedes", "Aristotle"),
    ("Hipparchus", "Eratosthenes"), ("Hipparchus", "Aristarchus"),
    ("Aristarchus", "Plato"), ("Aristarchus", "Euclid"),
    ("Ptolemy", "Hipparchus"), ("Ptolemy", "Aristotle"),
    ("Ptolemy", "Euclid"), ("Ptolemy", "Eratosthenes"),
    ("Galen", "Aristotle"), ("Galen", "Hipparchus"),
    ("Apollonius", "Euclid"), ("Apollonius", "Archimedes"),
    ("Callimachus", "Homer"), ("Callimachus", "Euripides"),
    ("Herodotus", "Homer"),
]

# Build adjacency matrix (columns cite rows)
adj = np.zeros((n, n))
for citer, cited in citations:
    adj[idx[cited], idx[citer]] = 1  # cited receives from citer

# Normalize columns (each citer distributes rank equally)
col_sums = adj.sum(axis=0)
col_sums[col_sums == 0] = 1  # avoid division by zero
M = adj / col_sums

# PageRank iteration
damping = 0.85
rank = np.ones(n) / n

print("=== PageRank Iteration ===")
for iteration in range(30):
    new_rank = (1 - damping) / n + damping * M @ rank
    diff = np.abs(new_rank - rank).sum()
    rank = new_rank
    if iteration < 5 or diff < 1e-6:
        if iteration < 5:
            top = scholars[np.argmax(rank)]
            print(f"  Iter {iteration+1:>2}: convergence={diff:.6f}  top={top}")
    if diff < 1e-8:
        print(f"  Converged at iteration {iteration+1}")
        break

# Final rankings
print("\\n=== PageRank Rankings (Alexandria Knowledge Network) ===")
ranked = sorted(range(n), key=lambda i: rank[i], reverse=True)
for pos, i in enumerate(ranked):
    in_citations = int(adj[i].sum())
    out_citations = int(adj[:, i].sum())
    bar = "#" * int(rank[i] * 100)
    print(f"  {pos+1:>2}. {scholars[i]:<16} rank={rank[i]:.4f}  "
          f"cited_by={in_citations}  cites={out_citations}  {bar}")

# Betweenness centrality (simplified: count shortest paths through each node)
print("\\n=== Betweenness Centrality (Bridge Scholars) ===")
# Floyd-Warshall for all-pairs shortest paths
dist = np.full((n, n), np.inf)
np.fill_diagonal(dist, 0)
next_hop = np.full((n, n), -1, dtype=int)
for citer, cited in citations:
    i, j = idx[citer], idx[cited]
    dist[i, j] = 1
    dist[j, i] = 1  # undirected for betweenness
    next_hop[i, j] = j
    next_hop[j, i] = i

for k in range(n):
    for i in range(n):
        for j in range(n):
            if dist[i, k] + dist[k, j] < dist[i, j]:
                dist[i, j] = dist[i, k] + dist[k, j]

# Count paths through each node
betweenness = np.zeros(n)
for i in range(n):
    for j in range(n):
        if i == j:
            continue
        for k in range(n):
            if k == i or k == j:
                continue
            if dist[i, j] < np.inf:
                if abs(dist[i, k] + dist[k, j] - dist[i, j]) < 0.001:
                    betweenness[k] += 1

# Normalize
betweenness /= max(betweenness.max(), 1)
bc_ranked = sorted(range(n), key=lambda i: betweenness[i], reverse=True)
for pos, i in enumerate(bc_ranked[:7]):
    print(f"  {pos+1}. {scholars[i]:<16} betweenness={betweenness[i]:.3f}")`,
      challenge: 'Remove Eratosthenes from the network (simulating the loss of a "bridge" scholar). How does the network connectivity change? Which pairs of scholars can no longer reach each other? This models how the destruction of the Library severed connections between fields of knowledge.',
      successHint: 'PageRank and centrality measures are the foundation of network science — used to rank web pages (Google), identify key people in social networks (Facebook), find critical infrastructure in power grids, and even predict the spread of epidemics. You just applied the same algorithms to ancient scholarship.',
    },
    {
      title: 'Information entropy — measuring the Library\'s knowledge diversity',
      concept: `How do you measure how "diverse" a library's collection is? If 90% of the scrolls are poetry and 10% are mathematics, the collection is **less diverse** than one split evenly across 10 subjects.

**Shannon entropy** quantifies this precisely:

**H = -sum(p_i × log2(p_i))** for all categories i

Where p_i is the fraction of scrolls in category i. Key properties:
- Maximum entropy = log2(N) when all categories are equally represented
- Minimum entropy = 0 when all scrolls are in one category
- Adding a new category always increases maximum possible entropy

Entropy measures **information content** — a diverse library contains more information (higher entropy) than a homogeneous one. This connects directly to data compression: high-entropy data is hard to compress (lots of variety), low-entropy data compresses well (lots of repetition).

📚 *Claude Shannon invented information entropy in 1948 at Bell Labs. His paper "A Mathematical Theory of Communication" is considered the founding document of the information age.*`,
      analogy: 'Imagine rolling a die. A fair 6-sided die has high entropy — you can\'t predict the outcome. A loaded die that always lands on 6 has zero entropy — the outcome is certain. A library with scrolls spread across many subjects is like a fair die: high entropy, high information content. A library with only poetry is like the loaded die: predictable and low-entropy.',
      storyConnection: 'The Library of Alexandria was remarkable for its diversity: mathematics, astronomy, medicine, philosophy, poetry, history, geography, mechanics, and more. This high entropy — many subjects, roughly balanced — is what made it uniquely valuable. Losing it didn\'t just destroy scrolls; it destroyed the diversity of human knowledge in one place.',
      checkQuestion: 'Library A has 100 scrolls: 50 poetry, 50 mathematics. Library B has 100 scrolls: 99 poetry, 1 mathematics. Which has higher entropy?',
      checkAnswer: 'Library A: H = -2 × (0.5 × log2(0.5)) = -2 × (-0.5) = 1.0 bit. Library B: H = -(0.99 × log2(0.99) + 0.01 × log2(0.01)) = 0.081 bits. Library A has 12x higher entropy — it\'s far more diverse and contains more "information" per scroll.',
      codeIntro: 'Calculate Shannon entropy for the Alexandria collection and model how diversity changes as scrolls are lost.',
      code: `import numpy as np

def shannon_entropy(counts):
    """Calculate Shannon entropy in bits from category counts."""
    total = sum(counts)
    if total == 0:
        return 0
    probs = np.array([c / total for c in counts if c > 0])
    return -np.sum(probs * np.log2(probs))

# Alexandria's collection by subject (estimated scroll counts)
subjects = {
    "Mathematics":     35000,
    "Astronomy":       28000,
    "Medicine":        32000,
    "Philosophy":      45000,
    "Poetry & Drama":  55000,
    "History":         40000,
    "Geography":       20000,
    "Mechanics":       15000,
    "Natural Science": 25000,
    "Law & Rhetoric":  30000,
    "Music Theory":    10000,
    "Agriculture":     12000,
}

counts = list(subjects.values())
total = sum(counts)
entropy = shannon_entropy(counts)
max_entropy = np.log2(len(subjects))

print("=== Library of Alexandria — Information Entropy ===")
print(f"Total scrolls: {total:,}")
print(f"Subject categories: {len(subjects)}")
print(f"Shannon entropy: {entropy:.3f} bits")
print(f"Maximum possible: {max_entropy:.3f} bits")
print(f"Diversity ratio: {entropy / max_entropy:.1%}")
print()

print("Subject distribution:")
for subj, count in sorted(subjects.items(), key=lambda x: -x[1]):
    pct = count / total * 100
    bar = "#" * int(pct * 2)
    print(f"  {subj:<18} {count:>6,} ({pct:>4.1f}%) {bar}")

# Model progressive destruction
print("\\n=== Entropy During Progressive Destruction ===")
print("(What if scrolls are lost category by category?)")

destruction_order = [
    "Music Theory", "Agriculture", "Mechanics", "Geography",
    "Natural Science", "Astronomy", "Mathematics", "Medicine",
    "Law & Rhetoric", "History", "Philosophy", "Poetry & Drama",
]

remaining = dict(subjects)
print(f"  {'Event':<30} {'Scrolls':>8} {'Entropy':>8} {'Diversity':>10}")
print(f"  {'-'*58}")
print(f"  {'Full library':<30} {total:>8,} {entropy:>8.3f} {entropy/max_entropy:>9.1%}")

for subj in destruction_order:
    lost = remaining.pop(subj)
    if not remaining:
        break
    new_total = sum(remaining.values())
    new_entropy = shannon_entropy(list(remaining.values()))
    new_max = np.log2(len(remaining)) if len(remaining) > 1 else 0.001
    print(f"  Lost {subj:<24} {new_total:>8,} {new_entropy:>8.3f} {new_entropy/new_max:>9.1%}")

# Compare to other ancient libraries
print("\\n=== Comparative Library Entropy ===")
libraries = {
    "Alexandria (peak)": [35000, 28000, 32000, 45000, 55000, 40000, 20000, 15000, 25000, 30000],
    "Athens (Lyceum)": [15000, 5000, 3000, 40000, 20000, 10000, 2000, 1000, 5000, 8000],
    "Pergamon": [8000, 5000, 6000, 12000, 15000, 10000, 3000, 2000, 4000, 5000],
    "Rome (Palatine)": [5000, 2000, 3000, 8000, 25000, 15000, 1000, 500, 2000, 12000],
}

for name, dist in libraries.items():
    h = shannon_entropy(dist)
    mx = np.log2(len(dist))
    print(f"  {name:<22} H={h:.3f} bits  diversity={h/mx:.1%}  scrolls={sum(dist):,}")`,
      challenge: 'Model "targeted destruction" vs "random destruction." If an invader burns scrolls randomly, entropy stays roughly constant (proportional reduction). If they target specific subjects (e.g., burn all science), entropy drops faster. Simulate both scenarios for 50% destruction and compare the entropy loss.',
      successHint: 'Shannon entropy is the foundation of information theory — the field that enables digital communication, data compression, cryptography, and machine learning. You just used it to quantify something that historians describe qualitatively: the Library\'s unique value lay in its diversity, and its destruction was catastrophic because it eliminated entire branches of knowledge.',
    },
    {
      title: 'Compression — storing more knowledge in less space with Huffman coding',
      concept: `The Library of Alexandria ran out of space. Scrolls were stored in overflow buildings across the city. The modern solution to this problem is **data compression** — representing the same information in fewer bits.

**Huffman coding** is the optimal prefix-free code: it assigns shorter codes to more frequent symbols and longer codes to rare symbols. The algorithm:

1. Count the frequency of each symbol
2. Build a priority queue (min-heap) of single-symbol nodes
3. Repeatedly: remove the two lowest-frequency nodes, create a parent node with their combined frequency, insert it back
4. The resulting binary tree defines the code: left = 0, right = 1

The key insight: if the letter 'E' appears 13% of the time and 'Z' appears 0.07%, Huffman assigns ~3 bits to 'E' and ~11 bits to 'Z' — saving space overall compared to a fixed 8 bits per character.

The theoretical limit is Shannon entropy: H bits per symbol on average. Huffman coding achieves within 1 bit of this limit.

📚 *David Huffman invented this algorithm in 1952 as a term paper for his MIT class. His professor had offered to excuse students from the final exam if they could find an optimal coding scheme. Huffman did.*`,
      analogy: 'Imagine Morse code: E is a single dot (.), T is a single dash (-), but Q is dash-dash-dot-dash (--.-). Common letters get short codes. Huffman coding does the same thing systematically and optimally — it finds the provably shortest possible code for any given frequency distribution.',
      storyConnection: 'The Alexandrian librarians faced a physical version of the compression problem: too much knowledge, not enough shelf space. They developed abbreviation systems, summary catalogues (the Pinakes), and epitomes (condensed versions of longer works). Zenodotus standardized spelling to eliminate variant copies — an ancient form of deduplication.',
      checkQuestion: 'A text has 4 symbols: A (50%), B (25%), C (15%), D (10%). What Huffman codes would you assign?',
      checkAnswer: 'A=0 (1 bit), B=10 (2 bits), C=110 (3 bits), D=111 (3 bits). Average length = 0.5×1 + 0.25×2 + 0.15×3 + 0.10×3 = 1.75 bits/symbol. Fixed-length would need 2 bits/symbol. Huffman saves 12.5% — and that savings compounds over millions of characters.',
      codeIntro: 'Build a Huffman encoder for ancient Greek text — compress scroll contents and measure the savings.',
      code: `import numpy as np

class HuffmanNode:
    def __init__(self, char=None, freq=0, left=None, right=None):
        self.char = char
        self.freq = freq
        self.left = left
        self.right = right

def build_huffman_tree(freq_dict):
    """Build Huffman tree from frequency dictionary."""
    nodes = [HuffmanNode(ch, f) for ch, f in freq_dict.items()]
    while len(nodes) > 1:
        nodes.sort(key=lambda n: n.freq)
        left = nodes.pop(0)
        right = nodes.pop(0)
        parent = HuffmanNode(freq=left.freq + right.freq,
                             left=left, right=right)
        nodes.append(parent)
    return nodes[0] if nodes else None

def get_codes(node, prefix="", codes=None):
    """Extract codes from Huffman tree."""
    if codes is None:
        codes = {}
    if node.char is not None:
        codes[node.char] = prefix or "0"
    else:
        if node.left:
            get_codes(node.left, prefix + "0", codes)
        if node.right:
            get_codes(node.right, prefix + "1", codes)
    return codes

# Simulate letter frequencies from an ancient Greek mathematics text
# (Euclid's Elements, approximated)
greek_freqs = {
    "alpha": 820, "iota": 780, "omicron": 710, "epsilon": 690,
    "sigma": 620, "nu": 590, "tau": 580, "eta": 480,
    "omega": 400, "rho": 380, "pi": 340, "lambda": 300,
    "mu": 280, "delta": 250, "kappa": 220, "upsilon": 200,
    "gamma": 180, "theta": 150, "phi": 120, "chi": 90,
    "beta": 80, "xi": 60, "zeta": 40, "psi": 30,
}

total_chars = sum(greek_freqs.values())
tree = build_huffman_tree(greek_freqs)
codes = get_codes(tree)

print("=== Huffman Coding for Ancient Greek Text ===")
print(f"Alphabet size: {len(greek_freqs)} symbols")
print(f"Total characters: {total_chars:,}\\n")

# Fixed-length comparison
fixed_bits = int(np.ceil(np.log2(len(greek_freqs))))
print(f"Fixed-length encoding: {fixed_bits} bits per symbol")

# Huffman statistics
print(f"\\n{'Symbol':<12} {'Freq':>6} {'Prob':>6} {'Code':<16} {'Bits':>4}")
print("-" * 48)
sorted_syms = sorted(greek_freqs.items(), key=lambda x: -x[1])
for sym, freq in sorted_syms:
    prob = freq / total_chars
    code = codes[sym]
    print(f"  {sym:<10} {freq:>6} {prob:>5.1%} {code:<16} {len(code):>3}")

# Average bits per symbol
avg_bits = sum(len(codes[s]) * f / total_chars
               for s, f in greek_freqs.items())
entropy = -sum((f/total_chars) * np.log2(f/total_chars)
               for f in greek_freqs.values() if f > 0)

print(f"\\n=== Compression Results ===")
print(f"Shannon entropy:       {entropy:.3f} bits/symbol (theoretical minimum)")
print(f"Huffman average:       {avg_bits:.3f} bits/symbol")
print(f"Fixed-length:          {fixed_bits:.3f} bits/symbol")
print(f"Huffman efficiency:    {entropy/avg_bits:.1%} of theoretical limit")
print(f"Compression ratio:     {avg_bits/fixed_bits:.1%} of fixed-length")
print(f"Space saved:           {(1 - avg_bits/fixed_bits):.1%}")

# Apply to the whole library
scrolls_chars = 400_000 * 15_000  # 400k scrolls × 15k chars average
fixed_gb = scrolls_chars * fixed_bits / 8 / 1e9
huffman_gb = scrolls_chars * avg_bits / 8 / 1e9
print(f"\\n=== Full Library Storage ===")
print(f"Total characters: {scrolls_chars:,.0f}")
print(f"Fixed encoding:  {fixed_gb:.2f} GB")
print(f"Huffman encoding: {huffman_gb:.2f} GB")
print(f"Space saved: {fixed_gb - huffman_gb:.2f} GB ({(1-huffman_gb/fixed_gb):.0%})")`,
      challenge: 'Implement a simple decoder: given a Huffman-encoded bitstring and the code table, decode it back to the original symbols. Verify that encode -> decode is lossless. Then try compressing a "uniform" text (all letters equally frequent) — how much does Huffman help? (Answer: it doesn\'t — uniform distributions are already at maximum entropy.)',
      successHint: 'Huffman coding is used inside ZIP, GZIP, PNG, JPEG, and MP3. Every file you\'ve ever downloaded was compressed using algorithms descended from Huffman\'s 1952 term paper. You now understand the core principle: assign short codes to common symbols and long codes to rare ones — it\'s optimal, and Shannon\'s entropy proves it.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Data structures and algorithms for knowledge management</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 covers hash tables, B-trees, graph algorithms, information entropy, and compression — the computer science behind organising the world's knowledge.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
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
