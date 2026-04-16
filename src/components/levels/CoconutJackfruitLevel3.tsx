import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CoconutJackfruitLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Fruit anatomy — the three pericarp layers',
      concept: `Every fruit you eat is a mature ovary wall. The fleshy part you enjoy, the hard shell you crack, the thin skin you peel — these are all distinct tissue layers that developed from the ovary wall after fertilization. Botanists divide the fruit wall into three layers called the **pericarp**:

- **Exocarp** (outer layer): the skin or rind. In a coconut, it is the smooth green outer husk. In a jackfruit, it is the spiky green rind.
- **Mesocarp** (middle layer): often the fleshy, edible part. In a coconut, it is the thick fibrous husk (coir). In a jackfruit, it is the latex-rich white tissue between the rind and the bulbs.
- **Endocarp** (inner layer): the innermost layer surrounding the seed. In a coconut, it is the hard brown shell you crack. In a jackfruit, it is the thin membrane around each seed.

The coconut is a **drupe** (like a peach — one seed, hard endocarp). The jackfruit is a **syncarp** — a multiple fruit formed from many fused ovaries on one inflorescence. Understanding fruit anatomy reveals why coconuts float (fibrous mesocarp traps air) and why jackfruits are the largest tree-borne fruits (hundreds of fused fruitlets).`,
      analogy: 'Think of a fruit as a three-layer gift wrapping system. The exocarp is the wrapping paper (presentation and protection from the outside). The mesocarp is the bubble wrap or padding (cushioning and sometimes nutrition for dispersers). The endocarp is the locked box (the final barrier protecting the seed inside). Different fruits invest differently in each layer — coconuts have massive padding, while cherries invest in the endocarp stone.',
      storyConnection: 'The coconut and jackfruit hanging side by side on the tree look nothing alike on the outside, but both follow the same three-layer blueprint. The coconut invested in a thick fibrous mesocarp to float across oceans. The jackfruit invested in sweet, aromatic mesocarp bulbs to attract animals. Same architecture, different survival strategies.',
      checkQuestion: 'Why does a coconut have a thick fibrous mesocarp while a peach has a thick fleshy mesocarp, even though both are drupes?',
      checkAnswer: 'Different dispersal strategies. The coconut relies on ocean currents for dispersal — its fibrous mesocarp traps air, making it buoyant. A peach relies on animals eating the fruit — its fleshy mesocarp is sweet and nutritious to attract birds and mammals. The pericarp layers are the same blueprint, but natural selection optimized each layer for different ecological functions.',
      codeIntro: 'Model the three pericarp layers of coconut and jackfruit, comparing their relative thickness and tissue composition.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Pericarp layer data: thickness (mm) and composition
fruits = {
    'Coconut (drupe)': {
        'exocarp': {'thickness': 2, 'color': '#22c55e', 'desc': 'Smooth green skin'},
        'mesocarp': {'thickness': 45, 'color': '#a16207', 'desc': 'Fibrous husk (coir)'},
        'endocarp': {'thickness': 5, 'color': '#78350f', 'desc': 'Hard brown shell'},
        'seed': {'thickness': 12, 'color': '#fef3c7', 'desc': 'White meat + water'},
    },
    'Jackfruit (syncarp)': {
        'exocarp': {'thickness': 3, 'color': '#65a30d', 'desc': 'Spiky green rind'},
        'mesocarp': {'thickness': 8, 'color': '#fde68a', 'desc': 'Latex-rich tissue'},
        'endocarp': {'thickness': 1, 'color': '#d4a574', 'desc': 'Thin seed membrane'},
        'seed': {'thickness': 15, 'color': '#fbbf24', 'desc': 'Edible bulbs + seeds'},
    },
}

fig, axes = plt.subplots(1, 3, figsize=(15, 6))
fig.patch.set_facecolor('#1f2937')

# Cross-section diagrams as concentric circles
for idx, (fruit_name, layers) in enumerate(fruits.items()):
    ax = axes[idx]
    ax.set_facecolor('#111827')
    ax.set_aspect('equal')

    # Build from outside in
    radii = []
    total = sum(l['thickness'] for l in layers.values())
    r = total
    for layer_name, data in layers.items():
        circle = plt.Circle((0, 0), r, color=data['color'], alpha=0.7)
        ax.add_patch(circle)
        ax.annotate(f"{layer_name}\
{data['thickness']}mm",
                     xy=(r * 0.5, r * 0.5), fontsize=7, color='black',
                     ha='center', fontweight='bold',
                     bbox=dict(boxstyle='round,pad=0.2', facecolor='white', alpha=0.8))
        radii.append(r)
        r -= data['thickness']

    ax.set_xlim(-total * 1.2, total * 1.2)
    ax.set_ylim(-total * 1.2, total * 1.2)
    ax.set_title(fruit_name, color='white', fontsize=12, fontweight='bold')
    ax.tick_params(colors='gray')

# Comparison bar chart
ax = axes[2]
ax.set_facecolor('#111827')
layer_names = ['exocarp', 'mesocarp', 'endocarp', 'seed']
coconut_vals = [fruits['Coconut (drupe)'][l]['thickness'] for l in layer_names]
jackfruit_vals = [fruits['Jackfruit (syncarp)'][l]['thickness'] for l in layer_names]

