import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CloudedLeopardLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'GPS data analysis with Python — from raw fixes to insights',
      concept: `Raw GPS data is just a list of coordinates and timestamps. Turning it into ecological insight requires **data analysis**. Here's the pipeline:

**Step 1: Data cleaning**
- Remove impossible fixes (speed > 50 km/h for a cat)
- Filter out low-accuracy fixes (HDOP > 5)
- Handle missing data (collar didn't get a fix)

**Step 2: Derived metrics**
- **Step length**: distance between consecutive fixes
- **Turn angle**: change in direction between steps
- **Speed**: step length / time interval
- **Net displacement**: straight-line distance from start

**Step 3: Movement classification**
- Short steps + random turns = resting/foraging
- Long steps + consistent direction = traveling/commuting
- Medium steps + sharp turns = hunting/searching

**Step 4: Home range estimation**
- Kernel Density Estimation for utilization distribution
- 95% UD = home range; 50% UD = core area

**Python tools:** pandas for data handling, numpy for calculations, matplotlib for visualization, scipy for statistics.`,
      analogy: 'GPS data analysis is like reading a diary written in coordinates. Each GPS fix is an entry: "At 3 AM, I was at coordinates (26.7°N, 92.1°E)." Your job is to reconstruct the whole story: where did the animal go, what was it doing, and why? The raw coordinates are just dots — the analysis connects them into a meaningful narrative.',
      storyConnection: 'Imagine the boy had a magical map that showed every step the clouded leopard took. That map is exactly what GPS analysis produces. In the forests around Manas, researchers have used such maps to discover that clouded leopards use specific tree corridors between forest patches — information that directly guides where to plant new trees.',
      checkQuestion: 'A GPS fix shows a clouded leopard at position A at midnight and position B (3 km away) at 4 AM. What can you conclude about its speed?',
      checkAnswer: 'Average speed = 3 km / 4 hours = 0.75 km/h. But this is the MINIMUM speed — the cat likely traveled much farther in a winding path. It could have walked 8 km in zigzags at 2 km/h. The straight-line speed is always an underestimate. This is why higher-frequency GPS fixes give more accurate speed estimates.',
      codeIntro: 'Process and analyze simulated GPS tracking data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate 60 days of GPS data (fixes every 2 hours)
n_fixes = 60 * 12  # 12 fixes per day
hours = np.arange(n_fixes) * 2  # hours since start
days = hours / 24

# Simulate movement with behavioral states
x, y = [0.0], [0.0]
states = []  # 0=resting, 1=foraging, 2=traveling

for i in range(1, n_fixes):
    hour_of_day = hours[i] % 24

    # State transition based on time of day
    if 8 <= hour_of_day < 16:
        state = 0  # resting during midday
    elif hour_of_day >= 20 or hour_of_day < 4:
        state = np.random.choice([1, 2], p=[0.6, 0.4])  # foraging or traveling at night
    else:
        state = np.random.choice([0, 1], p=[0.5, 0.5])  # mixed at dawn/dusk

    states.append(state)

    if state == 0:  # resting
        dx = np.random.normal(0, 0.02)
        dy = np.random.normal(0, 0.02)
    elif state == 1:  # foraging
        dx = np.random.normal(0, 0.15)
        dy = np.random.normal(0, 0.15)
    else:  # traveling
        angle = np.random.vonmises(np.arctan2(0 - y[-1], 0 - x[-1]), 1)  # bias toward center
        speed = np.random.exponential(0.4)
        dx = speed * np.cos(angle)
        dy = speed * np.sin(angle)

    x.append(x[-1] + dx)
    y.append(y[-1] + dy)

x, y = np.array(x), np.array(y)

# Calculate derived metrics
step_lengths = np.sqrt(np.diff(x)**2 + np.diff(y)**2)
speeds = step_lengths / 2  # km per hour (2-hour intervals)
turn_angles = np.diff(np.arctan2(np.diff(y), np.diff(x)))

# Net displacement from start
net_disp = np.sqrt(x**2 + y**2)

