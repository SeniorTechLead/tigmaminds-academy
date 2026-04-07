import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ElephantCorridorLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Population viability analysis — will the herd survive?',
      concept: `**Population Viability Analysis (PVA)** estimates the probability that a population will survive for a given number of years. It incorporates:
- **Demographic stochasticity**: random variation in birth and death rates (matters more for small populations)
- **Environmental stochasticity**: unpredictable events (droughts, floods, disease outbreaks)
- **Catastrophes**: rare but devastating events (wildfire, epidemic)
- **Genetic factors**: inbreeding depression from low genetic diversity

The key output: **Minimum Viable Population (MVP)** — the smallest population that has a >95% chance of surviving 100 years. For Asian elephants, MVP estimates range from 100-500 individuals depending on habitat quality.

Many fragmented elephant populations in India are BELOW MVP. Without corridors to connect them, they face "extinction debt" — they look alive today but are mathematically doomed.`,
      analogy: 'PVA is like a stress test for a bank. You simulate thousands of possible futures — good years, bad years, crashes — and check if the bank survives in 95% of scenarios. If it fails in more than 5%, it needs more capital (for elephants: more individuals, more habitat, more connectivity).',
      storyConnection: 'The story\'s elephant herd is about 30 individuals — well below MVP. Without the corridor reconnecting them to a larger population, the PVA would predict >50% chance of extinction within 50 years. The corridor isn\'t a luxury; it\'s a mathematical necessity for survival.',
      checkQuestion: 'A population of 200 elephants loses 5 per year to poaching and gains 8 per year from births. Is this population viable?',
      checkAnswer: 'On average, yes (net growth of 3/year). But PVA reveals the risk: one bad year (drought + disease) could kill 30 elephants. With only 200, that\'s a 15% crash. Two bad years in a row could push the population below 150, where inbreeding depression kicks in, reducing birth rates further. Average growth rate isn\'t enough — you need to account for VARIANCE. A population can go extinct even with positive average growth if variance is high enough.',
      codeIntro: 'Run a Monte Carlo PVA simulation for an elephant population.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def run_pva(initial_pop, n_years, n_simulations, growth_rate, std_growth, catastrophe_prob=0.02):
    """Monte Carlo PVA simulation"""
    results = np.zeros((n_simulations, n_years))

    for sim in range(n_simulations):
        pop = initial_pop
        for year in range(n_years):
            # Environmental stochasticity
            r = np.random.normal(growth_rate, std_growth)

            # Catastrophe (rare but severe)
            if np.random.random() < catastrophe_prob:
                r -= 0.3  # 30% population crash

            # Demographic stochasticity (more important for small pops)
            if pop < 50:
                r += np.random.normal(0, 0.1)

            # Inbreeding depression below 50
            if pop < 50:
                r -= 0.02 * (50 - pop) / 50

            pop = max(pop * (1 + r), 0)
            results[sim, year] = pop

    return results

# Three scenarios
years = 100
n_sims = 500

small_pop = run_pva(30, years, n_sims, 0.02, 0.08)
medium_pop = run_pva(100, years, n_sims, 0.02, 0.08)
large_pop = run_pva(300, years, n_sims, 0.02, 0.08)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Population trajectories
ax1.set_facecolor('#111827')
for i in range(min(50, n_sims)):
    ax1.plot(small_pop[i], color='#ef4444', alpha=0.05, linewidth=0.5)
    ax1.plot(medium_pop[i], color='#f59e0b', alpha=0.05, linewidth=0.5)
    ax1.plot(large_pop[i], color='#22c55e', alpha=0.05, linewidth=0.5)

ax1.plot(np.median(small_pop, axis=0), color='#ef4444', linewidth=2, label='N₀=30')
ax1.plot(np.median(medium_pop, axis=0), color='#f59e0b', linewidth=2, label='N₀=100')
ax1.plot(np.median(large_pop, axis=0), color='#22c55e', linewidth=2, label='N₀=300')
ax1.axhline(10, color='white', linestyle=':', alpha=0.3)
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Population size', color='white')
ax1.set_title('Population Viability: 500 Simulations Each', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 800)

# Extinction probability over time
extinct_threshold = 10
ax2.set_facecolor('#111827')
for data, color, label in [(small_pop, '#ef4444', 'N₀=30'),
                            (medium_pop, '#f59e0b', 'N₀=100'),
                            (large_pop, '#22c55e', 'N₀=300')]:
    ext_prob = np.mean(data < extinct_threshold, axis=0) * 100
    ax2.plot(ext_prob, color=color, linewidth=2, label=label)

