import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import MapMercatorMathDiagram from '../diagrams/MapMercatorMathDiagram';
import MapInterpolationDiagram from '../diagrams/MapInterpolationDiagram';
import MapVectorRasterDiagram from '../diagrams/MapVectorRasterDiagram';
import MapBufferOverlayDiagram from '../diagrams/MapBufferOverlayDiagram';
import MapNetworkDiagram from '../diagrams/MapNetworkDiagram';
import NEIndiaBiomesDiagram from '../diagrams/NEIndiaBiomesDiagram';

export default function MapMakerLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Map projections — the mathematics of flattening a sphere",
      concept: "the mathematics of flattening a sphere. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The map maker's granddaughter inherited her grandmother's passion for capturing the world on paper. But where her grandmother used careful hand-drawing, our tools use mathematics: projecting the curved Earth onto flat paper with known distortion, placing features with meter-level precision, and choosing colors and symbols that communicate clearly.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Map projections — the mathematics of flattening a sphere ---
print("=== Map Projections: Flattening a Sphere ===\
")

# The fundamental problem: you cannot flatten a sphere without distortion.
# Different projections choose WHAT to distort.

R = 6371.0  # Earth's radius in km

# Mercator projection: preserves angles (conformal), distorts area
def mercator(lat_deg, lon_deg):
    lat = np.radians(lat_deg)
    lon = np.radians(lon_deg)
    x = R * lon
    y = R * np.log(np.tan(np.pi/4 + lat/2))
    return x, y

# Equirectangular (Plate Carree): simplest projection
def equirectangular(lat_deg, lon_deg):
    x = R * np.radians(lon_deg)
    y = R * np.radians(lat_deg)
    return x, y

# Test with NE India locations
places = {
    "Guwahati":  (26.14, 91.74),
    "Shillong":  (25.57, 91.88),
    "Dibrugarh": (27.47, 94.91),
    "Imphal":    (24.82, 93.95),
    "Kohima":    (25.67, 94.11),
}

print(f"{'Place':<14s} {'Lat':>7s} {'Lon':>7s} | {'Mercator X':>11s} {'Merc Y':>11s} | {'Equirect X':>11s} {'Equi Y':>10s}")
print("-" * 85)
for name, (lat, lon) in places.items():
    mx, my = mercator(lat, lon)
    ex, ey = equirectangular(lat, lon)
    print(f"{name:<14s} {lat:>7.2f} {lon:>7.2f} | {mx:>11.1f} {my:>11.1f} | {ex:>11.1f} {ey:>10.1f}")

# Show area distortion at different latitudes
print("\
Mercator area distortion by latitude:")
print("(ratio = how many times larger areas appear vs reality)")
for lat in [0, 15, 26, 45, 60, 75]:
    # Mercator scale factor = sec(lat)
    scale = 1 / np.cos(np.radians(lat))
    area_distortion = scale ** 2  # area scales as square of linear
    print(f"  {lat:>2d} degrees: {area_distortion:>6.2f}x (scale factor {scale:.3f})")

# Distance comparison
lat1, lon1 = places["Guwahati"]
lat2, lon2 = places["Dibrugarh"]
# True great-circle distance
dlat = np.radians(lat2 - lat1)
dlon = np.radians(lon2 - lon1)
a = np.sin(dlat/2)**2 + np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) * np.sin(dlon/2)**2
true_dist = 2 * R * np.arcsin(np.sqrt(a))

# Mercator straight-line distance
mx1, my1 = mercator(lat1, lon1)
mx2, my2 = mercator(lat2, lon2)
merc_dist = np.sqrt((mx2-mx1)**2 + (my2-my1)**2)

