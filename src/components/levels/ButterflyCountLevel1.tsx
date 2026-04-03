import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ButterflyCountLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is data — turning the world into numbers',
      concept: `In the story, a boy sits in his garden and counts butterflies. That simple act — counting — is the foundation of all science. **Data** is information collected through observation or measurement, organized so it can be analyzed.

Types of data:
- **Quantitative**: numbers you can measure (5 butterflies, wing span 7.2 cm, temperature 28°C)
- **Qualitative**: categories you can describe (yellow swallowtail, spotted, female)
- **Continuous**: can take any value in a range (temperature: 28.3°C, 28.31°C...)
- **Discrete**: can only take specific values (3 butterflies, not 3.7)

Raw data by itself is not information. The boy didn't just count "5 butterflies." He recorded WHAT species, WHERE, WHEN, and HOW MANY. These five W's turn raw numbers into structured data that can answer questions:
- Are butterfly populations growing or shrinking?
- Which species prefer which flowers?
- Does time of day affect activity?

Every scientific discovery started with someone deciding to count something carefully.`,
      analogy: 'Data is like the ingredients list for a recipe. "Flour, sugar, eggs" tells you what\'s there but not how much. "500g flour, 200g sugar, 3 eggs" is data — specific, measurable, actionable. Science is cooking with data: precise measurements in, reliable results out. Vague ingredients = vague results.',
      storyConnection: 'The boy who counted butterflies was doing exactly what professional ecologists do — recording species, location, time, and count. His notebook IS a dataset. The story shows that science doesn\'t start in a laboratory with expensive equipment. It starts with careful observation and a pencil. Darwin\'s greatest insights came from counting barnacles and finches.',
      checkQuestion: 'A student records: "I saw lots of butterflies today, more than yesterday, and they were mostly yellow ones near the marigolds." Is this good data? What\'s missing?',
      checkAnswer: 'It\'s a good observation but poor data. "Lots" and "more than yesterday" are vague — how many exactly? "Mostly yellow" — what percentage? "Near the marigolds" — how near? Good data would be: "14 butterflies at 10:30 AM, 9 were Common Grass Yellow, 5 were Plain Tiger, all within 2 meters of marigold bed A." Precision is what separates observation from data.',
      codeIntro: 'Create a structured dataset from butterfly observations and explore its properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulated butterfly survey data (30 days)
n_days = 30
dates = np.arange(1, n_days + 1)

# Species counts per day (Poisson distribution — common for count data)
species = {
    'Common Grass Yellow': np.random.poisson(8, n_days),
    'Plain Tiger': np.random.poisson(5, n_days),
    'Common Mormon': np.random.poisson(3, n_days),
    'Blue Pansy': np.random.poisson(2, n_days),
    'Painted Lady': np.random.poisson(1, n_days),
}

# Temperature (affects activity)
temperature = 25 + 5 * np.sin(dates / 30 * np.pi) + np.random.normal(0, 1.5, n_days)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Daily counts by species
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
colors = ['#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#a855f7']
bottom = np.zeros(n_days)
for (name, counts), color in zip(species.items(), colors):
    ax1.bar(dates, counts, bottom=bottom, color=color, alpha=0.8, label=name)
    bottom += counts

