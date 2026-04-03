import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function CoconutJackfruitLevel1() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'What makes a species? — DNA, morphology, and identity',
      concept: `A coconut tree will never become a jackfruit tree — no matter how much it wants to. Why? Because every organism's identity is written in its **DNA**. Species are defined by shared genetics, reproductive compatibility, and evolutionary history.

The **biological species concept**: organisms that can interbreed and produce fertile offspring belong to the same species. A coconut (Cocos nucifera) and a jackfruit (Artocarpus heterophyllus) are not just different species — they are in different plant families separated by ~100 million years of evolution.

What makes them so different:
- **Coconut**: monocot (one seed leaf), palm family, 16 chromosomes
- **Jackfruit**: dicot (two seed leaves), fig family, 56 chromosomes
- Different chromosome numbers make hybridization impossible

Species identity is not just appearance. Two flowers may look identical but be different species. Two dogs may look completely different (Chihuahua vs. Great Dane) but are the same species. DNA is the final arbiter.`,
      analogy: 'Species are like different programming languages. Python and JavaScript look similar on the surface (both have variables, loops, functions) but are fundamentally incompatible — you cannot run Python code in a JavaScript engine. Similarly, coconut and jackfruit share basic plant features (roots, leaves, photosynthesis) but their genetic "code" is incompatible.',
      storyConnection: 'The coconut in the story dreamed of becoming a jackfruit — bearing heavy, sweet fruits instead of hard nuts. In biology, this wish is impossible because species identity is coded at the deepest level: DNA. The story uses this impossibility to explore a deeper truth about identity and self-acceptance.',
      checkQuestion: 'A mule is the offspring of a horse and a donkey. Mules are almost always sterile. Does this mean horses and donkeys are the same species?',
      checkAnswer: 'No. By the biological species concept, they are different species because their offspring (mules) are not fertile — the reproductive chain stops. Horses have 64 chromosomes, donkeys have 62, and mules have 63 (an odd number that prevents proper chromosome pairing during meiosis). Close enough to hybridize, but too different to produce a continuous lineage.',
      codeIntro: 'Compare genetic distance between different plant species using simulated DNA sequences.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate DNA sequences for different plant species
# Using simplified model: percentage of shared base pairs

def generate_dna(length, parent=None, mutation_rate=0.0):
    if parent is None:
        return np.random.choice(['A', 'T', 'C', 'G'], length)
    child = parent.copy()
    mutations = np.random.random(length) < mutation_rate
    child[mutations] = np.random.choice(['A', 'T', 'C', 'G'], np.sum(mutations))
    return child

# Common ancestor DNA
ancestor = generate_dna(1000)

# Species diverging at different times (higher mutation = more time)
species = {
    'Coconut': generate_dna(1000, ancestor, 0.3),
    'Date palm': generate_dna(1000, ancestor, 0.25),  # same family as coconut
    'Jackfruit': generate_dna(1000, ancestor, 0.45),
    'Fig': generate_dna(1000, ancestor, 0.42),  # same family as jackfruit
    'Rice': generate_dna(1000, ancestor, 0.35),
    'Wheat': generate_dna(1000, ancestor, 0.34),
}

# Calculate pairwise similarity
names = list(species.keys())
n = len(names)
similarity = np.zeros((n, n))

for i in range(n):
    for j in range(n):
        shared = np.sum(species[names[i]] == species[names[j]])
        similarity[i, j] = shared / 1000 * 100

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Similarity heatmap
ax1.set_facecolor('#111827')
im = ax1.imshow(similarity, cmap='Greens', vmin=20, vmax=100)
ax1.set_xticks(range(n))
ax1.set_yticks(range(n))
ax1.set_xticklabels(names, color='white', fontsize=8, rotation=45, ha='right')
ax1.set_yticklabels(names, color='white', fontsize=8)
ax1.set_title('DNA Similarity Between Species (%)', color='white', fontsize=12)
for i in range(n):
    for j in range(n):
        ax1.text(j, i, f'{similarity[i,j]:.0f}', ha='center', va='center',
                color='white' if similarity[i,j] > 60 else 'gray', fontsize=9)
