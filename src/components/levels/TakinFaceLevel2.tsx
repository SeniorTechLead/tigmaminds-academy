import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TakinFaceLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    { title: 'Gene regulatory networks — the orchestra behind body shape', concept: `Body shape is not controlled by single genes but by **gene regulatory networks (GRNs)** — interconnected circuits where genes regulate each other's activity.\n\nA GRN consists of:\n- **Transcription factors**: proteins that bind DNA to turn genes on/off\n- **Enhancers**: DNA regions where transcription factors bind (like switches)\n- **Signalling pathways**: communication between cells (Wnt, Hedgehog, BMP, FGF)\n- **Feedback loops**: positive (amplifying) and negative (dampening) circuits\n\nThe takin's unique body proportions are encoded not in individual genes (takins share >95% of their genes with cows) but in the REGULATORY elements that control when, where, and how strongly those genes are expressed. Small changes in enhancer sequences can dramatically alter body shape without changing the proteins themselves.`, analogy: 'A GRN is like a music score for an orchestra. Each musician (gene) can play their instrument, but the score (regulatory network) tells them when to play, how loudly, and in what combination. Change a few notes in the score, and the symphony sounds completely different — even though the same musicians are playing the same instruments.', storyConnection: 'The takin\'s "funny" shape versus a cow\'s normal shape comes not from different genes but from different regulatory scores. The same instruments (genes) playing a different arrangement (GRN) produces a different body plan — stockier, thicker, adapted to mountains.', checkQuestion: 'Humans and chimpanzees share ~98.8% of their DNA. If the genes are nearly identical, what makes us so different?', checkAnswer: 'Gene regulation. The ~1.2% difference is concentrated in regulatory regions (enhancers, promoters) rather than protein-coding regions. Human-chimp differences in brain size, facial shape, and hand dexterity come from changes in WHEN and HOW MUCH key genes are expressed, not from having different genes. Evolution tinkers more with the control knobs than the machinery itself.', codeIntro: 'Simulate a gene regulatory network and show how small regulatory changes alter the output.', code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simple 4-gene regulatory network
# Gene A activates B, B activates C, C inhibits A (negative feedback)
# Gene D modifies the A->B connection (regulatory modifier)

t = np.linspace(0, 50, 500)
dt = t[1] - t[0]

def simulate_grn(d_level=1.0, label=''):
    a = np.zeros_like(t); b = np.zeros_like(t); c = np.zeros_like(t)
    a[0] = 1.0
    for i in range(1, len(t)):
        da = 1.0 - 0.5 * c[i-1] - 0.2 * a[i-1]  # production - inhibition by C - decay
        db = 0.8 * a[i-1] * d_level - 0.3 * b[i-1]  # activation by A (modified by D) - decay
        dc = 0.6 * b[i-1] - 0.4 * c[i-1]  # activation by B - decay
        a[i] = max(0, a[i-1] + da * dt)
        b[i] = max(0, b[i-1] + db * dt)
        c[i] = max(0, c[i-1] + dc * dt)
    return a, b, c

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

d_levels = [0.5, 1.0, 2.0]
titles = ['Low D (cow-like)', 'Normal D (wild type)', 'High D (takin-like)']
colors_genes = ['#ef4444', '#22c55e', '#3b82f6']

for ax, d_lev, title in zip(axes, d_levels, titles):
    ax.set_facecolor('#111827')
    a, b, c = simulate_grn(d_lev)
    ax.plot(t, a, color=colors_genes[0], linewidth=2, label='Gene A')
    ax.plot(t, b, color=colors_genes[1], linewidth=2, label='Gene B')
    ax.plot(t, c, color=colors_genes[2], linewidth=2, label='Gene C')
    ax.set_title(title, color='white', fontsize=11)
    ax.set_xlabel('Time', color='white')
    ax.tick_params(colors='gray')
    ax.set_ylim(0, 5)
    if ax == axes[0]:
        ax.set_ylabel('Expression level', color='white')
        ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

plt.suptitle('Gene Regulatory Network: Same Genes, Different Regulation', color='white', fontsize=13, y=1.02)
plt.tight_layout()
plt.show()

print("Same 3 genes, different regulatory strength (Gene D):")
print("  Low D (0.5): low Gene B -> cow-like proportions")
print("  Normal D (1.0): balanced expression")
print("  High D (2.0): high Gene B -> takin-like proportions")
print()
print("Key insight: evolution changes body shape by modifying")
print("regulatory connections, not by inventing new genes.")`, challenge: 'Add a fifth gene E that creates a positive feedback loop on Gene C. How does this change the dynamics? Positive feedback often creates bistable switches — cells locked into one of two states.', successHint: 'Gene regulatory networks are the real architects of body form. The genome is not a blueprint but a programme — and the GRN is the code that runs it.' },
    { title: 'Heterochrony — evolution by changing developmental timing', concept: `**Heterochrony** is evolutionary change in the timing or rate of developmental events. It is one of the most powerful mechanisms for changing body shape.\n\n**Types of heterochrony:**\n- **Neoteny** (paedomorphosis): adult retains juvenile features (slow development). Example: axolotl retains larval gills throughout life\n- **Progenesis**: development truncated early, reaching sexual maturity at a juvenile stage. Example: miniaturised frogs\n- **Acceleration**: development speeds up, reaching adult form faster. Example: marsupial forelimbs develop rapidly for climbing to the pouch\n- **Hypermorphosis**: development continues longer, producing exaggerated adult features. Example: Irish elk's enormous antlers\n\nThe takin shows elements of hypermorphosis in its shoulder and nasal development — these structures continue growing for longer than in related species, producing the massive shoulders and arched nose that define its appearance.`, analogy: 'Heterochrony is like adjusting the speed dial on a time-lapse video of development. Play it slower (neoteny): the "movie" ends at a juvenile-looking frame. Play it faster (acceleration): the movie speeds through to an adult form quickly. Let it run longer (hypermorphosis): the movie continues past normal adult, producing exaggerated features.', storyConnection: 'The takin\'s "funny" proportions can be explained by heterochrony: its shoulder muscles and nasal bones continue developing longer than in a cow (hypermorphosis), while its legs stop growing relatively early (truncation). The result: massive shoulders, thick nose, short legs — all from changes in developmental timing, not new genes.', checkQuestion: 'Humans are often described as "neotenous apes" — retaining juvenile features into adulthood. What evidence supports this?', checkAnswer: 'Adult humans resemble juvenile chimps more than adult chimps: flat face, large brain-to-body ratio, thin body hair, small jaws, delayed development. Human development is "slowed down" relative to other apes, allowing the brain to grow for longer. Our large brain may be a consequence of neoteny — a byproduct of slowed overall development.', codeIntro: 'Simulate heterochrony: how changing growth timing alters adult body proportions.', code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

time = np.linspace(0, 20, 200)  # developmental time (arbitrary units)

# Growth curves for two body parts: shoulders and legs
def growth_curve(t, rate, onset, max_size, stop_time):
    growth = max_size * (1 - np.exp(-rate * np.maximum(t - onset, 0)))
    growth[t > stop_time] = growth[np.argmin(np.abs(t - stop_time))]
    return growth

# Normal bovid (cow)
cow_shoulders = growth_curve(time, 0.3, 0, 100, 15)
cow_legs = growth_curve(time, 0.4, 0, 120, 15)

# Takin: shoulders grow longer (hypermorphosis), legs stop earlier (truncation)
takin_shoulders = growth_curve(time, 0.3, 0, 130, 20)  # grows longer
takin_legs = growth_curve(time, 0.4, 0, 90, 10)  # stops earlier

ax1.set_facecolor('#111827')
ax1.plot(time, cow_shoulders, color='#3b82f6', linewidth=2, linestyle='--', label='Cow shoulders')
ax1.plot(time, cow_legs, color='#3b82f6', linewidth=2, label='Cow legs')
ax1.plot(time, takin_shoulders, color='#f59e0b', linewidth=2, linestyle='--', label='Takin shoulders')
ax1.plot(time, takin_legs, color='#f59e0b', linewidth=2, label='Takin legs')

ax1.axvline(15, color='#3b82f6', linestyle=':', alpha=0.3)
ax1.text(15.2, 10, 'Cow
maturity', color='#3b82f6', fontsize=8)
ax1.set_xlabel('Developmental time', color='white')
ax1.set_ylabel('Structure size', color='white')
ax1.set_title('Heterochrony: Changed Growth Timing', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Final proportions comparison
ax2.set_facecolor('#111827')
parts = ['Head', 'Neck', 'Shoulders', 'Torso', 'Legs', 'Tail']
cow_final = [10, 12, 15, 25, 30, 8]
takin_final = [12, 18, 25, 20, 18, 5]

x = np.arange(len(parts))
width = 0.35
ax2.bar(x - width/2, cow_final, width, color='#3b82f6', alpha=0.7, label='Cow')
ax2.bar(x + width/2, takin_final, width, color='#f59e0b', alpha=0.7, label='Takin')
ax2.set_xticks(x)
ax2.set_xticklabels(parts, color='white')
ax2.set_ylabel('Relative proportion (%)', color='white')
ax2.set_title('Adult Body Proportions', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Heterochrony in the takin:")
print("  Shoulders: hypermorphosis (grow longer) -> massive build")
print("  Legs: truncation (stop early) -> short, thick legs")
print("  Nose: hypermorphosis (extended growth) -> arched nasal bridge")
print("  Result: stocky mountain body from a cow-like ancestor")`, challenge: 'Simulate neoteny: make ALL growth curves slower. The adult animal resembles a juvenile of the ancestor. This is how axolotls evolved — they are "permanent larvae."', successHint: 'Heterochrony is evolution\'s simplest tool for changing body shape: just adjust the developmental clock. No new genes needed — just new timing.' },
    { title: 'Allometric growth — why body parts scale differently', concept: `**Allometry** describes how different body parts grow at different rates relative to overall body size. The relationship follows a power law:\n\n**y = a * x^b**\n\nwhere y = organ size, x = body size, a = constant, b = scaling exponent.\n\n- b = 1: **isometric** (part grows at same rate as body)\n- b > 1: **positive allometry** (part grows faster — e.g., deer antlers)\n- b < 1: **negative allometry** (part grows slower — e.g., brain in large animals)\n\nThe takin shows positive allometry in shoulders (grow disproportionately large) and negative allometry in legs (grow disproportionately short). These allometric patterns produce the distinctive body shape from a generic bovid growth programme.`, analogy: 'Allometry is like zooming a photo where different parts zoom at different speeds. If arms zoom faster than the body (positive allometry), the figure looks like a basketball player. If the head zooms slower (negative allometry), it looks proportionally small. The same starting photo, different zoom rates, very different final images.', storyConnection: 'The takin\'s shoulder allometry coefficient (b > 1) means that as the animal grows from calf to adult, its shoulders increase disproportionately. A takin calf looks much more "normal" (cow-like) than an adult. The "funny" proportions emerge during growth — the adult takin is the extreme expression of its allometric growth programme.', checkQuestion: 'Ant mandibles show extreme positive allometry (b = 2-3). What does this mean for large ants versus small ants?', checkAnswer: 'Large ants have disproportionately enormous mandibles compared to small ants of the same species. A large worker ant might have mandibles 4x larger than expected from simple scaling. This is why "major workers" (soldier ants) look like they are all head and jaws — positive allometry exaggerates the mandible as the ant grows larger.', codeIntro: 'Plot allometric growth curves and show how they produce the takin\'s body proportions.', code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

body_mass = np.linspace(10, 300, 100)  # kg

# Allometric curves: organ_size = a * body_mass^b
organs = [
    ('Brain', 5, 0.75, '#a855f7'),   # negative allometry
    ('Heart', 0.8, 1.0, '#ef4444'),  # isometric
    ('Antlers/horns', 0.01, 1.5, '#f59e0b'),  # positive allometry
    ('Shoulders (takin)', 0.5, 1.3, '#22c55e'),  # positive
    ('Legs (takin)', 2, 0.7, '#3b82f6'),  # negative
]

ax1.set_facecolor('#111827')
for name, a, b, color in organs:
    size = a * body_mass**b
    ax1.loglog(body_mass, size, color=color, linewidth=2, label=f'{name} (b={b})')

ax1.set_xlabel('Body mass (kg)', color='white')
ax1.set_ylabel('Organ/structure size (relative)', color='white')
ax1.set_title('Allometric Scaling: Log-Log Plot', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Body shape at different sizes
ax2.set_facecolor('#111827')
sizes = [30, 100, 300]  # kg (calf, yearling, adult)
size_labels = ['Calf (30kg)', 'Yearling (100kg)', 'Adult (300kg)']
colors_size = ['#22c55e', '#f59e0b', '#ef4444']

parts = ['Head', 'Neck', 'Shoulder', 'Torso', 'Legs']
b_values = [0.8, 1.1, 1.3, 1.0, 0.7]  # allometric exponents

for i, (mass, label, color) in enumerate(zip(sizes, size_labels, colors_size)):
    proportions = [mass**b for b in b_values]
    total = sum(proportions)
    proportions = [p/total * 100 for p in proportions]
    x = np.arange(len(parts))
    ax2.bar(x + i*0.25, proportions, 0.25, color=color, alpha=0.8, label=label)

ax2.set_xticks(np.arange(len(parts)) + 0.25)
ax2.set_xticklabels(parts, color='white')
ax2.set_ylabel('Proportion of body (%)', color='white')
ax2.set_title('How Proportions Change With Growth', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Allometric growth in the takin:")
print("  Shoulders (b=1.3): grow faster -> massive in adults")
print("  Legs (b=0.7): grow slower -> proportionally short")
print("  Calves look 'normal'; adults look 'funny'")
print("  The 'funny' shape EMERGES during growth")`, challenge: 'Plot the allometric scaling of brain size across mammals (b ≈ 0.75). Which mammals have brains larger than predicted by the trend? Which are smaller? Deviations from the allometric line tell us about cognitive evolution.', successHint: 'Allometry explains why animals of different sizes have different proportions. The takin\'s shape is not arbitrary — it is the mathematical consequence of its specific allometric growth programme.' },
    { title: 'Morphometric analysis — measuring shape scientifically', concept: `**Morphometrics** is the quantitative analysis of biological shape. It converts complex 3D forms into numbers that can be statistically compared.\n\n**Traditional morphometrics**: measure distances, angles, and ratios (skull length, leg-to-body ratio). Simple but loses shape information.\n\n**Geometric morphometrics**: place **landmarks** (homologous points) on structures, then use multivariate statistics to analyse shape variation.\n\nKey steps:\n1. Place landmarks on specimens (e.g., skull tip, eye socket centre, jaw joint)\n2. **Procrustes superimposition**: remove size, position, and rotation so only SHAPE differences remain\n3. **Principal Component Analysis (PCA)**: find the major axes of shape variation\n4. Interpret: PC1 might be "skull length," PC2 might be "face width"\n\nMorphometric analysis of takin skulls reveals that their unusual face shape is primarily driven by two changes from the ancestral bovid: nasal bone elongation (PC1) and zygomatic arch widening (PC2).`, analogy: 'Morphometrics is like comparing maps of different countries by overlaying them at the same scale and orientation. After alignment, the remaining differences are pure SHAPE differences — not size or position. Procrustes alignment is the "overlay" step that lets us compare shapes fairly.', storyConnection: 'A morphometric analysis of the takin skull compared to cow, goat, and muskox skulls would quantify exactly how "funny" the takin face is. The numbers would show: longer nasal bridge (+2 standard deviations from bovid mean), wider zygomatic arches (+1.5 SD), shorter skull overall (-1 SD). The "funny" becomes precisely measurable.', checkQuestion: 'Why use landmarks instead of just measuring overall skull length and width?', checkAnswer: 'Landmarks capture LOCAL shape changes that length/width miss. Two skulls can have the same length but very different shapes (one might have a long nose and short braincase, the other the reverse). Landmarks detect these local differences. Additionally, landmarks allow multivariate analysis (PCA) that reveals patterns invisible in univariate measurements.', codeIntro: 'Perform a simplified geometric morphometric analysis on simulated skull shapes.', code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate landmark data for 4 species' skulls (2D, simplified)
# 8 landmarks: nose tip, nasal bridge, eyes (2), jaw joint (2), back of skull, chin
base_landmarks = np.array([
    [0, 0],     # nose tip
    [3, 1],     # nasal bridge
    [5, 2],     # left eye
    [5, -2],    # right eye
    [8, 1.5],   # left jaw joint
    [8, -1.5],  # right jaw joint
    [10, 0],    # back of skull
    [2, -1],    # chin
])

species_mods = {
    'Cow': np.array([[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]]),
    'Takin': np.array([[-1,0.5], [0,1.5], [0.5,0.5], [0.5,-0.5], [0,0.5], [0,-0.5], [-0.5,0], [-0.5,-0.5]]),
    'Muskox': np.array([[0,0.3], [0.5,0.8], [1,1], [1,-1], [0.5,0.5], [0.5,-0.5], [0,0], [0,-0.3]]),
    'Goat': np.array([[0.5,-0.2], [-0.3,0], [-0.5,0.3], [-0.5,-0.3], [-0.3,0.2], [-0.3,-0.2], [0.3,0], [0.3,0]]),
}
species_colors = {'Cow': '#3b82f6', 'Takin': '#f59e0b', 'Muskox': '#22c55e', 'Goat': '#a855f7'}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Left: skull shapes
ax1.set_facecolor('#111827')
for name, mods in species_mods.items():
    landmarks = base_landmarks + mods
    # Draw skull outline
    outline_idx = [0, 1, 2, 6, 5, 3, 0]  # connect landmarks
    ax1.plot(landmarks[outline_idx, 0], landmarks[outline_idx, 1],
             'o-', color=species_colors[name], linewidth=2, markersize=6, label=name, alpha=0.8)

ax1.set_xlabel('Anterior → Posterior', color='white')
ax1.set_ylabel('Dorsal ↕ Ventral', color='white')
ax1.set_title('Skull Shapes (Landmark Overlay)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.set_aspect('equal')
ax1.tick_params(colors='gray')

# Right: PCA of shape variation
ax2.set_facecolor('#111827')

# Generate multiple specimens per species (with noise)
all_coords = []
all_labels = []
n_per_species = 20
for name, mods in species_mods.items():
    for _ in range(n_per_species):
        noisy = base_landmarks + mods + np.random.normal(0, 0.3, base_landmarks.shape)
        all_coords.append(noisy.flatten())
        all_labels.append(name)

all_coords = np.array(all_coords)
mean_shape = np.mean(all_coords, axis=0)
centered = all_coords - mean_shape

# Simple PCA
cov = np.cov(centered.T)
evals, evecs = np.linalg.eigh(cov)
idx = np.argsort(evals)[::-1]
pc1 = centered @ evecs[:, idx[0]]
pc2 = centered @ evecs[:, idx[1]]

for name in species_mods:
    mask = [l == name for l in all_labels]
    ax2.scatter(pc1[mask], pc2[mask], color=species_colors[name], s=40, alpha=0.6, label=name)

ax2.set_xlabel(f'PC1 ({evals[idx[0]]/sum(evals)*100:.0f}% variance)', color='white')
ax2.set_ylabel(f'PC2 ({evals[idx[1]]/sum(evals)*100:.0f}% variance)', color='white')
ax2.set_title('Shape Space (PCA of landmarks)', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')
ax2.axhline(0, color='gray', alpha=0.2)
ax2.axvline(0, color='gray', alpha=0.2)

plt.tight_layout()
plt.show()

print("Morphometric analysis:")
print("  PC1: primarily nasal elongation (takin separates from others)")
print("  PC2: skull width (muskox separates)")
print("  The 'funny' takin face is quantified as an outlier in shape space")`, challenge: 'Add 20 fossil specimens (simulated) intermediate between cow and takin. Can you trace the evolutionary path in shape space? This is how palaeontologists reconstruct morphological evolution.', successHint: 'Morphometrics transforms subjective impressions ("funny face") into objective measurements. It is the bridge between qualitative observation and quantitative science in evolutionary biology.' },
    { title: 'Phylogenetic comparative methods — evolution in context', concept: `**Phylogenetic comparative methods** analyse trait evolution while accounting for the evolutionary relationships between species. Key principle: closely related species share traits due to common ancestry, not independent evolution.\n\n**Methods:**\n- **Independent contrasts**: compare trait differences between sister species (removing the shared ancestry component)\n- **Ancestral state reconstruction**: estimate what the ancestor looked like using the phylogeny and tip data\n- **PGLS** (phylogenetic generalised least squares): regression that accounts for shared ancestry\n- **Phylogenetic signal** (Blomberg's K, Pagel's lambda): measure how much a trait follows the phylogeny\n\nFor the takin, these methods reveal that its body proportions evolved rapidly compared to other bovids — consistent with strong directional selection for mountain adaptation rather than random drift.`, analogy: 'Phylogenetic comparative methods are like correcting for family resemblance in a scientific study. If you find that tall parents have tall children, that is ancestry, not an independent observation. You need to account for family structure to find the real effect. Similarly, you must account for phylogeny to find real evolutionary patterns.', storyConnection: 'Placing the takin on the bovid phylogeny shows that its unusual shape evolved rapidly on a specific branch — the one leading to the Himalayan lineage. This rapid evolution suggests strong selection pressure (mountain environment) rather than gradual drift.', checkQuestion: 'Two species both have long necks: giraffes and gerenuk (a type of antelope). Are these independent evidence for selection on neck length?', checkAnswer: 'It depends on their phylogenetic relationship. Giraffes and gerenuks are in different families, so their long necks likely evolved independently (convergence) — that IS independent evidence. But if two giraffe species both have long necks, that is shared ancestry (one evolution event, not two). Phylogenetic methods distinguish these cases.', codeIntro: 'Build a simple phylogenetic tree and test whether trait evolution follows ancestry or shows convergence.', code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Simple phylogeny of bovids
species = ['Cow', 'Bison', 'Goat', 'Takin', 'Muskox', 'Sheep']
# Divergence times (Mya)
tree = {
    'x': [0, 0, 0, 0, 0, 0, 15, 10, 20, 8, 25],
    'y': [1, 2, 3, 4, 5, 6, 1.5, 4.5, 3, 5.5, 3],
}

ax1.set_facecolor('#111827')
# Draw tree manually
branches = [
    ([25, 20, 20], [3, 3, 1.5]),  # root to cow-bison ancestor
    ([20, 15, 15], [1.5, 1.5, 1]),  # to cow
    ([20, 15, 15], [1.5, 1.5, 2]),  # to bison
    ([25, 20, 20], [3, 3, 4.5]),  # root to goat-takin ancestor
    ([20, 10, 10], [4.5, 4.5, 3]),  # to goat
    ([20, 10, 10], [4.5, 4.5, 4]),  # to takin
    ([20, 8, 8], [4.5, 4.5, 5]),   # ancestor to muskox
    ([20, 8, 8], [4.5, 4.5, 6]),   # ancestor to sheep
]
for bx, by in branches:
    ax1.plot(bx, by, color='white', linewidth=1.5)

for i, name in enumerate(species):
    ax1.text(-1, i+1, name, color='white', fontsize=10, va='center', ha='right')

# Colour by mountain adaptation score
scores = [2, 3, 6, 9, 8, 5]
for i, (name, score) in enumerate(zip(species, scores)):
    color = plt.cm.YlOrRd(score / 10)
    ax1.plot(0, i+1, 'o', color=color, markersize=15)
    ax1.text(0.5, i+1, f'{score}/10', color=color, fontsize=9, va='center')

ax1.set_xlabel('Million years ago', color='white')
ax1.set_title('Bovid Phylogeny + Mountain Adaptation', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.invert_xaxis()

# Trait evolution vs phylogenetic distance
ax2.set_facecolor('#111827')

# Phylogenetic distances (pairwise divergence times)
pair_names = []
pair_dist = []
pair_trait_diff = []

for i in range(len(species)):
    for j in range(i+1, len(species)):
        pair_names.append(f'{species[i][:3]}-{species[j][:3]}')
        # Approximate divergence time
        div_time = np.random.uniform(8, 25)
        pair_dist.append(div_time)
        pair_trait_diff.append(abs(scores[i] - scores[j]))

ax2.scatter(pair_dist, pair_trait_diff, c='#f59e0b', s=60, alpha=0.6)

# Fit line
z = np.polyfit(pair_dist, pair_trait_diff, 1)
x_fit = np.linspace(5, 30, 100)
ax2.plot(x_fit, np.polyval(z, x_fit), '--', color='white', alpha=0.5)

# Highlight convergent pairs (similar traits despite distant ancestry)
for name, dist, diff in zip(pair_names, pair_dist, pair_trait_diff):
    if diff < 2 and dist > 15:  # convergent
        ax2.annotate(name, (dist, diff), color='#22c55e', fontsize=8)
    elif diff > 5 and dist < 12:  # divergent (rapid evolution)
        ax2.annotate(name, (dist, diff), color='#ef4444', fontsize=8)

ax2.set_xlabel('Phylogenetic distance (Myr)', color='white')
ax2.set_ylabel('Trait difference', color='white')
ax2.set_title('Trait Divergence vs Ancestry', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Phylogenetic analysis of mountain adaptation:")
print("  Takin (9/10) and Muskox (8/10): similar scores, distant ancestry")
print("  -> CONVERGENT evolution (independent mountain adaptation)")
print("  Takin (9/10) and Goat (6/10): different scores, close ancestry")
print("  -> DIVERGENT evolution (rapid adaptation in takin lineage)")`, challenge: 'Calculate Blomberg\'s K (phylogenetic signal) for the mountain adaptation scores. K near 1 means traits follow phylogeny; K near 0 means traits evolve independently of ancestry. What does K tell us about mountain adaptation?', successHint: 'Phylogenetic comparative methods are essential for understanding whether similarities are due to shared ancestry or independent adaptation. They are the statistical backbone of modern evolutionary biology.' },
    { title: '3D morphological modelling — digital anatomy', concept: `**3D morphological modelling** creates digital replicas of biological structures for analysis, comparison, and simulation. Technologies include:\n\n- **CT scanning** (computed tomography): X-ray cross-sections assembled into 3D volumes. Reveals internal bone, organ, and tissue structure\n- **Surface scanning** (photogrammetry, structured light): captures external shape at micrometre resolution\n- **MRI**: soft tissue imaging in 3D (brain, muscles, organs)\n- **Micro-CT**: CT at microscopic resolution (individual bone trabeculae, tooth enamel)\n\n**Applications in evolutionary biology:**\n- Compare skull shapes across species quantitatively (3D morphometrics)\n- Reconstruct fossil organisms from fragmentary remains\n- Simulate biomechanics (how does jaw shape affect bite force?)\n- Model development (how does skull shape change during growth?)\n- Virtual dissection without destroying rare specimens\n\nA 3D model of the takin skull, compared to cow and muskox skulls, reveals exactly which bones are modified and how. The nasal turbinates (internal nose bones) are 3x larger than a cow\'s — this is the air-warming system that allows the takin to breathe in extreme cold.`, analogy: '3D morphological modelling is like Google Street View for anatomy. Instead of photographing buildings from the outside, you scan bones and organs from every angle, creating a digital twin that can be explored, measured, and compared without ever touching the original specimen.', storyConnection: 'If someone 3D-scanned the takin\'s skull and printed it alongside a cow\'s skull, the differences would be immediately clear: the arched nasal bridge, the enlarged turbinates, the wider zygomatic arches. The "funny face" would be quantified in millimetres of bone.', checkQuestion: 'Why is digital 3D modelling replacing physical specimen collections in many museums?', checkAnswer: 'Digital models can be shared instantly worldwide, measured by anyone with a computer, stored indefinitely without degradation, and manipulated non-destructively. A researcher in India can study a fossil in a German museum without travelling. Multiple researchers can study the same specimen simultaneously. And rare specimens (like the only known skull of an extinct species) are protected from handling damage.', codeIntro: 'Create and compare simplified 3D skull models and perform basic shape analysis.', code: `import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

fig = plt.figure(figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

def create_skull_points(nasal_arch, width, length, n=500):
    """Generate 3D point cloud for simplified skull surface"""
    np.random.seed(42)
    t = np.random.uniform(0, 2*np.pi, n)
    u = np.random.uniform(-np.pi/2, np.pi/2, n)
    # Ellipsoid base
    x = length * np.cos(u) * np.cos(t)
    y = width * np.cos(u) * np.sin(t)
    z = 0.6 * np.sin(u)
    # Nasal arch modification (front of skull)
    nasal_mask = x > length * 0.3
    z[nasal_mask] += nasal_arch * np.exp(-((x[nasal_mask] - length*0.5)**2) / (2*(length*0.15)**2))
    return x, y, z

# Cow skull
ax1 = fig.add_subplot(131, projection='3d')
ax1.set_facecolor('#111827')
x, y, z = create_skull_points(nasal_arch=0.1, width=0.8, length=1.5)
ax1.scatter(x, y, z, c=z, cmap='Blues', s=1, alpha=0.5)
ax1.set_title('Cow', color='white', fontsize=11)
ax1.tick_params(colors='gray', labelsize=6)

# Takin skull
ax2 = fig.add_subplot(132, projection='3d')
ax2.set_facecolor('#111827')
x, y, z = create_skull_points(nasal_arch=0.6, width=1.0, length=1.3)
ax2.scatter(x, y, z, c=z, cmap='YlOrRd', s=1, alpha=0.5)
ax2.set_title('Takin', color='white', fontsize=11)
ax2.tick_params(colors='gray', labelsize=6)

# Muskox skull
ax3 = fig.add_subplot(133, projection='3d')
ax3.set_facecolor('#111827')
x, y, z = create_skull_points(nasal_arch=0.3, width=1.1, length=1.4)
ax3.scatter(x, y, z, c=z, cmap='Greens', s=1, alpha=0.5)
ax3.set_title('Muskox', color='white', fontsize=11)
ax3.tick_params(colors='gray', labelsize=6)

plt.suptitle('3D Skull Models: Bovid Comparison', color='white', fontsize=14, y=1.01)
plt.tight_layout()
plt.show()

print("3D morphological comparison:")
print("  Cow: flat nasal bridge, narrow skull")
print("  Takin: arched nasal bridge (+0.5 units), wider skull")
print("  Muskox: moderate arch, widest skull")
print()
print("The nasal arch houses enlarged turbinate bones that warm cold air.")
print("Takin turbinates: 3x surface area of cow turbinates.")
print("This is the key adaptation for breathing at -30C.")`, challenge: 'Add a measurement of "nasal chamber volume" by integrating the arch height over the skull length. Which species has the largest nasal volume relative to skull size? This ratio predicts cold tolerance.', successHint: 'From gene networks to heterochrony to allometry to morphometrics to 3D modelling, you have traced the complete arc of evo-devo biology. Every funny-looking animal is a masterpiece of evolution when examined with the right tools.' },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Deep Dive
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Evo-Devo Biology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for evolutionary developmental biology simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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
