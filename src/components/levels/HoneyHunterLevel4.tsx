import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import BeeMonitoringDiagram from '../diagrams/BeeMonitoringDiagram';
import BeePathOptimizationDiagram from '../diagrams/BeePathOptimizationDiagram';
import BeeDiseaseDetectionDiagram from '../diagrams/BeeDiseaseDetectionDiagram';
import BeePollinationNetworkDiagram from '../diagrams/BeePollinationNetworkDiagram';
import BeeConservationPlanDiagram from '../diagrams/BeeConservationPlanDiagram';
import BeeDataDashboardDiagram from '../diagrams/BeeDataDashboardDiagram';

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
import warnings; warnings.filterwarnings('ignore', category=UserWarning)
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


print("\n[Full visualization in playground]")`,
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

print("\n[Full visualization in playground]")`,
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

print("\n[Full visualization in playground]")`,
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

print("\n[Full visualization in playground]")`,
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

print("\n[Full visualization in playground]")`,
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

print(f"Random  — nectar: {np.mean(random_totals):.0f} +/- {np.std(random_totals):.0f}")
print(f"Guided  — nectar: {np.mean(guided_totals):.0f} +/- {np.std(guided_totals):.0f}")
print(f"Guided advantage: {np.mean(guided_totals)/np.mean(random_totals):.1%}")

print("\\n[Full visualization in playground]")`,
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
