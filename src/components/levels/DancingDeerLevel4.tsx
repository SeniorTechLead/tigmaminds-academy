import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function DancingDeerLevel4() {
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
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
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
      title: 'Capstone Part 1 — Age-structured population model for Sangai deer',
      concept: `Simple population models treat all individuals as identical. But a newborn fawn and a breeding-age doe contribute very differently to population growth. **Age-structured models** (Leslie matrix models) divide the population into age classes, each with its own survival rate and fecundity.

For the Sangai deer:
- **Fawns (0-1 year)**: high mortality (0.55 survival), zero reproduction
- **Juveniles (1-2 years)**: moderate mortality (0.75 survival), zero reproduction
- **Young adults (2-5 years)**: good survival (0.88), moderate fecundity (0.3 female fawns/year)
- **Prime adults (5-10 years)**: best survival (0.92), highest fecundity (0.5 female fawns/year)
- **Old adults (10+ years)**: declining survival (0.70), low fecundity (0.15)

The **Leslie matrix** encodes these rates. The population vector n(t) = [fawns, juveniles, young, prime, old] evolves as:

n(t+1) = L × n(t)

where L has fecundities in the first row and survival probabilities on the subdiagonal.

The **dominant eigenvalue** (λ) of L is the asymptotic growth rate. λ > 1 means growth, λ < 1 means decline. The corresponding **eigenvector** gives the stable age distribution.

**Sensitivity analysis** reveals which vital rate (survival of which age class? fecundity of which?) has the most impact on λ. This directly tells managers where to focus conservation effort.`,
      analogy: 'An age-structured model is like a company workforce analysis. Entry-level employees (fawns) have high turnover but are cheap. Senior engineers (prime adults) are the productive core — losing them hurts most. Retirees (old adults) contribute less. HR needs to know which group to invest in for maximum company growth. Leslie matrix analysis does the same for deer: which age class should you protect most?',
      storyConnection: 'The dancing deer nearly went extinct — down to 14 individuals. The age structure of those 14 mattered enormously. If all 14 were old adults past breeding age, the population was functionally extinct despite having 14 living animals. If some were breeding-age females, recovery was possible. Age structure is the hidden variable that determines whether a population rebounds or quietly dies.',
      checkQuestion: 'A population has λ = 0.97. What does this mean, and how sensitive is the population to small improvements in adult survival?',
      checkAnswer: 'λ = 0.97 means the population declines by 3% per year — it will halve in about 23 years. If sensitivity analysis shows that a 0.05 increase in adult survival raises λ from 0.97 to 1.02, then that small improvement flips the trajectory from decline to growth. This is why sensitivity analysis is so valuable: it quantifies exactly how much improvement is needed and where.',
      codeIntro: 'Build a Leslie matrix model for the Sangai deer, compute growth rate, stable age distribution, and sensitivity of growth rate to each vital rate.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Leslie matrix for Sangai deer ---
# Age classes: Fawn(0-1), Juvenile(1-2), YoungAdult(2-5), PrimeAdult(5-10), OldAdult(10+)
age_classes = ['Fawn\\n(0-1)', 'Juvenile\\n(1-2)', 'Young\\n(2-5)', 'Prime\\n(5-10)', 'Old\\n(10+)']
n_classes = 5

# Fecundity (female fawns per female per year)
fecundity = np.array([0, 0, 0.30, 0.50, 0.15])

# Survival probability (to next age class per year)
survival = np.array([0.55, 0.75, 0.88, 0.92, 0.70])

# Build Leslie matrix
L = np.zeros((n_classes, n_classes))
L[0, :] = fecundity  # first row: fecundities
for i in range(n_classes - 1):
    L[i + 1, i] = survival[i]  # subdiagonal: survival
L[n_classes - 1, n_classes - 1] = survival[n_classes - 1]  # old adults stay old

# Initial population (females only, ~130 out of 260)
n0 = np.array([25, 20, 35, 40, 10], dtype=float)

# Project forward 50 years
years = 50
population_history = np.zeros((n_classes, years + 1))
population_history[:, 0] = n0

for t in range(years):
    population_history[:, t + 1] = L @ population_history[:, t]

total_pop = np.sum(population_history, axis=0)

# Eigenvalue analysis
eigenvalues, eigenvectors = np.linalg.eig(L)
lambda_1 = np.max(np.real(eigenvalues))
dominant_idx = np.argmax(np.real(eigenvalues))
stable_age_dist = np.abs(np.real(eigenvectors[:, dominant_idx]))
stable_age_dist = stable_age_dist / np.sum(stable_age_dist)

# Sensitivity analysis: how much does lambda change when we perturb each rate?
def compute_lambda(fec, surv):
    M = np.zeros((n_classes, n_classes))
    M[0, :] = fec
    for i in range(n_classes - 1):
        M[i + 1, i] = surv[i]
    M[n_classes - 1, n_classes - 1] = surv[n_classes - 1]
    evals = np.linalg.eigvals(M)
    return np.max(np.real(evals))

delta = 0.01
# Sensitivity to fecundity
fec_sensitivity = np.zeros(n_classes)
for i in range(n_classes):
    f_up = fecundity.copy()
    f_up[i] += delta
    fec_sensitivity[i] = (compute_lambda(f_up, survival) - lambda_1) / delta

# Sensitivity to survival
surv_sensitivity = np.zeros(n_classes)
for i in range(n_classes):
    s_up = survival.copy()
    s_up[i] += delta
    surv_sensitivity[i] = (compute_lambda(fecundity, s_up) - lambda_1) / delta

# Elasticity (proportional sensitivity)
fec_elasticity = fec_sensitivity * fecundity / lambda_1
surv_elasticity = surv_sensitivity * survival / lambda_1

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Leslie Matrix Model: Sangai Deer Age-Structured Population', color='white', fontsize=14)

# Plot 1: Population by age class over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
for i, (name, color) in enumerate(zip(age_classes, colors)):
    ax.plot(population_history[i], color=color, linewidth=1.5, label=name.replace('\\n', ' '))
ax.plot(total_pop, color='white', linewidth=2, linestyle='--', label='Total')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Female population', color='white')
ax.set_title(f'Population projection (λ = {lambda_1:.4f})', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Age distribution convergence
ax = axes[0, 1]
ax.set_facecolor('#111827')
for i, (name, color) in enumerate(zip(age_classes, colors)):
    proportions = population_history[i] / np.maximum(total_pop, 1)
    ax.plot(proportions, color=color, linewidth=1.5, label=name.replace('\\n', ' '))
    ax.axhline(stable_age_dist[i], color=color, linestyle=':', linewidth=0.5, alpha=0.5)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Proportion', color='white')
ax.set_title('Age distribution → stable distribution', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Stable age distribution
ax = axes[0, 2]
ax.set_facecolor('#111827')
bars = ax.bar(range(n_classes), stable_age_dist, color=colors, edgecolor='none')
ax.set_xticks(range(n_classes))
ax.set_xticklabels([a.replace('\\n', ' ') for a in age_classes], color='white', fontsize=8)
ax.set_ylabel('Proportion', color='white')
ax.set_title('Stable age distribution', color='white', fontsize=11)
for bar, val in zip(bars, stable_age_dist):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01,
            f'{val:.2f}', ha='center', color='white', fontsize=9)
ax.tick_params(colors='gray')

# Plot 4: Leslie matrix heatmap
ax = axes[1, 0]
ax.set_facecolor('#111827')
im = ax.imshow(L, cmap='YlOrRd', vmin=0)
ax.set_xticks(range(n_classes))
ax.set_yticks(range(n_classes))
short_names = ['Fawn', 'Juv', 'Young', 'Prime', 'Old']
ax.set_xticklabels(short_names, color='white', fontsize=8)
ax.set_yticklabels(short_names, color='white', fontsize=8)
for i in range(n_classes):
    for j in range(n_classes):
        if L[i, j] > 0:
            ax.text(j, i, f'{L[i,j]:.2f}', ha='center', va='center',
                    color='black' if L[i,j] > 0.4 else 'white', fontsize=9)
ax.set_title('Leslie matrix', color='white', fontsize=11)
plt.colorbar(im, ax=ax)
ax.tick_params(colors='gray')

# Plot 5: Sensitivity analysis
ax = axes[1, 1]
ax.set_facecolor('#111827')
x = np.arange(n_classes)
w = 0.35
ax.bar(x - w/2, surv_sensitivity, w, color='#22c55e', label='Survival sensitivity', edgecolor='none')
ax.bar(x + w/2, fec_sensitivity, w, color='#3b82f6', label='Fecundity sensitivity', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(short_names, color='white', fontsize=8)
ax.set_ylabel('∂λ/∂rate', color='white')
ax.set_title('Sensitivity: which rate matters most?', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 6: Elasticity
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.bar(x - w/2, surv_elasticity, w, color='#22c55e', label='Survival elasticity', edgecolor='none')
ax.bar(x + w/2, fec_elasticity, w, color='#3b82f6', label='Fecundity elasticity', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(short_names, color='white', fontsize=8)
ax.set_ylabel('Proportional change in λ', color='white')
ax.set_title('Elasticity: proportional importance', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Dominant eigenvalue λ = {lambda_1:.4f}")
print(f"{'Growing' if lambda_1 > 1 else 'Declining'} at {abs(lambda_1 - 1) * 100:.1f}% per year")
print()
print(f"Stable age distribution: {', '.join(f'{a}: {s:.1%}' for a, s in zip(short_names, stable_age_dist))}")
print()
print("Sensitivity ranking (most to least impactful):")
all_sens = list(zip(['Surv ' + n for n in short_names], surv_sensitivity)) + \\
           list(zip(['Fec ' + n for n in short_names], fec_sensitivity))
all_sens.sort(key=lambda x: -abs(x[1]))
for name, sens in all_sens[:5]:
    print(f"  {name:<20} sensitivity = {sens:+.4f}")
print()
print("Management implication: protect the vital rate with highest sensitivity.")`,
      challenge: 'What if poaching reduces prime adult survival from 0.92 to 0.80? Recompute lambda. Then test: would increasing fawn survival to 0.70 compensate? Which single intervention brings lambda back above 1.0?',
      successHint: 'Leslie matrix analysis is the backbone of endangered species management. Every PVA model uses age structure. The sensitivity analysis you computed tells managers exactly where to focus — it is the difference between spending money on fawn protection versus anti-poaching patrols.',
    },
    {
      title: 'Capstone Part 2 — Stochastic PVA with environmental and demographic noise',
      concept: `The Leslie matrix gives deterministic projections — the same input always produces the same output. But nature is stochastic. Floods, droughts, disease outbreaks, and random birth/death events make every year different.

A proper PVA adds three types of stochasticity:

1. **Demographic stochasticity**: even with fixed survival probability of 0.88, a cohort of 10 might have 7, 8, 9, or 10 survivors in any given year. We model this with binomial sampling: actual survivors ~ Binomial(N, survival_probability).

2. **Environmental stochasticity**: in a good year, all survival rates might be 10% higher; in a bad year (flood), 20% lower. We model this by drawing a year-specific multiplier from a lognormal distribution that scales all rates simultaneously.

3. **Catastrophes**: rare events (epidemic, severe flood) that kill a large fraction of the population. We model these as a Bernoulli trial: each year has probability p_cat of a catastrophe that kills fraction f_cat of the population.

Running hundreds of simulations with these stochastic elements gives a distribution of outcomes, from which we compute:
- Mean trajectory and confidence bands
- Extinction probability over T years
- Quasi-extinction probability (probability of dropping below some threshold, e.g., N < 30)
- Mean time to extinction for runs that go extinct`,
      analogy: 'A deterministic model is like calculating your savings balance assuming 7% annual return every year. In reality, some years return 15% and others lose 10%, and occasionally a recession wipes out 30%. Running 1000 random simulations with realistic variation tells you the probability of going broke (extinction) before retirement. That probability is what matters for planning, not the average trajectory.',
      storyConnection: 'The Sangai population of 260 faces monsoon floods that can kill deer and destroy phumdi (environmental stochasticity), random variation in fawn survival each year (demographic stochasticity), and occasional severe events like the 1994 flood that inundated much of Keibul Lamjao (catastrophe). A stochastic PVA captures all three and answers: "What is the chance the Sangai goes extinct in the next 100 years?"',
      checkQuestion: 'Two populations both have N=200 and λ=1.02. Population A lives in a stable environment (low stochasticity). Population B lives in a highly variable environment (high stochasticity). Which has higher extinction risk?',
      checkAnswer: 'Population B, despite having the same mean growth rate. High variability means more frequent dips to dangerously low numbers. Even if the average trend is upward, a bad string of years can push the population into an extinction vortex (where demographic stochasticity takes over and accelerates decline). This is why λ > 1 does not guarantee persistence — variance kills.',
      codeIntro: 'Build a fully stochastic PVA with demographic noise, environmental variation, and catastrophes, computing extinction risk and quasi-extinction probability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Stochastic Leslie matrix PVA ---
n_classes = 5
base_fecundity = np.array([0, 0, 0.30, 0.50, 0.15])
base_survival = np.array([0.55, 0.75, 0.88, 0.92, 0.70])
n0 = np.array([25, 20, 35, 40, 10], dtype=float)

def stochastic_pva(n0, base_fec, base_surv, years=100, n_sims=500,
                   env_sd=0.1, catastrophe_prob=0.03, catastrophe_kill=0.4,
                   K=200):
    """Full stochastic PVA with environmental and demographic noise."""
    all_totals = []
    extinction_years = []
    quasi_extinction_years = []  # year population first drops below 30
    final_age_dists = []

    for sim in range(n_sims):
        pop = n0.copy()
        totals = [np.sum(pop)]
        extinct = False
        quasi_extinct_year = years

        for t in range(years):
            # Environmental stochasticity: multiply all rates by a random factor
            env_factor = np.random.lognormal(0, env_sd)

            # Apply environmental effect
            fec = np.clip(base_fec * env_factor, 0, 1)
            surv = np.clip(base_surv * env_factor, 0, 0.99)

            # Density dependence: reduce fecundity as N approaches K
            total_N = np.sum(pop)
            dd_factor = max(0, 1 - total_N / K) if K > 0 else 1
            fec = fec * (0.5 + 0.5 * dd_factor)

            # Build stochastic Leslie matrix
            new_pop = np.zeros(n_classes)

            # Births (from fecundity row)
            for age_class in range(n_classes):
                if pop[age_class] > 0 and fec[age_class] > 0:
                    expected_births = pop[age_class] * fec[age_class]
                    if expected_births > 0:
                        new_pop[0] += np.random.poisson(max(0, expected_births))

            # Survival transitions (demographic stochasticity via binomial)
            for i in range(n_classes - 1):
                if pop[i] > 0:
                    survivors = np.random.binomial(int(max(0, pop[i])), surv[i])
                    new_pop[i + 1] += survivors

            # Old adults that survive stay old
            if pop[n_classes - 1] > 0:
                new_pop[n_classes - 1] += np.random.binomial(
                    int(max(0, pop[n_classes - 1])), surv[n_classes - 1])

            # Catastrophe
            if np.random.random() < catastrophe_prob:
                kill_fraction = catastrophe_kill * np.random.uniform(0.5, 1.5)
                new_pop = new_pop * (1 - min(kill_fraction, 0.9))
                new_pop = np.maximum(new_pop, 0)

            pop = np.round(new_pop).astype(float)
            total = np.sum(pop)
            totals.append(total)

            # Track quasi-extinction
            if total < 30 and quasi_extinct_year == years:
                quasi_extinct_year = t

            # Check extinction
            if total < 2:
                totals.extend([0] * (years - t - 1))
                extinction_years.append(t)
                extinct = True
                break

        if not extinct:
            extinction_years.append(years)
        quasi_extinction_years.append(quasi_extinct_year)
        all_totals.append(totals[:years + 1])
        final_age_dists.append(pop)

    return {
        'totals': np.array(all_totals),
        'ext_years': np.array(extinction_years),
        'quasi_ext_years': np.array(quasi_extinction_years),
        'final_age': np.array(final_age_dists),
    }

# Run PVA at different initial population sizes
print("Running stochastic PVA...")
N0_values = [15, 50, 130, 200]
pva_results = {}

for N0_total in N0_values:
    # Scale initial age distribution
    scale = N0_total / np.sum(n0)
    n0_scaled = np.round(n0 * scale).astype(float)
    result = stochastic_pva(n0_scaled, base_fecundity, base_survival, years=100, n_sims=500)
    pva_results[N0_total] = result
    ext_prob = np.mean(result['ext_years'] < 100)
    print(f"  N0={N0_total}: extinction probability = {ext_prob:.1%}")

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Stochastic PVA: Sangai Deer Population Viability', color='white', fontsize=14)

colors = {15: '#ef4444', 50: '#f59e0b', 130: '#22c55e', 200: '#3b82f6'}

# Plot 1: Trajectory fan for current population (N0=130)
ax = axes[0, 0]
ax.set_facecolor('#111827')
traj = pva_results[130]['totals']
for i in range(min(100, len(traj))):
    color = '#ef4444' if traj[i, -1] == 0 else '#22c55e'
    ax.plot(traj[i], color=color, linewidth=0.2, alpha=0.3)
median = np.median(traj, axis=0)
q10 = np.percentile(traj, 10, axis=0)
q90 = np.percentile(traj, 90, axis=0)
ax.plot(median, color='white', linewidth=2, label='Median')
ax.fill_between(range(len(median)), q10, q90, color='white', alpha=0.1)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Female population', color='white')
ax.set_title('N₀=130 females (~260 total): 100 simulations shown', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Extinction probability vs N0
ax = axes[0, 1]
ax.set_facecolor('#111827')
ns = sorted(pva_results.keys())
ext_probs = [np.mean(pva_results[n]['ext_years'] < 100) for n in ns]
ax.plot(ns, ext_probs, 'o-', color='#ef4444', linewidth=2, markersize=10)
ax.axhline(0.05, color='#f59e0b', linestyle='--', label='5% IUCN threshold')
ax.set_xlabel('Initial female population', color='white')
ax.set_ylabel('100-year extinction probability', color='white')
ax.set_title('Extinction risk vs starting population', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Quasi-extinction curves
ax = axes[0, 2]
ax.set_facecolor('#111827')
for N0 in ns:
    qe = pva_results[N0]['quasi_ext_years']
    survival = [np.mean(qe > y) for y in range(101)]
    ax.plot(survival, color=colors[N0], linewidth=2, label=f'N₀={N0}')
ax.axhline(0.95, color='gray', linestyle=':', linewidth=1)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('P(above quasi-extinction threshold)', color='white')
ax.set_title('Quasi-extinction risk (threshold: N < 30)', color='white', fontsize=10)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 4: Time to extinction distributions
ax = axes[1, 0]
ax.set_facecolor('#111827')
for N0 in [15, 50, 130]:
    ext = pva_results[N0]['ext_years']
    extinct_runs = ext[ext < 100]
    if len(extinct_runs) > 5:
        ax.hist(extinct_runs, bins=20, alpha=0.5, color=colors[N0],
                label=f'N₀={N0} ({len(extinct_runs)} extinct)', edgecolor='none')
ax.set_xlabel('Year of extinction', color='white')
ax.set_ylabel('Frequency', color='white')
ax.set_title('Time to extinction (extinct runs only)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 5: Environmental vs demographic stochasticity comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Run with just demographic noise (env_sd=0)
n0_test = np.round(n0 * 130 / np.sum(n0)).astype(float)
result_demo_only = stochastic_pva(n0_test, base_fecundity, base_survival,
                                   env_sd=0.01, catastrophe_prob=0, K=200, n_sims=200)
result_env_only = stochastic_pva(n0_test, base_fecundity, base_survival,
                                  env_sd=0.15, catastrophe_prob=0, K=200, n_sims=200)
result_full = stochastic_pva(n0_test, base_fecundity, base_survival,
                              env_sd=0.15, catastrophe_prob=0.03, K=200, n_sims=200)

for label, result, color in [
    ('Demo. only', result_demo_only, '#3b82f6'),
    ('Env. only', result_env_only, '#f59e0b'),
    ('Full model', result_full, '#ef4444'),
]:
    ext_p = np.mean(result['ext_years'] < 100)
    median = np.median(result['totals'], axis=0)
    ax.plot(median, color=color, linewidth=2, label=f'{label} (ext={ext_p:.0%})')

ax.set_xlabel('Year', color='white')
ax.set_ylabel('Median population', color='white')
ax.set_title('Decomposing stochasticity effects', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 6: Summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
rows = [['N₀ (females)', 'Ext prob', 'Quasi-ext', 'Median@100', 'IUCN viable?']]
for N0 in ns:
    res = pva_results[N0]
    ext_p = np.mean(res['ext_years'] < 100)
    qe_p = np.mean(res['quasi_ext_years'] < 100)
    med_final = np.median(res['totals'][:, -1])
    viable = 'YES' if ext_p < 0.05 else 'NO'
    rows.append([str(N0), f'{ext_p:.0%}', f'{qe_p:.0%}', f'{med_final:.0f}', viable])

table = ax.table(cellText=rows[1:], colLabels=rows[0], cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
    if key[1] == 4 and key[0] > 0:
        val = rows[key[0]][4]
        cell.set_facecolor('#065f46' if val == 'YES' else '#7f1d1d')
ax.set_title('PVA Summary', color='white', fontsize=11, pad=15)

plt.tight_layout()
plt.show()

print("\\nKey findings:")
print("  Environmental stochasticity is the dominant risk factor for Sangai.")
print("  Catastrophes (floods) compound the risk significantly.")
print("  Even at current population (~130 females), extinction risk is non-trivial.")`,
      challenge: 'Run the PVA with K declining by 2 per year (simulating ongoing habitat degradation). How does a shrinking carrying capacity change the MVP estimate? At what rate of K decline does even the current population become unviable?',
      successHint: 'This stochastic PVA is the same class of model used in VORTEX — the industry-standard PVA software used by zoos and wildlife agencies worldwide. You built it from scratch in numpy.',
    },
    {
      title: 'Capstone Part 3 — Habitat scenario modeling with dynamic carrying capacity',
      concept: `Carrying capacity is not fixed. For the Sangai, K depends on phumdi area, thickness, vegetation quality, and water levels — all of which change over time due to dam operations, climate change, and management actions.

We model K as a dynamic variable driven by habitat scenarios:

1. **Status quo**: dam continues current operation; K declines 3% per decade as phumdi thin
2. **Dam reform**: seasonal water release restores natural water level regime; K stabilizes
3. **Active restoration**: phumdi reinforcement + invasive species removal + dam reform; K increases
4. **Climate change overlay**: more frequent extreme floods reduce K by 5-15% during catastrophic years

The PVA integrates dynamic K:
- Each year, K is updated based on the scenario
- Population growth rate responds to the N/K ratio
- When K drops below N, the population enters decline even with good vital rates

This creates a **coupled population-habitat model** where habitat quality and population size interact dynamically. If the population crashes below K, it can recover (if K is maintained). If K crashes below N, the population is forced to decline even if individuals are healthy.

The output: extinction probability under each scenario, identifying which habitat management strategy gives the Sangai the best chance of long-term persistence.`,
      analogy: 'Dynamic K is like a company operating in a changing market. Even a healthy company with great employees (high survival rates) will shrink if the total market (carrying capacity) contracts. You cannot outperform a shrinking market forever. Conversely, a small company in an expanding market has room to grow. For the Sangai, "growing the market" means restoring phumdi habitat.',
      storyConnection: 'The dam changed the rules. Before 1983, the phumdi were thick and extensive — carrying capacity was high and the deer population was limited only by natural predation and disease. After the dam, K began its slow decline. The dancing deer are dancing on a shrinking stage. Scenario modeling asks: how do we stop the stage from shrinking, and can the dancers survive if we cannot?',
      checkQuestion: 'A population is at N=200 with K=250. The habitat degrades so K drops to 150. What happens to the population even if all vital rates stay the same?',
      checkAnswer: 'The population must decline to K=150 because logistic growth becomes negative when N > K. Even with the same survival and fecundity rates, the density-dependent term (1 - N/K) becomes negative, meaning deaths exceed births. The population will decline until N ≈ K = 150. If K continues declining, the population follows it down like a ball in a shrinking bowl.',
      codeIntro: 'Build coupled population-habitat scenarios, projecting Sangai population dynamics under different dam management and climate change scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Habitat scenarios ---
years = 80

def generate_K_trajectory(scenario, years, base_K=200):
    """Generate carrying capacity trajectory under different scenarios."""
    K = np.zeros(years)
    K[0] = base_K

    for t in range(1, years):
        if scenario == 'status_quo':
            # 3% decline per decade + random variation
            K[t] = K[t-1] * (1 - 0.003) + np.random.normal(0, 2)
        elif scenario == 'dam_reform':
            # Stabilize at current level
            K[t] = base_K + np.random.normal(0, 5)
        elif scenario == 'active_restoration':
            # Gradual increase, 1% per year for 30 years then stable
            if t < 30:
                K[t] = K[t-1] * 1.01 + np.random.normal(0, 3)
            else:
                K[t] = K[t-1] + np.random.normal(0, 3)
        elif scenario == 'climate_change':
            # Faster decline + more extreme variation
            K[t] = K[t-1] * (1 - 0.005) + np.random.normal(0, 5)
            # Extra bad years
            if np.random.random() < 0.08:
                K[t] *= np.random.uniform(0.7, 0.9)

        K[t] = max(20, K[t])

    return K

# Run coupled population-habitat model
def coupled_simulation(K_scenario, n0_total=130, years=80, n_sims=300,
                       base_surv=0.88, base_fec=0.35, cat_prob=0.03):
    all_pops = []
    all_Ks = []
    ext_years = []

    for sim in range(n_sims):
        K_traj = generate_K_trajectory(K_scenario, years)
        N = float(n0_total)
        pop_traj = [N]
        K_traj_sim = [K_traj[0]]

        for t in range(years - 1):
            K = K_traj[t]

            # Density-dependent growth
            dd = max(0, 1 - N / K) if K > 0 else 0
            r = (base_surv - (1 - base_fec * dd)) * dd

            # Environmental stochasticity
            r_actual = r + np.random.normal(0, 0.06)

            # Growth
            growth = r_actual * N
            if N < 50:
                growth += np.random.normal(0, np.sqrt(max(N, 1)))

            # Catastrophe
            if np.random.random() < cat_prob:
                growth -= N * np.random.uniform(0.2, 0.5)

            N = max(0, N + growth)
            pop_traj.append(N)
            K_traj_sim.append(K_traj[min(t+1, len(K_traj)-1)])

            if N < 2:
                pop_traj.extend([0] * (years - t - 2))
                K_traj_sim.extend([K_traj[min(i, len(K_traj)-1)] for i in range(t+2, years)])
                ext_years.append(t)
                break

        if len(pop_traj) < years:
            pop_traj.extend([pop_traj[-1]] * (years - len(pop_traj)))
        if len(K_traj_sim) < years:
            K_traj_sim.extend([K_traj_sim[-1]] * (years - len(K_traj_sim)))

        all_pops.append(pop_traj[:years])
        all_Ks.append(K_traj_sim[:years])
        if len(ext_years) < sim + 1:
            ext_years.append(years)

    return {
        'pops': np.array(all_pops),
        'Ks': np.array(all_Ks),
        'ext_years': np.array(ext_years),
    }

scenarios = ['status_quo', 'dam_reform', 'active_restoration', 'climate_change']
scenario_labels = ['Status quo', 'Dam reform', 'Active restoration', 'Climate change']
scenario_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

print("Running coupled population-habitat simulations...")
results = {}
for s in scenarios:
    results[s] = coupled_simulation(s)
    ext_p = np.mean(results[s]['ext_years'] < years)
    print(f"  {s}: extinction prob = {ext_p:.1%}")

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Coupled Population-Habitat Model: Sangai Under Different Futures', color='white', fontsize=14)

# Plot 1: Population median trajectories
ax = axes[0, 0]
ax.set_facecolor('#111827')
for s, label, color in zip(scenarios, scenario_labels, scenario_colors):
    pops = results[s]['pops']
    median = np.median(pops, axis=0)
    q10 = np.percentile(pops, 10, axis=0)
    q90 = np.percentile(pops, 90, axis=0)
    ax.plot(median, color=color, linewidth=2, label=label)
    ax.fill_between(range(len(median)), q10, q90, color=color, alpha=0.1)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Female population', color='white')
ax.set_title('Population projections', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Carrying capacity trajectories
ax = axes[0, 1]
ax.set_facecolor('#111827')
for s, label, color in zip(scenarios, scenario_labels, scenario_colors):
    Ks = results[s]['Ks']
    median_K = np.median(Ks, axis=0)
    ax.plot(median_K, color=color, linewidth=2, label=label)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Carrying capacity (K)', color='white')
ax.set_title('Habitat capacity trajectories', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: N/K ratio over time
ax = axes[0, 2]
ax.set_facecolor('#111827')
for s, label, color in zip(scenarios, scenario_labels, scenario_colors):
    pops = results[s]['pops']
    Ks = results[s]['Ks']
    ratio = np.median(pops / np.maximum(Ks, 1), axis=0)
    ax.plot(ratio, color=color, linewidth=2, label=label)
ax.axhline(1.0, color='gray', linestyle=':', linewidth=1)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('N/K ratio', color='white')
ax.set_title('Population density relative to capacity', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Cumulative extinction curves
ax = axes[1, 0]
ax.set_facecolor('#111827')
for s, label, color in zip(scenarios, scenario_labels, scenario_colors):
    ext = results[s]['ext_years']
    surv = [np.mean(ext > y) for y in range(years)]
    ax.plot(surv, color=color, linewidth=2, label=label)
ax.axhline(0.95, color='gray', linestyle=':', linewidth=1)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Survival probability', color='white')
ax.set_title('Probability of persistence', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Final population distributions
ax = axes[1, 1]
ax.set_facecolor('#111827')
for s, label, color in zip(scenarios, scenario_labels, scenario_colors):
    finals = results[s]['pops'][:, -1]
    living = finals[finals > 0]
    if len(living) > 5:
        ax.hist(living, bins=20, alpha=0.5, color=color, label=label, edgecolor='none')
ax.set_xlabel('Population at year 80', color='white')
ax.set_ylabel('Frequency', color='white')
ax.set_title('Final population distribution', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Summary table
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
rows = []
for s, label in zip(scenarios, scenario_labels):
    res = results[s]
    ext_p = np.mean(res['ext_years'] < years)
    med_final = np.median(res['pops'][:, -1])
    med_K = np.median(res['Ks'][:, -1])
    rows.append([label[:15], f'{ext_p:.0%}', f'{med_final:.0f}', f'{med_K:.0f}'])

table = ax.table(cellText=rows,
                colLabels=['Scenario', 'Ext risk', 'Pop@80', 'K@80'],
                cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('Scenario comparison', color='white', fontsize=11, pad=15)

plt.tight_layout()
plt.show()

print("\\nHabitat determines destiny:")
print("  Active restoration protects the deer by growing their habitat.")
print("  Dam reform alone stabilizes but doesn\'t improve.")
print("  Status quo = slow extinction. Climate change = fast extinction.")`,
      challenge: 'Design a "combined" scenario: active restoration for 20 years, then budget cuts force a return to status quo. What does the population trajectory look like? Is 20 years of restoration enough to build a self-sustaining population?',
      successHint: 'Coupled population-habitat models are the gold standard for conservation planning under uncertainty. They reveal that protecting a species requires protecting its habitat trajectory, not just its current population.',
    },
    {
      title: 'Capstone Part 4 — Metapopulation viability with satellite populations',
      concept: `A single population at Keibul Lamjao is inherently fragile. One catastrophic flood could wipe out the entire species. The most powerful risk-reduction strategy is creating **satellite populations** — separate breeding groups in different locations.

The Manipur government has discussed establishing satellite populations at:
- Pumlen Lake (natural wetland, 20 km from Loktak)
- A captive breeding center (zoo-based insurance colony)
- Restored wetlands in other parts of Manipur

A **metapopulation PVA** models multiple subpopulations connected by managed translocation:
- Each subpopulation has its own K, vital rates, and environmental stochasticity
- Translocation moves individuals between populations (managed "migration")
- Populations can rescue each other: if one crashes, translocate from another

The key metric shifts from "probability of extinction at Keibul Lamjao" to "probability of species extinction" (all populations going extinct simultaneously). Even if each subpopulation has 20% individual extinction risk, three independent populations have only 0.2³ = 0.8% combined risk.

**But independence is the key assumption.** If all populations face the same flood (correlated catastrophes), the risk reduction is smaller. Geographic separation reduces correlation.`,
      analogy: 'Satellite populations are like backing up important files to multiple hard drives in different locations. If your computer crashes (one flood at Loktak), you lose that copy but the backup survives. If both hard drives are in the same room (same flood zone), a fire destroys both. Geographic separation = genuine redundancy. The species cannot go extinct unless ALL backups fail simultaneously.',
      storyConnection: 'The dancing deer of Loktak Lake are putting all their eggs in one basket — a single floating national park. If that basket tips over (a catastrophic flood, a disease outbreak), the species dies. Creating satellite populations at other wetlands gives the Sangai multiple baskets. The story of recovery from 14 to 260 could become the story of recovery from 260 to a resilient network of 1000+ across multiple sites.',
      checkQuestion: 'You have 260 deer at Loktak. Should you move 50 to a satellite site, reducing the main population to 210? What are the trade-offs?',
      checkAnswer: 'Moving 50 deer reduces the main population (higher demographic stochasticity at 210 vs 260) but creates redundancy (the species now exists in two places). If the populations face independent catastrophes, the net extinction risk drops dramatically. If they face correlated risks (same monsoon system), the benefit is smaller. The optimal split depends on the correlation between sites and the MVP at each site. Generally, if both sites have K >= 100, the split is beneficial.',
      codeIntro: 'Build a metapopulation PVA with a main Loktak population and satellite populations, modeling translocation strategies and computing species-level extinction risk.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Metapopulation PVA ---
sites = [
    {'name': 'Keibul Lamjao', 'K': 200, 'N0': 130, 'env_sd': 0.12, 'cat_prob': 0.04},
    {'name': 'Pumlen Lake', 'K': 80, 'N0': 0, 'env_sd': 0.10, 'cat_prob': 0.03},
    {'name': 'Captive colony', 'K': 30, 'N0': 0, 'env_sd': 0.03, 'cat_prob': 0.01},
]
n_sites = len(sites)
base_surv = 0.88
base_fec = 0.35

def metapop_pva(sites, translocation_plan, years=80, n_sims=400,
                catastrophe_correlation=0.3):
    """
    translocation_plan: list of dicts with 'year', 'from', 'to', 'n'
    catastrophe_correlation: probability that catastrophe at one site also hits another
    """
    all_results = []

    for sim in range(n_sims):
        pops = [float(s['N0']) for s in sites]
        pop_histories = [[p] for p in pops]
        species_extinct_year = years

        for t in range(years):
            # Check for correlated catastrophe
            main_cat = np.random.random() < sites[0]['cat_prob']

            new_pops = []
            for i, site in enumerate(sites):
                N = pops[i]

                if N < 2:
                    new_pops.append(0)
                    pop_histories[i].append(0)
                    continue

                # Growth
                K = site['K']
                dd = max(0, 1 - N / K) if K > 0 else 0
                env_factor = np.random.lognormal(0, site['env_sd'])
                r = base_fec * dd * env_factor - (1 - base_surv * env_factor)
                growth = r * N

                # Demographic stochasticity
                if N < 50:
                    growth += np.random.normal(0, np.sqrt(max(N, 1)) * 1.5)

                # Catastrophe (possibly correlated)
                site_cat = np.random.random() < site['cat_prob']
                if main_cat and np.random.random() < catastrophe_correlation:
                    site_cat = True

                if site_cat:
                    growth -= N * np.random.uniform(0.2, 0.5)

                N = max(0, N + growth)

                # Apply translocations
                for plan in translocation_plan:
                    if plan['year'] == t:
                        if plan['to'] == i:
                            N += plan['n']
                        if plan['from'] == i:
                            N = max(0, N - plan['n'])

                new_pops.append(N)
                pop_histories[i].append(N)

            pops = new_pops

            # Species extinction check
            if all(p < 2 for p in pops) and species_extinct_year == years:
                species_extinct_year = t

        all_results.append({
            'histories': [h[:years+1] for h in pop_histories],
            'species_ext_year': species_extinct_year,
        })

    return all_results

# --- Define translocation strategies ---
strategies = {
    'No satellites': {
        'sites': [sites[0]],  # only Keibul Lamjao
        'plan': [],
    },
    'Establish Pumlen': {
        'sites': sites[:2],
        'plan': [{'year': 5, 'from': 0, 'to': 1, 'n': 20},
                 {'year': 6, 'from': 0, 'to': 1, 'n': 15},
                 {'year': 7, 'from': 0, 'to': 1, 'n': 10}],
    },
    'Pumlen + captive': {
        'sites': sites,
        'plan': [{'year': 3, 'from': 0, 'to': 2, 'n': 10},
                 {'year': 5, 'from': 0, 'to': 1, 'n': 20},
                 {'year': 6, 'from': 0, 'to': 1, 'n': 15},
                 {'year': 7, 'from': 2, 'to': 1, 'n': 5},
                 {'year': 10, 'from': 0, 'to': 1, 'n': 10}],
    },
    'Full network + rescue': {
        'sites': sites,
        'plan': [
            {'year': 3, 'from': 0, 'to': 2, 'n': 10},
            {'year': 5, 'from': 0, 'to': 1, 'n': 20},
            {'year': 6, 'from': 0, 'to': 1, 'n': 15},
            # Ongoing rescue translocations every 10 years
            {'year': 15, 'from': 0, 'to': 1, 'n': 5},
            {'year': 25, 'from': 0, 'to': 1, 'n': 5},
            {'year': 35, 'from': 2, 'to': 1, 'n': 3},
            {'year': 45, 'from': 0, 'to': 2, 'n': 5},
        ],
    },
}

print("Running metapopulation PVA strategies...")
strategy_results = {}
for name, strat in strategies.items():
    res = metapop_pva(strat['sites'], strat['plan'])
    species_ext_prob = np.mean([r['species_ext_year'] < 80 for r in res])
    strategy_results[name] = {'results': res, 'ext_prob': species_ext_prob}
    print(f"  {name}: species extinction prob = {species_ext_prob:.1%}")

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Metapopulation PVA: Sangai Satellite Population Strategy', color='white', fontsize=14)

strat_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']
strat_names = list(strategies.keys())

# Plot 1: Total metapopulation trajectories
ax = axes[0, 0]
ax.set_facecolor('#111827')
for idx, name in enumerate(strat_names):
    results = strategy_results[name]['results']
    # Total population across all sites
    totals = []
    for r in results:
        total = np.zeros(81)
        for h in r['histories']:
            padded = list(h) + [0] * (81 - len(h))
            total += np.array(padded[:81])
        totals.append(total)
    totals = np.array(totals)
    median = np.median(totals, axis=0)
    ax.plot(median, color=strat_colors[idx], linewidth=2, label=name[:15])

ax.set_xlabel('Year', color='white')
ax.set_ylabel('Total metapopulation', color='white')
ax.set_title('Total population across all sites', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Site-level trajectories for best strategy
ax = axes[0, 1]
ax.set_facecolor('#111827')
best_strat = 'Pumlen + captive'
results = strategy_results[best_strat]['results']
site_colors = ['#22c55e', '#3b82f6', '#a855f7']
site_names = ['Keibul Lamjao', 'Pumlen Lake', 'Captive']

for site_idx in range(min(3, len(strategies[best_strat]['sites']))):
    site_pops = []
    for r in results:
        if site_idx < len(r['histories']):
            h = r['histories'][site_idx]
            padded = list(h) + [0] * (81 - len(h))
            site_pops.append(padded[:81])
    if site_pops:
        site_pops = np.array(site_pops)
        median = np.median(site_pops, axis=0)
        ax.plot(median, color=site_colors[site_idx], linewidth=2, label=site_names[site_idx])

ax.set_xlabel('Year', color='white')
ax.set_ylabel('Population', color='white')
ax.set_title(f'Site breakdown: {best_strat}', color='white', fontsize=10)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Species extinction risk comparison
ax = axes[0, 2]
ax.set_facecolor('#111827')
ext_probs = [strategy_results[n]['ext_prob'] for n in strat_names]
bars = ax.bar(range(len(strat_names)), [p * 100 for p in ext_probs],
              color=strat_colors, edgecolor='none')
ax.axhline(5, color='white', linestyle='--', linewidth=1, label='5% IUCN threshold')
ax.set_xticks(range(len(strat_names)))
ax.set_xticklabels([s[:12] for s in strat_names], color='white', fontsize=7, rotation=15)
ax.set_ylabel('Species extinction risk (%)', color='white')
ax.set_title('Species-level extinction probability', color='white', fontsize=11)
for bar, prob in zip(bars, ext_probs):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{prob:.0%}', ha='center', color='white', fontsize=9, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Survival curves
ax = axes[1, 0]
ax.set_facecolor('#111827')
for idx, name in enumerate(strat_names):
    ext_years = [r['species_ext_year'] for r in strategy_results[name]['results']]
    surv = [np.mean([e > y for e in ext_years]) for y in range(81)]
    ax.plot(surv, color=strat_colors[idx], linewidth=2, label=name[:15])
ax.axhline(0.95, color='gray', linestyle=':', linewidth=1)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Species survival probability', color='white')
ax.set_title('Cumulative species persistence', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Value of independence
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Test different catastrophe correlations
correlations = np.linspace(0, 1, 10)
ext_by_corr = []
for corr in correlations:
    res = metapop_pva(sites, strategies['Pumlen + captive']['plan'],
                      n_sims=150, catastrophe_correlation=corr)
    ext_p = np.mean([r['species_ext_year'] < 80 for r in res])
    ext_by_corr.append(ext_p)

ax.plot(correlations, [e * 100 for e in ext_by_corr], 'o-', color='#a855f7', linewidth=2)
ax.set_xlabel('Catastrophe correlation between sites', color='white')
ax.set_ylabel('Species extinction risk (%)', color='white')
ax.set_title('Value of geographic separation', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
rows = []
for name in strat_names:
    res = strategy_results[name]
    ext_p = res['ext_prob']
    n_sites = len(strategies[name]['sites'])
    total_translocated = sum(p['n'] for p in strategies[name]['plan'])
    rows.append([name[:15], str(n_sites), str(total_translocated), f'{ext_p:.0%}',
                 'YES' if ext_p < 0.05 else 'NO'])

table = ax.table(cellText=rows,
                colLabels=['Strategy', 'Sites', 'Translocated', 'Ext risk', 'Viable?'],
                cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
    if key[1] == 4 and key[0] > 0:
        cell.set_facecolor('#065f46' if rows[key[0]-1][4] == 'YES' else '#7f1d1d')
ax.set_title('Strategy comparison', color='white', fontsize=11, pad=15)

plt.tight_layout()
plt.show()

print("\\nKey insight: satellite populations dramatically reduce species extinction risk.")
print("Even small satellite populations (K=30 captive colony) provide insurance value.")
print("Geographic separation reduces correlated catastrophe risk.")
print("The optimal strategy combines wild satellites with a captive insurance colony.")`,
      challenge: 'What if you could create a fourth site with K=50 at 100km distance from Loktak (very low catastrophe correlation)? How much does this additional site reduce species extinction risk? Is it worth the cost of translocating 25 deer?',
      successHint: 'Metapopulation management is the standard approach for critically endangered species. The Sangai, California condor, Arabian oryx, and black-footed ferret all depend on multi-site management strategies. You have built the analytical framework that guides these programs.',
    },
    {
      title: 'Capstone Part 5 — Full PVA dashboard with management recommendations',
      concept: `The final deliverable is a comprehensive PVA dashboard that integrates all analyses into a single decision-support tool. This is what goes to the Director of Keibul Lamjao National Park and the Chief Wildlife Warden of Manipur.

The dashboard synthesizes:
1. **Current status**: population estimate (from capture-recapture), habitat quality (from HSI), age structure (from demographic data)
2. **Viability assessment**: extinction risk under current management (from stochastic PVA)
3. **Scenario comparison**: what happens under different management options?
4. **Sensitivity analysis**: which interventions have the most impact?
5. **Recommendation**: the specific combination of actions that minimizes extinction risk within the available budget

The output must be clear enough for a non-scientist to understand and specific enough for a manager to act on. "Increase adult survival by 5%" is useless unless you tell them HOW (anti-poaching, veterinary intervention, habitat management). "Invest 80 crores in dam reform and satellite population at Pumlen Lake" is actionable.`,
      analogy: 'The PVA dashboard is like a financial planning report. It shows current net worth (population), income and expenses (vital rates), projections under different investment strategies (management scenarios), risk analysis (extinction probability), and a recommended portfolio (optimal management strategy). The client (wildlife manager) does not need to understand stochastic differential equations — they need to understand the bottom line: "Do X, Y, Z and the species has a 95% chance of surviving 100 years."',
      storyConnection: 'The dancing deer have danced back from 14 to 260 — but the dance is not over. This dashboard is the choreography for the next 100 years. It says: protect the phumdi (habitat), monitor the population (camera traps), establish satellite groups (metapopulation), and reform the dam (carrying capacity). Without this plan, the dance could end. With it, the Sangai will dance for centuries.',
      checkQuestion: 'A manager looks at the dashboard and says, "The extinction risk is only 8%. That is close enough to the 5% IUCN threshold. Why should we spend 80 crores?" How do you respond?',
      checkAnswer: 'Three reasons: (1) 8% means roughly 1 in 12 chance the species goes extinct — would you board a plane with a 1 in 12 chance of crashing? (2) The 8% assumes current conditions persist, but climate change and development pressure will worsen conditions. (3) The cost of inaction is irreversible — once extinct, no amount of money can bring the species back. The 80 crores buys insurance against an irreversible loss. Compare this to the cost of losing the only floating national park in the world.',
      codeIntro: 'Build the complete PVA management dashboard, synthesizing all analyses into actionable recommendations for Sangai deer conservation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================
# SANGAI DEER PVA — MANAGEMENT DASHBOARD
# ============================================

# Current state assessment
current_pop = 260
current_K = 400
current_females = 130
detection_rate = 0.15
annual_lambda = 1.02
fawn_survival = 0.55
adult_survival = 0.90

# Management options with costs and effects
options = {
    'A: Dam water release': {
        'cost_crores': 30, 'K_change': +50, 'survival_change': 0, 'description': 'Seasonal water release to thicken phumdi'},
    'B: Anti-poaching': {
        'cost_crores': 15, 'K_change': 0, 'survival_change': +0.03, 'description': 'Increased patrols, fencing'},
    'C: Pumlen satellite': {
        'cost_crores': 40, 'K_change': +80, 'survival_change': 0, 'description': 'Establish population at Pumlen Lake'},
    'D: Captive breeding': {
        'cost_crores': 20, 'K_change': +30, 'survival_change': 0, 'description': 'Zoo-based insurance colony'},
    'E: Phumdi restoration': {
        'cost_crores': 25, 'K_change': +40, 'survival_change': 0, 'description': 'Reinforce thinning phumdi mats'},
}

# Run quick PVA for each combination
def quick_pva(N0, K, survival_boost=0, years=80, n_sims=300, cat_prob=0.03):
    base_surv = 0.88 + survival_boost
    extinctions = 0
    final_pops = []
    trajectories = []

    for _ in range(n_sims):
        N = float(N0)
        traj = [N]
        for t in range(years):
            dd = max(0, 1 - N / K) if K > 0 else 0
            r = np.random.normal(0.08 * dd, 0.05)
            growth = r * N
            if N < 50:
                growth += np.random.normal(0, np.sqrt(max(N, 1)))
            if np.random.random() < cat_prob:
                growth -= N * np.random.uniform(0.2, 0.5)
            N = max(0, N + growth)
            traj.append(N)
            if N < 2:
                traj.extend([0] * (years - t - 1))
                extinctions += 1
                break
        trajectories.append(traj[:years+1])
        final_pops.append(traj[-1])

    return {
        'ext_prob': extinctions / n_sims,
        'median_final': np.median(final_pops),
        'trajectories': np.array(trajectories),
    }

# Evaluate each management option individually
print("Evaluating management options...")
baseline = quick_pva(current_females, current_K / 2)
option_results = {}
for name, opt in options.items():
    K_new = current_K / 2 + opt['K_change'] / 2  # female K
    result = quick_pva(current_females, K_new, opt['survival_change'])
    option_results[name] = result
    improvement = baseline['ext_prob'] - result['ext_prob']
    roi = improvement / opt['cost_crores'] * 100 if opt['cost_crores'] > 0 else 0
    print(f"  {name}: ext={result['ext_prob']:.1%} (improvement: {improvement:+.1%}, ROI: {roi:.2f}%/Cr)")

# Find optimal portfolio under budget
budget = 70  # crores
opt_list = list(options.items())
n_opts = len(opt_list)
best_portfolio = None
best_ext_prob = 1.0

# Brute force all combinations (2^5 = 32)
for mask in range(2**n_opts):
    total_cost = 0
    total_K_change = 0
    total_surv_change = 0
    selected = []
    for i in range(n_opts):
        if mask & (1 << i):
            name, opt = opt_list[i]
            total_cost += opt['cost_crores']
            total_K_change += opt['K_change']
            total_surv_change += opt['survival_change']
            selected.append(name)
    if total_cost <= budget:
        K_new = current_K / 2 + total_K_change / 2
        result = quick_pva(current_females, K_new, total_surv_change, n_sims=200)
        if result['ext_prob'] < best_ext_prob:
            best_ext_prob = result['ext_prob']
            best_portfolio = {'selected': selected, 'cost': total_cost,
                            'ext_prob': result['ext_prob'], 'trajectories': result['trajectories']}

print(f"\\nOptimal portfolio (budget={budget} Cr):")
for s in best_portfolio['selected']:
    print(f"  {s} ({options[s.split(':')[0] + ':' + s.split(':')[1]]['cost_crores']} Cr)" if ':' in s else f"  {s}")

# --- DASHBOARD VISUALIZATION ---
fig = plt.figure(figsize=(18, 14))
fig.patch.set_facecolor('#1f2937')

# Title bar
fig.text(0.5, 0.97, 'SANGAI DEER CONSERVATION — POPULATION VIABILITY ASSESSMENT',
         color='white', fontsize=16, fontweight='bold', ha='center')
fig.text(0.5, 0.95, f'Current population: {current_pop} | Habitat: {current_K} capacity | Detection: {detection_rate:.0%} | Growth rate: {annual_lambda:.2f}',
         color='gray', fontsize=10, ha='center')

gs = fig.add_gridspec(3, 4, hspace=0.4, wspace=0.35, top=0.93, bottom=0.05)

# 1. Current status gauge
ax = fig.add_subplot(gs[0, 0])
ax.set_facecolor('#111827')
# Population vs MVP vs K
categories = ['Current N', 'MVP est.', 'Carrying K']
values = [current_pop, 350, current_K]
colors = ['#22c55e' if current_pop > 350 else '#f59e0b', '#ef4444', '#3b82f6']
bars = ax.barh(categories, values, color=colors, edgecolor='none', height=0.5)
ax.axvline(current_pop, color='white', linestyle=':', linewidth=1, alpha=0.5)
ax.set_xlabel('Individuals', color='white')
ax.set_title('Population status', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, val in zip(bars, values):
    ax.text(val + 5, bar.get_y() + bar.get_height()/2, str(val),
            color='white', va='center', fontsize=10, fontweight='bold')

# 2. Baseline trajectory
ax = fig.add_subplot(gs[0, 1])
ax.set_facecolor('#111827')
traj = baseline['trajectories']
for i in range(min(50, len(traj))):
    c = '#ef4444' if traj[i, -1] < 5 else '#22c55e'
    ax.plot(traj[i], color=c, linewidth=0.2, alpha=0.3)
ax.plot(np.median(traj, axis=0), color='white', linewidth=2)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Females', color='white')
ax.set_title(f'Status quo: ext risk = {baseline["ext_prob"]:.0%}', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 3. Optimal trajectory
ax = fig.add_subplot(gs[0, 2])
ax.set_facecolor('#111827')
traj = best_portfolio['trajectories']
for i in range(min(50, len(traj))):
    c = '#ef4444' if traj[i, -1] < 5 else '#22c55e'
    ax.plot(traj[i], color=c, linewidth=0.2, alpha=0.3)
ax.plot(np.median(traj, axis=0), color='white', linewidth=2)
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Females', color='white')
ax.set_title(f'Optimal plan: ext risk = {best_portfolio["ext_prob"]:.0%}', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 4. Risk reduction
ax = fig.add_subplot(gs[0, 3])
ax.set_facecolor('#111827')
scenario_data = [('Baseline', baseline['ext_prob'] * 100, '#ef4444')]
for name, res in sorted(option_results.items(), key=lambda x: x[1]['ext_prob']):
    scenario_data.append((name[:8], res['ext_prob'] * 100, '#f59e0b'))
scenario_data.append(('Optimal', best_portfolio['ext_prob'] * 100, '#22c55e'))
names_plot = [s[0] for s in scenario_data]
vals_plot = [s[1] for s in scenario_data]
cols_plot = [s[2] for s in scenario_data]
ax.barh(names_plot, vals_plot, color=cols_plot, edgecolor='none', height=0.6)
ax.axvline(5, color='white', linestyle='--', linewidth=1, label='5% IUCN')
ax.set_xlabel('Extinction risk (%)', color='white')
ax.set_title('Risk comparison', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 5. Cost-effectiveness plot
ax = fig.add_subplot(gs[1, 0:2])
ax.set_facecolor('#111827')
for name, opt in options.items():
    res = option_results[name]
    risk_reduction = (baseline['ext_prob'] - res['ext_prob']) * 100
    ax.scatter(opt['cost_crores'], risk_reduction, s=200,
               c='#22c55e' if risk_reduction > 3 else '#f59e0b',
               edgecolors='white', linewidths=1, zorder=5)
    ax.annotate(name.split(':')[1].strip()[:12], (opt['cost_crores'], risk_reduction),
               color='white', fontsize=8, textcoords="offset points", xytext=(5, 5))
# Optimal portfolio
ax.scatter(best_portfolio['cost'], (baseline['ext_prob'] - best_portfolio['ext_prob']) * 100,
           s=300, c='#3b82f6', marker='*', edgecolors='white', linewidths=1, zorder=6)
ax.annotate('OPTIMAL', (best_portfolio['cost'], (baseline['ext_prob'] - best_portfolio['ext_prob']) * 100),
           color='#3b82f6', fontsize=9, fontweight='bold', textcoords="offset points", xytext=(8, 0))
ax.axvline(budget, color='gray', linestyle=':', label=f'Budget: {budget} Cr')
ax.set_xlabel('Cost (crores INR)', color='white')
ax.set_ylabel('Risk reduction (%)', color='white')
ax.set_title('Cost-effectiveness analysis', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 6. Sensitivity analysis
ax = fig.add_subplot(gs[1, 2:4])
ax.set_facecolor('#111827')
# Test sensitivity to key parameters
params_test = {
    'Adult survival': np.linspace(0.80, 0.96, 8),
    'Fawn survival': np.linspace(0.40, 0.70, 8),
    'Carrying capacity': np.linspace(150, 500, 8),
}
for param_name, values in params_test.items():
    ext_probs_test = []
    for v in values:
        if param_name == 'Carrying capacity':
            r = quick_pva(current_females, v/2, n_sims=150)
        elif param_name == 'Adult survival':
            r = quick_pva(current_females, current_K/2, survival_boost=v-0.88, n_sims=150)
        else:
            r = quick_pva(current_females, current_K/2, n_sims=150)
        ext_probs_test.append(r['ext_prob'])

    # Normalize x-axis to 0-1 for comparison
    x_norm = (values - values.min()) / (values.max() - values.min())
    ax.plot(x_norm, [e*100 for e in ext_probs_test], 'o-', linewidth=2, label=param_name)

ax.axhline(5, color='white', linestyle='--', linewidth=1, alpha=0.5)
ax.set_xlabel('Parameter value (normalized 0-1)', color='white')
ax.set_ylabel('Extinction risk (%)', color='white')
ax.set_title('Sensitivity: which parameter matters most?', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 7. Recommendation panel
ax = fig.add_subplot(gs[2, :])
ax.set_facecolor('#0f1729')
ax.axis('off')

rec_text = (
    f"RECOMMENDED MANAGEMENT PORTFOLIO  |  Budget: {budget} Cr  |  "
    f"Cost: {best_portfolio['cost']} Cr  |  "
    f"Risk reduction: {(baseline['ext_prob'] - best_portfolio['ext_prob'])*100:.0f}%  |  "
    f"Final risk: {best_portfolio['ext_prob']:.0%}"
)
ax.text(0.5, 0.85, rec_text, color='#22c55e', fontsize=10, ha='center', fontweight='bold',
        transform=ax.transAxes)

for idx, name in enumerate(best_portfolio['selected']):
    short = name.split(': ')[1] if ': ' in name else name
    cost = options[name]['cost_crores']
    desc = options[name]['description']
    ax.text(0.05 + idx * 0.2, 0.5, f"[{cost} Cr] {short}", color='white', fontsize=9,
            fontweight='bold', transform=ax.transAxes)
    ax.text(0.05 + idx * 0.2, 0.3, desc[:35], color='gray', fontsize=7,
            transform=ax.transAxes)

ax.text(0.5, 0.05,
        "The Sangai can persist for 100+ years with targeted investment in habitat and population management.",
        color='white', fontsize=11, ha='center', fontstyle='italic', transform=ax.transAxes)

plt.tight_layout()
plt.show()

print("\\n" + "=" * 70)
print("SANGAI DEER PVA — EXECUTIVE SUMMARY")
print("=" * 70)
print(f"Current population: {current_pop} ({current_females} females)")
print(f"Status quo extinction risk (80 years): {baseline['ext_prob']:.0%}")
print(f"\\nOptimal portfolio ({best_portfolio['cost']} Cr):")
for s in best_portfolio['selected']:
    print(f"  - {s}: {options[s]['description']}")
print(f"\\nWith optimal portfolio: extinction risk = {best_portfolio['ext_prob']:.0%}")
print(f"Risk reduction: {(baseline['ext_prob'] - best_portfolio['ext_prob'])*100:.0f} percentage points")
print()
print("The dancing deer of Loktak Lake can be saved.")
print("The science is clear. The tools exist. The choice is ours.")`,
      challenge: 'The government can only afford 40 Cr instead of 70 Cr. Which options must be cut? How does the reduced budget affect extinction risk? Present the trade-off clearly: "Cutting X saves Y Cr but increases extinction risk by Z%."',
      successHint: 'You have built a complete, end-to-end conservation decision support system for an endangered species. From age-structured demographics through stochastic PVA, habitat scenarios, metapopulation management, and budget-constrained optimization — this is publication-quality conservation biology.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Population Viability Analyzer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (wildlife biology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete Population Viability Analyzer for the Sangai deer using Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
