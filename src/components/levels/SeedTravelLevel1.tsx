import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function SeedTravelLevel1() {
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
      title: 'Why seeds need to travel — escaping the parent\'s shadow',
      concept: `A seed that falls directly below its parent plant faces three deadly problems:

1. **Competition**: The parent tree is already using the light, water, and nutrients in that spot. A seedling growing in its parent's shadow has almost zero chance of survival.

2. **Density-dependent disease**: Pathogens that infect the parent accumulate in the surrounding soil. The closer a seedling is to the parent, the higher its chance of infection. This is called the **Janzen-Connell effect**.

3. **Inbreeding**: If seeds only land near the parent, they'll likely cross-pollinate with siblings, reducing genetic diversity and fitness.

The solution: **seed dispersal** — mechanisms that move seeds away from the parent plant. The further a seed travels, the less competition it faces, the fewer parent-specific pathogens it encounters, and the more genetically diverse its potential mates.

Dispersal distance follows a pattern: most seeds land close to the parent (the "seed shadow"), with exponentially fewer seeds reaching greater distances. But those few long-distance seeds are disproportionately important — they colonize new habitats, found new populations, and drive species range expansion.

Evolution has produced an astonishing variety of dispersal mechanisms: wind, water, animals, explosion, and even fire.`,
      analogy: 'Seed dispersal is like teenagers leaving home. If every child stayed in their parents\' house forever, the house would be overcrowded, resources would run out, and everyone would get the same family illnesses. Moving out (dispersal) means access to new resources, new social connections, and independence. Most don\'t move far (the neighboring town), but a few move across the world — and those adventurers are the ones who colonize new territories.',
      storyConnection: 'In "The Seed That Traveled a Thousand Miles," a tiny seed journeys far from its parent plant to find new ground. The story captures the essential truth of dispersal ecology: survival requires distance. Every forest, meadow, and marsh exists because seeds once traveled to places where no plant of that species had been before.',
      checkQuestion: 'If a tree produces 100,000 seeds per year and each seed has a 0.001% chance of surviving to adulthood, how many new trees does it produce per year? Over its 200-year lifetime?',
      checkAnswer: 'Per year: 100,000 * 0.00001 = 1 tree. Over 200 years: 200 trees. But for a stable population, each parent only needs to produce ONE surviving offspring in its entire lifetime (to replace itself). The other 199 are "bonus" — they either die, colonize new areas, or replace trees that died. The 99.999% failure rate is normal. Seed dispersal is a numbers game played with enormous overproduction.',
      codeIntro: 'Model the seed shadow — how seed density decreases with distance from the parent.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Seed shadow model: exponential decay with distance
# Most seeds close, few far away

# Generate 10,000 seed landing positions
n_seeds = 10000
# Distance follows an exponential distribution
mean_distance = 10  # meters (typical for medium tree)
distances = np.random.exponential(mean_distance, n_seeds)

# Convert to 2D positions (random angle)
angles = np.random.uniform(0, 2 * np.pi, n_seeds)
x = distances * np.cos(angles)
y = distances * np.sin(angles)

# Survival probability: increases with distance (Janzen-Connell)
# But decreases beyond optimal (unfavorable habitat)
survival_prob = np.exp(-0.5 * ((distances - 15) / 8) ** 2) * 0.01

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Seed rain map
ax1.set_facecolor('#111827')
ax1.scatter(x, y, s=1, alpha=0.3, color='#f59e0b')
ax1.plot(0, 0, '*', color='#22c55e', markersize=20, label='Parent tree')
for r in [10, 20, 30, 40]:
    circle = plt.Circle((0, 0), r, fill=False, color='gray', linewidth=0.5, linestyle=':')
    ax1.add_patch(circle)
    ax1.text(r * 0.7, r * 0.7, f'{r}m', color='gray', fontsize=8)
ax1.set_xlim(-50, 50)
ax1.set_ylim(-50, 50)
ax1.set_aspect('equal')
ax1.set_xlabel('East (m)', color='white')
ax1.set_ylabel('North (m)', color='white')
ax1.set_title('Seed Shadow: 10,000 Seeds from One Tree', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Distance histogram
ax2.set_facecolor('#111827')
ax2.hist(distances, bins=50, color='#f59e0b', alpha=0.7, edgecolor='none')
ax2.axvline(np.median(distances), color='#22c55e', linestyle='--', linewidth=2,
            label=f'Median: {np.median(distances):.0f}m')
ax2.axvline(np.percentile(distances, 95), color='#ef4444', linestyle='--', linewidth=2,
            label=f'95th %ile: {np.percentile(distances, 95):.0f}m')
ax2.set_xlabel('Distance from parent (m)', color='white')
ax2.set_ylabel('Number of seeds', color='white')
ax2.set_title('Seed Dispersal Distance Distribution', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Janzen-Connell: seed density vs survival
ax3.set_facecolor('#111827')
dist_range = np.linspace(0, 50, 200)
seed_density = 1000 * np.exp(-dist_range / mean_distance) / (2 * np.pi * dist_range + 0.1)
survival = np.exp(-0.5 * ((dist_range - 15) / 8) ** 2) * 0.01
recruitment = seed_density * survival

ax3.plot(dist_range, seed_density / max(seed_density), color='#f59e0b', linewidth=2,
         label='Seed density (normalized)')
ax3.plot(dist_range, survival / max(survival), color='#22c55e', linewidth=2,
         label='Survival probability')
ax3.plot(dist_range, recruitment / max(recruitment + 0.001), color='#a855f7', linewidth=2,
         label='Recruitment (density x survival)')
ax3.set_xlabel('Distance from parent (m)', color='white')
ax3.set_ylabel('Relative value', color='white')
ax3.set_title('Janzen-Connell Effect: Recruitment Peak', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax3.tick_params(colors='gray')
peak_dist = dist_range[np.argmax(recruitment)]
ax3.axvline(peak_dist, color='#a855f7', linestyle=':', linewidth=1)
ax3.annotate(f'Optimal recruitment\\ndistance: {peak_dist:.0f}m', xy=(peak_dist, 0.8),
             color='#a855f7', fontsize=10, ha='center')

# Dispersal mechanism comparison
ax4.set_facecolor('#111827')
mechanisms = ['Gravity', 'Wind\\n(light)', 'Wind\\n(wing)', 'Animal\\n(cache)', 'Water', 'Explosive']
avg_dist = [2, 50, 200, 500, 5000, 10]
max_dist = [5, 200, 2000, 10000, 100000, 30]
colors_mech = ['#6b7280', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444']

bars = ax4.barh(mechanisms, avg_dist, color=colors_mech, height=0.6, alpha=0.7, label='Average')
ax4.barh(mechanisms, max_dist, color=colors_mech, height=0.3, alpha=0.3, label='Maximum')
ax4.set_xscale('log')
ax4.set_xlabel('Dispersal distance (m, log scale)', color='white')
ax4.set_title('Dispersal Distance by Mechanism', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Seed dispersal statistics:")
print(f"  Seeds simulated: {n_seeds:,}")
print(f"  Mean distance: {np.mean(distances):.1f}m")
print(f"  Median distance: {np.median(distances):.1f}m")
print(f"  95th percentile: {np.percentile(distances, 95):.1f}m")
print(f"  Maximum: {np.max(distances):.1f}m")
print(f"  Optimal recruitment distance: ~{peak_dist:.0f}m")
print()
print("Most seeds fail. The few that travel far and survive")
print("are the ones that expand the species' range.")`,
      challenge: 'Change the mean dispersal distance from 10 to 50 meters (simulating a wind-dispersed species like a maple). How does the seed shadow change? Does the Janzen-Connell optimal recruitment distance shift proportionally?',
      successHint: 'The seed shadow is the foundation of plant population ecology. Every forest\'s spatial structure — which trees grow where — is determined by how far seeds travel and where they survive.',
    },
    {
      title: 'Wind dispersal — dandelions, maples, and the physics of flight',
      concept: `Wind-dispersed seeds use aerodynamic structures to stay airborne longer and travel further:

**Pappus (dandelion type)**: A parachute of fine hairs that creates drag. The dandelion pappus has 100+ filaments creating a porous disc. Recent research (2018) showed that air doesn't just flow around the pappus — it creates a stable vortex ring ABOVE it, providing additional lift. The porosity is precisely tuned: too dense and it falls like a solid disc; too sparse and air passes through without creating lift.

**Samara (maple type)**: A single wing that autorotates. The maple seed spins at 1,000-2,000 RPM, creating a leading-edge vortex on the wing (the same mechanism that keeps insects airborne). This vortex generates lift that slows the descent.

**Dust seeds (orchid type)**: Some orchid seeds are so tiny (0.05 mg) that they're essentially airborne dust particles. They can travel thousands of kilometers in the upper atmosphere.

**Key physics**: A seed's flight depends on its **terminal velocity** — the speed at which air resistance equals gravity:
- High terminal velocity (heavy, smooth) = falls fast, travels short distance
- Low terminal velocity (light, hairy/winged) = falls slow, travels far

Terminal velocity: **v_t = sqrt(2*m*g / (rho*A*C_d))**

Where m = mass, A = area, C_d = drag coefficient, rho = air density.`,
      analogy: 'Wind-dispersed seeds are like different types of paper airplanes. A crumpled ball (gravity-only seed) drops straight down. A flat sheet (samara) glides and spins. A ball of cotton with a weight (dandelion) drifts in the breeze. Each design sacrifices weight-carrying capacity for flight time. Evolution has optimized each "airplane" for its specific size and wind environment.',
      storyConnection: 'The seed in our story "traveled a thousand miles." For a wind-dispersed seed, this is entirely possible. Orchid seeds have been found 4,000 km from the nearest source population. The story isn\'t fantasy — it\'s aerodynamics. A dust-light seed caught in the right wind pattern can circle the globe.',
      checkQuestion: 'A dandelion seed weighs 0.5 mg and has a pappus diameter of 5 mm. A maple seed weighs 100 mg and has a wing span of 40 mm. Which has a lower terminal velocity, and which travels further?',
      checkAnswer: 'The dandelion has much lower terminal velocity (~0.3 m/s vs ~1 m/s for maple) because its mass-to-drag-area ratio is much smaller. But which travels further depends on release height and wind speed. In calm conditions, the maple\'s autorotation gives it a glide ratio (horizontal/vertical distance) of 3:1, while the dandelion mostly drifts vertically. In wind, the dandelion\'s low terminal velocity keeps it airborne longer, allowing wind to carry it further. In gusty, open environments: dandelion wins. In still forests: maple wins.',
      codeIntro: 'Simulate the flight paths of different wind-dispersed seeds.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Seed flight simulation
# Simplified 2D (horizontal distance vs height)

def simulate_seed_flight(mass_mg, area_mm2, Cd, release_height, wind_speed,
                          n_sims=500, autorotate=False):
    """Simulate seed dispersal with wind."""
    mass = mass_mg * 1e-6  # kg
    area = area_mm2 * 1e-6  # m^2
    rho = 1.225  # air density kg/m^3
    g = 9.8

    # Terminal velocity
    v_t = np.sqrt(2 * mass * g / (rho * area * Cd))

    # Simulate trajectories
    dt = 0.1  # seconds
    max_time = 300  # seconds

    landing_distances = []
    flight_times = []
    # Store one trajectory for plotting
    traj_x, traj_y = [0], [release_height]

    for sim in range(n_sims):
        x, y = 0.0, release_height
        vx, vy = 0.0, 0.0
        t = 0

        while y > 0 and t < max_time:
            # Wind (with turbulence)
            local_wind = wind_speed + np.random.normal(0, wind_speed * 0.3)

            # Vertical: terminal velocity descent
            vy = -v_t

            # Horizontal: wind + some lateral drift
            if autorotate:
                # Maple-type: glide ratio
                vx = local_wind + v_t * 2  # glide ratio ~2:1
            else:
                vx = local_wind + np.random.normal(0, 0.5)

            x += vx * dt
            y += vy * dt
            t += dt

            if sim == 0:
                traj_x.append(x)
                traj_y.append(max(y, 0))

        landing_distances.append(x)
        flight_times.append(t)

    return np.array(landing_distances), np.array(flight_times), traj_x, traj_y, v_t

# Different seed types
seeds = {
    'Dandelion': {'mass': 0.5, 'area': 20, 'Cd': 1.5, 'height': 0.5, 'wind': 3, 'auto': False},
    'Maple samara': {'mass': 100, 'area': 800, 'Cd': 1.2, 'height': 15, 'wind': 3, 'auto': True},
    'Orchid dust seed': {'mass': 0.001, 'area': 0.5, 'Cd': 2.0, 'height': 1, 'wind': 5, 'auto': False},
    'Elm wing': {'mass': 10, 'area': 100, 'Cd': 1.3, 'height': 20, 'wind': 3, 'auto': False},
}

colors_seed = {'Dandelion': '#f59e0b', 'Maple samara': '#22c55e',
               'Orchid dust seed': '#a855f7', 'Elm wing': '#3b82f6'}

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Sample trajectories
ax1.set_facecolor('#111827')
results = {}
for name, params in seeds.items():
    dist, times, tx, ty, vt = simulate_seed_flight(
        params['mass'], params['area'], params['Cd'],
        params['height'], params['wind'], autorotate=params['auto'])
    results[name] = {'dist': dist, 'times': times, 'vt': vt}
    ax1.plot(tx[:200], ty[:200], color=colors_seed[name], linewidth=2, label=name)

ax1.set_xlabel('Horizontal distance (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Sample Flight Trajectories', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_ylim(-1, 25)

# Landing distance distributions
ax2.set_facecolor('#111827')
for name in seeds:
    dist = results[name]['dist']
    ax2.hist(dist, bins=30, alpha=0.5, color=colors_seed[name], label=name, density=True)
ax2.set_xlabel('Landing distance (m)', color='white')
ax2.set_ylabel('Probability density', color='white')
ax2.set_title('Landing Distance Distributions', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

# Terminal velocity comparison
ax3.set_facecolor('#111827')
names = list(seeds.keys())
v_ts = [results[n]['vt'] for n in names]
bars3 = ax3.barh(names, v_ts, color=[colors_seed[n] for n in names], height=0.6)
ax3.set_xlabel('Terminal velocity (m/s)', color='white')
ax3.set_title('Terminal Velocity: Slower = Farther', color='white', fontsize=12)
ax3.tick_params(colors='gray')
for bar, v in zip(bars3, v_ts):
    ax3.text(bar.get_width() + 0.02, bar.get_y() + bar.get_height()/2,
             f'{v:.3f} m/s', va='center', color='white', fontsize=10)

# Wind speed sensitivity
ax4.set_facecolor('#111827')
wind_speeds = np.linspace(0, 10, 20)
for name in ['Dandelion', 'Maple samara']:
    mean_dists = []
    for ws in wind_speeds:
        params = seeds[name].copy()
        dist, _, _, _, _ = simulate_seed_flight(
            params['mass'], params['area'], params['Cd'],
            params['height'], ws, n_sims=100, autorotate=params['auto'])
        mean_dists.append(np.mean(dist))
    ax4.plot(wind_speeds, mean_dists, 'o-', color=colors_seed[name], linewidth=2, label=name)

ax4.set_xlabel('Wind speed (m/s)', color='white')
ax4.set_ylabel('Mean dispersal distance (m)', color='white')
ax4.set_title('How Wind Speed Affects Dispersal', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Seed flight comparison:")
for name in seeds:
    d = results[name]['dist']
    print(f"  {name}:")
    print(f"    Terminal velocity: {results[name]['vt']:.4f} m/s")
    print(f"    Mean distance: {np.mean(d):.1f}m")
    print(f"    Max distance: {np.max(d):.1f}m")`,
      challenge: 'Add turbulence to the simulation: random vertical gusts that occasionally lift the seed higher. How does turbulence affect the dandelion vs. the maple? Which seed type benefits more from gusty conditions?',
      successHint: 'Wind dispersal is applied aerodynamics. The same physics that governs airplane wings and helicopter rotors explains how seeds fly. Each seed type is an evolved solution to the problem of staying airborne.',
    },
    {
      title: 'Water dispersal — coconuts, mangroves, and ocean currents',
      concept: `**Hydrochory** — seed dispersal by water — allows seeds to travel enormous distances:

**River dispersal**: Seeds fall into streams and rivers, traveling downstream. Many riparian (riverbank) plants use this: willows, alders, sedges. Distance: meters to hundreds of kilometers.

**Ocean dispersal**: Seeds adapted for ocean travel have:
- Waterproof outer coating (prevents salt damage)
- Air spaces for buoyancy
- Thick endosperm (food reserves for long journeys)
- Ability to survive months in salt water

The **coconut** is the champion ocean traveler:
- Thick fibrous husk (buoyancy + impact protection)
- Watertight inner shell
- Liquid endosperm (coconut water) provides nutrients
- Can remain viable after 110+ days at sea
- Has colonized every tropical coastline on Earth

**Mangrove propagules** (vivipary): Mangrove seeds germinate ON the parent tree. The seedling grows a long, torpedo-shaped root (propagule) while still attached. When it drops, the heavy root end sticks in the mud. If it lands in water, it floats upright and drifts until it finds suitable mud.

Ocean currents are like highways for seeds. The Gulf Stream, Kuroshio Current, and Antarctic Circumpolar Current move water (and seeds) across entire ocean basins.`,
      analogy: 'Water-dispersed seeds are like messages in bottles. The coconut is a large, well-sealed bottle with food and water inside — it can survive months at sea. The mangrove propagule is like a self-righting bottle with a weighted bottom — it floats upright and plants itself when it reaches shore. River-dispersed seeds are like paper boats — light, short-lived, but carried quickly downstream.',
      storyConnection: 'The seed in our story traveled a thousand miles. By water, this is routine. Coconuts from Southeast Asia have been found on the beaches of East Africa (6,000+ km). The ocean is the world\'s longest-distance seed dispersal system. The story\'s "thousand miles" is conservative for an ocean-going seed.',
      checkQuestion: 'If a coconut can survive 110 days at sea and ocean currents move at 0.5-2 m/s, how far could a coconut theoretically travel?',
      checkAnswer: 'At 1 m/s average: 110 days * 24 hours * 3600 seconds * 1 m/s = 9,504,000 m = 9,504 km. At 2 m/s: 19,008 km — nearly halfway around the world! In practice, currents aren\'t constant and coconuts don\'t always ride the fastest currents, but 5,000-8,000 km is realistic. This is why coconut palms are found on virtually every tropical coastline, even remote Pacific islands.',
      codeIntro: 'Simulate coconut dispersal across ocean currents.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Ocean dispersal simulation
# Simplified model: seeds riding currents with diffusion

n_seeds = 500
max_days = 120
dt = 1  # days

# Simple current field (eastward with some variation)
current_speed = 1.0  # m/s base
current_direction = 80  # degrees (mostly east)

# Simulate trajectories
trajectories_x = np.zeros((n_seeds, max_days))
trajectories_y = np.zeros((n_seeds, max_days))
survival = np.ones(n_seeds, dtype=bool)

for seed in range(n_seeds):
    x, y = 0, 0
    for day in range(max_days):
        if not survival[seed]:
            trajectories_x[seed, day:] = np.nan
            trajectories_y[seed, day:] = np.nan
            break

        # Current with daily variation
        speed = current_speed + np.random.normal(0, 0.3)
        direction = current_direction + np.random.normal(0, 30)
        dir_rad = np.radians(direction)

        # Daily displacement (m/s * 86400 s/day -> m/day, convert to km)
        dx = speed * np.cos(dir_rad) * 86400 / 1000  # km/day
        dy = speed * np.sin(dir_rad) * 86400 / 1000

        # Random diffusion
        dx += np.random.normal(0, 10)
        dy += np.random.normal(0, 10)

        x += dx
        y += dy
        trajectories_x[seed, day] = x
        trajectories_y[seed, day] = y

        # Survival probability decreases over time
        if np.random.random() < 0.005:  # 0.5% daily death rate
            survival[seed] = False

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Trajectory map
ax1.set_facecolor('#111827')
for seed in range(min(50, n_seeds)):
    tx = trajectories_x[seed]
    ty = trajectories_y[seed]
    valid = ~np.isnan(tx)
    if np.any(valid):
        color = '#22c55e' if survival[seed] else '#ef4444'
        ax1.plot(tx[valid], ty[valid], alpha=0.3, linewidth=0.5, color=color)

ax1.plot(0, 0, '*', color='#f59e0b', markersize=15, label='Launch point')
ax1.set_xlabel('East-West (km)', color='white')
ax1.set_ylabel('North-South (km)', color='white')
ax1.set_title('Coconut Drift Trajectories (120 days)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Final distance histogram
ax2.set_facecolor('#111827')
final_distances = np.sqrt(trajectories_x[:, -1]**2 + trajectories_y[:, -1]**2)
final_distances_alive = final_distances[survival]
final_distances_dead = final_distances[~survival]

ax2.hist(final_distances_alive, bins=30, color='#22c55e', alpha=0.7, label='Viable seeds')
ax2.hist(final_distances_dead, bins=30, color='#ef4444', alpha=0.5, label='Dead seeds')
ax2.set_xlabel('Distance from origin (km)', color='white')
ax2.set_ylabel('Number of seeds', color='white')
ax2.set_title('Landing Distance (Viable vs Dead)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Survival over time
ax3.set_facecolor('#111827')
days = np.arange(max_days)
surviving_count = np.zeros(max_days)
for day in range(max_days):
    surviving_count[day] = np.sum(~np.isnan(trajectories_x[:, day]))

ax3.plot(days, surviving_count / n_seeds * 100, color='#3b82f6', linewidth=2)
ax3.fill_between(days, surviving_count / n_seeds * 100, alpha=0.15, color='#3b82f6')
ax3.set_xlabel('Days at sea', color='white')
ax3.set_ylabel('Seeds still viable (%)', color='white')
ax3.set_title('Seed Viability Decreases Over Time', color='white', fontsize=12)
ax3.tick_params(colors='gray')

# Compare water-dispersed species
ax4.set_facecolor('#111827')
species = ['Coconut', 'Mangrove\\npropagule', 'Sea bean', 'Lotus seed', 'Willow\\n(river)']
max_survival_days = [120, 60, 365, 30, 5]
max_distance_km = [9000, 3000, 15000, 50, 100]
buoyancy_months = [12, 3, 24, 1, 0.1]
colors_sp = ['#f59e0b', '#22c55e', '#a855f7', '#ec4899', '#3b82f6']

x = np.arange(len(species))
width = 0.25
bars_d = ax4.bar(x - width, [d / 100 for d in max_distance_km], width,
                 label='Max distance (100s km)', color='#3b82f6')
bars_s = ax4.bar(x, max_survival_days, width, label='Max survival (days)', color='#22c55e')
bars_b = ax4.bar(x + width, [b * 30 for b in buoyancy_months], width,
                 label='Buoyancy (days)', color='#f59e0b')

ax4.set_xticks(x)
ax4.set_xticklabels(species, color='white', fontsize=9)
ax4.set_ylabel('Value', color='white')
ax4.set_title('Water Dispersal Champions', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Coconut dispersal simulation ({n_seeds} seeds, {max_days} days):")
print(f"  Survived: {np.sum(survival)} ({np.sum(survival)/n_seeds*100:.0f}%)")
print(f"  Mean distance (alive): {np.nanmean(final_distances_alive):.0f} km")
print(f"  Max distance (alive): {np.nanmax(final_distances_alive):.0f} km")
print()
print("The coconut palm colonized the entire tropical world")
print("using nothing but ocean currents, a waterproof shell,")
print("and a food supply (coconut water) for the journey.")`,
      challenge: 'Add a "coastline" at x=5000 km. Seeds that reach the coast stop and potentially germinate. What percentage of seeds reach the coast? Add a second coastline at x=8000 km. How does this model island colonization?',
      successHint: 'Water dispersal connects continents and colonizes islands. Every coral atoll with a coconut palm is evidence of a seed that traveled thousands of kilometers across open ocean. The physics of buoyancy and ocean currents writes the geography of tropical forests.',
    },
    {
      title: 'Animal dispersal — burrs, fruit, and the partnership',
      concept: `**Zoochory** — seed dispersal by animals — comes in two main forms:

**Epizoochory (external)**: Seeds hitch a ride on the outside of animals.
- **Burrs** (burdock, cocklebur): Hooks that catch in fur/feathers/clothing. George de Mestral invented Velcro after studying burdock burrs on his dog.
- **Sticky seeds** (mistletoe): Coated in sticky mucilage that adheres to bird beaks and feathers.
- **Mud-transported**: Tiny seeds embedded in mud on animal feet.

**Endozoochory (internal)**: Seeds eaten by animals, pass through the digestive system, and are deposited in feces — often far from the parent plant.
- **Fleshy fruits**: Berries, drupes (cherries, mangoes) — the fruit rewards the animal; the seed passes through.
- **Nut caching**: Squirrels, jays, and nutcrackers bury nuts for later retrieval. The forgotten ones germinate. Clark's nutcracker buries 30,000 pine seeds per year and remembers 80% — the 20% it forgets become trees.
- **Ant dispersal (myrmecochory)**: Seeds with elaiosomes (lipid-rich appendages) are carried to ant nests, where ants eat the elaiosome and discard the seed underground — perfect planting depth.

The animal-plant partnership is a **mutualism**: the plant gets dispersal; the animal gets food. This co-evolution has shaped both the plants (fruit color, seed coating) and the animals (color vision, digestive chemistry).`,
      analogy: 'Animal dispersal is like a delivery service where the couriers don\'t know they\'re delivering. External dispersal (burrs) is like sticking a postage-free package on someone\'s backpack — they carry it unknowingly and drop it somewhere random. Internal dispersal (fruit) is like offering free pizza to a delivery driver — they eat the pizza (fruit) and the box (seed) gets deposited later. Caching is like a squirrel Amazon warehouse with a 20% "lost package" rate.',
      storyConnection: 'Our story\'s seed "traveled a thousand miles." An animal-dispersed seed can achieve this through a relay: a bird eats a berry, flies 50 km, deposits the seed. That seed grows, fruits, and another bird carries it 50 km further. Over generations, the species moves across continents. The "thousand-mile journey" is really a relay race across dozens of animal partners.',
      checkQuestion: 'Many tropical fruits are large (mango, avocado, durian). Their seeds are too big for any living animal to swallow whole. Why are they so large?',
      checkAnswer: 'They evolved for animals that no longer exist. Avocados co-evolved with giant ground sloths (Megatherium, extinct ~10,000 years ago) that could swallow them whole. Osage oranges were dispersed by mammoths. The fruit is an "evolutionary anachronism" — a design for a partner that went extinct. Today, these fruits are dispersed only by humans and water. Without us, they would likely go extinct too.',
      codeIntro: 'Simulate different animal dispersal mechanisms and their effectiveness.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Animal dispersal simulation

def simulate_dispersal(n_seeds, mechanism):
    """Simulate seed dispersal by different animal mechanisms."""
    if mechanism == 'burr_mammal':
        # Seeds stick to fur, fall off randomly during travel
        distances = np.random.exponential(200, n_seeds)  # meters
        angles = np.random.uniform(0, 2 * np.pi, n_seeds)
    elif mechanism == 'fruit_bird':
        # Birds eat fruit, fly, deposit in feces
        # Gut passage time: 30min - 4 hours, flight speed: 30 km/h
        gut_time = np.random.lognormal(np.log(1), 0.5, n_seeds)  # hours
        distances = gut_time * 15000 + np.random.normal(0, 500, n_seeds)  # meters
        angles = np.random.uniform(0, 2 * np.pi, n_seeds)
    elif mechanism == 'nut_cache':
        # Squirrels cache nuts within territory
        distances = np.random.lognormal(np.log(30), 0.7, n_seeds)  # meters
        angles = np.random.uniform(0, 2 * np.pi, n_seeds)
        # 80% retrieved (not dispersed), 20% forgotten (dispersed)
        retrieved = np.random.random(n_seeds) < 0.8
        distances[retrieved] = 0  # retrieved = not dispersed
    elif mechanism == 'ant':
        # Ants carry to nest (short distance, good microsite)
        distances = np.random.exponential(3, n_seeds)  # meters
        angles = np.random.uniform(0, 2 * np.pi, n_seeds)

    x = distances * np.cos(angles)
    y = distances * np.sin(angles)
    return x, y, distances

n_seeds = 2000
mechanisms = {
    'Burr on mammal': 'burr_mammal',
    'Fruit eaten by bird': 'fruit_bird',
    'Nut cached by squirrel': 'nut_cache',
    'Seed carried by ants': 'ant',
}
colors_m = {'Burr on mammal': '#f59e0b', 'Fruit eaten by bird': '#3b82f6',
            'Nut cached by squirrel': '#22c55e', 'Seed carried by ants': '#a855f7'}

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

results = {}
for idx, (name, mech) in enumerate(mechanisms.items()):
    ax = axes[idx // 2][idx % 2]
    ax.set_facecolor('#111827')

    x, y, dist = simulate_dispersal(n_seeds, mech)
    results[name] = dist

    # Plot seed positions
    valid = dist > 0
    ax.scatter(x[valid], y[valid], s=2, alpha=0.4, color=colors_m[name])
    ax.plot(0, 0, '*', color='white', markersize=12)

    # Statistics
    effective = dist[dist > 0]
    if len(effective) > 0:
        mean_d = np.mean(effective)
        max_d = np.max(effective)
        median_d = np.median(effective)
        pct_dispersed = np.sum(valid) / n_seeds * 100
    else:
        mean_d = max_d = median_d = 0
        pct_dispersed = 0

    ax.set_title(f'{name}\\n(mean: {mean_d:.0f}m, max: {max_d:.0f}m, {pct_dispersed:.0f}% dispersed)',
                 color='white', fontsize=10)
    ax.set_xlabel('m', color='white')
    ax.set_ylabel('m', color='white')
    ax.set_aspect('equal')
    ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Summary comparison
print("Animal dispersal comparison:")
for name, dist in results.items():
    effective = dist[dist > 0]
    if len(effective) > 0:
        print(f"  {name}:")
        print(f"    Seeds dispersed: {len(effective)}/{n_seeds} ({len(effective)/n_seeds*100:.0f}%)")
        print(f"    Mean distance: {np.mean(effective):.0f}m")
        print(f"    Median distance: {np.median(effective):.0f}m")
        print(f"    Max distance: {np.max(effective):.0f}m")
    else:
        print(f"  {name}: No effective dispersal")
print()
print("Birds provide the longest distances (fruit dispersal).")
print("Ants provide the best microsites (underground planting).")
print("Squirrels provide medium distance + good burial depth.")
print("Burrs provide medium distance but random deposition.")`,
      challenge: 'Model the Velcro effect: a burr seed that attaches to a dog on a walk. The dog walks at 5 km/h on random paths through a park. Seeds fall off with a 2% probability per minute. Simulate 100 seeds and plot their landing positions.',
      successHint: 'Animal dispersal is the most common mechanism in tropical forests. Understanding the animal-plant mutualism explains why fruit exists, why forests have the species they do, and why extinction of animal partners threatens plant survival.',
    },
    {
      title: 'Explosive dispersal — seeds that launch themselves',
      concept: `Some plants don't wait for wind, water, or animals. They **ballistically eject** their seeds using stored mechanical energy:

**Tension mechanisms**:
- **Impatiens (touch-me-not)**: Seed pods build up turgor pressure. When ripe, a touch causes the pod walls to curl explosively inward, flinging seeds up to 5 meters.
- **Witch hazel**: Pods dry and contract, compressing the seeds. When tension exceeds the pod's strength, seeds shoot out at up to 12 m/s.

**Squirting mechanisms**:
- **Squirting cucumber (Ecballium)**: Fruit detaches from stem, and internal pressure squirts seeds + fluid out the stem end like a water cannon. Range: 6 meters. Ejection speed: 10 m/s.

**Explosive fruits**:
- **Sandbox tree (Hura crepitans)**: Fruit explodes with a bang audible 100 meters away. Seeds launched at 70 m/s (250 km/h). Range: up to 45 meters.
- **Dynamite tree** is another name for it — the explosions can injure people.

The physics: stored elastic energy (from drying, turgor pressure, or tissue tension) is released rapidly, accelerating the seed. The energy density of some plant ballistic systems rivals that of rubber bands.

**Acceleration**: The sandbox tree's seeds experience accelerations of up to **7,000g** during launch — comparable to a bullet leaving a gun. This makes it one of the fastest biological movements.`,
      analogy: 'Explosive seed dispersal is like a catapult or a slingshot. The plant stores energy slowly (tension building up over days) and releases it instantly (milliseconds). It\'s the same principle as a spring-loaded mouse trap: slow loading, fast release. The plant is both the archer and the arrow factory.',
      storyConnection: 'Our story\'s seed traveled far through patience and partnership. Explosive dispersal is the opposite — it\'s impatient, violent, and independent. No wind needed, no animal partner, no water. Just raw physics. Some seeds don\'t travel a thousand miles; they travel ten meters at the speed of a bullet. Sometimes a short, fast trip is all you need.',
      checkQuestion: 'The sandbox tree launches seeds at 70 m/s. A baseball pitcher throws at ~42 m/s. How does a PLANT exceed the speed of a professional athlete?',
      checkAnswer: 'The key is not force but energy release rate. The tree accumulates elastic energy over weeks as the fruit dries and internal pressure builds. The release happens in milliseconds (not the ~200 ms of a pitcher\'s throw). This means the power output (energy/time) can be enormous even though the total energy is modest. It\'s the same principle as a firecracker vs. a campfire: same total energy, but released in microseconds vs. hours.',
      codeIntro: 'Model the physics of explosive seed ejection.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Ballistic seed ejection physics

g = 9.8  # m/s^2

def ballistic_trajectory(v0, theta_deg, h0=1.0):
    """Calculate ballistic trajectory given launch speed and angle."""
    theta = np.radians(theta_deg)
    vx = v0 * np.cos(theta)
    vy = v0 * np.sin(theta)

    # Time of flight (quadratic formula)
    discriminant = vy**2 + 2 * g * h0
    if discriminant < 0:
        return np.array([0]), np.array([h0]), 0
    t_flight = (vy + np.sqrt(discriminant)) / g

    t = np.linspace(0, t_flight, 200)
    x = vx * t
    y = h0 + vy * t - 0.5 * g * t**2

    range_m = vx * t_flight
    return x, y, range_m

# Different explosive species
species = {
    'Impatiens': {'v0': 3, 'angle': 45, 'height': 0.3, 'color': '#a855f7'},
    'Witch hazel': {'v0': 12, 'angle': 40, 'height': 2, 'color': '#3b82f6'},
    'Squirting cucumber': {'v0': 10, 'angle': 30, 'height': 0.2, 'color': '#f59e0b'},
    'Sandbox tree': {'v0': 70, 'angle': 35, 'height': 5, 'color': '#ef4444'},
}

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Trajectories
ax1.set_facecolor('#111827')
ranges = {}
for name, params in species.items():
    x, y, r = ballistic_trajectory(params['v0'], params['angle'], params['height'])
    ranges[name] = r
    ax1.plot(x, y, color=params['color'], linewidth=2, label=f'{name} ({r:.0f}m)')

ax1.axhline(0, color='gray', linewidth=0.5)
ax1.set_xlabel('Horizontal distance (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Ballistic Seed Trajectories', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Launch speed comparison
ax2.set_facecolor('#111827')
speed_comparison = {
    'Impatiens': 3, 'Squirting cucumber': 10, 'Witch hazel': 12,
    'Sandbox tree': 70, 'Baseball pitch': 42, 'Tennis serve': 55,
}
names_s = list(speed_comparison.keys())
speeds = list(speed_comparison.values())
colors_s = ['#a855f7', '#f59e0b', '#3b82f6', '#ef4444', '#6b7280', '#6b7280']
bars = ax2.barh(names_s, speeds, color=colors_s, height=0.6)
ax2.set_xlabel('Launch speed (m/s)', color='white')
ax2.set_title('Speed: Plants vs Athletes', color='white', fontsize=12)
ax2.tick_params(colors='gray')
for bar, s in zip(bars, speeds):
    ax2.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
             f'{s} m/s ({s*3.6:.0f} km/h)', va='center', color='white', fontsize=9)

# Acceleration comparison
ax3.set_facecolor('#111827')
# Acceleration = v / t_launch
accel_data = {
    'Impatiens': 3 / 0.005,       # 3 m/s in 5 ms
    'Witch hazel': 12 / 0.001,    # 12 m/s in 1 ms
    'Sandbox tree': 70 / 0.0005,  # 70 m/s in 0.5 ms
    'Bullet (gun)': 900 / 0.001,  # 900 m/s in 1 ms
    'Human sneeze': 5 / 0.1,      # 5 m/s in 100 ms
}
a_names = list(accel_data.keys())
a_values = [v / g for v in accel_data.values()]  # in g
a_colors = ['#a855f7', '#3b82f6', '#ef4444', '#6b7280', '#22c55e']

bars3 = ax3.barh(a_names, a_values, color=a_colors, height=0.6)
ax3.set_xscale('log')
ax3.set_xlabel('Acceleration (g-forces, log scale)', color='white')
ax3.set_title('Launch Acceleration', color='white', fontsize=12)
ax3.tick_params(colors='gray')
for bar, a in zip(bars3, a_values):
    ax3.text(bar.get_width() * 1.3, bar.get_y() + bar.get_height()/2,
             f'{a:,.0f}g', va='center', color='white', fontsize=9)

# Optimal launch angle
ax4.set_facecolor('#111827')
angles = np.linspace(5, 85, 100)
for name in ['Impatiens', 'Sandbox tree']:
    params = species[name]
    ranges_angle = []
    for angle in angles:
        _, _, r = ballistic_trajectory(params['v0'], angle, params['height'])
        ranges_angle.append(r)
    ax4.plot(angles, ranges_angle, color=params['color'], linewidth=2, label=name)

ax4.axvline(45, color='white', linestyle=':', linewidth=1, label='45 deg (theoretical optimum)')
ax4.set_xlabel('Launch angle (degrees)', color='white')
ax4.set_ylabel('Range (m)', color='white')
ax4.set_title('Range vs Launch Angle', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Explosive seed dispersal:")
for name, r in ranges.items():
    v = species[name]['v0']
    print(f"  {name}: {v} m/s launch, {r:.0f}m range")
print()
print("The sandbox tree seed experiences ~14,000g during launch —")
print("more than most military ordinance.")
print("Nature's ballistics are surprisingly violent.")`,
      challenge: 'Add air resistance to the simulation (drag force proportional to v^2). A 0.5g sandbox tree seed has a cross-sectional area of ~1 cm^2. How much does air drag reduce the range? At 70 m/s, is air resistance significant?',
      successHint: 'Explosive dispersal demonstrates that plants can generate remarkable forces and accelerations. The physics is identical to ballistics, catapults, and spring-loaded mechanisms — principles used in everything from medieval warfare to spacecraft deployment.',
    },
    {
      title: 'Human-aided dispersal — the most powerful force in seed movement',
      concept: `Humans are the most powerful seed dispersal agents on Earth. We move seeds:

**Intentionally**:
- Agriculture: We deliberately plant crops on every continent (rice from China to California, potatoes from Peru to Ireland)
- Gardening: Ornamental plants moved globally (tulips from Central Asia to Netherlands)
- Forestry: Trees planted far from native range (eucalyptus from Australia to everywhere)
- Seed banks: We store seeds in climate-controlled vaults (Svalbard Global Seed Vault holds 1.2 million samples)

**Unintentionally**:
- Ballast water: Ships carry seeds in ballast water (water hyacinth, a major invasive species, spread this way)
- Contaminated grain: Weed seeds mixed with crop seeds travel in trade
- Vehicles: Seeds stuck in tire treads, clothing, cargo
- Soil movement: Construction, landscaping moves seed-laden soil

**The scale is unprecedented**: No natural process moves seeds as far, as fast, or in as many directions as human transportation. We've moved species across oceans, between continents, and to islands that were previously unreachable.

**Consequences**: About 40% of plant species classified as "invasive" were introduced by humans. The globalization of plant species is one of the most dramatic ecological changes in Earth's history — and it happened in just a few centuries.`,
      analogy: 'Humans are like FedEx for seeds — we deliver packages (seeds) to every address on the planet, often without even knowing we\'re doing it. Before humans, seeds had to rely on wind (postal service — slow, unreliable), water (container ships — limited routes), or animals (local delivery — short range). Humans added overnight global air freight — and everything changed.',
      storyConnection: 'The seed in our story traveled a thousand miles. In the age of global trade, seeds travel ten thousand miles in a day — in a cargo container, in a traveler\'s backpack, in a bag of rice. Human-aided dispersal makes the story\'s "thousand miles" quaint. The real story is that NO corner of the Earth is beyond human seed movement. Our story\'s seed has gone global.',
      checkQuestion: 'The Svalbard Global Seed Vault stores 1.2 million seed samples from every country. Why is this necessary? Can\'t we just grow the plants when we need them?',
      checkAnswer: 'Three reasons: (1) Extinction — crop varieties are going extinct faster than wild species (75% of crop genetic diversity lost in the 20th century). Once a variety is gone, its unique genes are gone forever. (2) Climate change — we may need genes from heat-tolerant or drought-resistant varieties that aren\'t currently important. (3) Catastrophe insurance — a nuclear war, pandemic, or asteroid impact could destroy all above-ground agriculture. Svalbard is a backup drive for civilization\'s food system. You can\'t grow a plant if you\'ve lost the seed.',
      codeIntro: 'Map and model the global movement of seeds by human activity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Human-aided seed dispersal: scale and consequences

# Intentional vs unintentional introductions over time
decades = np.arange(1500, 2030, 10)
n_decades = len(decades)

# Cumulative species introductions (simplified model)
intentional = 10 * np.cumsum(np.ones(n_decades) * (1 + 0.02 * np.arange(n_decades)))
unintentional = 5 * np.cumsum(np.ones(n_decades) * (1 + 0.03 * np.arange(n_decades)))

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Cumulative introductions
ax1.set_facecolor('#111827')
ax1.plot(decades, intentional, color='#3b82f6', linewidth=2, label='Intentional (crops, gardens)')
ax1.plot(decades, unintentional, color='#ef4444', linewidth=2, label='Unintentional (weeds, stowaways)')
ax1.plot(decades, intentional + unintentional, color='#f59e0b', linewidth=2,
         linestyle='--', label='Total')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Cumulative species introduced', color='white')
ax1.set_title('Plant Species Introductions Over Time', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Speed comparison: natural vs human dispersal
ax2.set_facecolor('#111827')
mechanisms = ['Wind\\n(dandelion)', 'Water\\n(coconut)', 'Bird\\n(fruit)', 'Human\\n(trade)', 'Human\\n(airline)']
speed_km_per_year = [1, 50, 100, 5000, 20000]
colors_speed = ['#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

bars2 = ax2.bar(mechanisms, speed_km_per_year, color=colors_speed, width=0.6)
ax2.set_yscale('log')
ax2.set_ylabel('Dispersal speed (km/year, log scale)', color='white')
ax2.set_title('Dispersal Speed by Mechanism', color='white', fontsize=12)
ax2.tick_params(colors='gray')
for bar, s in zip(bars2, speed_km_per_year):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() * 1.3,
             f'{s:,}', ha='center', color='white', fontsize=9)

# Major invasive plants: impact
ax3.set_facecolor('#111827')
invasives = ['Water\\nhyacinth', 'Japanese\\nknotweed', 'Kudzu', 'Giant\\nhogweed', 'Lantana']
damage_millions = [100, 50, 500, 20, 200]  # estimated annual economic damage ($ millions)
countries_affected = [50, 15, 3, 20, 60]
inv_colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7']

x3 = np.arange(len(invasives))
width3 = 0.35
bars_d = ax3.bar(x3 - width3/2, damage_millions, width3, label='Damage ($M/yr)', color='#ef4444')
bars_c = ax3.bar(x3 + width3/2, [c * 5 for c in countries_affected], width3,
                 label='Countries affected (x5)', color='#3b82f6')
ax3.set_xticks(x3)
ax3.set_xticklabels(invasives, color='white', fontsize=9)
ax3.set_ylabel('Value', color='white')
ax3.set_title('Top Invasive Plant Impacts', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Svalbard Seed Vault statistics
ax4.set_facecolor('#111827')
vault_data = {
    'Rice': 200000,
    'Wheat': 150000,
    'Barley': 80000,
    'Sorghum': 50000,
    'Maize': 40000,
    'Beans': 60000,
    'Others': 620000,
}
names_v = list(vault_data.keys())
samples_v = list(vault_data.values())
colors_v = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7', '#ef4444', '#ec4899', '#6b7280']

wedges, texts, autotexts = ax4.pie(samples_v, labels=names_v, autopct='%1.0f%%',
    colors=colors_v, pctdistance=0.8, textprops={'color': 'white', 'fontsize': 9})
for at in autotexts:
    at.set_fontsize(8)
ax4.set_title(f'Svalbard Seed Vault: {sum(samples_v):,} Samples', color='white', fontsize=12)

plt.tight_layout()
plt.show()

print("Human-aided dispersal by the numbers:")
print(f"  Seeds stored in Svalbard: {sum(samples_v):,}")
print(f"  Crop species moved globally: ~7,000")
print(f"  Invasive plant species worldwide: ~5,000+")
print(f"  Economic damage from invasives: >$1.3 trillion/year globally")
print()
print("From why seeds travel, to wind, water, animals, explosions,")
print("and finally humans — you've traced every mechanism that moves")
print("seeds across the planet. Level 2 goes deeper into the ecology")
print("and evolution of plant distribution.")`,
      challenge: 'Model a biosecurity scenario: a country screens 1% of incoming cargo for invasive seeds. If 10,000 cargo shipments arrive per year and 5% contain invasive seeds, how many invasive introductions occur per year? What screening rate would reduce introductions to near zero?',
      successHint: 'From escape from the parent, to wind, water, animals, explosions, and human transport — you\'ve covered every mechanism seeds use to travel. Level 2 explores the ecological consequences: how does seed dispersal shape the distribution of life on Earth?',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior ecology or physics experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ecology and physics simulations. Click to start.</p>
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