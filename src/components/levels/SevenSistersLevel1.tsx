import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SevenSistersLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is a map? — turning the world into a picture',
      concept: `"Once there were seven sisters who lived where the hills meet the sky." The story of the Seven Sisters — Assam, Meghalaya, Tripura, Mizoram, Manipur, Nagaland, and Arunachal Pradesh — is also the story of how we represent geography on paper.

A **map** is a scaled, simplified representation of a portion of the Earth's surface. Every map involves three fundamental transformations:
- **Scale**: shrinking the real world to fit on paper. A scale of 1:50,000 means 1 cm on the map = 500 m on the ground.
- **Projection**: flattening the curved Earth onto a flat surface (always involves distortion).
- **Symbolization**: representing real features with symbols (blue line = river, brown contour = elevation).

Maps are NOT photographs. They are **arguments** — they choose what to show and what to hide. A political map shows boundaries; a physical map shows mountains; a population map shows where people live. Same land, different stories.

The oldest known map is a Babylonian clay tablet from ~600 BCE. Modern digital maps update in real time with satellite data, GPS, and crowd-sourced edits.`,
      analogy: 'Making a map is like writing a summary of a book. You can\'t include every word (that would be the book itself). You choose what\'s important, simplify the rest, and present it in a way that\'s useful. A map of NE India that showed every tree would be as large as NE India itself — and useless.',
      storyConnection: 'When the seven sisters decided to map their lands, each sister wanted different things shown. Assam wanted the Brahmaputra River front and center. Meghalaya wanted her hills and caves. Arunachal wanted the snow-capped peaks. "One map can\'t show everything," said the eldest. "We need different maps for different stories." This is the cartographer\'s dilemma.',
      checkQuestion: 'Google Maps shows roads prominently but hides rivers and forests in urban areas. Is this biased?',
      checkAnswer: 'Yes, and intentionally so. Google Maps is designed for navigation (how to drive somewhere), so it emphasizes roads and hides other features. A physical geography map does the opposite: rivers and elevation are prominent, roads are thin lines. Neither is "wrong" — they serve different purposes. But every map\'s choices about what to show and hide are inherently political. A map that shows national boundaries says "borders matter." One that shows language areas says "culture matters."',
      codeIntro: 'Demonstrate map scale: how much detail fits at different zoom levels.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Demonstrate map scale with NE India
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Simulated NE India outline (simplified polygon)
# Approximate coordinates (longitude, latitude)
ne_india_lon = [89.5, 90.5, 92, 94, 97, 97.5, 96, 95, 93, 92, 91.5, 90, 89, 88.5, 89.5]
ne_india_lat = [26, 26.5, 26, 27.5, 28.5, 27, 25, 24, 22.5, 23, 24, 25, 25.5, 26, 26]

# Brahmaputra River (simplified)
brahmaputra_lon = [89.5, 90.5, 91.5, 92.5, 93.5, 94.5, 95, 95.5]
brahmaputra_lat = [26, 26.3, 26.5, 26.3, 26.5, 27, 27.2, 27.5]

# State capitals
capitals = {
    'Guwahati': (91.75, 26.14),
    'Shillong': (91.88, 25.57),
    'Imphal': (93.95, 24.82),
    'Kohima': (94.11, 25.67),
    'Aizawl': (92.72, 23.73),
    'Agartala': (91.28, 23.83),
    'Itanagar': (93.62, 27.08),
}

scales = [
    ('1:5,000,000 (Regional)', [88, 98], [22, 29]),
    ('1:2,000,000 (State)', [90.5, 93.5], [25, 27.5]),
    ('1:500,000 (District)', [91, 92.5], [25.8, 26.8]),
]

for ax, (title, lon_range, lat_range) in zip(axes, scales):
    ax.set_facecolor('#111827')

    # Draw outline
    ax.fill(ne_india_lon, ne_india_lat, color='#22c55e', alpha=0.2)
    ax.plot(ne_india_lon, ne_india_lat, color='#22c55e', linewidth=1)

    # Draw river
    ax.plot(brahmaputra_lon, brahmaputra_lat, color='#3b82f6', linewidth=2, label='Brahmaputra')

    # Draw capitals
    for name, (lon, lat) in capitals.items():
        if lon_range[0] <= lon <= lon_range[1] and lat_range[0] <= lat <= lat_range[1]:
            ax.plot(lon, lat, 'o', color='#ef4444', markersize=6)
            ax.annotate(name, (lon, lat), xytext=(5, 5), textcoords='offset points',
                       color='white', fontsize=7)

    ax.set_xlim(lon_range)
    ax.set_ylim(lat_range)
    ax.set_title(title, color='white', fontsize=10)
    ax.set_xlabel('Longitude (°E)', color='white', fontsize=8)
    ax.set_ylabel('Latitude (°N)', color='white', fontsize=8)
    ax.tick_params(colors='gray')
    ax.set_aspect('equal')

    # Grid
    ax.grid(True, alpha=0.2, color='gray')

plt.tight_layout()
plt.show()

