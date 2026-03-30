import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sprout } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import BodhiSeedCuttingDiagram from '../diagrams/BodhiSeedCuttingDiagram';
import BodhiDNACloneDiagram from '../diagrams/BodhiDNACloneDiagram';
import BodhiGraftingDiagram from '../diagrams/BodhiGraftingDiagram';
import BodhiCRISPRDiagram from '../diagrams/BodhiCRISPRDiagram';
import ActivityCuttingDiagram from '../diagrams/ActivityCuttingDiagram';

export default function BodhiTreeLevel1() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const diagrams = [BodhiSeedCuttingDiagram, BodhiDNACloneDiagram, BodhiGraftingDiagram, BodhiCRISPRDiagram, ActivityCuttingDiagram, null];

  const miniLessons = [
    {
      title: 'Sexual vs asexual reproduction in plants',
      concept: `The Bodhi Tree story raises a fundamental question: why did Sanghamitta carry a **cutting** across the sea instead of a seed? The answer lies in two very different ways plants reproduce.

**Sexual reproduction** (seeds):
1. A flower produces **pollen** (male) and **ovules** (female)
2. Pollen travels to the ovule (via wind, insects, or birds) — this is **pollination**
3. The pollen's DNA merges with the ovule's DNA — this is **fertilization**
4. The fertilized ovule develops into a **seed** containing a unique DNA combination
5. Each seed is genetically different from the parent — a new individual

**Asexual reproduction** (cuttings, runners, bulbs):
1. A piece of the parent plant separates or is cut
2. That piece grows roots and shoots using its own cells
3. No pollination, no fertilization, no gene mixing
4. Every cell carries the exact same DNA as the parent
5. The new plant is a **clone**

Plants are remarkable because many species can do BOTH. A strawberry plant produces seeds (inside the fruit) AND sends out runners that clone it. The seed route creates genetic diversity. The clone route preserves a proven winner.`,
      analogy: 'Seeds are like shuffling two decks of cards together and dealing a new hand — you get something unique every time. A cutting is like photocopying a winning hand — the copy is identical to the original. Sanghamitta did not want a random hand. She wanted the exact same tree.',
      storyConnection: 'Sanghamitta carried a cutting, not a seed, because she wanted to preserve the EXACT tree under which the Buddha sat. A seed would have produced a related but different tree — similar leaves, but not the same individual. The cutting preserved the original genome across an ocean and 2,300 years.',
      checkQuestion: 'A farmer has one amazing tomato plant that produces huge, sweet fruit. She collects seeds from its tomatoes and plants them. Will the next generation produce identical tomatoes?',
      checkAnswer: 'No. Tomato flowers self-pollinate, but even self-pollination involves sexual reproduction — the DNA recombines during meiosis, producing genetically different offspring. Some seedlings may produce smaller or less sweet fruit. To get identical tomatoes, she should clone the plant using stem cuttings or grafting.',
      codeIntro: 'Simulate sexual vs asexual reproduction: model how gene mixing in seeds creates variation while clones stay identical.',
      code: `import random
import numpy as np

random.seed(42)
np.random.seed(42)

# Each gene has two alleles (versions)
# Parent A genotype: 10 genes
parent_a = [('tall', 'short'), ('sweet', 'sour'), ('thick', 'thin'),
            ('green', 'yellow'), ('fast', 'slow'), ('hairy', 'smooth'),
            ('wide', 'narrow'), ('deep', 'shallow'), ('waxy', 'matte'),
            ('strong', 'weak')]

# Clone: exact copy of parent A
clone = [(a1, a2) for a1, a2 in parent_a]

# Seed: one allele from each parent, randomly chosen
parent_b = [('short', 'tall'), ('sour', 'sweet'), ('thin', 'thick'),
            ('yellow', 'green'), ('slow', 'fast'), ('smooth', 'hairy'),
            ('narrow', 'wide'), ('shallow', 'deep'), ('matte', 'waxy'),
            ('weak', 'strong')]

def make_seed(pa, pb):
    return [(random.choice(pa[i]), random.choice(pb[i])) for i in range(len(pa))]

print("Parent A genotype:")
for i, (a1, a2) in enumerate(parent_a):
    print(f"  Gene {i+1}: {a1}/{a2}")

print(f"\\nClone matches parent: {sum(c == p for c, p in zip(clone, parent_a))}/10 genes")

print("\\n--- 5 seeds from Parent A x Parent B ---")
for s in range(5):
    seed = make_seed(parent_a, parent_b)
    matches = sum(sd == pa for sd, pa in zip(seed, parent_a))
    print(f"  Seed {s+1}: {matches}/10 genes match parent A")

print("\\nClones are always 10/10. Seeds vary every time.")
print("This is why the Bodhi Tree cutting preserved the original.")`,
      challenge: 'Model 1000 seeds and plot a histogram of how many genes each seed shares with Parent A. What distribution do you get? (Hint: each gene has a 50% chance of matching.)',
      successHint: 'Sexual reproduction creates variation — the raw material for natural selection. Asexual reproduction preserves what works. Both strategies have advantages, which is why many plants use both.',
    },
    {
      title: 'DNA replication — how cells copy the blueprint',
      concept: `Every time a cell divides, it must copy all of its DNA — billions of letters, with near-perfect accuracy. This process is called **DNA replication**.

How it works:
1. The double helix **unzips**: an enzyme called **helicase** separates the two strands
2. Each strand serves as a **template**: the sequence of one strand dictates the other
3. **DNA polymerase** reads each base and adds the complementary one:
   - A pairs with T
   - G pairs with C
4. Two identical double helices result — each with one old strand and one new strand

The accuracy is extraordinary:
- DNA polymerase makes about 1 error per 100,000 bases
- **Proofreading** enzymes check the work, reducing errors to ~1 per 10 million bases
- **Mismatch repair** catches most remaining errors: final rate ~1 error per BILLION bases

In the Bodhi Tree context:
- The *Ficus religiosa* genome is ~530 million base pairs
- At 1 error per billion, a cell division introduces ~0.5 mutations on average
- Over 2,300 years and trillions of cell divisions, some mutations have accumulated
- But the vast majority of the genome remains identical to the original tree

This is why the Sri Maha Bodhi can still be called "genetically identical" — the mutations are vanishingly small compared to the total genome.`,
      analogy: 'DNA replication is like copying a 530-million-character book by hand, but with three layers of proofreaders. The first copyist makes a typo every 100,000 characters. The first proofreader catches 99% of those. The second proofreader catches 99% of what remains. The final book has about one typo per billion characters — roughly half a typo in the entire genome.',
      storyConnection: 'The Bodhi Tree cutting carried to Sri Lanka in 288 BCE contained cells with DNA identical to the parent tree. Over 2,300 years of growth, trillions of cell divisions have occurred, each copying that same DNA. The mutations that have crept in are like a few changed words in a 530-million-word book — the story is still the same.',
      checkQuestion: 'If DNA polymerase makes 1 error per 100,000 bases, and the fig tree genome is 530 million bases, how many errors would occur per cell division WITHOUT proofreading?',
      checkAnswer: '530,000,000 / 100,000 = 5,300 errors per cell division. That sounds terrible! But proofreading reduces this by 99%, giving ~53 errors. Mismatch repair catches another ~99%, leaving ~0.5 errors per cell division. The layered error-correction system is why DNA replication is reliable enough for cloning to work across millennia.',
      codeIntro: 'Simulate DNA replication with and without proofreading to see how error rates compound.',
      code: `import numpy as np

np.random.seed(42)

# Simulate DNA replication
genome_size = 530_000_000  # Ficus religiosa genome (base pairs)
bases = ['A', 'T', 'G', 'C']

# Error rates at each stage
polymerase_error_rate = 1 / 100_000
proofreading_catch_rate = 0.99
mismatch_repair_catch_rate = 0.99

# Final error rate per base
final_error_rate = polymerase_error_rate * (1 - proofreading_catch_rate) * (1 - mismatch_repair_catch_rate)

print("DNA Replication Error Analysis")
print("=" * 45)
print(f"Genome size: {genome_size:,} base pairs")
print(f"Polymerase error rate: 1 per {int(1/polymerase_error_rate):,}")
print(f"After proofreading: 1 per {int(1/(polymerase_error_rate*(1-proofreading_catch_rate))):,}")
print(f"After mismatch repair: 1 per {int(1/final_error_rate):,}")
print()

# Errors per cell division
errors_no_repair = genome_size * polymerase_error_rate
errors_proofread = errors_no_repair * (1 - proofreading_catch_rate)
errors_final = errors_proofread * (1 - mismatch_repair_catch_rate)

print("Errors per cell division:")
print(f"  Without any repair: {errors_no_repair:,.0f}")
print(f"  With proofreading only: {errors_proofread:,.0f}")
print(f"  With full repair: {errors_final:.1f}")
print()

# Accumulated mutations over 2,300 years
# Assume ~50 cell divisions per year in growing tissue
years = 2300
divisions_per_year = 50
total_divisions = years * divisions_per_year
total_mutations = total_divisions * errors_final

print(f"Over {years} years ({total_divisions:,} divisions):")
print(f"  Total accumulated mutations: ~{total_mutations:,.0f}")
print(f"  As fraction of genome: {total_mutations/genome_size:.6%}")
print(f"  Genome identity: {(1 - total_mutations/genome_size)*100:.4f}%")
print()
print("The Sri Maha Bodhi is still >99.99% identical to the original.")
print("DNA replication is astonishingly reliable.")`,
      challenge: 'What if proofreading did not exist? Model how quickly the genome would diverge from the original over 2,300 years. At what point would the tree be less than 99% identical?',
      successHint: 'DNA replication is one of the most precise processes in biology. Without it, cloning would be impossible — every copy would drift rapidly from the original. The Bodhi Tree lineage exists because this molecular machinery is extraordinarily faithful.',
    },
    {
      title: 'Mitosis vs meiosis — the two types of cell division',
      concept: `Cells divide for two very different purposes, using two very different processes:

**Mitosis** (growth and repair):
- Produces 2 daughter cells, each with the SAME DNA as the parent
- Used for: growing taller, healing wounds, replacing dead cells
- The DNA is copied, then the cell splits in two
- Result: identical copies — this is how clones stay identical

**Meiosis** (making sex cells):
- Produces 4 daughter cells, each with HALF the DNA
- Used for: making pollen and egg cells (gametes)
- The DNA is copied, shuffled (**crossing over**), then the cell divides TWICE
- Result: 4 genetically unique cells — this is why seeds are all different

The key step in meiosis is **crossing over**: sections of DNA swap between paired chromosomes. This is the card shuffle. It happens randomly, so every pollen grain and every egg cell is genetically unique.

When a cutting grows:
- All cell division is **mitosis** → identical copies → clone
- No meiosis occurs → no gene shuffling → no variation

When a seed forms:
- Meiosis creates unique pollen and egg cells
- Fertilization combines two unique gametes
- Result: a genetically unique individual

This is the molecular explanation for why cuttings produce clones and seeds produce unique offspring.`,
      analogy: 'Mitosis is like a photocopier — put in one page, get out two identical pages. Meiosis is like putting two different books through a blender, then randomly assembling four new mini-books from the pieces. The photocopier preserves; the blender creates novelty.',
      storyConnection: 'When monks in Anuradhapura tend the Sri Maha Bodhi and new branches grow, every new cell is produced by mitosis — faithful copying. But if the tree flowers and produces seeds (Ficus religiosa does produce tiny figs with seeds), those seeds were made through meiosis — shuffled, unique, and different from the parent. The monks knew to use cuttings, not seeds.',
      checkQuestion: 'Identical twins come from one fertilized egg that splits in two. Is this more like mitosis or meiosis?',
      checkAnswer: 'Mitosis. The fertilized egg divides by mitosis into two cells, which then separate and each develops into a complete person. Since mitosis copies DNA identically, identical twins have the same DNA — they are natural human clones. Fraternal twins, by contrast, come from two different eggs fertilized by two different sperm (two separate meiosis + fertilization events), so they are genetically distinct.',
      codeIntro: 'Simulate mitosis and meiosis side by side — watch how mitosis preserves the genome while meiosis creates diversity.',
      code: `import random
import numpy as np

random.seed(42)

# Simplified genome: 5 chromosome pairs, each with 2 genes
# Format: (maternal_allele, paternal_allele)
parent_genome = {
    'Chr1': [('A', 'a'), ('B', 'b')],
    'Chr2': [('C', 'c'), ('D', 'd')],
    'Chr3': [('E', 'e'), ('F', 'f')],
    'Chr4': [('G', 'g'), ('H', 'h')],
    'Chr5': [('I', 'i'), ('J', 'j')],
}

def mitosis(genome):
    """Mitosis: exact copy."""
    return {chr_name: [(a, b) for a, b in genes]
            for chr_name, genes in genome.items()}

def meiosis(genome):
    """Meiosis: independent assortment + crossing over."""
    gamete = {}
    for chr_name, genes in genome.items():
        # Independent assortment: randomly pick maternal or paternal
        which_parent = random.choice([0, 1])
        # Crossing over: small chance of swapping within chromosome
        crossover = random.random() < 0.3
        new_genes = []
        for gene in genes:
            if crossover:
                which_parent = 1 - which_parent  # swap
                crossover = False
            new_genes.append(gene[which_parent])
        gamete[chr_name] = new_genes
    return gamete

print("Parent genome:")
for chr_name, genes in parent_genome.items():
    alleles = [f"{a}/{b}" for a, b in genes]
    print(f"  {chr_name}: {', '.join(alleles)}")

print("\\n--- MITOSIS (clone) ---")
daughter = mitosis(parent_genome)
matches = sum(d == p for chr_d, chr_p in zip(daughter.values(), parent_genome.values())
              for d, p in zip(chr_d, chr_p))
print(f"  Daughter matches parent: {matches}/10 gene pairs")

print("\\n--- MEIOSIS (5 gametes) ---")
for i in range(5):
    gamete = meiosis(parent_genome)
    alleles = [a for genes in gamete.values() for a in genes]
    print(f"  Gamete {i+1}: {alleles}")

print("\\nMitosis: always identical. Meiosis: always different.")
print("This is why cuttings clone and seeds diversify.")`,
      challenge: 'Simulate two parents each producing gametes via meiosis, then combine two gametes to make a seed. Repeat 100 times. How much variation do you see among the 100 seeds?',
      successHint: 'Mitosis and meiosis are the two fundamental modes of cell division. Mitosis preserves — it is the engine of cloning. Meiosis diversifies — it is the engine of evolution. Plants use both, which is why they can both clone and evolve.',
    },
    {
      title: 'Totipotency — why plant cells can do what animal cells cannot',
      concept: `Here is one of the most remarkable differences between plants and animals: take a single cell from a plant leaf, give it the right hormones, and it can grow into a complete new plant — roots, stem, leaves, flowers, everything. This ability is called **totipotency**.

Animal cells lose this ability early in development:
- A fertilized egg (zygote) is totipotent — it can become any cell type
- After a few divisions, cells become **pluripotent** — they can become many types but not all
- Further specialization makes them **multipotent** (a few types) or **unipotent** (one type)
- A mature skin cell CANNOT become a heart cell, a neuron, or a liver cell under normal conditions

Plant cells retain totipotency throughout their life:
- A leaf cell can be induced to become a root cell, a stem cell, or a flower cell
- The key is **hormones**: the ratio of auxin to cytokinin determines cell fate
- High auxin → root development
- High cytokinin → shoot development
- Equal ratio → callus (undifferentiated mass)

Why the difference? Plant cells have a more flexible **gene regulation** system. All cells contain the same DNA, but which genes are "switched on" differs. In animal cells, these switches are largely permanent. In plant cells, they can be reset — a phenomenon exploited by tissue culture.

This is why plant cloning is ancient and easy (farmers have done it for millennia) while animal cloning required Dolly and decades of cutting-edge science.`,
      analogy: 'Imagine every cell has a complete instruction manual (DNA) but most pages are sealed shut. In animal cells, once pages are sealed, they stay sealed forever — a skin cell can only read the "skin" chapters. In plant cells, the seals can be broken — give a leaf cell the right signal (hormones), and it can read any chapter, becoming any type of cell. The manual is the same; the accessibility is different.',
      storyConnection: 'When monks planted the Bodhi Tree cutting in Sri Lankan soil, the cells at the cut end had to transform. Stem cells had to become root cells. This was only possible because plant cells are totipotent — they could "read new chapters" in their DNA to grow roots where there were none. If plant cells were like animal cells, cuttings would never root, and the Bodhi Tree lineage would have ended in 288 BCE.',
      checkQuestion: 'In 2006, Shinya Yamanaka discovered that adult animal cells CAN be reprogrammed to a totipotent-like state (induced pluripotent stem cells, iPSCs). What does this tell us about the DNA in specialised animal cells?',
      checkAnswer: 'It confirms that specialised animal cells still contain the COMPLETE genome — the DNA for every cell type is present, just silenced. Yamanaka showed that by activating just 4 genes ("Yamanaka factors"), you can reset the switches and make a skin cell behave like an embryonic stem cell. The DNA was always there; the regulation was the barrier. This is fundamentally similar to what plant hormones do naturally — reset gene regulation to allow new cell fates.',
      codeIntro: 'Model how auxin/cytokinin ratios control cell fate in tissue culture.',
      code: `import numpy as np

np.random.seed(42)

# Tissue culture simulation: hormone ratios determine cell fate
# Based on Skoog & Miller (1957) experiments

def cell_fate(auxin, cytokinin):
    """Determine cell fate based on hormone ratio."""
    ratio = auxin / max(cytokinin, 0.01)
    if ratio > 5:
        return 'ROOT'
    elif ratio < 0.2:
        return 'SHOOT'
    elif 0.5 <= ratio <= 2:
        return 'CALLUS'
    elif ratio > 2:
        return 'root-like callus'
    else:
        return 'shoot-like callus'

# Experiment: vary hormone concentrations
auxin_levels = [0.01, 0.1, 0.5, 1.0, 2.0, 5.0, 10.0]
cytokinin_levels = [0.01, 0.1, 0.5, 1.0, 2.0, 5.0, 10.0]

print("Tissue Culture: Hormone Control of Cell Fate")
print("=" * 55)
print(f"{'Auxin (mg/L)':>12} | {'Cytokinin (mg/L)':>16} | {'Ratio':>6} | Fate")
print("-" * 55)

for aux in [0.1, 1.0, 5.0, 10.0]:
    for cyt in [0.1, 1.0, 5.0, 10.0]:
        ratio = aux / cyt
        fate = cell_fate(aux, cyt)
        print(f"{aux:>12.1f} | {cyt:>16.1f} | {ratio:>6.1f} | {fate}")
    print("-" * 55)

print()
print("Key insight: the RATIO matters, not absolute amounts")
print("  High auxin:cytokinin → ROOTS")
print("  Low auxin:cytokinin  → SHOOTS")
print("  Equal                → CALLUS (undifferentiated)")
print()
print("One explant + different hormone ratios = roots OR shoots")
print("That is totipotency in action.")`,
      challenge: 'Model a tissue culture timeline: start with a callus (equal hormones), then shift to high cytokinin (shoots form), then shift to high auxin (roots form). Track the number of each cell type over 30 days.',
      successHint: 'Totipotency is why plant biotechnology is so powerful. From one tiny tissue sample, you can grow thousands of complete plants — each a perfect clone. This is the molecular basis of the Bodhi Tree lineage: plant cells can always start over.',
    },
    {
      title: 'Clonal crops — the world runs on clones',
      concept: `Most people do not realise that many of the foods they eat every day are clones — genetically identical plants propagated without seeds:

**Banana** (Cavendish): Every banana in your supermarket is a clone. Cavendish bananas are sterile — they produce no viable seeds. They are propagated by cutting off "suckers" (shoots from the base) and replanting them. The entire global Cavendish crop is one genetic individual.

**Potato**: Farmers plant pieces of potato (seed potatoes), not true seeds. Each piece grows into a plant genetically identical to the parent. The vast majority of potatoes are clones.

**Apple**: Every named variety (Fuji, Granny Smith, Gala, Honeycrisp) is a clone, propagated by grafting. If you plant a Fuji apple seed, the tree will NOT produce Fuji apples.

**Grape**: Wine grapes (Chardonnay, Cabernet Sauvignon, Merlot) are all clones, propagated by cuttings for centuries. The Pinot Noir vine you drink today is genetically identical to medieval French vines.

**Sugarcane**: Propagated by planting stem cuttings. The world's sugar supply depends on clones.

The danger: **genetic uniformity**. In the 1950s, the Gros Michel banana (the previous world standard) was wiped out by Panama disease. Today, the same fungus (TR4 strain) threatens Cavendish. No genetic variation means no natural resistance.

Ireland's Great Famine (1845-52) killed 1 million people because the entire potato crop was a single clone vulnerable to potato blight.`,
      analogy: 'Growing clonal crops is like making a million copies of one key. As long as nobody picks the lock, a million identical keys are incredibly efficient. But the moment someone cracks the lock (a new disease), every single key fails at once. Seeds are like having a million different locks — harder to manage, but a single thief cannot open them all.',
      storyConnection: 'The Bodhi Tree lineage is protected by devoted monks, but the world\'s clonal crops have no such guardians. The Cavendish banana faces the same vulnerability as the Gros Michel before it — total genetic uniformity. The Bodhi Tree story teaches us that cloning preserves what we value, but it also teaches the danger of putting all our genetic eggs in one basket.',
      checkQuestion: 'A plant breeder discovers a wild banana species with natural resistance to Panama disease TR4. How could she use this to save the Cavendish banana?',
      checkAnswer: 'Two approaches: (1) GRAFTING: graft Cavendish shoots onto the wild species\' rootstock (if the root provides disease resistance). (2) CRISPR: identify the resistance gene in the wild species and insert it into Cavendish DNA, creating a disease-resistant Cavendish that is otherwise identical. Both approaches use cloning techniques described in this lesson. A third option — breeding Cavendish with the wild species — would produce a new variety that might not taste like Cavendish at all.',
      codeIntro: 'Model the vulnerability of clonal vs diverse populations to disease outbreaks.',
      code: `import numpy as np

np.random.seed(42)

# Compare clonal (uniform) vs diverse (seed-grown) crop populations
n_plants = 1000
n_years = 20

# Disease: each year, there's a chance of a new pathogen
# Each plant has a "resistance profile" (list of resistances)

# CLONAL population: all identical
clone_resistance = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 1])  # 10 possible diseases

# DIVERSE population: each plant has random resistance
diverse_resistance = np.random.binomial(1, 0.6, (n_plants, 10))

clone_alive = np.ones(n_plants, dtype=bool)
diverse_alive = np.ones(n_plants, dtype=bool)

print("Disease Outbreak Simulation: Clonal vs Diverse Crops")
print("=" * 55)
print(f"Population size: {n_plants} plants each")
print(f"Clone resistance: {clone_resistance}")
print()

for year in range(n_years):
    # New disease targets a random resistance slot
    disease = np.random.randint(0, 10)
    severity = np.random.uniform(0.3, 0.9)

    # Clone: if vulnerable, ALL plants affected equally
    if clone_resistance[disease] == 0:
        kill_prob = severity
        kills = np.random.random(n_plants) < kill_prob
        clone_alive &= ~kills

    # Diverse: only plants without resistance are affected
    for i in range(n_plants):
        if diverse_alive[i] and diverse_resistance[i, disease] == 0:
            if np.random.random() < severity:
                diverse_alive[i] = False

    if year % 5 == 4 or clone_alive.sum() < 100:
        print(f"Year {year+1}: Clone survivors: {clone_alive.sum():,} | "
              f"Diverse survivors: {diverse_alive.sum():,}")

print()
print(f"Final: Clones alive: {clone_alive.sum()} ({clone_alive.sum()/10:.1f}%)")
print(f"Final: Diverse alive: {diverse_alive.sum()} ({diverse_alive.sum()/10:.1f}%)")
print()
print("Genetic diversity is insurance against the unknown.")
print("Cloning is efficient but fragile. Nature hedges its bets.")`,
      challenge: 'Add a "conservation strategy": maintain a seed bank with diverse genetics alongside the clonal crop. When the clonal crop falls below 50%, reseed from the diverse bank. How does this hybrid strategy perform?',
      successHint: 'The world\'s food supply depends heavily on clonal crops, and that dependence is a ticking time bomb. Understanding why — and how genetic diversity provides insurance — is one of the most important lessons in biology.',
    },
    {
      title: 'The Bodhi Tree lineage — mapping 2,300 years of cloning',
      concept: `The Bodhi Tree lineage is one of the best-documented examples of clonal propagation in human history:

**~528 BCE**: Siddhartha Gautama attains enlightenment under a Ficus religiosa in Bodh Gaya, India.

**~288 BCE**: Emperor Ashoka's daughter Sanghamitta carries a cutting to Anuradhapura, Sri Lanka. It is planted and becomes the **Sri Maha Bodhi**.

**~185 BCE**: King Pushyamitra Shunga destroys the original Bodhi Tree in Bodh Gaya.

**~AD 600**: The Bodh Gaya tree is replanted — likely from a cutting sent back from Sri Lanka.

**AD 1876**: Sir Alexander Cunningham documents the Bodh Gaya tree and confirms the Sri Lankan connection.

**Today**: Cuttings from the Sri Maha Bodhi have been planted at Buddhist temples across the world — Thailand, Myanmar, Japan, California, Australia.

Each of these trees is a **clone** of the original. They form a **clonal network** — genetically identical individuals spread across continents, connected by 2,300 years of careful human stewardship.

In biology, we can verify this with **genetic fingerprinting**: compare DNA markers (microsatellites) between trees. If they are clones, the markers will be identical. This has been done for other ancient clones (olive trees, grape vines) and could confirm the Bodhi Tree lineage.`,
      analogy: 'The Bodhi Tree lineage is like a family that passes down an original manuscript. The manuscript is never rewritten — it is copied by hand, character by character, generation after generation. After 2,300 years and dozens of copies, the text is still essentially the same. Genetic fingerprinting is like comparing two copies word by word to confirm they came from the same original.',
      storyConnection: 'The story is the science. The monks who carried cuttings across oceans were performing one of the longest-running biological experiments in history — demonstrating that clonal propagation can preserve a genome across millennia. Every Bodhi Tree in every temple in the world is living proof.',
      checkQuestion: 'How would a geneticist PROVE that the Sri Maha Bodhi in Sri Lanka is a clone of the original Bodhi Tree in Bodh Gaya, rather than a seedling?',
      checkAnswer: 'Extract DNA from both trees and compare microsatellite markers (short, repeated DNA sequences that are highly variable between individuals but identical in clones). If the two trees are clones, their microsatellite profiles will match exactly. If one grew from a seed of the other, the profiles would be similar but different (about 50% match, due to sexual reproduction). Additionally, compare chloroplast DNA and mitochondrial DNA, which are maternally inherited and should be identical in clones.',
      codeIntro: 'Model the Bodhi Tree lineage as a clonal network and simulate genetic drift over 2,300 years.',
      code: `import numpy as np

np.random.seed(42)

# Model the Bodhi Tree clonal lineage
# Track somatic mutations accumulated over time

genome_size = 530_000_000  # base pairs
mutation_rate = 5e-10  # per base per cell division
divisions_per_year = 50

class BodhiTreeClone:
    def __init__(self, name, year_planted, parent_mutations=0):
        self.name = name
        self.year_planted = year_planted
        self.mutations = parent_mutations  # inherited from parent cutting

    def accumulate_mutations(self, current_year):
        years = current_year - self.year_planted
        new_mutations = int(years * divisions_per_year * genome_size * mutation_rate)
        return self.mutations + new_mutations

# Historical Bodhi Tree lineage
trees = [
    BodhiTreeClone("Original (Bodh Gaya)", -528),
    BodhiTreeClone("Sri Maha Bodhi (Sri Lanka)", -288),
    BodhiTreeClone("Bodh Gaya replanting", 600),
    BodhiTreeClone("Thai temple cutting", 1200),
    BodhiTreeClone("Modern Bodh Gaya", 1880),
    BodhiTreeClone("Maui, Hawaii", 1913),
]

current_year = 2026

print("Bodhi Tree Clonal Lineage — Mutation Accumulation")
print("=" * 60)
print(f"Genome size: {genome_size:,} bp")
print(f"Mutation rate: {mutation_rate:.0e} per base per division")
print()

for tree in trees:
    age = current_year - tree.year_planted
    mutations = tree.accumulate_mutations(current_year)
    identity = (1 - mutations / genome_size) * 100

    print(f"{tree.name}")
    print(f"  Planted: {abs(tree.year_planted)} {'BCE' if tree.year_planted < 0 else 'CE'}")
    print(f"  Age: {age:,} years")
    print(f"  Accumulated mutations: ~{mutations:,}")
    print(f"  Genome identity to original: {identity:.4f}%")
    print()

# Compare two trees
sri_lanka_mut = trees[1].accumulate_mutations(current_year)
modern_bodh = trees[4].accumulate_mutations(current_year)

print("Comparing Sri Maha Bodhi vs Modern Bodh Gaya:")
print(f"  Shared genome: >99.99%")
print(f"  Distinguishable by microsatellite analysis: likely YES")
print(f"  But fundamentally the same organism: YES")
print()
print("2,300 years of cloning, and the tree endures.")`,
      challenge: 'Add "environmental mutations" — UV exposure, chemical mutagens — that increase the mutation rate by 10x. How does this affect the identity of the oldest clone? At what mutation rate does the clone diverge enough to be considered a "different" organism?',
      successHint: 'The Bodhi Tree lineage is a living experiment in genome stability over deep time. It demonstrates that clonal propagation, combined with the extraordinary accuracy of DNA replication, can preserve a genome across millennia — a fact with profound implications for conservation, agriculture, and our understanding of life itself.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sprout className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Plant reproduction, DNA, and the basics of cloning</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biology simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sprout className="w-5 h-5" />Load Python</>)}
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
            diagram={diagrams[i] ? createElement(diagrams[i]!) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
