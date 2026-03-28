import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function WildOrchidsLevel3() {
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
      title: 'Epiphytic ecology — life in the canopy without soil',
      concept: `Wild orchids in Northeast India are predominantly **epiphytes** — plants that grow on other plants without parasitizing them. They perch on tree branches, absorbing water from rain and humidity, and nutrients from decomposing organic matter that accumulates in bark crevices.

Epiphytic adaptations include:
- **Velamen roots**: a spongy, multi-layered root covering (5-15 cells thick) that absorbs water rapidly when wet and insulates the root when dry. The velamen can absorb its weight in water within seconds.
- **CAM photosynthesis**: Crassulacean Acid Metabolism opens stomata only at night to minimize water loss. CO2 is fixed at night into organic acids and used for photosynthesis during the day.
- **Pseudobulbs**: swollen stem bases that store water and nutrients for months, buffering against drought.
- **Aerial roots**: exposed roots with chlorophyll that photosynthesize directly.

Epiphytes face a unique resource challenge: they have access to abundant light (canopy position) but limited water and almost no soil nutrients. Their entire survival strategy revolves around maximizing water and nutrient capture from atmospheric sources while minimizing losses.`,
      analogy: 'Epiphytes are like rooftop apartment dwellers who refuse to use the building plumbing. They collect rainwater on the roof, compost their own waste for nutrients, and generate their own power from sunlight. They live on the building but do not tap into its infrastructure. This makes them vulnerable to drought (no water tank backup) but gives them the best light in the building (no one above to shade them).',
      storyConnection: 'The wild orchids in the story cling to ancient trees, their roots dangling in the misty air. They are not parasites stealing from the tree — they are tenants paying no rent. The tree provides structure; the orchid provides its own water, nutrients, and energy. This arrangement has persisted for millions of years because it costs the tree almost nothing while giving the orchid everything.',
      checkQuestion: 'An orchid growing on a tree branch gets plenty of light. Why would it use CAM photosynthesis (which is less efficient than C3) instead of normal photosynthesis?',
      checkAnswer: 'Water conservation. CAM plants open stomata only at night when temperatures are lower and humidity is higher, reducing transpiration water loss by 90% compared to C3 plants that open stomata during the day. For an epiphyte with no access to ground water, water conservation is more important than photosynthetic efficiency. The orchid trades speed for survival — it grows slowly but survives droughts that would kill a C3 epiphyte.',
      codeIntro: 'Model the water balance of an epiphytic orchid comparing CAM vs C3 photosynthesis and velamen root absorption.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Water balance model for epiphytic orchid
hours = np.arange(0, 168, 0.5)  # 7 days, 30-min intervals
day_of_week = hours / 24

# Environmental conditions
temperature = 25 + 8 * np.sin(2 * np.pi * hours / 24 - np.pi/2)  # peaks at noon
humidity = 80 - 30 * np.sin(2 * np.pi * hours / 24 - np.pi/2)  # lowest at noon
is_day = np.sin(2 * np.pi * hours / 24) > 0

# Rain events (sporadic tropical rain)
rain = np.zeros_like(hours)
rain_events = [12, 36, 60, 84, 110, 140, 156]  # hours when rain starts
for re in rain_events:
    mask = (hours >= re) & (hours < re + 2)
    rain[mask] = np.random.uniform(2, 8)  # mm/hour

# CAM orchid water balance
def cam_water_balance(hours, rain, temp, humidity, is_day):
    n = len(hours)
    dt = hours[1] - hours[0]

    water_store = np.zeros(n)  # pseudobulb water (mL)
    velamen_water = np.zeros(n)  # root surface water (mL)
    stomatal_open = np.zeros(n)
    carbon_fixed = np.zeros(n)

    water_store[0] = 50  # initial water in pseudobulb
    max_store = 100

    for i in range(1, n):
        # Velamen absorption: absorbs rain rapidly
        velamen_absorption = rain[i] * 0.3  # 30% of rain captured by roots
        # Also absorbs from humidity when RH > 85%
        if humidity[i] > 85:
            velamen_absorption += 0.1 * (humidity[i] - 85) / 15

        # CAM: stomata open at NIGHT only
        if not is_day[i]:
            stomatal_open[i] = 1.0
            # Transpiration loss (lower at night)
            transpiration = 0.05 * (100 - humidity[i]) / 100 * dt
            # CO2 fixation at night
            carbon_fixed[i] = 0.1 * dt
        else:
            stomatal_open[i] = 0.0
            transpiration = 0.01 * (100 - humidity[i]) / 100 * dt  # minimal cuticular loss
            carbon_fixed[i] = 0.0  # uses stored acids for photosynthesis

        # Water balance
        water_store[i] = water_store[i-1] + velamen_absorption - transpiration
        water_store[i] = np.clip(water_store[i], 0, max_store)
        velamen_water[i] = min(velamen_absorption * 5, 10)

    return water_store, velamen_water, stomatal_open, carbon_fixed

# C3 comparison (hypothetical C3 epiphyte)
def c3_water_balance(hours, rain, temp, humidity, is_day):
    n = len(hours)
    dt = hours[1] - hours[0]
    water_store = np.zeros(n)
    water_store[0] = 50
    carbon_fixed = np.zeros(n)
    stomatal_open = np.zeros(n)

    for i in range(1, n):
        velamen_absorption = rain[i] * 0.3
        if humidity[i] > 85:
            velamen_absorption += 0.1 * (humidity[i] - 85) / 15

        if is_day[i]:
            stomatal_open[i] = 1.0
            transpiration = 0.3 * (100 - humidity[i]) / 100 * dt  # 6x more than CAM at night
            carbon_fixed[i] = 0.15 * dt  # more efficient photosynthesis
        else:
            stomatal_open[i] = 0.0
            transpiration = 0.01 * dt
            carbon_fixed[i] = 0.0

        water_store[i] = water_store[i-1] + velamen_absorption - transpiration
        water_store[i] = np.clip(water_store[i], 0, 100)

    return water_store, carbon_fixed, stomatal_open

cam_water, cam_velamen, cam_stomata, cam_carbon = cam_water_balance(hours, rain, temperature, humidity, is_day)
c3_water, c3_carbon, c3_stomata = c3_water_balance(hours, rain, temperature, humidity, is_day)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Water stores comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
for d in range(7):
    ax.axvspan(d*24, d*24+12, alpha=0.05, color='#fbbf24')
ax.plot(hours, cam_water, color='#22c55e', linewidth=2, label='CAM orchid')
ax.plot(hours, c3_water, color='#ef4444', linewidth=2, label='C3 epiphyte')
ax.fill_between(hours, 0, rain * 3, alpha=0.2, color='#3b82f6', label='Rain')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Water store (mL)', color='white')
ax.set_title('Water balance: CAM vs C3 epiphyte', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Stomatal patterns
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.fill_between(hours[:96], 0, cam_stomata[:96], alpha=0.4, color='#22c55e', label='CAM (night)')
ax.fill_between(hours[:96], 0, c3_stomata[:96], alpha=0.4, color='#ef4444', label='C3 (day)')
for d in range(4):
    ax.axvspan(d*24, d*24+12, alpha=0.05, color='#fbbf24')
ax.set_xlabel('Hours (first 4 days)', color='white')
ax.set_ylabel('Stomatal openness', color='white')
ax.set_title('Stomatal timing: CAM opens at night', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Cumulative carbon
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(hours, np.cumsum(cam_carbon), color='#22c55e', linewidth=2, label='CAM (slower)')
ax.plot(hours, np.cumsum(c3_carbon), color='#ef4444', linewidth=2, label='C3 (faster)')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Cumulative carbon (AU)', color='white')
ax.set_title('Growth rate: C3 is faster but dies of drought', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Water use efficiency
ax = axes[1, 1]
ax.set_facecolor('#111827')
cam_wue = np.sum(cam_carbon) / (50 - cam_water[-1] + np.sum(rain * 0.3 * 0.5))
c3_wue = np.sum(c3_carbon) / (50 - c3_water[-1] + np.sum(rain * 0.3 * 0.5))
bars = ax.bar(['CAM orchid', 'C3 epiphyte'], [cam_wue, c3_wue],
              color=['#22c55e', '#ef4444'], edgecolor='none')
ax.set_ylabel('Water Use Efficiency (carbon/water)', color='white')
ax.set_title(f'WUE: CAM is {cam_wue/c3_wue:.1f}x more efficient', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("EPIPHYTIC WATER BALANCE")
print(f"CAM orchid: final water = {cam_water[-1]:.1f} mL, total carbon = {np.sum(cam_carbon):.1f}")
print(f"C3 epiphyte: final water = {c3_water[-1]:.1f} mL, total carbon = {np.sum(c3_carbon):.1f}")
print(f"CAM water use efficiency: {cam_wue:.3f}")
print(f"C3 water use efficiency: {c3_wue:.3f}")
print()
print("CAM orchids survive 7 days with {:.0f}% water remaining.".format(cam_water[-1]/50*100))
print("C3 epiphytes would be critically dehydrated.")
print("This is why >70% of epiphytic orchids use CAM photosynthesis.")`,
      challenge: 'Add a 14-day drought (no rain) to the simulation. At what point does each strategy fail (water reaches zero)? How much does pseudobulb size matter for drought survival?',
      successHint: 'Epiphytic ecology is one of the great stories of plant adaptation. Orchids solved the problem of living without soil by evolving a suite of water-conserving innovations that rival anything human engineers have designed.',
    },
    {
      title: 'Mycorrhizal networks — the wood wide web',
      concept: `Beneath every forest floor lies an invisible network connecting trees, orchids, and fungi: the **mycorrhizal network** (often called the "Wood Wide Web"). This network allows trees to share resources and communicate through fungal connections.

Key components:

- **Mycorrhizal fungi**: colonize plant roots, extending their hyphae into soil far beyond root reach. The plant provides sugars (from photosynthesis) to the fungus; the fungus provides water and minerals (especially phosphorus) to the plant.
- **Common mycorrhizal networks (CMNs)**: when a single fungal individual connects multiple plants, resources can flow between plants through the fungus.
- **Orchid mycorrhiza**: uniquely, orchid seeds contain NO stored nutrients. They are dust-like (0.1mm) and MUST find a compatible fungus to germinate. The fungus feeds the embryo until it can photosynthesize — an extreme dependency called **mycoheterotrophy**.

Resource sharing through CMNs:
- Mother trees send carbon to seedlings through CMNs (Suzanne Simard's research)
- Dying trees "dump" resources into the network, which redistributes them to neighbors
- Trees under attack send chemical warning signals through CMNs
- The network creates a form of collective intelligence — the forest as a superorganism`,
      analogy: 'The mycorrhizal network is like the internet for forests. Each tree is a computer, each fungal hypha is a cable. Big trees are the servers — they have the most resources and the most connections. Small seedlings are new users downloading resources. Orchids are devices that cannot work without the network — they need a connection just to boot up. And like the internet, the network is not owned by anyone — it is an emergent collective infrastructure.',
      storyConnection: 'The wild orchids in the story grow on trees, but their real lifeline runs underground. The orchid seedling that landed on a branch years ago could only survive because a fungal network connected it to the tree\'s root system below. The tree shares sugars through the fungus; the orchid survives. Without this invisible partnership, every wild orchid in the forest would be dead.',
      checkQuestion: 'A logging company removes the largest trees from a forest but leaves the smaller ones. How does this affect the mycorrhizal network and the orchids?',
      checkAnswer: 'Catastrophically. The largest trees are the most connected "hub" nodes in the mycorrhizal network — they sustain the most fungal connections and share the most resources. Removing them fragments the network, isolating smaller trees and orchids from resource sharing. Orchid seedlings that depend on mycorrhizal carbon can no longer germinate. The fungal diversity declines because the biggest hosts are gone. Selective logging of the biggest trees destroys the network architecture far more than removing the same biomass from smaller trees.',
      codeIntro: 'Build a graph-based model of a mycorrhizal network and simulate resource sharing between trees, fungi, and orchids.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Forest mycorrhizal network model
# Nodes: trees, orchids, fungal hubs
# Edges: mycorrhizal connections with resource flow capacity

n_trees = 15
n_orchids = 8
n_fungi = 10
n_total = n_trees + n_orchids + n_fungi

# Node positions (spatial layout)
tree_pos = np.random.uniform(0, 10, (n_trees, 2))
orchid_pos = np.random.uniform(0, 10, (n_orchids, 2))
fungi_pos = np.random.uniform(0, 10, (n_fungi, 2))

# Tree sizes (determines resource production and connectivity)
tree_sizes = np.random.exponential(2, n_trees) + 1  # DBH in meters
tree_carbon = tree_sizes ** 2 * 10  # carbon production proportional to crown area

# Connectivity: nearby nodes connect through fungi
# Trees connect to fungi within 3m, orchids connect to fungi within 2m
def build_network(tree_pos, orchid_pos, fungi_pos, tree_range=3.0, orchid_range=2.0):
    edges = []
    capacities = []

    # Tree-fungus connections
    for i in range(n_trees):
        for j in range(n_fungi):
            dist = np.linalg.norm(tree_pos[i] - fungi_pos[j])
            if dist < tree_range:
                capacity = tree_carbon[i] / (dist + 0.5)  # capacity decreases with distance
                edges.append(('tree', i, 'fungus', j))
                capacities.append(capacity)

    # Orchid-fungus connections
    for i in range(n_orchids):
        for j in range(n_fungi):
            dist = np.linalg.norm(orchid_pos[i] - fungi_pos[j])
            if dist < orchid_range:
                edges.append(('orchid', i, 'fungus', j))
                capacities.append(1.0)  # orchids receive, don\'t contribute much

    return edges, np.array(capacities)

edges, capacities = build_network(tree_pos, orchid_pos, fungi_pos)

# Simulate resource flow
def simulate_resource_flow(edges, capacities, n_steps=50):
    tree_resources = tree_carbon.copy()
    orchid_resources = np.zeros(n_orchids)
    fungi_resources = np.zeros(n_fungi)

    history_tree = [tree_resources.copy()]
    history_orchid = [orchid_resources.copy()]

    for step in range(n_steps):
        # Trees produce carbon
        tree_resources += tree_carbon * 0.1

        # Flow through network
        for (type1, i1, type2, i2), cap in zip(edges, capacities):
            if type1 == 'tree' and type2 == 'fungus':
                # Tree -> Fungus: proportional to surplus
                flow = min(tree_resources[i1] * 0.05, cap * 0.1)
                tree_resources[i1] -= flow
                fungi_resources[i2] += flow * 0.7  # 30% fungal tax

        # Fungi distribute to orchids
        for (type1, i1, type2, i2), cap in zip(edges, capacities):
            if type1 == 'orchid' and type2 == 'fungus':
                if fungi_resources[i2] > 1:
                    flow = fungi_resources[i2] * 0.1
                    fungi_resources[i2] -= flow
                    orchid_resources[i1] += flow

        history_tree.append(tree_resources.copy())
        history_orchid.append(orchid_resources.copy())

    return np.array(history_tree), np.array(history_orchid)

hist_tree, hist_orchid = simulate_resource_flow(edges, capacities)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Network visualization
ax = axes[0, 0]
ax.set_facecolor('#111827')

# Draw edges
for (type1, i1, type2, i2), cap in zip(edges, capacities):
    if type1 == 'tree':
        p1 = tree_pos[i1]
    else:
        p1 = orchid_pos[i1]
    p2 = fungi_pos[i2]
    ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color='#94a3b8', linewidth=cap/10, alpha=0.3)

# Draw nodes
ax.scatter(tree_pos[:, 0], tree_pos[:, 1], s=tree_sizes * 50,
           c='#22c55e', edgecolors='white', linewidths=0.5, zorder=5, label='Trees')
ax.scatter(orchid_pos[:, 0], orchid_pos[:, 1], s=60,
           c='#a855f7', marker='*', edgecolors='white', zorder=5, label='Orchids')
ax.scatter(fungi_pos[:, 0], fungi_pos[:, 1], s=40,
           c='#f59e0b', marker='s', edgecolors='white', zorder=5, label='Fungi')

ax.set_xlim(-0.5, 10.5)
ax.set_ylim(-0.5, 10.5)
ax.set_title(f'Mycorrhizal network ({len(edges)} connections)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Resource dynamics
ax = axes[0, 1]
ax.set_facecolor('#111827')
steps = np.arange(hist_orchid.shape[0])
for i in range(n_orchids):
    ax.plot(steps, hist_orchid[:, i], linewidth=1.5, alpha=0.7, label=f'Orchid {i+1}' if i < 4 else '')
ax.set_xlabel('Time steps', color='white')
ax.set_ylabel('Resource level', color='white')
ax.set_title('Orchid resource accumulation via network', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Connectivity analysis
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Count connections per node type
tree_connections = np.zeros(n_trees)
orchid_connections = np.zeros(n_orchids)
for (type1, i1, type2, i2), _ in zip(edges, capacities):
    if type1 == 'tree':
        tree_connections[i1] += 1
    elif type1 == 'orchid':
        orchid_connections[i1] += 1

ax.scatter(tree_sizes, tree_connections, c='#22c55e', s=80, label='Trees', edgecolors='white')
ax.set_xlabel('Tree size (DBH)', color='white')
ax.set_ylabel('Network connections', color='white')
ax.set_title('Bigger trees = more connections (hub nodes)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Logging simulation: remove largest tree
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Before logging
orchid_final_before = hist_orchid[-1]

# After logging: remove the biggest tree
biggest = np.argmax(tree_sizes)
edges_after = [(t1, i1, t2, i2) for (t1, i1, t2, i2), _ in zip(edges, capacities) if not (t1 == 'tree' and i1 == biggest)]
caps_after = np.array([c for (t1, i1, _, _), c in zip(edges, capacities) if not (t1 == 'tree' and i1 == biggest)])

if len(edges_after) > 0:
    _, hist_orchid_after = simulate_resource_flow(edges_after, caps_after)
    orchid_final_after = hist_orchid_after[-1]
else:
    orchid_final_after = np.zeros(n_orchids)

x = np.arange(n_orchids)
ax.bar(x - 0.15, orchid_final_before, 0.3, color='#22c55e', label='Before logging')
ax.bar(x + 0.15, orchid_final_after, 0.3, color='#ef4444', label='After removing hub tree')
ax.set_xlabel('Orchid ID', color='white')
ax.set_ylabel('Final resources', color='white')
ax.set_title('Impact of removing the largest tree', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

loss = 1 - np.sum(orchid_final_after) / (np.sum(orchid_final_before) + 1e-10)
print("MYCORRHIZAL NETWORK ANALYSIS")
print(f"Network: {n_trees} trees, {n_orchids} orchids, {n_fungi} fungi, {len(edges)} connections")
print(f"Hub tree (largest): {tree_sizes[biggest]:.1f} DBH, {int(tree_connections[biggest])} connections")
print(f"Orchid resources before logging: {np.sum(orchid_final_before):.1f}")
print(f"Orchid resources after logging: {np.sum(orchid_final_after):.1f}")
print(f"Resource loss: {loss:.0%}")
print()
print("Removing a single hub tree can collapse resource flow to orchids.")
print("This is why selective logging of the biggest trees is so destructive —")
print("it breaks the network architecture that sustains forest biodiversity.")`,
      challenge: 'Simulate a disease that kills a fungal species (remove one fungal node and all its connections). Compare the impact of losing a central vs peripheral fungal node. Which has more catastrophic consequences?',
      successHint: 'Mycorrhizal networks are among the most important discoveries in forest ecology in the last 30 years. They show that a forest is not a collection of competing individuals — it is a cooperative network where the health of each organism depends on the health of the whole.',
    },
    {
      title: 'Symbiosis spectrum — from mutualism to parasitism',
      concept: `The orchid-tree-fungus relationship is not simply "mutualistic." Symbiotic relationships exist on a **spectrum** that can shift depending on conditions:

- **Mutualism** (+/+): both partners benefit. The tree provides carbon to the fungus, the fungus provides phosphorus to the tree.
- **Commensalism** (+/0): one benefits, the other is unaffected. The orchid perching on a tree branch neither helps nor harms the tree.
- **Parasitism** (+/-): one benefits at the other's expense. Some orchids (e.g., Gastrodia) have lost the ability to photosynthesize entirely and steal ALL their carbon from fungal networks — they are **mycoheterotrophs**, essentially parasites of the mycorrhizal network.

The spectrum is dynamic:
- In nutrient-rich soil, the fungus may become a **parasite** on the tree (taking sugar without providing proportional minerals)
- In nutrient-poor soil, the fungus is a valuable **mutualist** (providing essential phosphorus)
- Under drought stress, the tree may cut off carbon supply to the fungus (ending the mutualism)

The cost-benefit balance determines whether a relationship is mutualistic or parasitic AT ANY GIVEN MOMENT. There is no permanent category — only a context-dependent equilibrium.`,
      analogy: 'The symbiosis spectrum is like a business partnership. When both companies bring unique skills, it is mutualistic — both profit. If one company stops contributing but keeps taking, it becomes parasitic. If market conditions change (nutrient levels shift), a formerly productive partnership can become a drain. The label "partner" or "parasite" depends entirely on who is contributing what at that moment.',
      storyConnection: 'The wild orchids and trees in the story seem to live in perfect harmony. But the relationship is more nuanced. Some orchids are good tenants — they photosynthesize their own food and only borrow structural support. Others are cheating — they tap into the mycorrhizal network and steal carbon without contributing anything. The forest tolerates these cheaters as long as they are rare. If every orchid became a parasite, the system would collapse.',
      checkQuestion: 'A fully mycoheterotrophic orchid (no chlorophyll, no photosynthesis) is found thriving in a dark forest understory. Where does its carbon come from?',
      checkAnswer: 'From photosynthetic trees, via the mycorrhizal fungal network. The tree photosynthesizes and shares carbon with its mycorrhizal fungus. The non-photosynthetic orchid taps into the SAME fungal network and extracts carbon that was originally produced by the tree. The orchid is essentially parasitizing the tree-fungus mutualism. The fungus is the unwitting intermediary. This has been confirmed using carbon isotope tracing — the carbon in the orchid matches the isotopic signature of the host tree, not the atmosphere.',
      codeIntro: 'Model the symbiosis spectrum with cost-benefit dynamics that shift with environmental conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Symbiosis cost-benefit model
# Two organisms: host (tree) and symbiont (fungus/orchid)
# Each has a cost (resources given) and benefit (resources received)

def symbiosis_dynamics(n_steps=200, soil_nutrient=0.5, drought_severity=0.0):
    """Simulate shifting symbiosis under changing conditions."""
    host_fitness = np.zeros(n_steps)
    symbiont_fitness = np.zeros(n_steps)
    interaction_type = np.zeros(n_steps)  # -1=parasitism, 0=commensalism, 1=mutualism

    host_resources = 100.0
    symbiont_resources = 50.0

    for t in range(n_steps):
        # Host carbon production (reduced by drought)
        host_production = 10 * (1 - drought_severity * np.sin(2*np.pi*t/100))

        # Symbiont mineral provision (proportional to soil nutrients)
        mineral_provision = 5 * soil_nutrient * symbiont_resources / 50

        # Carbon cost to host (symbiont extracts carbon)
        carbon_cost = 3 * symbiont_resources / 50

        # Net benefit to host
        host_net = mineral_provision - carbon_cost
        # Net benefit to symbiont
        symbiont_net = carbon_cost * 0.8 - 1.0  # metabolic overhead

        # Update resources
        host_resources += host_production + host_net
        symbiont_resources += symbiont_net

        # Clamp
        host_resources = np.clip(host_resources, 0, 200)
        symbiont_resources = np.clip(symbiont_resources, 0, 100)

        host_fitness[t] = host_resources
        symbiont_fitness[t] = symbiont_resources

        # Classify interaction
        if host_net > 0.5 and symbiont_net > 0:
            interaction_type[t] = 1  # mutualism
        elif host_net < -0.5 and symbiont_net > 0:
            interaction_type[t] = -1  # parasitism
        else:
            interaction_type[t] = 0  # commensalism

    return host_fitness, symbiont_fitness, interaction_type

# Run under different conditions
conditions = [
    ('Nutrient-poor soil (mutualistic)', 0.2, 0.0),
    ('Nutrient-rich soil (parasitic shift)', 0.9, 0.0),
    ('Drought stress (mutualism collapses)', 0.5, 0.5),
    ('Stable conditions (balanced)', 0.5, 0.0),
]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

for idx, (name, nutrient, drought) in enumerate(conditions):
    ax = axes[idx // 2, idx % 2]
    ax.set_facecolor('#111827')

    h_fit, s_fit, interact = symbiosis_dynamics(200, nutrient, drought)

    ax.plot(h_fit, color='#22c55e', linewidth=2, label='Host (tree)')
    ax.plot(s_fit, color='#a855f7', linewidth=2, label='Symbiont (fungus)')

    # Color background by interaction type
    for t in range(len(interact) - 1):
        if interact[t] > 0.5:
            ax.axvspan(t, t+1, alpha=0.05, color='#22c55e')
        elif interact[t] < -0.5:
            ax.axvspan(t, t+1, alpha=0.05, color='#ef4444')

    mut_frac = np.mean(interact > 0.5)
    par_frac = np.mean(interact < -0.5)
    com_frac = 1 - mut_frac - par_frac

    ax.set_title(f'{name}\\nMut:{mut_frac:.0%} Com:{com_frac:.0%} Par:{par_frac:.0%}',
                 color='white', fontsize=10)
    ax.set_xlabel('Time', color='white')
    ax.set_ylabel('Fitness', color='white')
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
    ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("SYMBIOSIS SPECTRUM ANALYSIS")
for name, nutrient, drought in conditions:
    h, s, interact = symbiosis_dynamics(200, nutrient, drought)
    mut = np.mean(interact > 0.5)
    par = np.mean(interact < -0.5)
    print(f"  {name}:")
    print(f"    Mutualism: {mut:.0%}, Parasitism: {par:.0%}")
    print(f"    Host final: {h[-1]:.0f}, Symbiont final: {s[-1]:.0f}")
print()
print("The same relationship shifts from mutualism to parasitism")
print("depending on environmental context. There are no permanent categories.")`,
      challenge: 'Add a mycoheterotrophic orchid that extracts carbon from the network without contributing. At what density of cheaters does the whole network collapse?',
      successHint: 'The symbiosis spectrum challenges the simplistic view of nature as either cooperation or competition. Most biological relationships are context-dependent — they can shift from mutualism to parasitism and back within a single organism\'s lifetime.',
    },
    {
      title: 'Orchid mycorrhiza — the unique dependency',
      concept: `Orchid seeds are among the smallest in the plant kingdom — 0.05 to 0.5 mm, weighing as little as 0.3 micrograms. They contain no endosperm (food reserve). This makes orchid germination entirely dependent on **mycorrhizal fungi**.

The germination process:
1. Orchid seed lands on substrate (bark, moss)
2. Fungal hyphae penetrate the seed coat and enter the embryo cells
3. Fungus forms **pelotons** (coiled hyphal masses) inside embryo cells
4. The embryo digests the pelotons, extracting carbon, nitrogen, and phosphorus
5. A **protocorm** (undifferentiated mass) develops
6. After months to years, the protocorm develops into a seedling with roots and leaves

This dependency means orchid diversity is limited by fungal diversity. If the right fungus is not present, the seed cannot germinate — even if light, water, and nutrients are perfect.

The specificity varies:
- Some orchids accept many fungal species (generalist)
- Others require one specific fungal genus (specialist)
- Specialist orchids are more vulnerable to habitat disturbance`,
      analogy: 'Orchid germination is like trying to start a car without a battery. The seed is the car (has the engine = genetic instructions) but lacks the battery (no stored energy). The fungus is a portable battery pack. Without it, the car sits dead on the road no matter how much fuel is available elsewhere. The orchid seed contains all the genetic information to become a plant, but it cannot access that information without the fungal energy supply.',
      storyConnection: 'Every wild orchid in the story began as a dust-like seed that landed by chance on a branch. Most seeds died — they never found a fungal partner. The ones that survived did so because a compatible fungus happened to be growing on that same branch. The wild orchid exists because of a chance encounter that happened years or decades ago.',
      checkQuestion: 'A conservation project wants to reintroduce a rare orchid species to a restored forest. They collect seeds and scatter them on trees. Why might this fail?',
      checkAnswer: 'The compatible mycorrhizal fungus may not be present in the restored forest. Even if the trees, light, and moisture are perfect, orchid seeds cannot germinate without their specific fungal partner. The conservation project must either: (1) inoculate the substrate with the correct fungal species first, (2) transplant established orchid plants instead of seeds, or (3) germinate seeds asymbiotically in a lab (using artificial nutrient media) and transplant the seedlings. This is why orchid conservation is so difficult — you must conserve the fungal partner too.',
      codeIntro: 'Model orchid seed germination probability as a function of fungal compatibility, specificity, and environmental conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Orchid germination model
# Seed success depends on: fungal presence, compatibility, environmental conditions

n_fungal_species = 20
n_orchid_species = 10
n_sites = 100

# Fungal community at each site (presence/absence)
fungal_presence = np.random.binomial(1, 0.3, (n_sites, n_fungal_species))

# Orchid-fungus compatibility matrix
# Some orchids are generalists (compatible with many fungi)
# Others are specialists (compatible with 1-2 fungi)
compatibility = np.zeros((n_orchid_species, n_fungal_species))
specialization = np.random.choice(['generalist', 'moderate', 'specialist'],
                                    n_orchid_species, p=[0.3, 0.4, 0.3])

for i in range(n_orchid_species):
    if specialization[i] == 'generalist':
        n_compat = np.random.randint(5, 12)
    elif specialization[i] == 'moderate':
        n_compat = np.random.randint(2, 5)
    else:
        n_compat = np.random.randint(1, 3)
    compat_fungi = np.random.choice(n_fungal_species, n_compat, replace=False)
    compatibility[i, compat_fungi] = 1

# Germination probability at each site for each orchid
def calc_germination_prob(fungal_presence, compatibility, env_quality=0.7):
    n_sites, n_fungi = fungal_presence.shape
    n_orchids = compatibility.shape[0]

    probs = np.zeros((n_orchids, n_sites))
    for i in range(n_orchids):
        for j in range(n_sites):
            # Compatible fungi present?
            compatible_present = np.sum(fungal_presence[j] * compatibility[i])
            if compatible_present > 0:
                # Probability increases with more compatible partners
                fungal_prob = 1 - (1 - 0.3) ** compatible_present
                probs[i, j] = fungal_prob * env_quality
            else:
                probs[i, j] = 0  # no compatible fungus = zero germination

    return probs

probs = calc_germination_prob(fungal_presence, compatibility)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Compatibility matrix
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.imshow(compatibility, aspect='auto', cmap='Greens')
ax.set_xlabel('Fungal species', color='white')
ax.set_ylabel('Orchid species', color='white')
ax.set_title('Orchid-fungus compatibility matrix', color='white', fontsize=11)
for i in range(n_orchid_species):
    ax.text(-2.5, i, specialization[i][:4], fontsize=7, color='white', va='center')
ax.tick_params(colors='gray')

# Germination probability by specialization
ax = axes[0, 1]
ax.set_facecolor('#111827')
for spec_type, color in [('generalist', '#22c55e'), ('moderate', '#f59e0b'), ('specialist', '#ef4444')]:
    mask = specialization == spec_type
    if np.any(mask):
        mean_probs = np.mean(probs[mask], axis=1)
        ax.hist(mean_probs, bins=20, alpha=0.5, color=color, label=f'{spec_type} (n={sum(mask)})')

ax.set_xlabel('Mean germination probability', color='white')
ax.set_ylabel('Orchid count', color='white')
ax.set_title('Specialists have lower germination success', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Habitat loss simulation
ax = axes[1, 0]
ax.set_facecolor('#111827')
loss_fractions = np.linspace(0, 0.9, 20)
survival_gen = []
survival_spec = []

for loss in loss_fractions:
    # Remove random fungal species
    n_remove = int(loss * n_fungal_species)
    remaining = np.ones(n_fungal_species)
    if n_remove > 0:
        removed = np.random.choice(n_fungal_species, n_remove, replace=False)
        remaining[removed] = 0

    # Reduced fungal presence
    fp_reduced = fungal_presence * remaining[np.newaxis, :]
    probs_reduced = calc_germination_prob(fp_reduced, compatibility)

    gen_mask = specialization == 'generalist'
    spec_mask = specialization == 'specialist'

    survival_gen.append(np.mean(probs_reduced[gen_mask]) if np.any(gen_mask) else 0)
    survival_spec.append(np.mean(probs_reduced[spec_mask]) if np.any(spec_mask) else 0)

ax.plot(loss_fractions * 100, survival_gen, 'o-', color='#22c55e', linewidth=2, label='Generalist orchids')
ax.plot(loss_fractions * 100, survival_spec, 'o-', color='#ef4444', linewidth=2, label='Specialist orchids')
ax.set_xlabel('Fungal species loss (%)', color='white')
ax.set_ylabel('Mean germination probability', color='white')
ax.set_title('Specialists collapse first under habitat loss', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Seed rain simulation
ax = axes[1, 1]
ax.set_facecolor('#111827')
n_seeds = 10000
seed_fates = {'Germinated': 0, 'No fungus': 0, 'Wrong fungus': 0, 'Bad site': 0}

for _ in range(n_seeds):
    orchid_sp = np.random.randint(n_orchid_species)
    site = np.random.randint(n_sites)
    env_ok = np.random.random() < 0.7

    if not env_ok:
        seed_fates['Bad site'] += 1
    elif np.sum(fungal_presence[site]) == 0:
        seed_fates['No fungus'] += 1
    elif probs[orchid_sp, site] == 0:
        seed_fates['Wrong fungus'] += 1
    elif np.random.random() < probs[orchid_sp, site]:
        seed_fates['Germinated'] += 1
    else:
        seed_fates['Wrong fungus'] += 1

colors_pie = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6']
ax.pie(seed_fates.values(), labels=seed_fates.keys(), colors=colors_pie,
       autopct='%1.1f%%', textprops={'fontsize': 9, 'color': 'white'})
ax.set_title(f'Fate of {n_seeds} orchid seeds', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("ORCHID GERMINATION ANALYSIS")
print(f"Orchid species: {n_orchid_species} ({sum(specialization=='generalist')} gen, "
      f"{sum(specialization=='moderate')} mod, {sum(specialization=='specialist')} spec)")
print(f"Fungal species: {n_fungal_species}")
print()
print("Seed fate simulation ({} seeds):".format(n_seeds))
for fate, count in seed_fates.items():
    print(f"  {fate}: {count} ({count/n_seeds:.1%})")
print()
print("Most orchid seeds fail because the right fungus is not present.")
print("Specialist orchids are most vulnerable to fungal diversity loss.")`,
      challenge: 'Model asymbiotic germination in a lab: orchid seeds are placed on nutrient agar without fungus. What nutrients must the agar contain to replace the fungal partner? How does lab germination rate compare to natural rates?',
      successHint: 'Orchid mycorrhiza is one of the most extreme dependencies in the plant kingdom. Understanding it is essential for orchid conservation — you cannot save the orchid without saving its fungus.',
    },
    {
      title: 'Aerial root physiology — breathing and absorbing in mid-air',
      concept: `Epiphytic orchid roots are among the most remarkable organs in the plant kingdom. Unlike terrestrial roots that grow in soil, aerial roots hang in open air and must perform multiple functions simultaneously:

1. **Water absorption**: the velamen (spongy outer layer) absorbs rain and dew within seconds
2. **Gas exchange**: roots need O2 for respiration; the velamen allows gas diffusion when dry
3. **Photosynthesis**: many aerial roots contain chloroplasts and are green
4. **Structural anchorage**: roots attach to bark through mechanical adhesion and root hairs
5. **Mycorrhizal interface**: the inner cortex houses the fungal partner

The **velamen** is the key innovation — a dead, spongy tissue 3-18 cells thick:
- When dry: air-filled, white/silver, allows gas exchange
- When wet: water-filled, green (chloroplasts visible), absorbs water rapidly
- Contains specialized passage cells that selectively transport water to living cortex

The velamen acts as a **controlled interface** between the plant and the atmosphere — absorbing water when available and preventing desiccation when dry. No terrestrial root does this.`,
      analogy: 'The velamen is like a smart sponge with a one-way valve. When it rains, the sponge soaks up water instantly and channels it inward to the plant. When the sun comes out, the sponge dries and becomes an insulating air layer that protects the root from desiccation. Imagine if your skin could switch from "absorb water" mode in the shower to "block water loss" mode in the desert — that is what the velamen does.',
      storyConnection: 'The wild orchids in the story dangle their roots in the misty air — silver-white tentacles reaching into nothing. These roots look dead but they are alive and actively managing the orchid\'s water supply. Each morning mist deposits a fine layer of water droplets on the velamen, which absorbs them in seconds. The orchid drinks from the air.',
      checkQuestion: 'An orchid collector grows orchids indoors with regular watering. The roots are always green (wet velamen). Is this a problem?',
      checkAnswer: 'Yes. Constantly wet velamen prevents gas exchange to the inner root cortex. Without oxygen, root respiration stops and the root begins to rot. Orchid roots need a wet-dry cycle: wet (absorb water), then dry (gas exchange and prevent root rot). Over-watering is the number one killer of cultivated orchids. The velamen is designed for intermittent rain, not constant moisture. Indoor orchid care must mimic the epiphytic wet-dry cycle.',
      codeIntro: 'Model the velamen absorption-drying cycle and compare gas exchange rates in wet vs dry states.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Velamen dynamics model
hours = np.arange(0, 120, 0.25)  # 5 days, 15-min intervals

# Environmental conditions
humidity = 70 + 20 * np.sin(2 * np.pi * hours / 24 - np.pi)  # higher at night
rain = np.zeros_like(hours)
# Rain events
for start in [6, 30, 54, 78, 102]:
    mask = (hours >= start) & (hours < start + 1)
    rain[mask] = 5  # mm/hour

# Mist events (early morning)
mist = np.zeros_like(hours)
for day in range(5):
    mask = (hours >= day*24 + 4) & (hours < day*24 + 7)
    mist[mask] = 0.5  # light mist

def velamen_model(hours, rain, mist, humidity):
    n = len(hours)
    dt = hours[1] - hours[0]

    velamen_water = np.zeros(n)  # 0 = dry, 1 = saturated
    gas_exchange = np.zeros(n)  # O2 diffusion rate
    water_absorbed = np.zeros(n)  # water delivered to cortex
    root_health = np.zeros(n)
    root_health[0] = 100

    for i in range(1, n):
        # Absorption
        if rain[i] > 0:
            # Rapid absorption from rain
            absorption_rate = 0.8 * (1 - velamen_water[i-1])  # faster when dry
            velamen_water[i] = min(1, velamen_water[i-1] + absorption_rate * dt)
        elif mist[i] > 0:
            # Slow absorption from mist
            absorption_rate = 0.1 * (1 - velamen_water[i-1])
            velamen_water[i] = min(1, velamen_water[i-1] + absorption_rate * dt)
        else:
            # Evaporation (faster in low humidity)
            evap_rate = 0.05 * (1 - humidity[i]/100) * velamen_water[i-1]
            velamen_water[i] = max(0, velamen_water[i-1] - evap_rate * dt)

        # Gas exchange: inversely proportional to water content
        gas_exchange[i] = (1 - velamen_water[i]) ** 2  # air-filled velamen allows gas diffusion

        # Water delivery to cortex (through passage cells)
        if velamen_water[i] > 0.3:  # threshold for transport
            water_absorbed[i] = 0.2 * (velamen_water[i] - 0.3) * dt

        # Root health: needs both water and oxygen
        water_stress = 1.0 if np.mean(water_absorbed[max(0,i-48):i+1]) > 0.01 else 0.5
        oxygen_level = np.mean(gas_exchange[max(0,i-24):i+1])
        root_health[i] = root_health[i-1] + 0.1 * (water_stress * oxygen_level - 0.3) * dt
        root_health[i] = np.clip(root_health[i], 0, 100)

    return velamen_water, gas_exchange, water_absorbed, root_health

vw, ge, wa, rh = velamen_model(hours, rain, mist, humidity)

# Overwatered comparison (always wet)
rain_overwater = np.ones_like(hours) * 2  # constant drip
vw_ow, ge_ow, wa_ow, rh_ow = velamen_model(hours, rain_overwater, mist*0, humidity)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Velamen water content and gas exchange
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.fill_between(hours, 0, rain / 5, alpha=0.2, color='#3b82f6', label='Rain')
ax.fill_between(hours, 0, mist, alpha=0.2, color='#06b6d4', label='Mist')
ax.plot(hours, vw, color='#22c55e', linewidth=2, label='Velamen water')
ax.plot(hours, ge, color='#f59e0b', linewidth=2, label='Gas exchange')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Level (0-1)', color='white')
ax.set_title('Velamen wet-dry cycle (normal)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Root health comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(hours, rh, color='#22c55e', linewidth=2, label='Normal watering')
ax.plot(hours, rh_ow, color='#ef4444', linewidth=2, label='Overwatered')
ax.axhline(50, color='#f59e0b', linestyle='--', alpha=0.5, label='Danger zone')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Root health (%)', color='white')
ax.set_title('Overwatering kills orchid roots', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Velamen cross-section model
ax = axes[1, 0]
ax.set_facecolor('#111827')
# Simulate velamen as layers
n_layers = 8
layer_water = np.zeros(n_layers)
times_to_show = [0, 5, 15, 60]  # minutes after rain
colors_t = ['#94a3b8', '#60a5fa', '#3b82f6', '#1d4ed8']

x_pos = np.arange(n_layers)
for t_idx, t_min in enumerate(times_to_show):
    # Outer layers fill first
    for layer in range(n_layers):
        delay = layer * 2  # minutes to reach each layer
        if t_min >= delay:
            fill_time = t_min - delay
            layer_water[layer] = min(1, fill_time / 5)

    offset = t_idx * (n_layers + 2)
    bars = ax.bar(x_pos + offset, layer_water, color=colors_t[t_idx], edgecolor='none')
    ax.text(offset + n_layers/2, 1.05, f't={t_min}min', ha='center', color='white', fontsize=8)

ax.set_ylabel('Water saturation', color='white')
ax.set_title('Velamen fills from outside in', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.set_xticks([])

# Water budget
ax = axes[1, 1]
ax.set_facecolor('#111827')
total_rain = np.sum(rain * 0.25)  # mm total
total_mist = np.sum(mist * 0.25)
total_absorbed = np.sum(wa)
total_evaporated = total_rain + total_mist - total_absorbed

budget = {
    'Rain input': total_rain,
    'Mist input': total_mist * 10,
    'Absorbed to cortex': total_absorbed * 100,
    'Evaporated': max(0, (total_rain + total_mist*10 - total_absorbed*100)),
}
bars = ax.barh(list(budget.keys()), list(budget.values()),
               color=['#3b82f6', '#06b6d4', '#22c55e', '#ef4444'], edgecolor='none')
ax.set_xlabel('Water (arbitrary units)', color='white')
ax.set_title('Water budget: most rain is lost to evaporation', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("AERIAL ROOT PHYSIOLOGY")
print(f"Velamen water cycles: {sum(np.diff(vw > 0.5) > 0)} wet-dry cycles in 5 days")
print(f"Normal root health after 5 days: {rh[-1]:.0f}%")
print(f"Overwatered root health: {rh_ow[-1]:.0f}% (root rot!)")
print()
print("The velamen is an engineering masterpiece:")
print("  - Absorbs its weight in water in seconds")
print("  - Dries within hours, restoring gas exchange")
print("  - The wet-dry cycle is ESSENTIAL — constant moisture kills the root")
print("  - This is why 'water orchids, then let them dry' is the golden rule")`,
      challenge: 'Model how velamen thickness (number of cell layers) affects the trade-off between water absorption capacity and drying time. Is there an optimal thickness for different humidity environments?',
      successHint: 'Aerial root physiology is a masterclass in engineering trade-offs. The velamen must balance water absorption against gas exchange, structural support against flexibility, and protection against permeability. Understanding these trade-offs is key to orchid cultivation and conservation.',
    },
    {
      title: 'Cloud forest hydrology — water from thin air',
      concept: `The wild orchids of Northeast India thrive in **cloud forests** — montane forests persistently bathed in clouds and fog. These ecosystems capture water from the atmosphere through a process called **fog interception** or **horizontal precipitation**.

Cloud forest hydrology:
- **Vertical precipitation** (rain): 2000-4000 mm/year
- **Horizontal precipitation** (fog drip): adds 20-60% MORE water than rain alone
- Epiphytes like orchids, mosses, and ferns intercept fog on their surfaces; the water drips down to roots and soil

How fog interception works:
1. Cloud droplets (5-40 micrometers) are carried by wind
2. Droplets collide with plant surfaces (leaves, roots, moss)
3. Surface tension holds droplets on the surface
4. Droplets coalesce into larger drops that drip to the ground

The efficiency depends on:
- **Surface area**: more epiphyte biomass = more fog capture (orchids increase fog interception by 10-30%)
- **Wind speed**: faster wind = more droplets hitting surfaces
- **Droplet size**: very small droplets follow air streamlines around obstacles; larger droplets collide
- **Surface properties**: hydrophilic surfaces capture better than hydrophobic ones (opposite of the lotus!)

Cloud forests are among the most threatened ecosystems. Climate change is lifting the cloud base altitude, potentially moving clouds above the forest canopy and cutting off the fog water supply.`,
      analogy: 'Cloud forest hydrology is like a comb catching lint from the air. The trees and epiphytes are the teeth of the comb. The clouds are the lint-laden air. As the air flows through the forest canopy, water droplets are caught on surfaces, just as lint catches on comb teeth. More teeth (more epiphyte surface area) catch more lint (water). If you raise the comb above the lint level (cloud base rises above canopy), it catches nothing.',
      storyConnection: 'The wild orchids in the story grow in misty forests where clouds cling to the treetops. These orchids are not just living in the cloud forest — they are part of its water cycle. Their dangling roots and spongy velamen intercept fog droplets that would otherwise blow past. The orchids drink from the clouds and, in doing so, help the entire forest capture more water.',
      checkQuestion: 'Climate models predict the cloud base in Meghalaya will rise 200 meters by 2050. What happens to the orchid populations at the current forest elevation?',
      checkAnswer: 'Catastrophic decline. If the cloud base rises above the forest canopy, horizontal precipitation drops to near zero — a 20-60% reduction in total water input. Epiphytes that depend on fog (orchids, mosses, ferns) are the first casualties because they have no access to ground water. Their death creates a feedback loop: fewer epiphytes means less fog interception, which means less water for the entire forest, which means tree stress and mortality. Cloud forest ecosystems can collapse rapidly once the cloud base lifts above the canopy.',
      codeIntro: 'Model fog interception by a cloud forest canopy with and without epiphytes, and simulate the impact of cloud base elevation change.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Cloud forest fog interception model
# Fog water capture = efficiency * wind_speed * liquid_water_content * surface_area

def fog_interception(canopy_area, epiphyte_fraction, wind_speed, lwc, time_hours):
    """Calculate fog water capture over time.
    canopy_area: m^2 of projected canopy
    epiphyte_fraction: additional surface area from epiphytes (0-1)
    wind_speed: m/s
    lwc: liquid water content of cloud (g/m^3)
    """
    # Collection efficiency (fraction of droplets that stick)
    # Depends on droplet size and obstacle size
    base_efficiency = 0.15  # bare canopy
    epiphyte_efficiency = 0.35  # epiphyte-laden canopy (more fine surfaces)

    total_area = canopy_area * (1 + epiphyte_fraction)
    efficiency = base_efficiency + epiphyte_fraction * (epiphyte_efficiency - base_efficiency)

    # Fog water flux (L/m^2/hour)
    fog_flux = efficiency * wind_speed * lwc / 1000  # L/m^2/h

    # Total capture over time
    total_water = fog_flux * total_area * time_hours
    return total_water, fog_flux

# Scenario comparison
hours_per_month = 24 * 30
wind = 3.0  # m/s average
lwc = 0.3  # g/m^3 (typical cloud)
canopy = 1000  # m^2

# With and without epiphytes
water_no_epi, flux_no_epi = fog_interception(canopy, 0, wind, lwc, hours_per_month)
water_with_epi, flux_with_epi = fog_interception(canopy, 0.5, wind, lwc, hours_per_month)

# Climate change: cloud base lifting
altitudes = np.arange(1000, 2500, 50)  # meters
current_cloud_base = 1500
future_cloud_base = 1700

# Forest at 1600m elevation
forest_alt = 1600
fog_hours_current = np.clip((current_cloud_base + 500 - altitudes) / 500 * hours_per_month, 0, hours_per_month)
fog_hours_future = np.clip((future_cloud_base + 500 - altitudes) / 500 * hours_per_month, 0, hours_per_month)

current_water = [fog_interception(canopy, 0.5, wind, lwc, fh)[0] for fh in fog_hours_current]
future_water = [fog_interception(canopy, 0.5, wind, lwc, fh)[0] for fh in fog_hours_future]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Epiphyte effect on fog capture
ax = axes[0, 0]
ax.set_facecolor('#111827')
epi_fracs = np.linspace(0, 1.0, 20)
waters = [fog_interception(canopy, ef, wind, lwc, hours_per_month)[0] for ef in epi_fracs]
ax.plot(epi_fracs * 100, np.array(waters) / 1000, 'o-', color='#22c55e', linewidth=2)
ax.set_xlabel('Epiphyte cover (% additional surface area)', color='white')
ax.set_ylabel('Monthly fog water (m³)', color='white')
ax.set_title('Epiphytes increase fog water capture', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Water budget: rain + fog
ax = axes[0, 1]
ax.set_facecolor('#111827')
months = ['J','F','M','A','M','J','J','A','S','O','N','D']
# Typical NE India rainfall (mm/month)
rainfall = [15, 25, 60, 180, 300, 400, 450, 350, 250, 120, 30, 10]
fog_water = [flux_with_epi * 24 * 30 * 10] * 12  # mm/month equivalent (simplified)

x = np.arange(12)
ax.bar(x, rainfall, 0.4, color='#3b82f6', label='Rain')
ax.bar(x, fog_water, 0.4, bottom=rainfall, color='#06b6d4', label='Fog')
ax.set_xticks(x)
ax.set_xticklabels(months, color='white')
ax.set_ylabel('Precipitation (mm/month)', color='white')
ax.set_title('Water budget: rain + fog (NE India)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Cloud base elevation impact
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(altitudes, np.array(current_water)/1000, color='#22c55e', linewidth=2, label='Current cloud base')
ax.plot(altitudes, np.array(future_water)/1000, color='#ef4444', linewidth=2, label='Future (+200m)')
ax.axvline(forest_alt, color='#f59e0b', linestyle='--', linewidth=2, label=f'Forest at {forest_alt}m')
ax.fill_between(altitudes, np.array(current_water)/1000, np.array(future_water)/1000,
                where=np.array(current_water) > np.array(future_water),
                alpha=0.2, color='#ef4444', label='Water loss')
ax.set_xlabel('Elevation (m)', color='white')
ax.set_ylabel('Monthly fog water (m³)', color='white')
ax.set_title('Climate change: rising cloud base', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Orchid population response
ax = axes[1, 1]
ax.set_facecolor('#111827')
# Model orchid population as function of water availability
water_supply = np.linspace(0, 100, 100)  # relative water index
orchid_pop = 100 / (1 + np.exp(-0.1 * (water_supply - 30)))  # sigmoid

current_forest_water = fog_interception(canopy, 0.5, wind, lwc,
    np.clip((current_cloud_base + 500 - forest_alt) / 500 * hours_per_month, 0, hours_per_month))[0] / 100
future_forest_water = fog_interception(canopy, 0.5, wind, lwc,
    np.clip((future_cloud_base + 500 - forest_alt) / 500 * hours_per_month, 0, hours_per_month))[0] / 100

ax.plot(water_supply, orchid_pop, color='#a855f7', linewidth=2)
ax.axvline(current_forest_water, color='#22c55e', linestyle='--', linewidth=2,
           label=f'Current ({current_forest_water:.0f})')
ax.axvline(future_forest_water, color='#ef4444', linestyle='--', linewidth=2,
           label=f'2050 ({future_forest_water:.0f})')
ax.set_xlabel('Water availability index', color='white')
ax.set_ylabel('Orchid population (%)', color='white')
ax.set_title('Orchid population response to water loss', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("CLOUD FOREST HYDROLOGY")
print(f"Fog capture without epiphytes: {water_no_epi/1000:.1f} m³/month")
print(f"Fog capture with epiphytes: {water_with_epi/1000:.1f} m³/month")
print(f"Epiphyte contribution: +{(water_with_epi-water_no_epi)/water_no_epi*100:.0f}%")
print()
print(f"Climate change impact at {forest_alt}m:")
print(f"  Current fog water: {current_forest_water:.0f} (relative)")
print(f"  Future fog water: {future_forest_water:.0f} (relative)")
print(f"  Reduction: {(1-future_forest_water/current_forest_water)*100:.0f}%")
print()
print("Epiphytes are not passengers — they are part of the water cycle.")
print("Losing them reduces fog capture, which stresses the trees, which kills more epiphytes.")
print("This feedback loop can collapse an entire cloud forest ecosystem.")`,
      challenge: 'Model a fog-harvesting net (biomimicry from epiphytes) as a water collection device. What mesh size, orientation, and material maximizes water capture? Compare to the natural epiphyte system.',
      successHint: 'Cloud forest hydrology connects plant biology to climate science to conservation policy. The wild orchids of Northeast India are indicators of cloud forest health — when orchids disappear, it means the clouds are leaving, and the entire ecosystem is at risk.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Symbiotic Ecology & Epiphyte Biology
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (ecology fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for ecological modeling and network analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
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
