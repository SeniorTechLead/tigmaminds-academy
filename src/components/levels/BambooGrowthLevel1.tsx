import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BambooGrowthLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Cell elongation vs. cell division — two ways to grow',
      concept: `Bamboo can grow up to **91 cm in a single day**. That's nearly 4 cm per hour — fast enough to watch with your eyes. How is this possible? The answer lies in understanding two fundamentally different growth mechanisms.

**Cell division** (mitosis): one cell splits into two smaller cells. This increases cell *number* but not total size initially. It's slow — a plant cell takes 12-24 hours to divide.

**Cell elongation**: existing cells absorb water and stretch, sometimes expanding to 10-100x their original length in just hours. This is fast.

Bamboo's secret: it uses **mostly cell elongation**, not cell division. The cells in the growing zones (called **intercalary meristems**) were formed weeks earlier during the underground rhizome stage. When the shoot emerges, these pre-formed cells simply elongate at extraordinary speed.

Think of it this way: bamboo spends weeks building a compressed spring (cell division in the rhizome), then releases it all at once (cell elongation in the shoot).`,
      analogy: 'Imagine an accordion. Compressing it (cell division, making many small folds) takes time. But pulling it open (cell elongation) is instant and dramatic. Bamboo grows like an accordion being stretched: the folds (cells) were already there, they just expand.',
      storyConnection: 'The story asks "Why does bamboo grow so fast?" and the answer is this: bamboo doesn\'t build new cells during its rapid growth — it inflates pre-built ones. It\'s not a sprint of construction; it\'s a sprint of expansion.',
      checkQuestion: 'If bamboo grows by elongation (not division), why doesn\'t the stem get thinner as it stretches — like pulling a piece of gum?',
      checkAnswer: 'Because cell elongation in plants is directional. The cellulose microfibrils in the cell wall are arranged in hoops (like barrel hoops), preventing sideways expansion. The cell can only stretch lengthwise. So the stem elongates without thinning — the "barrel hoops" maintain the diameter.',
      codeIntro: 'Compare growth by cell division vs. cell elongation over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

hours = np.arange(0, 72, 0.5)  # 3 days

# Cell division model: new cells every 24 hours, each cell is 10 micrometers
division_rate = 24  # hours per division
cell_size = 10  # micrometers
cells_by_division = 2 ** (hours / division_rate)
height_division = cells_by_division * cell_size / 1000  # mm

# Cell elongation model: 1000 pre-formed cells, each elongating
n_cells = 1000
initial_cell_length = 10  # micrometers
max_cell_length = 500  # micrometers (50x expansion)
elongation_rate = 0.15  # per hour

