import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function SiangRiverLevel1() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'River erosion processes — hydraulic action, abrasion, and attrition',
      concept: `In "How the Siang River Carved Its Path," the river cuts through some of the hardest rock on Earth — the Himalayan gneiss and granite. How? Through three erosion processes that work together:

**Hydraulic action:** The sheer force of moving water. When water slams into rock, pressure waves penetrate cracks. Air trapped in cracks compresses under water impact, then expands as the water pulls back — like a tiny explosion inside the rock. This gradually widens cracks until pieces break off.

**Abrasion (corrasion):** Sediment carried by the river acts as sandpaper. Rocks, sand, and gravel scrape against the bed and banks, grinding them down. This is the dominant erosion process in the Siang — its heavy sediment load is an army of tiny chisels.

**Attrition:** Sediment particles collide with each other during transport, breaking into smaller and rounder pieces. Angular mountain boulders become smooth river pebbles within 50-100 km of transport. By the time Siang sediment reaches the Assam plains, sharp rocks have become rounded sand grains.

**A fourth process — solution (corrosion):** Slightly acidic river water dissolves soluble rocks like limestone. Less important for the Siang (mostly hard metamorphic rock) but dominant in limestone landscapes (karst).

The Siang drops 2,500m in elevation over ~300 km through the Eastern Himalayas. This extreme gradient gives it enormous erosive power — enough to cut through mountains.`,
      analogy: 'River erosion is like a team of craftsmen. Hydraulic action is the demolition crew (breaking off big chunks with force). Abrasion is the sandblaster (grinding surfaces smooth). Attrition is the rock tumbler (rounding and shrinking particles). Solution is the acid cleaner (dissolving what can be dissolved). Together, they transform mountains into plains.',
      storyConnection: 'The story says the Siang "argued with the mountains until they gave way." Geologically, this is accurate. The river has been "arguing" (eroding) for millions of years. The Himalayas are still rising (tectonic uplift), and the Siang is still cutting. It is a race between mountain building and river carving — and currently, the river is winning.',
      checkQuestion: 'The Siang/Brahmaputra gorge through the Eastern Himalayas is one of the deepest on Earth (~5,000m). How can a river cut deeper than the mountains are high?',
      checkAnswer: 'The river was there BEFORE the mountains. As tectonic forces pushed the Himalayas upward, the river kept cutting down at the same rate. This is called an "antecedent river" — it maintained its course while the land rose around it. The gorge\'s depth represents millions of years of uplift minus millions of years of erosion. The river is older than the mountains.',
      codeIntro: 'Model the three erosion processes and their relative contributions along the Siang\'s course.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Distance along the Siang from Tibet to Assam (km)
distance = np.linspace(0, 500, 200)

# Elevation profile: steep descent through Himalayas
elevation = 4500 * np.exp(-distance / 150) + 100

# Slope (gradient)
slope = -np.gradient(elevation, distance) / 1000  # m/m
slope = np.maximum(slope, 0)

# Stream velocity (proportional to sqrt of slope)
velocity = 2 + 8 * np.sqrt(slope)

# Erosion rates by process
hydraulic = 0.3 * velocity**2 / 100  # proportional to v²
abrasion = 0.5 * velocity * (500 - distance) / 500  # sediment load decreases downstream
attrition = 0.2 * np.exp(-distance / 200)  # rock fragments break down exponentially
total_erosion = hydraulic + abrasion + attrition