plt.colorbar(im, ax=ax1, shrink=0.8)

# Evolutionary distance tree (simplified UPGMA)
ax2.set_facecolor('#111827')
# Simplified tree visualization
tree_y = {'Coconut': 5, 'Date palm': 4, 'Jackfruit': 2, 'Fig': 1, 'Rice': 8, 'Wheat': 7}
tree_colors = {'Coconut': '#22c55e', 'Date palm': '#22c55e', 'Jackfruit': '#f59e0b',
               'Fig': '#f59e0b', 'Rice': '#3b82f6', 'Wheat': '#3b82f6'}

for name, y in tree_y.items():
    ax2.plot([0, 1], [y, y], color=tree_colors[name], linewidth=2)
    ax2.text(-0.1, y, name, ha='right', va='center', color=tree_colors[name], fontsize=10)

# Family connections
ax2.plot([1, 1], [4, 5], color='#22c55e', linewidth=2)  # Palm family
ax2.plot([1, 2], [4.5, 4.5], color='#22c55e', linewidth=2)
ax2.plot([1, 1], [1, 2], color='#f59e0b', linewidth=2)  # Moraceae
ax2.plot([1, 2], [1.5, 1.5], color='#f59e0b', linewidth=2)
ax2.plot([1, 1], [7, 8], color='#3b82f6', linewidth=2)  # Grass family
ax2.plot([1, 2], [7.5, 7.5], color='#3b82f6', linewidth=2)

# Deep connections
ax2.plot([2, 2], [1.5, 4.5], color='gray', linewidth=1)
ax2.plot([2, 3], [3, 3], color='gray', linewidth=1)
ax2.plot([2, 3], [7.5, 7.5], color='gray', linewidth=1)
ax2.plot([3, 3], [3, 7.5], color='gray', linewidth=1)
ax2.plot([3, 4], [5.25, 5.25], color='gray', linewidth=1)

ax2.text(1.2, 4.5, 'Palm family', color='#22c55e', fontsize=8)
ax2.text(1.2, 1.5, 'Fig family', color='#f59e0b', fontsize=8)
ax2.text(1.2, 7.5, 'Grass family', color='#3b82f6', fontsize=8)
ax2.set_title('Evolutionary Relationships', color='white', fontsize=12)
ax2.set_xlim(-2, 5)
ax2.axis('off')

plt.tight_layout()
plt.show()

print("Coconut vs Jackfruit: {:.0f}% DNA similarity".format(similarity[0, 2]))
print("Coconut vs Date palm: {:.0f}% DNA similarity".format(similarity[0, 1]))
print("Jackfruit vs Fig: {:.0f}% DNA similarity".format(similarity[2, 3]))
print()
print("Related species share more DNA — reflecting shared ancestry.")
print("Coconut and jackfruit diverged ~100 million years ago.")`,
      challenge: 'Humans share about 60% of their DNA with bananas and 85% with mice. Add "Human" and "Mouse" to the comparison. What does this tell us about shared ancestry?',
      successHint: 'DNA is the universal identity card of life. It tells us not just what an organism IS, but how it is related to every other organism on Earth. The coconut and jackfruit are distant cousins — separated by 100 million years of evolution.',
    },
    {
      title: 'Heredity — why offspring look like parents',
      concept: `A coconut palm always grows from a coconut seed, never a jackfruit seed. This is **heredity** — the passing of traits from parent to offspring through DNA.

Gregor Mendel discovered the basic rules in the 1860s:
- Each trait is controlled by **genes** (specific DNA segments)
- Each organism has **two copies** of each gene (one from each parent)
- Genes come in different versions called **alleles**
- Some alleles are **dominant** (expressed even with one copy), others **recessive** (need two copies)

For plants:
- Coconut: tall vs. dwarf varieties (tall is dominant)
- Jackfruit: firm vs. soft flesh (controlled by multiple genes)
- Flower color, fruit size, disease resistance — all inherited

**Genotype** = the alleles an organism carries (e.g., Tt = one tall allele, one dwarf allele)
**Phenotype** = what the organism actually looks like (Tt → tall, because T is dominant)