print("Map scale comparison:")
print("  1:5,000,000 — see all 7 states, no detail")
print("  1:2,000,000 — see state boundaries, major cities")
print("  1:500,000  — see districts, roads, smaller towns")
print()
print("As scale increases (denominator decreases):")
print("  More detail visible")
print("  Smaller area covered")
print("  More symbols needed")
print("  Map becomes more complex")`,
      challenge: 'At 1:50,000 scale, 1cm on the map = 500m on the ground. A soccer field is 100m long. How many centimeters would it be on the map? At what scale would it be invisible (smaller than 1mm)?',
      successHint: 'Understanding map scale is the first step in spatial thinking — the ability to translate between real-world distances and map representations. It\'s essential for navigation, urban planning, and understanding any geographic data.',
    },
    {
      title: 'Scale and projection — the distortion dilemma',
      concept: `You cannot flatten a sphere onto a flat surface without distortion. Try peeling an orange and pressing the peel flat — it tears and stretches. Every map projection distorts at least one of these properties:
- **Area**: are regions shown at their true relative sizes?
- **Shape**: are coastlines and boundaries shown with their true angles?
- **Distance**: are distances between points shown correctly?
- **Direction**: are compass bearings shown correctly?

No projection preserves all four. This is a mathematical certainty (proven by Carl Friedrich Gauss in 1827).

Common projections:
- **Mercator** (1569): preserves shape and direction (great for navigation), but grossly distorts area near the poles. Greenland looks as large as Africa, but Africa is 14× bigger.
- **Peters/Gall-Peters**: preserves area (Africa shown at true relative size), but distorts shape (everything looks stretched).
- **Robinson**: compromises — distorts everything a little, nothing a lot. Used by National Geographic.

For NE India, the choice of projection matters: at latitude ~26°N, Mercator distortion is moderate but noticeable. An equal-area projection gives a more accurate picture of Assam's true size relative to other states.`,
      analogy: 'Map projection is like gift-wrapping a basketball. If you use flat paper, you MUST crumple, fold, or tear it. Crumpling = shape distortion. Tearing = gaps. Stretching = area distortion. You can choose which kind of mess to make, but you can\'t avoid mess entirely. Each projection is a different wrapping strategy.',
      storyConnection: 'When the sisters compared their lands on a Mercator map, Arunachal Pradesh (at latitude 28°N) appeared larger than Tripura (at latitude 23°N). But on an equal-area map, Arunachal (83,743 km²) is only 8× Tripura (10,486 km²), not the 12× the Mercator map suggested. "The map lied!" said Tripura. "No," said the elder, "you just read the wrong map for the wrong question."',
      checkQuestion: 'If Mercator projection preserves shape perfectly, why don\'t we use it for everything?',
      checkAnswer: 'Because preserving shape requires sacrificing area. At the equator, Mercator is accurate. But at high latitudes, areas are enormously inflated. Russia (17.1M km²) looks larger than Africa (30.4M km²) on a Mercator map. For any analysis involving size comparison — population density, resource distribution, climate impact — Mercator gives misleading visual impressions. The "right" projection depends on what question you\'re asking.',
      codeIntro: 'Compare how different map projections distort the sizes of the Seven Sisters states.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# True areas of NE Indian states (km²)
states = {
    'Arunachal Pradesh': {'area': 83743, 'lat': 28.2, 'color': '#ef4444'},
    'Assam': {'area': 78438, 'lat': 26.2, 'color': '#22c55e'},
    'Meghalaya': {'area': 22429, 'lat': 25.4, 'color': '#3b82f6'},
    'Manipur': {'area': 22327, 'lat': 24.8, 'color': '#f59e0b'},
    'Nagaland': {'area': 16579, 'lat': 26.1, 'color': '#a855f7'},
    'Mizoram': {'area': 21081, 'lat': 23.2, 'color': '#06b6d4'},
    'Tripura': {'area': 10486, 'lat': 23.9, 'color': '#ec4899'},
}

# Mercator distortion factor = sec(latitude)²
# This inflates areas at higher latitudes

fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# 1. True areas
ax1.set_facecolor('#111827')
names = list(states.keys())
true_areas = [states[n]['area'] for n in names]
colors_list = [states[n]['color'] for n in names]

bars = ax1.barh(names, true_areas, color=colors_list)
ax1.set_xlabel('Area (km²)', color='white')
ax1.set_title('True Area (Equal-area projection)', color='white', fontsize=11)
ax1.tick_params(colors='gray')
for bar, area in zip(bars, true_areas):
    ax1.text(bar.get_width() + 500, bar.get_y() + bar.get_height()/2,
             f'{area:,}', va='center', color='white', fontsize=8)

# 2. Mercator-distorted areas
ax2.set_facecolor('#111827')
mercator_areas = []
for n in names:
    lat_rad = np.radians(states[n]['lat'])
    distortion = 1 / (np.cos(lat_rad) ** 2)
    mercator_areas.append(states[n]['area'] * distortion)

bars2 = ax2.barh(names, mercator_areas, color=colors_list)
ax2.set_xlabel('Apparent area on Mercator (km²)', color='white')
ax2.set_title('Mercator Projection (distorted)', color='white', fontsize=11)
ax2.tick_params(colors='gray')
for bar, area in zip(bars2, mercator_areas):
    ax2.text(bar.get_width() + 500, bar.get_y() + bar.get_height()/2,
             f'{area:,.0f}', va='center', color='white', fontsize=8)

# 3. Distortion percentage
ax3.set_facecolor('#111827')
distortions = [(m - t) / t * 100 for m, t in zip(mercator_areas, true_areas)]
lats = [states[n]['lat'] for n in names]

