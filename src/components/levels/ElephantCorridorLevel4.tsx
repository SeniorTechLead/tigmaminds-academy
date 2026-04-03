import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ElephantCorridorLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Part 1 — Define the landscape graph and resistance surface',
      concept: `Your capstone project is a **Corridor Optimizer**: a system that takes a landscape of habitat patches, a resistance surface (how hard it is for elephants to cross each cell), and a budget, then finds the optimal set of corridor placements to maximize population connectivity.

This first part builds the foundation: the landscape model. Real corridor planning uses **resistance surfaces** — gridded maps where each cell has a resistance value based on land use:
- Dense forest: resistance = 1 (easy to cross)
- Open grassland: resistance = 3
- Agricultural land: resistance = 10
- Roads: resistance = 50
- Urban areas: resistance = 100 (nearly impassable)

The **least-cost path** between two patches follows the route through the resistance surface that minimizes total accumulated resistance. This is the optimal corridor route — not the shortest geographic path, but the easiest ecological path.

We implement Dijkstra's algorithm on the resistance grid to find these paths. Each cell connects to its 8 neighbors, with edge cost = average resistance of the two cells times the distance (1 for cardinal, sqrt(2) for diagonal).`,
      analogy: 'A resistance surface is like a hiking difficulty map. Flat meadows are easy (low resistance), steep mountains are hard (high resistance), and rivers are barriers (very high resistance). The least-cost path is what a smart hiker would choose — not the straight line, but the path of least total effort.',
      storyConnection: 'The elephants of the corridor do not walk in straight lines. They follow ancient paths that thread between tea gardens, avoid highways, ford rivers at shallow points, and use forest cover. Those paths are least-cost paths through the elephants\' resistance surface — shaped by generations of experience. Your optimizer will rediscover those paths from first principles.',
      checkQuestion: 'Why is Dijkstra\'s algorithm preferred over simple BFS for finding least-cost paths on a resistance surface?',
      checkAnswer: 'BFS finds shortest paths by hop count — it treats all edges as equal cost. But in a resistance surface, crossing a forest cell costs much less than crossing a highway cell. Dijkstra\'s algorithm handles variable edge weights, always expanding the node with the lowest accumulated cost. It finds the truly least-cost path, not just the geographically shortest.',
      codeIntro: 'Build the landscape model: generate a resistance surface with habitat patches, compute least-cost paths between all patch pairs using Dijkstra\'s algorithm.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Landscape generation ---
grid_size = 80  # 80x80 km grid
resistance = np.ones((grid_size, grid_size)) * 5  # base: agricultural land

# Add forest patches (low resistance)
patches = [
    {'name': 'Kaziranga', 'center': (15, 40), 'radius': 10, 'pop': 1200},
    {'name': 'Karbi Hills', 'center': (40, 55), 'radius': 8, 'pop': 400},
    {'name': 'Nagaon Forest', 'center': (35, 20), 'radius': 6, 'pop': 250},
    {'name': 'Manas', 'center': (10, 65), 'radius': 9, 'pop': 800},
    {'name': 'Nameri', 'center': (60, 60), 'radius': 7, 'pop': 350},
    {'name': 'Dibru-Saikhowa', 'center': (70, 35), 'radius': 6, 'pop': 500},
]

for patch in patches:
    cx, cy = patch['center']
    r = patch['radius']
    for i in range(grid_size):
        for j in range(grid_size):
            dist = np.sqrt((i - cx)**2 + (j - cy)**2)
            if dist < r:
                resistance[i, j] = 1  # dense forest
            elif dist < r + 3:
                resistance[i, j] = 2  # forest edge

# Add roads (high resistance)
resistance[30, :] = 30   # horizontal highway
resistance[55, :] = 30   # another highway
resistance[:, 50] = 25   # vertical highway

# Add river (moderate barrier)
for i in range(grid_size):
    river_j = int(25 + 5 * np.sin(i * 0.1))
    if 0 <= river_j < grid_size:
        resistance[i, river_j] = 15
        if river_j + 1 < grid_size:
            resistance[i, river_j + 1] = 15

# Add some random villages
for _ in range(20):
    vx, vy = np.random.randint(5, 75, 2)
    resistance[max(0,vx-1):min(grid_size,vx+2), max(0,vy-1):min(grid_size,vy+2)] = 20

# --- Dijkstra's algorithm on grid ---
def dijkstra_grid(resistance_grid, start_r, start_c):
    """Compute least-cost distance from a source cell to all cells."""
    rows, cols = resistance_grid.shape
    cost = np.full((rows, cols), np.inf)
    cost[start_r, start_c] = 0
    visited = np.zeros((rows, cols), dtype=bool)

    # Simple priority queue using sorted list (adequate for this grid size)
    # For production code, use a heap
    frontier = [(0, start_r, start_c)]

    neighbors = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    diag_dist = np.sqrt(2)

    while frontier:
        frontier.sort(key=lambda x: x[0])
        d, r, c = frontier.pop(0)

        if visited[r, c]:
            continue
        visited[r, c] = True

        for dr, dc in neighbors:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr, nc]:
                step_dist = diag_dist if (dr != 0 and dc != 0) else 1.0
                edge_cost = step_dist * (resistance_grid[r, c] + resistance_grid[nr, nc]) / 2
                new_cost = d + edge_cost
                if new_cost < cost[nr, nc]:
                    cost[nr, nc] = new_cost
                    frontier.append((new_cost, nr, nc))

    return cost

# Compute least-cost distances between all patch centers
n = len(patches)
patch_centers = [p['center'] for p in patches]
lc_dist = np.zeros((n, n))
cost_surfaces = []

print("Computing least-cost paths...")
for i in range(n):
    r, c = patch_centers[i]
    cost_surface = dijkstra_grid(resistance, r, c)
    cost_surfaces.append(cost_surface)
    for j in range(n):
        r2, c2 = patch_centers[j]
        lc_dist[i, j] = cost_surface[r2, c2]
    print(f"  From {patches[i]['name']}: done")

# Geographic distances for comparison
geo_dist = np.zeros((n, n))
for i in range(n):
    for j in range(n):
        ci, cj = patch_centers[i], patch_centers[j]
        geo_dist[i, j] = np.sqrt((ci[0]-cj[0])**2 + (ci[1]-cj[1])**2)

