import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HornbillLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Population ecology — counting what you cannot see',
      concept: `How many hornbills are in a forest? You cannot count them all — they are elusive, live in dense canopy, and roam large areas. **Population ecology** provides methods to estimate populations from incomplete data.

Key methods:
- **Point counts**: an observer stands at fixed locations and counts all hornbills seen/heard in a set time. Multiple points give a density estimate.
- **Line transects**: walk a straight line through habitat, recording every hornbill detected and its distance from the line. Statistical models (Distance Sampling) account for birds you missed.
- **Mark-recapture**: capture and mark (or photograph) individuals. Recapture later and use the ratio of marked to unmarked to estimate total population. Formula: **N = (M × C) / R** (Lincoln-Petersen method), where M = marked, C = total in second capture, R = recaptured marked individuals.
- **Nest surveys**: count active nests and multiply by average adults per nest.

Each method has biases:
- Point counts miss shy species (detection bias)
- Line transects assume equal detection probability (not true in dense forest)
- Mark-recapture assumes marks do not affect behaviour
- Nest surveys miss non-breeding adults

The best estimates combine multiple methods and use statistical models to account for imperfect detection.`,
      analogy: 'Estimating a wildlife population is like estimating how many fish are in a lake without draining it. You catch some, tag them, release them, then catch again. If you tagged 100 fish and your second catch of 50 has 10 tagged ones, the lake has about 100 × 50 / 10 = 500 fish. The math is simple; the assumptions are where it gets tricky.',
      storyConnection: 'The Naga communities who lived alongside hornbills had their own population knowledge — they knew which trees were nesting sites, how many pairs bred each year, and whether numbers were rising or falling. Modern ecology formalises this traditional knowledge with statistical rigour, but the underlying observation skills are the same.',
      checkQuestion: 'You mark 30 hornbills with GPS tags. Two months later, you observe 40 hornbills in the area and 6 have tags. Estimate the population. What assumptions could make this estimate wrong?',
      checkAnswer: 'N = (30 × 40) / 6 = 200 hornbills. Assumptions that could be wrong: (1) some tagged birds died or emigrated (N overestimate). (2) Tags make birds more visible (R overestimate → N underestimate). (3) Tagged birds mixed completely with untagged (required for the method to work). (4) The population is "closed" — no births, deaths, or movement during the study.',
      codeIntro: 'Simulate mark-recapture and show how estimate accuracy depends on sample size.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Mark-recapture simulation
true_population = 200
n_simulations = 1000

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Effect of marked sample size on estimate accuracy
ax1.set_facecolor('#111827')
mark_sizes = [10, 20, 30, 50, 80]
recapture_size = 40

for n_marked in mark_sizes:
    estimates = []
    for _ in range(n_simulations):
        # Simulate: each bird in recapture has n_marked/true_pop chance of being marked
        recaptured_marked = np.random.binomial(recapture_size, n_marked / true_population)
        if recaptured_marked > 0:
            est = (n_marked * recapture_size) / recaptured_marked
        else:
            est = np.inf
        estimates.append(min(est, 1000))  # cap for visualization

    estimates = [e for e in estimates if e < 1000]
    ax1.hist(estimates, bins=30, alpha=0.4, label=f'Mark {n_marked}')

