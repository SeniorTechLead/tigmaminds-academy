import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TortoiseHareLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Capstone: Life History Trade-off Model — defining the system',
      concept: `Your capstone project builds a **Life History Trade-off Model** that simulates how metabolic rate, body size, and reproduction rate interact to determine evolutionary fitness.

The model has three core allocation parameters that must sum to 1.0:
- **g** (growth fraction): energy allocated to increasing body mass
- **r** (reproduction fraction): energy allocated to producing offspring
- **m** (maintenance fraction): energy allocated to repair, immune function, longevity

The key relationships:
- **Metabolic rate**: BMR = B0 * M^0.75 (Kleiber's law), determines total energy budget
- **Growth**: dM/dt = g * BMR * efficiency, where efficiency decreases as body approaches max size
- **Reproduction**: offspring/year = r * BMR / cost_per_offspring, starts after maturity
- **Mortality**: death_rate = base + age_acceleration * (1 - m)^2, maintenance reduces aging
- **Fitness**: total surviving offspring over lifetime (the quantity evolution maximizes)

This is an **evolutionary optimization problem**: which allocation strategy (g, r, m) maximizes lifetime fitness? The answer depends on environmental conditions — predation pressure, food availability, and temperature.`,
      analogy: 'This is like a business simulation where you allocate revenue among R&D (growth), dividends (reproduction), and infrastructure maintenance. Spend too much on dividends and the company falls apart. Spend too much on R&D and shareholders leave. The optimal balance depends on the market — and evolution finds it through trial and error across generations.',
      storyConnection: 'The hare allocates heavily to reproduction (many litters, short life). The tortoise allocates heavily to maintenance (few offspring, long life). Our model will discover whether either strategy is universally optimal or whether each is tuned to different environments.',
      checkQuestion: 'If growth, reproduction, and maintenance fractions must sum to 1.0, and you fix maintenance at 0.4, what is the trade-off space? How many free parameters remain?',
      checkAnswer: 'With m=0.4 fixed, g + r = 0.6. Only one free parameter remains (say g, then r = 0.6 - g). The trade-off space is a 1D line from (g=0, r=0.6) to (g=0.6, r=0). With all three free, the space is a 2D triangle. Fixing one parameter collapses the triangle to a line — useful for understanding pairwise trade-offs.',
      codeIntro: 'Build the core life history simulation engine with metabolic scaling and age-dependent mortality.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class LifeHistoryModel:
    """Simulate lifetime fitness under different allocation strategies."""

    def __init__(self, growth_frac, repro_frac, maint_frac,
                 ecto=False, maturity_mass=2.0, max_mass=10.0,
                 offspring_cost=5.0, offspring_survival=0.1,
                 predation_rate=0.05):
        assert abs(growth_frac + repro_frac + maint_frac - 1.0) < 0.01
        self.g = growth_frac
        self.r = repro_frac
        self.m = maint_frac
        self.ecto = ecto
        self.maturity_mass = maturity_mass
        self.max_mass = max_mass
        self.offspring_cost = offspring_cost
        self.offspring_survival = offspring_survival
        self.predation_rate = predation_rate

    def metabolic_rate(self, mass):
        """Annual metabolic budget (arbitrary energy units)."""
        B0 = 10 if self.ecto else 70  # ectotherms: 7x less
        return B0 * mass**0.75

    def mortality_rate(self, age, mass):
        """Annual probability of death."""
        # Base predation (size-dependent: larger = safer)
        predation = self.predation_rate / (1 + mass * 0.3)
        # Aging: Gompertz-like, reduced by maintenance allocation
        aging_rate = 0.001 * age**1.5 * (1 - self.m)**3
        # Starvation risk if too small
        starvation = 0.1 if mass < 0.5 else 0
        return min(predation + aging_rate + starvation, 0.99)

    def simulate(self, max_years=300):
        """Run one lifetime simulation. Returns fitness metrics."""
        mass = 0.5  # starting mass
        age = 0
        total_offspring = 0
        surviving_offspring = 0
        history = {'age': [], 'mass': [], 'offspring': [], 'mortality': [], 'bmr': []}

        while age < max_years:
            bmr = self.metabolic_rate(mass)
            mort = self.mortality_rate(age, mass)

            # Check death
            if np.random.random() < mort:
                break

            # Growth: diminishing returns as approaching max_mass
            growth_efficiency = max(0, 1 - (mass / self.max_mass)**2)
            mass += self.g * bmr * 0.01 * growth_efficiency

            # Reproduction: only if mature
            offspring = 0
            if mass >= self.maturity_mass:
                potential_offspring = self.r * bmr / self.offspring_cost
                offspring = max(0, int(potential_offspring + np.random.randn() * 0.3))
                survived = np.random.binomial(offspring, self.offspring_survival)
                total_offspring += offspring
                surviving_offspring += survived

            history['age'].append(age)
            history['mass'].append(mass)
            history['offspring'].append(offspring)
            history['mortality'].append(mort)
            history['bmr'].append(bmr)
            age += 1

        return {
            'lifespan': age,
            'final_mass': mass,
            'total_offspring': total_offspring,
            'surviving_offspring': surviving_offspring,
            'history': history,
        }

