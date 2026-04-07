import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MautamFamineLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Stochastic population dynamics',
      concept: `Real populations do not follow smooth equations. **Stochastic** (random) effects matter, especially when populations are small:

- **Demographic stochasticity**: random variation in individual births and deaths
- **Environmental stochasticity**: random fluctuations in weather, food, disease

We model this by adding noise to the deterministic equations:
\`P(t+1) = P(t) + r × P(t) × (1 - P(t)/K) + σ × P(t) × ξ(t)\`

Where ξ(t) is random noise (drawn from a normal distribution) and σ controls noise strength.

With stochasticity, two identical populations starting from the same point can end up very different. We must run **many simulations** (Monte Carlo) and analyze the distribution of outcomes.

📚 *numpy's \`np.random.normal()\` generates arrays of random numbers. Running many simulations in a loop and storing results in a 2D array lets us compute confidence intervals.*`,
      analogy: 'Deterministic equations are like driving on a highway with perfect conditions — you arrive at a predictable time. Stochastic models are like driving in fog with random traffic: your average arrival time is the same, but each trip is different. Some trips are smooth; others hit unexpected delays.',
      storyConnection: 'The 1959 and 2007 Mautam events had similar triggers but very different outcomes — partly due to human intervention but also due to random ecological factors: rainfall timing, wind patterns carrying seeds, natural disease outbreaks in rat populations. Stochastic models capture this real-world variability.',
      checkQuestion: 'Why does demographic stochasticity matter more for small populations than large ones?',
      checkAnswer: 'In a population of 1,000, if births randomly fluctuate by ±5%, the population changes by ±50 — a manageable variation. In a population of 10, a ±5% fluctuation is ±0.5 individuals, but since you cannot have half a rat, the actual fluctuation is ±1 out of 10 = ±10%. Random effects are proportionally larger in small populations.',
      codeIntro: 'Run Monte Carlo simulations of Mautam rat populations with random variation.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

np.random.seed(42)
n_sims = 200
months = 36
K_base = 5000

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

for ax, sigma, title in [(ax1, 0.05, 'Low noise (σ=0.05)'),
                          (ax2, 0.25, 'High noise (σ=0.25)')]:
    ax.set_facecolor('#1f2937')
    all_pops = np.zeros((n_sims, months + 1))

    for sim in range(n_sims):
        P = 2000.0
        pops = [P]
        for m in range(months):
            K = K_base * (10 if 8 <= m <= 18 else 1)
            r = 0.2
            noise = np.random.normal(0, sigma)
            dP = r * P * (1 - P / K) + sigma * P * noise
            P = max(P + dP, 10)
            pops.append(P)
        all_pops[sim] = pops

    t = np.arange(months + 1)
    median = np.median(all_pops, axis=0)
    p10 = np.percentile(all_pops, 10, axis=0)
    p90 = np.percentile(all_pops, 90, axis=0)
    p25 = np.percentile(all_pops, 25, axis=0)
    p75 = np.percentile(all_pops, 75, axis=0)

    # Plot individual trajectories (faded)
    for sim in range(min(30, n_sims)):
        ax.plot(t, all_pops[sim] / 1000, color='#34d399', alpha=0.05, linewidth=0.5)

    ax.fill_between(t, p10/1000, p90/1000, alpha=0.2, color='#34d399', label='10-90% range')
    ax.fill_between(t, p25/1000, p75/1000, alpha=0.3, color='#34d399', label='25-75% range')
    ax.plot(t, median/1000, color='#34d399', linewidth=2.5, label='Median')

    ax.set_xlabel('Month', color='lightgray')
    ax.set_ylabel('Population (thousands)', color='lightgray')
    ax.set_title(title, color='white', fontsize=12, fontweight='bold')
    ax.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=8)
    ax.tick_params(colors='lightgray')
    for s in ax.spines.values(): s.set_color('#374151')

    peak_pops = np.max(all_pops[:, 15:25], axis=1)
    print(f"{title}:")
    print(f"  Peak population — Median: {np.median(peak_pops):,.0f}, Range: {np.min(peak_pops):,.0f} to {np.max(peak_pops):,.0f}")
    print(f"  Coefficient of variation: {np.std(peak_pops)/np.mean(peak_pops)*100:.1f}%")

