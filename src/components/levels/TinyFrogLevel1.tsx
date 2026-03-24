import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function TinyFrogLevel1() {
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

  const miniLessons = [
    {
      title: 'Amphibian biology — the dual-life animals',
      concept: `**Amphibians** (from Greek *amphi* = both, *bios* = life) live in two worlds: water and land. The three orders are:

- **Anura** (frogs and toads): ~7,000+ species. Tailless as adults, powerful legs for jumping.
- **Urodela** (salamanders and newts): ~700+ species. Keep their tails, walk rather than jump.
- **Gymnophiona** (caecilians): ~200+ species. Legless, worm-like, burrowing. Most people have never seen one.

**Key amphibian features:**
- **Permeable skin**: amphibians breathe partly through their skin. This means they absorb water AND toxins directly — making them extremely sensitive to pollution.
- **Ectothermic**: body temperature depends on environment (not internally regulated like mammals)
- **Tied to water**: most need water for reproduction (eggs lack shells)
- **Metamorphosis**: most transform from aquatic larva (tadpole) to terrestrial adult

NE India is an amphibian hotspot with over 100 described frog species, including several miniaturized species smaller than a thumbnail.`,
      analogy: 'Amphibians are like dual-SIM phones — they operate on two networks (water and land). Their permeable skin is like having no case on your phone: great for connectivity (gas exchange), but terrible for protection (pollution, dehydration).',
      storyConnection: 'The tiny frog of the rainforest lives in a world measured in centimeters: a leaf is a platform, a dewdrop is a swimming pool, a raindrop is a bowling ball. Understanding amphibian biology explains why these miniature creatures exist and how they survive in the leaf litter of NE India\'s forests.',
      checkQuestion: 'Why are amphibians considered the "canary in the coal mine" for environmental health?',
      checkAnswer: 'Their permeable skin absorbs pollutants directly from water and air. Their aquatic eggs and larvae are exposed to water quality changes. Their dual lifestyle means they\'re affected by both terrestrial and aquatic threats. A declining amphibian population is often the first warning sign of environmental degradation — they detect problems before we do.',
      codeIntro: 'Visualize amphibian diversity and the decline crisis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Amphibian diversity and decline
orders = ['Frogs\\n(Anura)', 'Salamanders\\n(Urodela)', 'Caecilians\\n(Gymnophiona)']
species_counts = [7300, 750, 215]
threatened_pct = [41, 51, 45]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Species diversity
ax1.set_facecolor('#111827')
colors = ['#22c55e', '#3b82f6', '#f59e0b']
bars = ax1.bar(range(3), species_counts, color=colors, alpha=0.85)
ax1.set_xticks(range(3))
ax1.set_xticklabels(orders, color='white', fontsize=9)
ax1.set_ylabel('Number of known species', color='white')
ax1.set_title('Amphibian Diversity by Order', color='white', fontsize=13)
ax1.tick_params(colors='gray')

for bar, count, threat in zip(bars, species_counts, threatened_pct):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 100,
             f'{count:,}', ha='center', color='white', fontsize=10)
    # Threatened portion
    threat_height = count * threat / 100
    ax1.bar(bar.get_x(), threat_height, bar.get_width(),
            color='#ef4444', alpha=0.4, bottom=count - threat_height)

ax1.text(2.5, 6000, 'Red = threatened', color='#ef4444', fontsize=8)

# Decline over time
ax2.set_facecolor('#111827')
decades = np.arange(1980, 2030, 1)
# Global amphibian population index (relative to 1980)
pop_index = 100 * np.exp(-0.02 * (decades - 1980))
# Major decline events
pop_index[10:] *= 0.85  # Chytrid fungus impact ~1990
pop_index[25:] *= 0.90  # Accelerated habitat loss

ax2.plot(decades, pop_index, color='#22c55e', linewidth=2)
ax2.fill_between(decades, pop_index, alpha=0.15, color='#22c55e')
ax2.axhline(100, color='gray', linestyle=':', linewidth=0.5)

ax2.annotate('Chytrid fungus\\nspread globally', xy=(1990, pop_index[10]),
             xytext=(1995, 80), color='#ef4444', fontsize=8,
             arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Population index (1980 = 100)', color='white')
ax2.set_title('Global Amphibian Decline', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Amphibian crisis:")
print(f"  Total species: ~{sum(species_counts):,}")
print(f"  Threatened: ~41% of all amphibians (worst of any vertebrate group)")
print(f"  Extinct since 1980: ~200+ species confirmed")
print(f"  Main threats: habitat loss, chytrid fungus, pollution, climate change")
print()
print("NE India: 100+ frog species, many undescribed")
print("New species are still being discovered every year.")`,
      challenge: 'NE India\'s frog diversity is still poorly surveyed. If 100 species are known and the typical discovery rate suggests 30% more are undescribed, how many species might actually exist? What does this mean for conservation of "unknown" species?',
      successHint: 'Amphibians are the most threatened vertebrate group on Earth. Understanding their biology is the first step toward protecting them — and protecting them means protecting the ecosystems we all depend on.',
    },
    {
      title: 'Metamorphosis — transforming body plan',
      concept: `**Metamorphosis** is one of biology's most dramatic transformations: a legless, gilled, aquatic tadpole becomes a legged, lunged, terrestrial frog. Nearly every organ system is rebuilt.

**What changes during frog metamorphosis:**
- **Tail**: reabsorbed (the cells are eaten by the frog's own immune system — programmed cell death, or apoptosis)
- **Legs**: grow from limb buds that were dormant in the tadpole
- **Gills**: replaced by lungs (and the permeable skin takes over significant gas exchange)
- **Mouth**: widens enormously; jaw structure changes from herbivore to carnivore
- **Gut**: shortens dramatically (herbivore diet → carnivore diet; carnivores need shorter guts)
- **Eyes**: move from sides to top of head (for predator detection on land)
- **Skin**: develops glands (mucus and poison glands)

The trigger: **thyroid hormones** (T3 and T4). A surge of thyroid hormone activates the entire metamorphic program. Artificially adding thyroid hormone can trigger premature metamorphosis; blocking it can create permanent tadpoles (neoteny).`,
      analogy: 'Metamorphosis is like renovating a submarine into a car while it\'s still moving. You swap the propeller for wheels, replace the periscope with a windshield, trade the ballast tanks for an engine — and the "driver" (the frog\'s nervous system) has to keep functioning throughout. It\'s the most extreme makeover in the animal kingdom.',
      storyConnection: 'The tiny frog of our story was once a tadpole in a puddle — aquatic, herbivorous, gill-breathing. In just weeks, it transformed into a terrestrial, carnivorous, lung-breathing hunter barely larger than a fingernail. Metamorphosis is the bridge between the frog\'s two lives.',
      checkQuestion: 'Some salamanders (axolotls) never metamorphose — they remain in larval form their entire lives but can still reproduce. What does this tell us about metamorphosis?',
      checkAnswer: 'Metamorphosis is not required for maturity — it\'s a developmental program that can be decoupled from sexual maturation. Axolotls have a mutation that reduces thyroid hormone sensitivity, so they never trigger the metamorphic program. If you inject them with thyroid hormone, they DO metamorphose. This shows metamorphosis is controlled by a simple hormonal switch, not hard-wired inevitability.',
      codeIntro: 'Model the metamorphic timeline and the role of thyroid hormones.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Metamorphosis timeline (typical for a small tropical frog)
days = np.arange(0, 60, 0.5)

# Thyroid hormone level (surge at metamorphic climax)
thyroid = 0.5 + 9.5 / (1 + np.exp(-0.3 * (days - 35)))

# Organ changes (percentage completion)
tail_length = 100 * (1 - 1 / (1 + np.exp(-0.5 * (days - 40))))
leg_length = 100 / (1 + np.exp(-0.3 * (days - 30)))
gill_function = 100 * (1 - 1 / (1 + np.exp(-0.4 * (days - 38))))
lung_function = 100 / (1 + np.exp(-0.3 * (days - 36)))
gut_length = 100 - 60 / (1 + np.exp(-0.3 * (days - 38)))

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 8))
fig.patch.set_facecolor('#1f2937')

# Thyroid hormone
ax1.set_facecolor('#111827')
ax1.plot(days, thyroid, color='#ef4444', linewidth=2, label='Thyroid hormone (T3/T4)')
ax1.fill_between(days, thyroid, alpha=0.15, color='#ef4444')
ax1.axvspan(30, 45, alpha=0.1, color='#f59e0b')
ax1.text(37.5, 8, 'Metamorphic\\nclimax', ha='center', color='#f59e0b', fontsize=9)

ax1.set_xlabel('Days after hatching', color='white')
ax1.set_ylabel('Hormone level (relative)', color='white')
ax1.set_title('Thyroid Hormone: The Metamorphosis Trigger', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Organ transitions
ax2.set_facecolor('#111827')
ax2.plot(days, tail_length, color='#ef4444', linewidth=2, label='Tail (reabsorbing)')
ax2.plot(days, leg_length, color='#22c55e', linewidth=2, label='Legs (growing)')
ax2.plot(days, gill_function, color='#3b82f6', linewidth=2, label='Gills (declining)')
ax2.plot(days, lung_function, color='#f59e0b', linewidth=2, label='Lungs (developing)')
ax2.plot(days, gut_length, color='#a855f7', linewidth=2, label='Gut length (shortening)')

ax2.axvspan(30, 45, alpha=0.05, color='#f59e0b')

# Stage labels
stages = [(5, 'Tadpole', '#3b82f6'), (20, 'Pre-metamorphosis', '#f59e0b'),
          (37, 'Climax', '#ef4444'), (50, 'Froglet', '#22c55e')]
for day, label, color in stages:
    ax2.axvline(day, color=color, linestyle=':', linewidth=0.5, alpha=0.5)
    ax2.text(day, 105, label, color=color, fontsize=7, ha='center')

ax2.set_xlabel('Days after hatching', color='white')
ax2.set_ylabel('Percentage of final/initial', color='white')
ax2.set_title('Organ System Transitions During Metamorphosis', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 115)

plt.tight_layout()
plt.show()

print("Metamorphosis timeline (typical small tropical frog):")
print("  Day 0-15: tadpole stage (herbivore, gills, tail)")
print("  Day 15-30: pre-metamorphosis (limb buds growing)")
print("  Day 30-45: metamorphic climax (rapid transformation)")
print("  Day 45+: froglet (terrestrial carnivore)")
print()
print("The entire transformation takes ~6 weeks.")
print("During climax, the tadpole doesn't eat — it lives on")
print("nutrients recycled from its own tail (biological recycling).")`,
      challenge: 'What if you could block thyroid hormone at day 20? Model a "permanent tadpole" scenario where thyroid stays at baseline level. What happens to leg growth and tail reabsorption?',
      successHint: 'Metamorphosis demonstrates that body plan is not fixed — it can be radically rewritten by hormonal signals. The same thyroid hormones control human development too (thyroid disorders cause developmental problems). The principles are universal.',
    },
    {
      title: 'Miniaturization in evolution — why tiny frogs exist',
      concept: `NE India is home to some of the world's smallest frogs. *Nyctibatrachus minimus* from the Western Ghats is just 10mm long. Several species from NE India are under 15mm. Why does evolution produce such tiny vertebrates?

**Advantages of being small:**
- **Exploit micro-niches**: tiny frogs live in leaf litter, moss, and tree bark crevices where larger predators can't reach
- **Reduced food needs**: a 10mm frog eats tiny mites and springtails that larger frogs ignore
- **Faster reproduction**: smaller body = shorter development time = more generations per year
- **Hide more easily**: harder for predators to detect

**Costs of being small:**
- **Desiccation risk**: high surface-area-to-volume ratio means rapid water loss
- **Temperature sensitivity**: small bodies heat and cool rapidly (hard to maintain stable temperature)
- **Limited organs**: some miniaturized frogs have lost toes, teeth, or even middle ear bones — the body simply can't fit them
- **Fewer eggs**: small body = small egg clutch (often just 2-5 eggs vs. thousands for larger frogs)

Miniaturization isn't just "being small" — it requires redesigning the entire body plan to function at a fraction of normal size.`,
      analogy: 'Miniaturization in frogs is like shrinking a smartphone — you can\'t just make everything smaller, because some components have minimum functional sizes. A frog needs a brain, eyes, ears, and organs that have physical size limits. Something has to go. Miniaturized frogs are like phones that dropped the headphone jack — they sacrificed non-essential features to achieve a smaller size.',
      storyConnection: 'The tiny frog of the rainforest is small enough to sit on a thumbnail. It didn\'t just shrink — it was redesigned by evolution to function at extreme small scale. Every organ was re-optimized, some were lost, and new survival strategies emerged.',
      checkQuestion: 'The smallest frog (*Paedophryne amauensis* from Papua New Guinea) is 7.7mm long. It\'s also the smallest known vertebrate. Is there a minimum possible size for a vertebrate?',
      checkAnswer: 'Probably around 6-8mm for a frog. Below this, the nervous system can\'t fit enough neurons for basic functions, the skeleton can\'t be mineralized at such small scales, and the surface-area-to-volume ratio makes water loss unmanageable. Insects can be much smaller because their body plan (exoskeleton, tracheal breathing, open circulatory system) works at smaller scales than the vertebrate plan.',
      codeIntro: 'Explore the scaling laws that govern miniaturization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Scaling with body size
body_length = np.linspace(5, 100, 200)  # mm

# Surface area scales as length^2, volume scales as length^3
surface_area = body_length ** 2  # relative
volume = body_length ** 3  # relative
sa_to_vol = surface_area / volume  # decreases with size

# Water loss rate proportional to SA/V
water_loss = 10 * sa_to_vol  # relative units

# Brain volume as fraction of body
# Miniaturized frogs have disproportionately large brains
brain_fraction = 0.05 + 0.15 * np.exp(-0.05 * body_length)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# SA to volume ratio
ax1.set_facecolor('#111827')
ax1.plot(body_length, sa_to_vol / sa_to_vol[0] * 100, color='#ef4444', linewidth=2, label='SA:Volume ratio')
ax1.plot(body_length, water_loss / water_loss[0] * 100, color='#3b82f6', linewidth=2, label='Water loss rate')

# Mark key species sizes
species = [
    (7.7, 'Paedophryne\\n(smallest)', '#ef4444'),
    (12, 'NE India\\nminiature', '#f59e0b'),
    (30, 'Common\\ntree frog', '#22c55e'),
    (80, 'Bullfrog', '#3b82f6'),
]
for size, name, color in species:
    y = (size**2 / size**3) / sa_to_vol[0] * 100
    ax1.plot(size, y, 'o', color=color, markersize=8)
    ax1.annotate(name, xy=(size, y), xytext=(size+3, y+5),
                 color=color, fontsize=7)

ax1.set_xlabel('Body length (mm)', color='white')
ax1.set_ylabel('Relative value (smallest = 100)', color='white')
ax1.set_title('The Curse of Being Small: Surface Area to Volume', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# What miniaturized frogs lose
ax2.set_facecolor('#111827')
features = ['Toe\\ncount', 'Teeth', 'Middle\\near bone', 'Finger\\npads', 'Egg\\ncount', 'Color\\npatterns']
normal_frog = [10, 10, 10, 10, 10, 10]
mini_frog = [7, 3, 2, 6, 2, 5]

x = np.arange(len(features))
width = 0.35
ax2.bar(x - width/2, normal_frog, width, color='#22c55e', alpha=0.85, label='Normal frog')
ax2.bar(x + width/2, mini_frog, width, color='#f59e0b', alpha=0.85, label='Miniaturized frog')

ax2.set_xticks(x)
ax2.set_xticklabels(features, color='white', fontsize=9)
ax2.set_ylabel('Feature complexity (0-10)', color='white')
ax2.set_title('What Miniaturized Frogs Lose', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Miniaturization trade-offs:")
print("  7.7mm frog vs 80mm frog:")
print(f"    SA:Volume ratio: {(7.7**2/7.7**3) / (80**2/80**3):.1f}x higher")
print(f"    Water loss rate: ~{(7.7**2/7.7**3) / (80**2/80**3):.0f}x faster")
print(f"    Brain (% of body): ~3x larger fraction")
print()
print("Lost features in miniaturized frogs:")
print("  Reduced toes (some lose entire fingers)")
print("  Lost teeth (most miniature frogs are toothless)")
print("  Simplified inner ear (reduced hearing range)")
print("  Fewer eggs (2-5 vs thousands)")`,
      challenge: 'Calculate the minimum body size where a frog brain (~10,000 neurons minimum) could still fit, assuming brain density is similar to water and each neuron takes up about 10 micrometers cubed.',
      successHint: 'Miniaturization reveals the fundamental constraints of biology: you can\'t just scale everything down. Understanding what\'s lost at small sizes tells us what\'s truly essential for an organism to function.',
    },
    {
      title: 'Scaling laws — why small is different',
      concept: `When you change the size of an organism, everything changes — not proportionally, but according to **scaling laws** (also called allometry).

**The Square-Cube Law** (first described by Galileo, 1638):
- If you double an organism's length:
  - Surface area increases by 2² = 4x
  - Volume (and mass) increases by 2³ = 8x
  - But muscle strength only increases by 4x (proportional to cross-sectional area)

This means a frog twice as large is 8x heavier but only 4x stronger — relatively weaker. This is why:
- **Ants can carry 50x their weight** (tiny = high strength-to-weight ratio)
- **Elephants have thick legs** (large = need more support per unit mass)
- **Tiny frogs can jump 20x their body length** (relatively more muscle per mass)
- **Large animals can't jump proportionally as far** (limited by muscle-to-mass ratio)

Scaling laws also affect:
- Heat loss (proportional to surface area → small animals cool fast)
- Metabolic rate (smaller = higher per-gram metabolic rate)
- Breathing (smaller = more breaths per minute)
- Heart rate (smaller = faster heartbeat)`,
      analogy: 'The square-cube law is why you can\'t build a scale model of a bridge with toothpicks and expect it to hold a car. The model bridge is relatively much stronger than the real one — because the toothpicks\' cross-sectional area (strength) scales differently from the volume (weight) they support. Organisms face the same math.',
      storyConnection: 'The tiny frog can jump incredible distances relative to its size — not because it has special muscles, but because of pure mathematics. The square-cube law gives small animals a strength-to-weight advantage that makes them proportionally more athletic than large ones.',
      checkQuestion: 'If a flea can jump 150x its body length, why can\'t a human jump 150 × 1.8m = 270 metres?',
      checkAnswer: 'The square-cube law. A flea is ~2mm long, and its muscles are proportionally much stronger relative to its mass. Scale the flea up to human size, and its legs would need to support 125,000x more mass (cube of the scaling factor), but its muscles would only be 2,500x stronger (square of the scaling factor). The human-sized flea couldn\'t even stand up, let alone jump. Scaling up doesn\'t preserve proportional performance.',
      codeIntro: 'Demonstrate the square-cube law and its effects on animal performance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Square-cube law demonstration
body_length = np.linspace(2, 200, 200)  # mm

# Scaling relationships
surface_area = body_length ** 2
volume = body_length ** 3
muscle_strength = body_length ** 2  # proportional to cross-section

# Relative performance (strength / weight)
relative_strength = muscle_strength / volume  # decreases with size
jump_distance = 10 * relative_strength * body_length  # relative jump distance

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Scaling relationships
ax1.set_facecolor('#111827')
ax1.loglog(body_length, surface_area / surface_area[0], color='#3b82f6',
           linewidth=2, label='Surface area (~L²)')
ax1.loglog(body_length, volume / volume[0], color='#ef4444',
           linewidth=2, label='Volume/mass (~L³)')
ax1.loglog(body_length, muscle_strength / muscle_strength[0], color='#22c55e',
           linewidth=2, label='Muscle strength (~L²)')

ax1.set_xlabel('Body length (mm)', color='white')
ax1.set_ylabel('Relative value (smallest = 1)', color='white')
ax1.set_title('The Square-Cube Law', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Mark animals
animals = [(2, 'Flea'), (8, 'Tiny frog'), (30, 'Tree frog'),
           (80, 'Bullfrog'), (150, 'Human\\n(scaled)')]
for size, name in animals:
    idx = np.argmin(np.abs(body_length - size))
    ax1.plot(size, volume[idx]/volume[0], 'o', color='#f59e0b', markersize=6)
    ax1.annotate(name, xy=(size, volume[idx]/volume[0]),
                 xytext=(size*1.3, volume[idx]/volume[0]*1.5),
                 color='#f59e0b', fontsize=7)

# Jump performance vs size
ax2.set_facecolor('#111827')

# Real jump data (body lengths jumped)
real_animals = {
    'Flea': {'size': 2, 'jump_bl': 150},
    'Tiny frog': {'size': 8, 'jump_bl': 25},
    'Tree frog': {'size': 30, 'jump_bl': 20},
    'Bullfrog': {'size': 80, 'jump_bl': 12},
    'Cat': {'size': 300, 'jump_bl': 6},
    'Human': {'size': 1800, 'jump_bl': 1.5},
    'Elephant': {'size': 3000, 'jump_bl': 0},
}

sizes = [a['size'] for a in real_animals.values()]
jumps = [a['jump_bl'] for a in real_animals.values()]
names = list(real_animals.keys())

ax2.scatter(sizes, jumps, s=100, color='#22c55e', edgecolor='white', linewidth=1, zorder=5)
for name, s, j in zip(names, sizes, jumps):
    ax2.annotate(name, xy=(s, j), xytext=(s*1.2, j+3), color='#22c55e', fontsize=8)

# Theoretical line (1/L scaling)
theory_x = np.logspace(np.log10(2), np.log10(5000), 100)
theory_y = 150 * (2 / theory_x)
ax2.plot(theory_x, theory_y, '--', color='gray', linewidth=1, label='Theoretical (1/L)')

ax2.set_xscale('log')
ax2.set_xlabel('Body length (mm, log scale)', color='white')
ax2.set_ylabel('Jump distance (body lengths)', color='white')
ax2.set_title('Jump Performance Decreases With Size', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Square-cube law predictions:")
print("  Double the length -> 4x surface area, 8x mass, 4x strength")
print("  Relative strength (strength/mass) drops as 1/L")
print()
print("Jump performance (body lengths):")
for name, props in real_animals.items():
    print(f"  {name} ({props['size']}mm): {props['jump_bl']} body lengths")
print()
print("The tiny frog jumps 25x its body length.")
print("A human would need to jump 45m to match that ratio.")`,
      challenge: 'The square-cube law also affects heat loss. Calculate how fast a 10mm frog and an 80mm frog cool down in 15C air (starting from 25C). Assume heat loss is proportional to surface area / volume. Which frog needs to find warmth first?',
      successHint: 'The square-cube law is one of the most universal principles in science — it applies to biology, engineering, physics, and even economics. Understanding it explains why ants are strong, elephants have big ears, and tiny frogs live in very specific habitats.',
    },
    {
      title: 'Poison frogs and toxicity — chemical defense at any size',
      concept: `Many miniaturized frogs are brightly coloured — a warning signal called **aposematism**. The message: "I'm toxic. Don't eat me."

**Where frog toxins come from:**
- Most toxic frogs don't manufacture their own poisons — they **sequester** them from their diet (ants, mites, beetles)
- The toxins (alkaloids like batrachotoxin, epibatidine, pumiliotoxin) are absorbed from prey and concentrated in skin glands
- Captive-bred poison frogs are non-toxic (no toxic prey = no toxins)

**NE India's toxic frogs:**
- Several *Nyctibatrachus* and *Raorchestes* species produce mild skin toxins
- Not as dramatically toxic as South American dart frogs, but enough to deter most predators

**Toxin types and potency:**
- **Batrachotoxin** (golden poison frog, Colombia): one frog carries enough toxin to kill 10 humans. The most potent non-peptide toxin known.
- **Tetrodotoxin** (some newts): blocks sodium channels in nerves. Also found in pufferfish.
- **Pumiliotoxin** (many tropical frogs): disrupts calcium channels, causing heart failure in small predators.

**Medical applications:** Epibatidine (from Ecuadorian poison frog) is a painkiller 200x more potent than morphine. Frog toxins are a pharmaceutical goldmine.`,
      analogy: 'Poison frogs are like walking chemical weapons factories — except they\'re the size of a grape. Their bright colours are the biological equivalent of hazmat warning signs. And just like chemical plants, they don\'t create the raw materials (toxins) themselves — they import them (from their diet) and concentrate them.',
      storyConnection: 'The tiny frog of the rainforest is small enough to be prey for everything — birds, snakes, spiders, even large insects. Toxicity is the great equalizer: you don\'t need to be big to be dangerous. A 10mm frog with alkaloid-laden skin can make a bird spit it out and never try again.',
      checkQuestion: 'Indigenous Colombians used golden poison frog toxin on blow darts. If the frog doesn\'t make its own toxin (it comes from diet), could you farm poison frogs for their toxin?',
      checkAnswer: 'You\'d need to feed them the specific toxic arthropods they eat in the wild — certain ants, mites, and beetles that carry the alkaloid precursors. In captivity with standard fruit flies, they lose their toxicity within months. The entire supply chain (toxic arthropods → frogs → darts) depends on the intact rainforest ecosystem. Destroy the forest, and you lose both the frog and its chemical factory.',
      codeIntro: 'Compare toxicity levels across different poison frog species and their medical potential.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Poison frog toxicity comparison
frogs = {
    'Golden poison\\nfrog (Colombia)': {'toxin': 'Batrachotoxin', 'ld50': 0.002, 'size': 45, 'medical': 3},
    'Blue poison\\nfrog (Suriname)': {'toxin': 'Pumiliotoxin', 'ld50': 0.5, 'size': 40, 'medical': 5},
    'Strawberry\\nfrog (C. America)': {'toxin': 'Pumiliotoxin', 'ld50': 2.0, 'size': 20, 'medical': 4},
    'Phantasmal\\nfrog (Ecuador)': {'toxin': 'Epibatidine', 'ld50': 1.0, 'size': 22, 'medical': 9},
    'NE India\\nmini frog': {'toxin': 'Mild alkaloids', 'ld50': 50, 'size': 12, 'medical': 2},
    'Common frog\\n(non-toxic)': {'toxin': 'None', 'ld50': 1000, 'size': 60, 'medical': 0},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Toxicity comparison (log scale LD50 — lower = more toxic)
ax1.set_facecolor('#111827')
names = list(frogs.keys())
ld50s = [f['ld50'] for f in frogs.values()]
sizes = [f['size'] for f in frogs.values()]
colors = ['#fbbf24', '#3b82f6', '#ef4444', '#a855f7', '#22c55e', '#6b7280']

# Invert LD50 so higher bar = more toxic
toxicity_score = [np.log10(1000 / ld50) for ld50 in ld50s]

bars = ax1.barh(range(len(names)), toxicity_score, color=colors, alpha=0.85)
ax1.set_yticks(range(len(names)))
ax1.set_yticklabels(names, color='white', fontsize=8)
ax1.set_xlabel('Toxicity score (log scale, higher = more toxic)', color='white')
ax1.set_title('Poison Frog Toxicity Comparison', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.invert_yaxis()

for bar, ld50 in zip(bars, ld50s):
    ax1.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
             f'LD50: {ld50} mg/kg', va='center', color='white', fontsize=7)

# Medical potential
ax2.set_facecolor('#111827')
medical = [f['medical'] for f in frogs.values()]
toxin_names = [f['toxin'] for f in frogs.values()]

scatter = ax2.scatter(ld50s, medical, s=[s*5 for s in sizes], c=colors,
                      edgecolor='white', linewidth=1, zorder=5)
ax2.set_xscale('log')
ax2.set_xlabel('LD50 (mg/kg, log scale — left = more toxic)', color='white')
ax2.set_ylabel('Medical research potential (0-10)', color='white')
ax2.set_title('Toxicity vs Medical Potential (bubble = body size)', color='white', fontsize=11)
ax2.tick_params(colors='gray')

for name, ld50, med, color in zip(names, ld50s, medical, colors):
    ax2.annotate(name.replace('\\n', ' '), xy=(ld50, med),
                 xytext=(ld50*1.5, med+0.3), color=color, fontsize=7)

# Highlight epibatidine
ax2.annotate('Epibatidine:\\n200x more potent\\nthan morphine', xy=(1.0, 9),
             xytext=(5, 8), color='#a855f7', fontsize=8,
             arrowprops=dict(arrowstyle='->', color='#a855f7'))

plt.tight_layout()
plt.show()

print("Frog toxin medical applications:")
print("  Batrachotoxin: studying sodium channels (nerve function)")
print("  Epibatidine: painkiller research (200x morphine potency)")
print("  Pumiliotoxin: heart function research")
print("  ABT-594 (synthetic epibatidine analog): non-addictive painkiller in clinical trials")
print()
print("Every undiscovered frog species could carry")
print("the next breakthrough drug in its skin.")
print("Biodiversity loss = pharmaceutical library loss.")`,
      challenge: 'If a captive-bred poison frog is non-toxic but a wild one is lethal, what does this tell us about the conservation value of wild habitats vs. captive breeding programs for drug discovery?',
      successHint: 'Poison frogs demonstrate that size doesn\'t determine power — chemistry does. Their toxins are already inspiring new painkillers, heart drugs, and antibiotics. Every species lost is a molecule we\'ll never discover.',
    },
    {
      title: 'Biodiversity hotspots — where life concentrates',
      concept: `NE India is one of the world's **biodiversity hotspots** — areas with exceptionally high species density AND exceptionally high threat levels. The criteria (defined by Conservation International):

1. At least 1,500 endemic plant species (found nowhere else)
2. Less than 30% of original habitat remaining

NE India's **Indo-Burma hotspot** qualifies on both counts:
- ~13,500 plant species (~7,000 endemic)
- ~90% of original habitat lost or degraded
- Over 1,300 bird species, 430 mammal species, 550+ reptile and amphibian species

**Why hotspots form:**
- **Geographic isolation**: mountains, rivers, and valleys create barriers that prevent gene flow → speciation
- **Climate diversity**: elevation gradients from 0 to 5,000+ metres create many climate zones in a small area
- **Stable climate history**: tropical regions had less Ice Age disruption → species accumulated over longer periods
- **High productivity**: warm, wet climates support more biomass and more ecological niches

There are 36 recognized biodiversity hotspots worldwide. Together they cover just 2.5% of Earth's land surface but contain over 50% of all plant species and 42% of terrestrial vertebrate species.`,
      analogy: 'Biodiversity hotspots are like the world\'s great libraries. They hold disproportionate amounts of knowledge (species) in small spaces. And just like libraries can burn, hotspots can be destroyed. Losing a hotspot is like losing the Library of Alexandria — an irreplaceable accumulation of millions of years of evolution.',
      storyConnection: 'The tiny frog exists because NE India\'s unique geography — isolated hills, deep valleys, heavy rainfall — created millions of micro-habitats where speciation could occur. Each miniature frog is a product of a specific valley, a specific altitude, a specific microclimate. The story\'s "rainforest" is not generic jungle — it\'s one of the most biologically unique places on Earth.',
      checkQuestion: 'If 36 hotspots cover just 2.5% of land but hold 50% of plant species, what would losing just ONE hotspot mean?',
      checkAnswer: 'Rough calculation: 50% of ~350,000 plant species = 175,000 species in 36 hotspots, averaging ~4,900 species per hotspot — many found nowhere else. Losing one hotspot could mean losing thousands of species permanently. And hotspots overlap with the world\'s poorest and fastest-developing regions, making them the most vulnerable to destruction. This is the conservation paradox: the places with the most to lose have the least resources to protect them.',
      codeIntro: 'Map and analyze the world\'s biodiversity hotspots, with focus on NE India.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Biodiversity hotspot data (selected)
hotspots = {
    'Indo-Burma\\n(incl. NE India)': {'plant_spp': 13500, 'endemic': 7000, 'habitat_left': 5, 'vertebrates': 2185},
    'Sundaland\\n(SE Asia)': {'plant_spp': 25000, 'endemic': 15000, 'habitat_left': 7, 'vertebrates': 1800},
    'Tropical Andes': {'plant_spp': 30000, 'endemic': 15000, 'habitat_left': 25, 'vertebrates': 3400},
    'Madagascar': {'plant_spp': 12000, 'endemic': 9700, 'habitat_left': 10, 'vertebrates': 370},
    'Western Ghats\\n(India)': {'plant_spp': 5916, 'endemic': 3049, 'habitat_left': 7, 'vertebrates': 1073},
    'Eastern\\nHimalayas': {'plant_spp': 10000, 'endemic': 3160, 'habitat_left': 25, 'vertebrates': 977},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Species richness vs habitat remaining
ax1.set_facecolor('#111827')
colors = ['#ef4444', '#f59e0b', '#22c55e', '#a855f7', '#3b82f6', '#6366f1']

for i, (name, data) in enumerate(hotspots.items()):
    ax1.scatter(data['habitat_left'], data['plant_spp'], s=data['endemic']/30,
                color=colors[i], edgecolor='white', linewidth=1, zorder=5)
    ax1.annotate(name.replace('\\n', ' '), xy=(data['habitat_left'], data['plant_spp']),
                 xytext=(data['habitat_left']+1, data['plant_spp']+500),
                 color=colors[i], fontsize=7)

ax1.set_xlabel('Original habitat remaining (%)', color='white')
ax1.set_ylabel('Total plant species', color='white')
ax1.set_title('Biodiversity Hotspots: Species vs Habitat Loss\\n(bubble = endemic species)',
              color='white', fontsize=11)
ax1.tick_params(colors='gray')
ax1.invert_xaxis()  # Less habitat = worse

# Urgency metric: species at risk = endemic * (1 - habitat/100)
ax2.set_facecolor('#111827')
urgency = {name: data['endemic'] * (1 - data['habitat_left']/100) for name, data in hotspots.items()}
sorted_urgency = dict(sorted(urgency.items(), key=lambda x: x[1], reverse=True))

bars = ax2.barh(range(len(sorted_urgency)),
                list(sorted_urgency.values()),
                color=colors[:len(sorted_urgency)], alpha=0.85)
ax2.set_yticks(range(len(sorted_urgency)))
ax2.set_yticklabels(list(sorted_urgency.keys()), color='white', fontsize=8)
ax2.set_xlabel('Urgency score (endemic species × habitat loss fraction)', color='white')
ax2.set_title('Conservation Urgency Ranking', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.invert_yaxis()

for bar, val in zip(bars, sorted_urgency.values()):
    ax2.text(bar.get_width() + 100, bar.get_y() + bar.get_height()/2,
             f'{val:,.0f}', va='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("NE India (Indo-Burma hotspot):")
print(f"  Plant species: {hotspots['Indo-Burma' + chr(10) + '(incl. NE India)']['plant_spp']:,}")
print(f"  Endemic (found nowhere else): {hotspots['Indo-Burma' + chr(10) + '(incl. NE India)']['endemic']:,}")
print(f"  Original habitat remaining: {hotspots['Indo-Burma' + chr(10) + '(incl. NE India)']['habitat_left']}%")
print(f"  Vertebrate species: {hotspots['Indo-Burma' + chr(10) + '(incl. NE India)']['vertebrates']:,}")
print()
print("Global hotspot stats:")
print(f"  36 hotspots covering 2.5% of Earth's land")
print(f"  Contain >50% of all plant species")
print(f"  Home to ~42% of terrestrial vertebrates")
print()
print("NE India is one of the most urgent conservation priorities")
print("on Earth — high biodiversity, very little habitat left.")`,
      challenge: 'Calculate the "extinction debt": species that will eventually go extinct due to habitat already lost (using the species-area relationship from the orchid lesson, z=0.25). How many NE India plant species are "committed to extinction" based on current habitat loss?',
      successHint: 'Biodiversity hotspots are where conservation resources should be concentrated — maximum species saved per dollar spent. NE India is on the front line of this global effort. The tiny frog is just one of thousands of species that depend on protecting these few remaining fragments of forest.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Amphibian Biology & Size Extremes</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biology and scaling simulations. Click to start.</p>
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