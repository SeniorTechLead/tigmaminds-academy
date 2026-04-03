import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function SilkRouteLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Graph theory fundamentals — nodes, edges, and trade networks',
      concept: `A trade network is a **graph** — a mathematical structure consisting of **nodes** (vertices) connected by **edges** (links). In the Silk Route context, nodes represent cities or trading posts, and edges represent routes between them. Each edge has a **weight** representing the cost, distance, or travel time between two nodes.

Graph theory was born in 1736 when Leonhard Euler proved it was impossible to walk across all seven bridges of Konigsberg exactly once. The key insight was that the physical layout of the bridges did not matter — only the connections. This abstraction is what makes graphs so powerful: a trade network, a social network, a computer network, and a neural network are all graphs with different node and edge types but identical mathematical structure.

A trade network graph has special properties. It is typically **weighted** (different routes have different costs), **directed** (silk flows from China to Rome, gold flows back), and **dynamic** (routes open and close with seasons, wars, and political changes). The **degree** of a node counts its connections — high-degree nodes are trade hubs. The **betweenness centrality** of a node measures how many shortest paths pass through it — nodes with high betweenness are critical chokepoints whose disruption would fragment the network.`,
      analogy: 'A trade network graph is like a subway map. The map does not show exact distances or the shape of tunnels — it shows which stations connect to which. A station with many lines (high degree) is a hub. A station that sits between two major areas (high betweenness) is a chokepoint — if it closes, passengers must take long detours. Trade networks work the same way: Samarkand was the "Grand Central Station" of the Silk Route.',
      storyConnection: 'The ancient silk routes connecting Assam to Southeast Asia and Central Asia formed exactly such a network. Sualkuchi (the silk weaving village) was a production node; Guwahati was a trade hub; and river ports along the Brahmaputra were transit nodes. The story traces goods moving through this network — each journey follows a path through the graph.',
      checkQuestion: 'If a trade network has 8 cities and each city connects to exactly 3 others, how many edges does the graph have? What if the network is directed (routes are one-way)?',
      checkAnswer: 'Undirected: Each edge connects two nodes, so each edge is counted twice in the degree sum. Total degree = 8 × 3 = 24, so edges = 24/2 = 12. Directed: Each directed edge leaves one node and enters another. With out-degree 3 for each node, there are 8 × 3 = 24 directed edges. Directed graphs can have up to twice as many edges because A→B and B→A are different edges.',
      codeIntro: 'Build a trade network graph from scratch and compute fundamental graph metrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Build a Silk Route trade network
np.random.seed(42)

# Cities (nodes) with coordinates for visualization
cities = {
    'Sualkuchi': (92.0, 26.2),
    'Guwahati': (91.7, 26.1),
    'Dhaka': (90.4, 23.8),
    'Mandalay': (96.1, 21.9),
    'Kunming': (102.7, 25.0),
    'Kolkata': (88.4, 22.6),
    'Chittagong': (91.8, 22.3),
    'Imphal': (93.9, 24.8),
    'Lhasa': (91.1, 29.7),
    'Hanoi': (105.8, 21.0),
    'Bagan': (94.9, 21.2),
    'Chengdu': (104.1, 30.6),
}

# Trade routes (edges) with costs (days of travel)
routes = [
    ('Sualkuchi', 'Guwahati', 1),
    ('Guwahati', 'Dhaka', 8),
    ('Guwahati', 'Imphal', 5),
    ('Guwahati', 'Lhasa', 25),
    ('Dhaka', 'Kolkata', 4),
    ('Dhaka', 'Chittagong', 5),
    ('Chittagong', 'Mandalay', 12),
    ('Imphal', 'Mandalay', 7),
    ('Mandalay', 'Bagan', 4),
    ('Mandalay', 'Kunming', 15),
    ('Mandalay', 'Hanoi', 14),
    ('Kunming', 'Chengdu', 10),
    ('Kunming', 'Hanoi', 8),
    ('Lhasa', 'Chengdu', 18),
    ('Kolkata', 'Dhaka', 4),
    ('Bagan', 'Mandalay', 4),
]

# Build adjacency matrix
city_list = list(cities.keys())
n = len(city_list)
idx = {c: i for i, c in enumerate(city_list)}
adj = np.zeros((n, n))
for c1, c2, w in routes:
    adj[idx[c1], idx[c2]] = w
    adj[idx[c2], idx[c1]] = w  # undirected

# Graph metrics
degrees = np.sum(adj > 0, axis=1)

# Betweenness centrality (simplified: count shortest paths through each node)
# Floyd-Warshall for all-pairs shortest paths
dist = np.full((n, n), np.inf)
next_node = np.full((n, n), -1, dtype=int)
for i in range(n):
    dist[i, i] = 0
    for j in range(n):
        if adj[i, j] > 0:
            dist[i, j] = adj[i, j]
            next_node[i, j] = j

for k in range(n):
    for i in range(n):
        for j in range(n):
            if dist[i, k] + dist[k, j] < dist[i, j]:
                dist[i, j] = dist[i, k] + dist[k, j]
                next_node[i, j] = next_node[i, k]

# Betweenness: count how many shortest paths pass through each node
betweenness = np.zeros(n)
for i in range(n):
    for j in range(n):
        if i != j and dist[i, j] < np.inf:
            # Trace path from i to j
            current = i
            while current != j and current != -1:
                nxt = next_node[current, j]
                if nxt != j and nxt != i and nxt != -1:
                    betweenness[nxt] += 1
                current = nxt

# Normalize
betweenness = betweenness / max(betweenness.max(), 1)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Network visualization
for c1, c2, w in routes:
    x1, y1 = cities[c1]
    x2, y2 = cities[c2]
    axes[0, 0].plot([x1, x2], [y1, y2], color='#60a5fa', linewidth=0.5 + 3/w, alpha=0.6)

for city, (x, y) in cities.items():
    i = idx[city]
    size = 50 + degrees[i] * 40
    color = plt.cm.YlOrRd(betweenness[i])
    axes[0, 0].scatter(x, y, s=size, c=[color], edgecolors='white', linewidths=1, zorder=5)
    axes[0, 0].annotate(city, (x, y), textcoords="offset points", xytext=(5, 5),
                         color='white', fontsize=7, fontweight='bold')

axes[0, 0].set_xlabel('Longitude', color='white')
axes[0, 0].set_ylabel('Latitude', color='white')
axes[0, 0].set_title('Silk Route Trade Network', color='white', fontsize=11)

# Degree distribution
axes[0, 1].bar(city_list, degrees, color='#60a5fa', alpha=0.8)
axes[0, 1].set_xticklabels(city_list, rotation=45, ha='right', color='white', fontsize=7)
axes[0, 1].set_ylabel('Degree (connections)', color='white')
axes[0, 1].set_title('Node degree (trade connections)', color='white', fontsize=11)

# Betweenness centrality
sort_idx = np.argsort(betweenness)[::-1]
axes[1, 0].barh([city_list[i] for i in sort_idx], betweenness[sort_idx], color='#f59e0b', alpha=0.8)
axes[1, 0].set_xlabel('Betweenness centrality (normalized)', color='white')
axes[1, 0].set_title('Critical chokepoints', color='white', fontsize=11)

