import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SeedKeeperLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Allele frequency — the mathematics of genetic variation',
      concept: `An **allele** is a variant of a gene. For example, a gene controlling seed color might have allele A (brown) and allele a (white). In a population, the **allele frequency** is the proportion of each allele:

If 100 plants have genotypes: 36 AA, 48 Aa, 16 aa
- Allele A frequency: (36×2 + 48×1) / (100×2) = 120/200 = **p = 0.60**
- Allele a frequency: (16×2 + 48×1) / (100×2) = 80/200 = **q = 0.40**
- Always: **p + q = 1**

Allele frequencies change over time due to:
- **Selection**: some alleles make organisms more fit
- **Drift**: random sampling in small populations
- **Migration**: new alleles arrive from other populations
- **Mutation**: new alleles are created

Tracking allele frequencies is how we measure genetic diversity quantitatively. A population with many alleles at equal frequencies is diverse. One with a single dominant allele is not.`,
      analogy: 'Allele frequencies are like polling data for an election. p = 0.60 means allele A has 60% of the "vote" in the gene pool. Evolution is the election — over generations, one allele may win (fixation) or they may coexist (balanced polymorphism). Genetic drift is like random polling error, bigger in small samples.',
      storyConnection: 'The Seed Keeper\'s rice varieties have different allele frequencies for drought tolerance, pest resistance, and grain quality genes. When she saves seeds from her best plants, she\'s shifting allele frequencies — increasing the frequency of alleles for desirable traits. This is artificial selection, the same process that created all domesticated crops.',
      checkQuestion: 'In a population of 10 plants, all heterozygous (Aa), what is the allele frequency of A? What if one plant dies randomly?',
      checkAnswer: 'All Aa means p = q = 0.5 exactly. If one dies, the remaining 9 plants still have p ≈ 0.5, but not exactly — it depends on which plant died. In a population of 10, losing one organism can shift allele frequency by up to 5%. In a population of 10,000, it shifts by 0.005%. This is why small populations are vulnerable to drift.',
      codeIntro: 'Simulate allele frequency changes over generations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def simulate_allele_freq(pop_size, initial_p, generations, selection_coeff=0):
    """Simulate allele frequency with drift and optional selection."""
    freqs = [initial_p]
    p = initial_p
    for gen in range(generations):
        # Selection: A allele has fitness advantage
        if selection_coeff > 0:
            p_selected = p * (1 + selection_coeff) / (p * (1 + selection_coeff) + (1 - p))
        else:
            p_selected = p
        # Drift: binomial sampling
        n_A = np.random.binomial(2 * pop_size, p_selected)
        p = n_A / (2 * pop_size)
        p = np.clip(p, 0, 1)
        freqs.append(p)
    return freqs

generations = 200

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Effect of population size on drift
ax1.set_facecolor('#111827')
pop_sizes = [20, 100, 1000]
colors = ['#ef4444', '#f59e0b', '#22c55e']

for pop_size, color in zip(pop_sizes, colors):
    for trial in range(5):
        freqs = simulate_allele_freq(pop_size, 0.5, generations)
        alpha = 0.8 if trial == 0 else 0.3
        label = f'N={pop_size}' if trial == 0 else None
        ax1.plot(freqs, color=color, alpha=alpha, linewidth=1, label=label)

