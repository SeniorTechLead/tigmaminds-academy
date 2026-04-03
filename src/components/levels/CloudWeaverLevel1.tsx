import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CloudWeaverLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Fibre types — natural vs synthetic',
      concept: `In the story, the Cloud Weaver of Tawang spins cloth from clouds drifting over the mountains. Real textiles begin not with clouds, but with **fibres** — thin, flexible strands that can be twisted into yarn.

Fibres fall into two broad families:
- **Natural fibres**: cotton (plant cellulose), wool (animal protein keratin), silk (fibroin from silkworms), jute (bast fibre), muga silk of Assam
- **Synthetic fibres**: nylon (polyamide), polyester (PET), acrylic (polyacrylonitrile), spandex (polyurethane)

Natural fibres are renewable and biodegradable, but they vary in quality and are limited by climate and land. Synthetic fibres are consistent and cheap, but they come from petrochemicals and shed microplastics.

A single cotton fibre is about 20 micrometres wide — thinner than a human hair. It is made almost entirely of cellulose, a long chain of glucose molecules bonded end to end.`,
      analogy: 'Think of a fibre as a single strand of spaghetti. By itself it is weak. Twist many strands together and you get yarn (a rope of spaghetti). Weave two sets of yarn over and under each other and you get fabric (a woven mat of spaghetti). The strand is the fundamental unit of every textile.',
      storyConnection: 'The Cloud Weaver pulled misty filaments from the sky and twisted them into thread. In textile science, every fabric starts the same way: isolating a thin fibre, spinning it into yarn, and then constructing cloth. The "cloud" is the raw material — cotton bolls, silkworm cocoons, or petroleum.',
      checkQuestion: 'Muga silk, unique to Assam, is naturally golden. Why might it be more expensive than regular white mulberry silk?',
      checkAnswer: 'Muga silk comes from Antheraea assamensis, a semi-domesticated moth found only in the Brahmaputra valley. Its supply is geographically limited, the worms feed on specific trees (som and soalu), and the silk cannot be bleached without damage. Scarcity plus unique properties equal premium price.',
      codeIntro: 'Compare key properties of natural and synthetic fibres in a grouped bar chart.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fibres = ['Cotton', 'Wool', 'Muga Silk', 'Polyester', 'Nylon']
tensile_strength = [3.0, 1.5, 4.5, 5.5, 6.0]  # grams per denier
moisture_absorption = [8.5, 16.0, 5.0, 0.4, 4.5]  # percent
biodegradable = [1, 1, 1, 0, 0]  # 1 = yes

x = np.arange(len(fibres))
w = 0.25

fig, ax1 = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax1.set_facecolor('#111827')

bars1 = ax1.bar(x - w, tensile_strength, w, label='Tensile strength (g/denier)', color='#3b82f6')
bars2 = ax1.bar(x, moisture_absorption, w, label='Moisture absorption (%)', color='#22c55e')
bars3 = ax1.bar(x + w, [b * 3 for b in biodegradable], w, label='Biodegradable (yes=3)', color='#f59e0b')