ax1.axvline(true_population, color='#ef4444', linestyle='--', linewidth=2, label=f'True N={true_population}')
ax1.set_xlabel('Population estimate', color='white')
ax1.set_ylabel('Frequency', color='white')
ax1.set_title('Mark-Recapture: More Marks = Better Estimates', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_xlim(0, 600)

# Bias and precision vs sample size
ax2.set_facecolor('#111827')
mark_range = np.arange(5, 101, 5)
means = []
stds = []

for n_marked in mark_range:
    ests = []
    for _ in range(n_simulations):
        rm = np.random.binomial(recapture_size, n_marked / true_population)
        if rm > 0:
            ests.append((n_marked * recapture_size) / rm)
    ests = [e for e in ests if e < 2000]
    means.append(np.mean(ests))
    stds.append(np.std(ests))

ax2.plot(mark_range, means, color='#22c55e', linewidth=2, label='Mean estimate')
ax2.fill_between(mark_range,
                 np.array(means) - np.array(stds),
                 np.array(means) + np.array(stds),
                 alpha=0.2, color='#22c55e', label='± 1 std dev')
ax2.axhline(true_population, color='#ef4444', linestyle='--', linewidth=1)
ax2.set_xlabel('Number of marked animals', color='white')
ax2.set_ylabel('Population estimate', color='white')
ax2.set_title('Accuracy Improves with Sample Size', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# Detection probability matters
ax3.set_facecolor('#111827')
detection_probs = np.linspace(0.1, 1.0, 50)
count = 30  # birds actually observed

for true_n in [100, 200, 300, 500]:
    expected_count = true_n * detection_probs
    ax3.plot(detection_probs, expected_count, linewidth=2, label=f'True N={true_n}')

ax3.axhline(count, color='#f59e0b', linestyle='--', linewidth=1, label=f'Observed: {count}')
ax3.set_xlabel('Detection probability', color='white')
ax3.set_ylabel('Expected count', color='white')
ax3.set_title('Same Count, Different Populations', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

# Point count variation
ax4.set_facecolor('#111827')
n_points = 20
true_density = 5  # hornbills per km²

# Counts follow Poisson distribution at each point
point_areas = np.random.uniform(0.5, 1.5, n_points)  # km² surveyed at each point
expected = true_density * point_areas
observed = np.random.poisson(expected)

ax4.bar(range(n_points), observed, color='#3b82f6', alpha=0.8, label='Observed count')
ax4.plot(range(n_points), expected, 'o-', color='#f59e0b', linewidth=1, label='Expected (true density)')
ax4.set_xlabel('Survey point', color='white')
ax4.set_ylabel('Hornbills counted', color='white')
ax4.set_title('Point Count Variation (same true density)', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Population estimation summary:")
print(f"  True population: {true_population}")
print(f"  With 30 marks, 40 recaptured, ~6 re-marked:")
est = 30 * 40 / 6
print(f"  Lincoln-Petersen estimate: {est:.0f}")
print()
print("Key lesson: ALL population estimates have uncertainty.")
print("The goal is not a perfect number but a useful range.")
print(f"  Best practice: report as {true_population} ± {stds[5]:.0f} (with confidence interval)")`,
      challenge: 'What if tagged hornbills are harder to recapture because the tag makes them wary? Simulate this by giving tagged birds a 70% recapture probability vs. 100% for untagged. How does this bias the estimate?',
      successHint: 'Population ecology is the foundation of all conservation decisions. You cannot protect what you have not counted. Every wildlife management plan starts with a population estimate — and every estimate must be honest about its uncertainty.',
    },
    {
      title: 'Territory mapping — home ranges and resource defense',
      concept: `Hornbills do not wander randomly. Each breeding pair defends a **territory** — a fixed area of forest that provides nesting sites, food trees, and roosting trees. Understanding territory size and layout is essential for conservation planning.

Key concepts:
- **Home range**: the total area an animal uses over a period of time. Not all of it is defended.
- **Territory**: the part of the home range that is actively defended against competitors.
- **Core area**: the most intensively used part of the home range (usually 20-50% of total area, containing nest and key food trees).

Hornbill territory sizes vary enormously:
- Breeding pair: 2-5 km² in rich forest
- Non-breeding groups: may range over 20+ km²
- Territory size increases as forest quality decreases (must travel farther for food)

Scientists map territories using **GPS telemetry**: a tiny transmitter on the bird sends location data via satellite. From hundreds of location points, statistical methods like **Kernel Density Estimation (KDE)** create a probability map showing where the bird spends most of its time.

The 95% KDE contour defines the home range. The 50% KDE contour defines the core area.`,
      analogy: 'A hornbill\'s territory is like your daily routine mapped on a city. Your home is the core area (most time spent). Your commute route, workplace, grocery store, and gym define your home range. You don\'t "defend" the whole city, but you have strong preferences about your neighbourhood. A hornbill has the same spatial habits — just in a forest instead of a city.',
      storyConnection: 'The hornbill in the story was described as "guardian of the forest." Each real hornbill pair is literally a guardian — of its territory. They know every fruiting tree, every potential nest cavity, and every threat within their domain. The Naga people recognized this territorial knowledge and respected the hornbill\'s domain.',
      checkQuestion: 'If a pair of hornbills needs 3 km² of forest, and a national park is 100 km², how many pairs can it support? Why might the real number be lower?',
      checkAnswer: 'Simple calculation: 100 / 3 = 33 pairs. But the real number is lower because: (1) territories cannot perfectly tile the landscape (gaps and overlaps). (2) Not all habitat is suitable (rocky areas, streams, disturbed zones). (3) Edge effects reduce quality near park boundaries. (4) Some birds are non-breeding and take up space without forming pairs. Realistic estimate: 20-25 pairs.',
      codeIntro: 'Generate GPS tracking data and map a hornbill\'s territory using kernel density estimation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate GPS tracking data for a hornbill
n_days = 90
points_per_day = 8  # GPS fixes per day
n_points = n_days * points_per_day

# Core areas (nest and key food trees)
nest = np.array([0, 0])
food_tree_1 = np.array([0.8, 1.2])  # km
food_tree_2 = np.array([-0.5, 0.8])
food_tree_3 = np.array([1.0, -0.3])

# Generate points clustered around activity centers
weights = [0.4, 0.2, 0.2, 0.2]  # time at each location
centers = [nest, food_tree_1, food_tree_2, food_tree_3]
spreads = [0.15, 0.2, 0.25, 0.2]  # km

all_x, all_y = [], []
for _ in range(n_points):
    idx = np.random.choice(4, p=weights)
    x = centers[idx][0] + np.random.normal(0, spreads[idx])
    y = centers[idx][1] + np.random.normal(0, spreads[idx])
    all_x.append(x)
    all_y.append(y)

all_x = np.array(all_x)
all_y = np.array(all_y)

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Raw GPS points
ax1.set_facecolor('#111827')
ax1.scatter(all_x, all_y, s=3, color='#3b82f6', alpha=0.3)
for center, label, color in [(nest, 'Nest', '#ef4444'), (food_tree_1, 'Fig tree 1', '#22c55e'),
                               (food_tree_2, 'Fig tree 2', '#f59e0b'), (food_tree_3, 'Fig tree 3', '#a855f7')]:
    ax1.plot(center[0], center[1], '*', color=color, markersize=15, label=label)
ax1.set_xlabel('East-West (km)', color='white')
ax1.set_ylabel('North-South (km)', color='white')
ax1.set_title(f'GPS Tracking Data ({n_points} points, {n_days} days)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_aspect('equal')

# Kernel Density Estimation
ax2.set_facecolor('#111827')
from matplotlib.colors import LinearSegmentedColormap

# Create 2D histogram as KDE approximation
x_grid = np.linspace(-1.5, 2.0, 100)
y_grid = np.linspace(-1.0, 2.0, 100)
H, xedges, yedges = np.histogram2d(all_x, all_y, bins=[x_grid, y_grid])
H = H.T

# Smooth with Gaussian filter (manual convolution)
from numpy import convolve
kernel_size = 5
kernel_1d = np.exp(-np.linspace(-2, 2, kernel_size)**2)
kernel_1d /= kernel_1d.sum()
for i in range(H.shape[0]):
    H[i, :] = np.convolve(H[i, :], kernel_1d, mode='same')
for j in range(H.shape[1]):
    H[:, j] = np.convolve(H[:, j], kernel_1d, mode='same')

colors_kde = ['#111827', '#1e3a5f', '#22c55e', '#f59e0b', '#ef4444']
cmap = LinearSegmentedColormap.from_list('custom', colors_kde)

ax2.pcolormesh(x_grid[:-1], y_grid[:-1], H, cmap=cmap)
ax2.contour(x_grid[:-1], y_grid[:-1], H, levels=[H.max() * 0.1, H.max() * 0.3],
           colors=['#60a5fa', '#f59e0b'], linewidths=[1, 2])
ax2.set_xlabel('East-West (km)', color='white')
ax2.set_ylabel('North-South (km)', color='white')
ax2.set_title('Kernel Density: Home Range (blue) & Core (orange)', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_aspect('equal')

# Time budget pie chart
ax3.set_facecolor('#111827')
activities = ['At nest', 'Foraging\
(fig tree 1)', 'Foraging\
(fig tree 2)', 'Foraging\
(fig tree 3)', 'In transit']
time_pct = [35, 18, 18, 17, 12]
colors_pie = ['#ef4444', '#22c55e', '#f59e0b', '#a855f7', '#6b7280']
wedges, texts, autotexts = ax3.pie(time_pct, labels=activities, autopct='%1.0f%%',
                                    colors=colors_pie, textprops={'color': 'white', 'fontsize': 9})
for text in autotexts:
    text.set_fontsize(9)
ax3.set_title('Time Budget: Where the Hornbill Spends Its Day', color='white', fontsize=12)

# Territory size vs forest quality
ax4.set_facecolor('#111827')
forest_quality = np.linspace(0.1, 1.0, 50)  # 0.1 = degraded, 1.0 = pristine
# Territory size inversely related to quality
territory_size = 3 / forest_quality**1.5 + np.random.normal(0, 0.3, 50)
territory_size = np.maximum(territory_size, 1)

ax4.scatter(forest_quality, territory_size, color='#3b82f6', alpha=0.6, s=30)
quality_smooth = np.linspace(0.1, 1.0, 100)
size_smooth = 3 / quality_smooth**1.5
ax4.plot(quality_smooth, size_smooth, color='#f59e0b', linewidth=2, label='Expected relationship')
ax4.set_xlabel('Forest quality index', color='white')
ax4.set_ylabel('Territory size (km²)', color='white')
ax4.set_title('Degraded Forest = Larger Territory (more searching)', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Territory analysis:")
# Approximate home range as convex hull area
from_center = np.sqrt(all_x**2 + all_y**2)
range_95 = np.percentile(from_center, 95)
core_50 = np.percentile(from_center, 50)
print(f"  95% range radius: {range_95:.2f} km")
print(f"  50% core radius: {core_50:.2f} km")
print(f"  Approximate home range: {np.pi * range_95**2:.1f} km²")
print(f"  Approximate core area: {np.pi * core_50**2:.1f} km²")
print()
print("Conservation implication:")
print("  A 100 km² reserve with quality 0.8:")
print(f"  Territory size ≈ {3/0.8**1.5:.1f} km²")
print(f"  Can support ≈ {100 / (3/0.8**1.5):.0f} pairs (theoretical max)")`,
      challenge: 'If logging reduces forest quality from 0.8 to 0.4, territory size roughly doubles. How many pairs can the same 100 km² reserve now support? What percentage of the population is lost?',
      successHint: 'Territory mapping reveals the spatial requirements of a species — how much land it needs, what resources it depends on, and how habitat degradation forces animals to work harder for the same resources. This data drives every protected area design decision.',
    },
    {
      title: 'Breeding success rates — what determines survival',
      concept: `Conservation success is measured not just by how many hornbills exist, but by how many successfully reproduce. **Breeding success** tracks eggs laid, eggs hatched, chicks fledged, and juveniles surviving to adulthood.

For great hornbills:
- Clutch size: typically 1-2 eggs (rarely 3)
- Incubation: ~40 days
- Nestling period: ~80 days (in the sealed cavity)
- Fledging success: 70-85% (high, thanks to the sealed nest)
- Juvenile survival (first year): ~50-60%
- Adult survival: ~85-90% per year

The **lifetime reproductive success** of a female hornbill might be 8-12 fledged chicks over a 30-year lifespan — but only 4-6 of those survive to breed. Since the population needs each pair to produce 2 surviving offspring to maintain numbers, the margins are thin.

Factors affecting breeding success:
- **Nest site availability**: large tree cavities are rare and take 100+ years to form
- **Food abundance**: fig fruiting patterns determine whether the male can feed the family
- **Predation**: despite the sealed nest, monitor lizards and snakes can breach some cavities
- **Human disturbance**: logging near nest trees causes abandonment
- **Mate quality**: experienced males deliver more food and have higher fledging success`,
      analogy: 'Breeding success is like a business profit margin. Revenue (eggs laid) is meaningless if costs (predation, starvation, abandonment) eat it all. The hornbill strategy is like a luxury brand — low volume (1-2 eggs) with high investment per unit (sealed nest, months of feeding). The opposite strategy (thousands of eggs, minimal care) is the fast-food model — most die, but sheer numbers ensure some survive.',
      storyConnection: 'The story speaks of the hornbill\'s crown being passed from generation to generation. In ecology, this is exactly the question: does each generation produce enough surviving offspring to maintain the population? The "crown" is the genetic legacy — and it is threatened when breeding success drops below replacement level.',
      checkQuestion: 'If a hornbill pair produces 1.5 fledglings per year on average, and juvenile survival is 55%, how many years does it take for the pair to produce 2 breeding adults (replacement level)?',
      checkAnswer: 'Each year: 1.5 fledglings × 0.55 juvenile survival = 0.825 surviving juveniles. To get 2 survivors: 2 / 0.825 = 2.4 years. So a pair needs about 2.5 breeding seasons to replace themselves. If adult survival is 90%, a bird lives ~10 breeding years on average, giving ~8 surviving offspring — comfortable margin. But if juvenile survival drops to 30% (due to habitat loss), they need 4.4 years per replacement — the margin evaporates.',
      codeIntro: 'Model breeding success across multiple years and identify when populations decline.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Breeding success model
years = 30
n_pairs = 50  # initial breeding pairs

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Breeding pipeline for one year
ax1.set_facecolor('#111827')
stages = ['Pairs that\
attempt breeding', 'Eggs laid', 'Eggs hatched', 'Chicks fledged',
          'Juveniles survive\
1st year']
counts = [50, 75, 55, 45, 25]
colors_list = ['#3b82f6', '#a855f7', '#f59e0b', '#22c55e', '#22c55e']
attrition = [0, 0, 75-55, 55-45, 45-25]

bars = ax1.bar(range(len(stages)), counts, color=colors_list, edgecolor='none')
ax1.set_xticks(range(len(stages)))
ax1.set_xticklabels(stages, fontsize=8)
ax1.set_ylabel('Count', color='white')
ax1.set_title('Breeding Pipeline: 50 Pairs, One Year', color='white', fontsize=12)
ax1.tick_params(colors='gray')

for bar, c in zip(bars, counts):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             str(c), ha='center', color='white', fontsize=11, fontweight='bold')

# Losses
for i in range(2, 5):
    ax1.annotate(f'-{attrition[i]}', xy=(i-0.5, (counts[i] + counts[i-1])/2),
                color='#ef4444', fontsize=10, fontweight='bold')

# Population trajectory under different scenarios
ax2.set_facecolor('#111827')
scenarios = {
    'Healthy forest': {'fledge_rate': 0.85, 'juv_surv': 0.55, 'adult_surv': 0.90, 'color': '#22c55e'},
    'Moderate logging': {'fledge_rate': 0.65, 'juv_surv': 0.40, 'adult_surv': 0.85, 'color': '#f59e0b'},
    'Heavy disturbance': {'fledge_rate': 0.45, 'juv_surv': 0.25, 'adult_surv': 0.80, 'color': '#ef4444'},
}

for name, params in scenarios.items():
    population = np.zeros(years)
    population[0] = 100  # total adults

    for y in range(1, years):
        breeding_pairs = population[y-1] / 2
        eggs = breeding_pairs * 1.5  # average clutch
        fledged = eggs * params['fledge_rate']
        new_adults = fledged * params['juv_surv']
        surviving_adults = population[y-1] * params['adult_surv']
        population[y] = surviving_adults + new_adults

    ax2.plot(range(years), population, color=params['color'], linewidth=2, label=name)

ax2.axhline(50, color='gray', linestyle='--', linewidth=0.5)
ax2.set_xlabel('Years', color='white')
ax2.set_ylabel('Total adult population', color='white')
ax2.set_title('Population Trajectories Under Different Conditions', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Nest site occupancy over time
ax3.set_facecolor('#111827')
years_data = np.arange(2000, 2025)
available_nests = 40 - 0.5 * (years_data - 2000)  # losing 0.5 nest trees per year
available_nests = np.maximum(available_nests, 10)
occupied = available_nests * (0.7 + 0.1 * np.random.randn(len(years_data)))
occupied = np.minimum(occupied, available_nests)
occupied = np.maximum(occupied, 0)

ax3.plot(years_data, available_nests, 'o-', color='#3b82f6', linewidth=2, label='Available nest cavities')
ax3.plot(years_data, occupied, 's-', color='#f59e0b', linewidth=2, label='Occupied nests')
ax3.fill_between(years_data, occupied, available_nests, alpha=0.1, color='#3b82f6')
ax3.set_xlabel('Year', color='white')
ax3.set_ylabel('Number of nests', color='white')
ax3.set_title('Nest Sites Declining Due to Logging', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Sensitivity analysis: which factor matters most?
ax4.set_facecolor('#111827')
base_params = {'fledge': 0.75, 'juv': 0.50, 'adult': 0.88, 'clutch': 1.5}

# Change each parameter by ±20% and measure population growth rate
param_names = ['Fledging\
rate', 'Juvenile\
survival', 'Adult\
survival', 'Clutch\
size']
sensitivities = []

for key in ['fledge', 'juv', 'adult', 'clutch']:
    low_p = base_params.copy()
    high_p = base_params.copy()
    low_p[key] *= 0.8
    high_p[key] *= 1.2

    def calc_growth(p):
        pairs = 50
        eggs = pairs * p['clutch']
        new_adults = eggs * p['fledge'] * p['juv']
        surviving = 100 * p['adult']
        return (surviving + new_adults) / 100 - 1  # growth rate

    low_growth = calc_growth(low_p)
    high_growth = calc_growth(high_p)
    sensitivities.append((high_growth - low_growth))

colors_sens = ['#3b82f6', '#f59e0b', '#ef4444', '#22c55e']
bars = ax4.bar(param_names, sensitivities, color=colors_sens, edgecolor='none')
ax4.set_ylabel('Change in growth rate\
from ±20% change', color='white')
ax4.set_title('Sensitivity Analysis: What Matters Most?', color='white', fontsize=12)
ax4.tick_params(colors='gray')

for bar, s in zip(bars, sensitivities):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.002,
             f'{s:.3f}', ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Breeding success analysis:")
print(f"  Base scenario: 1.5 eggs, 75% fledge, 50% juvenile survival, 88% adult survival")
base_growth = (100 * 0.88 + 50 * 1.5 * 0.75 * 0.50) / 100 - 1
print(f"  Annual growth rate: {base_growth*100:.1f}%")
print()
print("Sensitivity ranking (most to least impactful):")
ranked = sorted(zip(param_names, sensitivities), key=lambda x: abs(x[1]), reverse=True)
for name, s in ranked:
    print(f"  {name.replace(chr(10), ' ')}: {s:.4f}")
print()
print("Adult survival is typically the most sensitive parameter")
print("for long-lived species like hornbills.")`,
      challenge: 'Adult survival is the most sensitive parameter. If hunting reduces adult survival from 88% to 75%, what happens to the population growth rate? How quickly does the population halve?',
      successHint: 'Breeding success analysis tells conservation managers exactly where to focus limited resources. For hornbills, protecting adults (reducing hunting) has more impact than any other intervention — a finding that guides policy across hornbill range states.',
    },
    {
      title: 'Canopy ecology — the world above the ground',
      concept: `The great hornbill lives in the forest canopy — the uppermost layer of foliage, 25-45 metres above the ground. The canopy is a distinct ecosystem with its own climate, species, and ecological processes.

Canopy layers:
- **Emergent layer** (45+ m): scattered giant trees that poke above the main canopy. Hornbills perch here for visibility.
- **Canopy layer** (25-45m): continuous cover where most photosynthesis and fruiting occurs. This is the hornbill's primary habitat.
- **Understorey** (5-25m): shade-tolerant trees and shrubs. Less fruit, more insects.
- **Forest floor** (0-5m): decomposers, ground-dwelling animals, seedlings. Very little light reaches here (~2-5% of sunlight).

The canopy microclimate differs dramatically from the forest floor:
- Temperature: 5-10°C warmer in the canopy
- Humidity: 20-30% lower in the canopy
- Wind: 10× stronger in the canopy
- Light: 50-100× more light in the canopy

This vertical gradient creates distinct habitats every few metres — and hornbills, with their large size and strong flight, move freely between layers.

**Canopy connectivity** is critical: hornbills can cross small gaps (10-20m) but avoid large clearings. Forest fragmentation creates "canopy gaps" that isolate populations.`,
      analogy: 'The forest canopy is like the penthouse floor of a skyscraper. It gets the most sunlight (resources), the strongest wind (challenges), and has the best view (visibility). The forest floor is like the basement — dark, humid, and sheltered. Different species prefer different floors, just as different businesses occupy different levels of a building.',
      storyConnection: 'The story describes the hornbill surveying its forest kingdom from the highest branches. This is ecologically accurate — hornbills use emergent trees as observation posts to locate fruiting trees (which can be spotted from the colour change in their canopy). The hornbill\'s height advantage in the canopy is a real survival strategy, not just storytelling drama.',
      checkQuestion: 'If only 2-5% of sunlight reaches the forest floor, how do seedlings survive long enough to reach the canopy?',
      checkAnswer: 'Most seedlings survive in a "light-limited waiting" state — growing extremely slowly, maintaining just enough photosynthesis to stay alive. When a large tree falls (creating a "gap"), sunlight floods in and these waiting seedlings race upward. Species that evolved this strategy are called "shade-tolerant." Others (pioneer species) germinate only in gaps and grow explosively fast. This gap dynamics process is how forests regenerate.',
      codeIntro: 'Model the vertical structure of a tropical forest and the light gradient through canopy layers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Forest vertical structure and light gradient
heights = np.linspace(0, 50, 500)  # metres

# Light penetration through canopy (Beer-Lambert law)
# I = I_0 * exp(-k * LAI_cumulative)
I_0 = 100  # percent (full sunlight above canopy)

# Leaf area index by height (most leaves at 30-40m)
lai_profile = 2.0 * np.exp(-((heights - 35)**2) / 50) + \
              0.8 * np.exp(-((heights - 15)**2) / 30) + \
              0.3 * np.exp(-((heights - 5)**2) / 10)

# Cumulative LAI from top down
cum_lai = np.cumsum(lai_profile[::-1])[::-1] * (heights[1] - heights[0])
k = 0.5  # extinction coefficient
light = I_0 * np.exp(-k * cum_lai / cum_lai.max() * 6)

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Light gradient
ax1.set_facecolor('#111827')
ax1.fill_betweenx(heights, 0, light, color='#f59e0b', alpha=0.3)
ax1.plot(light, heights, color='#f59e0b', linewidth=2)
ax1.set_xlabel('Light intensity (% of full sun)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Light Penetration Through Forest', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Layer labels
layers = [('Floor', 2.5, '#92400e'), ('Understorey', 15, '#22c55e'),
          ('Canopy', 35, '#059669'), ('Emergent', 47, '#3b82f6')]
for name, h, color in layers:
    ax1.axhline(h + 5, color=color, linestyle=':', linewidth=0.5, alpha=0.5)
    ax1.text(80, h, name, color=color, fontsize=10, fontweight='bold')

# Temperature and humidity profiles
ax2.set_facecolor('#111827')
temp = 25 + 5 * (heights / 50)**0.5 + np.random.normal(0, 0.3, len(heights))
humidity = 95 - 25 * (heights / 50)**0.7 + np.random.normal(0, 1, len(heights))

ax2.plot(temp, heights, color='#ef4444', linewidth=2, label='Temperature (°C)')
ax2_twin = ax2.twiny()
ax2_twin.plot(humidity, heights, color='#3b82f6', linewidth=2, label='Humidity (%)')
ax2.set_xlabel('Temperature (°C)', color='#ef4444')
ax2_twin.set_xlabel('Relative humidity (%)', color='#3b82f6')
ax2.set_ylabel('Height (m)', color='white')
ax2.set_title('Microclimate: Vertical Gradient', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2_twin.tick_params(colors='gray')

lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Species richness by layer
ax3.set_facecolor('#111827')
layer_names = ['Forest floor', 'Understorey', 'Lower canopy', 'Upper canopy', 'Emergent']
layer_heights = [2.5, 15, 25, 37, 47]
bird_species = [8, 15, 25, 35, 10]
mammal_species = [12, 8, 5, 3, 1]
insect_relative = [20, 30, 40, 50, 15]

x = np.arange(len(layer_names))
width = 0.25
ax3.bar(x - width, bird_species, width, color='#3b82f6', label='Birds')
ax3.bar(x, mammal_species, width, color='#f59e0b', label='Mammals')
ax3.bar(x + width, [i/2 for i in insect_relative], width, color='#22c55e', label='Insects (÷2)')
ax3.set_xticks(x)
ax3.set_xticklabels(layer_names, rotation=20, ha='right', fontsize=8)
ax3.set_ylabel('Species count', color='white')
ax3.set_title('Biodiversity by Canopy Layer', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax3.tick_params(colors='gray')

# Canopy connectivity simulation
ax4.set_facecolor('#111827')
np.random.seed(42)

# Generate trees
n_trees = 40
tree_x = np.random.uniform(0, 100, n_trees)
tree_y = np.random.uniform(0, 100, n_trees)
tree_height = np.random.normal(35, 8, n_trees)
crown_radius = tree_height / 8

# Draw crowns from above
for i in range(n_trees):
    circle = plt.Circle((tree_x[i], tree_y[i]), crown_radius[i],
                        color='#22c55e', alpha=0.3)
    ax4.add_patch(circle)
    if tree_height[i] > 40:  # emergent trees
        ax4.plot(tree_x[i], tree_y[i], '*', color='#f59e0b', markersize=10)

# Show connectivity — draw lines between overlapping crowns
for i in range(n_trees):
    for j in range(i+1, n_trees):
        dist = np.sqrt((tree_x[i] - tree_x[j])**2 + (tree_y[i] - tree_y[j])**2)
        if dist < crown_radius[i] + crown_radius[j] + 5:  # gap < 5m
            ax4.plot([tree_x[i], tree_x[j]], [tree_y[i], tree_y[j]],
                    color='#22c55e', linewidth=0.3, alpha=0.3)

# Clear-cut area
ax4.fill([60, 100, 100, 60], [0, 0, 40, 40], color='#92400e', alpha=0.3)
ax4.text(80, 20, 'Cleared\
area', ha='center', color='#ef4444', fontsize=11, fontweight='bold')

ax4.set_xlim(0, 100)
ax4.set_ylim(0, 100)
ax4.set_xlabel('East-West (m)', color='white')
ax4.set_ylabel('North-South (m)', color='white')
ax4.set_title('Canopy Connectivity (top view)', color='white', fontsize=12)
ax4.tick_params(colors='gray')
ax4.set_aspect('equal')

plt.tight_layout()
plt.show()

print("Canopy ecology summary:")
print(f"  Light at canopy top: {I_0}%")
print(f"  Light at forest floor: {light[0]:.1f}% ({I_0/light[0]:.0f}× reduction)")
print(f"  Temperature range: {temp[0]:.1f}°C (floor) to {temp[-1]:.1f}°C (canopy)")
print(f"  Humidity range: {humidity[-1]:.0f}% (canopy) to {humidity[0]:.0f}% (floor)")
print()
print("Hornbills need connected canopy to move through the forest.")
print("Clearing just one strip can isolate a population as effectively")
print("as a wall isolates two rooms.")`,
      challenge: 'If the cleared area in the diagram expands from 40% to 60% of the forest, count how many trees become disconnected from the main forest. At what clearing threshold does the canopy network "break" into isolated fragments?',
      successHint: 'Canopy ecology reveals that forests are three-dimensional habitats. Protecting only the ground is like protecting only the foundation of a building — the whole structure depends on what happens above.',
    },
    {
      title: 'Indicator species — hornbills as forest health monitors',
      concept: `Some species are **indicator species** — their presence (or absence) tells you about the health of an entire ecosystem. The great hornbill is one of the best indicator species for tropical forest health because:

1. **Large home range**: hornbills need extensive, connected forest. If hornbills are present, the forest is large and intact enough to support many other species.
2. **Dependence on old trees**: hornbills need large natural cavities for nesting, which only form in trees 100+ years old. Hornbill presence indicates old-growth forest.
3. **Diet of many species**: hornbills eat fruits from 40+ tree species. Their presence indicates high tree diversity.
4. **Sensitivity to disturbance**: hornbills are among the first large birds to disappear when logging begins. They are early warning systems.
5. **Keystone role**: as seed dispersers, hornbills actively maintain the forest. Their loss triggers cascading changes.

The concept of an **umbrella species** is related: by protecting enough habitat for hornbills, you automatically protect habitat for thousands of other species that need the same forest. Conservation of one species becomes conservation of an entire community.

Scientists use **occupancy modelling** to track hornbill presence/absence across survey sites and relate it to habitat variables. This tells them which forest characteristics predict hornbill occurrence — and therefore which areas are most important to protect.`,
      analogy: 'A hornbill in a forest is like a canary in a coal mine. Canaries are sensitive to toxic gases — if the canary dies, miners know the air is dangerous. If hornbills disappear from a forest, ecologists know the ecosystem is degrading. The hornbill is the forest\'s health alarm system.',
      storyConnection: 'The Naga people said "when the hornbill leaves, the forest dies." This is not metaphor — it is ecology. Hornbill loss leads to reduced seed dispersal, which leads to reduced tree regeneration, which leads to canopy thinning, which leads to microclimatic change, which leads to further species loss. The cultural wisdom captured the cascade before science documented it.',
      checkQuestion: 'If you survey 20 forest patches and find hornbills in 8 of them, can you conclude that hornbill occupancy is 40%? What might be wrong with this number?',
      checkAnswer: 'The raw occupancy is 8/20 = 40%, but this is biased low. Hornbills might be PRESENT in some of the 12 "empty" patches but simply not DETECTED during your survey (they were feeding elsewhere, hidden in canopy, or silent). True occupancy = apparent occupancy / detection probability. If detection probability is 0.6 (you miss them 40% of the time), true occupancy ≈ 0.40 / 0.6 = 67%. Repeat surveys at each site help estimate detection probability.',
      codeIntro: 'Build an occupancy model relating hornbill presence to forest characteristics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Occupancy model simulation
n_sites = 100

# Forest characteristics
canopy_cover = np.random.uniform(20, 95, n_sites)  # percent
tree_age = np.random.uniform(10, 200, n_sites)  # years (average)
fragment_size = np.random.exponential(20, n_sites) + 5  # km²
distance_to_road = np.random.exponential(5, n_sites)  # km

# True occupancy probability (logistic model)
# Hornbills need: high canopy cover, old trees, large fragments, far from roads
logit_psi = -5 + 0.04 * canopy_cover + 0.015 * tree_age + 0.03 * fragment_size + 0.1 * distance_to_road
psi = 1 / (1 + np.exp(-logit_psi))  # occupancy probability

# True presence/absence
true_presence = np.random.binomial(1, psi)

# Detection probability (varies with canopy density — harder to detect in dense canopy)
p_detect = 0.4 + 0.003 * (100 - canopy_cover)  # 0.4-0.64
p_detect = np.clip(p_detect, 0.3, 0.7)

# Three survey visits
n_visits = 3
detections = np.zeros((n_sites, n_visits))
for v in range(n_visits):
    detections[:, v] = true_presence * np.random.binomial(1, p_detect)

# Observed (detected at least once)
observed = (detections.sum(axis=1) > 0).astype(int)

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Occupancy vs canopy cover
ax1.set_facecolor('#111827')
ax1.scatter(canopy_cover[observed == 1], fragment_size[observed == 1],
           s=40, color='#22c55e', alpha=0.6, label='Hornbill detected')
ax1.scatter(canopy_cover[observed == 0], fragment_size[observed == 0],
           s=40, color='#ef4444', alpha=0.4, label='Not detected')
ax1.set_xlabel('Canopy cover (%)', color='white')
ax1.set_ylabel('Fragment size (km²)', color='white')
ax1.set_title('Hornbill Occupancy vs Habitat', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# True vs observed occupancy
ax2.set_facecolor('#111827')
true_occ = true_presence.mean()
obs_occ = observed.mean()
corrected_occ = obs_occ / p_detect.mean()

bars = ax2.bar(['True\
occupancy', 'Observed\
(1 visit)', 'Observed\
(3 visits)', 'Corrected\
estimate'],
              [true_occ, detections[:, 0].mean(), obs_occ, min(corrected_occ, 1.0)],
              color=['#3b82f6', '#ef4444', '#f59e0b', '#22c55e'], edgecolor='none')
ax2.set_ylabel('Occupancy rate', color='white')
ax2.set_title('Detection Matters: True vs Observed', color='white', fontsize=12)
ax2.tick_params(colors='gray')
for bar in bars:
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01,
             f'{bar.get_height():.2f}', ha='center', color='white', fontsize=11)

# Feature importance (what predicts hornbill presence?)
ax3.set_facecolor('#111827')
features = ['Canopy cover', 'Tree age', 'Fragment size', 'Distance\
to road']
# Simple correlation with true presence
importances = [
    np.corrcoef(canopy_cover, true_presence)[0, 1],
    np.corrcoef(tree_age, true_presence)[0, 1],
    np.corrcoef(fragment_size, true_presence)[0, 1],
    np.corrcoef(distance_to_road, true_presence)[0, 1],
]
colors_imp = ['#22c55e' if x > 0 else '#ef4444' for x in importances]
bars = ax3.barh(features, importances, color=colors_imp, edgecolor='none')
ax3.set_xlabel('Correlation with hornbill presence', color='white')
ax3.set_title('Which Forest Features Matter Most?', color='white', fontsize=12)
ax3.tick_params(colors='gray')
ax3.axvline(0, color='gray', linewidth=0.5)

# Conservation priority map (simplified 2D)
ax4.set_facecolor('#111827')
xx, yy = np.meshgrid(np.linspace(20, 95, 50), np.linspace(5, 80, 50))
# Priority = f(canopy_cover, fragment_size)
logit_grid = -5 + 0.04 * xx + 0.03 * yy
priority = 1 / (1 + np.exp(-logit_grid))

from matplotlib.colors import LinearSegmentedColormap
cmap = LinearSegmentedColormap.from_list('priority', ['#1f2937', '#22c55e', '#f59e0b'])
im = ax4.pcolormesh(xx, yy, priority, cmap=cmap, shading='auto')
ax4.contour(xx, yy, priority, levels=[0.3, 0.5, 0.7], colors='white', linewidths=0.5)
plt.colorbar(im, ax=ax4, label='Predicted occupancy probability')
ax4.set_xlabel('Canopy cover (%)', color='white')
ax4.set_ylabel('Fragment size (km²)', color='white')
ax4.set_title('Conservation Priority Map', color='white', fontsize=12)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Occupancy model results:")
print(f"  True occupancy: {true_occ:.2f} ({true_presence.sum()} of {n_sites} sites)")
print(f"  Observed (single visit): {detections[:, 0].mean():.2f}")
print(f"  Observed (3 visits): {obs_occ:.2f}")
print(f"  Detection-corrected: {min(corrected_occ, 1.0):.2f}")
print()
print("Feature correlations with hornbill presence:")
for feat, imp in sorted(zip(features, importances), key=lambda x: abs(x[1]), reverse=True):
    direction = "positive" if imp > 0 else "negative"
    print(f"  {feat}: r = {imp:.3f} ({direction})")
print()
print("Indicator species value:")
print("  Where hornbills are found, expect high canopy cover,")
print("  old trees, large forest fragments, and low disturbance.")
print("  Protecting hornbill habitat protects entire ecosystems.")`,
      challenge: 'Add a "hunting pressure" variable (random, 0-10) that reduces occupancy. How does this change the occupancy model? Can you separate hunting effects from habitat effects in the data?',
      successHint: 'You have completed the full arc from hornbill anatomy to population-level ecology. The great hornbill is not just a beautiful bird — it is a living instrument for measuring forest health. Protecting hornbills means protecting the most complex terrestrial ecosystems on Earth.',
    },
    {
      title: 'Data collection — how ecologists gather evidence',
      concept: `Everything we have discussed — population size, territory, breeding success, canopy structure, occupancy — depends on reliable data. Ecological data collection is challenging because your subjects are wild, unpredictable, and often invisible.

Core field methods:
- **Visual surveys**: walking transects or sitting at observation points, recording every animal seen. Requires trained observers and standardised protocols.
- **Acoustic monitoring**: recording bird calls with microphones. AI algorithms can now identify species from spectrograms. Works 24/7, even when visibility is zero.
- **Camera traps**: motion-triggered cameras placed on trees. Capture images of birds visiting nest sites or feeding trees.
- **GPS telemetry**: satellite or radio transmitters attached to individual birds. Provides continuous location data but requires initial capture.
- **Drone surveys**: overhead flights can map canopy structure, count large nests, and measure forest fragmentation.
- **Citizen science**: trained community members report sightings via mobile apps.

Data quality depends on:
- **Standardisation**: same methods, same effort, same time of year, every year
- **Replication**: enough samples to be statistically meaningful
- **Bias control**: accounting for what you miss (detection probability)
- **Metadata**: recording conditions (weather, time, observer) that affect results

The shift from traditional field notebooks to digital data pipelines (GPS → cloud database → statistical model → conservation decision) has transformed ecology into a data science.`,
      analogy: 'Ecological data collection is like detective work. You rarely see the crime (animal activity) happen directly. Instead, you gather evidence: footprints (tracks), fingerprints (DNA from feathers), security footage (camera traps), phone records (GPS telemetry), and witness statements (visual surveys). Each evidence type has biases, and the best investigations use multiple independent sources.',
      storyConnection: 'The Naga communities were the original ecological data collectors — observing hornbill behaviour across seasons, years, and generations. They knew which trees were nesting sites decades before scientists arrived with GPS tags. Modern ecology at its best combines this traditional knowledge with quantitative methods, respecting both sources of truth.',
      checkQuestion: 'You set up 10 acoustic recorders in a forest for 30 days. Each recorder captures 720 hours of audio. You now have 7,200 hours of recordings. How do you find hornbill calls in this data?',
      checkAnswer: 'Manual review is impossible (7,200 hours would take years). Instead: (1) Train a machine learning model on known hornbill call spectrograms. (2) Run the model on all recordings to detect candidate calls. (3) Human experts verify a random sample to measure false positive/negative rates. (4) Use detection rates to estimate calling frequency and, from there, abundance. This is the workflow used in modern bioacoustics — AI as a filter, humans as validators.',
      codeIntro: 'Simulate an acoustic monitoring dataset and show how detection algorithms find signals in noise.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate acoustic monitoring
duration = 3600  # 1 hour in seconds
sample_rate = 100  # simplified (real audio is 44100 Hz)
t = np.linspace(0, duration, duration * sample_rate)

# Background noise (forest sounds)
noise = 0.3 * np.random.randn(len(t))

# Hornbill calls: distinctive low-frequency honks
# Simulate as brief tone bursts at random times
n_calls = 15
call_times = np.sort(np.random.uniform(100, 3400, n_calls))
call_duration = 0.5  # seconds
call_freq = 2.0  # Hz (simplified — real calls are ~500-1500 Hz)

signal = np.zeros_like(t)
for ct in call_times:
    mask = (t >= ct) & (t < ct + call_duration)
    signal[mask] = 1.5 * np.sin(2 * np.pi * call_freq * (t[mask] - ct))

recording = noise + signal

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Waveform (zoomed to show a call)
ax1.set_facecolor('#111827')
zoom_start = int(call_times[3] * sample_rate) - 200
zoom_end = zoom_start + 600
ax1.plot(t[zoom_start:zoom_end], recording[zoom_start:zoom_end], color='#3b82f6', linewidth=0.5)
ax1.plot(t[zoom_start:zoom_end], signal[zoom_start:zoom_end], color='#22c55e', linewidth=1, alpha=0.7, label='True call')
ax1.set_xlabel('Time (s)', color='white')
ax1.set_ylabel('Amplitude', color='white')
ax1.set_title('Audio Waveform: One Hornbill Call in Noise', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Energy detection: sliding window
ax2.set_facecolor('#111827')
window_size = int(0.5 * sample_rate)
energy = np.array([np.sum(recording[i:i+window_size]**2) for i in range(0, len(recording) - window_size, window_size // 2)])
time_windows = np.arange(len(energy)) * (window_size // 2) / sample_rate

threshold = np.percentile(energy, 85)
detections = energy > threshold

ax2.plot(time_windows, energy, color='#3b82f6', linewidth=0.5, alpha=0.7)
ax2.axhline(threshold, color='#ef4444', linestyle='--', linewidth=1, label=f'Threshold ({threshold:.0f})')
ax2.scatter(time_windows[detections], energy[detections], color='#f59e0b', s=10, zorder=5, label='Detections')

# Mark true calls
for ct in call_times:
    ax2.axvline(ct, color='#22c55e', linewidth=0.5, alpha=0.3)

ax2.set_xlabel('Time (s)', color='white')
ax2.set_ylabel('Energy', color='white')
ax2.set_title('Energy Detection: Finding Calls in Noise', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

# Confusion matrix
ax3.set_facecolor('#111827')
# Evaluate detections against true calls
true_positives = 0
false_positives = 0
false_negatives = 0

for ct in call_times:
    # Check if any detection is within 2 seconds of true call
    close = np.any(np.abs(time_windows[detections] - ct) < 2)
    if close:
        true_positives += 1
    else:
        false_negatives += 1

# False positives: detections not near any true call
for dt in time_windows[detections]:
    if not np.any(np.abs(call_times - dt) < 2):
        false_positives += 1

true_negatives = len(energy) - true_positives - false_positives - false_negatives

labels = ['True\
positives', 'False\
positives', 'False\
negatives', 'True\
negatives']
values = [true_positives, false_positives, false_negatives, max(true_negatives, 0)]
colors_cm = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6']

bars = ax3.bar(labels, values, color=colors_cm, edgecolor='none')
ax3.set_ylabel('Count', color='white')
ax3.set_title('Detection Accuracy', color='white', fontsize=12)
ax3.tick_params(colors='gray')
for bar, v in zip(bars, values):
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
             str(v), ha='center', color='white', fontsize=12, fontweight='bold')

# Multi-day calling activity pattern
ax4.set_facecolor('#111827')
hours = np.arange(0, 24)
# Hornbills most vocal at dawn (5-7am) and dusk (5-7pm)
calling_rate = 2 * np.exp(-((hours - 6)**2) / 3) + 1.5 * np.exp(-((hours - 17)**2) / 3)
calling_rate += 0.2 * np.random.rand(24)

ax4.bar(hours, calling_rate, color='#f59e0b', alpha=0.8, edgecolor='none')
ax4.set_xlabel('Hour of day', color='white')
ax4.set_ylabel('Calling rate (calls/hour)', color='white')
ax4.set_title('Daily Calling Pattern: When to Listen', color='white', fontsize=12)
ax4.tick_params(colors='gray')
ax4.set_xticks([0, 4, 8, 12, 16, 20])
ax4.set_xticklabels(['12am', '4am', '8am', '12pm', '4pm', '8pm'])

# Shade night hours
ax4.axvspan(0, 5, alpha=0.1, color='#3b82f6')
ax4.axvspan(19, 24, alpha=0.1, color='#3b82f6')
ax4.text(2.5, max(calling_rate) * 0.8, 'Night', color='#60a5fa', ha='center', fontsize=9)

plt.tight_layout()
plt.show()

precision = true_positives / max(true_positives + false_positives, 1)
recall = true_positives / max(true_positives + false_negatives, 1)
print("Detection results:")
print(f"  True calls: {n_calls}")
print(f"  True positives: {true_positives}")
print(f"  False positives: {false_positives}")
print(f"  False negatives: {false_negatives}")
print(f"  Precision: {precision:.2f} (of detections, how many are real)")
print(f"  Recall: {recall:.2f} (of real calls, how many detected)")
print()
print("Modern bioacoustics pipelines process terabytes of audio")
print("using machine learning to detect species-specific calls.")
print("This enables continuous monitoring at a fraction of the cost")
print("of human observers — critical for remote forests in Nagaland.")`,
      challenge: 'Lower the detection threshold to catch more true calls (increase recall). What happens to the false positive rate? Plot the precision-recall trade-off curve by varying the threshold from the 50th to 99th percentile.',
      successHint: 'Data collection is where ecology meets engineering. Every conservation decision is only as good as the data behind it. The combination of field biology, sensor technology, and statistical modelling is what transforms observations into actionable knowledge — from the Naga hills to conservation labs worldwide.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Animal Ecology — builds on Level 1 ornithology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ecological analysis. Click to start.</p>
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
