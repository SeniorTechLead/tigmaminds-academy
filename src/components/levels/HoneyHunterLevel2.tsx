import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function HoneyHunterLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Pollinator networks — who pollinates whom',
      concept: `In Level 1, we focused on honeybees. But pollination involves hundreds of species interacting in complex **mutualistic networks**. A pollinator network maps which pollinators visit which plants — and the structure of this network determines how resilient the ecosystem is.

**Network properties:**
- **Nestedness**: specialists tend to visit the same plants that generalists visit, forming a connected "core"
- **Modularity**: some groups of plants and pollinators interact more with each other than with outside species
- **Connectance**: the fraction of possible links that actually exist (typically 10-30%)
- **Asymmetry**: a plant may depend heavily on one pollinator, but that pollinator visits many plants

In Assam, a pollination network might include 50+ pollinator species (bees, butterflies, moths, flies, birds) and 100+ plant species, with thousands of links between them.`,
      analogy: 'A pollinator network is like an airline route map. Hub airports (generalist pollinators like honeybees) connect to many destinations. Small regional airports (specialist pollinators) connect to only a few. If a hub goes down, many routes are disrupted. If a small airport closes, few routes are affected. Network resilience depends on having multiple hubs and backup routes.',
      storyConnection: 'The honey hunter focused on one species: Apis dorsata (the giant honeybee). But the forest around his hive hosts dozens of other pollinators. If the honeybees disappeared, would the forest flowers still be pollinated? The network tells us: for some flowers (those visited by many pollinators), yes. For others (honeybee specialists), no. The network reveals hidden vulnerabilities.',
      checkQuestion: 'In a pollination network, honeybees visit 80% of flowering plant species. Does this mean the ecosystem would collapse without honeybees?',
      checkAnswer: 'Not necessarily. Most plants honeybees visit are ALSO visited by other pollinators. The network is nested: if you remove honeybees, many of their plant partners still have backup pollinators (butterflies, wild bees, flies). The plants most at risk are those where honeybees are the ONLY pollinator — and in most wild ecosystems, there are very few such obligate relationships. Monoculture farms are the exception.',
      codeIntro: 'Build a pollinator-plant network and analyze its structure and resilience.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate a nested pollinator-plant interaction matrix
n_pollinators = 15
n_plants = 20

# Create nested matrix (generalists in top rows visit many plants)
interaction = np.zeros((n_pollinators, n_plants))
for i in range(n_pollinators):
    for j in range(n_plants):
        p = 0.7 * np.exp(-0.15 * i) * np.exp(-0.08 * j) + 0.05
        if np.random.random() < p:
            interaction[i, j] = 1