# Define hare-like and tortoise-like strategies
hare_strategy = LifeHistoryModel(g=0.15, r=0.60, m=0.25,
                                  ecto=False, maturity_mass=1.5, max_mass=4,
                                  offspring_cost=3, offspring_survival=0.08,
                                  predation_rate=0.1)

tortoise_strategy = LifeHistoryModel(g=0.25, r=0.20, m=0.55,
                                      ecto=True, maturity_mass=3.0, max_mass=8,
                                      offspring_cost=8, offspring_survival=0.15,
                                      predation_rate=0.05)

balanced_strategy = LifeHistoryModel(g=0.33, r=0.33, m=0.34,
                                      ecto=False, maturity_mass=2.0, max_mass=6,
                                      offspring_cost=5, offspring_survival=0.10,
                                      predation_rate=0.07)

# Run Monte Carlo
n_trials = 500
strategies = [
    ('Hare strategy', hare_strategy, '#22c55e'),
    ('Tortoise strategy', tortoise_strategy, '#f59e0b'),
    ('Balanced', balanced_strategy, '#3b82f6'),
]

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

all_results = {}
for name, model, color in strategies:
    lifespans = []
    fitnesses = []
    for _ in range(n_trials):
        result = model.simulate()
        lifespans.append(result['lifespan'])
        fitnesses.append(result['surviving_offspring'])
    all_results[name] = {'lifespans': lifespans, 'fitnesses': fitnesses, 'color': color}

# Plot 1: Lifespan distributions
ax = axes[0, 0]
for name in all_results:
    data = all_results[name]
    ax.hist(data['lifespans'], bins=30, alpha=0.5, color=data['color'],
            label=f"{name} (μ={np.mean(data['lifespans']):.0f})")
