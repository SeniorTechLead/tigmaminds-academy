import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TejimolaLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Part 1 — Defining the tissue culture experiment model',
      concept: `Your capstone is a **Tissue Culture Experiment Planner**: a computational tool that predicts success rates for plant regeneration experiments based on species, hormone concentrations, and media composition.

This tool addresses a real bottleneck in plant biotechnology: tissue culture protocols are largely developed by trial-and-error, with each new species requiring months of optimization. A predictive model could dramatically accelerate protocol development.

The model integrates:
- **Species-specific parameters**: regeneration capacity varies 100-fold between species
- **Hormone dose-response curves**: auxin and cytokinin effects are nonlinear
- **Media composition effects**: salt strength, sugar concentration, gelling agent
- **Environmental factors**: temperature, light, photoperiod
- **Genotype effects**: different cultivars of the same species can behave very differently

We build this as a **response surface model** — mapping the multi-dimensional input space (all parameters) to the output space (callus induction %, shoot regeneration %, root formation %, acclimatization survival %).`,
      analogy: 'The experiment planner is like a GPS for tissue culture. Instead of randomly trying every route (hormone combination), you enter your destination (desired outcome), and the model calculates the optimal path (protocol) and estimated time of arrival (success rate). It does not guarantee success, but it dramatically narrows the search space.',
      storyConnection: 'Tejimola\'s story of regeneration from plant tissue becomes a design challenge: given a specific plant species and a desired outcome (complete regeneration), what conditions would maximize the probability of success? The experiment planner turns myth into method.',
      checkQuestion: 'Why is tissue culture success prediction so difficult compared to, say, predicting chemical reaction yields?',
      checkAnswer: 'Chemical reactions involve well-characterized molecules following thermodynamic laws. Tissue culture involves living cells with: (1) genetic variability between individual explants, (2) epigenetic variability from culture conditions, (3) age-dependent responses, (4) non-linear hormone interactions, (5) contamination as a stochastic variable, and (6) species-specific differences that are poorly understood at the molecular level. The system has too many interacting variables and too much biological noise for simple deterministic models. This is why we use probabilistic (Monte Carlo) approaches.',
      codeIntro: 'Build the species database and response surface model for tissue culture success prediction.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# TISSUE CULTURE EXPERIMENT PLANNER — Part 1
# Species Database & Response Surface Model
# =====================================================

# Species-specific tissue culture parameters
SPECIES_DB = {
    'Banana (Musa)': {
        'regeneration_ease': 0.85,  # 0-1 scale
        'optimal_auxin': 2.0,       # mg/L
        'optimal_cytokinin': 4.0,
        'optimal_sucrose': 30,      # g/L
        'optimal_temp': 27,         # °C
        'callus_weeks': 3,
        'shoot_weeks': 5,
        'root_weeks': 3,
        'acclimatization_survival': 0.85,
    },
    'Rice (Oryza)': {
        'regeneration_ease': 0.90,
        'optimal_auxin': 2.5,
        'optimal_cytokinin': 0.5,
        'optimal_sucrose': 30,
        'optimal_temp': 25,
        'callus_weeks': 2,
        'shoot_weeks': 4,
        'root_weeks': 3,
        'acclimatization_survival': 0.90,
    },
    'Tea (Camellia)': {
        'regeneration_ease': 0.25,
        'optimal_auxin': 1.0,
        'optimal_cytokinin': 2.0,
        'optimal_sucrose': 20,
        'optimal_temp': 24,
        'callus_weeks': 6,
        'shoot_weeks': 10,
        'root_weeks': 6,
        'acclimatization_survival': 0.50,
    },
    'Orchid (Dendrobium)': {
        'regeneration_ease': 0.70,
        'optimal_auxin': 0.5,
        'optimal_cytokinin': 3.0,
        'optimal_sucrose': 25,
        'optimal_temp': 25,
        'callus_weeks': 4,
        'shoot_weeks': 8,
        'root_weeks': 4,
        'acclimatization_survival': 0.75,
    },
    'Mango (Mangifera)': {
        'regeneration_ease': 0.30,
        'optimal_auxin': 3.0,
        'optimal_cytokinin': 1.5,
        'optimal_sucrose': 30,
        'optimal_temp': 26,
        'callus_weeks': 5,
        'shoot_weeks': 12,
        'root_weeks': 8,
        'acclimatization_survival': 0.55,
    },
    'Potato (Solanum)': {
        'regeneration_ease': 0.92,
        'optimal_auxin': 0.1,
        'optimal_cytokinin': 2.0,
        'optimal_sucrose': 30,
        'optimal_temp': 22,
        'callus_weeks': 2,
        'shoot_weeks': 3,
        'root_weeks': 2,
        'acclimatization_survival': 0.92,
    },
}

def predict_success(species_name, auxin, cytokinin, sucrose, temp,
                    contamination_rate=0.05, genotype_factor=1.0):
    """
    Predict tissue culture success rates for given conditions.
    Returns dict with stage-specific probabilities.
    """
    sp = SPECIES_DB[species_name]
    base = sp['regeneration_ease'] * genotype_factor

    # Hormone response (Gaussian around optimum)
    auxin_factor = np.exp(-((auxin - sp['optimal_auxin'])**2) / (2 * 1.5**2))
    cyt_factor = np.exp(-((cytokinin - sp['optimal_cytokinin'])**2) / (2 * 1.5**2))
    hormone_factor = auxin_factor * cyt_factor

    # Sucrose response
    sucrose_factor = np.exp(-((sucrose - sp['optimal_sucrose'])**2) / (2 * 10**2))

    # Temperature response
    temp_factor = np.exp(-((temp - sp['optimal_temp'])**2) / (2 * 4**2))

    # Contamination (cumulative over weeks)
    total_weeks = sp['callus_weeks'] + sp['shoot_weeks'] + sp['root_weeks']
    survival_contam = (1 - contamination_rate) ** total_weeks

    # Stage probabilities
    callus_prob = base * hormone_factor * sucrose_factor * temp_factor * 0.95
    shoot_prob = callus_prob * (cyt_factor ** 0.5) * 0.85
    root_prob = shoot_prob * (auxin_factor ** 0.5) * 0.80
    acclimatization = root_prob * sp['acclimatization_survival']
    overall = acclimatization * survival_contam

    return {
        'callus': min(callus_prob, 0.99),
        'shoot': min(shoot_prob, 0.99),
        'root': min(root_prob, 0.99),
        'acclimatization': min(acclimatization, 0.99),
        'overall': min(overall, 0.99),
        'total_weeks': total_weeks + 4,  # +4 for acclimatization
        'contamination_survival': survival_contam,
    }

# Test with optimal conditions for each species
species_names = list(SPECIES_DB.keys())
optimal_results = {}
for name in species_names:
    sp = SPECIES_DB[name]
    optimal_results[name] = predict_success(
        name, sp['optimal_auxin'], sp['optimal_cytokinin'],
        sp['optimal_sucrose'], sp['optimal_temp'])

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Tissue Culture Experiment Planner — Species Database',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors_sp = ['#f59e0b', '#22c55e', '#ef4444', '#a855f7', '#3b82f6', '#ec4899']

# Plot 1: Overall success rates at optimal conditions
ax = axes[0, 0]
overall = [optimal_results[n]['overall'] * 100 for n in species_names]
sorted_idx = np.argsort(overall)[::-1]
ax.barh(range(len(species_names)), [overall[i] for i in sorted_idx],
        color=[colors_sp[i] for i in sorted_idx], edgecolor='none', height=0.6)
ax.set_yticks(range(len(species_names)))
ax.set_yticklabels([species_names[i] for i in sorted_idx], color='white', fontsize=8)
ax.set_xlabel('Overall success rate (%)', color='white')
ax.set_title('Success at Optimal Conditions', color='white', fontsize=11)

# Plot 2: Stage-by-stage success (stacked)
ax = axes[0, 1]
stages = ['callus', 'shoot', 'root', 'acclimatization']
stage_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']
x = np.arange(len(species_names))
for j, (stage, color) in enumerate(zip(stages, stage_colors)):
    vals = [optimal_results[n][stage] * 100 for n in species_names]
    ax.bar(x + j * 0.2, vals, 0.2, color=color, label=stage.capitalize(), edgecolor='none')
ax.set_xticks(x + 0.3)
ax.set_xticklabels([n.split('(')[0].strip()[:6] for n in species_names],
                    color='white', fontsize=7, rotation=15)