ax1.set_xticks(x)
ax1.set_xticklabels(fibres, color='white')
ax1.set_ylabel('Value', color='white')
ax1.set_title('Natural vs Synthetic Fibre Properties', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key observations:")
print("  Synthetics are stronger but absorb almost no moisture.")
print("  Natural fibres breathe better and biodegrade.")
print("  Muga silk combines good strength with natural origin.")
print("  Wool absorbs the most moisture — great for cold climates.")`,
      challenge: 'Add a sixth fibre — jute — with tensile strength 3.5, moisture absorption 12%, and biodegradable = yes. How does it compare to cotton?',
      successHint: 'The natural-vs-synthetic trade-off is the central tension in modern textiles. Understanding fibre properties is the first step toward designing better fabrics.',
    },
    {
      title: 'Weaving basics — warp and weft',
      concept: `Weaving is the interlacing of two perpendicular sets of threads:

- **Warp**: the vertical threads held taut on the loom. They run the length of the fabric.
- **Weft** (or woof): the horizontal threads passed over and under the warp. They run the width.

The simplest weave pattern is **plain weave**: weft goes over one warp, under the next, over, under... The next row reverses. This creates a checkerboard pattern — strong, stable, but not very stretchy.

Other fundamental weaves:
- **Twill weave**: weft goes over two warps, under one, shifted by one each row. Creates diagonal lines (think denim jeans).
- **Satin weave**: weft floats over four or more warps before going under one. Creates a smooth, shiny surface.

Every fabric you own — from a cotton T-shirt to a silk saree — is one of these three weaves or a variation of them.`,
      analogy: 'Imagine you are making a basket from strips of paper. The strips you tape down vertically on the table are the warp. The strips you weave horizontally through them are the weft. The pattern in which you go over and under determines whether you get a plain, twill, or satin "fabric."',
      storyConnection: 'The Cloud Weaver used a loom that appeared from mist, with cloud-strands for warp and sunbeams for weft. Every real loom works the same way: hold some threads tight (warp), pass others through them (weft). The loom is one of humanity\'s oldest machines, predating the wheel.',
      checkQuestion: 'Why does denim (twill weave) feel different from a bedsheet (plain weave), even when both are 100% cotton?',
      checkAnswer: 'The weave structure determines how threads interact. Twill weave has longer floats, so the fabric is softer and drapes better. Plain weave has maximum interlacing, so it is stiffer and stronger per thread but less flexible. Same fibre, different architecture, different properties.',
      codeIntro: 'Visualize three fundamental weave patterns as grids.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def make_weave(pattern_name, size=12):
    grid = np.zeros((size, size))
    if pattern_name == 'plain':
        for r in range(size):
            for c in range(size):
                grid[r, c] = (r + c) % 2
    elif pattern_name == 'twill':
        for r in range(size):
            for c in range(size):
                grid[r, c] = 1 if (r + c) % 3 == 0 else 0
    elif pattern_name == 'satin':
        for r in range(size):
            for c in range(size):
                grid[r, c] = 1 if (r * 3 + c) % 5 == 0 else 0
    return grid

fig, axes = plt.subplots(1, 3, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

weaves = [('plain', 'Plain Weave', '#22c55e'),
          ('twill', 'Twill Weave', '#3b82f6'),
          ('satin', 'Satin Weave', '#f59e0b')]

for ax, (name, title, color) in zip(axes, weaves):
    grid = make_weave(name)
    ax.set_facecolor('#111827')
    cmap = plt.cm.colors.LinearSegmentedColormap.from_list('c', ['#111827', color])
    ax.imshow(grid, cmap=cmap, interpolation='nearest')
    ax.set_title(title, color='white', fontsize=12, fontweight='bold')
    ax.set_xlabel('Warp threads (vertical)', color='white', fontsize=9)
    ax.set_ylabel('Weft passes (horizontal)', color='white', fontsize=9)
    ax.tick_params(colors='gray', labelsize=7)
    # Grid lines
    for i in range(grid.shape[0] + 1):
        ax.axhline(i - 0.5, color='gray', linewidth=0.3)
        ax.axvline(i - 0.5, color='gray', linewidth=0.3)

plt.suptitle('Coloured squares = weft on top | Dark = warp on top', color='gray', fontsize=10, y=0.02)
plt.tight_layout()
plt.show()

print("Plain: maximum interlacing -> strongest, stiffest")
print("Twill: diagonal pattern -> softer, drapes well (denim)")
print("Satin: long floats -> smooth, shiny, but weaker")`,
      challenge: 'Create a 4th weave called "basket" where 2 weft threads go over 2 warp threads at a time. Modify the make_weave function to add it.',
      successHint: 'Three simple patterns — plain, twill, satin — produce almost all the fabrics in the world. The weave is the architecture of cloth.',
    },
    {
      title: 'Loom technology — from backstrap to power loom',
      concept: `A loom is a frame that holds the warp threads under tension so the weaver can pass the weft through them. Looms have evolved over millennia:

- **Backstrap loom**: simplest. One end tied to a post, the other to the weaver's body. Used across NE India, Central America, Southeast Asia. Portable, slow, fully manual.
- **Pit loom**: weaver sits above a pit, works foot pedals (treadles) to raise and lower warp sets. Faster than backstrap.
- **Fly-shuttle loom** (1733, John Kay): a spring mechanism "throws" the shuttle across the warp. Doubled weaving speed.
- **Power loom** (1785, Edmund Cartwright): steam-driven. Launched the Industrial Revolution.
- **Jacquard loom** (1804): used punched cards to control individual warp threads. Could weave complex patterns automatically. Considered the ancestor of computers.

The Jacquard loom is especially significant — Charles Babbage was directly inspired by its punched cards when designing his Analytical Engine.`,
      analogy: 'A loom is like a printer. The warp threads are the paper (held in place). The weft is the ink (applied line by line). A backstrap loom is like writing by hand — slow, beautiful, unique. A power loom is like a laser printer — fast, consistent, impersonal. A Jacquard loom is like a programmable printer — it follows digital instructions.',
      storyConnection: 'The Cloud Weaver\'s loom was said to work "by itself, guided by the wind." That description fits the Jacquard loom perfectly: an automated machine guided by instructions (punched cards instead of wind). The story imagined automation centuries before NE India saw power looms.',
      checkQuestion: 'Why is the Jacquard loom considered an ancestor of the computer?',
      checkAnswer: 'It used binary information (hole vs. no hole in a punched card) to control the machine automatically. Each card row was an instruction — raise this thread, lower that one. This is the same logic as a computer program: a sequence of binary instructions controlling a machine. Babbage explicitly credited Jacquard.',
      codeIntro: 'Simulate fabric output rates for different loom technologies over a working day.',
      code: `import numpy as np
import matplotlib.pyplot as plt

hours = np.arange(0, 9, 0.1)  # 8-hour working day

# Metres of fabric per hour (approximate)
looms = {
    'Backstrap': 0.15,
    'Pit loom': 0.5,
    'Fly-shuttle': 1.2,
    'Power loom': 4.0,
    'Modern Jacquard': 8.0,
}

colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Cumulative output
ax1.set_facecolor('#111827')
for (name, rate), c in zip(looms.items(), colors):
    output = rate * hours
    ax1.plot(hours, output, linewidth=2, label=f'{name} ({rate} m/hr)', color=c)

ax1.set_xlabel('Hours worked', color='white')
ax1.set_ylabel('Metres of fabric', color='white')
ax1.set_title('Cumulative Fabric Output', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Bar chart: output in an 8-hour day
ax2.set_facecolor('#111827')
names = list(looms.keys())
daily = [r * 8 for r in looms.values()]
bars = ax2.barh(names, daily, color=colors)
for bar, d in zip(bars, daily):
    ax2.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
             f'{d:.1f} m', va='center', color='white', fontsize=10)
ax2.set_xlabel('Metres per 8-hour day', color='white')
ax2.set_title('Daily Output by Loom Type', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Productivity gains:")
for name, rate in looms.items():
    print(f"  {name}: {rate * 8:.1f} metres/day")
print()
ratio = list(looms.values())[-1] / list(looms.values())[0]
print(f"Modern Jacquard is {ratio:.0f}x faster than a backstrap loom.")
print("But handloom fabric from NE India commands premium prices")
print("because of its uniqueness and cultural value.")`,
      challenge: 'Add a "handloom with fly-shuttle" entry at 0.8 m/hr. Many weavers in Assam and Manipur use this hybrid. Where does it fall in the productivity ranking?',
      successHint: 'Loom technology is a microcosm of the Industrial Revolution. Each improvement multiplied human productivity — but also displaced hand-weavers. This tension between efficiency and craftsmanship persists today.',
    },
    {
      title: 'Textile patterns — geometry in cloth',
      concept: `Patterns in textiles are not random — they follow mathematical rules. The simplest patterns are based on **symmetry operations**:

- **Translation**: repeat a motif at regular intervals (stripes, checks)
- **Rotation**: spin a motif around a point (pinwheel designs)
- **Reflection**: mirror a motif across a line (bilateral symmetry)
- **Glide reflection**: translate + reflect (herringbone)

Mathematicians have proven that there are exactly **17 distinct wallpaper groups** — 17 ways to tile a flat surface with a repeating pattern. Every textile pattern in the world, from Scottish tartan to Naga shawls to Japanese kimono fabrics, belongs to one of these 17 groups.

Traditional Assamese textiles use geometric motifs from nature: jaapi (conical hat), kosu (tortoise), gos (tree of life), and kingkhap (gold thread border). Each follows specific symmetry rules.`,
      analogy: 'Textile patterns are like musical rhythms. A simple stripe is a steady beat (1-2-1-2). A plaid is two rhythms layered (horizontal and vertical stripes crossing). A complex brocade is a full orchestra — multiple patterns interacting, all following mathematical rules of repetition and variation.',
      storyConnection: 'The Cloud Weaver was said to weave patterns that "told the stories of the mountains" — peaks, rivers, clouds, and birds. Traditional Monpa textiles from Tawang do exactly this: geometric abstractions of natural forms, repeated according to precise symmetry rules. Art meets mathematics in every thread.',
      checkQuestion: 'If there are only 17 possible wallpaper groups, why do we see millions of different textile patterns?',
      checkAnswer: 'The 17 groups describe the types of symmetry, not the specific motifs. Within each group, the motif can be anything — a flower, a geometric shape, a letter. And you can vary colour, scale, and proportion infinitely. Symmetry type is the grammar; the motif is the vocabulary. Infinite sentences from finite rules.',
      codeIntro: 'Generate textile-style patterns using tiling and symmetry.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 3, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Mathematical Patterns in Textiles', color='white', fontsize=14, y=0.98)