ax2.axhline(5, color='white', linestyle='--', alpha=0.3, label='5% threshold')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Cumulative extinction probability (%)', color='white')
ax2.set_title('Extinction Risk Over 100 Years', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

for label, data in [('N₀=30', small_pop), ('N₀=100', medium_pop), ('N₀=300', large_pop)]:
    ext_100 = np.mean(data[:, -1] < extinct_threshold) * 100
    print(f"  {label}: {ext_100:.1f}% extinction risk at year 100")`,
      challenge: 'Add a corridor that connects the small population (30) to the medium one (100) via immigration of 2 individuals/year. How does this change the extinction risk for the small population?',
      successHint: 'PVA is the quantitative backbone of conservation decision-making. It turns "we should protect elephants" into "we need at least 300 connected individuals to achieve 95% survival over 100 years." Numbers drive policy.',
    },
    {
      title: 'Graph theory — modeling corridor networks mathematically',
      concept: `A landscape of habitat patches and corridors is a **graph** — a mathematical structure made of **nodes** (patches) and **edges** (corridors).

Graph metrics for conservation:
- **Degree**: number of corridors connected to a patch. High-degree patches are connectivity hubs.
- **Betweenness centrality**: how often a patch sits on the shortest path between other patches. High betweenness = critical stepping stone.
- **Clustering coefficient**: how connected a patch's neighbors are to each other. High clustering = local resilience.
- **Graph connectivity**: the minimum number of corridors that must be removed to disconnect the network. Higher = more resilient.

By modeling the landscape as a graph, we can use algorithms from computer science to:
- Find the most critical corridors (whose loss would fragment the network)
- Identify optimal locations for new corridors
- Rank patches by conservation priority
- Predict how network resilience changes with habitat loss`,
      analogy: 'A corridor network is like the internet. Habitat patches are servers, corridors are cables. If one cable (corridor) fails, traffic (animals) reroutes through other paths — unless it was the ONLY cable to a region (critical link). Graph theory identifies which cables are redundant and which are irreplaceable, so you know where to invest in backup connections.',
      storyConnection: 'The story focuses on one corridor between two patches. But in reality, the elephant landscape is a network of dozens of patches and corridors. The story\'s corridor might be the most critical edge in the graph — the one whose removal disconnects an entire subnetwork. Graph analysis would reveal this instantly.',
      checkQuestion: 'A conservation agency can protect ONE corridor. Should they choose the most-used corridor (highest animal traffic) or the only corridor connecting two subnetworks (lowest redundancy)?',
      checkAnswer: 'The only corridor connecting two subnetworks — because its loss is irreversible (total disconnection). A highly-used corridor that has backup alternatives can lose traffic temporarily without catastrophe. But a non-redundant corridor, if lost, permanently fragments the network. In graph theory terms: protect the bridges (edges whose removal disconnects the graph), not the busy roads.',
      codeIntro: 'Build a corridor network as a graph and identify critical corridors using betweenness centrality.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Define a habitat patch network
# Patches (nodes) with positions
patches = {
    'A': (1, 4), 'B': (3, 6), 'C': (3, 2), 'D': (5, 4),
    'E': (7, 6), 'F': (7, 2), 'G': (9, 4), 'H': (5, 1),
}

# Corridors (edges) with widths (quality)
corridors = [
    ('A', 'B', 3), ('A', 'C', 2), ('B', 'D', 4), ('C', 'D', 3),
    ('C', 'H', 2), ('D', 'E', 3), ('D', 'F', 2), ('E', 'G', 4),
    ('F', 'G', 3), ('H', 'F', 1),
]

# Calculate betweenness centrality (simplified Floyd-Warshall + counting)
n = len(patches)
names = list(patches.keys())
idx = {name: i for i, name in enumerate(names)}

# Adjacency matrix
adj = np.full((n, n), np.inf)
for i in range(n): adj[i, i] = 0
for a, b, w in corridors:
    adj[idx[a], idx[b]] = 1/w  # inverse of width as "distance"
    adj[idx[b], idx[a]] = 1/w

# Floyd-Warshall shortest paths
dist = adj.copy()
next_hop = np.full((n, n), -1, dtype=int)
for i in range(n):
    for j in range(n):
        if adj[i, j] < np.inf and i != j:
            next_hop[i, j] = j

for k in range(n):
    for i in range(n):
        for j in range(n):
            if dist[i, k] + dist[k, j] < dist[i, j]:
                dist[i, j] = dist[i, k] + dist[k, j]
                next_hop[i, j] = next_hop[i, k]

# Edge betweenness (count how many shortest paths use each edge)
edge_between = {}
for a, b, w in corridors:
    edge_between[(a, b)] = 0

for i in range(n):
    for j in range(n):
        if i != j and dist[i, j] < np.inf:
            path = [i]
            current = i
            while current != j:
                current = next_hop[current, j]
                if current == -1: break
                path.append(current)
            for k in range(len(path)-1):
                edge = tuple(sorted([names[path[k]], names[path[k+1]]]))
                a_name, b_name = edge
                if (a_name, b_name) in edge_between:
                    edge_between[(a_name, b_name)] += 1
                elif (b_name, a_name) in edge_between:
                    edge_between[(b_name, a_name)] += 1

# Normalize
max_between = max(edge_between.values()) if edge_between.values() else 1

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Network visualization
ax1.set_facecolor('#111827')
for a, b, w in corridors:
    xa, ya = patches[a]
    xb, yb = patches[b]
    btwn = edge_between.get((a, b), edge_between.get((b, a), 0))
    color_intensity = btwn / max_between if max_between > 0 else 0
    color = plt.cm.RdYlGn_r(color_intensity)
    ax1.plot([xa, xb], [ya, yb], color=color, linewidth=w*2, alpha=0.8)

# Node degree
degree = {name: 0 for name in names}
for a, b, w in corridors:
    degree[a] += 1
    degree[b] += 1

for name, (px, py) in patches.items():
    size = degree[name] * 100
    ax1.scatter(px, py, s=size, c='#3b82f6', zorder=5, edgecolors='white', linewidth=2)
    ax1.annotate(name, xy=(px, py), xytext=(px+0.2, py+0.3), color='white', fontsize=12, fontweight='bold')

ax1.set_title('Corridor Network (color = betweenness)', color='white', fontsize=13)
ax1.set_xlabel('km', color='white')
ax1.set_ylabel('km', color='white')
ax1.tick_params(colors='gray')

# Betweenness ranking
ax2.set_facecolor('#111827')
sorted_edges = sorted(edge_between.items(), key=lambda x: x[1], reverse=True)
edge_labels = [f'{a}-{b}' for (a, b), _ in sorted_edges]
edge_vals = [v for _, v in sorted_edges]
bar_colors = ['#ef4444' if v > max_between * 0.7 else '#f59e0b' if v > max_between * 0.3 else '#22c55e' for v in edge_vals]

ax2.barh(edge_labels, edge_vals, color=bar_colors, height=0.6)
ax2.set_xlabel('Betweenness centrality (# shortest paths through edge)', color='white')
ax2.set_title('Critical Corridors: Which Ones Matter Most?', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.invert_yaxis()

plt.tight_layout()
plt.show()

print("Critical corridor analysis:")
for (a, b), v in sorted_edges[:3]:
    print(f"  {a}-{b}: betweenness = {v} (CRITICAL - protect first)")
print()
print("Losing a high-betweenness corridor fragments the entire network.")
print("Losing a low-betweenness corridor has minimal impact (redundant paths exist).")`,
      challenge: 'Remove the highest-betweenness corridor and recalculate shortest paths. How many patch pairs become disconnected? This quantifies the cost of losing one critical corridor.',
      successHint: 'Graph theory transforms conservation from "protect everything equally" to "protect the most critical connections first." With limited budgets, this mathematical prioritization can mean the difference between saving a population and losing it.',
    },
    {
      title: 'Landscape genetics — reading DNA to map corridors',
      concept: `**Landscape genetics** combines population genetics with spatial analysis to understand how landscape features affect gene flow between populations.

The key insight: if two elephant populations are genetically similar, there must be a functional corridor between them (genes are flowing). If they're genetically different despite being geographically close, there's a barrier blocking gene flow.

Genetic tools:
- **Microsatellites**: short repeating DNA sequences that mutate fast → useful for recent gene flow
- **FST (fixation index)**: measures genetic differentiation between populations. FST = 0 (identical) to FST = 1 (completely different)
- **Isolation by distance**: genetic distance should increase with geographic distance — if it increases faster, there are barriers
- **Assignment tests**: determine which population an individual "belongs to" genetically → detect migrants

By comparing genetic patterns with landscape features (roads, rivers, elevation), we can identify which landscape features act as barriers and which facilitate movement — even without GPS collars.`,
      analogy: 'Landscape genetics is like forensic DNA analysis for ecosystems. Instead of catching criminals, you\'re catching corridors. If two populations share DNA "fingerprints," they\'re connected. If they don\'t, they\'re isolated. The landscape features between them are the "suspects" — roads, rivers, mountains — and genetic analysis identifies which ones are blocking gene flow.',
      storyConnection: 'The story\'s elephants are genetically distinctive — the village elder notes they look different from elephants in the farther forest. In landscape genetics terms, the blocked corridor has caused genetic drift: the two populations are diverging because they can\'t interbreed. Restoring the corridor would restore gene flow and genetic health.',
      checkQuestion: 'Two elephant populations are separated by just 5 km of tea plantation but have high genetic differentiation (FST = 0.15). Another pair is separated by 50 km of forest and has low differentiation (FST = 0.02). What does this tell you?',
      checkAnswer: 'The 5 km tea plantation is a more effective barrier than 50 km of forest. Geographic distance alone doesn\'t predict gene flow — landscape resistance does. The tea plantation is impassable for elephants (no cover, human activity, fencing), while forest, even 50 km of it, allows easy movement. This proves that corridor quality matters more than distance.',
      codeIntro: 'Simulate how landscape barriers create genetic differentiation between populations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate genetic drift in connected vs isolated populations
def simulate_genetics(n_pops, pop_size, n_loci, n_generations, migration_matrix):
    # Initialize allele frequencies (0 to 1 for each locus)
    freqs = np.random.uniform(0.3, 0.7, (n_pops, n_loci))

    fst_history = []

    for gen in range(n_generations):
        # Genetic drift
        for pop in range(n_pops):
            for locus in range(n_loci):
                p = freqs[pop, locus]
                # Binomial sampling (drift)
                allele_count = np.random.binomial(2 * pop_size, p)
                freqs[pop, locus] = allele_count / (2 * pop_size)

        # Migration
        new_freqs = freqs.copy()
        for pop in range(n_pops):
            for source in range(n_pops):
                if source != pop:
                    m = migration_matrix[source, pop]
                    new_freqs[pop] += m * (freqs[source] - freqs[pop])
        freqs = np.clip(new_freqs, 0.01, 0.99)

        # Calculate FST
        p_bar = np.mean(freqs, axis=0)
        ht = 2 * p_bar * (1 - p_bar)
        hs = np.mean(2 * freqs * (1 - freqs), axis=0)
        fst = np.mean((ht - hs) / np.where(ht > 0, ht, 1))
        fst_history.append(fst)

    return fst_history, freqs

n_pops = 4
n_loci = 20

# Scenario 1: Well-connected (high migration)
mig_connected = np.full((n_pops, n_pops), 0.05)
np.fill_diagonal(mig_connected, 0)

# Scenario 2: Fragmented (no migration)
mig_isolated = np.zeros((n_pops, n_pops))

# Scenario 3: Corridor restored (partial migration)
mig_partial = np.zeros((n_pops, n_pops))
mig_partial[0, 1] = mig_partial[1, 0] = 0.03  # corridor between 0 and 1
mig_partial[2, 3] = mig_partial[3, 2] = 0.03  # corridor between 2 and 3

n_gen = 200
fst_conn, _ = simulate_genetics(n_pops, 50, n_loci, n_gen, mig_connected)
fst_isol, freqs_isol = simulate_genetics(n_pops, 50, n_loci, n_gen, mig_isolated)
fst_part, _ = simulate_genetics(n_pops, 50, n_loci, n_gen, mig_partial)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# FST over time
ax1.set_facecolor('#111827')
ax1.plot(fst_conn, color='#22c55e', linewidth=2, label='Connected (corridors)')
ax1.plot(fst_part, color='#f59e0b', linewidth=2, label='Partial corridors')
ax1.plot(fst_isol, color='#ef4444', linewidth=2, label='Isolated (no corridors)')
ax1.set_xlabel('Generations', color='white')
ax1.set_ylabel('FST (genetic differentiation)', color='white')
ax1.set_title('Corridors Prevent Genetic Divergence', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 0.5)

# Allele frequency distributions after isolation
ax2.set_facecolor('#111827')
pop_colors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b']
for pop in range(n_pops):
    ax2.hist(freqs_isol[pop], bins=15, alpha=0.5, color=pop_colors[pop],
             label=f'Pop {pop+1}', density=True)

ax2.set_xlabel('Allele frequency', color='white')
ax2.set_ylabel('Density', color='white')
ax2.set_title('After 200 Generations of Isolation: Drift Divergence', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Genetic differentiation (FST) after {n_gen} generations:")
print(f"  Connected: FST = {fst_conn[-1]:.4f} (low = healthy)")
print(f"  Partial:   FST = {fst_part[-1]:.4f}")
print(f"  Isolated:  FST = {fst_isol[-1]:.4f} (high = diverging)")
print()
print("Even partial connectivity (2 corridors out of 6 possible)")
print("dramatically reduces genetic divergence.")
print("Corridors are gene highways — lose them, and populations drift apart.")`,
      challenge: 'At generation 100 in the isolated scenario, "restore" corridors (switch to the connected migration matrix). How many generations does it take for FST to drop back to connected levels? This models the timeline for genetic recovery after corridor restoration.',
      successHint: 'Landscape genetics is the ultimate proof that corridors work. DNA doesn\'t lie — if populations are genetically connected, the corridors are functional. If they\'re diverging, the corridors are failing. Genetics is the ground truth for conservation.',
    },
    {
      title: 'Conservation economics — what is an elephant worth?',
      concept: `Conservation costs money. To argue for corridors, we need to answer: what is an elephant WORTH in economic terms?

**Total Economic Value (TEV)** of elephants:
- **Direct use value**: tourism revenue (~₹50 lakh/year per viewable elephant in popular parks)
- **Indirect use value**: ecosystem services (seed dispersal, habitat creation, nutrient cycling)
- **Option value**: potential future benefits (genetic resources, medical compounds)
- **Existence value**: what people are willing to pay just to know elephants exist (measured by "willingness to pay" surveys)

Cost-benefit analysis of a corridor:
- **Costs**: land purchase/lease, management, monitoring, compensation to farmers (~₹5-20 crore for a typical corridor)
- **Benefits**: prevented extinction (existence value), tourism revenue, reduced human-elephant conflict costs, ecosystem services

Studies show corridors have **benefit-cost ratios of 5:1 to 20:1**. Every rupee spent on corridors generates 5-20 rupees in benefits. Conservation isn't charity — it's investment.`,
      analogy: 'Valuing an elephant is like valuing a city park. The park doesn\'t "produce" anything you can sell. But it increases property values, reduces flooding (absorption), improves mental health, provides recreation, and makes the city livable. Similarly, elephants don\'t "earn" money directly, but the ecosystem services and cultural value they provide far exceed the cost of protecting them.',
      storyConnection: 'The village in the story initially sees the elephants as a problem (crop damage). But when they create the corridor and eco-tourists start visiting, the elephants become an asset. This economic transformation — from "elephants cost us money" to "elephants make us money" — is the foundation of community-based conservation.',
      checkQuestion: 'A mining company offers ₹100 crore to develop land that includes a critical elephant corridor. The corridor protects 200 elephants. Should the government accept?',
      checkAnswer: 'Quick analysis: 200 elephants × ₹50 lakh/year tourism value = ₹100 crore over 10 years (just from tourism). Add ecosystem services, existence value, and the fact that elephants provide these values FOREVER while mining is temporary (20-30 years), and the corridor\'s NPV far exceeds the mining revenue. Also: losing the corridor might trigger a cascade of extinction debt across the entire network. The ₹100 crore is a fraction of the long-term cost of losing the corridor.',
      codeIntro: 'Build a cost-benefit analysis for establishing an elephant corridor.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(0, 31)

# Costs (₹ crore)
land_cost = np.zeros(31)
land_cost[0] = 10  # one-time land purchase
annual_management = 0.5  # per year
compensation = 0.3  # annual farmer compensation
total_cost = land_cost + annual_management + compensation

# Benefits (₹ crore)
tourism = 0.5 * (1 - np.exp(-0.2 * years))  # grows as tourism develops
eco_services = 0.3 * np.ones(31)  # constant ecosystem services
conflict_avoided = 0.2 * (1 - np.exp(-0.3 * years))  # conflict reduction over time
existence_value = 0.4 * np.ones(31)  # willingness-to-pay (constant)
total_benefit = tourism + eco_services + conflict_avoided + existence_value

# Discount rate
discount_rate = 0.05
discount_factor = 1 / (1 + discount_rate) ** years

npv_cost = np.cumsum(total_cost * discount_factor)
npv_benefit = np.cumsum(total_benefit * discount_factor)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Annual costs and benefits
ax1.set_facecolor('#111827')
ax1.stackplot(years, tourism, eco_services, conflict_avoided, existence_value,
              colors=['#22c55e', '#3b82f6', '#f59e0b', '#a855f7'], alpha=0.7,
              labels=['Tourism', 'Ecosystem services', 'Conflict avoided', 'Existence value'])
ax1.plot(years, total_cost, color='#ef4444', linewidth=2, label='Total cost')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('₹ Crore', color='white')
ax1.set_title('Annual Costs vs. Benefits of Elephant Corridor', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='upper left')
ax1.tick_params(colors='gray')

# NPV comparison
ax2.set_facecolor('#111827')
ax2.plot(years, npv_benefit, color='#22c55e', linewidth=2, label='Cumulative benefits (NPV)')
ax2.plot(years, npv_cost, color='#ef4444', linewidth=2, label='Cumulative costs (NPV)')
ax2.fill_between(years, npv_cost, npv_benefit, where=npv_benefit > npv_cost,
                 alpha=0.15, color='#22c55e')

# Break-even point
breakeven = years[np.argmax(npv_benefit > npv_cost)]
ax2.axvline(breakeven, color='#f59e0b', linestyle='--')
ax2.annotate(f'Break-even: Year {breakeven}', xy=(breakeven, npv_cost[breakeven]),
             xytext=(breakeven + 3, npv_cost[breakeven] + 2), color='#f59e0b', fontsize=11,
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Cumulative NPV (₹ Crore)', color='white')
ax2.set_title('Cost-Benefit: Corridor Pays for Itself', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

bcr = npv_benefit[-1] / npv_cost[-1]
print(f"30-year analysis (5% discount rate):")
print(f"  Total NPV of costs: ₹{npv_cost[-1]:.1f} crore")
print(f"  Total NPV of benefits: ₹{npv_benefit[-1]:.1f} crore")
print(f"  Benefit-Cost Ratio: {bcr:.1f}:1")
print(f"  Break-even year: {breakeven}")
print()
print(f"For every ₹1 spent on the corridor, ₹{bcr:.1f} in benefits are generated.")
print("Conservation is not charity — it's one of the highest-ROI investments available.")`,
      challenge: 'What if climate change increases drought frequency, making the corridor even more critical (double the conflict-avoided benefit)? How does the BCR change? Conservation investments become MORE valuable under climate change.',
      successHint: 'From PVA to graph theory to landscape genetics to economics — Level 2 has given you the advanced toolkit for elephant corridor conservation. Each discipline adds a layer of understanding: biology tells us WHY corridors matter, genetics tells us IF they\'re working, graph theory tells us WHERE to focus, and economics tells us HOW to fund them.',
    },
    {
      title: 'Climate change and corridors — planning for an uncertain future',
      concept: `Climate change adds a new dimension to corridor planning. As temperatures rise:
- **Habitat zones shift**: forests that elephants depend on will move uphill/northward
- **Water sources change**: monsoon patterns become unpredictable, water holes dry up
- **Food availability shifts**: fruiting seasons change, affecting elephant nutrition
- **New conflict zones emerge**: as forests shift, elephants move into new human areas

**Climate-adaptive corridors** must:
- Connect current habitat to FUTURE suitable habitat
- Be wide enough to serve as habitat during transition
- Include climate refugia (areas that remain stable across climate scenarios)
- Account for uncertainty (multiple climate models give different predictions)

This is conservation planning on a 50-100 year horizon — we're not just protecting today's landscape, we're building infrastructure for tomorrow's.

**Connectivity + climate models** show that many current corridors won't be functional in 2050 because the habitat they connect will have shifted. New corridors need to be planned NOW for conditions that don't yet exist.`,
      analogy: 'Climate-adaptive corridors are like building a bridge not to where the river is today, but to where it will be after a dam is built upstream. You need hydrological models (climate models) to predict the future river course (habitat distribution) and engineer the bridge (corridor) to connect the right points in a landscape that doesn\'t yet exist.',
      storyConnection: 'The story\'s elders notice the forest is changing — trees that once flourished are struggling, new species are appearing. The elephants\' traditional corridor runs through a forest that may not exist in 50 years. Climate-adaptive planning means designing new corridors that will still be functional when today\'s children are grandparents.',
      checkQuestion: 'If climate models disagree (Model A says forest shifts north, Model B says forest shifts east), how do you plan a corridor?',
      checkAnswer: 'Use a "robust decision-making" approach: (1) Run corridor analysis under BOTH scenarios. (2) Identify corridors that work under BOTH models (robust corridors). (3) Prioritize those over corridors that only work under one scenario. (4) Add "flexible" corridors that can be extended later based on which model proves correct. Plan for the overlap, hedge against the differences.',
      codeIntro: 'Model how climate change shifts suitable elephant habitat and the corridors needed to track it.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

grid_size = 60

# Current habitat suitability (based on temperature, rainfall, forest cover)
x = np.arange(grid_size)
y = np.arange(grid_size)
X, Y = np.meshgrid(x, y)

# Current: suitable habitat in central band
current_suit = np.exp(-((Y - 30)**2 / 200 + (X - 20)**2 / 300))
current_suit += 0.7 * np.exp(-((Y - 30)**2 / 150 + (X - 45)**2 / 200))

# 2050 scenario: habitat shifts north (higher Y) and uphill
shift_y = 10  # northward shift
future_suit = np.exp(-((Y - 30 - shift_y)**2 / 200 + (X - 20)**2 / 300))
future_suit += 0.7 * np.exp(-((Y - 30 - shift_y)**2 / 150 + (X - 45)**2 / 200))

# Climate refugia (areas suitable in BOTH timeframes)
refugia = np.minimum(current_suit, future_suit)

# Corridor need: areas that connect current to future habitat
transition_zone = np.maximum(current_suit, future_suit) - refugia

fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.patch.set_facecolor('#1f2937')

titles = ['Current Habitat (2025)', 'Future Habitat (2050)', 'Climate Refugia + Corridor Need']
data = [current_suit, future_suit, None]
cmaps = ['Greens', 'Greens', None]

for ax, title, d, cmap in zip(axes[:2], titles[:2], data[:2], cmaps[:2]):
    ax.set_facecolor('#111827')
    im = ax.imshow(d, origin='lower', cmap=cmap, extent=[0, grid_size, 0, grid_size], vmin=0, vmax=1)
    # Mark core areas
    core_mask = d > 0.5
    contour = ax.contour(X, Y, d, levels=[0.5], colors=['white'], linewidths=1)
    ax.set_title(title, color='white', fontsize=11)
    ax.set_xlabel('Easting (km)', color='white')
    ax.set_ylabel('Northing (km)', color='white')
    ax.tick_params(colors='gray')

# Combined view
axes[2].set_facecolor('#111827')
# Refugia in green
axes[2].imshow(refugia, origin='lower', cmap='Greens', extent=[0, grid_size, 0, grid_size],
               alpha=0.8, vmin=0, vmax=1)
# Transition corridor in orange
transition_masked = np.ma.masked_where(transition_zone < 0.2, transition_zone)
axes[2].imshow(transition_masked, origin='lower', cmap='Oranges',
               extent=[0, grid_size, 0, grid_size], alpha=0.7)

# Arrow showing shift direction
axes[2].annotate('', xy=(30, 45), xytext=(30, 30),
                 arrowprops=dict(arrowstyle='->', color='white', lw=3))
axes[2].text(32, 37, 'Habitat\\\nshift', color='white', fontsize=10)

axes[2].set_title(titles[2], color='white', fontsize=11)
axes[2].set_xlabel('Easting (km)', color='white')
axes[2].tick_params(colors='gray')

plt.tight_layout()
plt.show()

current_area = np.sum(current_suit > 0.5)
future_area = np.sum(future_suit > 0.5)
refugia_area = np.sum(refugia > 0.3)
overlap = np.sum((current_suit > 0.5) & (future_suit > 0.5))

print("Climate change habitat analysis:")
print(f"  Current suitable habitat: {current_area} km²")
print(f"  Future suitable habitat (2050): {future_area} km²")
print(f"  Overlap (climate refugia): {overlap} km² ({overlap/current_area*100:.0f}% of current)")
print(f"  Habitat shift: ~{shift_y} km northward")
print()
print("Corridor planning implications:")
print(f"  {current_area - overlap} km² of current habitat will become unsuitable")
print(f"  {future_area - overlap} km² of new habitat will become available")
print("  Corridors must connect current core to FUTURE core areas")
print("  Climate refugia ({} km²) are the highest priority for protection".format(refugia_area))`,
      challenge: 'Add a second climate scenario where habitat shifts EAST instead of NORTH. Compute the overlap of both future scenarios. This overlap is the "robust" planning zone that works regardless of which scenario unfolds.',
      successHint: 'Climate-adaptive corridor planning is the cutting edge of conservation science. It combines ecology, genetics, graph theory, economics, and climate modeling into a single framework for protecting species not just today but for the rest of the century. The story\'s elephants need a corridor — but they need a CLIMATE-SMART corridor to survive the next 100 years.',
    },
    {
      title: 'Systematic conservation planning — optimizing protection',
      concept: `With limited budgets, where should we invest in conservation? **Systematic conservation planning** (Margules & Pressey, 2000) uses optimization algorithms to select the set of areas that meets conservation targets at minimum cost.

The algorithm (Marxan) considers:
- **Representation targets**: each species/habitat must be protected in at least X% of its range
- **Cost surface**: land purchase, management, opportunity cost (forgone agriculture)
- **Connectivity**: selected areas should be connected (for corridors)
- **Complementarity**: each new area should add species/habitats not already protected

The result is a **priority map** showing which areas give the most conservation value per rupee spent. For elephant corridors, this means identifying which corridor segments are most critical for network connectivity AND most cost-effective to protect.`,
      analogy: 'Systematic conservation planning is like optimizing a delivery route. You need to visit every customer (conservation target) while minimizing fuel (cost). You do not visit every street — only the ones that cover all customers most efficiently. Marxan finds the conservation equivalent of the optimal delivery route.',
      storyConnection: 'The story implies that protecting one corridor saves the elephants. In reality, conservation planners must choose among dozens of potential corridors with limited funds. Systematic planning identifies which corridors, if protected together, create a connected network that meets all conservation goals at minimum cost.',
      checkQuestion: 'You have funds to protect 3 out of 10 possible corridor segments. How do you choose which 3?',
      checkAnswer: 'Not by picking the 3 cheapest or the 3 with the most elephants. You pick the 3 that TOGETHER provide the most complementary value: maximum connectivity, representation of all habitat types, and bridging of the most critical gaps. This is a combinatorial optimization problem — there are 120 possible combinations of 3 from 10, and systematic planning evaluates all of them.',
      codeIntro: 'Run a simplified conservation prioritization algorithm.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# 20 potential conservation areas
n_areas = 20
cost = np.random.uniform(1, 10, n_areas)  # cost in crore
species_richness = np.random.randint(5, 30, n_areas)
connectivity_value = np.random.uniform(0, 1, n_areas)

# Combined conservation value
conservation_value = species_richness * 0.6 + connectivity_value * 30 * 0.4

# Cost-effectiveness ratio
ce_ratio = conservation_value / cost

# Select top areas by cost-effectiveness until budget exhausted
budget = 30  # crore
sorted_idx = np.argsort(ce_ratio)[::-1]
selected = []
total_cost = 0
for idx in sorted_idx:
    if total_cost + cost[idx] <= budget:
        selected.append(idx)
        total_cost += cost[idx]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
colors = ['#22c55e' if i in selected else '#ef4444' for i in range(n_areas)]
ax1.scatter(cost, conservation_value, c=colors, s=150, edgecolors='white', linewidth=0.5)
for i in range(n_areas):
    ax1.annotate(str(i+1), xy=(cost[i], conservation_value[i]),
                 xytext=(cost[i]+0.2, conservation_value[i]+0.5), color='white', fontsize=8)
ax1.set_xlabel('Cost (crore)', color='white')
ax1.set_ylabel('Conservation value', color='white')
ax1.set_title('Area Selection: Green=Selected, Red=Not', color='white', fontsize=13)
ax1.tick_params(colors='gray')

ax2.set_facecolor('#111827')
ax2.barh(range(n_areas), ce_ratio, color=colors, height=0.7)
ax2.set_xlabel('Cost-effectiveness ratio', color='white')
ax2.set_ylabel('Area ID', color='white')
ax2.set_title('Ranked by Cost-Effectiveness', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

total_value = sum(conservation_value[i] for i in selected)
total_species = sum(species_richness[i] for i in selected)
print(f"Budget: {budget} crore")
print(f"Areas selected: {len(selected)} of {n_areas}")
print(f"Total cost: {total_cost:.1f} crore")
print(f"Total conservation value: {total_value:.1f}")
print(f"Species covered: {total_species}")`,
      challenge: 'Add a connectivity constraint: selected areas must form a connected network (adjacent areas only). Does this change which areas are selected? The best individual areas may not form the best network.',
      successHint: 'Systematic conservation planning turns conservation from wishful thinking into rigorous optimization. Every corridor protected, every hectare saved, every rupee spent can be justified with data and mathematics. This is how modern conservation works.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Conservation Biology & Landscape Ecology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced ecology models. Click to start.</p>
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
