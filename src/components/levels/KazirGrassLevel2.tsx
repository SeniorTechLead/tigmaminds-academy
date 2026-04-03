import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function KazirGrassLevel2() {
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
      title: 'Carrying capacity — how many animals can the grass support?',
      concept: `Every ecosystem has a **carrying capacity** (K) — the maximum population of a species it can sustainably support, given available food, water, space, and shelter.

For Kaziranga's rhinos, K depends primarily on:
- **Grass biomass** available for grazing (tonnes per km^2)
- **Water availability** during dry season
- **Cover density** (rhinos need tall grass for protection)
- **Competition** with other grazers (elephants, buffalo)

The **logistic growth model** describes how populations approach K:
dN/dt = r * N * (1 - N/K)

Where:
- N = current population
- r = intrinsic growth rate
- K = carrying capacity

At low population: growth is nearly exponential (lots of food per animal)
At N = K/2: growth rate is maximum (the inflection point)
At N = K: growth rate drops to zero (population stabilizes)
Above K: population declines (not enough food)

Kaziranga's carrying capacity for rhinos is estimated at ~3,000-3,500 individuals. With ~2,600 rhinos currently, the population is approaching K. This creates a management challenge: should we expand the park, or accept that Kaziranga is "full"?`,
      analogy: 'Carrying capacity is like a restaurant with a fixed number of seats. A few diners (low population) get great service and plenty of food. As the restaurant fills up (approaching K), service deteriorates and food portions shrink. At capacity, new arrivals wait or leave. Exceeding capacity means nobody eats well.',
      storyConnection: 'The story\'s grass "grows tall enough to hide elephants" — but only if there are not too many elephants eating it. Carrying capacity is the balance point: enough animals to maintain the grazing benefit, not so many that the grass cannot recover. The tall grass exists precisely because the animal population is in balance with the grass production.',
      checkQuestion: 'If Kaziranga\'s carrying capacity for rhinos is ~3,000 and the current population is ~2,600, why not celebrate and stop worrying?',
      checkAnswer: 'Several threats reduce effective K over time: (1) Climate change is altering flood patterns, potentially reducing grassland area. (2) Invasive species (Mimosa) are replacing native grass. (3) Encroachment reduces buffer zone area. (4) Poaching removes individuals below K. The carrying capacity is not fixed — it depends on habitat quality, which requires active management. A population at 85% of a shrinking K is more vulnerable than it appears.',
      codeIntro: 'Model logistic growth of the Kaziranga rhino population and explore carrying capacity scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Logistic growth: dN/dt = r * N * (1 - N/K)
def logistic_growth(N0, r, K, years, poaching_rate=0):
    N = np.zeros(years)
    N[0] = N0
    for i in range(1, years):
        dN = r * N[i-1] * (1 - N[i-1] / K)
        N[i] = max(0, N[i-1] + dN - poaching_rate)
    return N

years = 100
time = np.arange(years)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Basic logistic growth
ax = axes[0, 0]
ax.set_facecolor('#111827')
K_values = [2000, 3000, 4000]
colors = ['#3b82f6', '#22c55e', '#f59e0b']
for K, c in zip(K_values, colors):
    N = logistic_growth(366, 0.05, K, years)
    ax.plot(time + 1966, N, linewidth=2, color=c, label=f'K = {K}')
    ax.axhline(K, color=c, linestyle=':', linewidth=0.5, alpha=0.5)

# Real data overlay
real_years = [1966, 1972, 1978, 1984, 1991, 1999, 2006, 2013, 2018, 2022]
real_pop = [366, 658, 938, 1080, 1164, 1552, 1855, 2290, 2413, 2613]
ax.plot(real_years, real_pop, 'ko', markersize=6, label='Census data')

ax.set_xlabel('Year', color='white')
ax.set_ylabel('Rhino population', color='white')
ax.set_title('Logistic Growth: Which K Fits Best?', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# 2. Growth rate vs population
ax = axes[0, 1]
ax.set_facecolor('#111827')
N_range = np.linspace(1, 3500, 200)
K = 3000
r = 0.05
growth_rate = r * N_range * (1 - N_range / K)

ax.plot(N_range, growth_rate, color='#22c55e', linewidth=2)
ax.fill_between(N_range, growth_rate, alpha=0.15, color='#22c55e')
ax.axvline(K/2, color='#f59e0b', linestyle='--', linewidth=1)
ax.axvline(K, color='#ef4444', linestyle='--', linewidth=1)
ax.text(K/2, max(growth_rate) * 1.05, f'N=K/2={K//2}\\n(max growth)', color='#f59e0b', fontsize=9, ha='center')
ax.text(K, -3, f'N=K={K}\\n(equilibrium)', color='#ef4444', fontsize=9, ha='center')
ax.axhline(0, color='gray', linewidth=0.5)
ax.set_xlabel('Population size', color='white')
ax.set_ylabel('Population growth rate (dN/dt)', color='white')
ax.set_title('Growth Rate vs Population Size', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 3. Poaching impact
ax = axes[1, 0]
ax.set_facecolor('#111827')
poaching_rates = [0, 10, 30, 50]
poach_colors = ['#22c55e', '#f59e0b', '#ef4444', '#a855f7']
for pr, c in zip(poaching_rates, poach_colors):
    N = logistic_growth(2600, 0.05, 3000, 50, poaching_rate=pr)
    ax.plot(np.arange(50) + 2022, N, linewidth=2, color=c, label=f'{pr} poached/year')

ax.set_xlabel('Year', color='white')
ax.set_ylabel('Population', color='white')
ax.set_title('Poaching Impact on Population Trajectory', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 4. Changing carrying capacity
ax = axes[1, 1]
ax.set_facecolor('#111827')
K_stable = logistic_growth(2600, 0.05, 3000, 50)
K_declining = np.zeros(50)
K_declining[0] = 2600
K_series = np.linspace(3000, 2000, 50)
for i in range(1, 50):
    dN = 0.05 * K_declining[i-1] * (1 - K_declining[i-1] / K_series[i])
    K_declining[i] = max(0, K_declining[i-1] + dN)

ax.plot(np.arange(50) + 2022, K_stable, color='#22c55e', linewidth=2, label='Stable K=3000')
ax.plot(np.arange(50) + 2022, K_declining, color='#ef4444', linewidth=2, label='Declining K (habitat loss)')
ax.plot(np.arange(50) + 2022, K_series, color='#ef4444', linewidth=1, linestyle=':', label='K trajectory')
ax.fill_between(np.arange(50) + 2022, K_declining, K_stable, alpha=0.1, color='#ef4444')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Population', color='white')
ax.set_title('Impact of Declining Carrying Capacity', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Carrying capacity scenarios for Kaziranga rhinos:")
print(f"  Current population: ~2,600")
print(f"  Estimated K: ~3,000")
print(f"  Population is at {2600/3000*100:.0f}% of K")
print()
print("If K declines to 2000 (habitat loss):")
print(f"  Final population: ~{K_declining[-1]:.0f}")
print(f"  Loss: ~{2600 - K_declining[-1]:.0f} rhinos")`,
      challenge: 'What if Kaziranga expands by 200 km^2 through the proposed additions? Estimate how much this would increase K. (Current density is ~6 rhinos/km^2 in prime habitat.)',
      successHint: 'Carrying capacity is not a fixed number — it is a function of habitat quality, which changes with management, climate, and human pressures. Conservation must protect not just animals but the carrying capacity of their habitat.',
    },
    {
      title: 'Herbivore-plant dynamics — the mathematical ecology of grazing',
      concept: `The relationship between herbivores and plants is not simple predator-prey — it is a **consumer-resource** dynamic with feedbacks.

The Rosenzweig-MacArthur model captures this:
dP/dt = r*P*(1 - P/K) - a*P*H/(1 + a*h*P)  (plant growth - herbivore consumption)
dH/dt = e*a*P*H/(1 + a*h*P) - d*H  (herbivore growth from consumption - death)

Where:
- P = plant biomass, H = herbivore population
- r = plant growth rate, K = plant carrying capacity
- a = herbivore attack rate, h = handling time per unit plant
- e = conversion efficiency (plant mass -> herbivore mass)
- d = herbivore death rate

The model predicts:
- **Stable equilibrium**: plant and herbivore populations coexist at steady levels
- **Limit cycles**: populations oscillate (herbivores overgraze -> plants decline -> herbivores decline -> plants recover...)
- **Extinction**: if herbivore death rate is too high or plant recovery too slow

Which outcome occurs depends on the parameter values — and in Kaziranga, human management (fire, anti-poaching) shifts these parameters.`,
      analogy: 'The herbivore-plant system is like a thermostat. If the room (grass) gets too hot (too much biomass), the air conditioner (herbivores) kicks in and cools it down. If the room gets too cold (grass grazed too low), the air conditioner turns off and the room warms up. The system oscillates around a comfortable temperature (equilibrium).',
      storyConnection: 'The story\'s grass and elephants exist in a dance: the elephants eat, the grass grows back, the elephants eat again. Mathematical ecology models this dance as differential equations. The "secret understanding" between grass and elephants is a stable equilibrium — each maintaining the other at levels that sustain both.',
      checkQuestion: 'The model shows that adding a predator (tiger) can actually stabilize the grass-herbivore system. How?',
      checkAnswer: 'Without tigers, herbivore populations can overshoot and overgraze. With tigers, herbivore populations are kept below the level where overgrazing occurs. The predator prevents herbivore boom-bust cycles, keeping the system in a stable equilibrium. This is called a "trophic cascade" — top predators indirectly benefit plants by controlling herbivores.',
      codeIntro: 'Simulate the Rosenzweig-MacArthur herbivore-plant model for Kaziranga.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def simulate(P0, H0, r, K, a, h, e, d, T=200, dt=0.01):
    steps = int(T / dt)
    P = np.zeros(steps)
    H = np.zeros(steps)
    P[0], H[0] = P0, H0
    for i in range(1, steps):
        func_response = a * P[i-1] / (1 + a * h * P[i-1])
        dP = r * P[i-1] * (1 - P[i-1] / K) - func_response * H[i-1]
        dH = e * func_response * H[i-1] - d * H[i-1]
        P[i] = max(0.1, P[i-1] + dP * dt)
        H[i] = max(0.1, H[i-1] + dH * dt)
    time = np.linspace(0, T, steps)
    return time, P, H

r = 1.0; K = 1000; a = 0.01; h = 0.1; e = 0.1; d = 0.3

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Stable dynamics
ax = axes[0, 0]
ax.set_facecolor('#111827')
time, P, H = simulate(800, 50, r, K, a, h, e, d)
ax.plot(time, P, color='#22c55e', linewidth=1.5, label='Grass biomass')
ax.plot(time, H * 10, color='#f59e0b', linewidth=1.5, label='Herbivores (x10)')
ax.set_xlabel('Time (years)', color='white')
ax.set_ylabel('Biomass / Population', color='white')
ax.set_title('Stable Equilibrium (balanced system)', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# 2. Oscillating dynamics
ax = axes[0, 1]
ax.set_facecolor('#111827')
time, P, H = simulate(800, 50, r, K, 0.02, h, e, d)
ax.plot(time, P, color='#22c55e', linewidth=1.5, label='Grass')
ax.plot(time, H * 10, color='#f59e0b', linewidth=1.5, label='Herbivores (x10)')
ax.set_xlabel('Time', color='white')
ax.set_ylabel('Biomass / Population', color='white')
ax.set_title('Limit Cycles (aggressive grazing)', color='#ef4444', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# 3. Phase plane
ax = axes[1, 0]
ax.set_facecolor('#111827')
scenarios = [('Balanced', 0.01, '#22c55e'), ('Aggressive', 0.02, '#f59e0b'), ('Light', 0.005, '#3b82f6')]
for name, a_val, c in scenarios:
    _, P, H = simulate(800, 50, r, K, a_val, h, e, d, T=300)
    ax.plot(P, H, color=c, linewidth=1, alpha=0.7, label=name)
    ax.plot(P[-1], H[-1], 'o', color=c, markersize=8)
ax.set_xlabel('Grass biomass', color='white')
ax.set_ylabel('Herbivore population', color='white')
ax.set_title('Phase Plane (trajectories)', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 4. Tiger effect
ax = axes[1, 1]
ax.set_facecolor('#111827')
time, P_no, H_no = simulate(800, 50, r, K, 0.02, h, e, 0.2, T=200)
time, P_t, H_t = simulate(800, 50, r, K, 0.02, h, e, 0.4, T=200)
ax.plot(time, P_no, color='#ef4444', linewidth=1.5, linestyle='--', label='Grass (no tigers)')
ax.plot(time, P_t, color='#22c55e', linewidth=1.5, label='Grass (with tigers)')
ax.set_xlabel('Time (years)', color='white')
ax.set_ylabel('Biomass', color='white')
ax.set_title('Trophic Cascade: Tigers Stabilize the System', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key ecological insights:")
print("  1. Moderate grazing -> stable equilibrium")
print("  2. Aggressive grazing -> oscillations")
print("  3. Predators (tigers) stabilize by controlling herbivores")
print("  Kaziranga needs ALL its species for stability.")`,
      challenge: 'Add a "poaching event" at year 50 that removes 50% of herbivores. How does the system respond? Does it recover to the same equilibrium?',
      successHint: 'Mathematical ecology reveals that ecosystems are dynamical systems with equilibria, oscillations, and tipping points. Kaziranga\'s stability depends on maintaining all three trophic levels.',
    },
    {
      title: 'Prescribed fire science — the thermodynamics of grassland burns',
      concept: `Prescribed fire is an engineering discipline with precise parameters:

**Fire behavior triangle**: weather + fuel + topography determine how a fire behaves.

**Fire intensity** (Byram 1959):
I = H * w * R

Where:
- I = fire intensity (kW/m)
- H = heat of combustion (~18,000 kJ/kg for dry grass)
- w = fuel load (kg/m^2)
- R = rate of spread (m/s)

**Fire types**:
- **Backfire**: burns against the wind. Slow, cool, controllable. Preferred for prescribed burns.
- **Headfire**: burns with the wind. Fast, hot, intense. Harder to control.

In Kaziranga, prescribed burns target fire intensities of 500-2000 kW/m — enough to burn the grass but not hot enough to damage soil organisms or meristems. The key insight: soil temperature drops exponentially with depth. A backfire may reach 150°C at the surface but only 35°C at 2 cm depth where meristems live. A headfire can reach 300°C at the surface and 60°C+ at meristem depth — potentially lethal.`,
      analogy: 'Prescribed fire management is like cooking with a controlled flame. A backfire is simmering (low, slow, predictable). A headfire is searing (high heat, fast, needs attention). The fire manager is the chef — controlling heat, fuel, and timing.',
      storyConnection: 'The story\'s grass burns and regrows. A prescribed fire manager asks: how hot, how fast, how deep? The same grass can burn at 500 kW/m (gentle, soil unharmed) or 5000 kW/m (scorching, soil sterilized). Fire science tells us how to control the renewal.',
      checkQuestion: 'Why do prescribed burns in Kaziranga happen in February, not September?',
      checkAnswer: 'In February, grass moisture is lowest (15-25%), making it easy to ignite. Wind is predictable (NE trade winds). Ground is dry for vehicle access. In September, grass moisture exceeds 60% (won\'t burn), ground is flooded, and unpredictable monsoon winds make control impossible.',
      codeIntro: 'Model fire behavior: intensity, rate of spread, and soil temperature profiles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

H = 18000  # heat of combustion (kJ/kg)

def rate_of_spread(wind, fuel_moisture=0.15, slope=0):
    base = 0.05
    wind_factor = 1 + 0.3 * wind**1.5
    moisture_factor = max(0, 1 - 2 * fuel_moisture)
    slope_factor = 1 + 3 * np.tan(np.radians(slope))
    return base * wind_factor * moisture_factor * slope_factor

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Fire intensity vs grass height
ax = axes[0, 0]
ax.set_facecolor('#111827')
heights = np.linspace(0.5, 5, 100)
fuel_load = 0.5 * heights
R = rate_of_spread(5)
intensity = H * fuel_load * R
ax.plot(heights * 100, intensity, color='#ef4444', linewidth=2)
ax.fill_between(heights * 100, intensity, alpha=0.15, color='#ef4444')
ax.axhspan(500, 2000, alpha=0.1, color='#22c55e')
ax.text(300, 1200, 'Prescribed\\nburn range', color='#22c55e', fontsize=10, ha='center')
ax.set_xlabel('Grass height (cm)', color='white')
ax.set_ylabel('Fire intensity (kW/m)', color='white')
ax.set_title('Fire Intensity vs Grass Height (5 m/s wind)', color='white', fontsize=12)
ax.tick_params(colors='gray')

# 2. Rate of spread vs wind and moisture
ax = axes[0, 1]
ax.set_facecolor('#111827')
wind_speeds = np.linspace(0, 15, 100)
for fm, label, c in [(0.10, 'Dry (10%)', '#ef4444'), (0.20, 'Moderate (20%)', '#f59e0b'),
                      (0.40, 'Moist (40%)', '#22c55e'), (0.60, 'Wet (60%)', '#3b82f6')]:
    ros = [rate_of_spread(w, fm) for w in wind_speeds]
    ax.plot(wind_speeds, ros, linewidth=2, color=c, label=label)
ax.set_xlabel('Wind speed (m/s)', color='white')
ax.set_ylabel('Rate of spread (m/s)', color='white')
ax.set_title('Spread Rate vs Wind & Moisture', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 3. Headfire vs backfire comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
wind = 5
headfire_ros = rate_of_spread(wind)
backfire_ros = rate_of_spread(wind) * 0.15
w_fuel = 1.5
head_I = H * w_fuel * headfire_ros
back_I = H * w_fuel * backfire_ros

fire_types = ['Backfire\\n(against wind)', 'Flank fire\\n(perpendicular)', 'Headfire\\n(with wind)']
intensities = [back_I, (head_I + back_I) / 2, head_I]
fire_colors = ['#22c55e', '#f59e0b', '#ef4444']
bars = ax.bar(range(3), intensities, color=fire_colors, alpha=0.8)
ax.set_xticks(range(3))
ax.set_xticklabels(fire_types, color='white', fontsize=9)
ax.set_ylabel('Fire intensity (kW/m)', color='white')
ax.set_title('Fire Type Comparison', color='white', fontsize=12)
ax.tick_params(colors='gray')
for bar, I_val in zip(bars, intensities):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 50,
            f'{I_val:.0f} kW/m', ha='center', color='white', fontsize=9)

# 4. Soil temperature depth profile
ax = axes[1, 1]
ax.set_facecolor('#111827')
depth = np.linspace(0, 10, 100)
for surface_T, label, c in [(300, 'Headfire', '#ef4444'), (150, 'Backfire', '#22c55e'), (80, 'Light burn', '#3b82f6')]:
    T_profile = 20 + (surface_T - 20) * np.exp(-1.5 * depth)
    ax.plot(T_profile, depth, linewidth=2, color=c, label=f'{label} ({surface_T} deg C surface)')
ax.axhline(2, color='#f59e0b', linestyle='--', linewidth=1)
ax.text(250, 2.2, 'Meristem depth (2cm)', color='#f59e0b', fontsize=9)
ax.axvline(60, color='gray', linestyle=':', linewidth=0.5)
ax.text(65, 8, 'Lethal for\\nmeristems', color='gray', fontsize=8)
ax.invert_yaxis()
ax.set_xlabel('Temperature (deg C)', color='white')
ax.set_ylabel('Depth below surface (cm)', color='white')
ax.set_title('Soil Temperature During Fire', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Prescribed fire parameters for Kaziranga:")
print(f"  Target intensity: 500-2000 kW/m")
print(f"  Backfire intensity: {back_I:.0f} kW/m (safe)")
print(f"  Headfire intensity: {head_I:.0f} kW/m (risky)")
print()
print("Soil temperature at meristem depth (2cm):")
for sT, name in [(300, 'Headfire'), (150, 'Backfire'), (80, 'Light burn')]:
    T_2cm = 20 + (sT - 20) * np.exp(-1.5 * 2)
    print(f"  {name}: {T_2cm:.0f} deg C {'(LETHAL)' if T_2cm > 60 else '(safe)'}")`,
      challenge: 'At what grass height does headfire intensity exceed 5000 kW/m (wildfire territory)? This is the maximum safe grass height before prescribed burning becomes dangerous.',
      successHint: 'Prescribed fire is applied thermodynamics. Understanding intensity, rate of spread, and soil temperature lets managers burn safely and effectively.',
    },
    {
      title: 'Invasive species management — the Mimosa threat',
      concept: `Kaziranga faces a growing threat from **Mimosa diplotricha** — an invasive vine from Central America spreading through the park's grasslands.

Why Mimosa is dangerous:
- Thorny, scrambling vine that smothers native grass
- Not eaten by any native herbivore (no evolutionary familiarity)
- Seeds spread by water (floods carry them throughout the park)
- Fixes nitrogen (enriches soil, paradoxically favouring more invaders over native grass)

Current extent: ~8% of Kaziranga's grassland, expanding at ~2% per year.

Management approaches:
1. **Manual removal**: labour-intensive, effective for small patches
2. **Controlled burning**: Mimosa lacks basal meristems, so fire kills it more effectively than grass
3. **Biological control**: researching host-specific herbivorous insects from Mimosa's native range
4. **Herbicide**: effective but ecologically risky in a national park

The management challenge: every approach has trade-offs. Only integrated management (combining multiple approaches) shows long-term success in models.`,
      analogy: 'An invasive species is like a new player in a game who doesn\'t follow the rules. Native grass and herbivores have millions of years of coevolved rules. Mimosa arrived without these rules — nothing eats it, nothing controls it, and it outcompetes the natives by ignoring the game.',
      storyConnection: 'The story\'s grass grows tall because it is adapted to fire, flood, and grazing. Mimosa threatens this by introducing a plant that does NOT play by the local ecological rules. If Mimosa replaces native grass, the rhinos lose food and cover, and the entire ecosystem unravels.',
      checkQuestion: 'Mimosa fixes nitrogen, which enriches the soil. Why is enrichment bad for Kaziranga?',
      checkAnswer: 'Kaziranga\'s native grassland is adapted to relatively nutrient-poor, flood-deposited soils. When Mimosa enriches the soil with nitrogen, fast-growing, nitrogen-loving weeds can outcompete the slow-growing native grasses. Nutrient enrichment favours invaders over natives — a process called "invasional meltdown."',
      codeIntro: 'Model the spread of Mimosa in Kaziranga and compare management strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(0, 30)

def mimosa_spread(initial_pct, growth_rate, removal_pct=0, fire_kill_pct=0, biocontrol_year=None, biocontrol_effect=0):
    cover = np.zeros(len(years))
    cover[0] = initial_pct
    for i in range(1, len(years)):
        growth = growth_rate * cover[i-1] * (1 - cover[i-1] / 100)
        removal = removal_pct * cover[i-1] / 100
        fire_kill = fire_kill_pct * cover[i-1] / 100
        bio = 0
        if biocontrol_year and years[i] >= biocontrol_year:
            bio = biocontrol_effect * cover[i-1] / 100
        cover[i] = max(0, cover[i-1] + growth - removal - fire_kill - bio)
    return cover

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Unmanaged spread
ax = axes[0, 0]
ax.set_facecolor('#111827')
no_action = mimosa_spread(8, 0.15)
ax.plot(years + 2024, no_action, color='#ef4444', linewidth=2, label='No action')
ax.fill_between(years + 2024, no_action, alpha=0.15, color='#ef4444')
ax.axhline(50, color='gray', linestyle=':', linewidth=0.5)
ax.text(2050, 52, '50% = ecosystem collapse', color='gray', fontsize=8)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Mimosa cover (%)', color='white')
ax.set_title('Unmanaged Mimosa Spread', color='#ef4444', fontsize=13)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# 2. Strategy comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
strategies = [
    ('No action', mimosa_spread(8, 0.15), '#ef4444'),
    ('Manual (5%/yr)', mimosa_spread(8, 0.15, removal_pct=5), '#f59e0b'),
    ('Fire (10%/yr)', mimosa_spread(8, 0.15, fire_kill_pct=10), '#22c55e'),
    ('Combined', mimosa_spread(8, 0.15, removal_pct=5, fire_kill_pct=10), '#3b82f6'),
    ('Combined + biocontrol', mimosa_spread(8, 0.15, removal_pct=5, fire_kill_pct=10, biocontrol_year=10, biocontrol_effect=15), '#a855f7'),
]
for name, cover, c in strategies:
    ax.plot(years + 2024, cover, linewidth=2, color=c, label=name)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Mimosa cover (%)', color='white')
ax.set_title('Management Strategy Comparison', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# 3. Cost-effectiveness
ax = axes[1, 0]
ax.set_facecolor('#111827')
strategy_names = ['No action', 'Manual', 'Fire', 'Combined', 'Combined\\n+biocontrol']
final_cover = [s[1][-1] for s in strategies]
effectiveness = [max(0, strategies[0][1][-1] - fc) for fc in final_cover]
colors_s = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
bars = ax.bar(strategy_names, effectiveness, color=colors_s, alpha=0.8)
ax.set_ylabel('Mimosa cover reduced (%)', color='white')
ax.set_title('Effectiveness Over 30 Years', color='white', fontsize=11)
ax.tick_params(colors='gray', labelsize=8)

# 4. Spatial spread simulation
ax = axes[1, 1]
ax.set_facecolor('#111827')
np.random.seed(42)
grid = np.zeros((20, 20))
grid[5, 5] = 1; grid[12, 15] = 1; grid[3, 17] = 1
for _ in range(15):
    new_grid = grid.copy()
    for r in range(20):
        for c in range(20):
            if grid[r, c] > 0:
                for dr, dc in [(-1,0),(1,0),(0,-1),(0,1),(-1,-1),(1,1)]:
                    nr, nc = r+dr, c+dc
                    if 0 <= nr < 20 and 0 <= nc < 20 and grid[nr, nc] == 0:
                        if np.random.random() < 0.15:
                            new_grid[nr, nc] = 1
    grid = new_grid
cmap = plt.cm.colors.LinearSegmentedColormap.from_list('m', ['#111827', '#ef4444'])
ax.imshow(grid, cmap=cmap, interpolation='nearest')
ax.set_title(f'Spatial Spread ({np.sum(grid)/400*100:.0f}% covered)', color='white', fontsize=10)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Management summary (30-year projections):")
for name, cover, _ in strategies:
    print(f"  {name}: final cover = {cover[-1]:.1f}%")
print()
print("Only combined + biocontrol achieves long-term decline.")
print("Single approaches slow the spread but do not reverse it.")`,
      challenge: 'What if biocontrol is introduced earlier (year 5 instead of 10) with higher effectiveness (25%)? Does early intervention make the combined strategy unnecessary?',
      successHint: 'Invasive species management is a race against exponential growth. The earlier the intervention, the cheaper and more effective it is.',
    },
    {
      title: 'Remote sensing of grasslands — seeing the invisible',
      concept: `How do you monitor 430 km^2 of tall grassland? You use **remote sensing** — satellite and drone imagery analyzed by computers.

Key technologies:
- **NDVI** (Normalized Difference Vegetation Index): NDVI = (NIR - Red) / (NIR + Red). Healthy vegetation has high NDVI (~0.6-0.9). Bare soil has low NDVI (~0.1-0.3).
- **Multispectral imaging**: different vegetation types reflect different wavelengths differently
- **SAR** (Synthetic Aperture Radar): sees through clouds using microwaves — essential during Kaziranga's monsoon
- **LiDAR**: laser scanning for 3D grass height maps (~10 cm accuracy)

Applications in Kaziranga:
- Map fire scars within days of a burn
- Track flood extent in real time during monsoon
- Detect Mimosa invasion early (different spectral signature from native grass)
- Monitor grassland health and productivity
- Count wildlife using thermal infrared cameras on drones`,
      analogy: 'Remote sensing is like a medical scan for the landscape. Visible light is a regular photograph. Near-infrared reveals internal health (chlorophyll content). Radar works through clouds. Together, they give a complete diagnosis of the ecosystem.',
      storyConnection: 'The story\'s grass is tall enough to hide elephants — from ground level, you cannot see what is happening inside. Remote sensing is the bird\'s-eye view: reading the health of every square metre using light that human eyes cannot see.',
      checkQuestion: 'NDVI can distinguish Mimosa from native grass. How?',
      checkAnswer: 'Mimosa has different leaf structure and chlorophyll content than Saccharum grass. In near-infrared, Mimosa reflects slightly differently. Machine learning algorithms trained on ground-truth data can classify pixels as "native grass" or "Mimosa" with ~85% accuracy.',
      codeIntro: 'Simulate satellite remote sensing of Kaziranga: NDVI mapping and land classification.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
size = 50

# Landscape types: 0=water, 1=short grass, 2=tall grass, 3=forest, 4=mimosa, 5=burned
landscape = np.random.choice([1, 2, 3], size=(size, size), p=[0.3, 0.4, 0.3])
landscape[22:28, :] = 0  # river
landscape[5:10, 30:38] = 4  # mimosa
landscape[35:42, 10:15] = 4
landscape[15:20, 20:30] = 5  # burn scar

# Spectral values [Red, NIR]
spectral = {0: (0.05, 0.03), 1: (0.08, 0.35), 2: (0.05, 0.50),
            3: (0.04, 0.45), 4: (0.07, 0.42), 5: (0.15, 0.12)}

red = np.zeros((size, size))
nir = np.zeros((size, size))
for i in range(size):
    for j in range(size):
        lt = landscape[i, j]
        red[i,j] = spectral[lt][0] + np.random.normal(0, 0.01)
        nir[i,j] = spectral[lt][1] + np.random.normal(0, 0.01)

ndvi = (nir - red) / (nir + red + 0.001)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# NDVI map
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.imshow(ndvi, cmap='RdYlGn', vmin=-0.1, vmax=0.9)
plt.colorbar(im, ax=ax, label='NDVI')
ax.set_title('NDVI Map (vegetation health)', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Land classification
ax = axes[0, 1]
ax.set_facecolor('#111827')
class_colors = {0: '#3b82f6', 1: '#86efac', 2: '#22c55e', 3: '#166534', 4: '#ef4444', 5: '#78716c'}
class_image = np.zeros((size, size, 3))
for lt, color in class_colors.items():
    mask = landscape == lt
    r_c, g_c, b_c = int(color[1:3],16)/255, int(color[3:5],16)/255, int(color[5:7],16)/255
    class_image[mask] = [r_c, g_c, b_c]
ax.imshow(class_image)
ax.set_title('Land Classification', color='white', fontsize=12)
ax.tick_params(colors='gray')
legend_items = [('Water', '#3b82f6'), ('Short grass', '#86efac'), ('Tall grass', '#22c55e'),
                ('Forest', '#166534'), ('Mimosa', '#ef4444'), ('Burned', '#78716c')]
for i, (name, color) in enumerate(legend_items):
    ax.text(size + 2, i * 4 + 5, f'  {name}', color=color, fontsize=8, fontweight='bold')

# NDVI histogram by type
ax = axes[1, 0]
ax.set_facecolor('#111827')
for lt, name, c in [(1, 'Short grass', '#86efac'), (2, 'Tall grass', '#22c55e'),
                     (3, 'Forest', '#166534'), (4, 'Mimosa', '#ef4444')]:
    vals = ndvi[landscape == lt]
    if len(vals) > 0:
        ax.hist(vals, bins=20, alpha=0.5, color=c, label=name, density=True)
ax.set_xlabel('NDVI', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('NDVI Distribution by Land Type', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Area statistics
ax = axes[1, 1]
ax.set_facecolor('#111827')
land_names = ['Water', 'Short\\ngrass', 'Tall\\ngrass', 'Forest', 'Mimosa', 'Burned']
land_areas = [np.sum(landscape == i) / (size*size) * 100 for i in range(6)]
land_colors_list = list(class_colors.values())
bars = ax.bar(land_names, land_areas, color=land_colors_list, alpha=0.8)
ax.set_ylabel('Area (%)', color='white')
ax.set_title('Land Cover Statistics', color='white', fontsize=11)
ax.tick_params(colors='gray', labelsize=7)
for bar, area in zip(bars, land_areas):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            f'{area:.1f}%', ha='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Remote sensing enables:")
print("  - Early detection of Mimosa invasion fronts")
print("  - Fire scar mapping within days")
print("  - Flood extent tracking through clouds (SAR)")
print("  - Long-term trend analysis from decades of archives")
print()
print(f"Mimosa detected: {np.sum(landscape==4)/(size*size)*100:.1f}% of park area")
print(f"Recently burned: {np.sum(landscape==5)/(size*size)*100:.1f}% of park area")`,
      challenge: 'Improve Mimosa detection by combining NDVI with a SWIR/NIR ratio. Can you get above 90% classification accuracy?',
      successHint: 'Remote sensing turns a 430 km^2 park into a data set. Every pixel is a measurement. Together, images reveal patterns invisible from the ground.',
    },
    {
      title: 'Wildlife corridor planning — connecting Kaziranga to safety',
      concept: `Kaziranga is surrounded by tea plantations, villages, and National Highway 37. During monsoon floods, animals must flee to the Karbi Anglong hills. The corridors connecting park to hills are critically endangered.

A wildlife corridor must be:
- **Wide enough**: >500m for elephants and rhinos
- **Continuous**: a single gap blocks the entire corridor
- **Vegetated**: animals need cover
- **Protected**: legal status to prevent encroachment

Corridor planning uses **landscape connectivity analysis**:
1. Map the landscape (forest, grass, settlement, road, plantation)
2. Assign "resistance" values (low = easy to cross; high = difficult)
3. Find the **least-cost path** between park and hills
4. Identify bottlenecks where the corridor is narrowest
5. Prioritize restoration of critical bottlenecks

This is graph theory applied to ecology. Kaziranga has 9 identified corridors. Only 3 are still functional. The rest have been fragmented by settlements, tea gardens, and roads.`,
      analogy: 'A wildlife corridor is like a highway for animals. The park is the city, the hills are the suburbs, and the corridor is the road. If the road is blocked, traffic cannot flow. If it is too narrow, there are jams. Multiple routes create resilience.',
      storyConnection: 'The story\'s animals move freely between valley and hill. In reality, this movement is increasingly obstructed. Corridor planning asks: how do we keep the paths open? The grass of Kaziranga means nothing if animals cannot escape the monsoon floods.',
      checkQuestion: 'National Highway 37 crosses all 9 corridors. Why not just build underpasses?',
      checkAnswer: 'It is technically feasible and some are being built. The challenge is scale: 9 corridors, each needing multiple structures designed for elephants (5m height, 10m width minimum). Underpasses also need approach ramps, appropriate lighting (animals avoid bright light), vegetation at entrances, and maintenance. It is a multi-decade engineering project — essential but politically and financially complex.',
      codeIntro: 'Simulate wildlife corridor analysis using least-cost path modeling.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
size = 40

# Create landscape
landscape = np.full((size, size), 3)  # default: tea plantation
landscape[:8, 5:35] = 0   # park (north)
landscape[32:, 5:35] = 6  # hills (south)

# Forest corridors
landscape[8:12, 12:18] = 1; landscape[12:16, 14:20] = 1
landscape[16:20, 10:16] = 1; landscape[20:24, 8:14] = 1
landscape[24:28, 12:18] = 1; landscape[28:32, 14:22] = 1
# Second corridor
landscape[8:12, 25:30] = 1; landscape[12:20, 27:32] = 1
landscape[20:28, 25:30] = 1; landscape[28:32, 26:31] = 1
# Road and settlements
landscape[20, :] = 5
landscape[15:17, 8:12] = 4; landscape[25:27, 18:22] = 4

resistance_map = {0: 1, 1: 2, 2: 5, 3: 20, 4: 100, 5: 50, 6: 1}
resistance = np.zeros((size, size))
for lt, cost in resistance_map.items():
    resistance[landscape == lt] = cost

# Least-cost path (simplified Dijkstra)
cost_surface = np.full((size, size), np.inf)
cost_surface[7, :] = resistance[7, :]
for r in range(8, size):
    for c in range(size):
        neighbors = []
        if c > 0: neighbors.append(cost_surface[r-1, c-1])
        neighbors.append(cost_surface[r-1, c])
        if c < size-1: neighbors.append(cost_surface[r-1, c+1])
        cost_surface[r, c] = min(neighbors) + resistance[r, c]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Landscape map
ax = axes[0, 0]
ax.set_facecolor('#111827')
land_colors = {0: '#22c55e', 1: '#166534', 2: '#86efac', 3: '#f59e0b', 4: '#ef4444', 5: '#78716c', 6: '#3b82f6'}
img = np.zeros((size, size, 3))
for lt, color in land_colors.items():
    mask = landscape == lt
    r_c, g_c, b_c = int(color[1:3],16)/255, int(color[3:5],16)/255, int(color[5:7],16)/255
    img[mask] = [r_c, g_c, b_c]
ax.imshow(img)
ax.set_title('Landscape Map', color='white', fontsize=12)
ax.tick_params(colors='gray')
legend_items = [('Park', '#22c55e'), ('Forest', '#166534'), ('Tea plantation', '#f59e0b'),
                ('Settlement', '#ef4444'), ('Road', '#78716c'), ('Hills', '#3b82f6')]
for i, (name, color) in enumerate(legend_items):
    ax.text(size + 1, i * 3 + 2, f'  {name}', color=color, fontsize=7)

# Resistance map
ax = axes[0, 1]
ax.set_facecolor('#111827')
im = ax.imshow(resistance, cmap='YlOrRd', interpolation='nearest')
plt.colorbar(im, ax=ax, label='Movement cost')
ax.set_title('Resistance Surface', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Cost surface with path
ax = axes[1, 0]
ax.set_facecolor('#111827')
im = ax.imshow(cost_surface, cmap='viridis', interpolation='nearest')
plt.colorbar(im, ax=ax, label='Cumulative cost')

# Trace path
best_exit = np.argmin(cost_surface[32, :])
path_r, path_c = [32], [best_exit]
for r in range(31, 7, -1):
    c = path_c[-1]
    candidates = []
    if c > 0: candidates.append((cost_surface[r, c-1], c-1))
    candidates.append((cost_surface[r, c], c))
    if c < size-1: candidates.append((cost_surface[r, c+1], c+1))
    best_c = min(candidates, key=lambda x: x[0])[1]
    path_r.append(r); path_c.append(best_c)

ax.plot(path_c, path_r, 'w-', linewidth=2, label='Least-cost path')
ax.set_title('Optimal Corridor', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# Corridor width
ax = axes[1, 1]
ax.set_facecolor('#111827')
corridor_width = np.zeros(size)
for r in range(size):
    corridor_width[r] = np.sum((landscape[r, :] == 1) | (landscape[r, :] == 0) | (landscape[r, :] == 6))
ax.barh(range(size), corridor_width,
        color=['#22c55e' if w > 5 else '#f59e0b' if w > 2 else '#ef4444' for w in corridor_width])
ax.axvline(5, color='white', linestyle='--', linewidth=1, label='Min safe width')
ax.set_xlabel('Width (cells)', color='white')
ax.set_ylabel('Row (N=park, S=hills)', color='white')
ax.set_title('Corridor Width Analysis', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')
ax.invert_yaxis()

bottlenecks = np.where(corridor_width[8:32] < 3)[0] + 8
for b in bottlenecks[:5]:
    ax.text(corridor_width[b] + 0.5, b, 'BOTTLENECK', color='#ef4444', fontsize=7, fontweight='bold')

plt.tight_layout()
plt.show()

print("Corridor analysis results:")
print(f"  Least-cost path total: {cost_surface[32, best_exit]:.0f}")
print(f"  Bottlenecks (width < 3): {len(bottlenecks)}")
print(f"  Minimum corridor width: {min(corridor_width[8:32]):.0f} cells")
print()
print("Priority: restore bottleneck areas to reconnect")
print("the park with the Karbi Anglong hills.")
print()
print("Every bottleneck restored = more animals survive the monsoon.")
print("Corridor planning is where ecology meets graph theory,")
print("urban planning, and conservation politics.")`,
      challenge: 'What if the road (row 20) gets an underpass? Set resistance at row 20 to 5 instead of 50. How much does the total path cost drop?',
      successHint: 'Wildlife corridor planning is applied graph theory with life-or-death stakes. From carrying capacity to herbivore dynamics to fire science to invasive species to remote sensing to corridor planning — ecosystem management requires all disciplines working together. The tall grass of Kaziranga is only part of the story; the corridors that connect it to higher ground are equally essential.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 grassland ecology concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ecosystem management simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}