# Distance heatmap
mask = dist.copy()
mask[mask == np.inf] = np.nan
im = axes[1, 1].imshow(mask, cmap='YlOrRd')
axes[1, 1].set_xticks(range(n))
axes[1, 1].set_xticklabels([c[:4] for c in city_list], color='white', fontsize=6, rotation=45)
axes[1, 1].set_yticks(range(n))
axes[1, 1].set_yticklabels([c[:4] for c in city_list], color='white', fontsize=6)
axes[1, 1].set_title('Shortest path distances (days)', color='white', fontsize=11)
plt.colorbar(im, ax=axes[1, 1], label='Days')

plt.tight_layout()
plt.show()

print("Trade network analysis:")
print(f"  Nodes: {n}, Edges: {len(routes)}")
hub = city_list[np.argmax(degrees)]
chokepoint = city_list[np.argmax(betweenness)]
print(f"  Biggest hub (most connections): {hub} (degree {int(max(degrees))})")
print(f"  Critical chokepoint: {chokepoint} (betweenness {betweenness[np.argmax(betweenness)]:.3f})")
print(f"  Average path length: {np.nanmean(mask):.1f} days")`,
      challenge: 'Remove the Mandalay node (simulate a war disrupting the city). Recalculate shortest paths. Which city pairs become disconnected? How much do average travel times increase?',
      successHint: 'Graph theory reveals the invisible structure of networks. The same algorithms that analyze ancient trade routes now power Google Maps, social media recommendations, and internet routing.',
    },
    {
      title: 'Shortest path algorithms — Dijkstra and beyond',
      concept: `Finding the cheapest route between two cities is the **shortest path problem** — one of the most studied problems in computer science. The most famous algorithm is **Dijkstra's algorithm** (1959), which finds the shortest path from one source node to all other nodes in a weighted graph with non-negative edge weights.

Dijkstra's algorithm works by maintaining a "frontier" of nodes whose shortest distance from the source is known. At each step, it picks the frontier node with the smallest distance, marks it as finalized, and updates the distances of its neighbors. The key insight is **greedy optimality**: once a node's shortest distance is finalized, it never changes. This is because all edge weights are non-negative, so any alternative path through an unvisited node can only be longer.

The time complexity is O(V² ) with a simple array or O((V + E) log V) with a priority queue, where V is the number of nodes and E the number of edges. For the Silk Route with ~50 cities, even the naive implementation runs in microseconds. For modern logistics networks with millions of nodes, the priority queue version is essential.

