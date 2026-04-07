import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LostTempleLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is archaeology? — reading the earth like a book',
      concept: `The ruins of Madan Kamdev sit on a hillside near Guwahati, scattered among trees and grass. Carved stone figures, broken pillars, fragments of temples — silent witnesses to a civilization that thrived here between the 9th and 12th centuries CE. **Archaeology** is the science of reading these silent witnesses.

Archaeology is NOT treasure hunting. It is the systematic study of human history through material remains — objects, buildings, bones, seeds, soil chemistry, anything physical that people left behind. The goal isn't to find beautiful things; it's to answer questions:
- Who lived here? When? How many?
- What did they eat? What did they build? What did they believe?
- Why did they leave?

The archaeologist's most important tool isn't a shovel — it's **context**. A gold coin found in a museum tells you almost nothing. The same coin found in a specific soil layer, next to specific pottery, at a specific depth, at a mapped location tells you everything: when it was lost, who dropped it, what they were doing there, and how wealthy the settlement was.`,
      analogy: 'An archaeological site is like a crime scene. Detectives don\'t just grab evidence randomly — they photograph everything in place, measure distances, record which item was near which. Moving one piece of evidence destroys information. Archaeology works the same way: once you dig something up, you can\'t put it back. Every excavation is also a destruction.',
      storyConnection: 'When the children in the story first found the ruins of Madan Kamdev, they wanted to take the beautiful carvings home. The old teacher stopped them: "Leave everything where it is. The position of each stone tells a story that the stone alone cannot." This is the cardinal rule of archaeology — context is everything.',
      checkQuestion: 'Why do archaeologists spend more time recording and documenting than actually digging?',
      checkAnswer: 'Because excavation is destruction. Once you remove a layer of soil, it\'s gone forever. If you didn\'t record exactly what was in that layer — every artifact\'s position, the soil colour, any seeds or bones — that information is permanently lost. Future archaeologists with better technology can\'t re-excavate what you\'ve already removed. Documentation IS the preservation.',
      codeIntro: 'Simulate an archaeological grid system for mapping artifact positions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate an excavation grid at Madan Kamdev
# 10m × 10m grid, divided into 1m × 1m squares
grid_size = 10

# Generate artifact positions (clustered near structures)
n_artifacts = 45

# Temple foundation roughly at center
temple_x, temple_y = 5, 5

# Artifacts cluster near temple (normal distribution)
art_x = np.random.normal(temple_x, 2, n_artifacts)
art_y = np.random.normal(temple_y, 2, n_artifacts)

# Clip to grid
art_x = np.clip(art_x, 0.1, 9.9)
art_y = np.clip(art_y, 0.1, 9.9)

# Artifact types
types = np.random.choice(['Pottery', 'Stone carving', 'Metal', 'Bone', 'Coin'], n_artifacts,
                          p=[0.4, 0.25, 0.15, 0.1, 0.1])

colors_map = {'Pottery': '#f59e0b', 'Stone carving': '#a855f7', 'Metal': '#3b82f6',
              'Bone': '#ef4444', 'Coin': '#22c55e'}
markers_map = {'Pottery': 'o', 'Stone carving': 's', 'Metal': 'D', 'Bone': '^', 'Coin': '*'}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Artifact map
ax1.set_facecolor('#111827')

# Draw grid
for i in range(grid_size + 1):
    ax1.axhline(i, color='gray', linewidth=0.3, alpha=0.5)
    ax1.axvline(i, color='gray', linewidth=0.3, alpha=0.5)

# Plot temple foundation (approximate)
temple_rect = plt.Rectangle((3.5, 3.5), 3, 3, fill=False, edgecolor='#f59e0b',
                              linewidth=2, linestyle='--', label='Temple foundation')
ax1.add_patch(temple_rect)

# Plot artifacts
for artifact_type in colors_map:
    mask = types == artifact_type
    ax1.scatter(art_x[mask], art_y[mask], c=colors_map[artifact_type],
               marker=markers_map[artifact_type], s=50, label=artifact_type, zorder=3)

