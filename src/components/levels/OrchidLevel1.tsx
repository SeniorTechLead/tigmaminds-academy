import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function OrchidLevel1() {
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
      title: 'Plant pigments — where flower colour really comes from',
      concept: `In the hills of Arunachal Pradesh, orchids bloom in every colour imaginable — purple, pink, white, golden yellow, even spotted patterns. But where does the colour come from?

Flower colour is produced by **pigments** — molecules that absorb certain wavelengths of light and reflect others. The three main families of plant pigments are:

- **Chlorophyll**: absorbs red and blue light, reflects green. Found in all green parts of the plant. Its job is photosynthesis, not beauty.
- **Carotenoids**: absorb blue-violet light, reflect yellow, orange, and red. These are the same pigments that make carrots orange and tomatoes red.
- **Anthocyanins**: absorb green light, reflect red, purple, and blue. They're water-soluble and sit in the cell's vacuole (not in chloroplasts like the others).

A single petal can contain all three pigment types in different concentrations, creating an enormous palette of possible colours.`,
      analogy: 'Pigments are like colour filters on a stage light. White sunlight hits the petal (the "stage"), and the pigments absorb certain colours and let others bounce back to your eyes. A red flower isn\'t producing red light — it\'s absorbing everything except red.',
      storyConnection: 'The story says the orchid "stole colours from the sunset." In reality, orchids evolved pigments over millions of years. The sunset colours — reds, oranges, purples — come from the same physics: molecules absorbing some wavelengths and letting others through.',
      checkQuestion: 'Why do leaves turn red and orange in autumn?',
      checkAnswer: 'During the growing season, green chlorophyll masks the other pigments. In autumn, chlorophyll breaks down (the tree reclaims the nitrogen). Without chlorophyll, the carotenoids (yellow/orange) and anthocyanins (red/purple) that were there all along become visible. The leaf doesn\'t gain new colours — it loses the green.',
      codeIntro: 'Visualize how different pigments absorb different wavelengths of light.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelength = np.linspace(380, 750, 500)  # visible light range (nm)

# Absorption spectra (simplified Gaussian models)
def gaussian(x, mu, sigma, amp):
    return amp * np.exp(-0.5 * ((x - mu) / sigma) ** 2)

# Chlorophyll: absorbs red (~680nm) and blue (~430nm)
chlorophyll = gaussian(wavelength, 430, 20, 0.9) + gaussian(wavelength, 680, 25, 0.7)

# Carotenoids: absorb blue-violet (~450nm)
carotenoid = gaussian(wavelength, 450, 30, 0.85) + gaussian(wavelength, 480, 25, 0.5)

# Anthocyanins: absorb green (~530nm)
anthocyanin = gaussian(wavelength, 530, 40, 0.8) + gaussian(wavelength, 560, 30, 0.4)

fig, axes = plt.subplots(3, 1, figsize=(10, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

pigments = [
    ('Chlorophyll', chlorophyll, '#22c55e', 'Reflects: GREEN'),
    ('Carotenoids', carotenoid, '#f59e0b', 'Reflects: YELLOW/ORANGE'),
    ('Anthocyanins', anthocyanin, '#a855f7', 'Reflects: RED/PURPLE/BLUE'),
]

# Rainbow background for reference
rainbow_colors = plt.cm.rainbow(np.linspace(0, 1, len(wavelength)))

for ax, (name, spectrum, color, reflects) in zip(axes, pigments):
    ax.set_facecolor('#111827')
    # Show rainbow strip at bottom
    for i in range(len(wavelength) - 1):
        ax.axvspan(wavelength[i], wavelength[i+1], ymin=0, ymax=0.05,
                   color=rainbow_colors[i], alpha=0.6)
    ax.fill_between(wavelength, spectrum, alpha=0.3, color=color)
    ax.plot(wavelength, spectrum, color=color, linewidth=2)
    ax.set_ylabel('Absorption', color='white')
    ax.set_title(f'{name} — {reflects}', color=color, fontsize=11)
    ax.set_ylim(0, 1.1)
    ax.tick_params(colors='gray')

axes[-1].set_xlabel('Wavelength (nm)', color='white')
plt.tight_layout()
plt.show()

print("Visible light spectrum: 380nm (violet) to 750nm (red)")
print()
print("What a pigment ABSORBS is the opposite of what you SEE:")
print("  Chlorophyll absorbs red+blue -> you see GREEN")
print("  Carotenoids absorb blue -> you see YELLOW/ORANGE")
print("  Anthocyanins absorb green -> you see RED/PURPLE")`,
      challenge: 'What colour would you see if a petal had equal amounts of all three pigments? Modify the code to plot the combined absorption spectrum. What wavelengths are left (reflected)?',
      successHint: 'Every colour in nature — flowers, feathers, coral reefs — comes from the physics of light absorption. Understanding pigments is the first step to understanding both biology and optics.',
    },
    {
      title: 'Why flowers have colour — signals to pollinators',
      concept: `Flowers don't have colour for our enjoyment. Colour is a **signal** — an advertisement to pollinators. Each colour targets a different pollinator:

- **Red**: hummingbirds (birds see red well; most insects don't)
- **Blue/purple**: bees (bees see UV and blue exceptionally well)
- **White**: moths (visible at night when moths are active)
- **Yellow**: many generalist insects (beetles, flies, bees)
- **Dark red/brown**: flies (mimics rotting meat)

Flowers also have **UV patterns** invisible to us but visible to bees. These "nectar guides" are like runway lights directing the bee to the pollen.

The relationship is economic: the flower offers nectar (sugar water) as payment, and the pollinator carries pollen to the next flower. Colour is the shop sign that says "open for business."`,
      analogy: 'A flower\'s colour is like a restaurant sign. A red neon sign attracts one crowd; a fancy gold sign attracts another. The "food" (nectar) might be the same, but the sign (colour) determines who walks in. And just like restaurants, flowers compete for customers.',
      storyConnection: 'The orchid in our story didn\'t just get colours for beauty — each colour was a business deal with a different pollinator. The purple petals attracted bees; the yellow throat guided them to the nectar. Even in a folktale, the colours have biological purpose.',
      checkQuestion: 'Some orchids are "deceptive" — they mimic the appearance of female insects to trick males into pollinating them, but offer no nectar. Is this sustainable?',
      checkAnswer: 'It works because the male insects can\'t easily learn to avoid the orchids — the mimicry is too good, and the cost of missing a real mate is high. But deceptive orchids have lower pollination rates than nectar-offering flowers. They survive by being rare enough that pollinators don\'t learn to avoid them.',
      codeIntro: 'Model which pollinators visit which flower colours based on their vision.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Pollinator vision sensitivity (simplified)
wavelength = np.linspace(300, 700, 500)

# Bee vision: UV-sensitive, peaks at ~350nm (UV), ~440nm (blue), ~540nm (green)
# Cannot see red well
bee = (0.7 * np.exp(-0.5 * ((wavelength - 350) / 30) ** 2) +
       1.0 * np.exp(-0.5 * ((wavelength - 440) / 25) ** 2) +
       0.8 * np.exp(-0.5 * ((wavelength - 540) / 30) ** 2))

# Hummingbird: good across visible, especially red
bird = (0.5 * np.exp(-0.5 * ((wavelength - 460) / 40) ** 2) +
        0.7 * np.exp(-0.5 * ((wavelength - 530) / 35) ** 2) +
        1.0 * np.exp(-0.5 * ((wavelength - 620) / 40) ** 2))

# Moth: peaks in UV/blue, active at night (attracted to pale/white)
moth = (0.9 * np.exp(-0.5 * ((wavelength - 370) / 30) ** 2) +
        0.6 * np.exp(-0.5 * ((wavelength - 450) / 35) ** 2))

fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

ax.plot(wavelength, bee, color='#f59e0b', linewidth=2, label='Bee vision')
ax.plot(wavelength, bird, color='#ef4444', linewidth=2, label='Hummingbird vision')
ax.plot(wavelength, moth, color='#94a3b8', linewidth=2, label='Moth vision')

# Mark regions
regions = [
    (300, 380, 'UV', '#a855f7', 0.08),
    (380, 450, 'Violet/Blue', '#3b82f6', 0.06),
    (450, 520, 'Green', '#22c55e', 0.06),
    (520, 600, 'Yellow/Orange', '#f59e0b', 0.06),
    (600, 700, 'Red', '#ef4444', 0.06),
]
for lo, hi, label, color, alpha in regions:
    ax.axvspan(lo, hi, alpha=alpha, color=color)
    ax.text((lo + hi) / 2, 1.05, label, color=color, ha='center', fontsize=8)

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Sensitivity', color='white')
ax.set_title('Why Flower Colour Matters: Pollinator Vision', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_xlim(300, 700)
ax.set_ylim(0, 1.2)
plt.tight_layout()
plt.show()

print("Matching flower colour to pollinator:")
print("  Purple/blue flowers -> attract BEES (peak UV/blue sensitivity)")
print("  Red flowers -> attract BIRDS (bees can't see red well)")
print("  White/pale flowers -> attract MOTHS (visible at night)")
print("  Yellow flowers -> visible to many insects (generalist)")
print()
print("Orchids have evolved to target specific pollinators")
print("by fine-tuning their petal colours over millions of years.")`,
      challenge: 'Add a fourth pollinator — butterflies, which see well in red and orange (peak ~600nm). Plot their sensitivity curve. Which flowers would target butterflies?',
      successHint: 'Flower colour is not random art — it is precision engineering by natural selection, tuned to the eyes of specific pollinators over millions of years of co-evolution.',
    },
    {
      title: 'Pollination strategies — how pollen gets from A to B',
      concept: `Pollination is the transfer of pollen (male) to the stigma (female) of a flower. Plants can't walk, so they've evolved ingenious strategies to move pollen:

- **Wind pollination**: grasses, wheat, corn. Flowers are small, no petals, produce enormous quantities of pollen. Allergies come from wind-borne pollen.
- **Insect pollination**: most flowering plants. Colourful petals, scent, nectar. Efficient but requires the right insect.
- **Bird pollination**: red tubular flowers (fuchsia, hibiscus). Birds have no sense of smell, so bird-flowers are often scentless but brightly coloured.
- **Bat pollination**: large pale flowers that open at night (baobab, agave). Strong fruity scent.
- **Water pollination**: aquatic plants. Pollen floats on the water surface.

Orchids are the masters of insect pollination. Some have evolved pollen packages called **pollinia** that stick to a specific spot on a specific insect — ensuring the pollen reaches the right orchid species.`,
      analogy: 'Pollination strategies are like mail delivery systems. Wind pollination is scattering a million flyers from a rooftop — wasteful but needs no delivery person. Insect pollination is hiring a courier — efficient and targeted, but you have to pay them (nectar). Orchid pollinia are like registered mail — tracked and guaranteed.',
      storyConnection: 'The orchid in our story relied on a specific bee to carry its colours. This is exactly how real orchids work — many species depend on a single pollinator. If that pollinator disappears, the orchid can\'t reproduce. Co-dependence is both strength and vulnerability.',
      checkQuestion: 'Vanilla comes from an orchid. In its native Mexico, it is pollinated by a specific bee. When vanilla was taken to Madagascar (world\'s largest producer), the bee didn\'t exist there. How is vanilla pollinated in Madagascar?',
      checkAnswer: 'By hand. Every single vanilla flower in Madagascar is pollinated by a human worker using a small stick to transfer pollen. This is why vanilla is the second most expensive spice in the world (after saffron). A 12-year-old boy named Edmond Albius discovered the hand-pollination technique in 1841.',
      codeIntro: 'Compare the efficiency and cost of different pollination strategies.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Pollination strategy comparison
strategies = ['Wind', 'Generalist\\ninsect', 'Specialist\\ninsect', 'Bird', 'Bat', 'Orchid\\n(pollinia)']

# Metrics (0-10 scale)
pollen_produced = [10, 5, 3, 4, 4, 1]
precision = [1, 5, 8, 7, 6, 10]
nectar_cost = [0, 6, 7, 8, 9, 3]  # some orchids cheat (no nectar)
reliability = [3, 7, 5, 6, 5, 4]

x = np.arange(len(strategies))
width = 0.2

fig, ax = plt.subplots(figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

bars1 = ax.bar(x - 1.5*width, pollen_produced, width, color='#f59e0b', label='Pollen produced', alpha=0.9)
bars2 = ax.bar(x - 0.5*width, precision, width, color='#22c55e', label='Precision', alpha=0.9)
bars3 = ax.bar(x + 0.5*width, nectar_cost, width, color='#ef4444', label='Nectar cost', alpha=0.9)
bars4 = ax.bar(x + 1.5*width, reliability, width, color='#3b82f6', label='Reliability', alpha=0.9)

ax.set_xticks(x)
ax.set_xticklabels(strategies, color='white', fontsize=9)
ax.set_ylabel('Score (0-10)', color='white')
ax.set_title('Pollination Strategy Trade-offs', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper right')
ax.tick_params(colors='gray')
ax.set_ylim(0, 12)

plt.tight_layout()
plt.show()

print("Key trade-offs:")
print("  Wind: cheap (no nectar), imprecise (most pollen wasted)")
print("  Specialist insect: precise, but unreliable if pollinator declines")
print("  Orchid pollinia: maximum precision, minimum pollen waste")
print("    BUT highest risk if the one pollinator goes extinct")
print()
print("Efficiency = precision / pollen_produced:")
for name, prec, pollen in zip(strategies, precision, pollen_produced):
    eff = prec / pollen if pollen > 0 else 0
    print(f"  {name.replace(chr(10), ' ')}: {eff:.1f}")`,
      challenge: 'Add a "vulnerability" metric: how badly would the loss of the pollinator affect reproduction? Wind-pollinated plants score 0 (no pollinator needed). Orchids with a single pollinator species score 10.',
      successHint: 'Every pollination strategy is a trade-off between cost, precision, and risk. Orchids chose extreme precision — which made them the most diverse flowering plant family (28,000+ species) but also the most vulnerable.',
    },
    {
      title: 'Co-evolution — the dance between flower and pollinator',
      concept: `**Co-evolution** is when two species evolve in response to each other over millions of years. The classic example: Darwin's orchid (*Angraecum sesquipedale*) from Madagascar has a nectar tube 30cm deep. Darwin predicted that a moth must exist with a 30cm tongue to reach the nectar. He was mocked — until the moth was discovered 21 years after his death.

How co-evolution works:
1. Orchid has a slightly deeper nectar tube → only long-tongued moths can reach it
2. Moths with longer tongues get more nectar → they reproduce more
3. Orchid evolves even deeper → moths evolve even longer tongues
4. Over millions of years: extreme specialization

This is an **evolutionary arms race**. Both species keep "escalating" because stopping means losing the relationship. The result is exquisite precision — and dangerous fragility.`,
      analogy: 'Co-evolution is like two dance partners who\'ve been practising together for decades. Their moves are perfectly synchronized — but neither can dance with anyone else. If one partner retires, the other is stranded. Generalists are like people who can do any group dance; specialists are like figure-skating pairs.',
      storyConnection: 'The story tells of the orchid and the bee learning each other\'s rhythms — the bee knowing exactly when the orchid blooms, the orchid shaping its petals to fit the bee\'s body. This is co-evolution compressed into a parable. In reality, it took millions of years of tiny adjustments.',
      checkQuestion: 'If a co-evolved pollinator goes extinct due to pesticides, what happens to the orchid?',
      checkAnswer: 'The orchid can\'t reproduce sexually. It may survive for years (orchids are long-lived), but without seeds, the population will eventually go extinct. Some orchids can propagate vegetatively, buying time — but genetic diversity freezes. This is happening right now to many orchid species worldwide.',
      codeIntro: 'Simulate co-evolution: flower tube depth and moth tongue length evolving together.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

generations = 200
n_flowers = 50
n_moths = 50

# Track mean traits over time
flower_history = []
moth_history = []

# Initial trait distributions
flower_depth = np.random.normal(5, 1, n_flowers)  # cm
moth_tongue = np.random.normal(5, 1, n_moths)  # cm

for gen in range(generations):
    flower_history.append(np.mean(flower_depth))
    moth_history.append(np.mean(moth_tongue))

    # Selection: deeper flowers exclude short-tongued moths
    # Moths that can reach nectar survive better
    moth_fitness = np.array([np.mean(moth_tongue[i] >= flower_depth) for i in range(n_moths)])
    moth_fitness = moth_fitness / moth_fitness.sum()

    # Flowers pollinated by longest-tongued moths get pollen
    # Deeper flowers force only long-tongued moths -> more specific pollination
    flower_fitness = np.array([np.mean(flower_depth[i] <= moth_tongue) * (flower_depth[i] / np.mean(flower_depth)) for i in range(n_flowers)])
    flower_fitness = np.clip(flower_fitness, 0.01, None)
    flower_fitness = flower_fitness / flower_fitness.sum()

    # Reproduce with selection
    moth_parents = np.random.choice(n_moths, n_moths, p=moth_fitness)
    moth_tongue = moth_tongue[moth_parents] + np.random.normal(0, 0.1, n_moths)

    flower_parents = np.random.choice(n_flowers, n_flowers, p=flower_fitness)
    flower_depth = flower_depth[flower_parents] + np.random.normal(0, 0.1, n_flowers)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
fig.patch.set_facecolor('#1f2937')

gens = np.arange(generations)

ax1.set_facecolor('#111827')
ax1.plot(gens, flower_history, color='#a855f7', linewidth=2, label='Flower tube depth')
ax1.plot(gens, moth_history, color='#f59e0b', linewidth=2, label='Moth tongue length')
ax1.set_xlabel('Generations', color='white')
ax1.set_ylabel('Trait size (cm)', color='white')
ax1.set_title('Co-evolution: Flower Depth & Moth Tongue', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Show the trait difference over time
diff = np.array(moth_history) - np.array(flower_history)
ax2.set_facecolor('#111827')
ax2.plot(gens, diff, color='#22c55e', linewidth=2)
ax2.axhline(0, color='gray', linestyle='--', linewidth=0.5)
ax2.fill_between(gens, diff, alpha=0.2, color='#22c55e')
ax2.set_xlabel('Generations', color='white')
ax2.set_ylabel('Tongue - Tube (cm)', color='white')
ax2.set_title('Match Quality (closer to 0 = tighter co-evolution)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Starting: flower depth = {flower_history[0]:.1f} cm, moth tongue = {moth_history[0]:.1f} cm")
print(f"After {generations} generations: flower = {flower_history[-1]:.1f} cm, moth = {moth_history[-1]:.1f} cm")
print(f"Both traits escalated together — this is the co-evolutionary arms race.")
print(f"Darwin's orchid: 30cm tube. Its moth: 30cm tongue. Predicted in 1862, confirmed 1903.")`,
      challenge: 'At generation 100, remove the moth (set moth_tongue to random low values, simulating extinction). What happens to flower depth? Does it keep increasing or collapse?',
      successHint: 'Co-evolution produces the most beautiful and precise relationships in nature — but also the most fragile. Understanding it is key to conservation: saving one species often means saving its partner too.',
    },
    {
      title: 'Orchid diversity — 28,000 species and counting',
      concept: `Orchids (family Orchidaceae) are the **largest family of flowering plants**, with over 28,000 known species — more than mammals, birds, and reptiles combined. They grow on every continent except Antarctica.

Why are orchids so diverse?
- **Epiphytic lifestyle**: most orchids grow on tree branches, not in soil. This opened up a massive habitat (the forest canopy) with many micro-niches.
- **Specialist pollination**: each species often depends on a specific pollinator, which leads to reproductive isolation (a key driver of speciation).
- **Tiny seeds**: orchid seeds are dust-like, with no food reserve. They depend on a fungus to germinate (mycorrhizal symbiosis). Being tiny means they travel far on wind.
- **Rapid evolution**: all of the above creates many small, isolated populations — the perfect recipe for new species forming.

Northeast India is a **hotspot** for orchid diversity: over 850 species recorded, many found nowhere else on Earth.`,
      analogy: 'Orchid diversity is like app diversity on a smartphone. Each app fills a tiny niche that no other app fills perfectly. The "platform" (tree canopy) supports thousands of specialist "apps" (orchid species), each adapted to a specific micro-environment.',
      storyConnection: 'The story speaks of the orchid\'s many forms — one colour for each hill, one shape for each valley. This is not far from reality: Arunachal Pradesh alone has over 600 orchid species. Each hillside, each altitude band, each forest type has its own orchid community.',
      checkQuestion: 'Why do orchid seeds need a fungus to germinate? Can\'t they grow on their own like a tomato seed?',
      checkAnswer: 'Orchid seeds have almost no stored food (endosperm). A tomato seed carries weeks of nutrients. An orchid seed is essentially just DNA in a thin coat. It must be infected by a specific mycorrhizal fungus that provides sugars until the seedling can photosynthesize. This is an obligate symbiosis — another form of co-evolution.',
      codeIntro: 'Visualize orchid species diversity across different regions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Orchid species counts by region (approximate)
regions = ['Colombia', 'Ecuador', 'Brazil', 'Borneo', 'NE India\\n(Arunachal)', 'Papua\\nNew Guinea',
           'China', 'Madagascar', 'Thailand', 'Peru']
species = [4270, 4032, 2500, 3000, 850, 3000, 1500, 1000, 1300, 2600]

# Sort by species count
sorted_idx = np.argsort(species)[::-1]
regions_sorted = [regions[i] for i in sorted_idx]
species_sorted = [species[i] for i in sorted_idx]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Bar chart
ax1.set_facecolor('#111827')
colors = ['#a855f7' if 'India' in r else '#3b82f6' for r in regions_sorted]
bars = ax1.barh(range(len(regions_sorted)), species_sorted, color=colors, alpha=0.85)
ax1.set_yticks(range(len(regions_sorted)))
ax1.set_yticklabels(regions_sorted, color='white', fontsize=9)
ax1.set_xlabel('Number of orchid species', color='white')
ax1.set_title('Orchid Species by Region', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.invert_yaxis()

for bar, count in zip(bars, species_sorted):
    ax1.text(bar.get_width() + 30, bar.get_y() + bar.get_height()/2,
             f'{count:,}', va='center', color='white', fontsize=9)

# Pie chart: orchid families as fraction of all plants
ax2.set_facecolor('#111827')
plant_families = ['Orchidaceae\\n(28,000)', 'Asteraceae\\n(daisies, 24,000)',
                  'Fabaceae\\n(legumes, 20,000)', 'Poaceae\\n(grasses, 12,000)',
                  'Other families\\n(~270,000)']
plant_counts = [28000, 24000, 20000, 12000, 270000]
pie_colors = ['#a855f7', '#f59e0b', '#22c55e', '#3b82f6', '#6b7280']

ax2.pie(plant_counts, labels=plant_families, colors=pie_colors, autopct='%1.0f%%',
        textprops={'color': 'white', 'fontsize': 8}, pctdistance=0.8,
        explode=[0.1, 0, 0, 0, 0])
ax2.set_title('Orchids: Largest Flowering Plant Family', color='white', fontsize=13)

plt.tight_layout()
plt.show()

print("Orchid facts:")
print(f"  Total species: ~28,000 (8% of all flowering plants)")
print(f"  NE India (Arunachal Pradesh alone): ~600+ species")
print(f"  New species discovered: ~50-100 per year")
print(f"  Smallest orchid: Platystele jungermannioides (2mm flower)")
print(f"  Largest orchid: Grammatophyllum speciosum (up to 3m tall)")`,
      challenge: 'Research: how many orchid species are endangered? The IUCN lists about 1,800. Calculate what percentage of all orchid species that is, and add a "threatened species" bar to the chart.',
      successHint: 'Orchids are both the most diverse and among the most threatened plant families. Their specialist strategies made them incredibly successful — and now incredibly vulnerable to habitat loss.',
    },
    {
      title: 'Conservation of rare species — saving what we barely know',
      concept: `Of the 28,000+ orchid species, nearly 1 in 10 is threatened with extinction. The main threats:

- **Habitat destruction**: tropical deforestation removes the trees orchids grow on
- **Over-collection**: rare orchids are worth thousands to collectors (orchid trafficking is a real crime)
- **Climate change**: orchids at high altitudes have nowhere higher to go as temperatures rise
- **Pollinator loss**: if the specific pollinator disappears, the orchid can't reproduce
- **Invasive species**: non-native plants and animals disrupt orchid habitats

Conservation approaches:
- **In-situ**: protecting orchids in their natural habitat (national parks, community forests)
- **Ex-situ**: growing orchids in botanical gardens and seed banks
- **Community-based**: working with local communities who traditionally protect orchids (many NE Indian communities have sacred groves)
- **Legal protection**: CITES (Convention on International Trade in Endangered Species) regulates orchid trade

The challenge: we can't save species we haven't found yet. An estimated 10-20% of orchid species haven't been scientifically described.`,
      analogy: 'Conservation is like firefighting. In-situ protection is preventing fires (preserving habitat). Ex-situ conservation is maintaining backup copies (botanical gardens). Community involvement is training locals as volunteer firefighters. And CITES is the fire code — regulations to prevent carelessness.',
      storyConnection: 'The story ends with a warning: "If the forests fall, the orchid\'s colours will vanish forever." This is not metaphor — it is happening. Arunachal Pradesh loses forest cover every year, and with it, orchid species that may never be formally described.',
      checkQuestion: 'A single rare orchid was sold at auction for $200,000 in 2005. Why would making orchid trade illegal (which CITES does for many species) actually help conservation?',
      checkAnswer: 'Making trade illegal reduces demand by raising the risk. But it\'s complicated: illegal trade still exists (like drug trafficking), and it removes the incentive for local people to protect orchids (they can\'t profit legally). The best approach combines legal protection with sustainable-use programs that give communities economic incentives to conserve.',
      codeIntro: 'Model how habitat loss drives species extinction using a species-area relationship.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Species-Area Relationship: S = c * A^z
# S = number of species, A = area, c = constant, z = 0.15-0.35
# For tropical orchids, z ≈ 0.25

area_pct = np.linspace(1, 100, 200)  # percentage of original habitat remaining
z = 0.25
c = 100  # starting species when area = 100%

species_remaining = c * (area_pct / 100) ** z

# Scenario: progressive habitat loss over decades
decades = np.arange(0, 11)
forest_remaining = 100 * 0.92 ** decades  # 8% loss per decade (realistic for NE India)
species_at_decade = c * (forest_remaining / 100) ** z

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Species-area curve
ax1.set_facecolor('#111827')
ax1.plot(area_pct, species_remaining, color='#22c55e', linewidth=2)
ax1.fill_between(area_pct, species_remaining, alpha=0.15, color='#22c55e')

# Mark critical thresholds
for pct, color, label in [(50, '#f59e0b', '50% habitat lost'), (80, '#ef4444', '80% habitat lost'), (90, '#dc2626', '90% habitat lost')]:
    remaining = 100 - pct
    sp = c * (remaining / 100) ** z
    ax1.plot(remaining, sp, 'o', color=color, markersize=8)
    ax1.annotate(f'{label}\\n{sp:.0f}% species left', xy=(remaining, sp),
                 xytext=(remaining + 5, sp + 3), color=color, fontsize=8,
                 arrowprops=dict(arrowstyle='->', color=color))

ax1.set_xlabel('Habitat remaining (%)', color='white')
ax1.set_ylabel('Species remaining (% of original)', color='white')
ax1.set_title('Species-Area Curve (z=0.25)', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Timeline projection
ax2.set_facecolor('#111827')
ax2.plot(decades * 10, forest_remaining, 'o-', color='#22c55e', linewidth=2, label='Forest area')
ax2.plot(decades * 10, species_at_decade, 's-', color='#a855f7', linewidth=2, label='Orchid species')
ax2.set_xlabel('Years from now', color='white')
ax2.set_ylabel('Remaining (%)', color='white')
ax2.set_title('NE India Projection: 8% Forest Loss per Decade', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 105)

plt.tight_layout()
plt.show()

print("Species-Area Relationship predictions:")
print(f"  Lose 50% of habitat -> lose {100 - c * 0.5**z:.0f}% of species")
print(f"  Lose 80% of habitat -> lose {100 - c * 0.2**z:.0f}% of species")
print(f"  Lose 90% of habitat -> lose {100 - c * 0.1**z:.0f}% of species")
print()
print("The curve is NOT linear — the first 50% of habitat loss")
print("causes relatively few extinctions. The last 20% is catastrophic.")
print("This is why conservation has a 'tipping point' feel.")`,
      challenge: 'What if conservation efforts reduce the loss rate from 8% to 3% per decade? Change the decay rate and compare the two scenarios on the same plot. How many extra decades does it buy?',
      successHint: 'The species-area curve is one of the most powerful tools in conservation biology. It tells us that protecting habitat is not just nice — it is mathematically necessary to prevent mass extinction.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Plant Pigments & Pollination</span>
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