import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PostmanHillsLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Dijkstra\'s algorithm — step-by-step shortest paths',
      concept: `Dijkstra's algorithm (1956, Edsger Dijkstra) finds the shortest path from a source node to every other node in a weighted graph with non-negative weights. It is one of the most important algorithms in computer science.

**The algorithm**:
1. Set distance to source = 0, all others = infinity
2. Mark all nodes as unvisited
3. Select the unvisited node with the smallest distance (current node)
4. For each unvisited neighbour of current: if distance through current is shorter, update
5. Mark current as visited
6. Repeat from step 3 until destination is visited (or all nodes are visited)

**Why it works**: by always processing the closest unvisited node first, we guarantee that when we visit a node, we have already found its shortest path. This is because all edge weights are non-negative — no future path through an unvisited node can be shorter than the current shortest known path.

**Time complexity**: O(V² ) with a simple array, O((V + E) log V) with a priority queue (binary heap). For sparse graphs (few edges per node, like road networks), the heap version is much faster.

**Limitation**: doesn't work with negative edge weights. For that, you need Bellman-Ford (slower but handles negatives).`,
      analogy: 'Dijkstra\'s algorithm is like a spreading wave. Drop a stone (source) in a pond. The wave expands outward at constant speed. The first time the wave reaches a point, that is the shortest possible time — because the wave expands uniformly. Dijkstra\'s "wave" expands through the graph, always reaching the nearest unvisited node first. Negative weights would be like parts of the pond where water flows backward — the wave analogy breaks.',
      storyConnection: 'When the postman needs to reach a specific village urgently (emergency medicine delivery), he mentally runs something like Dijkstra\'s algorithm: starting from his current location, he considers each adjacent village\'s travel time, picks the closest, then repeats from there. His decades of experience have pre-computed most of these shortest paths — making him a living Dijkstra engine.',
      checkQuestion: 'Dijkstra\'s algorithm visits nodes in order of distance from the source. If you only need the path to ONE destination, do you need to visit all nodes?',
      checkAnswer: 'No. You can stop as soon as the destination node is visited (marked as permanent). At that point, its shortest distance is confirmed. This is the "early termination" optimisation. For a single source-destination query, this can be much faster than computing all-pairs shortest paths. GPS navigation uses this — it only needs one route, not distances to everywhere.',
      codeIntro: 'Implement Dijkstra\'s algorithm step by step and visualise its progress.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Network
positions = {
    'A': (0, 3), 'B': (2, 5), 'C': (2, 1), 'D': (4, 4),
    'E': (4, 2), 'F': (6, 5), 'G': (6, 1), 'H': (8, 3),
}
edges = [
    ('A', 'B', 4), ('A', 'C', 2), ('B', 'D', 3), ('B', 'F', 6),
    ('C', 'E', 5), ('C', 'D', 1), ('D', 'F', 2), ('D', 'E', 3),
    ('E', 'G', 4), ('F', 'H', 3), ('G', 'H', 2), ('E', 'H', 6),
]

# Build adjacency list
graph = {}
for v1, v2, w in edges:
    graph.setdefault(v1, []).append((v2, w))
    graph.setdefault(v2, []).append((v1, w))

# Dijkstra with step recording
def dijkstra_traced(graph, source):
    dist = {n: float('inf') for n in graph}
    prev = {n: None for n in graph}
    dist[source] = 0
    unvisited = set(graph.keys())
    steps = []

    while unvisited:
        current = min(unvisited, key=lambda n: dist[n])
        if dist[current] == float('inf'):
            break
        unvisited.remove(current)

        updates = []
        for neighbor, weight in graph.get(current, []):
            if neighbor in unvisited:
                new_dist = dist[current] + weight
                if new_dist < dist[neighbor]:
                    dist[neighbor] = new_dist
                    prev[neighbor] = current
                    updates.append((neighbor, new_dist))

        steps.append({
            'node': current,
            'dist': dist[current],
            'updates': updates,
            'distances': dict(dist),
        })

    return dist, prev, steps

dist, prev, steps = dijkstra_traced(graph, 'A')

# Reconstruct path to H
path = []
node = 'H'
while node:
    path.append(node)
    node = prev[node]
path.reverse()

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Step-by-step progression (show 4 steps)
show_steps = [0, 2, 4, len(steps)-1]
for ax, step_idx in zip(axes.flat, show_steps):
    ax.set_facecolor('#111827')
    step = steps[min(step_idx, len(steps)-1)]
    visited = [s['node'] for s in steps[:step_idx+1]]

    # Draw edges
    for v1, v2, w in edges:
        x1, y1 = positions[v1]
        x2, y2 = positions[v2]
        ax.plot([x1, x2], [y1, y2], color='#4b5563', linewidth=1.5, alpha=0.4)
        mx, my = (x1+x2)/2, (y1+y2)/2
        ax.text(mx, my, str(w), color='gray', fontsize=7, ha='center')

    # Highlight visited path edges
    for s in steps[:step_idx+1]:
        n = s['node']
        if prev[n]:
            x1, y1 = positions[prev[n]]
            x2, y2 = positions[n]
            ax.plot([x1, x2], [y1, y2], color='#22c55e', linewidth=3, zorder=3)

    # Draw nodes
    for name, (x, y) in positions.items():
        d = step['distances'].get(name, float('inf'))
        if name in visited:
            color = '#22c55e'
        elif d < float('inf'):
            color = '#f59e0b'
        else:
            color = '#6b7280'

        ax.scatter(x, y, s=250, color=color, zorder=5, edgecolors='white', linewidth=1.5)
        d_str = f'{d:.0f}' if d < float('inf') else '?'
        ax.annotate(f'{name}\n{d_str}', (x, y), ha='center', va='center', color='white',
                    fontsize=8, fontweight='bold')

    ax.set_title(f'Step {step_idx+1}: Visit {step["node"]} (dist={step["dist"]:.0f})',
                 color='white', fontsize=11)
    ax.tick_params(colors='gray')
    ax.set_xlim(-1, 9)
    ax.set_ylim(-0.5, 6.5)

plt.tight_layout()
plt.show()

print("Dijkstra's algorithm trace from A:")
for i, step in enumerate(steps):
    updates = ', '.join([f'{n}={d:.0f}' for n, d in step['updates']]) if step['updates'] else 'none'
    print(f"  Step {i+1}: Visit {step['node']} (dist={step['dist']:.0f}), updated: {updates}")
