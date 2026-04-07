import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TejimolaLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Plant totipotency — every cell contains the blueprint for an entire organism',
      concept: `In the story, Tejimola is reborn from a plant — and remarkably, this reflects a real biological phenomenon. Plant cells possess **totipotency**: the ability of a single cell to regenerate an entire organism.

Unlike animal cells (which lose this ability early in development), most plant cells retain their full genetic potential. A single cell from a leaf, root, or stem can — under the right conditions — divide and differentiate into a complete new plant with roots, stems, leaves, and flowers.

This was proven in 1958 by F.C. Steward, who grew a complete carrot plant from a single root cell in culture. The implications were enormous:

- Every plant cell contains the full genome (all the DNA needed for every cell type)
- Differentiation in plants is mostly about which genes are turned ON/OFF, not about losing DNA
- The "reprogramming" signals are primarily **plant hormones**: auxin and cytokinin
- The ratio of auxin to cytokinin determines cell fate:
  - High auxin / low cytokinin → root formation
  - Low auxin / high cytokinin → shoot formation
  - Equal ratio → undifferentiated callus (mass of cells)

This is the foundation of **plant tissue culture** — the technology that enables cloning, genetic engineering, and conservation of endangered plant species.`,
      analogy: 'Imagine every brick in a house contained the complete blueprint for the entire house. If you took one brick, added water and the right chemical signals, it would rebuild itself into a complete house — walls, roof, plumbing, and all. That is plant totipotency. Animal cells are like bricks that lost their blueprints during construction — they remember only how to be a wall or a floor.',
      storyConnection: 'Tejimola\'s rebirth from a plant is the most literal expression of totipotency in folklore. The story captures an ancient observation that farmers have known for millennia: plants can regenerate from fragments. A broken branch becomes a new tree. A piece of root becomes a new plant. Tejimola\'s story is regeneration biology told as myth.',
      checkQuestion: 'If plant cells are totipotent, why can\'t you just put a leaf in water and grow a new plant every time? What additional conditions are needed?',
      checkAnswer: 'A leaf in plain water lacks the hormonal signals needed to reprogram differentiated cells. You need: (1) wounding or enzyme treatment to release cells from their tissue context, (2) appropriate hormone ratios (auxin + cytokinin) to trigger dedifferentiation, (3) sterile conditions (bacteria/fungi would outcompete plant cells), (4) correct nutrients (minerals, sugars, vitamins), and (5) appropriate light and temperature. Some species (like pothos or willow) do root easily in water because they produce enough endogenous auxin, but most plants need external hormone application.',
      codeIntro: 'Model the hormonal control of plant cell fate and simulate how different auxin/cytokinin ratios drive differentiation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Hormonal control of plant cell fate
# Auxin:Cytokinin ratio determines differentiation outcome

def cell_fate_probability(auxin, cytokinin):
    """
    Model: probability of each cell fate based on hormone concentrations.
    Returns (p_root, p_shoot, p_callus)
    """
    ratio = (auxin + 0.01) / (cytokinin + 0.01)
    total = auxin + cytokinin

    # Root: high auxin/cytokinin ratio
    p_root = 1 / (1 + np.exp(-3 * (np.log10(ratio + 0.01) - 0.5)))
    # Shoot: low auxin/cytokinin ratio
    p_shoot = 1 / (1 + np.exp(3 * (np.log10(ratio + 0.01) + 0.5)))
    # Callus: intermediate ratio + sufficient total hormone
    p_callus = np.exp(-((np.log10(ratio + 0.01)) ** 2) / 0.5) * (1 - np.exp(-total / 2))

    # Normalize
    total_p = p_root + p_shoot + p_callus + 0.01
    return p_root / total_p, p_shoot / total_p, p_callus / total_p

# Generate hormone concentration grid
auxin_range = np.logspace(-2, 2, 100)  # 0.01 to 100 mg/L
cytokinin_range = np.logspace(-2, 2, 100)
AUX, CYT = np.meshgrid(auxin_range, cytokinin_range)

P_root = np.zeros_like(AUX)
P_shoot = np.zeros_like(AUX)
P_callus = np.zeros_like(AUX)

for i in range(100):
    for j in range(100):
        P_root[i,j], P_shoot[i,j], P_callus[i,j] = cell_fate_probability(AUX[i,j], CYT[i,j])

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Plant Totipotency: Hormonal Control of Cell Fate',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Root probability map
ax = axes[0, 0]
im1 = ax.contourf(np.log10(auxin_range), np.log10(cytokinin_range), P_root,
                   levels=20, cmap='Greens')
plt.colorbar(im1, ax=ax, label='P(root)')
ax.set_xlabel('log₁₀[Auxin] (mg/L)', color='white')
ax.set_ylabel('log₁₀[Cytokinin] (mg/L)', color='white')
ax.set_title('Root Formation Probability', color='white', fontsize=11)
ax.plot([0.5, 2], [-2, 0], 'w--', linewidth=1, alpha=0.5)
ax.annotate('High auxin →\\\nROOTS', xy=(1.5, -1.5), color='white', fontsize=9, fontweight='bold')

# Plot 2: Shoot probability map
ax = axes[0, 1]
im2 = ax.contourf(np.log10(auxin_range), np.log10(cytokinin_range), P_shoot,
                   levels=20, cmap='Blues')
plt.colorbar(im2, ax=ax, label='P(shoot)')
ax.set_xlabel('log₁₀[Auxin] (mg/L)', color='white')
ax.set_ylabel('log₁₀[Cytokinin] (mg/L)', color='white')
ax.set_title('Shoot Formation Probability', color='white', fontsize=11)
ax.annotate('High cytokinin →\\\nSHOOTS', xy=(-1.5, 1.5), color='white', fontsize=9, fontweight='bold')

# Plot 3: Callus probability map
ax = axes[0, 2]
im3 = ax.contourf(np.log10(auxin_range), np.log10(cytokinin_range), P_callus,
                   levels=20, cmap='YlOrRd')
plt.colorbar(im3, ax=ax, label='P(callus)')
ax.set_xlabel('log₁₀[Auxin] (mg/L)', color='white')
ax.set_ylabel('log₁₀[Cytokinin] (mg/L)', color='white')
ax.set_title('Callus Formation Probability', color='white', fontsize=11)
ax.annotate('Equal ratio →\\\nCALLUS', xy=(-0.3, 0), color='white', fontsize=9, fontweight='bold')

