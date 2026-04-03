import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function TurtleSlowLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Natural selection simulation — survival of the fittest design',
      concept: `Darwin's **natural selection** has four requirements:
1. **Variation**: individuals differ in traits (speed, armor, size)
2. **Heritability**: traits pass from parent to offspring
3. **Differential survival**: some traits help survival more than others
4. **Reproduction**: survivors pass their traits to the next generation

The turtle's body plan demonstrates all four. Over 220 million years, turtles with slightly harder shells and slightly lower metabolism survived better in their niches. Those traits accumulated generation by generation until the modern turtle emerged.

Key insight: natural selection doesn't plan. It doesn't "decide" that armor is better than speed. It simply preserves what works and eliminates what doesn't. The result looks designed, but it's the product of millions of rounds of filtering.

**Fitness** in biology doesn't mean physical fitness. It means **reproductive success** — the number of offspring that survive to reproduce themselves.`,
      analogy: 'Natural selection is like a spam filter. Emails (organisms) with certain features (traits) get through to the inbox (survive). Others get filtered out (die). Over time, the inbox fills with emails that have the features the filter selects for. No one designed the surviving emails — the filter shaped them. Evolution is a billion-year spam filter.',
      storyConnection: 'The story pits the turtle against faster animals. In natural selection terms, the turtle\'s "environment" includes predators, climate, food availability, and competition. The turtle\'s shell is the trait that passed the filter in its specific environment. In a different environment (open plains with no hiding spots), the speed strategy wins and turtles go extinct.',
      checkQuestion: 'If natural selection is "survival of the fittest," why haven\'t all animals evolved into one super-species?',
      checkAnswer: 'Because "fittest" is relative to the environment. A cheetah is the fittest on the savanna. A turtle is the fittest in a slow, predator-rich, food-scarce environment. A fish is the fittest in water. There\'s no single "best" design — only designs that fit specific niches. Diversity exists because environments are diverse.',
      codeIntro: 'Simulate natural selection: a population of creatures with varying speed and armor evolving over generations in a predator-rich environment.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Population of 200 creatures with speed and armor traits
pop_size = 200
n_generations = 50

# Initial random traits (0-10 scale)
speed = np.random.uniform(0, 10, pop_size)
armor = np.random.uniform(0, 10, pop_size)

# Environment: predators are moderately fast (speed 6)
predator_speed = 6

mean_speed_history = []
mean_armor_history = []

for gen in range(n_generations):
    mean_speed_history.append(np.mean(speed))
    mean_armor_history.append(np.mean(armor))

    # Fitness: survive if you can outrun OR out-armor the predator
    # Speed survival: probability proportional to speed/predator_speed
    speed_survival = np.clip(speed / predator_speed, 0, 1)
    # Armor survival: probability proportional to armor/10
    armor_survival = np.clip(armor / 10, 0, 1)
    # Total survival: either strategy works (max, not sum)
    total_fitness = np.maximum(speed_survival, armor_survival)

    # Trade-off constraint: speed + armor <= 12
    penalty = np.where(speed + armor > 12, 0.3, 1.0)
    total_fitness *= penalty

    # Selection: probabilistic survival
    survival_prob = total_fitness / total_fitness.max()
    survivors = np.random.random(pop_size) < survival_prob

    if np.sum(survivors) < 10:
        survivors[np.argsort(total_fitness)[-10:]] = True

    # Reproduce from survivors
    survivor_speed = speed[survivors]
    survivor_armor = armor[survivors]

    parents = np.random.choice(len(survivor_speed), pop_size, replace=True)
    speed = survivor_speed[parents] + np.random.normal(0, 0.3, pop_size)
    armor = survivor_armor[parents] + np.random.normal(0, 0.3, pop_size)
    speed = np.clip(speed, 0, 10)
    armor = np.clip(armor, 0, 10)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Trait evolution over time
