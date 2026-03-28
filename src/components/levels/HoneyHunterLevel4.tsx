import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function HoneyHunterLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

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

# Generalism: how many plants each pollinator visits
generalism = np.array([0.85, 0.75, 0.55, 0.45, 0.60, 0.35,
                        0.40, 0.25, 0.70, 0.30, 0.20, 0.50])

# Plant attractiveness (some plants are more rewarding)
plant_attractiveness = np.random.dirichlet(np.ones(n_plants) * 1.5)
plant_attractiveness = plant_attractiveness / max(plant_attractiveness)

# Generate nested interaction matrix with weighted interactions
interaction = np.zeros((n_pollinators, n_plants))
for b in range(n_pollinators):
    n_partners = max(1, int(generalism[b] * n_plants * np.random.uniform(0.7, 1.3)))
    n_partners = min(n_partners, n_plants)
    # Prefer attractive plants (creates nestedness)
    probs = plant_attractiveness ** (1 / max(generalism[b], 0.1))
    probs = probs / np.sum(probs)
    partners = np.random.choice(n_plants, size=n_partners, replace=False, p=probs)
    for p in partners:
        # Interaction strength (visits per observation hour)
        interaction[b, p] = np.random.exponential(generalism[b] * plant_attractiveness[p] * 10)

# Ensure every plant has at least one pollinator
for p in range(n_plants):
    if np.sum(interaction[:, p]) == 0:
        b = np.random.randint(0, n_pollinators)
        interaction[b, p] = np.random.exponential(2)

# Binary version for structural analysis
binary = (interaction > 0).astype(int)

# --- Compute network metrics ---
# Degree
pollinator_degree = np.sum(binary, axis=1)
plant_degree = np.sum(binary, axis=0)
connectance = np.sum(binary) / (n_pollinators * n_plants)

# Specialization index d' for each species
def compute_d_prime(interaction_matrix):
    """Bluthgen's d' specialization index."""
    d_prime_poll = np.zeros(interaction_matrix.shape[0])
    d_prime_plant = np.zeros(interaction_matrix.shape[1])

    total = np.sum(interaction_matrix)
    if total == 0:
        return d_prime_poll, d_prime_plant

    # Pollinator specialization
    for b in range(interaction_matrix.shape[0]):
        row_total = np.sum(interaction_matrix[b])
        if row_total == 0:
            continue
        observed_props = interaction_matrix[b] / row_total
        available_props = np.sum(interaction_matrix, axis=0) / total
        # KL divergence
        kl = 0
        for p in range(interaction_matrix.shape[1]):
            if observed_props[p] > 0 and available_props[p] > 0:
                kl += observed_props[p] * np.log(observed_props[p] / available_props[p])
        d_prime_poll[b] = 1 - np.exp(-kl)

    # Plant specialization
    for p in range(interaction_matrix.shape[1]):
        col_total = np.sum(interaction_matrix[:, p])
        if col_total == 0:
            continue
        observed_props = interaction_matrix[:, p] / col_total
        available_props = np.sum(interaction_matrix, axis=1) / total
        kl = 0
        for b in range(interaction_matrix.shape[0]):
            if observed_props[b] > 0 and available_props[b] > 0:
                kl += observed_props[b] * np.log(observed_props[b] / available_props[b])
        d_prime_plant[p] = 1 - np.exp(-kl)

    return d_prime_poll, d_prime_plant

d_prime_poll, d_prime_plant = compute_d_prime(interaction)

# Network-level H2'
H2 = np.mean(d_prime_poll) * 0.5 + np.mean(d_prime_plant) * 0.5

# Nestedness (NODF)
def compute_NODF(binary_matrix):
    n_rows, n_cols = binary_matrix.shape
    row_NODF = 0
    row_pairs = 0
    for i in range(n_rows):
        for j in range(i+1, n_rows):
            di = np.sum(binary_matrix[i])
            dj = np.sum(binary_matrix[j])
            if di > 0 and dj > 0:
                overlap = np.sum(binary_matrix[i] & binary_matrix[j])
                min_d = min(di, dj)
                if di != dj and min_d > 0:
                    row_NODF += overlap / min_d
                row_pairs += 1

    col_NODF = 0
    col_pairs = 0
    for i in range(n_cols):
        for j in range(i+1, n_cols):
            di = np.sum(binary_matrix[:, i])
            dj = np.sum(binary_matrix[:, j])
            if di > 0 and dj > 0:
                overlap = np.sum(binary_matrix[:, i] & binary_matrix[:, j])
                min_d = min(di, dj)
                if di != dj and min_d > 0:
                    col_NODF += overlap / min_d
                col_pairs += 1

    total_NODF = 0
    total_pairs = 0
    if row_pairs > 0:
        total_NODF += row_NODF
        total_pairs += row_pairs
    if col_pairs > 0:
        total_NODF += col_NODF
        total_pairs += col_pairs

    return total_NODF / total_pairs if total_pairs > 0 else 0

nestedness = compute_NODF(binary)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Pollination Network Analyzer — Network Structure', color='white', fontsize=14)

# Plot 1: Interaction matrix (sorted)
ax = axes[0, 0]
ax.set_facecolor('#111827')
poll_order = np.argsort(-pollinator_degree)
plant_order = np.argsort(-plant_degree)
sorted_int = interaction[poll_order][:, plant_order]
im = ax.imshow(np.log1p(sorted_int), cmap='YlOrRd', aspect='auto')
ax.set_yticks(range(n_pollinators))
ax.set_yticklabels([pollinator_names[i][:12] for i in poll_order], color='white', fontsize=6)
ax.set_xlabel('Plants (sorted by degree)', color='white')
ax.set_title('Interaction matrix (log scale)', color='white', fontsize=10)
plt.colorbar(im, ax=ax, fraction=0.046)
ax.tick_params(colors='gray')