cell_length = initial_cell_length + (max_cell_length - initial_cell_length) * (1 - np.exp(-elongation_rate * hours))
height_elongation = n_cells * cell_length / 1000  # mm

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Growth comparison
ax1.set_facecolor('#111827')
ax1.plot(hours, height_division, color='#3b82f6', linewidth=2, label='Cell division only')
ax1.plot(hours, height_elongation, color='#22c55e', linewidth=2, label='Cell elongation (bamboo)')
ax1.set_xlabel('Time (hours)', color='white')
ax1.set_ylabel('Height (mm)', color='white')
ax1.set_title('Growth Speed: Division vs Elongation', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Annotate the difference at 24 hours
h_div_24 = 2 * cell_size / 1000
h_elong_24 = n_cells * (initial_cell_length + (max_cell_length - initial_cell_length) * (1 - np.exp(-elongation_rate * 24))) / 1000
ax1.annotate(f'After 24h:\
Division: {h_div_24:.1f} mm\
Elongation: {h_elong_24:.0f} mm',
             xy=(24, h_elong_24), xytext=(35, h_elong_24*0.6),
             color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Cell length over time
ax2.set_facecolor('#111827')
ax2.plot(hours, cell_length, color='#22c55e', linewidth=2)
ax2.fill_between(hours, initial_cell_length, cell_length, alpha=0.15, color='#22c55e')
ax2.axhline(initial_cell_length, color='gray', linestyle=':', linewidth=0.5)
ax2.axhline(max_cell_length, color='#f59e0b', linestyle='--', linewidth=1, label=f'Max: {max_cell_length}um')

ax2.set_xlabel('Time (hours)', color='white')
ax2.set_ylabel('Individual cell length (um)', color='white')
ax2.set_title('Cell Elongation: 10um to 500um', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"After 24 hours:")
print(f"  Cell division alone: {h_div_24:.2f} mm (barely visible)")
print(f"  Cell elongation: {h_elong_24:.0f} mm = {h_elong_24/10:.0f} cm")
print(f"  Elongation is {h_elong_24/h_div_24:.0f}x faster!")
print()
print("Bamboo's strategy: pre-build cells underground,")
print("then elongate them all at once above ground.")
print("Speed record: 91 cm/day (Phyllostachys edulis)")`,
      challenge: 'What if the bamboo had 5000 pre-formed cells instead of 1000? How tall would it get? At what point does adding more cells stop helping? (Hint: each cell has a maximum length.)',
      successHint: 'The distinction between cell division and cell elongation is fundamental to all plant biology. Trees grow slowly because they rely more on division; bamboo grows fast because it pre-loads thousands of cells ready for rapid elongation.',
    },
    {
      title: 'Auxin and gibberellin — the growth hormones',
      concept: `Bamboo's rapid elongation is driven by **plant hormones** — chemical signals produced in tiny amounts that control growth and development.

**Auxin (IAA — indole-3-acetic acid):**
- Produced in shoot tips and young leaves
- At low concentrations: promotes cell elongation (loosens cell walls)
- At high concentrations: inhibits growth (used for weed killers!)
- Controls phototropism (bending toward light)
- Moves directionally: always from shoot tip downward

**Gibberellin (GA — gibberellic acid):**
- Produced in young tissues, especially in intercalary meristems
- Promotes stem elongation dramatically (gibberellin-deficient mutants are dwarf plants)
- Activates enzymes that break down the cell wall, allowing elongation
- Works together with auxin — the combination is more powerful than either alone

In bamboo, gibberellin concentrations in the growing zones are exceptionally high during the rapid growth phase — 5-10x higher than in typical plants. This is the chemical fuel for the 91 cm/day growth.`,
      analogy: 'If the cell is a balloon, auxin loosens the rubber (makes the wall stretchable) and gibberellin inflates it (drives water uptake). You need both: loosening without inflation does nothing, and inflation without loosening would pop the balloon.',
      storyConnection: 'Why does bamboo grow so fast? Not magic — chemistry. Auxin and gibberellin flooding the intercalary meristems drive thousands of cells to elongate simultaneously. The "speed" of bamboo is really the speed of hormone-driven water uptake into pre-formed cells.',
      checkQuestion: 'Dwarf wheat varieties (which won the Green Revolution and prevented famines) have a mutation in a gibberellin gene. Why would shorter wheat be better for farming?',
      checkAnswer: 'Tall wheat "lodges" — falls over in wind and rain, especially when carrying heavy grain heads. Dwarf wheat (with reduced gibberellin response) stays short and upright, supporting heavier grain heads without falling. Same grain yield, less stem — more efficient. Norman Borlaug won the Nobel Peace Prize for developing these varieties.',
      codeIntro: 'Model how auxin and gibberellin concentrations affect cell elongation rate.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Dose-response curves for auxin and gibberellin
concentration = np.linspace(0, 100, 200)  # arbitrary units

# Auxin: bell-shaped (too much inhibits)
auxin_response = concentration * np.exp(-concentration / 20) / 7.4  # normalized

# Gibberellin: saturating (more is always better up to a point)
gibberellin_response = concentration / (10 + concentration)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Individual hormone responses
ax1.set_facecolor('#111827')
ax1.plot(concentration, auxin_response, color='#ef4444', linewidth=2, label='Auxin (bell-shaped)')
ax1.plot(concentration, gibberellin_response, color='#22c55e', linewidth=2, label='Gibberellin (saturating)')

# Mark optimal auxin concentration
opt_auxin = 20  # peak of bell curve
ax1.axvline(opt_auxin, color='#ef4444', linestyle=':', linewidth=0.5)
ax1.annotate('Optimal auxin\
(too much inhibits!)', xy=(opt_auxin, auxin_response[np.argmin(np.abs(concentration - opt_auxin))]),
             xytext=(opt_auxin+15, 0.9), color='#ef4444', fontsize=8,
             arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax1.set_xlabel('Hormone concentration (a.u.)', color='white')
ax1.set_ylabel('Growth response', color='white')
ax1.set_title('Hormone Dose-Response Curves', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Synergy: combined effect
ax2.set_facecolor('#111827')
auxin_levels = np.linspace(0, 50, 50)
ga_levels = np.linspace(0, 50, 50)
A, G = np.meshgrid(auxin_levels, ga_levels)

# Combined response with synergy factor
auxin_r = A * np.exp(-A / 20) / 7.4
ga_r = G / (10 + G)
# Synergy: combined effect > sum of individual effects
combined = auxin_r + ga_r + 0.5 * auxin_r * ga_r  # synergy term

im = ax2.contourf(A, G, combined, levels=20, cmap='YlGn', alpha=0.9)
plt.colorbar(im, ax=ax2, label='Elongation rate')

# Mark bamboo's operating point
ax2.plot(15, 40, '*', color='#ef4444', markersize=15, markeredgecolor='white')
ax2.text(17, 42, 'Bamboo\
(high GA!)', color='white', fontsize=9, fontweight='bold')

# Mark normal plant
ax2.plot(10, 10, 'o', color='white', markersize=8)
ax2.text(12, 12, 'Normal plant', color='white', fontsize=8)

ax2.set_xlabel('Auxin concentration', color='white')
ax2.set_ylabel('Gibberellin concentration', color='white')
ax2.set_title('Hormone Synergy: Auxin + Gibberellin', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key hormone facts:")
print("  Auxin: optimal at moderate levels; excess INHIBITS growth")
print("  Gibberellin: more = faster elongation (up to saturation)")
print("  Together: synergistic (1+1=3 effect)")
print()
print("Bamboo secret: extremely high gibberellin in growth zones")
print("  Normal plant GA: ~10-20 ng/g tissue")
print("  Bamboo shoot GA: ~50-100 ng/g tissue (5x higher)")
print("  This drives the fastest sustained growth in the plant kingdom.")`,
      challenge: 'Herbicides like 2,4-D are synthetic auxins at very high concentrations. Using the bell-shaped auxin curve, explain why flooding a weed with auxin kills it. (Hint: look at the right side of the curve.)',
      successHint: 'Plant hormones are like chemical programming languages — they tell cells what to do, when, and how much. Understanding auxin and gibberellin is the foundation of agriculture, horticulture, and biotechnology.',
    },
    {
      title: 'Turgor pressure — the hydraulic engine of growth',
      concept: `Cell elongation requires force. The force that drives plant cell expansion is **turgor pressure** — the hydraulic pressure inside the cell caused by water.

How it works:
1. The cell accumulates solutes (sugars, potassium ions) by active transport
2. Water follows the solutes by **osmosis** (moving from dilute to concentrated)
3. Water enters the cell, pressing outward against the cell wall
4. If the cell wall is loosened (by auxin), the pressure stretches the cell
5. More water enters to fill the expanded volume → more pressure → more stretching

**Turgor pressure in plants: 0.3-1.0 MPa** (3-10 atmospheres!). That's 3-10x the air pressure in a car tire. This is why plants are rigid even without bones — they're inflated like water balloons wrapped in tough cellophane.

When plants wilt, they've lost turgor pressure — not enough water to maintain the inflation. The cells go flaccid and the plant droops.`,
      analogy: 'Turgor pressure is like a water balloon inside a cardboard tube. The water pressure (turgor) pushes outward, making the tube rigid. If the cardboard (cell wall) is slightly softened at one end, the balloon stretches in that direction. This is exactly how plant cells elongate — directional softening of the cell wall + water pressure.',
      storyConnection: 'Bamboo\'s 91 cm/day growth is driven by turgor pressure pushing pre-formed cells outward. Each growing cell is a tiny hydraulic piston, and bamboo runs thousands of these pistons simultaneously. The "speed" of bamboo is the speed of water inflating cells.',
      checkQuestion: 'If turgor pressure drives growth, why doesn\'t bamboo grow faster when it rains more?',
      checkAnswer: 'Because the rate-limiting step is cell wall loosening, not water supply (as long as the soil has some moisture). You need both: wall loosening (controlled by hormones) AND water (for turgor). In well-watered soil, adding more water doesn\'t help — the hormones set the speed limit. It\'s like having a fire hose but a small nozzle: the nozzle (wall loosening) limits flow, not the supply.',
      codeIntro: 'Model turgor-driven cell expansion and the role of solute accumulation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Cell expansion model
# Turgor pressure (P) = osmotic pressure (pi) - wall pressure (Y)
# Growth rate = m * (P - Y_threshold)
# where m = cell wall extensibility, Y_threshold = yield threshold

time = np.arange(0, 24, 0.1)  # hours

# Solute accumulation drives osmotic pressure
solute = 0.5 + 0.3 * (1 - np.exp(-0.2 * time))  # MPa (osmotic pressure)

# Wall pressure decreases as wall loosens (auxin effect)
wall_yield = 0.3 * np.exp(-0.1 * time) + 0.1  # MPa

# Turgor = osmotic pressure - external water potential (assume 0)
turgor = solute  # in well-watered conditions

# Growth rate = extensibility * (turgor - yield threshold)
extensibility = 0.5  # relative units
growth_rate = extensibility * np.maximum(turgor - wall_yield, 0)

# Cell volume (integral of growth rate)
cell_volume = np.cumsum(growth_rate) * 0.1 + 1  # arbitrary units

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Turgor and wall yield
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(time, turgor, color='#3b82f6', linewidth=2, label='Turgor pressure')
ax.plot(time, wall_yield, color='#ef4444', linewidth=2, linestyle='--', label='Wall yield threshold')
ax.fill_between(time, wall_yield, turgor, where=turgor > wall_yield,
                alpha=0.2, color='#22c55e', label='Growth-driving force')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Pressure (MPa)', color='white')
ax.set_title('Turgor vs Wall Threshold', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# Growth rate
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(time, growth_rate, color='#22c55e', linewidth=2)
ax.fill_between(time, growth_rate, alpha=0.15, color='#22c55e')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Growth rate', color='white')
ax.set_title('Cell Elongation Rate', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Cell volume
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(time, cell_volume, color='#a855f7', linewidth=2)
ax.fill_between(time, 1, cell_volume, alpha=0.15, color='#a855f7')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Cell volume (relative)', color='white')
ax.set_title('Cell Volume Over Time', color='white', fontsize=11)
ax.tick_params(colors='gray')

# What-if: wilt scenario
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Normal vs drought (reduced osmotic pressure)
turgor_drought = solute * 0.5  # 50% less water
growth_drought = extensibility * np.maximum(turgor_drought - wall_yield, 0)
volume_drought = np.cumsum(growth_drought) * 0.1 + 1

ax.plot(time, cell_volume, color='#22c55e', linewidth=2, label='Well-watered')
ax.plot(time, volume_drought, color='#ef4444', linewidth=2, label='Drought (50% water)')
ax.set_xlabel('Time (hours)', color='white')
ax.set_ylabel('Cell volume (relative)', color='white')
ax.set_title('Water Stress Reduces Growth', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Turgor-driven growth model:")
print(f"  Osmotic pressure (start): {solute[0]:.2f} MPa")
print(f"  Osmotic pressure (peak): {max(solute):.2f} MPa")
print(f"  Wall yield threshold: {wall_yield[0]:.2f} -> {wall_yield[-1]:.2f} MPa")
print()
print("Growth requires: turgor > wall yield")
print("Two ways to increase growth:")
print("  1. More solutes (increase turgor) — bamboo accumulates sugars rapidly")
print("  2. Loosen walls (decrease yield) — auxin + gibberellin do this")
print("Bamboo does BOTH simultaneously — that's why it's so fast.")`,
      challenge: 'What if wall extensibility doubled (from 0.5 to 1.0), simulating the effect of more gibberellin? Modify the code and see how much faster the cell expands.',
      successHint: 'Turgor pressure is the plant\'s hydraulic system. Understanding it explains growth, wilting, stomatal opening, and even how plants move (like the Venus flytrap). It\'s physics and biology combined.',
    },
    {
      title: 'Intercalary meristems — bamboo\'s growth zones',
      concept: `Most plants grow only at their tips (apical meristems). Bamboo has a secret weapon: **intercalary meristems** — growth zones at every node (joint) along the stem.

A bamboo culm (stem) has 40-60 nodes. Between every pair of nodes is a band of rapidly dividing and elongating cells. So instead of one growth point, bamboo has 40-60 growth points working simultaneously.

**The math of parallel growth:**
- If each meristem adds 1.5 cm per day...
- And a culm has 60 meristems...
- Total growth = 60 × 1.5 = **90 cm/day**

This is how bamboo achieves its record-breaking speed — it's not that individual cells grow faster than other plants. It's that bamboo has **many growth zones working in parallel**.

Each internode (section between nodes) goes through the same sequence:
1. Cell division (early, underground)
2. Cell elongation (rapid, above ground)
3. Cell wall thickening (maturation, hardens the stem)

The lowest internodes mature first; the uppermost are still elongating when the lower ones have finished.`,
      analogy: 'Imagine building a skyscraper. A normal building crew works on one floor at a time (apical meristem). Bamboo is like having 60 crews, each working on a different floor simultaneously. Same speed per crew, but 60 floors go up at once.',
      storyConnection: 'The story\'s question — "why does bamboo grow so fast?" — has a beautifully simple answer: parallelism. Not faster cells, but more simultaneous growth zones. Nature\'s version of parallel processing.',
      checkQuestion: 'Once a bamboo culm reaches full height (in 2-3 months), it never grows taller. Why?',
      checkAnswer: 'The intercalary meristems are consumed during elongation — the meristematic cells differentiate into permanent tissue and stop dividing. Unlike trees, which have a permanent growth layer (cambium), bamboo shoots are like rockets with finite fuel. Once the fuel (meristematic cells) is used up, growth stops permanently. The culm then hardens but never gets taller.',
      codeIntro: 'Model bamboo growth with multiple intercalary meristems growing in parallel.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bamboo growth model: parallel intercalary meristems
n_nodes = 50
days = 60

# Each internode starts elongating at a different time
# Lower internodes start first, upper ones start last
start_days = np.linspace(0, 30, n_nodes)  # staggered start

# Each internode follows a sigmoid growth curve
max_internode_length = 30  # cm
growth_rate = 0.3  # per day

def internode_length(day, start_day):
    t = max(day - start_day, 0)
    return max_internode_length / (1 + np.exp(-growth_rate * (t - 10)))

# Calculate total height over time
time = np.arange(0, days, 0.5)
total_height = np.zeros_like(time)
internode_heights = np.zeros((n_nodes, len(time)))

for i in range(n_nodes):
    for j, day in enumerate(time):
        internode_heights[i, j] = internode_length(day, start_days[i])

total_height = np.sum(internode_heights, axis=0)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Total height over time
ax1.set_facecolor('#111827')
ax1.plot(time, total_height / 100, color='#22c55e', linewidth=2)  # meters
ax1.fill_between(time, total_height / 100, alpha=0.15, color='#22c55e')

# Daily growth rate
daily_growth = np.diff(total_height) / np.diff(time)
ax1_twin = ax1.twinx()
ax1_twin.plot(time[:-1], daily_growth, color='#f59e0b', linewidth=1.5, alpha=0.7, label='Daily growth rate')
ax1_twin.set_ylabel('Growth rate (cm/day)', color='#f59e0b')
ax1_twin.tick_params(axis='y', colors='#f59e0b')

ax1.set_xlabel('Days', color='white')
ax1.set_ylabel('Total height (meters)', color='white')
ax1.set_title('Bamboo Growth: 50 Meristems in Parallel', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Annotate peak growth
peak_idx = np.argmax(daily_growth)
ax1.annotate(f'Peak: {daily_growth[peak_idx]:.0f} cm/day', xy=(time[peak_idx], total_height[peak_idx]/100),
             xytext=(time[peak_idx]+5, total_height[peak_idx]/100*0.7),
             color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Individual internodes (show 10 sample internodes)
ax2.set_facecolor('#111827')
sample_indices = np.linspace(0, n_nodes-1, 10, dtype=int)
cmap = plt.cm.viridis(np.linspace(0.2, 0.9, len(sample_indices)))

for idx, color in zip(sample_indices, cmap):
    ax2.plot(time, internode_heights[idx], linewidth=1.5, color=color,
             label=f'Node {idx+1} (start day {start_days[idx]:.0f})')

ax2.set_xlabel('Days', color='white')
ax2.set_ylabel('Internode length (cm)', color='white')
ax2.set_title('Individual Internode Growth (10 of 50 shown)', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=6,
           ncol=2, loc='lower right')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Bamboo growth summary (50 internodes):")
print(f"  Final height: {total_height[-1]/100:.1f} meters")
print(f"  Peak growth rate: {max(daily_growth):.0f} cm/day")
print(f"  Days to reach 90% of final height: {time[np.argmin(np.abs(total_height - 0.9*total_height[-1]))]:.0f}")
print()
print("Key insight: each internode grows at ~3 cm/day")
print(f"But with {n_nodes} growing simultaneously: {n_nodes}*3 = {n_nodes*3} cm/day")
print("Parallelism, not speed, is bamboo's secret.")`,
      challenge: 'What if you doubled the number of nodes to 100? Would the bamboo grow twice as tall? Twice as fast? What practical limits might exist? (Hint: think about structural stability.)',
      successHint: 'Parallel growth is bamboo\'s engineering breakthrough. The same principle — doing many simple things simultaneously instead of one complex thing — is the foundation of parallel computing, distributed systems, and modular engineering.',
    },
    {
      title: 'Bamboo is a grass — not a tree',
      concept: `Here's a fact that surprises almost everyone: bamboo is a **grass**. It belongs to the family Poaceae (grasses), along with wheat, rice, corn, and sugarcane. It's the largest grass on Earth, but a grass nonetheless.

Evidence that bamboo is a grass:
- **Hollow stems** (culms): like all grasses, bamboo stems are hollow between nodes. Trees have solid wood.
- **No secondary growth**: bamboo stems don't thicken over time. A 1-year-old culm is the same diameter as a 10-year-old one. Trees grow wider every year (annual rings).
- **Intercalary meristems**: growth from nodes is a grass characteristic.
- **Parallel-veined leaves**: like rice and wheat. Trees (dicots) have net-veined leaves.
- **Fibrous root system**: a network of thin roots, not a taproot.
- **Monocot**: bamboo is a monocotyledon (one seed leaf), like all grasses.

The bamboo "forest" is actually a bamboo "lawn" — but one that grows 30 metres tall. The rhizome (underground stem) system connects all the culms, making a bamboo grove genetically one organism, like a giant grass spreading by runners.`,
      analogy: 'Bamboo being a grass is like discovering that a skyscraper was built using the same blueprint as a garden shed — just scaled up. The fundamental engineering (hollow stem, nodes, parallel veins) is identical. Bamboo is what happens when a grass evolves to compete with trees for light.',
      storyConnection: 'The story hints at bamboo\'s surprising identity: "the tallest grass pretending to be a tree." This captures the evolutionary insight — bamboo didn\'t evolve from trees. It evolved from grasses that grew taller and taller to reach light, eventually reaching tree height while keeping grass architecture.',
      checkQuestion: 'If a bamboo grove is one genetic organism connected by rhizomes, what happens when it flowers? (Many bamboo species flower once every 40-120 years, then die.)',
      checkAnswer: 'The entire grove flowers simultaneously (they share the same genetic clock), produces seeds, and then every culm dies. A 100-acre grove can die all at once. This is called "gregarious flowering" and it can be ecologically catastrophic — animals that depend on bamboo (like pandas) face sudden food loss. The species survives through the seeds, but recovery takes decades.',
      codeIntro: 'Compare bamboo anatomy with trees and grasses.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Grass vs tree vs bamboo comparison
features = ['Stem\
hollowness', 'Secondary\
growth', 'Growth\
speed', 'Max\
height', 'Root\
depth', 'Lifespan']

grass = [10, 0, 7, 1, 2, 2]
bamboo = [10, 0, 10, 8, 4, 6]
tree = [1, 10, 2, 10, 10, 10]

N = len(features)
angles = np.linspace(0, 2*np.pi, N, endpoint=False).tolist()
angles += angles[:1]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Radar chart
ax1 = plt.subplot(121, polar=True)
ax1.set_facecolor('#111827')

for data, name, color in [(grass, 'Grass (wheat)', '#f59e0b'),
                            (bamboo, 'Bamboo', '#22c55e'),
                            (tree, 'Tree (oak)', '#3b82f6')]:
    values = data + data[:1]
    ax1.plot(angles, values, 'o-', linewidth=2, label=name, color=color)
    ax1.fill(angles, values, alpha=0.1, color=color)

ax1.set_xticks(angles[:-1])
ax1.set_xticklabels(features, color='white', fontsize=8)
ax1.set_ylim(0, 11)
ax1.set_yticks([2, 4, 6, 8, 10])
ax1.set_yticklabels(['2', '4', '6', '8', '10'], color='gray', fontsize=7)
ax1.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=8)
ax1.set_title('Bamboo: A Grass That Acts Like a Tree', color='white', fontsize=11, pad=20)

# Cross-section comparison
ax2 = plt.subplot(122)
ax2.set_facecolor('#111827')

# Simplified cross-sections
theta = np.linspace(0, 2*np.pi, 100)

# Tree: solid with rings
circle_tree_outer = plt.Circle((-2, 0), 1.5, fill=False, color='#3b82f6', linewidth=2)
ax2.add_patch(circle_tree_outer)
for r in [0.3, 0.6, 0.9, 1.2]:
    ring = plt.Circle((-2, 0), r, fill=False, color='#3b82f6', linewidth=0.5, alpha=0.5)
    ax2.add_patch(ring)
ax2.text(-2, -2.2, 'Tree\
(solid, rings)', ha='center', color='#3b82f6', fontsize=9)

# Bamboo: hollow with thick wall
circle_bamboo_outer = plt.Circle((2, 0), 1.5, fill=False, color='#22c55e', linewidth=2)
circle_bamboo_inner = plt.Circle((2, 0), 0.8, fill=True, facecolor='#111827', edgecolor='#22c55e', linewidth=2)
# Wall fill
wall = plt.Circle((2, 0), 1.5, fill=True, facecolor='#22c55e', alpha=0.2)
ax2.add_patch(wall)
ax2.add_patch(circle_bamboo_inner)
ax2.add_patch(circle_bamboo_outer)
ax2.text(2, -2.2, 'Bamboo\
(hollow)', ha='center', color='#22c55e', fontsize=9)

ax2.set_xlim(-4.5, 4.5)
ax2.set_ylim(-3, 3)
ax2.set_aspect('equal')
ax2.set_title('Stem Cross-Section', color='white', fontsize=11)
ax2.set_xticks([])
ax2.set_yticks([])

plt.tight_layout()
plt.show()

print("Bamboo vs Tree — key differences:")
print("  Bamboo: hollow stem, no annual rings, no bark")
print("  Tree: solid wood, annual rings, bark with cambium")
print()
print("Bamboo vs Grass — key similarities:")
print("  Both: hollow stems, intercalary meristems, parallel veins")
print("  Both: monocots, fibrous roots, no secondary growth")
print()
print("Bamboo is just a very, very tall grass.")
print("The tallest species (Dendrocalamus giganteus) reaches 30+ meters.")
print("It achieved tree height without evolving tree anatomy.")`,
      challenge: 'If bamboo is a grass, how does it support its weight at 30m tall without solid wood? Research the role of silica deposits in bamboo cell walls and explain how a hollow tube can be as strong as a solid rod.',
      successHint: 'Bamboo being a grass teaches us that there are multiple engineering solutions to the same problem (reaching sunlight). Trees evolved solid wood; bamboo evolved hollow tubes with nodes. Both work — and bamboo did it faster.',
    },
    {
      title: 'Bamboo as sustainable material — nature\'s best building supply',
      concept: `Bamboo isn't just biologically remarkable — it's one of the most sustainable building materials on Earth.

**Advantages over wood and steel:**
- **Renewability**: bamboo reaches harvest size in 3-5 years. Trees take 20-60 years. A bamboo grove can be harvested every year (only mature culms are cut; new ones keep growing).
- **Tensile strength**: bamboo fibers have a tensile strength of 140-230 MPa — comparable to mild steel (250 MPa). Per unit weight, bamboo is stronger than steel.
- **Carbon sequestration**: bamboo absorbs 12 tonnes of CO2 per hectare per year (vs. 6 tonnes for a typical tree plantation). It grows so fast it locks up carbon at twice the rate.
- **Erosion control**: the dense rhizome network holds soil in place — critical in places like NE India's steep hillsides.
- **Zero waste**: every part is useful — culms for construction, shoots for food, leaves for animal feed, roots for erosion control.

**Challenges:**
- Durability: untreated bamboo is vulnerable to insects and fungi (3-5 year lifespan). Treatment extends this to 25+ years.
- Standardization: natural variation makes engineering calculations harder than with manufactured materials.
- Perception: bamboo is often seen as a "poor man's material" despite its excellent properties.`,
      analogy: 'Bamboo is like a 3D printer that runs on sunlight and water, outputting structural-grade building material every 3-5 years, indefinitely. No factory, no mining, no smelting, no toxic waste. The "printer" (bamboo grove) also cleans the air and prevents landslides while it works.',
      storyConnection: 'The story ends with bamboo as a gift — "the fastest, strongest, most generous plant." In NE India, bamboo is woven into every aspect of life: houses, bridges, baskets, musical instruments, food. Understanding bamboo science is understanding sustainable engineering.',
      checkQuestion: 'If bamboo is so strong and sustainable, why isn\'t it used more in modern construction?',
      checkAnswer: 'Three reasons: (1) Building codes are written for steel/concrete/wood — bamboo isn\'t in the standards, so engineers can\'t use it in official designs. This is changing (ISO 22156 is a new bamboo construction standard). (2) Natural variation — each culm is slightly different, unlike manufactured steel beams. (3) Cultural bias — bamboo is associated with poverty, not innovation. Overcoming these barriers is an active area of research and advocacy.',
      codeIntro: 'Compare bamboo with other building materials on sustainability and performance metrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Material comparison
materials = ['Bamboo', 'Wood\
(pine)', 'Steel', 'Concrete', 'Aluminum']

# Properties (normalized 0-10 or actual values)
tensile_strength = [185, 40, 250, 5, 310]  # MPa
density = [700, 500, 7800, 2400, 2700]  # kg/m3
co2_per_kg = [0.5, 0.7, 2.5, 0.15, 8.0]  # kg CO2 per kg material
renewability = [10, 6, 1, 1, 2]  # 0-10 scale
years_to_harvest = [4, 30, 0, 0, 0]  # 0 = mined/manufactured
cost_per_tonne = [200, 300, 800, 50, 2500]  # approximate USD

# Strength-to-weight ratio
strength_to_weight = [t/d*1000 for t, d in zip(tensile_strength, density)]

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
colors = ['#22c55e', '#f59e0b', '#6b7280', '#94a3b8', '#3b82f6']

# Strength to weight
ax = axes[0, 0]
ax.set_facecolor('#111827')
bars = ax.bar(range(len(materials)), strength_to_weight, color=colors, alpha=0.85)
ax.set_xticks(range(len(materials)))
ax.set_xticklabels(materials, color='white', fontsize=9)
ax.set_ylabel('Strength/weight (MPa·m³/kg × 1000)', color='white')
ax.set_title('Strength-to-Weight Ratio (higher = better)', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, val in zip(bars, strength_to_weight):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
            f'{val:.0f}', ha='center', color='white', fontsize=9)

# CO2 footprint
ax = axes[0, 1]
ax.set_facecolor('#111827')
bars = ax.bar(range(len(materials)), co2_per_kg, color=colors, alpha=0.85)
ax.set_xticks(range(len(materials)))
ax.set_xticklabels(materials, color='white', fontsize=9)
ax.set_ylabel('kg CO2 per kg material', color='white')
ax.set_title('Carbon Footprint (lower = better)', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, val in zip(bars, co2_per_kg):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
            f'{val}', ha='center', color='white', fontsize=9)

# Renewability vs cost
ax = axes[1, 0]
ax.set_facecolor('#111827')
for i, mat in enumerate(materials):
    ax.scatter(cost_per_tonne[i], renewability[i], s=200, color=colors[i],
               edgecolor='white', linewidth=1, zorder=5)
    ax.annotate(mat.replace('\
', ' '), xy=(cost_per_tonne[i], renewability[i]),
                xytext=(cost_per_tonne[i]+50, renewability[i]+0.3),
                color=colors[i], fontsize=8)
ax.set_xlabel('Cost (USD/tonne)', color='white')
ax.set_ylabel('Renewability (0-10)', color='white')
ax.set_title('Cost vs Renewability', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Carbon sequestration comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
land_types = ['Bamboo\
grove', 'Tree\
plantation', 'Grassland', 'Cropland']
co2_sequestered = [12, 6, 2, 1]  # tonnes CO2/hectare/year
seq_colors = ['#22c55e', '#3b82f6', '#f59e0b', '#6b7280']
bars = ax.bar(range(len(land_types)), co2_sequestered, color=seq_colors, alpha=0.85)
ax.set_xticks(range(len(land_types)))
ax.set_xticklabels(land_types, color='white', fontsize=9)
ax.set_ylabel('Tonnes CO2/hectare/year', color='white')
ax.set_title('Carbon Sequestration Rate', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, val in zip(bars, co2_sequestered):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2,
            f'{val}', ha='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Bamboo: the numbers")
print(f"  Strength/weight: {strength_to_weight[0]:.0f} (vs steel: {strength_to_weight[2]:.0f})")
print(f"  CO2 footprint: {co2_per_kg[0]} kg/kg (vs steel: {co2_per_kg[2]} kg/kg)")
print(f"  Harvest cycle: {years_to_harvest[0]} years (vs wood: {years_to_harvest[1]} years)")
print(f"  Carbon sequestration: 12 tonnes CO2/ha/year (2x trees)")
print()
print("Per unit weight, bamboo is comparable to steel in strength")
print("but with 5x less CO2 and infinite renewability.")
print("The challenge is standardization and cultural acceptance.")`,
      challenge: 'Calculate: if NE India replaced 10% of its steel construction with bamboo, how many tonnes of CO2 would be saved annually? Assume NE India uses 500,000 tonnes of construction steel per year.',
      successHint: 'Bamboo is where biology meets engineering meets sustainability. From cell elongation to global carbon budgets — understanding bamboo science is understanding one of the most important materials for a sustainable future.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Plant Growth Hormones & Cell Biology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for growth simulations. Click to start.</p>
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