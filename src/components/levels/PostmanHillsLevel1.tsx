import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PostmanHillsLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is a network/graph — the language of connections',
      concept: `The postman delivers mail to villages scattered across the Meghalaya hills. Each village is a point; each path connecting two villages is a link. This structure — points and links — is a **graph**.

In graph theory:
- **Node** (vertex): a point in the network (village, intersection, person)
- **Edge**: a connection between two nodes (path, road, relationship)
- **Weight**: a value assigned to an edge (distance, travel time, cost)
- **Degree**: the number of edges connected to a node

Graphs are everywhere:
- Road networks: intersections are nodes, roads are edges
- Social networks: people are nodes, friendships are edges
- Internet: routers are nodes, cables are edges
- Biology: proteins are nodes, interactions are edges

The postman's delivery network is a **weighted graph** — each edge has a weight representing the walking time or distance between villages. His daily problem: visit every village using the least total travel time.

This is not a made-up problem. India Post employs thousands of rural postmen who solve this problem by experience every day, covering 15-25 km on foot through terrain with no formal addresses.`,
      analogy: 'A graph is like a metro map. The stations are nodes, the lines between them are edges, and the travel time between stations is the weight. You don\'t need to know the exact geography — just the connections and distances. The metro map strips away everything irrelevant (buildings, streets, parks) and shows only what matters for getting from A to B: which stations connect to which, and how far apart they are.',
      storyConnection: 'The postman of the hills doesn\'t think in terms of "graphs" and "nodes." He thinks of Mawsynram, Laitlyngkot, and Nongstoin — real villages connected by real paths through real hills. But his mental map IS a graph: he knows which villages connect, roughly how long each path takes, and which routes are impassable during monsoon. His decades of experience have built an internal graph database more detailed than any map.',
      checkQuestion: 'A village has paths to 5 other villages (degree 5). Another village has paths to only 2 (degree 2). If one path from the first village is destroyed by a landslide, can people still reach it? What about the second village?',
      checkAnswer: 'The first village loses one of 5 connections — it still has 4 other paths, so it remains reachable (unless the destroyed path was the only connection to some other village). The second village is more vulnerable: losing one of 2 paths reduces its connections by 50%. If both paths fail, the village is completely isolated — a real risk during Meghalaya\'s heavy monsoons. This is why network **redundancy** (multiple paths) matters for resilience.',
      codeIntro: 'Build and visualise a delivery network of Meghalaya hill villages.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Create a network of 10 villages in hilly terrain
num_villages = 10
village_names = ['Shillong', 'Mawsynram', 'Cherrapunji', 'Nongstoin',
                 'Jowai', 'Tura', 'Dawki', 'Mawlynnong', 'Laitlyngkot', 'Nongpoh']

# Random positions (x, y) representing geographic locations
positions = {
    'Shillong': (5, 5), 'Mawsynram': (3, 7), 'Cherrapunji': (4, 8),
    'Nongstoin': (1, 5), 'Jowai': (8, 6), 'Tura': (0, 2),
    'Dawki': (9, 8), 'Mawlynnong': (7, 7), 'Laitlyngkot': (3, 3),
    'Nongpoh': (6, 2),
}

# Edges with weights (travel time in hours)
edges = [
    ('Shillong', 'Mawsynram', 2.5), ('Shillong', 'Cherrapunji', 2.0),
    ('Shillong', 'Nongpoh', 1.5), ('Shillong', 'Jowai', 3.0),
    ('Shillong', 'Laitlyngkot', 2.0), ('Mawsynram', 'Cherrapunji', 1.0),
    ('Mawsynram', 'Nongstoin', 2.5), ('Cherrapunji', 'Dawki', 4.0),
    ('Nongstoin', 'Tura', 5.0), ('Nongstoin', 'Laitlyngkot', 2.0),
    ('Jowai', 'Dawki', 2.0), ('Jowai', 'Mawlynnong', 1.5),
    ('Dawki', 'Mawlynnong', 2.0), ('Laitlyngkot', 'Nongpoh', 2.5),
    ('Tura', 'Laitlyngkot', 4.0), ('Nongpoh', 'Jowai', 3.5),
]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Draw the graph
ax1.set_facecolor('#111827')
for v1, v2, weight in edges:
    x1, y1 = positions[v1]
    x2, y2 = positions[v2]
    ax1.plot([x1, x2], [y1, y2], color='#4b5563', linewidth=1.5, alpha=0.6)
    mx, my = (x1+x2)/2, (y1+y2)/2
    ax1.text(mx, my, f'{weight}h', color='#9ca3af', fontsize=7, ha='center',
             bbox=dict(boxstyle='round,pad=0.2', facecolor='#1f2937', edgecolor='none'))

for name, (x, y) in positions.items():
    # Calculate degree
    degree = sum(1 for e in edges if name in (e[0], e[1]))
    size = 100 + degree * 50
    ax1.scatter(x, y, s=size, color='#22c55e', zorder=5, edgecolors='white', linewidth=1)
    ax1.annotate(name, (x, y), textcoords="offset points", xytext=(0, 12),
                 ha='center', color='white', fontsize=8, fontweight='bold')

ax1.set_title('Meghalaya Delivery Network', color='white', fontsize=13)
ax1.set_xlabel('Distance (arbitrary)', color='white')
ax1.set_ylabel('Distance (arbitrary)', color='white')
ax1.tick_params(colors='gray')

# Degree distribution
ax2.set_facecolor('#111827')
degrees = {}
for name in village_names:
    degrees[name] = sum(1 for e in edges if name in (e[0], e[1]))

sorted_villages = sorted(degrees.items(), key=lambda x: x[1], reverse=True)
names_sorted = [v[0] for v in sorted_villages]
deg_sorted = [v[1] for v in sorted_villages]

