import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function DancingDeerLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Wetland ecology — the floating world of Loktak Lake',
      concept: `Loktak Lake in Manipur is the largest freshwater lake in Northeast India, famous for its **phumdi** — floating mats of vegetation, soil, and organic matter that support an entire ecosystem, including the endangered Eld's deer (brow-antlered deer, Rucervus eldii eldii).

Wetland ecology operates on different principles than terrestrial ecology:

- **Hydrology drives everything**: water level determines which species survive. Too high, and phumdi submerge, drowning the deer. Too low, and the phumdi ground on the lakebed, losing their floating character and becoming accessible to predators and poachers.
- **Nutrient cycling**: phumdi act as giant biological filters. They absorb nitrogen and phosphorus from the water, preventing eutrophication. When phumdi are removed, water quality crashes.
- **Primary productivity**: floating vegetation has access to both water nutrients (below) and sunlight (above), making phumdi among the most productive ecosystems per unit area.
- **Fragmentation**: large, continuous phumdi provide more habitat than the same area of small fragments. The Keibul Lamjao National Park (the only floating national park in the world) protects 40 km² of phumdi.

The Ithai Dam, built in 1983, altered the lake's hydrology permanently — raising dry-season water levels and submerging phumdi. This is the primary threat to the brow-antlered deer.`,
      analogy: 'Imagine a neighborhood built on rafts floating on a lake. The houses, gardens, and roads all float. If someone raises the water level by 2 meters, the entire neighborhood is underwater. If they lower it by 2 meters, the rafts ground on mud and people can walk in from shore — including people who are not welcome. The residents need water levels in a narrow "Goldilocks zone." That is exactly the deer\'s situation on phumdi.',
      storyConnection: 'The dancing deer of Loktak Lake dance on phumdi — floating islands that rise and fall with the water. The story captures the fragility of this unique habitat. The deer\'s survival depends not on the amount of land, but on the behavior of water. Wetland ecology quantifies this dependency and predicts what happens when humans alter it.',
      checkQuestion: 'The Ithai Dam raised dry-season water levels by 2-3 meters. Why would higher water levels harm deer that live on floating islands?',
      checkAnswer: 'Higher water makes phumdi thinner (less buoyancy margin), fragments them (wave action on deeper water), and submerges the grassy areas deer feed on. Deer cannot swim indefinitely — they need solid phumdi to stand, feed, and give birth. Also, thinner phumdi cannot support their weight (~100 kg). The dam transformed robust phumdi into fragile mats that barely support the deer.',
      codeIntro: 'Model the relationship between water level, phumdi thickness, and deer carrying capacity for Loktak Lake.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Loktak Lake hydrology model ---
# Water level varies seasonally (monsoon = high, dry season = low)
months = np.arange(0, 120)  # 10 years of monthly data
month_in_year = months % 12

# Natural water level cycle (pre-dam)
natural_base = 766.5  # meters above sea level
natural_amplitude = 2.0  # seasonal range
natural_level = natural_base + natural_amplitude * np.sin(2 * np.pi * (month_in_year - 3) / 12)
natural_level += np.random.normal(0, 0.3, len(months))  # interannual variability

# Post-dam water level (raised dry-season minimum)
dam_base = 768.5  # 2m higher minimum
dam_amplitude = 1.2  # less seasonal variation (dam regulates)
dam_level = dam_base + dam_amplitude * np.sin(2 * np.pi * (month_in_year - 3) / 12)
dam_level += np.random.normal(0, 0.2, len(months))

# --- Phumdi model ---
# Phumdi thickness depends on water level (inversely)
# At natural levels: thick, robust phumdi (1.0-2.5m thick)
# At dam levels: thin, fragile phumdi (0.3-1.0m thick)

def phumdi_thickness(water_level, base_thickness=2.0, optimal_level=766.5):
    """Phumdi thickness decreases as water rises above optimal."""
    excess = np.maximum(water_level - optimal_level, 0)
    thickness = base_thickness * np.exp(-0.3 * excess)
    return np.maximum(thickness, 0.1)

def phumdi_area(water_level, max_area=40.0, fragmentation_threshold=768.0):
    """Total phumdi area. High water fragments and submerges phumdi."""
    intact_fraction = 1.0 / (1.0 + np.exp(2.0 * (water_level - fragmentation_threshold)))
    return max_area * intact_fraction

def deer_carrying_capacity(thickness, area, min_thickness=0.5, weight_per_deer=100):
    """Carrying capacity based on phumdi that can support deer weight."""
    # Phumdi must be thick enough to support deer
    usable_fraction = np.where(thickness > min_thickness,
                                (thickness - min_thickness) / thickness, 0.0)
    # Each deer needs ~0.5 km² of quality phumdi
    capacity = area * usable_fraction / 0.5
    return np.maximum(capacity, 0)

# Compute for both scenarios
natural_thickness = phumdi_thickness(natural_level)
dam_thickness = phumdi_thickness(dam_level)
natural_area = phumdi_area(natural_level)
dam_area = phumdi_area(dam_level)
natural_K = deer_carrying_capacity(natural_thickness, natural_area)
dam_K = deer_carrying_capacity(dam_thickness, dam_area)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Loktak Lake: Dam impact on phumdi and deer habitat', color='white', fontsize=14)

