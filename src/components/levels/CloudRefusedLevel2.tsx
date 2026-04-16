import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CloudRefusedLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Atmospheric thermodynamics — why rising air cools and what happens when it does',
      concept: `In Level 1, we used a fixed lapse rate (6.5°C/km). In reality, there are TWO lapse rates, and the difference between them determines whether clouds grow or die.

**Dry adiabatic lapse rate (DALR):** 9.8°C/km. This is how fast unsaturated air cools when forced upward. "Adiabatic" means no heat is exchanged with surroundings — the cooling comes purely from expansion as pressure drops.

**Moist adiabatic lapse rate (MALR):** 4–7°C/km (varies with temperature). Once air reaches saturation and condensation begins, the released **latent heat** partially offsets the cooling. So moist air cools SLOWER than dry air.

**Atmospheric stability:**
- If the actual environmental lapse rate > DALR: **absolutely unstable** — rising air is always warmer than its surroundings, keeps rising, thunderstorms develop
- If environmental lapse rate < MALR: **absolutely stable** — rising air is always cooler, sinks back down, no vertical cloud growth
- If between DALR and MALR: **conditionally unstable** — stable when dry, unstable once condensation starts

This is why some clouds grow into monsters while others flatten out. Meghi grew into a towering cumulonimbus because the atmosphere over Meghalaya was conditionally unstable — once condensation started, latent heat release made the air buoyant, driving it higher and higher.`,
      analogy: 'Imagine heating a ball from the inside while it rises. Without heating (dry air), the ball cools quickly and eventually sinks. With heating (latent heat from condensation), the ball stays warm relative to its surroundings and keeps rising. The question is: does the surrounding air cool faster or slower than your ball? That determines whether the ball (cloud) rises to the top of the atmosphere or gets stuck.',
      storyConnection: 'Meghi grew from a modest cloud to a monster that "scraped the tops of the pine trees." In atmospheric terms, she started in a conditionally unstable atmosphere: once condensation began, latent heat release made her air parcel warmer than the surrounding air at every altitude. She could not stop rising and growing, even though she was getting heavier — the buoyancy from latent heat overwhelmed the weight of her water.',
      checkQuestion: 'The environmental temperature drops from 25°C at the surface to 5°C at 4 km. Is this a lapse rate of 5°C/km. Is the atmosphere stable or unstable for (a) dry air and (b) saturated air?',
      checkAnswer: '(a) For dry air: DALR = 9.8°C/km. Environmental rate (5°C/km) < DALR, so dry air rising will cool faster than its surroundings — it becomes cooler and denser, so it sinks back. STABLE for dry air. (b) For saturated air: MALR = ~5°C/km (varies). Environmental rate (5°C/km) ≈ MALR, so saturated air is at the boundary of stability. In practice, at warmer temperatures MALR can be as low as 4°C/km (more latent heat release), so the atmosphere would be UNSTABLE for saturated air — clouds grow.',
      codeIntro: 'Compare dry and moist adiabatic lapse rates to determine atmospheric stability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Atmospheric stability analysis
altitude = np.linspace(0, 10000, 500)  # metres

# Environmental lapse rate (observed)
env_temp_surface = 28  # °C

# Three scenarios
scenarios = [
    {'name': 'Stable (winter clear day)', 'elr': 4.0, 'color': '#3b82f6'},
    {'name': 'Conditionally unstable (typical)', 'elr': 6.5, 'color': '#f59e0b'},
    {'name': 'Absolutely unstable (pre-monsoon)', 'elr': 10.0, 'color': '#ef4444'},
]

# Dry adiabatic lapse rate
dalr = 9.8  # °C per km
dry_temp = env_temp_surface - (dalr / 1000) * altitude

# Moist adiabatic lapse rate (simplified, temperature-dependent)
def moist_lapse_rate(T):
    """Approximate MALR in °C/km."""
    # MALR decreases (more latent heat) at warmer temperatures
    return 4.0 + 3.0 * np.exp(-T / 30)

moist_temp = np.zeros_like(altitude)
moist_temp[0] = env_temp_surface
for i in range(1, len(altitude)):
    dz = (altitude[i] - altitude[i-1]) / 1000  # km
    malr = moist_lapse_rate(moist_temp[i-1])
    moist_temp[i] = moist_temp[i-1] - malr * dz

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Lapse rate comparison
ax1.set_facecolor('#111827')
ax1.plot(dry_temp, altitude / 1000, color='#ef4444', linewidth=2, linestyle='--', label=f'Dry adiabatic ({dalr}°C/km)')
ax1.plot(moist_temp, altitude / 1000, color='#3b82f6', linewidth=2, linestyle='--', label='Moist adiabatic (varies)')

for sc in scenarios:
    env_temp = env_temp_surface - (sc['elr'] / 1000) * altitude
    ax1.plot(env_temp, altitude / 1000, color=sc['color'], linewidth=2, label=f"Environment: {sc['name']}")

ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_ylabel('Altitude (km)', color='white')
ax1.set_title('Stability: Environment vs Air Parcel', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='upper right')
ax1.tick_params(colors='gray')
ax1.set_xlim(-30, 35)

# Buoyancy as a function of altitude for conditionally unstable atmosphere
ax2.set_facecolor('#111827')
env_temp_cond = env_temp_surface - (6.5 / 1000) * altitude