plt.suptitle('Stochastic Mautam Simulations (200 runs each)',
             color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('/tmp/mautam_stochastic.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()`,
      challenge: 'Add a third scenario where the noise is correlated in time (each month\'s noise is 0.7 × last month\'s noise + 0.3 × new random). How does temporal correlation change the spread of outcomes? This models persistent weather patterns.',
      successHint: 'You ran Monte Carlo simulations — the gold standard for understanding uncertainty in complex systems. The confidence intervals show that even with the same average dynamics, individual outcomes vary widely. This is why predicting exact Mautam impacts is inherently uncertain.',
    },
    {
      title: 'Age-structured population models',
      concept: `Not all rats are equal. **Age structure** matters because:
- Juveniles cannot reproduce
- Adults have the highest reproductive rate
- Elderly individuals have higher death rates

The **Leslie matrix** models age-structured populations:

\`N(t+1) = L × N(t)\`

Where N is a vector of population counts by age class, and L is the Leslie matrix:

\`L = [[f₁, f₂, f₃],    ← fecundity (births per individual)
      [s₁, 0,  0 ],    ← survival from age 1 to 2
      [0,  s₂, 0 ]]    ← survival from age 2 to 3\`

The **dominant eigenvalue** of L gives the long-term growth rate. The corresponding **eigenvector** gives the stable age distribution.

📚 *numpy's \`np.dot()\` or \`@\` operator performs matrix-vector multiplication. This is the core operation for age-structured models — one matrix multiply per time step.*`,
      analogy: 'An age-structured model is like tracking a school\'s enrollment. Each year, some kindergarteners advance to 1st grade (survival), new kindergarteners enroll (births from adult alumni), and some seniors graduate (removal). The Leslie matrix is the school\'s "flow chart" of how students move through grades.',
      storyConnection: 'During the Mautam, the age structure of the rat population shifts dramatically. Abundant food means more juveniles survive, more adults breed, and elderly rats live longer. The population becomes "young and breeding" — the most explosive demographic profile possible.',
      checkQuestion: 'Why does the dominant eigenvalue of the Leslie matrix determine the long-term growth rate?',
      checkAnswer: 'After many time steps, the population vector becomes dominated by the eigenvector corresponding to the largest eigenvalue. All other components decay relative to this one. The growth rate per time step converges to this eigenvalue. If it is > 1, the population grows; if < 1, it shrinks; if = 1, it is stable.',
      codeIntro: 'Build a Leslie matrix model for the Mautam rat population with three age classes.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Age classes: juvenile (0-2 months), adult (2-8 months), old (8+ months)
# Normal conditions
L_normal = np.array([
    [0.0, 2.5, 0.5],   # fecundity
    [0.6, 0.0, 0.0],   # juvenile → adult survival
    [0.0, 0.7, 0.3]    # adult → old survival
])

# Mautam conditions (more food → higher survival and fecundity)
L_mautam = np.array([
    [0.0, 5.0, 1.5],
    [0.9, 0.0, 0.0],
    [0.0, 0.85, 0.5]
])

months = 36
N = np.array([100.0, 50.0, 20.0])  # initial age distribution

populations = np.zeros((months + 1, 3))
populations[0] = N
totals = [N.sum()]

for m in range(months):
    L = L_mautam if 8 <= m <= 20 else L_normal
    N = L @ N
    # Apply carrying capacity ceiling
    total = N.sum()
    if total > 100000:
        N *= 100000 / total
    populations[m + 1] = N
    totals.append(N.sum())

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#111827')

t = np.arange(months + 1)

# Total population
ax1.set_facecolor('#1f2937')
ax1.plot(t, [p/1000 for p in totals], color='white', linewidth=2.5, label='Total')
ax1.set_ylabel('Population (thousands)', color='lightgray')
ax1.set_title('Age-Structured Rat Population During Mautam', color='white', fontsize=13, fontweight='bold')
ax1.axvspan(8, 20, alpha=0.15, color='#fbbf24', label='Mautam period')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Age distribution over time (stacked)
ax2.set_facecolor('#1f2937')
ax2.stackplot(t, populations[:, 0]/1000, populations[:, 1]/1000, populations[:, 2]/1000,
              colors=['#34d399', '#fbbf24', '#f87171'], alpha=0.8,
              labels=['Juvenile', 'Adult', 'Old'])
ax2.set_xlabel('Month', color='lightgray')
ax2.set_ylabel('Population (thousands)', color='lightgray')
ax2.set_title('Age Distribution Over Time', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/mautam_leslie.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

# Eigenvalue analysis
eigenvalues = np.linalg.eigvals(L_normal)
dom_normal = max(abs(eigenvalues))
eigenvalues = np.linalg.eigvals(L_mautam)
dom_mautam = max(abs(eigenvalues))
print(f"Dominant eigenvalue (normal): {dom_normal:.3f} → {'growing' if dom_normal > 1 else 'stable/declining'}")
print(f"Dominant eigenvalue (Mautam): {dom_mautam:.3f} → {'growing' if dom_mautam > 1 else 'stable/declining'}")
print(f"\\nMautam growth rate is {dom_mautam/dom_normal:.1f}x the normal rate")`,
      challenge: 'What if a disease selectively kills adult rats (reduce adult survival from 0.85 to 0.3 during months 15-20)? How does targeting the reproductive age class affect population growth compared to killing an equal number of juveniles?',
      successHint: 'You built a Leslie matrix model — the standard tool for structured population analysis. The eigenvalue analysis reveals the deep mathematical structure underlying population growth. This technique is used for endangered species management, fisheries, and demographic forecasting.',
    },
    {
      title: 'Multi-species ecosystem simulation',
      concept: `The Mautam ecosystem involves multiple interacting species. We model this with a system of coupled differential equations:

\`dB/dt = -μB\` (bamboo dies after flowering)
\`dS/dt = β₁B - β₂SR - δ_sS\` (seeds produced by bamboo, eaten by rats)
\`dR/dt = α₁SR + α₂RC - β₃RF - δ_rR(R/K)\` (rats eat seeds and crops, killed by predators)
\`dF/dt = γRF - δ_fF\` (predators grow from eating rats)
\`dC/dt = g(1 - C/C_max) - β₄RC\` (crops grow logistically, eaten by rats)

This is a 5-species model with 12+ parameters. Solving it requires careful numerical integration.

📚 *Systems of ODEs are solved by tracking all state variables simultaneously. At each time step, we compute all derivatives and update all variables together.*`,
      analogy: 'A multi-species model is like a stock market simulation with 5 interconnected companies. When Company A (bamboo) goes bankrupt, Company B (seeds) spikes, Company C (rats) buys B\'s assets and grows, Company D (predators) invests in C, and Company E (crops) crashes because C is taking all its resources. Everything is linked.',
      storyConnection: 'The Mautam is not just about rats — it is about an entire ecosystem shifting state. Bamboo, seeds, rats, predators, and crops form an interconnected web. Understanding any single species requires modeling all of them together. This systems-level thinking is what makes ecology so challenging and fascinating.',
      checkQuestion: 'Why is a 5-species model harder to analyze than simply scaling up the 2-species Lotka-Volterra model?',
      checkAnswer: 'With 2 species, you have 2 equations and can analyze equilibria graphically. With 5 species, you have 5 coupled equations in 5-dimensional space — impossible to visualize. The number of possible equilibria and stability conditions grows combinatorially. Numerical simulation becomes essential because analytical solutions rarely exist.',
      codeIntro: 'Simulate the complete 5-species Mautam ecosystem dynamics.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

dt = 0.01
months = 48
steps = int(months / dt)
t = np.linspace(0, months, steps)

# State: [Bamboo, Seeds, Rats, Predators, Crops]
state = np.zeros((steps, 5))
state[0] = [100, 5, 200, 20, 80]  # initial conditions

# Parameters
params = {
    'bamboo_death': 0.05,
    'seed_prod': 0.8, 'seed_decay': 0.1, 'seed_eat': 0.0003,
    'rat_from_seed': 0.0005, 'rat_from_crop': 0.0002,
    'rat_death': 0.05, 'rat_K': 50000, 'predation': 0.003,
    'pred_efficiency': 0.0004, 'pred_death': 0.15,
    'crop_grow': 0.1, 'crop_max': 100, 'crop_eat': 0.0001
}

for i in range(steps - 1):
    B, S, R, F, C = state[i]
    p = params

    # Mautam trigger: bamboo flowers at month 8
    flowering = 1.0 if 8 <= t[i] <= 12 else 0.0

    dB = -p['bamboo_death'] * B * (1 + 3 * flowering)  # dies faster when flowering
    dS = p['seed_prod'] * B * flowering - p['seed_decay'] * S - p['seed_eat'] * S * R
    dR = (p['rat_from_seed'] * S * R + p['rat_from_crop'] * R * C
          - p['predation'] * R * F - p['rat_death'] * R * (R / p['rat_K']))
    dF = p['pred_efficiency'] * R * F - p['pred_death'] * F
    dC = p['crop_grow'] * C * (1 - C / p['crop_max']) - p['crop_eat'] * R * C

    state[i+1] = np.maximum(state[i] + np.array([dB, dS, dR, dF, dC]) * dt, 0.1)

fig, axes = plt.subplots(3, 1, figsize=(10, 10))
fig.patch.set_facecolor('#111827')

# Bamboo and Seeds
ax = axes[0]
ax.set_facecolor('#1f2937')
ax.plot(t, state[:, 0], color='#22c55e', linewidth=2, label='Bamboo')
ax.plot(t, state[:, 1], color='#86efac', linewidth=2, label='Seeds')
ax.axvspan(8, 12, alpha=0.15, color='#fbbf24')
ax.set_ylabel('Biomass', color='lightgray')
ax.set_title('Bamboo & Seeds', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax.tick_params(colors='lightgray')
for s in ax.spines.values(): s.set_color('#374151')

# Rats and Predators
ax = axes[1]
ax.set_facecolor('#1f2937')
ax.plot(t, state[:, 2], color='#f87171', linewidth=2, label='Rats')
ax_twin = ax.twinx()
ax_twin.plot(t, state[:, 3], color='#a78bfa', linewidth=2, label='Predators')
ax.axvspan(8, 12, alpha=0.15, color='#fbbf24')
ax.set_ylabel('Rat population', color='#f87171')
ax_twin.set_ylabel('Predator population', color='#a78bfa')
ax.set_title('Rats & Predators', color='white', fontsize=12, fontweight='bold')
lines1, labels1 = ax.get_legend_handles_labels()
lines2, labels2 = ax_twin.get_legend_handles_labels()
ax.legend(lines1+lines2, labels1+labels2, facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax.tick_params(colors='lightgray'); ax_twin.tick_params(colors='lightgray')
for s in ax.spines.values(): s.set_color('#374151')

# Crops
ax = axes[2]
ax.set_facecolor('#1f2937')
ax.plot(t, state[:, 4], color='#fbbf24', linewidth=2.5, label='Crop survival')
ax.fill_between(t, state[:, 4], alpha=0.2, color='#fbbf24')
ax.axvspan(8, 12, alpha=0.15, color='#fbbf24', label='Flowering')
ax.axhline(30, color='#f87171', linestyle='--', label='Famine threshold')
ax.set_xlabel('Month', color='lightgray')
ax.set_ylabel('Crop index', color='lightgray')
ax.set_title('Crop Survival', color='white', fontsize=12, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax.tick_params(colors='lightgray')
for s in ax.spines.values(): s.set_color('#374151')

plt.suptitle('5-Species Mautam Ecosystem Simulation', color='white', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('/tmp/mautam_ecosystem.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

famine_months = np.sum(state[:, 4] < 30) * dt
print(f"Months below famine threshold: {famine_months:.1f}")
print(f"Peak rat population: {state[:, 2].max():.0f} at month {t[np.argmax(state[:, 2])]:.1f}")
print(f"Crop minimum: {state[:, 4].min():.1f} at month {t[np.argmin(state[:, 4])]:.1f}")`,
      challenge: 'Add a sixth species: a disease that spreads among rats when their density exceeds a threshold. Model it as an SIR epidemic within the rat population. How does disease change the ecosystem dynamics?',
      successHint: 'You simulated a 5-species ecosystem with coupled differential equations. This systems-level modeling is how ecologists study real ecosystems — not one species at a time, but all together, because everything is connected.',
    },
    {
      title: 'Sensitivity analysis — which parameters matter most?',
      concept: `With 12+ parameters, how do we know which ones matter most? **Sensitivity analysis** measures how much the output changes when each parameter varies:

**Local sensitivity**: perturb one parameter by a small amount (±10%) and measure the change in output:
\`S_i = (ΔOutput / Output) / (ΔParam / Param)\`

If S_i > 1, the output is more sensitive to that parameter than the parameter change — it is a **critical parameter**.

**Global sensitivity** (Sobol indices): vary all parameters simultaneously across their full ranges and decompose the output variance. This captures nonlinear interactions.

📚 *We automate sensitivity analysis by running many simulations in a loop, each with one parameter perturbed. numpy's vectorized operations make this efficient.*`,
      analogy: 'Sensitivity analysis is like adjusting the knobs on an amplifier. Most knobs change the sound a little. But one knob (the volume) changes everything dramatically. Sensitivity analysis identifies which ecological "knobs" are the volume controls — the ones that decision-makers should focus on.',
      storyConnection: 'For Mautam preparedness, sensitivity analysis answers crucial questions: Does the exact timing of the flowering matter more than its duration? Is the rat birth rate or the predation rate more important? Limited resources should target the most sensitive parameters.',
      checkQuestion: 'Why is local sensitivity analysis sometimes misleading?',
      checkAnswer: 'Local analysis only measures the effect of small perturbations around the current parameter values. If the system is nonlinear (which ecological systems always are), a parameter might be insensitive at its current value but highly sensitive at a different value. Global sensitivity analysis avoids this by exploring the full parameter space.',
      codeIntro: 'Perform local sensitivity analysis on the Mautam ecosystem model to identify the most critical parameters.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

def run_simulation(params, months=36):
    dt = 0.05
    steps = int(months / dt)
    R = 200.0  # rats
    C = 80.0   # crops
    p = params

    for i in range(steps):
        t = i * dt
        food = 10.0 if 8 <= t <= 18 else 1.0
        dR = p['birth'] * food * R * (1 - R/p['K']) - p['predation'] * R - p['death'] * R
        dC = p['crop_grow'] * C * (1 - C/100) - p['crop_eat'] * R * C
        R = max(R + dR * dt, 1)
        C = max(C + dC * dt, 0)

    return C  # final crop level (our output of interest)

# Baseline parameters
baseline = {
    'birth': 0.15,
    'K': 50000,
    'predation': 30,
    'death': 0.05,
    'crop_grow': 0.1,
    'crop_eat': 0.0001,
}

base_output = run_simulation(baseline)
print(f"Baseline crop survival: {base_output:.2f}")
print()

# Local sensitivity analysis: perturb each parameter by ±20%
perturbation = 0.2
sensitivities = {}

print("LOCAL SENSITIVITY ANALYSIS")
print("=" * 60)
print(f"{'Parameter':<15} {'Base':>8} {'-20%':>10} {'+20%':>10} {'Sensitivity':>12}")
print("-" * 60)

for param_name in baseline:
    results = []
    for factor in [1 - perturbation, 1 + perturbation]:
        modified = baseline.copy()
        modified[param_name] = baseline[param_name] * factor
        results.append(run_simulation(modified))

    # Sensitivity index
    delta_output = results[1] - results[0]
    delta_param = 2 * perturbation  # from -20% to +20%
    sensitivity = abs((delta_output / base_output) / delta_param)
    sensitivities[param_name] = sensitivity

    print(f"{param_name:<15} {baseline[param_name]:>8.4f} {results[0]:>10.2f} {results[1]:>10.2f} {sensitivity:>12.3f}")

# Visualization
fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#111827')
ax.set_facecolor('#1f2937')

params_sorted = sorted(sensitivities, key=sensitivities.get, reverse=True)
values_sorted = [sensitivities[p] for p in params_sorted]
colors = ['#f87171' if v > 1 else '#fbbf24' if v > 0.5 else '#34d399' for v in values_sorted]

bars = ax.barh(params_sorted, values_sorted, color=colors, edgecolor='none', height=0.6)
ax.axvline(1.0, color='white', linestyle='--', alpha=0.5, linewidth=1)
ax.set_xlabel('Sensitivity Index', color='lightgray', fontsize=12)
ax.set_title('Parameter Sensitivity — Which Knobs Matter Most?',
             color='white', fontsize=13, fontweight='bold')
ax.tick_params(colors='lightgray')
for s in ax.spines.values(): s.set_color('#374151')

# Color legend
ax.text(0.98, 0.02, 'Red: critical (>1)  Yellow: moderate  Green: low',
        transform=ax.transAxes, color='lightgray', fontsize=9, ha='right', va='bottom')

plt.tight_layout()
plt.savefig('/tmp/mautam_sensitivity.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print(f"\\nMost critical parameter: {params_sorted[0]} (sensitivity = {sensitivities[params_sorted[0]]:.3f})")
print(f"Least critical parameter: {params_sorted[-1]} (sensitivity = {sensitivities[params_sorted[-1]]:.3f})")`,
      challenge: 'Implement global sensitivity analysis: vary all parameters simultaneously (sample 500 random combinations within ±30% of baseline). Which parameter explains the most variance in crop survival? Does it agree with the local analysis?',
      successHint: 'You performed sensitivity analysis — a critical tool for any model-based decision-making. In ecology, medicine, engineering, and climate science, identifying which parameters matter most guides where to focus research and intervention.',
    },
    {
      title: 'Bifurcation analysis — tipping points in the ecosystem',
      concept: `A **bifurcation** is a sudden qualitative change in system behavior when a parameter crosses a threshold. The ecosystem can have **multiple stable states**:

- **Healthy state**: rats controlled, crops abundant
- **Collapse state**: rats dominate, crops destroyed

Between these states is a **tipping point** (bifurcation). Once crossed, the system may not return even if the parameter is restored — this is called **hysteresis**.

We map bifurcation diagrams by slowly varying a parameter and tracking which stable state the system reaches.

📚 *Bifurcation diagrams plot the long-term behavior (equilibrium) as a function of a parameter. We compute these by running simulations to steady state for many parameter values.*`,
      analogy: 'A bifurcation is like tipping a canoe. You can lean slightly and the canoe stays stable (one equilibrium). Lean past the tipping point and the canoe flips to an entirely different state (capsized). Getting back requires more than just leaning the other way — you need to right the canoe completely. This is hysteresis.',
      storyConnection: 'The Mautam may represent a bifurcation in the Mizoram ecosystem. If the rat population exceeds a critical threshold, the system tips from "agriculture viable" to "famine state." The question is whether this tipping point is predictable and whether early intervention can prevent the system from crossing it.',
      checkQuestion: 'What is the practical difference between a system with and without hysteresis for Mautam management?',
      checkAnswer: 'Without hysteresis: if you reduce the rat population below the tipping point, crops recover automatically. With hysteresis: even after reducing rats, the crop ecosystem may be so damaged that it cannot recover on its own — you need active replanting and rebuilding. Hysteresis means damage is harder to undo than to prevent.',
      codeIntro: 'Map the bifurcation diagram showing how rat birth rate determines whether crops survive or collapse.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

def find_equilibrium(birth_rate, initial_crop, months=60):
    dt = 0.05
    R = 200.0
    C = initial_crop
    K = 50000

    for i in range(int(months / dt)):
        t = i * dt
        food = 5.0 if 8 <= t <= 20 else 1.0  # Mautam pulse
        dR = birth_rate * food * R * (1 - R/K) - 30 * R - 0.05 * R
        dC = 0.1 * C * (1 - C/100) - 0.0001 * R * C
        R = max(R + dR * dt, 1)
        C = max(C + dC * dt, 0)

    return C, R

birth_rates = np.linspace(0.05, 0.30, 100)

# Forward sweep (increasing birth rate, starting from healthy state)
forward_crops = []
forward_rats = []
for br in birth_rates:
    c, r = find_equilibrium(br, initial_crop=80)
    forward_crops.append(c)
    forward_rats.append(r)

# Backward sweep (decreasing birth rate, starting from collapsed state)
backward_crops = []
backward_rats = []
for br in reversed(birth_rates):
    c, r = find_equilibrium(br, initial_crop=5)
    backward_crops.append(c)
    backward_rats.append(r)
backward_crops.reverse()
backward_rats.reverse()

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#111827')

# Crop bifurcation
ax1.set_facecolor('#1f2937')
ax1.plot(birth_rates, forward_crops, color='#34d399', linewidth=2.5,
         label='Forward (healthy → collapse)')
ax1.plot(birth_rates, backward_crops, color='#f87171', linewidth=2.5,
         linestyle='--', label='Backward (collapse → recovery)')
ax1.fill_between(birth_rates, forward_crops, backward_crops,
                  where=[f != b for f, b in zip(forward_crops, backward_crops)],
                  alpha=0.1, color='#fbbf24')
ax1.set_ylabel('Final crop level', color='lightgray', fontsize=11)
ax1.set_title('Bifurcation Diagram — Crop Survival vs Rat Birth Rate',
              color='white', fontsize=13, fontweight='bold')
ax1.axhline(30, color='#fbbf24', linestyle=':', label='Famine threshold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Rat equilibrium
ax2.set_facecolor('#1f2937')
ax2.plot(birth_rates, [r/1000 for r in forward_rats], color='#34d399', linewidth=2.5,
         label='Forward')
ax2.plot(birth_rates, [r/1000 for r in backward_rats], color='#f87171', linewidth=2.5,
         linestyle='--', label='Backward')
ax2.set_xlabel('Rat birth rate parameter', color='lightgray', fontsize=11)
ax2.set_ylabel('Equilibrium rat pop (thousands)', color='lightgray', fontsize=11)
ax2.set_title('Rat Population Equilibria', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/mautam_bifurcation.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

# Find tipping point
for i, (fc, bc) in enumerate(zip(forward_crops, backward_crops)):
    if fc < 30 and i > 0 and forward_crops[i-1] >= 30:
        print(f"Forward tipping point: birth rate ≈ {birth_rates[i]:.3f}")
for i, (fc, bc) in enumerate(zip(backward_crops, backward_crops)):
    if bc > 30 and i > 0 and backward_crops[i-1] <= 30:
        print(f"Recovery point: birth rate ≈ {birth_rates[i]:.3f}")
print("\\nHysteresis: recovery requires a LOWER birth rate than collapse.")
print("Prevention is easier than cure — stop the rats before the tipping point.")`,
      challenge: 'Add a second bifurcation parameter: the predation rate. Create a 2D bifurcation map (birth rate vs predation rate) showing regions of "crops survive" vs "crops collapse." This phase diagram guides intervention strategy.',
      successHint: 'You performed bifurcation analysis — revealing tipping points and hysteresis in the Mautam ecosystem. This is one of the most important concepts in complex systems science: sometimes gradual changes cause sudden, irreversible shifts. Identifying these thresholds before they are crossed is the key to prevention.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Ecological Modeling</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
