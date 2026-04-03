import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function DancingDeerLevel2() {
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
      title: 'Population dynamics — growth, carrying capacity, predator-prey',
      concept: `In Level 1 we saw that the sangai population grew from 6 to about 260 over 70 years. But populations don't grow forever — they hit limits. **Population dynamics** is the mathematical study of how and why populations change over time.

The simplest model is **exponential growth**: each generation, the population multiplies by a constant factor. If each pair of sangai produces 2 fawns per year and none die, the population doubles annually. But this never happens in reality — resources run out.

The **logistic growth model** adds a ceiling: the **carrying capacity (K)** — the maximum population the environment can sustain. As population approaches K, growth slows because food, space, and other resources become limiting. The equation is:

dN/dt = rN(1 - N/K)

Where N is population size, r is the intrinsic growth rate, and K is carrying capacity. When N is small, growth is nearly exponential. When N approaches K, growth approaches zero.

For the sangai, K depends on phumdi area and quality. If phumdis degrade, K drops — and the population must shrink to match. This is why habitat restoration directly translates to population recovery.

Things get more complex with **predator-prey dynamics**. The Lotka-Volterra equations model how predator and prey populations oscillate: more prey leads to more predators, which eat the prey down, which starves the predators, which lets prey recover. These cycles repeat indefinitely — or until something breaks the cycle.`,
      analogy: 'Carrying capacity is like the number of seats in a theatre. You can sell tickets (births) as fast as you want, but once every seat is full, new arrivals must wait for someone to leave (deaths). If you add more seats (habitat restoration), more people can attend. If you remove seats (habitat loss), people get squeezed out.',
      storyConnection: 'The sangai\'s dance floor — the phumdis of Loktak Lake — has a fixed capacity. Each square kilometre of healthy phumdi supports a limited number of deer. When the Ithai Barrage thinned the phumdis, it was like shrinking the dance floor mid-performance. The dancers didn\'t just slow down — some fell off the edge.',
      checkQuestion: 'If the sangai\'s carrying capacity is 300 and the current population is 260, is the population still growing? How fast?',
      checkAnswer: 'Yes, but slowly. Using the logistic model with r = 0.05: dN/dt = 0.05 * 260 * (1 - 260/300) = 0.05 * 260 * 0.133 = 1.73. So about 1-2 deer per year. The closer to K, the slower the growth. At K, growth is zero. This explains why the sangai population seems to have plateaued around 260 — it may be near its current carrying capacity.',
      codeIntro: 'Simulate logistic growth and Lotka-Volterra predator-prey dynamics for the Loktak Lake ecosystem.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Part 1: Logistic growth for sangai
dt = 0.1  # time step (years)
years = np.arange(0, 100, dt)
N = np.zeros(len(years))
N[0] = 6  # starting population (1953)

r = 0.08  # intrinsic growth rate
K = 300   # carrying capacity

for i in range(1, len(years)):
    dN = r * N[i-1] * (1 - N[i-1] / K) * dt
    N[i] = N[i-1] + dN

# Part 2: Lotka-Volterra (deer vs. predator — simplified)
prey = np.zeros(len(years))    # sangai-like herbivore
pred = np.zeros(len(years))    # python/eagle-like predator
prey[0] = 200
pred[0] = 10

alpha = 0.1    # prey growth rate
beta = 0.002   # predation rate
gamma = 0.001  # predator growth from prey
delta = 0.1    # predator death rate

for i in range(1, len(years)):
    dp = (alpha * prey[i-1] - beta * prey[i-1] * pred[i-1]) * dt
    dd = (gamma * prey[i-1] * pred[i-1] - delta * pred[i-1]) * dt
    prey[i] = max(prey[i-1] + dp, 0)
    pred[i] = max(pred[i-1] + dd, 0)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Logistic growth curve
axes[0, 0].set_facecolor('#111827')
axes[0, 0].plot(years, N, color='#a855f7', linewidth=2)
axes[0, 0].axhline(K, color='#ef4444', linestyle='--', linewidth=1, label=f'K = {K}')
axes[0, 0].axhline(K/2, color='#f59e0b', linestyle=':', linewidth=1, label=f'K/2 = {K//2} (fastest growth)')
axes[0, 0].set_xlabel('Years', color='white')
axes[0, 0].set_ylabel('Population', color='white')
axes[0, 0].set_title('Sangai Logistic Growth Model', color='white', fontsize=12)
axes[0, 0].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[0, 0].tick_params(colors='gray')

# Growth rate vs population
pop_range = np.linspace(0, K, 100)
growth_rate = r * pop_range * (1 - pop_range / K)
axes[0, 1].set_facecolor('#111827')
axes[0, 1].plot(pop_range, growth_rate, color='#22c55e', linewidth=2)
axes[0, 1].fill_between(pop_range, growth_rate, alpha=0.15, color='#22c55e')
axes[0, 1].axvline(K/2, color='#f59e0b', linestyle=':', linewidth=1)
axes[0, 1].axvline(260, color='#a855f7', linestyle='--', linewidth=1, label='Current pop (~260)')
axes[0, 1].set_xlabel('Population size', color='white')
axes[0, 1].set_ylabel('Growth rate (dN/dt)', color='white')
axes[0, 1].set_title('Growth Rate vs. Population Size', color='white', fontsize=12)
axes[0, 1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[0, 1].tick_params(colors='gray')

# Predator-prey time series
axes[1, 0].set_facecolor('#111827')
axes[1, 0].plot(years, prey, color='#22c55e', linewidth=2, label='Prey (herbivore)')
axes[1, 0].plot(years, pred, color='#ef4444', linewidth=2, label='Predator')
axes[1, 0].set_xlabel('Years', color='white')
axes[1, 0].set_ylabel('Population', color='white')
axes[1, 0].set_title('Lotka-Volterra Predator-Prey Cycles', color='white', fontsize=12)
axes[1, 0].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[1, 0].tick_params(colors='gray')

# Phase plot (prey vs predator)
axes[1, 1].set_facecolor('#111827')
axes[1, 1].plot(prey, pred, color='#3b82f6', linewidth=1, alpha=0.7)
axes[1, 1].plot(prey[0], pred[0], 'o', color='#22c55e', markersize=10, label='Start')
axes[1, 1].set_xlabel('Prey population', color='white')
axes[1, 1].set_ylabel('Predator population', color='white')
axes[1, 1].set_title('Phase Plot (cycles visible as loops)', color='white', fontsize=12)
axes[1, 1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[1, 1].tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Logistic growth key insight:")
print(f"  Maximum growth rate occurs at K/2 = {K//2} deer")
print(f"  At current pop (~260), growth is very slow: ~{r * 260 * (1 - 260/K):.1f} deer/year")
print()
print("Predator-prey cycles:")
print("  Prey rises → predators rise → prey crashes → predators crash → repeat")
print("  These oscillations are a fundamental feature of ecological systems.")`,
      challenge: 'What happens if carrying capacity drops from 300 to 200 (habitat degradation)? Simulate logistic growth starting from 260. The population must DECLINE to reach the new K. How long does it take?',
      successHint: 'Population dynamics is the mathematical backbone of conservation biology. Every decision about the sangai — how much habitat to protect, whether to cull invasive species, when to intervene — is ultimately a question about these equations.',
    },
    {
      title: 'Species diversity indices — Shannon index, Simpson index',
      concept: `In Level 1 we introduced biodiversity as richness plus evenness. Now we formalize this with mathematical indices that ecologists use worldwide.

**Shannon Diversity Index (H')**:
H' = -sum(p_i * ln(p_i)) for all species i

Where p_i is the proportion of individuals belonging to species i. Higher H' means more diversity. A community with one species has H' = 0. A community with many equally abundant species has high H'.

**Simpson's Diversity Index (1-D)**:
D = sum(p_i²), and diversity = 1 - D

D is the probability that two randomly chosen individuals belong to the same species. So 1-D is the probability they're different. Higher 1-D means more diversity.

**Why two indices?** They weight things differently:
- Shannon is more sensitive to **rare species** (because ln is steep near zero)
- Simpson is more sensitive to **dominant species** (because squaring amplifies large proportions)

This matters for conservation: if you care about rare species (like the sangai), Shannon is more informative. If you care about community structure, Simpson may be better.

**Evenness (J)** can be derived from Shannon:
J = H' / H'_max = H' / ln(S) where S is species richness

J ranges from 0 (one species dominates) to 1 (perfectly even). A degraded Loktak Lake section might have J = 0.3 (water hyacinth dominates). A healthy section might have J = 0.85.`,
      analogy: 'Imagine a music festival with 10 stages. Shannon index measures whether all stages have roughly equal audiences (diverse festival) or everyone crowds one stage (boring festival). Simpson measures the chance that two random festival-goers are watching different acts. Both capture "diversity" but from different angles.',
      storyConnection: 'The sangai depends on a diverse phumdi plant community — multiple grass and sedge species that provide different nutrients across different seasons. If one species dominates (like water hyacinth), the sangai\'s diet narrows, nutritional stress increases, and the population suffers. Diversity indices are the thermometer that measures ecosystem health around the sangai\'s home.',
      checkQuestion: 'Two wetlands each have 5 species. Wetland A has abundances [100, 100, 100, 100, 100]. Wetland B has [496, 1, 1, 1, 1]. Without calculating, which has higher Shannon and Simpson indices?',
      checkAnswer: 'Wetland A has higher values for both indices. In A, species are perfectly even (J = 1.0), so both Shannon and Simpson are at maximum for 5 species. In B, one species dominates (99.2%), so both indices are near minimum. Shannon for A: -5*(0.2*ln(0.2)) = 1.609. Shannon for B: approximately 0.056. Simpson (1-D) for A: 1 - 5*(0.04) = 0.80. Simpson for B: 1 - (0.992² + 4*0.002²) ≈ 0.016.',
      codeIntro: 'Calculate Shannon and Simpson indices for different community structures and visualize how they respond to dominance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def shannon(abundances):
    total = sum(abundances)
    props = [n / total for n in abundances if n > 0]
    return -sum(p * np.log(p) for p in props)

def simpson(abundances):
    total = sum(abundances)
    return 1 - sum((n / total) ** 2 for n in abundances)

def evenness(abundances):
    h = shannon(abundances)
    s = sum(1 for a in abundances if a > 0)
    return h / np.log(s) if s > 1 else 0

# Loktak Lake survey data (hypothetical transects)
transects = {
    'Pristine phumdi': [45, 40, 38, 35, 30, 28, 25, 22, 18, 15],
    'Moderate degradation': [120, 30, 20, 15, 10, 8, 5, 3, 2, 1],
    'Hyacinth-dominated': [350, 15, 8, 5, 3, 2, 1, 1, 0, 0],
    'Heavily polluted': [480, 10, 5, 3, 2, 0, 0, 0, 0, 0],
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Rank-abundance curves
ax = axes[0, 0]
ax.set_facecolor('#111827')
colors_t = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
for (name, abund), color in zip(transects.items(), colors_t):
    sorted_a = sorted([a for a in abund if a > 0], reverse=True)
    ranks = range(1, len(sorted_a) + 1)
    ax.semilogy(ranks, sorted_a, 'o-', color=color, linewidth=2, label=name, markersize=5)

ax.set_xlabel('Species rank', color='white')
ax.set_ylabel('Abundance (log scale)', color='white')
ax.set_title('Rank-Abundance Curves', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Diversity indices comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
names = list(transects.keys())
h_vals = [shannon(a) for a in transects.values()]
s_vals = [simpson(a) for a in transects.values()]
e_vals = [evenness(a) for a in transects.values()]

x = np.arange(len(names))
width = 0.25
ax.bar(x - width, h_vals, width, label="Shannon (H')", color='#3b82f6', alpha=0.8)
ax.bar(x, s_vals, width, label='Simpson (1-D)', color='#22c55e', alpha=0.8)
ax.bar(x + width, e_vals, width, label='Evenness (J)', color='#f59e0b', alpha=0.8)

ax.set_xticks(x)
ax.set_xticklabels(['Pristine', 'Moderate', 'Hyacinth', 'Polluted'], color='white', fontsize=9)
ax.set_ylabel('Index value', color='white')
ax.set_title('Diversity Indices Across Degradation', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# How dominance affects Shannon
ax = axes[1, 0]
ax.set_facecolor('#111827')
dominance = np.linspace(0.1, 0.99, 50)  # proportion of dominant species
# 10 species, dominant takes fraction d, rest split equally
h_by_dom = []
for d in dominance:
    remaining = (1 - d) / 9
    abund = [d] + [remaining] * 9
    h_by_dom.append(-sum(p * np.log(p) for p in abund if p > 0))

ax.plot(dominance * 100, h_by_dom, color='#3b82f6', linewidth=2)
ax.fill_between(dominance * 100, h_by_dom, alpha=0.15, color='#3b82f6')
ax.set_xlabel('Dominant species (% of community)', color='white')
ax.set_ylabel("Shannon index (H')", color='white')
ax.set_title('Shannon Index vs. Dominance (10 species)', color='white', fontsize=12)
ax.tick_params(colors='gray')
ax.axvline(50, color='#f59e0b', linestyle=':', alpha=0.5)
ax.text(52, max(h_by_dom) * 0.9, '50% dominance', color='#f59e0b', fontsize=9)

# Richness vs Shannon
ax = axes[1, 1]
ax.set_facecolor('#111827')
richness = np.arange(2, 51)
max_shannon = np.log(richness)  # maximum Shannon for S species
ax.plot(richness, max_shannon, color='#22c55e', linewidth=2, label='Max H\\ (perfect evenness)')
ax.fill_between(richness, max_shannon, alpha=0.15, color='#22c55e')
ax.set_xlabel('Species richness (S)', color='white')
ax.set_ylabel("Maximum Shannon (H'_max = ln S)", color='white')
ax.set_title('Max Diversity Increases with Richness', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Results across Loktak Lake transects:")
for name, h, s, e in zip(names, h_vals, s_vals, e_vals):
    rich = sum(1 for a in transects[name] if a > 0)
    print(f"  {name}: richness={rich}, H'={h:.3f}, 1-D={s:.3f}, J={e:.3f}")
print()
print("As degradation increases: richness drops, evenness drops, both indices drop.")
print("The rank-abundance curve gets steeper — one species dominates.")`,
      challenge: 'Create a "restoration scenario" where water hyacinth is removed and native species recover partially. Design your own abundance vector and calculate all three indices. How much recovery is needed to reach "moderate" levels?',
      successHint: 'Diversity indices are the vital signs of ecosystems. Ecologists track them over time to detect degradation early — before species go locally extinct. A dropping Shannon index at Loktak Lake is an early warning that the sangai\'s support system is weakening.',
    },
    {
      title: 'Population viability analysis — will the sangai survive?',
      concept: `Conservation biologists don't just count animals — they model their future. **Population Viability Analysis (PVA)** uses mathematical simulations to estimate the probability that a population will survive for a given period (usually 100 years).

A PVA for the sangai considers:
- **Demographic stochasticity**: random variation in births and deaths. With 260 deer, a few bad years of low fawn survival can cascade. In a population of 10,000, random fluctuations average out.
- **Environmental stochasticity**: unpredictable events — droughts, floods, disease outbreaks. Loktak Lake's monsoon variability makes this a major factor.
- **Catastrophes**: rare but devastating events — a fire on the phumdis, an epidemic. The probability is low in any given year, but over 100 years, it becomes significant.
- **Genetic deterioration**: in small populations, inbreeding reduces fitness. The sangai's founding population of 6 individuals means genetic diversity is already critically low.
- **Allee effects**: when populations get very small, finding mates becomes harder, group defense weakens, and per-capita survival drops. Below a certain threshold, decline becomes self-reinforcing.

The output of a PVA is a **probability of extinction** over time. For the sangai, most models estimate a 20-40% chance of extinction within 100 years under current conditions. With habitat restoration, this drops to 5-10%. With a second population, it drops below 1%.

The **minimum viable population (MVP)** is the smallest population with a 95% probability of surviving 100 years. For most large mammals, MVP is 500-5000 individuals. The sangai is well below this.`,
      analogy: 'PVA is like a financial stress test for a bank. You model what happens under normal conditions, recessions, and crises. A bank that survives all scenarios is "viable." A bank that fails in 30% of scenarios needs more capital. The sangai\'s "bank" needs more "capital" — more individuals, more habitat, more genetic diversity.',
      storyConnection: 'Will the sangai still dance on Loktak Lake in 100 years? PVA answers this with probabilities, not guesses. Every simulation run is a possible future for the sangai — some futures include extinction, others include recovery. The balance between those futures depends on the conservation decisions we make today.',
      checkQuestion: 'Why is a population of 260 sangai at much higher extinction risk than a population of 2600 sangai, even if both have the same birth and death rates?',
      checkAnswer: 'Three reasons: (1) Demographic stochasticity — random fluctuations have a larger proportional impact on small populations. A 10% random drop is 26 deer vs. 260 deer. (2) Catastrophes hit a larger fraction of the population. (3) Genetic diversity is lower, so disease resistance is weaker. Small populations are like small boats — the same wave that a cruise ship barely notices can capsize them.',
      codeIntro: 'Run a Monte Carlo PVA simulation for the sangai population under different scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def run_pva(initial_pop, K, r_mean, r_std, catastrophe_prob, catastrophe_severity,
            years=100, n_simulations=500):
    """Run Monte Carlo PVA simulations."""
    results = np.zeros((n_simulations, years))
    extinct_year = []

    for sim in range(n_simulations):
        pop = initial_pop
        for yr in range(years):
            # Environmental stochasticity
            r = np.random.normal(r_mean, r_std)
            # Logistic growth
            growth = r * pop * (1 - pop / K)
            # Demographic stochasticity (larger effect at small pop)
            growth += np.random.normal(0, np.sqrt(abs(growth) + 1))
            # Catastrophe
            if np.random.random() < catastrophe_prob:
                pop *= (1 - catastrophe_severity)
            # Allee effect (below 30, reproduction drops)
            if pop < 30:
                growth *= (pop / 30)

            pop = max(pop + growth, 0)
            results[sim, yr] = pop

            if pop < 2:  # functionally extinct
                results[sim, yr:] = 0
                extinct_year.append(yr)
                break

    extinction_prob = len(extinct_year) / n_simulations
    return results, extinction_prob, extinct_year

# Scenario 1: Current conditions
res1, ext1, _ = run_pva(260, 300, 0.04, 0.03, 0.03, 0.3)

# Scenario 2: Habitat restoration (higher K)
res2, ext2, _ = run_pva(260, 600, 0.05, 0.03, 0.02, 0.25)

# Scenario 3: Full conservation (high K, low threats)
res3, ext3, _ = run_pva(260, 1000, 0.06, 0.02, 0.01, 0.2)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
years_arr = np.arange(100)

# Simulation trajectories — current
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i in range(min(50, len(res1))):
    alpha = 0.1 if res1[i, -1] > 0 else 0.3
    color = '#a855f7' if res1[i, -1] > 0 else '#ef4444'
    ax.plot(years_arr, res1[i], color=color, alpha=alpha, linewidth=0.5)
ax.plot(years_arr, np.median(res1, axis=0), color='white', linewidth=2, label='Median')
ax.set_title(f'Current conditions (P(extinct)={ext1:.1%})', color='white', fontsize=11)
ax.set_ylabel('Population', color='white')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Simulation trajectories — restored
ax = axes[0, 1]
ax.set_facecolor('#111827')
for i in range(min(50, len(res2))):
    alpha = 0.1 if res2[i, -1] > 0 else 0.3
    color = '#3b82f6' if res2[i, -1] > 0 else '#ef4444'
    ax.plot(years_arr, res2[i], color=color, alpha=alpha, linewidth=0.5)
ax.plot(years_arr, np.median(res2, axis=0), color='white', linewidth=2, label='Median')
ax.set_title(f'Habitat restoration (P(extinct)={ext2:.1%})', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Extinction probability over time
ax = axes[1, 0]
ax.set_facecolor('#111827')
for res, label, color in [(res1, 'Current', '#ef4444'), (res2, 'Restored', '#f59e0b'), (res3, 'Full conservation', '#22c55e')]:
    cumulative_ext = np.mean(res == 0, axis=0) * 100
    ax.plot(years_arr, cumulative_ext, color=color, linewidth=2, label=label)

ax.set_xlabel('Years', color='white')
ax.set_ylabel('Cumulative extinction probability (%)', color='white')
ax.set_title('Extinction Risk Over Time', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.axhline(5, color='gray', linestyle=':', alpha=0.5)
ax.text(2, 6, '5% threshold (MVP standard)', color='gray', fontsize=8)

# Final population distributions
ax = axes[1, 1]
ax.set_facecolor('#111827')
for res, label, color in [(res1, 'Current', '#ef4444'), (res2, 'Restored', '#f59e0b'), (res3, 'Full conservation', '#22c55e')]:
    final = res[:, -1]
    final_alive = final[final > 0]
    if len(final_alive) > 0:
        ax.hist(final_alive, bins=30, alpha=0.5, color=color, label=f'{label} (survivors)', edgecolor='none')

ax.set_xlabel('Population at year 100', color='white')
ax.set_ylabel('Count (simulations)', color='white')
ax.set_title('Final Population Distribution', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Population Viability Analysis (500 simulations each):")
print(f"  Current conditions:  {ext1:.1%} extinction in 100 years")
print(f"  Habitat restoration: {ext2:.1%} extinction in 100 years")
print(f"  Full conservation:   {ext3:.1%} extinction in 100 years")
print()
print("For 95% survival (MVP standard), the sangai needs full conservation.")
print("Half-measures may reduce risk but don't eliminate it.")`,
      challenge: 'Add a "two populations" scenario: run two independent PVAs with 130 deer each (splitting the population). The species is extinct only if BOTH populations go extinct. What\'s the combined extinction probability?',
      successHint: 'PVA turns conservation from guesswork into science. It tells you exactly how much effort is needed and where to focus it. For the sangai, the message is clear: current conditions are not enough.',
    },
    {
      title: 'Habitat mapping — analyzing land use change over time',
      concept: `To save the sangai, we need to know exactly what's happening to its habitat. **Habitat mapping** uses satellite imagery to classify land into categories — open water, phumdi, agriculture, settlement, forest — and track how those categories change over time.

Loktak Lake's landscape has changed dramatically since the 1970s:
- Open phumdi area has decreased as they thin and fragment
- Agricultural encroachment has increased around the lake margins
- Water hyacinth coverage has expanded
- Settlements have grown into previously wild areas
- The Ithai Barrage created a permanent reservoir, flooding seasonal wetlands

Scientists use **remote sensing** to map these changes:
1. Acquire satellite images from different years (Landsat, Sentinel-2)
2. Classify each pixel into a land use category based on spectral signatures
3. Compare classifications across time to identify changes
4. Quantify rates of habitat loss or recovery

**Transition matrices** describe the probability that land in category A at time 1 becomes category B at time 2. For example: "What fraction of phumdi in 1990 had become open water by 2020?" These matrices can predict future land use if trends continue.

For the sangai, the critical metric is: **how much high-quality phumdi remains?** If phumdi area drops below a threshold, the carrying capacity drops below the minimum viable population, and extinction becomes inevitable regardless of other conservation efforts.`,
      analogy: 'Habitat mapping is like a time-lapse of your neighbourhood on Google Maps. You can see exactly which forests became parking lots, which farms became housing estates, which wetlands became golf courses. Satellite imagery gives ecologists the same power — except the "neighbourhood" is a whole ecosystem and the stakes are species survival.',
      storyConnection: 'The sangai\'s dance floor is shrinking and we can see it from space. Satellite images from the 1970s show thick, continuous phumdis across Loktak Lake. Recent images show fragmented, thinning islands surrounded by open water and water hyacinth. Each pixel that changes from "phumdi" to "open water" is a piece of the dance floor disappearing.',
      checkQuestion: 'If satellite analysis shows phumdi area decreased by 40% between 1990 and 2020, and the sangai population stayed roughly stable, what does that suggest about the relationship between habitat and population?',
      checkAnswer: 'It suggests the population was already near or at the reduced carrying capacity — or that the deer concentrated into remaining good habitat. It also means the population is now much more vulnerable: there\'s no buffer habitat left. A further 10% loss could trigger rapid decline because the population has no room to redistribute. The stable population number masks a dangerous underlying trend.',
      codeIntro: 'Simulate land use change at Loktak Lake from 1980 to 2020 and project to 2050.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Land use categories and their areas (km²) over time
years = [1980, 1990, 2000, 2010, 2020]
categories = ['Thick phumdi', 'Thin phumdi', 'Open water', 'Water hyacinth',
              'Agriculture', 'Settlement']

# Area data (km² — total lake area ~287 km²)
data = {
    'Thick phumdi':    [120,  95,  70,  50,  35],
    'Thin phumdi':     [60,   70,  65,  55,  45],
    'Open water':      [80,   85,  95,  105, 110],
    'Water hyacinth':  [2,    8,   22,  38,  52],
    'Agriculture':     [20,   22,  27,  30,  34],
    'Settlement':      [5,    7,   8,   9,   11],
}

# Project to 2050 using linear trends
years_proj = [2030, 2040, 2050]
data_proj = {}
for cat, vals in data.items():
    # Linear trend from last 20 years
    slope = (vals[-1] - vals[-3]) / 20
    projected = [max(vals[-1] + slope * (y - 2020), 0) for y in years_proj]
    data_proj[cat] = vals + projected

all_years = years + years_proj

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Stacked area chart
ax = axes[0, 0]
ax.set_facecolor('#111827')
colors_c = ['#22c55e', '#86efac', '#3b82f6', '#ef4444', '#f59e0b', '#a855f7']
y_stack = np.zeros(len(all_years))
for (cat, vals), color in zip(data_proj.items(), colors_c):
    ax.fill_between(all_years, y_stack, y_stack + np.array(vals), alpha=0.7,
                    color=color, label=cat)
    y_stack += np.array(vals)

ax.axvline(2020, color='white', linestyle='--', alpha=0.5)
ax.text(2021, 250, 'Projection →', color='white', fontsize=9)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Area (km²)', color='white')
ax.set_title('Loktak Lake Land Use Change', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8,
          loc='upper right')
ax.tick_params(colors='gray')

# Sangai habitat (thick + thin phumdi)
ax = axes[0, 1]
ax.set_facecolor('#111827')
habitat = [data_proj['Thick phumdi'][i] + data_proj['Thin phumdi'][i]
           for i in range(len(all_years))]
ax.plot(all_years[:5], habitat[:5], 'o-', color='#22c55e', linewidth=2, label='Observed')
ax.plot(all_years[4:], habitat[4:], 'o--', color='#ef4444', linewidth=2, label='Projected')
ax.fill_between(all_years, habitat, alpha=0.15, color='#22c55e')

# Critical threshold
ax.axhline(50, color='#ef4444', linestyle=':', linewidth=1)
ax.text(1982, 53, 'Critical threshold (~50 km²)', color='#ef4444', fontsize=9)

ax.set_xlabel('Year', color='white')
ax.set_ylabel('Total phumdi area (km²)', color='white')
ax.set_title('Sangai Habitat Trend', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Transition matrix (1980→2020 as percentages)
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Simplified transition matrix: what did each 1980 category become by 2020?
transitions = np.array([
    [0.25, 0.30, 0.20, 0.20, 0.04, 0.01],  # thick phumdi → ...
    [0.05, 0.35, 0.25, 0.25, 0.08, 0.02],  # thin phumdi → ...
    [0.00, 0.05, 0.70, 0.20, 0.03, 0.02],  # open water → ...
    [0.00, 0.00, 0.10, 0.85, 0.03, 0.02],  # hyacinth → ...
    [0.00, 0.00, 0.05, 0.05, 0.80, 0.10],  # agriculture → ...
    [0.00, 0.00, 0.00, 0.00, 0.10, 0.90],  # settlement → ...
])
short_names = ['Thick\nphumdi', 'Thin\nphumdi', 'Open\nwater', 'Hyacinth', 'Agri', 'Settle']

im = ax.imshow(transitions, cmap='YlOrRd', vmin=0, vmax=1, aspect='auto')
ax.set_xticks(range(6))
ax.set_yticks(range(6))
ax.set_xticklabels(short_names, color='white', fontsize=8)
ax.set_yticklabels(short_names, color='white', fontsize=8)
ax.set_xlabel('To (2020)', color='white')
ax.set_ylabel('From (1980)', color='white')
ax.set_title('Land Use Transition Matrix', color='white', fontsize=12)

for i in range(6):
    for j in range(6):
        ax.text(j, i, f'{transitions[i,j]:.0%}', ha='center', va='center',
                color='white' if transitions[i,j] > 0.5 else 'black', fontsize=8)

# Rate of change
ax = axes[1, 1]
ax.set_facecolor('#111827')
change_rates = {cat: (vals[-1] - vals[0]) / (all_years[-1] - all_years[0])
                for cat, vals in data_proj.items()}
colors_bar = ['#22c55e' if v < 0 else '#ef4444' for v in change_rates.values()]
bars = ax.barh(list(change_rates.keys()), list(change_rates.values()),
               color=colors_bar, alpha=0.8)
ax.axvline(0, color='gray', linewidth=0.5)
ax.set_xlabel('Rate of change (km²/year)', color='white')
ax.set_title('Annual Rate of Land Use Change', color='white', fontsize=12)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key findings:")
print(f"  Total phumdi 1980: {habitat[0]:.0f} km²")
print(f"  Total phumdi 2020: {habitat[4]:.0f} km²")
print(f"  Loss: {habitat[0] - habitat[4]:.0f} km² ({(1 - habitat[4]/habitat[0])*100:.0f}% decline)")
print(f"  Projected 2050: {habitat[-1]:.0f} km²")
print()
print("If trends continue, sangai habitat will cross the critical")
print("threshold around 2040-2050. Action is needed NOW.")`,
      challenge: 'What if habitat restoration reverses the thick phumdi trend starting in 2025 (1 km² recovered per year)? Modify the projection and see when total phumdi area stabilizes.',
      successHint: 'Satellite-based habitat mapping turns abstract conservation goals into measurable targets: "restore 20 km² of thick phumdi by 2035" is actionable; "save the sangai" is not. Data-driven conservation is effective conservation.',
    },
    {
      title: 'Conservation economics — cost-benefit of protection',
      concept: `Conservation costs money. Maintaining Keibul Lamjao National Park, paying rangers, removing water hyacinth, running breeding programs, compensating fishers — it all has a price tag. **Conservation economics** asks: is it worth it? And how do we allocate limited funds most effectively?

The costs of sangai conservation include:
- **Park management**: ranger salaries, patrol boats, infrastructure — ~$200,000/year
- **Habitat restoration**: phumdi management, water hyacinth removal — ~$500,000/year
- **Research and monitoring**: population surveys, satellite tracking — ~$150,000/year
- **Community programs**: eco-tourism development, fishing compensation — ~$300,000/year
- **Captive breeding**: facility construction, veterinary care — ~$1,000,000 setup + $200,000/year

The benefits are harder to quantify:
- **Ecosystem services**: water filtration, flood control, carbon storage from the wetland — estimated at $25,000/hectare/year for Loktak Lake
- **Tourism**: a unique national park draws visitors — but currently underdeveloped
- **Existence value**: people value knowing the sangai exists, even if they never see it
- **Insurance value**: biodiversity provides options for the future (medicines, genetic resources)
- **Cultural value**: the sangai is Manipur's state animal and cultural symbol

**Cost-effectiveness analysis** compares different conservation actions per unit of outcome. Spending $500,000 on habitat restoration might save more sangai per dollar than $500,000 on captive breeding. But captive breeding provides insurance that restoration cannot. The optimal strategy uses both — but in what proportion?`,
      analogy: 'Conservation economics is like household budgeting with a twist: some of your "purchases" don\'t have price tags. You know the rent ($200K for park management), but how much is "peace of mind that a species exists" worth? Economists try to put numbers on these intangibles — and it\'s always controversial, always imperfect, and always necessary.',
      storyConnection: 'The sangai\'s dance has an economic dimension: every conservation dollar spent keeps the dance going. But dollars are limited. Should Manipur spend more on anti-poaching patrols or water hyacinth removal? On ranger salaries or eco-tourism marketing? The answer isn\'t obvious — it requires analysis, not intuition.',
      checkQuestion: 'If Loktak Lake provides $25,000/hectare/year in ecosystem services and covers 28,700 hectares, what\'s the total annual value? How does this compare to the annual conservation budget of ~$1.15 million?',
      checkAnswer: '$25,000 * 28,700 = $717.5 million per year in ecosystem services. The conservation budget is ~$1.15 million — that\'s 0.16% of the value it protects. From a pure economic standpoint, spending $1.15M to protect $717.5M is an extraordinary return on investment. The lake\'s ecosystem services are 624 times more valuable than the cost of protecting them.',
      codeIntro: 'Model cost-effectiveness of different conservation strategies and optimize budget allocation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Conservation strategies with costs and effectiveness
strategies = {
    'Anti-poaching patrols': {
        'annual_cost': 200000,
        'deer_saved_per_year': 8,
        'habitat_km2_protected': 5,
        'certainty': 0.8,
    },
    'Habitat restoration': {
        'annual_cost': 500000,
        'deer_saved_per_year': 15,
        'habitat_km2_protected': 20,
        'certainty': 0.6,
    },
    'Water hyacinth removal': {
        'annual_cost': 300000,
        'deer_saved_per_year': 10,
        'habitat_km2_protected': 15,
        'certainty': 0.5,
    },
    'Community eco-tourism': {
        'annual_cost': 300000,
        'deer_saved_per_year': 5,
        'habitat_km2_protected': 10,
        'certainty': 0.7,
    },
    'Captive breeding': {
        'annual_cost': 400000,
        'deer_saved_per_year': 12,
        'habitat_km2_protected': 0,
        'certainty': 0.9,
    },
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Cost per deer saved
ax = axes[0, 0]
ax.set_facecolor('#111827')
names = list(strategies.keys())
cost_per_deer = [s['annual_cost'] / s['deer_saved_per_year'] for s in strategies.values()]
colors_e = ['#22c55e', '#3b82f6', '#06b6d4', '#f59e0b', '#a855f7']
bars = ax.barh(names, cost_per_deer, color=colors_e, alpha=0.8)
ax.set_xlabel('Cost per deer saved ($/deer/year)', color='white')
ax.set_title('Cost-Effectiveness: Cost per Deer Saved', color='white', fontsize=12)
ax.tick_params(colors='gray')
for bar, cost in zip(bars, cost_per_deer):
    ax.text(bar.get_width() + 500, bar.get_y() + bar.get_height()/2,
            f'{cost:,.0f}', color='white', va='center', fontsize=9)

# Budget allocation optimization
ax = axes[0, 1]
ax.set_facecolor('#111827')
total_budget = 1500000  # $1.5M total
# Try different allocation weights
n_allocations = 1000
best_deer = 0
best_alloc = None
all_deer = []
all_cost = []

for _ in range(n_allocations):
    # Random allocation
    weights = np.random.dirichlet(np.ones(5))
    alloc = weights * total_budget
    total_deer = sum(
        alloc[i] / s['annual_cost'] * s['deer_saved_per_year'] * s['certainty']
        for i, s in enumerate(strategies.values())
    )
    all_deer.append(total_deer)
    if total_deer > best_deer:
        best_deer = total_deer
        best_alloc = dict(zip(names, alloc))

ax.hist(all_deer, bins=40, color='#3b82f6', alpha=0.7, edgecolor='none')
ax.axvline(best_deer, color='#22c55e', linestyle='--', linewidth=2,
           label=f'Best: {best_deer:.1f} deer')
ax.axvline(np.mean(all_deer), color='#f59e0b', linestyle='--', linewidth=2,
           label=f'Mean: {np.mean(all_deer):.1f} deer')
ax.set_xlabel('Total deer saved per year', color='white')
ax.set_ylabel('Count (allocations)', color='white')
ax.set_title(f'Budget Optimization ({total_budget/1e6:.1f}M budget)', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Best allocation pie chart
ax = axes[1, 0]
ax.set_facecolor('#111827')
best_vals = list(best_alloc.values())
best_labels = [f'{n}\n{v/1e6:.2f}M' for n, v in best_alloc.items()]
ax.pie(best_vals, labels=best_labels, colors=colors_e, autopct='%1.0f%%',
       textprops={'color': 'white', 'fontsize': 8})
ax.set_title(f'Optimal Budget Allocation\n({best_deer:.0f} deer saved/year)',
             color='white', fontsize=12)

# Return on investment over time
ax = axes[1, 1]
ax.set_facecolor('#111827')
years_t = np.arange(0, 21)
cumulative_cost = total_budget * years_t
# Ecosystem services preserved (growing as habitat improves)
ecosystem_value_per_year = 717.5e6  # total Loktak Lake value
fraction_preserved = 0.8 + 0.01 * years_t  # conservation improves fraction
cumulative_benefit = np.cumsum(ecosystem_value_per_year * fraction_preserved * 0.01)

ax.plot(years_t, cumulative_cost / 1e6, 'o-', color='#ef4444', linewidth=2,
        label='Cumulative cost', markersize=4)
ax.plot(years_t, cumulative_benefit / 1e6, 'o-', color='#22c55e', linewidth=2,
        label='Ecosystem value preserved', markersize=4)
ax.fill_between(years_t, cumulative_cost / 1e6, cumulative_benefit / 1e6,
                alpha=0.15, color='#22c55e')
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Cumulative value ($M)', color='white')
ax.set_title('Return on Conservation Investment', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Cost-effectiveness ranking (cost per deer saved):")
for name, cpd in sorted(zip(names, cost_per_deer), key=lambda x: x[1]):
    print(f"  {name}: {cpd:,.0f}/deer/year")
print()
print(f"Optimal budget allocation ({best_deer:.0f} deer saved/year):")
for name, val in best_alloc.items():
    print(f"  {name}: \{val:,.0f} ({val/total_budget*100:.0f}%)")
print()
print(f"Conservation ROI: spend 1.5M/year to protect 717M/year in services.")
print("That's a 478:1 return. No stock market comes close.")`,
      challenge: 'What if the budget is cut to $750,000 (half)? Re-run the optimization. Which strategies get cut first? Which are always funded?',
      successHint: 'Conservation economics isn\'t about putting a price on nature — it\'s about making the strongest possible case for protection using the language decision-makers understand: money. When you can show a 478:1 return on investment, the argument becomes very hard to ignore.',
    },
    {
      title: 'Citizen science — how anyone can contribute to conservation data',
      concept: `Professional ecologists can't be everywhere at once. Loktak Lake covers 287 km² and the surrounding landscape is even larger. Monitoring every corner requires more eyes than any research team has. This is where **citizen science** comes in — ordinary people contributing data to scientific research.

Citizen science for the sangai and Loktak Lake could include:
- **Wildlife sightings**: locals reporting where and when they see sangai, birds, or other species
- **Water quality monitoring**: fishers measuring temperature, turbidity, and pH with simple kits
- **Phumdi condition reports**: regular photos of phumdi thickness and vegetation health
- **Invasive species tracking**: mapping water hyacinth spread using phone GPS
- **Weather observations**: rainfall, flooding, and seasonal changes

The power of citizen science is **scale**. One scientist can survey 5 transects per week. A thousand citizen scientists can survey 5,000. But the data must be **quality-controlled**:
- Training: participants need to know what to observe and how to record it
- Standardization: everyone uses the same protocol (time, location, method)
- Validation: expert review of a sample of reports
- Bias correction: volunteers may over-sample accessible areas and under-sample remote ones

**eBird**, **iNaturalist**, and **Galaxy Zoo** are successful citizen science platforms. A "Loktak Watch" app could let anyone around the lake contribute to sangai conservation — turning 200,000 local residents from potential threats into data collectors and conservation partners.

The data citizen scientists collect feeds into the models we've built in this course: population dynamics, habitat mapping, diversity indices, PVA. More data means better models. Better models mean smarter conservation decisions.`,
      analogy: 'Citizen science is like Waze for conservation. Waze works because millions of drivers share real-time traffic data — no single company could deploy sensors on every road. Similarly, no research team can monitor every hectare of Loktak Lake. But if the people who live there share what they see, the "traffic map" of ecological health becomes detailed enough to act on.',
      storyConnection: 'The sangai\'s dance happens on remote phumdis that researchers can\'t visit daily. But fishers, farmers, and boaters pass by constantly. If they report what they see — a deer feeding, a phumdi thinning, water hyacinth spreading — the sangai gains thousands of guardians instead of a handful. The story of the Dancing Deer becomes a story told by an entire community.',
      checkQuestion: 'A citizen science project collects 10,000 sangai sightings in a year. But 80% come from one popular viewing spot near the park entrance. What\'s the problem, and how would you fix it?',
      checkAnswer: 'Spatial bias: the data over-represents the entrance area and under-represents the rest of the habitat. The sangai distribution map would look like all deer live near the entrance — which is false. Fixes: (1) Divide the lake into grid squares and assign volunteers to each; (2) Weight sightings inversely by effort (more observers in a square = lower weight per sighting); (3) Use statistical models that correct for uneven sampling effort; (4) Actively recruit volunteers from remote communities.',
      codeIntro: 'Simulate a citizen science data collection campaign and analyze spatial bias and sampling effort.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate Loktak Lake as a 20x20 grid
grid_size = 20
lake_area = np.zeros((grid_size, grid_size))

# True sangai distribution (concentrated in core phumdi areas)
true_density = np.zeros((grid_size, grid_size))
# Core habitat (center-right area)
for i in range(grid_size):
    for j in range(grid_size):
        dist_core = np.sqrt((i - 10)**2 + (j - 12)**2)
        if dist_core < 8:
            true_density[i, j] = max(0, 10 - dist_core) * np.random.uniform(0.5, 1.5)

# Observer effort (biased toward park entrance at bottom-left)
observer_effort = np.zeros((grid_size, grid_size))
for i in range(grid_size):
    for j in range(grid_size):
        dist_entrance = np.sqrt((i - 18)**2 + (j - 2)**2)
        observer_effort[i, j] = max(0, 50 - 2.5 * dist_entrance) + np.random.uniform(0, 5)

# Observed sightings = true density * detection probability (based on effort)
detection_prob = observer_effort / (observer_effort + 10)
observed = np.random.poisson(true_density * detection_prob)

# Corrected estimate (accounting for effort)
corrected = np.where(observer_effort > 1,
                     observed / (detection_prob + 0.01),
                     np.nan)

fig, axes = plt.subplots(2, 2, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')

# True distribution
ax = axes[0, 0]
im1 = ax.imshow(true_density, cmap='Greens', origin='lower')
ax.set_title('True Sangai Distribution', color='white', fontsize=12)
ax.set_xlabel('West ← → East', color='white')
ax.set_ylabel('South ← → North', color='white')
ax.tick_params(colors='gray')
plt.colorbar(im1, ax=ax, label='Deer density')

# Observer effort
ax = axes[0, 1]
im2 = ax.imshow(observer_effort, cmap='Blues', origin='lower')
ax.set_title('Observer Effort (biased!)', color='white', fontsize=12)
ax.set_xlabel('West ← → East', color='white')
ax.plot(2, 18, '*', color='#f59e0b', markersize=15)
ax.text(3, 18, 'Park\nentrance', color='#f59e0b', fontsize=9)
ax.tick_params(colors='gray')
plt.colorbar(im2, ax=ax, label='Observer-hours')

# Raw sightings (biased)
ax = axes[1, 0]
im3 = ax.imshow(observed, cmap='YlOrRd', origin='lower')
ax.set_title('Raw Sightings (misleading!)', color='white', fontsize=12)
ax.set_xlabel('West ← → East', color='white')
ax.set_ylabel('South ← → North', color='white')
ax.tick_params(colors='gray')
plt.colorbar(im3, ax=ax, label='Sightings')

# Corrected estimate
ax = axes[1, 1]
im4 = ax.imshow(corrected, cmap='Greens', origin='lower')
ax.set_title('Effort-Corrected Estimate', color='white', fontsize=12)
ax.set_xlabel('West ← → East', color='white')
ax.tick_params(colors='gray')
plt.colorbar(im4, ax=ax, label='Estimated density')

plt.tight_layout()
plt.show()

# Summary statistics
total_sightings = np.nansum(observed)
cells_with_effort = np.sum(observer_effort > 1)
cells_with_high_effort = np.sum(observer_effort > 20)
core_sightings = np.nansum(observed[8:14, 8:16])

print("Citizen Science Data Summary:")
print(f"  Total sightings: {total_sightings:.0f}")
print(f"  Grid cells with any observer effort: {cells_with_effort}/{grid_size**2}")
print(f"  Grid cells with HIGH effort (>20 hrs): {cells_with_high_effort}/{grid_size**2}")
print()
print("Bias analysis:")
print(f"  Sightings near entrance (SW quadrant): {np.nansum(observed[10:, :10]):.0f}")
print(f"  Sightings in core habitat (center): {core_sightings:.0f}")
print()
print("Raw sightings suggest deer are near the entrance.")
print("Corrected estimates show deer are actually in the core phumdi area.")
print("Without effort correction, citizen science data can be DANGEROUSLY misleading.")
print()
print("Lesson: always collect effort data alongside sighting data.")
print("Where you looked and found nothing is as important as where you looked and found something.")`,
      challenge: 'Design a better sampling strategy: assign 5 volunteer teams to grid cells that currently have low effort but are in the core habitat. Add their effort (20 hours each) and re-run. How much does the corrected estimate improve?',
      successHint: 'Citizen science democratizes conservation. The sangai\'s future doesn\'t depend only on professional ecologists — it depends on the thousands of people who live around Loktak Lake and see its changes every day. Turning observers into scientists is the most scalable conservation strategy there is.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 ecology foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ecological data science. Click to start.</p>
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
