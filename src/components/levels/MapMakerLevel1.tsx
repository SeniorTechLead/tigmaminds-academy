import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import MapCoordinatesDiagram from '../diagrams/MapCoordinatesDiagram';
import MapScaleDiagram from '../diagrams/MapScaleDiagram';
import MapContourDiagram from '../diagrams/MapContourDiagram';
import MapProjectionTypeDiagram from '../diagrams/MapProjectionTypeDiagram';
import MapGPSDiagram from '../diagrams/MapGPSDiagram';
import MapGISDiagram from '../diagrams/MapGISDiagram';

export default function MapMakerLevel1() {
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
      title: 'Why maps matter — the power of seeing from above',
      concept: `The map maker's granddaughter grew up in the Khasi Hills of Meghalaya, where every valley is a world of its own. Her grandmother had mapped these hills by walking every trail, measuring with rope and compass, recording in hand-drawn notebooks. Those maps saved lives during floods, guided road builders, and settled land disputes.

**Maps matter because humans are visual thinkers.** A table of coordinates means nothing to most people. But plot those coordinates on a map and suddenly patterns emerge: the hospital is too far from the eastern villages. The river floods this area every monsoon. The new road would destroy that forest.

Maps are power because they shape decisions:
- **Governance**: who controls which territory? Tax maps, election maps, zoning maps.
- **Emergency**: where are people trapped? Flood maps, earthquake damage maps, evacuation routes.
- **Development**: where should we build the school? Population maps, distance maps, terrain maps.
- **Justice**: which communities lack clean water? Environmental justice mapping.

The granddaughter learned: "A map is not just a picture of the land. It's an argument about the land. It says 'look here, this matters.' And what a map leaves out matters just as much as what it includes."`,
      analogy: 'A map is like a spotlight on a dark stage. The spotlight (the map) chooses what the audience (the viewer) sees. A spotlight on the hero tells one story; the same spotlight on the villain tells another. The stage (the land) is the same — but the map maker decides what to illuminate. This is why maps are powerful: they control attention.',
      storyConnection: 'The granddaughter\'s first map was of her school compound — buildings, trees, paths, and the well. She showed it to her grandmother. "Good start," said the old woman. "But you forgot the most important thing." "What?" "The mud pit behind the kitchen that everyone falls into during monsoon. If it\'s not on the map, no one will fix it." The lesson: a map that hides problems protects problems.',
      checkQuestion: 'During the 2019 Assam floods, volunteer mappers used OpenStreetMap to map thousands of buildings in flood-prone areas. Why was this useful even though satellite photos existed?',
      checkAnswer: 'Satellite photos show what\'s there but don\'t classify it. A photo shows a building — but is it a school, a hospital, or a house? How many people live there? Is it one storey or three? Mapped data is structured: every building has attributes (type, capacity, height). Rescue teams need structured data: "find all schools within the flood zone to use as shelters" is a query you can run on a map database but not on a photograph.',
      codeIntro: 'Create a simple map of a village and demonstrate how different map themes tell different stories.',
      code: `import numpy as np

np.random.seed(42)

# Create a simple village map with multiple themes

print("Same village, four different stories:")
print(f"  1. Basic: shows WHAT is where")
print(f"  2. Population: shows WHERE people cluster ({sum(house_pop)} total)")
print(f"  3. Hospital access: {np.sum(dist_to_hospital[::10, ::10] > 4)} grid cells >4km from hospital")
print(f"  4. Flood risk: {np.sum(at_risk)} houses ({np.sum(at_risk)/n_houses*100:.0f}%) at flood risk")
print()
print("Each map tells a different truth about the same place.")
print("A decision-maker who only sees Map 1 might miss the flood danger.")
print("A decision-maker who only sees Map 4 might not know where the hospital is.")
print("Good decisions require multiple maps — multiple perspectives.")`,
      challenge: 'Create a fifth map theme: "Distance to clean water." Calculate the minimum distance from each house to the nearest well. Which houses are most underserved? This is exactly how governments plan new water infrastructure.',
      successHint: 'Maps are arguments made visual. Understanding why maps matter — and what they hide — is the first step in spatial literacy. Every important decision about land, resources, and people starts with a map.',
    },
    {
      title: 'Compass and direction — finding north in the hills',
      concept: `Before GPS, before satellite imagery, there was the compass. The map maker's granddaughter learned to navigate the Khasi Hills with a magnetic compass and a trained eye.

A **magnetic compass** works because Earth has a magnetic field generated by convection currents in its liquid iron outer core. A magnetized needle aligns with this field, pointing roughly toward the North Magnetic Pole.

Key concepts:
- **Magnetic north** vs **true north**: the North Magnetic Pole is not at the geographic North Pole. It's currently near Ellesmere Island, Canada, and it moves ~55 km/year.
- **Magnetic declination**: the angle between magnetic north and true north. In NE India, declination is approximately 0° to -1° (magnetic north is slightly west of true north). In other places, it can be 20°+.
- **Bearing**: the clockwise angle from north to your target. Due east = 090°, due south = 180°, due west = 270°.
- **Back bearing**: the reverse direction = bearing ± 180°. Used to verify your position.

In the Khasi Hills, the granddaughter learned to take bearings on prominent peaks and calculate her position by **triangulation**: take bearings to two known points, draw those lines on the map, and your position is where the lines cross.`,
      analogy: 'A compass is like a dog\'s nose — it always points to the same thing (north). No matter how you turn, how lost you are, or what time it is, the compass finds north. From north, you can find everything else: east is 90° clockwise, south is 180°, west is 270°. One fixed reference point is all you need to orient yourself in any direction.',
      storyConnection: 'The grandmother taught her granddaughter to take bearings in the morning fog, when the hills of Meghalaya are invisible. "Point the compass at the sound of the waterfall. Read the bearing. Now point it at the temple bell. Read that bearing. You don\'t need to see to know where you are — you just need two angles and a map." She was teaching magnetic triangulation, a method used by navigators for a thousand years.',
      checkQuestion: 'If your compass bearing to a mountaintop is 045° (northeast) and the map says the mountain should be at bearing 047° from your assumed position, what does the 2° difference mean?',
      checkAnswer: 'It could mean several things: 1) Magnetic declination — if the map uses true north and you\'re reading magnetic north, the 2° difference IS the declination. 2) Measurement error — handheld compass readings are accurate to about ±2°, so this is within normal error. 3) You\'re slightly mislocated — even a small position error can change a bearing by 1-2°. In practice, a 2° bearing error is excellent for field navigation. At 1 km distance, 2° translates to ~35m of position uncertainty.',
      codeIntro: 'Simulate compass navigation and triangulation to find position from two bearings.',
      code: `import numpy as np

# Compass navigation and triangulation

print("Triangulation navigation:")
print(f"  Bearing to Peak A: {bearing_A:.1f}°")
print(f"  Bearing to Peak B: {bearing_B:.1f}°")
print(f"  True position: ({true_pos[0]}, {true_pos[1]})")
print()
print("Steps:")
print("  1. Take compass bearing to Peak A → draw line FROM Peak A at back-bearing")
print("  2. Take compass bearing to Peak B → draw line FROM Peak B at back-bearing")
print("  3. Where the two lines cross = your position")
print("  4. A third bearing confirms (and reveals any errors)")`,
      challenge: 'Add a compass error of ±3° to both bearings (random). How far from the true position is the intersection now? Repeat 100 times and plot the distribution of position errors. This shows why a third bearing (and averaging) matters.',
      successHint: 'Compass navigation is the foundation of all modern positioning systems. GPS is just automated triangulation — instead of bearings to peaks, it uses time-of-flight to satellites. The math is the same: multiple measurements, intersecting lines, finding position.',
    },
    {
      title: 'Measuring distance — pacing, chains, and trigonometry',
      concept: `The granddaughter needed to measure the distance between two points on a hillside. Her grandmother taught her three methods:

1. **Pacing**: walk the distance, counting steps. Each pace ≈ 0.7-0.8m (calibrate yours by walking a known 100m). Quick but inaccurate (±5% on flat ground, worse on slopes).

2. **Chain/tape**: a measuring tape or chain gives direct distance. Accurate (±0.1%) but impractical over rough terrain or long distances.

3. **Triangulation (stadia)**: use angles and trigonometry. If you know the baseline distance (b) and measure the angle (θ) to a distant point from both ends of the baseline: **distance = b / (2 × tan(θ/2))**. Or with a surveyor's level: distance = stadia interval × 100.

For slopes, you must correct for the angle: **horizontal distance = measured distance × cos(slope angle)**. Walking 100m up a 30° slope covers only 100 × cos(30°) = 86.6m of horizontal distance.

Modern methods: GPS (±2-5m for consumer, ±1cm for survey-grade), laser rangefinders (±1mm to ±1m), and satellite imagery (resolution-limited).

The granddaughter's grandmother measured the entire Khasi Hills with nothing but a chain, a compass, and a clinometer (slope measurer). It took decades. Modern surveyors can do the same work in days with GPS and drones. But the mathematics is identical.`,
      analogy: 'Measuring distance on hilly terrain is like measuring the length of a crumpled piece of paper. If you measure along the crumples (surface distance), you get a longer number than the straight flat distance (horizontal distance). A map shows the flat distance, not the crumpled distance. Every slope measurement must be "flattened" using trigonometry before it goes on the map.',
      storyConnection: 'The granddaughter asked, "Grandmother, how far is it to the waterfall?" "By crow? Two kilometres. By path? Five." The crow-flies distance (straight line, horizontal) is the map distance. The path distance accounts for every turn and every slope. Both are "correct" — they answer different questions. The map shows the crow; the hiker feels the path.',
      checkQuestion: 'Your GPS says a hiking trail is 10 km. But after walking it, your fitness tracker says 12 km. Which is correct?',
      checkAnswer: 'Both, for different definitions of "distance." The GPS calculated the horizontal distance between waypoints (map distance). Your fitness tracker counted steps and multiplied by step length — measuring the actual ground distance including ups and downs. On hilly terrain, ground distance is always longer than horizontal distance. For a trail with average slope of 15°, the ratio is 1/cos(15°) ≈ 1.04 — about 4% longer. Your 20% difference suggests very hilly terrain OR the tracker accumulated small GPS errors (which happens).',
      codeIntro: 'Demonstrate distance measurement methods and the slope correction.',
      code: `import numpy as np

# Distance measurement and slope correction

print("Distance measurement comparison (true = 500m):")
print(f"{'Method':<20} {'Mean':>8} {'Std':>8} {'Error':>8}")
for name, params in methods.items():
    measurements = true_distance + np.random.normal(params['bias'], params['std'], 1000)
    print(f"{name:<20} {np.mean(measurements):>8.1f} {np.std(measurements):>8.1f} {abs(np.mean(measurements)-true_distance)/true_distance*100:>7.2f}%")

print()
print("Slope correction examples:")
for angle in [5, 15, 30, 45]:
    correction = np.cos(np.radians(angle))
    print(f"  {angle}° slope: ground distance 100m → horizontal {100*correction:.1f}m ({(1-correction)*100:.1f}% shorter)")`,
      challenge: 'The granddaughter paces a hillside trail and counts 714 paces (her pace = 0.72m). Her clinometer reads an average 20° slope. What is the horizontal distance? Calculate: 714 × 0.72 × cos(20°). How different is this from the uncorrected distance?',
      successHint: 'Distance measurement — from pacing to GPS — is the foundation of all mapping. The trigonometric slope correction is the same math used in surveying, civil engineering, and even in how your phone calculates distances from accelerometer data.',
    },
    {
      title: 'Contour lines — seeing hills on flat paper',
      concept: `The granddaughter\'s most important lesson: reading and drawing **contour lines** — the curved lines on a topographic map that represent elevation.

A contour line connects all points at the same elevation. If you walked along a contour line, you would never go uphill or downhill — it\'s a perfectly level path around the hillside.

Rules of contour lines:
- **They never cross** (a point can't be at two elevations simultaneously)
- **They always close** (every contour eventually forms a loop, though the closure might be off the map)
- **Spacing indicates steepness**: close together = steep, far apart = gentle
- **V-shapes**: Vs pointing uphill = valley/stream. Vs pointing downhill = ridge/spur.
- **Concentric rings**: hilltop (or depression — check the numbers to know which)

Drawing contour lines from spot heights:
1. Plot all measured elevations on the map
2. For a given contour value (e.g., 500m), find all points between adjacent measurements where 500m would fall
3. Use linear interpolation: if point A is 480m and point B is 520m, the 500m contour passes halfway between them
4. Connect interpolated points with a smooth curve

This is what the granddaughter did with her grandmother's elevation notebooks — converting thousands of point measurements into the flowing contour lines that make a topographic map readable.`,
      analogy: 'Contour lines are like the rings that form when you slowly lower a hillside into water. Each water level creates a ring (contour) at that elevation. Pull the hill out and mark where each ring was — you have contour lines. Where rings are close together, the hillside was steep. Where they\'re far apart, it was gentle.',
      storyConnection: 'The grandmother gave her granddaughter a notebook of 200 elevation points measured over 30 years of walking the hills. "Turn these numbers into contour lines," she said. "When you can see the hills in the lines, you\'re a map maker." The granddaughter spent weeks interpolating between points, drawing smooth curves, erasing and redrawing until the contour map matched the real terrain she could see from her window.',
      checkQuestion: 'On a topographic map, you see contour lines forming concentric circles. The values decrease from outside to inside: 500, 480, 460, 440. Is this a hilltop or a depression?',
      checkAnswer: 'A depression (hollow). In a hilltop, contour values increase toward the center. Here, they decrease — the center is the lowest point. On printed maps, depressions are marked with small tick marks (hachures) on the downhill side of the contour. Without hachures, you must check the elevation values carefully. This distinction matters enormously: a hilltop is a good place for a radio tower; a depression collects water and might flood.',
      codeIntro: 'Generate contour lines from scattered elevation measurements using interpolation.',
      code: `import numpy as np

np.random.seed(42)

# Generate realistic terrain with multiple features
grid_size = 100
x = np.linspace(0, 5, grid_size)  # km
y = np.linspace(0, 5, grid_size)
X, Y = np.meshgrid(x, y)

# Create terrain with hills, valley, and ridge
terrain = (200 + 150 * np.exp(-((X-1.5)**2 + (Y-3)**2) / 0.8)  # Hill 1
          + 120 * np.exp(-((X-3.5)**2 + (Y-1.5)**2) / 0.6)  # Hill 2
          + 80 * np.exp(-((X-4)**2 + (Y-4)**2) / 0.5)  # Hill 3
          - 60 * np.exp(-((X-2.5)**2) / 0.3)  # Valley
          + 10 * np.random.rand(grid_size, grid_size))  # noise


print("Contour map statistics:")
print(f"  Elevation range: {terrain.min():.0f}m to {terrain.max():.0f}m")
print(f"  Contour interval: {contour_interval}m")
print(f"  Number of contour lines: {len(levels)}")
print()
print("Reading the map:")
print("  Dense contours (NW area) → steep hillside")
print("  Sparse contours (center) → gentle valley")
print("  Concentric circles → hilltops (three visible)")
print("  V-shapes pointing east → valley draining eastward")`,
      challenge: 'Change the contour_interval from 20 to 10, then to 50. At 10m, the map becomes cluttered. At 50m, you lose detail. Find the optimal interval where the map is readable AND shows terrain features clearly. Professional cartographers call this "cartographic generalization."',
      successHint: 'Contour lines are the language of topography. Learning to read them transforms a flat piece of paper into a 3D landscape in your mind. This spatial visualization skill is essential in geology, civil engineering, hiking, and military planning.',
    },
    {
      title: 'Reading topographic maps — putting it all together',
      concept: `The granddaughter can now read every symbol on a topographic map. But reading individual symbols isn\'t the same as reading the landscape. True map reading means synthesizing information: seeing the hills, the valleys, the rivers, and understanding how they connect.

A **topographic map reading** checklist:
1. **Orientation**: align the map to north. The top is always north (unless otherwise indicated).
2. **Scale**: check the scale bar. 1:25,000 means 4cm = 1km.
3. **Contours**: read the elevation. Identify hills, valleys, ridges, saddles (low points between hills).
4. **Water features**: rivers flow from high to low. Follow contour V-shapes to find streams.
5. **Slope**: estimate steepness from contour spacing. Contour interval ÷ horizontal distance = gradient.
6. **Aspect**: which direction does the slope face? (Important for agriculture, solar energy, vegetation.)
7. **Route planning**: find the path of least effort (avoid steep contours, follow ridges or valleys).

A **saddle** (col) is the low point between two peaks — contour lines on both sides create an hourglass shape. Saddles are important for route planning: they're the easiest place to cross a ridge.

A **spur** is a ridge extending from a hilltop. Contour V-shapes point downhill on a spur. A **valley** is the opposite: contour V-shapes point uphill, and water collects at the bottom.`,
      analogy: 'Reading a topographic map is like reading sheet music. Individual notes (symbols) are easy. But reading the whole piece — hearing the melody, the harmony, the rhythm — requires practice. You need to "hear" the landscape from the contour lines: the crescendo of a rising ridge, the diminuendo of a descending valley, the pause of a saddle between peaks.',
      storyConnection: 'The grandmother tested her granddaughter with a challenge: "Without visiting the field, tell me the best route from the village (valley floor) to the radio tower (hilltop 500m higher). Use only the map." The granddaughter traced a path that followed a spur (ridge) rather than climbing directly — longer but gentler. Her grandmother smiled. "You can read the land now."',
      checkQuestion: 'You need to build a road from village A (200m elevation) to village B (200m elevation), but a 500m ridge lies between them. Looking at the topographic map, how do you find the best route?',
      checkAnswer: 'Find the lowest saddle (col) in the ridge between A and B. The saddle is where contour lines form an hourglass between two peaks — it\'s the lowest point you need to cross. Then route the road from A along a valley to reach the base of the saddle, cross at the saddle, and descend another valley to B. The road should follow contour lines as much as possible (maintaining constant elevation), using gentle switchbacks where it must gain or lose height. Maximum gradient for a road: typically 8-10%.',
      codeIntro: 'Build an interactive terrain reading exercise: identify features from contour patterns.',
      code: `import numpy as np

np.random.seed(42)

# Generate terrain with specific features to identify
grid_size = 150
x = np.linspace(0, 6, grid_size)
y = np.linspace(0, 6, grid_size)
X, Y = np.meshgrid(x, y)

# Feature-rich terrain
terrain = (300
          + 200 * np.exp(-((X-1.5)**2 + (Y-4.5)**2) / 0.4)  # Peak 1
          + 180 * np.exp(-((X-4)**2 + (Y-4)**2) / 0.5)  # Peak 2
          + 80 * np.exp(-((X-2.8)**2 + (Y-4.2)**2) / 0.15)  # Saddle between peaks
          - 100 * np.exp(-((Y-1.5)**2) / 0.8)  # Valley
          + 60 * np.exp(-((X-5)**2 + (Y-1.5)**2) / 0.6)  # Small hill
          - 40 * np.exp(-((X-1)**2 + (Y-1)**2) / 0.3))  # Depression


print("Feature identification (answers):")
for label, (fx, fy, desc) in features.items():
    idx_y = int(fy/6*(grid_size-1))
    idx_x = int(fx/6*(grid_size-1))
    print(f"  {label}: {desc} — elevation {terrain[idx_y, idx_x]:.0f}m")

print(f"\\nRoute comparison (D→A):")
print(f"  Direct: {direct_dist[-1]:.0f}m, max gradient: {direct_gradient:.0f}%")
print(f"  Ridge:  {ridge_dist[-1]:.0f}m, max gradient: {ridge_gradient:.0f}%")
print(f"  Ridge is {ridge_dist[-1]/direct_dist[-1]:.1f}× longer but {direct_gradient/ridge_gradient:.1f}× gentler")`,
      challenge: 'Find the route from D to B that passes through the saddle at C. This is the classic "col route" — crossing a ridge at its lowest point. Calculate the total elevation gain (going up) and elevation loss (going down) separately. Hikers care about both.',
      successHint: 'Topographic map reading is a skill that combines geography, geometry, and spatial reasoning. Once mastered, you can "see" a 3D landscape from a flat page — one of the most powerful visualization abilities in science and engineering.',
    },
    {
      title: 'Making your own map — field survey to finished product',
      concept: `The granddaughter's final test: make a complete map of the school compound — from field measurements to finished product. This is the core workflow of cartography:

**Field survey** (data collection):
1. Establish a baseline: measure one straight line accurately (this is your reference)
2. From each end of the baseline, take compass bearings to every feature you want to map
3. Measure distances where possible (pacing, tape)
4. Record elevation changes with a clinometer
5. Take notes on everything: building types, vegetation, paths, water features

**Office work** (map production):
1. Plot the baseline to scale on your paper
2. Use triangulation to plot each feature from the baseline bearings
3. Draw features using standard symbols
4. Add contour lines from elevation data
5. Add title, scale bar, north arrow, legend, and date

**Essential map elements** (every map needs these):
- **Title**: what area is mapped, what theme
- **Scale bar**: graphic distance reference (survives photocopying/resizing)
- **North arrow**: orientation reference
- **Legend**: symbol key
- **Grid/coordinates**: location reference
- **Date**: when the data was collected (maps expire!)
- **Attribution**: who made it, data sources`,
      analogy: 'Making a map is like cooking a meal. The field survey is shopping for ingredients (collecting data). The office work is cooking (processing data into a map). The map elements (title, legend, scale) are the plating and presentation. A meal with great ingredients but bad presentation disappoints. A beautiful plate with bad ingredients is worse. Both the data and the cartography must be excellent.',
      storyConnection: 'The granddaughter spent three days surveying the school compound: one day measuring the baseline and taking bearings, one day measuring buildings and paths, one day recording vegetation and drainage. Then two days in the office: plotting, drawing, labelling. The finished map revealed something nobody had noticed from the ground: the school\'s drainage was designed to flow toward the playground, turning it into a swamp every monsoon. Her map got the drainage fixed.',
      checkQuestion: 'A beautifully drawn map from 1960 shows the area around your school. Can you trust it for planning a new building today?',
      checkAnswer: 'Partially. The terrain (contours, rivers) is probably still accurate — these change slowly. But buildings, roads, vegetation, and land use may have changed dramatically in 60+ years. Old buildings may be demolished, new ones built, roads rerouted, forests cleared, streams diverted. You can use the 1960 map as a starting point (especially for terrain) but must verify all human-made features with a current survey or satellite imagery. The date on a map is its "use by" label.',
      codeIntro: 'Simulate a complete field-to-map workflow: survey data to finished map.',
      code: `import numpy as np

np.random.seed(42)

# Simulate field survey of a school compound

print("Survey workflow completed:")
print(f"  Baseline: A({baseline_start[0]},{baseline_start[1]}) to B({baseline_end[0]},{baseline_end[1]})")
print(f"  Features surveyed: {len(features)}")
print()
print("Triangulated positions:")
for name, pos in positions.items():
    print(f"  {name}: ({pos[0]:.1f}, {pos[1]:.1f})m")
print()
print("Map elements included: title, north arrow, scale bar,")
print("surveyor credit, date, boundary, road, buildings, features.")
print()
print("This is the complete cartographic workflow:")
print("  Measure → Calculate → Draw → Label → Done.")`,
      challenge: 'The map is missing elevation data. If the well is at 100m, the gate at 102m, and the main building at 105m, draw a 101m contour line. Where would it pass? This is how topographic detail is added to plan views — using spot heights and interpolation.',
      successHint: 'You\'ve completed the full map-making workflow: from field measurements to finished product. This is the same workflow used by every surveyor, cartographer, and GIS professional — just with fancier tools. The granddaughter started with a compass and ended with a map that changed her school. That\'s the power of cartography.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Cartography & GIS — no prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for cartography simulations. Click to start.</p>
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
            diagram={[MapCoordinatesDiagram, MapScaleDiagram, MapContourDiagram, MapProjectionTypeDiagram, MapGPSDiagram, MapGISDiagram][i] ? createElement([MapCoordinatesDiagram, MapScaleDiagram, MapContourDiagram, MapProjectionTypeDiagram, MapGPSDiagram, MapGISDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}