# Plot 4: Cell fate diagram (1D slice at fixed total hormone)
ax = axes[1, 0]
ratios = np.logspace(-2, 2, 200)
p_r = np.array([cell_fate_probability(r * 5 / (1 + r), 5 / (1 + r))[0] for r in ratios])
p_s = np.array([cell_fate_probability(r * 5 / (1 + r), 5 / (1 + r))[1] for r in ratios])
p_c = np.array([cell_fate_probability(r * 5 / (1 + r), 5 / (1 + r))[2] for r in ratios])
ax.fill_between(np.log10(ratios), 0, p_r, color='#22c55e', alpha=0.7, label='Root')
ax.fill_between(np.log10(ratios), p_r, p_r + p_c, color='#f59e0b', alpha=0.7, label='Callus')
ax.fill_between(np.log10(ratios), p_r + p_c, p_r + p_c + p_s, color='#3b82f6', alpha=0.7, label='Shoot')
ax.set_xlabel('log₁₀(Auxin/Cytokinin ratio)', color='white')
ax.set_ylabel('Probability', color='white')
ax.set_title('Cell Fate vs Hormone Ratio', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 5: Tissue culture timeline
ax = axes[1, 1]
stages = ['Explant\\\n(day 0)', 'Callus\\\n(week 2)', 'Shoots\\\n(week 6)', 'Roots\\\n(week 10)', 'Plantlet\\\n(week 14)']
sizes = [1, 5, 15, 25, 40]  # relative size
colors_stage = ['#64748b', '#f59e0b', '#3b82f6', '#22c55e', '#a855f7']
for i, (stage, size, color) in enumerate(zip(stages, sizes, colors_stage)):
    circle = plt.Circle((i * 2.5 + 1, 1), size / 20, color=color, alpha=0.7)
    ax.add_patch(circle)
    ax.text(i * 2.5 + 1, -0.5, stage, ha='center', color='white', fontsize=8)
    if i < len(stages) - 1:
        ax.annotate('', xy=((i+1) * 2.5 + 1 - sizes[i+1]/20, 1),
                    xytext=(i * 2.5 + 1 + sizes[i]/20, 1),
                    arrowprops=dict(arrowstyle='->', color='white', lw=1.5))
ax.set_xlim(-0.5, 12)
ax.set_ylim(-1, 3)
ax.set_title('Tissue Culture Timeline', color='white', fontsize=11)
ax.set_xticks([]); ax.set_yticks([])

# Plot 6: Historical milestones
ax = axes[1, 2]
milestones = [
    (1902, 'Haberlandt:\\\ntotipotency concept'),
    (1934, 'White: root\\\nculture success'),
    (1958, 'Steward: carrot\\\nfrom single cell'),
    (1962, 'Murashige & Skoog:\\\nMS medium'),
    (1983, 'First transgenic\\\nplant'),
    (2012, 'CRISPR gene\\\nediting in plants'),
]
for i, (year, label) in enumerate(milestones):
    ax.plot(year, i, 'o', color='#f59e0b', markersize=10, markeredgecolor='white')
    ax.text(year + 3, i, label, color='white', fontsize=8, va='center')
ax.set_xlabel('Year', color='white')
ax.set_title('Plant Tissue Culture Milestones', color='white', fontsize=11)
ax.set_yticks([])
ax.set_xlim(1895, 2025)

plt.tight_layout()
plt.show()

print("Plant Totipotency & Hormonal Control")
print("=" * 50)
print()
print("Skoog & Miller (1957) hormone ratio model:")
print("  High auxin / low cytokinin → ROOTS")
print("  Low auxin / high cytokinin → SHOOTS")
print("  Equal ratio → CALLUS (undifferentiated)")
print()
print("This is how tissue culture works:")
print("  1. Take an explant (piece of plant tissue)")
print("  2. Place on medium with auxin + cytokinin")
print("  3. Adjust ratio to get desired organ")
print("  4. Transfer to rooting medium (high auxin)")
print("  5. Acclimatize to soil")
print()
print("Every cell in that explant contains the FULL genome.")
print("Hormones act as master switches, activating different gene sets.")
print("This is totipotency — the basis of plant biotechnology.")`,
      challenge: 'Add a third dimension: light. In tissue culture, light intensity and photoperiod affect morphogenesis alongside hormones. Model how continuous light vs. 16/8 light/dark vs. darkness affects shoot and root formation probabilities. Some plants regenerate better in the dark (root formation), while light is needed for shoot chlorophyll development.',
      successHint: 'Plant totipotency is one of the most powerful features of plant biology. It means that, in principle, any plant cell can become any other plant cell — an ability that most animal cells lose during embryonic development. This single property underpins all of modern plant biotechnology: cloning, genetic engineering, conservation, and crop improvement.',
    },
    {
      title: 'Meristem culture — cloning plants from growing tips',
      concept: `**Meristems** are regions of undifferentiated, actively dividing cells — the plant\'s stem cell factories. They are found at shoot tips (apical meristems), root tips, and in the cambium layer of stems.

**Meristem culture** is the technique of excising a tiny meristem tip (0.1-0.5 mm) and growing it into a complete plant. This is the gold standard of plant cloning because:

1. **Virus elimination**: Meristem tips are often virus-free because viruses spread through the vascular system, which hasn\'t yet developed in the meristem. By culturing just the tip, you can produce disease-free clones.

2. **Genetic uniformity**: Every plant from a meristem clone is genetically identical to the parent (and to each other). This is essential for commercial crops where uniformity = quality.

3. **Rapid multiplication**: One meristem can produce thousands of clones through repeated subculturing. A single banana meristem can generate 10,000 plantlets in a year.

4. **Conservation**: Endangered species can be preserved and multiplied from a single surviving individual.

The meristem contains 3 cell layers (L1, L2, L3) called **tunica-corpus**:
- L1 (outermost): becomes the epidermis
- L2 (middle): becomes the subepidermis and gametes
- L3 (inner corpus): becomes the internal tissues

All three layers must be included in the explant for a genetically complete clone.`,
      analogy: 'Meristem culture is like photocopying the master document of a book. The meristem IS the master copy — it contains the undifferentiated template from which all other cell types are printed. By copying the master (culturing the meristem), you produce perfect replicas. If the master copy is clean (virus-free), all copies will be clean too.',
      storyConnection: 'Tejimola\'s transformation from plant back to human can be seen as an extreme version of meristem regeneration — the growing tip of the plant containing all the information needed to recreate a complete being. In reality, a meristem tip smaller than a pinhead contains all the genetic and cellular information to regenerate an entire plant.',
      checkQuestion: 'A farmer has a single surviving mango tree of a prized variety. Using meristem culture, how many genetically identical trees could be produced in 2 years, and what is the limiting factor?',
      checkAnswer: 'Starting with multiple meristems from the original tree, each subcultured every 4-6 weeks with a multiplication rate of 3-5x per cycle, you could produce 10,000-50,000 plantlets in 2 years. The limiting factor is not the biology but the logistics: each transfer requires sterile conditions, trained technicians, and acclimatization greenhouse space. The biological limit (how fast cells divide) is rarely the bottleneck — the human labor and infrastructure are. This is why large commercial tissue culture labs in India produce millions of banana and orchid plantlets annually.',
      codeIntro: 'Simulate meristem culture multiplication rates and model how different parameters affect clone production efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Meristem culture multiplication model

def meristem_multiplication(initial_meristems, cycles, multiplication_rate,
                             contamination_rate=0.05, success_rate=0.85):
    """
    Model meristem multiplication over culture cycles.
    Each cycle: explants multiply, some contaminate, some fail.
    """
    populations = [initial_meristems]
    losses_contam = [0]
    losses_fail = [0]

    current = initial_meristems
    for c in range(cycles):
        # Multiply
        new = current * multiplication_rate
        # Contamination loss
        contam = int(new * contamination_rate * np.random.uniform(0.5, 1.5))
        # Other failures (browning, hyperhydricity)
        fail = int(new * (1 - success_rate) * np.random.uniform(0.5, 1.5))
        # Surviving
        surviving = max(1, int(new - contam - fail))

        populations.append(surviving)
        losses_contam.append(contam)
        losses_fail.append(fail)
        current = surviving

    return populations, losses_contam, losses_fail

# Different species have different multiplication rates
species_params = {
    'Banana': {'mult_rate': 4.0, 'contam': 0.03, 'success': 0.90},
    'Orchid':  {'mult_rate': 5.0, 'contam': 0.05, 'success': 0.85},
    'Mango':   {'mult_rate': 2.5, 'contam': 0.08, 'success': 0.75},
    'Potato':  {'mult_rate': 6.0, 'contam': 0.02, 'success': 0.92},
    'Teak':    {'mult_rate': 2.0, 'contam': 0.10, 'success': 0.70},
}

n_cycles = 12  # ~1 year (monthly subcultures)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Meristem Culture: Cloning Plants from Growing Tips',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

colors_sp = ['#f59e0b', '#a855f7', '#22c55e', '#3b82f6', '#ef4444']

# Plot 1: Growth curves for different species
ax = axes[0, 0]
for i, (species, params) in enumerate(species_params.items()):
    pop, _, _ = meristem_multiplication(10, n_cycles, **params)
    ax.semilogy(range(len(pop)), pop, color=colors_sp[i], linewidth=2.5,
                marker='o', markersize=4, label=f'{species} (×{params["mult_rate"]}/cycle)')
ax.set_xlabel('Culture cycle (months)', color='white')
ax.set_ylabel('Number of plantlets (log scale)', color='white')
ax.set_title('Multiplication Curves by Species', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 2: Banana detailed breakdown
ax = axes[0, 1]
pop, contam, fail = meristem_multiplication(10, n_cycles, **species_params['Banana'])
x = range(len(pop))
ax.bar(x, pop, color='#f59e0b', label='Surviving', edgecolor='none', width=0.8)
ax.bar(x, contam, bottom=pop, color='#ef4444', label='Contaminated', edgecolor='none', width=0.8)
bottoms = [p + c for p, c in zip(pop, contam)]
ax.bar(x, fail, bottom=bottoms, color='#64748b', label='Failed', edgecolor='none', width=0.8)
ax.set_xlabel('Cycle', color='white')
ax.set_ylabel('Plantlet count', color='white')
ax.set_title(f'Banana: {pop[-1]:,} from 10 meristems', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Effect of contamination rate
ax = axes[0, 2]
contam_rates = np.linspace(0, 0.20, 20)
final_counts = []
for cr in contam_rates:
    pop_cr, _, _ = meristem_multiplication(10, n_cycles, 4.0, cr, 0.85)
    final_counts.append(pop_cr[-1])
ax.plot(contam_rates * 100, final_counts, color='#ef4444', linewidth=2.5)
ax.fill_between(contam_rates * 100, 0, final_counts, color='#ef4444', alpha=0.1)
ax.set_xlabel('Contamination rate (%)', color='white')
ax.set_ylabel('Final plantlet count (from 10)', color='white')
ax.set_title('Impact of Contamination on Yield', color='white', fontsize=11)
ax.annotate(f'Clean lab (2%): {final_counts[2]:,.0f}', xy=(2, final_counts[2]),
            color='#22c55e', fontsize=9, fontweight='bold')
ax.annotate(f'Poor lab (15%): {final_counts[15]:,.0f}', xy=(15, final_counts[15]),
            color='#ef4444', fontsize=9, fontweight='bold')

# Plot 4: Virus elimination success rates
ax = axes[1, 0]
meristem_sizes_mm = [0.1, 0.2, 0.3, 0.5, 1.0, 2.0, 5.0]
virus_free_pct = [99, 95, 85, 65, 30, 10, 2]
survival_pct = [10, 30, 55, 75, 90, 95, 98]
ax.plot(meristem_sizes_mm, virus_free_pct, color='#22c55e', linewidth=2.5,
        marker='o', markersize=6, label='Virus-free (%)')
ax.plot(meristem_sizes_mm, survival_pct, color='#3b82f6', linewidth=2.5,
        marker='s', markersize=6, label='Survival (%)')
ax.fill_between(meristem_sizes_mm, virus_free_pct, survival_pct,
                where=[v > s for v, s in zip(virus_free_pct, survival_pct)],
                alpha=0.1, color='#22c55e')
ax.set_xlabel('Meristem size (mm)', color='white')
ax.set_ylabel('Percentage (%)', color='white')
ax.set_title('Meristem Size: Virus-Free vs Survival', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.annotate('Optimal: 0.2-0.3 mm\\\n(best trade-off)', xy=(0.25, 70),
            color='#f59e0b', fontsize=9, fontweight='bold')

# Plot 5: Tunica-corpus meristem structure
ax = axes[1, 1]
# Draw dome-shaped meristem with L1, L2, L3 layers
theta = np.linspace(0, np.pi, 100)
for r, label, color in [(3.0, 'L1 (epidermis)', '#22c55e'),
                          (2.3, 'L2 (subepidermis)', '#3b82f6'),
                          (1.5, 'L3 (corpus)', '#f59e0b')]:
    x = r * np.cos(theta)
    y = r * np.sin(theta)
    ax.fill_between(x, 0, y, color=color, alpha=0.4)
    ax.plot(x, y, color=color, linewidth=2)
    ax.text(0, r * 0.4, label, ha='center', color='white', fontsize=9, fontweight='bold')

# Leaf primordia
for angle in [0.3, 2.8]:
    lx = 3.5 * np.cos(angle)
    ly = 3.5 * np.sin(angle)
    ax.annotate('Leaf\\\nprimordium', xy=(lx, ly), xytext=(lx + 1.5 * np.sign(np.cos(angle)), ly + 1),
                arrowprops=dict(arrowstyle='->', color='white'), color='white', fontsize=8)

ax.set_xlim(-5, 5)
ax.set_ylim(-0.5, 5)
ax.set_title('Meristem Structure (Tunica-Corpus)', color='white', fontsize=11)
ax.set_xticks([]); ax.set_yticks([])
ax.text(0, -0.3, '← 0.2-0.5 mm →', ha='center', color='gray', fontsize=9)

# Plot 6: Commercial production statistics
ax = axes[1, 2]
crops = ['Banana', 'Orchid', 'Sugarcane', 'Potato', 'Date palm']
production_millions = [500, 200, 150, 100, 30]
colors_crop = ['#f59e0b', '#a855f7', '#22c55e', '#3b82f6', '#ef4444']
ax.barh(range(len(crops)), production_millions, color=colors_crop,
        edgecolor='none', height=0.6)
ax.set_yticks(range(len(crops)))
ax.set_yticklabels(crops, color='white', fontsize=10)
ax.set_xlabel('Annual tissue culture plants (millions)', color='white')
ax.set_title('Global Commercial Production', color='white', fontsize=11)
for i, p in enumerate(production_millions):
    ax.text(p + 10, i, f'{p}M', va='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print("Meristem Culture Summary")
print("=" * 50)
print()
print("Starting from 10 meristems (12 monthly cycles):")
for species, params in species_params.items():
    pop, _, _ = meristem_multiplication(10, n_cycles, **params)
    print(f"  {species:<10}: {pop[-1]:>10,} plantlets (×{params['mult_rate']}/cycle)")
print()
print("Critical factors:")
print("  - Meristem size: 0.2-0.3mm optimal (virus-free + survival)")
print("  - Contamination: 2% vs 15% = 10x difference in final yield")
print("  - Multiplication rate: species-dependent (2-6× per cycle)")
print()
print("Applications: banana cloning, orchid propagation, virus elimination,")
print("disease-free seed potato production, endangered species conservation.")`,
      challenge: 'Model a "rescue mission": you have a single surviving plant of an endangered Assamese orchid species. Design a meristem culture protocol that maximizes the number of plantlets while minimizing the risk of losing the lineage entirely. How many meristems should you take from the original plant? What safety margins do you need?',
      successHint: 'Meristem culture is the workhorse of plant biotechnology. It combines the biological principle of totipotency with practical techniques to clone, clean, and multiply plants at industrial scale. The global tissue culture industry produces over 1 billion plants annually — all from tiny meristem tips.',
    },
    {
      title: 'Vegetative propagation — nature\'s cloning methods',
      concept: `Plants have evolved multiple natural cloning strategies — collectively called **vegetative propagation**. These predate human tissue culture by hundreds of millions of years:

**Stolons/runners** (strawberry): horizontal stems that grow along the soil surface, producing new plants at nodes. Each node roots independently.

**Tubers** (potato): underground stem swellings that store starch. Each "eye" on a potato is an axillary bud that can grow into a new plant.

**Bulbs** (onion, garlic): compressed stems with fleshy leaf bases. Bulbs produce offsets (daughter bulbs) that separate into independent plants.

**Rhizomes** (ginger, bamboo): horizontal underground stems. Bamboo groves are often a single genetic individual connected by rhizomes.

**Cuttings** (willow, rose): human-assisted method where a stem piece is placed in soil/water and produces adventitious roots. Works because of auxin production at the cut wound.

**Layering** (jasmine): a branch is bent to the ground and covered with soil while still attached to the parent. It roots at the buried node, then is severed.

**Grafting** (fruit trees): joining tissues of two plants so they grow as one. The rootstock provides roots; the scion provides the desired fruit variety.

Each method has advantages: cuttings are cheap, grafting combines traits, tissue culture is most scalable. The choice depends on the species and the goal.`,
      analogy: 'Natural vegetative propagation is like a franchise business. The original restaurant (parent plant) opens new locations (daughter plants) that are exact copies of the original, using different expansion strategies: some send out food trucks (stolons), some open in hidden locations (rhizomes), some clone their recipe book (bulbs). Each new location has the same menu (genome) as the original.',
      storyConnection: 'The Tejimola story speaks of regeneration from plant parts — and this is exactly what vegetative propagation achieves. In Assam, farmers have used rhizome division for bamboo, tuber planting for yam, and cutting propagation for tea bushes since time immemorial. The scientific names are new; the practices are ancient.',
      checkQuestion: 'Bamboo groves can cover entire hillsides, yet DNA analysis often shows the entire grove is a single genetic individual connected by rhizomes. What are the evolutionary advantages and risks of this clonal strategy?',
      checkAnswer: 'Advantages: (1) rapid area colonization without sexual reproduction, (2) resource sharing between connected ramets (shaded parts receive sugars from sun-exposed parts), (3) survival of damage (cutting one stem does not kill the network). Risks: (1) zero genetic diversity means a single disease or pest could kill the entire grove, (2) no adaptation to changing environments through recombination, (3) when the clone finally flowers (bamboo flowers once every 40-120 years, then dies), the entire grove dies simultaneously. Clonal spread is a bet on current environmental stability.',
      codeIntro: 'Model different vegetative propagation strategies and compare their efficiency, genetic implications, and ecological risks.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Model different vegetative propagation strategies

def stolon_growth(years, initial=1, branch_rate=4, max_distance_m=5):
    """Strawberry-like stolon spread. Each plant produces runners with daughter plants."""
    plants = [{'x': 0, 'y': 0, 'age': 0}]
    yearly_counts = [1]
    for year in range(1, years + 1):
        new_plants = []
        for p in plants:
            if p['age'] < 3:  # productive for 3 years
                n_runners = np.random.poisson(branch_rate)
                for _ in range(n_runners):
                    angle = np.random.uniform(0, 2 * np.pi)
                    dist = np.random.uniform(0.3, max_distance_m)
                    nx = p['x'] + dist * np.cos(angle)
                    ny = p['y'] + dist * np.sin(angle)
                    new_plants.append({'x': nx, 'y': ny, 'age': 0})
            p['age'] += 1
        plants.extend(new_plants)
        yearly_counts.append(len(plants))
    return plants, yearly_counts

def rhizome_spread(years, initial=1, growth_rate_m=2, branch_prob=0.3):
    """Bamboo-like rhizome network spread."""
    tips = [{'x': 0, 'y': 0, 'dx': 1, 'dy': 0}]
    all_points = [(0, 0)]
    yearly_counts = [1]
    for year in range(1, years + 1):
        new_tips = []
        for tip in tips:
            # Grow forward
            angle_noise = np.random.normal(0, 0.3)
            speed = np.random.uniform(0.5, 1.5) * growth_rate_m
            new_dx = tip['dx'] * np.cos(angle_noise) - tip['dy'] * np.sin(angle_noise)
            new_dy = tip['dx'] * np.sin(angle_noise) + tip['dy'] * np.cos(angle_noise)
            norm = np.sqrt(new_dx**2 + new_dy**2)
            new_dx, new_dy = new_dx/norm, new_dy/norm

            nx = tip['x'] + new_dx * speed
            ny = tip['y'] + new_dy * speed
            tip['x'], tip['y'] = nx, ny
            tip['dx'], tip['dy'] = new_dx, new_dy
            all_points.append((nx, ny))

            # Branch
            if np.random.random() < branch_prob:
                branch_angle = np.random.choice([-np.pi/2, np.pi/2])
                bdx = new_dx * np.cos(branch_angle) - new_dy * np.sin(branch_angle)
                bdy = new_dx * np.sin(branch_angle) + new_dy * np.cos(branch_angle)
                new_tips.append({'x': nx, 'y': ny, 'dx': bdx, 'dy': bdy})
        tips.extend(new_tips)
        yearly_counts.append(len(all_points))
    return all_points, yearly_counts

def tuber_multiplication(years, initial_tubers=1, eyes_per_tuber=8, success_rate=0.7):
    """Potato-like tuber propagation."""
    counts = [initial_tubers]
    current = initial_tubers
    for _ in range(years):
        new_plants = current * eyes_per_tuber * success_rate
        tubers_per_plant = np.random.uniform(5, 12)
        new_tubers = int(new_plants * tubers_per_plant)
        current = new_tubers
        counts.append(current)
    return counts

# Run simulations
stolon_plants, stolon_counts = stolon_growth(6)
rhizome_points, rhizome_counts = rhizome_spread(10)
tuber_counts = tuber_multiplication(5)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle("Vegetative Propagation: Nature's Cloning Strategies",
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Stolon spread pattern (top view)
ax = axes[0, 0]
xs = [p['x'] for p in stolon_plants[:500]]
ys = [p['y'] for p in stolon_plants[:500]]
ages = [p['age'] for p in stolon_plants[:500]]
scatter = ax.scatter(xs, ys, c=ages, cmap='YlGn_r', s=10, edgecolor='none', alpha=0.7)
ax.plot(0, 0, '*', color='#ef4444', markersize=15, label='Original plant')
ax.set_xlabel('Distance (m)', color='white')
ax.set_ylabel('Distance (m)', color='white')
ax.set_title(f'Stolon Spread ({len(stolon_plants)} plants)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.set_aspect('equal')

# Plot 2: Rhizome network pattern
ax = axes[0, 1]
rx = [p[0] for p in rhizome_points]
ry = [p[1] for p in rhizome_points]
ax.plot(rx, ry, '.', color='#22c55e', markersize=3, alpha=0.5)
# Draw connections
for i in range(1, min(200, len(rhizome_points))):
    ax.plot([rhizome_points[i-1][0], rhizome_points[i][0]],
            [rhizome_points[i-1][1], rhizome_points[i][1]],
            color='#22c55e', linewidth=0.5, alpha=0.3)
ax.plot(0, 0, '*', color='#ef4444', markersize=15)
ax.set_xlabel('Distance (m)', color='white')
ax.set_ylabel('Distance (m)', color='white')
ax.set_title(f'Rhizome Network ({len(rhizome_points)} shoots)', color='white', fontsize=11)
ax.set_aspect('equal')

# Plot 3: Growth comparison
ax = axes[0, 2]
ax.semilogy(range(len(stolon_counts)), stolon_counts, color='#f59e0b',
            linewidth=2.5, label='Stolons (strawberry)', marker='o', markersize=5)
ax.semilogy(range(len(rhizome_counts)), rhizome_counts, color='#22c55e',
            linewidth=2.5, label='Rhizomes (bamboo)', marker='s', markersize=5)
ax.semilogy(range(len(tuber_counts)), tuber_counts, color='#3b82f6',
            linewidth=2.5, label='Tubers (potato)', marker='^', markersize=5)
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Number of individuals (log)', color='white')
ax.set_title('Propagation Speed Comparison', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Methods comparison table
ax = axes[1, 0]
methods = ['Stolons', 'Rhizomes', 'Tubers', 'Cuttings', 'Grafting', 'Tissue\\\nculture']
metrics = ['Speed', 'Cost', 'Fidelity', 'Scale', 'Skill\\\nneeded']
scores = np.array([
    [0.9, 0.7, 0.7, 0.4, 0.3, 1.0],  # Speed
    [0.9, 0.8, 0.9, 0.8, 0.5, 0.2],  # Cost (low = good)
    [1.0, 1.0, 0.95, 0.9, 0.8, 1.0], # Fidelity
    [0.3, 0.4, 0.6, 0.5, 0.4, 1.0],  # Scale
    [0.9, 0.8, 0.9, 0.7, 0.3, 0.2],  # Skill (low = good)
]).T
im = ax.imshow(scores, cmap='YlGn', aspect='auto', vmin=0, vmax=1)
ax.set_xticks(range(len(metrics)))
ax.set_xticklabels(metrics, color='white', fontsize=8)
ax.set_yticks(range(len(methods)))
ax.set_yticklabels(methods, color='white', fontsize=8)
ax.set_title('Method Comparison (higher = better)', color='white', fontsize=11)
for i in range(len(methods)):
    for j in range(len(metrics)):
        ax.text(j, i, f'{scores[i,j]:.1f}', ha='center', va='center',
                color='black' if scores[i,j] > 0.5 else 'white', fontsize=8)

# Plot 5: Genetic diversity risk
ax = axes[1, 1]
# Simulate disease spread in clonal vs diverse populations
pop_size = 100
n_sims = 200
clonal_survivors = []
diverse_survivors = []
for _ in range(n_sims):
    disease_virulence = np.random.uniform(0.3, 0.9)
    # Clonal: all identical, all susceptible or resistant
    if np.random.random() < 0.7:  # 70% chance clone is susceptible
        clonal_survivors.append(int(pop_size * (1 - disease_virulence)))
    else:
        clonal_survivors.append(pop_size)
    # Diverse: varying resistance
    resistances = np.random.uniform(0, 1, pop_size)
    survivors = np.sum(resistances > disease_virulence)
    diverse_survivors.append(survivors)

ax.hist(clonal_survivors, bins=20, color='#ef4444', alpha=0.7, label='Clonal population',
        edgecolor='none', density=True)
ax.hist(diverse_survivors, bins=20, color='#22c55e', alpha=0.7, label='Diverse population',
        edgecolor='none', density=True)
ax.set_xlabel('Survivors after disease outbreak', color='white')
ax.set_ylabel('Probability density', color='white')
ax.set_title('Genetic Diversity & Disease Risk', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Grafting combinations
ax = axes[1, 2]
# Show rootstock-scion compatibility matrix
rootstocks = ['Vigorous\\\nwild type', 'Dwarf\\\nrootstock', 'Disease-\\\nresistant', 'Drought-\\\ntolerant']
scions = ['High yield', 'Best flavor', 'Early fruit', 'Ornamental']
compat = np.array([
    [0.95, 0.90, 0.85, 0.70],
    [0.80, 0.95, 0.90, 0.85],
    [0.90, 0.85, 0.80, 0.75],
    [0.70, 0.75, 0.85, 0.90],
])
im = ax.imshow(compat, cmap='YlGn', aspect='auto', vmin=0.5, vmax=1)
ax.set_xticks(range(len(scions)))
ax.set_xticklabels(scions, color='white', fontsize=8)
ax.set_yticks(range(len(rootstocks)))
ax.set_yticklabels(rootstocks, color='white', fontsize=8)
ax.set_title('Grafting: Rootstock × Scion Compatibility', color='white', fontsize=11)
for i in range(len(rootstocks)):
    for j in range(len(scions)):
        ax.text(j, i, f'{compat[i,j]:.0%}', ha='center', va='center',
                color='black', fontsize=9)

plt.tight_layout()
plt.show()

print("Vegetative Propagation Comparison")
print("=" * 50)
print()
print(f"Stolon (strawberry): {stolon_counts[-1]:,} plants in 6 years from 1")
print(f"Rhizome (bamboo):    {rhizome_counts[-1]:,} shoots in 10 years from 1")
print(f"Tuber (potato):      {tuber_counts[-1]:,} tubers in 5 years from 1")
print()
print("Trade-off: clonal uniformity vs disease vulnerability")
print(f"  Clonal pop. after disease: {np.mean(clonal_survivors):.0f} ± {np.std(clonal_survivors):.0f}")
print(f"  Diverse pop. after disease: {np.mean(diverse_survivors):.0f} ± {np.std(diverse_survivors):.0f}")
print()
print("Clonal populations have bimodal outcomes: survive perfectly OR collapse.")
print("Diverse populations always have moderate survival. Diversity is insurance.")`,
      challenge: 'Model the Cavendish banana crisis: virtually all commercial bananas are clones of a single variety, now threatened by Panama disease (Fusarium TR4). Simulate what happens when TR4 reaches a plantation of 10,000 clonal banana plants vs. a diverse plantation with 10 varieties. How many plants survive in each case after 5 years of disease spread?',
      successHint: 'Vegetative propagation is both a blessing and a risk. It enables exact copying of desirable traits (uniformity, quality, yield) but eliminates genetic diversity. The Cavendish banana crisis — the entire global banana industry depending on one susceptible clone — is the cautionary tale of taken cloning too far.',
    },
    {
      title: 'Plant tissue culture — the complete laboratory protocol',
      concept: `Plant tissue culture is the controlled growth of plant cells, tissues, or organs in sterile, nutrient-rich media. It is the technological application of totipotency.

The **Murashige & Skoog (MS) medium** (1962) is the most widely used culture medium. It contains:
- **Macronutrients**: NH4NO3, KNO3, CaCl2, MgSO4, KH2PO4 (nitrogen, potassium, calcium, magnesium, phosphorus)
- **Micronutrients**: Fe, Mn, Zn, B, Cu, Mo, Co, I (trace elements)
- **Vitamins**: thiamine (B1), pyridoxine (B6), nicotinic acid, myo-inositol
- **Carbon source**: sucrose (30 g/L) — plants in culture cannot photosynthesize efficiently
- **Gelling agent**: agar (8 g/L) for solid media
- **Plant growth regulators**: auxins (2,4-D, IAA, NAA) and cytokinins (BAP, kinetin, TDZ)
- **pH**: 5.7-5.8 (adjusted before autoclaving)

The protocol steps:
1. **Surface sterilization**: 70% ethanol (30s) → sodium hypochlorite (10-15 min) → sterile water rinses
2. **Explant preparation**: cut tissue pieces under laminar flow hood
3. **Inoculation**: place explant on MS medium + hormones
4. **Incubation**: 25°C, 16h light/8h dark photoperiod
5. **Subculture**: transfer to fresh medium every 3-4 weeks
6. **Rooting**: transfer shoots to rooting medium (high auxin)
7. **Acclimatization**: gradually expose to non-sterile conditions

The most critical factors for success: sterile technique, correct hormone concentrations, and genotype (some plants are "recalcitrant" — they refuse to regenerate in culture).`,
      analogy: 'Tissue culture is like running an intensive care unit for plant cells. The medium is an IV drip providing all nutrients. The laminar flow hood is the sterile operating room. Hormones are the medication that tells cells what to become. Temperature and light are precisely controlled like hospital environmental systems. And just like in an ICU, contamination (infection) is the biggest threat.',
      storyConnection: 'If we take the Tejimola story literally — a person regenerating from plant tissue — tissue culture is the closest science gets. We take a small piece of plant, place it in a nutrient bath with the right hormonal signals, and coax it to regenerate into a complete organism. The plant cells "remember" how to build an entire body because they are totipotent.',
      checkQuestion: 'Why do tissue culture plants need sucrose in the medium if plants can photosynthesize? And why is pH so critical at 5.7-5.8?',
      checkAnswer: 'Plants in culture have limited photosynthetic capacity: they are in enclosed vessels with limited gas exchange, and callus/undifferentiated tissues often lack chlorophyll. They need exogenous sucrose as a carbon and energy source. As for pH: at 5.7-5.8, all essential nutrients are in their most soluble and plant-available forms. Too acidic (<5.0) causes toxic levels of Al and Mn. Too alkaline (>6.5) causes iron and phosphorus to precipitate out of solution. The narrow pH window is a chemical constraint on nutrient availability.',
      codeIntro: 'Simulate the complete tissue culture process including media preparation, hormone optimization, and growth kinetics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# MS Medium composition and optimization model

# MS medium nutrient concentrations (mg/L)
MS_MEDIUM = {
    'NH4NO3': 1650, 'KNO3': 1900, 'CaCl2': 440, 'MgSO4': 370,
    'KH2PO4': 170, 'FeSO4': 27.8, 'Na2EDTA': 37.3,
    'MnSO4': 22.3, 'ZnSO4': 8.6, 'H3BO3': 6.2,
    'KI': 0.83, 'CuSO4': 0.025, 'CoCl2': 0.025, 'Na2MoO4': 0.25,
    'Sucrose': 30000, 'Agar': 8000, 'pH': 5.8,
}

# Growth model: callus weight over time
def callus_growth(days, auxin_mgL, cytokinin_mgL, sucrose_gL=30, temp_C=25):
    """Model callus growth as a function of medium composition."""
    # Hormone effect on growth rate
    hormone_factor = 1 / (1 + np.exp(-2 * (auxin_mgL - 0.5))) * 1 / (1 + np.exp(-2 * (cytokinin_mgL - 0.3)))
    # Sucrose effect (optimum at 30 g/L)
    sucrose_factor = np.exp(-((sucrose_gL - 30) ** 2) / 200)
    # Temperature effect (optimum at 25°C)
    temp_factor = np.exp(-((temp_C - 25) ** 2) / 50)

    max_rate = 0.15 * hormone_factor * sucrose_factor * temp_factor  # per day
    carrying_capacity = 5.0  # grams

    t = np.arange(days)
    # Logistic growth
    weight = carrying_capacity / (1 + (carrying_capacity / 0.1 - 1) * np.exp(-max_rate * t))
    return t, weight

# Optimization: test different hormone combinations
auxin_levels = np.linspace(0, 5, 20)
cytokinin_levels = np.linspace(0, 5, 20)
AUX, CYT = np.meshgrid(auxin_levels, cytokinin_levels)

final_weight = np.zeros_like(AUX)
for i in range(20):
    for j in range(20):
        _, w = callus_growth(30, AUX[i,j], CYT[i,j])
        final_weight[i,j] = w[-1]

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Plant Tissue Culture: Protocol & Optimization',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: MS medium composition (stacked bar)
ax = axes[0, 0]
macro = {'NH4NO3': 1650, 'KNO3': 1900, 'CaCl2': 440, 'MgSO4': 370, 'KH2PO4': 170}
micro = {'FeSO4': 27.8, 'MnSO4': 22.3, 'ZnSO4': 8.6, 'H3BO3': 6.2, 'Others': 1.1}
colors_m = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444']
x = 0
for cat, data, label in [(macro, 'Macronutrients', 'left'), (micro, 'Micronutrients', 'right')]:
    bottom = 0
    for i, (nutrient, conc) in enumerate(data.items()):
        ax.bar(x, conc, 0.6, bottom=bottom, color=colors_m[i], label=nutrient if x == 0 else None,
               edgecolor='none')
        if conc > 100:
            ax.text(x, bottom + conc/2, f'{nutrient}\\n{conc}', ha='center',
                    color='white', fontsize=6)
        bottom += conc
    x += 1
ax.set_xticks([0, 1])
ax.set_xticklabels(['Macronutrients\\n(mg/L)', 'Micronutrients\\n(mg/L)'], color='white', fontsize=9)
ax.set_ylabel('Concentration (mg/L)', color='white')
ax.set_title('MS Medium Composition', color='white', fontsize=11)

# Plot 2: Hormone optimization heatmap
ax = axes[0, 1]
im = ax.contourf(AUX, CYT, final_weight, levels=20, cmap='YlGn')
plt.colorbar(im, ax=ax, label='Callus weight (g) at day 30')
ax.set_xlabel('Auxin (mg/L)', color='white')
ax.set_ylabel('Cytokinin (mg/L)', color='white')
ax.set_title('Hormone Optimization', color='white', fontsize=11)
# Mark optimal
opt_idx = np.unravel_index(final_weight.argmax(), final_weight.shape)
ax.plot(AUX[opt_idx], CYT[opt_idx], '*', color='#ef4444', markersize=15,
        markeredgecolor='white', markeredgewidth=2)
ax.annotate(f'Optimal: {AUX[opt_idx]:.1f}/{CYT[opt_idx]:.1f} mg/L',
            xy=(AUX[opt_idx], CYT[opt_idx]), xytext=(AUX[opt_idx]+0.5, CYT[opt_idx]+0.5),
            color='#ef4444', fontsize=9, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#ef4444'))

# Plot 3: Growth curves at different hormone levels
ax = axes[0, 2]
for auxin, cyt, color, label in [
    (2.0, 1.0, '#22c55e', 'Optimal (2/1)'),
    (0.5, 0.5, '#3b82f6', 'Low (0.5/0.5)'),
    (5.0, 5.0, '#ef4444', 'High (5/5)'),
    (0.1, 0.1, '#64748b', 'Minimal (0.1/0.1)'),
]:
    t, w = callus_growth(60, auxin, cyt)
    ax.plot(t, w, color=color, linewidth=2.5, label=label)
ax.set_xlabel('Days', color='white')
ax.set_ylabel('Callus weight (g)', color='white')
ax.set_title('Growth Curves at Different Hormones', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Temperature and sucrose effects
ax = axes[1, 0]
temps = np.arange(15, 36)
sucroses = [15, 30, 45, 60]
for suc, color in zip(sucroses, ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']):
    weights = []
    for temp in temps:
        _, w = callus_growth(30, 2.0, 1.0, suc, temp)
        weights.append(w[-1])
    ax.plot(temps, weights, color=color, linewidth=2, label=f'Sucrose {suc} g/L')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Weight at day 30 (g)', color='white')
ax.set_title('Temperature × Sucrose Interaction', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.axvline(25, color='gray', linewidth=1, linestyle='--')

# Plot 5: Protocol timeline
ax = axes[1, 1]
steps = [
    ('Sterilize', 0, 0.5, '#ef4444'),
    ('Inoculate', 0.5, 1, '#f59e0b'),
    ('Callus', 1, 4, '#22c55e'),
    ('Shoot\\ninduction', 4, 8, '#3b82f6'),
    ('Root\\ninduction', 8, 11, '#a855f7'),
    ('Acclimate', 11, 14, '#ec4899'),
]
for label, start, end, color in steps:
    ax.barh(0, end - start, left=start, height=0.4, color=color, edgecolor='none')
    ax.text((start + end) / 2, 0, label, ha='center', va='center',
            color='white', fontsize=8, fontweight='bold')
ax.set_xlabel('Weeks', color='white')
ax.set_title('Complete Protocol Timeline', color='white', fontsize=11)
ax.set_yticks([])
ax.set_xlim(-0.5, 15)
ax.text(7, 0.3, '~14 weeks from explant to acclimatized plant',
        color='gray', fontsize=9, ha='center')

# Plot 6: Contamination sources
ax = axes[1, 2]
contam_sources = ['Bacteria', 'Fungi', 'Mites', 'Endogenous\\ncontam.', 'Lab\\nerror']
prevalence = [40, 35, 5, 15, 5]
colors_contam = ['#ef4444', '#f59e0b', '#a855f7', '#3b82f6', '#64748b']
wedges, texts, autotexts = ax.pie(prevalence, labels=contam_sources, autopct='%1.0f%%',
    colors=colors_contam, textprops={'color': 'white', 'fontsize': 8})
ax.set_title('Sources of Contamination', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Plant Tissue Culture Protocol")
print("=" * 50)
print()
print("Murashige & Skoog (1962) medium:")
print(f"  Total salts: ~4.4 g/L | Sucrose: 30 g/L | pH: 5.8")
print()
print("Optimal conditions (from simulation):")
print(f"  Auxin: ~2.0 mg/L | Cytokinin: ~1.0 mg/L")
print(f"  Temperature: 25°C | Sucrose: 30 g/L")
print(f"  Light: 16h/8h photoperiod")
print()
print("Protocol timeline: ~14 weeks")
print("  Week 0: sterilize + inoculate")
print("  Week 1-4: callus formation")
print("  Week 4-8: shoot induction (switch to high cytokinin)")
print("  Week 8-11: root induction (switch to high auxin)")
print("  Week 11-14: acclimatization to soil")
print()
print("Biggest challenge: contamination (75% bacterial + fungal)")
print("Solution: strict aseptic technique in laminar flow hood.")`,
      challenge: 'Design an experiment to determine the optimal auxin:cytokinin ratio for regenerating an Assamese tea (Camellia sinensis) variety. Tea is notoriously difficult to culture. Use a factorial design with 5 auxin levels × 5 cytokinin levels × 3 replicates. Calculate the total number of culture vessels needed and estimate the cost (assume $0.50 per vessel for media + labor).',
      successHint: 'Plant tissue culture is a precise art masquerading as a science. The protocols are well-established, but every new species requires optimization — finding the right hormone combination, temperature, light regime, and media formulation that convinces those particular cells to regenerate. It is molecular cooking at its finest.',
    },
    {
      title: 'Epigenetics in plants — how environment changes gene expression without changing DNA',
      concept: `**Epigenetics** is the study of heritable changes in gene expression that occur WITHOUT changes to the DNA sequence. Plants are masters of epigenetic regulation because, unlike animals, they cannot move away from environmental stress — they must adapt in place.

Key epigenetic mechanisms in plants:

1. **DNA methylation**: adding methyl groups (-CH3) to cytosine bases. Methylated genes are typically silenced. In plants, methylation can occur at CG, CHG, and CHH contexts (H = A, T, or C). This is more complex than in animals (CG only).

2. **Histone modification**: chemical modifications to histone proteins that DNA wraps around. Acetylation loosens chromatin (gene ON). Methylation at H3K27 compacts it (gene OFF). These "marks" can be inherited through cell division.

3. **Small RNA silencing**: plants produce small interfering RNAs (siRNAs) that guide DNA methylation machinery to specific genomic regions. This RNA-directed DNA methylation (RdDM) pathway is unique to plants.

4. **Vernalization**: the requirement for a period of cold before flowering. This is epigenetically controlled — cold exposure changes histone marks at the FLC gene (a flowering repressor), silencing it and allowing flowering. The mark is stable through warm weather but reset in seeds.

Why this matters for tissue culture: when you grow plant cells in culture, the epigenetic marks can change unpredictably — a phenomenon called **somaclonal variation**. Clones that should be identical sometimes differ because of epigenetic changes induced by culture conditions.`,
      analogy: 'If DNA is the script of a play, epigenetics is the director\'s interpretation. The same script (genome) can produce very different performances (phenotypes) depending on which lines are emphasized (genes activated) and which are whispered (genes silenced). The director\'s choices (epigenetic marks) can be passed down to the next production (inherited), but the script itself never changes.',
      storyConnection: 'Tejimola\'s transformation — the same being taking different forms — mirrors epigenetics at the cellular level. A root cell and a leaf cell have the same DNA (script), but different epigenetic marks (direction) give them completely different identities and functions. In tissue culture, we reprogram these marks to transform one cell type into another.',
      checkQuestion: 'A farmer plants 100 tissue-culture-derived clones of a mango variety. After 5 years, 3 trees produce fruits with different taste and color, even though DNA sequencing confirms they are genetically identical. What happened?',
      checkAnswer: 'Somaclonal variation — epigenetic changes occurred during tissue culture. The stressful conditions of in vitro growth (artificial hormones, high sucrose, lack of normal cell-cell communication) can cause: (1) changes in DNA methylation patterns, (2) altered histone marks, (3) activation of transposable elements (jumping genes), or (4) chromosome rearrangements. The 3 variant trees have the same DNA sequence but different epigenetic states, leading to altered gene expression and different fruit characteristics. This is both a problem (unexpected variation in clones) and an opportunity (source of new variation for breeding).',
      codeIntro: 'Model epigenetic changes during tissue culture and simulate how environmental signals alter gene expression patterns.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Epigenetic regulation model

def methylation_dynamics(n_genes=100, n_generations=50, stress_level=0,
                          culture_effect=False):
    """
    Simulate DNA methylation changes across cell generations.
    Each gene has a methylation level (0=unmethylated/active, 1=methylated/silent).
    """
    # Initial methylation pattern (normal plant)
    methylation = np.random.choice([0, 1], size=n_genes, p=[0.6, 0.4])
    history = [methylation.copy()]

    for gen in range(n_generations):
        new_meth = methylation.copy()
        for g in range(n_genes):
            # Base transition rates
            p_methylate = 0.02    # spontaneous silencing
            p_demethylate = 0.01  # spontaneous activation

            # Stress increases methylation changes
            if stress_level > 0:
                p_methylate += 0.01 * stress_level
                p_demethylate += 0.005 * stress_level

            # Tissue culture dramatically increases epigenetic instability
            if culture_effect:
                p_methylate += 0.05
                p_demethylate += 0.03

            if methylation[g] == 0 and np.random.random() < p_methylate:
                new_meth[g] = 1
            elif methylation[g] == 1 and np.random.random() < p_demethylate:
                new_meth[g] = 0

        methylation = new_meth
        history.append(methylation.copy())

    return np.array(history)

# Simulate different conditions
normal = methylation_dynamics(culture_effect=False, stress_level=0)
stressed = methylation_dynamics(culture_effect=False, stress_level=3)
cultured = methylation_dynamics(culture_effect=True, stress_level=0)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Epigenetics in Plants: Environment Changes Gene Expression',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Methylation heatmap (normal)
ax = axes[0, 0]
ax.imshow(normal.T, cmap='RdYlGn_r', aspect='auto', interpolation='nearest')
ax.set_xlabel('Cell generation', color='white')
ax.set_ylabel('Gene', color='white')
ax.set_title('Normal Growth: Stable Methylation', color='white', fontsize=11)

# Plot 2: Methylation heatmap (tissue culture)
ax = axes[0, 1]
ax.imshow(cultured.T, cmap='RdYlGn_r', aspect='auto', interpolation='nearest')
ax.set_xlabel('Cell generation', color='white')
ax.set_ylabel('Gene', color='white')
ax.set_title('Tissue Culture: Epigenetic Instability', color='white', fontsize=11)

# Plot 3: Average methylation level over time
ax = axes[0, 2]
ax.plot(normal.mean(axis=1), color='#22c55e', linewidth=2.5, label='Normal')
ax.plot(stressed.mean(axis=1), color='#f59e0b', linewidth=2.5, label='Stressed')
ax.plot(cultured.mean(axis=1), color='#ef4444', linewidth=2.5, label='Tissue culture')
ax.set_xlabel('Cell generation', color='white')
ax.set_ylabel('Average methylation level', color='white')
ax.set_title('Methylation Drift Over Time', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 4: Vernalization model
ax = axes[1, 0]
weeks = np.arange(0, 30)
# FLC gene expression (flowering repressor)
cold_start = 5
cold_end = 15
flc_expression = np.ones(30) * 100  # Start fully expressed
for w in range(len(weeks)):
    if cold_start <= w <= cold_end:
        flc_expression[w] = 100 * np.exp(-0.3 * (w - cold_start))
    elif w > cold_end:
        flc_expression[w] = flc_expression[cold_end]  # Epigenetic memory

ax.plot(weeks, flc_expression, color='#3b82f6', linewidth=2.5, label='FLC expression')
ax.axvspan(cold_start, cold_end, alpha=0.1, color='#06b6d4', label='Cold period')
ax.axhline(30, color='#22c55e', linewidth=1.5, linestyle='--', label='Flowering threshold')
ax.set_xlabel('Weeks', color='white')
ax.set_ylabel('FLC gene expression (%)', color='white')
ax.set_title('Vernalization: Cold → Epigenetic Silencing', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.annotate('Cold silences FLC\\\nvia histone methylation', xy=(10, 40),
            color='#06b6d4', fontsize=9, fontweight='bold')

# Plot 5: Somaclonal variation in clones
ax = axes[1, 1]
n_clones = 50
# All clones start with same methylation pattern
original = np.random.choice([0, 1], size=100, p=[0.6, 0.4])
clone_variation = []
for _ in range(n_clones):
    clone = original.copy()
    # Apply tissue culture epigenetic noise
    for g in range(100):
        if np.random.random() < 0.08:
            clone[g] = 1 - clone[g]  # flip methylation
    clone_variation.append(np.sum(clone != original))

ax.hist(clone_variation, bins=15, color='#a855f7', edgecolor='none', alpha=0.8)
ax.axvline(np.mean(clone_variation), color='#f59e0b', linewidth=2, linestyle='--',
           label=f'Mean: {np.mean(clone_variation):.1f} changed genes')
ax.set_xlabel('Number of genes with altered methylation', color='white')
ax.set_ylabel('Count of clones', color='white')
ax.set_title('Somaclonal Variation in 50 Clones', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 6: Epigenetic mechanisms overview
ax = axes[1, 2]
mechanisms = ['DNA\\\nmethylation', 'Histone\\\nacetylation', 'Histone\\\nmethylation',
              'siRNA\\\nsilencing', 'Chromatin\\\nremodeling']
effect = ['Gene OFF', 'Gene ON', 'Gene OFF\\\nor ON', 'Gene OFF', 'Variable']
heritability = [0.9, 0.5, 0.7, 0.8, 0.3]
colors_mech = ['#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#f59e0b']
bars = ax.barh(range(len(mechanisms)), heritability, color=colors_mech,
               edgecolor='none', height=0.6)
ax.set_yticks(range(len(mechanisms)))
ax.set_yticklabels(mechanisms, color='white', fontsize=9)
ax.set_xlabel('Heritability (0-1)', color='white')
ax.set_title('Epigenetic Mechanisms & Heritability', color='white', fontsize=11)
for i, (h, eff) in enumerate(zip(heritability, effect)):
    ax.text(h + 0.02, i, eff, va='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Epigenetics in Plants")
print("=" * 50)
print()
print("Key mechanisms:")
print("  DNA methylation: CG, CHG, CHH contexts (plants are more complex)")
print("  Histone marks: H3K27me3 (OFF), H3K4me3 (ON), acetylation (ON)")
print("  siRNA: RNA-directed DNA methylation (unique to plants)")
print()
print("Tissue culture impact:")
print(f"  Normal: ~{normal[-1].mean()*100:.0f}% genes methylated (stable)")
print(f"  Culture: ~{cultured[-1].mean()*100:.0f}% genes methylated (drifted)")
print(f"  Somaclonal variation: avg {np.mean(clone_variation):.0f} genes differ per clone")
print()
print("Vernalization: cold → H3K27me3 at FLC → flowering permitted")
print("This is EPIGENETIC MEMORY: the plant 'remembers' winter.")
print()
print("Implications: tissue culture clones are NOT perfectly identical.")
print("Epigenetic variation is a hidden source of phenotypic diversity.")`,
      challenge: 'Model transgenerational epigenetic inheritance: a parent plant is stressed (drought), acquires new methylation marks, and passes them to seeds. Do the marks persist in the offspring for 1 generation? 5 generations? Under what conditions do stress-induced marks become permanent vs. fade away? This is one of the hottest debates in plant biology.',
      successHint: 'Epigenetics adds a layer of complexity beyond genetics. Two plants with identical DNA can have different phenotypes because of different epigenetic states. This matters for tissue culture (somaclonal variation), crop breeding (epigenetic variation), and climate adaptation (plants can "remember" past stress through epigenetic marks). The Tejimola story of transformation takes on new meaning: identity is not just in the DNA, but in how that DNA is read.',
    },
    {
      title: 'CRISPR gene editing in crops — rewriting the plant genome',
      concept: `**CRISPR-Cas9** is a molecular tool that allows precise editing of DNA sequences in living organisms. In plants, it is revolutionizing crop improvement by enabling targeted changes to specific genes.

How CRISPR works:
1. **Guide RNA (gRNA)**: a short RNA sequence (~20 nucleotides) that matches the target DNA site
2. **Cas9 protein**: a molecular "scissors" that cuts both strands of DNA at the gRNA-guided location
3. **DNA repair**: the cell repairs the cut, either by:
   - **NHEJ** (Non-Homologous End Joining): error-prone repair that often introduces small insertions/deletions → gene knockout
   - **HDR** (Homology-Directed Repair): template-guided precise editing → gene modification

CRISPR in crop improvement:
- **Disease resistance**: editing susceptibility genes (e.g., OsSWEET genes in rice to resist bacterial blight)
- **Yield improvement**: modifying growth regulators (e.g., editing GW2 gene increases rice grain width by 20%)
- **Nutritional enhancement**: Golden Rice with beta-carotene, high-iron wheat
- **Climate adaptation**: editing drought tolerance genes, heat stress response
- **Reduced allergens**: editing gluten genes in wheat for celiac-safe varieties

CRISPR delivery in plants:
- **Agrobacterium**: natural plant pathogen that transfers DNA — used to deliver CRISPR components
- **Biolistics** (gene gun): gold particles coated with CRISPR DNA shot into plant cells
- **RNP delivery**: direct delivery of Cas9 protein + gRNA (no foreign DNA remains in the plant)

The last method (RNP) is revolutionary because the final edited plant contains NO foreign DNA — only a targeted change to its own genome. This blurs the line between genetic engineering and conventional breeding.`,
      analogy: 'CRISPR is like the "find and replace" function in a word processor, but for DNA. You type in the text to find (guide RNA), the program locates the exact position in the document (genome), and you can delete words (knockout), replace them (edit), or insert new text (knock-in). The precision is extraordinary — you can change one letter in a 3-billion-letter document.',
      storyConnection: 'If Tejimola were to be "reborn" with improved traits — resistance to disease, enhanced nutrition, better adaptation to climate change — CRISPR would be the technology to do it. The story of regeneration from a plant now extends to regeneration WITH improvements. Plant biotechnology is not just about copying; it is about editing the story itself.',
      checkQuestion: 'A researcher uses CRISPR to knock out a gene that makes rice susceptible to blast fungus. The edited rice has no foreign DNA — only a small deletion in its own genome. Is this plant a "GMO"? Should it be regulated the same way as transgenic crops?',
      checkAnswer: 'This is one of the most debated questions in agricultural biotechnology. The edited rice contains no foreign DNA and the same change could theoretically occur through natural mutation or conventional mutagenesis (radiation breeding). In the US and Japan, such plants are NOT regulated as GMOs. In the EU, they ARE regulated as GMOs (based on the ECJ ruling in 2018). The scientific consensus increasingly favors product-based regulation (what does the plant contain?) over process-based regulation (how was it made?), but regulatory frameworks vary by country. The biology is clear; the policy is not.',
      codeIntro: 'Simulate CRISPR gene editing in crops: guide RNA design, off-target analysis, and editing efficiency optimization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# CRISPR gene editing simulation

def design_grna(target_seq, genome_sequences, max_mismatches=3):
    """
    Score a guide RNA for on-target efficiency and off-target risk.
    Returns (on_target_score, off_target_sites, specificity_score)
    """
    # On-target scoring (simplified Doench 2016 model)
    gc_content = sum(1 for b in target_seq if b in 'GC') / len(target_seq)
    on_score = 0.5 + 0.3 * (1 - abs(gc_content - 0.5) * 2)  # GC 40-60% is optimal
    # PAM presence bonus
    on_score += 0.2 if target_seq[-2:] == 'GG' else 0  # NGG PAM

    # Off-target scanning
    off_targets = 0
    for seq in genome_sequences:
        mismatches = sum(1 for a, b in zip(target_seq, seq) if a != b)
        if mismatches <= max_mismatches and mismatches > 0:
            off_targets += 1

    specificity = 1 / (1 + off_targets * 0.1)
    return on_score, off_targets, specificity

# Generate synthetic genome with ~1000 similar sequences
bases = 'ACGT'
target = 'AGCTGATCCTGGAACTGGGG'  # 20nt guide targeting blast susceptibility gene
genome_seqs = []
for _ in range(30000):
    seq = ''.join(np.random.choice(list(bases), 20))
    genome_seqs.append(seq)
# Add some similar sequences (potential off-targets)
for _ in range(50):
    variant = list(target)
    n_mut = np.random.choice([1, 2, 3])
    positions = np.random.choice(20, n_mut, replace=False)
    for p in positions:
        variant[p] = np.random.choice([b for b in bases if b != variant[p]])
    genome_seqs.append(''.join(variant))

on_score, off_targets, specificity = design_grna(target, genome_seqs)

# Simulate editing efficiency across many cells
n_cells = 1000
editing_outcomes = []
for _ in range(n_cells):
    if np.random.random() < on_score * 0.8:  # Delivery + cutting success
        if np.random.random() < 0.7:
            editing_outcomes.append('NHEJ (knockout)')
        elif np.random.random() < 0.3:
            editing_outcomes.append('HDR (precise edit)')
        else:
            editing_outcomes.append('Large deletion')
    else:
        editing_outcomes.append('Unedited')

from collections import Counter
outcome_counts = Counter(editing_outcomes)

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('CRISPR Gene Editing in Crops',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Plot 1: Editing outcomes pie chart
ax = axes[0, 0]
labels = list(outcome_counts.keys())
values = list(outcome_counts.values())
colors_pie = {'NHEJ (knockout)': '#22c55e', 'HDR (precise edit)': '#3b82f6',
              'Large deletion': '#f59e0b', 'Unedited': '#64748b'}
pie_colors = [colors_pie[l] for l in labels]
wedges, texts, autotexts = ax.pie(values, labels=labels, autopct='%1.0f%%',
    colors=pie_colors, textprops={'color': 'white', 'fontsize': 8})
ax.set_title(f'Editing Outcomes (n={n_cells} cells)', color='white', fontsize=11)

# Plot 2: GC content vs editing efficiency
ax = axes[0, 1]
gc_range = np.linspace(0.2, 0.8, 100)
efficiency = 0.5 + 0.3 * (1 - np.abs(gc_range - 0.5) * 2) + 0.2
ax.plot(gc_range * 100, efficiency * 100, color='#22c55e', linewidth=2.5)
ax.fill_between(gc_range * 100, 0, efficiency * 100, color='#22c55e', alpha=0.1)
ax.axvspan(40, 60, alpha=0.08, color='#f59e0b', label='Optimal: 40-60% GC')
ax.set_xlabel('Guide RNA GC content (%)', color='white')
ax.set_ylabel('Predicted efficiency (%)', color='white')
ax.set_title('GC Content vs Editing Efficiency', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Off-target analysis
ax = axes[0, 2]
mismatch_counts = [0, 0, 0, 0]
for seq in genome_seqs:
    mm = sum(1 for a, b in zip(target, seq) if a != b)
    if mm <= 3:
        mismatch_counts[mm] += 1
ax.bar(['0\\\n(on-target)', '1 mismatch', '2 mismatches', '3 mismatches'],
       mismatch_counts, color=['#22c55e', '#f59e0b', '#ef4444', '#a855f7'],
       edgecolor='none', width=0.6)
ax.set_ylabel('Number of genomic sites', color='white')
ax.set_title('Off-Target Site Analysis', color='white', fontsize=11)
for i, c in enumerate(mismatch_counts):
    ax.text(i, c + 0.5, str(c), ha='center', color='white', fontsize=11)

# Plot 4: CRISPR crop applications
ax = axes[1, 0]
crops = ['Rice\\\n(blast resist.)', 'Wheat\\\n(low gluten)', 'Tomato\\\n(longer shelf)', 'Maize\\\n(drought tol.)', 'Banana\\\n(TR4 resist.)']
progress = [8, 6, 7, 5, 4]  # Technology Readiness Level
years_to_market = [2, 5, 3, 6, 7]
colors_crop = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7']
for i, (crop, trl, ytm, color) in enumerate(zip(crops, progress, years_to_market, colors_crop)):
    ax.scatter(trl, ytm, s=200, color=color, edgecolor='white', linewidth=1, zorder=5)
    ax.annotate(crop, (trl, ytm), textcoords='offset points', xytext=(10, 0),
                color=color, fontsize=8)
ax.set_xlabel('Technology Readiness Level', color='white')
ax.set_ylabel('Years to market', color='white')
ax.set_title('CRISPR Crop Pipeline', color='white', fontsize=11)
ax.invert_yaxis()

# Plot 5: Conventional breeding vs CRISPR timeline
ax = axes[1, 1]
methods = ['Conventional\\\nbreeding', 'Mutation\\\nbreeding', 'Transgenic\\\n(GMO)', 'CRISPR\\\nediting']
time_years = [12, 8, 6, 3]
precision = [0.2, 0.1, 0.9, 0.95]
colors_method = ['#64748b', '#f59e0b', '#ef4444', '#22c55e']

for i, (method, t, p, c) in enumerate(zip(methods, time_years, precision, colors_method)):
    ax.scatter(t, p, s=300, color=c, edgecolor='white', linewidth=2, zorder=5)
    ax.annotate(method, (t, p), textcoords='offset points', xytext=(10, 5),
                color=c, fontsize=9, fontweight='bold')
ax.set_xlabel('Time to new variety (years)', color='white')
ax.set_ylabel('Precision of genetic change', color='white')
ax.set_title('Breeding Methods Compared', color='white', fontsize=11)
ax.invert_xaxis()
ax.annotate('CRISPR: fastest\\\nAND most precise', xy=(3.5, 0.9),
            color='#22c55e', fontsize=9, fontweight='bold')

# Plot 6: Regulatory landscape
ax = axes[1, 2]
countries = ['USA', 'Japan', 'Brazil', 'Australia', 'India', 'EU', 'China']
regulation = ['Product-\\\nbased', 'Product-\\\nbased', 'Product-\\\nbased', 'Process-\\\nbased', 'Under\\\nreview', 'Process-\\\nbased', 'Process-\\\nbased']
strictness = [2, 2, 2, 7, 5, 9, 7]  # 1-10 strictness
colors_reg = ['#22c55e' if s < 5 else '#f59e0b' if s < 7 else '#ef4444' for s in strictness]
ax.barh(range(len(countries)), strictness, color=colors_reg, edgecolor='none', height=0.6)
ax.set_yticks(range(len(countries)))
ax.set_yticklabels(countries, color='white', fontsize=9)
ax.set_xlabel('Regulatory strictness (1-10)', color='white')
ax.set_title('CRISPR Crop Regulation by Country', color='white', fontsize=11)
for i, (s, r) in enumerate(zip(strictness, regulation)):
    ax.text(s + 0.2, i, r, va='center', color='white', fontsize=7)

plt.tight_layout()
plt.show()

print("CRISPR Gene Editing in Crops")
print("=" * 50)
print()
print(f"Guide RNA: {target}")
print(f"On-target score: {on_score:.2f} | Off-targets (≤3 mm): {off_targets}")
print(f"Specificity: {specificity:.3f}")
print()
print("Editing outcomes (simulated):")
for outcome, count in sorted(outcome_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"  {outcome}: {count}/{n_cells} ({count/n_cells*100:.0f}%)")
print()
print("CRISPR vs conventional breeding:")
print("  Conventional: 12 years, low precision, no regulation")
print("  CRISPR: 3 years, 95% precision, variable regulation")
print()
print("Key debate: should CRISPR-edited crops with no foreign DNA")
print("be regulated as GMOs? Science says no; some laws say yes.")
print("The Tejimola story of transformation takes on new meaning")
print("when we can precisely edit the genetic story of any plant.")`,
      challenge: 'Design a CRISPR experiment to make an Assamese rice variety (Joha aromatic rice) resistant to bacterial leaf blight by editing the OsSWEET11 gene. Specify: (1) the guide RNA sequence targeting the gene, (2) the expected editing outcome (knockout vs precise edit), (3) the number of rice callus cultures needed (assuming 30% editing efficiency), and (4) the timeline from lab to field trial.',
      successHint: 'CRISPR is the most powerful tool ever developed for plant improvement. It combines the precision of molecular biology with the speed of modern biotechnology. From Tejimola\'s mythical regeneration to CRISPR\'s precise genome editing, the story of plant transformation has evolved from folklore to frontier science.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Plant Biotechnologist
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (plant biology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for plant biology, tissue culture, and genetic engineering simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
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
