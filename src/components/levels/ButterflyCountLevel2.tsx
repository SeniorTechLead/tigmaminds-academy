import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ButterflyCountLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Frequency distributions — the shape of data',
      concept: `In Level 1, the boy counted butterflies and computed means and medians. Now let's look at the SHAPE of the data. A **frequency distribution** shows how often each value (or range of values) occurs.

Common distribution shapes:
- **Normal (bell curve)**: symmetric, most values near the mean (e.g., human height, measurement errors)
- **Poisson**: count data with a known average rate (e.g., butterflies per day, calls per hour)
- **Skewed right**: long tail to the right (e.g., income, species abundance)
- **Skewed left**: long tail to the left (e.g., exam scores in an easy test)
- **Bimodal**: two peaks (e.g., heights if you mix adults and children)
- **Uniform**: all values equally likely (e.g., a fair die)

The shape tells you about the underlying process:
- Normal → many small independent factors adding up
- Poisson → random events occurring at a constant average rate
- Skewed → a few extreme values dominate
- Bimodal → two distinct groups mixed together`,
      analogy: 'A frequency distribution is like a population pyramid for data. Just as a population pyramid shows how many people are in each age group, a histogram shows how many data points fall in each value range. The shape reveals the story: a normal curve means "most values are average"; a skewed curve means "a few extreme values dominate."',
      storyConnection: 'The boy\'s 30 days of butterfly counts follow a Poisson distribution — events (butterfly sightings) occur randomly at a roughly constant rate. If he plotted his daily counts as a histogram, he\'d see the characteristic Poisson shape: peaked near the mean, with a tail toward higher counts (occasional good days). Recognizing this shape would tell him his garden has a stable butterfly population.',
      checkQuestion: 'A researcher collects species abundance data and plots it. The histogram is extremely right-skewed: many species have 1-5 individuals, a few have 100+. Is this normal?',
      checkAnswer: 'Yes — this is the expected pattern! Species abundance almost always follows a log-normal or similar right-skewed distribution. Most species are rare (few individuals); a few species are very common. This pattern, called the "hollow curve," is one of the most universal patterns in ecology. It was first documented by Fisher in 1943 and holds for everything from tropical insects to deep-sea organisms.',
      codeIntro: 'Explore different distribution shapes and match them to ecological data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate data from different distributions
n = 1000

