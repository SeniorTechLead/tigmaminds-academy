import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import MapDatumDiagram from '../diagrams/MapDatumDiagram';
import MapTopoProfileDiagram from '../diagrams/MapTopoProfileDiagram';
import MapSurveyDiagram from '../diagrams/MapSurveyDiagram';
import MapThematicDiagram from '../diagrams/MapThematicDiagram';
import MapDigitalElevationDiagram from '../diagrams/MapDigitalElevationDiagram';
import MapRemoteSensingDiagram from '../diagrams/MapRemoteSensingDiagram';
import ContourMapDiagram from '../diagrams/ContourMapDiagram';
import CoordinatePlaneDiagram from '../diagrams/CoordinatePlaneDiagram';
import CorrelationDiagram from '../diagrams/CorrelationDiagram';
import LatLongGridDiagram from '../diagrams/LatLongGridDiagram';
import LinearGraphDiagram from '../diagrams/LinearGraphDiagram';
import MapProjectionDiagram from '../diagrams/MapProjectionDiagram';

export default function MapMakerLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

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

np.random.seed(42)


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


print("Facility Location Results:")
for c in range(n_clinics):
    mask = village_assignment == c
    cx, cy = best_clinics[c]
    print(f"  Clinic {c+1} ({cx:.1f}, {cy:.1f}): {np.sum(mask)} villages, {village_pop[mask].sum():,} people, avg {village_dists[mask].mean():.1f}km")

underserved = np.sum(village_dists > 5)
print(f"\\\n  Villages >5km from any clinic: {underserved} ({underserved/n_villages*100:.0f}%)")`,
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
            diagram={[MapProjectionDiagram, CoordinatePlaneDiagram, LatLongGridDiagram, LinearGraphDiagram, CorrelationDiagram, ContourMapDiagram][i] ? createElement([MapProjectionDiagram, CoordinatePlaneDiagram, LatLongGridDiagram, LinearGraphDiagram, CorrelationDiagram, ContourMapDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}