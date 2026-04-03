import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function RedPandaLevel1() {
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
      title: 'What is evolution? — change over deep time',
      concept: `The red panda's striking face mask didn't appear overnight. It took millions of years of gradual change — **evolution**. Evolution is the process by which populations of living organisms change over generations through variations in heritable traits.

**Key ideas:**
- Evolution acts on **populations**, not individuals. A single red panda doesn't evolve — the red panda population does.
- Changes happen through **mutations** (random changes in DNA) and **selection** (which mutations spread).
- Evolution is NOT goal-directed. The red panda didn't "decide" to have a mask. Random mutations that helped survival got passed on; those that didn't were lost.
- Evolution is **slow**. Most visible changes take thousands to millions of generations.

**Evidence for evolution:**
- Fossil record (we can see gradual changes in ancient bones)
- DNA comparison (similar species have similar DNA)
- Vestigial structures (whales have hip bones from when their ancestors walked)
- Direct observation (bacteria evolve antibiotic resistance in days)`,
      analogy: 'Evolution is like autocorrect that learns. Each generation of typing introduces small random "typos" (mutations). Some typos make the message clearer (helpful mutations) — these get kept. Some make it worse (harmful mutations) — these get deleted. Over millions of messages, the autocorrect becomes perfectly tuned to the user. No one planned it; it just happened through trial and error.',
      storyConnection: 'In the story, the red panda received its mask as a gift from the forest spirits. In reality, the "gift" came from millions of years of evolution in the misty forests of the eastern Himalayas and northeast India. The mask helps break up the outline of the face among dappled light and red-brown tree bark — a survival advantage that accumulated gene by gene.',
      checkQuestion: 'If evolution is random, how does it produce complex structures like eyes or the red panda\'s prehensile tail?',
      checkAnswer: 'Evolution is random in its raw material (mutations), but NON-random in selection. A mutation that slightly improves vision gets preserved. Over millions of generations, slight improvements accumulate into complex eyes. It is like shuffling a deck randomly but keeping every card that lands face-up. After enough shuffles, all cards face up — not by plan, but by selective retention.',
      codeIntro: 'Simulate evolution through random mutation and natural selection.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate evolution of a trait (e.g., fur darkness, 0=light, 100=dark)
# Environment favors darker fur (better camouflage in forest)
optimal = 80  # ideal darkness for forest camouflage
generations = 200
pop_size = 100

# Start with light-furred population
population = np.random.normal(30, 10, pop_size)  # mean=30, std=10

mean_trait = []
std_trait = []

for gen in range(generations):
    mean_trait.append(np.mean(population))
    std_trait.append(np.std(population))

    # Fitness: closer to optimal = higher survival chance
    fitness = np.exp(-0.005 * (population - optimal)**2)
    fitness /= fitness.sum()

    # Selection: choose parents based on fitness
    parents = np.random.choice(pop_size, size=pop_size, p=fitness)
    population = population[parents]

    # Mutation: small random changes
    population += np.random.normal(0, 2, pop_size)
    population = np.clip(population, 0, 100)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
fig.patch.set_facecolor('#1f2937')

# Trait over generations
ax1.set_facecolor('#111827')
gens = np.arange(generations)
mean_arr = np.array(mean_trait)
std_arr = np.array(std_trait)
ax1.plot(gens, mean_arr, color='#22c55e', linewidth=2, label='Population mean')
ax1.fill_between(gens, mean_arr - std_arr, mean_arr + std_arr, alpha=0.2, color='#22c55e')
ax1.axhline(optimal, color='#f59e0b', linestyle='--', label=f'Optimal ({optimal})')
ax1.set_xlabel('Generation', color='white')
ax1.set_ylabel('Fur darkness (0-100)', color='white')
ax1.set_title('Evolution of Fur Color Over 200 Generations', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Histogram at start vs end
ax2.set_facecolor('#111827')
start_pop = np.random.normal(30, 10, pop_size)
ax2.hist(start_pop, bins=20, alpha=0.6, color='#3b82f6', label='Generation 0', density=True)
ax2.hist(population, bins=20, alpha=0.6, color='#22c55e', label=f'Generation {generations}', density=True)
ax2.axvline(optimal, color='#f59e0b', linestyle='--', linewidth=2, label=f'Optimal ({optimal})')
ax2.set_xlabel('Fur darkness', color='white')
ax2.set_ylabel('Frequency', color='white')
ax2.set_title('Population Distribution: Before and After', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Starting mean: 30 (light fur)")
print(f"After {generations} generations: {np.mean(population):.1f} (near optimal {optimal})")
print(f"The population evolved toward the optimal WITHOUT any individual choosing to change.")`,
      challenge: 'What happens if the optimal changes mid-simulation (e.g., forest becomes grassland at generation 100, optimal shifts from 80 to 40)? Add this change and watch the population adapt again.',
      successHint: 'This simple simulation captures the core of Darwinian evolution: random variation + non-random selection = directional change. It works for fur color, beak shape, antibiotic resistance, and every other evolved trait.',
    },
    {
      title: 'Natural selection — survival of the fittest (fit for what?)',
      concept: `"Survival of the fittest" is the most misunderstood phrase in biology. **Fitness** doesn't mean strongest or fastest — it means **best suited to the current environment**.

**Natural selection requires three conditions:**
1. **Variation**: individuals differ in traits (fur color, size, speed)
2. **Heritability**: traits are passed from parent to offspring (via DNA)
3. **Differential reproduction**: some traits lead to more offspring

**Types of selection:**
- **Directional**: environment favors one extreme (darker fur in forests)
- **Stabilizing**: environment favors the average (medium birth weight in humans)
- **Disruptive**: environment favors both extremes (large and small beaks on an island with big seeds and tiny seeds, but no medium seeds)

The red panda's "fitness" includes: ability to grip bamboo, tolerate cold, climb trees to escape predators, and blend into forest bark. A red panda in a desert would have near-zero fitness — it's not adapted to that environment.`,
      analogy: 'Natural selection is like a sieve. The environment is the mesh — only individuals with traits that "fit through" (survive and reproduce) pass to the next generation. Different environments have different mesh sizes. A forest sieve keeps dark-furred animals; a snow sieve keeps white-furred ones. The sieve doesn\'t create the variation — mutations do. It only filters.',
      storyConnection: 'The story says the forest painted the red panda\'s mask to mark it as a friend of the trees. In reality, natural selection was the painter. Red pandas with slightly darker, more patterned faces blended better with the red-brown bark of the Himalayan forests, avoided predators more often, lived longer, and had more cubs. Generation after generation, the "mask" deepened.',
      checkQuestion: 'Antibiotic-resistant bacteria evolve in hospitals within weeks. Red pandas took millions of years to evolve their mask. Why the speed difference?',
      checkAnswer: 'Three factors: (1) Generation time — bacteria reproduce every 20 minutes vs. red pandas every 1-2 years. (2) Population size — billions of bacteria vs. thousands of red pandas. More individuals = more mutations to select from. (3) Selection pressure — antibiotics kill 99.9% of bacteria (extreme pressure), while predation is less intense. Speed of evolution = mutation rate x population size x selection pressure.',
      codeIntro: 'Simulate the three types of natural selection.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def simulate_selection(pop, optimal_func, generations=100):
    """Simulate selection with a given fitness function."""
    history = []
    for gen in range(generations):
        history.append(pop.copy())
        fitness = optimal_func(pop)
        fitness = np.maximum(fitness, 0.001)
        fitness /= fitness.sum()
        parents = np.random.choice(len(pop), size=len(pop), p=fitness)
        pop = pop[parents] + np.random.normal(0, 1, len(pop))
    return history

pop_size = 500
initial = np.random.normal(50, 15, pop_size)

# Three selection types
directional = lambda x: np.exp(-0.003 * (x - 80)**2)
stabilizing = lambda x: np.exp(-0.005 * (x - 50)**2)
disruptive = lambda x: np.exp(-0.003 * (x - 25)**2) + np.exp(-0.003 * (x - 75)**2)

fig, axes = plt.subplots(2, 3, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')
titles = ['Directional\\n(favors dark fur)', 'Stabilizing\\n(favors medium)', 'Disruptive\\n(favors extremes)']
funcs = [directional, stabilizing, disruptive]

for i, (title, func) in enumerate(zip(titles, funcs)):
    history = simulate_selection(initial.copy(), func, 100)

    # Top: distribution over time
    axes[0,i].set_facecolor('#111827')
    for gen_idx in [0, 25, 50, 75, 99]:
        alpha = 0.3 + 0.7 * (gen_idx / 99)
        axes[0,i].hist(history[gen_idx], bins=30, alpha=alpha, density=True,
                       label=f'Gen {gen_idx}', range=(0, 100))
    axes[0,i].set_title(title, color='white', fontsize=11)
    axes[0,i].set_xlabel('Trait value', color='white')
    axes[0,i].tick_params(colors='gray')
    if i == 0: axes[0,i].set_ylabel('Frequency', color='white')
    axes[0,i].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)

    # Bottom: mean and std over time
    axes[1,i].set_facecolor('#111827')
    means = [np.mean(h) for h in history]
    stds = [np.std(h) for h in history]
    gens = range(len(history))
    axes[1,i].plot(gens, means, color='#22c55e', linewidth=2, label='Mean')
    axes[1,i].plot(gens, stds, color='#f59e0b', linewidth=2, label='Std dev')
    axes[1,i].set_xlabel('Generation', color='white')
    if i == 0: axes[1,i].set_ylabel('Value', color='white')
    axes[1,i].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
    axes[1,i].tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Three selection patterns:")
print("  Directional: mean shifts toward favored extreme, variation decreases")
print("  Stabilizing: mean stays put, variation decreases (narrow peak)")
print("  Disruptive: mean may stay, but variation INCREASES (two peaks form)")
print()
print("Red panda mask: directional selection toward darker, more patterned faces")`,
      challenge: 'Run the disruptive selection for 500 generations. Does the population split into two distinct groups? This is the beginning of speciation — one species becoming two.',
      successHint: 'These three selection types explain nearly all evolutionary patterns. Directional selection drives adaptation to new environments. Stabilizing selection maintains well-adapted traits. Disruptive selection can split one species into two — the engine of biodiversity.',
    },
    {
      title: 'Camouflage types — nature\'s invisibility cloaks',
      concept: `The red panda's reddish-brown fur blends with moss-covered tree bark. This is **camouflage** — one of evolution's most sophisticated survival tools.

**Types of camouflage:**
1. **Crypsis** (background matching): color matches the environment. Red panda fur = tree bark.
2. **Disruptive coloration**: bold patterns break up body outline. Red panda face mask disrupts the recognizable "face shape" that predators look for.
3. **Countershading**: dark on top, light below. Cancels out shadows, making the animal look flat. (Red panda: dark back, lighter belly.)
4. **Mimicry**: looking like something else entirely. Stick insects look like sticks. Harmless king snakes mimic venomous coral snakes.
5. **Active camouflage**: changing color in real time. Chameleons, octopuses, some flatfish.

**How predators defeat camouflage:**
- Motion detection (freeze when spotted!)
- Ultraviolet vision (some camouflage fails in UV)
- Thermal detection (snakes sense body heat)
- Pattern recognition (experienced predators learn to "see through" common camo)`,
      analogy: 'Camouflage is like hiding in a "Where\'s Waldo?" book. Background matching is Waldo wearing the same shirt as everyone else. Disruptive coloration is tearing Waldo\'s picture in half — you can\'t recognize a partial Waldo. Countershading is Waldo removing his shadow so he doesn\'t pop off the page. Mimicry is someone else dressed AS Waldo.',
      storyConnection: 'The story tells of the red panda receiving its mask from the forest itself. Scientifically, the forest DID create the mask — through natural selection over millions of years. The dappled sunlight filtering through Himalayan rhododendron canopy created the selective pressure: pandas with face patterns that broke up their outline in that specific light survived predators better.',
      checkQuestion: 'Why are baby deer (fawns) spotted but adult deer are not?',
      checkAnswer: 'Fawns lie still in dappled forest floor sunlight while their mother forages. The spots mimic light patches coming through leaves. Adult deer are too large to hide this way — they rely on speed instead. The spots disappear because the camouflage strategy changes with life stage. Different ages, different survival strategies.',
      codeIntro: 'Visualize how different camouflage strategies work against pattern recognition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 3, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Generate forest background
def forest_bg(size=100):
    bg = np.random.normal(0.4, 0.15, (size, size))
    for _ in range(20):
        x, y = np.random.randint(0, size, 2)
        r = np.random.randint(5, 15)
        yy, xx = np.ogrid[-y:size-y, -x:size-x]
        mask = xx**2 + yy**2 < r**2
        bg[mask] += np.random.uniform(-0.2, 0.2)
    return np.clip(bg, 0, 1)

bg = forest_bg()

# 1. No camouflage (bright animal on forest floor)
axes[0,0].set_facecolor('#111827')
scene1 = bg.copy()
scene1[40:60, 40:60] = 0.9  # bright square = visible animal
axes[0,0].imshow(scene1, cmap='YlGn_r', vmin=0, vmax=1)
axes[0,0].set_title('No camouflage\\n(easy to spot)', color='white', fontsize=10)
axes[0,0].axis('off')

# 2. Background matching (crypsis)
axes[0,1].set_facecolor('#111827')
scene2 = bg.copy()
# Animal matches background color
animal_color = np.mean(bg[40:60, 40:60])
scene2[40:60, 40:60] = animal_color + np.random.normal(0, 0.05, (20, 20))
axes[0,1].imshow(scene2, cmap='YlGn_r', vmin=0, vmax=1)
axes[0,1].set_title('Background matching\\n(hard to spot)', color='white', fontsize=10)
axes[0,1].axis('off')

# 3. Disruptive coloration
axes[0,2].set_facecolor('#111827')
scene3 = bg.copy()
animal = np.random.choice([0.2, 0.6, 0.8], size=(20, 20))
scene3[40:60, 40:60] = animal
axes[0,2].imshow(scene3, cmap='YlGn_r', vmin=0, vmax=1)
axes[0,2].set_title('Disruptive coloration\\n(outline broken)', color='white', fontsize=10)
axes[0,2].axis('off')

# 4. Countershading effect
axes[1,0].set_facecolor('#111827')
y_vals = np.linspace(0.7, 0.3, 20).reshape(-1, 1)
shade = np.tile(y_vals, (1, 20))
sunlight = np.linspace(0.3, 0.7, 20).reshape(-1, 1)
sunlight_2d = np.tile(sunlight, (1, 20))
combined = shade + sunlight_2d - 0.5  # countershading + sunlight ≈ uniform
axes[1,0].imshow(np.hstack([shade, sunlight_2d, combined]),
                 cmap='gray', vmin=0, vmax=1)
axes[1,0].set_title('Countershading\\n(fur | light | combined)', color='white', fontsize=10)
axes[1,0].axis('off')

# 5. Survival simulation
axes[1,1].set_facecolor('#111827')
generations = 50
pop = 100
camo_scores = np.random.uniform(0, 1, pop)  # 0=no camo, 1=perfect camo
survival_rates = []
mean_camo = []

for gen in range(generations):
    mean_camo.append(np.mean(camo_scores))
    survival_prob = 0.1 + 0.8 * camo_scores  # better camo = better survival
    survives = np.random.random(pop) < survival_prob
    survivors = camo_scores[survives]
    if len(survivors) < 2:
        break
    offspring = np.random.choice(survivors, pop) + np.random.normal(0, 0.05, pop)
    camo_scores = np.clip(offspring, 0, 1)

axes[1,1].plot(range(len(mean_camo)), mean_camo, color='#22c55e', linewidth=2)
axes[1,1].set_xlabel('Generation', color='white')
axes[1,1].set_ylabel('Mean camo score', color='white')
axes[1,1].set_title('Evolution of camouflage', color='white', fontsize=10)
axes[1,1].tick_params(colors='gray')

# 6. Detection probability vs camo quality
axes[1,2].set_facecolor('#111827')
camo_quality = np.linspace(0, 1, 100)
detection_prob = 1 - camo_quality**0.5  # diminishing returns
axes[1,2].plot(camo_quality, detection_prob * 100, color='#ef4444', linewidth=2)
axes[1,2].fill_between(camo_quality, detection_prob * 100, alpha=0.1, color='#ef4444')
axes[1,2].set_xlabel('Camouflage quality', color='white')
axes[1,2].set_ylabel('Detection probability (%)', color='white')
axes[1,2].set_title('Better camo = harder to detect', color='white', fontsize=10)
axes[1,2].tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Camouflage types used by the red panda:")
print("  1. Crypsis: reddish-brown fur matches tree bark")
print("  2. Disruptive: face mask breaks up recognizable face shape")
print("  3. Countershading: dark back, lighter belly")
print("All three working together make it nearly invisible in its habitat.")`,
      challenge: 'In the survival simulation, add a "predator learning" factor — detection probability improves each generation by 0.5%. Does camouflage still evolve to high levels, or does it plateau?',
      successHint: 'Camouflage is an evolutionary arms race: prey get better at hiding, predators get better at finding. This co-evolution drives both sides toward ever more sophisticated strategies. Military camouflage research directly borrows from animal camouflage biology.',
    },
    {
      title: 'Genetics of color — how DNA paints fur',
      concept: `The red panda's distinctive coloring — reddish-brown body, white face, dark eye patches — is encoded in its DNA. But how does DNA create color?

**The pigment pathway:**
1. Genes encode enzymes (protein machines)
2. Enzymes build pigment molecules
3. Pigments absorb certain wavelengths of light
4. What's NOT absorbed is what you see

**Two main mammalian pigments:**
- **Eumelanin**: brown/black
- **Pheomelanin**: red/yellow

The ratio of these two pigments creates the entire spectrum of mammalian fur colors. Red pandas have high pheomelanin (red/yellow) on the body and high eumelanin (dark) on the legs and eye patches.

**Key gene: MC1R (melanocortin 1 receptor)**
- Active MC1R → eumelanin (dark)
- Inactive MC1R → pheomelanin (red/yellow)
- In red pandas, MC1R activity varies across the body, creating the pattern

**Coat patterns** are controlled by additional genes (Agouti, Tabby) that turn pigment production on and off in different body regions during development.`,
      analogy: 'DNA coloring is like a paint-by-numbers kit. The MC1R gene is the instruction that says "dark or light." The Agouti gene says "where." During development, each patch of skin reads its local instructions and produces the appropriate pigment. The red panda\'s body says "red here, dark there, white here" — all from the same DNA, just different local readings.',
      storyConnection: 'The story says the red panda got its mask when it rubbed its paws over its tear-stained face. In molecular terms, the "mask" comes from high MC1R expression around the eyes (producing dark eumelanin) and suppressed MC1R on the cheeks (producing white/light fur). The "tears" are really a genetic switch flipped during embryonic development.',
      checkQuestion: 'Black panthers and regular leopards are the same species. How can the same species have such different colors?',
      checkAnswer: 'A single mutation in the MC1R or Agouti gene causes melanism — overproduction of eumelanin. Black panthers have a recessive allele that produces dark fur everywhere instead of the spotted pattern. Under bright light, you can still faintly see the spots! Same genes, different allele — like the same light switch flipped to a different position.',
      codeIntro: 'Model how pigment gene expression creates coat patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, axes = plt.subplots(2, 3, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

# Simulate a simplified 2D "animal skin" with gene expression
size = 100

def make_pattern(mc1r_map, agouti_map):
    """Combine MC1R and Agouti to get fur color.
    MC1R high = eumelanin (dark), low = pheomelanin (red)
    Agouti high = suppresses MC1R (lighter)
    """
    effective_mc1r = mc1r_map * (1 - 0.7 * agouti_map)
    # RGB: high MC1R = brown/black, low = reddish-orange
    r = 0.8 - 0.5 * effective_mc1r
    g = 0.4 - 0.3 * effective_mc1r
    b = 0.1
    return np.stack([r, g, b], axis=-1).clip(0, 1)

# 1. Uniform expression (solid color)
mc1r = np.ones((size, size)) * 0.3
agouti = np.zeros((size, size))
axes[0,0].imshow(make_pattern(mc1r, agouti))
axes[0,0].set_title('Uniform MC1R\\n(solid red-brown)', color='white', fontsize=10)
axes[0,0].axis('off')

# 2. Spotted pattern (like a leopard)
mc1r = np.ones((size, size)) * 0.3
for _ in range(30):
    x, y = np.random.randint(10, 90, 2)
    r = np.random.randint(3, 8)
    yy, xx = np.ogrid[-y:size-y, -x:size-x]
    mask = xx**2 + yy**2 < r**2
    mc1r[mask] = 0.9
axes[0,1].imshow(make_pattern(mc1r, np.zeros((size, size))))
axes[0,1].set_title('Spotted pattern\\n(local MC1R activation)', color='white', fontsize=10)
axes[0,1].axis('off')

# 3. Red panda-like pattern (masked face)
mc1r = np.ones((size, size)) * 0.2  # mostly red
agouti = np.zeros((size, size))
# Dark patches: eyes/ears (top region)
mc1r[10:25, 20:40] = 0.95  # left eye patch
mc1r[10:25, 60:80] = 0.95  # right eye patch
mc1r[0:10, :] = 0.8  # ears/top
# White patches: cheeks
agouti[25:45, 30:70] = 0.9  # white face center
# Dark legs (bottom)
mc1r[75:100, :] = 0.9
axes[0,2].imshow(make_pattern(mc1r, agouti))
axes[0,2].set_title('Red panda-like\\n(regional expression)', color='white', fontsize=10)
axes[0,2].axis('off')

# 4. MC1R mutation effects
axes[1,0].set_facecolor('#111827')
mc1r_levels = np.linspace(0, 1, 100)
eumelanin = mc1r_levels ** 2
pheomelanin = (1 - mc1r_levels) ** 1.5
axes[1,0].plot(mc1r_levels, eumelanin, color='#6b4423', linewidth=2, label='Eumelanin (dark)')
axes[1,0].plot(mc1r_levels, pheomelanin, color='#f59e0b', linewidth=2, label='Pheomelanin (red)')
axes[1,0].set_xlabel('MC1R activity', color='white')
axes[1,0].set_ylabel('Pigment amount', color='white')
axes[1,0].set_title('MC1R Controls Pigment Type', color='white', fontsize=10)
axes[1,0].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
axes[1,0].tick_params(colors='gray')

# 5. Color variation in a population
axes[1,1].set_facecolor('#111827')
pop_mc1r = np.random.beta(2, 5, 500)  # most have low MC1R (reddish)
pop_colors = [(0.8-0.5*m, 0.4-0.3*m, 0.1) for m in pop_mc1r]
axes[1,1].hist(pop_mc1r, bins=30, color='#ef4444', alpha=0.7, edgecolor='none')
axes[1,1].set_xlabel('MC1R expression level', color='white')
axes[1,1].set_ylabel('Number of individuals', color='white')
axes[1,1].set_title('MC1R Variation in Red Panda Pop.', color='white', fontsize=10)
axes[1,1].tick_params(colors='gray')

# 6. Inheritance pattern
axes[1,2].set_facecolor('#111827')
# Simulate offspring color from two parents
parent1_mc1r = 0.3  # reddish
parent2_mc1r = 0.7  # darker
offspring = np.random.normal((parent1_mc1r + parent2_mc1r)/2, 0.1, 100)
offspring = np.clip(offspring, 0, 1)
axes[1,2].hist(offspring, bins=20, color='#22c55e', alpha=0.7, edgecolor='none')
axes[1,2].axvline(parent1_mc1r, color='#ef4444', linestyle='--', label=f'Parent 1: {parent1_mc1r}')
axes[1,2].axvline(parent2_mc1r, color='#3b82f6', linestyle='--', label=f'Parent 2: {parent2_mc1r}')
axes[1,2].set_xlabel('Offspring MC1R level', color='white')
axes[1,2].set_ylabel('Count', color='white')
axes[1,2].set_title('Offspring Color Inheritance', color='white', fontsize=10)
axes[1,2].legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
axes[1,2].tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key genes controlling red panda coloration:")
print("  MC1R: switches between eumelanin (dark) and pheomelanin (red)")
print("  Agouti: suppresses MC1R in specific regions (creates white patches)")
print("  Pattern genes: control WHERE each pigment is produced")`,
      challenge: 'Create a "melanic" (all-dark) red panda by setting MC1R to 0.95 everywhere and Agouti to 0. Then create an "albino" by setting both to near-zero. What do these mutations look like?',
      successHint: 'The genetics of color is one of the best-understood areas of evolutionary biology. The same MC1R gene controls color in red pandas, humans, dogs, horses, and chickens. One gene, endless variation — that\'s the power of genetics.',
    },
    {
      title: 'Adaptation timescales — how long does evolution take?',
      concept: `The red panda lineage diverged from its closest relatives about **47 million years ago** — making it one of the most ancient carnivore lineages. But how long do specific adaptations take?

**Speed of evolution depends on:**
- **Generation time**: bacteria (20 min) vs. red pandas (~2 years) vs. elephants (~25 years)
- **Population size**: more individuals = more mutations = faster adaptation
- **Selection pressure**: stronger pressure = faster change
- **Mutation rate**: varies between species and genes

**Timescales for different adaptations:**
- Antibiotic resistance in bacteria: days to weeks
- Pesticide resistance in insects: 1-10 years (20-200 generations)
- Color change in rock pocket mice: ~1,000-10,000 years
- New species formation: 10,000-1,000,000+ years
- Major body plan changes: 10-100+ million years

**The red panda's adaptations:**
- Bamboo diet specialization: ~5-10 million years
- False thumb (extended wrist bone for gripping bamboo): ~10-20 million years
- Cold-adapted dense fur: evolved with Himalayan uplift (~15 million years)
- Face mask pattern: unknown, but likely millions of years`,
      analogy: 'Evolutionary timescale is like remodeling a house. Painting a wall (color change) takes a day. Rearranging furniture (behavior change) takes a week. Knocking down a wall (structural change) takes months. Rebuilding the whole foundation (body plan change) takes years. Evolution is the same — surface changes are fast, structural changes are slow.',
      storyConnection: 'The Himalayan forests where the red panda lives have existed for about 20 million years — since the Indian tectonic plate crashed into Asia, pushing up the mountains. The red panda evolved alongside those forests, adapting step by step as the habitat changed. The "gift from the forest" in the story took 20 million years to unwrap.',
      checkQuestion: 'Climate change is happening over decades, but many species take thousands of years to adapt. What happens to slow-adapting species?',
      checkAnswer: 'They have three options: (1) Move — shift their range to follow suitable climate. (2) Adapt through existing genetic variation (fastest route, but limited). (3) Go extinct. Red pandas are especially vulnerable — they are already restricted to a narrow mountain habitat and can\'t move higher (mountains have tops). This is called an "evolutionary trap."',
      codeIntro: 'Visualize evolutionary timescales and the factors that control adaptation speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Timeline of red panda evolution
events = [
    (47, 'Diverged from closest relatives', '#ef4444'),
    (20, 'False thumb evolution begins', '#f59e0b'),
    (15, 'Himalayan uplift intensifies', '#8b5cf6'),
    (10, 'Bamboo diet specialization', '#22c55e'),
    (5, 'Modern coat pattern established', '#3b82f6'),
    (2, 'Two subspecies diverge', '#ec4899'),
    (0.01, 'Human-caused habitat loss begins', '#ef4444'),
]

ax1.set_facecolor('#111827')
for i, (mya, event, color) in enumerate(events):
    ax1.barh(i, mya, color=color, alpha=0.7, height=0.6)
    ax1.text(mya + 0.5, i, f'{event} ({mya} Mya)', color='white', va='center', fontsize=9)

ax1.set_xlabel('Million years ago', color='white')
ax1.set_title('Red Panda Evolutionary Timeline', color='white', fontsize=12)
ax1.set_yticks([])
ax1.tick_params(colors='gray')
ax1.invert_yaxis()

# Simulation: adaptation speed vs generation time
ax2.set_facecolor('#111827')

gen_times = {'Bacteria (20min)': 1/72, 'Insect (1mo)': 30, 'Mouse (3mo)': 90,
             'Red panda (2yr)': 730, 'Elephant (25yr)': 9125}

for name, gen_time in gen_times.items():
    # How many generations to go from trait=30 to trait=70?
    trait = 30
    gen_count = 0
    traits = [trait]
    while trait < 70 and gen_count < 10000:
        # Selection moves trait by ~1-2 units per generation
        trait += np.random.normal(0.5, 0.3)
        gen_count += 1
        traits.append(trait)

    years = np.array(range(len(traits))) * gen_time / 365
    ax2.plot(years, traits, linewidth=2, label=f'{name}: {gen_count} gens')

ax2.set_xlabel('Years', color='white')
ax2.set_ylabel('Trait value', color='white')
ax2.set_title('Same Adaptation, Different Generation Times', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
ax2.set_xscale('log')
ax2.axhline(70, color='gray', linestyle=':', alpha=0.3)
ax2.text(0.02, 71, 'Adaptation complete', color='gray', fontsize=8)

plt.tight_layout()
plt.show()

print("Time to adapt (approximate):")
for name, gen_time in gen_times.items():
    years = 80 * gen_time / 365  # ~80 generations
    if years < 1:
        print(f"  {name}: {years*365:.0f} days")
    elif years < 100:
        print(f"  {name}: {years:.0f} years")
    else:
        print(f"  {name}: {years:.0f} years ({years/1000:.0f}k years)")
print()
print("Climate change: decades. Red panda adaptation: millennia.")
print("The mismatch is why conservation matters NOW.")`,
      challenge: 'Add a "climate change" line to the simulation: the optimal trait shifts by +1 per year. Can the red panda (730-day generation time) keep up? At what point does the population go extinct?',
      successHint: 'Understanding evolutionary timescales is critical for conservation. Species that evolved over millions of years can be lost in decades if their environment changes faster than they can adapt. The red panda\'s 47-million-year lineage is worth protecting.',
    },
    {
      title: 'Endangered species — why the red panda is at risk',
      concept: `Fewer than **10,000 red pandas** remain in the wild. They are classified as **Endangered** on the IUCN Red List. Understanding why requires combining everything we've learned:

**Why red pandas are vulnerable:**
1. **Habitat specialist**: lives only in temperate forests with bamboo understory at 2,200-4,800m elevation
2. **Low reproductive rate**: 1-4 cubs per year, high infant mortality
3. **Narrow diet**: 95% bamboo (which is low in nutrients — they must eat 1.5 kg/day)
4. **Small, fragmented population**: genetic diversity is declining
5. **Slow adaptation**: long generation time means slow evolutionary response

**Threats:**
- **Deforestation**: 50% of suitable habitat lost in last 50 years
- **Climate change**: their narrow elevation band is shifting upward
- **Poaching**: fur trade, pet trade
- **Livestock grazing**: damages bamboo understory
- **Inbreeding**: small, isolated populations lose genetic diversity

**Conservation status categories:**
Least Concern → Near Threatened → Vulnerable → **Endangered** → Critically Endangered → Extinct in the Wild → Extinct`,
      analogy: 'An endangered species is like a company with one product, one factory, and shrinking customers. The red panda\'s "product" is bamboo digestion, its "factory" is the Himalayan forest, and its "customers" (safe habitat) are shrinking. A diversified company (generalist species like rats) can survive market changes. A specialist cannot.',
      storyConnection: 'In northeast India — the red panda\'s easternmost range — deforestation for shifting cultivation and timber has fragmented their habitat into islands. The "forest that gave the mask" is being cut down. Conservation programs in Arunachal Pradesh, Sikkim, and West Bengal are fighting to reconnect these fragments before the populations become too isolated to survive.',
      checkQuestion: 'There are millions of chickens and cows but fewer than 10,000 red pandas. Why don\'t we just breed red pandas in captivity?',
      checkAnswer: 'Captive breeding preserves individuals but not the ecosystem. Red pandas need bamboo forests, which support thousands of other species. Also, captive populations lose adaptation to wild conditions within a few generations (relaxed selection). The goal is to protect habitat so wild populations can sustain themselves — captive breeding is a last resort, not a solution.',
      codeIntro: 'Model population decline and the factors threatening red panda survival.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Population viability analysis (simplified)
years = 100
simulations = 50

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Scenario 1: No conservation intervention
ax1.set_facecolor('#111827')
for sim in range(simulations):
    pop = 10000
    pops = [pop]
    for year in range(years):
        # Annual growth rate with habitat loss
        habitat_loss = 0.02  # 2% per year
        birth_rate = 0.15
        death_rate = 0.12 + habitat_loss * (year / years)
        growth = birth_rate - death_rate
        # Stochastic variation
        growth += np.random.normal(0, 0.03)
        pop = max(0, pop * (1 + growth))
        # Allee effect: very small populations decline faster
        if pop < 500:
            pop *= 0.95
        pops.append(pop)
    color = '#ef4444' if pops[-1] < 1000 else '#f59e0b'
    ax1.plot(range(years+1), pops, color=color, alpha=0.15, linewidth=1)

# Average trajectory
avg_no_conservation = []
for y in range(years+1):
    vals = []
    for sim in range(simulations):
        pop = 10000
        for yr in range(y):
            growth = 0.15 - (0.12 + 0.02 * (yr/years)) + np.random.normal(0, 0.01)
            pop = max(0, pop * (1 + growth))
            if pop < 500: pop *= 0.95
        vals.append(pop)
    avg_no_conservation.append(np.mean(vals))

ax1.plot(range(years+1), avg_no_conservation, color='#ef4444', linewidth=3, label='Average')
ax1.axhline(1000, color='#f59e0b', linestyle='--', label='Critical threshold')
ax1.set_xlabel('Years from now', color='white')
ax1.set_ylabel('Population', color='white')
ax1.set_title('No Conservation: Decline Scenarios', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Scenario comparison
ax2.set_facecolor('#111827')
scenarios = {
    'No action': {'habitat_loss': 0.02, 'poaching': 0.01, 'color': '#ef4444'},
    'Reduce poaching': {'habitat_loss': 0.02, 'poaching': 0.002, 'color': '#f59e0b'},
    'Protect habitat': {'habitat_loss': 0.005, 'poaching': 0.01, 'color': '#3b82f6'},
    'Full conservation': {'habitat_loss': 0.005, 'poaching': 0.002, 'color': '#22c55e'},
}

for name, params in scenarios.items():
    pops = []
    for sim in range(20):
        pop = 10000
        traj = [pop]
        for year in range(years):
            growth = 0.15 - 0.10 - params['habitat_loss'] - params['poaching']
            growth += np.random.normal(0, 0.02)
            pop = max(0, pop * (1 + growth))
            if pop < 500: pop *= 0.95
            traj.append(pop)
        pops.append(traj)
    mean_traj = np.mean(pops, axis=0)
    ax2.plot(range(years+1), mean_traj, color=params['color'], linewidth=2, label=name)

ax2.axhline(1000, color='gray', linestyle=':', alpha=0.3)
ax2.set_xlabel('Years from now', color='white')
ax2.set_ylabel('Population', color='white')
ax2.set_title('Conservation Scenarios Compared', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Red panda conservation priorities:")
print("  1. Protect remaining habitat (biggest impact)")
print("  2. Create wildlife corridors between fragments")
print("  3. Reduce poaching through community programs")
print("  4. Maintain genetic diversity (prevent inbreeding)")
print()
print("Without action: population could drop below viable levels in 50 years.")
print("With full conservation: population stabilizes and may slowly recover.")`,
      challenge: 'Add a "climate change" scenario that shifts the optimal elevation band upward by 100m per decade. How does this interact with habitat loss? The combination is often worse than either alone.',
      successHint: 'Population viability analysis is how real conservation biologists make life-or-death decisions about species. The math you just did is the same math used to set policy for red pandas, tigers, and rhinos. From evolution to genetics to population modeling — this is conservation biology in action.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Evolution & Camouflage</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biology simulations. Click to start.</p>
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