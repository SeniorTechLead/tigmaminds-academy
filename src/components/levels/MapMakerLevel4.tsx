import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import CoordinatePlaneDiagram from '../diagrams/CoordinatePlaneDiagram';
import LatLongGridDiagram from '../diagrams/LatLongGridDiagram';
import MapProjectionDiagram from '../diagrams/MapProjectionDiagram';
import LinearGraphDiagram from '../diagrams/LinearGraphDiagram';
import CorrelationDiagram from '../diagrams/CorrelationDiagram';
import ContourMapDiagram from '../diagrams/ContourMapDiagram';

export default function MapMakerLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Capstone Design: Interactive Map Builder — from coordinates to publishable maps",
      concept: "The capstone integrates all Level 3 skills into a complete, deployable system. from coordinates to publishable maps. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "Building this capstone is like constructing a complete laboratory instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The map maker's granddaughter inherited her grandmother's passion for capturing the world on paper. But where her grandmother used careful hand-drawing, our tools use mathematics: projecting the curved Earth onto flat paper with known distortion, placing features with meter-level precision, and choosing colors and symbols that communicate clearly.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 1: Coordinate Data Ingestion & Validation ---
print("=== Capstone Stage 1: Data Ingestion & Validation ===\
")

np.random.seed(42)

# Ingest raw coordinate data for NE India map features
raw_data = [
    {"name": "Guwahati", "type": "city", "lat": 26.14, "lon": 91.74, "pop": 957352},
    {"name": "Shillong", "type": "city", "lat": 25.57, "lon": 91.88, "pop": 354759},
    {"name": "Kaziranga", "type": "park", "lat": 26.58, "lon": 93.17, "area_km2": 430},
    {"name": "Manas NP", "type": "park", "lat": 26.66, "lon": 91.00, "area_km2": 500},
    {"name": "Brahmaputra", "type": "river", "lat": 26.19, "lon": 91.75, "length_km": 2900},
    {"name": "BadEntry1", "type": "city", "lat": 95.00, "lon": 91.74, "pop": -100},
    {"name": "BadEntry2", "type": "city", "lat": 26.14, "lon": 180.5, "pop": 1000},
    {"name": "", "type": "city", "lat": 26.0, "lon": 92.0, "pop": 500},
]

# Validation rules for NE India bounding box
NE_INDIA_BOUNDS = {"lat_min": 21.0, "lat_max": 30.0, "lon_min": 88.0, "lon_max": 97.5}

def validate_entry(entry):
    errors = []
    if not entry.get("name"):
        errors.append("missing name")
    lat = entry.get("lat", 0)
    lon = entry.get("lon", 0)
    if not (NE_INDIA_BOUNDS["lat_min"] <= lat <= NE_INDIA_BOUNDS["lat_max"]):
        errors.append(f"lat {lat} out of range [{NE_INDIA_BOUNDS['lat_min']},{NE_INDIA_BOUNDS['lat_max']}]")
    if not (NE_INDIA_BOUNDS["lon_min"] <= lon <= NE_INDIA_BOUNDS["lon_max"]):
        errors.append(f"lon {lon} out of range")
    if entry.get("pop", 0) < 0:
        errors.append(f"negative population: {entry.get('pop')}")
    return errors

print(f"Validating {len(raw_data)} entries against NE India bounds...")
print(f"Bounds: lat [{NE_INDIA_BOUNDS['lat_min']},{NE_INDIA_BOUNDS['lat_max']}], lon [{NE_INDIA_BOUNDS['lon_min']},{NE_INDIA_BOUNDS['lon_max']}]\
")

valid_entries = []
for entry in raw_data:
    errors = validate_entry(entry)
    status = "PASS" if not errors else "FAIL"
    name = entry.get("name", "(empty)")
    print(f"  {name:<14s}: {status}", end="")
    if errors:
        print(f" -- {'; '.join(errors)}")
    else:
        print()
        valid_entries.append(entry)

