import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RedPandaLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Phylogenetic trees — mapping the family tree of life',
      concept: `A **phylogenetic tree** is a diagram showing evolutionary relationships between species. It's built from shared DNA, anatomy, and fossil evidence.

**Reading a tree:**
- **Tips** (endpoints) = current species
- **Nodes** (branch points) = common ancestors
- **Branch lengths** = evolutionary distance (more changes = longer branch)
- **Sister groups** = species sharing the most recent common ancestor

**The red panda's confusing placement:**
For decades, scientists debated: Is the red panda a bear? A raccoon? Neither? DNA finally answered: the red panda belongs to its own family, **Ailuridae**, with no close living relatives. Its nearest relatives are the weasel/raccoon/skunk superfamily (Musteloidea), not bears.

**Building trees:**
- Collect DNA sequences from multiple species
- Align the sequences (match up corresponding bases)
- Count differences between each pair
- Group species by similarity (closest = most recent common ancestor)
- Use algorithms (neighbor-joining, maximum likelihood) to find the best tree`,
      analogy: 'A phylogenetic tree is like a family genealogy chart, but for species instead of people. Just as your family tree shows you are more closely related to your cousin than to a stranger, a phylogenetic tree shows that red pandas are more closely related to raccoons than to giant pandas — despite the shared name.',
      storyConnection: 'The red panda\'s story tells of a unique creature, different from all others in the forest. Phylogenetics confirms this — the red panda sits alone on a branch that diverged 47 million years ago. It has no close relatives. It truly is a one-of-a-kind animal, as the story suggests.',
      checkQuestion: 'Giant pandas and red pandas both eat bamboo and both have "pseudo-thumbs" (extended wrist bones). But they\'re not closely related. How did they both evolve the same trait?',
      checkAnswer: 'This is convergent evolution — independent evolution of similar traits in unrelated species facing similar challenges. Both needed to grip bamboo, so both evolved a modified wrist bone. It is like two inventors in different countries independently inventing the wheel — same problem, same solution, no copying.',
      codeIntro: 'Build and visualize a phylogenetic tree for carnivore families.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simple phylogenetic tree using distance matrix
# DNA distance (mutations per site) between carnivore families

species = ['Red panda', 'Raccoon', 'Weasel', 'Bear', 'Giant panda', 'Dog', 'Cat', 'Seal']
# Approximate divergence times (million years ago)
# These create the tree topology

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Draw tree manually (simplified topology)
ax1.set_facecolor('#111827')
tree_data = [
    # (species, x_tip, y_position, branch_color)
    ('Red panda', 0, 7, '#ef4444'),
    ('Raccoon', 0, 6, '#f59e0b'),
    ('Weasel', 0, 5, '#22c55e'),
    ('Seal', 0, 4, '#3b82f6'),
    ('Dog', 0, 3, '#8b5cf6'),
    ('Bear', 0, 2, '#ec4899'),
    ('Giant panda', 0, 1, '#14b8a6'),
    ('Cat', 0, 0, '#6b7280'),
]

# Internal nodes (ancestor positions) — x = divergence time in Mya
nodes = [
    # Cat diverges first (~55 Mya)
    (55, 3.5, [(0, 0, 55, '#6b7280')]),  # cat branch
    # Caniformia split
    (52, 3.5, []),
    # Dog lineage
    (45, 3, [(0, 3, 45, '#8b5cf6')]),
    # Arctoidea (bears + seals + musteloids)
    (42, 4.5, []),
    # Bear + giant panda
    (12, 1.5, [(0, 2, 12, '#ec4899'), (0, 1, 12, '#14b8a6')]),
    # Seal
    (35, 4, [(0, 4, 35, '#3b82f6')]),
    # Musteloidea (weasel + raccoon + red panda)
    (47, 6, [(0, 7, 47, '#ef4444')]),
    (35, 5.5, [(0, 6, 35, '#f59e0b'), (0, 5, 35, '#22c55e')]),
]

# Draw horizontal lines for each species
for name, x, y, color in tree_data:
    ax1.plot([x, 55], [y, y], color=color, linewidth=2, alpha=0.3)
    ax1.text(-1, y, name, ha='right', va='center', color=color, fontsize=10, fontweight='bold')

# Draw simplified tree structure
# Red panda diverges at 47 Mya
ax1.plot([47, 47], [7, 5.5], color='#ef4444', linewidth=2)
ax1.plot([47, 55], [7, 7], color='#ef4444', linewidth=2)
# Raccoon-weasel split at 35 Mya
ax1.plot([35, 35], [6, 5], color='#f59e0b', linewidth=2)
ax1.plot([35, 47], [5.5, 5.5], color='#22c55e', linewidth=2)
# Musteloidea connects to Arctoidea at 52 Mya
ax1.plot([47, 52], [5.5, 4.5], color='gray', linewidth=1.5)
# Seal at 35 Mya from Arctoidea
ax1.plot([35, 52], [4, 4.5], color='#3b82f6', linewidth=2)
# Bear-panda split at 12 Mya
ax1.plot([12, 12], [2, 1], color='#ec4899', linewidth=2)
ax1.plot([12, 42], [1.5, 1.5], color='#ec4899', linewidth=1.5)
ax1.plot([42, 52], [1.5, 4.5], color='gray', linewidth=1.5)
# Dog diverges at 45 Mya
ax1.plot([45, 52], [3, 3.5], color='#8b5cf6', linewidth=2)
# Cat diverges at 55 Mya
ax1.plot([55, 55], [0, 3.5], color='#6b7280', linewidth=2)
ax1.plot([52, 55], [3.5, 3.5], color='gray', linewidth=1.5)