# 1. Plain stripes (translation along one axis)
ax = axes[0, 0]
ax.set_facecolor('#111827')
for i in range(20):
    color = '#22c55e' if i % 2 == 0 else '#111827'
    ax.axhspan(i, i+1, color=color, alpha=0.7)
ax.set_title('Stripes (translation)', color='white', fontsize=10)
ax.set_xlim(0, 10); ax.set_ylim(0, 20); ax.axis('off')

# 2. Checkerboard (translation in both axes)
ax = axes[0, 1]
ax.set_facecolor('#111827')
grid = np.zeros((10, 10))
for r in range(10):
    for c in range(10):
        grid[r, c] = (r + c) % 2
cmap = plt.cm.colors.LinearSegmentedColormap.from_list('c', ['#111827', '#f59e0b'])
ax.imshow(grid, cmap=cmap, interpolation='nearest')
ax.set_title('Checks (2D translation)', color='white', fontsize=10)
ax.axis('off')

# 3. Herringbone (glide reflection)
ax = axes[0, 2]
ax.set_facecolor('#111827')
size = 20
hb = np.zeros((size, size))
for r in range(size):
    for c in range(size):
        block_r = r // 4
        if block_r % 2 == 0:
            hb[r, c] = 1 if (r + c) % 3 == 0 else 0
        else:
            hb[r, c] = 1 if (r - c) % 3 == 0 else 0
