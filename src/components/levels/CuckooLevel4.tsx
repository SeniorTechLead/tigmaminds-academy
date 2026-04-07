import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CuckooLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone overview — Migration Route Predictor',
      concept: `In this capstone you will build a **bird migration route predictor** that models how environmental variables shape migration paths. This is real conservation science — understanding migration routes is essential for protecting stopover habitats and identifying collision risks with wind turbines and buildings.

The pipeline:
1. **Environmental grid**: Generate a landscape with temperature, wind, terrain elevation, food availability, and water bodies
2. **Cost surface**: Convert environmental layers into a migration cost surface — energy expenditure per kilometer at each location
3. **Optimal route finding**: Use Dijkstra's algorithm or dynamic programming to find the least-cost migration path
4. **Climate scenarios**: Predict how routes shift under climate change by modifying environmental layers
5. **Conservation analysis**: Identify critical stopover sites and migration bottlenecks

The core idea: birds do not fly in straight lines. They optimize energy expenditure by riding tailwinds, avoiding headwinds, following terrain features (coastlines, mountain passes), and stopping at high-quality refueling sites. The migration route emerges from the interaction of the bird's physiology with the environmental landscape.`,
      analogy: 'Migration route prediction is like GPS navigation for birds. Your car GPS finds the fastest route by considering road speeds, traffic, and tolls. The migration predictor finds the least-energy route by considering winds, terrain, and food availability. Both are optimization problems on a spatial network — the math is identical.',
      storyConnection: 'The cuckoo in the story arrived at dawn after its long migration. This capstone reveals the hidden complexity of that journey — thousands of kilometers optimized to minimize energy expenditure, with each stopover site critical for survival. Understanding the route is the first step to protecting it.',
      checkQuestion: 'A straight-line migration from England to central Africa is 6,000 km. Real cuckoo migration routes are 9,000-12,000 km. Why the huge detour?',
      checkAnswer: 'Several reasons: (1) avoiding the Sahara Desert (no food, extreme heat) by going around via the Mediterranean coast, (2) exploiting tailwinds in weather systems that do not align with the straight-line path, (3) following coastlines and mountain ranges that provide navigation landmarks and thermal uplift, (4) reaching stopover sites with abundant food. The energetically optimal path is almost never the geometrically shortest path.',
      codeIntro: 'Stage 1: Build the environmental landscape and cost surface for migration route optimization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Create geographic grid (simplified Europe-Africa transect)
grid_size = 80  # 80x80 cells, each ~50km
lat = np.linspace(60, -10, grid_size)  # 60°N to 10°S
lon = np.linspace(-15, 55, grid_size)  # 15°W to 55°E
LON, LAT = np.meshgrid(lon, lat)

# ---- Environmental layers ----

# 1. Terrain elevation (m)
elevation = 200 * np.ones((grid_size, grid_size))
# Alps
alps_mask = ((LAT > 44) & (LAT < 48) & (LON > 5) & (LON < 16))
elevation[alps_mask] = 2500 + 1000 * np.random.rand(alps_mask.sum())
# Sahara (flat but hostile)
sahara = ((LAT > 15) & (LAT < 30) & (LON > -5) & (LON < 40))
elevation[sahara] = 400
# Atlas mountains
atlas = ((LAT > 30) & (LAT < 35) & (LON > -5) & (LON < 10))
elevation[atlas] = 2000

# 2. Wind (tailwind component, positive = helpful)
# Prevailing westerlies in Europe, trades in tropics
wind = np.zeros((grid_size, grid_size))
wind[LAT > 35] = 5 + 3 * np.sin(LON[LAT > 35] * 0.1)  # westerlies
wind[(LAT > 15) & (LAT <= 35)] = -3  # Sahara headwinds
wind[LAT <= 15] = 2  # trades

wind += np.random.normal(0, 2, (grid_size, grid_size))

# 3. Food availability (0-1)
food = 0.5 * np.ones((grid_size, grid_size))
# Fertile areas
food[(LAT > 35) & (LAT < 55)] = 0.8  # Europe
food[(LAT > 0) & (LAT < 15)] = 0.7    # sub-Saharan
food[sahara] = 0.05  # desert
# Water bodies boost food
med_sea = ((LAT > 34) & (LAT < 38) & (LON > 0) & (LON < 35))
food[med_sea] = 0.1  # sea = no food
food += np.random.uniform(-0.1, 0.1, (grid_size, grid_size))
food = np.clip(food, 0, 1)

# 4. Water bodies (barrier)
water = np.zeros((grid_size, grid_size))
water[med_sea] = 1  # Mediterranean
# Some coastline
water[(LAT > 42) & (LAT < 44) & (LON > 10) & (LON < 18)] = 0.5

