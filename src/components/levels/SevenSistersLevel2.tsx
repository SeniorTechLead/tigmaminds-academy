import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SevenSistersLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Coordinate systems — from spheres to flat maps',
      concept: `In Level 1, we learned latitude and longitude as a way to address points on Earth. Now let's go deeper into the mathematics. The Earth is not a perfect sphere — it's an **oblate spheroid** (wider at the equator than pole-to-pole due to rotation). This means coordinate systems are more complex than they first appear.

Key coordinate systems:
- **Geographic coordinates** (lat/lon): angles from Earth's center. Simple but angular — 1° doesn't correspond to a fixed distance.
- **Projected coordinates** (UTM, State Plane): positions in meters on a flat map. Easier for distance and area calculations.
- **UTM (Universal Transverse Mercator)**: divides the world into 60 zones, each 6° wide. NE India is in zones 46 and 47. Within each zone, coordinates are in meters: Easting (distance from zone center) and Northing (distance from equator).

The **datum** defines the mathematical model of Earth's shape. WGS84 (used by GPS) models Earth as an ellipsoid with:
- Semi-major axis (equatorial radius): 6,378,137 m
- Semi-minor axis (polar radius): 6,356,752 m
- Flattening: 1/298.257

Different datums can shift positions by up to 200 meters. Using the wrong datum in a GPS can put you in the wrong field — or worse, the wrong country.`,
      analogy: 'Coordinate systems are like different languages for describing the same location. "26.14°N, 91.74°E" (geographic), "722,300 E, 2,893,500 N Zone 46R" (UTM), and "latitude 26 degrees 8 minutes 40 seconds North" (DMS) all describe Guwahati. Each "language" is optimized for different tasks: geographic for global reference, UTM for precise local measurement, DMS for traditional navigation.',
      storyConnection: 'When surveyors mapped NE India in the 19th century, they used the Everest spheroid (defined in 1830) as their datum — named after George Everest, Surveyor General of India. Modern GPS uses WGS84. The difference between Everest and WGS84 datums shifts positions in NE India by about 500 meters. Old survey markers are "in the wrong place" by modern standards — not because they moved, but because the mathematical model of Earth changed.',
      checkQuestion: 'A GPS receiver shows your position as 26.1445°N, 91.7362°E. You enter this into a map that uses the Everest datum instead of WGS84. How far off will you be?',
      checkAnswer: 'About 500 meters in NE India. The Everest ellipsoid and WGS84 use different center points and slightly different radii. The shift varies by location: about 500m in India, up to 1,000m in other parts of Asia. This is why every GIS dataset must specify its datum. Military maps, old survey records, and modern GPS all use different datums — mixing them without conversion is a common and dangerous error.',
      codeIntro: 'Convert between geographic and UTM coordinates, and visualize the difference between datums.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Geographic to UTM conversion (simplified)
def geo_to_utm(lat, lon):
    """Simplified UTM conversion (Zone 46, WGS84)"""
    # UTM Zone 46: central meridian = 93°E
    k0 = 0.9996  # scale factor
    a = 6378137.0  # WGS84 semi-major axis
    e = 0.0818  # eccentricity

    lat_rad = np.radians(lat)
    lon_rad = np.radians(lon)
    lon0_rad = np.radians(93)  # central meridian for zone 46

    N = a / np.sqrt(1 - e**2 * np.sin(lat_rad)**2)
    T = np.tan(lat_rad)**2
    C = (e**2 / (1 - e**2)) * np.cos(lat_rad)**2
    A = (lon_rad - lon0_rad) * np.cos(lat_rad)

    M = a * (
        (1 - e**2/4 - 3*e**4/64) * lat_rad
        - (3*e**2/8 + 3*e**4/32) * np.sin(2*lat_rad)
        + (15*e**4/256) * np.sin(4*lat_rad)
    )

    easting = 500000 + k0 * N * (A + (1-T+C) * A**3/6)
    northing = k0 * (M + N * np.tan(lat_rad) * (A**2/2 + (5-T+9*C) * A**4/24))

    return easting, northing

