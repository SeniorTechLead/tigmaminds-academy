import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TejimolaLevel1() {
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
      title: 'Cells — the building blocks of all living things',
      concept: `When Tejimola was buried in the garden, a tulsi plant grew from that spot overnight. In the real world, plants don't grow from stories — they grow from **cells**. Every plant, animal, and fungus is made of tiny units called cells.

A plant cell has three key parts that animal cells don't:
- **Cell wall**: a rigid outer shell made of cellulose (gives plants their structure)
- **Chloroplasts**: tiny green factories that convert sunlight into sugar (photosynthesis)
- **Vacuole**: a large water-filled sac that maintains pressure and stores nutrients

A single plant cell can, under the right conditions, grow into an entire new plant. This is called **totipotency** — and it's the real-world version of Tejimola's spirit regrowing from the earth.`,
      analogy: 'A cell is like a tiny factory with walls (cell wall), a power plant (chloroplasts), a water tower (vacuole), a control room (nucleus), and assembly lines (ribosomes). Every factory produces the same product: more of itself.',
      storyConnection: 'Tejimola kept coming back — as tulsi, as a gourd vine, as a lotus, as a champa tree. In biology, this is vegetative propagation: a fragment of a plant can regenerate into a whole new organism. The "spirit that wouldn\'t die" is really the power of totipotent plant cells.',
      checkQuestion: 'Why can a plant grow back from a cutting (a piece of stem), but a human can\'t grow back from a finger?',
      checkAnswer: 'Plant cells retain totipotency — many cells can de-differentiate and become any cell type. Human cells are mostly terminally differentiated — a skin cell can only make more skin cells. There are exceptions (stem cells), but in general, plants are far more regenerative than animals.',
      codeIntro: 'Model cell division: one cell becomes two, two become four, four become eight...',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cell division: each cell divides every 24 hours
hours = np.arange(0, 168, 1)  # 1 week
cells = 2 ** (hours / 24)  # doubling every 24 hours

fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')
ax.plot(hours, cells, color='#22c55e', linewidth=2)
ax.fill_between(hours, cells, alpha=0.1, color='#22c55e')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Number of cells', color='white')
ax.set_title('Exponential Cell Division', color='white', fontsize=13)
ax.tick_params(colors='gray')

# Mark each day
for day in range(1, 8):
    h = day * 24
    c = 2 ** day
    ax.plot(h, c, 'o', color='#f59e0b', markersize=6)
    ax.annotate(f'Day {day}: {c} cells', xy=(h, c), xytext=(h+5, c*1.3),
                color='#f59e0b', fontsize=8)

plt.tight_layout()
plt.show()

print("Starting from 1 cell:")
for day in range(8):
    print(f"  Day {day}: {2**day:,} cells")
print()
print("After 30 days: {:,} cells".format(2**30))
print("That's over 1 BILLION cells from a single one.")`,
      challenge: 'Change the division time from 24 hours to 12 hours. How does that change the growth curve? Some fast-growing bacteria divide every 20 minutes!',
      successHint: 'Exponential growth is why a single cell can become a whole plant (or a whole human — you started as one cell too). Tejimola\'s tulsi grew "overnight" in the story; in reality, it takes days to weeks.',
    },
    {
      title: 'Photosynthesis — how plants eat sunlight',
      concept: `Plants don't eat food like animals do. They make their own using **photosynthesis**: sunlight + water + CO₂ → sugar + oxygen. This happens inside **chloroplasts** — tiny green organelles in every leaf cell.

The equation: **6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂**

This is arguably the most important chemical reaction on Earth. It:
- Produces all the oxygen we breathe
- Creates the base of almost every food chain
- Removes CO₂ from the atmosphere
- Converts solar energy into chemical energy (sugar)

The green colour of leaves comes from **chlorophyll**, the molecule that absorbs sunlight. It absorbs red and blue light but reflects green — which is why plants look green to us.`,
      analogy: 'Photosynthesis is like a solar-powered kitchen. Sunlight is the electricity, water and CO₂ are the ingredients, and sugar is the meal. Oxygen is the exhaust. The chef (chlorophyll) works only during daylight hours.',
      storyConnection: 'Every plant Tejimola became — tulsi, gourd, lotus, champa — survived because of photosynthesis. Each leaf was a solar panel, each chloroplast a tiny factory converting sunlight into the energy needed to grow. The "spirit" that kept Tejimola alive was really photosynthesis.',
      checkQuestion: 'If photosynthesis requires sunlight, why do plants still grow at night?',
      checkAnswer: 'During the day, plants produce more sugar than they use. They store the excess as starch. At night, they break down the starch back into sugar for energy. Plants grow at night by spending the savings from the day — like a solar-powered house with a battery.',
      codeIntro: 'Model photosynthesis rate vs. light intensity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Photosynthesis rate vs light intensity
# Follows a saturation curve (Michaelis-Menten-like)
light = np.linspace(0, 2000, 200)  # μmol photons/m²/s

# Rate = Vmax * light / (Km + light)
vmax = 20  # max rate (μmol CO2/m²/s)
km = 200   # half-saturation constant

rate = vmax * light / (km + light)

# Respiration (constant, happens day and night)
respiration = 2  # μmol CO2/m²/s

fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

ax.plot(light, rate, color='#22c55e', linewidth=2, label='Photosynthesis rate')
ax.axhline(respiration, color='#ef4444', linestyle='--', linewidth=1, label='Respiration rate')
ax.fill_between(light, rate, respiration, where=rate > respiration, alpha=0.15, color='#22c55e', label='Net growth (sugar surplus)')

# Compensation point (where photo = respiration)
comp_light = km * respiration / (vmax - respiration)
ax.axvline(comp_light, color='#f59e0b', linestyle=':', linewidth=1)
ax.annotate(f'Compensation point\\n({comp_light:.0f} μmol)', xy=(comp_light, respiration),
            xytext=(comp_light + 100, respiration + 5), color='#f59e0b', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax.set_xlabel('Light intensity (μmol photons/m²/s)', color='white')
ax.set_ylabel('Rate (μmol CO₂/m²/s)', color='white')
ax.set_title('Photosynthesis vs Light: The Saturation Curve', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
plt.tight_layout()
plt.show()

print("Key points:")
print(f"  Max photosynthesis rate: {vmax} μmol CO₂/m²/s")
print(f"  Respiration rate: {respiration} (constant, day and night)")
print(f"  Compensation point: {comp_light:.0f} μmol light")
print("  Below compensation point: plant loses sugar (dying)")
print("  Above: plant gains sugar (growing)")`,
      challenge: 'Shade plants have lower Vmax but also lower Km (they\'re efficient at low light). Change Vmax to 10 and Km to 50. How does the curve change?',
      successHint: 'Every farmer, greenhouse operator, and botanist uses this curve. It tells you exactly how much light a plant needs to thrive — and why dim rooms kill houseplants.',
    },
    {
      title: 'Vegetative propagation — growing without seeds',
      concept: `Most animals reproduce sexually (two parents, genetic mixing). Plants can do that too — with flowers, pollen, and seeds. But many plants have a superpower: **vegetative propagation** — growing a whole new plant from just a fragment of the parent.

Types of vegetative propagation:
- **Cuttings**: a piece of stem grows roots and becomes a new plant (roses, tulsi)
- **Runners**: horizontal stems that grow along the ground (strawberries)
- **Tubers**: underground storage organs that sprout (potatoes)
- **Bulbs**: layered storage organs (onions, garlic)
- **Layering**: a branch touches the ground and roots (blackberries)

The key insight: the new plant is a **clone** — genetically identical to the parent. This is why farmers use cuttings for fruit trees: every Alphonso mango tree in the world is a clone of one original tree.`,
      analogy: 'Vegetative propagation is like copying a file on your computer. The copy is identical to the original. Seeds are more like writing a new document inspired by two different sources — the result is unique. Cloning is fast and reliable; sexual reproduction is slow but creates diversity.',
      storyConnection: 'Tejimola grew back from each place she was planted — tulsi from the garden soil, gourd from the riverbank, lotus from the pond. Each was a different plant form, but in biology, vegetative propagation would make each a clone. The story\'s transformations are actually closer to metamorphosis than cloning.',
      checkQuestion: 'If all banana plants are clones (they are — commercial bananas are propagated vegetatively), what\'s the danger?',
      checkAnswer: 'A disease that kills one can kill them all — they have no genetic diversity. This is exactly what happened: the Gros Michel banana was wiped out by Panama disease in the 1950s. The Cavendish (what we eat today) is also a clone, and a new strain of Panama disease is threatening it now.',
      codeIntro: 'Simulate vegetative vs. sexual reproduction outcomes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate 20 plants from cuttings (clones) vs 20 from seeds
# Trait: height in cm after 3 months

# Clone parent trait
parent_height = 45  # cm

# Clones: very little variation (only environmental)
clone_heights = np.random.normal(parent_height, 2, 20)

# Seed offspring: genetic variation (two parents)
parent1, parent2 = 45, 55  # two parent heights
seed_heights = np.random.normal((parent1 + parent2) / 2, 8, 20)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Clone histogram
ax1.set_facecolor('#111827')
ax1.hist(clone_heights, bins=10, color='#22c55e', alpha=0.8, edgecolor='none')
ax1.axvline(parent_height, color='#f59e0b', linestyle='--', linewidth=2, label=f'Parent: {parent_height}cm')
ax1.set_title('Clones (cuttings)', color='white', fontsize=12)
ax1.set_xlabel('Height (cm)', color='white')
ax1.set_ylabel('Count', color='white')
ax1.set_xlim(25, 70)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Seed histogram
ax2.set_facecolor('#111827')
ax2.hist(seed_heights, bins=10, color='#3b82f6', alpha=0.8, edgecolor='none')
ax2.axvline(parent1, color='#f59e0b', linestyle='--', linewidth=1, label=f'Parent 1: {parent1}cm')
ax2.axvline(parent2, color='#ef4444', linestyle='--', linewidth=1, label=f'Parent 2: {parent2}cm')
ax2.set_title('Seeds (sexual reproduction)', color='white', fontsize=12)
ax2.set_xlabel('Height (cm)', color='white')
ax2.set_xlim(25, 70)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Clones: mean={np.mean(clone_heights):.1f}cm, std={np.std(clone_heights):.1f}cm")
print(f"Seeds:  mean={np.mean(seed_heights):.1f}cm, std={np.std(seed_heights):.1f}cm")
print()
print("Clones are predictable (low variation).")
print("Seeds are diverse (high variation).")
print("Predictability is great for farming.")
print("Diversity is essential for surviving new diseases.")`,
      challenge: 'What if a disease kills everything above 50cm? Remove heights > 50 from both groups. How many clones survive vs. seeds?',
      successHint: 'The clone vs. seed trade-off is one of the most important concepts in agriculture and conservation. Predictability vs. resilience — you can\'t have both from one strategy.',
    },
    {
      title: 'Plant growth stages — from seed to tree',
      concept: `Every plant Tejimola became went through the same growth stages, just at different speeds:

1. **Germination**: seed absorbs water, cracks open, root emerges
2. **Seedling**: first leaves appear, photosynthesis begins
3. **Vegetative growth**: stem elongates, more leaves, root system expands
4. **Flowering**: reproductive structures form (if it's a flowering plant)
5. **Fruiting/seeding**: seeds develop, ready to start the cycle again

Growth follows a **sigmoid curve** (S-shape): slow start → rapid growth → plateau. This happens because:
- Early on: few cells, little photosynthesis, slow growth
- Middle: many cells, lots of photosynthesis, exponential growth
- Late: resources limited (light, water, space), growth slows`,
      analogy: 'Plant growth is like a startup company. At first, growth is slow (building the team, the "roots"). Then it takes off exponentially (product-market fit, the "vegetative growth" phase). Eventually it plateaus (market saturation, resource limits). The S-curve applies to cells, companies, and populations.',
      storyConnection: 'The champa tree — Tejimola\'s final form — grew "tall and golden-flowered." A real champa (Magnolia champaca) takes 5-7 years to first flower. The story compressed years into days, but the biology follows the same S-curve.',
      checkQuestion: 'If a plant doubles its mass every week during the exponential phase, and it covers half the pond on day 29, when does it cover the whole pond?',
      checkAnswer: 'Day 30. If it doubles every week, covering half the pond means it covers the whole pond in one more doubling period. This is the classic "lily pad" problem — exponential growth is deceptively slow until it suddenly isn\'t.',
      codeIntro: 'Plot the sigmoid growth curve and mark the growth stages.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sigmoid growth model: height = max_height / (1 + e^(-k*(t - t_mid)))
days = np.arange(0, 365)
max_height = 200  # cm (champa tree first year)
k = 0.03  # growth rate
t_mid = 150  # midpoint (day of fastest growth)

height = max_height / (1 + np.exp(-k * (days - t_mid)))

# Growth rate (derivative)
growth_rate = max_height * k * np.exp(-k * (days - t_mid)) / (1 + np.exp(-k * (days - t_mid)))**2

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Height curve
ax1.set_facecolor('#111827')
ax1.plot(days, height, color='#22c55e', linewidth=2)
ax1.set_ylabel('Height (cm)', color='white')
ax1.set_title('Plant Growth: The Sigmoid Curve', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Mark stages
stages = [(20, 'Germination', '#f59e0b'), (60, 'Seedling', '#3b82f6'),
          (150, 'Rapid growth', '#22c55e'), (250, 'Flowering', '#ef4444'),
          (320, 'Maturity', '#a855f7')]
for day, label, color in stages:
    h = max_height / (1 + np.exp(-k * (day - t_mid)))
    ax1.plot(day, h, 'o', color=color, markersize=8)
    ax1.annotate(label, xy=(day, h), xytext=(day+10, h+10), color=color, fontsize=9)

# Growth rate curve
ax2.set_facecolor('#111827')
ax2.fill_between(days, growth_rate, alpha=0.3, color='#22c55e')
ax2.plot(days, growth_rate, color='#22c55e', linewidth=2)
ax2.set_xlabel('Days', color='white')
ax2.set_ylabel('Growth rate (cm/day)', color='white')
ax2.set_title('Growth Rate (fastest at the midpoint)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The S-curve appears everywhere in biology:")
print("  - Individual plant growth")
print("  - Population growth (animals, bacteria)")
print("  - Epidemic spread (disease cases over time)")
print("  - Technology adoption (smartphones, internet)")`,
      challenge: 'Change k from 0.03 to 0.06. The plant grows faster but reaches the same max height. A bamboo can grow 91cm in a single day — what would its k value be?',
      successHint: 'The sigmoid curve is one of the most universal patterns in nature. Recognizing it in data — and knowing its parameters — is a core skill in biology, ecology, and data science.',
    },
    {
      title: 'Adaptation — why each plant form was different',
      concept: `Tejimola became four different plants: tulsi (herb), gourd (vine), lotus (aquatic), champa (tree). Each is adapted to a completely different environment. **Adaptation** means a species has evolved traits that help it survive in its specific habitat.

- **Tulsi**: aromatic oils repel insects, small size fits garden edges
- **Gourd vine**: tendrils grip supports, large leaves capture light in gaps
- **Lotus**: waxy leaves repel water (the "lotus effect"), roots in mud, stems in water
- **Champa tree**: deep roots for stability, height for light access, flowers attract pollinators

These adaptations didn't happen overnight — they evolved over millions of years through natural selection. Plants that had traits suited to their environment survived and reproduced; those that didn't were outcompeted.`,
      analogy: 'Adaptation is like different tools in a toolbox. A hammer, screwdriver, and wrench all solve different problems. They share a common ancestor (metal + handle) but evolved different shapes for different jobs. Plants share common ancestors but evolved different forms for different environments.',
      storyConnection: 'Each of Tejimola\'s forms was perfectly suited to where it grew: tulsi in the garden soil, gourd vine on the riverbank, lotus in the pond, champa tree in open ground. The story intuitively understood what biology confirms — different environments demand different designs.',
      checkQuestion: 'The lotus leaf is famous for being self-cleaning — water rolls off carrying dirt with it. This is called the "lotus effect." What physical property of the leaf surface causes this?',
      checkAnswer: 'Microscopic waxy bumps (papillae) on the leaf surface. Water droplets sit on the tips of these bumps, touching very little actual surface, so they roll off easily. This nanostructure has been copied by engineers for self-cleaning glass, paint, and fabrics — biomimicry again!',
      codeIntro: 'Compare adaptations of the four plants using a radar chart.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Adaptation scores (0-10) for each plant
categories = ['Water\\ntolerance', 'Height', 'Growth\\nspeed', 'Insect\\ndefense', 'Light\\nneeds', 'Root\\ndepth']
N = len(categories)

plants = {
    'Tulsi': [3, 2, 7, 9, 6, 3],
    'Gourd vine': [4, 5, 9, 3, 7, 4],
    'Lotus': [10, 3, 5, 2, 8, 6],
    'Champa tree': [4, 10, 3, 4, 9, 10],
}
colors = {'Tulsi': '#22c55e', 'Gourd vine': '#f59e0b', 'Lotus': '#3b82f6', 'Champa tree': '#a855f7'}

angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

for name, values in plants.items():
    values += values[:1]
    ax.plot(angles, values, 'o-', linewidth=2, label=name, color=colors[name])
    ax.fill(angles, values, alpha=0.1, color=colors[name])

ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories, color='white', fontsize=9)
ax.set_ylim(0, 10)
ax.set_yticks([2, 4, 6, 8, 10])
ax.set_yticklabels(['2', '4', '6', '8', '10'], color='gray', fontsize=7)
ax.tick_params(colors='gray')
ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_title('Plant Adaptation Profiles', color='white', fontsize=13, pad=20)

plt.tight_layout()
plt.show()

print("Each plant excels in different areas:")
print("  Tulsi: insect defense (aromatic oils)")
print("  Gourd: growth speed (reaches sunlight fast)")
print("  Lotus: water tolerance (aquatic specialist)")
print("  Champa: height + root depth (tree strategy)")`,
      challenge: 'Add a 5th plant to the chart: bamboo. What would its adaptation scores be? (Hint: bamboo grows incredibly fast, has moderate water tolerance, and can grow very tall.)',
      successHint: 'No plant is "best" at everything — adaptation is about trade-offs. Understanding these trade-offs is the foundation of ecology, agriculture, and conservation.',
    },
    {
      title: 'DNA — the instructions that make each plant unique',
      concept: `Why is tulsi different from a champa tree? They're both plants with cells and chloroplasts. The difference is in their **DNA** — the molecule that carries the instructions for building and running every organism.

DNA is a long chain of four chemical bases: **A** (adenine), **T** (thymine), **C** (cytosine), **G** (guanine). The sequence of these letters — like the letters in a book — spells out genes. Genes are instructions for building proteins. Proteins do everything: build cell walls, run photosynthesis, make flower colours, fight disease.

Key numbers:
- Tulsi genome: ~386 million base pairs
- Human genome: ~3.2 billion base pairs
- Wheat genome: ~17 billion base pairs (5× bigger than human!)

Genome size doesn't equal complexity. What matters is which genes are active, when, and where.`,
      analogy: 'DNA is like a recipe book. Every cell in the plant has the same complete cookbook. But a root cell only reads the "root recipes." A leaf cell reads the "leaf recipes." Same book, different chapters active in different cells. This selective reading is called gene expression.',
      storyConnection: 'Tejimola became four different plants — in the story, it was her spirit taking new forms. In biology, different DNA sequences produce different organisms. If Tejimola\'s cells had tulsi DNA, they\'d grow tulsi. Champa DNA → champa tree. The DNA IS the identity.',
      checkQuestion: 'Humans share about 60% of their DNA with bananas. Does that mean we\'re 60% banana?',
      checkAnswer: 'Not exactly. The shared 60% includes basic cellular machinery — genes for cell division, energy production, protein building. These processes are so fundamental that they haven\'t changed much since plants and animals diverged ~1.5 billion years ago. The 40% difference is what makes us human (and them delicious).',
      codeIntro: 'Generate random DNA sequences and analyze their composition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate a random DNA sequence
bases = ['A', 'T', 'C', 'G']
seq_length = 1000
dna = np.random.choice(bases, seq_length)

# Count base frequencies
counts = {b: np.sum(dna == b) for b in bases}

# In real DNA, A≈T and C≈G (Chargaff's rules)
# Let's compare random vs real
real_tulsi = {'A': 29.3, 'T': 29.5, 'C': 20.7, 'G': 20.5}  # approximate

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

colors_map = {'A': '#22c55e', 'T': '#ef4444', 'C': '#3b82f6', 'G': '#f59e0b'}

# Random sequence
ax1.set_facecolor('#111827')
bars1 = ax1.bar(counts.keys(), counts.values(), color=[colors_map[b] for b in counts.keys()])
ax1.set_title('Random DNA (equal probability)', color='white', fontsize=11)
ax1.set_ylabel('Count in 1000 bases', color='white')
ax1.tick_params(colors='gray')
for bar, count in zip(bars1, counts.values()):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5, f'{count/10:.1f}%',
             ha='center', color='white', fontsize=10)

