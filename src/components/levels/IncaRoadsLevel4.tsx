import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function IncaRoadsLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design a Road Network Optimiser',
      concept: `In this capstone project, you will build a complete **Road Network Optimiser** — a Python program that:

1. **Constructs a weighted graph** from terrain data (elevation grid + city locations)
2. **Routes paths** using Dijkstra's algorithm with multi-objective edge weights (distance, climb, cost)
3. **Evaluates bridge feasibility** at river crossings (catenary analysis + material limits)
4. **Analyses network vulnerability** (percolation threshold, critical links)
5. **Generates an engineering report** with optimal routes, bridge specifications, and risk assessment

This brings together everything from Levels 1-3: graph algorithms, catenary mathematics, altitude physiology, supply chain logistics, and network resilience.

The first step is **system design** — defining the data structures, interfaces, and workflow before writing code. The key design decision: how to represent terrain and routes in a way that supports all five analyses.

\ud83d\udcda *System design means deciding what your program does, how it's organised, and what data it needs — BEFORE you write code. A graph-based terrain model is the natural choice here: nodes are locations, edges are road segments, and edge weights encode the multi-objective cost.*`,
      analogy: 'Before the Inca built a road, they surveyed the terrain: which valleys to follow, which passes to cross, where to place bridges. They didn\'t start laying stones on day one — they planned the network. Your system design is the same: survey the problem space, decide on the architecture, then build.',
      storyConnection: 'The Qhapaq Nan was not built all at once. It evolved over centuries as the Inca empire expanded, with each new conquest requiring new routes to be integrated into the existing network. Our optimiser models this process: given terrain and cities, find the best network — the same problem the Inca solved empirically over generations.',
      checkQuestion: 'Why represent terrain as a graph rather than a continuous surface?',
      checkAnswer: 'Graphs are discrete — they have finite nodes and edges, which computers can process efficiently. A continuous surface would require infinite precision. By sampling the terrain at grid points and connecting adjacent points with weighted edges, we get a model that\'s accurate enough for routing while being computationally tractable. This discretization is the foundation of all computational modelling.',
      codeIntro: 'Design the architecture of the Road Network Optimiser — define classes, data structures, and workflow.',
      code: `import numpy as np

class TerrainNode:
    """A point on the terrain grid."""
    def __init__(self, node_id, row, col, altitude, is_city=False, name=""):
        self.id = node_id
        self.row = row
        self.col = col
        self.altitude = altitude
        self.is_city = is_city
        self.name = name

class TerrainEdge:
    """A connection between two terrain nodes."""
    def __init__(self, u, v, h_dist, alt_diff, has_river=False):
        self.u = u
        self.v = v
        self.h_dist = h_dist        # horizontal distance (km)
        self.alt_diff = alt_diff     # altitude change (m)
        self.has_river = has_river   # requires bridge?

    def travel_cost(self, climb_penalty=0.005, river_penalty=10):
        """Multi-objective edge weight."""
        base = self.h_dist
        climb = climb_penalty * abs(self.alt_diff)
        river = river_penalty if self.has_river else 0
        return base + climb + river

class RoadNetwork:
    """The complete terrain graph."""
    def __init__(self, grid_rows, grid_cols, cell_size_km=5):
        self.rows = grid_rows
        self.cols = grid_cols
        self.cell_size = cell_size_km
        self.nodes = {}       # id -> TerrainNode
        self.edges = {}       # id -> [TerrainEdge]
        self.cities = []      # list of city node ids

    def add_node(self, node):
        self.nodes[node.id] = node
        self.edges[node.id] = []
        if node.is_city:
            self.cities.append(node.id)

    def add_edge(self, edge):
        self.edges[edge.u].append(edge)
        self.edges[edge.v].append(TerrainEdge(edge.v, edge.u, edge.h_dist,
                                               -edge.alt_diff, edge.has_river))

    def summary(self):
        n_nodes = len(self.nodes)
        n_edges = sum(len(e) for e in self.edges.values()) // 2
        n_cities = len(self.cities)
        n_rivers = sum(1 for elist in self.edges.values()
                      for e in elist if e.has_river) // 2
        return n_nodes, n_edges, n_cities, n_rivers

# Build a sample terrain
np.random.seed(42)
network = RoadNetwork(10, 10, cell_size_km=10)

# Generate altitude grid (simplified Andes)
alt_grid = np.zeros((10, 10))
for pr, pc, h, s in [(3,5,4500,2.5), (7,3,3800,3), (5,8,4200,2)]:
    for r in range(10):
        for c in range(10):
            d = np.sqrt((r-pr)**2 + (c-pc)**2)
            alt_grid[r,c] += h * np.exp(-d**2/(2*s**2))
alt_grid += np.random.normal(0, 150, (10,10))
alt_grid = np.clip(alt_grid, 500, 5500)

# Place cities
city_locs = [(0,0,"Coastal port"), (2,3,"Valley town"), (5,5,"Highland centre"),
             (8,8,"Eastern outpost"), (9,1,"Southern hub"), (1,9,"Northern post")]

# Create nodes and edges
node_id = 0
id_map = {}
for r in range(10):
    for c in range(10):
        is_city = False
        name = ""
        for cr, cc, cn in city_locs:
            if r == cr and c == cc:
                is_city = True
                name = cn
        node = TerrainNode(node_id, r, c, alt_grid[r,c], is_city, name)
        network.add_node(node)
        id_map[(r,c)] = node_id
        node_id += 1

# Add edges between adjacent cells
for r in range(10):
    for c in range(10):
        for dr, dc in [(0,1),(1,0),(1,1),(1,-1)]:
            nr, nc = r+dr, c+dc
            if 0 <= nr < 10 and 0 <= nc < 10:
                uid = id_map[(r,c)]
                vid = id_map[(nr,nc)]
                h_dist = np.sqrt(dr**2 + dc**2) * network.cell_size
                alt_d = alt_grid[nr,nc] - alt_grid[r,c]
                has_river = np.random.random() < 0.05  # 5% chance
                network.add_edge(TerrainEdge(uid, vid, h_dist, alt_d, has_river))

n_n, n_e, n_c, n_r = network.summary()
print("=== Road Network Optimiser — System Design ===")
print(f"Terrain grid: {network.rows}x{network.cols} ({network.cell_size}km cells)")
print(f"Nodes: {n_n} | Edges: {n_e} | Cities: {n_c} | River crossings: {n_r}")
print()
print("Cities in network:")
for cid in network.cities:
    node = network.nodes[cid]
    print(f"  {node.name:<20} Grid ({node.row},{node.col})  Alt: {node.altitude:.0f}m")
print()
print("Architecture: TerrainNode + TerrainEdge + RoadNetwork")
print("Next step: Implement Dijkstra routing engine.")`,
      challenge: 'Add a "terrain difficulty" classification to each node: EASY (altitude < 2000m, flat), MODERATE (2000-3500m or steep), HARD (3500-4500m), EXTREME (> 4500m). Print a text map of the terrain showing difficulty zones. How does this map correlate with where the actual Qhapaq Nan was routed?',
      successHint: 'Good system design makes everything else easier. You defined three clean classes — TerrainNode, TerrainEdge, RoadNetwork — each with clear responsibilities. Real GIS (Geographic Information Systems) software uses exactly this node-edge graph model for terrain analysis and route planning.',
    },
    {
      title: 'Building the Dijkstra routing engine with multi-objective weights',
      concept: `Now we implement the core routing algorithm: **Dijkstra's shortest path** with multi-objective edge weights. Unlike simple shortest-path (minimise distance), our Inca road planner must balance:

1. **Horizontal distance** — shorter is better
2. **Altitude change** — climbing is costly (energy, time, altitude sickness risk)
3. **River crossings** — each requires a bridge (construction cost, maintenance)
4. **Maximum altitude** — routes above 4,500 m are dangerous for unladen travellers

Dijkstra's algorithm finds the path with minimum total cost from a source to all other nodes. It works by greedily expanding the nearest unvisited node:

1. Set distance to source = 0, all others = infinity
2. Visit the unvisited node with smallest distance
3. Update distances to its neighbours: if d[current] + edge_weight < d[neighbour], update
4. Mark current as visited. Repeat until all nodes visited.

Time complexity: O((V + E) log V) with a priority queue.

\ud83d\udcda *Dijkstra's algorithm (1959) is one of the most important algorithms in computer science. It powers GPS navigation, network routing (internet packets), and game AI pathfinding. Every time you ask Google Maps for directions, Dijkstra (or a descendant) is running.*`,
      analogy: 'Imagine you\'re at a crossroads and every road has a sign showing its cost. You always take the cheapest unexplored road, spreading outward like a wave. The first time the wave reaches a city, you know you\'ve found the cheapest route — because you always expanded the cheapest frontier first.',
      storyConnection: 'Inca road planners faced exactly this multi-objective routing problem. The coastal road was flat but long and waterless. The highland road was shorter but crossed 4,000+ m passes. The jungle road was low but required constant clearing. The optimal network used all three, with lateral connecting roads — a solution our Dijkstra engine can derive from first principles.',
      checkQuestion: 'Dijkstra fails with negative edge weights. Why? And why doesn\'t this matter for our terrain routing?',
      checkAnswer: 'Dijkstra assumes that once a node is visited with cost d, no cheaper path exists. A negative edge could create a cheaper path through an already-visited node, violating this assumption. Our terrain routing has only positive costs (distance, climb, river crossings are all >= 0), so Dijkstra is correct and optimal.',
      codeIntro: 'Implement Dijkstra with multi-objective weights and route between Inca cities.',
      code: `import numpy as np

np.random.seed(42)

def build_terrain_graph(rows, cols, cell_km, peaks, river_prob=0.05):
    """Build a terrain graph with altitude, edges, and rivers."""
    alt = np.zeros((rows, cols))
    for pr, pc, h, s in peaks:
        for r in range(rows):
            for c in range(cols):
                d = np.sqrt((r-pr)**2 + (c-pc)**2)
                alt[r,c] += h * np.exp(-d**2/(2*s**2))
    alt += np.random.normal(0, 100, (rows, cols))
    alt = np.clip(alt, 200, 5500)

    # Build adjacency list
    n = rows * cols
    adj = [[] for _ in range(n)]
    directions = [(0,1),(1,0),(0,-1),(-1,0),(1,1),(1,-1),(-1,1),(-1,-1)]

    for r in range(rows):
        for c in range(cols):
            uid = r * cols + c
            for dr, dc in directions:
                nr, nc = r+dr, c+dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    vid = nr * cols + nc
                    h_dist = np.sqrt(dr**2 + dc**2) * cell_km
                    dh = alt[nr,nc] - alt[r,c]
                    river = np.random.random() < river_prob
                    adj[uid].append((vid, h_dist, dh, river))

    return alt, adj

def dijkstra(adj, source, n, climb_pen=0.005, river_pen=8.0):
    """Dijkstra with multi-objective edge weights."""
    dist = [float('inf')] * n
    prev = [-1] * n
    visited = [False] * n
    dist[source] = 0

    for _ in range(n):
        # Find unvisited node with smallest distance
        u = -1
        for i in range(n):
            if not visited[i] and (u == -1 or dist[i] < dist[u]):
                u = i
        if u == -1 or dist[u] == float('inf'):
            break
        visited[u] = True

        for v, h_dist, dh, river in adj[u]:
            cost = h_dist + climb_pen * abs(dh) + (river_pen if river else 0)
            if dist[u] + cost < dist[v]:
                dist[v] = dist[u] + cost
                prev[v] = u

    return dist, prev

def reconstruct_path(prev, target):
    path = []
    node = target
    while node != -1:
        path.append(node)
        node = prev[node]
    return path[::-1]

# Build terrain
rows, cols = 15, 15
cell_km = 8
peaks = [(4,7,4800,3), (9,4,4200,2.5), (7,10,3900,3), (2,2,3500,2)]
alt, adj = build_terrain_graph(rows, cols, cell_km, peaks)

# Define cities
cities = {
    "Coastal port": (0, 0),
    "Valley town": (3, 3),
    "Highland capital": (7, 7),
    "Eastern outpost": (12, 13),
    "Southern hub": (14, 2),
    "Mountain shrine": (4, 10),
}

n = rows * cols

print("=== Dijkstra Multi-Objective Routing Engine ===\
")

# Route from each city to Highland capital
target_name = "Highland capital"
tr, tc = cities[target_name]
target_id = tr * cols + tc

print(f"All routes to {target_name} (alt: {alt[tr,tc]:.0f}m)\
")
print(f"{'From':<20} {'Cost':>8} {'Dist (km)':>10} {'Climb (m)':>10} {'Rivers':>8} {'Steps':>6}")
print("-" * 64)

for name, (r, c) in cities.items():
    if name == target_name:
        continue
    source_id = r * cols + c
    dist_arr, prev = dijkstra(adj, source_id, n, climb_pen=0.005, river_pen=8.0)
    path = reconstruct_path(prev, target_id)

    # Analyse path
    total_dist = 0
    total_climb = 0
    rivers = 0
    for i in range(len(path) - 1):
        u, v = path[i], path[i+1]
        for nbr, hd, dh, riv in adj[u]:
            if nbr == v:
                total_dist += hd
                total_climb += max(0, dh)
                rivers += 1 if riv else 0
                break

    print(f"{name:<20} {dist_arr[target_id]:>7.1f} {total_dist:>8.1f} {total_climb:>8.0f} {rivers:>6} {len(path):>6}")

# Compare penalty settings
print("\
=== Sensitivity: How Altitude Penalty Changes Routes ===")
source_id = 0  # Coastal port
for penalty in [0.0, 0.002, 0.005, 0.010, 0.020, 0.050]:
    dist_arr, prev = dijkstra(adj, source_id, n, climb_pen=penalty)
    path = reconstruct_path(prev, target_id)
    alts_on_path = [alt[p // cols, p % cols] for p in path]
    max_alt = max(alts_on_path)
    total_climb = sum(max(0, alts_on_path[i+1]-alts_on_path[i]) for i in range(len(alts_on_path)-1))
    print(f"  Penalty {penalty:.3f}: cost={dist_arr[target_id]:>7.1f}  "
          f"max_alt={max_alt:>5.0f}m  climb={total_climb:>5.0f}m  steps={len(path)}")`,
      challenge: 'Add a "llama caravan mode" that doubles the altitude penalty above 4,000 m and triples it above 4,500 m (llamas refuse to climb extreme gradients). Compare the optimal routes for foot messengers (chasquis) vs llama caravans. The Inca actually maintained separate routes for these two purposes.',
      successHint: 'You built a complete routing engine with Dijkstra\'s algorithm and multi-objective weights. This is the core of every GPS and mapping application. The insight that edge weights can encode multiple real-world factors (distance, climb, cost, risk) makes graph algorithms incredibly versatile.',
    },
    {
      title: 'Bridge feasibility calculator — catenary analysis meets material limits',
      concept: `Our Road Network Optimiser found routes that cross rivers — now we need to determine whether a bridge is actually **feasible** at each crossing. The bridge feasibility calculator combines:

1. **Catenary analysis**: given span and sag ratio, compute cable tension and rope length
2. **Material strength check**: does the cable tension exceed the breaking strength of ichu grass rope?
3. **Wind loading**: is the bridge stable under expected wind conditions?
4. **Construction cost**: how much rope material is needed, and how many workers for how long?

The critical constraint is **cable tension vs breaking strength**. Ichu grass rope has a tensile strength of approximately 30-50 MPa (depending on weave quality), and typical cable diameters are 10-25 cm. The maximum tension in a catenary cable is:

**T_max = w \u00b7 L\u00b2 / (8 \u00b7 d) \u00b7 \u221a(1 + (4d/L)\u00b2)**

where w is weight per unit length, L is span, and d is sag. If T_max exceeds the rope's breaking force (= tensile strength \u00d7 cross-sectional area), the bridge is infeasible.

\ud83d\udcda *The factor of safety (FoS) is the ratio of breaking strength to actual load. Engineers require FoS \u2265 3 for structural applications — meaning the bridge must be able to support 3\u00d7 its expected maximum load. The Inca achieved this through redundancy: multiple parallel cables.*`,
      analogy: 'Before building a bridge, ask three questions: Can the rope hold the weight? (strength check) Will the wind blow it apart? (stability check) Do we have enough rope? (material check) If any answer is no, either redesign or find a different crossing point. This is engineering feasibility analysis.',
      storyConnection: 'The longest known Inca rope bridge spanned approximately 60 metres across the Apurimac River gorge. At this span, the cable tensions are enormous — the Inca used cables 40+ cm in diameter, woven from hundreds of individual ichu grass strands. Our calculator determines why: the physics demands it.',
      checkQuestion: 'A bridge spans 40 m with 5 m sag. Cable weight is 12 kg/m. What is the approximate horizontal tension?',
      checkAnswer: 'T_horizontal = w \u00b7 L\u00b2 / (8 \u00b7 d) = (12 \u00d7 9.81) \u00d7 40\u00b2 / (8 \u00d7 5) = 117.72 \u00d7 1600 / 40 = 4,709 N \u2248 4.7 kN. The total tension at the supports is higher: T_max = T_h \u00d7 \u221a(1 + (4d/L)\u00b2) = 4709 \u00d7 \u221a(1 + 0.25) = 4709 \u00d7 1.118 = 5,265 N.',
      codeIntro: 'Build a bridge feasibility calculator that evaluates every river crossing in the road network.',
      code: `import numpy as np

class BridgeFeasibility:
    """Evaluate whether a rope bridge is feasible at a given crossing."""

    def __init__(self, span_m, sag_ratio=0.12, n_cables=4,
                 cable_diameter_cm=15, rope_density_kg_m3=800):
        self.span = span_m
        self.sag = span_m * sag_ratio
        self.n_cables = n_cables
        self.diameter = cable_diameter_cm / 100  # metres
        self.rope_density = rope_density_kg_m3
        self.area = np.pi * (self.diameter / 2)**2  # m²
        self.weight_per_m = self.area * rope_density_kg_m3 * 9.81  # N/m

    def cable_tension(self):
        """Maximum tension in a single cable (at supports)."""
        w = self.weight_per_m
        L, d = self.span, self.sag
        T_h = w * L**2 / (8 * d)
        T_max = T_h * np.sqrt(1 + (4 * d / L)**2)
        return T_h, T_max

    def rope_length(self):
        """Total rope needed (catenary arc length × number of cables)."""
        # Catenary parameter
        a = self.span**2 / (8 * self.sag)
        arc = 2 * a * np.sinh(self.span / (2 * a))
        return arc * self.n_cables

    def strength_check(self, tensile_mpa=35, safety_factor=3):
        """Check if cable can handle the tension with safety factor."""
        _, T_max = self.cable_tension()
        per_cable = T_max  # tension per cable
        breaking_force = tensile_mpa * 1e6 * self.area  # N
        allowable = breaking_force / safety_factor
        return per_cable, allowable, per_cable < allowable

    def wind_stability(self, wind_speed_ms=15, air_density=0.85):
        """Lateral wind force and stability assessment."""
        proj_area = self.diameter * self.span * self.n_cables
        F_wind = 0.5 * air_density * wind_speed_ms**2 * 1.2 * proj_area
        _, T_max = self.cable_tension()
        restoring = T_max * self.n_cables * self.sag / self.span
        ratio = restoring / F_wind
        return F_wind, restoring, ratio > 2.0

    def construction_estimate(self, workers_available=30):
        """Estimate construction time and material requirements."""
        rope_m = self.rope_length()
        rope_mass_kg = rope_m * self.area * self.rope_density
        # Ichu grass: ~50 kg grass per kg of finished rope
        grass_kg = rope_mass_kg * 50
        # Weaving rate: ~10 m of cable per day per 5-person team
        teams = workers_available // 5
        weaving_days = rope_m / (10 * max(teams, 1))
        # Installation: 3-5 days
        install_days = 4
        return rope_m, rope_mass_kg, grass_kg, weaving_days + install_days

# Evaluate bridge crossings found by the routing engine
crossings = [
    {"name": "Small stream", "span": 10, "sag_ratio": 0.08, "cables": 2, "diam_cm": 8},
    {"name": "Tributary river", "span": 22, "sag_ratio": 0.10, "cables": 4, "diam_cm": 12},
    {"name": "Q'eswachaka gorge", "span": 28, "sag_ratio": 0.12, "cables": 6, "diam_cm": 15},
    {"name": "Major river", "span": 45, "sag_ratio": 0.14, "cables": 6, "diam_cm": 20},
    {"name": "Apurimac gorge", "span": 60, "sag_ratio": 0.16, "cables": 8, "diam_cm": 25},
    {"name": "Extreme span", "span": 80, "sag_ratio": 0.18, "cables": 8, "diam_cm": 30},
]

print("=== Bridge Feasibility Analysis ===\
")
print(f"{'Crossing':<22} {'Span':>6} {'Tension (kN)':>13} {'Strength':>10} {'Wind':>8} {'Days':>6} {'FEASIBLE':>10}")
print("-" * 77)

for cx in crossings:
    bf = BridgeFeasibility(cx["span"], cx["sag_ratio"], cx["cables"], cx["diam_cm"])
    _, T_max = bf.cable_tension()
    load, allow, strength_ok = bf.strength_check()
    _, _, wind_ok = bf.wind_stability()
    _, _, _, days = bf.construction_estimate()
    feasible = strength_ok and wind_ok
    status = "YES" if feasible else "NO"
    print(f"{cx['name']:<22} {cx['span']:>4}m {T_max/1000:>11.1f} "
          f"{'OK' if strength_ok else 'FAIL':>8} {'OK' if wind_ok else 'FAIL':>8} {days:>5.0f} {status:>8}")

# Detailed report for Q'eswachaka
print("\
=== Detailed Report: Q'eswachaka Bridge ===")
qb = BridgeFeasibility(28, 0.12, 6, 15)
Th, Tm = qb.cable_tension()
load, allow, sok = qb.strength_check()
Fw, Fr, wok = qb.wind_stability()
rope_m, rope_kg, grass_kg, days = qb.construction_estimate(workers_available=100)

print(f"  Span: 28 m | Sag: {28*0.12:.1f} m | Cables: 6 x 15 cm")
print(f"  Horizontal tension: {Th/1000:.1f} kN")
print(f"  Max tension (at supports): {Tm/1000:.1f} kN")
print(f"  Per-cable load: {load/1000:.1f} kN | Allowable: {allow/1000:.1f} kN")
print(f"  Safety factor: {allow/load:.1f}x")
print(f"  Wind force (15 m/s): {Fw:.0f} N | Restoring: {Fr:.0f} N")
print(f"  Total rope: {rope_m:.0f} m | Rope mass: {rope_kg:.0f} kg")
print(f"  Ichu grass needed: {grass_kg:.0f} kg")
print(f"  Construction time (100 workers): {days:.0f} days")`,
      challenge: 'The Apurimac bridge (60 m span) is marked as feasible or infeasible depending on cable diameter. Find the minimum cable diameter that makes it feasible with safety factor 3. Then calculate how much ichu grass is needed — the answer explains why the Inca required entire communities to contribute rope for major bridges.',
      successHint: 'You built a complete engineering feasibility calculator — combining structural analysis (catenary tension), material science (rope strength), environmental loading (wind), and project planning (material quantity, construction time). This is exactly how civil engineers evaluate bridge proposals today.',
    },
    {
      title: 'Integrating the subsystems — the complete optimiser',
      concept: `Now we connect all the pieces: terrain graph + Dijkstra routing + bridge feasibility + network analysis into a single integrated system. The optimiser will:

1. Build the terrain graph from elevation data
2. Find optimal routes between all pairs of cities (all-pairs shortest path)
3. Evaluate bridge feasibility at every river crossing on the optimal routes
4. Identify the minimum spanning tree (the cheapest connected network)
5. Analyse network vulnerability (which road segments are critical)

The key engineering insight is **integration testing**: each subsystem works individually, but do they work together? Does the routing engine correctly use bridge feasibility to adjust edge weights? Does the vulnerability analysis correctly identify the links found by the routing engine?

\ud83d\udcda *Systems integration is where most real engineering projects fail. Individual components work perfectly in isolation but break when connected — due to incompatible interfaces, unstated assumptions, or emergent behaviour. Testing the integrated system is as important as testing the parts.*`,
      analogy: 'A car has an engine, transmission, brakes, and steering — each designed separately. Integration is assembling them into a vehicle that actually drives. An engine that\'s perfect in isolation is useless if it doesn\'t connect to the transmission. Our optimiser is the same: routing + bridges + analysis must work as one system.',
      storyConnection: 'The Qhapaq Nan was an integrated system: roads, bridges, tambos, qollqas, and chasqui relay stations worked together as a unified logistics network. A road without bridges was useless; bridges without tambos were unsupported; tambos without qollqas were undersupplied. The Inca understood systems integration millennia before the term existed.',
      checkQuestion: 'If the bridge feasibility calculator marks a crossing as infeasible, how should the routing engine respond?',
      checkAnswer: 'It should dramatically increase the edge weight for that crossing (or set it to infinity), forcing Dijkstra to find an alternative route that avoids the infeasible bridge. This is the feedback loop between subsystems: bridge analysis informs routing, which then re-evaluates the network. The system iterates until all bridges on the chosen routes are feasible.',
      codeIntro: 'Integrate routing, bridge analysis, and network vulnerability into a complete Road Network Optimiser.',
      code: `import numpy as np

np.random.seed(42)

# === Integrated Road Network Optimiser ===

# 1. Build terrain
rows, cols, cell_km = 12, 12, 10
alt = np.zeros((rows, cols))
for pr, pc, h, s in [(3,6,4800,2.5),(8,3,4000,3),(6,9,3600,2.5),(10,8,3200,2)]:
    for r in range(rows):
        for c in range(cols):
            d = np.sqrt((r-pr)**2+(c-pc)**2)
            alt[r,c] += h * np.exp(-d**2/(2*s**2))
alt += np.random.normal(0, 120, (rows,cols))
alt = np.clip(alt, 300, 5500)

cities = {"Coastal":(0,0), "Valley":(3,3), "Capital":(6,6),
          "East":(10,10), "South":(11,2), "North":(1,10)}

# 2. Build graph with river markers
n = rows * cols
adj = [[] for _ in range(n)]
river_edges = set()

for r in range(rows):
    for c in range(cols):
        uid = r*cols+c
        for dr,dc in [(0,1),(1,0),(1,1),(1,-1)]:
            nr,nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols:
                vid = nr*cols+nc
                hd = np.sqrt(dr**2+dc**2)*cell_km
                dh = alt[nr,nc]-alt[r,c]
                river = np.random.random() < 0.06
                if river:
                    river_edges.add((min(uid,vid),max(uid,vid)))
                adj[uid].append((vid, hd, dh, river))
                adj[vid].append((uid, hd, -dh, river))

# 3. Dijkstra (integrated with bridge feasibility)
def integrated_dijkstra(adj, source, n, infeasible_rivers=set()):
    dist = [float('inf')]*n
    prev = [-1]*n
    visited = [False]*n
    dist[source] = 0

    for _ in range(n):
        u = -1
        for i in range(n):
            if not visited[i] and (u==-1 or dist[i]<dist[u]):
                u = i
        if u==-1 or dist[u]==float('inf'):
            break
        visited[u] = True

        for v, hd, dh, river in adj[u]:
            edge_key = (min(u,v),max(u,v))
            if river and edge_key in infeasible_rivers:
                cost = hd + 0.005*abs(dh) + 1000  # effectively blocked
            else:
                cost = hd + 0.005*abs(dh) + (8 if river else 0)
            if dist[u]+cost < dist[v]:
                dist[v] = dist[u]+cost
                prev[v] = u
    return dist, prev

# 4. Bridge feasibility check
def check_bridge(span_m):
    cable_diam = max(0.10, span_m * 0.004)  # scale diameter with span
    area = np.pi*(cable_diam/2)**2
    w = area * 800 * 9.81
    sag = span_m * 0.13
    T_h = w * span_m**2 / (8*sag)
    T_max = T_h * np.sqrt(1+(4*sag/span_m)**2)
    breaking = 35e6 * area
    fos = breaking / T_max
    return fos >= 3.0, fos, T_max

# 5. Run integrated analysis
print("=== INTEGRATED ROAD NETWORK OPTIMISER ===\
")

# Check all river crossings
infeasible = set()
print("Bridge Feasibility:")
for edge in river_edges:
    span = np.random.uniform(8, 55)  # random span for each river
    feasible, fos, tension = check_bridge(span)
    status = "OK" if feasible else "INFEASIBLE"
    if not feasible:
        infeasible.add(edge)
    u, v = edge
    print(f"  Edge ({u:>3}->{v:>3}) span={span:>4.0f}m  FoS={fos:>4.1f}  {status}")

print(f"\
Total crossings: {len(river_edges)} | Infeasible: {len(infeasible)}")

# Route all city pairs with infeasible bridges blocked
print("\
=== Optimal Routes (infeasible bridges blocked) ===")
print(f"{'From':<12} {'To':<12} {'Cost':>8} {'Path len':>9}")
print("-" * 43)

city_ids = {name: r*cols+c for name, (r,c) in cities.items()}
for src_name, src_id in city_ids.items():
    dist, prev = integrated_dijkstra(adj, src_id, n, infeasible)
    for dst_name, dst_id in city_ids.items():
        if src_name >= dst_name:
            continue
        path = []
        node = dst_id
        while node != -1:
            path.append(node)
            node = prev[node]
        path = path[::-1]
        print(f"{src_name:<12} {dst_name:<12} {dist[dst_id]:>7.1f} {len(path):>7}")

# 6. Critical link analysis
print("\
=== Critical Link Analysis ===")
print("Removing each city and measuring connectivity loss:\
")

for remove_name, remove_id in city_ids.items():
    # Route without this city
    blocked_adj = [[] for _ in range(n)]
    for u in range(n):
        if u == remove_id:
            continue
        for v, hd, dh, riv in adj[u]:
            if v != remove_id:
                blocked_adj[u].append((v, hd, dh, riv))

    # Check if remaining cities still connected
    src = [cid for cn, cid in city_ids.items() if cn != remove_name][0]
    dist, _ = integrated_dijkstra(blocked_adj, src, n)
    reachable = sum(1 for cn, cid in city_ids.items()
                   if cn != remove_name and dist[cid] < float('inf'))
    total = len(cities) - 1
    print(f"  Remove {remove_name:<12}: {reachable}/{total-1} cities still reachable "
          f"{'-- CRITICAL' if reachable < total-1 else '-- OK'}")

print("\
Integrated optimiser complete: routing + bridges + vulnerability.")`,
      challenge: 'Add a "construction priority" output: rank the road segments by importance (how many shortest paths use that segment) and list the top 10 segments to build first. This is the real-world problem of infrastructure prioritization — which road should we build first to maximize connectivity per unit cost?',
      successHint: 'You integrated four subsystems into a complete engineering tool: terrain modelling, multi-objective routing, structural feasibility analysis, and network vulnerability assessment. This is systems engineering — the discipline of building complex systems from interacting components. The integration step is where engineering separates from coding.',
    },
    {
      title: 'Portfolio presentation — documenting the Road Network Optimiser',
      concept: `The final step in any engineering project is **documentation** — recording what you built, why, how it works, and what it tells you. A well-documented project becomes a **portfolio piece** that demonstrates your skills to future employers, collaborators, or universities.

Your Road Network Optimiser documentation should include:

1. **Introduction** — what problem does it solve?
2. **Methodology** — what algorithms, models, and data structures did you use?
3. **Results** — what routes, bridges, and vulnerabilities did you find?
4. **Conclusions** — what design recommendations emerge?
5. **Limitations** — what does the model NOT capture?
6. **Future work** — how could it be improved?

This is the structure of a **technical report** — the standard format in engineering, science, and industry for communicating results.

\ud83d\udcda *The ability to explain technical work clearly is often more valuable than the technical work itself. A brilliant analysis that nobody can understand has zero impact.*`,
      analogy: 'An architect doesn\'t just build a building — they produce drawings, specifications, and a design rationale. The building might stand for a century, but the documentation is what allows future engineers to maintain, modify, and learn from it. Your code documentation serves the same purpose.',
      storyConnection: 'The Spanish chroniclers who documented the Qhapaq Nan (Pedro Cieza de Leon, Bernabe Cobo) created the only surviving record of the Inca road system\'s design principles. Without their documentation, centuries of engineering knowledge would have been lost entirely. Good documentation outlasts the infrastructure it describes.',
      checkQuestion: 'Why is documenting limitations important? Doesn\'t it make your work look weak?',
      checkAnswer: 'The opposite — documenting limitations shows intellectual honesty and engineering maturity. Every model is a simplification. A reader who trusts your results because you didn\'t mention limitations is being misled. A reader who trusts your results despite knowing the limitations is making an informed decision. That\'s what engineering requires.',
      codeIntro: 'Generate a formatted project documentation page for the Road Network Optimiser.',
      code: `# Road Network Optimiser — Project Documentation

print("""
================================================================
          ROAD NETWORK OPTIMISER
              Project Documentation
================================================================

1. INTRODUCTION
---------------
This optimiser designs road networks through mountainous terrain,
inspired by the Inca Qhapaq Nan — a 40,000 km road system that
connected the Andes from Colombia to Chile. Given terrain data
and city locations, it finds optimal routes, evaluates bridge
feasibility, and analyses network vulnerability.

2. METHODOLOGY
--------------
The optimiser uses four integrated subsystems:

  a) Terrain Graph Construction:
     - Elevation grid sampled at regular intervals
     - Nodes = grid points, edges = adjacent cells
     - Edge weights: distance + altitude_penalty + river_penalty

  b) Dijkstra Routing Engine:
     - Multi-objective shortest path (distance, climb, crossings)
     - Altitude penalty: configurable (default 0.005 km per m)
     - River crossings: feasibility-gated (infeasible = blocked)
     - All-pairs routing between cities

  c) Bridge Feasibility Calculator:
     - Catenary tension analysis: T = wL^2/(8d) * sqrt(1+(4d/L)^2)
     - Material strength check: ichu grass rope at 35 MPa
     - Safety factor requirement: >= 3.0
     - Wind stability: restoring force vs drag at 15 m/s

  d) Network Vulnerability Analysis:
     - Node removal impact (targeted attack simulation)
     - Critical link identification
     - Percolation threshold estimation

3. KEY FINDINGS
---------------
  - Altitude penalty dominates route choice: routes avoid peaks
    even at 2-3x the flat-ground distance
  - Bridge feasibility constrains spans to ~60 m for grass rope;
    longer spans require cable diameters exceeding practical limits
  - Network hubs (capital cities) are critical vulnerabilities:
    removing a single hub can fragment the entire network
  - The MST uses only ~30% of possible edges but maintains
    full connectivity — matching the Inca approach

4. DESIGN RECOMMENDATIONS
-------------------------
  - Build redundant paths around hub cities (2-connected subgraph)
  - Place bridge maintenance teams at all crossings > 30 m span
  - Space qollqas (storehouses) to minimise maximum travel time
  - Maintain separate routes for foot traffic and llama caravans

5. LIMITATIONS
--------------
  - Grid-based terrain (real terrain requires TIN or contour data)
  - Static analysis (no seasonal variation: floods, snow, mud)
  - Simplified bridge model (no dynamic loading, fatigue)
  - No construction cost model (labour, material transport)
  - Single objective optimisation (Pareto frontier not explored)

6. FUTURE IMPROVEMENTS
----------------------
  - Import real DEM (Digital Elevation Model) data
  - Add seasonal weather overlay (wet/dry season routing)
  - Multi-objective Pareto optimisation (cost vs time vs risk)
  - Stochastic simulation (Monte Carlo route reliability)
  - Dynamic routing (reroute when roads are damaged)

7. SKILLS DEMONSTRATED
----------------------
  + Graph algorithms (Dijkstra, Kruskal MST, A*)
  + Structural analysis (catenary, tension, safety factors)
  + Physiology modelling (Hill equation, EPO kinetics)
  + Network science (percolation, vulnerability)
  + Systems integration (4 subsystems, feedback loops)
  + Technical documentation

================================================================
""")

# Skills summary for portfolio
skills = [
    ("Graph algorithms", "Dijkstra, A*, Kruskal, Prim, BFS"),
    ("Structural engineering", "Catenary math, tension, wind loading"),
    ("Physiology", "Hb-O2 dissociation, EPO kinetics, acclimatization"),
    ("Network science", "Percolation theory, vulnerability, MST"),
    ("Computational theory", "Turing machines, base conversion, quipu encoding"),
    ("Systems engineering", "Multi-subsystem integration, feasibility analysis"),
    ("Python programming", "OOP, NumPy, simulation, data analysis"),
]

print("PORTFOLIO SKILLS SUMMARY:")
for skill, detail in skills:
    print(f"  * {skill}: {detail}")

print()
print("This project demonstrates the ability to model a real")
print("historical engineering system using modern computational")
print("tools — connecting mathematics, physics, biology, and")
print("computer science into an integrated analysis platform.")`,
      challenge: 'Turn this documentation into a real portfolio piece. Add your name, date, and a 2-sentence summary suitable for a CV/resume. If you completed all four levels, list every algorithm you implemented and every equation you used. This document — plus your code — is evidence of genuine engineering and computational skills.',
      successHint: 'You\'ve completed a full engineering project cycle: problem definition, system design, implementation, integration, analysis, and documentation. This is exactly what professional engineers do. The Inca built one of history\'s greatest road networks through empirical engineering; you modelled it through computational engineering. Both are valid and powerful approaches to understanding the world.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Road Network Optimiser</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Road Network Optimiser for the Inca Qhapaq Nan.
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