Beyond Dijkstra, the **A* algorithm** adds a heuristic (estimated remaining distance) to guide the search toward the goal, dramatically reducing the number of nodes explored. For all-pairs shortest paths, **Floyd-Warshall** runs in O(V³) — cubic time, but with a beautifully simple three-nested-loop structure.`,
      analogy: 'Dijkstra is like planning a road trip by expanding circles outward from your starting point. First you know the cost to reach all neighboring cities. Then you pick the cheapest, mark it done, and check its neighbors. The circle of "known best routes" expands outward like ripples in a pond — each ripple represents routes that are one step more expensive than the previous ring.',
      storyConnection: 'Silk merchants had to solve this problem every trading season: which route from Sualkuchi to Kunming minimizes travel days while avoiding monsoon floods and bandit territories? They solved it through accumulated experience — mental maps of route costs refined over generations. Dijkstra formalized this intuition into an algorithm that any computer can execute.',
      checkQuestion: 'In Dijkstra with a priority queue, if the graph has 1000 nodes and 5000 edges, approximately how many operations does it take? Compare with Floyd-Warshall for the same graph.',
      checkAnswer: 'Dijkstra: O((V+E) log V) = O((1000+5000) × log(1000)) ≈ 6000 × 10 = 60,000 operations. Floyd-Warshall: O(V³) = 1000³ = 1,000,000,000 operations. Dijkstra is ~16,000 times faster for single-source shortest paths. But Floyd-Warshall gives ALL pairs at once — if you need all V Dijkstra runs, that is 60,000 × 1000 = 60,000,000, still 17× faster than Floyd-Warshall.',
      codeIntro: 'Implement Dijkstra from scratch and visualize the algorithm step by step on the trade network.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Dijkstra's algorithm — step-by-step visualization

cities = {
    'Sualkuchi': (92.0, 26.2), 'Guwahati': (91.7, 26.1),
    'Dhaka': (90.4, 23.8), 'Mandalay': (96.1, 21.9),
    'Kunming': (102.7, 25.0), 'Kolkata': (88.4, 22.6),
    'Chittagong': (91.8, 22.3), 'Imphal': (93.9, 24.8),
    'Lhasa': (91.1, 29.7), 'Hanoi': (105.8, 21.0),
    'Bagan': (94.9, 21.2), 'Chengdu': (104.1, 30.6),
}

routes = [
    ('Sualkuchi', 'Guwahati', 1), ('Guwahati', 'Dhaka', 8),
    ('Guwahati', 'Imphal', 5), ('Guwahati', 'Lhasa', 25),
    ('Dhaka', 'Kolkata', 4), ('Dhaka', 'Chittagong', 5),
    ('Chittagong', 'Mandalay', 12), ('Imphal', 'Mandalay', 7),
    ('Mandalay', 'Bagan', 4), ('Mandalay', 'Kunming', 15),
    ('Mandalay', 'Hanoi', 14), ('Kunming', 'Chengdu', 10),
    ('Kunming', 'Hanoi', 8), ('Lhasa', 'Chengdu', 18),
    ('Kolkata', 'Dhaka', 4), ('Bagan', 'Mandalay', 4),
]

city_list = list(cities.keys())
n = len(city_list)
idx = {c: i for i, c in enumerate(city_list)}

# Adjacency list
adj = {i: [] for i in range(n)}
for c1, c2, w in routes:
    adj[idx[c1]].append((idx[c2], w))
    adj[idx[c2]].append((idx[c1], w))

def dijkstra_traced(source_idx, target_idx):
    """Dijkstra with step-by-step trace for visualization."""
    dist = [float('inf')] * n
    prev = [-1] * n
    visited = [False] * n
    dist[source_idx] = 0

    steps = []  # (finalized_node, current_distances)

    for _ in range(n):
        # Find minimum unvisited
        u = -1
        for v in range(n):
            if not visited[v] and (u == -1 or dist[v] < dist[u]):
                u = v

        if u == -1 or dist[u] == float('inf'):
            break

        visited[u] = True
        steps.append((u, dist.copy(), visited.copy()))

        if u == target_idx:
            break

        # Relax neighbors
        for v, w in adj[u]:
            if not visited[v] and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u

    # Reconstruct path
    path = []
    node = target_idx
    while node != -1:
        path.append(node)
        node = prev[node]
    path.reverse()

    return dist, prev, path, steps

# Find path from Sualkuchi to Kunming
source = idx['Sualkuchi']
target = idx['Kunming']
dist, prev, path, steps = dijkstra_traced(source, target)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Dijkstra\\'s Algorithm: Sualkuchi → Kunming', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Show 6 snapshots of the algorithm
snapshot_indices = np.linspace(0, len(steps)-1, 6, dtype=int)

for panel_idx, step_idx in enumerate(snapshot_indices):
    ax = axes[panel_idx // 3, panel_idx % 3]
    finalized, dists, vis = steps[step_idx]

    # Draw edges
    for c1, c2, w in routes:
        x1, y1 = cities[c1]; x2, y2 = cities[c2]
        ax.plot([x1, x2], [y1, y2], color='gray', linewidth=0.5, alpha=0.3)

    # Draw path edges found so far
    for i in range(n):
        if vis[i] and prev[i] != -1:
            c1, c2 = city_list[prev[i]], city_list[i]
            x1, y1 = cities[c1]; x2, y2 = cities[c2]
            ax.plot([x1, x2], [y1, y2], color='#22c55e', linewidth=2.5, alpha=0.8)

    # Draw nodes
    for i, city in enumerate(city_list):
        x, y = cities[city]
        if i == source:
            color = '#22c55e'
        elif i == target:
            color = '#ef4444'
        elif vis[i]:
            color = '#f59e0b'
        elif dists[i] < float('inf'):
            color = '#60a5fa'
        else:
            color = '#4b5563'

        ax.scatter(x, y, s=60, c=color, edgecolors='white', linewidths=0.5, zorder=5)
        label = f'{city[:3]}:{dists[i]:.0f}' if dists[i] < float('inf') else city[:3]
        ax.annotate(label, (x, y), textcoords="offset points", xytext=(3, 3),
                     color='white', fontsize=5)

    # Highlight currently finalized node
    fx, fy = cities[city_list[finalized]]
    ax.scatter(fx, fy, s=150, c='none', edgecolors='#ef4444', linewidths=2, zorder=6)

    ax.set_title(f'Step {step_idx+1}: finalize {city_list[finalized][:6]}',
                 color='white', fontsize=9)
    ax.set_xlim(86, 108)
    ax.set_ylim(19, 32)

plt.tight_layout()
plt.show()

# Print results
path_cities = [city_list[i] for i in path]
print(f"Shortest path: {' → '.join(path_cities)}")
print(f"Total distance: {dist[target]} days")
print(f"\\nDijkstra explored {len(steps)} nodes out of {n} total")
print(f"\\nAll distances from Sualkuchi:")
for i, city in enumerate(city_list):
    d = dist[i]
    print(f"  {city:>15s}: {d:.0f} days" if d < float('inf') else f"  {city:>15s}: unreachable")`,
      challenge: 'Implement the A* variant: use Euclidean distance to the target as a heuristic. Count how many nodes A* explores versus Dijkstra. The heuristic must be admissible (never overestimate) for A* to find the optimal path.',
      successHint: 'Dijkstra is used billions of times daily — every GPS route, every network packet, every logistics delivery. Understanding it from scratch means you understand a fundamental building block of modern technology.',
    },
    {
      title: 'Network flow — modeling trade volume through routes',
      concept: `Shortest paths tell you the cheapest route, but trade networks must also handle **volume**. Each route has a **capacity** — the maximum amount of goods that can flow through it per time period. A narrow mountain pass might handle 10 camel loads per day, while a river route handles 500 boat loads. The **maximum flow problem** asks: what is the greatest total volume of goods that can flow from a source to a destination, respecting all route capacities?

The **max-flow min-cut theorem** (Ford and Fulkerson, 1956) states that the maximum flow through a network equals the minimum cut — the smallest total capacity you must remove to disconnect the source from the destination. This is a profound duality: the bottleneck of a network is exactly the thinnest "slice" that separates source from destination.

The Ford-Fulkerson algorithm finds maximum flow by repeatedly finding **augmenting paths** — routes from source to destination with available capacity — and pushing flow along them until no more augmenting paths exist. The key innovation is the **residual graph**: after pushing flow along a path, you add "backward edges" that allow the algorithm to "undo" previous flow decisions. This backtracking ability ensures the algorithm finds the global maximum, not just a local one.

Network flow has applications far beyond trade: airline scheduling (planes are flow, airports are nodes), telecommunications (data packets are flow, routers are nodes), and even matching problems (assigning students to schools, organs to patients).`,
      analogy: 'Maximum flow is like water flowing through a network of pipes. Each pipe has a diameter (capacity). No matter how much water pressure you apply at the source, the total flow is limited by the thinnest section of pipe between source and destination. The max-flow min-cut theorem says: find the narrowest cross-section through the entire network, and that is your bottleneck.',
      storyConnection: 'Assam produced vast quantities of Muga silk, but the trade volume reaching Chinese markets was limited by route capacities. The narrow passes through the Patkai hills between Imphal and Mandalay were a bottleneck — no matter how much silk was produced, only a fixed amount could cross the mountains per season. Finding alternative routes or improving pass capacity would increase total trade flow.',
      checkQuestion: 'If three parallel routes from A to B have capacities 10, 15, and 20 units, and each then connects to C through a single route of capacity 30, what is the max flow from A to C?',
      checkAnswer: 'The three parallel routes can carry 10+15+20 = 45 units from A to B. But the single route B→C has capacity 30. The bottleneck is B→C, so max flow = 30. The 45 units of parallel capacity are wasted because they converge onto a 30-unit bottleneck. This is exactly the min-cut: cutting the B→C edge disconnects the network and has capacity 30.',
      codeIntro: 'Implement the Ford-Fulkerson max flow algorithm and analyze trade flow bottlenecks.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Max flow algorithm for trade network

cities = ['Sualkuchi', 'Guwahati', 'Dhaka', 'Imphal', 'Mandalay',
          'Chittagong', 'Kunming', 'Kolkata', 'Bagan', 'Hanoi']
n = len(cities)
idx = {c: i for i, c in enumerate(cities)}

# Capacity matrix (units of goods per season)
capacity = np.zeros((n, n))
routes_cap = [
    ('Sualkuchi', 'Guwahati', 100),  # local road, high capacity
    ('Guwahati', 'Dhaka', 60),
    ('Guwahati', 'Imphal', 30),      # mountain pass, limited
    ('Dhaka', 'Chittagong', 50),
    ('Dhaka', 'Kolkata', 40),
    ('Chittagong', 'Mandalay', 25),   # sea then overland
    ('Imphal', 'Mandalay', 20),       # Patkai pass, bottleneck
    ('Mandalay', 'Kunming', 35),
    ('Mandalay', 'Bagan', 30),
    ('Mandalay', 'Hanoi', 25),
    ('Kunming', 'Hanoi', 40),
    ('Bagan', 'Hanoi', 15),
]

for c1, c2, cap in routes_cap:
    capacity[idx[c1], idx[c2]] = cap

# Ford-Fulkerson with BFS (Edmonds-Karp)
def bfs_path(capacity, flow, source, sink, n):
    """Find augmenting path using BFS."""
    visited = [False] * n
    visited[source] = True
    parent = [-1] * n
    queue = [source]

    while queue:
        u = queue.pop(0)
        for v in range(n):
            residual = capacity[u, v] - flow[u, v]
            if not visited[v] and residual > 0:
                visited[v] = True
                parent[v] = u
                if v == sink:
                    # Reconstruct path
                    path = []
                    node = sink
                    while node != source:
                        path.append(node)
                        node = parent[node]
                    path.append(source)
                    path.reverse()
                    return path
                queue.append(v)
    return None

def max_flow_ford_fulkerson(capacity, source, sink):
    n = capacity.shape[0]
    flow = np.zeros((n, n))
    total_flow = 0
    iterations = []

    while True:
        path = bfs_path(capacity, flow, source, sink, n)
        if path is None:
            break

        # Find bottleneck
        bottleneck = float('inf')
        for i in range(len(path) - 1):
            u, v = path[i], path[i+1]
            bottleneck = min(bottleneck, capacity[u, v] - flow[u, v])

        # Update flow
        for i in range(len(path) - 1):
            u, v = path[i], path[i+1]
            flow[u, v] += bottleneck
            flow[v, u] -= bottleneck  # residual

        total_flow += bottleneck
        iterations.append({
            'path': [cities[p] for p in path],
            'bottleneck': bottleneck,
            'total': total_flow,
            'flow': flow.copy()
        })

    return total_flow, flow, iterations

source = idx['Sualkuchi']
sink = idx['Kunming']
total, flow, iterations = max_flow_ford_fulkerson(capacity, source, sink)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Max Flow: Sualkuchi → Kunming = {total:.0f} units', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Network with flow
coords = {
    'Sualkuchi': (0, 3), 'Guwahati': (1.5, 3), 'Dhaka': (1.5, 1.5),
    'Imphal': (3, 4), 'Mandalay': (4.5, 3), 'Chittagong': (3, 0.5),
    'Kunming': (6.5, 3), 'Kolkata': (0, 0.5), 'Bagan': (4.5, 1),
    'Hanoi': (6.5, 1)
}

for c1, c2, cap in routes_cap:
    i, j = idx[c1], idx[c2]
    x1, y1 = coords[c1]; x2, y2 = coords[c2]
    f = max(flow[i, j], 0)
    utilization = f / cap if cap > 0 else 0

    color = '#ef4444' if utilization > 0.9 else '#f59e0b' if utilization > 0.5 else '#22c55e' if f > 0 else '#4b5563'
    axes[0, 0].annotate('', xy=(x2, y2), xytext=(x1, y1),
                         arrowprops=dict(arrowstyle='->', color=color, lw=1+f/10))
    mid_x, mid_y = (x1+x2)/2, (y1+y2)/2
    axes[0, 0].annotate(f'{f:.0f}/{cap}', (mid_x, mid_y), color='gray', fontsize=6, ha='center')

for city, (x, y) in coords.items():
    axes[0, 0].scatter(x, y, s=100, c='#60a5fa', edgecolors='white', linewidths=1, zorder=5)
    axes[0, 0].annotate(city[:6], (x, y), textcoords="offset points", xytext=(0, 8),
                         color='white', fontsize=7, ha='center', fontweight='bold')

axes[0, 0].set_title('Flow / Capacity on each route', color='white', fontsize=11)
axes[0, 0].set_xlim(-0.5, 7.5)

# Iteration progress
if iterations:
    totals = [it['total'] for it in iterations]
    axes[0, 1].step(range(1, len(totals)+1), totals, color='#22c55e', linewidth=2, where='mid')
    for i, it in enumerate(iterations):
        axes[0, 1].annotate(f'+{it["bottleneck"]:.0f}', (i+1, it['total']),
                            color='#f59e0b', fontsize=7, ha='center', va='bottom')
    axes[0, 1].set_xlabel('Iteration', color='white')
    axes[0, 1].set_ylabel('Total flow', color='white')
    axes[0, 1].set_title('Flow augmentation steps', color='white', fontsize=11)

# Route utilization
route_names = []
utilizations = []
for c1, c2, cap in routes_cap:
    f = max(flow[idx[c1], idx[c2]], 0)
    if cap > 0:
        route_names.append(f'{c1[:4]}→{c2[:4]}')
        utilizations.append(f / cap * 100)

sort_idx = np.argsort(utilizations)[::-1]
colors_bar = ['#ef4444' if u > 90 else '#f59e0b' if u > 50 else '#22c55e'
              for u in np.array(utilizations)[sort_idx]]
axes[1, 0].barh([route_names[i] for i in sort_idx],
                 [utilizations[i] for i in sort_idx],
                 color=colors_bar, alpha=0.8)
axes[1, 0].axvline(100, color='#ef4444', linestyle='--', alpha=0.5)
axes[1, 0].set_xlabel('Utilization (%)', color='white')
axes[1, 0].set_title('Route utilization (red = saturated)', color='white', fontsize=11)

# Min-cut analysis: which routes are at capacity?
axes[1, 1].axis('off')
text = "AUGMENTING PATHS FOUND:\\n\\n"
for i, it in enumerate(iterations):
    text += f"  {i+1}. {' → '.join(it['path'][:4])}...\\n"
    text += f"     Bottleneck: {it['bottleneck']:.0f}, Total: {it['total']:.0f}\\n"
text += f"\\nMax flow = Min cut = {total:.0f} units"
text += f"\\n\\nSaturated routes (min-cut candidates):"
for c1, c2, cap in routes_cap:
    f = max(flow[idx[c1], idx[c2]], 0)
    if abs(f - cap) < 0.1 and f > 0:
        text += f"\\n  {c1} → {c2}: {f:.0f}/{cap}"

axes[1, 1].text(0.05, 0.95, text, transform=axes[1, 1].transAxes,
                color='white', fontsize=8, verticalalignment='top', fontfamily='monospace')
axes[1, 1].set_title('Algorithm trace', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"Max flow from Sualkuchi to Kunming: {total:.0f} units per season")
print(f"Augmenting paths found: {len(iterations)}")`,
      challenge: 'Double the capacity of the Imphal→Mandalay route (the Patkai pass) and recompute max flow. By how much does total flow increase? Is the Patkai pass the only bottleneck, or does another route become the new limiting factor?',
      successHint: 'The max-flow min-cut theorem is one of the deepest results in combinatorial optimization. It connects flow problems to cut problems — two seemingly different questions with the same answer.',
    },
    {
      title: 'Traveling merchant problem — route optimization under constraints',
      concept: `A silk merchant starting in Sualkuchi wants to visit every major trading city exactly once and return home, minimizing total travel time. This is the **Traveling Salesman Problem** (TSP) — the most famous problem in combinatorial optimization, and one of the hardest: it is NP-hard, meaning no known algorithm solves it efficiently for large instances.

For n cities, there are (n-1)!/2 possible routes (dividing by 2 because clockwise and counterclockwise are equivalent). With just 20 cities, that is about 60 quadrillion routes — impossible to enumerate. For 50 cities, the number exceeds the number of atoms in the universe. Yet real-world logistics companies solve TSP instances with thousands of cities daily using **heuristic** and **metaheuristic** methods.

The simplest heuristic is **nearest neighbor**: always go to the closest unvisited city. It runs in O(n²) time and typically produces routes within 20-25% of optimal. Better heuristics include **2-opt** (repeatedly removing two edges and reconnecting the tour if the new route is shorter) and **simulated annealing** (randomly swapping city positions, accepting improvements always and occasional worsening moves to escape local optima).

The real merchant's problem is even harder: they must consider not just distance but also trade profit at each city, seasonal route closures, and the perishability of goods. This becomes a **multi-objective TSP with time windows** — a problem class that modern logistics companies spend billions to solve even approximately.`,
      analogy: 'TSP is like planning a vacation where you want to visit 15 European cities. You could check every possible order — but with 15 cities, there are over 43 billion orders. Instead, you use common sense: start with nearby cities, avoid backtracking, and iterate. This "common sense" is exactly what heuristic algorithms formalize.',
      storyConnection: 'Silk Route merchants did not just travel point-to-point — they planned multi-city circuits, buying goods cheap in one market and selling dear in another. A merchant leaving Sualkuchi might carry silk to Mandalay, buy rubies there, sell rubies in Kunming, buy tea, sell tea in Kolkata, and return with spices. The route optimization included not just distance but trade profit at each stop.',
      checkQuestion: 'If a nearest-neighbor heuristic produces a tour of length 120 days and the optimal tour is 100 days, what is the approximation ratio? For 30 cities, how many possible tours exist?',
      checkAnswer: 'Approximation ratio = 120/100 = 1.20 or 20% above optimal. For 30 cities: (30-1)!/2 = 29!/2 ≈ 4.42 × 10³⁰ possible tours. Even checking 1 billion tours per second would take 1.4 × 10¹⁴ years — about 10,000 times the age of the universe. Heuristics are not just convenient; they are the only option.',
      codeIntro: 'Solve the merchant routing problem using nearest neighbor, 2-opt improvement, and simulated annealing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Traveling Merchant Problem on the Silk Route

np.random.seed(42)

cities = {
    'Sualkuchi': (92.0, 26.2), 'Guwahati': (91.7, 26.1),
    'Dhaka': (90.4, 23.8), 'Mandalay': (96.1, 21.9),
    'Kunming': (102.7, 25.0), 'Kolkata': (88.4, 22.6),
    'Chittagong': (91.8, 22.3), 'Imphal': (93.9, 24.8),
    'Lhasa': (91.1, 29.7), 'Hanoi': (105.8, 21.0),
    'Bagan': (94.9, 21.2), 'Chengdu': (104.1, 30.6),
}

city_list = list(cities.keys())
coords = np.array([cities[c] for c in city_list])
n = len(city_list)

# Distance matrix (great circle approximation in days)
def travel_days(c1, c2):
    dx = (c1[0] - c2[0]) * 85  # rough km per degree at this latitude
    dy = (c1[1] - c2[1]) * 111
    km = np.sqrt(dx**2 + dy**2)
    return km / 30  # 30 km/day by caravan

dist_matrix = np.zeros((n, n))
for i in range(n):
    for j in range(n):
        dist_matrix[i, j] = travel_days(coords[i], coords[j])

def tour_length(tour):
    total = 0
    for i in range(len(tour)):
        total += dist_matrix[tour[i], tour[(i+1) % len(tour)]]
    return total

# 1. Nearest Neighbor
def nearest_neighbor(start=0):
    visited = [start]
    current = start
    for _ in range(n - 1):
        distances = dist_matrix[current].copy()
        distances[visited] = np.inf
        nearest = np.argmin(distances)
        visited.append(nearest)
        current = nearest
    return visited

nn_tour = nearest_neighbor(0)
nn_length = tour_length(nn_tour)

# 2. 2-opt improvement
def two_opt(tour):
    improved = True
    best = tour.copy()
    best_length = tour_length(best)
    history = [best_length]

    while improved:
        improved = False
        for i in range(1, n - 1):
            for j in range(i + 1, n):
                new_tour = best[:i] + best[i:j+1][::-1] + best[j+1:]
                new_length = tour_length(new_tour)
                if new_length < best_length - 0.01:
                    best = new_tour
                    best_length = new_length
                    improved = True
                    history.append(best_length)

    return best, best_length, history

opt2_tour, opt2_length, opt2_history = two_opt(nn_tour.copy())

# 3. Simulated Annealing
def simulated_annealing(n_iter=10000, T_start=50, T_end=0.1):
    tour = list(range(n))
    np.random.shuffle(tour)
    cost = tour_length(tour)
    best_tour = tour.copy()
    best_cost = cost
    history = [cost]

    T = T_start
    cooling = (T_end / T_start) ** (1 / n_iter)

    for iteration in range(n_iter):
        # Random swap
        i, j = sorted(np.random.choice(n, 2, replace=False))
        new_tour = tour[:i] + tour[i:j+1][::-1] + tour[j+1:]
        new_cost = tour_length(new_tour)
        delta = new_cost - cost

        if delta < 0 or np.random.rand() < np.exp(-delta / T):
            tour = new_tour
            cost = new_cost
            if cost < best_cost:
                best_tour = tour.copy()
                best_cost = cost

        T *= cooling
        if iteration % 50 == 0:
            history.append(best_cost)

    return best_tour, best_cost, history

sa_tour, sa_length, sa_history = simulated_annealing()

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Traveling Merchant: Silk Route TSP', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

def plot_tour(ax, tour, title, length, color):
    for i in range(len(tour)):
        c1 = coords[tour[i]]
        c2 = coords[tour[(i+1) % len(tour)]]
        ax.plot([c1[0], c2[0]], [c1[1], c2[1]], color=color, linewidth=1.5, alpha=0.7)
        ax.annotate('', xy=c2, xytext=c1,
                     arrowprops=dict(arrowstyle='->', color=color, lw=1))

    for i, (city, (x, y)) in enumerate(cities.items()):
        ax.scatter(x, y, s=60, c='#f59e0b', edgecolors='white', linewidths=0.5, zorder=5)
        ax.annotate(city[:4], (x, y), textcoords="offset points", xytext=(3, 3),
                     color='white', fontsize=6)
    ax.set_title(f'{title}: {length:.1f} days', color='white', fontsize=10)

plot_tour(axes[0, 0], nn_tour, 'Nearest Neighbor', nn_length, '#ef4444')
plot_tour(axes[0, 1], opt2_tour, '2-opt Improved', opt2_length, '#22c55e')
plot_tour(axes[0, 2], sa_tour, 'Simulated Annealing', sa_length, '#3b82f6')

# Convergence comparison
axes[1, 0].plot(opt2_history, color='#22c55e', linewidth=2, label='2-opt')
axes[1, 0].set_xlabel('Improvement steps', color='white')
axes[1, 0].set_ylabel('Tour length (days)', color='white')
axes[1, 0].set_title('2-opt convergence', color='white', fontsize=11)

axes[1, 1].plot(sa_history, color='#3b82f6', linewidth=2, label='SA')
axes[1, 1].set_xlabel('Iterations (×50)', color='white')
axes[1, 1].set_ylabel('Best tour length (days)', color='white')
axes[1, 1].set_title('Simulated annealing convergence', color='white', fontsize=11)

# Method comparison
methods = ['Nearest\\nNeighbor', '2-opt', 'Simulated\\nAnnealing']
lengths = [nn_length, opt2_length, sa_length]
colors_bar = ['#ef4444', '#22c55e', '#3b82f6']
axes[1, 2].bar(methods, lengths, color=colors_bar, alpha=0.8)
best_len = min(lengths)
for i, l in enumerate(lengths):
    pct = (l - best_len) / best_len * 100
    axes[1, 2].text(i, l + 1, f'{pct:.1f}%\\nabove best' if pct > 0 else 'BEST',
                     ha='center', color='white', fontsize=8)
axes[1, 2].set_ylabel('Tour length (days)', color='white')
axes[1, 2].set_title('Method comparison', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"Results:")
print(f"  Nearest Neighbor: {nn_length:.1f} days")
print(f"  2-opt improved:   {opt2_length:.1f} days ({(nn_length-opt2_length)/nn_length*100:.1f}% better)")
print(f"  Simulated Anneal: {sa_length:.1f} days ({(nn_length-sa_length)/nn_length*100:.1f}% better)")
print(f"  Possible tours:   {np.math.factorial(n-1)//2:,}")`,
      challenge: 'Add trade profit to each city: when you visit a city, you earn profit proportional to its trade volume. Modify the objective to maximize (total profit - travel cost). Does the optimal route change?',
      successHint: 'TSP is NP-hard — no one knows a fast exact algorithm. But heuristics find near-optimal solutions quickly. This gap between theory (it is hard) and practice (we can solve it well enough) is a recurring theme in computer science.',
    },
    {
      title: 'Network resilience — how trade networks survive disruptions',
      concept: `Real trade networks face constant disruptions: wars close routes, monsoons wash out roads, banditry makes passages dangerous, and political changes impose tariffs. A **resilient** network continues functioning despite failures. Network resilience is quantified by how much the network's performance degrades as nodes or edges are removed.

Two types of failure matter: **random failures** (a random route washes out) and **targeted attacks** (an enemy deliberately blocks the most important route). Networks with heterogeneous degree distributions (a few hubs with many connections and many nodes with few) are robust to random failures but vulnerable to targeted attacks on hubs. Removing a random node rarely hits a hub, but deliberately targeting the highest-degree node can fragment the network.

The **robustness coefficient** R is defined as the normalized sum of the size of the largest connected component as nodes are removed: R = (1/N) × Σ s(i)/N, where s(i) is the fraction of nodes in the largest component after removing i nodes. R ranges from 0 (extremely fragile) to 0.5 (maximum possible for any graph). Well-designed networks achieve R > 0.3 through **redundancy** — multiple paths between critical node pairs.

Modern supply chain design uses these metrics explicitly. After the 2011 Thailand floods disrupted global hard drive production, companies redesigned supply networks to increase resilience — adding redundant suppliers, diversifying shipping routes, and maintaining strategic inventories at hub nodes.`,
      analogy: 'Network resilience is like the stability of a spider web. A web with many crossing threads can lose several threads and still catch flies — the load redistributes through alternative paths. But cut the anchor threads (hub nodes) and the entire web collapses. A resilient network, like a good web, has many redundant connections so that no single failure is catastrophic.',
      storyConnection: 'The Silk Route persisted for over 1500 years precisely because it was not one route but a network of alternatives. When the Persians blocked one path, merchants shifted to another. When monsoons closed the Assam-Myanmar passes, river routes through Bengal remained open. The network survived because no single disruption could sever all connections between East and West.',
      checkQuestion: 'A star network (one central hub connected to 10 outer nodes) has 10 edges. A ring network (10 nodes each connected to two neighbors) also has 10 edges. Which is more resilient to (a) random failures and (b) targeted attacks?',
      checkAnswer: '(a) Random failure: The star survives most random failures (9/10 chance the random node is not the hub, and removing an outer node only disconnects that one node). The ring: removing any node breaks the ring into a path, but all nodes remain connected. Ring is slightly more resilient to random failures. (b) Targeted attack: Removing the star hub disconnects all 10 outer nodes. Removing the highest-degree node in a ring (all have degree 2, so it is random) only breaks the ring into a path. Ring is dramatically more resilient to targeted attacks.',
      codeIntro: 'Simulate network disruptions and measure how the Silk Route trade network degrades under random failures versus targeted attacks.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Network resilience analysis

np.random.seed(42)

cities = ['Sualkuchi', 'Guwahati', 'Dhaka', 'Imphal', 'Mandalay',
          'Chittagong', 'Kunming', 'Kolkata', 'Bagan', 'Hanoi',
          'Lhasa', 'Chengdu']
n = len(cities)
idx = {c: i for i, c in enumerate(cities)}

routes = [
    ('Sualkuchi', 'Guwahati'), ('Guwahati', 'Dhaka'),
    ('Guwahati', 'Imphal'), ('Guwahati', 'Lhasa'),
    ('Dhaka', 'Kolkata'), ('Dhaka', 'Chittagong'),
    ('Chittagong', 'Mandalay'), ('Imphal', 'Mandalay'),
    ('Mandalay', 'Bagan'), ('Mandalay', 'Kunming'),
    ('Mandalay', 'Hanoi'), ('Kunming', 'Chengdu'),
    ('Kunming', 'Hanoi'), ('Lhasa', 'Chengdu'),
    ('Bagan', 'Hanoi'),
]

def build_adj(n, routes_list, removed_nodes=set()):
    adj = np.zeros((n, n))
    for c1, c2 in routes_list:
        i, j = idx[c1], idx[c2]
        if i not in removed_nodes and j not in removed_nodes:
            adj[i, j] = 1
            adj[j, i] = 1
    return adj

def largest_component(adj, n, removed=set()):
    """Find size of largest connected component via BFS."""
    visited = set()
    max_size = 0
    active = set(range(n)) - removed

    for start in active:
        if start in visited:
            continue
        # BFS
        queue = [start]
        visited.add(start)
        size = 0
        while queue:
            node = queue.pop(0)
            size += 1
            for neighbor in range(n):
                if neighbor not in visited and neighbor in active and adj[node, neighbor] > 0:
                    visited.add(neighbor)
                    queue.append(neighbor)
        max_size = max(max_size, size)

    return max_size

# Compute node metrics
adj_full = build_adj(n, routes, set())
degrees = np.sum(adj_full > 0, axis=1)

# Betweenness (simplified via shortest paths)
betweenness = np.zeros(n)
for i in range(n):
    for j in range(n):
        if i != j:
            # BFS shortest path
            visited = {i}
            parent = {i: None}
            queue = [i]
            found = False
            while queue and not found:
                node = queue.pop(0)
                for nb in range(n):
                    if nb not in visited and adj_full[node, nb] > 0:
                        visited.add(nb)
                        parent[nb] = node
                        queue.append(nb)
                        if nb == j:
                            found = True
                            break
            if found:
                node = j
                while parent.get(node) is not None and parent[node] != i:
                    node = parent[node]
                    betweenness[node] += 1

betweenness = betweenness / max(betweenness.max(), 1)

# Simulation: remove nodes one at a time
n_active = len(cities)
random_trials = 50

# Random removal
random_components = np.zeros((n_active, random_trials))
for trial in range(random_trials):
    removed = set()
    order = np.random.permutation(n)
    for k in range(n_active):
        adj = build_adj(n, routes, removed)
        random_components[k, trial] = largest_component(adj, n, removed) / (n - k)
        removed.add(order[k])

random_mean = np.mean(random_components, axis=1)
random_std = np.std(random_components, axis=1)

# Targeted: remove by degree (highest first)
degree_order = np.argsort(degrees)[::-1]
targeted_degree = []
removed = set()
for k in range(n_active):
    adj = build_adj(n, routes, removed)
    targeted_degree.append(largest_component(adj, n, removed) / max(n - k, 1))
    removed.add(degree_order[k])

# Targeted: remove by betweenness
between_order = np.argsort(betweenness)[::-1]
targeted_between = []
removed = set()
for k in range(n_active):
    adj = build_adj(n, routes, removed)
    targeted_between.append(largest_component(adj, n, removed) / max(n - k, 1))
    removed.add(between_order[k])

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Network Resilience: Silk Route Under Disruption', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Resilience curves
x = np.arange(n_active) / n_active * 100
axes[0, 0].plot(x, random_mean, color='#3b82f6', linewidth=2, label='Random failure')
axes[0, 0].fill_between(x, random_mean - random_std, random_mean + random_std,
                          alpha=0.2, color='#3b82f6')
axes[0, 0].plot(x, targeted_degree, color='#ef4444', linewidth=2, label='Targeted (degree)')
axes[0, 0].plot(x, targeted_between, color='#f59e0b', linewidth=2, label='Targeted (betweenness)')
axes[0, 0].set_xlabel('Nodes removed (%)', color='white')
axes[0, 0].set_ylabel('Largest component fraction', color='white')
axes[0, 0].set_title('Network fragmentation under attack', color='white', fontsize=11)
axes[0, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Robustness coefficients
R_random = np.mean(random_mean) / n_active * n_active
R_degree = np.sum(targeted_degree) / n_active
R_between = np.sum(targeted_between) / n_active

bars = axes[0, 1].bar(['Random\\nfailure', 'Targeted\\n(degree)', 'Targeted\\n(betweenness)'],
                       [R_random, R_degree, R_between],
                       color=['#3b82f6', '#ef4444', '#f59e0b'], alpha=0.8)
axes[0, 1].set_ylabel('Robustness coefficient R', color='white')
axes[0, 1].set_title('Robustness comparison', color='white', fontsize=11)

# Node importance ranking
sort_idx = np.argsort(degrees + betweenness * max(degrees))[::-1]
labels = [cities[i][:8] for i in sort_idx]
x_pos = np.arange(n)
width = 0.35
axes[1, 0].barh(x_pos - width/2, degrees[sort_idx], width, color='#3b82f6', label='Degree')
axes[1, 0].barh(x_pos + width/2, betweenness[sort_idx] * max(degrees), width,
                 color='#f59e0b', label='Betweenness (scaled)')
axes[1, 0].set_yticks(x_pos)
axes[1, 0].set_yticklabels(labels, color='white', fontsize=7)
axes[1, 0].set_xlabel('Importance score', color='white')
axes[1, 0].set_title('Node importance ranking', color='white', fontsize=11)
axes[1, 0].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# What-if: adding redundant routes
redundant_routes_options = [
    [('Kolkata', 'Imphal')],
    [('Kolkata', 'Imphal'), ('Dhaka', 'Bagan')],
    [('Kolkata', 'Imphal'), ('Dhaka', 'Bagan'), ('Lhasa', 'Kunming')],
]

for extra in redundant_routes_options:
    all_routes = routes + extra
    removed_set = set()
    resilience = []
    for k in range(n_active):
        adj = build_adj(n, all_routes, removed_set)
        resilience.append(largest_component(adj, n, removed_set) / max(n - k, 1))
        removed_set.add(degree_order[k])
    axes[1, 1].plot(x, resilience, linewidth=2,
                     label=f'+{len(extra)} routes')

# Original for comparison
axes[1, 1].plot(x, targeted_degree, '--', color='#ef4444', linewidth=1.5, label='Original')
axes[1, 1].set_xlabel('Nodes removed (%)', color='white')
axes[1, 1].set_ylabel('Largest component fraction', color='white')
axes[1, 1].set_title('Effect of adding redundant routes', color='white', fontsize=11)
axes[1, 1].legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print(f"Resilience analysis:")
print(f"  Most critical node: {cities[sort_idx[0]]} (degree={int(degrees[sort_idx[0]])}, betweenness={betweenness[sort_idx[0]]:.2f})")
print(f"  Robustness: random={R_random:.3f}, targeted(degree)={R_degree:.3f}")
print(f"  Network is {R_random/R_degree:.1f}x more resilient to random vs targeted failures")`,
      challenge: 'Design the minimum number of redundant routes needed to make the network survive the removal of any single node. This is the "2-node-connected" property. How many edges must you add?',
      successHint: 'Network resilience is one of the most important concepts in modern infrastructure design. Every power grid, internet backbone, and supply chain must be designed to survive failures — and graph theory provides the tools to analyze and improve resilience.',
    },
    {
      title: 'Economic network effects — trade creates wealth disproportionately',
      concept: `Trade networks exhibit **network effects** — the value of participating in the network increases as the network grows. A city connected to 2 trading partners has limited options; a city connected to 10 has exponentially more trade combinations. This creates a **rich-get-richer** dynamic: well-connected cities attract more merchants, which creates more routes, which attracts even more merchants.

Mathematically, this follows **preferential attachment** (Barabasi-Albert model): new routes are more likely to connect to cities that already have many connections. The probability of a new route connecting to city i is proportional to k_i / Σk_j, where k_i is the current degree of city i. This simple rule produces **scale-free networks** — networks where the degree distribution follows a power law P(k) ~ k^(-γ), with γ typically between 2 and 3.

The economic consequence is stark: the top 20% of cities in a scale-free trade network control 80% of the trade volume (a manifestation of the Pareto principle). Hub cities accumulate wealth through **intermediation** — taking a commission on goods passing through. A city that controls a critical route segment can extract rents from all trade flowing through it, even without producing anything. This is the economic power of position in a network.

Network economics also explains why trade routes create **agglomeration effects**: manufacturing clusters near hubs because proximity to transportation reduces costs. Sualkuchi became a silk weaving center partly because of its proximity to Guwahati, a trade hub — not because the local conditions were uniquely suited to silk production.`,
      analogy: 'Network effects in trade are like social media: the first person on a platform has no one to connect with. The millionth person has a million potential connections. The platform becomes more valuable to each user as it grows. Similarly, a trade network with 100 cities is disproportionately more valuable than one with 10 — not 10x more, but potentially 100x more, because the number of possible trade pairs grows quadratically.',
      storyConnection: 'The Silk Route did not just move goods — it concentrated wealth in hub cities. Samarkand, Constantinople, and Alexandria became fabulously wealthy not from their own production but from their network position. In the Assam context, Guwahati grew from a small settlement to a major city largely because it sat at the confluence of river, road, and hill trade routes — a hub in the network.',
      checkQuestion: 'In a network of 100 cities following preferential attachment, if the top hub has 30 connections and the bottom 50 cities have 2 connections each, what fraction of all connections does the top hub control?',
      checkAnswer: 'Total connections in the bottom 50: 50 × 2 = 100. The top hub has 30. If the remaining 49 cities average 5 connections each: 49 × 5 = 245. Total degree sum ≈ 30 + 245 + 100 = 375, meaning total edges ≈ 375/2 = 187.5. The hub controls 30/375 = 8% of all connection endpoints, but it participates in 30/187.5 = 16% of all routes. Despite being 1% of nodes, it handles a disproportionate share of traffic.',
      codeIntro: 'Simulate the growth of a trade network through preferential attachment and analyze the resulting wealth distribution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Network growth simulation with economic effects

np.random.seed(42)

def grow_network(n_cities, n_initial=3, n_routes_per_new=2):
    """Grow a trade network via preferential attachment."""
    adj = np.zeros((n_cities, n_cities))
    # Initial complete graph
    for i in range(n_initial):
        for j in range(i+1, n_initial):
            adj[i, j] = adj[j, i] = 1

    growth_history = []

    for new_city in range(n_initial, n_cities):
        degrees = np.sum(adj[:new_city, :new_city], axis=1)
        total_degree = degrees.sum()
        if total_degree == 0:
            probs = np.ones(new_city) / new_city
        else:
            probs = degrees / total_degree

        # Connect to n_routes_per_new existing cities
        targets = np.random.choice(new_city, size=min(n_routes_per_new, new_city),
                                    replace=False, p=probs)
        for t in targets:
            adj[new_city, t] = adj[t, new_city] = 1

        growth_history.append(np.sum(adj > 0, axis=1)[:new_city+1].copy())

    return adj, growth_history

# Grow network
n_cities = 50
adj, history = grow_network(n_cities)
degrees = np.sum(adj > 0, axis=1)

# Economic simulation: trade volume and wealth
def simulate_trade(adj, n_years=100):
    n = adj.shape[0]
    wealth = np.ones(n) * 10  # initial wealth
    trade_volume = np.zeros(n)
    wealth_history = np.zeros((n_years, n))

    for year in range(n_years):
        # Each city trades with connected cities
        for i in range(n):
            neighbors = np.where(adj[i] > 0)[0]
            for j in neighbors:
                # Trade volume proportional to combined wealth
                volume = 0.01 * (wealth[i] + wealth[j]) / 2
                # Hub commission: proportional to betweenness
                commission = volume * 0.05  # 5% intermediation fee
                wealth[i] += commission * degrees[i] / max(degrees.max(), 1)
                trade_volume[i] += volume

        # Growth from trade
        wealth *= (1 + 0.02 * degrees / degrees.max())  # connected cities grow faster
        wealth_history[year] = wealth.copy()

    return wealth, trade_volume, wealth_history

wealth, trade_vol, wealth_hist = simulate_trade(adj)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Economic Network Effects on the Silk Route', color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Degree distribution (log-log for power law check)
degree_values, degree_counts = np.unique(degrees, return_counts=True)
axes[0, 0].scatter(degree_values, degree_counts / n_cities, c='#60a5fa', s=40,
                     edgecolors='white', linewidths=0.5)
# Power law fit
if len(degree_values) > 3:
    log_k = np.log(degree_values[degree_values > 0])
    log_p = np.log(degree_counts[degree_values > 0] / n_cities)
    coeffs = np.polyfit(log_k, log_p, 1)
    fit_x = np.linspace(min(log_k), max(log_k), 50)
    axes[0, 0].plot(np.exp(fit_x), np.exp(np.polyval(coeffs, fit_x)),
                     '--', color='#ef4444', linewidth=2, label=f'γ = {-coeffs[0]:.2f}')

axes[0, 0].set_xscale('log')
axes[0, 0].set_yscale('log')
axes[0, 0].set_xlabel('Degree k', color='white')
axes[0, 0].set_ylabel('P(k)', color='white')
axes[0, 0].set_title('Degree distribution (power law?)', color='white', fontsize=11)
axes[0, 0].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Wealth vs degree
axes[0, 1].scatter(degrees, wealth, c='#f59e0b', s=30, alpha=0.7, edgecolors='white', linewidths=0.3)
z = np.polyfit(degrees, wealth, 2)
x_fit = np.linspace(min(degrees), max(degrees), 50)
axes[0, 1].plot(x_fit, np.polyval(z, x_fit), '--', color='#ef4444', linewidth=2)
axes[0, 1].set_xlabel('Degree (connections)', color='white')
axes[0, 1].set_ylabel('Final wealth', color='white')
axes[0, 1].set_title('Wealth scales super-linearly with connections', color='white', fontsize=11)

# Wealth distribution (Lorenz curve)
sorted_wealth = np.sort(wealth)
cum_wealth = np.cumsum(sorted_wealth) / np.sum(sorted_wealth)
cum_pop = np.arange(1, n_cities + 1) / n_cities

axes[0, 2].plot(cum_pop, cum_wealth, color='#22c55e', linewidth=2, label='Network economy')
axes[0, 2].plot([0, 1], [0, 1], '--', color='gray', linewidth=1, label='Perfect equality')
axes[0, 2].fill_between(cum_pop, cum_wealth, cum_pop, alpha=0.2, color='#ef4444')
# Gini coefficient
gini = np.sum(cum_pop - cum_wealth) / n_cities / 0.5
axes[0, 2].set_xlabel('Cumulative population fraction', color='white')
axes[0, 2].set_ylabel('Cumulative wealth fraction', color='white')
axes[0, 2].set_title(f'Lorenz curve (Gini = {gini:.3f})', color='white', fontsize=11)
axes[0, 2].legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Wealth evolution over time
top_5 = np.argsort(degrees)[-5:]
for i in top_5:
    axes[1, 0].plot(wealth_hist[:, i], linewidth=1.5, label=f'City {i} (k={int(degrees[i])})')
# Also plot a low-degree city
low = np.argmin(degrees)
axes[1, 0].plot(wealth_hist[:, low], '--', color='gray', linewidth=1.5,
                 label=f'City {low} (k={int(degrees[low])})')
axes[1, 0].set_xlabel('Year', color='white')
axes[1, 0].set_ylabel('Wealth', color='white')
axes[1, 0].set_title('Wealth divergence over time', color='white', fontsize=11)
axes[1, 0].legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Top 20% vs bottom 80% wealth share
top_20_pct = int(n_cities * 0.2)
wealth_sorted = np.sort(wealth)[::-1]
top_20_share = np.sum(wealth_sorted[:top_20_pct]) / np.sum(wealth_sorted) * 100
bottom_80_share = 100 - top_20_share

axes[1, 1].pie([top_20_share, bottom_80_share],
               labels=[f'Top 20%\\n({top_20_share:.1f}%)', f'Bottom 80%\\n({bottom_80_share:.1f}%)'],
               colors=['#ef4444', '#3b82f6'], startangle=90,
               textprops={'color': 'white', 'fontsize': 10})
axes[1, 1].set_title('Wealth concentration (Pareto effect)', color='white', fontsize=11)

# Network visualization colored by wealth
theta = np.linspace(0, 2 * np.pi, n_cities, endpoint=False)
x_pos = np.cos(theta)
y_pos = np.sin(theta)

for i in range(n_cities):
    for j in range(i+1, n_cities):
        if adj[i, j] > 0:
            axes[1, 2].plot([x_pos[i], x_pos[j]], [y_pos[i], y_pos[j]],
                             color='gray', alpha=0.1, linewidth=0.3)

sizes = 20 + degrees * 15
colors_nodes = plt.cm.YlOrRd(wealth / wealth.max())
axes[1, 2].scatter(x_pos, y_pos, s=sizes, c=colors_nodes, edgecolors='white',
                    linewidths=0.3, zorder=5)
axes[1, 2].set_title('Network (size=degree, color=wealth)', color='white', fontsize=11)
axes[1, 2].set_xlim(-1.3, 1.3)
axes[1, 2].set_ylim(-1.3, 1.3)

plt.tight_layout()
plt.show()

print(f"Network economics summary:")
print(f"  Cities: {n_cities}, Edges: {int(np.sum(adj > 0) / 2)}")
print(f"  Degree range: {int(min(degrees))} - {int(max(degrees))}")
print(f"  Gini coefficient: {gini:.3f} (0=equal, 1=total inequality)")
print(f"  Top 20% control {top_20_share:.1f}% of wealth")
print(f"  Wealth-degree correlation: {np.corrcoef(degrees, wealth)[0,1]:.3f}")`,
      challenge: 'Implement a "trade tax" policy: the top 5 hubs pay 10% of their trade income to a common fund redistributed equally to all cities. How much does this reduce the Gini coefficient? Does it reduce total network wealth?',
      successHint: 'Network economics explains why some cities prosper and others stagnate — position in the network matters as much as productivity. This insight drives modern economic geography, urban planning, and infrastructure investment decisions.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Trade Network Graph Theory
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Graphs, shortest paths, flow & network economics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for network analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