cmap2 = plt.cm.colors.LinearSegmentedColormap.from_list('c2', ['#111827', '#3b82f6'])
ax.imshow(hb, cmap=cmap2, interpolation='nearest')
ax.set_title('Herringbone (glide reflection)', color='white', fontsize=10)
ax.axis('off')

# 4. Diamond / argyle (rotation + reflection)
ax = axes[1, 0]
ax.set_facecolor('#111827')
x = np.linspace(-5, 5, 200)
y = np.linspace(-5, 5, 200)
X, Y = np.meshgrid(x, y)
Z = (np.abs(X % 2 - 1) + np.abs(Y % 2 - 1)) % 2
cmap3 = plt.cm.colors.LinearSegmentedColormap.from_list('c3', ['#111827', '#ef4444'])
ax.imshow(Z, cmap=cmap3, extent=[-5, 5, -5, 5], interpolation='nearest')
ax.set_title('Diamond (rotation + reflection)', color='white', fontsize=10)
ax.axis('off')

# 5. Concentric circles (radial symmetry)
ax = axes[1, 1]
ax.set_facecolor('#111827')
theta = np.linspace(0, 2*np.pi, 100)
for r in range(1, 8):
    color = '#a855f7' if r % 2 == 0 else '#22c55e'
    ax.plot(r * np.cos(theta), r * np.sin(theta), color=color, linewidth=2)
