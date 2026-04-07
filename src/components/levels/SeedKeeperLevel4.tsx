import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SeedKeeperLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Project Design: Seed Germination Experiment Simulator',
      concept: `Your capstone project builds a **seed germination experiment simulator** that models how storage conditions (temperature, moisture, light exposure) affect seed viability over time. This is the exact experimental design that seed bank scientists use to determine optimal storage protocols, and the same experiment that Apfu Azuo performed intuitively every spring when she tested her seeds.

The experiment has a classic **controlled design** with five treatment groups, each containing 20 seeds of the same variety. The groups differ only in storage conditions: (1) room temperature, dry; (2) room temperature, moist; (3) refrigerated at 5 degrees C; (4) frozen at -18 degrees C; (5) room temperature with sunlight exposure. After a storage period, all seeds are planted under identical conditions and germination is recorded.

The simulator needs three components. First, a **viability model** that predicts germination probability as a function of storage time, temperature, and moisture, based on the Ellis-Roberts probit equation from seed science. Second, a **statistical engine** that generates realistic experimental data with biological variability (not every seed in the same batch behaves identically). Third, an **analysis pipeline** that computes germination rates, confidence intervals, and statistical tests to determine which storage conditions significantly differ.

The deliverable is a complete experimental report: hypothesis, methods, results with error bars, statistical tests, and a conclusion about optimal storage. This is the scientific method implemented as code.`,
      analogy: 'Designing this experiment is like designing a clinical drug trial. You need treatment groups (storage conditions), a control group (room temp dry), randomization (which seed goes where), a measurable outcome (germination yes/no), and statistical analysis to separate real effects from random variation. The seeds are your patients, storage conditions are your treatments, and germination is the health outcome.',
      storyConnection: 'Apfu Azuo tested her seeds every spring by placing a handful in wet cloth and counting how many sprouted. She was running a germination experiment with one treatment group and no statistics. Our simulator formalizes her method into a rigorous scientific design. The difference between her single-sample test and our five-group experiment with confidence intervals is the difference between folk knowledge and science, but both start from the same question: are these seeds still alive?',
      checkQuestion: 'Why do we need 20 seeds per group instead of just 5? What goes wrong with a small sample size?',
      checkAnswer: 'With 5 seeds per group, random variation dominates. If 3 out of 5 germinate (60%) vs 4 out of 5 (80%), that looks like a big difference, but the uncertainty is huge: the 95% confidence interval for 3/5 is roughly 15-95%. You cannot distinguish real treatment effects from luck. With 20 seeds, 12/20 (60%) has a CI of about 36-81%, and 16/20 (80%) has a CI of about 56-94%. Still overlapping, but much more informative. More seeds means narrower confidence intervals and more reliable conclusions.',
      codeIntro: 'Design the experiment, define treatment groups, and build the seed viability model that will generate our data.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from math import erf, sqrt

np.random.seed(42)

# --- Seed Viability Model (Ellis-Roberts) ---
def normal_cdf(x):
    """Standard normal cumulative distribution function."""
    return 0.5 * (1 + np.vectorize(erf)(x / sqrt(2)))

def probit(p):
    """Inverse normal CDF (probit function)."""
    p = np.clip(p, 1e-10, 1 - 1e-10)
    a = 8 * (np.pi - 3) / (3 * np.pi * (4 - np.pi))
    x = 2 * p - 1
    ln_term = np.log(1 - x**2)
    term1 = 2 / (np.pi * a) + ln_term / 2
    result = np.sign(x) * np.sqrt(np.sqrt(term1**2 - ln_term / a) - term1)
    return result * np.sqrt(2)

class SeedViabilityModel:
    """Ellis-Roberts probit model for seed viability prediction."""

    def __init__(self, species, KE, Cw, Ch, Cq, Ki=2.0):
        self.species = species
        self.KE = KE
        self.Cw = Cw
        self.Ch = Ch
        self.Cq = Cq
        self.Ki = Ki  # initial seed quality (probit units)

    def sigma(self, temp_c, moisture_pct):
        """Time constant: how long until viability drops 1 probit unit."""
        log_sigma = (self.KE
                     - self.Cw * np.log10(np.maximum(moisture_pct, 1))
                     - self.Ch * temp_c
                     - self.Cq * temp_c**2)
        return 10**np.clip(log_sigma, -2, 10)

    def predict(self, time_weeks, temp_c, moisture_pct):
        """Predict germination probability after storage."""
        time_years = time_weeks / 52.0
        s = self.sigma(temp_c, moisture_pct)
        v = self.Ki - time_years / np.maximum(s, 0.001)
        return np.clip(normal_cdf(v), 0, 1)

# --- Define species for our experiment ---
# Using mustard bean (common in Nagaland experiments)
mustard = SeedViabilityModel('Mustard', KE=7.0, Cw=3.5, Ch=0.045, Cq=0.000180)

# --- Define experimental treatment groups ---
treatments = {
    'Room Dry':   {'temp': 25, 'moisture': 6,  'light': False,
                   'description': 'Room temperature (25C), dry (6% moisture)'},
    'Room Moist': {'temp': 25, 'moisture': 14, 'light': False,
                   'description': 'Room temperature (25C), moist (14% moisture)'},
    'Refrigerated': {'temp': 5, 'moisture': 6, 'light': False,
                     'description': 'Refrigerator (5C), dry (6% moisture)'},
    'Frozen':     {'temp': -18, 'moisture': 5, 'light': False,
                   'description': 'Freezer (-18C), dry (5% moisture)'},
    'Sunlight':   {'temp': 30, 'moisture': 8, 'light': True,
                   'description': 'Room temp with sunlight (30C, 8% moisture)'},
}

n_seeds = 20  # seeds per group
storage_weeks = 2  # standard experiment duration

# --- Predict viability for each treatment ---
fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Seed Germination Experiment Design',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Viability over time for each treatment
ax = axes[0, 0]
weeks = np.linspace(0, 52, 200)  # 1 year
colors = ['#22c55e', '#ef4444', '#3b82f6', '#a855f7', '#f59e0b']
for i, (name, cond) in enumerate(treatments.items()):
    viab = mustard.predict(weeks, cond['temp'], cond['moisture']) * 100
    if cond['light']:
        viab *= np.exp(-0.002 * weeks)  # UV damage
    ax.plot(weeks, viab, color=colors[i], linewidth=2, label=name)
