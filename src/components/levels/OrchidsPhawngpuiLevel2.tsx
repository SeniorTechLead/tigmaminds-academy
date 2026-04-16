import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function OrchidsPhawngpuiLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Mapping pollinator networks',
      concept: `A **pollination network** is a bipartite graph connecting plants to their pollinators. Plotting this network reveals:

- **Generalist** species: many connections (hubs in the network)
- **Specialist** species: few connections (vulnerable to partner loss)
- **Nestedness**: specialists tend to interact with generalists (a stabilizing pattern)
- **Modularity**: clusters of tightly interacting species

Network metrics:
- **Connectance**: fraction of possible links that actually exist
- **Specialization (H2')**: how exclusive the interactions are
- **Robustness**: how many species can be lost before the network collapses

📚 *matplotlib can draw network-like visualizations using scatter plots and line segments. We represent the bipartite network as a matrix and plot it as a heatmap.*`,
      analogy: 'A pollination network is like a social network. Generalist flowers are like popular people with many friends. Specialist orchids are like someone with only one close friend. If that one friend moves away (pollinator extinction), the specialist has no connections left. But the generalist barely notices losing one friend among dozens.',
      storyConnection: 'Phawngpui\'s pollination network includes dozens of orchid species, hundreds of insect species, and thousands of individual interactions. Some orchid species are embedded in dense networks (safe). Others hang by a single thread — one pollinator species. Mapping this network reveals which orchids are most vulnerable to climate change.',
      checkQuestion: 'Why are nested pollination networks more stable than random ones?',
      checkAnswer: 'In a nested network, specialists interact with generalist partners (which are unlikely to go extinct because they have many food sources). Random extinction removes mostly rare species, which have generalist partners that continue pollinating. The network degrades gracefully. A random network has no such buffer — any extinction can disconnect a specialist.',
      codeIntro: 'Build and visualize a pollination network for the orchids of Phawngpui.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

np.random.seed(42)

# Species
orchids = ['Dendrobium', 'Vanda', 'Aerides', 'Bulbophyllum', 'Coelogyne',
           'Paphiopedilum', 'Phalaenopsis', 'Cymbidium', 'Eria', 'Calanthe']
pollinators = ['Honeybee', 'Carpenter bee', 'Hawk moth', 'Sphinx moth',
               'Swallowtail', 'Skipper', 'Hover fly', 'Beetle spp.',
               'Wasp', 'Ant', 'Fruit bat', 'Sunbird']

n_orchids = len(orchids)
n_pollinators = len(pollinators)

# Generate interaction matrix (nested structure)
matrix = np.zeros((n_orchids, n_pollinators))
for i in range(n_orchids):
    # Generalist orchids interact with many pollinators
    n_partners = max(1, n_pollinators - i * 1)
    partners = np.random.choice(n_pollinators, min(n_partners, n_pollinators), replace=False)
    for j in partners:
        matrix[i, j] = np.random.uniform(0.1, 1.0)

# Sort for visual nestedness
row_sums = matrix.sum(axis=1)
col_sums = matrix.sum(axis=0)
matrix = matrix[np.argsort(-row_sums)]
orchids_sorted = [orchids[i] for i in np.argsort(-row_sums)]
matrix = matrix[:, np.argsort(-col_sums)]
pollinators_sorted = [pollinators[i] for i in np.argsort(-col_sums)]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Interaction matrix heatmap
ax1.set_facecolor('#1f2937')
im = ax1.imshow(matrix, cmap='YlOrRd', aspect='auto', interpolation='nearest')
plt.colorbar(im, ax=ax1, label='Interaction strength', shrink=0.8)
ax1.set_xticks(range(n_pollinators))
ax1.set_xticklabels([p[:6] for p in pollinators_sorted], rotation=45, ha='right', fontsize=8, color='lightgray')
ax1.set_yticks(range(n_orchids))
ax1.set_yticklabels(orchids_sorted, fontsize=8, color='lightgray')
ax1.set_title('Pollination Network Matrix', color='white', fontsize=13, fontweight='bold')

# Network metrics
connectance = np.sum(matrix > 0) / (n_orchids * n_pollinators)
specialization = []
for i in range(n_orchids):
    row = matrix[i]
    if row.sum() > 0:
        p = row / row.sum()
        H = -np.sum(p[p > 0] * np.log(p[p > 0]))
        specialization.append(1 - H / np.log(n_pollinators))