ax3.scatter(lats, distortions, c=colors_list, s=100, zorder=5)
for i, name in enumerate(names):
    ax3.annotate(name.split()[0], (lats[i], distortions[i]),
                xytext=(5, 5), textcoords='offset points', color='white', fontsize=7)

# Theoretical curve
lat_range = np.linspace(20, 30, 100)
theoretical = (1/np.cos(np.radians(lat_range))**2 - 1) * 100
ax3.plot(lat_range, theoretical, '--', color='gray', linewidth=1, label='Theoretical sec²(lat)')

ax3.set_xlabel('Latitude (°N)', color='white')
ax3.set_ylabel('Area distortion (%)', color='white')
ax3.set_title('Mercator Distortion vs Latitude', color='white', fontsize=11)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Mercator distortion for NE Indian states:")
for i, name in enumerate(names):
    lat = states[name]['lat']
    dist_factor = 1 / np.cos(np.radians(lat))**2
    print(f"  {name} (lat {lat}°N): ×{dist_factor:.3f} = {distortions[i]:.1f}% inflation")
print()
print("Key insight: even within NE India (23°-28°N latitude),")
print("Mercator distorts by 15-27%. For global comparisons")
print("(India vs Russia), the distortion is massive.")`,
      challenge: 'Calculate the Mercator distortion for Greenland (lat ~72°N) and compare it to India (lat ~20°N). Greenland appears larger than India on Mercator, but India is actually 1.5× larger. Compute: 1/cos²(72°) vs 1/cos²(20°).',
      successHint: 'Understanding projection distortion is critical for interpreting any map or geographic data visualization. Every world map you\'ve ever seen has distorted the truth — the question is how, and whether the distortion matters for your purpose.',
    },
    {
      title: 'Latitude and longitude — the address system of the Earth',
      concept: `Every point on Earth has a unique address given by two numbers: **latitude** and **longitude**. This coordinate system was formalized by Hipparchus of Nicaea around 150 BCE, though earlier civilizations had simpler versions.

- **Latitude**: how far north or south of the equator. Ranges from -90° (South Pole) to +90° (North Pole). The equator is 0°.
- **Longitude**: how far east or west of the Prime Meridian (Greenwich, London). Ranges from -180° to +180°.

Key facts:
- 1° of latitude = ~111 km (constant everywhere on Earth)
- 1° of longitude = ~111 km × cos(latitude) — gets smaller as you go toward the poles
- At Guwahati (26.14°N), 1° of longitude = 111 × cos(26.14°) ≈ 99.7 km
- GPS coordinates are given in decimal degrees: Guwahati = (26.1445°N, 91.7362°E)

