import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import BabelSkyscraperDiagram from '../diagrams/BabelSkyscraperDiagram';
import BabelNLPDiagram from '../diagrams/BabelNLPDiagram';

export default function BabelLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Structural optimisation — minimum material, maximum strength',
      concept: `Real engineering is not just about making things strong enough — it is about using the **minimum material** to achieve the required strength. Every extra kilogram of steel costs money, adds weight (which demands a stronger foundation), and consumes resources.

**Topology optimisation** uses algorithms to find the most efficient shape. You start with a solid block, define where loads are applied and where supports exist, and the algorithm removes material from areas with low stress. The result is often organic-looking — resembling bones, trees, or coral.

This is precisely what evolution does: bones are strongest along load paths and hollow where forces are low. The femur (thigh bone) has a spongy internal structure that looks exactly like the stress field of an optimised beam.

The code implements a simplified topology optimisation using stress-based material removal.`,
      analogy: 'Imagine sculpting a statue from a block of marble. But instead of creating a face, you are creating a structure. You chisel away everywhere the material is not working hard — wherever stress is low, material is wasted. What remains is the most efficient possible shape.',
      storyConnection: 'The Babel tower was a solid mass of brick — most of the material was not carrying significant load. A topology-optimised tower would look nothing like a solid block. It would have arches, voids, and lattices — resembling the Eiffel Tower more than a ziggurat. Nature figured this out long before algorithms did.',
      checkQuestion: 'Why do bird bones have a honeycomb-like internal structure instead of being solid?',
      checkAnswer: 'Flight demands minimum weight with maximum strength. A hollow bone with internal struts (trabeculae) has nearly the same bending strength as a solid bone but at a fraction of the weight. The struts align along load paths — exactly where stress is highest. This is biological topology optimisation, refined over 150 million years of evolution.',
      codeIntro: 'Simulate stress-based material removal to optimise a beam.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 2D beam optimisation (simplified)
# Grid of material elements — remove low-stress elements

nx, ny = 60, 20  # grid resolution
density = np.ones((ny, nx))  # 1 = material, 0 = void

# Simple stress estimation: cantilever beam with end load
# Stress is highest near the support (left) and decreases toward the tip

x_grid = np.linspace(0, 1, nx)
y_grid = np.linspace(-0.5, 0.5, ny)
X, Y = np.meshgrid(x_grid, y_grid)

# Bending stress: sigma = M*y/I, where M decreases linearly from left
# M(x) = F * (1 - x)  for cantilever with tip load
M = 1.0 * (1 - X)
stress = np.abs(M * Y)  # simplified: higher near top/bottom and near support

# Iterative removal: remove elements with lowest stress
threshold_history = []
volume_history = []

for iteration in range(15):
    # Normalise stress in active elements
    active = density > 0.5
    if active.sum() == 0:
        break
    max_stress = stress[active].max()
    threshold = 0.05 + iteration * 0.06  # gradually raise threshold

    # Remove elements below threshold
    remove = (stress / max_stress < threshold) & active
    density[remove] = 0

    vol_fraction = density.sum() / (nx * ny) * 100
    threshold_history.append(threshold)
    volume_history.append(vol_fraction)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Original beam
axes[0, 0].imshow(np.ones((ny, nx)), cmap='Blues', aspect='auto')
axes[0, 0].set_title('Original: 100% material', fontsize=11)
axes[0, 0].axis('off')

# Stress field
im = axes[0, 1].imshow(stress, cmap='hot', aspect='auto')
axes[0, 1].set_title('Stress distribution', fontsize=11)
axes[0, 1].axis('off')
plt.colorbar(im, ax=axes[0, 1], fraction=0.046)

# Optimised shape
axes[1, 0].imshow(density, cmap='Blues', aspect='auto', vmin=0, vmax=1)
axes[1, 0].set_title(f'Optimised: {vol_fraction:.0f}% material', fontsize=11)
axes[1, 0].axis('off')

# Volume history
axes[1, 1].plot(range(len(volume_history)), volume_history,
                'o-', color='#60a5fa', linewidth=2)
axes[1, 1].set_xlabel('Iteration', fontsize=11)
axes[1, 1].set_ylabel('Material (%)', fontsize=11)
axes[1, 1].set_title('Material removed per iteration', fontsize=11)
axes[1, 1].grid(alpha=0.3)