connectance = interaction.sum() / (n_pollinators * n_plants)
degree_poll = interaction.sum(axis=1)
degree_plant = interaction.sum(axis=0)

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Interaction matrix
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.imshow(interaction, aspect='auto', cmap='YlOrRd', interpolation='nearest')
ax1.set_xlabel('Plant species', color='white')
ax1.set_ylabel('Pollinator species', color='white')
ax1.set_title(f'Interaction Matrix (connectance={connectance:.2f})', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Degree distribution
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.barh(range(n_pollinators), degree_poll, color='#f59e0b', alpha=0.8)
ax2.set_xlabel('Number of plant partners', color='white')
ax2.set_ylabel('Pollinator', color='white')
ax2.set_title('Pollinator Generalism', color='white', fontsize=12)
ax2.tick_params(colors='gray')
for i, d in enumerate(degree_poll):
    label = 'Generalist' if d > np.median(degree_poll) else 'Specialist'
    color = '#22c55e' if d > np.median(degree_poll) else '#ef4444'
    ax2.text(d + 0.3, i, label, color=color, fontsize=7, va='center')

# Removal simulation
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
n_trials = 50
for strategy, label, color in [
    ('most_connected', 'Remove generalists first', '#ef4444'),
    ('random', 'Remove randomly', '#f59e0b'),
    ('least_connected', 'Remove specialists first', '#22c55e'),
]:
    results = []
    for trial in range(n_trials if strategy == 'random' else 1):
        matrix = interaction.copy()
        order = list(range(n_pollinators))
        if strategy == 'most_connected':
            order = sorted(order, key=lambda x: -degree_poll[x])
        elif strategy == 'random':
            np.random.shuffle(order)
        else:
            order = sorted(order, key=lambda x: degree_poll[x])
        plants_alive = []
        for n_removed in range(n_pollinators + 1):
            remaining = [o for o in range(n_pollinators) if o not in order[:n_removed]]
            if len(remaining) == 0:
                plants_with_pollinator = 0
            else:
                plants_with_pollinator = (matrix[remaining, :].sum(axis=0) > 0).sum()
            plants_alive.append(plants_with_pollinator)
        results.append(plants_alive)
    mean_result = np.mean(results, axis=0)
    ax3.plot(range(n_pollinators + 1), mean_result / n_plants * 100, color=color, linewidth=2, label=label)

ax3.set_xlabel('Pollinators removed', color='white')
ax3.set_ylabel('Plants still pollinated (%)', color='white')
ax3.set_title('Network Resilience to Pollinator Loss', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Bipartite network
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
poll_y = np.linspace(0, 1, n_pollinators)
plant_y = np.linspace(0, 1, n_plants)
for i in range(n_pollinators):
    for j in range(n_plants):
        if interaction[i, j]:
            alpha = 0.1 + 0.2 * (degree_poll[i] / degree_poll.max())
            ax4.plot([0, 1], [poll_y[i], plant_y[j]], color='gray', alpha=alpha, linewidth=0.5)
for i in range(n_pollinators):
    ax4.plot(0, poll_y[i], 'o', color='#f59e0b', markersize=5 + degree_poll[i] * 3)
for j in range(n_plants):
    ax4.plot(1, plant_y[j], 'o', color='#22c55e', markersize=3 + degree_plant[j] * 2)
ax4.text(0, -0.05, 'Pollinators', color='#f59e0b', fontsize=10, ha='center')
ax4.text(1, -0.05, 'Plants', color='#22c55e', fontsize=10, ha='center')
ax4.set_title('Bipartite Network (node size = links)', color='white', fontsize=12)
ax4.set_xlim(-0.2, 1.2); ax4.set_ylim(-0.1, 1.1); ax4.axis('off')

plt.tight_layout()
plt.show()

print(f"Network metrics:")
print(f"  Pollinators: {n_pollinators}, Plants: {n_plants}")
print(f"  Total interactions: {int(interaction.sum())}")
print(f"  Connectance: {connectance:.3f}")
print(f"  Most generalist: {int(degree_poll.max())} plant partners")`,
      challenge: 'What if you add a new "super-generalist" pollinator that visits ALL plants? How does network resilience change? Is this realistic (hint: invasive honeybees can act as super-generalists)?',
      successHint: 'Pollinator networks reveal the hidden architecture of ecosystems. The same network math is used for the internet, social networks, and power grids. Understanding network structure tells you where the system is robust and where it is fragile.',
    },
    {
      title: 'Colony collapse disorder data — a detective story',
      concept: `Starting in 2006, beekeepers reported a mysterious phenomenon: entire colonies vanishing almost overnight. Workers would fly out to forage and never return, leaving the queen and brood behind to die. This was named **Colony Collapse Disorder (CCD)**.

**The symptoms:**
- Rapid loss of adult workers (within weeks)
- Abandoned brood and food stores
- No dead bees in or around the hive (they disappeared)
- Delayed invasion by pests

**The investigation** tested multiple hypotheses simultaneously:
- Pesticides (neonicotinoids): disoriented foragers can't navigate home
- Varroa mites + viruses: weakened immune systems
- Poor nutrition: monoculture "food deserts"
- Stress from transportation: migratory beekeeping exhausts colonies
- Pathogens: Nosema ceranae (gut parasite)

**The verdict**: no single cause. CCD is a **syndrome** — multiple stressors interacting. Like human heart disease, there's no single smoking gun, but a combination of risk factors that together are lethal.`,
      analogy: 'CCD is like a plane crash investigation. When a plane goes down, investigators don\'t look for THE cause — they look for a chain of failures. Faulty sensor + tired pilot + bad weather = crash. Similarly, CCD = pesticide exposure + Varroa + poor nutrition + stress. No single factor is "the cause," but together they exceed the colony\'s ability to cope.',
      storyConnection: 'The honey hunter in the story would notice CCD as "the bees left and never came back." Traditional honey hunters know this phenomenon intuitively — they\'ve seen colonies abandon hives for generations. Modern CCD research quantifies what traditional knowledge always understood: bees need a healthy environment to thrive, and when conditions deteriorate past a threshold, the colony simply vanishes.',
      checkQuestion: 'US beekeepers lose 30-40% of colonies every winter (up from 10-15% historically). But total managed colonies haven\'t dropped dramatically. How is this possible?',
      checkAnswer: 'Beekeepers replace lost colonies by splitting surviving ones. This masks the problem: the LOSS rate is alarming, but replacement keeps numbers stable. It\'s like a hospital reporting "total patients steady" while admission rates double — the throughput is unsustainable. Replacement costs $200-300 per colony and takes 6-8 weeks. The system is running faster to stay in place.',
      codeIntro: 'Analyze colony loss data and model the interaction of multiple CCD risk factors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# US Colony loss data (simulated based on real trends)
years = np.arange(2006, 2026)
loss_rates = [32, 36, 29, 34, 30, 22, 31, 34, 24, 23, 28, 40, 38, 37, 44, 43, 39, 48, 38, 35]
total_colonies = [2.4, 2.3, 2.3, 2.5, 2.7, 2.5, 2.6, 2.7, 2.7, 2.8, 2.8, 2.7, 2.8, 2.8, 2.7, 2.7, 2.9, 2.8, 2.7, 2.8]

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Loss rates
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.bar(years, loss_rates, color='#ef4444', alpha=0.7)
ax1.axhline(15, color='#22c55e', linestyle='--', linewidth=2, label='Pre-CCD baseline (15%)')
ax1.axhline(np.mean(loss_rates), color='#f59e0b', linestyle=':', linewidth=2, label=f'CCD era mean ({np.mean(loss_rates):.0f}%)')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Winter colony loss (%)', color='white')
ax1.set_title('US Colony Winter Loss Rates', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Replacement treadmill
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.plot(years, total_colonies, 'o-', color='#3b82f6', linewidth=2, markersize=6, label='Total colonies')
colonies_lost = [tc * lr / 100 for tc, lr in zip(total_colonies, loss_rates)]
ax2_twin = ax2.twinx()
ax2_twin.bar(years, colonies_lost, color='#ef4444', alpha=0.3, label='Colonies lost')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Total colonies (millions)', color='#3b82f6')
ax2_twin.set_ylabel('Colonies lost (millions)', color='#ef4444')
ax2.set_title('The Replacement Treadmill', color='white', fontsize=12)
lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray'); ax2_twin.tick_params(colors='gray')

# Multi-factor risk model
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
factors = {
    'Varroa mites': np.random.uniform(0, 0.4, 1000),
    'Pesticide exposure': np.random.uniform(0, 0.3, 1000),
    'Poor nutrition': np.random.uniform(0, 0.25, 1000),
    'Transport stress': np.random.uniform(0, 0.2, 1000),
    'Pathogens': np.random.uniform(0, 0.2, 1000),
}
combined_stress = sum(factors.values())
ccd_threshold = 0.7
ccd_cases = combined_stress > ccd_threshold

ax3.bar(['CCD colonies'], [np.mean(combined_stress[ccd_cases])], color='#ef4444', alpha=0.8)
ax3.bar(['Healthy colonies'], [np.mean(combined_stress[~ccd_cases])], color='#22c55e', alpha=0.8)
ax3.axhline(ccd_threshold, color='white', linestyle='--', label=f'CCD threshold ({ccd_threshold})')
ax3.set_ylabel('Combined stress score', color='white')
ax3.set_title(f'Combined Stress: {ccd_cases.sum()/len(ccd_cases)*100:.0f}% exceed threshold', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Factor contributions
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
factor_names = list(factors.keys())
ccd_means = [np.mean(factors[n][ccd_cases]) for n in factor_names]
healthy_means = [np.mean(factors[n][~ccd_cases]) for n in factor_names]
x = np.arange(len(factor_names))
ax4.barh(x - 0.15, ccd_means, height=0.3, color='#ef4444', alpha=0.7, label='CCD colonies')
ax4.barh(x + 0.15, healthy_means, height=0.3, color='#22c55e', alpha=0.7, label='Healthy colonies')
ax4.set_yticks(x)
ax4.set_yticklabels(factor_names, color='white', fontsize=9)
ax4.set_xlabel('Mean stress contribution', color='white')
ax4.set_title('Stress Factor Comparison', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("CCD analysis:")
print(f"  Mean winter loss rate: {np.mean(loss_rates):.1f}% (pre-CCD: ~15%)")
print(f"  Colonies exceeding stress threshold: {ccd_cases.sum()/len(ccd_cases)*100:.0f}%")
print(f"\\nNo single factor causes CCD — it's the combination that matters.")`,
      challenge: 'If you could reduce ONE stress factor to zero, which would save the most colonies? Run the simulation with each factor zeroed and compare CCD rates.',
      successHint: 'CCD taught the scientific community that complex ecological problems rarely have simple causes. The multi-factor analysis framework developed for CCD is now applied to coral reef bleaching, amphibian declines, and other "mystery" die-offs.',
    },
    {
      title: 'Economic value of pollination — nature\'s hidden GDP',
      concept: `The honey hunter sells honey for income. But the bees' pollination service is worth far more. **Ecosystem service valuation** puts a dollar figure on nature's free work.

**Global estimates:**
- Pollination service value: **$235-577 billion USD per year**
- Global honey production value: **$8 billion USD per year**
- Ratio: pollination is **30-70x** more valuable than honey

**How it's calculated:**
1. **Production function approach**: how much crop yield depends on pollinators
2. **Replacement cost approach**: what would it cost to pollinate manually? Hand-pollination costs ~$10,000/hectare vs ~$200/hectare for bees

**For India:** Pollination-dependent crops (mustard, sunflower, fruits, vegetables, spices) have an estimated pollination value of $30-50 billion per year.`,
      analogy: 'The economic value of pollination is like the value of the internet. The internet itself is "free" (no one pays for the protocol). But the economic activity it enables — e-commerce, communication, finance — is worth trillions. Similarly, bees provide pollination "for free" (they\'re doing it for nectar, not for us), but the agricultural activity they enable is worth hundreds of billions.',
      storyConnection: 'The honey hunter values each hive at the honey it produces — perhaps $50-100 per year. But the pollination service of that same hive might be worth $1,000-5,000 per year. The honey is just the tip of the iceberg. When the story says "take some, leave some," the economic argument is clear: a living hive is worth 50x more than a dead one.',
      checkQuestion: 'China\'s Sichuan province lost most of its wild bees to pesticide overuse. Now, farmers hand-pollinate apple and pear trees with paintbrushes. What does this teach us?',
      checkAnswer: 'It tells us that replacing bees is absurdly expensive. One colony (worth $200) does the work of thousands of human workers. Hand-pollination in Sichuan costs $2,000-5,000 per hectare — 10-25x what bee pollination would cost. Worse, hand-pollination is less effective. The Sichuan case is a warning: once you lose your pollinators, there is no affordable replacement.',
      codeIntro: 'Calculate the economic value of pollination for different crops and compare with honey value.',
      code: `import numpy as np
import matplotlib.pyplot as plt

crops = {
    'Almonds': {'area_Mha': 1.5, 'price_per_ton': 5000, 'yield_ton_ha': 2.5, 'poll_dep': 1.0},
    'Apples': {'area_Mha': 5.0, 'price_per_ton': 800, 'yield_ton_ha': 20, 'poll_dep': 0.9},
    'Coffee': {'area_Mha': 11.0, 'price_per_ton': 3000, 'yield_ton_ha': 1.5, 'poll_dep': 0.3},
    'Mangoes': {'area_Mha': 5.5, 'price_per_ton': 700, 'yield_ton_ha': 8, 'poll_dep': 0.7},
    'Mustard': {'area_Mha': 8.0, 'price_per_ton': 600, 'yield_ton_ha': 1.2, 'poll_dep': 0.6},
    'Sunflower': {'area_Mha': 25.0, 'price_per_ton': 400, 'yield_ton_ha': 1.8, 'poll_dep': 0.8},
    'Blueberries': {'area_Mha': 0.1, 'price_per_ton': 8000, 'yield_ton_ha': 5, 'poll_dep': 0.9},
}

poll_values = {}
for crop, data in crops.items():
    total_value = data['area_Mha'] * data['yield_ton_ha'] * data['price_per_ton']
    poll_values[crop] = total_value * data['poll_dep']

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
sorted_crops = sorted(poll_values.items(), key=lambda x: x[1], reverse=True)
names = [c[0] for c in sorted_crops]
values = [c[1] / 1e3 for c in sorted_crops]
colors = plt.cm.YlOrRd(np.linspace(0.3, 0.9, len(names)))
ax1.barh(names, values, color=colors, alpha=0.8)
for bar, val in zip(ax1.patches, values):
    ax1.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2, f'{val:.0f}B', color='white', fontsize=9, va='center')
ax1.set_xlabel('Pollination value ($ billion/year)', color='white')
ax1.set_title('Crop Pollination Value', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.set_yticklabels(names, color='white', fontsize=9)

ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
honey_value = 8
poll_total = sum(poll_values.values()) / 1e3
ax2.bar(['Honey\\nproduction', 'Pollination\\nservice'], [honey_value, poll_total], color=['#f59e0b', '#22c55e'], alpha=0.8)
ax2.text(0, honey_value + 2, f'{honey_value}B', color='#f59e0b', fontsize=14, ha='center', fontweight='bold')
ax2.text(1, poll_total + 2, f'{poll_total:.0f}B', color='#22c55e', fontsize=14, ha='center', fontweight='bold')
ax2.set_ylabel('Value ($ billion/year)', color='white')
ax2.set_title('Honey vs Pollination: The Hidden Value', color='white', fontsize=12)
ax2.tick_params(colors='gray')

ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
hand_cost = 5000; bee_cost = 200
crop_areas = {crop: data['area_Mha'] * 1e6 for crop, data in crops.items()}
total_area = sum(a * crops[c]['poll_dep'] for c, a in crop_areas.items())
hand_total = total_area * hand_cost / 1e9
bee_total = total_area * bee_cost / 1e9
ax3.bar(['Bee\\npollination', 'Hand\\npollination'], [bee_total, hand_total], color=['#22c55e', '#ef4444'], alpha=0.8)
ax3.text(0, bee_total + 5, f'{bee_total:.0f}B', color='#22c55e', fontsize=12, ha='center')
ax3.text(1, hand_total + 5, f'{hand_total:.0f}B', color='#ef4444', fontsize=12, ha='center')
ax3.set_ylabel('Cost ($ billion/year)', color='white')
ax3.set_title('Replacement Cost: If Bees Disappeared', color='white', fontsize=12)
ax3.tick_params(colors='gray')

ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
food_items = ['Almonds', 'Apples', 'Coffee', 'Blueberries', 'Mangoes', 'Mustard oil']
current_price = [12, 3, 15, 8, 2, 4]
poll_deps = [1.0, 0.9, 0.3, 0.9, 0.7, 0.6]
price_increase = [min(cp / max(1 - pd, 0.1), cp * 5) for cp, pd in zip(current_price, poll_deps)]
x = np.arange(len(food_items))
ax4.bar(x - 0.15, current_price, width=0.3, color='#22c55e', alpha=0.8, label='Current price')
ax4.bar(x + 0.15, price_increase, width=0.3, color='#ef4444', alpha=0.8, label='Without pollinators')
ax4.set_xticks(x); ax4.set_xticklabels(food_items, color='white', fontsize=8, rotation=30)
ax4.set_ylabel('Price ($/kg)', color='white')
ax4.set_title('Food Prices Without Pollinators', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Global honey value: {honey_value}B/year")
print(f"Global pollination value: {poll_total:.0f}B/year")
print(f"Pollination is {poll_total/honey_value:.0f}x more valuable than honey")`,
      challenge: 'India\'s mustard crop covers 8 million hectares. If pollinator decline reduces yields by 30%, calculate the economic loss. Then calculate the cost of establishing enough bee colonies to restore pollination. Is it cost-effective?',
      successHint: 'Ecosystem service valuation speaks the language of policymakers and businesses. When you can show that protecting bees saves $200 billion more than it costs, conservation becomes an economic argument, not just an emotional one.',
    },
    {
      title: 'Modeling bee populations — predicting the future of hives',
      concept: `To protect bees, we need to predict how populations will change. **Population modeling** uses mathematics to project future colony numbers based on birth rates, death rates, and environmental factors.

**The logistic growth model with stochastic events:**
- dN/dt = rN(1 - N/K) - mortality_events
- N = number of colonies, K = carrying capacity, r = growth rate

**Key modeling challenges:**
- Seasonal variation (spring growth, winter contraction)
- Density dependence (too many colonies = competition for forage)
- Allee effects (too few colonies = not enough drones for mating)
- Environmental stochasticity (some years are good, some bad)`,
      analogy: 'Bee population modeling is like financial planning. You have income (new colonies from splitting), expenses (colony losses), savings (reserves of healthy colonies), and external shocks (disease outbreaks). A good financial model helps you plan for the worst while hoping for the best.',
      storyConnection: 'The honey hunter\'s forest supports a certain number of wild colonies — the "carrying capacity." If disease or overharvesting reduces colonies below a threshold, the population can\'t recover on its own. Population models identify that threshold.',
      checkQuestion: 'A region has 500 wild bee colonies and a carrying capacity of 1,000. Annual growth rate is 20%. If 100 colonies are lost to disease, how many years until recovery?',
      checkAnswer: 'Using logistic growth from 400: after year 1 N ≈ 448, year 2 ≈ 498, year 3 ≈ 548. Recovery to 500 takes about 2-3 years. Recovery time depends on how far below K the population falls — closer to K means slower growth.',
      codeIntro: 'Build a stochastic bee population model with seasonal variation and random disturbances.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

K = 1000; r = 0.15; years = 50; months = years * 12

seasonal = np.zeros(months)
for m in range(months):
    month_of_year = m % 12
    if month_of_year in [2, 3, 4]: seasonal[m] = 1.5
    elif month_of_year in [5, 6, 7]: seasonal[m] = 1.0
    elif month_of_year in [8, 9, 10]: seasonal[m] = 0.5
    else: seasonal[m] = 0.2

n_runs = 50
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Baseline
ax1 = axes[0, 0]; ax1.set_facecolor('#111827')
for run in range(n_runs):
    N = 500; trajectory = [N]
    for m in range(months - 1):
        growth = r/12 * seasonal[m] * N * (1 - N/K)
        noise = np.random.normal(0, 0.02 * N)
        if np.random.random() < 0.02: N -= np.random.uniform(0.05, 0.15) * N
        N = max(N + growth + noise, 10); trajectory.append(N)
    ax1.plot(np.arange(months)/12, trajectory, color='#22c55e', alpha=0.1, linewidth=0.5)
ax1.axhline(K, color='white', linestyle=':', alpha=0.3, label=f'K = {K}')
ax1.set_xlabel('Years', color='white'); ax1.set_ylabel('Colonies', color='white')
ax1.set_title('Baseline: Natural Variation (50 runs)', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white'); ax1.tick_params(colors='gray')

# With pesticide
ax2 = axes[0, 1]; ax2.set_facecolor('#111827')
pesticide_mortality = 0.005
for run in range(n_runs):
    N = 500; trajectory = [N]
    for m in range(months - 1):
        growth = r/12 * seasonal[m] * N * (1 - N/K)
        pest_loss = pesticide_mortality * N
        noise = np.random.normal(0, 0.02 * N)
        if np.random.random() < 0.02: N -= np.random.uniform(0.05, 0.15) * N
        N = max(N + growth - pest_loss + noise, 10); trajectory.append(N)
    ax2.plot(np.arange(months)/12, trajectory, color='#ef4444', alpha=0.1, linewidth=0.5)
ax2.axhline(K, color='white', linestyle=':', alpha=0.3)
ax2.set_xlabel('Years', color='white'); ax2.set_ylabel('Colonies', color='white')
ax2.set_title('With Chronic Pesticide Pressure', color='white', fontsize=12); ax2.tick_params(colors='gray')

# Conservation intervention
ax3 = axes[1, 0]; ax3.set_facecolor('#111827')
intervention_month = 20 * 12
for run in range(n_runs):
    N = 500; trajectory = [N]
    for m in range(months - 1):
        if m < intervention_month:
            growth = r/12 * seasonal[m] * N * (1 - N/K)
            pest_loss = pesticide_mortality * N
        else:
            K_eff = K * 1.2
            growth = r/12 * seasonal[m] * N * (1 - N/K_eff)
            pest_loss = pesticide_mortality * 0.3 * N
        noise = np.random.normal(0, 0.02 * N)
        if np.random.random() < 0.02: N -= np.random.uniform(0.05, 0.15) * N
        N = max(N + growth - pest_loss + noise, 10); trajectory.append(N)
    ax3.plot(np.arange(months)/12, trajectory, color='#3b82f6', alpha=0.1, linewidth=0.5)
ax3.axvline(20, color='#f59e0b', linewidth=2, linestyle='--', label='Intervention starts')
ax3.set_xlabel('Years', color='white'); ax3.set_ylabel('Colonies', color='white')
ax3.set_title('Pesticide Reduction + Flower Strips at Year 20', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white'); ax3.tick_params(colors='gray')

# Minimum viable population
ax4 = axes[1, 1]; ax4.set_facecolor('#111827')
start_pops = [10, 25, 50, 100, 200, 500]; survival_rates = []
for start_pop in start_pops:
    survived = 0
    for run in range(200):
        N = start_pop; alive = True
        for m in range(120):
            growth = r/12 * seasonal[m % 12] * N * (1 - N/K)
            noise = np.random.normal(0, 0.03 * N)
            if np.random.random() < 0.02: N -= np.random.uniform(0.05, 0.2) * N
            N = max(N + growth + noise, 0)
            if N < 5: alive = False; break
        if alive: survived += 1
    survival_rates.append(survived / 200 * 100)
ax4.plot(start_pops, survival_rates, 'o-', color='#f59e0b', linewidth=2, markersize=8)
ax4.axhline(95, color='#22c55e', linestyle='--', label='95% survival target')
ax4.set_xlabel('Starting population (colonies)', color='white')
ax4.set_ylabel('10-year survival probability (%)', color='white')
ax4.set_title('Minimum Viable Population', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white'); ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Minimum viable population (95% survival over 10 years):")
for sp, sr in zip(start_pops, survival_rates):
    print(f"  {sp:4d} colonies: {sr:.0f}% survival")`,
      challenge: 'Add climate change: gradually increase catastrophic event frequency from 2% to 5% per month over 50 years. How does the minimum viable population change?',
      successHint: 'Population modeling is the bridge between ecological understanding and conservation action. It tells us not just that bee populations are declining, but how fast, how far, and what interventions will be most effective.',
    },
    {
      title: 'Precision beekeeping with sensors — the IoT hive',
      concept: `Traditional beekeeping relies on opening the hive to inspect it — stressing the bees. **Precision beekeeping** uses sensors to monitor hives without opening them.

**Sensors in a modern hive:**
- **Weight scale**: tracks nectar flow (gaining) and consumption (losing)
- **Temperature sensors**: brood area should be 35°C; deviations indicate problems
- **Humidity sensor**: high humidity + high temperature = healthy brood
- **Acoustic sensor**: sound changes before swarming and during queenlessness
- **Bee counter**: entrance sensor counts bees in/out; the difference = forager loss rate

**Event detection:**
- Sudden weight drop → colony swarmed (half the bees left)
- Gradual weight loss in summer → poor foraging
- Temperature below 32°C → brood area shrinking
- Acoustic change + temperature spike → swarming imminent (12-24h warning)`,
      analogy: 'Precision beekeeping is like a smartwatch for a hive. Just as a smartwatch monitors heart rate, sleep, and activity without invasive tests, hive sensors monitor weight, temperature, and sound without opening the hive. When something goes wrong, the data tells you what and when — before visible symptoms appear.',
      storyConnection: 'The honey hunter in the story assessed hive health by watching bee behavior — flight patterns, sound, activity level. Modern sensors quantify exactly the same indicators, but continuously and precisely. Technology digitizes traditional knowledge.',
      checkQuestion: 'A hive weight sensor shows: Monday 30 kg, Tuesday 31.5 kg, Wednesday 33 kg, Thursday 20 kg, Friday 20.5 kg. What happened on Thursday?',
      checkAnswer: 'The colony swarmed. A swarm takes about half the bees and honey stores. The 13 kg drop is roughly half the colony\'s biomass and food departing at once. Rapid weight gain (Mon-Wed) often precedes swarming. An acoustic sensor would have detected swarming sounds 1-2 days earlier.',
      codeIntro: 'Simulate a year of hive sensor data and detect key events automatically.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

days = np.arange(365)
month = (days / 30.44).astype(int) % 12

# Weight
nectar_flow = np.zeros(365)
for d in range(365):
    m = month[d]
    if m in [2, 3, 4, 5]: nectar_flow[d] = 0.3
    elif m in [8, 9]: nectar_flow[d] = 0.15
    elif m in [10, 11, 0, 1]: nectar_flow[d] = -0.1
    else: nectar_flow[d] = 0.05

weight = np.zeros(365); weight[0] = 30
for d in range(1, 365):
    weight[d] = weight[d-1] + nectar_flow[d] + np.random.normal(0, 0.1)
swarm_day = 135
weight[swarm_day:] -= 8
robbing_start = 270
weight[robbing_start:robbing_start+5] -= np.linspace(0, 3, 5)

# Temperature
temp = np.zeros(365)
for d in range(365):
    if month[d] in [3, 4, 5, 6, 7, 8]: temp[d] = 35 + np.random.normal(0, 0.5)
    else: temp[d] = 30 + np.random.normal(0, 2)
temp[swarm_day:swarm_day+3] -= 3

# Bee counter
bees_out = np.zeros(365); bees_in = np.zeros(365)
for d in range(365):
    if month[d] in [3, 4, 5, 6, 7, 8]:
        base = 5000 + 3000 * np.sin((d - 90) / 180 * np.pi)
        bees_out[d] = base + np.random.normal(0, 300)
        bees_in[d] = bees_out[d] * (0.97 + np.random.normal(0, 0.01))
    else:
        bees_out[d] = 500 + np.random.normal(0, 100)
        bees_in[d] = bees_out[d] * 0.99
bees_in[150:156] = bees_out[150:156] * 0.85

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

ax1 = axes[0, 0]; ax1.set_facecolor('#111827')
ax1.plot(days, weight, color='#f59e0b', linewidth=1.5)
ax1.axvline(swarm_day, color='#ef4444', linestyle='--', alpha=0.7)
ax1.annotate('SWARM!\\n-8 kg', xy=(swarm_day, weight[swarm_day]), xytext=(swarm_day+20, weight[swarm_day]+5),
            color='#ef4444', fontsize=10, arrowprops=dict(arrowstyle='->', color='#ef4444'))
ax1.set_xlabel('Day', color='white'); ax1.set_ylabel('Weight (kg)', color='white')
ax1.set_title('Hive Weight', color='white', fontsize=12); ax1.tick_params(colors='gray')

ax2 = axes[0, 1]; ax2.set_facecolor('#111827')
ax2.plot(days, temp, color='#ef4444', linewidth=1)
ax2.axhline(35, color='#22c55e', linestyle='--', alpha=0.5, label='Optimal (35°C)')
ax2.axhline(32, color='#f59e0b', linestyle=':', alpha=0.5, label='Warning (32°C)')
ax2.set_xlabel('Day', color='white'); ax2.set_ylabel('Temperature (°C)', color='white')
ax2.set_title('Brood Temperature', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8); ax2.tick_params(colors='gray')

ax3 = axes[1, 0]; ax3.set_facecolor('#111827')
return_rate = np.where(bees_out > 0, bees_in / bees_out * 100, 100)
ax3.plot(days, return_rate, color='#3b82f6', linewidth=1)
ax3.axhline(95, color='#22c55e', linestyle='--', alpha=0.5, label='Normal (>95%)')
ax3.fill_between(days, return_rate, 95, where=return_rate < 90, alpha=0.3, color='#ef4444')
ax3.annotate('Pesticide!', xy=(152, return_rate[152]), xytext=(170, 80), color='#ef4444', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#ef4444'))
ax3.set_xlabel('Day', color='white'); ax3.set_ylabel('Return rate (%)', color='white')
ax3.set_title('Forager Return Rate', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white'); ax3.tick_params(colors='gray')
ax3.set_ylim(75, 105)

ax4 = axes[1, 1]; ax4.set_facecolor('#111827'); ax4.axis('off')
alerts = [
    (f'Day {swarm_day}', 'SWARM DETECTED', 'Weight drop: 8kg', '#ef4444'),
    ('Day 150-155', 'FORAGER LOSS', 'Return rate 85%', '#ef4444'),
    (f'Day {robbing_start}', 'ROBBING EVENT', 'Weight loss during non-flow', '#f59e0b'),
    ('Nov-Feb', 'WINTER OK', 'Temp stable >28°C', '#22c55e'),
    ('Mar-May', 'NECTAR FLOW', 'Weight gain 0.3 kg/day', '#22c55e'),
]
ax4.text(0.05, 0.95, 'SMART HIVE ALERTS', color='white', fontsize=14, transform=ax4.transAxes, fontweight='bold')
for i, (when, alert, detail, color) in enumerate(alerts):
    y = 0.8 - i * 0.15
    ax4.text(0.05, y, f'  {when}: {alert}', color=color, fontsize=10, transform=ax4.transAxes, fontfamily='monospace')
    ax4.text(0.08, y - 0.05, detail, color='gray', fontsize=9, transform=ax4.transAxes)

plt.tight_layout()
plt.show()

print("Sensor events detected:")
print(f"  Swarm: day {swarm_day} (weight drop 8 kg)")
print(f"  Pesticide: days 150-155 (return rate {return_rate[152]:.0f}%)")
print(f"  Peak traffic: {bees_out.max():.0f} bees/day")`,
      challenge: 'Add an acoustic sensor that detects swarming sounds 24 hours before the swarm event. How would you code the alert logic to warn the beekeeper in time?',
      successHint: 'Precision beekeeping is where biology meets IoT. The same sensor + data science approach is applied in precision agriculture, environmental monitoring, and human health. If you can build a smart hive dashboard, you can build any monitoring system.',
    },
    {
      title: 'Urban beekeeping — bees in the city',
      concept: `Surprisingly, cities can be excellent habitats for bees. **Urban beekeeping** has exploded in the last decade.

**Why cities work for bees:**
- **Diverse forage**: urban gardens, parks, street trees provide diverse pollen and nectar across the entire growing season
- **Fewer pesticides**: urban areas generally use fewer agricultural pesticides than farmland
- **Warmer microclimate**: urban heat island extends the foraging season by 2-3 weeks
- **Year-round flowering**: ornamental plants flower across many months

**The data is clear**: urban honey often has LOWER pesticide residues than rural honey, and urban colonies often have higher survival rates. Paris rooftop hives average 50-60 kg/colony — higher than the French countryside average of 20-30 kg.`,
      analogy: 'Urban beekeeping is like urban farming. Just as a rooftop garden can produce surprisingly good vegetables because of careful attention, warm microclimate, and diverse plantings, a rooftop hive can thrive because of diverse urban flowers and low pesticide exposure.',
      storyConnection: 'The honey hunter in the story lives rurally. But urban cousins could keep bees too — on rooftops, in community gardens. The lesson of sustainable coexistence applies everywhere. Urban beekeeping connects urban people with the ecosystem services they depend on but rarely see.',
      checkQuestion: 'Paris has 2,000+ beehives, many on famous buildings. Honey yields average 50-60 kg/colony — higher than the countryside. Why?',
      checkAnswer: 'Paris has 400+ flowering plant species across parks and boulevards. This diversity means there\'s always something blooming — no "food desert" gaps between crop cycles. Also, Parisian parks use fewer pesticides than farms. City bees are better fed, less poisoned, and more productive.',
      codeIntro: 'Compare urban vs rural bee performance and model optimal urban hive density.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

metrics = {
    'Honey yield\\n(kg/year)': {'Urban': 55, 'Rural': 25},
    'Winter\\nsurvival (%)': {'Urban': 85, 'Rural': 70},
    'Pesticide\\nresidues (ppb)': {'Urban': 3, 'Rural': 12},
    'Forage\\ndiversity\\n(species)': {'Urban': 150, 'Rural': 30},
    'Foraging\\nseason (days)': {'Urban': 240, 'Rural': 200},
}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

ax1 = axes[0, 0]; ax1.set_facecolor('#111827')
names = list(metrics.keys())
urban_vals = [m['Urban'] for m in metrics.values()]
rural_vals = [m['Rural'] for m in metrics.values()]
urban_norm = [u / max(u, r) * 100 for u, r in zip(urban_vals, rural_vals)]
rural_norm = [r / max(u, r) * 100 for u, r in zip(urban_vals, rural_vals)]
x = np.arange(len(names))
ax1.bar(x - 0.15, urban_norm, width=0.3, color='#22c55e', alpha=0.8, label='Urban')
ax1.bar(x + 0.15, rural_norm, width=0.3, color='#f59e0b', alpha=0.8, label='Rural')
ax1.set_xticks(x); ax1.set_xticklabels(names, color='white', fontsize=7)
ax1.set_ylabel('Relative performance (%)', color='white')
ax1.set_title('Urban vs Rural Bee Performance', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white'); ax1.tick_params(colors='gray')

ax2 = axes[0, 1]; ax2.set_facecolor('#111827')
densities = np.arange(1, 51)
max_yield = 60; competition_rate = 0.03
yield_per_colony = max_yield * np.exp(-competition_rate * densities)
total_yield = yield_per_colony * densities
ax2.plot(densities, yield_per_colony, color='#22c55e', linewidth=2, label='Yield per colony (kg)')
ax2_twin = ax2.twinx()
ax2_twin.plot(densities, total_yield, color='#f59e0b', linewidth=2, linestyle='--', label='Total yield (kg/km²)')
optimal = densities[np.argmax(total_yield)]
ax2.axvline(optimal, color='#ef4444', linestyle=':', label=f'Optimal: {optimal}/km²')
ax2.set_xlabel('Hive density (per km²)', color='white')
ax2.set_ylabel('Yield per colony (kg)', color='#22c55e')
ax2_twin.set_ylabel('Total yield (kg/km²)', color='#f59e0b')
lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax2.set_title('Optimal Hive Density', color='white', fontsize=12)
ax2.tick_params(colors='gray'); ax2_twin.tick_params(colors='gray')

ax3 = axes[1, 0]; ax3.set_facecolor('#111827')
month_labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
urban_forage = [5, 10, 30, 60, 80, 70, 50, 45, 55, 40, 15, 5]
rural_forage = [0, 0, 10, 20, 90, 30, 5, 5, 10, 60, 10, 0]
x_months = np.arange(12)
ax3.fill_between(x_months, urban_forage, alpha=0.3, color='#22c55e')
ax3.plot(x_months, urban_forage, 'o-', color='#22c55e', linewidth=2, label='Urban (diverse)')
ax3.fill_between(x_months, rural_forage, alpha=0.3, color='#f59e0b')
ax3.plot(x_months, rural_forage, 's-', color='#f59e0b', linewidth=2, label='Rural (peak-gap)')
ax3.set_xticks(x_months); ax3.set_xticklabels(month_labels, color='white', fontsize=8)
ax3.set_ylabel('Forage availability', color='white')
ax3.set_title('Seasonal Forage: Urban vs Rural', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white'); ax3.tick_params(colors='gray')
ax3.annotate('Gap!\\nNo food', xy=(6.5, 5), color='#ef4444', fontsize=10, ha='center')

ax4 = axes[1, 1]; ax4.set_facecolor('#111827'); ax4.axis('off')
ax4.text(0.05, 0.95, 'Urban Beekeeping Economics', color='white', fontsize=14, transform=ax4.transAxes, fontweight='bold')
lines = [
    'COSTS:', '  Hive setup: $300 (one-time)', '  Annual maintenance: $150', '  City permit: $50',
    '', 'REVENUE:', '  Honey (50kg x $15): $750', '  Wax products: $100',
    '  Pollination value: $2,000', '  Workshops: $500',
    '', 'Annual cost: $260', 'Annual revenue: $3,350', 'NET: +$3,090/year'
]
for i, line in enumerate(lines):
    color = '#ef4444' if 'COST' in line else '#22c55e' if 'REVENUE' in line or 'NET' in line else 'white'
    ax4.text(0.05, 0.85 - i * 0.055, line, color=color, fontsize=10, transform=ax4.transAxes, fontfamily='monospace')

plt.tight_layout()
plt.show()

print(f"Optimal hive density: {optimal}/km²")
print(f"At optimal: {yield_per_colony[optimal-1]:.0f} kg/colony, {total_yield[optimal-1]:.0f} kg/km² total")
print(f"\\nCities can be BETTER for bees than pesticide-heavy farmland.")`,
      challenge: 'Design a bee-friendly city: given a 5 km² area, plan hive placement, flower strips, and water sources to maximize colony health while respecting a 15-hive/km² density limit.',
      successHint: 'Urban beekeeping challenges the assumption that nature belongs only in the countryside. Cities can be havens for pollinators when designed with biodiversity in mind. Green roofs, wildflower verges, and community hives are ecological infrastructure that benefits humans and bees alike.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Agricultural Ecology — builds on Level 1 bee biology</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ecological modeling. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
