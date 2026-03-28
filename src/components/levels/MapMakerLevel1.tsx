import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import LatLongGridDiagram from '../diagrams/LatLongGridDiagram';
import MapProjectionDiagram from '../diagrams/MapProjectionDiagram';
import ContourMapDiagram from '../diagrams/ContourMapDiagram';
import CoordinatePlaneDiagram from '../diagrams/CoordinatePlaneDiagram';
import LinearGraphDiagram from '../diagrams/LinearGraphDiagram';
import NEIndiaBiomesDiagram from '../diagrams/NEIndiaBiomesDiagram';

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
import matplotlib.pyplot as plt

np.random.seed(42)

# Create a simple village map with multiple themes
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Same Village, Four Different Maps', color='white', fontsize=14, y=0.98)

# Village features (shared data)
# Buildings
buildings = {
    'School': (3, 7, '#3b82f6', 's'),
    'Hospital': (8, 8, '#ef4444', 'P'),
    'Market': (5, 4, '#f59e0b', 'D'),
    'Temple': (7, 6, '#a855f7', '^'),
    'Well 1': (2, 5, '#06b6d4', 'o'),
    'Well 2': (6, 2, '#06b6d4', 'o'),
}

# Houses (random)
n_houses = 40
house_x = np.random.normal(5, 2, n_houses)
house_y = np.random.normal(5, 2.5, n_houses)
house_pop = np.random.randint(3, 12, n_houses)

# Road
road_x = [0, 3, 5, 7, 10]
road_y = [5, 5.5, 4, 5, 5.5]

# River
river_x = [0, 2, 4, 6, 8, 10]
river_y = [1, 0.8, 1.2, 0.5, 0.8, 0.3]

# 1. Basic map
ax = axes[0, 0]
ax.set_facecolor('#e8e0d4')
ax.plot(road_x, road_y, color='#8B7355', linewidth=3, label='Road')
ax.plot(river_x, river_y, color='#3b82f6', linewidth=3, label='River')
ax.scatter(house_x, house_y, c='#666', s=20, marker='s', label='Houses')
for name, (x, y, color, marker) in buildings.items():
    ax.scatter(x, y, c=color, s=100, marker=marker, zorder=5, edgecolors='white', linewidths=1)
    ax.annotate(name, (x, y), xytext=(5, 5), textcoords='offset points', color='black', fontsize=7)
ax.set_title('1. Basic Map', color='white', fontsize=11)
ax.legend(facecolor='white', fontsize=7, loc='lower right')
ax.set_xlim(0, 10); ax.set_ylim(0, 10)
ax.tick_params(colors='gray')