print()
print(f"Shortest path A → H: {' → '.join(path)}, distance = {dist['H']:.0f}")
print()
print("All shortest distances from A:")
for node in sorted(dist.keys()):
    print(f"  A → {node}: {dist[node]:.0f}")`,
      challenge: 'Add a new edge E-F with weight 1. How does this change the shortest path from A to H? Run Dijkstra again and compare.',
      successHint: 'Dijkstra\'s algorithm runs millions of times per second across the internet — every GPS query, every network packet routing decision, every game AI pathfinding call. Understanding it deeply is a gateway to serious computer science.',
    },
    {
      title: 'Graph data structures — how computers store networks',
      concept: `A graph drawn on paper is intuitive. But how does a computer store and process a graph? Three main representations:

**1. Adjacency Matrix**: A V×V grid where entry [i][j] = weight of edge from i to j (0 or infinity if no edge).
- Pros: O(1) lookup for any edge, simple to implement
- Cons: wastes memory for sparse graphs (V² space even if few edges)
- Best for: dense graphs (many edges relative to nodes)

**2. Adjacency List**: Each node stores a list of its neighbours and edge weights.
- Pros: memory-efficient for sparse graphs, fast iteration over neighbours
- Cons: O(degree) lookup for a specific edge
- Best for: sparse graphs (most real networks — road maps, social networks)