This is why selective breeding works: choose parents with desirable traits, and their offspring inherit those traits (with some variation).`,
      analogy: 'Genes are like recipes in a family cookbook. Each parent contributes one copy of each recipe. If one recipe says "tall" and the other says "dwarf," the dominant recipe wins (the plant is tall). But the recessive recipe is still there — and might show up in grandchildren if two Tt parents have a tt child.',
      storyConnection: 'The coconut cannot become a jackfruit because it inherited coconut genes from coconut parents. Identity is inherited, not chosen. But within a species, there is enormous variation — tall coconuts, dwarf coconuts, green and orange varieties. The coconut can be the best possible coconut, even if it cannot be a jackfruit.',
      checkQuestion: 'If two tall coconut palms (both genotype Tt) are crossed, what fraction of offspring will be dwarf?',
      checkAnswer: 'Using a Punnett square: TT (1/4), Tt (2/4), tt (1/4). Only tt is dwarf (recessive), so 1/4 = 25% of offspring will be dwarf. The other 75% will be tall (TT or Tt). This is Mendel\'s famous 3:1 ratio. Two tall parents can produce dwarf children — because both carry the hidden recessive allele.',
      codeIntro: 'Simulate Mendelian inheritance and visualize genotype ratios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Mendelian inheritance simulation
# Cross Tt × Tt (both parents heterozygous for height)

def cross(parent1, parent2, n_offspring):
    """Simulate n offspring from two parents."""
    offspring = []
    for _ in range(n_offspring):
        allele1 = parent1[np.random.randint(2)]
        allele2 = parent2[np.random.randint(2)]
        genotype = ''.join(sorted([allele1, allele2], reverse=True))
        offspring.append(genotype)
    return offspring

# Cross Tt × Tt
parent1 = ['T', 't']
parent2 = ['T', 't']

# Many offspring to show ratios
n = 1000
offspring = cross(parent1, parent2, n)

# Count genotypes
from collections import Counter
counts = Counter(offspring)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Punnett square visualization
ax1.set_facecolor('#111827')
punnett = [['TT', 'Tt'], ['Tt', 'tt']]
colors_punnett = [['#22c55e', '#3b82f6'], ['#3b82f6', '#f59e0b']]

for i in range(2):
    for j in range(2):
        ax1.add_patch(plt.Rectangle((j, 1-i), 1, 1, facecolor=colors_punnett[i][j],
                                     alpha=0.3, edgecolor='white'))
        ax1.text(j+0.5, 1.5-i, punnett[i][j], ha='center', va='center',
                color='white', fontsize=16, fontweight='bold')

# Labels
ax1.text(0.5, 2.3, 'T', ha='center', color='white', fontsize=14)
ax1.text(1.5, 2.3, 't', ha='center', color='white', fontsize=14)
ax1.text(-0.3, 1.5, 'T', ha='center', color='white', fontsize=14)
ax1.text(-0.3, 0.5, 't', ha='center', color='white', fontsize=14)
ax1.text(1, 2.6, 'Parent 2 alleles', ha='center', color='gray', fontsize=10)
ax1.text(-0.6, 1, 'Parent 1\\nalleles', ha='center', color='gray', fontsize=10, rotation=90)
ax1.set_xlim(-0.8, 2.2)
ax1.set_ylim(-0.2, 2.8)
ax1.set_title('Punnett Square: Tt × Tt', color='white', fontsize=12)
ax1.axis('off')

# Simulation results
ax2.set_facecolor('#111827')
genotypes = ['TT', 'Tt', 'tt']
observed = [counts.get(g, 0) for g in genotypes]
expected = [n*0.25, n*0.50, n*0.25]
phenotypes_tall = counts.get('TT', 0) + counts.get('Tt', 0)
phenotypes_dwarf = counts.get('tt', 0)

x = np.arange(3)
width = 0.35
ax2.bar(x - width/2, observed, width, label='Observed', color='#22c55e', alpha=0.8)
ax2.bar(x + width/2, expected, width, label='Expected', color='#3b82f6', alpha=0.8)
ax2.set_xticks(x)
ax2.set_xticklabels(genotypes, color='white', fontsize=12)
ax2.set_ylabel('Count', color='white')
ax2.set_title(f'Genotype Ratios (n={n})', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

for i, (obs, exp) in enumerate(zip(observed, expected)):
    ax2.text(i, max(obs, exp) + 10, f'{obs/n*100:.1f}%', ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print(f"Cross: Tt × Tt ({n} offspring)")
print(f"  TT: {counts.get('TT',0)} ({counts.get('TT',0)/n*100:.1f}%) — expected 25%")
print(f"  Tt: {counts.get('Tt',0)} ({counts.get('Tt',0)/n*100:.1f}%) — expected 50%")
print(f"  tt: {counts.get('tt',0)} ({counts.get('tt',0)/n*100:.1f}%) — expected 25%")
print(f"  Tall (TT+Tt): {phenotypes_tall} ({phenotypes_tall/n*100:.1f}%) — expected 75%")
print(f"  Dwarf (tt): {phenotypes_dwarf} ({phenotypes_dwarf/n*100:.1f}%) — expected 25%")`,
      challenge: 'What if you cross a homozygous tall (TT) with a homozygous dwarf (tt)? All F1 offspring will be Tt (tall). Now cross two F1 plants. What ratio do you expect in F2?',
      successHint: 'Mendel discovered these ratios in 1866 with peas. The same rules govern every sexually reproducing organism — from coconut palms to humans. The 3:1 ratio is one of the most fundamental patterns in biology.',
    },
    {
      title: 'Fruit biology — why coconuts and jackfruits are so different',
      concept: `A coconut and a jackfruit are both "fruits" in the botanical sense — structures that contain seeds. But they are wildly different because they evolved different **dispersal strategies**:

**Coconut**:
- A **drupe** (fleshy fruit with a hard stone)
- Adapted for water dispersal: waterproof husk, buoyant (fibrous mesocarp traps air), salt-tolerant seed
- Can survive months floating in the ocean → colonized tropical islands worldwide
- One large seed with massive nutrient reserves (endosperm = coconut meat/water)

**Jackfruit**:
- A **multiple fruit** (formed from many flowers fused together)
- Adapted for animal dispersal: sweet, fragrant flesh attracts elephants, monkeys, and other large animals
- Seeds dispersed in animal droppings (with built-in fertilizer!)
- World's largest tree-borne fruit (up to 55 kg)

The difference in strategy drove the evolution of every physical characteristic:
- Coconut: round (hydrodynamic), hard shell (survive wave impact), buoyant
- Jackfruit: irregular (easy to grip/tear), soft rind (easy for animals to open), aromatic (attracts animals from distance)`,
      analogy: 'Coconut and jackfruit are like two delivery services. The coconut uses ocean mail — waterproof packaging, padded to survive the journey, stamped "return to tropical beach." The jackfruit uses animal express — aromatic advertising to attract couriers, sweet payloads to ensure delivery, seeds designed to survive the courier\'s digestive system.',
      storyConnection: 'The coconut envied the jackfruit\'s sweetness and size. But the coconut has something the jackfruit does not — the ability to cross oceans. Each fruit is perfectly designed for its own mission. The story is about learning to value your own design instead of wishing for someone else\'s.',
      checkQuestion: 'Why are coconuts found on tropical beaches worldwide, but jackfruit trees are only found where humans planted them outside South Asia?',
      checkAnswer: 'Coconuts disperse by ocean currents — they can float for months and germinate on any tropical beach. Jackfruit relies on large animals (elephants, primates) for dispersal, limiting its natural range to areas with those animals. Outside South and Southeast Asia, jackfruit was spread by human cultivation, not natural dispersal. The coconut conquered the tropics alone; the jackfruit needed human help.',
      codeIntro: 'Compare the dispersal strategies of different fruits using range and mechanism data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Fruit dispersal strategies
fruits = {
    'Coconut': {'mechanism': 'Water', 'range_km': 5000, 'mass_kg': 1.5, 'seeds': 1, 'color': '#22c55e'},
    'Jackfruit': {'mechanism': 'Animal', 'range_km': 5, 'mass_kg': 20, 'seeds': 200, 'color': '#f59e0b'},
    'Dandelion': {'mechanism': 'Wind', 'range_km': 100, 'mass_kg': 0.0001, 'seeds': 200, 'color': '#3b82f6'},
    'Maple': {'mechanism': 'Wind', 'range_km': 1, 'mass_kg': 0.005, 'seeds': 50, 'color': '#a855f7'},
    'Burdock': {'mechanism': 'Animal (hook)', 'range_km': 10, 'mass_kg': 0.002, 'seeds': 30, 'color': '#ef4444'},
    'Cherry': {'mechanism': 'Bird', 'range_km': 50, 'mass_kg': 0.008, 'seeds': 1, 'color': '#dc2626'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5.5))
fig.patch.set_facecolor('#1f2937')

# Range vs mass (log-log)
ax1.set_facecolor('#111827')
for name, props in fruits.items():
    ax1.scatter(props['mass_kg'], props['range_km'], s=100,
               c=props['color'], zorder=5)
    ax1.annotate(name, xy=(props['mass_kg'], props['range_km']),
                xytext=(5, 5), textcoords='offset points',
                color=props['color'], fontsize=9)

ax1.set_xscale('log')
ax1.set_yscale('log')
ax1.set_xlabel('Fruit mass (kg, log scale)', color='white')
ax1.set_ylabel('Dispersal range (km, log scale)', color='white')
ax1.set_title('Fruit Mass vs Dispersal Range', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Trade-off: seeds per fruit vs investment per seed
ax2.set_facecolor('#111827')
names = list(fruits.keys())
seeds = [fruits[n]['seeds'] for n in names]
mass_per_seed = [fruits[n]['mass_kg'] / fruits[n]['seeds'] for n in names]
colors_list = [fruits[n]['color'] for n in names]

ax2.scatter(seeds, mass_per_seed, s=150, c=colors_list, zorder=5)
for name, s, m in zip(names, seeds, mass_per_seed):
    ax2.annotate(name, xy=(s, m), xytext=(5, 5), textcoords='offset points',
                color=fruits[name]['color'], fontsize=9)

ax2.set_xscale('log')
ax2.set_yscale('log')
ax2.set_xlabel('Seeds per fruit (log)', color='white')
ax2.set_ylabel('Mass per seed (kg, log)', color='white')
ax2.set_title('Strategy: Many Small vs Few Large Seeds', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Add strategy labels
ax2.text(2, 1, 'Few large seeds\\n(high investment)', color='gray', fontsize=9, ha='center')
ax2.text(100, 0.00001, 'Many small seeds\\n(low investment)', color='gray', fontsize=9, ha='center')

plt.tight_layout()
plt.show()

print("Dispersal strategy comparison:")
print(f"{'Fruit':<12} {'Mechanism':<15} {'Range':>8} {'Mass':>8} {'Seeds':>6}")
print("-" * 55)
for name, props in fruits.items():
    print(f"{name:<12} {props['mechanism']:<15} {props['range_km']:>6}km {props['mass_kg']:>7.4f}kg {props['seeds']:>5}")`,
      challenge: 'The coconut invests everything in ONE seed (1.5 kg of nutrients). The dandelion spreads 200 tiny seeds. Calculate the total reproductive investment for each. Which strategy is "better"?',
      successHint: 'There is no "best" fruit design — only trade-offs. Heavy investment in few seeds (coconut) vs. light investment in many seeds (dandelion). Each strategy works in its own niche. The coconut and jackfruit are both optimal — for completely different problems.',
    },
    {
      title: 'Selective breeding — humans shaping plant identity',
      concept: `A coconut cannot become a jackfruit, but humans can dramatically change what a coconut is through **selective breeding** — choosing plants with desirable traits and crossing them over generations.

Coconut palm varieties created by selective breeding:
- **Tall varieties**: 15-30m, produce 50-80 nuts/year, live 80-100 years
- **Dwarf varieties**: 5-8m, produce 100-150 nuts/year, start bearing in 3 years (vs 6-10 for tall)
- **Hybrid (Tall × Dwarf)**: combines productivity with hardiness
- **Makapuno**: mutant with jelly-like endosperm (prized in Philippines)

Jackfruit breeding achievements:
- **Firm flesh varieties** (for cooking): large, starchy, low sugar
- **Soft flesh varieties** (for eating fresh): sweet, aromatic, melting texture
- **Year-round fruiting**: instead of seasonal

Selective breeding is **artificial selection** — the same process as natural selection, but directed by human preference instead of environmental pressure. Darwin realized this connection: if humans can create dog breeds in centuries, nature can create species in millions of years.`,
      analogy: 'Selective breeding is like editing a text. Each generation, you copy the document (DNA), make small edits (choose traits), and keep the best version. Over hundreds of "edits" (generations), the text (organism) changes dramatically from the original — but every change was small and incremental.',
      storyConnection: 'The coconut wanted to be something different — a jackfruit. Selective breeding cannot make that happen, but it CAN make a coconut shorter, more productive, disease-resistant, or more nutritious. Identity cannot change, but expression can. The coconut can become the best version of itself.',
      checkQuestion: 'All domestic dogs (from Chihuahuas to Great Danes) are the same species — Canis lupus familiaris. They diverged from wolves ~15,000 years ago. How is such extreme physical variation possible within one species?',
      checkAnswer: 'Dogs have enormous genetic diversity in regulatory genes — genes that control when and how other genes are expressed. Small changes in regulatory genes can produce large physical changes (leg length, skull shape, body size) without changing the fundamental genome much. A Great Dane and Chihuahua share >99.9% of their DNA. The 0.1% difference is concentrated in regulatory regions that control development — the "volume knobs" of gene expression.',
      codeIntro: 'Simulate selective breeding over multiple generations to improve a trait.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Selective breeding simulation
# Trait: coconut yield (nuts per year)
# Start with a population, select the best, breed, repeat

n_pop = 100  # population size
n_generations = 20
heritability = 0.4  # fraction of variation that is genetic
selection_intensity = 0.2  # top 20% selected as parents

# Initial population
mean_yield = 60  # nuts/year
genetic_std = 10
environmental_std = 12  # environmental variation

genetic_values = np.random.normal(0, genetic_std, n_pop)
all_means = [mean_yield]
all_best = [mean_yield + genetic_values.max()]
all_populations = []

for gen in range(n_generations):
    # Phenotype = genetic + environmental
    environmental = np.random.normal(0, environmental_std, n_pop)
    phenotypes = mean_yield + genetic_values + environmental

    all_populations.append(phenotypes.copy())

    # Select top performers
    n_selected = int(n_pop * selection_intensity)
    selected_idx = np.argsort(phenotypes)[-n_selected:]
    selected_genetic = genetic_values[selected_idx]

    # Breed next generation
    new_genetic = np.zeros(n_pop)
    for i in range(n_pop):
        parent1 = selected_genetic[np.random.randint(n_selected)]
        parent2 = selected_genetic[np.random.randint(n_selected)]
        midparent = (parent1 + parent2) / 2
        new_genetic[i] = midparent + np.random.normal(0, genetic_std * 0.3)

    genetic_values = new_genetic
    mean_yield += (np.mean(selected_genetic) - np.mean(genetic_values)) * heritability

    all_means.append(mean_yield)
    all_best.append(mean_yield + genetic_values.max())

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5.5))
fig.patch.set_facecolor('#1f2937')

# Mean yield over generations
ax1.set_facecolor('#111827')
gens = range(len(all_means))
ax1.plot(gens, all_means, 'o-', color='#22c55e', linewidth=2, label='Population mean')
ax1.plot(gens, all_best, 's--', color='#f59e0b', linewidth=1.5, label='Best individual')
ax1.set_xlabel('Generation', color='white')
ax1.set_ylabel('Coconut yield (nuts/year)', color='white')
ax1.set_title('Selective Breeding: Yield Improvement', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

improvement = (all_means[-1] - all_means[0]) / all_means[0] * 100
ax1.text(10, all_means[0] + 2, f'+{improvement:.0f}% improvement\\nin {n_generations} generations',
        color='#22c55e', fontsize=10)

# Population distributions (first, middle, last generations)
ax2.set_facecolor('#111827')
gen_indices = [0, 9, 19]
colors_gen = ['#3b82f6', '#f59e0b', '#22c55e']
labels_gen = ['Generation 1', 'Generation 10', 'Generation 20']

for idx, color, label in zip(gen_indices, colors_gen, labels_gen):
    if idx < len(all_populations):
        ax2.hist(all_populations[idx], bins=20, alpha=0.4, color=color,
                label=label, density=True)

ax2.set_xlabel('Yield (nuts/year)', color='white')
ax2.set_ylabel('Density', color='white')
ax2.set_title('Population Distribution Shifts', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Initial mean yield: {all_means[0]:.1f} nuts/year")
print(f"Final mean yield: {all_means[-1]:.1f} nuts/year")
print(f"Improvement: {improvement:.1f}% over {n_generations} generations")
print(f"Best individual: {all_best[-1]:.1f} nuts/year")
print()
print(f"Selection intensity: top {selection_intensity*100:.0f}%")
print(f"Heritability: {heritability} (genetic fraction of variation)")`,
      challenge: 'What happens if you increase heritability from 0.4 to 0.8? What if you select the top 5% instead of top 20%? Which has a bigger effect on improvement rate?',
      successHint: 'Selective breeding is how humanity created most of our food crops. Every grain of rice, every apple, every chicken was shaped by the same process you just simulated. The coconut may not become a jackfruit, but selective breeding can make it remarkably different from its wild ancestor.',
    },
    {
      title: 'CRISPR and genetic engineering — rewriting the code of life',
      concept: `Could we actually make a coconut tree produce jackfruit-like flesh? With modern **genetic engineering**, specifically **CRISPR-Cas9**, we can edit specific genes in an organism's DNA with surgical precision.

CRISPR (Clustered Regularly Interspaced Short Palindromic Repeats) works like find-and-replace in a text editor:
1. **Guide RNA**: a short sequence that matches the target gene (the "find" term)
2. **Cas9 enzyme**: a molecular scissors that cuts the DNA at the target site
3. **Repair**: the cell repairs the cut, either disabling the gene or inserting new DNA

CRISPR has been used to:
- Create disease-resistant banana varieties
- Reduce browning in mushrooms (FDA approved, 2016)
- Develop allergen-free peanuts
- Create seedless tomatoes
- Increase yield in rice

Could CRISPR make a coconut taste like jackfruit? In principle, genes controlling flavor compounds could be modified. But flavor is controlled by hundreds of genes working together — it is like trying to change a novel's genre by editing individual words. Possible, but incredibly complex.

The ethical questions are real: should we edit food genomes? What are the ecological risks? Who owns the technology?`,
      analogy: 'CRISPR is like a word processor for DNA. Old genetic engineering was like retyping an entire page to change one word (slow, error-prone). CRISPR is like using Ctrl+F to find the exact word and replacing it. Same result, vastly more precise. But like any powerful editor, you can make mistakes — especially in a "document" with 3 billion characters.',
      storyConnection: 'The coconut\'s dream of becoming a jackfruit remains impossible — identity runs too deep. But CRISPR blurs the line: we can now add jackfruit genes to a coconut genome. Not making it a jackfruit, but giving it some jackfruit-like properties. The boundary between species, once absolute, is becoming negotiable. This raises profound questions about identity that the story anticipated.',
      checkQuestion: 'Golden Rice was engineered to produce beta-carotene (vitamin A precursor) by adding genes from daffodils and bacteria. Is Golden Rice a coconut trying to be a jackfruit?',
      checkAnswer: 'In a sense, yes — it is a rice plant expressing genes from completely unrelated organisms. But it is still rice. The added genes produce beta-carotene (which rice cannot normally make), addressing vitamin A deficiency that blinds 250,000-500,000 children annually. The technology is a powerful tool for good, but it raises questions: at what point does genetic modification change a species\' identity? The answer is nuanced and depends on what we mean by "identity."',
      codeIntro: 'Simulate CRISPR gene editing — targeting a specific DNA sequence and making a precise edit.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate CRISPR gene editing
# Target: a gene controlling fruit sweetness

# Original DNA sequence (simplified)
original_gene = "ATGCGATCCTAAGGCTTACGGTAACCTGGAATCGCCTATG"
target_site = "AAGGCTTACG"  # PAM-adjacent target
replacement = "AAGGCTTGCG"  # Single base change: A→G at position 8

# Find target in gene
target_pos = original_gene.find(target_site)
edited_gene = original_gene[:target_pos] + replacement + original_gene[target_pos + len(target_site):]

print("CRISPR Gene Editing Simulation")
print("=" * 50)
print(f"Original:  {original_gene}")
print(f"Target:    {' ' * target_pos}{target_site}")
print(f"Edited:    {edited_gene}")
print(f"Change:    {' ' * (target_pos + 7)}^ A→G")
print()

# CRISPR efficiency model
# On-target efficiency depends on guide RNA design
guide_rna_scores = np.random.beta(8, 3, 100)  # on-target scores (mostly high)
off_target_scores = np.random.beta(1.5, 8, 100)  # off-target scores (mostly low)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# On-target vs off-target efficiency
ax1.set_facecolor('#111827')
ax1.hist(guide_rna_scores * 100, bins=20, alpha=0.7, color='#22c55e', label='On-target efficiency')
ax1.hist(off_target_scores * 100, bins=20, alpha=0.7, color='#ef4444', label='Off-target rate')
ax1.set_xlabel('Efficiency / Error rate (%)', color='white')
ax1.set_ylabel('Number of guide RNAs', color='white')
ax1.set_title('CRISPR Accuracy: On-target vs Off-target', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Trait modification outcomes
ax2.set_facecolor('#111827')
# Simulating sweetness levels in edited plants
n_plants = 50
wild_type = np.random.normal(5, 1, n_plants)  # Brix (sugar content)
crispr_edited = np.random.normal(12, 2, n_plants)  # Enhanced sweetness
failed_edit = np.random.normal(5, 1.5, int(n_plants * 0.2))  # Edit didn't work

categories = ['Wild type\\n(unedited)', 'CRISPR\\n(successful)', 'CRISPR\\n(failed edit)']
data = [wild_type, crispr_edited, failed_edit]
colors_box = ['#3b82f6', '#22c55e', '#ef4444']

bp = ax2.boxplot(data, labels=categories, patch_artist=True,
                 medianprops=dict(color='white', linewidth=2))
for patch, color in zip(bp['boxes'], colors_box):
    patch.set_facecolor(color)
    patch.set_alpha(0.6)

ax2.set_ylabel('Sweetness (Brix)', color='white')
ax2.set_title('Fruit Sweetness: Wild vs Edited', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.axhline(np.mean(wild_type), color='#3b82f6', linestyle='--', alpha=0.3)

plt.tight_layout()
plt.show()

success_rate = len(crispr_edited) / (len(crispr_edited) + len(failed_edit)) * 100
print(f"CRISPR outcomes:")
print(f"  Success rate: {success_rate:.0f}%")
print(f"  Wild type sweetness: {np.mean(wild_type):.1f} ± {np.std(wild_type):.1f} Brix")
print(f"  Edited sweetness: {np.mean(crispr_edited):.1f} ± {np.std(crispr_edited):.1f} Brix")
print(f"  Improvement: {(np.mean(crispr_edited)/np.mean(wild_type)-1)*100:.0f}%")
print()
print("CRISPR can modify traits dramatically — but the plant")
print("remains the same species. A sweeter coconut is still a coconut.")`,
      challenge: 'CRISPR can sometimes make unintended edits (off-target effects). If the off-target rate is 5% per guide RNA, and you use 3 guide RNAs, what is the probability of at least one off-target edit?',
      successHint: 'From species identity to Mendelian genetics to fruit biology to selective breeding to CRISPR — you have traced the full arc of how identity is encoded, inherited, expressed, and now engineered. The coconut cannot become a jackfruit, but the boundary between what species can and cannot be is being rewritten by technology.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior genetics experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for genetics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
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
