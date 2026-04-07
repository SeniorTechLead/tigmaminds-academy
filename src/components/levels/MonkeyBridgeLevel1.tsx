import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MonkeyBridgeLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Primate biology — our closest relatives in the canopy',
      concept: `In the story, monkeys link arms and tails to form a living bridge across the river. Real monkeys can't quite do that — but the biology behind their tree-dwelling lives is just as remarkable. **Primates** are an order of mammals that includes monkeys, apes, lemurs, and humans.

What makes primates special:
- **Forward-facing eyes**: give binocular vision and depth perception (critical for judging branch distances)
- **Grasping hands and feet**: with opposable thumbs or big toes for gripping branches
- **Large brains** relative to body size: for navigating complex 3D environments and social groups
- **Nails instead of claws**: flat nails allow precision gripping without piercing fruit or bark

Namdapha National Park in Arunachal Pradesh is one of the few places where you can find seven primate species in a single forest — hoolock gibbons, capped langurs, Assamese macaques, pigtail macaques, stump-tailed macaques, slow lorises, and rhesus macaques.`,
      analogy: 'Think of primates as the acrobats of the animal kingdom. Forward-facing eyes are like a gymnast\'s depth perception — essential for judging distances mid-leap. Grasping hands are like a climber\'s grip. The large brain is the coach, calculating every jump before the body leaves the branch.',
      storyConnection: 'The monkeys in the story formed a bridge because they could grip each other and coordinate. Real primates can do this because of their grasping hands (opposable thumbs) and social intelligence (large brains). The "bridge" in the story is a metaphor for the cooperative behavior that primate biology makes possible.',
      checkQuestion: 'Why do primates have forward-facing eyes while most prey animals (like deer) have eyes on the sides of their heads?',
      checkAnswer: 'Forward-facing eyes give overlapping visual fields, creating binocular vision for depth perception — essential for jumping between branches. Side-facing eyes give a wide field of view to detect predators from almost any direction. It\'s a trade-off: depth perception vs. panoramic awareness. Primates chose depth because their survival depends on not missing a branch.',
      codeIntro: 'Compare visual field angles of primates vs. prey animals.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Visual fields (degrees)
animals = {
    'Human': {'binocular': 120, 'total': 180},
    'Macaque': {'binocular': 140, 'total': 200},
    'Owl': {'binocular': 110, 'total': 110},
    'Rabbit': {'binocular': 30, 'total': 360},
    'Horse': {'binocular': 65, 'total': 350},
    'Deer': {'binocular': 50, 'total': 310},
}

fig, axes = plt.subplots(2, 3, figsize=(14, 9), subplot_kw=dict(polar=True))
fig.patch.set_facecolor('#1f2937')

colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899']

for ax, (name, fields), color in zip(axes.flat, animals.items(), colors):
    ax.set_facecolor('#111827')
    bino = np.radians(fields['binocular'])
    total = np.radians(fields['total'])

    # Total visual field
    theta_total = np.linspace(-total/2, total/2, 100)
    ax.fill_between(theta_total, 0, 1, alpha=0.2, color=color)

    # Binocular overlap
    theta_bino = np.linspace(-bino/2, bino/2, 100)
    ax.fill_between(theta_bino, 0, 1, alpha=0.5, color=color)

    ax.set_title(name, color='white', fontsize=11, pad=10)
    ax.set_ylim(0, 1.2)
    ax.set_yticks([])
    ax.set_xticks([0, np.pi/2, np.pi, 3*np.pi/2])
    ax.set_xticklabels(['Front', 'Left', 'Back', 'Right'], color='gray', fontsize=7)
    ax.tick_params(colors='gray')

fig.suptitle('Visual Fields: Binocular (dark) vs Total (light)', color='white', fontsize=14, y=0.98)
plt.tight_layout()
plt.show()

print("Primates (macaque, human): large binocular field → great depth perception")
print("Prey animals (rabbit, deer): huge total field → almost 360° awareness")
print("Trade-off: depth perception vs. predator detection")`,
      challenge: 'A gibbon needs to judge a 5-meter branch gap while swinging at speed. Calculate the minimum binocular field angle needed if the target branch is 5m away and 10cm wide.',
      successHint: 'Vision is not just "seeing" — it\'s an evolutionary strategy. Every animal\'s eye placement tells you something about its survival challenges. Primates traded panoramic vision for the depth perception they needed to live in trees.',
    },
    {
      title: 'Arboreal locomotion — moving through the treetops',
      concept: `The monkeys in the story didn't just sit in trees — they crossed a river by swinging through the canopy. Moving through trees is called **arboreal locomotion**, and different primates have evolved radically different strategies:

- **Brachiation**: swinging arm-over-arm beneath branches (gibbons — the fastest, up to 55 km/h)
- **Quadrupedal walking**: walking on all fours along the tops of branches (macaques, langurs)
- **Leaping**: powerful hind legs launch the animal between tree trunks (langurs can leap 5+ meters)
- **Vertical clinging and leaping**: clinging to vertical trunks and jumping (tarsiers, lorises)
- **Bridging**: slowly reaching across gaps using long arms and legs (orangutans)

Each style requires different body proportions. Brachiators have long arms and short legs. Leapers have long, powerful legs and short arms. The body shape IS the locomotion strategy, written in bone and muscle.`,
      analogy: 'Think of arboreal locomotion styles like different playground activities. Brachiation is monkey bars (swinging hand-to-hand). Quadrupedal walking is walking along a balance beam. Leaping is long jump. Vertical clinging is climbing a pole. Each needs different muscles and body proportions, just like different athletes have different builds.',
      storyConnection: 'The monkey bridge in the story required the monkeys to grip vines and each other — that\'s bridging behavior, similar to how orangutans cross canopy gaps. Real monkeys in Namdapha use a mix of leaping, quadrupedal walking, and brachiation to navigate the forest. The "bridge" is the story\'s version of these real locomotion strategies combined with social cooperation.',
      checkQuestion: 'Why don\'t gorillas brachiate like gibbons, even though gorillas are also apes?',
      checkAnswer: 'Gorillas are too heavy. An adult male gorilla weighs 140-180 kg; a gibbon weighs 5-7 kg. Brachiation requires the arms to support the entire body weight during each swing. At gorilla mass, the forces on shoulder joints and wrist bones would be destructive. Gorillas evolved to walk on the ground (knuckle-walking) instead. Body mass constrains locomotion strategy.',
      codeIntro: 'Model the physics of brachiation — the pendulum swing between branches.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Brachiation as a pendulum
# Arm length determines swing period and reach
arm_lengths = {'Gibbon': 0.6, 'Macaque': 0.35, 'Human': 0.65, 'Orangutan': 0.8}
body_masses = {'Gibbon': 6, 'Macaque': 8, 'Human': 70, 'Orangutan': 75}

g = 9.81  # gravity

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

# Pendulum period vs arm length
ax1.set_facecolor('#111827')
L_range = np.linspace(0.2, 1.0, 100)
T_range = 2 * np.pi * np.sqrt(L_range / g)
ax1.plot(L_range, T_range, color='gray', linewidth=1, linestyle='--', alpha=0.5)

for (name, L), color in zip(arm_lengths.items(), colors):
    T = 2 * np.pi * np.sqrt(L / g)
    ax1.plot(L, T, 'o', color=color, markersize=10, label=f'{name} ({L}m)')
    ax1.annotate(f'{T:.2f}s', xy=(L, T), xytext=(L+0.03, T+0.02), color=color, fontsize=9)

ax1.set_xlabel('Arm length (m)', color='white')
ax1.set_ylabel('Swing period (s)', color='white')
ax1.set_title('Pendulum Period by Arm Length', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Max reach (horizontal distance per swing)
ax2.set_facecolor('#111827')
for (name, L), mass, color in zip(arm_lengths.items(), body_masses.values(), colors):
    reach = 2 * L  # approximate horizontal distance per half-swing
    force = mass * g  # force on shoulder at bottom of swing (minimum estimate)
    ax2.barh(name, reach, color=color, alpha=0.8, height=0.5)
    ax2.text(reach + 0.02, name, f'{reach:.1f}m (force: {force:.0f}N)', color=color, fontsize=9, va='center')

ax2.set_xlabel('Max reach per swing (m)', color='white')
ax2.set_title('Swing Reach & Shoulder Force', color='white', fontsize=12)
ax2.tick_params(colors='gray')
ax2.set_yticklabels(list(arm_lengths.keys()), color='white')

plt.tight_layout()
plt.show()

print("Key insight: Gibbons are the brachiation champions because:")
print("  1. Long arms relative to body = large reach per swing")
print("  2. Low body mass = low force on joints")
print("  3. Ratio matters: gibbon arm-to-mass ratio is the best")
print(f"  Gibbon: {arm_lengths['Gibbon']/body_masses['Gibbon']:.3f} m/kg")
print(f"  Orangutan: {arm_lengths['Orangutan']/body_masses['Orangutan']:.3f} m/kg")`,
      challenge: 'A gibbon swings at the bottom of its arc. At that point, the centripetal force adds to gravity. If the gibbon swings with velocity 5 m/s, calculate the total force on its shoulder. (Hint: F = mg + mv²/L)',
      successHint: 'Arboreal locomotion is where biology meets physics. Every primate\'s body is an engineering solution to the problem of moving through a 3D maze of branches — and each solution has trade-offs in speed, safety, and energy cost.',
    },
    {
      title: 'Canopy ecosystems — the forest above the forest',
      concept: `The monkeys in the story live in the treetops, not on the ground. The **forest canopy** — the dense layer of overlapping crowns 20-40 meters above the floor — is one of Earth's least explored ecosystems. It contains more than half of all forest biodiversity.

The canopy is organized in layers:
- **Emergent layer** (40-70m): a few giant trees poking above the canopy, exposed to wind and sun
- **Upper canopy** (20-40m): the main "ceiling" of the forest, where most photosynthesis happens
- **Understory** (5-20m): shade-tolerant trees and shrubs, dim light
- **Forest floor** (0-5m): decomposers, seedlings, only 1-2% of sunlight reaches here

Each layer has different light, temperature, humidity, and wind. Animals specialize: gibbons in the upper canopy, macaques in the mid-canopy, civets in the understory. The canopy is not one habitat — it's a vertical stack of distinct worlds.`,
      analogy: 'The forest canopy is like a multi-story apartment building. The penthouse (emergent layer) gets all the sun and wind. The middle floors (canopy) are comfortable and crowded. The basement (forest floor) is dark and damp. Different tenants (species) prefer different floors, and rarely visit other levels.',
      storyConnection: 'The monkey bridge in the story connected two sides of a river through the treetops. In real forests, canopy connectivity is everything — if there\'s a gap in the canopy (from logging, a river, or a landslide), tree-dwelling animals are stranded. The story\'s bridge symbolizes the ecological bridges that keep canopy ecosystems connected.',
      checkQuestion: 'If only 1-2% of sunlight reaches the forest floor, how do seedlings survive there?',
      checkAnswer: 'Most seedlings wait. They grow very slowly using the dim light, staying small for years — even decades. When a large tree falls (creating a "light gap"), the sudden flood of sunlight triggers explosive growth. The seedlings that survive the long wait race upward to fill the gap. This is called "gap dynamics" and it drives forest regeneration.',
      codeIntro: 'Model light intensity at different canopy layers using the Beer-Lambert law.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Beer-Lambert law: I = I0 * e^(-k * LAI)
# I = light at depth, I0 = light above canopy
# k = extinction coefficient, LAI = leaf area index (cumulative)

I0 = 2000  # full sunlight (umol/m2/s)
k = 0.5    # extinction coefficient for tropical forest

# Height layers (m) and cumulative LAI from top
heights = np.linspace(45, 0, 200)
# LAI increases as we go down (more leaves above)
max_LAI = 8  # total LAI for dense tropical forest
LAI = max_LAI * (1 - heights / 45)

light = I0 * np.exp(-k * LAI)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')

# Light profile
ax1.set_facecolor('#111827')
ax1.plot(light, heights, color='#f59e0b', linewidth=2)
ax1.fill_betweenx(heights, 0, light, alpha=0.15, color='#f59e0b')
ax1.set_xlabel('Light intensity (umol/m2/s)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Light Through the Canopy', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Mark layers
layers = [
    (42, 'Emergent', '#ef4444'),
    (30, 'Upper canopy', '#22c55e'),
    (15, 'Understory', '#3b82f6'),
    (3, 'Forest floor', '#a855f7'),
]
for h, label, color in layers:
    idx = np.argmin(np.abs(heights - h))
    ax1.axhline(h, color=color, linestyle='--', alpha=0.5)
    ax1.annotate(f'{label} ({light[idx]:.0f})', xy=(light[idx], h),
                xytext=(light[idx]+200, h), color=color, fontsize=9)

# Species by layer
ax2.set_facecolor('#111827')
species_data = {
    'Emergent\n(40-45m)': ['Hornbills', 'Eagles'],
    'Upper canopy\n(20-40m)': ['Gibbons', 'Langurs', 'Macaques'],
    'Understory\n(5-20m)': ['Civets', 'Tree frogs', 'Snakes'],
    'Forest floor\n(0-5m)': ['Deer', 'Porcupines', 'Beetles'],
}

y_positions = [42, 30, 15, 3]
layer_colors = ['#ef4444', '#22c55e', '#3b82f6', '#a855f7']

for y, (layer, species), color in zip(y_positions, species_data.items(), layer_colors):
    ax2.barh(y, len(species) * 2, height=6, color=color, alpha=0.4)
    ax2.text(0.2, y, f'{layer}: {", ".join(species)}', color='white', fontsize=9, va='center')

ax2.set_xlabel('Relative species richness', color='white')
ax2.set_ylabel('Height (m)', color='white')
ax2.set_title('Species by Canopy Layer', color='white', fontsize=13)
ax2.set_ylim(-2, 48)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Light at emergent layer (42m): {I0 * np.exp(-k * max_LAI * (1 - 42/45)):.0f} umol/m2/s")
print(f"Light at upper canopy (30m): {I0 * np.exp(-k * max_LAI * (1 - 30/45)):.0f} umol/m2/s")
print(f"Light at forest floor (0m): {I0 * np.exp(-k * max_LAI):.0f} umol/m2/s")
print(f"\\nThat's only {I0 * np.exp(-k * max_LAI) / I0 * 100:.1f}% of sunlight reaching the ground.")`,
      challenge: 'Increase the total LAI from 8 to 12 (a denser forest). How much light reaches the floor now? At what LAI does the floor get less than 1 umol/m2/s (essentially total darkness)?',
      successHint: 'The Beer-Lambert law is used in everything from forest ecology to ocean science to atmospheric physics. Wherever light passes through a medium, this exponential decay applies. The canopy is a biological light filter.',
    },
    {
      title: 'Food webs in forests — who eats whom',
      concept: `The monkeys in the story eat fruit from the forest. But they're also part of a complex **food web** — a network of feeding relationships that connects every organism in the ecosystem.

A simplified Namdapha food web:
- **Producers**: trees, ferns, mosses (convert sunlight to sugar via photosynthesis)
- **Primary consumers**: leaf-eating insects, fruit-eating birds, seed-eating rodents, herbivorous monkeys
- **Secondary consumers**: insect-eating birds, small predators (civets, martens)
- **Tertiary consumers**: clouded leopards, pythons, eagles
- **Decomposers**: fungi, bacteria, beetles (break down dead matter back into nutrients)

Energy flows upward through these levels, but only about **10%** is transferred at each step (the rest is lost as heat). This is why there are far fewer predators than prey — the energy pyramid narrows sharply at each level.`,
      analogy: 'A food web is like a city economy. Producers (farmers) grow food. Primary consumers (restaurants) buy from farmers. Secondary consumers (food critics) depend on restaurants. If the farmers go bankrupt, the whole chain collapses. And at each level, money (energy) is lost to overhead (heat).',
      storyConnection: 'The monkeys in the story ate fruit and crossed the river to find more food trees. In real food webs, fruit-eating primates are critical seed dispersers — they eat fruit, travel, and deposit seeds (in their droppings) far from the parent tree. Without monkeys, many tree species can\'t spread. The monkeys and the forest need each other.',
      checkQuestion: 'If a disease killed all the insects in a forest, what would happen to the monkeys that eat fruit (not insects)?',
      checkAnswer: 'They\'d be affected too, eventually. Many fruit trees depend on insect pollinators. No insects means no pollination means no fruit. Food webs are interconnected — removing one group sends ripples through the entire network. This is called a "trophic cascade."',
      codeIntro: 'Build a food web energy pyramid and model how energy transfers between levels.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Energy transfer through trophic levels
# Only ~10% transfers up at each level
solar_input = 1000000  # kcal/m2/year hitting the canopy
efficiency = [0.01, 0.10, 0.10, 0.10]  # photosynthesis, then each trophic transfer

levels = ['Sunlight', 'Producers\\n(trees)', 'Primary\\nconsumers', 'Secondary\\nconsumers', 'Tertiary\\nconsumers']
energy = [solar_input]
for eff in efficiency:
    energy.append(energy[-1] * eff)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# Energy pyramid
ax1.set_facecolor('#111827')
colors = ['#f59e0b', '#22c55e', '#3b82f6', '#ef4444', '#a855f7']
for i, (level, e, color) in enumerate(zip(levels, energy, colors)):
    width = e / solar_input * 10
    ax1.barh(i, width, height=0.6, color=color, alpha=0.8, left=-width/2)
    if e >= 1:
        ax1.text(width/2 + 0.2, i, f'{e:,.0f} kcal', color=color, fontsize=9, va='center')
    else:
        ax1.text(width/2 + 0.2, i, f'{e:.2f} kcal', color=color, fontsize=9, va='center')

ax1.set_yticks(range(len(levels)))
ax1.set_yticklabels(levels, color='white', fontsize=9)
ax1.set_title('Energy Pyramid (kcal/m²/year)', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.set_xticks([])

# Namdapha food web (simplified network)
ax2.set_facecolor('#111827')
# Positions for species
species = {
    'Trees': (0.5, 0.1),
    'Insects': (0.2, 0.35),
    'Fruit/seeds': (0.5, 0.3),
    'Monkeys': (0.65, 0.5),
    'Birds': (0.35, 0.5),
    'Civets': (0.2, 0.7),
    'Clouded\\nleopard': (0.5, 0.85),
    'Eagle': (0.8, 0.8),
}

# Connections (prey -> predator)
connections = [
    ('Trees', 'Insects'), ('Trees', 'Fruit/seeds'),
    ('Fruit/seeds', 'Monkeys'), ('Fruit/seeds', 'Birds'),
    ('Insects', 'Birds'), ('Insects', 'Civets'),
    ('Monkeys', 'Clouded\\nleopard'), ('Monkeys', 'Eagle'),
    ('Birds', 'Eagle'), ('Birds', 'Civets'),
    ('Civets', 'Clouded\\nleopard'),
]

sp_colors = {'Trees': '#22c55e', 'Insects': '#f59e0b', 'Fruit/seeds': '#22c55e',
             'Monkeys': '#3b82f6', 'Birds': '#ef4444', 'Civets': '#a855f7',
             'Clouded\\nleopard': '#ec4899', 'Eagle': '#ef4444'}

for src, dst in connections:
    x1, y1 = species[src]
    x2, y2 = species[dst]
    ax2.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color='gray', alpha=0.4, lw=1))

for name, (x, y) in species.items():
    ax2.plot(x, y, 'o', color=sp_colors[name], markersize=12)
    ax2.text(x, y - 0.06, name, color='white', fontsize=8, ha='center')

ax2.set_title('Namdapha Forest Food Web', color='white', fontsize=12)
ax2.set_xlim(-0.05, 1.05)
ax2.set_ylim(-0.05, 1.0)
ax2.axis('off')

plt.tight_layout()
plt.show()

print("Energy at each level:")
for level, e in zip(levels, energy):
    pct = e / solar_input * 100
    print(f"  {level.replace(chr(10), ' ')}: {e:,.0f} kcal ({pct:.4f}%)")
print("\\n10% rule: only 10% of energy passes to the next level.")
print("This is why top predators are rare — there's barely any energy left for them.")`,
      challenge: 'What if the transfer efficiency were 20% instead of 10% (some aquatic food webs achieve this)? How much more energy would reach the top predator?',
      successHint: 'The 10% rule explains why ecosystems are shaped like pyramids, why big predators need huge territories, and why eating plants is more energy-efficient than eating meat. It\'s thermodynamics applied to ecology.',
    },
    {
      title: 'Social behavior in primates — why cooperation wins',
      concept: `The monkeys in the story didn't cross the river alone — they cooperated, forming a living bridge together. Real primates are among the most social animals on Earth. Their group living is not random; it follows specific patterns shaped by evolution.

Why live in groups:
- **Predator detection**: more eyes watching = less chance of surprise attack
- **Food finding**: groups can search a larger area
- **Defense**: a group of macaques can mob a predator that one monkey can't fight alone
- **Learning**: young primates learn skills by watching adults (social learning)
- **Infant care**: some species share babysitting duties (alloparenting)

But group living has costs too:
- **Competition** for food within the group
- **Disease** spreads faster in dense groups
- **Conflict** over mates and resources

The optimal group size balances these benefits and costs. For most macaque species, it's 20-50 individuals. This isn't random — it's an evolutionary solution to a mathematical optimization problem.`,
      analogy: 'Primate social groups work like a team sport. A basketball team (5 players) is too small for some tasks. A football team (11) is better for complex plays. An army battalion (300-800) can handle bigger challenges but is harder to coordinate. Each group size has its sweet spot for the task at hand.',
      storyConnection: 'The monkey bridge only worked because the troop cooperated. One monkey can\'t span a river. In primate biology, this cooperation is maintained by social bonds — grooming, food sharing, alliance formation. The monkeys in the story trusted each other enough to literally put their lives in each other\'s hands. Real primates build this trust through thousands of hours of grooming.',
      checkQuestion: 'Why do primates spend so much time grooming each other (up to 20% of their day)? It seems like a waste of time compared to foraging.',
      checkAnswer: 'Grooming serves a dual purpose: it removes parasites (hygiene) but more importantly, it builds and maintains social bonds (politics). Primates that groom others receive support in conflicts, access to food, and protection. Grooming is the "currency" of primate social life — it\'s an investment in alliances that pays off when cooperation is needed.',
      codeIntro: 'Model optimal group size by balancing the benefits (safety) and costs (food competition) of group living.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Optimal group size model
# Benefit: predator detection increases with group size (diminishing returns)
# Cost: food competition increases linearly with group size

group_sizes = np.arange(1, 61)

# Benefit: safety (logarithmic — diminishing returns)
safety_benefit = 10 * np.log(group_sizes)

# Cost: food competition (linear)
competition_cost = 0.5 * group_sizes

# Net benefit
net_benefit = safety_benefit - competition_cost

# Optimal group size
optimal = group_sizes[np.argmax(net_benefit)]

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# Benefits and costs
ax1.set_facecolor('#111827')
ax1.plot(group_sizes, safety_benefit, color='#22c55e', linewidth=2, label='Safety benefit')
ax1.plot(group_sizes, competition_cost, color='#ef4444', linewidth=2, label='Competition cost')
ax1.fill_between(group_sizes, safety_benefit, competition_cost,
                 where=safety_benefit > competition_cost, alpha=0.1, color='#22c55e')
ax1.set_ylabel('Value', color='white')
ax1.set_title('Benefits vs Costs of Group Living', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Net benefit
ax2.set_facecolor('#111827')
ax2.plot(group_sizes, net_benefit, color='#3b82f6', linewidth=2)
ax2.fill_between(group_sizes, net_benefit, 0, where=net_benefit > 0, alpha=0.15, color='#3b82f6')
ax2.axvline(optimal, color='#f59e0b', linestyle='--', linewidth=2)
ax2.annotate(f'Optimal: {optimal} individuals', xy=(optimal, net_benefit[optimal-1]),
            xytext=(optimal+5, net_benefit[optimal-1]+2), color='#f59e0b', fontsize=11,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax2.axhline(0, color='gray', linestyle='-', linewidth=0.5)
ax2.set_xlabel('Group size', color='white')
ax2.set_ylabel('Net benefit', color='white')
ax2.set_title('Net Benefit of Group Size', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Optimal group size: {optimal}")
print(f"Net benefit at optimal: {net_benefit[optimal-1]:.1f}")
print(f"\\nReal macaque group sizes: 20-50 (matches the model!)")
print(f"Too small: not enough eyes for predator detection")
print(f"Too large: too much competition for food")`,
      challenge: 'What if predation pressure doubles (multiply safety_benefit by 2)? How does the optimal group size change? What about in a food-rich environment (halve competition_cost)?',
      successHint: 'Optimal group size is a foundational concept in behavioral ecology. The same benefit-cost framework applies to flocks, herds, schools of fish, and even human organizations. The math of cooperation is universal.',
    },
    {
      title: 'Conservation of old-growth forests — why ancient trees matter',
      concept: `The forest in the Monkey Bridge story is not just any forest — it's old-growth, with trees hundreds of years old. **Old-growth forests** are irreplaceable ecosystems that take centuries to develop. They can't be replanted and regrown in a human lifetime.

What makes old-growth special:
- **Structural complexity**: trees of all ages and sizes, snags (dead standing trees), fallen logs
- **Canopy gaps**: natural openings that create light mosaics, supporting diverse understory
- **Soil depth**: centuries of leaf litter create deep, nutrient-rich soil with complex fungal networks
- **Biodiversity**: specialist species that can ONLY survive in old-growth conditions
- **Carbon storage**: old trees are massive carbon banks; a single large tree can store 1-2 tonnes of carbon

Namdapha's forests harbor species found nowhere else — including possibly the last Namdapha flying squirrel, seen only once, in 1981. When old-growth is logged, these species vanish.

India has lost ~50% of its old-growth forest in the last century. What remains is priceless.`,
      analogy: 'An old-growth forest is like an ancient library. Each old tree is a rare, irreplaceable book containing centuries of ecological knowledge (in its rings, its hollows, its relationships with fungi). A tree plantation is like a bookshop of new paperbacks — useful, but it can never replace the lost originals. You can\'t regrow a 500-year-old tree in 50 years any more than you can rewrite a lost medieval manuscript.',
      storyConnection: 'The monkey bridge only existed because the forest had massive, ancient trees with vines thick enough to support the monkeys\' weight. Young plantation trees don\'t have these features. The story implicitly argues for preserving old-growth forest — without those ancient trees and their canopy connections, the monkeys have no bridge and no way to cross.',
      checkQuestion: 'Why can\'t we just plant new trees to replace old-growth forest? Isn\'t a tree a tree?',
      checkAnswer: 'A plantation is to an old-growth forest what a swimming pool is to a coral reef. Same water, completely different ecosystem. Old-growth has: (1) structural complexity developed over centuries, (2) species that need specific old-growth features (cavities, deep bark, specific fungi), (3) soil networks built over hundreds of years, (4) genetic diversity from natural selection. A plantation has none of these. It takes 200-500 years for a planted area to approach old-growth conditions.',
      codeIntro: 'Model forest carbon storage over centuries and compare old-growth vs. managed plantation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Carbon accumulation in two scenarios
years = np.arange(0, 501)

# Old-growth forest: grows and accumulates carbon continuously
# Sigmoid growth, reaching ~300 tonnes C/ha
max_carbon_og = 300  # tonnes C per hectare
k_og = 0.015
mid_og = 200
carbon_old_growth = max_carbon_og / (1 + np.exp(-k_og * (years - mid_og)))

# Managed plantation: harvested every 40 years, replanted
cycle = 40
max_carbon_plant = 80  # max C in a 40-year-old plantation
carbon_plantation = np.zeros(len(years))
for i, y in enumerate(years):
    age = y % cycle
    carbon_plantation[i] = max_carbon_plant * (1 - np.exp(-0.08 * age))

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 8))
fig.patch.set_facecolor('#1f2937')

# Carbon over time
ax1.set_facecolor('#111827')
ax1.plot(years, carbon_old_growth, color='#22c55e', linewidth=2, label='Old-growth forest')
ax1.plot(years, carbon_plantation, color='#f59e0b', linewidth=2, label='Managed plantation (40-yr cycle)')
ax1.fill_between(years, carbon_old_growth, carbon_plantation, alpha=0.1, color='#22c55e')
ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Carbon stored (tonnes/ha)', color='white')
ax1.set_title('Forest Carbon Storage: Old-Growth vs Plantation', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Cumulative carbon benefit
cumulative_diff = np.cumsum(carbon_old_growth - carbon_plantation)
ax2.set_facecolor('#111827')
ax2.plot(years, cumulative_diff, color='#3b82f6', linewidth=2)
ax2.fill_between(years, cumulative_diff, alpha=0.15, color='#3b82f6')
ax2.set_xlabel('Years', color='white')
ax2.set_ylabel('Cumulative extra carbon (tonnes/ha)', color='white')
ax2.set_title('Cumulative Carbon Advantage of Old-Growth', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("After 500 years:")
print(f"  Old-growth stored: {carbon_old_growth[-1]:.0f} tonnes C/ha")
print(f"  Plantation average: {np.mean(carbon_plantation):.0f} tonnes C/ha")
print(f"  Old-growth stores {carbon_old_growth[-1] / np.mean(carbon_plantation):.1f}x more carbon")
print(f"\\nCutting an old-growth forest releases centuries of stored carbon.")
print(f"A plantation can never catch up — it keeps getting reset to zero.")`,
      challenge: 'What if we extend the plantation harvest cycle to 80 years instead of 40? Does the gap shrink? At what harvest cycle would the plantation match old-growth carbon storage? (Hint: it never can.)',
      successHint: 'Old-growth forests are not just collections of big trees — they are centuries-old carbon banks, biodiversity reservoirs, and ecological machines that cannot be rebuilt on human timescales. Conservation of existing old-growth is always more effective than planting new forest.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Primatology & Forest Canopy — no prior science experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ecology simulations. Click to start.</p>
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