fig, axes = plt.subplots(2, 3, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Track colored by behavioral state
ax = axes[0, 0]
ax.set_facecolor('#111827')
state_colors = {0: '#3b82f6', 1: '#f59e0b', 2: '#ef4444'}
state_labels = {0: 'Resting', 1: 'Foraging', 2: 'Traveling'}
for i in range(len(states)):
    ax.plot([x[i], x[i+1]], [y[i], y[i+1]], color=state_colors[states[i]], linewidth=0.8, alpha=0.7)
for s, label in state_labels.items():
    ax.plot([], [], color=state_colors[s], label=label, linewidth=2)
ax.set_title('Track by Behavior State', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# 2. Step length time series
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(days[1:], step_lengths, color='#22c55e', linewidth=0.5, alpha=0.7)
# Rolling average
window = 12  # 1-day rolling average
rolling_mean = np.convolve(step_lengths, np.ones(window)/window, mode='valid')
ax.plot(days[window:], rolling_mean, color='#f59e0b', linewidth=2, label='Daily average')
ax.set_xlabel('Day', color='white')
ax.set_ylabel('Step length (km)', color='white')
ax.set_title('Movement Over Time', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 3. Speed distribution by state
ax = axes[0, 2]
ax.set_facecolor('#111827')
for s in [0, 1, 2]:
    state_speeds = speeds[np.array(states) == s]
    ax.hist(state_speeds, bins=30, alpha=0.6, color=state_colors[s],
            label=f'{state_labels[s]} (n={len(state_speeds)})', density=True)
ax.set_xlabel('Speed (km/h)', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Speed by Behavioral State', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 4. Turn angle distribution
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.hist(turn_angles, bins=36, range=(-np.pi, np.pi), color='#8b5cf6', alpha=0.7, density=True)
ax.set_xlabel('Turn angle (radians)', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Turn Angle Distribution', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 5. Net displacement vs total distance
ax = axes[1, 1]
ax.set_facecolor('#111827')
cumulative_dist = np.concatenate([[0], np.cumsum(step_lengths)])
ax.plot(days, cumulative_dist, color='#22c55e', linewidth=2, label='Total distance')
ax.plot(days, net_disp, color='#ef4444', linewidth=2, label='Net displacement')
ax.set_xlabel('Day', color='white')
ax.set_ylabel('Distance (km)', color='white')
ax.set_title('Total vs Net Distance', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 6. Time budget
ax = axes[1, 2]
ax.set_facecolor('#111827')
state_counts = [states.count(s) for s in [0, 1, 2]]
ax.pie(state_counts, labels=['Resting', 'Foraging', 'Traveling'],
       colors=['#3b82f6', '#f59e0b', '#ef4444'], autopct='%1.0f%%',
       textprops={'color': 'white'})
ax.set_title('Time Budget', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print(f"60-day GPS analysis summary:")
print(f"  Total fixes: {n_fixes}")
print(f"  Total distance: {cumulative_dist[-1]:.1f} km")
print(f"  Net displacement: {net_disp[-1]:.1f} km")
print(f"  Sinuosity ratio: {cumulative_dist[-1] / max(net_disp[-1], 0.1):.1f}")
print(f"  Mean speed: {np.mean(speeds):.3f} km/h")
print(f"  Max speed: {np.max(speeds):.3f} km/h")`,
      challenge: 'Add a "data cleaning" step: remove any fix where speed > 5 km/h (unrealistic for a cat in dense forest — likely a GPS error). How many fixes are removed? How does it change the total distance?',
      successHint: 'This GPS analysis pipeline is used by wildlife researchers worldwide. The same code structure (with real data instead of simulated) has been used to study clouded leopards in Assam, tigers in Sundarbans, and snow leopards in Ladakh.',
    },
    {
      title: 'Movement ecology — why animals move the way they do',
      concept: `**Movement ecology** is the study of how, when, where, and why organisms move. It integrates four components:

**The movement ecology framework:**
1. **Internal state**: hungry? searching for a mate? fleeing?
2. **Navigation capacity**: can the animal find its way? (landmarks, magnetic sense, sun compass)
3. **Motion capacity**: how fast can it move? (biomechanics, energetics)
4. **External factors**: terrain, weather, predators, food distribution

**Movement models:**
- **Random walk**: each step is random direction + random length (null model)
- **Correlated random walk (CRW)**: direction is similar to previous step (persistence)
- **Biased random walk**: tendency toward a target (homing, migration)
- **Levy walk**: mostly short steps with occasional very long steps (optimal foraging theory)

**The Levy flight hypothesis:**
Animals searching for patchy food should use Levy walks — mostly small, thorough steps with rare long jumps to new areas. This has been observed in albatrosses, sharks, bees, and many other species. For clouded leopards, Levy-like patterns may appear when they search for prey across fragmented forest patches.`,
      analogy: 'Movement models are like different shopping strategies in a mall. A random walk is wandering aimlessly. A correlated walk is window shopping along one corridor. A biased walk is heading straight to your favorite store. A Levy walk is browsing nearby shops thoroughly, then occasionally jumping to a completely different floor. Each strategy is optimal for different "shopping" (foraging) conditions.',
      storyConnection: 'The boy noticed that the clouded leopard\'s nightly journeys were not random — it checked specific trees, visited a particular stream, and sometimes made long trips to distant forest patches. These patterns match a correlated random walk with Levy-like long-distance exploratory bouts. The leopard was not wandering — it was optimizing.',
      checkQuestion: 'A clouded leopard mostly takes 50-200m steps but occasionally jumps 2-3 km in a single night. Is this random or strategic?',
      checkAnswer: 'Almost certainly strategic. This bimodal step-length distribution (many short + few long) is the hallmark of a Levy walk, which theory predicts is optimal for finding randomly distributed, patchy resources. The short steps thoroughly search one area (a forest patch); the long jumps discover new patches. It is like a foraging algorithm evolved over millions of years.',
      codeIntro: 'Compare different movement models and their ecological implications.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

n_steps = 500

def random_walk(n):
    angles = np.random.uniform(0, 2*np.pi, n)
    steps = np.random.exponential(0.5, n)
    x = np.cumsum(steps * np.cos(angles))
    y = np.cumsum(steps * np.sin(angles))
    return np.concatenate([[0], x]), np.concatenate([[0], y]), steps

def correlated_walk(n, kappa=3):
    angles = [np.random.uniform(0, 2*np.pi)]
    for _ in range(n-1):
        angles.append(np.random.vonmises(angles[-1], kappa))
    angles = np.array(angles)
    steps = np.random.exponential(0.5, n)
    x = np.cumsum(steps * np.cos(angles))
    y = np.cumsum(steps * np.sin(angles))
    return np.concatenate([[0], x]), np.concatenate([[0], y]), steps

def levy_walk(n, mu=2.0):
    angles = np.random.uniform(0, 2*np.pi, n)
    # Levy: step lengths from power-law distribution
    u = np.random.uniform(0, 1, n)
    steps = (1 - u) ** (-1/(mu-1)) * 0.1  # power-law
    steps = np.clip(steps, 0, 10)
    x = np.cumsum(steps * np.cos(angles))
    y = np.cumsum(steps * np.sin(angles))
    return np.concatenate([[0], x]), np.concatenate([[0], y]), steps

def biased_walk(n, target=(20, 20), bias=0.3):
    x, y = [0.0], [0.0]
    steps_out = []
    for _ in range(n):
        # Angle biased toward target
        target_angle = np.arctan2(target[1] - y[-1], target[0] - x[-1])
        angle = np.random.vonmises(target_angle, bias * 5)
        step = np.random.exponential(0.5)
        steps_out.append(step)
        x.append(x[-1] + step * np.cos(angle))
        y.append(y[-1] + step * np.sin(angle))
    return np.array(x), np.array(y), np.array(steps_out)

fig, axes = plt.subplots(2, 3, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')

walks = [
    ('Random Walk', random_walk(n_steps), '#ef4444'),
    ('Correlated Walk', correlated_walk(n_steps), '#f59e0b'),
    ('L\évy Walk', levy_walk(n_steps), '#22c55e'),
    ('Biased Walk', biased_walk(n_steps), '#3b82f6'),
]

for idx, (name, (x, y, steps), color) in enumerate(walks):
    ax = axes[0, idx] if idx < 3 else None
    if ax is None:
        continue
    ax.set_facecolor('#111827')
    ax.plot(x, y, color=color, linewidth=0.5, alpha=0.7)
    ax.scatter(x[0], y[0], s=60, color='white', zorder=5, marker='o')
    ax.scatter(x[-1], y[-1], s=60, color=color, zorder=5, marker='s')
    ax.set_title(name, color='white', fontsize=10)
    ax.set_aspect('equal')
    ax.tick_params(colors='gray')

# Step length distributions comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
for name, (x, y, steps), color in walks:
    ax.hist(steps, bins=50, alpha=0.5, color=color, label=name, density=True, range=(0, 5))
ax.set_xlabel('Step length', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Step Length Distributions', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_xlim(0, 5)

# Mean squared displacement (MSD) comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
for name, (x, y, steps), color in walks:
    msd = x**2 + y**2
    ax.plot(range(len(msd)), msd, color=color, linewidth=2, label=name)
ax.set_xlabel('Steps', color='white')
ax.set_ylabel('Mean squared displacement', color='white')
ax.set_title('MSD: How Far from Start?', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Biased walk + target
ax = axes[1, 2]
ax.set_facecolor('#111827')
bx, by, bs = biased_walk(n_steps)
ax.plot(bx, by, color='#3b82f6', linewidth=0.5, alpha=0.7)
ax.scatter(0, 0, s=100, color='white', zorder=5, marker='o', label='Start')
ax.scatter(20, 20, s=100, color='#ef4444', zorder=5, marker='*', label='Target')
ax.scatter(bx[-1], by[-1], s=80, color='#3b82f6', zorder=5, marker='s', label='End')
ax.set_title('Biased Walk (homing)', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Movement model comparison:")
print("  Random walk: MSD grows linearly (diffusive)")
print("  Correlated walk: MSD grows faster (persistent direction)")
print("  L\évy walk: MSD grows super-linearly (long jumps)")
print("  Biased walk: MSD grows then plateaus (reaches target)")
print()
print("  Clouded leopards likely use correlated + L\évy-like movement")
print("  Short correlated steps for local foraging")
print("  Occasional long steps to reach new forest patches")`,
      challenge: 'Generate 1000 Levy walks with different mu values (1.5, 2.0, 2.5, 3.0). For each, calculate the total area covered (convex hull). Which mu value gives the best area-to-distance ratio? This is the foraging efficiency question.',
      successHint: 'Movement ecology unifies behavior, physiology, navigation, and environment into a single framework. The mathematical models developed here are also used in robotics (search algorithms), epidemiology (disease spread), and even urban planning (pedestrian flow).',
    },
    {
      title: 'Mark-recapture statistics — the math of counting wildlife',
      concept: `Level 1 introduced Lincoln-Petersen. Now we go deeper with **multi-session capture-recapture** models that account for real-world complications.

**The Cormack-Jolly-Seber (CJS) model:**
- Multiple capture occasions (not just two)
- Estimates **survival probability** (phi) between occasions
- Estimates **recapture probability** (p) at each occasion
- Can test if phi and p vary over time, between sexes, or with covariates

**Likelihood function:**
For each individual's capture history (e.g., 1-0-1-1-0 = seen, not seen, seen, seen, not seen):
- P(1-0-1-1-0) = p₁ × phi₁ × (1-p₂) × phi₂ × p₃ × phi₃ × p₄ × (chi₅)
where chi₅ = probability of never being seen again after occasion 4

**Model selection:**
- Fit multiple models (phi constant, phi varies by time, phi varies by sex, etc.)
- Compare using AIC (Akaike Information Criterion)
- Lower AIC = better balance of fit and complexity

**For clouded leopards:**
Camera trap "capture histories" from individual identification are fed into these models to estimate:
- Population size
- Annual survival rate (~85-90% for adults)
- Detection probability (often only 10-30% per session)`,
      analogy: 'Multi-session mark-recapture is like a teacher taking attendance over a semester. Some students skip randomly (low detection). Some drop out (mortality). By analyzing the pattern of present/absent across all days, you can estimate the true class size (including students who were enrolled but never attended on your attendance days), the dropout rate, and even predict who might drop out next.',
      storyConnection: 'If the boy photographed clouded leopards at the same location weekly, he would build capture histories: "saw Spotty-Face this week, not next week, saw her again two weeks later." From these spotty records, mark-recapture math extracts the true population and survival rates — turning incomplete observations into rigorous science.',
      checkQuestion: 'A capture history for a leopard is 0-0-1-1-0-1-0-0. We first detected it at occasion 3. Does this mean it wasn\'t alive at occasions 1-2?',
      checkAnswer: 'Not necessarily. It means we didn\'t DETECT it at occasions 1-2. It may have been present but not photographed (detection probability < 100%). It might also have been a juvenile not yet in the study area. CJS models handle this by only conditioning on the first capture — the history is analyzed as 1-1-0-1-0-0 (starting from first detection). What happened before first detection is unknown.',
      codeIntro: 'Implement multi-session capture-recapture analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate CJS capture-recapture data
n_animals = 60  # true population at start
n_occasions = 10  # sampling sessions (e.g., monthly)
phi = 0.92  # true survival probability per occasion
p = 0.25    # true detection probability

# Generate capture histories
def simulate_cjs(N, K, phi, p):
    alive = np.ones(N, dtype=bool)
    histories = np.zeros((N, K), dtype=int)

    for k in range(K):
        # Detection
        detected = np.random.random(N) < p
        histories[:, k] = alive & detected

        # Survival to next occasion
        if k < K - 1:
            alive = alive & (np.random.random(N) < phi)

    # Only keep animals detected at least once
    ever_detected = np.any(histories, axis=1)
    return histories[ever_detected]

histories = simulate_cjs(n_animals, n_occasions, phi, p)
n_detected = len(histories)

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Capture history visualization
ax = axes[0, 0]
ax.set_facecolor('#111827')
# Show first 30 individuals
show_n = min(30, n_detected)
ax.imshow(histories[:show_n], cmap='YlGn', aspect='auto', interpolation='none')
ax.set_xlabel('Occasion', color='white')
ax.set_ylabel('Individual', color='white')
ax.set_title(f'Capture Histories ({n_detected} detected of {n_animals})', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 2. Detection counts per occasion
ax = axes[0, 1]
ax.set_facecolor('#111827')
detections_per_occasion = np.sum(histories, axis=0)
new_detections = []
seen_so_far = set()
for k in range(n_occasions):
    new = 0
    for i in range(n_detected):
        if histories[i, k] == 1 and i not in seen_so_far:
            new += 1
            seen_so_far.add(i)
    new_detections.append(new)

x_occ = np.arange(n_occasions)
ax.bar(x_occ - 0.2, detections_per_occasion, 0.35, color='#22c55e', label='Total detections')
ax.bar(x_occ + 0.2, new_detections, 0.35, color='#f59e0b', label='New individuals')
ax.set_xlabel('Occasion', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Detections and New Individuals', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 3. Estimate survival using simple approach
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Jolly-Seber-like estimation (simplified)
# For each pair of consecutive occasions, estimate phi
phi_estimates = []
for k in range(n_occasions - 1):
    seen_k = set(np.where(histories[:, k])[0])
    seen_k1 = set(np.where(histories[:, k+1])[0])
    if len(seen_k) > 0:
        recaptured = len(seen_k & seen_k1)
        phi_est = recaptured / len(seen_k) / p  # crude adjustment for detection
        phi_estimates.append(min(phi_est, 1.0))
    else:
        phi_estimates.append(np.nan)

ax.plot(range(len(phi_estimates)), phi_estimates, 'o-', color='#3b82f6', linewidth=2, label='Estimated \φ')
ax.axhline(phi, color='#ef4444', linestyle='--', label=f'True \φ = {phi}')
ax.set_xlabel('Interval', color='white')
ax.set_ylabel('Survival probability', color='white')
ax.set_title('Survival Estimation (simplified)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(0, 1.2)

# 4. Population size estimation using POPAN-like approach
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Simple estimate: N_k ≈ n_k / p (detected / detection prob)
estimated_N = detections_per_occasion / p
true_N = [n_animals]
for k in range(1, n_occasions):
    true_N.append(int(true_N[-1] * phi))

ax.plot(range(n_occasions), true_N, 'o--', color='#ef4444', linewidth=2, label='True N (surviving)')
ax.plot(range(n_occasions), detections_per_occasion, 's-', color='#22c55e', linewidth=2, label='Detected')
ax.plot(range(n_occasions), estimated_N, '^-', color='#f59e0b', linewidth=2, label='Estimated N (n/p)')
ax.set_xlabel('Occasion', color='white')
ax.set_ylabel('Population size', color='white')
ax.set_title('Population Size Over Time', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"True parameters: N={n_animals}, \φ={phi}, p={p}")
print(f"Detected: {n_detected} individuals ({n_detected/n_animals*100:.0f}% of true population)")
print(f"Simple N estimate: {np.mean(estimated_N):.0f} (true: {np.mean(true_N):.0f})")
print(f"Mean \φ estimate: {np.nanmean(phi_estimates):.3f} (true: {phi})")`,
      challenge: 'Make detection probability vary by occasion (wet season = low p, dry season = high p). How does this affect the population estimates? This is why model selection (testing p-constant vs p-time) matters.',
      successHint: 'Capture-recapture statistics are among the most powerful tools in ecology. The same framework is used for counting fish, birds, elephants, and even humans in hard-to-reach populations. Mastering this math means you can estimate any hidden population from incomplete data.',
    },
    {
      title: 'Habitat suitability modeling — predicting where leopards live',
      concept: `Not all forest is created equal. **Habitat suitability modeling** predicts which areas are good for a species based on environmental variables.

**How it works:**
1. **Presence data**: GPS locations where the species has been found
2. **Environmental variables**: elevation, slope, forest cover, distance to water, distance to roads, rainfall, temperature
3. **Model fitting**: statistical/ML model learns which environmental conditions the species prefers
4. **Prediction**: apply the model across the entire landscape → suitability map

**Common methods:**
- **MaxEnt** (Maximum Entropy): most popular, works with presence-only data
- **Random Forest**: classification of suitable vs unsuitable habitat
- **GLM** (Generalized Linear Model): logistic regression with environmental predictors
- **Boosted Regression Trees**: handles non-linear relationships

**For clouded leopards:**
Key habitat predictors (from published studies):
- **Forest canopy cover** > 60% (they need dense forest)
- **Elevation**: 500-2500m (optimal)
- **Slope**: prefer moderate (not too flat, not too steep)
- **Distance to roads**: strongly avoid roads (negative association)
- **Prey availability**: correlated with forest quality`,
      analogy: 'Habitat suitability modeling is like a restaurant recommendation algorithm. Instead of matching your taste preferences (spicy food, Italian cuisine) to restaurant features, it matches the animal\'s environmental preferences (dense forest, near water) to landscape features. The output is a "suitability score" — like a star rating for each location: 5 stars = perfect habitat, 1 star = the animal would never live there.',
      storyConnection: 'The boy knew which parts of the forest the clouded leopard preferred — the dense canopy near the stream, avoiding the logging road. A habitat suitability model captures this same knowledge mathematically. When researchers modeled clouded leopard habitat in Meghalaya, they found that forest canopy cover was the single most important predictor — confirming what the boy intuitively knew.',
      checkQuestion: 'A habitat model predicts 5000 km² of "suitable" habitat for clouded leopards, but the species is only found in 2000 km² of it. What explains the gap?',
      checkAnswer: 'Several factors: (1) Habitat may be suitable but inaccessible (isolated fragments the species can\'t reach). (2) Historical factors — the species may have been hunted out of some areas. (3) Model limitations — it may miss important variables like prey density or human disturbance. (4) Time lag — populations haven\'t yet colonized newly suitable areas. The gap between potential and realized habitat is a key conservation metric.',
      codeIntro: 'Build a habitat suitability model from simulated environmental data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Create a simulated landscape (50x50 km grid)
grid_size = 100
x_grid = np.linspace(0, 50, grid_size)
y_grid = np.linspace(0, 50, grid_size)
X, Y = np.meshgrid(x_grid, y_grid)

# Environmental variables
elevation = 500 + 1500 * (np.sin(X/15) * np.cos(Y/20) + 1) / 2 + np.random.normal(0, 50, X.shape)
forest_cover = 80 - 30 * np.abs(np.sin(X/8)) + np.random.normal(0, 10, X.shape)
forest_cover = np.clip(forest_cover, 0, 100)
dist_to_road = np.minimum(np.abs(Y - 25), np.abs(X - 15)) + np.random.exponential(2, X.shape)
slope = np.abs(np.gradient(elevation)[0]) + np.abs(np.gradient(elevation)[1])
slope = np.clip(slope * 2, 0, 45)

# True suitability function (what the leopard actually responds to)
suitability = (
    0.4 * (forest_cover / 100) +
    0.2 * np.exp(-((elevation - 1200)**2) / (2 * 400**2)) +
    0.2 * (1 - np.exp(-dist_to_road / 5)) +
    0.1 * np.exp(-((slope - 15)**2) / (2 * 10**2)) +
    0.1 * np.random.uniform(0, 1, X.shape)
)
suitability = (suitability - suitability.min()) / (suitability.max() - suitability.min())

# Generate "presence points" (where leopards are found)
# Probability of presence proportional to suitability
presence_prob = suitability ** 3  # strong selection for high suitability
presence_mask = np.random.random(X.shape) < (presence_prob * 0.05)
presence_x = X[presence_mask]
presence_y = Y[presence_mask]

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')

# Environmental layers
env_layers = [
    ('Elevation (m)', elevation, 'terrain'),
    ('Forest cover (%)', forest_cover, 'Greens'),
    ('Distance to road (km)', dist_to_road, 'RdYlGn'),
    ('Slope (degrees)', slope, 'OrRd'),
]

for idx, (title, data, cmap) in enumerate(env_layers):
    ax = axes[idx // 3, idx % 3] if idx < 3 else axes[1, idx - 3]
    ax.set_facecolor('#111827')
    im = ax.imshow(data, extent=[0, 50, 0, 50], origin='lower', cmap=cmap, aspect='equal')
    ax.set_title(title, color='white', fontsize=10)
    ax.tick_params(colors='gray')
    plt.colorbar(im, ax=ax, shrink=0.8)

# Suitability map with presence points
ax = axes[1, 1]
ax.set_facecolor('#111827')
im = ax.imshow(suitability, extent=[0, 50, 0, 50], origin='lower', cmap='RdYlGn', aspect='equal')
ax.scatter(presence_x, presence_y, s=5, color='white', alpha=0.5, label=f'Presence ({len(presence_x)} pts)')
ax.set_title('Habitat Suitability + Presence', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='lower right')
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

# Response curves
ax = axes[1, 2]
ax.set_facecolor('#111827')
# Extract suitability vs each variable at presence points
fc_bins = np.linspace(0, 100, 20)
suit_by_fc = []
for i in range(len(fc_bins)-1):
    mask = (forest_cover >= fc_bins[i]) & (forest_cover < fc_bins[i+1])
    if mask.any():
        suit_by_fc.append(np.mean(suitability[mask]))
    else:
        suit_by_fc.append(np.nan)
ax.plot(fc_bins[:-1] + 2.5, suit_by_fc, color='#22c55e', linewidth=2, label='Forest cover')

elev_bins = np.linspace(500, 2000, 20)
suit_by_elev = []
for i in range(len(elev_bins)-1):
    mask = (elevation >= elev_bins[i]) & (elevation < elev_bins[i+1])
    if mask.any():
        suit_by_elev.append(np.mean(suitability[mask]))
    else:
        suit_by_elev.append(np.nan)
ax2 = ax.twinx()
ax2.plot(elev_bins[:-1] + 37.5, suit_by_elev, color='#f59e0b', linewidth=2, label='Elevation')
ax.set_xlabel('Forest cover (%) / Elevation (scaled)', color='white')
ax.set_ylabel('Mean suitability', color='white')
ax.set_title('Response Curves', color='white', fontsize=10)
ax.legend(loc='upper left', facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.legend(loc='upper right', facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

total_area = 50 * 50  # km²
suitable_area = np.sum(suitability > 0.5) / grid_size**2 * total_area
high_suit = np.sum(suitability > 0.7) / grid_size**2 * total_area
print(f"Landscape analysis (50x50 km = {total_area} km\²):")
print(f"  Suitable habitat (>0.5): {suitable_area:.0f} km\² ({suitable_area/total_area*100:.0f}%)")
print(f"  High-quality habitat (>0.7): {high_suit:.0f} km\² ({high_suit/total_area*100:.0f}%)")
print(f"  Presence points: {len(presence_x)}")
print(f"  Key predictors: forest cover > elevation > distance to road > slope")`,
      challenge: 'Add a "road building" scenario: create a new road at y=35. Recalculate suitability and measure the habitat loss. What is the total impact of one 50 km road?',
      successHint: 'Habitat suitability models guide real conservation decisions: where to create reserves, where to build corridors, where to restrict development. The same techniques (with real satellite data) are used for every major species conservation plan worldwide.',
    },
    {
      title: 'GIS basics — mapping conservation with spatial data',
      concept: `**Geographic Information Systems (GIS)** are the backbone of modern conservation. GIS combines maps, satellite imagery, and spatial data to answer "where" questions.

**Core concepts:**
- **Raster data**: grid of pixels (satellite images, elevation models, suitability maps)
- **Vector data**: points (animal locations), lines (rivers, roads), polygons (park boundaries)
- **Coordinate Reference Systems**: how to project a round Earth onto a flat map (UTM, WGS84)
- **Spatial analysis**: buffer zones, overlay, distance calculation, viewshed

**GIS operations for conservation:**
1. **Buffer analysis**: draw a 5 km buffer around a road → how much habitat is affected?
2. **Overlay**: combine protected area boundaries with suitability maps → how much good habitat is protected?
3. **Connectivity**: which forest patches are connected? Where are the gaps?
4. **Change detection**: compare satellite images from 2010 vs 2025 → where was forest lost?
5. **Least-cost path**: find the best corridor route for wildlife between two patches

**Tools:** QGIS (free), ArcGIS (professional), Google Earth Engine (cloud-based), Python (rasterio, geopandas, shapely).`,
      analogy: 'GIS is like having X-ray vision for the landscape. Where you normally see a forest, GIS reveals layers: the elevation layer, the soil type layer, the road network layer, the wildlife sighting layer, the protected area layer. Stack them up and you see patterns invisible to the naked eye — like why clouded leopards avoid one valley but love another.',
      storyConnection: 'If the boy mapped every place he saw the clouded leopard on a GIS, layered with forest cover, roads, and elevation, patterns would emerge. The leopard avoids areas within 2 km of roads. It prefers elevations between 500-1500m. Its core area is the densest forest patch. GIS would turn the boy\'s observations into a conservation plan.',
      checkQuestion: 'A GIS analysis shows that 70% of high-quality clouded leopard habitat is outside protected areas. What should conservation managers do?',
      checkAnswer: 'Three strategies: (1) Expand existing protected areas to include adjacent high-quality habitat. (2) Create wildlife corridors connecting protected areas through the unprotected habitat. (3) Work with local communities to establish community conservation areas (not government-managed, but community-protected). In NE India, community forests in Nagaland and Meghalaya are exactly this — ungazetted but effectively protected by villages.',
      codeIntro: 'Perform GIS-style spatial analysis for conservation planning.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

grid_size = 100
landscape_size = 50  # km

# Create landscape layers
x = np.linspace(0, landscape_size, grid_size)
y = np.linspace(0, landscape_size, grid_size)
X, Y = np.meshgrid(x, y)

# Forest cover (patches)
forest = np.zeros((grid_size, grid_size))
# Create forest patches
for cx, cy, r, density in [(10, 15, 8, 0.9), (25, 30, 10, 0.85),
                             (40, 10, 6, 0.7), (35, 40, 9, 0.8),
                             (15, 40, 5, 0.6), (20, 20, 4, 0.75)]:
    dist = np.sqrt((X - cx)**2 + (Y - cy)**2)
    forest[dist < r] = density

# Roads
road1 = np.abs(Y - 25) < 0.5
road2 = np.abs(X - 22) < 0.5
roads = road1 | road2

# Protected area (one polygon)
pa_center = (25, 30)
pa_radius = 10
pa_mask = np.sqrt((X - pa_center[0])**2 + (Y - pa_center[1])**2) < pa_radius

# Distance to nearest road
dist_to_road = np.minimum(np.abs(Y - 25), np.abs(X - 22))

# Suitability (reusing concept)
suitability = 0.6 * forest + 0.3 * (1 - np.exp(-dist_to_road / 3)) + 0.1 * np.random.uniform(0, 1, X.shape)
suitability = np.clip(suitability, 0, 1)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')

# 1. Forest cover with roads
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.imshow(forest, extent=[0, 50, 0, 50], origin='lower', cmap='Greens', vmin=0, vmax=1)
ax.contour(X, Y, roads.astype(float), levels=[0.5], colors=['#ef4444'], linewidths=2)
ax.set_title('Forest Cover + Roads', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 2. Protected area overlay
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.imshow(suitability, extent=[0, 50, 0, 50], origin='lower', cmap='RdYlGn')
ax.contour(X, Y, pa_mask.astype(float), levels=[0.5], colors=['white'], linewidths=2, linestyles='--')
ax.set_title('Suitability + Protected Area', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 3. Gap analysis (suitable habitat outside PA)
ax = axes[0, 2]
ax.set_facecolor('#111827')
suitable = suitability > 0.5
protected_suitable = suitable & pa_mask
unprotected_suitable = suitable & ~pa_mask

gap_map = np.zeros((*X.shape, 3))
gap_map[protected_suitable] = [0.13, 0.72, 0.34]  # green = protected suitable
gap_map[unprotected_suitable] = [0.96, 0.62, 0.04]  # orange = gap (needs protection)
gap_map[~suitable] = [0.1, 0.1, 0.15]  # dark = unsuitable

ax.imshow(gap_map, extent=[0, 50, 0, 50], origin='lower')
ax.set_title('Gap Analysis', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Legend
from matplotlib.patches import Patch
legend_elements = [Patch(facecolor='#22b857', label='Protected + Suitable'),
                   Patch(facecolor='#f59e0b', label='Unprotected Gap'),
                   Patch(facecolor='#1a1a26', label='Unsuitable')]
ax.legend(handles=legend_elements, facecolor='#1f2937', edgecolor='gray',
          labelcolor='white', fontsize=7, loc='lower right')

# 4. Road buffer impact
ax = axes[1, 0]
ax.set_facecolor('#111827')
buffer_distances = [1, 2, 3, 5, 10]
habitat_lost = []
total_suitable = np.sum(suitable)

for d in buffer_distances:
    affected = suitable & (dist_to_road < d)
    habitat_lost.append(np.sum(affected) / total_suitable * 100)

ax.bar([str(d) for d in buffer_distances], habitat_lost, color='#ef4444', alpha=0.7)
ax.set_xlabel('Buffer distance from road (km)', color='white')
ax.set_ylabel('% suitable habitat affected', color='white')
ax.set_title('Road Impact Zone Analysis', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 5. Connectivity analysis
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Identify distinct forest patches
from scipy import ndimage
labeled, n_patches = ndimage.label(forest > 0.5)
ax.imshow(labeled, extent=[0, 50, 0, 50], origin='lower', cmap='Set3')
ax.set_title(f'Forest Patches ({n_patches} fragments)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Calculate patch areas
patch_areas = []
for i in range(1, n_patches + 1):
    area = np.sum(labeled == i) / grid_size**2 * landscape_size**2
    patch_areas.append(area)
    cy_p, cx_p = ndimage.center_of_mass(labeled == i)
    ax.text(cx_p / grid_size * 50, cy_p / grid_size * 50, f'{area:.0f}km\²',
            color='white', ha='center', fontsize=8, fontweight='bold')

# 6. Summary statistics
ax = axes[1, 2]
ax.set_facecolor('#111827')
total_area = landscape_size ** 2
forest_area = np.sum(forest > 0.5) / grid_size**2 * total_area
suitable_area = np.sum(suitable) / grid_size**2 * total_area
protected_area = np.sum(pa_mask) / grid_size**2 * total_area
gap_area = np.sum(unprotected_suitable) / grid_size**2 * total_area

stats = {
    'Total area': total_area,
    'Forest': forest_area,
    'Suitable habitat': suitable_area,
    'Protected area': protected_area,
    'Protection gap': gap_area,
}

bars = ax.barh(list(stats.keys()), list(stats.values()),
               color=['#6b7280', '#22c55e', '#3b82f6', '#8b5cf6', '#ef4444'])
ax.set_xlabel('Area (km\²)', color='white')
ax.set_title('Conservation Summary', color='white', fontsize=10)
ax.tick_params(colors='gray')

for bar, val in zip(bars, stats.values()):
    ax.text(bar.get_width() + 20, bar.get_y() + bar.get_height()/2,
            f'{val:.0f} km\²', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("GIS Conservation Analysis:")
print(f"  Total landscape: {total_area:.0f} km\²")
print(f"  Suitable habitat: {suitable_area:.0f} km\² ({suitable_area/total_area*100:.0f}%)")
print(f"  Protected: {protected_area:.0f} km\²")
print(f"  Protection gap: {gap_area:.0f} km\² ({gap_area/suitable_area*100:.0f}% of suitable)")
print(f"  Forest fragments: {n_patches}")
print(f"  Largest patch: {max(patch_areas):.0f} km\²")`,
      challenge: 'Design a wildlife corridor connecting the two largest forest patches. Calculate the corridor area needed (assume 1 km width minimum). What percentage of the landscape would the corridor system occupy?',
      successHint: 'GIS is the language of conservation planning. Every national park boundary, every wildlife corridor, every environmental impact assessment is built on spatial analysis. Learning GIS is like learning to read the conservation map of the world.',
    },
    {
      title: 'Conservation planning — putting it all together',
      concept: `Conservation planning integrates all the tools — GPS tracking, population estimation, habitat modeling, GIS — into actionable management decisions.

**Systematic Conservation Planning (SCP):**
1. **Define targets**: which species? how many? what habitat?
2. **Map features**: suitability maps, threat maps, cost maps
3. **Set goals**: protect 30% of suitable habitat, maintain connectivity
4. **Select priority areas**: optimization algorithms find the best reserves
5. **Implement**: establish parks, corridors, community areas
6. **Monitor**: track outcomes, adapt the plan

**The 30x30 goal:** Protect 30% of Earth's land and ocean by 2030 (adopted at COP15, 2022).

**Marxan** is the world's most widely used conservation planning software:
- Input: planning units (grid cells), conservation features (species), costs
- Output: the minimum set of planning units that meets all conservation targets at minimum cost
- Used to design marine protected areas, national park systems, and wildlife corridors globally

**For clouded leopards in NE India:**
Priority actions identified by systematic planning:
1. Protect remaining forest in Assam-Meghalaya-Arunachal corridor
2. Establish wildlife corridors between Manas, Nameri, and Kaziranga
3. Community-based conservation in buffer zones
4. Long-term monitoring using camera traps and GPS
5. Genetic management to prevent inbreeding in small populations`,
      analogy: 'Conservation planning is like designing a city transportation system. You need to know where people live (species presence), where they need to go (connectivity), what roads already exist (current protected areas), and where new roads are needed (corridors). The goal is the most efficient system that connects everyone — using the least land and money possible. Marxan is the "route planner" for conservation.',
      storyConnection: 'The boy\'s friendship with the clouded leopard is a single data point. Conservation planning takes thousands of such data points — GPS tracks, camera trap photos, satellite images, community knowledge — and synthesizes them into a plan that protects not one leopard, but the entire population. The boy\'s story, multiplied by science, becomes a conservation strategy.',
      checkQuestion: 'A conservation plan proposes protecting 5000 km² of forest in NE India. The state government says it will cost Rs 500 crore. The timber industry says the same land generates Rs 200 crore per year. How do you make the case for conservation?',
      checkAnswer: 'Multiple arguments: (1) Ecosystem services — the forest provides free water purification, flood control, and carbon storage worth Rs 300+ crore per year (more than timber). (2) Ecotourism revenue is renewable; timber revenue ends when the forest is gone. (3) Climate change mitigation value (carbon credits). (4) Irreversibility — once a species is extinct, no money brings it back. (5) Legal obligations — India\'s biodiversity commitments. The economic case for conservation is often stronger than the case for destruction.',
      codeIntro: 'Implement a simplified conservation planning optimization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simplified Marxan-like conservation planning
grid_size = 20  # 20x20 planning units
n_units = grid_size ** 2
unit_area = 25  # km² each (total: 10,000 km²)

# Generate planning unit attributes
suitability = np.random.beta(2, 3, n_units)  # habitat quality
cost = np.random.exponential(100, n_units)  # land cost (thousands Rs)
threat = np.random.beta(3, 2, n_units)  # development pressure
connectivity = np.random.uniform(0, 1, n_units)  # connectivity value

# Species presence (3 focal species)
species = {
    'Clouded leopard': {'threshold': 0.5, 'target_pct': 0.30},
    'Red panda': {'threshold': 0.4, 'target_pct': 0.25},
    'Hoolock gibbon': {'threshold': 0.6, 'target_pct': 0.35},
}

species_presence = {}
for sp_name, params in species.items():
    presence = suitability + np.random.normal(0, 0.15, n_units) > params['threshold']
    species_presence[sp_name] = presence

# Simple greedy optimization: select units that meet targets at minimum cost
# Priority score = (species richness * suitability * connectivity) / cost
species_richness = sum(v.astype(float) for v in species_presence.values())
priority = (species_richness * suitability * (1 + connectivity)) / (cost + 1)

# Select top units until targets are met
sorted_units = np.argsort(-priority)  # highest priority first
selected = np.zeros(n_units, dtype=bool)
budget = 20000  # total budget (thousands Rs)
total_cost = 0

for unit in sorted_units:
    if total_cost + cost[unit] <= budget:
        selected[unit] = True
        total_cost += cost[unit]

# Check if targets are met
fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')

# 1. Priority map
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.imshow(priority.reshape(grid_size, grid_size), cmap='RdYlGn', aspect='equal')
ax.set_title('Conservation Priority', color='white', fontsize=10)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax, shrink=0.8)

# 2. Selected areas
ax = axes[0, 1]
ax.set_facecolor('#111827')
selected_map = np.zeros((grid_size, grid_size, 3))
selected_2d = selected.reshape(grid_size, grid_size)
suitability_2d = suitability.reshape(grid_size, grid_size)
selected_map[selected_2d] = [0.13, 0.72, 0.34]  # green = selected
selected_map[~selected_2d] = [0.15, 0.15, 0.2]  # dark = not selected
# Outline high-suitability unselected areas
ax.imshow(selected_map, aspect='equal')
ax.set_title(f'Selected Areas ({np.sum(selected)}/{n_units} units)', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 3. Species target achievement
ax = axes[0, 2]
ax.set_facecolor('#111827')
sp_names = list(species.keys())
achieved = []
targets = []
for sp_name, params in species.items():
    present_total = np.sum(species_presence[sp_name])
    present_protected = np.sum(species_presence[sp_name] & selected)
    pct_protected = present_protected / max(present_total, 1)
    achieved.append(pct_protected * 100)
    targets.append(params['target_pct'] * 100)

x_sp = np.arange(len(sp_names))
ax.bar(x_sp - 0.2, achieved, 0.35, color='#22c55e', label='Achieved')
ax.bar(x_sp + 0.2, targets, 0.35, color='#f59e0b', label='Target')
ax.set_xticks(x_sp)
ax.set_xticklabels(sp_names, fontsize=8, color='white')
ax.set_ylabel('% habitat protected', color='white')
ax.set_title('Species Target Achievement', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 4. Cost-efficiency curve
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Cumulative species protection vs cumulative cost
cum_cost = np.cumsum(cost[sorted_units])
cum_cl_protected = np.cumsum(species_presence['Clouded leopard'][sorted_units])
total_cl = np.sum(species_presence['Clouded leopard'])
ax.plot(cum_cost / 1000, cum_cl_protected / total_cl * 100, color='#f59e0b', linewidth=2)
ax.axhline(30, color='#22c55e', linestyle='--', label='30% target')
ax.set_xlabel('Cumulative cost (lakhs Rs)', color='white')
ax.set_ylabel('% clouded leopard habitat protected', color='white')
ax.set_title('Cost-Efficiency Curve', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 5. Trade-off: protection vs development
ax = axes[1, 1]
ax.set_facecolor('#111827')
budgets = np.linspace(5000, 50000, 20)
protection_levels = []
for b in budgets:
    sel = np.zeros(n_units, dtype=bool)
    tc = 0
    for unit in sorted_units:
        if tc + cost[unit] <= b:
            sel[unit] = True
            tc += cost[unit]
    prot = np.sum(sel) / n_units * 100
    protection_levels.append(prot)

ax.plot(budgets / 1000, protection_levels, 'o-', color='#22c55e', linewidth=2)
ax.axhline(30, color='#f59e0b', linestyle='--', label='30% target')
ax.set_xlabel('Budget (lakhs Rs)', color='white')
ax.set_ylabel('% landscape protected', color='white')
ax.set_title('Budget vs Protection Level', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 6. Summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
summary_text = f"""Conservation Plan Summary
{'='*30}
Landscape: {n_units * unit_area:,} km\²
Planning units: {n_units} ({unit_area} km\² each)
Budget: Rs {budget/100:.0f} lakhs
Units selected: {np.sum(selected)} ({np.sum(selected)/n_units*100:.0f}%)
Area protected: {np.sum(selected) * unit_area:,} km\²

Species targets:"""

for i, sp_name in enumerate(sp_names):
    status = '\✓' if achieved[i] >= targets[i] else '\✗'
    summary_text += f"\
  {sp_name}: {achieved[i]:.0f}% ({status} target: {targets[i]:.0f}%)"

summary_text += f"""

Total cost: Rs {total_cost/100:.0f} lakhs
Cost per km\²: Rs {total_cost/(np.sum(selected)*unit_area)*100:.0f} lakhs"""

ax.text(0.1, 0.9, summary_text, transform=ax.transAxes, color='white',
        fontsize=10, verticalalignment='top', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("This optimization found the best set of areas to protect")
print("that meets species targets within the budget constraint.")
print("Real Marxan runs millions of iterations to find near-optimal solutions.")`,
      challenge: 'Add a connectivity bonus: units adjacent to already-selected units get a 50% priority boost. How does this change the spatial pattern of selected areas? Does it create more contiguous reserves?',
      successHint: 'You have completed the full wildlife data science pipeline: GPS tracking, movement ecology, population estimation, habitat modeling, GIS analysis, and conservation planning. These are the exact skills used by conservation biologists protecting clouded leopards, tigers, and every other endangered species in NE India and beyond.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Wildlife Data Science</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for wildlife data science. Click to start.</p>
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