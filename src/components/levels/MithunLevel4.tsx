import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MithunLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Capstone Design: Mithun Breeding Program Simulator',
      concept: `In Level 3 you mastered domestication genetics, artificial selection, livestock biodiversity, rumen fermentation, methane emissions, and sustainable pastoralism. Now you build a capstone project: a **Breeding Program Simulator** that models genetic improvement over multiple generations, predicting how selective breeding changes trait distributions in a mithun population.

Real breeding programs for livestock use **estimated breeding values** (EBVs) to rank animals. An EBV is a prediction of the genetic merit of an animal for a specific trait, calculated from its own performance, its relatives' performance, and the heritabilities and genetic correlations among traits. The breeder's equation (R = h^2 * S) gives the expected response per generation, but a full simulator must also track: inbreeding accumulation, genetic variance depletion, correlated trait responses, and the tradeoff between selection intensity and population viability.

The simulator architecture has four modules. First, a **genome model** that represents each animal as a set of alleles at quantitative trait loci (QTL), with additive and dominance effects. Second, a **phenotype generator** that computes observable traits from genotype plus environmental noise. Third, a **selection engine** that ranks animals by their EBVs and chooses parents for the next generation. Fourth, a **mating allocator** that pairs selected parents while minimizing inbreeding using an optimal contribution selection algorithm.

This tool would allow Naga and Mizo mithun keepers to plan breeding decisions: which bulls to use, which cows to breed with which bulls, how many bulls are needed to maintain genetic diversity, and how quickly traits like body weight, disease resistance, or temperament can be improved without compromising the population's genetic health.`,
      analogy: 'The breeding simulator is like a flight simulator for genetic improvement. A pilot would never fly a new route without simulation; a breeder should not design a breeding program without modeling the consequences. The simulator lets you crash safely — you can see what happens when you use too few bulls (inbreeding crash) or select too aggressively (genetic variance depletion) without actually harming real animals.',
      storyConnection: 'The brave mithun in the story was valued for its strength and courage — traits that Naga communities have been selecting for over thousands of years. Your simulator formalizes this traditional breeding wisdom into a quantitative tool. Instead of relying on memory and intuition about which bull\'s calves were strongest, the simulator tracks breeding values across the entire population and predicts outcomes generations ahead.',
      checkQuestion: 'Why is it dangerous to select only the single best bull for all matings in the herd?',
      checkAnswer: 'Using a single bull maximizes selection intensity (S is large because you are choosing from the extreme tail), but it also maximizes inbreeding. All calves in the next generation would be half-siblings, and within two generations, many would be inbred. Inbreeding depression reduces fitness: lower fertility, higher calf mortality, weaker immune systems. The breeder\'s equation gives the short-term gain from intense selection, but it ignores the long-term cost of inbreeding. A breeding program must balance genetic gain against inbreeding rate — typically targeting less than 1% inbreeding increase per generation.',
      codeIntro: 'Build the genome model: represent each mithun as a diploid individual with multiple quantitative trait loci.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Module 1: Genome Model ---

class MithunGenome:
    """Represent a mithun's genome as QTL alleles."""

    def __init__(self, n_loci=50, alleles=None, parent_ids=(None, None)):
        self.n_loci = n_loci
        self.parent_ids = parent_ids
        if alleles is not None:
            self.alleles = alleles  # shape: (n_loci, 2) — diploid
        else:
            # Random initialization: allele effects drawn from normal distribution
            self.alleles = np.random.randn(n_loci, 2) * 0.5

    def breeding_value(self, trait_weights=None):
        """Additive genetic value = sum of allele effects."""
        if trait_weights is None:
            trait_weights = np.ones(self.n_loci) / self.n_loci
        return np.sum(trait_weights * np.sum(self.alleles, axis=1))

    def gamete(self):
        """Produce a gamete via meiosis (random allele from each locus)."""
        choices = np.random.randint(0, 2, self.n_loci)
        return self.alleles[np.arange(self.n_loci), choices]

class MithunPopulation:
    """Population of mithun with pedigree tracking."""

    TRAITS = {
        'body_weight': {'loci': slice(0, 15), 'h2': 0.35, 'env_std': 50},
        'temperament': {'loci': slice(15, 25), 'h2': 0.20, 'env_std': 0.3},
        'disease_resist': {'loci': slice(25, 35), 'h2': 0.15, 'env_std': 0.4},
        'fertility': {'loci': slice(35, 45), 'h2': 0.10, 'env_std': 0.5},
        'meat_quality': {'loci': slice(45, 50), 'h2': 0.30, 'env_std': 0.3},
    }

    def __init__(self, n_males=30, n_females=100):
        self.males = [MithunGenome(50) for _ in range(n_males)]
        self.females = [MithunGenome(50) for _ in range(n_females)]
        self.generation = 0
        self.history = {'gen': [], 'mean_bv': [], 'var_bv': [],
                        'inbreeding': [], 'n_sires': []}

    def phenotype(self, animal, trait_name):
        """Compute phenotype = genetic value + environment."""
        info = self.TRAITS[trait_name]
        loci_range = info['loci']
        bv = np.sum(animal.alleles[loci_range])
        env = np.random.normal(0, info['env_std'])
        return bv + env

    def estimated_breeding_values(self, animals, trait_name='body_weight'):
        """Simple EBV: own phenotype * heritability."""
        h2 = self.TRAITS[trait_name]['h2']
        ebvs = []
        for a in animals:
            pheno = self.phenotype(a, trait_name)
            ebvs.append(pheno * h2)
        return np.array(ebvs)

    def mean_breeding_value(self):
        """Population mean true breeding value."""
        all_animals = self.males + self.females
        return np.mean([a.breeding_value() for a in all_animals])

    def var_breeding_value(self):
        """Genetic variance in the population."""
        all_animals = self.males + self.females
        return np.var([a.breeding_value() for a in all_animals])

# Create founding population
pop = MithunPopulation(n_males=30, n_females=100)