print(f"\
Guwahati -> Dibrugarh:")
print(f"  Great-circle (true): {true_dist:.1f} km")
print(f"  Mercator straight-line: {merc_dist:.1f} km")
print(f"  Error: {abs(merc_dist - true_dist):.1f} km ({abs(merc_dist - true_dist)/true_dist*100:.1f}%)")
print(f"\
Key insight: At 26 degrees N (NE India), Mercator inflates areas by")
print(f"~1.24x. This is modest, but at 60 degrees it becomes 4x. That is why")
print(f"Greenland looks as big as Africa on Google Maps (Mercator), when Africa")
print(f"is actually 14 times larger.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Coordinate transformations — converting between geographic systems",
      concept: "converting between geographic systems. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The map maker's granddaughter inherited her grandmother's passion for capturing the world on paper. But where her grandmother used careful hand-drawing, our tools use mathematics: projecting the curved Earth onto flat paper with known distortion, placing features with meter-level precision, and choosing colors and symbols that communicate clearly.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Coordinate transformations — converting between geographic systems ---
print("=== Coordinate Transformations ===\
")

# Geographic coordinates (lat/lon in degrees) vs UTM (meters on a flat grid)
# NE India falls in UTM Zone 46N

# Simplified UTM conversion (Zone 46N, central meridian 93 degrees E)
def latlon_to_utm46(lat_deg, lon_deg):
    """Simplified UTM Zone 46N projection."""
    lat = np.radians(lat_deg)
    lon = np.radians(lon_deg)
    lon0 = np.radians(93.0)  # central meridian for zone 46
    k0 = 0.9996  # UTM scale factor
    R = 6378137.0  # WGS84 semi-major axis in meters

    # Transverse Mercator (simplified for near-equator)
    dlon = lon - lon0
    x = k0 * R * dlon * np.cos(lat)
    y = k0 * R * lat
    # UTM adds false easting of 500000m
    easting = x + 500000
    northing = y
    return easting, northing

# Test with NE India locations
places = {
    "Guwahati":  (26.14, 91.74),
    "Shillong":  (25.57, 91.88),
    "Dibrugarh": (27.47, 94.91),
    "Tezpur":    (26.63, 92.80),
    "Jorhat":    (26.76, 94.22),
}

print("Geographic -> UTM Zone 46N conversion:")
print(f"{'Place':<12s} {'Lat':>7s} {'Lon':>7s} | {'Easting(m)':>12s} {'Northing(m)':>12s}")
print("-" * 55)
utm_coords = {}
for name, (lat, lon) in places.items():
    e, n = latlon_to_utm46(lat, lon)
    utm_coords[name] = (e, n)
    print(f"{name:<12s} {lat:>7.2f} {lon:>7.2f} | {e:>12.0f} {n:>12.0f}")

# Demonstrate advantage: distances in meters are just Pythagorean theorem
print("\
Distances using UTM coordinates (Pythagorean theorem):")
pairs = [("Guwahati", "Shillong"), ("Guwahati", "Tezpur"), ("Tezpur", "Jorhat")]
for a, b in pairs:
    dx = utm_coords[b][0] - utm_coords[a][0]
    dy = utm_coords[b][1] - utm_coords[a][1]
    dist_m = np.sqrt(dx**2 + dy**2)
    bearing = np.degrees(np.arctan2(dx, dy)) % 360
    print(f"  {a} -> {b}: {dist_m/1000:.1f} km, bearing {bearing:.1f} degrees")

# DMS (degrees-minutes-seconds) to decimal degrees conversion
def dms_to_decimal(degrees, minutes, seconds, direction):
    decimal = degrees + minutes/60 + seconds/3600
    if direction in ['S', 'W']:
        decimal = -decimal
    return decimal

# Example: Kaziranga National Park entrance
kaz_lat = dms_to_decimal(26, 34, 48, 'N')
kaz_lon = dms_to_decimal(93, 10, 12, 'E')
print(f"\
DMS -> Decimal example:")
print(f"  Kaziranga: 26d 34m 48s N, 93d 10m 12s E")
print(f"  = ({kaz_lat:.4f}, {kaz_lon:.4f}) decimal degrees")
e, n = latlon_to_utm46(kaz_lat, kaz_lon)
print(f"  = UTM 46N: ({e:.0f} E, {n:.0f} N)")

print("\
Key insight: UTM coordinates let you measure distances with simple")
print("arithmetic (Pythagoras), while lat/lon requires the haversine formula.")
print("But UTM zones are only 6 degrees wide — crossing zone boundaries")
print("requires a zone-to-zone transformation.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Spatial data structures — quadtrees and R-trees for efficient queries",
      concept: "quadtrees and R-trees for efficient queries. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The map maker's granddaughter inherited her grandmother's passion for capturing the world on paper. But where her grandmother used careful hand-drawing, our tools use mathematics: projecting the curved Earth onto flat paper with known distortion, placing features with meter-level precision, and choosing colors and symbols that communicate clearly.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Spatial data structures — quadtrees for efficient queries ---
print("=== Quadtree: Spatial Indexing ===\
")

np.random.seed(42)

class QuadTree:
    """A simple quadtree for 2D point data."""
    def __init__(self, x_min, y_min, x_max, y_max, capacity=4, depth=0):
        self.bounds = (x_min, y_min, x_max, y_max)
        self.capacity = capacity
        self.depth = depth
        self.points = []
        self.children = None  # NW, NE, SW, SE

    def insert(self, point):
        x, y, name = point
        bx0, by0, bx1, by1 = self.bounds
        if not (bx0 <= x <= bx1 and by0 <= y <= by1):
            return False
        if self.children is None and len(self.points) < self.capacity:
            self.points.append(point)
            return True
        if self.children is None:
            self._subdivide()
        for child in self.children:
            if child.insert(point):
                return True
        return False

    def _subdivide(self):
        bx0, by0, bx1, by1 = self.bounds
        mx, my = (bx0+bx1)/2, (by0+by1)/2
        self.children = [
            QuadTree(bx0, my, mx, by1, self.capacity, self.depth+1),  # NW
            QuadTree(mx, my, bx1, by1, self.capacity, self.depth+1),  # NE
            QuadTree(bx0, by0, mx, my, self.capacity, self.depth+1),  # SW
            QuadTree(mx, by0, bx1, my, self.capacity, self.depth+1),  # SE
        ]
        for p in self.points:
            for child in self.children:
                if child.insert(p):
                    break
        self.points = []

    def query_range(self, qx0, qy0, qx1, qy1):
        """Find all points within a rectangular query range."""
        bx0, by0, bx1, by1 = self.bounds
        if qx1 < bx0 or qx0 > bx1 or qy1 < by0 or qy0 > by1:
            return []
        found = []
        for x, y, name in self.points:
            if qx0 <= x <= qx1 and qy0 <= y <= qy1:
                found.append((x, y, name))
        if self.children:
            for child in self.children:
                found.extend(child.query_range(qx0, qy0, qx1, qy1))
        return found

    def count_nodes(self):
        c = 1
        if self.children:
            for child in self.children:
                c += child.count_nodes()
        return c

# Build quadtree with NE India locations (lat as y, lon as x)
qt = QuadTree(89.0, 22.0, 97.0, 29.0, capacity=2)

locations = [
    (91.74, 26.14, "Guwahati"), (91.88, 25.57, "Shillong"),
    (94.91, 27.47, "Dibrugarh"), (92.80, 26.63, "Tezpur"),
    (94.22, 26.76, "Jorhat"), (93.17, 26.58, "Kaziranga"),
    (93.95, 24.82, "Imphal"), (94.11, 25.67, "Kohima"),
    (91.79, 26.18, "Dispur"), (92.72, 26.34, "Nagaon"),
]

for loc in locations:
    qt.insert(loc)

print(f"Inserted {len(locations)} locations into quadtree")
print(f"Tree has {qt.count_nodes()} nodes (capacity=2 per leaf)")

# Range query: find places near Kaziranga (within ~1 degree box)
qx0, qy0, qx1, qy1 = 92.0, 26.0, 94.5, 27.5
results = qt.query_range(qx0, qy0, qx1, qy1)
print(f"\
Range query: lon [{qx0},{qx1}], lat [{qy0},{qy1}]")
print(f"Found {len(results)} locations:")
for x, y, name in results:
    print(f"  {name}: ({y:.2f}N, {x:.2f}E)")

# Compare: brute-force search checks all N points
# Quadtree prunes entire branches
brute_checks = len(locations)
print(f"\
Brute-force search: {brute_checks} comparisons")
print(f"Quadtree: ~{int(np.log2(qt.count_nodes()))+len(results)} node visits (logarithmic)")
print(f"\
With 1 million map features, quadtree reduces query time from")
print(f"O(N)=1,000,000 checks to O(log N)=~20 node visits. That is the")
print(f"difference between 1 second and 0.00002 seconds per query.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Distance calculations — great circle vs Euclidean on curved surfaces",
      concept: "great circle vs Euclidean on curved surfaces. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The map maker's granddaughter inherited her grandmother's passion for capturing the world on paper. But where her grandmother used careful hand-drawing, our tools use mathematics: projecting the curved Earth onto flat paper with known distortion, placing features with meter-level precision, and choosing colors and symbols that communicate clearly.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Distance calculations — great circle vs Euclidean on curved surfaces ---
print("=== Great Circle vs Euclidean Distance ===\
")

R = 6371.0  # Earth radius in km

def haversine(lat1, lon1, lat2, lon2):
    """Great-circle distance using the haversine formula."""
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1)*np.cos(lat2)*np.sin(dlon/2)**2
    return 2 * R * np.arcsin(np.sqrt(a))

def euclidean_approx(lat1, lon1, lat2, lon2):
    """Flat-Earth approximation: treat degrees as a grid."""
    # 1 degree latitude ~ 111.32 km
    # 1 degree longitude ~ 111.32 * cos(avg_lat) km
    avg_lat = np.radians((lat1 + lat2) / 2)
    dy = (lat2 - lat1) * 111.32
    dx = (lon2 - lon1) * 111.32 * np.cos(avg_lat)
    return np.sqrt(dx**2 + dy**2)

# NE India city pairs at varying distances
pairs = [
    ("Guwahati", 26.14, 91.74, "Dispur", 26.18, 91.79),
    ("Guwahati", 26.14, 91.74, "Shillong", 25.57, 91.88),
    ("Guwahati", 26.14, 91.74, "Dibrugarh", 27.47, 94.91),
    ("Guwahati", 26.14, 91.74, "Imphal", 24.82, 93.95),
    ("Guwahati", 26.14, 91.74, "Kolkata", 22.57, 88.36),
    ("Guwahati", 26.14, 91.74, "Delhi", 28.61, 77.21),
]

print(f"{'Route':<28s} {'Haversine':>10s} {'Euclidean':>10s} {'Error':>7s} {'Error%':>7s}")
print("-" * 65)
for name1, lat1, lon1, name2, lat2, lon2 in pairs:
    gc = haversine(lat1, lon1, lat2, lon2)
    eu = euclidean_approx(lat1, lon1, lat2, lon2)
    err = abs(eu - gc)
    pct = err / gc * 100 if gc > 0 else 0
    route = f"{name1}->{name2}"
    print(f"{route:<28s} {gc:>9.1f}km {eu:>9.1f}km {err:>6.1f}km {pct:>6.1f}%")

print("\
Error grows with distance because the Euclidean approximation")
print("ignores Earth's curvature. The pattern:")
print("  < 50 km:  error < 0.1% (flat Earth is fine)")
print("  50-300 km: error 0.1-1% (noticeable for precision work)")
print("  > 500 km:  error > 1% (must use haversine)")

# Bearing calculation
def initial_bearing(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1
    x = np.sin(dlon) * np.cos(lat2)
    y = np.cos(lat1)*np.sin(lat2) - np.sin(lat1)*np.cos(lat2)*np.cos(dlon)
    return (np.degrees(np.arctan2(x, y)) + 360) % 360

print("\
Initial bearings from Guwahati:")
for name1, lat1, lon1, name2, lat2, lon2 in pairs:
    bearing = initial_bearing(lat1, lon1, lat2, lon2)
    dist = haversine(lat1, lon1, lat2, lon2)
    cardinal = ["N","NE","E","SE","S","SW","W","NW"][int((bearing + 22.5) / 45) % 8]
    print(f"  -> {name2:<12s}: {bearing:>6.1f} degrees ({cardinal}), {dist:.0f} km")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Thematic mapping — choropleth, proportional symbol, and heat maps",
      concept: "choropleth, proportional symbol, and heat maps. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The map maker's granddaughter inherited her grandmother's passion for capturing the world on paper. But where her grandmother used careful hand-drawing, our tools use mathematics: projecting the curved Earth onto flat paper with known distortion, placing features with meter-level precision, and choosing colors and symbols that communicate clearly.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Thematic mapping — choropleth, proportional symbol, and heat maps ---
print("=== Thematic Mapping: Data Classification ===\
")

np.random.seed(42)

# NE India district data: population density (people per sq km)
districts = {
    "Kamrup Metro":   1313,
    "Cachar":          417,
    "Nagaon":          603,
    "Dibrugarh":       393,
    "Sonitpur":        301,
    "East Khasi Hills":353,
    "Imphal West":    1074,
    "Kohima":          131,
    "Aizawl":          113,
    "West Tripura":    973,
    "Ri Bhoi":         151,
    "Golaghat":        321,
}

values = np.array(list(districts.values()))
names = list(districts.keys())

print(f"Data: {len(districts)} NE India districts, population density (per sq km)")
print(f"Range: {values.min()} - {values.max()}")
print(f"Mean: {values.mean():.0f}, Median: {np.median(values):.0f}, Std: {values.std():.0f}")

# METHOD 1: Equal interval classification
n_classes = 4
interval = (values.max() - values.min()) / n_classes
breaks_equal = [values.min() + i * interval for i in range(n_classes + 1)]
print(f"\
--- Equal Interval ({n_classes} classes) ---")
print(f"Breaks: {[round(b) for b in breaks_equal]}")
for i in range(n_classes):
    lo, hi = breaks_equal[i], breaks_equal[i+1]
    members = [n for n, v in zip(names, values) if lo <= v < hi or (i == n_classes-1 and v == hi)]
    print(f"  Class {i+1} [{lo:.0f}-{hi:.0f}]: {len(members)} districts: {', '.join(members)}")

# METHOD 2: Quantile classification (equal count per class)
quantiles = np.percentile(values, [0, 25, 50, 75, 100])
print(f"\
--- Quantile ({n_classes} classes) ---")
print(f"Breaks: {[round(q) for q in quantiles]}")
for i in range(n_classes):
    lo, hi = quantiles[i], quantiles[i+1]
    members = [n for n, v in zip(names, values) if lo <= v < hi or (i == n_classes-1 and v == hi)]
    print(f"  Class {i+1} [{lo:.0f}-{hi:.0f}]: {len(members)} districts")

# METHOD 3: Natural breaks (Jenks) — simplified
# Use sorted values and find largest gaps
sorted_vals = np.sort(values)
gaps = np.diff(sorted_vals)
gap_indices = np.argsort(gaps)[::-1][:n_classes-1]
break_positions = np.sort(gap_indices)
jenks_breaks = [sorted_vals[0]]
for idx in break_positions:
    jenks_breaks.append((sorted_vals[idx] + sorted_vals[idx+1]) / 2)
jenks_breaks.append(sorted_vals[-1])

print(f"\
--- Natural Breaks (Jenks-like) ---")
print(f"Breaks: {[round(b) for b in jenks_breaks]}")
for i in range(n_classes):
    lo, hi = jenks_breaks[i], jenks_breaks[i+1]
    members = [n for n, v in zip(names, values) if lo <= v < hi or (i == n_classes-1 and v == hi)]
    print(f"  Class {i+1} [{lo:.0f}-{hi:.0f}]: {len(members)} districts")

# Proportional symbol sizing
print("\
--- Proportional Symbol Sizes ---")
min_radius = 3
max_radius = 20
for name in sorted(districts, key=districts.get, reverse=True)[:6]:
    val = districts[name]
    radius = min_radius + (max_radius - min_radius) * (val - values.min()) / (values.max() - values.min())
    print(f"  {name:<18s}: density={val:>5d}, symbol radius={radius:.1f}px")

print("\
Key insight: The classification method changes the story the map tells.")
print("Equal interval emphasizes Kamrup Metro as an outlier; quantile shows")
print("a more balanced picture; natural breaks respects the data's own clusters.")`,
      challenge: "Extend this model by adding a second variable and exploring how the interaction changes the results.",
      successHint: "You now understand the computational foundation for this analysis. The next lesson builds on this foundation.",
    },
    {
      title: "Spatial interpolation — kriging and IDW for mapping between sample points",
      concept: "kriging and IDW for mapping between sample points. This lesson explores the mathematical foundations and computational methods for this topic, building from theory to implementation with real data analysis.\n\nThe core concepts involve numerical modeling, data analysis, and scientific computing. We use numpy for computation and matplotlib for visualization to build working implementations from scratch.\n\nKey technical elements include parameter estimation, model validation, and uncertainty quantification. Each concept connects directly to the story theme and demonstrates how computational thinking transforms domain expertise into reproducible, scalable analysis.",
      analogy: "Think of this concept as a systematic way to understand something that experts grasp intuitively. Just as a musician does not think about frequency ratios while playing — they just hear harmony — domain experts internalize these relationships through experience. Our computational model makes the implicit explicit, allowing anyone to apply the same reasoning.",
      storyConnection: "The map maker's granddaughter inherited her grandmother's passion for capturing the world on paper. But where her grandmother used careful hand-drawing, our tools use mathematics: projecting the curved Earth onto flat paper with known distortion, placing features with meter-level precision, and choosing colors and symbols that communicate clearly.",
      checkQuestion: "What is the most common misconception about this topic that leads to incorrect analysis?",
      checkAnswer: "The most common error is assuming linear relationships where the underlying physics is nonlinear. Most natural phenomena involve power laws, exponential decay, or threshold effects that linear models cannot capture. Always plot your data before fitting a model — visual inspection reveals nonlinearity that summary statistics hide.",
      codeIntro: "Implement the core algorithm and visualize the results.",
      code: `import numpy as np

# --- Spatial interpolation — IDW for mapping between sample points ---
print("=== Spatial Interpolation: IDW ===\
")

np.random.seed(42)

# Weather stations in NE India with temperature readings (degrees C)
stations = {
    "Guwahati":  (91.74, 26.14, 28.5),
    "Shillong":  (91.88, 25.57, 18.2),
    "Dibrugarh": (94.91, 27.47, 26.8),
    "Tezpur":    (92.80, 26.63, 27.1),
    "Imphal":    (93.95, 24.82, 22.4),
    "Kohima":    (94.11, 25.67, 19.8),
}

print("Weather stations (known temperature readings):")
for name, (lon, lat, temp) in stations.items():
    print(f"  {name:<12s}: ({lat:.2f}N, {lon:.2f}E) = {temp:.1f} C")

def idw_interpolate(query_lon, query_lat, stations, power=2):
    """Inverse Distance Weighting interpolation."""
    numerator = 0.0
    denominator = 0.0
    for name, (lon, lat, val) in stations.items():
        dist = np.sqrt((query_lon - lon)**2 + (query_lat - lat)**2)
        if dist < 1e-10:  # exactly on a station
            return val, name
        weight = 1.0 / dist**power
        numerator += weight * val
        denominator += weight
    return numerator / denominator, None

# Interpolate at unknown locations
query_points = [
    ("Kaziranga", 93.17, 26.58),
    ("Jorhat", 94.22, 26.76),
    ("Nagaon", 92.72, 26.34),
    ("Silchar", 92.78, 24.83),
    ("Morigaon", 92.34, 26.25),
]

print(f"\
IDW Interpolation (power=2) at unknown locations:")
print(f"{'Location':<12s} {'Lat':>6s} {'Lon':>6s} {'Est Temp':>9s}")
print("-" * 37)
for name, lon, lat in query_points:
    est_temp, exact = idw_interpolate(lon, lat, stations, power=2)
    suffix = " (exact)" if exact else ""
    print(f"{name:<12s} {lat:>6.2f} {lon:>6.2f} {est_temp:>8.1f} C{suffix}")

# Show effect of power parameter
print("\
Effect of IDW power parameter at Kaziranga:")
print("(Higher power = nearer stations dominate more)")
qlon, qlat = 93.17, 26.58
for p in [0.5, 1, 2, 3, 5]:
    est, _ = idw_interpolate(qlon, qlat, stations, power=p)
    print(f"  power={p:.1f}: {est:.1f} C")

# Cross-validation: leave one station out, predict it
print("\
Leave-one-out cross-validation:")
errors = []
for left_out in stations:
    remaining = {k: v for k, v in stations.items() if k != left_out}
    lon, lat, true_temp = stations[left_out]
    pred, _ = idw_interpolate(lon, lat, remaining, power=2)
    err = abs(pred - true_temp)
    errors.append(err)
    print(f"  Left out {left_out:<12s}: true={true_temp:.1f}, predicted={pred:.1f}, error={err:.1f} C")

print(f"\
Mean absolute error: {np.mean(errors):.2f} C")
print(f"Max error: {max(errors):.2f} C")
print(f"\
Key insight: IDW assumes closer stations are more informative.")
print(f"Shillong (1700m elevation) has very different temperatures from")
print(f"nearby lowland stations, causing large errors. A better model")
print(f"would include elevation as a predictor variable.")`,
      challenge: "Combine the models from all six lessons into a unified analysis pipeline. Run it on a new dataset and generate a comprehensive summary report.",
      successHint: "You have built a complete analytical framework for this domain — from raw data to validated predictions.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (geography and coordinate systems)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for cartography and GIS analysis. Click to start.</p>
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
            diagram={[LatLongGridDiagram, ContourMapDiagram, MapProjectionDiagram, CoordinatePlaneDiagram, LinearGraphDiagram, NEIndiaBiomesDiagram][i] ? createElement([LatLongGridDiagram, ContourMapDiagram, MapProjectionDiagram, CoordinatePlaneDiagram, LinearGraphDiagram, NEIndiaBiomesDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
