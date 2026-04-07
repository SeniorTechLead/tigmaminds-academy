import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MithunLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Quantitative trait loci — mapping complex traits to DNA',
      concept: `Body weight, milk yield, and horn length aren't controlled by single genes — they're **quantitative traits** influenced by many genes plus the environment. The DNA regions that influence these traits are called **Quantitative Trait Loci (QTL)**.

How QTL mapping works:
1. **Cross two extreme lines**: e.g., cross a large mithun with a small one
2. **Genotype the offspring**: use DNA markers (like SNPs) across the genome
3. **Phenotype the offspring**: measure the trait (e.g., body weight)
4. **Statistical association**: find DNA regions where marker genotype correlates with trait value

If offspring carrying allele A at a marker tend to weigh more than offspring with allele B, that marker is near a QTL for body weight.

Typical findings:
- Most quantitative traits are controlled by **10-100+ QTL**
- Each QTL explains a small fraction (1-10%) of trait variation
- Some QTL have large effects ("major genes"), most have small effects
- QTL interact with each other (**epistasis**) and with the environment (G×E)

For mithun, QTL mapping could identify:
- Genes for body size (important for meat production)
- Genes for coat colour (cultural significance)
- Genes for disease resistance (critical for conservation)`,
      analogy: 'QTL mapping is like trying to find which members of a large orchestra are playing off-key. You can\'t just listen to the whole group (phenotype) — you need to isolate sections (chromosomes), then individual players (genes), to find which ones are contributing to the wrong note (trait variation).',
      storyConnection: 'The brave mithun was strong, large, and protective — all quantitative traits controlled by multiple genes. No single "bravery gene" made it exceptional. Rather, dozens of QTL for muscle mass, temperament, and alert behaviour combined to create the animal the story celebrates.',
      checkQuestion: 'Human height is ~80% heritable and influenced by thousands of genetic variants. Despite massive genome-wide studies, identified variants explain only ~20% of height variation. Where is the "missing heritability"?',
      checkAnswer: 'Several possibilities: (1) Many variants have effects too small to detect statistically (even with millions of subjects). (2) Rare variants (present in <1% of people) aren\'t captured by standard SNP arrays. (3) Epistatic interactions (gene-gene effects) are missed by single-SNP analysis. (4) Structural variants (duplications, deletions) are poorly measured. (5) Epigenetic effects. This "missing heritability" problem remains one of genetics\' biggest open questions.',
      codeIntro: 'Simulate QTL mapping: find which genomic regions affect body weight in a simulated mithun cross.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate QTL mapping experiment
# 20 chromosomal regions (markers), each may or may not be a QTL
n_markers = 20
n_offspring = 200

# True QTL: markers 3, 7, 12, 16 affect body weight
true_qtl = {3: 15, 7: 25, 12: 10, 16: 20}  # marker: effect size (kg)

# Generate marker genotypes (0 or 1 for each marker)
genotypes = np.random.binomial(1, 0.5, (n_offspring, n_markers))

# Generate phenotype (body weight)
base_weight = 600
genetic_value = np.zeros(n_offspring)
for marker, effect in true_qtl.items():
    genetic_value += genotypes[:, marker] * effect

# Add environmental noise
env_noise = np.random.normal(0, 40, n_offspring)
phenotype = base_weight + genetic_value + env_noise

# QTL mapping: test association at each marker
lod_scores = []
for m in range(n_markers):
    # Split offspring by genotype at this marker
    group0 = phenotype[genotypes[:, m] == 0]
    group1 = phenotype[genotypes[:, m] == 1]

    # t-test equivalent (LOD score approximation)
    mean_diff = abs(np.mean(group1) - np.mean(group0))
    pooled_se = np.sqrt(np.var(group0)/len(group0) + np.var(group1)/len(group1))
    t_stat = mean_diff / pooled_se if pooled_se > 0 else 0
    lod = t_stat ** 2 / (2 * np.log(10))  # approximate LOD
    lod_scores.append(lod)

