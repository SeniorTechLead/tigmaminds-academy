import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function IncaRoadsLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Catenary mathematics — the hyperbolic cosine derivation',
      concept: `When a rope or chain hangs freely between two supports, it forms a curve called a **catenary** — from the Latin *catena* meaning "chain." This curve is NOT a parabola (a common misconception). It's described by the **hyperbolic cosine function**:

**y(x) = a \u00b7 cosh(x/a) = a \u00b7 (e^(x/a) + e^(-x/a)) / 2**

where *a* is a parameter related to the rope's weight per unit length and the horizontal tension. The derivation starts from force balance: at any point on the rope, three forces act — tension pulling left, tension pulling right, and weight pulling down. Setting these equal produces a differential equation whose solution is cosh.

Why does this matter for bridges? A suspension bridge cable under its own weight forms a catenary. Under a uniformly distributed deck load, it forms a parabola. Inca rope bridges carried both their own weight AND the load of travellers — the actual shape is between a catenary and a parabola.

\ud83d\udcda *The hyperbolic functions cosh(x) and sinh(x) are defined using exponentials: cosh(x) = (e^x + e^{-x})/2 and sinh(x) = (e^x - e^{-x})/2. They satisfy the identity cosh\u00b2(x) - sinh\u00b2(x) = 1, analogous to cos\u00b2 + sin\u00b2 = 1 for trigonometric functions.*`,
      analogy: 'Hold a necklace by both ends and let the middle hang freely. The curve it makes is a catenary. Now lay a heavy book across the middle of the necklace — the curve changes shape because the load distribution changed. Inca engineers understood this instinctively: they twisted thicker cables for heavier bridges because the load changes the curve and the tension.',
      storyConnection: 'The Q\'eswachaka bridge in Peru is rebuilt every year using the same Inca techniques — hand-twisted grass ropes forming a catenary span across a 28-metre gorge. The master builders (chakarauwaq) adjust rope thickness based on span length, knowing that longer spans mean greater sag and higher tension at the anchors.',
      checkQuestion: 'A catenary cable has parameter a = 50 m. What is y(0) — the height at the lowest point? What is y(20) — the height 20 m from centre?',
      checkAnswer: 'y(0) = 50 \u00b7 cosh(0/50) = 50 \u00b7 1 = 50 m. y(20) = 50 \u00b7 cosh(20/50) = 50 \u00b7 cosh(0.4) = 50 \u00b7 1.0811 = 54.05 m. The cable rises 4.05 m over a horizontal distance of 20 m — a gentle curve because a is large relative to x.',
      codeIntro: 'Derive and compute catenary curves for Inca rope bridges of different span lengths.',
      code: `import numpy as np

def catenary(x, a):
    """Catenary curve: y = a * cosh(x/a)"""
    return a * np.cosh(x / a)

def catenary_length(span, a):
    """Arc length of catenary over [-span/2, span/2]"""
    return 2 * a * np.sinh(span / (2 * a))

def max_tension(a, weight_per_m):
    """Maximum tension occurs at the supports."""
    return weight_per_m * a  # horizontal component

# Inca bridge parameters
bridges = [
    {"name": "Short footbridge",   "span_m": 15,  "sag_ratio": 0.10},
    {"name": "Q'eswachaka style",  "span_m": 28,  "sag_ratio": 0.12},
    {"name": "Major river crossing","span_m": 45,  "sag_ratio": 0.15},
    {"name": "Deep gorge bridge",  "span_m": 60,  "sag_ratio": 0.18},
]

rope_weight_per_m = 8.0  # kg/m for thick ichu grass cable

print("=== Catenary Analysis of Inca Rope Bridges ===")
print(f"{'Bridge':<24} {'Span':>6} {'Sag':>6} {'a param':>8} {'Rope len':>9} {'Max T (kN)':>11}")
print("-" * 66)

for b in bridges:
    sag = b["span_m"] * b["sag_ratio"]
    # Solve for catenary parameter a from sag: sag = a*(cosh(L/2a) - 1)
    # Use iterative approach
    a_est = b["span_m"]**2 / (8 * sag)  # parabolic approximation as start
    for _ in range(20):  # Newton iterations
        f = a_est * (np.cosh(b["span_m"] / (2 * a_est)) - 1) - sag
        fp = np.cosh(b["span_m"]/(2*a_est)) - 1 - (b["span_m"]/(2*a_est)) * np.sinh(b["span_m"]/(2*a_est))
        if abs(fp) > 1e-10:
            a_est -= f / fp

    rope_len = catenary_length(b["span_m"], a_est)
    tension_n = max_tension(a_est, rope_weight_per_m * 9.81)
    tension_kn = tension_n / 1000

    print(f"{b['name']:<24} {b['span_m']:>4.0f}m {sag:>4.1f}m {a_est:>7.1f}m {rope_len:>7.1f}m {tension_kn:>9.1f}")

# Compare catenary vs parabola
print("\\n=== Catenary vs Parabola Comparison (28m span) ===")
span = 28
sag = 3.36
a_cat = span**2 / (8 * sag)
for _ in range(20):
    f = a_cat * (np.cosh(span/(2*a_cat)) - 1) - sag
    fp = np.cosh(span/(2*a_cat)) - 1 - (span/(2*a_cat))*np.sinh(span/(2*a_cat))
    if abs(fp) > 1e-10:
        a_cat -= f / fp

x_pts = np.linspace(-span/2, span/2, 9)
print(f"{'x (m)':>8} {'Catenary':>10} {'Parabola':>10} {'Diff (cm)':>10}")
print("-" * 40)
for x in x_pts:
    y_cat = a_cat * np.cosh(x / a_cat) - a_cat
    y_par = (4 * sag / span**2) * x**2
    diff_cm = abs(y_cat - y_par) * 100
    print(f"{x:>7.1f} {y_cat:>9.3f}m {y_par:>9.3f}m {diff_cm:>8.1f}")`,
      challenge: 'Inca bridges used multiple parallel cables — typically 4 for the walkway and 2 for handrails. Calculate the total rope length needed for a Q\'eswachaka-style bridge with 6 cables, adding 15% extra for anchoring. How does the required ichu grass quantity scale with span length?',
      successHint: 'The catenary is one of the most elegant curves in mathematics — its equation arises from pure force balance, and it appears everywhere: power lines, spider webs, architectural arches (inverted catenary = optimal arch). You derived it from physics, not just memorised a formula.',
    },
    {
      title: 'Minimum spanning trees — Kruskal and Prim algorithms',
      concept: `The Inca road network (Qhapaq Nan) connected hundreds of cities across 40,000 km of terrain. But you don't need a direct road between every pair of cities — you need a **spanning tree**: a subset of roads that connects all cities with **minimum total cost**.

A **minimum spanning tree (MST)** is the cheapest set of edges that keeps every node connected in a graph. Two classic algorithms find it:

**Kruskal's algorithm**: Sort all edges by weight. Add the cheapest edge that doesn't create a cycle. Repeat until all nodes are connected.

**Prim's algorithm**: Start from any node. Add the cheapest edge connecting a visited node to an unvisited node. Repeat until all nodes are visited.

Both produce the same MST but work differently: Kruskal is edge-centric (process edges globally), Prim is node-centric (grow from a starting point). Kruskal runs in O(E log E), Prim in O(E log V) with a priority queue.

\ud83d\udcda *A spanning tree of a graph with V vertices always has exactly V-1 edges. It's the minimum number of edges needed to keep everything connected — remove any one edge and the graph splits in two.*`,
      analogy: 'Imagine connecting 10 houses with roads. You could build a road between every pair (45 roads — expensive). Or you could find the cheapest 9 roads that still let everyone reach everyone else. That\'s the MST — the most efficient network. The Inca faced exactly this problem: which mountain passes and river crossings to build roads through.',
      storyConnection: 'The Qhapaq Nan was not a random collection of roads — it was a deliberately optimised network. The main north-south highways (one coastal, one highland) formed the backbone, with lateral roads connecting them. This two-spine architecture is remarkably close to what MST algorithms would produce given the geography.',
      checkQuestion: 'A network has 6 cities. City A-B costs 3, A-C costs 5, B-C costs 2, B-D costs 7, C-D costs 4, C-E costs 6, D-E costs 3, D-F costs 8, E-F costs 5. What is the MST?',
      checkAnswer: 'Kruskal: sort edges: B-C(2), A-B(3), D-E(3), C-D(4), A-C(5), E-F(5), C-E(6), B-D(7), D-F(8). Add B-C(2), A-B(3), D-E(3), C-D(4), E-F(5). Skip A-C (cycle), C-E (cycle). MST cost = 2+3+3+4+5 = 17. Five edges for six cities.',
      codeIntro: 'Implement Kruskal and Prim algorithms on a model of the Inca road network.',
      code: `import numpy as np

class UnionFind:
    """Union-Find data structure for cycle detection in Kruskal's."""
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False
        if self.rank[rx] < self.rank[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1
        return True

# Inca cities with approximate positions (km from Cusco)
cities = ["Cusco", "Ollantaytambo", "Machu Picchu", "Huanuco Pampa",
          "Cajamarca", "Quito", "Nazca", "Arequipa", "Tiwanaku", "Tomebamba"]
n = len(cities)

# Edge list: (city_i, city_j, cost_km) — terrain-adjusted distances
edges = [
    (0,1,72), (0,6,450), (0,7,310), (0,8,380),
    (1,2,45), (1,3,520),
    (3,4,600), (3,5,1800),
    (4,5,1200), (4,9,900),
    (5,9,480),
    (0,3,580), (6,7,560),
    (7,8,290), (8,0,380),
    (2,3,650), (9,5,480),
]

# Kruskal's algorithm
def kruskal(n_nodes, edge_list):
    sorted_edges = sorted(edge_list, key=lambda e: e[2])
    uf = UnionFind(n_nodes)
    mst = []
    total = 0
    for u, v, w in sorted_edges:
        if uf.union(u, v):
            mst.append((u, v, w))
            total += w
            if len(mst) == n_nodes - 1:
                break
    return mst, total

mst_edges, mst_cost = kruskal(n, edges)

print("=== Minimum Spanning Tree (Kruskal's Algorithm) ===")
print(f"{'From':<18} {'To':<18} {'Distance (km)':>14}")
print("-" * 52)
for u, v, w in mst_edges:
    print(f"{cities[u]:<18} {cities[v]:<18} {w:>12}")
print(f"\\nTotal MST distance: {mst_cost:,} km")
print(f"Edges used: {len(mst_edges)} (connecting {n} cities)")

# Compare to full network
total_all = sum(e[2] for e in edges)
print(f"\\nFull network: {total_all:,} km ({len(edges)} edges)")
print(f"MST saves: {total_all - mst_cost:,} km ({(1 - mst_cost/total_all)*100:.0f}% reduction)")

# Prim's algorithm for comparison
def prim(n_nodes, edge_list):
    adj = [[] for _ in range(n_nodes)]
    for u, v, w in edge_list:
        adj[u].append((v, w))
        adj[v].append((u, w))

    visited = [False] * n_nodes
    visited[0] = True
    mst = []
    total = 0

    for _ in range(n_nodes - 1):
        best_edge = None
        best_w = float('inf')
        for node in range(n_nodes):
            if not visited[node]:
                continue
            for nbr, w in adj[node]:
                if not visited[nbr] and w < best_w:
                    best_w = w
                    best_edge = (node, nbr, w)
        if best_edge:
            mst.append(best_edge)
            total += best_edge[2]
            visited[best_edge[1]] = True

    return mst, total

prim_edges, prim_cost = prim(n, edges)
print(f"\\nPrim's MST cost: {prim_cost:,} km (same as Kruskal: {prim_cost == mst_cost})")`,
      challenge: 'The MST is the cheapest connected network, but it has no redundancy — if one road is destroyed (landslide, flood), the network splits. Add the cheapest non-MST edge to create a single cycle. This gives the "minimum 2-edge-connected subgraph" — a network that survives one failure.',
      successHint: 'MST algorithms are used everywhere: network design (telecommunications, power grids), clustering in machine learning, image segmentation in computer vision, and circuit design. You implemented both major algorithms and compared them — a fundamental skill in graph algorithms.',
    },
    {
      title: 'Quipu arithmetic — base-20 operations and positional encoding',
      concept: `The Inca used **quipus** — knotted string devices — for record-keeping and arithmetic. Quipus encoded numbers using a **positional system**: each cluster of knots on a string represents a power of 10, with the value indicated by the number of knots in the cluster.

But the Inca counting system was fundamentally **vigesimal (base-20)** for large quantities — groupings of 20 were used in census, taxation, and military organisation (the decimal encoding on quipus was a recording convention, while the administrative system used base-20 divisions called *pachaka* for 100, *waranga* for 1,000).

To understand base-N arithmetic: in base-10, the number 347 means 3\u00d710\u00b2 + 4\u00d710\u00b9 + 7\u00d710\u2070. In base-20, the digits go from 0-19, and each position is a power of 20. So the base-20 number [3, 7, 12] means 3\u00d720\u00b2 + 7\u00d720\u00b9 + 12\u00d720\u2070 = 1200 + 140 + 12 = 1,352.

\ud83d\udcda *Positional notation is the key insight: the VALUE of a digit depends on its POSITION. This is what makes arithmetic efficient — the same algorithm works regardless of the number's size.*`,
      analogy: 'Think of an abacus with columns. In a decimal abacus, each column is worth 10\u00d7 the column to its right. In a base-20 abacus, each column is worth 20\u00d7. The Inca quipu is a textile abacus — each cluster of knots is a column, and the position along the string determines the power of the base.',
      storyConnection: 'The chasqui runners who carried messages along the Qhapaq Nan also carried quipus — encoded records of census data, tribute tallies, and supply inventories. A quipu arriving in Cusco from a distant province could report the exact number of llamas, bushels of maize, and able-bodied workers — all encoded in knots.',
      checkQuestion: 'Convert the decimal number 8,432 to base-20. What digits would appear on the quipu?',
      checkAnswer: '8,432 \u00f7 20 = 421 remainder 12. 421 \u00f7 20 = 21 remainder 1. 21 \u00f7 20 = 1 remainder 1. So 8,432 in base-20 is [1, 1, 1, 12] — reading top to bottom on the quipu: 1\u00d720\u00b3 + 1\u00d720\u00b2 + 1\u00d720 + 12 = 8000 + 400 + 20 + 12 = 8,432.',
      codeIntro: 'Build a quipu encoder/decoder and perform base-20 arithmetic operations.',
      code: `import numpy as np

def to_base(n, base=20):
    """Convert decimal integer to base-N digit list (most significant first)."""
    if n == 0:
        return [0]
    digits = []
    while n > 0:
        digits.append(n % base)
        n //= base
    return digits[::-1]

def from_base(digits, base=20):
    """Convert base-N digit list to decimal integer."""
    result = 0
    for d in digits:
        result = result * base + d
    return result

def base_add(a_digits, b_digits, base=20):
    """Add two base-N numbers with carry propagation."""
    # Pad to same length
    max_len = max(len(a_digits), len(b_digits))
    a = [0] * (max_len - len(a_digits)) + a_digits
    b = [0] * (max_len - len(b_digits)) + b_digits
    result = [0] * (max_len + 1)
    carry = 0
    for i in range(max_len - 1, -1, -1):
        total = a[i] + b[i] + carry
        result[i + 1] = total % base
        carry = total // base
    result[0] = carry
    # Remove leading zeros
    while len(result) > 1 and result[0] == 0:
        result.pop(0)
    return result

# Census data from Inca provinces (in decimal)
provinces = [
    {"name": "Chinchaysuyu", "llamas": 12450, "maize_bushels": 34200, "workers": 8750},
    {"name": "Antisuyu",     "llamas": 6800,  "maize_bushels": 18500, "workers": 4200},
    {"name": "Kuntisuyu",    "llamas": 9300,  "maize_bushels": 25600, "workers": 6100},
    {"name": "Qullasuyu",    "llamas": 15200, "maize_bushels": 41000, "workers": 11300},
]

print("=== Quipu Encoding: Provincial Census ===")
print(f"{'Province':<16} {'Llamas':>8} {'Base-20 Quipu':>18} {'Decoded':>10}")
print("-" * 54)

for p in provinces:
    b20 = to_base(p["llamas"], 20)
    decoded = from_base(b20, 20)
    knot_str = "-".join(str(d) for d in b20)
    print(f"{p['name']:<16} {p['llamas']:>8} [{knot_str:>14}] {decoded:>8}")

# Base-20 addition: sum all provincial llamas
print("\\n=== Base-20 Addition: Total Empire Llamas ===")
running_total = to_base(0, 20)
for p in provinces:
    province_b20 = to_base(p["llamas"], 20)
    running_total = base_add(running_total, province_b20, 20)
    total_dec = from_base(running_total, 20)
    knot_str = "-".join(str(d) for d in running_total)
    print(f"  + {p['name']:<14} [{knot_str}] = {total_dec:,} llamas")

# Multiplication via repeated addition (how quipu operators computed)
print("\\n=== Base-20 Multiplication (tax calculation) ===")
tax_rate_pct = 15  # 15% tribute
for p in provinces:
    tax = p["maize_bushels"] * tax_rate_pct // 100
    tax_b20 = to_base(tax, 20)
    knot_str = "-".join(str(d) for d in tax_b20)
    print(f"  {p['name']:<14} Maize: {p['maize_bushels']:>6} -> Tax ({tax_rate_pct}%): {tax:>5} [{knot_str}]")

empire_total = sum(p["llamas"] for p in provinces)
print(f"\\nEmpire total llamas: {empire_total:,}")
print(f"Base-20 encoding: [{'-'.join(str(d) for d in to_base(empire_total, 20))}]")`,
      challenge: 'The Inca used a base-10 recording system on quipus but a base-20 administrative grouping. Implement a "dual base" converter that shows the same number in base-10 (quipu knots) and base-20 (administrative groups of pachaka/waranga). Which base is more efficient for encoding large numbers? (Fewer digits = fewer knot clusters.)',
      successHint: 'You implemented positional arithmetic from scratch — the same system underpinning every computer (which uses base-2). Understanding base conversion is fundamental to computer science, and the quipu is one of the most ingenious non-written data storage systems ever invented.',
    },
    {
      title: 'Haemoglobin-oxygen dissociation curves — altitude physiology',
      concept: `The Inca road network crossed altitudes from sea level to over 5,000 m. At high altitude, the air contains less oxygen — at 4,000 m, the partial pressure of O\u2082 is only 60% of sea level. How did the Inca thrive at these altitudes?

The answer is in the **haemoglobin-oxygen dissociation curve**: a sigmoid (S-shaped) curve describing how haemoglobin (Hb) binds and releases oxygen at different partial pressures. The curve is described by the **Hill equation**:

**Y = pO\u2082\u207f / (P\u2085\u2080\u207f + pO\u2082\u207f)**

where Y is fractional saturation (0-1), pO\u2082 is oxygen partial pressure (mmHg), P\u2085\u2080 is the pressure at 50% saturation (~26.6 mmHg), and n is the Hill coefficient (~2.8 for human Hb).

The sigmoid shape is critical: at lung pressures (100 mmHg at sea level), Hb is ~98% saturated. At tissue pressures (40 mmHg), it's ~75% saturated — so Hb releases ~23% of its oxygen to tissues. At altitude, lung pressure drops, but the steep part of the sigmoid means saturation doesn't drop as fast as you'd expect.

\ud83d\udcda *Cooperative binding: when one O\u2082 molecule binds to haemoglobin, it changes shape, making it easier for the next O\u2082 to bind. This is why the curve is sigmoid, not linear — and why n > 1.*`,
      analogy: 'Imagine a bus with 4 seats. The first passenger boards reluctantly (low affinity). But once they sit down, the bus becomes "friendlier" and subsequent passengers board eagerly (higher affinity). This is cooperative binding — haemoglobin\'s 4 oxygen-binding sites work the same way.',
      storyConnection: 'Andean populations evolved larger lung capacity, higher haemoglobin concentrations, and a slightly right-shifted dissociation curve compared to lowland populations. These adaptations meant Inca runners (chasquis) could sprint at 4,000 m altitude — a feat that would incapacitate unadapted lowlanders. The road network was designed with altitude in mind: relay stations (tambos) were spaced closer together at higher altitudes.',
      checkQuestion: 'At sea level, atmospheric pressure is 760 mmHg and O\u2082 is 21%, giving pO\u2082 = 160 mmHg (alveolar ~100 mmHg). At 4,000 m, atmospheric pressure is ~460 mmHg. What is the alveolar pO\u2082?',
      checkAnswer: 'Inspired pO\u2082 = 0.21 \u00d7 460 = 96.6 mmHg. After accounting for water vapour and CO\u2082 in the lungs (subtract ~50 mmHg), alveolar pO\u2082 \u2248 47 mmHg. Using the Hill equation: Y = 47^2.8 / (26.6^2.8 + 47^2.8) \u2248 0.82 = 82% saturation. Compare to sea level (~97%) — a 15% drop that triggers acclimatization responses.',
      codeIntro: 'Model haemoglobin-oxygen dissociation at different altitudes along the Inca road network.',
      code: `import numpy as np

def hill_equation(pO2, P50=26.6, n=2.8):
    """Haemoglobin-oxygen saturation (Hill equation)."""
    return pO2**n / (P50**n + pO2**n)

def altitude_to_pressure(alt_m):
    """Atmospheric pressure at altitude (barometric formula)."""
    return 760 * np.exp(-alt_m / 7400)  # mmHg

def alveolar_pO2(alt_m):
    """Approximate alveolar pO2 at given altitude."""
    p_atm = altitude_to_pressure(alt_m)
    p_inspired = 0.21 * (p_atm - 47)  # subtract water vapour
    return p_inspired - 5  # subtract alveolar CO2 exchange offset

# Altitudes along the Qhapaq Nan
waypoints = [
    ("Coastal desert (Nazca)", 500),
    ("Andean foothills", 2000),
    ("Cusco", 3400),
    ("High plateau (Altiplano)", 3800),
    ("Mountain pass", 4500),
    ("Highest point (Abra Runkurakay)", 5000),
]

print("=== Oxygen Saturation Along the Qhapaq Nan ===")
print(f"{'Location':<34} {'Alt (m)':>8} {'pO2':>6} {'Hb Sat%':>8} {'O2 delivery':>12}")
print("-" * 70)

sea_level_delivery = 1.0  # normalised
for name, alt in waypoints:
    pO2 = alveolar_pO2(alt)
    sat = hill_equation(pO2) * 100
    # O2 delivery = saturation × cardiac output adjustment
    cardiac_adj = 1 + 0.15 * (alt / 4000)  # heart rate increases at altitude
    delivery = (sat / 97) * cardiac_adj
    print(f"{name:<34} {alt:>6} {pO2:>5.1f} {sat:>6.1f}% {delivery:>10.2f}x")

# Compare adapted vs unadapted populations
print("\\n=== Adapted (Andean) vs Unadapted Physiology ===")
print(f"{'Altitude':>8} {'Unadapted Sat%':>15} {'Adapted Sat%':>13} {'Adapted advantage':>18}")
print("-" * 56)

for alt in [0, 2000, 3400, 4000, 4500, 5000]:
    pO2_normal = alveolar_pO2(alt)
    # Adapted: higher Hb concentration (18 vs 15 g/dL) and slightly lower P50
    sat_normal = hill_equation(pO2_normal, P50=26.6, n=2.8) * 100
    sat_adapted = hill_equation(pO2_normal, P50=24.0, n=2.8) * 100  # left-shifted
    hb_factor = 18 / 15  # more haemoglobin
    advantage = (sat_adapted * hb_factor) / sat_normal * 100 - 100
    print(f"{alt:>6}m {sat_normal:>13.1f}% {sat_adapted:>11.1f}% {advantage:>15.1f}% more O2")`,
      challenge: 'The Hill coefficient n describes cooperativity. At n=1 (no cooperativity, like myoglobin), the curve is hyperbolic, not sigmoid. Plot saturation at pO2=40 mmHg (tissue level) for n=1.0, 1.5, 2.0, 2.8, and 4.0. Why is n=2.8 the "sweet spot" for oxygen delivery — what happens if n is too high or too low?',
      successHint: 'You modelled one of the most important curves in physiology — the oxygen dissociation curve. It explains why climbers need supplemental oxygen above 8,000 m, why blood transfusions work, and why carbon monoxide is lethal (it left-shifts the curve, preventing O\u2082 release to tissues). The Hill equation is also used in pharmacology to model drug-receptor binding.',
    },
    {
      title: 'Supply chain optimisation with warehouses (qollqa)',
      concept: `The Inca built over **2,500 qollqas** (storehouses) along the Qhapaq Nan — stone buildings designed to store maize, potatoes, dried meat, textiles, and weapons. These weren't randomly placed: they were positioned to **minimise the maximum travel time** from any point on the road to the nearest storehouse.

This is the **facility location problem** in operations research: given a network and a set of demand points, where should you place K facilities (warehouses) to minimise transport costs?

The simplest version is the **K-median problem**: place K facilities to minimise the sum of distances from each demand point to its nearest facility. The greedy algorithm: place the first facility at the location that minimises total distance, then place the second to minimise the remaining distance, and so on.

\ud83d\udcda *The facility location problem is NP-hard (no known fast exact solution for large inputs). But greedy and heuristic algorithms find near-optimal solutions — typically within 10% of optimal, which is good enough for practical use.*`,
      analogy: 'Imagine placing fire stations in a city. You want every house within 5 minutes of a fire station. Placing one station in the centre works for a small town, but a city needs multiple stations positioned so their coverage areas overlap minimally. The Inca faced the same problem: placing qollqas so every tambo and road segment was within reach.',
      storyConnection: 'Inca qollqas at Ollantaytambo, Huanuco Pampa, and other sites stored enough supplies to feed an army on the move. The Inca general could march troops along the Qhapaq Nan knowing that supplies were pre-positioned every 20-30 km — a logistics system that rivalled the Roman cursus publicum.',
      checkQuestion: 'You have 5 demand points at positions 2, 8, 15, 22, and 30 (km). Where should you place 2 warehouses to minimise the maximum distance any point must travel?',
      checkAnswer: 'Place warehouses to minimise the maximum of all minimum-distances. Optimal: place at ~8 and ~25. Point 2 goes to 8 (distance 6), point 8 is at 8 (0), point 15 goes to 8 (7) or 25 (10) — closer to 8, point 22 goes to 25 (3), point 30 goes to 25 (5). Max distance = 7 km. Any other placement increases the maximum.',
      codeIntro: 'Solve the facility location problem for qollqa placement along the Inca road network.',
      code: `import numpy as np

def total_transport_cost(facilities, demand_points):
    """Sum of distances from each demand point to nearest facility."""
    total = 0
    for d in demand_points:
        min_dist = min(abs(d - f) for f in facilities)
        total += min_dist
    return total

def max_distance(facilities, demand_points):
    """Maximum distance from any demand point to nearest facility."""
    return max(min(abs(d - f) for f in facilities) for d in demand_points)

# Road segments (km from Cusco) with demand (population/traffic)
road_points = [
    {"km": 0,    "name": "Cusco",           "demand": 100},
    {"km": 72,   "name": "Ollantaytambo",   "demand": 40},
    {"km": 120,  "name": "Abancay",         "demand": 30},
    {"km": 210,  "name": "Andahuaylas",     "demand": 25},
    {"km": 340,  "name": "Huamanga",        "demand": 35},
    {"km": 450,  "name": "Nazca junction",  "demand": 20},
    {"km": 580,  "name": "Huanuco Pampa",   "demand": 50},
    {"km": 720,  "name": "Cajamarca",       "demand": 45},
    {"km": 920,  "name": "Chachapoyas",     "demand": 15},
    {"km": 1200, "name": "Tomebamba",       "demand": 30},
    {"km": 1600, "name": "Quito",           "demand": 60},
]

km_positions = [p["km"] for p in road_points]
demands = [p["demand"] for p in road_points]

# Greedy facility placement
def greedy_facility_placement(positions, n_facilities):
    """Greedily place facilities to minimise total weighted distance."""
    candidates = np.linspace(min(positions), max(positions), 200)
    facilities = []

    for k in range(n_facilities):
        best_loc = None
        best_cost = float('inf')
        for c in candidates:
            test = facilities + [c]
            cost = total_transport_cost(test, positions)
            if cost < best_cost:
                best_cost = cost
                best_loc = c
        facilities.append(best_loc)

    return facilities

# Find optimal qollqa placements for different budgets
print("=== Qollqa (Storehouse) Placement Optimisation ===")
print(f"Road length: {max(km_positions)} km | {len(road_points)} demand points\\n")

for n_qollqa in [2, 4, 6, 8]:
    facilities = greedy_facility_placement(km_positions, n_qollqa)
    cost = total_transport_cost(facilities, km_positions)
    max_d = max_distance(facilities, km_positions)

    print(f"--- {n_qollqa} Qollqas ---")
    print(f"  Locations (km): {', '.join(f'{f:.0f}' for f in sorted(facilities))}")
    print(f"  Total transport: {cost:.0f} km  |  Max distance: {max_d:.0f} km")

    # Show assignments
    for p in road_points:
        nearest = min(facilities, key=lambda f: abs(p["km"] - f))
        dist = abs(p["km"] - nearest)
        print(f"    {p['name']:<18} -> qollqa at {nearest:>6.0f} km (dist: {dist:>4.0f} km)")
    print()

# Diminishing returns analysis
print("=== Diminishing Returns: More Qollqas vs Less Distance ===")
for n in range(1, 12):
    facs = greedy_facility_placement(km_positions, n)
    cost = total_transport_cost(facs, km_positions)
    max_d = max_distance(facs, km_positions)
    bar = "#" * int(max_d / 20)
    print(f"  {n:>2} qollqas: total={cost:>5.0f}km  max_dist={max_d:>4.0f}km  {bar}")`,
      challenge: 'Add a weight factor: high-demand locations (Cusco, Quito) should have lower maximum distances than low-demand outposts. Modify the cost function to weight distances by demand. How does this change the optimal placement? (Warehouses shift toward population centres — the same trade-off Amazon faces with its fulfilment centres.)',
      successHint: 'Facility location is one of the most practically important problems in operations research. Amazon, Walmart, and every logistics company solves this problem to place warehouses. You implemented the greedy algorithm — which produces solutions within a constant factor of optimal — and saw the diminishing returns of adding more facilities.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Engineering analysis and deeper mathematics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into catenary mathematics, graph algorithms, base-20 arithmetic, altitude physiology, and supply chain optimisation.
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