ax1.set_xlim(0, grid_size)
ax1.set_ylim(0, grid_size)
ax1.set_xlabel('East (meters)', color='white')
ax1.set_ylabel('North (meters)', color='white')
ax1.set_title('Excavation Grid: Artifact Positions', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.set_aspect('equal')
ax1.tick_params(colors='gray')

# Artifact density heatmap
ax2.set_facecolor('#111827')
heatmap, xedges, yedges = np.histogram2d(art_x, art_y, bins=grid_size, range=[[0,10],[0,10]])
im = ax2.imshow(heatmap.T, origin='lower', extent=[0, 10, 0, 10],
                cmap='YlOrRd', aspect='equal')
plt.colorbar(im, ax=ax2, label='Artifact count')
ax2.set_xlabel('East (meters)', color='white')
ax2.set_ylabel('North (meters)', color='white')
ax2.set_title('Artifact Density Heatmap', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Artifact counts
print("Artifact inventory:")
for t in colors_map:
    count = np.sum(types == t)
    print(f"  {t}: {count} ({count/n_artifacts*100:.0f}%)")
print(f"  Total: {n_artifacts}")
print()
print("Pottery dominates (40%) — typical for ancient settlements.")
print("Artifacts cluster around the temple foundation.")
print("The density heatmap reveals the activity center of the site.")`,
      challenge: 'Add a second cluster of artifacts at position (2, 8) — perhaps a kitchen area. Use np.concatenate to merge the two clusters. How does the density map change? What does a second cluster suggest about the site layout?',
      successHint: 'Spatial analysis of artifact distributions is how archaeologists reconstruct the layout of ancient settlements without any written records. The math is simple (counting, clustering), but the insights are profound.',
    },
    {
      title: 'Stratigraphy — layers tell time',
      concept: `Dig a hole at Madan Kamdev and you'll see coloured bands in the soil — dark brown, then reddish, then grey, then yellowish. These are **strata** (layers), and reading them is called **stratigraphy**. It's archaeology's most fundamental dating method.

The principle is simple: **the law of superposition** — in an undisturbed sequence, older layers are at the bottom and newer layers are at the top. This was first stated by Nicolas Steno in 1669 and applies to both geology and archaeology.

Each layer represents a period of activity or inactivity:
- **Occupation layers**: dark, organic-rich soil with artifacts (people were living here)
- **Destruction layers**: ash, charcoal, broken material (fire, collapse, war)
- **Abandonment layers**: sterile soil with no artifacts (nobody was here)
- **Construction layers**: compacted fill, foundation stones (someone was building)

At Madan Kamdev, the stratigraphy tells a story: construction layers from the 9th century, occupation and renovation layers through the 12th century, a destruction layer (possibly an earthquake or invasion), and then centuries of abandonment with natural soil accumulation.`,
      analogy: 'Stratigraphy is like reading a stack of old newspapers. The one at the bottom is the oldest. Each newspaper is a "layer" recording what happened during that period. If someone shuffled the pile (earthquake, flooding), you\'d need clues within each paper (dates, events) to re-sort them. That\'s what archaeologists do with disturbed stratigraphy.',
      storyConnection: 'The old teacher showed the children a exposed earth wall at the edge of the ruins. "See that dark band? That\'s when people lived here — their fires and food waste darkened the soil. Below it, yellow clay — before anyone came. Above it, grey ash — something burned it all down." Centuries of history compressed into a metre of dirt.',
      checkQuestion: 'If you find a Roman coin in the same layer as a medieval pottery shard, does that mean Romans and medieval people lived at the same time?',
      checkAnswer: 'No — it means the layers were disturbed. This could happen through: animal burrows (bioturbation), tree roots, plowing, later construction, or looting. A Roman coin could have been dug up by a medieval farmer and redeposited in a later layer. This is why archaeologists look for signs of disturbance: mixed artifacts from different periods are a red flag, not evidence of time travel.',
      codeIntro: 'Visualize the stratigraphic layers of an archaeological site.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Stratigraphic profile of Madan Kamdev (simplified)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 7))
fig.patch.set_facecolor('#1f2937')

# Stratigraphic column
ax1.set_facecolor('#111827')

layers = [
    {'name': 'Modern topsoil', 'depth': (0, 0.3), 'color': '#4a3728', 'period': 'Present', 'artifacts': 'Roots, modern debris'},
    {'name': 'Abandonment', 'depth': (0.3, 0.8), 'color': '#8B7355', 'period': '1200-1900 CE', 'artifacts': 'None (sterile)'},
    {'name': 'Destruction layer', 'depth': (0.8, 1.0), 'color': '#555555', 'period': '~1200 CE', 'artifacts': 'Ash, charcoal, broken stone'},
    {'name': 'Late occupation', 'depth': (1.0, 1.5), 'color': '#3d2b1f', 'period': '1050-1200 CE', 'artifacts': 'Fine pottery, coins, carvings'},
    {'name': 'Renovation layer', 'depth': (1.5, 1.7), 'color': '#c4a35a', 'period': '~1050 CE', 'artifacts': 'Cut stone, plaster, fill'},
    {'name': 'Early occupation', 'depth': (1.7, 2.3), 'color': '#5c3d2e', 'period': '900-1050 CE', 'artifacts': 'Coarse pottery, tools, bones'},
    {'name': 'Construction fill', 'depth': (2.3, 2.6), 'color': '#d4a574', 'period': '~900 CE', 'artifacts': 'Compacted earth, foundation stones'},
    {'name': 'Natural subsoil', 'depth': (2.6, 3.0), 'color': '#c9b458', 'period': 'Pre-human', 'artifacts': 'Geological deposit'},
]

for layer in layers:
    d0, d1 = layer['depth']
    rect = plt.Rectangle((0, -d1), 1, d1 - d0, facecolor=layer['color'], edgecolor='white', linewidth=0.5)
    ax1.add_patch(rect)
    mid_y = -(d0 + d1) / 2
    ax1.text(0.5, mid_y, layer['name'], ha='center', va='center', color='white', fontsize=8, fontweight='bold')
    ax1.text(1.1, mid_y, layer['period'], ha='left', va='center', color='gray', fontsize=7)

ax1.set_xlim(-0.1, 2.2)
ax1.set_ylim(-3.1, 0.1)
ax1.set_ylabel('Depth (meters)', color='white')
ax1.set_title('Stratigraphic Column: Madan Kamdev', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.set_xticks([])

# Artifact count by depth
ax2.set_facecolor('#111827')
depth_bins = np.arange(0, 3.0, 0.1)
depth_centers = depth_bins[:-1] + 0.05

# Simulated artifact counts (more in occupation layers)
np.random.seed(42)
artifact_counts = np.zeros(len(depth_centers))
for layer in layers:
    d0, d1 = layer['depth']
    for i, d in enumerate(depth_centers):
        if d0 <= d < d1:
            if 'occupation' in layer['name'].lower():
                artifact_counts[i] = np.random.randint(8, 20)
            elif 'destruction' in layer['name'].lower():
                artifact_counts[i] = np.random.randint(12, 25)
            elif 'construction' in layer['name'].lower() or 'renovation' in layer['name'].lower():
                artifact_counts[i] = np.random.randint(3, 8)
            else:
                artifact_counts[i] = np.random.randint(0, 3)

ax2.barh(-depth_centers, artifact_counts, height=0.08, color='#f59e0b')
ax2.set_xlabel('Artifact count per 10cm layer', color='white')
ax2.set_ylabel('Depth (meters)', color='white')
ax2.set_title('Artifact Density by Depth', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Mark key layers
ax2.axhline(-0.9, color='#ef4444', linestyle='--', linewidth=1, alpha=0.5)
ax2.text(20, -0.85, 'Destruction', color='#ef4444', fontsize=8)

plt.tight_layout()
plt.show()

print("Reading the stratigraphy:")
print("  Deepest: natural subsoil (no human presence)")
print("  2.3-2.6m: construction — someone started building (~900 CE)")
print("  1.7-2.3m: early occupation — people lived here for 150 years")
print("  1.5-1.7m: renovation — the temple was rebuilt (~1050 CE)")
print("  1.0-1.5m: late occupation — the richest period")
print("  0.8-1.0m: destruction — fire/collapse ended the settlement")
print("  0.3-0.8m: abandonment — 700 years of silence")
print("  0-0.3m: modern topsoil")`,
      challenge: 'The destruction layer (0.8-1.0m) has the highest artifact density. Why would a destruction event produce MORE artifacts than normal occupation? Think about what happens when buildings collapse — everything inside becomes an artifact.',
      successHint: 'Stratigraphy is the backbone of archaeology. It provides relative dating (what came before what) even without knowing exact years. Combined with radiocarbon dating (next lesson), it gives both sequence and absolute dates.',
    },
    {
      title: 'Radiocarbon dating — the atomic clock in every living thing',
      concept: `How do we know the Madan Kamdev temples were built around 900 CE? One key tool is **radiocarbon dating** (also called carbon-14 dating), developed by Willard Libby in 1949 (Nobel Prize, 1960).

The principle:
1. Cosmic rays hit nitrogen in the atmosphere, creating **carbon-14** (¹⁴C), a radioactive isotope
2. ¹⁴C mixes with normal carbon (¹²C) and gets absorbed by plants through photosynthesis
3. Animals eat plants. All living things contain a known ratio of ¹⁴C to ¹²C
4. When an organism dies, it stops absorbing new ¹⁴C. The ¹⁴C already inside begins to **decay** at a known rate
5. **Half-life of ¹⁴C: 5,730 years** — every 5,730 years, half the ¹⁴C decays into nitrogen-14

By measuring the remaining ¹⁴C in a sample (charcoal, bone, wood, seed), we can calculate how long ago it died.

The math: **age = -8267 × ln(¹⁴C_remaining / ¹⁴C_original)**

Limitations: only works on organic material, maximum range ~50,000 years (after that, too little ¹⁴C remains to measure), and requires calibration against tree-ring records.`,
      analogy: 'Radiocarbon dating is like a sand timer. When a plant or animal is alive, the timer keeps getting refilled (fresh ¹⁴C from food and air). The moment it dies, the refilling stops and the sand starts running out. By measuring how much sand is left, you know how long ago it died. The half-life is how long it takes for half the sand to fall.',
      storyConnection: 'At Madan Kamdev, archaeologists found charcoal in the destruction layer — the remains of a fire that helped end the settlement. By radiocarbon dating that charcoal, they could pinpoint when the destruction happened: approximately 1200 CE (±50 years). The carbon atoms in that charcoal are atomic clocks, still ticking after 800 years.',
      checkQuestion: 'Can you radiocarbon-date a stone carving from Madan Kamdev?',
      checkAnswer: 'No. Radiocarbon dating only works on material that was once alive (organic material). Stone was never alive — it has no ¹⁴C to measure. However, you can date organic material found WITH the stone: charcoal in the mortar, straw in the plaster, even tiny organisms trapped in the stone surface. Dating the context dates the stone indirectly.',
      codeIntro: 'Simulate radiocarbon decay and calculate ages from ¹⁴C ratios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Radiocarbon decay
half_life = 5730  # years
decay_constant = np.log(2) / half_life  # λ

years = np.linspace(0, 50000, 500)

# Fraction of ¹⁴C remaining
fraction = np.exp(-decay_constant * years)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Decay curve
ax1.set_facecolor('#111827')
ax1.plot(years / 1000, fraction * 100, color='#22c55e', linewidth=2)
ax1.fill_between(years / 1000, fraction * 100, alpha=0.15, color='#22c55e')

# Mark half-lives
for n in range(1, 7):
    t = n * half_life
    f = 100 * (0.5 ** n)
    ax1.plot(t / 1000, f, 'o', color='#f59e0b', markersize=8, zorder=5)
    ax1.annotate(f'{n} half-lives\\n{f:.1f}%', xy=(t/1000, f),
                xytext=(t/1000 + 1.5, f + 5), color='#f59e0b', fontsize=7,
                arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=0.5))

# Mark Madan Kamdev
mk_age = 1100  # ~900 CE from 2025
mk_frac = np.exp(-decay_constant * mk_age) * 100
ax1.plot(mk_age / 1000, mk_frac, '*', color='#ef4444', markersize=15, zorder=5)
ax1.annotate(f'Madan Kamdev\\n(~{mk_age} years, {mk_frac:.1f}%)', xy=(mk_age/1000, mk_frac),
            xytext=(mk_age/1000 + 5, mk_frac), color='#ef4444', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax1.set_xlabel('Thousands of years ago', color='white')
ax1.set_ylabel('¹⁴C remaining (%)', color='white')
ax1.set_title('Radiocarbon Decay Curve', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Dating calculator
ax2.set_facecolor('#111827')

# Sample measurements (fraction of modern ¹⁴C)
samples = {
    'Madan Kamdev charcoal': 0.875,
    'Ahom-era wood': 0.945,
    'Indus Valley grain': 0.635,
    'Egyptian mummy': 0.680,
    'Ice Age bone': 0.15,
}

calculated_ages = {}
for name, frac in samples.items():
    age = -np.log(frac) / decay_constant
    calculated_ages[name] = age

names = list(calculated_ages.keys())
ages = list(calculated_ages.values())
colors_list = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

bars = ax2.barh(names, ages, color=colors_list)
ax2.set_xlabel('Calculated age (years before present)', color='white')
ax2.set_title('Radiocarbon Dating Results', color='white', fontsize=12)
ax2.tick_params(colors='gray')

for bar, age in zip(bars, ages):
    ce_year = 2025 - age
    label = f'{age:.0f} BP ({ce_year:.0f} CE)' if ce_year > 0 else f'{age:.0f} BP ({-ce_year:.0f} BCE)'
    ax2.text(bar.get_width() + 200, bar.get_y() + bar.get_height()/2,
             label, va='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Radiocarbon dating formula: age = -ln(fraction) / λ")
print(f"  Half-life: {half_life} years")
print(f"  Decay constant (λ): {decay_constant:.6f} per year")
print()
for name, frac in samples.items():
    age = calculated_ages[name]
    ce = 2025 - age
    print(f"  {name}: {frac*100:.1f}% ¹⁴C → {age:.0f} years old", end='')
    if ce > 0:
        print(f" (~{ce:.0f} CE)")
    else:
        print(f" (~{-ce:.0f} BCE)")`,
      challenge: 'A sample has only 1% of its original ¹⁴C. How old is it? Calculate: age = -ln(0.01) / decay_constant. Is this near the limit of radiocarbon dating? Why?',
      successHint: 'Radiocarbon dating revolutionized archaeology by giving absolute dates instead of just relative ones. The same exponential decay math governs nuclear medicine, geological dating, and carbon emissions tracking.',
    },
    {
      title: 'Artifact classification — the archaeology of patterns',
      concept: `At Madan Kamdev, thousands of stone fragments litter the hillside. How do archaeologists make sense of this chaos? Through **classification** — sorting artifacts into meaningful categories based on shared features.

The most common system is **typology**: grouping artifacts by form, function, and style.

For pottery (the most common archaeological find):
- **Form**: shape (bowl, jar, plate, cup)
- **Fabric**: clay type, temper (sand, shell, straw), firing temperature
- **Decoration**: painted, incised, stamped, plain
- **Function**: cooking (soot marks), storage (large, thick-walled), serving (fine, decorated)

For the stone carvings at Madan Kamdev:
- **Subject**: deity, decorative motif, architectural element
- **Style**: Pala dynasty influence, local Kamarupa style, hybrid
- **Material**: sandstone, granite, schist
- **Condition**: complete, fragmentary, weathered

Classification isn't just organizing — it reveals **patterns**. If 80% of cooking pots use local clay but 20% use clay from 200 km away, that tells you about trade networks. If carving styles change abruptly between two layers, it might mean a new ruling dynasty took over.`,
      analogy: 'Artifact classification is like sorting your music library. You can sort by genre (form), artist (maker), year (date), or mood (function). Any single song fits multiple categories. The power comes from cross-referencing: "all blues songs from the 1950s by artists from Chicago" narrows to a very specific group. Archaeologists do the same: "all cooking pots from the early occupation layer made with imported clay."',
      storyConnection: 'The children at Madan Kamdev found a stone fragment with a half-carved figure. Was it a deity? A dancer? A decorative border? By comparing it to complete carvings in museum collections and published typologies, the old teacher identified it as a celestial musician (gandharva) — one of dozens that once decorated the temple walls.',
      checkQuestion: 'Two pottery fragments look identical but one was found at Madan Kamdev and the other 500 km away in Bihar. What are the possible explanations?',
      checkAnswer: 'Several possibilities: 1) Trade — the pot was made in one place and transported. 2) Migration — the potter moved from one place to the other. 3) Independent invention — similar needs led to similar solutions. 4) Shared cultural influence — both potters learned from the same tradition. To distinguish these, you analyze the clay composition (trade or local?), check for other shared artifacts (cultural diffusion?), and look for intermediate sites along the route (trade network?).',
      codeIntro: 'Build a classification system for archaeological artifacts and visualize the results.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulated artifact database from Madan Kamdev
n_artifacts = 200

# Generate artifact attributes
artifact_types = np.random.choice(
    ['Pottery', 'Stone carving', 'Metal tool', 'Terracotta', 'Coin'],
    n_artifacts, p=[0.40, 0.25, 0.15, 0.12, 0.08])

# Layer (period) — correlated with artifact sophistication
layers = np.random.choice(
    ['Early (900-1000 CE)', 'Middle (1000-1100 CE)', 'Late (1100-1200 CE)'],
    n_artifacts, p=[0.25, 0.45, 0.30])

# Condition
conditions = np.random.choice(
    ['Complete', 'Fragment', 'Damaged'],
    n_artifacts, p=[0.15, 0.55, 0.30])

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

# 1. Artifact type distribution
ax = axes[0, 0]
ax.set_facecolor('#111827')
types, counts = np.unique(artifact_types, return_counts=True)
colors_t = ['#f59e0b', '#a855f7', '#3b82f6', '#22c55e', '#ef4444']
ax.pie(counts, labels=types, colors=colors_t, autopct='%1.0f%%',
       textprops={'color': 'white', 'fontsize': 9})
ax.set_title('Artifact Types', color='white', fontsize=12)

# 2. Artifacts by period
ax = axes[0, 1]
ax.set_facecolor('#111827')
periods = ['Early (900-1000 CE)', 'Middle (1000-1100 CE)', 'Late (1100-1200 CE)']
for i, period in enumerate(periods):
    mask = layers == period
    period_types = artifact_types[mask]
    type_counts = [np.sum(period_types == t) for t in types]
    ax.bar(np.arange(len(types)) + i*0.25, type_counts, width=0.25,
           label=period, color=['#3b82f6', '#22c55e', '#f59e0b'][i])

ax.set_xticks(np.arange(len(types)) + 0.25)
ax.set_xticklabels(types, rotation=30, ha='right', color='white', fontsize=8)
ax.set_ylabel('Count', color='white')
ax.set_title('Artifacts by Period', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# 3. Condition by type
ax = axes[1, 0]
ax.set_facecolor('#111827')
cond_labels = ['Complete', 'Fragment', 'Damaged']
cond_colors = ['#22c55e', '#f59e0b', '#ef4444']
bottom = np.zeros(len(types))
for cond, color in zip(cond_labels, cond_colors):
    vals = [np.sum((artifact_types == t) & (conditions == cond)) for t in types]
    ax.bar(types, vals, bottom=bottom, color=color, label=cond)
    bottom += vals

ax.set_ylabel('Count', color='white')
ax.set_title('Condition by Artifact Type', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_xticklabels(types, rotation=30, ha='right', fontsize=8)

# 4. Summary statistics
ax = axes[1, 1]
ax.set_facecolor('#111827')
summary_text = f"""MADAN KAMDEV EXCAVATION SUMMARY

Total artifacts: {n_artifacts}

By type:
{chr(10).join(f'  {t}: {c} ({c/n_artifacts*100:.0f}%)' for t, c in zip(types, counts))}

By period:
{chr(10).join(f'  {p}: {np.sum(layers==p)}' for p in periods)}

Completeness:
  Complete: {np.sum(conditions=='Complete')} ({np.sum(conditions=='Complete')/n_artifacts*100:.0f}%)
  Fragment: {np.sum(conditions=='Fragment')} ({np.sum(conditions=='Fragment')/n_artifacts*100:.0f}%)
  Damaged: {np.sum(conditions=='Damaged')} ({np.sum(conditions=='Damaged')/n_artifacts*100:.0f}%)"""

ax.text(0.05, 0.95, summary_text, transform=ax.transAxes, fontsize=8,
        color='white', verticalalignment='top', fontfamily='monospace')
ax.set_title('Classification Summary', color='white', fontsize=12)
ax.axis('off')

plt.tight_layout()
plt.show()

print("Key observations from classification:")
print("  1. Pottery dominates — consistent with any settlement site")
print("  2. Middle period has the most artifacts — peak of activity")
print("  3. Most artifacts are fragmentary — typical of a destruction event")
print("  4. Stone carvings are concentrated in middle/late periods")
print("     suggesting temple decoration was an ongoing project")`,
      challenge: 'Add a "material" attribute (local sandstone, imported granite, schist) to the artifacts. Cross-tabulate material × period. If imported granite increases over time, what does that tell you about the settlement\'s trade connections?',
      successHint: 'Classification is the foundation of all data science. The same principles — defining attributes, cross-tabulation, pattern recognition — apply whether you\'re classifying ancient pottery or customer segments in a business database.',
    },
    {
      title: 'Temple architecture — the geometry of the sacred',
      concept: `The temples at Madan Kamdev follow specific architectural rules that encode both religious symbolism and structural engineering. Understanding temple architecture requires both cultural knowledge and physics.

Key architectural elements of Hindu temples in Assam:
- **Garbhagriha** (sanctum): the innermost chamber housing the deity, always square
- **Mandapa**: the hall in front of the sanctum, for gatherings and rituals
- **Shikhara/Deul**: the tower above the sanctum, its shape indicates the style
- **Plinth**: the raised platform, protects against flooding

Structural engineering:
- **Post-and-lintel**: vertical posts supporting horizontal beams (simple but limited span)
- **Corbelling**: each layer of stone extends slightly beyond the one below, creating a pseudo-arch without true arch engineering
- **Load distribution**: thick walls at the base taper toward the top (pyramid principle)

The geometry is often based on the **Vastu Purusha Mandala**: a grid of 64 or 81 squares that prescribes the proportions and placement of every element. This is sacred geometry — mathematics as spiritual practice.`,
      analogy: 'A temple is like a Russian nesting doll (matryoshka). The outermost layer (outer walls) protects the next layer (mandapa), which leads to the innermost sacred space (garbhagriha). Each layer becomes smaller, darker, and more sacred. The architecture physically guides the worshipper on a journey from the mundane to the divine.',
      storyConnection: 'At Madan Kamdev, the children measured the temple foundation and discovered the proportions were not random. The sanctum was a perfect square. The mandapa was exactly 1.5× the sanctum\'s width. The overall length was 3× the sanctum width. These ratios matched prescriptions in ancient architectural texts (Shilpashastras) — a mathematical code hidden in stone.',
      checkQuestion: 'Why are most ancient temple sanctums (garbhagriha) windowless and dark?',
      checkAnswer: 'Multiple reasons: 1) Structural — windows weaken walls that support heavy towers. 2) Symbolic — darkness represents the womb (garbha = womb) from which creation emerges. 3) Sensory — removing visual distraction focuses awareness on the deity, enhanced by lamp light. 4) Thermal — thick, windowless walls maintain cool temperature in hot climates. The architecture simultaneously solves engineering, spiritual, and environmental design problems.',
      codeIntro: 'Draw a temple floor plan based on the Vastu Purusha Mandala grid.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 7))
fig.patch.set_facecolor('#1f2937')

# 1. Vastu Purusha Mandala (8×8 grid)
ax1.set_facecolor('#111827')
grid = 8

# Draw grid
for i in range(grid + 1):
    ax1.axhline(i, color='gray', linewidth=0.5, alpha=0.3)
    ax1.axvline(i, color='gray', linewidth=0.5, alpha=0.3)

# Sacred zones (from Vastu Shastra)
# Brahma sthana (center 4 squares)
brahma = plt.Rectangle((3, 3), 2, 2, facecolor='#f59e0b', alpha=0.5, label='Brahma (center)')
ax1.add_patch(brahma)

# Devika (inner ring)
for i in range(2, 6):
    for j in range(2, 6):
        if not (3 <= i <= 4 and 3 <= j <= 4):
            r = plt.Rectangle((i, j), 1, 1, facecolor='#22c55e', alpha=0.3)
            ax1.add_patch(r)

# Outer zones
for i in range(1, 7):
    for j in range(1, 7):
        if not (2 <= i <= 5 and 2 <= j <= 5):
            r = plt.Rectangle((i, j), 1, 1, facecolor='#3b82f6', alpha=0.2)
            ax1.add_patch(r)

ax1.set_xlim(-0.1, 8.1)
ax1.set_ylim(-0.1, 8.1)
ax1.set_aspect('equal')
ax1.set_title('Vastu Purusha Mandala (8×8)', color='white', fontsize=12)
ax1.text(4, 4, 'BRAHMA\\n(sanctum)', ha='center', va='center', color='white', fontsize=10, fontweight='bold')
ax1.text(4, 2.5, 'Devika zone', ha='center', color='white', fontsize=8)
ax1.text(4, 1.5, 'Paisachika zone', ha='center', color='white', fontsize=8)
ax1.tick_params(colors='gray')

# 2. Temple floor plan (based on Madan Kamdev proportions)
ax2.set_facecolor('#111827')

# Plinth
plinth = plt.Rectangle((1, 0.5), 18, 12, facecolor='#8B7355', alpha=0.3,
                         edgecolor='#8B7355', linewidth=2, label='Plinth')
ax2.add_patch(plinth)

# Steps
steps = plt.Rectangle((7.5, -0.5), 5, 1.5, facecolor='#a0a0a0', alpha=0.3,
                        edgecolor='gray', linewidth=1)
ax2.add_patch(steps)
ax2.text(10, 0.2, 'Steps', ha='center', color='white', fontsize=8)

# Mandapa (hall)
mandapa = plt.Rectangle((3, 2), 9, 8, facecolor='#3b82f6', alpha=0.3,
                          edgecolor='#3b82f6', linewidth=2, label='Mandapa (hall)')
ax2.add_patch(mandapa)

# Antarala (vestibule)
antarala = plt.Rectangle((12, 3.5), 2, 5, facecolor='#22c55e', alpha=0.3,
                           edgecolor='#22c55e', linewidth=2, label='Antarala')
ax2.add_patch(antarala)

# Garbhagriha (sanctum) — perfect square
garbha = plt.Rectangle((14, 3), 4, 6, facecolor='#f59e0b', alpha=0.4,
                         edgecolor='#f59e0b', linewidth=2, label='Garbhagriha')
ax2.add_patch(garbha)
ax2.text(16, 6, 'SANCTUM\\n(4×6 unit)', ha='center', va='center', color='white', fontsize=9, fontweight='bold')
ax2.text(7.5, 6, 'MANDAPA\\n(9×8 unit)', ha='center', va='center', color='white', fontsize=9, fontweight='bold')

# Pillars in mandapa
pillar_x = [4.5, 7.5, 10.5]
pillar_y = [3.5, 6, 8.5]
for px in pillar_x:
    for py in pillar_y:
        ax2.plot(px, py, 's', color='white', markersize=6)

# Walls
wall_thickness = 0.4
outer_wall = plt.Rectangle((2.6, 1.6), 16.4, 9.8, fill=False,
                             edgecolor='white', linewidth=2)
ax2.add_patch(outer_wall)

# Proportions annotation
ax2.annotate('', xy=(3, -0.8), xytext=(12, -0.8),
            arrowprops=dict(arrowstyle='<->', color='#f59e0b'))
ax2.text(7.5, -1.3, 'Mandapa: 1.5× sanctum width', ha='center', color='#f59e0b', fontsize=8)

ax2.set_xlim(-1, 21)
ax2.set_ylim(-2, 14)
ax2.set_aspect('equal')
ax2.set_title('Temple Floor Plan (Madan Kamdev style)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='upper right')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Temple proportions (Shilpashastra prescriptions):")
print("  Garbhagriha: always square (or near-square)")
print("  Mandapa width: 1.5× to 2× sanctum width")
print("  Total length: 2.5× to 3× sanctum width")
print("  Wall thickness: decreases toward the top")
print("  Tower height: 2× to 3× base width")
print()
print("These ratios aren't arbitrary — they balance:")
print("  1. Structural stability (weight distribution)")
print("  2. Acoustic properties (sound in the sanctum)")
print("  3. Symbolic proportions (cosmic geometry)")
print("  4. Practical use (crowd flow, ritual space)")`,
      challenge: 'Calculate the area of each zone (plinth, mandapa, antarala, garbhagriha). What percentage of the total plinth area is sacred (garbhagriha) vs. communal (mandapa)? Why is the most sacred space the smallest?',
      successHint: 'Temple architecture is where mathematics meets spirituality. The same principles of proportion, load distribution, and spatial design apply to modern buildings, bridges, and even spacecraft. Geometry is the universal language of structure.',
    },
    {
      title: 'Preservation science — saving the ruins from time',
      concept: `Madan Kamdev's carvings have survived 1,100 years, but they won't survive another 1,100 without intervention. **Preservation science** (also called conservation science) fights the forces that destroy archaeological sites:

Physical weathering:
- **Freeze-thaw**: water seeps into stone cracks, freezes (expands 9%), forces cracks wider
- **Thermal cycling**: daily heating and cooling causes expansion/contraction stress
- **Root damage**: tree roots grow into cracks with surprising force (up to 150 psi)

Chemical weathering:
- **Acid rain**: SO₂ + water = sulfuric acid, dissolves limestone/marble
- **Biological colonization**: lichens produce organic acids that etch stone surfaces
- **Salt crystallization**: dissolved salts migrate to the surface, crystallize, and flake off stone

Conservation techniques:
- **Consolidation**: injecting resins into weakened stone to strengthen it
- **Protective coatings**: water-repellent silicone treatments that let stone "breathe"
- **Environmental control**: managing vegetation, drainage, and visitor access
- **Documentation**: 3D scanning creates a permanent digital record even if the original is lost`,
      analogy: 'Preservation is like geriatric medicine for buildings. You can\'t make them young again, but you can slow the aging process: manage their environment (keep them dry), treat their diseases (remove biological growth), support their weak points (consolidate failing stone), and keep records of their condition (3D scanning). The goal is maximum lifespan, not perfection.',
      storyConnection: 'The old teacher pointed to a carving that had been "restored" by pouring cement over it in the 1950s. The cement was harder than the original sandstone — so when the two materials expanded at different rates, the cement tore chunks of original stone away. Bad conservation is worse than no conservation. The first rule: do no harm.',
      checkQuestion: 'Why is it often better to leave a ruin partially buried than to fully excavate it?',
      checkAnswer: 'Buried ruins are in a stable environment: constant temperature, constant moisture, no UV light, no acid rain. Exposing them to the surface environment initiates all the weathering processes at once. Many sites are intentionally left partially buried — only excavating what\'s needed for research and keeping the rest protected. The Terracotta Army warriors deteriorated rapidly after excavation because their paint, preserved underground for 2,200 years, oxidized within minutes of air exposure.',
      codeIntro: 'Model stone weathering rates under different environmental conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Stone weathering model
# Rate depends on: material, rainfall, temperature cycling, pollution

years = np.linspace(0, 1000, 200)

# Weathering rate as thickness lost (mm/year)
# Sandstone loses ~0.03-0.1 mm/year depending on conditions

conditions = {
    'Rural, dry climate': {'rate': 0.02, 'color': '#22c55e'},
    'Rural, wet climate (Assam)': {'rate': 0.06, 'color': '#3b82f6'},
    'Urban, moderate pollution': {'rate': 0.10, 'color': '#f59e0b'},
    'Urban, heavy pollution': {'rate': 0.20, 'color': '#ef4444'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Cumulative surface loss
ax1.set_facecolor('#111827')

carving_depth = 15  # mm (typical relief carving depth)
ax1.axhline(carving_depth, color='gray', linestyle=':', linewidth=1)
ax1.text(50, carving_depth + 0.5, 'Carving depth (15mm)', color='gray', fontsize=8)

for label, params in conditions.items():
    loss = params['rate'] * years
    ax1.plot(years, loss, linewidth=2, color=params['color'], label=label)

    # Find when carving is destroyed
    destroy_year = carving_depth / params['rate']
    if destroy_year <= 1000:
        ax1.plot(destroy_year, carving_depth, 'x', color=params['color'], markersize=10, markeredgewidth=2)

ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Surface loss (mm)', color='white')
ax1.set_title('Stone Surface Loss Over Time', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Conservation intervention comparison
ax2.set_facecolor('#111827')

# Without vs with conservation
base_rate = 0.06  # Assam climate
years_detail = np.linspace(0, 500, 200)

# No intervention
loss_none = base_rate * years_detail

# Conservation at year 100 (reduces rate by 70%)
loss_conserved = np.where(years_detail < 100,
                           base_rate * years_detail,
                           base_rate * 100 + base_rate * 0.3 * (years_detail - 100))

# Late conservation at year 300
loss_late = np.where(years_detail < 300,
                      base_rate * years_detail,
                      base_rate * 300 + base_rate * 0.3 * (years_detail - 300))

ax2.plot(years_detail, loss_none, color='#ef4444', linewidth=2, label='No conservation')
ax2.plot(years_detail, loss_conserved, color='#22c55e', linewidth=2, label='Conservation at year 100')
ax2.plot(years_detail, loss_late, color='#f59e0b', linewidth=2, label='Conservation at year 300')

ax2.axhline(carving_depth, color='gray', linestyle=':', linewidth=1)
ax2.text(10, carving_depth + 0.3, 'Carving destroyed', color='gray', fontsize=8)

ax2.axvline(100, color='#22c55e', linestyle='--', linewidth=0.5, alpha=0.5)
ax2.axvline(300, color='#f59e0b', linestyle='--', linewidth=0.5, alpha=0.5)

ax2.set_xlabel('Years from now', color='white')
ax2.set_ylabel('Surface loss (mm)', color='white')
ax2.set_title('Impact of Conservation Timing', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Weathering rates for sandstone:")
for label, params in conditions.items():
    destroy = carving_depth / params['rate']
    print(f"  {label}: {params['rate']:.2f} mm/yr → carving destroyed in {destroy:.0f} years")

print()
print(f"Madan Kamdev carvings (1100 years old, Assam climate):")
print(f"  Expected loss: {0.06 * 1100:.0f}mm — many carvings have indeed lost detail")
print(f"  With conservation now: saves {0.06 * 0.7 * 500:.0f}mm over next 500 years")
print(f"  Every decade of delay costs {0.06 * 0.7 * 10:.1f}mm of irreplaceable detail")`,
      challenge: 'Madan Kamdev is in Assam with heavy monsoon rainfall. If climate change increases rainfall by 20%, how does the weathering rate change? Modify base_rate to 0.072 (0.06 × 1.2). How many fewer years until the carvings are lost?',
      successHint: 'Preservation science is a race against entropy. From the ruins of Madan Kamdev to the climate-threatened monuments of Venice, the math is the same: rate × time = loss. Understanding the numbers helps prioritize what to save first.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Archaeology & Dating Methods — no prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for archaeology simulations. Click to start.</p>
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