x = np.arange(len(layer_names))
w = 0.35
ax.bar(x - w/2, coconut_vals, w, label='Coconut', color='#a16207', edgecolor='none')
ax.bar(x + w/2, jackfruit_vals, w, label='Jackfruit', color='#65a30d', edgecolor='none')
ax.set_xticks(x)
ax.set_xticklabels(layer_names, color='white')
ax.set_ylabel('Thickness (mm)', color='white')
ax.set_title('Layer thickness comparison', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

total_c = sum(fruits['Coconut (drupe)'][l]['thickness'] for l in layer_names)
total_j = sum(fruits['Jackfruit (syncarp)'][l]['thickness'] for l in layer_names)
meso_c = fruits['Coconut (drupe)']['mesocarp']['thickness']
meso_j = fruits['Jackfruit (syncarp)']['mesocarp']['thickness']

print("PERICARP ANALYSIS")
print(f"Coconut total wall: {total_c} mm — mesocarp is {meso_c/total_c:.0%} of total")
print(f"Jackfruit total wall: {total_j} mm — mesocarp is {meso_j/total_j:.0%} of total")
print()
print("The coconut invests 70% of its fruit wall in fibrous mesocarp for buoyancy.")
print("The jackfruit distributes more evenly, with large seeds for animal dispersal.")
print("Same three-layer blueprint, radically different ecological strategies.")`,
      challenge: 'Add a mango (drupe) and a banana (berry) to the comparison. Research their pericarp layer thicknesses. Which fruit type invests most in the endocarp?',
      successHint: 'Every fruit in the world follows the three-layer pericarp blueprint. Once you see it, you cannot unsee it — biting into an apple, cracking a walnut, or peeling an orange, you are navigating exocarp, mesocarp, and endocarp.',
    },
    {
      title: 'Seed dormancy — why seeds wait before germinating',
      concept: `A coconut can float in the ocean for months without germinating. A jackfruit seed left on the ground may wait weeks for the right conditions. This waiting is not passive — it is an active biochemical state called **seed dormancy**.

Dormancy mechanisms include:

- **Physical dormancy**: a hard, impermeable seed coat blocks water and oxygen. The coconut endocarp is a fortress. Germination requires the coat to crack (through abrasion, microbial decay, or fire).
- **Physiological dormancy**: hormonal balance prevents germination. High **abscisic acid (ABA)** keeps the embryo dormant. Germination requires ABA to decrease and **gibberellins (GA)** to increase — triggered by environmental cues like cold (stratification) or light.
- **Morphological dormancy**: the embryo is underdeveloped at seed release and must grow further before germinating.
- **Combinational dormancy**: multiple mechanisms acting together.

The ABA:GA ratio is the master switch. Environmental signals (temperature, moisture, light) shift this ratio. When GA dominates, the aleurone layer produces amylase enzymes that break down starch reserves into sugars, fueling the embryo's growth.`,
      analogy: 'Seed dormancy is like a vault with a time lock. Physical dormancy is the thick steel door — you cannot get in until the door is breached. Physiological dormancy is the combination lock — the right sequence of environmental signals (cold, then warm, then wet) must be entered. The ABA:GA ratio is the lock mechanism itself: ABA keeps the lock engaged, GA turns it.',
      storyConnection: 'The coconut and jackfruit both fall from the tree, but their dormancy strategies are opposite. The coconut can survive months at sea because its physical dormancy (hard shell) and reduced metabolism keep it viable. The jackfruit seed has almost no dormancy — it germinates quickly because in the tropical forest floor, waiting too long means being eaten by insects or overwhelmed by competitors.',
      checkQuestion: 'A farmer stores jackfruit seeds for two months and then plants them, but none germinate. Why?',
      checkAnswer: 'Jackfruit seeds are recalcitrant — they have minimal dormancy mechanisms and cannot tolerate desiccation. Unlike orthodox seeds (which can be dried and stored for years), recalcitrant seeds lose viability rapidly once removed from the fruit. The jackfruit seed likely dried out and died within days. This is why jackfruit must be propagated from fresh seeds or vegetative cuttings.',
      codeIntro: 'Model the ABA:GA hormone dynamics during seed dormancy and germination, simulating how environmental cues trigger the switch.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Model ABA and GA concentrations over time
# Environmental trigger: cold stratification followed by warm + wet conditions
hours = np.arange(0, 720, 1)  # 30 days = 720 hours

# Phase 1 (0-240h): dry storage — high ABA, low GA
# Phase 2 (240-480h): cold stratification — ABA slowly decreases
# Phase 3 (480-720h): warm + wet — GA surges, germination

def hormone_model(t, trigger_cold=240, trigger_warm=480):
    aba = np.zeros_like(t, dtype=float)
    ga = np.zeros_like(t, dtype=float)

    for i, h in enumerate(t):
        if h < trigger_cold:
            # Dormant: high ABA, minimal GA
            aba[i] = 100 - 2 * np.random.random()
            ga[i] = 5 + 2 * np.random.random()
        elif h < trigger_warm:
            # Cold stratification: ABA declines exponentially
            progress = (h - trigger_cold) / (trigger_warm - trigger_cold)
            aba[i] = 100 * np.exp(-3 * progress) + 3 * np.random.random()
            ga[i] = 5 + 20 * progress + 2 * np.random.random()
        else:
            # Warm + wet: GA surges, ABA near zero
            progress = (h - trigger_warm) / (720 - trigger_warm)
            aba[i] = 5 * np.exp(-2 * progress) + np.random.random()
            ga[i] = 25 + 75 * (1 - np.exp(-4 * progress)) + 3 * np.random.random()

    return aba, ga

aba, ga = hormone_model(hours)
ratio = ga / (aba + 0.1)  # GA:ABA ratio

# Enzyme activity: amylase produced when GA dominates
amylase = np.clip(ratio - 1, 0, None) * 10
amylase = np.minimum(amylase, 100)

# Starch breakdown: cumulative effect of amylase
starch = 100 - np.cumsum(amylase) / np.sum(amylase) * 100
starch = np.clip(starch, 0, 100)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Hormone dynamics
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(hours, aba, color='#ef4444', linewidth=1.5, label='ABA (dormancy)')
ax.plot(hours, ga, color='#22c55e', linewidth=1.5, label='GA (germination)')
ax.axvline(240, color='#60a5fa', linestyle='--', alpha=0.5, label='Cold starts')
ax.axvline(480, color='#fbbf24', linestyle='--', alpha=0.5, label='Warm + wet')
ax.fill_between(hours, 0, aba, alpha=0.1, color='#ef4444')
ax.fill_between(hours, 0, ga, alpha=0.1, color='#22c55e')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Hormone concentration (AU)', color='white')
ax.set_title('ABA vs GA dynamics during dormancy breaking', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# GA:ABA ratio
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(hours, ratio, color='#a855f7', linewidth=1.5)
ax.axhline(1.0, color='#f59e0b', linestyle='--', linewidth=1, label='Threshold (GA:ABA = 1)')
ax.fill_between(hours, 0, ratio, where=ratio > 1, alpha=0.2, color='#22c55e', label='Germination zone')
ax.fill_between(hours, 0, ratio, where=ratio <= 1, alpha=0.2, color='#ef4444', label='Dormancy zone')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('GA:ABA ratio', color='white')
ax.set_title('The master switch: GA:ABA ratio', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Enzyme cascade
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(hours, amylase, color='#f59e0b', linewidth=1.5, label='Amylase activity')
ax.plot(hours, starch, color='#3b82f6', linewidth=1.5, label='Starch reserves')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Level (%)', color='white')
ax.set_title('Enzyme cascade: starch mobilization', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Coconut vs Jackfruit dormancy comparison
ax = axes[1, 1]
ax.set_facecolor('#111827')
species = ['Coconut', 'Jackfruit']
dormancy_days = [120, 7]
viability_days = [365, 14]
x = np.arange(2)
w = 0.3
ax.bar(x - w/2, dormancy_days, w, color='#ef4444', label='Dormancy period (days)')
ax.bar(x + w/2, viability_days, w, color='#22c55e', label='Seed viability (days)')
ax.set_xticks(x)
ax.set_xticklabels(species, color='white')
ax.set_ylabel('Days', color='white')
ax.set_title('Dormancy vs viability: two strategies', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("DORMANCY DYNAMICS")
print(f"Phase 1 (0-240h): Dry storage — ABA={aba[0]:.0f}, GA={ga[0]:.0f}")
print(f"Phase 2 (240-480h): Cold — ABA drops to {aba[470]:.0f}, GA rises to {ga[470]:.0f}")
print(f"Phase 3 (480-720h): Warm/wet — GA surges to {ga[-1]:.0f}, germination begins")
print()
print("Coconut: orthodox seed, can survive months floating in saltwater.")
print("Jackfruit: recalcitrant seed, dies within 2 weeks if not planted.")
print("Dormancy is not one strategy — it is a spectrum shaped by ecology.")`,
      challenge: 'Add a third species: the lotus (Nelumbo nucifera), whose seeds can remain dormant for over 1000 years. Model its ABA dynamics with an extremely slow decay rate. What biological mechanism allows such extreme longevity?',
      successHint: 'The ABA:GA ratio as a dormancy switch is one of the most elegant regulatory systems in biology. The same molecular logic — two opposing signals whose ratio determines the outcome — appears in apoptosis, immune activation, and neural plasticity.',
    },
    {
      title: 'Ethylene signaling — the ripening hormone',
      concept: `Place a ripe banana next to unripe avocados and they ripen faster. The reason is **ethylene** (C2H4), a gaseous plant hormone that orchestrates fruit ripening. It is one of the simplest organic molecules that acts as a signal.

Ethylene triggers a cascade:

1. **Autocatalytic production**: ethylene stimulates its own synthesis (positive feedback). One ripe fruit produces ethylene, which triggers neighboring fruits to produce more ethylene — a chain reaction.
2. **Cell wall degradation**: enzymes (pectinase, cellulase) break down cell wall polymers, softening the fruit.
3. **Chlorophyll breakdown**: green chlorophyll is degraded, revealing yellow (carotenoid) and red (anthocyanin) pigments beneath.
4. **Starch-to-sugar conversion**: amylase enzymes convert starch to glucose and fructose, making the fruit sweet.
5. **Volatile production**: aromatic compounds (esters, aldehydes) are synthesized, giving each fruit its distinctive smell.

Fruits fall into two categories:
- **Climacteric** (ethylene-responsive): banana, mango, avocado, jackfruit — ripen after harvest
- **Non-climacteric**: citrus, grape, strawberry — do not ripen further after picking`,
      analogy: 'Ethylene ripening is like a social media viral post. One person shares it (one fruit emits ethylene). Their friends see it and share it too (autocatalytic production). Within hours, everyone is talking about it (all nearby fruits are ripening simultaneously). You cannot "un-share" it — once ripening starts, it is irreversible. This is why one rotten apple spoils the barrel.',
      storyConnection: 'The coconut and jackfruit ripen differently because of ethylene. The jackfruit is strongly climacteric — once harvested, its ethylene production surges and it ripens rapidly (and spectacularly, filling the room with its unmistakable aroma). The coconut is weakly climacteric — its ripening is slower and less ethylene-dependent, which is why coconuts stay viable much longer after harvest.',
      checkQuestion: 'Supermarkets store bananas in sealed rooms with controlled ethylene levels. Why would they add ethylene to unripe bananas AND remove ethylene from storage rooms with ripe produce?',
      checkAnswer: 'They add ethylene to unripe bananas to trigger uniform ripening before sale — all bananas on the shelf ripen at the same time. They remove ethylene from rooms with ripe produce to slow further ripening and extend shelf life. Ethylene management is the key to the entire fresh produce supply chain. Without it, half the fruit in grocery stores would be either rock-hard or rotten.',
      codeIntro: 'Simulate ethylene signaling dynamics with autocatalytic feedback and model ripening cascades in a fruit bowl.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Model ethylene dynamics in a single fruit
# Ethylene production follows a sigmoid with autocatalytic feedback
def ethylene_single_fruit(hours, onset=48, rate=0.08):
    """Model ethylene production (nmol/g/h) over time."""
    return 100 / (1 + np.exp(-rate * (hours - onset)))

# Ripening cascade model
def ripening_cascade(ethylene):
    """Given ethylene level, compute downstream effects."""
    # Normalize ethylene to 0-1
    e = ethylene / 100
    softening = 1 - np.exp(-3 * e)  # cell wall breakdown
    sugar = e ** 0.7  # starch to sugar
    color_change = np.clip(e * 1.2 - 0.1, 0, 1)  # chlorophyll degradation
    aroma = np.clip(e ** 2, 0, 1)  # volatile production
    return softening, sugar, color_change, aroma

hours = np.arange(0, 168, 1)  # 7 days

# Single fruit ethylene curve
eth = ethylene_single_fruit(hours)
soft, sugar, color, aroma = ripening_cascade(eth)

# Multi-fruit bowl simulation: 6 fruits, different onset times
# But neighboring fruits speed up each other via ethylene diffusion
n_fruits = 6
onsets = [72, 80, 90, 100, 110, 120]  # staggered natural onset

# Without ethylene coupling
eth_isolated = np.array([ethylene_single_fruit(hours, onset=o) for o in onsets])

# With ethylene coupling (positive feedback from neighbors)
eth_coupled = np.zeros((n_fruits, len(hours)))
for t in range(1, len(hours)):
    for i in range(n_fruits):
        # Base production
        base = ethylene_single_fruit(np.array([hours[t]]), onset=onsets[i])[0]
        # Neighbor boost: average ethylene from others accelerates ripening
        neighbor_avg = np.mean(eth_coupled[:, t-1])
        boost = 0.3 * neighbor_avg / 100  # 30% coupling
        eth_coupled[i, t] = min(100, base + boost * (100 - base))

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Single fruit ripening cascade
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(hours, eth / 100, color='#a855f7', linewidth=2, label='Ethylene')
ax.plot(hours, soft, color='#f59e0b', linewidth=1.5, label='Softening')
ax.plot(hours, sugar, color='#22c55e', linewidth=1.5, label='Sweetness')
ax.plot(hours, color, color='#ef4444', linewidth=1.5, label='Color change')
ax.plot(hours, aroma, color='#3b82f6', linewidth=1.5, label='Aroma')
ax.set_xlabel('Hours after harvest', color='white')
ax.set_ylabel('Intensity (0-1)', color='white')
ax.set_title('Ripening cascade in a single jackfruit', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Autocatalytic ethylene production rate
ax = axes[0, 1]
ax.set_facecolor('#111827')
rate = np.gradient(eth)
ax.plot(hours, rate, color='#ef4444', linewidth=2)
ax.fill_between(hours, 0, rate, alpha=0.2, color='#ef4444')
ax.set_xlabel('Hours after harvest', color='white')
ax.set_ylabel('Ethylene production rate', color='white')
ax.set_title('Autocatalytic burst — positive feedback', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.annotate('Peak production rate', xy=(48, max(rate)), xytext=(80, max(rate)*0.8),
            arrowprops=dict(arrowstyle='->', color='white'), color='white', fontsize=9)

# Isolated vs coupled ripening
colors_list = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4']

ax = axes[1, 0]
ax.set_facecolor('#111827')
for i in range(n_fruits):
    ax.plot(hours, eth_isolated[i], color=colors_list[i], linewidth=1.5, alpha=0.7)
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Ethylene (nmol/g/h)', color='white')
ax.set_title('6 fruits ripening in ISOLATION', color='white', fontsize=11)
ax.tick_params(colors='gray')

ax = axes[1, 1]
ax.set_facecolor('#111827')
for i in range(n_fruits):
    ax.plot(hours, eth_coupled[i], color=colors_list[i], linewidth=1.5, alpha=0.7)
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Ethylene (nmol/g/h)', color='white')
ax.set_title('6 fruits ripening TOGETHER (coupled)', color='white', fontsize=11)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Analysis
iso_half = [np.searchsorted(eth_isolated[i], 50) for i in range(n_fruits)]
coup_half = [np.searchsorted(eth_coupled[i], 50) for i in range(n_fruits)]

print("ETHYLENE RIPENING DYNAMICS")
print(f"Time to 50% ripening (hours):")
print(f"  Isolated:  {iso_half}  spread = {max(iso_half)-min(iso_half)}h")
print(f"  Coupled:   {coup_half}  spread = {max(coup_half)-min(coup_half)}h")
print()
print("Coupling synchronizes ripening — fruits in a bowl ripen together.")
print("This is why 'one rotten apple spoils the barrel' is literally true.")
print("Commercial fruit storage uses ethylene scrubbers to prevent this cascade.")`,
      challenge: 'Add a non-climacteric fruit (orange) to the bowl. Model it as unresponsive to neighbor ethylene. Does its presence slow the cascade for the climacteric fruits?',
      successHint: 'Ethylene autocatalysis is a positive feedback loop — the same mathematical structure appears in forest fires, nuclear chain reactions, and viral epidemics. The biology is specific, but the dynamics are universal.',
    },
    {
      title: 'Nutritional biochemistry — fats, carbohydrates, and proteins in tropical fruits',
      concept: `The coconut and jackfruit have dramatically different nutritional profiles, and those differences trace directly to their biochemistry:

**Coconut** is fat-dominant:
- ~33% fat (mainly medium-chain triglycerides / MCTs like lauric acid, C12)
- MCTs are metabolized differently from long-chain fats — they go directly to the liver and are converted to ketone bodies
- Low sugar (~6%), moderate fiber
- The "coconut water" in young coconuts is a natural isotonic solution (electrolytes match human blood plasma)

**Jackfruit** is carbohydrate-dominant:
- ~24% carbohydrates (mostly sugars and starch)
- Only ~0.6% fat
- Rich in carotenoids (yellow pigments) and vitamin C
- The unripe fruit is starchy and used as a meat substitute (fibrous texture)

The macronutrient profile of a fruit reflects its ecological strategy. Fat-rich seeds like coconut store maximum energy per gram (9 kcal/g for fat vs 4 kcal/g for carbohydrates) — essential for a seed that must sustain itself during months of ocean travel. Carbohydrate-rich fruits like jackfruit prioritize rapid energy for seed germination in competitive tropical soils.`,
      analogy: 'Coconut and jackfruit are like two travelers packing for different trips. The coconut is packing for a long ocean voyage — it brings concentrated fuel (fat) because it needs maximum energy in minimum weight. The jackfruit is packing for a sprint — it brings quick-access energy (sugar and starch) because its seed needs to germinate fast before competitors crowd it out. Your packing strategy depends on your journey.',
      storyConnection: 'In the story, the coconut and jackfruit seem like opposites — one hard and round, the other soft and massive. But their nutritional differences are not random. The coconut packs energy-dense fats for its ocean crossing. The jackfruit packs sweet carbohydrates to attract animal dispersers who carry its seeds. Every molecule serves the survival strategy.',
      checkQuestion: 'Why does coconut oil solidify at room temperature while olive oil stays liquid?',
      checkAnswer: 'Coconut oil is ~82% saturated fat (straight-chain molecules that pack tightly together, forming a solid at room temperature around 24C). Olive oil is ~73% monounsaturated fat (oleic acid has a kink/bend in the chain that prevents tight packing, keeping it liquid). The degree of saturation directly determines melting point. This is why coconut oil is solid in winter and liquid in summer.',
      codeIntro: 'Compare the macronutrient profiles of tropical fruits and model how fatty acid chain length affects metabolic pathway.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Nutritional data per 100g (USDA values)
fruits_data = {
    'Coconut\
(meat)': {'fat': 33.5, 'carb': 15.2, 'protein': 3.3, 'fiber': 9.0, 'water': 47},
    'Jackfruit': {'fat': 0.6, 'carb': 23.2, 'protein': 1.7, 'fiber': 1.5, 'water': 73},
    'Mango': {'fat': 0.4, 'carb': 15.0, 'protein': 0.8, 'fiber': 1.6, 'water': 83},
    'Banana': {'fat': 0.3, 'carb': 22.8, 'protein': 1.1, 'fiber': 2.6, 'water': 75},
    'Avocado': {'fat': 14.7, 'carb': 8.5, 'protein': 2.0, 'fiber': 6.7, 'water': 73},
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Stacked bar chart: macronutrient composition
ax = axes[0, 0]
ax.set_facecolor('#111827')
names = list(fruits_data.keys())
fat = [d['fat'] for d in fruits_data.values()]
carb = [d['carb'] for d in fruits_data.values()]
protein = [d['protein'] for d in fruits_data.values()]
fiber = [d['fiber'] for d in fruits_data.values()]

x = np.arange(len(names))
ax.bar(x, fat, 0.6, color='#f59e0b', label='Fat')
ax.bar(x, carb, 0.6, bottom=fat, color='#22c55e', label='Carbohydrate')
ax.bar(x, protein, 0.6, bottom=np.array(fat)+np.array(carb), color='#3b82f6', label='Protein')
ax.bar(x, fiber, 0.6, bottom=np.array(fat)+np.array(carb)+np.array(protein), color='#a855f7', label='Fiber')
ax.set_xticks(x)
ax.set_xticklabels(names, color='white', fontsize=8)
ax.set_ylabel('Grams per 100g', color='white')
ax.set_title('Macronutrient profiles of tropical fruits', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Energy density
ax = axes[0, 1]
ax.set_facecolor('#111827')
energy = [d['fat']*9 + d['carb']*4 + d['protein']*4 for d in fruits_data.values()]
bars = ax.barh(names, energy, color=['#f59e0b', '#22c55e', '#22c55e', '#22c55e', '#f59e0b'])
ax.set_xlabel('Energy (kcal per 100g)', color='white')
ax.set_title('Energy density: fat-rich vs carb-rich', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, val in zip(bars, energy):
    ax.text(bar.get_width() + 2, bar.get_y() + bar.get_height()/2,
            f'{val:.0f}', va='center', color='white', fontsize=10)

# Fatty acid profile of coconut oil
ax = axes[1, 0]
ax.set_facecolor('#111827')
fatty_acids = {
    'Lauric (C12)': 47.0,
    'Myristic (C14)': 18.0,
    'Palmitic (C16)': 9.0,
    'Caprylic (C8)': 8.0,
    'Capric (C10)': 7.0,
    'Oleic (C18:1)': 6.5,
    'Other': 4.5,
}
labels = list(fatty_acids.keys())
sizes = list(fatty_acids.values())
colors = ['#f59e0b', '#fbbf24', '#fde68a', '#22c55e', '#86efac', '#3b82f6', '#94a3b8']
wedges, texts, autotexts = ax.pie(sizes, labels=labels, colors=colors, autopct='%1.0f%%',
                                    textprops={'fontsize': 8, 'color': 'white'},
                                    pctdistance=0.8)
for t in autotexts:
    t.set_fontsize(7)
ax.set_title('Coconut oil: fatty acid composition', color='white', fontsize=11)

# MCT vs LCT metabolism
ax = axes[1, 1]
ax.set_facecolor('#111827')
chain_length = np.array([6, 8, 10, 12, 14, 16, 18])
mct_fraction = np.array([100, 100, 100, 80, 20, 5, 0])  # % going through portal vein
energy_rate = np.array([95, 90, 85, 80, 60, 50, 45])  # relative oxidation rate

ax.plot(chain_length, mct_fraction, 'o-', color='#22c55e', linewidth=2, label='Portal vein pathway (%)')
ax.plot(chain_length, energy_rate, 's--', color='#f59e0b', linewidth=2, label='Oxidation rate (relative)')
ax.axvspan(6, 12, alpha=0.1, color='#22c55e', label='MCT range')
ax.axvspan(14, 18, alpha=0.1, color='#ef4444', label='LCT range')
ax.set_xlabel('Fatty acid chain length (carbons)', color='white')
ax.set_ylabel('Percentage', color='white')
ax.set_title('MCT metabolism: shorter chains = faster energy', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("NUTRITIONAL ANALYSIS")
print(f"Coconut energy: {energy[0]:.0f} kcal/100g (fat provides {fruits_data[list(fruits_data.keys())[0]]['fat']*9:.0f} kcal)")
print(f"Jackfruit energy: {energy[1]:.0f} kcal/100g (carbs provide {fruits_data[list(fruits_data.keys())[1]]['carb']*4:.0f} kcal)")
print()
print("Coconut's medium-chain triglycerides (MCTs) go directly to the liver —")
print("  bypassing lymphatic absorption, providing rapid ketone energy.")
print("Jackfruit's starch provides sustained glucose release, ideal for")
print("  tropical subsistence diets where coconut fat is not available.")`,
      challenge: 'Calculate the amino acid score of coconut meat vs jackfruit seeds. Both have protein, but the limiting amino acid differs. Which fruit would a vegetarian athlete prefer as a protein source?',
      successHint: 'Nutritional biochemistry connects molecular structure to metabolism to ecology. The coconut did not "choose" to store MCTs — natural selection favored seeds with energy-dense, rapidly-metabolizable fats that could fuel germination after months at sea.',
    },
    {
      title: 'Tropical agroforestry — the science of multi-story farming',
      concept: `In Assam and across the tropics, farmers have grown coconut and jackfruit together for centuries. This is not tradition for tradition's sake — it is **agroforestry**, a farming system backed by ecological science.

A well-designed agroforestry system mimics the vertical structure of a natural forest:

- **Canopy layer** (15-25m): coconut palms — their narrow crown lets light through
- **Sub-canopy** (8-15m): jackfruit, breadfruit — broader crowns that catch filtered light
- **Understory** (2-5m): banana, papaya, coffee — shade-tolerant crops
- **Ground layer** (0-2m): turmeric, ginger, taro — deep shade, high humidity
- **Root zone**: different species root at different depths, reducing competition

Key scientific principles:
- **Light partitioning**: each layer captures photons the layer above missed
- **Nutrient cycling**: deep-rooted trees mine minerals from subsoil and deposit them as leaf litter
- **Biological nitrogen fixation**: legume trees (e.g., Gliricidia) convert atmospheric N2 to plant-available nitrogen
- **Microclimate modification**: canopy reduces temperature extremes and wind speed, increasing humidity for understory crops

Monoculture wastes most sunlight — only one layer captures photons. Agroforestry captures light at every height, achieving 30-60% higher total productivity per hectare.`,
      analogy: 'Agroforestry is like a well-designed apartment building. A monoculture is a single-story house — it uses only the ground floor. An agroforestry system uses every floor: the penthouse (coconut), upper floors (jackfruit), middle floors (banana), ground floor (ginger), and basement (root crops). Same plot of land, five times the tenants. Each tenant uses a different resource (light level, soil depth), so they do not compete — they complement.',
      storyConnection: 'The coconut and jackfruit growing side by side is not a coincidence in the story — it reflects the real agroforestry gardens of Northeast India. The coconut palm, tall and narrow, lets just enough light through for the broad-crowned jackfruit below. Together they produce more food per acre than either could alone.',
      checkQuestion: 'A farmer clears a forest and plants only coconut palms in rows. Yields are high for 5 years, then decline. Why?',
      checkAnswer: 'Monoculture depletes specific soil nutrients without replenishment. Coconut palms mine potassium heavily and return minimal organic matter (compared to a diverse forest with leaf litter from multiple species). Without the nutrient cycling provided by diverse root systems and leaf fall, soil organic carbon declines, beneficial soil microbes die, and pest/disease pressure builds (no biological control from diverse ecosystems). Agroforestry avoids this by maintaining nutrient cycling and biodiversity.',
      codeIntro: 'Model light interception through a multi-story agroforestry canopy and compare productivity against monoculture.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Light interception model
# Beer-Lambert law: I = I0 * exp(-k * LAI)
# where k = light extinction coefficient, LAI = leaf area index

layers = {
    'Coconut palm': {'height': 20, 'LAI': 2.5, 'k': 0.4, 'color': '#22c55e'},
    'Jackfruit': {'height': 12, 'LAI': 3.0, 'k': 0.6, 'color': '#65a30d'},
    'Banana': {'height': 4, 'LAI': 3.5, 'k': 0.7, 'color': '#fbbf24'},
    'Turmeric': {'height': 1, 'LAI': 2.0, 'k': 0.5, 'color': '#f59e0b'},
}

# Calculate light at each layer
I0 = 100  # full sunlight (%)
light_profile = {'Above canopy': I0}
remaining_light = I0
for name, data in layers.items():
    absorbed = remaining_light * (1 - np.exp(-data['k'] * data['LAI']))
    light_profile[name] = absorbed
    remaining_light -= absorbed
light_profile['Ground'] = remaining_light

# Monoculture comparison
mono_coconut = I0 * (1 - np.exp(-0.4 * 2.5))  # only coconut
mono_jackfruit = I0 * (1 - np.exp(-0.6 * 3.0))  # only jackfruit

total_agroforestry = sum(v for k, v in light_profile.items() if k not in ['Above canopy', 'Ground'])

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Vertical light profile
ax = axes[0, 0]
ax.set_facecolor('#111827')
heights = [20, 12, 4, 1, 0]
light_vals = [I0]
l = I0
for name, data in layers.items():
    l = l * np.exp(-data['k'] * data['LAI'])
    light_vals.append(l)

ax.plot(light_vals, heights, 'o-', color='#fbbf24', linewidth=2, markersize=8)
for i, (name, data) in enumerate(layers.items()):
    ax.axhspan(data['height'] - 1, data['height'] + 1, alpha=0.15, color=data['color'])
    ax.text(light_vals[i] + 2, heights[i], f'{name}\
({light_vals[i]:.0f}%→{light_vals[i+1]:.0f}%)',
            fontsize=8, color='white', va='center')
ax.set_xlabel('Light intensity (% of full sun)', color='white')
ax.set_ylabel('Height (m)', color='white')
ax.set_title('Light profile through agroforestry canopy', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Light capture comparison
ax = axes[0, 1]
ax.set_facecolor('#111827')
capture_names = list(layers.keys())
capture_vals = [light_profile[n] for n in capture_names]
bar_colors = [layers[n]['color'] for n in capture_names]
ax.bar(capture_names, capture_vals, color=bar_colors, edgecolor='none')
ax.set_ylabel('Light captured (%)', color='white')
ax.set_title('Light captured by each layer', color='white', fontsize=11)
ax.tick_params(colors='gray')
for n, v in zip(capture_names, capture_vals):
    ax.text(capture_names.index(n), v + 1, f'{v:.1f}%', ha='center', color='white', fontsize=9)

# Monoculture vs agroforestry
ax = axes[1, 0]
ax.set_facecolor('#111827')
systems = ['Coconut\
mono', 'Jackfruit\
mono', 'Agroforestry\
(4-layer)']
captured = [mono_coconut, mono_jackfruit, total_agroforestry]
sys_colors = ['#22c55e', '#65a30d', '#a855f7']
bars = ax.bar(systems, captured, color=sys_colors, edgecolor='none')
ax.set_ylabel('Total light captured (%)', color='white')
ax.set_title('Total light capture: mono vs multi-layer', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, val in zip(bars, captured):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
            f'{val:.1f}%', ha='center', color='white', fontsize=11, fontweight='bold')

# Productivity simulation over 10 years
ax = axes[1, 1]
ax.set_facecolor('#111827')
years = np.arange(1, 11)
# Monoculture: high initial yield, declines due to soil depletion
mono_yield = 100 * np.exp(-0.05 * years) + np.random.normal(0, 3, len(years))
# Agroforestry: lower initial yield (trees growing), but stable and increasing
agro_yield = 60 + 5 * years + np.random.normal(0, 3, len(years))

ax.plot(years, mono_yield, 'o-', color='#ef4444', linewidth=2, label='Monoculture')
ax.plot(years, agro_yield, 'o-', color='#22c55e', linewidth=2, label='Agroforestry')
ax.fill_between(years, mono_yield, agro_yield, where=agro_yield > mono_yield,
                alpha=0.15, color='#22c55e', label='Agroforestry advantage')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Relative yield index', color='white')
ax.set_title('10-year yield trajectory', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("AGROFORESTRY ANALYSIS")
print(f"Monoculture (coconut) captures: {mono_coconut:.1f}% of sunlight")
print(f"Monoculture (jackfruit) captures: {mono_jackfruit:.1f}% of sunlight")
print(f"Agroforestry (4-layer) captures: {total_agroforestry:.1f}% of sunlight")
print(f"Advantage: {total_agroforestry / max(mono_coconut, mono_jackfruit):.1f}x more light captured")
print()
print("By year 7, agroforestry outproduces monoculture AND improves soil health.")
print("This is why traditional farmers in Assam never plant just one crop.")`,
      challenge: 'Add a nitrogen-fixing legume tree (e.g., Gliricidia) to the model. Estimate the nitrogen contribution (typical: 60-100 kg N/ha/year from leaf prunings) and show how it reduces the need for synthetic fertilizer.',
      successHint: 'Agroforestry is ecology applied to farming. It works because natural forests already solved the problem of maximizing productivity per unit of land — we just need to replace some wild species with food crops while keeping the structure intact.',
    },
    {
      title: 'Companion planting — chemical ecology of plant neighbors',
      concept: `Companion planting is not folklore — it is **chemical ecology**. Plants communicate and interact through a complex web of volatile organic compounds (VOCs), root exudates, and allelopathic chemicals.

Key mechanisms:

- **Allelopathy**: some plants release chemicals that inhibit neighbors. Walnut trees produce **juglone** that kills tomatoes and peppers. Coconut husks release tannins that suppress weed germination.
- **Volatile signaling**: when a plant is attacked by herbivores, it releases VOCs (like methyl jasmonate) that warn neighboring plants to activate their defenses preemptively.
- **Root exudates**: plants secrete sugars, amino acids, and organic acids from their roots that feed specific soil microbes. Legumes feed nitrogen-fixing bacteria. Some grasses exude compounds that solubilize phosphorus.
- **Trap cropping**: planting a pest-attracting crop next to your main crop to lure pests away.
- **Nurse plants**: large plants modify microclimate (shade, humidity, wind protection) to help smaller plants establish.

The jackfruit tree is an excellent companion because its deep taproot does not compete with shallow-rooted crops, its dense canopy suppresses weeds, and its leaf litter provides mulch. Coconut palms are compatible with almost everything because their narrow crown lets through 50-60% of sunlight.`,
      analogy: 'Companion planting is like assembling a team. You do not want five goalkeepers — you want players with complementary skills who enhance each other. A marigold next to a tomato is like a defensive midfielder — it intercepts pests (nematodes) before they reach the star player. Basil next to tomatoes is like a coach who boosts morale (VOCs that confuse pest navigation). The best gardens, like the best teams, are designed for synergy.',
      storyConnection: 'The coconut and jackfruit are natural companions. In the story, they grow side by side — the tall coconut providing filtered light, the jackfruit providing deep shade below. Neither competes with the other because they occupy different vertical and root zones. This is the same principle traditional Assamese farmers use in their bari (home gardens), where dozens of species coexist in apparent chaos but precise ecological order.',
      checkQuestion: 'A farmer plants coconut, jackfruit, and also black walnut trees together. All three are valuable crops. Why might this fail?',
      checkAnswer: 'Black walnut (Juglans nigra) produces juglone, a potent allelopathic compound that inhibits the growth of many plants including many tropical species. The juglone leaches from roots, leaves, and hulls into the soil, creating a "toxic zone" around the tree. While coconut and jackfruit are tropical (and walnut is temperate, so they would not actually grow together), the principle matters: not all valuable crops are compatible. Allelopathic interactions must be tested before companion planting.',
      codeIntro: 'Model allelopathic interactions between companion plants and simulate the growth effects of positive and negative plant neighbors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Companion planting interaction matrix
# Positive = growth boost, Negative = allelopathic inhibition
species = ['Coconut', 'Jackfruit', 'Banana', 'Turmeric', 'Black Pepper', 'Marigold']
n_sp = len(species)

# Interaction matrix (effect of column species on row species growth)
# Values: -1 to +1 (strong inhibition to strong facilitation)
interaction = np.array([
    [ 0.0,  0.1,  0.05, 0.0,  0.0,  0.05],  # Coconut
    [ 0.15, 0.0,  0.1,  0.05, 0.1,  0.05],  # Jackfruit
    [ 0.2,  0.3,  0.0,  0.1,  0.05, 0.1 ],  # Banana (benefits from shade)
    [ 0.1,  0.4,  0.2,  0.0,  0.05, 0.15],  # Turmeric (needs shade)
    [ 0.3,  0.2,  0.1,  0.05, 0.0,  0.1 ],  # Black Pepper (climbs coconut)
    [ 0.0,  0.0,  0.05, 0.0,  0.0,  0.0 ],  # Marigold (pest deterrent)
])

# Simulate growth over 12 months
months = np.arange(1, 13)

# Solo growth (logistic model)
K = 100  # carrying capacity
r = 0.3  # intrinsic growth rate
solo_growth = K / (1 + (K/10 - 1) * np.exp(-r * months[:, None]))

# Companion growth (with interaction effects)
companion_growth = np.zeros((12, n_sp))
for t in range(12):
    for i in range(n_sp):
        base = solo_growth[t, i]
        boost = sum(interaction[i, j] * solo_growth[t, j] / K for j in range(n_sp) if j != i)
        companion_growth[t, i] = base * (1 + boost)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Interaction matrix heatmap
ax = axes[0, 0]
ax.set_facecolor('#111827')
im = ax.imshow(interaction, cmap='RdYlGn', vmin=-0.3, vmax=0.4, aspect='auto')
ax.set_xticks(range(n_sp))
ax.set_yticks(range(n_sp))
ax.set_xticklabels(species, color='white', fontsize=7, rotation=45, ha='right')
ax.set_yticklabels(species, color='white', fontsize=7)
ax.set_title('Companion planting interaction matrix', color='white', fontsize=11)
for i in range(n_sp):
    for j in range(n_sp):
        ax.text(j, i, f'{interaction[i,j]:.2f}', ha='center', va='center',
                fontsize=7, color='black' if interaction[i,j] > 0.1 else 'white')
plt.colorbar(im, ax=ax, label='Effect on growth')

# Growth comparison: solo vs companion
colors_list = ['#22c55e', '#65a30d', '#fbbf24', '#f59e0b', '#a855f7', '#ef4444']
ax = axes[0, 1]
ax.set_facecolor('#111827')
for i in range(n_sp):
    ax.plot(months, solo_growth[:, i], '--', color=colors_list[i], alpha=0.5, linewidth=1)
    ax.plot(months, companion_growth[:, i], '-', color=colors_list[i], linewidth=2, label=species[i])
ax.set_xlabel('Month', color='white')
ax.set_ylabel('Growth index', color='white')
ax.set_title('Solo (dashed) vs companion (solid) growth', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, loc='lower right')
ax.tick_params(colors='gray')

# Benefit analysis
ax = axes[1, 0]
ax.set_facecolor('#111827')
final_solo = solo_growth[-1, :]
final_comp = companion_growth[-1, :]
benefit = ((final_comp - final_solo) / final_solo) * 100
bars = ax.barh(species, benefit, color=colors_list, edgecolor='none')
ax.set_xlabel('Growth benefit from companions (%)', color='white')
ax.set_title('Companion planting benefit per species', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, val in zip(bars, benefit):
    ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
            f'+{val:.1f}%', va='center', color='white', fontsize=9)

# VOC signaling simulation
ax = axes[1, 1]
ax.set_facecolor('#111827')
# When one plant is attacked (hour 4), it releases VOCs
# Neighbors detect VOCs and upregulate defense genes
hours = np.arange(0, 24, 0.1)
attack_time = 4
voc_signal = np.where(hours > attack_time,
                       50 * (1 - np.exp(-0.5 * (hours - attack_time))) * np.exp(-0.1 * (hours - attack_time)),
                       0)
# Neighbor defense response (delayed by 1-2 hours)
for delay, label, color in [(0, 'Attacked plant (VOC emission)', '#ef4444'),
                              (1.5, 'Neighbor 1 (defense genes)', '#22c55e'),
                              (3.0, 'Neighbor 2 (further away)', '#3b82f6')]:
    response = np.where(hours > attack_time + delay,
                         40 * (1 - np.exp(-0.3 * (hours - attack_time - delay))),
                         0)
    if delay == 0:
        ax.plot(hours, voc_signal, color=color, linewidth=2, label=label)
    else:
        ax.plot(hours, response, color=color, linewidth=2, label=label)

ax.axvline(attack_time, color='#f59e0b', linestyle='--', alpha=0.5, label='Herbivore attack')
ax.set_xlabel('Hours', color='white')
ax.set_ylabel('Signal / Defense level (AU)', color='white')
ax.set_title('VOC signaling: plant-to-plant communication', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

best = species[np.argmax(benefit)]
print("COMPANION PLANTING ANALYSIS")
print(f"Greatest beneficiary: {best} (+{max(benefit):.1f}% growth with companions)")
print(f"Total system yield (solo): {sum(final_solo):.0f}")
print(f"Total system yield (companion): {sum(final_comp):.0f}")
print(f"System-level benefit: +{(sum(final_comp)/sum(final_solo) - 1)*100:.1f}%")
print()
print("Plants are not passive — they communicate through VOCs and root exudates.")
print("Good companion planting is applied chemical ecology.")
print("Bad combinations (allelopathy) can destroy a garden.")`,
      challenge: 'Add an allelopathic species (e.g., eucalyptus with negative interaction values) to the matrix and observe how it suppresses all neighbors. How would you position it in a real garden to minimize damage?',
      successHint: 'Chemical ecology is one of the fastest-growing fields in biology. Plants produce over 100,000 known secondary metabolites — most of their purposes remain unknown. Every traditional farming practice that "works for mysterious reasons" is waiting for a chemical ecology explanation.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Plant Biology & Biochemistry
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (plant science fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for biological modeling. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}