plt.suptitle('Topology Optimisation: Remove Unstressed Material', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print(f"Original volume: 100%")
print(f"Optimised volume: {vol_fraction:.0f}%")
print(f"Material saved: {100 - vol_fraction:.0f}%")
print()
print("The result resembles an I-beam — thick flanges at")
print("top and bottom (high stress) with a thin web in")
print("the middle (low stress). Nature already knows this.")`,
      challenge: 'Add a second load point at the centre of the beam (not just the tip). How does the optimised shape change? In real engineering, every load case produces a different optimal shape, and the final design must handle all of them.',
      successHint: 'Topology optimisation is how modern engineers design everything from aircraft brackets to building columns. 3D printing has made it practical — you can now manufacture the organic shapes that optimisation produces.',
    },
    {
      title: 'Tuned mass dampers — controlling building sway',
      concept: `Supertall buildings sway in the wind. The Burj Khalifa sways up to 1.5 metres at the top. The Shanghai Tower sways 0.5 metres. For occupants, this motion causes nausea and anxiety.

The solution: a **Tuned Mass Damper (TMD)**. A heavy mass (100–730 tonnes) is suspended near the top of the building on springs and oil dampers. When the building sways right, the mass swings left — absorbing the building’s kinetic energy and converting it to heat through friction in the dampers.

The TMD must be **tuned** to the building’s natural frequency. If f_building = 0.15 Hz, the TMD’s frequency must be set to approximately the same value using: f = (1/2π)√(k/m).

The code simulates a building with and without a TMD under wind excitation.`,
      analogy: 'Hold a ruler clamped to the edge of a table and flick it — it vibrates wildly. Now attach a small weight on a rubber band to the ruler’s tip. Flick again — the ruler barely moves because the dangling weight absorbs the vibration energy. A TMD is that dangling weight, scaled to 730 tonnes.',
      storyConnection: 'The Tower of Babel had no damping system. Wind-induced oscillation would have built up over time, causing occupants to feel seasick and eventually cracking the mud brick structure. Modern damping technology is what separates an 828-metre success (Burj Khalifa) from a 91-metre failure (Babel).',
      checkQuestion: 'Taipei 101’s TMD is a 730-tonne gold-painted steel ball. Why is it displayed publicly as a tourist attraction instead of hidden?',
      checkAnswer: 'It serves both engineering and symbolic purposes. During Typhoon Soudelor (2015), visitors watched the ball swing 100 cm — visible proof that the building was safe because the damper was working. It is one of the few pieces of structural engineering that people can directly observe in action. It also demonstrates Taiwan’s engineering prowess.',
      codeIntro: 'Simulate building response with and without a tuned mass damper.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Two-DOF system: building + TMD
# Building: mass M, stiffness K
# TMD: mass m, stiffness k, damping c

M = 1e7     # building mass (kg) — top portion
K = 2.5e6   # building stiffness (N/m)
m = 5e5     # TMD mass (500 tonnes, ~5% of building)
f_b = np.sqrt(K/M) / (2*np.pi)  # building natural freq

# Tune TMD to building frequency
k = m * (2*np.pi*f_b)**2  # TMD stiffness
c = 2 * 0.1 * np.sqrt(k*m)  # TMD damping (10% critical)

dt = 0.02
t = np.arange(0, 120, dt)

# Wind excitation (gusty, with resonant component)
np.random.seed(42)
F = (2e5 * np.sin(2*np.pi*f_b*t) +  # resonant wind
     1e5 * np.random.randn(len(t)))    # turbulent gusts

# Simulate WITHOUT TMD (single DOF)
x_no = np.zeros(len(t))
v_no = np.zeros(len(t))
damp_b = 2 * 0.01 * np.sqrt(K*M)  # 1% structural damping
for i in range(len(t)-1):
    a = (F[i] - damp_b*v_no[i] - K*x_no[i]) / M
    v_no[i+1] = v_no[i] + a*dt
    x_no[i+1] = x_no[i] + v_no[i+1]*dt

# Simulate WITH TMD (two DOF)
x_b = np.zeros(len(t))  # building displacement
v_b = np.zeros(len(t))
x_t = np.zeros(len(t))  # TMD displacement (relative to ground)
v_t = np.zeros(len(t))

for i in range(len(t)-1):
    # TMD force on building
    dx = x_t[i] - x_b[i]
    dv = v_t[i] - v_b[i]
    f_tmd = k*dx + c*dv

    # Building acceleration
    a_b = (F[i] + f_tmd - damp_b*v_b[i] - K*x_b[i]) / M
    # TMD acceleration
    a_t = (-k*dx - c*dv) / m

    v_b[i+1] = v_b[i] + a_b*dt
    x_b[i+1] = x_b[i] + v_b[i+1]*dt
    v_t[i+1] = v_t[i] + a_t*dt
    x_t[i+1] = x_t[i] + v_t[i+1]*dt

fig, axes = plt.subplots(2, 1, figsize=(12, 7), sharex=True)

axes[0].plot(t, x_no*100, color='#ef4444', linewidth=0.8, alpha=0.8)
axes[0].set_ylabel('Displacement (cm)', fontsize=11)
axes[0].set_title('Building WITHOUT Tuned Mass Damper', fontsize=12)
axes[0].grid(alpha=0.3)
axes[0].set_ylim(-80, 80)

axes[1].plot(t, x_b*100, color='#22c55e', linewidth=0.8, alpha=0.8)
axes[1].set_ylabel('Displacement (cm)', fontsize=11)
axes[1].set_xlabel('Time (s)', fontsize=11)
axes[1].set_title('Building WITH Tuned Mass Damper', fontsize=12)
axes[1].grid(alpha=0.3)
axes[1].set_ylim(-80, 80)

plt.tight_layout()
plt.show()

reduction = (1 - max(abs(x_b)) / max(abs(x_no))) * 100
print(f"Building natural frequency: {f_b:.3f} Hz (period {1/f_b:.1f} s)")
print(f"TMD mass: {m/1000:.0f} tonnes ({m/M*100:.0f}% of building)")
print(f"\
Without TMD: max sway = {max(abs(x_no))*100:.1f} cm")
print(f"With TMD:    max sway = {max(abs(x_b))*100:.1f} cm")
print(f"Reduction:   {reduction:.0f}%")`,
      challenge: 'Try changing the TMD mass ratio from 5% to 1% and 10%. Plot the reduction percentage for each. There is a sweet spot — too small and the TMD has no effect; too large and it adds too much weight to the building.',
      successHint: 'Tuned mass dampers are elegant engineering: a simple pendulum concept scaled to hundreds of tonnes, precisely tuned to counteract the building’s worst nightmare — resonant wind-induced oscillation.',
    },
    {
      title: 'Structural failure analysis — why buildings collapse',
      concept: `When buildings collapse, structural engineers investigate the failure to prevent it from happening again. The analysis follows a forensic process: examine the rubble, reconstruct the load history, identify the failure mode, and determine whether the cause was design error, material defect, construction error, or overloading.

Common failure modes:
1. **Buckling**: column bows sideways under compressive load
2. **Progressive collapse**: one element fails, overloading adjacent elements, triggering a cascade
3. **Foundation failure**: soil bearing capacity exceeded, building tilts or sinks
4. **Fatigue**: repeated small loads weaken a member until it snaps (metal fatigue)
5. **Resonance**: wind or earthquake frequency matches the building’s natural frequency

The code simulates progressive collapse — removing one column and watching the load redistribute.`,
      analogy: 'Think of a team of people carrying a heavy banner in a parade. If one person drops out, the others must carry their share. If the extra load makes another person drop out, the cascade continues until the banner falls. This is progressive collapse — and it is how the World Trade Centre towers failed after the aircraft impact.',
      storyConnection: 'The Tower of Babel would have been vulnerable to progressive collapse. Mud brick has no ductility — it cracks suddenly rather than bending. Once one section cracked, the load would have shifted to adjacent sections, which would also crack, triggering a cascade. This may be the realistic engineering explanation for the tower’s failure.',
      checkQuestion: 'Modern building codes require "alternate load path" design. What does this mean?',
      checkAnswer: 'It means the building must be designed so that if any single structural element (column, beam, or wall) is suddenly removed, the remaining structure can redistribute the loads and survive. This prevents progressive collapse. The building must have enough redundancy that no single point of failure brings down the whole structure.',
      codeIntro: 'Simulate progressive collapse by removing columns and tracking load redistribution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Grid of columns supporting a building
# Each column has a capacity and carries a share of the load

n_cols = 12
col_capacity = np.ones(n_cols) * 1000  # kN capacity each
total_load = 9000  # kN (evenly distributed)
col_load = np.ones(n_cols) * total_load / n_cols

print("Progressive Collapse Simulation")
print("=" * 55)
print(f"Columns: {n_cols}, each with {col_capacity[0]:.0f} kN capacity")
print(f"Total load: {total_load:.0f} kN")
print(f"Initial load per column: {col_load[0]:.0f} kN")
print(f"Safety factor: {col_capacity[0] / col_load[0]:.2f}")
print()

# Track collapse progression
history = [col_load.copy()]
failed = np.zeros(n_cols, dtype=bool)
step = 0

# Remove column 5 (simulating damage)
damage_col = 5
print(f"EVENT: Column {damage_col} destroyed (impact/explosion)")
failed[damage_col] = True
col_load[damage_col] = 0

# Redistribute load from failed column to neighbours
while True:
    step += 1
    active = ~failed
    n_active = active.sum()

    if n_active == 0:
        print("TOTAL COLLAPSE — all columns failed!")
        break

    # Redistribute total load to surviving columns
    col_load = np.zeros(n_cols)
    col_load[active] = total_load / n_active

    history.append(col_load.copy())

    # Check for new failures
    new_failures = (col_load > col_capacity) & active
    if not new_failures.any():
        print(f"Step {step}: Stable! {n_active} columns survive.")
        print(f"  Load per surviving column: {total_load/n_active:.0f} kN")
        print(f"  Safety factor: {col_capacity[0] / (total_load/n_active):.2f}")
        break

    for i in np.where(new_failures)[0]:
        print(f"Step {step}: Column {i} FAILS ({col_load[i]:.0f} > {col_capacity[i]:.0f} kN)")
        failed[i] = True

# Plot the progression
fig, ax = plt.subplots(figsize=(12, 5))
x = np.arange(n_cols)
for step_i, loads in enumerate(history):
    offset = step_i * 0.15
    alpha = 0.3 + 0.7 * (step_i / len(history))
    bars = ax.bar(x + offset, loads, 0.12,
                  color='#ef4444' if step_i > 0 else '#60a5fa',
                  alpha=alpha, label=f'Step {step_i}' if step_i < 4 else None)

ax.axhline(col_capacity[0], color='#fbbf24', linewidth=2,
           linestyle='--', label='Column capacity')
ax.set_xlabel('Column Number', fontsize=12)
ax.set_ylabel('Load (kN)', fontsize=12)
ax.set_title('Progressive Collapse: Load Redistribution', fontsize=13)
ax.legend(fontsize=9)
ax.set_xticks(x)
ax.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.show()

print(f"\
Key finding: {failed.sum()} of {n_cols} columns failed.")
print(f"If safety factor > 1.0, collapse is arrested.")
print(f"If < 1.0, cascade continues to total collapse.")`,
      challenge: 'Change the safety factor by increasing column capacity to 1200 kN. Does the collapse stop earlier? Now try removing TWO adjacent columns. Modern building codes require survival even with two columns lost.',
      successHint: 'Progressive collapse analysis is mandatory for all important structures. The lesson of Babel, the lesson of the Twin Towers, the lesson of every building failure: redundancy saves lives. No single point of failure should bring down the whole.',
    },
    {
      title: 'Language endangerment — modern Babel in reverse',
      concept: `At Babel, languages multiplied. Today, the opposite is happening: languages are **dying**. Of the world’s ~7,000 languages, linguists estimate that **one dies every two weeks**. By 2100, between 50–90% of current languages may be extinct.

A language dies when its last fluent speaker dies without passing it to children. The causes: urbanisation, globalisation, education policies that suppress minority languages, and the dominance of a few "big" languages (English, Mandarin, Spanish, Hindi, Arabic).

Why does this matter? Each language encodes unique knowledge — about local plants, weather patterns, social structures, and ways of thinking — that is lost when the language dies. It is like burning a library.

NLP can help: record and analyse endangered languages, build dictionaries and grammars, and create tools for communities to teach their languages digitally.

The code analyses the distribution and endangerment of the world’s languages.`,
      analogy: 'Imagine a forest with 7,000 species of trees. Each species has unique fruit, unique wood, unique ecology. Now a few invasive species (the big languages) are spreading and crowding out the native trees. By 2100, the forest has only 1,000 species. The diversity that made the forest resilient is gone. Language diversity is cognitive diversity — losing it makes human thinking less flexible.',
      storyConnection: 'The Babel story presents language diversity as punishment. Linguists see it as treasure. The "confusion" at Babel gave humanity 7,000 different ways to describe reality, encode knowledge, and think about the world. The real tragedy is not the scattering of languages — it is the convergence toward a handful of dominant ones.',
      checkQuestion: 'Northeast India has over 220 languages in a small geographic area. Why such extreme diversity?',
      checkAnswer: 'Geography: mountainous terrain with deep valleys creates natural isolation, preventing language contact and merger. Each valley develops its own language independently. Time: human settlement in NE India is very old, allowing millennia of divergence. Cultural factors: strong tribal identities maintain linguistic boundaries. This is similar to Papua New Guinea (800+ languages) — same pattern of geographic isolation creating linguistic diversity.',
      codeIntro: 'Analyse the distribution and endangerment of the world’s languages.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Language statistics by region
regions = {
    "Asia":          {"total": 2303, "endangered": 691, "population": 4600},
    "Africa":        {"total": 2144, "endangered": 429, "population": 1400},
    "Pacific":       {"total": 1313, "endangered": 657, "population": 43},
    "Americas":      {"total": 1061, "endangered": 637, "population": 1000},
    "Europe":        {"total": 287,  "endangered": 115, "population": 750},
}

names = list(regions.keys())
totals = [r["total"] for r in regions.values()]
endangered = [r["endangered"] for r in regions.values()]
pct_endangered = [e/t*100 for e, t in zip(endangered, totals)]

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Total languages by region
x = np.arange(len(names))
axes[0].bar(x, totals, color='#60a5fa', width=0.5)
axes[0].bar(x, endangered, color='#ef4444', width=0.5)
axes[0].set_xticks(x)
axes[0].set_xticklabels(names, fontsize=10)
axes[0].set_ylabel('Number of Languages', fontsize=11)
axes[0].set_title('Languages by Region', fontsize=12)
axes[0].legend(['Total', 'Endangered'], fontsize=10)
axes[0].grid(axis='y', alpha=0.3)

# Percentage endangered
colors = ['#22c55e' if p < 40 else '#fbbf24' if p < 55 else '#ef4444' for p in pct_endangered]
axes[1].barh(names, pct_endangered, color=colors)
axes[1].set_xlabel('% Endangered', fontsize=11)
axes[1].set_title('Percentage of Endangered Languages', fontsize=12)
axes[1].grid(axis='x', alpha=0.3)
for i, p in enumerate(pct_endangered):
    axes[1].text(p + 1, i, f'{p:.0f}%', va='center', fontsize=10, color='white')

plt.tight_layout()
plt.show()

# Top 10 languages by speakers
top_10 = [
    ("English",    1452), ("Mandarin",   1119), ("Hindi",       602),
    ("Spanish",     559), ("French",      310), ("Arabic",      274),
    ("Bengali",     273), ("Portuguese",  258), ("Russian",     255),
    ("Urdu",        232),
]

print("Top 10 languages cover ~60% of world population.")
print("The remaining 6,990 languages share the other 40%.\
")

total_speakers = sum(s for _, s in top_10)
world_pop = 8000
print(f"Top 10 total speakers: ~{total_speakers:,d} million")
print(f"World population: ~{world_pop:,d} million")
print(f"Coverage: ~{total_speakers/world_pop*100:.0f}%")
print()
print("Most endangered: languages with < 100 speakers")
print("  Ainu (Japan): ~10 speakers")
print("  Njerep (Cameroon): ~4 speakers")
print("  Tanema (Solomon Islands): ~1 speaker")
print()
print("Every language lost is a unique window on reality — closed forever.")`,
      challenge: 'Calculate how many languages die per year if 50% of 7,000 languages disappear by 2100. That is 3,500 / 75 years = 47 per year. How does this compare to species extinction rates? Research and add the comparison.',
      successHint: 'Language endangerment is a crisis of the same magnitude as biodiversity loss. Each language represents thousands of years of human observation, categorisation, and expression. NLP tools can help document and preserve these languages before they disappear.',
    },
    {
      title: 'Multilingual embeddings — one vector space for all languages',
      concept: `The most powerful idea in modern NLP: a single vector space where words from **all languages** live together. "Dog" (English), "chien" (French), "Hund" (German), and "狗" (Chinese) all map to nearly the same point.

How is this possible? During training, the model sees parallel texts (like the Bible, which exists in 3,000+ languages, or Wikipedia in 300+ languages). It learns that sentences with the same meaning should have similar vector representations, regardless of language.

The technique is called **cross-lingual alignment**. Train separate embeddings for each language, then learn a **rotation matrix** that aligns them: if English "cat" = [0.5, 0.3] and French "chat" = [0.8, -0.1], find the rotation that maps one to the other. Once aligned, translation becomes nearest-neighbour lookup.

The code implements cross-lingual alignment using a small bilingual dictionary as the anchor.`,
      analogy: 'Imagine two maps of the same city made by different cartographers. One uses metric coordinates, the other uses imperial. The streets and buildings are the same — just measured differently. Cross-lingual alignment finds the conversion formula between the two coordinate systems so you can look up any location in either map.',
      storyConnection: 'This technology is the ultimate reversal of Babel. Instead of confusing language, we are mathematically proving that all languages share a common semantic structure — they are different coordinate systems for the same reality. The "tower" that reaches the heavens is not made of brick. It is made of mathematics.',
      checkQuestion: 'Can multilingual models translate between two languages they have never seen paired together (e.g., Swahili to Finnish)?',
      checkAnswer: 'Yes, through **zero-shot translation**. If the model has aligned Swahili to English and Finnish to English, the Swahili→English→Finnish path exists implicitly through the shared vector space. The model does not need to see any Swahili-Finnish parallel text. This was first demonstrated by Google’s multilingual neural machine translation system in 2016 and was considered a breakthrough.',
      codeIntro: 'Align word embeddings from two languages using a bilingual dictionary.',
      code: `import numpy as np

# Simulate word embeddings in two languages
np.random.seed(42)
d = 50  # embedding dimension

# English embeddings (random but consistent)
en_words = ["cat", "dog", "house", "water", "food", "big", "small",
            "run", "eat", "sleep", "book", "tree", "sun", "moon"]
en_vecs = np.random.randn(len(en_words), d)

# French embeddings (rotated version of English + noise)
# In real life, each language has its own embedding space
rotation = np.linalg.qr(np.random.randn(d, d))[0]  # random orthogonal matrix
fr_words = ["chat", "chien", "maison", "eau", "nourriture", "grand", "petit",
            "courir", "manger", "dormir", "livre", "arbre", "soleil", "lune"]
fr_vecs = en_vecs @ rotation.T + np.random.randn(len(fr_words), d) * 0.1

# Bilingual dictionary (anchor pairs for alignment)
anchors = [(0, 0), (1, 1), (2, 2), (3, 3), (4, 4)]  # cat-chat, dog-chien, etc.

# Learn alignment: find rotation W such that en @ W ≈ fr
en_anchor = np.array([en_vecs[i] for i, _ in anchors])
fr_anchor = np.array([fr_vecs[j] for _, j in anchors])

# Procrustes alignment: W = V @ U^T from SVD of fr^T @ en
U, S, Vt = np.linalg.svd(fr_anchor.T @ en_anchor)
W = U @ Vt  # optimal rotation matrix

# Align English embeddings to French space
en_aligned = en_vecs @ W.T

# Translation: for each English word, find nearest French word
def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8)

print("Cross-Lingual Word Translation")
print("=" * 50)
correct = 0
for i, en_word in enumerate(en_words):
    # Find nearest French word to aligned English vector
    sims = [cosine_sim(en_aligned[i], fr_vecs[j]) for j in range(len(fr_words))]
    best_j = np.argmax(sims)
    match = "✓" if best_j == i else "✗"
    if best_j == i:
        correct += 1
    print(f"  {en_word:>12s} -> {fr_words[best_j]:<14s} "
          f"(sim: {sims[best_j]:.3f}) {match}")

accuracy = correct / len(en_words) * 100
print(f"\
Translation accuracy: {correct}/{len(en_words)} ({accuracy:.0f}%)")
print(f"Using only {len(anchors)} anchor pairs for alignment!")
print()
print("Key insight: 5 known translations are enough to learn")
print("the rotation that aligns entire vocabularies.")
print("This is how zero-shot translation works — align through")
print("a shared space, and every word pair becomes translatable.")`,
      challenge: 'Reduce anchor pairs to 3 (remove the last two). Does accuracy drop? Now try 1 anchor. What is the minimum number of known translations needed for reasonable alignment? In research, as few as 25 anchor pairs can align 200,000-word vocabularies.',
      successHint: 'Cross-lingual alignment is how Google Translate handles 133 languages with a single model. The mathematical insight is profound: all human languages describe the same reality, so their vector spaces must be related by a simple rotation. Babel is reversed by linear algebra.',
    },
    {
      title: 'Capstone — design a structure that withstands all forces',
      concept: `You now have the complete engineering toolkit: compression, tension, shear, buckling, wind loads, earthquake response, foundations, material selection, FEA, and optimisation. Let us put it all together.

Your task: design a **1,000-metre tower** that withstands its own weight, Category 5 wind, and a magnitude 7 earthquake. You must choose the structural system, materials, cross-section shape, and foundation type.

The code provides a complete structural feasibility check that evaluates your design against all criteria. This is what real structural engineers do before a single foundation pile is driven.

This is also where the two halves of this lesson meet: the **engineering** of building tall and the **linguistics** of communicating across barriers. Both are about structure — physical structure and linguistic structure — and both require understanding the fundamental forces at work.`,
      analogy: 'You are the chief engineer of a modern Babel. But this time, you have 5,000 years of accumulated knowledge: material science, structural analysis, wind engineering, foundation design, and computational simulation. The question is not whether you CAN build to the sky. The question is: what is the optimal design?',
      storyConnection: 'The Tower of Babel failed for two reasons: the builders lacked the engineering knowledge to build tall, and they lost the ability to communicate. You now have both — the structural engineering to design a kilometre-high tower and the NLP to translate your plans into any language on Earth. Babel is solved.',
      checkQuestion: 'If you could build a 1-km tower, should you? What are the ethical and environmental considerations?',
      checkAnswer: 'Major concerns: (1) Embodied carbon — concrete production accounts for 8% of global CO₂ emissions; a 1-km tower requires enormous quantities. (2) Resource concentration — massive investment in one structure vs. distributed infrastructure. (3) Wind shadow — supertall buildings alter local wind patterns, affecting surrounding areas. (4) Emergency evacuation — getting 50,000 people out of a 1-km building during a fire is an unsolved problem. Engineering can does not mean engineering should.',
      codeIntro: 'Run a complete structural feasibility check for a 1,000 m tower design.',
      code: `import numpy as np

# TOWER DESIGN PARAMETERS — CHANGE THESE
height = 1000         # metres
base_width = 80       # metres (square base)
top_width = 20        # metres (tapered)
core_diameter = 15    # metres (central core)
n_floors = 200
material = "Steel + Reinforced Concrete"

# Material properties
E_steel = 200e9       # Pa
E_concrete = 40e9     # Pa
f_steel = 400e6       # yield strength (Pa)
f_concrete = 80e6     # compressive strength (Pa)
density_avg = 350     # kg/m³ (average for steel-concrete composite)

# 1. SELF-WEIGHT CHECK
avg_width = (base_width + top_width) / 2
volume = avg_width**2 * height * 0.3  # 30% solid (rest is air/floors)
total_mass = volume * density_avg
weight = total_mass * 9.8
base_area = base_width**2
ground_pressure = weight / base_area / 1000  # kPa

print("=" * 55)
print("TOWER FEASIBILITY REPORT")
print("=" * 55)
print(f"Height: {height}m | Base: {base_width}m | Top: {top_width}m")
print(f"Floors: {n_floors} | Material: {material}")
print(f"\
1. SELF-WEIGHT")
print(f"   Total mass: {total_mass/1000:,.0f} tonnes")
print(f"   Ground pressure: {ground_pressure:,.0f} kPa")

# 2. COMPRESSION CHECK
base_stress = weight / (base_area * 0.3) / 1e6  # effective structural area
print(f"\
2. COMPRESSION")
print(f"   Base stress: {base_stress:.1f} MPa")
print(f"   Concrete limit: {f_concrete/1e6:.0f} MPa")
comp_ok = base_stress < f_concrete/1e6 * 0.6  # 60% safety factor
print(f"   Status: {'PASS' if comp_ok else 'FAIL'}")

# 3. WIND LOAD
v_top = 80  # m/s (Category 5 hurricane)
rho = 1.225
F_wind = 0.5 * rho * v_top**2 * (avg_width * height) * 0.8  # drag
M_wind = F_wind * height * 0.6  # bending moment at base
print(f"\
3. WIND LOAD")
print(f"   Top wind speed: {v_top} m/s ({v_top*3.6:.0f} km/h)")
print(f"   Total wind force: {F_wind/1e6:.0f} MN")
print(f"   Base moment: {M_wind/1e9:.1f} GN·m")

# Stability: overturning moment vs restoring moment
M_restoring = weight * base_width / 4  # weight × half base width
stability_ratio = M_restoring / M_wind
wind_ok = stability_ratio > 1.5
print(f"   Stability ratio: {stability_ratio:.2f} (need > 1.5)")
print(f"   Status: {'PASS' if wind_ok else 'FAIL'}")

# 4. EARTHQUAKE CHECK
pga = 0.3  # peak ground acceleration (g) — moderate zone
seismic_force = total_mass * pga * 9.8
M_seismic = seismic_force * height * 0.67
seismic_ok = M_restoring / M_seismic > 1.5
print(f"\
4. EARTHQUAKE (PGA = {pga}g)")
print(f"   Seismic force: {seismic_force/1e6:.0f} MN")
print(f"   Stability ratio: {M_restoring/M_seismic:.2f}")
print(f"   Status: {'PASS' if seismic_ok else 'FAIL'}")

# 5. BUCKLING CHECK
I = np.pi * (core_diameter/2)**4 / 4  # core moment of inertia
P_critical = np.pi**2 * E_concrete * I / (height*0.7)**2
buckling_ok = P_critical > weight * 2
print(f"\
5. BUCKLING")
print(f"   Critical load: {P_critical/1e6:.0f} MN")
print(f"   Actual load: {weight/1e6:.0f} MN")
print(f"   Safety factor: {P_critical/weight:.1f}")
print(f"   Status: {'PASS' if buckling_ok else 'FAIL'}")

# 6. FOUNDATION
bearing_capacity = 5000  # kPa (hard rock)
n_piles = int(np.ceil(weight / (bearing_capacity * np.pi * 1.0**2 * 1000)))
found_ok = ground_pressure < bearing_capacity
print(f"\
6. FOUNDATION")
print(f"   Required piles (1m dia): {n_piles}")
print(f"   Ground pressure: {ground_pressure:.0f} kPa")
print(f"   Rock capacity: {bearing_capacity} kPa")
print(f"   Status: {'PASS' if found_ok else 'FAIL'}")

# OVERALL
all_pass = comp_ok and wind_ok and seismic_ok and buckling_ok and found_ok
print(f"\
{'='*55}")
print(f"OVERALL: {'ALL CHECKS PASS — FEASIBLE' if all_pass else 'DESIGN NEEDS REVISION'}")
print(f"{'='*55}")`,
      challenge: 'The design above may fail some checks. Modify the parameters to make ALL checks pass: try widening the base, increasing core diameter, or reducing height. What trade-offs do you face? This is the core of engineering design — optimising within constraints.',
      successHint: 'You have completed the full journey from mud bricks to kilometre-high towers, from confused tongues to transformer attention. The Tower of Babel story is about the limits of human ambition. This lesson proves that the limits are not fixed — they are pushed outward by knowledge, one equation at a time.',
    },
  ];

  return (
    <div className="space-y-8">
      {loading && (
        <div className="flex items-center gap-3 bg-amber-500/10 text-amber-300 px-4 py-3 rounded-lg text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadProgress}
        </div>
      )}
      {miniLessons.map((lesson, i) => (
        <MiniLesson
          key={i}
          id={`babel-l4-${i + 1}`}
          number={i + 1}
          title={lesson.title}
          concept={lesson.concept}
          analogy={lesson.analogy}
          storyConnection={lesson.storyConnection}
          checkQuestion={lesson.checkQuestion}
          checkAnswer={lesson.checkAnswer}
          diagram={i === 0 ? createElement(BabelSkyscraperDiagram) : i === 4 ? createElement(BabelNLPDiagram) : undefined}
          code={lesson.code}
          codeIntro={lesson.codeIntro}
          challenge={lesson.challenge}
          successHint={lesson.successHint}
         
         
         
        />
      ))}
    </div>
  );
}
