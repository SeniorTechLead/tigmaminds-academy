import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ChettinadLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Chemical preservatives — salt, sugar, acid, and how they work',
      concept: `Chemical preservatives work by making the food environment hostile to microbes. **Salt** (NaCl) draws water out of microbial cells by osmosis, dehydrating and killing them. **Sugar** does the same at high concentrations. **Acids** (vinegar, citric acid) lower the pH below the survival threshold of most bacteria.

Each preservative has a **minimum effective concentration**: salt must be at least 10% to inhibit most bacteria (20% for complete preservation), sugar needs about 65% (as in jam), and acid must bring the pH below 4.6 (the safety threshold for botulism).

In the code below, you will calculate the effectiveness of different preservatives at various concentrations and determine the optimal combination for preserving spice pastes — a key product of the Chettinad spice trade.

*Osmotic pressure is the force that pulls water out of cells when they are surrounded by a high-salt or high-sugar solution. It is the same force that makes slugs shrivel when you sprinkle salt on them — the salt draws water out of their cells.*`,
      analogy: 'Imagine bacteria as tiny water balloons. Salt or sugar in the surrounding food acts like a sponge, pulling water out through the balloon skin. At low concentrations, the bacteria can pump water back in. At high concentrations, they cannot keep up and shrivel. The "minimum effective concentration" is the point where the sponge wins.',
      storyConnection: 'Chettinad spice pastes (like the famous Chettinad masala) combine multiple preservatives: salt (10-15%), tamarind acid (pH 3.5), and chilli oils (antimicrobial). This multi-hurdle approach means each preservative can be used at a lower level than if it were the sole preservation method, resulting in better flavour.',
      checkQuestion: 'Why is a combination of 5% salt + pH 4.0 + 0.1% clove oil often more effective than 15% salt alone?',
      checkAnswer: 'This is the "hurdle technology" principle. Each preservative creates a partial barrier (hurdle) that microbes must overcome. Five percent salt alone is too low, pH 4.0 alone allows some acid-tolerant bacteria, and 0.1% clove oil alone misses some species. But together, microbes must overcome ALL three hurdles simultaneously, which very few can do.',
      codeIntro: 'Model the effectiveness of chemical preservatives at various concentrations.',
      code: `import numpy as np

def salt_inhibition(salt_pct):
    """Fraction of bacteria inhibited by salt concentration."""
    if salt_pct < 2:
        return 0
    return min(1.0, (salt_pct - 2) / 18)  # linear from 2% to 20%

def acid_inhibition(pH):
    """Fraction of bacteria inhibited by acidity."""
    if pH > 7:
        return 0
    if pH < 3:
        return 1.0
    return (7 - pH) / 4  # linear from pH 7 to pH 3

def sugar_inhibition(sugar_pct):
    """Fraction of bacteria inhibited by sugar concentration."""
    if sugar_pct < 20:
        return 0
    return min(1.0, (sugar_pct - 20) / 50)  # linear from 20% to 70%

def combined_hurdle(salt_pct, pH, sugar_pct, oil_mic_pct=0, oil_actual_pct=0):
    """Multi-hurdle preservation: combined effect of multiple preservatives."""
    s_inh = salt_inhibition(salt_pct)
    a_inh = acid_inhibition(pH)
    su_inh = sugar_inhibition(sugar_pct)
    o_inh = min(1.0, oil_actual_pct / oil_mic_pct) if oil_mic_pct > 0 else 0

    # Probability that a microbe survives ALL hurdles
    survival = (1 - s_inh) * (1 - a_inh) * (1 - su_inh) * (1 - o_inh)
    return 1 - survival  # total inhibition

print("=== Individual Preservative Effectiveness ===")
print()

print("--- Salt ---")
for pct in [0, 2, 5, 8, 10, 15, 20]:
    inh = salt_inhibition(pct) * 100
    bar = "#" * int(inh / 5)
    print(f"  {pct:>3}% salt: {inh:>5.1f}% inhibited  {bar}")

print()
print("--- Acid (pH) ---")
for pH in [7.0, 6.0, 5.5, 5.0, 4.5, 4.0, 3.5, 3.0]:
    inh = acid_inhibition(pH) * 100
    bar = "#" * int(inh / 5)
    print(f"  pH {pH:.1f}: {inh:>5.1f}% inhibited  {bar}")

# Multi-hurdle combinations
print()
print("=== Multi-Hurdle Preservation (Chettinad Style) ===")
print()

combos = [
    ("No preservation",       0,   7.0, 0,  0,     0),
    ("Salt only (15%)",       15,  7.0, 0,  0,     0),
    ("Acid only (pH 3.5)",    0,   3.5, 0,  0,     0),
    ("Salt + acid (5%, pH 4)", 5,  4.0, 0,  0,     0),
    ("Chettinad paste",        10,  3.8, 5,  0.10,  0.05),
    ("Heavy preservation",     15,  3.5, 10, 0.10,  0.10),
    ("Jam (65% sugar)",        0,   4.0, 65, 0,     0),
]

header = "Method                    Salt  pH   Sugar  Inhibition(%)"
print(header)
print("-" * len(header))

for name, salt, pH, sugar, mic, oil in combos:
    inh = combined_hurdle(salt, pH, sugar, mic, oil) * 100
    safe = "SAFE" if inh > 95 else "MARGINAL" if inh > 80 else "UNSAFE"
    print(f"{name:<26} {salt:>3}%  {pH:.1f}  {sugar:>3}%   {inh:>10.1f}%  [{safe}]")

print()
print("Multi-hurdle is more effective than any single method,")
print("and allows lower concentrations of each (better flavour).")`,
      challenge: 'Add temperature as a fourth hurdle. Model the combined effect of salt, acid, spice oil, AND refrigeration (5 degrees C vs 25 degrees C). Show that a mildly preserved product at 5 degrees C can be as safe as a heavily preserved product at 25 degrees C.',
      successHint: 'Hurdle technology is the modern scientific framework for food preservation. It was formally developed by Lothar Leistner in the 1990s, but the Chettinad traders had been applying the same principle for centuries by combining salt, acid, and spice oils in their masalas.',
    },
    {
      title: 'Water activity engineering — designing shelf-stable products',
      concept: `Modern food scientists **engineer** water activity by adding humectants (substances that bind water). Common humectants include salt, sugar, glycerol, and propylene glycol. Each humectant lowers water activity by a predictable amount described by **Raoult's Law**: adding solute molecules reduces the fraction of "free" water.

The key equation is: **a_w = x_water * gamma**, where x_water is the mole fraction of water and gamma is the activity coefficient (typically close to 1 for dilute solutions). For concentrated solutions (like jam or salt brine), more complex models are needed.

In the code below, you will calculate how much salt, sugar, or glycerol must be added to a spice paste to achieve a target water activity. This is the engineering challenge behind every shelf-stable food product.

*Raoult's Law states that adding any dissolved substance to water lowers its vapour pressure (and hence its water activity) proportionally to the number of dissolved molecules. More solute = lower water activity = longer shelf life.*`,
      analogy: 'Imagine a crowded swimming pool. When the pool has few swimmers (pure water), each swimmer moves freely (high water activity). As you add more people (solute molecules), swimmers have less room and move less freely (lower water activity). At some point, the pool is so crowded that swimmers can barely move — water activity is very low.',
      storyConnection: 'Chettinad pickle makers (achar) are water activity engineers. They add salt, oil, and acid in specific proportions to bring the water activity below 0.85 — the threshold for most spoilage organisms. The proportions vary by pickle type: mango achar uses 12% salt and tamarind acid, while lemon achar uses 15% salt and the natural citric acid of the lemon.',
      checkQuestion: 'If pure water has a_w = 1.0 and saturated salt solution has a_w = 0.75, what is the a_w of a solution that is half-saturated?',
      checkAnswer: 'Water activity decreases roughly linearly with salt concentration at moderate levels. Half-saturated is about 13% salt. The a_w would be approximately 0.88 (halfway between 1.0 and 0.75 is 0.875, and the actual curve is nearly linear in this range).',
      codeIntro: 'Calculate water activity reduction from adding different humectants.',
      code: `import numpy as np

def water_activity_salt(salt_pct):
    """Water activity of salt solution (NaCl).
    Based on empirical data for NaCl solutions.
    """
    # Simplified model: aw = 1 - 0.033 * wt% for dilute
    # More accurate: Norrish equation
    if salt_pct <= 0:
        return 1.0
    k_salt = 0.033  # Norrish constant for NaCl
    aw = 1 - k_salt * salt_pct - 0.00025 * salt_pct ** 2
    return max(aw, 0.75)  # saturated NaCl aw = 0.75

def water_activity_sugar(sugar_pct):
    """Water activity of sugar solution (sucrose)."""
    if sugar_pct <= 0:
        return 1.0
    k_sugar = 0.0056  # Norrish constant for sucrose
    aw = 1 - k_sugar * sugar_pct - 0.00008 * sugar_pct ** 2
    return max(aw, 0.60)

def water_activity_glycerol(glycerol_pct):
    """Water activity of glycerol solution."""
    if glycerol_pct <= 0:
        return 1.0
    k_glyc = 0.021
    aw = 1 - k_glyc * glycerol_pct - 0.0002 * glycerol_pct ** 2
    return max(aw, 0.40)

# Compare humectants
print("=== Water Activity vs Humectant Concentration ===")
print()

header = "Concentration  Salt aw    Sugar aw   Glycerol aw"
print(header)
print("-" * len(header))

for pct in [0, 2, 5, 8, 10, 15, 20, 25, 30, 40, 50, 60]:
    aw_s = water_activity_salt(pct)
    aw_su = water_activity_sugar(pct)
    aw_g = water_activity_glycerol(pct)
    salt_str = f"{aw_s:.3f}" if pct <= 26 else "  sat"
    sugar_str = f"{aw_su:.3f}"
    glyc_str = f"{aw_g:.3f}"
    print(f"{pct:>11}%    {salt_str}      {sugar_str}     {glyc_str}")

# Target aw for different products
print()
print("=== How Much Humectant for Target Water Activity? ===")
print()

targets = [
    ("Prevent all growth", 0.60),
    ("Prevent most moulds", 0.80),
    ("Prevent most bacteria", 0.91),
    ("Prevent Staph aureus", 0.86),
]

for name, target_aw in targets:
    # Find concentration needed for each humectant
    for pct in np.arange(0, 70, 0.5):
        if water_activity_salt(pct) <= target_aw:
            salt_needed = pct
            break
    else:
        salt_needed = -1

    for pct in np.arange(0, 80, 0.5):
        if water_activity_sugar(pct) <= target_aw:
            sugar_needed = pct
            break
    else:
        sugar_needed = -1

    for pct in np.arange(0, 80, 0.5):
        if water_activity_glycerol(pct) <= target_aw:
            glyc_needed = pct
            break
    else:
        glyc_needed = -1

    print(f"{name} (aw = {target_aw}):")
    if salt_needed >= 0:
        print(f"  Salt: {salt_needed:.0f}%")
    else:
        print(f"  Salt: not achievable")
    if sugar_needed >= 0:
        print(f"  Sugar: {sugar_needed:.0f}%")
    else:
        print(f"  Sugar: not achievable")
    if glyc_needed >= 0:
        print(f"  Glycerol: {glyc_needed:.0f}%")
    print()`,
      challenge: 'Model a multi-humectant system: if you add both salt and sugar, the effect on water activity is roughly additive at low concentrations. Design a spice paste recipe with 8% salt + 10% sugar that achieves a target a_w of 0.85 for shelf stability.',
      successHint: 'You just performed water activity engineering — the foundation of the modern food industry. Every preserved food product (from jam to jerky to energy bars) is designed using exactly these calculations to achieve a target water activity.',
    },
    {
      title: 'Graph theory basics — modelling the spice trade network',
      concept: `The Chettinad spice trade routes form a **network** (or **graph** in mathematical terms). Each trading port is a **node** (or vertex), and each shipping route between ports is an **edge**. Edges have **weights** representing distance, cost, or travel time.

Graph theory provides powerful tools for optimising these networks: finding the **shortest path** between two ports, the **minimum spanning tree** (cheapest way to connect all ports), and the **maximum flow** (most cargo that can move through the network).

In the code below, you will represent the Chettinad trade network as a graph and analyse its structure. This connects the historical spice trade to modern logistics and computer science.

*A graph is one of the most versatile data structures in computer science. Social networks, road maps, airline routes, internet connections, and molecular structures are all graphs. Algorithms that work on graphs apply to all of these domains.*`,
      analogy: 'Think of the trade network as a subway map. Stations are nodes, tracks between stations are edges, and the travel time between stations is the edge weight. Finding the fastest route from home to work is the "shortest path problem" — the same problem the Chettinad traders solved when choosing which ports to visit.',
      storyConnection: 'The Chettinad Nattukotai Chettiars operated one of the most sophisticated trade networks in the Indian Ocean, with agents in ports from Penang to Saigon to Colombo. They optimised routes not just for distance but for monsoon wind patterns (which made certain routes faster or even impossible in different seasons).',
      checkQuestion: 'If there are 5 ports with direct routes between every pair, how many routes (edges) are there?',
      checkAnswer: '5 choose 2 = 5 * 4 / 2 = 10 edges. Each port connects to 4 others, but each route is shared by two ports, so we divide by 2. For n ports, the number of possible routes is n(n-1)/2. With 20 ports, that is 190 possible routes.',
      codeIntro: 'Build and analyse the Chettinad spice trade network as a graph.',
      code: `import numpy as np

class TradeGraph:
    def __init__(self):
        self.nodes = {}
        self.edges = []

    def add_port(self, name, lat=0, lon=0):
        self.nodes[name] = {"lat": lat, "lon": lon, "degree": 0}

    def add_route(self, port_a, port_b, distance_km, cost_per_ton, days):
        self.edges.append({
            "from": port_a, "to": port_b,
            "distance": distance_km, "cost": cost_per_ton, "days": days,
        })
        self.nodes[port_a]["degree"] += 1
        self.nodes[port_b]["degree"] += 1

    def get_neighbours(self, port):
        neighbours = []
        for e in self.edges:
            if e["from"] == port:
                neighbours.append((e["to"], e))
            elif e["to"] == port:
                neighbours.append((e["from"], e))
        return neighbours

# Build the Chettinad trade network
g = TradeGraph()

# Major ports
ports = [
    ("Karaikal", 10.9, 79.8),
    ("Nagapattinam", 10.8, 79.8),
    ("Colombo", 6.9, 79.9),
    ("Penang", 5.4, 100.3),
    ("Singapore", 1.3, 103.8),
    ("Saigon", 10.8, 106.7),
    ("Rangoon", 16.8, 96.2),
    ("Madras", 13.1, 80.3),
    ("Cochin", 9.9, 76.3),
]

for name, lat, lon in ports:
    g.add_port(name, lat, lon)

# Trade routes (distance km, cost $/ton, transit days)
routes = [
    ("Karaikal", "Nagapattinam", 30, 5, 0.5),
    ("Karaikal", "Colombo", 500, 30, 5),
    ("Karaikal", "Madras", 300, 20, 3),
    ("Karaikal", "Cochin", 600, 35, 6),
    ("Colombo", "Penang", 2800, 80, 14),
    ("Colombo", "Singapore", 3200, 90, 16),
    ("Penang", "Singapore", 600, 25, 3),
    ("Singapore", "Saigon", 1200, 50, 6),
    ("Penang", "Rangoon", 1800, 70, 10),
    ("Madras", "Rangoon", 1800, 75, 12),
    ("Cochin", "Colombo", 400, 25, 4),
    ("Nagapattinam", "Penang", 2400, 75, 12),
]

for a, b, dist, cost, days in routes:
    g.add_route(a, b, dist, cost, days)

print("=== Chettinad Spice Trade Network ===")
print(f"Ports: {len(g.nodes)} | Routes: {len(g.edges)}")
print()

print("--- Port Connectivity ---")
header = "Port              Connections  Avg Distance"
print(header)
print("-" * len(header))

for name, info in sorted(g.nodes.items(), key=lambda x: -x[1]["degree"]):
    neighbours = g.get_neighbours(name)
    avg_dist = np.mean([e["distance"] for _, e in neighbours]) if neighbours else 0
    print(f"{name:<18} {info['degree']:>9}    {avg_dist:>10.0f} km")

print()
print("--- All Routes ---")
header2 = "From             To               Dist(km)  Cost($/t)  Days"
print(header2)
print("-" * len(header2))

for e in sorted(g.edges, key=lambda x: x["distance"]):
    print(f"{e['from']:<17} {e['to']:<17} {e['distance']:>7}  "
          f"{e['cost']:>8}    {e['days']:>4}")`,
      challenge: 'Calculate the "betweenness centrality" of each port — how many shortest paths between other port pairs pass through it. The port with highest centrality is the most important hub. Is it Singapore (geographic centre) or Colombo (connection between Indian and Southeast Asian networks)?',
      successHint: 'You just built a graph data structure and analysed network topology — fundamental skills in computer science. The same tools are used to analyse social networks, internet routing, disease transmission networks, and supply chains.',
    },
    {
      title: 'Shortest path — Dijkstra\'s algorithm for the spice route',
      concept: `Given a trade network, how do you find the cheapest or fastest route between two ports? This is the **shortest path problem**, solved by **Dijkstra's algorithm** (1959) — one of the most important algorithms in computer science.

Dijkstra's algorithm works by maintaining a "frontier" of nodes being explored. It always expands the node with the smallest known distance first (greedy strategy), then updates the distances to its neighbours. This guarantees finding the optimal path.

In the code below, you will implement Dijkstra's algorithm to find the cheapest trade route from Karaikal to Saigon. The algorithm considers multiple possible paths and proves which one is optimal.

*Dijkstra's algorithm is used billions of times per day: every time you ask Google Maps for directions, every time a packet is routed through the internet, every time a logistics company plans a delivery route.*`,
      analogy: 'Imagine you are in a maze and can see only one room ahead. You put a "distance marker" on each room you visit. When you reach a room through a shorter path than previously marked, you update the marker. Eventually, every room has the shortest possible distance from the start. Dijkstra\'s algorithm is this systematic room-by-room exploration.',
      storyConnection: 'The Chettinad traders did not have Dijkstra\'s algorithm, but they had something equally powerful: generations of accumulated route knowledge passed down through families. Each trader knew which routes were cheapest in each season, which ports charged the least tax, and which monsoon winds made certain passages faster or dangerous.',
      checkQuestion: 'If the cheapest route from A to C goes through B (A->B costs 30, B->C costs 25, total 55), but there is a direct route A->C costing 50, which does Dijkstra choose?',
      checkAnswer: 'Dijkstra chooses the direct route A->C at cost 50, because 50 < 55. The algorithm always finds the global optimum by comparing all possible paths systematically. It never settles for a locally good choice that turns out to be globally suboptimal.',
      codeIntro: 'Implement Dijkstra\'s algorithm to find optimal spice trade routes.',
      code: `import numpy as np

def dijkstra(graph_edges, nodes, start, end, weight_key="cost"):
    """Find shortest path using Dijkstra's algorithm.

    graph_edges: list of {"from", "to", weight_key} dicts
    nodes: list of node names
    weight_key: which edge property to minimize
    """
    # Initialise distances
    dist = {n: float('inf') for n in nodes}
    dist[start] = 0
    prev = {n: None for n in nodes}
    visited = set()

    while len(visited) < len(nodes):
        # Find unvisited node with smallest distance
        current = None
        min_dist = float('inf')
        for n in nodes:
            if n not in visited and dist[n] < min_dist:
                min_dist = dist[n]
                current = n

        if current is None or current == end:
            break

        visited.add(current)

        # Update neighbours
        for e in graph_edges:
            if e["from"] == current and e["to"] not in visited:
                neighbour = e["to"]
                new_dist = dist[current] + e[weight_key]
                if new_dist < dist[neighbour]:
                    dist[neighbour] = new_dist
                    prev[neighbour] = current
            elif e["to"] == current and e["from"] not in visited:
                neighbour = e["from"]
                new_dist = dist[current] + e[weight_key]
                if new_dist < dist[neighbour]:
                    dist[neighbour] = new_dist
                    prev[neighbour] = current

    # Reconstruct path
    path = []
    current = end
    while current is not None:
        path.append(current)
        current = prev[current]
    path.reverse()

    return path, dist[end]

# Define the trade network
edges = [
    {"from": "Karaikal", "to": "Nagapattinam", "distance": 30, "cost": 5, "days": 0.5},
    {"from": "Karaikal", "to": "Colombo", "distance": 500, "cost": 30, "days": 5},
    {"from": "Karaikal", "to": "Madras", "distance": 300, "cost": 20, "days": 3},
    {"from": "Karaikal", "to": "Cochin", "distance": 600, "cost": 35, "days": 6},
    {"from": "Colombo", "to": "Penang", "distance": 2800, "cost": 80, "days": 14},
    {"from": "Colombo", "to": "Singapore", "distance": 3200, "cost": 90, "days": 16},
    {"from": "Penang", "to": "Singapore", "distance": 600, "cost": 25, "days": 3},
    {"from": "Singapore", "to": "Saigon", "distance": 1200, "cost": 50, "days": 6},
    {"from": "Penang", "to": "Rangoon", "distance": 1800, "cost": 70, "days": 10},
    {"from": "Madras", "to": "Rangoon", "distance": 1800, "cost": 75, "days": 12},
    {"from": "Cochin", "to": "Colombo", "distance": 400, "cost": 25, "days": 4},
    {"from": "Nagapattinam", "to": "Penang", "distance": 2400, "cost": 75, "days": 12},
]

nodes = ["Karaikal", "Nagapattinam", "Colombo", "Penang", "Singapore",
         "Saigon", "Rangoon", "Madras", "Cochin"]

# Find optimal routes by different criteria
print("=== Dijkstra's Algorithm: Karaikal to Saigon ===")
print()

for criterion in ["cost", "distance", "days"]:
    path, total = dijkstra(edges, nodes, "Karaikal", "Saigon", criterion)
    unit = {"cost": "$/ton", "distance": "km", "days": "days"}[criterion]
    print(f"Optimizing for: {criterion}")
    print(f"  Best path: {' -> '.join(path)}")
    print(f"  Total {criterion}: {total:.0f} {unit}")
    print()

# Compare all origin-destination pairs
print("=== Cost Matrix ($/ton by cheapest route) ===")
print()

key_ports = ["Karaikal", "Colombo", "Penang", "Singapore", "Saigon"]
header = "From\\To        " + "  ".join(f"{p:>10}" for p in key_ports)
print(header)
print("-" * len(header))

for origin in key_ports:
    costs = []
    for dest in key_ports:
        if origin == dest:
            costs.append("     -")
        else:
            _, c = dijkstra(edges, nodes, origin, dest, "cost")
            costs.append(f"{c:>6.0f}")
    print(f"{origin:<15} {'  '.join(costs)}")`,
      challenge: 'Add seasonal variation: during the northeast monsoon (October-January), the route from Colombo to Penang takes 20 days instead of 14 (headwinds). During the southwest monsoon (June-September), the reverse route is slow. Re-run Dijkstra for each season to see how the optimal route changes.',
      successHint: 'You just implemented one of the most important algorithms in computer science. Dijkstra\'s algorithm (or its variants) runs inside every GPS navigation system, internet router, and logistics optimizer on Earth. You have connected 19th-century Chettinad trading wisdom to modern algorithmic graph theory.',
    },
    {
      title: 'Cost minimization — linear programming for trade decisions',
      concept: `A Chettinad trader at a port must decide how much of each spice to buy, considering: the **buying price** at this port, the **selling price** at the destination, **cargo capacity** (limited ship space), and **budget** (limited cash). This is a **linear programming** problem — an optimization where you maximize profit subject to constraints.

The mathematical formulation is: **maximize** sum(profit_i * quantity_i) **subject to** sum(weight_i * quantity_i) <= cargo_capacity AND sum(price_i * quantity_i) <= budget AND quantity_i >= 0 for all i.

In the code below, you will solve this optimization problem using a simple greedy approach (buy the highest profit-per-kg spice first until a constraint is hit) and compare it to the optimal solution.

*Linear programming was developed by George Dantzig in 1947 and is one of the most widely used optimization techniques. Airlines, factories, financial firms, and logistics companies solve thousands of linear programs every day.*`,
      analogy: 'Imagine you are at a market with a backpack (cargo capacity) and a wallet (budget). Each stall sells a different item with a different profit margin and weight. You want to fill your backpack to maximize profit. If saffron has the highest profit per kilogram, you buy saffron first. But if your wallet runs out before your backpack is full, you switch to cheaper items.',
      storyConnection: 'The Chettinad traders were expert optimizers. They knew that saffron had the highest value per kilogram but was expensive to buy. Pepper was cheaper but bulkier. The optimal cargo was a mix: enough saffron to fill the premium market, enough pepper for the mass market, and perhaps some cinnamon and cardamom to hedge against price fluctuations at the destination.',
      checkQuestion: 'If saffron earns $500/kg profit but costs $5000/kg to buy, and pepper earns $5/kg profit but costs $10/kg to buy, which is more profitable per dollar invested?',
      checkAnswer: 'Saffron: $500 / $5000 = 10% return per dollar. Pepper: $5 / $10 = 50% return per dollar. Pepper is 5x more profitable per dollar invested. But saffron is 100x more profitable per kilogram of cargo space. The optimal choice depends on whether you are limited by money (buy pepper) or by space (buy saffron).',
      codeIntro: 'Solve the spice cargo optimization problem.',
      code: `import numpy as np

class CargOptimizer:
    def __init__(self, budget, capacity_kg):
        self.budget = budget
        self.capacity = capacity_kg
        self.spices = []

    def add_spice(self, name, buy_price, sell_price, available_kg):
        profit = sell_price - buy_price
        self.spices.append({
            "name": name,
            "buy_price": buy_price,
            "sell_price": sell_price,
            "profit_per_kg": profit,
            "profit_per_dollar": profit / buy_price if buy_price > 0 else 0,
            "available_kg": available_kg,
        })

    def greedy_by_profit_per_kg(self):
        """Greedy: buy highest profit/kg first."""
        sorted_spices = sorted(self.spices, key=lambda x: -x["profit_per_kg"])
        return self._fill_cargo(sorted_spices)

    def greedy_by_profit_per_dollar(self):
        """Greedy: buy highest profit/$ first (ROI optimization)."""
        sorted_spices = sorted(self.spices, key=lambda x: -x["profit_per_dollar"])
        return self._fill_cargo(sorted_spices)

    def _fill_cargo(self, sorted_spices):
        remaining_budget = self.budget
        remaining_capacity = self.capacity
        cargo = {}
        total_cost = 0
        total_profit = 0

        for s in sorted_spices:
            max_by_budget = remaining_budget / s["buy_price"] if s["buy_price"] > 0 else float('inf')
            max_by_capacity = remaining_capacity
            max_by_supply = s["available_kg"]

            qty = min(max_by_budget, max_by_capacity, max_by_supply)
            qty = max(0, qty)

            if qty > 0:
                cargo[s["name"]] = qty
                cost = qty * s["buy_price"]
                profit = qty * s["profit_per_kg"]
                remaining_budget -= cost
                remaining_capacity -= qty
                total_cost += cost
                total_profit += profit

        return cargo, total_cost, total_profit

# Set up the optimization
opt = CargOptimizer(budget=50000, capacity_kg=5000)

# Spices available at Cochin port (buy price, sell price at Penang, available kg)
opt.add_spice("Saffron",     5000, 8000,  5)
opt.add_spice("Cardamom",    80,   150,   200)
opt.add_spice("Cloves",      60,   110,   500)
opt.add_spice("Cinnamon",    30,   55,    1000)
opt.add_spice("Black pepper", 15,  28,    3000)
opt.add_spice("Turmeric",    8,    14,    2000)
opt.add_spice("Ginger",      5,    9,     1500)

print("=== Spice Cargo Optimizer ===")
print(f"Budget: {opt.budget:,} | Capacity: {opt.capacity:,} kg")
print()

# Show spice data
header = "Spice          Buy($/kg)  Sell($/kg)  Profit/kg  Profit/$  Available"
print(header)
print("-" * len(header))

for s in sorted(opt.spices, key=lambda x: -x["profit_per_kg"]):
    print(f"{s['name']:<15} {s['buy_price']:>8}     {s['sell_price']:>8}     "
          f"{s['profit_per_kg']:>7}    {s['profit_per_dollar']:>6.2f}  {s['available_kg']:>7} kg")

# Compare strategies
print()
for strategy_name, method in [
    ("Strategy 1: Max profit per kg", opt.greedy_by_profit_per_kg),
    ("Strategy 2: Max profit per $", opt.greedy_by_profit_per_dollar),
]:
    cargo, cost, profit = method()
    roi = profit / cost * 100 if cost > 0 else 0
    total_kg = sum(cargo.values())
    print(f"--- {strategy_name} ---")
    print(f"  Total cost: \{cost:,.0f} | Total profit: \{profit:,.0f} | ROI: {roi:.1f}%")
    print(f"  Cargo: {total_kg:,.0f} kg loaded")
    for spice, qty in sorted(cargo.items(), key=lambda x: -x[1]):
        print(f"    {spice:<15} {qty:>7.0f} kg")
    print()`,
      challenge: 'Add a "price uncertainty" model: selling prices at Penang can vary by plus or minus 20%. Run the optimization 1000 times with random prices and find the cargo mix that maximizes expected profit while keeping the worst-case profit above zero (risk-adjusted optimization).',
      successHint: 'You just solved a resource allocation problem — one of the most common optimization problems in business and engineering. The same mathematics is used in portfolio optimization (finance), production planning (manufacturing), and resource allocation (project management).',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Chemical preservation and supply chain fundamentals</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises model chemical preservation, graph theory, and trade route optimization.
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