ax1.set_xlabel('Day', color='white')
ax1.set_ylabel('Count', color='white')
ax1.set_title('Daily Butterfly Counts by Species', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax1.tick_params(colors='gray')

# Total counts and temperature
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
total_daily = sum(species.values())
ax2_twin = ax2.twinx()
ax2.bar(dates, total_daily, color='#3b82f6', alpha=0.5, label='Total butterflies')
ax2_twin.plot(dates, temperature, color='#ef4444', linewidth=2, label='Temperature')
ax2.set_xlabel('Day', color='white')
ax2.set_ylabel('Total butterflies', color='#3b82f6')
ax2_twin.set_ylabel('Temperature (°C)', color='#ef4444')
ax2.set_title('Butterflies vs Temperature', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2_twin.tick_params(colors='gray')

# Pie chart of species composition
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
total_per_species = {name: counts.sum() for name, counts in species.items()}
wedges, texts, autotexts = ax3.pie(total_per_species.values(), labels=total_per_species.keys(),
                                    colors=colors, autopct='%1.1f%%', textprops={'color': 'white', 'fontsize': 8})
for autotext in autotexts:
    autotext.set_fontsize(8)
ax3.set_title('Species Composition (30 days)', color='white', fontsize=12)

# Data quality checklist
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.axis('off')
checklist = [
    ('What was measured?', 'Species count, temperature', True),
    ('Where?', 'Garden location recorded', True),
    ('When?', 'Date and time recorded', True),
    ('By whom?', 'Observer name recorded', True),
    ('How?', 'Visual count, 30-min survey', True),
    ('Units specified?', 'Count (individuals), °C', True),
    ('Missing data noted?', '2 rainy days skipped', True),
    ('Repeatable?', 'Same method each day', True),
]

for i, (question, answer, ok) in enumerate(checklist):
    symbol = '  [OK]' if ok else '  [!]'
    color = '#22c55e' if ok else '#ef4444'
    ax4.text(0.05, 0.95 - i * 0.11, f'{symbol} {question}', color=color, fontsize=10,
            transform=ax4.transAxes, fontfamily='monospace')
    ax4.text(0.55, 0.95 - i * 0.11, answer, color='gray', fontsize=9,
            transform=ax4.transAxes)

ax4.set_title('Data Quality Checklist', color='white', fontsize=12)

plt.tight_layout()
plt.show()

total = sum(c.sum() for c in species.values())
print(f"Dataset summary:")
print(f"  Days surveyed: {n_days}")
print(f"  Total butterflies counted: {total}")
print(f"  Species recorded: {len(species)}")
print(f"  Most common: Common Grass Yellow ({species['Common Grass Yellow'].sum()} individuals)")
print(f"  Rarest: Painted Lady ({species['Painted Lady'].sum()} individuals)")
print(f"  Average per day: {total/n_days:.1f}")`,
      challenge: 'Add a 6th species to the dataset: "Common Emigrant" with an average of 4 per day. How does the species composition chart change? What happens to the "average per day" total?',
      successHint: 'Every dataset in science — from butterfly counts to genome sequences to satellite measurements — follows the same principles: be specific, be consistent, be honest about what you didn\'t measure. Good data is the foundation everything else rests on.',
    },
    {
      title: 'Observation vs measurement — knowing the difference',
      concept: `The boy in the story OBSERVED butterflies, but he also MEASURED them (by counting). These are related but different:

**Observation**: using your senses to notice something
- "That butterfly is yellow"
- "There are more butterflies near the flowers"
- "They're most active in the morning"

**Measurement**: assigning a number using a defined method
- "Wing span: 5.2 cm (measured with ruler)"
- "Count: 14 individuals in 30 minutes"
- "Activity: 23 flower visits per hour"

The critical differences:
- Observations are subjective (two people might disagree on "lots of butterflies")
- Measurements are objective (two people counting get the same number, if they count carefully)
- Observations generate hypotheses ("I think there are more butterflies on warm days")
- Measurements test hypotheses ("On days above 28°C, average count was 22; below 28°C, it was 14")

Science progresses when observations become measurements. The boy started by noticing butterflies; science started when he began counting them.`,
      analogy: 'Observation is like browsing a shop — you notice what catches your eye. Measurement is like doing inventory — you count every item on every shelf. Both are useful, but only inventory tells you exactly what\'s in stock. A doctor observes that a patient "looks pale" (observation) but measures their hemoglobin at 8 g/dL (measurement). The measurement is what drives the diagnosis.',
      storyConnection: 'The boy who counted butterflies started as an observer — he just liked watching them. The shift to counting (measuring) transformed his hobby into science. His notebook went from "today I saw beautiful butterflies" to "Day 15: 12 Common Grass Yellow, 5 Plain Tiger, temp 29°C, time 10:15 AM." That shift is the origin of every scientific revolution.',
      checkQuestion: 'You observe that "the garden has fewer butterflies than last year." How would you turn this observation into a testable measurement?',
      checkAnswer: 'Design a standardized survey: count all butterflies in a fixed area (e.g., 10m × 10m plot) for a fixed time (30 minutes) at the same time of day, on the same dates as last year. Compare the counts. "Last year: mean 18 per survey. This year: mean 11 per survey." Now you have numbers that can be tested statistically — is the difference real or just random variation?',
      codeIntro: 'Compare observations (subjective) with measurements (objective) using the same data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate two observers counting butterflies in the same garden
# Observer A: careful counter with consistent method
# Observer B: casual observer, estimates "high/medium/low"

n_days = 20
true_counts = np.random.poisson(15, n_days)  # actual butterfly numbers

# Observer A: accurate count ± small error
observer_a = true_counts + np.random.randint(-1, 2, n_days)
observer_a = np.maximum(observer_a, 0)

# Observer B: categorical assessment converted to estimates
# "lots" = 20, "some" = 10, "few" = 5
observer_b_categories = []
observer_b_estimates = []
for count in true_counts:
    if count > 18:
        observer_b_categories.append('lots')
        observer_b_estimates.append(20)
    elif count > 10:
        observer_b_categories.append('some')
        observer_b_estimates.append(10)
    else:
        observer_b_categories.append('few')
        observer_b_estimates.append(5)

observer_b_estimates = np.array(observer_b_estimates)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Both observers vs truth
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
days = np.arange(1, n_days + 1)
ax1.plot(days, true_counts, 'o-', color='white', linewidth=2, markersize=5, label='Actual count')
ax1.plot(days, observer_a, 's-', color='#22c55e', linewidth=1.5, markersize=4, label='Observer A (counting)')
ax1.plot(days, observer_b_estimates, 'd-', color='#ef4444', linewidth=1.5, markersize=4, label='Observer B (estimating)')
ax1.set_xlabel('Day', color='white')
ax1.set_ylabel('Butterfly count', color='white')
ax1.set_title('Measurement vs Estimation', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Error comparison
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
error_a = observer_a - true_counts
error_b = observer_b_estimates - true_counts

ax2.hist(error_a, bins=10, color='#22c55e', alpha=0.6, label=f'Observer A (std={np.std(error_a):.1f})')
ax2.hist(error_b, bins=10, color='#ef4444', alpha=0.6, label=f'Observer B (std={np.std(error_b):.1f})')
ax2.axvline(0, color='white', linestyle='--', alpha=0.5)
ax2.set_xlabel('Error (estimate - actual)', color='white')
ax2.set_ylabel('Frequency', color='white')
ax2.set_title('Error Distribution', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Information loss
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Observer A captures daily variation; B loses it
ax3.plot(days, true_counts, color='white', linewidth=1, alpha=0.5, label='Actual variation')
ax3.fill_between(days, observer_a - 1, observer_a + 1, alpha=0.3, color='#22c55e',
                label='Observer A uncertainty')

# Observer B sees only 3 levels
for cat, est, color in [('few', 5, '#3b82f6'), ('some', 10, '#f59e0b'), ('lots', 20, '#ef4444')]:
    mask = np.array(observer_b_categories) == cat
    if mask.any():
        ax3.scatter(days[mask], observer_b_estimates[mask], color=color, s=60, label=f'B: "{cat}" = {est}',
                   zorder=5, edgecolors='white', linewidth=0.5)

ax3.set_xlabel('Day', color='white')
ax3.set_ylabel('Count', color='white')
ax3.set_title('Information Resolution: Counting vs Categories', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

# Can we detect a trend?
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Add a real declining trend
declining_true = true_counts - days * 0.3
declining_a = declining_true + np.random.randint(-1, 2, n_days)
declining_b_est = []
for count in declining_true:
    if count > 18: declining_b_est.append(20)
    elif count > 10: declining_b_est.append(10)
    else: declining_b_est.append(5)

ax4.plot(days, declining_a, 'o-', color='#22c55e', linewidth=1.5, label='Observer A (sees decline)')
ax4.plot(days, declining_b_est, 's-', color='#ef4444', linewidth=1.5, label='Observer B (misses subtlety)')
# Trend line for A
z = np.polyfit(days, declining_a, 1)
ax4.plot(days, np.polyval(z, days), '--', color='#22c55e', alpha=0.7, label=f'Trend: {z[0]:.2f}/day')
ax4.set_xlabel('Day', color='white')
ax4.set_ylabel('Count', color='white')
ax4.set_title('Can You Detect the Decline?', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Comparison:")
print(f"  Observer A error: mean={np.mean(error_a):.1f}, std={np.std(error_a):.1f}")
print(f"  Observer B error: mean={np.mean(error_b):.1f}, std={np.std(error_b):.1f}")
print(f"\\nObserver A detects the trend (slope = {z[0]:.2f} butterflies/day)")
print(f"Observer B cannot — the categories are too coarse to see the gradual decline")
print(f"\\nLesson: measurement precision determines what questions you can answer")`,
      challenge: 'What if Observer B uses 5 categories instead of 3 ("very few", "few", "some", "many", "lots")? Does the error improve? At what point do categories become as good as counting?',
      successHint: 'The resolution of your measurement determines what patterns you can detect. Coarse observations miss subtle trends. This is why ecologists count precisely, physicists measure to many decimal places, and doctors order blood tests instead of just looking at patients.',
    },
    {
      title: 'Sampling methods — you can\'t count everything',
      concept: `The boy in the story counted butterflies in his garden. But what if he wanted to know how many butterflies live in all of Assam? He can't count every butterfly in the state. He needs a **sampling method** — a way to count SOME and estimate ALL.

Common sampling methods:
- **Random sampling**: pick survey locations randomly (avoids bias but might miss rare habitats)
- **Systematic sampling**: survey at regular intervals (grid pattern across an area)
- **Stratified sampling**: divide the area into habitat types, sample each type separately
- **Transect sampling**: walk a line, count everything within a set distance on each side
- **Quadrat sampling**: place a frame (1m × 1m) at random spots, count everything inside

The critical question: **Is my sample representative?** If you only survey gardens, you'll miss forest butterflies. If you only survey in summer, you'll miss winter species. Good sampling requires:
1. Enough samples (sample size)
2. Spread across the right areas (spatial coverage)
3. Repeated over time (temporal coverage)
4. A clear, repeatable method (protocol)`,
      analogy: 'Sampling is like taste-testing soup. You don\'t drink the whole pot to know if it\'s salty — you take a spoonful. But if the salt hasn\'t been mixed in, the spoon from the top tastes different from the spoon from the bottom. Good sampling = stirring the soup first (randomizing) and taking multiple spoonfuls from different depths (representative coverage).',
      storyConnection: 'The boy counted every butterfly he saw in his garden — that\'s a **census** (counting everything in a defined area). But his garden is not all of Assam. To estimate Assam\'s butterfly population from his garden counts, he\'d need to sample many gardens, forests, wetlands, and hills — each representing a different habitat. His single garden is one data point; science needs many.',
      checkQuestion: 'A student counts 50 butterflies in her 100 m² garden. She concludes: "Since Kaziranga National Park is 430 km², there must be 50 × 4,300,000 = 215 million butterflies there." What\'s wrong with this reasoning?',
      checkAnswer: 'Multiple problems: (1) Her garden is not representative of Kaziranga — different habitat, food plants, microclimate. (2) Butterfly density varies enormously between habitats. (3) She sampled at one time, one place — no replication. (4) She assumed uniform density, which never occurs in nature. Proper estimation would require sampling across Kaziranga\'s habitat types with replication and statistical analysis.',
      codeIntro: 'Simulate different sampling methods and see how they estimate a butterfly population.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Create a "landscape" with butterfly distribution
# Butterflies cluster near flowers (non-uniform distribution)
landscape_size = 100  # 100 x 100 grid

# Create clusters of butterflies
n_butterflies = 500
# 3 clusters (flower patches)
cluster_centers = [(20, 30), (70, 60), (50, 80)]
cluster_sizes = [200, 150, 100]
remaining = n_butterflies - sum(cluster_sizes)

butterfly_x = []
butterfly_y = []
for (cx, cy), n in zip(cluster_centers, cluster_sizes):
    butterfly_x.extend(np.random.normal(cx, 10, n))
    butterfly_y.extend(np.random.normal(cy, 10, n))
# Random scattered
butterfly_x.extend(np.random.uniform(0, landscape_size, remaining))
butterfly_y.extend(np.random.uniform(0, landscape_size, remaining))

butterfly_x = np.clip(butterfly_x, 0, landscape_size)
butterfly_y = np.clip(butterfly_y, 0, landscape_size)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.patch.set_facecolor('#1f2937')

# True distribution
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.scatter(butterfly_x, butterfly_y, s=2, color='#f59e0b', alpha=0.5)
ax.set_title(f'True Distribution ({n_butterflies} butterflies)', color='white', fontsize=10)
ax.set_xlim(0, landscape_size)
ax.set_ylim(0, landscape_size)
ax.tick_params(colors='gray')
ax.set_aspect('equal')

# Method 1: Random quadrats
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.scatter(butterfly_x, butterfly_y, s=1, color='gray', alpha=0.2)
n_quadrats = 10
quadrat_size = 10
quadrat_x = np.random.uniform(0, landscape_size - quadrat_size, n_quadrats)
quadrat_y = np.random.uniform(0, landscape_size - quadrat_size, n_quadrats)
quadrat_counts = []
for qx, qy in zip(quadrat_x, quadrat_y):
    count = sum(1 for bx, by in zip(butterfly_x, butterfly_y)
               if qx <= bx <= qx + quadrat_size and qy <= by <= qy + quadrat_size)
    quadrat_counts.append(count)
    rect = plt.Rectangle((qx, qy), quadrat_size, quadrat_size, fill=False, edgecolor='#22c55e', linewidth=1.5)
    ax.add_patch(rect)
    ax.text(qx + 1, qy + 1, str(count), color='#22c55e', fontsize=7)

density_est = np.mean(quadrat_counts) / (quadrat_size ** 2)
pop_est = density_est * landscape_size ** 2
ax.set_title(f'Random Quadrats\\nEstimate: {pop_est:.0f} (true: {n_butterflies})', color='white', fontsize=10)
ax.set_xlim(0, landscape_size); ax.set_ylim(0, landscape_size)
ax.tick_params(colors='gray'); ax.set_aspect('equal')

# Method 2: Systematic grid
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.scatter(butterfly_x, butterfly_y, s=1, color='gray', alpha=0.2)
grid_spacing = 25
sys_counts = []
for gx in np.arange(5, landscape_size, grid_spacing):
    for gy in np.arange(5, landscape_size, grid_spacing):
        count = sum(1 for bx, by in zip(butterfly_x, butterfly_y)
                   if gx <= bx <= gx + quadrat_size and gy <= by <= gy + quadrat_size)
        sys_counts.append(count)
        rect = plt.Rectangle((gx, gy), quadrat_size, quadrat_size, fill=False, edgecolor='#3b82f6', linewidth=1.5)
        ax.add_patch(rect)
        ax.text(gx + 1, gy + 1, str(count), color='#3b82f6', fontsize=7)

sys_density = np.mean(sys_counts) / (quadrat_size ** 2)
sys_est = sys_density * landscape_size ** 2
ax.set_title(f'Systematic Grid\\nEstimate: {sys_est:.0f} (true: {n_butterflies})', color='white', fontsize=10)
ax.set_xlim(0, landscape_size); ax.set_ylim(0, landscape_size)
ax.tick_params(colors='gray'); ax.set_aspect('equal')

# Method 3: Transect
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.scatter(butterfly_x, butterfly_y, s=1, color='gray', alpha=0.2)
transect_width = 5
transect_positions = [20, 50, 80]
trans_counts = []
for ty in transect_positions:
    count = sum(1 for bx, by in zip(butterfly_x, butterfly_y)
               if ty - transect_width/2 <= by <= ty + transect_width/2)
    trans_counts.append(count)
    ax.fill_between([0, landscape_size], ty - transect_width/2, ty + transect_width/2,
                    alpha=0.2, color='#ef4444')
    ax.text(5, ty, f'n={count}', color='#ef4444', fontsize=9)

trans_density = np.mean(trans_counts) / (landscape_size * transect_width)
trans_est = trans_density * landscape_size ** 2
ax.set_title(f'Line Transects\\nEstimate: {trans_est:.0f} (true: {n_butterflies})', color='white', fontsize=10)
ax.set_xlim(0, landscape_size); ax.set_ylim(0, landscape_size)
ax.tick_params(colors='gray'); ax.set_aspect('equal')

# Comparison of methods (repeated sampling)
ax = axes[1, 1]
ax.set_facecolor('#111827')
n_trials = 100
random_estimates = []
systematic_estimates = []
transect_estimates = []

for trial in range(n_trials):
    # Random quadrats
    qx = np.random.uniform(0, landscape_size - quadrat_size, n_quadrats)
    qy = np.random.uniform(0, landscape_size - quadrat_size, n_quadrats)
    counts = []
    for x, y in zip(qx, qy):
        count = sum(1 for bx, by in zip(butterfly_x, butterfly_y)
                   if x <= bx <= x + quadrat_size and y <= by <= y + quadrat_size)
        counts.append(count)
    random_estimates.append(np.mean(counts) / quadrat_size**2 * landscape_size**2)

    # Transects at random positions
    ty_pos = np.random.uniform(transect_width, landscape_size - transect_width, 3)
    t_counts = []
    for ty in ty_pos:
        count = sum(1 for bx, by in zip(butterfly_x, butterfly_y)
                   if ty - transect_width/2 <= by <= ty + transect_width/2)
        t_counts.append(count)
    transect_estimates.append(np.mean(t_counts) / (landscape_size * transect_width) * landscape_size**2)

ax.hist(random_estimates, bins=20, color='#22c55e', alpha=0.5, label='Random quadrats')
ax.hist(transect_estimates, bins=20, color='#ef4444', alpha=0.5, label='Transects')
ax.axvline(n_butterflies, color='white', linewidth=2, linestyle='--', label=f'True: {n_butterflies}')
ax.set_xlabel('Population estimate', color='white')
ax.set_ylabel('Frequency', color='white')
ax.set_title('Estimate Variability (100 trials)', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Summary statistics
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
methods = ['Random quadrats', 'Transects']
means = [np.mean(random_estimates), np.mean(transect_estimates)]
stds = [np.std(random_estimates), np.std(transect_estimates)]
biases = [np.mean(random_estimates) - n_butterflies, np.mean(transect_estimates) - n_butterflies]

ax.text(0.1, 0.9, 'Method Comparison', color='white', fontsize=14, transform=ax.transAxes, fontweight='bold')
ax.text(0.1, 0.75, f'True population: {n_butterflies}', color='white', fontsize=11, transform=ax.transAxes)

for i, (method, mean, std, bias) in enumerate(zip(methods, means, stds, biases)):
    y = 0.55 - i * 0.25
    ax.text(0.1, y, f'{method}:', color='white', fontsize=11, transform=ax.transAxes)
    ax.text(0.15, y - 0.08, f'Mean: {mean:.0f} (bias: {bias:+.0f})', color='#f59e0b', fontsize=10, transform=ax.transAxes)
    ax.text(0.15, y - 0.15, f'Std: {std:.0f} (precision)', color='#3b82f6', fontsize=10, transform=ax.transAxes)

plt.tight_layout()
plt.show()

print("Sampling method comparison:")
print(f"  True population: {n_butterflies}")
print(f"  Random quadrats: {np.mean(random_estimates):.0f} ± {np.std(random_estimates):.0f}")
print(f"  Transects: {np.mean(transect_estimates):.0f} ± {np.std(transect_estimates):.0f}")`,
      challenge: 'Increase the number of quadrats from 10 to 30. Does the estimate get better? At what sample size does the standard deviation drop below 50?',
      successHint: 'Sampling is the art of learning about the whole by studying a part. Every opinion poll, medical trial, and ecological survey depends on sampling. The method you choose determines how accurate your conclusions can be.',
    },
    {
      title: 'Recording data — tables, notebooks, and consistency',
      concept: `The boy in the story used a notebook to record his butterfly counts. The FORMAT of data recording matters as much as the data itself. Poorly organized data is hard to analyze, hard to share, and easy to misinterpret.

**The data table**: the universal format for structured data
| Date | Time | Location | Species | Count | Weather | Observer |
|---|---|---|---|---|---|---|
| 2024-03-15 | 09:30 | Garden A | Common Grass Yellow | 7 | Sunny, 28°C | Arjun |

Rules for good data recording:
1. **One observation per row** (each row is independent)
2. **One variable per column** (don't mix "species + count" in one cell)
3. **Consistent units** (always °C, always cm, always individuals)
4. **Consistent format** (dates as YYYY-MM-DD, not sometimes DD/MM and sometimes MM/DD)
5. **Record missing data explicitly** (write "NA" or "not measured," never leave blank)
6. **Raw data is sacred** — never delete or overwrite original observations

These rules seem pedantic, but when you have 10,000 rows of data, inconsistency makes analysis impossible. "March 15" and "15/03" and "3/15/24" are all the same date to a human but three different entries to a computer.`,
      analogy: 'A data table is like a library catalog. Each book (observation) has a card (row) with standardized fields: title, author, year, shelf number. If some cards list the author first and others list the title first, finding anything becomes a nightmare. Standardization is boring but essential — it\'s what makes a pile of cards into a searchable catalog.',
      storyConnection: 'The boy\'s notebook started messy — scribbles, arrows, notes in the margins. Over time, he developed a table format: date, species, count, notes. This is exactly how real field ecologists evolve their data recording. Charles Darwin started with rambling notes and eventually developed structured specimen catalogs. The discipline of recording is a skill learned through practice.',
      checkQuestion: 'A researcher sends you a spreadsheet with butterfly data. Column A says "Date" but has entries like "March 5", "5/3", "2024-03-05", and "Tuesday." Can you analyze this data?',
      checkAnswer: 'Not without significant cleaning. "March 5" — what year? "5/3" — May 3rd or March 5th? "Tuesday" — which Tuesday? Before any analysis, you\'d need to standardize every date into a single format (ISO 8601: YYYY-MM-DD). This "data cleaning" step can take 80% of analysis time. Consistent recording from the start saves enormous effort later.',
      codeIntro: 'Build a clean butterfly survey dataset and demonstrate common data problems.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Demonstrate clean vs messy data
# Clean dataset
n_records = 30
dates = [f'2024-03-{d:02d}' for d in range(1, n_records + 1)]
times = ['09:30' if d % 2 == 0 else '10:00' for d in range(n_records)]
species_list = ['Common Grass Yellow', 'Plain Tiger', 'Common Mormon', 'Blue Pansy', 'Painted Lady']
locations = ['Garden A', 'Garden B', 'Park C']

# Generate clean records
clean_data = []
for i in range(n_records):
    sp = np.random.choice(species_list)
    loc = np.random.choice(locations)
    count = max(0, np.random.poisson(8))
    temp = round(25 + np.random.normal(0, 3), 1)
    clean_data.append((dates[i], times[i], loc, sp, count, temp))

# Now create "messy" versions of common problems
messy_issues = {
    'Inconsistent dates': ['March 5', '5/3/24', '2024-03-05', 'Mar 5', '05-03-2024'],
    'Inconsistent species': ['Grass Yellow', 'C. Grass Yellow', 'Common grass yellow', 'CGY', 'Catopsilia pomona'],
    'Mixed units': ['28°C', '82°F', '28 degrees', '301K', 'warm'],
    'Missing data': ['12', '', 'NA', 'not counted', '-'],
}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Clean data summary
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
# Count by species
sp_counts = {}
for record in clean_data:
    sp = record[3]
    sp_counts[sp] = sp_counts.get(sp, 0) + record[4]

ax1.barh(list(sp_counts.keys()), list(sp_counts.values()),
        color=['#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#a855f7'])
ax1.set_xlabel('Total count', color='white')
ax1.set_title('Clean Data: Species Totals', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.set_yticklabels(list(sp_counts.keys()), color='white', fontsize=8)

# Messy data problems
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.axis('off')
y_pos = 0.92
ax2.text(0.05, y_pos, 'Common Data Problems', color='white', fontsize=14, transform=ax2.transAxes, fontweight='bold')
y_pos -= 0.08

for problem, examples in messy_issues.items():
    ax2.text(0.05, y_pos, f'Problem: {problem}', color='#ef4444', fontsize=10, transform=ax2.transAxes)
    y_pos -= 0.06
    example_str = ', '.join([f'"{e}"' for e in examples])
    ax2.text(0.08, y_pos, f'Examples: {example_str}', color='gray', fontsize=8, transform=ax2.transAxes)
    y_pos -= 0.04
    fix = {'Inconsistent dates': 'Use ISO 8601: YYYY-MM-DD',
           'Inconsistent species': 'Use full scientific or common name consistently',
           'Mixed units': 'Pick one unit, convert all values',
           'Missing data': 'Always use "NA" for missing values'}
    ax2.text(0.08, y_pos, f'Fix: {fix[problem]}', color='#22c55e', fontsize=8, transform=ax2.transAxes)
    y_pos -= 0.08

ax2.set_title('Why Data Cleaning Takes 80% of Analysis Time', color='white', fontsize=12)

# Count by location over time
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
loc_data = {loc: [] for loc in locations}
for record in clean_data:
    day = int(record[0].split('-')[2])
    loc_data[record[2]].append((day, record[4]))

loc_colors = ['#22c55e', '#3b82f6', '#ef4444']
for (loc, data), color in zip(loc_data.items(), loc_colors):
    if data:
        days, counts = zip(*sorted(data))
        ax3.plot(days, counts, 'o-', color=color, label=loc, markersize=4, linewidth=1)

ax3.set_xlabel('Day of March', color='white')
ax3.set_ylabel('Count', color='white')
ax3.set_title('Counts by Location Over Time', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Temperature vs count
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
temps = [r[5] for r in clean_data]
counts = [r[4] for r in clean_data]
ax4.scatter(temps, counts, color='#f59e0b', alpha=0.6, s=50, edgecolors='white', linewidth=0.5)
# Trend line
z = np.polyfit(temps, counts, 1)
temp_range = np.linspace(min(temps), max(temps), 100)
ax4.plot(temp_range, np.polyval(z, temp_range), '--', color='#ef4444', linewidth=2,
        label=f'Trend: {z[0]:.2f} butterflies/°C')
ax4.set_xlabel('Temperature (°C)', color='white')
ax4.set_ylabel('Butterfly count', color='white')
ax4.set_title('Temperature vs Activity', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Clean data summary:")
print(f"  Records: {len(clean_data)}")
print(f"  Date range: {dates[0]} to {dates[-1]}")
print(f"  Locations: {', '.join(locations)}")
print(f"  Species: {len(species_list)}")
print(f"  Total butterflies: {sum(r[4] for r in clean_data)}")
print(f"\\nData quality rules:")
print(f"  1. One observation per row")
print(f"  2. One variable per column")
print(f"  3. Consistent formats (dates, names, units)")
print(f"  4. Missing data = 'NA', not blank")
print(f"  5. Never overwrite raw data")`,
      challenge: 'You receive a dataset where species names are inconsistent: "CGY", "Grass Yellow", "Common Grass Yellow", "C. Grass Yellow" all mean the same species. Write code to standardize them all to "Common Grass Yellow."',
      successHint: 'Data recording discipline is the least exciting and most important skill in science. Ninety percent of data analysis problems are actually data quality problems. Scientists who record clean data from the start save themselves weeks of cleaning later.',
    },
    {
      title: 'Basic statistics — mean, median, and what they tell you',
      concept: `The boy counted butterflies for 30 days and got 30 numbers. How do you summarize 30 numbers into a single useful statement? That's what **descriptive statistics** do.

**Mean (average)**: add all values, divide by count
- Mean of [5, 8, 12, 7, 8] = 40/5 = 8
- Sensitive to outliers: [5, 8, 12, 7, 100] → mean = 26.4 (misleading!)

**Median**: the middle value when sorted
- Median of [5, 7, 8, 8, 12] = 8
- Resistant to outliers: [5, 7, 8, 8, 100] → median = 8 (still accurate)

**Mode**: most common value
- Mode of [5, 7, 8, 8, 12] = 8

**Range**: max - min (how spread out the data is)
- Range of [5, 7, 8, 8, 12] = 12 - 5 = 7

**When to use which?**
- Symmetric data (bell curve): mean ≈ median, use either
- Skewed data (long tail): median is more representative
- Income, house prices, species counts: use median (outliers distort the mean)`,
      analogy: 'Mean, median, and mode are three ways to answer "what\'s typical?" Think of a classroom. Mean height = total height / number of students. Median height = the student standing in the middle of a height-sorted line. Mode height = the most common height. If the basketball coach (2.1m) walks in, the mean height jumps but the median barely changes. That\'s why doctors use median — one extreme patient shouldn\'t change the "typical."',
      storyConnection: 'After 30 days of counting, the boy wanted to tell his teacher: "How many butterflies does my garden have?" A single number to represent 30 days of data. The mean (average daily count) is the natural choice — but if one day had an unusual swarm of 100 butterflies, the median would be more honest. Choosing the right summary statistic is a judgment call, and it matters.',
      checkQuestion: 'A wildlife census reports "mean elephant count per reserve: 45." Another report says "median elephant count per reserve: 12." Both are true. What does this tell you about the distribution?',
      checkAnswer: 'The data is heavily right-skewed: most reserves have few elephants (median 12), but a few reserves have very large herds (pulling the mean up to 45). This means most reserves have 12 or fewer elephants, but a few mega-reserves with 200+ elephants inflate the average. The median (12) better represents the "typical" reserve. The gap between mean and median is a red flag for skewed data.',
      codeIntro: 'Calculate and visualize mean, median, and spread for butterfly count data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate butterfly count data (30 days)
# Normal days: Poisson with mean 15
counts = np.random.poisson(15, 30)
# Add one outlier day (butterfly migration event)
counts_with_outlier = counts.copy()
counts_with_outlier[15] = 85  # unusual event!

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Distribution without outlier
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.hist(counts, bins=12, color='#3b82f6', alpha=0.7, edgecolor='none')
mean_val = np.mean(counts)
median_val = np.median(counts)
ax1.axvline(mean_val, color='#ef4444', linewidth=2, linestyle='--', label=f'Mean: {mean_val:.1f}')
ax1.axvline(median_val, color='#22c55e', linewidth=2, linestyle=':', label=f'Median: {median_val:.1f}')
ax1.set_xlabel('Daily butterfly count', color='white')
ax1.set_ylabel('Frequency (days)', color='white')
ax1.set_title('Normal Data: Mean ≈ Median', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Distribution with outlier
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.hist(counts_with_outlier, bins=15, color='#3b82f6', alpha=0.7, edgecolor='none')
mean_out = np.mean(counts_with_outlier)
median_out = np.median(counts_with_outlier)
ax2.axvline(mean_out, color='#ef4444', linewidth=2, linestyle='--', label=f'Mean: {mean_out:.1f}')
ax2.axvline(median_out, color='#22c55e', linewidth=2, linestyle=':', label=f'Median: {median_out:.1f}')
ax2.annotate('Migration\nevent!', xy=(85, 0.5), color='#f59e0b', fontsize=10)
ax2.set_xlabel('Daily butterfly count', color='white')
ax2.set_title('With Outlier: Mean ≠ Median', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Running mean and median over time
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
days = np.arange(1, 31)
running_mean = np.cumsum(counts_with_outlier) / days
running_median = [np.median(counts_with_outlier[:i+1]) for i in range(30)]

ax3.plot(days, counts_with_outlier, 'o', color='gray', alpha=0.5, markersize=4, label='Daily counts')
ax3.plot(days, running_mean, color='#ef4444', linewidth=2, label='Running mean')
ax3.plot(days, running_median, color='#22c55e', linewidth=2, label='Running median')
ax3.axvline(16, color='#f59e0b', linestyle='--', alpha=0.5)
ax3.annotate('Outlier day', xy=(16, 85), color='#f59e0b', fontsize=9)
ax3.set_xlabel('Day', color='white')
ax3.set_ylabel('Count', color='white')
ax3.set_title('Running Mean vs Median (notice day 16)', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Five-number summary (box plot)
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
bp = ax4.boxplot([counts, counts_with_outlier], labels=['Normal', 'With outlier'],
                patch_artist=True, widths=0.5,
                boxprops=dict(facecolor='#3b82f6', color='white', alpha=0.5),
                whiskerprops=dict(color='white'),
                capprops=dict(color='white'),
                medianprops=dict(color='#22c55e', linewidth=2),
                flierprops=dict(marker='o', markerfacecolor='#ef4444', markersize=8))

ax4.set_ylabel('Daily count', color='white')
ax4.set_title('Box Plot: Five-Number Summary', color='white', fontsize=12)
ax4.tick_params(colors='gray')

# Annotate box plot elements
ax4.annotate('Median', xy=(1.3, np.median(counts)), color='#22c55e', fontsize=9)
ax4.annotate('Q1 (25th percentile)', xy=(1.3, np.percentile(counts, 25)), color='white', fontsize=8)
ax4.annotate('Q3 (75th percentile)', xy=(1.3, np.percentile(counts, 75)), color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Without outlier:")
print(f"  Mean: {np.mean(counts):.1f}")
print(f"  Median: {np.median(counts):.1f}")
print(f"  Range: {np.min(counts)} - {np.max(counts)}")
print(f"\\nWith outlier (day 16 = 85):")
print(f"  Mean: {np.mean(counts_with_outlier):.1f} (shifted by {np.mean(counts_with_outlier) - np.mean(counts):.1f})")
print(f"  Median: {np.median(counts_with_outlier):.1f} (barely changed)")
print(f"\\nLesson: median is robust to outliers; mean is not.")`,
      challenge: 'Generate 30 days of "income data" using np.random.lognormal(10, 1, 30). Calculate both mean and median. Which better represents a "typical" income? This is why countries report median income, not mean.',
      successHint: 'Mean and median are the two most-used numbers in all of science, economics, and medicine. Knowing when each is appropriate — and when one is misleading — is a fundamental statistical literacy skill. The boy\'s butterfly counts taught him what professional statisticians use every day.',
    },
    {
      title: 'Citizen science projects — everyone is a scientist',
      concept: `The boy counted butterflies alone in his garden. But what if 10,000 people across India counted butterflies on the same day? That's **citizen science** — scientific research conducted by volunteers in partnership with professional scientists.

Successful citizen science projects:
- **eBird**: 800 million bird observations from 1 million+ volunteers worldwide
- **iNaturalist**: 150+ million species observations with AI-assisted identification
- **Big Butterfly Count** (UK): largest butterfly survey in the world, run entirely by volunteers
- **Galaxy Zoo**: volunteers classified galaxy shapes (outperformed computers)
- **Foldit**: gamers solved protein structures that stumped scientists for years

Why citizen science works:
- **Scale**: professionals can't be everywhere at once; volunteers can
- **Cost**: volunteer labor dramatically reduces survey costs
- **Engagement**: participants learn science by doing science
- **Speed**: thousands of people can process data faster than any lab

But it has challenges:
- **Data quality**: volunteers make more identification errors than experts
- **Spatial bias**: more data from cities and parks, less from remote areas
- **Temporal bias**: most observations on weekends when people are free`,
      analogy: 'Citizen science is like Wikipedia for data. Professional scientists set up the framework and verify quality (like Wikipedia editors), while thousands of volunteers contribute content (like Wikipedia writers). No single person could write Wikipedia or count every butterfly in India — but collectively, they can. The key is good protocols that guide non-experts to produce usable data.',
      storyConnection: 'The boy who counted butterflies was a citizen scientist before the term existed. His garden data, combined with data from gardens across Assam, could reveal migration patterns, population trends, and climate impacts that no professional ecologist could discover alone. The story shows that one person\'s curiosity, multiplied by thousands, becomes science.',
      checkQuestion: 'A citizen science project asks 5,000 volunteers to identify butterfly species from photos. Volunteers are correct 85% of the time; experts are correct 98%. Is the volunteer data usable?',
      checkAnswer: 'Yes, with corrections. Statistical methods can account for known error rates. If volunteers consistently misidentify Species A as Species B, you can apply a correction factor. Additionally, requiring multiple volunteers to agree on each identification (consensus) increases accuracy dramatically — 3 volunteers agreeing are often as accurate as 1 expert. The volume of data from 5,000 volunteers far outweighs the higher accuracy of a handful of experts.',
      codeIntro: 'Simulate a citizen science butterfly count and analyze the data quality and coverage.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a national butterfly count
# 500 volunteers across a 100x100 km grid

n_volunteers = 500
grid_size = 100  # km

# Volunteer locations (biased toward cities)
# Cities at (25,25), (75,50), (50,80)
city_centers = [(25, 25), (75, 50), (50, 80)]
vol_x, vol_y = [], []
for i in range(n_volunteers):
    if np.random.random() < 0.6:  # 60% near cities
        city = city_centers[np.random.randint(3)]
        vol_x.append(np.random.normal(city[0], 10))
        vol_y.append(np.random.normal(city[1], 10))
    else:  # 40% scattered
        vol_x.append(np.random.uniform(0, grid_size))
        vol_y.append(np.random.uniform(0, grid_size))

vol_x = np.clip(vol_x, 0, grid_size)
vol_y = np.clip(vol_y, 0, grid_size)

# True butterfly density (varies by habitat)
X_grid, Y_grid = np.meshgrid(np.linspace(0, grid_size, 50), np.linspace(0, grid_size, 50))
true_density = (5 + 15 * np.exp(-((X_grid-40)**2 + (Y_grid-60)**2) / 500) +
                10 * np.exp(-((X_grid-70)**2 + (Y_grid-30)**2) / 300))

# Each volunteer reports a count (with error)
expert_accuracy = 0.98
volunteer_accuracy = 0.85

vol_counts = []
vol_true_counts = []
for vx, vy in zip(vol_x, vol_y):
    # True count at location
    ix = int(np.clip(vx / grid_size * 49, 0, 49))
    iy = int(np.clip(vy / grid_size * 49, 0, 49))
    true_count = np.random.poisson(true_density[iy, ix])
    vol_true_counts.append(true_count)
    # Volunteer count (with errors)
    observed = sum(1 for _ in range(true_count) if np.random.random() < volunteer_accuracy)
    # Some false positives
    observed += np.random.poisson(0.5)
    vol_counts.append(observed)

vol_counts = np.array(vol_counts)
vol_true_counts = np.array(vol_true_counts)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# True density map
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
cs = ax1.contourf(X_grid, Y_grid, true_density, levels=15, cmap='YlOrRd')
plt.colorbar(cs, ax=ax1, label='True density', shrink=0.8)
ax1.set_title('True Butterfly Density', color='white', fontsize=12)
ax1.set_xlabel('km', color='white')
ax1.set_ylabel('km', color='white')
ax1.tick_params(colors='gray')

# Volunteer locations + counts
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
sc = ax2.scatter(vol_x, vol_y, c=vol_counts, s=15, cmap='YlOrRd', alpha=0.7, edgecolors='none')
plt.colorbar(sc, ax=ax2, label='Reported count', shrink=0.8)
for cx, cy in city_centers:
    ax2.plot(cx, cy, 's', color='white', markersize=10)
    ax2.annotate('City', xy=(cx, cy), xytext=(cx+3, cy+3), color='white', fontsize=8)
ax2.set_title(f'Volunteer Observations (n={n_volunteers})', color='white', fontsize=12)
ax2.set_xlabel('km', color='white')
ax2.set_ylabel('km', color='white')
ax2.tick_params(colors='gray')
ax2.set_xlim(0, grid_size)
ax2.set_ylim(0, grid_size)

# Coverage bias
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
# Divide into 10x10 grid and count volunteers per cell
grid_counts = np.zeros((10, 10))
for vx, vy in zip(vol_x, vol_y):
    gx = min(int(vx / 10), 9)
    gy = min(int(vy / 10), 9)
    grid_counts[gy, gx] += 1

ax3.imshow(grid_counts, origin='lower', cmap='Blues', extent=[0, 100, 0, 100])
ax3.set_title('Sampling Coverage (volunteers per cell)', color='white', fontsize=12)
ax3.set_xlabel('km', color='white')
ax3.set_ylabel('km', color='white')
ax3.tick_params(colors='gray')

# Under-sampled areas
for gy in range(10):
    for gx in range(10):
        color = '#ef4444' if grid_counts[gy, gx] < 3 else '#22c55e'
        ax3.text(gx*10+5, gy*10+5, f'{int(grid_counts[gy, gx])}',
                color=color, fontsize=8, ha='center', va='center')

# Accuracy analysis
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
error = vol_counts - vol_true_counts
ax4.hist(error, bins=20, color='#f59e0b', alpha=0.7, edgecolor='none')
ax4.axvline(0, color='white', linestyle='--', alpha=0.5)
ax4.axvline(np.mean(error), color='#ef4444', linewidth=2, label=f'Mean error: {np.mean(error):.1f}')
ax4.set_xlabel('Count error (reported - true)', color='white')
ax4.set_ylabel('Frequency', color='white')
ax4.set_title(f'Volunteer Accuracy ({volunteer_accuracy*100:.0f}% species ID)', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Citizen science simulation:")
print(f"  Volunteers: {n_volunteers}")
print(f"  Coverage: {np.sum(grid_counts > 0)} / 100 cells ({np.sum(grid_counts > 0)}%)")
print(f"  Under-sampled cells (< 3 volunteers): {np.sum(grid_counts < 3)}")
print(f"  Mean count error: {np.mean(error):.2f} (slight undercount due to missed IDs)")
print(f"  Std of error: {np.std(error):.2f}")
print(f"\\nKey issues:")
print(f"  Spatial bias: {np.sum(grid_counts == 0)} cells with zero coverage")
print(f"  Urban bias: most volunteers near cities, not wilderness")
print(f"  Data quality: {volunteer_accuracy*100:.0f}% accuracy is usable with corrections")`,
      challenge: 'How many volunteers would you need to ensure every 10km cell has at least 3 observers? Run the simulation with increasing volunteer counts to find out.',
      successHint: 'Citizen science has produced some of the most important ecological datasets in history. eBird alone has generated more scientific papers than any single research group could produce. The boy who counted butterflies was doing what 100 million citizen scientists do worldwide — turning curiosity into data that advances human knowledge.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Data Collection & Citizen Science — no prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for data analysis. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