ax.set_xlabel('Lifespan (years)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Lifespan Distribution', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Fitness distributions
ax = axes[0, 1]
for name in all_results:
    data = all_results[name]
    ax.hist(data['fitnesses'], bins=30, alpha=0.5, color=data['color'],
            label=f"{name} (μ={np.mean(data['fitnesses']):.0f})")
ax.set_xlabel('Surviving offspring (lifetime)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Fitness Distribution', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Single representative trajectory
ax = axes[0, 2]
for name, model, color in strategies:
    result = model.simulate()
    h = result['history']
    ax.plot(h['age'], np.cumsum(h['offspring']), color=color, linewidth=2, label=name)
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Cumulative offspring', color='white')
ax.set_title('Reproductive Trajectory (single run)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Mass growth trajectory
ax = axes[1, 0]
for name, model, color in strategies:
    result = model.simulate()
    h = result['history']
    ax.plot(h['age'], h['mass'], color=color, linewidth=2, label=name)
    ax.axhline(model.maturity_mass, color=color, linestyle=':', alpha=0.3)
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Body mass', color='white')
ax.set_title('Growth Trajectories', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Mortality curves
ax = axes[1, 1]
for name, model, color in strategies:
    ages = np.arange(0, 100)
    morts = [model.mortality_rate(a, 3.0) for a in ages]
    ax.plot(ages, morts, color=color, linewidth=2, label=name)
ax.set_xlabel('Age (years)', color='white')
ax.set_ylabel('Mortality rate', color='white')
ax.set_title('Age-Dependent Mortality', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_ylim(0, 0.5)

# Plot 6: Summary
ax = axes[1, 2]
ax.axis('off')
text = "Life History Model Results\\n" + "=" * 35 + "\\n\\n"
for name in all_results:
    data = all_results[name]
    text += f"{name}:\\n"
    text += f"  Lifespan: {np.mean(data['lifespans']):.0f} ± {np.std(data['lifespans']):.0f} yr\\n"
    text += f"  Fitness:  {np.mean(data['fitnesses']):.0f} ± {np.std(data['fitnesses']):.0f}\\n\\n"
text += "Fitness = surviving offspring\\n"
text += "(what evolution actually maximizes)"
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Model engine built and tested.")
print("Next: sweep the allocation space to find the optimal strategy.")`,
      challenge: 'Add a "drought" event at year 30-35: food drops by 50%, doubling metabolic stress. Which strategy survives droughts better? Modify the mortality function to include a starvation component that scales inversely with body mass (larger animals have more reserves).',
      successHint: 'You have built a complete life history simulation engine. The key insight: fitness is NOT lifespan and NOT total offspring — it is SURVIVING offspring. This subtle distinction drives all of life history theory.',
    },
    {
      title: 'Capstone: Allocation space search — finding the evolutionary optimum',
      concept: `Now we systematically search the **allocation space** — all valid combinations of (g, r, m) where g + r + m = 1 — to find the strategy that maximizes fitness.

The allocation space is a **simplex** (triangle) in 3D. Every point on the triangle represents a valid allocation. The corners are extreme strategies:
- (1, 0, 0): all growth, no reproduction or maintenance — grows large but never reproduces (fitness = 0!)
- (0, 1, 0): all reproduction, no growth or maintenance — reproduces immediately but stays small and dies quickly
- (0, 0, 1): all maintenance, no growth or reproduction — lives forever but never reproduces (fitness = 0!)

The optimal allocation is somewhere in the interior, and it shifts depending on environmental conditions:
- **High predation**: favors early reproduction (high r) because you might die young
- **Stable environment**: favors growth + maintenance (larger body, longer life)
- **Variable food**: favors maintenance (survive lean periods)

This is exactly how ecologists explain **r-selection** (favor reproduction in unstable environments) vs **K-selection** (favor growth/maintenance near carrying capacity).`,
      analogy: 'The allocation space is like a mixing board in a recording studio. Three sliders (growth, reproduction, maintenance) must add up to a fixed total. Moving one up requires moving another down. The "best mix" depends on the genre (environment) — a rock song needs different balance than a jazz ballad.',
      storyConnection: 'The hare sits near the reproduction corner of the simplex. The tortoise sits near the maintenance edge. Our search will reveal whether these positions are optimal for their respective environments — or whether either could do better.',
      checkQuestion: 'Why is the corner (0, 1, 0) — all reproduction — not optimal, even though it maximizes offspring production rate?',
      checkAnswer: 'Because with zero growth, the organism stays at its initial tiny size, producing few offspring per attempt (reproduction scales with body size). With zero maintenance, it ages and dies rapidly. The strategy produces many low-quality offspring over a very short life. A small investment in growth and maintenance dramatically increases total lifetime fitness by enabling larger litters and longer reproductive period.',
      codeIntro: 'Sweep the allocation simplex and visualize the fitness landscape for hare-like and tortoise-like environments.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def simulate_fitness(g, r, m, ecto=False, predation=0.07, n_trials=30, max_years=200):
    """Average fitness across multiple trials for given allocation."""
    B0 = 10 if ecto else 70
    maturity_mass = 2.0 if not ecto else 3.0
    fitnesses = []
    for _ in range(n_trials):
        mass = 0.5
        age = 0
        surviving = 0
        while age < max_years:
            bmr = B0 * mass**0.75
            # Mortality
            pred = predation / (1 + mass * 0.3)
            aging = 0.001 * age**1.5 * (1 - m)**3
            mort = min(pred + aging, 0.99)
            if np.random.random() < mort:
                break
            # Growth
            growth_eff = max(0, 1 - (mass / 10)**2)
            mass += g * bmr * 0.01 * growth_eff
            # Reproduction
            if mass >= maturity_mass:
                offspring = int(r * bmr / 5)
                surviving += np.random.binomial(max(offspring, 0), 0.1)
            age += 1
        fitnesses.append(surviving)
    return np.mean(fitnesses)

# Generate simplex grid
resolution = 25
points = []
for gi in range(resolution + 1):
    for ri in range(resolution + 1 - gi):
        mi = resolution - gi - ri
        g = gi / resolution
        r = ri / resolution
        m = mi / resolution
        if g > 0.02 and r > 0.02 and m > 0.02:  # avoid degenerate cases
            points.append((g, r, m))

print(f"Evaluating {len(points)} allocation strategies...")

# Evaluate fitness for two environments
# Environment 1: Low predation (tortoise-favorable)
low_pred_fitness = []
for g, r, m in points:
    f = simulate_fitness(g, r, m, ecto=True, predation=0.03, n_trials=20)
    low_pred_fitness.append(f)

# Environment 2: High predation (hare-favorable)
high_pred_fitness = []
for g, r, m in points:
    f = simulate_fitness(g, r, m, ecto=False, predation=0.15, n_trials=20)
    high_pred_fitness.append(f)

points = np.array(points)
low_pred_fitness = np.array(low_pred_fitness)
high_pred_fitness = np.array(high_pred_fitness)

# Convert simplex coordinates to 2D for plotting
# Ternary -> Cartesian: x = r + g/2, y = g * sqrt(3)/2
x_coords = points[:, 1] + points[:, 0] / 2
y_coords = points[:, 0] * np.sqrt(3) / 2

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

def draw_simplex(ax, title, fitness_values, points_xy):
    """Draw ternary fitness landscape."""
    scatter = ax.scatter(points_xy[:, 0], points_xy[:, 1], c=fitness_values,
                         cmap='magma', s=30, edgecolors='none')
    # Draw simplex outline
    corners = np.array([[0, 0], [1, 0], [0.5, np.sqrt(3)/2], [0, 0]])
    ax.plot(corners[:, 0], corners[:, 1], color='white', linewidth=1)
    # Labels
    ax.text(0.5, np.sqrt(3)/2 + 0.05, 'Growth (g)', ha='center', color='white', fontsize=9)
    ax.text(-0.05, -0.05, 'Maintenance (m)', ha='center', color='white', fontsize=9)
    ax.text(1.05, -0.05, 'Reproduction (r)', ha='center', color='white', fontsize=9)
    # Mark optimum
    best_idx = np.argmax(fitness_values)
    ax.plot(points_xy[best_idx, 0], points_xy[best_idx, 1], '*', color='#22c55e',
            markersize=15, markeredgecolor='white', markeredgewidth=1)
    ax.set_title(title, color='white', fontsize=11)
    ax.set_aspect('equal')
    ax.axis('off')
    return scatter

xy = np.column_stack([x_coords, y_coords])

# Plot 1: Low predation fitness landscape
ax = axes[0, 0]
sc = draw_simplex(ax, 'Low Predation (tortoise env)', low_pred_fitness, xy)
plt.colorbar(sc, ax=ax, label='Fitness', shrink=0.6)

# Plot 2: High predation fitness landscape
ax = axes[0, 1]
sc = draw_simplex(ax, 'High Predation (hare env)', high_pred_fitness, xy)
plt.colorbar(sc, ax=ax, label='Fitness', shrink=0.6)

# Plot 3: Difference map
ax = axes[0, 2]
diff = low_pred_fitness - high_pred_fitness
sc = ax.scatter(x_coords, y_coords, c=diff, cmap='RdBu', s=30, edgecolors='none')
corners = np.array([[0, 0], [1, 0], [0.5, np.sqrt(3)/2], [0, 0]])
ax.plot(corners[:, 0], corners[:, 1], color='white', linewidth=1)
ax.text(0.5, np.sqrt(3)/2 + 0.05, 'Growth', ha='center', color='white', fontsize=9)
ax.text(-0.05, -0.05, 'Maint.', ha='center', color='white', fontsize=9)
ax.text(1.05, -0.05, 'Repro.', ha='center', color='white', fontsize=9)
ax.set_title('Tortoise advantage (blue) vs Hare (red)', color='white', fontsize=10)
ax.set_aspect('equal')
ax.axis('off')
plt.colorbar(sc, ax=ax, label='Fitness difference', shrink=0.6)

# Plot 4: Optimal allocations vs predation rate
ax = axes[1, 0]
predation_rates = np.linspace(0.01, 0.2, 15)
opt_g, opt_r, opt_m = [], [], []
for pred in predation_rates:
    best_f = -1
    best_alloc = (0.33, 0.33, 0.34)
    for g, r, m_val in points:
        f = simulate_fitness(g, r, m_val, predation=pred, n_trials=15)
        if f > best_f:
            best_f = f
            best_alloc = (g, r, m_val)
    opt_g.append(best_alloc[0])
    opt_r.append(best_alloc[1])
    opt_m.append(best_alloc[2])

ax.plot(predation_rates, opt_g, 'o-', color='#a855f7', linewidth=2, label='Growth')
ax.plot(predation_rates, opt_r, 's-', color='#22c55e', linewidth=2, label='Reproduction')
ax.plot(predation_rates, opt_m, '^-', color='#3b82f6', linewidth=2, label='Maintenance')
ax.set_xlabel('Predation rate', color='white')
ax.set_ylabel('Optimal allocation', color='white')
ax.set_title('Optimal Strategy vs Predation', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: r-K selection spectrum
ax = axes[1, 1]
r_selection = {'Reproduction': 0.6, 'Growth': 0.15, 'Maintenance': 0.25}
k_selection = {'Reproduction': 0.2, 'Growth': 0.3, 'Maintenance': 0.5}
labels = list(r_selection.keys())
x_pos = np.arange(len(labels))
ax.bar(x_pos - 0.2, list(r_selection.values()), 0.35, color='#22c55e', label='r-selected (hare)')
ax.bar(x_pos + 0.2, list(k_selection.values()), 0.35, color='#f59e0b', label='K-selected (tortoise)')
ax.set_xticks(x_pos)
ax.set_xticklabels(labels, color='white')
ax.set_ylabel('Allocation fraction', color='white')
ax.set_title('r-Selection vs K-Selection', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary
ax = axes[1, 2]
ax.axis('off')
best_low = points[np.argmax(low_pred_fitness)]
best_high = points[np.argmax(high_pred_fitness)]
text = f"""Optimization Results
========================

Low predation optimum:
  g={best_low[0]:.2f}, r={best_low[1]:.2f}, m={best_low[2]:.2f}
  Fitness: {np.max(low_pred_fitness):.0f}
  → Favors maintenance (tortoise-like)

High predation optimum:
  g={best_high[0]:.2f}, r={best_high[1]:.2f}, m={best_high[2]:.2f}
  Fitness: {np.max(high_pred_fitness):.0f}
  → Favors reproduction (hare-like)

Key insight: The "best" life history
depends entirely on the environment.
Neither tortoise nor hare is universally
superior — each is optimized for its niche."""
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=9,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Allocation space searched. The environment determines the optimal strategy.")
print("High predation → reproduce fast (r-selection) → the hare way")
print("Low predation  → maintain long  (K-selection) → the tortoise way")`,
      challenge: 'Add a fourth axis: social investment. Species that cooperate (share food, warn of predators) can reduce individual mortality. Model social investment as a fraction that reduces predation by pooling group vigilance. Does cooperation shift the optimal balance toward K-selection?',
      successHint: 'You have built a complete life history trade-off model and discovered that the tortoise-hare dichotomy maps directly to r-K selection theory. The optimal strategy is not fixed — it is an emergent property of the environment. This is one of the deepest insights in evolutionary biology.',
    },
    {
      title: 'Capstone: Environmental sensitivity analysis and evolutionary dynamics',
      concept: `The final piece of the capstone: test how the optimal strategy shifts across a range of environmental conditions and simulate evolutionary dynamics where strategies compete.

**Sensitivity analysis** asks: how much does the optimal allocation change when we perturb each environmental parameter? If a small change in predation rate dramatically shifts the optimum, the system is **sensitive** to predation. If food availability barely matters, it is **insensitive** to food.

**Evolutionary dynamics** take this further: instead of finding the static optimum, we simulate a population of competing strategies. Each generation:
1. Individuals with different (g, r, m) allocations compete
2. Fitness determines reproductive success
3. Offspring inherit parental allocation with small mutations
4. Over many generations, the population evolves toward the optimum

This is **evolutionary game theory** — the "players" are life history strategies, and the "game" is survival and reproduction in a given environment.`,
      analogy: 'Sensitivity analysis is like testing a recipe by varying one ingredient at a time — does doubling the salt ruin it or barely matter? Evolutionary dynamics is like a cooking competition where chefs (strategies) compete, the best recipes get copied with slight modifications, and over many rounds the population of recipes converges on the best dish for the judges (environment).',
      storyConnection: 'In the forest where our story takes place, hares and tortoises have coexisted for millennia. Neither has driven the other extinct. This evolutionary dynamics model explains why — they occupy different niches in the allocation space, each optimal for its specific environmental conditions.',
      checkQuestion: 'If the environment fluctuates between high-predation years and low-predation years, would you expect the evolving population to converge on the hare strategy, the tortoise strategy, or something in between?',
      checkAnswer: 'Something in between — a generalist strategy that performs reasonably in both conditions. In fluctuating environments, specialists (extreme hare or extreme tortoise) get decimated during their bad years. A moderate strategy with some maintenance AND some reproduction survives both. This is called "bet-hedging" in evolutionary theory.',
      codeIntro: 'Run sensitivity analysis and simulate evolutionary dynamics as strategies compete over generations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def quick_fitness(g, r, m, predation=0.07, food=1.0, temp=25, n_trials=20):
    """Fast fitness evaluation."""
    B0 = 70 * food
    maturity = 2.0
    fitnesses = []
    for _ in range(n_trials):
        mass = 0.5; age = 0; survived_off = 0
        while age < 150:
            bmr = B0 * mass**0.75
            pred = predation / (1 + mass * 0.3)
            aging = 0.001 * age**1.5 * (1 - m)**3
            mort = min(pred + aging, 0.99)
            if np.random.random() < mort: break
            mass += g * bmr * 0.01 * max(0, 1 - (mass/10)**2)
            if mass >= maturity:
                off = int(r * bmr / 5)
                survived_off += np.random.binomial(max(off, 0), 0.1)
            age += 1
        fitnesses.append(survived_off)
    return np.mean(fitnesses)

# ---- SENSITIVITY ANALYSIS ----
print("Running sensitivity analysis...")
base_params = {'predation': 0.07, 'food': 1.0, 'temp': 25}
base_alloc = (0.25, 0.35, 0.40)
base_fitness = quick_fitness(*base_alloc, **base_params)

# Vary each parameter
param_ranges = {
    'predation': np.linspace(0.01, 0.25, 12),
    'food': np.linspace(0.3, 2.0, 12),
}

sensitivity_results = {}
for param_name, param_values in param_ranges.items():
    opt_allocations = []
    opt_fitnesses = []
    for val in param_values:
        params = base_params.copy()
        params[param_name] = val
        best_f = -1
        best_a = base_alloc
        # Coarse search
        for gi in range(2, 18, 3):
            for ri in range(2, 18 - gi, 3):
                mi = 20 - gi - ri
                g, r, m_val = gi/20, ri/20, mi/20
                f = quick_fitness(g, r, m_val, **params, n_trials=10)
                if f > best_f:
                    best_f = f
                    best_a = (g, r, m_val)
        opt_allocations.append(best_a)
        opt_fitnesses.append(best_f)
    sensitivity_results[param_name] = {
        'values': param_values,
        'allocations': opt_allocations,
        'fitnesses': opt_fitnesses,
    }

# ---- EVOLUTIONARY DYNAMICS ----
print("Running evolutionary dynamics...")
pop_size = 60
n_generations = 80

# Initialize population with random strategies
population = []
for _ in range(pop_size):
    g = np.random.uniform(0.05, 0.5)
    r = np.random.uniform(0.05, 0.5)
    m_val = 1.0 - g - r
    if m_val < 0.05:
        m_val = 0.05; total = g + r + m_val; g /= total; r /= total; m_val /= total
    population.append((g, r, m_val))

gen_history = {'g': [], 'r': [], 'm': [], 'fitness': [], 'diversity': []}

for gen in range(n_generations):
    # Evaluate fitness
    fitnesses = []
    for g, r, m_val in population:
        f = quick_fitness(g, r, m_val, predation=0.07, n_trials=8)
        fitnesses.append(max(f, 0.01))
    fitnesses = np.array(fitnesses)

    # Record stats
    allocs = np.array(population)
    gen_history['g'].append(np.mean(allocs[:, 0]))
    gen_history['r'].append(np.mean(allocs[:, 1]))
    gen_history['m'].append(np.mean(allocs[:, 2]))
    gen_history['fitness'].append(np.mean(fitnesses))
    gen_history['diversity'].append(np.std(allocs[:, 0]) + np.std(allocs[:, 1]))

    # Selection: fitness-proportional
    probs = fitnesses / fitnesses.sum()
    parent_indices = np.random.choice(pop_size, size=pop_size, replace=True, p=probs)

    # Reproduction with mutation
    new_pop = []
    for idx in parent_indices:
        g, r, m_val = population[idx]
        # Mutate
        g += np.random.randn() * 0.02
        r += np.random.randn() * 0.02
        g = np.clip(g, 0.02, 0.9)
        r = np.clip(r, 0.02, 0.9)
        m_val = 1.0 - g - r
        if m_val < 0.02:
            total = g + r + 0.02; g = g/total; r = r/total; m_val = 0.02
        new_pop.append((g, r, m_val))
    population = new_pop

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Sensitivity to predation
ax = axes[0, 0]
sr = sensitivity_results['predation']
allocs = np.array(sr['allocations'])
ax.plot(sr['values'], allocs[:, 0], 'o-', color='#a855f7', linewidth=2, label='Growth')
ax.plot(sr['values'], allocs[:, 1], 's-', color='#22c55e', linewidth=2, label='Reproduction')
ax.plot(sr['values'], allocs[:, 2], '^-', color='#3b82f6', linewidth=2, label='Maintenance')
ax.set_xlabel('Predation rate', color='white')
ax.set_ylabel('Optimal allocation', color='white')
ax.set_title('Sensitivity: Predation', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Sensitivity to food
ax = axes[0, 1]
sr = sensitivity_results['food']
allocs = np.array(sr['allocations'])
ax.plot(sr['values'], allocs[:, 0], 'o-', color='#a855f7', linewidth=2, label='Growth')
ax.plot(sr['values'], allocs[:, 1], 's-', color='#22c55e', linewidth=2, label='Reproduction')
ax.plot(sr['values'], allocs[:, 2], '^-', color='#3b82f6', linewidth=2, label='Maintenance')
ax.set_xlabel('Food availability', color='white')
ax.set_ylabel('Optimal allocation', color='white')
ax.set_title('Sensitivity: Food', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Fitness vs predation and food
ax = axes[0, 2]
for param_name, color, marker in [('predation', '#ef4444', 'o'), ('food', '#22c55e', 's')]:
    sr = sensitivity_results[param_name]
    ax.plot(sr['values'], sr['fitnesses'], f'{marker}-', color=color, linewidth=2, label=param_name)
ax.set_xlabel('Parameter value', color='white')
ax.set_ylabel('Optimal fitness', color='white')
ax.set_title('Peak Fitness vs Environment', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Evolutionary dynamics — allocation over generations
ax = axes[1, 0]
gens = range(n_generations)
ax.plot(gens, gen_history['g'], color='#a855f7', linewidth=2, label='Growth')
ax.plot(gens, gen_history['r'], color='#22c55e', linewidth=2, label='Reproduction')
ax.plot(gens, gen_history['m'], color='#3b82f6', linewidth=2, label='Maintenance')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean allocation', color='white')
ax.set_title('Evolutionary Dynamics', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Fitness over generations
ax = axes[1, 1]
ax.plot(gens, gen_history['fitness'], color='#f59e0b', linewidth=2, label='Mean fitness')
ax2 = ax.twinx()
ax2.plot(gens, gen_history['diversity'], color='#ef4444', linewidth=1.5, linestyle='--', label='Diversity')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean fitness', color='#f59e0b')
ax2.set_ylabel('Strategy diversity', color='#ef4444')
ax.set_title('Fitness & Diversity Over Time', color='white', fontsize=11)
ax2.tick_params(colors='gray')

# Plot 6: Final evolved population
ax = axes[1, 2]
final_allocs = np.array(population)
x_tern = final_allocs[:, 1] + final_allocs[:, 0] / 2
y_tern = final_allocs[:, 0] * np.sqrt(3) / 2
ax.scatter(x_tern, y_tern, c='#22c55e', s=30, alpha=0.5)
# Mark mean
mean_x = np.mean(x_tern)
mean_y = np.mean(y_tern)
ax.plot(mean_x, mean_y, '*', color='#f59e0b', markersize=15, markeredgecolor='white')
# Simplex outline
corners = np.array([[0, 0], [1, 0], [0.5, np.sqrt(3)/2], [0, 0]])
ax.plot(corners[:, 0], corners[:, 1], color='white', linewidth=1)
ax.text(0.5, np.sqrt(3)/2 + 0.03, 'Growth', ha='center', color='white', fontsize=9)
ax.text(-0.03, -0.03, 'Maint.', ha='center', color='white', fontsize=9)
ax.text(1.03, -0.03, 'Repro.', ha='center', color='white', fontsize=9)
ax.set_title('Evolved Population Distribution', color='white', fontsize=11)
ax.set_aspect('equal')
ax.axis('off')

plt.tight_layout()
plt.show()

final_mean = np.mean(np.array(population), axis=0)
print(f"\\nEvolved optimal strategy (generation {n_generations}):")
print(f"  Growth:       {final_mean[0]:.2f}")
print(f"  Reproduction: {final_mean[1]:.2f}")
print(f"  Maintenance:  {final_mean[2]:.2f}")
print(f"  Mean fitness:  {gen_history['fitness'][-1]:.0f}")
print()
print("The population evolved toward the allocation that maximizes")
print("fitness in this environment — just as real evolution does.")
print("Change the predation rate and the population evolves to a different optimum.")`,
      challenge: 'Add fluctuating environments: alternate between high predation (0.15) and low predation (0.03) every 10 generations. Does the population converge on a bet-hedging generalist strategy, or does it oscillate between hare-like and tortoise-like extremes?',
      successHint: 'You have completed a full capstone: life history simulation, allocation space search, sensitivity analysis, and evolutionary dynamics. You have discovered that the tortoise and hare represent two endpoints of an optimization driven by environmental pressures. This is computational evolutionary biology.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Life History Trade-off Model
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (metabolic science & life history)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone uses Python with numpy and matplotlib to build an evolutionary life history model. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
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