**3. Edge List**: Simply a list of all edges (source, target, weight).
- Pros: simple, compact, easy to sort
- Cons: slow lookup, slow neighbour iteration
- Best for: input/output, algorithms that process all edges (Kruskal's MST)

The Meghalaya road network has ~10,000 intersections and ~15,000 road segments. Adjacency matrix would need 100 million entries (mostly zeros). Adjacency list needs only ~30,000 entries (two per edge). For real networks, adjacency lists win overwhelmingly.

**Python dictionaries** are natural adjacency lists: \`graph = {node: [(neighbor, weight), ...]}\``,
      analogy: 'An adjacency matrix is like a full spreadsheet where every row and column is a village, and each cell records the distance between them. Most cells are empty (no direct road). An adjacency list is like each village keeping its own address book of neighbours only — much more compact. An edge list is like a pile of road signs, each saying "Village A to Village B: 5 km." All three describe the same network, but different tasks are faster with different representations.',
      storyConnection: 'The postman\'s mental map of Meghalaya is stored as an adjacency list. He doesn\'t think about the distance from Shillong to Tura (not adjacent). He thinks about which villages connect directly to the one he\'s in, and how long each connection takes. His brain naturally uses the most efficient representation for navigation.',
      checkQuestion: 'Social networks like Facebook have 3 billion users. If stored as an adjacency matrix, how much memory would that require?',
      checkAnswer: 'An adjacency matrix for 3 billion nodes would have 3 billion × 3 billion = 9 × 10¹⁸ entries. Even at 1 bit per entry, that is about 1.1 exabytes (1.1 million terabytes). Facebook\'s entire data infrastructure is about 1 exabyte. So the matrix alone would exceed their total storage. In reality, the average user has ~300 friends — an adjacency list needs only 3 billion × 300 = 900 billion entries, roughly 1,000× less memory.',
      codeIntro: 'Implement all three graph representations and compare their performance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Build a sample graph
edges = [
    ('A', 'B', 4), ('A', 'C', 2), ('B', 'D', 3), ('B', 'F', 6),
    ('C', 'E', 5), ('C', 'D', 1), ('D', 'F', 2), ('D', 'E', 3),
    ('E', 'G', 4), ('F', 'H', 3), ('G', 'H', 2), ('E', 'H', 6),
]
nodes = sorted(set(n for e in edges for n in (e[0], e[1])))
n = len(nodes)
node_idx = {name: i for i, name in enumerate(nodes)}

# Representation 1: Adjacency Matrix
adj_matrix = np.full((n, n), np.inf)
for i in range(n):
    adj_matrix[i][i] = 0
for v1, v2, w in edges:
    i, j = node_idx[v1], node_idx[v2]
    adj_matrix[i][j] = w
    adj_matrix[j][i] = w

# Representation 2: Adjacency List
adj_list = {node: [] for node in nodes}
for v1, v2, w in edges:
    adj_list[v1].append((v2, w))
    adj_list[v2].append((v1, w))

# Representation 3: Edge List (already have it)
edge_list = edges

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Visualise adjacency matrix as heatmap
ax1.set_facecolor('#111827')
display_matrix = adj_matrix.copy()
display_matrix[display_matrix == np.inf] = 0
im = ax1.imshow(display_matrix, cmap='YlGn', interpolation='nearest')
ax1.set_xticks(range(n))
ax1.set_yticks(range(n))
ax1.set_xticklabels(nodes, color='white')
ax1.set_yticklabels(nodes, color='white')
ax1.set_title('Adjacency Matrix', color='white', fontsize=13)
# Add text annotations
for i in range(n):
    for j in range(n):
        val = adj_matrix[i][j]
        text = str(int(val)) if val < np.inf and val > 0 else ''
        ax1.text(j, i, text, ha='center', va='center', color='white', fontsize=10)

# Memory comparison
ax2.set_facecolor('#111827')

# Scale analysis: vary number of nodes, fixed avg degree of 3
node_counts = np.arange(10, 10001, 100)
avg_degree = 3

matrix_memory = node_counts ** 2 * 4  # 4 bytes per float entry
list_memory = node_counts * avg_degree * 8  # 8 bytes per (neighbor, weight) pair
edge_memory = node_counts * avg_degree / 2 * 12  # 12 bytes per (src, dst, weight)

ax2.semilogy(node_counts, matrix_memory / 1024, color='#ef4444', linewidth=2, label='Adjacency Matrix')
ax2.semilogy(node_counts, list_memory / 1024, color='#22c55e', linewidth=2, label='Adjacency List')
ax2.semilogy(node_counts, edge_memory / 1024, color='#3b82f6', linewidth=2, label='Edge List')

ax2.set_xlabel('Number of nodes', color='white')
ax2.set_ylabel('Memory (KB, log scale)', color='white')
ax2.set_title('Memory Usage: Sparse Graph (avg degree 3)', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Mark the Meghalaya road network scale
ax2.axvline(10000, color='#f59e0b', linestyle='--', linewidth=1)
ax2.annotate('Meghalaya\\nroad network\\n(~10K nodes)', xy=(10000, 100),
             color='#f59e0b', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.show()

print("Graph representations for our 8-node network:")
print()
print("Adjacency Matrix (8×8 = 64 entries):")
print(f"  Memory: {n*n*4} bytes")
print(f"  Non-zero entries: {np.sum((adj_matrix > 0) & (adj_matrix < np.inf))}")
print(f"  Wasted entries: {np.sum(adj_matrix == np.inf)}")
print()
print("Adjacency List:")
total_entries = sum(len(v) for v in adj_list.values())
print(f"  Total entries: {total_entries}")
print(f"  Memory: ~{total_entries * 8} bytes")
for node in sorted(adj_list.keys()):
    neighbors = ', '.join([f'{n}({w})' for n, w in adj_list[node]])
    print(f"  {node}: [{neighbors}]")
print()
print(f"At 10,000 nodes (Meghalaya scale):")
print(f"  Matrix: {10000**2 * 4 / 1024 / 1024:.0f} MB")
print(f"  List: {10000 * 3 * 8 / 1024:.0f} KB")
print(f"  Ratio: {10000**2 * 4 / (10000 * 3 * 8):.0f}x more memory for matrix")`,
      challenge: 'Implement a function that takes an adjacency list and returns the adjacency matrix. Then implement the reverse. These conversions are fundamental operations in graph processing.',
      successHint: 'Choosing the right data structure is as important as choosing the right algorithm. A brilliant algorithm on the wrong data structure is slow; a simple algorithm on the right data structure can be fast. For graphs, this choice determines whether your program handles 100 nodes or 100 million.',
    },
    {
      title: 'Network flow — how much can the network carry?',
      concept: `Shortest path asks: what is the fastest route? **Network flow** asks a different question: how much "stuff" can the network carry simultaneously?

Imagine the postman's paths as pipes with limited capacity:
- A wide paved road: capacity 100 packages/day
- A narrow footpath: capacity 10 packages/day
- A rope bridge: capacity 5 packages/day

**Maximum flow** asks: what is the maximum rate at which packages can flow from the source (Shillong) to the sink (Dawki), respecting capacity limits?

The **Ford-Fulkerson** method:
1. Find any path from source to sink with available capacity
2. Push as much flow as possible along that path (limited by the narrowest edge)
3. Update remaining capacities
4. Repeat until no more augmenting paths exist

The **max-flow min-cut theorem**: the maximum flow equals the minimum cut — the smallest total capacity of edges that, if removed, would disconnect source from sink. This is profound: the network's weakest link determines its total capacity.

Real applications:
- Internet bandwidth (data flow through network links)
- Transportation networks (vehicles through road intersections)
- Supply chains (goods from factories to stores)
- Water distribution (water through pipe networks)`,
      analogy: 'Network flow is like water through a pipe system. The maximum flow from the reservoir (source) to the tap (sink) is determined by the narrowest pipe anywhere in the system. A 100 mm pipe feeding a 10 mm pipe delivers at most 10 mm of flow. The max-flow min-cut theorem says: find the cheapest set of pipes to cut that would stop all flow — the total capacity of those pipes equals the maximum flow. The weakest point defines the system.',
      storyConnection: 'During monsoon, the Meghalaya mail system faces a flow problem. Shillong receives 10,000 letters per day. The paths to remote villages have limited capacity (a single postman can carry ~200 letters per day on foot). The maximum flow of mail through the network determines how much reaches the villages and how much backs up in Shillong. When paths flood and capacity drops, mail accumulates — a physical bottleneck.',
      checkQuestion: 'An internet service provider has a 10 Gbps backbone but 1 Gbps connections to each customer. 20 customers all try to stream 4K video (25 Mbps each) simultaneously. What is the bottleneck?',
      checkAnswer: 'Total demand: 20 × 25 Mbps = 500 Mbps. Backbone capacity: 10 Gbps (more than enough). Per-customer: 1 Gbps each (more than enough). Total flow: 500 Mbps through the backbone — well within capacity. But if 500 customers try simultaneously: 500 × 25 = 12.5 Gbps, exceeding the 10 Gbps backbone. Now the backbone IS the bottleneck (min-cut), and each customer gets at most 20 Mbps. The min-cut shifted from individual connections to the shared backbone.',
      codeIntro: 'Implement the Ford-Fulkerson maximum flow algorithm on the postman\'s delivery network.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Delivery network with capacities (packages/day)
nodes = ['Shillong', 'Branch A', 'Branch B', 'Branch C', 'Hub East', 'Hub West', 'Dawki']
n = len(nodes)
node_idx = {name: i for i, name in enumerate(nodes)}

# Capacity matrix
capacity = np.zeros((n, n))
edges_cap = [
    ('Shillong', 'Branch A', 200), ('Shillong', 'Branch B', 150),
    ('Shillong', 'Branch C', 100), ('Branch A', 'Hub East', 120),
    ('Branch A', 'Hub West', 80), ('Branch B', 'Hub East', 100),
    ('Branch B', 'Hub West', 130), ('Branch C', 'Hub West', 90),
    ('Hub East', 'Dawki', 180), ('Hub West', 'Dawki', 200),
]
for v1, v2, cap in edges_cap:
    capacity[node_idx[v1]][node_idx[v2]] = cap

# Ford-Fulkerson (BFS-based = Edmonds-Karp)
def max_flow_bfs(capacity, source, sink):
    n = len(capacity)
    flow = np.zeros_like(capacity)
    total_flow = 0
    flow_history = []

    while True:
        # BFS to find augmenting path
        parent = [-1] * n
        visited = [False] * n
        visited[source] = True
        queue = [source]

        while queue and not visited[sink]:
            u = queue.pop(0)
            for v in range(n):
                if not visited[v] and capacity[u][v] - flow[u][v] > 0:
                    visited[v] = True
                    parent[v] = u
                    queue.append(v)

        if not visited[sink]:
            break

        # Find bottleneck
        bottleneck = float('inf')
        v = sink
        while v != source:
            u = parent[v]
            bottleneck = min(bottleneck, capacity[u][v] - flow[u][v])
            v = u

        # Update flow
        v = sink
        path = []
        while v != source:
            u = parent[v]
            flow[u][v] += bottleneck
            flow[v][u] -= bottleneck
            path.append(v)
            v = u
        path.append(source)
        path.reverse()

        total_flow += bottleneck
        flow_history.append({
            'path': [nodes[i] for i in path],
            'bottleneck': bottleneck,
            'total': total_flow,
        })

    return total_flow, flow, flow_history

source = node_idx['Shillong']
sink = node_idx['Dawki']
total, flow, history = max_flow_bfs(capacity, source, sink)

# Visualise
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Network with flow
ax1.set_facecolor('#111827')
pos = {
    'Shillong': (0, 3), 'Branch A': (2, 5), 'Branch B': (2, 3),
    'Branch C': (2, 1), 'Hub East': (4, 4.5), 'Hub West': (4, 1.5), 'Dawki': (6, 3),
}

for v1, v2, cap in edges_cap:
    x1, y1 = pos[v1]
    x2, y2 = pos[v2]
    i, j = node_idx[v1], node_idx[v2]
    f = flow[i][j]
    utilisation = f / cap if cap > 0 else 0

    color = '#22c55e' if utilisation < 0.7 else '#f59e0b' if utilisation < 0.95 else '#ef4444'
    width = 1 + 3 * utilisation
    ax1.annotate('', xy=(x2, y2), xytext=(x1, y1),
                 arrowprops=dict(arrowstyle='->', color=color, lw=width))
    mx, my = (x1+x2)/2, (y1+y2)/2
    ax1.text(mx, my + 0.2, f'{f:.0f}/{cap}', color=color, fontsize=7, ha='center', fontweight='bold')

for name, (x, y) in pos.items():
    color = '#ef4444' if name in ('Shillong', 'Dawki') else '#3b82f6'
    ax1.scatter(x, y, s=300, color=color, zorder=5, edgecolors='white', linewidth=1.5)
    ax1.annotate(name, (x, y), textcoords="offset points", xytext=(0, -18),
                 ha='center', color='white', fontsize=8, fontweight='bold')

ax1.set_title(f'Maximum Flow: {total:.0f} packages/day', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.set_xlim(-0.5, 7)

# Augmenting paths
ax2.set_facecolor('#111827')
for i, step in enumerate(history):
    path_str = ' → '.join(step['path'])
    ax2.barh(i, step['bottleneck'], color='#3b82f6', alpha=0.8)
    ax2.text(step['bottleneck'] + 2, i, f'+{step["bottleneck"]:.0f} (total: {step["total"]:.0f})',
             va='center', color='white', fontsize=9)
    ax2.text(-1, i, path_str, va='center', ha='right', color='#94a3b8', fontsize=7)

ax2.set_xlabel('Flow added (packages/day)', color='white')
ax2.set_ylabel('Iteration', color='white')
ax2.set_title('Augmenting Paths Found', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Maximum flow: {total:.0f} packages/day")
print()
print("Augmenting paths found:")
for i, step in enumerate(history):
    print(f"  Path {i+1}: {' → '.join(step['path'])} (bottleneck: {step['bottleneck']:.0f})")
print()
print("Edge utilisation:")
for v1, v2, cap in edges_cap:
    f = flow[node_idx[v1]][node_idx[v2]]
    util = f/cap*100
    status = 'SATURATED' if util > 99 else 'high' if util > 70 else 'ok'
    print(f"  {v1} → {v2}: {f:.0f}/{cap} ({util:.0f}%) [{status}]")`,
      challenge: 'Identify the min-cut (the set of edges whose total capacity equals the max flow). Remove them and verify the source and sink are disconnected.',
      successHint: 'Network flow is the mathematical foundation of supply chain management, internet traffic engineering, airline scheduling, and even matching algorithms (assigning students to schools). The max-flow min-cut theorem is one of the most beautiful results in combinatorial optimisation.',
    },
    {
      title: 'Vehicle routing problem — the postman with a van',
      concept: `The **Vehicle Routing Problem (VRP)** generalises the TSP: instead of one postman visiting all villages, you have a fleet of vehicles, each with limited capacity, serving customers from a central depot.

**VRP variants**:
- **Capacitated VRP (CVRP)**: each vehicle has a weight/volume limit
- **VRP with Time Windows (VRPTW)**: each customer must be served within a time range
- **Multi-depot VRP**: multiple starting locations
- **Dynamic VRP**: new orders arrive during the day

For the Meghalaya postal system:
- Depot: Shillong Head Post Office
- Vehicles: 3 postal vans + 5 postmen on foot
- Constraints: van capacity (500 packages), walking capacity (50 packages), 8-hour day
- Objective: minimise total travel time while delivering all mail

This is NP-hard (like TSP but harder), so real solutions use heuristics:
1. **Cluster-first, route-second**: group customers by geography, then solve TSP within each cluster
2. **Route-first, cluster-second**: solve one big TSP, then cut it into vehicle-sized segments
3. **Savings algorithm** (Clarke-Wright): start with one route per customer, merge routes that save the most distance
4. **Metaheuristics**: simulated annealing, genetic algorithms, ant colony optimisation`,
      analogy: 'VRP is like a pizza delivery manager with 5 drivers. Each driver has a car that holds 20 pizzas, and each delivery must arrive within 30 minutes. The manager must decide: which orders go to which driver, and in what sequence does each driver make their stops? With 100 orders and 5 drivers, the possibilities are astronomical. The manager uses experience (heuristics): group nearby orders, assign them to one driver, optimise each driver\'s route.',
      storyConnection: 'The postal superintendent in Shillong faces a VRP every morning. Mail arrives from across India on the night train. It must be sorted, loaded onto vans heading to district offices, and distributed to walking postmen who cover the last miles. Each level of this hierarchy is a vehicle routing problem with different vehicle types, capacities, and constraints. The system works because it has been iteratively optimised over 170 years (India Post was founded in 1854).',
      checkQuestion: 'Amazon delivers ~7 billion packages per year. If each delivery driver serves 150 stops per day, how many driver-days is that? How do they optimise this?',
      checkAnswer: '7 billion / 150 = ~47 million driver-days per year ≈ 130,000 drivers working every day. Amazon optimises using: (1) sophisticated VRP algorithms running on cloud servers, (2) machine learning to predict delivery times, (3) dynamic re-routing as conditions change, (4) delivery density — they favour areas where many customers are close together (urban), (5) locker and pickup point networks to reduce individual home deliveries. Despite this, logistics remains their largest cost centre.',
      codeIntro: 'Solve a vehicle routing problem using the cluster-first, route-second approach.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Depot and delivery points
depot = np.array([5, 5])
num_deliveries = 30
delivery_x = np.random.uniform(0, 10, num_deliveries)
delivery_y = np.random.uniform(0, 10, num_deliveries)
delivery_demand = np.random.randint(5, 25, num_deliveries)  # packages per stop

# Vehicles
num_vehicles = 3
vehicle_capacity = 120  # packages per vehicle

# Step 1: Cluster (assign deliveries to vehicles by angle from depot)
angles = np.arctan2(delivery_y - depot[1], delivery_x - depot[0])
sorted_idx = np.argsort(angles)

# Assign to vehicles by sweeping
clusters = [[] for _ in range(num_vehicles)]
loads = [0] * num_vehicles
current_vehicle = 0
for idx in sorted_idx:
    if loads[current_vehicle] + delivery_demand[idx] > vehicle_capacity:
        current_vehicle = min(current_vehicle + 1, num_vehicles - 1)
    clusters[current_vehicle].append(idx)
    loads[current_vehicle] += delivery_demand[idx]

# Step 2: Route (nearest neighbor TSP within each cluster)
def nn_route(depot, points):
    if len(points) == 0:
        return [], 0
    route = []
    total_dist = 0
    current = depot
    remaining = list(range(len(points)))
    while remaining:
        dists = [np.sqrt((points[i][0]-current[0])**2 + (points[i][1]-current[1])**2) for i in remaining]
        nearest_idx = remaining[np.argmin(dists)]
        total_dist += min(dists)
        route.append(nearest_idx)
        current = points[nearest_idx]
        remaining.remove(nearest_idx)
    total_dist += np.sqrt((current[0]-depot[0])**2 + (current[1]-depot[1])**2)
    return route, total_dist

vehicle_colors = ['#22c55e', '#3b82f6', '#f59e0b']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Map with routes
ax1.set_facecolor('#111827')
ax1.scatter(depot[0], depot[1], s=300, color='#ef4444', marker='*', zorder=10,
            edgecolors='white', linewidth=1.5)
ax1.annotate('DEPOT', depot, textcoords="offset points", xytext=(10, 10),
             color='#ef4444', fontsize=10, fontweight='bold')

total_distance = 0
for v, (cluster, color) in enumerate(zip(clusters, vehicle_colors)):
    if not cluster:
        continue
    points = np.column_stack([delivery_x[cluster], delivery_y[cluster]])
    route, dist = nn_route(depot, points)
    total_distance += dist

    # Plot route
    route_points = [depot] + [points[i] for i in route] + [depot]
    for i in range(len(route_points) - 1):
        ax1.annotate('', xy=route_points[i+1], xytext=route_points[i],
                     arrowprops=dict(arrowstyle='->', color=color, lw=1.5, alpha=0.7))

    # Plot delivery points
    for idx in cluster:
        ax1.scatter(delivery_x[idx], delivery_y[idx], s=delivery_demand[idx]*5,
                    color=color, alpha=0.7, edgecolors='white', linewidth=0.5)

    ax1.plot([], [], color=color, linewidth=2, label=f'Vehicle {v+1}: {len(cluster)} stops, {loads[v]} pkg, {dist:.1f} dist')

ax1.set_title(f'Vehicle Routing: {num_deliveries} Deliveries, {num_vehicles} Vehicles', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_xlim(-0.5, 10.5)
ax1.set_ylim(-0.5, 10.5)

# Vehicle load and distance comparison
ax2.set_facecolor('#111827')
x_pos = np.arange(num_vehicles)
width = 0.35

# Re-calculate distances per vehicle
dists_per_vehicle = []
for cluster in clusters:
    if cluster:
        points = np.column_stack([delivery_x[cluster], delivery_y[cluster]])
        _, dist = nn_route(depot, points)
        dists_per_vehicle.append(dist)
    else:
        dists_per_vehicle.append(0)

bars1 = ax2.bar(x_pos - width/2, loads, width, color=vehicle_colors, alpha=0.8, label='Load (packages)')
bars2 = ax2.bar(x_pos + width/2, dists_per_vehicle, width, color=vehicle_colors, alpha=0.5,
                edgecolor='white', linewidth=1, label='Distance')

ax2.set_xticks(x_pos)
ax2.set_xticklabels([f'Vehicle {i+1}' for i in range(num_vehicles)], color='white')
ax2.set_ylabel('Value', color='white')
ax2.set_title('Vehicle Loads and Distances', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

for bar, val in zip(bars1, loads):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             f'{val}', ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print(f"VRP Solution ({num_deliveries} deliveries, {num_vehicles} vehicles):")
for v in range(num_vehicles):
    print(f"  Vehicle {v+1}: {len(clusters[v])} stops, {loads[v]}/{vehicle_capacity} packages, {dists_per_vehicle[v]:.1f} distance")
print(f"  Total distance: {total_distance:.1f}")
print(f"  Total packages: {sum(loads)}/{sum(delivery_demand)}")
balance = max(loads) / max(1, min(loads))
print(f"  Load balance: {balance:.1f}x (1.0 = perfect)")`,
      challenge: 'Add time windows: 10 deliveries must arrive before 10am (morning shift), 20 after. Modify the clustering to respect this constraint. Does the total distance increase?',
      successHint: 'The vehicle routing problem is the backbone of every delivery, ride-share, and logistics company. Even a 1% improvement in VRP solutions saves millions of dollars for large operators. This is why operations research is one of the highest-impact fields in applied mathematics.',
    },
    {
      title: 'Simulation of delivery routes — testing strategies virtually',
      concept: `Before deploying a new delivery strategy, you can **simulate** it — run a virtual version of the postal system to test performance without real-world risk or cost.

**Monte Carlo simulation** tests a strategy across thousands of random scenarios:
1. Define the variables (demand, weather, road conditions)
2. Assign probability distributions to each variable
3. Run the strategy thousands of times with randomly sampled conditions
4. Analyse the distribution of outcomes (average, worst case, best case)

For the postal system, we might simulate:
- 1,000 days of operations
- Random daily mail volumes (Poisson distribution, mean 500)
- Random weather (10% chance of heavy rain reducing speed by 50%)
- Random path closures (2% per path per day in monsoon, 0.1% in dry season)
- Random vehicle breakdowns (1% per vehicle per day)

The simulation reveals:
- Average delivery time across all scenarios
- Worst-case scenarios (what can go wrong?)
- Sensitivity: which variable matters most?
- Robustness: how often does the strategy meet service targets?

Simulation is cheaper than experimentation: testing 10 route strategies × 1,000 days = 10,000 virtual days, completed in seconds. Real testing would take 27 years.`,
      analogy: 'Simulation is like a flight simulator for logistics. A pilot trains in a simulator before flying a real plane — encountering storms, engine failures, and navigation challenges safely. A logistics simulation encounters monsoons, breakdowns, and demand surges safely. Both provide experience without risk. The key insight: if your strategy fails in simulation, it will fail in reality — but failure in simulation costs nothing.',
      storyConnection: 'If the Shillong post office could simulate a year of operations in a minute, they could test: "What if we add a second postman to the Mawsynram route? What if we pre-position mail at microhubs before monsoon? What if we switch to motorcycle delivery on paved roads?" Each question becomes testable without disrupting actual service. The postman\'s 20 years of experience is, in a sense, 20 years of real-world simulation — 7,300 runs of the "delivery day" experiment.',
      checkQuestion: 'A simulation shows that a strategy works 95% of the time. Is it good enough to deploy?',
      checkAnswer: 'It depends on the consequences of the 5% failure. If failure means mail is delayed by one day — acceptable. If failure means critical medicine doesn\'t reach a patient — unacceptable. A 95% success rate means failure roughly every 20 days, or about 18 times per year. For postal delivery, this might be fine. For a nuclear reactor, airline, or hospital, 95% is far too low. The acceptable failure rate is determined by the cost of failure, not the success rate alone.',
      codeIntro: 'Run a Monte Carlo simulation of the postal delivery system across 1,000 days.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
num_days = 1000

# Network parameters
num_paths = 16
num_villages = 10
normal_delivery_time = 6  # hours for full route

# Simulation
results = {
    'delivery_time': [],
    'villages_reached': [],
    'packages_delivered': [],
    'packages_planned': [],
    'paths_open': [],
    'weather': [],
}

for day in range(num_days):
    # Season (affects weather)
    month = (day % 365) / 30
    monsoon = 0.8 * np.exp(-((month - 7)**2) / 3)

    # Weather
    rain = np.random.random() < (0.3 + 0.5 * monsoon)
    heavy_rain = rain and np.random.random() < 0.3
    results['weather'].append(2 if heavy_rain else 1 if rain else 0)

    # Path closures
    close_prob = 0.005 + 0.15 * monsoon + 0.1 * heavy_rain
    paths_open = num_paths - np.random.binomial(num_paths, close_prob)
    results['paths_open'].append(paths_open)

    # Villages reachable
    connectivity = paths_open / num_paths
    villages_ok = min(num_villages, int(num_villages * min(1.0, connectivity * 1.3)))
    results['villages_reached'].append(villages_ok)

    # Delivery time (affected by weather)
    speed_factor = 1.0
    if rain:
        speed_factor = 0.7
    if heavy_rain:
        speed_factor = 0.4
    delivery_time = normal_delivery_time / speed_factor * (num_villages / max(1, villages_ok))
    delivery_time = min(delivery_time, 10)  # cap at 10 hours (forced return)
    results['delivery_time'].append(delivery_time)

    # Packages
    planned = np.random.poisson(500)
    delivered = int(planned * villages_ok / num_villages * min(1, 8 / delivery_time))
    results['packages_planned'].append(planned)
    results['packages_delivered'].append(delivered)

# Analysis
fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Monte Carlo Simulation: {num_days} Days of Postal Operations', color='white', fontsize=14)

# Delivery time distribution
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.hist(results['delivery_time'], bins=40, color='#3b82f6', alpha=0.7, edgecolor='none')
ax1.axvline(np.mean(results['delivery_time']), color='#f59e0b', linewidth=2,
            label=f'Mean: {np.mean(results["delivery_time"]):.1f}h')
ax1.axvline(np.percentile(results['delivery_time'], 95), color='#ef4444', linewidth=2, linestyle='--',
            label=f'95th pct: {np.percentile(results["delivery_time"], 95):.1f}h')
ax1.set_xlabel('Delivery time (hours)', color='white')
ax1.set_ylabel('Count', color='white')
ax1.set_title('Delivery Time Distribution', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Success rate over time
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
success_rate = np.array(results['packages_delivered']) / np.maximum(1, np.array(results['packages_planned'])) * 100
rolling = np.convolve(success_rate, np.ones(30)/30, mode='same')
ax2.plot(range(num_days), rolling, color='#22c55e', linewidth=1)
ax2.axhline(90, color='#f59e0b', linestyle='--', linewidth=1, label='90% target')
below_target = np.sum(rolling < 90) / num_days * 100
ax2.set_xlabel('Day', color='white')
ax2.set_ylabel('30-day rolling success rate (%)', color='white')
ax2.set_title(f'Service Level (below target {below_target:.0f}% of days)', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Weather vs delivery scatter
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
weather_labels = {0: 'Clear', 1: 'Rain', 2: 'Heavy rain'}
for w in [0, 1, 2]:
    mask = np.array(results['weather']) == w
    ax3.scatter(np.array(results['delivery_time'])[mask],
                np.array(results['villages_reached'])[mask],
                alpha=0.3, s=10, label=weather_labels[w],
                color=['#22c55e', '#f59e0b', '#ef4444'][w])
ax3.set_xlabel('Delivery time (hours)', color='white')
ax3.set_ylabel('Villages reached', color='white')
ax3.set_title('Weather Impact on Operations', color='white', fontsize=11)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

# Monthly performance
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
monthly_success = []
month_names = ['J','F','M','A','M','J','J','A','S','O','N','D']
for m in range(12):
    mask = ((np.arange(num_days) % 365) // 30) == m
    if np.sum(mask) > 0:
        monthly_success.append(np.mean(np.array(results['packages_delivered'])[mask] /
                                        np.maximum(1, np.array(results['packages_planned'])[mask]) * 100))
    else:
        monthly_success.append(0)
bars = ax4.bar(month_names, monthly_success,
               color=['#22c55e' if s > 90 else '#f59e0b' if s > 70 else '#ef4444' for s in monthly_success],
               alpha=0.8)
ax4.axhline(90, color='gray', linestyle=':', linewidth=1)
ax4.set_ylabel('Avg delivery rate (%)', color='white')
ax4.set_title('Monthly Performance', color='white', fontsize=11)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Simulation results ({num_days} days):")
print(f"  Avg delivery time: {np.mean(results['delivery_time']):.1f} hours")
print(f"  Avg villages reached: {np.mean(results['villages_reached']):.1f}/{num_villages}")
print(f"  Avg delivery rate: {np.mean(success_rate):.1f}%")
print(f"  Days below 90% target: {np.sum(np.array(success_rate) < 90)} ({np.sum(np.array(success_rate) < 90)/num_days*100:.0f}%)")
print(f"  Worst day: {np.min(success_rate):.0f}% delivery rate")`,
      challenge: 'Run two scenarios: (A) current system, and (B) add one extra postman during monsoon months (June-September). Compare annual delivery rates. How many additional packages does the extra postman deliver?',
      successHint: 'Monte Carlo simulation is used across every industry: finance (risk analysis), engineering (structural safety), medicine (drug trial design), and logistics. It transforms uncertainty from a threat into a quantifiable, manageable input.',
    },
    {
      title: 'Real-world optimization with Python — putting it all together',
      concept: `The final lesson brings together everything: graphs, algorithms, constraints, simulation, and Python programming to build a complete postal route optimizer.

**The real-world problem**: Given a set of villages, distances, mail volumes, weather forecasts, and vehicle capacities, design the day's delivery routes to minimise total time while meeting service targets.

**Solution architecture**:
1. **Data layer**: village locations, distances (adjacency list), daily mail volumes
2. **Model layer**: graph representation, shortest paths (Dijkstra), VRP solver
3. **Simulation layer**: weather uncertainty, path reliability, demand variation
4. **Optimisation layer**: search for the best assignment of deliveries to vehicles and routes
5. **Output layer**: route maps, schedules, performance metrics

This is how real logistics software works — from Amazon's delivery system to India Post's planning tools. The scale differs (10 villages vs 10 million addresses), but the architecture is the same.

**Key Python libraries for real implementation**:
- **NetworkX**: graph algorithms (Dijkstra, flow, centrality)
- **OR-Tools** (Google): VRP, TSP, constraint programming
- **SciPy**: optimisation functions
- **SimPy**: discrete event simulation
- **Folium/GeoPandas**: geographic visualisation`,
      analogy: 'Building a route optimiser is like building a brain for the postman. The data layer is memory (knowing the terrain). The model layer is reasoning (calculating distances, finding paths). The simulation layer is imagination (what if it rains?). The optimisation layer is decision-making (choosing the best route). The output layer is communication (telling the postman where to go). Each layer is simple; together, they solve complex problems.',
      storyConnection: 'Imagine giving the Meghalaya postman a tablet with this optimiser. Each morning, he inputs today\'s mail volumes, checks the weather forecast, notes any path closures, and the system generates an optimised route — adjusting for conditions, priorities, and his physical limits. He still walks the hills, but with a digital co-pilot that combines his experience with computational power. The human-machine partnership is stronger than either alone.',
      checkQuestion: 'If you built this optimiser and it recommended a route that the experienced postman knew was wrong (because of a local condition the data missed), who should you trust?',
      checkAnswer: 'The postman. Local knowledge includes information that no database captures: a tree that fell yesterday, a dog that blocks a particular path, a shortcut through a friendly farmer\'s property. The optimiser should be a tool that SUGGESTS routes, not a dictator that MANDATES them. The best logistics systems combine algorithmic optimisation with human override. The postman\'s judgment is the ultimate validation layer.',
      codeIntro: 'Build a complete mini route optimiser that integrates graphs, Dijkstra, and weather-aware VRP.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# === COMPLETE POSTAL ROUTE OPTIMISER ===

# --- Data Layer ---
villages = {
    'Shillong': {'pos': (5, 5), 'mail': 0},  # depot
    'Mawsynram': {'pos': (3, 7), 'mail': 45},
    'Cherrapunji': {'pos': (4, 8), 'mail': 35},
    'Nongstoin': {'pos': (1, 5), 'mail': 25},
    'Jowai': {'pos': (8, 6), 'mail': 40},
    'Dawki': {'pos': (9, 8), 'mail': 20},
    'Mawlynnong': {'pos': (7, 7), 'mail': 15},
    'Laitlyngkot': {'pos': (3, 3), 'mail': 30},
    'Nongpoh': {'pos': (6, 2), 'mail': 35},
    'Tura': {'pos': (0, 2), 'mail': 50},
}

paths = [
    ('Shillong', 'Mawsynram', 2.5), ('Shillong', 'Cherrapunji', 2.0),
    ('Shillong', 'Nongpoh', 1.5), ('Shillong', 'Jowai', 3.0),
    ('Shillong', 'Laitlyngkot', 2.0), ('Mawsynram', 'Cherrapunji', 1.0),
    ('Mawsynram', 'Nongstoin', 2.5), ('Cherrapunji', 'Dawki', 4.0),
    ('Nongstoin', 'Tura', 5.0), ('Nongstoin', 'Laitlyngkot', 2.0),
    ('Jowai', 'Dawki', 2.0), ('Jowai', 'Mawlynnong', 1.5),
    ('Dawki', 'Mawlynnong', 2.0), ('Laitlyngkot', 'Nongpoh', 2.5),
    ('Tura', 'Laitlyngkot', 4.0), ('Nongpoh', 'Jowai', 3.5),
]

# --- Weather Layer ---
weather = 'monsoon'  # 'clear', 'rain', 'monsoon'
speed_multiplier = {'clear': 1.0, 'rain': 0.7, 'monsoon': 0.5}[weather]
closure_prob = {'clear': 0.0, 'rain': 0.1, 'monsoon': 0.2}[weather]

# Apply weather: randomly close some paths
open_paths = []
closed_paths = []
for p in paths:
    if np.random.random() > closure_prob:
        adjusted_time = p[2] / speed_multiplier
        open_paths.append((p[0], p[1], adjusted_time))
    else:
        closed_paths.append(p)

# --- Model Layer: Build graph and run Dijkstra ---
graph = {}
for v1, v2, w in open_paths:
    graph.setdefault(v1, []).append((v2, w))
    graph.setdefault(v2, []).append((v1, w))

def dijkstra(graph, source):
    dist = {n: float('inf') for n in graph}
    prev = {n: None for n in graph}
    dist[source] = 0
    unvisited = set(graph.keys())
    while unvisited:
        current = min(unvisited, key=lambda n: dist[n])
        if dist[current] == float('inf'):
            break
        unvisited.remove(current)
        for neighbor, weight in graph.get(current, []):
            if neighbor in unvisited:
                new_dist = dist[current] + weight
                if new_dist < dist[neighbor]:
                    dist[neighbor] = new_dist
                    prev[neighbor] = current
    return dist, prev

# Shortest distances from depot
depot_dist, depot_prev = dijkstra(graph, 'Shillong')

# --- Optimisation Layer: Greedy VRP ---
# 2 postmen, 8 hours each, carrying capacity 80 letters each
num_postmen = 2
max_hours = 8
max_carry = 80

routes = [[] for _ in range(num_postmen)]
route_times = [0.0] * num_postmen
route_loads = [0] * num_postmen

# Sort villages by urgency (mail volume / distance)
reachable = {v: d for v, d in depot_dist.items() if d < float('inf') and v != 'Shillong'}
priority = sorted(reachable.keys(),
                  key=lambda v: -villages[v]['mail'] / max(0.1, depot_dist[v]))

for village in priority:
    mail = villages[village]['mail']
    travel = depot_dist[village] * 2  # round trip estimate

    # Assign to postman with most remaining capacity
    best_postman = None
    best_remaining = -1
    for p in range(num_postmen):
        remaining_time = max_hours - route_times[p]
        remaining_load = max_carry - route_loads[p]
        if travel <= remaining_time and mail <= remaining_load:
            if remaining_time > best_remaining:
                best_remaining = remaining_time
                best_postman = p

    if best_postman is not None:
        routes[best_postman].append(village)
        route_times[best_postman] += travel * 0.6  # shared travel reduces time
        route_loads[best_postman] += mail

# --- Output Layer ---
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Postal Route Optimiser — Weather: {weather.upper()}', color='white', fontsize=14)

# Route map
ax1.set_facecolor('#111827')
# Draw all paths
for v1, v2, w in open_paths:
    x1, y1 = villages[v1]['pos']
    x2, y2 = villages[v2]['pos']
    ax1.plot([x1, x2], [y1, y2], color='#374151', linewidth=1, alpha=0.4)
for v1, v2, w in closed_paths:
    x1, y1 = villages[v1]['pos']
    x2, y2 = villages[v2]['pos']
    ax1.plot([x1, x2], [y1, y2], color='#ef4444', linewidth=2, linestyle=':', alpha=0.5)

route_colors = ['#22c55e', '#3b82f6']
for p, (route, color) in enumerate(zip(routes, route_colors)):
    prev_pos = villages['Shillong']['pos']
    for village in route:
        vpos = villages[village]['pos']
        ax1.annotate('', xy=vpos, xytext=prev_pos,
                     arrowprops=dict(arrowstyle='->', color=color, lw=2))
        prev_pos = vpos
    if route:
        ax1.annotate('', xy=villages['Shillong']['pos'], xytext=prev_pos,
                     arrowprops=dict(arrowstyle='->', color=color, lw=1.5, alpha=0.5))

for name, data in villages.items():
    x, y = data['pos']
    assigned = any(name in r for r in routes)
    unreachable = name not in graph
    color = '#ef4444' if name == 'Shillong' else '#6b7280' if (not assigned and name != 'Shillong') else '#f59e0b'
    size = 200 + data['mail'] * 3
    ax1.scatter(x, y, s=size, color=color, zorder=5, edgecolors='white', linewidth=1.5)
    ax1.annotate(f'{name}\\n({data["mail"]})', (x, y), textcoords="offset points",
                 xytext=(0, 15), ha='center', color='white', fontsize=7)

ax1.set_title('Optimised Routes', color='white', fontsize=12)
ax1.tick_params(colors='gray')

for p, color in enumerate(route_colors):
    ax1.plot([], [], color=color, linewidth=2, label=f'Postman {p+1}: {len(routes[p])} villages, {route_loads[p]} pkg')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='lower right')

# Performance summary
ax2.set_facecolor('#111827')
categories = ['Villages\\nassigned', 'Packages\\ndelivered', 'Time used\\n(hours)', 'Load used\\n(packages)']
for p, color in enumerate(route_colors):
    total_mail = sum(villages[v]['mail'] for v in routes[p])
    vals = [len(routes[p]), total_mail, route_times[p], route_loads[p]]
    maxes = [len(villages)-1, sum(v['mail'] for v in villages.values()), max_hours, max_carry]
    pcts = [v/m*100 if m > 0 else 0 for v, m in zip(vals, maxes)]
    x_pos = np.arange(len(categories))
    ax2.bar(x_pos + p*0.35, pcts, 0.3, color=color, alpha=0.8, label=f'Postman {p+1}')
    for x, pct, val in zip(x_pos + p*0.35, pcts, vals):
        ax2.text(x, pct + 2, f'{val}', ha='center', color='white', fontsize=8)

ax2.set_xticks(x_pos + 0.175)
ax2.set_xticklabels(categories, color='white', fontsize=8)
ax2.set_ylabel('Utilisation (%)', color='white')
ax2.set_title('Resource Utilisation', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

total_delivered = sum(route_loads)
total_possible = sum(v['mail'] for v in villages.values() if v['mail'] > 0)
unserved = [v for v in villages if v != 'Shillong' and not any(v in r for r in routes)]

print(f"=== DAILY ROUTE PLAN ({weather.upper()} WEATHER) ===")
print(f"  Paths closed: {len(closed_paths)}/{len(paths)}")
for p in range(num_postmen):
    print(f"  Postman {p+1}: {' → '.join(['Shillong'] + routes[p] + ['Shillong'])}")
    print(f"    Stops: {len(routes[p])}, Packages: {route_loads[p]}, Time: {route_times[p]:.1f}h")
print(f"  Total delivered: {total_delivered}/{total_possible} ({total_delivered/total_possible*100:.0f}%)")
if unserved:
    print(f"  UNSERVED today: {', '.join(unserved)}")`,
      challenge: 'Run the optimiser for all three weather conditions (clear, rain, monsoon) and compare total deliveries. Then add a third postman — how much does service improve in monsoon conditions?',
      successHint: 'You have built a complete logistics optimiser from scratch: graphs, shortest paths, vehicle routing, weather simulation, and performance analysis. These are the same building blocks used by Amazon, UPS, India Post, and every logistics operation on Earth. From the postman\'s hills to global supply chains — the mathematics is the same.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Graph Theory & Algorithms</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for algorithm implementations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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