# 2. Population density map
ax = axes[0, 1]
ax.set_facecolor('#111827')
# Create density heatmap
from matplotlib.colors import LinearSegmentedColormap
density_cmap = LinearSegmentedColormap.from_list('pop', ['#111827', '#22c55e', '#f59e0b', '#ef4444'])
heatmap, xedges, yedges = np.histogram2d(house_x, house_y, bins=10, range=[[0,10],[0,10]], weights=house_pop)
ax.imshow(heatmap.T, origin='lower', extent=[0, 10, 0, 10], cmap=density_cmap, aspect='equal')
ax.set_title('2. Population Density', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 3. Distance to hospital map
ax = axes[1, 0]
ax.set_facecolor('#111827')
hosp_x, hosp_y = buildings['Hospital'][:2]
grid_x, grid_y = np.meshgrid(np.linspace(0, 10, 100), np.linspace(0, 10, 100))
dist_to_hospital = np.sqrt((grid_x - hosp_x)**2 + (grid_y - hosp_y)**2)
ax.imshow(dist_to_hospital, origin='lower', extent=[0, 10, 0, 10], cmap='RdYlGn_r', aspect='equal')
ax.scatter(hosp_x, hosp_y, c='white', s=100, marker='P', zorder=5, edgecolors='red', linewidths=2)
ax.set_title('3. Distance to Hospital (darker = farther)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 4. Flood risk map
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Flood risk increases near river (y < 2)
flood_risk = np.clip(1 - (grid_y - 0.5) / 3, 0, 1)
ax.imshow(flood_risk, origin='lower', extent=[0, 10, 0, 10], cmap='Blues', aspect='equal', alpha=0.7)
ax.plot(river_x, river_y, color='#3b82f6', linewidth=3)
at_risk = house_y < 2.5
ax.scatter(house_x[~at_risk], house_y[~at_risk], c='#22c55e', s=20, marker='s', label=f'Safe ({np.sum(~at_risk)})')
ax.scatter(house_x[at_risk], house_y[at_risk], c='#ef4444', s=30, marker='s', label=f'At risk ({np.sum(at_risk)})')
ax.set_title('4. Flood Risk Map', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

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
import matplotlib.pyplot as plt

# Compass navigation and triangulation
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Compass rose and bearing system
ax1.set_facecolor('#111827')
ax1.set_aspect('equal')

# Draw compass rose
theta = np.linspace(0, 2*np.pi, 361)
r = 1
ax1.plot(r * np.sin(theta), r * np.cos(theta), color='gray', linewidth=1)

# Cardinal directions
directions = {'N': 0, 'NE': 45, 'E': 90, 'SE': 135, 'S': 180, 'SW': 225, 'W': 270, 'NW': 315}
for name, angle in directions.items():
    rad = np.radians(angle)
    length = 1.1 if len(name) == 1 else 1.05
    ax1.plot([0, length * np.sin(rad)], [0, length * np.cos(rad)],
             color='#f59e0b' if len(name) == 1 else 'gray', linewidth=2 if len(name) == 1 else 0.5)
    ax1.text(1.25 * np.sin(rad), 1.25 * np.cos(rad), name, ha='center', va='center',
             color='#f59e0b' if len(name) == 1 else 'gray', fontsize=10 if len(name) == 1 else 8)

# Degree marks
for deg in range(0, 360, 10):
    rad = np.radians(deg)
    inner = 0.9 if deg % 30 == 0 else 0.95
    ax1.plot([inner * np.sin(rad), np.sin(rad)], [inner * np.cos(rad), np.cos(rad)],
             color='gray', linewidth=0.5)
    if deg % 30 == 0:
        ax1.text(0.82 * np.sin(rad), 0.82 * np.cos(rad), f'{deg}°',
                ha='center', va='center', color='white', fontsize=6)

# Red north needle
ax1.annotate('', xy=(0, 1.05), xytext=(0, 0),
            arrowprops=dict(arrowstyle='->', color='#ef4444', lw=3))

# Example bearing
bearing = 65  # degrees
rad_b = np.radians(bearing)
ax1.annotate('', xy=(0.9*np.sin(rad_b), 0.9*np.cos(rad_b)), xytext=(0, 0),
            arrowprops=dict(arrowstyle='->', color='#22c55e', lw=2))
ax1.text(0.5*np.sin(rad_b), 0.5*np.cos(rad_b) + 0.1, f'Bearing: {bearing}°', color='#22c55e', fontsize=9)

ax1.set_xlim(-1.5, 1.5)
ax1.set_ylim(-1.5, 1.5)
ax1.set_title('Compass Rose & Bearing System', color='white', fontsize=12)
ax1.axis('off')

# 2. Triangulation
ax2.set_facecolor('#e8e0d4')  # map-like background

# Known points (visible peaks)
peak_A = (2, 8)
peak_B = (9, 7)

# True position (unknown to navigator)
true_pos = (5, 3)

# Bearings from true position to peaks
def calc_bearing(from_pos, to_pos):
    dx = to_pos[0] - from_pos[0]
    dy = to_pos[1] - from_pos[1]
    bearing = np.degrees(np.arctan2(dx, dy)) % 360
    return bearing

bearing_A = calc_bearing(true_pos, peak_A)
bearing_B = calc_bearing(true_pos, peak_B)

# Draw lines from peaks at back-bearings (how navigator plots)
back_A = (bearing_A + 180) % 360
back_B = (bearing_B + 180) % 360

# Extend bearing lines
line_length = 12
for peak, back_bear, color, label in [(peak_A, back_A, '#ef4444', f'Peak A (bearing {bearing_A:.0f}°)'),
                                        (peak_B, back_B, '#3b82f6', f'Peak B (bearing {bearing_B:.0f}°)')]:
    rad = np.radians(back_bear)
    end_x = peak[0] + line_length * np.sin(rad)
    end_y = peak[1] + line_length * np.cos(rad)
    ax2.plot([peak[0], end_x], [peak[1], end_y], '--', color=color, linewidth=2, label=label)

# Mark peaks
ax2.scatter(*peak_A, c='#ef4444', s=150, marker='^', zorder=5, edgecolors='white', linewidths=2)
ax2.text(peak_A[0] + 0.3, peak_A[1] + 0.3, 'Peak A', color='#ef4444', fontsize=10, fontweight='bold')
ax2.scatter(*peak_B, c='#3b82f6', s=150, marker='^', zorder=5, edgecolors='white', linewidths=2)
ax2.text(peak_B[0] + 0.3, peak_B[1] + 0.3, 'Peak B', color='#3b82f6', fontsize=10, fontweight='bold')

# Mark true position (intersection)
ax2.scatter(*true_pos, c='#22c55e', s=200, marker='*', zorder=5, edgecolors='white', linewidths=2)
ax2.text(true_pos[0] + 0.3, true_pos[1] - 0.5, 'YOU ARE HERE\\n(intersection!)', color='#22c55e', fontsize=9, fontweight='bold')

ax2.set_xlim(0, 10)
ax2.set_ylim(0, 10)
ax2.set_xlabel('East (km)', color='white')
ax2.set_ylabel('North (km)', color='white')
ax2.set_title('Triangulation: Find Your Position from Two Bearings', color='white', fontsize=12)
ax2.legend(facecolor='white', fontsize=8, loc='lower right')
ax2.tick_params(colors='gray')
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

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
import matplotlib.pyplot as plt

# Distance measurement and slope correction
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# 1. Slope correction diagram
ax1.set_facecolor('#111827')

# Draw hillside
slope_angle = 30  # degrees
horizontal = 100  # m
slope_distance = horizontal / np.cos(np.radians(slope_angle))
vertical = horizontal * np.tan(np.radians(slope_angle))

# Hill surface
ax1.fill_between([0, horizontal], [0, 0], [0, vertical], color='#8B7355', alpha=0.3)
ax1.plot([0, horizontal], [0, vertical], color='#8B7355', linewidth=2)

# Slope distance (along surface)
ax1.plot([0, horizontal], [0, vertical], color='#ef4444', linewidth=3, label=f'Slope distance: {slope_distance:.1f}m')
# Horizontal distance
ax1.plot([0, horizontal], [0, 0], color='#22c55e', linewidth=3, label=f'Horizontal distance: {horizontal:.1f}m')
# Vertical distance
ax1.plot([horizontal, horizontal], [0, vertical], color='#3b82f6', linewidth=3, linestyle='--', label=f'Vertical: {vertical:.1f}m')

# Angle arc
theta = np.linspace(0, np.radians(slope_angle), 30)
arc_r = 20
ax1.plot(arc_r * np.cos(theta), arc_r * np.sin(theta), color='#f59e0b', linewidth=2)
ax1.text(25, 8, f'{slope_angle}°', color='#f59e0b', fontsize=12)

# Formula
ax1.text(50, -15, f'Horizontal = Slope × cos({slope_angle}°) = {slope_distance:.1f} × {np.cos(np.radians(slope_angle)):.3f} = {horizontal:.1f}m',
         ha='center', color='white', fontsize=9)

ax1.set_xlabel('Horizontal distance (m)', color='white')
ax1.set_ylabel('Elevation (m)', color='white')
ax1.set_title('Slope Correction', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_aspect('equal')

# 2. Comparison of measurement methods
ax2.set_facecolor('#111827')

# Simulate measuring a 500m distance
true_distance = 500  # m
n_measurements = 100

methods = {
    'Pacing': {'bias': 5, 'std': 25, 'color': '#ef4444'},  # ±5% error
    'Chain/tape': {'bias': 0.5, 'std': 2, 'color': '#22c55e'},  # ±0.4%
    'GPS (consumer)': {'bias': 0, 'std': 3, 'color': '#3b82f6'},
    'Laser rangefinder': {'bias': 0, 'std': 0.5, 'color': '#f59e0b'},
}

for i, (name, params) in enumerate(methods.items()):
    measurements = true_distance + np.random.normal(params['bias'], params['std'], n_measurements)
    ax2.hist(measurements, bins=20, alpha=0.5, color=params['color'], label=name, density=True)

ax2.axvline(true_distance, color='white', linestyle='--', linewidth=2, label=f'True: {true_distance}m')
ax2.set_xlabel('Measured distance (m)', color='white')
ax2.set_ylabel('Density', color='white')
ax2.set_title('Measurement Accuracy Comparison (true = 500m)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

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
import matplotlib.pyplot as plt

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

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Spot heights (raw data)
ax1.set_facecolor('#e8e0d4')

# Sample 40 random spot heights
n_spots = 40
spot_x = np.random.uniform(0.2, 4.8, n_spots)
spot_y = np.random.uniform(0.2, 4.8, n_spots)
spot_z = np.array([terrain[int(sy/5*(grid_size-1)), int(sx/5*(grid_size-1))]
                    for sx, sy in zip(spot_x, spot_y)])

ax1.scatter(spot_x, spot_y, c=spot_z, cmap='terrain', s=50, edgecolors='black', linewidths=0.5, zorder=3)
for i in range(min(20, n_spots)):
    ax1.text(spot_x[i] + 0.08, spot_y[i] + 0.08, f'{spot_z[i]:.0f}m', fontsize=6, color='black')

ax1.set_xlabel('East (km)', color='white')
ax1.set_ylabel('North (km)', color='white')
ax1.set_title('Step 1: Spot Heights (raw measurements)', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.set_xlim(0, 5); ax1.set_ylim(0, 5)
ax1.set_aspect('equal')

# 2. Contour map (interpolated from spot heights)
ax2.set_facecolor('#e8e0d4')

# Use the full terrain for contours (in reality, you'd interpolate from spots)
from matplotlib.colors import LightSource
ls = LightSource(azdeg=315, altdeg=45)
hillshade = ls.hillshade(terrain, vert_exag=3, dx=5/grid_size, dy=5/grid_size)
ax2.imshow(hillshade, origin='lower', extent=[0, 5, 0, 5], cmap='gray', alpha=0.3)

# Contour lines
contour_interval = 20  # meters
levels = np.arange(160, 380, contour_interval)
cs = ax2.contour(X, Y, terrain, levels=levels, colors='#8B4513', linewidths=0.5)
ax2.clabel(cs, inline=True, fontsize=6, fmt='%d')

# Major contours
major_levels = np.arange(200, 400, 100)
cs_major = ax2.contour(X, Y, terrain, levels=major_levels, colors='#4a2000', linewidths=1.5)
ax2.clabel(cs_major, inline=True, fontsize=8, fmt='%dm')

# Mark summits
for peak_x, peak_y, peak_z in [(1.5, 3, terrain[60, 30]),
                                  (3.5, 1.5, terrain[30, 70]),
                                  (4, 4, terrain[80, 80])]:
    idx_y = int(peak_y / 5 * (grid_size - 1))
    idx_x = int(peak_x / 5 * (grid_size - 1))
    ax2.plot(peak_x, peak_y, '^', color='#ef4444', markersize=8)
    ax2.text(peak_x + 0.1, peak_y + 0.1, f'{terrain[idx_y, idx_x]:.0f}m', color='#ef4444', fontsize=8)

ax2.set_xlabel('East (km)', color='white')
ax2.set_ylabel('North (km)', color='white')
ax2.set_title(f'Step 2: Contour Map (interval: {contour_interval}m)', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 5); ax2.set_ylim(0, 5)
ax2.set_aspect('equal')

plt.tight_layout()
plt.show()

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
import matplotlib.pyplot as plt

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

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Feature identification exercise
ax1.set_facecolor('#e8e0d4')

from matplotlib.colors import LightSource
ls = LightSource(azdeg=315, altdeg=45)
hillshade = ls.hillshade(terrain, vert_exag=3, dx=6/grid_size, dy=6/grid_size)
ax1.imshow(hillshade, origin='lower', extent=[0, 6, 0, 6], cmap='gray', alpha=0.3)

levels = np.arange(200, 550, 20)
cs = ax1.contour(X, Y, terrain, levels=levels, colors='#8B4513', linewidths=0.5)
ax1.clabel(cs, inline=True, fontsize=6, fmt='%d')

# Mark features to identify
features = {
    'A': (1.5, 4.5, 'Peak (summit)'),
    'B': (4, 4, 'Peak (summit)'),
    'C': (2.8, 4.2, 'Saddle (col)'),
    'D': (3, 1.5, 'Valley floor'),
    'E': (5, 1.5, 'Small hill'),
    'F': (1, 1, 'Depression'),
}

for label, (fx, fy, desc) in features.items():
    ax1.plot(fx, fy, 'o', color='#ef4444', markersize=12, markeredgecolor='white', markeredgewidth=2)
    ax1.text(fx + 0.15, fy + 0.15, label, color='#ef4444', fontsize=12, fontweight='bold')

ax1.set_xlabel('East (km)', color='white')
ax1.set_ylabel('North (km)', color='white')
ax1.set_title('Identify the Features (A-F)', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.set_aspect('equal')

# 2. Slope profile and route planning
ax2.set_facecolor('#111827')

# Route from D (valley) to A (peak) — two options
# Direct route (steep)
direct_x = np.linspace(3, 1.5, 100)
direct_y = np.linspace(1.5, 4.5, 100)
direct_elev = [terrain[int(dy/6*(grid_size-1)), int(dx/6*(grid_size-1))] for dx, dy in zip(direct_x, direct_y)]
direct_dist = np.cumsum(np.sqrt(np.diff(direct_x)**2 + np.diff(direct_y)**2) * 1000)
direct_dist = np.insert(direct_dist, 0, 0)

# Ridge route (longer but easier)
ridge_x = [3, 2.5, 2, 1.5, 1.2, 1.3, 1.5]
ridge_y = [1.5, 2.5, 3.5, 4, 4.2, 4.4, 4.5]
ridge_x_interp = np.interp(np.linspace(0, 1, 100), np.linspace(0, 1, len(ridge_x)), ridge_x)
ridge_y_interp = np.interp(np.linspace(0, 1, 100), np.linspace(0, 1, len(ridge_y)), ridge_y)
ridge_elev = [terrain[int(dy/6*(grid_size-1)), int(dx/6*(grid_size-1))] for dx, dy in zip(ridge_x_interp, ridge_y_interp)]
ridge_dist = np.cumsum(np.sqrt(np.diff(ridge_x_interp)**2 + np.diff(ridge_y_interp)**2) * 1000)
ridge_dist = np.insert(ridge_dist, 0, 0)

ax2.plot(direct_dist, direct_elev, color='#ef4444', linewidth=2, label='Direct route (steep)')
ax2.plot(ridge_dist, ridge_elev, color='#22c55e', linewidth=2, label='Ridge route (gentler)')

# Mark on the map too
ax1.plot(direct_x, direct_y, '--', color='#ef4444', linewidth=2, alpha=0.7)
ax1.plot(ridge_x_interp, ridge_y_interp, '-', color='#22c55e', linewidth=2, alpha=0.7)

# Calculate gradients
direct_gradient = np.max(np.abs(np.diff(direct_elev) / np.diff(direct_dist) * 100))
ridge_gradient = np.max(np.abs(np.diff(ridge_elev) / np.diff(ridge_dist) * 100))

ax2.set_xlabel('Distance along route (m)', color='white')
ax2.set_ylabel('Elevation (m)', color='white')
ax2.set_title('Route Comparison: D→A', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

ax2.text(0.5, 0.95, f'Direct: {direct_dist[-1]:.0f}m, max gradient {direct_gradient:.0f}%',
         transform=ax2.transAxes, color='#ef4444', fontsize=9, va='top')
ax2.text(0.5, 0.88, f'Ridge: {ridge_dist[-1]:.0f}m, max gradient {ridge_gradient:.0f}%',
         transform=ax2.transAxes, color='#22c55e', fontsize=9, va='top')

plt.tight_layout()
plt.show()

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
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate field survey of a school compound
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# 1. Field survey data (raw measurements)
ax1.set_facecolor('#f5f0e1')  # notebook paper

# Baseline
baseline_start = (10, 50)
baseline_end = (90, 50)
ax1.plot([baseline_start[0], baseline_end[0]], [baseline_start[1], baseline_end[1]],
         'k-', linewidth=2, label='Baseline (80m)')

# Survey points (features measured from baseline)
features = {
    'Main building': {'bearing_A': 20, 'bearing_B': 340, 'type': 's', 'size': 300, 'color': '#ef4444'},
    'Classroom block': {'bearing_A': 45, 'bearing_B': 350, 'type': 's', 'size': 200, 'color': '#f59e0b'},
    'Playground': {'bearing_A': 350, 'bearing_B': 250, 'type': 'o', 'size': 400, 'color': '#22c55e'},
    'Well': {'bearing_A': 60, 'bearing_B': 10, 'type': '*', 'size': 150, 'color': '#3b82f6'},
    'Gate': {'bearing_A': 280, 'bearing_B': 260, 'type': 'D', 'size': 100, 'color': '#a855f7'},
    'Big tree': {'bearing_A': 350, 'bearing_B': 310, 'type': '^', 'size': 150, 'color': '#22c55e'},
}

# Calculate positions from bearings (triangulation)
def triangulate(baseline_s, baseline_e, bearing_A_deg, bearing_B_deg):
    """Find position from two bearings"""
    ax, ay = baseline_s
    bx, by = baseline_e
    # Convert bearings to radians (from north, clockwise)
    a_rad = np.radians(bearing_A_deg)
    b_rad = np.radians(bearing_B_deg)
    # Direction vectors
    dx_a, dy_a = np.sin(a_rad), np.cos(a_rad)
    dx_b, dy_b = np.sin(b_rad), np.cos(b_rad)
    # Solve intersection
    det = dx_a * dy_b - dy_a * dx_b
    if abs(det) < 1e-10:
        return None
    t = ((bx - ax) * dy_b - (by - ay) * dx_b) / det
    px = ax + t * dx_a
    py = ay + t * dy_a
    return (px, py)

positions = {}
for name, data in features.items():
    pos = triangulate(baseline_start, baseline_end, data['bearing_A'], data['bearing_B'])
    if pos:
        positions[name] = pos
        # Draw bearing lines
        ax1.plot([baseline_start[0], pos[0]], [baseline_start[1], pos[1]],
                ':', color='gray', linewidth=0.5)
        ax1.plot([baseline_end[0], pos[0]], [baseline_end[1], pos[1]],
                ':', color='gray', linewidth=0.5)
        ax1.scatter(pos[0], pos[1], c=data['color'], s=data['size'] / 3,
                   marker=data['type'], zorder=5)

ax1.scatter(*baseline_start, c='black', s=50, zorder=5, marker='o')
ax1.scatter(*baseline_end, c='black', s=50, zorder=5, marker='o')
ax1.text(baseline_start[0], baseline_start[1] - 3, 'A', ha='center', fontsize=10)
ax1.text(baseline_end[0], baseline_end[1] - 3, 'B', ha='center', fontsize=10)

ax1.set_xlim(0, 100)
ax1.set_ylim(0, 100)
ax1.set_title('Survey Data (bearings from baseline A-B)', color='white', fontsize=11)
ax1.set_xlabel('East (m)', color='white')
ax1.set_ylabel('North (m)', color='white')
ax1.tick_params(colors='gray')
ax1.set_aspect('equal')

# 2. Finished map
ax2.set_facecolor('#f5f0e1')

# Buildings as rectangles
for name in ['Main building', 'Classroom block']:
    if name in positions:
        px, py = positions[name]
        w, h = (20, 12) if 'Main' in name else (15, 8)
        rect = plt.Rectangle((px - w/2, py - h/2), w, h,
                              facecolor=features[name]['color'], alpha=0.5,
                              edgecolor='black', linewidth=1)
        ax2.add_patch(rect)
        ax2.text(px, py, name, ha='center', va='center', fontsize=6, fontweight='bold')

# Playground as circle
if 'Playground' in positions:
    px, py = positions['Playground']
    circle = plt.Circle((px, py), 12, facecolor='#90EE90', alpha=0.5, edgecolor='#22c55e', linewidth=1)
    ax2.add_patch(circle)
    ax2.text(px, py, 'Playground', ha='center', va='center', fontsize=7)

# Other features
for name in ['Well', 'Gate', 'Big tree']:
    if name in positions:
        px, py = positions[name]
        ax2.scatter(px, py, c=features[name]['color'], s=features[name]['size'],
                   marker=features[name]['type'], zorder=5, edgecolors='black', linewidths=1)
        ax2.text(px + 3, py + 3, name, fontsize=7)

# Road
ax2.plot([0, 100], [50, 50], color='#8B7355', linewidth=4, alpha=0.5)
ax2.text(50, 47, 'Main Road', ha='center', fontsize=7, color='#8B7355')

# Fence/boundary
boundary = plt.Rectangle((5, 5), 90, 90, fill=False, edgecolor='black',
                           linewidth=2, linestyle='--')
ax2.add_patch(boundary)

# Map elements
ax2.text(50, 97, 'MAP OF SCHOOL COMPOUND', ha='center', fontsize=12,
         fontweight='bold', color='black')
ax2.text(50, 93, 'Surveyed by: Map Maker\'s Granddaughter | Date: March 2026',
         ha='center', fontsize=7, color='gray')

# North arrow
ax2.annotate('', xy=(92, 90), xytext=(92, 82),
            arrowprops=dict(arrowstyle='->', color='black', lw=2))
ax2.text(92, 80, 'N', ha='center', fontsize=10, fontweight='bold')

# Scale bar
ax2.plot([8, 28], [8, 8], 'k-', linewidth=3)
ax2.plot([8, 8], [7, 9], 'k-', linewidth=1)
ax2.plot([28, 28], [7, 9], 'k-', linewidth=1)
ax2.text(18, 5.5, '20 m', ha='center', fontsize=8)

ax2.set_xlim(0, 100)
ax2.set_ylim(0, 100)
ax2.set_title('Finished Map', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_aspect('equal')
ax2.axis('off')

plt.tight_layout()
plt.show()

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
            diagram={[LatLongGridDiagram, MapProjectionDiagram, ContourMapDiagram, CoordinatePlaneDiagram, LinearGraphDiagram, NEIndiaBiomesDiagram][i] ? createElement([LatLongGridDiagram, MapProjectionDiagram, ContourMapDiagram, CoordinatePlaneDiagram, LinearGraphDiagram, NEIndiaBiomesDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}