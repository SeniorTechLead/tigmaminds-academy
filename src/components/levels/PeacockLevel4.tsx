import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PeacockLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Part 1: Defining the mate choice simulator — population and trait models',
      concept: `In this capstone project you will build a complete Mate Choice Simulator that models how sexual selection shapes a population of peacocks over many generations. The simulator combines everything from Level 3: thin-film optics (structural colour), honest signaling, game theory, fluctuating asymmetry, and multi-criteria decision making.

The first step is defining the population data model. Each male peacock has:
- **Genome**: a set of alleles controlling trait expression (eyespot potential, melanin layer thickness, metabolic efficiency)
- **Phenotype**: the observable traits produced by genome + environment (actual eyespot count, feather colour, display vigor, tail length, body mass)
- **Fitness proxy**: derived metrics like fluctuating asymmetry and display-to-cost ratio

Each female has:
- **Preference weights**: how much she values each male trait (these also evolve)
- **Sampling strategy**: how many males she evaluates (best-of-n)
- **Threshold vector**: minimum acceptable values for each trait

The population starts with random genetic variation and evolves over generations through differential reproduction. This first module builds the data structures and initialization.`,
      analogy: 'Building the simulator is like setting up a board game before playing. You need to define the pieces (males and females), the rules (selection, inheritance, mutation), the scoring system (fitness), and the board (environment). Get the setup wrong and the game makes no sense.',
      storyConnection: 'The peacock in our story is one individual in a vast population spanning generations. Our simulator will let you see his dance not as a single event but as one move in an evolutionary chess game that has been running for millions of years.',
      checkQuestion: 'Why do we model female preferences as evolvable traits rather than fixed constants?',
      checkAnswer: 'Because female preferences are themselves subject to selection. A female who prefers traits that correlate with genetic quality produces fitter offspring. Her preference genes spread. A female who prefers arbitrary traits wastes her choice. Preferences and male traits co-evolve — this is the Fisherian runaway or good-genes mechanism.',
      codeIntro: 'Build the population data model with genome, phenotype, and preference structures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class PeacockGenome:
    """Genetic blueprint for a peacock."""
    GENE_NAMES = ['eyespot_potential', 'melanin_thickness', 'metabolic_eff',
                  'symmetry_control', 'display_stamina', 'immune_strength']

    def __init__(self, alleles=None):
        if alleles is None:
            # Random initialization: each gene 0-1
            self.alleles = np.random.uniform(0.2, 0.8, len(self.GENE_NAMES))
        else:
            self.alleles = np.array(alleles)

    def mutate(self, rate=0.02):
        """Small gaussian mutations."""
        mutations = np.random.normal(0, rate, len(self.alleles))
        self.alleles = np.clip(self.alleles + mutations, 0.01, 0.99)
        return self

    @staticmethod
    def crossover(parent1, parent2):
        """Single-point crossover."""
        point = np.random.randint(1, len(parent1.alleles))
        child_alleles = np.concatenate([parent1.alleles[:point], parent2.alleles[point:]])
        return PeacockGenome(child_alleles)

class Male:
    """A male peacock with genome -> phenotype mapping."""
    def __init__(self, genome=None, environment_quality=1.0):
        self.genome = genome or PeacockGenome()
        self.env = environment_quality
        self.phenotype = self._develop()
        self.fa_score = self._compute_fa()

    def _develop(self):
        """Genome + environment -> phenotype (with developmental noise)."""
        g = self.genome.alleles
        noise = np.random.normal(0, 0.05 * (1 - g[3]), len(g))  # symmetry_control reduces noise

        return {
            'eyespots': int(np.clip(60 + 50 * g[0] * self.env + noise[0] * 20, 20, 120)),
            'colour_wavelength': 380 + 200 * g[1],  # nm, controls hue via melanin thickness
            'display_minutes': np.clip(5 + 20 * g[4] * g[2] * self.env + noise[4] * 3, 1, 30),
            'body_condition': np.clip(g[2] * g[5] * self.env + noise[2] * 0.1, 0.1, 1.0),
            'tail_length_cm': np.clip(80 + 60 * g[0] * g[2] + noise[0] * 10, 60, 170),
        }

    def _compute_fa(self):
        """Fluctuating asymmetry from developmental noise."""
        g = self.genome.alleles
        # Better symmetry_control and immune_strength = lower FA
        base_fa = 0.3 * (1 - g[3]) + 0.2 * (1 - g[5]) + 0.1 * (1 - self.env)
        return np.clip(base_fa + np.random.normal(0, 0.05), 0.01, 0.5)

class Female:
    """A female with evolvable mate preferences."""
    def __init__(self, preference_weights=None, thresholds=None):
        self.trait_names = ['eyespots', 'display_minutes', 'body_condition', 'tail_length_cm', 'fa_score']
        if preference_weights is None:
            self.weights = np.random.dirichlet(np.ones(5))  # random weights summing to 1
        else:
            self.weights = np.array(preference_weights)
        if thresholds is None:
            self.thresholds = np.array([40, 5, 0.3, 80, 0.4])  # min acceptable
        else:
            self.thresholds = np.array(thresholds)

    def evaluate(self, male):
        """Score a male using weighted multi-criteria model."""
        traits = np.array([
            male.phenotype['eyespots'] / 120,  # normalize to 0-1
            male.phenotype['display_minutes'] / 30,
            male.phenotype['body_condition'],
            male.phenotype['tail_length_cm'] / 170,
            1 - male.fa_score,  # invert: low FA is good
        ])

        # Threshold check
        raw = np.array([male.phenotype['eyespots'], male.phenotype['display_minutes'],
                       male.phenotype['body_condition'], male.phenotype['tail_length_cm'],
                       male.fa_score])
        if raw[0] < self.thresholds[0] or raw[1] < self.thresholds[1] or \
           raw[2] < self.thresholds[2] or raw[3] < self.thresholds[3] or \
           raw[4] > self.thresholds[4]:
            return -1  # rejected

        return np.dot(traits, self.weights)

    def mutate_preferences(self, rate=0.02):
        noise = np.random.normal(0, rate, len(self.weights))
        self.weights = np.clip(self.weights + noise, 0.01, 1)
        self.weights /= self.weights.sum()

# Initialize population
n_males = 100
n_females = 80

males = [Male() for _ in range(n_males)]
females = [Female() for _ in range(n_females)]