ax.set_ylabel('Success rate (%)', color='white')
ax.set_title('Stage-by-Stage Success', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Timeline comparison
ax = axes[0, 2]
for i, name in enumerate(species_names):
    sp = SPECIES_DB[name]
    weeks = [sp['callus_weeks'], sp['shoot_weeks'], sp['root_weeks'], 4]
    starts = [0]
    for w in weeks[:-1]:
        starts.append(starts[-1] + w)
    for j, (w, s, color) in enumerate(zip(weeks, starts, stage_colors)):
        ax.barh(i, w, left=s, height=0.6, color=color, edgecolor='none',
                label=stages[j].capitalize() if i == 0 else None)
ax.set_yticks(range(len(species_names)))
ax.set_yticklabels([n.split('(')[0].strip() for n in species_names],
                    color='white', fontsize=8)
ax.set_xlabel('Weeks', color='white')
ax.set_title('Protocol Timeline by Species', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Auxin response surface for banana
ax = axes[1, 0]
auxin_range = np.linspace(0, 8, 50)
cyt_range = np.linspace(0, 8, 50)
AUX, CYT = np.meshgrid(auxin_range, cyt_range)
success_map = np.zeros_like(AUX)
for i in range(50):
    for j in range(50):
        r = predict_success('Banana (Musa)', AUX[i,j], CYT[i,j], 30, 27)
        success_map[i,j] = r['overall'] * 100
im = ax.contourf(AUX, CYT, success_map, levels=20, cmap='YlGn')
plt.colorbar(im, ax=ax, label='Overall success (%)')
ax.set_xlabel('Auxin (mg/L)', color='white')
ax.set_ylabel('Cytokinin (mg/L)', color='white')
ax.set_title('Banana: Hormone Response Surface', color='white', fontsize=11)
sp = SPECIES_DB['Banana (Musa)']
ax.plot(sp['optimal_auxin'], sp['optimal_cytokinin'], '*', color='#ef4444',
        markersize=15, markeredgecolor='white')

# Plot 5: Temperature sensitivity
ax = axes[1, 1]
temps = np.linspace(15, 35, 50)
for i, name in enumerate(species_names[:4]):
    sp = SPECIES_DB[name]
    rates = [predict_success(name, sp['optimal_auxin'], sp['optimal_cytokinin'],
                              sp['optimal_sucrose'], t)['overall'] * 100
             for t in temps]
    ax.plot(temps, rates, color=colors_sp[i], linewidth=2.5,
            label=name.split('(')[0].strip())
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Success rate (%)', color='white')
ax.set_title('Temperature Sensitivity', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Contamination impact
ax = axes[1, 2]
contam_rates = np.linspace(0, 0.20, 50)
for i, name in enumerate(['Banana (Musa)', 'Tea (Camellia)', 'Potato (Solanum)']):
    sp = SPECIES_DB[name]
    rates = [predict_success(name, sp['optimal_auxin'], sp['optimal_cytokinin'],
                              sp['optimal_sucrose'], sp['optimal_temp'], cr)['overall'] * 100
             for cr in contam_rates]
    ax.plot(contam_rates * 100, rates, color=colors_sp[i], linewidth=2.5,
            label=name.split('(')[0].strip())
ax.set_xlabel('Contamination rate (%/week)', color='white')
ax.set_ylabel('Overall success rate (%)', color='white')
ax.set_title('Contamination Impact', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Tissue Culture Experiment Planner — Part 1")
print("=" * 55)
print(f"{'Species':<20} {'Overall':>8} {'Timeline':>10} {'Difficulty':>12}")
print("-" * 55)
for name in species_names:
    r = optimal_results[name]
    diff = 'Easy' if r['overall'] > 0.6 else 'Medium' if r['overall'] > 0.3 else 'Hard'
    print(f"{name:<20} {r['overall']*100:>7.1f}% {r['total_weeks']:>8} wks  {diff:>10}")
print()
print("Model captures known difficulty rankings:")
print("  Potato > Rice > Banana > Orchid > Mango > Tea")
print("  (matches published literature)")`,
      challenge: 'Add three Assamese plant species to the database: (1) Joha rice (aromatic, easy to culture), (2) Muga silkworm host plant Som tree (Machilus bombycina, woody = difficult), and (3) Assam tea (Camellia sinensis var. assamica, moderately difficult). Estimate their parameters based on published tissue culture literature.',
      successHint: 'The species database is the foundation of the experiment planner. Real databases like the Plant Cell Culture Database (PCCD) contain thousands of protocols for hundreds of species. Your model captures the essential patterns: species difficulty, hormone optima, and environmental sensitivity.',
    },
    {
      title: 'Capstone Part 2 — Experiment design optimizer',
      concept: `Now we build the optimization engine: given a species and desired outcome, find the combination of parameters that maximizes success rate while minimizing cost and time.

This is a **constrained optimization problem**:
- **Objective**: maximize overall success probability
- **Decision variables**: auxin concentration, cytokinin concentration, sucrose level, temperature, explant type
- **Constraints**: budget (each culture vessel costs money), time (project deadline), labor (technician hours), space (growth chamber capacity)

We use two optimization approaches:
1. **Grid search**: systematically evaluate all combinations in the parameter space
2. **Gradient-free optimization**: Nelder-Mead simplex method to efficiently find the optimum

The optimizer also calculates the **number of replicates** needed for statistical significance. If the predicted success rate is 30%, you need more replicates than if it is 90%, because the variance is higher at intermediate success rates (binomial distribution).`,
      analogy: 'The experiment optimizer is like a travel agent finding the best vacation for your budget. You specify what you want (beach, culture, adventure), your constraints (budget, time off, travel distance), and the optimizer searches through thousands of combinations to find the best package deal.',
      storyConnection: 'Every tissue culture experiment is an attempt at Tejimola\'s regeneration — coaxing a plant cell to become a whole plant. The optimizer makes this process systematic rather than magical, replacing trial-and-error with mathematical optimization.',
      checkQuestion: 'The optimizer finds that the optimal protocol for tea (Camellia) has a predicted success rate of 25%. Your lab budget allows 100 culture vessels. Is this enough to reliably produce at least 10 regenerated plantlets?',
      checkAnswer: 'With 25% success rate and 100 vessels, the expected number of successes is 25. But this is a binomial distribution with n=100, p=0.25. The standard deviation is sqrt(100 * 0.25 * 0.75) = 4.3. The probability of getting fewer than 10 is very low (P(X<10) = about 0.003 from binomial CDF). So 100 vessels gives you >99.7% confidence of getting at least 10 plantlets. However, if your predicted rate is uncertain (could be 10-25%), you should plan for the worst case: at p=0.10, P(X<10) = about 0.55 — you would need ~200 vessels to be safe.',
      codeIntro: 'Build the experiment optimization engine with grid search, statistical power analysis, and cost estimation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# TISSUE CULTURE EXPERIMENT PLANNER — Part 2
# Experiment Design Optimizer
# =====================================================

SPECIES_DB = {
    'Banana': {'ease': 0.85, 'opt_aux': 2.0, 'opt_cyt': 4.0, 'opt_suc': 30, 'opt_temp': 27, 'weeks': 15},
    'Rice':   {'ease': 0.90, 'opt_aux': 2.5, 'opt_cyt': 0.5, 'opt_suc': 30, 'opt_temp': 25, 'weeks': 13},
    'Tea':    {'ease': 0.25, 'opt_aux': 1.0, 'opt_cyt': 2.0, 'opt_suc': 20, 'opt_temp': 24, 'weeks': 26},
    'Orchid': {'ease': 0.70, 'opt_aux': 0.5, 'opt_cyt': 3.0, 'opt_suc': 25, 'opt_temp': 25, 'weeks': 20},
    'Mango':  {'ease': 0.30, 'opt_aux': 3.0, 'opt_cyt': 1.5, 'opt_suc': 30, 'opt_temp': 26, 'weeks': 29},
}

def predict_rate(species, auxin, cytokinin, sucrose, temp):
    sp = SPECIES_DB[species]
    aux_f = np.exp(-((auxin - sp['opt_aux'])**2) / 4.5)
    cyt_f = np.exp(-((cytokinin - sp['opt_cyt'])**2) / 4.5)
    suc_f = np.exp(-((sucrose - sp['opt_suc'])**2) / 200)
    tmp_f = np.exp(-((temp - sp['opt_temp'])**2) / 32)
    rate = sp['ease'] * aux_f * cyt_f * suc_f * tmp_f * 0.85
    return min(rate, 0.99)

def required_replicates(target_success_n, predicted_rate, confidence=0.95):
    """Calculate vessels needed to get target_success_n plantlets with given confidence."""
    if predicted_rate <= 0:
        return float('inf')
    # Use normal approximation to binomial
    from math import ceil
    z = 1.645 if confidence == 0.95 else 1.96  # one-sided
    # Solve: P(X >= target) >= confidence
    # Approximate: need n such that n*p - z*sqrt(n*p*(1-p)) >= target
    for n in range(target_success_n, 10000):
        mean = n * predicted_rate
        std = np.sqrt(n * predicted_rate * (1 - predicted_rate))
        if mean - z * std >= target_success_n:
            return n
    return 10000

def experiment_cost(n_vessels, weeks, labor_hr_per_vessel=0.5, vessel_cost=0.50,
                    media_cost_per_L=2.0, media_per_vessel_mL=50):
    """Estimate total experiment cost."""
    vessels = n_vessels * vessel_cost
    media = n_vessels * media_per_vessel_mL / 1000 * media_cost_per_L
    n_subcultures = weeks // 4
    labor = n_vessels * labor_hr_per_vessel * (1 + n_subcultures) * 5  # $5/hr
    return vessels + media + labor

# === GRID SEARCH OPTIMIZATION ===
species = 'Tea'
aux_range = np.linspace(0.1, 5.0, 25)
cyt_range = np.linspace(0.1, 5.0, 25)
suc_range = [15, 20, 25, 30, 35]
temp_range = [20, 22, 24, 26, 28]

best_rate = 0
best_params = {}
all_rates = []

for aux in aux_range:
    for cyt in cyt_range:
        rate = predict_rate(species, aux, cyt, 20, 24)
        all_rates.append((aux, cyt, rate))
        if rate > best_rate:
            best_rate = rate
            best_params = {'auxin': aux, 'cytokinin': cyt, 'sucrose': 20, 'temp': 24}

# Calculate replicates for different targets
targets = [5, 10, 20, 50, 100]
replicates_needed = [required_replicates(t, best_rate) for t in targets]
costs = [experiment_cost(r, SPECIES_DB[species]['weeks']) for r in replicates_needed]

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Experiment Optimizer: {species} Tissue Culture Protocol',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Hormone optimization heatmap
ax = axes[0, 0]
AUX, CYT = np.meshgrid(aux_range, cyt_range)
rate_map = np.zeros_like(AUX)
for i in range(25):
    for j in range(25):
        rate_map[i,j] = predict_rate(species, AUX[i,j], CYT[i,j], 20, 24) * 100
im = ax.contourf(AUX, CYT, rate_map, levels=20, cmap='YlGn')
plt.colorbar(im, ax=ax, label='Success rate (%)')
ax.plot(best_params['auxin'], best_params['cytokinin'], '*', color='#ef4444',
        markersize=15, markeredgecolor='white')
ax.set_xlabel('Auxin (mg/L)', color='white')
ax.set_ylabel('Cytokinin (mg/L)', color='white')
ax.set_title(f'Hormone Optimization ({species})', color='white', fontsize=11)
ax.annotate(f'Optimum: {best_rate*100:.1f}%', xy=(best_params['auxin'], best_params['cytokinin']),
            xytext=(best_params['auxin']+1, best_params['cytokinin']+1),
            color='#ef4444', fontsize=9, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#ef4444'))

# Plot 2: Replicates needed vs target
ax = axes[0, 1]
ax.plot(targets, replicates_needed, color='#3b82f6', linewidth=2.5, marker='o', markersize=8)
ax.fill_between(targets, 0, replicates_needed, color='#3b82f6', alpha=0.1)
ax.set_xlabel('Target plantlets needed', color='white')
ax.set_ylabel('Culture vessels required', color='white')
ax.set_title(f'Replicates (p={best_rate:.2f}, 95% CI)', color='white', fontsize=11)
for t, r in zip(targets, replicates_needed):
    ax.text(t, r + 20, f'{r}', ha='center', color='white', fontsize=9)

# Plot 3: Cost estimation
ax = axes[0, 2]
ax.bar(range(len(targets)), costs, color='#f59e0b', edgecolor='none', width=0.6)
ax.set_xticks(range(len(targets)))
ax.set_xticklabels([f'{t} plants' for t in targets], color='white', fontsize=9)
ax.set_ylabel('Estimated cost ($)', color='white')
ax.set_title('Experiment Cost', color='white', fontsize=11)
for i, c in enumerate(costs):
    ax.text(i, c + 10, f'\{c:.0f}', ha='center', color='white', fontsize=10)

# Plot 4: Multi-species comparison at optimal
ax = axes[1, 0]
sp_names = list(SPECIES_DB.keys())
opt_rates = []
for name in sp_names:
    sp = SPECIES_DB[name]
    rate = predict_rate(name, sp['opt_aux'], sp['opt_cyt'], sp['opt_suc'], sp['opt_temp'])
    opt_rates.append(rate * 100)
reps = [required_replicates(20, r/100) for r in opt_rates]
colors_bar = ['#f59e0b', '#22c55e', '#ef4444', '#a855f7', '#3b82f6']
ax.scatter(opt_rates, reps, s=200, c=colors_bar, edgecolor='white', linewidth=1, zorder=5)
for i, name in enumerate(sp_names):
    ax.annotate(name, (opt_rates[i], reps[i]), textcoords='offset points',
                xytext=(8, 5), color=colors_bar[i], fontsize=9)
ax.set_xlabel('Optimal success rate (%)', color='white')
ax.set_ylabel('Vessels for 20 plants (95% CI)', color='white')
ax.set_title('Species: Success Rate vs Required Scale', color='white', fontsize=11)

# Plot 5: Sensitivity tornado chart
ax = axes[1, 1]
base_rate = predict_rate(species, best_params['auxin'], best_params['cytokinin'], 20, 24)
sensitivities = {}
for param, base_val, delta in [('Auxin', best_params['auxin'], 1.0),
                                  ('Cytokinin', best_params['cytokinin'], 1.0),
                                  ('Sucrose', 20, 5),
                                  ('Temperature', 24, 3)]:
    if param == 'Auxin':
        rate_up = predict_rate(species, base_val + delta, best_params['cytokinin'], 20, 24)
    elif param == 'Cytokinin':
        rate_up = predict_rate(species, best_params['auxin'], base_val + delta, 20, 24)
    elif param == 'Sucrose':
        rate_up = predict_rate(species, best_params['auxin'], best_params['cytokinin'], base_val + delta, 24)
    else:
        rate_up = predict_rate(species, best_params['auxin'], best_params['cytokinin'], 20, base_val + delta)
    sensitivities[param] = (rate_up - base_rate) / base_rate * 100

sorted_sens = sorted(sensitivities.items(), key=lambda x: abs(x[1]), reverse=True)
ax.barh(range(len(sorted_sens)), [s[1] for s in sorted_sens],
        color=['#22c55e' if s[1] > 0 else '#ef4444' for s in sorted_sens],
        edgecolor='none', height=0.6)
ax.set_yticks(range(len(sorted_sens)))
ax.set_yticklabels([s[0] for s in sorted_sens], color='white', fontsize=10)
ax.set_xlabel('Change in success rate (%)', color='white')
ax.set_title('Parameter Sensitivity', color='white', fontsize=11)
ax.axvline(0, color='gray', linewidth=1)

# Plot 6: Recommended protocol card
ax = axes[1, 2]
ax.axis('off')
ax.text(0.5, 0.95, f'OPTIMIZED PROTOCOL', transform=ax.transAxes,
        ha='center', color='#f59e0b', fontsize=14, fontweight='bold')
ax.text(0.5, 0.82, f'{species}', transform=ax.transAxes,
        ha='center', color='#22c55e', fontsize=18, fontweight='bold')
protocol = [
    f"Auxin: {best_params['auxin']:.1f} mg/L",
    f"Cytokinin: {best_params['cytokinin']:.1f} mg/L",
    f"Sucrose: {best_params['sucrose']} g/L",
    f"Temperature: {best_params['temp']}°C",
    f"Predicted success: {best_rate*100:.1f}%",
    f"For 20 plants: {required_replicates(20, best_rate)} vessels",
    f"Timeline: {SPECIES_DB[species]['weeks']} weeks",
    f"Est. cost: \{experiment_cost(required_replicates(20, best_rate), SPECIES_DB[species]['weeks']):.0f}",
]
for i, line in enumerate(protocol):
    ax.text(0.5, 0.68 - i * 0.09, line, transform=ax.transAxes,
            ha='center', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Experiment Optimizer — Results")
print("=" * 55)
print(f"Species: {species}")
print(f"Optimal: Auxin={best_params['auxin']:.1f}, Cytokinin={best_params['cytokinin']:.1f}")
print(f"Predicted success rate: {best_rate*100:.1f}%")
print()
print(f"{'Target':>8} {'Vessels':>8} {'Cost':>10}")
print("-" * 30)
for t, r, c in zip(targets, replicates_needed, costs):
    print(f"{t:>8} {r:>8} \{c:>9.0f}")
print()
print("Sensitivity ranking (most to least important):")
for param, sens in sorted_sens:
    print(f"  {param}: {sens:+.1f}% per unit increase")`,
      challenge: 'Design a complete experiment for an endangered Assamese orchid. Your constraints: $500 budget, 6-month timeline, 2 technician hours per week, 50-vessel growth chamber capacity. How many plants can you produce? What is the probability of getting at least 1 surviving plant? Present a complete protocol with contingency plan.',
      successHint: 'The experiment optimizer transforms tissue culture from art to engineering. By quantifying success rates, required replicates, and costs, it enables rational experiment planning. Real labs use similar tools — the key insight is that biology is probabilistic, so you must plan for uncertainty.',
    },
    {
      title: 'Capstone Part 3 — Monte Carlo simulation and risk analysis',
      concept: `Real tissue culture experiments face multiple sources of uncertainty simultaneously. Monte Carlo simulation propagates all uncertainties through the model to answer: "What is the probability that my experiment achieves its goal?"

Sources of uncertainty:
- **Biological variability**: genotype-dependent response (±20% between clones)
- **Environmental fluctuation**: temperature variation in growth chamber (±2°C)
- **Contamination risk**: stochastic loss of cultures (2-10% per transfer)
- **Hormone batch variation**: concentration accuracy of stock solutions (±15%)
- **Technician skill**: aseptic technique proficiency affects contamination rate
- **Seasonal effects**: some species respond differently in summer vs winter

The Monte Carlo approach:
1. Define probability distributions for each uncertain parameter
2. Sample randomly from all distributions
3. Run the prediction model with sampled parameters
4. Repeat 10,000 times
5. Analyze the distribution of outcomes

This gives you not just "the expected result" but "the range of possible results" — essential for lab planning and resource allocation.`,
      analogy: 'Monte Carlo simulation is like rehearsing a play 10,000 times with random variations in each actor\'s performance. Sometimes the lead actor is brilliant and the supporting cast is mediocre; sometimes it is the reverse. By watching all 10,000 performances, you learn how often the play succeeds overall, despite the unpredictability of individual performers.',
      storyConnection: 'Tejimola\'s regeneration in the story happens perfectly — every time. Real tissue culture is messier. Some explants grow beautifully, others contaminate, others simply refuse to respond. Monte Carlo simulation embraces this messiness and plans for it, turning the uncertainty of biological systems into quantified risk.',
      checkQuestion: 'Your Monte Carlo simulation shows that for tea tissue culture, the 90% confidence interval for success rate is 8-32%. Your lab needs at least 50 plants. How many vessels should you prepare?',
      checkAnswer: 'Plan for the worst case within your confidence interval. At 8% success rate, you need 50/0.08 = 625 vessels to get 50 plants on average, but to get 50 with 95% confidence at p=0.08, you need about 900 vessels (from binomial calculation). At 32% (best case), you need only about 200 vessels. The practical answer depends on your risk tolerance: if failure is catastrophic, prepare 900. If you can re-run the experiment, prepare 500 (based on the median ~20% rate) and plan a contingency batch.',
      codeIntro: 'Run a full Monte Carlo risk analysis for a tissue culture experiment with multiple uncertainty sources.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# TISSUE CULTURE EXPERIMENT PLANNER — Part 3
# Monte Carlo Risk Analysis
# =====================================================

def predict_with_uncertainty(species_ease, opt_aux, opt_cyt, n_vessels,
                              target_plants, n_mc=10000):
    """Full Monte Carlo simulation of a tissue culture experiment."""
    results = []
    for _ in range(n_mc):
        # Sample uncertain parameters
        actual_ease = species_ease * np.random.uniform(0.7, 1.3)
        actual_aux = opt_aux * np.random.uniform(0.85, 1.15)
        actual_cyt = opt_cyt * np.random.uniform(0.85, 1.15)
        temp_variation = np.random.normal(0, 1.5)
        contam_rate = np.random.beta(2, 30)  # ~5-8% most likely

        # Compute success rate
        aux_f = np.exp(-((actual_aux - opt_aux)**2) / 4.5)
        cyt_f = np.exp(-((actual_cyt - opt_cyt)**2) / 4.5)
        tmp_f = np.exp(-(temp_variation**2) / 32)
        base_rate = actual_ease * aux_f * cyt_f * tmp_f * 0.85
        base_rate = min(base_rate, 0.99)

        # Simulate n_vessels individually
        n_success = 0
        for v in range(n_vessels):
            if np.random.random() < contam_rate:
                continue  # contaminated
            if np.random.random() < base_rate:
                n_success += 1

        results.append({
            'n_success': n_success,
            'success_rate': n_success / max(1, n_vessels),
            'meets_target': n_success >= target_plants,
            'contam_rate': contam_rate,
            'actual_ease': actual_ease,
        })

    return results

# Run for Tea (difficult species)
tea_results = predict_with_uncertainty(
    species_ease=0.25, opt_aux=1.0, opt_cyt=2.0,
    n_vessels=200, target_plants=20, n_mc=10000)

# Run for Banana (easy species) at same scale
banana_results = predict_with_uncertainty(
    species_ease=0.85, opt_aux=2.0, opt_cyt=4.0,
    n_vessels=200, target_plants=20, n_mc=10000)

# Run for Tea with more vessels
tea_400 = predict_with_uncertainty(
    species_ease=0.25, opt_aux=1.0, opt_cyt=2.0,
    n_vessels=400, target_plants=20, n_mc=10000)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Monte Carlo Risk Analysis: Tissue Culture Experiments (N=10,000)',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Success count distribution (Tea, 200 vessels)
ax = axes[0, 0]
tea_counts = [r['n_success'] for r in tea_results]
ax.hist(tea_counts, bins=30, color='#ef4444', edgecolor='none', alpha=0.8, density=True)
ax.axvline(20, color='#f59e0b', linewidth=2, linestyle='--', label='Target: 20 plants')
ax.axvline(np.mean(tea_counts), color='white', linewidth=2, label=f'Mean: {np.mean(tea_counts):.0f}')
prob_meet = sum(1 for r in tea_results if r['meets_target']) / len(tea_results)
ax.set_xlabel('Plants regenerated', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title(f'Tea (200 vessels): P(≥20)={prob_meet:.0%}', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Comparison Tea vs Banana
ax = axes[0, 1]
banana_counts = [r['n_success'] for r in banana_results]
ax.hist(banana_counts, bins=30, color='#22c55e', alpha=0.7, edgecolor='none',
        density=True, label='Banana')
ax.hist(tea_counts, bins=30, color='#ef4444', alpha=0.7, edgecolor='none',
        density=True, label='Tea')
ax.axvline(20, color='#f59e0b', linewidth=2, linestyle='--')
ax.set_xlabel('Plants regenerated (from 200 vessels)', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Species Comparison', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Effect of vessel count on P(meeting target) for Tea
ax = axes[0, 2]
vessel_counts = [50, 100, 150, 200, 300, 400, 500]
probs_meet = []
for nv in vessel_counts:
    results = predict_with_uncertainty(0.25, 1.0, 2.0, nv, 20, n_mc=3000)
    probs_meet.append(sum(1 for r in results if r['meets_target']) / len(results))
ax.plot(vessel_counts, [p*100 for p in probs_meet], color='#ef4444', linewidth=2.5,
        marker='o', markersize=8)
ax.axhline(95, color='#22c55e', linewidth=1.5, linestyle='--', label='95% confidence')
ax.axhline(80, color='#f59e0b', linewidth=1.5, linestyle='--', label='80% confidence')
ax.set_xlabel('Number of culture vessels', color='white')
ax.set_ylabel('P(≥20 plants) (%)', color='white')
ax.set_title('Tea: Vessels Needed for 20 Plants', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
# Find where P crosses 95%
for nv, p in zip(vessel_counts, probs_meet):
    if p >= 0.95:
        ax.annotate(f'Need ~{nv} vessels\\nfor 95% confidence',
                    xy=(nv, p*100), xytext=(nv+50, p*100-10),
                    color='#22c55e', fontsize=9, fontweight='bold',
                    arrowprops=dict(arrowstyle='->', color='#22c55e'))
        break

# Plot 4: Risk factors breakdown
ax = axes[1, 0]
contam_rates = [r['contam_rate'] * 100 for r in tea_results]
ease_values = [r['actual_ease'] for r in tea_results]
# Color by success
colors_dot = ['#22c55e' if r['meets_target'] else '#ef4444' for r in tea_results[:500]]
ax.scatter(contam_rates[:500], ease_values[:500], s=10, c=colors_dot, alpha=0.5)
ax.set_xlabel('Contamination rate (%)', color='white')
ax.set_ylabel('Actual species ease', color='white')
ax.set_title('Risk Factors (green=success, red=fail)', color='white', fontsize=11)

# Plot 5: Cumulative probability
ax = axes[1, 1]
tea_sorted = sorted(tea_counts)
tea_400_counts = sorted([r['n_success'] for r in tea_400])
cdf_tea = np.arange(1, len(tea_sorted)+1) / len(tea_sorted)
cdf_400 = np.arange(1, len(tea_400_counts)+1) / len(tea_400_counts)
ax.plot(tea_sorted, cdf_tea, color='#ef4444', linewidth=2, label='200 vessels')
ax.plot(tea_400_counts, cdf_400, color='#3b82f6', linewidth=2, label='400 vessels')
ax.axvline(20, color='#f59e0b', linewidth=2, linestyle='--')
ax.axhline(0.95, color='gray', linewidth=1, linestyle=':')
ax.set_xlabel('Plants regenerated', color='white')
ax.set_ylabel('Cumulative probability', color='white')
ax.set_title('CDF: How Many Plants Will I Get?', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary recommendation
ax = axes[1, 2]
ax.axis('off')
p_200 = sum(1 for r in tea_results if r['meets_target']) / len(tea_results)
p_400 = sum(1 for r in tea_400 if r['meets_target']) / len(tea_400)
mean_200 = np.mean(tea_counts)
ci5_200 = np.percentile(tea_counts, 5)
ci95_200 = np.percentile(tea_counts, 95)

ax.text(0.5, 0.95, 'RISK ANALYSIS SUMMARY', transform=ax.transAxes,
        ha='center', color='#f59e0b', fontsize=14, fontweight='bold')
ax.text(0.5, 0.80, 'Tea Tissue Culture', transform=ax.transAxes,
        ha='center', color='#ef4444', fontsize=16, fontweight='bold')
lines = [
    f"Target: 20 regenerated plants",
    f"",
    f"200 vessels: P(success) = {p_200:.0%}",
    f"  Expected: {mean_200:.0f} plants (90% CI: {ci5_200:.0f}-{ci95_200:.0f})",
    f"",
    f"400 vessels: P(success) = {p_400:.0%}",
    f"  Recommended for critical projects",
    f"",
    f"Key risk: contamination rate variation",
    f"Mitigation: strict aseptic technique training",
]
for i, line in enumerate(lines):
    ax.text(0.5, 0.68 - i * 0.065, line, transform=ax.transAxes,
            ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Monte Carlo Risk Analysis — Tea Tissue Culture")
print("=" * 55)
print(f"Simulations: 10,000 | Target: 20 plants")
print()
print(f"{'Vessels':>8} {'P(≥20)':>8} {'Mean':>6} {'5th%':>6} {'95th%':>6}")
print("-" * 38)
for nv, prob in zip([200, 400], [p_200, p_400]):
    if nv == 200:
        counts = tea_counts
    else:
        counts = [r['n_success'] for r in tea_400]
    print(f"{nv:>8} {prob:>7.0%} {np.mean(counts):>6.0f} "
          f"{np.percentile(counts, 5):>6.0f} {np.percentile(counts, 95):>6.0f}")
print()
print("Conclusion: Tea requires ~400 vessels for 95% confidence of 20 plants.")
print("Banana would need only ~50 vessels for the same target.")
print("Species difficulty is the dominant factor in experiment planning.")`,
      challenge: 'Run a "worst case" scenario: a rare Assamese orchid with unknown regeneration ease (could be anywhere from 0.05 to 0.50), unknown optimal hormones (wide search needed), and high contamination risk (monsoon season, 15% rate). Design a robust experiment plan that gives at least 80% probability of regenerating 5 plants. How many vessels and how many hormone combinations should you test?',
      successHint: 'Monte Carlo simulation is the most honest approach to experiment planning. It does not pretend that you know the outcome — it quantifies your uncertainty and lets you make informed decisions about resources, timelines, and risk tolerance. This is how real biotech labs plan their experiments.',
    },
    {
      title: 'Capstone Part 4 — Complete experiment planner with reporting',
      concept: `The final deliverable integrates all components into a complete experiment planning tool that generates a professional protocol document. This mirrors what a real tissue culture lab manager would produce for grant applications, regulatory submissions, or industry contracts.

The report includes:
1. **Experiment rationale**: why this species, why tissue culture
2. **Protocol specification**: media composition, hormone concentrations, environmental conditions
3. **Statistical power analysis**: number of replicates, expected success rate with confidence intervals
4. **Risk assessment**: Monte Carlo analysis of failure modes
5. **Timeline**: Gantt chart of experiment phases
6. **Budget**: itemized cost breakdown
7. **Quality control**: checkpoints and contingency plans

This is a real-world skill: the ability to plan, budget, and communicate a scientific experiment. Many grant applications are rejected not because the science is wrong but because the experiment plan is unconvincing.`,
      analogy: 'The final report is like an architect\'s blueprint. Before building a house (running the experiment), you create detailed plans showing every room (protocol step), the materials needed (media, hormones), the timeline (construction schedule), and the cost (budget). A good blueprint prevents costly mistakes during construction.',
      storyConnection: 'From Tejimola\'s mythical regeneration to a complete, budgeted, statistically powered experiment plan for plant tissue culture — this capstone demonstrates how science transforms wonder into method. The story asks "can a plant regenerate?" The experiment planner answers "yes, here is exactly how, how long it will take, and how much it will cost."',
      checkQuestion: 'Your experiment planner predicts 85% success for banana with 100 vessels, but only 25% for tea with 400 vessels. A funding agency asks: "Which experiment should we fund?" How do you present the trade-offs?',
      checkAnswer: 'Present it as a portfolio decision. The banana experiment is low-risk, high-confidence — suitable for commercial production where reliability matters. The tea experiment is high-risk, high-impact — tea tissue culture protocols are poorly developed and a successful result would have major scientific and commercial value. The expected cost per regenerated plant is lower for banana ($2/plant) but the novelty and impact are lower. For tea, the cost per plant is higher ($15/plant) but the knowledge gained advances the entire field. Recommend funding both if possible, or tea if the funder values innovation over guaranteed returns.',
      codeIntro: 'Generate the complete experiment plan with protocol, budget, timeline, risk assessment, and quality control checkpoints.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# =====================================================
# TISSUE CULTURE EXPERIMENT PLANNER — Part 4
# Complete Report Generator
# =====================================================

# User inputs
EXPERIMENT = {
    'species': 'Tea (Camellia sinensis var. assamica)',
    'target_plants': 30,
    'confidence': 0.95,
    'budget_limit': 2000,  # USD
    'timeline_limit': 30,   # weeks
    'lab_capacity': 300,    # max vessels
}

# Species parameters
SP = {
    'ease': 0.25, 'opt_aux': 1.0, 'opt_cyt': 2.0,
    'opt_suc': 20, 'opt_temp': 24,
    'callus_wk': 6, 'shoot_wk': 10, 'root_wk': 6, 'accl_wk': 4,
}

# Predict success rate
def predict(aux, cyt, suc, temp, ease=SP['ease']):
    return min(0.99, ease * np.exp(-((aux-SP['opt_aux'])**2)/4.5) *
               np.exp(-((cyt-SP['opt_cyt'])**2)/4.5) *
               np.exp(-((suc-SP['opt_suc'])**2)/200) *
               np.exp(-((temp-SP['opt_temp'])**2)/32) * 0.85)

best_rate = predict(SP['opt_aux'], SP['opt_cyt'], SP['opt_suc'], SP['opt_temp'])

# Calculate required vessels
def required_vessels(target, rate, conf=0.95):
    z = 1.645
    for n in range(target, 5000):
        mean = n * rate
        std = np.sqrt(n * rate * (1-rate))
        if mean - z * std >= target:
            return n
    return 5000

n_vessels = required_vessels(EXPERIMENT['target_plants'], best_rate, EXPERIMENT['confidence'])
n_vessels = min(n_vessels, EXPERIMENT['lab_capacity'])

# Cost breakdown
costs = {
    'Media & chemicals': n_vessels * 0.80,
    'Culture vessels': n_vessels * 0.50,
    'Growth regulators': 50.0,
    'Labor (tech)': n_vessels * 0.5 * 5 * (1 + (SP['callus_wk']+SP['shoot_wk']+SP['root_wk'])//4),
    'Utilities': 15 * (SP['callus_wk']+SP['shoot_wk']+SP['root_wk']+SP['accl_wk']),
    'Acclimatization': EXPERIMENT['target_plants'] * 2.0,
    'Contingency (15%)': 0,  # calculated below
}
subtotal = sum(costs.values())
costs['Contingency (15%)'] = subtotal * 0.15
total_cost = sum(costs.values())

# Monte Carlo for risk
n_mc = 5000
mc_success = []
for _ in range(n_mc):
    actual_ease = SP['ease'] * np.random.uniform(0.7, 1.3)
    contam = np.random.beta(2, 30)
    n_surv = 0
    for _ in range(n_vessels):
        if np.random.random() >= contam:
            r = predict(SP['opt_aux'], SP['opt_cyt'], SP['opt_suc'], SP['opt_temp'], actual_ease)
            if np.random.random() < r:
                n_surv += 1
    mc_success.append(n_surv)

p_target = np.mean([s >= EXPERIMENT['target_plants'] for s in mc_success])

# Timeline
total_weeks = SP['callus_wk'] + SP['shoot_wk'] + SP['root_wk'] + SP['accl_wk'] + 2

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'EXPERIMENT PLAN: {EXPERIMENT["species"]}',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Protocol summary card
ax = axes[0, 0]
ax.axis('off')
ax.text(0.5, 0.95, 'PROTOCOL', transform=ax.transAxes,
        ha='center', color='#f59e0b', fontsize=14, fontweight='bold')
protocol_lines = [
    f"Explant: Young leaf segments",
    f"Medium: MS + {SP['opt_aux']} mg/L 2,4-D + {SP['opt_cyt']} mg/L BAP",
    f"Sucrose: {SP['opt_suc']} g/L | pH: 5.8",
    f"Temperature: {SP['opt_temp']}°C | Light: 16/8h",
    f"Vessels: {n_vessels} (target: {EXPERIMENT['target_plants']} plants)",
    f"Predicted rate: {best_rate*100:.1f}%",
    f"P(≥{EXPERIMENT['target_plants']}): {p_target:.0%}",
    f"Timeline: {total_weeks} weeks",
    f"Budget: \{total_cost:.0f}",
]
for i, line in enumerate(protocol_lines):
    ax.text(0.5, 0.82 - i * 0.085, line, transform=ax.transAxes,
            ha='center', color='white', fontsize=10)

# Plot 2: Budget breakdown
ax = axes[0, 1]
cost_items = list(costs.keys())
cost_vals = list(costs.values())
colors_cost = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#64748b', '#ec4899', '#ef4444']
wedges, texts, autotexts = ax.pie(cost_vals, labels=cost_items, autopct='%1.0f%%',
    colors=colors_cost[:len(cost_items)],
    textprops={'color': 'white', 'fontsize': 7})
ax.set_title(f'Budget: \{total_cost:.0f}', color='white', fontsize=11)

# Plot 3: Gantt chart timeline
ax = axes[0, 2]
phases = [
    ('Preparation', 0, 2, '#64748b'),
    ('Callus induction', 2, 2 + SP['callus_wk'], '#22c55e'),
    ('Shoot regen.', 2 + SP['callus_wk'], 2 + SP['callus_wk'] + SP['shoot_wk'], '#3b82f6'),
    ('Rooting', 2 + SP['callus_wk'] + SP['shoot_wk'],
     2 + SP['callus_wk'] + SP['shoot_wk'] + SP['root_wk'], '#a855f7'),
    ('Acclimatize', 2 + SP['callus_wk'] + SP['shoot_wk'] + SP['root_wk'],
     total_weeks, '#f59e0b'),
]
for i, (label, start, end, color) in enumerate(phases):
    ax.barh(i, end - start, left=start, height=0.6, color=color, edgecolor='none')
    ax.text((start + end) / 2, i, f'{label}\\n({end-start}wk)', ha='center', va='center',
            color='white', fontsize=7, fontweight='bold')
# QC checkpoints
qc_weeks = [2, 2 + SP['callus_wk'], 2 + SP['callus_wk'] + SP['shoot_wk'],
            2 + SP['callus_wk'] + SP['shoot_wk'] + SP['root_wk']]
for qc_wk in qc_weeks:
    ax.axvline(qc_wk, color='#ef4444', linewidth=1.5, linestyle='--')
    ax.text(qc_wk, len(phases) - 0.3, 'QC', color='#ef4444', fontsize=7,
            ha='center', fontweight='bold')
ax.set_yticks(range(len(phases)))
ax.set_yticklabels([p[0] for p in phases], color='white', fontsize=8)
ax.set_xlabel('Weeks', color='white')
ax.set_title('Timeline & QC Checkpoints', color='white', fontsize=11)
within_limit = total_weeks <= EXPERIMENT['timeline_limit']
ax.text(total_weeks + 0.5, 2, f'{"✓ ON TIME" if within_limit else "⚠ OVER TIME"}',
        color='#22c55e' if within_limit else '#ef4444', fontsize=9, fontweight='bold')

# Plot 4: Monte Carlo outcome distribution
ax = axes[1, 0]
ax.hist(mc_success, bins=30, color='#3b82f6', edgecolor='none', alpha=0.8, density=True)
ax.axvline(EXPERIMENT['target_plants'], color='#f59e0b', linewidth=2, linestyle='--',
           label=f'Target: {EXPERIMENT["target_plants"]}')
ax.axvline(np.mean(mc_success), color='white', linewidth=2, label=f'Mean: {np.mean(mc_success):.0f}')
ci5 = np.percentile(mc_success, 5)
ci95 = np.percentile(mc_success, 95)
ax.axvspan(ci5, ci95, alpha=0.1, color='#22c55e', label=f'90% CI: [{ci5:.0f}-{ci95:.0f}]')
ax.set_xlabel('Plants regenerated', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title(f'Risk Analysis (P≥target: {p_target:.0%})', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Contingency plan decision tree
ax = axes[1, 1]
ax.axis('off')
ax.text(0.5, 0.95, 'CONTINGENCY PLAN', transform=ax.transAxes,
        ha='center', color='#f59e0b', fontsize=12, fontweight='bold')
contingencies = [
    ("Week 8: Callus < 50%?", "→ Increase auxin to 2.0 mg/L", '#ef4444'),
    ("Week 14: Shoots < 30%?", "→ Add TDZ 0.5 mg/L", '#f59e0b'),
    ("Contamination > 10%?", "→ Retrain technician + add antibiotics", '#a855f7'),
    ("Week 22: Roots < 20?", "→ Start backup batch (100 vessels)", '#3b82f6'),
    ("Week 26: Plants < 20?", "→ Extend acclimatization 4 weeks", '#22c55e'),
]
for i, (check, action, color) in enumerate(contingencies):
    ax.text(0.05, 0.80 - i * 0.17, check, transform=ax.transAxes,
            color=color, fontsize=9, fontweight='bold')
    ax.text(0.10, 0.73 - i * 0.17, action, transform=ax.transAxes,
            color='white', fontsize=8)

# Plot 6: Final scorecard
ax = axes[1, 2]
ax.axis('off')
metrics = [
    ('Target plants', f'{EXPERIMENT["target_plants"]}', '#f59e0b'),
    ('Predicted yield', f'{np.mean(mc_success):.0f} ± {np.std(mc_success):.0f}', '#22c55e'),
    ('Success probability', f'{p_target:.0%}', '#22c55e' if p_target > 0.8 else '#ef4444'),
    ('Total cost', f'\{total_cost:.0f}', '#22c55e' if total_cost < EXPERIMENT["budget_limit"] else '#ef4444'),
    ('Cost/plant', f'\{total_cost/max(1,np.mean(mc_success)):.1f}', '#f59e0b'),
    ('Timeline', f'{total_weeks} weeks', '#22c55e' if within_limit else '#ef4444'),
    ('Vessels needed', f'{n_vessels}', '#3b82f6'),
]
ax.text(0.5, 0.95, 'EXPERIMENT SCORECARD', transform=ax.transAxes,
        ha='center', color='#f59e0b', fontsize=12, fontweight='bold')
for i, (label, value, color) in enumerate(metrics):
    ax.text(0.15, 0.80 - i * 0.11, label + ':', transform=ax.transAxes,
            color='gray', fontsize=10)
    ax.text(0.85, 0.80 - i * 0.11, value, transform=ax.transAxes,
            ha='right', color=color, fontsize=11, fontweight='bold')

plt.tight_layout()
plt.show()

print("=" * 65)
print("TISSUE CULTURE EXPERIMENT PLAN — FINAL REPORT")
print("=" * 65)
print(f"Species: {EXPERIMENT['species']}")
print(f"Target: {EXPERIMENT['target_plants']} regenerated plants")
print()
print("PROTOCOL:")
print(f"  Medium: MS + {SP['opt_aux']} mg/L 2,4-D + {SP['opt_cyt']} mg/L BAP")
print(f"  Culture vessels: {n_vessels}")
print(f"  Predicted success: {best_rate*100:.1f}%")
print()
print("RISK ANALYSIS (Monte Carlo, N=5000):")
print(f"  P(≥{EXPERIMENT['target_plants']}): {p_target:.0%}")
print(f"  Expected yield: {np.mean(mc_success):.0f} ± {np.std(mc_success):.0f}")
print(f"  90% CI: [{ci5:.0f}, {ci95:.0f}]")
print()
print("BUDGET:")
for item, cost in costs.items():
    print(f"  {item:<25} \{cost:>8.0f}")
print(f"  {'TOTAL':<25} \{total_cost:>8.0f}")
within_budget = total_cost <= EXPERIMENT['budget_limit']
print(f"  Status: {'WITHIN BUDGET' if within_budget else 'OVER BUDGET'}")
print()
print(f"TIMELINE: {total_weeks} weeks {'(ON TIME)' if within_limit else '(OVER LIMIT)'}")
print()
print("CAPSTONE COMPLETE: From Tejimola's regeneration story to a")
print("complete tissue culture experiment plan with protocol,")
print("statistical power, risk analysis, budget, and contingencies.")`,
      challenge: 'Create experiment plans for three endangered Assamese plant species simultaneously, sharing lab resources (300 vessels total, $3000 budget, one technician). Optimize the allocation of vessels across species to maximize the total number of regenerated plants. This is a resource allocation problem — which species should get more vessels?',
      successHint: 'You have built a complete Tissue Culture Experiment Planner — from species database to protocol optimization to Monte Carlo risk analysis to budget and timeline planning. This is how real plant biotechnology projects are planned and funded.',
    },
    {
      title: 'Capstone Part 5 — Sensitivity analysis and robustness testing',
      concept: `A model is only as useful as its assumptions are valid. In Part 5, you stress-test your experiment planner by running **sensitivity analysis**: systematically varying each input parameter while holding others constant, to discover which parameters have the largest effect on the outcome.

If a 10% change in auxin concentration changes your success rate by 50%, your experiment is fragile — a small pipetting error could ruin months of work. If a 50% change in temperature only shifts success by 5%, that parameter is robust. Sensitivity analysis tells you where to focus your precision and where you can relax.

This technique is used in every engineering discipline:
- **Pharmaceutical trials**: which drug doses matter most for efficacy?
- **Climate models**: which parameters drive the biggest uncertainty in temperature projections?
- **Finance**: which market variables have the largest impact on portfolio risk?

You will generate **tornado diagrams** (showing which parameters matter most) and **spider plots** (showing how the output changes as each input varies).`,
      analogy: 'Sensitivity analysis is like testing which ingredients matter most in a recipe. If you double the salt and the dish is ruined, salt is a sensitive parameter. If you double the oregano and it tastes the same, oregano is robust. You learn where to be careful and where to be casual.',
      storyConnection: 'In Tejimola\'s story, each plant form survived or was destroyed by a single factor (the stepmother\'s axe, the location). In the lab, sensitivity analysis reveals which factors are the "axes" that can destroy your experiment and which are safely flexible.',
      checkQuestion: 'If sensitivity analysis shows that contamination rate is the most impactful parameter but you cannot control it below 15%, what should you do?',
      checkAnswer: 'You have several options: (1) increase sample size to absorb losses statistically, (2) invest in better sterile technique equipment (laminar flow hood, autoclaving protocols), (3) use antibiotics/fungicides in the medium to suppress contaminants, or (4) redesign the experiment to use a more contamination-tolerant culture method (e.g., temporary immersion bioreactors). The sensitivity analysis does not fix the problem — it tells you which problem to fix first.',
      codeIntro: 'Run one-at-a-time sensitivity analysis on the experiment planner and generate tornado + spider plots.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Baseline parameters for the tissue culture model
baseline = {
    'auxin': 2.0,      # mg/L
    'cytokinin': 1.0,  # mg/L
    'sucrose': 30.0,   # g/L
    'temp': 25.0,      # Celsius
    'light': 16.0,     # hours/day
    'contam_rate': 0.10 # 10% contamination
}

def predict_success(params):
    """Simplified success rate model based on hormone and environment."""
    a, c = params['auxin'], params['cytokinin']
    ratio = a / (c + 0.01)
    # Optimal ratio around 2:1 for callus + shoot formation
    hormone_score = np.exp(-0.5 * ((np.log10(ratio) - 0.3) / 0.4) ** 2)
    # Temperature optimum at 25C
    temp_score = np.exp(-0.5 * ((params['temp'] - 25) / 3) ** 2)
    # Light optimum at 16h
    light_score = np.exp(-0.5 * ((params['light'] - 16) / 4) ** 2)
    # Sucrose optimum at 30 g/L
    sucrose_score = np.exp(-0.5 * ((params['sucrose'] - 30) / 10) ** 2)
    # Contamination reduces success linearly
    contam_penalty = 1 - params['contam_rate']

    return hormone_score * temp_score * light_score * sucrose_score * contam_penalty

# One-at-a-time sensitivity: vary each by +/- 30%
perturbation = 0.30
baseline_success = predict_success(baseline)

sensitivities = {}
for param in baseline:
    low_params = dict(baseline)
    high_params = dict(baseline)
    low_params[param] = baseline[param] * (1 - perturbation)
    high_params[param] = baseline[param] * (1 + perturbation)
    low_val = predict_success(low_params)
    high_val = predict_success(high_params)
    sensitivities[param] = (low_val - baseline_success, high_val - baseline_success)

# Tornado diagram
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

sorted_params = sorted(sensitivities.keys(),
    key=lambda p: abs(sensitivities[p][1] - sensitivities[p][0]))
y_pos = range(len(sorted_params))
colors_low = '#ef4444'
colors_high = '#22c55e'

ax1.set_facecolor('#111827')
for i, param in enumerate(sorted_params):
    low, high = sensitivities[param]
    ax1.barh(i, low, color=colors_low, height=0.6, alpha=0.8)
    ax1.barh(i, high, color=colors_high, height=0.6, alpha=0.8)
ax1.set_yticks(list(y_pos))
ax1.set_yticklabels(sorted_params, color='white', fontsize=10)
ax1.set_xlabel('Change in success rate', color='white')
ax1.set_title('Tornado Diagram: Which Parameters Matter Most?',
              color='white', fontsize=11)
ax1.axvline(0, color='gray', linewidth=0.5)
ax1.tick_params(colors='gray')
ax1.legend(['-30%', '+30%'], facecolor='#1f2937', labelcolor='white', loc='lower right')

# Spider plot: vary each parameter from -50% to +50%
ax2.set_facecolor('#111827')
sweep = np.linspace(-0.5, 0.5, 50)
colors_spider = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#f472b6']

for idx, param in enumerate(baseline):
    values = []
    for delta in sweep:
        test_params = dict(baseline)
        test_params[param] = baseline[param] * (1 + delta)
        values.append(predict_success(test_params))
    ax2.plot(sweep * 100, values, color=colors_spider[idx], linewidth=2,
             label=param, alpha=0.9)

ax2.axhline(baseline_success, color='gray', linewidth=0.5, linestyle='--')
ax2.set_xlabel('Parameter change (%)', color='white')
ax2.set_ylabel('Predicted success rate', color='white')
ax2.set_title('Spider Plot: Parameter Sensitivity', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Baseline success rate: {baseline_success:.3f}")
print()
print("Sensitivity ranking (most to least impactful):")
for param in reversed(sorted_params):
    low, high = sensitivities[param]
    swing = abs(high - low)
    print(f"  {param:<15}: swing = {swing:.4f} ({swing/baseline_success*100:.1f}%)")`,
      challenge: 'Run a two-parameter interaction analysis: vary auxin and cytokinin together on a 20x20 grid. Create a heatmap showing success rate for each combination. Does the optimal auxin concentration depend on the cytokinin level? If so, the parameters interact (they are not independent).',
      successHint: 'Sensitivity analysis transforms your model from a black box into an interpretable decision tool. You now know which parameters to control precisely and which can be approximate.',
    },
    {
      title: 'Capstone Part 6 — Dashboard and final synthesis',
      concept: `In the final part, you synthesize everything into a single **experiment dashboard**: one visualization that a lab manager could look at and make a go/no-go decision.

The dashboard integrates:
- **Protocol summary**: species, optimal hormones, medium composition
- **Success prediction**: expected yield with confidence intervals
- **Risk heatmap**: which parameters pose the greatest risk
- **Budget breakdown**: cost per regenerated plant
- **Timeline**: Gantt-chart-style representation of experiment phases

This is the culmination of the capstone: from understanding totipotency (Part 1) to protocol optimization (Part 2) to statistical power (Part 3) to complete planning (Part 4) to robustness testing (Part 5) to this final presentation layer.

In real labs, decisions worth millions of dollars are made from dashboards like this. The ability to synthesize complex data into a clear, actionable visualization is one of the most valuable skills in science and engineering.`,
      analogy: 'A dashboard is like the cockpit of an airplane. The pilot does not need to understand every wire and circuit — but they need every critical instrument visible at a glance: altitude, speed, fuel, heading. Your experiment dashboard puts the critical metrics where the lab manager can see them instantly.',
      storyConnection: 'Tejimola\'s story began with a single girl in a garden. Your capstone ends with a complete system for planning, predicting, and managing plant regeneration experiments. The journey from myth to method is complete — from one girl\'s refusal to stop growing, to a scientific framework for helping any plant grow back.',
      checkQuestion: 'What makes a good scientific dashboard different from a pretty chart?',
      checkAnswer: 'A good dashboard: (1) answers a specific question (go/no-go for this experiment), (2) shows uncertainty (confidence intervals, not just point estimates), (3) highlights the most important information (not everything equally), (4) is honest about limitations (what the model cannot predict), and (5) supports action (what should we do next?). A pretty chart just looks nice. A good dashboard drives decisions.',
      codeIntro: 'Build the final experiment dashboard that synthesizes all previous work into an actionable one-page summary.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

np.random.seed(42)

# =====================================================
# FINAL DASHBOARD: Tissue Culture Experiment Summary
# =====================================================

species = 'Tulsi (Ocimum tenuiflorum)'
opt_auxin, opt_cytokinin = 2.0, 1.0
target_plants = 100
success_rate = 0.72
mc_mean, mc_std = 86, 14
ci_low, ci_high = 62, 108
total_cost = 1850
timeline_weeks = 14
p_target = 0.78

# Sensitivity rankings
param_impact = [
    ('auxin:cytokinin ratio', 0.35),
    ('contamination rate', 0.28),
    ('temperature', 0.15),
    ('sucrose concentration', 0.12),
    ('light hours', 0.06),
    ('pH', 0.04),
]

# Timeline phases
phases = [
    ('Explant prep', 0, 1, '#3b82f6'),
    ('Callus induction', 1, 5, '#22c55e'),
    ('Shoot regeneration', 5, 9, '#f59e0b'),
    ('Root induction', 9, 11, '#a855f7'),
    ('Acclimatization', 11, 14, '#ef4444'),
]

fig = plt.figure(figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'TISSUE CULTURE EXPERIMENT DASHBOARD',
             color='white', fontsize=15, fontweight='bold', y=0.98)
fig.text(0.5, 0.95, f'Species: {species}', ha='center', color='#94a3b8', fontsize=11)

# 1. Yield distribution (top left)
ax1 = fig.add_axes([0.05, 0.55, 0.28, 0.33])
ax1.set_facecolor('#111827')
mc_data = np.random.normal(mc_mean, mc_std, 5000).clip(0)
ax1.hist(mc_data, bins=40, color='#22c55e', alpha=0.7, edgecolor='none')
ax1.axvline(target_plants, color='#ef4444', linewidth=2, linestyle='--', label=f'Target: {target_plants}')
ax1.axvline(mc_mean, color='#fbbf24', linewidth=2, label=f'Mean: {mc_mean}')
ax1.fill_betweenx([0, 400], ci_low, ci_high, alpha=0.15, color='#22c55e')
ax1.set_title('Predicted Yield Distribution', color='white', fontsize=10)
ax1.set_xlabel('Plants regenerated', color='white', fontsize=9)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=7, loc='upper left')
ax1.tick_params(colors='gray', labelsize=8)

# 2. Key metrics (top center)
ax2 = fig.add_axes([0.38, 0.55, 0.25, 0.33])
ax2.set_facecolor('#111827')
ax2.axis('off')
metrics = [
    ('Success rate', f'{success_rate*100:.0f}%', '#22c55e'),
    ('Expected yield', f'{mc_mean} +/- {mc_std}', '#3b82f6'),
    ('P(reach target)', f'{p_target*100:.0f}%', '#f59e0b'),
    ('Total cost', f'\{total_cost:,}', '#a855f7'),
    ('Cost per plant', f'\{total_cost/mc_mean:.0f}', '#f472b6'),
    ('Timeline', f'{timeline_weeks} weeks', '#22d3ee'),
]
ax2.text(0.5, 0.98, 'KEY METRICS', transform=ax2.transAxes,
         ha='center', color='#fbbf24', fontsize=11, fontweight='bold')
for i, (label, value, color) in enumerate(metrics):
    y = 0.85 - i * 0.14
    ax2.text(0.05, y, label, transform=ax2.transAxes, color='gray', fontsize=9)
    ax2.text(0.95, y, value, transform=ax2.transAxes,
             ha='right', color=color, fontsize=10, fontweight='bold')

# 3. Risk heatmap (top right)
ax3 = fig.add_axes([0.68, 0.55, 0.28, 0.33])
ax3.set_facecolor('#111827')
params = [p[0] for p in param_impact]
impacts = [p[1] for p in param_impact]
colors_risk = ['#ef4444' if v > 0.25 else '#f59e0b' if v > 0.1 else '#22c55e' for v in impacts]
bars = ax3.barh(range(len(params)), impacts, color=colors_risk, height=0.6)
ax3.set_yticks(range(len(params)))
ax3.set_yticklabels(params, color='white', fontsize=8)
ax3.set_xlabel('Impact on success', color='white', fontsize=9)
ax3.set_title('Parameter Risk Ranking', color='white', fontsize=10)
ax3.tick_params(colors='gray', labelsize=8)
ax3.invert_yaxis()

# 4. Timeline / Gantt (bottom)
ax4 = fig.add_axes([0.05, 0.08, 0.9, 0.35])
ax4.set_facecolor('#111827')
for i, (name, start, end, color) in enumerate(phases):
    ax4.barh(i, end - start, left=start, color=color, height=0.5, alpha=0.8)
    ax4.text((start + end) / 2, i, name, ha='center', va='center',
             color='white', fontsize=9, fontweight='bold')
ax4.set_yticks(range(len(phases)))
ax4.set_yticklabels(['' for _ in phases])
ax4.set_xlabel('Weeks', color='white', fontsize=10)
ax4.set_title('Experiment Timeline', color='white', fontsize=10)
ax4.tick_params(colors='gray', labelsize=9)
ax4.set_xlim(0, timeline_weeks + 1)
ax4.invert_yaxis()

# Decision box
verdict = 'GO' if p_target > 0.7 and total_cost < 2500 else 'REVIEW'
verdict_color = '#22c55e' if verdict == 'GO' else '#f59e0b'
fig.text(0.5, 0.47, f'DECISION: {verdict}', ha='center',
         color=verdict_color, fontsize=14, fontweight='bold',
         bbox=dict(boxstyle='round,pad=0.4', facecolor=verdict_color, alpha=0.15))

plt.show()

print("EXPERIMENT DASHBOARD COMPLETE")
print(f"Decision: {verdict}")
print(f"  Success probability: {p_target:.0%}")
print(f"  Expected yield: {mc_mean} plants (target: {target_plants})")
print(f"  Budget: \{total_cost:,} (\{total_cost/mc_mean:.0f}/plant)")
print(f"  Timeline: {timeline_weeks} weeks")
print()
print("CAPSTONE COMPLETE: From Tejimola's garden to a complete")
print("scientific planning framework for plant regeneration.")`,
      challenge: 'Add a "what-if" panel to the dashboard: if contamination doubles from 10% to 20%, how do all the metrics change? Show both scenarios side by side. This is scenario planning — the final skill that separates analysis from decision-making.',
      successHint: 'You have completed the full journey: from a folktale about a girl who became a plant, through cell biology, genetics, tissue culture, Monte Carlo simulation, sensitivity analysis, and finally a professional experiment dashboard. This is computational biology in action.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Tissue Culture Experiment Planner
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (plant biotechnology & tissue culture)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a Tissue Culture Experiment Planner with species optimization, Monte Carlo risk analysis, and budget planning. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
