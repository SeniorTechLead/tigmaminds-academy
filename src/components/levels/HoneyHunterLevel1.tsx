import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function HoneyHunterLevel1() {
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
      title: 'Bee biology and colony structure — a superorganism',
      concept: `In the story, the honey hunter climbs to a wild bee nest high in a tree. Inside that nest live 20,000-80,000 bees — but they function as a single **superorganism**, with each bee playing a specific role.

**The three castes:**
- **Queen** (1 per colony): the only reproductive female. Lays up to 2,000 eggs per day. Lives 3-5 years.
- **Workers** (20,000-80,000): all female, all sterile. They do EVERYTHING else: foraging, nursing, guarding, building, cleaning, temperature regulation. Live 6 weeks in summer.
- **Drones** (a few hundred): males whose only job is to mate with queens from OTHER colonies. They have no stinger and can't feed themselves. After mating season, workers kick them out to die.

**Age-based division of labor** (workers change jobs as they age):
- Days 1-3: Cell cleaner
- Days 3-10: Nurse bee (feeds larvae)
- Days 10-18: Wax builder, food processor
- Days 18-21: Guard bee
- Days 21+: Forager (the most dangerous job — many die)`,
      analogy: 'A bee colony is like a factory with 50,000 workers and one CEO. The CEO (queen) sets the direction (through pheromones, not memos). Workers rotate through departments as they age: starting in maintenance (cell cleaning), moving to childcare (nursing), then construction (wax building), security (guarding), and finally field sales (foraging). No bee chooses its role — age and chemistry decide.',
      storyConnection: 'The honey hunter in the story knew to approach the hive at the right time — when foragers were out and guards were fewer. This knowledge comes from understanding colony structure. Traditional honey hunters across Assam and the Sundarbans have known bee biology for centuries, passed down as practical wisdom: which bees sting (workers), which don\'t (drones), and when the colony is calmest (cool evenings).',
      checkQuestion: 'If the queen dies unexpectedly and the colony has no way to make a new one, what happens?',
      checkAnswer: 'The colony is doomed — but it takes weeks to die. Without queen pheromones, workers\' ovaries begin to develop, and some start laying eggs. But worker-laid eggs are unfertilized and can only produce drones (males). Without a queen to produce fertilized eggs (workers), the colony gradually shrinks as old workers die and no new ones hatch. This "queenless collapse" takes 4-8 weeks.',
      codeIntro: 'Model the population dynamics of a bee colony through the seasons.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bee colony population model
# Queen lays eggs at a rate that varies by season
# Workers live ~42 days in summer, longer in winter

days = np.arange(0, 365)
month = (days / 30.44).astype(int) % 12

# Egg-laying rate (eggs/day, varies by season)
egg_rate = np.zeros(365)
for d in range(365):
    m = month[d]
    if m in [11, 0, 1]:   # Dec-Feb: minimal
        egg_rate[d] = 200
    elif m in [2, 3]:      # Mar-Apr: ramping up
        egg_rate[d] = 800
    elif m in [4, 5, 6]:   # May-Jul: peak
        egg_rate[d] = 1800
    elif m in [7, 8]:      # Aug-Sep: declining
        egg_rate[d] = 1200
    else:                  # Oct-Nov: winding down
        egg_rate[d] = 500

# Track population (simplified: workers emerge 21 days after egg, live 42 days)
dev_time = 21  # days from egg to adult
summer_lifespan = 42
winter_lifespan = 150

population = np.zeros(365)
# Initialize with 10,000 workers
for d in range(min(42, 365)):
    population[d] = 10000

for d in range(dev_time, 365):
    # New workers emerging today (from eggs laid 21 days ago)
    new_workers = egg_rate[d - dev_time] * 0.8  # 80% survival to adulthood

    # Workers dying today (laid dev_time + lifespan days ago)
    lifespan = winter_lifespan if month[d] in [10, 11, 0, 1, 2] else summer_lifespan
    death_day = d - lifespan
    dying = egg_rate[max(0, death_day - dev_time)] * 0.8 if death_day >= 0 else 200

    population[d] = max(5000, population[d-1] + new_workers - dying)
    population[d] = min(population[d], 80000)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Population over year
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.plot(days, population, color='#f59e0b', linewidth=2)
ax1.fill_between(days, population, alpha=0.15, color='#f59e0b')
ax1.set_xlabel('Day of year', color='white')
ax1.set_ylabel('Worker population', color='white')
ax1.set_title('Colony Population Through the Year', color='white', fontsize=12)
ax1.tick_params(colors='gray')

month_labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
for i, label in enumerate(month_labels):
    ax1.axvline(i * 30.44, color='gray', linestyle=':', alpha=0.2)
    ax1.text(i * 30.44 + 15, population.max() * 0.95, label, color='gray', fontsize=7, ha='center')

# Egg-laying rate
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.plot(days, egg_rate, color='#22c55e', linewidth=2)
ax2.fill_between(days, egg_rate, alpha=0.15, color='#22c55e')
ax2.set_xlabel('Day of year', color='white')
ax2.set_ylabel('Eggs per day', color='white')
ax2.set_title('Queen Egg-Laying Rate', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Colony composition (pie chart for peak season)
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
composition = {
    'Foragers (>21 days)': 35,
    'House bees (3-21 days)': 40,
    'Nurse bees (1-3 days)': 15,
    'Queen': 0.002,
    'Drones': 5,
    'Brood (eggs+larvae)': 5,
}
colors = ['#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#a855f7', '#ec4899']
wedges, texts, autotexts = ax3.pie(list(composition.values()), labels=list(composition.keys()),
                                    colors=colors, autopct='%1.0f%%',
                                    textprops={'color': 'white', 'fontsize': 8})
for autotext in autotexts:
    autotext.set_fontsize(7)
ax3.set_title('Colony Composition (Peak Season)', color='white', fontsize=12)

# Worker age and task
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
tasks = [
    ('Cell cleaning', 0, 3, '#3b82f6'),
    ('Nursing larvae', 3, 10, '#22c55e'),
    ('Wax building', 10, 15, '#f59e0b'),
    ('Food processing', 15, 18, '#a855f7'),
    ('Guard duty', 18, 21, '#ef4444'),
    ('Foraging', 21, 42, '#ec4899'),
]

for task, start, end, color in tasks:
    ax4.barh(task, end - start, left=start, color=color, alpha=0.8, height=0.6)
    ax4.text(start + (end-start)/2, task, f'{end-start}d', color='white', fontsize=9,
            ha='center', va='center')

ax4.set_xlabel('Worker age (days)', color='white')
ax4.set_title('Age-Based Division of Labor', color='white', fontsize=12)
ax4.tick_params(colors='gray')
ax4.set_yticklabels([t[0] for t in tasks], color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Colony facts:")
print(f"  Peak population: ~{population.max():.0f} workers")
print(f"  Min population (winter): ~{population.min():.0f} workers")
print(f"  Peak egg-laying: {egg_rate.max():.0f} eggs/day")
print(f"  Worker lifespan: {summer_lifespan} days (summer), {winter_lifespan} days (winter)")`,
      challenge: 'What happens if the queen\'s egg-laying rate drops by 50% (disease)? How long before the colony shrinks below 10,000 workers?',
      successHint: 'A bee colony is one of nature\'s most sophisticated social systems. Understanding its structure is the foundation for understanding pollination, honey production, and why losing bees threatens our food supply.',
    },
    {
      title: 'Pollination ecology — the partnership that feeds the world',
      concept: `The honey hunter takes honey, but the bees do something far more valuable: **pollination**. When a bee visits a flower to collect nectar and pollen, pollen grains stick to its fuzzy body. At the next flower, some of that pollen rubs off onto the stigma — fertilizing the flower so it can produce fruit and seeds.

**Scale of the partnership:**
- 75% of the world's food crops depend on animal pollination
- Bees are the most important pollinators, but butterflies, moths, birds, bats, and flies also contribute
- A single bee colony can pollinate 300 million flowers per day
- Without pollinators: no apples, almonds, blueberries, coffee, chocolate, or most vegetables

**What bees get:**
- **Nectar**: sugar water (energy) — bees convert it to honey
- **Pollen**: protein + fat (nutrition) — fed to larvae

**What plants get:**
- **Cross-pollination**: genetic mixing from pollen of a different plant
- This produces stronger, more diverse offspring than self-pollination`,
      analogy: 'Pollination is like a postal service where the mailman (bee) is paid in cookies (nectar). The bee visits house after house (flower after flower), and while picking up cookies, accidentally transfers letters (pollen) between houses. Neither party planned it — the bee just wants cookies, the flower just wants its letters delivered. But the system works perfectly because both needs are met simultaneously.',
      storyConnection: 'The honey hunter in the story values the colony for its honey. But the bees\' true value is pollination. Every fruit tree in the surrounding forest depends on those bees. If the honey hunter destroys the colony, the fruit trees won\'t produce fruit, the animals that eat fruit will decline, and the entire ecosystem suffers. The story\'s lesson about sustainable harvesting is really about protecting the pollination service.',
      checkQuestion: 'Almond orchards in California rent 2 million bee colonies every spring for pollination. Each colony costs about $200. Why can\'t the almond trees pollinate themselves?',
      checkAnswer: 'Most almond varieties are self-incompatible — their own pollen can\'t fertilize their own flowers (a genetic mechanism to force cross-pollination). They NEED pollen from a different almond tree variety, carried by bees. Wind can\'t do it efficiently because almond pollen is heavy and sticky. So California\'s $6 billion almond industry depends entirely on rented bees. That\'s a $400 million annual pollination bill.',
      codeIntro: 'Model pollination efficiency: how many flowers a bee visits, and how many get successfully pollinated.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Pollination model
# A bee visits N flowers per foraging trip
# Each visit has probability p of successful pollen transfer
# Cross-pollination requires pollen from a DIFFERENT plant

n_flowers_per_trip = 100
n_trips_per_day = 10
p_transfer = 0.7  # probability of pollen transfer per visit
p_cross = 0.4     # probability the transferred pollen is from a different plant

# Simulate a day of foraging
n_colonies = 10
bees_per_colony = 20000
forager_fraction = 0.35  # ~35% of workers are foragers

total_foragers = int(n_colonies * bees_per_colony * forager_fraction)
total_visits = total_foragers * n_trips_per_day * n_flowers_per_trip
successful_transfers = total_visits * p_transfer
cross_pollinations = successful_transfers * p_cross

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Single bee foraging trip
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
# Simulate flower visits
n_visits = 100
pollen_load = np.zeros(n_visits)
transferred = np.zeros(n_visits)
current_pollen = 0
for i in range(n_visits):
    # Pick up pollen
    pickup = np.random.uniform(0.5, 1.5)
    current_pollen += pickup
    # Transfer some
    if np.random.random() < p_transfer:
        transfer = current_pollen * np.random.uniform(0.1, 0.3)
        transferred[i] = transfer
        current_pollen -= transfer
    pollen_load[i] = current_pollen

ax1.plot(range(n_visits), pollen_load, color='#f59e0b', linewidth=2, label='Pollen on bee')
ax1.bar(range(n_visits), transferred, color='#22c55e', alpha=0.5, label='Pollen transferred')
ax1.set_xlabel('Flower visit #', color='white')
ax1.set_ylabel('Pollen amount', color='white')
ax1.set_title('One Bee, One Foraging Trip', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Crop dependence on pollinators
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
crops = {
    'Almonds': 100, 'Apples': 90, 'Blueberries': 90,
    'Coffee': 30, 'Tomatoes': 25, 'Rice': 0,
    'Wheat': 0, 'Mangoes': 70, 'Mustard': 60,
}
sorted_crops = sorted(crops.items(), key=lambda x: x[1], reverse=True)
names = [c[0] for c in sorted_crops]
deps = [c[1] for c in sorted_crops]
colors = ['#ef4444' if d > 50 else '#f59e0b' if d > 20 else '#22c55e' for d in deps]

ax2.barh(names, deps, color=colors, alpha=0.8)
for bar, dep in zip(ax2.patches, deps):
    ax2.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
            f'{dep}%', color='white', fontsize=9, va='center')
ax2.set_xlabel('Dependence on animal pollination (%)', color='white')
ax2.set_title('Crop Pollination Dependence', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_yticklabels(names, color='white', fontsize=9)

# Pollination service value
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Colony count vs crop yield
colonies = np.arange(0, 11)
# Yield follows a saturation curve (more bees = more pollination, with diminishing returns)
max_yield = 100  # % of maximum possible yield
yield_per_colony = max_yield * (1 - np.exp(-0.5 * colonies))

ax3.plot(colonies, yield_per_colony, 'o-', color='#22c55e', linewidth=2, markersize=8)
ax3.fill_between(colonies, yield_per_colony, alpha=0.15, color='#22c55e')
ax3.set_xlabel('Bee colonies per hectare', color='white')
ax3.set_ylabel('Crop yield (% of maximum)', color='white')
ax3.set_title('More Bees = More Food (with diminishing returns)', color='white', fontsize=12)
ax3.tick_params(colors='gray')

# Annotate economic value
ax3.annotate('Each colony adds\nless yield as\nsaturation approaches', xy=(8, 98), color='#f59e0b', fontsize=9)

# Scale of pollination
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.axis('off')

stats = [
    f'Total forager bees: {total_foragers:,}',
    f'Flower visits per day: {total_visits:,.0f}',
    f'Successful pollen transfers: {successful_transfers:,.0f}',
    f'Cross-pollinations: {cross_pollinations:,.0f}',
    '',
    f'That\\'s {cross_pollinations / 1e6:.0f} MILLION cross-pollinations per day',
    f'from just {n_colonies} colonies!',
    '',
    'Global pollination value:',
    '  $235-577 billion USD per year',
    '  (more than the GDP of many countries)',
]

for i, line in enumerate(stats):
    color = '#22c55e' if 'MILLION' in line or 'billion' in line else 'white'
    ax4.text(0.1, 0.9 - i * 0.08, line, color=color, fontsize=11,
            transform=ax4.transAxes, fontfamily='monospace')

ax4.set_title('The Scale of Bee Pollination', color='white', fontsize=12)

plt.tight_layout()
plt.show()

print(f"Daily pollination by {n_colonies} colonies:")
print(f"  Foragers: {total_foragers:,}")
print(f"  Total flower visits: {total_visits:,.0f}")
print(f"  Successful cross-pollinations: {cross_pollinations:,.0f}")`,
      challenge: 'If pollination efficiency drops from 70% to 40% (due to pesticide exposure affecting bee navigation), how much does the daily cross-pollination count change? What does this mean for crop yields?',
      successHint: 'Pollination is the invisible service that sustains human civilization. Every third bite of food you eat depends on a pollinator. Understanding this relationship is essential for agriculture, conservation, and food security.',
    },
    {
      title: 'The waggle dance — nature\'s GPS protocol',
      concept: `When a forager bee discovers a rich food source, she returns to the hive and performs the **waggle dance** — one of the most remarkable communication systems in the animal kingdom. The dance tells other bees EXACTLY where to go.

**How the waggle dance works:**
- The bee walks in a figure-eight pattern on the vertical comb surface
- The **straight run** (middle of the figure-eight) contains the information:
  - **Angle**: the direction of the straight run relative to vertical = the angle of the food source relative to the sun
  - **Duration**: the length of the straight run = distance to the food source (~1 second per km)
  - **Vigor**: how enthusiastically the bee waggles = quality of the food source

**The translation:**
- Straight up on the comb = "fly toward the sun"
- 30° right of up = "fly 30° right of the sun"
- 90° left of up = "fly 90° left of the sun"

Karl von Frisch decoded this in 1945 and won the Nobel Prize in 1973. It was the first proof that non-humans use symbolic, abstract communication — the angle on the comb REPRESENTS the angle in the sky.`,
      analogy: 'The waggle dance is like giving directions using a clock face. "The food is at 2 o\'clock relative to the sun" is encoded by walking at a 60° angle on the comb. The distance is encoded by how long you walk that straight line. It\'s a GPS coordinate system where the sun is north and the dance floor is the map. Other bees "read" the map by following the dancer and copying her movements.',
      storyConnection: 'The honey hunter in the story followed bees back to their hive — a traditional technique. But the bees themselves use the waggle dance to guide each other. When one scout finds the honey hunter\'s flower-rich garden, she dances the directions, and within an hour, hundreds of foragers arrive. The story\'s honey exists because of this communication system — without the dance, colonies couldn\'t efficiently exploit scattered food sources.',
      checkQuestion: 'The waggle dance uses the sun as a reference point. But the sun moves across the sky during the day. How do bees account for this?',
      checkAnswer: 'Bees have an internal clock that tracks the sun\'s movement. They continuously adjust the angle of their dance to compensate for the sun\'s apparent motion (~15° per hour). A bee that danced "30° right of vertical" at 10 AM will dance "45° right" at 11 AM for the SAME food source, because the sun has moved 15°. This means bees understand that the sun moves predictably — a form of time-compensated navigation.',
      codeIntro: 'Simulate the waggle dance and decode the direction and distance information.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Waggle dance decoder
# Given: sun direction, dance angle, dance duration
# Output: food source location

def decode_waggle(sun_azimuth, dance_angle, dance_duration, hive_pos=(0, 0)):
    """
    sun_azimuth: degrees from north (clockwise)
    dance_angle: degrees from vertical on comb (clockwise)
    dance_duration: seconds of waggle run
    """
    # Distance: approximately 1 second per km
    distance = dance_duration * 1.0  # km

    # Direction: sun_azimuth + dance_angle
    food_direction = sun_azimuth + dance_angle  # degrees from north

    # Convert to cartesian
    food_x = hive_pos[0] + distance * np.sin(np.radians(food_direction))
    food_y = hive_pos[1] + distance * np.cos(np.radians(food_direction))

    return food_x, food_y, distance, food_direction

# Example dances
sun_azimuth = 180  # sun due south (noon)
dances = [
    ('Dance A', 0, 2.0, 'Straight up → toward sun'),       # toward sun, 2 km
    ('Dance B', 45, 1.5, '45° right → SE'),                 # 45° right, 1.5 km
    ('Dance C', -90, 3.0, '90° left → east'),                # 90° left, 3 km
    ('Dance D', 180, 0.5, '180° → away from sun (north)'),   # opposite sun, 0.5 km
]

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Map of decoded food locations
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.plot(0, 0, 's', color='#f59e0b', markersize=15, label='Hive')

colors = ['#22c55e', '#3b82f6', '#ef4444', '#a855f7']
for (name, angle, duration, desc), color in zip(dances, colors):
    fx, fy, dist, direction = decode_waggle(sun_azimuth, angle, duration)
    ax1.plot([0, fx], [0, fy], '--', color=color, linewidth=1.5, alpha=0.5)
    ax1.plot(fx, fy, 'o', color=color, markersize=10)
    ax1.annotate(f'{name}: {dist:.1f}km, {direction:.0f}°', xy=(fx, fy),
                xytext=(fx + 0.2, fy + 0.2), color=color, fontsize=9)

# Draw sun direction
ax1.annotate('SUN ☀', xy=(0, -3.5), color='#f59e0b', fontsize=12, ha='center')
ax1.annotate('', xy=(0, -3), xytext=(0, -0.5),
            arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=2))

ax1.set_xlabel('East-West (km)', color='white')
ax1.set_ylabel('North-South (km)', color='white')
ax1.set_title('Decoded Food Source Locations', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.set_aspect('equal')
ax1.grid(True, alpha=0.1)
ax1.tick_params(colors='gray')

# Dance on the comb (figure-eight)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')

# Simulate dance A (straight up = toward sun)
t = np.linspace(0, 4*np.pi, 500)
dance_angle_rad = np.radians(45)  # Dance B: 45° right

# Figure-eight trajectory
x_dance = np.sin(t) * 0.3
y_base = np.cos(t) * 0.5
# Rotate the straight runs by dance angle
x_rotated = x_dance * np.cos(dance_angle_rad) - y_base * np.sin(dance_angle_rad)
y_rotated = x_dance * np.sin(dance_angle_rad) + y_base * np.cos(dance_angle_rad)

# Identify waggle run portion
waggle_mask = np.cos(t) > 0.3
ax2.plot(x_rotated, y_rotated, color='#3b82f6', linewidth=1, alpha=0.5)
ax2.plot(x_rotated[waggle_mask], y_rotated[waggle_mask], color='#f59e0b', linewidth=3, label='Waggle run')

# Draw reference lines
ax2.annotate('UP (gravity)', xy=(0, 0.7), color='white', fontsize=9, ha='center')
ax2.annotate('', xy=(0, 0.65), xytext=(0, 0.1),
            arrowprops=dict(arrowstyle='->', color='white', lw=1.5))

# Dance angle annotation
ax2.annotate(f'Dance angle: 45°\\n→ food is 45° right of sun',
            xy=(0.3, 0.3), color='#f59e0b', fontsize=9)

ax2.set_title('Waggle Dance on Comb (Dance B)', color='white', fontsize=12)
ax2.set_xlim(-0.8, 0.8)
ax2.set_ylim(-0.8, 0.8)
ax2.set_aspect('equal')
ax2.tick_params(colors='gray')
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Distance encoding
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
distances_real = np.array([0.2, 0.5, 1.0, 2.0, 5.0, 10.0])
waggle_durations = distances_real  # approximately 1 sec per km

ax3.plot(waggle_durations, distances_real, 'o-', color='#22c55e', linewidth=2, markersize=8)
ax3.set_xlabel('Waggle run duration (seconds)', color='white')
ax3.set_ylabel('Distance to food (km)', color='white')
ax3.set_title('Distance Encoding: Longer Dance = Farther Food', color='white', fontsize=12)
ax3.tick_params(colors='gray')

for d, dur in zip(distances_real, waggle_durations):
    ax3.annotate(f'{d}km', xy=(dur, d), xytext=(dur+0.3, d+0.2), color='#f59e0b', fontsize=9)

# Time compensation
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
hours = np.arange(6, 19)  # 6 AM to 6 PM
sun_positions = (hours - 6) * 15  # sun moves 15°/hour from east (90°) at 6AM

# Same food source: 2km, 60° from north (NE)
food_direction = 60
dance_angles = food_direction - sun_positions

ax4.plot(hours, dance_angles, 'o-', color='#f59e0b', linewidth=2, markersize=8)
ax4.axhline(0, color='white', linestyle=':', alpha=0.3)
ax4.set_xlabel('Time of day (hour)', color='white')
ax4.set_ylabel('Dance angle on comb (degrees)', color='white')
ax4.set_title('Time Compensation: Same Food, Different Dance', color='white', fontsize=12)
ax4.tick_params(colors='gray')
ax4.annotate('Dance changes throughout the day\\nfor the SAME food source', xy=(12, -60), color='gray', fontsize=9, ha='center')

plt.tight_layout()
plt.show()

print("Waggle dance decoded:")
for name, angle, duration, desc in dances:
    fx, fy, dist, direction = decode_waggle(sun_azimuth, angle, duration)
    print(f"  {name}: {desc}")
    print(f"    → Food at {dist:.1f}km, bearing {direction:.0f}° from north")`,
      challenge: 'If a bee dances at 30° left of vertical and the waggle run lasts 2.5 seconds, and the sun is at azimuth 225° (southwest), where is the food source? Plot it on the map.',
      successHint: 'The waggle dance is one of the most remarkable discoveries in animal behavior. It proves that non-human animals can use abstract, symbolic communication — the angle on the comb REPRESENTS the angle in the real world. Von Frisch called it "the most wonderful thing I ever discovered."',
    },
    {
      title: 'Honey production process — from flower to jar',
      concept: `The honey hunter in the story harvests honey — but how did the bees make it? Honey production is a multi-step industrial process carried out by thousands of workers.

**Step 1: Collection**
- Forager bees collect nectar from flowers using their long tongues (proboscis)
- Nectar is stored in a special "honey stomach" (crop), separate from the digestive stomach
- A forager visits 50-1,000 flowers per trip, collecting ~40 mg of nectar

**Step 2: Processing**
- Back at the hive, the forager regurgitates the nectar to a house bee
- House bees pass the nectar mouth-to-mouth, adding enzymes (invertase) that break sucrose into glucose and fructose
- This process is repeated 15-20 minutes

**Step 3: Evaporation**
- The processed nectar is deposited in wax cells
- Nectar starts at ~70% water; honey must be <18.6% to prevent fermentation
- Bees fan their wings over the cells to evaporate water (active dehydration)
- This can take 1-3 days

**Step 4: Capping**
- When the honey reaches the right water content, bees seal the cell with a wax cap
- Capped honey can be stored indefinitely (honey found in Egyptian tombs is still edible)`,
      analogy: 'Honey production is like a relay race at a food processing plant. Runner 1 (forager) brings raw materials (nectar) from the field. Runner 2 (house bee) processes it on the factory floor (adds enzymes). Runner 3 (fan bee) dries the product (evaporation). Runner 4 (builder bee) packages it (wax cap). Each step transforms dilute sugar water into a concentrated, preserved superfood.',
      storyConnection: 'The honey hunter climbs to a wild nest and cuts out chunks of honeycomb. Each chunk contains hundreds of capped cells — each one the product of thousands of flower visits, hours of enzyme processing, and days of fanning. The honey the hunter takes represents an enormous investment of bee labor. This is why sustainable harvesting (taking some, leaving enough for the colony) is essential — taking everything destroys months of work.',
      checkQuestion: 'It takes about 2 million flower visits to make 1 kg of honey. A bee visits 100 flowers per trip and makes 10 trips per day. How many "bee-days" does 1 kg of honey represent?',
      checkAnswer: '2,000,000 visits ÷ 100 visits/trip = 20,000 trips. 20,000 trips ÷ 10 trips/day = 2,000 bee-days. That\'s equivalent to one bee working for 5.5 years (but since bees live ~42 days as foragers, it takes about 48 bees their entire foraging lives to make 1 kg of honey). Each jar represents the lifetime work of dozens of bees.',
      codeIntro: 'Model the honey production process: from nectar collection to final water content.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Honey production model

# Step 1: Nectar collection
flowers_per_trip = 80
nectar_per_flower = 0.5e-3  # grams of nectar per flower
nectar_per_trip = flowers_per_trip * nectar_per_flower  # grams
trips_per_day = 10
foragers = 20000

daily_nectar = foragers * trips_per_day * nectar_per_trip / 1000  # kg

# Step 2: Enzyme processing (invertase converts sucrose to glucose + fructose)
# Sucrose (C12H22O11) + H2O → Glucose (C6H12O6) + Fructose (C6H12O6)

# Step 3: Water evaporation
nectar_water_pct = 70
honey_water_pct = 17
# Honey yield = nectar weight * (1 - nectar_water) / (1 - honey_water)
honey_yield_factor = (1 - nectar_water_pct/100) / (1 - honey_water_pct/100)
daily_honey = daily_nectar * honey_yield_factor

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Evaporation over time
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
hours = np.linspace(0, 72, 200)
# Water content decreases exponentially
water_pct = 17 + (70 - 17) * np.exp(-0.06 * hours)
ax1.plot(hours, water_pct, color='#3b82f6', linewidth=2)
ax1.axhline(18.6, color='#ef4444', linestyle='--', label='Capping threshold (18.6%)')
ax1.axhline(17, color='#22c55e', linestyle=':', label='Target (17%)')
ax1.fill_between(hours, water_pct, 17, where=water_pct > 18.6, alpha=0.1, color='#ef4444')
ax1.fill_between(hours, water_pct, 17, where=water_pct <= 18.6, alpha=0.1, color='#22c55e')

# Find capping time
cap_time = -np.log((18.6 - 17) / (70 - 17)) / 0.06
ax1.axvline(cap_time, color='#f59e0b', linestyle=':', alpha=0.7)
ax1.annotate(f'Capping at {cap_time:.0f}h', xy=(cap_time, 18.6), xytext=(cap_time+5, 35),
            color='#f59e0b', fontsize=10, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax1.set_xlabel('Hours after deposition', color='white')
ax1.set_ylabel('Water content (%)', color='white')
ax1.set_title('Nectar → Honey: Water Evaporation', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Composition comparison
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
nectar_comp = {'Water': 70, 'Sucrose': 25, 'Glucose': 2.5, 'Fructose': 2.5}
honey_comp = {'Water': 17, 'Sucrose': 1, 'Glucose': 31, 'Fructose': 38, 'Other': 13}

categories = list(set(list(nectar_comp.keys()) + list(honey_comp.keys())))
x_pos = np.arange(len(categories))
nectar_vals = [nectar_comp.get(c, 0) for c in categories]
honey_vals = [honey_comp.get(c, 0) for c in categories]

ax2.bar(x_pos - 0.15, nectar_vals, width=0.3, color='#3b82f6', alpha=0.7, label='Nectar')
ax2.bar(x_pos + 0.15, honey_vals, width=0.3, color='#f59e0b', alpha=0.7, label='Honey')
ax2.set_xticks(x_pos)
ax2.set_xticklabels(categories, color='white', fontsize=8, rotation=30)
ax2.set_ylabel('Percentage (%)', color='white')
ax2.set_title('Nectar vs Honey Composition', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Production economics
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
# Monthly nectar flow (relative)
nectar_flow = [5, 10, 40, 60, 80, 50, 30, 25, 35, 70, 40, 10]
# Monthly consumption (colony needs)
consumption = [20, 20, 25, 30, 35, 35, 30, 30, 25, 25, 20, 20]
# Surplus = production - consumption (what becomes stored honey)
surplus = [max(0, n - c) for n, c in zip(nectar_flow, consumption)]
deficit = [max(0, c - n) for n, c in zip(nectar_flow, consumption)]

x = np.arange(12)
ax3.bar(x, nectar_flow, color='#22c55e', alpha=0.6, label='Nectar available')
ax3.bar(x, [-c for c in consumption], color='#ef4444', alpha=0.6, label='Colony consumption')
ax3.bar(x, surplus, bottom=0, color='#f59e0b', alpha=0.8, label='Surplus (→ honey)')

ax3.set_xticks(x)
ax3.set_xticklabels(months, color='white', fontsize=8)
ax3.set_ylabel('Relative amount', color='white')
ax3.set_title('Seasonal Nectar Budget', color='white', fontsize=12)
ax3.axhline(0, color='white', linewidth=0.5)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

# Honey math
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.axis('off')
stats = [
    'The Math of Honey:',
    '',
    f'Foragers per colony: {foragers:,}',
    f'Trips per day: {trips_per_day}',
    f'Flowers per trip: {flowers_per_trip}',
    f'Daily nectar collected: {daily_nectar:.1f} kg',
    f'Honey yield factor: {honey_yield_factor:.2f}',
    f'Daily honey production: {daily_honey:.1f} kg',
    '',
    f'For 1 kg of honey:',
    f'  Flower visits: ~{1 / (nectar_per_flower/1000 * honey_yield_factor):,.0f}',
    f'  Foraging trips: ~{1 / (nectar_per_trip/1000 * honey_yield_factor):,.0f}',
    f'  Bee-days: ~{1 / (nectar_per_trip/1000 * trips_per_day * honey_yield_factor):,.0f}',
]

for i, line in enumerate(stats):
    weight = 'bold' if i == 0 else 'normal'
    color = '#f59e0b' if 'For 1 kg' in line else 'white'
    ax4.text(0.1, 0.95 - i * 0.065, line, color=color, fontsize=10,
            transform=ax4.transAxes, fontweight=weight, fontfamily='monospace')

plt.tight_layout()
plt.show()

print(f"Honey production summary:")
print(f"  Daily nectar: {daily_nectar:.1f} kg from {foragers*trips_per_day*flowers_per_trip:,.0f} flower visits")
print(f"  Daily honey: {daily_honey:.1f} kg")
print(f"  Annual honey (peak 6 months): ~{daily_honey * 180:.0f} kg")
print(f"  Sustainable harvest (50%): ~{daily_honey * 180 * 0.5:.0f} kg")`,
      challenge: 'If the colony needs 20 kg of honey to survive winter and produces 60 kg in a year, what is the maximum the honey hunter can sustainably take? What safety margin should be left for bad years?',
      successHint: 'Honey is one of the few foods that never spoils, that requires no cooking, and that is produced entirely by another species for their own use. Every jar represents the coordinated labor of tens of thousands of bees visiting millions of flowers. Understanding this process makes sustainable harvesting not just ethical but rational.',
    },
    {
      title: 'Threats to bees — why pollinators are declining',
      concept: `Bee populations worldwide are declining — and this threatens not just honey production but the entire food system. The main threats:

**1. Pesticides (especially neonicotinoids)**
- Systemic pesticides absorbed by the whole plant, including pollen and nectar
- Sub-lethal doses disorient bees, impair navigation, reduce reproduction
- A bee exposed to neonicotinoids may survive but can't find her way back to the hive

**2. Habitat loss**
- Wildflower meadows replaced by monoculture farms
- Less diverse food = poorer bee nutrition (like humans eating only rice)
- Fewer nesting sites for wild bees

**3. Varroa destructor (parasitic mite)**
- Feeds on bee fat bodies, weakens immune system
- Spreads viruses between bees
- Has devastated managed honeybee colonies worldwide since the 1980s

**4. Climate change**
- Flowering times shifting (flowers bloom before bees emerge)
- Extreme weather events destroying colonies
- Range shifts (some bees moving poleward, leaving their traditional flowers behind)

**5. Monoculture agriculture**
- One crop = one brief flowering period, then nothing
- Bees need diverse pollen sources across the entire season`,
      analogy: 'The threats to bees are like multiple chronic illnesses hitting a person simultaneously. Pesticides are like a constant low-level poison (liver damage). Habitat loss is malnutrition. Varroa is a parasite (tapeworm). Climate change is a shifting environment (homeless). Any one might be survivable; all together are devastating. This "multiple stressor" problem is why bee decline is so hard to solve — there\'s no single cause to fix.',
      storyConnection: 'The honey hunter in the story practiced sustainable harvesting — taking some honey and leaving enough for the colony. But even sustainable harvesting can\'t protect bees from pesticides, mites, or habitat loss. The story\'s lesson extends beyond harvesting: protecting bees requires protecting the entire ecosystem they depend on — diverse flowers, clean water, and poison-free landscapes.',
      checkQuestion: 'A farmer uses neonicotinoid-coated seeds. The pesticide is in every part of the plant, including pollen at 5 ppb (parts per billion). A bee collects pollen from 1,000 flowers. Is this dangerous?',
      checkAnswer: 'Yes. While 5 ppb sounds tiny, bees are small. A forager consuming pollen with 5 ppb neonicotinoid accumulates enough to impair navigation within days. Studies show that at 10 ppb, foragers are 3x more likely to fail to return to the hive. At colony level, this "missing forager" problem reduces the colony\'s food income, weakening it for other threats (Varroa, winter). Sub-lethal doesn\'t mean safe.',
      codeIntro: 'Model colony decline under multiple stressors and identify tipping points.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Colony health model under multiple stressors
# Baseline: healthy colony of 40,000 workers
# Stressors reduce forager success, brood survival, and queen laying rate

days = np.arange(0, 365)
n_scenarios = 5

scenarios = {
    'Healthy baseline': {'pesticide': 0, 'varroa': 0, 'habitat_loss': 0},
    'Pesticide only': {'pesticide': 0.3, 'varroa': 0, 'habitat_loss': 0},
    'Varroa only': {'pesticide': 0, 'varroa': 0.25, 'habitat_loss': 0},
    'Habitat loss only': {'pesticide': 0, 'varroa': 0, 'habitat_loss': 0.2},
    'All stressors combined': {'pesticide': 0.3, 'varroa': 0.25, 'habitat_loss': 0.2},
}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Population under each scenario
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')

colors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#a855f7']
collapse_threshold = 10000

for (name, stressors), color in zip(scenarios.items(), colors):
    pop = [40000]
    for d in range(1, 365):
        base_growth = 0.002 * np.sin(d / 365 * 2 * np.pi - 1)  # seasonal

        # Stressor effects
        pest_effect = 1 - stressors['pesticide']      # reduces forager success
        varroa_effect = 1 - stressors['varroa'] * (1 + d/365)  # varroa worsens over time
        habitat_effect = 1 - stressors['habitat_loss'] # reduces food availability

        combined = pest_effect * max(varroa_effect, 0.3) * habitat_effect

        growth = base_growth * combined
        new_pop = pop[-1] * (1 + growth)
        new_pop = max(new_pop, 1000)  # minimum viable
        pop.append(new_pop)

    ax1.plot(days, pop, color=color, linewidth=2, label=name)

ax1.axhline(collapse_threshold, color='white', linestyle=':', alpha=0.3, label='Collapse threshold')
ax1.set_xlabel('Day of year', color='white')
ax1.set_ylabel('Colony population', color='white')
ax1.set_title('Colony Health Under Multiple Stressors', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax1.tick_params(colors='gray')

# Pesticide dose-response
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
doses = np.linspace(0, 50, 100)  # ppb neonicotinoid in pollen
# Effects
forager_return = 100 * np.exp(-0.05 * doses)  # % returning to hive
learning_ability = 100 * np.exp(-0.08 * doses)
queen_laying = 100 * np.exp(-0.03 * doses)

ax2.plot(doses, forager_return, color='#ef4444', linewidth=2, label='Forager return rate')
ax2.plot(doses, learning_ability, color='#3b82f6', linewidth=2, label='Learning ability')
ax2.plot(doses, queen_laying, color='#22c55e', linewidth=2, label='Queen egg-laying')
ax2.axvline(5, color='#f59e0b', linestyle='--', alpha=0.7, label='Typical field exposure (5 ppb)')
ax2.set_xlabel('Neonicotinoid concentration (ppb)', color='white')
ax2.set_ylabel('Performance (% of normal)', color='white')
ax2.set_title('Pesticide Dose-Response', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

# Global decline data
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
years = np.arange(1960, 2025)
# Managed honeybee colonies (millions, global)
colonies_global = 50 + 20 * np.sin((years - 1960) / 65 * np.pi * 0.5)
colonies_global += np.random.normal(0, 2, len(years))
# Add decline trend after 2006
colonies_global[years > 2006] -= (years[years > 2006] - 2006) * 0.3

# Wild bee species richness (index)
wild_bee_index = 100 - (years - 1960) * 0.4 - np.maximum(0, (years - 1990) * 0.3)
wild_bee_index += np.random.normal(0, 2, len(years))

ax3.plot(years, colonies_global, color='#f59e0b', linewidth=2, label='Managed honeybees (millions)')
ax3.set_xlabel('Year', color='white')
ax3.set_ylabel('Colonies (millions)', color='#f59e0b')
ax3_twin = ax3.twinx()
ax3_twin.plot(years, wild_bee_index, color='#ef4444', linewidth=2, label='Wild bee diversity index')
ax3_twin.set_ylabel('Wild bee index', color='#ef4444')
ax3.set_title('Global Bee Population Trends', color='white', fontsize=12)
lines1, labels1 = ax3.get_legend_handles_labels()
lines2, labels2 = ax3_twin.get_legend_handles_labels()
ax3.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')
ax3_twin.tick_params(colors='gray')

# Solutions
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.axis('off')
solutions = [
    ('Ban neonicotinoids', 'EU banned 3 neonicotinoids in 2018', '#ef4444'),
    ('Plant wildflower strips', 'Increase forage diversity by 40%', '#22c55e'),
    ('Varroa management', 'Organic acids reduce mite loads 90%', '#3b82f6'),
    ('Reduce monoculture', 'Crop diversification helps all pollinators', '#f59e0b'),
    ('Urban beekeeping', 'Cities can support healthy colonies', '#a855f7'),
    ('Citizen monitoring', 'Track wild bee populations over time', '#ec4899'),
]

ax4.text(0.05, 0.95, 'Solutions (each helps, all together transform)', color='white', fontsize=12,
        transform=ax4.transAxes, fontweight='bold')
for i, (sol, detail, color) in enumerate(solutions):
    y = 0.82 - i * 0.13
    ax4.text(0.05, y, f'  {sol}', color=color, fontsize=11, transform=ax4.transAxes)
    ax4.text(0.08, y - 0.05, detail, color='gray', fontsize=9, transform=ax4.transAxes)

plt.tight_layout()
plt.show()

print("Multiple stressor effect:")
print("  Pesticide alone: colony weakened but survives")
print("  Varroa alone: colony weakened but usually survives with management")
print("  Habitat loss alone: colony forages less efficiently")
print("  ALL COMBINED: colony collapses before winter")
print("\\nThis is why bee decline is so hard to solve:")
print("  No single fix works — must address all stressors together")`,
      challenge: 'Model what happens if you remove one stressor at a time from the "all combined" scenario. Which single intervention saves the most colonies? This analysis drives policy decisions.',
      successHint: 'Bee decline is a systems problem — multiple interacting stressors creating a death spiral that no single solution can fix. Understanding this complexity is essential for anyone who wants to help: the answer is not "ban pesticides" or "plant flowers" alone, but ALL of these together.',
    },
    {
      title: 'Sustainable harvesting — taking without destroying',
      concept: `The title of the story is "The Honey Hunter's Lesson" — and that lesson is about taking honey sustainably. **Sustainable harvesting** means extracting a resource at a rate the population can replace, indefinitely.

**The sustainable yield equation:**
- A colony produces X kg of honey per year
- It needs Y kg to survive winter and rebuild in spring
- Sustainable harvest = X - Y (minus a safety margin)
- Typical: colony produces 30-60 kg/year, needs 15-25 kg → sustainable harvest: 10-30 kg

**Traditional vs destructive harvesting:**
- **Destructive**: cut the entire comb, kill the colony (common in wild honey hunting)
- **Sustainable**: take 50-70% of surplus honey, leave the rest; the colony rebuilds
- **Modern beekeeping**: removable frames allow harvesting without disturbing the brood

**Maximum Sustainable Yield (MSY)**: the largest harvest that can be taken indefinitely without reducing the population. It occurs at intermediate population sizes — below MSY, the population declines; above, you're leaving potential harvest on the table.

Indigenous honey hunters across India, Africa, and Asia developed sustainable methods independently — proving that traditional knowledge and ecological science converge on the same answer.`,
      analogy: 'Sustainable harvesting is like withdrawing interest from a savings account without touching the principal. Your account (colony) earns interest (honey). If you withdraw only the interest, the principal stays intact and keeps earning. If you withdraw more than the interest, you eat into the principal and the account shrinks year after year until it\'s empty. The colony IS the principal. The surplus honey IS the interest.',
      storyConnection: 'The honey hunter\'s lesson in the story is simple: take some, leave some. His elder taught him to harvest only the lower combs and leave the brood combs untouched. This preserves the colony\'s ability to rebuild. Modern conservation science validates this traditional practice — it\'s Maximum Sustainable Yield, discovered independently by indigenous communities and fisheries scientists.',
      checkQuestion: 'A honey hunter takes 80% of the honey from every wild nest he finds. He says: "The bees will make more." Is he right?',
      checkAnswer: 'Technically yes, if the remaining 20% is enough for the colony to survive winter. But he\'s wrong in practice: (1) Bad years (drought, cold) reduce production, and 20% may not be enough. (2) He\'s also disrupting the brood, which kills developing bees. (3) Wild colonies already face stressors; removing most of their food reserve pushes them toward collapse. (4) If the colony dies, he loses future harvests. Sustainable harvesting means taking 50-60% and leaving a safety margin.',
      codeIntro: 'Model the Maximum Sustainable Yield for honey harvesting.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Maximum Sustainable Yield model for honey harvesting
# Colony growth follows logistic equation
# dN/dt = rN(1 - N/K) - H
# N = colony strength, K = carrying capacity, r = growth rate, H = harvest

K = 60  # max colony size (1000s of bees, proportional to honey storage)
r = 0.5  # growth rate

# Different harvest rates
harvest_rates = np.linspace(0, 15, 100)  # kg per year
equilibrium_pop = []
sustainable_yield = []

for H in harvest_rates:
    # Equilibrium: rN(1 - N/K) = H
    # rN - rN²/K = H
    # rN²/K - rN + H = 0
    # N = (r ± sqrt(r² - 4rH/K)) / (2r/K)
    discriminant = r**2 - 4*r*H/K
    if discriminant >= 0:
        N = (r - np.sqrt(discriminant)) / (2*r/K)
        N = K/2 + np.sqrt(max(0, K**2/4 - K*H/r))
        equilibrium_pop.append(N)
        sustainable_yield.append(H)
    else:
        break

# MSY
msy = r * K / 4
msy_pop = K / 2

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Yield curve
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
pop_range = np.linspace(1, K, 200)
yield_at_pop = r * pop_range * (1 - pop_range / K)

ax1.plot(pop_range, yield_at_pop, color='#22c55e', linewidth=2)
ax1.fill_between(pop_range, yield_at_pop, alpha=0.15, color='#22c55e')
ax1.plot(msy_pop, msy, 'o', color='#ef4444', markersize=12)
ax1.annotate(f'MSY = {msy:.1f} kg/year\\nat N = {msy_pop:.0f}', xy=(msy_pop, msy),
            xytext=(msy_pop+10, msy+1), color='#ef4444', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#ef4444'))
ax1.set_xlabel('Colony strength (relative units)', color='white')
ax1.set_ylabel('Sustainable harvest (kg/year)', color='white')
ax1.set_title('Maximum Sustainable Yield', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Time simulation: sustainable vs overharvesting
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
years = np.arange(0, 20)

for harvest, label, color, style in [
    (5, 'Conservative (5 kg)', '#22c55e', '-'),
    (msy, f'MSY ({msy:.0f} kg)', '#f59e0b', '--'),
    (12, 'Overharvest (12 kg)', '#ef4444', '-'),
]:
    N = 50  # start near carrying capacity
    trajectory = [N]
    for y in range(len(years) - 1):
        dN = r * N * (1 - N/K) - harvest
        N = max(N + dN, 0)
        trajectory.append(N)
    ax2.plot(years, trajectory, color=color, linewidth=2, linestyle=style, label=label)

ax2.axhline(0, color='white', linestyle=':', alpha=0.3)
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Colony strength', color='white')
ax2.set_title('Colony Trajectory Under Different Harvest Rates', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Traditional vs modern methods
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
methods = {
    'Destructive\\n(kill colony)': {'honey': 30, 'survival': 0, 'future': 0},
    'Traditional\\n(partial harvest)': {'honey': 15, 'survival': 85, 'future': 15},
    'Modern\\n(frame hive)': {'honey': 25, 'survival': 95, 'future': 25},
}

x = np.arange(len(methods))
width = 0.25
ax3.bar(x - width, [m['honey'] for m in methods.values()], width, color='#f59e0b', label='Honey this year (kg)')
ax3.bar(x, [m['survival'] for m in methods.values()], width, color='#22c55e', label='Colony survival (%)')
ax3.bar(x + width, [m['future'] for m in methods.values()], width, color='#3b82f6', label='Honey next year (kg)')
ax3.set_xticks(x)
ax3.set_xticklabels(list(methods.keys()), color='white', fontsize=9)
ax3.set_title('Harvesting Methods Compared', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

# 10-year cumulative harvest
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
years_long = np.arange(0, 11)
cumulative = {}
for method, data in methods.items():
    cum = [0]
    colony_alive = True
    for y in range(10):
        if colony_alive:
            cum.append(cum[-1] + data['honey'])
            if data['survival'] == 0:
                colony_alive = False
        else:
            cum.append(cum[-1])
    cumulative[method] = cum

method_colors = ['#ef4444', '#f59e0b', '#22c55e']
for (method, cum), color in zip(cumulative.items(), method_colors):
    ax4.plot(years_long, cum, 'o-', color=color, linewidth=2, markersize=5,
            label=f'{method.replace(chr(10), " ")}: {cum[-1]} kg')

ax4.set_xlabel('Year', color='white')
ax4.set_ylabel('Cumulative honey (kg)', color='white')
ax4.set_title('10-Year Cumulative Harvest', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("10-year cumulative harvest:")
for method, cum in cumulative.items():
    print(f"  {method.replace(chr(10), ' ')}: {cum[-1]} kg total")
print(f"\\nDestructive gets 30 kg once, then nothing.")
print(f"Sustainable gets 150-250 kg over 10 years.")
print(f"Patience is not just ethical — it's mathematically optimal.")`,
      challenge: 'Add year-to-year variability: some years produce 50% more honey (good weather), some produce 50% less. With a fixed harvest of MSY, how often does the colony collapse? What harvest rate is safe with variability?',
      successHint: 'Maximum Sustainable Yield is one of the most important concepts in resource management. It applies to honey, fisheries, forestry, and groundwater. The math is clear: short-term greed destroys long-term wealth. The honey hunter who understands MSY will always outperform the one who takes everything.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Entomology & Bee Biology — no prior science experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biology simulations. Click to start.</p>
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
