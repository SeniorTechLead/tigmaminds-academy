import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function ElephantCorridorLevel3() {
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
      title: 'Wildlife corridors & connectivity — why islands of habitat are not enough',
      concept: `A national park surrounded by farmland is an ecological island. The animals inside are cut off from other populations, and small isolated populations are doomed: inbreeding reduces genetic diversity, random events (disease, drought) can wipe out the entire group, and species that need large ranges simply cannot survive.

**Wildlife corridors** are strips of habitat that connect isolated patches, allowing animals to move between them. For elephants, a corridor might be a 2-km-wide band of forest connecting Kaziranga to the Karbi hills. Corridors transform isolated islands into a connected **network**.

The science behind corridors uses **graph theory**: each habitat patch is a **node**, each corridor is an **edge**, and the quality of a corridor is a **weight** (based on width, vegetation density, human disturbance). Connectivity metrics from graph theory — like the number of connected components, graph diameter, and average path length — quantify how well-connected a landscape is.

Key terms:
- **Patch**: a discrete area of suitable habitat
- **Matrix**: the inhospitable landscape between patches (farmland, roads, cities)
- **Corridor**: a linear habitat feature connecting patches
- **Stepping stone**: a small patch that breaks a long gap into manageable segments`,
      analogy: 'Think of habitat patches as villages and corridors as the roads between them. A village with no roads is isolated — no trade, no marriage between families, no help during disasters. Build a single road and the village joins the network. The road does not need to be a highway; even a narrow path matters. Corridor ecology asks: which roads should we build first to connect the most villages?',
      storyConnection: 'The Elephant Corridor tells of elephants that once roamed freely across Assam. As tea gardens and settlements fragmented their range, ancient migration routes became narrow corridors — sometimes just a few hundred meters of forest between hostile territory. The elephants remember these paths across generations. Losing a single corridor can split a population permanently.',
      checkQuestion: 'Why is a corridor between two large habitat patches more valuable than the same-width corridor between two small patches?',
      checkAnswer: 'Large patches support larger populations with more genetic diversity. Connecting them creates a larger effective population that is more resilient. Connecting two small patches might not save either population if both are below the minimum viable population size. Corridor value depends on what it connects, not just on the corridor itself.',
      codeIntro: 'Model a landscape as a graph of habitat patches connected by corridors. Compute connectivity metrics to evaluate how well the network supports wildlife movement.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Create a landscape with 12 habitat patches
n_patches = 12
# Patch positions (x, y) in km
patch_x = np.array([5, 15, 25, 40, 55, 65, 10, 30, 50, 70, 20, 60])
patch_y = np.array([30, 45, 20, 35, 45, 25, 10, 55, 15, 40, 60, 55])
# Patch areas (km^2) - determines population capacity
patch_area = np.array([50, 120, 30, 80, 60, 45, 25, 90, 35, 70, 40, 55])

# Define existing corridors (pairs of patches, with quality score 0-1)
corridors = [
    (0, 1, 0.8),   # patch 0-1, good forest corridor
    (1, 2, 0.5),   # moderate quality
    (2, 3, 0.3),   # degraded
    (3, 4, 0.7),
    (4, 5, 0.6),
    (0, 6, 0.4),
    (7, 10, 0.9),  # excellent corridor
    (8, 5, 0.5),
    (9, 5, 0.8),
    (4, 11, 0.6),
]

# Build adjacency matrix
adj = np.zeros((n_patches, n_patches))
for i, j, w in corridors:
    adj[i][j] = w
    adj[j][i] = w

# --- Graph analysis functions ---
def find_connected_components(adj_matrix):
    n = len(adj_matrix)
    visited = [False] * n
    components = []

    def bfs(start):
        queue = [start]
        component = []
        visited[start] = True
        while queue:
            node = queue.pop(0)
            component.append(node)
            for neighbor in range(n):
                if adj_matrix[node][neighbor] > 0 and not visited[neighbor]:
                    visited[neighbor] = True
                    queue.append(neighbor)
        return component

    for i in range(n):
        if not visited[i]:
            components.append(bfs(i))
    return components

def shortest_paths_bfs(adj_matrix):
    """BFS-based shortest paths (hop count, ignoring weights)."""
    n = len(adj_matrix)
    dist = np.full((n, n), np.inf)
    np.fill_diagonal(dist, 0)

    for start in range(n):
        queue = [start]
        visited = {start}
        d = 0
        while queue:
            next_queue = []
            d += 1
            for node in queue:
                for neighbor in range(n):
                    if adj_matrix[node][neighbor] > 0 and neighbor not in visited:
                        visited.add(neighbor)
                        dist[start][neighbor] = d
                        next_queue.append(neighbor)
            queue = next_queue
    return dist

components = find_connected_components(adj)
dist_matrix = shortest_paths_bfs(adj)

# Connectivity metrics
n_components = len(components)
component_sizes = [len(c) for c in components]

# Graph diameter (longest shortest path within connected nodes)
finite_dists = dist_matrix[dist_matrix < np.inf]
finite_dists = finite_dists[finite_dists > 0]
diameter = int(np.max(finite_dists)) if len(finite_dists) > 0 else 0

# Average path length (among connected pairs)
avg_path = np.mean(finite_dists) if len(finite_dists) > 0 else 0

# Degree of each patch
degrees = np.sum(adj > 0, axis=1)

# --- Visualization ---
fig, axes = plt.subplots(1, 3, figsize=(16, 6))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Landscape map
ax = axes[0]
ax.set_facecolor('#111827')
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']
for idx, comp in enumerate(components):
    color = colors[idx % len(colors)]
    for p in comp:
        circle = plt.Circle((patch_x[p], patch_y[p]), np.sqrt(patch_area[p]) * 0.8,
                           color=color, alpha=0.3)
        ax.add_patch(circle)
        ax.plot(patch_x[p], patch_y[p], 'o', color=color, markersize=8)
        ax.text(patch_x[p] + 1.5, patch_y[p] + 1.5, str(p), color='white', fontsize=8)

for i, j, w in corridors:
    ax.plot([patch_x[i], patch_x[j]], [patch_y[i], patch_y[j]],
            '-', color='white', alpha=w, linewidth=w * 4)

ax.set_xlim(-5, 80)
ax.set_ylim(-5, 70)
ax.set_xlabel('km', color='white')
ax.set_ylabel('km', color='white')
ax.set_title('Habitat patches & corridors', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 2: Degree distribution
ax = axes[1]
ax.set_facecolor('#111827')
ax.bar(range(n_patches), degrees, color='#22c55e', edgecolor='none')
ax.set_xlabel('Patch ID', color='white')
ax.set_ylabel('Number of corridors', color='white')
ax.set_title('Patch connectivity (degree)', color='white', fontsize=11)
ax.tick_params(colors='gray')
for i, d in enumerate(degrees):
    ax.text(i, d + 0.1, str(int(d)), ha='center', color='white', fontsize=8)

# Plot 3: Distance matrix heatmap
ax = axes[2]
ax.set_facecolor('#111827')
display_dist = dist_matrix.copy()
display_dist[display_dist == np.inf] = -1
im = ax.imshow(display_dist, cmap='YlOrRd_r', aspect='auto')
ax.set_xlabel('Patch', color='white')
ax.set_ylabel('Patch', color='white')
ax.set_title('Shortest path distances (hops)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, label='Hops (-1 = disconnected)')

plt.tight_layout()
plt.show()

print(f"Landscape: {n_patches} patches, {len(corridors)} corridors")
print(f"Connected components: {n_components}")
for i, comp in enumerate(components):
    print(f"  Component {i}: patches {comp} (total area: {sum(patch_area[p] for p in comp)} km²)")
print(f"Graph diameter: {diameter} hops")
print(f"Average path length: {avg_path:.1f} hops")
print(f"Most connected patch: {int(np.argmax(degrees))} ({int(max(degrees))} corridors)")
print()
print("Patches 7 and 10 are isolated from the main network.")
print("A single corridor connecting patch 7 to patch 1 would merge two components.")`,
      challenge: 'Add a new corridor connecting patch 7 to patch 1. Recompute all metrics. How much does a single corridor change the landscape connectivity? What if you instead connected patch 10 to patch 2?',
      successHint: 'Graph theory turns vague statements like "the landscape is fragmented" into precise, measurable quantities. Conservation planners use exactly these metrics to prioritize which corridors to protect or restore.',
    },
    {
      title: 'Graph theory in ecology — centrality, betweenness, and bottleneck detection',
      concept: `Not all patches in a habitat network are equal. Some are **hubs** that connect many others. Some are **bridges** whose removal would split the network. Graph centrality metrics identify these critical nodes.

**Degree centrality**: the number of corridors a patch has. High degree = well-connected hub.

**Betweenness centrality**: how many shortest paths pass through a patch. A patch with high betweenness is a bottleneck — if it is destroyed, many patch-pairs lose their connection. This is the most important metric for conservation prioritization.

**Closeness centrality**: the inverse of average distance to all other patches. High closeness = the patch can reach everything quickly.

**Eigenvector centrality**: being connected to well-connected patches matters more than raw connections. A patch connected to three hubs is more central than one connected to three dead-ends. Google's PageRank is a variant of this.

These metrics map directly to conservation priorities:
- Protect patches with high betweenness (bottlenecks)
- Restore corridors that reduce the diameter of the graph
- Identify patches where targeted intervention has maximum impact`,
      analogy: 'Think of an airport network. Delhi has high degree centrality (many routes). A small regional airport that is the only connection between northeast India and the rest of the country has high betweenness centrality — close it, and an entire region is cut off. Betweenness finds those critical chokepoints that raw connection counts miss.',
      storyConnection: 'In the story, there is one narrow strip of forest between tea gardens that the entire elephant population depends on. That strip is the highest-betweenness edge in the corridor network. The elephants know this — they have used it for generations. But the tea garden owners see only a strip of "unused" land. Betweenness centrality quantifies why that strip matters more than a much larger but redundant forest patch.',
      checkQuestion: 'A patch has degree centrality of 5 but betweenness centrality of 0. How is this possible?',
      checkAnswer: 'The patch is connected to 5 neighbors, but none of those neighbors use it as a transit route. This happens when all 5 neighbors are also directly connected to each other — they can reach each other without going through this patch. It is a well-connected dead-end, part of a dense cluster. Betweenness identifies transit hubs, not just popular nodes.',
      codeIntro: 'Compute degree, betweenness, and closeness centrality for a habitat network and identify which patches are critical conservation priorities.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Same landscape as Lesson 1 but with a few more corridors
n_patches = 12
patch_x = np.array([5, 15, 25, 40, 55, 65, 10, 30, 50, 70, 20, 60])
patch_y = np.array([30, 45, 20, 35, 45, 25, 10, 55, 15, 40, 60, 55])
patch_area = np.array([50, 120, 30, 80, 60, 45, 25, 90, 35, 70, 40, 55])

corridors = [
    (0, 1, 0.8), (1, 2, 0.5), (2, 3, 0.3), (3, 4, 0.7),
    (4, 5, 0.6), (0, 6, 0.4), (7, 10, 0.9), (8, 5, 0.5),
    (9, 5, 0.8), (4, 11, 0.6), (1, 7, 0.6), (3, 8, 0.4),
]

adj = np.zeros((n_patches, n_patches))
for i, j, w in corridors:
    adj[i][j] = w
    adj[j][i] = w

# --- Centrality computations ---
# Degree centrality
degree = np.sum(adj > 0, axis=1).astype(float)
degree_centrality = degree / (n_patches - 1)

# Shortest paths via BFS
def all_shortest_paths(adj_matrix):
    n = len(adj_matrix)
    dist = np.full((n, n), np.inf)
    np.fill_diagonal(dist, 0)
    # Also track number of shortest paths and predecessors
    n_paths = np.zeros((n, n))
    np.fill_diagonal(n_paths, 1)

    for src in range(n):
        queue = [src]
        visited = {src}
        while queue:
            next_q = []
            for node in queue:
                for nbr in range(n):
                    if adj_matrix[node][nbr] > 0:
                        new_dist = dist[src][node] + 1
                        if new_dist < dist[src][nbr]:
                            dist[src][nbr] = new_dist
                            n_paths[src][nbr] = n_paths[src][node]
                            if nbr not in visited:
                                visited.add(nbr)
                                next_q.append(nbr)
                        elif new_dist == dist[src][nbr]:
                            n_paths[src][nbr] += n_paths[src][node]
            queue = next_q
    return dist, n_paths

dist_matrix, n_paths = all_shortest_paths(adj)

# Betweenness centrality
betweenness = np.zeros(n_patches)
for s in range(n_patches):
    for t in range(n_patches):
        if s == t or dist_matrix[s][t] == np.inf:
            continue
        for v in range(n_patches):
            if v == s or v == t:
                continue
            if dist_matrix[s][t] == np.inf:
                continue
            # Does v lie on a shortest path from s to t?
            if (dist_matrix[s][v] + dist_matrix[v][t] == dist_matrix[s][t] and
                dist_matrix[s][v] < np.inf and dist_matrix[v][t] < np.inf):
                # Fraction of shortest paths through v
                if n_paths[s][t] > 0:
                    betweenness[v] += (n_paths[s][v] * n_paths[v][t]) / n_paths[s][t]

# Normalize
max_betweenness = max(betweenness) if max(betweenness) > 0 else 1
betweenness_norm = betweenness / max_betweenness

# Closeness centrality
closeness = np.zeros(n_patches)
for i in range(n_patches):
    reachable = dist_matrix[i][dist_matrix[i] < np.inf]
    reachable = reachable[reachable > 0]
    if len(reachable) > 0:
        closeness[i] = len(reachable) / np.sum(reachable)

max_close = max(closeness) if max(closeness) > 0 else 1
closeness_norm = closeness / max_close

# --- Visualization ---
fig, axes = plt.subplots(1, 3, figsize=(16, 6))
fig.patch.set_facecolor('#1f2937')

metrics = [
    ('Degree centrality', degree_centrality, '#22c55e'),
    ('Betweenness centrality', betweenness_norm, '#ef4444'),
    ('Closeness centrality', closeness_norm, '#3b82f6'),
]

for ax, (title, values, color) in zip(axes, metrics):
    ax.set_facecolor('#111827')

    # Draw corridors
    for i, j, w in corridors:
        ax.plot([patch_x[i], patch_x[j]], [patch_y[i], patch_y[j]],
                '-', color='gray', alpha=0.3, linewidth=1)

    # Draw patches sized by centrality
    for p in range(n_patches):
        size = max(values[p], 0.1) * 500
        ax.scatter(patch_x[p], patch_y[p], s=size, c=color, alpha=0.7, edgecolors='white', linewidths=0.5)
        ax.text(patch_x[p], patch_y[p] - 4, f'{values[p]:.2f}', color='white',
                fontsize=7, ha='center')
        ax.text(patch_x[p], patch_y[p] + 3, str(p), color='white', fontsize=7, ha='center', fontweight='bold')

    ax.set_xlim(-5, 80)
    ax.set_ylim(-5, 70)
    ax.set_title(title, color='white', fontsize=11)
    ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Centrality analysis — which patches matter most?")
print(f"{'Patch':<8} {'Degree':>10} {'Betweenness':>14} {'Closeness':>12}")
print("-" * 46)
for p in range(n_patches):
    marker = " ***" if betweenness_norm[p] > 0.5 else ""
    print(f"  {p:<6} {degree_centrality[p]:>10.2f} {betweenness_norm[p]:>14.2f} {closeness_norm[p]:>12.2f}{marker}")

top_betweenness = int(np.argmax(betweenness_norm))
print(f"\\nHighest betweenness: Patch {top_betweenness} — this is the critical bottleneck.")
print("Losing this patch would disconnect the most patch-pairs.")
print("Conservation priority: protect patch {top_betweenness} and its corridors first.")`,
      challenge: 'Remove patch 4 (simulate habitat destruction) by zeroing its row and column in the adjacency matrix. How does the network fragment? Which patch-pairs lose connectivity? This shows the real cost of losing a high-betweenness node.',
      successHint: 'Betweenness centrality is used in real conservation planning. The Wildlife Institute of India uses network analysis to prioritize elephant corridor restoration in Northeast India. The math you just implemented is the same math guiding real policy decisions.',
    },
    {
      title: 'Metapopulation dynamics — patches as population sources and sinks',
      concept: `A **metapopulation** is a "population of populations" — multiple local populations in separate habitat patches, connected by occasional migration through corridors. Metapopulation theory, developed by Richard Levins in 1969, explains how species persist in fragmented landscapes.

The key insight: individual patches go extinct regularly, but the metapopulation survives as long as **colonization rate exceeds extinction rate**. Patches are recolonized by migrants from neighboring occupied patches.

The classic Levins model:

dp/dt = c * p * (1 - p) - e * p

where p = fraction of patches occupied, c = colonization rate, e = extinction rate.

At equilibrium: p* = 1 - e/c (when c > e, some fraction of patches is always occupied).

More realistic models account for:
- **Patch area**: larger patches have lower extinction rates (more individuals = more resilience)
- **Isolation**: distant patches have lower colonization rates
- **Corridor quality**: corridors increase colonization rates between connected patches
- **Source-sink dynamics**: large patches are sources (net exporters of individuals), small patches are sinks (maintained only by immigration)`,
      analogy: 'Imagine a chain of campfires in the wind. Each fire occasionally goes out (local extinction), but sparks blow between them (migration). If the fires are close together and large, sparks relight neighbors quickly. If fires are too far apart, a fire that dies stays dead. The metapopulation survives not because individual fires are permanent, but because the network of fires is resilient.',
      storyConnection: 'The elephants of the corridor are a metapopulation. The Kaziranga herd, the Karbi hills herd, the Nagaon groups — each is a local population. When a local group shrinks, elephants from neighboring areas migrate through corridors to reinforce it. Cut the corridors, and each group is on its own. The story describes exactly this: the corridor is the lifeline that keeps the metapopulation alive.',
      checkQuestion: 'In the Levins model, what happens as e/c approaches 1? What does this mean for conservation?',
      checkAnswer: 'As e/c approaches 1, p* approaches 0 — the equilibrium fraction of occupied patches goes to zero. When e/c >= 1, the metapopulation goes extinct because extinction overwhelms colonization. Conservation implication: you must either reduce extinction (protect/enlarge patches) or increase colonization (build/restore corridors). Corridors directly increase c.',
      codeIntro: 'Simulate Levins metapopulation dynamics for a network of habitat patches connected by corridors, and visualize how corridor loss drives extinction.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate metapopulation on a 10-patch network
n_patches = 10
# Patch areas determine extinction probability: smaller = more vulnerable
patch_areas = np.array([120, 80, 30, 50, 60, 25, 90, 40, 70, 35])
# Base extinction probability per time step (inversely proportional to area)
base_extinction = 0.3 / (patch_areas / 30)  # smaller patches more likely to go extinct

# Adjacency: which patches can exchange migrants?
adj = np.zeros((n_patches, n_patches))
corridor_pairs = [(0,1), (1,2), (2,3), (3,4), (4,5), (5,6), (0,7), (7,8), (8,9), (3,9)]
for i, j in corridor_pairs:
    adj[i][j] = adj[j][i] = 1

# Base colonization probability (from an occupied neighbor)
base_colonization = 0.15

def simulate_metapopulation(adj_matrix, ext_probs, col_prob, n_steps=200, initial_occupied=None):
    n = len(ext_probs)
    if initial_occupied is None:
        occupied = np.ones(n, dtype=bool)  # start all occupied
    else:
        occupied = initial_occupied.copy()

    history = [occupied.copy()]

    for t in range(n_steps):
        new_occupied = occupied.copy()

        for patch in range(n):
            if occupied[patch]:
                # Extinction: probability based on patch area
                if np.random.random() < ext_probs[patch]:
                    new_occupied[patch] = False
            else:
                # Colonization: depends on occupied neighbors
                occupied_neighbors = sum(1 for nbr in range(n)
                                        if adj_matrix[patch][nbr] > 0 and occupied[nbr])
                # Probability of at least one colonizer arriving
                col_p = 1 - (1 - col_prob) ** occupied_neighbors
                if np.random.random() < col_p:
                    new_occupied[patch] = True

        occupied = new_occupied
        history.append(occupied.copy())

    return np.array(history)

# Scenario 1: Full connectivity
history_full = simulate_metapopulation(adj, base_extinction, base_colonization)

# Scenario 2: Remove 3 corridors (fragment the network)
adj_fragmented = adj.copy()
for i, j in [(2,3), (7,8), (3,9)]:
    adj_fragmented[i][j] = adj_fragmented[j][i] = 0
history_frag = simulate_metapopulation(adj_fragmented, base_extinction, base_colonization)

# Scenario 3: No corridors at all
adj_none = np.zeros_like(adj)
history_none = simulate_metapopulation(adj_none, base_extinction, base_colonization)

# Compute fraction occupied over time
frac_full = np.mean(history_full, axis=1)
frac_frag = np.mean(history_frag, axis=1)
frac_none = np.mean(history_none, axis=1)

# --- Visualization ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Occupancy over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(frac_full, color='#22c55e', linewidth=2, label='Full corridors', alpha=0.9)
ax.plot(frac_frag, color='#f59e0b', linewidth=2, label='Fragmented', alpha=0.9)
ax.plot(frac_none, color='#ef4444', linewidth=2, label='No corridors', alpha=0.9)
ax.set_xlabel('Time step', color='white')
ax.set_ylabel('Fraction occupied', color='white')
ax.set_title('Metapopulation persistence', color='white', fontsize=11)
ax.set_ylim(-0.05, 1.05)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Individual patch occupancy heatmap (full corridors)
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.imshow(history_full.T.astype(float), aspect='auto', cmap='Greens',
          interpolation='nearest')
ax.set_xlabel('Time step', color='white')
ax.set_ylabel('Patch ID', color='white')
ax.set_title('Patch occupancy over time (full corridors)', color='white', fontsize=11)
ax.set_yticks(range(n_patches))
ax.tick_params(colors='gray')

# Plot 3: Patch occupancy heatmap (fragmented)
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.imshow(history_frag.T.astype(float), aspect='auto', cmap='YlOrRd',
          interpolation='nearest')
ax.set_xlabel('Time step', color='white')
ax.set_ylabel('Patch ID', color='white')
ax.set_title('Patch occupancy (fragmented)', color='white', fontsize=11)
ax.set_yticks(range(n_patches))
ax.tick_params(colors='gray')

# Plot 4: Source-sink analysis (net colonization events per patch)
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Count transitions for full corridor scenario
colonizations = np.zeros(n_patches)
extinctions = np.zeros(n_patches)
for t in range(1, len(history_full)):
    for p in range(n_patches):
        if not history_full[t-1][p] and history_full[t][p]:
            colonizations[p] += 1
        if history_full[t-1][p] and not history_full[t][p]:
            extinctions[p] += 1

net_flow = colonizations - extinctions
colors = ['#22c55e' if n >= 0 else '#ef4444' for n in net_flow]
ax.barh(range(n_patches), net_flow, color=colors, edgecolor='none')
ax.set_xlabel('Net flow (colonizations - extinctions)', color='white')
ax.set_ylabel('Patch ID', color='white')
ax.set_title('Source (+) vs Sink (-) patches', color='white', fontsize=11)
ax.axvline(0, color='gray', linestyle='--', linewidth=0.5)
ax.set_yticks(range(n_patches))
ax.tick_params(colors='gray')

# Add area labels
for p in range(n_patches):
    ax.text(max(net_flow) + 2, p, f'{patch_areas[p]} km²', color='gray',
            fontsize=8, va='center')

plt.tight_layout()
plt.show()

print("Metapopulation simulation results (200 time steps):")
print(f"  Full corridors:  final occupancy = {frac_full[-1]:.0%}")
print(f"  Fragmented:      final occupancy = {frac_frag[-1]:.0%}")
print(f"  No corridors:    final occupancy = {frac_none[-1]:.0%}")
print()
print("Source patches (large, low extinction):", [p for p in range(n_patches) if net_flow[p] > 0])
print("Sink patches (small, maintained by immigration):", [p for p in range(n_patches) if net_flow[p] < 0])
print()
print("Key insight: corridors do not just move animals.")
print("They transform a collection of doomed populations into a resilient metapopulation.")`,
      challenge: 'Double the base_colonization rate (to 0.30) and re-run. Then double the patch areas instead. Which intervention saves more patches — better corridors or bigger patches? This is the core debate in conservation biology (SLOSS: Single Large Or Several Small).',
      successHint: 'Metapopulation theory revolutionized conservation. Before Levins, conservationists focused solely on protecting individual reserves. After, they understood that connectivity between reserves matters as much as reserve size. The corridors ARE the conservation strategy.',
    },
    {
      title: 'Landscape genetics — how DNA reveals hidden corridors',
      concept: `We can measure corridor quality not just by vegetation maps but by **genetic data**. If two populations exchange migrants regularly, their DNA will be similar. If they are isolated, genetic drift will cause them to diverge.

**Landscape genetics** combines population genetics with landscape ecology to infer connectivity from genetic patterns:

- **FST (fixation index)**: measures genetic differentiation between populations. FST = 0 means identical gene pools (lots of migration). FST = 1 means completely different (no migration). FST between 0.05 and 0.15 indicates moderate differentiation.

- **Isolation by distance (IBD)**: genetic distance increases with geographic distance in a connected landscape. Deviations from IBD reveal barriers or corridors.

- **Isolation by resistance (IBR)**: genetic distance correlates better with landscape resistance (how hard it is for an animal to cross) than with straight-line distance. A 10-km highway is a bigger barrier than a 50-km forest.

- **Effective population size (Ne)**: the genetic equivalent of population size. A population of 500 elephants with only 50 breeding might have Ne = 50. Small Ne = rapid genetic drift = loss of diversity.

The math: Wright's FST can be estimated as FST ≈ 1 / (1 + 4*Ne*m), where m is the migration rate between populations.`,
      analogy: 'Landscape genetics is like studying family names to understand migration patterns. If two villages share many family names, their populations mix frequently — there must be a good road between them. If two nearby villages have completely different family names, there is a barrier (a river, a mountain, a historical conflict) preventing intermarriage. The family names ARE the data; the barrier IS the hypothesis.',
      storyConnection: 'The elephants of the corridor could be genetically tested. If the Kaziranga elephants and Karbi hills elephants share alleles, the corridor is working — genes are flowing. If their genetics are diverging, the corridor is failing even if it looks intact on a map. The elephants may have stopped using it due to human disturbance, traffic noise, or fear. Genetics reveals the truth that satellite imagery cannot.',
      checkQuestion: 'Two elephant populations separated by 20 km of forest have FST = 0.02. Two populations separated by 5 km of highway have FST = 0.18. What does this tell you?',
      checkAnswer: 'The 20-km forest is a functional corridor (low FST = high gene flow). The 5-km highway is a near-complete barrier (high FST = almost no gene flow). Geographic distance is irrelevant; landscape resistance determines actual connectivity. A short highway is a bigger genetic barrier than a long forest path. This is the fundamental insight of landscape genetics.',
      codeIntro: 'Simulate genetic divergence across a landscape with patches, corridors, and barriers, demonstrating isolation-by-distance vs isolation-by-resistance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# 8 populations arranged in a landscape
n_pops = 8
pop_x = np.array([10, 25, 40, 55, 15, 35, 50, 65])
pop_y = np.array([30, 40, 35, 30, 15, 15, 20, 15])
pop_names = ['Kaziranga', 'Karbi_W', 'Karbi_E', 'Nagaland',
             'South_A', 'South_B', 'South_C', 'South_D']
pop_Ne = np.array([200, 80, 50, 120, 30, 60, 40, 90])

# Migration rates between populations (per generation)
# Higher = more gene flow through corridors
migration = np.zeros((n_pops, n_pops))
# Northern corridor (good forest)
migration[0,1] = migration[1,0] = 0.05
migration[1,2] = migration[2,1] = 0.03
migration[2,3] = migration[3,2] = 0.02
# Southern corridor (degraded)
migration[4,5] = migration[5,4] = 0.01
migration[5,6] = migration[6,5] = 0.008
migration[6,7] = migration[7,6] = 0.015
# Cross corridors (highway barrier between N and S — very low)
migration[0,4] = migration[4,0] = 0.001  # highway
migration[2,5] = migration[5,2] = 0.001  # highway
migration[3,7] = migration[7,3] = 0.005  # partial corridor

# Compute FST from migration rates: FST ≈ 1/(1 + 4*Ne*m)
# Use harmonic mean of Ne for each pair
fst_matrix = np.zeros((n_pops, n_pops))
for i in range(n_pops):
    for j in range(n_pops):
        if i == j:
            fst_matrix[i][j] = 0
        elif migration[i][j] > 0:
            ne_harmonic = 2 * pop_Ne[i] * pop_Ne[j] / (pop_Ne[i] + pop_Ne[j])
            fst_matrix[i][j] = 1 / (1 + 4 * ne_harmonic * migration[i][j])
        else:
            fst_matrix[i][j] = 0.95  # near-complete differentiation

# Geographic distances
geo_dist = np.zeros((n_pops, n_pops))
for i in range(n_pops):
    for j in range(n_pops):
        geo_dist[i][j] = np.sqrt((pop_x[i] - pop_x[j])**2 + (pop_y[i] - pop_y[j])**2)

# Resistance distances (landscape-based, accounts for barriers)
# Highway between N and S adds 50 "resistance km" equivalent
resistance_dist = geo_dist.copy()
for i in range(4):     # northern pops
    for j in range(4, 8):  # southern pops
        resistance_dist[i][j] += 50  # highway barrier
        resistance_dist[j][i] += 50

# Simulate allele frequencies over generations
n_loci = 20
n_generations = 100
allele_freqs = np.random.uniform(0.3, 0.7, (n_pops, n_loci))

for gen in range(n_generations):
    new_freqs = allele_freqs.copy()
    for pop in range(n_pops):
        # Genetic drift: variance = p(1-p)/(2*Ne)
        for locus in range(n_loci):
            p = allele_freqs[pop, locus]
            drift = np.random.normal(0, np.sqrt(p * (1 - p) / (2 * pop_Ne[pop])))
            new_freqs[pop, locus] = np.clip(p + drift, 0.01, 0.99)

        # Migration: blend with connected populations
        for other in range(n_pops):
            if migration[pop][other] > 0:
                m = migration[pop][other]
                new_freqs[pop] = (1 - m) * new_freqs[pop] + m * allele_freqs[other]

    allele_freqs = new_freqs

# Compute pairwise genetic distance (Nei's distance approximation)
genetic_dist = np.zeros((n_pops, n_pops))
for i in range(n_pops):
    for j in range(n_pops):
        diff = allele_freqs[i] - allele_freqs[j]
        genetic_dist[i][j] = np.sqrt(np.mean(diff ** 2))

# --- Visualization ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Landscape with genetic connections
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i in range(n_pops):
    for j in range(i+1, n_pops):
        if migration[i][j] > 0:
            lw = migration[i][j] * 100
            color = '#22c55e' if migration[i][j] > 0.01 else '#ef4444'
            ax.plot([pop_x[i], pop_x[j]], [pop_y[i], pop_y[j]],
                    '-', color=color, linewidth=lw, alpha=0.7)

for i in range(n_pops):
    size = pop_Ne[i] * 2
    ax.scatter(pop_x[i], pop_y[i], s=size, c='#3b82f6', edgecolors='white',
               linewidths=1, zorder=5)
    ax.text(pop_x[i], pop_y[i] + 3, pop_names[i].replace('_', ' '), color='white',
            fontsize=7, ha='center')

# Draw highway
ax.fill_between([0, 75], [22, 22], [24, 24], color='#ef4444', alpha=0.3)
ax.text(37, 23, 'HIGHWAY', color='#ef4444', fontsize=8, ha='center', fontweight='bold')
ax.set_xlim(0, 75)
ax.set_ylim(5, 50)
ax.set_title('Landscape & gene flow (green=high, red=low)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 2: FST matrix
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.imshow(fst_matrix, cmap='YlOrRd', vmin=0, vmax=1)
ax.set_xticks(range(n_pops))
ax.set_yticks(range(n_pops))
ax.set_xticklabels([n[:6] for n in pop_names], color='white', fontsize=7, rotation=45)
ax.set_yticklabels([n[:6] for n in pop_names], color='white', fontsize=7)
ax.set_title('FST matrix (0=same, 1=different)', color='white', fontsize=10)
plt.colorbar(im, ax=ax)
ax.tick_params(colors='gray')

# Plot 3: Isolation by distance vs resistance
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Get upper triangle pairs
pairs_geo = []
pairs_resist = []
pairs_genetic = []
pair_labels = []
for i in range(n_pops):
    for j in range(i+1, n_pops):
        pairs_geo.append(geo_dist[i][j])
        pairs_resist.append(resistance_dist[i][j])
        pairs_genetic.append(genetic_dist[i][j])
        # Color by N-N, S-S, or N-S
        if i < 4 and j < 4:
            pair_labels.append('N-N')
        elif i >= 4 and j >= 4:
            pair_labels.append('S-S')
        else:
            pair_labels.append('N-S')

colors_map = {'N-N': '#22c55e', 'S-S': '#3b82f6', 'N-S': '#ef4444'}
for label in ['N-N', 'S-S', 'N-S']:
    mask = [l == label for l in pair_labels]
    gd = [pairs_geo[k] for k in range(len(mask)) if mask[k]]
    gn = [pairs_genetic[k] for k in range(len(mask)) if mask[k]]
    ax.scatter(gd, gn, c=colors_map[label], label=label, s=40, alpha=0.8, edgecolors='none')

ax.set_xlabel('Geographic distance (km)', color='white')
ax.set_ylabel('Genetic distance', color='white')
ax.set_title('Isolation by Distance (IBD)', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 4: Isolation by resistance
ax = axes[1, 1]
ax.set_facecolor('#111827')
for label in ['N-N', 'S-S', 'N-S']:
    mask = [l == label for l in pair_labels]
    rd = [pairs_resist[k] for k in range(len(mask)) if mask[k]]
    gn = [pairs_genetic[k] for k in range(len(mask)) if mask[k]]
    ax.scatter(rd, gn, c=colors_map[label], label=label, s=40, alpha=0.8, edgecolors='none')

ax.set_xlabel('Resistance distance (km equivalent)', color='white')
ax.set_ylabel('Genetic distance', color='white')
ax.set_title('Isolation by Resistance (IBR)', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Correlation analysis
from numpy import corrcoef
r_ibd = corrcoef(pairs_geo, pairs_genetic)[0, 1]
r_ibr = corrcoef(pairs_resist, pairs_genetic)[0, 1]

print(f"Correlation with genetic distance:")
print(f"  Geographic distance (IBD): r = {r_ibd:.3f}")
print(f"  Resistance distance (IBR): r = {r_ibr:.3f}")
print()
if r_ibr > r_ibd:
    print("IBR explains genetic patterns BETTER than IBD.")
    print("The highway barrier matters more than raw distance.")
else:
    print("IBD is a better predictor in this configuration.")
print()
print("N-S pairs (across highway) show high genetic distance despite short geographic distance.")
print("This proves the highway is a functional barrier to elephant gene flow.")`,
      challenge: 'Add a wildlife underpass at one point on the highway (increase migration between one N-S pair to 0.03). Re-simulate 100 generations. Does the genetic distance between those populations decrease? How long does it take to see an effect?',
      successHint: 'Landscape genetics is the gold standard for evaluating corridor effectiveness. It tells you whether animals actually USE a corridor, not just whether it exists on paper. India is increasingly using genetic monitoring to evaluate corridor investments.',
    },
    {
      title: 'Habitat fragmentation metrics — quantifying landscape damage',
      concept: `How do you measure fragmentation? Not just "is the forest broken up?" but **how broken**, **in what pattern**, and **does it matter for wildlife**?

Landscape ecology has developed precise metrics:

- **Number of patches**: more patches = more fragmented (a continuous forest is 1 patch; that same area broken into 20 fragments is more fragmented)
- **Mean patch area**: smaller average patch = more fragmented
- **Edge density**: total edge length per unit area. More edge = more fragmentation. Edge habitat differs from core habitat — edge is warmer, drier, windier, and accessible to predators and invasive species.
- **Core area**: area of a patch more than some buffer distance from the edge. An elephant needs deep forest; edge forest is functionally useless. A 100-ha patch with 500m buffer might have only 10 ha of core area.
- **Patch shape index**: perimeter / perimeter of a circle with the same area. Compact patches (shape index near 1) have more core area. Elongated patches (high shape index) are mostly edge.
- **Nearest neighbor distance**: how far apart are patches? Large gaps are barriers for species with limited dispersal.

These metrics can be computed from satellite imagery (classified into habitat vs. non-habitat) and used to track fragmentation over decades.`,
      analogy: 'Think of a pizza. A whole pizza is one "patch" with lots of core (the middle, far from the crust). Cut it into 8 slices and every piece is dominated by crust (edge). Cut it into 64 tiny squares and there is no core left — every piece is all edge. The total area of pizza did not change, but the proportion that is "deep interior" collapsed. That is what fragmentation does to habitat.',
      storyConnection: 'The elephant corridor exists because the forest was fragmented. Tea gardens carved the continuous Assam forest into patches. The elephants need the corridor because their habitat is now a collection of fragments. Measuring fragmentation metrics over time would show the problem getting worse — more patches, smaller mean area, less core habitat — until the corridor was the last thread holding it together.',
      checkQuestion: 'A conservation agency reports that total forest area in a region stayed constant at 10,000 hectares over 20 years. Does this mean the habitat is fine?',
      checkAnswer: 'Not at all. Total area can stay constant while fragmentation increases dramatically. Those 10,000 ha could have gone from a single continuous block (10,000 ha of core habitat) to 200 patches of 50 ha each (almost zero core habitat after edge effects). Area is necessary but not sufficient. You must also measure patch count, mean area, core area, and connectivity.',
      codeIntro: 'Generate a landscape, fragment it progressively, and compute fragmentation metrics at each stage to quantify how the same total area becomes less functional as it is broken up.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Create a 100x100 km landscape grid (each cell = 1 km²)
grid_size = 100

def create_landscape(n_clearings, clearing_size_range, seed=42):
    """Start with full forest and punch holes (clearings)."""
    rng = np.random.RandomState(seed)
    landscape = np.ones((grid_size, grid_size), dtype=int)  # 1 = forest

    for _ in range(n_clearings):
        # Random rectangular clearing
        w = rng.randint(clearing_size_range[0], clearing_size_range[1])
        h = rng.randint(clearing_size_range[0], clearing_size_range[1])
        x = rng.randint(0, grid_size - w)
        y = rng.randint(0, grid_size - h)
        landscape[y:y+h, x:x+w] = 0  # 0 = cleared

    return landscape

def label_patches(landscape):
    """Find connected forest patches using flood fill."""
    labels = np.zeros_like(landscape, dtype=int)
    current_label = 0

    for i in range(landscape.shape[0]):
        for j in range(landscape.shape[1]):
            if landscape[i][j] == 1 and labels[i][j] == 0:
                current_label += 1
                # BFS flood fill
                queue = [(i, j)]
                labels[i][j] = current_label
                while queue:
                    r, c = queue.pop(0)
                    for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
                        nr, nc = r+dr, c+dc
                        if (0 <= nr < landscape.shape[0] and 0 <= nc < landscape.shape[1]
                            and landscape[nr][nc] == 1 and labels[nr][nc] == 0):
                            labels[nr][nc] = current_label
                            queue.append((nr, nc))

    return labels, current_label

def compute_core_area(landscape, buffer=5):
    """Core area = forest cells more than buffer distance from any edge."""
    from numpy import zeros_like
    core = zeros_like(landscape)
    for i in range(landscape.shape[0]):
        for j in range(landscape.shape[1]):
            if landscape[i][j] == 1:
                # Check if all cells within buffer are also forest
                i_lo = max(0, i - buffer)
                i_hi = min(landscape.shape[0], i + buffer + 1)
                j_lo = max(0, j - buffer)
                j_hi = min(landscape.shape[1], j + buffer + 1)
                if np.all(landscape[i_lo:i_hi, j_lo:j_hi] == 1):
                    core[i][j] = 1
    return core

def compute_metrics(landscape, buffer=5):
    """Compute fragmentation metrics."""
    total_forest = np.sum(landscape)
    total_area = landscape.size

    labels, n_patches = label_patches(landscape)

    # Patch areas
    patch_areas = []
    for p in range(1, n_patches + 1):
        patch_areas.append(np.sum(labels == p))
    patch_areas = np.array(patch_areas)

    # Edge density: count forest cells adjacent to non-forest
    edge_cells = 0
    for i in range(landscape.shape[0]):
        for j in range(landscape.shape[1]):
            if landscape[i][j] == 1:
                for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
                    nr, nc = i+dr, j+dc
                    if (nr < 0 or nr >= landscape.shape[0] or
                        nc < 0 or nc >= landscape.shape[1] or
                        landscape[nr][nc] == 0):
                        edge_cells += 1
                        break

    core = compute_core_area(landscape, buffer)
    core_area = np.sum(core)

    return {
        'total_forest': total_forest,
        'forest_pct': total_forest / total_area * 100,
        'n_patches': n_patches,
        'mean_patch_area': np.mean(patch_areas) if len(patch_areas) > 0 else 0,
        'max_patch_area': np.max(patch_areas) if len(patch_areas) > 0 else 0,
        'edge_cells': edge_cells,
        'edge_density': edge_cells / total_area * 100,
        'core_area': core_area,
        'core_pct': core_area / total_forest * 100 if total_forest > 0 else 0,
    }

# Create 4 stages of increasing fragmentation
stages = [
    ('Intact forest', 0, (5, 10)),
    ('Light fragmentation', 15, (5, 12)),
    ('Moderate fragmentation', 40, (4, 10)),
    ('Severe fragmentation', 80, (3, 9)),
]

landscapes = []
all_metrics = []
for name, n_clear, size_range in stages:
    land = create_landscape(n_clear, size_range)
    metrics = compute_metrics(land, buffer=3)
    landscapes.append(land)
    all_metrics.append(metrics)

# --- Visualization ---
fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Progressive habitat fragmentation', color='white', fontsize=14)

for col, (name, land, metrics) in enumerate(zip([s[0] for s in stages], landscapes, all_metrics)):
    # Top row: landscape maps
    ax = axes[0, col]
    ax.set_facecolor('#111827')
    display = np.zeros((*land.shape, 3))
    display[land == 1] = (0.13, 0.77, 0.37)  # forest = green
    display[land == 0] = (0.12, 0.10, 0.07)  # cleared = dark

    # Overlay core area in brighter green
    core = compute_core_area(land, buffer=3)
    display[core == 1] = (0.05, 0.95, 0.30)

    ax.imshow(display, origin='lower')
    ax.set_title(name, color='white', fontsize=9)
    ax.tick_params(colors='gray', labelsize=6)

    # Bottom row: metrics
    ax = axes[1, col]
    ax.set_facecolor('#111827')
    metric_names = ['Patches', 'Mean area', 'Core %', 'Edge %']
    metric_vals = [metrics['n_patches'], metrics['mean_patch_area'],
                   metrics['core_pct'], metrics['edge_density']]
    colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
    bars = ax.bar(metric_names, metric_vals, color=colors, edgecolor='none')
    ax.set_title(f"Forest: {metrics['forest_pct']:.0f}%", color='white', fontsize=9)
    ax.tick_params(colors='gray', labelsize=6)
    for bar, val in zip(bars, metric_vals):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
                f'{val:.0f}', ha='center', color='white', fontsize=7)

plt.tight_layout()
plt.show()

print("Fragmentation metrics across stages:")
print(f"{'Stage':<25} {'Forest%':>8} {'Patches':>8} {'MeanArea':>10} {'Core%':>8} {'Edge%':>8}")
print("-" * 70)
for (name, _, _), m in zip(stages, all_metrics):
    print(f"{name:<25} {m['forest_pct']:>7.1f}% {m['n_patches']:>8} {m['mean_patch_area']:>9.0f} {m['core_pct']:>7.1f}% {m['edge_density']:>7.1f}%")

print()
print("Even when total forest area only drops slightly,")
print("core area collapses and edge density skyrockets.")
print("This is why 'total forest cover' is a misleading conservation metric.")`,
      challenge: 'Modify the clearing pattern: instead of random rectangles, create linear clearings (roads) of width 2 but length 50-80. How do roads fragment differently than random clearings? Which creates more patches per unit of cleared area?',
      successHint: 'These are the exact metrics used by ISRO and the Forest Survey of India to track deforestation. Satellite images are classified into forest/non-forest, then these algorithms compute fragmentation metrics at national scale. You just built the core of a forest monitoring system.',
    },
    {
      title: 'Conservation prioritization algorithms — where to spend limited resources',
      concept: `Conservation budgets are finite. You cannot protect everything. The question becomes: **which corridors, patches, or actions give the most conservation value per dollar?**

This is a combinatorial optimization problem. Given:
- N possible corridor restoration projects, each with a cost and an expected benefit
- A total budget B
- The constraint that benefits are not independent (two corridors that connect the same patches are redundant; two that connect different components are synergistic)

Find the subset of projects that maximizes total benefit without exceeding the budget.

**Algorithms used in real conservation**:

1. **Greedy algorithm**: rank projects by benefit/cost ratio, select the best one, update benefits (accounting for synergies), repeat. Fast but not guaranteed optimal.

2. **Simulated annealing**: start with a random solution, randomly swap projects in/out, accept improvements always and worse solutions sometimes (to escape local optima), gradually reduce the acceptance probability.

3. **Integer linear programming**: formulate as maximize Σ(benefit_i * x_i) subject to Σ(cost_i * x_i) ≤ B and x_i ∈ {0,1}. Guaranteed optimal but computationally expensive for large problems.

The benefit function typically measures **increase in landscape connectivity** (using the metrics from Lessons 1-2) weighted by species priority.`,
      analogy: 'Conservation prioritization is like a startup allocating its seed funding. You have 20 possible product features, each costs different amounts and delivers different value. Some features are synergistic (login + dashboard) and some are redundant (two different login systems). You cannot build all 20 with your budget, so you pick the subset that maximizes total user value. The greedy approach picks the highest ROI feature first, then reassesses.',
      storyConnection: 'The elephant corridor is one of dozens of potential corridors in Assam that could be restored. Each has a different cost (land price, restoration effort, political difficulty) and a different benefit (how many elephants it would serve, how much connectivity it would add). Conservation agencies must choose which corridors to prioritize. The algorithms in this lesson formalize that decision, replacing gut feeling with data-driven optimization.',
      checkQuestion: 'A greedy algorithm selects corridor A (cost: 10M, connects components of 500 and 300 elephants) over corridor B (cost: 8M, connects components of 200 and 100 elephants). But after building A, the remaining budget could fund B. A non-greedy approach would build B first, then A (different order, same result). When does order matter?',
      checkAnswer: 'Order matters when benefits change based on previous selections. If building corridor A changes the benefit of corridor B (e.g., A and B both connect the same two components, so the second one is redundant), then the greedy order matters. This is the problem with greedy algorithms: they make locally optimal choices that can be globally suboptimal when benefits are interdependent.',
      codeIntro: 'Implement a conservation prioritization system using greedy and simulated annealing algorithms to select the best set of corridor projects under a budget constraint.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# 8 habitat patches with populations
n_patches = 8
patch_names = ['Kaziranga', 'Karbi_W', 'Karbi_E', 'Nagaon', 'Manas', 'Nameri', 'Dibru', 'Pobitora']
patch_pop = np.array([1200, 400, 250, 300, 800, 350, 500, 150])
patch_x = np.array([20, 35, 50, 30, 5, 55, 70, 15])
patch_y = np.array([30, 40, 35, 15, 45, 50, 30, 20])

# Existing corridors
existing = [(0, 1), (1, 2), (0, 7)]
# Potential new corridors (projects to evaluate)
projects = [
    {'name': 'Karbi-Nagaon link', 'from': 2, 'to': 3, 'cost': 12, 'quality': 0.7},
    {'name': 'Kaziranga-Manas bypass', 'from': 0, 'to': 4, 'cost': 25, 'quality': 0.6},
    {'name': 'Manas-Nameri corridor', 'from': 4, 'to': 5, 'cost': 18, 'quality': 0.8},
    {'name': 'Nameri-Dibru link', 'from': 5, 'to': 6, 'cost': 15, 'quality': 0.5},
    {'name': 'Nagaon-Pobitora path', 'from': 3, 'to': 7, 'cost': 8, 'quality': 0.4},
    {'name': 'Dibru-Karbi_E route', 'from': 6, 'to': 2, 'cost': 20, 'quality': 0.6},
    {'name': 'Pobitora-Manas bridge', 'from': 7, 'to': 4, 'cost': 10, 'quality': 0.5},
    {'name': 'Kaziranga-Nagaon direct', 'from': 0, 'to': 3, 'cost': 14, 'quality': 0.7},
]

budget = 40  # million rupees

def build_adjacency(existing_corridors, selected_projects):
    adj = np.zeros((n_patches, n_patches))
    for i, j in existing_corridors:
        adj[i][j] = adj[j][i] = 1.0
    for proj in selected_projects:
        i, j = proj['from'], proj['to']
        adj[i][j] = adj[j][i] = proj['quality']
    return adj

def count_connected(adj):
    visited = set()
    components = []
    for start in range(n_patches):
        if start not in visited:
            comp = []
            queue = [start]
            visited.add(start)
            while queue:
                node = queue.pop(0)
                comp.append(node)
                for nbr in range(n_patches):
                    if adj[node][nbr] > 0 and nbr not in visited:
                        visited.add(nbr)
                        queue.append(nbr)
            components.append(comp)
    return components

def compute_benefit(adj):
    """Benefit = total population in largest connected component + weighted connectivity score."""
    components = count_connected(adj)
    # Population in each component
    comp_pops = [sum(patch_pop[p] for p in comp) for comp in components]
    largest_pop = max(comp_pops)

    # Connectivity score: sum of quality-weighted connections
    connectivity = np.sum(adj) / 2

    # Combined benefit
    return largest_pop + connectivity * 50

# --- Greedy algorithm ---
def greedy_select(projects, budget, existing):
    selected = []
    remaining = list(range(len(projects)))
    total_cost = 0

    history = [(total_cost, compute_benefit(build_adjacency(existing, [])))]

    while remaining:
        best_ratio = -1
        best_idx = -1

        for idx in remaining:
            proj = projects[idx]
            if total_cost + proj['cost'] > budget:
                continue
            # Compute marginal benefit
            test_selected = selected + [proj]
            adj = build_adjacency(existing, test_selected)
            benefit = compute_benefit(adj)
            current_benefit = compute_benefit(build_adjacency(existing, selected))
            marginal = benefit - current_benefit
            ratio = marginal / proj['cost'] if proj['cost'] > 0 else 0

            if ratio > best_ratio:
                best_ratio = ratio
                best_idx = idx

        if best_idx == -1:
            break

        selected.append(projects[best_idx])
        total_cost += projects[best_idx]['cost']
        remaining.remove(best_idx)
        history.append((total_cost, compute_benefit(build_adjacency(existing, selected))))

    return selected, total_cost, history

# --- Simulated annealing ---
def simulated_annealing(projects, budget, existing, n_iter=2000, temp_start=100, temp_end=0.1):
    n = len(projects)
    # Random initial solution
    current = np.random.randint(0, 2, n).astype(bool)
    # Ensure budget constraint
    while sum(projects[i]['cost'] for i in range(n) if current[i]) > budget:
        # Remove random project
        selected_idx = [i for i in range(n) if current[i]]
        if selected_idx:
            current[np.random.choice(selected_idx)] = False

    current_cost = sum(projects[i]['cost'] for i in range(n) if current[i])
    current_selected = [projects[i] for i in range(n) if current[i]]
    current_benefit = compute_benefit(build_adjacency(existing, current_selected))

    best = current.copy()
    best_benefit = current_benefit
    history = []

    for iteration in range(n_iter):
        temp = temp_start * (temp_end / temp_start) ** (iteration / n_iter)

        # Flip one random project
        candidate = current.copy()
        flip = np.random.randint(0, n)
        candidate[flip] = not candidate[flip]

        # Check budget
        cand_cost = sum(projects[i]['cost'] for i in range(n) if candidate[i])
        if cand_cost > budget:
            history.append(current_benefit)
            continue

        cand_selected = [projects[i] for i in range(n) if candidate[i]]
        cand_benefit = compute_benefit(build_adjacency(existing, cand_selected))

        delta = cand_benefit - current_benefit
        if delta > 0 or np.random.random() < np.exp(delta / temp):
            current = candidate
            current_benefit = cand_benefit
            current_cost = cand_cost

        if current_benefit > best_benefit:
            best = current.copy()
            best_benefit = current_benefit

        history.append(current_benefit)

    best_selected = [projects[i] for i in range(n) if best[i]]
    best_cost = sum(p['cost'] for p in best_selected)
    return best_selected, best_cost, best_benefit, history

greedy_selected, greedy_cost, greedy_history = greedy_select(projects, budget, existing)
sa_selected, sa_cost, sa_benefit, sa_history = simulated_annealing(projects, budget, existing)

greedy_benefit = compute_benefit(build_adjacency(existing, greedy_selected))
baseline_benefit = compute_benefit(build_adjacency(existing, []))

# --- Visualization ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Landscape with greedy solution
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i, j in existing:
    ax.plot([patch_x[i], patch_x[j]], [patch_y[i], patch_y[j]], '-', color='gray', linewidth=2)
for proj in greedy_selected:
    i, j = proj['from'], proj['to']
    ax.plot([patch_x[i], patch_x[j]], [patch_y[i], patch_y[j]], '-',
            color='#22c55e', linewidth=3, alpha=0.8)
    mid_x = (patch_x[i] + patch_x[j]) / 2
    mid_y = (patch_y[i] + patch_y[j]) / 2
    ax.text(mid_x, mid_y, f'\${proj["cost"]}M', color='#22c55e', fontsize=7, ha='center')

for p in range(n_patches):
    size = patch_pop[p] / 5
    ax.scatter(patch_x[p], patch_y[p], s=size, c='#3b82f6', edgecolors='white', linewidths=1, zorder=5)
    ax.text(patch_x[p], patch_y[p] - 4, patch_names[p], color='white', fontsize=7, ha='center')
ax.set_title(f'Greedy solution (cost: \${greedy_cost}M)', color='white', fontsize=11)
ax.set_xlim(-5, 80)
ax.set_ylim(0, 60)
ax.tick_params(colors='gray')

# Plot 2: SA solution
ax = axes[0, 1]
ax.set_facecolor('#111827')
for i, j in existing:
    ax.plot([patch_x[i], patch_x[j]], [patch_y[i], patch_y[j]], '-', color='gray', linewidth=2)
for proj in sa_selected:
    i, j = proj['from'], proj['to']
    ax.plot([patch_x[i], patch_x[j]], [patch_y[i], patch_y[j]], '-',
            color='#f59e0b', linewidth=3, alpha=0.8)
    mid_x = (patch_x[i] + patch_x[j]) / 2
    mid_y = (patch_y[i] + patch_y[j]) / 2
    ax.text(mid_x, mid_y, f'\${proj["cost"]}M', color='#f59e0b', fontsize=7, ha='center')

for p in range(n_patches):
    size = patch_pop[p] / 5
    ax.scatter(patch_x[p], patch_y[p], s=size, c='#3b82f6', edgecolors='white', linewidths=1, zorder=5)
    ax.text(patch_x[p], patch_y[p] - 4, patch_names[p], color='white', fontsize=7, ha='center')
ax.set_title(f'Simulated annealing (cost: \${sa_cost}M)', color='white', fontsize=11)
ax.set_xlim(-5, 80)
ax.set_ylim(0, 60)
ax.tick_params(colors='gray')

# Plot 3: Greedy progress
ax = axes[1, 0]
ax.set_facecolor('#111827')
costs_g = [h[0] for h in greedy_history]
benefits_g = [h[1] for h in greedy_history]
ax.plot(costs_g, benefits_g, 'o-', color='#22c55e', linewidth=2, markersize=8)
for i, (c, b) in enumerate(greedy_history):
    if i > 0:
        ax.annotate(greedy_selected[i-1]['name'][:12], (c, b), color='white', fontsize=7,
                   textcoords="offset points", xytext=(5, 5))
ax.set_xlabel('Cumulative cost ($M)', color='white')
ax.set_ylabel('Total benefit', color='white')
ax.set_title('Greedy: benefit vs cost', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 4: SA convergence
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(sa_history, color='#f59e0b', linewidth=0.5, alpha=0.6)
# Moving average
window = 50
if len(sa_history) > window:
    ma = np.convolve(sa_history, np.ones(window)/window, mode='valid')
    ax.plot(range(window-1, len(sa_history)), ma, color='#f59e0b', linewidth=2)
ax.axhline(greedy_benefit, color='#22c55e', linestyle='--', linewidth=1, label=f'Greedy: {greedy_benefit:.0f}')
ax.axhline(sa_benefit, color='#ef4444', linestyle='--', linewidth=1, label=f'SA best: {sa_benefit:.0f}')
ax.set_xlabel('Iteration', color='white')
ax.set_ylabel('Benefit', color='white')
ax.set_title('SA convergence', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Budget: \${budget}M")
print(f"Baseline benefit (no new corridors): {baseline_benefit:.0f}")
print()
print("GREEDY SOLUTION:")
for p in greedy_selected:
    print(f"  {p['name']:<30} cost=\${p['cost']}M  quality={p['quality']}")
print(f"  Total cost: \${greedy_cost}M  Benefit: {greedy_benefit:.0f}  Improvement: +{greedy_benefit - baseline_benefit:.0f}")
print()
print("SIMULATED ANNEALING SOLUTION:")
for p in sa_selected:
    print(f"  {p['name']:<30} cost=\${p['cost']}M  quality={p['quality']}")
print(f"  Total cost: \${sa_cost}M  Benefit: {sa_benefit:.0f}  Improvement: +{sa_benefit - baseline_benefit:.0f}")`,
      challenge: 'Change the budget to $60M and re-run. With more money, does the greedy algorithm still find a good solution, or does simulated annealing pull further ahead? Try increasing n_iter in SA to 5000 for better convergence.',
      successHint: 'Systematic Conservation Planning (SCP) is a real field. Software like Marxan and Zonation use exactly these optimization algorithms to design protected area networks worldwide. You just built a simplified version of what guides billion-dollar conservation investments.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Conservation Ecologist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (ecology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real ecology computations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