# ---- Cost surface ----
def compute_cost_surface(elevation, wind, food, water,
                          w_elev=0.3, w_wind=0.4, w_food=0.2, w_water=0.1):
    """
    Compute migration cost per cell.
    High cost = difficult to cross. Low cost = easy.
    """
    # Elevation cost: flying over mountains is expensive
    elev_cost = elevation / 3000  # normalized

    # Wind cost: headwinds are costly, tailwinds reduce cost
    wind_cost = np.clip(-wind / 10 + 0.5, 0, 1)  # headwind=1, tailwind=0

    # Food cost: low food = must carry more reserves
    food_cost = 1 - food  # no food = high cost

    # Water cost: barrier
    water_cost = water * 2  # large water crossings are very costly

    total = (w_elev * elev_cost + w_wind * wind_cost +
             w_food * food_cost + w_water * water_cost)

    return np.clip(total, 0.01, None)

cost = compute_cost_surface(elevation, wind, food, water)

fig, axes = plt.subplots(2, 3, figsize=(18, 10))
fig.patch.set_facecolor('#1f2937')

layers = [elevation, wind, food, water, cost]
titles = ['Elevation (m)', 'Wind (tailwind m/s)', 'Food availability',
          'Water barriers', 'Migration cost surface']
cmaps = ['terrain', 'RdYlGn', 'YlGn', 'Blues', 'hot_r']

for ax, layer, title, cmap in zip(axes.flat[:5], layers, titles, cmaps):
    ax.set_facecolor('#111827')
    im = ax.pcolormesh(LON, LAT, layer, cmap=cmap, shading='auto')
    ax.plot(-0.1, 51.5, 'o', color='cyan', markersize=8)  # London
    ax.plot(32, 0, '*', color='yellow', markersize=12)  # Uganda
    ax.set_title(title, color='white', fontsize=10)
    ax.tick_params(colors='gray', labelsize=7)
    plt.colorbar(im, ax=ax, fraction=0.046)

# Summary
ax = axes.flat[5]
ax.set_facecolor('#111827')
ax.axis('off')
summary = """MIGRATION ENVIRONMENT
====================
Grid: 80x80 (~50km cells)
Latitude: 60°N to 10°S
Longitude: 15°W to 55°E

Start: London (51.5°N, 0.1°W)
End: Uganda (0°N, 32°E)

Key barriers:
  Alps (2500m+)
  Mediterranean Sea
  Sahara Desert

Key features:
  European westerlies (tailwind)
  Sahara headwinds
  Sub-Saharan food abundance"""