# Plot 1: Water levels
ax = axes[0, 0]
ax.set_facecolor('#111827')
years = months / 12
ax.plot(years, natural_level, color='#22c55e', linewidth=1.5, label='Pre-dam', alpha=0.8)
ax.plot(years, dam_level, color='#ef4444', linewidth=1.5, label='Post-dam', alpha=0.8)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Water level (m ASL)', color='white')
ax.set_title('Water level regime', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Phumdi thickness
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(years, natural_thickness, color='#22c55e', linewidth=1.5, label='Pre-dam')
ax.plot(years, dam_thickness, color='#ef4444', linewidth=1.5, label='Post-dam')
ax.axhline(0.5, color='#f59e0b', linestyle='--', linewidth=1, label='Min for deer (0.5m)')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Thickness (m)', color='white')
ax.set_title('Phumdi thickness', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 3: Phumdi area
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(years, natural_area, color='#22c55e', linewidth=1.5, label='Pre-dam')
ax.plot(years, dam_area, color='#ef4444', linewidth=1.5, label='Post-dam')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Area (km²)', color='white')
ax.set_title('Total phumdi area', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Carrying capacity
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(years, natural_K, color='#22c55e', linewidth=1.5, label='Pre-dam')
ax.plot(years, dam_K, color='#ef4444', linewidth=1.5, label='Post-dam')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Deer carrying capacity', color='white')
ax.set_title('Habitat capacity for brow-antlered deer', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Water level vs carrying capacity (phase plot)
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.scatter(natural_level, natural_K, c='#22c55e', s=10, alpha=0.5, label='Pre-dam')
ax.scatter(dam_level, dam_K, c='#ef4444', s=10, alpha=0.5, label='Post-dam')
ax.set_xlabel('Water level (m ASL)', color='white')
ax.set_ylabel('Carrying capacity', color='white')
ax.set_title('Water level vs deer capacity', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Summary statistics
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
stats = [
    ['Metric', 'Pre-dam', 'Post-dam'],
    ['Mean water (m)', f'{np.mean(natural_level):.1f}', f'{np.mean(dam_level):.1f}'],
    ['Mean thickness (m)', f'{np.mean(natural_thickness):.2f}', f'{np.mean(dam_thickness):.2f}'],
    ['Mean area (km²)', f'{np.mean(natural_area):.1f}', f'{np.mean(dam_area):.1f}'],
    ['Mean capacity', f'{np.mean(natural_K):.0f}', f'{np.mean(dam_K):.0f}'],
    ['Months K<20', f'{np.sum(natural_K < 20)}', f'{np.sum(dam_K < 20)}'],
]
table = ax.table(cellText=stats[1:], colLabels=stats[0], cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('Impact summary', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"Pre-dam mean carrying capacity: {np.mean(natural_K):.0f} deer")
print(f"Post-dam mean carrying capacity: {np.mean(dam_K):.0f} deer")
print(f"Capacity reduction: {(1 - np.mean(dam_K)/np.mean(natural_K))*100:.0f}%")
print()
print("The dam did not destroy the phumdi directly.")
print("It raised water levels, which thinned and fragmented phumdi,")
print("which reduced the area that can support deer weight,")
print("which collapsed carrying capacity. Indirect, but devastating.")`,
      challenge: 'Model a scenario where the dam is operated to release water during dry season (lowering post-dam levels by 1 meter for 4 months). How much does this improve deer carrying capacity? This is the actual management recommendation for Loktak Lake.',
      successHint: 'Wetland ecology shows how small hydrological changes cascade into population-level impacts. The Loktak Dam is a real case study in unintended consequences — engineers built a dam for hydropower, not realizing it would push a species to the brink of extinction.',
    },
    {
      title: 'Endangered species population viability — modeling small populations',
      concept: `The brow-antlered deer (Sangai) population was estimated at just 14 individuals in 1975. Today there are roughly 260. But is 260 enough? **Population Viability Analysis (PVA)** answers this question by simulating population dynamics under uncertainty.

Small populations face three threats that large populations can ignore:

1. **Demographic stochasticity**: in a population of 10, if 6 happen to be male, reproduction is severely limited. In a population of 1000, the sex ratio averages out. Random variation in births and deaths matters more when N is small.

2. **Environmental stochasticity**: droughts, floods, disease outbreaks affect all individuals simultaneously. A flood that kills 10% of a population of 1000 leaves 900. The same flood kills 10% of a population of 20, leaving 18 — dangerously close to extinction.

3. **Genetic stochasticity**: small populations lose genetic diversity through drift. Inbreeding increases (mating with relatives is unavoidable when N < 50). Inbreeding depression reduces survival and fertility.

PVA runs hundreds of simulations with these stochastic processes and reports the **probability of extinction** over a given time horizon. The standard: a population with <5% extinction probability over 100 years is considered viable (IUCN criterion).

The **Minimum Viable Population (MVP)** is the smallest N that achieves this threshold.`,
      analogy: 'Population viability is like analyzing whether a small startup will survive 10 years. A company with 3 employees can be destroyed by a single person quitting (demographic stochasticity). A market downturn (environmental stochasticity) that barely dents a 10,000-person company can kill a 10-person one. And a startup with only one product line (low genetic diversity) has no backup plan. PVA calculates the survival odds by running the "startup" 1000 times with random events.',
      storyConnection: 'The dancing deer numbered just 14 in 1975 — that is not a population, that is a handful of survivors. The story\'s hope — that the deer are "dancing" back from extinction — depends on whether 260 is above the MVP. If MVP is 500, the deer are still in danger despite the recovery. PVA gives us the number.',
      checkQuestion: 'A population of 100 deer has a 2% annual probability of a catastrophic flood killing 50% of the population. Over 50 years, what is the approximate probability of at least one such flood?',
      checkAnswer: 'P(no flood in 50 years) = (1-0.02)^50 = 0.98^50 ≈ 0.364. So P(at least one flood) ≈ 1 - 0.364 = 63.6%. And if the population was at 100 when the flood hit, it drops to 50. If two floods happen (not unlikely over 50 years), it drops to 25. Environmental stochasticity is the silent killer of small populations.',
      codeIntro: 'Build a stochastic PVA model for the brow-antlered deer, estimating extinction probability and minimum viable population size.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def run_pva(N0, K, r_mean, r_sd, catastrophe_prob, catastrophe_severity,
            years=100, n_sims=500):
    """
    Population Viability Analysis with:
    - Logistic growth with environmental stochasticity
    - Demographic stochasticity (Poisson births/deaths)
    - Catastrophes (random severe events)
    - Inbreeding depression (reduced fitness at low N)
    """
    trajectories = []
    extinction_times = []

    for sim in range(n_sims):
        pop = [N0]
        extinct = False

        for year in range(years):
            N = pop[-1]

            if N < 2:  # functionally extinct
                pop.extend([0] * (years - year))
                extinction_times.append(year)
                extinct = True
                break

            # Inbreeding depression: fitness declines below N=50
            inbreeding_factor = min(1.0, N / 50)

            # Environmental stochasticity: random growth rate
            r = np.random.normal(r_mean * inbreeding_factor, r_sd)

            # Logistic growth
            expected_growth = r * N * (1 - N / K)

            # Demographic stochasticity (more important at small N)
            if N < 100:
                # Individual-based: each animal has independent birth/death
                births = np.random.poisson(max(0, (r_mean * inbreeding_factor + 0.05) * N * 0.5))
                deaths = np.random.poisson(max(0, 0.05 * N + max(0, -expected_growth * 0.3)))
                new_N = N + births - deaths
            else:
                new_N = N + expected_growth + np.random.normal(0, np.sqrt(abs(N) * 0.1))

            # Catastrophe
            if np.random.random() < catastrophe_prob:
                new_N *= (1 - catastrophe_severity)

            new_N = max(0, int(round(new_N)))
            pop.append(new_N)

        trajectories.append(pop[:years + 1])
        if not extinct:
            extinction_times.append(years)  # survived

    return np.array(trajectories), np.array(extinction_times)

# Sangai deer parameters
K = 400  # estimated carrying capacity at Keibul Lamjao
r_mean = 0.08  # low intrinsic growth (large mammal)
r_sd = 0.06  # environmental variation
catastrophe_prob = 0.03  # 3% chance per year (flood, disease)
catastrophe_severity = 0.4  # kills 40% when it happens

# Run PVA at different starting populations
start_sizes = [14, 50, 100, 150, 260, 400]
results = {}
for N0 in start_sizes:
    traj, ext_times = run_pva(N0, K, r_mean, r_sd, catastrophe_prob, catastrophe_severity)
    ext_prob = np.mean(ext_times < 100)
    results[N0] = {'trajectories': traj, 'ext_times': ext_times, 'ext_prob': ext_prob}
    print(f"N0={N0:>4}: extinction probability = {ext_prob:.1%}")

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Population Viability Analysis: Brow-antlered Deer (Sangai)', color='white', fontsize=14)

# Plot 1-3: Population trajectories for 3 key starting sizes
for idx, N0 in enumerate([14, 100, 260]):
    ax = axes[0, idx]
    ax.set_facecolor('#111827')
    traj = results[N0]['trajectories']
    # Plot 50 random trajectories
    for i in range(min(50, len(traj))):
        color = '#ef4444' if traj[i, -1] == 0 else '#22c55e'
        ax.plot(traj[i], color=color, linewidth=0.3, alpha=0.3)
    # Median and quartiles
    median = np.median(traj, axis=0)
    q25 = np.percentile(traj, 25, axis=0)
    q75 = np.percentile(traj, 75, axis=0)
    ax.plot(median, color='white', linewidth=2)
    ax.fill_between(range(len(median)), q25, q75, color='white', alpha=0.1)
    ax.axhline(K, color='#f59e0b', linestyle='--', linewidth=1, alpha=0.5)
    ext_p = results[N0]['ext_prob']
    ax.set_title(f'N₀ = {N0} (P_ext = {ext_p:.0%})', color='white', fontsize=11)
    ax.set_xlabel('Year', color='white')
    ax.set_ylabel('Population', color='white')
    ax.set_ylim(0, K * 1.3)
    ax.tick_params(colors='gray')

# Plot 4: Extinction probability vs starting population
ax = axes[1, 0]
ax.set_facecolor('#111827')
ns = sorted(results.keys())
probs = [results[n]['ext_prob'] for n in ns]
ax.plot(ns, probs, 'o-', color='#ef4444', linewidth=2, markersize=8)
ax.axhline(0.05, color='#f59e0b', linestyle='--', linewidth=1, label='5% threshold (IUCN viable)')
ax.set_xlabel('Starting population', color='white')
ax.set_ylabel('100-year extinction probability', color='white')
ax.set_title('Extinction risk vs population size', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Estimate MVP (where extinction prob crosses 5%)
mvp_candidates = [(n, p) for n, p in zip(ns, probs) if p <= 0.05]
mvp = mvp_candidates[0][0] if mvp_candidates else ">400"

# Plot 5: Time to extinction distribution
ax = axes[1, 1]
ax.set_facecolor('#111827')
for N0, color in [(14, '#ef4444'), (100, '#f59e0b'), (260, '#22c55e')]:
    ext_t = results[N0]['ext_times']
    extinct_only = ext_t[ext_t < 100]
    if len(extinct_only) > 0:
        ax.hist(extinct_only, bins=20, alpha=0.5, color=color, label=f'N₀={N0}', edgecolor='none')
ax.set_xlabel('Year of extinction', color='white')
ax.set_ylabel('Count (out of 500 simulations)', color='white')
ax.set_title('When do extinctions happen?', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Cumulative survival probability
ax = axes[1, 2]
ax.set_facecolor('#111827')
for N0, color in [(14, '#ef4444'), (100, '#f59e0b'), (260, '#22c55e'), (400, '#3b82f6')]:
    ext_t = results[N0]['ext_times']
    survival = []
    for year in range(101):
        survival.append(np.mean(ext_t > year))
    ax.plot(range(101), survival, color=color, linewidth=2, label=f'N₀={N0}')
ax.axhline(0.95, color='gray', linestyle=':', linewidth=1)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Survival probability', color='white')
ax.set_title('Cumulative survival curves', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"\\\nEstimated Minimum Viable Population (MVP): {mvp}")
print(f"Current population (~260): extinction risk = {results[260]['ext_prob']:.1%}")
print(f"At 1975 low (14): extinction risk = {results[14]['ext_prob']:.1%}")
print()
print("The Sangai's recovery from 14 to 260 is remarkable,")
print("but 260 may still be below MVP depending on catastrophe frequency.")
print("Continued habitat protection is essential.")`,
      challenge: 'Increase catastrophe_prob to 0.05 (climate change making floods more frequent). How does this change the MVP? What if you also increase K to 600 by restoring more phumdi? Which intervention matters more — reducing catastrophes or increasing carrying capacity?',
      successHint: 'PVA is the workhorse of endangered species management. Every IUCN Red List assessment uses some form of PVA. The numbers you computed — extinction probabilities and MVP estimates — are the same numbers that drive conservation funding decisions for real species.',
    },
    {
      title: 'Camera trap analysis — capture-recapture population estimation',
      concept: `How do you count animals you can rarely see? The brow-antlered deer lives in dense phumdi vegetation where direct counts are unreliable. **Camera traps** — motion-triggered cameras placed throughout the habitat — provide systematic detection data.

The classic method for estimating population from camera trap data is **capture-recapture** (also called mark-recapture). The Lincoln-Petersen method:

1. Session 1: "capture" (photograph) M individuals
2. Session 2: capture n individuals, of which m were already captured in session 1 (recaptures)
3. Estimate: N̂ = M × n / m

The logic: if you captured half the population in session 1, you should recapture half your session-2 animals. If only 20% are recaptures, the population must be 5× your session-1 sample.

**Chapman's correction** (less biased for small samples): N̂ = (M+1)(n+1)/(m+1) - 1

For camera traps, individual identification replaces physical marking. Deer have unique antler patterns, scars, and spot patterns that allow photo-ID.

More sophisticated: the **POPAN model** and **Jolly-Seber model** handle:
- Multiple sampling sessions
- Open populations (births, deaths, immigration between sessions)
- Varying capture probabilities`,
      analogy: 'Capture-recapture is like estimating how many fish are in a pond. You catch 100 fish, tag them, release them. Next week you catch 100 again. If 10 have tags, then your 100 tagged fish are 10% of the total, so there are ~1000 fish. The key assumption: tagged fish mix randomly with untagged fish. If tagged fish avoid the trap (or are more likely to be caught), the estimate is wrong.',
      storyConnection: 'Counting the dancing deer is difficult because they hide in dense floating vegetation. Camera traps on phumdi edges catch glimpses of individuals. The unique antler patterns of male Sangai allow photo-ID — each deer is "marked" by nature. Capture-recapture analysis turns these random sightings into a rigorous population estimate that tells us whether the Sangai is recovering or declining.',
      checkQuestion: 'Session 1 captures 30 deer. Session 2 captures 25 deer, of which 5 were also seen in session 1. What is the Lincoln-Petersen estimate? What is the 95% confidence interval (approximately)?',
      checkAnswer: 'N̂ = 30 × 25 / 5 = 150 deer. Chapman\'s correction: (31 × 26 / 6) - 1 ≈ 133. The variance of Lincoln-Petersen is approximately M²n(n-m)/m³ = 900×25×20/125 = 3600, so SE ≈ 60. The 95% CI is roughly 150 ± 120, which is very wide. With only 5 recaptures, the estimate is imprecise. More sampling sessions would narrow the interval dramatically.',
      codeIntro: 'Simulate camera trap data for the Sangai deer and implement Lincoln-Petersen, Chapman, and multi-session capture-recapture estimation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Simulate camera trap study ---
true_N = 260  # actual population
n_cameras = 25  # camera trap stations
n_sessions = 8  # monthly sampling sessions
detection_prob = 0.15  # probability of detecting a specific deer at a camera

# Generate individual detection histories
# Each row = one deer, each column = one session
# 1 = detected, 0 = not detected
detections = np.zeros((true_N, n_sessions), dtype=int)
for deer in range(true_N):
    for session in range(n_sessions):
        # Detection prob varies by individual (some are bolder)
        individual_p = detection_prob * np.random.uniform(0.5, 1.5)
        # And by session (some months have better visibility)
        session_p = individual_p * np.random.uniform(0.7, 1.3)
        if np.random.random() < session_p:
            detections[deer, session] = 1

# Count statistics
n_detected_ever = np.sum(np.any(detections, axis=1))
detections_per_session = np.sum(detections, axis=0)
detections_per_individual = np.sum(detections, axis=1)
detected_individuals = detections[np.any(detections, axis=1)]

print(f"True population: {true_N}")
print(f"Individuals detected at least once: {n_detected_ever}")
print(f"Detections per session: {detections_per_session}")

# --- Lincoln-Petersen (sessions 1 & 2) ---
session1_ids = set(np.where(detections[:, 0] == 1)[0])
session2_ids = set(np.where(detections[:, 1] == 1)[0])
M = len(session1_ids)  # marked in session 1
n = len(session2_ids)  # captured in session 2
m = len(session1_ids & session2_ids)  # recaptured

if m > 0:
    lp_estimate = M * n / m
    chapman_estimate = (M + 1) * (n + 1) / (m + 1) - 1
    lp_variance = M**2 * n * (n - m) / (m**3) if m > 0 else float('inf')
    lp_se = np.sqrt(lp_variance)
else:
    lp_estimate = float('inf')
    chapman_estimate = float('inf')
    lp_se = float('inf')

# --- Multi-session Schnabel method ---
# Cumulative mark-recapture across all sessions
schnabel_estimates = []
cumulative_marked = set()
for t in range(n_sessions):
    current_session = set(np.where(detections[:, t] == 1)[0])
    recaptured = len(current_session & cumulative_marked)
    new_captures = len(current_session)

    if recaptured > 0 and len(cumulative_marked) > 0:
        # Schnabel: N = sum(C_t * M_t) / sum(R_t)
        est = len(cumulative_marked) * new_captures / recaptured
        schnabel_estimates.append(est)

    cumulative_marked.update(current_session)

# --- Bootstrap confidence intervals ---
n_bootstrap = 500
bootstrap_estimates = []
for b in range(n_bootstrap):
    # Resample sessions
    sampled_sessions = np.random.choice(n_sessions, n_sessions, replace=True)
    sampled_detections = detections[:, sampled_sessions]

    # Use first two sampled sessions for LP
    s1 = set(np.where(sampled_detections[:, 0] == 1)[0])
    s2 = set(np.where(sampled_detections[:, 1] == 1)[0])
    m_b = len(s1 & s2)
    if m_b > 0:
        bootstrap_estimates.append((len(s1) + 1) * (len(s2) + 1) / (m_b + 1) - 1)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Camera Trap Capture-Recapture: Sangai Population Estimation', color='white', fontsize=14)

# Plot 1: Detection history (first 50 individuals)
ax = axes[0, 0]
ax.set_facecolor('#111827')
show_n = min(50, n_detected_ever)
detected_only = detections[np.any(detections, axis=1)][:show_n]
ax.imshow(detected_only, cmap='Greens', aspect='auto', interpolation='nearest')
ax.set_xlabel('Session', color='white')
ax.set_ylabel('Individual', color='white')
ax.set_title(f'Detection histories (first {show_n} of {n_detected_ever})', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 2: Detections per session
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.bar(range(n_sessions), detections_per_session, color='#3b82f6', edgecolor='none')
ax.axhline(np.mean(detections_per_session), color='#f59e0b', linestyle='--', label=f'Mean: {np.mean(detections_per_session):.0f}')
ax.set_xlabel('Session', color='white')
ax.set_ylabel('Detections', color='white')
ax.set_title('Detections per session', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Capture frequency (how many times each individual was seen)
ax = axes[0, 2]
ax.set_facecolor('#111827')
capture_freq = detections_per_individual[detections_per_individual > 0]
ax.hist(capture_freq, bins=range(1, n_sessions + 2), color='#22c55e', edgecolor='none', alpha=0.8)
ax.set_xlabel('Times detected', color='white')
ax.set_ylabel('Number of individuals', color='white')
ax.set_title('Capture frequency distribution', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 4: Running estimates
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(range(len(schnabel_estimates)), schnabel_estimates, 'o-', color='#a855f7', linewidth=2, label='Schnabel')
ax.axhline(true_N, color='#22c55e', linestyle='--', linewidth=2, label=f'True N = {true_N}')
if m > 0:
    ax.axhline(lp_estimate, color='#ef4444', linestyle=':', linewidth=1, label=f'LP estimate = {lp_estimate:.0f}')
ax.set_xlabel('Session pair', color='white')
ax.set_ylabel('Population estimate', color='white')
ax.set_title('Running population estimates', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 5: Bootstrap confidence interval
ax = axes[1, 1]
ax.set_facecolor('#111827')
if len(bootstrap_estimates) > 0:
    ax.hist(bootstrap_estimates, bins=30, color='#3b82f6', edgecolor='none', alpha=0.7)
    ci_lo = np.percentile(bootstrap_estimates, 2.5)
    ci_hi = np.percentile(bootstrap_estimates, 97.5)
    ax.axvline(true_N, color='#22c55e', linewidth=2, label=f'True N = {true_N}')
    ax.axvline(np.median(bootstrap_estimates), color='#f59e0b', linewidth=2, label=f'Median est = {np.median(bootstrap_estimates):.0f}')
    ax.axvline(ci_lo, color='gray', linestyle='--', linewidth=1)
    ax.axvline(ci_hi, color='gray', linestyle='--', linewidth=1)
    ax.set_title(f'Bootstrap 95% CI: [{ci_lo:.0f}, {ci_hi:.0f}]', color='white', fontsize=11)
ax.set_xlabel('Population estimate', color='white')
ax.set_ylabel('Frequency', color='white')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 6: Discovery curve (cumulative unique individuals)
ax = axes[1, 2]
ax.set_facecolor('#111827')
cumulative_unique = []
seen = set()
for t in range(n_sessions):
    seen.update(np.where(detections[:, t] == 1)[0])
    cumulative_unique.append(len(seen))
ax.plot(range(n_sessions), cumulative_unique, 'o-', color='#22c55e', linewidth=2, markersize=8)
ax.axhline(true_N, color='#f59e0b', linestyle='--', label=f'True N = {true_N}')
ax.set_xlabel('Number of sessions', color='white')
ax.set_ylabel('Cumulative unique individuals', color='white')
ax.set_title('Discovery curve (is it flattening?)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"\\\nResults:")
print(f"  True population: {true_N}")
print(f"  Individuals detected: {n_detected_ever}")
print(f"  Lincoln-Petersen (sessions 1-2): {lp_estimate:.0f} (SE={lp_se:.0f})")
print(f"  Chapman correction: {chapman_estimate:.0f}")
print(f"  Schnabel (multi-session): {np.mean(schnabel_estimates):.0f}" if schnabel_estimates else "  Schnabel: insufficient recaptures")
if len(bootstrap_estimates) > 0:
    print(f"  Bootstrap 95% CI: [{ci_lo:.0f}, {ci_hi:.0f}]")`,
      challenge: 'Reduce detection_prob to 0.05 (shy animals that avoid cameras). How does this affect the precision of population estimates? How many sessions would you need to get a reliable estimate?',
      successHint: 'Capture-recapture is how we know the Sangai population is ~260. The same method is used for tigers (using stripe patterns), snow leopards (using spot patterns), and whales (using fluke markings). The math is the same — only the "marking" method changes.',
    },
    {
      title: 'Mark-recapture population estimation — the Jolly-Seber open model',
      concept: `The Lincoln-Petersen method assumes a **closed population** — no births, deaths, immigration, or emigration between sampling sessions. For the Sangai deer, this is unrealistic: deer are born, die, and occasionally move between phumdi.

The **Jolly-Seber model** handles **open populations**. It estimates:
- **N_t**: population size at each time t
- **φ_t**: apparent survival rate (probability of surviving and staying in the study area)
- **p_t**: capture probability at time t
- **B_t**: number of new individuals entering the population (births + immigration)

The model uses the full capture history of every individual across multiple sessions. The key insight: if survival is high but capture probability is low, many animals exist but are rarely seen. If survival is low but capture probability is high, the population is declining even though you see lots of animals.

Parameters are estimated via maximum likelihood: find the values of N, φ, p, and B that make the observed capture histories most probable.

For the Sangai, Jolly-Seber can track:
- Whether the population is growing or shrinking
- Seasonal variation in survival (monsoon floods)
- Whether immigration from captive-bred populations is boosting numbers`,
      analogy: 'Lincoln-Petersen is like counting guests at a party by checking coats: you count coats going in (session 1), coats going out (session 2), and see how many match. But what if guests leave early and new ones arrive? The coat count is wrong. Jolly-Seber is like a bouncer with a guest list who tracks check-ins and check-outs throughout the night, accounting for arrivals, departures, and the total crowd at any moment.',
      storyConnection: 'The Sangai is an open population: fawns are born in spring, old deer die, and occasionally individuals are translocated from captive breeding programs. A closed model would confuse new fawns for previously-undetected adults. The Jolly-Seber model separates these: "We detected 30 new individuals this session — 20 are fawns (recruitment) and 10 were always there but finally caught on camera." This distinction matters enormously for understanding population trajectory.',
      checkQuestion: 'In a Jolly-Seber analysis, you estimate φ (survival) = 0.85 per year and p (capture probability) = 0.20. If 50 individuals are captured in session 5, how many are likely alive but not captured?',
      checkAnswer: 'If capture probability is 0.20, then the 50 captured represent 20% of the population present. So N ≈ 50/0.20 = 250 total. About 200 are alive but not captured. This illustrates why raw counts massively underestimate true population — at 20% detection, you miss 80% of the population. Jolly-Seber corrects for this detection bias.',
      codeIntro: 'Implement a simplified Jolly-Seber model for the Sangai deer, estimating survival, capture probability, population size, and recruitment over multiple sessions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Simulate open population ---
n_sessions = 12  # monthly sessions over 1 year
true_survival = np.array([0.95, 0.93, 0.90, 0.88, 0.85, 0.80, 0.82, 0.88, 0.92, 0.94, 0.95, 0.95])
# Lower survival during monsoon (months 4-7)
true_capture_p = np.array([0.15, 0.18, 0.20, 0.12, 0.08, 0.10, 0.12, 0.15, 0.20, 0.22, 0.18, 0.15])
# Lower capture during monsoon (dense vegetation)
recruitment_rate = np.array([0, 0, 5, 8, 3, 2, 0, 0, 0, 3, 5, 2])  # births per month

# Simulate individual capture histories
max_id = 500
alive = np.zeros(max_id, dtype=bool)
alive[:260] = True  # start with 260

capture_histories = np.zeros((max_id, n_sessions), dtype=int)
true_pop_sizes = []
next_id = 260

for t in range(n_sessions):
    # Record true population
    true_pop_sizes.append(np.sum(alive))

    # Capture
    for i in range(max_id):
        if alive[i]:
            if np.random.random() < true_capture_p[t]:
                capture_histories[i, t] = 1

    # Survival (some die before next session)
    if t < n_sessions - 1:
        for i in range(max_id):
            if alive[i]:
                if np.random.random() > true_survival[t]:
                    alive[i] = False

        # Recruitment
        n_recruits = np.random.poisson(recruitment_rate[t])
        for _ in range(n_recruits):
            if next_id < max_id:
                alive[next_id] = True
                next_id += 1

# Keep only individuals ever detected
ever_detected = np.any(capture_histories, axis=1)
histories = capture_histories[ever_detected]
n_individuals = len(histories)

print(f"Total individuals ever detected: {n_individuals}")
print(f"True population sizes: {true_pop_sizes}")

# --- Jolly-Seber estimation ---
# For each session, compute:
#   m_t: marked animals captured
#   u_t: unmarked animals captured
#   n_t: total captured
#   R_t: animals released (= captured, since camera traps don't hold animals)
#   z_t: animals captured before t and after t but not at t

n_t = np.sum(histories, axis=0)  # total captured per session
first_capture = np.full(n_individuals, -1)
last_capture = np.full(n_individuals, -1)

for i in range(n_individuals):
    captures = np.where(histories[i] == 1)[0]
    if len(captures) > 0:
        first_capture[i] = captures[0]
        last_capture[i] = captures[-1]

# m_t: number captured at t that were seen before
m_t = np.zeros(n_sessions)
for t in range(n_sessions):
    for i in range(n_individuals):
        if histories[i, t] == 1 and first_capture[i] < t:
            m_t[t] += 1

# z_t: seen before t and after t but NOT at t
z_t = np.zeros(n_sessions)
for t in range(n_sessions):
    for i in range(n_individuals):
        if first_capture[i] < t and last_capture[i] > t and histories[i, t] == 0:
            z_t[t] += 1

# R_t: released at t (= captured, for camera traps)
R_t = n_t.copy()

# M_t: total marked in population (Jolly-Seber formula)
M_t = np.zeros(n_sessions)
for t in range(1, n_sessions):
    if n_t[t] > 0 and m_t[t] > 0:
        M_t[t] = (m_t[t] + 1) / (n_t[t] + 1) * (z_t[t] + R_t[t]) + m_t[t]
    else:
        M_t[t] = M_t[t-1] if t > 0 else 0

# N_t: population estimate
N_t = np.zeros(n_sessions)
for t in range(n_sessions):
    if m_t[t] > 0:
        N_t[t] = M_t[t] * n_t[t] / m_t[t]
    else:
        N_t[t] = n_t[t] / true_capture_p[t]  # fallback

# Capture probability estimate
p_t = np.zeros(n_sessions)
for t in range(n_sessions):
    if N_t[t] > 0:
        p_t[t] = n_t[t] / N_t[t]
    else:
        p_t[t] = 0

# Survival estimate (phi_t)
phi_t = np.zeros(n_sessions - 1)
for t in range(n_sessions - 1):
    if M_t[t] > 0 and n_t[t] > 0:
        phi_t[t] = M_t[t+1] / (M_t[t] - m_t[t] + R_t[t])
        phi_t[t] = np.clip(phi_t[t], 0, 1)

# Recruitment estimate
B_t = np.zeros(n_sessions - 1)
for t in range(n_sessions - 1):
    if t < len(phi_t):
        B_t[t] = max(0, N_t[t+1] - phi_t[t] * N_t[t])

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Jolly-Seber Open Population Model: Sangai Deer', color='white', fontsize=14)

month_labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

# Plot 1: Population estimates vs truth
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(range(n_sessions), true_pop_sizes, 'o-', color='#22c55e', linewidth=2, label='True N')
ax.plot(range(n_sessions), N_t, 's-', color='#3b82f6', linewidth=2, label='JS estimate')
ax.plot(range(n_sessions), n_t, '^-', color='#ef4444', linewidth=1, label='Raw count')
ax.set_xlabel('Month', color='white')
ax.set_ylabel('Population', color='white')
ax.set_title('Population: true vs estimated vs raw count', color='white', fontsize=10)
ax.set_xticks(range(n_sessions))
ax.set_xticklabels(month_labels, fontsize=7)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 2: Survival estimates
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(range(n_sessions - 1), true_survival, 'o-', color='#22c55e', linewidth=2, label='True φ')
ax.plot(range(n_sessions - 1), phi_t, 's-', color='#3b82f6', linewidth=2, label='JS estimate')
ax.set_xlabel('Month', color='white')
ax.set_ylabel('Monthly survival', color='white')
ax.set_title('Survival rate estimation', color='white', fontsize=10)
ax.set_xticks(range(n_sessions - 1))
ax.set_xticklabels(month_labels[:-1], fontsize=7)
ax.set_ylim(0.5, 1.05)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 3: Capture probability
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(range(n_sessions), true_capture_p, 'o-', color='#22c55e', linewidth=2, label='True p')
ax.plot(range(n_sessions), p_t, 's-', color='#3b82f6', linewidth=2, label='JS estimate')
ax.set_xlabel('Month', color='white')
ax.set_ylabel('Capture probability', color='white')
ax.set_title('Detection probability', color='white', fontsize=10)
ax.set_xticks(range(n_sessions))
ax.set_xticklabels(month_labels, fontsize=7)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 4: Recruitment
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.bar(range(n_sessions - 1), recruitment_rate[:-1], color='#22c55e', alpha=0.5, label='True recruitment', edgecolor='none')
ax.bar(range(n_sessions - 1), B_t, color='#3b82f6', alpha=0.5, label='JS estimate', edgecolor='none')
ax.set_xlabel('Month', color='white')
ax.set_ylabel('New individuals', color='white')
ax.set_title('Recruitment (births + immigration)', color='white', fontsize=10)
ax.set_xticks(range(n_sessions - 1))
ax.set_xticklabels(month_labels[:-1], fontsize=7)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 5: The bias of raw counts
ax = axes[1, 1]
ax.set_facecolor('#111827')
bias_raw = [(n_t[t] - true_pop_sizes[t]) / true_pop_sizes[t] * 100 for t in range(n_sessions)]
bias_js = [(N_t[t] - true_pop_sizes[t]) / true_pop_sizes[t] * 100 for t in range(n_sessions)]
ax.bar(np.arange(n_sessions) - 0.15, bias_raw, 0.3, color='#ef4444', label='Raw count bias', edgecolor='none')
ax.bar(np.arange(n_sessions) + 0.15, bias_js, 0.3, color='#3b82f6', label='JS estimate bias', edgecolor='none')
ax.axhline(0, color='gray', linewidth=0.5)
ax.set_xlabel('Month', color='white')
ax.set_ylabel('Bias (%)', color='white')
ax.set_title('Estimation bias: raw count vs Jolly-Seber', color='white', fontsize=10)
ax.set_xticks(range(n_sessions))
ax.set_xticklabels(month_labels, fontsize=7)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 6: Summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
mean_true = np.mean(true_pop_sizes)
mean_raw = np.mean(n_t)
mean_js = np.mean(N_t)
rows = [
    ['Mean true N', f'{mean_true:.0f}'],
    ['Mean raw count', f'{mean_raw:.0f} ({(mean_raw/mean_true-1)*100:+.0f}%)'],
    ['Mean JS estimate', f'{mean_js:.0f} ({(mean_js/mean_true-1)*100:+.0f}%)'],
    ['Mean survival (true)', f'{np.mean(true_survival):.2f}'],
    ['Mean survival (JS)', f'{np.mean(phi_t):.2f}'],
    ['Total recruitment', f'{np.sum(recruitment_rate):.0f}'],
]
table = ax.table(cellText=rows, colLabels=['Metric', 'Value'], cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('Model performance summary', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"Raw counts underestimate population by ~{(1 - mean_raw/mean_true)*100:.0f}%")
print(f"Jolly-Seber corrects much of this bias")
print(f"Monsoon months (May-Jul) show lowest survival AND lowest detection")
print(f"Without JS correction, monsoon declines look worse than they are")`,
      challenge: 'Make capture probability heterogeneous: some individuals are "trap-shy" (p=0.05) and others are "trap-happy" (p=0.30). How does individual heterogeneity in detection bias the Jolly-Seber estimates? This is a known problem called "individual heterogeneity bias."',
      successHint: 'The Jolly-Seber model is the foundation of modern wildlife monitoring. Every camera trap study of endangered species — tigers in Ranthambore, snow leopards in Ladakh, Sangai deer in Loktak — uses some variant of this model. You now understand what goes on behind those "population estimate: 260 deer" headlines.',
    },
    {
      title: 'Habitat suitability modeling — predicting where deer can live',
      concept: `Not all parts of Loktak Lake are suitable for the Sangai. Habitat suitability depends on multiple environmental variables:

- **Phumdi thickness**: must be > 0.5m to support deer weight
- **Vegetation type**: deer prefer certain grasses and sedges
- **Distance to open water**: deer need access to water but also need solid ground
- **Human disturbance**: proximity to villages and fishing boats reduces suitability
- **Flooding frequency**: areas that flood too often are unsuitable

**Habitat Suitability Index (HSI)** combines these variables into a single score from 0 (unsuitable) to 1 (perfect habitat). The simplest approach is a weighted geometric mean:

HSI = (SI_1^w1 × SI_2^w2 × ... × SI_n^wn)^(1/Σw)

where SI_i is the suitability index for variable i and w_i is its weight.

More sophisticated approaches use **Maximum Entropy (MaxEnt)** or **Random Forest** models trained on presence data: where have deer been observed? The model learns which combinations of environmental variables predict deer presence and extrapolates to unsampled areas.

HSI maps are critical for:
- Identifying potential habitat for range expansion
- Prioritizing areas for protection
- Predicting how habitat changes (dam operation, climate) affect available habitat`,
      analogy: 'HSI modeling is like a real estate site selection algorithm. A restaurant chain wants to open new locations. They analyze existing successful restaurants and ask: what do they have in common? High foot traffic, nearby parking, residential density, income level. Then they score every potential location on these factors and rank them. HSI does the same for deer: what do known deer locations have in common? Thick phumdi, certain plants, moderate distance to water.',
      storyConnection: 'The dancing deer do not use all of Loktak Lake equally. They concentrate in specific areas of Keibul Lamjao where conditions are right. An HSI map reveals why: those areas have the thickest phumdi, the right grasses, and the least disturbance. It also reveals potential habitat that deer could expand into if conditions improve — or habitat that will be lost if the dam raises water levels further.',
      checkQuestion: 'An HSI model predicts that a new phumdi area has HSI = 0.85 (highly suitable). Deer are translocated there but fail to establish. What went wrong?',
      checkAnswer: 'HSI models predict habitat quality from environmental variables, but they miss biotic factors: predation pressure, disease, competition with other grazers, and social factors (deer might need a critical group size to feel safe). The model might also miss temporal dynamics — the area might be suitable in dry season but flooded during monsoon. HSI predicts potential, not certainty. Validate with pilot studies.',
      codeIntro: 'Build an HSI model for the Sangai deer: generate environmental layers, compute suitability indices, combine them into a habitat map, and identify priority areas for conservation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate environmental layers for Loktak Lake ---
grid_size = 60  # 60x60 grid covering the lake area

# Layer 1: Phumdi thickness (meters)
# Thick in center of phumdi areas, thin at edges
phumdi_centers = [(20, 25), (30, 35), (40, 20), (15, 40)]
phumdi_thickness = np.zeros((grid_size, grid_size))
for cx, cy in phumdi_centers:
    for i in range(grid_size):
        for j in range(grid_size):
            dist = np.sqrt((i - cx)**2 + (j - cy)**2)
            phumdi_thickness[i, j] += 2.0 * np.exp(-dist**2 / 80)
phumdi_thickness += np.random.normal(0, 0.1, (grid_size, grid_size))
phumdi_thickness = np.clip(phumdi_thickness, 0, 3)

# Layer 2: Vegetation quality (0-1, based on preferred grass species)
veg_quality = 0.3 + 0.5 * (phumdi_thickness / 3) + np.random.normal(0, 0.1, (grid_size, grid_size))
veg_quality = np.clip(veg_quality, 0, 1)

# Layer 3: Distance to open water (km) - need some, but not too much
is_open_water = phumdi_thickness < 0.1
dist_to_water = np.ones((grid_size, grid_size)) * 999
# Simple distance transform
for iteration in range(50):
    for i in range(grid_size):
        for j in range(grid_size):
            if is_open_water[i, j]:
                dist_to_water[i, j] = 0
            else:
                for di, dj in [(-1,0),(1,0),(0,-1),(0,1)]:
                    ni, nj = i + di, j + dj
                    if 0 <= ni < grid_size and 0 <= nj < grid_size:
                        dist_to_water[i, j] = min(dist_to_water[i, j], dist_to_water[ni, nj] + 1)

# Layer 4: Human disturbance (0-1, 1 = high disturbance)
villages = [(5, 10), (50, 50), (55, 15), (10, 55), (45, 45)]
disturbance = np.zeros((grid_size, grid_size))
for vx, vy in villages:
    for i in range(grid_size):
        for j in range(grid_size):
            dist = np.sqrt((i - vx)**2 + (j - vy)**2)
            disturbance[i, j] += np.exp(-dist**2 / 100)
disturbance = np.clip(disturbance / np.max(disturbance), 0, 1)

# Layer 5: Flooding frequency (days/year, based on elevation)
flood_freq = 100 * np.exp(-phumdi_thickness * 1.5) + np.random.normal(0, 10, (grid_size, grid_size))
flood_freq = np.clip(flood_freq, 0, 365)

# --- Suitability Index functions ---
def si_thickness(thickness, min_t=0.5, opt_t=1.5, max_t=2.5):
    si = np.where(thickness < min_t, 0,
         np.where(thickness < opt_t, (thickness - min_t) / (opt_t - min_t),
         np.where(thickness < max_t, 1.0 - 0.3 * (thickness - opt_t) / (max_t - opt_t), 0.7)))
    return np.clip(si, 0, 1)

def si_vegetation(veg):
    return veg  # already 0-1

def si_water_distance(dist, opt=3, max_d=15):
    si = np.where(dist < 1, 0.5,  # too close = edge, less stable
         np.where(dist < opt, 0.5 + 0.5 * (dist - 1) / (opt - 1),
         np.where(dist < max_d, 1.0 - (dist - opt) / (max_d - opt), 0)))
    return np.clip(si, 0, 1)

def si_disturbance(disturb):
    return 1 - disturb  # inverse: low disturbance = high suitability

def si_flooding(freq, max_tolerable=120):
    return np.clip(1 - freq / max_tolerable, 0, 1)

# Compute suitability indices
si1 = si_thickness(phumdi_thickness)
si2 = si_vegetation(veg_quality)
si3 = si_water_distance(dist_to_water)
si4 = si_disturbance(disturbance)
si5 = si_flooding(flood_freq)

# Weights (based on expert knowledge)
weights = [3, 2, 1, 2, 2]  # thickness most important

# Weighted geometric mean HSI
epsilon = 1e-10
hsi = np.power(
    np.power(si1 + epsilon, weights[0]) *
    np.power(si2 + epsilon, weights[1]) *
    np.power(si3 + epsilon, weights[2]) *
    np.power(si4 + epsilon, weights[3]) *
    np.power(si5 + epsilon, weights[4]),
    1 / sum(weights)
)

# Classify
suitable = hsi > 0.5
highly_suitable = hsi > 0.7
total_suitable = np.sum(suitable)
total_highly = np.sum(highly_suitable)

# --- Visualization ---
fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Habitat Suitability Model: Sangai Deer at Loktak Lake', color='white', fontsize=14)

# Environmental layers
layers = [
    ('Phumdi thickness', phumdi_thickness, 'YlGn', 'm'),
    ('Vegetation quality', veg_quality, 'Greens', ''),
    ('Dist. to water', dist_to_water, 'Blues_r', 'cells'),
    ('Disturbance', disturbance, 'Reds', ''),
]
for col, (name, layer, cmap, unit) in enumerate(layers):
    ax = axes[0, col]
    ax.set_facecolor('#111827')
    im = ax.imshow(layer, cmap=cmap, origin='lower')
    ax.set_title(name, color='white', fontsize=9)
    plt.colorbar(im, ax=ax, fraction=0.046)
    ax.tick_params(colors='gray', labelsize=6)

# Suitability indices
sis = [
    ('SI: Thickness', si1),
    ('SI: Vegetation', si2),
    ('SI: Disturbance', si4),
    ('HSI (combined)', hsi),
]
for col, (name, layer) in enumerate(sis):
    ax = axes[1, col]
    ax.set_facecolor('#111827')
    if col == 3:
        # HSI with classification overlay
        display = np.zeros((*hsi.shape, 3))
        display[hsi < 0.3] = (0.94, 0.27, 0.27)  # unsuitable = red
        display[(hsi >= 0.3) & (hsi < 0.5)] = (0.96, 0.62, 0.04)  # marginal = orange
        display[(hsi >= 0.5) & (hsi < 0.7)] = (0.96, 0.93, 0.26)  # suitable = yellow
        display[hsi >= 0.7] = (0.13, 0.77, 0.37)  # highly suitable = green
        ax.imshow(display, origin='lower')
        ax.set_title(f'HSI (suitable: {total_suitable} km², high: {total_highly} km²)',
                    color='white', fontsize=9)
    else:
        im = ax.imshow(layer, cmap='RdYlGn', vmin=0, vmax=1, origin='lower')
        ax.set_title(name, color='white', fontsize=9)
        plt.colorbar(im, ax=ax, fraction=0.046)
    ax.tick_params(colors='gray', labelsize=6)

plt.tight_layout()
plt.show()

# Carrying capacity from HSI
deer_density = 0.8  # deer per km² at HSI=1
carrying_capacity = np.sum(hsi[hsi > 0.5]) * deer_density
print(f"Habitat suitability results:")
print(f"  Total grid cells: {grid_size * grid_size}")
print(f"  Suitable (HSI > 0.5): {total_suitable} km² ({total_suitable / (grid_size**2) * 100:.1f}%)")
print(f"  Highly suitable (HSI > 0.7): {total_highly} km² ({total_highly / (grid_size**2) * 100:.1f}%)")
print(f"  Estimated carrying capacity: {carrying_capacity:.0f} deer")
print()
print("Primary limiting factor: phumdi thickness")
print("  (highest-weighted variable, controls where deer can physically stand)")
print("Secondary: human disturbance and flooding")
print()
print("Conservation implication: protect thick phumdi areas first.")
print("Expanding suitable habitat requires either lowering water levels")
print("(thickening phumdi) or reducing human disturbance near existing phumdi.")`,
      challenge: 'Simulate the dam raising water levels by 0.5m: reduce phumdi_thickness by 0.5 everywhere and recompute HSI. How much suitable habitat is lost? Map the difference to show exactly which areas are most vulnerable.',
      successHint: 'HSI modeling is how conservationists identify critical habitat without surveying every square meter. The same approach is used for tiger habitat assessment, wetland conservation planning, and endangered plant protection across India. The model you built is directly applicable to real Loktak Lake management.',
    },
    {
      title: 'Integrated assessment — combining PVA, camera traps, and HSI for management decisions',
      concept: `Each analysis method tells part of the story. The power comes from integration:

1. **HSI** tells you WHERE suitable habitat exists → spatial planning
2. **Camera trap capture-recapture** tells you HOW MANY deer exist → population monitoring
3. **PVA** tells you WHETHER that number is enough → viability assessment

Together they answer the management question: "Given the current habitat (HSI), the current population (capture-recapture), what is the probability of Sangai persistence (PVA), and what management actions would improve it?"

The **adaptive management cycle**:
1. Monitor population (capture-recapture) → current N
2. Assess habitat (HSI) → current K
3. Run PVA with current N and K → extinction risk
4. If risk > threshold, identify interventions:
   a. Reduce water levels (increases K by thickening phumdi)
   b. Reduce disturbance (increases K by expanding usable habitat)
   c. Captive breeding + translocation (increases N directly)
   d. Create satellite populations (reduces metapopulation risk)
5. Implement intervention, return to step 1

This cycle makes conservation evidence-based rather than opinion-based. Every decision has a quantitative justification, and outcomes are measured against predictions.`,
      analogy: 'Integrated assessment is like a medical checkup. HSI is the body scan (where is there healthy tissue?). Camera traps are the blood test (how many healthy cells?). PVA is the prognosis (will the patient survive 10 years?). No single test is enough. Together, they give the doctor a complete picture and guide treatment. Conservation biology IS medicine for populations.',
      storyConnection: 'The story of the dancing deer is ultimately about hope versus data. Hope says "the deer are recovering." Data says "the deer are at 260, but HSI analysis shows habitat is shrinking, capture-recapture precision is poor below 20% detection, and PVA gives a 15% extinction risk over 100 years." Integrated assessment turns hope into strategy: specific interventions with predicted outcomes.',
      checkQuestion: 'PVA says the Sangai population is viable at 260, but HSI shows the carrying capacity is declining due to dam operations. How should this information change management priorities?',
      checkAnswer: 'Even though the current population is viable, a declining K means future viability is at risk. The population may be viable now at K=400, but if K drops to 200 due to habitat loss, PVA would show much higher extinction risk. Management should prioritize halting the K decline (dam operation reform, phumdi restoration) over population augmentation (captive breeding). Fixing the habitat trajectory is more important than fixing the current population number.',
      codeIntro: 'Build an integrated decision support dashboard that combines HSI mapping, capture-recapture estimates, and PVA projections into a single actionable assessment for Sangai deer conservation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Integrated assessment for Sangai management ---
# Current state
current_N = 260
current_K = 400
hsi_suitable_area = 28.5  # km² from HSI analysis
detection_p = 0.15  # from camera trap analysis
annual_survival = 0.88
growth_rate = 0.08

# Management scenarios
scenarios = {
    'Status quo': {
        'K_trend': -5,       # K declines 5/year (habitat loss)
        'N0': current_N,
        'extra_mortality': 0,
        'translocation': 0,
        'color': '#ef4444',
    },
    'Dam reform': {
        'K_trend': 0,        # K stabilized
        'N0': current_N,
        'extra_mortality': 0,
        'translocation': 0,
        'color': '#f59e0b',
    },
    'Dam reform + anti-poaching': {
        'K_trend': 0,
        'N0': current_N,
        'extra_mortality': -0.03,  # reduced mortality
        'translocation': 0,
        'color': '#22c55e',
    },
    'Full intervention': {
        'K_trend': 5,         # K improves (phumdi restoration)
        'N0': current_N,
        'extra_mortality': -0.03,
        'translocation': 10,  # 10 captive-bred deer/year for 5 years
        'color': '#3b82f6',
    },
}

def run_scenario(params, years=50, n_sims=200):
    results = {'pop': [], 'K': [], 'extinct': 0, 'final_pops': [], 'het': []}

    for sim in range(n_sims):
        N = float(params['N0'])
        K = float(current_K)
        het = 0.72  # initial heterozygosity
        pop_trajectory = [N]
        k_trajectory = [K]
        het_trajectory = [het]

        for year in range(years):
            # K changes over time
            K = max(50, K + params['K_trend'] + np.random.normal(0, 3))

            # Growth with stochasticity
            r = growth_rate + params['extra_mortality']
            r_actual = np.random.normal(r, 0.04)
            growth = r_actual * N * (1 - N / K)

            # Demographic stochasticity
            if N < 100:
                growth += np.random.normal(0, np.sqrt(max(N, 1)) * 2)

            # Catastrophe (3% annual chance)
            if np.random.random() < 0.03:
                growth -= N * np.random.uniform(0.2, 0.5)

            # Translocation (first 5 years only)
            if year < 5:
                growth += params['translocation']

            N = max(0, N + growth)

            # Heterozygosity
            Ne = max(N * 0.33, 1)
            het = het * (1 - 1 / (2 * Ne))
            if N > 50:
                het = min(het + 0.001, 0.8)

            pop_trajectory.append(N)
            k_trajectory.append(K)
            het_trajectory.append(het)

            if N < 2:
                pop_trajectory.extend([0] * (years - year - 1))
                k_trajectory.extend([K] * (years - year - 1))
                het_trajectory.extend([het] * (years - year - 1))
                results['extinct'] += 1
                break

        results['pop'].append(pop_trajectory[:years + 1])
        results['K'].append(k_trajectory[:years + 1])
        results['het'].append(het_trajectory[:years + 1])
        results['final_pops'].append(pop_trajectory[-1])

    return results

print("Running 4 scenarios x 200 simulations x 50 years...")
all_results = {}
for name, params in scenarios.items():
    all_results[name] = run_scenario(params)
print("Done!")

# --- Decision support dashboard ---
fig = plt.figure(figsize=(16, 14))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('SANGAI DEER CONSERVATION — INTEGRATED DECISION SUPPORT', color='white', fontsize=16, fontweight='bold')

# 3x3 grid
gs = fig.add_gridspec(3, 3, hspace=0.35, wspace=0.3)

# Plot 1: Population trajectories
ax = fig.add_subplot(gs[0, 0])
ax.set_facecolor('#111827')
for name, params in scenarios.items():
    pops = np.array(all_results[name]['pop'])
    median = np.median(pops, axis=0)
    q10 = np.percentile(pops, 10, axis=0)
    q90 = np.percentile(pops, 90, axis=0)
    ax.plot(median, color=params['color'], linewidth=2, label=name[:15])
    ax.fill_between(range(len(median)), q10, q90, color=params['color'], alpha=0.1)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Population', color='white')
ax.set_title('Population projection', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Carrying capacity trajectories
ax = fig.add_subplot(gs[0, 1])
ax.set_facecolor('#111827')
for name, params in scenarios.items():
    ks = np.array(all_results[name]['K'])
    median_k = np.median(ks, axis=0)
    ax.plot(median_k, color=params['color'], linewidth=2, label=name[:15])
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Carrying capacity', color='white')
ax.set_title('Habitat capacity trajectory', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Genetic diversity
ax = fig.add_subplot(gs[0, 2])
ax.set_facecolor('#111827')
for name, params in scenarios.items():
    hets = np.array(all_results[name]['het'])
    median_het = np.median(hets, axis=0)
    ax.plot(median_het, color=params['color'], linewidth=2, label=name[:15])
ax.axhline(0.5, color='gray', linestyle=':', linewidth=1, label='Critical threshold')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Heterozygosity', color='white')
ax.set_title('Genetic diversity', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Extinction risk
ax = fig.add_subplot(gs[1, 0])
ax.set_facecolor('#111827')
scenario_names = list(scenarios.keys())
ext_risks = [all_results[name]['extinct'] / 200 for name in scenario_names]
colors_list = [scenarios[name]['color'] for name in scenario_names]
bars = ax.bar(range(len(scenario_names)), [r * 100 for r in ext_risks], color=colors_list, edgecolor='none')
ax.axhline(5, color='#f59e0b', linestyle='--', linewidth=1, label='IUCN 5% threshold')
ax.set_xticks(range(len(scenario_names)))
ax.set_xticklabels([s[:12] for s in scenario_names], color='white', fontsize=7, rotation=15)
ax.set_ylabel('50-year extinction risk (%)', color='white')
ax.set_title('Extinction probability', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
for bar, risk in zip(bars, ext_risks):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{risk:.0%}', ha='center', color='white', fontsize=9, fontweight='bold')
ax.tick_params(colors='gray')

# Plot 5: Final population distributions
ax = fig.add_subplot(gs[1, 1])
ax.set_facecolor('#111827')
for name, params in scenarios.items():
    finals = [f for f in all_results[name]['final_pops'] if f > 0]
    if finals:
        ax.hist(finals, bins=20, alpha=0.5, color=params['color'], label=name[:15], edgecolor='none')
ax.set_xlabel('Population at year 50', color='white')
ax.set_ylabel('Frequency', color='white')
ax.set_title('Final population distribution', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Cost-benefit analysis
ax = fig.add_subplot(gs[1, 2])
ax.set_facecolor('#111827')
costs = [0, 50, 80, 150]  # approximate costs in crores
median_finals = [np.median(all_results[name]['final_pops']) for name in scenario_names]
for i, (name, cost, final) in enumerate(zip(scenario_names, costs, median_finals)):
    ax.scatter(cost, final, s=200, c=scenarios[name]['color'], edgecolors='white', linewidths=1, zorder=5)
    ax.annotate(name[:12], (cost, final), color='white', fontsize=7,
               textcoords="offset points", xytext=(5, 5))
ax.set_xlabel('Estimated cost (crores INR)', color='white')
ax.set_ylabel('Median population at year 50', color='white')
ax.set_title('Cost-effectiveness', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 7-9: Decision summary table
ax = fig.add_subplot(gs[2, :])
ax.set_facecolor('#111827')
ax.axis('off')

table_data = []
for name in scenario_names:
    res = all_results[name]
    ext_risk = res['extinct'] / 200
    median_pop = np.median(res['final_pops'])
    median_het = np.median([h[-1] for h in res['het']])
    viable = "YES" if ext_risk < 0.05 else "NO"
    table_data.append([name, f'{median_pop:.0f}', f'{median_het:.3f}',
                       f'{ext_risk:.0%}', viable, str(costs[scenario_names.index(name)])])

table = ax.table(cellText=table_data,
                colLabels=['Scenario', 'Median pop@50', 'Het@50', 'Ext risk', 'IUCN viable?', 'Cost (Cr)'],
                cellLoc='center', loc='center', cellColours=None)
table.auto_set_font_size(False)
table.set_fontsize(10)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
    # Color code viability
    if key[1] == 4 and key[0] > 0:
        if table_data[key[0]-1][4] == 'YES':
            cell.set_facecolor('#065f46')
        else:
            cell.set_facecolor('#7f1d1d')

table.scale(1, 1.5)

plt.tight_layout()
plt.show()

print("=" * 70)
print("MANAGEMENT RECOMMENDATION")
print("=" * 70)
for name in scenario_names:
    res = all_results[name]
    ext_risk = res['extinct'] / 200
    median_pop = np.median(res['final_pops'])
    print(f"  {name:<30} Pop@50: {median_pop:>6.0f}  Ext risk: {ext_risk:>6.0%}")
print()
print("Priority 1: Dam reform (stabilize carrying capacity)")
print("Priority 2: Anti-poaching (reduce mortality)")
print("Priority 3: Phumdi restoration (increase carrying capacity)")
print("Priority 4: Captive breeding (boost population directly)")
print()
print("The Sangai can be saved. The question is not 'can we?' but 'will we?'")`,
      challenge: 'Add a fifth scenario: "Climate change" where K declines by 8/year (faster than status quo due to increased flooding). What is the extinction risk? What level of intervention is needed to counteract climate change?',
      successHint: 'You have built a complete, publication-quality decision support system for endangered species management. This is the exact workflow used by the Wildlife Institute of India and IUCN Species Survival Commission. The Sangai\'s future depends on tools like these turning data into policy.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Wildlife Biologist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (ecology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for population ecology computations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
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