ax.set_xlim(-8, 8); ax.set_ylim(-8, 8)
ax.set_aspect('equal')
ax.set_title('Radial (rotational symmetry)', color='white', fontsize=10)
ax.axis('off')

# 6. Plaid / tartan (two overlapping stripe sets)
ax = axes[1, 2]
ax.set_facecolor('#111827')
plaid = np.zeros((40, 40, 3))
for i in range(40):
    if i % 8 < 3:
        plaid[i, :, 1] += 0.4  # green horizontal
        plaid[:, i, 0] += 0.4  # red vertical
    elif i % 8 < 5:
        plaid[i, :, 2] += 0.3  # blue horizontal
        plaid[:, i, 2] += 0.3  # blue vertical
plaid = np.clip(plaid, 0, 1)
ax.imshow(plaid, interpolation='nearest')
ax.set_title('Plaid / tartan (layered stripes)', color='white', fontsize=10)
ax.axis('off')

plt.tight_layout()
plt.show()

print("All textile patterns use combinations of just 4 symmetry operations:")
print("  1. Translation (repeat)")
print("  2. Rotation (spin)")
print("  3. Reflection (mirror)")
print("  4. Glide reflection (shift + mirror)")
print()
print("17 wallpaper groups = 17 unique combinations of these operations.")
print("Every patterned fabric in the world uses one of them.")`,
      challenge: 'Modify the checkerboard pattern so every third row is a different colour (three-colour check). How does this change the symmetry group?',
      successHint: 'Pattern recognition is where art meets math. Textile designers have been applying group theory for thousands of years — they just did not call it that.',
    },
    {
      title: 'Fabric properties — why some clothes feel better',
      concept: `Why is silk smooth, cotton breathable, and wool warm? The answer lies in measurable **fabric properties**:

- **Tensile strength**: how much force before the fabric tears (measured in Newtons)
- **Moisture regain**: how much water the fibre absorbs from the air (wool: 16%, polyester: 0.4%)
- **Thermal conductivity**: how fast heat passes through (lower = warmer). Wool traps air in crimped fibres, creating insulation.
- **Drape**: how a fabric hangs under gravity. Silk drapes beautifully; canvas does not.
- **Pilling resistance**: how well a fabric resists forming fuzzy balls. Tight weaves pill less.
- **Breathability**: how easily air and moisture vapour pass through. Determines comfort in hot weather.