ax.text(0.1, 0.95, summary, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', fontfamily='monospace', color='#22c55e')

plt.tight_layout()
plt.show()

print("Environmental grid created: {0}x{0} cells".format(grid_size))
print(f"Cost surface range: {cost.min():.3f} - {cost.max():.3f}")
print(f"Sahara avg cost: {cost[sahara].mean():.3f}")
print(f"Europe avg cost: {cost[(LAT > 40) & (LAT < 55)].mean():.3f}")
print(f"Stage 1 complete. Next: find optimal migration route.")`,
      challenge: 'Add a "night migration" modifier: many birds migrate at night to avoid predators and use cooler air. Make the wind layer time-dependent (different wind at night) and add a predation risk layer that is higher during the day.',
      successHint: 'The environmental layers are the foundation of any spatial ecology model. Real migration research uses the same approach with satellite-derived environmental data at much higher resolution.',
    },
    {
      title: 'Optimal route finding — Dijkstra\'s algorithm on a landscape',
      concept: `With the cost surface defined, finding the optimal migration route is a **shortest-path problem** on a grid graph. Each cell is a node, connected to its 8 neighbors (including diagonals). The edge weight is the cost of moving to that neighbor.

**Dijkstra's algorithm** finds the globally optimal path:
1. Start at the source cell. Set its distance to 0, all others to infinity.
2. Mark the unvisited cell with the smallest distance as "current."
3. For each neighbor of current: if distance through current < neighbor's known distance, update it.
4. Mark current as visited. Repeat until destination is reached.

For migration, we modify the cost to account for:
- **Direction preference**: birds prefer to fly roughly south-southwest. Add a penalty for deviating from the preferred heading.
- **Distance cost**: longer moves cost more energy. Diagonal moves cover √2 times the distance.
- **Barrier penalty**: water crossings and high mountains get extra cost.

The algorithm output is the least-cost path — the route that minimizes total energy expenditure. This predicted route can be compared to real GPS-tracked migration paths (which often match remarkably well).`,
      analogy: 'Dijkstra\'s algorithm is like water flowing downhill on a topographic map. Water always finds the path of least resistance — it never climbs unless forced. The algorithm does the same thing in cost-space: it propagates outward from the start, always expanding into the cheapest unexplored cell, guaranteeing the globally optimal path.',
      storyConnection: 'The cuckoo\'s migration from England to Africa is not a random wander — it follows the least-cost path through the environmental landscape. The bird does not consciously solve Dijkstra\'s algorithm, but millions of years of natural selection have encoded the optimal route into its behavior. Birds that deviated died; birds that followed efficient routes survived.',
      checkQuestion: 'Dijkstra\'s algorithm finds the globally optimal path. But real birds do not have global information — they can only sense local conditions. How do they approximate the optimal path?',
      checkAnswer: 'Birds use a combination of (1) innate genetic programs (direction and distance, providing a rough plan), (2) local environmental cues (wind direction, visibility, stars) for real-time adjustments, and (3) learned landmarks from previous migrations (experienced adults). This is like driving with a rough map (genetic program) and adjusting based on traffic you encounter (local cues). The result is near-optimal but not perfectly optimal — explaining why real tracks are more variable than the Dijkstra solution.',
      codeIntro: 'Implement Dijkstra\'s algorithm on the migration cost surface and find the optimal route from England to Africa.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Rebuild cost surface (compact)
gs = 80
lat = np.linspace(60, -10, gs)
lon = np.linspace(-15, 55, gs)
LON, LAT = np.meshgrid(lon, lat)
elev = 200*np.ones((gs,gs))
elev[((LAT>44)&(LAT<48)&(LON>5)&(LON<16))] = 2500
sahara = (LAT>15)&(LAT<30)&(LON>-5)&(LON<40)
wind = np.where(LAT>35, 5, np.where(LAT>15, -3, 2)) + np.random.normal(0,1.5,(gs,gs))
food = np.where(sahara, 0.05, np.where((LAT>35)&(LAT<55), 0.8, 0.5))
med = (LAT>34)&(LAT<38)&(LON>0)&(LON<35)
food[med] = 0.1
cost = 0.3*elev/3000 + 0.4*np.clip(-wind/10+0.5,0,1) + 0.2*(1-food) + 0.1*(med.astype(float)*2)
cost = np.clip(cost, 0.01, None)

# Start and end cells
start_lat, start_lon = 51.5, -0.1
end_lat, end_lon = 0, 32
start_r = np.argmin(np.abs(lat - start_lat))
start_c = np.argmin(np.abs(lon - start_lon))
end_r = np.argmin(np.abs(lat - end_lat))
end_c = np.argmin(np.abs(lon - end_lon))

# ---- Dijkstra's algorithm ----
def dijkstra_migration(cost_grid, start, end, direction_penalty=0.3):
    rows, cols = cost_grid.shape
    INF = 1e15
    dist = np.full((rows, cols), INF)
    visited = np.zeros((rows, cols), dtype=bool)
    parent = np.full((rows, cols, 2), -1, dtype=int)

    sr, sc = start
    er, ec = end
    dist[sr, sc] = 0

    # 8-connected neighbors
    neighbors = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    diag = {(-1,-1),(-1,1),(1,-1),(1,1)}

    # Preferred direction (roughly south-southeast)
    pref_dr = 1  # south
    pref_dc = 0.5  # slightly east

    # Simple priority: process in order of distance
    # (Using array scan instead of heap for simplicity)
    for _ in range(rows * cols):
        # Find unvisited cell with minimum distance
        temp = dist.copy()
        temp[visited] = INF
        if temp.min() >= INF:
            break
        cr, cc = np.unravel_index(temp.argmin(), (rows, cols))

        if cr == er and cc == ec:
            break

        visited[cr, cc] = True

        for dr, dc in neighbors:
            nr, nc = cr + dr, cc + dc
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr, nc]:
                # Base cost
                move_dist = np.sqrt(2) if (dr, dc) in diag else 1.0
                cell_cost = cost_grid[nr, nc] * move_dist

                # Direction penalty (prefer southward movement)
                dir_cost = direction_penalty * ((dr - pref_dr)**2 + (dc - pref_dc)**2) * 0.1

                new_dist = dist[cr, cc] + cell_cost + dir_cost

                if new_dist < dist[nr, nc]:
                    dist[nr, nc] = new_dist
                    parent[nr, nc] = [cr, cc]

    # Trace path
    path = [(er, ec)]
    r, c = er, ec
    while (r, c) != (sr, sc) and parent[r, c, 0] >= 0:
        r, c = parent[r, c]
        path.append((r, c))
    path.reverse()

    return path, dist

# Run Dijkstra
path_optimal, dist_map = dijkstra_migration(cost, (start_r, start_c), (end_r, end_c))
path_arr = np.array(path_optimal)

# Also compute straight-line path for comparison
n_steps = len(path_optimal)
straight_r = np.linspace(start_r, end_r, n_steps).astype(int)
straight_c = np.linspace(start_c, end_c, n_steps).astype(int)
straight_cost = sum(cost[r, c] for r, c in zip(straight_r, straight_c))
optimal_cost = sum(cost[r, c] for r, c in path_optimal)

# Compute path statistics
path_lats = lat[path_arr[:, 0]]
path_lons = lon[path_arr[:, 1]]
km_per_cell = 50
path_length_km = len(path_optimal) * km_per_cell
straight_length_km = np.sqrt(((start_lat-end_lat)*111)**2 + ((start_lon-end_lon)*85)**2)

fig, axes = plt.subplots(1, 2, figsize=(16, 7))
fig.patch.set_facecolor('#1f2937')

# Optimal route on cost surface
ax = axes[0]
ax.set_facecolor('#111827')
ax.pcolormesh(LON, LAT, cost, cmap='hot_r', shading='auto', alpha=0.7)
ax.plot(path_lons, path_lats, '-', color='#22c55e', linewidth=3, label='Optimal route')
ax.plot(lon[straight_c], lat[straight_r], '--', color='#3b82f6', linewidth=2,
        alpha=0.5, label='Straight line')
ax.plot(lon[start_c], lat[start_r], 'o', color='cyan', markersize=12, label='Start')
ax.plot(lon[end_c], lat[end_r], '*', color='yellow', markersize=15, label='Destination')
ax.set_xlabel('Longitude', color='white')
ax.set_ylabel('Latitude', color='white')
ax.set_title('Optimal migration route (Dijkstra)', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Cost accumulation along path
ax = axes[1]
ax.set_facecolor('#111827')
cum_cost = np.cumsum([cost[r, c] for r, c in path_optimal])
cum_straight = np.cumsum([cost[r, c] for r, c in zip(straight_r, straight_c)])
ax.plot(range(len(cum_cost)), cum_cost, color='#22c55e', linewidth=2, label='Optimal route')
ax.plot(range(len(cum_straight)), cum_straight, color='#3b82f6', linewidth=2,
        alpha=0.7, label='Straight line')
ax.set_xlabel('Steps along path', color='white')
ax.set_ylabel('Cumulative cost', color='white')
ax.set_title('Energy expenditure comparison', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Migration route analysis:")
print(f"  Optimal path: {path_length_km:.0f} km ({len(path_optimal)} cells)")
print(f"  Straight line: {straight_length_km:.0f} km")
print(f"  Detour ratio: {path_length_km/straight_length_km:.2f}x")
print(f"  Optimal cost: {optimal_cost:.1f}")
print(f"  Straight cost: {straight_cost:.1f}")
print(f"  Cost savings: {100*(1-optimal_cost/straight_cost):.0f}%")
print(f"  The detour saves {100*(1-optimal_cost/straight_cost):.0f}% energy despite being {100*(path_length_km/straight_length_km-1):.0f}% longer.")`,
      challenge: 'Add wind seasonality: autumn migration has different prevailing winds than spring return. Compute optimal routes for both directions and compare. Real cuckoos take different routes in autumn vs spring — does your model predict this?',
      successHint: 'The Dijkstra solution predicts the general shape of real migration routes remarkably well. The key insight is that the "shortest" path in distance is almost never the "cheapest" path in energy.',
    },
    {
      title: 'Climate scenarios — how warming reshapes migration',
      concept: `Climate change alters every environmental layer simultaneously: temperatures shift, wind patterns change, vegetation zones migrate, and barriers (deserts, sea ice) expand or contract. The migration route that was optimal 50 years ago may be suboptimal — or even lethal — today.

We model two climate scenarios:
- **RCP 4.5** (moderate warming): +2°C by 2100, modest changes to wind and vegetation
- **RCP 8.5** (high warming): +4.5°C by 2100, major shifts in wind, expanded Sahara, disrupted food timing

For each scenario, we recompute the environmental layers, rebuild the cost surface, and find the new optimal route. The comparison reveals:
- **Route shifts**: does the path move east or west?
- **New bottlenecks**: do new barriers emerge (expanded Sahara, dried wetlands)?
- **Stopover loss**: do key refueling sites lose food availability?
- **Total cost change**: does migration become more or less energetically expensive?`,
      analogy: 'Climate scenarios for migration are like road construction predictions for your daily commute. If they close a major highway (Sahara expansion), you need a new route. If they build a new shortcut (new tailwind pattern), your commute gets easier. Climate change is restructuring the bird\'s "highway network" — some roads close, others open, and the optimal route shifts.',
      storyConnection: 'The cuckoo in the story follows a route perfected over millennia. Climate change is rewriting the map. In 50 years, the story might need a new title — "When the Cuckoo Calls Too Late" — if the migration route becomes too costly and the timing mismatch too severe for the species to persist.',
      checkQuestion: 'If the Sahara expands northward by 200 km due to climate change, what specific effect would this have on European cuckoo migration?',
      checkAnswer: 'The expanded Sahara creates a wider barrier with zero food and extreme heat. Birds must either (1) carry more fat reserves to cross a wider desert (requiring longer stopovers = later arrival), (2) detour further to go around (longer route = more energy), or (3) attempt the crossing and risk death from dehydration. Real data shows that species unable to adjust their Sahara-crossing strategy are declining faster than species with flexible routes. The Sahara is the migration bottleneck, and its expansion tightens the bottleneck.',
      codeIntro: 'Model climate change effects on migration: recompute cost surfaces under warming scenarios and compare optimal routes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
gs = 80
lat = np.linspace(60, -10, gs)
lon = np.linspace(-15, 55, gs)
LON, LAT = np.meshgrid(lon, lat)

def make_environment(warming=0):
    """Generate environmental layers with climate change."""
    elev = 200*np.ones((gs,gs))
    elev[((LAT>44)&(LAT<48)&(LON>5)&(LON<16))] = 2500

    # Sahara expands with warming (3 degrees latitude per °C)
    sahara_north = 30 + warming * 3
    sahara = (LAT>15)&(LAT<sahara_north)&(LON>-5)&(LON<40)

    # Wind shifts with warming
    wind = np.where(LAT>35, 5-warming*0.5, np.where(LAT>15, -3-warming*0.3, 2))
    wind += np.random.normal(0, 1.5, (gs,gs))

    # Food shifts with warming
    food = np.where(sahara, 0.05, np.where((LAT>35)&(LAT<55), 0.8-warming*0.05, 0.5))
    med = (LAT>34)&(LAT<38)&(LON>0)&(LON<35)
    food[med] = 0.1
    food = np.clip(food + np.random.uniform(-0.05, 0.05, (gs,gs)), 0, 1)

    cost = 0.3*elev/3000 + 0.4*np.clip(-wind/10+0.5,0,1) + 0.2*(1-food) + 0.1*(med.astype(float)*2)
    return np.clip(cost, 0.01, None), sahara, wind, food

def dijkstra_fast(cost_grid, start, end):
    rows, cols = cost_grid.shape
    dist = np.full((rows,cols), 1e15)
    visited = np.zeros((rows,cols), dtype=bool)
    parent = np.full((rows,cols,2), -1, dtype=int)
    dist[start] = 0
    neighbors = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    for _ in range(rows*cols):
        temp = dist.copy(); temp[visited] = 1e15
        if temp.min() >= 1e15: break
        cr,cc = np.unravel_index(temp.argmin(),(rows,cols))
        if (cr,cc)==end: break
        visited[cr,cc]=True
        for dr,dc in neighbors:
            nr,nc = cr+dr,cc+dc
            if 0<=nr<rows and 0<=nc<cols and not visited[nr,nc]:
                md = np.sqrt(2) if abs(dr)+abs(dc)==2 else 1.0
                nd = dist[cr,cc] + cost_grid[nr,nc]*md + 0.03*((dr-1)**2+(dc-0.5)**2)
                if nd < dist[nr,nc]:
                    dist[nr,nc]=nd; parent[nr,nc]=[cr,cc]
    path = [end]; r,c = end
    while (r,c)!=start and parent[r,c,0]>=0:
        r,c = parent[r,c]; path.append((r,c))
    path.reverse()
    return path, dist

sr = np.argmin(np.abs(lat-51.5))
sc = np.argmin(np.abs(lon+0.1))
er = np.argmin(np.abs(lat-0))
ec = np.argmin(np.abs(lon-32))

# Three scenarios
scenarios = [
    ('Current climate', 0),
    ('RCP 4.5 (+2°C)', 2),
    ('RCP 8.5 (+4.5°C)', 4.5),
]

paths = {}
costs_total = {}
for name, warming in scenarios:
    cost, sahara, wind, food = make_environment(warming)
    path, dist = dijkstra_fast(cost, (sr,sc), (er,ec))
    paths[name] = np.array(path)
    costs_total[name] = sum(cost[r,c] for r,c in path)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Routes comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
cost_current, _, _, _ = make_environment(0)
ax.pcolormesh(LON, LAT, cost_current, cmap='hot_r', shading='auto', alpha=0.5)
route_colors = ['#22c55e', '#3b82f6', '#ef4444']
for (name, _), color in zip(scenarios, route_colors):
    p = paths[name]
    ax.plot(lon[p[:,1]], lat[p[:,0]], linewidth=2.5, color=color, label=name)
ax.plot(lon[sc], lat[sr], 'o', color='cyan', markersize=10)
ax.plot(lon[ec], lat[er], '*', color='yellow', markersize=12)
ax.set_title('Migration routes under climate scenarios', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Cost comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
names = list(costs_total.keys())
vals = list(costs_total.values())
bars = ax.bar(names, vals, color=route_colors, edgecolor='none', width=0.5)
for bar, v in zip(bars, vals):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.5,
            f'{v:.0f}', ha='center', color='white', fontsize=11)
ax.set_ylabel('Total migration cost', color='white')
ax.set_title('Energy expenditure by scenario', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Route length comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
lengths = [len(p)*50 for p in paths.values()]
bars = ax.bar(names, lengths, color=route_colors, edgecolor='none', width=0.5)
for bar, l in zip(bars, lengths):
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+50,
            f'{l:.0f} km', ha='center', color='white', fontsize=10)
ax.set_ylabel('Path length (km)', color='white')
ax.set_title('Migration distance by scenario', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Sahara expansion visualization
ax = axes[1, 1]
ax.set_facecolor('#111827')
for warming, color, label in [(0, '#22c55e', 'Current'), (2, '#3b82f6', '+2°C'), (4.5, '#ef4444', '+4.5°C')]:
    sahara_n = 30 + warming * 3
    ax.axhspan(15, sahara_n, alpha=0.2, color=color, label=f'{label}: Sahara to {sahara_n:.0f}°N')
    ax.axhline(sahara_n, color=color, linewidth=2)
ax.set_xlim(-15, 55)
ax.set_ylim(0, 50)
ax.set_xlabel('Longitude', color='white')
ax.set_ylabel('Latitude', color='white')
ax.set_title('Sahara Desert expansion under warming', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Climate change impact on migration:")
for name, c in costs_total.items():
    l = len(paths[name]) * 50
    print(f"  {name}: cost={c:.0f}, distance={l:.0f} km")
pct_increase = 100 * (costs_total['RCP 8.5 (+4.5°C)'] / costs_total['Current climate'] - 1)
print(f"\\n  Under RCP 8.5, migration costs increase by {pct_increase:.0f}%")
print(f"  This means birds need {pct_increase:.0f}% more fat reserves")
print(f"  or face {pct_increase:.0f}% higher mortality during migration.")`,
      challenge: 'Add a "stopover quality" analysis: identify cells along each route where the bird would need to stop and refuel (every 500 km). Compare food availability at these stopover sites across scenarios. Which stopovers are most vulnerable to climate change?',
      successHint: 'Migration route prediction under climate change directly informs conservation policy: which stopover sites to protect, where to build wildlife corridors, and which species are most at risk from route disruption.',
    },
    {
      title: 'Conservation analysis — identifying critical stopover sites and bottlenecks',
      concept: `The final stage converts model outputs into actionable conservation recommendations. The key outputs are:

1. **Critical stopover sites**: locations along the route where birds must stop to refuel. Losing these sites is like removing gas stations from a highway — birds cannot complete the journey.
2. **Migration bottlenecks**: narrow geographic features (mountain passes, strait crossings) where all birds in a population are funneled. Threats at bottlenecks affect the entire population.
3. **Conservation priority map**: combining route density, stopover importance, and threat level to identify where protection effort will have the greatest impact.
4. **Scenario comparison**: how priority rankings change under different climate futures.

The output is a **spatial decision support tool** — the same type of product that conservation organizations like BirdLife International use to identify Important Bird Areas (IBAs) and advocate for legal protection.`,
      analogy: 'Conservation analysis is like identifying the most critical bridges on a highway network. If a minor rural road closes, traffic reroutes easily. If a major bridge collapses, the entire region is cut off. Stopover sites and migration bottlenecks are the "critical bridges" of migration — losing them can collapse entire populations.',
      storyConnection: 'The cuckoo\'s journey from Africa to Assam crosses multiple countries and habitats. This conservation analysis would identify which specific forests, wetlands, and coastlines along that route are irreplaceable — the handful of sites where protection makes the difference between the cuckoo continuing to call at dawn and falling silent forever.',
      checkQuestion: 'Two stopover sites have equal food availability. Site A is used by 80% of the migrating population (bottleneck). Site B is used by 10% (alternative route). Which should receive conservation priority?',
      checkAnswer: 'Site A, overwhelmingly. Losing Site B affects 10% of the population — significant but survivable. Losing Site A affects 80% — potentially catastrophic. Conservation resources should be allocated proportional to the fraction of the population that depends on each site. This is the principle behind IBA (Important Bird Area) designation: protect the sites where birds concentrate.',
      codeIntro: 'Generate the complete conservation priority map and produce a final migration management report.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
gs = 80
lat = np.linspace(60, -10, gs)
lon = np.linspace(-15, 55, gs)
LON, LAT = np.meshgrid(lon, lat)

# Rebuild environment and routes for multiple scenarios
def make_env(w=0):
    elev=200*np.ones((gs,gs))
    elev[((LAT>44)&(LAT<48)&(LON>5)&(LON<16))]=2500
    sn=30+w*3; sahara=(LAT>15)&(LAT<sn)&(LON>-5)&(LON<40)
    wind=np.where(LAT>35,5-w*.5,np.where(LAT>15,-3-w*.3,2))+np.random.normal(0,1.5,(gs,gs))
    food=np.where(sahara,.05,np.where((LAT>35)&(LAT<55),.8-w*.05,.5))
    med=(LAT>34)&(LAT<38)&(LON>0)&(LON<35); food[med]=.1
    food=np.clip(food+np.random.uniform(-.05,.05,(gs,gs)),0,1)
    cost=.3*elev/3000+.4*np.clip(-wind/10+.5,0,1)+.2*(1-food)+.1*(med.astype(float)*2)
    return np.clip(cost,.01,None), food

def djk(cost, start, end):
    rows,cols=cost.shape; dist=np.full((rows,cols),1e15)
    visited=np.zeros((rows,cols),dtype=bool); parent=np.full((rows,cols,2),-1,dtype=int)
    dist[start]=0; nb=[(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    for _ in range(rows*cols):
        t=dist.copy(); t[visited]=1e15
        if t.min()>=1e15: break
        cr,cc=np.unravel_index(t.argmin(),(rows,cols))
        if (cr,cc)==end: break
        visited[cr,cc]=True
        for dr,dc in nb:
            nr,nc=cr+dr,cc+dc
            if 0<=nr<rows and 0<=nc<cols and not visited[nr,nc]:
                md=np.sqrt(2) if abs(dr)+abs(dc)==2 else 1.0
                nd=dist[cr,cc]+cost[nr,nc]*md+.03*((dr-1)**2+(dc-.5)**2)
                if nd<dist[nr,nc]: dist[nr,nc]=nd; parent[nr,nc]=[cr,cc]
    path=[end]; r,c=end
    while (r,c)!=start and parent[r,c,0]>=0: r,c=parent[r,c]; path.append((r,c))
    path.reverse(); return path

sr,sc = np.argmin(np.abs(lat-51.5)), np.argmin(np.abs(lon+0.1))
er,ec = np.argmin(np.abs(lat-0)), np.argmin(np.abs(lon-32))

# Run multiple simulations (population of routes with variation)
n_birds = 30
route_density = np.zeros((gs, gs))
stopover_density = np.zeros((gs, gs))

for bird in range(n_birds):
    # Each bird has slightly different cost weighting
    cost_base, food_base = make_env(warming=np.random.uniform(0, 1))
    noise = np.random.normal(1, 0.1, (gs, gs))
    cost_individual = cost_base * np.clip(noise, 0.5, 1.5)
    path = djk(cost_individual, (sr, sc), (er, ec))
    for r, c in path:
        route_density[r, c] += 1
    # Stopovers every ~500 km (10 cells)
    for i in range(0, len(path), 10):
        r, c = path[i]
        stopover_density[max(0,r-1):r+2, max(0,c-1):c+2] += 1

# Identify bottlenecks (high route density = funneling)
bottleneck_threshold = np.percentile(route_density[route_density > 0], 90)
bottlenecks = route_density >= bottleneck_threshold

# Conservation priority score
cost_current, food_current = make_env(0)
threat_level = 1 - food_current  # low food = high threat
priority = route_density / max(route_density.max(), 1) * 0.4 + \
           stopover_density / max(stopover_density.max(), 1) * 0.3 + \
           threat_level * 0.3
priority[route_density == 0] = 0

# Climate vulnerability (compare current vs RCP 8.5)
cost_future, food_future = make_env(4.5)
food_loss = np.clip(food_current - food_future, 0, 1)
vulnerability = priority * food_loss

fig, axes = plt.subplots(2, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')

# Route density
ax = axes[0, 0]
ax.set_facecolor('#111827')
rd = np.ma.masked_where(route_density == 0, route_density)
ax.pcolormesh(LON, LAT, rd, cmap='YlOrRd', shading='auto')
ax.contour(LON, LAT, bottlenecks.astype(float), levels=[0.5], colors=['white'], linewidths=2)
ax.plot(lon[sc], lat[sr], 'o', color='cyan', markersize=10)
ax.plot(lon[ec], lat[er], '*', color='yellow', markersize=12)
ax.set_title(f'Route density ({n_birds} simulated birds)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Conservation priority
ax = axes[0, 1]
ax.set_facecolor('#111827')
pm = np.ma.masked_where(priority < 0.01, priority)
im = ax.pcolormesh(LON, LAT, pm, cmap='YlGn', shading='auto')
ax.set_title('Conservation priority score', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, label='Priority')

# Stopover analysis
ax = axes[1, 0]
ax.set_facecolor('#111827')
sd = np.ma.masked_where(stopover_density == 0, stopover_density)
im = ax.pcolormesh(LON, LAT, sd, cmap='hot', shading='auto')
# Mark top 5 stopover sites
flat_sd = stopover_density.flatten()
top5_idx = np.argsort(flat_sd)[-5:]
for idx in top5_idx:
    r, c = np.unravel_index(idx, (gs, gs))
    ax.plot(lon[c], lat[r], 's', color='#22c55e', markersize=12, markeredgecolor='white', markeredgewidth=2)
    ax.annotate(f'({lat[r]:.0f}°, {lon[c]:.0f}°)', (lon[c], lat[r]),
                textcoords="offset points", xytext=(8, 5), fontsize=7, color='white')
ax.set_title('Stopover site importance', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Final report
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.axis('off')
n_bottleneck_cells = bottlenecks.sum()
total_priority_area = (priority > np.percentile(priority[priority>0], 75)).sum() * 50**2  # km²
n_critical_stopovers = (stopover_density > np.percentile(stopover_density[stopover_density>0], 90)).sum()

report = f"""MIGRATION CONSERVATION REPORT
{'='*45}

ROUTE ANALYSIS
  Simulated birds:     {n_birds}
  Route corridor width: ~{(route_density>0).sum()//gs*50:.0f} km
  Bottleneck cells:    {n_bottleneck_cells} ({n_bottleneck_cells*2500:.0f} km²)

STOPOVER SITES
  Total stopovers identified: {(stopover_density>0).sum()}
  Critical stopovers (top 10%): {n_critical_stopovers}
  Top sites need immediate protection

CONSERVATION PRIORITY
  High-priority area:  {total_priority_area:.0f} km²
  Bottlenecks:         Require STRICT protection
  Stopovers:           Require habitat management

CLIMATE VULNERABILITY
  Food loss (RCP 8.5): {food_loss[route_density>0].mean()*100:.0f}% along route
  Most vulnerable zone: Sahara-Sahel border

RECOMMENDATIONS
  1. Designate top 5 stopovers as IBAs
  2. Protect bottleneck corridors legally
  3. Monitor stopover food annually
  4. Model routes every 5 years as
     climate shifts
"""
ax.text(0.02, 0.98, report, transform=ax.transAxes, fontsize=8,
        verticalalignment='top', fontfamily='monospace', color='#22c55e')

plt.tight_layout()
plt.show()

print("CAPSTONE COMPLETE: Migration Route Predictor")
print("=" * 48)
print(f"  Identified {n_bottleneck_cells} bottleneck cells for priority protection")
print(f"  {n_critical_stopovers} critical stopover sites mapped")
print(f"  Climate vulnerability: {food_loss[route_density>0].mean()*100:.0f}% food loss predicted")
print()
print("This tool provides the spatial evidence base for")
print("protecting the cuckoo's migration corridor — from")
print("English hedgerows to African woodlands.")`,
      challenge: 'Add a wind turbine collision risk layer: place 20 wind farms along the route and compute how many simulated birds pass within 5 km of a turbine. Identify which wind farm locations are most dangerous and recommend relocations.',
      successHint: 'You have built a complete migration route prediction and conservation planning tool. This same methodology — environmental cost surfaces, optimal routing, scenario analysis — is used by every major bird conservation organization to identify and protect critical migration corridors worldwide.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Migration Route Predictor
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (ornithology & evolution)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete migration route prediction system in Python. Click to start.</p>
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
