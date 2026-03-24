import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function CloudedLeopardLevel1() {
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
      title: 'Big cat biology — what makes a cat a cat?',
      concept: `The clouded leopard is one of the most mysterious cats in the world. Found in the forests of Assam, Meghalaya, and Arunachal Pradesh, it bridges the gap between big cats and small cats.

**What makes felids (cats) unique:**
- **Retractable claws**: kept sharp by retracting into sheaths (except cheetahs)
- **Forward-facing eyes**: binocular vision for judging distance (predator feature)
- **Flexible spine**: allows explosive pouncing and mid-air turning
- **Specialized teeth**: canines for killing, carnassials for shearing meat
- **Whiskers**: exactly as wide as the body — used to judge if they can fit through gaps

**Clouded leopard specialties:**
- Longest canine teeth relative to body size of ANY living cat (saber-tooth proportions!)
- Can climb DOWN trees headfirst (rotating ankle joints — unique among cats)
- Can hang from branches by hind feet
- Weighs only 11-23 kg but has the bite force of a much larger cat

**Classification mystery:** Not a true leopard, not a "big cat" (can't roar), not a small cat. It sits on its own evolutionary branch — diverged ~9 million years ago.`,
      analogy: 'The cat family is like a tech company with different product lines. Lions and tigers are the flagship devices — big, powerful, headline-grabbing. House cats are the budget line — small, efficient, everywhere. The clouded leopard is the premium niche product — specialized, rare, with features no other model has (like those rotating ankles and saber-tooth canines).',
      storyConnection: 'In the story, the boy discovers that the clouded leopard is unlike any animal he has seen — it climbs trees like a monkey, has spots like clouds, and teeth like an ancient predator. The Assamese forests of Manas and Nameri are among the last strongholds of this extraordinary cat. To befriend it, the boy first had to understand it.',
      checkQuestion: 'The clouded leopard can rotate its ankles to climb down trees headfirst. No other cat can do this. What advantage does this give in the forest?',
      checkAnswer: 'Most cats are stuck going down trees backwards (tail first), which is slow and awkward. Headfirst descent lets the clouded leopard chase prey through the canopy and escape quickly downward. In dense tropical forests where much of life happens in the trees, this single adaptation opens an entire ecological niche that no other big cat can exploit.',
      codeIntro: 'Compare key biological traits across the cat family.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cat family comparison
cats = {
    'Clouded leopard': {'mass': 17, 'canine': 4.5, 'bite': 130, 'climb': 10, 'speed': 12, 'color': '#f59e0b'},
    'Leopard': {'mass': 60, 'canine': 3.0, 'bite': 300, 'climb': 8, 'speed': 16, 'color': '#8b5cf6'},
    'Tiger': {'mass': 220, 'canine': 3.5, 'bite': 1050, 'climb': 3, 'speed': 18, 'color': '#ef4444'},
    'House cat': {'mass': 4, 'canine': 1.0, 'bite': 20, 'climb': 7, 'speed': 13, 'color': '#6b7280'},
    'Cheetah': {'mass': 50, 'canine': 2.0, 'bite': 170, 'climb': 1, 'speed': 33, 'color': '#22c55e'},
    'Lion': {'mass': 190, 'canine': 3.2, 'bite': 650, 'climb': 2, 'speed': 22, 'color': '#3b82f6'},
}

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Canine length relative to body size
ax = axes[0, 0]
ax.set_facecolor('#111827')
names = list(cats.keys())
relative_canine = [cats[n]['canine'] / (cats[n]['mass'] ** 0.33) for n in names]
colors = [cats[n]['color'] for n in names]
bars = ax.bar(names, relative_canine, color=colors)
ax.set_ylabel('Canine length / body size^(1/3)', color='white')
ax.set_title('Relative Canine Size (Clouded Leopard wins)', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.tick_params(axis='x', rotation=25)

# Mass vs bite force (allometric scaling)
ax = axes[0, 1]
ax.set_facecolor('#111827')
for name, props in cats.items():
    ax.scatter(props['mass'], props['bite'], s=100, color=props['color'],
               edgecolors='white', linewidth=0.5)
    ax.annotate(name, xy=(props['mass'], props['bite']), xytext=(5, 5),
                textcoords='offset points', color=props['color'], fontsize=8)

# Expected scaling: bite ≈ k * mass^0.7
masses = np.linspace(1, 250, 100)
expected_bite = 5 * masses**0.75
ax.plot(masses, expected_bite, '--', color='gray', alpha=0.5, label='Expected scaling')
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Bite force (N)', color='white')
ax.set_title('Mass vs Bite Force', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Radar chart: clouded leopard profile
ax = axes[1, 0]
ax.remove()
ax = fig.add_subplot(2, 2, 3, polar=True)
ax.set_facecolor('#111827')
categories = ['Speed', 'Climbing', 'Bite force', 'Stealth', 'Agility']
N = len(categories)
angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

cl_values = [5, 10, 7, 9, 9]
tiger_values = [8, 3, 10, 5, 5]
for vals, name, color in [(cl_values, 'Clouded leopard', '#f59e0b'), (tiger_values, 'Tiger', '#ef4444')]:
    vals = vals + vals[:1]
    ax.plot(angles, vals, 'o-', linewidth=2, color=color, label=name)
    ax.fill(angles, vals, alpha=0.1, color=color)

ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories, color='white', fontsize=8)
ax.set_ylim(0, 10)
ax.set_yticklabels([], color='gray')
ax.set_title('Ability Profile', color='white', fontsize=11, pad=15)
ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1), facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

# Evolutionary timeline
ax = axes[1, 1]
ax.set_facecolor('#111827')
divergences = [
    ('Common ancestor', 11, '#6b7280'),
    ('Clouded leopard', 9, '#f59e0b'),
    ('Snow leopard', 5, '#3b82f6'),
    ('Tiger', 3.5, '#ef4444'),
    ('Leopard', 2.5, '#8b5cf6'),
    ('Lion', 2, '#ec4899'),
    ('Cheetah', 6.5, '#22c55e'),
]
for name, mya, color in divergences:
    ax.barh(name, mya, color=color, alpha=0.7)
ax.set_xlabel('Divergence time (million years ago)', color='white')
ax.set_title('Cat Family Timeline', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Clouded leopard: the ultimate tree cat")
print(f"  Mass: 11-23 kg (between house cat and leopard)")
print(f"  Canine teeth: proportionally longest of any living cat")
print(f"  Climbing: only cat that can descend headfirst")
print(f"  Range: SE Asia + NE India (Assam, Meghalaya, Arunachal)")`,
      challenge: 'The extinct saber-toothed cat (Smilodon) had canines 28cm long at ~200 kg body mass. Add it to the canine-to-body-size chart. How does the clouded leopard compare to this ancient predator?',
      successHint: 'Understanding a species\' biology is the first step in conserving it. You can\'t protect an animal if you don\'t know what it needs — and the clouded leopard needs tall, dense, connected forest. No forest, no clouded leopard.',
    },
    {
      title: 'GPS tracking technology — following invisible cats',
      concept: `Clouded leopards are so secretive that for decades, scientists had almost no data on their behavior. **GPS tracking** changed everything.

**How GPS collars work:**
1. Collar receives signals from 4+ GPS satellites
2. Each satellite sends its position and exact time
3. Collar calculates distance to each satellite (using signal travel time)
4. **Trilateration**: 3 distances pinpoint a 2D location; 4+ give 3D + accuracy
5. Location stored in memory or transmitted via satellite/cellular uplink

**Accuracy:** 5-15 meters in open sky; 30-100m under dense canopy (signals bounce)

**Data collected:**
- Position (latitude, longitude, altitude)
- Time stamp
- Temperature (from collar sensor)
- Activity index (accelerometer detects movement)

**Fix schedule:** Collars take GPS "fixes" at intervals — every 1 hour, 4 hours, or custom schedules. More fixes = more data but shorter battery life. A clouded leopard collar might last 1-2 years on a 4-hour schedule.

**Challenges in NE India:**
- Dense canopy reduces GPS accuracy
- Steep terrain blocks satellite signals
- Animals may damage collars climbing through dense vegetation`,
      analogy: 'GPS tracking is like playing Marco Polo with satellites. You shout "Marco!" (the collar listens for satellite signals). Four friends shout back "Polo!" from known positions. By timing how long each "Polo" takes to arrive, you calculate your exact position. The collar does this every few hours, creating a breadcrumb trail of the animal\'s life.',
      storyConnection: 'The boy in the story followed the clouded leopard by watching for paw prints and listening for calls. Modern wildlife biologists do the same thing, but with GPS — invisible "paw prints" recorded by satellites. In the forests of Manas National Park, GPS collars have revealed that clouded leopards travel 3-5 km per night, mostly through the canopy.',
      checkQuestion: 'A GPS collar transmits a fix every 4 hours. The clouded leopard walks 500m in those 4 hours but in a complex zigzag. The GPS shows it moved only 200m (straight-line distance). What information is lost?',
      checkAnswer: 'The actual path, speed, and behavior between fixes. The 500m of actual movement is compressed to 200m of straight-line displacement. The cat may have hunted, climbed trees, circled prey, or rested — all invisible. This is the "step length" problem in movement ecology. Higher fix rates (every 15 min instead of 4 hours) reveal more behavior but drain the battery faster.',
      codeIntro: 'Simulate GPS tracking data for a clouded leopard.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 30 days of clouded leopard GPS data
# Fixes every 4 hours = 6 per day = 180 fixes in 30 days
n_fixes = 180

# Clouded leopard movement model
# Nocturnal: moves at night (6pm-6am), rests during day
# Home range: roughly 30-40 sq km

# Start position
x, y = [0.0], [0.0]
hours = np.arange(n_fixes) * 4  # hours since start

for i in range(1, n_fixes):
    hour_of_day = (hours[i] % 24)

    # Nocturnal activity pattern
    if 18 <= hour_of_day or hour_of_day < 6:  # nighttime
        step_size = np.random.exponential(0.3)  # km per 4-hour fix
        angle = np.random.uniform(0, 2 * np.pi)
        # Bias toward home range center (correlated random walk)
        center_pull = 0.05
        dx = step_size * np.cos(angle) - center_pull * x[-1]
        dy = step_size * np.sin(angle) - center_pull * y[-1]
    else:  # daytime (resting)
        dx = np.random.normal(0, 0.02)  # barely moves
        dy = np.random.normal(0, 0.02)

    # Add GPS error
    gps_error = np.random.normal(0, 0.03, 2)  # ~30m error
    x.append(x[-1] + dx + gps_error[0])
    y.append(y[-1] + dy + gps_error[1])

x, y = np.array(x), np.array(y)

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# GPS track map
ax = axes[0, 0]
ax.set_facecolor('#111827')
# Color by time of day
for i in range(1, len(x)):
    hour = hours[i] % 24
    color = '#f59e0b' if (18 <= hour or hour < 6) else '#3b82f6'
    ax.plot([x[i-1], x[i]], [y[i-1], y[i]], color=color, linewidth=1, alpha=0.6)
ax.scatter(x[0], y[0], s=100, color='#22c55e', zorder=5, edgecolors='white', label='Start')
ax.scatter(x[-1], y[-1], s=100, color='#ef4444', zorder=5, edgecolors='white', label='End')
ax.scatter([], [], color='#f59e0b', label='Night moves')
ax.scatter([], [], color='#3b82f6', label='Day (resting)')
ax.set_xlabel('Easting (km)', color='white')
ax.set_ylabel('Northing (km)', color='white')
ax.set_title('30-Day GPS Track', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# Step length distribution
ax = axes[0, 1]
ax.set_facecolor('#111827')
step_lengths = np.sqrt(np.diff(x)**2 + np.diff(y)**2)
night_steps = step_lengths[[(hours[i+1] % 24 >= 18 or hours[i+1] % 24 < 6) for i in range(len(step_lengths))]]
day_steps = step_lengths[[not (hours[i+1] % 24 >= 18 or hours[i+1] % 24 < 6) for i in range(len(step_lengths))]]

ax.hist(night_steps, bins=20, alpha=0.7, color='#f59e0b', label=f'Night (mean={np.mean(night_steps):.2f}km)', density=True)
ax.hist(day_steps, bins=20, alpha=0.7, color='#3b82f6', label=f'Day (mean={np.mean(day_steps):.2f}km)', density=True)
ax.set_xlabel('Step length (km per 4h)', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Movement Distance: Night vs Day', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Activity pattern (24-hour cycle)
ax = axes[1, 0]
ax.set_facecolor('#111827')
hourly_movement = {}
for i in range(len(step_lengths)):
    h = int(hours[i+1] % 24)
    if h not in hourly_movement:
        hourly_movement[h] = []
    hourly_movement[h].append(step_lengths[i])

hour_means = {h: np.mean(v) for h, v in hourly_movement.items()}
sorted_hours = sorted(hour_means.keys())
ax.bar(sorted_hours, [hour_means[h] for h in sorted_hours],
       color=['#f59e0b' if (h >= 18 or h < 6) else '#3b82f6' for h in sorted_hours])
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Mean movement (km)', color='white')
ax.set_title('24-Hour Activity Pattern (Nocturnal)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Home range estimate (MCP)
ax = axes[1, 1]
ax.set_facecolor('#111827')
from matplotlib.patches import Polygon as MplPolygon
# Simple convex hull for home range
points = np.column_stack([x, y])
# Compute convex hull manually (sort by angle from centroid)
cx, cy = np.mean(x), np.mean(y)
angles = np.arctan2(y - cy, x - cx)
hull_idx = np.argsort(angles)
# Get the outer points
from_center = np.sqrt((x - cx)**2 + (y - cy)**2)
# Use top 95% of points for 95% MCP
threshold = np.percentile(from_center, 95)
core_mask = from_center <= threshold
ax.scatter(x[core_mask], y[core_mask], s=10, color='#22c55e', alpha=0.5, label='95% MCP points')
ax.scatter(x[~core_mask], y[~core_mask], s=10, color='#ef4444', alpha=0.5, label='Outliers (5%)')

# Estimate area
x_range = np.max(x[core_mask]) - np.min(x[core_mask])
y_range = np.max(y[core_mask]) - np.min(y[core_mask])
area_est = np.pi * (x_range/2) * (y_range/2)  # ellipse approximation
ax.set_xlabel('Easting (km)', color='white')
ax.set_ylabel('Northing (km)', color='white')
ax.set_title(f'Home Range Estimate (~{area_est:.1f} km\\u00b2)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"30-day GPS tracking summary:")
print(f"  Total fixes: {n_fixes}")
print(f"  Total distance: {np.sum(step_lengths):.1f} km")
print(f"  Night movement: {np.sum(night_steps):.1f} km ({np.sum(night_steps)/np.sum(step_lengths)*100:.0f}%)")
print(f"  Day movement: {np.sum(day_steps):.1f} km")
print(f"  Estimated home range: ~{area_est:.1f} km\\u00b2")`,
      challenge: 'Change the fix interval from 4 hours to 1 hour. How does the total tracked distance change? This demonstrates the "path length depends on measurement scale" problem in movement ecology.',
      successHint: 'GPS tracking has revolutionized wildlife biology. Before GPS, scientists relied on rare visual sightings. Now a single collar generates thousands of data points, revealing behaviors no human could observe directly.',
    },
    {
      title: 'Home range analysis — understanding animal territories',
      concept: `Every clouded leopard has a **home range** — the area it uses regularly for food, shelter, and mating. Analyzing home ranges answers critical conservation questions:

**How to estimate home range:**
1. **Minimum Convex Polygon (MCP)**: smallest polygon enclosing all GPS points. Simple but overestimates area.
2. **Kernel Density Estimation (KDE)**: creates a probability surface showing where the animal spends most time. More accurate.
3. **Brownian Bridge**: accounts for movement between GPS points (the animal doesn't teleport!).

**Clouded leopard home ranges:**
- Males: 30-50 km² (overlap with multiple females)
- Females: 15-30 km² (often exclusive from other females)
- Both sexes: mostly nocturnal, high canopy use

**What home ranges tell us:**
- **Size** → how much habitat one animal needs
- **Overlap** → social structure (territorial? tolerant?)
- **Core areas** → where to focus protection
- **Seasonal shifts** → habitat requirements change with prey availability
- **Total habitat needed** → if home range = 40 km², and you need 500 animals, you need at least 20,000 km² of connected forest`,
      analogy: 'A home range is like your personal "life map" over a year. Your home is the core. Your school/work is a secondary core. Grocery stores, friends\' houses, parks are regular visits. The polygon enclosing all these places is your home range. Some areas you visit daily (core), others monthly (periphery). A clouded leopard\'s home range works exactly the same way.',
      storyConnection: 'The boy in the story learned the clouded leopard\'s patterns — where it slept during the day (a large sal tree), where it hunted at night (near a stream), where it marked territory (rocky outcrops). He was intuitively mapping its home range. Modern researchers do the same with GPS data and computer algorithms.',
      checkQuestion: 'Two male clouded leopards have overlapping home ranges. Does this mean they share the territory peacefully?',
      checkAnswer: 'Not necessarily. Home range overlap can mean: (1) temporal avoidance — they use the same area but at different times, (2) the overlap area is low-quality (neither defends it strongly), or (3) they truly tolerate each other (rare in male cats). GPS data with timestamps can distinguish these — if their visits to the overlap zone never coincide, it is temporal avoidance.',
      codeIntro: 'Calculate and visualize home ranges using different methods.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate realistic GPS data for two clouded leopards
def generate_leopard_data(center, n_points=200, range_size=3):
    # Bimodal: core area (60% of time) + foraging area (40%)
    n_core = int(n_points * 0.6)
    n_forage = n_points - n_core
    core = np.random.normal(center, range_size * 0.3, (n_core, 2))
    forage = np.random.normal(center + np.random.uniform(-2, 2, 2), range_size * 0.6, (n_forage, 2))
    return np.vstack([core, forage])

leopard_A = generate_leopard_data([0, 0], 200, 3)
leopard_B = generate_leopard_data([4, 2], 200, 3.5)

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. MCP (Minimum Convex Polygon)
ax = axes[0, 0]
ax.set_facecolor('#111827')
for data, name, color in [(leopard_A, 'Leopard A', '#f59e0b'), (leopard_B, 'Leopard B', '#3b82f6')]:
    ax.scatter(data[:, 0], data[:, 1], s=10, color=color, alpha=0.4, label=name)
    # Simple convex hull
    cx, cy = np.mean(data, axis=0)
    angles = np.arctan2(data[:, 1] - cy, data[:, 0] - cx)
    sorted_idx = np.argsort(angles)
    # Use percentile distance for 95% MCP
    dists = np.sqrt((data[:, 0] - cx)**2 + (data[:, 1] - cy)**2)
    mask = dists <= np.percentile(dists, 95)
    hull_pts = data[mask]
    hull_angles = np.arctan2(hull_pts[:, 1] - cy, hull_pts[:, 0] - cx)
    hull_sorted = hull_pts[np.argsort(hull_angles)]
    hull_sorted = np.vstack([hull_sorted, hull_sorted[0]])
    ax.plot(hull_sorted[:, 0], hull_sorted[:, 1], color=color, linewidth=1.5, alpha=0.7)

ax.set_title('95% Minimum Convex Polygon', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# 2. Kernel Density Estimation
ax = axes[0, 1]
ax.set_facecolor('#111827')
# Simple 2D histogram as KDE approximation
x_grid = np.linspace(-8, 10, 100)
y_grid = np.linspace(-6, 8, 100)
X, Y = np.meshgrid(x_grid, y_grid)

for data, color, cmap in [(leopard_A, '#f59e0b', 'YlOrRd'), (leopard_B, '#3b82f6', 'Blues')]:
    # Simple kernel density
    density = np.zeros_like(X)
    bandwidth = 1.0
    for pt in data:
        density += np.exp(-((X - pt[0])**2 + (Y - pt[1])**2) / (2 * bandwidth**2))
    density /= len(data)
    # Draw 50% and 95% contours
    levels = [np.percentile(density[density > 0], 50), np.percentile(density[density > 0], 95)]
    ax.contour(X, Y, density, levels=sorted(levels), colors=[color], linewidths=[1.5, 2.5], alpha=0.7)
    ax.contourf(X, Y, density, levels=[levels[0], density.max()], colors=[color], alpha=0.15)

ax.set_title('Kernel Density (50% & 95% contours)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# 3. Home range size vs body mass
ax = axes[1, 0]
ax.set_facecolor('#111827')
cats_hr = {
    'House cat': (4, 0.5),
    'Clouded leopard': (17, 35),
    'Leopard': (60, 50),
    'Tiger': (220, 300),
    'Lion': (190, 250),
    'Cheetah': (50, 150),
}
masses = [v[0] for v in cats_hr.values()]
hrs = [v[1] for v in cats_hr.values()]
ax.scatter(masses, hrs, s=100, color='#f59e0b', edgecolors='white')
for name, (m, hr) in cats_hr.items():
    ax.annotate(name, xy=(m, hr), xytext=(5, 5), textcoords='offset points',
                color='white', fontsize=9)
# Allometric scaling: HR ≈ k * mass^1.0
m_line = np.linspace(1, 250, 100)
ax.plot(m_line, 1.5 * m_line**0.9, '--', color='gray', alpha=0.5, label='Expected scaling')
ax.set_xlabel('Body mass (kg)', color='white')
ax.set_ylabel('Home range (km\\u00b2)', color='white')
ax.set_title('Home Range Scales with Body Size', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Conservation: how much forest needed?
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Required forest area for viable population
home_range = 35  # km² per clouded leopard
overlap_factor = 0.3  # 30% overlap between individuals
effective_area_per_cat = home_range * (1 - overlap_factor)
target_pops = [50, 100, 250, 500, 1000]
forest_needed = [n * effective_area_per_cat for n in target_pops]

bars = ax.bar([str(n) for n in target_pops], forest_needed, color='#22c55e', alpha=0.7)
ax.set_xlabel('Target population', color='white')
ax.set_ylabel('Forest needed (km\\u00b2)', color='white')
ax.set_title('How Much Forest Do We Need?', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, area in zip(bars, forest_needed):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 200,
            f'{area:,.0f} km\\u00b2', ha='center', color='white', fontsize=9)

# Reference: Manas NP = 950 km²
ax.axhline(950, color='#ef4444', linestyle='--', label='Manas NP area (950 km\\u00b2)')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Conservation math:")
print(f"  Home range: ~{home_range} km\\u00b2 per clouded leopard")
print(f"  Viable population: 500+ individuals")
print(f"  Forest needed: ~{500 * effective_area_per_cat:,.0f} km\\u00b2")
print(f"  Manas NP: 950 km\\u00b2 (enough for ~{950/effective_area_per_cat:.0f} leopards)")
print(f"  Need multiple connected parks for a viable population")`,
      challenge: 'If deforestation reduces home range quality by 30% (animals need 30% more area), recalculate the forest needed for 500 clouded leopards. How does habitat degradation compare to habitat loss?',
      successHint: 'Home range analysis translates biology into conservation action: how much land to protect, where to place corridors, how many animals a park can support. It is the bridge between animal behavior and land use planning.',
    },
    {
      title: 'Camera traps — photographing the invisible',
      concept: `Most wildlife in dense forests is never seen by humans. **Camera traps** — motion-triggered cameras left in the forest — are the eyes that watch when we're not there.

**How camera traps work:**
1. **Passive infrared (PIR) sensor** detects body heat moving across the sensor field
2. When triggered, the camera takes a burst of photos or short video
3. **Infrared flash** (invisible to animals) illuminates nighttime shots
4. Images stored on SD cards (or transmitted wirelessly in advanced models)
5. Scientists collect data every 1-4 weeks

**What camera traps reveal:**
- **Species inventory**: what animals are present
- **Activity patterns**: when each species is active (day, night, twilight)
- **Relative abundance**: more photos = more common (roughly)
- **Individual identification**: unique coat patterns (especially cats!)
- **Behavior**: hunting, mating, territorial marking

**Clouded leopard camera trapping:**
- First camera trap images of wild clouded leopards in NE India: early 2000s
- Individual identification using cloud-shaped spot patterns (each is unique, like fingerprints)
- Camera traps revealed clouded leopards are far more common than thought — just extremely shy`,
      analogy: 'Camera traps are like security cameras for the forest. Instead of catching shoplifters, they catch leopards. The motion sensor is the trigger, the infrared flash is the silent alarm, and the SD card is the security footage. After weeks of watching, you review the footage and discover who visited, when, and how often.',
      storyConnection: 'The boy in the story was patient — sitting quietly for hours until the clouded leopard appeared. A camera trap is infinitely more patient. It watches 24/7 for months, never blinks, never sleeps. In the forests near Manas, camera traps have captured clouded leopards doing things no human has ever witnessed: climbing headfirst down trees, carrying prey in the canopy.',
      checkQuestion: 'A camera trap photographs 20 different clouded leopards in a 100 km² study area over 6 months. Can we say the population density is 20 per 100 km²?',
      checkAnswer: 'Not directly. Camera traps have a "detection probability" — they don\'t catch every animal every time. If each camera detects a leopard with 30% probability per visit, the true population could be much higher. Statistical models (capture-recapture analysis) account for detection probability to estimate true abundance. The 20 observed could represent 50-70 actual individuals.',
      codeIntro: 'Simulate a camera trap study and analyze detection patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate camera trap study
n_cameras = 25
n_leopards = 40  # true population
study_days = 180  # 6 months
detection_prob = 0.02  # probability of detecting a passing leopard per camera per day

# Camera positions in a grid
cam_x = np.repeat(np.linspace(0, 10, 5), 5)
cam_y = np.tile(np.linspace(0, 10, 5), 5)

# Leopard home range centers
leo_x = np.random.uniform(0, 10, n_leopards)
leo_y = np.random.uniform(0, 10, n_leopards)
# Each leopard has unique pattern ID
leo_ids = [f'CL{i+1:02d}' for i in range(n_leopards)]

# Simulate detections
detections = []  # (day, camera_id, leopard_id)
for day in range(study_days):
    for cam_id in range(n_cameras):
        for leo_id in range(n_leopards):
            # Detection depends on distance from camera
            dist = np.sqrt((cam_x[cam_id] - leo_x[leo_id])**2 + (cam_y[cam_id] - leo_y[leo_id])**2)
            # Detection probability decreases with distance
            p = detection_prob * np.exp(-dist**2 / 8)
            if np.random.random() < p:
                detections.append((day, cam_id, leo_id))

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Camera and detection map
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(cam_x, cam_y, s=100, marker='s', color='#ef4444', edgecolors='white',
           zorder=5, label='Cameras')
ax.scatter(leo_x, leo_y, s=50, marker='o', color='#f59e0b', alpha=0.5,
           edgecolors='none', label='Leopard centers')

# Draw detection lines
for day, cam, leo in detections[:100]:  # show first 100 detections
    ax.plot([cam_x[cam], leo_x[leo]], [cam_y[cam], leo_y[leo]],
            color='#22c55e', alpha=0.05, linewidth=0.5)

ax.set_xlabel('km', color='white')
ax.set_ylabel('km', color='white')
ax.set_title(f'Camera Trap Array ({len(detections)} detections)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# Discovery curve: new individuals over time
ax = axes[0, 1]
ax.set_facecolor('#111827')
seen = set()
discovery = []
for day in range(study_days):
    day_detections = [(d, c, l) for d, c, l in detections if d == day]
    for _, _, leo in day_detections:
        seen.add(leo)
    discovery.append(len(seen))

ax.plot(range(study_days), discovery, color='#22c55e', linewidth=2)
ax.axhline(n_leopards, color='#f59e0b', linestyle='--', label=f'True population ({n_leopards})')
ax.set_xlabel('Study day', color='white')
ax.set_ylabel('Unique individuals detected', color='white')
ax.set_title('Species Accumulation Curve', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Capture frequency histogram
ax = axes[1, 0]
ax.set_facecolor('#111827')
capture_counts = {}
for _, _, leo in detections:
    capture_counts[leo] = capture_counts.get(leo, 0) + 1

all_counts = [capture_counts.get(i, 0) for i in range(n_leopards)]
ax.hist(all_counts, bins=range(max(all_counts)+2), color='#3b82f6', alpha=0.7, edgecolor='none')
ax.set_xlabel('Number of captures', color='white')
ax.set_ylabel('Number of leopards', color='white')
ax.set_title('Capture Frequency Distribution', color='white', fontsize=11)
ax.tick_params(colors='gray')

never_detected = sum(1 for c in all_counts if c == 0)
ax.text(0.95, 0.95, f'{never_detected} never detected!',
        transform=ax.transAxes, ha='right', va='top', color='#ef4444', fontsize=11)

# Activity pattern (time of day)
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Simulate time of detection (clouded leopards are crepuscular/nocturnal)
detection_hours = []
for _ in detections:
    # Bimodal: peaks at dawn (5-7am) and dusk (6-8pm)
    if np.random.random() < 0.4:
        h = np.random.normal(6, 1.5) % 24  # dawn peak
    elif np.random.random() < 0.7:
        h = np.random.normal(19, 1.5) % 24  # dusk peak
    else:
        h = np.random.normal(0, 3) % 24  # midnight activity
    detection_hours.append(h)

ax.hist(detection_hours, bins=24, range=(0, 24), color='#f59e0b', alpha=0.7, edgecolor='none')
ax.set_xlabel('Hour of day', color='white')
ax.set_ylabel('Number of detections', color='white')
ax.set_title('Activity Pattern (Crepuscular/Nocturnal)', color='white', fontsize=11)
ax.axvspan(6, 18, alpha=0.1, color='yellow', label='Daylight')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Camera trap study results:")
print(f"  True population: {n_leopards}")
print(f"  Individuals detected: {len(seen)}")
print(f"  Detection rate: {len(seen)/n_leopards*100:.0f}%")
print(f"  Never detected: {never_detected} ({never_detected/n_leopards*100:.0f}%)")
print(f"  Total photo captures: {len(detections)}")
print(f"  This is why raw counts underestimate population!")`,
      challenge: 'Double the number of cameras to 50. How does this change the number of individuals detected and the accuracy of the population estimate? What about doubling the study duration instead?',
      successHint: 'Camera traps are the workhorse of modern wildlife monitoring. The combination of individual identification (from unique patterns) and statistical models (capture-recapture) allows scientists to estimate populations of species too shy to count directly.',
    },
    {
      title: 'Population estimation — counting the uncountable',
      concept: `You can't count every clouded leopard in a forest. But you CAN estimate the population using **capture-recapture statistics**.

**The basic idea (Lincoln-Petersen method):**
1. Capture and mark N₁ animals (or identify from camera traps)
2. Release them
3. Later, capture N₂ animals
4. Count how many of N₂ are already marked (m)
5. Estimated population: **N̂ = N₁ × N₂ / m**

**Why this works:**
If you marked 10 out of an unknown population, and later catch 20 animals of which 5 are marked, then your marked fraction in the second sample (5/20 = 25%) should reflect the marked fraction in the total population. So 10/N = 25%, giving N = 40.

**Advanced methods:**
- **MARK** models: handle varying detection probability
- **Spatially Explicit Capture-Recapture (SECR)**: accounts for animal locations
- **Occupancy models**: estimate probability of presence in each area
- **N-mixture models**: for when you can't identify individuals

**For clouded leopards:** SECR with camera trap data is the gold standard. Each unique coat pattern is a "recapture." Recent estimates suggest 5-10 per 100 km² in good habitat in NE India.`,
      analogy: 'Capture-recapture is like estimating how many fish are in a pond. You catch 10, paint them red, release them. Next day you catch 20 — 2 are red. So the "red ratio" in your catch (2/20 = 10%) should match the "red ratio" in the pond (10/N = 10%), giving N = 100. The marked animals are like tracers injected into the population.',
      storyConnection: 'The boy learned to recognize individual clouded leopards by their unique cloud-shaped spot patterns. This is exactly what scientists do — each camera trap photo is examined to identify individuals. The pattern on a clouded leopard\'s coat is as unique as a human fingerprint. The boy was doing capture-recapture before scientists gave it a name.',
      checkQuestion: 'You identify 15 individual clouded leopards from camera traps in month 1. In month 2, you identify 18 individuals, of which 8 were already seen in month 1. What is the estimated population?',
      checkAnswer: 'N̂ = N₁ × N₂ / m = 15 × 18 / 8 = 33.75, rounded to ~34 clouded leopards. This assumes equal detection probability (every leopard is equally likely to be photographed), which is rarely true. Some are camera-shy, some live near cameras. Advanced models like SECR correct for this bias.',
      codeIntro: 'Implement capture-recapture population estimation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Lincoln-Petersen capture-recapture simulation
true_population = 50
n_simulations = 1000

def lincoln_petersen(N_true, n1, p_detect):
    """Simulate one capture-recapture experiment."""
    # Session 1: capture n1 animals
    captured1 = set(np.random.choice(N_true, n1, replace=False))

    # Session 2: each animal has p_detect chance of being captured
    captured2 = set()
    for i in range(N_true):
        if np.random.random() < p_detect:
            captured2.add(i)

    n2 = len(captured2)
    m = len(captured1 & captured2)  # recaptures

    if m == 0:
        return None  # can't estimate

    N_hat = n1 * n2 / m  # Lincoln-Petersen estimate
    return N_hat

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Distribution of estimates
ax = axes[0, 0]
ax.set_facecolor('#111827')
estimates = []
for _ in range(n_simulations):
    est = lincoln_petersen(true_population, 15, 0.3)
    if est is not None:
        estimates.append(est)

ax.hist(estimates, bins=40, color='#22c55e', alpha=0.7, edgecolor='none', density=True)
ax.axvline(true_population, color='#ef4444', linewidth=2, linestyle='--', label=f'True N = {true_population}')
ax.axvline(np.mean(estimates), color='#f59e0b', linewidth=2, label=f'Mean estimate = {np.mean(estimates):.1f}')
ax.set_xlabel('Estimated population', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Lincoln-Petersen Estimates (1000 trials)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 2. Effect of sample size on accuracy
ax = axes[0, 1]
ax.set_facecolor('#111827')
sample_sizes = range(5, 40, 2)
biases = []
variances = []

for n1 in sample_sizes:
    ests = []
    for _ in range(500):
        est = lincoln_petersen(true_population, n1, 0.3)
        if est is not None:
            ests.append(est)
    biases.append(np.mean(ests) - true_population)
    variances.append(np.std(ests))

ax.plot(list(sample_sizes), biases, color='#ef4444', linewidth=2, label='Bias')
ax.plot(list(sample_sizes), variances, color='#3b82f6', linewidth=2, label='Std dev')
ax.axhline(0, color='gray', linestyle=':', alpha=0.3)
ax.set_xlabel('Initial capture size (n1)', color='white')
ax.set_ylabel('Value', color='white')
ax.set_title('Accuracy vs Sample Size', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 3. Effect of detection probability
ax = axes[1, 0]
ax.set_facecolor('#111827')
detect_probs = np.linspace(0.05, 0.8, 20)
mean_ests = []
ci_low = []
ci_high = []

for p in detect_probs:
    ests = []
    for _ in range(500):
        est = lincoln_petersen(true_population, 15, p)
        if est is not None:
            ests.append(est)
    if len(ests) > 10:
        mean_ests.append(np.mean(ests))
        ci_low.append(np.percentile(ests, 5))
        ci_high.append(np.percentile(ests, 95))
    else:
        mean_ests.append(np.nan)
        ci_low.append(np.nan)
        ci_high.append(np.nan)

ax.plot(detect_probs, mean_ests, color='#22c55e', linewidth=2, label='Mean estimate')
ax.fill_between(detect_probs, ci_low, ci_high, alpha=0.2, color='#22c55e', label='90% CI')
ax.axhline(true_population, color='#ef4444', linestyle='--', label=f'True N = {true_population}')
ax.set_xlabel('Detection probability', color='white')
ax.set_ylabel('Estimated population', color='white')
ax.set_title('Detection Probability Matters!', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Multi-session improvement
ax = axes[1, 1]
ax.set_facecolor('#111827')
n_sessions_range = range(2, 12)
precision = []

for n_sess in n_sessions_range:
    ests = []
    for _ in range(200):
        # Multiple sessions, combine estimates
        session_ests = []
        for sess in range(n_sess):
            est = lincoln_petersen(true_population, 10, 0.25)
            if est is not None:
                session_ests.append(est)
        if session_ests:
            ests.append(np.median(session_ests))  # median of multiple sessions
    if ests:
        precision.append(np.std(ests))

ax.plot(list(n_sessions_range)[:len(precision)], precision, 'o-', color='#8b5cf6', linewidth=2)
ax.set_xlabel('Number of sampling sessions', color='white')
ax.set_ylabel('Estimate std dev (precision)', color='white')
ax.set_title('More Sessions = More Precise', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Population estimation takeaways:")
print(f"  True population: {true_population}")
print(f"  Mean L-P estimate: {np.mean(estimates):.1f} (bias: {np.mean(estimates)-true_population:+.1f})")
print(f"  90% of estimates fall between {np.percentile(estimates,5):.0f} and {np.percentile(estimates,95):.0f}")
print()
print("  To improve estimates:")
print("  1. Increase initial capture/identification effort")
print("  2. Increase detection probability (more cameras, better placement)")
print("  3. Use multiple sampling sessions")
print("  4. Use advanced models (SECR) that account for spatial variation")`,
      challenge: 'Implement Chapman\'s corrected estimator: N̂ = (n1+1)(n2+1)/(m+1) - 1. It reduces bias when m is small. Compare it to the basic Lincoln-Petersen estimate across 1000 simulations.',
      successHint: 'Every wildlife population number you read in a news article — "500 tigers in India" or "10,000 red pandas" — came from statistical models like these. The math of counting the uncountable is one of conservation\'s most important tools.',
    },
    {
      title: 'Community conservation — people and leopards together',
      concept: `The clouded leopard's survival depends not just on biology and technology, but on **people**. Community conservation recognizes that wildlife protection must work for local communities, not against them.

**Key principles:**
1. **Local benefit**: communities must gain from conservation (ecotourism revenue, sustainable harvesting)
2. **Local knowledge**: indigenous communities often know more about wildlife than scientists
3. **Conflict resolution**: when leopards kill livestock, compensation + prevention beats punishment
4. **Participatory monitoring**: train locals as camera trap operators and data collectors
5. **Cultural integration**: link conservation to cultural identity and pride

**In NE India:**
- **Community forests** (protected by villages, not government) cover thousands of km² in Nagaland and Meghalaya
- **Sacred groves**: some forests are protected for spiritual reasons — these often harbor rare species
- Local hunters turned conservationists have become the most effective clouded leopard monitors
- **Eco-development committees** around Manas NP share tourism revenue with buffer zone villages

**The economics:**
- A single clouded leopard photographed by a tourist is worth more in ecotourism revenue over its lifetime than the one-time value of its pelt
- Conservation creates permanent jobs (guides, rangers, hospitality)
- Poaching creates only short-term income and long-term loss`,
      analogy: 'Community conservation is like a neighborhood watch program. The police (government agencies) can\'t be everywhere. But if every resident watches out for problems (poaching, habitat destruction) and benefits from a safe neighborhood (tourism income, clean water), the whole community becomes a conservation force. The clouded leopard needs a whole village watching out for it, not just a few rangers.',
      storyConnection: 'The boy\'s friendship with the clouded leopard is the essence of community conservation — a local person who understands, values, and protects a wild neighbor. In real life, the most successful conservation projects in Assam are led by such people: former hunters who know the forest intimately and now use that knowledge to protect rather than hunt.',
      checkQuestion: 'A village near Manas NP loses 5 goats per year to clouded leopards (worth Rs 50,000). Should the government pay compensation? What are the pros and cons?',
      checkAnswer: 'Pros: reduces retaliatory killing, shows government values coexistence. Cons: creates dependency, may be gamed (false claims), doesn\'t prevent future losses. Better approach: combine compensation with predator-proof enclosures (90% reduction in kills), plus community tourism income that far exceeds the loss. The goal is to make the leopard more valuable alive than dead to the community.',
      codeIntro: 'Model the economics of community conservation vs. poaching.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Value of a leopard: alive vs dead
ax = axes[0, 0]
ax.set_facecolor('#111827')

# Poaching: one-time value
pelt_value = 50000  # Rs

# Ecotourism: annual value over lifetime
years = np.arange(0, 20)
annual_tourism = 30000  # Rs per year (tourist fees, guide income)
cumulative_tourism = np.cumsum(np.full(20, annual_tourism))

ax.bar(['Poaching\\n(one-time)'], [pelt_value], color='#ef4444', width=0.4)
ax.bar(['Tourism\\n(5 year)'], [annual_tourism * 5], color='#22c55e', width=0.4)
ax.bar(['Tourism\\n(10 year)'], [annual_tourism * 10], color='#3b82f6', width=0.4)
ax.bar(['Tourism\\n(20 year)'], [annual_tourism * 20], color='#8b5cf6', width=0.4)
ax.set_ylabel('Value (Rs)', color='white')
ax.set_title('Value of a Clouded Leopard: Dead vs Alive', color='white', fontsize=11)
ax.tick_params(colors='gray')

for i, val in enumerate([pelt_value, annual_tourism*5, annual_tourism*10, annual_tourism*20]):
    ax.text(i, val + 10000, f'\\u20b9{val:,}', ha='center', color='white', fontsize=9)

# 2. Community income sources with/without conservation
ax = axes[1, 0]
ax.set_facecolor('#111827')
categories = ['Agriculture', 'Timber\\n(unsustainable)', 'Poaching', 'Ecotourism', 'NTFP\\n(sustainable)', 'Conservation\\njobs']
no_conservation = [40, 25, 15, 0, 15, 5]
with_conservation = [35, 5, 0, 30, 20, 10]

x = np.arange(len(categories))
width = 0.35
ax.bar(x - width/2, no_conservation, width, color='#ef4444', alpha=0.7, label='Without conservation')
ax.bar(x + width/2, with_conservation, width, color='#22c55e', alpha=0.7, label='With conservation')
ax.set_xticks(x)
ax.set_xticklabels(categories, fontsize=8, color='white')
ax.set_ylabel('% of community income', color='white')
ax.set_title('Community Income Sources', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 3. Population trajectory with community support
ax = axes[0, 1]
ax.set_facecolor('#111827')
years_sim = 50
scenarios = {
    'No protection': {'growth': -0.05, 'color': '#ef4444'},
    'Government only': {'growth': -0.01, 'color': '#f59e0b'},
    'Government + community': {'growth': 0.02, 'color': '#22c55e'},
}

for name, params in scenarios.items():
    pop = 100
    pops = [pop]
    for year in range(years_sim):
        growth = params['growth'] + np.random.normal(0, 0.02)
        pop = max(0, pop * (1 + growth))
        pops.append(pop)
    ax.plot(range(years_sim + 1), pops, color=params['color'], linewidth=2, label=name)

ax.axhline(50, color='gray', linestyle=':', alpha=0.3)
ax.text(45, 55, 'Viable minimum', color='gray', fontsize=8)
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Clouded leopard population', color='white')
ax.set_title('Population Outcomes by Strategy', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Conflict resolution effectiveness
ax = axes[1, 1]
ax.set_facecolor('#111827')
interventions = ['No action', 'Compensation\\nonly', 'Predator-proof\\nenclosures', 'Compensation\\n+ enclosures', 'Full program\\n(+ tourism)']
livestock_loss = [100, 100, 20, 20, 15]  # % of baseline losses
retaliatory_kills = [100, 60, 50, 25, 5]  # % of baseline

x = np.arange(len(interventions))
ax.bar(x - 0.2, livestock_loss, 0.35, color='#f59e0b', label='Livestock loss (%)')
ax.bar(x + 0.2, retaliatory_kills, 0.35, color='#ef4444', label='Retaliatory kills (%)')
ax.set_xticks(x)
ax.set_xticklabels(interventions, fontsize=7, color='white')
ax.set_ylabel('% of baseline', color='white')
ax.set_title('Conflict Resolution Effectiveness', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Community conservation economics:")
print(f"  Poaching value: \\u20b9{pelt_value:,} (one-time)")
print(f"  Tourism value: \\u20b9{annual_tourism*20:,} (over 20 years)")
print(f"  Ratio: tourism is {annual_tourism*20/pelt_value:.0f}x more valuable")
print()
print("  Full conservation program (compensation + enclosures + tourism):")
print("  - Reduces livestock loss by 85%")
print("  - Reduces retaliatory kills by 95%")
print("  - Increases community income by 15-25%")
print("  - Everyone wins: people, leopards, and forests")`,
      challenge: 'Model a "payment for ecosystem services" scheme where downstream cities pay upstream villages to maintain forests (for clean water). How does this additional income stream affect conservation outcomes?',
      successHint: 'Conservation is ultimately a human challenge, not a biological one. The clouded leopard has survived 9 million years of evolution. Whether it survives the next 50 years depends on whether humans choose to protect its forest — and that choice depends on economics, culture, and community engagement.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Animal Conservation & Tracking</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for wildlife data simulations. Click to start.</p>
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