These properties depend on three things: (1) the fibre type, (2) the yarn construction (how tightly twisted), and (3) the weave structure. Change any one and the fabric feels completely different.`,
      analogy: 'Fabric properties are like personality traits in people. Fibre type is genetics (you are born with it). Yarn twist is upbringing (how the raw material is shaped). Weave structure is profession (how the yarns are organized). All three combine to create the final character of the cloth.',
      storyConnection: 'The Cloud Weaver\'s fabrics were said to be "warm as sunshine in winter, cool as mountain mist in summer." No single real fabric does both — but this describes the goal of textile engineering: optimizing properties for specific needs. Wool for winter, cotton for summer, each excelling at different properties.',
      checkQuestion: 'Why does a wet cotton T-shirt feel cold, but a wet wool sweater stays warm?',
      checkAnswer: 'Cotton fibres swell when wet and collapse against your skin, conducting heat away quickly. Wool fibres have a water-repelling outer layer (lanolin and scales) that keeps moisture in the fibre core, maintaining air pockets that insulate. Wool also generates heat when it absorbs moisture (heat of sorption).',
      codeIntro: 'Compare fabric comfort metrics across different materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fabrics = ['Cotton\\nplain', 'Wool\\ntwill', 'Silk\\nsatin', 'Polyester\\nplain', 'Muga silk\\nplain']

# Scores 0-10 for comfort-related properties
breathability = [9, 5, 6, 3, 7]
warmth = [3, 9, 5, 4, 5]
moisture_mgmt = [7, 8, 5, 2, 6]
drape = [4, 5, 9, 3, 7]
durability = [6, 7, 5, 9, 6]

categories = ['Breathability', 'Warmth', 'Moisture\\nmgmt', 'Drape', 'Durability']
N = len(categories)

angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

fig, axes = plt.subplots(1, 5, figsize=(18, 4), subplot_kw=dict(polar=True))
fig.patch.set_facecolor('#1f2937')

colors = ['#22c55e', '#f59e0b', '#a855f7', '#3b82f6', '#ef4444']

for idx, (ax, name) in enumerate(zip(axes, fabrics)):
    ax.set_facecolor('#111827')
    values = [breathability[idx], warmth[idx], moisture_mgmt[idx], drape[idx], durability[idx]]
    values += values[:1]
    ax.plot(angles, values, 'o-', linewidth=2, color=colors[idx])
    ax.fill(angles, values, alpha=0.2, color=colors[idx])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories, color='white', fontsize=6)
    ax.set_ylim(0, 10)
    ax.set_yticks([2, 5, 8])
    ax.set_yticklabels(['2', '5', '8'], color='gray', fontsize=6)
    ax.set_title(name, color=colors[idx], fontsize=9, fontweight='bold', pad=15)
    ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("No single fabric wins everywhere:")
print("  Cotton: best breathability (summer champion)")
print("  Wool: best warmth + moisture management (winter champion)")
print("  Silk: best drape (luxury and formalwear)")
print("  Polyester: best durability (sportswear, workwear)")
print("  Muga silk: balanced profile (Assam's premium textile)")`,
      challenge: 'Create a "blend" that averages cotton and polyester scores. Blends like 60/40 polycotton are popular precisely because they combine the best of both. Plot it as a 6th radar chart.',
      successHint: 'Textile engineering is about trade-offs. There is no perfect fabric — only the right fabric for the right purpose. Understanding properties lets you make that choice scientifically.',
    },
    {
      title: 'Sustainable textiles — fashion without destruction',
      concept: `The textile industry is the second-largest polluter in the world after oil. The numbers are staggering:

- **10,000 litres** of water to make one pair of jeans (cotton growing + dyeing + finishing)
- **35%** of ocean microplastics come from synthetic textiles washing
- **92 million tonnes** of textile waste produced every year
- **20%** of global water pollution comes from textile dyeing

Sustainable alternatives are emerging:
- **Organic cotton**: no pesticides, less water (but still water-intensive)
- **Recycled polyester**: made from PET bottles (saves oil, but still sheds microplastics)
- **Hemp and bamboo**: fast-growing, need less water and no pesticides
- **Natural dyes**: turmeric, indigo, lac — used in traditional Assamese textiles for centuries
- **Muga and eri silk**: semi-wild silkworms, low-impact rearing, traditional knowledge

The irony: many "ancient" textile practices in NE India — natural dyes, handlooms, local fibres — are exactly what modern sustainability movements advocate.`,
      analogy: 'Fast fashion is like fast food. Cheap, convenient, and satisfying in the moment — but terrible for long-term health (of the planet). Sustainable textiles are like home-cooked meals with local ingredients. More effort, more expensive, but nourishing and sustainable. The handloom weavers of Assam have been "eating local" all along.',
      storyConnection: 'The Cloud Weaver\'s cloth was made from clouds — infinitely renewable, no waste, no pollution. This is the ideal that sustainable textile science strives toward: materials that come from nature and return to nature without harm. Traditional handloom textiles come closer to this ideal than any factory.',
      checkQuestion: 'If recycled polyester still sheds microplastics when washed, is it really sustainable?',
      checkAnswer: 'It is better than virgin polyester (saves oil and energy) but not truly sustainable as long as microplastic shedding is unsolved. Solutions being researched include microfibre-catching washing bags, fibre coatings, and biodegradable synthetic fibres. "Sustainable" is a spectrum, not a binary.',
      codeIntro: 'Visualize the environmental impact of different textile fibres.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fibres = ['Conventional\\ncotton', 'Organic\\ncotton', 'Polyester', 'Recycled\\npolyester', 'Hemp', 'Muga silk\\n(traditional)']

water_use = [10000, 7000, 500, 400, 2700, 1500]  # litres per kg
co2_kg = [5.9, 3.8, 9.5, 5.7, 1.6, 2.0]  # kg CO2 per kg fibre
pesticide = [8, 0.5, 0, 0, 0.2, 0.1]  # relative score 0-10
microplastic = [0.1, 0.1, 9, 8, 0.1, 0.1]  # relative score 0-10

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Environmental Impact of Textile Fibres', color='white', fontsize=14)

colors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#a855f7', '#06b6d4']

# Water use
ax = axes[0, 0]
ax.set_facecolor('#111827')
bars = ax.bar(fibres, water_use, color=colors)
ax.set_ylabel('Litres per kg', color='white')
ax.set_title('Water consumption', color='white', fontsize=11)
ax.tick_params(colors='gray', labelsize=7)
for bar, val in zip(bars, water_use):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 100,
            f'{val:,}', ha='center', color='white', fontsize=8)

