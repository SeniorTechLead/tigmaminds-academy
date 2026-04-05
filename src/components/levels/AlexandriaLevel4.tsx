import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function AlexandriaLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Architect a Knowledge Management System',
      concept: `In this capstone project, you will build a complete **Knowledge Management System** — a Python program that combines everything from Levels 1-3:

1. **Graph database** for storing scholars, works, and their relationships
2. **Inverted index** with TF-IDF for full-text search
3. **PageRank** for importance ranking
4. **Destruction simulator** for modelling progressive knowledge loss
5. **Technical documentation** summarising your system

This first step is **system design** — planning the architecture before writing code. You'll define the data model, the core operations, and how the components connect.

A knowledge management system must answer four questions:
- **Store**: How do we represent knowledge and its connections?
- **Find**: How do we search for specific knowledge?
- **Rank**: Which knowledge is most important/relevant?
- **Preserve**: How do we protect against loss?

📚 *System design interviews are the most important part of senior engineering hiring at Google, Amazon, Meta, and every major tech company. The ability to architect a system before coding it is what separates junior from senior engineers.*`,
      analogy: 'Before building a city, you need a master plan: where do roads go, where do buildings sit, how does water flow, where does waste go? The master plan doesn\'t lay a single brick — but without it, you get a chaotic mess. System design is the master plan for software.',
      storyConnection: 'The Library of Alexandria was, at its core, a knowledge management system: it stored scrolls (graph database), catalogued them in the Pinakes (inverted index), identified the most important works (ranking), and copied aging scrolls (preservation). Your digital system solves the same problems the Ptolemies faced 2,300 years ago.',
      checkQuestion: 'Why is it better to define your data model (nodes, edges, properties) before writing search or ranking algorithms?',
      checkAnswer: 'Because the data model determines what questions you can answer. If you don\'t store citation links, you can\'t compute PageRank. If you don\'t store full text, you can\'t build an inverted index. The data model is the foundation — everything else is built on top of it. Get it wrong, and you\'ll have to rewrite everything.',
      codeIntro: 'Design the architecture of the Knowledge Management System — define data structures, interfaces, and the component graph.',
      code: `import numpy as np

# Knowledge Management System — Architecture Design

class KnowledgeNode:
    """A node in the knowledge graph (scholar, work, or concept)."""
    def __init__(self, node_id, node_type, name, properties=None):
        self.node_id = node_id
        self.node_type = node_type  # 'scholar', 'work', 'concept'
        self.name = name
        self.properties = properties or {}
        self.text_content = ""  # for full-text indexing

class KnowledgeEdge:
    """A directed edge in the knowledge graph."""
    def __init__(self, source_id, target_id, edge_type, weight=1.0):
        self.source_id = source_id
        self.target_id = target_id
        self.edge_type = edge_type  # 'authored', 'cited', 'studied_under', 'about'
        self.weight = weight

class KnowledgeSystem:
    """Top-level system integrating all components."""
    def __init__(self):
        self.nodes = {}        # id -> KnowledgeNode
        self.edges = []        # list of KnowledgeEdge
        self.adj_out = {}      # id -> [(target_id, edge_type)]
        self.adj_in = {}       # id -> [(source_id, edge_type)]
        self.next_id = 0

    def add_node(self, node_type, name, properties=None, text=""):
        nid = self.next_id
        self.next_id += 1
        node = KnowledgeNode(nid, node_type, name, properties)
        node.text_content = text
        self.nodes[nid] = node
        self.adj_out[nid] = []
        self.adj_in[nid] = []
        return nid

    def add_edge(self, source, target, edge_type, weight=1.0):
        edge = KnowledgeEdge(source, target, edge_type, weight)
        self.edges.append(edge)
        self.adj_out[source].append((target, edge_type))
        self.adj_in[target].append((source, edge_type))

    def stats(self):
        types = {}
        for n in self.nodes.values():
            types[n.node_type] = types.get(n.node_type, 0) + 1
        edge_types = {}
        for e in self.edges:
            edge_types[e.edge_type] = edge_types.get(e.edge_type, 0) + 1
        return types, edge_types

# Build the system and populate with Alexandria data
ks = KnowledgeSystem()

# Add scholars
scholars = {
    "Euclid": ks.add_node("scholar", "Euclid",
        {"born": "~325 BC", "field": "Mathematics"}),
    "Aristotle": ks.add_node("scholar", "Aristotle",
        {"born": "384 BC", "field": "Philosophy"}),
    "Eratosthenes": ks.add_node("scholar", "Eratosthenes",
        {"born": "276 BC", "field": "Geography"}),
    "Archimedes": ks.add_node("scholar", "Archimedes",
        {"born": "287 BC", "field": "Mathematics"}),
    "Ptolemy": ks.add_node("scholar", "Ptolemy",
        {"born": "100 AD", "field": "Astronomy"}),
    "Hipparchus": ks.add_node("scholar", "Hipparchus",
        {"born": "190 BC", "field": "Astronomy"}),
    "Callimachus": ks.add_node("scholar", "Callimachus",
        {"born": "310 BC", "field": "Library Science"}),
}

# Add works with content for indexing
works = {
    "Elements": ks.add_node("work", "Elements",
        {"scrolls": 13}, "geometry proof triangle circle sphere axiom theorem"),
    "Physics": ks.add_node("work", "Physics",
        {"scrolls": 8}, "motion force nature cause change body substance"),
    "Geographica": ks.add_node("work", "Geographica",
        {"scrolls": 3}, "earth measurement circumference distance sphere"),
    "Almagest": ks.add_node("work", "Almagest",
        {"scrolls": 13}, "star planet epicycle orbit eclipse sphere celestial"),
    "Pinakes": ks.add_node("work", "Pinakes",
        {"scrolls": 120}, "catalogue author subject scroll classification"),
}

# Add concepts
concepts = {
    "Geometry": ks.add_node("concept", "Geometry"),
    "Astronomy": ks.add_node("concept", "Astronomy"),
    "Philosophy": ks.add_node("concept", "Philosophy"),
    "Cataloguing": ks.add_node("concept", "Cataloguing"),
}

# Add edges
ks.add_edge(scholars["Euclid"], works["Elements"], "authored")
ks.add_edge(scholars["Aristotle"], works["Physics"], "authored")
ks.add_edge(scholars["Eratosthenes"], works["Geographica"], "authored")
ks.add_edge(scholars["Ptolemy"], works["Almagest"], "authored")
ks.add_edge(scholars["Callimachus"], works["Pinakes"], "authored")
ks.add_edge(scholars["Archimedes"], scholars["Euclid"], "cited")
ks.add_edge(scholars["Eratosthenes"], scholars["Euclid"], "cited")
ks.add_edge(scholars["Ptolemy"], scholars["Hipparchus"], "cited")
ks.add_edge(scholars["Hipparchus"], scholars["Eratosthenes"], "cited")
ks.add_edge(scholars["Eratosthenes"], scholars["Callimachus"], "studied_under")
ks.add_edge(works["Elements"], concepts["Geometry"], "about")
ks.add_edge(works["Almagest"], concepts["Astronomy"], "about")
ks.add_edge(works["Physics"], concepts["Philosophy"], "about")
ks.add_edge(works["Pinakes"], concepts["Cataloguing"], "about")

# System report
node_types, edge_types = ks.stats()

print("=== Knowledge Management System — Architecture ===")
print(f"\\nComponents:")
print(f"  Graph Database: {len(ks.nodes)} nodes, {len(ks.edges)} edges")
print(f"  Node types: {dict(node_types)}")
print(f"  Edge types: {dict(edge_types)}")
print()
print("System modules planned:")
print("  1. Graph Database  — store and traverse the knowledge graph")
print("  2. Inverted Index  — full-text search with TF-IDF ranking")
print("  3. PageRank Engine — compute importance scores")
print("  4. Destruction Sim — model progressive knowledge loss")
print("  5. Report Generator — summarise findings")

print("\\nGraph structure:")
for nid, node in ks.nodes.items():
    out_count = len(ks.adj_out[nid])
    in_count = len(ks.adj_in[nid])
    if out_count > 0 or in_count > 0:
        print(f"  [{node.node_type[0].upper()}] {node.name:<16} "
              f"out={out_count} in={in_count}")`,
      challenge: 'Add a "subject" node type and connect works to subjects using "belongs_to" edges. Then add a method `get_neighbours(node_id, edge_type=None)` that returns all nodes connected to a given node, optionally filtered by edge type. This is the fundamental graph traversal operation.',
      successHint: 'Good system design makes everything else easier. You defined node types, edge types, and the operations the system must support — a reusable, extensible architecture. Real knowledge management systems (Wikidata, Google Knowledge Graph, Neo4j databases) use exactly this pattern: nodes with properties, typed edges, and traversal methods.',
    },
    {
      title: 'Graph database — implement node/edge storage with traversal',
      concept: `Now we build the core of the knowledge graph: a **graph database** that supports efficient storage, traversal, and querying. The key operations are:

- **Add/remove nodes and edges** — CRUD operations
- **Traverse** — follow edges from a node to its neighbours (BFS, DFS)
- **Path finding** — find the shortest path between two nodes
- **Subgraph extraction** — pull out all nodes within N hops of a starting node
- **Property queries** — find all nodes matching certain criteria

The adjacency list representation (dictionary of lists) gives O(1) access to any node's neighbours — critical for traversal. We also maintain reverse adjacency (incoming edges) for operations like PageRank that need to know "who points to me?"

The graph database is the foundation: search, ranking, and destruction simulation all operate on it.

📚 *Graph databases (Neo4j, Amazon Neptune, ArangoDB) are one of the fastest-growing categories in database technology. They're used by LinkedIn (social graph), Uber (routing), and NASA (mission planning).*`,
      analogy: 'A graph database is like a city map where every building has a list of roads leading to and from it. To find a path from the library to the harbour, you don\'t scan every road — you start at the library, check which roads leave it, follow them to neighbouring buildings, and repeat. The adjacency list is the list of roads at each building.',
      storyConnection: 'The scholars of Alexandria formed a living knowledge graph: each knew certain others, studied certain subjects, wrote certain works. When Eratosthenes needed to measure the Earth, he drew on Euclid\'s geometry, Aristarchus\'s astronomy, and Callimachus\'s cataloguing. His breakthrough was a traversal of the knowledge graph — combining insights from distant nodes.',
      checkQuestion: 'In a graph with 1,000 nodes and average degree 10, how many nodes can you reach in 3 hops from any starting node?',
      checkAnswer: 'Up to 10 × 10 × 10 = 1,000 nodes — potentially the entire graph in just 3 hops. This is the "small world" effect: even large graphs have short paths between most pairs of nodes. In social networks, the average path length is about 6 ("six degrees of separation").',
      codeIntro: 'Build the graph database with traversal, path finding, and subgraph extraction.',
      code: `import numpy as np

class GraphDB:
    """Graph database for the Alexandria knowledge system."""

    def __init__(self):
        self.nodes = {}       # id -> {name, type, props, text}
        self.adj_out = {}     # id -> [(target, edge_type, weight)]
        self.adj_in = {}      # id -> [(source, edge_type, weight)]
        self.next_id = 0

    def add_node(self, name, node_type, props=None, text=""):
        nid = self.next_id
        self.next_id += 1
        self.nodes[nid] = {"name": name, "type": node_type,
                           "props": props or {}, "text": text}
        self.adj_out[nid] = []
        self.adj_in[nid] = []
        return nid

    def add_edge(self, src, tgt, etype, weight=1.0):
        self.adj_out[src].append((tgt, etype, weight))
        self.adj_in[tgt].append((src, etype, weight))

    def remove_node(self, nid):
        """Remove a node and all its edges."""
        # Remove outbound edges
        for tgt, etype, w in self.adj_out.get(nid, []):
            self.adj_in[tgt] = [(s, e, w2) for s, e, w2 in self.adj_in[tgt] if s != nid]
        # Remove inbound edges
        for src, etype, w in self.adj_in.get(nid, []):
            self.adj_out[src] = [(t, e, w2) for t, e, w2 in self.adj_out[src] if t != nid]
        del self.nodes[nid]
        del self.adj_out[nid]
        del self.adj_in[nid]

    def bfs(self, start, max_depth=3):
        """BFS traversal returning {node_id: depth}."""
        visited = {start: 0}
        queue = [(start, 0)]
        while queue:
            node, depth = queue.pop(0)
            if depth >= max_depth:
                continue
            for tgt, etype, w in self.adj_out.get(node, []):
                if tgt not in visited:
                    visited[tgt] = depth + 1
                    queue.append((tgt, depth + 1))
        return visited

    def shortest_path(self, start, end):
        """BFS shortest path. Returns (path, length) or (None, -1)."""
        if start == end:
            return [start], 0
        visited = {start: None}
        queue = [start]
        while queue:
            node = queue.pop(0)
            neighbours = [(t, e) for t, e, w in self.adj_out.get(node, [])]
            neighbours += [(s, e) for s, e, w in self.adj_in.get(node, [])]
            for nbr, etype in neighbours:
                if nbr not in visited:
                    visited[nbr] = node
                    if nbr == end:
                        path = [end]
                        current = end
                        while visited[current] is not None:
                            current = visited[current]
                            path.append(current)
                        return list(reversed(path)), len(path) - 1
                    queue.append(nbr)
        return None, -1

    def subgraph(self, center, radius=2):
        """Extract all nodes within radius hops of center."""
        reachable = self.bfs(center, radius)
        return reachable

# Build Alexandria graph
db = GraphDB()

# Scholars
s = {}
for name, field in [("Euclid", "Math"), ("Aristotle", "Phil"),
                     ("Plato", "Phil"), ("Eratosthenes", "Geo"),
                     ("Archimedes", "Math"), ("Hipparchus", "Astro"),
                     ("Aristarchus", "Astro"), ("Ptolemy", "Astro"),
                     ("Callimachus", "Library"), ("Homer", "Poetry"),
                     ("Galen", "Medicine"), ("Apollonius", "Math")]:
    s[name] = db.add_node(name, "scholar", {"field": field})

# Works
w = {}
for title, content in [("Elements", "geometry proof axiom triangle circle"),
                        ("Physics", "motion force nature cause substance"),
                        ("Geographica", "earth measurement circumference"),
                        ("Almagest", "star planet orbit eclipse sphere"),
                        ("Pinakes", "catalogue author subject classification"),
                        ("Conics", "parabola ellipse hyperbola curve cone"),
                        ("Iliad", "war hero honor glory fate gods battle")]:
    w[title] = db.add_node(title, "work", text=content)

# Authorship edges
for scholar, work in [("Euclid", "Elements"), ("Aristotle", "Physics"),
                       ("Eratosthenes", "Geographica"), ("Ptolemy", "Almagest"),
                       ("Callimachus", "Pinakes"), ("Apollonius", "Conics"),
                       ("Homer", "Iliad")]:
    db.add_edge(s[scholar], w[work], "authored")

# Citation edges
for citer, cited in [("Archimedes", "Euclid"), ("Eratosthenes", "Euclid"),
                      ("Ptolemy", "Hipparchus"), ("Hipparchus", "Eratosthenes"),
                      ("Aristotle", "Plato"), ("Eratosthenes", "Aristarchus"),
                      ("Galen", "Aristotle"), ("Apollonius", "Euclid"),
                      ("Apollonius", "Archimedes")]:
    db.add_edge(s[citer], s[cited], "cited")

# Teacher edges
for student, teacher in [("Aristotle", "Plato"), ("Eratosthenes", "Callimachus")]:
    db.add_edge(s[student], s[teacher], "studied_under")

print("=== Alexandria Graph Database ===")
print(f"Nodes: {len(db.nodes)}  Edges: {sum(len(v) for v in db.adj_out.values())}")

# BFS from Euclid
print("\\n=== BFS from Euclid (3 hops) ===")
reachable = db.bfs(s["Euclid"], max_depth=3)
for nid, depth in sorted(reachable.items(), key=lambda x: x[1]):
    print(f"  Depth {depth}: {db.nodes[nid]['name']} ({db.nodes[nid]['type']})")

# Shortest paths
print("\\n=== Shortest Paths ===")
pairs = [("Homer", "Galen"), ("Euclid", "Ptolemy"), ("Plato", "Hipparchus")]
for a, b in pairs:
    path, length = db.shortest_path(s[a], s[b])
    if path:
        names = " -> ".join(db.nodes[nid]["name"] for nid in path)
        print(f"  {a} to {b}: {names} (length={length})")
    else:
        print(f"  {a} to {b}: NO PATH")

# Degree analysis
print("\\n=== Node Connectivity ===")
print(f"{'Name':<16} {'Type':<8} {'Out':>4} {'In':>4} {'Total':>6}")
print("-" * 40)
for nid in sorted(db.nodes, key=lambda x: len(db.adj_out[x]) + len(db.adj_in[x]), reverse=True):
    n = db.nodes[nid]
    out_deg = len(db.adj_out[nid])
    in_deg = len(db.adj_in[nid])
    print(f"  {n['name']:<14} {n['type']:<8} {out_deg:>4} {in_deg:>4} {out_deg+in_deg:>6}")`,
      challenge: 'Add a `find_by_property(prop_name, prop_value)` method that returns all nodes where a specific property matches. Then add `neighbours(node_id, edge_type=None, direction="out")` that returns filtered neighbours. These two queries cover most real-world graph database use cases.',
      successHint: 'You built a graph database from scratch — the same data structure that powers Google Knowledge Graph, Facebook\'s social graph, and biomedical knowledge bases. The key insight: representing data as nodes and edges (rather than rows and columns) makes relationship-heavy queries natural and fast.',
    },
    {
      title: 'Search engine — combine inverted index with PageRank-style ranking',
      concept: `Now we combine two components into a **search engine**: the inverted index (from Level 3) finds relevant documents, and PageRank (from Level 2) ranks them by importance. The combined score is:

**final_score = alpha × TF-IDF_score + (1 - alpha) × PageRank_score**

Where alpha controls the balance between relevance (TF-IDF) and importance (PageRank). Google uses a similar weighted combination — though with hundreds of additional signals.

The search pipeline:
1. **Query parsing**: split the query into terms
2. **Index lookup**: find documents containing each term (inverted index)
3. **Relevance scoring**: compute TF-IDF for each candidate
4. **Importance scoring**: look up pre-computed PageRank
5. **Combination**: weighted sum of relevance and importance
6. **Ranking**: sort by combined score, return top K

This is the architecture of every modern search engine. The specific signals and weights are trade secrets, but the structure is universal.

📚 *Sergey Brin and Larry Page's key insight (1998) was that web search needed both content relevance AND link-based importance. Before PageRank, search engines used only keyword matching — and the results were terrible.*`,
      analogy: 'Imagine asking a librarian: "Find me a good book about geometry." The librarian first finds all books mentioning geometry (inverted index). Then she ranks them: a book by Euclid (high PageRank — cited by everyone) ranks above a book by an unknown author, even if the unknown author mentions "geometry" more often. The combination of relevance and authority gives better results than either alone.',
      storyConnection: 'The Alexandrian librarians implicitly used both signals: they could find scrolls by subject (the Pinakes — their inverted index), and they knew which scholars were most authoritative (reputation — their PageRank). A scholar asking "who should I read on astronomy?" would be directed to Hipparchus (high authority) before a lesser-known astronomer, even if both wrote on the same topic.',
      checkQuestion: 'Document A has TF-IDF=0.8 and PageRank=0.1. Document B has TF-IDF=0.3 and PageRank=0.9. With alpha=0.5, which ranks higher?',
      checkAnswer: 'A: 0.5×0.8 + 0.5×0.1 = 0.45. B: 0.5×0.3 + 0.5×0.9 = 0.60. B ranks higher — its authority outweighs A\'s keyword relevance. With alpha=0.8 (more weight on relevance): A=0.66, B=0.42 — now A wins. The alpha parameter lets you tune the balance.',
      codeIntro: 'Build a complete search engine that combines TF-IDF relevance with PageRank authority.',
      code: `import numpy as np

# === Build the Knowledge Base ===
documents = {
    0: {"title": "Elements", "author": "Euclid",
        "text": "geometry proof triangle circle sphere line angle axiom postulate parallel theorem ratio number prime proportion"},
    1: {"title": "Physics", "author": "Aristotle",
        "text": "motion force nature cause change place time void body substance form matter element cause nature"},
    2: {"title": "Almagest", "author": "Ptolemy",
        "text": "star planet sphere orbit eclipse moon sun circle epicycle equant sphere celestial model prediction"},
    3: {"title": "Geographica", "author": "Eratosthenes",
        "text": "earth measurement circumference distance sphere geography map river climate zone latitude longitude"},
    4: {"title": "On the Sphere", "author": "Archimedes",
        "text": "sphere volume surface cylinder ratio pi geometry proof calculation area buoyancy fluid equilibrium"},
    5: {"title": "Conics", "author": "Apollonius",
        "text": "parabola ellipse hyperbola curve section cone circle tangent focus axis geometry proof locus"},
    6: {"title": "Star Catalogue", "author": "Hipparchus",
        "text": "star magnitude constellation longitude latitude observation equinox precession celestial coordinate catalogue"},
    7: {"title": "Pinakes", "author": "Callimachus",
        "text": "catalogue author subject scroll classification library index biography first line count organization"},
    8: {"title": "Histories", "author": "Herodotus",
        "text": "war battle king empire city people army navy speech oracle temple sacrifice Persia Greece custom"},
    9: {"title": "On Sizes", "author": "Aristarchus",
        "text": "sun moon earth distance ratio sphere eclipse angle measurement calculation size heliocentric model"},
}

n_docs = len(documents)

# === Build Inverted Index ===
inverted_index = {}
doc_lengths = {}

for doc_id, doc in documents.items():
    words = doc["text"].split()
    doc_lengths[doc_id] = len(words)
    for word in words:
        if word not in inverted_index:
            inverted_index[word] = {}
        inverted_index[word][doc_id] = inverted_index[word].get(doc_id, 0) + 1

def tfidf_scores(query_terms):
    """Compute TF-IDF scores for each document."""
    scores = {}
    for term in query_terms:
        if term not in inverted_index:
            continue
        postings = inverted_index[term]
        idf = np.log(n_docs / len(postings))
        for doc_id, count in postings.items():
            tf = count / doc_lengths[doc_id]
            scores[doc_id] = scores.get(doc_id, 0) + tf * idf
    return scores

# === Compute PageRank ===
# Citation matrix (who cites whom, based on author references)
citations = {
    "Euclid": ["Aristotle"],
    "Aristotle": ["Plato"],
    "Eratosthenes": ["Euclid", "Aristarchus"],
    "Archimedes": ["Euclid"],
    "Ptolemy": ["Hipparchus", "Euclid", "Eratosthenes"],
    "Apollonius": ["Euclid", "Archimedes"],
    "Hipparchus": ["Eratosthenes", "Aristarchus"],
    "Aristarchus": ["Euclid"],
}

# Map authors to doc IDs
author_to_doc = {doc["author"]: did for did, doc in documents.items()}

# Build adjacency matrix
adj = np.zeros((n_docs, n_docs))
for citer, cited_list in citations.items():
    if citer in author_to_doc:
        for cited in cited_list:
            if cited in author_to_doc:
                adj[author_to_doc[cited], author_to_doc[citer]] = 1

# Normalize columns
col_sums = adj.sum(axis=0)
col_sums[col_sums == 0] = 1
M = adj / col_sums

# PageRank iteration
damping = 0.85
rank = np.ones(n_docs) / n_docs
for _ in range(50):
    rank = (1 - damping) / n_docs + damping * M @ rank

# Normalize to [0, 1]
rank = rank / rank.max()

print("=== Pre-computed PageRank ===")
for did in sorted(range(n_docs), key=lambda i: rank[i], reverse=True):
    doc = documents[did]
    print(f"  {doc['title']:<18} by {doc['author']:<16} PR={rank[did]:.3f}")

# === Combined Search Engine ===
def search(query, alpha=0.5, top_k=5):
    """
    Search combining TF-IDF relevance and PageRank authority.
    alpha: weight for TF-IDF (1-alpha for PageRank)
    """
    terms = query.lower().split()
    tfidf = tfidf_scores(terms)

    if not tfidf:
        return []

    # Normalize TF-IDF scores
    max_tfidf = max(tfidf.values()) if tfidf else 1
    norm_tfidf = {k: v / max_tfidf for k, v in tfidf.items()}

    # Combine scores
    combined = {}
    for doc_id in norm_tfidf:
        rel = norm_tfidf[doc_id]
        imp = rank[doc_id]
        combined[doc_id] = alpha * rel + (1 - alpha) * imp

    return sorted(combined.items(), key=lambda x: -x[1])[:top_k]

# Run searches with different alpha values
print("\\n=== Search Engine Results ===")
queries = ["sphere geometry proof", "star planet observation", "earth measurement distance"]

for query in queries:
    print(f"\\nQuery: '{query}'")
    print(f"  {'Alpha':>6} | {'#1 Result':<25} {'Score':>6} | {'#2 Result':<25} {'Score':>6}")
    print(f"  {'-'*72}")
    for alpha in [0.0, 0.3, 0.5, 0.7, 1.0]:
        results = search(query, alpha=alpha)
        label = f"a={alpha}"
        if len(results) >= 2:
            r1 = documents[results[0][0]]
            r2 = documents[results[1][0]]
            print(f"  {label:>6} | {r1['title']:<25} {results[0][1]:>5.3f} "
                  f"| {r2['title']:<25} {results[1][1]:>5.3f}")

print("\\nAlpha=0: Pure PageRank (authority only)")
print("Alpha=1: Pure TF-IDF (keyword relevance only)")
print("Alpha=0.5: Balanced — the sweet spot for most queries")`,
      challenge: 'Add a "snippet" feature: for each search result, show the most relevant sentence from the document (the sentence with the highest TF-IDF score for the query terms). This is what Google shows under each search result — it helps users decide which result to click.',
      successHint: 'You built a complete search engine: inverted index for retrieval, TF-IDF for relevance, PageRank for authority, and a tunable combination. This is the architecture of Google, Bing, and every modern search system. The specific algorithms are more sophisticated, but the pipeline is identical.',
    },
    {
      title: 'Destruction simulator — model progressive knowledge loss events',
      concept: `The Library of Alexandria didn't fall in one catastrophe — it suffered multiple destruction events over centuries:

- **48 BC**: Julius Caesar's fire (warehouse scrolls lost)
- **~270 AD**: Aurelian's siege (Bruchion quarter damaged)
- **391 AD**: Decree of Theophilus (Serapeum temple destroyed)
- **642 AD**: Arab conquest (contested — may be apocryphal)

Each event didn't just destroy scrolls — it severed **connections** in the knowledge graph. Losing a scholar's entire works might disconnect the fields they bridged. Losing the Pinakes catalogue made it impossible to know what was lost.

The destruction simulator models this progressive degradation:
1. Remove nodes (destroyed scrolls/scholars) from the graph
2. Recompute connectivity — which knowledge clusters are now isolated?
3. Measure entropy loss — how much diversity was destroyed?
4. Track cascading effects — does losing one node cause others to become unreachable?

This is not just historical modelling — it's the same analysis used for disaster planning in modern infrastructure networks.

📚 *The total knowledge lost in the Library of Alexandria is unknowable — we only know what survived. Scholars estimate that 90-99% of ancient Greek literature was lost, much of it through the Library's decline.*`,
      analogy: 'Imagine a spider web. Cutting one strand weakens it but the web holds. Cutting a few strands near the centre collapses entire sections. Cutting the hub strand where everything connects can destroy the entire web. The Library was a knowledge web — each destruction event cut strands, and eventually the web could no longer hold together.',
      storyConnection: 'The most devastating loss may not have been the scrolls themselves but the Pinakes — the catalogue. Without it, scholars didn\'t know what the Library contained, couldn\'t find specific works, and couldn\'t know what was missing. Losing the index was like losing the index of the internet — the data might still exist somewhere, but it\'s effectively gone.',
      checkQuestion: 'If the Library lost 30% of its scrolls randomly, would it lose 30% of its knowledge? Why might the loss be greater or less?',
      checkAnswer: 'Greater — because of network effects. A scroll that bridges two fields (like Eratosthenes\' Geographica connecting astronomy and geometry) carries disproportionate value. Losing "bridge" works severs connections between fields, making the remaining works less useful. Random loss has non-linear impact on an interconnected knowledge system.',
      codeIntro: 'Simulate the progressive destruction of the Library — measure knowledge loss at each stage.',
      code: `import numpy as np

np.random.seed(42)

def shannon_entropy(counts):
    total = sum(counts)
    if total == 0:
        return 0
    probs = np.array([c / total for c in counts if c > 0])
    return -np.sum(probs * np.log2(probs))

# Build the knowledge network
subjects = ["Math", "Astro", "Med", "Phil", "Poetry", "History",
            "Geo", "Mechanics", "NatSci", "Law"]

n_scrolls = 400
scrolls = []
for i in range(n_scrolls):
    subj = np.random.choice(subjects)
    connections = np.random.randint(1, 6)  # links to other scrolls
    links = list(np.random.choice(n_scrolls, min(connections, n_scrolls-1), replace=False))
    links = [l for l in links if l != i]
    scrolls.append({"id": i, "subject": subj, "links": links, "alive": True})

def count_components(scrolls):
    """Count connected components among alive scrolls."""
    alive_ids = {s["id"] for s in scrolls if s["alive"]}
    if not alive_ids:
        return 0, 0
    visited = set()
    components = []

    for start in alive_ids:
        if start in visited:
            continue
        comp = set()
        queue = [start]
        while queue:
            node = queue.pop(0)
            if node in visited:
                continue
            visited.add(node)
            comp.add(node)
            for link in scrolls[node]["links"]:
                if link in alive_ids and link not in visited:
                    queue.append(link)
        components.append(len(comp))

    return len(components), max(components) if components else 0

def get_entropy(scrolls):
    alive = [s for s in scrolls if s["alive"]]
    counts = {}
    for s in alive:
        counts[s["subject"]] = counts.get(s["subject"], 0) + 1
    return shannon_entropy(list(counts.values()))

# Historical destruction events
events = [
    {"name": "Caesar's Fire (48 BC)", "type": "random", "fraction": 0.10},
    {"name": "Decline & Neglect (1st-2nd c.)", "type": "subject",
     "target": "Mechanics", "fraction": 0.50},
    {"name": "Aurelian's Siege (270 AD)", "type": "random", "fraction": 0.15},
    {"name": "Theophilus Decree (391 AD)", "type": "subject",
     "target": "Phil", "fraction": 0.80},
    {"name": "Final Decline (5th-7th c.)", "type": "random", "fraction": 0.40},
]

print("=== Library of Alexandria — Destruction Simulation ===")
print(f"Starting collection: {n_scrolls} scrolls across {len(subjects)} subjects")
print()

initial_entropy = get_entropy(scrolls)
initial_components, initial_largest = count_components(scrolls)

print(f"{'Event':<36} {'Lost':>5} {'Remain':>7} {'Entropy':>8} "
      f"{'Components':>11} {'Largest':>8}")
print("-" * 79)
print(f"{'Initial state':<36} {'':>5} {n_scrolls:>7} {initial_entropy:>8.3f} "
      f"{initial_components:>11} {initial_largest:>8}")

total_lost = 0
for event in events:
    alive = [s for s in scrolls if s["alive"]]
    if not alive:
        break

    if event["type"] == "random":
        n_destroy = int(len(alive) * event["fraction"])
        victims = np.random.choice(len(alive), n_destroy, replace=False)
        for v in victims:
            alive[v]["alive"] = False
        lost = n_destroy
    else:
        targeted = [s for s in alive if s["subject"] == event["target"]]
        n_destroy = int(len(targeted) * event["fraction"])
        for s in targeted[:n_destroy]:
            s["alive"] = False
        lost = n_destroy

    total_lost += lost
    remaining = sum(1 for s in scrolls if s["alive"])
    entropy = get_entropy(scrolls)
    n_comp, largest = count_components(scrolls)

    print(f"{event['name']:<36} {lost:>5} {remaining:>7} {entropy:>8.3f} "
          f"{n_comp:>11} {largest:>8}")

# Final analysis
print(f"\\n=== Final State ===")
alive_scrolls = [s for s in scrolls if s["alive"]]
print(f"Scrolls surviving: {len(alive_scrolls)} of {n_scrolls} "
      f"({len(alive_scrolls)/n_scrolls:.0%})")
print(f"Entropy: {get_entropy(scrolls):.3f} of {initial_entropy:.3f} "
      f"({get_entropy(scrolls)/initial_entropy:.0%})")
n_comp, largest = count_components(scrolls)
print(f"Components: {n_comp} (was {initial_components})")
print(f"Largest component: {largest} (was {initial_largest})")

# Subject-level survival
print(f"\\nSurvival by subject:")
for subj in subjects:
    original = sum(1 for s in scrolls if s["subject"] == subj)
    surviving = sum(1 for s in scrolls if s["subject"] == subj and s["alive"])
    pct = surviving / original * 100 if original > 0 else 0
    bar = "#" * int(pct / 5)
    status = "LOST" if surviving == 0 else "CRITICAL" if pct < 20 else ""
    print(f"  {subj:<12} {surviving:>3}/{original:<3} ({pct:>4.0f}%) {bar} {status}")

# Cascading knowledge loss
print(f"\\n=== Cascading Effect ===")
alive_ids = {s["id"] for s in scrolls if s["alive"]}
orphaned = 0
for s in scrolls:
    if s["alive"]:
        alive_links = [l for l in s["links"] if l in alive_ids]
        if len(alive_links) == 0 and len(s["links"]) > 0:
            orphaned += 1
print(f"Orphaned scrolls (all references destroyed): {orphaned}")
print(f"These scrolls survive but their context is lost —")
print(f"like finding a page that references books you can never read.")`,
      challenge: 'Add a "recovery" phase: after destruction, scholars attempt to reconstruct lost works from citations in surviving scrolls. If a destroyed scroll is cited by 3+ surviving scrolls, it can be partially recovered (50% of its connections restored). How much of the network can be recovered? This models how modern scholars reconstruct lost ancient texts.',
      successHint: 'You simulated one of history\'s greatest intellectual catastrophes — and quantified it. The non-linear relationship between scroll loss and knowledge loss (losing 60% of scrolls might destroy 80% of knowledge due to network effects) is a profound insight. The same analysis applies to modern risks: what happens to the internet if major data centres are destroyed?',
    },
    {
      title: 'Technical report — documenting the Knowledge Management System',
      concept: `The final step is **documentation**: recording what you built, how it works, what it reveals, and what its limitations are. A well-documented project becomes a **portfolio piece** that demonstrates your skills.

Your Knowledge Management System documentation should include:

1. **Introduction** — what problem does it solve?
2. **Architecture** — what components does it have and how do they connect?
3. **Algorithms** — what algorithms power each component?
4. **Results** — what did the destruction simulation reveal?
5. **Limitations** — what does the model simplify or ignore?
6. **Future work** — how could it be extended?

This is a **technical report** — the standard format in engineering and computer science. The structure forces clarity: you can't hand-wave when you have to fill in each section.

📚 *The ability to write clear technical documentation is the most underrated skill in software engineering. Code that works but can't be understood is code that will be rewritten — badly — by the next developer.*`,
      analogy: 'A technical report is like a recipe that also explains the science: not just "heat to 180 degrees" but "heat to 180 degrees because the Maillard reaction begins at 140 degrees and we want it to proceed at a controlled rate." It tells the reader what, how, AND why — so they can reproduce, evaluate, and improve your work.',
      storyConnection: 'The greatest loss from Alexandria may not be the destroyed scrolls but the destroyed documentation. We know the Library existed and roughly what it contained, but the Pinakes — Callimachus\'s 120-volume catalogue — is itself lost. We don\'t know the full extent of what we lost. Your documentation ensures your work outlasts the code.',
      checkQuestion: 'Why should a technical report document limitations? Doesn\'t that make the project look incomplete?',
      checkAnswer: 'The opposite. Every model is a simplification — documenting what you simplified shows engineering maturity. A reader who trusts results without knowing limitations is being misled. A reader who trusts results despite knowing limitations is making an informed decision. Documenting limitations is a sign of rigour, not weakness.',
      codeIntro: 'Generate the complete technical report for the Knowledge Management System.',
      code: `# Knowledge Management System — Technical Report

print("""
================================================================
        KNOWLEDGE MANAGEMENT SYSTEM
        Inspired by the Library of Alexandria
              Technical Report
================================================================

1. INTRODUCTION
---------------
This system models the Library of Alexandria as a knowledge
graph — a network of scholars, works, and concepts connected
by citation, authorship, and intellectual influence.

The system answers four questions:
  (a) How was ancient knowledge organized? (Graph database)
  (b) How could scholars find specific knowledge? (Search engine)
  (c) Which scholars and works were most important? (PageRank)
  (d) What happened when the Library was destroyed? (Simulation)

2. ARCHITECTURE
--------------
The system has five integrated components:

  +-------------------+
  | Graph Database    |  Stores nodes (scholars, works, concepts)
  | (Adjacency Lists) |  and typed, weighted edges (citations,
  +--------+----------+  authorship, influence)
           |
  +--------v----------+     +-----------------+
  | Inverted Index    |---->| Search Engine   |
  | (TF-IDF scoring)  |     | (TF-IDF + PR)   |
  +-------------------+     +--------+--------+
                                      |
  +-------------------+     +--------v--------+
  | PageRank Engine   |---->| Combined Ranker |
  | (Iterative)       |     +-----------------+
  +-------------------+
           |
  +--------v----------+
  | Destruction Sim   |  Removes nodes, recomputes metrics,
  | (Monte Carlo)     |  tracks entropy and connectivity
  +-------------------+

3. ALGORITHMS
-------------
  Graph DB:    Adjacency list, BFS/DFS, shortest path
  Search:      Inverted index with TF-IDF scoring
  Ranking:     PageRank (damping=0.85, 50 iterations)
  Combined:    score = alpha * TF-IDF + (1-alpha) * PageRank
  Destruction: Sequential node removal, entropy tracking,
               component analysis after each event

4. KEY RESULTS
--------------
  - Euclid and Aristotle have the highest PageRank — they
    are the most-cited scholars in the network
  - Eratosthenes has the highest betweenness centrality —
    he bridges mathematics, astronomy, and geography
  - Losing 60% of scrolls destroys ~80% of knowledge due
    to network effects (cascading disconnection)
  - Targeted destruction (specific subjects) causes more
    entropy loss than random destruction of equal magnitude
  - The Pinakes (catalogue) is a single point of failure:
    losing it makes the remaining collection unsearchable

5. LIMITATIONS
--------------
  - Simplified citation network (~15 scholars vs thousands)
  - Scroll contents are keywords, not full text
  - Destruction events use estimated, not historical, losses
  - No temporal evolution (the Library grew over centuries)
  - PageRank assumes static network (no new citations)
  - No geographic modelling (scrolls stored in multiple
    buildings across Alexandria)

6. FUTURE IMPROVEMENTS
----------------------
  - Scale to thousands of scholars using historical records
  - Add temporal dimension (network growth 300 BC - 700 AD)
  - Model scroll copying and geographic distribution
  - Implement approximate nearest-neighbour search for
    similarity-based discovery
  - Add natural language processing for richer text analysis
  - Compare to other ancient libraries (Pergamon, Rome)

7. SKILLS DEMONSTRATED
----------------------
""")

skills = [
    ("Data Structures", "Hash tables, B-trees, inverted indices, adjacency lists"),
    ("Graph Algorithms", "BFS, DFS, shortest path, PageRank, betweenness centrality"),
    ("Information Theory", "Shannon entropy, Huffman coding, TF-IDF"),
    ("Database Design", "Normalization (1NF-3NF), relational model, graph database"),
    ("Search Engineering", "Inverted index, TF-IDF scoring, combined ranking"),
    ("Network Science", "Percolation theory, cascading failures, resilience analysis"),
    ("Simulation", "Monte Carlo methods, progressive destruction modelling"),
    ("System Design", "Component architecture, data model design, API design"),
    ("Technical Writing", "Structured reports, limitation analysis, documentation"),
]

for skill, detail in skills:
    print(f"  {skill:<24} {detail}")

print()
print("=" * 64)
print("  This project demonstrates that the challenges of organising,")
print("  searching, preserving, and protecting knowledge are timeless")
print("  — the same problems the Ptolemies faced 2,300 years ago are")
print("  solved today with the algorithms you just built.")
print("=" * 64)`,
      challenge: 'Extend the report with a "Comparative Analysis" section: compare your system to a real knowledge management tool (Wikipedia, Google Scholar, or a library catalogue system). What features does the real system have that yours doesn\'t? What would it take to add them? This exercise connects your project to the real world.',
      successHint: 'You completed a full software engineering project cycle: requirements analysis, system design, implementation, testing, analysis, and documentation. The Knowledge Management System you built uses real algorithms (PageRank, TF-IDF, B-trees, Huffman coding) to solve a real problem (organising and preserving knowledge). This is a portfolio project that demonstrates both computer science depth and the ability to communicate technical work clearly.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Knowledge Management System</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Knowledge Management System inspired by the Library of Alexandria.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L4-${i + 1}`}
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