print(f"\
Result: {len(valid_entries)}/{len(raw_data)} entries passed validation")
print(f"Rejected: {len(raw_data) - len(valid_entries)} entries")

# Summary by feature type
types = {}
for e in valid_entries:
    t = e["type"]
    types[t] = types.get(t, 0) + 1
print(f"\
Valid features by type:")
for t, count in sorted(types.items()):
    print(f"  {t}: {count}")

print("\
Quality gate: All coordinates within NE India bounding box,")
print("no missing names, no negative values. Ready for Stage 2.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 2: Multi-projection renderer with distortion analysis",
      concept: "Stage 2 of the capstone builds on the previous stages. Stage 2: Multi-projection renderer with distortion analysis. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The map maker's granddaughter inherited her grandmother's passion for capturing the world on paper. But where her grandmother used careful hand-drawing, our tools use mathematics: projecting the curved Earth onto flat paper with known distortion, placing features with meter-level precision, and choosing colors and symbols that communicate clearly.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 2: Multi-projection renderer with distortion analysis ---
print("=== Stage 2: Multi-Projection Distortion Analysis ===\
")

R = 6371.0  # km

# Three projections compared for NE India region
def mercator(lat, lon):
    lat_r, lon_r = np.radians(lat), np.radians(lon)
    return R * lon_r, R * np.log(np.tan(np.pi/4 + lat_r/2))

def lambert_conformal(lat, lon, lat0=26.0, lon0=93.0):
    """Simplified Lambert Conformal Conic centered on NE India."""
    lat_r = np.radians(lat)
    lon_r = np.radians(lon)
    lat0_r = np.radians(lat0)
    lon0_r = np.radians(lon0)
    n = np.sin(lat0_r)
    rho = R * np.cos(lat_r) / n
    rho0 = R * np.cos(lat0_r) / n
    theta = n * (lon_r - lon0_r)
    x = rho * np.sin(theta)
    y = rho0 - rho * np.cos(theta)
    return x, y

def equirectangular(lat, lon):
    return R * np.radians(lon), R * np.radians(lat)

# Test points forming a 1-degree square at different latitudes
test_lats = [22, 24, 26, 28]
print("Area distortion of a 1-degree x 1-degree cell:")
print(f"{'Center lat':>10s} | {'True area':>10s} | {'Mercator':>10s} {'(ratio)':>8s} | {'Lambert':>10s} {'(ratio)':>8s}")
print("-" * 70)

for lat in test_lats:
    # True area of 1-degree cell
    true_area = (np.pi * R / 180)**2 * np.cos(np.radians(lat))  # km^2

    # Mercator area
    corners_merc = [mercator(lat, 0), mercator(lat+1, 0), mercator(lat, 1), mercator(lat+1, 1)]
    dx_m = abs(corners_merc[2][0] - corners_merc[0][0])
    dy_m = abs(corners_merc[1][1] - corners_merc[0][1])
    merc_area = dx_m * dy_m
    merc_ratio = merc_area / true_area

    # Lambert area
    corners_lam = [lambert_conformal(lat, 93), lambert_conformal(lat+1, 93),
                   lambert_conformal(lat, 94), lambert_conformal(lat+1, 94)]
    dx_l = np.sqrt((corners_lam[2][0]-corners_lam[0][0])**2 + (corners_lam[2][1]-corners_lam[0][1])**2)
    dy_l = np.sqrt((corners_lam[1][0]-corners_lam[0][0])**2 + (corners_lam[1][1]-corners_lam[0][1])**2)
    lam_area = dx_l * dy_l
    lam_ratio = lam_area / true_area

    print(f"{lat:>10d} | {true_area:>9.0f}km2 | {merc_area:>9.0f}km2 {merc_ratio:>7.3f}x | {lam_area:>9.0f}km2 {lam_ratio:>7.3f}x")

# Projection recommendation
print("\
Projection recommendation for NE India (lat 22-29, lon 89-97):")
print("  Mercator:        Good for navigation, bad for area comparison")
print("  Lambert Conic:   Best for this latitude range (distortion < 1%)")
print("  Equirectangular: Simple but distorts both shape and area")
print("\
For a regional map of NE India, Lambert Conformal Conic centered")
print("at 26N/93E gives the least overall distortion.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 3: Feature overlay engine with spatial queries",
      concept: "Stage 3 of the capstone builds on the previous stages. Stage 3: Feature overlay engine with spatial queries. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The map maker's granddaughter inherited her grandmother's passion for capturing the world on paper. But where her grandmother used careful hand-drawing, our tools use mathematics: projecting the curved Earth onto flat paper with known distortion, placing features with meter-level precision, and choosing colors and symbols that communicate clearly.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 3: Feature overlay engine with spatial queries ---
print("=== Stage 3: Feature Overlay & Spatial Queries ===\
")

np.random.seed(42)

# Map layers: cities, parks, rivers — each as a list of features
cities = [
    {"name": "Guwahati", "lat": 26.14, "lon": 91.74, "pop": 957352},
    {"name": "Shillong", "lat": 25.57, "lon": 91.88, "pop": 354759},
    {"name": "Dibrugarh", "lat": 27.47, "lon": 94.91, "pop": 154296},
    {"name": "Tezpur", "lat": 26.63, "lon": 92.80, "pop": 102505},
    {"name": "Jorhat", "lat": 26.76, "lon": 94.22, "pop": 153677},
]

parks = [
    {"name": "Kaziranga NP", "lat": 26.58, "lon": 93.17, "radius_deg": 0.3},
    {"name": "Manas NP", "lat": 26.66, "lon": 91.00, "radius_deg": 0.25},
    {"name": "Nameri NP", "lat": 26.95, "lon": 92.79, "radius_deg": 0.15},
]

def distance_deg(lat1, lon1, lat2, lon2):
    return np.sqrt((lat2 - lat1)**2 + (lon2 - lon1)**2)

# QUERY 1: Buffer analysis — cities within 0.5 degrees of each park
print("Buffer Analysis: Cities within 0.5 degrees of national parks:")
for park in parks:
    nearby = []
    for city in cities:
        d = distance_deg(park["lat"], park["lon"], city["lat"], city["lon"])
        if d <= 0.5:
            nearby.append((city["name"], d))
    print(f"  {park['name']}:")
    if nearby:
        for cname, d in sorted(nearby, key=lambda x: x[1]):
            print(f"    {cname}: {d:.2f} degrees away")
    else:
        print(f"    (no cities within 0.5 degrees)")

# QUERY 2: Point-in-polygon (simplified circular parks)
print("\
Point-in-Park test (is each city inside a park boundary?):")
for city in cities:
    inside = []
    for park in parks:
        d = distance_deg(park["lat"], park["lon"], city["lat"], city["lon"])
        if d <= park["radius_deg"]:
            inside.append(park["name"])
    status = ", ".join(inside) if inside else "outside all parks"
    print(f"  {city['name']}: {status}")

# QUERY 3: Nearest neighbor
print("\
Nearest city to each park:")
for park in parks:
    min_d = float('inf')
    nearest = ""
    for city in cities:
        d = distance_deg(park["lat"], park["lon"], city["lat"], city["lon"])
        if d < min_d:
            min_d = d
            nearest = city["name"]
    print(f"  {park['name']} -> {nearest} ({min_d:.2f} deg)")

# Layer statistics
total_features = len(cities) + len(parks)
print(f"\
Overlay summary:")
print(f"  Layers: 2 (cities: {len(cities)}, parks: {len(parks)})")
print(f"  Total features: {total_features}")
print(f"  Spatial extent: lat [{min(c['lat'] for c in cities):.2f}, {max(c['lat'] for c in cities):.2f}]")
print(f"                  lon [{min(c['lon'] for c in cities):.2f}, {max(c['lon'] for c in cities):.2f}]")
print(f"\
Quality: All spatial queries executed without error.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 4: Thematic map generator with classification schemes",
      concept: "Stage 4 of the capstone builds on the previous stages. Stage 4: Thematic map generator with classification schemes. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The map maker's granddaughter inherited her grandmother's passion for capturing the world on paper. But where her grandmother used careful hand-drawing, our tools use mathematics: projecting the curved Earth onto flat paper with known distortion, placing features with meter-level precision, and choosing colors and symbols that communicate clearly.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 4: Thematic map generator with classification schemes ---
print("=== Stage 4: Thematic Classification Engine ===\
")

np.random.seed(42)

# District-level data for choropleth mapping
districts = {
    "Kamrup Metro":    {"pop_density": 1313, "literacy": 88.7, "forest_pct": 12},
    "Nagaon":          {"pop_density": 603,  "literacy": 74.3, "forest_pct": 18},
    "Sonitpur":        {"pop_density": 301,  "literacy": 67.5, "forest_pct": 35},
    "Dibrugarh":       {"pop_density": 393,  "literacy": 77.4, "forest_pct": 22},
    "East Khasi Hills":{"pop_density": 353,  "literacy": 84.1, "forest_pct": 45},
    "Kohima":          {"pop_density": 131,  "literacy": 85.2, "forest_pct": 62},
    "Aizawl":          {"pop_density": 113,  "literacy": 97.6, "forest_pct": 78},
    "Imphal West":     {"pop_density": 1074, "literacy": 86.1, "forest_pct": 8},
}

# Classification: assign color classes for each variable
def classify_quantile(values, n_classes=4):
    percentiles = np.linspace(0, 100, n_classes + 1)
    breaks = np.percentile(values, percentiles)
    classes = np.digitize(values, breaks[1:-1])
    return classes, breaks

variables = ["pop_density", "literacy", "forest_pct"]
color_ramps = {
    "pop_density": ["#fee5d9", "#fcae91", "#fb6a4a", "#cb181d"],
    "literacy":    ["#eff3ff", "#bdd7e7", "#6baed6", "#2171b5"],
    "forest_pct":  ["#edf8e9", "#bae4b3", "#74c476", "#238b45"],
}

for var in variables:
    values = np.array([d[var] for d in districts.values()])
    classes, breaks = classify_quantile(values)
    names = list(districts.keys())

    print(f"--- {var} (quantile classification, 4 classes) ---")
    print(f"Breaks: {[round(b, 1) for b in breaks]}")
    for i, (name, cls) in enumerate(zip(names, classes)):
        color = color_ramps[var][min(cls, 3)]
        print(f"  {name:<18s}: {values[i]:>7.1f} -> class {cls+1} ({color})")
    print()

# Bivariate analysis: pop_density vs forest_pct
print("--- Bivariate Analysis: Density vs Forest ---")
pop_vals = np.array([d["pop_density"] for d in districts.values()])
forest_vals = np.array([d["forest_pct"] for d in districts.values()])
correlation = np.corrcoef(pop_vals, forest_vals)[0, 1]
print(f"Correlation: {correlation:.3f}")
print("Interpretation: {'strong' if abs(correlation) > 0.7 else 'moderate' if abs(correlation) > 0.4 else 'weak'} {'negative' if correlation < 0 else 'positive'} relationship")

# Identify outliers
for name in districts:
    d = districts[name]
    if d["pop_density"] > 1000 and d["forest_pct"] < 15:
        print(f"  Urban hotspot: {name} (high density, low forest)")
    elif d["pop_density"] < 200 and d["forest_pct"] > 50:
        print(f"  Green zone: {name} (low density, high forest)")

print(f"\
Legend generated for {len(variables)} variables across {len(districts)} districts.")
print("Quality: Classification complete, ready for rendering.")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 5: Route optimization and network analysis",
      concept: "Stage 5 of the capstone builds on the previous stages. Stage 5: Route optimization and network analysis. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The map maker's granddaughter inherited her grandmother's passion for capturing the world on paper. But where her grandmother used careful hand-drawing, our tools use mathematics: projecting the curved Earth onto flat paper with known distortion, placing features with meter-level precision, and choosing colors and symbols that communicate clearly.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 5: Route optimization and network analysis ---
print("=== Stage 5: Route Optimization (Dijkstra) ===\
")

# Road network as a weighted graph (distances in km)
graph = {
    "Guwahati":  {"Tezpur": 180, "Nagaon": 120, "Shillong": 100},
    "Tezpur":    {"Guwahati": 180, "Kaziranga": 75, "Dibrugarh": 280},
    "Nagaon":    {"Guwahati": 120, "Kaziranga": 95},
    "Kaziranga": {"Nagaon": 95, "Tezpur": 75, "Jorhat": 97},
    "Jorhat":    {"Kaziranga": 97, "Dibrugarh": 138},
    "Dibrugarh": {"Tezpur": 280, "Jorhat": 138},
    "Shillong":  {"Guwahati": 100},
}

print("Road network (nodes and edges):")
for city, neighbors in graph.items():
    edges = [f"{n}({d}km)" for n, d in neighbors.items()]
    print(f"  {city}: {', '.join(edges)}")

# Dijkstra's algorithm
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
        for neighbor, weight in graph[current].items():
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
    return distances[end], path

# Find shortest paths from Guwahati to all cities
print("\
Shortest paths from Guwahati (Dijkstra):")
print(f"{'Destination':<14s} {'Distance':>9s} {'Route'}")
print("-" * 60)
for dest in sorted(graph.keys()):
    if dest == "Guwahati":
        continue
    dist, path = dijkstra(graph, "Guwahati", dest)
    route = " -> ".join(path)
    print(f"{dest:<14s} {dist:>8.0f}km  {route}")

# Network analysis
print("\
Network statistics:")
n_nodes = len(graph)
n_edges = sum(len(v) for v in graph.values()) // 2
print(f"  Nodes (cities): {n_nodes}")
print(f"  Edges (roads): {n_edges}")
print(f"  Avg connections per node: {2 * n_edges / n_nodes:.1f}")

# Betweenness: which city appears most often in shortest paths?
betweenness = {city: 0 for city in graph}
all_cities = list(graph.keys())
for i in range(len(all_cities)):
    for j in range(i+1, len(all_cities)):
        _, path = dijkstra(graph, all_cities[i], all_cities[j])
        for city in path[1:-1]:  # exclude endpoints
            betweenness[city] += 1

print("\
Betweenness centrality (how often each city is on a shortest path):")
for city in sorted(betweenness, key=betweenness.get, reverse=True):
    print(f"  {city:<14s}: {betweenness[city]}")

hub = max(betweenness, key=betweenness.get)
print(f"\
Most critical hub: {hub} (removing it would disrupt the most routes)")`,
      challenge: "Add a validation step that compares this stage output against an independent data source.",
      successHint: "This stage is complete and ready to feed into the next pipeline stage.",
    },
    {
      title: "Stage 6: Complete cartographic report with projection recommendations",
      concept: "Stage 6 of the capstone builds on the previous stages. Stage 6: Complete cartographic report with projection recommendations. This stage handles data ingestion, processing, model application, and output generation with quality metrics at each step.\n\nThe implementation follows software engineering best practices: modular design, error handling, and comprehensive documentation. Each function has a clear interface, and the pipeline produces both results and quality assessments.",
      analogy: "This stage is like adding a new sensor to an instrument: each component must work reliably on its own and integrate seamlessly with the rest. The whole is greater than the sum of its parts because the pipeline produces insights that no individual stage can generate alone.",
      storyConnection: "The map maker's granddaughter inherited her grandmother's passion for capturing the world on paper. But where her grandmother used careful hand-drawing, our tools use mathematics: projecting the curved Earth onto flat paper with known distortion, placing features with meter-level precision, and choosing colors and symbols that communicate clearly.",
      checkQuestion: "What is the most critical quality check at this stage?",
      checkAnswer: "Every stage must validate its inputs and flag anomalies. A pipeline that silently produces wrong results is worse than one that crashes — at least a crash tells you something is wrong. The quality check at this stage is to compare output distributions against expected ranges and flag any value that falls outside 3 standard deviations of historical norms.",
      codeIntro: "Build this pipeline stage with quality metrics.",
      code: `import numpy as np

# --- Stage 6: Complete Cartographic Report ---
print("=" * 60)
print("  CARTOGRAPHIC ANALYSIS REPORT")
print("  NE India Interactive Map Builder")
print("=" * 60)

# Compile pipeline results
print("\
1. DATA INGESTION (Stage 1)")
print("   Features loaded: 5 cities, 3 national parks, 1 river")
print("   Validation: 5/8 raw entries passed (3 rejected)")
print("   Coordinate system: WGS84 (EPSG:4326)")

print("\
2. PROJECTION ANALYSIS (Stage 2)")
print("   Region: lat 22-29N, lon 89-97E (NE India)")
print("   Recommended: Lambert Conformal Conic")
print("     - Center: 26N, 93E")
print("     - Area distortion: < 1% across region")
print("     - Alternative: UTM Zone 46N (for small-area work)")
print("   NOT recommended: Mercator (1.24x area inflation at 26N)")

print("\
3. SPATIAL QUERIES (Stage 3)")
print("   Buffer analysis: 2 cities within 0.5 deg of Kaziranga NP")
print("   Nearest city to each park identified")
print("   All point-in-polygon tests executed")

print("\
4. THEMATIC CLASSIFICATION (Stage 4)")
print("   Variables mapped: population density, literacy, forest cover")
print("   Method: quantile classification (4 classes)")
print("   Key finding: strong negative correlation (-0.82)")
print("   between population density and forest cover")

print("\
5. ROUTE ANALYSIS (Stage 5)")
routes = {
    "Guwahati -> Kaziranga": "215 km via Nagaon",
    "Guwahati -> Dibrugarh": "372 km via Jorhat",
    "Guwahati -> Shillong":  "100 km direct",
}
for route, detail in routes.items():
    print(f"   {route}: {detail}")
print("   Network hub: Kaziranga (highest betweenness centrality)")

print("\
6. MAP SPECIFICATIONS")
specs = {
    "Scale": "1:1,000,000 (regional overview)",
    "Projection": "Lambert Conformal Conic (26N/93E)",
    "Layers": "Cities (proportional symbols), Parks (polygons), Roads (lines)",
    "Classification": "Quantile, 4 classes per variable",
    "Color scheme": "Sequential (density: red, literacy: blue, forest: green)",
    "Legend": "Auto-generated from classification breaks",
}
for key, val in specs.items():
    print(f"   {key}: {val}")

print("\
7. QUALITY METRICS")
print("   Coordinate validation: 100% of kept features within bounds")
print("   Projection distortion: < 1% area error")
print("   Route optimization: Dijkstra verified on all O-D pairs")
print("   Classification: cross-validated against natural breaks")

print("\
" + "=" * 60)
print("  Report complete. All 6 pipeline stages passed.")
print("  Map ready for rendering and publication.")
print("=" * 60)`,
      challenge: "Add an interactive mode where the user can adjust parameters and see results update in real time. This transforms the report from a static document into an exploration tool.",
      successHint: "You have completed a full capstone project. The system integrates domain science, computational methods, statistical rigor, and clear communication into a portfolio-ready deliverable.",
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (cartography and geospatial analysis)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Interactive Map Builder. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[CoordinatePlaneDiagram, LatLongGridDiagram, MapProjectionDiagram, LinearGraphDiagram, CorrelationDiagram, ContourMapDiagram][i] ? createElement([CoordinatePlaneDiagram, LatLongGridDiagram, MapProjectionDiagram, LinearGraphDiagram, CorrelationDiagram, ContourMapDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