bars = ax2.barh(names_sorted, deg_sorted, color='#3b82f6', alpha=0.8)
ax2.set_xlabel('Degree (number of connections)', color='white')
ax2.set_title('Village Connectivity', color='white', fontsize=13)
ax2.tick_params(colors='gray')
for bar, d in zip(bars, deg_sorted):
    ax2.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
             str(d), va='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Network statistics:")
print(f"  Villages (nodes): {num_villages}")
print(f"  Paths (edges): {len(edges)}")
total_weight = sum(e[2] for e in edges)
print(f"  Total network distance: {total_weight:.1f} hours")
print(f"  Average degree: {sum(degrees.values())/len(degrees):.1f}")
print(f"  Most connected: {names_sorted[0]} ({deg_sorted[0]} paths)")
print(f"  Least connected: {names_sorted[-1]} ({deg_sorted[-1]} paths)")`,
      challenge: 'Add a new village "Mawkyrwat" connected to Nongstoin (3h) and Tura (2.5h). How does this change the network? Does it create a shortcut between any existing villages?',
      successHint: 'Graph theory is the mathematical backbone of computer science. Networks, social media algorithms, GPS navigation, internet routing, and supply chains all depend on the same simple idea: nodes and edges.',
    },
    {
      title: 'Shortest path problem — finding the best route',
      concept: `The postman starts at Shillong and needs to deliver a package to Dawki. There are multiple routes — which is shortest?

The **shortest path problem** asks: given a weighted graph, what is the minimum-cost path between two nodes?

Possible routes from Shillong to Dawki:
1. Shillong → Cherrapunji → Dawki = 2.0 + 4.0 = **6.0 hours**
2. Shillong → Jowai → Dawki = 3.0 + 2.0 = **5.0 hours**
3. Shillong → Mawsynram → Cherrapunji → Dawki = 2.5 + 1.0 + 4.0 = **7.5 hours**
4. Shillong → Jowai → Mawlynnong → Dawki = 3.0 + 1.5 + 2.0 = **6.5 hours**

Route 2 (via Jowai) is shortest at 5.0 hours. But finding this by listing all routes is impractical for large networks — a network with 20 nodes might have millions of possible paths.

**Dijkstra's algorithm** (Level 2) solves this efficiently, but the intuition is simple:
1. Start at source. Distance to source = 0.
2. Look at all neighbours. Record their distances.
3. Move to the closest unvisited neighbour.
4. Update distances to its neighbours if a shorter path is found.
5. Repeat until you reach the destination.