# --- Visualization ---
fig, axes = plt.subplots(2, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Resistance surface
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.imshow(resistance, cmap='RdYlGn_r', origin='lower', vmin=1, vmax=50)
for p in patches:
    cx, cy = p['center']
    ax.plot(cy, cx, 'o', color='white', markersize=10, markeredgecolor='black')
    ax.text(cy + 2, cx + 2, p['name'], color='white', fontsize=7, fontweight='bold')
ax.set_title('Resistance surface (green=easy, red=hard)', color='white', fontsize=11)
plt.colorbar(im, ax=ax, label='Resistance')
ax.tick_params(colors='gray')

# Plot 2: Cost surface from Kaziranga
ax = axes[0, 1]
ax.set_facecolor('#111827')
display_cost = cost_surfaces[0].copy()
display_cost[display_cost == np.inf] = np.nanmax(display_cost[display_cost < np.inf])
im = ax.imshow(display_cost, cmap='inferno', origin='lower')
for p in patches:
    cx, cy = p['center']
    ax.plot(cy, cx, 'o', color='white', markersize=8)
ax.set_title('Least-cost distance from Kaziranga', color='white', fontsize=11)
plt.colorbar(im, ax=ax, label='Cumulative cost')
ax.tick_params(colors='gray')

# Plot 3: Geographic vs least-cost distance
ax = axes[1, 0]
ax.set_facecolor('#111827')
for i in range(n):
    for j in range(i+1, n):
        ax.scatter(geo_dist[i, j], lc_dist[i, j], c='#22c55e', s=50, edgecolors='white', linewidths=0.5)
        ax.annotate(f'{patches[i]["name"][:3]}-{patches[j]["name"][:3]}',
                   (geo_dist[i, j], lc_dist[i, j]), color='gray', fontsize=6,
                   textcoords="offset points", xytext=(5, 5))

# Fit line
mask = geo_dist > 0
from numpy.polynomial.polynomial import polyfit
upper = []
for i in range(n):
    for j in range(i+1, n):
        upper.append((geo_dist[i,j], lc_dist[i,j]))
gd, lcd = zip(*upper)
coeffs = polyfit(gd, lcd, 1)
x_line = np.linspace(min(gd), max(gd), 100)
ax.plot(x_line, coeffs[0] + coeffs[1] * x_line, '--', color='#f59e0b', linewidth=1)

ax.set_xlabel('Geographic distance (km)', color='white')
ax.set_ylabel('Least-cost distance', color='white')
ax.set_title('Geographic vs landscape distance', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 4: Least-cost distance matrix
ax = axes[1, 1]
ax.set_facecolor('#111827')
im = ax.imshow(lc_dist, cmap='YlOrRd', origin='lower')
ax.set_xticks(range(n))
ax.set_yticks(range(n))
ax.set_xticklabels([p['name'][:6] for p in patches], color='white', fontsize=7, rotation=45)
ax.set_yticklabels([p['name'][:6] for p in patches], color='white', fontsize=7)
ax.set_title('Pairwise least-cost distances', color='white', fontsize=11)
plt.colorbar(im, ax=ax)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Landscape model built:")
print(f"  Grid: {grid_size}x{grid_size} km")
print(f"  Patches: {n}")
print(f"  Resistance range: {resistance.min():.0f} - {resistance.max():.0f}")
print()
print("Least-cost distances (vs geographic):")
for i in range(n):
    for j in range(i+1, n):
        ratio = lc_dist[i,j] / geo_dist[i,j] if geo_dist[i,j] > 0 else 0
        print(f"  {patches[i]['name']:>15} - {patches[j]['name']:<15} geo={geo_dist[i,j]:5.1f}  lc={lc_dist[i,j]:7.1f}  ratio={ratio:.1f}x")
print()
print("High ratio = lots of barriers between patches (highway, river, villages).")
print("These pairs need corridors most urgently.")`,
      challenge: 'Add a second river crossing the landscape vertically. How does this change the least-cost distances and the pairs that need corridors most?',
      successHint: 'You now have a landscape model with a resistance surface and Dijkstra-based least-cost distances. This is the foundation of Circuitscape and other real corridor-planning tools.',
    },
    {
      title: 'Capstone Part 2 — Least-cost corridor extraction and width analysis',
      concept: `Finding the least-cost PATH between two patches gives you a single line — the optimal corridor center. But elephants need corridor WIDTH. A 10-meter-wide path is useless; they need at least 1-2 km of contiguous forest.

The **least-cost corridor** is the zone around the least-cost path where the accumulated cost from both ends is within some threshold of the minimum. Formally:

corridor(threshold) = {cell : cost_from_A(cell) + cost_from_B(cell) <= min_cost + threshold}

Small threshold = narrow corridor (only the very best cells). Large threshold = wide corridor (includes suboptimal cells). The threshold you choose depends on the species: an elephant tolerates more resistance than a tree frog.

We also analyze corridor **pinch points** — locations where the corridor narrows. These are critical vulnerabilities: if a pinch point is destroyed, the corridor is severed. Pinch points correspond to cells where the corridor width is minimal, often caused by roads, villages, or narrow gaps between barriers.`,
      analogy: 'Think of water flowing between two lakes through hilly terrain. The least-cost path is the valley bottom — the lowest elevation route. The corridor is the valley itself — all the terrain that is nearly as low. Pinch points are narrow gorges where the valley contracts. Block a gorge, and water (or elephants) cannot pass.',
      storyConnection: 'The elephant corridor in the story has pinch points — places where the forest narrows to just a few hundred meters between tea gardens. The elephants crowd through these bottlenecks, sometimes coming into conflict with humans. Identifying pinch points is the first step toward widening them by acquiring adjacent land or negotiating land-use changes with tea garden owners.',
      checkQuestion: 'A corridor has a least-cost distance of 150 units. You set the threshold to 20 (including cells up to cost 170). The corridor is 3 km wide through most of its length but narrows to 200 meters at one point. What should you do?',
      checkAnswer: 'The 200-meter pinch point is the critical vulnerability. Priority should be acquiring or restoring land at the pinch point to widen it. Widening the already-wide sections has little conservation value. Focus resources on the weakest link. This is the principle of minimum bottleneck capacity.',
      codeIntro: 'Extract least-cost corridors between habitat patches, identify pinch points, and analyze corridor width along the route.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Rebuild landscape (same as Part 1)
grid_size = 80
resistance = np.ones((grid_size, grid_size)) * 5

patches = [
    {'name': 'Kaziranga', 'center': (15, 40), 'radius': 10, 'pop': 1200},
    {'name': 'Karbi Hills', 'center': (40, 55), 'radius': 8, 'pop': 400},
    {'name': 'Nagaon', 'center': (35, 20), 'radius': 6, 'pop': 250},
]

for patch in patches:
    cx, cy = patch['center']
    r = patch['radius']
    for i in range(grid_size):
        for j in range(grid_size):
            dist = np.sqrt((i - cx)**2 + (j - cy)**2)
            if dist < r:
                resistance[i, j] = 1
            elif dist < r + 3:
                resistance[i, j] = 2

resistance[30, :] = 30  # highway
for i in range(grid_size):
    rj = int(25 + 5 * np.sin(i * 0.1))
    if 0 <= rj < grid_size:
        resistance[i, rj] = 15
for _ in range(15):
    vx, vy = np.random.randint(5, 75, 2)
    resistance[max(0,vx-1):min(80,vx+2), max(0,vy-1):min(80,vy+2)] = 20

def dijkstra_grid(res, sr, sc):
    rows, cols = res.shape
    cost = np.full((rows, cols), np.inf)
    cost[sr, sc] = 0
    visited = np.zeros((rows, cols), dtype=bool)
    frontier = [(0, sr, sc)]
    nbrs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    sqrt2 = np.sqrt(2)
    while frontier:
        frontier.sort(key=lambda x: x[0])
        d, r, c = frontier.pop(0)
        if visited[r, c]:
            continue
        visited[r, c] = True
        for dr, dc in nbrs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr, nc]:
                step = sqrt2 if (dr != 0 and dc != 0) else 1.0
                ec = step * (res[r, c] + res[nr, nc]) / 2
                nc2 = d + ec
                if nc2 < cost[nr, nc]:
                    cost[nr, nc] = nc2
                    frontier.append((nc2, nr, nc))
    return cost

# Compute cost surfaces from Kaziranga and Karbi Hills
print("Computing cost surface from Kaziranga...")
cost_A = dijkstra_grid(resistance, 15, 40)
print("Computing cost surface from Karbi Hills...")
cost_B = dijkstra_grid(resistance, 40, 55)

# Combined cost surface
combined = cost_A + cost_B
min_cost = combined[40, 55]  # cost at destination

# Extract corridors at different thresholds
thresholds = [10, 25, 50]

# Trace least-cost path (backtrack from B to A)
def trace_path(cost_surface, start_r, start_c, end_r, end_c):
    path = [(end_r, end_c)]
    r, c = end_r, end_c
    nbrs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    while (r, c) != (start_r, start_c):
        best_cost = np.inf
        best_nr, best_nc = r, c
        for dr, dc in nbrs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < cost_surface.shape[0] and 0 <= nc < cost_surface.shape[1]:
                if cost_surface[nr, nc] < best_cost:
                    best_cost = cost_surface[nr, nc]
                    best_nr, best_nc = nr, nc
        if (best_nr, best_nc) == (r, c):
            break
        r, c = best_nr, best_nc
        path.append((r, c))
    return path

path = trace_path(cost_A, 15, 40, 40, 55)

# Measure corridor width along the path
def measure_width(combined_cost, path_points, threshold, min_cost):
    """For each path point, count corridor cells perpendicular to path direction."""
    widths = []
    for idx in range(1, len(path_points) - 1):
        r, c = path_points[idx]
        # Count cells within threshold in a local window
        window = 10
        count = 0
        for dr in range(-window, window + 1):
            for dc in range(-window, window + 1):
                nr, nc = r + dr, c + dc
                if (0 <= nr < combined_cost.shape[0] and 0 <= nc < combined_cost.shape[1]):
                    if combined_cost[nr, nc] <= min_cost + threshold:
                        count += 1
        # Approximate width as sqrt of area (assuming roughly circular cross-section)
        widths.append(np.sqrt(count))
    return widths

widths_25 = measure_width(combined, path, 25, min_cost)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Top row: corridors at different thresholds
for col, thresh in enumerate(thresholds):
    ax = axes[0, col]
    ax.set_facecolor('#111827')

    corridor_mask = combined <= min_cost + thresh
    display = np.zeros((*resistance.shape, 3))
    display[:, :] = (0.07, 0.09, 0.15)  # background
    display[resistance <= 2] = (0.1, 0.3, 0.1)  # forest in dark green
    display[corridor_mask] = (0.13, 0.77, 0.37)  # corridor in bright green

    # Highlight path
    ax.imshow(display, origin='lower')
    path_r = [p[0] for p in path]
    path_c = [p[1] for p in path]
    ax.plot(path_c, path_r, '-', color='#f59e0b', linewidth=2, alpha=0.8)

    for p in patches:
        cx, cy = p['center']
        ax.plot(cy, cx, 'o', color='white', markersize=8)
        ax.text(cy + 2, cx + 2, p['name'][:8], color='white', fontsize=7)

    corridor_area = np.sum(corridor_mask)
    ax.set_title(f'Threshold={thresh} (area={corridor_area} km²)', color='white', fontsize=10)
    ax.tick_params(colors='gray')

# Plot 4: Width profile along corridor
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(widths_25, color='#22c55e', linewidth=2)
ax.axhline(np.mean(widths_25), color='#f59e0b', linestyle='--', label=f'Mean: {np.mean(widths_25):.1f} km')
# Find pinch points
if len(widths_25) > 0:
    min_width_idx = np.argmin(widths_25)
    ax.axvline(min_width_idx, color='#ef4444', linestyle=':', label=f'Pinch: {min(widths_25):.1f} km')
ax.set_xlabel('Position along corridor', color='white')
ax.set_ylabel('Corridor width (km)', color='white')
ax.set_title('Width profile (threshold=25)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 5: Resistance along path
ax = axes[1, 1]
ax.set_facecolor('#111827')
path_resistance = [resistance[r, c] for r, c in path]
ax.plot(path_resistance, color='#ef4444', linewidth=1.5)
ax.fill_between(range(len(path_resistance)), path_resistance, alpha=0.3, color='#ef4444')
ax.set_xlabel('Position along path', color='white')
ax.set_ylabel('Resistance', color='white')
ax.set_title('Resistance profile along least-cost path', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Pinch point map
ax = axes[1, 2]
ax.set_facecolor('#111827')
corridor_mask = combined <= min_cost + 25
display = np.zeros((*resistance.shape, 3))
display[:, :] = (0.07, 0.09, 0.15)
display[corridor_mask] = (0.13, 0.77, 0.37)

# Mark pinch points (narrowest 10% of width profile)
if len(widths_25) > 0:
    width_threshold = np.percentile(widths_25, 10)
    for idx in range(len(widths_25)):
        if widths_25[idx] <= width_threshold:
            r, c = path[idx + 1]
            display[max(0,r-2):min(80,r+3), max(0,c-2):min(80,c+3)] = (0.94, 0.27, 0.27)

ax.imshow(display, origin='lower')
for p in patches:
    cx, cy = p['center']
    ax.plot(cy, cx, 'o', color='white', markersize=8)
ax.set_title('Pinch points (red = narrow)', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Least-cost path: {len(path)} cells, total cost: {min_cost:.1f}")
print(f"Corridor width (threshold=25): mean={np.mean(widths_25):.1f} km, min={min(widths_25):.1f} km")
print(f"Pinch points: {sum(1 for w in widths_25 if w <= width_threshold)} locations")
print()
print("Conservation priority: widen pinch points to at least the mean corridor width.")
print("This gives you the specific grid cells where land acquisition is most valuable.")`,
      challenge: 'Compute corridors between all 3 patch pairs. Which corridor has the most pinch points? Which has the highest average resistance? These metrics help you decide which corridor to restore first.',
      successHint: 'You have built the core of Circuitscape — a widely-used tool for corridor planning. Real implementations use circuit theory (treating the landscape as an electrical circuit) for even more nuanced connectivity estimates.',
    },
    {
      title: 'Capstone Part 3 — Population connectivity model',
      concept: `Now we connect the physical landscape to population biology. A corridor is only valuable if it moves enough animals to maintain genetic and demographic connectivity.

**Demographic connectivity**: enough individuals migrate to prevent local extinction. Even 1-2 elephants per generation can make the difference.

**Genetic connectivity**: enough migrants to prevent inbreeding depression. The "one migrant per generation" rule (from Wright's island model) says that Nm >= 1 (effective population size times migration rate) prevents genetic divergence.

We model connectivity as a function of corridor quality:
- Migration probability = f(corridor_cost, species_dispersal_ability)
- For elephants: they can traverse moderate resistance but avoid very high resistance
- The probability of an elephant using a corridor decreases exponentially with its cost: P(use) = exp(-alpha * corridor_cost)

The **effective connectivity** between two patches combines:
1. The corridor cost (from least-cost path analysis)
2. The populations at each end (larger populations send more migrants)
3. The species-specific dispersal kernel (how far/how willingly the species moves)

This gives us a weighted connectivity matrix that predicts actual gene flow, not just structural connectivity.`,
      analogy: 'A bridge exists (structural connectivity), but is anyone using it? If tolls are too high, traffic is zero. If the bridge connects two tiny villages, traffic is low even with no toll. Effective connectivity depends on both infrastructure quality (corridor cost) and demand (population size). We need to model both.',
      storyConnection: 'The corridor in the story is physically present but increasingly dangerous for elephants — traffic, poachers, hostile farmers. Structural connectivity says "the corridor exists." Effective connectivity asks "do elephants actually use it enough to maintain a viable metapopulation?" The answer determines whether the corridor is a real conservation asset or just a green line on a map.',
      checkQuestion: 'Population A has 500 elephants and population B has 50. A corridor between them has cost 100. A second corridor (same cost 100) connects population C (300 elephants) to population D (200 elephants). Which corridor provides more effective connectivity?',
      checkAnswer: 'The C-D corridor. Although A-B has a larger total population, the key metric is migration in BOTH directions. B can only send a few migrants to A, so gene flow is limited by the smaller population. C and D are more balanced, so migration is substantial in both directions. Effective connectivity depends on the geometric mean of populations, not their sum.',
      codeIntro: 'Build a population connectivity model that combines corridor costs, population sizes, and dispersal kernels to predict gene flow across the landscape.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Patch data
patches = [
    {'name': 'Kaziranga', 'pop': 1200, 'Ne': 400, 'x': 15, 'y': 40},
    {'name': 'Karbi Hills', 'pop': 400, 'Ne': 130, 'x': 40, 'y': 55},
    {'name': 'Nagaon', 'pop': 250, 'Ne': 80, 'x': 35, 'y': 20},
    {'name': 'Manas', 'pop': 800, 'Ne': 270, 'x': 10, 'y': 65},
    {'name': 'Nameri', 'pop': 350, 'Ne': 120, 'x': 60, 'y': 60},
    {'name': 'Dibru', 'pop': 500, 'Ne': 170, 'x': 70, 'y': 35},
]
n = len(patches)

# Least-cost distances (from Part 1, simplified here)
lc_dist = np.array([
    [0, 85, 110, 130, 180, 200],
    [85, 0, 95, 170, 120, 160],
    [110, 95, 0, 190, 165, 140],
    [130, 170, 190, 0, 150, 220],
    [180, 120, 165, 150, 0, 100],
    [200, 160, 140, 220, 100, 0],
])

# Species-specific dispersal parameter
alpha = 0.015  # elephant dispersal decay

# --- Connectivity model ---
# Migration probability between patches
def compute_migration_prob(lc_dist, alpha):
    """Exponential dispersal kernel."""
    return np.exp(-alpha * lc_dist)

# Effective connectivity: combines migration prob with population sizes
def compute_effective_connectivity(patches, mig_prob):
    n = len(patches)
    eff_conn = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            if i != j:
                # Geometric mean of Ne * migration probability
                ne_i = patches[i]['Ne']
                ne_j = patches[j]['Ne']
                eff_conn[i, j] = np.sqrt(ne_i * ne_j) * mig_prob[i, j]
    return eff_conn

# Predicted migrants per generation
def compute_migrants(patches, mig_prob):
    n = len(patches)
    migrants = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            if i != j:
                # Number of migrants = source pop * migration probability
                migrants[i, j] = patches[i]['pop'] * mig_prob[i, j] * 0.01  # 1% dispersal rate
    return migrants

mig_prob = compute_migration_prob(lc_dist, alpha)
eff_conn = compute_effective_connectivity(patches, mig_prob)
migrants = compute_migrants(patches, mig_prob)

# Wright's Nm criterion: Nm >= 1 for genetic connectivity
Nm = np.zeros((n, n))
for i in range(n):
    for j in range(n):
        if i != j:
            Nm[i, j] = patches[i]['Ne'] * mig_prob[i, j] * 0.01

# Test different alpha values (sensitivity analysis)
alphas = np.linspace(0.005, 0.03, 20)
total_connectivity = []
connected_pairs = []
for a in alphas:
    mp = compute_migration_prob(lc_dist, a)
    ec = compute_effective_connectivity(patches, mp)
    total_connectivity.append(np.sum(ec))
    # Count pairs with Nm >= 1
    nm_test = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            if i != j:
                nm_test[i, j] = patches[i]['Ne'] * mp[i, j] * 0.01
    connected_pairs.append(np.sum(nm_test >= 1) // 2)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Migration probability matrix
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.imshow(mig_prob, cmap='Greens', vmin=0, vmax=1)
ax.set_xticks(range(n))
ax.set_yticks(range(n))
ax.set_xticklabels([p['name'][:6] for p in patches], color='white', fontsize=7, rotation=45)
ax.set_yticklabels([p['name'][:6] for p in patches], color='white', fontsize=7)
ax.set_title('Migration probability', color='white', fontsize=11)
plt.colorbar(im, ax=ax)
ax.tick_params(colors='gray')

# Plot 2: Effective connectivity
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.imshow(eff_conn, cmap='YlOrRd', vmin=0)
ax.set_xticks(range(n))
ax.set_yticks(range(n))
ax.set_xticklabels([p['name'][:6] for p in patches], color='white', fontsize=7, rotation=45)
ax.set_yticklabels([p['name'][:6] for p in patches], color='white', fontsize=7)
ax.set_title('Effective connectivity (Ne * migration)', color='white', fontsize=11)
plt.colorbar(im, ax=ax)
ax.tick_params(colors='gray')

# Plot 3: Network map with connectivity
ax = axes[0, 2]
ax.set_facecolor('#111827')
max_ec = np.max(eff_conn)
for i in range(n):
    for j in range(i+1, n):
        if eff_conn[i, j] > max_ec * 0.1:
            lw = eff_conn[i, j] / max_ec * 5
            color = '#22c55e' if Nm[i, j] >= 1 else '#ef4444'
            ax.plot([patches[i]['y'], patches[j]['y']], [patches[i]['x'], patches[j]['x']],
                    '-', color=color, linewidth=lw, alpha=0.7)

for p in patches:
    size = p['pop'] / 5
    ax.scatter(p['y'], p['x'], s=size, c='#3b82f6', edgecolors='white', linewidths=1, zorder=5)
    ax.text(p['y'] + 2, p['x'] + 2, p['name'][:6], color='white', fontsize=7)
ax.set_title('Connectivity network\\n(green=Nm>=1, red=Nm<1)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 4: Predicted migrants
ax = axes[1, 0]
ax.set_facecolor('#111827')
im = ax.imshow(migrants, cmap='YlGnBu', vmin=0)
for i in range(n):
    for j in range(n):
        if i != j:
            ax.text(j, i, f'{migrants[i,j]:.1f}', ha='center', va='center',
                    color='white' if migrants[i,j] < np.max(migrants)/2 else 'black', fontsize=7)
ax.set_xticks(range(n))
ax.set_yticks(range(n))
ax.set_xticklabels([p['name'][:6] for p in patches], color='white', fontsize=7, rotation=45)
ax.set_yticklabels([p['name'][:6] for p in patches], color='white', fontsize=7)
ax.set_title('Predicted migrants per generation', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 5: Sensitivity to alpha
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(alphas, total_connectivity, color='#22c55e', linewidth=2)
ax.axvline(alpha, color='#f59e0b', linestyle='--', label=f'Current alpha={alpha}')
ax.set_xlabel('Dispersal decay (alpha)', color='white')
ax.set_ylabel('Total connectivity', color='white')
ax.set_title('Sensitivity to dispersal ability', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Connected pairs vs alpha
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.plot(alphas, connected_pairs, 'o-', color='#a855f7', linewidth=2)
ax.axvline(alpha, color='#f59e0b', linestyle='--')
ax.set_xlabel('Dispersal decay (alpha)', color='white')
ax.set_ylabel('Genetically connected pairs (Nm>=1)', color='white')
ax.set_title('Genetic connectivity threshold', color='white', fontsize=11)
ax.set_ylim(0, n * (n-1) / 2 + 1)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Population connectivity analysis:")
print(f"{'Pair':<30} {'LC dist':>8} {'Mig prob':>10} {'Migrants':>10} {'Nm':>8} {'Status'}")
print("-" * 75)
for i in range(n):
    for j in range(i+1, n):
        status = "CONNECTED" if Nm[i,j] >= 1 else "ISOLATED"
        print(f"  {patches[i]['name'][:12]:>12}-{patches[j]['name'][:12]:<12} {lc_dist[i,j]:>8.0f} {mig_prob[i,j]:>10.4f} {migrants[i,j]:>10.1f} {Nm[i,j]:>8.2f}  {status}")

genetically_connected = sum(1 for i in range(n) for j in range(i+1,n) if Nm[i,j] >= 1)
total_pairs = n * (n-1) // 2
print(f"\\nGenetically connected pairs: {genetically_connected}/{total_pairs}")
print("Pairs with Nm < 1 are at risk of genetic isolation and inbreeding depression.")`,
      challenge: 'Simulate what happens if you halve the corridor cost for the most isolated pair (reduce their lc_dist by 50%). Does it push them above the Nm >= 1 threshold? How much corridor improvement is needed?',
      successHint: 'This model connects landscape structure to population genetics. Real conservation uses exactly this approach: estimate corridor costs from GIS data, parameterize dispersal kernels from telemetry data, and predict gene flow to assess corridor effectiveness.',
    },
    {
      title: 'Capstone Part 4 — Corridor optimization engine with budget constraints',
      concept: `Now we bring everything together. Given:
1. The landscape model (resistance surface, patches, populations)
2. The connectivity model (how corridor cost translates to gene flow)
3. A set of possible corridor improvement projects (each with a cost and expected benefit)
4. A limited budget

Find the optimal set of corridor improvements that maximizes total population connectivity.

This is a variant of the **weighted maximum coverage problem**, which is NP-hard. We use two approaches:

**Greedy with marginal benefit**: at each step, select the project that adds the most connectivity per dollar. After each selection, recalculate all remaining marginal benefits (because projects interact — two corridors to the same patch are partly redundant).

**Simulated annealing**: explore the solution space stochastically, allowing occasional "bad" moves to escape local optima. Over time, converge to a near-optimal solution.

The objective function is the **total effective connectivity** of the network after improvements, weighted by species priority. We also track secondary objectives: number of genetically connected pairs, minimum connectivity between any pair, and total metapopulation viability.`,
      analogy: 'You are a road planner with a fixed budget. You have proposals for 15 new roads, each connecting different towns at different costs. You cannot build all 15. The greedy approach says "build the cheapest road that connects the most people first." But sometimes a more expensive road creates a crucial shortcut that makes many other connections viable. The optimizer finds the globally best portfolio of investments.',
      storyConnection: 'The elephant corridor competes for funding with dozens of other conservation projects. This optimizer is the tool that tells the government: "Spend your $50 million here, here, and here. This portfolio of corridor improvements will connect 85% of the elephant population and maintain genetic viability for 100 years. Any other combination gives a worse result."',
      checkQuestion: 'Your optimizer selects 5 projects out of 12. A politician demands that project X (which was not selected) be included because it is in their constituency. How do you evaluate this demand?',
      checkAnswer: 'Re-run the optimizer with project X forced in (reduce the remaining budget by X\'s cost). Compare the total connectivity of the constrained solution to the unconstrained optimal. The difference is the "cost of politics" — the connectivity lost by the forced inclusion. If the loss is small, accommodate it. If it is large, present the numbers to argue against it. Optimization makes the trade-off explicit and quantifiable.',
      codeIntro: 'Build the full corridor optimization engine: define projects, implement greedy and SA optimizers, compare solutions, and visualize the optimal corridor network.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Patch data
patches = [
    {'name': 'Kaziranga', 'pop': 1200, 'Ne': 400, 'x': 15, 'y': 40},
    {'name': 'Karbi', 'pop': 400, 'Ne': 130, 'x': 40, 'y': 55},
    {'name': 'Nagaon', 'pop': 250, 'Ne': 80, 'x': 35, 'y': 20},
    {'name': 'Manas', 'pop': 800, 'Ne': 270, 'x': 10, 'y': 65},
    {'name': 'Nameri', 'pop': 350, 'Ne': 120, 'x': 60, 'y': 60},
    {'name': 'Dibru', 'pop': 500, 'Ne': 170, 'x': 70, 'y': 35},
]
n = len(patches)
alpha = 0.015

# Current least-cost distances
base_lc = np.array([
    [0, 85, 110, 130, 180, 200],
    [85, 0, 95, 170, 120, 160],
    [110, 95, 0, 190, 165, 140],
    [130, 170, 190, 0, 150, 220],
    [180, 120, 165, 150, 0, 100],
    [200, 160, 140, 220, 100, 0],
])

# Corridor improvement projects
projects = [
    {'id': 0, 'name': 'Kaz-Karbi upgrade', 'i': 0, 'j': 1, 'reduction': 30, 'cost': 15},
    {'id': 1, 'name': 'Kaz-Nagaon new', 'i': 0, 'j': 2, 'reduction': 40, 'cost': 20},
    {'id': 2, 'name': 'Kaz-Manas bypass', 'i': 0, 'j': 3, 'reduction': 50, 'cost': 30},
    {'id': 3, 'name': 'Karbi-Nagaon link', 'i': 1, 'j': 2, 'reduction': 35, 'cost': 12},
    {'id': 4, 'name': 'Karbi-Nameri route', 'i': 1, 'j': 4, 'reduction': 45, 'cost': 22},
    {'id': 5, 'name': 'Nagaon-Dibru path', 'i': 2, 'j': 5, 'reduction': 50, 'cost': 18},
    {'id': 6, 'name': 'Manas-Nameri corridor', 'i': 3, 'j': 4, 'reduction': 55, 'cost': 25},
    {'id': 7, 'name': 'Nameri-Dibru bridge', 'i': 4, 'j': 5, 'reduction': 40, 'cost': 14},
    {'id': 8, 'name': 'Manas-Karbi direct', 'i': 3, 'j': 1, 'reduction': 60, 'cost': 28},
    {'id': 9, 'name': 'Nagaon-Manas link', 'i': 2, 'j': 3, 'reduction': 55, 'cost': 24},
]

budget = 55  # million rupees

def apply_projects(base_dist, selected_ids):
    dist = base_dist.copy()
    for pid in selected_ids:
        proj = projects[pid]
        i, j = proj['i'], proj['j']
        new_dist = max(dist[i, j] - proj['reduction'], 10)
        dist[i, j] = dist[j, i] = new_dist
    return dist

def compute_total_connectivity(dist, patches, alpha):
    n = len(patches)
    total = 0
    n_connected = 0
    min_nm = np.inf
    for i in range(n):
        for j in range(i+1, n):
            mig_p = np.exp(-alpha * dist[i, j])
            ne_eff = np.sqrt(patches[i]['Ne'] * patches[j]['Ne'])
            conn = ne_eff * mig_p
            total += conn
            nm = patches[i]['Ne'] * mig_p * 0.01
            if nm >= 1:
                n_connected += 1
            min_nm = min(min_nm, nm)
    return total, n_connected, min_nm

# --- Greedy optimizer ---
def greedy_optimize(projects, budget, base_dist, patches, alpha):
    selected = []
    remaining = list(range(len(projects)))
    total_cost = 0
    history = []

    baseline = compute_total_connectivity(base_dist, patches, alpha)
    history.append({'cost': 0, 'connectivity': baseline[0], 'connected': baseline[1], 'selected': []})

    while remaining:
        best_marginal = -np.inf
        best_pid = -1

        for pid in remaining:
            if total_cost + projects[pid]['cost'] > budget:
                continue
            test_ids = selected + [pid]
            new_dist = apply_projects(base_dist, test_ids)
            new_conn, _, _ = compute_total_connectivity(new_dist, patches, alpha)
            current_dist = apply_projects(base_dist, selected)
            cur_conn, _, _ = compute_total_connectivity(current_dist, patches, alpha)
            marginal = (new_conn - cur_conn) / projects[pid]['cost']
            if marginal > best_marginal:
                best_marginal = marginal
                best_pid = pid

        if best_pid == -1:
            break

        selected.append(best_pid)
        total_cost += projects[best_pid]['cost']
        remaining.remove(best_pid)
        new_dist = apply_projects(base_dist, selected)
        conn, n_conn, min_nm = compute_total_connectivity(new_dist, patches, alpha)
        history.append({'cost': total_cost, 'connectivity': conn, 'connected': n_conn,
                       'selected': list(selected)})

    return selected, total_cost, history

# --- Simulated annealing optimizer ---
def sa_optimize(projects, budget, base_dist, patches, alpha, n_iter=3000):
    n_proj = len(projects)
    current = np.zeros(n_proj, dtype=bool)
    # Random valid start
    order = np.random.permutation(n_proj)
    cost = 0
    for pid in order:
        if cost + projects[pid]['cost'] <= budget:
            current[pid] = True
            cost += projects[pid]['cost']

    cur_dist = apply_projects(base_dist, [i for i in range(n_proj) if current[i]])
    cur_conn, _, _ = compute_total_connectivity(cur_dist, patches, alpha)

    best = current.copy()
    best_conn = cur_conn
    history = []

    for it in range(n_iter):
        temp = 50 * (0.001 / 50) ** (it / n_iter)
        candidate = current.copy()
        flip = np.random.randint(n_proj)
        candidate[flip] = not candidate[flip]

        cand_cost = sum(projects[i]['cost'] for i in range(n_proj) if candidate[i])
        if cand_cost > budget:
            history.append(cur_conn)
            continue

        cand_dist = apply_projects(base_dist, [i for i in range(n_proj) if candidate[i]])
        cand_conn, _, _ = compute_total_connectivity(cand_dist, patches, alpha)

        delta = cand_conn - cur_conn
        if delta > 0 or np.random.random() < np.exp(delta / max(temp, 0.001)):
            current = candidate
            cur_conn = cand_conn

        if cur_conn > best_conn:
            best = current.copy()
            best_conn = cur_conn

        history.append(cur_conn)

    best_ids = [i for i in range(n_proj) if best[i]]
    best_cost = sum(projects[i]['cost'] for i in best_ids)
    return best_ids, best_cost, best_conn, history

print("Running greedy optimizer...")
g_selected, g_cost, g_history = greedy_optimize(projects, budget, base_lc, patches, alpha)
print("Running simulated annealing (3000 iterations)...")
sa_selected, sa_cost, sa_conn, sa_hist = sa_optimize(projects, budget, base_lc, patches, alpha)

baseline_conn, baseline_pairs, baseline_min = compute_total_connectivity(base_lc, patches, alpha)
g_dist = apply_projects(base_lc, g_selected)
g_conn, g_pairs, g_min = compute_total_connectivity(g_dist, patches, alpha)
sa_dist = apply_projects(base_lc, sa_selected)
sa_conn_full, sa_pairs, sa_min = compute_total_connectivity(sa_dist, patches, alpha)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Baseline network
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i in range(n):
    for j in range(i+1, n):
        mig = np.exp(-alpha * base_lc[i,j])
        if mig > 0.01:
            ax.plot([patches[i]['y'], patches[j]['y']], [patches[i]['x'], patches[j]['x']],
                    '-', color='gray', linewidth=mig*20, alpha=0.5)
for p in patches:
    ax.scatter(p['y'], p['x'], s=p['pop']/5, c='#3b82f6', edgecolors='white', linewidths=1, zorder=5)
    ax.text(p['y']+2, p['x']+2, p['name'][:6], color='white', fontsize=7)
ax.set_title(f'Baseline (conn={baseline_conn:.0f}, pairs={baseline_pairs})', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 2: Greedy solution
ax = axes[0, 1]
ax.set_facecolor('#111827')
for i in range(n):
    for j in range(i+1, n):
        mig = np.exp(-alpha * g_dist[i,j])
        if mig > 0.01:
            # Check if this pair was improved
            improved = any(projects[pid]['i'] in (i,j) and projects[pid]['j'] in (i,j) for pid in g_selected)
            color = '#22c55e' if improved else 'gray'
            ax.plot([patches[i]['y'], patches[j]['y']], [patches[i]['x'], patches[j]['x']],
                    '-', color=color, linewidth=mig*20, alpha=0.7)
for p in patches:
    ax.scatter(p['y'], p['x'], s=p['pop']/5, c='#3b82f6', edgecolors='white', linewidths=1, zorder=5)
    ax.text(p['y']+2, p['x']+2, p['name'][:6], color='white', fontsize=7)
ax.set_title(f'Greedy (\${ g_cost}M, conn={g_conn:.0f}, pairs={g_pairs})', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 3: SA solution
ax = axes[0, 2]
ax.set_facecolor('#111827')
for i in range(n):
    for j in range(i+1, n):
        mig = np.exp(-alpha * sa_dist[i,j])
        if mig > 0.01:
            improved = any(projects[pid]['i'] in (i,j) and projects[pid]['j'] in (i,j) for pid in sa_selected)
            color = '#f59e0b' if improved else 'gray'
            ax.plot([patches[i]['y'], patches[j]['y']], [patches[i]['x'], patches[j]['x']],
                    '-', color=color, linewidth=mig*20, alpha=0.7)
for p in patches:
    ax.scatter(p['y'], p['x'], s=p['pop']/5, c='#3b82f6', edgecolors='white', linewidths=1, zorder=5)
    ax.text(p['y']+2, p['x']+2, p['name'][:6], color='white', fontsize=7)
ax.set_title(f'SA (\${sa_cost}M, conn={sa_conn_full:.0f}, pairs={sa_pairs})', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 4: Greedy build order
ax = axes[1, 0]
ax.set_facecolor('#111827')
costs = [h['cost'] for h in g_history]
conns = [h['connectivity'] for h in g_history]
ax.plot(costs, conns, 'o-', color='#22c55e', linewidth=2, markersize=8)
for i in range(1, len(g_history)):
    pid = g_history[i]['selected'][-1]
    ax.annotate(projects[pid]['name'][:10], (costs[i], conns[i]),
               color='white', fontsize=6, textcoords="offset points", xytext=(5, 5))
ax.set_xlabel('Cumulative cost ($M)', color='white')
ax.set_ylabel('Total connectivity', color='white')
ax.set_title('Greedy: connectivity vs investment', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 5: SA convergence
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(sa_hist, color='#f59e0b', linewidth=0.3, alpha=0.5)
window = 100
if len(sa_hist) > window:
    ma = np.convolve(sa_hist, np.ones(window)/window, mode='valid')
    ax.plot(range(window-1, len(sa_hist)), ma, color='#f59e0b', linewidth=2)
ax.axhline(g_conn, color='#22c55e', linestyle='--', label=f'Greedy: {g_conn:.0f}')
ax.set_xlabel('Iteration', color='white')
ax.set_ylabel('Connectivity', color='white')
ax.set_title('SA convergence', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Summary comparison
ax = axes[1, 2]
ax.set_facecolor('#111827')
scenarios = ['Baseline', 'Greedy', 'SA']
metric_vals = {
    'Connectivity': [baseline_conn, g_conn, sa_conn_full],
    'Connected pairs': [baseline_pairs * 10, g_pairs * 10, sa_pairs * 10],
}
x = np.arange(len(scenarios))
w = 0.35
ax.bar(x - w/2, metric_vals['Connectivity'], w, color='#22c55e', label='Connectivity', edgecolor='none')
ax.bar(x + w/2, metric_vals['Connected pairs'], w, color='#3b82f6', label='Connected pairs x10', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(scenarios, color='white')
ax.set_title('Optimization comparison', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 70)
print("CORRIDOR OPTIMIZER RESULTS")
print("=" * 70)
print(f"Budget: \${budget}M")
print()
print(f"{'Metric':<30} {'Baseline':>12} {'Greedy':>12} {'SA':>12}")
print("-" * 70)
print(f"{'Total connectivity':<30} {baseline_conn:>12.0f} {g_conn:>12.0f} {sa_conn_full:>12.0f}")
print(f"{'Connected pairs (Nm>=1)':<30} {baseline_pairs:>12} {g_pairs:>12} {sa_pairs:>12}")
print(f"{'Cost ($M)':<30} {'$0':>12} {'$'+str(g_cost):>12} {'$'+str(sa_cost):>12}")
print()
print("GREEDY PROJECTS:")
for pid in g_selected:
    p = projects[pid]
    print(f"  {p['name']:<25} \${p['cost']}M  (reduces {patches[p['i']]['name']}-{patches[p['j']]['name']} by {p['reduction']})")
print()
print("SA PROJECTS:")
for pid in sa_selected:
    p = projects[pid]
    print(f"  {p['name']:<25} \${p['cost']}M  (reduces {patches[p['i']]['name']}-{patches[p['j']]['name']} by {p['reduction']})")`,
      challenge: 'Try budgets of $30M, $55M, and $80M. Plot the total connectivity achieved at each budget level. Is there a point of diminishing returns? What is the minimum budget needed to achieve Nm >= 1 for all pairs?',
      successHint: 'You have built a complete corridor optimization system — from landscape resistance to population genetics to budget-constrained optimization. This is the workflow used by the Wildlife Institute of India and WWF for corridor planning across India.',
    },
    {
      title: 'Capstone Part 5 — Scenario analysis and 50-year metapopulation projection',
      concept: `The final piece: run your corridor optimizer forward in time. Given the optimal corridor investments, simulate the metapopulation over 50 years under different scenarios:

1. **Status quo**: no new corridors, current fragmentation continues
2. **Optimal investment**: build the corridors your optimizer selected
3. **Climate change**: resistance surfaces worsen (droughts reduce forest quality, increasing resistance by 20%)
4. **Combined**: optimal investment + climate change

For each scenario, track:
- Total metapopulation size over time
- Genetic diversity (heterozygosity, measured as a function of effective population size and migration)
- Probability of metapopulation persistence (does any component go extinct?)
- Expected time to first local extinction

This is the **decision support output** — the visualization that goes to policymakers. It answers the question: "What happens if we invest/don\'t invest in corridors over the next 50 years?"`,
      analogy: 'This is the weather forecast for elephant populations. Just as meteorologists run multiple climate models forward and present the range of outcomes ("temperatures will rise 2-4 degrees"), we run multiple corridor scenarios forward and present the range of population outcomes. Policymakers do not need to understand graph theory or metapopulation dynamics — they need clear visualizations of consequences.',
      storyConnection: 'The corridor story ends with hope: the elephants are still using the corridor, but for how long? This simulation gives a concrete answer. Without intervention, the model might predict a 70% chance of corridor failure within 25 years. With $55M investment, that drops to 10%. That single number — "70% becomes 10%" — is the story the optimizer tells.',
      checkQuestion: 'Your simulation shows the metapopulation persists under the optimal investment scenario but crashes under climate change. A policymaker asks: "Should we invest in corridors if climate change will undo the benefits?" How do you answer?',
      checkAnswer: 'Corridors do not prevent climate change, but they provide resilience. A connected metapopulation can shift its range as conditions change — animals move to higher elevations, cooler areas, or wetter regions through corridors. An isolated metapopulation cannot adapt because it cannot move. Corridors are MORE valuable under climate change, not less. The investment is climate adaptation.',
      codeIntro: 'Run the full 50-year metapopulation simulation under four scenarios and generate the decision-support dashboard.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Patch data
patches = [
    {'name': 'Kaziranga', 'pop': 1200, 'Ne': 400, 'K': 1500, 'x': 15, 'y': 40},
    {'name': 'Karbi', 'pop': 400, 'Ne': 130, 'K': 600, 'x': 40, 'y': 55},
    {'name': 'Nagaon', 'pop': 250, 'Ne': 80, 'K': 350, 'x': 35, 'y': 20},
    {'name': 'Manas', 'pop': 800, 'Ne': 270, 'K': 1000, 'x': 10, 'y': 65},
    {'name': 'Nameri', 'pop': 350, 'Ne': 120, 'K': 500, 'x': 60, 'y': 60},
    {'name': 'Dibru', 'pop': 500, 'Ne': 170, 'K': 700, 'x': 70, 'y': 35},
]
n = len(patches)
alpha = 0.015

# Distances: baseline and optimized (from Part 4)
base_lc = np.array([
    [0, 85, 110, 130, 180, 200],
    [85, 0, 95, 170, 120, 160],
    [110, 95, 0, 190, 165, 140],
    [130, 170, 190, 0, 150, 220],
    [180, 120, 165, 150, 0, 100],
    [200, 160, 140, 220, 100, 0],
])

# Optimized distances (after corridor improvements)
opt_lc = base_lc.copy()
opt_lc[0,1] = opt_lc[1,0] = 55   # Kaz-Karbi improved
opt_lc[1,2] = opt_lc[2,1] = 60   # Karbi-Nagaon improved
opt_lc[4,5] = opt_lc[5,4] = 60   # Nameri-Dibru improved
opt_lc[2,5] = opt_lc[5,2] = 90   # Nagaon-Dibru improved

# Climate change: increase all distances by 20%
climate_base = base_lc * 1.2
climate_opt = opt_lc * 1.2

def simulate_metapop(patches, lc_dist, alpha, years=50, n_runs=20):
    """Stochastic metapopulation simulation."""
    n = len(patches)
    results = {'pop_total': [], 'heterozygosity': [], 'n_extant': [], 'first_extinction': []}

    for run in range(n_runs):
        pops = np.array([p['pop'] for p in patches], dtype=float)
        Ks = np.array([p['K'] for p in patches], dtype=float)
        het = 0.75  # initial heterozygosity
        pop_history = [pops.copy()]
        het_history = [het]
        first_ext = years  # default: no extinction

        for year in range(years):
            # Demographic growth: logistic with stochasticity
            r = 0.05  # intrinsic growth rate for elephants
            for i in range(n):
                if pops[i] > 0:
                    growth = r * pops[i] * (1 - pops[i] / Ks[i])
                    # Environmental stochasticity
                    growth += np.random.normal(0, pops[i] * 0.05)
                    pops[i] = max(0, pops[i] + growth)

                    # Demographic stochasticity for small populations
                    if pops[i] < 50 and pops[i] > 0:
                        if np.random.random() < 0.1:  # 10% extinction risk for tiny pops
                            pops[i] = 0

            # Migration through corridors
            mig_rates = np.exp(-alpha * lc_dist) * 0.01
            migrants = np.zeros((n, n))
            for i in range(n):
                for j in range(n):
                    if i != j and pops[i] > 0:
                        m = pops[i] * mig_rates[i, j]
                        m = min(m, pops[i] * 0.05)  # cap at 5% emigration
                        migrants[i, j] = m

            for i in range(n):
                outflow = np.sum(migrants[i, :])
                inflow = np.sum(migrants[:, i])
                pops[i] = max(0, pops[i] - outflow + inflow)

            # Heterozygosity decay: H(t+1) = H(t) * (1 - 1/(2*Ne_total)) + migration_boost
            Ne_total = sum(max(p * 0.33, 1) for p in pops if p > 0)
            het = het * (1 - 1 / (2 * max(Ne_total, 1)))
            # Migration maintains heterozygosity
            total_migrants = np.sum(migrants)
            het = min(het + total_migrants * 0.0001, 0.8)

            pop_history.append(pops.copy())
            het_history.append(het)

            # Track first extinction
            n_extant = sum(1 for p in pops if p > 10)
            if n_extant < n and first_ext == years:
                first_ext = year

        results['pop_total'].append([np.sum(ph) for ph in pop_history])
        results['heterozygosity'].append(het_history)
        results['n_extant'].append([sum(1 for p in ph if p > 10) for ph in pop_history])
        results['first_extinction'].append(first_ext)

    return results

# Run all four scenarios
print("Simulating 4 scenarios x 20 runs x 50 years...")
scenarios = {
    'Status quo': simulate_metapop(patches, base_lc, alpha),
    'Optimal corridors': simulate_metapop(patches, opt_lc, alpha),
    'Climate change': simulate_metapop(patches, climate_base, alpha),
    'Corridors + climate': simulate_metapop(patches, climate_opt, alpha),
}
print("Done!")

colors = {'Status quo': '#ef4444', 'Optimal corridors': '#22c55e',
          'Climate change': '#f59e0b', 'Corridors + climate': '#3b82f6'}

# --- Decision support dashboard ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('ELEPHANT CORRIDOR OPTIMIZER — 50-YEAR PROJECTION', color='white', fontsize=14, fontweight='bold')

# Plot 1: Total population
ax = axes[0, 0]
ax.set_facecolor('#111827')
for name, res in scenarios.items():
    pops = np.array(res['pop_total'])
    mean_pop = np.mean(pops, axis=0)
    lo = np.percentile(pops, 10, axis=0)
    hi = np.percentile(pops, 90, axis=0)
    years_x = range(len(mean_pop))
    ax.plot(years_x, mean_pop, color=colors[name], linewidth=2, label=name)
    ax.fill_between(years_x, lo, hi, color=colors[name], alpha=0.15)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Total population', color='white')
ax.set_title('Metapopulation size', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Genetic diversity
ax = axes[0, 1]
ax.set_facecolor('#111827')
for name, res in scenarios.items():
    hets = np.array(res['heterozygosity'])
    mean_het = np.mean(hets, axis=0)
    ax.plot(mean_het, color=colors[name], linewidth=2, label=name)
ax.axhline(0.5, color='gray', linestyle=':', linewidth=1, label='Critical threshold')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Heterozygosity', color='white')
ax.set_title('Genetic diversity', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Extant patches
ax = axes[0, 2]
ax.set_facecolor('#111827')
for name, res in scenarios.items():
    ext = np.array(res['n_extant'])
    mean_ext = np.mean(ext, axis=0)
    ax.plot(mean_ext, color=colors[name], linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Occupied patches', color='white')
ax.set_title('Patches with viable populations', color='white', fontsize=11)
ax.set_ylim(0, n + 0.5)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Extinction risk
ax = axes[1, 0]
ax.set_facecolor('#111827')
for idx, (name, res) in enumerate(scenarios.items()):
    first_ext = res['first_extinction']
    # Probability of at least one extinction by year t
    n_runs = len(first_ext)
    years_range = range(51)
    cum_risk = [sum(1 for fe in first_ext if fe <= t) / n_runs for t in years_range]
    ax.plot(years_range, cum_risk, color=colors[name], linewidth=2, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('P(at least one extinction)', color='white')
ax.set_title('Cumulative extinction risk', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Summary bar chart
ax = axes[1, 1]
ax.set_facecolor('#111827')
scenario_names = list(scenarios.keys())
final_pops = [np.mean([r[-1] for r in scenarios[s]['pop_total']]) for s in scenario_names]
bars = ax.bar(range(len(scenario_names)), final_pops,
              color=[colors[s] for s in scenario_names], edgecolor='none')
ax.set_xticks(range(len(scenario_names)))
ax.set_xticklabels([s[:12] for s in scenario_names], color='white', fontsize=8, rotation=20)
ax.set_ylabel('Population at year 50', color='white')
ax.set_title('Final population comparison', color='white', fontsize=11)
for bar, val in zip(bars, final_pops):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 30,
            f'{val:.0f}', ha='center', color='white', fontsize=9, fontweight='bold')
ax.tick_params(colors='gray')

# Plot 6: Decision matrix
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
table_data = []
for name in scenario_names:
    res = scenarios[name]
    final_pop = np.mean([r[-1] for r in res['pop_total']])
    final_het = np.mean([r[-1] for r in res['heterozygosity']])
    mean_ext_year = np.mean(res['first_extinction'])
    ext_risk = sum(1 for fe in res['first_extinction'] if fe < 50) / len(res['first_extinction'])
    table_data.append([name[:14], f'{final_pop:.0f}', f'{final_het:.2f}', f'{ext_risk:.0%}', f'{mean_ext_year:.0f}'])

table = ax.table(cellText=table_data,
                colLabels=['Scenario', 'Pop@50', 'Het@50', 'Ext risk', 'Mean ext yr'],
                cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(8)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(color='white', fontweight='bold')
ax.set_title('Decision support summary', color='white', fontsize=11, pad=20)

plt.tight_layout()
plt.show()

print("=" * 70)
print("DECISION SUPPORT SUMMARY")
print("=" * 70)
print()
for name in scenario_names:
    res = scenarios[name]
    final_pop = np.mean([r[-1] for r in res['pop_total']])
    final_het = np.mean([r[-1] for r in res['heterozygosity']])
    ext_risk = sum(1 for fe in res['first_extinction'] if fe < 50) / len(res['first_extinction'])
    print(f"{name}:")
    print(f"  Population at year 50: {final_pop:.0f} elephants")
    print(f"  Genetic diversity: {final_het:.2f}")
    print(f"  Extinction risk (50yr): {ext_risk:.0%}")
    print()

print("RECOMMENDATION:")
print("  Invest in corridor optimization now. The cost of inaction is")
print("  measured in elephant populations, genetic diversity, and")
print("  irreversible extinctions. Corridors provide resilience against")
print("  both current fragmentation and future climate change.")`,
      challenge: 'Add a fifth scenario: "Delayed investment" where corridor improvements happen at year 25 instead of year 0. How much worse is the outcome compared to immediate investment? This quantifies the cost of delay and creates urgency for policymakers.',
      successHint: 'You have built a complete, end-to-end conservation decision support system. From resistance surfaces through graph algorithms, population genetics, optimization, and scenario projection — this is exactly the workflow used by the Wildlife Institute of India, WWF, and the IUCN to plan elephant corridor investments across Asia.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Corridor Optimizer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (conservation ecology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project builds a complete Corridor Optimizer using Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
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