# Air parcel: dry below LCL, moist above
dew_point = 20
lcl = (env_temp_surface - dew_point) / dalr * 1000  # metres
parcel_temp = np.where(altitude < lcl,
                       env_temp_surface - (dalr / 1000) * altitude,
                       moist_temp)

buoyancy = parcel_temp - env_temp_cond
ax2.plot(buoyancy, altitude / 1000, color='#22c55e', linewidth=2)
ax2.fill_betweenx(altitude / 1000, 0, buoyancy, where=buoyancy > 0,
                  alpha=0.2, color='#22c55e', label='Buoyant (rises)')
ax2.fill_betweenx(altitude / 1000, 0, buoyancy, where=buoyancy < 0,
                  alpha=0.2, color='#ef4444', label='Sinks back')
ax2.axvline(0, color='white', linewidth=0.5, alpha=0.3)
ax2.axhline(lcl / 1000, color='#f59e0b', linestyle=':', alpha=0.7)
ax2.text(1, lcl / 1000 + 0.1, f'LCL: {lcl:.0f}m (cloud base)', color='#f59e0b', fontsize=9)

ax2.set_xlabel('Buoyancy (T_parcel - T_environment, °C)', color='white')
ax2.set_ylabel('Altitude (km)', color='white')
ax2.set_title('Conditionally Unstable: Stable Below Cloud, Unstable Above', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Atmospheric stability analysis:")
print(f"  DALR: {dalr}°C/km (dry air cooling rate)")
print(f"  MALR: ~4-7°C/km (moist air, varies with temp)")
print(f"  LCL (cloud base): {lcl:.0f}m")
print(f"  Below LCL: STABLE (dry air cools faster than environment)")
print(f"  Above LCL: UNSTABLE (moist air cools slower → buoyant)")
print(f"  This is why cumulus clouds can explode upward once they form!")`,
      challenge: 'What happens if you increase the surface temperature to 35°C while keeping dew point at 20°C? Does the LCL go up or down? Does the atmosphere become more or less unstable above the LCL? Connect this to why afternoon thunderstorms are more common than morning ones.',
      successHint: 'The dry vs moist adiabatic lapse rate distinction is the single most important concept in cloud physics. It explains why some clouds grow into monsters, why thunderstorms happen in the afternoon (when the surface is hottest), and why the tropics have the tallest clouds on Earth.',
    },
    {
      title: 'Cloud microphysics — the life of a droplet from nucleation to raindrop',
      concept: `Let’s follow a single water molecule through the entire process from ocean to raindrop.

**Step 1: Nucleation.** The molecule, as vapor, encounters a condensation nucleus (say, a salt crystal 0.5 µm across from sea spray). It sticks to the crystal’s surface. More molecules join. Within seconds, a droplet forms. But there’s a catch: very small droplets have high surface tension relative to volume, which means water molecules tend to re-evaporate. This is the **Köhler theory** activation barrier. Only nuclei above a critical size, or very hygroscopic ones (salt attracts water strongly), produce stable droplets.

**Step 2: Growth by condensation.** The droplet grows as more vapor diffuses onto it. But this process is SLOW — it takes ~15 minutes to grow a 10 µm droplet, and hours to reach 100 µm. Condensation alone cannot explain rain.

**Step 3: Collision-coalescence.** The droplet, now big enough to have a noticeable fall speed, starts sweeping up smaller droplets. Growth accelerates exponentially. A 100 µm droplet reaches 1,000 µm in minutes once the chain reaction starts.

**Step 4: Breakup.** Above ~5 mm, drops become aerodynamically unstable and break apart — the flat base creates a pressure differential that rips the drop into fragments. Each fragment starts collecting again, multiplying the number of large drops. This is the **collision-breakup cycle**.`,
      analogy: 'The life of a raindrop is like a startup company. Nucleation is founding the company (small, fragile, might fail). Growth by condensation is early organic growth (slow, steady, limited). Collision-coalescence is acquiring competitors (rapid growth, bigger absorbs smaller). Breakup at 5 mm is the company splitting into subsidiaries, each of which starts growing again.',
      storyConnection: 'When Meghi finally "let go," the story says "the rain came — not in a drizzle but in a great, warm downpour." This suggests the collision-coalescence process was explosive: once the first drops started falling, they triggered a chain reaction. Each falling drop swept up smaller droplets, grew rapidly, and the positive feedback loop produced a torrent within minutes.',
      checkQuestion: 'If condensation alone takes hours to grow drops to 100 µm, and rain often starts within 20 minutes of cloud formation in Meghalaya, what must be happening?',
      checkAnswer: 'Collision-coalescence must dominate over condensation in Meghalaya’s warm, thick clouds. The monsoon clouds are deep (5–10 km), have high liquid water content, and a wide range of droplet sizes (from many different types of nuclei). Large drops form quickly through collisions, triggering the exponential growth cascade. Additionally, the Bergeron process in the upper (cold) parts of the cloud creates ice crystals that fall through and melt, adding another rain source.',
      codeIntro: 'Model the complete lifecycle of a raindrop: nucleation, condensation, coalescence, breakup.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Complete raindrop lifecycle simulation

def kohler_critical_radius(salt_mass_kg, temperature_C):
    """Köhler theory: critical radius for activation."""
    # Simplified: bigger salt = lower critical supersaturation = easier activation
    T = temperature_C + 273.15
    # Critical radius in micrometres (very simplified)
    r_crit = 0.5 * (salt_mass_kg * 1e15)**0.333
    return max(0.1, min(r_crit, 5.0))

def simulate_droplet_lifecycle(nucleus_size_um, cloud_thickness_m, lwc_g_m3):
    """Full lifecycle: condensation then coalescence."""
    r = nucleus_size_um  # starting radius
    t = 0
    dt = 0.5

    record = {'time': [], 'radius': [], 'phase': []}

    # Phase 1: Condensation growth (slow)
    while r < 15 and t < 1200:  # until 15 um or 20 min
        # Condensation growth rate: dr/dt proportional to supersaturation / r
        supersaturation = 0.3  # %
        dr = supersaturation * 0.02 / max(r, 0.5) * dt
        r += dr
        t += dt
        record['time'].append(t)
        record['radius'].append(r)
        record['phase'].append('condensation')

    # Phase 2: Collision-coalescence (fast, exponential)
    height = cloud_thickness_m
    while height > 0 and r < 5000 and t < 3600:
        # Fall velocity
        if r < 40:
            v_fall = 1.2e-4 * r**2
        else:
            v_fall = max(0.5, 0.003 * r**0.6)

        # Collection
        efficiency = min(0.85, 0.005 * r / 10)
        collected = np.pi * (r * 1e-6)**2 * v_fall * lwc_g_m3 * 1e-3 * dt * efficiency
        vol = (4/3) * np.pi * (r * 1e-6)**3 * 1000 + collected
        r = ((vol / 1000) / ((4/3) * np.pi))**(1/3) * 1e6

        height -= v_fall * dt
        t += dt
        record['time'].append(t)
        record['radius'].append(r)
        record['phase'].append('coalescence')

        # Phase 3: Breakup check
        if r > 4000:  # drops > 4 mm break apart
            r = r * 0.6  # fragment
            record['time'].append(t)
            record['radius'].append(r)
            record['phase'].append('breakup')

    return record

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Different nucleus sizes
ax = axes[0, 0]
ax.set_facecolor('#111827')
for ns, color, label in [(0.1, '#ef4444', 'Sea salt 0.1 µm'),
                          (0.5, '#f59e0b', 'Dust 0.5 µm'),
                          (1.0, '#22c55e', 'Large salt 1.0 µm')]:
    rec = simulate_droplet_lifecycle(ns, 3000, 0.3)
    ax.plot(np.array(rec['time']) / 60, rec['radius'], color=color, linewidth=2, label=label)

ax.axhline(100, color='gray', linestyle=':', alpha=0.4)
ax.text(1, 130, 'Drizzle', color='gray', fontsize=8)
ax.axhline(1000, color='gray', linestyle=':', alpha=0.4)
ax.text(1, 1100, 'Rain', color='gray', fontsize=8)
ax.set_xlabel('Time (minutes)', color='white')
ax.set_ylabel('Radius (µm)', color='white')
ax.set_title('Effect of Nucleus Size', color='white', fontsize=11)
ax.set_yscale('log')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Different cloud thicknesses
ax = axes[0, 1]
ax.set_facecolor('#111827')
for th, color in [(500, '#ef4444'), (1500, '#f59e0b'), (3000, '#22c55e'), (6000, '#3b82f6')]:
    rec = simulate_droplet_lifecycle(0.5, th, 0.3)
    final_r = rec['radius'][-1]
    ax.plot(np.array(rec['time']) / 60, rec['radius'], color=color, linewidth=2,
           label=f'{th}m → {final_r:.0f} µm')

ax.axhline(1000, color='gray', linestyle=':', alpha=0.4)
ax.set_xlabel('Time (minutes)', color='white')
ax.set_ylabel('Radius (µm)', color='white')
ax.set_title('Effect of Cloud Thickness', color='white', fontsize=11)
ax.set_yscale('log')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Growth rate by phase
ax = axes[1, 0]
ax.set_facecolor('#111827')
rec = simulate_droplet_lifecycle(0.5, 5000, 0.5)
times = np.array(rec['time']) / 60
radii = np.array(rec['radius'])
phases = np.array(rec['phase'])

for phase, color, label in [('condensation', '#3b82f6', 'Condensation (slow)'),
                              ('coalescence', '#22c55e', 'Coalescence (fast)'),
                              ('breakup', '#ef4444', 'Breakup')]:
    mask = phases == phase
    if mask.any():
        ax.scatter(times[mask], radii[mask], c=color, s=2, label=label, alpha=0.7)

ax.set_xlabel('Time (minutes)', color='white')
ax.set_ylabel('Radius (µm)', color='white')
ax.set_title('Growth Phases of a Raindrop', color='white', fontsize=11)
ax.set_yscale('log')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Terminal velocity vs size
ax = axes[1, 1]
ax.set_facecolor('#111827')
r_range = np.linspace(10, 5000, 200)
v_term = np.where(r_range < 40, 1.2e-4 * r_range**2, 0.003 * r_range**0.6)
ax.plot(r_range, v_term, color='#f59e0b', linewidth=2)
ax.axvline(10, color='#3b82f6', linestyle=':', alpha=0.5)
ax.text(12, 0.5, 'Cloud\
droplet', color='#3b82f6', fontsize=8)
ax.axvline(100, color='#22c55e', linestyle=':', alpha=0.5)
ax.text(110, 0.5, 'Drizzle', color='#22c55e', fontsize=8)
ax.axvline(1000, color='#ef4444', linestyle=':', alpha=0.5)
ax.text(1100, 0.5, 'Raindrop', color='#ef4444', fontsize=8)
ax.set_xlabel('Radius (µm)', color='white')
ax.set_ylabel('Fall speed (m/s)', color='white')
ax.set_title('Terminal Velocity vs Droplet Size', color='white', fontsize=11)
ax.set_xscale('log')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Raindrop lifecycle summary:")
print("  1. Nucleation: <1 second (vapor sticks to particle)")
print("  2. Condensation: ~15 min to reach 15 µm (SLOW)")
print("  3. Coalescence: ~5-20 min to reach 1000+ µm (FAST)")
print("  4. Breakup at ~5000 µm: creates fragments, cycle repeats")
print("  Total time from nucleus to raindrop: ~20-40 minutes")`,
      challenge: 'Add a "Bergeron boost" to the simulation: if the droplet is above 5000m and temperature < -5°C, multiply the growth rate by 3x (representing ice crystal growth). How does this change the final raindrop size and formation time?',
      successHint: 'You just simulated the complete lifecycle that turns an invisible speck of salt into a 2mm raindrop weighing 4 milligrams. This process happens trillions of times inside every rainstorm.',
    },
    {
      title: 'Cloud seeding effectiveness — does it really work?',
      concept: `Cloud seeding has been used since the 1940s, yet the scientific community still debates its effectiveness. Why is it so hard to prove?

**The fundamental problem:** You cannot run a controlled experiment on the atmosphere. If you seed a cloud and it rains, how do you know it would not have rained anyway? You need to compare seeded clouds with identical unseeded clouds, but no two clouds are identical.

**Statistical approaches:**
- **Randomized crossover trials:** Randomly seed or not seed clouds and compare rainfall over many events (like a drug trial). Results: typically 5–15% increase, but statistical significance is weak because of huge natural variability.
- **Physical evidence:** You CAN show that seeding increases ice crystal counts in the cloud using aircraft measurements. The physical mechanism is well understood.
- **Case studies:** Individual dramatic results (like China’s Olympic seeding) are not scientifically convincing because you cannot prove the counterfactual.

**Real-world programs:**
- UAE: $15+ million/year, 1,000+ missions/year
- China: the world’s largest program, claims 55 billion tonnes of extra rain per year
- Wyoming: the most rigorous Western study, showed 5–15% increase in snowpack
- India: several state programs, mostly targeting agriculture in drought regions`,
      analogy: 'Proving cloud seeding works is like proving a specific advertisement caused sales to increase. Sales might have gone up anyway due to season, economy, or competitors failing. You need hundreds of carefully controlled comparisons to separate the signal from the noise. That is why 80 years after its invention, cloud seeding is still considered "probably works, but hard to prove."',
      storyConnection: 'In the story, Meghi released her rain voluntarily after the East Wind’s conversation. If this were a cloud seeding trial, we could not prove whether the rain was due to the Wind’s "seeding" (the conversation) or whether Meghi would have rained anyway. This mirrors the real scientific debate: the atmosphere is so complex that attributing any single rain event to seeding is nearly impossible.',
      checkQuestion: 'A politician claims "our cloud seeding program produced 1 billion litres of extra water last month." What questions should a scientist ask to evaluate this claim?',
      checkAnswer: 'Key questions: (1) How was "extra" defined? Compared to what baseline — historical average, nearby unseeded area, or model prediction? (2) Were the seeding events randomized, or did operators choose to seed only when rain looked likely anyway (selection bias)? (3) What is the natural variability in monthly rainfall? If it varies by +/-50% naturally, a 10% increase from seeding is within the noise. (4) Were there controls — unseeded clouds in the same area on similar days? Without rigorous controls, the claim is essentially unfalsifiable.',
      codeIntro: 'Simulate a cloud seeding experiment with statistical analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a cloud seeding randomized trial
n_events = 200  # number of cloud events
true_effect = 0.10  # true 10% increase from seeding

# Natural rainfall is highly variable (log-normal distribution)
natural_mean = 15  # mm
natural_std = 12   # mm

# Randomly assign seed/no-seed
seeded = np.random.choice([True, False], size=n_events)

# Generate rainfall
rainfall = np.zeros(n_events)
for i in range(n_events):
    base = max(0, np.random.lognormal(np.log(natural_mean), 0.8))
    if seeded[i]:
        base *= (1 + true_effect + np.random.normal(0, 0.05))  # seeding effect + noise
    rainfall[i] = max(0, base)

seeded_rain = rainfall[seeded]
control_rain = rainfall[~seeded]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Distribution comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
bins = np.linspace(0, 80, 30)
ax.hist(control_rain, bins=bins, alpha=0.5, color='#3b82f6', label=f'Control (n={len(control_rain)})')
ax.hist(seeded_rain, bins=bins, alpha=0.5, color='#22c55e', label=f'Seeded (n={len(seeded_rain)})')
ax.axvline(np.mean(control_rain), color='#3b82f6', linestyle='--', linewidth=2)
ax.axvline(np.mean(seeded_rain), color='#22c55e', linestyle='--', linewidth=2)
ax.set_xlabel('Rainfall (mm)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Can You See the Difference?', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Effect size with confidence interval
ax = axes[0, 1]
ax.set_facecolor('#111827')

# Bootstrap confidence interval
n_bootstrap = 5000
diffs = []
for _ in range(n_bootstrap):
    s = np.random.choice(seeded_rain, size=len(seeded_rain), replace=True)
    c = np.random.choice(control_rain, size=len(control_rain), replace=True)
    diffs.append((np.mean(s) - np.mean(c)) / np.mean(c) * 100)

diffs = np.array(diffs)
ax.hist(diffs, bins=50, color='#f59e0b', alpha=0.7, edgecolor='none')
ci_low, ci_high = np.percentile(diffs, [2.5, 97.5])
ax.axvline(0, color='#ef4444', linestyle='--', linewidth=2, label='No effect')
ax.axvline(np.mean(diffs), color='#22c55e', linestyle='--', linewidth=2, label=f'Observed: {np.mean(diffs):.1f}%')
ax.axvspan(ci_low, ci_high, alpha=0.15, color='#22c55e')
ax.set_xlabel('Seeding effect (%)', color='white')
ax.set_ylabel('Bootstrap count', color='white')
ax.set_title(f'95% CI: [{ci_low:.1f}%, {ci_high:.1f}%]', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# How sample size affects detectability
ax = axes[1, 0]
ax.set_facecolor('#111827')
sample_sizes = [20, 50, 100, 200, 500, 1000]
detection_rates = []

for n in sample_sizes:
    detected = 0
    for trial in range(500):
        s = np.random.lognormal(np.log(natural_mean * 1.1), 0.8, n)
        c = np.random.lognormal(np.log(natural_mean), 0.8, n)
        # Simple t-test approximation
        t_stat = (np.mean(s) - np.mean(c)) / np.sqrt(np.var(s)/n + np.var(c)/n)
        if t_stat > 1.96:  # p < 0.05 one-sided
            detected += 1
    detection_rates.append(detected / 500 * 100)

ax.bar(range(len(sample_sizes)), detection_rates, color='#22c55e', alpha=0.7)
ax.set_xticks(range(len(sample_sizes)))
ax.set_xticklabels(sample_sizes, color='white')
ax.axhline(80, color='#f59e0b', linestyle='--', alpha=0.7)
ax.text(0.5, 82, '80% power threshold', color='#f59e0b', fontsize=9)
ax.set_xlabel('Number of cloud events', color='white')
ax.set_ylabel('Detection rate (%)', color='white')
ax.set_title('How Many Clouds to Prove a 10% Effect?', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Cost-benefit analysis
ax = axes[1, 1]
ax.set_facecolor('#111827')
effects = [0, 5, 10, 15, 20]
costs_per_event = 5000  # USD per seeding mission
events_per_year = 200
water_value = 0.50  # USD per cubic metre
catchment_area = 100e6  # m^2 (100 km^2)
base_rainfall = 0.5  # m/year

costs = [costs_per_event * events_per_year / 1e6] * len(effects)  # million USD
benefits = []
for e in effects:
    extra_water = catchment_area * base_rainfall * (e / 100)  # m^3
    benefits.append(extra_water * water_value / 1e6)  # million USD

x = np.arange(len(effects))
ax.bar(x - 0.15, costs, width=0.3, color='#ef4444', alpha=0.7, label='Annual cost')
ax.bar(x + 0.15, benefits, width=0.3, color='#22c55e', alpha=0.7, label='Water value')
ax.set_xticks(x)
ax.set_xticklabels([f'{e}%' for e in effects], color='white')
ax.set_xlabel('Seeding effectiveness', color='white')
ax.set_ylabel('Million USD', color='white')
ax.set_title('Cloud Seeding: Cost vs Benefit', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

observed_effect = (np.mean(seeded_rain) - np.mean(control_rain)) / np.mean(control_rain) * 100
print(f"Experiment results (true effect: {true_effect*100:.0f}%):")
print(f"  Control mean: {np.mean(control_rain):.1f} mm")
print(f"  Seeded mean: {np.mean(seeded_rain):.1f} mm")
print(f"  Observed effect: {observed_effect:.1f}%")
print(f"  95% CI: [{ci_low:.1f}%, {ci_high:.1f}%]")
sig = "YES" if ci_low > 0 else "NO"
print(f"  Statistically significant (CI excludes 0): {sig}")
print(f"  Need ~{sample_sizes[detection_rates.index(min([d for d in detection_rates if d >= 80], default=100))]} events for 80% detection power")`,
      challenge: 'Reduce the true effect to 5% (closer to conservative estimates). How many cloud events do you need to detect this smaller effect with 80% power? What does this tell you about why cloud seeding studies are so hard?',
      successHint: 'The statistics of cloud seeding are a masterclass in experimental design. The same challenges — high natural variability, expensive experiments, ethical constraints on randomization — apply to many fields: medicine, education, economics, and climate policy.',
    },
    {
      title: 'Monsoon dynamics — the engine behind Meghalaya’s clouds',
      concept: `Meghi’s journey from the Bay of Bengal to the Khasi Hills is not random — it follows the **Indian monsoon**, one of the largest atmospheric circulation patterns on Earth.

**What drives the monsoon?** Differential heating. In summer, the Asian landmass (especially the Tibetan Plateau at 4,500m average altitude) heats up much faster than the Indian Ocean. Hot air rises over land, creating a low-pressure zone. Cooler, moisture-laden air over the ocean flows in to replace it. This massive sea-to-land wind carries billions of tonnes of water vapor.

**The monsoon lifecycle over Meghalaya:**
1. **Pre-monsoon (March–May):** Land heats up. Local convection starts. Isolated thunderstorms.
2. **Onset (June):** The large-scale pressure gradient triggers monsoon winds from the Bay of Bengal. Moisture-laden air hits the Khasi Hills.
3. **Peak (July–August):** Continuous orographic rainfall. Cherrapunji averages 2,500+ mm per MONTH.
4. **Withdrawal (October–November):** Land cools, pressure gradient reverses. Dry northeast winds replace the moist southwest flow.

**The monsoon is not steady** — it has "active" periods (heavy rain) and "break" periods (dry spells), driven by oscillations in the Intertropical Convergence Zone (ITCZ). Understanding these oscillations is critical for agriculture, water management, and flood prediction.`,
      analogy: 'The monsoon is like breathing. In summer, the heated land "inhales" — drawing moist air from the ocean. In winter, the cooled land "exhales" — pushing dry air back out to sea. The Tibetan Plateau is the "lung" that drives this planetary-scale breathing. Active and break periods are like the pauses between breaths.',
      storyConnection: 'Meghi "carried water all the way from the Bay of Bengal." This is the literal monsoon journey: water evaporates from the warm Bay of Bengal, is carried by the southwest monsoon winds over the Indian subcontinent, and is deposited as rain when the air hits the first major topographic barrier — the Khasi Hills of Meghalaya. Meghi IS the monsoon, personified.',
      checkQuestion: 'Climate models predict the Tibetan Plateau will warm faster than the Indian Ocean under climate change. How would this affect the Indian monsoon, and what would it mean for Meghalaya?',
      checkAnswer: 'A warmer Tibetan Plateau means a STRONGER temperature contrast with the Indian Ocean in summer. This would: (1) intensify the pressure gradient, strengthening monsoon winds, (2) carry more moisture (warmer air holds more water — 7% more per °C, per the Clausius-Clapeyron equation), (3) potentially increase peak rainfall in Meghalaya but also make the monsoon more variable (stronger active periods, possibly longer breaks). For Meghalaya, this likely means more extreme rainfall events — more flooding, more landslides — even if average annual rainfall stays similar.',
      codeIntro: 'Model the monsoon as a heat engine driven by the land-sea temperature contrast.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Monsoon model: driven by land-sea temperature difference
months = np.arange(1, 13)
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# Temperature cycles (simplified)
ocean_temp = 27 + 2 * np.sin(2 * np.pi * (months - 4) / 12)  # Bay of Bengal (slow change)
land_temp = 20 + 15 * np.sin(2 * np.pi * (months - 3) / 12)  # Tibetan Plateau (large swing)
temp_diff = land_temp - ocean_temp  # positive = land warmer = monsoon

# Moisture transport proportional to temperature difference
moisture_flux = np.maximum(0, temp_diff * 2)  # arbitrary units

# Rainfall model (orographic + moisture flux)
orographic_factor = 1.5  # Khasi Hills amplification
cherrapunji_rain = moisture_flux * orographic_factor * 180  # scale to realistic mm

# Add some noise for realism
np.random.seed(42)
cherrapunji_rain += np.random.normal(0, 100, 12)
cherrapunji_rain = np.maximum(0, cherrapunji_rain)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Temperature difference drives monsoon
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(months, ocean_temp, 'o-', color='#3b82f6', linewidth=2, label='Bay of Bengal SST')
ax.plot(months, land_temp, 's-', color='#ef4444', linewidth=2, label='Tibetan Plateau')
ax.fill_between(months, ocean_temp, land_temp, where=land_temp > ocean_temp,
               alpha=0.15, color='#22c55e', label='Land warmer (monsoon)')
ax.fill_between(months, ocean_temp, land_temp, where=land_temp <= ocean_temp,
               alpha=0.15, color='#f59e0b', label='Ocean warmer (dry)')
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('What Drives the Monsoon: Land vs Sea Temperature', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Moisture flux
ax = axes[0, 1]
ax.set_facecolor('#111827')
colors = ['#3b82f6' if mf > 0 else '#6b7280' for mf in moisture_flux]
ax.bar(months, moisture_flux, color=colors, alpha=0.7)
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white')
ax.set_ylabel('Moisture flux (relative)', color='white')
ax.set_title('Moisture Transport: Bay of Bengal → Meghalaya', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Cherrapunji rainfall
ax = axes[1, 0]
ax.set_facecolor('#111827')
real_rain = [15, 30, 65, 160, 500, 2500, 2800, 1800, 1200, 400, 60, 15]
ax.bar(months - 0.15, real_rain, width=0.3, color='#3b82f6', alpha=0.7, label='Observed')
ax.bar(months + 0.15, cherrapunji_rain, width=0.3, color='#22c55e', alpha=0.7, label='Model')
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white')
ax.set_ylabel('Rainfall (mm)', color='white')
ax.set_title('Cherrapunji Monthly Rainfall: Observed vs Model', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Climate change scenario
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Warmer scenario: land heats 3°C more, ocean 1.5°C more
future_land = land_temp + 3
future_ocean = ocean_temp + 1.5
future_diff = future_land - future_ocean
future_moisture = np.maximum(0, future_diff * 2)
# Clausius-Clapeyron: 7% more moisture per °C
cc_factor = 1 + 0.07 * 2  # average 2°C warming
future_rain = future_moisture * orographic_factor * 180 * cc_factor

ax.plot(months, real_rain, 'o-', color='#3b82f6', linewidth=2, label='Current')
ax.plot(months, future_rain, 's-', color='#ef4444', linewidth=2, label='2080 projection (+3°C land)')
ax.fill_between(months, real_rain, future_rain, where=np.array(future_rain) > np.array(real_rain),
               alpha=0.15, color='#ef4444')
ax.set_xticks(months)
ax.set_xticklabels(month_names, color='white')
ax.set_ylabel('Rainfall (mm)', color='white')
ax.set_title('Climate Change: More Extreme Monsoon?', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

current_total = sum(real_rain)
future_total = sum(future_rain)
print(f"Monsoon analysis:")
print(f"  Current Cherrapunji annual: {current_total:,} mm")
print(f"  Projected 2080 annual: {future_total:,.0f} mm ({(future_total/current_total - 1)*100:.0f}% change)")
print(f"  Peak month increase: {max(future_rain) - max(real_rain):.0f} mm")
print(f"  Clausius-Clapeyron: +7% moisture per °C warming")
print(f"  More rain total, but in more intense bursts → more floods")`,
      challenge: 'Add "active" and "break" periods to the monsoon model: during monsoon months, alternate between 2-week active periods (3x normal rain) and 1-week breaks (0.2x normal rain). How does this change the flood risk even if total rainfall stays the same?',
      successHint: 'The monsoon is not just weather — it is the economic engine of South Asia. Over 1 billion people depend on monsoon rain for agriculture, drinking water, and hydropower. Predicting monsoon behavior is one of the most consequential problems in climate science.',
    },
    {
      title: 'Chaos and predictability — why weather forecasts fail after 10 days',
      concept: `The atmosphere is a **chaotic system**. This means tiny differences in initial conditions grow exponentially over time, making long-term prediction impossible regardless of how powerful our computers are.

This was discovered by **Edward Lorenz** in 1963. He was running a simple weather model on a computer and noticed that rounding a number from 0.506127 to 0.506 produced a completely different weather pattern after a few simulated days. The difference was less than 0.1%, but it grew exponentially — the famous "butterfly effect."

**Practical limits:**
- 1–3 days: highly accurate (90%+)
- 4–7 days: useful but degrading
- 8–10 days: broad patterns only
- Beyond 10–14 days: no better than climatological average

**Why this matters for cloud seeding:** If we cannot predict exactly which cloud will form where in 3 days, how can we evaluate whether seeding a specific cloud "worked"? The chaotic nature of weather is precisely why cloud seeding experiments need hundreds of events to detect a small statistical signal.

**Ensemble forecasting:** Modern weather prediction runs 20–50 slightly different simulations (an "ensemble") and looks at where they agree. Where ensemble members diverge, confidence is low. This is not a limitation — it is the honest way to handle chaos.`,
      analogy: 'Weather prediction is like predicting the path of a ball rolling down a hill covered in bumps. For the first few metres, you can predict it well — gravity dominates. But each tiny bump deflects the ball slightly, and those deflections compound. After a few hundred metres, you have no idea where the ball is. No amount of measurement precision changes this — the bumps are inherently unpredictable because they are too small and too numerous to measure perfectly.',
      storyConnection: 'In the story, no one predicted when Meghi would rain. Not the other clouds, not the East Wind, not the villagers. This is true to life: predicting exactly when and where a specific cloud will rain is essentially impossible more than a few hours ahead. Banri watering her marigolds with "the last water from the family’s storage pot" reflects the human reality of weather uncertainty — you can see the cloud, but you cannot know when it will release.',
      checkQuestion: 'If weather is chaotic and unpredictable beyond 2 weeks, how can climate scientists make predictions about temperatures 50 or 100 years from now?',
      checkAnswer: 'Climate is not weather. Climate is the statistical distribution (averages, extremes, variability) over decades, not the specific sequence of weather events. Analogy: you cannot predict when a specific coin flip will be heads, but you CAN predict that 1000 flips will be roughly 50% heads. Climate models predict the STATISTICS of weather (average temperature, frequency of extreme events), not individual storms. This is why climate projections can be reliable even though next month’s weather is uncertain.',
      codeIntro: 'Simulate the butterfly effect using the Lorenz attractor and demonstrate how small changes grow exponentially.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Lorenz system: the original chaos demonstration
def lorenz(state, sigma=10, rho=28, beta=8/3):
    x, y, z = state
    dx = sigma * (y - x)
    dy = x * (rho - z) - y
    dz = x * y - beta * z
    return np.array([dx, dy, dz])

def integrate_lorenz(initial, dt=0.01, steps=5000):
    trajectory = np.zeros((steps, 3))
    trajectory[0] = initial
    for i in range(1, steps):
        trajectory[i] = trajectory[i-1] + lorenz(trajectory[i-1]) * dt
    return trajectory

# Two runs with tiny initial difference
initial1 = np.array([1.0, 1.0, 1.0])
initial2 = np.array([1.0, 1.0, 1.0001])  # 0.01% different!

traj1 = integrate_lorenz(initial1)
traj2 = integrate_lorenz(initial2)

time = np.arange(len(traj1)) * 0.01

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# The butterfly: Lorenz attractor
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(traj1[:, 0], traj1[:, 2], color='#3b82f6', linewidth=0.3, alpha=0.7, label='Run 1')
ax.plot(traj2[:, 0], traj2[:, 2], color='#ef4444', linewidth=0.3, alpha=0.7, label='Run 2')
ax.set_xlabel('X', color='white')
ax.set_ylabel('Z', color='white')
ax.set_title('Lorenz Attractor (the "butterfly")', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Divergence over time
ax = axes[0, 1]
ax.set_facecolor('#111827')
divergence = np.sqrt(np.sum((traj1 - traj2)**2, axis=1))
ax.plot(time, divergence, color='#f59e0b', linewidth=1.5)
ax.set_xlabel('Time (Lorenz units)', color='white')
ax.set_ylabel('Distance between runs', color='white')
ax.set_title('Tiny Difference → Complete Divergence', color='white', fontsize=11)
ax.axhline(np.max(divergence) * 0.5, color='gray', linestyle=':', alpha=0.4)
ax.text(2, np.max(divergence) * 0.55, 'Forecast useless beyond here', color='gray', fontsize=9)
ax.set_yscale('log')
ax.tick_params(colors='gray')

# Ensemble forecast simulation
ax = axes[1, 0]
ax.set_facecolor('#111827')
n_ensemble = 20
for i in range(n_ensemble):
    perturbed_init = initial1 + np.random.normal(0, 0.001, 3)
    traj = integrate_lorenz(perturbed_init)
    ax.plot(time, traj[:, 0], color=f'C{i % 10}', linewidth=0.5, alpha=0.4)

# Ensemble mean
all_trajs = []
for i in range(n_ensemble):
    perturbed_init = initial1 + np.random.normal(0, 0.001, 3)
    all_trajs.append(integrate_lorenz(perturbed_init))
ensemble = np.array(all_trajs)
mean = np.mean(ensemble[:, :, 0], axis=0)
spread = np.std(ensemble[:, :, 0], axis=0)

ax.plot(time, mean, color='white', linewidth=2, label='Ensemble mean')
ax.fill_between(time, mean - spread, mean + spread, alpha=0.2, color='white', label='±1 std')
ax.set_xlabel('Time', color='white')
ax.set_ylabel('X variable', color='white')
ax.set_title(f'Ensemble Forecast ({n_ensemble} members)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_xlim(0, 20)

# Forecast skill vs lead time
ax = axes[1, 1]
ax.set_facecolor('#111827')
lead_days = np.arange(0, 15)
# Forecast skill decays exponentially (Lorenz showed doubling time ~2.5 days)
skill = 100 * np.exp(-lead_days / 3.5)
ax.plot(lead_days, skill, 'o-', color='#22c55e', linewidth=2, markersize=8)
ax.fill_between(lead_days, 0, skill, alpha=0.15, color='#22c55e')
ax.axhline(50, color='#f59e0b', linestyle='--', alpha=0.7)
ax.text(10, 53, 'Useful forecast threshold', color='#f59e0b', fontsize=9)
ax.axhline(20, color='#ef4444', linestyle='--', alpha=0.7)
ax.text(10, 23, 'Climatology (no skill)', color='#ef4444', fontsize=9)
ax.set_xlabel('Forecast lead time (days)', color='white')
ax.set_ylabel('Forecast skill (%)', color='white')
ax.set_title('Weather Forecast Skill vs Lead Time', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Chaos in weather:")
print(f"  Initial difference: 0.01% (0.0001 in z)")
print(f"  Time to complete divergence: ~15 Lorenz time units")
print(f"  Real atmosphere: useful forecasts up to ~10 days")
print(f"  Beyond that: ensemble statistics only")
print(f"  Climate prediction works because it predicts STATISTICS, not events")`,
      challenge: 'Increase the number of ensemble members to 50 and recalculate. Does the ensemble mean improve? Does the spread decrease? What is the minimum number of ensemble members needed for a useful forecast? (This is a real operational question: more ensemble members = more computer cost.)',
      successHint: 'Lorenz’s discovery of chaos changed not just meteorology but all of science. The butterfly effect means there are fundamental limits to prediction in any nonlinear system — the atmosphere, the stock market, population dynamics, even the solar system on billion-year timescales. Understanding these limits is not a failure; it is wisdom.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Cloud Physics &amp; Atmospheric Science</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for atmospheric simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