# Degree distribution
ax2.set_facecolor('#1f2937')
orchid_degrees = (matrix > 0).sum(axis=1)
poll_degrees = (matrix > 0).sum(axis=0)

x = np.arange(max(max(orchid_degrees), max(poll_degrees)) + 1)
orchid_hist = np.bincount(orchid_degrees.astype(int), minlength=len(x))
poll_hist = np.bincount(poll_degrees.astype(int), minlength=len(x))

width = 0.35
ax2.bar(x - width/2, orchid_hist[:len(x)], width, color='#34d399', label='Orchids')
ax2.bar(x + width/2, poll_hist[:len(x)], width, color='#fbbf24', label='Pollinators')
ax2.set_xlabel('Number of partners (degree)', color='lightgray', fontsize=12)
ax2.set_ylabel('Number of species', color='lightgray', fontsize=12)
ax2.set_title('Degree Distribution', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/orchid_network.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print(f"Network metrics:")
print(f"  Species: {n_orchids} orchids, {n_pollinators} pollinators")
print(f"  Connectance: {connectance:.3f} ({connectance*100:.1f}%)")
print(f"  Avg orchid partners: {orchid_degrees.mean():.1f}")
print(f"  Avg pollinator partners: {poll_degrees.mean():.1f}")
print(f"  Avg specialization: {np.mean(specialization):.3f}")
print(f"\
Most specialized orchid: {orchids_sorted[np.argmax(specialization)]}")
print(f"Most generalist orchid: {orchids_sorted[np.argmin(specialization)]}")`,
      challenge: 'Simulate the removal of the most-connected pollinator (honeybee). How many orchid species lose all their pollinators? Now remove random pollinators one by one and plot the number of "orphaned" orchids vs. number removed. This is network robustness analysis.',
      successHint: 'You built a pollination network visualization — the standard tool for community ecology. These networks reveal hidden vulnerabilities: specialist orchids depend on specific pollinators whose loss could trigger cascading extinctions.',
    },
    {
      title: 'Scent chemistry — volatile compound analysis',
      concept: `Orchid scents are complex mixtures of **volatile organic compounds** (VOCs). A single orchid species might produce 20-50 different chemicals, each at a specific concentration.

Common orchid VOCs:
- **Terpenoids** (linalool, geraniol): sweet, floral scents attracting bees
- **Benzenoids** (benzaldehyde, methyl salicylate): spicy, aromatic
- **Fatty acid derivatives** (hexanal): green, leafy
- **Nitrogen compounds** (indole): musky, attracting flies

The **scent bouquet** (relative proportions) is more important than any single compound. Different pollinators respond to different bouquets.

Gas chromatography-mass spectrometry (GC-MS) data can be plotted as a **chromatogram**: peaks at different retention times, with height proportional to concentration.

📚 *matplotlib bar charts with multiple series visualize scent profiles. We use stacked bars to show the relative composition of complex mixtures.*`,
      analogy: 'Orchid scent is like a perfume — not a single chemical but a carefully crafted blend. Just as a perfumer balances top notes, middle notes, and base notes, an orchid balances volatile compounds to create a specific "message" for its target pollinator. Change one ingredient and the message changes — attracting a different pollinator or none at all.',
      storyConnection: 'Phawngpui orchids produce an astounding variety of scents. Some smell sweet to attract bees, others smell like rotting meat to attract flies, and some mimic insect pheromones to deceive male moths. Each scent is a chemical masterpiece tuned by millions of years of coevolution.',
      checkQuestion: 'Why would an orchid evolve to smell like rotting meat?',
      checkAnswer: 'Flies lay eggs on decaying organic matter. An orchid that smells like carrion attracts flies looking for egg-laying sites. The fly lands, does not find suitable material, but picks up pollen in the process. When it visits another "rotting meat" orchid, cross-pollination occurs. The orchid exploits the fly\'s reproductive instinct without providing any reward.',
      codeIntro: 'Analyze and compare scent profiles of different Phawngpui orchid species.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Scent profiles (relative abundance of compound classes)
orchid_scents = {
    'Dendrobium (bee)': {
        'Linalool': 35, 'Geraniol': 20, 'β-Ocimene': 15,
        'Benzaldehyde': 10, 'Methyl salicylate': 8, 'Indole': 2,
        'Hexanal': 5, '1-Octen-3-ol': 5
    },
    'Bulbophyllum (fly)': {
        'Linalool': 2, 'Geraniol': 1, 'β-Ocimene': 3,
        'Benzaldehyde': 5, 'Methyl salicylate': 3, 'Indole': 40,
        'Hexanal': 15, '1-Octen-3-ol': 31
    },
    'Aerides (moth)': {
        'Linalool': 45, 'Geraniol': 15, 'β-Ocimene': 20,
        'Benzaldehyde': 8, 'Methyl salicylate': 5, 'Indole': 3,
        'Hexanal': 2, '1-Octen-3-ol': 2
    },
    'Coelogyne (beetle)': {
        'Linalool': 5, 'Geraniol': 3, 'β-Ocimene': 5,
        'Benzaldehyde': 25, 'Methyl salicylate': 20, 'Indole': 15,
        'Hexanal': 12, '1-Octen-3-ol': 15
    },
}

compounds = list(list(orchid_scents.values())[0].keys())
n_compounds = len(compounds)
n_orchids = len(orchid_scents)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Stacked bar chart
ax1.set_facecolor('#1f2937')
colors = ['#34d399', '#22d3ee', '#60a5fa', '#a78bfa', '#f472b6', '#fb923c', '#fbbf24', '#f87171']
x = np.arange(n_orchids)
bottom = np.zeros(n_orchids)

for i, compound in enumerate(compounds):
    values = [orchid_scents[o][compound] for o in orchid_scents]
    ax1.bar(x, values, bottom=bottom, color=colors[i], label=compound, width=0.6)
    bottom += values

ax1.set_xticks(x)
ax1.set_xticklabels([o.split('(')[0].strip() for o in orchid_scents], fontsize=9, color='lightgray')
ax1.set_ylabel('Relative abundance (%)', color='lightgray')
ax1.set_title('Orchid Scent Profiles', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=7, loc='upper right')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Similarity matrix (cosine similarity)
ax2.set_facecolor('#1f2937')
profiles = np.array([[orchid_scents[o][c] for c in compounds] for o in orchid_scents])
norms = np.linalg.norm(profiles, axis=1, keepdims=True)
similarity = profiles @ profiles.T / (norms @ norms.T)

im = ax2.imshow(similarity, cmap='YlGn', vmin=0, vmax=1)
plt.colorbar(im, ax=ax2, label='Cosine similarity')
names = [o.split('(')[0].strip() for o in orchid_scents]
ax2.set_xticks(range(n_orchids))
ax2.set_xticklabels(names, rotation=45, ha='right', fontsize=9, color='lightgray')
ax2.set_yticks(range(n_orchids))
ax2.set_yticklabels(names, fontsize=9, color='lightgray')
ax2.set_title('Scent Similarity Matrix', color='white', fontsize=13, fontweight='bold')

plt.tight_layout()
plt.savefig('/tmp/orchid_scent.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("Scent similarity analysis:")
for i in range(n_orchids):
    for j in range(i+1, n_orchids):
        print(f"  {names[i]} vs {names[j]}: {similarity[i,j]:.3f}")

# Pollinator prediction from scent
print("\
Dominant compound → predicted pollinator:")
for o, profile in orchid_scents.items():
    dominant = max(profile, key=profile.get)
    if dominant in ['Linalool', 'Geraniol', 'β-Ocimene']:
        pred = "bee/moth"
    elif dominant in ['Indole', '1-Octen-3-ol']:
        pred = "fly"
    else:
        pred = "beetle/generalist"
    print(f"  {o}: dominant={dominant} ({profile[dominant]}%) → {pred}")`,
      challenge: 'Add a "pollinator preference" model: each pollinator has an ideal scent profile. Calculate which orchid best matches each pollinator. Does the chemical matching predict the actual pollinator relationships observed in the field?',
      successHint: 'You analyzed orchid scent chemistry using the same data visualization techniques that analytical chemists use with real GC-MS data. Scent analysis reveals the hidden chemical conversations between orchids and their pollinators — an invisible world of molecular signaling.',
    },
    {
      title: 'Speciation — how one orchid becomes two',
      concept: `**Speciation** is the process by which one species splits into two. For orchids, the main mechanism is **pollinator-mediated speciation**:

1. A population of orchids grows on two sides of a mountain
2. Different pollinators are available on each side
3. Each sub-population evolves to attract its local pollinator
4. After many generations, the two populations can no longer cross-pollinate
5. They are now separate species

The mathematical model:
\`Reproductive isolation = 1 - (pollinator overlap × trait overlap)\`

When reproductive isolation reaches ~0.95, the populations are effectively separate species.

📚 *We simulate speciation by tracking two diverging populations. numpy random sampling models the genetic drift and selection that drive divergence.*`,
      analogy: 'Speciation is like two branches of a family that move to different countries. At first, they speak the same language and can communicate easily. Over generations, each branch develops local slang, accent, and eventually a distinct language. After enough time, they can no longer understand each other — they have become separate "species" of speakers.',
      storyConnection: 'Phawngpui sits at the junction of Indo-Burmese biogeographic zones. Its elevation gradient creates micro-habitats with different pollinators at different altitudes. This environmental mosaic has driven speciation: orchids at 1000m evolved for butterflies while their relatives at 2000m evolved for moths, becoming separate species.',
      checkQuestion: 'Why is pollinator-mediated speciation faster than geographic speciation for orchids?',
      checkAnswer: 'In geographic speciation, populations must be physically separated (by a river, mountain, etc.) for millions of years. In pollinator-mediated speciation, two orchids growing side by side can diverge if they attract different pollinators — because cross-pollination between them drops to zero. Reproductive isolation occurs without geographic isolation, accelerating the process.',
      codeIntro: 'Simulate pollinator-mediated speciation in orchids on Blue Mountain.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

np.random.seed(42)
generations = 300

# Two populations starting identical
n_pop = 100  # individuals per population
trait_dim = 3  # scent components

# Initial trait values (both populations identical)
pop_A = np.random.normal(0.5, 0.05, (n_pop, trait_dim))
pop_B = np.random.normal(0.5, 0.05, (n_pop, trait_dim))

# Pollinator preferences (different for each population)
poll_A_target = np.array([0.8, 0.3, 0.5])  # bee preference
poll_B_target = np.array([0.3, 0.8, 0.6])  # moth preference

divergence_history = []
isolation_history = []

for gen in range(generations):
    # Selection: individuals closer to local pollinator preference survive better
    for pop, target in [(pop_A, poll_A_target), (pop_B, poll_B_target)]:
        distances = np.linalg.norm(pop - target, axis=1)
        fitness = np.exp(-distances * 3)  # exponential fitness
        fitness /= fitness.sum()

        # Select next generation (with replacement)
        parents = np.random.choice(n_pop, n_pop, p=fitness)
        pop[:] = pop[parents]

        # Mutation
        pop += np.random.normal(0, 0.01, pop.shape)
        pop = np.clip(pop, 0, 1)

    # Measure divergence
    mean_A = pop_A.mean(axis=0)
    mean_B = pop_B.mean(axis=0)
    divergence = np.linalg.norm(mean_A - mean_B)
    divergence_history.append(divergence)

    # Reproductive isolation estimate
    # Based on trait overlap (how similar the populations are)
    trait_overlap = np.exp(-divergence * 5)
    isolation = 1 - trait_overlap
    isolation_history.append(isolation)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Divergence over time
ax1.set_facecolor('#1f2937')
ax1.plot(divergence_history, color='#f87171', linewidth=2.5, label='Trait divergence')
ax1.set_xlabel('Generation', color='lightgray', fontsize=12)
ax1.set_ylabel('Trait distance', color='lightgray', fontsize=12)
ax1.set_title('Population Divergence Over Time', color='white', fontsize=13, fontweight='bold')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Reproductive isolation
ax2.set_facecolor('#1f2937')
ax2.plot(isolation_history, color='#34d399', linewidth=2.5)
ax2.axhline(0.95, color='#fbbf24', linestyle='--', label='Speciation threshold (95%)')
ax2.fill_between(range(len(isolation_history)), isolation_history,
                  where=[i > 0.95 for i in isolation_history],
                  alpha=0.2, color='#fbbf24')
ax2.set_xlabel('Generation', color='lightgray', fontsize=12)
ax2.set_ylabel('Reproductive isolation', color='lightgray', fontsize=12)
ax2.set_title('Reproductive Isolation', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax2.set_ylim(0, 1.05)
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/orchid_speciation.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

spec_gen = next((i for i, iso in enumerate(isolation_history) if iso > 0.95), None)
print(f"Speciation (95% isolation) reached at generation: {spec_gen}")
print(f"\
Final population traits:")
print(f"  Pop A (bee-adapted): {pop_A.mean(axis=0).round(3)}")
print(f"  Pop B (moth-adapted): {pop_B.mean(axis=0).round(3)}")
print(f"  Target A (bee): {poll_A_target}")
print(f"  Target B (moth): {poll_B_target}")
print(f"  Final divergence: {divergence_history[-1]:.3f}")
print(f"  Final isolation: {isolation_history[-1]:.3f}")`,
      challenge: 'What if there is occasional gene flow (migration) between the two populations — say 2% of individuals migrate each generation? How does this slow speciation? At what migration rate does speciation become impossible?',
      successHint: 'You simulated speciation in action — one of the most important processes in evolutionary biology. Pollinator-mediated speciation explains the explosive diversity of orchids: the family with ~28,000 species, more than any other plant family.',
    },
    {
      title: 'Conservation modeling — orchid vulnerability',
      concept: `Orchid conservation requires understanding vulnerability — which species face the greatest extinction risk?

Key vulnerability factors:
- **Range size**: small range = high vulnerability
- **Population size**: small population = genetic drift, inbreeding
- **Pollinator specialization**: few pollinators = high dependence
- **Habitat specificity**: narrow requirements = sensitive to change
- **Climate sensitivity**: temperature-dependent flowering

The **IUCN Red List** criteria combine these factors into threat categories:
- Critically Endangered (CR): >50% decline in 10 years
- Endangered (EN): >30% decline
- Vulnerable (VU): >20% decline

We can model future population trends by combining climate projections, habitat loss data, and pollinator decline rates.

📚 *Combining multiple factors into a vulnerability index requires normalization (scaling each factor to 0-1) and weighted averaging. matplotlib creates informative multi-factor visualizations.*`,
      analogy: 'Conservation vulnerability assessment is like a medical checkup for species. You measure multiple vital signs (population size, habitat, pollinators), compare each to healthy baselines, and combine them into an overall health score. Species with many "abnormal" readings are at highest risk — like patients with multiple risk factors.',
      storyConnection: 'Phawngpui is home to several orchid species found nowhere else on Earth. These endemic species, with tiny ranges and specific pollinators, are among the most vulnerable plants in India. Climate change, deforestation, and orchid poaching threaten them simultaneously. Conservation modeling helps prioritize which species need protection most urgently.',
      checkQuestion: 'Why is a specialist orchid more vulnerable to climate change than a generalist?',
      checkAnswer: 'A specialist depends on one pollinator that may shift its range, timing, or abundance with climate change. If the orchid and pollinator respond differently to warming (e.g., the orchid flowers earlier but the moth does not emerge earlier), they become desynchronized — the flower opens when no pollinator is available. Generalists with many pollinators are buffered against any single partner\'s shift.',
      codeIntro: 'Model vulnerability scores for Phawngpui orchids and predict extinction risk.',
      code: `import numpy as np
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt

# Orchid species vulnerability assessment
orchids = {
    'Dendrobium chrysanthum': {
        'range_km2': 500, 'population': 10000, 'pollinators': 5,
        'habitat_types': 3, 'climate_sensitivity': 0.3, 'endemic': False
    },
    'Vanda coerulea': {
        'range_km2': 200, 'population': 3000, 'pollinators': 2,
        'habitat_types': 1, 'climate_sensitivity': 0.6, 'endemic': False
    },
    'Paphiopedilum villosum': {
        'range_km2': 80, 'population': 500, 'pollinators': 1,
        'habitat_types': 1, 'climate_sensitivity': 0.8, 'endemic': True
    },
    'Coelogyne cristata': {
        'range_km2': 1000, 'population': 50000, 'pollinators': 8,
        'habitat_types': 4, 'climate_sensitivity': 0.2, 'endemic': False
    },
    'Phawngpui orchid sp.': {
        'range_km2': 15, 'population': 200, 'pollinators': 1,
        'habitat_types': 1, 'climate_sensitivity': 0.9, 'endemic': True
    },
    'Aerides odorata': {
        'range_km2': 800, 'population': 20000, 'pollinators': 4,
        'habitat_types': 3, 'climate_sensitivity': 0.4, 'endemic': False
    },
}

def vulnerability_score(sp):
    """Calculate 0-1 vulnerability score (higher = more vulnerable)."""
    v_range = 1 - min(sp['range_km2'] / 1000, 1)
    v_pop = 1 - min(sp['population'] / 50000, 1)
    v_poll = 1 - min(sp['pollinators'] / 8, 1)
    v_hab = 1 - min(sp['habitat_types'] / 4, 1)
    v_clim = sp['climate_sensitivity']
    v_endem = 0.3 if sp['endemic'] else 0

    total = (0.2 * v_range + 0.2 * v_pop + 0.2 * v_poll +
             0.15 * v_hab + 0.15 * v_clim + 0.1 * v_endem)
    return total

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#111827')

# Vulnerability scores
names = list(orchids.keys())
short_names = [n.split('(')[0][:15] for n in names]
scores = [vulnerability_score(orchids[n]) for n in names]

colors = ['#f87171' if s > 0.7 else '#fbbf24' if s > 0.5 else '#34d399' for s in scores]
sorted_idx = np.argsort(scores)[::-1]

ax1.set_facecolor('#1f2937')
ax1.barh([short_names[i] for i in sorted_idx], [scores[i] for i in sorted_idx],
          color=[colors[i] for i in sorted_idx], edgecolor='none', height=0.6)
ax1.axvline(0.7, color='#f87171', linestyle='--', alpha=0.7, label='Critical')
ax1.axvline(0.5, color='#fbbf24', linestyle='--', alpha=0.7, label='Endangered')
ax1.set_xlabel('Vulnerability Score', color='lightgray', fontsize=12)
ax1.set_title('Orchid Vulnerability Assessment', color='white', fontsize=13, fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray')
ax1.tick_params(colors='lightgray')
for s in ax1.spines.values(): s.set_color('#374151')

# Factor breakdown for top 3 most vulnerable
ax2.set_facecolor('#1f2937')
top3 = [names[i] for i in sorted_idx[:3]]
factors = ['Range', 'Population', 'Pollinators', 'Habitat', 'Climate', 'Endemic']
x = np.arange(len(factors))
width = 0.25

for idx, (name, color) in enumerate(zip(top3, ['#f87171', '#fb923c', '#fbbf24'])):
    sp = orchids[name]
    vals = [
        1 - min(sp['range_km2']/1000, 1),
        1 - min(sp['population']/50000, 1),
        1 - min(sp['pollinators']/8, 1),
        1 - min(sp['habitat_types']/4, 1),
        sp['climate_sensitivity'],
        0.3 if sp['endemic'] else 0
    ]
    ax2.bar(x + idx * width, vals, width, color=color, label=name[:15])

ax2.set_xticks(x + width)
ax2.set_xticklabels(factors, fontsize=9, color='lightgray')
ax2.set_ylabel('Factor vulnerability (0-1)', color='lightgray')
ax2.set_title('Vulnerability Factor Breakdown', color='white', fontsize=13, fontweight='bold')
ax2.legend(facecolor='#1f2937', edgecolor='#374151', labelcolor='lightgray', fontsize=8)
ax2.tick_params(colors='lightgray')
for s in ax2.spines.values(): s.set_color('#374151')

plt.tight_layout()
plt.savefig('/tmp/orchid_conservation.png', dpi=100, bbox_inches='tight', facecolor='#111827')
plt.show()

print("CONSERVATION PRIORITY LIST")
print("=" * 60)
print(f"{'Species':<28} {'Score':>6} {'Status':<15} {'Action'}")
print("-" * 75)
for i in sorted_idx:
    s = scores[i]
    status = "CRITICAL" if s > 0.7 else "ENDANGERED" if s > 0.5 else "LEAST CONCERN"
    action = "Immediate" if s > 0.7 else "Monitor" if s > 0.5 else "Routine"
    print(f"{names[i]:<28} {s:>6.3f} {status:<15} {action}")`,
      challenge: 'Project vulnerability 50 years forward with 2°C warming (increase climate sensitivity by 30%), 20% habitat loss (reduce range and habitat types), and 30% pollinator decline. Which species cross the critical threshold? This is climate change impact modeling.',
      successHint: 'You built a conservation vulnerability model — the same approach used by IUCN to prioritize species protection worldwide. For the orchids of Phawngpui, this quantitative analysis reveals which species need urgent protection and which factors to target for maximum conservation impact.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualizing Pollination Ecology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