ax1.axhline(0.5, color='#4b5563', linestyle=':', alpha=0.3)
ax1.set_xlabel('Generation', color='white')
ax1.set_ylabel('Allele A frequency (p)', color='white')
ax1.set_title('Genetic Drift: Small vs Large Populations', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(-0.05, 1.05)

# Drift vs selection
ax2.set_facecolor('#111827')
for trial in range(10):
    # Pure drift (neutral)
    freqs_drift = simulate_allele_freq(100, 0.3, generations, selection_coeff=0)
    ax2.plot(freqs_drift, color='#3b82f6', alpha=0.2, linewidth=0.8)

for trial in range(10):
    # Selection (s=0.05)
    freqs_sel = simulate_allele_freq(100, 0.3, generations, selection_coeff=0.05)
    ax2.plot(freqs_sel, color='#22c55e', alpha=0.3, linewidth=0.8)

ax2.plot([], color='#3b82f6', linewidth=2, label='Neutral (drift only)')
ax2.plot([], color='#22c55e', linewidth=2, label='Selection (s=0.05)')
ax2.axhline(0.3, color='#f59e0b', linestyle=':', alpha=0.3, label='Initial p=0.3')
ax2.set_xlabel('Generation', color='white')
ax2.set_ylabel('Allele A frequency (p)', color='white')
ax2.set_title('Drift vs Selection (N=100)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(-0.05, 1.05)

plt.tight_layout()
plt.show()

print("Key observations:")
print("  Small populations (N=20): alleles fix or are lost quickly (strong drift)")
print("  Large populations (N=1000): frequencies stay near 0.5 (weak drift)")
print("  Selection pushes frequency up; drift adds randomness")
print("  In very small populations, drift can overpower selection")`,
      challenge: 'Simulate a population bottleneck: start with N=1000 for 50 generations, reduce to N=10 for 10 generations, then recover to N=1000. How does the bottleneck affect allele frequency and diversity?',
      successHint: 'Allele frequency is the fundamental variable of population genetics. Everything — evolution, conservation, breeding — comes down to tracking how allele frequencies change over time.',
    },
    {
      title: 'Hardy-Weinberg equilibrium — the null model of genetics',
      concept: `The **Hardy-Weinberg principle** states that allele frequencies remain constant across generations IF:
1. No selection (all genotypes equally fit)
2. No drift (infinitely large population)
3. No migration (closed population)
4. No mutation
5. Random mating

Under these conditions, genotype frequencies are predicted by:
- **AA frequency** = p²
- **Aa frequency** = 2pq
- **aa frequency** = q²

This is the **null model** — the baseline expectation when nothing interesting is happening. Deviations from Hardy-Weinberg tell us something IS happening: selection, drift, inbreeding, or population structure.

If a locus is in Hardy-Weinberg equilibrium (HWE), the population is probably NOT experiencing strong selection at that gene. If it deviates from HWE, something is acting on it — and we can figure out what.`,
      analogy: 'Hardy-Weinberg is like a perfectly balanced coin toss. If you flip 1000 coins, you expect ~500 heads and ~500 tails. If you get 700 heads, the coin is biased — something is off. Similarly, if genotype frequencies deviate from HWE predictions, something is "biasing" the genetics — selection, inbreeding, or population structure.',
      storyConnection: 'The Seed Keeper\'s traditional rice population is probably NOT in Hardy-Weinberg equilibrium — because she practices selection (choosing the best plants) and the population is small (strong drift). HWE gives us a mathematical baseline to quantify how much her selection has shifted the genetics.',
      checkQuestion: 'If p (frequency of allele A) = 0.7, what are the expected HWE genotype frequencies?',
      checkAnswer: 'q = 1 - 0.7 = 0.3. AA = p² = 0.49 (49%), Aa = 2pq = 0.42 (42%), aa = q² = 0.09 (9%). In a population of 100: about 49 AA, 42 Aa, 9 aa. If you observe significantly different frequencies (say 60 AA, 20 Aa, 20 aa), the population is NOT in HWE — likely inbreeding is occurring (excess homozygotes).',
      codeIntro: 'Test Hardy-Weinberg equilibrium and visualize deviations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# HWE genotype frequencies as function of p
ax1.set_facecolor('#111827')
p_range = np.linspace(0, 1, 200)
q_range = 1 - p_range

AA = p_range**2
Aa = 2 * p_range * q_range
aa = q_range**2

ax1.fill_between(p_range, 0, AA, alpha=0.3, color='#22c55e', label='AA (p²)')
ax1.fill_between(p_range, AA, AA + Aa, alpha=0.3, color='#3b82f6', label='Aa (2pq)')
ax1.fill_between(p_range, AA + Aa, 1, alpha=0.3, color='#ef4444', label='aa (q²)')
ax1.plot(p_range, AA, color='#22c55e', linewidth=2)
ax1.plot(p_range, AA + Aa, color='#3b82f6', linewidth=2)

ax1.set_xlabel('Allele A frequency (p)', color='white')
ax1.set_ylabel('Genotype frequency', color='white')
ax1.set_title('Hardy-Weinberg Genotype Frequencies', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Test HWE with chi-squared
ax2.set_facecolor('#111827')

# Observed data (3 scenarios)
scenarios = [
    ('HWE holds', [49, 42, 9], 0.7),
    ('Excess\\nhomozygotes\\n(inbreeding)', [55, 30, 15], 0.7),
    ('Excess\\nheterozygotes\\n(selection)', [35, 55, 10], 0.625),
]

x_positions = np.arange(3)
width = 0.12

for idx, (name, observed, p_est) in enumerate(scenarios):
    total = sum(observed)
    q_est = 1 - p_est
    expected = [total * p_est**2, total * 2*p_est*q_est, total * q_est**2]

    # Chi-squared test
    chi2 = sum((o - e)**2 / e for o, e in zip(observed, expected))

    genotypes = ['AA', 'Aa', 'aa']
    for g, (obs, exp) in enumerate(zip(observed, expected)):
        x = idx * 1.2 + g * width * 2
        ax2.bar(x, obs, width, color='#3b82f6', alpha=0.8)
        ax2.bar(x + width, exp, width, color='#f59e0b', alpha=0.8)
        ax2.text(x + width/2, max(obs, exp) + 1, genotypes[g],
                 ha='center', color='white', fontsize=7)

    significance = 'p<0.05 *' if chi2 > 3.84 else 'p>0.05'
    ax2.text(idx * 1.2 + 0.15, -8, f'{name}\\nχ²={chi2:.1f}\\n{significance}',
             ha='center', color='white', fontsize=7)

ax2.bar([], [], width, color='#3b82f6', label='Observed')
ax2.bar([], [], width, color='#f59e0b', label='HWE expected')
ax2.set_title('Chi-Squared Test for HWE', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_xticks([])

plt.tight_layout()
plt.show()

print("Hardy-Weinberg Equilibrium test:")
print("  H₀: population is in HWE (genotypes match p², 2pq, q²)")
print("  Test statistic: χ² = Σ (observed - expected)² / expected")
print("  Critical value (df=1, α=0.05): 3.84")
print()
for name, observed, p_est in scenarios:
    total = sum(observed)
    q_est = 1 - p_est
    expected = [total * p_est**2, total * 2*p_est*q_est, total * q_est**2]
    chi2 = sum((o - e)**2 / e for o, e in zip(observed, expected))
    print(f"  {name.split(chr(10))[0]}: χ²={chi2:.2f}, {'REJECT' if chi2 > 3.84 else 'ACCEPT'} HWE")`,
      challenge: 'Simulate a population of 200 individuals with p=0.5, random mating, for 100 generations. At each generation, test for HWE. How often does the test reject HWE by chance? (This is the false positive rate — it should be about 5%.)',
      successHint: 'Hardy-Weinberg is the "nothing happening" model. In conservation genetics, deviations from HWE are diagnostic: they tell you whether a population is inbreeding, under selection, or subdivided. It\'s the first test any population geneticist runs.',
    },
    {
      title: 'Genetic drift — randomness in small populations',
      concept: `**Genetic drift** is the random change in allele frequencies due to finite population size. In small populations, chance events can cause alleles to become fixed (100% frequency) or lost (0% frequency) regardless of their fitness value.

Key concepts:
- **Random sampling**: each generation is a random sample from the previous gene pool. Small samples are noisy.
- **Fixation**: an allele reaches 100% frequency (the other allele is lost forever)
- **Expected time to fixation**: ~4N generations for a neutral allele (N = population size)
- **Bottleneck effect**: sudden population reduction causes massive drift
- **Founder effect**: a small group colonizes a new area, carrying only a fraction of the original diversity

Drift is **always** happening, but its strength depends on population size:
- N = 10: drift is dominant, alleles fix/lose in ~40 generations
- N = 100: drift is moderate
- N = 10,000: drift is negligible for most practical purposes
- N = ∞: no drift (Hardy-Weinberg)`,
      analogy: 'Genetic drift is like flipping a biased coin. If the coin is 50/50 (neutral allele), after many flips the running proportion should be ~50%. But with only 10 flips, you might get 70% heads or 30% heads by pure chance. That\'s drift. With 10,000 flips, the proportion is very close to 50%. Population size is the number of flips per generation.',
      storyConnection: 'The Seed Keeper\'s rice population is small — maybe a few hundred plants per variety. At this size, genetic drift is significant. If she saves seeds from only 20 plants (a common practice), drift is even stronger. This is why saving seeds from as many plants as possible preserves more diversity — it reduces the sampling noise.',
      checkQuestion: 'A population of 10 frogs survives a flood (bottleneck). Before the flood, allele A had frequency 0.4. After? What\'s the range of likely outcomes?',
      checkAnswer: 'The allele frequency in the 10 survivors could be anything from 0 to 1, but is most likely near 0.4. With N=10, the standard deviation of allele frequency is √(p(1-p)/2N) = √(0.24/20) ≈ 0.11. So about 68% of the time, the frequency will be between 0.29 and 0.51. But there\'s roughly a 2% chance the allele is lost entirely and a 0.4% chance it\'s fixed. In a large population, these extreme outcomes are virtually impossible.',
      codeIntro: 'Simulate genetic drift, bottlenecks, and the founder effect.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# 1. Multiple drift simulations
ax = axes[0, 0]
ax.set_facecolor('#111827')
n_simulations = 20
pop_size = 50
generations = 200

fixed = 0
lost = 0
for i in range(n_simulations):
    p = 0.5
    freqs = [p]
    for g in range(generations):
        n_A = np.random.binomial(2 * pop_size, p)
        p = n_A / (2 * pop_size)
        freqs.append(p)
    color = '#22c55e' if freqs[-1] > 0.5 else '#ef4444'
    ax.plot(freqs, color=color, alpha=0.3, linewidth=0.8)
    if freqs[-1] >= 1.0: fixed += 1
    if freqs[-1] <= 0.0: lost += 1

ax.axhline(0.5, color='#f59e0b', linestyle=':', alpha=0.3)
ax.set_title(f'20 Drift Simulations (N={pop_size})', color='white', fontsize=11)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Allele frequency', color='white')
ax.tick_params(colors='gray')
ax.text(0.02, 0.98, f'Fixed: {fixed}, Lost: {lost}', transform=ax.transAxes,
        color='white', fontsize=9, va='top')

# 2. Bottleneck
ax = axes[0, 1]
ax.set_facecolor('#111827')
for trial in range(10):
    p = 0.5
    freqs = [p]
    for g in range(300):
        N = 1000 if g < 100 or g > 110 else 10  # bottleneck at gen 100-110
        n_A = np.random.binomial(2 * N, p)
        p = n_A / (2 * N)
        freqs.append(p)
    ax.plot(freqs, color='#3b82f6', alpha=0.4, linewidth=0.8)

ax.axvspan(100, 110, alpha=0.2, color='#ef4444')
ax.text(105, 0.95, 'Bottleneck\\n(N=10)', ha='center', color='#ef4444', fontsize=8)
ax.set_title('Population Bottleneck Effect', color='white', fontsize=11)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Allele frequency', color='white')
ax.tick_params(colors='gray')

# 3. Drift rate vs population size
ax = axes[1, 0]
ax.set_facecolor('#111827')
pop_sizes = [10, 50, 200, 1000]
colors_pop = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']

for N, color in zip(pop_sizes, colors_pop):
    variances = []
    for gen in range(100):
        final_freqs = []
        for trial in range(500):
            p = 0.5
            for g in range(gen + 1):
                n_A = np.random.binomial(2 * N, p)
                p = n_A / (2 * N)
            final_freqs.append(p)
        variances.append(np.var(final_freqs))
    ax.plot(range(100), variances, color=color, linewidth=2, label=f'N={N}')

ax.set_xlabel('Generations', color='white')
ax.set_ylabel('Variance of allele frequency', color='white')
ax.set_title('Drift Rate vs Population Size', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# 4. Heterozygosity loss
ax = axes[1, 1]
ax.set_facecolor('#111827')
for N, color in zip(pop_sizes, colors_pop):
    gens = np.arange(200)
    expected_het = 0.5 * (1 - 1/(2*N))**gens  # Expected heterozygosity decay
    ax.plot(gens, expected_het, color=color, linewidth=2, label=f'N={N}')

ax.set_xlabel('Generations', color='white')
ax.set_ylabel('Expected heterozygosity', color='white')
ax.set_title('Heterozygosity Loss Due to Drift', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Drift key results:")
print("  Expected heterozygosity after t generations: H(t) = H(0) × (1 - 1/2N)^t")
for N in pop_sizes:
    h_100 = 0.5 * (1 - 1/(2*N))**100
    print(f"  N={N:>4}: H(100) = {h_100:.4f} ({h_100/0.5*100:.1f}% retained)")`,
      challenge: 'The cheetah went through a severe bottleneck ~10,000 years ago. Simulate: start with N=10,000 and p=0.5, bottleneck to N=50 for 20 generations, then recover to N=10,000. How much diversity is permanently lost?',
      successHint: 'Genetic drift is the invisible thief of diversity. In conservation, the single most important number is the effective population size — it determines how fast drift erodes genetic variation.',
    },
    {
      title: 'Effective population size — the number that matters',
      concept: `The **effective population size** (Nₑ) is the size of an ideal population that would lose genetic diversity at the same rate as the real population. It's almost always smaller than the census size (N) because of:

- **Unequal sex ratios**: if 10 males mate with 100 females, Nₑ ≈ 4 × (10 × 100) / (10 + 100) ≈ 36 (not 110)
- **Variance in reproductive success**: if some plants produce many seeds and others few, Nₑ < N
- **Population fluctuations**: Nₑ is dominated by the smallest size (harmonic mean)
- **Inbreeding**: reduces Nₑ

Typical ratios of Nₑ/N:
- **Crops under artificial selection**: Nₑ/N ≈ 0.1-0.3
- **Wild populations**: Nₑ/N ≈ 0.1-0.5
- **Endangered species**: Nₑ can be shockingly small

Conservation rules of thumb:
- **Nₑ > 50**: minimum to avoid immediate inbreeding depression
- **Nₑ > 500**: minimum for long-term evolutionary potential
- **Nₑ > 5000**: needed to maintain mutation-drift balance`,
      analogy: 'Effective population size is like the real purchasing power of money vs. the nominal amount. If you have $1,000 but inflation is 50%, your effective purchasing power is $500. Similarly, a population of 1,000 animals might have an effective size of only 200 because of unequal mating, fluctuating numbers, and inbreeding. The "effective" number is what actually drives genetic dynamics.',
      storyConnection: 'The Seed Keeper might maintain 500 plants of a variety, but if she saves seeds from only her 20 best plants (strong artificial selection), the effective population size drops dramatically — perhaps to Nₑ ≈ 30-50. This means her variety is losing genetic diversity much faster than the census size suggests.',
      checkQuestion: 'A forest has 1,000 trees of a species, but only 50 produce viable pollen (the rest are too young or unhealthy). What is the approximate effective population size?',
      checkAnswer: 'Nₑ ≈ 4 × Nm × Nf / (Nm + Nf) where Nm = 50 (male function) and Nf = 1000 (female function, assuming all can set seed). Nₑ ≈ 4 × 50 × 1000 / 1050 ≈ 190. The effective size is only 19% of the census size because of the severe imbalance in reproductive contribution.',
      codeIntro: 'Calculate and visualize effective population size under different scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Ne vs census N under different conditions
ax1.set_facecolor('#111827')
N_census = np.arange(10, 1010, 10)

# Scenario 1: ideal (Ne = N)
ne_ideal = N_census

# Scenario 2: unequal sex ratio (10% males)
ne_sex = 4 * (0.1 * N_census) * (0.9 * N_census) / N_census

# Scenario 3: variance in reproductive success (variance = 5× mean)
ne_variance = N_census / 5

# Scenario 4: bottleneck history (harmonic mean of 50 and N)
ne_bottleneck = 2 / (1/50 + 1/N_census) * 1  # 50% of time at each

ax1.plot(N_census, ne_ideal, color='#22c55e', linewidth=2, label='Ideal (Nₑ = N)')
ax1.plot(N_census, ne_sex, color='#3b82f6', linewidth=2, label='10% males (sex ratio)')
ax1.plot(N_census, ne_variance, color='#f59e0b', linewidth=2, label='High reproductive variance')
ax1.plot(N_census, ne_bottleneck, color='#ef4444', linewidth=2, label='Recent bottleneck (N=50)')

# Conservation thresholds
ax1.axhline(50, color='#ef4444', linestyle=':', alpha=0.5)
ax1.text(1000, 55, 'Nₑ=50 (minimum viable)', color='#ef4444', fontsize=8, ha='right')
ax1.axhline(500, color='#f59e0b', linestyle=':', alpha=0.5)
ax1.text(1000, 510, 'Nₑ=500 (long-term viable)', color='#f59e0b', fontsize=8, ha='right')

ax1.set_xlabel('Census population size (N)', color='white')
ax1.set_ylabel('Effective population size (Nₑ)', color='white')
ax1.set_title('Nₑ is Almost Always Smaller Than N', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# 2. Ne/N ratios for real species
ax2.set_facecolor('#111827')
species = ['Humans\\n(global)', 'Bengal\\ntiger', 'Cheetah', 'Rice\\n(modern cv.)',
           'Rice\\n(traditional)', 'Kakapo', 'Corn\\n(modern cv.)']
ne_values = [10000, 2500, 100, 50, 500, 70, 30]
n_values = [8000000000, 3000, 7000, 1e9, 50000, 250, 1e9]
ne_n_ratio = [ne/n for ne, n in zip(ne_values, n_values)]

colors_sp = ['#22c55e' if ne > 500 else '#f59e0b' if ne > 50 else '#ef4444' for ne in ne_values]
bars = ax2.barh(species, ne_values, color=colors_sp, alpha=0.8, edgecolor='white', linewidth=0.5)

for bar, ne, n in zip(bars, ne_values, n_values):
    ax2.text(bar.get_width() + 100, bar.get_y() + bar.get_height()/2,
             f'Nₑ={ne:,} (N={n:,.0f})', va='center', color='white', fontsize=8)

ax2.axvline(50, color='#ef4444', linestyle=':', alpha=0.5)
ax2.axvline(500, color='#f59e0b', linestyle=':', alpha=0.5)
ax2.set_xlabel('Effective population size (Nₑ)', color='white')
ax2.set_title('Nₑ for Real Species/Varieties', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Effective population size rules of thumb:")
print("  Nₑ > 50: avoids immediate inbreeding depression")
print("  Nₑ > 500: maintains evolutionary potential")
print("  Nₑ > 5000: maintains mutation-drift balance")
print()
print("Shocking fact: modern crop varieties often have Nₑ < 100")
print("despite billions of individual plants — because they're all")
print("derived from a tiny number of elite breeding lines.")`,
      challenge: 'A seed bank regenerates a sample by growing 200 plants. If only the 30 most vigorous plants contribute seeds for the next storage cycle, what is the effective population size? How does this affect long-term diversity?',
      successHint: 'Effective population size is the single most important parameter in conservation genetics. It determines the rate of diversity loss, the power of selection, and the vulnerability to inbreeding. Every conservation program should estimate and maximize Nₑ.',
    },
    {
      title: 'Ex situ vs in situ conservation — complementary strategies',
      concept: `Conservation genetics uses two complementary approaches:

**Ex situ** (off-site): preserving genetic material outside the natural habitat
- Seed banks (Svalbard, IRRI)
- Tissue culture and cryopreservation
- Botanic gardens
- Captive breeding programs

**In situ** (on-site): protecting organisms in their natural habitat
- Protected areas (national parks, wildlife reserves)
- Community conservation areas
- Farmer-managed on-farm diversity
- Sacred groves

Neither alone is sufficient:
- **Ex situ alone** freezes evolution — stored seeds don't adapt to changing conditions
- **In situ alone** is vulnerable to habitat destruction, war, and climate change
- **Together**: in situ maintains evolutionary potential while ex situ provides backup

The Seed Keeper practices **on-farm conservation** — a form of in situ conservation where traditional varieties are maintained through continued cultivation. Her rice varieties keep evolving, adapting to local conditions year by year.`,
      analogy: 'Ex situ conservation is like a museum — it preserves masterpieces perfectly but they\'re frozen in time. In situ conservation is like a living art tradition — it evolves and adapts but can be disrupted. You want both: museums to protect the classics, and living artists to create new work. Similarly, you want seed banks AND farmers growing traditional varieties.',
      storyConnection: 'The Seed Keeper does in situ conservation every planting season — her varieties evolve, adapt to new pests, and respond to climate changes. If she also sends samples to Svalbard (ex situ), she creates the ideal complementary system: living evolution backed up by frozen insurance.',
      checkQuestion: 'Why can\'t we just freeze everything in Svalbard and stop worrying about in situ conservation?',
      checkAnswer: 'Because frozen seeds don\'t evolve. Climate change creates new challenges every year — new diseases, new temperature ranges, new rainfall patterns. Seeds in Svalbard are snapshots of 2008 genetics. In situ populations adapt continuously. If we rely only on ex situ, we\'ll have obsolete genetics when we need them most. It\'s like keeping only 20-year-old software backups — useful but not current.',
      codeIntro: 'Simulate the evolutionary advantage of in situ conservation over ex situ alone.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Simulate: environment changes over time, populations must adapt
generations = 100
env_change_rate = 0.05  # environment shifts each generation

# Environmental optimum shifts over time
env_optimum = np.cumsum(np.random.normal(env_change_rate, 0.1, generations))

# In situ population: adapts through selection
in_situ_mean = [0]
in_situ_var = [1]
pop_size = 500
heritability = 0.4

for g in range(1, generations):
    # Selection toward current optimum
    selection_differential = (env_optimum[g] - in_situ_mean[-1]) * 0.3
    response = heritability * selection_differential
    new_mean = in_situ_mean[-1] + response + np.random.normal(0, 0.05)
    new_var = in_situ_var[-1] * 0.99 + 0.01  # slight variance loss from drift, gain from mutation
    in_situ_mean.append(new_mean)
    in_situ_var.append(new_var)

# Ex situ: frozen at generation 0
ex_situ_mean = np.zeros(generations)  # stays at 0 forever
ex_situ_var = np.ones(generations)  # variance preserved perfectly

# Fitness relative to current environment
in_situ_fitness = np.exp(-0.5 * (np.array(in_situ_mean) - env_optimum)**2 / np.array(in_situ_var))
ex_situ_fitness = np.exp(-0.5 * (ex_situ_mean - env_optimum)**2 / ex_situ_var)

# Plot adaptation tracking
ax1.set_facecolor('#111827')
ax1.plot(range(generations), env_optimum, color='#f59e0b', linewidth=2, linestyle='--', label='Environmental optimum')
ax1.plot(range(generations), in_situ_mean, color='#22c55e', linewidth=2, label='In situ (adapting)')
ax1.plot(range(generations), ex_situ_mean, color='#ef4444', linewidth=2, label='Ex situ (frozen)')

ax1.fill_between(range(generations),
                  np.array(in_situ_mean) - np.sqrt(in_situ_var),
                  np.array(in_situ_mean) + np.sqrt(in_situ_var),
                  alpha=0.1, color='#22c55e')

ax1.set_xlabel('Generation', color='white')
ax1.set_ylabel('Trait value', color='white')
ax1.set_title('Adaptation Tracking: In Situ vs Ex Situ', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Fitness comparison
ax2.set_facecolor('#111827')
ax2.plot(range(generations), in_situ_fitness, color='#22c55e', linewidth=2, label='In situ fitness')
ax2.plot(range(generations), ex_situ_fitness, color='#ef4444', linewidth=2, label='Ex situ fitness')

# Combined strategy: use in situ primarily, ex situ as backup
combined_fitness = np.maximum(in_situ_fitness, ex_situ_fitness)
ax2.plot(range(generations), combined_fitness, color='#a855f7', linewidth=2, linestyle='--', label='Combined (best of both)')

ax2.set_xlabel('Generation', color='white')
ax2.set_ylabel('Population fitness', color='white')
ax2.set_title('Fitness Over Time: Why Both Strategies Matter', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 1.1)

plt.tight_layout()
plt.show()

print("Conservation strategy comparison:")
print(f"  In situ final fitness: {in_situ_fitness[-1]:.3f} (tracks environment)")
print(f"  Ex situ final fitness: {ex_situ_fitness[-1]:.3f} (falls behind)")
print()
print("But ex situ has advantages:")
print("  - Immune to local catastrophe (war, deforestation)")
print("  - Preserves alleles that might be lost to drift in situ")
print("  - Can be shipped globally when needed")
print()
print("Best strategy: BOTH. In situ for adaptation, ex situ for insurance.")`,
      challenge: 'Add a catastrophe at generation 50: the in situ population is destroyed. It must be restored from ex situ seeds. How far behind is the restored population? How many generations does it take to catch up?',
      successHint: 'The ex situ vs. in situ debate is resolved: both are essential. The Seed Keeper\'s living collection and Svalbard\'s frozen vault are not competitors — they\'re complementary halves of a complete conservation strategy.',
    },
    {
      title: 'Genomic databases — digital libraries of DNA',
      concept: `Modern conservation genetics is powered by massive genomic databases:

- **GenBank** (NCBI): 250+ million DNA sequences from 500,000+ species
- **Ensembl Plants**: complete genomes for 100+ plant species
- **Rice Genome Annotation Project**: the complete, annotated rice genome (430 Mb)
- **SNPdb**: single nucleotide polymorphisms for mapping genetic variation
- **GrainGenes**: genome data for wheat, barley, oats, rye

What genomics enables:
- **Genome-Wide Association Studies (GWAS)**: scan entire genomes to find genes controlling traits (e.g., drought tolerance)
- **Marker-Assisted Selection (MAS)**: select plants based on DNA markers, not just appearance
- **Genomic prediction**: predict a plant's traits from its DNA before it's even grown
- **Conservation genomics**: assess genetic health of populations from DNA data

The rice genome has ~37,000 genes across 12 chromosomes. By comparing DNA across thousands of varieties, we can identify which genes control which traits — and which traditional varieties carry the most valuable alleles.`,
      analogy: 'Genomic databases are like Google Maps for DNA. Just as Google Maps lets you zoom from global view to street level, genomic databases let you zoom from whole-genome comparisons to individual base pairs. And just as Google Maps enables navigation (finding routes), genomic databases enable breeding (finding the shortest path to a desired combination of traits).',
      storyConnection: 'If the Seed Keeper\'s rice varieties were genomically sequenced and uploaded to GenBank, breeders worldwide could search for valuable alleles in her collection. A drought tolerance gene in her Nagaland landrace could end up improving rice varieties grown in sub-Saharan Africa. Genomic databases make local diversity globally accessible.',
      checkQuestion: 'The rice genome is 430 million base pairs. How many bytes of storage does that require? How does it compare to a typical smartphone photo?',
      checkAnswer: 'Each base pair can be stored in 2 bits (4 possibilities: A, T, C, G). So 430 Mb × 2 bits = 860 million bits = ~107 MB. A typical smartphone photo is 3-5 MB. So a complete rice genome takes about the same storage as 20-30 photos. The entire GenBank database (250+ million sequences) is about 1 TB — smaller than a modern hard drive.',
      codeIntro: 'Simulate a genome-wide association study (GWAS) to find trait-controlling genes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a GWAS for drought tolerance
n_plants = 200
n_snps = 500  # SNP markers across the genome

# Generate random genotypes (0, 1, 2 = number of alt alleles)
genotypes = np.random.choice([0, 1, 2], size=(n_plants, n_snps),
                              p=[0.25, 0.5, 0.25])

# True causal SNPs (5 of 500 actually affect drought tolerance)
causal_snps = [42, 137, 251, 389, 467]
effects = [0.8, 0.5, -0.3, 0.6, 0.4]  # effect sizes

# Generate phenotype (drought tolerance score)
phenotype = np.random.normal(5, 1, n_plants)  # baseline
for snp, effect in zip(causal_snps, effects):
    phenotype += genotypes[:, snp] * effect

# Run GWAS: test association at each SNP
p_values = []
for snp in range(n_snps):
    # Simple linear regression: correlation between genotype and phenotype
    geno = genotypes[:, snp]
    correlation = np.corrcoef(geno, phenotype)[0, 1]
    # Convert to t-statistic and p-value (approximation)
    t_stat = correlation * np.sqrt(n_plants - 2) / np.sqrt(1 - correlation**2 + 1e-10)
    # Approximate p-value from t-distribution (using normal approximation)
    p_val = 2 * np.exp(-0.5 * t_stat**2) / np.sqrt(2 * np.pi)
    p_values.append(max(p_val, 1e-20))

neg_log_p = -np.log10(p_values)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Manhattan plot
ax1.set_facecolor('#111827')

# Color by chromosome (5 chromosomes of 100 SNPs each)
chrom_colors = ['#22c55e', '#3b82f6', '#22c55e', '#3b82f6', '#22c55e']
for chrom in range(5):
    start, end = chrom * 100, (chrom + 1) * 100
    snp_pos = range(start, end)
    colors_snp = [chrom_colors[chrom]] * 100
    ax1.scatter(snp_pos, neg_log_p[start:end], c=colors_snp, s=15, alpha=0.5)

# Highlight causal SNPs
for snp in causal_snps:
    ax1.scatter(snp, neg_log_p[snp], c='#ef4444', s=80, zorder=5, edgecolors='white', linewidths=1)

# Significance threshold (Bonferroni corrected)
threshold = -np.log10(0.05 / n_snps)
ax1.axhline(threshold, color='#f59e0b', linestyle='--', linewidth=1, label=f'Significance threshold (-log₁₀(0.05/{n_snps}))')

ax1.set_xlabel('SNP position', color='white')
ax1.set_ylabel('-log₁₀(p-value)', color='white')
ax1.set_title('GWAS Manhattan Plot — Finding Drought Tolerance Genes', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Effect size plot for significant hits
ax2.set_facecolor('#111827')
significant = [(snp, neg_log_p[snp]) for snp in range(n_snps) if neg_log_p[snp] > threshold]
if significant:
    sig_positions = [s[0] for s in significant]
    sig_scores = [s[1] for s in significant]
    is_causal = [pos in causal_snps for pos in sig_positions]
    colors_sig = ['#ef4444' if c else '#f59e0b' for c in is_causal]
    ax2.bar(range(len(sig_positions)), sig_scores, color=colors_sig, alpha=0.8)
    ax2.set_xticks(range(len(sig_positions)))
    ax2.set_xticklabels([f'SNP {p}' for p in sig_positions], rotation=45, color='white', fontsize=8)
    ax2.bar([], [], color='#ef4444', label='True causal SNP')
    ax2.bar([], [], color='#f59e0b', label='False positive')
    ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

ax2.set_ylabel('-log₁₀(p-value)', color='white')
ax2.set_title('Significant Hits', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

n_significant = sum(1 for p in neg_log_p if p > threshold)
n_true_positive = sum(1 for snp in causal_snps if neg_log_p[snp] > threshold)
print(f"GWAS results:")
print(f"  {n_snps} SNPs tested")
print(f"  {n_significant} significant hits (p < {0.05/n_snps:.1e})")
print(f"  {n_true_positive}/{len(causal_snps)} true causal SNPs detected")
print(f"  {n_significant - n_true_positive} false positives")
print()
print("GWAS enables precision conservation:")
print("  Identify which varieties carry drought tolerance alleles")
print("  Prioritize those varieties for seed bank preservation")
print("  Guide breeding programs to combine beneficial alleles")`,
      challenge: 'Increase the sample size from 200 to 1000 plants. How does this affect the number of true positives detected and false positives? Why does bigger sample size help?',
      successHint: 'Genomic databases and GWAS are transforming conservation from guesswork to precision. By connecting DNA sequences to traits, we can identify exactly which genes the Seed Keeper\'s varieties carry — and why preserving them matters for global food security.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Conservation Genetics — some biology and math experience helpful</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for population genetics simulations. Click to start.</p>
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