import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function EriSilkLevel1() {
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
      title: 'Silk moth lifecycle — from egg to winged adult',
      concept: `The silk moth undergoes **complete metamorphosis** — four distinct life stages:

1. **Egg**: Tiny, flat, laid in clusters on host plant leaves. Incubation takes 8-10 days.
2. **Larva (caterpillar)**: The feeding stage. The silkworm eats voraciously for 25-30 days, molting (shedding skin) 4 times as it grows. It increases its body weight 10,000 times.
3. **Pupa (cocoon stage)**: The larva spins a cocoon from silk protein, sealing itself inside. Inside, the entire body dissolves and reorganizes into an adult moth. This takes 2-3 weeks.
4. **Adult moth**: Emerges from the cocoon, mates, lays eggs, and dies within 5-10 days. Adult silk moths cannot eat — they have no functional mouthparts.

The silk we use comes from the **cocoon** — the pupal case. A single cocoon contains 300-900 meters of continuous silk thread. In conventional sericulture (mulberry silk), the pupa is killed by boiling the cocoon to unravel the thread intact. In eri silk production, the moth is allowed to emerge first.`,
      analogy: 'Complete metamorphosis is like a total factory renovation. The caterpillar is Factory v1 — optimized for eating. It shuts down completely (cocoon), demolishes everything inside, and rebuilds from scratch as Factory v2 — optimized for flying and reproducing. Same raw materials, completely different product.',
      storyConnection: 'In "How the Eri Silk Moth Found Peace," the moth emerges from its cocoon into a world that lets it live. This moment — the eclosion (emergence from the cocoon) — is the climax of metamorphosis. The story celebrates what most silk production destroys: the moth\'s right to complete its lifecycle.',
      checkQuestion: 'If a silkworm increases its body weight 10,000 times in 30 days, and it starts at 0.5 milligrams, what does it weigh at the end? How much food must it consume?',
      checkAnswer: 'Final weight: 0.5 mg * 10,000 = 5,000 mg = 5 grams. Food consumed is much more — the caterpillar converts food to body mass at about 25% efficiency, so it eats roughly 20 grams of leaves. That\'s 40,000 times its starting weight in food. This is why silkworm farming requires enormous quantities of fresh leaves.',
      codeIntro: 'Model the growth curve of a silkworm through its larval instars.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Silkworm growth through 5 instars (larval stages)
# Each instar ends with a molt (skin shedding)
days = np.arange(0, 31)

# Weight in milligrams (exponential growth with step increases at molts)
molt_days = [0, 6, 11, 16, 21, 30]  # approximate molt timing
instar_weights = [0.5, 5, 50, 300, 1500, 5000]  # mg at start of each instar

weight = np.zeros(31)
for i in range(len(molt_days) - 1):
    start_d, end_d = molt_days[i], molt_days[i + 1]
    start_w, end_w = instar_weights[i], instar_weights[i + 1]
    for d in range(start_d, end_d):
        frac = (d - start_d) / (end_d - start_d)
        weight[d] = start_w * (end_w / start_w) ** frac
weight[30] = 5000

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Linear scale
ax1.set_facecolor('#111827')
ax1.plot(days, weight, color='#22c55e', linewidth=2)
ax1.fill_between(days, weight, alpha=0.1, color='#22c55e')
for i, (d, w) in enumerate(zip(molt_days[:-1], instar_weights[:-1])):
    ax1.axvline(d, color='#f59e0b', linestyle=':', linewidth=1, alpha=0.5)
    ax1.annotate(f'Instar {i+1}', xy=(d + 1, weight.max() * 0.9 - i * weight.max() * 0.1),
                 color='#f59e0b', fontsize=9)
ax1.set_xlabel('Days', color='white')
ax1.set_ylabel('Weight (mg)', color='white')
ax1.set_title('Silkworm Growth (Linear Scale)', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Log scale (reveals exponential nature)
ax2.set_facecolor('#111827')
ax2.semilogy(days, weight + 0.01, color='#3b82f6', linewidth=2)
ax2.fill_between(days, weight + 0.01, 0.01, alpha=0.1, color='#3b82f6')
for i, (d, w) in enumerate(zip(molt_days[:-1], instar_weights[:-1])):
    ax2.axvline(d, color='#f59e0b', linestyle=':', linewidth=1, alpha=0.5)
ax2.set_xlabel('Days', color='white')
ax2.set_ylabel('Weight (mg, log scale)', color='white')
ax2.set_title('Silkworm Growth (Log Scale)', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Silkworm growth by instar:")
for i in range(5):
    start_w = instar_weights[i]
    end_w = instar_weights[i + 1]
    print(f"  Instar {i+1} (days {molt_days[i]}-{molt_days[i+1]}): {start_w:.1f} -> {end_w:.1f} mg ({end_w/start_w:.0f}x increase)")
print(f"\\nTotal growth: {instar_weights[0]} mg -> {instar_weights[-1]} mg = {instar_weights[-1]/instar_weights[0]:,.0f}x increase")
print(f"That's like a 3.5 kg human baby growing to 35,000 kg (35 tonnes) in a month.")`,
      challenge: 'Add a "food consumed" line to the plot. Assume 25% efficiency (the worm eats 4x its weight gain in leaves). How many grams of leaves does one worm eat in its lifetime?',
      successHint: 'The silkworm\'s growth rate is one of the most extreme in the animal kingdom. Understanding each instar and molt is essential for timing silk production — and for understanding why eri silk requires a different approach.',
    },
    {
      title: 'Comparing silk types — muga, pat, eri, and tasar',
      concept: `India produces four major types of silk, each from a different moth species:

**Mulberry (pat) silk** — *Bombyx mori*
- Fed exclusively on mulberry leaves
- Produces the finest, whitest silk thread
- Longest continuous filament (900m per cocoon)
- The pupa is killed (boiled) to harvest intact thread
- 90% of world silk production

**Muga silk** — *Antheraea assamensis*
- Endemic to Assam (grows nowhere else naturally)
- Golden-yellow color, extremely durable
- Fed on som and soalu tree leaves
- Semi-domesticated (outdoor rearing)
- GI-tagged product of Assam

**Eri silk** — *Samia ricini*
- Fed on castor leaves (widely available)
- The moth is allowed to emerge before harvesting
- Cocoon is open-ended, so thread must be spun (not reeled)
- Called "peace silk" or "ahimsa silk"
- Warm, wool-like texture

**Tasar silk** — *Antheraea mylitta*
- Wild silk, collected from forests
- Copper-brown color
- Produced by tribal communities
- Rich in minerals, hypoallergenic`,
      analogy: 'The four silk types are like four types of paper: mulberry silk is premium printer paper (fine, uniform, mass-produced). Muga is handmade gold-leaf paper (rare, luxurious, specific origin). Eri is recycled craft paper (ethical, textured, versatile). Tasar is wild bark paper (natural, irregular, collected from nature). Same material class, totally different character.',
      storyConnection: 'The eri moth in our story "found peace" because it was allowed to live. This is the real distinction: mulberry silk requires killing the pupa; eri silk doesn\'t. The story is about an ethical choice — the same choice that makes eri silk the only truly cruelty-free silk. Muga silk, golden and proud, represents Assam\'s heritage; eri silk represents its conscience.',
      checkQuestion: 'Why can\'t eri silk be reeled like mulberry silk? What structural difference in the cocoon prevents this?',
      checkAnswer: 'The eri cocoon is open at one end — the moth spins it with an exit hole already built in. This means the silk thread is not one continuous filament but many short strands. Mulberry cocoons are sealed shut; the moth would have to dissolve the silk with enzymes to escape (which is why they\'re killed before that happens). Eri silk must be spun like cotton or wool — carded and twisted from short fibers.',
      codeIntro: 'Compare the four silk types across key properties.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Silk comparison data
silks = {
    'Mulberry (Pat)': {
        'fineness': 9, 'durability': 6, 'luster': 9, 'warmth': 5,
        'ethics': 2, 'availability': 9, 'color': '#f5f5dc'
    },
    'Muga': {
        'fineness': 7, 'durability': 9, 'luster': 10, 'warmth': 6,
        'ethics': 4, 'availability': 2, 'color': '#daa520'
    },
    'Eri': {
        'fineness': 5, 'durability': 7, 'luster': 4, 'warmth': 9,
        'ethics': 9, 'availability': 6, 'color': '#f5f5f5'
    },
    'Tasar': {
        'fineness': 6, 'durability': 8, 'luster': 6, 'warmth': 7,
        'ethics': 7, 'availability': 4, 'color': '#b87333'
    },
}

categories = ['Fineness', 'Durability', 'Luster', 'Warmth', 'Ethics\\nscore', 'Availability']
N = len(categories)
angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

plot_colors = {'Mulberry (Pat)': '#f5f5dc', 'Muga': '#daa520', 'Eri': '#22c55e', 'Tasar': '#b87333'}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Radar chart
ax1 = fig.add_subplot(121, polar=True)
ax1.set_facecolor('#111827')
for name, props in silks.items():
    values = [props['fineness'], props['durability'], props['luster'],
              props['warmth'], props['ethics'], props['availability']]
    values += values[:1]
    ax1.plot(angles, values, 'o-', linewidth=2, label=name, color=plot_colors[name])
    ax1.fill(angles, values, alpha=0.08, color=plot_colors[name])

ax1.set_xticks(angles[:-1])
ax1.set_xticklabels(categories, color='white', fontsize=9)
ax1.set_ylim(0, 10)
ax1.set_yticks([2, 4, 6, 8, 10])
ax1.set_yticklabels(['2', '4', '6', '8', '10'], color='gray', fontsize=7)
ax1.legend(loc='upper right', bbox_to_anchor=(1.35, 1.1), facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=9)
ax1.set_title('Silk Type Comparison', color='white', fontsize=13, pad=20)

# Production data (bar chart)
ax2 = fig.add_subplot(122)
ax2.set_facecolor('#111827')
silk_names = list(silks.keys())
production = [22000, 170, 6500, 2700]  # tonnes/year (approximate)
bar_colors = [plot_colors[n] for n in silk_names]
bars = ax2.bar(silk_names, production, color=bar_colors, width=0.6, edgecolor='none')
ax2.set_ylabel('Annual production (tonnes)', color='white')
ax2.set_title('Global Silk Production by Type', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.set_xticklabels(silk_names, color='white', fontsize=9, rotation=15)

for bar, p in zip(bars, production):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 300,
             f'{p:,}t', ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Silk comparison summary:")
print(f"  Mulberry: Finest thread, highest production, moth killed")
print(f"  Muga: Golden luster, Assam exclusive, semi-wild")
print(f"  Eri: Peace silk, warm, ethical, open cocoon")
print(f"  Tasar: Wild forest silk, tribal production")
print()
print("Ethics score reflects whether the moth survives:")
print("  Mulberry: 2/10 (pupa always killed)")
print("  Muga: 4/10 (some moths killed for reeling)")
print("  Eri: 9/10 (moth almost always emerges alive)")
print("  Tasar: 7/10 (moth often emerges, wild collection)")`,
      challenge: 'Research the price per meter of each silk type. Add a price axis to the comparison. Does higher ethics correlate with higher or lower price? Why?',
      successHint: 'Each silk type represents a different balance of quality, ethics, and economics. Understanding these trade-offs is essential for sustainable fashion — and for appreciating why eri silk occupies a unique ethical position.',
    },
    {
      title: 'Why eri is "peace silk" — the moth emerges alive',
      concept: `In conventional mulberry silk production, the cocoon is boiled or steamed with the pupa still inside. Why? Because when a moth emerges naturally, it secretes an enzyme called **cocoonase** that dissolves a hole in the silk. This breaks the continuous filament into short pieces, making it impossible to reel.

Eri silk is different for two reasons:

1. **Open cocoon structure**: The eri moth (*Samia ricini*) spins a cocoon that is open at one end — it has a built-in exit. The moth doesn't need to dissolve its way out. This means the silk thread is already in short segments.

2. **Spun, not reeled**: Because eri silk can't be reeled anyway (it's naturally discontinuous), there's no economic incentive to kill the moth. The silk is processed like cotton or wool — carded, drawn, and spun.

This makes eri silk the only major silk where the moth's survival is compatible with production. It is called:
- **Ahimsa silk** (ahimsa = non-violence in Sanskrit)
- **Peace silk**
- **Non-violent silk**

The Bodo, Mising, and other communities of Assam and Northeast India have practiced this ethical silk production for centuries — long before "sustainable fashion" became a buzzword.`,
      analogy: 'Imagine two ways to get honey. Method 1: destroy the hive, take all the honey, kill the bees. Method 2: the bees leave some honey at the entrance for you, and both you and the bees continue living. Eri silk is Method 2 — the moth builds its cocoon with a door, produces silk, and walks out alive. The silk is a byproduct of a life completed, not a life cut short.',
      storyConnection: 'The eri moth in our story "found peace" — it wasn\'t killed for its silk. This is the literal, biological truth of eri silk production. The open cocoon is the moth\'s escape hatch, evolved over millions of years. When humans chose to harvest eri silk without killing the moth, they aligned their industry with the moth\'s own biology.',
      checkQuestion: 'If eri silk is ethical and mulberry silk requires killing the moth, why hasn\'t eri silk replaced mulberry silk entirely?',
      checkAnswer: 'Three reasons: (1) Quality — mulberry silk has a longer, finer filament that produces smoother, shinier fabric. Eri silk is coarser and more wool-like. (2) Scale — mulberry silkworms are fully domesticated and easy to rear indoors; eri production is more labor-intensive. (3) Market preference — the luxury market values mulberry silk\'s sheen. However, as ethical consumerism grows, eri silk demand is rising. The question is whether ethics or aesthetics will win.',
      codeIntro: 'Compare the ethical and economic aspects of silk production methods.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Ethical comparison of silk production
methods = ['Mulberry\\n(conventional)', 'Mulberry\\n(peace method)', 'Eri silk\\n(traditional)', 'Synthetic\\n(polyester)']

# Scores (0-10) across ethical dimensions
metrics = {
    'Animal welfare': [1, 6, 9, 10],
    'Carbon footprint': [5, 5, 7, 2],
    'Biodegradability': [9, 9, 9, 1],
    'Worker welfare': [4, 5, 7, 3],
    'Water usage': [5, 5, 7, 2],
    'Cultural heritage': [6, 4, 9, 0],
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Stacked bar chart
ax1.set_facecolor('#111827')
colors_list = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
x = np.arange(len(methods))
width = 0.6
bottom = np.zeros(len(methods))

for (metric, values), color in zip(metrics.items(), colors_list):
    ax1.bar(x, values, width, bottom=bottom, label=metric, color=color, alpha=0.8)
    bottom += values

ax1.set_xticks(x)
ax1.set_xticklabels(methods, color='white', fontsize=9)
ax1.set_ylabel('Cumulative ethics score', color='white')
ax1.set_title('Ethical Scorecard by Production Method', color='white', fontsize=13)
ax1.legend(loc='upper left', facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Moth lifecycle comparison
ax2.set_facecolor('#111827')
stages = ['Egg', 'Larva', 'Pupa', 'Adult\\nmoth', 'Mate &\\nlay eggs']
mulberry_survival = [100, 95, 90, 0, 0]  # killed at pupa stage
eri_survival = [100, 92, 88, 85, 80]

ax2.plot(range(len(stages)), mulberry_survival, 'o-', color='#ef4444', linewidth=2,
         markersize=8, label='Mulberry (conventional)')
ax2.plot(range(len(stages)), eri_survival, 'o-', color='#22c55e', linewidth=2,
         markersize=8, label='Eri silk')

# Annotate the kill point
ax2.annotate('Cocoon boiled\\n(moth killed)', xy=(2.5, 45), xytext=(3, 60),
             color='#ef4444', fontsize=10, fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax2.fill_between(range(len(stages)), mulberry_survival, eri_survival,
                 alpha=0.1, color='#22c55e')
ax2.set_xticks(range(len(stages)))
ax2.set_xticklabels(stages, color='white', fontsize=10)
ax2.set_ylabel('Moth survival rate (%)', color='white')
ax2.set_title('Moth Survival: Mulberry vs Eri', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(-5, 110)

plt.tight_layout()
plt.show()

print("Key difference:")
print("  Mulberry silk: moth killed at pupa stage (0% reach adulthood)")
print("  Eri silk: ~85% of moths emerge and reproduce")
print()
print("Per 1 kg of silk produced:")
print("  Mulberry: ~5,000 pupae killed")
print("  Eri: ~0 moths killed (some die naturally)")
print()
print("The Bodo and Mising communities of Assam have practiced")
print("non-violent eri silk production for centuries — a living")
print("example of sustainable, ethical industry.")`,
      challenge: 'Research "peace silk" alternatives for mulberry: some producers let the moth emerge and then reel the broken cocoon. How does this affect thread quality and production cost? Is it a viable middle ground?',
      successHint: 'Eri silk proves that ethics and industry can coexist when the production system aligns with the organism\'s biology. The open cocoon isn\'t a design flaw — it\'s the feature that makes peace silk possible.',
    },
    {
      title: 'Protein chemistry of silk — fibroin and sericin',
      concept: `Silk is a **protein fiber** — one of the strongest natural materials known. It's made of two main proteins:

**Fibroin** (~75% of silk)
- The structural protein that forms the thread
- Made of repeating amino acid sequences: Glycine-Alanine-Glycine-Alanine-Serine-Glycine
- These sequences fold into **beta sheets** — flat, stacked structures held together by hydrogen bonds
- Beta sheets are incredibly strong because every strand reinforces its neighbors
- Tensile strength: 300-740 MPa (comparable to steel wire of the same diameter)

**Sericin** (~25% of silk)
- The glue that holds fibroin fibers together
- Water-soluble protein (removed during degumming)
- Acts as a protective coating on the cocoon
- Has antioxidant and antimicrobial properties

The key to silk's strength is the **beta sheet structure**. Unlike most proteins (which fold into complex 3D shapes), fibroin forms flat sheets that stack like pages in a book. Each "page" is hydrogen-bonded to the next. This gives silk a combination of strength and flexibility that synthetic fibers struggle to match.

Silk's strength-to-weight ratio exceeds steel. Spider silk (a related protein) is the strongest natural fiber known.`,
      analogy: 'Fibroin beta sheets are like plywood. A single sheet of wood veneer is weak. But when you stack many thin sheets and glue them together with the grain alternating directions, you get plywood — stronger than any single sheet. Fibroin beta sheets stack the same way: each sheet is thin and flexible alone, but stacked together they form an incredibly strong fiber.',
      storyConnection: 'The silk the eri moth spins is a protein masterpiece — amino acids arranged in a precise sequence that folds into beta sheets that form fibers stronger than steel by weight. The moth in our story found peace; the silk it left behind is a material that human chemists still can\'t fully replicate. Nature\'s chemistry is often ahead of ours.',
      checkQuestion: 'Silk is a protein, and proteins are made of amino acids. If you ate a silk scarf, could your body digest and use those amino acids for nutrition?',
      checkAnswer: 'Technically yes — silk fibroin is a protein and your digestive enzymes (proteases) can break it down into amino acids. However, silk is extremely resistant to digestion because the tightly packed beta sheets are hard for enzymes to access. It would pass through mostly intact. Interestingly, medical researchers use silk fibroin for biodegradable implants precisely because it degrades slowly and predictably inside the body.',
      codeIntro: 'Visualize the amino acid composition of silk fibroin and compare silk\'s strength to other materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Amino acid composition of silk fibroin
amino_acids = ['Glycine', 'Alanine', 'Serine', 'Tyrosine', 'Valine', 'Others']
composition = [42.8, 30.0, 12.2, 4.8, 2.5, 7.7]  # percentage
colors_aa = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#6b7280']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Amino acid pie chart
ax1.set_facecolor('#111827')
wedges, texts, autotexts = ax1.pie(composition, labels=amino_acids, autopct='%1.1f%%',
    colors=colors_aa, pctdistance=0.75, labeldistance=1.15,
    textprops={'color': 'white', 'fontsize': 9})
for autotext in autotexts:
    autotext.set_color('white')
    autotext.set_fontsize(8)
ax1.set_title('Amino Acid Composition of Silk Fibroin', color='white', fontsize=12)

# Strength comparison (tensile strength in MPa)
ax2.set_facecolor('#111827')
materials = ['Cotton', 'Wool', 'Nylon', 'Eri silk', 'Mulberry\\nsilk', 'Spider\\nsilk', 'Kevlar', 'Steel\\nwire']
strengths = [400, 200, 900, 500, 600, 1400, 3600, 800]
mat_colors = ['#f5f5dc', '#d2b48c', '#6b7280', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7']

bars = ax2.bar(materials, strengths, color=mat_colors, width=0.6)
ax2.set_ylabel('Tensile strength (MPa)', color='white')
ax2.set_title('Tensile Strength: Silk vs Other Materials', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_xticklabels(materials, color='white', fontsize=8, rotation=15)

for bar, s in zip(bars, strengths):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 30,
             f'{s}', ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Silk fibroin key facts:")
print("  - 73% of amino acids are just glycine + alanine (tiny amino acids)")
print("  - Small amino acids pack tightly into beta sheets")
print("  - Beta sheets give silk its tensile strength")
print()
print("Strength-to-weight comparison (specific strength):")
silk_density = 1.3  # g/cm3
steel_density = 7.8
print(f"  Silk: {600/silk_density:.0f} MPa/(g/cm3)")
print(f"  Steel: {800/steel_density:.0f} MPa/(g/cm3)")
print(f"  Silk is {(600/silk_density)/(800/steel_density):.1f}x stronger than steel per unit weight!")`,
      challenge: 'Spider silk is even stronger than silkworm silk. Research why we can\'t farm spiders for silk the way we farm silkworms. (Hint: it involves spider behavior.) What are researchers doing to solve this?',
      successHint: 'Silk is one of nature\'s most remarkable materials — a protein fiber spun at room temperature that rivals synthetic materials made at high temperatures and pressures. Understanding its chemistry opens doors to bio-inspired materials science.',
    },
    {
      title: 'Sustainable fashion — why materials matter',
      concept: `The fashion industry is the second most polluting industry on Earth (after oil). Key problems:

**Water usage**: Growing cotton for one t-shirt requires ~2,700 liters of water. Polyester uses less water but requires petroleum.

**Chemical pollution**: Dyeing and finishing textiles releases heavy metals, formaldehyde, and other toxins into waterways. 20% of global water pollution comes from textile treatment.

**Carbon emissions**: Fashion accounts for ~10% of global CO2 emissions — more than international flights and shipping combined.

**Waste**: 85% of textiles end up in landfills. Synthetic fabrics (polyester, nylon) take 200+ years to decompose. Natural fibers (cotton, silk, wool) biodegrade in months.

Where does silk fit?
- **Natural fiber**: biodegradable, renewable
- **Low water**: silkworms need far less water than cotton fields
- **Durable**: silk garments last decades if cared for
- **Eri silk bonus**: ethical production, castor plant (host) grows on marginal land without irrigation, supports rural livelihoods

Eri silk from Northeast India represents a model of sustainable fashion: ethical, biodegradable, low-water, and culturally rooted.`,
      analogy: 'Choosing a fabric is like choosing an energy source. Polyester is like coal — cheap, abundant, but dirty and persistent. Cotton is like natural gas — better, but still resource-intensive. Eri silk is like solar power — renewable, clean, but currently more expensive and less widely available. The transition from fast fashion to sustainable fashion mirrors the energy transition.',
      storyConnection: 'The eri moth in our story found peace — but the peace extends beyond the moth. Eri silk production is at peace with the land (castor grows without irrigation), with the water (minimal chemical processing), with the workers (home-based, traditional skill), and with the future (biodegradable). The story\'s peace is ecological peace.',
      checkQuestion: 'If a polyester shirt costs $10 and an eri silk shirt costs $50, but the polyester pollutes water, emits more CO2, and takes 200 years to decompose, which is actually cheaper?',
      checkAnswer: 'The polyester shirt has hidden costs (externalities): water treatment to clean the pollution ($2-5), carbon removal ($1-3), landfill management ($0.50), health costs from microplastics ($unknown). If you include externalities, polyester might cost $15-20 in real terms. Eri silk at $50 is still more expensive, but the gap shrinks. And eri silk lasts 5-10x longer than polyester, so cost-per-year may actually favor silk.',
      codeIntro: 'Compare the environmental footprint of different fabric types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Environmental impact comparison per kg of fabric
fabrics = ['Polyester', 'Cotton', 'Nylon', 'Mulberry\\nsilk', 'Eri silk', 'Organic\\ncotton']

# Data (approximate values from lifecycle analyses)
water_use = [17, 10000, 30, 3000, 1500, 7000]  # liters per kg
co2_kg = [5.5, 8.0, 7.6, 4.0, 2.5, 3.8]  # kg CO2 per kg fabric
decomp_years = [200, 0.5, 200, 0.3, 0.3, 0.5]  # years to biodegrade
toxicity = [3, 6, 5, 4, 2, 3]  # relative toxicity score (1-10)

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

colors_fab = ['#ef4444', '#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#22c55e']

# Water usage
ax1.set_facecolor('#111827')
bars1 = ax1.bar(fabrics, water_use, color=colors_fab, width=0.6)
ax1.set_ylabel('Liters per kg', color='white')
ax1.set_title('Water Usage', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.set_xticklabels(fabrics, color='white', fontsize=8)
ax1.set_yscale('log')
for bar, w in zip(bars1, water_use):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() * 1.2,
             f'{w:,}', ha='center', color='white', fontsize=8)

# CO2 emissions
ax2.set_facecolor('#111827')
bars2 = ax2.bar(fabrics, co2_kg, color=colors_fab, width=0.6)
ax2.set_ylabel('kg CO2 per kg fabric', color='white')
ax2.set_title('Carbon Emissions', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_xticklabels(fabrics, color='white', fontsize=8)
for bar, c in zip(bars2, co2_kg):
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.15,
             f'{c}', ha='center', color='white', fontsize=9)

# Decomposition time
ax3.set_facecolor('#111827')
bars3 = ax3.bar(fabrics, decomp_years, color=colors_fab, width=0.6)
ax3.set_ylabel('Years to decompose', color='white')
ax3.set_title('Biodegradability', color='white', fontsize=12)
ax3.tick_params(colors='gray')
ax3.set_xticklabels(fabrics, color='white', fontsize=8)
ax3.set_yscale('log')
for bar, d in zip(bars3, decomp_years):
    label = f'{d:.0f}yr' if d >= 1 else f'{d*12:.0f}mo'
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() * 1.3,
             label, ha='center', color='white', fontsize=9)

# Overall sustainability score (inverse of negative impacts)
ax4.set_facecolor('#111827')
# Normalize each metric to 0-10 (lower impact = higher score)
norm_water = [10 * (1 - w/max(water_use)) for w in water_use]
norm_co2 = [10 * (1 - c/max(co2_kg)) for c in co2_kg]
norm_decomp = [10 * (1 - min(d, 10)/10) for d in decomp_years]  # cap at 10 years
norm_tox = [10 * (1 - t/max(toxicity)) for t in toxicity]
overall = [(w + c + d + t)/4 for w, c, d, t in zip(norm_water, norm_co2, norm_decomp, norm_tox)]

bars4 = ax4.bar(fabrics, overall, color=colors_fab, width=0.6)
ax4.set_ylabel('Sustainability score (0-10)', color='white')
ax4.set_title('Overall Sustainability Rating', color='white', fontsize=12)
ax4.tick_params(colors='gray')
ax4.set_xticklabels(fabrics, color='white', fontsize=8)
for bar, o in zip(bars4, overall):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
             f'{o:.1f}', ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Sustainability ranking (higher = better):")
ranked = sorted(zip(fabrics, overall), key=lambda x: x[1], reverse=True)
for i, (fab, score) in enumerate(ranked):
    print(f"  {i+1}. {fab.replace(chr(10), ' ')}: {score:.1f}/10")
print()
print("Eri silk scores highest because:")
print("  - Low water usage (castor needs no irrigation)")
print("  - Low carbon (no industrial heating)")
print("  - Fully biodegradable (months, not centuries)")
print("  - Low toxicity (minimal chemical processing)")`,
      challenge: 'Add "recycled polyester" to the comparison. Recycled polyester uses less water and energy than virgin polyester but still doesn\'t biodegrade. Where does it rank? Is recycling enough, or do we need to switch base materials?',
      successHint: 'Sustainable fashion isn\'t just about one metric — it\'s about the full lifecycle. Eri silk excels across multiple dimensions because its entire production system is rooted in biology, not petrochemistry.',
    },
    {
      title: 'Ethical manufacturing — from principle to practice',
      concept: `"Ethical manufacturing" means producing goods in a way that respects:
- **Workers**: fair wages, safe conditions, reasonable hours
- **Animals**: minimal suffering, respect for life
- **Environment**: minimal pollution, sustainable resource use
- **Communities**: supporting local economies, preserving cultural practices

Eri silk production in Northeast India scores well on all four:

**Workers**: Production is home-based, often by women in rural communities. Income stays local. The skill is passed through generations — it's cultural preservation AND economic activity.

**Animals**: The moth lives. Full stop. No other major silk achieves this.

**Environment**: Castor plant (the eri moth's food) grows on marginal land that can't support other crops. No pesticides needed. No irrigation required. Processing uses minimal chemicals.

**Communities**: Eri silk production supports Bodo, Mising, Karbi, and other indigenous communities. It provides income without requiring migration to cities or abandoning traditional knowledge.

The challenge: scaling ethical production without losing what makes it ethical. As demand grows, there's pressure to industrialize — bigger farms, faster processing, lower costs. This can erode the very qualities that make eri silk special.`,
      analogy: 'Ethical manufacturing is like organic farming vs. industrial agriculture. Organic farms produce less per acre but healthier food with less environmental damage. Industrial farms produce more but at hidden costs (soil depletion, chemical runoff, worker exploitation). Eri silk is the "organic" of the silk world — smaller scale, higher quality, lower impact.',
      storyConnection: 'The peace in our story isn\'t just the moth\'s peace — it\'s the weaver\'s peace of mind, the community\'s economic peace, and the environment\'s ecological peace. Ethical manufacturing creates a chain of well-being: healthy ecosystem → healthy moth → ethical harvest → fair income → preserved culture. Break any link and the chain fails.',
      checkQuestion: 'A big fashion brand wants to buy 10 tonnes of eri silk per year. Current village production is 50 kg per year per community. How many communities would they need? What risks does scaling to meet this demand pose?',
      checkAnswer: '10,000 kg / 50 kg = 200 communities needed. Risks: (1) Communities might be pressured to overproduce, compromising quality and moth welfare. (2) Middlemen might extract most of the profit. (3) Monoculture castor farming could replace diverse agriculture. (4) Cultural practices might be standardized for efficiency, losing local variation. The solution is cooperative models where communities control production and pricing.',
      codeIntro: 'Model the economics of eri silk production at different scales.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Eri silk economics model
# Village-level to industrial-scale comparison

scales = np.array([10, 50, 100, 500, 1000, 5000, 10000])  # kg/year production
labels = ['Tiny\\nvillage', 'Village', 'Large\\nvillage', 'Co-op', 'Small\\nfactory', 'Medium\\nfactory', 'Large\\nfactory']

# Revenue per kg (price decreases at scale due to commoditization)
price_per_kg = 5000 * np.exp(-scales / 5000) + 1500  # INR/kg

# Cost per kg (decreases with scale, but ethical costs add premium)
base_cost = 4000 * np.exp(-scales / 2000) + 800
ethical_premium = np.where(scales < 500, 200, np.where(scales < 2000, 400, 800))
total_cost = base_cost + ethical_premium

# Profit per kg
profit = price_per_kg - total_cost

# Ethics score (decreases with scale)
ethics = 10 * np.exp(-scales / 3000) + 1

# Worker income (per worker per month)
workers_needed = scales / 2  # 2 kg per worker per year
total_revenue = scales * price_per_kg
worker_income = total_revenue / workers_needed / 12  # monthly

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Price vs scale
ax1.set_facecolor('#111827')
ax1.semilogx(scales, price_per_kg, 'o-', color='#22c55e', linewidth=2, label='Price/kg')
ax1.semilogx(scales, total_cost, 'o-', color='#ef4444', linewidth=2, label='Cost/kg')
ax1.fill_between(scales, price_per_kg, total_cost, where=price_per_kg > total_cost,
                 alpha=0.15, color='#22c55e')
ax1.set_xlabel('Production scale (kg/year)', color='white')
ax1.set_ylabel('INR per kg', color='white')
ax1.set_title('Price vs Cost at Different Scales', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Profit margin
ax2.set_facecolor('#111827')
margin = (profit / price_per_kg) * 100
ax2.semilogx(scales, margin, 'o-', color='#f59e0b', linewidth=2)
ax2.axhline(0, color='#ef4444', linestyle='--', linewidth=1)
ax2.set_xlabel('Production scale (kg/year)', color='white')
ax2.set_ylabel('Profit margin (%)', color='white')
ax2.set_title('Profit Margin vs Scale', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Ethics score
ax3.set_facecolor('#111827')
ax3.semilogx(scales, ethics, 'o-', color='#a855f7', linewidth=2)
ax3.fill_between(scales, ethics, alpha=0.1, color='#a855f7')
ax3.set_xlabel('Production scale (kg/year)', color='white')
ax3.set_ylabel('Ethics score (0-10)', color='white')
ax3.set_title('Ethics Score vs Scale', color='white', fontsize=12)
ax3.tick_params(colors='gray')
ax3.set_ylim(0, 12)

# Worker monthly income
ax4.set_facecolor('#111827')
ax4.semilogx(scales, worker_income, 'o-', color='#3b82f6', linewidth=2)
ax4.axhline(5000, color='#f59e0b', linestyle='--', linewidth=1, label='Minimum living wage')
ax4.set_xlabel('Production scale (kg/year)', color='white')
ax4.set_ylabel('Monthly income (INR)', color='white')
ax4.set_title('Worker Income vs Scale', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The ethical manufacturing dilemma:")
print()
optimal_idx = np.argmax(profit * ethics)
print(f"Optimal balance point: ~{scales[optimal_idx]} kg/year")
print(f"  Price: INR {price_per_kg[optimal_idx]:.0f}/kg")
print(f"  Profit margin: {margin[optimal_idx]:.0f}%")
print(f"  Ethics score: {ethics[optimal_idx]:.1f}/10")
print(f"  Worker income: INR {worker_income[optimal_idx]:.0f}/month")
print()
print("Key insight: the sweet spot is cooperative-scale production")
print("(~500 kg/year) — big enough for decent income, small enough")
print("to maintain ethical standards and community control.")`,
      challenge: 'Add a "brand premium" scenario: what if ethical branding lets eri silk command 2x the base price? How does this shift the economics? Model the impact of fair-trade certification on viability.',
      successHint: 'From moth lifecycle to silk types to peace silk to protein chemistry to sustainable fashion to ethical manufacturing — you\'ve traced the complete story of eri silk from biology to economics. Level 2 goes deeper into materials science, lifecycle analysis, and the circular economy.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior biology or chemistry experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biology and sustainability simulations. Click to start.</p>
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