lod_scores = np.array(lod_scores)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Manhattan-style plot
ax1.set_facecolor('#111827')
colors = ['#22c55e' if m in true_qtl else '#3b82f6' for m in range(n_markers)]
ax1.bar(range(n_markers), lod_scores, color=colors, alpha=0.8)
ax1.axhline(3.0, color='#ef4444', linestyle='--', linewidth=2, label='Significance threshold (LOD=3)')
ax1.set_xlabel('Marker position', color='white')
ax1.set_ylabel('LOD score', color='white')
ax1.set_title('QTL Mapping: Which Markers Affect Body Weight?', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Mark true QTL
for m in true_qtl:
    if lod_scores[m] > 3:
        ax1.annotate(f'QTL (effect={true_qtl[m]}kg)', xy=(m, lod_scores[m]),
                    xytext=(m+1, lod_scores[m]+1), color='#f59e0b', fontsize=9,
                    arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Effect size at significant QTL
ax2.set_facecolor('#111827')
significant = [m for m in range(n_markers) if lod_scores[m] > 3]
for m in significant:
    g0 = phenotype[genotypes[:, m] == 0]
    g1 = phenotype[genotypes[:, m] == 1]
    positions = [m * 3, m * 3 + 1]
    bp = ax2.boxplot([g0, g1], positions=positions, widths=0.8,
                      patch_artist=True, manage_ticks=False)
    for patch, color in zip(bp['boxes'], ['#3b82f6', '#22c55e']):
        patch.set_facecolor(color)
        patch.set_alpha(0.6)
    for element in ['whiskers', 'caps', 'medians']:
        for line in bp[element]:
            line.set_color('white')
    ax2.text(m * 3 + 0.5, 720, f'Marker {m}', ha='center', color='white', fontsize=9)

ax2.set_ylabel('Body weight (kg)', color='white')
ax2.set_title('Weight Distribution by Genotype at Significant QTL', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_xticks([])

plt.tight_layout()
plt.show()

detected = [m for m in range(n_markers) if lod_scores[m] > 3]
print(f"True QTL: markers {list(true_qtl.keys())}")
print(f"Detected QTL (LOD > 3): markers {detected}")
print(f"True positives: {len(set(detected) & set(true_qtl.keys()))}/{len(true_qtl)}")
false_pos = [m for m in detected if m not in true_qtl]
print(f"False positives: {len(false_pos)}")
print()
print("QTL mapping power depends on: sample size, effect size,")
print("and the amount of environmental noise.")`,
      challenge: 'Increase environmental noise from 40 to 80. How many QTL can you still detect? Then increase n_offspring from 200 to 1000. Does a larger sample size compensate for more noise?',
      successHint: 'QTL mapping transforms selective breeding from guesswork into science. Instead of judging an animal by its appearance alone, breeders can identify individuals carrying beneficial gene variants — even when the effect of each variant is small.',
    },
    {
      title: 'Heritability calculations — how much is genes vs environment?',
      concept: `**Heritability (h²)** answers a fundamental question: of all the variation we see in a trait, how much is due to genetic differences?

Two types of heritability:
- **Broad-sense (H²)**: proportion of total variance explained by ALL genetic factors (additive + dominance + epistasis)
- **Narrow-sense (h²)**: proportion explained by ADDITIVE genetic effects only (this is what determines response to selection)

How to estimate h²:
1. **Parent-offspring regression**: plot offspring value against parent value. The slope = h²
2. **Half-sibling analysis**: compare variation between and within families
3. **Twin studies** (humans): compare identical twins (share 100% genes) to fraternal twins (share 50%)
4. **Genomic estimation**: use DNA data directly (GBLUP, GREML methods)

For livestock like mithun:
- Body weight: h² ≈ 0.3-0.5
- Milk yield: h² ≈ 0.25-0.35
- Fertility: h² ≈ 0.05-0.10 (mostly environmental)
- Coat colour: h² ≈ 0.8-0.95 (strongly genetic)

The critical insight: **h² is specific to a population and environment**. A trait can be highly heritable in one population and not in another. It measures genetic variance relative to total variance — not the "genetic-ness" of a trait.`,
      analogy: 'Heritability is like asking "in a classroom, how much of the difference in test scores is due to natural ability vs. how much is due to who studied more?" If everyone studied the same amount (uniform environment), ALL differences would be "heritable." If everyone had identical ability (uniform genetics), ALL differences would be environmental. h² depends on the variation in BOTH.',
      storyConnection: 'The brave mithun was strong — but was that because of its genes or because it was well-fed? In the story, both matter: its lineage (genetics) and its village\'s care (environment). Heritability separates these two contributions mathematically.',
      checkQuestion: 'Height is ~80% heritable in well-nourished populations. In malnourished populations, it\'s ~40%. The genes haven\'t changed. Why did heritability change?',
      checkAnswer: 'Heritability measures the ratio of genetic variance to total variance. In well-nourished populations, environmental variance is low (everyone has adequate nutrition), so genetic differences dominate (h² is high). In malnourished populations, environmental variance is high (some are well-fed, some aren\'t), so environment explains more of the differences (h² drops). The genes are the same; the environmental noise changed.',
      codeIntro: 'Estimate heritability using parent-offspring regression with simulated mithun data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate parent-offspring data for body weight
n_families = 80
true_h2 = 0.45  # true heritability

# Parent generation: body weight
parent_mean = 650
parent_std = 80
parent_weights = np.random.normal(parent_mean, parent_std, n_families)

# Offspring weights: determined by genetics (h2) + environment (1-h2)
genetic_component = true_h2 * (parent_weights - parent_mean)
env_component = np.random.normal(0, parent_std * np.sqrt(1 - true_h2), n_families)
offspring_weights = parent_mean + genetic_component + env_component

# Estimate h2 from regression
from numpy.polynomial.polynomial import polyfit
slope_coeffs = np.polyfit(parent_weights, offspring_weights, 1)
estimated_h2 = slope_coeffs[0]
intercept = slope_coeffs[1]

# Midparent (average of both parents) method
midparent = parent_weights  # simplified (using single parent)
regression_line = np.polyval(slope_coeffs, parent_weights)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Parent-offspring regression
ax1.set_facecolor('#111827')
ax1.scatter(parent_weights, offspring_weights, color='#3b82f6', alpha=0.6, s=50)
sort_idx = np.argsort(parent_weights)
ax1.plot(parent_weights[sort_idx], regression_line[sort_idx], color='#ef4444', linewidth=2.5,
         label=f'Slope (h²) = {estimated_h2:.3f}')
ax1.axhline(parent_mean, color='gray', linestyle=':', alpha=0.3)
ax1.axvline(parent_mean, color='gray', linestyle=':', alpha=0.3)
ax1.set_xlabel('Parent weight (kg)', color='white')
ax1.set_ylabel('Offspring weight (kg)', color='white')
ax1.set_title('Parent-Offspring Regression', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=11)
ax1.tick_params(colors='gray')

# Heritability for different traits
ax2.set_facecolor('#111827')
traits = ['Coat colour', 'Body weight', 'Horn length', 'Growth rate', 'Milk yield', 'Fertility']
h2_values = [0.90, 0.45, 0.55, 0.35, 0.30, 0.08]
bar_colors = ['#22c55e' if h > 0.5 else '#f59e0b' if h > 0.2 else '#ef4444' for h in h2_values]

bars = ax2.barh(range(len(traits)), h2_values, color=bar_colors, alpha=0.8)
ax2.set_yticks(range(len(traits)))
ax2.set_yticklabels(traits, color='white')
ax2.set_xlabel('Heritability (h²)', color='white')
ax2.set_title('Heritability of Mithun Traits', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 1)

for bar, h2 in zip(bars, h2_values):
    ax2.text(bar.get_width() + 0.02, bar.get_y() + bar.get_height()/2,
             f'{h2:.2f}', va='center', color='white', fontsize=10)

# Color coding explanation
ax2.text(0.85, 5.5, 'High h²', color='#22c55e', fontsize=9, ha='center')
ax2.text(0.85, 4.5, 'Medium', color='#f59e0b', fontsize=9, ha='center')
ax2.text(0.85, 3.5, 'Low h²', color='#ef4444', fontsize=9, ha='center')

plt.tight_layout()
plt.show()

print(f"True heritability: {true_h2:.2f}")
print(f"Estimated from regression: {estimated_h2:.3f}")
print(f"Estimation error: {abs(estimated_h2 - true_h2):.3f}")
print()
print("Practical implications for breeding:")
print("  Coat colour (h²=0.90): easy to breed for, responds quickly")
print("  Body weight (h²=0.45): responds well but needs larger programs")
print("  Fertility (h²=0.08): very hard to breed for, mostly environmental")`,
      challenge: 'Reduce n_families from 80 to 15 and run 100 simulations. Plot the distribution of estimated h². How much does the estimate vary with small sample sizes? What sample size gives a reliable estimate (±0.05 of true value)?',
      successHint: 'Heritability is the single most important number in selective breeding. It determines how fast you can change a trait and therefore which traits are worth selecting for. Low-heritability traits are better improved through environment (nutrition, management) than breeding.',
    },
    {
      title: 'Breeding programs — designing the next generation',
      concept: `A **breeding program** is a systematic plan for improving a livestock population over multiple generations. It integrates genetics, statistics, and practical management.

Components of a modern breeding program:
1. **Breeding objective**: which traits to improve (e.g., growth rate, disease resistance)
2. **Selection criteria**: what to measure (phenotype, genotype, or both)
3. **Selection method**:
   - **Mass selection**: choose the best individuals based on their own performance
   - **Family selection**: choose the best families (average performance)
   - **BLUP (Best Linear Unbiased Prediction)**: statistical method that combines individual, family, and population data to estimate breeding values
4. **Mating design**: which animals to pair (avoid inbreeding, maximize genetic gain)
5. **Genetic evaluation**: rank all animals by their **Estimated Breeding Value (EBV)**

The breeding value equation:
**EBV = h² × (individual value - population mean)**

For the mithun, a breeding program could:
- Identify the genetically superior animals for growth
- Maintain diversity by tracking family lineages
- Introduce new genetics from other populations to prevent inbreeding
- Balance cultural preferences (coat colour) with production goals (body weight)`,
      analogy: 'A breeding program is like drafting a sports team. You don\'t just pick the best current players (mass selection) — you also consider their parents\' and siblings\' track records (family selection), use statistics to predict future performance (BLUP), avoid loading the team from one family (inbreeding avoidance), and balance different positions/skills (multiple trait selection).',
      storyConnection: 'The Arunachal communities that kept mithun were running breeding programs for millennia — selecting the largest, calmest, and most beautifully coloured animals. They didn\'t use BLUP software, but their traditional knowledge of lineages and trait inheritance was a sophisticated form of genetic management.',
      checkQuestion: 'BLUP was invented in 1949 by Charles Henderson and revolutionized livestock breeding. Why is BLUP better than simply choosing the biggest animal?',
      checkAnswer: 'The biggest animal might be big because of good nutrition (environment), not good genes. BLUP separates genetic from environmental effects by using information from relatives. If an animal\'s parents and siblings were also large, it\'s more likely to be genetically large. BLUP also accounts for herd, year, and management effects — giving a "fair" comparison across different conditions.',
      codeIntro: 'Simulate a breeding program comparing mass selection vs BLUP over 10 generations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Breeding program simulation
n_animals = 100
n_generations = 10
h2 = 0.4

def simulate_breeding(method='mass', n_gen=10):
    """Simulate breeding program with different selection methods"""
    # Initial population
    genetic_values = np.random.normal(0, 20, n_animals)
    env_values = np.random.normal(0, 20 * np.sqrt((1-h2)/h2), n_animals)
    phenotypes = 600 + genetic_values + env_values

    means = [np.mean(phenotypes)]
    genetic_means = [np.mean(genetic_values)]
    inbreeding = [0]

    parents_history = []  # track diversity

    for gen in range(n_gen):
        if method == 'mass':
            # Select top 20% by phenotype
            n_sel = 20
            selected = np.argsort(phenotypes)[-n_sel:]
        elif method == 'blup':
            # BLUP: estimate breeding value using phenotype + family info
            # Simplified: EBV = h2 * (phenotype - mean)
            pop_mean = np.mean(phenotypes)
            ebv = h2 * (phenotypes - pop_mean)
            selected = np.argsort(ebv)[-20:]
        elif method == 'random':
            selected = np.random.choice(n_animals, 20, replace=False)

        parents_history.append(len(set(selected)))

        # Create next generation
        parent_pairs = np.random.choice(selected, (n_animals, 2), replace=True)

        # Offspring genetic value: average of parents + Mendelian sampling
        new_genetic = (genetic_values[parent_pairs[:, 0]] + genetic_values[parent_pairs[:, 1]]) / 2
        new_genetic += np.random.normal(0, 10, n_animals)  # Mendelian sampling

        # New environment
        new_env = np.random.normal(0, 20 * np.sqrt((1-h2)/h2), n_animals)

        genetic_values = new_genetic
        env_values = new_env
        phenotypes = 600 + genetic_values + env_values

        means.append(np.mean(phenotypes))
        genetic_means.append(np.mean(genetic_values))

        # Approximate inbreeding (proportion of repeated parents)
        unique_parents = len(set(parent_pairs.flatten()))
        inbreeding.append(1 - unique_parents / (2 * n_animals))

    return means, genetic_means, inbreeding

# Run all three methods
results = {}
for method in ['random', 'mass', 'blup']:
    results[method] = simulate_breeding(method, n_generations)

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Phenotypic mean
ax = axes[0]
ax.set_facecolor('#111827')
colors = {'random': '#ef4444', 'mass': '#f59e0b', 'blup': '#22c55e'}
labels = {'random': 'Random (control)', 'mass': 'Mass selection', 'blup': 'BLUP selection'}
for method in ['random', 'mass', 'blup']:
    ax.plot(range(n_generations + 1), results[method][0], 'o-',
            color=colors[method], linewidth=2, markersize=4, label=labels[method])
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean body weight (kg)', color='white')
ax.set_title('Phenotypic Progress', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# Genetic progress (true breeding value)
ax = axes[1]
ax.set_facecolor('#111827')
for method in ['random', 'mass', 'blup']:
    ax.plot(range(n_generations + 1), results[method][1], 'o-',
            color=colors[method], linewidth=2, markersize=4, label=labels[method])
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean genetic value', color='white')
ax.set_title('Genetic Progress (True Breeding Value)', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# Inbreeding
ax = axes[2]
ax.set_facecolor('#111827')
for method in ['random', 'mass', 'blup']:
    ax.plot(range(n_generations + 1), results[method][2], 'o-',
            color=colors[method], linewidth=2, markersize=4, label=labels[method])
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Inbreeding coefficient', color='white')
ax.set_title('Inbreeding Accumulation', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

for method in ['random', 'mass', 'blup']:
    gain = results[method][0][-1] - results[method][0][0]
    gen_gain = results[method][1][-1] - results[method][1][0]
    print(f"{labels[method]}:")
    print(f"  Phenotypic gain: {gain:.1f} kg over {n_generations} generations")
    print(f"  Genetic gain: {gen_gain:.1f} units")
    print(f"  Final inbreeding: {results[method][2][-1]:.3f}")`,
      challenge: 'Add a constraint: no two offspring can have the same pair of parents (minimum contribution = limit the use of any one parent to 10% of matings). How does this change genetic gain AND inbreeding? This is called "optimum contribution selection."',
      successHint: 'BLUP revolutionized animal breeding because it separates genetic signal from environmental noise. Every dairy cow, beef bull, and pig in commercial agriculture today is evaluated using BLUP or its genomic extensions.',
    },
    {
      title: 'Genetic bottlenecks from domestication — the diversity we lost',
      concept: `Every domestication event starts with a small number of wild animals — the **founder population**. This creates a **genetic bottleneck**: the domestic population contains only a fraction of the wild species' genetic diversity.

The bottleneck effect:
- Wild gaur: ~100,000 individuals, maximum genetic diversity
- Mithun founders: perhaps 50-200 individuals captured/tamed over centuries
- Modern mithun: ~3 million, but descended from those few founders
- Result: mithun have much less genetic diversity than gaur

Consequences of reduced diversity:
- **Inbreeding depression**: reduced fitness due to homozygosity of harmful recessive alleles
- **Disease vulnerability**: fewer immune gene variants means less resistance to new pathogens
- **Reduced adaptability**: less raw material for natural selection to work with
- **Genetic disorders**: harmful mutations become common through founder effects

Real examples:
- **Cheetahs**: bottleneck ~10,000 years ago reduced diversity so much that skin grafts between unrelated cheetahs aren't rejected (their immune systems are too similar)
- **Holstein cattle**: the "effective population size" is estimated at just ~100 animals (despite millions of living cattle) because a few elite bulls sired most of the population
- **Mithun**: genetic studies show moderate diversity loss compared to gaur, but better than most domestic cattle (because semi-wild management preserves some natural selection)`,
      analogy: 'A genetic bottleneck is like a library fire. Even if you rebuild the library to its original size, the rebuilt collection only contains copies of the books that survived the fire. If only 100 of 10,000 original titles survived, the "new" library looks large but is genetically impoverished. The titles (gene variants) that burned are gone forever.',
      storyConnection: 'The brave mithun carried genes from a small founder population that was separated from the wild gaur thousands of years ago. Its strength and bravery were impressive — but genetically, it represented only a fraction of the diversity that its wild ancestors had.',
      checkQuestion: 'If we wanted to increase the mithun\'s genetic diversity, could we crossbreed it with wild gaur?',
      checkAnswer: 'Yes — and it\'s been observed naturally. Mithun and gaur can interbreed and produce fertile offspring (they\'re closely related species). Strategic crossbreeding could reintroduce lost genetic variants from the gaur gene pool into mithun populations. This is called "genetic rescue." However, it must be done carefully to avoid diluting the mithun\'s adapted traits (tameness, human tolerance). Some Arunachal communities already manage occasional gaur-mithun crosses.',
      codeIntro: 'Simulate a genetic bottleneck and track diversity loss across generations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate genetic bottleneck
# Track allelic diversity (unique alleles at a locus)

n_loci = 50  # independent genetic markers
initial_pop_size = 1000  # wild population
bottleneck_sizes = [500, 100, 50, 20, 10]  # different severity

def simulate_bottleneck(n_wild, n_bottleneck, n_loci, n_recovery_gens=50):
    """Track allelic diversity through bottleneck and recovery"""
    # Wild population: each locus has many alleles (uniform random)
    max_alleles = 20
    wild_pop = np.random.randint(0, max_alleles, (n_wild, n_loci, 2))  # diploid

    # Measure initial diversity: count unique alleles per locus
    initial_diversity = []
    for l in range(n_loci):
        unique = len(set(wild_pop[:, l, :].flatten()))
        initial_diversity.append(unique)
    initial_mean = np.mean(initial_diversity)

    # Bottleneck: random sample
    survivors = wild_pop[np.random.choice(n_wild, n_bottleneck, replace=False)]

    # Track diversity over recovery generations
    diversity_over_time = []
    pop = survivors.copy()

    for gen in range(n_recovery_gens):
        # Measure diversity
        gen_diversity = []
        for l in range(n_loci):
            unique = len(set(pop[:, l, :].flatten()))
            gen_diversity.append(unique)
        diversity_over_time.append(np.mean(gen_diversity))

        # Reproduce: random mating back to original size
        n_current = len(pop)
        n_offspring = max(n_current, 200)  # recover population size
        parents = np.random.choice(n_current, (n_offspring, 2), replace=True)
        offspring = np.zeros((n_offspring, n_loci, 2), dtype=int)
        for l in range(n_loci):
            # Each parent contributes one allele
            offspring[:, l, 0] = pop[parents[:, 0], l, np.random.randint(0, 2, n_offspring)]
            offspring[:, l, 1] = pop[parents[:, 1], l, np.random.randint(0, 2, n_offspring)]
        pop = offspring

    return initial_mean, diversity_over_time

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Diversity over time for different bottleneck sizes
ax1.set_facecolor('#111827')
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7']

for bn_size, color in zip(bottleneck_sizes, colors):
    initial, diversity = simulate_bottleneck(initial_pop_size, bn_size, n_loci)
    ax1.plot(range(len(diversity)), diversity, linewidth=2, color=color,
             label=f'Bottleneck = {bn_size}')

ax1.axhline(initial, color='white', linestyle='--', linewidth=1, label=f'Wild diversity ({initial:.1f})')
ax1.set_xlabel('Generations after bottleneck', color='white')
ax1.set_ylabel('Mean alleles per locus', color='white')
ax1.set_title('Genetic Diversity After Bottleneck', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Diversity loss as function of bottleneck size
ax2.set_facecolor('#111827')
sizes = np.arange(5, 505, 5)
diversity_retained = []
for s in sizes:
    init, div = simulate_bottleneck(initial_pop_size, s, n_loci, n_recovery_gens=5)
    diversity_retained.append(div[-1] / init * 100)

ax2.plot(sizes, diversity_retained, color='#3b82f6', linewidth=2.5)
ax2.fill_between(sizes, diversity_retained, alpha=0.15, color='#3b82f6')
ax2.axhline(90, color='#22c55e', linestyle='--', alpha=0.5, label='90% retention threshold')
ax2.axhline(50, color='#ef4444', linestyle='--', alpha=0.5, label='50% (critical loss)')

# Mark mithun estimated bottleneck
ax2.axvline(100, color='#f59e0b', linestyle=':', linewidth=2)
ax2.text(110, 40, 'Estimated mithun\\nfounder size', color='#f59e0b', fontsize=10)

ax2.set_xlabel('Bottleneck population size', color='white')
ax2.set_ylabel('Diversity retained (%)', color='white')
ax2.set_title('Diversity Retention vs Bottleneck Severity', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key finding: lost alleles don't come back!")
print("Even after population recovery, diversity remains reduced.")
print("A bottleneck of 20 animals loses ~50% of genetic diversity permanently.")
print()
print("This is why conservation genetics focuses on MAINTAINING")
print("population size — not just recovering it after a crash.")`,
      challenge: 'Simulate "genetic rescue": after a bottleneck of 20, introduce 5 wild individuals every 10 generations. How much diversity does this recover compared to no rescue?',
      successHint: 'Genetic bottlenecks are one of the most important concepts in conservation biology. Every endangered species, every rare breed, and every domestic animal carries the scar of past bottlenecks. Understanding them is essential for preventing irreversible diversity loss.',
    },
    {
      title: 'Genomic selection — breeding in the DNA era',
      concept: `Traditional selective breeding judges animals by appearance and pedigree. **Genomic selection** judges them by their actual DNA — using thousands of genetic markers to predict an animal's breeding value before it even reaches maturity.

How genomic selection works:
1. **Genotype + phenotype a reference population**: measure traits and DNA markers in hundreds of animals
2. **Build a prediction model**: find statistical associations between markers and traits (like QTL mapping but genome-wide)
3. **Predict new animals**: genotype a young animal and use the model to estimate its breeding value (GEBV = Genomic Estimated Breeding Value)
4. **Select based on GEBV**: choose the best animals genetically, even as calves

Advantages over traditional methods:
- **Speed**: select at birth instead of waiting years for trait measurement
- **Accuracy**: better than pedigree-based prediction (captures Mendelian sampling)
- **Cost**: DNA test costs have dropped from $50,000 (2001) to $50 (2024)
- **New traits**: can select for traits that are expensive to measure (disease resistance, feed efficiency)

For mithun, genomic selection could:
- Identify genetically superior animals without disrupting semi-wild management
- Select for disease resistance without deliberate pathogen exposure
- Monitor genetic diversity in real-time
- Track hybridization with gaur (management tool)`,
      analogy: 'Traditional breeding is like hiring employees based on their resume and an interview. Genomic selection is like giving them a detailed skills assessment test. The resume (pedigree) tells you about their family. The interview (phenotype) shows their current ability. The DNA test (genotype) reveals their underlying potential — including skills they haven\'t had the chance to demonstrate yet.',
      storyConnection: 'The brave mithun in the story proved its worth through action (phenotype). With genomic selection, we could have identified its potential from birth — reading its DNA like a book that says "this one carries alleles for large body size, calm temperament, and disease resistance." The story would be written in the genome before the animal lived it.',
      checkQuestion: 'In dairy cattle, genomic selection has doubled the rate of genetic improvement since 2009. But it has also doubled the rate of inbreeding. Why?',
      checkAnswer: 'Genomic selection identifies the "best" animals more accurately, so breeders use fewer elite animals more intensively. When a bull is identified as genetically superior at age 1 (instead of age 5), he starts producing semen earlier and sires more offspring. The result: faster genetic gain but also faster accumulation of shared ancestry. Managing this trade-off (genetic gain vs. diversity) is the central challenge of modern breeding.',
      codeIntro: 'Simulate genomic selection: build a prediction model and compare accuracy to traditional selection.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Genomic selection simulation
n_markers = 500  # SNP markers
n_qtl = 20       # true causal markers (subset)
n_reference = 200  # reference population (genotyped + phenotyped)
n_candidates = 100 # young animals to rank

# True QTL effects
qtl_positions = np.random.choice(n_markers, n_qtl, replace=False)
qtl_effects = np.random.normal(0, 5, n_qtl)

# Generate genotypes (0, 1, or 2 copies of allele)
ref_genotypes = np.random.binomial(2, 0.5, (n_reference, n_markers))
cand_genotypes = np.random.binomial(2, 0.5, (n_candidates, n_markers))

# True genetic values
ref_true_gv = ref_genotypes[:, qtl_positions] @ qtl_effects
cand_true_gv = cand_genotypes[:, qtl_positions] @ qtl_effects

# Phenotypes (genetic + environmental noise)
h2 = 0.4
env_std = np.std(ref_true_gv) * np.sqrt((1-h2)/h2)
ref_phenotypes = 600 + ref_true_gv + np.random.normal(0, env_std, n_reference)

# METHOD 1: Mass selection (use own phenotype)
# For candidates, we'd need their phenotype — assume we have it for comparison
cand_phenotypes = 600 + cand_true_gv + np.random.normal(0, env_std, n_candidates)

# METHOD 2: Genomic selection (ridge regression on reference, predict candidates)
# Simplified: use all markers with shrinkage
lambda_reg = n_markers / (h2 / (1-h2))  # regularization
XtX = ref_genotypes.T @ ref_genotypes + lambda_reg * np.eye(n_markers)
Xty = ref_genotypes.T @ (ref_phenotypes - 600)
marker_effects = np.linalg.solve(XtX, Xty)

# GEBV for candidates
cand_gebv = cand_genotypes @ marker_effects

# Correlations (accuracy)
mass_accuracy = np.corrcoef(cand_phenotypes, cand_true_gv)[0, 1]
genomic_accuracy = np.corrcoef(cand_gebv, cand_true_gv)[0, 1]

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Mass selection accuracy
ax = axes[0]
ax.set_facecolor('#111827')
ax.scatter(cand_true_gv, cand_phenotypes - 600, color='#f59e0b', alpha=0.6, s=40)
z = np.polyfit(cand_true_gv, cand_phenotypes - 600, 1)
ax.plot(np.sort(cand_true_gv), np.polyval(z, np.sort(cand_true_gv)), color='#ef4444', linewidth=2)
ax.set_xlabel('True genetic value', color='white')
ax.set_ylabel('Phenotype (deviation)', color='white')
ax.set_title(f'Mass Selection (r = {mass_accuracy:.2f})', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Genomic selection accuracy
ax = axes[1]
ax.set_facecolor('#111827')
ax.scatter(cand_true_gv, cand_gebv, color='#3b82f6', alpha=0.6, s=40)
z = np.polyfit(cand_true_gv, cand_gebv, 1)
ax.plot(np.sort(cand_true_gv), np.polyval(z, np.sort(cand_true_gv)), color='#ef4444', linewidth=2)
ax.set_xlabel('True genetic value', color='white')
ax.set_ylabel('GEBV', color='white')
ax.set_title(f'Genomic Selection (r = {genomic_accuracy:.2f})', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Genetic gain comparison
ax = axes[2]
ax.set_facecolor('#111827')

# Select top 20% by each method
n_sel = 20
mass_selected = np.argsort(cand_phenotypes)[-n_sel:]
genomic_selected = np.argsort(cand_gebv)[-n_sel:]
random_selected = np.random.choice(n_candidates, n_sel, replace=False)

gains = {
    'Random': np.mean(cand_true_gv[random_selected]),
    'Mass\nselection': np.mean(cand_true_gv[mass_selected]),
    'Genomic\nselection': np.mean(cand_true_gv[genomic_selected]),
}
bar_colors = ['#ef4444', '#f59e0b', '#22c55e']
bars = ax.bar(range(3), list(gains.values()), color=bar_colors, alpha=0.8)
ax.set_xticks(range(3))
ax.set_xticklabels(list(gains.keys()), color='gray')
ax.set_ylabel('Mean true genetic value of selected', color='white')
ax.set_title('Genetic Gain by Method', color='white', fontsize=12)
ax.tick_params(colors='gray')

for bar, val in zip(bars, gains.values()):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            f'{val:.1f}', ha='center', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"Selection accuracy:")
print(f"  Mass selection: r = {mass_accuracy:.3f}")
print(f"  Genomic selection: r = {genomic_accuracy:.3f}")
print(f"  Improvement: {(genomic_accuracy/mass_accuracy - 1)*100:.0f}%")
print()
print(f"Genetic gain (mean true value of selected top 20%):")
for method, gain in gains.items():
    print(f"  {method.replace(chr(10), ' ')}: {gain:.1f}")`,
      challenge: 'Reduce the reference population from 200 to 50. How much does genomic accuracy drop? Then increase it to 1000. What\'s the relationship between reference size and prediction accuracy?',
      successHint: 'Genomic selection is transforming livestock breeding worldwide. For mithun conservation, it offers a way to manage genetic diversity and select for health traits without disrupting the semi-wild management system that makes mithun culturally and ecologically unique.',
    },
    {
      title: 'Conservation of heritage breeds — keeping diversity alive',
      concept: `Of the ~8,800 livestock breeds documented worldwide, ~26% are at risk of extinction. When a breed disappears, its unique genetic adaptations — disease resistance, heat tolerance, parasite resistance, cultural significance — are lost forever.

Why heritage breeds are disappearing:
- **Commercial dominance**: 5 dairy cattle breeds produce >90% of global milk. Local breeds can't compete on volume.
- **Crossbreeding**: crossing local breeds with commercial breeds (for quick productivity gains) dilutes the heritage genome
- **Urbanization**: young people leave farming; traditional knowledge dies with elders
- **Policy bias**: agricultural subsidies often favor commercial breeds

Why we must conserve them:
- **Climate adaptation**: heritage breeds carry adaptations to local conditions (heat, disease, poor forage)
- **Disease insurance**: diverse immune gene pools protect against new pathogens
- **Food sovereignty**: communities that depend on local breeds for cultural and economic life lose autonomy when breeds disappear
- **Unknown value**: we don't yet know what genes these breeds carry. Losing them is like burning an unread library

Conservation strategies:
- **In situ**: maintain living populations in their traditional environment (best for mithun)
- **Ex situ**: cryopreserve semen, embryos, or DNA in gene banks (backup)
- **Community-based**: empower local communities to maintain their own breeds (most sustainable)`,
      analogy: 'Heritage breeds are like heirloom seeds in a vault. You might not need them today — the commercial varieties work fine now. But when a new disease or climate shift makes the commercial varieties fail, those heirloom varieties might be the only ones that survive. You can\'t wait until the crisis to start collecting — by then, they\'re already gone.',
      storyConnection: 'The brave mithun of Arunachal represents a heritage breed — culturally embedded, locally adapted, and irreplaceable. If mithun were replaced by commercial cattle (as has happened in parts of Myanmar), the genes that make mithun uniquely adapted to the hills of Northeast India would be lost. The story is not just about one brave animal — it\'s about preserving an entire lineage.',
      checkQuestion: 'India has ~43 recognized cattle breeds but ~190 million cattle. Most are non-descript crossbreeds. Is this a problem?',
      checkAnswer: 'Yes. Non-descript crossbreeds are the result of unmanaged crossbreeding with exotic breeds (Holstein, Jersey). They produce more milk per animal but are poorly adapted to Indian conditions (heat, disease, poor forage). Meanwhile, pure Indian breeds like Gir, Sahiwal, and Ongole — which carry thousands of years of adaptation — are declining. India is losing irreplaceable genetic resources in exchange for short-term milk gains.',
      codeIntro: 'Model the extinction risk of heritage breeds under different conservation scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Model: heritage breed population dynamics
# A breed goes extinct when population drops below minimum viable (~50)

years = np.arange(0, 101)
n_scenarios = 5

scenarios = {
    'No conservation': {'decline_rate': -0.05, 'color': '#ef4444'},
    'Gene bank only': {'decline_rate': -0.04, 'color': '#f59e0b'},
    'Subsidies for keepers': {'decline_rate': -0.01, 'color': '#3b82f6'},
    'Community-based program': {'decline_rate': 0.005, 'color': '#22c55e'},
    'Full integration (like mithun)': {'decline_rate': 0.015, 'color': '#a855f7'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Population trajectories
ax1.set_facecolor('#111827')
initial_pop = 500

for name, props in scenarios.items():
    pop = initial_pop * np.exp(props['decline_rate'] * years)
    pop = np.clip(pop, 0, 5000)
    ax1.plot(years, pop, linewidth=2.5, color=props['color'], label=name)

ax1.axhline(50, color='white', linestyle='--', alpha=0.5, label='Minimum viable (50)')
ax1.set_xlabel('Years from now', color='white')
ax1.set_ylabel('Population size', color='white')
ax1.set_title('Heritage Breed Population Under Different Strategies', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='upper right')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 2000)

# Global breed status
ax2.set_facecolor('#111827')
statuses = ['Not at risk', 'Vulnerable', 'Endangered', 'Critical', 'Extinct\n(since 2000)']
counts = [5720, 880, 740, 460, 1000]
status_colors = ['#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#6b7280']

bars = ax2.barh(range(len(statuses)), counts, color=status_colors, alpha=0.8)
ax2.set_yticks(range(len(statuses)))
ax2.set_yticklabels(statuses, color='white', fontsize=10)
ax2.set_xlabel('Number of breeds', color='white')
ax2.set_title('Global Livestock Breed Status (FAO)', color='white', fontsize=13)
ax2.tick_params(colors='gray')

for bar, count in zip(bars, counts):
    ax2.text(bar.get_width() + 30, bar.get_y() + bar.get_height()/2,
             f'{count:,}', va='center', color='white', fontsize=11)

total = sum(counts)
at_risk = sum(counts[1:4])
ax2.text(3000, 4, f'{at_risk/total*100:.0f}% at risk', color='#ef4444', fontsize=12, fontweight='bold')

plt.tight_layout()
plt.show()

print("Heritage breed conservation is a race against time:")
print(f"  {at_risk:,} breeds at risk out of {total:,} documented")
print(f"  ~{counts[4]:,} breeds have gone extinct since 2000")
print(f"  That's ~1 breed every 2 weeks")
print()
print("The mithun model (community-based, culturally integrated)")
print("shows that the most successful conservation happens when the")
print("community VALUES the breed — not just when scientists intervene.")
print()
print("From wild gaur to brave mithun, from QTL to genomic selection —")
print("the story of domestication is the story of human-animal partnership.")
print("Preserving heritage breeds preserves that partnership's legacy.")`,
      challenge: 'Add economic data: cost per year for each conservation strategy (gene bank: $50K, subsidies: $200K, community program: $100K, full integration: $20K). Calculate cost-effectiveness (years of survival per dollar). Which strategy wins?',
      successHint: 'Conservation of heritage breeds isn\'t just about preserving animals — it\'s about preserving the genetic toolkit that future generations will need to adapt agriculture to climate change, new diseases, and food sovereignty challenges. The mithun of Arunachal is a living example of what effective conservation looks like.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for agricultural genetics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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