import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TakinFaceLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    { title: 'What determines body shape — genes plus environment', concept: `In "How the Takin Got Its Funny Face," the takin looks like it was assembled from spare parts: the body of a cow, the legs of a bear, the nose of a moose, and the horns of a wildebeest. But this "funny" shape is perfectly adapted to life on steep Himalayan bamboo slopes.\n\n**Body shape is determined by:**\n- **Genetics**: DNA provides the blueprint (bone length, muscle attachment points, organ size)\n- **Environment during development**: nutrition, temperature, altitude affect how the genetic plan is expressed\n- **Evolutionary history**: ancestors' body plans constrain what is possible\n- **Natural selection**: shapes that improve survival and reproduction are favoured\n\nThe takin's stocky build, arched nose, and thick coat are not random — they are solutions to specific problems: cold, altitude, steep terrain, and bamboo diet. Every feature has a function, even if it looks odd to human eyes.`, analogy: 'An animal\'s body shape is like a house designed by three architects working together: Genetics draws the initial blueprints, Environment modifies the plans during construction, and Evolution selected which blueprints survived from millions of drafts. The takin\'s "funny" house is perfectly designed for its neighbourhood.', storyConnection: 'The story says the takin looks like "the gods assembled it from leftover parts." In evolutionary biology, this is called a **mosaic** body plan — different body parts evolved at different rates and under different pressures. The takin\'s nose evolved for warming cold air, its legs for climbing, and its horns for defence — each under separate selection pressure.', checkQuestion: 'Identical human twins have the same DNA but can look different as adults. What accounts for the differences?', checkAnswer: 'Epigenetics and environment. Different nutrition, exercise, sun exposure, and even gut bacteria during development change how genes are expressed. One twin might be taller (better nutrition), more muscular (more exercise), or darker (more sun). Genes set the range of possible outcomes; environment determines where within that range each individual falls.', codeIntro: 'Model how genes and environment interact to determine body size in a population.', code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
n = 500

genetic_height = np.random.normal(170, 8, n)  # cm, genetic component
environmental_effect = np.random.normal(0, 5, n)  # nutrition, etc.
actual_height = genetic_height + environmental_effect

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.hist(genetic_height, bins=30, alpha=0.5, color='#3b82f6', label='Genetic potential', density=True)
ax1.hist(actual_height, bins=30, alpha=0.5, color='#22c55e', label='Actual (genes + environment)', density=True)
ax1.set_xlabel('Height (cm)', color='white')
ax1.set_ylabel('Density', color='white')
ax1.set_title('Height: Genetic Blueprint vs Reality', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
ax2.scatter(genetic_height, actual_height, alpha=0.3, s=10, color='#f59e0b')
ax2.plot([145, 195], [145, 195], '--', color='white', alpha=0.3)
ax2.set_xlabel('Genetic potential (cm)', color='white')
ax2.set_ylabel('Actual height (cm)', color='white')
ax2.set_title('Genes vs Reality (r\²={:.2f})'.format(np.corrcoef(genetic_height, actual_height)[0,1]**2), color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Genetic variation (std): {np.std(genetic_height):.1f} cm")
print(f"Environmental variation (std): {np.std(environmental_effect):.1f} cm")
print(f"Total variation (std): {np.std(actual_height):.1f} cm")
print(f"Heritability: {np.var(genetic_height)/np.var(actual_height):.2f}")`, challenge: 'What happens in a famine? Set environmental_effect mean to -10cm. How does the height distribution change? This is why average height increased dramatically in the 20th century — better nutrition, not genetic change.', successHint: 'Body shape is never purely genetic or purely environmental — it is always an interaction. Understanding this interaction is the foundation of developmental biology.' },
    { title: 'Developmental biology basics — building a body from a single cell', concept: `Every animal starts as a single fertilised egg and develops into a complex organism with trillions of specialised cells. How? Through four key processes:\n\n1. **Cell division** (mitosis): one cell becomes two, two become four...\n2. **Cell differentiation**: identical cells become specialised (muscle, nerve, bone)\n3. **Morphogenesis**: cells organise into tissues and organs through movement, folding, and signalling\n4. **Growth**: tissues expand through more division and cell enlargement\n\nThe key question: if every cell has the same DNA, how do they become different? The answer is **differential gene expression** — different cells activate different genes based on their position, neighbours, and chemical signals.\n\n**Morphogen gradients**: chemicals secreted from specific locations diffuse outward, creating concentration gradients. Cells read their local concentration and activate different genes at different thresholds. This is how a limb "knows" where the thumb should be vs the pinky.`, analogy: 'Development is like building a city from one house. The first house (fertilised egg) divides into a neighbourhood. Some houses become shops (muscle cells), others become offices (nerve cells), others become power stations (liver cells). Zoning laws (morphogen gradients) determine which building goes where. Same blueprints (DNA), different zones, different buildings.', storyConnection: 'The takin\'s "funny face" is built during embryonic development. Morphogen gradients in the takin embryo\'s face region specify where the arched nose bridge forms, where the wide nostrils develop, and where the horns emerge. Every species has its own facial morphogen recipe — the takin\'s recipe produces a face adapted to warming cold mountain air.', checkQuestion: 'A skin cell and a neuron in the same person have identical DNA. How can they be so different?', checkAnswer: 'They express different subsets of their shared genome. A skin cell has its skin genes "on" and neuron genes "off." A neuron has the reverse. Epigenetic marks (DNA methylation, histone modification) lock genes into on or off states during differentiation. The genome is a library of 20,000 books (genes); each cell type reads a different subset of about 5,000.', codeIntro: 'Simulate a morphogen gradient and show how it creates distinct cell fates at different positions.', code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')

# Morphogen gradient from a source at x=0
x = np.linspace(0, 10, 200)

# Concentration decays exponentially from source
lambda_decay = 3  # decay length
concentration = np.exp(-x / lambda_decay)

ax1.set_facecolor('#111827')
ax1.plot(x, concentration, color='#a855f7', linewidth=2)
ax1.fill_between(x, concentration, alpha=0.15, color='#a855f7')

# Thresholds for different cell fates
thresholds = [(0.7, 'Bone cells', '#ef4444'), (0.3, 'Muscle cells', '#f59e0b'), (0.1, 'Skin cells', '#22c55e')]
for thresh, label, color in thresholds:
    ax1.axhline(thresh, color=color, linestyle='--', alpha=0.5)
    x_thresh = -lambda_decay * np.log(thresh)
    ax1.text(x_thresh + 0.2, thresh + 0.03, f'{label} (>{thresh})', color=color, fontsize=9)

ax1.set_xlabel('Distance from source (mm)', color='white')
ax1.set_ylabel('Morphogen concentration', color='white')
ax1.set_title('Morphogen Gradient: How Position Determines Cell Fate', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Cell fate map
ax2.set_facecolor('#111827')
for i, xi in enumerate(x):
    c = concentration[i]
    if c > 0.7:
        color = '#ef4444'
    elif c > 0.3:
        color = '#f59e0b'
    elif c > 0.1:
        color = '#22c55e'
    else:
        color = '#3b82f6'
    ax2.bar(xi, 1, width=x[1]-x[0], color=color, alpha=0.8)

ax2.set_xlabel('Distance from source (mm)', color='white')
ax2.set_title('Resulting Cell Fate Map', color='white', fontsize=11)
ax2.set_yticks([])
ax2.tick_params(colors='gray')

# Legend
from matplotlib.patches import Patch
legend_elements = [Patch(color='#ef4444', label='Bone'), Patch(color='#f59e0b', label='Muscle'),
                   Patch(color='#22c55e', label='Skin'), Patch(color='#3b82f6', label='Undifferentiated')]
ax2.legend(handles=legend_elements, facecolor='#1f2937', edgecolor='gray', labelcolor='white', ncol=4)

plt.tight_layout()
plt.show()

print("One gradient creates three distinct cell types")
print("by using concentration thresholds.")
print("Change the gradient shape -> change the body plan.")`, challenge: 'Add a second morphogen from the opposite end (x=10). Cells now read TWO concentrations to determine fate. This is how 2D patterns (like finger spacing) are specified from 1D gradients.', successHint: 'Morphogen gradients are the master planners of body development. They convert position information into cell fate — the fundamental mechanism that builds every animal from a single cell.' },
    { title: 'Hox genes — the body\'s master architects', concept: `**Hox genes** are a family of transcription factors that specify body segment identity during development. They are the "address labels" that tell each body segment what to become.\n\n**Key properties:**\n- Found in virtually ALL animals (insects, fish, mammals)\n- Arranged in clusters on chromosomes\n- Their ORDER on the chromosome matches the ORDER of body segments they control (colinearity)\n- Mutations cause dramatic "homeotic" transformations (e.g., legs growing where antennae should be)\n\n**In vertebrates:**\n- 4 Hox clusters (HoxA, B, C, D) with ~39 genes total\n- Hox1-4: specify head/neck regions\n- Hox5-8: specify thorax\n- Hox9-13: specify abdomen and limbs\n\nThe takin\'s unusual body proportions (short legs relative to body, thick neck, massive shoulders) are shaped by Hox gene expression patterns that differ from a typical bovid. Small changes in when and where Hox genes are expressed can dramatically alter body proportions.`, analogy: 'Hox genes are like street address numbers. House #1 is always at one end of the street, #10 at the other. Change the address and you change what gets built there: a shop (leg) at address #3 becomes a house (antenna) if you relabel it as address #1. Hox genes don\'t build the structures — they tell other genes WHERE to build them.', storyConnection: 'The takin\'s "funny face" and unusual body proportions come from its specific Hox expression pattern. Compared to a cow (a close relative), the takin has modified Hox expression that shortens the legs, thickens the neck, and reshapes the nasal bones — all adaptations to steep, cold mountain terrain.', checkQuestion: 'A famous mutation in fruit flies puts legs where antennae should be (Antennapedia). What does this tell us about Hox genes?', checkAnswer: 'It shows that Hox genes determine segment IDENTITY, not segment FORMATION. The antenna segment still forms, but it is "mislabelled" as a leg segment. The segment reads its Hox code and builds whatever that code specifies — in this case, legs instead of antennae. Hox genes are identity switches, not construction blueprints.', codeIntro: 'Visualise Hox gene expression along the body axis and show how changes alter body plans.', code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(3, 1, figsize=(14, 9))
fig.patch.set_facecolor('#1f2937')

# Body segments
segments = ['Head', 'Neck', 'Shoulder', 'Thorax 1', 'Thorax 2', 'Lumbar 1', 'Lumbar 2', 'Sacral', 'Tail 1', 'Tail 2']
n_seg = len(segments)
hox_genes = ['Hox1', 'Hox2', 'Hox3', 'Hox4', 'Hox5', 'Hox6', 'Hox7', 'Hox8', 'Hox9', 'Hox10', 'Hox11', 'Hox13']
n_hox = len(hox_genes)

# Normal bovid Hox expression pattern (1 = expressed, 0 = not)
normal = np.zeros((n_hox, n_seg))
for h in range(n_hox):
    for s in range(n_seg):
        if s >= h * 0.8 and s <= h * 0.8 + 4:
            normal[h, s] = 1
normal = np.clip(normal, 0, 1)

# Modified (takin-like): shifted expression boundaries
takin = normal.copy()
takin[3:6, 1:4] = 1  # expanded neck/shoulder Hox expression
takin[7:10, 5:8] = 0.5  # reduced lumbar expression (shorter body)

for ax, data, title in zip(axes[:2], [normal, takin], ['Normal Bovid (cow)', 'Modified (takin-like)']):
    ax.set_facecolor('#111827')
    im = ax.imshow(data, aspect='auto', cmap='YlOrRd', vmin=0, vmax=1)
    ax.set_xticks(range(n_seg))
    ax.set_xticklabels(segments, color='white', fontsize=8, rotation=45, ha='right')
    ax.set_yticks(range(n_hox))
    ax.set_yticklabels(hox_genes, color='white', fontsize=8)
    ax.set_title(title, color='white', fontsize=11)
    ax.tick_params(colors='gray')

# Body proportions comparison
ax = axes[2]
ax.set_facecolor('#111827')
cow_proportions = [8, 10, 15, 20, 20, 15, 15, 10, 8, 5]  # relative segment size
takin_proportions = [10, 15, 20, 18, 16, 12, 10, 8, 5, 3]

x = np.arange(n_seg)
width = 0.35
ax.bar(x - width/2, cow_proportions, width, color='#3b82f6', alpha=0.7, label='Cow')
ax.bar(x + width/2, takin_proportions, width, color='#f59e0b', alpha=0.7, label='Takin')
ax.set_xticks(x)
ax.set_xticklabels(segments, color='white', fontsize=8, rotation=45, ha='right')
ax.set_ylabel('Relative size', color='white')
ax.set_title('Body Proportions: Cow vs Takin', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Hox gene changes between cow and takin:")
print("  Expanded Hox3-5 in neck/shoulder -> thicker neck, massive shoulders")
print("  Reduced Hox7-9 in lumbar -> shorter back, stockier body")
print("  Result: a body plan adapted for mountain terrain")`, challenge: 'Simulate the Antennapedia mutation: set Hox1-2 expression pattern equal to Hox5-6. What body region now has the "wrong" identity? This is exactly what happens in the famous fruit fly mutation.', successHint: 'Hox genes are the Rosetta Stone of body plan evolution. The same gene family controls body organisation from flies to fish to takins to humans — a stunning example of evolutionary conservation.' },
    { title: 'Evolutionary constraints — why not every shape is possible', concept: `Evolution cannot build any shape from scratch — it must modify existing structures. This creates **evolutionary constraints**:\n\n1. **Phylogenetic constraint**: an organism can only evolve from what its ancestors had. Mammals always have 7 cervical vertebrae (even giraffes!) because this was fixed early in mammalian evolution.\n\n2. **Developmental constraint**: some changes are impossible because they would disrupt essential developmental processes. Major Hox rearrangements are almost always lethal.\n\n3. **Physical constraint**: physics limits what biology can build. An insect cannot be elephant-sized (exoskeleton would collapse). A flying bird cannot weigh 500kg (insufficient lift).\n\n4. **Trade-offs**: improving one trait often worsens another. The takin\'s massive build gives it strength on mountain slopes but reduces running speed on flat ground.\n\nThe takin looks "funny" because it is a bovid (cow-like ancestor) modified for mountain life. Evolution could not start from scratch — it had to modify the bovid body plan within these constraints.`, analogy: 'Evolutionary constraints are like renovating a house. You can change the interior freely, modify the facade somewhat, but moving the foundation is nearly impossible without demolishing everything. Evolution renovates; it never demolishes and rebuilds. The takin is a heavily renovated cow, not a purpose-built mountain animal.', storyConnection: 'The story jokes that the takin was "assembled from spare parts." Evolution does work with spare parts — but they are its OWN spare parts, modified from what worked before. The takin\'s leg bones are modified cow leg bones. Its horns are modified antelope horns. Nothing is truly new; everything is repurposed.', checkQuestion: 'Why do all mammals have exactly 7 cervical (neck) vertebrae, even giraffes?', checkAnswer: 'Mutations that change cervical vertebra number are strongly selected against because the same Hox genes that specify neck vertebrae also control nerve and blood vessel development in that region. Changing the number disrupts these critical structures. The 7-vertebra constraint has been locked in for 200+ million years of mammalian evolution.', codeIntro: 'Map evolutionary constraints: which body features are easily changed and which are locked.', code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Evolvability map: how easily each trait can change
traits = ['Body size', 'Limb length', 'Coat colour', 'Tooth shape', 'Digit count',
          'Vertebra count', 'Heart chambers', 'Eye type', 'Body symmetry', 'Cell type']
evolvability = [9, 7, 10, 8, 3, 1, 1, 2, 0.5, 0.1]  # 0 = locked, 10 = highly evolvable
constraint_type = ['none', 'physical', 'none', 'diet', 'developmental', 'Hox',
                   'developmental', 'developmental', 'fundamental', 'fundamental']

colors_map = {'none': '#22c55e', 'physical': '#3b82f6', 'diet': '#f59e0b',
              'developmental': '#ef4444', 'Hox': '#a855f7', 'fundamental': '#6b7280'}
bar_colors = [colors_map[c] for c in constraint_type]

ax1.set_facecolor('#111827')
bars = ax1.barh(traits, evolvability, color=bar_colors, height=0.6)
ax1.set_xlabel('Evolvability (0=locked, 10=free)', color='white')
ax1.set_title('How Easily Can Each Trait Evolve?', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.invert_yaxis()

from matplotlib.patches import Patch
legend_items = [Patch(color=c, label=t) for t, c in colors_map.items()]
ax1.legend(handles=legend_items, facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, title='Constraint type', title_fontsize=9)

# Trade-off: body mass vs running speed for bovids
ax2.set_facecolor('#111827')
mass = np.array([30, 50, 100, 200, 300, 500, 700, 1000])
speed = 80 * mass**(-0.15)  # allometric scaling

ax2.plot(mass, speed, 'o-', color='#3b82f6', linewidth=2, markersize=8)

animals = [('Gazelle', 30, 80), ('Goat', 50, 55), ('Takin', 300, 30), ('Bison', 700, 55), ('Yak', 500, 40)]
for name, m, s in animals:
    ax2.plot(m, s, 'o', color='#f59e0b', markersize=12)
    ax2.annotate(name, (m, s), xytext=(5, 5), textcoords='offset points', color='#f59e0b', fontsize=9)

ax2.set_xlabel('Body mass (kg)', color='white')
ax2.set_ylabel('Max running speed (km/h)', color='white')
ax2.set_title('Trade-off: Mass vs Speed in Bovids', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_xscale('log')

plt.tight_layout()
plt.show()

print("The takin's constraints:")
print("  Can change: body size, coat, proportions (high evolvability)")
print("  Cannot change: 7 neck vertebrae, 4-chambered heart, bilateral symmetry")
print("  Trade-off: heavy build for mountain stability → slow on flat ground")`, challenge: 'Add more bovids to the mass-speed plot and fit a power law. Which species deviate most from the trend? Deviations reveal special adaptations (or constraints).', successHint: 'Evolutionary constraints explain why life is not infinitely diverse. The possible design space is limited by physics, development, and ancestry. Understanding these limits is as important as understanding adaptation.' },
    { title: 'Convergent body forms — when different species find the same solution', concept: `**Convergent evolution** produces similar body forms in unrelated species facing similar environmental challenges:\n\n- **Streamlined body**: dolphins (mammals), sharks (fish), ichthyosaurs (reptiles) — all evolved torpedo shapes for fast swimming\n- **Wings**: birds, bats, insects — all evolved flight independently\n- **Digging claws**: moles, mole-crickets, mole-crabs — all evolved digging limbs\n- **Stocky mountain body**: takin, muskox, mountain goat — all evolved thick, low-centre-of-gravity builds\n\nConvergence demonstrates that evolution is not random — certain shapes are optimal solutions to physical problems. Physics constrains biology.\n\n**The takin convergence**: the takin (Asia), muskox (Arctic), and mountain goat (North America) share remarkably similar body plans despite being only distantly related. All three independently evolved:\n- Short, thick legs (stability on slopes)\n- Massive shoulders (climbing power)\n- Dense underfur (cold insulation)\n- Arched nasal passages (warming cold air)`, analogy: 'Convergent evolution is like independent inventors creating the same product. Edison and Swan both invented the lightbulb independently because the physics demands a filament in a vacuum. Dolphins and ichthyosaurs both evolved torpedo shapes because fluid dynamics demands streamlining. The laws of physics are the same everywhere, so optimal solutions converge.', storyConnection: 'The takin\'s "funny" shape is actually a universal solution to mountain life. If you showed a biologist the takin, the muskox, and the mountain goat side by side (without labels), they might guess they are close relatives. They are not — they are convergent solutions to the same set of physical problems.', checkQuestion: 'Bats and birds both fly, but their wings are constructed completely differently. What is similar and what is different?', checkAnswer: 'Similar: airfoil shape (physics requires this for lift), hollow/light bones, large pectoral muscles. Different: bat wing membrane stretches between elongated fingers; bird wing uses feathers on a modified arm. The FUNCTION converged (flight) but the MECHANISM diverged (membrane vs feathers) because each lineage had different starting materials to work with.', codeIntro: 'Map convergent traits in mountain-adapted bovids from three different continents.', code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

categories = ['Leg
thickness', 'Shoulder
mass', 'Coat
density', 'Nasal
arch', 'Horn
size', 'Agility']
N = len(categories)

species = {
    'Takin (Asia)': [8, 9, 8, 9, 6, 5],
    'Muskox (Arctic)': [7, 8, 10, 7, 8, 4],
    'Mountain goat (N. America)': [6, 6, 7, 5, 4, 9],
    'Domestic cow (plains)': [5, 5, 3, 2, 3, 3],
}
colors = {'Takin (Asia)': '#f59e0b', 'Muskox (Arctic)': '#3b82f6', 'Mountain goat (N. America)': '#22c55e', 'Domestic cow (plains)': '#6b7280'}

angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

ax1 = plt.subplot(121, polar=True)
ax1.set_facecolor('#111827')
fig.patch.set_facecolor('#1f2937')

for name, values in species.items():
    v = values + values[:1]
    ax1.plot(angles, v, 'o-', linewidth=2, label=name, color=colors[name])
    ax1.fill(angles, v, alpha=0.05, color=colors[name])

ax1.set_xticks(angles[:-1])
ax1.set_xticklabels(categories, color='white', fontsize=8)
ax1.set_ylim(0, 10)
ax1.set_title('Convergent Mountain Adaptations', color='white', fontsize=11, pad=20)
ax1.legend(loc='upper left', bbox_to_anchor=(-0.3, 1.15), facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)

# Phylogenetic distance vs morphological similarity
ax2 = plt.subplot(122)
ax2.set_facecolor('#111827')

pairs = [
    ('Takin-Muskox', 25, 0.85, '#ef4444'),
    ('Takin-Mtn Goat', 20, 0.7, '#f59e0b'),
    ('Takin-Cow', 15, 0.4, '#22c55e'),
    ('Muskox-Mtn Goat', 22, 0.65, '#3b82f6'),
    ('Cow-Bison', 5, 0.6, '#a855f7'),
]

for name, phylo_dist, morph_sim, color in pairs:
    ax2.scatter(phylo_dist, morph_sim, s=150, color=color, zorder=5)
    ax2.annotate(name, (phylo_dist, morph_sim), xytext=(5, 5), textcoords='offset points', color=color, fontsize=8)

ax2.set_xlabel('Phylogenetic distance (Myr divergence)', color='white')
ax2.set_ylabel('Morphological similarity', color='white')
ax2.set_title('Convergence: Similar Shape Despite Distant Ancestry', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Convergent evolution in mountain bovids:")
print("  Takin, muskox, and mountain goat share similar body plans")
print("  despite diverging 20-25 million years ago.")
print("  Similar habitats -> similar selection pressures -> similar solutions.")`, challenge: 'Add aquatic mammals (whale, seal, otter) to a separate convergence chart. Which traits converge for aquatic life? How do the convergent traits differ from mountain life convergences?', successHint: 'Convergent evolution is powerful evidence that natural selection, not chance, shapes body form. When the same solution evolves independently in different lineages, you can be confident that physics and ecology, not random drift, drove the change.' },
    { title: 'The takin\'s unique adaptations — anatomy for mountain life', concept: `The takin (Budorcas taxicolor) has a suite of remarkable adaptations:\n\n**Nasal passages**: arched and enlarged, with extensive turbinate bones. Cold air is warmed and moistened as it passes through the nasal labyrinth before reaching the lungs. The takin can breathe comfortably at -30°C without damaging lung tissue.\n\n**Coat**: two layers — dense, fine underfur for insulation + oily outer guard hairs that repel rain and snow. The oil is so effective that takins can sit in cold rain for hours without their skin getting wet.\n\n**Body proportions**: short legs, massive shoulders, low centre of gravity. This makes them stable on steep slopes but slow runners on flat ground. Their leg muscles are optimised for climbing power, not running speed.\n\n**Hooves**: wide, with a soft central pad that grips wet rock (like climbing shoes). The outer rim is hard keratin for digging into ice and packed snow.\n\n**Social behaviour**: herds of 10-100 huddle together in cold weather, sharing body heat. They follow ancient trails through bamboo forests, creating paths that other animals (and humans) also use.\n\nEvery one of these features has a clear functional explanation. The "funny" shape is a masterpiece of mountain engineering.`, analogy: 'The takin is like a custom-built mountain truck. Short wheelbase (legs) for tight turns on switchbacks. Heavy-duty suspension (massive shoulders) for hauling uphill. All-terrain tyres (wide hooves with grip pads). Heated cab (nasal warming system). Waterproof coating (oily fur). It looks weird on a highway (flat ground) but dominates on its home terrain.', storyConnection: 'The story ends with the realisation that the takin\'s "funny" face is actually beautiful when seen in context. The arched nose warms freezing air. The stocky body navigates cliffs. The thick fur survives blizzards. Every "flaw" is a feature when you understand the mountain environment it was designed for.', checkQuestion: 'The takin\'s oil-rich coat makes it nearly waterproof. Why don\'t all animals have this adaptation?', checkAnswer: 'Trade-offs. The oil that waterproofs the takin also makes it overheat in warm environments (oil traps heat). It smells strongly (attracting parasites in warm climates). It requires energy to produce (metabolic cost). In the takin\'s cold, wet mountain habitat, these costs are worth paying. In a warm lowland habitat, they would be harmful. Every adaptation is a solution to a specific problem — not a universal improvement.', codeIntro: 'Compare the takin\'s adaptations to other mountain species using a multi-trait analysis.', code: `import numpy as np
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

adaptations = ['Nasal
warming', 'Coat
insulation', 'Waterproof
fur', 'Hoof
grip', 'Climbing
power', 'Cold
tolerance', 'Running
speed', 'Heat
tolerance']

species_data = {
    'Takin': [10, 9, 10, 8, 9, 9, 3, 2],
    'Snow leopard': [6, 8, 5, 7, 8, 8, 8, 3],
    'Red panda': [5, 7, 6, 5, 6, 7, 4, 3],
    'Himalayan tahr': [7, 7, 5, 9, 9, 7, 5, 4],
    'Blue sheep (bharal)': [6, 6, 4, 10, 8, 6, 7, 5],
}
colors = {'Takin': '#f59e0b', 'Snow leopard': '#a855f7', 'Red panda': '#ef4444', 'Himalayan tahr': '#22c55e', 'Blue sheep (bharal)': '#3b82f6'}

x = np.arange(len(adaptations))
width = 0.15
for i, (name, values) in enumerate(species_data.items()):
    offset = (i - 2) * width
    ax.bar(x + offset, values, width, label=name, color=colors[name], alpha=0.8)

ax.set_xticks(x)
ax.set_xticklabels(adaptations, color='white', fontsize=9)
ax.set_ylabel('Adaptation score (0-10)', color='white')
ax.set_title('Himalayan Mountain Species: Adaptation Profiles', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.set_ylim(0, 12)

plt.tight_layout()
plt.show()

print("The takin's standout adaptations:")
print("  #1 Nasal warming (10/10): best in class")
print("  #1 Waterproof fur (10/10): oily coat unique among bovids")
print("  #1 Cold tolerance (9/10): survives -30C regularly")
print("  Weakness: running speed (3/10) and heat tolerance (2/10)")
print()
print("Every adaptation has a cost. The takin pays for mountain")
print("mastery with inability to live in warm, flat environments.")`, challenge: 'Calculate a "mountain adaptation index" by weighting each trait by its importance for mountain survival. Which species scores highest overall? Is the takin the best-adapted, or does the snow leopard win in a different way?', successHint: 'The takin is not the best at everything — but it is the best at the specific combination of traits needed for its ecological niche. Understanding adaptation means understanding trade-offs, constraints, and context. Level 2 explores the molecular genetics behind these adaptations.' },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Genetics & Morphology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for genetics and morphology simulations. Click to start.</p>
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