NE India spans:
- Latitude: ~22° to ~29°N (about 780 km north to south)
- Longitude: ~88° to ~97.5°E (about 950 km east to west at Assam's latitude)

The coordinate system is based on Earth's shape (an oblate spheroid), its rotation axis (defining north-south), and an arbitrary but internationally agreed zero line (Greenwich).`,
      analogy: 'Latitude and longitude are like the row and column numbers of a giant spreadsheet wrapped around the Earth. Latitude = row number (how far up or down). Longitude = column number (how far left or right). Every cell in the spreadsheet has a unique (row, column) address — and so does every point on Earth.',
      storyConnection: 'Each of the seven sisters has a capital, and each capital has unique coordinates. Guwahati (26.14°N, 91.74°E) is the westernmost and one of the lowest in latitude. Itanagar (27.08°N, 93.62°E) is the most northern and eastern. The coordinates tell you immediately which sister is which — they\'re geographic fingerprints.',
      checkQuestion: 'Two cities are both at latitude 26°N. One is in India, one is in Egypt. Are they at the same distance from the equator?',
      checkAnswer: 'Yes — they\'re both at the same latitude, so both are ~2,886 km from the equator (26° × 111 km/°). But they\'re separated by thousands of kilometers in longitude. Latitude tells you your distance from the equator. Longitude tells you your east-west position. Same latitude means same climate band (roughly), which is why cities at 26°N in India and Egypt both have hot, semi-arid to subtropical climates.',
      codeIntro: 'Plot the coordinates of all Seven Sisters capitals and calculate distances between them.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Seven Sisters state capitals
capitals = {
    'Guwahati (Assam)': (26.1445, 91.7362),
    'Shillong (Meghalaya)': (25.5788, 91.8933),
    'Imphal (Manipur)': (24.8170, 93.9368),
    'Kohima (Nagaland)': (25.6751, 94.1086),
    'Aizawl (Mizoram)': (23.7271, 92.7176),
    'Agartala (Tripura)': (23.8315, 91.2868),
    'Itanagar (Arunachal)': (27.0844, 93.6053),
}

def haversine(lat1, lon1, lat2, lon2):
    """Calculate great-circle distance in km"""
    R = 6371  # Earth radius in km
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    return R * 2 * np.arcsin(np.sqrt(a))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Map of capitals
ax1.set_facecolor('#111827')

lats = [v[0] for v in capitals.values()]
lons = [v[1] for v in capitals.values()]
names_short = [k.split('(')[0].strip() for k in capitals.keys()]
colors_cap = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#06b6d4', '#ec4899', '#ef4444']

ax1.scatter(lons, lats, c=colors_cap, s=100, zorder=5, edgecolors='white', linewidths=1)
for i, name in enumerate(names_short):
    ax1.annotate(name, (lons[i], lats[i]), xytext=(7, 5), textcoords='offset points',
                color=colors_cap[i], fontsize=9, fontweight='bold')

# Draw lines between consecutive capitals
for i in range(len(lons)):
    for j in range(i+1, len(lons)):
        dist = haversine(lats[i], lons[i], lats[j], lons[j])
        if dist < 300:  # only draw nearby connections
            ax1.plot([lons[i], lons[j]], [lats[i], lats[j]], '-', color='gray', alpha=0.3, linewidth=0.5)

# Grid lines
for lat in range(23, 29):
    ax1.axhline(lat, color='gray', linewidth=0.3, alpha=0.3)
    ax1.text(90.5, lat + 0.05, f'{lat}°N', color='gray', fontsize=7)
for lon in range(91, 96):
    ax1.axvline(lon, color='gray', linewidth=0.3, alpha=0.3)
    ax1.text(lon + 0.05, 22.7, f'{lon}°E', color='gray', fontsize=7)

ax1.set_xlabel('Longitude (°E)', color='white')
ax1.set_ylabel('Latitude (°N)', color='white')
ax1.set_title('Seven Sisters: Capital Coordinates', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# 2. Distance matrix
ax2.set_facecolor('#111827')
n = len(capitals)
dist_matrix = np.zeros((n, n))
keys = list(capitals.keys())

for i in range(n):
    for j in range(n):
        dist_matrix[i, j] = haversine(lats[i], lons[i], lats[j], lons[j])

im = ax2.imshow(dist_matrix, cmap='YlOrRd_r', aspect='equal')
ax2.set_xticks(range(n))
ax2.set_xticklabels(names_short, rotation=45, ha='right', color='white', fontsize=8)
ax2.set_yticks(range(n))
ax2.set_yticklabels(names_short, color='white', fontsize=8)
ax2.set_title('Distance Matrix (km)', color='white', fontsize=12)
plt.colorbar(im, ax=ax2, label='Distance (km)')

for i in range(n):
    for j in range(n):
        ax2.text(j, i, f'{dist_matrix[i,j]:.0f}', ha='center', va='center',
                color='white' if dist_matrix[i,j] > 200 else 'black', fontsize=7)

ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Seven Sisters capital coordinates and distances:")
for name, (lat, lon) in capitals.items():
    print(f"  {name}: {lat:.4f}°N, {lon:.4f}°E")

# Find closest and farthest pairs
min_dist, max_dist = float('inf'), 0
min_pair, max_pair = '', ''
for i in range(n):
    for j in range(i+1, n):
        d = dist_matrix[i, j]
        if d < min_dist: min_dist, min_pair = d, f"{names_short[i]} - {names_short[j]}"
        if d > max_dist: max_dist, max_pair = d, f"{names_short[i]} - {names_short[j]}"

print(f"\\nClosest pair: {min_pair} ({min_dist:.0f} km)")
print(f"Farthest pair: {max_pair} ({max_dist:.0f} km)")`,
      challenge: 'The haversine formula calculates "as the crow flies" distance. But in NE India with mountainous terrain, actual road distance can be 2-3× the straight-line distance. For Guwahati to Kohima, the haversine distance is ~260 km but the road is ~340 km. Calculate the "circuity factor" (road/straight-line) for each pair.',
      successHint: 'The coordinate system is the backbone of all geographic analysis. Every GPS device, every navigation app, every satellite image is referenced to latitude and longitude. Understanding coordinates is understanding the language of geography.',
    },
    {
      title: 'Topographic maps — reading the shape of the land',
      concept: `A topographic map shows the three-dimensional shape of the terrain on a two-dimensional surface. The key innovation: **contour lines** — lines connecting points of equal elevation.

Reading contour lines:
- **Close together**: steep slope (the cliff face of a hill)
- **Far apart**: gentle slope (a flat plain)
- **Concentric circles**: a hilltop (or a depression, marked with hachures)
- **V-shapes pointing uphill**: a valley or stream bed
- **V-shapes pointing downhill**: a ridge or spur
- **Contour interval**: the elevation difference between adjacent lines (typically 20m, 50m, or 100m depending on scale)

NE India's topography is extraordinarily varied:
- **Brahmaputra floodplain**: near sea level, almost flat (contours very far apart)
- **Shillong Plateau**: 1,000-1,500m, moderate slopes
- **Eastern Himalayas** (Arunachal): 0 to 7,090m (Kangto peak) — the most dramatic elevation change on Earth over such a short distance

A topographic map of NE India looks like a fingerprint: the whorls and ridges of contour lines reveal the collision between the Indian and Eurasian tectonic plates.`,
      analogy: 'Contour lines are like the rings in a tree stump. Each ring represents one "layer" of height. If you sliced a mountain horizontally at regular intervals (like slicing a loaf of bread), the outline of each slice would be one contour line. Stack them up and you see the mountain\'s shape.',
      storyConnection: 'When the eldest sister (Arunachal) showed her land on a topographic map, the contour lines were so dense they almost merged — her mountains rise from 100m to 7,000m in just 100 km. The youngest sister (Assam\'s Brahmaputra plain) had contour lines so far apart that the map looked almost blank. "My land is not empty," said Assam, "it\'s just flat. And that\'s why the river chose me."',
      checkQuestion: 'On a topographic map, you see contour lines forming a V-shape that points toward higher elevation. Are you looking at a ridge or a valley?',
      checkAnswer: 'A valley (or stream bed). The V points upstream — toward the source of water. Water flows perpendicular to contour lines, from high to low. If the V points toward higher ground, water flows down through the V, carving a valley. If the V points toward lower ground, it\'s a ridge or spur. The mnemonic is: "Vs point upstream." You can verify by checking which side has higher elevation.',
      codeIntro: 'Generate a topographic map with contour lines for a simulated NE Indian landscape.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a simulated terrain (NE India-like features)
np.random.seed(42)

x = np.linspace(0, 50, 200)  # km
y = np.linspace(0, 50, 200)
X, Y = np.meshgrid(x, y)

# Terrain: flat plain in south, hills rising to north
base = 50 + 200 * (Y / 50) ** 2  # elevation increases northward

# Add hills (Shillong Plateau analog)
hill1 = 400 * np.exp(-((X-25)**2 + (Y-30)**2) / 80)
hill2 = 300 * np.exp(-((X-35)**2 + (Y-38)**2) / 50)

# Add valley (river cutting through)
valley = -100 * np.exp(-(X-25)**2 / 30) * (Y > 15).astype(float)

# Add some noise (real terrain is rough)
noise = 15 * np.random.rand(200, 200)

elevation = base + hill1 + hill2 + valley + noise

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Shaded relief + contours
ax1.set_facecolor('#111827')

# Hillshade
from matplotlib.colors import LightSource
ls = LightSource(azdeg=315, altdeg=45)
hillshade = ls.hillshade(elevation, vert_exag=2, dx=50/200, dy=50/200)
ax1.imshow(hillshade, origin='lower', extent=[0, 50, 0, 50], cmap='gray', alpha=0.5)

# Contour lines
contour_interval = 50  # meters
levels = np.arange(0, 900, contour_interval)
cs = ax1.contour(X, Y, elevation, levels=levels, colors='white', linewidths=0.5, alpha=0.7)
ax1.clabel(cs, inline=True, fontsize=6, fmt='%d m')

# Major contours (every 200m)
major_levels = np.arange(0, 900, 200)
cs_major = ax1.contour(X, Y, elevation, levels=major_levels, colors='#f59e0b', linewidths=1.5)
ax1.clabel(cs_major, inline=True, fontsize=8, fmt='%d m', colors=['#f59e0b'])

ax1.set_xlabel('East (km)', color='white')
ax1.set_ylabel('North (km)', color='white')
ax1.set_title('Topographic Map (contour interval: 50m)', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# 2. Cross-section (elevation profile)
ax2.set_facecolor('#111827')

# South to north profile at x=25km
profile_idx = np.argmin(np.abs(x - 25))
profile = elevation[:, profile_idx]

ax2.fill_between(y, 0, profile, color='#8B7355', alpha=0.5)
ax2.plot(y, profile, color='#22c55e', linewidth=2)

# Annotate features
ax2.annotate('Floodplain', xy=(5, profile[20]), xytext=(5, 250),
            color='#3b82f6', fontsize=9, arrowprops=dict(arrowstyle='->', color='#3b82f6'))
ax2.annotate('Hill summit\\n(~700m)', xy=(30, profile[120]), xytext=(35, 750),
            color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.annotate('Valley', xy=(25, profile[100]), xytext=(15, 500),
            color='#22c55e', fontsize=9, arrowprops=dict(arrowstyle='->', color='#22c55e'))

ax2.set_xlabel('North distance (km)', color='white')
ax2.set_ylabel('Elevation (m)', color='white')
ax2.set_title('Cross-section at x=25km (South→North)', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 850)

plt.tight_layout()
plt.show()

print("Reading the topographic map:")
print("  Closely spaced contours (north side of hills) = steep slopes")
print("  Widely spaced contours (southern plain) = flat terrain")
print("  Concentric contours at (25,30) and (35,38) = hilltops")
print("  V-shaped contours at x=25 = river valley")
print()
print("Elevation statistics:")
print(f"  Minimum: {elevation.min():.0f}m (southern floodplain)")
print(f"  Maximum: {elevation.max():.0f}m (hill summit)")
print(f"  Range: {elevation.max() - elevation.min():.0f}m")
print(f"  Mean: {elevation.mean():.0f}m")`,
      challenge: 'Decrease the contour_interval from 50 to 20. More detail appears, but the map gets cluttered. Find the interval that balances detail and readability. Professional cartographers face this trade-off on every map.',
      successHint: 'Topographic maps are the foundation of terrain analysis — used by hikers, civil engineers, military planners, and geologists. Reading contour lines is a skill that takes practice, but once you see the 3D shape hidden in those lines, you can\'t unsee it.',
    },
    {
      title: 'Political vs physical geography — two ways to see the same land',
      concept: `The same piece of land tells different stories depending on what you map. **Political geography** focuses on human-created boundaries: states, districts, nations. **Physical geography** focuses on natural features: rivers, mountains, climate, vegetation.

NE India is a perfect case study for the tension between the two:
- **Political**: 7 states with distinct identities, created between 1963 and 1987 through reorganization of what was once a single province
- **Physical**: the region is defined by the Brahmaputra valley, the Indo-Burma ranges, and the Shillong Plateau — features that existed millions of years before any state boundary

Mismatches between political and physical geography cause real problems:
- River basins cross state boundaries → water disputes
- Mountain ranges connect populations across borders → ethnic ties that states divide
- Climate zones don't align with political zones → agricultural policy that doesn't fit local conditions

The Seven Sisters became separate states through political processes (language, ethnicity, governance needs), not because the physical geography demanded seven divisions. You could draw 3 states or 15 equally validly — the land doesn't care about lines on maps.`,
      analogy: 'Political maps are like property lines in a neighbourhood — arbitrary human decisions about who controls what. Physical maps are like a satellite photo — they show what\'s actually there regardless of who claims it. A river doesn\'t stop flowing at a state boundary. A mountain range doesn\'t lower itself because two states disagree about it.',
      storyConnection: 'The seven sisters were once one — a single province of British India called "Assam." After independence, the sisters separated: Nagaland in 1963, Meghalaya and Mizoram in 1972, Arunachal Pradesh in 1987. Each wanted to govern her own hills and valleys. But the Brahmaputra, flowing through Arunachal and Assam, didn\'t know about the new boundary. "The river belongs to no sister," said the elder, "and to all of them."',
      checkQuestion: 'The Naga people live in both Nagaland (India) and Sagaing Region (Myanmar). The international border splits their homeland. Is this a political or physical geography problem?',
      checkAnswer: 'It\'s a political geography problem imposed on physical and cultural geography. The border was drawn by British colonial surveyors in the 1820s-1870s along the Patkai range — a convenient physical feature that happened to run through the middle of Naga territory. The Naga people lived on both sides of the mountains long before the boundary existed. This mismatch between political lines and human geography is a source of ongoing tension — the same pattern repeats with the Kurds, Pashtuns, and dozens of other divided peoples.',
      codeIntro: 'Visualize the mismatch between political boundaries and physical features.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Compare political and physical geography of NE India
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Simplified NE India data
states_data = {
    'Arunachal Pradesh': {'area': 83743, 'pop': 1.38, 'elevation_mean': 2000, 'forest_pct': 79.6, 'rainfall': 2782},
    'Assam': {'area': 78438, 'pop': 31.21, 'elevation_mean': 200, 'forest_pct': 35.3, 'rainfall': 2818},
    'Meghalaya': {'area': 22429, 'pop': 2.97, 'elevation_mean': 1000, 'forest_pct': 76.3, 'rainfall': 4114},
    'Manipur': {'area': 22327, 'pop': 2.86, 'elevation_mean': 800, 'forest_pct': 77.4, 'rainfall': 1467},
    'Nagaland': {'area': 16579, 'pop': 1.98, 'elevation_mean': 1200, 'forest_pct': 75.3, 'rainfall': 1816},
    'Mizoram': {'area': 21081, 'pop': 1.10, 'elevation_mean': 900, 'forest_pct': 86.3, 'rainfall': 2350},
    'Tripura': {'area': 10486, 'pop': 3.67, 'elevation_mean': 100, 'forest_pct': 73.7, 'rainfall': 2150},
}

names = list(states_data.keys())
colors_states = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#06b6d4', '#ec4899']

# 1. Political view: area and population
ax1.set_facecolor('#111827')
areas = [states_data[n]['area'] for n in names]
pops = [states_data[n]['pop'] for n in names]
density = [p * 1e6 / a for p, a in zip(pops, areas)]

x_pos = np.arange(len(names))
width = 0.35

bars1 = ax1.bar(x_pos - width/2, [a/1000 for a in areas], width, color=colors_states, alpha=0.7, label='Area (×1000 km²)')
bars2 = ax1.bar(x_pos + width/2, pops, width, color=colors_states, alpha=1.0, edgecolor='white', linewidth=1, label='Population (millions)')

ax1.set_xticks(x_pos)
ax1.set_xticklabels([n.split()[0] for n in names], rotation=30, ha='right', color='white', fontsize=8)
ax1.set_ylabel('Value', color='white')
ax1.set_title('Political Geography: Area vs Population', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Annotate density
for i, d in enumerate(density):
    ax1.text(i, max(areas[i]/1000, pops[i]) + 2, f'{d:.0f}/km²', ha='center', color='gray', fontsize=7)

# 2. Physical geography: elevation, rainfall, forest
ax2.set_facecolor('#111827')
elevations = [states_data[n]['elevation_mean'] for n in names]
rainfall = [states_data[n]['rainfall'] for n in names]
forest = [states_data[n]['forest_pct'] for n in names]

# Bubble chart: x=elevation, y=rainfall, size=forest%
for i, name in enumerate(names):
    ax2.scatter(elevations[i], rainfall[i], s=forest[i] * 5, c=colors_states[i],
               alpha=0.7, edgecolors='white', linewidths=1, zorder=3)
    ax2.annotate(name.split()[0], (elevations[i], rainfall[i]),
                xytext=(8, 8), textcoords='offset points', color=colors_states[i], fontsize=8)

ax2.set_xlabel('Mean Elevation (m)', color='white')
ax2.set_ylabel('Annual Rainfall (mm)', color='white')
ax2.set_title('Physical Geography: Elevation × Rainfall × Forest', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Add size legend
for size, label in [(30*5, '30%'), (60*5, '60%'), (90*5, '90%')]:
    ax2.scatter([], [], s=size, c='gray', alpha=0.5, label=f'{label} forest')
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, title='Bubble size = forest %',
           title_fontsize=8, loc='upper left')

plt.tight_layout()
plt.show()

print("Political vs Physical Geography:")
print()
print("Political (human-created):")
for name in names:
    d = states_data[name]
    dens = d['pop'] * 1e6 / d['area']
    print(f"  {name}: {d['area']:,} km², {d['pop']:.2f}M people, {dens:.0f}/km²")

print()
print("Physical (natural):")
for name in names:
    d = states_data[name]
    print(f"  {name}: {d['elevation_mean']}m elev, {d['rainfall']}mm rain, {d['forest_pct']}% forest")

print()
print("Key mismatch: Assam has 10× the population of Arunachal")
print("in a similar area — because the flat Brahmaputra valley")
print("supports dense agriculture that the mountains cannot.")`,
      challenge: 'Assam has a population density of ~398/km², while Arunachal Pradesh has ~17/km². Both are roughly the same area. Plot population density against mean elevation for all seven states. Is there a correlation? Why?',
      successHint: 'The tension between political and physical geography shapes everything from water policy to highway construction to disaster planning. The land doesn\'t care about our boundaries — understanding both perspectives simultaneously is the mark of geographic literacy.',
    },
    {
      title: 'NE India\'s unique geography — where three worlds collide',
      concept: `NE India sits at one of the most remarkable geographic convergences on Earth. Three major geological and biological realms collide here:

1. **Indian Plate** (from the south): the Brahmaputra plain is the northernmost extension of the Indo-Gangetic alluvial system, formed by sediment from eroding Himalayas
2. **Eurasian Plate** (from the north): the Eastern Himalayas in Arunachal Pradesh, pushed up by the ongoing collision between India and Asia
3. **Burma Plate** (from the east): the Indo-Burma ranges (Patkai, Naga hills, Chin hills), formed by the subduction of the Indian Plate under Burma

This triple junction creates extraordinary geographic features:
- **Elevation range**: from 30m (Brahmaputra plain) to 7,090m (Kangto, Arunachal) in just 200 km — one of the steepest gradients on Earth
- **Rainfall extremes**: Mawsynram, Meghalaya receives ~11,872 mm/year (wettest place on Earth). Leh, just 800 km away, receives 100 mm/year.
- **Biodiversity hotspot**: the Indo-Burma biodiversity hotspot — one of 36 globally, with 13,500 plant species (7,000 endemic) and 2,185 vertebrate species
- **Earthquake zone**: Zone V (highest seismic risk in India). The 1950 Assam earthquake (8.6 magnitude) was one of the largest ever recorded.`,
      analogy: 'NE India is like a crumple zone in a car crash — but in slow motion over 50 million years. India (the car) crashed into Asia (the wall). The Himalayas are the crumpled hood. The Brahmaputra valley is the gap where the fenders separated. NE India\'s hills are the ripples spreading outward from the impact zone.',
      storyConnection: 'The seven sisters\' story ends with a truth: "We are different because our lands are different. Arunachal\'s peaks catch the snow. Assam\'s valley catches the water. Meghalaya\'s plateau catches the rain. Tripura\'s plains catch the warmth. We are seven because the Earth shaped us into seven." Geography is destiny — the land wrote the story before the people arrived.',
      checkQuestion: 'Mawsynram receives nearly 12 meters of rain per year. The Thar Desert, at the same latitude on the other side of India, receives 0.2 meters. Both are at ~25°N. Why the extreme difference?',
      checkAnswer: 'Orographic lift. The summer monsoon winds blow from the Bay of Bengal carrying enormous moisture. When they hit the Khasi Hills (where Mawsynram sits), they\'re forced upward. Rising air cools, can\'t hold moisture, and dumps it all on the south-facing slopes. By the time the air crosses India to reach the Thar, it\'s dry. Mawsynram\'s extreme rainfall is entirely due to its position: south-facing, steep, directly in the monsoon\'s path. Same latitude, same monsoon season, radically different outcome because of topography.',
      codeIntro: 'Visualize the extreme geographic gradients of NE India.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# NE India's extreme geographic gradients
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Elevation profile from Brahmaputra to Himalayas
ax = axes[0, 0]
ax.set_facecolor('#111827')

distance = np.linspace(0, 200, 300)  # km from Brahmaputra to peaks
# Simplified elevation profile
elevation_profile = 30 + 30 * (distance / 200) ** 0.5  # gentle rise initially
elevation_profile += 5000 * np.maximum(0, (distance - 100) / 100) ** 2  # steep rise

# Add some roughness
elevation_profile += 200 * np.sin(distance / 5) * (distance / 200)

ax.fill_between(distance, 0, elevation_profile, color='#8B7355', alpha=0.5)
ax.plot(distance, elevation_profile, color='#22c55e', linewidth=2)

# Annotate
ax.annotate('Brahmaputra Valley\\n(~30m)', xy=(10, 40), xytext=(30, 1500),
           color='#3b82f6', fontsize=9, arrowprops=dict(arrowstyle='->', color='#3b82f6'))
ax.annotate('Kangto Peak\\n(7,090m)', xy=(195, 6500), xytext=(150, 6800),
           color='#ef4444', fontsize=9, arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax.set_xlabel('Distance from Brahmaputra (km)', color='white')
ax.set_ylabel('Elevation (m)', color='white')
ax.set_title('Elevation: World\'s Steepest Gradient', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 2. Rainfall comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')

places = {
    'Mawsynram': 11872,
    'Cherrapunji': 11430,
    'Guwahati': 2818,
    'Imphal': 1467,
    'London': 602,
    'New York': 1268,
    'Thar Desert': 200,
}

names_rain = list(places.keys())
values = list(places.values())
colors_rain = ['#3b82f6', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#a855f7', '#ef4444']

bars = ax.barh(names_rain, values, color=colors_rain)
ax.set_xlabel('Annual rainfall (mm)', color='white')
ax.set_title('Rainfall Extremes', color='white', fontsize=12)
ax.tick_params(colors='gray')

for bar, val in zip(bars, values):
    ax.text(bar.get_width() + 100, bar.get_y() + bar.get_height()/2,
           f'{val:,} mm', va='center', color='white', fontsize=8)

# 3. Tectonic plates
ax = axes[1, 0]
ax.set_facecolor('#111827')

# Simplified plate boundaries
theta = np.linspace(0, 2*np.pi, 100)

# Indian plate (from south)
ax.arrow(5, 1, 0, 3, head_width=0.3, head_length=0.2, fc='#22c55e', ec='#22c55e')
ax.text(5, 0.5, 'Indian Plate\\n(moving N at 5cm/yr)', ha='center', color='#22c55e', fontsize=9)

# Eurasian plate (from north)
ax.arrow(5, 9, 0, -3, head_width=0.3, head_length=0.2, fc='#3b82f6', ec='#3b82f6')
ax.text(5, 9.5, 'Eurasian Plate', ha='center', color='#3b82f6', fontsize=9)

# Burma plate (from east)
ax.arrow(9, 5, -3, 0, head_width=0.3, head_length=0.2, fc='#f59e0b', ec='#f59e0b')
ax.text(9.5, 5, 'Burma\\nPlate', ha='left', color='#f59e0b', fontsize=9)

# Collision zone = NE India
circle = plt.Circle((5, 5), 1.5, fill=True, facecolor='#ef4444', alpha=0.3, edgecolor='#ef4444', linewidth=2)
ax.add_patch(circle)
ax.text(5, 5, 'NE INDIA\\n(triple junction)', ha='center', va='center', color='white', fontsize=10, fontweight='bold')

ax.set_xlim(0, 11)
ax.set_ylim(0, 11)
ax.set_aspect('equal')
ax.set_title('Three Tectonic Plates Converge', color='white', fontsize=12)
ax.axis('off')

# 4. Biodiversity density
ax = axes[1, 1]
ax.set_facecolor('#111827')

regions = {
    'NE India': {'species_per_1000km2': 45, 'endemic_pct': 38, 'area_pct_india': 7.7},
    'Western Ghats': {'species_per_1000km2': 40, 'endemic_pct': 35, 'area_pct_india': 4.8},
    'Gangetic Plain': {'species_per_1000km2': 15, 'endemic_pct': 5, 'area_pct_india': 22},
    'Thar Desert': {'species_per_1000km2': 5, 'endemic_pct': 3, 'area_pct_india': 7},
    'Deccan Plateau': {'species_per_1000km2': 20, 'endemic_pct': 12, 'area_pct_india': 43},
}

reg_names = list(regions.keys())
species = [regions[r]['species_per_1000km2'] for r in reg_names]
endemic = [regions[r]['endemic_pct'] for r in reg_names]
area_pct = [regions[r]['area_pct_india'] for r in reg_names]

colors_bio = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']

ax.scatter(area_pct, species, s=[e*10 for e in endemic], c=colors_bio, alpha=0.8,
          edgecolors='white', linewidths=1)
for i, name in enumerate(reg_names):
    ax.annotate(name, (area_pct[i], species[i]), xytext=(8, 5), textcoords='offset points',
               color=colors_bio[i], fontsize=9)

ax.set_xlabel('% of India\'s area', color='white')
ax.set_ylabel('Species per 1000 km²', color='white')
ax.set_title('Biodiversity: NE India Punches Above Its Weight', color='white', fontsize=12)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("NE India by the numbers:")
print("  7.7% of India's area")
print("  ~50% of India's biodiversity")
print("  World's wettest place (Mawsynram, 11,872mm/yr)")
print("  7,000m elevation range in 200km")
print("  Seismic Zone V (highest earthquake risk)")
print("  2 biodiversity hotspots (Himalaya + Indo-Burma)")
print()
print("Why? Three tectonic plates, monsoon funneling, and")
print("extreme topographic diversity create thousands of")
print("unique microclimates — each supporting different species.")`,
      challenge: 'The 1950 Assam earthquake (magnitude 8.6) permanently changed the Brahmaputra\'s course. If the Indian plate moves north at 5cm/year, how much has it moved since 1950? (Answer: 3.75m.) How much has it moved since Madan Kamdev was built (~900 CE)? What does this mean for the Himalayas?',
      successHint: 'NE India is a geographic laboratory — every major geological and biological process is on display within a few hundred kilometers. Understanding its geography is a crash course in plate tectonics, climate science, and biodiversity. The seven sisters didn\'t just become states; they became windows into how the Earth works.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Geography & Maps — no prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for geography simulations. Click to start.</p>
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