# CO2
ax = axes[0, 1]
ax.set_facecolor('#111827')
bars = ax.bar(fibres, co2_kg, color=colors)
ax.set_ylabel('kg CO2 per kg fibre', color='white')
ax.set_title('Carbon footprint', color='white', fontsize=11)
ax.tick_params(colors='gray', labelsize=7)
for bar, val in zip(bars, co2_kg):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2,
            f'{val}', ha='center', color='white', fontsize=8)

# Pesticide
ax = axes[1, 0]
ax.set_facecolor('#111827')
bars = ax.bar(fibres, pesticide, color=colors)
ax.set_ylabel('Pesticide use (relative)', color='white')
ax.set_title('Pesticide intensity', color='white', fontsize=11)
ax.tick_params(colors='gray', labelsize=7)

# Microplastic
ax = axes[1, 1]
ax.set_facecolor('#111827')
bars = ax.bar(fibres, microplastic, color=colors)
ax.set_ylabel('Microplastic risk (relative)', color='white')
ax.set_title('Microplastic shedding', color='white', fontsize=11)
ax.tick_params(colors='gray', labelsize=7)

plt.tight_layout()
plt.show()

print("Summary:")
print("  Conventional cotton: high water + pesticides")
print("  Polyester: low water, but high CO2 + microplastics")
print("  Hemp: lowest CO2, low water, no pesticides — arguably best overall")
print("  Muga silk: low impact, traditional knowledge, cultural value")
print()
print("The 'greenest' fibre depends on which impact you prioritize.")
print("There is no perfect answer — only informed trade-offs.")`,
      challenge: 'Add bamboo fibre (water: 3000, CO2: 2.5, pesticide: 0.3, microplastic: 0.1) to all four charts. How does it compare to hemp?',
      successHint: 'Sustainability in textiles is not about finding one perfect material — it is about understanding trade-offs and making informed choices. The traditional textile practices of NE India are more relevant than ever.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior textiles experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for textile simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}