# Plot 2: Bipartite network visualization
ax = axes[0, 1]
ax.set_facecolor('#111827')
# Position pollinators on left, plants on right
for i in range(n_pollinators):
    y = 1 - i / (n_pollinators - 1)
    ax.scatter(0, y, s=pollinator_degree[i] * 30, c='#f59e0b', edgecolors='white',
               linewidths=0.5, zorder=5)
    ax.text(-0.15, y, pollinator_names[i][:8], color='white', fontsize=5, ha='right', va='center')

for j in range(n_plants):
    y = 1 - j / (n_plants - 1)
    ax.scatter(1, y, s=plant_degree[j] * 30, c='#22c55e', edgecolors='white',
               linewidths=0.5, zorder=5)

# Draw edges (sample strongest interactions)
for i in range(n_pollinators):
    for j in range(n_plants):
        if interaction[i, j] > 0:
            y_poll = 1 - i / (n_pollinators - 1)
            y_plant = 1 - j / (n_plants - 1)
            alpha = min(interaction[i, j] / np.max(interaction) * 2, 0.8)
            ax.plot([0, 1], [y_poll, y_plant], '-', color='white', alpha=alpha * 0.3,
                    linewidth=alpha * 2)

ax.set_xlim(-0.5, 1.5)
ax.set_title('Bipartite network', color='white', fontsize=11)
ax.axis('off')

# Plot 3: Degree distribution
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.hist(pollinator_degree, bins=range(1, max(pollinator_degree)+2), alpha=0.6,
        color='#f59e0b', label='Pollinators', edgecolor='none')
ax.hist(plant_degree, bins=range(1, max(plant_degree)+2), alpha=0.6,
        color='#22c55e', label='Plants', edgecolor='none')
