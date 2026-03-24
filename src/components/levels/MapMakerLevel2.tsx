import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MapMakerLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'GPS — how it works (trilateration from space)',
      concept: `GPS is a constellation of 31 satellites orbiting at ~20,200 km altitude. Your phone uses signals from these satellites to calculate position via **trilateration** — measuring distances from known points.

How GPS works:
1. Each satellite broadcasts its position and exact time (atomic clock)
2. Your receiver measures the time delay
3. Distance = speed of light x time delay. Each distance defines a sphere.
4. With 3 satellites: 3 spheres intersect at 2 points (one in space, one on Earth)
5. A 4th satellite corrects your receiver's clock error

**Error sources**: atmospheric delay (~5m, correctable), multipath (~1m, buildings reflect signals), satellite geometry (DOP), and clock error (nanoseconds = metres).

**DGPS**: a reference station at a known location broadcasts corrections. Accuracy improves from +/-3m to +/-1cm. **RTK**: real-time centimetre accuracy for surveying.`,
      analogy: 'GPS trilateration is like standing in a dark room and clapping. If you know how far away three walls are (by timing the echo), you can calculate your exact position. Three distances pin you to one point.',
      storyConnection: 'The granddaughter\'s grandmother mapped the Khasi Hills with a compass and chain — it took decades. With GPS, the granddaughter collects the same data in days. "GPS tells you WHERE you are. But it doesn\'t tell you what to map, why it matters, or how to draw it. The technology changes; the craft remains."',
      checkQuestion: 'GPS accuracy is ~3m for consumer devices but ~1cm for survey-grade. Both use the same satellites. What\'s different?',
      checkAnswer: 'Survey-grade receivers use: 1) Carrier-phase measurement (tracking wave cycles, not just code). 2) Dual-frequency reception (L1+L2, cancels ionospheric delay). 3) Differential correction from a nearby base station. 4) Longer observation time (averaging). The physics is the same; the measurement precision is different.',
      codeIntro: 'Simulate GPS trilateration: find position from distances to three satellites.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

true_x, true_y = 5, 4

sats = [(1, 8), (8, 9), (9, 2)]
sat_names = ['Sat 1', 'Sat 2', 'Sat 3']
sat_colors = ['#ef4444', '#22c55e', '#3b82f6']

true_dists = [np.sqrt((sx - true_x)**2 + (sy - true_y)**2) for sx, sy in sats]

ax1.set_facecolor('#111827')
for (sx, sy), dist, name, color in zip(sats, true_dists, sat_names, sat_colors):
    theta = np.linspace(0, 2 * np.pi, 100)
    ax1.plot(sx + dist * np.cos(theta), sy + dist * np.sin(theta),
             color=color, linewidth=2, label=f'{name} (d={dist:.1f}km)')
    ax1.scatter(sx, sy, c=color, s=100, marker='*', zorder=5, edgecolors='white', linewidths=1)