ax.axhline(85, color='gray', linestyle=':', label='85% threshold')
ax.axvline(storage_weeks, color='white', linestyle='--', alpha=0.5, label='Test at 2 weeks')
ax.set_xlabel('Storage time (weeks)', color='white')
ax.set_ylabel('Predicted germination (%)', color='white')
ax.set_title('Viability Prediction Over Time', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Treatment conditions comparison
ax = axes[0, 1]
t_names = list(treatments.keys())
temps = [treatments[n]['temp'] for n in t_names]
moist = [treatments[n]['moisture'] for n in t_names]
ax.scatter(temps, moist, c=colors, s=200, edgecolors='white', linewidths=2, zorder=5)
for i, name in enumerate(t_names):
    ax.annotate(name, (temps[i], moist[i]), textcoords="offset points",
                xytext=(10, 10), color='white', fontsize=9)
ax.set_xlabel('Temperature (C)', color='white')
ax.set_ylabel('Moisture content (%)', color='white')
ax.set_title('Treatment Conditions', color='white', fontsize=11)
ax.grid(True, alpha=0.15, color='gray')

# Plot 3: Predicted germination at 2 weeks
ax = axes[0, 2]
pred_germ = []
for name, cond in treatments.items():
    g = mustard.predict(storage_weeks, cond['temp'], cond['moisture'])
    if cond['light']:
        g *= np.exp(-0.002 * storage_weeks)
    pred_germ.append(g * 100)
bars = ax.bar(t_names, pred_germ, color=colors, edgecolor='none')
for bar, g in zip(bars, pred_germ):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{g:.1f}%', ha='center', color='white', fontsize=10)
ax.set_ylabel('Predicted germination (%)', color='white')
ax.set_title('Predictions at 2 Weeks', color='white', fontsize=11)
ax.set_xticklabels(t_names, rotation=20, fontsize=9, color='white')

# Plot 4: Temperature effect (holding moisture constant)
ax = axes[1, 0]
temp_range = np.linspace(-20, 40, 100)
for weeks_test in [2, 12, 26, 52]:
    viab = mustard.predict(weeks_test, temp_range, 6) * 100
    ax.plot(temp_range, viab, linewidth=2, label=f'{weeks_test} weeks')
ax.set_xlabel('Temperature (C)', color='white')
ax.set_ylabel('Germination (%)', color='white')
ax.set_title('Temperature Effect (6% moisture)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Moisture effect (holding temperature constant)
ax = axes[1, 1]
moist_range = np.linspace(3, 18, 100)
for weeks_test in [2, 12, 26, 52]:
    viab = mustard.predict(weeks_test, 25, moist_range) * 100
    ax.plot(moist_range, viab, linewidth=2, label=f'{weeks_test} weeks')
ax.set_xlabel('Moisture content (%)', color='white')
ax.set_ylabel('Germination (%)', color='white')
ax.set_title('Moisture Effect (25C)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Experiment summary
ax = axes[1, 2]
ax.axis('off')
text = "Experiment Design\\n" + "=" * 30 + "\\n\\n"
text += f"Species: {mustard.species}\\n"
text += f"Seeds per group: {n_seeds}\\n"
text += f"Treatment groups: {len(treatments)}\\n"
text += f"Total seeds: {n_seeds * len(treatments)}\\n"
text += f"Storage period: {storage_weeks} weeks\\n\\n"
text += "Hypothesis:\\n"
text += "  Cold, dry storage preserves\\n"
text += "  seed viability significantly\\n"
text += "  better than room temperature\\n"
text += "  or moist conditions.\\n\\n"
text += "Controls:\\n"
text += "  Same seed lot, same planting\\n"
text += "  conditions after storage.\\n\\n"
text += "Next: generate realistic data\\n"
text += "with biological variability."
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Experiment designed: 5 treatments x 20 seeds = 100 seeds total.")
print("Model predicts cold dry storage will dramatically outperform warm moist storage.")
print("Next: simulate the experiment with realistic biological variability.")`,
      challenge: 'Add a sixth treatment group: "Traditional Naga" that simulates Apfu Azuo\'s bamboo tube storage (estimated 22 degrees C, 9% moisture, dark). How does the traditional method compare to the modern treatments?',
      successHint: 'The experiment design follows the scientific method exactly: hypothesis, controlled variables, measurable outcome, multiple treatment groups. The viability model predicts that temperature and moisture are the dominant factors. Now we need to generate realistic data to test whether the prediction holds up with biological noise.',
    },
    {
      title: 'Generating Realistic Experimental Data',
      concept: `A real germination experiment does not produce clean numbers. Even seeds from the same plant, stored identically, show **individual variation** in germination. Some seeds have thicker seed coats, different dormancy levels, or slight genetic differences that affect viability. Our simulator must capture this biological noise to produce realistic experimental data.

We model germination as a **Bernoulli trial** for each seed. The viability model gives us the probability p that a seed germinates under given conditions. Each individual seed then germinates (1) or fails (0) with probability p. This is like flipping a biased coin 20 times: even if the true probability is 80%, you might get 14, 17, or 19 heads in a particular trial.

But there is a subtlety. Seeds within a batch are not perfectly independent. They share genetics, were harvested together, and experienced the same pre-storage conditions. This creates **intra-class correlation**: if one seed in a batch is slightly weaker, its neighbours probably are too. We model this by adding a random **batch effect** that shifts the germination probability for the entire group up or down by a small amount.

The data generation pipeline is: (1) compute base germination probability from the viability model, (2) add batch-level random effect (normal distribution, SD ~0.05), (3) for each seed, draw a Bernoulli outcome with the batch-adjusted probability, (4) record germination as 1 (sprouted) or 0 (failed). This produces data that looks like what a student would actually observe in the lab.`,
      analogy: 'Generating realistic data is like a movie set designer creating a "messy room." You could just scatter objects randomly, but that does not look realistic. A real room has patterns: books near the desk, shoes near the door, dust where nobody reaches. Our data generator adds the biological patterns (batch effects, individual variation) that make the simulated experiment look like the real thing.',
      storyConnection: 'When Apfu Azuo tested seeds each spring, she expected variation. Some years, the black rice germinated beautifully. Other years, the same variety stored the same way did worse. She attributed this to "the mood of the seeds." Our model says the same thing quantitatively: batch effects and individual variation create year-to-year differences even under identical conditions.',
      checkQuestion: 'If the true germination probability is 0.90 and you test 20 seeds, what is the probability of getting exactly 20 out of 20 germinating? What is the probability of getting 16 or fewer?',
      checkAnswer: 'P(20/20) = 0.90^20 = 0.122 (about 12%). P(16 or fewer) requires summing the binomial distribution: approximately 8%. So even with 90% viability, you have about a 1-in-8 chance of seeing 16 or fewer germinate. This is why we need statistics, not just counting. A result of 16/20 does NOT mean the true rate is 80%.',
      codeIntro: 'Generate synthetic germination data for all five treatment groups with realistic biological variability.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from math import erf, sqrt

np.random.seed(42)

def normal_cdf(x):
    return 0.5 * (1 + np.vectorize(erf)(x / sqrt(2)))

class SeedModel:
    def __init__(self, KE, Cw, Ch, Cq, Ki=2.0):
        self.KE = KE; self.Cw = Cw; self.Ch = Ch; self.Cq = Cq; self.Ki = Ki
    def predict(self, weeks, temp, moisture):
        years = weeks / 52.0
        log_s = self.KE - self.Cw * np.log10(max(moisture, 1)) - self.Ch * temp - self.Cq * temp**2
        sigma = 10**np.clip(log_s, -2, 10)
        return float(np.clip(normal_cdf(self.Ki - years / max(sigma, 0.001)), 0, 1))

mustard = SeedModel(7.0, 3.5, 0.045, 0.000180)

treatments = {
    'Room Dry':     {'temp': 25, 'moisture': 6,  'light': False},
    'Room Moist':   {'temp': 25, 'moisture': 14, 'light': False},
    'Refrigerated': {'temp': 5,  'moisture': 6,  'light': False},
    'Frozen':       {'temp': -18, 'moisture': 5, 'light': False},
    'Sunlight':     {'temp': 30, 'moisture': 8,  'light': True},
}

n_seeds = 20
storage_weeks = 2
n_replicates = 5  # run experiment 5 times for robustness

def generate_experiment_data(model, treatments, n_seeds, weeks, n_reps):
    """Generate germination data with batch effects and individual variation."""
    all_data = {}
    for name, cond in treatments.items():
        base_prob = model.predict(weeks, cond['temp'], cond['moisture'])
        if cond['light']:
            base_prob *= np.exp(-0.002 * weeks)

        replicate_results = []
        for rep in range(n_reps):
            # Batch effect: slight shift in probability for this replicate
            batch_shift = np.random.normal(0, 0.05)
            batch_prob = np.clip(base_prob + batch_shift, 0.01, 0.99)

            # Individual seed outcomes (Bernoulli trials)
            outcomes = np.random.binomial(1, batch_prob, n_seeds)
            replicate_results.append({
                'outcomes': outcomes,
                'n_germinated': int(outcomes.sum()),
                'rate': outcomes.sum() / n_seeds,
                'batch_prob': batch_prob,
            })

        all_data[name] = {
            'base_prob': base_prob,
            'replicates': replicate_results,
            'mean_rate': np.mean([r['rate'] for r in replicate_results]),
            'std_rate': np.std([r['rate'] for r in replicate_results]),
            'all_rates': [r['rate'] for r in replicate_results],
        }
    return all_data

data = generate_experiment_data(mustard, treatments, n_seeds, storage_weeks, n_replicates)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Simulated Germination Experiment: 5 Treatments x 5 Replicates',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors = ['#22c55e', '#ef4444', '#3b82f6', '#a855f7', '#f59e0b']
t_names = list(treatments.keys())

# Plot 1: Raw germination counts per replicate
ax = axes[0, 0]
x_pos = np.arange(len(t_names))
width = 0.15
for rep in range(n_replicates):
    counts = [data[n]['replicates'][rep]['n_germinated'] for n in t_names]
    ax.bar(x_pos + rep * width - 2 * width, counts, width,
           color=colors[rep % len(colors)], alpha=0.7, edgecolor='none',
           label=f'Rep {rep+1}')
ax.set_xticks(x_pos)
ax.set_xticklabels(t_names, color='white', fontsize=8, rotation=20)
ax.set_ylabel('Seeds germinated (out of 20)', color='white')
ax.set_title('Raw Counts by Replicate', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Germination rates with error bars
ax = axes[0, 1]
means = [data[n]['mean_rate'] * 100 for n in t_names]
stds = [data[n]['std_rate'] * 100 for n in t_names]
bars = ax.bar(t_names, means, yerr=stds, color=colors, edgecolor='none',
              capsize=5, error_kw={'color': 'white', 'linewidth': 1.5})
for bar, m, s in zip(bars, means, stds):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + s + 2,
            f'{m:.1f}%', ha='center', color='white', fontsize=10)
ax.set_ylabel('Germination rate (%)', color='white')
ax.set_title('Mean Rate with Std Dev', color='white', fontsize=11)
ax.set_xticklabels(t_names, rotation=20, fontsize=8, color='white')

# Plot 3: Model prediction vs observed
ax = axes[0, 2]
predicted = [data[n]['base_prob'] * 100 for n in t_names]
observed = means
ax.scatter(predicted, observed, c=colors, s=150, edgecolors='white', linewidths=2, zorder=5)
for i, name in enumerate(t_names):
    ax.annotate(name, (predicted[i], observed[i]), textcoords="offset points",
                xytext=(8, 8), color='white', fontsize=9)
ax.plot([50, 100], [50, 100], 'w--', alpha=0.3, label='Perfect prediction')
ax.set_xlabel('Model predicted (%)', color='white')
ax.set_ylabel('Observed mean (%)', color='white')
ax.set_title('Predicted vs Observed', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Individual seed outcomes (one replicate)
ax = axes[1, 0]
for i, name in enumerate(t_names):
    outcomes = data[name]['replicates'][0]['outcomes']
    for j, o in enumerate(outcomes):
        color = '#22c55e' if o == 1 else '#ef4444'
        ax.scatter(j, i, c=color, s=40, marker='o', edgecolors='none')
ax.set_yticks(range(len(t_names)))
ax.set_yticklabels(t_names, color='white', fontsize=9)
ax.set_xlabel('Seed number', color='white')
ax.set_title('Individual Seeds (Rep 1): green=germinated', color='white', fontsize=10)

# Plot 5: Replicate-level distribution (strip plot)
ax = axes[1, 1]
for i, name in enumerate(t_names):
    rates = [r * 100 for r in data[name]['all_rates']]
    ax.scatter([i] * len(rates), rates, c=colors[i], s=80, alpha=0.7, edgecolors='white')
    ax.plot([i - 0.2, i + 0.2], [data[name]['mean_rate'] * 100] * 2,
            color='white', linewidth=2)
ax.set_xticks(range(len(t_names)))
ax.set_xticklabels(t_names, color='white', fontsize=8, rotation=20)
ax.set_ylabel('Germination rate (%)', color='white')
ax.set_title('Replicate Variation (dots = replicates)', color='white', fontsize=10)

# Plot 6: Data summary
ax = axes[1, 2]
ax.axis('off')
text = "Experiment Data Generated\\n" + "=" * 30 + "\\n\\n"
text += f"{'Treatment':<14} {'Predicted':>9} {'Observed':>9} {'SD':>6}\\n"
text += "-" * 42 + "\\n"
for i, name in enumerate(t_names):
    text += (f"{name:<14} {data[name]['base_prob']*100:>8.1f}% "
             f"{data[name]['mean_rate']*100:>8.1f}% "
             f"{data[name]['std_rate']*100:>5.1f}%\\n")
text += "\\nBatch effects create realistic\\n"
text += "replicate-to-replicate variation.\\n"
text += "Individual seeds add per-seed noise.\\n\\n"
text += "Next: statistical analysis to\\n"
text += "determine significant differences."
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Experiment data generated: 5 treatments x 5 replicates x 20 seeds = 500 seeds.")
print(f"Best treatment: {max(t_names, key=lambda n: data[n]['mean_rate'])}")
print(f"Worst treatment: {min(t_names, key=lambda n: data[n]['mean_rate'])}")
print("Next: statistical analysis to determine which differences are significant.")`,
      challenge: 'Add a "contamination" event: in replicate 3 of the Room Moist group, a fungal infection kills 50% of seeds regardless of viability. How does this outlier affect the mean and standard deviation? Should it be excluded from analysis?',
      successHint: 'Realistic data generation is harder than it looks. Each seed is a Bernoulli trial with a probability shifted by batch effects. The resulting data has the right amount of noise: enough to see clear trends, but with enough variability that you cannot draw conclusions by eye alone. That is why we need statistics.',
    },
    {
      title: 'Statistical Analysis: Confidence Intervals and Hypothesis Testing',
      concept: `Looking at germination rates is not enough. "Frozen: 97%, Room Moist: 78%" looks like a clear winner, but is the difference **statistically significant** or could it be random noise? This lesson builds the statistical machinery to answer that question rigorously.

The first tool is the **confidence interval**. For a proportion (germination rate), the 95% confidence interval is approximately: p_hat +/- 1.96 * sqrt(p_hat * (1 - p_hat) / n), where p_hat is the observed rate and n is the sample size. If two treatments have non-overlapping confidence intervals, the difference is almost certainly real (though overlapping CIs do not necessarily mean no difference).

The second tool is the **chi-squared test** for comparing proportions. The null hypothesis is: "these two treatments produce the same germination rate." We compute the chi-squared statistic from the observed and expected counts, then check if it exceeds the critical value for significance. A p-value below 0.05 means we reject the null hypothesis: the treatments are significantly different.

The third tool is **pairwise comparisons**. With five treatments, there are 10 possible pairs to compare. But testing 10 pairs inflates the false positive rate (the **multiple comparisons problem**). If each test has a 5% false positive rate, the probability of at least one false positive across 10 tests is 1 - 0.95^10 = 40%. We correct for this using the **Bonferroni correction**: divide the significance threshold by the number of tests. So instead of p < 0.05, we require p < 0.005 for each pairwise comparison.`,
      analogy: 'Statistical testing is like a courtroom trial. The null hypothesis is "the defendant is innocent" (the treatments are the same). The evidence is the data. The p-value is the probability that an innocent person would produce this evidence. A small p-value (below 0.05) is like saying "an innocent person would almost never produce this evidence, so we reject innocence." The Bonferroni correction is like requiring stronger evidence when there are many suspects.',
      storyConnection: 'Apfu Azuo never ran statistical tests on her seeds. She relied on decades of experience: "the seeds in the clay pot always do better than the ones near the window." Our analysis formalizes her accumulated observations into a single experiment with statistical power. What took her a lifetime to learn, we can confirm in one rigorous test. But her intuition was right: cold and dry beats warm and light.',
      checkQuestion: 'In an experiment with 20 seeds, the frozen group has 19/20 germinate (95%) and the room moist group has 15/20 (75%). Are these significantly different at the 0.05 level?',
      checkAnswer: 'The 95% CI for 19/20 is roughly 85-100%. The 95% CI for 15/20 is roughly 56-94%. These intervals overlap (94% > 85%), so we cannot be confident they are different with only 20 seeds per group. The chi-squared test gives a p-value of about 0.08, which is above 0.05. We would need more seeds or a larger observed difference to reach significance. This is a Type II error risk: a real difference exists but we lack power to detect it.',
      codeIntro: 'Compute confidence intervals, run chi-squared tests, and perform pairwise comparisons with Bonferroni correction.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from math import erf, sqrt

np.random.seed(42)

def normal_cdf(x):
    return 0.5 * (1 + np.vectorize(erf)(x / sqrt(2)))

class SeedModel:
    def __init__(self, KE, Cw, Ch, Cq, Ki=2.0):
        self.KE = KE; self.Cw = Cw; self.Ch = Ch; self.Cq = Cq; self.Ki = Ki
    def predict(self, weeks, temp, moisture):
        years = weeks / 52.0
        log_s = self.KE - self.Cw * np.log10(max(moisture, 1)) - self.Ch * temp - self.Cq * temp**2
        sigma = 10**np.clip(log_s, -2, 10)
        return float(np.clip(normal_cdf(self.Ki - years / max(sigma, 0.001)), 0, 1))

mustard = SeedModel(7.0, 3.5, 0.045, 0.000180)

treatments = {
    'Room Dry':     {'temp': 25, 'moisture': 6,  'light': False},
    'Room Moist':   {'temp': 25, 'moisture': 14, 'light': False},
    'Refrigerated': {'temp': 5,  'moisture': 6,  'light': False},
    'Frozen':       {'temp': -18, 'moisture': 5, 'light': False},
    'Sunlight':     {'temp': 30, 'moisture': 8,  'light': True},
}

# Generate data (pooling replicates for more power: 100 seeds per group)
n_seeds = 100
storage_weeks = 4  # longer storage to see bigger differences
results = {}
for name, cond in treatments.items():
    base_p = mustard.predict(storage_weeks, cond['temp'], cond['moisture'])
    if cond['light']:
        base_p *= np.exp(-0.002 * storage_weeks)
    batch_p = np.clip(base_p + np.random.normal(0, 0.03), 0.01, 0.99)
    outcomes = np.random.binomial(1, batch_p, n_seeds)
    results[name] = {
        'n_germ': int(outcomes.sum()),
        'n_total': n_seeds,
        'rate': outcomes.sum() / n_seeds,
        'true_p': base_p,
    }

# --- Statistical Functions ---
def confidence_interval(successes, n, alpha=0.05):
    """Wilson score confidence interval for a proportion."""
    p_hat = successes / n
    z = 1.96 if alpha == 0.05 else 2.576  # 95% or 99%
    denom = 1 + z**2 / n
    center = (p_hat + z**2 / (2 * n)) / denom
    spread = z * np.sqrt(p_hat * (1 - p_hat) / n + z**2 / (4 * n**2)) / denom
    return max(0, center - spread), min(1, center + spread)

def chi_squared_test(n1_success, n1_total, n2_success, n2_total):
    """Chi-squared test for comparing two proportions."""
    # Pooled proportion
    p_pool = (n1_success + n2_success) / (n1_total + n2_total)
    if p_pool == 0 or p_pool == 1:
        return 0, 1.0

    # Expected values
    e1_success = n1_total * p_pool
    e1_fail = n1_total * (1 - p_pool)
    e2_success = n2_total * p_pool
    e2_fail = n2_total * (1 - p_pool)

    # Chi-squared statistic
    chi2 = 0
    for obs, exp in [(n1_success, e1_success), (n1_total - n1_success, e1_fail),
                     (n2_success, e2_success), (n2_total - n2_success, e2_fail)]:
        if exp > 0:
            chi2 += (obs - exp)**2 / exp

    # Approximate p-value from chi2 with 1 df
    # Using normal approximation: sqrt(chi2) ~ N(0,1) for large samples
    z = np.sqrt(chi2)
    p_value = 2 * (1 - float(normal_cdf(z)))
    return chi2, p_value

# Compute CIs
t_names = list(treatments.keys())
for name in t_names:
    r = results[name]
    lo, hi = confidence_interval(r['n_germ'], r['n_total'])
    r['ci_low'] = lo
    r['ci_high'] = hi

# Pairwise comparisons with Bonferroni
n_comparisons = len(t_names) * (len(t_names) - 1) // 2
bonferroni_threshold = 0.05 / n_comparisons
pairwise = []
for i in range(len(t_names)):
    for j in range(i + 1, len(t_names)):
        n1, n2 = t_names[i], t_names[j]
        r1, r2 = results[n1], results[n2]
        chi2, p_val = chi_squared_test(r1['n_germ'], r1['n_total'],
                                        r2['n_germ'], r2['n_total'])
        pairwise.append({
            'pair': f'{n1} vs {n2}',
            'name1': n1, 'name2': n2,
            'chi2': chi2, 'p_value': p_val,
            'significant': p_val < bonferroni_threshold,
            'rate_diff': abs(r1['rate'] - r2['rate']) * 100,
        })

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Statistical Analysis: Confidence Intervals & Hypothesis Tests',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors = ['#22c55e', '#ef4444', '#3b82f6', '#a855f7', '#f59e0b']

# Plot 1: Germination rates with 95% CIs
ax = axes[0, 0]
rates = [results[n]['rate'] * 100 for n in t_names]
ci_lows = [results[n]['ci_low'] * 100 for n in t_names]
ci_highs = [results[n]['ci_high'] * 100 for n in t_names]
yerr_low = [r - lo for r, lo in zip(rates, ci_lows)]
yerr_high = [hi - r for r, hi in zip(rates, ci_highs)]
ax.bar(t_names, rates, color=colors, edgecolor='none', alpha=0.7)
ax.errorbar(t_names, rates, yerr=[yerr_low, yerr_high], fmt='none',
            ecolor='white', capsize=8, capthick=2, linewidth=2)
for i, (r, lo, hi) in enumerate(zip(rates, ci_lows, ci_highs)):
    ax.text(i, hi + 2, f'{r:.0f}%\\n[{lo:.0f}-{hi:.0f}]', ha='center',
            color='white', fontsize=8)
ax.set_ylabel('Germination rate (%)', color='white')
ax.set_title('Rates with 95% Confidence Intervals', color='white', fontsize=11)
ax.set_xticklabels(t_names, rotation=20, fontsize=8, color='white')

# Plot 2: Pairwise p-values heatmap
ax = axes[0, 1]
n_t = len(t_names)
p_matrix = np.ones((n_t, n_t))
for pw in pairwise:
    i = t_names.index(pw['name1'])
    j = t_names.index(pw['name2'])
    p_matrix[i, j] = pw['p_value']
    p_matrix[j, i] = pw['p_value']

im = ax.imshow(p_matrix, cmap='RdYlGn', vmin=0, vmax=0.1)
ax.set_xticks(range(n_t))
ax.set_xticklabels(t_names, color='white', fontsize=7, rotation=45)
ax.set_yticks(range(n_t))
ax.set_yticklabels(t_names, color='white', fontsize=7)
for i in range(n_t):
    for j in range(n_t):
        if i != j:
            txt = f'{p_matrix[i,j]:.3f}'
            sig = '*' if p_matrix[i,j] < bonferroni_threshold else ''
            ax.text(j, i, f'{txt}{sig}', ha='center', va='center',
                    color='black', fontsize=7)
plt.colorbar(im, ax=ax, label='p-value', shrink=0.7)
ax.set_title(f'Pairwise p-values (* = sig at {bonferroni_threshold:.3f})',
             color='white', fontsize=10)

# Plot 3: Effect sizes (rate differences)
ax = axes[0, 2]
sig_pairs = [pw for pw in pairwise if pw['significant']]
nonsig_pairs = [pw for pw in pairwise if not pw['significant']]
if sig_pairs:
    sig_pairs.sort(key=lambda x: -x['rate_diff'])
    pair_names = [pw['pair'] for pw in sig_pairs]
    diffs = [pw['rate_diff'] for pw in sig_pairs]
    ax.barh(pair_names, diffs, color='#22c55e', edgecolor='none')
    for i, (d, pw) in enumerate(zip(diffs, sig_pairs)):
        ax.text(d + 0.5, i, f'{d:.1f}% (p={pw["p_value"]:.4f})',
                va='center', color='white', fontsize=8)
ax.set_xlabel('Rate difference (%)', color='white')
ax.set_title('Significant Pairwise Differences', color='white', fontsize=11)

# Plot 4: Sample size power analysis
ax = axes[1, 0]
sample_sizes = [10, 20, 50, 100, 200, 500]
true_diff = 0.15  # 15% difference to detect
powers = []
for n in sample_sizes:
    # Simulate power: how often do we detect a 15% difference?
    detections = 0
    for _ in range(500):
        g1 = np.random.binomial(n, 0.90)
        g2 = np.random.binomial(n, 0.75)
        _, p_val = chi_squared_test(g1, n, g2, n)
        if p_val < 0.05:
            detections += 1
    powers.append(detections / 500 * 100)
ax.plot(sample_sizes, powers, 'o-', color='#3b82f6', linewidth=2, markersize=8)
ax.axhline(80, color='#f59e0b', linestyle='--', label='80% power target')
ax.set_xlabel('Seeds per group', color='white')
ax.set_ylabel('Statistical power (%)', color='white')
ax.set_title('Power Analysis: Detecting 15% Difference', color='white', fontsize=10)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: CI width vs sample size
ax = axes[1, 1]
for rate in [0.70, 0.85, 0.95]:
    ci_widths = []
    for n in sample_sizes:
        lo, hi = confidence_interval(int(rate * n), n)
        ci_widths.append((hi - lo) * 100)
    ax.plot(sample_sizes, ci_widths, 'o-', linewidth=2, label=f'Rate={rate*100:.0f}%')
ax.set_xlabel('Seeds per group', color='white')
ax.set_ylabel('95% CI width (%)', color='white')
ax.set_title('Precision Improves With More Seeds', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Summary
ax = axes[1, 2]
ax.axis('off')
text = "Statistical Analysis Summary\\n" + "=" * 30 + "\\n\\n"
text += f"n = {n_seeds} seeds/group, {storage_weeks} weeks\\n"
text += f"Bonferroni threshold: p < {bonferroni_threshold:.4f}\\n\\n"
text += f"{'Treatment':<14} {'Rate':>6} {'95% CI':>14}\\n"
text += "-" * 36 + "\\n"
for name in t_names:
    r = results[name]
    text += (f"{name:<14} {r['rate']*100:>5.0f}% "
             f"[{r['ci_low']*100:>4.0f}-{r['ci_high']*100:>4.0f}%]\\n")
text += f"\\nSignificant differences: {len(sig_pairs)}\\n"
text += f"Non-significant: {len(nonsig_pairs)}\\n\\n"
text += "Cold dry storage is significantly\\n"
text += "better than warm moist storage."
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Statistical analysis complete.")
print(f"Significant pairwise differences: {len(sig_pairs)} of {len(pairwise)}")
print(f"Bonferroni correction: p < {bonferroni_threshold:.4f}")
for pw in sig_pairs:
    print(f"  {pw['pair']}: diff = {pw['rate_diff']:.1f}%, p = {pw['p_value']:.4f}")`,
      challenge: 'Run the analysis with 20 seeds per group instead of 100. How many significant differences do you lose? Calculate the minimum sample size needed to detect a 10% difference between any two groups with 80% power.',
      successHint: 'Statistics separates signal from noise. With 100 seeds per group, we can detect real differences of 10-15%. The Bonferroni correction prevents false discoveries when making multiple comparisons. This is how professional seed scientists determine storage protocols: not by looking at numbers, but by testing significance.',
    },
    {
      title: 'Germination Rate Calculations and Comparisons',
      concept: `With statistical significance established, we now dig deeper into the **quantitative relationships** between storage conditions and germination. The goal is not just to say "frozen is better than room temperature" but to quantify exactly how much better, and to build a predictive model that can extrapolate to conditions we did not test.

The **germination rate** is a simple proportion: seeds germinated divided by total seeds. But there are important nuances. **Speed of germination** matters too, not just final percentage. A seed that takes 3 days to germinate is more vigorous than one that takes 14 days. We can compute a **germination index** (GI) that weights early germination more heavily: GI = sum of (seeds germinated on day i) * (total days - day i). Higher GI means faster, more vigorous germination.

The **temperature coefficient** Q10 describes how much faster deterioration occurs with each 10-degree temperature increase. For most seeds, Q10 is between 2 and 4, meaning that raising temperature by 10 degrees C doubles to quadruples the deterioration rate. This is why refrigeration is so effective: dropping from 25 degrees C to 5 degrees C slows deterioration by roughly 4-16x.

The **moisture equilibrium** determines a seed's internal moisture content based on ambient humidity and temperature. The Brunauer-Emmett-Teller (BET) isotherm model predicts this relationship. At 30% relative humidity and 20 degrees C, most crop seeds equilibrate to about 6-8% moisture content, which is the sweet spot for long-term storage (dry enough to prevent fungal growth, moist enough not to crack the seed coat).`,
      analogy: 'Germination analysis is like analyzing student test scores. The average score tells you overall performance, but the distribution matters too: did everyone score 80% (consistent) or did half score 100% and half score 60% (bimodal)? The germination index is like weighting homework turned in early more than homework turned in late. The temperature coefficient is like the effect of sleep on test performance: quantifiable, predictable, and actionable.',
      storyConnection: 'Apfu Azuo kept her seeds in bamboo tubes and clay pots, which naturally regulate humidity to around 8-10%. She stored them in the coolest, driest part of her house, away from sunlight. Without knowing the Q10 coefficient or the BET isotherm, she followed the same principles: keep it cool, keep it dry, keep it dark. Our quantitative analysis explains why her traditional methods worked so well.',
      checkQuestion: 'If a seed deteriorates twice as fast for every 10 degrees C increase (Q10 = 2), and it lasts 50 years at 5 degrees C, how long would it last at 25 degrees C? At -15 degrees C?',
      checkAnswer: 'From 5 to 25 degrees C is a 20-degree increase = 2 doublings of deterioration rate = 4x faster deterioration. So the seed lasts 50/4 = 12.5 years at 25 degrees C. From 5 to -15 degrees C is a 20-degree decrease = 2 halvings = 4x slower. So the seed lasts 50 * 4 = 200 years at -15 degrees C. This is why the Svalbard vault operates at -18 degrees C: seeds last centuries.',
      codeIntro: 'Compute detailed germination metrics, temperature coefficients, and moisture equilibrium curves.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from math import erf, sqrt

np.random.seed(42)

def normal_cdf(x):
    return 0.5 * (1 + np.vectorize(erf)(x / sqrt(2)))

class SeedModel:
    def __init__(self, KE, Cw, Ch, Cq, Ki=2.0):
        self.KE = KE; self.Cw = Cw; self.Ch = Ch; self.Cq = Cq; self.Ki = Ki
    def predict(self, weeks, temp, moisture):
        years = weeks / 52.0
        log_s = self.KE - self.Cw * np.log10(max(moisture, 1)) - self.Ch * temp - self.Cq * temp**2
        sigma = 10**np.clip(log_s, -2, 10)
        return float(np.clip(normal_cdf(self.Ki - years / max(sigma, 0.001)), 0, 1))
    def time_to_threshold(self, temp, moisture, threshold=0.85):
        """Weeks until viability drops to threshold."""
        from math import log10
        log_s = self.KE - self.Cw * log10(max(moisture, 1)) - self.Ch * temp - self.Cq * temp**2
        sigma_years = 10**np.clip(log_s, -2, 10)
        v_thresh = float(np.vectorize(lambda p: np.sign(2*p-1) * np.sqrt(
            np.sqrt((2/(np.pi*0.147)+np.log(1-(2*p-1)**2)/2)**2 -
            np.log(1-(2*p-1)**2)/0.147) -
            (2/(np.pi*0.147)+np.log(1-(2*p-1)**2)/2)) * np.sqrt(2))(
            np.clip(threshold, 0.01, 0.99)))
        time_years = (self.Ki - v_thresh) * sigma_years
        return max(0, time_years * 52)

mustard = SeedModel(7.0, 3.5, 0.045, 0.000180)

# --- Simulate germination timing (days to germinate) ---
def simulate_germination_timing(base_prob, n_seeds=50, max_days=21):
    """Simulate when each seed germinates (if at all)."""
    germ_days = []
    for _ in range(n_seeds):
        if np.random.random() < base_prob:
            # Germination day: earlier seeds are more vigorous
            day = max(1, int(np.random.exponential(3) + 2))
            day = min(day, max_days)
            germ_days.append(day)
        else:
            germ_days.append(0)  # did not germinate
    return np.array(germ_days)

treatments = {
    'Room Dry':     {'temp': 25, 'moisture': 6,  'light': False},
    'Room Moist':   {'temp': 25, 'moisture': 14, 'light': False},
    'Refrigerated': {'temp': 5,  'moisture': 6,  'light': False},
    'Frozen':       {'temp': -18, 'moisture': 5, 'light': False},
    'Sunlight':     {'temp': 30, 'moisture': 8,  'light': True},
}

# Generate timing data for 4-week storage
storage_weeks = 4
timing_data = {}
for name, cond in treatments.items():
    p = mustard.predict(storage_weeks, cond['temp'], cond['moisture'])
    if cond['light']:
        p *= np.exp(-0.002 * storage_weeks)
    timing = simulate_germination_timing(p, n_seeds=50)
    germinated = timing > 0
    timing_data[name] = {
        'timing': timing,
        'n_germ': int(germinated.sum()),
        'n_total': 50,
        'rate': germinated.sum() / 50,
        'mean_days': timing[germinated].mean() if germinated.any() else 0,
        'germ_index': sum((21 - d) for d in timing if d > 0),
    }

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Germination Analysis: Rates, Timing, and Environmental Effects',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors = ['#22c55e', '#ef4444', '#3b82f6', '#a855f7', '#f59e0b']
t_names = list(treatments.keys())

# Plot 1: Cumulative germination curves
ax = axes[0, 0]
for i, name in enumerate(t_names):
    timing = timing_data[name]['timing']
    germ_days = timing[timing > 0]
    if len(germ_days) == 0:
        continue
    days = np.arange(1, 22)
    cumulative = [np.sum(germ_days <= d) / 50 * 100 for d in days]
    ax.plot(days, cumulative, color=colors[i], linewidth=2, label=name)
ax.set_xlabel('Days after planting', color='white')
ax.set_ylabel('Cumulative germination (%)', color='white')
ax.set_title('Germination Curves', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Germination index (speed + rate combined)
ax = axes[0, 1]
gi_values = [timing_data[n]['germ_index'] for n in t_names]
bars = ax.bar(t_names, gi_values, color=colors, edgecolor='none')
for bar, gi in zip(bars, gi_values):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
            f'{gi}', ha='center', color='white', fontsize=10)
ax.set_ylabel('Germination Index', color='white')
ax.set_title('Germination Index (higher = better)', color='white', fontsize=11)
ax.set_xticklabels(t_names, rotation=20, fontsize=8, color='white')

# Plot 3: Q10 temperature coefficient
ax = axes[0, 2]
temps = np.linspace(-20, 40, 100)
shelf_life_weeks = [mustard.time_to_threshold(t, 6, 0.85) for t in temps]
shelf_life_years = [w / 52 for w in shelf_life_weeks]
ax.semilogy(temps, shelf_life_years, color='#3b82f6', linewidth=2)
# Mark key temperatures
for t, label, color in [(25, 'Room', '#ef4444'), (5, 'Fridge', '#22c55e'),
                         (-18, 'Freezer', '#a855f7')]:
    sl = mustard.time_to_threshold(t, 6, 0.85) / 52
    ax.plot(t, sl, 'o', color=color, markersize=12, markeredgecolor='white')
    ax.annotate(f'{label}: {sl:.1f} yr', (t, sl), textcoords="offset points",
                xytext=(15, 5), color=color, fontsize=9)
ax.set_xlabel('Storage temperature (C)', color='white')
ax.set_ylabel('Years to 85% viability (log scale)', color='white')
ax.set_title('Temperature vs Shelf Life', color='white', fontsize=11)
ax.grid(True, alpha=0.15, color='gray')

# Plot 4: Moisture effect on shelf life
ax = axes[1, 0]
moistures = np.linspace(3, 18, 100)
for temp, color, label in [(-18, '#a855f7', '-18C'), (5, '#22c55e', '5C'),
                            (25, '#ef4444', '25C')]:
    sl = [mustard.time_to_threshold(temp, m, 0.85) / 52 for m in moistures]
    ax.semilogy(moistures, sl, color=color, linewidth=2, label=label)
ax.set_xlabel('Seed moisture content (%)', color='white')
ax.set_ylabel('Years to 85% (log scale)', color='white')
ax.set_title('Moisture vs Shelf Life', color='white', fontsize=11)
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.grid(True, alpha=0.15, color='gray')

# Plot 5: Contour map — years to 85% viability
ax = axes[1, 1]
t_grid = np.linspace(-20, 40, 80)
m_grid = np.linspace(3, 16, 80)
T, M = np.meshgrid(t_grid, m_grid)
Z = np.zeros_like(T)
for i in range(T.shape[0]):
    for j in range(T.shape[1]):
        Z[i, j] = mustard.time_to_threshold(T[i, j], M[i, j], 0.85) / 52
Z = np.clip(Z, 0, 200)
contour = ax.contourf(T, M, Z, levels=[0, 1, 5, 10, 25, 50, 100, 200],
                      cmap='viridis')
plt.colorbar(contour, ax=ax, label='Years to 85%')
# Mark our treatment conditions
for name, cond in treatments.items():
    ax.plot(cond['temp'], cond['moisture'], 'o', color='white',
            markersize=8, markeredgewidth=2)
    ax.annotate(name, (cond['temp'], cond['moisture']),
                textcoords="offset points", xytext=(5, 5),
                color='white', fontsize=7)
ax.set_xlabel('Temperature (C)', color='white')
ax.set_ylabel('Moisture (%)', color='white')
ax.set_title('Viability Landscape', color='white', fontsize=11)

# Plot 6: Summary table
ax = axes[1, 2]
ax.axis('off')
text = "Germination Metrics\\n" + "=" * 35 + "\\n\\n"
text += f"{'Treatment':<14} {'Rate':>6} {'Days':>6} {'GI':>6}\\n"
text += "-" * 36 + "\\n"
for name in t_names:
    d = timing_data[name]
    text += (f"{name:<14} {d['rate']*100:>5.0f}% "
             f"{d['mean_days']:>5.1f}d {d['germ_index']:>5}\\n")

# Q10 estimate
sl_25 = mustard.time_to_threshold(25, 6, 0.85) / 52
sl_15 = mustard.time_to_threshold(15, 6, 0.85) / 52
q10 = sl_15 / sl_25
text += f"\\nQ10 estimate: {q10:.1f}\\n"
text += f"  (each 10C drop = {q10:.1f}x\\n"
text += f"   longer shelf life)\\n\\n"
text += "Key findings:\\n"
text += f"  Frozen:   {mustard.time_to_threshold(-18, 5, 0.85)/52:.0f} years\\n"
text += f"  Fridge:   {mustard.time_to_threshold(5, 6, 0.85)/52:.0f} years\\n"
text += f"  Room dry: {mustard.time_to_threshold(25, 6, 0.85)/52:.1f} years"
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Germination analysis complete.")
print(f"Q10 = {q10:.1f}: dropping temperature by 10C extends shelf life by {q10:.1f}x")
print(f"Frozen storage: {mustard.time_to_threshold(-18, 5, 0.85)/52:.0f} years to 85%")
print(f"Room temperature: {mustard.time_to_threshold(25, 6, 0.85)/52:.1f} years to 85%")
print("Next: build the full experiment report.")`,
      challenge: 'Compare three species: mustard (KE=7.0), rice (KE=9.0, Cw=4.5, Ch=0.040, Cq=0.000150), and onion (KE=5.5, Cw=3.0, Ch=0.060, Cq=0.000250). Which species is most sensitive to temperature? Which to moisture? Plot the contour maps side by side.',
      successHint: 'The Q10 coefficient quantifies what seed keepers have always known: cold storage is critical. Every 10 degrees matters. The contour map reveals the full temperature-moisture landscape, showing exactly why gene banks operate at -18 degrees C and 5% moisture. This is the quantitative foundation of seed conservation.',
    },
    {
      title: 'Discussion and Conclusions: Why Cold Dry Storage Wins',
      concept: `The discussion section of a scientific report explains **why** the results came out as they did and connects the observations to underlying mechanisms. Our experiment shows that frozen dry storage produces the highest germination rate and index. But why?

The answer lies in **seed biochemistry**. Seeds are alive but dormant. Their cells still contain enzymes, lipids, and DNA, all of which slowly degrade through chemical reactions. The **Arrhenius equation** governs reaction rates: k = A * exp(-Ea / RT), where k is the reaction rate, Ea is the activation energy, R is the gas constant, and T is temperature in Kelvin. Lower temperature means exponentially slower reactions. This is why frozen seeds deteriorate orders of magnitude slower than room-temperature seeds.

Moisture plays a dual role. High moisture enables **fungal growth** (fungi need water to metabolize) and activates **hydrolytic enzymes** inside the seed that break down stored starches and proteins. Below about 8% moisture, most fungi cannot grow and enzymatic activity is minimal. But moisture that is too low (below 3%) can crack the seed coat through desiccation stress. The optimum for most crop seeds is 4-7% moisture content.

Light damage occurs through **UV-induced DNA degradation** and **photo-oxidation** of lipids in the seed membrane. Even ambient room light contains enough UV to cause measurable damage over months. This is why Apfu Azuo stored her seeds in opaque containers, and why modern gene banks use lightproof packaging.

The practical conclusion is clear: seeds should be stored cold, dry, and dark. The Svalbard Global Seed Vault (-18 degrees C, 5% moisture, total darkness, inside a mountain) represents the extreme of this principle. Our experiment quantifies why each factor matters and by how much.`,
      analogy: 'Understanding why cold dry storage works is like understanding why you refrigerate food. You do not just know "cold = good." You understand that bacteria multiply slower at low temperatures (Arrhenius), moisture enables mold growth (water activity), and light oxidizes fats (photo-oxidation). Each mechanism is independent, and the protection is multiplicative: cold AND dry AND dark is far better than any single factor alone.',
      storyConnection: 'Apfu Azuo stored seeds in the coolest room of her house, in sealed bamboo tubes (dark, moderately dry), away from the kitchen fire (no heat). She achieved roughly "room dry" conditions, which our data shows preserves mustard seeds for about 2 years. If she had access to a refrigerator, she could extend that to decades. If Nagaland built a community seed vault at -18 degrees C, the varieties she preserved could last centuries. Our analysis bridges her traditional practice to modern conservation science.',
      checkQuestion: 'The Arrhenius equation says reaction rate drops exponentially with temperature. But our Q10 coefficient was finite (around 2-4). If the relationship is truly exponential, why is Q10 constant rather than increasing as temperature drops?',
      checkAnswer: 'Q10 is approximately constant over moderate temperature ranges because the exponential Arrhenius curve looks roughly like a constant-ratio decay over a 10-degree window. Technically, Q10 does change slightly at different temperatures (it is higher at low temperatures for many seed deterioration reactions). At very low temperatures, ice crystal formation introduces a different damage mechanism, so the simple Arrhenius model breaks down. This is why ultra-cold storage below -80 degrees C does not provide proportionally more benefit.',
      codeIntro: 'Build the discussion analysis: connect observed results to biochemical mechanisms and generate storage recommendations.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from math import erf, sqrt

np.random.seed(42)

def normal_cdf(x):
    return 0.5 * (1 + np.vectorize(erf)(x / sqrt(2)))

class SeedModel:
    def __init__(self, KE, Cw, Ch, Cq, Ki=2.0):
        self.KE = KE; self.Cw = Cw; self.Ch = Ch; self.Cq = Cq; self.Ki = Ki
    def predict(self, weeks, temp, moisture):
        years = weeks / 52.0
        log_s = self.KE - self.Cw * np.log10(max(moisture, 1)) - self.Ch * temp - self.Cq * temp**2
        sigma = 10**np.clip(log_s, -2, 10)
        return float(np.clip(normal_cdf(self.Ki - years / max(sigma, 0.001)), 0, 1))

mustard = SeedModel(7.0, 3.5, 0.045, 0.000180)

# --- Arrhenius-based deterioration rate ---
def arrhenius_rate(temp_c, Ea=75000, A=1e12):
    """Relative deterioration rate from Arrhenius equation."""
    R = 8.314  # gas constant J/(mol*K)
    T = temp_c + 273.15
    return A * np.exp(-Ea / (R * T))

# --- Fungal growth risk ---
def fungal_risk(moisture_pct, temp_c):
    """Probability of fungal growth based on moisture and temperature."""
    # Fungi need moisture > ~65% water activity (roughly 13% seed MC)
    # and temperature > 5C
    if moisture_pct < 8:
        return 0.01
    elif moisture_pct < 13:
        moisture_factor = (moisture_pct - 8) / 5 * 0.5
    else:
        moisture_factor = 0.5 + (moisture_pct - 13) / 5 * 0.5
    temp_factor = max(0, min(1, (temp_c - 5) / 25))
    return np.clip(moisture_factor * temp_factor, 0, 1)

fig, axes = plt.subplots(2, 3, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Discussion: Why Cold Dry Storage Wins',
             color='white', fontsize=14, fontweight='bold')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Arrhenius deterioration curve
ax = axes[0, 0]
temps = np.linspace(-20, 45, 200)
rates = [arrhenius_rate(t) for t in temps]
rates_norm = [r / arrhenius_rate(25) for r in rates]  # normalize to room temp
ax.semilogy(temps, rates_norm, color='#ef4444', linewidth=2)
for t, label, color in [(-18, 'Svalbard', '#a855f7'), (5, 'Fridge', '#22c55e'),
                          (25, 'Room', '#f59e0b'), (40, 'Hot', '#ef4444')]:
    r = arrhenius_rate(t) / arrhenius_rate(25)
    ax.plot(t, r, 'o', color=color, markersize=12, markeredgecolor='white')
    ax.annotate(f'{label}\\n{r:.3f}x', (t, r), textcoords="offset points",
                xytext=(12, 0), color=color, fontsize=9)
ax.set_xlabel('Temperature (C)', color='white')
ax.set_ylabel('Relative deterioration rate (log)', color='white')
ax.set_title('Arrhenius: Chemical Reaction Speed', color='white', fontsize=11)
ax.grid(True, alpha=0.15, color='gray')

# Plot 2: Fungal risk map
ax = axes[0, 1]
m_range = np.linspace(3, 18, 80)
t_range = np.linspace(-5, 40, 80)
Tm, Mm = np.meshgrid(t_range, m_range)
F = np.vectorize(fungal_risk)(Mm, Tm)
contour = ax.contourf(Tm, Mm, F, levels=10, cmap='YlOrRd')
plt.colorbar(contour, ax=ax, label='Fungal growth risk')
ax.axhline(8, color='white', linestyle='--', alpha=0.5, label='Safe moisture limit')
ax.axvline(5, color='white', linestyle=':', alpha=0.5, label='Safe temp limit')
ax.set_xlabel('Temperature (C)', color='white')
ax.set_ylabel('Moisture content (%)', color='white')
ax.set_title('Fungal Growth Risk', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Three damage mechanisms over time
ax = axes[0, 2]
weeks = np.arange(0, 53)
# At room temp, moist (worst case)
enzymatic = 1 - np.exp(-0.01 * weeks)  # hydrolytic damage
fungal_dam = 1 - np.exp(-0.008 * weeks)  # fungal damage
oxidative = 1 - np.exp(-0.003 * weeks)  # photo-oxidation
total = 1 - (1 - enzymatic) * (1 - fungal_dam) * (1 - oxidative)
ax.plot(weeks, enzymatic * 100, color='#ef4444', linewidth=2, label='Enzymatic')
ax.plot(weeks, fungal_dam * 100, color='#22c55e', linewidth=2, label='Fungal')
ax.plot(weeks, oxidative * 100, color='#3b82f6', linewidth=2, label='Photo-oxidation')
ax.plot(weeks, total * 100, color='white', linewidth=2, linestyle='--', label='Combined')
ax.set_xlabel('Weeks (Room temp, moist, light)', color='white')
ax.set_ylabel('Cumulative damage (%)', color='white')
ax.set_title('Three Damage Mechanisms', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Protection factor by condition
ax = axes[1, 0]
conditions = [
    ('Room, moist, light', 25, 14, True),
    ('Room, dry, dark', 25, 6, False),
    ('Cool, dry, dark', 5, 6, False),
    ('Frozen, dry, dark', -18, 5, False),
]
base_rate = arrhenius_rate(25) * (1 + fungal_risk(14, 25)) * 1.1  # worst case baseline
protection_factors = []
for label, temp, moist, light in conditions:
    rate = arrhenius_rate(temp) * (1 + fungal_risk(moist, temp))
    if light:
        rate *= 1.1
    pf = base_rate / max(rate, 1e-10)
    protection_factors.append(min(pf, 1000))

bars = ax.barh([c[0] for c in conditions], protection_factors,
               color=['#ef4444', '#f59e0b', '#22c55e', '#a855f7'], edgecolor='none')
for bar, pf in zip(bars, protection_factors):
    ax.text(bar.get_width() + max(protection_factors)*0.02,
            bar.get_y() + bar.get_height()/2,
            f'{pf:.0f}x', va='center', color='white', fontsize=11)
ax.set_xlabel('Protection factor (vs worst case)', color='white')
ax.set_title('Cumulative Protection', color='white', fontsize=11)

# Plot 5: Global seed bank conditions comparison
ax = axes[1, 1]
seed_banks = [
    ('Apfu Azuo\\n(bamboo tube)', 22, 9, 2),
    ('Village fridge', 5, 8, 12),
    ('National Gene Bank\\n(India, NBPGR)', 5, 5, 45),
    ('Svalbard Vault\\n(Norway)', -18, 5, 500),
    ('Cryo storage\\n(-196C, liquid N)', -196, 0, 10000),
]
sb_names = [s[0] for s in seed_banks]
sb_years = [s[3] for s in seed_banks]
sb_colors = ['#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
bars = ax.barh(sb_names, sb_years, color=sb_colors, edgecolor='none')
ax.set_xscale('log')
for bar, yr in zip(bars, sb_years):
    label = f'{yr} yr' if yr < 1000 else f'{yr/1000:.0f}k yr'
    ax.text(bar.get_width() * 1.2, bar.get_y() + bar.get_height()/2,
            label, va='center', color='white', fontsize=10)
ax.set_xlabel('Estimated shelf life (years, log scale)', color='white')
ax.set_title('Seed Storage: Traditional to Modern', color='white', fontsize=10)

# Plot 6: Conclusions
ax = axes[1, 2]
ax.axis('off')
text = "EXPERIMENTAL CONCLUSIONS\\n"
text += "=" * 30 + "\\n\\n"
text += "1. Temperature is the dominant\\n"
text += "   factor (Arrhenius: exponential\\n"
text += "   effect on reaction rates).\\n\\n"
text += "2. Moisture enables fungal growth\\n"
text += "   above ~13% seed moisture and\\n"
text += "   activates hydrolytic enzymes.\\n\\n"
text += "3. Light causes DNA damage and\\n"
text += "   lipid oxidation (smaller effect\\n"
text += "   but cumulative over months).\\n\\n"
text += "4. Protection is MULTIPLICATIVE:\\n"
text += "   cold AND dry AND dark together\\n"
text += "   provide 100-1000x improvement.\\n\\n"
text += "Apfu Azuo's bamboo tubes: ~2 years.\\n"
text += "Svalbard vault: ~500 years.\\n"
text += "Same principle, better execution."
ax.text(0.05, 0.95, text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', color='white', fontfamily='monospace')

plt.tight_layout()
plt.show()

print("Discussion analysis complete.")
print("Three independent mechanisms degrade seeds:")
print("  1. Enzymatic hydrolysis (temperature-dependent)")
print("  2. Fungal attack (moisture + temperature)")
print("  3. Photo-oxidation (light)")
print("Protection is multiplicative: cold * dry * dark >> any single factor.")
print("Next: assemble everything into the final experiment report.")`,
      challenge: 'Model the effect of periodic temperature fluctuations (e.g., power failure in a gene bank: temperature rises from -18 to 5 degrees C for 48 hours, then drops back). How many such events per year can a seed bank tolerate before viability drops below 85% in 50 years?',
      successHint: 'The discussion connects the dots: temperature affects reaction kinetics (Arrhenius), moisture enables biological attack (fungi), and light causes direct damage (photo-oxidation). Each mechanism is independent, so protection compounds multiplicatively. This is why Svalbard stores seeds 250x longer than Apfu Azuo: not because it is 250x colder, but because it optimizes three factors simultaneously.',
    },
    {
      title: 'Complete Experiment Report: From Hypothesis to Recommendations',
      concept: `The final lesson assembles everything into a complete **experiment report dashboard** in the format used by published seed science papers. The report has five standard sections: Abstract (summary of findings), Methods (experimental design), Results (germination data with statistics), Discussion (mechanistic explanation), and Recommendations (practical storage advice).

The dashboard serves two audiences. A **seed bank manager** needs actionable recommendations: which storage conditions to use, how often to test, when to regenerate. A **researcher** needs the statistical details: sample sizes, confidence intervals, p-values, and effect sizes. The dashboard must satisfy both.

The final deliverable also includes a **storage protocol generator**: given a target shelf life (e.g., "at least 25 years at 85% viability"), the tool recommends specific temperature and moisture conditions with a safety margin. This is the practical output of the entire capstone: a decision-support tool for seed conservation.

Building this report also teaches a meta-lesson: **the scientific method is a pipeline**. Hypothesis leads to experimental design, which generates data, which requires statistical analysis, which supports or refutes the hypothesis, which leads to practical recommendations. Every step depends on the ones before it. Skip any step and the conclusions are unreliable. Our capstone has built every step of this pipeline as working code.`,
      analogy: 'The final report is like the instruction manual that comes with a product. The customer (seed bank manager) does not need to understand the engineering (Ellis-Roberts equations, chi-squared tests). They need clear instructions: store at this temperature, this moisture, test every N years. But the manual also includes technical specifications for the engineer who needs to troubleshoot. Our dashboard is both the instruction manual and the engineering document.',
      storyConnection: 'Imagine handing Apfu Azuo a one-page printout from this dashboard: "Your black rice, stored in bamboo at 22 degrees C and 9% moisture, will remain viable for approximately 2 years. To extend to 50 years, store at 5 degrees C and 5% moisture. Test germination every 6 months at current conditions, every 5 years if refrigerated." Her traditional knowledge, quantified, validated, and extended by science. The seeds are stories, and our tool helps those stories last longer.',
      checkQuestion: 'A village in Nagaland wants to build a community seed vault. They have no electricity for freezers but can dig a cellar that stays at 12 degrees C year-round. If seeds are dried to 6% moisture, how long will rice seeds last compared to room temperature storage at 25 degrees C?',
      checkAnswer: 'Using the Ellis-Roberts model with Q10 approximately 3 for the 12-25 degree C range: 13 degrees of cooling gives roughly a 3^1.3 = 4x improvement. If rice lasts about 5 years at room temperature, it would last about 20 years in the cellar. That is a massive improvement for zero electricity cost. The Nagaland cellar vault would be a real-world application of exactly the science we have built.',
      codeIntro: 'Build the complete experiment report dashboard with all five sections and a storage protocol generator.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from math import erf, sqrt

np.random.seed(42)

def normal_cdf(x):
    return 0.5 * (1 + np.vectorize(erf)(x / sqrt(2)))

class SeedModel:
    def __init__(self, species, KE, Cw, Ch, Cq, Ki=2.0):
        self.species = species
        self.KE = KE; self.Cw = Cw; self.Ch = Ch; self.Cq = Cq; self.Ki = Ki
    def predict(self, weeks, temp, moisture):
        years = weeks / 52.0
        log_s = self.KE - self.Cw * np.log10(max(moisture, 1)) - self.Ch * temp - self.Cq * temp**2
        sigma = 10**np.clip(log_s, -2, 10)
        return float(np.clip(normal_cdf(self.Ki - years / max(sigma, 0.001)), 0, 1))
    def shelf_life_years(self, temp, moisture, threshold=0.85):
        log_s = self.KE - self.Cw * np.log10(max(moisture, 1)) - self.Ch * temp - self.Cq * temp**2
        sigma = 10**np.clip(log_s, -2, 10)
        p = np.clip(threshold, 0.01, 0.99)
        a = 8*(np.pi-3)/(3*np.pi*(4-np.pi))
        x = 2*p - 1; ln_t = np.log(1-x**2)
        t1 = 2/(np.pi*a)+ln_t/2
        v_thresh = np.sign(x)*np.sqrt(np.sqrt(t1**2-ln_t/a)-t1)*np.sqrt(2)
        return max(0, (self.Ki - v_thresh) * sigma)

mustard = SeedModel('Mustard', 7.0, 3.5, 0.045, 0.000180)
rice = SeedModel('Rice', 9.0, 4.5, 0.040, 0.000150)
onion = SeedModel('Onion', 5.5, 3.0, 0.060, 0.000250)
species_db = {'Mustard': mustard, 'Rice': rice, 'Onion': onion}

# --- Generate full experiment data ---
treatments = {
    'Room Dry':     {'temp': 25, 'moisture': 6,  'light': False},
    'Room Moist':   {'temp': 25, 'moisture': 14, 'light': False},
    'Refrigerated': {'temp': 5,  'moisture': 6,  'light': False},
    'Frozen':       {'temp': -18, 'moisture': 5, 'light': False},
    'Sunlight':     {'temp': 30, 'moisture': 8,  'light': True},
}

n_seeds = 100
storage_weeks = 4
exp_data = {}
for name, cond in treatments.items():
    p = mustard.predict(storage_weeks, cond['temp'], cond['moisture'])
    if cond['light']:
        p *= np.exp(-0.002 * storage_weeks)
    batch_p = np.clip(p + np.random.normal(0, 0.03), 0.01, 0.99)
    outcomes = np.random.binomial(1, batch_p, n_seeds)
    rate = outcomes.sum() / n_seeds
    # Wilson CI
    z = 1.96; n = n_seeds; p_hat = rate
    denom = 1 + z**2/n
    center = (p_hat + z**2/(2*n)) / denom
    spread = z * np.sqrt(p_hat*(1-p_hat)/n + z**2/(4*n**2)) / denom
    exp_data[name] = {
        'rate': rate, 'n_germ': int(outcomes.sum()),
        'ci_low': max(0, center-spread), 'ci_high': min(1, center+spread),
    }

# --- Storage Protocol Generator ---
def recommend_storage(target_years, species_model, threshold=0.85):
    """Find cheapest storage conditions for target shelf life."""
    options = [
        ('Bamboo tube (traditional)', 22, 9, '\$0'),
        ('Cool cellar', 12, 7, '\$50/year'),
        ('Refrigerator (5C)', 5, 6, '\$200/year'),
        ('Walk-in cooler (5C)', 5, 5, '\$500/year'),
        ('Freezer (-18C)', -18, 5, '\$800/year'),
        ('Deep freeze (-30C)', -30, 4, '\$2000/year'),
    ]
    recommendations = []
    for label, temp, moist, cost in options:
        sl = species_model.shelf_life_years(temp, moist, threshold)
        meets = sl >= target_years
        recommendations.append({
            'method': label, 'temp': temp, 'moisture': moist,
            'cost': cost, 'shelf_life': sl, 'meets_target': meets,
        })
    return recommendations

# ---- FINAL DASHBOARD ----
fig = plt.figure(figsize=(18, 11))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('SEED GERMINATION EXPERIMENT — COMPLETE REPORT',
             color='white', fontsize=16, fontweight='bold', y=0.98)

# Panel 1: Results — germination rates with CIs
ax1 = fig.add_axes([0.04, 0.55, 0.28, 0.36])
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
t_names = list(treatments.keys())
colors = ['#22c55e', '#ef4444', '#3b82f6', '#a855f7', '#f59e0b']
rates = [exp_data[n]['rate'] * 100 for n in t_names]
ci_lo = [exp_data[n]['ci_low'] * 100 for n in t_names]
ci_hi = [exp_data[n]['ci_high'] * 100 for n in t_names]
yerr_lo = [r - lo for r, lo in zip(rates, ci_lo)]
yerr_hi = [hi - r for r, hi in zip(rates, ci_hi)]
bars = ax1.bar(range(len(t_names)), rates, color=colors, edgecolor='none', alpha=0.8)
ax1.errorbar(range(len(t_names)), rates, yerr=[yerr_lo, yerr_hi],
             fmt='none', ecolor='white', capsize=6, capthick=2)
ax1.set_xticks(range(len(t_names)))
ax1.set_xticklabels(t_names, color='white', fontsize=8, rotation=25)
ax1.set_ylabel('Germination (%)', color='white', fontsize=10)
ax1.set_title('Results: Germination Rates (4 weeks)', color='white', fontsize=11)
for i, (r, lo, hi) in enumerate(zip(rates, ci_lo, ci_hi)):
    ax1.text(i, hi + 2, f'{r:.0f}%', ha='center', color='white', fontsize=10, fontweight='bold')

# Panel 2: Multi-species shelf life comparison
ax2 = fig.add_axes([0.37, 0.55, 0.28, 0.36])
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
storage_options = [('Room 25C', 25, 6), ('Fridge 5C', 5, 5), ('Frozen -18C', -18, 5)]
x_pos = np.arange(len(storage_options))
width = 0.25
sp_colors = ['#22c55e', '#3b82f6', '#a855f7']
for si, (sp_name, model) in enumerate(species_db.items()):
    sl_values = [model.shelf_life_years(t, m) for _, t, m in storage_options]
    ax2.bar(x_pos + si * width - width, sl_values, width,
            color=sp_colors[si], label=sp_name, edgecolor='none')
    for xi, sl in zip(x_pos + si * width - width, sl_values):
        label = f'{sl:.0f}y' if sl < 100 else f'{sl:.0f}y'
        ax2.text(xi, sl + max(sl_values)*0.02, label, ha='center',
                 color='white', fontsize=7)
ax2.set_xticks(x_pos)
ax2.set_xticklabels([s[0] for s in storage_options], color='white', fontsize=9)
ax2.set_ylabel('Years to 85% viability', color='white', fontsize=10)
ax2.set_title('Species Comparison: Shelf Life', color='white', fontsize=11)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 3: Storage protocol recommendations
ax3 = fig.add_axes([0.70, 0.55, 0.27, 0.36])
ax3.set_facecolor('#111827')
ax3.axis('off')
recs = recommend_storage(25, rice)
text = "STORAGE PROTOCOL GENERATOR\\n"
text += "Target: Rice, 25 years at 85%\\n"
text += "=" * 35 + "\\n\\n"
text += f"{'Method':<24} {'Life':>6} {'OK?':>4}\\n"
text += "-" * 35 + "\\n"
for r in recs:
    check = 'YES' if r['meets_target'] else 'no'
    sl_label = f"{r['shelf_life']:.0f}y"
    text += f"{r['method']:<24} {sl_label:>5} {check:>4}\\n"
text += "\\nRecommendation: Refrigerator\\n"
text += "(cheapest that meets target)"
ax3.text(0.02, 0.95, text, transform=ax3.transAxes, fontsize=9,
         verticalalignment='top', color='white', fontfamily='monospace')

# Panel 4: Viability decay curves
ax4 = fig.add_axes([0.04, 0.08, 0.28, 0.36])
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
years = np.linspace(0, 100, 500)
for i, (name, cond) in enumerate(treatments.items()):
    viab = [mustard.predict(y * 52, cond['temp'], cond['moisture']) * 100 for y in years]
    ax4.plot(years, viab, color=colors[i], linewidth=2, label=name)
ax4.axhline(85, color='gray', linestyle=':', alpha=0.5, label='85% threshold')
ax4.set_xlabel('Years', color='white', fontsize=10)
ax4.set_ylabel('Germination (%)', color='white', fontsize=10)
ax4.set_title('Long-term Viability Projections', color='white', fontsize=11)
ax4.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.set_xlim(0, 50)

# Panel 5: Test schedule
ax5 = fig.add_axes([0.37, 0.08, 0.28, 0.36])
ax5.set_facecolor('#111827')
ax5.tick_params(colors='gray')
scenarios = [
    ('Traditional (22C)', 22, 9),
    ('Cool cellar (12C)', 12, 7),
    ('Refrigerator (5C)', 5, 6),
    ('Freezer (-18C)', -18, 5),
]
for si, (label, temp, moist) in enumerate(scenarios):
    test_years = []
    current_viab = 1.0
    year = 0
    while current_viab > 0.85 and year < 200:
        sl = mustard.shelf_life_years(temp, moist)
        interval = max(0.5, sl / 5)  # test 5 times before expected threshold
        year += interval
        current_viab = mustard.predict(year * 52, temp, moist)
        test_years.append(year)
    test_years = test_years[:8]  # limit display
    ax5.scatter(test_years, [si] * len(test_years), s=60,
                c=sp_colors[si % len(sp_colors)], edgecolors='white', zorder=5)
    ax5.plot([0, max(test_years) if test_years else 1], [si, si],
             color='gray', linewidth=1, alpha=0.3)
    ax5.text(-1, si, label, ha='right', va='center', color='white', fontsize=9)
ax5.set_xlabel('Year of germination test', color='white')
ax5.set_title('Recommended Test Schedule', color='white', fontsize=11)
ax5.set_yticks([])
ax5.set_xlim(-0.5, None)

# Panel 6: Final conclusions
ax6 = fig.add_axes([0.70, 0.08, 0.27, 0.36])
ax6.set_facecolor('#111827')
ax6.axis('off')
text = "EXPERIMENT CONCLUSIONS\\n"
text += "=" * 32 + "\\n\\n"
best = max(t_names, key=lambda n: exp_data[n]['rate'])
worst = min(t_names, key=lambda n: exp_data[n]['rate'])
text += f"Best: {best} ({exp_data[best]['rate']*100:.0f}%)\\n"
text += f"Worst: {worst} ({exp_data[worst]['rate']*100:.0f}%)\\n\\n"
text += "Key findings:\\n"
text += "  1. Temperature dominates\\n"
text += "     (Arrhenius kinetics)\\n"
text += "  2. Moisture enables fungal\\n"
text += "     attack above 13%\\n"
text += "  3. Light adds cumulative\\n"
text += "     photo-oxidation damage\\n"
text += "  4. Protection compounds:\\n"
text += "     cold x dry x dark\\n\\n"
text += "Apfu Azuo was right:\\n"
text += "  Cool, dark, sealed storage\\n"
text += "  preserves the stories inside\\n"
text += "  every seed. Our science just\\n"
text += "  explains why it works."
ax6.text(0.02, 0.97, text, transform=ax6.transAxes, fontsize=10,
         verticalalignment='top', color='white', fontfamily='monospace')

plt.show()

# --- Final Summary ---
print("=" * 55)
print("SEED GERMINATION EXPERIMENT — CAPSTONE COMPLETE")
print("=" * 55)
print()
print("Pipeline built:")
print("  1. Experiment design (5 treatments x 100 seeds)")
print("  2. Data generation (biological variability model)")
print("  3. Statistical analysis (CIs, chi-squared, Bonferroni)")
print("  4. Germination metrics (rates, timing, GI, Q10)")
print("  5. Mechanistic discussion (Arrhenius, fungi, UV)")
print("  6. Report dashboard (6-panel visualization)")
print()
print("Storage recommendations for mustard seeds:")
for r in recommend_storage(10, mustard):
    status = 'MEETS TARGET' if r['meets_target'] else 'too short'
    print(f"  {r['method']:<24} {r['shelf_life']:>5.0f} yr  {status}")
print()
print("The seed keeper's wisdom, validated by science.")
print("Every seed is a story. Our job is to help those stories last.")`,
      challenge: 'Build a "Nagaland Community Seed Vault" planner: given 30 traditional varieties (each with different Ellis-Roberts parameters), design a storage system using only locally available technology (no electricity). Calculate the optimal cellar depth, estimate temperature from depth, and determine which varieties need the most frequent regeneration testing.',
      successHint: 'You have completed a full capstone: from experimental design to data generation to statistical analysis to mechanistic explanation to practical recommendations. This is the scientific method, end to end, applied to a real conservation problem. Apfu Azuo kept seeds alive with intuition and tradition. You can now do the same with quantitative science, extending her work from years to centuries. The seeds are stories, and you have built the tool to keep them alive.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4 Capstone: Seed Germination Experiment
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (seed science & conservation biology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone uses Python with numpy and matplotlib to simulate and analyze a seed germination experiment. Click to start.</p>
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