# NE India capitals
capitals = {
    'Guwahati': (26.1445, 91.7362),
    'Shillong': (25.5788, 91.8933),
    'Imphal': (24.8170, 93.9368),
    'Kohima': (25.6751, 94.1086),
    'Aizawl': (23.7271, 92.7176),
    'Agartala': (23.8315, 91.2868),
    'Itanagar': (27.0844, 93.6053),
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Geographic vs UTM coordinates
ax1.set_facecolor('#111827')

geo_lons = [v[1] for v in capitals.values()]
geo_lats = [v[0] for v in capitals.values()]
utm_eastings = []
utm_northings = []

for lat, lon in capitals.values():
    e, n = geo_to_utm(lat, lon)
    utm_eastings.append(e)
    utm_northings.append(n)

colors_cap = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#06b6d4', '#ec4899', '#ef4444']

for i, name in enumerate(capitals.keys()):
    ax1.scatter(utm_eastings[i] / 1000, utm_northings[i] / 1000, c=colors_cap[i], s=80, zorder=5)
    ax1.annotate(name, (utm_eastings[i]/1000, utm_northings[i]/1000),
                xytext=(5, 5), textcoords='offset points', color=colors_cap[i], fontsize=8)

ax1.set_xlabel('UTM Easting (km)', color='white')
ax1.set_ylabel('UTM Northing (km)', color='white')
ax1.set_title('UTM Zone 46 Coordinates', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.grid(True, alpha=0.2, color='gray')

# 2. Datum shift visualization
ax2.set_facecolor('#111827')

# Simulate datum shift (WGS84 vs Everest)
# Approximate shift in NE India: dLat ≈ +0.004°, dLon ≈ -0.005°
shift_lat = 0.004  # degrees
shift_lon = -0.005

for i, (name, (lat, lon)) in enumerate(capitals.items()):
    # WGS84 position
    ax2.scatter(lon, lat, c=colors_cap[i], s=80, marker='o', zorder=5)
    # Everest datum position
    ax2.scatter(lon + shift_lon, lat + shift_lat, c=colors_cap[i], s=80, marker='x', zorder=5, alpha=0.5)
    # Arrow showing shift
    ax2.annotate('', xy=(lon + shift_lon, lat + shift_lat), xytext=(lon, lat),
                arrowprops=dict(arrowstyle='->', color=colors_cap[i], lw=1, alpha=0.5))

ax2.plot([], [], 'ko', markersize=8, label='WGS84 (GPS)')
ax2.plot([], [], 'kx', markersize=8, label='Everest 1830 (survey)')

ax2.set_xlabel('Longitude (°E)', color='white')
ax2.set_ylabel('Latitude (°N)', color='white')
ax2.set_title('Datum Shift: WGS84 vs Everest (~500m)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Coordinate conversion (Guwahati):")
lat, lon = 26.1445, 91.7362
e, n = geo_to_utm(lat, lon)
print(f"  Geographic: {lat}°N, {lon}°E")
print(f"  UTM Zone 46: {e:.0f}E, {n:.0f}N (meters)")
print(f"  UTM (km): {e/1000:.1f}km E, {n/1000:.1f}km N")
print()
print("Datum shift in NE India:")
print(f"  WGS84 → Everest: ~{shift_lat * 111000:.0f}m N, ~{abs(shift_lon) * 111000 * np.cos(np.radians(26)):.0f}m W")
print("  Always check your datum before combining datasets!")`,
      challenge: 'Calculate the UTM coordinates for a point at the exact center of NE India (approximately 25.5°N, 93°E). Since 93°E is the central meridian of UTM Zone 46, what should the Easting be? (Hint: the central meridian always has Easting = 500,000m.)',
      successHint: 'Coordinate systems and datums are the invisible infrastructure of all spatial data. Every GPS reading, every satellite image, every digital map depends on precise coordinate definitions. Getting them wrong has caused plane crashes, missile strikes on wrong targets, and bridges that don\'t meet in the middle.',
    },
    {
      title: 'Map projections — Mercator, Peters, and the politics of shape',
      concept: `In Level 1, we saw that projections distort. Now let's examine the mathematics and politics of specific projections.

**Mercator (1569)**: projects the sphere onto a cylinder wrapped around the equator.
- Mathematics: x = λ, y = ln(tan(π/4 + φ/2)) where λ = longitude, φ = latitude
- Preserves: angles (conformal) → perfect for navigation (a straight line on Mercator is a constant compass bearing)
- Distorts: areas → Greenland appears 14× too large relative to Africa
- Used by: Google Maps (Web Mercator/EPSG:3857), nautical charts

**Peters/Gall-Peters (1973)**: cylindrical equal-area projection.
- Mathematics: x = λ × cos(45°), y = sin(φ) / cos(45°)
- Preserves: relative areas → Africa, India, South America shown at true proportions
- Distorts: shapes → everything near the equator looks vertically stretched
- Controversy: Arno Peters presented it as the "fair" map (decolonizing cartography), claiming Mercator inflates the Global North. Cartographers called it a "mediocre" projection; political scientists called it revolutionary.

**Robinson (1963)**: pseudocylindrical compromise projection.
- No strict mathematical formula — designed by Arthur Robinson through visual trial and error
- Compromises everything: slight area distortion, slight shape distortion, no perfect property
- Used by: National Geographic Society (1988-1998), many atlases`,
      analogy: 'Choosing a map projection is like choosing a camera lens. A fish-eye lens (Mercator) shows everything at the center perfectly but distorts the edges enormously. A telecentric lens (Peters) preserves relative sizes but makes everything look oddly proportioned. A standard lens (Robinson) distorts slightly everywhere but looks "natural." The "best" lens depends on what you\'re photographing — and what story you want to tell.',
      storyConnection: 'When India appears on a Mercator world map in a classroom, it looks smaller than Scandinavia. On a Peters map, India dwarfs Scandinavia (as it should — India is 3.3M km² vs Scandinavia\'s 0.9M km²). "Which map is true?" asks the student. Both, and neither. Each tells a different truth. The choice of projection in a textbook is a political act disguised as a technical decision.',
      checkQuestion: 'Google Maps uses Web Mercator. Most population maps use equal-area projections. Why the difference?',
      checkAnswer: 'Google Maps is for navigation — you need angles preserved to follow compass directions. Mercator preserves angles (a straight line on Mercator is a constant compass bearing). Population maps compare areas — you need relative sizes preserved so density calculations are valid. If you plotted population density on Mercator, Greenland would appear to have a much lower density than it actually does (because its area is inflated). Different questions demand different projections.',
      codeIntro: 'Implement Mercator, Peters, and Robinson projections and compare the distortions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Map projection formulas
def mercator(lat, lon):
    """Mercator projection"""
    x = np.radians(lon)
    y = np.log(np.tan(np.pi/4 + np.radians(lat)/2))
    return x, y

def peters(lat, lon):
    """Gall-Peters (equal area) projection"""
    x = np.radians(lon) * np.cos(np.radians(45))
    y = np.sin(np.radians(lat)) / np.cos(np.radians(45))
    return x, y

def robinson_approx(lat, lon):
    """Robinson projection (approximate)"""
    # Robinson uses lookup tables, this is a polynomial approximation
    abs_lat = np.abs(np.radians(lat))
    x = np.radians(lon) * (0.9986 - 0.2624 * abs_lat**2)
    y = np.sign(lat) * (abs_lat + 0.1 * abs_lat**3)
    return x, y

# Generate graticule (grid of lat/lon lines)
fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.patch.set_facecolor('#1f2937')

projections = [
    ('Mercator', mercator, (-85, 85)),
    ('Gall-Peters', peters, (-90, 90)),
    ('Robinson (approx)', robinson_approx, (-90, 90)),
]

for ax, (name, proj_func, lat_range) in zip(axes, projections):
    ax.set_facecolor('#111827')

    # Draw graticule
    for lat in range(lat_range[0], lat_range[1]+1, 15):
        lons = np.linspace(-180, 180, 100)
        lats = np.full_like(lons, lat)
        xs, ys = proj_func(lats, lons)
        ax.plot(xs, ys, color='gray', linewidth=0.3, alpha=0.5)

    for lon in range(-180, 181, 30):
        lats = np.linspace(lat_range[0], lat_range[1], 100)
        lons = np.full_like(lats, lon)
        xs, ys = proj_func(lats, lons)
        ax.plot(xs, ys, color='gray', linewidth=0.3, alpha=0.5)

    # Plot reference circles at different latitudes
    # Each circle is 15° in diameter — should appear as equal circles on a perfect projection
    for clat, clon, label, color in [(0, 0, 'Equator', '#22c55e'),
                                       (26, 92, 'NE India', '#f59e0b'),
                                       (60, 25, 'Scandinavia', '#3b82f6'),
                                       (72, -40, 'Greenland', '#ef4444')]:
        theta = np.linspace(0, 2*np.pi, 50)
        r = 7  # degrees
        circle_lat = clat + r * np.sin(theta)
        circle_lon = clon + r * np.cos(theta) / max(np.cos(np.radians(clat)), 0.1)

        # Clip latitude
        valid = (circle_lat >= lat_range[0]) & (circle_lat <= lat_range[1])
        if np.any(valid):
            cx, cy = proj_func(circle_lat[valid], circle_lon[valid])
            ax.fill(cx, cy, color=color, alpha=0.3)
            ax.plot(cx, cy, color=color, linewidth=1)

        px, py = proj_func(clat, clon)
        ax.text(px, py, label, ha='center', va='center', color='white', fontsize=7, fontweight='bold')

    ax.set_title(name, color='white', fontsize=12)
    ax.tick_params(colors='gray')
    ax.set_aspect('equal')

plt.tight_layout()
plt.show()

# Quantify distortion
print("Area distortion at different latitudes:")
print("(1.00 = no distortion)")
print()
print(f"{'Latitude':>10} {'Mercator':>10} {'Peters':>10} {'Robinson':>10}")
for lat in [0, 15, 26, 45, 60, 75]:
    merc_distortion = 1 / np.cos(np.radians(lat))**2
    peters_distortion = 1.0  # always 1 (equal area)
    robinson_distortion = 1.0 + 0.15 * (lat/90)**2  # approximate
    print(f"{lat:>8}°N {merc_distortion:>10.2f} {peters_distortion:>10.2f} {robinson_distortion:>10.2f}")

print()
print("Mercator at 75°N: areas inflated by 15×!")
print("Peters: always 1.00 (that's the whole point)")
print("Robinson: slight distortion everywhere, extreme nowhere")`,
      challenge: 'On Mercator, the colored circles should all appear as circles (shape preserved) but different sizes (area distorted). On Peters, they should all be the same size (area preserved) but different shapes (stretched/squished). Verify this visually. Which projection makes NE India look most like its true shape?',
      successHint: 'Map projections are applied mathematics with political consequences. The "Mercator vs. Peters" debate has been called the "Map Wars" — it\'s really a debate about power: whose geography gets shown accurately? Every time you look at a map, you\'re looking at someone\'s choice about what to distort.',
    },
    {
      title: 'GIS software basics — layers, queries, and spatial analysis',
      concept: `**GIS** (Geographic Information System) is software that stores, analyzes, and visualizes spatial data. Think of it as a database where every record has a location. Modern GIS can answer questions like: "How many schools are within 5km of each hospital in Assam?" or "Which villages are in the flood zone of the Brahmaputra?"

GIS data comes in two forms:
- **Vector**: points (cities), lines (roads, rivers), polygons (state boundaries). Stored as coordinate lists. Good for discrete features.
- **Raster**: grid of cells, each with a value (elevation, temperature, rainfall). Like a digital photograph. Good for continuous surfaces.

Core GIS operations:
- **Overlay**: combine two layers (e.g., flood zone polygon + village points → which villages flood?)
- **Buffer**: create a zone around a feature (5km buffer around hospital → who has access?)
- **Clip**: cut one layer using another's boundary (rainfall raster clipped to Assam boundary)
- **Spatial join**: attach attributes from one layer to another based on location (attach district name to each school based on which district polygon contains it)

Professional GIS: QGIS (free/open source), ArcGIS Pro (commercial), PostGIS (spatial database). Web GIS: Leaflet, Mapbox, Google Maps API.`,
      analogy: 'GIS is like Photoshop for maps. In Photoshop, you work with layers — background, foreground, text, effects — that combine to create a final image. In GIS, each layer is a different type of geographic data: one layer for roads, one for rivers, one for elevation. The magic happens when you overlay them and ask questions that span multiple layers.',
      storyConnection: 'Imagine building a GIS for the Seven Sisters. Layer 1: state boundaries. Layer 2: major rivers. Layer 3: cities and towns. Layer 4: elevation. Layer 5: forest cover. Now you can answer: "Which towns in Assam are below 50m elevation and within 10km of the Brahmaputra?" — and those are the towns most at risk of catastrophic flooding.',
      checkQuestion: 'You have a GIS layer of all hospitals in Meghalaya and a layer of all villages. How would you identify which villages are more than 30km from any hospital (underserved areas)?',
      checkAnswer: 'Step 1: Buffer each hospital point by 30km (creates a circle polygon around each). Step 2: Merge all buffer circles into one polygon (the "served area"). Step 3: Spatial query: select all village points that are NOT within the served area polygon. Those are the underserved villages. In SQL: SELECT villages.* FROM villages WHERE NOT ST_Within(villages.geom, served_area.geom). This is exactly how health ministries identify where to build new hospitals.',
      codeIntro: 'Simulate a GIS analysis: buffer, overlay, and spatial query for flood risk.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulated GIS analysis: flood risk for Brahmaputra valley
grid_size = 100
x = np.linspace(0, 100, grid_size)  # km
y = np.linspace(0, 60, grid_size)
X, Y = np.meshgrid(x, y)

# Layer 1: Elevation (river in center, low = flood risk)
elevation = 50 + 30 * np.abs(Y - 30) / 30 + 5 * np.random.rand(grid_size, grid_size)

# Layer 2: River (center line)
river_y = 30 + 3 * np.sin(X / 10)

# Layer 3: Villages (random points)
n_villages = 80
village_x = np.random.uniform(5, 95, n_villages)
village_y = np.random.uniform(5, 55, n_villages)
village_pop = np.random.randint(500, 10000, n_villages)

# Layer 4: Flood zone (within 10km of river AND below 60m elevation)
flood_distance = np.abs(Y - (30 + 3 * np.sin(X / 10)))
flood_zone = (flood_distance < 10) & (elevation < 65)

# Spatial query: which villages are in flood zone?
village_at_risk = []
for i in range(n_villages):
    # Find nearest grid cell
    xi = np.argmin(np.abs(x - village_x[i]))
    yi = np.argmin(np.abs(y - village_y[i]))
    village_at_risk.append(flood_zone[yi, xi])
village_at_risk = np.array(village_at_risk)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Layer 1: Elevation
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.imshow(elevation, origin='lower', extent=[0, 100, 0, 60], cmap='terrain', aspect='auto')
ax.set_title('Layer 1: Elevation (m)', color='white', fontsize=11)
plt.colorbar(im, ax=ax, fraction=0.046)
ax.tick_params(colors='gray')

# Layer 2: River + flood zone
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.imshow(flood_zone.astype(float), origin='lower', extent=[0, 100, 0, 60],
          cmap='Blues', alpha=0.5, aspect='auto')
river_x_plot = np.linspace(0, 100, 200)
river_y_plot = 30 + 3 * np.sin(river_x_plot / 10)
ax.plot(river_x_plot, river_y_plot, color='#3b82f6', linewidth=3, label='Brahmaputra')
ax.set_title('Layer 2: River + Flood Zone (10km buffer)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Layer 3: Villages
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.imshow(flood_zone.astype(float), origin='lower', extent=[0, 100, 0, 60],
          cmap='Blues', alpha=0.2, aspect='auto')
ax.plot(river_x_plot, river_y_plot, color='#3b82f6', linewidth=2, alpha=0.5)
ax.scatter(village_x[~village_at_risk], village_y[~village_at_risk],
          c='#22c55e', s=village_pop[~village_at_risk]/100, label='Safe', alpha=0.7, edgecolors='white', linewidths=0.5)
ax.scatter(village_x[village_at_risk], village_y[village_at_risk],
          c='#ef4444', s=village_pop[village_at_risk]/100, marker='D', label='At risk', alpha=0.8, edgecolors='white', linewidths=0.5)
ax.set_title('Layer 3: Villages (size = population)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Summary statistics
ax = axes[1, 1]
ax.set_facecolor('#111827')

safe_pop = village_pop[~village_at_risk].sum()
risk_pop = village_pop[village_at_risk].sum()
safe_count = np.sum(~village_at_risk)
risk_count = np.sum(village_at_risk)

categories = ['Villages\
at risk', 'Villages\
safe', 'Population\
at risk', 'Population\
safe']
values = [risk_count, safe_count, risk_pop/1000, safe_pop/1000]
colors_bar = ['#ef4444', '#22c55e', '#ef4444', '#22c55e']

bars = ax.bar(categories, values, color=colors_bar, alpha=0.8)
ax.set_title('Flood Risk Assessment Summary', color='white', fontsize=11)
ax.set_ylabel('Count / Population (×1000)', color='white')
ax.tick_params(colors='gray')

for bar, val in zip(bars, values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
           f'{val:.0f}', ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("GIS Flood Risk Analysis Results:")
print(f"  Total villages: {n_villages}")
print(f"  At risk: {risk_count} ({risk_count/n_villages*100:.0f}%)")
print(f"  Safe: {safe_count} ({safe_count/n_villages*100:.0f}%)")
print(f"  Population at risk: {risk_pop:,}")
print(f"  Population safe: {safe_pop:,}")
print(f"  % population at risk: {risk_pop/(risk_pop+safe_pop)*100:.1f}%")
print()
print("GIS operations used:")
print("  1. Buffer: 10km zone around river")
print("  2. Overlay: elevation + flood distance → flood zone")
print("  3. Spatial query: villages WITHIN flood zone")
print("  4. Aggregation: sum population of at-risk villages")`,
      challenge: 'Climate change may widen the flood zone from 10km to 15km. Change flood_distance threshold from 10 to 15 and rerun. How many additional villages become at-risk? This is exactly the analysis that disaster management agencies perform.',
      successHint: 'GIS analysis turns spatial questions into data queries. Every flood evacuation plan, every new hospital location, every road construction project uses this same overlay-buffer-query workflow. The tools change; the logic is universal.',
    },
    {
      title: 'Satellite imagery — seeing Earth from space',
      concept: `Satellite imagery has revolutionized how we understand and monitor the Earth. Modern Earth observation satellites capture images across multiple wavelengths, revealing information invisible to the human eye.

Key satellites and sensors:
- **Landsat** (NASA/USGS): 30m resolution, 16-day revisit. Free data since 1972 — the longest continuous record of Earth's surface.
- **Sentinel-2** (ESA): 10m resolution, 5-day revisit. Free, multispectral.
- **MODIS** (NASA): 250m-1km resolution, daily coverage. Good for large-scale changes.
- **Planet Labs**: 3m resolution, daily coverage. Commercial.
- **ISRO satellites**: Cartosat (2.5m), ResourceSat, INSAT series for India-specific applications.

Spectral bands:
- **Visible (RGB)**: what our eyes see. Good for basic mapping.
- **Near-infrared (NIR)**: strongly reflected by healthy vegetation (chlorophyll). Used for crop health monitoring.
- **NDVI** (Normalized Difference Vegetation Index): (NIR - Red) / (NIR + Red). Values from -1 to 1. Dense forest ≈ 0.6-0.9, bare soil ≈ 0.1-0.2, water ≈ negative.
- **Shortwave infrared (SWIR)**: penetrates haze, detects moisture in soil and vegetation.
- **Thermal infrared**: measures surface temperature. Used for fire detection, urban heat islands.`,
      analogy: 'Satellite imagery is like a medical checkup for the planet. Visible light is like looking at the patient\'s skin. Near-infrared is like checking blood oxygenation (it reveals plant "health" the way pulse oximetry reveals blood oxygen). Thermal infrared is like taking temperature. SWIR is like checking hydration. Each wavelength reveals a different aspect of Earth\'s condition.',
      storyConnection: 'From space, the Seven Sisters look nothing like political boundaries. What\'s visible is physical geography: the bright green of the Brahmaputra floodplain (high NDVI), the darker green of forested hills, the brown-grey of exposed rock at high elevation, and the blue serpentine of the river itself. Sentinel-2 imagery shows that the forest line doesn\'t follow state boundaries — it follows elevation and rainfall contours. Nature doesn\'t read maps.',
      checkQuestion: 'NDVI (vegetation index) of a rice paddy in Assam is 0.8 in July but 0.2 in January. Why such a dramatic change?',
      checkAnswer: 'July is monsoon season — rice is actively growing, with dense green leaves reflecting strongly in NIR → high NDVI. January is post-harvest — the field is bare stubble or fallow soil, which reflects more red light and less NIR → low NDVI. This seasonal NDVI signature is how satellite analysts track crop cycles across millions of hectares without visiting a single field. NDVI time series can detect droughts, floods, and even illegal deforestation.',
      codeIntro: 'Simulate satellite imagery with different spectral bands and calculate NDVI.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a satellite scene of NE India landscape
grid_size = 200
x = np.linspace(0, 20, grid_size)  # km
y = np.linspace(0, 20, grid_size)
X, Y = np.meshgrid(x, y)

# Land cover types
# 0 = water, 1 = rice paddy, 2 = forest, 3 = urban, 4 = bare soil
land_cover = np.ones((grid_size, grid_size), dtype=int)  # default: rice paddy

# River
river_mask = np.abs(Y - (10 + 2*np.sin(X/3))) < 0.8
land_cover[river_mask] = 0

# Forest (hills in north)
forest_mask = (Y > 14) | ((X > 12) & (Y > 8))
land_cover[forest_mask] = 2

# Urban area
urban_mask = ((X - 7)**2 + (Y - 8)**2) < 4
land_cover[urban_mask] = 3

# Bare soil patches
bare_mask = ((X - 3)**2 + (Y - 4)**2) < 1.5
land_cover[bare_mask] = 4

# Spectral reflectance values (approximate, normalized 0-1)
# [Red, Green, Blue, NIR]
reflectance = {
    0: [0.05, 0.05, 0.15, 0.02],  # water
    1: [0.10, 0.20, 0.08, 0.55],  # rice paddy (growing season)
    2: [0.05, 0.15, 0.05, 0.65],  # forest
    3: [0.25, 0.22, 0.20, 0.20],  # urban
    4: [0.30, 0.25, 0.20, 0.25],  # bare soil
}

# Build spectral bands
red = np.zeros((grid_size, grid_size))
green = np.zeros((grid_size, grid_size))
blue = np.zeros((grid_size, grid_size))
nir = np.zeros((grid_size, grid_size))

for lc_type, (r, g, b, n) in reflectance.items():
    mask = land_cover == lc_type
    noise = 0.03 * np.random.rand(grid_size, grid_size)
    red[mask] = r + noise[mask]
    green[mask] = g + noise[mask]
    blue[mask] = b + noise[mask]
    nir[mask] = n + noise[mask]

# Calculate NDVI
ndvi = (nir - red) / (nir + red + 1e-10)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# True color (RGB)
ax = axes[0, 0]
rgb = np.stack([red, green, blue], axis=-1)
rgb = np.clip(rgb * 3, 0, 1)  # brighten
ax.imshow(rgb, origin='lower', extent=[0, 20, 0, 20])
ax.set_title('True Color (RGB)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# False color (NIR-R-G)
ax = axes[0, 1]
false_color = np.stack([nir, red, green], axis=-1)
false_color = np.clip(false_color * 2.5, 0, 1)
ax.imshow(false_color, origin='lower', extent=[0, 20, 0, 20])
ax.set_title('False Color (NIR-R-G)', color='white', fontsize=11)
ax.text(10, 0.5, 'Vegetation appears RED', ha='center', color='white', fontsize=8)
ax.tick_params(colors='gray')

# NIR band alone
ax = axes[0, 2]
ax.imshow(nir, origin='lower', extent=[0, 20, 0, 20], cmap='gray')
ax.set_title('NIR Band (vegetation = bright)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# NDVI
ax = axes[1, 0]
im = ax.imshow(ndvi, origin='lower', extent=[0, 20, 0, 20], cmap='RdYlGn', vmin=-0.5, vmax=1.0)
ax.set_title('NDVI (vegetation health)', color='white', fontsize=11)
plt.colorbar(im, ax=ax, fraction=0.046)
ax.tick_params(colors='gray')

# Land cover classification
ax = axes[1, 1]
colors_lc = ['#3b82f6', '#22c55e', '#166534', '#a0a0a0', '#d4a574']
cmap_lc = plt.cm.colors.ListedColormap(colors_lc)
ax.imshow(land_cover, origin='lower', extent=[0, 20, 0, 20], cmap=cmap_lc)
ax.set_title('Land Cover Classification', color='white', fontsize=11)
ax.tick_params(colors='gray')

# NDVI histogram by land cover
ax = axes[1, 2]
ax.set_facecolor('#111827')
lc_names = ['Water', 'Rice paddy', 'Forest', 'Urban', 'Bare soil']
for i, (name, color) in enumerate(zip(lc_names, colors_lc)):
    mask = land_cover == i
    ax.hist(ndvi[mask], bins=30, alpha=0.6, color=color, label=name, density=True)

ax.set_xlabel('NDVI', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('NDVI Distribution by Land Cover', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("NDVI statistics by land cover type:")
for i, name in enumerate(lc_names):
    mask = land_cover == i
    if mask.sum() > 0:
        print(f"  {name:12s}: NDVI = {ndvi[mask].mean():.3f} ± {ndvi[mask].std():.3f}")
print()
print("NDVI thresholds for classification:")
print("  < 0.0: water")
print("  0.0-0.2: bare soil, urban")
print("  0.2-0.4: sparse vegetation, crops (early/late)")
print("  0.4-0.6: moderate vegetation, growing crops")
print("  0.6-0.9: dense vegetation, healthy forest")`,
      challenge: 'Simulate a drought: reduce rice paddy NIR reflectance from 0.55 to 0.30 (stressed crops reflect less NIR). How does the NDVI map and histogram change? This is exactly how drought monitoring works from space.',
      successHint: 'Satellite imagery is humanity\'s most powerful tool for monitoring Earth at scale. Deforestation, flood mapping, crop failure, urban sprawl, climate change — all are tracked from orbit. The same NDVI formula works for a rice paddy in Assam and a wheat field in Kansas.',
    },
    {
      title: 'Population density mapping — where people live and why',
      concept: `Population density — people per square kilometer — is one of the most fundamental geographic metrics. It determines demand for schools, hospitals, roads, and water. In NE India, population density varies by a factor of 25× within a few hundred kilometers.

Why density varies:
- **Terrain**: flat land supports more people (agriculture, infrastructure). The Brahmaputra valley (Assam) has 398/km²; the mountains of Arunachal Pradesh have 17/km².
- **Water**: settlements cluster near rivers and springs. 70% of Assam's population lives within 25km of the Brahmaputra.
- **Climate**: extreme cold or rainfall limits habitation. Above 3,000m in Arunachal, population density drops below 1/km².
- **Economy**: urban centers concentrate people. Greater Guwahati has 4,500/km² — 265× the state average.
- **History**: centuries of rice agriculture in the Brahmaputra valley created carrying capacity that mountains couldn't match.

Mapping population density requires:
- Census data (every 10 years in India)
- Administrative boundary polygons
- Area calculations (must account for projection distortion!)
- Visualization choices: choropleth (colour-coded regions) vs. dot density vs. cartogram`,
      analogy: 'Population density maps are like heat maps of a building. The lobby (city center) is packed. The hallways (suburban roads) have moderate traffic. The storage rooms (remote mountains) are nearly empty. The map reveals why some spaces are crowded and others aren\'t — which is the first step in designing better spaces.',
      storyConnection: 'The seven sisters have radically different populations: Assam has 31 million people, Mizoram has 1.1 million, in almost equal areas. "Why do so many people live in Assam?" asks the student. Because the Brahmaputra floodplain — flat, fertile, well-watered — can feed millions. Mizoram\'s steep hills can\'t support the same density of agriculture. Geography is population density\'s first cause.',
      checkQuestion: 'India\'s census counts population by district. A district in the Brahmaputra floodplain includes both flat farmland AND a range of hills. The district\'s average density is 300/km². Is this number useful?',
      checkAnswer: 'Not very. If the flat portion has 800/km² and the hills have 20/km², the average of 300 hides both extremes. Anyone planning schools or hospitals based on the average would over-serve the hills and under-serve the floodplain. This is the "modifiable areal unit problem" (MAUP) — the scale of your analysis unit changes the result. Smaller units (villages instead of districts) give more accurate density maps but require more data.',
      codeIntro: 'Create population density maps of the Seven Sisters using multiple visualization methods.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Seven Sisters population data
states = {
    'Arunachal Pradesh': {'area': 83743, 'pop': 1382611, 'capital_pop': 44971},
    'Assam': {'area': 78438, 'pop': 31205576, 'capital_pop': 957352},
    'Meghalaya': {'area': 22429, 'pop': 2966889, 'capital_pop': 354325},
    'Manipur': {'area': 22327, 'pop': 2855794, 'capital_pop': 264986},
    'Nagaland': {'area': 16579, 'pop': 1978502, 'capital_pop': 115283},
    'Mizoram': {'area': 21081, 'pop': 1097206, 'capital_pop': 293416},
    'Tripura': {'area': 10486, 'pop': 3673917, 'capital_pop': 400004},
}

for s in states.values():
    s['density'] = s['pop'] / s['area']
    s['urban_pct'] = s['capital_pop'] / s['pop'] * 100

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

names = list(states.keys())
short_names = [n.split()[0] for n in names]
densities = [states[n]['density'] for n in names]
colors_state = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#06b6d4', '#ec4899']

# 1. Choropleth-style bar chart
ax = axes[0, 0]
ax.set_facecolor('#111827')
sorted_idx = np.argsort(densities)[::-1]
sorted_names = [short_names[i] for i in sorted_idx]
sorted_densities = [densities[i] for i in sorted_idx]
sorted_colors = [colors_state[i] for i in sorted_idx]

bars = ax.barh(sorted_names, sorted_densities, color=sorted_colors)
ax.set_xlabel('Population density (people/km²)', color='white')
ax.set_title('Population Density by State', color='white', fontsize=12)
ax.tick_params(colors='gray')
for bar, d in zip(bars, sorted_densities):
    ax.text(bar.get_width() + 5, bar.get_y() + bar.get_height()/2,
           f'{d:.0f}', va='center', color='white', fontsize=9)

# 2. Area vs Population scatter
ax = axes[0, 1]
ax.set_facecolor('#111827')
areas = [states[n]['area'] / 1000 for n in names]
pops = [states[n]['pop'] / 1e6 for n in names]

for i, name in enumerate(short_names):
    ax.scatter(areas[i], pops[i], s=densities[i], c=colors_state[i], alpha=0.7,
             edgecolors='white', linewidths=1, zorder=3)
    ax.annotate(name, (areas[i], pops[i]), xytext=(5, 5), textcoords='offset points',
               color=colors_state[i], fontsize=9)

# Density reference lines
for d, label in [(50, '50/km²'), (200, '200/km²'), (400, '400/km²')]:
    area_line = np.linspace(5, 90, 100)
    pop_line = d * area_line  # pop = density × area
    ax.plot(area_line, pop_line / 1e3, ':', color='gray', linewidth=0.5)
    ax.text(85, d * 85 / 1e3, label, color='gray', fontsize=7)

ax.set_xlabel('Area (×1000 km²)', color='white')
ax.set_ylabel('Population (millions)', color='white')
ax.set_title('Area vs Population (size = density)', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 3. Cartogram (area proportional to population)
ax = axes[1, 0]
ax.set_facecolor('#111827')

# Simple cartogram: squares with area proportional to population
total_pop = sum(s['pop'] for s in states.values())
scale = 10  # visual scale

# Arrange in a rough geographic layout
positions = {
    'Arunachal Pradesh': (3, 4),
    'Nagaland': (4, 3),
    'Assam': (2, 3),
    'Meghalaya': (2, 2),
    'Manipur': (4, 2),
    'Tripura': (1, 1),
    'Mizoram': (3, 1),
}

for i, name in enumerate(names):
    pop_frac = states[name]['pop'] / total_pop
    size = np.sqrt(pop_frac) * scale
    px, py = positions[name]
    rect = plt.Rectangle((px - size/2, py - size/2), size, size,
                          facecolor=colors_state[i], alpha=0.7, edgecolor='white')
    ax.add_patch(rect)
    ax.text(px, py, f'{short_names[i]}\
{states[name]["pop"]/1e6:.1f}M',
           ha='center', va='center', color='white', fontsize=7, fontweight='bold')

ax.set_xlim(-0.5, 6)
ax.set_ylim(-0.5, 5.5)
ax.set_aspect('equal')
ax.set_title('Cartogram (size ∝ population)', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 4. Urbanization comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
urban = [states[n]['urban_pct'] for n in names]

x_pos = np.arange(len(names))
ax.bar(x_pos, urban, color=colors_state)
ax.set_xticks(x_pos)
ax.set_xticklabels(short_names, rotation=30, ha='right', color='white', fontsize=8)
ax.set_ylabel('Capital city % of state pop', color='white')
ax.set_title('Urbanization: Capital City Dominance', color='white', fontsize=12)
ax.tick_params(colors='gray')

for i, u in enumerate(urban):
    ax.text(i, u + 0.5, f'{u:.1f}%', ha='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Seven Sisters population statistics:")
print(f"{'State':<22} {'Area km²':>10} {'Population':>12} {'Density':>10}")
for name in names:
    s = states[name]
    print(f"{name:<22} {s['area']:>10,} {s['pop']:>12,} {s['density']:>10.0f}")
print()
total_area = sum(s['area'] for s in states.values())
print(f"{'TOTAL':<22} {total_area:>10,} {total_pop:>12,} {total_pop/total_area:>10.0f}")
print()
print(f"Density range: {min(densities):.0f} to {max(densities):.0f} per km²")
print(f"Ratio: {max(densities)/min(densities):.0f}× difference")`,
      challenge: 'Assam has 31M people in 78,000 km², but most live in the Brahmaputra valley (~30,000 km²). If 85% of Assam\'s population lives in the valley, what\'s the valley\'s density? What about the hilly remainder? This disaggregation reveals the true spatial pattern.',
      successHint: 'Population density mapping is the basis of all public service planning — schools, hospitals, roads, water supply, emergency services. The same techniques apply whether you\'re planning for a village of 500 or a megacity of 20 million.',
    },
    {
      title: 'Climate zones — why the weather changes with every valley',
      concept: `NE India contains more climate diversity in a small area than almost anywhere else on Earth. This is because climate depends on three variables that change dramatically over short distances here:

1. **Altitude**: temperature drops ~6.5°C per 1,000m of elevation gain (lapse rate). The Brahmaputra plain (30m) is 25°C warmer than Kangto peak (7,090m) — enough to span tropical to arctic conditions.

2. **Aspect (slope direction)**: south-facing slopes receive more direct sunlight → warmer and drier. North-facing slopes are cooler and wetter. In the Naga hills, you can walk from tropical forest to temperate forest by crossing a single ridge.

3. **Orographic effect**: moist monsoon air rises over mountains, cools, condenses, and dumps rain on the windward side. The leeward side (rain shadow) is dramatically drier.

**Koppen climate classification** in NE India:
- **Aw** (tropical savanna): Brahmaputra floodplain
- **Cwa** (humid subtropical): lower hills (500-1500m)
- **Cwb** (subtropical highland): Shillong plateau, higher hills
- **ET** (tundra): above 4,500m in Arunachal Pradesh

The result: walking 100 km from the Brahmaputra to the Himalayan peaks is climatically equivalent to traveling from Bangkok to the Arctic. Each climate zone supports different vegetation, agriculture, and human culture.`,
      analogy: 'Climate zones in NE India are like floors of a very tall building. The ground floor (Brahmaputra plain) is tropical — hot and steamy. The middle floors (hills) are temperate — pleasant year-round. The upper floors (high mountains) are frigid — snow and ice. The elevator ride (hiking) takes you through thousands of kilometres of climate in just 100 km of distance.',
      storyConnection: 'The seven sisters don\'t just have different geography — they have different climates. Tripura (low, flat) is tropical and steamy. Shillong (1,500m plateau) is cool enough for pine forests and sweaters. Tawang in Arunachal (3,048m) gets snow and has monasteries built for insulation. Each sister dresses differently because each lives in a different climate zone — separated by mountains, not thousands of kilometres.',
      checkQuestion: 'Mawsynram (1,401m elevation) gets 12,000mm of rain, but Tawang (3,048m), only 200 km away, gets just 800mm. Both are in hills receiving monsoon winds. Why the difference?',
      checkAnswer: 'Rain shadow effect. Mawsynram sits on the southern (windward) side of the Khasi Hills — moist monsoon air is forced upward, cools, and dumps its moisture. By the time the air crosses the hills and reaches Tawang (on the leeward/northern side of the Himalayas), it has lost most of its moisture. The mountains literally wring the water out of the air. The first hill gets soaked; the valley behind stays dry.',
      codeIntro: 'Model how temperature and rainfall change with altitude and aspect across NE India.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Climate model for NE India
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Temperature lapse rate
ax = axes[0, 0]
ax.set_facecolor('#111827')

altitude = np.linspace(0, 5000, 200)  # meters
lapse_rate = 6.5  # °C per 1000m
base_temp = 28  # °C at sea level (Assam summer)

temp = base_temp - lapse_rate * altitude / 1000

ax.plot(altitude, temp, color='#ef4444', linewidth=2)
ax.fill_between(altitude, temp, -10, alpha=0.1, color='#ef4444')

# Mark climate zones
zones = [
    (0, 500, 'Tropical (Aw)', '#ef4444'),
    (500, 1500, 'Subtropical (Cwa)', '#f59e0b'),
    (1500, 3500, 'Temperate (Cwb)', '#22c55e'),
    (3500, 4500, 'Alpine', '#3b82f6'),
    (4500, 5000, 'Tundra (ET)', '#a855f7'),
]
for lo, hi, label, color in zones:
    ax.axhspan(base_temp - lapse_rate*hi/1000, base_temp - lapse_rate*lo/1000, alpha=0.1, color=color)
    mid_alt = (lo + hi) / 2
    mid_temp = base_temp - lapse_rate * mid_alt / 1000
    ax.text(4800, mid_temp, label, color=color, fontsize=8, ha='right')

# Mark key locations
locations_alt = {'Brahmaputra plain': 50, 'Shillong': 1496, 'Tawang': 3048, 'Sela Pass': 4170}
for name, alt in locations_alt.items():
    t = base_temp - lapse_rate * alt / 1000
    ax.plot(alt, t, 'o', color='white', markersize=6)
    ax.annotate(f'{name}\
({alt}m, {t:.0f}°C)', xy=(alt, t), xytext=(alt+200, t+2),
               color='white', fontsize=7, arrowprops=dict(arrowstyle='->', color='gray', lw=0.5))

ax.set_xlabel('Altitude (m)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Temperature Lapse Rate (6.5°C per 1000m)', color='white', fontsize=12)
ax.tick_params(colors='gray')
ax.set_ylim(-10, 32)

# 2. Orographic rainfall model
ax = axes[0, 1]
ax.set_facecolor('#111827')

distance = np.linspace(0, 200, 300)  # km from Bay of Bengal
# Mountain profile
mountain = np.zeros_like(distance)
mountain[(distance > 80) & (distance < 130)] = 1500 * np.sin(
    np.pi * (distance[(distance > 80) & (distance < 130)] - 80) / 50)
mountain[(distance > 130)] = 1500 * np.exp(-(distance[(distance > 130)] - 130) / 30)

# Moisture content decreases as air rises
moisture = 100 * np.exp(-mountain / 800)
rainfall_rate = np.maximum(0, -np.gradient(moisture))
rainfall_rate = rainfall_rate / rainfall_rate.max() * 12000  # scale to Mawsynram

ax.fill_between(distance, 0, mountain / 1500 * 5000, color='#8B7355', alpha=0.3)
ax.plot(distance, mountain / 1500 * 5000, color='#8B7355', linewidth=1)

ax_rain = ax.twinx()
ax_rain.fill_between(distance, 0, rainfall_rate, color='#3b82f6', alpha=0.3)
ax_rain.plot(distance, rainfall_rate, color='#3b82f6', linewidth=2)

ax.set_xlabel('Distance from Bay of Bengal (km)', color='white')
ax.set_ylabel('Elevation (m)', color='#8B7355')
ax_rain.set_ylabel('Rainfall (mm/year)', color='#3b82f6')
ax.set_title('Orographic Rainfall: Windward vs Leeward', color='white', fontsize=12)
ax.tick_params(axis='y', colors='#8B7355')
ax_rain.tick_params(axis='y', colors='#3b82f6')
ax.tick_params(axis='x', colors='gray')

ax.text(105, 4500, 'Mawsynram\
(windward)', color='#3b82f6', fontsize=9, ha='center')
ax.text(170, 2000, 'Rain shadow\
(leeward)', color='#ef4444', fontsize=9, ha='center')

# 3. Monthly climate comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# Temperature profiles (°C)
guwahati_temp = [17, 19, 23, 26, 27, 29, 29, 29, 28, 26, 22, 18]
shillong_temp = [10, 12, 16, 19, 20, 21, 21, 21, 20, 18, 14, 11]
tawang_temp = [-3, 0, 4, 8, 11, 14, 15, 15, 13, 9, 4, -1]

x_m = np.arange(12)
ax.plot(x_m, guwahati_temp, 'o-', color='#ef4444', linewidth=2, label='Guwahati (50m)')
ax.plot(x_m, shillong_temp, 's-', color='#22c55e', linewidth=2, label='Shillong (1496m)')
ax.plot(x_m, tawang_temp, 'D-', color='#3b82f6', linewidth=2, label='Tawang (3048m)')

ax.set_xticks(x_m)
ax.set_xticklabels(months, color='white', fontsize=8)
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Monthly Temperature at Three Elevations', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.axhline(0, color='gray', linestyle=':', linewidth=0.5)

# 4. Koppen classification summary
ax = axes[1, 1]
ax.set_facecolor('#111827')

koppen = {
    'Aw (Tropical savanna)': {'area_pct': 35, 'elev_range': '0-500m', 'color': '#ef4444'},
    'Cwa (Humid subtropical)': {'area_pct': 30, 'elev_range': '500-1500m', 'color': '#f59e0b'},
    'Cwb (Subtropical highland)': {'area_pct': 20, 'elev_range': '1500-3500m', 'color': '#22c55e'},
    'Dwb/ET (Alpine/Tundra)': {'area_pct': 15, 'elev_range': '>3500m', 'color': '#3b82f6'},
}

names_k = list(koppen.keys())
pcts = [koppen[n]['area_pct'] for n in names_k]
colors_k = [koppen[n]['color'] for n in names_k]

ax.pie(pcts, labels=names_k, colors=colors_k, autopct='%1.0f%%',
       textprops={'color': 'white', 'fontsize': 9}, pctdistance=0.8)
ax.set_title('Climate Zones of NE India', color='white', fontsize=12)

plt.tight_layout()
plt.show()

print("Climate zones of NE India:")
for name, data in koppen.items():
    print(f"  {name}: {data['area_pct']}% of area, elevation {data['elev_range']}")
print()
print("Key climate gradients:")
print(f"  Temperature range: {min(tawang_temp)}°C (Tawang, Jan) to {max(guwahati_temp)}°C (Guwahati, Jul)")
print(f"  Rainfall range: ~800 mm/yr (Tawang) to ~12,000 mm/yr (Mawsynram)")
print(f"  All within 200 km horizontal distance!")`,
      challenge: 'If global warming increases base temperature by 2°C, how do the climate zone boundaries shift? Recalculate where the 0°C line falls (currently ~4,300m). The zone boundaries move upward, shrinking alpine habitat. Calculate the altitude shift for a 2°C warming.',
      successHint: 'Climate zone mapping is the basis of agriculture planning, biodiversity conservation, and climate change impact assessment. NE India\'s extreme climate diversity in a compact area makes it a natural laboratory — and one of the regions most sensitive to climate change.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Geospatial Science — builds on Level 1 concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for geospatial science simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}