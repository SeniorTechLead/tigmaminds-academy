import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MithunLevel1() {
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
      title: 'Wild vs domestic animals — what changed?',
      concept: `The mithun (*Bos frontalis*) of Arunachal Pradesh is one of the world's least-known domesticated animals. It roams the hills semi-wild, yet it's culturally central to the Nishi, Adi, and Apatani peoples. Understanding the mithun starts with understanding the difference between wild and domestic animals.

**Wild animals** (e.g., gaur, wolf, wild boar):
- Behaviour shaped entirely by natural selection
- Fight-or-flight response is strong and fast
- Reproduce based on natural mate competition
- Body optimized for survival: lean, alert, aggressive

**Domestic animals** (e.g., mithun, dog, pig):
- Behaviour shaped by human selection over generations
- Reduced fear of humans (tameness)
- Reproduce under human-managed conditions
- Body often changed: larger, fatter, different colours, reduced brain size

The mithun is fascinating because it sits between wild and domestic. It descends from the **gaur** (*Bos gaurus*), the world's largest wild cattle. Unlike fully domestic cattle, mithun still roam forests freely, returning to villages for salt — a behaviour that suggests partial domestication, possibly beginning 8,000+ years ago.`,
      analogy: 'Domestication is like customizing a car. The wild version (gaur) is a rugged off-road vehicle — tough, alert, built for survival. The domestic version (mithun) is a modified version — calmer engine (reduced aggression), bigger cargo space (more meat), custom paint (colour varieties), but still using the same chassis (species).',
      storyConnection: 'In "The Brave Mithun of Arunachal," the mithun protected the village — an act that reflects the deep bond between these animals and the hill communities. But this bond didn\'t happen overnight. It took thousands of years of co-evolution, with humans and mithun gradually shaping each other\'s behaviour.',
      checkQuestion: 'Dogs were domesticated from wolves about 15,000 years ago. Modern dogs are smaller-brained, less aggressive, and more socially attentive than wolves. Are these changes genetic or learned?',
      checkAnswer: 'Primarily genetic. Dmitri Belyaev\'s famous fox experiment (1959-present) showed that selecting only for tameness over 40+ generations produced foxes with floppy ears, curly tails, spotted coats, and smaller brains — all without selecting for those traits directly. Tameness genes are genetically linked to developmental pathways that control multiple traits. This is called the "domestication syndrome."',
      codeIntro: 'Compare key traits between wild gaur and domestic mithun.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Trait comparison: Wild Gaur vs Domestic Mithun
traits = ['Body weight\\n(kg)', 'Brain size\\n(% of wild)', 'Aggression\\n(1-10)', 'Fear of\\nhumans (1-10)', 'Colour\\nvariety (1-10)', 'Milk yield\\n(relative)']
gaur = [900, 100, 9, 10, 2, 1]
mithun = [700, 85, 4, 3, 7, 3]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Bar comparison
ax1.set_facecolor('#111827')
x = np.arange(len(traits))
width = 0.35
bars1 = ax1.bar(x - width/2, gaur, width, label='Wild Gaur', color='#ef4444', alpha=0.8)
bars2 = ax1.bar(x + width/2, mithun, width, label='Domestic Mithun', color='#22c55e', alpha=0.8)
ax1.set_xticks(x)
ax1.set_xticklabels(traits, color='gray', fontsize=8)
ax1.set_ylabel('Value', color='white')
ax1.set_title('Wild Gaur vs Domestic Mithun', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Domestication timeline
ax2.set_facecolor('#111827')
animals = ['Dog', 'Sheep', 'Goat', 'Pig', 'Cattle', 'Mithun', 'Horse', 'Chicken', 'Cat']
years_ago = [15000, 11000, 10000, 9000, 8500, 8000, 5500, 5000, 4000]
colors = ['#3b82f6'] * len(animals)
colors[5] = '#22c55e'  # highlight mithun

ax2.barh(range(len(animals)), years_ago, color=colors, alpha=0.8)
ax2.set_yticks(range(len(animals)))
ax2.set_yticklabels(animals, color='white')
ax2.set_xlabel('Years ago', color='white')
ax2.set_title('Domestication Timeline', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.invert_xaxis()

for i, (animal, ya) in enumerate(zip(animals, years_ago)):
    ax2.text(ya - 200, i, f'{ya:,}', va='center', ha='right', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Key differences between gaur and mithun:")
print("  Body weight: gaur is larger (900kg vs 700kg)")
print("  Brain size: mithun brain is ~15% smaller (domestication effect)")
print("  Aggression: dramatically reduced in mithun")
print("  Fear of humans: mithun tolerates human presence")
print("  Colour variety: mithun has many coat colours (relaxed selection)")
print()
print("The mithun was likely domesticated ~8,000 years ago in")
print("Southeast Asia / Northeast India — one of humanity's earliest cattle.")`,
      challenge: 'Research the Belyaev fox experiment. After 40 generations of selecting for tameness alone, the foxes developed floppy ears and spotted coats. Add a third animal ("Belyaev Fox") to the bar chart with your estimated trait values.',
      successHint: 'The wild-to-domestic transition is one of the most consequential events in human history. Every domestic animal tells a story of co-evolution between humans and another species.',
    },
    {
      title: 'How domestication works — the path from wild to tame',
      concept: `Domestication isn't a single event — it's a process that unfolds over hundreds of generations. For the mithun, the likely path was:

**Stage 1: Commensal pathway** (the animal approaches humans)
- Wild gaur were attracted to salt licks near human settlements
- Bolder individuals that tolerated humans got more salt (and survived better)
- Over generations, a subpopulation of less-fearful gaur emerged

**Stage 2: Directed pathway** (humans begin managing the animals)
- Humans controlled access to salt, effectively managing the herd
- Animals that were too aggressive were driven away (or eaten)
- Calmer animals were allowed to stay and reproduce

**Stage 3: Intentional pathway** (humans selectively breed)
- Humans began choosing which animals to breed based on desired traits
- Larger animals for meat, calmer animals for handling, specific colours for rituals
- This is selective breeding — human-directed evolution

The mithun is unusual because it never fully completed Stage 3. It remains **semi-domesticated** — roaming freely in forests but returning to villages. No other large cattle species exists in this intermediate state, making the mithun a living snapshot of the domestication process.`,
      analogy: 'Domestication is like a river gradually carving a canyon. Stage 1 is rain collecting in a stream (animals naturally associating with humans). Stage 2 is the stream deepening (humans guiding the flow). Stage 3 is an engineered canal (humans completely controlling the path). The mithun is at the stream-to-canal transition — partially natural, partially managed.',
      storyConnection: 'The brave mithun in the story came to the village\'s aid — it wasn\'t wild, but it wasn\'t penned either. This perfectly captures the mithun\'s real-world semi-domestic status. It lives between the forest and the village, between wild and tame, between gaur and cow.',
      checkQuestion: 'Cats are often called "self-domesticated." What does this mean, and how is it different from how dogs were domesticated?',
      checkAnswer: 'Dogs were actively domesticated — humans selected wolves for tameness and trainability. Cats domesticated themselves through the commensal pathway: when humans invented grain storage, mice infested the stores, and wildcats moved in to hunt the mice. Humans tolerated (then encouraged) the cats because they were useful. No active breeding for tameness was needed — the cats that tolerated humans simply had better food access. This is why cats remain more independent than dogs.',
      codeIntro: 'Model the domestication process: how tameness changes over generations under different selection pressures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate domestication: population of 100 animals over 200 generations
n_animals = 100
n_generations = 200

# Each animal has a "tameness" score (0 = wild, 100 = fully tame)
# Tameness is heritable (h² = 0.4)

def simulate_domestication(selection_strength):
    """
    selection_strength: 0 (no selection) to 1 (only tamest survive)
    """
    population = np.random.normal(20, 10, n_animals)  # start wild
    population = np.clip(population, 0, 100)
    mean_tameness = [np.mean(population)]

    for gen in range(n_generations):
        # Selection: tamest animals are more likely to reproduce
        fitness = population ** selection_strength
        fitness = fitness / fitness.sum()

        # Select parents (weighted by fitness)
        parents = np.random.choice(n_animals, size=n_animals, p=fitness, replace=True)
        parent_values = population[parents]

        # Offspring: inherit from parent + random variation
        heritability = 0.4
        environmental = np.random.normal(0, 8, n_animals)
        population = parent_values * heritability + np.mean(parent_values) * (1 - heritability) + environmental
        population = np.clip(population, 0, 100)
        mean_tameness.append(np.mean(population))

    return mean_tameness

# Three scenarios
scenarios = {
    'No selection (wild)': {'strength': 0, 'color': '#ef4444'},
    'Weak selection (commensal)': {'strength': 0.3, 'color': '#f59e0b'},
    'Moderate selection (mithun)': {'strength': 0.6, 'color': '#3b82f6'},
    'Strong selection (cattle)': {'strength': 1.0, 'color': '#22c55e'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
for name, props in scenarios.items():
    tameness = simulate_domestication(props['strength'])
    ax1.plot(range(n_generations + 1), tameness, linewidth=2, color=props['color'], label=name)

ax1.set_xlabel('Generations', color='white')
ax1.set_ylabel('Mean tameness score', color='white')
ax1.set_title('Domestication Speed vs Selection Strength', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 100)

# Distribution at generation 200 for each scenario
ax2.set_facecolor('#111827')
for name, props in scenarios.items():
    np.random.seed(42)
    pop = np.random.normal(20, 10, n_animals)
    pop = np.clip(pop, 0, 100)
    for _ in range(200):
        fitness = pop ** props['strength']
        fitness = fitness / fitness.sum()
        parents = np.random.choice(n_animals, size=n_animals, p=fitness, replace=True)
        parent_values = pop[parents]
        pop = parent_values * 0.4 + np.mean(parent_values) * 0.6 + np.random.normal(0, 8, n_animals)
        pop = np.clip(pop, 0, 100)
    ax2.hist(pop, bins=20, alpha=0.5, color=props['color'], label=name, edgecolor='none')

ax2.set_xlabel('Tameness score', color='white')
ax2.set_ylabel('Number of animals', color='white')
ax2.set_title('Population Distribution at Gen 200', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("After 200 generations:")
print("  No selection: tameness stays ~20 (wild)")
print("  Weak (commensal): tameness rises slowly (~40)")
print("  Moderate (mithun): tameness reaches ~60 (semi-domestic)")
print("  Strong (cattle): tameness reaches ~80+ (fully domestic)")
print()
print("200 generations at 5 years/gen = 1,000 years")
print("This matches archaeological timelines for cattle domestication.")`,
      challenge: 'Add a "reverse domestication" scenario where selection favors wildness (least tame survive). This simulates feral animals (domesticated animals going wild). How fast does tameness decline?',
      successHint: 'Domestication is evolution under human-directed selection pressure. The speed depends on selection strength, heritability, and generation time. The mithun\'s semi-domestic state tells us that moderate selection over thousands of years produces a halfway result.',
    },
    {
      title: 'Selective breeding — choosing which traits to keep',
      concept: `Selective breeding is the deliberate choice of which animals (or plants) get to reproduce, based on traits humans value. It's the engine of domestication and the foundation of all agriculture.

The basic process:
1. **Observe variation**: some animals are bigger, some calmer, some produce more milk
2. **Select parents**: breed only the individuals with desired traits
3. **Repeat**: over generations, the desired trait becomes more common and more extreme

Key concepts:
- **Phenotype**: the observable trait (e.g., body weight = 500 kg)
- **Genotype**: the genetic basis of the trait (DNA sequences affecting growth)
- **Heritability (h²)**: how much of the trait variation is genetic vs. environmental
  - h² = 0: trait is entirely environmental (not breedable)
  - h² = 1: trait is entirely genetic (highly breedable)
  - Most traits: h² = 0.2 to 0.6

For mithun, traits under selection include:
- **Size**: larger mithun are more valuable (wealth, sacrifice)
- **Coat colour**: specific colours have ritual significance
- **Temperament**: calmer animals are easier to manage
- **Horn shape**: aesthetic preferences vary by community`,
      analogy: 'Selective breeding is like a talent show that runs every generation. Only the winners (animals with desired traits) get to have offspring. After many rounds, the "talent" (desired trait) becomes the norm rather than the exception. But you can only select for traits that have a genetic basis — you can\'t breed for a trait caused entirely by environment.',
      storyConnection: 'The brave mithun in the story was large, strong, and protective — all traits that would be valued by Arunachal communities. Over generations, communities that kept and bred such animals would accumulate these traits in their herds. The "brave mithun" isn\'t just a character — it\'s a description of what selective breeding produces.',
      checkQuestion: 'A farmer has 10 mithun. The three heaviest weigh 800, 750, and 720 kg. The herd average is 600 kg. If heritability of weight is 0.4, what will the next generation\'s average be?',
      checkAnswer: 'The selected parents\' mean is (800+750+720)/3 = 757 kg. The selection differential is 757 - 600 = 157 kg. The response to selection = h² × selection differential = 0.4 × 157 = 63 kg. Next generation average = 600 + 63 = 663 kg. One generation of selective breeding increased the herd average by 63 kg (10.5%).',
      codeIntro: 'Simulate selective breeding for body weight over 20 generations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Selective breeding simulation: body weight in mithun
n_animals = 50
n_generations = 20
heritability = 0.4

# Initial population: mean 600 kg, std 80 kg
initial_mean = 600
initial_std = 80

# Selection intensity: breed top 30%
selection_top = 0.30

def breed_generation(population, h2, select_top):
    """Select top fraction, breed, return offspring"""
    n = len(population)
    n_selected = max(2, int(n * select_top))

    # Select top performers
    selected_idx = np.argsort(population)[-n_selected:]
    selected = population[selected_idx]
    selected_mean = np.mean(selected)
    pop_mean = np.mean(population)

    # Selection differential
    S = selected_mean - pop_mean

    # Response to selection
    R = h2 * S

    # New generation: shifted mean, maintain genetic variation
    new_mean = pop_mean + R
    genetic_std = np.std(population) * np.sqrt(h2)
    env_std = np.std(population) * np.sqrt(1 - h2)
    offspring = np.random.normal(new_mean, np.sqrt(genetic_std**2 + env_std**2), n)

    return offspring, R, S

# Run simulation
population = np.random.normal(initial_mean, initial_std, n_animals)
means = [np.mean(population)]
stds = [np.std(population)]
responses = []
all_pops = [population.copy()]

for gen in range(n_generations):
    population, R, S = breed_generation(population, heritability, selection_top)
    means.append(np.mean(population))
    stds.append(np.std(population))
    responses.append(R)
    all_pops.append(population.copy())

fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Mean weight over generations
ax = axes[0, 0]
ax.set_facecolor('#111827')
gens = range(n_generations + 1)
ax.plot(gens, means, 'o-', color='#22c55e', linewidth=2, markersize=4)
ax.fill_between(gens, [m-s for m, s in zip(means, stds)], [m+s for m, s in zip(means, stds)],
                alpha=0.2, color='#22c55e')
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Body weight (kg)', color='white')
ax.set_title('Selective Breeding: Mean Body Weight', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Response per generation
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.bar(range(1, n_generations + 1), responses, color='#3b82f6', alpha=0.8)
ax.set_xlabel('Generation', color='white')
ax.set_ylabel('Weight gain (kg)', color='white')
ax.set_title('Response to Selection per Generation', color='white', fontsize=12)
ax.tick_params(colors='gray')

# Population distribution: gen 0 vs gen 10 vs gen 20
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.hist(all_pops[0], bins=15, alpha=0.5, color='#ef4444', label='Gen 0', edgecolor='none')
ax.hist(all_pops[10], bins=15, alpha=0.5, color='#f59e0b', label='Gen 10', edgecolor='none')
ax.hist(all_pops[20], bins=15, alpha=0.5, color='#22c55e', label='Gen 20', edgecolor='none')
ax.set_xlabel('Body weight (kg)', color='white')
ax.set_ylabel('Count', color='white')
ax.set_title('Population Distribution Shift', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Breeder's equation visualization
ax = axes[1, 1]
ax.set_facecolor('#111827')
h2_range = np.linspace(0, 1, 100)
S_values = [50, 100, 150]  # different selection differentials
for S in S_values:
    R = h2_range * S
    ax.plot(h2_range, R, linewidth=2, label=f'S = {S} kg')

ax.axvline(heritability, color='#f59e0b', linestyle='--', label=f'Mithun weight h² = {heritability}')
ax.set_xlabel('Heritability (h²)', color='white')
ax.set_ylabel('Response (kg/gen)', color='white')
ax.set_title("Breeder's Equation: R = h² × S", color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

total_gain = means[-1] - means[0]
print(f"After {n_generations} generations of selecting top {selection_top*100:.0f}%:")
print(f"  Starting mean: {means[0]:.0f} kg")
print(f"  Final mean: {means[-1]:.0f} kg")
print(f"  Total gain: {total_gain:.0f} kg ({total_gain/means[0]*100:.1f}%)")
print(f"  Average gain: {total_gain/n_generations:.1f} kg/generation")
print()
print("At 5 years per mithun generation, 20 generations = 100 years.")`,
      challenge: 'Change selection to the bottom 30% instead of top (selecting smallest animals). What happens? Then try selecting for TWO traits simultaneously (weight AND tameness). Is the response for each trait reduced?',
      successHint: 'The breeder\'s equation (R = h² × S) is one of the most powerful tools in biology. It predicts how fast a trait changes under selection and explains everything from corn yields to dog breeds.',
    },
    {
      title: 'Artificial vs natural selection — same mechanism, different driver',
      concept: `Charles Darwin's key insight was that **artificial selection** (breeding by humans) and **natural selection** (survival in the wild) work by the same mechanism — differential reproduction. The only difference is WHO is doing the selecting.

**Natural selection**:
- Selector: the environment (predators, disease, climate, food availability)
- Goal: survival and reproduction in a specific habitat
- Speed: slow (1 trait change may take thousands of generations)
- Direction: matches organism to its environment
- Result: wolves, gaur, wild rice

**Artificial selection**:
- Selector: humans (farmers, breeders, scientists)
- Goal: traits that humans want (size, yield, tameness, appearance)
- Speed: fast (visible changes in 10-20 generations)
- Direction: matches organism to human needs (often at the cost of survival ability)
- Result: dogs, mithun, cultivated rice

The irony: many traits humans select for would be **harmful** in the wild. Bulldogs can barely breathe. Domestic turkeys can't fly. High-yield crops are defenseless against pests. Mithun are calmer than gaur but would lose a fight with a leopard more easily.

Darwin used artificial selection as evidence for natural selection — if humans can change species in decades, nature can do the same over millions of years.`,
      analogy: 'Natural selection is like a river shaping a rock — it works slowly, follows the path of least resistance, and produces forms perfectly adapted to the water flow. Artificial selection is like a sculptor shaping the rock — faster, with a specific vision, but the result might be beautiful while being structurally weak in ways the river-shaped rock is not.',
      storyConnection: 'The brave mithun fought off a threat to the village — bravery that came from its gaur ancestry (natural selection for survival in predator-rich forests). But its willingness to stay near the village came from artificial selection for tameness. The mithun is a product of both forces, and the story captures both sides.',
      checkQuestion: 'Purebred dog breeds have much higher rates of genetic diseases than mixed breeds. Why does artificial selection increase disease risk?',
      checkAnswer: 'Three reasons: (1) Inbreeding — breeding within a small population increases the chance that both parents carry the same harmful recessive gene. (2) Hitchhiking — selecting for appearance genes may accidentally select for nearby disease genes. (3) Relaxed natural selection — humans keep alive animals that nature would have eliminated (e.g., bulldogs with breathing problems). The result is a "genetic load" of harmful mutations that accumulates under artificial selection.',
      codeIntro: 'Compare the outcomes of natural vs artificial selection on the same trait over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate a population under natural vs artificial selection
n_animals = 200
n_generations = 100

# Trait: body size (affects survival in wild, and desired by humans)
# Natural selection: intermediate size is optimal (stabilizing selection)
# Artificial selection: bigger is always better (directional selection)

def natural_selection(population):
    """Stabilizing: optimal size is 60, too big or small = lower fitness"""
    optimal = 60
    fitness = np.exp(-0.005 * (population - optimal) ** 2)
    fitness = fitness / fitness.sum()
    parents = np.random.choice(len(population), size=len(population), p=fitness, replace=True)
    offspring = population[parents] + np.random.normal(0, 5, len(population))
    return np.clip(offspring, 0, 150)

def artificial_selection(population):
    """Directional: breed the biggest 20%"""
    n_selected = max(4, int(len(population) * 0.2))
    selected = np.argsort(population)[-n_selected:]
    parents = np.random.choice(selected, size=len(population), replace=True)
    offspring = population[parents] + np.random.normal(0, 5, len(population))
    return np.clip(offspring, 0, 150)

# Run both
pop_natural = np.random.normal(50, 15, n_animals)
pop_artificial = pop_natural.copy()

means_nat = [np.mean(pop_natural)]
means_art = [np.mean(pop_artificial)]
stds_nat = [np.std(pop_natural)]
stds_art = [np.std(pop_artificial)]

for gen in range(n_generations):
    pop_natural = natural_selection(pop_natural)
    pop_artificial = artificial_selection(pop_artificial)
    means_nat.append(np.mean(pop_natural))
    means_art.append(np.mean(pop_artificial))
    stds_nat.append(np.std(pop_natural))
    stds_art.append(np.std(pop_artificial))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Mean trait over time
ax1.set_facecolor('#111827')
gens = range(n_generations + 1)
ax1.plot(gens, means_nat, color='#3b82f6', linewidth=2.5, label='Natural (stabilizing)')
ax1.plot(gens, means_art, color='#ef4444', linewidth=2.5, label='Artificial (directional)')
ax1.axhline(60, color='#3b82f6', linestyle=':', alpha=0.5, label='Natural optimum (60)')
ax1.set_xlabel('Generations', color='white')
ax1.set_ylabel('Mean body size', color='white')
ax1.set_title('Natural vs Artificial Selection', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Variance over time
ax2.set_facecolor('#111827')
ax2.plot(gens, stds_nat, color='#3b82f6', linewidth=2.5, label='Natural')
ax2.plot(gens, stds_art, color='#ef4444', linewidth=2.5, label='Artificial')
ax2.set_xlabel('Generations', color='white')
ax2.set_ylabel('Standard deviation (variation)', color='white')
ax2.set_title('Genetic Variation Over Time', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("After 100 generations:")
print(f"  Natural selection: mean={means_nat[-1]:.1f}, std={stds_nat[-1]:.1f}")
print(f"  Artificial selection: mean={means_art[-1]:.1f}, std={stds_art[-1]:.1f}")
print()
print("Natural selection: stabilizes at the optimum, maintains variation")
print("Artificial selection: pushes trait to extreme, REDUCES variation")
print("Reduced variation = reduced adaptability = higher extinction risk")`,
      challenge: 'After 100 generations of artificial selection, switch to natural selection for 50 more generations. How quickly does the population revert toward the natural optimum? This simulates what happens when domestic animals go feral.',
      successHint: 'The comparison between natural and artificial selection is central to understanding domestication. Humans can reshape species faster than nature, but the changes come at a cost — reduced variation, reduced fitness in the wild, and accumulated genetic problems.',
    },
    {
      title: 'Breed diversity — one species, many forms',
      concept: `A single domesticated species can be split into dramatically different **breeds** — each shaped by the specific needs and preferences of different human communities.

Dogs: ~400 breeds, from 2 kg Chihuahuas to 90 kg Great Danes
Cattle: ~1,000 breeds, from tiny Dexter cattle to massive Chianina
Mithun: regional varieties in Arunachal Pradesh, Nagaland, Manipur, and Myanmar

How breeds form:
1. **Geographic isolation**: communities in different valleys/regions breed independently
2. **Different selection criteria**: one community selects for size, another for colour
3. **Genetic drift**: small populations randomly lose some gene variants
4. **Cultural preferences**: ritual significance of certain colours or horn shapes

Mithun breed diversity in Northeast India:
- **Arunachal mithun**: large body, varied colours (black, white, brown, piebald)
- **Nagaland mithun**: medium body, predominantly black
- **Manipur mithun**: smaller, darker, adapted to lower altitudes
- **Myanmar mithun**: distinct facial structure, lighter build

This diversity is valuable because different breeds carry different genetic adaptations — disease resistance, heat tolerance, milk production. Losing a breed means losing those adaptations permanently.`,
      analogy: 'Dog breeds are like car models from the same manufacturer. A sedan, SUV, and sports car all share the same basic engineering (engine, wheels, chassis = dog DNA), but they\'re optimized for different purposes. Mithun breeds are like regional car modifications — the same base model adapted to different terrains and preferences.',
      storyConnection: 'The "brave mithun of Arunachal" is specifically Arunachal\'s variety — large, strong, and valued for its many coat colours. In neighbouring Nagaland, the same species looks different and serves different cultural roles. The story\'s mithun is not generic — it reflects the specific breed of a specific region.',
      checkQuestion: 'There are ~1,000 cattle breeds worldwide, but just 5 breeds produce 90% of all commercial milk and beef. What\'s the risk?',
      checkAnswer: 'Catastrophic vulnerability. If a disease evolved to target Holstein cattle (which produce 80% of commercial milk), the global dairy industry could collapse. The 995 other breeds carry genetic diversity — including potential disease resistance genes — but many are going extinct because they\'re not commercially competitive. We\'re trading diversity for short-term productivity.',
      codeIntro: 'Model how geographic isolation and different selection criteria create breed diversity from one founding population.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate breed formation: 1 population splits into 4 isolated groups
# Each group selects for a different trait
n_per_group = 50
n_generations = 50

# Traits: body_size, coat_darkness, horn_length (0-100 scale)
# Initial population: random
initial_pop = np.random.normal(50, 15, (n_per_group * 4, 3))
initial_pop = np.clip(initial_pop, 0, 100)

# Split into 4 groups (4 isolated valleys)
groups = {
    'Arunachal (select: size)': {'pop': initial_pop[:50].copy(), 'select_trait': 0, 'color': '#22c55e'},
    'Nagaland (select: dark coat)': {'pop': initial_pop[50:100].copy(), 'select_trait': 1, 'color': '#3b82f6'},
    'Manipur (select: small size)': {'pop': initial_pop[100:150].copy(), 'select_trait': 0, 'color': '#f59e0b'},
    'Myanmar (select: long horns)': {'pop': initial_pop[150:200].copy(), 'select_trait': 2, 'color': '#a855f7'},
}

# Selection direction: Arunachal=big, Nagaland=dark, Manipur=small, Myanmar=long horns
select_directions = [1, 1, -1, 1]  # 1 = select high, -1 = select low

history = {name: {'size': [], 'dark': [], 'horn': []} for name in groups}

for gen in range(n_generations):
    for (name, g), direction in zip(groups.items(), select_directions):
        pop = g['pop']
        trait_idx = g['select_trait']

        # Record means
        history[name]['size'].append(np.mean(pop[:, 0]))
        history[name]['dark'].append(np.mean(pop[:, 1]))
        history[name]['horn'].append(np.mean(pop[:, 2]))

        # Selection: top/bottom 40%
        if direction == 1:
            selected = np.argsort(pop[:, trait_idx])[-20:]
        else:
            selected = np.argsort(pop[:, trait_idx])[:20]

        # Breed
        parents = np.random.choice(selected, size=n_per_group, replace=True)
        offspring = pop[parents] + np.random.normal(0, 4, (n_per_group, 3))

        # Genetic drift (random changes to unselected traits)
        offspring[:, :] += np.random.normal(0, 1, (n_per_group, 3))
        offspring = np.clip(offspring, 0, 100)
        g['pop'] = offspring

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

trait_names = ['Body size', 'Coat darkness', 'Horn length']
trait_keys = ['size', 'dark', 'horn']

for ax, trait_name, trait_key in zip(axes, trait_names, trait_keys):
    ax.set_facecolor('#111827')
    for name, g in groups.items():
        ax.plot(range(n_generations), history[name][trait_key],
                linewidth=2, color=g['color'], label=name)
    ax.set_xlabel('Generations', color='white')
    ax.set_ylabel(trait_name, color='white')
    ax.set_title(trait_name, color='white', fontsize=12)
    ax.tick_params(colors='gray')
    ax.set_ylim(0, 100)
    if trait_key == 'size':
        ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)

plt.suptitle('Breed Divergence from One Founding Population', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("After 50 generations of isolated breeding:")
for name, g in groups.items():
    pop = g['pop']
    print(f"  {name}:")
    print(f"    Size: {np.mean(pop[:,0]):.0f}, Darkness: {np.mean(pop[:,1]):.0f}, Horns: {np.mean(pop[:,2]):.0f}")
print()
print("Same species, same starting population,")
print("but different selection = different breeds in 50 generations.")`,
      challenge: 'After 50 generations of isolation, merge two groups back together (simulate gene flow). What happens to the traits over the next 20 generations? This models what happens when different breeds are crossbred.',
      successHint: 'Breed diversity within a species is a library of genetic solutions. Each breed represents a different answer to the question "what should this animal look like?" Losing a breed is like losing a book that can never be rewritten.',
    },
    {
      title: 'Mithun in Arunachal culture — domestication as partnership',
      concept: `In many Arunachal Pradesh communities, the mithun is not merely livestock — it's the cornerstone of social, economic, and spiritual life:

**Economic**: Mithun are the primary measure of wealth. A family's status is determined by the number of mithun they own. Major purchases (land, houses) were traditionally priced in mithun.

**Social**: Bride price is paid in mithun. A typical bride price ranges from 3 to 30 mithun, depending on the family's status. This creates a social economy built entirely around the animal.

**Spiritual**: Mithun are sacrificed at important festivals (Mopin, Solung, Dree). The sacrifice isn't waste — the meat is distributed to the entire community, and the ritual reinforces social bonds and spiritual beliefs.

**Ecological**: Mithun are semi-wild grazers that maintain forest clearings and contribute to nutrient cycling. Their free-ranging behavior makes them more ecologically integrated than penned livestock.

**Genetic**: Communities have deep knowledge of mithun lineages, breeding quality, and individual temperaments — a form of traditional selective breeding that has been practiced for millennia.

This model — free-ranging, culturally embedded, economically central — represents a form of domestication that Western agriculture has largely abandoned. It's **partnership**, not **ownership**.`,
      analogy: 'The mithun-human relationship is like a long marriage. Neither partner controls the other completely. The mithun gets salt, protection from predators, and veterinary care. The humans get meat, wealth, and social currency. Both benefit, and both have shaped each other over millennia. It\'s mutualism, not exploitation.',
      storyConnection: 'The brave mithun protected the village because it WAS part of the village — not as property, but as a partner. The story captures an ecological and cultural reality: in Arunachal, mithun and humans are interdependent. The bravery of the mithun reflects the depth of this bond.',
      checkQuestion: 'Modern industrial farming raises cattle in confined feeding operations, maximizing meat production per animal. The Arunachal model lets mithun roam free. Which system is more sustainable in the long term?',
      checkAnswer: 'The Arunachal model is more sustainable by most measures: lower carbon footprint (no feed transport, no manure processing), higher genetic diversity (natural mate selection), better animal welfare, lower disease risk (no crowding), and ecological integration (mithun maintain forest clearings). The industrial model produces more meat per unit time but at enormous environmental and genetic cost. As climate pressures increase, the semi-wild model may prove more resilient.',
      codeIntro: 'Compare the ecological footprints of semi-wild mithun husbandry vs industrial cattle farming.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Ecological comparison: Mithun (semi-wild) vs Industrial cattle
categories = ['Carbon\\nfootprint', 'Water\\nuse', 'Land\\nuse', 'Biodiversity\\nimpact', 'Animal\\nwelfare', 'Genetic\\ndiversity', 'Disease\\nrisk', 'Cultural\\nvalue']

# Scores: lower is better for first 4, higher is better for last 4
# Normalized 0-100 (higher = better overall sustainability)
mithun_scores = [75, 80, 70, 85, 90, 85, 80, 95]
industrial_scores = [25, 20, 30, 15, 20, 15, 30, 10]
# Organic/pasture-raised as middle ground
pasture_scores = [55, 50, 50, 55, 65, 50, 55, 30]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Bar comparison
ax1.set_facecolor('#111827')
x = np.arange(len(categories))
width = 0.25
ax1.bar(x - width, mithun_scores, width, label='Mithun (semi-wild)', color='#22c55e', alpha=0.8)
ax1.bar(x, pasture_scores, width, label='Pasture-raised cattle', color='#f59e0b', alpha=0.8)
ax1.bar(x + width, industrial_scores, width, label='Industrial cattle', color='#ef4444', alpha=0.8)
ax1.set_xticks(x)
ax1.set_xticklabels(categories, color='gray', fontsize=8)
ax1.set_ylabel('Sustainability score (higher = better)', color='white')
ax1.set_title('Sustainability Comparison', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Radar chart
ax2 = fig.add_subplot(122, polar=True)
ax2.set_facecolor('#111827')

angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
angles += angles[:1]

for name, scores, color in [('Mithun', mithun_scores, '#22c55e'),
                              ('Pasture', pasture_scores, '#f59e0b'),
                              ('Industrial', industrial_scores, '#ef4444')]:
    values = scores + scores[:1]
    ax2.plot(angles, values, 'o-', linewidth=2, color=color, label=name)
    ax2.fill(angles, values, alpha=0.1, color=color)

ax2.set_xticks(angles[:-1])
ax2.set_xticklabels(categories, color='white', fontsize=7)
ax2.set_ylim(0, 100)
ax2.set_yticks([25, 50, 75, 100])
ax2.set_yticklabels(['25', '50', '75', '100'], color='gray', fontsize=7)
ax2.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.set_title('Sustainability Radar', color='white', fontsize=12, pad=20)

plt.tight_layout()
plt.show()

print("Overall sustainability scores:")
print(f"  Mithun (semi-wild): {np.mean(mithun_scores):.0f}/100")
print(f"  Pasture-raised: {np.mean(pasture_scores):.0f}/100")
print(f"  Industrial: {np.mean(industrial_scores):.0f}/100")
print()
print("The mithun model scores highest in every category.")
print("It represents a form of domestication that modern agriculture")
print("might learn from — not as a step backward, but as a template")
print("for sustainable livestock systems.")
print()
print("The mithun of Arunachal isn't just an animal.")
print("It's a 8,000-year experiment in sustainable partnership.")`,
      challenge: 'Add a "production efficiency" metric (meat per year per animal) where industrial scores 95, pasture 50, and mithun 30. Now recalculate the overall scores. Is production efficiency worth the sustainability trade-offs?',
      successHint: 'The mithun\'s story challenges the assumption that more intensive = more advanced. Sometimes the most sophisticated relationship between humans and animals is the one that preserves both their wild nature and their partnership. Level 2 dives into the genetics behind it all.',
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