This **greedy** approach — always expanding the closest unvisited node — is guaranteed to find the shortest path in graphs with non-negative weights.`,
      analogy: 'Finding the shortest path is like water flowing downhill. Water doesn\'t consider all possible routes — it simply flows to the lowest adjacent point at each step. Dijkstra\'s algorithm works similarly: at each step, it expands the nearest unvisited node, gradually "flowing" outward from the source until it reaches the destination. Like water, it naturally finds the path of least resistance.',
      storyConnection: 'The postman doesn\'t run Dijkstra\'s algorithm in his head, but he does something remarkably similar. Over years of experience, he has learned which routes are fastest in dry season, which become impassable in monsoon, and which villages are best visited in which order. His mental model is a graph with time-varying weights — more sophisticated than the static model in textbooks.',
      checkQuestion: 'Google Maps finds the shortest route between any two points on Earth in milliseconds, even though the road network has billions of nodes. How is this possible if the shortest path problem seems hard?',
      checkAnswer: 'Dijkstra\'s algorithm is efficient — O(V log V + E) time — but even that is too slow for billions of nodes in real-time. Google uses pre-computation: the road network is divided into hierarchical levels (local roads → highways → motorways). The algorithm only considers detailed local roads near the start and end, and uses precomputed highway shortcuts for the middle. This is the A* algorithm with contraction hierarchies — a trick that reduces computation from billions of nodes to a few thousand.',
      codeIntro: 'Implement a simple shortest-path finder and visualise the result on the village network.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Rebuild the network
positions = {
    'Shillong': (5, 5), 'Mawsynram': (3, 7), 'Cherrapunji': (4, 8),
    'Nongstoin': (1, 5), 'Jowai': (8, 6), 'Tura': (0, 2),
    'Dawki': (9, 8), 'Mawlynnong': (7, 7), 'Laitlyngkot': (3, 3),
    'Nongpoh': (6, 2),
}

edges = [
    ('Shillong', 'Mawsynram', 2.5), ('Shillong', 'Cherrapunji', 2.0),
    ('Shillong', 'Nongpoh', 1.5), ('Shillong', 'Jowai', 3.0),
    ('Shillong', 'Laitlyngkot', 2.0), ('Mawsynram', 'Cherrapunji', 1.0),
    ('Mawsynram', 'Nongstoin', 2.5), ('Cherrapunji', 'Dawki', 4.0),
    ('Nongstoin', 'Tura', 5.0), ('Nongstoin', 'Laitlyngkot', 2.0),
    ('Jowai', 'Dawki', 2.0), ('Jowai', 'Mawlynnong', 1.5),
    ('Dawki', 'Mawlynnong', 2.0), ('Laitlyngkot', 'Nongpoh', 2.5),
    ('Tura', 'Laitlyngkot', 4.0), ('Nongpoh', 'Jowai', 3.5),
]

# Build adjacency list
graph = {}
for v1, v2, w in edges:
    graph.setdefault(v1, []).append((v2, w))
    graph.setdefault(v2, []).append((v1, w))

# Simple Dijkstra implementation
def dijkstra(graph, start, end):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    previous = {node: None for node in graph}
    unvisited = set(graph.keys())

    while unvisited:
        current = min(unvisited, key=lambda n: distances[n])
        if current == end or distances[current] == float('inf'):
            break
        unvisited.remove(current)
        for neighbor, weight in graph.get(current, []):
            if neighbor in unvisited:
                new_dist = distances[current] + weight
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    previous[neighbor] = current

    # Reconstruct path
    path = []
    node = end
    while node:
        path.append(node)
        node = previous[node]
    path.reverse()
    return path, distances[end]

# Find shortest paths from Shillong to all villages
source = 'Shillong'
results = {}
for dest in positions:
    if dest != source:
        path, dist = dijkstra(graph, source, dest)
        results[dest] = (path, dist)

# Highlight path to Dawki
path_dawki, dist_dawki = results['Dawki']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Network with shortest path highlighted
ax1.set_facecolor('#111827')
for v1, v2, w in edges:
    x1, y1 = positions[v1]
    x2, y2 = positions[v2]
    ax1.plot([x1, x2], [y1, y2], color='#4b5563', linewidth=1.5, alpha=0.4)

# Highlight shortest path
for i in range(len(path_dawki) - 1):
    x1, y1 = positions[path_dawki[i]]
    x2, y2 = positions[path_dawki[i+1]]
    ax1.plot([x1, x2], [y1, y2], color='#22c55e', linewidth=4, zorder=3)
    # Find edge weight
    for e in edges:
        if set([e[0], e[1]]) == set([path_dawki[i], path_dawki[i+1]]):
            mx, my = (x1+x2)/2, (y1+y2)/2
            ax1.text(mx, my+0.3, f'{e[2]}h', color='#22c55e', fontsize=9, fontweight='bold', ha='center')

for name, (x, y) in positions.items():
    color = '#f59e0b' if name in path_dawki else '#6b7280'
    size = 200 if name in path_dawki else 100
    ax1.scatter(x, y, s=size, color=color, zorder=5, edgecolors='white', linewidth=1.5)
    ax1.annotate(name, (x, y), textcoords="offset points", xytext=(0, 12),
                 ha='center', color='white', fontsize=8, fontweight='bold')

ax1.set_title(f'Shortest Path: Shillong → Dawki ({dist_dawki}h)', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Shortest distances from Shillong to all villages
ax2.set_facecolor('#111827')
sorted_results = sorted(results.items(), key=lambda x: x[1][1])
names = [r[0] for r in sorted_results]
dists = [r[1][1] for r in sorted_results]
paths = [' → '.join(r[1][0]) for r in sorted_results]

bars = ax2.barh(range(len(names)), dists, color='#3b82f6', alpha=0.8)
ax2.set_yticks(range(len(names)))
ax2.set_yticklabels(names, color='white')
ax2.set_xlabel('Shortest travel time (hours)', color='white')
ax2.set_title('Shortest Distance from Shillong', color='white', fontsize=13)
ax2.tick_params(colors='gray')

for bar, d in zip(bars, dists):
    ax2.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
             f'{d:.1f}h', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Shortest paths from Shillong:")
for dest, (path, dist) in sorted(results.items(), key=lambda x: x[1][1]):
    print(f"  → {dest}: {dist:.1f}h via {' → '.join(path)}")`,
      challenge: 'Monsoon blocks the Cherrapunji-Dawki path (remove that edge). What is the new shortest path to Dawki? How much longer does it take?',
      successHint: 'The shortest path problem is one of the most practically important problems in computer science. It powers GPS navigation, network routing, game AI pathfinding, and logistics planning — including the daily decisions of postal carriers around the world.',
    },
    {
      title: 'Traveling salesman intro — visiting every village exactly once',
      concept: `The postman\'s real problem is harder than finding the shortest path between two villages. He must visit **every village** and return home, using the shortest possible total route. This is the **Traveling Salesman Problem (TSP)** — one of the most famous problems in mathematics.

For a small number of villages, you could try every possible order:
- 3 villages: 3! / 2 = 3 possible routes (easy)
- 5 villages: 5! / 2 = 60 routes (manageable)
- 10 villages: 10! / 2 = 1,814,400 routes (hard)
- 20 villages: 20! / 2 ≈ 1.2 × 10¹⁸ routes (impossible to check all)

This explosive growth is **factorial complexity**. Even the fastest computer cannot check all routes for 20+ cities. TSP is **NP-hard** — no known algorithm solves it efficiently for all cases.

But good **heuristics** (approximate solutions) exist:
- **Nearest neighbor**: always go to the closest unvisited village. Fast but often 20-30% longer than optimal.
- **2-opt**: start with any route, then swap pairs of edges to reduce total distance. Usually gets within 5% of optimal.
- **Simulated annealing**: randomly modify the route, accept improvements always and worse solutions sometimes (to escape local optima).

The postman uses a heuristic too — his experience-based route is probably near-optimal for his territory.`,
      analogy: 'TSP is like planning a road trip to visit 10 friends in different cities. You want to minimise driving time. With 3 friends, you can easily figure out the best order. With 10, the options are overwhelming. With 50, even a computer would take years to check every possibility. So you use common sense: visit friends that are near each other in groups, then move to the next cluster. That common-sense approach is what heuristic algorithms formalise.',
      storyConnection: 'The postman of the hills has been delivering mail to the same villages for 20 years. His route is a near-perfect solution to the TSP for his territory — honed by thousands of iterations (one per day). When a new village is added to his route, he doesn\'t re-optimise everything; he inserts it at the most logical point in his existing route. This is exactly what the "cheapest insertion" heuristic does.',
      checkQuestion: 'If TSP is NP-hard (no fast exact solution known), how do delivery companies like Amazon manage to plan routes for millions of packages daily?',
      checkAnswer: 'They don\'t solve TSP exactly. They use powerful heuristics, divide-and-conquer (split the city into zones, solve each zone separately), real-time adjustments (re-route as conditions change), and vast computing power to get solutions that are within 1-5% of optimal. For practical purposes, a solution that is 2% longer than perfect but computed in seconds is far more valuable than a perfect solution that takes years to compute.',
      codeIntro: 'Implement the nearest-neighbor heuristic for the postman\'s delivery route and compare it to random routes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Village positions (simplified)
villages = {
    'Shillong': (5, 5), 'Mawsynram': (3, 7), 'Cherrapunji': (4, 8),
    'Nongstoin': (1, 5), 'Jowai': (8, 6), 'Tura': (0, 2),
    'Dawki': (9, 8), 'Mawlynnong': (7, 7), 'Laitlyngkot': (3, 3),
    'Nongpoh': (6, 2),
}

names = list(villages.keys())
coords = np.array(list(villages.values()))

# Distance matrix (Euclidean, scaled to approximate hours)
n = len(names)
dist_matrix = np.zeros((n, n))
for i in range(n):
    for j in range(n):
        dist_matrix[i][j] = np.sqrt((coords[i][0]-coords[j][0])**2 + (coords[i][1]-coords[j][1])**2)

# Nearest Neighbor heuristic
def nearest_neighbor(start_idx, dist_matrix):
    n = len(dist_matrix)
    visited = [start_idx]
    total = 0
    current = start_idx
    for _ in range(n - 1):
        unvisited = [i for i in range(n) if i not in visited]
        nearest = min(unvisited, key=lambda x: dist_matrix[current][x])
        total += dist_matrix[current][nearest]
        visited.append(nearest)
        current = nearest
    total += dist_matrix[current][start_idx]  # return home
    visited.append(start_idx)
    return visited, total

# Random routes for comparison
def random_route(start_idx, dist_matrix):
    n = len(dist_matrix)
    others = [i for i in range(n) if i != start_idx]
    np.random.shuffle(others)
    route = [start_idx] + list(others) + [start_idx]
    total = sum(dist_matrix[route[i]][route[i+1]] for i in range(len(route)-1))
    return route, total

start = names.index('Shillong')
nn_route, nn_dist = nearest_neighbor(start, dist_matrix)

# Generate many random routes
random_dists = []
for _ in range(10000):
    _, d = random_route(start, dist_matrix)
    random_dists.append(d)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Draw NN route
ax1.set_facecolor('#111827')
for i in range(len(nn_route) - 1):
    x1, y1 = coords[nn_route[i]]
    x2, y2 = coords[nn_route[i+1]]
    ax1.annotate('', xy=(x2, y2), xytext=(x1, y1),
                 arrowprops=dict(arrowstyle='->', color='#22c55e', lw=2))
    ax1.text((x1+x2)/2, (y1+y2)/2, str(i+1), color='#22c55e', fontsize=8,
             fontweight='bold', ha='center',
             bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#22c55e', alpha=0.8))

for i, (name, (x, y)) in enumerate(villages.items()):
    color = '#f59e0b' if i == start else '#3b82f6'
    ax1.scatter(x, y, s=200, color=color, zorder=5, edgecolors='white', linewidth=1.5)
    ax1.annotate(name, (x, y), textcoords="offset points", xytext=(0, 14),
                 ha='center', color='white', fontsize=8, fontweight='bold')

ax1.set_title(f'Nearest Neighbor Route: {nn_dist:.1f} units', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Distribution of random routes
ax2.set_facecolor('#111827')
ax2.hist(random_dists, bins=50, color='#3b82f6', alpha=0.7, edgecolor='none')
ax2.axvline(nn_dist, color='#22c55e', linewidth=3, label=f'Nearest Neighbor: {nn_dist:.1f}')
ax2.axvline(min(random_dists), color='#f59e0b', linewidth=2, linestyle='--',
            label=f'Best random: {min(random_dists):.1f}')
ax2.set_xlabel('Total route distance', color='white')
ax2.set_ylabel('Count', color='white')
ax2.set_title('Random Routes vs Nearest Neighbor (10,000 trials)', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Nearest Neighbor route from Shillong:")
nn_names = [names[i] for i in nn_route]
print(f"  Route: {' → '.join(nn_names)}")
print(f"  Total distance: {nn_dist:.1f} units")
print(f"  Random routes (10,000): mean={np.mean(random_dists):.1f}, best={min(random_dists):.1f}")
print(f"  NN is better than {np.sum(np.array(random_dists) > nn_dist)/100:.0f}% of random routes")`,
      challenge: 'Implement 2-opt improvement: after the NN route, try swapping every pair of edges. If a swap reduces total distance, keep it. Run this until no improvement is found. How much shorter does the route get?',
      successHint: 'The traveling salesman problem is not just theoretical — it is solved millions of times daily for package delivery, circuit board manufacturing, telescope scheduling, and even DNA sequencing. Understanding it is the gateway to combinatorial optimisation.',
    },
    {
      title: 'Optimization basics — making the best decision with constraints',
      concept: `The postman doesn't just want the shortest route — he has **constraints**:
- He can only walk 8 hours per day
- Some villages need delivery by noon
- He must carry a bag weighing up to 15 kg
- Certain paths are only passable in dry weather

This is an **optimisation problem with constraints**: find the best solution (minimise travel time) while satisfying all requirements.

**Components of an optimisation problem**:
1. **Objective function**: what you're trying to minimise or maximise (total travel time)
2. **Decision variables**: what you can control (which route to take, which packages to carry)
3. **Constraints**: limitations that must be satisfied (time, weight, weather)
4. **Feasible region**: the set of all solutions that satisfy all constraints

Not all optimisation problems are equally hard:
- **Linear programming**: objective and constraints are all linear equations → solvable efficiently
- **Integer programming**: variables must be whole numbers (yes/no decisions) → much harder
- **Nonlinear programming**: curved objectives/constraints → harder still
- **Combinatorial optimisation** (like TSP): discrete choices → often NP-hard

The postman's daily route planning is a **vehicle routing problem with time windows** — one of the most studied problems in operations research.`,
      analogy: 'Optimisation is like shopping with a budget. You want to maximise satisfaction (objective) by choosing what to buy (decision variables), but you have a limited budget (constraint). The feasible region is all combinations of items you can afford. The optimal solution is the combination that makes you happiest within budget. Adding more constraints (dietary restrictions, store hours) shrinks the feasible region but might exclude the unconstrained best choice.',
      storyConnection: 'Every morning, the postman sorts his mail, estimates which villages need priority delivery, checks the weather (monsoon paths?), weighs his bag, and mentally plans the day\'s route. He is solving a constrained optimisation problem in real time — balancing speed, priority, physical limits, and uncertainty. His solution is rarely mathematically optimal, but it is remarkably good given the constraints on his own computation time (he plans in minutes, not hours).',
      checkQuestion: 'An optimisation problem has a constraint that eliminates the optimal unconstrained solution. Does this mean the constraint is bad?',
      checkAnswer: 'Not necessarily. Constraints represent real-world limits. The "optimal" unconstrained route might require the postman to walk 16 hours — exceeding his physical capacity. The constraint (8 hours max) isn\'t bad; it\'s reality. The constrained optimum is the best achievable solution — better than the unconstrained optimum because it is actually possible. Good optimisation respects constraints; ignoring them leads to plans that fail in practice.',
      codeIntro: 'Visualise how constraints shape the feasible region and find the optimal solution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified postman problem: deliver to N villages in limited time
# Decision: how many hours to spend in each of 2 zones (east, west)
# More time in a zone = more villages served

# Zone A (East): serves up to 5 villages, 1.5 hours per village
# Zone B (West): serves up to 5 villages, 2.0 hours per village
# Total time available: 8 hours
# Goal: maximise villages served

# Objective: maximise V = VA + VB
# Constraints: 1.5*VA <= time_A, 2.0*VB <= time_B, time_A + time_B <= 8
# VA <= 5, VB <= 5

time_A_range = np.linspace(0, 8, 200)
time_B_range = np.linspace(0, 8, 200)
TA, TB = np.meshgrid(time_A_range, time_B_range)

# Villages served
VA = np.minimum(TA / 1.5, 5)
VB = np.minimum(TB / 2.0, 5)
V_total = VA + VB

# Constraint: total time <= 8
feasible = (TA + TB) <= 8

# Apply constraint
V_feasible = np.where(feasible, V_total, np.nan)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Feasible region with objective contours
ax1.set_facecolor('#111827')
contour = ax1.contourf(TA, TB, V_feasible, levels=20, cmap='viridis', alpha=0.7)
plt.colorbar(contour, ax=ax1, label='Villages served')

# Constraint boundary
ax1.plot([0, 8], [8, 0], color='#ef4444', linewidth=3, label='Time limit: 8 hours')
ax1.fill_between([0, 8], [8, 0], 8, alpha=0.15, color='#ef4444')
ax1.axhline(10, color='#f59e0b', linestyle=':', linewidth=1)  # VB max
ax1.axvline(7.5, color='#f59e0b', linestyle=':', linewidth=1)  # VA max

# Optimal point
# VA_max at 5 needs 7.5h, VB_max at 5 needs 10h
# If TA = 7.5, TB = 0.5, VA = 5, VB = 0.25 → total = 5.25
# If TA = 0, TB = 8, VA = 0, VB = 4 → total = 4
# Optimal: TA ≈ 5.14, TB ≈ 2.86 → VA ≈ 3.43, VB ≈ 1.43 → total ≈ 4.86
# Actually need to maximise: try TA=7.5, TB=0.5: VA=5, VB=0.25, total=5.25
opt_TA, opt_TB = 7.5, 0.5
opt_VA, opt_VB = min(opt_TA/1.5, 5), min(opt_TB/2.0, 5)
opt_V = opt_VA + opt_VB

# Better: try to balance
# At boundary TA + TB = 8: V = min(TA/1.5, 5) + min((8-TA)/2, 5)
ta_vals = np.linspace(0, 8, 1000)
v_vals = np.minimum(ta_vals/1.5, 5) + np.minimum((8-ta_vals)/2, 5)
best_idx = np.argmax(v_vals)
best_TA = ta_vals[best_idx]
best_TB = 8 - best_TA
best_V = v_vals[best_idx]

ax1.plot(best_TA, best_TB, '*', color='#f59e0b', markersize=20, zorder=5)
ax1.annotate(f'Optimal\
({best_V:.1f} villages)', xy=(best_TA, best_TB),
             xytext=(best_TA - 2, best_TB + 1.5), color='#f59e0b', fontsize=11, fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax1.set_xlabel('Time in Zone A (hours)', color='white')
ax1.set_ylabel('Time in Zone B (hours)', color='white')
ax1.set_title('Constrained Optimisation', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_xlim(0, 10)
ax1.set_ylim(0, 10)

# Objective along the constraint boundary
ax2.set_facecolor('#111827')
ax2.plot(ta_vals, v_vals, color='#22c55e', linewidth=2)
ax2.fill_between(ta_vals, v_vals, alpha=0.1, color='#22c55e')
ax2.plot(best_TA, best_V, '*', color='#f59e0b', markersize=15)
ax2.annotate(f'Optimal: {best_V:.1f} villages\
(TA={best_TA:.1f}h, TB={best_TB:.1f}h)',
             xy=(best_TA, best_V), xytext=(best_TA - 3, best_V - 1),
             color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.set_xlabel('Time allocated to Zone A (hours)', color='white')
ax2.set_ylabel('Total villages served', color='white')
ax2.set_title('Villages Served Along Time Boundary', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Optimal allocation:")
print(f"  Zone A: {best_TA:.1f} hours → {min(best_TA/1.5, 5):.1f} villages")
print(f"  Zone B: {best_TB:.1f} hours → {min(best_TB/2, 5):.1f} villages")
print(f"  Total: {best_V:.1f} villages in 8 hours")
print()
print("Without time constraint: 5 + 5 = 10 villages (17.5 hours)")
print(f"With 8-hour constraint: {best_V:.1f} villages (optimised)")
print("The constraint forces trade-offs — the postman cannot visit everyone.")`,
      challenge: 'Add a priority constraint: Zone B contains the post office and must receive at least 2 hours of the postman\'s time. How does this change the optimal allocation?',
      successHint: 'Optimisation under constraints is how the real world works. Engineers, economists, logistics planners, and even doctors make decisions by maximising outcomes within resource limits. The mathematics of optimisation makes these decisions rigorous.',
    },
    {
      title: 'Real logistics challenges — when theory meets mud',
      concept: `Textbook optimisation assumes clean data and fixed conditions. Real logistics in Meghalaya's hills faces challenges that no algorithm perfectly handles:

**Uncertain conditions**:
- Roads wash out during monsoon (June-September: 2,000+ mm of rain)
- Bridges collapse with zero warning
- Landslides block paths for days or weeks
- River crossings become impassable when water rises

**Imperfect information**:
- No GPS signal in deep valleys
- No mobile connectivity in remote areas
- No real-time traffic data
- Addresses are descriptive ("the house behind the church near the big rock"), not numerical

**Human factors**:
- The postman is a person, not a robot — fatigue, health, morale matter
- Villagers expect the postman at certain times (informal schedule)
- Social interactions are part of the job (news, messages, check on elderly)
- The postman often carries unofficial items (medicines, newspapers, small goods)

**Scale asymmetry**: India Post serves 155,000 post offices — more than any postal system on Earth. 90% are in rural areas. The "last mile" in Meghalaya might be 15 km of footpath with 500 m elevation gain.

These challenges are not bugs in the optimisation — they ARE the optimisation. Any real solution must account for uncertainty, information gaps, and human needs.`,
      analogy: 'Textbook logistics is like playing chess on a perfect board. Real logistics is like playing chess where some squares are invisible, the board tilts randomly, and your pieces get tired. The best chess player (algorithm) in the world would struggle if the board kept changing. Real logistics requires not just optimisation but **robustness** — solutions that work well even when conditions are worse than expected.',
      storyConnection: 'The postman of the hills IS the solution to these challenges. He embodies local knowledge, adaptive routing, community relationships, and physical resilience that no algorithm can replicate. When a landslide blocks his usual path, he doesn\'t crash like a GPS app — he takes the goat trail he learned about 15 years ago. When there\'s no mobile signal, he doesn\'t lose his route — it\'s in his head. Technology should augment him, not replace him.',
      checkQuestion: 'A tech company proposes replacing India\'s rural postmen with delivery drones. Why might this fail in Meghalaya?',
      checkAnswer: 'Multiple reasons: (1) Weather — Meghalaya receives 2,000-12,000 mm of rain annually; drones cannot fly in heavy rain or strong winds. (2) Terrain — dense forest canopy prevents landing in many villages. (3) Power — no electricity in many areas to charge drones. (4) Navigation — GPS accuracy degrades in deep valleys. (5) Payload — drones carry 1-2 kg; the postman carries 10-15 kg. (6) Social role — the postman is a lifeline for elderly villagers who see no one else for days. Technology that ignores context fails. The better approach: give the postman a GPS tracker, a satellite phone, and better paths.',
      codeIntro: 'Simulate how uncertain conditions (monsoon) affect delivery performance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 365 days of delivery performance
days = np.arange(365)
months = (days // 30).astype(int)

# Monsoon intensity (peaks June-September = months 5-8)
monsoon_intensity = np.zeros(365)
for d in range(365):
    m = d / 30
    monsoon_intensity[d] = 0.8 * np.exp(-((m - 7)**2) / 3) + np.random.uniform(0, 0.2)

# Path availability (decreases during monsoon)
num_paths = 16  # total paths in network
paths_open = np.zeros(365)
for d in range(365):
    close_prob = monsoon_intensity[d] * 0.4
    paths_open[d] = num_paths - np.random.binomial(num_paths, close_prob)

# Villages reachable (depends on paths open)
villages_reachable = np.zeros(365)
for d in range(365):
    # With fewer paths, some villages become disconnected
    ratio = paths_open[d] / num_paths
    villages_reachable[d] = round(10 * min(1, ratio * 1.2))  # some redundancy

# Delivery success rate
planned_deliveries = np.random.poisson(15, 365)  # avg 15 letters/day
actual_deliveries = np.minimum(planned_deliveries,
                                (villages_reachable / 10 * planned_deliveries).astype(int))
success_rate = np.where(planned_deliveries > 0, actual_deliveries / planned_deliveries * 100, 100)

fig, axes = plt.subplots(4, 1, figsize=(12, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Year in the Life of a Meghalaya Postman', color='white', fontsize=14)

# Monsoon intensity
axes[0].set_facecolor('#111827')
axes[0].fill_between(days, monsoon_intensity, alpha=0.4, color='#3b82f6')
axes[0].plot(days, monsoon_intensity, color='#3b82f6', linewidth=1)
axes[0].set_ylabel('Rain intensity', color='white')
axes[0].set_title('Monsoon Pattern', color='white', fontsize=10)
axes[0].tick_params(colors='gray')

# Paths open
axes[1].set_facecolor('#111827')
axes[1].fill_between(days, paths_open, alpha=0.4, color='#f59e0b')
axes[1].plot(days, paths_open, color='#f59e0b', linewidth=1)
axes[1].axhline(num_paths, color='gray', linestyle=':', linewidth=1)
axes[1].set_ylabel('Paths open', color='white')
axes[1].set_title(f'Network Availability (of {num_paths} paths)', color='white', fontsize=10)
axes[1].tick_params(colors='gray')

# Delivery performance
axes[2].set_facecolor('#111827')
axes[2].bar(days, planned_deliveries, color='#6b7280', alpha=0.4, width=1, label='Planned')
axes[2].bar(days, actual_deliveries, color='#22c55e', alpha=0.7, width=1, label='Delivered')
axes[2].set_ylabel('Deliveries', color='white')
axes[2].set_title('Daily Deliveries', color='white', fontsize=10)
axes[2].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
axes[2].tick_params(colors='gray')

# Success rate (7-day rolling average)
axes[3].set_facecolor('#111827')
rolling = np.convolve(success_rate, np.ones(7)/7, mode='same')
axes[3].plot(days, rolling, color='#22c55e', linewidth=2)
axes[3].fill_between(days, rolling, alpha=0.15, color='#22c55e')
axes[3].axhline(90, color='#f59e0b', linestyle='--', linewidth=1, label='90% target')
axes[3].set_xlabel('Day of year', color='white')
axes[3].set_ylabel('Success rate (%)', color='white')
axes[3].set_title('7-Day Rolling Success Rate', color='white', fontsize=10)
axes[3].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[3].tick_params(colors='gray')

# Month labels
month_names = ['J','F','M','A','M','J','J','A','S','O','N','D']
axes[3].set_xticks([i*30+15 for i in range(12)])
axes[3].set_xticklabels(month_names, color='white')

plt.tight_layout()
plt.show()

annual_planned = np.sum(planned_deliveries)
annual_delivered = np.sum(actual_deliveries)
annual_rate = annual_delivered / annual_planned * 100

# Monthly breakdown
print(f"Annual performance:")
print(f"  Planned deliveries: {annual_planned}")
print(f"  Actual deliveries: {annual_delivered}")
print(f"  Annual success rate: {annual_rate:.1f}%")
print(f"  Deliveries lost to monsoon: {annual_planned - annual_delivered}")
print()
for m, name in enumerate(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']):
    mask = months == m
    if np.sum(mask) > 0:
        mr = np.mean(success_rate[mask])
        print(f"  {name}: {mr:.0f}% success rate")`,
      challenge: 'Add a "satellite phone" intervention: the postman receives daily alerts about path closures, allowing him to re-route. Simulate that this improves success rate by 15% during monsoon months. What is the new annual performance?',
      successHint: 'Real-world logistics teaches humility. The best algorithm is worthless if it doesn\'t account for rain, mud, fatigue, and human relationships. The postman of the hills is a daily reminder that local knowledge and adaptability often outperform theoretical optimality.',
    },
    {
      title: 'Last-mile delivery — the hardest kilometre in logistics',
      concept: `In logistics, the **last mile** is the final leg of delivery — from a distribution hub to the recipient's door. It is consistently the most expensive and difficult segment:

- The last mile accounts for **53% of total shipping cost** globally
- Urban last-mile: traffic, parking, high-rise access, narrow streets
- Rural last-mile: distance, terrain, no addresses, no roads

In Meghalaya, the "last mile" is often the last 15 kilometres — on foot, through hills, with no road access. India Post's Branch Post Offices (BOs) are the last-mile hubs:
- A Head Post Office in Shillong receives mail from across India
- Sub Post Offices in district towns sort and forward
- Branch Post Offices in villages are the final pickup points
- For remote villages without a BO, the postman walks to the door

**Last-mile innovations**:
- **Drone delivery**: tested in remote Himalayan areas by India Post (2023)
- **Microhubs**: small storage points in villages to reduce trips
- **Mobile post offices**: vans that visit remote areas on rotating schedules
- **Digital post**: some communications shift from physical to digital, reducing load
- **Community delivery**: train local residents to handle last-mile delivery

The cost equation: adding $1 to first-mile infrastructure (better roads) often saves $5 in last-mile delivery costs.`,
      analogy: 'The last mile is like the final 100 metres of a marathon. You have run 42 km relatively smoothly (air freight, rail, trucks). Then the last 100 metres is uphill, through a maze, in the rain, and you have to find one specific door among thousands. All the efficiency of the first 42 km is undone by the chaos of the last stretch. This is why Amazon, Flipkart, and India Post spend more on the last mile than on the entire preceding journey.',
      storyConnection: 'The postman IS last-mile delivery. He is the human bridge between the national postal network and individual humans in remote hills. His journey from the Branch Post Office to a farmhouse on a ridgetop — 5 km of footpath, 300 m elevation gain, carrying 10 kg of mail — is the most expensive delivery in the chain per kilometre. And it is the most valuable, because without it, those recipients have no connection to the outside world.',
      checkQuestion: 'Why haven\'t online retailers solved the last-mile problem despite billions of dollars of investment?',
      checkAnswer: 'Because the problem is fundamentally about physics and geometry, not money. Each delivery is unique (different address, different time window, different package size). The delivery person must travel from one unique location to another, and no technology eliminates the physical distance. Self-driving vehicles, drones, and robots help, but they still must cover the distance. The only solutions that dramatically reduce cost are consolidation (deliver many packages per trip), density (more customers per square kilometre), and pickup points (customers come to the package). None of these works well in rural Meghalaya.',
      codeIntro: 'Model last-mile delivery costs and compare strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Model: 50 delivery points scattered across hilly terrain
num_points = 50
# Points clustered around 5 villages
village_centres = [(2, 2), (4, 8), (8, 5), (1, 6), (7, 2)]
points_x = []
points_y = []
for cx, cy in village_centres:
    n = 10
    points_x.extend(cx + np.random.randn(n) * 0.8)
    points_y.extend(cy + np.random.randn(n) * 0.8)
points_x = np.array(points_x)
points_y = np.array(points_y)

# Hub location
hub = (5, 5)

# Strategy 1: Direct delivery from hub to each point (star network)
direct_distances = np.sqrt((points_x - hub[0])**2 + (points_y - hub[1])**2)
direct_total = 2 * np.sum(direct_distances)  # there and back

# Strategy 2: Route through clusters (postman's approach)
# Visit each cluster, then deliver within cluster
cluster_order = [0, 3, 1, 2, 4]  # rough NN order
route_total = 0
prev = hub
for ci in cluster_order:
    cx, cy = village_centres[ci]
    # Travel to cluster
    route_total += np.sqrt((cx - prev[0])**2 + (cy - prev[1])**2)
    # Deliver within cluster
    cluster_mask = np.arange(ci*10, (ci+1)*10)
    for idx in cluster_mask:
        route_total += np.sqrt((points_x[idx] - cx)**2 + (points_y[idx] - cy)**2) * 2
    prev = (cx, cy)
route_total += np.sqrt((prev[0] - hub[0])**2 + (prev[1] - hub[1])**2)  # return

# Strategy 3: Microhubs (small storage in each village)
# Only need to deliver from hub to microhubs once, then short local deliveries
microhub_delivery = 0
for ci in cluster_order:
    cx, cy = village_centres[ci]
    microhub_delivery += np.sqrt((cx - hub[0])**2 + (cy - hub[1])**2)
    cluster_mask = np.arange(ci*10, (ci+1)*10)
    for idx in cluster_mask:
        microhub_delivery += np.sqrt((points_x[idx] - cx)**2 + (points_y[idx] - cy)**2)
microhub_delivery += np.sqrt((village_centres[cluster_order[-1]][0] - hub[0])**2 +
                              (village_centres[cluster_order[-1]][1] - hub[1])**2)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Map of delivery area
ax1.set_facecolor('#111827')
ax1.scatter(points_x, points_y, s=30, color='#3b82f6', alpha=0.7, label='Delivery points')

for i, (cx, cy) in enumerate(village_centres):
    ax1.scatter(cx, cy, s=150, color='#f59e0b', marker='s', zorder=5, edgecolors='white')
    ax1.annotate(f'Village {i+1}', (cx, cy), textcoords="offset points", xytext=(10, 5),
                 color='#f59e0b', fontsize=8)

ax1.scatter(*hub, s=300, color='#ef4444', marker='*', zorder=5, edgecolors='white', linewidth=1.5)
ax1.annotate('HUB', hub, textcoords="offset points", xytext=(10, 10),
             color='#ef4444', fontsize=10, fontweight='bold')

# Draw cluster route
prev = hub
for ci in cluster_order:
    cx, cy = village_centres[ci]
    ax1.plot([prev[0], cx], [prev[1], cy], color='#22c55e', linewidth=2, alpha=0.7)
    prev = (cx, cy)
ax1.plot([prev[0], hub[0]], [prev[1], hub[1]], color='#22c55e', linewidth=2, alpha=0.7)

ax1.set_title('Delivery Network — 50 Points in 5 Clusters', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Cost comparison
ax2.set_facecolor('#111827')
strategies = ['Direct\
(star)', 'Clustered\
(postman)', 'Microhubs']
costs = [direct_total, route_total, microhub_delivery]
cost_per_delivery = [c / num_points for c in costs]

bars = ax2.bar(strategies, cost_per_delivery, color=['#ef4444', '#f59e0b', '#22c55e'], alpha=0.8, width=0.5)
ax2.set_ylabel('Cost per delivery (distance units)', color='white')
ax2.set_title('Last-Mile Strategy Comparison', color='white', fontsize=13)
ax2.tick_params(colors='gray')

for bar, cost, total in zip(bars, cost_per_delivery, costs):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
             f'{cost:.2f}/delivery\
({total:.0f} total)', ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Last-mile delivery strategy comparison (50 deliveries):")
for strat, cost in zip(strategies, costs):
    print(f"  {strat.replace(chr(10),' ')}: {cost:.0f} total distance, {cost/num_points:.2f} per delivery")
print()
savings_1 = (1 - route_total/direct_total) * 100
savings_2 = (1 - microhub_delivery/direct_total) * 100
print(f"Clustered route saves {savings_1:.0f}% vs direct delivery")
print(f"Microhubs save {savings_2:.0f}% vs direct delivery")
print()
print("Real-world last-mile costs:")
print("  Urban India: ₹50-80 per delivery")
print("  Rural plains: ₹100-200 per delivery")
print("  Meghalaya hills: ₹300-500+ per delivery (estimated)")
print("  This is why rural postal service requires government subsidy.")`,
      challenge: 'Add a "pickup point" strategy: instead of delivering to each house, deliver only to the 5 village centres and let recipients collect their mail. Calculate the total distance. What is the trade-off?',
      successHint: 'From graphs to shortest paths to TSP to optimisation to real logistics to last-mile delivery — you have traced the complete chain from abstract mathematics to the postman\'s daily reality. Level 2 takes you into the algorithms (Dijkstra, graph data structures, vehicle routing) that power modern logistics systems.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Logistics & Optimization</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for logistics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}
