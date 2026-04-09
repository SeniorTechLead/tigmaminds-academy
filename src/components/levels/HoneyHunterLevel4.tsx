import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import BeeMonitoringDiagram from '../diagrams/BeeMonitoringDiagram';
import BeePathOptimizationDiagram from '../diagrams/BeePathOptimizationDiagram';
import BeeDiseaseDetectionDiagram from '../diagrams/BeeDiseaseDetectionDiagram';
import BeePollinationNetworkDiagram from '../diagrams/BeePollinationNetworkDiagram';
import BeeConservationPlanDiagram from '../diagrams/BeeConservationPlanDiagram';
import BeeDataDashboardDiagram from '../diagrams/BeeDataDashboardDiagram';

export default function HoneyHunterLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Part 1 — Build the bipartite pollination network',
      concept: `Your capstone project is a **Pollination Network Analyzer** — a tool that takes plant-pollinator interaction data, constructs the network, computes structural metrics, and identifies keystone species whose loss would cause cascading extinctions.

Part 1 builds the network foundation. A pollination network is a **bipartite graph**: two sets of nodes (plants and pollinators) connected by edges (interactions). An edge between bee species B and plant species P means B visits P for nectar/pollen and P receives pollination from B.

Network properties we will compute:
- **Adjacency matrix**: rows = pollinators, columns = plants, entries = interaction strength
- **Degree**: number of partners for each species
- **Specialization index (d')**: how specialized each species is relative to what is available. d' = 0 means the species uses partners in proportion to their availability; d' = 1 means it visits only one partner.
- **Network-level specialization (H2')**: the overall specialization of the network. Low H2' = generalized network (robust). High H2' = specialized network (fragile).

Real pollination data comes from field observations: researchers sit at flowers and record which insects visit over hundreds of hours. We will simulate realistic data.`,
      analogy: 'Building a pollination network is like mapping a social network. You observe who talks to whom at a party (which bee visits which flower) and record the frequency. The resulting map reveals social structure: popular people (generalist flowers visited by many bees), close friends (specialist interactions), and the people who connect different social groups (keystone species).',
      storyConnection: 'The honey hunter knows which flowers bees prefer — this is traditional ecological knowledge encoded in generations of observation. Building a pollination network formalizes this knowledge. The hunter might say "bees love the mustard flowers in spring" — the network would show a thick edge between Apis mellifera and Brassica juncea, confirming with data what the hunter knows from experience.',
      checkQuestion: 'A network has 10 bee species and 30 plant species. There are 80 recorded interactions. What is the connectance? Is this typical?',
      checkAnswer: 'Connectance = 80 / (10 × 30) = 0.267, meaning 26.7% of all possible interactions exist. This is moderate-to-high for a pollination network. Typical connectance ranges from 0.05 (large, tropical networks) to 0.30 (small, temperate networks). Higher connectance generally means more redundancy and greater robustness to species loss.',
      codeIntro: 'Generate a realistic pollination network with nested structure, compute degree distributions and specialization indices, and visualize the bipartite graph.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate realistic pollination network ---
n_pollinators = 12
n_plants = 20

pollinator_names = ['Apis mellifera', 'Bombus impatiens', 'Xylocopa virginica',
                    'Osmia lignaria', 'Andrena fulva', 'Halictus ligatus',
                    'Megachile rotundata', 'Ceratina calcarata', 'Bombus terrestris',
                    'Lasioglossum sp.', 'Colletes sp.', 'Nomia melanderi']
plant_names = [f'Plant_{i+1}' for i in range(n_plants)]

generalism = np.array([0.85, 0.75, 0.55, 0.45, 0.60, 0.35,
                        0.40, 0.25, 0.70, 0.30, 0.20, 0.50])

plant_attractiveness = np.random.dirichlet(np.ones(n_plants) * 1.5)
plant_attractiveness = plant_attractiveness / max(plant_attractiveness)

interaction = np.zeros((n_pollinators, n_plants))
for b in range(n_pollinators):
    n_partners = max(1, int(generalism[b] * n_plants * np.random.uniform(0.7, 1.3)))
    n_partners = min(n_partners, n_plants)
    probs = plant_attractiveness ** (1 / max(generalism[b], 0.1))
    probs = probs / np.sum(probs)
    partners = np.random.choice(n_plants, size=n_partners, replace=False, p=probs)
    for p in partners:
        interaction[b, p] = np.random.exponential(generalism[b] * plant_attractiveness[p] * 10)

for p in range(n_plants):
    if np.sum(interaction[:, p]) == 0:
        interaction[np.random.randint(0, n_pollinators), p] = np.random.exponential(2)

binary = (interaction > 0).astype(int)

# --- Metrics ---
pollinator_degree = np.sum(binary, axis=1)
plant_degree = np.sum(binary, axis=0)
connectance = np.sum(binary) / (n_pollinators * n_plants)

def compute_d_prime(row, available):
    total = np.sum(row)
    if total == 0: return 0
    obs = row / total
    exp = available / np.sum(available)
    nz = obs > 0
    if np.sum(nz) == 0: return 0
    return min(1, np.sum(obs[nz] * np.log(obs[nz] / exp[nz])) / np.log(n_plants))

plant_totals = np.sum(interaction, axis=0) + 1
d_prime = [compute_d_prime(interaction[b], plant_totals) for b in range(n_pollinators)]

# Nestedness (NODF)
nodf_sum, nodf_pairs = 0, 0
for i in range(n_pollinators):
    for j in range(i+1, n_pollinators):
        di, dj = pollinator_degree[i], pollinator_degree[j]
        if di > 0 and dj > 0 and di != dj:
            nodf_sum += np.sum(binary[i] & binary[j]) / min(di, dj)
            nodf_pairs += 1
nestedness = nodf_sum / nodf_pairs if nodf_pairs > 0 else 0

# ============================================
# BIPARTITE NETWORK VISUALIZATION
# ============================================
fig, axes = plt.subplots(1, 3, figsize=(16, 8))
fig.patch.set_facecolor('#0d1117')
fig.suptitle('Pollination Network — Bipartite Graph & Structure',
             color='white', fontsize=14, fontweight='bold')

for ax in axes:
    ax.set_facecolor('#0d1117')
    ax.tick_params(colors='gray')

# Panel 1: Bipartite graph
ax = axes[0]
ax.set_xlim(-0.5, 1.5)
ax.set_ylim(-1, max(n_pollinators, n_plants))
ax.axis('off')
ax.set_title('Bipartite Network', color='white', fontsize=11)

# Position pollinators on left (x=0), plants on right (x=1)
poll_y = np.linspace(0, n_pollinators - 1, n_pollinators)
plant_y = np.linspace(0, n_plants - 1, n_plants) * (n_pollinators - 1) / (n_plants - 1)

# Draw edges (color by strength)
max_strength = interaction.max()
for b in range(n_pollinators):
    for p in range(n_plants):
        if binary[b, p]:
            strength = interaction[b, p] / max_strength
            ax.plot([0, 1], [poll_y[b], plant_y[p]], '-',
                    color='#22c55e', alpha=0.1 + 0.5 * strength,
                    linewidth=0.3 + 2 * strength)

# Draw nodes
for b in range(n_pollinators):
    size = 40 + pollinator_degree[b] * 15
    ax.scatter(0, poll_y[b], s=size, c='#f59e0b', zorder=5, edgecolors='white', linewidths=0.5)
    name_short = pollinator_names[b].split()[0][:8]
    ax.text(-0.08, poll_y[b], name_short, ha='right', va='center', color='#f59e0b', fontsize=6)

for p in range(n_plants):
    size = 30 + plant_degree[p] * 12
    ax.scatter(1, plant_y[p], s=size, c='#22c55e', zorder=5, edgecolors='white', linewidths=0.5)
    ax.text(1.08, plant_y[p], plant_names[p], ha='left', va='center', color='#22c55e', fontsize=6)

# Panel 2: Interaction matrix heatmap
ax = axes[1]
# Sort by degree for visual nestedness
poll_order = np.argsort(-pollinator_degree)
plant_order = np.argsort(-plant_degree)
sorted_matrix = interaction[poll_order][:, plant_order]