normal_data = np.random.normal(15, 3, n)       # butterfly wing span (cm)
poisson_data = np.random.poisson(12, n)          # daily butterfly counts
lognormal_data = np.random.lognormal(2, 1, n)    # species abundance
uniform_data = np.random.uniform(5, 25, n)       # random sampling positions
bimodal_data = np.concatenate([np.random.normal(8, 2, n//2), np.random.normal(18, 2, n//2)])

distributions = [
    ('Normal (wing span)', normal_data, '#22c55e', 'Bell-shaped, symmetric'),
    ('Poisson (daily count)', poisson_data, '#3b82f6', 'Count data, slight right skew'),
    ('Log-normal (abundance)', lognormal_data, '#ef4444', 'Strong right skew'),
    ('Uniform (positions)', uniform_data, '#f59e0b', 'Flat, no preferred value'),
    ('Bimodal (2 species)', bimodal_data, '#a855f7', 'Two peaks, two groups'),
]

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

for ax, (name, data, color, desc) in zip(axes.flat, distributions):
    ax.set_facecolor('#111827')
    ax.hist(data, bins=30, color=color, alpha=0.7, edgecolor='none', density=True)

    mean = np.mean(data)
    median = np.median(data)
    ax.axvline(mean, color='white', linestyle='--', linewidth=1.5, label=f'Mean: {mean:.1f}')
    ax.axvline(median, color='#f59e0b', linestyle=':', linewidth=1.5, label=f'Median: {median:.1f}')

    ax.set_title(name, color='white', fontsize=11)
    ax.set_xlabel('Value', color='white')
    ax.text(0.02, 0.95, desc, transform=ax.transAxes, color='gray', fontsize=8, va='top')
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
    ax.tick_params(colors='gray')

# Use last subplot for summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
ax.text(0.05, 0.95, 'Distribution Guide', color='white', fontsize=14, transform=ax.transAxes, fontweight='bold')
guide = [
    ('Normal', 'Measurements, errors', 'mean ≈ median'),
    ('Poisson', 'Counts per time/area', 'mean ≈ variance'),
    ('Log-normal', 'Species abundance', 'mean >> median'),
    ('Uniform', 'No pattern', 'mean = median'),
    ('Bimodal', 'Mixed groups', 'mean between peaks'),
]
for i, (dist, use, prop) in enumerate(guide):
    y = 0.8 - i * 0.15
    ax.text(0.05, y, f'{dist}:', color='white', fontsize=10, transform=ax.transAxes, fontweight='bold')
    ax.text(0.35, y, use, color='gray', fontsize=9, transform=ax.transAxes)
    ax.text(0.35, y - 0.06, prop, color='#f59e0b', fontsize=8, transform=ax.transAxes)

plt.tight_layout()
plt.show()

print("Distribution statistics:")
for name, data, _, _ in distributions:
    skew = np.mean(((data - np.mean(data)) / np.std(data)) ** 3)
    print(f"  {name:30s}: mean={np.mean(data):.1f}, median={np.median(data):.1f}, skew={skew:.2f}")`,
      challenge: 'Collect your own data: roll a die 100 times (or simulate it) and plot the frequency distribution. Is it uniform? What about rolling 2 dice and summing them — what shape appears?',
      successHint: 'Recognizing distribution shapes is one of the most powerful skills in statistics. The shape tells you which tools to use, which summary statistics are meaningful, and what underlying process generated the data. It\'s pattern recognition at the mathematical level.',
    },
    {
      title: 'Standard deviation — measuring spread',
      concept: `Two gardens might have the same average (mean) butterfly count — say, 15 per day. But one garden varies between 13-17 (consistent) while the other swings between 2-28 (chaotic). The mean alone doesn't capture this difference. **Standard deviation (SD)** measures how spread out the data is around the mean.

**Calculation**: SD = sqrt(mean of squared deviations from the mean)

**The 68-95-99.7 rule** (for normal distributions):
- 68% of data falls within ±1 SD of the mean
- 95% falls within ±2 SD
- 99.7% falls within ±3 SD

**Interpretation**:
- Small SD → data points are tightly clustered (reliable, predictable)
- Large SD → data points are widely scattered (variable, unpredictable)
- SD has the SAME UNITS as the data (if counting butterflies, SD is in butterflies)

**Coefficient of variation (CV)**: SD / mean × 100%. Useful for comparing spread between datasets with different means (e.g., comparing variability in butterfly counts vs. wingspan measurements).`,
      analogy: 'Standard deviation is like the "wobble" of an archer\'s aim. Two archers both hit the bullseye on average (same mean). But Archer A\'s arrows cluster in a tight group (small SD — precise), while Archer B\'s arrows scatter all over (large SD — imprecise). The SD tells you how much you should trust the mean as a predictor of the next shot.',
      storyConnection: 'The boy\'s garden had consistent butterfly counts (SD ≈ 3). His friend\'s garden near a road had wildly varying counts (SD ≈ 8) because traffic disrupted the butterflies unpredictably. Both gardens averaged 15 butterflies/day, but the SD revealed that the boy\'s garden was a more reliable habitat. SD turned "the same average" into different ecological stories.',
      checkQuestion: 'Garden A: mean=15, SD=2. Garden B: mean=15, SD=8. Both report "an average of 15 butterflies." Which garden would you choose for a reliable butterfly-watching experience?',
      checkAnswer: 'Garden A. With SD=2, you can expect 13-17 butterflies on 68% of days. In Garden B (SD=8), the range is 7-23 — much less predictable. You might visit Garden B and see 5 butterflies. The mean is identical, but the experience is completely different. SD is the difference between a reliable restaurant and one that\'s sometimes amazing and sometimes terrible.',
      codeIntro: 'Visualize standard deviation and the 68-95-99.7 rule with butterfly data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Two gardens: same mean, different SD
n_days = 365
mean_count = 15

garden_a = np.random.normal(mean_count, 2, n_days)  # low variability
garden_b = np.random.normal(mean_count, 8, n_days)  # high variability
garden_a = np.maximum(garden_a, 0).astype(int)
garden_b = np.maximum(garden_b, 0).astype(int)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Time series comparison
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
days = np.arange(1, 31)
ax1.plot(days, garden_a[:30], 'o-', color='#22c55e', linewidth=1.5, markersize=4, label=f'Garden A (SD={np.std(garden_a):.1f})')
ax1.plot(days, garden_b[:30], 's-', color='#ef4444', linewidth=1.5, markersize=4, label=f'Garden B (SD={np.std(garden_b):.1f})')
ax1.axhline(mean_count, color='white', linestyle='--', alpha=0.3)
ax1.set_xlabel('Day', color='white')
ax1.set_ylabel('Butterfly count', color='white')
ax1.set_title('Same Mean, Different Spread (first 30 days)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Histograms
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
bins = np.arange(0, 35, 1)
ax2.hist(garden_a, bins=bins, color='#22c55e', alpha=0.5, label='Garden A', density=True)
ax2.hist(garden_b, bins=bins, color='#ef4444', alpha=0.5, label='Garden B', density=True)
ax2.axvline(mean_count, color='white', linestyle='--', alpha=0.5)
ax2.set_xlabel('Daily count', color='white')
ax2.set_ylabel('Density', color='white')
ax2.set_title('Distribution Comparison', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# 68-95-99.7 rule visualization
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
x = np.linspace(mean_count - 4*2, mean_count + 4*2, 200)
y = 1/(2*np.sqrt(np.pi)) * np.exp(-0.5*((x-mean_count)/2)**2)

ax3.plot(x, y, color='white', linewidth=2)

# Fill regions
for n_sd, color, alpha, pct in [(1, '#22c55e', 0.4, '68%'), (2, '#3b82f6', 0.25, '95%'), (3, '#f59e0b', 0.15, '99.7%')]:
    x_fill = np.linspace(mean_count - n_sd*2, mean_count + n_sd*2, 100)
    y_fill = 1/(2*np.sqrt(np.pi)) * np.exp(-0.5*((x_fill-mean_count)/2)**2)
    ax3.fill_between(x_fill, y_fill, alpha=alpha, color=color, label=f'±{n_sd}SD = {pct}')

ax3.set_xlabel('Butterfly count', color='white')
ax3.set_ylabel('Probability density', color='white')
ax3.set_title('The 68-95-99.7 Rule (SD=2)', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Coefficient of variation comparison
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
datasets = {
    'Garden A (count)': (np.mean(garden_a), np.std(garden_a)),
    'Garden B (count)': (np.mean(garden_b), np.std(garden_b)),
    'Wingspan (cm)': (5.2, 0.8),
    'Body mass (g)': (0.5, 0.15),
    'Flight time (s)': (12, 4),
}

names = list(datasets.keys())
cvs = [sd/mean*100 for mean, sd in datasets.values()]
colors = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#a855f7']

ax4.barh(names, cvs, color=colors, alpha=0.8)
for bar, cv in zip(ax4.patches, cvs):
    ax4.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
            f'{cv:.1f}%', color='white', fontsize=9, va='center')

ax4.set_xlabel('Coefficient of Variation (%)', color='white')
ax4.set_title('CV: Comparing Variability Across Measures', color='white', fontsize=12)
ax4.tick_params(colors='gray')
ax4.set_yticklabels(names, color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Summary:")
print(f"  Garden A: mean={np.mean(garden_a):.1f}, SD={np.std(garden_a):.1f}, CV={np.std(garden_a)/np.mean(garden_a)*100:.1f}%")
print(f"  Garden B: mean={np.mean(garden_b):.1f}, SD={np.std(garden_b):.1f}, CV={np.std(garden_b)/np.mean(garden_b)*100:.1f}%")
print(f"\
68-95-99.7 check for Garden A:")
within_1sd = np.mean(np.abs(garden_a - np.mean(garden_a)) < np.std(garden_a)) * 100
within_2sd = np.mean(np.abs(garden_a - np.mean(garden_a)) < 2*np.std(garden_a)) * 100
print(f"  Within ±1 SD: {within_1sd:.1f}% (expected 68%)")
print(f"  Within ±2 SD: {within_2sd:.1f}% (expected 95%)")`,
      challenge: 'Generate data from a Poisson distribution (np.random.poisson(15, 1000)). For Poisson data, mean ≈ variance (SD² ≈ mean). Verify this. Why is this property useful for detecting whether ecological count data has extra variability beyond randomness?',
      successHint: 'Standard deviation is the single most important measure of uncertainty in science. Every error bar, every confidence interval, every p-value is built on SD. When someone reports a result without mentioning the spread, they\'re telling you the address but not the neighborhood.',
    },
    {
      title: 'Confidence intervals — quantifying uncertainty',
      concept: `The boy counted butterflies for 30 days and got a mean of 15. But how confident is he that the TRUE long-term average is 15? If he counted for 365 days, the mean might shift to 14.2 or 15.8. A **confidence interval (CI)** quantifies this uncertainty.

**95% CI formula** (for large samples): CI = mean ± 1.96 × (SD / sqrt(n))

Where n is the sample size. The term SD/sqrt(n) is called the **standard error of the mean (SEM)**.

**Interpretation**: "We are 95% confident that the true population mean falls within this interval."

Key insights:
- **Larger sample → narrower CI** (more data = more certainty)
- **Larger SD → wider CI** (more variable data = less certainty)
- **95% is a convention**, not a law. You can use 90% (narrower) or 99% (wider)
- CI does NOT mean "95% of the data falls here." That's a different concept (prediction interval)

If the CI includes zero for a difference (e.g., comparing two gardens), we can't be confident the difference is real. If it excludes zero, the difference is "statistically significant."`,
      analogy: 'A confidence interval is like an error margin in a GPS reading. Your GPS says "you are at 26.1°N" but the real position could be ±0.001°. The CI is that ± range. A cheap GPS (small sample) has a wide margin (wide CI). An expensive GPS (large sample) has a narrow margin (narrow CI). The true position is somewhere in the range — you just can\'t pin it down exactly.',
      storyConnection: 'The boy counted 15 butterflies/day on average over 30 days. His 95% CI might be [13.8, 16.2]. This means he can confidently tell his teacher: "My garden has about 15 butterflies per day, give or take about 1." Without the CI, his teacher might think 15 is exact. With the CI, she understands it\'s an estimate — honest and useful. Science values honesty about uncertainty.',
      checkQuestion: 'A study reports "mean butterfly count: 15 ± 2 (95% CI)." Another study from a different garden reports "mean: 17 ± 3." Can you conclude the second garden has more butterflies?',
      checkAnswer: 'No — the confidence intervals overlap. Garden 1: [13, 17]. Garden 2: [14, 20]. Since 14-17 is in both ranges, the difference could be zero (a statistical fluke). To conclude a real difference, the CIs should not overlap (or better, formally test with a t-test). Overlapping CIs are a warning: "the difference might not be real."',
      codeIntro: 'Build confidence intervals from butterfly data and see how sample size affects certainty.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# True population parameters
true_mean = 15
true_sd = 4

# Sample different amounts and compute CIs
sample_sizes = [5, 10, 30, 100, 300]
n_simulations = 100  # repeat each sample size 100 times

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# CI width vs sample size
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ci_widths = []
for n in sample_sizes:
    width = 2 * 1.96 * true_sd / np.sqrt(n)
    ci_widths.append(width)
    ax1.bar(str(n), width, color='#3b82f6', alpha=0.8)
    ax1.text(str(n), width + 0.1, f'±{width/2:.2f}', color='white', fontsize=9, ha='center')

ax1.set_xlabel('Sample size (n)', color='white')
ax1.set_ylabel('95% CI width', color='white')
ax1.set_title('Confidence Interval Narrows with More Data', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# 100 simulated CIs (n=30)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
n = 30
contains_true = 0
for i in range(n_simulations):
    sample = np.random.normal(true_mean, true_sd, n)
    sample_mean = np.mean(sample)
    sem = np.std(sample, ddof=1) / np.sqrt(n)
    ci_low = sample_mean - 1.96 * sem
    ci_high = sample_mean + 1.96 * sem

    color = '#22c55e' if ci_low <= true_mean <= ci_high else '#ef4444'
    if ci_low <= true_mean <= ci_high:
        contains_true += 1

    ax2.plot([ci_low, ci_high], [i, i], color=color, linewidth=1, alpha=0.5)
    ax2.plot(sample_mean, i, 'o', color=color, markersize=2)

ax2.axvline(true_mean, color='white', linewidth=2, linestyle='--', label=f'True mean: {true_mean}')
ax2.set_xlabel('Butterfly count', color='white')
ax2.set_ylabel('Simulation #', color='white')
ax2.set_title(f'100 Simulated 95% CIs (n={n}): {contains_true}% contain truth', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Comparing two gardens with CIs
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
garden1 = np.random.normal(15, 4, 30)
garden2 = np.random.normal(17, 4, 30)
garden3 = np.random.normal(22, 4, 30)

gardens = [('Garden A', garden1, '#22c55e'),
           ('Garden B', garden2, '#3b82f6'),
           ('Garden C', garden3, '#ef4444')]

for i, (name, data, color) in enumerate(gardens):
    mean = np.mean(data)
    sem = np.std(data, ddof=1) / np.sqrt(len(data))
    ci_low = mean - 1.96 * sem
    ci_high = mean + 1.96 * sem

    ax3.plot([ci_low, ci_high], [i, i], color=color, linewidth=3)
    ax3.plot(mean, i, 'o', color=color, markersize=10)
    ax3.text(ci_high + 0.3, i, f'{mean:.1f} [{ci_low:.1f}, {ci_high:.1f}]', color=color, fontsize=9, va='center')

ax3.set_xlabel('Mean butterfly count (95% CI)', color='white')
ax3.set_yticks([0, 1, 2])
ax3.set_yticklabels(['Garden A', 'Garden B', 'Garden C'], color='white')
ax3.set_title('Comparing Gardens: Overlapping vs Non-overlapping CIs', color='white', fontsize=12)
ax3.tick_params(colors='gray')

# How many days to count? (required sample size)
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
desired_margins = np.linspace(0.5, 5, 100)
required_n = (1.96 * true_sd / desired_margins) ** 2

ax4.plot(desired_margins, required_n, color='#f59e0b', linewidth=2)
ax4.fill_between(desired_margins, required_n, alpha=0.15, color='#f59e0b')
ax4.set_xlabel('Desired margin of error (±butterflies)', color='white')
ax4.set_ylabel('Required sample size (days)', color='white')
ax4.set_title('How Many Days Do You Need to Count?', color='white', fontsize=12)
ax4.tick_params(colors='gray')

# Mark common targets
for margin in [1, 2, 3]:
    n_req = (1.96 * true_sd / margin) ** 2
    ax4.plot(margin, n_req, 'o', color='#ef4444', markersize=8)
    ax4.annotate(f'±{margin}: n={n_req:.0f}', xy=(margin, n_req),
                xytext=(margin+0.3, n_req+20), color='#ef4444', fontsize=9)

plt.tight_layout()
plt.show()

print(f"True mean: {true_mean}, True SD: {true_sd}")
print(f"\
Required sample sizes for 95% CI:")
for margin in [0.5, 1, 2, 3]:
    n_req = (1.96 * true_sd / margin) ** 2
    print(f"  ±{margin} butterflies: n = {n_req:.0f} days")`,
      challenge: 'If the boy can only count for 10 days, what is his margin of error? How many days would he need to narrow it to ±1 butterfly? There is always a trade-off between effort and precision.',
      successHint: 'Confidence intervals are the honest way to report results. Every scientific paper, clinical trial, and poll should report CIs, not just point estimates. When someone says "the average is 15," ask "with what uncertainty?" The CI is the answer.',
    },
    {
      title: 'Hypothesis testing — is the difference real?',
      concept: `The boy suspects his garden has more butterflies after he planted more flowers. Before planting: mean = 12/day. After: mean = 16/day. Is the increase real, or just random variation? **Hypothesis testing** provides a formal framework to answer this.

**The steps:**
1. **Null hypothesis (H0)**: there's no real difference (the increase is due to chance)
2. **Alternative hypothesis (H1)**: there IS a real difference (the flowers helped)
3. **Calculate a test statistic**: measures how far the observed difference is from what chance would produce
4. **Find the p-value**: probability of seeing this large a difference IF H0 is true
5. **Decide**: if p < 0.05 (convention), reject H0 — the difference is "statistically significant"

**The t-test** (comparing two means):
- t = (mean1 - mean2) / sqrt(SE1² + SE2²)
- Large |t| → means are far apart relative to their uncertainty → small p → significant

**Critical caveat**: "statistically significant" ≠ "important." A difference of 0.1 butterflies can be significant with enough data. Always report EFFECT SIZE alongside p-value.`,
      analogy: 'Hypothesis testing is like a criminal trial. H0 (null hypothesis) = "innocent until proven guilty." The evidence (data) must be strong enough to reject innocence beyond reasonable doubt (p < 0.05). A p-value of 0.03 means: "if the defendant were innocent, there\'s only a 3% chance we\'d see evidence this strong." Not proof of guilt, but enough to convict. And sometimes, the system gets it wrong (false positives happen at ~5%).',
      storyConnection: 'The boy planted marigolds and counted for 30 more days. His new mean was 16 — up from 12. But was it the marigolds or just a warm month? A t-test answers: given the variability in his data, is a 4-butterfly increase statistically unlikely under the assumption that flowers don\'t matter? If p < 0.05, the flowers probably helped. If p > 0.05, the jury\'s still out.',
      checkQuestion: 'A study finds p = 0.04 for the effect of a new flower on butterfly counts. The researcher concludes: "Planting these flowers definitely increases butterfly populations." What\'s wrong with this statement?',
      checkAnswer: 'Multiple issues: (1) p = 0.04 means there\'s a 4% chance of seeing this result by chance — not proof. (2) "Definitely" overstates the evidence. (3) One study is not conclusive — replication is needed. (4) The p-value says nothing about the SIZE of the effect (maybe the increase is 0.5 butterflies — statistically significant but ecologically meaningless). (5) Correlation ≠ causation — maybe both the flowers and the butterflies responded to good weather.',
      codeIntro: 'Perform a t-test on before/after butterfly count data and visualize the result.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Before planting flowers: 30 days
before = np.random.poisson(12, 30)
# After planting: 30 days (slight real increase)
after = np.random.poisson(16, 30)

# Manual t-test
mean_before = np.mean(before)
mean_after = np.mean(after)
se_before = np.std(before, ddof=1) / np.sqrt(len(before))
se_after = np.std(after, ddof=1) / np.sqrt(len(after))
t_stat = (mean_after - mean_before) / np.sqrt(se_before**2 + se_after**2)

# Approximate p-value (using normal approximation for large samples)
from math import erfc, sqrt
p_value = erfc(abs(t_stat) / sqrt(2))

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Raw data comparison
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
days = np.arange(1, 31)
ax1.plot(days, before, 'o-', color='#ef4444', markersize=4, linewidth=1, label=f'Before (mean={mean_before:.1f})')
ax1.plot(days, after, 's-', color='#22c55e', markersize=4, linewidth=1, label=f'After (mean={mean_after:.1f})')
ax1.set_xlabel('Day', color='white')
ax1.set_ylabel('Butterfly count', color='white')
ax1.set_title('Before vs After Planting Flowers', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Histograms
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
bins = np.arange(0, 30, 1)
ax2.hist(before, bins=bins, color='#ef4444', alpha=0.5, label='Before', density=True)
ax2.hist(after, bins=bins, color='#22c55e', alpha=0.5, label='After', density=True)
ax2.axvline(mean_before, color='#ef4444', linestyle='--', linewidth=2)
ax2.axvline(mean_after, color='#22c55e', linestyle='--', linewidth=2)
ax2.set_xlabel('Daily count', color='white')
ax2.set_ylabel('Density', color='white')
ax2.set_title('Distribution Overlap', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# T-distribution and test statistic
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
x = np.linspace(-5, 5, 200)
# t-distribution approximated by normal for df=58
y = np.exp(-x**2 / 2) / np.sqrt(2 * np.pi)
ax3.plot(x, y, color='white', linewidth=2)
ax3.fill_between(x, y, where=np.abs(x) > abs(t_stat), alpha=0.4, color='#ef4444',
                label=f'p-value = {p_value:.4f}')
ax3.axvline(t_stat, color='#22c55e', linewidth=2, linestyle='--',
           label=f't-statistic = {t_stat:.2f}')
ax3.axvline(-t_stat, color='#22c55e', linewidth=2, linestyle='--', alpha=0.5)
ax3.set_xlabel('t value', color='white')
ax3.set_ylabel('Probability density', color='white')
ax3.set_title(f'T-Test Result: t={t_stat:.2f}, p={p_value:.4f}', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Effect size and power
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# How much of an effect can we detect with n=30?
pooled_sd = np.sqrt((np.var(before, ddof=1) + np.var(after, ddof=1)) / 2)
cohens_d = (mean_after - mean_before) / pooled_sd

effect_sizes = np.linspace(0, 2, 100)
# Power approximation: P(reject H0 | H1 true)
# For two-sample t-test with n=30 per group
power = []
for d in effect_sizes:
    # Non-central t approximation
    ncp = d * np.sqrt(30 / 2)
    # P(|t| > 1.96) under non-central t ≈ Phi(ncp - 1.96) + Phi(-ncp - 1.96)
    from math import erf
    p = 0.5 * (1 + erf((ncp - 1.96) / np.sqrt(2))) + 0.5 * (1 + erf((-ncp - 1.96) / np.sqrt(2)))
    power.append(min(p, 1))

ax4.plot(effect_sizes, power, color='#3b82f6', linewidth=2)
ax4.axhline(0.8, color='#f59e0b', linestyle='--', label='80% power threshold')
ax4.axvline(cohens_d, color='#22c55e', linestyle=':', label=f'Our effect: d={cohens_d:.2f}')
ax4.fill_between(effect_sizes, power, alpha=0.1, color='#3b82f6')
ax4.set_xlabel("Cohen's d (effect size)", color='white')
ax4.set_ylabel('Statistical power', color='white')
ax4.set_title('Power: Can We Detect the Effect? (n=30)', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Before planting: mean = {mean_before:.1f}, SD = {np.std(before, ddof=1):.1f}")
print(f"After planting: mean = {mean_after:.1f}, SD = {np.std(after, ddof=1):.1f}")
print(f"Difference: {mean_after - mean_before:.1f} butterflies")
print(f"t-statistic: {t_stat:.2f}")
print(f"p-value: {p_value:.4f}")
print(f"Cohen's d (effect size): {cohens_d:.2f}")
sig = "Yes" if p_value < 0.05 else "No"
print(f"\
Statistically significant at p < 0.05? {sig}")`,
      challenge: 'What if the difference were smaller — say, 13 vs 14 (just 1 butterfly more)? Run the t-test. With n=30, can you detect such a small difference? How many days would you need?',
      successHint: 'Hypothesis testing is the formal method scientists use to separate signal from noise. But it\'s often misunderstood and misused. A p-value is not the probability your hypothesis is true — it\'s the probability of your data under the null hypothesis. Understanding this distinction is essential scientific literacy.',
    },
    {
      title: 'Regression analysis — finding relationships in data',
      concept: `The boy noticed that warmer days had more butterflies. But is this a REAL relationship, or coincidence? **Regression analysis** quantifies the relationship between two variables.

**Simple linear regression**: y = a + bx
- y = butterfly count (dependent variable, what we want to predict)
- x = temperature (independent variable, what we think drives it)
- a = intercept (predicted count at 0°C)
- b = slope (how much count changes per 1°C increase)

**R² (R-squared)**: fraction of variability in y explained by x
- R² = 0: x explains nothing (no relationship)
- R² = 0.5: x explains 50% of the variation (moderate relationship)
- R² = 1.0: x explains everything (perfect relationship)

**Residuals**: the differences between observed and predicted values
- If the model is good, residuals should be random (no pattern)
- If residuals show a pattern, the model is missing something

**Causation warning**: regression shows association, not causation. Both temperature and butterfly count might increase in spring because of a third factor (day length), not because one causes the other.`,
      analogy: 'Regression is like drawing the best-fit line through a scatter of stars in the sky. The line doesn\'t pass through every star, but it captures the general trend. R² tells you how tightly the stars cluster around the line. A constellation with stars close to the line (high R²) has a clear pattern; a random scatter (low R²) has none. The line lets you predict where the next star might appear.',
      storyConnection: 'The boy plotted his butterfly counts against temperature on graph paper. He drew a line through the points and noticed: for every 1°C increase above 20°C, he saw about 2 more butterflies. This is regression — and it gave him a PREDICTION tool. "Tomorrow will be 30°C, so I expect about 25 butterflies." His garden notebook became a forecasting system.',
      checkQuestion: 'A regression shows: butterfly count = 5 + 0.8 × temperature, R² = 0.60. What does this mean, and what DOESN\'T it mean?',
      checkAnswer: 'It means: (1) For each 1°C increase, we expect 0.8 more butterflies. (2) At 0°C, we\'d predict 5 butterflies. (3) Temperature explains 60% of the daily variation in butterfly counts. What it doesn\'t mean: (1) Temperature CAUSES the butterflies (maybe flowers open more in warmth). (2) The remaining 40% is "error" — it\'s unexplained variation (could be wind, day of week, etc.). (3) The relationship holds at all temperatures (extrapolation beyond the data range is dangerous).',
      codeIntro: 'Perform regression on butterfly count vs. temperature data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate correlated data: temperature and butterfly count
n = 60  # days
temperature = np.random.uniform(18, 35, n)

# True relationship: count = -10 + 1.2 * temp + noise
true_slope = 1.2
true_intercept = -10
noise = np.random.normal(0, 3, n)
counts = true_intercept + true_slope * temperature + noise
counts = np.maximum(counts, 0)

# Perform linear regression
coeffs = np.polyfit(temperature, counts, 1)
slope, intercept = coeffs
predicted = np.polyval(coeffs, temperature)
residuals = counts - predicted

# R-squared
ss_res = np.sum(residuals**2)
ss_tot = np.sum((counts - np.mean(counts))**2)
r_squared = 1 - ss_res / ss_tot

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Scatter with regression line
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.scatter(temperature, counts, color='#3b82f6', alpha=0.6, s=40, edgecolors='white', linewidth=0.5)
temp_sorted = np.sort(temperature)
ax1.plot(temp_sorted, np.polyval(coeffs, temp_sorted), color='#ef4444', linewidth=2,
        label=f'y = {intercept:.1f} + {slope:.2f}x')
ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_ylabel('Butterfly count', color='white')
ax1.set_title(f'Regression: R² = {r_squared:.3f}', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Prediction with confidence band
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.scatter(temperature, counts, color='#3b82f6', alpha=0.3, s=30)

temp_range = np.linspace(15, 38, 100)
pred = np.polyval(coeffs, temp_range)
se_pred = np.std(residuals) * np.sqrt(1 + 1/n + (temp_range - np.mean(temperature))**2 / np.sum((temperature - np.mean(temperature))**2))

ax2.plot(temp_range, pred, color='#ef4444', linewidth=2, label='Prediction')
ax2.fill_between(temp_range, pred - 1.96*se_pred, pred + 1.96*se_pred,
                alpha=0.2, color='#ef4444', label='95% prediction interval')
ax2.axvspan(15, 18, alpha=0.1, color='#f59e0b')
ax2.axvspan(35, 38, alpha=0.1, color='#f59e0b')
ax2.text(16, 30, 'Extrapolation\
(risky!)', color='#f59e0b', fontsize=8, ha='center')
ax2.text(37, 30, 'Extrapolation\
(risky!)', color='#f59e0b', fontsize=8, ha='center')
ax2.set_xlabel('Temperature (°C)', color='white')
ax2.set_ylabel('Predicted count', color='white')
ax2.set_title('Prediction with Uncertainty', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

# Residual plot
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.scatter(predicted, residuals, color='#22c55e', alpha=0.6, s=40, edgecolors='white', linewidth=0.5)
ax3.axhline(0, color='white', linestyle='--', alpha=0.5)
ax3.set_xlabel('Predicted count', color='white')
ax3.set_ylabel('Residual (actual - predicted)', color='white')
ax3.set_title('Residual Plot (should be random)', color='white', fontsize=12)
ax3.tick_params(colors='gray')

# R² interpretation
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
# Show what different R² values look like
r2_examples = [0.1, 0.4, 0.7, 0.95]
r2_colors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e']

for i, (r2, color) in enumerate(zip(r2_examples, r2_colors)):
    x_sim = np.random.uniform(0, 10, 50)
    noise_sd = np.sqrt((1 - r2) / r2) * 1.0 if r2 > 0 else 3
    y_sim = 2 + 0.8 * x_sim + np.random.normal(0, noise_sd, 50)

    row = i // 2
    col = i % 2
    sub_ax = ax4.inset_axes([col*0.52, (1-row)*0.52 - 0.05, 0.45, 0.45])
    sub_ax.set_facecolor('#111827')
    sub_ax.scatter(x_sim, y_sim, s=10, color=color, alpha=0.6)
    z = np.polyfit(x_sim, y_sim, 1)
    sub_ax.plot([0, 10], [np.polyval(z, 0), np.polyval(z, 10)], color=color, linewidth=1.5)
    sub_ax.set_title(f'R² = {r2}', color=color, fontsize=9)
    sub_ax.tick_params(colors='gray', labelsize=6)

ax4.axis('off')
ax4.set_title('What Different R² Values Look Like', color='white', fontsize=12)

plt.tight_layout()
plt.show()

print(f"Regression results:")
print(f"  Equation: count = {intercept:.1f} + {slope:.2f} × temperature")
print(f"  R² = {r_squared:.3f} ({r_squared*100:.1f}% of variation explained)")
print(f"  Slope: {slope:.2f} more butterflies per °C")
print(f"\
Predictions:")
for temp in [20, 25, 30, 35]:
    pred = intercept + slope * temp
    print(f"  At {temp}°C: {pred:.1f} butterflies")`,
      challenge: 'Add a quadratic term: maybe butterflies increase with temperature up to 30°C, then decrease (too hot). Fit y = a + bx + cx² and compare R² to the linear model. Does the curve fit better?',
      successHint: 'Regression is the workhorse of quantitative science. It\'s used in ecology (species vs habitat), medicine (dose vs response), economics (price vs demand), and climate science (temperature vs CO₂). Learning to fit, interpret, and question regression models is a superpower.',
    },
    {
      title: 'Data visualization best practices — making data speak',
      concept: `The boy could present his butterfly data as a table of numbers. But a well-designed visualization reveals patterns that tables hide. **Data visualization** is the art and science of encoding data as visual elements.

**Chart selection guide:**
- **Bar chart**: comparing categories (species counts)
- **Line chart**: showing change over time (daily counts)
- **Scatter plot**: showing relationships between two variables (temperature vs count)
- **Histogram**: showing distribution (frequency of count values)
- **Pie chart**: showing proportions (only when there are few categories!)
- **Box plot**: comparing distributions across groups
- **Heatmap**: showing patterns in 2D data (species × location)

**Golden rules of visualization:**
1. **Label everything**: axes, title, units, legend
2. **Start axes at meaningful values** (usually zero for bar charts)
3. **Don't distort**: 3D charts, truncated axes, and double-axis charts mislead
4. **Color with purpose**: use color to encode information, not to decorate
5. **Remove chart junk**: gridlines, borders, and decorations that don't convey data
6. **The data-ink ratio**: maximize the ink used for data, minimize ink used for non-data`,
      analogy: 'A good data visualization is like a good map. A map of Delhi doesn\'t show every brick — it shows roads, landmarks, and neighborhoods. It removes clutter and highlights what matters for navigation. A data visualization does the same: it removes noise and highlights the patterns that matter for understanding. A bad chart is like a map showing every blade of grass — technically accurate but useless.',
      storyConnection: 'The boy showed his butterfly notebook to his science teacher. The teacher said: "Don\'t tell me the numbers — show me a picture." The boy drew a line chart of daily counts and a bar chart of species. Instantly, the teacher could see the summer peak, the rare species, and the effect of the new flowers. One well-designed chart replaced ten minutes of explanation.',
      checkQuestion: 'A newspaper shows a bar chart of butterfly populations with the y-axis starting at 90 (not 0). The bars for "2023: 95" and "2024: 100" look like 2024 has 10× more butterflies. What\'s the problem?',
      checkAnswer: 'This is axis manipulation — one of the most common chart deceptions. By starting at 90 instead of 0, a 5% increase (95→100) looks like a 100% increase. The visual impression is wildly disproportionate to the actual data. When the y-axis doesn\'t start at zero for a bar chart, the bar heights become meaningless — they represent arbitrary proportions. Always check the axis. Always.',
      codeIntro: 'Create a suite of properly designed visualizations from butterfly survey data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Comprehensive butterfly dataset
n_days = 90  # 3 months
dates = np.arange(n_days)
temperature = 22 + 8 * np.sin(dates / 90 * np.pi) + np.random.normal(0, 2, n_days)

species_data = {
    'Common Grass Yellow': np.maximum(0, np.random.poisson(8, n_days) + (temperature - 25) * 0.3).astype(int),
    'Plain Tiger': np.maximum(0, np.random.poisson(5, n_days)).astype(int),
    'Common Mormon': np.maximum(0, np.random.poisson(3, n_days)).astype(int),
    'Blue Pansy': np.maximum(0, np.random.poisson(2, n_days)).astype(int),
}

fig = plt.figure(figsize=(16, 12))
fig.patch.set_facecolor('#1f2937')

# 1. Time series (line chart) — GOOD
ax1 = fig.add_subplot(2, 3, 1)
ax1.set_facecolor('#111827')
total = sum(species_data.values())
# 7-day rolling average
window = 7
rolling = np.convolve(total, np.ones(window)/window, mode='valid')
ax1.plot(dates, total, color='gray', alpha=0.3, linewidth=0.5, label='Daily')
ax1.plot(dates[window-1:], rolling, color='#22c55e', linewidth=2, label=f'{window}-day average')
ax1.set_xlabel('Day', color='white')
ax1.set_ylabel('Count', color='white')
ax1.set_title('Line Chart: Trend Over Time', color='#22c55e', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax1.tick_params(colors='gray')

# 2. Species comparison (bar chart) — GOOD
ax2 = fig.add_subplot(2, 3, 2)
ax2.set_facecolor('#111827')
totals = {name: data.sum() for name, data in species_data.items()}
sorted_species = sorted(totals.items(), key=lambda x: x[1], reverse=True)
names = [s[0] for s in sorted_species]
vals = [s[1] for s in sorted_species]
colors = ['#f59e0b', '#ef4444', '#3b82f6', '#22c55e']
ax2.barh(names, vals, color=colors, alpha=0.8)
for bar, val in zip(ax2.patches, vals):
    ax2.text(bar.get_width() + 5, bar.get_y() + bar.get_height()/2, str(val),
            color='white', fontsize=9, va='center')
ax2.set_xlabel('Total count (90 days)', color='white')
ax2.set_title('Bar Chart: Species Comparison', color='#3b82f6', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_yticklabels(names, color='white', fontsize=8)

# 3. Scatter + regression — GOOD
ax3 = fig.add_subplot(2, 3, 3)
ax3.set_facecolor('#111827')
ax3.scatter(temperature, total, s=20, color='#f59e0b', alpha=0.5, edgecolors='none')
z = np.polyfit(temperature, total, 1)
temp_line = np.linspace(temperature.min(), temperature.max(), 50)
ax3.plot(temp_line, np.polyval(z, temp_line), color='#ef4444', linewidth=2)
r2 = 1 - np.sum((total - np.polyval(z, temperature))**2) / np.sum((total - np.mean(total))**2)
ax3.set_xlabel('Temperature (°C)', color='white')
ax3.set_ylabel('Daily count', color='white')
ax3.set_title(f'Scatter: Temp vs Count (R²={r2:.2f})', color='#f59e0b', fontsize=11)
ax3.tick_params(colors='gray')

# 4. BAD chart: misleading axis
ax4 = fig.add_subplot(2, 3, 4)
ax4.set_facecolor('#111827')
monthly_totals = [total[:30].sum(), total[30:60].sum(), total[60:].sum()]
months = ['Month 1', 'Month 2', 'Month 3']
ax4.bar(months, monthly_totals, color='#ef4444', alpha=0.8)
ax4.set_ylim(monthly_totals[0] * 0.9, max(monthly_totals) * 1.05)
ax4.set_title('BAD: Y-axis starts at 90%\
(exaggerates differences)', color='#ef4444', fontsize=10)
ax4.tick_params(colors='gray')
ax4.set_xticklabels(months, color='white')

# 5. GOOD chart: same data, honest axis
ax5 = fig.add_subplot(2, 3, 5)
ax5.set_facecolor('#111827')
ax5.bar(months, monthly_totals, color='#22c55e', alpha=0.8)
ax5.set_ylim(0, max(monthly_totals) * 1.1)
ax5.set_title('GOOD: Y-axis starts at 0\
(honest comparison)', color='#22c55e', fontsize=10)
ax5.tick_params(colors='gray')
ax5.set_xticklabels(months, color='white')

# 6. Heatmap: species x week
ax6 = fig.add_subplot(2, 3, 6)
ax6.set_facecolor('#111827')
n_weeks = n_days // 7
heatmap_data = np.zeros((len(species_data), n_weeks))
for i, (name, data) in enumerate(species_data.items()):
    for w in range(n_weeks):
        heatmap_data[i, w] = data[w*7:(w+1)*7].sum()

im = ax6.imshow(heatmap_data, aspect='auto', cmap='YlOrRd', interpolation='nearest')
plt.colorbar(im, ax=ax6, shrink=0.8, label='Weekly count')
ax6.set_xticks(range(0, n_weeks, 2))
ax6.set_xticklabels([f'W{w+1}' for w in range(0, n_weeks, 2)], color='white', fontsize=7)
ax6.set_yticks(range(len(species_data)))
ax6.set_yticklabels(list(species_data.keys()), color='white', fontsize=8)
ax6.set_title('Heatmap: Species × Week', color='white', fontsize=11)
ax6.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Visualization checklist:")
print("  [✓] Every axis labeled with units")
print("  [✓] Titles describe what the chart shows")
print("  [✓] Colors encode information, not decoration")
print("  [✓] Bar charts start at zero")
print("  [✓] Appropriate chart type for each data type")
print("  [✓] Bad example included — so you recognize misleading charts")`,
      challenge: 'Take the same monthly totals data and create a 3D pie chart with Excel-style colors. Compare it to a simple bar chart. Which communicates the data more clearly? Why do 3D charts distort proportions?',
      successHint: 'Good visualization is not about making pretty pictures — it\'s about making data understandable. Tufte\'s principle: "show the data, and only the data." Every pixel should earn its place on the chart. The boy\'s butterfly counts, well-visualized, can tell a story that thousands of numbers cannot.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Statistical Methods — builds on Level 1 data skills</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for statistical analysis. Click to start.</p>
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