# Visualize the founding generation
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Breeding value distribution
ax = axes[0, 0]
ax.set_facecolor('#111827')
male_bvs = [m.breeding_value() for m in pop.males]
female_bvs = [f.breeding_value() for f in pop.females]
ax.hist(male_bvs, bins=15, alpha=0.6, color='#3b82f6', label=f'Males (n={len(pop.males)})', edgecolor='none')
ax.hist(female_bvs, bins=20, alpha=0.6, color='#ec4899', label=f'Females (n={len(pop.females)})', edgecolor='none')
ax.set_xlabel('True breeding value', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Founding generation: breeding value distribution', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Trait phenotype distributions
ax = axes[0, 1]
ax.set_facecolor('#111827')
all_animals = pop.males + pop.females
trait_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
for (trait, info), color in zip(pop.TRAITS.items(), trait_colors):
    phenotypes = [pop.phenotype(a, trait) for a in all_animals]
    ax.hist(phenotypes, bins=20, alpha=0.4, color=color, label=trait, edgecolor='none')
ax.set_xlabel('Phenotype value', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Phenotype distributions (5 traits)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Heritability comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
traits = list(pop.TRAITS.keys())
h2_vals = [pop.TRAITS[t]['h2'] for t in traits]
bars = ax.bar(range(len(traits)), h2_vals, color=trait_colors, edgecolor='none')
ax.set_xticks(range(len(traits)))
ax.set_xticklabels([t.replace('_', '\\n') for t in traits], color='white', fontsize=8)
ax.set_ylabel('Heritability (h2)', color='white')
ax.set_title('Heritability by trait', color='white', fontsize=11)
for bar, h2 in zip(bars, h2_vals):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01,
            f'{h2:.2f}', ha='center', color='white', fontsize=9)
ax.set_ylim(0, 0.5)
ax.tick_params(colors='gray')

# Plot 4: EBV vs true BV (accuracy)
ax = axes[1, 1]
ax.set_facecolor('#111827')
true_bvs = [a.breeding_value() for a in all_animals]
ebvs = pop.estimated_breeding_values(all_animals, 'body_weight')
ax.scatter(true_bvs, ebvs, alpha=0.4, color='#3b82f6', s=20, edgecolor='none')
# Correlation
corr = np.corrcoef(true_bvs, ebvs)[0, 1]
ax.set_xlabel('True breeding value', color='white')
ax.set_ylabel('Estimated breeding value', color='white')
ax.set_title(f'EBV accuracy (r = {corr:.2f})', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Founding population summary:")
print(f"  Males: {len(pop.males)}, Females: {len(pop.females)}")
print(f"  Mean breeding value: {pop.mean_breeding_value():.3f}")
print(f"  Genetic variance: {pop.var_breeding_value():.4f}")
print(f"  EBV accuracy (correlation): {corr:.3f}")
print()
print("The genome model represents each mithun as 50 diploid QTL.")
print("Five traits are mapped to different loci with different heritabilities.")
print("EBV accuracy is moderate — improving accuracy is a key breeding goal.")`,
      challenge: 'Increase n_loci to 200 and observe how the breeding value distribution changes. Does the central limit theorem make it more normal? How does EBV accuracy change?',
      successHint: 'More loci produce a smoother, more normal distribution (central limit theorem in action). EBV accuracy may decrease slightly because each individual locus contributes less to the total, making the signal harder to detect from phenotype alone.',
    },
    {
      title: 'Selection Engine — ranking animals and choosing parents',
      concept: `The selection engine is the decision-making core of the breeding program. It ranks all candidate animals by their estimated breeding values (EBVs) and selects the top fraction as parents for the next generation. The key parameters are **selection intensity** (what proportion of animals are selected) and **selection criterion** (which traits matter and how they are weighted).

**Selection intensity** (i) is the standardized selection differential: i = S / sigma, where S is the difference between the selected parent mean and the population mean, and sigma is the population standard deviation. For selecting the top 10% of males, i is approximately 1.76. For top 50%, i is approximately 0.80. Higher intensity means faster genetic gain but fewer parents, increasing inbreeding risk.

**Multi-trait selection** requires a **selection index**: a weighted combination of EBVs for multiple traits. The weights should reflect the economic or cultural importance of each trait and the genetic correlations between them. For mithun, a farmer might weight body weight at 40%, temperament at 25%, disease resistance at 20%, fertility at 10%, and meat quality at 5%. The index collapses multiple dimensions into a single ranking score.

A critical constraint is the **number of sires** (breeding males). With N_f females and N_m selected males, each bull serves N_f/N_m cows. If you select only 3 bulls for 100 cows, selection intensity is extreme but the next generation's effective population size is tiny. The rule of thumb is to keep at least 10-15 active sires at any time, with a target inbreeding rate below 1% per generation. This means Ne should be above 50, which requires roughly 4*N_m*N_f/(N_m+N_f) > 50.`,
      analogy: 'The selection engine is like a college admissions office. It receives applications (phenotype data), calculates a composite score (selection index), ranks applicants, and admits the top fraction. But unlike college admissions, the "admitted" animals produce offspring that become next year\'s applicant pool. So the quality of admissions decisions compounds over generations — good decisions today mean a better applicant pool tomorrow.',
      storyConnection: 'In traditional Naga mithun keeping, a village elder might select breeding bulls based on their physical stature, temperament, and the quality of their parents\' offspring — an informal selection index. The simulator formalizes this intuition, showing that the elder\'s criteria (body size AND temperament AND health) are actually more effective than selecting for any single trait alone, because the index captures multiple dimensions of genetic merit.',
      checkQuestion: 'If you double the selection intensity by selecting only the top 5% of males instead of the top 10%, does genetic gain exactly double?',
      checkAnswer: 'No. The breeder\'s equation (R = i * h^2 * sigma_a) shows that gain is proportional to selection intensity (i), and going from top 10% (i=1.76) to top 5% (i=2.06) increases i by only 17%, not 100%. Additionally, with fewer selected males, inbreeding increases faster, which reduces genetic variance (sigma_a) in subsequent generations. The short-term gain is less than double, and the long-term gain may actually be lower due to variance depletion. Moderate selection sustained over many generations beats extreme selection that burns out quickly.',
      codeIntro: 'Implement the selection engine with multi-trait selection index and configurable intensity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Module 2: Selection Engine ---

class SelectionEngine:
    """Rank and select breeding animals using a multi-trait index."""

    def __init__(self, trait_weights=None):
        self.trait_weights = trait_weights or {
            'body_weight': 0.40,
            'temperament': 0.25,
            'disease_resist': 0.20,
            'fertility': 0.10,
            'meat_quality': 0.05,
        }

    def compute_index(self, animals, population):
        """Compute selection index for each animal."""
        indices = []
        for animal in animals:
            score = 0
            for trait, weight in self.trait_weights.items():
                ebv = population.phenotype(animal, trait) * population.TRAITS[trait]['h2']
                score += weight * ebv
            indices.append(score)
        return np.array(indices)

    def select(self, animals, population, n_select):
        """Select top n_select animals by index."""
        indices = self.compute_index(animals, population)
        top_idx = np.argsort(indices)[-n_select:]
        return [animals[i] for i in top_idx], indices

# Need population class for this demo
class MithunGenome:
    def __init__(self, n_loci=50, alleles=None):
        self.n_loci = n_loci
        if alleles is not None:
            self.alleles = alleles
        else:
            self.alleles = np.random.randn(n_loci, 2) * 0.5

    def breeding_value(self):
        return np.sum(self.alleles) / self.n_loci

    def gamete(self):
        choices = np.random.randint(0, 2, self.n_loci)
        return self.alleles[np.arange(self.n_loci), choices]

class MithunPop:
    TRAITS = {
        'body_weight': {'loci': slice(0, 15), 'h2': 0.35, 'env_std': 50},
        'temperament': {'loci': slice(15, 25), 'h2': 0.20, 'env_std': 0.3},
        'disease_resist': {'loci': slice(25, 35), 'h2': 0.15, 'env_std': 0.4},
        'fertility': {'loci': slice(35, 45), 'h2': 0.10, 'env_std': 0.5},
        'meat_quality': {'loci': slice(45, 50), 'h2': 0.30, 'env_std': 0.3},
    }

    def __init__(self, nm=30, nf=100):
        self.males = [MithunGenome(50) for _ in range(nm)]
        self.females = [MithunGenome(50) for _ in range(nf)]

    def phenotype(self, animal, trait):
        info = self.TRAITS[trait]
        bv = np.sum(animal.alleles[info['loci']])
        return bv + np.random.normal(0, info['env_std'])

# --- Compare selection strategies ---

pop = MithunPop(nm=30, nf=100)
engine = SelectionEngine()

# Compute indices for all males
indices_males = engine.compute_index(pop.males, pop)
indices_females = engine.compute_index(pop.females, pop)

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Index distribution with selection cutoffs
ax = axes[0, 0]
ax.set_facecolor('#111827')
sorted_idx = np.sort(indices_males)[::-1]
ax.bar(range(len(sorted_idx)), sorted_idx, color='#3b82f6', edgecolor='none', alpha=0.7)
# Selection cutoffs
for frac, color, label in [(0.1, '#ef4444', 'Top 10%'), (0.3, '#f59e0b', 'Top 30%'), (0.5, '#22c55e', 'Top 50%')]:
    cutoff_idx = int(len(sorted_idx) * frac)
    ax.axvline(cutoff_idx, color=color, linestyle='--', linewidth=2, label=label)
ax.set_xlabel('Male rank', color='white')
ax.set_ylabel('Selection index', color='white')
ax.set_title('Male ranking by selection index', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Selection intensity vs fraction selected
ax = axes[0, 1]
ax.set_facecolor('#111827')
fractions = np.linspace(0.05, 0.95, 50)
intensities = []
for f in fractions:
    n_sel = max(int(len(pop.males) * f), 1)
    selected, _ = engine.select(pop.males, pop, n_sel)
    sel_mean = np.mean([s.breeding_value() for s in selected])
    pop_mean = np.mean([m.breeding_value() for m in pop.males])
    pop_std = np.std([m.breeding_value() for m in pop.males])
    i = (sel_mean - pop_mean) / max(pop_std, 0.001)
    intensities.append(i)
ax.plot(fractions * 100, intensities, color='#a855f7', linewidth=2)
ax.set_xlabel('Fraction selected (%)', color='white')
ax.set_ylabel('Selection intensity (i)', color='white')
ax.set_title('Selection intensity vs fraction', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 3: Multi-trait vs single-trait selection
ax = axes[0, 2]
ax.set_facecolor('#111827')
strategies = {
    'Multi-trait index': {'body_weight': 0.4, 'temperament': 0.25, 'disease_resist': 0.2, 'fertility': 0.1, 'meat_quality': 0.05},
    'Body weight only': {'body_weight': 1.0, 'temperament': 0, 'disease_resist': 0, 'fertility': 0, 'meat_quality': 0},
    'Temperament only': {'body_weight': 0, 'temperament': 1.0, 'disease_resist': 0, 'fertility': 0, 'meat_quality': 0},
}
strat_colors = ['#22c55e', '#3b82f6', '#f59e0b']
n_sel = 10  # top 10 males
x_traits = np.arange(5)
trait_names_short = ['Weight', 'Temper.', 'Disease R.', 'Fertility', 'Meat Q.']
width = 0.25

for idx, (sname, weights) in enumerate(strategies.items()):
    eng = SelectionEngine(weights)
    selected, _ = eng.select(pop.males, pop, n_sel)
    trait_means = []
    for trait in pop.TRAITS:
        trait_means.append(np.mean([pop.phenotype(a, trait) for a in selected]))
    ax.bar(x_traits + idx * width - width, trait_means, width, color=strat_colors[idx],
           label=sname, edgecolor='none')

ax.set_xticks(x_traits)
ax.set_xticklabels(trait_names_short, color='white', fontsize=8)
ax.set_ylabel('Mean phenotype of selected', color='white')
ax.set_title('Selected parent means by strategy', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: N_sires vs effective population size
ax = axes[1, 0]
ax.set_facecolor('#111827')
n_females = 100
n_sires_range = np.arange(1, 31)
ne_vals = 4 * n_sires_range * n_females / (n_sires_range + n_females)
inbreeding_rates = 1 / (2 * ne_vals) * 100
ax.plot(n_sires_range, ne_vals, color='#3b82f6', linewidth=2, label='Effective pop size')
ax2 = ax.twinx()
ax2.plot(n_sires_range, inbreeding_rates, color='#ef4444', linewidth=2, label='Inbreeding rate')
ax.set_xlabel('Number of sires', color='white')
ax.set_ylabel('Ne', color='#3b82f6')
ax2.set_ylabel('Inbreeding (%/gen)', color='#ef4444')
ax2.axhline(1.0, color='#ef4444', linestyle='--', linewidth=1, alpha=0.5)
ax.set_title('Sires vs Ne and inbreeding', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

# Plot 5: Expected genetic gain by selection intensity and heritability
ax = axes[1, 1]
ax.set_facecolor('#111827')
h2_vals = [0.10, 0.20, 0.35, 0.50]
i_range = np.linspace(0.5, 2.5, 50)
sigma_a = 1.0  # standardized
for h2, color in zip(h2_vals, ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e']):
    gain = i_range * h2 * sigma_a
    ax.plot(i_range, gain, color=color, linewidth=2, label=f'h2={h2}')
ax.set_xlabel('Selection intensity (i)', color='white')
ax.set_ylabel('Expected gain (R = i*h2*sigma_a)', color='white')
ax.set_title("Breeder's equation: predicted gain", color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Tradeoff frontier — gain vs inbreeding
ax = axes[1, 2]
ax.set_facecolor('#111827')
n_sires_options = [3, 5, 8, 10, 15, 20, 30]
gains = []
inbr = []
for ns in n_sires_options:
    eng = SelectionEngine()
    selected, _ = eng.select(pop.males, pop, ns)
    sel_mean = np.mean([s.breeding_value() for s in selected])
    pop_mean = np.mean([m.breeding_value() for m in pop.males])
    gains.append(sel_mean - pop_mean)
    ne = 4 * ns * 100 / (ns + 100)
    inbr.append(1 / (2 * ne) * 100)
ax.scatter(inbr, gains, color='#a855f7', s=100, zorder=5, edgecolor='white')
for ns, ib, g in zip(n_sires_options, inbr, gains):
    ax.annotate(f'{ns} sires', (ib, g), textcoords='offset points',
                xytext=(8, 5), color='white', fontsize=8)
ax.plot(inbr, gains, color='#a855f7', linewidth=1, alpha=0.5)
ax.axvline(1.0, color='#ef4444', linestyle='--', linewidth=1, label='1% inbreeding limit')
ax.set_xlabel('Inbreeding rate (%/gen)', color='white')
ax.set_ylabel('Selection response', color='white')
ax.set_title('Gain vs inbreeding tradeoff', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Selection engine results:")
print(f"  Population: {len(pop.males)} males, {len(pop.females)} females")
print(f"  Selection index components: {list(engine.trait_weights.keys())}")
print()
print("Gain vs inbreeding tradeoff (100 females):")
for ns, g, ib in zip(n_sires_options, gains, inbr):
    ne = 4 * ns * 100 / (ns + 100)
    print(f"  {ns:2d} sires: gain={g:.4f}, Ne={ne:.0f}, inbreeding={ib:.2f}%/gen")`,
      challenge: 'Create a "cultural index" that weights temperament at 50% and body weight at 30%. Compare the selected animals to the purely economic index. Which strategy preserves the mithun\'s traditional characteristics better?',
      successHint: 'The cultural index selects for the traits that made the mithun culturally important — docility and manageability. This highlights how breeding goals reflect values, not just economics.',
    },
    {
      title: 'Mating Allocator — pairing parents to minimize inbreeding',
      concept: `Once parents are selected, the mating allocator decides which bull mates with which cow. Random mating among selected parents is simple but suboptimal — it ignores relatedness. If two selected bulls happen to be brothers, and both are assigned many cows, their offspring will be cousins, increasing inbreeding in the next generation.

**Optimal contribution selection** (OCS) solves this by jointly optimizing: (1) how many offspring each selected parent should produce (their "contribution") and (2) which specific matings minimize the average relatedness of the next generation. The constraint is that average genetic merit of parents must equal or exceed a minimum threshold (genetic gain target), while average kinship of parents is minimized.

The **kinship matrix** (also called the relationship matrix or A-matrix in animal breeding) encodes the relatedness between all pairs of animals. For unrelated animals, kinship is 0. For parent-offspring, kinship is 0.25. For full siblings, kinship is 0.25. For half-siblings (same sire, different dam), kinship is 0.125. The inbreeding coefficient of an offspring is equal to the kinship between its parents.

In practice, the mating allocator builds the kinship matrix from pedigree data, then uses it to assign matings that avoid pairing closely related animals. A simple greedy algorithm: for each cow, assign the bull with the highest EBV among those with kinship below a threshold. A more sophisticated approach uses linear programming to minimize average kinship while constraining minimum genetic gain.

For mithun, where pedigree records are often incomplete, kinship can be estimated from genomic data (SNP markers). Even partial pedigree is better than none — it prevents the worst inbreeding pairings.`,
      analogy: 'The mating allocator is like a wedding planner who must pair dance partners from two groups while avoiding pairing relatives. The planner has a list of who is related to whom (kinship matrix) and a ranking of each person\'s dancing skill (EBV). The goal is to create pairs where both partners are skilled dancers (high genetic merit) but not closely related (low inbreeding). Sometimes you sacrifice a little dancing skill to avoid a cousin-cousin pairing.',
      storyConnection: 'Traditional Naga villages practice a form of mating allocation intuitively: they exchange mithun between villages for breeding, ensuring that bulls from one village mate with cows from another. This cross-village exchange is an informal implementation of the kinship-minimizing algorithm — reducing inbreeding by introducing unrelated genetic material. Your simulator formalizes this ancient practice.',
      checkQuestion: 'A farmer has two excellent bulls — one is the father and the other is the son. Should he use both for breeding, or retire the father?',
      checkAnswer: 'He should preferably use only one, and retire the other, because any cow that is mated to both would produce offspring that are both half-siblings (same dam) AND uncle-nephew (through the sire pedigree). If both must be used, they should serve completely non-overlapping groups of cows. The kinship between father and son is 0.25, meaning any offspring from shared cows would have an expected inbreeding coefficient of at least 0.125 — well above the 0.01 per generation target. The mating allocator would flag this and assign them to separate cow groups.',
      codeIntro: 'Implement the mating allocator with kinship tracking and compare random mating vs kinship-minimized mating.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Module 3: Mating Allocator ---

class PedigreeTracker:
    """Track relatedness using a kinship matrix."""

    def __init__(self, n_animals):
        self.n = n_animals
        # Initialize with random base population (unrelated)
        self.kinship = np.eye(n_animals) * 0.5  # self-kinship = 0.5

    def add_offspring(self, parent1_idx, parent2_idx, offspring_idx):
        """Update kinship for a new offspring."""
        # Kinship of offspring with itself
        self_kinship = 0.5 * (1 + self.kinship[parent1_idx, parent2_idx])
        # Kinship of offspring with all others
        for i in range(self.n):
            k = 0.5 * (self.kinship[parent1_idx, i] + self.kinship[parent2_idx, i])
            if offspring_idx < self.n:
                self.kinship[offspring_idx, i] = k
                self.kinship[i, offspring_idx] = k
        if offspring_idx < self.n:
            self.kinship[offspring_idx, offspring_idx] = self_kinship

    def inbreeding_coefficient(self, parent1_idx, parent2_idx):
        """Expected inbreeding of offspring = kinship of parents."""
        return self.kinship[parent1_idx, parent2_idx]

class MatingAllocator:
    """Assign matings to minimize inbreeding while maintaining genetic gain."""

    def __init__(self, max_kinship=0.0625):
        self.max_kinship = max_kinship  # max allowed kinship for a mating pair

    def random_mating(self, sire_indices, dam_indices, n_offspring):
        """Random assignment of sires to dams."""
        matings = []
        for _ in range(n_offspring):
            s = np.random.choice(sire_indices)
            d = np.random.choice(dam_indices)
            matings.append((s, d))
        return matings

    def min_kinship_mating(self, sire_indices, dam_indices, n_offspring, pedigree):
        """Greedy kinship-minimized mating."""
        matings = []
        sire_usage = {s: 0 for s in sire_indices}
        max_per_sire = max(n_offspring // len(sire_indices) + 2, 3)

        for _ in range(n_offspring):
            best_pair = None
            best_kinship = 999

            # Shuffle to avoid always starting with same dam
            dams_shuffled = list(dam_indices.copy())
            np.random.shuffle(dams_shuffled)
            d = dams_shuffled[0]

            for s in sire_indices:
                if sire_usage[s] >= max_per_sire:
                    continue
                k = pedigree.kinship[s, d]
                if k < best_kinship:
                    best_kinship = k
                    best_pair = (s, d)

            if best_pair:
                matings.append(best_pair)
                sire_usage[best_pair[0]] += 1
            dam_indices = np.roll(dam_indices, 1)

        return matings

# --- Simulate and compare mating strategies ---

n_total = 130  # 30 males + 100 females
n_males, n_females = 30, 100
n_sires = 10  # selected sires
n_offspring = 80  # offspring per generation

# Create pedigree with some known relationships
ped = PedigreeTracker(n_total)
# Add some related animals (half-siblings sharing sire 0)
for i in [1, 2, 3, 4, 5]:
    ped.kinship[0, i] = 0.25
    ped.kinship[i, 0] = 0.25
    for j in [1, 2, 3, 4, 5]:
        if i != j:
            ped.kinship[i, j] = 0.125  # half-siblings

allocator = MatingAllocator(max_kinship=0.0625)
sire_idx = np.arange(n_sires)
dam_idx = np.arange(n_males, n_males + n_females)

# Strategy 1: Random mating
random_matings = allocator.random_mating(sire_idx, dam_idx, n_offspring)
random_inbreeding = [ped.kinship[s, d] for s, d in random_matings]

# Strategy 2: Min-kinship mating
minkin_matings = allocator.min_kinship_mating(sire_idx, dam_idx, n_offspring, ped)
minkin_inbreeding = [ped.kinship[s, d] for s, d in minkin_matings]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Kinship matrix heatmap (subset)
ax = axes[0, 0]
ax.set_facecolor('#111827')
subset = 20
im = ax.imshow(ped.kinship[:subset, :subset], cmap='YlOrRd', vmin=0, vmax=0.5)
plt.colorbar(im, ax=ax, label='Kinship coefficient')
ax.set_xlabel('Animal ID', color='white')
ax.set_ylabel('Animal ID', color='white')
ax.set_title('Kinship matrix (first 20 animals)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 2: Inbreeding distribution comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
bins = np.linspace(0, max(max(random_inbreeding), max(minkin_inbreeding)) + 0.02, 20)
ax.hist(random_inbreeding, bins=bins, alpha=0.6, color='#ef4444', label='Random mating', edgecolor='none')
ax.hist(minkin_inbreeding, bins=bins, alpha=0.6, color='#22c55e', label='Min-kinship mating', edgecolor='none')
ax.axvline(0.0625, color='#f59e0b', linestyle='--', label='Max kinship threshold')
ax.set_xlabel('Offspring inbreeding coefficient', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Expected inbreeding of offspring', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Sire usage comparison
ax = axes[1, 0]
ax.set_facecolor('#111827')
random_sire_counts = np.bincount([s for s, _ in random_matings], minlength=n_sires)[:n_sires]
minkin_sire_counts = np.bincount([s for s, _ in minkin_matings], minlength=n_sires)[:n_sires]
x = np.arange(n_sires)
width = 0.35
ax.bar(x - width/2, random_sire_counts, width, color='#ef4444', label='Random', edgecolor='none')
ax.bar(x + width/2, minkin_sire_counts, width, color='#22c55e', label='Min-kinship', edgecolor='none')
ax.set_xlabel('Sire ID', color='white')
ax.set_ylabel('Number of matings', color='white')
ax.set_title('Sire usage distribution', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Multi-generation inbreeding accumulation
ax = axes[1, 1]
ax.set_facecolor('#111827')
n_gen = 20
random_f_mean = [0]
minkin_f_mean = [0]
# Simple accumulation model
for g in range(1, n_gen + 1):
    ne_random = 4 * n_sires * n_females / (n_sires + n_females)
    ne_minkin = ne_random * 1.3  # min-kinship effectively increases Ne by ~30%
    random_f_mean.append(1 - (1 - 1/(2*ne_random))**g)
    minkin_f_mean.append(1 - (1 - 1/(2*ne_minkin))**g)
ax.plot(range(n_gen + 1), [f * 100 for f in random_f_mean], color='#ef4444',
        linewidth=2, label='Random mating')
ax.plot(range(n_gen + 1), [f * 100 for f in minkin_f_mean], color='#22c55e',
        linewidth=2, label='Min-kinship mating')
ax.axhline(10, color='#f59e0b', linestyle='--', label='10% inbreeding (danger)')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean inbreeding (%)', color='white')
ax.set_title('Inbreeding accumulation over 20 generations', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Mating allocator comparison:")
print(f"  Random mating: mean inbreeding = {np.mean(random_inbreeding):.4f}")
print(f"  Min-kinship:   mean inbreeding = {np.mean(minkin_inbreeding):.4f}")
print(f"  Reduction: {(1 - np.mean(minkin_inbreeding)/max(np.mean(random_inbreeding), 0.0001))*100:.1f}%")
print()
ne_r = 4 * n_sires * n_females / (n_sires + n_females)
print(f"  Effective Ne (random): {ne_r:.0f}")
print(f"  Effective Ne (min-kinship): ~{ne_r * 1.3:.0f}")
print(f"  Generations to 10% inbreeding (random): {int(-np.log(0.9) / (1/(2*ne_r)))}")`,
      challenge: 'Implement a "village exchange" system: every 3 generations, replace the 2 least-related sires with new unrelated bulls (kinship = 0 with all). How does this affect the 20-generation inbreeding trajectory?',
      successHint: 'Periodic introduction of unrelated males dramatically slows inbreeding accumulation — mirroring the traditional practice of inter-village mithun exchange. Even 2 new bulls every 3 generations can halve the inbreeding rate.',
    },
    {
      title: 'Multi-Generation Simulation — running the complete breeding program',
      concept: `Now we connect all three modules — genome model, selection engine, and mating allocator — into a complete breeding program simulator that runs for multiple generations. At each generation, the simulator: (1) evaluates all animals (computes phenotypes and EBVs), (2) selects the top males and females using the selection index, (3) allocates matings using the kinship-minimized algorithm, (4) produces offspring by combining parental gametes, and (5) records genetic statistics.

The key outputs tracked across generations are: **mean breeding value** (is the population improving?), **genetic variance** (is there still room for improvement?), **mean inbreeding coefficient** (is genetic health declining?), and **selection accuracy** (are we identifying the right animals?).

A well-designed breeding program shows a steady increase in mean breeding value, a slow decline in genetic variance (inevitable under directional selection), and a controlled inbreeding rate below 1% per generation. A poorly designed program shows rapid initial gain followed by a plateau as genetic variance is exhausted and inbreeding depression erodes fitness.

The **Bulmer effect** is an important phenomenon in multi-generation selection: directional selection reduces the genetic variance within the selected parents, which reduces the variance in their offspring. This means the breeder's equation overpredicts long-term gain if you use the initial variance. The actual gain declines over generations as variance shrinks. Counter-measures include: maintaining large effective population sizes, introducing new genetic material periodically, and using genomic selection to exploit within-family variance.`,
      analogy: 'The multi-generation simulator is like a business projection spreadsheet that compounds profits and costs over years. Each year\'s profit (genetic gain) is reinvested, but operating costs (inbreeding, variance loss) also compound. A sustainable business grows profits moderately while controlling costs. An aggressive business might show spectacular early profits before costs overwhelm it. The simulator reveals which breeding strategies are genuinely sustainable.',
      storyConnection: 'The mithun in the story comes from a lineage that has been managed across hundreds of generations by Naga communities. Your simulator reveals what those communities achieved through intuition: steady genetic improvement in valued traits while maintaining population health through cross-village breeding exchanges. The simulator validates their approach and shows how it could be optimized further with modern genetic tools.',
      checkQuestion: 'After 30 generations of selection, the genetic variance in your simulated population has dropped to 20% of its starting value. What are your options?',
      checkAnswer: 'Three main options: (1) Introduce new genetic material by importing unrelated animals from a different population — this is the most effective way to restore variance. (2) Reduce selection intensity to slow variance depletion — select the top 40% instead of the top 10%. (3) Switch selection targets — if body weight variance is exhausted, start selecting for a different trait that still has high variance. In practice, option 1 is most common: the Naga practice of inter-village mithun exchange does exactly this.',
      codeIntro: 'Run the complete breeding program simulator for 30 generations and track all key genetic statistics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Complete Breeding Program Simulator ---

class BreedingProgram:
    """Full multi-generation mithun breeding simulator."""

    def __init__(self, n_males=30, n_females=100, n_loci=50):
        self.n_loci = n_loci
        self.n_males = n_males
        self.n_females = n_females

        # Initialize genomes
        self.males = [np.random.randn(n_loci, 2) * 0.5 for _ in range(n_males)]
        self.females = [np.random.randn(n_loci, 2) * 0.5 for _ in range(n_females)]

        # Tracking
        self.gen = 0
        self.history = {
            'mean_bv': [], 'var_bv': [], 'mean_F': [],
            'selection_response': [], 'n_sires_used': [],
        }
        self.F_mean = 0  # mean inbreeding

    def breeding_value(self, genome):
        return np.sum(genome) / self.n_loci

    def phenotype(self, genome, h2=0.3):
        bv = self.breeding_value(genome)
        env_var = (1 - h2) / h2 * np.var([self.breeding_value(g) for g in self.males + self.females])
        return bv + np.random.normal(0, np.sqrt(max(env_var, 0.01)))

    def gamete(self, genome):
        choices = np.random.randint(0, 2, self.n_loci)
        return genome[np.arange(self.n_loci), choices]

    def select_parents(self, n_sires=10, n_dams=60):
        """Select top animals by phenotype."""
        male_ebvs = [(i, self.phenotype(g)) for i, g in enumerate(self.males)]
        female_ebvs = [(i, self.phenotype(g)) for i, g in enumerate(self.females)]

        male_ebvs.sort(key=lambda x: -x[1])
        female_ebvs.sort(key=lambda x: -x[1])

        sire_idx = [i for i, _ in male_ebvs[:n_sires]]
        dam_idx = [i for i, _ in female_ebvs[:n_dams]]

        return sire_idx, dam_idx

    def breed_generation(self, n_sires=10, n_dams=60, exchange_bulls=0):
        """Create next generation."""
        sire_idx, dam_idx = self.select_parents(n_sires, n_dams)

        # Record pre-breeding stats
        all_bvs = [self.breeding_value(g) for g in self.males + self.females]
        sel_bvs = [self.breeding_value(self.males[i]) for i in sire_idx] + \
                   [self.breeding_value(self.females[i]) for i in dam_idx]

        self.history['mean_bv'].append(np.mean(all_bvs))
        self.history['var_bv'].append(np.var(all_bvs))
        self.history['selection_response'].append(np.mean(sel_bvs) - np.mean(all_bvs))
        self.history['n_sires_used'].append(n_sires)

        # Produce offspring
        new_males = []
        new_females = []

        for _ in range(self.n_males):
            s = self.males[np.random.choice(sire_idx)]
            d = self.females[np.random.choice(dam_idx)]
            offspring = np.column_stack([self.gamete(s), self.gamete(d)])
            new_males.append(offspring)

        for _ in range(self.n_females):
            s = self.males[np.random.choice(sire_idx)]
            d = self.females[np.random.choice(dam_idx)]
            offspring = np.column_stack([self.gamete(s), self.gamete(d)])
            new_females.append(offspring)

        # Optional: introduce unrelated bulls
        for _ in range(exchange_bulls):
            new_males[np.random.randint(len(new_males))] = np.random.randn(self.n_loci, 2) * 0.5

        self.males = new_males
        self.females = new_females

        # Update inbreeding estimate
        ne = 4 * n_sires * n_dams / (n_sires + n_dams)
        self.F_mean = 1 - (1 - self.F_mean) * (1 - 1/(2*ne))
        self.history['mean_F'].append(self.F_mean)

        self.gen += 1

# --- Compare breeding strategies over 30 generations ---

n_gen = 30
strategies = {
    'Conservative (15 sires)': {'n_sires': 15, 'exchange': 0},
    'Moderate (10 sires)': {'n_sires': 10, 'exchange': 0},
    'Aggressive (5 sires)': {'n_sires': 5, 'exchange': 0},
    'Moderate + exchange (10 sires, 2 new/5gen)': {'n_sires': 10, 'exchange': 2},
}

results = {}
for name, params in strategies.items():
    bp = BreedingProgram(n_males=30, n_females=100)
    for g in range(n_gen):
        exchange = params['exchange'] if g % 5 == 0 and g > 0 else 0
        bp.breed_generation(n_sires=params['n_sires'], exchange_bulls=exchange)
    results[name] = bp.history

gens = np.arange(n_gen)
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7']

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Mean breeding value
ax = axes[0, 0]
ax.set_facecolor('#111827')
for (name, hist), color in zip(results.items(), colors):
    ax.plot(gens, hist['mean_bv'], color=color, linewidth=2, label=name)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean breeding value', color='white')
ax.set_title('Genetic improvement over 30 generations', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Genetic variance
ax = axes[0, 1]
ax.set_facecolor('#111827')
for (name, hist), color in zip(results.items(), colors):
    ax.plot(gens, hist['var_bv'], color=color, linewidth=2, label=name)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Genetic variance', color='white')
ax.set_title('Variance depletion (Bulmer effect)', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Inbreeding
ax = axes[1, 0]
ax.set_facecolor('#111827')
for (name, hist), color in zip(results.items(), colors):
    ax.plot(gens, [f * 100 for f in hist['mean_F']], color=color, linewidth=2, label=name)
ax.axhline(10, color='#ef4444', linestyle='--', linewidth=1, label='10% danger zone')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean inbreeding (%)', color='white')
ax.set_title('Inbreeding accumulation', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Gain per unit inbreeding (efficiency)
ax = axes[1, 1]
ax.set_facecolor('#111827')
for (name, hist), color in zip(results.items(), colors):
    total_gain = hist['mean_bv'][-1] - hist['mean_bv'][0]
    total_F = hist['mean_F'][-1] * 100
    efficiency = total_gain / max(total_F, 0.01)
    ax.bar(name.split('(')[0].strip(), efficiency, color=color, edgecolor='none')
ax.set_ylabel('Genetic gain per % inbreeding', color='white')
ax.set_title('Breeding efficiency (gain/inbreeding)', color='white', fontsize=11)
ax.tick_params(colors='gray')
labels = ax.get_xticklabels()
for l in labels:
    l.set_color('white')
    l.set_fontsize(7)
    l.set_rotation(20)

plt.tight_layout()
plt.show()

print("30-generation breeding program results:")
print(f"{'Strategy':<45} {'Gain':>8} {'Var left':>10} {'Inbreeding':>12} {'Efficiency':>12}")
print("-" * 87)
for (name, hist), color in zip(results.items(), colors):
    gain = hist['mean_bv'][-1] - hist['mean_bv'][0]
    var_pct = hist['var_bv'][-1] / max(hist['var_bv'][0], 0.001) * 100
    F = hist['mean_F'][-1] * 100
    eff = gain / max(F, 0.01)
    print(f"{name:<45} {gain:>8.3f} {var_pct:>9.1f}% {F:>11.1f}% {eff:>12.3f}")`,
      challenge: 'Add a "crisis scenario": at generation 15, a disease kills 70% of animals randomly. Compare recovery across the four strategies. Which population recovers fastest and why?',
      successHint: 'The conservative strategy with gene exchange recovers fastest because it maintained higher genetic variance and lower inbreeding. The aggressive strategy may never recover because its depleted variance and high inbreeding leave no genetic resilience.',
    },
    {
      title: 'Inbreeding Depression and Genetic Rescue — when small populations need help',
      concept: `Inbreeding depression is the reduction in fitness that occurs when related individuals mate and their offspring become homozygous for deleterious recessive alleles. In livestock, inbreeding depression manifests as: reduced fertility (lower conception rates, more embryonic loss), lower birth weights, higher calf mortality, reduced disease resistance, and lower milk production.

The magnitude of inbreeding depression follows an approximately linear relationship: for each 1% increase in inbreeding coefficient, a trait declines by a characteristic amount called the **inbreeding depression coefficient** (b). For cattle, b values are approximately: birth weight -0.05 kg per 1% F, weaning weight -0.5 kg per 1% F, fertility -0.3% per 1% F, and calf survival -0.2% per 1% F.

**Genetic rescue** is the introduction of unrelated individuals into an inbred population to restore heterozygosity and reverse inbreeding depression. The effect is often dramatic: a single unrelated male introduced into a highly inbred population can increase offspring survival by 20-30% in the first cross generation. This is **heterosis** or **hybrid vigor** — the opposite of inbreeding depression.

For mithun, genetic rescue between isolated subpopulations (Naga, Mizo, Arunachal) could significantly improve fitness if these populations have accumulated different deleterious alleles through drift. The rescue effect depends on the genetic distance between populations: more divergent populations produce stronger heterosis. However, if populations are adapted to different environments, crossing may break up locally adaptive gene combinations — a phenomenon called **outbreeding depression**. The optimal rescue strategy introduces enough genetic diversity to reverse inbreeding depression without disrupting local adaptation.`,
      analogy: 'Inbreeding depression is like a software system where copying the same buggy code into both redundant modules eliminates the safety net. In a heterozygous animal, a defective gene on one chromosome is compensated by a working copy on the other — like having a backup system. Inbreeding makes both copies identical, so if one is defective, both are. Genetic rescue reinstalls different code on the backup drive, restoring redundancy.',
      storyConnection: 'The brave mithun in the story is strong and healthy — traits that depend on adequate genetic diversity. If the village herd became isolated and inbred, future mithun would be weaker, sicker, and less fertile. The traditional practice of exchanging mithun between villages is the genetic rescue that keeps the brave mithun brave. Your model quantifies exactly how much exchange is needed to maintain health.',
      checkQuestion: 'A Naga village\'s mithun herd has been isolated for 15 generations with only 3 breeding bulls. The average inbreeding coefficient is now 25%. A wildlife biologist offers to introduce 2 unrelated bulls from Arunachal Pradesh. What improvement can the village expect?',
      checkAnswer: 'The F1 calves from the Arunachal bulls will have an inbreeding coefficient near 0% (since parents are unrelated), compared to 25% for within-herd matings. Expected improvements based on inbreeding depression coefficients: birth weight increase of ~1.25 kg, weaning weight increase of ~12.5 kg, fertility increase of ~7.5%, calf survival increase of ~5%. These are dramatic improvements from just 2 bulls. However, the F2 generation (if F1 animals mate with each other) will partially lose the heterosis advantage, so continued periodic introduction is needed.',
      codeIntro: 'Model inbreeding depression and genetic rescue in a mithun population over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Inbreeding Depression & Genetic Rescue Model ---

class InbreedingModel:
    """Model fitness decline from inbreeding and recovery from rescue."""

    # Inbreeding depression coefficients (per 1% increase in F)
    DEPRESSION = {
        'birth_weight': {'baseline': 25, 'b': -0.05, 'unit': 'kg'},
        'weaning_weight': {'baseline': 150, 'b': -0.50, 'unit': 'kg'},
        'fertility': {'baseline': 85, 'b': -0.30, 'unit': '%'},
        'calf_survival': {'baseline': 95, 'b': -0.20, 'unit': '%'},
        'disease_resist': {'baseline': 80, 'b': -0.25, 'unit': 'score'},
    }

    def trait_value(self, trait, F_pct):
        """Trait value given inbreeding percentage."""
        info = self.DEPRESSION[trait]
        return info['baseline'] + info['b'] * F_pct

    def population_fitness(self, F_pct):
        """Overall fitness index (0-1) combining all traits."""
        fert = self.trait_value('fertility', F_pct) / 100
        surv = self.trait_value('calf_survival', F_pct) / 100
        vigor = self.trait_value('disease_resist', F_pct) / 100
        return fert * surv * vigor

    def simulate_isolation(self, Ne, n_gen=30):
        """Simulate inbreeding accumulation in an isolated population."""
        F = [0]
        for g in range(1, n_gen + 1):
            F.append(1 - (1 - 1/(2*Ne)) * (1 - F[-1]))
        return np.array(F) * 100  # convert to percentage

    def simulate_rescue(self, F_start_pct, n_rescue_males, pop_size=100, n_gen=20):
        """Simulate genetic rescue: introduce unrelated males."""
        F_history = [F_start_pct]

        # First cross: F1 from rescue males has F = 0
        # Average population F after rescue mating
        fraction_rescue = n_rescue_males / (pop_size * 0.3)  # fraction of sires that are new
        fraction_rescue = min(fraction_rescue, 1.0)

        for g in range(1, n_gen + 1):
            if g == 1:
                # F1 generation: rescue calves have F~0, others maintain old F
                new_F = F_start_pct * (1 - fraction_rescue) + 0 * fraction_rescue
                # Heterosis bonus: additional 10% fitness boost in F1
            else:
                # Subsequent generations: inbreeding slowly climbs again
                # but from a lower starting point
                Ne_new = pop_size * 0.8  # improved Ne from new genetics
                new_F = 1 - (1 - 1/(2*Ne_new)) * (1 - F_history[-1]/100)
                new_F *= 100

            F_history.append(max(new_F, 0))

        return np.array(F_history)

model = InbreedingModel()

fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Trait decline with inbreeding
ax = axes[0, 0]
ax.set_facecolor('#111827')
F_range = np.linspace(0, 30, 100)
trait_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']
for (trait, info), color in zip(model.DEPRESSION.items(), trait_colors):
    vals = [model.trait_value(trait, f) for f in F_range]
    normalized = np.array(vals) / info['baseline'] * 100
    ax.plot(F_range, normalized, color=color, linewidth=2, label=trait.replace('_', ' '))
ax.set_xlabel('Inbreeding coefficient (%)', color='white')
ax.set_ylabel('Trait value (% of baseline)', color='white')
ax.set_title('Inbreeding depression by trait', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Overall fitness vs inbreeding
ax = axes[0, 1]
ax.set_facecolor('#111827')
fitness = [model.population_fitness(f) for f in F_range]
ax.plot(F_range, fitness, color='#a855f7', linewidth=2)
ax.fill_between(F_range, fitness, alpha=0.2, color='#a855f7')
ax.axhline(0.5, color='#ef4444', linestyle='--', label='50% fitness (critical)')
ax.set_xlabel('Inbreeding (%)', color='white')
ax.set_ylabel('Population fitness (0-1)', color='white')
ax.set_title('Compound fitness decline', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Inbreeding accumulation for different Ne
ax = axes[0, 2]
ax.set_facecolor('#111827')
Ne_values = [20, 50, 100, 200]
ne_colors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e']
for Ne, color in zip(Ne_values, ne_colors):
    F = model.simulate_isolation(Ne, 30)
    ax.plot(range(31), F, color=color, linewidth=2, label=f'Ne = {Ne}')
ax.axhline(10, color='gray', linestyle='--', label='10% (significant depression)')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Inbreeding (%)', color='white')
ax.set_title('Inbreeding accumulation by Ne', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Genetic rescue scenarios
ax = axes[1, 0]
ax.set_facecolor('#111827')
rescue_scenarios = {
    'No rescue': (25, 0),
    '1 new bull': (25, 1),
    '2 new bulls': (25, 2),
    '5 new bulls': (25, 5),
}
rescue_colors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e']
for (name, (F_start, n_bulls)), color in zip(rescue_scenarios.items(), rescue_colors):
    if n_bulls == 0:
        F_traj = model.simulate_isolation(20, 20)
        F_traj = F_traj + F_start - F_traj[0]
    else:
        F_traj = model.simulate_rescue(F_start, n_bulls, 100, 20)
    ax.plot(range(len(F_traj)), F_traj, color=color, linewidth=2, label=name)
ax.set_xlabel('Generation after rescue', color='white')
ax.set_ylabel('Inbreeding (%)', color='white')
ax.set_title('Genetic rescue: F trajectory', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Fitness recovery from rescue
ax = axes[1, 1]
ax.set_facecolor('#111827')
for (name, (F_start, n_bulls)), color in zip(rescue_scenarios.items(), rescue_colors):
    if n_bulls == 0:
        F_traj = model.simulate_isolation(20, 20) + F_start
    else:
        F_traj = model.simulate_rescue(F_start, n_bulls, 100, 20)
    fitness_traj = [model.population_fitness(f) for f in F_traj]
    ax.plot(range(len(fitness_traj)), fitness_traj, color=color, linewidth=2, label=name)
ax.axhline(0.5, color='gray', linestyle='--')
ax.set_xlabel('Generation after rescue', color='white')
ax.set_ylabel('Population fitness', color='white')
ax.set_title('Fitness recovery from rescue', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Cost-benefit of rescue (bulls needed vs fitness gain)
ax = axes[1, 2]
ax.set_facecolor('#111827')
n_bulls_range = range(0, 11)
fitness_gain = []
for nb in n_bulls_range:
    if nb == 0:
        fg = 0
    else:
        F_traj = model.simulate_rescue(25, nb, 100, 10)
        f_after = model.population_fitness(F_traj[-1])
        f_before = model.population_fitness(25)
        fg = f_after - f_before
    fitness_gain.append(fg)
ax.bar(n_bulls_range, fitness_gain, color='#3b82f6', edgecolor='none')
ax.set_xlabel('Number of rescue bulls', color='white')
ax.set_ylabel('Fitness gain after 10 generations', color='white')
ax.set_title('Diminishing returns of genetic rescue', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Inbreeding depression at 25% inbreeding:")
for trait, info in model.DEPRESSION.items():
    val = model.trait_value(trait, 25)
    pct = val / info['baseline'] * 100
    print(f"  {trait}: {info['baseline']} -> {val:.1f} {info['unit']} ({pct:.0f}% of baseline)")
print(f"  Overall fitness: {model.population_fitness(25):.3f} (vs 1.0 baseline)")
print()
print("Genetic rescue with 2 bulls from Arunachal Pradesh:")
F_rescued = model.simulate_rescue(25, 2, 100, 10)
print(f"  Inbreeding: 25% -> {F_rescued[-1]:.1f}% after 10 generations")
print(f"  Fitness: {model.population_fitness(25):.3f} -> {model.population_fitness(F_rescued[-1]):.3f}")`,
      challenge: 'Model outbreeding depression: when crossing very divergent populations (e.g., mithun x gaur hybrid), F2 fitness drops below both parents. Add a distance-dependent outbreeding depression term and find the optimal genetic distance for rescue.',
      successHint: 'There is a sweet spot: populations different enough to provide heterosis but similar enough to avoid outbreeding depression. For mithun, this means crossing between NE Indian subpopulations (small genetic distance, strong rescue effect) rather than crossing with distantly related gaur (high distance, outbreeding risk).',
    },
    {
      title: 'Conservation Breeding Plan — a practical tool for mithun managers',
      concept: `The capstone concludes by packaging the breeding simulator into a practical tool that a mithun conservation manager could use. The tool takes as input: current herd composition (number of males and females, estimated relatedness), breeding goals (trait weights), constraints (maximum inbreeding rate, minimum genetic gain per generation), and available resources (budget for purchasing new bulls, lab capacity for genetic testing).

The output is a **breeding plan**: which bulls to use, how many matings each should have, which cows to pair with which bulls, when to introduce new genetic material, and projected genetic progress over 10 generations. The plan is not a fixed prescription — it includes sensitivity analysis showing how outcomes change if assumptions are wrong.

A key innovation for NE Indian mithun programs is integrating **traditional knowledge** with quantitative genetics. Naga and Mizo communities have deep knowledge about individual mithun: their temperament, health history, lineage, and environmental performance. This knowledge is equivalent to phenotypic data in a formal breeding program. The tool converts traditional knowledge into EBVs, making it compatible with modern breeding algorithms while respecting indigenous expertise.

The final visualization is a **decision dashboard** showing: current population status (Ne, F, genetic variance), projected outcomes under different strategies, recommended mating list, and key risk indicators (variance depletion rate, inbreeding acceleration). This dashboard makes complex genetics accessible to non-geneticists, enabling informed decisions about one of Northeast India's most culturally important animals.`,
      analogy: 'The breeding plan is like a GPS navigation system for genetic improvement. The current position is the herd\'s genetic status. The destination is the breeding goal. The GPS considers multiple routes (breeding strategies), avoids hazards (inbreeding, variance loss), and provides turn-by-turn directions (specific mating recommendations). And like a GPS, it recalculates when conditions change — if a prize bull dies or a new population is discovered.',
      storyConnection: 'The brave mithun in the story represents the best of what selective breeding can produce: strength, courage, and trust. But the story also carries an implicit warning — that without thoughtful management, these qualities could be lost. Your breeding plan is the tool that ensures the brave mithun\'s descendants remain as remarkable as their ancestor. It translates the story\'s cultural aspiration into a quantitative conservation action plan.',
      checkQuestion: 'A conservation manager has budget to either: (A) genotype all 150 animals in the herd using SNP chips, or (B) purchase 3 unrelated bulls from Arunachal Pradesh. Which should she choose and why?',
      checkAnswer: 'If the herd is already significantly inbred (F > 15%), option B (3 new bulls) is the priority because genetic rescue provides immediate fitness recovery. Genotyping an inbred herd gives precise inbreeding estimates but does not fix the problem. If the herd has low inbreeding but uncertain pedigree, option A (genotyping) is better because it enables precise mating allocation to prevent future inbreeding without the risk of introducing maladapted genes. The optimal strategy depends on the current crisis: is the problem already here (rescue needed) or can it be prevented (information needed)?',
      codeIntro: 'Build the conservation breeding dashboard that synthesizes all simulator outputs into actionable recommendations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Conservation Breeding Dashboard ---

class BreedingDashboard:
    """Generate a conservation breeding plan for a mithun herd."""

    def __init__(self, n_males=25, n_females=80, current_F=8.0):
        self.n_males = n_males
        self.n_females = n_females
        self.F = current_F

        # Generate current herd data
        self.male_ebvs = np.random.normal(0, 1, n_males)
        self.female_ebvs = np.random.normal(0, 1, n_females)
        self.male_ages = np.random.randint(2, 15, n_males)
        self.female_ages = np.random.randint(3, 18, n_females)

        # Kinship estimates (simplified)
        self.kinship = np.eye(n_males + n_females) * 0.5 + current_F / 200
        # Some more related pairs
        for i in range(5):
            j = (i + 1) % n_males
            self.kinship[i, j] = 0.2
            self.kinship[j, i] = 0.2

    def compute_Ne(self, n_sires):
        return 4 * n_sires * self.n_females / (n_sires + self.n_females)

    def project_genetics(self, n_sires, n_gen=10, exchange_rate=0):
        """Project genetic progress and inbreeding."""
        F = self.F
        bv_mean = np.mean(np.concatenate([self.male_ebvs, self.female_ebvs]))
        bv_var = np.var(np.concatenate([self.male_ebvs, self.female_ebvs]))

        results = {'gen': [], 'F': [], 'bv': [], 'var': [], 'fitness': []}

        for g in range(n_gen):
            Ne = self.compute_Ne(n_sires)
            if exchange_rate > 0 and g % 3 == 0 and g > 0:
                Ne *= 1.5  # exchange effectively increases Ne

            # Breeder's equation
            h2 = 0.3
            i = 1.0  # moderate selection intensity
            sigma_a = np.sqrt(bv_var * h2)
            response = i * h2 * sigma_a
            bv_mean += response

            # Variance depletion
            bv_var *= (1 - 1/(2*Ne))

            # Inbreeding
            delta_F = 1 / (2 * Ne)
            if exchange_rate > 0 and g % 3 == 0 and g > 0:
                delta_F *= 0.5  # exchange reduces inbreeding rate
            F = 1 - (1 - delta_F) * (1 - F/100)
            F *= 100

            # Fitness
            fitness = (85 - 0.3 * F) / 100 * (95 - 0.2 * F) / 100 * (80 - 0.25 * F) / 100

            results['gen'].append(g + 1)
            results['F'].append(F)
            results['bv'].append(bv_mean)
            results['var'].append(bv_var)
            results['fitness'].append(fitness)

        return results

    def recommend_matings(self, n_sires=10):
        """Generate mating recommendations."""
        # Select top sires
        sire_ranking = np.argsort(self.male_ebvs)[::-1]
        selected_sires = sire_ranking[:n_sires]

        # Assign dams to sires minimizing kinship
        matings = []
        sire_loads = {s: 0 for s in selected_sires}
        max_load = self.n_females // n_sires + 2

        for d in range(self.n_females):
            best_sire = None
            best_score = -999
            d_idx = self.n_males + d  # offset for kinship matrix
            for s in selected_sires:
                if sire_loads[s] >= max_load:
                    continue
                kinship = self.kinship[s, min(d_idx, len(self.kinship)-1)]
                ebv_bonus = self.male_ebvs[s]
                score = ebv_bonus - 10 * kinship  # penalize high kinship
                if score > best_score:
                    best_score = score
                    best_sire = s
            if best_sire is not None:
                matings.append((best_sire, d))
                sire_loads[best_sire] += 1

        return matings, selected_sires

# --- Generate Dashboard ---
dashboard = BreedingDashboard(n_males=25, n_females=80, current_F=8.0)

fig, axes = plt.subplots(3, 2, figsize=(14, 15))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('MITHUN CONSERVATION BREEDING DASHBOARD', color='white',
             fontsize=16, fontweight='bold', y=0.98)

# Panel 1: Current herd status
ax = axes[0, 0]
ax.set_facecolor('#111827')
status_text = [
    f"Total animals: {dashboard.n_males + dashboard.n_females}",
    f"Males: {dashboard.n_males} (ages {dashboard.male_ages.min()}-{dashboard.male_ages.max()} yr)",
    f"Females: {dashboard.n_females} (ages {dashboard.female_ages.min()}-{dashboard.female_ages.max()} yr)",
    f"Current inbreeding: {dashboard.F:.1f}%",
    f"Mean EBV (males): {np.mean(dashboard.male_ebvs):.2f}",
    f"Mean EBV (females): {np.mean(dashboard.female_ebvs):.2f}",
    f"Genetic variance: {np.var(np.concatenate([dashboard.male_ebvs, dashboard.female_ebvs])):.3f}",
]
for i, text in enumerate(status_text):
    color = '#22c55e' if 'inbreeding' not in text.lower() else '#f59e0b'
    ax.text(0.05, 0.9 - i * 0.12, text, transform=ax.transAxes,
            color=color, fontsize=10, fontfamily='monospace')
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.set_xticks([])
ax.set_yticks([])
ax.set_title('CURRENT HERD STATUS', color='white', fontsize=12)

# Panel 2: Projected outcomes (3 strategies)
ax = axes[0, 1]
ax.set_facecolor('#111827')
strats = {
    '5 sires (aggressive)': dashboard.project_genetics(5),
    '10 sires (moderate)': dashboard.project_genetics(10),
    '10 sires + exchange': dashboard.project_genetics(10, exchange_rate=2),
}
strat_colors = ['#ef4444', '#3b82f6', '#22c55e']
for (name, proj), color in zip(strats.items(), strat_colors):
    ax.plot(proj['gen'], proj['bv'], color=color, linewidth=2, label=name)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Mean breeding value', color='white')
ax.set_title('PROJECTED GENETIC GAIN', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Panel 3: Inbreeding projection
ax = axes[1, 0]
ax.set_facecolor('#111827')
for (name, proj), color in zip(strats.items(), strat_colors):
    ax.plot(proj['gen'], proj['F'], color=color, linewidth=2, label=name)
ax.axhline(15, color='#ef4444', linestyle='--', linewidth=1, label='Danger zone (15%)')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Inbreeding (%)', color='white')
ax.set_title('INBREEDING TRAJECTORY', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Panel 4: Fitness projection
ax = axes[1, 1]
ax.set_facecolor('#111827')
for (name, proj), color in zip(strats.items(), strat_colors):
    ax.plot(proj['gen'], proj['fitness'], color=color, linewidth=2, label=name)
ax.axhline(0.5, color='#ef4444', linestyle='--', linewidth=1)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Population fitness', color='white')
ax.set_title('FITNESS PROJECTION', color='white', fontsize=12)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Panel 5: Recommended sire usage
ax = axes[2, 0]
ax.set_facecolor('#111827')
matings, selected = dashboard.recommend_matings(n_sires=10)
sire_loads = {}
for s, d in matings:
    sire_loads[s] = sire_loads.get(s, 0) + 1

sire_ids = sorted(sire_loads.keys())
loads = [sire_loads[s] for s in sire_ids]
ebvs_sel = [dashboard.male_ebvs[s] for s in sire_ids]
colors_sire = plt.cm.viridis(np.linspace(0.3, 0.9, len(sire_ids)))
bars = ax.bar(range(len(sire_ids)), loads, color=colors_sire, edgecolor='none')
ax.set_xticks(range(len(sire_ids)))
ax.set_xticklabels([f'Bull {s}\\n(EBV:{ebvs_sel[i]:.1f})' for i, s in enumerate(sire_ids)],
                    color='white', fontsize=6, rotation=45)
ax.set_ylabel('Matings assigned', color='white')
ax.set_title('RECOMMENDED SIRE USAGE', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Panel 6: Risk indicators
ax = axes[2, 1]
ax.set_facecolor('#111827')
mod_proj = strats['10 sires + exchange']
risks = {
    'Current Ne': (dashboard.compute_Ne(10), 50, 200),
    'Inbreeding rate (%/gen)': (mod_proj['F'][0] - dashboard.F, 0, 2),
    'Genetic variance': (mod_proj['var'][0], 0, 0.5),
    'Projected F at gen 10': (mod_proj['F'][-1], 0, 20),
    'Fitness at gen 10': (mod_proj['fitness'][-1], 0.5, 1.0),
}

y_pos = np.arange(len(risks))
for i, (name, (val, low, high)) in enumerate(risks.items()):
    # Normalize to 0-1 for color coding
    if name in ['Inbreeding rate (%/gen)', 'Projected F at gen 10']:
        goodness = 1 - (val - low) / (high - low)
    else:
        goodness = (val - low) / (high - low)
    goodness = np.clip(goodness, 0, 1)
    color = plt.cm.RdYlGn(goodness)
    ax.barh(i, goodness, color=color, edgecolor='none', height=0.6)
    ax.text(max(goodness + 0.02, 0.02), i, f'{name}: {val:.2f}',
            color='white', fontsize=9, va='center')

ax.set_xlim(0, 1.5)
ax.set_yticks([])
ax.set_xlabel('Risk score (green=safe, red=danger)', color='white')
ax.set_title('RISK INDICATORS', color='white', fontsize=12)
ax.tick_params(colors='gray')

plt.tight_layout(rect=[0, 0, 1, 0.96])
plt.show()

print("=" * 60)
print("MITHUN CONSERVATION BREEDING PLAN — SUMMARY")
print("=" * 60)
print(f"Herd: {dashboard.n_males} males, {dashboard.n_females} females")
print(f"Current inbreeding: {dashboard.F:.1f}%")
print(f"Effective population size (10 sires): {dashboard.compute_Ne(10):.0f}")
print()
print("RECOMMENDED STRATEGY: 10 sires with periodic exchange")
print(f"  Selected sires: {list(selected)}")
print(f"  Matings allocated: {len(matings)}")
print(f"  Max matings per sire: {max(sire_loads.values())}")
print()
print("10-GENERATION PROJECTION:")
proj = strats['10 sires + exchange']
print(f"  Genetic gain: {proj['bv'][0]:.3f} -> {proj['bv'][-1]:.3f}")
print(f"  Inbreeding: {dashboard.F:.1f}% -> {proj['F'][-1]:.1f}%")
print(f"  Fitness: {proj['fitness'][0]:.3f} -> {proj['fitness'][-1]:.3f}")
print()
print("ACTIONS REQUIRED:")
print("  1. Acquire 2 unrelated bulls from Arunachal Pradesh within 1 year")
print("  2. Genotype all breeding males using SNP panel")
print("  3. Implement recommended mating plan for this season")
print("  4. Re-evaluate in 3 years (1 mithun generation)")`,
      challenge: 'Add an economic module: each bull purchase costs 50,000 INR, genotyping costs 5,000 INR per animal, and each calf is worth 80,000 INR. Calculate the return on investment for the breeding plan over 10 generations.',
      successHint: 'The economic analysis shows that investment in genetic management (bull purchase + genotyping) pays for itself within 2-3 generations through improved calf survival, fertility, and growth rates. Genetic management is not a cost — it is an investment with compounding returns.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone project: Mithun Breeding Program Simulator</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete breeding program simulator using Python with numpy and matplotlib. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}