im = ax.imshow(sorted_matrix, cmap='YlGn', aspect='auto', interpolation='nearest')
ax.set_xlabel('Plants (sorted by degree)', color='white')
ax.set_ylabel('Pollinators (sorted by degree)', color='white')
ax.set_title('Interaction Matrix (nested)', color='white', fontsize=11)

# Panel 3: Degree distribution
ax = axes[2]
ax.barh(range(n_pollinators), pollinator_degree[np.argsort(-pollinator_degree)],
        color='#f59e0b', alpha=0.8, height=0.7)
ax.set_yticks(range(n_pollinators))
ax.set_yticklabels([pollinator_names[i][:12] for i in np.argsort(-pollinator_degree)],
                    color='white', fontsize=7)
ax.set_xlabel('Number of plant partners', color='white')
ax.set_title('Pollinator Degree', color='white', fontsize=11)
ax.invert_yaxis()

plt.tight_layout()
plt.show()

# --- Text summary ---
print("=== Pollination Network — Part 1 ===")
print(f"Network: {n_pollinators} pollinators x {n_plants} plants")
print(f"Interactions: {int(np.sum(binary))} | Connectance: {connectance:.3f}")
print(f"Nestedness (NODF): {nestedness:.3f}")
print(f"Mean specialization (d'): {np.mean(d_prime):.3f}")
vulnerable = int(np.sum(plant_degree == 1))
print(f"Vulnerable plants (1 pollinator): {vulnerable}/{n_plants}")
print(f"Top pollinator: {pollinator_names[np.argmax(pollinator_degree)]} (degree {pollinator_degree.max()})")`,
      challenge: 'Generate a random network with the same number of species and interactions but without nested structure. Compare its nestedness and robustness metrics. This demonstrates why real networks evolve nestedness — it provides structural resilience.',
      successHint: 'You have built the data infrastructure of a pollination network analyzer. Real tools like the R package bipartite and the web app pollinator-network use the same metrics to assess ecosystem health worldwide.',
    },
    {
      title: 'Capstone Part 2 — Keystone species identification and extinction cascades',
      concept: `A **keystone species** is one whose removal causes disproportionate damage to the network. In pollination networks, keystones are typically:

1. **Hub pollinators**: high-degree generalists that service many plants. Their loss disconnects many plants from pollination.
2. **Sole pollinators**: the only pollinator for one or more plant species. Even a specialist with degree=1 is a keystone if that plant has no other pollinators.
3. **Network connectors**: species that bridge otherwise disconnected subnetworks.

We identify keystones through **sequential removal experiments**:
1. Remove one pollinator at a time
2. Check which plants lose ALL pollinators (primary extinction)
3. Check if those plant losses cause other pollinators to lose ALL food sources (secondary extinction)
4. Continue cascading until stable

The **robustness** of a network is the fraction of species that must be removed before 50% of the partner group goes extinct. Higher robustness = more resilient network.

**Removal order matters critically**:
- Most-connected first: simulates targeted loss of generalists (worst case)
- Random: simulates stochastic species loss
- Least-connected first: simulates loss of rare specialists first (best case)