ax1.set_xlabel('Million years ago', color='white')
ax1.set_title('Carnivore Phylogenetic Tree', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.set_xlim(-15, 60)
ax1.invert_xaxis()

# Distance matrix heatmap
ax2.set_facecolor('#111827')
# Approximate genetic distances (simplified)
distances = np.array([
    [0, 30, 32, 40, 42, 43, 50, 38],  # Red panda
    [30, 0, 25, 38, 40, 41, 48, 36],  # Raccoon
    [32, 25, 0, 36, 38, 39, 47, 34],  # Weasel
    [40, 38, 36, 0, 10, 35, 45, 30],  # Bear
    [42, 40, 38, 10, 0, 37, 46, 32],  # Giant panda
    [43, 41, 39, 35, 37, 0, 44, 33],  # Dog
    [50, 48, 47, 45, 46, 44, 0, 43],  # Cat
    [38, 36, 34, 30, 32, 33, 43, 0],  # Seal
])

im = ax2.imshow(distances, cmap='YlOrRd_r', aspect='auto')
ax2.set_xticks(range(len(species)))
ax2.set_yticks(range(len(species)))
ax2.set_xticklabels(species, rotation=45, ha='right', color='white', fontsize=8)
ax2.set_yticklabels(species, color='white', fontsize=8)
ax2.set_title('Genetic Distance Matrix', color='white', fontsize=12)
for i in range(len(species)):
    for j in range(len(species)):
        ax2.text(j, i, f'{distances[i,j]}', ha='center', va='center',
                 color='white' if distances[i,j] > 30 else 'black', fontsize=8)
plt.colorbar(im, ax=ax2, label='Genetic distance')

plt.tight_layout()
plt.show()

print("Key findings from phylogenetics:")
print("  - Red panda: its own family (Ailuridae), no close living relatives")
print("  - Giant panda: actually a BEAR (family Ursidae)")
print("  - Both 'pandas' evolved bamboo-eating independently")
print("  - The name 'panda' comes from the RED panda (described first, in 1825)")
print("  - The giant panda was named after it (1869) — a taxonomic confusion")`,
      challenge: 'The tree shows bears and seals are related (Arctoidea). Seals evolved from bear-like ancestors! Add a new species — the walrus — to the distance matrix. Where would it branch off?',
      successHint: 'Phylogenetics is the GPS of evolutionary biology — it tells us where every species came from and who its relatives are. Modern phylogenomics uses entire genomes (billions of bases) to build incredibly precise trees.',
    },
    {
      title: 'Molecular clocks — DNA as a timepiece',
      concept: `DNA mutates at a roughly constant rate. This makes it a **molecular clock** — by counting the number of DNA differences between two species, we can estimate when they diverged.

**How it works:**
1. Compare DNA sequences from two species
2. Count the differences (substitutions per site)
3. Divide by the mutation rate (calibrated from fossils)
4. Result = estimated divergence time

**Calibrating the clock:**
- We need at least one known divergence time (from fossils)
- Example: the oldest bear fossil is ~20 million years old
- Bear-dog DNA distance = 35 substitutions/100 sites
- Mutation rate ≈ 35/20 = 1.75 substitutions/100 sites per million years

**Complications:**
- Mutation rates vary between genes (fast genes vs. slow genes)
- Rates vary between lineages (rodents mutate faster than elephants)
- Not all mutations are neutral (selection removes some, fixes others)
- Saturation: very distant species may have mutations on top of mutations

**Red panda clock:** ~47 million years of molecular evolution separate the red panda from its nearest living relatives.`,
      analogy: 'The molecular clock is like a dripping faucet. Each drip is a mutation. If the faucet drips once per minute, and you count 60 drips in the bucket, you know the faucet has been dripping for an hour. DNA "drips" mutations at a roughly constant rate. More differences = more time since the species shared an ancestor.',
      storyConnection: 'The molecular clock reveals that the red panda\'s lineage is ancient — 47 million years of independent evolution. That is older than the Himalayas themselves (which began rising ~50 Mya but only reached current heights ~15 Mya). The red panda\'s ancestors watched the mountains grow.',
      checkQuestion: 'If the molecular clock says two species diverged 10 million years ago, but the oldest fossil of either species is only 2 million years old, which do we trust?',
      checkAnswer: 'Both, carefully. Fossils give a MINIMUM age (the oldest fossil found so far, but older ones may exist). The molecular clock gives an ESTIMATE (subject to assumptions about mutation rate). Usually the molecular clock date is older because fossils are rare and fragile. The best approach combines both: use fossils to calibrate the clock, then use the clock to fill gaps in the fossil record.',
      codeIntro: 'Implement a molecular clock and estimate divergence times.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate molecular evolution
seq_length = 1000  # bases
mutation_rate = 1e-8  # per base per year (typical mammalian rate)

def evolve_sequence(seq, years, mut_rate, seq_len):
    """Evolve a sequence for given years."""
    n_mutations = np.random.poisson(mut_rate * seq_len * years)
    new_seq = seq.copy()
    for _ in range(n_mutations):
        pos = np.random.randint(seq_len)
        new_seq[pos] = np.random.choice([0, 1, 2, 3])
    return new_seq

# Start with an ancestral sequence
ancestor = np.random.choice([0, 1, 2, 3], seq_length)

# Simulate divergence at different times
divergence_times = {
    'Bear vs Giant panda': 12e6,
    'Raccoon vs Weasel': 25e6,
    'Red panda vs Raccoon': 47e6,
    'Cat vs Dog': 55e6,
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Molecular clock: mutations accumulate linearly with time
ax1.set_facecolor('#111827')
years_range = np.linspace(0, 60e6, 100)
expected_diffs = 2 * mutation_rate * seq_length * years_range  # factor of 2: both lineages mutate

ax1.plot(years_range / 1e6, expected_diffs, color='#22c55e', linewidth=2, label='Expected (clock)')

# Simulate many replications
for trial in range(20):
    diffs_trial = []
    for yrs in np.linspace(1e6, 60e6, 20):
        s1 = evolve_sequence(ancestor, yrs, mutation_rate, seq_length)
        s2 = evolve_sequence(ancestor, yrs, mutation_rate, seq_length)
        diff = np.sum(s1 != s2) + np.sum(s1 != ancestor)  # simplified
        diffs_trial.append(diff)
    ax1.scatter(np.linspace(1, 60, 20), diffs_trial, s=10, color='#3b82f6', alpha=0.3)

# Plot known divergences
colors_div = ['#ef4444', '#f59e0b', '#8b5cf6', '#ec4899']
for (name, time), color in zip(divergence_times.items(), colors_div):
    expected = 2 * mutation_rate * seq_length * time
    ax1.scatter(time / 1e6, expected, s=100, color=color, zorder=5, edgecolors='white')
    ax1.annotate(name, xy=(time/1e6, expected), xytext=(5, 10),
                 textcoords='offset points', color=color, fontsize=8)

ax1.set_xlabel('Divergence time (million years)', color='white')
ax1.set_ylabel('DNA differences (per 1000 bases)', color='white')
ax1.set_title('The Molecular Clock', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Clock calibration uncertainty
ax2.set_facecolor('#111827')
# Same data but with confidence intervals
true_rate = mutation_rate
estimated_rates = np.random.normal(true_rate, true_rate * 0.2, 1000)  # 20% uncertainty

for name, time in divergence_times.items():
    estimates = 2 * estimated_rates * seq_length * time / 1e6  # in Mya
    time_estimates = time / 1e6 * np.random.normal(1, 0.15, 1000)

true_times = list(divergence_times.values())
names = list(divergence_times.keys())
estimated_ranges = []

for time in true_times:
    low = time / 1e6 * 0.7
    mid = time / 1e6
    high = time / 1e6 * 1.3
    estimated_ranges.append((low, mid, high))

y_pos = range(len(names))
for i, (name, (low, mid, high)) in enumerate(zip(names, estimated_ranges)):
    ax2.barh(i, high - low, left=low, color=colors_div[i], alpha=0.4, height=0.6)
    ax2.plot(mid, i, 'D', color=colors_div[i], markersize=8)
    ax2.text(high + 1, i, f'{mid:.0f} Mya\
({low:.0f}-{high:.0f})', va='center',
             color=colors_div[i], fontsize=9)

ax2.set_yticks(y_pos)
ax2.set_yticklabels(names, color='white', fontsize=9)
ax2.set_xlabel('Estimated divergence time (Mya)', color='white')
ax2.set_title('Clock Estimates with Uncertainty', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Molecular clock results:")
for name, time in divergence_times.items():
    diffs = 2 * mutation_rate * seq_length * time
    print(f"  {name}: {time/1e6:.0f} Mya, ~{diffs:.0f} differences per 1000 bases")
print()
print("The clock is imperfect but powerful:")
print("  \±20-30% uncertainty is typical")
print("  Better calibration = better estimates")
print("  Whole-genome clocks are much more precise")`,
      challenge: 'The mutation rate for mitochondrial DNA is ~10x faster than nuclear DNA. Recalculate divergence times using mitochondrial rates. Why might faster-evolving genes be better for closely related species?',
      successHint: 'The molecular clock revolutionized evolutionary biology. Before DNA sequencing, we relied entirely on fossils (which are incomplete). Now we can date any split between any two species with a blood or tissue sample — no fossils needed.',
    },
    {
      title: 'Speciation — how one species becomes two',
      concept: `The red panda has two recognized subspecies: **Ailurus fulgens fulgens** (Himalayan) and **Ailurus fulgens styani** (Chinese). They may be splitting into separate species. This process — **speciation** — is how biodiversity is created.

**Modes of speciation:**
1. **Allopatric**: populations separated by a physical barrier (mountain, river, ocean). Most common.
2. **Sympatric**: speciation without physical separation (different food preferences, different mating times).
3. **Parapatric**: populations adjacent but in different habitats (edge of a forest and grassland).
4. **Peripatric**: small population at the edge of a larger one diverges.

**The speciation process:**
1. Population is split (or subgroups stop interbreeding)
2. Each group accumulates different mutations
3. Natural selection adapts each group to its local environment
4. Eventually, they can no longer interbreed — they're separate species

**Red panda subspecies:**
- Himalayan: smaller, lighter face, found in Nepal/India
- Chinese: larger, redder, darker face rings, found in China/Myanmar
- Separated by the Nujiang River (a geographic barrier)
- Diverged ~0.22 million years ago (molecular clock estimate)`,
      analogy: 'Speciation is like two groups of friends who stop hanging out. At first, they speak the same language and share the same jokes. But over years apart, each group develops its own slang, inside jokes, and references. Eventually, when they meet again, they can barely understand each other. If enough time passes, they effectively speak different languages — they\'ve "speciated" culturally.',
      storyConnection: 'The red panda\'s two subspecies are on either side of the Nujiang River in southwestern China. The river — a geographic barrier just like a mountain range or ocean — prevented interbreeding long enough for the two populations to begin diverging. The story of the mask may have two endings: one Himalayan, one Chinese.',
      checkQuestion: 'How long until the two red panda subspecies become fully separate species?',
      checkAnswer: 'There is no fixed timeline. They diverged ~220,000 years ago and already show morphological differences. Full reproductive isolation typically takes 1-10 million years for mammals. However, if habitat loss eliminates the zones where they might naturally re-contact, human activity could accelerate the split — or cause one subspecies to go extinct before the process completes.',
      codeIntro: 'Simulate allopatric speciation with two diverging populations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate two populations diverging after a barrier forms
generations = 500
pop_size = 200
n_genes = 50  # track 50 gene loci

# Initial population (shared gene frequencies)
initial_freqs = np.random.uniform(0.3, 0.7, n_genes)

# Two populations start identical
pop1_freqs = initial_freqs.copy()
pop2_freqs = initial_freqs.copy()

# Different selection pressures (different environments)
optimal1 = np.random.uniform(0, 1, n_genes)  # Himalayan environment
optimal2 = np.random.uniform(0, 1, n_genes)  # Chinese environment

history_diff = []
history_p1 = []
history_p2 = []

for gen in range(generations):
    # Genetic drift + selection for each population
    for i in range(n_genes):
        # Drift (random sampling)
        pop1_freqs[i] += np.random.normal(0, 0.01)
        pop2_freqs[i] += np.random.normal(0, 0.01)

        # Selection (push toward local optimum)
        pop1_freqs[i] += 0.005 * (optimal1[i] - pop1_freqs[i])
        pop2_freqs[i] += 0.005 * (optimal2[i] - pop2_freqs[i])

        # Keep in bounds
        pop1_freqs[i] = np.clip(pop1_freqs[i], 0.01, 0.99)
        pop2_freqs[i] = np.clip(pop2_freqs[i], 0.01, 0.99)

    # Measure genetic distance (Fst-like)
    diff = np.mean(np.abs(pop1_freqs - pop2_freqs))
    history_diff.append(diff)
    history_p1.append(pop1_freqs.copy())
    history_p2.append(pop2_freqs.copy())

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Genetic distance over time
axes[0,0].set_facecolor('#111827')
axes[0,0].plot(range(generations), history_diff, color='#ef4444', linewidth=2)
axes[0,0].set_xlabel('Generations after barrier', color='white')
axes[0,0].set_ylabel('Genetic distance', color='white')
axes[0,0].set_title('Divergence Over Time', color='white', fontsize=12)
axes[0,0].tick_params(colors='gray')

# Species threshold
threshold = 0.3
axes[0,0].axhline(threshold, color='#f59e0b', linestyle='--',
                   label=f'Speciation threshold ({threshold})')
if any(d > threshold for d in history_diff):
    spec_gen = next(i for i, d in enumerate(history_diff) if d > threshold)
    axes[0,0].axvline(spec_gen, color='#f59e0b', linestyle=':', alpha=0.5)
    axes[0,0].text(spec_gen + 5, threshold + 0.02, f'Speciation at gen {spec_gen}',
                   color='#f59e0b', fontsize=9)
axes[0,0].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Gene frequency comparison at start and end
axes[0,1].set_facecolor('#111827')
axes[0,1].scatter(initial_freqs, initial_freqs, color='#3b82f6', alpha=0.5, label='Start (identical)')
axes[0,1].scatter(pop1_freqs, pop2_freqs, color='#ef4444', alpha=0.5, label='End (diverged)')
axes[0,1].plot([0, 1], [0, 1], '--', color='gray', alpha=0.3)
axes[0,1].set_xlabel('Population 1 frequency', color='white')
axes[0,1].set_ylabel('Population 2 frequency', color='white')
axes[0,1].set_title('Gene Frequencies: Start vs End', color='white', fontsize=12)
axes[0,1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[0,1].tick_params(colors='gray')

# Trait distribution comparison
axes[1,0].set_facecolor('#111827')
trait1 = np.random.normal(np.mean(pop1_freqs) * 100, 10, 200)
trait2 = np.random.normal(np.mean(pop2_freqs) * 100, 10, 200)
axes[1,0].hist(trait1, bins=25, alpha=0.6, color='#22c55e', label='Himalayan pop.', density=True)
axes[1,0].hist(trait2, bins=25, alpha=0.6, color='#ef4444', label='Chinese pop.', density=True)
axes[1,0].set_xlabel('Body size trait', color='white')
axes[1,0].set_ylabel('Frequency', color='white')
axes[1,0].set_title('Trait Distributions After Divergence', color='white', fontsize=12)
axes[1,0].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[1,0].tick_params(colors='gray')

# Hybrid fitness over time
axes[1,1].set_facecolor('#111827')
hybrid_fitness = []
for gen in range(0, generations, 10):
    p1 = np.array(history_p1[gen])
    p2 = np.array(history_p2[gen])
    hybrid = (p1 + p2) / 2  # hybrid has intermediate genes
    # Fitness: how well does hybrid match either environment?
    fit1 = np.exp(-2 * np.mean((hybrid - optimal1)**2))
    fit2 = np.exp(-2 * np.mean((hybrid - optimal2)**2))
    hybrid_fitness.append(max(fit1, fit2))

axes[1,1].plot(range(0, generations, 10), hybrid_fitness, color='#8b5cf6', linewidth=2)
axes[1,1].set_xlabel('Generations after barrier', color='white')
axes[1,1].set_ylabel('Hybrid fitness', color='white')
axes[1,1].set_title('Hybrid Fitness Declines Over Time', color='white', fontsize=12)
axes[1,1].tick_params(colors='gray')
axes[1,1].axhline(0.5, color='#ef4444', linestyle='--', alpha=0.5, label='Reproductive isolation')
axes[1,1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Speciation simulation:")
print(f"  Starting distance: {history_diff[0]:.3f}")
print(f"  Ending distance: {history_diff[-1]:.3f}")
print(f"  Divergence increased {history_diff[-1]/history_diff[0]:.1f}x")
print()
print("Real red panda subspecies:")
print("  Divergence: ~220,000 years ago")
print("  Barrier: Nujiang River")
print("  Status: subspecies (not yet full species)")`,
      challenge: 'Add a "corridor" that allows 5% gene flow per generation between the populations. Does speciation still occur? What migration rate prevents speciation entirely?',
      successHint: 'Speciation is the engine that created the millions of species on Earth. Understanding it helps conservationists decide whether to maintain or reconnect fragmented populations — a critical decision for red pandas and many other endangered species.',
    },
    {
      title: 'Convergent evolution — when unrelated species look alike',
      concept: `Red pandas and raccoons look remarkably similar — ringed tails, masked faces, similar size. But they diverged 47 million years ago. This is **convergent evolution**: unrelated species independently evolving similar traits because they face similar challenges.

**Famous examples:**
- **Eyes**: evolved independently 40+ times (vertebrates, insects, mollusks)
- **Wings**: birds, bats, insects — three completely different mechanisms
- **Streamlined body**: sharks (fish), dolphins (mammals), ichthyosaurs (reptiles)
- **False thumbs**: red pandas and giant pandas (different bones, same function)
- **Echolocation**: bats and dolphins (independently evolved sonar)

**Why does convergence happen?**
Physics constrains biology. There are only so many efficient ways to:
- Move through water (streamlined shape)
- Fly (wing surface area formula)
- Grip bamboo (need an opposable digit)
- See in the dark (large eyes or echolocation)

**Convergence vs. homology:**
- **Homology**: same trait from shared ancestor (human arm, whale flipper = same bones)
- **Convergence**: similar trait from different origins (bird wing, bat wing = different structures)`,
      analogy: 'Convergent evolution is like different architects designing airports. Without collaborating, they all arrive at similar designs: large open halls, long corridors, gates at the edges. Not because they copied each other, but because the PROBLEM (moving thousands of people efficiently) has a limited number of good solutions. Nature\'s "problems" (moving through water, gripping food) have similarly constrained solutions.',
      storyConnection: 'The red panda\'s mask resembles a raccoon\'s, but for different reasons. The raccoon\'s mask may reduce glare (like football players\' eye black). The red panda\'s mask breaks up its facial outline for camouflage. Same appearance, different purpose, different evolutionary path — convergence in action.',
      checkQuestion: 'Sugar gliders (marsupials) and flying squirrels (rodents) look almost identical and fill the same ecological role. They last shared a common ancestor over 100 million years ago. How is this possible?',
      checkAnswer: 'Both needed to glide between trees to find food and escape predators. The physics of gliding demands a flat membrane between limbs and a lightweight body. Evolution independently arrived at the same solution in Australia (sugar glider) and North America (flying squirrel). The constraints of gliding physics are stronger than the constraints of ancestry.',
      codeIntro: 'Analyze convergent evolution by comparing trait similarity vs. genetic relatedness.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Convergent vs homologous traits
# Plot: genetic distance vs trait similarity
species_pairs = {
    'Human-Chimp': {'genetic_dist': 1.2, 'trait_sim': 95, 'type': 'homologous'},
    'Human-Gorilla': {'genetic_dist': 3.1, 'trait_sim': 90, 'type': 'homologous'},
    'Wolf-Dog': {'genetic_dist': 0.2, 'trait_sim': 98, 'type': 'homologous'},
    'Shark-Dolphin': {'genetic_dist': 80, 'trait_sim': 85, 'type': 'convergent'},
    'Bat-Bird wings': {'genetic_dist': 75, 'trait_sim': 70, 'type': 'convergent'},
    'Red panda-Raccoon': {'genetic_dist': 47, 'trait_sim': 75, 'type': 'convergent'},
    'Red panda-Giant panda': {'genetic_dist': 50, 'trait_sim': 60, 'type': 'convergent'},
    'Sugar glider-Flying squirrel': {'genetic_dist': 100, 'trait_sim': 90, 'type': 'convergent'},
    'Cat-Lion': {'genetic_dist': 10, 'trait_sim': 80, 'type': 'homologous'},
    'Mole-Mole cricket': {'genetic_dist': 120, 'trait_sim': 65, 'type': 'convergent'},
}

ax1.set_facecolor('#111827')
for name, data in species_pairs.items():
    color = '#22c55e' if data['type'] == 'homologous' else '#ef4444'
    marker = 'o' if data['type'] == 'homologous' else 's'
    ax1.scatter(data['genetic_dist'], data['trait_sim'], s=80, color=color,
                marker=marker, edgecolors='white', linewidth=0.5)
    ax1.annotate(name, xy=(data['genetic_dist'], data['trait_sim']),
                 xytext=(5, 5), textcoords='offset points', color='white', fontsize=7)

# Add expected correlation for homologous traits
x_hom = np.linspace(0, 20, 50)
y_hom = 100 - 0.5 * x_hom  # more distant = less similar
ax1.plot(x_hom, y_hom, '--', color='#22c55e', alpha=0.5, label='Homology trend')

ax1.scatter([], [], color='#22c55e', marker='o', label='Homologous (shared ancestry)')
ax1.scatter([], [], color='#ef4444', marker='s', label='Convergent (independent)')
ax1.set_xlabel('Genetic distance', color='white')
ax1.set_ylabel('Trait similarity (%)', color='white')
ax1.set_title('Convergent traits defy the genetic distance rule', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Simulate convergent evolution
ax2.set_facecolor('#111827')
generations = 300
# Two unrelated species (start at different trait values)
# Same environmental pressure (same optimal)
optimal = 70

species_A = [20]  # starts far from optimal
species_B = [90]  # starts on the other side

for gen in range(generations):
    # Selection + drift
    a = species_A[-1] + 0.15 * (optimal - species_A[-1]) + np.random.normal(0, 1)
    b = species_B[-1] + 0.15 * (optimal - species_B[-1]) + np.random.normal(0, 1)
    species_A.append(a)
    species_B.append(b)

ax2.plot(range(len(species_A)), species_A, color='#22c55e', linewidth=2, label='Species A (unrelated)')
ax2.plot(range(len(species_B)), species_B, color='#3b82f6', linewidth=2, label='Species B (unrelated)')
ax2.axhline(optimal, color='#f59e0b', linestyle='--', label=f'Environmental optimum ({optimal})')
ax2.set_xlabel('Generations', color='white')
ax2.set_ylabel('Trait value', color='white')
ax2.set_title('Two Unrelated Species Converge on Same Trait', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Convergent evolution examples involving red pandas:")
print("  1. Red panda + raccoon: similar face masks (different function)")
print("  2. Red panda + giant panda: false thumbs (different bones!)")
print("  3. Red panda + ringtail cat: ringed tails (different lineages)")
print()
print("Convergence proves that natural selection is a powerful designer —")
print("it independently discovers the same solutions to the same problems.")`,
      challenge: 'Add a third species starting at trait value 50 (already near optimal). Does it converge faster? What if the optimal shifts every 50 generations — do all three species track it?',
      successHint: 'Convergent evolution is evidence that evolution is not random — it\'s channeled by physics and ecology toward limited sets of solutions. Recognizing convergence vs. homology is essential for correctly reading the tree of life.',
    },
    {
      title: 'Genetic drift — randomness in small populations',
      concept: `Natural selection is not the only force of evolution. **Genetic drift** — random changes in gene frequency due to chance — is especially powerful in small populations like the red panda.

**How drift works:**
Imagine a population of 10 red pandas, 5 with gene variant A and 5 with variant B. In the next generation, by pure chance, 7 might have A and 3 might have B. Not because A is "better," but because random mating and random survival shifted the balance.

**Key properties:**
- Drift is **stronger in small populations** (more random fluctuation)
- Drift is **directionless** (unlike selection, it doesn't move toward "better")
- Drift can **fix** or **eliminate** alleles purely by chance
- Drift reduces **genetic diversity** over time

**For red pandas:**
- ~10,000 individuals remaining
- Fragmented into small, isolated populations
- Small populations + isolation = strong genetic drift
- Drift is eroding their genetic diversity faster than mutation can replace it
- This makes them more vulnerable to disease and environmental change`,
      analogy: 'Genetic drift is like a game of telephone with very few players. With 1000 players, the message stays mostly intact (each error is diluted). With 5 players, a single misheard word dramatically changes the final message. Red pandas are playing telephone with very few players — random "errors" in gene transmission have outsized effects.',
      storyConnection: 'Each isolated red panda population in the eastern Himalayas is playing its own game of genetic telephone. Without corridors to connect them, drift will make each population genetically distinct — but not through adaptation. Through pure randomness. The "mask" that each population wears may subtly change not because of predators, but because of chance.',
      checkQuestion: 'In a population of 10,000 red pandas, an allele has a frequency of 50%. What\'s the probability it will be completely lost by drift alone in the next generation?',
      checkAnswer: 'Essentially zero. In a large population, drift is negligible for common alleles. But in a population of 20 red pandas, the same allele has a meaningful probability of being lost within 50-100 generations. This is why population size matters so much for conservation — it\'s not just about having "enough" animals, it\'s about having enough to buffer against random loss of genetic variation.',
      codeIntro: 'Simulate genetic drift in populations of different sizes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

generations = 200

# Drift in different population sizes
pop_sizes = [20, 100, 1000, 10000]
colors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e']

for idx, (N, color) in enumerate(zip(pop_sizes, colors)):
    ax = axes[idx // 2, idx % 2]
    ax.set_facecolor('#111827')

    # Simulate 10 alleles, each starting at 50%
    for allele in range(10):
        freq = 0.5
        freqs = [freq]
        for gen in range(generations):
            # Binomial sampling (Wright-Fisher model)
            count = np.random.binomial(2 * N, freq)
            freq = count / (2 * N)
            freqs.append(freq)
        ax.plot(range(generations + 1), freqs, color=color, alpha=0.5, linewidth=1)

    ax.set_xlabel('Generation', color='white')
    ax.set_ylabel('Allele frequency', color='white')
    ax.set_title(f'N = {N:,} ({"red panda scale" if N == 10000 else "fragment" if N < 100 else "moderate"})',
                 color='white', fontsize=11)
    ax.set_ylim(-0.05, 1.05)
    ax.axhline(0.5, color='gray', linestyle=':', alpha=0.3)
    ax.tick_params(colors='gray')

plt.suptitle('Genetic Drift: Small Populations Lose Variation Faster',
             color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

# Calculate fixation/loss rates
print("Allele fixation/loss after 200 generations:")
for N in pop_sizes:
    fixed = 0
    lost = 0
    trials = 100
    for _ in range(trials):
        freq = 0.5
        for gen in range(200):
            freq = np.random.binomial(2*N, freq) / (2*N)
            if freq == 0 or freq == 1:
                break
        if freq == 0: lost += 1
        elif freq == 1: fixed += 1
    print(f"  N={N:>6,}: {lost}% lost, {fixed}% fixed, {100-lost-fixed}% still varying")`,
      challenge: 'Simulate what happens when a population of 10,000 red pandas is fragmented into 10 isolated groups of 1,000. After 100 generations, how much genetic diversity remains in each fragment vs. the original whole?',
      successHint: 'Genetic drift is why conservationists obsess over population size and connectivity. A species can be "safe" in numbers but genetically doomed if those numbers are split into tiny, isolated fragments. Wildlife corridors save not just animals — they save genetic diversity.',
    },
    {
      title: 'Conservation genetics — saving species with DNA',
      concept: `Modern conservation doesn't just count animals — it reads their DNA. **Conservation genetics** uses genetic tools to make smarter decisions about saving endangered species.

**Key applications:**
1. **Measuring genetic diversity**: heterozygosity, allelic richness
2. **Detecting inbreeding**: runs of homozygosity in the genome
3. **Identifying populations**: which groups are genetically distinct?
4. **Forensics**: DNA from confiscated fur → which population was poached?
5. **Breeding programs**: pair animals to maximize genetic diversity
6. **Environmental DNA (eDNA)**: detect species from water/soil samples

**Red panda conservation genetics:**
- Two subspecies confirmed by DNA (not just appearance)
- Chinese population has lower genetic diversity (smaller effective population)
- Captive breeding programs use "mean kinship" to pair unrelated individuals
- eDNA surveys detect red pandas from fecal samples in streams

**Effective population size (Ne):**
The actual population might be 10,000, but the "effective" population (in terms of genetic drift) is often much smaller due to unequal sex ratios, variation in offspring number, and population fluctuations. Red panda Ne is estimated at ~2,500 — dangerously low.`,
      analogy: 'Conservation genetics is like checking the hard drive of an endangered computer. Even if the computer still runs (the species still exists), if the hard drive is corrupted (low genetic diversity), it\'s one virus (disease) away from crashing permanently. Reading the DNA is reading the hard drive — it tells you how healthy the system really is beneath the surface.',
      storyConnection: 'The red panda\'s mask is not just a story — it\'s encoded in DNA that conservation geneticists are racing to catalog and protect. Every genetic variant lost to drift or inbreeding is a page torn from a 47-million-year-old book. Conservation genetics aims to keep the book intact for future generations.',
      checkQuestion: 'A zoo has 50 red pandas. A geneticist says their effective population size is only 15. How is that possible?',
      checkAnswer: 'Effective population size drops when: (1) unequal sex ratio (if 5 males father most cubs, Ne drops dramatically), (2) variance in family size (one pair has 10 cubs, another has 0), (3) overlapping generations complicate things, (4) some animals don\'t breed at all. Ne = 4 * Nm * Nf / (Nm + Nf), where Nm and Nf are breeding males and females. If 5 males and 45 females breed: Ne = 4*5*45/50 = 18. That\'s why breeding programs carefully manage pairings.',
      codeIntro: 'Implement conservation genetics tools for managing endangered populations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 2, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# 1. Genetic diversity loss over time
axes[0,0].set_facecolor('#111827')
Ne_values = [50, 100, 500, 2500, 10000]
generations = 100
for Ne in Ne_values:
    # Heterozygosity decays as H(t) = H(0) * (1 - 1/(2*Ne))^t
    t = np.arange(generations)
    H = 0.5 * (1 - 1/(2*Ne))**t
    axes[0,0].plot(t, H, linewidth=2, label=f'Ne = {Ne}')

axes[0,0].axhline(0.1, color='#ef4444', linestyle='--', alpha=0.5, label='Critical diversity')
axes[0,0].set_xlabel('Generations', color='white')
axes[0,0].set_ylabel('Heterozygosity', color='white')
axes[0,0].set_title('Genetic Diversity Loss by Population Size', color='white', fontsize=11)
axes[0,0].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
axes[0,0].tick_params(colors='gray')

# 2. Inbreeding coefficient
axes[0,1].set_facecolor('#111827')
for Ne in [50, 500, 2500]:
    t = np.arange(200)
    F = 1 - (1 - 1/(2*Ne))**t  # inbreeding coefficient
    axes[0,1].plot(t, F * 100, linewidth=2, label=f'Ne = {Ne}')

axes[0,1].axhline(10, color='#ef4444', linestyle='--', alpha=0.5, label='Dangerous inbreeding (10%)')
axes[0,1].set_xlabel('Generations', color='white')
axes[0,1].set_ylabel('Inbreeding coefficient (%)', color='white')
axes[0,1].set_title('Inbreeding Accumulation', color='white', fontsize=11)
axes[0,1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
axes[0,1].tick_params(colors='gray')

# 3. Mean kinship breeding strategy
axes[1,0].set_facecolor('#111827')
# Simulate 20 captive animals with kinship values
n_animals = 20
kinship_matrix = np.random.uniform(0, 0.3, (n_animals, n_animals))
kinship_matrix = (kinship_matrix + kinship_matrix.T) / 2
np.fill_diagonal(kinship_matrix, 0.5)

# Mean kinship for each animal
mean_kinship = np.mean(kinship_matrix, axis=1)
sorted_idx = np.argsort(mean_kinship)

colors_bar = ['#22c55e' if mk < 0.15 else '#f59e0b' if mk < 0.2 else '#ef4444'
              for mk in mean_kinship[sorted_idx]]
axes[1,0].barh(range(n_animals), mean_kinship[sorted_idx], color=colors_bar)
axes[1,0].set_xlabel('Mean kinship', color='white')
axes[1,0].set_ylabel('Animal ID', color='white')
axes[1,0].set_title('Breeding Priority (low kinship = high priority)', color='white', fontsize=11)
axes[1,0].tick_params(colors='gray')

# 4. Corridor vs no corridor simulation
axes[1,1].set_facecolor('#111827')
# Two fragments, with and without corridor
for scenario, migration, color, label in [('No corridor', 0, '#ef4444', 'Isolated fragments'),
                                           ('Corridor', 0.05, '#22c55e', 'Connected fragments')]:
    total_diversity = []
    pop1_freq = 0.5
    pop2_freq = 0.5

    for gen in range(200):
        # Drift in each fragment
        pop1_freq = np.random.binomial(200, pop1_freq) / 200
        pop2_freq = np.random.binomial(200, pop2_freq) / 200

        # Migration through corridor
        if migration > 0:
            exchange = migration * (pop1_freq - pop2_freq)
            pop1_freq -= exchange
            pop2_freq += exchange
            pop1_freq = np.clip(pop1_freq, 0, 1)
            pop2_freq = np.clip(pop2_freq, 0, 1)

        avg_freq = (pop1_freq + pop2_freq) / 2
        diversity = 2 * avg_freq * (1 - avg_freq)  # expected heterozygosity
        total_diversity.append(diversity)

    axes[1,1].plot(range(200), total_diversity, color=color, linewidth=2, label=label)

axes[1,1].set_xlabel('Generations', color='white')
axes[1,1].set_ylabel('Genetic diversity', color='white')
axes[1,1].set_title('Corridors Maintain Diversity', color='white', fontsize=11)
axes[1,1].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[1,1].tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Conservation genetics priorities for red pandas:")
print(f"  Estimated Ne: ~2,500 (from total pop ~10,000)")
print(f"  At Ne=2500: loses 0.02% heterozygosity per generation")
print(f"  At Ne=100 (fragment): loses 0.5% per generation (25x faster!)")
print()
print("  Action items:")
print("  1. Maintain corridors between fragments")
print("  2. Managed breeding to minimize mean kinship")
print("  3. Genetic monitoring (eDNA, fecal DNA)")
print("  4. Potentially translocate individuals between fragments")`,
      challenge: 'A conservation plan proposes translocating 2 red pandas per year between the two subspecies. Simulate how this migration rate affects genetic diversity over 100 generations. Is it enough?',
      successHint: 'Conservation genetics is where evolutionary biology meets real-world action. The tools you\'ve learned — phylogenetics, molecular clocks, speciation, drift — all converge on one practical question: how do we keep this species genetically healthy enough to survive the next century?',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Evolutionary Biology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for evolutionary biology simulations. Click to start.</p>
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