fig, axes = plt.subplots(3, 1, figsize=(12, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Elevation profile
ax = axes[0]
ax.set_facecolor('#111827')
ax.fill_between(distance, 0, elevation, color='#6b7280', alpha=0.3)
ax.plot(distance, elevation, color='white', linewidth=2)
ax.set_ylabel('Elevation (m)', color='white')
ax.set_title('The Siang River: Tibet to Assam', color='white', fontsize=13)
ax.tick_params(colors='gray')
# Label sections
ax.text(50, 3500, 'Tibet\\nPlateau', color='#60a5fa', fontsize=10, ha='center')
ax.text(200, 2000, 'Himalayan\\nGorge', color='#ef4444', fontsize=10, ha='center')
ax.text(400, 500, 'Assam\\nPlains', color='#22c55e', fontsize=10, ha='center')

# Velocity
ax = axes[1]
ax.set_facecolor('#111827')
ax.plot(distance, velocity, color='#3b82f6', linewidth=2)
ax.fill_between(distance, velocity, alpha=0.15, color='#3b82f6')
ax.set_ylabel('Flow velocity (m/s)', color='white')
ax.set_title('River Velocity', color='#3b82f6', fontsize=11)
ax.tick_params(colors='gray')

# Erosion processes
ax = axes[2]
ax.set_facecolor('#111827')
ax.fill_between(distance, 0, hydraulic, alpha=0.5, color='#ef4444', label='Hydraulic action')
ax.fill_between(distance, hydraulic, hydraulic + abrasion, alpha=0.5, color='#f59e0b', label='Abrasion')
ax.fill_between(distance, hydraulic + abrasion, total_erosion, alpha=0.5, color='#22c55e', label='Attrition')
ax.plot(distance, total_erosion, color='white', linewidth=1, alpha=0.5)

ax.set_xlabel('Distance from source (km)', color='white')
ax.set_ylabel('Erosion rate (relative)', color='white')
ax.set_title('Erosion Processes Along the River', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Erosion along the Siang:")
print("  Tibet (0-100km): moderate — wide, slow river")
print("  Gorge (100-300km): EXTREME — steep, fast, heavy sediment")
print("  Plains (300-500km): low — gentle gradient, depositing")
print()
print("The Himalayan gorge is where most erosion happens.")
print("Abrasion dominates because the river carries enormous")
print("amounts of sediment (grinding tools) at high velocity.")`,
      challenge: 'Add a "solution" erosion component that is high where limestone is present (e.g., around 250-300km). How does this change the total erosion profile? Some Himalayan rivers have created spectacular limestone caves through solution erosion.',
      successHint: 'River erosion is the process that turns mountains into plains, given enough time. The Siang\'s power comes from its combination of extreme gradient, heavy sediment load, and massive discharge — making it one of the most erosive rivers on Earth.',
    },
    {
      title: 'V-shaped valleys — the signature of river erosion',
      concept: `Rivers carve **V-shaped valleys** through a process called **vertical incision**: the river cuts downward faster than the valley walls erode sideways.

**The V-shape forms because:**
1. The river concentrates its erosive energy on a narrow strip of bedrock (the channel)
2. The channel cuts downward, creating steep valley walls
3. Gravity, weathering, and rain erode the exposed walls, carrying debris into the river
4. The walls retreat at a rate determined by rock strength and climate
5. The combination of fast vertical cutting + slower sideways retreat = V-shape

**V-shape characteristics depend on:**
- **Rock type**: hard rock (granite) = steep walls, narrow V. Soft rock (shale) = gentle walls, wide V
- **Climate**: wet climates = faster wall erosion = wider V. Dry climates = slower = narrower V
- **Uplift rate**: fast uplift = river cuts faster = deeper, narrower V
- **River stage**: young rivers in uplands carve narrow V's. Mature rivers widen to flat-bottomed U's

**The Siang gorge:**
Where the Siang cuts through the Eastern Himalayas, the valley is an extreme V — walls thousands of metres high, nearly vertical in places. This is because:
- Hard metamorphic rock (gneiss, schist) resists sideways erosion
- Rapid tectonic uplift forces the river to cut down fast
- Steep gradient provides enormous erosive power`,
      analogy: 'V-shaped valley formation is like sawing through a log from the top. The saw (river) cuts straight down, creating a narrow kerf. The wood on either side (valley walls) is exposed and gradually crumbles inward under gravity. The kerf widens from the top — creating a V-shape. Harder wood (harder rock) makes a narrower, steeper V.',
      storyConnection: 'The story describes the Siang flowing through a "canyon so deep the sun only reaches the river at noon." This is the Tsangpo-Siang gorge — one of the deepest canyons on Earth. The extreme V-shape means the sun\'s rays only reach the river bottom when directly overhead. The gorge\'s depth is a testament to millions of years of relentless vertical erosion.',
      checkQuestion: 'U-shaped valleys are carved by glaciers, V-shaped by rivers. What would a valley look like if a glacier carved it first, then a river cut through the bottom?',
      checkAnswer: 'A U-shape with a V notch cut into the flat bottom — like a U with a V inside it. Many mountain valleys show exactly this pattern: glacial U-shape from ice ages with a modern river cutting a narrow V into the former glacier floor. The two shapes record two different chapters of the valley\'s history.',
      codeIntro: 'Model V-shaped valley formation: vertical incision + wall retreat over geological time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(15, 8))
fig.patch.set_facecolor('#1f2937')

def valley_profile(width_pts, river_depth, wall_angle_deg, rock_hardness=1.0):
    """Generate a V-shaped valley cross-section"""
    x = np.linspace(-1500, 1500, width_pts)
    wall_angle = np.radians(wall_angle_deg)
    valley_width = river_depth / np.tan(wall_angle) * 2

    # Valley floor
    y = np.zeros_like(x)
    for i, xi in enumerate(x):
        dist_from_center = abs(xi)
        if dist_from_center < 20:  # river channel
            y[i] = -river_depth
        else:
            y[i] = -river_depth + (dist_from_center - 20) * np.tan(wall_angle)
            y[i] = min(y[i], 0)  # cap at surface

    return x, y

# Evolution over time
times = [0, 1, 5, 10, 50, 100]  # millions of years
time_labels = ['0 Ma', '1 Ma', '5 Ma', '10 Ma', '50 Ma', '100 Ma']
erosion_rates = [0, 10, 50, 100, 400, 600]  # metres of vertical incision
wall_angles = [90, 75, 60, 55, 45, 40]  # walls get less steep over time

for ax, t_label, depth, angle in zip(axes.flat, time_labels, erosion_rates, wall_angles):
    ax.set_facecolor('#111827')

    if depth == 0:
        # Flat surface
        x = np.linspace(-1500, 1500, 300)
        y = np.zeros_like(x)
        ax.fill_between(x, -800, y, color='#6b7280', alpha=0.3)
        ax.plot(x, y, color='#d4a574', linewidth=2)
        ax.plot(0, 0, 'v', color='#3b82f6', markersize=8)
        ax.text(0, 50, 'River starts here', ha='center', color='#3b82f6', fontsize=8)
    else:
        x, y = valley_profile(300, depth, angle)
        ax.fill_between(x, -800, y, color='#6b7280', alpha=0.3)
        ax.plot(x, y, color='#d4a574', linewidth=2)
        # Water in channel
        water_mask = np.abs(x) < 30
        ax.fill_between(x[water_mask], y[water_mask], y[water_mask] - 5,
                         color='#3b82f6', alpha=0.5)

    ax.set_ylim(-800, 200)
    ax.set_xlim(-1500, 1500)
    ax.set_title(f'{t_label}: depth={depth}m', color='white', fontsize=10)
    ax.set_xlabel('Distance (m)', color='white', fontsize=8)
    ax.tick_params(colors='gray')
    ax.set_aspect('equal')

axes[0, 0].set_ylabel('Elevation (m)', color='white')
axes[1, 0].set_ylabel('Elevation (m)', color='white')

plt.suptitle('V-Shaped Valley Formation Over Geological Time', color='white', fontsize=14, y=1.01)
plt.tight_layout()
plt.show()

print("V-valley formation timeline:")
print("  0 Ma: flat surface, river begins")
print("  1 Ma: shallow notch (10m deep)")
print("  5 Ma: recognisable V-valley (50m)")
print("  10 Ma: deep valley (100m)")
print("  50-100 Ma: major gorge (400-600m)")
print()
print("The Siang gorge (~5000m) required 10-20 million years")
print("of continuous erosion while the Himalayas rose around it.")`,
      challenge: 'Model the difference between a V-valley in granite (steep walls, 70° angle) vs. shale (gentle walls, 30° angle). Which rock type creates a wider valley at the same depth? How does this affect the landscape?',
      successHint: 'V-shaped valleys are the fundamental landform created by rivers. Recognising a V-valley in the landscape immediately tells you: flowing water carved this, from the top down, over geological time. Every mountain stream valley began as a tiny notch in the rock surface.',
    },
    {
      title: 'Waterfalls and gorges — erosion\'s most dramatic features',
      concept: `Waterfalls form where a river crosses a boundary between resistant and weak rock. The process:

1. River flows over hard rock onto soft rock
2. Soft rock erodes faster → a step forms
3. Water plunges over the step → waterfall
4. The plunge pool at the base erodes soft rock behind the hard cap
5. The hard cap becomes undermined → overhangs → collapses
6. The waterfall retreats upstream, leaving a gorge behind it

**Niagara Falls retreats ~1m per year.** Over 12,000 years, it has carved an 11km gorge.

**Types of waterfalls:**
- **Plunge**: free-falling water (Victoria Falls)
- **Cascade**: water bouncing down steps (most Himalayan falls)
- **Horsetail**: water maintains contact with rock face
- **Block**: wide, curtain-like (Niagara)

**The Siang has numerous waterfalls and rapids** in the gorge section, where the river crosses bands of varying rock hardness. These rapids are knickpoints — places where erosion is temporarily concentrated because of a hard-soft rock boundary.

**Gorges** are narrow, steep-walled valleys carved by waterfalls retreating upstream. The gorge extends backward from the waterfall as it retreats.`,
      analogy: 'Waterfall retreat is like peeling wallpaper from a wall. You pull (erode) at the edge where the paper lifts (soft rock under hard cap). The peel propagates backward as more paper is exposed. The hard cap rock is the wallpaper; the soft rock is the weak paste underneath. The gorge is the exposed wall behind the peel front.',
      storyConnection: 'The story mentions the Siang "tumbling down stairs of stone." These are the cascades and rapids where the river crosses hard rock bands. Each "stair" is a knickpoint where the hard rock resists erosion temporarily, creating a step. Over millennia, these steps smooth out or retreat — the staircase is slowly being dismantled.',
      checkQuestion: 'If Niagara Falls retreats at 1m/year and started at the Niagara Escarpment 12,000 years ago, when will it reach Lake Erie (about 35km upstream)?',
      checkAnswer: 'At 1m/year, it would take 35,000 years to reach Lake Erie. But the retreat rate has slowed (from ~1.5m/yr historically to ~0.3m/yr today) due to water diversion for hydropower. At the current rate, it would take ~100,000 years. When it reaches Lake Erie, the falls would cease to exist — the lake would drain through the gorge. This is the eventual fate of all waterfalls: they erode themselves out of existence.',
      codeIntro: 'Simulate waterfall retreat and gorge formation over thousands of years.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(15, 8))
fig.patch.set_facecolor('#1f2937')

def create_profile(fall_position, gorge_length, fall_height):
    """Create river profile with waterfall and gorge"""
    x = np.linspace(0, 1000, 500)  # metres
    y = np.zeros_like(x)

    # Upstream: gentle slope
    upstream_mask = x < fall_position - gorge_length
    y[upstream_mask] = fall_height + 20 + 0.01 * (fall_position - gorge_length - x[upstream_mask])

    # Gorge: steep walls, flat bottom (carved by retreating waterfall)
    gorge_mask = (x >= fall_position - gorge_length) & (x < fall_position)
    y[gorge_mask] = 5 + 0.005 * (fall_position - x[gorge_mask])

    # Waterfall: vertical drop
    fall_mask = (x >= fall_position) & (x < fall_position + 5)
    y[fall_mask] = np.linspace(fall_height + 20, 5, np.sum(fall_mask))

    # Downstream: gentle slope
    downstream_mask = x >= fall_position + 5
    y[downstream_mask] = 5 - 0.002 * (x[downstream_mask] - fall_position - 5)

    return x, np.maximum(y, 0)

# Simulate retreat over time
times_yr = [0, 500, 2000, 5000, 10000, 20000]
retreat_rate = 0.05  # m/year
fall_height = 30  # metres

for ax, t_yr in zip(axes.flat, times_yr):
    ax.set_facecolor('#111827')

    retreat_distance = retreat_rate * t_yr
    fall_pos = 700 - retreat_distance
    gorge_len = retreat_distance

    x, y = create_profile(fall_pos, gorge_len, fall_height)

    # Draw rock
    ax.fill_between(x, -10, y, color='#6b7280', alpha=0.3)

    # Hard cap rock (top layer)
    hard_rock_y = y.copy()
    hard_rock_y[y < fall_height + 15] = np.nan
    ax.fill_between(x, y, hard_rock_y + 3, color='#92400e', alpha=0.5)

    # Water
    water_y = y.copy()
    water_y[y > fall_height + 20] = fall_height + 20
    ax.plot(x, water_y + 2, color='#3b82f6', linewidth=2)

    # Plunge pool
    if fall_pos > 0 and fall_pos < 1000:
        plunge_x = np.linspace(fall_pos - 10, fall_pos + 15, 30)
        plunge_y = -5 + 5 * np.cos(np.pi * (plunge_x - fall_pos) / 25)
        ax.fill_between(plunge_x, plunge_y, 5, color='#3b82f6', alpha=0.3)

    ax.set_ylim(-10, 60)
    ax.set_xlim(0, 1000)
    ax.set_title(f'Year {t_yr}: gorge = {gorge_len:.0f}m', color='white', fontsize=10)
    ax.tick_params(colors='gray', labelsize=7)

    # Label features
    if t_yr > 0:
        ax.annotate('Waterfall', (fall_pos, fall_height + 22), color='#3b82f6', fontsize=8, ha='center')
        ax.annotate('Gorge', (fall_pos - gorge_len/2, 10), color='#ef4444', fontsize=8, ha='center')

axes[1, 0].set_xlabel('Distance (m)', color='white')
axes[1, 1].set_xlabel('Distance (m)', color='white')
axes[1, 2].set_xlabel('Distance (m)', color='white')

plt.suptitle('Waterfall Retreat and Gorge Formation', color='white', fontsize=14, y=1.01)
plt.tight_layout()
plt.show()

print("Waterfall retreat mechanics:")
print(f"  Retreat rate: {retreat_rate} m/year")
print(f"  Fall height: {fall_height} m")
print()
for t in times_yr:
    print(f"  Year {t:>6}: gorge length = {retreat_rate * t:.0f} m")
print()
print("Real-world retreat rates:")
print("  Niagara Falls: ~0.3-1.0 m/year")
print("  Victoria Falls: ~0.1 m/year (hard basalt)")
print("  Iguazu Falls: ~0.02 m/year (extremely hard rock)")`,
      challenge: 'Add alternating hard and soft rock layers. When the waterfall retreats through a hard layer, the rate slows to 0.01 m/yr. Through soft layers: 0.1 m/yr. How does this create a stepped gorge profile?',
      successHint: 'Waterfalls and gorges are erosion caught in the act. They are temporary features on a geological timescale — every waterfall is retreating, every gorge is lengthening. In millions of years, they smooth out into gentle river profiles.',
    },
    {
      title: 'Geological time scale — millions of years of patience',
      concept: `The Siang has been carving its path for **at least 15-20 million years** — since before the Himalayas reached their current height. Understanding geological time is essential for understanding erosion.

**Key time markers:**
- **4,600 Ma**: Earth forms
- **3,500 Ma**: earliest life (bacteria)
- **250 Ma**: Pangaea supercontinent
- **50-55 Ma**: India collides with Asia → Himalayan orogeny begins
- **15-20 Ma**: Siang/Brahmaputra river system established
- **2.6 Ma**: ice ages begin (Pleistocene)
- **12,000 years ago**: last ice age ends
- **~5,000 years ago**: earliest Assamese civilisation

**Erosion rates in perspective:**
- Siang gorge: ~5mm/year of incision (5km over 1 million years)
- Grand Canyon: ~0.3mm/year (1.8km over 6 million years)
- Global average: ~0.06mm/year of land surface lowering

**The challenge of deep time:**
If Earth's history were compressed into one year:
- Life appears in March
- Dinosaurs live from mid-December to December 26
- The Himalayas begin rising on December 29
- All of human history: last 13 seconds of December 31
- The Siang has been carving since December 30`,
      analogy: 'Geological time is like compound interest. A tiny erosion rate (0.05mm/year — thinner than a human hair) seems negligible. But over 10 million years, it removes 500 metres of rock. Over 100 million years, 5 kilometres. Mountains rise slowly; rivers erase them slowly. The patience of geology is difficult for human minds to grasp because we live for less than one hundred years — a blink in geological time.',
      storyConnection: 'The story says the Siang is "older than memory." In geological terms, the river predates the earliest humans by millions of years. The Adi and Apatani people who live in the Siang valley have been there for perhaps 10,000 years. The river has been carving for 20 million years. Human civilisation is a footnote in the river\'s history.',
      checkQuestion: 'If the Himalayas are still rising at 5mm/year and the Siang erodes at 5mm/year, why isn\'t everything staying the same?',
      checkAnswer: 'It roughly IS staying the same — this is called a dynamic equilibrium. The river adjusts its erosion rate to match the uplift rate. If uplift accelerates, the gradient steepens, the river erodes faster, and a new equilibrium is reached. If uplift slows, erosion outpaces it and the mountains shrink. Currently, the Siang\'s gorge depth is roughly in balance — dramatic to us, but stable on geological timescales.',
      codeIntro: 'Visualise the geological time scale and show where the Siang\'s history fits.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Top: Full geological time scale
ax1.set_facecolor('#111827')
events = [
    (4600, 'Earth forms', '#ef4444'),
    (3500, 'First life', '#22c55e'),
    (540, 'Cambrian explosion', '#3b82f6'),
    (252, 'Great Dying', '#ef4444'),
    (66, 'Dinosaur extinction', '#f59e0b'),
    (55, 'India-Asia collision', '#a855f7'),
    (20, 'Siang established', '#ec4899'),
    (2.6, 'Ice ages begin', '#60a5fa'),
    (0.01, 'Human civilisation', '#fbbf24'),
]

y_pos = range(len(events))
times = [e[0] for e in events]
labels = [e[1] for e in events]
colors = [e[2] for e in events]

ax1.barh(y_pos, times, color=colors, height=0.6, alpha=0.7)
ax1.set_xscale('log')
ax1.set_yticks(y_pos)
ax1.set_yticklabels(labels, color='white', fontsize=9)
ax1.set_xlabel('Million years ago (log scale)', color='white')
ax1.set_title('Geological Time Scale', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.invert_yaxis()

for i, (t, label, color) in enumerate(events):
    ax1.text(t * 1.2, i, f'{t} Ma', va='center', color=color, fontsize=8)

# Bottom: Siang erosion over its history
ax2.set_facecolor('#111827')
time_ma = np.linspace(20, 0, 200)  # 20 Ma to present

# Gorge depth grows over time
# Rate varies: faster when uplift is faster
uplift_rate = 2 + 3 * np.exp(-(time_ma - 5)**2 / 20)  # peak uplift at 5 Ma
erosion_rate = uplift_rate * 0.9  # erosion roughly matches uplift
gorge_depth = np.cumsum(erosion_rate[::-1])[::-1] * 0.1  # mm/yr * Ma → m
gorge_depth = gorge_depth - gorge_depth[-1]  # normalize to 0 at present

ax2.plot(time_ma, gorge_depth, color='#ef4444', linewidth=2, label='Gorge depth (cumulative erosion)')
ax2.fill_between(time_ma, gorge_depth, alpha=0.15, color='#ef4444')

# Himalayan height
himalaya_height = 2000 + 6000 * (1 - np.exp(-time_ma / 10))
himalaya_height = himalaya_height[::-1]  # reverse: starts low, grows
ax2.plot(time_ma, himalaya_height, color='#a855f7', linewidth=2, linestyle='--', label='Himalayan height (approx)')

ax2.set_xlabel('Million years ago', color='white')
ax2.set_ylabel('Metres', color='white')
ax2.set_title('Siang Gorge Deepening vs Himalayan Growth', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')
ax2.invert_xaxis()

plt.tight_layout()
plt.show()

print("The Siang's timeline:")
print("  20 Ma: proto-Siang begins as India pushes into Asia")
print("  15 Ma: recognisable river system in deepening gorge")
print("  5 Ma:  peak Himalayan uplift → peak erosion")
print("  2 Ma:  ice ages begin, glacial erosion assists river")
print("  0.01 Ma: humans settle the Siang valley")
print()
print("In one human lifetime (~80 years):")
print("  Himalayan uplift: ~400mm (16 inches)")
print("  Siang erosion: ~400mm (16 inches)")
print("  Result: imperceptible change. But multiply by millions...")`,
      challenge: 'If you could fast-forward 10 million years, how would the Siang gorge look? Model the scenario where uplift stops but erosion continues. The mountains would shrink and eventually be worn flat — a peneplain.',
      successHint: 'Geological time is the single most important concept for understanding landscape formation. Processes that seem impossibly slow to us — millimetres per year — create mountain ranges and carve gorges when given millions of years to work.',
    },
    {
      title: 'Rock types and hardness — why some mountains resist erosion',
      concept: `The Siang cuts through some of the Earth's toughest rocks. **Rock hardness** determines how fast a river can erode:

**Igneous rocks** (formed from molten magma):
- **Granite**: very hard (Mohs 6-7), resists erosion well. Forms prominent peaks
- **Basalt**: hard (Mohs 6), but fractures along columns → erodes faster along joints

**Metamorphic rocks** (transformed by heat and pressure):
- **Gneiss**: very hard (Mohs 6-7), dominant rock in the Eastern Himalayas
- **Schist**: medium-hard (Mohs 4-5), splits along foliation planes
- **Marble**: medium (Mohs 3-4), dissolves in acidic water (karst)

**Sedimentary rocks** (formed from compressed sediment):
- **Sandstone**: medium (Mohs 6-7 for quartz grains, but weak cement)
- **Limestone**: soft-medium (Mohs 3), dissolves in slightly acidic rain
- **Shale**: soft (Mohs 2-3), erodes rapidly, creates gentle slopes

**The Mohs hardness scale** (1-10):
1 (talc) → 2 (gypsum) → 3 (calcite) → 4 (fluorite) → 5 (apatite) → 6 (feldspar) → 7 (quartz) → 8 (topaz) → 9 (corundum) → 10 (diamond)

The Siang flows primarily through gneiss (Mohs 6-7) — which is why it needs such enormous power (steep gradient, heavy sediment) to carve through it. A river of the same size in limestone would carve a much wider, gentler valley.`,
      analogy: 'Rock types facing river erosion are like different surfaces facing sandpaper. Granite is like hardwood — the sandpaper (river) wears it down slowly. Limestone is like softwood — much faster. Shale is like cardboard — almost no resistance. The sandpaper (water + sediment) is the same; the surface determines the rate.',
      storyConnection: 'The story says the Siang "broke through walls of stone that other rivers would have surrendered to." The gneiss of the Eastern Himalayas is among the hardest common rock on Earth\'s surface. The Siang\'s success is due to its enormous energy (steep gradient from the Tibetan Plateau) rather than the rock being weak. It is a testament to the river\'s power, not the mountain\'s frailty.',
      checkQuestion: 'Why does the Grand Canyon have flat-topped mesas and vertical cliff faces, while the Siang gorge has smooth, steep walls?',
      checkAnswer: 'Rock layering. The Grand Canyon has alternating hard and soft horizontal layers: hard layers form vertical cliffs, soft layers form gentle slopes, creating a "staircase" profile. The Siang gorge cuts through relatively uniform metamorphic rock (gneiss), which erodes at a consistent rate, creating smooth walls. The canyon\'s shape is a fingerprint of its underlying geology.',
      codeIntro: 'Compare erosion rates across rock types and model how geology shapes valley form.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Rock hardness and erosion rate comparison
rocks = [
    ('Granite/Gneiss', 6.5, 0.05, '#ef4444'),
    ('Basalt', 6.0, 0.08, '#f97316'),
    ('Sandstone', 5.5, 0.15, '#f59e0b'),
    ('Marble', 3.5, 0.3, '#22c55e'),
    ('Limestone', 3.0, 0.5, '#3b82f6'),
    ('Shale', 2.5, 1.0, '#a855f7'),
    ('Clay/Mudstone', 1.5, 2.0, '#6b7280'),
]

ax1.set_facecolor('#111827')
names = [r[0] for r in rocks]
hardness = [r[1] for r in rocks]
erosion = [r[2] for r in rocks]
colors = [r[3] for r in rocks]

ax1.scatter(hardness, erosion, c=colors, s=200, zorder=5)
for name, h, e, c in rocks:
    ax1.annotate(name, (h, e), xytext=(10, 5), textcoords='offset points',
                 color=c, fontsize=9)

# Fit power law
h_fit = np.linspace(1, 7, 100)
e_fit = 3 * h_fit**(-2)
ax1.plot(h_fit, e_fit, '--', color='gray', alpha=0.5)

ax1.set_xlabel('Mohs hardness', color='white')
ax1.set_ylabel('Relative erosion rate (mm/year)', color='white')
ax1.set_title('Rock Hardness vs Erosion Rate', color='white', fontsize=12)
ax1.set_yscale('log')
ax1.tick_params(colors='gray')

# Valley profiles in different rock types
ax2.set_facecolor('#111827')
x = np.linspace(-500, 500, 300)

rock_profiles = [
    ('Gneiss (Siang gorge)', 80, '#ef4444'),
    ('Sandstone', 55, '#f59e0b'),
    ('Limestone', 40, '#3b82f6'),
    ('Shale', 25, '#a855f7'),
]

for name, angle_deg, color in rock_profiles:
    angle = np.radians(angle_deg)
    y = np.where(np.abs(x) < 15, -300,
                  -300 + (np.abs(x) - 15) * np.tan(angle))
    y = np.minimum(y, 0)
    ax2.plot(x, y, color=color, linewidth=2, label=f'{name} ({angle_deg}°)')

ax2.fill_between(x, -350, -310, color='#3b82f6', alpha=0.2)
ax2.text(0, -330, 'River', ha='center', color='#60a5fa', fontsize=9)

ax2.set_xlabel('Distance from channel (m)', color='white')
ax2.set_ylabel('Depth (m)', color='white')
ax2.set_title('Valley Shape vs Rock Type (same depth)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Erosion rates by rock type:")
for name, h, e, _ in rocks:
    years_per_metre = 1000 / e
    print(f"  {name:<20} Mohs {h}, {e:.2f} mm/yr ({years_per_metre:.0f} years per metre)")
print()
print("The Siang carves gneiss at ~0.05 mm/yr:")
print("  1m of erosion takes ~20,000 years")
print("  100m gorge takes ~2 million years")
print("  5000m gorge takes ~100 million years")
print("  (But the gorge also deepened by tectonic uplift raising the walls)")`,
      challenge: 'Model a river crossing three rock types in sequence (sandstone → limestone → granite). How does the valley shape change at each boundary? These transitions are visible in real canyons as changes in wall angle and width.',
      successHint: 'Rock type is the hidden variable in landscape evolution. Two rivers with identical power carve different landscapes if they flow through different rocks. The geologist reads the landscape like a book — each rock type is a chapter, each erosion feature is a sentence.',
    },
    {
      title: 'The Siang-Brahmaputra system — from Tibet to the Bay of Bengal',
      concept: `The Siang/Brahmaputra is one of the world's great rivers, with a remarkable journey:

**The river's names:**
- **Yarlung Tsangpo** (Tibet): flows east along the Indus-Tsangpo suture zone at 4,000m elevation for ~1,700km
- **Siang** (Arunachal Pradesh): plunges through the Eastern Himalayas, dropping 2,500m in ~300km
- **Brahmaputra** (Assam): braids across the Assam valley for ~700km
- **Jamuna** (Bangladesh): converges with the Ganges and Meghna
- **Meghna** (Bangladesh delta): empties into the Bay of Bengal

**Key statistics:**
- Total length: ~2,900km
- Drainage area: ~580,000 km²
- Average discharge: ~20,000 m³/s (4th largest in the world)
- Sediment load: ~735 million tonnes/year (highest in the world)
- The Tsangpo gorge: deepest canyon on Earth (~5,382m at Namcha Barwa)

**Tectonic context:**
The river flows along the India-Eurasia collision zone. The sharp bend ("Great Bend") around Namcha Barwa (7,782m) is where the Indian plate is being subducted. This is one of the most tectonically active places on Earth — the river, the mountain, and the plate boundary are all interacting in a dance of erosion, uplift, and deformation.

The Brahmaputra is geologically young (15-20 Ma) but has already carved one of the most dramatic landscapes on Earth.`,
      analogy: 'The Siang-Brahmaputra journey is like a movie with four acts. Act 1 (Tibet): a calm road trip across a high plateau. Act 2 (Himalayan gorge): a heart-pounding descent through the world\'s deepest canyon. Act 3 (Assam): a leisurely spread across a wide floodplain. Act 4 (Bengal delta): dissolution into countless fingers reaching for the sea. Same river, four completely different characters.',
      storyConnection: 'The story follows the Siang from its Himalayan gorge to the Assam plains. The river\'s personality changes completely: from a violent, rock-carving torrent to a wide, braided, sediment-depositing giant. The river that carved the deepest gorge on Earth becomes the river that builds the largest delta on Earth. Destruction upstream enables creation downstream.',
      checkQuestion: 'The Yarlung Tsangpo flows east for 1,700km in Tibet, then makes a sudden U-turn (the "Great Bend") to flow south through the Himalayas. Why the sudden turn?',
      checkAnswer: 'The Eastern Syntaxis — the sharp corner where the Himalayan arc bends south. The river cannot cross the high Himalayan barrier directly, so it follows the suture zone eastward until it reaches the structural weak point where the mountain chain terminates. There, tectonic forces and the river\'s own erosion have carved a path through. The Great Bend is a tectonic feature, not a fluvial one — the river follows the geology.',
      codeIntro: 'Map the entire Siang-Brahmaputra system: elevation, gradient, width, and sediment load from source to sea.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Full river profile: Yarlung Tsangpo → Siang → Brahmaputra → Meghna
distance = np.linspace(0, 2900, 500)  # km

# Elevation profile
elevation = np.piecewise(distance,
    [distance < 1700, (distance >= 1700) & (distance < 2000),
     (distance >= 2000) & (distance < 2700), distance >= 2700],
    [lambda d: 4500 - 0.3 * d,  # Tibet: gentle slope
     lambda d: 4000 - 8 * (d - 1700),  # Gorge: extreme drop
     lambda d: 100 - 0.05 * (d - 2000),  # Assam: gentle
     lambda d: 10 - 0.01 * (d - 2700)])  # Delta: nearly flat
elevation = np.maximum(elevation, 0)

# River width
width = np.piecewise(distance,
    [distance < 1700, (distance >= 1700) & (distance < 2000),
     (distance >= 2000) & (distance < 2700), distance >= 2700],
    [500, 50, lambda d: 1000 + 10 * (d - 2000), 5000])

# Sediment concentration
sed_conc = np.piecewise(distance,
    [distance < 1700, (distance >= 1700) & (distance < 2000),
     (distance >= 2000) & (distance < 2700), distance >= 2700],
    [0.2, 2.0, lambda d: 1.5 * np.exp(-(d-2000)/500), 0.3])

fig, axes = plt.subplots(4, 1, figsize=(14, 10), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Elevation
ax = axes[0]
ax.set_facecolor('#111827')
ax.fill_between(distance, 0, elevation, color='#6b7280', alpha=0.3)
ax.plot(distance, elevation, color='white', linewidth=2)
ax.set_ylabel('Elevation (m)', color='white')
ax.set_title('The Siang-Brahmaputra: Source to Sea (2,900km)', color='white', fontsize=13)
ax.tick_params(colors='gray')

# Section labels
sections = [
    (850, 3500, 'YARLUNG TSANGPO\n(Tibet)', '#60a5fa'),
    (1850, 2500, 'SIANG\n(Gorge)', '#ef4444'),
    (2350, 500, 'BRAHMAPUTRA\n(Assam)', '#22c55e'),
    (2800, 200, 'DELTA', '#f59e0b'),
]
for x, y, label, color in sections:
    ax.text(x, y, label, ha='center', color=color, fontsize=9, fontweight='bold')

# Width
ax = axes[1]
ax.set_facecolor('#111827')
ax.plot(distance, width, color='#3b82f6', linewidth=2)
ax.fill_between(distance, width, alpha=0.15, color='#3b82f6')
ax.set_ylabel('River width (m)', color='white')
ax.set_yscale('log')
ax.tick_params(colors='gray')

# Gradient
gradient = np.abs(np.gradient(elevation, distance))
ax = axes[2]
ax.set_facecolor('#111827')
ax.plot(distance, gradient, color='#f59e0b', linewidth=2)
ax.fill_between(distance, gradient, alpha=0.15, color='#f59e0b')
ax.set_ylabel('Gradient (m/km)', color='white')
ax.set_yscale('log')
ax.tick_params(colors='gray')

# Sediment
ax = axes[3]
ax.set_facecolor('#111827')
ax.plot(distance, sed_conc, color='#ef4444', linewidth=2)
ax.fill_between(distance, sed_conc, alpha=0.15, color='#ef4444')
ax.set_ylabel('Sediment conc.\n(kg/m³)', color='white')
ax.set_xlabel('Distance from source (km)', color='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The Siang-Brahmaputra in numbers:")
print("  Tibet section:  1,700km, gentle gradient, narrow")
print("  Gorge section:    300km, extreme gradient (8m/km), narrowest")
print("  Assam section:    700km, gentle, widest (up to 15km in flood)")
print("  Delta section:    200km, nearly flat, distributary channels")
print()
print("The contrast between sections is extreme:")
print("  Gorge gradient: 8,000 mm/km")
print("  Assam gradient: 80 mm/km")
print("  Ratio: 100x difference over just 300km of river length")
print()
print("This is why the Siang gorge is the most erosive")
print("section and the Assam valley is the most depositional.")`,
      challenge: 'Plot the specific stream power along the entire river. Where is it maximum? Where is it minimum? The maximum marks the zone of most active erosion; the minimum marks where the river builds land. This is the fundamental story of the Siang-Brahmaputra.',
      successHint: 'The Siang-Brahmaputra system tells the complete story of geological erosion: from Tibetan plateau to Himalayan gorge to Assam floodplain to Bengal delta. Destruction and creation are two acts of the same play, performed by the same river. Level 2 takes you into the quantitative tools of geomorphology: erosion rate equations, landscape evolution models, and the tectonic forces that drive it all.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Geological Erosion</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for geological erosion simulations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