The difference between worst-case and best-case robustness quantifies how much the network depends on its hub species.`,
      analogy: 'Keystone identification is like finding the load-bearing walls in a building. You can remove decorative walls (specialist species) without the building collapsing. But remove a load-bearing wall (hub species) and the roof caves in, which damages the floor above, which pulls down the ceiling — a cascade. Building inspectors (network ecologists) identify these critical elements before disaster strikes.',
      storyConnection: 'The honey hunter instinctively knows that Apis mellifera (the managed honeybee) is not the only pollinator — wild bees, butterflies, beetles, and birds all play roles. But which are expendable and which are keystones? If a disease wipes out one wild bee species, will the honey production collapse? Keystone analysis answers this: some species can disappear with minimal impact, but losing the wrong one triggers a cascade that even the honeybees cannot compensate for.',
      checkQuestion: 'A network has Apis mellifera (degree=18) and Osmia lignaria (degree=3). Osmia is the sole pollinator of a rare orchid. Which is the bigger keystone?',
      checkAnswer: 'It depends on definition. Apis mellifera is the bigger structural keystone — its removal disconnects many plants (though most have other pollinators). Osmia is the bigger functional keystone for the orchid — its removal means certain extinction of that plant species. In conservation, both matter: protect Apis for network-wide stability, protect Osmia for species-specific conservation. Keystone analysis must consider both degree-based and uniqueness-based metrics.',
      codeIntro: 'Implement sequential removal experiments, identify keystones through removal impact analysis, and simulate extinction cascades under different removal scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Rebuild network from Part 1
n_pollinators = 12
n_plants = 20
pollinator_names = ['Apis', 'Bombus_i', 'Xylocopa', 'Osmia', 'Andrena', 'Halictus',
                    'Megachile', 'Ceratina', 'Bombus_t', 'Lasioglossum', 'Colletes', 'Nomia']
generalism = np.array([0.85, 0.75, 0.55, 0.45, 0.60, 0.35, 0.40, 0.25, 0.70, 0.30, 0.20, 0.50])
plant_attractiveness = np.random.dirichlet(np.ones(n_plants) * 1.5)
plant_attractiveness /= max(plant_attractiveness)

binary = np.zeros((n_pollinators, n_plants), dtype=int)
for b in range(n_pollinators):
    n_partners = max(1, int(generalism[b] * n_plants * np.random.uniform(0.7, 1.3)))
    n_partners = min(n_partners, n_plants)
    probs = plant_attractiveness ** (1 / max(generalism[b], 0.1))
    probs /= np.sum(probs)
    partners = np.random.choice(n_plants, size=n_partners, replace=False, p=probs)
    for p in partners:
        binary[b, p] = 1
for p in range(n_plants):
    if np.sum(binary[:, p]) == 0:
        binary[np.random.randint(0, n_pollinators), p] = 1

pollinator_degree = np.sum(binary, axis=1)
plant_degree = np.sum(binary, axis=0)

# --- Extinction cascade simulation ---
def simulate_cascade(binary_matrix, removal_order):
    """Remove pollinators in order, track plant and secondary pollinator extinctions."""
    matrix = binary_matrix.copy()
    n_poll, n_plant = matrix.shape

    poll_alive = np.ones(n_poll, dtype=bool)
    plant_alive = np.ones(n_plant, dtype=bool)

    results = []
    results.append({
        'removed': 0,
        'plants_alive': int(np.sum(plant_alive)),
        'pollinators_alive': int(np.sum(poll_alive)),
    })

    for step, poll_idx in enumerate(removal_order):
        if not poll_alive[poll_idx]:
            continue

        # Primary removal
        poll_alive[poll_idx] = False

        # Check for plant extinctions (plants with no remaining pollinators)
        for p in range(n_plant):
            if plant_alive[p]:
                remaining_pollinators = np.sum(matrix[:, p] * poll_alive)
                if remaining_pollinators == 0:
                    plant_alive[p] = False

        # Secondary extinctions: pollinators that lose all food plants
        changed = True
        while changed:
            changed = False
            for b in range(n_poll):
                if poll_alive[b]:
                    remaining_plants = np.sum(matrix[b, :] * plant_alive)
                    if remaining_plants == 0:
                        poll_alive[b] = False
                        changed = True

        results.append({
            'removed': step + 1,
            'plants_alive': int(np.sum(plant_alive)),
            'pollinators_alive': int(np.sum(poll_alive)),
        })

    return results

# --- Run removal experiments ---
# Most-connected first (worst case)
order_most = np.argsort(-pollinator_degree)
results_most = simulate_cascade(binary, order_most)

# Least-connected first (best case)
order_least = np.argsort(pollinator_degree)
results_least = simulate_cascade(binary, order_least)

# Random order (average case, multiple trials)
n_trials = 20
random_final_plants = []
for _ in range(n_trials):
    order_random = np.random.permutation(n_pollinators)
    r = simulate_cascade(binary, order_random)
    random_final_plants.append([step['plants_alive'] for step in r])

# --- Individual removal impact ---
removal_impact = {}
for b in range(n_pollinators):
    test_matrix = binary.copy()
    test_matrix[b, :] = 0
    plants_lost = sum(1 for p in range(n_plants) if np.sum(test_matrix[:, p]) == 0)
    removal_impact[pollinator_names[b]] = plants_lost

# --- Cascade visualization ---
fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#0d1117')
fig.suptitle('Extinction Cascades — Removal Order Comparison',
             color='white', fontsize=14, fontweight='bold')

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: Plants surviving vs pollinators removed
ax = axes[0]
steps_most = [r['removed'] for r in results_most]
plants_most = [r['plants_alive'] for r in results_most]
steps_least = [r['removed'] for r in results_least]
plants_least = [r['plants_alive'] for r in results_least]

ax.plot(steps_most, plants_most, 'o-', color='#ef4444', linewidth=2, markersize=4, label='Most-connected first')
ax.plot(steps_least, plants_least, 'o-', color='#22c55e', linewidth=2, markersize=4, label='Least-connected first')

# Random trials as shaded region
random_arr = np.array(random_final_plants)
rand_mean = random_arr.mean(axis=0)
rand_std = random_arr.std(axis=0)
rand_steps = range(len(rand_mean))
ax.fill_between(rand_steps, rand_mean - rand_std, rand_mean + rand_std,
                color='#3b82f6', alpha=0.2)
ax.plot(rand_steps, rand_mean, '--', color='#3b82f6', linewidth=1.5, label='Random (mean +/- std)')

ax.axhline(n_plants / 2, color='#f59e0b', linestyle=':', linewidth=1, alpha=0.7)
ax.text(0.5, n_plants / 2 + 0.5, '50% threshold', color='#f59e0b', fontsize=8)
ax.set_xlabel('Pollinators removed', color='white')
ax.set_ylabel('Plants surviving', color='white')
ax.set_title('Cascade Curves', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 2: Individual removal impact (bar chart)
ax = axes[1]
sorted_names = [x[0] for x in sorted(removal_impact.items(), key=lambda x: -x[1])]
sorted_lost = [removal_impact[n] for n in sorted_names]
sorted_degrees = [pollinator_degree[pollinator_names.index(n)] for n in sorted_names]

colors = ['#ef4444' if lost > 0 else '#4b5563' for lost in sorted_lost]
bars = ax.barh(range(len(sorted_names)), sorted_degrees, color='#3b82f6', alpha=0.4,
               height=0.7, label='Degree')
ax.barh(range(len(sorted_names)), sorted_lost, color=colors, height=0.4, label='Plants lost')
ax.set_yticks(range(len(sorted_names)))
ax.set_yticklabels(sorted_names, color='white', fontsize=8)
ax.set_xlabel('Count', color='white')
ax.set_title('Keystone Impact (red = causes plant extinction)', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.invert_yaxis()

plt.tight_layout()
plt.show()

print("=== Keystone Species & Extinction Cascades ===")
print(f"\\n--- Individual removal impact ---")
print(f"{'Pollinator':<16} {'Degree':>6} {'Plants lost if removed':>22}")
print("-" * 48)
sorted_impact = sorted(removal_impact.items(), key=lambda x: -x[1])
for name, lost in sorted_impact:
    b_idx = pollinator_names.index(name)
    marker = " ** KEYSTONE" if lost > 0 else ""
    print(f"{name:<16} {pollinator_degree[b_idx]:>6} {lost:>22}{marker}")

print(f"\\n--- Extinction cascades by removal order ---")
print(f"{'Removed':>8} {'Most-connected':>15} {'Least-connected':>16}")
print(f"{'':>8} {'plants left':>15} {'plants left':>16}")
print("-" * 42)
max_steps = min(len(results_most), len(results_least))
for i in range(0, max_steps, max(1, max_steps // 8)):
    print(f"{results_most[i]['removed']:>8} {results_most[i]['plants_alive']:>15} {results_least[i]['plants_alive']:>16}")

# Robustness: fraction removed before 50% plants gone
half_plants = n_plants / 2
robustness_most = sum(1 for r in results_most if r['plants_alive'] >= half_plants) / n_pollinators
robustness_least = sum(1 for r in results_least if r['plants_alive'] >= half_plants) / n_pollinators
random_robustness = []
for trial in random_final_plants:
    rob = sum(1 for p in trial if p >= half_plants) / (len(trial))
    random_robustness.append(rob)

print(f"\\n--- Network Robustness ---")
print(f"Fraction of pollinators removed before 50% plant loss:")
print(f"  Most-connected first (worst case): {robustness_most:.2f}")
print(f"  Random order (average case):       {np.mean(random_robustness):.2f} +/- {np.std(random_robustness):.2f}")
print(f"  Least-connected first (best case): {robustness_least:.2f}")
print(f"\\nThe gap between worst and best case ({robustness_least - robustness_most:.2f})")
print(f"shows how much the network depends on its hub species.")`,
      challenge: 'Run 100 random removal orders and compute the distribution of robustness values. What is the probability that random species loss causes >50% plant extinction before >50% of pollinators are lost?',
      successHint: 'Keystone identification is used by IUCN and national conservation agencies to prioritize pollinator protection. The cascade simulation you built is the same analysis that informed the EU ban on neonicotinoid pesticides.',
    },
    {
      title: 'Capstone Part 3 — Colony Collapse Disorder modeling and economic impact',
      concept: `CCD is not a binary event — it is a gradient of colony weakening. Sublethal effects include:
- **Reduced foraging efficiency**: pesticide-exposed bees take longer to find food
- **Navigation impairment**: bees cannot find the hive, dying in the field
- **Reduced queen laying**: fewer eggs = slower colony growth
- **Weakened immune response**: higher susceptibility to Varroa mites and viruses
- **Shortened worker lifespan**: workers die younger, disrupting the age-based division of labor

We model CCD as a multi-factor stress on the colony population model from Level 3:
- Foraging efficiency × (1 - pesticide_impact)
- Worker lifespan × (1 - health_impact)
- Queen fecundity × (1 - stress_factor)
- Varroa load increases exponentially without treatment

The economic dimension: bee pollination is worth $235-577 billion per year globally. In India, pollinator services for agriculture are estimated at ₹1.3 lakh crore. A 30% loss of managed colonies reduces crop yields for almonds (90% bee-dependent), apples (65%), blueberries (90%), and many vegetables.

Our model connects colony-level CCD to network-level pollinator loss to ecosystem-level crop impact.`,
      analogy: 'CCD modeling is like epidemiology: you track how a disease (pesticide exposure, Varroa) weakens individuals (bees), which weakens organizations (colonies), which weakens the economy (crop pollination). Just as COVID models predicted hospital overload from infection rates, CCD models predict crop failures from colony loss rates. The chain of causation spans biological scales from molecular (pesticide mechanism) to global (food security).',
      storyConnection: 'The honey hunter has noticed fewer bees in recent years. Farmers nearby spray pesticides on their crops — crops that the bees also visit. The honey harvest is declining. The story\'s lesson is about balance: take too much (overharvest honey, spray too many pesticides) and the system collapses. CCD modeling quantifies this: how much pesticide is too much? At what colony loss rate does crop pollination fail?',
      checkQuestion: 'A colony is exposed to neonicotinoids that reduce worker lifespan by 25% and foraging efficiency by 15%. The colony starts with 30,000 workers. Will it survive winter?',
      checkAnswer: 'Shorter lifespan means faster worker turnover, requiring more eggs just to maintain the same population. Reduced foraging means less honey stored for winter. The combined effect: the colony enters winter with fewer workers AND less food. A normal colony needs ~20,000 bees and 30 kg of honey to survive winter. With a 25% lifespan reduction, the colony may peak at only 22,000 workers and store only 70% of normal honey. It is on the edge — a moderately cold winter could push it into collapse.',
      codeIntro: 'Model CCD effects on colony dynamics, then cascade the colony-level impacts to the pollination network and agricultural productivity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Colony dynamics under CCD stress ---
days = 365

def simulate_colony(pesticide_impact=0, varroa_load=0, habitat_loss=0, label=''):
    """Simulate colony over one year with CCD stressors."""
    queen_max_eggs = 2000 * (1 - pesticide_impact * 0.3)
    summer_lifespan = 42 * (1 - pesticide_impact * 0.25 - varroa_load * 0.3)
    summer_lifespan = max(14, summer_lifespan)
    winter_lifespan = 180 * (1 - varroa_load * 0.2)
    foraging_efficiency = 1.0 - pesticide_impact * 0.15 - habitat_loss * 0.3
    foraging_efficiency = max(0.3, foraging_efficiency)
    larval_survival = 0.85 * (1 - varroa_load * 0.4)

    adults = 10000
    brood = np.zeros(21)
    brood[:] = 500

    population = []
    honey_stored = 20.0  # kg, starting spring reserves
    honey_history = []

    for day in range(days):
        # Egg laying
        photoperiod = 0.5 + 0.5 * np.sin(2 * np.pi * (day - 80) / 365)
        eggs = queen_max_eggs * max(0, photoperiod) ** 2
        surviving_eggs = eggs * larval_survival

        # Deaths
        lifespan = summer_lifespan if 60 < day < 300 else winter_lifespan
        daily_deaths = adults / lifespan * np.random.uniform(0.9, 1.1)

        # Navigation loss (bees that can't find home)
        if 60 < day < 300:
            lost_foragers = adults * 0.35 * pesticide_impact * 0.02
            daily_deaths += lost_foragers

        new_adults = brood[0]
        brood = np.roll(brood, -1)
        brood[-1] = surviving_eggs

        adults = max(100, adults + new_adults - daily_deaths)
        population.append(adults)

        # Honey dynamics (kg per day)
        # Foraging season: bees produce surplus honey
        if 90 < day < 280:
            foragers = adults * 0.35
            # A forager makes ~10 trips/day, ~40mg nectar each = 0.4g nectar/day
            # 4:1 nectar-to-honey ratio -> ~0.1g honey/forager/day = 0.0001 kg
            honey_income = foragers * 0.0001 * foraging_efficiency
            # Colony consumes ~1 kg/day in summer (brood + metabolism)
            honey_consumption = 0.8 + adults * 0.000005
            honey_stored += honey_income - honey_consumption
        else:
            # Winter: cluster consumes ~1 kg/day for thermoregulation
            honey_consumption = 0.3 + adults * 0.000005
            honey_stored -= honey_consumption

        honey_stored = max(0, honey_stored)
        honey_history.append(honey_stored)

    population = np.array(population)
    honey_history = np.array(honey_history)
    survived = population[-1] > 5000 and honey_history[-1] > 5
    return {
        'label': label,
        'peak_pop': population.max(),
        'min_pop': population.min(),
        'end_pop': population[-1],
        'peak_honey': honey_history.max(),
        'end_honey': honey_history[-1],
        'survived': survived,
        'population': population,
        'honey': honey_history,
    }

# --- Run scenarios ---
scenarios = [
    (0.0, 0.0, 0.0, 'Healthy colony'),
    (0.3, 0.0, 0.0, 'Mild pesticide (30%)'),
    (0.6, 0.0, 0.0, 'Heavy pesticide (60%)'),
    (0.0, 0.5, 0.0, 'Varroa infestation (50%)'),
    (0.3, 0.3, 0.0, 'Pesticide + Varroa'),
    (0.3, 0.3, 0.3, 'Pesticide + Varroa + Habitat loss'),
    (0.6, 0.5, 0.3, 'Severe CCD (all stressors)'),
]

results = []
for pest, var, hab, label in scenarios:
    r = simulate_colony(pest, var, hab, label)
    results.append(r)

# --- CCD Visualization ---
fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.patch.set_facecolor('#0d1117')
fig.suptitle('Colony Collapse Disorder — Scenario Comparison',
             color='white', fontsize=14, fontweight='bold')

for ax in axes:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

days_arr = np.arange(365)
colors_ccd = ['#22c55e', '#a3e635', '#f59e0b', '#fb923c', '#ef4444', '#dc2626', '#7f1d1d']

# Panel 1: Population over time
ax = axes[0]
for r, c in zip(results, colors_ccd):
    ax.plot(days_arr, r['population'], '-', color=c, linewidth=1.5,
            label=r['label'][:20], alpha=0.8)
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('Worker population', color='white')
ax.set_title('Colony Population', color='white', fontsize=11)
ax.legend(fontsize=5, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')

# Panel 2: Honey reserves over time
ax = axes[1]
for r, c in zip(results, colors_ccd):
    ax.plot(days_arr, r['honey'], '-', color=c, linewidth=1.5, alpha=0.8)
ax.axhline(5, color='#ef4444', linestyle=':', linewidth=1, alpha=0.5)
ax.text(10, 6, 'Survival threshold (5 kg)', color='#ef4444', fontsize=7)
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('Honey stored (kg)', color='white')
ax.set_title('Honey Reserves', color='white', fontsize=11)

# Panel 3: Summary bar chart
ax = axes[2]
labels_short = [r['label'][:15] for r in results]
end_pops = [r['end_pop'] for r in results]
bar_colors = ['#22c55e' if r['survived'] else '#ef4444' for r in results]
ax.barh(range(len(results)), end_pops, color=bar_colors, height=0.6)
ax.set_yticks(range(len(results)))
ax.set_yticklabels(labels_short, color='white', fontsize=7)
ax.axvline(5000, color='#f59e0b', linestyle=':', linewidth=1)
ax.set_xlabel('End-of-year workers', color='white')
ax.set_title('Survival Status', color='white', fontsize=11)
ax.invert_yaxis()

plt.tight_layout()
plt.show()

print("=== Colony Collapse Disorder Modeling ===")
print(f"\\n{'Scenario':<35} {'Peak Pop':>9} {'End Pop':>9} {'Peak Honey':>11} {'End Honey':>10} {'Survived?':>10}")
print("-" * 90)
for r in results:
    status = "YES" if r['survived'] else "COLLAPSED"
    print(f"{r['label']:<35} {r['peak_pop']:>9.0f} {r['end_pop']:>9.0f} {r['peak_honey']:>10.1f}kg {r['end_honey']:>9.1f}kg {status:>10}")

print(f"\\n--- CCD Stressor Effects ---")
healthy = results[0]
for r in results[1:]:
    pop_drop = (1 - r['peak_pop'] / healthy['peak_pop']) * 100
    honey_drop = (1 - r['end_honey'] / max(0.01, healthy['end_honey'])) * 100
    print(f"{r['label']:<35}: peak pop -{pop_drop:.0f}%, end honey -{min(100, honey_drop):.0f}%")

# Economic impact estimate
print(f"\\n--- Economic Impact ---")
print(f"Global pollination value: $235-577 billion/year")
colony_loss_rates = [0, 10, 20, 30, 50]
for loss in colony_loss_rates:
    low = 235 * loss / 100
    high = 577 * loss / 100
    print(f"  {loss}% colony loss -> {low:.0f}-{high:.0f} billion USD/year at risk")

severe = results[-1]
print(f"\\nSevere CCD reduces end-of-year population by {(1 - severe['end_pop']/healthy['end_pop'])*100:.0f}%")
print(f"and honey stores by {(1 - severe['end_honey']/max(0.01, healthy['end_honey']))*100:.0f}%")
if not severe['survived']:
    print(f"The colony COLLAPSES under full CCD stress.")`,
      challenge: 'Model a beekeeper\'s intervention: treating for Varroa in August (reducing varroa_load to 0.1 after day 220) and providing supplemental feeding in October (adding 5kg honey). Does this save the severe CCD colony?',
      successHint: 'CCD modeling integrates ecology, toxicology, and economics. Your model quantifies the multi-billion-dollar value of pollinator protection — the scientific basis for pesticide regulation and pollinator conservation policy worldwide.',
    },
    {
      title: 'Capstone Part 4 — Network resilience testing and rewiring analysis',
      concept: `Can we make pollination networks more resilient? Two approaches:

1. **Protection**: identify and protect keystone pollinators (from Part 2)
2. **Rewiring**: encourage new plant-pollinator interactions to fill gaps left by species loss

**Network rewiring** happens naturally when pollinators switch to alternative plants after their preferred plant disappears. It also happens through management: planting wildflower strips alongside crops provides alternative forage, creating new edges in the network.

We simulate rewiring by:
- Removing a pollinator (extinction event)
- Allowing surviving pollinators to "adopt" some of the orphaned plants (with probability proportional to the pollinator's generalism)
- Measuring how much rewiring reduces the cascade impact

The **rewiring potential** of a network depends on:
- **Generalist abundance**: networks with more generalists rewire more easily
- **Functional redundancy**: how many pollinators can substitute for a lost one
- **Phenological overlap**: can a substitute pollinator be active at the right time of year?

This connects to management: planting diverse wildflower strips increases generalist pollinator populations, which increases rewiring potential, which increases network resilience. The mathematical analysis justifies the management action.`,
      analogy: 'Network rewiring is like a power grid rerouting electricity after a plant failure. Normally, plant A supplies neighborhood X. If plant A fails, the grid controller reroutes power from plant B (if it has spare capacity and the transmission line exists). "Spare capacity" is the pollinator\'s flexibility; "transmission line" is phenological overlap. Planting wildflower strips is like building new transmission lines — it creates backup routes.',
      storyConnection: 'The honey hunter\'s ancestors planted wildflowers near their hives — not because they understood network theory, but because they observed that bees with diverse forage produced more honey. The traditional practice of maintaining diverse landscapes around bee colonies is, in network terms, maximizing rewiring potential. Modern monoculture (opposite approach) creates fragile networks with low rewiring potential.',
      checkQuestion: 'After removing a keystone pollinator, 3 plants lose all pollination. A surviving generalist bee could potentially visit all 3 plants. Should we assume full rewiring?',
      checkAnswer: 'No. Rewiring is not automatic: the generalist must discover the orphaned plants, the plants must be compatible (right flower shape, nectar chemistry), and timing must align (both must be active in the same season). Realistic rewiring rates are 30-60% of theoretical maximum. Overestimating rewiring leads to overestimating resilience. Always use conservative rewiring assumptions in conservation planning.',
      codeIntro: 'Simulate network rewiring after pollinator loss, evaluate how much rewiring reduces cascade severity, and identify management actions that maximize rewiring potential.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Rebuild network
n_pollinators = 12
n_plants = 20
pollinator_names = ['Apis', 'Bombus_i', 'Xylocopa', 'Osmia', 'Andrena', 'Halictus',
                    'Megachile', 'Ceratina', 'Bombus_t', 'Lasioglossum', 'Colletes', 'Nomia']
generalism = np.array([0.85, 0.75, 0.55, 0.45, 0.60, 0.35, 0.40, 0.25, 0.70, 0.30, 0.20, 0.50])

plant_attractiveness = np.random.dirichlet(np.ones(n_plants) * 1.5)
plant_attractiveness /= max(plant_attractiveness)

binary = np.zeros((n_pollinators, n_plants), dtype=int)
for b in range(n_pollinators):
    n_partners = max(1, int(generalism[b] * n_plants * np.random.uniform(0.7, 1.3)))
    n_partners = min(n_partners, n_plants)
    probs = plant_attractiveness ** (1 / max(generalism[b], 0.1))
    probs /= np.sum(probs)
    partners = np.random.choice(n_plants, size=n_partners, replace=False, p=probs)
    for p in partners:
        binary[b, p] = 1
for p in range(n_plants):
    if np.sum(binary[:, p]) == 0:
        binary[np.random.randint(0, n_pollinators), p] = 1

pollinator_degree = np.sum(binary, axis=1)

def cascade_with_rewiring(binary_matrix, removal_order, rewiring_prob=0.0):
    """Simulate extinction cascade with optional rewiring."""
    matrix = binary_matrix.copy()
    n_poll, n_plant = matrix.shape
    poll_alive = np.ones(n_poll, dtype=bool)
    plant_alive = np.ones(n_plant, dtype=bool)
    results = [{'removed': 0, 'plants_alive': int(np.sum(plant_alive)), 'rewired': 0}]

    for step, poll_idx in enumerate(removal_order):
        if not poll_alive[poll_idx]:
            continue
        poll_alive[poll_idx] = False

        # Identify orphaned plants (before cascade)
        orphaned_plants = []
        for p in range(n_plant):
            if plant_alive[p] and matrix[poll_idx, p] == 1:
                remaining = np.sum(matrix[:, p] * poll_alive)
                if remaining == 0:
                    orphaned_plants.append(p)

        # Rewiring: surviving pollinators may adopt orphaned plants
        rewired_count = 0
        for p in orphaned_plants:
            for b in range(n_poll):
                if poll_alive[b] and matrix[b, p] == 0:
                    # Probability of rewiring proportional to generalism
                    gen_score = np.sum(matrix[b, :]) / n_plant
                    if np.random.random() < rewiring_prob * gen_score:
                        matrix[b, p] = 1
                        rewired_count += 1
                        break

        # Mark truly orphaned plants as extinct
        for p in range(n_plant):
            if plant_alive[p] and np.sum(matrix[:, p] * poll_alive) == 0:
                plant_alive[p] = False

        results.append({
            'removed': step + 1,
            'plants_alive': int(np.sum(plant_alive)),
            'rewired': rewired_count,
        })

    return results

# --- Compare rewiring scenarios ---
order_most = np.argsort(-pollinator_degree)
rewiring_levels = [0.0, 0.3, 0.5, 0.8, 1.0]

# --- Rewiring visualization ---
fig, ax = plt.subplots(1, 1, figsize=(10, 6))
fig.patch.set_facecolor('#0d1117')
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')

rewire_colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981']
for rp, color in zip(rewiring_levels, rewire_colors):
    # Run cascade and plot
    res = cascade_with_rewiring(binary, order_most, rewiring_prob=rp)
    steps = [r['removed'] for r in res]
    plants = [r['plants_alive'] for r in res]
    ax.plot(steps, plants, 'o-', color=color, linewidth=2, markersize=4,
            label=f'Rewiring = {rp:.0%}', alpha=0.8)

ax.axhline(n_plants / 2, color='#f59e0b', linestyle=':', linewidth=1, alpha=0.5)
ax.text(0.5, n_plants / 2 + 0.5, '50% threshold', color='#f59e0b', fontsize=8)
ax.set_xlabel('Pollinators removed (most-connected first)', color='white')
ax.set_ylabel('Plants surviving', color='white')
ax.set_title('Rewiring Reduces Cascade Severity', color='white', fontsize=13, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
plt.tight_layout()
plt.show()

print("=== Network Resilience & Rewiring Analysis ===")
print(f"Network: {n_pollinators} pollinators x {n_plants} plants")
print(f"Removal order: most-connected first (worst case)")

print(f"\\n--- Cascade severity by rewiring probability ---")
print(f"{'Rewiring Prob':>13} {'Plants surviving':>16} {'Plants lost':>12} {'Total rewired':>14}")
print("-" * 58)

scenario_results = {}
for rp in rewiring_levels:
    # Average over multiple runs (rewiring is stochastic)
    surviving_runs = []
    rewired_runs = []
    for _ in range(10):
        res = cascade_with_rewiring(binary, order_most, rewiring_prob=rp)
        final = res[-1]
        surviving_runs.append(final['plants_alive'])
        rewired_runs.append(sum(r['rewired'] for r in res))
    avg_surv = np.mean(surviving_runs)
    avg_rew = np.mean(rewired_runs)
    scenario_results[rp] = avg_surv
    print(f"{rp:>13.1f} {avg_surv:>16.1f} {n_plants - avg_surv:>12.1f} {avg_rew:>14.1f}")

# Improvement from rewiring
no_rewire = scenario_results[0.0]
full_rewire = scenario_results[1.0]
improvement = full_rewire - no_rewire

print(f"\\n--- Rewiring effectiveness ---")
print(f"Without rewiring: {no_rewire:.1f} plants survive")
print(f"Maximum rewiring:  {full_rewire:.1f} plants survive")
print(f"Improvement: +{improvement:.1f} plants saved ({improvement/n_plants*100:.0f}% of total)")

# Identify which pollinators enable the most rewiring
print(f"\\n--- Pollinator rewiring potential ---")
print(f"{'Pollinator':<16} {'Degree':>6} {'Generalism':>11} {'Can adopt?':>10}")
print("-" * 46)
for b in np.argsort(-pollinator_degree):
    gen = pollinator_degree[b] / n_plants
    can_adopt = "HIGH" if gen > 0.4 else "MEDIUM" if gen > 0.2 else "LOW"
    print(f"{pollinator_names[b]:<16} {pollinator_degree[b]:>6} {gen:>11.2f} {can_adopt:>10}")

print(f"\\nManagement insight: protecting generalist pollinators")
print(f"provides both direct pollination AND rewiring insurance.")`,
      challenge: 'Test a targeted wildflower strip that specifically adds plants for the most vulnerable pollinator (lowest degree). Compare to an untargeted strip. Is targeted planting more efficient?',
      successHint: 'Your Pollination Network Analyzer is complete. From network construction through keystone identification, CCD modeling, and resilience engineering — this tool could help agricultural extension officers design pollinator-friendly farming landscapes. The honey hunter\'s lesson, formalized in mathematics.',
    },
    {
      title: 'Capstone Part 5 — Full pollination network assessment dashboard',
      concept: `The final deliverable integrates all analyses into a single assessment dashboard for a landscape manager. Given a pollination network from field survey data, the tool:

1. Constructs and visualizes the bipartite network
2. Computes structural metrics (connectance, nestedness, specialization)
3. Identifies keystone species through removal experiments
4. Simulates CCD scenarios and cascade severity
5. Evaluates rewiring potential and wildflower strip effectiveness
6. Produces management recommendations ranked by cost-effectiveness

This is the tool that answers the practical question: "Given this network of pollinators and plants in my landscape, what should I do to maximize pollination services and minimize collapse risk?"

The output includes a **Network Health Score** (0-100) based on:
- Connectance (higher = better, up to a point)
- Nestedness (higher = more resilient)
- Robustness (from removal experiments)
- Functional redundancy (average pollinators per plant)
- Generalist fraction (proportion of pollinators with above-median degree)`,
      analogy: 'The dashboard is like a medical check-up report. Connectance is blood pressure, nestedness is immune system strength, robustness is stress test performance, and redundancy is organ reserve capacity. The doctor (landscape manager) reads the report and prescribes treatment: "Your network has low redundancy (weak spot) and moderate nestedness (OK). Prescription: plant wildflower strips (increase redundancy) and protect the top 3 keystone pollinators (maintain nestedness)."',
      storyConnection: 'The honey hunter\'s knowledge — which flowers support bees, which trees attract wild pollinators, when to harvest and when to leave honey — is traditional ecological knowledge accumulated over generations. This dashboard is the scientific equivalent: it takes field data and produces the same kind of wisdom, but in a form that can be communicated to policymakers, scaled to landscapes, and tracked over time. The honey hunter\'s lesson becomes a conservation tool.',
      checkQuestion: 'A landscape manager receives a Network Health Score of 45/100. The report says nestedness is low and redundancy is low. They have budget for one intervention. What should they prioritize?',
      checkAnswer: 'Low redundancy is the bigger threat — it means some plants have only 1-2 pollinators and are vulnerable to any loss. Low nestedness means the network lacks the protective structure where generalists back up specialists. The priority should be planting diverse wildflower strips, which simultaneously increases redundancy (new forage for existing pollinators) and can improve nestedness (generalists adopt new plants, creating the nested overlapping structure). One intervention addresses both weaknesses.',
      codeIntro: 'Build the complete Pollination Network Assessment Dashboard with a Network Health Score, combining all analyses into a single decision-support tool.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ============================================
# POLLINATION NETWORK ASSESSMENT DASHBOARD
# Integrates Parts 1-4 into a single tool
# ============================================

# Network data (same as before, would come from field surveys in reality)
n_pollinators = 12
n_plants = 20
pollinator_names = ['Apis mellifera', 'Bombus impatiens', 'Xylocopa', 'Osmia',
                    'Andrena', 'Halictus', 'Megachile', 'Ceratina',
                    'Bombus terrestris', 'Lasioglossum', 'Colletes', 'Nomia']
generalism = np.array([0.85, 0.75, 0.55, 0.45, 0.60, 0.35, 0.40, 0.25, 0.70, 0.30, 0.20, 0.50])

plant_attractiveness = np.random.dirichlet(np.ones(n_plants) * 1.5)
plant_attractiveness /= max(plant_attractiveness)

binary = np.zeros((n_pollinators, n_plants), dtype=int)
for b in range(n_pollinators):
    n_partners = max(1, int(generalism[b] * n_plants * np.random.uniform(0.7, 1.3)))
    probs = plant_attractiveness ** (1 / max(generalism[b], 0.1))
    probs /= np.sum(probs)
    partners = np.random.choice(n_plants, size=min(n_partners, n_plants), replace=False, p=probs)
    for p in partners:
        binary[b, p] = 1
for p in range(n_plants):
    if np.sum(binary[:, p]) == 0:
        binary[np.random.randint(0, n_pollinators), p] = 1

# --- Compute all metrics ---
poll_degree = np.sum(binary, axis=1)
plant_degree = np.sum(binary, axis=0)
connectance = np.sum(binary) / (n_pollinators * n_plants)

# Nestedness
n_r, n_c = binary.shape
nodf_sum = 0
nodf_pairs = 0
for i in range(n_r):
    for j in range(i+1, n_r):
        di, dj = np.sum(binary[i]), np.sum(binary[j])
        if di > 0 and dj > 0 and di != dj:
            overlap = np.sum(binary[i] & binary[j])
            nodf_sum += overlap / min(di, dj)
            nodf_pairs += 1
nestedness = nodf_sum / nodf_pairs if nodf_pairs > 0 else 0

# Robustness (most-connected removal)
def compute_robustness(binary_matrix, removal_order):
    matrix = binary_matrix.copy()
    n_poll, n_plant = matrix.shape
    poll_alive = np.ones(n_poll, dtype=bool)
    plant_alive = np.ones(n_plant, dtype=bool)
    half_plants = n_plant / 2
    for step, idx in enumerate(removal_order):
        poll_alive[idx] = False
        for p in range(n_plant):
            if plant_alive[p] and np.sum(matrix[:, p] * poll_alive) == 0:
                plant_alive[p] = False
        if np.sum(plant_alive) < half_plants:
            return step / n_poll
    return 1.0

order_most = np.argsort(-poll_degree)
order_least = np.argsort(poll_degree)
robustness_most = compute_robustness(binary, order_most)
robustness_least = compute_robustness(binary, order_least)
random_robustness = []
for _ in range(20):
    order_rand = np.random.permutation(n_pollinators)
    random_robustness.append(compute_robustness(binary, order_rand))

# Functional redundancy
redundancy = plant_degree.mean()
generalist_fraction = np.sum(poll_degree > np.median(poll_degree)) / n_pollinators

# --- Network Health Score ---
score_connectance = min(25, connectance / 0.4 * 25)
score_nestedness = min(25, nestedness * 25)
score_robustness = min(25, np.mean(random_robustness) * 25)
score_redundancy = min(25, (redundancy / 5) * 25)
health_score = score_connectance + score_nestedness + score_robustness + score_redundancy

# --- Cascade data for dashboard ---
def run_cascade(matrix, order):
    m = matrix.copy()
    n_p, n_pl = m.shape
    alive = np.ones(n_p, dtype=bool)
    pl_alive = np.ones(n_pl, dtype=bool)
    curve = [int(np.sum(pl_alive))]
    for idx in order:
        alive[idx] = False
        for p in range(n_pl):
            if pl_alive[p] and np.sum(m[:, p] * alive) == 0:
                pl_alive[p] = False
        curve.append(int(np.sum(pl_alive)))
    return curve

cascade_most = run_cascade(binary, order_most)
cascade_least = run_cascade(binary, order_least)

# ============================================
# 4-PANEL DASHBOARD VISUALIZATION
# ============================================
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#0d1117')
fig.suptitle('POLLINATION NETWORK ASSESSMENT DASHBOARD',
             color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: Interaction matrix heatmap (sorted for nestedness)
ax = axes[0, 0]
poll_order = np.argsort(-poll_degree)
plant_order = np.argsort(-plant_degree)
sorted_bin = binary[poll_order][:, plant_order]
ax.imshow(sorted_bin, cmap='YlGn', aspect='auto', interpolation='nearest')
ax.set_xlabel('Plants (by degree)', color='white')
ax.set_ylabel('Pollinators (by degree)', color='white')
ax.set_title(f'Network Structure (C={connectance:.2f}, NODF={nestedness:.2f})',
             color='white', fontsize=10)

# Panel 2: Cascade curves
ax = axes[0, 1]
ax.plot(range(len(cascade_most)), cascade_most, 'o-', color='#ef4444',
        linewidth=2, markersize=4, label='Worst case')
ax.plot(range(len(cascade_least)), cascade_least, 'o-', color='#22c55e',
        linewidth=2, markersize=4, label='Best case')
ax.axhline(n_plants / 2, color='#f59e0b', linestyle=':', alpha=0.5)
ax.set_xlabel('Pollinators removed', color='white')
ax.set_ylabel('Plants surviving', color='white')
ax.set_title(f'Robustness: {np.mean(random_robustness):.2f} (random avg)',
             color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 3: Health Score gauge
ax = axes[1, 0]
categories = ['Connectance', 'Nestedness', 'Robustness', 'Redundancy']
scores = [score_connectance, score_nestedness, score_robustness, score_redundancy]
colors_bar = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7']
bars = ax.barh(categories, scores, color=colors_bar, height=0.6, edgecolor='none')
ax.barh(categories, [25]*4, color='#1f2937', height=0.6, edgecolor='#374151', linewidth=0.5)
ax.barh(categories, scores, color=colors_bar, height=0.6, edgecolor='none')
for i, (s, c) in enumerate(zip(scores, colors_bar)):
    ax.text(s + 0.5, i, f'{s:.0f}/25', va='center', color='white', fontsize=9, fontweight='bold')
ax.set_xlim(0, 28)
ax.set_title(f'HEALTH SCORE: {health_score:.0f}/100', color='white', fontsize=12, fontweight='bold')

# Panel 4: Species vulnerability
ax = axes[1, 1]
vuln_counts = [int(np.sum(plant_degree == 1)), int(np.sum((plant_degree >= 2) & (plant_degree <= 3))),
               int(np.sum(plant_degree >= 4))]
vuln_labels = ['Critical\\n(1 pollinator)', 'At risk\\n(2-3)', 'Resilient\\n(4+)']
vuln_colors = ['#ef4444', '#f59e0b', '#22c55e']
ax.bar(vuln_labels, vuln_counts, color=vuln_colors, edgecolor='none', width=0.5)
for i, v in enumerate(vuln_counts):
    ax.text(i, v + 0.3, str(v), ha='center', color='white', fontsize=12, fontweight='bold')
ax.set_ylabel('Number of plants', color='white')
ax.set_title('Plant Vulnerability', color='white', fontsize=10)

plt.tight_layout()
plt.show()

# --- Text summary ---
print("NETWORK HEALTH SCORE: {:.0f}/100".format(health_score))
print("=" * 40)
print(f"  Connectance:  {score_connectance:>5.1f}/25")
print(f"  Nestedness:   {score_nestedness:>5.1f}/25")
print(f"  Robustness:   {score_robustness:>5.1f}/25")
print(f"  Redundancy:   {score_redundancy:>5.1f}/25")

vulnerable = int(np.sum(plant_degree == 1))
print(f"\\nVulnerable plants: {vulnerable}/{n_plants}")
print(f"Robustness range: {robustness_most:.2f} (worst) to {robustness_least:.2f} (best)")

recommendations = []
if score_redundancy < 15:
    recommendations.append("Plant wildflower strips to increase pollinator diversity")
if score_nestedness < 15:
    recommendations.append("Encourage generalist pollinators for nested overlap")
if score_robustness < 15:
    recommendations.append("Protect top 3 hub pollinators from pesticide exposure")
if vulnerable > n_plants * 0.3:
    recommendations.append(f"URGENT: {vulnerable} plants at critical risk")
if not recommendations:
    recommendations.append("Network is healthy. Maintain current habitat diversity.")
print("\\nRecommendations:")
for i, rec in enumerate(recommendations):
    print(f"  {i+1}. {rec}")`,
      challenge: 'Run the dashboard on a degraded network (remove 30% of interactions randomly to simulate habitat loss). Compare the health scores. How many wildflower strips would you need to add to restore the original health score?',
      successHint: 'You have built a complete, end-to-end Pollination Network Analyzer. From bipartite network construction through keystone identification, CCD modeling, resilience engineering, and management recommendations — this is a publication-quality tool that could serve real conservation and agriculture.',
    },
    {
      title: 'Capstone Part 6 — Complete Foraging Dashboard',
      concept: `The final synthesis combines every piece into one unified foraging dashboard. You have built:

1. **Flower patch placement** (random coordinates on the landscape)
2. **Scout bee discovery** (waggle dance encoding of patch locations)
3. **Follower interpretation** (decoding dances with realistic noise)
4. **Nectar collection tracking** (cumulative yield over time)
5. **Efficiency comparison** (random vs waggle-dance-guided foraging)

Now you bring them together into a **single four-panel visualization**:
- **Top-left**: landscape map showing flower patches, hive, and bee flight paths
- **Top-right**: nectar collection over time (both strategies overlaid)
- **Bottom-left**: foraging efficiency bar chart (random vs guided, with error bars from multiple runs)
- **Bottom-right**: cumulative path length comparison (energy cost of each strategy)

This is how real dashboards work in precision apiculture: multiple data streams displayed simultaneously so a beekeeper can make decisions at a glance. The dashboard answers: "Are my bees foraging efficiently? Which patches are underexploited? Is the waggle dance communication working well?"`,
      analogy: 'A foraging dashboard is like an air traffic control screen. The controller sees the map (where planes are), the schedule (arrivals over time), the fuel status (efficiency), and the path history (distance traveled). No single panel tells the full story — the controller needs all four to make safe decisions. Your dashboard gives the beekeeper the same situational awareness over foraging operations.',
      storyConnection: 'The honey hunter reads the landscape the way this dashboard reads data: watching where bees fly, estimating which patches yield the most nectar, deciding when to harvest. The dashboard is a digital version of the hunter\'s lifetime of observation — compressed into a single screen that any beekeeper can use on day one.',
      checkQuestion: 'Your dashboard shows that guided foraging collects 40% more nectar but travels 20% farther than random foraging. Is guided foraging more efficient?',
      checkAnswer: 'Yes, but you need to define efficiency carefully. Nectar per trip: guided wins (more nectar per visit because bees target rich patches). Nectar per meter traveled: guided collects 40% more nectar for only 20% more distance, so nectar-per-meter is still ~17% higher. Energy efficiency (nectar minus flight cost): depends on the energy cost of flying, but guided still wins because the extra nectar far outweighs the extra flight cost. The dashboard should display all three metrics so the beekeeper can choose the right optimization target.',
      codeIntro: 'Build a four-panel foraging dashboard that combines the landscape map, nectar collection graph, efficiency comparison, and path-length analysis into a single unified visualization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Landscape setup ---
n_patches = 8
patch_x = np.random.uniform(0, 100, n_patches)
patch_y = np.random.uniform(0, 100, n_patches)
patch_nectar = np.random.uniform(5, 30, n_patches)
hive_x, hive_y = 50.0, 50.0

# --- Simulate foraging: random vs waggle-guided ---
n_bees = 20
n_steps = 50
n_runs = 10

def forage(guided=False, noise_std=5.0):
    nectar_over_time = np.zeros(n_steps)
    total_dist = 0.0
    paths_x, paths_y = [], []
    for step in range(n_steps):
        if guided:
            # Pick richest patch with noisy direction
            target = np.argmax(patch_nectar)
            tx = patch_x[target] + np.random.normal(0, noise_std)
            ty = patch_y[target] + np.random.normal(0, noise_std)
        else:
            tx = np.random.uniform(0, 100)
            ty = np.random.uniform(0, 100)
        dist_to_target = np.sqrt((tx - hive_x)**2 + (ty - hive_y)**2)
        total_dist += dist_to_target * 2
        # Nectar collected = nearby patch yield (if within 10 units)
        for j in range(n_patches):
            d = np.sqrt((tx - patch_x[j])**2 + (ty - patch_y[j])**2)
            if d < 10:
                nectar_over_time[step] += patch_nectar[j] * (1 - d/10)
        paths_x.append(tx)
        paths_y.append(ty)
    return np.cumsum(nectar_over_time), total_dist, paths_x, paths_y

# Multiple runs for error bars
random_totals, guided_totals = [], []
random_dists, guided_dists = [], []
for _ in range(n_runs):
    rn, rd, _, _ = forage(guided=False)
    gn, gd, _, _ = forage(guided=True)
    random_totals.append(rn[-1])
    guided_totals.append(gn[-1])
    random_dists.append(rd)
    guided_dists.append(gd)

# Single run for path visualization
r_nectar, r_dist, r_px, r_py = forage(guided=False)
g_nectar, g_dist, g_px, g_py = forage(guided=True)

# ============================================
# FOUR-PANEL FORAGING DASHBOARD
# ============================================
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#0d1117')
fig.suptitle('FORAGING DASHBOARD — Random vs Waggle-Guided', color='white', fontsize=14, fontweight='bold')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Panel 1: Landscape map with flight paths
ax = axes[0, 0]
ax.scatter(patch_x, patch_y, s=patch_nectar * 15, c='#22c55e', alpha=0.7, edgecolors='white', linewidths=0.5, zorder=5, label='Flower patches')
ax.plot(hive_x, hive_y, '*', color='#f59e0b', markersize=18, zorder=10, label='Hive')
for i in range(min(20, n_steps)):
    ax.plot([hive_x, r_px[i]], [hive_y, r_py[i]], '-', color='#ef4444', alpha=0.15, linewidth=0.5)
    ax.plot([hive_x, g_px[i]], [hive_y, g_py[i]], '-', color='#3b82f6', alpha=0.15, linewidth=0.5)
ax.scatter(r_px[:20], r_py[:20], s=8, c='#ef4444', alpha=0.4, label='Random visits')
ax.scatter(g_px[:20], g_py[:20], s=8, c='#3b82f6', alpha=0.4, label='Guided visits')
ax.set_xlim(-5, 105)
ax.set_ylim(-5, 105)
ax.set_xlabel('X (m)', color='white')
ax.set_ylabel('Y (m)', color='white')
ax.set_title('Landscape & Flight Paths', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')

# Panel 2: Nectar collection over time
ax = axes[0, 1]
steps = np.arange(n_steps)
ax.plot(steps, r_nectar, '-', color='#ef4444', linewidth=2, label='Random')
ax.plot(steps, g_nectar, '-', color='#3b82f6', linewidth=2, label='Guided')
ax.fill_between(steps, r_nectar, g_nectar, where=g_nectar > r_nectar, color='#3b82f6', alpha=0.1)
ax.set_xlabel('Foraging step', color='white')
ax.set_ylabel('Cumulative nectar', color='white')
ax.set_title('Nectar Collection Over Time', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Panel 3: Efficiency bar chart with error bars
ax = axes[1, 0]
means = [np.mean(random_totals), np.mean(guided_totals)]
stds = [np.std(random_totals), np.std(guided_totals)]
bars = ax.bar(['Random', 'Guided'], means, yerr=stds, color=['#ef4444', '#3b82f6'],
              edgecolor='none', capsize=8, width=0.5)
for bar, val in zip(bars, means):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + stds[means.index(val)] + 5,
            f'{val:.0f}', ha='center', color='white', fontsize=11, fontweight='bold')
ax.set_ylabel('Total nectar collected', color='white')
ax.set_title('Foraging Efficiency', color='white', fontsize=11)

# Panel 4: Cumulative path length
ax = axes[1, 1]
r_path_cum = np.cumsum([np.sqrt((r_px[i]-hive_x)**2 + (r_py[i]-hive_y)**2)*2 for i in range(n_steps)])
g_path_cum = np.cumsum([np.sqrt((g_px[i]-hive_x)**2 + (g_py[i]-hive_y)**2)*2 for i in range(n_steps)])
ax.plot(steps, r_path_cum, '-', color='#ef4444', linewidth=2, label=f'Random ({r_dist:.0f} total)')
ax.plot(steps, g_path_cum, '-', color='#3b82f6', linewidth=2, label=f'Guided ({g_dist:.0f} total)')
ax.set_xlabel('Foraging step', color='white')
ax.set_ylabel('Cumulative distance', color='white')
ax.set_title('Energy Cost (Path Length)', color='white', fontsize=11)
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

# --- Text summary ---
print("FORAGING DASHBOARD — Summary")
print("=" * 45)

print(f"\\n--- Landscape ---")
print(f"Hive at ({hive_x:.0f}, {hive_y:.0f}), {n_patches} flower patches")
for i in range(n_patches):
    print(f"  Patch {i+1}: ({patch_x[i]:.0f}, {patch_y[i]:.0f})  nectar={patch_nectar[i]:.1f}")

print(f"\\n--- Nectar Collection ({n_runs} runs, {n_steps} steps each) ---")
print(f"Random foraging:  {np.mean(random_totals):.0f} +/- {np.std(random_totals):.0f} units")
print(f"Guided foraging:  {np.mean(guided_totals):.0f} +/- {np.std(guided_totals):.0f} units")
guided_advantage = np.mean(guided_totals) / np.mean(random_totals)
print(f"Guided advantage: {guided_advantage:.1%} more nectar")

print(f"\\n--- Path Distance (energy cost) ---")
print(f"Random total distance:  {np.mean(random_dists):.0f} +/- {np.std(random_dists):.0f} units")
print(f"Guided total distance:  {np.mean(guided_dists):.0f} +/- {np.std(guided_dists):.0f} units")
dist_ratio = np.mean(guided_dists) / np.mean(random_dists)
print(f"Guided travels: {dist_ratio:.1%} of random distance")

print(f"\\n--- Efficiency (nectar per unit distance) ---")
random_eff = np.mean(random_totals) / np.mean(random_dists)
guided_eff = np.mean(guided_totals) / np.mean(guided_dists)
print(f"Random efficiency:  {random_eff:.4f} nectar/distance")
print(f"Guided efficiency:  {guided_eff:.4f} nectar/distance")
print(f"Efficiency gain:    {guided_eff / random_eff:.1%}")

print(f"\\n--- Single-run path analysis ---")
print(f"Random: visited {len(set(zip(r_px, r_py)))} unique locations, final nectar: {r_nectar[-1]:.0f}")
print(f"Guided: visited {len(set(zip(g_px, g_py)))} unique locations, final nectar: {g_nectar[-1]:.0f}")

# Nectar over time comparison
print(f"\\n--- Cumulative nectar over time (every 10 steps) ---")
print(f"{'Step':>6} {'Random':>10} {'Guided':>10} {'Guided lead':>12}")
print("-" * 40)
for s in range(0, n_steps, 10):
    lead = g_nectar[s] - r_nectar[s]
    print(f"{s:>6} {r_nectar[s]:>10.0f} {g_nectar[s]:>10.0f} {lead:>+12.0f}")
print(f"{n_steps-1:>6} {r_nectar[-1]:>10.0f} {g_nectar[-1]:>10.0f} {g_nectar[-1]-r_nectar[-1]:>+12.0f}")

print(f"\\nConclusion: Waggle dance communication gives {guided_advantage:.0%} more")
print(f"nectar at {guided_eff/random_eff:.0%} better energy efficiency.")
print(f"The colony is smarter than any individual bee.")`,
      challenge: 'Add a fifth panel that shows a heatmap of patch visit frequency across all runs. Which patches are over-visited by guided bees and which are neglected? Propose a multi-target waggle dance strategy that balances exploitation of rich patches with exploration of undervisited ones.',
      successHint: 'Your four-panel foraging dashboard is a complete decision-support tool. Real precision apiculture systems use similar dashboards — combining GPS-tracked flight data, nectar flow sensors, and hive weight data — to optimize colony placement and foraging efficiency across landscapes.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone — Pollination Network Analyzer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (pollination ecology)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete Pollination Network Analyzer using Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={[BeeMonitoringDiagram, BeePathOptimizationDiagram, BeeDiseaseDetectionDiagram, BeePollinationNetworkDiagram, BeeConservationPlanDiagram, BeeDataDashboardDiagram][i] ? createElement([BeeMonitoringDiagram, BeePathOptimizationDiagram, BeeDiseaseDetectionDiagram, BeePollinationNetworkDiagram, BeeConservationPlanDiagram, BeeDataDashboardDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
