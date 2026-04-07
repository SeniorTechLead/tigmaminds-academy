import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ChettinadLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Minimum spanning tree — the cheapest way to connect all ports',
      concept: `If you want to establish a trade network connecting all ports with the minimum total cost of shipping routes, you need a **minimum spanning tree** (MST). A spanning tree is a subset of edges that connects all nodes without any cycles, and the MST is the one with the smallest total edge weight.

**Kruskal's algorithm** finds the MST by sorting all edges by weight (cost) and adding them one by one, skipping any edge that would create a cycle. The result is the cheapest possible connected network.

In the code below, you will implement Kruskal's algorithm to find the minimum-cost trade network connecting all Chettinad ports. This is the foundation of network design — used for telephone networks, power grids, and transportation systems.

*A spanning tree with n nodes always has exactly n-1 edges. This is the minimum number of edges needed to connect all nodes. Adding any edge creates a cycle; removing any edge disconnects the tree.*`,
      analogy: 'Imagine you need to connect 9 villages with roads, and building each road has a different cost. You want everyone connected but with the least total road construction. Kruskal says: build the cheapest road first, then the next cheapest, and so on — but skip any road that only connects villages that are already connected through existing roads.',
      storyConnection: 'The Chettinad trading house needed to maintain permanent agents at multiple ports, connected by regular shipping services. The MST told them the minimum network of regular routes needed to keep all agents connected — any additional routes were profit opportunities, not necessities.',
      checkQuestion: 'If there are 9 ports, how many edges does the MST have?',
      checkAnswer: '9 - 1 = 8 edges. A spanning tree always has exactly n-1 edges for n nodes. With 9 ports and 12 possible routes, the MST selects only 8 routes — the cheapest 8 that keep all ports connected without cycles.',
      codeIntro: 'Find the minimum spanning tree of the Chettinad trade network using Kruskal\'s algorithm.',
      code: `import numpy as np

class UnionFind:
    """Disjoint set data structure for cycle detection in Kruskal's."""
    def __init__(self, nodes):
        self.parent = {n: n for n in nodes}
        self.rank = {n: 0 for n in nodes}

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False  # already connected (would create cycle)
        if self.rank[rx] < self.rank[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1
        return True

def kruskal_mst(nodes, edges, weight_key="cost"):
    """Find minimum spanning tree using Kruskal's algorithm."""
    sorted_edges = sorted(edges, key=lambda e: e[weight_key])
    uf = UnionFind(nodes)
    mst = []
    total_weight = 0

    for edge in sorted_edges:
        if uf.union(edge["from"], edge["to"]):
            mst.append(edge)
            total_weight += edge[weight_key]
            if len(mst) == len(nodes) - 1:
                break

    return mst, total_weight

# Trade network
nodes = ["Karaikal", "Nagapattinam", "Colombo", "Penang", "Singapore",
         "Saigon", "Rangoon", "Madras", "Cochin"]

edges = [
    {"from": "Karaikal", "to": "Nagapattinam", "cost": 5, "distance": 30, "days": 0.5},
    {"from": "Karaikal", "to": "Colombo", "cost": 30, "distance": 500, "days": 5},
    {"from": "Karaikal", "to": "Madras", "cost": 20, "distance": 300, "days": 3},
    {"from": "Karaikal", "to": "Cochin", "cost": 35, "distance": 600, "days": 6},
    {"from": "Colombo", "to": "Penang", "cost": 80, "distance": 2800, "days": 14},
    {"from": "Colombo", "to": "Singapore", "cost": 90, "distance": 3200, "days": 16},
    {"from": "Penang", "to": "Singapore", "cost": 25, "distance": 600, "days": 3},
    {"from": "Singapore", "to": "Saigon", "cost": 50, "distance": 1200, "days": 6},
    {"from": "Penang", "to": "Rangoon", "cost": 70, "distance": 1800, "days": 10},
    {"from": "Madras", "to": "Rangoon", "cost": 75, "distance": 1800, "days": 12},
    {"from": "Cochin", "to": "Colombo", "cost": 25, "distance": 400, "days": 4},
    {"from": "Nagapattinam", "to": "Penang", "cost": 75, "distance": 2400, "days": 12},
]

# Find MST by cost
mst_cost, total_cost = kruskal_mst(nodes, edges, "cost")

print("=== Minimum Spanning Tree (by cost) ===")
print(f"Total routes: {len(edges)} | MST routes: {len(mst_cost)}")
print(f"Total network cost: {sum(e['cost'] for e in edges)} $/ton")
print(f"MST cost: {total_cost} $/ton")
print(f"Savings: {sum(e['cost'] for e in edges) - total_cost} $/ton")
print()

header = "Route                              Cost  Distance  Days"
print(header)
print("-" * len(header))

for e in mst_cost:
    print(f"  {e['from']:<15} -- {e['to']:<15} {e['cost']:>4}  {e['distance']:>8}  {e['days']:>4}")

# Compare MST by different criteria
print()
print("=== MST Comparison by Criterion ===")
for criterion in ["cost", "distance", "days"]:
    mst, total = kruskal_mst(nodes, edges, criterion)
    total_cost_of_mst = sum(e["cost"] for e in mst)
    total_dist_of_mst = sum(e["distance"] for e in mst)
    total_days_of_mst = sum(e["days"] for e in mst)
    print(f"  MST by {criterion:<8}: cost={total_cost_of_mst:>4} "
          f"dist={total_dist_of_mst:>5} days={total_days_of_mst:>4}")`,
      challenge: 'Compare the MST to the full network: what routes are NOT in the MST? These are "redundant" routes that add cost but provide resilience (alternative paths if a route is blocked by monsoon or piracy). Calculate the "resilience value" of each non-MST route.',
      successHint: 'Kruskal\'s algorithm is one of the classic algorithms in computer science. It is used in network design, circuit layout, cluster analysis, and image segmentation. You have connected historical trade network design to modern computational optimization.',
    },
    {
      title: 'Network flow — maximum cargo through the trade network',
      concept: `How much total cargo can flow from the spice-producing ports of Kerala to the markets of Southeast Asia? This is a **maximum flow** problem. Each route has a capacity (maximum tons per month), and the total flow through the network is limited by **bottlenecks** — routes where capacity is fully used.

The **max-flow min-cut theorem** states that the maximum flow from source to sink equals the minimum cut — the smallest total capacity of edges whose removal would completely disconnect source from sink. Finding the bottleneck tells you where to invest in additional capacity.

In the code below, you will calculate the maximum flow through the Chettinad trade network and identify the bottleneck routes that limit throughput.

*The max-flow problem appears everywhere: traffic flow through road networks, data flow through internet cables, oil flow through pipelines, and even matching problems (assigning workers to jobs).*`,
      analogy: 'Imagine the trade network as water pipes. Each pipe has a maximum flow rate (capacity). Water enters at the source (Cochin) and exits at the sink (Saigon). The maximum total flow is limited by the narrowest pipe along the way — the bottleneck. Widening the bottleneck pipe is the most effective way to increase total flow.',
      storyConnection: 'The Chettinad trading houses constantly invested in the bottleneck routes — buying larger ships for the Colombo-Penang run, building warehouses at Singapore to handle more cargo, or establishing new routes to bypass congested ports. Identifying and alleviating bottlenecks was the key to growing trade volume.',
      checkQuestion: 'If the route Colombo-Penang has a capacity of 100 tons/month and is the only connection between the Indian and Southeast Asian networks, what is the maximum flow to Saigon?',
      checkAnswer: 'At most 100 tons/month, regardless of how much capacity exists on other routes. The Colombo-Penang route is a single bottleneck (a "bridge" in graph theory). The max-flow min-cut theorem confirms this: cutting this one edge disconnects the network, and its capacity (100 tons) equals the max flow.',
      codeIntro: 'Calculate maximum flow and identify bottlenecks in the trade network.',
      code: `import numpy as np

def ford_fulkerson(nodes, edges, source, sink):
    """Simple max-flow using Ford-Fulkerson with BFS (Edmonds-Karp)."""
    # Build adjacency with capacities
    capacity = {}
    flow = {}
    adj = {n: [] for n in nodes}

    for e in edges:
        a, b = e["from"], e["to"]
        cap = e["capacity"]
        capacity[(a, b)] = capacity.get((a, b), 0) + cap
        capacity[(b, a)] = capacity.get((b, a), 0) + cap  # undirected
        flow[(a, b)] = 0
        flow[(b, a)] = 0
        if b not in adj[a]:
            adj[a].append(b)
        if a not in adj[b]:
            adj[b].append(a)

    def bfs_path():
        visited = {source}
        queue = [(source, [source])]
        while queue:
            node, path = queue.pop(0)
            for neighbour in adj[node]:
                residual = capacity.get((node, neighbour), 0) - flow.get((node, neighbour), 0)
                if neighbour not in visited and residual > 0:
                    visited.add(neighbour)
                    new_path = path + [neighbour]
                    if neighbour == sink:
                        return new_path
                    queue.append((neighbour, new_path))
        return None

    total_flow = 0
    while True:
        path = bfs_path()
        if path is None:
            break
        # Find bottleneck along path
        min_cap = float('inf')
        for i in range(len(path) - 1):
            a, b = path[i], path[i + 1]
            residual = capacity[(a, b)] - flow[(a, b)]
            min_cap = min(min_cap, residual)

        # Update flow
        for i in range(len(path) - 1):
            a, b = path[i], path[i + 1]
            flow[(a, b)] += min_cap
            flow[(b, a)] -= min_cap

        total_flow += min_cap

    return total_flow, flow

# Trade network with capacities (tons per month)
nodes = ["Cochin", "Colombo", "Karaikal", "Madras",
         "Penang", "Singapore", "Saigon", "Rangoon"]

edges = [
    {"from": "Cochin", "to": "Colombo", "capacity": 200},
    {"from": "Cochin", "to": "Karaikal", "capacity": 150},
    {"from": "Karaikal", "to": "Colombo", "capacity": 100},
    {"from": "Karaikal", "to": "Madras", "capacity": 120},
    {"from": "Colombo", "to": "Penang", "capacity": 180},
    {"from": "Colombo", "to": "Singapore", "capacity": 150},
    {"from": "Madras", "to": "Rangoon", "capacity": 100},
    {"from": "Penang", "to": "Singapore", "capacity": 200},
    {"from": "Penang", "to": "Rangoon", "capacity": 80},
    {"from": "Singapore", "to": "Saigon", "capacity": 250},
    {"from": "Rangoon", "to": "Saigon", "capacity": 60},
]

max_flow, flow_values = ford_fulkerson(nodes, edges, "Cochin", "Saigon")

print("=== Maximum Flow: Cochin to Saigon ===")
print(f"Maximum throughput: {max_flow} tons/month")
print()

print("--- Flow on Each Route ---")
header = "Route                          Capacity  Flow   Utilization"
print(header)
print("-" * len(header))

bottlenecks = []
for e in edges:
    a, b = e["from"], e["to"]
    f = flow_values.get((a, b), 0)
    if f < 0:
        f = 0
    cap = e["capacity"]
    util = f / cap * 100 if cap > 0 else 0
    status = " <-- BOTTLENECK" if util > 95 else ""
    if util > 95:
        bottlenecks.append(e)
    print(f"  {a:<12} -> {b:<12} {cap:>7}   {f:>4}   {util:>8.0f}%{status}")

print()
print(f"Bottleneck routes: {len(bottlenecks)}")
for b in bottlenecks:
    print(f"  {b['from']} -> {b['to']} (capacity: {b['capacity']})")
print()
print("Increasing bottleneck capacity has the most impact on total flow.")`,
      challenge: 'Model the effect of upgrading each bottleneck route by 50 tons/month capacity. Which single upgrade gives the biggest increase in total flow? This is the "best investment" problem — where should the trading house spend its capital?',
      successHint: 'You just implemented the Ford-Fulkerson max-flow algorithm. It is used in transportation planning, telecommunications network design, bipartite matching (job assignments), and even baseball elimination problems. The Chettinad traders solved the same optimization problem intuitively.',
    },
    {
      title: 'Travelling salesman — the optimal multi-port trading voyage',
      concept: `A Chettinad merchant ship must visit multiple ports (to buy and sell different spices) and return home. The **Travelling Salesman Problem** (TSP) asks: what is the shortest (or cheapest) route that visits every port exactly once and returns to the starting port?

TSP is one of the most famous problems in computer science because it is **NP-hard** — the number of possible routes grows factorially. With just 10 ports, there are 10!/2 = 1,814,400 possible routes. With 20 ports, there are over 60 quintillion. No known algorithm can solve it quickly for large inputs.

In the code below, you will solve the TSP for the Chettinad network using a **nearest-neighbour heuristic** (always go to the closest unvisited port) and compare it to brute-force search (trying all permutations for small networks).

*The TSP is not just a theoretical curiosity — it has direct applications in delivery routing (Amazon, UPS), circuit board drilling (the drill must visit every hole), DNA sequencing (finding the shortest path through gene fragments), and telescope scheduling.*`,
      analogy: 'Imagine a pizza delivery driver with 8 orders. The fastest route visits every house once with minimum driving. With 8 houses, there are 2520 possible orderings — too many to check by hand but feasible for a computer. With 20 houses (362 billion orderings), even a fast computer needs clever shortcuts.',
      storyConnection: 'A Chettinad merchant ship leaving Karaikal might visit Colombo, Penang, Singapore, Saigon, and Rangoon before returning. The order matters enormously: visiting Saigon before Penang adds thousands of kilometres of backtracking. The merchant captain planned the route based on monsoon winds and market timing, effectively solving a multi-objective TSP.',
      checkQuestion: 'With 5 ports (plus home), how many possible round-trip routes are there?',
      checkAnswer: '(5-1)! / 2 = 12 distinct routes (we fix the starting port and divide by 2 because clockwise and counterclockwise give the same distance). With 10 ports, this explodes to 181,440 routes. This exponential growth is why TSP is so hard.',
      codeIntro: 'Solve the multi-port trading voyage using heuristic and exact methods.',
      code: `import numpy as np
from itertools import permutations

# Distance matrix between ports (in km, simplified)
ports = ["Karaikal", "Colombo", "Penang", "Singapore", "Saigon", "Rangoon"]
n = len(ports)

dist = np.array([
    [   0,  500, 2500, 3200, 4400, 2000],  # Karaikal
    [ 500,    0, 2800, 3200, 4400, 2500],  # Colombo
    [2500, 2800,    0,  600, 1800, 1800],  # Penang
    [3200, 3200,  600,    0, 1200, 2200],  # Singapore
    [4400, 4400, 1800, 1200,    0, 2000],  # Saigon
    [2000, 2500, 1800, 2200, 2000,    0],  # Rangoon
])

def route_distance(route, distance_matrix):
    total = 0
    for i in range(len(route) - 1):
        total += distance_matrix[route[i]][route[i + 1]]
    total += distance_matrix[route[-1]][route[0]]  # return home
    return total

def nearest_neighbour(start, distance_matrix):
    """Greedy nearest-neighbour heuristic for TSP."""
    n = len(distance_matrix)
    route = [start]
    visited = {start}

    while len(route) < n:
        current = route[-1]
        best_next = None
        best_dist = float('inf')
        for j in range(n):
            if j not in visited and distance_matrix[current][j] < best_dist:
                best_dist = distance_matrix[current][j]
                best_next = j
        route.append(best_next)
        visited.add(best_next)

    return route

def brute_force_tsp(distance_matrix):
    """Exact solution by trying all permutations."""
    n = len(distance_matrix)
    best_route = None
    best_dist = float('inf')

    for perm in permutations(range(1, n)):
        route = [0] + list(perm)
        d = route_distance(route, distance_matrix)
        if d < best_dist:
            best_dist = d
            best_route = route

    return best_route, best_dist

# Solve with nearest neighbour
nn_route = nearest_neighbour(0, dist)
nn_dist = route_distance(nn_route, dist)

# Solve exactly (brute force - feasible for 6 ports)
exact_route, exact_dist = brute_force_tsp(dist)

print("=== Travelling Salesman: Chettinad Trading Voyage ===")
print(f"Ports: {', '.join(ports)}")
print(f"Total possible routes: {np.math.factorial(n-1) // 2}")
print()

print("--- Nearest Neighbour Heuristic ---")
route_names = [ports[i] for i in nn_route]
print(f"  Route: {' -> '.join(route_names)} -> {ports[nn_route[0]]}")
print(f"  Total distance: {nn_dist:,.0f} km")

print()
print("--- Exact (Brute Force) Solution ---")
route_names = [ports[i] for i in exact_route]
print(f"  Route: {' -> '.join(route_names)} -> {ports[exact_route[0]]}")
print(f"  Total distance: {exact_dist:,.0f} km")

gap = (nn_dist - exact_dist) / exact_dist * 100
print(f"\\\n  Heuristic gap: {gap:.1f}% longer than optimal")

# Show all legs of optimal route
print()
print("--- Optimal Route Legs ---")
for i in range(len(exact_route)):
    a = exact_route[i]
    b = exact_route[(i + 1) % len(exact_route)]
    print(f"  {ports[a]:<12} -> {ports[b]:<12}  {dist[a][b]:>6,.0f} km")`,
      challenge: 'Add "port profit" to the model: each port has a different profit opportunity. Modify the TSP to find the route that maximizes profit minus travel cost. This is the "Travelling Purchaser Problem" — closer to what the Chettinad traders actually optimized.',
      successHint: 'You just tackled the Travelling Salesman Problem — arguably the most famous problem in combinatorial optimization. Despite 70 years of research, no efficient exact algorithm is known for large instances. This problem connects ancient trade route planning to the deepest questions in theoretical computer science.',
    },
    {
      title: 'Risk modelling — monsoons, piracy, and portfolio diversification',
      concept: `Trade is risky. Ships can be delayed by **monsoons**, attacked by **pirates**, or suffer **cargo damage** from storms. A wise trader does not put all goods on one ship or use one route — they **diversify** to reduce risk, just like modern portfolio theory in finance.

The key insight is that **uncorrelated risks reduce total risk**. If two ships have independent 10% chances of loss, sending half the cargo on each reduces the chance of losing everything from 10% to 1% (0.1 x 0.1). The expected loss is the same, but the worst-case scenario improves dramatically.

In the code below, you will model trade risks, calculate expected profits under uncertainty, and demonstrate how diversification reduces risk. This connects the Chettinad trade to modern financial theory.

*Harry Markowitz won the Nobel Prize in Economics (1990) for Modern Portfolio Theory, which formalises the diversification principle. The Chettinad traders applied the same principle centuries earlier by spreading cargo across multiple ships and routes.*`,
      analogy: 'Imagine betting on coin flips. Betting everything on one flip gives you a 50% chance of losing everything. Betting on 10 separate flips and averaging the results still has the same expected return, but the chance of losing everything drops to 0.1% (0.5 to the power of 10). The Chettinad traders "bet" on multiple ships, routes, and spice types.',
      storyConnection: 'The Chettinad Nattukotai Chettiars were legendary risk managers. They never put more than one-third of their capital on any single voyage, maintained agents at multiple ports to get price information, and traded in multiple commodities so a price collapse in one spice did not bankrupt the firm.',
      checkQuestion: 'A trader has $10000 and two routes. Route A has 80% chance of 50% profit and 20% chance of total loss. Route B has 90% chance of 30% profit and 10% chance of total loss. Which route has higher expected value?',
      checkAnswer: 'Route A expected value: 0.8 x 15000 + 0.2 x 0 = $12000. Route B expected value: 0.9 x 13000 + 0.1 x 0 = $11700. Route A has higher expected value ($12000 vs $11700). But Route A also has higher risk (20% chance of ruin vs 10%). A risk-averse trader might prefer B or split between both.',
      codeIntro: 'Model trade risks and demonstrate the power of diversification.',
      code: `import numpy as np

np.random.seed(42)

def simulate_voyage(investment, profit_rate, loss_chance, n_simulations=10000):
    """Simulate a single voyage many times."""
    outcomes = []
    for _ in range(n_simulations):
        if np.random.random() < loss_chance:
            outcomes.append(0)  # total loss
        else:
            outcomes.append(investment * (1 + profit_rate))
    return np.array(outcomes)

def simulate_diversified(investment, voyages, n_simulations=10000):
    """Simulate splitting investment across multiple voyages."""
    n_voyages = len(voyages)
    per_voyage = investment / n_voyages
    outcomes = np.zeros(n_simulations)

    for profit_rate, loss_chance in voyages:
        for i in range(n_simulations):
            if np.random.random() < loss_chance:
                pass  # this portion lost
            else:
                outcomes[i] += per_voyage * (1 + profit_rate)

    return outcomes

investment = 10000

# Single voyage strategies
print("=== Single Voyage Risk Analysis ===")
print(f"Investment: \{investment:,}")
print()

strategies = [
    ("Risky route (50% profit, 20% loss)", 0.50, 0.20),
    ("Safe route (30% profit, 10% loss)", 0.30, 0.10),
    ("Very risky (80% profit, 30% loss)", 0.80, 0.30),
]

header = "Strategy                           E[Return]  P(Ruin)  P(Profit)  Worst5%"
print(header)
print("-" * len(header))

for name, profit, loss in strategies:
    outcomes = simulate_voyage(investment, profit, loss)
    expected = np.mean(outcomes)
    ruin_pct = np.mean(outcomes == 0) * 100
    profit_pct = np.mean(outcomes > investment) * 100
    worst_5 = np.percentile(outcomes, 5)
    print(f"{name:<35} \{expected:>7,.0f}  {ruin_pct:>5.1f}%  {profit_pct:>7.1f}%  \{worst_5:>7,.0f}")

# Diversified strategies
print()
print("=== Diversification: Splitting Across Voyages ===")
print()

configs = [
    ("All on risky route", [(0.50, 0.20)]),
    ("Split: 2 risky routes", [(0.50, 0.20)] * 2),
    ("Split: 4 risky routes", [(0.50, 0.20)] * 4),
    ("Split: 1 risky + 1 safe", [(0.50, 0.20), (0.30, 0.10)]),
    ("Split: 2 risky + 2 safe", [(0.50, 0.20), (0.50, 0.20), (0.30, 0.10), (0.30, 0.10)]),
]

header2 = "Strategy                          E[Return]  P(Ruin)  Std Dev   Worst5%"
print(header2)
print("-" * len(header2))

for name, voyages in configs:
    outcomes = simulate_diversified(investment, voyages)
    expected = np.mean(outcomes)
    ruin_pct = np.mean(outcomes == 0) * 100
    std = np.std(outcomes)
    worst_5 = np.percentile(outcomes, 5)
    print(f"{name:<34} \{expected:>7,.0f}  {ruin_pct:>5.1f}%  \{std:>6,.0f}   \{worst_5:>7,.0f}")

print()
print("Diversification dramatically reduces ruin probability")
print("while maintaining similar expected returns.")
print("The Chettinad traders were early portfolio theorists!")`,
      challenge: 'Add correlated risks: if a monsoon hits one route, it likely affects nearby routes too. Model a 50% correlation between the two riskiest routes. How does correlation reduce the benefit of diversification? This is exactly why the 2008 financial crisis was so severe — everyone thought their risks were diversified but they were actually correlated.',
      successHint: 'You just demonstrated the fundamental theorem of diversification — one of the most important ideas in finance and risk management. The same mathematics applies to investment portfolios, insurance, engineering redundancy, and even species diversity in ecosystems.',
    },
    {
      title: 'Dynamic pricing — adjusting prices based on supply and demand',
      concept: `Spice prices were not fixed — they fluctuated based on **supply** (harvest size, number of ships arriving) and **demand** (population, festivals, wars). A shrewd trader bought when prices were low (oversupply) and sold when prices were high (undersupply). This is the foundation of **market economics**.

The price is set by the intersection of the supply and demand curves. When supply increases (good harvest), the supply curve shifts right and the price drops. When demand increases (festival season), the demand curve shifts right and the price rises.

In the code below, you will model supply-demand dynamics for the spice market and simulate how prices change over a trading season. This connects the Chettinad spice trade to modern economic theory and algorithmic trading.

*Supply and demand is the most fundamental model in economics. Every price — from pepper to petroleum to programmer salaries — is ultimately determined by the interaction of supply (how much is available) and demand (how much people want).*`,
      analogy: 'Imagine a fruit stand. If the farmer brings 100 mangoes and only 50 people want them, the price drops (surplus). If 200 people want them, the price rises (shortage). The "equilibrium price" is where the number of mangoes the farmer wants to sell at that price exactly equals the number of people willing to buy at that price.',
      storyConnection: 'Chettinad traders maintained a network of agents who sent price information by courier ship. If an agent in Penang reported that pepper prices had risen 20% (perhaps because a rival shipment was lost), the trader in Karaikal would immediately buy more pepper for the next voyage. This early "information network" was a competitive advantage worth more than the ships themselves.',
      checkQuestion: 'If a Chettinad trader knows that the pepper harvest in Kerala was poor this year (reducing supply by 30%), what should they do?',
      checkAnswer: 'Buy as much pepper as they can afford immediately, before the price rises. Reduced supply with constant demand means higher prices. By buying early at the current (lower) price and selling later at the higher price, the trader profits from the supply shortage. This is the basic arbitrage strategy.',
      codeIntro: 'Simulate spice market dynamics with supply-demand price determination.',
      code: `import numpy as np

np.random.seed(42)

class SpiceMarket:
    def __init__(self, base_supply, base_demand, elasticity=1.5):
        self.base_supply = base_supply  # tons per month
        self.base_demand = base_demand
        self.elasticity = elasticity
        self.price_history = []
        self.supply_history = []
        self.demand_history = []

    def equilibrium_price(self, supply, demand, base_price=100):
        """Price adjusts based on supply/demand ratio."""
        ratio = demand / supply if supply > 0 else 10
        price = base_price * ratio ** (1 / self.elasticity)
        return price

    def simulate_year(self, base_price=100):
        """Simulate 12 months of price fluctuations."""
        for month in range(12):
            # Supply varies: harvest season (Oct-Dec) high, monsoon (Jun-Sep) low
            season_supply = {
                0: 0.8, 1: 0.7, 2: 0.6, 3: 0.7, 4: 0.8, 5: 0.6,
                6: 0.4, 7: 0.3, 8: 0.4, 9: 0.9, 10: 1.2, 11: 1.0,
            }
            supply = self.base_supply * season_supply[month]
            supply *= (1 + np.random.normal(0, 0.15))  # random variation
            supply = max(supply, 10)

            # Demand varies: festival season (Sep-Nov) high
            season_demand = {
                0: 1.0, 1: 0.9, 2: 0.9, 3: 1.0, 4: 1.0, 5: 1.1,
                6: 1.0, 7: 1.0, 8: 1.1, 9: 1.3, 10: 1.4, 11: 1.2,
            }
            demand = self.base_demand * season_demand[month]
            demand *= (1 + np.random.normal(0, 0.10))

            price = self.equilibrium_price(supply, demand, base_price)

            self.price_history.append(price)
            self.supply_history.append(supply)
            self.demand_history.append(demand)

        return self.price_history

# Simulate pepper market
market = SpiceMarket(base_supply=500, base_demand=450)
prices = market.simulate_year(base_price=15)

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

print("=== Black Pepper Price Simulation ($/kg) ===")
print()
header = "Month   Supply(t)  Demand(t)  Price($/kg)  Signal"
print(header)
print("-" * len(header))

for i in range(12):
    s = market.supply_history[i]
    d = market.demand_history[i]
    p = market.price_history[i]
    signal = "BUY" if p < 14 else "SELL" if p > 18 else "HOLD"
    print(f"{months[i]:<6}  {s:>8.0f}    {d:>8.0f}    {p:>9.2f}    {signal}")

print()
avg_p = np.mean(prices)
min_p = min(prices)
max_p = max(prices)
volatility = np.std(prices) / avg_p * 100
print(f"Average price: \{avg_p:.2f}/kg")
print(f"Range: \{min_p:.2f} - \{max_p:.2f}/kg")
print(f"Volatility: {volatility:.1f}%")

# Trading strategy simulation
print()
print("=== Trading Strategy Comparison ===")
budget = 50000
strategies_result = []

# Strategy 1: Buy everything in January
qty_jan = budget / prices[0]
revenue_dec = qty_jan * prices[11]
profit_1 = revenue_dec - budget

# Strategy 2: Buy at lowest price month
min_month = np.argmin(prices)
qty_min = budget / prices[min_month]
revenue_2 = qty_min * prices[11]
profit_2 = revenue_2 - budget

# Strategy 3: Dollar cost average (buy equally each month)
total_qty = sum(budget / 12 / p for p in prices)
revenue_3 = total_qty * prices[11]
profit_3 = revenue_3 - budget

print(f"Budget: \{budget:,}")
print(f"  Buy in Jan ({prices[0]:.2f}/kg):   profit = \{profit_1:,.0f}")
print(f"  Buy at lowest ({months[min_month]}, {prices[min_month]:.2f}/kg): profit = \{profit_2:,.0f}")
print(f"  Dollar-cost average:        profit = \{profit_3:,.0f}")`,
      challenge: 'Add a "market maker" trader who buys when price drops below the 3-month moving average and sells when it rises above. Simulate 5 years and compare this momentum strategy against buy-and-hold. Does timing the market beat the market?',
      successHint: 'You just simulated a commodity market. The same supply-demand models are used in oil trading, agricultural futures, cryptocurrency markets, and electricity pricing. The Chettinad traders were early commodity speculators, using information asymmetry (knowing harvest and market conditions at multiple ports) as their edge.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Graph optimization, risk modelling, and market dynamics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises model network optimization, risk analysis, and market dynamics for the spice trade.
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