# Real tulsi
ax2.set_facecolor('#111827')
bars2 = ax2.bar(real_tulsi.keys(), real_tulsi.values(), color=[colors_map[b] for b in real_tulsi.keys()])
ax2.set_title('Real Tulsi DNA (Chargaff\\'s rules)', color='white', fontsize=11)
ax2.set_ylabel('Percentage', color='white')
ax2.tick_params(colors='gray')
for bar, pct in zip(bars2, real_tulsi.values()):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3, f'{pct}%',
             ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Chargaff's rules: A≈T and C≈G (they pair together)")
print(f"  Tulsi: A={real_tulsi['A']}% ≈ T={real_tulsi['T']}% ✓")
print(f"  Tulsi: C={real_tulsi['C']}% ≈ G={real_tulsi['G']}% ✓")
print()
print("Random DNA doesn't follow Chargaff's rules.")
print("Real DNA does — because A always pairs with T,")
print("and C always pairs with G in the double helix.")`,
      challenge: 'Generate 100 random DNA sequences of length 100. For each, calculate the A/T ratio. Plot a histogram. Chargaff predicts it should be ~1.0 for real DNA. What does random DNA give?',
      successHint: 'From cells to photosynthesis to propagation to growth to adaptation to DNA — you\'ve traced the biology of life from Tejimola\'s garden to the molecular level. Level 2 goes deeper into genetics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior biology experience needed</span>
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