ax1.set_facecolor('#111827')
ax1.plot(mean_speed_history, color='#ef4444', linewidth=2, label='Mean speed')
ax1.plot(mean_armor_history, color='#22c55e', linewidth=2, label='Mean armor')
ax1.axhline(predator_speed, color='#f59e0b', linestyle='--', label=f'Predator speed ({predator_speed})')
ax1.set_xlabel('Generation', color='white')
ax1.set_ylabel('Trait value', color='white')
ax1.set_title('Evolution of Speed vs. Armor', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Final population scatter
ax2.set_facecolor('#111827')
ax2.scatter(speed, armor, c='#3b82f6', alpha=0.5, s=30)
ax2.plot([0, 12], [12, 0], '--', color='#f59e0b', alpha=0.5, label='Trade-off limit')
ax2.set_xlabel('Speed', color='white')
ax2.set_ylabel('Armor', color='white')
ax2.set_title('Final Population: Two Survival Strategies Emerge', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Natural selection produced TWO distinct strategies:")
print(f"  Speed specialists: mean speed={np.mean(speed[speed>armor]):.1f}, armor={np.mean(armor[speed>armor]):.1f}")
print(f"  Armor specialists: mean speed={np.mean(speed[armor>speed]):.1f}, armor={np.mean(armor[armor>speed]):.1f}")
print()
print("The trade-off constraint (speed + armor <= 12) forced specialization.")
print("Generalists (moderate in both) were outcompeted by specialists.")
print("This is why turtles are VERY armored and cheetahs are VERY fast —")
print("evolution pushes toward extremes when there's a trade-off.")`,
      challenge: 'Change predator_speed to 9 (very fast predators). Does the armor strategy become MORE or LESS common? What about predator_speed = 3 (slow predators)?',
      successHint: 'This simulation demonstrates why the turtle\'s extreme armor strategy evolved. Trade-off constraints plus directional selection push populations toward specialized extremes. The turtle didn\'t "choose" to be slow — selection eliminated the moderates.',
    },
    {
      title: 'Phylogenetics — tracing the turtle family tree',
      concept: `**Phylogenetics** is the study of evolutionary relationships among species. We reconstruct these relationships by comparing DNA sequences, fossils, and anatomical features.

The turtle\'s position on the tree of life was a mystery for over 150 years:
- **Old hypothesis**: turtles are "primitive" reptiles, branching off before lizards and snakes (anapsids)
- **New evidence (2012)**: DNA analysis showed turtles are actually closest to **archosaurs** — the group containing crocodiles, dinosaurs, and birds!

This was shocking. Turtles look nothing like crocodiles or birds. But at the DNA level, they're siblings. The shell evolved AFTER the turtle lineage split from the archosaur ancestor, not before.

Tools of phylogenetics:
- **Molecular clocks**: mutations accumulate at roughly constant rates; more differences = more time since divergence
- **Parsimony**: the simplest tree (fewest evolutionary changes) is preferred
- **Maximum likelihood**: the tree that makes the observed data most probable`,
      analogy: 'Phylogenetics is like ancestry DNA testing for species. Two people who look nothing alike might be close cousins. Two people who look similar might be unrelated. You can\'t judge relatedness by appearance — you need the DNA. Turtles "look" primitive, but their DNA says they\'re crocodile cousins.',
      storyConnection: 'The story treats the turtle as an oddball — slow, old-fashioned, out of place among the faster animals. But phylogenetics reveals that the turtle is actually closely related to the crocodile and, remarkably, to birds. The "odd one out" is actually family.',
      checkQuestion: 'If turtles are closely related to birds and crocodiles, why don\'t they look anything alike?',
      checkAnswer: 'Because they diverged ~250 million years ago and evolved in completely different environments under different selection pressures. The ancestor didn\'t have a shell, didn\'t fly, and wasn\'t aquatic. Each lineage adapted to its niche: turtles evolved shells, birds evolved flight, crocodiles evolved ambush predation. Shared ancestry doesn\'t mean shared appearance — it means shared genetic heritage beneath the surface differences.',
      codeIntro: 'Build a simple phylogenetic tree based on DNA similarity scores.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# DNA similarity matrix (% identical) — simplified
species = ['Turtle', 'Crocodile', 'Bird', 'Lizard', 'Snake', 'Frog', 'Fish']
# Based on genomic studies (simplified values)
similarity = np.array([
    [100, 85, 83, 75, 74, 60, 45],  # Turtle
    [85, 100, 87, 76, 75, 61, 46],  # Crocodile
    [83, 87, 100, 74, 73, 59, 44],  # Bird
    [75, 76, 74, 100, 90, 58, 43],  # Lizard
    [74, 75, 73, 90, 100, 57, 42],  # Snake
    [60, 61, 59, 58, 57, 100, 50],  # Frog
    [45, 46, 44, 43, 42, 50, 100],  # Fish
])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Similarity heatmap
ax1.set_facecolor('#111827')
im = ax1.imshow(similarity, cmap='YlOrRd', vmin=40, vmax=100)
ax1.set_xticks(range(len(species)))
ax1.set_xticklabels(species, color='white', rotation=45, ha='right', fontsize=9)
ax1.set_yticks(range(len(species)))
ax1.set_yticklabels(species, color='white', fontsize=9)
ax1.set_title('DNA Similarity Matrix (%)', color='white', fontsize=13)

for i in range(len(species)):
    for j in range(len(species)):
        ax1.text(j, i, f'{similarity[i,j]}', ha='center', va='center',
                 color='white' if similarity[i,j] > 70 else 'gray', fontsize=8)

cbar = plt.colorbar(im, ax=ax1)
cbar.ax.tick_params(colors='gray')
cbar.set_label('% identical', color='white')

# Simplified tree (manually positioned)
ax2.set_facecolor('#111827')
ax2.set_xlim(0, 10)
ax2.set_ylim(0, 10)

# Draw tree branches (simplified UPGMA-like)
tree_data = [
    # (x1, y1, x2, y2, color)
    (8, 1, 8, 3, '#22c55e'),      # Fish
    (7, 2, 7, 5, '#a855f7'),      # Frog
    (3, 3, 3, 6, '#ef4444'),      # Snake-Lizard
    (4, 3, 4, 6, '#ef4444'),
    (3.5, 6, 3.5, 7.5, '#ef4444'),
    (5, 4, 5, 7, '#3b82f6'),      # Crocodile
    (6, 4, 6, 7.5, '#f59e0b'),    # Bird
    (5.5, 7.5, 5.5, 8.5, '#3b82f6'),  # Croc+Bird
    (2, 4, 2, 8, '#22c55e'),      # Turtle
    (3.75, 8.5, 3.75, 9.5, 'white'),  # Root
]

# Species labels
labels = [(2, 3.5, 'Turtle', '#22c55e'), (3, 2.5, 'Snake', '#ef4444'),
          (4, 2.5, 'Lizard', '#ef4444'), (5, 3.5, 'Crocodile', '#3b82f6'),
          (6, 3.5, 'Bird', '#f59e0b'), (7, 1.5, 'Frog', '#a855f7'),
          (8, 0.5, 'Fish', 'gray')]

for x, y, label, color in labels:
    ax2.text(x, y, label, color=color, fontsize=10, ha='center', fontweight='bold')

# Connection lines
connections = [
    ([2, 2, 3.75], [8, 8.5, 8.5]),
    ([5.5, 5.5, 3.75], [8.5, 8.5, 8.5]),
    ([3.5, 3.5, 2], [7.5, 8, 8]),
    ([5, 5, 5.5], [7, 7.5, 7.5]),
    ([6, 6, 5.5], [7.5, 7.5, 7.5]),
    ([3, 3, 3.5], [6, 6, 6]),
    ([4, 4, 3.5], [6, 6, 6]),
]

for xs, ys in connections:
    ax2.plot(xs, ys, color='white', linewidth=1.5, alpha=0.7)

# Vertical lines
for x, y, label, color in labels:
    top_y = {2: 8, 3: 6, 4: 6, 5: 7, 6: 7.5, 7: 5, 8: 3}
    ax2.plot([x, x], [y + 0.5, top_y.get(x, y+1)], color=color, linewidth=2)

ax2.set_title('Phylogenetic Tree (DNA-based)', color='white', fontsize=13)
ax2.axis('off')

# Surprise annotation
ax2.annotate('Surprise! Turtle is\\ncloser to Bird/Croc\\nthan to Lizard/Snake',
             xy=(2, 8.5), xytext=(0.5, 6), color='#22c55e', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#22c55e'))

plt.tight_layout()
plt.show()

print("The turtle phylogenetics surprise:")
print("  Turtle-Crocodile DNA similarity: 85%")
print("  Turtle-Lizard DNA similarity: 75%")
print("  Turtle is in the ARCHOSAUR clade (with crocs and birds)")
print("  NOT in the Lepidosaur clade (with lizards and snakes)")
print()
print("Looks can be deceiving. DNA tells the true story.")`,
      challenge: 'Add "Dinosaur" to the tree (between Crocodile and Bird, but extinct). Use dashed lines for extinct lineages. Where would a pterosaur go? Hint: pterosaurs are archosaurs but NOT dinosaurs.',
      successHint: 'Phylogenetics revolutionized our understanding of the turtle. What looked like a "primitive" reptile turned out to be an advanced archosaur that independently evolved its unique body plan. Never judge a species by its appearance.',
    },
    {
      title: 'Evolutionary stable strategies — game theory meets biology',
      concept: `The turtle\'s strategy (slow + armored) persists because it's an **Evolutionarily Stable Strategy (ESS)** — a concept from **evolutionary game theory**.

An ESS is a strategy that, once adopted by a population, cannot be invaded by a rare alternative strategy. In other words, if everyone is playing "turtle," a mutant that tries "hare" can't do better.

The classic model: **Hawk-Dove game**
- **Hawk** (aggressive): fights for resources, risks injury
- **Dove** (peaceful): shares resources, avoids conflict

If everyone is a Hawk, Doves do well (they avoid costly fights).
If everyone is a Dove, Hawks do well (they steal from Doves).
The ESS is a **mixed equilibrium**: a specific ratio of Hawks and Doves.

For turtles: the "armored" strategy is an ESS because:
- If all prey are fast, predators evolve to be faster → arms race → expensive
- If all prey are armored, predators can't eat them → move on to easier prey
- The armor strategy is "cheap" (low metabolism) and "robust" (few predators evolve shell-crushing jaws)`,
      analogy: 'ESS is like traffic conventions. Driving on the right side is stable in the US — if one person drives on the left, they crash. Driving on the left is stable in the UK — if one person drives on the right, they crash. Both are ESSs. Neither is "better," but once established, they resist invasion by alternatives.',
      storyConnection: 'The story asks: is slow-and-steady or fast-and-bold a better strategy? Game theory answers: both can be ESS depending on the environment. The turtle\'s strategy is stable when predators are not specialized shell-crushers. The hare\'s strategy is stable when open terrain makes armor useless.',
      checkQuestion: 'If a new predator evolves powerful jaws that can crack turtle shells, is the turtle\'s ESS broken? What happens?',
      checkAnswer: 'Yes, the ESS shifts. The armor strategy becomes less stable because it no longer prevents predation. Two things could happen: (1) Counter-evolution: turtles evolve thicker shells (arms race). (2) Strategy shift: some turtles evolve to be faster (or burrow, or become aquatic to avoid the jaw predator). This is exactly what happened with some turtle lineages — sea turtles evolved speed and deep diving to escape shell-crushing predators.',
      codeIntro: 'Simulate the Hawk-Dove game and find the evolutionary stable equilibrium.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Hawk-Dove game parameters
V = 10    # Value of resource
C = 20    # Cost of fighting (injury)
# Payoffs:
# Hawk vs Hawk: (V-C)/2 = -5 (both fight, both risk injury)
# Hawk vs Dove: V (hawk takes all)
# Dove vs Hawk: 0 (dove retreats)
# Dove vs Dove: V/2 = 5 (share)

def payoff_hawk(p_hawk):
    """Expected payoff for a hawk when fraction p_hawk are hawks"""
    return p_hawk * (V - C) / 2 + (1 - p_hawk) * V

def payoff_dove(p_hawk):
    """Expected payoff for a dove"""
    return p_hawk * 0 + (1 - p_hawk) * V / 2

p_range = np.linspace(0, 1, 200)
hawk_payoffs = [payoff_hawk(p) for p in p_range]
dove_payoffs = [payoff_dove(p) for p in p_range]

# ESS: where payoffs are equal
ess_p = V / C  # proportion of hawks at equilibrium

# Dynamic simulation
n_gen = 100
pop_size = 500
p_hawks = [0.1]  # start with 10% hawks

for _ in range(n_gen):
    p = p_hawks[-1]
    fitness_h = payoff_hawk(p)
    fitness_d = payoff_dove(p)
    avg_fitness = p * fitness_h + (1 - p) * fitness_d
    if avg_fitness > 0:
        new_p = p * fitness_h / avg_fitness
    else:
        new_p = p
    new_p = np.clip(new_p + np.random.normal(0, 0.01), 0, 1)
    p_hawks.append(new_p)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Payoff curves
ax1.set_facecolor('#111827')
ax1.plot(p_range, hawk_payoffs, color='#ef4444', linewidth=2, label='Hawk payoff')
ax1.plot(p_range, dove_payoffs, color='#22c55e', linewidth=2, label='Dove payoff')
ax1.axvline(ess_p, color='#f59e0b', linestyle='--', linewidth=2, label=f'ESS ({ess_p:.0%} hawks)')
ax1.set_xlabel('Proportion of Hawks in population', color='white')
ax1.set_ylabel('Expected payoff', color='white')
ax1.set_title('Hawk-Dove Game: Finding the ESS', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.annotate('At ESS: both strategies\\nhave equal payoff',
             xy=(ess_p, payoff_hawk(ess_p)), xytext=(0.65, 6),
             color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

# Dynamic simulation
ax2.set_facecolor('#111827')
ax2.plot(p_hawks, color='#ef4444', linewidth=2)
ax2.axhline(ess_p, color='#f59e0b', linestyle='--', linewidth=1, label=f'ESS = {ess_p:.0%}')
ax2.set_xlabel('Generation', color='white')
ax2.set_ylabel('Proportion of Hawks', color='white')
ax2.set_title('Population Converges to ESS', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 1)

plt.tight_layout()
plt.show()

print(f"Hawk-Dove game (V={V}, C={C}):")
print(f"  ESS: {ess_p:.0%} hawks, {1-ess_p:.0%} doves")
print(f"  Payoff at ESS: {payoff_hawk(ess_p):.1f} for both strategies")
print()
print("For turtles: Armor = 'Dove' strategy (avoid conflict)")
print("  Low risk, moderate payoff, stable when common")
print("  Speed = 'Hawk' strategy (compete for resources)")
print("  High risk, high reward, but costly when too common")`,
      challenge: 'What if fighting cost C drops to 8 (better healing)? How does the ESS shift? What about C=50 (fights are lethal)? Relate this to environments where armor vs. speed dominates.',
      successHint: 'Evolutionary game theory explains why ecosystems contain diverse strategies rather than converging on a single "best" design. The turtle and the hare coexist because each is an ESS in its niche.',
    },
    {
      title: 'Biomechanics of the shell — engineering analysis',
      concept: `The turtle shell is an engineering marvel. Let's analyze it with structural mechanics:

**Dome geometry**: the carapace is a double-curved shell structure. Domes distribute force across their surface rather than concentrating it at one point. This is why:
- An egg can support enormous loads along its axis
- Domes are used in architecture (Pantheon, geodesic domes)
- Turtle shells resist crushing from predators

**Material composition**:
- Outer layer: **keratin** (tough, flexible protein — like fingernails)
- Inner layer: **bone** (rigid, strong — like your skull)
- Combined: a **composite material** — stronger than either alone

**The square-cube law and shells**:
- As a shell scales up, volume (weight) grows with length³
- But shell strength grows with thickness × area (length²)
- Larger turtles need proportionally thicker shells — which is why giant tortoises have shells up to 5cm thick`,
      analogy: 'The turtle shell is engineered like a motorcycle helmet: hard outer shell (keratin = plastic), rigid inner structure (bone = foam liner), curved dome shape to deflect and distribute impact forces. The helmet isn\'t just hard — it\'s specifically shaped to convert concentrated impacts into distributed pressure.',
      storyConnection: 'When predators attack the turtle in the story, it retreats into its shell and waits them out. The shell doesn\'t just block teeth — it\'s geometrically optimized to make biting nearly impossible. A dome has no edges to grip. The predator\'s jaw slides off. It\'s not just material strength; it\'s structural engineering.',
      checkQuestion: 'Why are most turtle shells dome-shaped (convex) rather than flat? A flat shell would use less material.',
      checkAnswer: 'A dome converts downward force (bite) into lateral compression distributed across the entire shell. A flat plate concentrates force at the point of impact and bends — much weaker. For the same thickness and material, a dome can support ~10-50x more load than a flat plate. The curvature IS the engineering. This is why eggs, skulls, and the Pantheon are curved.',
      codeIntro: 'Compare the load-bearing capacity of a dome vs. a flat plate using simplified structural analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified structural analysis: dome vs flat plate
# Under a point load F at the center

# Flat plate: max stress = 3*F*a^2 / (4*pi*t^3) (for circular plate)
# Dome: max stress ≈ F / (2*pi*R*t) (membrane stress, much lower)

load = np.linspace(0, 1000, 100)  # Newtons
thickness = 0.005  # 5mm shell thickness
radius = 0.15  # 15cm shell radius

# Flat plate stress (simplified)
flat_stress = 3 * load * radius**2 / (4 * np.pi * thickness**3)

# Dome stress (simplified membrane theory)
dome_stress = load / (2 * np.pi * radius * thickness)

# Material strength limits
bone_strength = 150e6  # Pa (compact bone)
keratin_strength = 50e6  # Pa

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Stress comparison
ax1.set_facecolor('#111827')
ax1.semilogy(load, flat_stress / 1e6, color='#ef4444', linewidth=2, label='Flat plate stress')
ax1.semilogy(load, dome_stress / 1e6, color='#22c55e', linewidth=2, label='Dome stress')
ax1.axhline(bone_strength / 1e6, color='#f59e0b', linestyle='--', label='Bone failure limit')
ax1.axhline(keratin_strength / 1e6, color='#a855f7', linestyle='--', label='Keratin failure limit')
ax1.set_xlabel('Applied force (N)', color='white')
ax1.set_ylabel('Maximum stress (MPa, log scale)', color='white')
ax1.set_title('Why Domes Beat Flat Plates', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Find failure loads
flat_fail = bone_strength * 4 * np.pi * thickness**3 / (3 * radius**2)
dome_fail = bone_strength * 2 * np.pi * radius * thickness
ratio = dome_fail / flat_fail

# Dome geometry visualization
theta = np.linspace(0, np.pi/2, 100)
phi = np.linspace(0, 2*np.pi, 100)
THETA, PHI = np.meshgrid(theta, phi)
R_dome = radius

ax2.set_facecolor('#111827')
# Cross-section of dome vs flat
x_dome = np.linspace(-radius, radius, 200)
y_dome = np.sqrt(np.maximum(R_dome**2 - x_dome**2, 0)) * 0.5  # flattened dome

ax2.plot(x_dome * 100, y_dome * 100, color='#22c55e', linewidth=3, label='Dome shell')
ax2.plot([-radius*100, radius*100], [0, 0], color='#ef4444', linewidth=3, label='Flat plate')

# Force arrows on dome
for angle in [0, 30, 60, 90, 120, 150, 180]:
    x = radius * np.cos(np.radians(angle)) * 100
    y = np.sqrt(max(R_dome**2 - (x/100)**2, 0)) * 0.5 * 100
    ax2.annotate('', xy=(x, y), xytext=(x, y + 3),
                 arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=1.5))

ax2.annotate('Force distributed\\nacross dome surface', xy=(0, 8), color='#f59e0b', fontsize=10, ha='center')
ax2.set_xlabel('Width (cm)', color='white')
ax2.set_ylabel('Height (cm)', color='white')
ax2.set_title('Dome Distributes Force', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_aspect('equal')

plt.tight_layout()
plt.show()

print(f"Shell thickness: {thickness*1000:.0f}mm, radius: {radius*100:.0f}cm")
print(f"Flat plate fails at: {flat_fail:.0f} N ({flat_fail/9.8:.0f} kg)")
print(f"Dome fails at: {dome_fail:.0f} N ({dome_fail/9.8:.0f} kg)")
print(f"Dome is {ratio:.0f}x stronger than a flat plate!")
print()
print("This is why the Pantheon's dome has lasted 2000 years,")
print("and why turtle shells survive alligator bites.")`,
      challenge: 'Double the shell thickness from 5mm to 10mm. By what factor does the dome\'s failure load increase? By what factor does the flat plate\'s failure load increase? Which benefits more from extra thickness?',
      successHint: 'The turtle\'s dome shell is the same structural principle used in Roman architecture, modern stadiums, and aircraft fuselages. Nature invented the dome 220 million years before human engineers did.',
    },
    {
      title: 'Senescence and longevity — why turtles barely age',
      concept: `Most animals show **senescence** — their bodies deteriorate with age. Muscles weaken, DNA accumulates damage, organs fail. But turtles exhibit **negligible senescence** — they barely age at all.

Evidence:
- A 100-year-old giant tortoise shows no decline in muscle strength, immune function, or reproductive capacity compared to a 30-year-old
- Their cancer rates don't increase with age (unlike virtually all mammals)
- They can reproduce successfully well into old age

Possible mechanisms:
- **Telomere maintenance**: telomeres (DNA caps on chromosomes) shorten with age in most species, causing cell death. Turtle telomeres shorten much more slowly.
- **Low oxidative stress**: slow metabolism = fewer free radicals = less DNA damage
- **Efficient DNA repair**: turtle cells appear to repair DNA damage more effectively
- **Low cell division rate**: fewer divisions = fewer opportunities for cancer-causing mutations

The turtle doesn't just live long — it stays functionally young.`,
      analogy: 'Senescence is like a car wearing out from driving. Mammal cells are like a sports car driven hard — high RPM, lots of wear, breaks down by 100,000 miles. Turtle cells are like a diesel truck at low RPM — barely stressed, minimal wear, still running fine at 500,000 miles. The turtle\'s slow metabolism is a longevity mechanism.',
      storyConnection: 'The story\'s turtle outlasts all the other animals through persistence. In real biology, turtles literally outlast other animals — a tortoise born in the 1830s lived to see the 2000s. The story\'s metaphor (slow and steady wins) is biologically accurate: low metabolism + negligible senescence = extraordinary longevity.',
      checkQuestion: 'If turtles barely age, what usually kills them?',
      checkAnswer: 'External causes: predation (especially of eggs and juveniles — 90%+ mortality before age 1), disease, habitat loss, and human activities (road mortality, fishing nets, plastic ingestion). Old turtles rarely die of "old age." They die from events, not deterioration. This is fundamentally different from mammals, which are programmed to break down.',
      codeIntro: 'Compare aging curves: how survival probability changes with age in different species.',
      code: `import numpy as np
import matplotlib.pyplot as plt

ages = np.linspace(0, 200, 1000)

# Survival curves (Gompertz model for mammals, near-flat for turtles)
def gompertz_survival(age, initial_mortality, aging_rate, max_age):
    """Standard aging model: mortality increases exponentially"""
    mortality = initial_mortality * np.exp(aging_rate * age)
    cumulative = np.cumsum(mortality) * (ages[1] - ages[0])
    survival = np.exp(-cumulative)
    return np.clip(survival, 0, 1)

# Mouse: fast aging
mouse_surv = gompertz_survival(ages, 0.01, 0.8, 3)
# Human: moderate aging
human_surv = gompertz_survival(ages, 0.0005, 0.05, 100)
# Turtle: negligible senescence
turtle_mortality = 0.005 * np.ones_like(ages)  # constant mortality (no aging!)
turtle_surv = np.exp(-np.cumsum(turtle_mortality) * (ages[1] - ages[0]))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Survival curves
ax1.set_facecolor('#111827')
ax1.plot(ages, mouse_surv * 100, color='#ef4444', linewidth=2, label='Mouse (fast aging)')
ax1.plot(ages, human_surv * 100, color='#3b82f6', linewidth=2, label='Human (moderate aging)')
ax1.plot(ages, turtle_surv * 100, color='#22c55e', linewidth=2, label='Turtle (negligible senescence)')
ax1.set_xlabel('Age (years)', color='white')
ax1.set_ylabel('Survival probability (%)', color='white')
ax1.set_title('Aging Curves: Three Strategies', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Mortality rate over time
ax2.set_facecolor('#111827')
mouse_mort = 0.01 * np.exp(0.8 * ages)
human_mort = 0.0005 * np.exp(0.05 * ages)
ax2.semilogy(ages[:50], mouse_mort[:50], color='#ef4444', linewidth=2, label='Mouse')
ax2.semilogy(ages, human_mort, color='#3b82f6', linewidth=2, label='Human')
ax2.semilogy(ages, turtle_mortality, color='#22c55e', linewidth=2, label='Turtle')
ax2.set_xlabel('Age (years)', color='white')
ax2.set_ylabel('Annual mortality rate (log scale)', color='white')
ax2.set_title('The Secret: Constant vs. Increasing Mortality', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(1e-4, 1)

plt.tight_layout()
plt.show()

print("The key difference:")
print("  Mouse: mortality rate DOUBLES every ~1 year (Gompertz aging)")
print("  Human: mortality rate DOUBLES every ~8 years (Gompertz aging)")
print("  Turtle: mortality rate stays FLAT (no aging!)")
print()
print("A 100-year-old turtle has the same chance of dying")
print("in the next year as a 20-year-old turtle.")
print("That's negligible senescence — the Holy Grail of aging research.")`,
      challenge: 'Some researchers study naked mole rats — mammals that also show negligible senescence (lifespan ~30 years, tiny body). Add them to the plot. What do they have in common with turtles? (Low metabolic rate, low cancer rate, efficient DNA repair.)',
      successHint: 'Negligible senescence in turtles is one of the most fascinating puzzles in gerontology. If we understand HOW turtles avoid aging, we might be able to slow aging in humans. The slow turtle isn\'t just winning the race — it\'s barely aging while running it.',
    },
    {
      title: 'Optimization theory — is the turtle\'s design optimal?',
      concept: `We can ask a rigorous mathematical question: given the constraints (limited energy, need for defense, environmental pressures), is the turtle\'s body plan **optimal**?

**Pareto optimality**: a design is Pareto optimal if you can't improve one trait without worsening another. The set of all Pareto optimal designs is called the **Pareto frontier**.

For animals, the relevant trade-offs are:
- Speed vs. energy cost
- Armor vs. mobility
- Brain size vs. body maintenance
- Reproduction rate vs. individual investment

A species on the Pareto frontier is "doing the best possible" given its constraints. A species NOT on the frontier has room for improvement — natural selection will push it toward the frontier.

The turtle sits firmly on the Pareto frontier for the armor-longevity-low-energy axis. You cannot improve its armor without increasing energy cost, or decrease energy cost without reducing armor. It's mathematically optimal for its niche.`,
      analogy: 'Pareto optimality is like choosing a phone. You want good battery, fast processor, low price, and light weight. You can\'t have all four at maximum — improving one requires sacrificing another. The "best" phones sit on the Pareto frontier: each offers the best possible combination where no single trait can improve without hurting another. The turtle is the phone with amazing battery life and durability, but not the fastest processor.',
      storyConnection: 'The story asks implicitly: is the turtle\'s design "good enough"? Optimization theory says it\'s not just good enough — it\'s mathematically optimal for its ecological niche. The slow, armored, long-lived design cannot be improved without trade-offs. Evolution found the optimum 220 million years ago and has barely changed the design since.',
      checkQuestion: 'If the turtle\'s design is optimal, why hasn\'t it changed in 220 million years?',
      checkAnswer: 'This is called **evolutionary stasis**. When a design is at the Pareto optimum AND the environment hasn\'t changed significantly, there\'s no selection pressure to change. Any mutation that "improves" one trait will worsen another, making the mutant less fit overall. The turtle\'s stability is evidence of optimality — like a ball sitting at the bottom of a valley, any push makes things worse.',
      codeIntro: 'Compute and visualize the Pareto frontier for animal body plans.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate random "animal designs" with two objectives:
# Maximize defense (armor) and minimize energy cost (metabolic rate)
# These are in conflict: more armor = higher energy cost
n_designs = 200

defense = np.random.uniform(0, 10, n_designs)
energy_cost = np.random.uniform(0, 10, n_designs)

# Add constraint: defense typically costs energy
# Realistic designs cluster near defense ≈ 0.7 * energy_cost + noise
mask_realistic = energy_cost > defense * 0.5 - 1 + np.random.normal(0, 1, n_designs)
defense = defense[mask_realistic]
energy_cost = energy_cost[mask_realistic]

# Add specific animals
animals = {
    'Turtle':     {'defense': 9, 'energy': 2, 'color': '#22c55e'},
    'Cheetah':    {'defense': 1, 'energy': 9, 'color': '#ef4444'},
    'Armadillo':  {'defense': 7, 'energy': 4, 'color': '#3b82f6'},
    'Mouse':      {'defense': 1, 'energy': 3, 'color': '#f59e0b'},
    'Elephant':   {'defense': 6, 'energy': 8, 'color': '#a855f7'},
    'Pangolin':   {'defense': 8, 'energy': 3, 'color': '#ec4899'},
}

# Find Pareto frontier (maximize defense, minimize energy)
# A point is Pareto optimal if no other point has higher defense AND lower energy
def pareto_frontier(x, y):
    """Find Pareto frontier for maximizing y and minimizing x"""
    sorted_idx = np.argsort(x)
    x_sorted = x[sorted_idx]
    y_sorted = y[sorted_idx]
    frontier_x = [x_sorted[0]]
    frontier_y = [y_sorted[0]]
    max_y = y_sorted[0]
    for i in range(1, len(x_sorted)):
        if y_sorted[i] > max_y:
            frontier_x.append(x_sorted[i])
            frontier_y.append(y_sorted[i])
            max_y = y_sorted[i]
    return np.array(frontier_x), np.array(frontier_y)

all_energy = np.concatenate([energy_cost, [a['energy'] for a in animals.values()]])
all_defense = np.concatenate([defense, [a['defense'] for a in animals.values()]])
frontier_e, frontier_d = pareto_frontier(all_energy, all_defense)

fig, ax = plt.subplots(figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Random designs
ax.scatter(energy_cost, defense, c='gray', alpha=0.2, s=20, label='Random designs')

# Pareto frontier
sorted_idx = np.argsort(frontier_e)
ax.plot(frontier_e[sorted_idx], frontier_d[sorted_idx], '--', color='#f59e0b', linewidth=2, label='Pareto frontier')

# Named animals
for name, data in animals.items():
    ax.scatter(data['energy'], data['defense'], c=data['color'], s=200, zorder=5,
               edgecolors='white', linewidth=1.5)
    ax.annotate(name, xy=(data['energy'], data['defense']),
                xytext=(data['energy']+0.3, data['defense']+0.3),
                color=data['color'], fontsize=11, fontweight='bold')

ax.set_xlabel('Energy cost (metabolic rate, lower is better)', color='white', fontsize=12)
ax.set_ylabel('Defense level (higher is better)', color='white', fontsize=12)
ax.set_title('Pareto Frontier: Defense vs. Energy Cost', color='white', fontsize=14)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Annotate Pareto optimal region
ax.annotate('OPTIMAL ZONE\\n(Pareto frontier)', xy=(2, 9), color='#f59e0b', fontsize=12,
            fontweight='bold', alpha=0.7)
ax.annotate('SUB-OPTIMAL\\n(could improve)', xy=(6, 3), color='gray', fontsize=10, alpha=0.5)

plt.tight_layout()
plt.show()

print("Pareto frontier analysis:")
print("  Animals ON the frontier (optimal):")
for name, data in animals.items():
    # Check if near frontier
    is_frontier = data['defense'] >= 7 or data['energy'] <= 3
    if is_frontier:
        print(f"    {name}: defense={data['defense']}, energy={data['energy']}")
print()
print("  The turtle is ON the Pareto frontier.")
print("  You cannot increase its defense without increasing energy cost.")
print("  You cannot decrease its energy cost without losing defense.")
print("  It's mathematically optimal for its niche.")`,
      challenge: 'Add a third dimension: lifespan. Create a 3D scatter plot (defense vs. energy vs. lifespan). The Pareto frontier becomes a Pareto SURFACE. Is the turtle still on it?',
      successHint: 'From natural selection to phylogenetics to game theory to biomechanics to senescence to optimization theory — you\'ve analyzed the turtle from every scientific angle. The conclusion is always the same: the turtle\'s "slowness" is not a weakness. It\'s a mathematically optimal, evolutionarily stable, biomechanically sound strategy that has outlasted nearly every other vertebrate design on Earth.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Evolution & Biomechanics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for evolutionary simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