ax1.scatter(true_x, true_y, c='white', s=200, marker='o', zorder=5, edgecolors='#f59e0b', linewidths=3)
ax1.text(true_x + 0.3, true_y - 0.5, f'Position\\n({true_x}, {true_y})', color='white', fontsize=10)
ax1.set_xlabel('East (km)', color='white')
ax1.set_ylabel('North (km)', color='white')
ax1.set_title('Perfect GPS Trilateration', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_xlim(-2, 14); ax1.set_ylim(-2, 14); ax1.set_aspect('equal')

ax2.set_facecolor('#111827')
n_fixes = 500
error_std = 0.3

np.random.seed(42)
fix_x = true_x + np.random.normal(0, error_std, n_fixes)
fix_y = true_y + np.random.normal(0, error_std, n_fixes)

ax2.scatter(fix_x, fix_y, c='#3b82f6', s=5, alpha=0.3, label='Individual fixes')
ax2.scatter(true_x, true_y, c='#ef4444', s=100, marker='+', linewidths=3, zorder=5, label='True position')
ax2.scatter(np.mean(fix_x), np.mean(fix_y), c='#22c55e', s=100, marker='x', linewidths=3, zorder=5, label='Average fix')

for r, label in [(0.3, '1σ'), (0.6, '2σ'), (0.9, '3σ')]:
    circle = plt.Circle((true_x, true_y), r, fill=False, edgecolor='#f59e0b', linestyle='--', linewidth=1)
    ax2.add_patch(circle)
    ax2.text(true_x + r, true_y + 0.1, label, color='#f59e0b', fontsize=8)

ax2.set_xlabel('East (km)', color='white')
ax2.set_ylabel('North (km)', color='white')
ax2.set_title(f'GPS Error Distribution (σ = {error_std*1000:.0f}m)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
ax2.set_xlim(true_x - 1.5, true_x + 1.5); ax2.set_ylim(true_y - 1.5, true_y + 1.5); ax2.set_aspect('equal')

plt.tight_layout()
plt.show()

errors = np.sqrt((fix_x - true_x)**2 + (fix_y - true_y)**2)
print("GPS accuracy simulation:")
print(f"  True: ({true_x}, {true_y}), Mean fix: ({np.mean(fix_x):.3f}, {np.mean(fix_y):.3f})")
print(f"  Mean error: {np.mean(errors)*1000:.0f}m, 95th %ile: {np.percentile(errors, 95)*1000:.0f}m")`,
      challenge: 'If you average 100 GPS readings, the error drops by sqrt(100) = 10x. Simulate this: take means of groups of 100 fixes. This is how survey-grade GPS achieves sub-centimetre accuracy.',
      successHint: 'GPS relies on Einstein\'s relativity, atomic physics, orbital mechanics, and signal processing. Every ride-hailing app, drone, and autonomous vehicle depends on the same trilateration math.',
    },
    {
      title: 'Digital elevation models — the terrain in numbers',
      concept: `A **DEM** is a grid of elevation values representing 3D terrain. Every cell contains one number: the height at that point.

DEM sources: **SRTM** (30m, free), **ASTER** (30m, free), **LiDAR** (0.5-5m, usually not free), **drone photogrammetry** (5-30cm).

What you can derive: slope, aspect (direction), hillshade (3D visualization), drainage networks, viewsheds, cut-and-fill volumes.

At 30m resolution, all of NE India (~262,000 km²) = ~290 million elevation values — fits on a USB stick but describes an entire landscape.`,
      analogy: 'A DEM is like a spreadsheet where each cell is a pixel of terrain. A 30m DEM means each pixel covers 30m x 30m. The value is the height. Zoom in: individual pixels. Zoom out: mountains and rivers emerge from the numbers.',
      storyConnection: 'The granddaughter downloaded free SRTM data and had a 3D model of the hills her grandmother spent decades surveying. "Is my work obsolete?" "Never. SRTM can\'t see the spring behind the rock, or the trail through the bamboo. Your maps have ground truth."',
      checkQuestion: 'A 30m DEM shows a hilltop at 500m. GPS on the hilltop reads 512m. Why the 12m error?',
      checkAnswer: 'The DEM averages a 30m x 30m cell (a sharp peak averages lower). SRTM measures radar return surface (trees add 5-15m). Inherent accuracy is +/-5-10m. For a sharp forested peak, all three compound.',
      codeIntro: 'Generate a DEM and derive slope, aspect, hillshade, and drainage.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

grid_size = 200
cell_size = 30
x = np.arange(grid_size) * cell_size / 1000
y = np.arange(grid_size) * cell_size / 1000
X, Y = np.meshgrid(x, y)

dem = (500 + 200 * np.exp(-((X-2)**2 + (Y-4)**2) / 1.5)
      + 150 * np.exp(-((X-4.5)**2 + (Y-2)**2) / 1.0)
      - 80 * np.exp(-((X-3)**2) / 0.5) * (Y < 3.5).astype(float)
      + 50 * np.sin(X) * np.cos(Y * 1.5)
      + 8 * np.random.rand(grid_size, grid_size))

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

ax = axes[0, 0]; ax.set_facecolor('#111827')
im = ax.imshow(dem, origin='lower', extent=[0, x[-1], 0, y[-1]], cmap='terrain', aspect='equal')
ax.set_title('DEM (elevation)', color='white', fontsize=11)
plt.colorbar(im, ax=ax, label='Elevation (m)', fraction=0.046)
ax.tick_params(colors='gray')

ax = axes[0, 1]; ax.set_facecolor('#111827')
dy, dx = np.gradient(dem, cell_size)
slope = np.degrees(np.arctan(np.sqrt(dx**2 + dy**2)))
im = ax.imshow(slope, origin='lower', extent=[0, x[-1], 0, y[-1]], cmap='YlOrRd', aspect='equal')
ax.set_title('Slope (degrees)', color='white', fontsize=11)
plt.colorbar(im, ax=ax, label='Slope (°)', fraction=0.046)
ax.tick_params(colors='gray')

ax = axes[0, 2]; ax.set_facecolor('#111827')
aspect = np.degrees(np.arctan2(-dx, dy)) % 360
im = ax.imshow(aspect, origin='lower', extent=[0, x[-1], 0, y[-1]], cmap='hsv', aspect='equal')
ax.set_title('Aspect (direction)', color='white', fontsize=11)
plt.colorbar(im, ax=ax, label='Aspect (°)', fraction=0.046)
ax.tick_params(colors='gray')

ax = axes[1, 0]; ax.set_facecolor('#111827')
from matplotlib.colors import LightSource
ls = LightSource(azdeg=315, altdeg=45)
hillshade = ls.hillshade(dem, vert_exag=2, dx=cell_size, dy=cell_size)
ax.imshow(hillshade, origin='lower', extent=[0, x[-1], 0, y[-1]], cmap='gray', aspect='equal')
ax.set_title('Hillshade', color='white', fontsize=11)
ax.tick_params(colors='gray')

ax = axes[1, 1]; ax.set_facecolor('#111827')
levels = np.arange(400, 750, 25)
ax.imshow(hillshade, origin='lower', extent=[0, x[-1], 0, y[-1]], cmap='gray', alpha=0.5)
cs = ax.contour(X, Y, dem, levels=levels, colors='#f59e0b', linewidths=0.5)
ax.clabel(cs, inline=True, fontsize=6, fmt='%d')
ax.set_title('Contours on hillshade', color='white', fontsize=11)
ax.tick_params(colors='gray')

ax = axes[1, 2]; ax.set_facecolor('#111827')
ax.hist(dem.flatten(), bins=50, color='#22c55e', alpha=0.7, density=True)
ax.axvline(dem.mean(), color='#f59e0b', linestyle='--', linewidth=2, label=f'Mean: {dem.mean():.0f}m')
ax.set_xlabel('Elevation (m)', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Elevation Distribution', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("DEM Statistics:")
print(f"  Grid: {grid_size}×{grid_size} cells ({grid_size*cell_size/1000:.1f}km × {grid_size*cell_size/1000:.1f}km)")
print(f"  Elevation: {dem.min():.0f}m to {dem.max():.0f}m (range: {dem.max()-dem.min():.0f}m)")
print(f"  Mean slope: {slope.mean():.1f}°, Max: {slope.max():.1f}°")
print(f"  Steep area (>30°): {np.sum(slope > 30) / slope.size * 100:.1f}%")`,
      challenge: 'Calculate the viewshed from the highest point: which cells have an unobstructed line of sight to the summit? This is how telecom companies place cell towers.',
      successHint: 'DEMs are the foundation of modern terrain analysis. Every flood model, road design, and solar energy assessment starts with a DEM.',
    },
    {
      title: 'OpenStreetMap — the Wikipedia of maps',
      concept: `**OpenStreetMap** (OSM) is a free, editable map of the world built by 10+ million volunteers. Anyone can edit it: trace buildings from satellite imagery, add roads, mark shops.

Why OSM matters for NE India:
- Google Maps has poor rural coverage; OSM volunteers have mapped 100,000+ buildings in Assam flood zones
- Free forever — no corporate lock-in
- Local knowledge (springs, trails, sacred groves) becomes globally accessible
- Humanitarian mapping saves lives during floods and disasters

Data model: nodes (points), ways (lines/polygons), relations. Tags: key=value pairs like building=school, highway=primary, natural=water.`,
      analogy: 'OSM is a giant collaborative puzzle. Each contributor adds a few pieces. Individually small; collectively, a map of the entire world.',
      storyConnection: 'The granddaughter attended a mapathon and traced 200 buildings in Assam\'s flood zones. "These buildings might save someone during the next flood. Relief teams need to know where people are." She then mapped her entire village over the next week.',
      checkQuestion: 'Why is OSM sometimes more accurate in rural NE India than Google Maps?',
      checkAnswer: 'Google relies on commercial data providers with less incentive for rural areas. OSM relies on local volunteers who know the village name, that the "road" is a footpath, that the river changed course. Local knowledge beats remote sensing for ground truth.',
      codeIntro: 'Simulate an OSM-style mapping exercise: building tracing and tagging.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

n_buildings = 30
building_data = []
for _ in range(n_buildings):
    bx = np.random.uniform(1, 9)
    by = np.random.uniform(1, 9)
    w = np.random.uniform(0.2, 0.6)
    h = np.random.uniform(0.2, 0.5)
    btype = np.random.choice(['residential', 'commercial', 'school', 'hospital'], p=[0.7, 0.15, 0.1, 0.05])
    building_data.append((bx, by, w, h, btype))

ax1.set_facecolor('#2d4a2d')
for bx, by, w, h, btype in building_data:
    rect = plt.Rectangle((bx - w/2, by - h/2), w, h, facecolor='#888888', edgecolor='none', alpha=0.8)
    ax1.add_patch(rect)
ax1.plot([0, 10], [5, 5], color='#555555', linewidth=4)
ax1.plot([5, 5], [0, 10], color='#555555', linewidth=3)
river_x = np.linspace(0, 10, 100)
river_y = 2 + 0.5 * np.sin(river_x)
ax1.plot(river_x, river_y, color='#2d5a8a', linewidth=4)
ax1.set_xlim(0, 10); ax1.set_ylim(0, 10)
ax1.set_title('"Satellite Imagery" (before mapping)', color='white', fontsize=11)
ax1.tick_params(colors='gray'); ax1.set_aspect('equal')

ax2.set_facecolor('#f5f0e1')
type_colors = {'residential': '#d4a574', 'commercial': '#f59e0b', 'school': '#3b82f6', 'hospital': '#ef4444'}
type_counts = {t: 0 for t in type_colors}

for bx, by, w, h, btype in building_data:
    rect = plt.Rectangle((bx - w/2, by - h/2), w, h, facecolor=type_colors[btype], edgecolor='black', linewidth=0.5, alpha=0.7)
    ax2.add_patch(rect)
    type_counts[btype] += 1

ax2.plot([0, 10], [5, 5], color='#333333', linewidth=4, label='highway=primary')
ax2.plot([5, 5], [0, 10], color='#666666', linewidth=2.5, label='highway=secondary')
ax2.fill_between(river_x, river_y - 0.15, river_y + 0.15, color='#aadaff', alpha=0.8)
ax2.plot(river_x, river_y, color='#3b82f6', linewidth=1, label='natural=water')

for btype, color in type_colors.items():
    ax2.scatter([], [], c=color, s=100, marker='s', label=f'building={btype} ({type_counts[btype]})')

ax2.set_xlim(0, 10); ax2.set_ylim(0, 10)
ax2.set_title('OpenStreetMap Version (after mapping)', color='white', fontsize=11)
ax2.legend(facecolor='white', fontsize=7, loc='upper right')
ax2.tick_params(colors='gray'); ax2.set_aspect('equal')

plt.tight_layout()
plt.show()

print("OSM Mapping Statistics:")
print(f"  Buildings traced: {n_buildings}")
for btype, count in type_counts.items():
    print(f"    {btype}: {count}")
print()
print("This is how OSM grows: one traced building at a time.")
print("10 million contributors × a few buildings each = the whole world mapped.")`,
      challenge: 'Which buildings are within 0.5km of the river (flood risk)? Calculate and tag them as flood_risk=yes. This is exactly what humanitarian mappers do before disaster season.',
      successHint: 'OSM is used by Doctors Without Borders, the UN, Uber, and Facebook. Contributing to OSM is contributing to global public infrastructure.',
    },
    {
      title: 'Web maps — Leaflet, Mapbox, and interactive cartography',
      concept: `Modern maps are interactive: zoom, pan, click for info, toggle layers, update in real time.

**Tile-based rendering**: the map is pre-cut into 256x256 pixel tiles at multiple zoom levels. Zoom 0 = 1 tile (whole world). Zoom 18 = ~69 billion tiles (street level). Only visible tiles load.

**Key libraries**: Leaflet (lightweight, open-source, ~40KB), Mapbox GL (WebGL, 3D terrain), OpenLayers (enterprise-grade), Google Maps API (commercial).

A typical web map: Leaflet + OSM tiles + your GeoJSON data. Free, lightweight, works on any device.`,
      analogy: 'A web map is like Netflix for geography. Netflix doesn\'t send the entire movie — it streams the frame you\'re watching. Web maps only load the tiles you\'re viewing at your current zoom level.',
      storyConnection: 'The granddaughter built her first web map: grandmother\'s survey data on OSM tiles, viewable in any browser. Her cousin in Bangalore could zoom into the school, the well, even the big banyan tree. A map that took 30 years to create was now accessible worldwide.',
      checkQuestion: 'At zoom 15, each tile covers ~1.2km. If a user pans rapidly across 10km, how does the map keep up?',
      checkAnswer: 'Tile caching (reuse loaded tiles), pre-fetching (load adjacent tiles), progressive loading (show blurry low-zoom tile while loading sharp one), debouncing (skip intermediate requests), and CDN (serve from nearby servers).',
      codeIntro: 'Simulate a web map tile system and zoom levels.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

np.random.seed(42)
full_res = 256
terrain = np.random.rand(full_res, full_res) * 0.5 + 0.5
for _ in range(5):
    cx, cy = np.random.randint(0, full_res, 2)
    r = np.random.randint(20, 60)
    y_grid, x_grid = np.ogrid[-cx:full_res-cx, -cy:full_res-cy]
    mask = x_grid**2 + y_grid**2 <= r**2
    terrain[mask] += 0.2
terrain = np.clip(terrain, 0, 1)

zoom_configs = [
    (0, 0, 256, 'Zoom 0: 1 tile (whole world)'),
    (0, 0, 128, 'Zoom 1: 4 tiles (NW quarter)'),
    (0, 0, 64, 'Zoom 2: 16 tiles'),
    (0, 0, 32, 'Zoom 3: 64 tiles'),
    (0, 0, 16, 'Zoom 4: 256 tiles'),
]

for i, (ax, (y0, x0, size, title)) in enumerate(zip(axes.flat[:5], zoom_configs)):
    ax.set_facecolor('#111827')
    tile = terrain[y0:y0+size, x0:x0+size]
    ax.imshow(tile, origin='lower', cmap='terrain', interpolation='nearest', aspect='equal')
    if i > 0:
        tile_size = max(1, size // 2) if i < 4 else max(1, size // 4)
        for g in range(0, size, max(1, tile_size)):
            ax.axhline(g, color='white', linewidth=0.5, alpha=0.5)
            ax.axvline(g, color='white', linewidth=0.5, alpha=0.5)
    ax.set_title(title, color='white', fontsize=10)
    ax.tick_params(colors='gray')

ax = axes[1, 2]; ax.set_facecolor('#111827')
zoom_levels = np.arange(0, 20)
n_tiles = 4.0 ** zoom_levels
tile_size_m = 40075000 / (2.0 ** zoom_levels)

ax.semilogy(zoom_levels, n_tiles, 'o-', color='#ef4444', linewidth=2, label='Number of tiles')
ax_twin = ax.twinx()
ax_twin.semilogy(zoom_levels, tile_size_m / 1000, 's-', color='#22c55e', linewidth=2, label='Tile size (km)')

ax.set_xlabel('Zoom level', color='white')
ax.set_ylabel('Number of tiles', color='#ef4444')
ax_twin.set_ylabel('Tile size (km)', color='#22c55e')
ax.set_title('Web Map Tile System', color='white', fontsize=11)
ax.tick_params(axis='y', colors='#ef4444')
ax_twin.tick_params(axis='y', colors='#22c55e')
ax.tick_params(axis='x', colors='gray')

lines1, labels1 = ax.get_legend_handles_labels()
lines2, labels2 = ax_twin.get_legend_handles_labels()
ax.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)

plt.tight_layout()
plt.show()

print("Web map tile system:")
for z in [0, 5, 10, 15, 18]:
    n = 4**z
    size_km = 40075 / (2**z)
    print(f"  Zoom {z:2d}: {n:>15,} tiles, each {size_km:>10.1f} km")`,
      challenge: 'At zoom 15, your screen shows 4x3 = 12 tiles (1024x768 pixels). With edge buffering, it loads ~30. Calculate the data transfer if each tile is 30KB.',
      successHint: 'Web maps are the interface between geographic data and billions of users. Every map on your phone uses tiles, zoom levels, and interactive overlays.',
    },
    {
      title: 'Spatial analysis — asking questions of the map',
      concept: `The real power of digital mapping is **spatial analysis**: asking geographic questions computationally.

Core operations:
- **Buffer**: zones around features ("all areas within 5km of hospital")
- **Overlay**: combine layers ("forest areas in flood zones")
- **Nearest neighbour**: closest feature ("nearest water source for each village")
- **Kernel density**: concentration patterns ("traffic accident clusters")
- **Network analysis**: shortest path on a road network
- **Facility location**: optimal placement to minimize travel time`,
      analogy: 'Spatial analysis is like asking a map questions and getting numerical answers. A paper map shows where the hospital is. GIS tells you: "42% of population is >10km from a hospital, and the optimal new location is (X, Y)."',
      storyConnection: 'The granddaughter mapped access to clean water in the Khasi Hills: village locations, springs, paths, elevation. Result: 23 villages where women walk >3km for water, and 5 optimal locations for new piped systems. Her grandmother\'s mapping now saves time and lives.',
      checkQuestion: 'A government wants 3 new schools for 50 villages. How would GIS find optimal locations?',
      checkAnswer: 'The facility location problem: load villages and populations, define constraints (5km max, 100 students min), optimize to minimize total student travel distance, then check feasibility (flat land, road access, water).',
      codeIntro: 'Solve a facility location problem: place 3 clinics to serve the most people.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

n_villages = 50
village_x = np.random.uniform(0, 20, n_villages)
village_y = np.random.uniform(0, 20, n_villages)
village_pop = np.random.randint(200, 5000, n_villages)

n_clinics = 3
best_score = float('inf')
best_clinics = None

for trial in range(5000):
    clinic_x = np.random.uniform(2, 18, n_clinics)
    clinic_y = np.random.uniform(2, 18, n_clinics)
    total_weighted_dist = 0
    for i in range(n_villages):
        dists = [np.sqrt((village_x[i] - cx)**2 + (village_y[i] - cy)**2)
                 for cx, cy in zip(clinic_x, clinic_y)]
        total_weighted_dist += min(dists) * village_pop[i]
    if total_weighted_dist < best_score:
        best_score = total_weighted_dist
        best_clinics = list(zip(clinic_x.copy(), clinic_y.copy()))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.scatter(village_x, village_y, s=village_pop / 30, c='#3b82f6', alpha=0.6,
           edgecolors='white', linewidths=0.5, label='Villages (size=pop)')
ax1.set_title('Villages Without Clinics', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_xlim(0, 20); ax1.set_ylim(0, 20); ax1.set_aspect('equal')

ax2.set_facecolor('#111827')
clinic_colors = ['#ef4444', '#22c55e', '#f59e0b']
village_assignment = np.zeros(n_villages, dtype=int)
village_dists = np.zeros(n_villages)

for i in range(n_villages):
    dists = [np.sqrt((village_x[i] - cx)**2 + (village_y[i] - cy)**2) for cx, cy in best_clinics]
    village_assignment[i] = np.argmin(dists)
    village_dists[i] = min(dists)

for c in range(n_clinics):
    mask = village_assignment == c
    ax2.scatter(village_x[mask], village_y[mask], s=village_pop[mask] / 30,
               c=clinic_colors[c], alpha=0.6, edgecolors='white', linewidths=0.5)
    cx, cy = best_clinics[c]
    ax2.scatter(cx, cy, c=clinic_colors[c], s=200, marker='P', edgecolors='white', linewidths=2, zorder=5, label=f'Clinic {c+1}')
    theta = np.linspace(0, 2*np.pi, 100)
    ax2.plot(cx + 5*np.cos(theta), cy + 5*np.sin(theta), '--', color=clinic_colors[c], linewidth=1, alpha=0.5)
    for i in np.where(mask)[0]:
        ax2.plot([cx, village_x[i]], [cy, village_y[i]], '-', color=clinic_colors[c], linewidth=0.3, alpha=0.3)

ax2.set_title('Optimal Clinic Placement', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, ncol=3)
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 20); ax2.set_ylim(0, 20); ax2.set_aspect('equal')

plt.tight_layout()
plt.show()

print("Facility Location Results:")
for c in range(n_clinics):
    mask = village_assignment == c
    cx, cy = best_clinics[c]
    print(f"  Clinic {c+1} ({cx:.1f}, {cy:.1f}): {np.sum(mask)} villages, {village_pop[mask].sum():,} people, avg {village_dists[mask].mean():.1f}km")

underserved = np.sum(village_dists > 5)
print(f"\\n  Villages >5km from any clinic: {underserved} ({underserved/n_villages*100:.0f}%)")`,
      challenge: 'Add a constraint: clinics must be near a road (within 0.5km of y=10). How does this change optimal locations? Real facility location always has constraints.',
      successHint: 'Spatial analysis transforms maps from pictures into decision-making tools. Every hospital location, school district, and evacuation route is the result of spatial analysis.',
    },
    {
      title: 'Drone mapping — democratizing aerial surveys',
      concept: `Drones have democratized aerial mapping. What once required expensive aircraft can now be done with a $1,000 drone and free software.

**Photogrammetry workflow**: plan flight (altitude = resolution, 70-80% overlap), capture 200-1000+ photos in a grid, process with software (OpenDroneMap, Pix4D) to build orthomosaic, DEM, and 3D point cloud.

At 100m altitude: ~3cm/pixel — 1,000x better than satellite. You can see individual plants and count roof tiles.

NE India applications: flood damage assessment, agricultural monitoring, cultural heritage documentation, infrastructure inspection.

Limitations: 20-40 min battery, no rain/wind, DGCA regulations (400ft max, visual line of sight).`,
      analogy: 'Drone mapping is like a flying photocopier for the landscape. Instead of putting a document on glass, you fly the glass over the document. Instead of one scan, you take hundreds of overlapping photos. The software reconstructs a 3D model from the overlap.',
      storyConnection: 'The granddaughter flew 4 drone flights over 3 villages, capturing 2,000 photos. By evening: an orthomosaic showing every building, a DEM of every dip, a rotatable 3D model. "It took grandmother 30 years to map what I mapped in a day. But it will take me 30 years to understand the land as well as she does."',
      checkQuestion: 'At 100m altitude with 80% overlap: 3cm/pixel. At 50m: 1.5cm/pixel but 4x more photos. When is higher resolution worth it?',
      checkAnswer: 'Depends on application. Building counting: 3cm sufficient. Individual plant health: 1.5cm needed. Archaeological carved detail: need even higher. Road cracks: 1.5cm shows individual cracks. Rule: only fly as low as your application demands.',
      codeIntro: 'Simulate a drone mapping mission: flight path, coverage, and resolution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

area_width = 500
area_height = 400
altitude = 100
sensor_width = 6.17e-3
focal_length = 8.8e-3
gsd = altitude * sensor_width / (focal_length * 5472)
photo_width_m = gsd * 5472
photo_height_m = gsd * 3648

overlap_forward = 0.80
overlap_side = 0.70
strip_spacing = photo_width_m * (1 - overlap_side)
photo_spacing = photo_height_m * (1 - overlap_forward)

n_strips = int(np.ceil(area_width / strip_spacing)) + 1
n_photos_per_strip = int(np.ceil(area_height / photo_spacing)) + 1
total_photos = n_strips * n_photos_per_strip

ax = axes[0, 0]; ax.set_facecolor('#111827')
for i in range(n_strips):
    x_pos = i * strip_spacing
    if i % 2 == 0:
        ax.plot([x_pos, x_pos], [0, area_height], '-', color='#22c55e', linewidth=1)
        for j in range(n_photos_per_strip):
            ax.plot(x_pos, j * photo_spacing, 'o', color='#f59e0b', markersize=3)
    else:
        ax.plot([x_pos, x_pos], [area_height, 0], '-', color='#22c55e', linewidth=1)
        for j in range(n_photos_per_strip):
            ax.plot(x_pos, area_height - j * photo_spacing, 'o', color='#f59e0b', markersize=3)
ax.set_xlim(-20, area_width + 20); ax.set_ylim(-20, area_height + 20)
ax.set_title('Flight Path & Photo Positions', color='white', fontsize=11)
ax.tick_params(colors='gray'); ax.set_aspect('equal')

ax = axes[0, 1]; ax.set_facecolor('#111827')
overlap_grid = np.zeros((int(area_height), int(area_width)))
for i in range(n_strips):
    for j in range(n_photos_per_strip):
        cx = i * strip_spacing
        cy = j * photo_spacing
        x0, x1 = int(max(0, cx - photo_width_m/2)), int(min(area_width, cx + photo_width_m/2))
        y0, y1 = int(max(0, cy - photo_height_m/2)), int(min(area_height, cy + photo_height_m/2))
        if x0 < x1 and y0 < y1:
            overlap_grid[y0:y1, x0:x1] += 1
im = ax.imshow(overlap_grid, origin='lower', extent=[0, area_width, 0, area_height], cmap='YlOrRd', aspect='equal')
plt.colorbar(im, ax=ax, label='Overlapping photos')
ax.set_title('Photo Overlap Coverage', color='white', fontsize=11)
ax.tick_params(colors='gray')

ax = axes[1, 0]; ax.set_facecolor('#111827')
altitudes = np.linspace(20, 300, 100)
gsds = altitudes * sensor_width / (focal_length * 5472) * 100
ax.plot(altitudes, gsds, color='#3b82f6', linewidth=2)
ax.fill_between(altitudes, gsds, alpha=0.1, color='#3b82f6')
for alt, app, color in [(30, 'Archaeology', '#ef4444'), (50, 'Agriculture', '#22c55e'),
                          (100, 'General mapping', '#f59e0b'), (200, 'Large area', '#a855f7')]:
    gsd_val = alt * sensor_width / (focal_length * 5472) * 100
    ax.plot(alt, gsd_val, 'o', color=color, markersize=10, zorder=5)
    ax.annotate(f'{app}\\n({gsd_val:.1f} cm/px)', xy=(alt, gsd_val), xytext=(alt+15, gsd_val+0.5),
               color=color, fontsize=8, arrowprops=dict(arrowstyle='->', color=color, lw=0.5))
ax.set_xlabel('Altitude (m)', color='white')
ax.set_ylabel('Resolution (cm/pixel)', color='white')
ax.set_title('Resolution vs Altitude', color='white', fontsize=11)
ax.tick_params(colors='gray')

ax = axes[1, 1]; ax.set_facecolor('#111827')
total_distance = n_strips * area_height + (n_strips - 1) * strip_spacing
flight_time = total_distance / 8 / 60

summary = f"""DRONE MAPPING MISSION

Area: {area_width}×{area_height}m ({area_width*area_height/10000:.1f} ha)
Altitude: {altitude}m
Resolution: {gsd*100:.1f} cm/pixel

Photo coverage: {photo_width_m:.0f}×{photo_height_m:.0f}m
Overlap: {overlap_forward*100:.0f}% fwd, {overlap_side*100:.0f}% side

Strips: {n_strips}
Photos/strip: {n_photos_per_strip}
Total photos: {total_photos}

Flight distance: {total_distance:.0f}m
Flight time: {flight_time:.0f} min
Processing: ~{total_photos * 2} min (est.)"""

ax.text(0.05, 0.95, summary, transform=ax.transAxes, fontsize=9, color='white',
        verticalalignment='top', fontfamily='monospace')
ax.set_title('Mission Summary', color='white', fontsize=11)
ax.axis('off')

plt.tight_layout()
plt.show()

print(summary)`,
      challenge: 'The drone battery lasts 25 minutes. Is this mission feasible? If not, split the area into multiple flights with overlap zones between them.',
      successHint: 'Drone mapping has democratized aerial surveying. The granddaughter can map her village at resolution that once required military satellites. Technology democratizes when it gets cheap and portable.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Digital Mapping — builds on Level 1 concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for digital mapping simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}