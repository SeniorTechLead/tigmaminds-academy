import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function AlexandriaLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Linear search vs indexed search — why catalogues matter',
      concept: `Imagine searching for a book in a pile of 400,000 unsorted scrolls. On average, you'd need to check **200,000** before finding the right one. At 10 seconds per scroll, that's **23 days** of non-stop searching.

Now imagine the scrolls are organized by category and alphabetically by author — like Callimachus's Pinakes catalogue. You look up the category, find the author's section, and go directly to the right shelf. Total search: perhaps **30 seconds**.

This is the difference between **linear search** (check every item, one by one, until you find it) and **indexed search** (use a guide to jump directly to the right location).

In computer science, we say linear search is **O(n)** — the time grows proportionally with the collection size. Indexed search (using a sorted index) is **O(log n)** — the time grows with the *logarithm* of the collection size. For 400,000 items: linear takes 400,000 steps; binary search on a sorted index takes just **19 steps** (log₂ 400,000 ≈ 18.6).

📚 *Big-O notation (O(n), O(log n)) describes how an algorithm's time grows with input size. O(n) = linear growth. O(log n) = logarithmic growth (much slower = much better for search).*`,
      analogy: 'Looking for a word in a dictionary: you don\'t start at page 1 and read every word (linear search). You open to the middle, check if your word is before or after, then open to the middle of the remaining half. Each step eliminates half the dictionary. That\'s binary search — O(log n).',
      storyConnection: 'Callimachus\'s Pinakes organized the Library into categories, then alphabetically within categories. This two-level index transformed a 23-day linear search into a 30-second lookup — the same transformation that databases and search engines perform today.',
      checkQuestion: 'A library has 1,000,000 books. A linear search takes up to 1,000,000 steps. How many steps does a binary search need?',
      checkAnswer: 'log₂(1,000,000) ≈ 20 steps. That\'s the power of logarithmic search: doubling the collection adds only ONE more step. This is why Google can search billions of web pages in milliseconds — they use indexed search, not linear.',
      codeIntro: 'Compare linear search and binary search on a library of scrolls — measure the speed difference.',
      code: `import numpy as np

def linear_search(library, target):
    """Check every scroll one by one until found."""
    steps = 0
    for scroll in library:
        steps += 1
        if scroll == target:
            return steps
    return steps  # not found

def binary_search(sorted_library, target):
    """Divide in half repeatedly — requires sorted data."""
    steps = 0
    low, high = 0, len(sorted_library) - 1
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if sorted_library[mid] == target:
            return steps
        elif sorted_library[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return steps  # not found

# Create a "library" of sorted scroll IDs
library_sizes = [100, 1000, 10000, 100000, 400000]

print("=== Linear vs Binary Search ===")
print(f"{'Library Size':>14} {'Linear (avg)':>14} {'Binary':>8} {'Speedup':>10}")
print("-" * 48)

for size in library_sizes:
    library = list(range(size))
    target = size // 2  # search for middle item (average case)

    linear_steps = linear_search(library, target)
    binary_steps = binary_search(library, target)
    speedup = linear_steps / binary_steps

    print(f"{size:>14,} {linear_steps:>14,} {binary_steps:>8} {speedup:>9,.0f}×")

print()
print("At 400,000 scrolls (Library of Alexandria):")
print(f"  Linear search: ~200,000 checks (23 days at 10 sec each)")
print(f"  Binary search: ~19 checks (under 4 minutes)")
print(f"  The Pinakes catalogue turned months into minutes.")`,
      challenge: 'What if the library is NOT sorted? Can you use binary search? (No — binary search requires sorted data. Callimachus\'s alphabetical ordering was essential. Try removing the sorting and see what happens to binary search accuracy.)',
      successHint: 'You just compared two fundamental search algorithms. Linear search is O(n) — simple but slow for large data. Binary search is O(log n) — fast but requires sorted data. Every database, search engine, and file system uses indexed search. The Pinakes was the first.',
    },
    {
      title: 'Dictionaries — building a catalogue data structure',
      concept: `Callimachus organized the Library by **category** (poetry, history, law, medicine...) and within each category by **author name** (alphabetical). This is a **two-level mapping**: Category → Author → Scroll.

In Python, the natural data structure for this is a **nested dictionary**: a dictionary where each value is itself a dictionary.

\`\`\`python
library = {
    "poetry": {"Homer": ["Iliad", "Odyssey"], "Sappho": ["Fragments"]},
    "history": {"Herodotus": ["Histories"], "Thucydides": ["Peloponnesian War"]},
}
\`\`\`

To find Homer's works: \`library["poetry"]["Homer"]\` — two lookups, both instant (O(1) in a hash table). No scanning, no searching. Direct access.

📚 *A Python dictionary uses a hash table internally — it computes a number (hash) from the key and uses it as an index into an array. This makes lookup O(1) — constant time, regardless of size.*`,
      analogy: 'A phone book is a dictionary: look up the name (key), get the phone number (value). You don\'t scan every entry — you jump to the right page by first letter, then scan a few names. Python dictionaries do this automatically with hash functions — even faster than alphabetical lookup.',
      storyConnection: 'The Pinakes was organized into 120 scrolls covering all categories. Each entry included the author\'s name, birthplace, teacher, biography, and list of works with the first line of each. This is essentially a JSON-like nested data structure, 2,200 years before JSON was invented.',
      checkQuestion: 'Why is a Python dictionary lookup O(1) (constant time) regardless of the dictionary size?',
      checkAnswer: 'Because the dictionary computes a hash of the key — a number that directly indexes into the underlying array. Whether the dictionary has 10 entries or 10 million, the hash computation takes the same time, and the array lookup is instant. No scanning needed.',
      codeIntro: 'Build a Library of Alexandria catalogue as a nested Python dictionary with search functionality.',
      code: `# Build a catalogue like the Pinakes

library = {
    "Poetry": {
        "Homer": {
            "birthplace": "Ionia",
            "works": ["Iliad", "Odyssey"],
            "scrolls": 48,
        },
        "Sappho": {
            "birthplace": "Lesbos",
            "works": ["Odes", "Epithalamia", "Hymns"],
            "scrolls": 9,
        },
        "Pindar": {
            "birthplace": "Thebes",
            "works": ["Olympian Odes", "Pythian Odes"],
            "scrolls": 17,
        },
    },
    "History": {
        "Herodotus": {
            "birthplace": "Halicarnassus",
            "works": ["Histories"],
            "scrolls": 9,
        },
        "Thucydides": {
            "birthplace": "Athens",
            "works": ["History of the Peloponnesian War"],
            "scrolls": 8,
        },
    },
    "Mathematics": {
        "Euclid": {
            "birthplace": "Alexandria",
            "works": ["Elements", "Optics", "Data"],
            "scrolls": 15,
        },
        "Archimedes": {
            "birthplace": "Syracuse",
            "works": ["On Floating Bodies", "The Sand Reckoner", "On the Sphere and Cylinder"],
            "scrolls": 12,
        },
        "Eratosthenes": {
            "birthplace": "Cyrene",
            "works": ["On the Measurement of the Earth", "Geographica"],
            "scrolls": 5,
        },
    },
    "Medicine": {
        "Hippocrates": {
            "birthplace": "Kos",
            "works": ["Aphorisms", "On Airs, Waters, Places", "The Oath"],
            "scrolls": 60,
        },
    },
    "Philosophy": {
        "Aristotle": {
            "birthplace": "Stagira",
            "works": ["Physics", "Metaphysics", "Ethics", "Politics", "Poetics"],
            "scrolls": 40,
        },
        "Plato": {
            "birthplace": "Athens",
            "works": ["Republic", "Symposium", "Phaedo", "Timaeus"],
            "scrolls": 36,
        },
    },
}

# Catalogue statistics
total_scrolls = 0
total_authors = 0
for category, authors in library.items():
    cat_scrolls = sum(a["scrolls"] for a in authors.values())
    total_scrolls += cat_scrolls
    total_authors += len(authors)
    print(f"{category}: {len(authors)} authors, {cat_scrolls} scrolls")

print(f"\\nTotal: {total_authors} authors, {total_scrolls} scrolls")
print(f"(The real Library had ~400,000-700,000 scrolls)")

# Search function
def search_author(name):
    for category, authors in library.items():
        if name in authors:
            info = authors[name]
            return (f"Found in {category}: {name} of {info['birthplace']}, "
                   f"{info['scrolls']} scrolls: {', '.join(info['works'])}")
    return f"'{name}' not found in the catalogue."

print(f"\\n{search_author('Euclid')}")
print(f"{search_author('Homer')}")
print(f"{search_author('Confucius')}")`,
      challenge: 'Add a "Science" category with entries for Aristarchus (proposed heliocentric model), Hero of Alexandria (built a steam engine), and Ctesibius (invented the water clock). How many total scrolls does the expanded library have?',
      successHint: 'You built a nested dictionary — the same data structure behind every database, search index, and API. When you access library["Mathematics"]["Euclid"], Python uses hash tables for instant O(1) lookup at both levels. The Pinakes was the world\'s first hash table, implemented in papyrus.',
    },
    {
      title: 'Knowledge networks — modelling connections between texts',
      concept: `The Library of Alexandria wasn't just a collection of scrolls — it was a **network** of interconnected ideas. Euclid's *Elements* builds on Pythagoras's geometry. Aristotle's *Physics* responds to Plato's *Timaeus*. Each work references, builds on, or argues against others.

We can model this as a **graph**: each work is a **node**, and each reference between works is an **edge**. Graph theory — invented by Euler in 1736 — gives us tools to analyze these networks.

Key metrics: **degree** (how many connections a node has), **centrality** (how important a node is in the network), and **connected components** (groups of nodes that are all reachable from each other).

When a scroll is destroyed, it's not just one node that's lost — all its **edges** (connections) are lost too. The network fragments. Ideas that could have connected across centuries are lost in the gaps.

📚 *A graph in mathematics is a set of nodes (vertices) connected by edges. It's the foundation of social network analysis, web search (Google PageRank), GPS navigation, and circuit design.*`,
      analogy: 'Think of a web of friends. Each person is a node; each friendship is an edge. If one popular person moves away, you don\'t just lose that person — you lose all the connections they made between their different friend groups. The network fragmentsinto isolated clusters that no longer communicate.',
      storyConnection: 'When the Library was destroyed, it wasn\'t just the scrolls that were lost — it was the connections between them. Aristarchus\'s heliocentric theory referenced observations now lost. Hero\'s steam engine cited engineering principles now gone. The destruction didn\'t just remove books — it broke the intellectual network that could have produced further discoveries.',
      checkQuestion: 'In a network of 10 nodes where each node connects to every other, how many edges are there?',
      checkAnswer: '10 × 9 / 2 = 45 edges. (Each of the 10 nodes connects to 9 others, giving 90, but each edge connects two nodes, so divide by 2.) Removing just 3 nodes (30%) could remove up to 24 edges (53%). Damage to networks is always worse than it looks.',
      codeIntro: 'Build a knowledge network of ancient texts and simulate the effect of destruction events.',
      code: `import numpy as np

# Build a knowledge network as an adjacency dictionary
works = {
    "Euclid: Elements": ["Pythagoras: Theorems", "Aristotle: Physics", "Archimedes: On Sphere"],
    "Pythagoras: Theorems": ["Euclid: Elements", "Plato: Timaeus"],
    "Aristotle: Physics": ["Plato: Timaeus", "Euclid: Elements", "Hippocrates: On Airs"],
    "Plato: Timaeus": ["Aristotle: Physics", "Pythagoras: Theorems", "Plato: Republic"],
    "Plato: Republic": ["Plato: Timaeus", "Aristotle: Ethics"],
    "Aristotle: Ethics": ["Plato: Republic", "Aristotle: Politics"],
    "Aristotle: Politics": ["Aristotle: Ethics"],
    "Archimedes: On Sphere": ["Euclid: Elements", "Archimedes: Sand Reckoner"],
    "Archimedes: Sand Reckoner": ["Archimedes: On Sphere", "Aristarchus: Heliocentric"],
    "Aristarchus: Heliocentric": ["Archimedes: Sand Reckoner", "Euclid: Elements"],
    "Hippocrates: On Airs": ["Aristotle: Physics"],
    "Hero: Aeolipile": ["Archimedes: On Sphere", "Ctesibius: Pneumatics"],
    "Ctesibius: Pneumatics": ["Hero: Aeolipile"],
    "Eratosthenes: Earth": ["Euclid: Elements", "Aristarchus: Heliocentric"],
    "Homer: Iliad": ["Homer: Odyssey"],
    "Homer: Odyssey": ["Homer: Iliad"],
    "Herodotus: Histories": ["Homer: Iliad"],
    "Sappho: Odes": [],
}

# Calculate network statistics
def network_stats(network):
    nodes = len(network)
    edges = sum(len(connections) for connections in network.values()) // 2
    degrees = {node: len(connections) for node, connections in network.items()}
    avg_degree = np.mean(list(degrees.values()))
    most_connected = max(degrees, key=degrees.get)
    return nodes, edges, avg_degree, most_connected, degrees

nodes, edges, avg_deg, top, degrees = network_stats(works)
print("=== Library of Alexandria Knowledge Network ===")
print(f"Nodes (works): {nodes}")
print(f"Edges (references): {edges}")
print(f"Average connections per work: {avg_deg:.1f}")
print(f"Most connected: {top} ({degrees[top]} connections)")

# Simulate destruction events
print("\\n=== Simulating Destruction Events ===")

def remove_nodes(network, nodes_to_remove):
    """Remove nodes and all their connections."""
    remaining = {}
    for node, connections in network.items():
        if node not in nodes_to_remove:
            remaining[node] = [c for c in connections if c not in nodes_to_remove]
    return remaining

# Caesar's fire (48 BCE) — lose some works
fire_losses = ["Sappho: Odes", "Ctesibius: Pneumatics", "Herodotus: Histories"]
after_fire = remove_nodes(works, fire_losses)
n1, e1, a1, _, _ = network_stats(after_fire)
print(f"After Caesar's fire ({len(fire_losses)} works lost):")
print(f"  Remaining: {n1} nodes, {e1} edges (lost {nodes-n1} nodes, {edges-e1} edges)")

# Theophilus (391 CE) — lose more
serapeum_losses = ["Aristarchus: Heliocentric", "Hero: Aeolipile",
                   "Eratosthenes: Earth", "Hippocrates: On Airs"]
after_serapeum = remove_nodes(after_fire, serapeum_losses)
n2, e2, a2, _, _ = network_stats(after_serapeum)
total_lost_nodes = nodes - n2
total_lost_edges = edges - e2
print(f"After Serapeum destruction ({len(serapeum_losses)} more works lost):")
print(f"  Remaining: {n2} nodes, {e2} edges")
print(f"  Total lost: {total_lost_nodes} nodes ({total_lost_nodes/nodes*100:.0f}%), "
      f"{total_lost_edges} edges ({total_lost_edges/edges*100:.0f}%)")
print(f"  Note: {total_lost_edges/edges*100:.0f}% of connections lost from "
      f"{total_lost_nodes/nodes*100:.0f}% of nodes removed")
print(f"  → Network damage is WORSE than node loss suggests")`,
      challenge: 'Which single node, if destroyed, would cause the most damage to the network? (Calculate: for each node, remove it and count remaining edges. The node whose removal causes the greatest edge loss is the most critical.) This is "betweenness centrality" — Google uses it to rank web pages.',
      successHint: 'You built a knowledge graph — the same data structure behind Google\'s Knowledge Graph, Facebook\'s social network, and Wikipedia\'s link structure. The key insight: networks are MORE fragile than they look, because removing nodes also removes edges, fragmenting the network disproportionately.',
    },
    {
      title: 'Information entropy — quantifying lost knowledge',
      concept: `How much knowledge was lost when the Library was destroyed? We can approach this with **information theory** — the mathematics of quantifying information, invented by Claude Shannon in 1948.

**Entropy** measures the "amount of information" in a system. A system with many diverse, interconnected elements has high entropy (rich information). A system with few, isolated elements has low entropy (impoverished information).

For a knowledge network, we can define entropy based on the **distribution of connections**. A network where every node has the same number of connections has maximum entropy (most diverse). A network dominated by a few highly-connected hubs has lower entropy (less diverse, more fragile).

📚 *Shannon entropy: H = -Σ pᵢ × log₂(pᵢ), where pᵢ is the probability of state i. Maximum entropy = maximum information content = maximum uncertainty = maximum diversity.*`,
      analogy: 'A bag of 100 different-coloured marbles has high entropy — if you pull one out, you can\'t predict its colour. A bag of 100 red marbles has zero entropy — every pull is predictable. The Library, with hundreds of thousands of diverse works, had extraordinarily high entropy. Each destruction event reduced it.',
      storyConnection: 'Of the estimated 700,000 scrolls in the Library, fewer than 1% survive in any form. We know the TITLES of hundreds of lost works from references in surviving texts — we know they existed, but the information they contained is gone. This is measurable information loss.',
      checkQuestion: 'A library has 10 categories with equal numbers of books. Its entropy is log₂(10) ≈ 3.32 bits. If 6 categories are destroyed, leaving only 4, what is the new entropy?',
      checkAnswer: 'log₂(4) = 2.0 bits. Entropy dropped from 3.32 to 2.0 — a 40% reduction in information diversity. And that\'s just the category-level entropy — the loss of individual works and their connections reduces the total information far more.',
      codeIntro: 'Calculate information entropy of the ancient knowledge network before and after each destruction event.',
      code: `import numpy as np

def shannon_entropy(values):
    """Calculate Shannon entropy from a list of values."""
    total = sum(values)
    if total == 0:
        return 0
    probs = [v / total for v in values if v > 0]
    return -sum(p * np.log2(p) for p in probs)

# Knowledge distribution by category (approximate scroll counts)
categories_before = {
    "Poetry & Literature": 120000,
    "History & Biography": 80000,
    "Philosophy": 60000,
    "Mathematics": 40000,
    "Medicine": 35000,
    "Natural Science": 30000,
    "Geography": 25000,
    "Law & Rhetoric": 20000,
    "Music & Arts": 15000,
    "Astronomy": 10000,
    "Engineering": 8000,
    "Agriculture": 7000,
}

total_before = sum(categories_before.values())
entropy_before = shannon_entropy(list(categories_before.values()))

print("=== Library of Alexandria — Information Entropy Analysis ===")
print(f"\\nBefore destruction:")
print(f"  Total scrolls: {total_before:,}")
print(f"  Categories: {len(categories_before)}")
print(f"  Shannon entropy: {entropy_before:.3f} bits")
print(f"  Maximum possible entropy (uniform): {np.log2(len(categories_before)):.3f} bits")
print(f"  Information efficiency: {entropy_before / np.log2(len(categories_before)) * 100:.1f}%")

# Simulate progressive destruction
destruction_events = [
    ("Caesar's fire (48 BCE)", {"Poetry & Literature": -20000, "History & Biography": -10000}),
    ("Neglect (1st-3rd century)", {"Natural Science": -15000, "Engineering": -5000, "Agriculture": -4000}),
    ("Aurelian (272 CE)", {"Mathematics": -20000, "Philosophy": -30000, "Astronomy": -5000}),
    ("Serapeum (391 CE)", {"Medicine": -25000, "Geography": -15000, "Music & Arts": -10000}),
    ("Final decline", {"Poetry & Literature": -60000, "History & Biography": -40000,
                       "Law & Rhetoric": -15000, "Mathematics": -15000}),
]

current = dict(categories_before)
print(f"\\n{'Event':<30} {'Scrolls':>8} {'Lost':>8} {'Entropy':>8} {'% Lost':>8}")
print("-" * 64)
print(f"{'Original Library':<30} {total_before:>8,} {'':>8} {entropy_before:>7.3f} {'0%':>8}")

cumulative_lost = 0
for event_name, losses in destruction_events:
    for cat, loss in losses.items():
        current[cat] = max(0, current[cat] + loss)
    total_now = sum(current.values())
    lost_this = total_before - total_now - cumulative_lost
    cumulative_lost = total_before - total_now
    entropy_now = shannon_entropy(list(current.values()))
    pct_lost = cumulative_lost / total_before * 100
    print(f"{event_name:<30} {total_now:>8,} {lost_this:>+8,} {entropy_now:>7.3f} {pct_lost:>7.0f}%")

# What survived
surviving = {k: v for k, v in current.items() if v > 0}
total_surviving = sum(surviving.values())
entropy_final = shannon_entropy(list(surviving.values()))
print(f"\\nSurviving scrolls: {total_surviving:,} ({total_surviving/total_before*100:.1f}%)")
print(f"Surviving categories: {len(surviving)} of {len(categories_before)}")
print(f"Final entropy: {entropy_final:.3f} bits (was {entropy_before:.3f})")
print(f"Information diversity lost: {(1 - entropy_final/entropy_before)*100:.0f}%")`,
      challenge: 'What if Mathematics had been perfectly preserved (no losses)? Recalculate the final entropy. Does saving one category significantly change the total information content? (This is the "was one category uniquely important?" question — and the answer reveals whether diversity or any single field matters more.)',
      successHint: 'You applied Shannon entropy — one of the most important concepts in information theory — to quantify knowledge loss. The same mathematics is used in data compression (ZIP files), cryptography, machine learning (decision trees), and even ecology (species diversity indices).',
    },
    {
      title: 'Link rot — is the modern web repeating Alexandria\'s mistake?',
      concept: `The Library of Alexandria lost its knowledge over centuries. The modern web is losing knowledge over **years**.

**Link rot** is the phenomenon of web pages disappearing: a URL that worked last year now returns "404 Not Found." Studies show that **25% of web pages from 2013 are already gone**. Among academic papers, 50% of URLs cited in research papers from 2000 are broken.

**Bit rot** is the physical degradation of digital storage. Hard drives last 3-5 years. SSDs last 5-10 years. CDs degrade in 10-25 years. Without active maintenance — copying data to new media before the old ones fail — digital information simply vanishes.

The **Internet Archive** (archive.org) fights this by regularly crawling and saving web pages — over 800 billion pages saved. It's the closest modern equivalent to the Library of Alexandria.

📚 *The Wayback Machine (web.archive.org) lets you view old versions of any web page. It's saved snapshots of the web since 1996 — the digital equivalent of Callimachus's Pinakes.*`,
      analogy: 'Imagine writing your diary on a whiteboard. Each day, you erase yesterday\'s entry to make room. After a year, only today\'s entry exists — the rest is gone. The web works similarly: when a server goes offline, a company shuts down, or a page is redesigned, the old content often disappears forever. Unless someone took a photo of the whiteboard (archived the page) before it was erased.',
      storyConnection: 'The Library of Alexandria didn\'t burn in one dramatic fire — it died slowly through neglect, politics, and institutional failure. The modern web is experiencing the same slow death: pages disappear, links break, formats become unreadable. The lesson: preservation requires active, ongoing effort, not just creation.',
      checkQuestion: 'If 25% of 2013 web pages are gone by 2024 (11 years), and the rate is constant, what percentage will be gone by 2035?',
      checkAnswer: 'About 50%. At ~2.3% per year, 22 years of decay would leave about 50% of pages gone. But the rate likely accelerates as old servers fail and companies shut down — so the real number might be higher. This is why the Internet Archive is so important.',
      codeIntro: 'Model link rot and bit rot — simulate the decay of digital information over time.',
      code: `import numpy as np

np.random.seed(42)

def simulate_link_rot(n_pages, years, annual_death_rate=0.025):
    """
    Simulate web page survival over time.
    Each year, each surviving page has a chance of disappearing.
    """
    surviving = n_pages
    history = [(0, surviving)]

    for year in range(1, years + 1):
        # Each page has annual_death_rate probability of disappearing
        deaths = np.random.binomial(surviving, annual_death_rate)
        surviving -= deaths
        history.append((year, surviving))

    return history

def simulate_bit_rot(data_tb, years, media_lifespan=5):
    """
    Simulate data loss from media degradation.
    Hard drives fail with probability increasing after median lifespan.
    """
    surviving = data_tb
    history = [(0, surviving)]

    for year in range(1, years + 1):
        # Failure probability increases with age (bathtub curve)
        failure_rate = 0.02 + 0.1 * max(0, year - media_lifespan) / media_lifespan
        failure_rate = min(failure_rate, 0.5)
        loss = surviving * failure_rate
        surviving -= loss
        history.append((year, surviving))

    return history

# Simulate link rot for 1 billion web pages
print("=== Link Rot Simulation ===")
print("Starting pages: 1,000,000,000")
link_history = simulate_link_rot(1_000_000_000, 30)

print(f"{'Year':>6} {'Surviving Pages':>18} {'% Remaining':>14}")
print("-" * 40)
for year, pages in link_history:
    if year % 5 == 0:
        pct = pages / 1_000_000_000 * 100
        print(f"{year:>6} {pages:>18,} {pct:>12.1f}%")

# Bit rot for 100 TB without maintenance
print("\\n=== Bit Rot Simulation (No Maintenance) ===")
print("Starting data: 100 TB on hard drives")
bit_history = simulate_bit_rot(100, 20)

print(f"{'Year':>6} {'Surviving TB':>14} {'% Remaining':>14}")
print("-" * 36)
for year, tb in bit_history:
    if year % 4 == 0:
        print(f"{year:>6} {tb:>12.1f} {tb/100*100:>12.1f}%")

# Comparison with ancient preservation
print("\\n=== Preservation Comparison ===")
media = [
    ("Sumerian clay tablet", 5000, "Still readable"),
    ("Egyptian papyrus (dry)", 3000, "Readable with care"),
    ("Roman stone inscription", 2000, "Often readable"),
    ("Medieval parchment", 800, "Good condition"),
    ("Printed book (acid-free)", 500, "Excellent"),
    ("CD-ROM", 25, "Often unreadable"),
    ("Hard drive", 5, "Needs replacement"),
    ("SSD", 10, "Data fades without power"),
    ("Web page (average)", 10, "25% gone already"),
]

print(f"{'Medium':<28} {'Expected Life':>14} {'Status':>20}")
print("-" * 64)
for name, years, status in media:
    print(f"{name:<28} {years:>10} yrs  {status:>20}")

print("\\nThe paradox: the OLDEST storage media are the most durable.")
print("Digital is fast and dense, but fragile. Analog is slow, but lasts.")`,
      challenge: 'Add a "with maintenance" simulation: every 3 years, all surviving data is copied to new drives (resetting the age clock). Compare the data loss over 20 years with and without maintenance. This is what the Internet Archive does — active preservation through continuous copying.',
      successHint: 'You modeled the decay of digital information — a real and urgent problem. The Internet Archive, national libraries, and university repositories fight this decay every day. The lesson of Alexandria applies directly: knowledge must be ACTIVELY maintained, or it will be lost — whether it\'s stored on papyrus or petabytes.',
    },
    {
      title: 'Building a search engine — from Callimachus to Google',
      concept: `Callimachus's Pinakes was the world's first **search index**: a system that maps a query (author name, subject category) to a physical location (shelf, cubbyhole number). Every modern search engine — from library card catalogues to Google — is a direct descendant.

The core algorithm: (1) **Crawl** — examine every item in the collection, (2) **Index** — extract keywords and store them in a searchable structure, (3) **Rank** — when a query comes in, find matching items and sort them by relevance.

Google adds one more step: **PageRank** — a page is important if other important pages link to it. This is essentially a measure of **network centrality** — the same concept we applied to the Library's knowledge network.

📚 *An inverted index maps words to documents (not documents to words). This is the key data structure behind search: given a word, instantly find all documents containing it.*`,
      analogy: 'A book\'s index at the back lists topics and the pages they appear on — "gravity: pp. 12, 45, 89." This is an inverted index: given a topic, find the locations. A search engine does the same for billions of web pages — given a word, find every page containing it.',
      storyConnection: 'Callimachus\'s Pinakes listed every work by category and author — with the first line of each work for verification. This is the ancient equivalent of Google\'s "snippet" — the preview text shown in search results that helps you decide whether to click.',
      checkQuestion: 'Google indexes approximately 100 billion web pages. If a search query matches 10 million of them, why don\'t you see 10 million results? What determines which 10 you see first?',
      checkAnswer: 'PageRank and relevance scoring. Each matching page is scored based on: (1) how relevant its content is to the query, (2) how many other important pages link to it (PageRank), (3) how recent and trustworthy it is. The top 10 results are the highest-scoring pages. Google ranks 10 million results in under 0.5 seconds.',
      codeIntro: 'Build a simple search engine: crawl a collection, build an inverted index, and answer keyword queries.',
      code: `# Simple search engine — from Callimachus to Google

# Our "collection" — texts from the Library of Alexandria
documents = {
    "euclid_elements": "geometry points lines angles triangles circles proofs axioms mathematics",
    "archimedes_floating": "buoyancy water density floating sinking displacement volume",
    "aristotle_physics": "motion force nature elements earth water fire air cause",
    "plato_republic": "justice state education philosophy virtue knowledge truth beauty",
    "hippocrates_airs": "medicine disease climate health water air seasons treatment body",
    "herodotus_histories": "war persian greece battle culture egypt travel geography customs",
    "eratosthenes_earth": "earth circumference measurement shadow angle geometry sun distance",
    "aristarchus_sun": "sun earth orbit heliocentric model distance size astronomy",
    "hero_aeolipile": "steam engine heat water pressure rotation mechanics invention",
    "homer_iliad": "war troy heroes achilles battle glory honour death fate",
}

# Step 1: Build inverted index
inverted_index = {}
for doc_id, text in documents.items():
    words = text.split()
    for word in words:
        if word not in inverted_index:
            inverted_index[word] = []
        if doc_id not in inverted_index[word]:
            inverted_index[word].append(doc_id)

print(f"=== Search Engine Built ===")
print(f"Documents indexed: {len(documents)}")
print(f"Unique terms: {len(inverted_index)}")

# Step 2: Search function
def search(query, index, docs):
    """Find documents matching ALL query terms (AND search)."""
    terms = query.lower().split()
    result_sets = []
    for term in terms:
        if term in index:
            result_sets.append(set(index[term]))
        else:
            return []  # term not found anywhere

    # Intersection: documents containing ALL terms
    if result_sets:
        matches = result_sets[0]
        for s in result_sets[1:]:
            matches = matches & s
        return list(matches)
    return []

# Step 3: Run queries
queries = [
    "geometry",
    "water",
    "earth sun",
    "war battle",
    "steam engine",
    "quantum",  # won't find anything
]

print("\\n=== Search Results ===")
for q in queries:
    results = search(q, inverted_index, documents)
    if results:
        result_names = [r.replace("_", " ").title() for r in results]
        print(f'Query: "{q}" → {len(results)} result(s): {", ".join(result_names)}')
    else:
        print(f'Query: "{q}" → No results')

# Show index stats
print("\\n=== Most Common Terms ===")
sorted_terms = sorted(inverted_index.items(), key=lambda x: len(x[1]), reverse=True)
for term, docs in sorted_terms[:5]:
    print(f'  "{term}" appears in {len(docs)} document(s)')`,
      challenge: 'Add a relevance score: for each matching document, count how many of the query terms it contains. Rank results by score (highest first). This is the simplest form of TF scoring — the basis of real search engine ranking.',
      successHint: 'You built a working search engine — inverted index, query processing, and result retrieval. Google\'s architecture is the same at its core: crawl (examine pages), index (inverted index of words → pages), and rank (PageRank + relevance). You built the 2,200-year lineage from Callimachus\'s Pinakes to Google Search.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Information theory and data systems through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to build search algorithms, knowledge networks, and information entropy models.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
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