# Visualize initial population
fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Eyespot distribution
ax = axes[0, 0]
ax.set_facecolor('#111827')
eyespots = [m.phenotype['eyespots'] for m in males]
ax.hist(eyespots, bins=20, color='#22c55e', edgecolor='none')
ax.set_xlabel('Eyespot count', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title(f'Eyespots (mean={np.mean(eyespots):.0f})', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 2: Display duration vs body condition
ax = axes[0, 1]
ax.set_facecolor('#111827')
displays = [m.phenotype['display_minutes'] for m in males]
conditions = [m.phenotype['body_condition'] for m in males]
fas = [m.fa_score for m in males]
sc = ax.scatter(displays, conditions, c=fas, cmap='RdYlGn_r', s=20, alpha=0.7)
ax.set_xlabel('Display (minutes)', color='white')
ax.set_ylabel('Body condition', color='white')
ax.set_title('Display vs condition (color=FA)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(sc, ax=ax, label='FA')

# Plot 3: Genome heatmap
ax = axes[0, 2]
ax.set_facecolor('#111827')
genome_matrix = np.array([m.genome.alleles for m in males[:30]])
im = ax.imshow(genome_matrix.T, aspect='auto', cmap='viridis', vmin=0, vmax=1)
ax.set_xlabel('Male index', color='white')
ax.set_yticks(range(6))
ax.set_yticklabels([g[:10] for g in PeacockGenome.GENE_NAMES], fontsize=7, color='white')
ax.set_title('Genome values (first 30 males)', color='white', fontsize=11)
ax.tick_params(colors='gray')
plt.colorbar(im, ax=ax)

# Plot 4: Female preference weight distributions
ax = axes[1, 0]
ax.set_facecolor('#111827')
all_weights = np.array([f.weights for f in females])
bp = ax.boxplot([all_weights[:, i] for i in range(5)], patch_artist=True,
                labels=['Eyes', 'Display', 'Body', 'Tail', '1-FA'])
colors_box = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']
for patch, clr in zip(bp['boxes'], colors_box):
    patch.set_facecolor(clr)
    patch.set_alpha(0.6)
for element in ['whiskers', 'caps', 'medians']:
    for item in bp[element]:
        item.set_color('white')
ax.set_ylabel('Weight', color='white')
ax.set_title('Female preference weights', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 5: Male scores as seen by average female
ax = axes[1, 1]
ax.set_facecolor('#111827')
avg_female = Female(preference_weights=all_weights.mean(axis=0))
scores = [avg_female.evaluate(m) for m in males]
valid_scores = [s for s in scores if s > 0]
ax.hist(valid_scores, bins=20, color='#a855f7', edgecolor='none')
rejected = sum(1 for s in scores if s < 0)
ax.set_xlabel('Male attractiveness score', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title(f'Scores ({rejected} rejected by thresholds)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: FA distribution
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.hist(fas, bins=20, color='#ef4444', edgecolor='none', alpha=0.8)
ax.set_xlabel('Fluctuating Asymmetry', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title(f'FA distribution (mean={np.mean(fas):.3f})', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Population initialized:")
print(f"  {n_males} males, {n_females} females")
print(f"  Mean eyespots: {np.mean(eyespots):.0f} (range {min(eyespots)}-{max(eyespots)})")
print(f"  Mean display: {np.mean(displays):.1f} min")
print(f"  Mean FA: {np.mean(fas):.3f}")
print(f"  Males rejected by threshold: {rejected}/{n_males}")
print(f"  Genome genes: {PeacockGenome.GENE_NAMES}")`,
      challenge: 'Add an "environment" parameter that varies between generations (good years vs. drought years). How does environmental variation affect the heritability of phenotypic traits?',
      successHint: 'The data model is the foundation. Every decision here — which traits to model, how genotype maps to phenotype, what noise structure to use — determines what the simulator can and cannot teach you.',
    },
    {
      title: 'Capstone Part 2: Mating mechanics — female choice and male competition',
      concept: `With the population model defined, we now implement the mating process. Each breeding season follows a sequence:

1. **Male display**: Each male expends energy to display. Display quality depends on phenotype and remaining energy.
2. **Female sampling**: Each female observes a subset of males (best-of-n sampling). The sample size depends on her condition — healthier females can be pickier.
3. **Threshold screening**: Males below minimum trait thresholds are eliminated from consideration.
4. **Scoring and choice**: Remaining males are scored using the female's weighted preference model. She mates with the highest-scoring male in her sample.
5. **Male competition**: Males also compete for display sites. Higher-condition males get better positions, increasing their chance of being sampled.

The mating process introduces **sexual conflict**: males benefit from mating with as many females as possible, while females benefit from choosing the single best male. This asymmetry drives the evolutionary dynamics.

Importantly, mating success is **highly skewed**: a few top males mate with many females while most males mate with none. This skew is the engine of sexual selection — it creates intense selection pressure on male traits.`,
      analogy: 'The mating process is like a talent show with judges (females) who each see only a few contestants (best-of-n sampling). Each judge has different scoring criteria (preference weights) and a minimum standard (thresholds). The winners get to "reproduce" their act in the next season. Most contestants go home empty-handed.',
      storyConnection: 'The peacock in our story dances in a lek — an open arena where males display and females browse. The lek is the physical implementation of the mating algorithm: males position themselves, females walk among them evaluating, and the final choice is a computational process refined by millions of years of selection.',
      checkQuestion: 'If females could sample all males instead of just a subset (best-of-all), how would this change the intensity of sexual selection?',
      checkAnswer: 'Sexual selection would intensify dramatically. With best-of-all, every female would choose the single best male (or a tiny elite group). The mating skew would be extreme — one male could monopolize all matings. Best-of-n with small n introduces randomness that spreads matings more evenly, weakening selection. Sample size is a dial controlling selection intensity.',
      codeIntro: 'Implement the mating algorithm with female sampling, threshold screening, and weighted scoring.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class Genome:
    GENES = ['eyespot_pot', 'melanin', 'metabolic', 'symmetry', 'stamina', 'immune']
    def __init__(self, a=None):
        self.alleles = np.random.uniform(0.2, 0.8, 6) if a is None else np.array(a)
    def mutate(self, r=0.02):
        self.alleles = np.clip(self.alleles + np.random.normal(0, r, 6), 0.01, 0.99)
        return self
    @staticmethod
    def cross(p1, p2):
        pt = np.random.randint(1, 6)
        return Genome(np.concatenate([p1.alleles[:pt], p2.alleles[pt:]]))

class Male:
    def __init__(self, genome=None, env=1.0):
        self.genome = genome or Genome()
        g = self.genome.alleles
        noise = np.random.normal(0, 0.04 * (1 - g[3]), 6)
        self.eyespots = int(np.clip(60 + 50 * g[0] * env + noise[0] * 15, 20, 120))
        self.display = np.clip(5 + 20 * g[4] * g[2] * env + noise[4] * 3, 1, 30)
        self.condition = np.clip(g[2] * g[5] * env + noise[2] * 0.1, 0.1, 1.0)
        self.tail = np.clip(80 + 60 * g[0] * g[2] + noise[0] * 8, 60, 170)
        self.fa = np.clip(0.3 * (1-g[3]) + 0.2 * (1-g[5]) + np.random.normal(0, 0.04), 0.01, 0.5)

    def trait_vector(self):
        return np.array([self.eyespots/120, self.display/30, self.condition, self.tail/170, 1-self.fa])

class Female:
    def __init__(self, weights=None):
        self.weights = np.random.dirichlet(np.ones(5)) if weights is None else np.array(weights)
        self.thresholds = np.array([0.25, 0.2, 0.2, 0.4, 0.3])  # normalized

    def choose(self, males, sample_size=5):
        sample = np.random.choice(len(males), size=min(sample_size, len(males)), replace=False)
        best_score, best_idx = -1, -1
        for idx in sample:
            traits = males[idx].trait_vector()
            if np.any(traits < self.thresholds):
                continue
            score = np.dot(traits, self.weights)
            if score > best_score:
                best_score, best_idx = score, idx
        return best_idx  # -1 if none passed thresholds

    def mutate(self, r=0.02):
        self.weights = np.clip(self.weights + np.random.normal(0, r, 5), 0.01, 1)
        self.weights /= self.weights.sum()

def run_mating_season(males, females, sample_size=5):
    """Run one breeding season, return mating pairs."""
    matings = {}  # male_idx -> count
    pairs = []

    for fem in females:
        chosen = fem.choose(males, sample_size)
        if chosen >= 0:
            matings[chosen] = matings.get(chosen, 0) + 1
            pairs.append(chosen)

    return matings, pairs

# Create population
n_m, n_f = 100, 80
males = [Male() for _ in range(n_m)]
females = [Female() for _ in range(n_f)]

# Run mating for different sample sizes
fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

sample_sizes = [2, 5, 10, 20]
all_matings = {}

for ss in sample_sizes:
    matings, pairs = run_mating_season(males, females, ss)
    all_matings[ss] = matings

# Plot 1-4: Mating distribution for different sample sizes
for idx, ss in enumerate(sample_sizes):
    if idx >= 4: break
    ax = axes.flat[idx]
    ax.set_facecolor('#111827')
    matings = all_matings[ss]
    counts = sorted(matings.values(), reverse=True)
    n_mated = len(matings)
    ax.bar(range(len(counts)), counts, color='#22c55e', edgecolor='none')
    ax.set_xlabel('Male rank', color='white')
    ax.set_ylabel('Matings', color='white')
    ax.set_title(f'Sample={ss}: {n_mated} males mated of {n_m}', color='white', fontsize=10)
    ax.tick_params(colors='gray')

# Plot 5: Mating success vs trait quality
ax = axes[1, 0]
ax.set_facecolor('#111827')
matings_5, _ = run_mating_season(males, females, 5)
avg_fem = Female(np.mean([f.weights for f in females], axis=0))
male_scores = [np.dot(m.trait_vector(), avg_fem.weights) for m in males]
mate_counts = [matings_5.get(i, 0) for i in range(n_m)]
ax.scatter(male_scores, mate_counts, s=20, alpha=0.6, c='#f59e0b')
r = np.corrcoef(male_scores, mate_counts)[0, 1]
ax.set_xlabel('Male quality score', color='white')
ax.set_ylabel('Mating count', color='white')
ax.set_title(f'Quality predicts mating (r={r:.2f})', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 6: Selection differential
ax = axes[1, 2]
ax.set_facecolor('#111827')
mated_indices = list(matings_5.keys())
mated_traits = np.array([males[i].trait_vector() for i in mated_indices])
all_traits = np.array([m.trait_vector() for m in males])
trait_labels = ['Eyespots', 'Display', 'Body', 'Tail', '1-FA']
sel_diff = mated_traits.mean(axis=0) - all_traits.mean(axis=0)
colors_bar = ['#22c55e' if s > 0 else '#ef4444' for s in sel_diff]
ax.barh(range(5), sel_diff, color=colors_bar, height=0.6)
ax.set_yticks(range(5))
ax.set_yticklabels(trait_labels, color='white', fontsize=9)
ax.axvline(0, color='gray', linewidth=1)
ax.set_xlabel('Selection differential', color='white')
ax.set_title('Traits favored by mate choice', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Mating season results:")
for ss in sample_sizes:
    m = all_matings[ss]
    print(f"  Sample size {ss:>2}: {len(m)} males mated, top male got {max(m.values())} matings")
print(f"\\nSelection differential (mated - population mean):")
for name, sd in zip(trait_labels, sel_diff):
    print(f"  {name}: {sd:+.3f}")
print(f"\\nMating skew: {sum(1 for c in mate_counts if c == 0)} of {n_m} males got zero matings")`,
      challenge: 'Implement male-male competition for display positions: higher-condition males get positions that are sampled more frequently by females. How does this pre-selection amplify or dampen the effects of female choice?',
      successHint: 'The mating algorithm is where selection pressure is generated. The parameters (sample size, threshold stringency, weight distribution) control how strong that pressure is. Change them and you change the evolutionary trajectory.',
    },
    {
      title: 'Capstone Part 3: Inheritance and mutation — the genetic engine',
      concept: `For the simulator to evolve, offspring must inherit traits from parents with variation. The genetic engine implements:

1. **Parent selection**: Fathers are chosen by female mate choice (from Part 2). Mothers are all females that successfully mated (in this model).
2. **Crossover**: Each offspring genome is a mix of father and mother alleles. Single-point crossover picks a random gene boundary and takes the first half from one parent, second half from the other.
3. **Mutation**: Small random changes to alleles after crossover. Mutation rate controls the supply of new genetic variation.
4. **Heritability**: The correlation between parent and offspring trait values. In our model, heritability depends on how much of the trait variation is genetic (vs. environmental noise). High heritability means parents and offspring are similar; low heritability means environment dominates.

The interplay between selection (removes variation) and mutation (adds variation) determines the population's evolutionary trajectory. Strong selection depletes variation quickly; high mutation restores it. The equilibrium level of variation — the **mutation-selection balance** — is a fundamental quantity in evolutionary biology.

Female preferences also evolve. Daughters inherit their mothers' preference weights with mutation, creating co-evolution between male traits and female preferences.`,
      analogy: 'The genetic engine is like a recipe passed down through generations of chefs. Each generation copies the recipe (inheritance) but makes small modifications (mutation). Some recipes get combined (crossover). The recipes that produce the most popular dishes (highest fitness) get copied more often. Over time, the average recipe improves, but there is always experimentation at the margins.',
      storyConnection: 'The peacock in our story inherited his father\'s magnificent tail — but it is not an exact copy. It carries new mutations, some beneficial, some neutral, some harmful. The dance he performs today is the product of a genetic lineage stretching back millions of years, each generation slightly refined by female choice.',
      checkQuestion: 'If mutation rate is zero, what happens to genetic variation over many generations of strong selection?',
      checkAnswer: 'Genetic variation collapses to zero. Selection removes all alleles except the fittest, and without mutation there is no source of new variation. The population becomes genetically uniform (fixed). At that point, selection has nothing to act on and evolution stops. This is why mutation is called the "ultimate source of genetic variation" — without it, adaptation cannot continue.',
      codeIntro: 'Implement the full genetic engine: crossover, mutation, heritability calculation, and generational turnover.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class Genome:
    GENES = ['eyespot', 'melanin', 'metabolic', 'symmetry', 'stamina', 'immune']
    def __init__(self, a=None):
        self.alleles = np.random.uniform(0.2, 0.8, 6) if a is None else np.clip(np.array(a, dtype=float), 0.01, 0.99)
    def mutate(self, rate=0.02):
        self.alleles = np.clip(self.alleles + np.random.normal(0, rate, 6), 0.01, 0.99)
        return self
    @staticmethod
    def crossover(p1, p2):
        pt = np.random.randint(1, 6)
        return Genome(np.concatenate([p1.alleles[:pt], p2.alleles[pt:]]))

def phenotype(g, env=1.0):
    a = g.alleles
    n = np.random.normal(0, 0.04 * (1 - a[3]), 6)
    return np.array([
        np.clip((60 + 50*a[0]*env + n[0]*15) / 120, 0.1, 1),
        np.clip((5 + 20*a[4]*a[2]*env + n[4]*3) / 30, 0.05, 1),
        np.clip(a[2]*a[5]*env + n[2]*0.1, 0.1, 1),
        np.clip((80 + 60*a[0]*a[2] + n[0]*8) / 170, 0.3, 1),
        np.clip(1 - (0.3*(1-a[3]) + 0.2*(1-a[5]) + np.abs(n[3])*0.5), 0.3, 1),
    ])

def evolve_one_gen(male_genomes, female_weights, n_offspring, mutation_rate=0.02, env=1.0):
    """One generation: mate choice -> offspring -> mutation."""
    n_m = len(male_genomes)
    n_f = len(female_weights)

    # Compute male phenotypes and scores
    phenotypes = np.array([phenotype(g, env) for g in male_genomes])

    # Female choice: each female scores males with her weights, picks best of 5
    matings = {}
    mothers = []
    for fi in range(n_f):
        w = female_weights[fi]
        sample = np.random.choice(n_m, size=min(5, n_m), replace=False)
        scores = phenotypes[sample] @ w
        best = sample[np.argmax(scores)]
        matings[best] = matings.get(best, 0) + 1
        mothers.append(fi)

    # Create offspring
    new_genomes = []
    new_weights = []
    father_indices = list(matings.keys())
    father_weights_rep = np.array([matings[f] for f in father_indices], dtype=float)
    father_probs = father_weights_rep / father_weights_rep.sum()

    for _ in range(n_offspring):
        # Pick father proportional to mating success
        dad_idx = np.random.choice(father_indices, p=father_probs)
        mom_idx = np.random.choice(n_f)

        # Crossover male genome (from father, mother gets random genome for simplicity)
        mom_genome = Genome(male_genomes[dad_idx].alleles * 0.3 + np.random.uniform(0.2, 0.8, 6) * 0.7)
        child = Genome.crossover(male_genomes[dad_idx], mom_genome).mutate(mutation_rate)
        new_genomes.append(child)

        # Daughter inherits mother's preference + mutation
        child_w = female_weights[mom_idx] + np.random.normal(0, mutation_rate, 5)
        child_w = np.clip(child_w, 0.01, 1)
        child_w /= child_w.sum()
        new_weights.append(child_w)

    # Stats
    parent_pheno = phenotypes[father_indices].mean(axis=0)
    pop_pheno = phenotypes.mean(axis=0)
    selection_diff = parent_pheno - pop_pheno

    return new_genomes[:n_m], new_weights[:n_f], {
        'mean_pheno': pop_pheno,
        'sel_diff': selection_diff,
        'n_mated': len(matings),
        'max_matings': max(matings.values()),
        'genetic_var': np.var([g.alleles for g in male_genomes], axis=0),
    }

# Run evolution
n_m, n_f = 80, 60
n_gens = 80
male_genomes = [Genome() for _ in range(n_m)]
female_weights = [np.random.dirichlet(np.ones(5)) for _ in range(n_f)]

history = {k: [] for k in ['mean_pheno', 'sel_diff', 'n_mated', 'genetic_var']}
mutation_rates = [0.01, 0.02, 0.05]
all_histories = {}

for mr in mutation_rates:
    mg = [Genome() for _ in range(n_m)]
    fw = [np.random.dirichlet(np.ones(5)) for _ in range(n_f)]
    hist = {k: [] for k in ['mean_pheno', 'genetic_var']}

    for gen in range(n_gens):
        mg, fw, stats = evolve_one_gen(mg, fw, n_m + n_f, mutation_rate=mr)
        hist['mean_pheno'].append(stats['mean_pheno'])
        hist['genetic_var'].append(stats['genetic_var'])
    all_histories[mr] = hist

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
trait_names = ['Eyespots', 'Display', 'Body', 'Tail', '1-FA']

# Plot 1-2: Trait evolution for different mutation rates
for tidx, tname in enumerate(['Eyespots', 'Display']):
    ax = axes[0, tidx]
    ax.set_facecolor('#111827')
    for mr, clr in zip(mutation_rates, ['#3b82f6', '#22c55e', '#ef4444']):
        vals = [h[tidx] for h in all_histories[mr]['mean_pheno']]
        ax.plot(vals, color=clr, linewidth=2, label=f'mut={mr}')
    ax.set_xlabel('Generation', color='white')
    ax.set_ylabel(f'Mean {tname}', color='white')
    ax.set_title(f'{tname} evolution', color='white', fontsize=11)
    ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
    ax.tick_params(colors='gray')

# Plot 3: Genetic variance over time
ax = axes[0, 2]
ax.set_facecolor('#111827')
for mr, clr in zip(mutation_rates, ['#3b82f6', '#22c55e', '#ef4444']):
    mean_var = [np.mean(v) for v in all_histories[mr]['genetic_var']]
    ax.plot(mean_var, color=clr, linewidth=2, label=f'mut={mr}')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean genetic variance', color='white')
ax.set_title('Mutation-selection balance', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Heritability estimation
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Run one generation and compute parent-offspring regression
parents_g = [Genome() for _ in range(200)]
parent_phenos = np.array([phenotype(g) for g in parents_g])
offspring_phenos = []
for pg in parents_g:
    og = Genome.crossover(pg, Genome()).mutate(0.02)
    offspring_phenos.append(phenotype(og))
offspring_phenos = np.array(offspring_phenos)

for tidx in range(5):
    r = np.corrcoef(parent_phenos[:, tidx], offspring_phenos[:, tidx])[0, 1]
    ax.bar(tidx, r, color=['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444'][tidx])
ax.set_xticks(range(5))
ax.set_xticklabels([t[:6] for t in trait_names], color='white', fontsize=8)
ax.set_ylabel('Parent-offspring correlation', color='white')
ax.set_title('Heritability estimates', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 5: All traits evolution (best mutation rate)
ax = axes[1, 1]
ax.set_facecolor('#111827')
best_mr = 0.02
for tidx, (tname, clr) in enumerate(zip(trait_names, ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444'])):
    vals = [h[tidx] for h in all_histories[best_mr]['mean_pheno']]
    ax.plot(vals, color=clr, linewidth=2, label=tname)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean trait value', color='white')
ax.set_title(f'All traits (mut={best_mr})', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Final genome distribution
ax = axes[1, 2]
ax.set_facecolor('#111827')
final_alleles = np.array([g.alleles for g in mg])
bp = ax.boxplot([final_alleles[:, i] for i in range(6)], patch_artist=True,
                labels=[g[:6] for g in Genome.GENES])
for patch in bp['boxes']:
    patch.set_facecolor('#a855f7')
    patch.set_alpha(0.6)
for element in ['whiskers', 'caps', 'medians']:
    for item in bp[element]:
        item.set_color('white')
ax.set_ylabel('Allele value', color='white')
ax.set_title('Final genome distribution', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.set_xticklabels([g[:6] for g in Genome.GENES], rotation=30, fontsize=7, color='white')

plt.tight_layout()
plt.show()

print("Genetic engine results:")
for mr in mutation_rates:
    final = all_histories[mr]['mean_pheno'][-1]
    print(f"  Mutation rate {mr}: final trait means = {final.round(3)}")
    final_var = np.mean(all_histories[mr]['genetic_var'][-1])
    print(f"    Residual genetic variance: {final_var:.4f}")`,
      challenge: 'Implement assortative mating: females with high preference for eyespots tend to mate with high-eyespot males, creating genetic correlation between preference and trait. Does this accelerate or slow down evolution?',
      successHint: 'The genetic engine is the heart of any evolutionary simulator. The balance between selection, mutation, drift, and recombination determines everything about how the population changes over time.',
    },
    {
      title: 'Capstone Part 4: Environmental pressures — predation, parasites, and seasons',
      concept: `Real populations do not evolve in a vacuum. Environmental pressures modulate the fitness landscape every generation. The simulator needs three key environmental modules:

1. **Predation pressure**: Males with larger displays are more conspicuous to predators. Predation probability = baseline + k * display_size. During high-predation years, selection favors smaller displays. During low-predation years, sexual selection dominates and displays grow.

2. **Parasites**: Parasitic infection reduces body condition and increases fluctuating asymmetry. Males with strong immune genes resist parasites. Parasite virulence can fluctuate — creating Red Queen dynamics where host and parasite co-evolve.

3. **Seasonal variation**: Resource availability varies year to year. In good years, even mediocre males can grow decent displays (environmental component dominates). In bad years, only genetically superior males can display at all (genetic component dominates). This creates fluctuating heritability.

The interaction between these pressures creates complex evolutionary dynamics. Predation opposes sexual selection. Parasites create selection for immune genes. Resource variation modulates the strength of selection. The resulting trajectory is not a simple upward trend but a complex, fluctuating path.`,
      analogy: 'Environmental pressures are like changing weather during a sailing race. Sometimes the wind favors speed (sexual selection). Sometimes a storm demands safety (predation). Sometimes supplies run low (resource scarcity). The winning strategy is not the one optimized for any single condition but the one that performs adequately across all conditions.',
      storyConnection: 'The peacock in our story does not dance in paradise. He dances under threat of leopards, with parasites in his blood, during a monsoon season that may or may not provide enough food. His magnificent tail is not just beautiful — it is a testament to surviving all of this while still investing in display.',
      checkQuestion: 'During a year of severe drought, would you expect the heritability of display quality to increase or decrease, and why?',
      checkAnswer: 'Increase. In good environments, even males with mediocre genes can produce decent displays (environmental variation masks genetic differences). In drought, only males with truly superior genes for metabolic efficiency and resource acquisition can maintain display quality. The environmental noise floor drops, exposing genetic differences more clearly. This is why stressful environments paradoxically increase heritability.',
      codeIntro: 'Add environmental modules (predation, parasites, seasons) to the evolutionary simulation and observe their effects.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class Genome:
    def __init__(self, a=None):
        self.alleles = np.random.uniform(0.2, 0.8, 6) if a is None else np.clip(np.array(a, dtype=float), 0.01, 0.99)
    def mutate(self, r=0.02):
        self.alleles = np.clip(self.alleles + np.random.normal(0, r, 6), 0.01, 0.99)
        return self
    @staticmethod
    def cross(p1, p2):
        pt = np.random.randint(1, 6)
        return Genome(np.concatenate([p1.alleles[:pt], p2.alleles[pt:]]))

def phenotype(g, env, parasite_load):
    a = g.alleles
    # Parasites reduce condition based on immune gene
    immune_effect = max(0, 1 - parasite_load * (1 - a[5]))
    effective_env = env * immune_effect
    n = np.random.normal(0, 0.04 * (1 - a[3]), 6)
    return np.array([
        np.clip((60 + 50*a[0]*effective_env + n[0]*12) / 120, 0.1, 1),
        np.clip((5 + 20*a[4]*a[2]*effective_env + n[4]*3) / 30, 0.05, 1),
        np.clip(a[2]*a[5]*effective_env + n[2]*0.08, 0.1, 1),
        np.clip((80 + 60*a[0]*a[2] + n[0]*6) / 170, 0.3, 1),
        np.clip(1 - (0.3*(1-a[3]) + 0.2*(1-a[5]) + parasite_load*0.15 + abs(n[3])*0.3), 0.2, 1),
    ])

def predation_survival(pheno, predator_pressure):
    """Display conspicuousness increases predation risk."""
    conspicuousness = 0.4 * pheno[0] + 0.3 * pheno[1] + 0.3 * pheno[3]  # eyespots + display + tail
    survival_prob = np.exp(-predator_pressure * conspicuousness)
    return np.random.random() < survival_prob

def run_generation(genomes, weights, env_quality, predator_p, parasite_load, mut_rate=0.02):
    n_m = len(genomes)
    n_f = len(weights)

    # Compute phenotypes under current environment
    phenos = np.array([phenotype(g, env_quality, parasite_load) for g in genomes])

    # Predation filter
    survived = [predation_survival(p, predator_p) for p in phenos]
    alive_idx = [i for i, s in enumerate(survived) if s]

    if len(alive_idx) < 3:
        alive_idx = list(range(min(5, n_m)))  # prevent extinction

    alive_phenos = phenos[alive_idx]
    alive_genomes = [genomes[i] for i in alive_idx]

    # Female choice among survivors
    matings = {}
    for fi in range(n_f):
        w = weights[fi]
        sample = np.random.choice(len(alive_idx), size=min(5, len(alive_idx)), replace=False)
        scores = alive_phenos[sample] @ w
        best = sample[np.argmax(scores)]
        real_idx = alive_idx[best]
        matings[real_idx] = matings.get(real_idx, 0) + 1

    # Reproduce
    new_genomes, new_weights = [], []
    if matings:
        fathers = list(matings.keys())
        f_probs = np.array([matings[f] for f in fathers], dtype=float)
        f_probs /= f_probs.sum()

        for _ in range(n_m + n_f):
            dad = fathers[np.random.choice(len(fathers), p=f_probs)]
            child = Genome(genomes[dad].alleles).mutate(mut_rate)
            new_genomes.append(child)
            mom_w = weights[np.random.randint(n_f)]
            nw = np.clip(mom_w + np.random.normal(0, mut_rate, 5), 0.01, 1)
            new_weights.append(nw / nw.sum())

    return new_genomes[:n_m], new_weights[:n_f], {
        'mean_pheno': phenos.mean(axis=0),
        'survival_rate': len(alive_idx) / n_m,
        'n_mated': len(matings),
        'genetic_var': np.var([g.alleles for g in genomes], axis=0).mean(),
    }

# Simulate with fluctuating environment
n_gens = 120
n_m, n_f = 60, 50

# Scenario 1: Stable environment
# Scenario 2: Fluctuating predation
# Scenario 3: Parasite cycles
scenarios = {
    'Stable': {'env': np.ones(n_gens), 'pred': np.ones(n_gens)*0.5, 'para': np.zeros(n_gens)},
    'Fluctuating predators': {'env': np.ones(n_gens),
                               'pred': 0.5 + 0.4*np.sin(2*np.pi*np.arange(n_gens)/30),
                               'para': np.zeros(n_gens)},
    'Parasite cycles': {'env': np.ones(n_gens), 'pred': np.ones(n_gens)*0.3,
                        'para': 0.3 + 0.25*np.sin(2*np.pi*np.arange(n_gens)/20)},
}

results = {}
for name, params in scenarios.items():
    mg = [Genome() for _ in range(n_m)]
    fw = [np.random.dirichlet(np.ones(5)) for _ in range(n_f)]
    hist = {'mean_pheno': [], 'survival': [], 'genetic_var': []}

    for gen in range(n_gens):
        mg, fw, stats = run_generation(mg, fw, params['env'][gen], params['pred'][gen], params['para'][gen])
        hist['mean_pheno'].append(stats['mean_pheno'])
        hist['survival'].append(stats['survival_rate'])
        hist['genetic_var'].append(stats['genetic_var'])
    results[name] = hist

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
colors_s = {'Stable': '#22c55e', 'Fluctuating predators': '#f59e0b', 'Parasite cycles': '#ef4444'}

# Plot 1: Eyespot evolution across scenarios
ax = axes[0, 0]
ax.set_facecolor('#111827')
for name, hist in results.items():
    vals = [h[0] for h in hist['mean_pheno']]
    ax.plot(vals, color=colors_s[name], linewidth=2, label=name)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean eyespot score', color='white')
ax.set_title('Eyespot evolution', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Survival rates
ax = axes[0, 1]
ax.set_facecolor('#111827')
for name, hist in results.items():
    ax.plot(hist['survival'], color=colors_s[name], linewidth=1.5, alpha=0.7, label=name)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Survival rate', color='white')
ax.set_title('Predation survival', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Genetic variance
ax = axes[0, 2]
ax.set_facecolor('#111827')
for name, hist in results.items():
    ax.plot(hist['genetic_var'], color=colors_s[name], linewidth=2, label=name)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Genetic variance', color='white')
ax.set_title('Genetic diversity', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Environmental pressure timelines
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(scenarios['Fluctuating predators']['pred'], color='#f59e0b', linewidth=2, label='Predation')
ax.plot(scenarios['Parasite cycles']['para'], color='#ef4444', linewidth=2, label='Parasites')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Pressure level', color='white')
ax.set_title('Environmental pressure cycles', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Body condition (immune proxy) across scenarios
ax = axes[1, 1]
ax.set_facecolor('#111827')
for name, hist in results.items():
    vals = [h[2] for h in hist['mean_pheno']]  # body condition
    ax.plot(vals, color=colors_s[name], linewidth=2, label=name)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Body condition', color='white')
ax.set_title('Condition tracks immune pressure', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Symmetry (1-FA) evolution
ax = axes[1, 2]
ax.set_facecolor('#111827')
for name, hist in results.items():
    vals = [h[4] for h in hist['mean_pheno']]
    ax.plot(vals, color=colors_s[name], linewidth=2, label=name)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Symmetry (1-FA)', color='white')
ax.set_title('Developmental stability', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Environmental pressure effects:")
for name, hist in results.items():
    final = hist['mean_pheno'][-1]
    print(f"  {name}:")
    print(f"    Final traits: {final.round(3)}")
    print(f"    Final survival: {hist['survival'][-1]:.1%}")
    print(f"    Final genetic var: {hist['genetic_var'][-1]:.4f}")`,
      challenge: 'Add Red Queen dynamics: parasite virulence evolves to track the most common immune genotype. Implement a simple parasite population that co-evolves with the peacocks. Does this maintain genetic diversity?',
      successHint: 'Environmental fluctuation is the secret weapon against genetic uniformity. Constant environments favor specialists; variable environments favor generalists and maintain diversity. This is one reason biodiversity is important — diverse populations adapt faster to change.',
    },
    {
      title: 'Capstone Part 5: Analysis dashboard — measuring selection in real time',
      concept: `A simulator without analysis tools is a black box. The dashboard provides real-time measurements of:

1. **Selection differential (S)**: The difference in mean trait value between selected parents and the whole population. Measures the strength of selection this generation.

2. **Response to selection (R)**: The change in mean trait value from one generation to the next. R = h^2 * S (breeder's equation), where h^2 is heritability.

3. **Opportunity for selection (I)**: The variance in relative fitness. I = var(fitness) / mean(fitness)^2. If all males have equal fitness, I = 0 and no selection can occur.

4. **Effective population size (Ne)**: The number of individuals actually contributing to the next generation. With skewed mating, Ne << census size. Ne = (4 * Nm * Nf) / (Nm + Nf) for separate sexes, but mating skew reduces it further.

5. **Genetic correlation matrix**: Correlations between trait alleles. If eyespot genes and immune genes become correlated (because females select for both), they evolve together even if they are on different chromosomes. This is called **linkage disequilibrium** driven by selection.

These metrics tell you not just what is happening but why. A population can stop evolving because selection weakened (low S), because heritability dropped (low h^2), or because variation was exhausted (low genetic variance).`,
      analogy: 'The dashboard is like a car\'s instrument panel. The speedometer (selection differential) tells you how fast evolution is happening right now. The fuel gauge (genetic variance) tells you how much further it can go. The temperature gauge (FA) warns of developmental stress. Without instruments, you are driving blind.',
      storyConnection: 'If a biologist could instrument the peacock population in our story, they would build exactly this dashboard: tracking which males mate, how traits change, whether diversity is healthy. Conservation biology uses these same metrics to predict whether endangered populations can adapt to environmental change.',
      checkQuestion: 'A population has high selection differential (S = 0.5) but the response to selection next generation is nearly zero (R = 0.01). What does this tell you?',
      checkAnswer: 'It tells you that heritability is very low (h^2 = R/S = 0.02). Strong selection is occurring — mates are very non-random — but offspring do not resemble their parents for this trait. The trait variation is almost entirely environmental, not genetic. Selection cannot cause evolution if the selected traits are not heritable.',
      codeIntro: 'Build the analysis dashboard that tracks selection metrics, heritability, and genetic correlations across generations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class Genome:
    def __init__(self, a=None):
        self.alleles = np.random.uniform(0.2, 0.8, 6) if a is None else np.clip(np.array(a, dtype=float), 0.01, 0.99)
    def mutate(self, r=0.02):
        self.alleles = np.clip(self.alleles + np.random.normal(0, r, 6), 0.01, 0.99)
        return self

def pheno(g, env=1.0):
    a = g.alleles
    n = np.random.normal(0, 0.04*(1-a[3]), 6)
    return np.array([
        np.clip((60+50*a[0]*env+n[0]*12)/120, 0.1, 1),
        np.clip((5+20*a[4]*a[2]*env+n[4]*3)/30, 0.05, 1),
        np.clip(a[2]*a[5]*env+n[2]*0.08, 0.1, 1),
        np.clip((80+60*a[0]*a[2]+n[0]*6)/170, 0.3, 1),
        np.clip(1-(0.3*(1-a[3])+0.2*(1-a[5])+abs(n[3])*0.3), 0.2, 1),
    ])

def evolve_with_metrics(n_m=60, n_f=50, n_gens=100, mut_rate=0.02):
    genomes = [Genome() for _ in range(n_m)]
    weights = [np.random.dirichlet(np.ones(5)) for _ in range(n_f)]

    metrics = {k: [] for k in [
        'sel_diff', 'response', 'opp_selection', 'Ne',
        'heritability', 'mean_traits', 'genetic_corr', 'genetic_var'
    ]}

    prev_mean = None

    for gen in range(n_gens):
        phenotypes = np.array([pheno(g) for g in genomes])
        allele_matrix = np.array([g.alleles for g in genomes])

        # Female choice
        matings = {}
        for fi in range(n_f):
            w = weights[fi]
            sample = np.random.choice(n_m, size=min(5, n_m), replace=False)
            scores = phenotypes[sample] @ w
            best = sample[np.argmax(scores)]
            matings[best] = matings.get(best, 0) + 1

        # Metrics
        pop_mean = phenotypes.mean(axis=0)
        if matings:
            parent_idx = list(matings.keys())
            parent_weights = np.array([matings[i] for i in parent_idx], dtype=float)
            parent_pheno = phenotypes[parent_idx]
            weighted_parent_mean = (parent_pheno * parent_weights[:, None]).sum(axis=0) / parent_weights.sum()
            sel_diff = weighted_parent_mean - pop_mean
        else:
            sel_diff = np.zeros(5)

        # Response to selection
        response = (pop_mean - prev_mean) if prev_mean is not None else np.zeros(5)
        prev_mean = pop_mean.copy()

        # Heritability estimate (R = h^2 * S)
        h2 = np.where(np.abs(sel_diff) > 0.001, response / sel_diff, 0)
        h2 = np.clip(h2, 0, 1)

        # Opportunity for selection
        fitness_vals = np.array([matings.get(i, 0) for i in range(n_m)], dtype=float)
        mean_fit = fitness_vals.mean()
        if mean_fit > 0:
            I = fitness_vals.var() / mean_fit**2
        else:
            I = 0

        # Effective population size
        if matings:
            n_sires = len(matings)
            Ne = (4 * n_sires * n_f) / (n_sires + n_f)
        else:
            Ne = 0

        # Genetic correlation matrix
        if allele_matrix.shape[0] > 2:
            gc = np.corrcoef(allele_matrix.T)
        else:
            gc = np.eye(6)

        metrics['sel_diff'].append(sel_diff)
        metrics['response'].append(response)
        metrics['opp_selection'].append(I)
        metrics['Ne'].append(Ne)
        metrics['heritability'].append(h2)
        metrics['mean_traits'].append(pop_mean)
        metrics['genetic_corr'].append(gc)
        metrics['genetic_var'].append(allele_matrix.var(axis=0))

        # Reproduce
        new_g = []
        if matings:
            fathers = list(matings.keys())
            fp = np.array([matings[f] for f in fathers], dtype=float)
            fp /= fp.sum()
            for _ in range(n_m):
                dad = fathers[np.random.choice(len(fathers), p=fp)]
                child = Genome(genomes[dad].alleles).mutate(mut_rate)
                new_g.append(child)
        genomes = new_g if new_g else [Genome() for _ in range(n_m)]

        # Evolve female preferences
        for fi in range(n_f):
            weights[fi] = np.clip(weights[fi] + np.random.normal(0, mut_rate, 5), 0.01, 1)
            weights[fi] /= weights[fi].sum()

    return metrics

metrics = evolve_with_metrics()
trait_names = ['Eyespots', 'Display', 'Body', 'Tail', '1-FA']
t_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Selection differential over time
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i, (tn, clr) in enumerate(zip(trait_names, t_colors)):
    vals = [sd[i] for sd in metrics['sel_diff']]
    ax.plot(vals, color=clr, linewidth=1.5, alpha=0.7, label=tn)
ax.axhline(0, color='gray', linewidth=1, linestyle='--')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Selection differential', color='white')
ax.set_title('Selection strength per trait', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Heritability
ax = axes[0, 1]
ax.set_facecolor('#111827')
for i, (tn, clr) in enumerate(zip(trait_names, t_colors)):
    vals = [h[i] for h in metrics['heritability']][1:]
    if vals:
        # Smooth with rolling average
        kernel = 5
        smoothed = np.convolve(vals, np.ones(kernel)/kernel, mode='valid')
        ax.plot(smoothed, color=clr, linewidth=2, label=tn)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('h² (smoothed)', color='white')
ax.set_title('Heritability estimates', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Opportunity for selection and Ne
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.plot(metrics['opp_selection'], color='#f59e0b', linewidth=2, label='Opp. for selection (I)')
ax2 = ax.twinx()
ax2.plot(metrics['Ne'], color='#3b82f6', linewidth=2, label='Effective pop size')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('I', color='#f59e0b')
ax2.set_ylabel('Ne', color='#3b82f6')
ax.set_title('Selection opportunity & Ne', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

# Plot 4: Genetic variance depletion
ax = axes[1, 0]
ax.set_facecolor('#111827')
gene_names_short = ['eyespot', 'melanin', 'metab', 'symm', 'stam', 'immune']
for i, (gn, clr) in enumerate(zip(gene_names_short, ['#22c55e','#3b82f6','#f59e0b','#a855f7','#ef4444','#94a3b8'])):
    vals = [gv[i] for gv in metrics['genetic_var']]
    ax.plot(vals, color=clr, linewidth=1.5, label=gn)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Allelic variance', color='white')
ax.set_title('Genetic variance over time', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Final genetic correlation matrix
ax = axes[1, 1]
ax.set_facecolor('#111827')
gc = metrics['genetic_corr'][-1]
im = ax.imshow(gc, cmap='RdBu_r', vmin=-1, vmax=1)
ax.set_xticks(range(6))
ax.set_xticklabels([g[:5] for g in gene_names_short], rotation=45, fontsize=7, color='white')
ax.set_yticks(range(6))
ax.set_yticklabels([g[:5] for g in gene_names_short], fontsize=7, color='white')
ax.set_title('Genetic correlation matrix', color='white', fontsize=11)
plt.colorbar(im, ax=ax)

# Plot 6: Breeder's equation check (R vs h^2 * S)
ax = axes[1, 2]
ax.set_facecolor('#111827')
predicted_R = []
actual_R = []
for gen in range(2, len(metrics['sel_diff'])):
    h2 = metrics['heritability'][gen]
    S = metrics['sel_diff'][gen-1]
    predicted_R.append((h2 * S).mean())
    actual_R.append(np.array(metrics['response'][gen]).mean())
ax.scatter(predicted_R, actual_R, s=10, alpha=0.5, color='#22c55e')
lims = [min(min(predicted_R), min(actual_R)), max(max(predicted_R), max(actual_R))]
ax.plot(lims, lims, '--', color='#ef4444', linewidth=2, label='Perfect prediction')
ax.set_xlabel('Predicted R (h² × S)', color='white')
ax.set_ylabel('Actual R', color='white')
ax.set_title("Breeder's equation validation", color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Selection Dashboard Summary (final 10 gens):")
for i, tn in enumerate(trait_names):
    recent_S = np.mean([sd[i] for sd in metrics['sel_diff'][-10:]])
    recent_h2 = np.mean([h[i] for h in metrics['heritability'][-10:]])
    print(f"  {tn}: S={recent_S:+.4f}, h²={recent_h2:.3f}")
print(f"  Mean Ne: {np.mean(metrics['Ne'][-10:]):.1f}")
print(f"  Mean I: {np.mean(metrics['opp_selection'][-10:]):.3f}")`,
      challenge: 'Add a "conservation alert" system that flags when Ne drops below a critical threshold (Ne < 20) or when genetic variance in any gene drops below 0.005. These are warning signs of evolutionary dead-ends in real conservation.',
      successHint: 'This dashboard is not just a teaching tool. Real population geneticists use exactly these metrics — Ne, h², I, selection differentials — to manage breeding programs for endangered species. The math of peacock sexual selection is the same math that saves California condors and giant pandas.',
    },
    {
      title: 'Capstone Part 6: Full simulator — putting it all together with parameter exploration',
      concept: `The final capstone module integrates all components into a single configurable simulator. You can now explore questions like:

- What happens to peacock tails if predators are removed? (Runway selection)
- What happens if female preferences become random? (Neutral evolution)
- Can a small population maintain display quality? (Genetic drift vs. selection)
- How do environmental catastrophes (bottlenecks) affect long-term evolution?

The simulator takes a configuration dictionary with all parameters and returns a complete evolutionary trajectory. The key parameters are:

1. **Population size** (N): Larger N means less drift, more effective selection
2. **Mutation rate** (mu): Balances variation supply against noise
3. **Female sample size**: Controls selection intensity
4. **Predator pressure**: Opposes sexual selection
5. **Parasite virulence**: Selects for immune genes, increases FA
6. **Environmental variance**: Good vs. bad years
7. **Number of generations**: How far into the future to simulate

By systematically varying these parameters, you can map out the conditions under which peacock-like ornaments evolve and maintain themselves — or collapse.`,
      analogy: 'The full simulator is like a flight simulator for evolutionary biologists. A pilot uses a flight simulator to test "what if the engine fails at 30,000 feet?" An evolutionary biologist uses this to test "what if predator pressure doubles?" or "what if the population crashes to 10 individuals?" You can explore scenarios that would take millions of years in reality.',
      storyConnection: 'The peacock\'s dance is the product of a specific evolutionary trajectory: certain population sizes, predator pressures, parasite loads, and female preferences over millions of years. Change any parameter and you might get a different bird entirely — or no ornamental display at all. The simulator lets you explore the space of possible peacocks.',
      checkQuestion: 'You run the simulator with a population bottleneck (N drops from 100 to 5 for 10 generations, then recovers to 100). What permanent effects might this bottleneck have even after the population recovers?',
      checkAnswer: 'The bottleneck causes extreme genetic drift, randomly fixing some alleles and losing others. Even after population recovery, the lost alleles are gone forever (unless re-created by mutation). The population may have permanently reduced genetic variance, lower heritability, and higher inbreeding. It may take hundreds of generations of mutation to restore pre-bottleneck diversity. This is called a "genetic bottleneck" and explains why cheetahs (who went through one ~10,000 years ago) have almost no genetic diversity today.',
      codeIntro: 'Build the complete configurable simulator and explore parameter space systematically.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

class Genome:
    def __init__(self, a=None):
        self.alleles = np.random.uniform(0.2, 0.8, 6) if a is None else np.clip(np.array(a, dtype=float), 0.01, 0.99)
    def mutate(self, r=0.02):
        self.alleles = np.clip(self.alleles + np.random.normal(0, r, 6), 0.01, 0.99)
        return self

def pheno(g, env=1.0, para=0.0):
    a = g.alleles
    imm = max(0, 1 - para*(1-a[5]))
    e = env * imm
    n = np.random.normal(0, 0.04*(1-a[3]), 6)
    return np.array([
        np.clip((60+50*a[0]*e+n[0]*12)/120, 0.1, 1),
        np.clip((5+20*a[4]*a[2]*e+n[4]*3)/30, 0.05, 1),
        np.clip(a[2]*a[5]*e+n[2]*0.08, 0.1, 1),
        np.clip((80+60*a[0]*a[2]+n[0]*6)/170, 0.3, 1),
        np.clip(1-(0.3*(1-a[3])+0.2*(1-a[5])+para*0.1+abs(n[3])*0.3), 0.2, 1),
    ])

def simulate(config):
    """Full simulator with configurable parameters."""
    n_m = config.get('n_males', 60)
    n_f = config.get('n_females', 50)
    n_gens = config.get('generations', 100)
    mut_rate = config.get('mutation_rate', 0.02)
    sample_size = config.get('female_sample_size', 5)
    base_pred = config.get('predator_pressure', 0.5)
    base_para = config.get('parasite_virulence', 0.0)
    env_var = config.get('env_variance', 0.0)
    bottleneck_gen = config.get('bottleneck_gen', -1)
    bottleneck_size = config.get('bottleneck_size', 5)

    genomes = [Genome() for _ in range(n_m)]
    weights = [np.random.dirichlet(np.ones(5)) for _ in range(n_f)]

    history = {'traits': [], 'survival': [], 'Ne': [], 'gen_var': [], 'n_mated': []}

    for gen in range(n_gens):
        # Bottleneck
        current_n = n_m
        if gen == bottleneck_gen:
            genomes = genomes[:bottleneck_size]
            current_n = bottleneck_size
        elif gen > bottleneck_gen and bottleneck_gen > 0 and len(genomes) < n_m:
            while len(genomes) < n_m:
                genomes.append(Genome(genomes[np.random.randint(len(genomes))].alleles).mutate(mut_rate))
            current_n = n_m

        env = max(0.3, 1.0 + np.random.normal(0, env_var))
        pred = base_pred * (1 + 0.3*np.sin(2*np.pi*gen/30))
        para = max(0, base_para + 0.15*np.sin(2*np.pi*gen/20))

        phenotypes = np.array([pheno(g, env, para) for g in genomes])

        # Predation
        conspic = 0.4*phenotypes[:, 0] + 0.3*phenotypes[:, 1] + 0.3*phenotypes[:, 3]
        surv_prob = np.exp(-pred * conspic)
        survived = np.random.random(len(genomes)) < surv_prob
        alive = np.where(survived)[0]
        if len(alive) < 3:
            alive = np.arange(min(3, len(genomes)))

        # Mating
        matings = {}
        for fi in range(n_f):
            w = weights[fi]
            samp = np.random.choice(alive, size=min(sample_size, len(alive)), replace=False)
            scores = phenotypes[samp] @ w
            best = samp[np.argmax(scores)]
            matings[best] = matings.get(best, 0) + 1

        # Metrics
        n_mated = len(matings)
        Ne = (4*n_mated*n_f)/(n_mated+n_f) if n_mated > 0 else 0

        history['traits'].append(phenotypes.mean(axis=0))
        history['survival'].append(survived.mean())
        history['Ne'].append(Ne)
        history['gen_var'].append(np.var([g.alleles for g in genomes], axis=0).mean())
        history['n_mated'].append(n_mated)

        # Reproduce
        if matings:
            fathers = list(matings.keys())
            fp = np.array([matings[f] for f in fathers], dtype=float)
            fp /= fp.sum()
            new_g = []
            for _ in range(n_m):
                dad = fathers[np.random.choice(len(fathers), p=fp)]
                new_g.append(Genome(genomes[dad].alleles).mutate(mut_rate))
            genomes = new_g

        for fi in range(n_f):
            weights[fi] = np.clip(weights[fi] + np.random.normal(0, mut_rate*0.5, 5), 0.01, 1)
            weights[fi] /= weights[fi].sum()

    return history

# Run scenarios
scenarios = {
    'Baseline': {'generations': 120, 'predator_pressure': 0.5},
    'No predators': {'generations': 120, 'predator_pressure': 0.0},
    'High predation': {'generations': 120, 'predator_pressure': 1.5},
    'Small pop (N=15)': {'generations': 120, 'n_males': 15, 'n_females': 12},
    'Bottleneck gen 30': {'generations': 120, 'bottleneck_gen': 30, 'bottleneck_size': 5},
    'Parasites + env var': {'generations': 120, 'parasite_virulence': 0.4, 'env_variance': 0.2},
}

results = {name: simulate(cfg) for name, cfg in scenarios.items()}

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
scenario_colors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#a855f7', '#94a3b8']

# Plot 1: Eyespot evolution
ax = axes[0, 0]
ax.set_facecolor('#111827')
for (name, hist), clr in zip(results.items(), scenario_colors):
    vals = [t[0] for t in hist['traits']]
    ax.plot(vals, color=clr, linewidth=1.5, label=name[:15])
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean eyespot score', color='white')
ax.set_title('Eyespot evolution', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='lower right')
ax.tick_params(colors='gray')

# Plot 2: Effective population size
ax = axes[0, 1]
ax.set_facecolor('#111827')
for (name, hist), clr in zip(results.items(), scenario_colors):
    ax.plot(hist['Ne'], color=clr, linewidth=1.5, alpha=0.7, label=name[:15])
ax.axhline(20, color='#ef4444', linewidth=1, linestyle=':', label='Critical Ne')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Effective pop size', color='white')
ax.set_title('Ne trajectory', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Genetic variance
ax = axes[0, 2]
ax.set_facecolor('#111827')
for (name, hist), clr in zip(results.items(), scenario_colors):
    ax.plot(hist['gen_var'], color=clr, linewidth=1.5, label=name[:15])
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Genetic variance', color='white')
ax.set_title('Diversity maintenance', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Final trait comparison (radar-style bar chart)
ax = axes[1, 0]
ax.set_facecolor('#111827')
trait_labels = ['Eyes', 'Disp', 'Body', 'Tail', '1-FA']
x = np.arange(5)
width = 0.12
for i, ((name, hist), clr) in enumerate(zip(results.items(), scenario_colors)):
    final = hist['traits'][-1]
    ax.bar(x + i*width, final, width, color=clr, label=name[:12])
ax.set_xticks(x + width*2.5)
ax.set_xticklabels(trait_labels, color='white')
ax.set_ylabel('Final trait value', color='white')
ax.set_title('Final phenotypes by scenario', color='white', fontsize=11)
ax.legend(fontsize=5, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Survival rates
ax = axes[1, 1]
ax.set_facecolor('#111827')
for (name, hist), clr in zip(results.items(), scenario_colors):
    ax.plot(hist['survival'], color=clr, linewidth=1, alpha=0.6, label=name[:15])
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Survival rate', color='white')
ax.set_title('Predation impact', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Summary statistics table
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
table_data = []
for name, hist in results.items():
    final_eyes = hist['traits'][-1][0]
    final_Ne = np.mean(hist['Ne'][-10:])
    final_var = np.mean(hist['gen_var'][-10:])
    table_data.append([name[:18], f'{final_eyes:.3f}', f'{final_Ne:.0f}', f'{final_var:.4f}'])
table = ax.table(cellText=table_data,
                 colLabels=['Scenario', 'Final Eyes', 'Ne', 'Gen Var'],
                 cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(8)
for cell in table.get_celld().values():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
ax.set_title('Summary comparison', color='white', fontsize=11, pad=20)

plt.tight_layout()
plt.show()

print("=== MATE CHOICE SIMULATOR: SCENARIO COMPARISON ===")
print(f"{'Scenario':<25} {'Eyespots':>10} {'Ne':>8} {'GenVar':>10} {'Survival':>10}")
print("-" * 65)
for name, hist in results.items():
    e = hist['traits'][-1][0]
    ne = np.mean(hist['Ne'][-10:])
    gv = np.mean(hist['gen_var'][-10:])
    sv = np.mean(hist['survival'][-10:])
    print(f"{name:<25} {e:>10.3f} {ne:>8.0f} {gv:>10.4f} {sv:>10.1%}")
print()
print("Key findings:")
print("  - No predators: display escalates (runaway selection)")
print("  - High predation: display suppressed (survival selection dominates)")
print("  - Small population: genetic drift overwhelms selection")
print("  - Bottleneck: permanent loss of genetic diversity")
print("  - Parasites: fluctuating selection maintains some diversity")`,
      challenge: 'Add a "conservation mode" that implements managed breeding: when Ne drops below a threshold, introduce genetically diverse individuals from a separate captive population. Test whether this rescue restores evolutionary potential.',
      successHint: 'You have built a complete evolutionary simulator from first principles. The same computational framework — individual-based models with genetics, selection, and environmental variation — is used in real conservation genetics, agriculture, and epidemiology. The peacock is just the beginning.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Mate Choice Simulator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete sexual selection simulator from scratch</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project builds a full evolutionary simulator. Python with numpy and matplotlib required.</p>
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
