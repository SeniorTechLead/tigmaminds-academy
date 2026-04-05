import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function IncaRoadsLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Graph theory — modelling the Inca road network',
      concept: `The Inca road network connected thousands of cities, relay posts, and warehouses across 40,000 km of the Andes. To analyze it, we model it as a **graph**: cities are **nodes**, roads are **edges**, and each edge has a **weight** (distance, travel time, or difficulty).

Graph theory — invented by Euler in 1736 — gives us powerful tools:
- **Shortest path**: find the fastest route between two cities (Dijkstra's algorithm)
- **Minimum spanning tree**: find the cheapest network that connects all cities
- **Centrality**: identify the most important nodes in the network
- **Connectivity**: check if every city can reach every other city

The Inca network had **redundancy** — multiple paths between important cities. If a landslide blocked one road, messages could still get through on alternative routes. This is the same principle used in the Internet — data can take multiple routes.

📚 *A graph with n nodes can have up to n(n-1)/2 edges (a complete graph). The minimum number of edges to keep all nodes connected is n-1 (a tree). Real networks fall between these extremes.*`,
      analogy: 'A highway map is a graph. Cities = nodes. Highways = edges. Google Maps finds the "shortest path" in this graph every time you ask for directions. The Inca road system was the same problem — just solved without computers, over terrain far more challenging than any modern highway.',
      storyConnection: 'The Qhapaq Nan had a main trunk road (the Royal Road) along the mountain spine, connected to secondary roads descending to the coast and the jungle. This hierarchical structure — main arteries plus smaller connections — is the same topology used by the Internet, the postal system, and airline route networks.',
      checkQuestion: 'A network of 5 cities connected by 4 roads (a tree) has no redundancy. If one road is destroyed, some cities are disconnected. How many roads are needed for every city to have 2 independent paths to every other city?',
      checkAnswer: 'At least 5 — one more than the minimum tree. A cycle through all 5 cities provides exactly 2 independent paths between any pair of cities. Adding more roads (up to the maximum of 10) increases redundancy further.',
      codeIntro: 'Build a model of the Inca road network as a graph and analyze its properties.',
      code: `import numpy as np

class Graph:
    """Simple weighted graph for road network modeling."""

    def __init__(self):
        self.edges = {}  # node: [(neighbor, weight), ...]

    def add_edge(self, a, b, weight):
        if a not in self.edges: self.edges[a] = []
        if b not in self.edges: self.edges[b] = []
        self.edges[a].append((b, weight))
        self.edges[b].append((a, weight))

    def nodes(self):
        return list(self.edges.keys())

    def degree(self, node):
        return len(self.edges.get(node, []))

    def shortest_path(self, start, end):
        """Dijkstra's algorithm — find shortest path."""
        distances = {n: float('inf') for n in self.edges}
        distances[start] = 0
        visited = set()
        previous = {}

        while len(visited) < len(self.edges):
            # Find unvisited node with smallest distance
            current = min(
                (n for n in distances if n not in visited),
                key=lambda n: distances[n],
                default=None
            )
            if current is None or distances[current] == float('inf'):
                break
            visited.add(current)

            for neighbor, weight in self.edges.get(current, []):
                if neighbor not in visited:
                    new_dist = distances[current] + weight
                    if new_dist < distances[neighbor]:
                        distances[neighbor] = new_dist
                        previous[neighbor] = current

        # Reconstruct path
        path = []
        current = end
        while current in previous:
            path.append(current)
            current = previous[current]
        if current == start:
            path.append(start)
        path.reverse()

        return distances[end], path

# Build the Inca road network (simplified)
inca = Graph()

# Major cities and relay posts (distances in km)
roads = [
    ("Cusco", "Huamanga", 350),
    ("Cusco", "Arequipa", 450),
    ("Cusco", "Puno", 380),
    ("Huamanga", "Lima", 560),
    ("Lima", "Cajamarca", 850),
    ("Cajamarca", "Quito", 1100),
    ("Cusco", "La Paz", 500),
    ("La Paz", "Potosi", 450),
    ("Puno", "La Paz", 250),
    ("Arequipa", "Lima", 1000),
    ("Quito", "Tumbes", 600),
    ("Cusco", "Nazca", 450),
    ("Nazca", "Lima", 450),
    ("Cusco", "Machu Picchu", 80),
]

for a, b, d in roads:
    inca.add_edge(a, b, d)

# Network statistics
print("=== Inca Road Network Analysis ===")
print(f"Cities: {len(inca.nodes())}")
print(f"Roads: {len(roads)}")
print()

# Node degrees (number of connections)
print(f"{'City':<20} {'Connections':>12} {'Role'}")
print("-" * 45)
for node in sorted(inca.nodes(), key=lambda n: inca.degree(n), reverse=True):
    deg = inca.degree(node)
    role = "Hub" if deg >= 4 else "Major" if deg >= 3 else "Minor"
    print(f"{node:<20} {deg:>10} {role:>10}")

# Shortest paths from Cusco
print(f"\\n=== Shortest Routes from Cusco ===")
for dest in ["Quito", "Lima", "Potosi", "Tumbes"]:
    dist, path = inca.shortest_path("Cusco", dest)
    path_str = " → ".join(path)
    print(f"  To {dest}: {dist:.0f} km via {path_str}")

# Chasqui relay speed
print(f"\\n=== Chasqui Message Delivery Times ===")
chasqui_speed_km_day = 240  # relay runners

for dest in ["Lima", "Quito", "Potosi"]:
    dist, _ = inca.shortest_path("Cusco", dest)
    days = dist / chasqui_speed_km_day
    print(f"  Cusco → {dest}: {dist:.0f} km = {days:.1f} days by chasqui relay")`,
      challenge: 'Remove the Cusco-Huamanga road (simulating a landslide). Can messages still reach Lima from Cusco? If so, what is the new shortest path and how much longer is it? This demonstrates the value of network redundancy.',
      successHint: 'You built a graph-based route network and implemented Dijkstra\'s algorithm — the same algorithm Google Maps, Uber, and every GPS device uses to find the shortest path. The Inca road network is an ancient example of a problem solved daily by billions of modern devices.',
    },
    {
      title: 'Catenary curves — the physics of rope bridges',
      concept: `A rope hanging from two fixed points forms a **catenary curve** — from the Latin *catena* (chain). This is NOT a parabola (though it looks similar); it's described by the **hyperbolic cosine function**: y = a × cosh(x/a).

The catenary is special because it distributes **tension evenly** along the entire rope. No single point bears more than its share of the load. This is why the Inca rope bridges sagged deeply — more sag means less tension, and less tension means the grass cables last longer.

The tension at the endpoints (anchors) depends on:
- **Weight** of the bridge (heavier = more tension)
- **Span** (longer = more tension)
- **Sag** (more sag = LESS tension — this is counter-intuitive)

The formula: **T = w × L² / (8 × s)** where T is anchor tension, w is weight per unit length, L is the span, and s is the sag.

📚 *The catenary was studied by Huygens, Leibniz, and Johann Bernoulli in the 1690s. The Gateway Arch in St. Louis is an inverted catenary — a catenary turned upside down, where compression replaces tension.*`,
      analogy: 'Hold a chain between your hands and let it sag. Pull your hands apart (increasing span) — the chain tightens, the sag decreases, and you feel more force pulling on your fingers. Let your hands come closer (decreasing span) — the chain sags more, and the force on your fingers decreases. More sag = less tension. The Inca bridges sagged deeply on purpose.',
      storyConnection: 'The Q\'eswachaka bridge over the Apurímac River spans 28 metres and sags deeply — walking across it means descending into a curve and climbing back up. This sag is not a flaw; it\'s what keeps the ichu grass cables from breaking. The bridge has been rebuilt every year by local communities for over 500 years using the same techniques.',
      checkQuestion: 'A bridge spans 30 metres with 3 metres of sag and weighs 50 kg/m. What is the anchor tension?',
      checkAnswer: 'T = w × L² / (8 × s) = 50 × 9.81 × 30² / (8 × 3) = 50 × 9.81 × 900 / 24 = 18,394 N ≈ 18.4 kN. That\'s about the weight of a small car — pulling on each anchor point. If the sag doubled to 6 metres: T = 9,197 N — halved. More sag = less tension.',
      codeIntro: 'Model the catenary curve and calculate rope bridge tension for different spans and sag values.',
      code: `import numpy as np

def catenary(x, a):
    """The catenary curve: y = a × cosh(x/a) - a"""
    return a * (np.cosh(x / a) - 1)

def bridge_tension(span_m, sag_m, weight_per_m_kg):
    """
    Calculate the horizontal tension at the lowest point
    and the tension at the anchor points.
    """
    g = 9.81
    w = weight_per_m_kg * g  # weight per metre (N/m)

    # Horizontal tension at the lowest point
    H = w * span_m**2 / (8 * sag_m)

    # Vertical reaction at each anchor
    V = w * span_m / 2

    # Total tension at anchor (Pythagorean theorem)
    T_anchor = np.sqrt(H**2 + V**2)

    return H, V, T_anchor

# Q'eswachaka bridge parameters
span = 28       # metres
sag = 4         # metres
weight = 15     # kg per metre of bridge

print("=== Inca Rope Bridge Calculator ===")
print(f"Q'eswachaka Bridge: span={span}m, sag={sag}m, weight={weight}kg/m")

H, V, T = bridge_tension(span, sag, weight)
print(f"\\nHorizontal tension: {H:.0f} N ({H/1000:.1f} kN)")
print(f"Vertical reaction: {V:.0f} N ({V/1000:.1f} kN)")
print(f"Anchor tension: {T:.0f} N ({T/1000:.1f} kN)")
print(f"That's {T/9.81:.0f} kg of force on each anchor")

# How sag affects tension
print(f"\\n=== Sag vs Tension (span={span}m, weight={weight}kg/m) ===")
print(f"{'Sag (m)':>8} {'Anchor T (kN)':>14} {'Sag/Span ratio':>16} {'Feasible?':>10}")
print("-" * 50)

for s in [0.5, 1, 2, 3, 4, 5, 6, 8, 10]:
    _, _, T = bridge_tension(span, s, weight)
    ratio = s / span
    # Ichu grass tensile strength ~50 kN for a braided cable
    feasible = "YES" if T < 50000 else "MARGINAL" if T < 80000 else "NO"
    print(f"{s:>6.1f}m {T/1000:>12.1f} {ratio:>14.1%} {feasible:>10}")

# Pedestrian load
print(f"\\n=== Effect of Pedestrian Load ===")
print(f"Empty bridge vs bridge with 5 people (70 kg each):")
total_people_weight = 5 * 70 / span  # distributed as kg/m
total_weight = weight + total_people_weight

_, _, T_empty = bridge_tension(span, sag, weight)
_, _, T_loaded = bridge_tension(span, sag, total_weight)

print(f"  Empty:  {T_empty/1000:.1f} kN")
print(f"  Loaded: {T_loaded/1000:.1f} kN (+{(T_loaded-T_empty)/T_empty*100:.0f}%)")

# Compare with modern suspension bridges
print(f"\\n=== Scale Comparison ===")
bridges = [
    ("Q'eswachaka (Inca)", 28, 4, 15),
    ("Simple footbridge", 50, 5, 30),
    ("Small vehicle bridge", 100, 10, 200),
    ("Golden Gate (main span)", 1280, 143, 15000),
]

print(f"{'Bridge':<30} {'Span':>6} {'Sag':>5} {'Anchor T':>12}")
print("-" * 55)
for name, sp, sa, wt in bridges:
    _, _, T = bridge_tension(sp, sa, wt)
    if T > 1e6:
        T_str = f"{T/1e6:.0f} MN"
    else:
        T_str = f"{T/1000:.0f} kN"
    print(f"{name:<30} {sp:>4}m {sa:>3}m {T_str:>12}")`,
      challenge: 'The Q\'eswachaka bridge is rebuilt every year. If the ichu grass loses 30% of its tensile strength per year due to weathering, what is the maximum safe span for a bridge that\'s 18 months old (70% of original strength)? This is why annual rebuilding is essential — the grass weakens, and the bridge must be replaced before it becomes dangerous.',
      successHint: 'You modeled suspension bridge physics — the same mathematics used to design every suspension bridge, cable car, and zip line in the world. The key insight: more sag = less tension = longer cable life. The Inca bridges' deep sag wasn\'t a flaw — it was brilliant engineering.',
    },
    {
      title: 'The quipu — modelling a knotted-string database',
      concept: `The Inca **quipu** is one of the most unusual data systems ever invented: a set of coloured strings with knots that encode numbers using **base-10 positional notation**.

The **position** of a knot on the string indicates place value: ones at the bottom, tens above, hundreds above that, thousands at the top. The **type** of knot indicates the digit: a long knot with N loops = N in the ones place; clusters of single knots = digits in higher places. The **colour** encodes the data category.

This is equivalent to a modern **spreadsheet**: each string is a row, each position is a column, and the colour is the column header.

The most complex surviving quipus have **thousands of strings** with tens of thousands of knots — databases recording population censuses, tribute payments, warehouse inventories, and possibly narrative information.

📚 *Base-10 positional notation requires zero — the Inca represented zero as the ABSENCE of a knot at a position. This is the same concept as our digit 0: a placeholder meaning "nothing in this column."*`,
      analogy: 'Imagine storing your phone contacts by tying knots in coloured yarn: red yarn = work contacts, blue = family. Position 1 from the bottom = area code digit 1. Two single knots at position 3 = "2" in the hundreds place. Reading the quipu is reading the yarn — your phone does the same thing digitally.',
      storyConnection: 'The Inca managed an empire of 12 million people across 4,000 km of mountains — without a written language. The quipu was their administrative tool: tax records, census data, warehouse inventories, military logistics. Spanish colonizers described quipu-keepers (quipucamayocs) who could retrieve any data from memory faster than the Spanish could look it up in their written records.',
      checkQuestion: 'How would you represent the number 3,042 on a quipu string?',
      checkAnswer: 'From bottom to top: a long knot with 2 loops (ones = 2), then 4 single knots clustered together (tens = 4), then empty space (hundreds = 0), then 3 single knots clustered (thousands = 3). The empty space = zero = no knot at that position.',
      codeIntro: 'Build a quipu data system in Python — encode, store, and retrieve information.',
      code: `import numpy as np

class Quipu:
    """A knotted-string database inspired by the Inca quipu system."""

    def __init__(self):
        self.strings = {}  # category: {label: value}
        self.colours = {}  # category: colour name

    def add_category(self, category, colour):
        """Add a new data category (a new set of strings)."""
        self.colours[category] = colour
        self.strings[category] = {}

    def record(self, category, label, value):
        """Record a number on a string."""
        if category not in self.strings:
            raise ValueError(f"Unknown category: {category}")
        self.strings[category][label] = value

    def read(self, category, label):
        """Read a value from the quipu."""
        return self.strings.get(category, {}).get(label, 0)

    def encode_knots(self, number):
        """
        Convert a number to quipu knot notation.
        Returns a list of (position, knot_type, value) tuples.
        """
        if number == 0:
            return [(0, "empty", 0)]

        knots = []
        position = 0
        remaining = number

        while remaining > 0:
            digit = remaining % 10
            if position == 0 and digit > 0:
                knots.append((position, "long_knot", digit))
            elif digit > 0:
                knots.append((position, "cluster", digit))
            else:
                knots.append((position, "empty", 0))
            remaining //= 10
            position += 1

        return knots

    def display_knots(self, number):
        """Display a number in quipu knot notation."""
        knots = self.encode_knots(number)
        print(f"  Number {number} encoded as:")
        for pos, ktype, val in reversed(knots):
            place = ["ones", "tens", "hundreds", "thousands", "ten-thousands"][pos]
            if ktype == "empty":
                print(f"    {place}: [empty space] = 0")
            elif ktype == "long_knot":
                print(f"    {place}: long knot ({val} loops) = {val}")
            else:
                print(f"    {place}: {val} single knots = {val}")

    def summary(self, category):
        """Print all data in a category."""
        colour = self.colours.get(category, "unknown")
        data = self.strings.get(category, {})
        total = sum(data.values())
        print(f"\\n[{colour} strings] {category}:")
        for label, value in data.items():
            print(f"  {label:<20} {value:>8,}")
        print(f"  {'TOTAL':<20} {total:>8,}")
        return total

# Create an Inca census quipu
census = Quipu()

# Add categories (each represented by a different string colour)
census.add_category("Population", "red")
census.add_category("Soldiers", "crimson")
census.add_category("Grain (tonnes)", "yellow")
census.add_category("Gold (pieces)", "gold")
census.add_category("Llamas", "brown")

# Record data from four provinces
provinces = [
    ("Cusco Province", 45000, 3500, 8200, 450, 12000),
    ("Huamanga Province", 28000, 2100, 5600, 120, 8500),
    ("Cajamarca Province", 35000, 2800, 6900, 280, 9200),
    ("Quito Province", 52000, 4200, 9100, 380, 15000),
]

for prov, pop, sol, grain, gold, llamas in provinces:
    census.record("Population", prov, pop)
    census.record("Soldiers", prov, sol)
    census.record("Grain (tonnes)", prov, grain)
    census.record("Gold (pieces)", prov, gold)
    census.record("Llamas", prov, llamas)

# Display the census
print("=== Inca Census Quipu ===")
print("(Each category = a set of coloured strings)")

totals = {}
for category in census.strings:
    total = census.summary(category)
    totals[category] = total

# Show knot encoding for a specific number
print("\\n=== Knot Encoding Examples ===")
for num in [3042, 507, 12000, 45]:
    census.display_knots(num)

# Data query (what a quipucamayoc would do)
print("\\n=== Census Queries ===")
print(f"Total empire population: {totals['Population']:,}")
print(f"Total soldiers: {totals['Soldiers']:,}")
print(f"Soldiers per capita: {totals['Soldiers']/totals['Population']*100:.1f}%")
print(f"Grain per person: {totals['Grain (tonnes)']*1000/totals['Population']:.0f} kg")
print(f"Largest province: {max(census.strings['Population'], key=census.strings['Population'].get)}")

# Compare with modern data
print(f"\\n=== Quipu vs Modern Database ===")
print(f"{'Feature':<24} {'Quipu':<24} {'SQL Database'}")
print("-" * 72)
comparisons = [
    ("Storage medium", "Knotted strings", "Hard drive / cloud"),
    ("Data encoding", "Base-10 knots", "Binary (0s and 1s)"),
    ("Categories", "String colours", "Column headers"),
    ("Records", "Individual strings", "Rows"),
    ("Index/query", "Quipucamayoc's memory", "SQL queries"),
    ("Backup", "Duplicate quipus", "Database replication"),
    ("Max records", "~1,500 strings", "Billions of rows"),
]
for feature, quipu, modern in comparisons:
    print(f"{feature:<24} {quipu:<24} {modern}")`,
      challenge: 'Add a "tax calculation" method: each province owes 10% of its grain and 5% of its gold as tribute to Cusco. Calculate the total tribute and add it as a new quipu category. This is exactly what the Inca quipucamayocs did — the quipu was their spreadsheet AND their tax calculator.',
      successHint: 'You built a data storage and retrieval system inspired by the quipu — the same functionality as a modern spreadsheet or database, implemented with strings and knots instead of silicon and electrons. The fundamental operations (store, retrieve, aggregate, query) are identical. Data structures are universal; only the encoding changes.',
    },
    {
      title: 'Altitude physiology — modelling oxygen and acclimatization',
      concept: `At **5,000 metres** altitude, the air pressure is about **half** that at sea level. The air still contains 21% oxygen, but there are half as many air molecules in each breath — so you get half the oxygen per breath.

Your body responds with **acclimatization**: increased heart rate, increased breathing rate, and — over days to weeks — increased **red blood cell production** (driven by the hormone EPO). More red blood cells = more haemoglobin = more oxygen-carrying capacity.

The relationship between altitude and oxygen saturation (SpO₂) follows a curve:
- Sea level: SpO₂ ≈ 98%
- 2,000m: SpO₂ ≈ 95%
- 3,500m: SpO₂ ≈ 90%
- 5,000m: SpO₂ ≈ 80%
- 8,000m (Everest summit): SpO₂ ≈ 55%

Below 85% SpO₂, most people experience symptoms: headache, nausea, confusion. Below 70%, there's serious risk of pulmonary or cerebral oedema. Inca chasqui runners operated at altitudes where unacclimatized lowlanders would collapse.

📚 *Oxygen saturation (SpO₂) measures what percentage of your haemoglobin is carrying oxygen. The pulse oximeter on your finger measures this — normal is 95-100%. Below 90% is clinically concerning.*`,
      analogy: 'Imagine a bus (haemoglobin) with 100 seats. At sea level, 98 seats are occupied (SpO₂ = 98%). At 5,000m, only 80 are occupied — not because there are fewer seats, but because there are fewer passengers (oxygen molecules) waiting at the "bus stop" (your lungs). Your body builds more buses (red blood cells) to compensate, but it takes weeks.',
      storyConnection: 'The chasqui relay system operated at altitudes above 4,000 metres — where unacclimatized Europeans of the conquest era collapsed. The Inca runners could sprint at these altitudes because generations of high-altitude living had given them larger lungs, more red blood cells, and higher haemoglobin levels. They were biologically adapted to thin air.',
      checkQuestion: 'Modern altitude training camps for athletes are typically at 2,000-2,500 metres. Why this specific range?',
      checkAnswer: 'High enough to trigger extra red blood cell production (EPO response), but low enough that athletes can still train effectively. Above 3,000m, the oxygen reduction impairs training quality — you can\'t run as fast or as long, so the training stimulus is weaker even though the altitude stimulus is stronger. 2,000-2,500m is the sweet spot.',
      codeIntro: 'Model the relationship between altitude, air pressure, oxygen, and human performance.',
      code: `import numpy as np

def air_pressure(altitude_m):
    """Atmospheric pressure as a function of altitude (barometric formula)."""
    P0 = 101325  # sea level pressure (Pa)
    T0 = 288.15  # sea level temperature (K)
    L = 0.0065   # temperature lapse rate (K/m)
    g = 9.81
    M = 0.029    # molar mass of air (kg/mol)
    R = 8.314    # gas constant

    return P0 * (1 - L * altitude_m / T0) ** (g * M / (R * L))

def oxygen_partial_pressure(altitude_m):
    """Partial pressure of oxygen at altitude."""
    return air_pressure(altitude_m) * 0.2095  # 20.95% oxygen

def spo2_estimate(altitude_m, acclimatized=False):
    """
    Estimate blood oxygen saturation at altitude.
    Simplified oxygen-haemoglobin dissociation model.
    """
    po2 = oxygen_partial_pressure(altitude_m) / 133.322  # convert Pa to mmHg
    # Simplified Hill equation for O2 binding
    p50 = 26.8  # mmHg — the PO2 at which haemoglobin is 50% saturated
    n = 2.7     # Hill coefficient

    spo2 = 100 * po2**n / (p50**n + po2**n)

    # Acclimatization bonus (more RBCs, better O2 extraction)
    if acclimatized:
        spo2 = min(100, spo2 + (100 - spo2) * 0.3)

    return spo2

# Altitude profile
print("=== Altitude Physiology Calculator ===")
print(f"{'Altitude':>8} {'Pressure':>10} {'O₂ PO₂':>8} {'SpO₂':>6} {'SpO₂ acc':>9} {'Status':>16}")
print("-" * 59)

altitudes = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 7000, 8000, 8849]

for alt in altitudes:
    p = air_pressure(alt) / 1000  # kPa
    po2 = oxygen_partial_pressure(alt) / 133.322  # mmHg
    sp = spo2_estimate(alt)
    sp_acc = spo2_estimate(alt, acclimatized=True)

    if sp > 93: status = "Normal"
    elif sp > 85: status = "Mild hypoxia"
    elif sp > 75: status = "Moderate hypoxia"
    elif sp > 60: status = "Severe — danger"
    else: status = "CRITICAL"

    print(f"{alt:>6}m {p:>8.1f}kPa {po2:>6.0f}mmHg {sp:>5.0f}% {sp_acc:>7.0f}% {status:>16}")

# Inca relay runner performance
print(f"\\n=== Chasqui Runner Performance ===")
print("Inca runners (acclimatized) vs Spanish soldiers (lowlanders)")
print(f"{'Altitude':>8} {'Runner SpO₂':>12} {'Spaniard SpO₂':>14} {'Runner advantage':>16}")
print("-" * 52)

for alt in [0, 2000, 3000, 4000, 4500, 5000]:
    inca_sp = spo2_estimate(alt, acclimatized=True)
    spanish_sp = spo2_estimate(alt, acclimatized=False)
    advantage = inca_sp - spanish_sp
    print(f"{alt:>6}m {inca_sp:>10.0f}% {spanish_sp:>12.0f}% {advantage:>14.0f}%")

# EPO response time
print(f"\\n=== Acclimatization Timeline ===")
print("What happens when a lowlander arrives at 4,000m:")
responses = [
    (0, "Immediate", "Heart rate ↑ 20%, breathing rate ↑ 30%"),
    (1, "Day 1-2", "Headache, nausea, fatigue (altitude sickness)"),
    (3, "Day 3-5", "EPO production begins, more red blood cells being made"),
    (7, "Week 1", "Red blood cell count increasing, symptoms improving"),
    (14, "Week 2", "Significant acclimatization, can exercise moderately"),
    (21, "Week 3", "Near-full acclimatization, SpO₂ improved by 5-10%"),
    (42, "Week 6", "Maximum acclimatization for this altitude"),
]

for day, period, response in responses:
    print(f"  {period:<12} {response}")

# Coca leaf chemistry
print(f"\\n=== Coca Leaf Effects ===")
effects = [
    ("Appetite suppression", "Reduces food need during long runs"),
    ("Fatigue reduction", "Blocks adenosine receptors (like caffeine)"),
    ("Altitude symptom relief", "Reduces headache and nausea"),
    ("Mild stimulant", "Increases alertness and endurance"),
    ("Vasodilation", "Improves blood flow to muscles at altitude"),
]
print("Active compounds: cocaine (trace), ecgonine, hygrine")
print("Chewing coca leaves provides:")
for effect, benefit in effects:
    print(f"  • {effect}: {benefit}")
print("Note: chewing coca leaves is NOT the same as refined cocaine.")
print("The leaf contains <1% cocaine in a natural matrix of other compounds.")`,
      challenge: 'Mount Everest climbers use supplemental oxygen above 8,000m (the "death zone"). If supplemental O₂ adds 40 mmHg to the partial pressure, what is the effective SpO₂ at the summit? Is this enough for sustained activity? (It raises SpO₂ from ~55% to ~80% — still impaired but survivable for short periods.)',
      successHint: 'You modeled altitude physiology — the same calculations used by aviation medicine, mountaineering expeditions, and aerospace engineering. The oxygen-haemoglobin dissociation curve you used is one of the most important curves in biology — it governs how every cell in your body gets the oxygen it needs.',
    },
    {
      title: 'Network redundancy — why the Inca system survived landslides',
      concept: `The Andes experience frequent **earthquakes, landslides, and floods** that destroy roads. The Inca road network survived because it had **redundancy** — multiple independent paths between important cities.

**Network reliability** depends on **connectivity**: how many independent paths exist between any two nodes. A tree (minimum connections, no loops) has zero redundancy — removing any single edge disconnects the network. A fully connected network (every node connected to every other) has maximum redundancy but is expensive.

The Inca engineers found the middle ground: the main trunk road (Royal Road) was supplemented by **secondary routes** along the coast and through river valleys. If the mountain road was blocked, messages could take the coastal route — longer but still functional.

This is the same principle used in the **Internet**: data packets can take multiple routes to reach their destination. If one router fails, the packets are automatically rerouted through others. The Internet was designed to survive nuclear attacks — the Inca network was designed to survive earthquakes. Same engineering solution.

📚 *MTBF (Mean Time Between Failures) and redundancy are key concepts in reliability engineering. If a single road has a 5% annual failure probability, two independent roads have only a 0.25% chance of both failing in the same year.*`,
      analogy: 'Your house has one water pipe. If it breaks, you have no water. Your neighbour\'s house has two independent pipes from different mains. If one breaks, the other still works. The second pipe is redundancy — insurance against failure. The Inca built road redundancy into their network for the same reason.',
      storyConnection: 'When the Spanish conquered the Inca Empire, one of their first strategic moves was to control the main road junctions — the "hubs" of the network. By occupying Cusco and a few key relay stations, they could control communications across the entire empire. This shows the flip side of centralized hub-and-spoke networks: they\'re efficient but vulnerable to capture.',
      checkQuestion: 'A network has 10 cities connected by a single loop (10 roads). How many roads must fail to disconnect ANY two cities?',
      checkAnswer: '2 roads — on opposite sides of the loop from the two cities. A single failure just lengthens the path (go the other way around the loop). Two failures, properly placed, can isolate a city. This is better than a tree (where 1 failure disconnects), but worse than a fully connected network (where you\'d need 9 failures).',
      codeIntro: 'Analyze network redundancy — calculate the number of independent paths and the probability of disconnection.',
      code: `import numpy as np

np.random.seed(42)

class ReliableNetwork:
    """Network with reliability analysis."""

    def __init__(self):
        self.edges = {}

    def add_edge(self, a, b, failure_prob=0.05):
        if a not in self.edges: self.edges[a] = []
        if b not in self.edges: self.edges[b] = []
        self.edges[a].append({"node": b, "fail_prob": failure_prob})
        self.edges[b].append({"node": a, "fail_prob": failure_prob})

    def is_connected(self, active_edges=None):
        """Check if all nodes can reach each other."""
        if not self.edges: return True
        nodes = list(self.edges.keys())
        visited = set()
        queue = [nodes[0]]
        visited.add(nodes[0])

        while queue:
            current = queue.pop(0)
            for edge in self.edges.get(current, []):
                neighbor = edge["node"]
                if neighbor not in visited:
                    if active_edges is None or (current, neighbor) in active_edges or (neighbor, current) in active_edges:
                        visited.add(neighbor)
                        queue.append(neighbor)

        return len(visited) == len(nodes)

    def simulate_reliability(self, n_simulations=1000):
        """Monte Carlo simulation of network reliability."""
        # Get all unique edges
        all_edges = set()
        for node, connections in self.edges.items():
            for edge in connections:
                pair = tuple(sorted([node, edge["node"]]))
                all_edges.add((pair, edge["fail_prob"]))

        edge_list = list(all_edges)
        failures = 0

        for _ in range(n_simulations):
            # Determine which edges survive
            active = set()
            for (a, b), prob in edge_list:
                if np.random.random() > prob:  # survives
                    active.add((a, b))

            # Check connectivity with surviving edges
            if not self.is_connected_subset(active):
                failures += 1

        return 1 - failures / n_simulations

    def is_connected_subset(self, active_edges):
        """Check connectivity given a subset of active edges."""
        nodes = list(self.edges.keys())
        if not nodes: return True
        visited = set()
        queue = [nodes[0]]
        visited.add(nodes[0])

        while queue:
            current = queue.pop(0)
            for (a, b) in active_edges:
                if a == current and b not in visited:
                    visited.add(b)
                    queue.append(b)
                elif b == current and a not in visited:
                    visited.add(a)
                    queue.append(a)

        return len(visited) == len(nodes)

# Build networks with different redundancy levels
# Tree (minimum connectivity)
tree = ReliableNetwork()
cities = ["Cusco", "Lima", "Quito", "Arequipa", "La Paz", "Cajamarca"]
tree_edges = [
    ("Cusco", "Lima"), ("Cusco", "Arequipa"), ("Cusco", "La Paz"),
    ("Lima", "Cajamarca"), ("Cajamarca", "Quito"),
]
for a, b in tree_edges:
    tree.add_edge(a, b, 0.10)

# Ring (one redundant path)
ring = ReliableNetwork()
ring_edges = tree_edges + [("Quito", "Arequipa"), ("La Paz", "Lima")]
for a, b in ring_edges:
    ring.add_edge(a, b, 0.10)

# Mesh (multiple redundant paths — Inca-style)
mesh = ReliableNetwork()
mesh_edges = ring_edges + [
    ("Arequipa", "Lima"), ("La Paz", "Cajamarca"),
    ("Cusco", "Quito"), ("Cusco", "Cajamarca"),
]
for a, b in mesh_edges:
    mesh.add_edge(a, b, 0.10)

# Analyze each network
print("=== Network Redundancy Analysis ===")
print(f"Each road has a 10% annual failure probability\\n")

networks = [
    ("Tree (minimum)", tree, len(tree_edges)),
    ("Ring (one loop)", ring, len(ring_edges)),
    ("Mesh (Inca-style)", mesh, len(mesh_edges)),
]

for name, net, n_edges in networks:
    reliability = net.simulate_reliability(500)
    print(f"{name}:")
    print(f"  Cities: {len(cities)} | Roads: {n_edges}")
    print(f"  Reliability (all connected): {reliability:.1%}")
    print(f"  Expected disconnections per 100 years: {(1-reliability)*100:.0f}")
    print()

# Cost-benefit analysis
print("=== Cost-Benefit of Redundancy ===")
print(f"{'Network':<20} {'Roads':>6} {'Reliability':>12} {'Cost':>8} {'Reliability/Cost':>16}")
print("-" * 64)

for name, net, n_edges in networks:
    reliability = net.simulate_reliability(500)
    cost = n_edges * 100  # arbitrary cost units per road
    efficiency = reliability / cost * 100
    print(f"{name:<20} {n_edges:>6} {reliability:>10.1%} {cost:>8} {efficiency:>14.4f}")

print(f"\\nMesh costs more but provides dramatically better reliability.")
print(f"The Inca invested in redundancy because network failure")
print(f"meant delayed messages, lost supplies, and military vulnerability.")`,
      challenge: 'The Internet uses a similar mesh topology. If each router has a 1% daily failure probability, calculate the network reliability for a path through 10 routers. How does adding redundant paths (2 or 3 independent routes) change the reliability? This is why Internet protocols use multi-path routing.',
      successHint: 'You analyzed network reliability — the same mathematics used to design the Internet, power grids, and telecommunication networks. The key principle: redundancy costs more but prevents catastrophic failures. The Inca built the first "fault-tolerant network" 500 years before computer scientists formalized the concept.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Graph theory, bridge physics, and data systems through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model road networks, bridge physics, knotted-string databases, altitude physiology, and network reliability.
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