ax.set_xlabel('Degree (number of partners)', color='white')
ax.set_ylabel('Frequency', color='white')
ax.set_title('Degree distribution', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Specialization (d')
ax = axes[1, 0]
ax.set_facecolor('#111827')
x = np.arange(n_pollinators)
ax.barh(x, d_prime_poll[poll_order], color='#a855f7', edgecolor='none', height=0.6)
ax.set_yticks(x)
ax.set_yticklabels([pollinator_names[i][:12] for i in poll_order], color='white', fontsize=6)
ax.set_xlabel("Specialization (d')", color='white')
ax.set_title('Pollinator specialization', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 5: Degree vs specialization
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.scatter(pollinator_degree, d_prime_poll, s=100, c='#f59e0b', edgecolors='white',
           linewidths=0.5, label='Pollinators')
ax.scatter(plant_degree, d_prime_plant, s=100, c='#22c55e', edgecolors='white',
           linewidths=0.5, label='Plants')
ax.set_xlabel('Degree', color='white')
ax.set_ylabel("Specialization (d')", color='white')
ax.set_title('Degree vs specialization trade-off', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Network summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
rows = [
    ['Pollinators', str(n_pollinators)],
    ['Plants', str(n_plants)],
    ['Interactions', str(int(np.sum(binary)))],
    ['Connectance', f'{connectance:.3f}'],
    ['Nestedness (NODF)', f'{nestedness:.3f}'],
    ["Network specialization (H2')", f'{H2:.3f}'],
    ['Mean pollinator degree', f'{np.mean(pollinator_degree):.1f}'],
    ['Mean plant degree', f'{np.mean(plant_degree):.1f}'],
]
table = ax.table(cellText=rows, colLabels=['Metric', 'Value'], cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('Network metrics', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"Pollination network: {n_pollinators} pollinators × {n_plants} plants")
print(f"Connectance: {connectance:.3f}  Nestedness: {nestedness:.3f}  H2': {H2:.3f}")
print(f"Most generalist pollinator: {pollinator_names[np.argmax(pollinator_degree)]} (degree={max(pollinator_degree)})")
print(f"Most specialized pollinator: {pollinator_names[np.argmax(d_prime_poll)]} (d'={max(d_prime_poll):.2f})")`,
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
        matrix[poll_idx, :] = 0

        # Cascade: check for secondary extinctions
        cascading = True
        while cascading:
            cascading = False
            # Plants that lose all pollinators
            for p in range(n_plant):
                if plant_alive[p] and np.sum(matrix[:, p]) == 0:
                    plant_alive[p] = False
                    matrix[:, p] = 0
                    cascading = True

            # Pollinators that lose all food plants
            for b in range(n_poll):
                if poll_alive[b] and np.sum(matrix[b, :]) == 0:
                    poll_alive[b] = False
                    matrix[b, :] = 0
                    cascading = True

        results.append({
            'removed': step + 1,
            'plants_alive': int(np.sum(plant_alive)),
            'pollinators_alive': int(np.sum(poll_alive)),
        })

    return results

# Run removal experiments
order_most = np.argsort(-pollinator_degree)
order_random = np.random.permutation(n_pollinators)
order_least = np.argsort(pollinator_degree)

results_most = simulate_cascade(binary, order_most)
results_random = simulate_cascade(binary, order_random)
results_least = simulate_cascade(binary, order_least)

# --- Keystone impact analysis ---
single_removal_impact = np.zeros(n_pollinators)
cascade_depth = np.zeros(n_pollinators)

for b in range(n_pollinators):
    test_matrix = binary.copy()
    test_matrix[b, :] = 0

    # Direct impact: plants losing all pollinators
    plants_lost = 0
    for p in range(n_plants):
        if np.sum(test_matrix[:, p]) == 0 and np.sum(binary[:, p]) > 0:
            plants_lost += 1

    # Cascade impact
    poll_alive = np.ones(n_pollinators, dtype=bool)
    poll_alive[b] = False
    plant_alive = np.ones(n_plants, dtype=bool)
    total_lost = 0

    cascading = True
    depth = 0
    while cascading:
        cascading = False
        depth += 1
        for p in range(n_plants):
            if plant_alive[p] and np.sum(test_matrix[:, p]) == 0:
                plant_alive[p] = False
                test_matrix[:, p] = 0
                total_lost += 1
                cascading = True
        for b2 in range(n_pollinators):
            if poll_alive[b2] and np.sum(test_matrix[b2, :]) == 0:
                poll_alive[b2] = False
                test_matrix[b2, :] = 0
                total_lost += 1
                cascading = True

    single_removal_impact[b] = total_lost
    cascade_depth[b] = depth

# Robustness: AUC of the extinction curve
def compute_robustness(results, total_plants):
    removals = [r['removed'] for r in results]
    plants = [r['plants_alive'] / total_plants for r in results]
    return np.trapz(plants, removals) / max(removals)

robust_most = compute_robustness(results_most, n_plants)
robust_random = compute_robustness(results_random, n_plants)
robust_least = compute_robustness(results_least, n_plants)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Keystone Species Identification & Extinction Cascades', color='white', fontsize=14)

# Plot 1: Extinction curves
ax = axes[0, 0]
ax.set_facecolor('#111827')
for results, label, color in [
    (results_most, f'Most connected (R={robust_most:.2f})', '#ef4444'),
    (results_random, f'Random (R={robust_random:.2f})', '#f59e0b'),
    (results_least, f'Least connected (R={robust_least:.2f})', '#22c55e'),
]:
    xs = [r['removed'] for r in results]
    ys = [r['plants_alive'] for r in results]
    ax.plot(xs, ys, 'o-', color=color, linewidth=2, label=label)

ax.axhline(n_plants * 0.5, color='gray', linestyle=':', linewidth=1)
ax.set_xlabel('Pollinators removed', color='white')
ax.set_ylabel('Plants with pollination', color='white')
ax.set_title('Extinction cascades: removal order', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Single-species removal impact
ax = axes[0, 1]
ax.set_facecolor('#111827')
order = np.argsort(-single_removal_impact)
colors_impact = ['#ef4444' if s > 2 else '#f59e0b' if s > 0 else '#22c55e' for s in single_removal_impact[order]]
ax.barh(range(n_pollinators), single_removal_impact[order], color=colors_impact, edgecolor='none')
ax.set_yticks(range(n_pollinators))
ax.set_yticklabels([pollinator_names[i] for i in order], color='white', fontsize=7)
ax.set_xlabel('Total species lost (cascade)', color='white')
ax.set_title('Single-species removal impact', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 3: Degree vs keystone impact
ax = axes[0, 2]
ax.set_facecolor('#111827')
ax.scatter(pollinator_degree, single_removal_impact, s=200,
           c=single_removal_impact, cmap='YlOrRd', edgecolors='white', linewidths=1)
for i in range(n_pollinators):
    ax.annotate(pollinator_names[i][:6], (pollinator_degree[i], single_removal_impact[i]),
               color='white', fontsize=7, textcoords="offset points", xytext=(3, 3))
ax.set_xlabel('Degree (generalism)', color='white')
ax.set_ylabel('Removal impact (cascade)', color='white')
ax.set_title('Degree vs keystone impact', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 4: Plant vulnerability
ax = axes[1, 0]
ax.set_facecolor('#111827')
plant_vulnerability = np.zeros(n_plants)
for p in range(n_plants):
    n_pollinators_p = np.sum(binary[:, p])
    if n_pollinators_p == 1:
        plant_vulnerability[p] = 1.0  # one pollinator loss = extinction
    elif n_pollinators_p == 2:
        plant_vulnerability[p] = 0.5
    else:
        plant_vulnerability[p] = 1.0 / n_pollinators_p

p_order = np.argsort(-plant_vulnerability)
colors_vuln = ['#ef4444' if v > 0.5 else '#f59e0b' if v > 0.2 else '#22c55e' for v in plant_vulnerability[p_order]]
ax.barh(range(n_plants), plant_vulnerability[p_order], color=colors_vuln, edgecolor='none')
ax.set_yticks(range(n_plants))
ax.set_yticklabels([f'Plant_{p_order[i]+1} (d={plant_degree[p_order[i]]})' for i in range(n_plants)],
                   color='white', fontsize=6)
ax.set_xlabel('Vulnerability (1/degree)', color='white')
ax.set_title('Plant vulnerability to pollinator loss', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 5: Cascade vs non-cascade extinction count
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Count direct vs cascaded losses for most-connected removal
direct_losses = []
cascade_losses = []
matrix_test = binary.copy()
for poll_idx in order_most:
    direct = 0
    matrix_test[poll_idx, :] = 0
    for p in range(n_plants):
        if np.sum(matrix_test[:, p]) == 0 and np.sum(binary[:, p]) > 0:
            direct += 1
    direct_losses.append(direct)
    cascade_losses.append(max(0, single_removal_impact[poll_idx] - direct))

x = range(len(direct_losses))
ax.bar(x, direct_losses, color='#ef4444', label='Direct plant loss', edgecolor='none')
ax.bar(x, cascade_losses, bottom=direct_losses, color='#f59e0b', label='Cascaded loss', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels([pollinator_names[i][:6] for i in order_most], color='white', fontsize=6, rotation=45)
ax.set_ylabel('Species lost', color='white')
ax.set_title('Direct vs cascaded extinctions', color='white', fontsize=11)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 6: Conservation priority ranking
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
priority = np.argsort(-single_removal_impact)
rows = []
for rank, idx in enumerate(priority[:6]):
    rows.append([
        str(rank + 1),
        pollinator_names[idx],
        str(int(pollinator_degree[idx])),
        str(int(single_removal_impact[idx])),
        'CRITICAL' if single_removal_impact[idx] > 2 else 'Important' if single_removal_impact[idx] > 0 else 'Low'
    ])
table = ax.table(cellText=rows,
                colLabels=['Rank', 'Species', 'Degree', 'Cascade loss', 'Priority'],
                cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
    if key[1] == 4 and key[0] > 0:
        if 'CRITICAL' in rows[key[0]-1][4]:
            cell.set_facecolor('#7f1d1d')
ax.set_title('Conservation priority ranking', color='white', fontsize=11, pad=15)

plt.tight_layout()
plt.show()

print("Keystone analysis complete:")
print(f"  Most impactful species: {pollinator_names[priority[0]]} (cascade loss: {int(single_removal_impact[priority[0]])})")
print(f"  Network robustness (most-connected): {robust_most:.3f}")
print(f"  Network robustness (random): {robust_random:.3f}")
print(f"  Network robustness (least-connected): {robust_least:.3f}")`,
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
    honey_stored = 50  # kg, starting reserves
    honey_history = []

    for day in range(days):
        # Egg laying
        photoperiod = 0.5 + 0.5 * np.sin(2 * np.pi * (day - 80) / 365)
        eggs = queen_max_eggs * max(0, photoperiod) ** 2
        surviving_eggs = eggs * larval_survival

        # Deaths
        lifespan = summer_lifespan if 60 < day < 300 else winter_lifespan
        daily_deaths = adults / lifespan * np.random.uniform(0.9, 1.1)

        # Navigation loss (bees that can\'t find home)
        if 60 < day < 300:
            lost_foragers = adults * 0.35 * pesticide_impact * 0.02
            daily_deaths += lost_foragers

        new_adults = brood[0]
        brood = np.roll(brood, -1)
        brood[-1] = surviving_eggs

        adults = max(100, adults + new_adults - daily_deaths)
        population.append(adults)

        # Honey dynamics
        if 90 < day < 280:
            foragers = adults * 0.35
            daily_honey = foragers * 0.4 * 0.25 * foraging_efficiency / 1000  # kg
            colony_consumption = adults * 0.008 / 1000  # kg
            honey_stored += daily_honey - colony_consumption
        else:
            colony_consumption = adults * 0.006 / 1000
            honey_stored -= colony_consumption

        honey_stored = max(0, honey_stored)
        honey_history.append(honey_stored)

    # Winter survival check
    winter_bees = population[-1]
    winter_honey = honey_history[-1]
    survived_winter = winter_bees > 8000 and winter_honey > 10

    return {
        'population': np.array(population),
        'honey': np.array(honey_history),
        'peak': max(population),
        'winter_bees': winter_bees,
        'winter_honey': winter_honey,
        'survived': survived_winter,
        'label': label,
    }

# Scenarios
scenarios = [
    {'pesticide_impact': 0, 'varroa_load': 0, 'habitat_loss': 0, 'label': 'Healthy'},
    {'pesticide_impact': 0.3, 'varroa_load': 0, 'habitat_loss': 0, 'label': 'Low pesticide'},
    {'pesticide_impact': 0.6, 'varroa_load': 0, 'habitat_loss': 0, 'label': 'High pesticide'},
    {'pesticide_impact': 0, 'varroa_load': 0.5, 'habitat_loss': 0, 'label': 'Varroa mite'},
    {'pesticide_impact': 0.3, 'varroa_load': 0.3, 'habitat_loss': 0.2, 'label': 'CCD combined'},
    {'pesticide_impact': 0.5, 'varroa_load': 0.5, 'habitat_loss': 0.3, 'label': 'Severe CCD'},
]

results = [simulate_colony(**s) for s in scenarios]

# Economic impact model
crop_dependency = {
    'Almonds': 0.90, 'Apples': 0.65, 'Blueberries': 0.90,
    'Mustard': 0.80, 'Sunflower': 0.70, 'Mango': 0.30,
    'Rice': 0.05, 'Wheat': 0.10, 'Tomato': 0.50,
}
crop_value_crores = {
    'Almonds': 5000, 'Apples': 12000, 'Blueberries': 2000,
    'Mustard': 8000, 'Sunflower': 3000, 'Mango': 15000,
    'Rice': 200000, 'Wheat': 150000, 'Tomato': 20000,
}

# Calculate economic loss at different colony loss rates
colony_loss_rates = np.linspace(0, 0.8, 20)
economic_losses = []
for loss_rate in colony_loss_rates:
    total_loss = 0
    for crop, dep in crop_dependency.items():
        pollination_deficit = loss_rate * dep
        yield_loss = pollination_deficit * 0.8  # not all deficit = yield loss
        total_loss += crop_value_crores[crop] * yield_loss
    economic_losses.append(total_loss)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Colony Collapse Disorder: Colony, Network & Economic Impact', color='white', fontsize=14)

colors_s = ['#22c55e', '#a3e635', '#f59e0b', '#fb923c', '#ef4444', '#dc2626']

# Plot 1: Colony population
ax = axes[0, 0]
ax.set_facecolor('#111827')
for r, c in zip(results, colors_s):
    ax.plot(r['population'], color=c, linewidth=1.5, label=r['label'])
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('Worker population', color='white')
ax.set_title('Colony dynamics under CCD stress', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Honey stores
ax = axes[0, 1]
ax.set_facecolor('#111827')
for r, c in zip(results, colors_s):
    ax.plot(r['honey'], color=c, linewidth=1.5, label=r['label'])
ax.axhline(10, color='gray', linestyle=':', linewidth=1, label='Min winter stores')
ax.set_xlabel('Day of year', color='white')
ax.set_ylabel('Honey stored (kg)', color='white')
ax.set_title('Honey reserves', color='white', fontsize=11)
ax.legend(fontsize=6, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 3: Winter survival status
ax = axes[0, 2]
ax.set_facecolor('#111827')
labels = [r['label'] for r in results]
winter_bees = [r['winter_bees'] for r in results]
survival = ['Survived' if r['survived'] else 'COLLAPSED' for r in results]
colors_surv = ['#22c55e' if r['survived'] else '#ef4444' for r in results]
bars = ax.bar(range(len(results)), winter_bees, color=colors_surv, edgecolor='none')
ax.axhline(8000, color='#f59e0b', linestyle='--', label='Survival threshold')
ax.set_xticks(range(len(results)))
ax.set_xticklabels(labels, color='white', fontsize=6, rotation=20)
ax.set_ylabel('Winter population', color='white')
ax.set_title('Winter survival assessment', color='white', fontsize=11)
for i, (bar, surv) in enumerate(zip(bars, survival)):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 200,
            surv, ha='center', color='white', fontsize=6, fontweight='bold')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Economic impact
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(colony_loss_rates * 100, [l/100 for l in economic_losses],
        color='#ef4444', linewidth=2)
ax.fill_between(colony_loss_rates * 100, 0, [l/100 for l in economic_losses],
                color='#ef4444', alpha=0.2)
ax.set_xlabel('Colony loss rate (%)', color='white')
ax.set_ylabel('Economic loss (₹100 Cr)', color='white')
ax.set_title('Agricultural economic impact', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 5: Crop vulnerability
ax = axes[1, 1]
ax.set_facecolor('#111827')
crop_names = list(crop_dependency.keys())
deps = [crop_dependency[c] for c in crop_names]
values = [crop_value_crores[c] / 1000 for c in crop_names]  # in 1000 Cr
colors_crop = ['#ef4444' if d > 0.7 else '#f59e0b' if d > 0.4 else '#22c55e' for d in deps]
ax.scatter(deps, values, s=[v * 30 for v in values], c=colors_crop, edgecolors='white',
           linewidths=1, alpha=0.8)
for i, name in enumerate(crop_names):
    ax.annotate(name, (deps[i], values[i]), color='white', fontsize=7,
               textcoords="offset points", xytext=(5, 5))
ax.set_xlabel('Pollination dependency', color='white')
ax.set_ylabel('Crop value (₹1000 Cr)', color='white')
ax.set_title('Crop vulnerability to pollinator loss', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 6: Summary
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
rows = []
for r in results:
    rows.append([r['label'], f'{r["peak"]:.0f}', f'{r["winter_bees"]:.0f}',
                 f'{r["winter_honey"]:.1f}', 'YES' if r['survived'] else 'NO'])
table = ax.table(cellText=rows,
                colLabels=['Scenario', 'Peak pop', 'Winter pop', 'Honey (kg)', 'Survived?'],
                cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(8)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
    if key[1] == 4 and key[0] > 0:
        cell.set_facecolor('#065f46' if rows[key[0]-1][4] == 'YES' else '#7f1d1d')
ax.set_title('Colony survival summary', color='white', fontsize=11, pad=15)

plt.tight_layout()
plt.show()

print("CCD Impact Analysis:")
for r in results:
    status = "SURVIVED" if r['survived'] else "COLLAPSED"
    print(f"  {r['label']:<20} Peak: {r['peak']:>7.0f}  Winter: {r['winter_bees']:>7.0f}  Honey: {r['winter_honey']:>5.1f}kg  {status}")
print(f"\\nAt 40% colony loss: economic damage ≈ ₹{economic_losses[10]/100:.0f} hundred crore")`,
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
    results = [{'removed': 0, 'plants_alive': int(np.sum(plant_alive))}]

    for step, poll_idx in enumerate(removal_order):
        if not poll_alive[poll_idx]:
            continue
        poll_alive[poll_idx] = False

        # Identify orphaned plants (before cascade)
        orphaned_plants = []
        for p in range(n_plant):
            if plant_alive[p] and matrix[poll_idx, p] == 1:
                # Will this plant lose its last pollinator?
                remaining = np.sum(matrix[:, p]) - matrix[poll_idx, p]
                if remaining == 0:
                    orphaned_plants.append(p)

        matrix[poll_idx, :] = 0

        # Rewiring: surviving pollinators may adopt orphaned plants
        for p in orphaned_plants:
            for b in range(n_poll):
                if poll_alive[b] and matrix[b, p] == 0:
                    # Probability of rewiring depends on pollinator's generalism
                    if np.random.random() < rewiring_prob * generalism[b]:
                        matrix[b, p] = 1
                        break  # only need one new pollinator

        # Cascade
        cascading = True
        while cascading:
            cascading = False
            for p in range(n_plant):
                if plant_alive[p] and np.sum(matrix[:, p]) == 0:
                    plant_alive[p] = False
                    matrix[:, p] = 0
                    cascading = True
            for b in range(n_poll):
                if poll_alive[b] and np.sum(matrix[b, :]) == 0:
                    poll_alive[b] = False
                    matrix[b, :] = 0
                    cascading = True

        results.append({'removed': step + 1, 'plants_alive': int(np.sum(plant_alive))})

    return results

# Test different rewiring probabilities
removal_order = np.argsort(-pollinator_degree)
rewiring_probs = [0.0, 0.2, 0.4, 0.6, 0.8]

all_results = {}
for rp in rewiring_probs:
    # Average over multiple random seeds for stochastic rewiring
    avg_plants = np.zeros(n_pollinators + 1)
    n_trials = 30
    for trial in range(n_trials):
        np.random.seed(trial * 100 + 42)
        res = cascade_with_rewiring(binary, removal_order, rewiring_prob=rp)
        for r in res:
            avg_plants[r['removed']] += r['plants_alive']
    avg_plants /= n_trials
    all_results[rp] = avg_plants

np.random.seed(42)

# Wildflower strip simulation
def add_wildflower_strip(binary_matrix, n_new_plants=5, connection_boost=0.3):
    """Add wildflower strip plants that generalists easily adopt."""
    n_poll = binary_matrix.shape[0]
    new_plants = np.zeros((n_poll, n_new_plants), dtype=int)
    for b in range(n_poll):
        for p in range(n_new_plants):
            if np.random.random() < generalism[b] * connection_boost * 2:
                new_plants[b, p] = 1
    # Ensure each new plant has at least one pollinator
    for p in range(n_new_plants):
        if np.sum(new_plants[:, p]) == 0:
            new_plants[np.random.randint(0, n_poll), p] = 1
    return np.hstack([binary_matrix, new_plants])

enhanced_binary = add_wildflower_strip(binary)
enhanced_degree = np.sum(enhanced_binary, axis=1)
enhanced_order = np.argsort(-enhanced_degree)

res_base = cascade_with_rewiring(binary, removal_order, rewiring_prob=0)
res_enhanced = cascade_with_rewiring(enhanced_binary, enhanced_order, rewiring_prob=0)
res_enhanced_rewire = cascade_with_rewiring(enhanced_binary, enhanced_order, rewiring_prob=0.4)

# --- Visualization ---
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Network Resilience: Rewiring & Wildflower Management', color='white', fontsize=14)

# Plot 1: Extinction curves at different rewiring rates
ax = axes[0, 0]
ax.set_facecolor('#111827')
colors_rw = ['#ef4444', '#f59e0b', '#a3e635', '#22c55e', '#3b82f6']
for rp, color in zip(rewiring_probs, colors_rw):
    ax.plot(range(len(all_results[rp])), all_results[rp], 'o-', color=color,
            linewidth=2, markersize=4, label=f'Rewire={rp:.0%}')
ax.set_xlabel('Pollinators removed', color='white')
ax.set_ylabel('Plants with pollination', color='white')
ax.set_title('Impact of rewiring on cascade severity', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Robustness vs rewiring probability
ax = axes[0, 1]
ax.set_facecolor('#111827')
robustness = []
for rp in rewiring_probs:
    curve = all_results[rp]
    rob = np.trapz(curve / n_plants, range(len(curve))) / len(curve)
    robustness.append(rob)
ax.plot(rewiring_probs, robustness, 'o-', color='#22c55e', linewidth=2, markersize=10)
ax.set_xlabel('Rewiring probability', color='white')
ax.set_ylabel('Network robustness', color='white')
ax.set_title('Robustness increases with rewiring', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Plot 3: Wildflower strip effect
ax = axes[0, 2]
ax.set_facecolor('#111827')
xs_b = [r['removed'] for r in res_base]
ys_b = [r['plants_alive'] for r in res_base]
xs_e = [r['removed'] for r in res_enhanced]
ys_e = [r['plants_alive'] for r in res_enhanced]
xs_er = [r['removed'] for r in res_enhanced_rewire]
ys_er = [r['plants_alive'] for r in res_enhanced_rewire]
ax.plot(xs_b, ys_b, 'o-', color='#ef4444', linewidth=2, label='Baseline')
ax.plot(xs_e, ys_e, 's-', color='#f59e0b', linewidth=2, label='+ Wildflower strip')
ax.plot(xs_er, ys_er, '^-', color='#22c55e', linewidth=2, label='+ Strip + rewiring')
ax.set_xlabel('Pollinators removed', color='white')
ax.set_ylabel('Plants with pollination', color='white')
ax.set_title('Wildflower strips increase resilience', color='white', fontsize=10)
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 4: Functional redundancy map
ax = axes[1, 0]
ax.set_facecolor('#111827')
redundancy = np.sum(binary, axis=0)  # pollinators per plant
red_enhanced = np.sum(enhanced_binary, axis=0)

x = np.arange(n_plants)
ax.bar(x - 0.2, redundancy, 0.4, color='#ef4444', label='Baseline', edgecolor='none')
ax.bar(x + 0.2, red_enhanced[:n_plants], 0.4, color='#22c55e', label='+ Wildflowers', edgecolor='none')
ax.set_xlabel('Plant species', color='white')
ax.set_ylabel('Number of pollinators', color='white')
ax.set_title('Functional redundancy per plant', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 5: Generalism effect on rewiring
ax = axes[1, 1]
ax.set_facecolor('#111827')
# For each pollinator that could potentially rewire, show success rate
rewire_success = np.zeros(n_pollinators)
n_trials_rw = 100
for trial in range(n_trials_rw):
    np.random.seed(trial)
    for b in range(n_pollinators):
        n_opportunities = 3  # orphaned plants to adopt
        successes = sum(1 for _ in range(n_opportunities) if np.random.random() < 0.4 * generalism[b])
        rewire_success[b] += successes
rewire_success /= (n_trials_rw * 3)

ax.scatter(generalism, rewire_success, s=200, c='#3b82f6', edgecolors='white', linewidths=1)
for i in range(n_pollinators):
    ax.annotate(pollinator_names[i][:6], (generalism[i], rewire_success[i]),
               color='white', fontsize=7, textcoords="offset points", xytext=(3, 3))
z = np.polyfit(generalism, rewire_success, 1)
x_fit = np.linspace(0.1, 1.0, 100)
ax.plot(x_fit, z[0] * x_fit + z[1], '--', color='#f59e0b', linewidth=1)
ax.set_xlabel('Generalism score', color='white')
ax.set_ylabel('Rewiring success rate', color='white')
ax.set_title('Generalists rewire more successfully', color='white', fontsize=10)
ax.tick_params(colors='gray')

# Plot 6: Management recommendation
ax = axes[1, 2]
ax.set_facecolor('#111827')
ax.axis('off')
rec = [
    ['Action', 'Cost', 'Resilience gain'],
    ['Protect keystone pollinators', 'Low', 'High'],
    ['Plant wildflower strips', 'Medium', 'High'],
    ['Reduce pesticide use', 'Medium', 'Very high'],
    ['Maintain hedge corridors', 'Low', 'Medium'],
    ['Create bee hotels', 'Low', 'Low-Medium'],
]
table = ax.table(cellText=rec[1:], colLabels=rec[0], cellLoc='center', loc='center')
table.auto_set_font_size(False)
table.set_fontsize(9)
for key, cell in table.get_celld().items():
    cell.set_facecolor('#1f2937')
    cell.set_edgecolor('gray')
    cell.set_text_props(color='white')
    if key[0] == 0:
        cell.set_facecolor('#374151')
        cell.set_text_props(fontweight='bold', color='white')
ax.set_title('Management recommendations', color='white', fontsize=11, pad=15)

plt.tight_layout()
plt.show()

print("Rewiring analysis:")
for rp, rob in zip(rewiring_probs, robustness):
    print(f"  Rewiring prob={rp:.0%}: robustness={rob:.3f}")
print(f"\\nWildflower strip adds {enhanced_binary.shape[1] - n_plants} new plants to network")
print(f"Mean redundancy: baseline={np.mean(redundancy):.1f}, enhanced={np.mean(red_enhanced[:n_plants]):.1f}")
print(f"\\nKey finding: wildflower strips + rewiring can double network resilience")`,
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
def quick_cascade(matrix, order):
    mat = matrix.copy()
    pa = np.ones(mat.shape[1], dtype=bool)
    ba = np.ones(mat.shape[0], dtype=bool)
    curve = [np.sum(pa)]
    for idx in order:
        ba[idx] = False
        mat[idx, :] = 0
        changed = True
        while changed:
            changed = False
            for p in range(mat.shape[1]):
                if pa[p] and np.sum(mat[:, p]) == 0:
                    pa[p] = False; mat[:, p] = 0; changed = True
            for b in range(mat.shape[0]):
                if ba[b] and np.sum(mat[b, :]) == 0:
                    ba[b] = False; mat[b, :] = 0; changed = True
        curve.append(np.sum(pa))
    return curve

order_most = np.argsort(-poll_degree)
curve_most = quick_cascade(binary, order_most)
robustness = np.trapz([c/n_plants for c in curve_most], range(len(curve_most))) / len(curve_most)

# Redundancy
mean_redundancy = np.mean(plant_degree)
min_redundancy = np.min(plant_degree)
vulnerable_plants = np.sum(plant_degree <= 1)

# Generalist fraction
generalist_fraction = np.mean(poll_degree > np.median(poll_degree))

# Keystone identification
keystone_impact = np.zeros(n_pollinators)
for b in range(n_pollinators):
    mat = binary.copy()
    mat[b, :] = 0
    lost = 0
    for p in range(n_plants):
        if np.sum(mat[:, p]) == 0 and np.sum(binary[:, p]) > 0:
            lost += 1
    keystone_impact[b] = lost

# --- Network Health Score (0-100) ---
score_connectance = min(connectance / 0.3, 1.0) * 20  # max 20 pts
score_nestedness = nestedness * 25  # max 25 pts
score_robustness = robustness * 25  # max 25 pts
score_redundancy = min(mean_redundancy / 5, 1.0) * 15  # max 15 pts
score_generalist = generalist_fraction * 15  # max 15 pts
health_score = score_connectance + score_nestedness + score_robustness + score_redundancy + score_generalist
health_score = min(100, health_score)

# Grade
if health_score >= 75:
    grade = 'GOOD'
    grade_color = '#22c55e'
elif health_score >= 50:
    grade = 'MODERATE'
    grade_color = '#f59e0b'
else:
    grade = 'AT RISK'
    grade_color = '#ef4444'

# --- DASHBOARD ---
fig = plt.figure(figsize=(18, 14))
fig.patch.set_facecolor('#1f2937')

# Title
fig.text(0.5, 0.97, 'POLLINATION NETWORK HEALTH ASSESSMENT', color='white',
         fontsize=16, fontweight='bold', ha='center')
fig.text(0.5, 0.95, f'{n_pollinators} pollinators | {n_plants} plants | {int(np.sum(binary))} interactions | Survey: March 2026',
         color='gray', fontsize=10, ha='center')

gs = fig.add_gridspec(3, 4, hspace=0.4, wspace=0.35, top=0.93, bottom=0.05)

# 1. Health Score gauge
ax = fig.add_subplot(gs[0, 0])
ax.set_facecolor('#111827')
# Simple bar gauge
ax.barh([0], [health_score], color=grade_color, height=0.3, edgecolor='none')
ax.barh([0], [100], color='#374151', height=0.3, edgecolor='none', zorder=0)
ax.barh([0], [health_score], color=grade_color, height=0.3, edgecolor='none', zorder=1)
ax.text(50, 0.25, f'{health_score:.0f}/100', color='white', fontsize=20, fontweight='bold', ha='center')
ax.text(50, -0.25, grade, color=grade_color, fontsize=14, fontweight='bold', ha='center')
ax.set_xlim(0, 100)
ax.set_ylim(-0.5, 0.5)
ax.axis('off')
ax.set_title('Network Health Score', color='white', fontsize=11)

# 2. Score breakdown
ax = fig.add_subplot(gs[0, 1])
ax.set_facecolor('#111827')
components = ['Connectance', 'Nestedness', 'Robustness', 'Redundancy', 'Generalists']
scores = [score_connectance, score_nestedness, score_robustness, score_redundancy, score_generalist]
max_scores = [20, 25, 25, 15, 15]
colors_sc = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4']
bars = ax.barh(components, scores, color=colors_sc, edgecolor='none', height=0.5)
for i, (bar, s, m) in enumerate(zip(bars, scores, max_scores)):
    ax.text(m + 0.5, i, f'{s:.0f}/{m}', color='white', fontsize=8, va='center')
ax.set_xlim(0, 30)
ax.set_title('Score components', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 3. Extinction curve
ax = fig.add_subplot(gs[0, 2])
ax.set_facecolor('#111827')
ax.plot(range(len(curve_most)), [c/n_plants*100 for c in curve_most], 'o-',
        color='#ef4444', linewidth=2)
ax.axhline(50, color='gray', linestyle=':', linewidth=1)
ax.set_xlabel('Pollinators removed', color='white')
ax.set_ylabel('Plants alive (%)', color='white')
ax.set_title(f'Worst-case cascade (R={robustness:.2f})', color='white', fontsize=10)
ax.tick_params(colors='gray')

# 4. Keystone ranking
ax = fig.add_subplot(gs[0, 3])
ax.set_facecolor('#111827')
ks_order = np.argsort(-keystone_impact)[:6]
ks_names = [pollinator_names[i][:12] for i in ks_order]
ks_impacts = [keystone_impact[i] for i in ks_order]
colors_ks = ['#ef4444' if k > 1 else '#f59e0b' if k > 0 else '#22c55e' for k in ks_impacts]
ax.barh(ks_names, ks_impacts, color=colors_ks, edgecolor='none')
ax.set_xlabel('Plants lost if removed', color='white')
ax.set_title('Top keystone pollinators', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 5. Network map
ax = fig.add_subplot(gs[1, 0:2])
ax.set_facecolor('#111827')
for i in range(n_pollinators):
    y = 1 - i / max(n_pollinators - 1, 1)
    size = poll_degree[i] * 25
    color = '#ef4444' if keystone_impact[i] > 1 else '#f59e0b' if keystone_impact[i] > 0 else '#22c55e'
    ax.scatter(-0.1, y, s=size, c=color, edgecolors='white', linewidths=0.5, zorder=5)
    ax.text(-0.25, y, pollinator_names[i][:10], color='white', fontsize=5, ha='right', va='center')

for j in range(n_plants):
    y = 1 - j / max(n_plants - 1, 1)
    size = plant_degree[j] * 20
    color = '#ef4444' if plant_degree[j] <= 1 else '#22c55e'
    ax.scatter(1.1, y, s=size, c=color, edgecolors='white', linewidths=0.5, zorder=5)

for i in range(n_pollinators):
    for j in range(n_plants):
        if binary[i, j]:
            y_p = 1 - i / max(n_pollinators - 1, 1)
            y_pl = 1 - j / max(n_plants - 1, 1)
            ax.plot([-0.1, 1.1], [y_p, y_pl], '-', color='white', alpha=0.1, linewidth=0.5)

ax.set_xlim(-0.5, 1.5)
ax.set_title('Network visualization (red = vulnerable)', color='white', fontsize=11)
ax.axis('off')

# 6. Vulnerability assessment
ax = fig.add_subplot(gs[1, 2:4])
ax.set_facecolor('#111827')
# Simulate CCD at different severities
severities = np.linspace(0, 0.8, 15)
plants_surviving = []
for sev in severities:
    mat = binary.copy()
    for b in range(n_pollinators):
        for p in range(n_plants):
            if mat[b, p] and np.random.random() < sev * (1 - generalism[b] * 0.5):
                mat[b, p] = 0
    plants_surviving.append(np.sum(np.sum(mat, axis=0) > 0))

ax.plot(severities * 100, plants_surviving, 'o-', color='#ef4444', linewidth=2, label='Without management')

# With wildflower strip
enhanced = np.hstack([binary, np.random.binomial(1, 0.3, (n_pollinators, 5))])
plants_enhanced = []
for sev in severities:
    mat = enhanced.copy()
    for b in range(n_pollinators):
        for p in range(mat.shape[1]):
            if mat[b, p] and np.random.random() < sev * (1 - generalism[b] * 0.5):
                mat[b, p] = 0
    plants_enhanced.append(np.sum(np.sum(mat, axis=0) > 0))

ax.plot(severities * 100, plants_enhanced, 'o-', color='#22c55e', linewidth=2, label='With wildflower strip')
ax.axhline(n_plants * 0.5, color='gray', linestyle=':', linewidth=1)
ax.set_xlabel('CCD severity (%)', color='white')
ax.set_ylabel('Plants with pollination', color='white')
ax.set_title('CCD resilience assessment', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# 7. Recommendations
ax = fig.add_subplot(gs[2, :])
ax.set_facecolor('#0f1729')
ax.axis('off')

# Generate recommendations based on scores
recs = []
if score_redundancy < 10:
    recs.append(("HIGH PRIORITY", "Plant diverse wildflower strips to increase pollinator redundancy"))
if max(keystone_impact) > 2:
    recs.append(("HIGH PRIORITY", f"Protect {pollinator_names[np.argmax(keystone_impact)]} — keystone species"))
if score_nestedness < 15:
    recs.append(("MEDIUM", "Encourage generalist pollinators via varied floral resources"))
if vulnerable_plants > 3:
    recs.append(("MEDIUM", f"Monitor {vulnerable_plants} plants with single pollinators"))
if score_connectance < 12:
    recs.append(("LOW", "Increase landscape floral diversity to boost network connectance"))
recs.append(("ONGOING", "Reduce pesticide use in pollinator foraging areas"))

ax.text(0.5, 0.90, f'MANAGEMENT RECOMMENDATIONS  |  Health: {health_score:.0f}/100 ({grade})',
        color=grade_color, fontsize=12, ha='center', fontweight='bold', transform=ax.transAxes)

for i, (priority, rec_text) in enumerate(recs[:5]):
    y = 0.70 - i * 0.15
    color = '#ef4444' if 'HIGH' in priority else '#f59e0b' if 'MEDIUM' in priority else '#22c55e'
    ax.text(0.05, y, f'[{priority}]', color=color, fontsize=9, fontweight='bold', transform=ax.transAxes)
    ax.text(0.22, y, rec_text, color='white', fontsize=9, transform=ax.transAxes)

ax.text(0.5, 0.02, 'Generated by Pollination Network Analyzer | Protecting the pollinators that feed the world',
        color='gray', fontsize=9, ha='center', fontstyle='italic', transform=ax.transAxes)

plt.tight_layout()
plt.show()

print("=" * 70)
print("POLLINATION NETWORK HEALTH REPORT")
print("=" * 70)
print(f"  Health Score: {health_score:.0f}/100 ({grade})")
print(f"  Connectance: {connectance:.3f}  Nestedness: {nestedness:.3f}")
print(f"  Robustness: {robustness:.3f}  Mean redundancy: {mean_redundancy:.1f}")
print(f"  Vulnerable plants (1 pollinator): {vulnerable_plants}")
print(f"  Top keystone: {pollinator_names[np.argmax(keystone_impact)]}")
print()
for priority, rec_text in recs:
    print(f"  [{priority}] {rec_text}")
print()
print("The honey hunter's lesson: care for the bees, and they will care for you.")`,
      challenge: 'Run the dashboard on a degraded network (remove 30% of interactions randomly to simulate habitat loss). Compare the health scores. How many wildflower strips would you need to add to restore the original health score?',
      successHint: 'You have built a complete, end-to-end Pollination Network Analyzer. From bipartite network construction through keystone identification, CCD modeling, resilience engineering, and management recommendations — this is a publication-quality tool that could serve real conservation and agriculture.',
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
