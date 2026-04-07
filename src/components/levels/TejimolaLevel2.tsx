import { useState, useRef, useCallback } from 'react';
import { Loader2, Zap } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TejimolaLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Genetics — why offspring resemble parents',
      concept: `In Level 1 you learned that DNA carries instructions. In Level 2, we learn how those instructions are **inherited**. When two plants cross-pollinate, each parent contributes half its DNA to the offspring. The combination determines the offspring's traits.

**Gregor Mendel** discovered this in the 1860s by crossing pea plants. He found that traits like flower color follow predictable patterns:
- Each trait is controlled by a **gene** (a section of DNA)
- Each gene has two copies (**alleles**) — one from each parent
- One allele can be **dominant** (expressed even with one copy)
- The other can be **recessive** (only expressed with two copies)`,
      analogy: 'Alleles are like two competing recipe suggestions. If one chef (dominant allele) insists on chocolate cake, you get chocolate cake — even if the other chef (recessive) wanted vanilla. You only get vanilla if both chefs agree on it.',
      storyConnection: 'If Tejimola\'s tulsi produced seeds and those seeds grew into new plants, each seedling would inherit traits from both parents. Some might be taller, some more fragrant, some more disease-resistant. That genetic variation is what drives evolution.',
      checkQuestion: 'A plant has one allele for purple flowers (dominant, P) and one for white flowers (recessive, p). What color are its flowers?',
      checkAnswer: 'Purple. The dominant allele P is expressed whenever at least one copy is present. The plant\'s genotype is Pp, but its phenotype (visible trait) is purple. Only pp gives white flowers.',
      codeIntro: 'Simulate a Punnett square to predict offspring traits.',
      code: `import numpy as np

# Punnett Square: cross two Pp parents (both purple flowers)
parent1 = ['P', 'p']
parent2 = ['P', 'p']

print("Punnett Square: Pp × Pp")
print("=" * 30)
print(f"         Parent 2")
print(f"         {parent2[0]:>4s}  {parent2[1]:>4s}")
print(f"Parent 1")

offspring = []
for a1 in parent1:
    row = []
    for a2 in parent2:
        genotype = a1 + a2
        # Sort so Pp and pP are the same
        genotype = ''.join(sorted(genotype, key=lambda x: x.lower()))
        row.append(genotype)
        offspring.append(genotype)
    print(f"    {a1:>4s}   {row[0]:>4s}  {row[1]:>4s}")

print()
print("Offspring genotypes:")
from collections import Counter
counts = Counter(offspring)
for genotype, count in sorted(counts.items()):
    phenotype = 'Purple' if 'P' in genotype else 'White'
    print(f"  {genotype}: {count}/4 = {count*25}% → {phenotype}")

print()
purple = sum(1 for g in offspring if 'P' in g)
white = sum(1 for g in offspring if g == 'pp')
print(f"Ratio: {purple} purple : {white} white = 3:1")
print("This is Mendel's famous 3:1 ratio!")`,
      challenge: 'Cross a PP (homozygous purple) with a pp (homozygous white). What ratio do you expect? All offspring should be Pp (all purple). Verify with code.',
      successHint: 'The Punnett square predicts inheritance with perfect accuracy for simple single-gene traits. Real genetics is messier (multiple genes, environmental effects), but the logic is the same.',
    },
    {
      title: 'Punnett squares at scale — simulating 1000 crosses',
      concept: `A Punnett square predicts probabilities. But probabilities only show up clearly in **large numbers**. Cross two Pp parents once and you get one random outcome. Cross them 1000 times and the 3:1 ratio emerges clearly.

This is the **law of large numbers**: the more trials you run, the closer the observed ratio gets to the predicted one. With 4 offspring, you might get 2 purple and 2 white (not 3:1). With 1000, you'll get very close to 750:250.

This principle applies everywhere: coin flips (50:50 only with many flips), drug trials (need thousands of patients), and genetics (Mendel grew ~30,000 pea plants to get clear ratios).`,
      storyConnection: 'If Tejimola\'s garden produced 1000 tulsi seedlings from cross-pollination, roughly 750 would show the dominant trait and 250 the recessive. The story\'s "spirit" is really the statistical certainty of genetics at scale.',
      codeIntro: 'Simulate 1000 crosses and watch the 3:1 ratio emerge.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate Pp × Pp cross, 1000 times
n_crosses = 1000
results = []

for _ in range(n_crosses):
    # Each parent contributes one random allele
    allele1 = np.random.choice(['P', 'p'])
    allele2 = np.random.choice(['P', 'p'])
    genotype = allele1 + allele2
    phenotype = 'Purple' if 'P' in genotype else 'White'
    results.append(phenotype)

purple = results.count('Purple')
white = results.count('White')

# Track ratio convergence
ratios = []
for i in range(1, n_crosses + 1):
    p = results[:i].count('Purple')
    ratios.append(p / i * 100)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Bar chart
ax1.set_facecolor('#111827')
ax1.bar(['Purple', 'White'], [purple, white], color=['#a855f7', '#e5e7eb'])
ax1.set_title(f'Results: {purple} Purple, {white} White', color='white', fontsize=11)
ax1.set_ylabel('Count', color='white')
ax1.tick_params(colors='gray')

# Convergence plot
ax2.set_facecolor('#111827')
ax2.plot(ratios, color='#a855f7', linewidth=1)
ax2.axhline(75, color='#f59e0b', linestyle='--', label='Expected: 75%')
ax2.set_xlabel('Number of crosses', color='white')
ax2.set_ylabel('% Purple', color='white')
ax2.set_title('Ratio Converges to 3:1 (75%)', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"After {n_crosses} crosses:")
print(f"  Purple: {purple} ({purple/n_crosses*100:.1f}%)")
print(f"  White:  {white} ({white/n_crosses*100:.1f}%)")
print(f"  Ratio: {purple/white:.2f}:1 (expected: 3.00:1)")`,
      challenge: 'Run with only 10 crosses. The ratio will be far from 3:1. Repeat several times — you\'ll get different results each time. That\'s why Mendel needed thousands of plants.',
      successHint: 'Statistics and genetics are inseparable. You can\'t do meaningful genetics without large sample sizes, and you can\'t understand statistics without real-world examples like inheritance.',
    },
    {
      title: 'Multiple genes — beyond simple inheritance',
      concept: `Real organisms have thousands of genes, not just one. Height, leaf shape, flower color, disease resistance — each may be controlled by multiple genes that interact.

When two genes affect the same trait, you get more complex ratios. For two independent genes, each with dominant/recessive alleles, a cross of double heterozygotes (AaBb × AaBb) gives a **9:3:3:1** ratio:
- 9/16: both dominant (A_B_)
- 3/16: first dominant, second recessive (A_bb)
- 3/16: first recessive, second dominant (aaB_)
- 1/16: both recessive (aabb)

This is called **dihybrid inheritance** and it's how Mendel proved that genes on different chromosomes are inherited independently.`,
      storyConnection: 'Tulsi plants vary in leaf color, stem color, and oil content. Each trait is controlled by different genes. A cross between two tulsi varieties produces offspring with combinations the parents never had. New combinations = new possibilities.',
      codeIntro: 'Simulate a dihybrid cross and verify the 9:3:3:1 ratio.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Dihybrid cross: AaBb × AaBb
# Gene A: plant height (A = tall, a = short)
# Gene B: leaf shape (B = broad, b = narrow)

n = 10000
results = {'Tall Broad': 0, 'Tall Narrow': 0, 'Short Broad': 0, 'Short Narrow': 0}

for _ in range(n):
    # Parent 1 contributes one allele per gene
    a1 = np.random.choice(['A', 'a'])
    b1 = np.random.choice(['B', 'b'])
    # Parent 2
    a2 = np.random.choice(['A', 'a'])
    b2 = np.random.choice(['B', 'b'])

    height = 'Tall' if 'A' in (a1 + a2) else 'Short'
    leaf = 'Broad' if 'B' in (b1 + b2) else 'Narrow'
    results[f'{height} {leaf}'] += 1

fig, ax = plt.subplots(figsize=(8, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
bars = ax.bar(results.keys(), results.values(), color=colors)
ax.set_ylabel('Count (out of {:,})'.format(n), color='white')
ax.set_title('Dihybrid Cross: AaBb × AaBb', color='white', fontsize=13)
ax.tick_params(colors='gray')

expected = [9/16, 3/16, 3/16, 1/16]
for bar, count, exp in zip(bars, results.values(), expected):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 50,
            f'{count/n*100:.1f}%\\\n(expect {exp*100:.1f}%)',
            ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Expected ratios: 9:3:3:1")
for pheno, count in results.items():
    print(f"  {pheno:15s}: {count:5d} ({count/n*100:.1f}%)")`,
      challenge: 'What if the genes are NOT independent (linked on the same chromosome)? The ratios deviate from 9:3:3:1. This is how geneticists discovered gene linkage.',
      successHint: 'From one gene to two genes, the complexity grows geometrically. Real organisms have 20,000+ genes. That\'s why genetics needs computers — and why bioinformatics is one of the fastest-growing fields in science.',
    },
    {
      title: 'Mutations — when the instructions change',
      concept: `DNA copies itself every time a cell divides. Most copies are perfect. But occasionally, a mistake slips through: a base is swapped, deleted, or inserted. This is a **mutation**.

Most mutations are **neutral** (they don't affect the organism). Some are **harmful** (they break a gene). Rarely, a mutation is **beneficial** (it improves something). Beneficial mutations spread through the population via natural selection — this is how evolution works.

Plant breeders exploit mutations to create new varieties: seedless watermelons, golden rice (with extra vitamin A), and disease-resistant crops. Mutation + selection is nature's R&D department.`,
      storyConnection: 'If a mutation gave one of Tejimola\'s tulsi plants extra aromatic oil, that plant would be more successful at repelling insects. Its seeds would inherit the mutation. Over generations, the population would become more aromatic. That\'s natural selection driven by a random mutation.',
      codeIntro: 'Simulate random mutations in a DNA sequence and measure their effects.',
      code: `import numpy as np

np.random.seed(42)

# Original gene sequence (simplified: each base = one "instruction")
original = list('ATCGATCGATCGATCGATCG')
print("Original DNA:", ''.join(original))
print()

# Simulate 100 random mutations
n_mutations = 100
mutation_types = {'neutral': 0, 'harmful': 0, 'beneficial': 0}

for i in range(n_mutations):
    # Pick a random position
    pos = np.random.randint(0, len(original))
    old_base = original[pos]
    new_base = np.random.choice([b for b in 'ATCG' if b != old_base])

    # Determine effect (simplified model)
    # Most mutations are neutral (70%), some harmful (25%), rarely beneficial (5%)
    roll = np.random.random()
    if roll < 0.70:
        effect = 'neutral'
    elif roll < 0.95:
        effect = 'harmful'
    else:
        effect = 'beneficial'

    mutation_types[effect] += 1

print(f"After {n_mutations} random mutations:")
for effect, count in mutation_types.items():
    bar = '█' * (count // 2)
    print(f"  {effect:12s}: {count:3d} ({count}%) {bar}")

print()
print("Key insight: beneficial mutations are RARE (5%)")
print("But over millions of years, even rare events accumulate.")
print("That's how tulsi evolved its aromatic oils —")
print("one beneficial mutation at a time, selected by insects")
print("that avoided the most aromatic plants.")`,
      challenge: 'Change the beneficial rate from 5% to 1%. How many mutations do you need before you get at least one beneficial one? This is why evolution is slow.',
      successHint: 'Mutations are the raw material of evolution. Without them, every organism would be a perfect copy of its ancestors — no diversity, no adaptation, no new species. The randomness is the point.',
    },
    {
      title: 'Natural selection — survival of the fittest (adapted)',
      concept: `Mutations create variation. **Natural selection** filters that variation: organisms with traits suited to their environment survive and reproduce more. Over generations, the population shifts toward better-adapted traits.

Darwin's three conditions for natural selection:
1. **Variation**: individuals differ in their traits
2. **Heritability**: traits are passed to offspring
3. **Differential survival**: some traits improve survival/reproduction

This isn't "survival of the strongest" — it's survival of the best *adapted*. A tiny desert plant that conserves water beats a tall forest tree in a drought. Fitness is relative to the environment.`,
      storyConnection: 'Each time the stepmother destroyed Tejimola, she came back as a different plant — each better adapted to its new environment. In biology, this is natural selection: the environment (garden, river, pond, open ground) selects which traits succeed.',
      codeIntro: 'Simulate natural selection on a population of plants over 50 generations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Population of 200 plants, each with a "drought resistance" score (0-100)
pop_size = 200
generations = 50
drought_resistance = np.random.normal(50, 15, pop_size).clip(0, 100)

# Track mean trait over generations
history = [np.mean(drought_resistance)]

for gen in range(generations):
    # Selection: plants with higher drought resistance survive
    # Probability of survival proportional to trait value
    survival_prob = drought_resistance / 100
    survivors_mask = np.random.random(pop_size) < survival_prob
    survivors = drought_resistance[survivors_mask]

    if len(survivors) < 10:
        break  # population crash

    # Reproduction: survivors produce offspring with small variation
    offspring = []
    while len(offspring) < pop_size:
        parent = np.random.choice(survivors)
        child = parent + np.random.normal(0, 3)  # small mutation
        offspring.append(np.clip(child, 0, 100))

    drought_resistance = np.array(offspring)
    history.append(np.mean(drought_resistance))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Mean trait over time
ax1.set_facecolor('#111827')
ax1.plot(history, color='#22c55e', linewidth=2)
ax1.set_xlabel('Generation', color='white')
ax1.set_ylabel('Mean drought resistance', color='white')
ax1.set_title('Natural Selection in Action', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Distribution at start vs end
ax2.set_facecolor('#111827')
start = np.random.normal(50, 15, 1000).clip(0, 100)
ax2.hist(start, bins=30, alpha=0.5, color='#6b7280', label='Generation 0')
ax2.hist(drought_resistance, bins=30, alpha=0.7, color='#22c55e', label=f'Generation {generations}')
ax2.set_xlabel('Drought resistance', color='white')
ax2.set_ylabel('Count', color='white')
ax2.set_title('Population Distribution', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Starting mean: {history[0]:.1f}")
print(f"Final mean: {history[-1]:.1f}")
print(f"Change: +{history[-1]-history[0]:.1f} over {len(history)-1} generations")
print()
print("The population EVOLVED — without anyone designing it.")
print("Just variation + selection + inheritance = adaptation.")`,
      challenge: 'What happens if the environment changes? After generation 25, switch the selection to favor LOW drought resistance (wet environment). The population should reverse direction.',
      successHint: 'You just simulated evolution by natural selection. The population adapted to its environment through nothing but random variation and differential survival. No designer, no plan — just statistics over time.',
    },
    {
      title: 'From Tejimola to biotech — real-world plant genetics',
      concept: `Everything you've learned — cells, DNA, genes, mutations, selection — is used daily in modern agriculture and biotechnology:

- **Traditional breeding**: cross two varieties, select the best offspring. Takes 10-15 years per new variety. This is Mendel's method scaled up.
- **Marker-assisted selection**: use DNA markers to identify desirable genes without waiting for the plant to grow. Cuts breeding time in half.
- **Genetic engineering**: directly modify DNA to add specific traits (e.g., Bt cotton, golden rice). Controversial but powerful.
- **CRISPR gene editing**: precisely edit individual bases in DNA. Like find-and-replace for genetics. The most recent revolution.

India is the world's 2nd largest agricultural producer. Plant genetics directly affects food security for 1.4 billion people. The science you've learned isn't abstract — it feeds nations.`,
      storyConnection: 'Tejimola\'s story ends with the champa tree blooming brighter than ever. In modern biotech, scientists create plants that bloom better, resist disease, and feed more people. The "spirit that wouldn\'t die" is knowledge — once you understand plant genetics, you can use it to improve lives.',
      codeIntro: 'Summarize the complete journey from folktale to genetics.',
      code: `print("=" * 50)
print("  YOUR PLANT BIOLOGY JOURNEY")
print("=" * 50)
print()
print("Level 1 — Concepts:")
print("  ✓ Cells: building blocks with walls, chloroplasts")
print("  ✓ Photosynthesis: sunlight → sugar + oxygen")
print("  ✓ Vegetative propagation: cloning vs seeds")
print("  ✓ Growth stages: the sigmoid curve")
print("  ✓ Adaptation: different plants for different places")
print("  ✓ DNA: the instruction molecule (ATCG)")
print()
print("Level 2 — Genetics:")
print("  ✓ Inheritance: dominant/recessive alleles")
print("  ✓ Punnett squares: predicting offspring traits")
print("  ✓ Dihybrid crosses: 9:3:3:1 ratio")
print("  ✓ Mutations: random changes in DNA")
print("  ✓ Natural selection: evolution in action")
print("  ✓ Biotech: breeding, GMOs, CRISPR")
print()
print("From a folktale about a girl who became a plant")
print("to the science that feeds 8 billion people.")
print("Tejimola's spirit lives on — in every seed,")
print("every cell, every harvest.")`,
      challenge: 'What single advance in plant science would have the biggest impact on food security in the next 20 years? Climate-resistant crops? Vertical farming? Lab-grown food? Think about it.',
      successHint: 'From "what is a cell?" to evolution by natural selection — all through the story of a girl whose kindness kept growing back. You understand the biology that powers every living thing on Earth.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Zap className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Completed Level 1 (or some biology background)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Load Python for genetics simulations.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Zap className="w-5 h-5" />Load Python</>)}
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
