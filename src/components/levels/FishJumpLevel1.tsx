import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FishJumpLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Fish anatomy — a body built for water',
      concept: `Fish have evolved for over 500 million years in water, and their bodies are masterpieces of hydrodynamic engineering. The fish of the Barak River — mahseer, catfish, snakeheads, and carp — all share fundamental anatomical features adapted for aquatic life.

Key anatomical systems:
- **Streamlined body**: most fish have a fusiform (torpedo) shape that minimizes drag. The widest point is about one-third from the head — the same ratio used in submarine design.
- **Scales**: overlapping plates that protect the skin while allowing flexibility. They are covered in mucus that reduces friction drag by 5-10%.
- **Lateral line**: a row of pressure-sensitive organs along each side that detect water movements. Fish can "feel" nearby objects, currents, and even other fish without seeing them.
- **Swim bladder**: an internal gas-filled sac that controls buoyancy. By adjusting gas volume, fish can hover at any depth without swimming — like a submarine's ballast tanks.
- **Fins**: dorsal (stability), pectoral (steering/braking), pelvic (stability), anal (stability), and caudal/tail (propulsion). Each fin solves a different hydrodynamic problem.
- **Muscles**: arranged in W-shaped blocks (myomeres) along the body. When they contract alternately left and right, the body undulates — pushing water backward and propelling the fish forward.`,
      analogy: 'A fish is like a self-propelled submarine. The swim bladder is the ballast tank (controls depth). The lateral line is the sonar system (detects surroundings). The scales are the hull plating (protective, low-friction). The caudal fin is the propeller (thrust). The mucus layer is like the anti-fouling paint on a ship hull (reduces drag). Evolution arrived at the same engineering solutions that naval architects did — 500 million years earlier.',
      storyConnection: 'The Barak River fishermen can identify fish species by the shape of the splash when they jump. A mahseer\'s powerful, muscular leap looks different from a catfish\'s awkward belly-flop. They are reading fish anatomy from the water\'s surface — the same data a biologist records, just interpreted through generations of experience.',
      checkQuestion: 'Fish are cold-blooded (ectothermic) — their body temperature matches the water. What advantage does this give them over warm-blooded animals?',
      checkAnswer: 'Cold-blooded animals do not spend energy maintaining body temperature. A mammal uses 80-90% of its food energy just to stay warm. A fish uses almost all its food energy for growth, reproduction, and movement. This is why fish can survive on much less food than a mammal of the same size. The trade-off: in cold water, muscles work slowly, so cold-blooded fish are sluggish in winter.',
      codeIntro: 'Visualize fish body proportions and the relationship between shape and swimming speed.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Fish body shape analysis
# Fineness ratio = length / max diameter
# Optimal for low drag: 4-7

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Fish body shapes
ax1.set_facecolor('#111827')

# Generate fish body outlines using NACA-like profiles
def fish_body(length, max_width, x_max_frac=0.33, n_points=200):
    x = np.linspace(0, length, n_points)
    # Upper profile
    t = x / length
    # Modified to peak at x_max_frac
    y_upper = max_width * (t / x_max_frac)**0.5 * np.where(t <= x_max_frac, 1,
              ((1 - t) / (1 - x_max_frac))**1.5)
    return x, y_upper

fish_types = {
    'Mahseer (torpedo)': {'L': 60, 'W': 12, 'x_frac': 0.35, 'color': '#f59e0b', 'speed': 8},
    'Catfish (broad)': {'L': 50, 'W': 15, 'x_frac': 0.30, 'color': '#3b82f6', 'speed': 3},
    'Snakehead (elongated)': {'L': 70, 'W': 8, 'x_frac': 0.25, 'color': '#22c55e', 'speed': 5},
    'Carp (deep-bodied)': {'L': 45, 'W': 18, 'x_frac': 0.40, 'color': '#a855f7', 'speed': 4},
}

y_offset = 0
for name, params in fish_types.items():
    x, y = fish_body(params['L'], params['W']/2, params['x_frac'])
    ax1.fill_between(x, y + y_offset, -y + y_offset, color=params['color'], alpha=0.6)
    ax1.plot(x, y + y_offset, color=params['color'], linewidth=1.5)
    ax1.plot(x, -y + y_offset, color=params['color'], linewidth=1.5)
    ratio = params['L'] / params['W']
    ax1.text(params['L'] + 2, y_offset, f'{name}\nL/W = {ratio:.1f}', color=params['color'],
            fontsize=8, va='center')
    y_offset -= 25

ax1.set_xlim(-5, 100)
ax1.set_title('Barak River Fish: Body Shapes', color='white', fontsize=13)
ax1.set_xlabel('Length (cm)', color='white')
ax1.tick_params(colors='gray')
ax1.set_yticks([])

# Swimming speed vs fineness ratio
ax2.set_facecolor('#111827')
fineness_ratios = np.linspace(1, 10, 100)
# Drag is minimized at fineness ratio ~4.5
drag_coefficient = 0.1 + 0.005 * (fineness_ratios - 4.5)**2
max_speed = 1.0 / drag_coefficient  # simplified: max speed inversely proportional to drag

ax2.plot(fineness_ratios, max_speed / max_speed.max() * 10, color='#3b82f6', linewidth=2,
         label='Relative max speed')
ax2.axvline(4.5, color='#f59e0b', linestyle='--', linewidth=1, label='Optimal ratio (~4.5)')

# Plot actual fish
for name, params in fish_types.items():
    ratio = params['L'] / params['W']
    ax2.plot(ratio, params['speed'], 'o', color=params['color'], markersize=10)
    ax2.annotate(name.split(' (')[0], xy=(ratio, params['speed']),
                xytext=(ratio + 0.3, params['speed'] + 0.3), color=params['color'], fontsize=8)

ax2.set_xlabel('Fineness ratio (length / width)', color='white')
ax2.set_ylabel('Maximum speed (body lengths/s)', color='white')
ax2.set_title('Body Shape vs Swimming Speed', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fish anatomy and hydrodynamics:")
for name, params in fish_types.items():
    ratio = params['L'] / params['W']
    print(f"  {name}: {params['L']}cm long, L/W={ratio:.1f}, max speed={params['speed']} BL/s")
print()
print("The optimal fineness ratio for minimum drag is ~4.5.")
print("Torpedo-shaped fish (mahseer) are closest to this — they are the fastest swimmers.")
print("Deep-bodied fish (carp) trade speed for manoeuvrability.")`,
      challenge: 'A tuna has a fineness ratio of about 4.3 and can swim at 75 km/h. A sunfish (mola) has a ratio of about 1.5 and can barely manage 3 km/h. Plot both on the speed chart. Does the relationship hold?',
      successHint: 'Fish anatomy is convergent with submarine engineering — both solve the same problem (moving efficiently through water). Understanding fish body design is the first step toward understanding aquatic ecosystems, biomechanics, and bio-inspired engineering.',
    },
    {
      title: 'Gills and breathing underwater — extracting dissolved oxygen',
      concept: `Humans breathe air (21% oxygen). Fish breathe water — which contains only about 1% as much dissolved oxygen. To extract enough oxygen from such a dilute source, fish have evolved an extraordinary organ: the **gill**.

How gills work:
1. Water enters through the mouth
2. It flows over the **gill arches** (4 pairs in most fish)
3. Each arch has hundreds of **gill filaments** (thin, finger-like projections)
4. Each filament has thousands of **lamellae** (microscopic folds that increase surface area)
5. Oxygen diffuses from the water across the thin lamella walls into the blood
6. CO₂ diffuses from the blood into the water
7. Deoxygenated water exits through the gill covers (opercula)

The key to gill efficiency is **countercurrent exchange**: blood flows through the lamellae in the opposite direction to the water flowing over them. This maintains a concentration gradient along the entire length, extracting up to 80-90% of dissolved oxygen — far more efficient than our lungs (~25%).

Surface area is critical. A medium-sized fish has a gill surface area of 1-5 m² — packed into a space smaller than your thumb. This is why gill damage (from pollution, parasites, or low oxygen) is so dangerous — it immediately reduces the fish's ability to breathe.`,
      analogy: 'Gills are like a car radiator run in reverse. A radiator transfers heat from hot coolant to cool air flowing past. A gill transfers oxygen from oxygen-rich water to oxygen-poor blood flowing past. Both use the same strategy: huge surface area from many thin channels, and flow in opposite directions (countercurrent) to maximize the transfer.',
      storyConnection: 'The fishermen along the Barak River know that fish concentrate at rapids and waterfalls — places where the water is churned and aerated. Turbulent water dissolves more atmospheric oxygen. Fish gather where the breathing is easiest — the same reason you would prefer a well-ventilated room over a stuffy one.',
      checkQuestion: 'If a fish is taken out of water, it has gills exposed to air (21% oxygen — far more than dissolved in water). Why does it suffocate?',
      checkAnswer: 'In air, the gill filaments collapse and stick together because water no longer supports them. The huge surface area that works in water becomes a clumped, useless mass in air. Also, the thin lamellae dry out rapidly, and dry surfaces cannot exchange gases. Gills are optimized for water — they need the physical support and moisture that water provides. It is like trying to use a parachute underwater — the medium matters.',
      codeIntro: 'Model countercurrent exchange and compare it to concurrent (same direction) flow.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Countercurrent vs concurrent gas exchange
length = np.linspace(0, 1, 100)  # position along gill (0 = entry, 1 = exit)

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Concurrent (same direction) exchange
ax1.set_facecolor('#111827')
# Water enters at O2 = 100%, blood enters at O2 = 40%
# They equilibrate toward the same value (~70%)
water_concurrent = 100 * np.exp(-3 * length) + 70 * (1 - np.exp(-3 * length))
blood_concurrent = 40 * np.exp(-3 * length) + 70 * (1 - np.exp(-3 * length))

ax1.plot(length, water_concurrent, color='#3b82f6', linewidth=2, label='Water O₂')
ax1.plot(length, blood_concurrent, color='#ef4444', linewidth=2, label='Blood O₂')
ax1.fill_between(length, water_concurrent, blood_concurrent, alpha=0.15, color='#f59e0b')
ax1.set_xlabel('Position along gill', color='white')
ax1.set_ylabel('O₂ saturation (%)', color='white')
ax1.set_title('Concurrent Flow: Both Same Direction', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.annotate(f'O₂ extracted: {100 - water_concurrent[-1]:.0f}%',
            xy=(0.7, 75), color='#f59e0b', fontsize=10,
            bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#f59e0b'))

# Countercurrent (opposite directions) exchange
ax2.set_facecolor('#111827')
# Water flows left→right, blood flows right→left
# The gradient is maintained along the entire length
water_counter = 100 - 85 * length  # water loses O₂ gradually
blood_counter = 90 - 85 * length  # blood gains O₂ gradually (flows opposite)

ax2.plot(length, water_counter, color='#3b82f6', linewidth=2, label='Water O₂ (→)')
ax2.plot(length, blood_counter, color='#ef4444', linewidth=2, label='Blood O₂ (←)')
ax2.fill_between(length, water_counter, blood_counter, alpha=0.15, color='#22c55e')

# Arrows showing flow direction
ax2.annotate('', xy=(0.8, 95), xytext=(0.2, 95),
            arrowprops=dict(arrowstyle='->', color='#3b82f6', lw=2))
ax2.annotate('', xy=(0.2, 3), xytext=(0.8, 3),
            arrowprops=dict(arrowstyle='->', color='#ef4444', lw=2))
ax2.text(0.5, 97, 'Water flow →', ha='center', color='#3b82f6', fontsize=9)
ax2.text(0.5, 0, '← Blood flow', ha='center', color='#ef4444', fontsize=9)

ax2.set_xlabel('Position along gill', color='white')
ax2.set_ylabel('O₂ saturation (%)', color='white')
ax2.set_title('Countercurrent Flow: Opposite Directions', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.annotate(f'O₂ extracted: {100 - water_counter[-1]:.0f}%',
            xy=(0.7, 50), color='#22c55e', fontsize=10,
            bbox=dict(boxstyle='round', facecolor='#1f2937', edgecolor='#22c55e'))

# Extraction efficiency comparison
ax3.set_facecolor('#111827')
methods = ['Concurrent\n(same direction)', 'Countercurrent\n(opposite)', 'Human lungs\n(tidal breathing)']
efficiencies = [50, 85, 25]
colors_bar = ['#f59e0b', '#22c55e', '#a855f7']
bars = ax3.bar(methods, efficiencies, color=colors_bar, edgecolor='none')
ax3.set_ylabel('O₂ extraction efficiency (%)', color='white')
ax3.set_title('Gas Exchange Efficiency Comparison', color='white', fontsize=12)
ax3.tick_params(colors='gray')
for bar, eff in zip(bars, efficiencies):
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1,
             f'{eff}%', ha='center', color='white', fontsize=12, fontweight='bold')

# Dissolved oxygen vs temperature
ax4.set_facecolor('#111827')
temps = np.linspace(0, 40, 100)  # °C
# Henry's law: dissolved O2 decreases with temperature
do_sat = 14.6 * np.exp(-0.0299 * temps)  # mg/L (simplified)

ax4.plot(temps, do_sat, color='#3b82f6', linewidth=2)
ax4.fill_between(temps, do_sat, alpha=0.15, color='#3b82f6')
ax4.set_xlabel('Water temperature (°C)', color='white')
ax4.set_ylabel('Dissolved O₂ at saturation (mg/L)', color='white')
ax4.set_title('Warmer Water Holds Less Oxygen', color='white', fontsize=12)
ax4.tick_params(colors='gray')

# Mark fish comfort zones
ax4.axhspan(5, 15, color='#22c55e', alpha=0.1)
ax4.axhspan(2, 5, color='#f59e0b', alpha=0.1)
ax4.axhspan(0, 2, color='#ef4444', alpha=0.1)
ax4.text(35, 7, 'Comfortable', color='#22c55e', fontsize=9)
ax4.text(35, 3.5, 'Stressed', color='#f59e0b', fontsize=9)
ax4.text(35, 1, 'Lethal', color='#ef4444', fontsize=9)

# Barak River range
ax4.axvline(20, color='#f59e0b', linestyle='--', linewidth=1, alpha=0.5)
ax4.axvline(32, color='#f59e0b', linestyle='--', linewidth=1, alpha=0.5)
ax4.text(26, 12, 'Barak River\nrange', ha='center', color='#f59e0b', fontsize=9)

plt.tight_layout()
plt.show()

print("Gas exchange comparison:")
print(f"  Concurrent flow: ~50% O₂ extracted")
print(f"  Countercurrent flow: ~85% O₂ extracted")
print(f"  Human lungs: ~25% O₂ extracted")
print()
print("Dissolved oxygen in water:")
print(f"  At 20°C: {14.6 * np.exp(-0.0299 * 20):.1f} mg/L")
print(f"  At 30°C: {14.6 * np.exp(-0.0299 * 30):.1f} mg/L")
print(f"  Air contains ~210 mg/L of O₂")
print(f"  Water contains ~40x LESS oxygen than air")
print()
print("This is why fish need such efficient gills —")
print("they must extract oxygen from an extremely dilute source.")`,
      challenge: 'If climate change warms the Barak River by 3°C (from 25°C to 28°C), how much dissolved oxygen is lost? What percentage decrease is that? Why might this be more dangerous than it sounds?',
      successHint: 'The countercurrent exchange principle is used everywhere in engineering: heat exchangers, distillation columns, kidney dialysis machines. Fish evolved this principle hundreds of millions of years before humans reinvented it.',
    },
    {
      title: 'Freshwater ecosystems — the web of life in a river',
      concept: `The Barak River is not just water flowing in a channel. It is a complex **ecosystem** — a community of living organisms interacting with each other and their physical environment.

Components of a river ecosystem:
- **Producers** (autotrophs): algae, aquatic plants, phytoplankton. They convert sunlight into organic matter through photosynthesis — the base of the food web.
- **Primary consumers** (herbivores): small invertebrates, some fish species, tadpoles. They eat algae and plants.
- **Secondary consumers** (predators): larger fish, frogs, water snakes. They eat the herbivores.
- **Tertiary consumers** (apex predators): large mahseer, otters, fish eagles. Top of the food chain.
- **Decomposers**: bacteria, fungi. They break down dead matter and recycle nutrients.

**Energy flow** through the ecosystem follows the **10% rule**: roughly 10% of energy at each trophic level is passed to the next. If algae capture 10,000 kJ of solar energy, herbivores get ~1,000 kJ, small predators get ~100 kJ, and apex predators get ~10 kJ. This is why there are many more small fish than large predators — energy limits pyramid size.

**Nutrient cycling** is equally important. Nitrogen, phosphorus, and carbon cycle between organisms, water, sediment, and atmosphere. Human activities (agriculture, sewage) can overload these cycles, causing **eutrophication** — excessive algae growth that depletes oxygen and kills fish.`,
      analogy: 'A river ecosystem is like a company. Producers (algae) are the factory workers making the basic product. Herbivores are middle managers consuming the products. Predators are executives consuming the managers\' output. Decomposers are the recycling department. If the factory shuts down (algae die), the entire company collapses from the bottom up.',
      storyConnection: 'The elders along the Barak River say "when the river is healthy, everything is healthy." This captures the essence of ecosystem thinking. Fish cannot be healthy if their food (insects) is not healthy. Insects cannot be healthy if their food (algae) is not healthy. Algae cannot be healthy if the water is not clean. Everything is connected.',
      checkQuestion: 'If a river has 1,000 kg of algae, how many kg of top predator fish can it support? Use the 10% rule.',
      checkAnswer: '1,000 kg algae → 100 kg herbivores → 10 kg small predators → 1 kg top predators. This is why a river can support thousands of small fish but only a handful of large mahseer. It also explains why overfishing top predators is so damaging — they represent a tiny fraction of the ecosystem\'s biomass but take years to replace.',
      codeIntro: 'Model a river food web and the energy pyramid.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# River ecosystem model
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Energy pyramid
ax1.set_facecolor('#111827')
levels = ['Producers\n(algae, plants)', 'Primary consumers\n(invertebrates)',
          'Secondary consumers\n(small fish)', 'Tertiary consumers\n(mahseer, otters)']
energy = [10000, 1000, 100, 10]  # kJ
colors_list = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

for i, (level, e, color) in enumerate(zip(levels, energy, colors_list)):
    width = e / 100
    ax1.barh(i, width, height=0.6, color=color, edgecolor='none', left=-width/2)
    ax1.text(width/2 + 5, i, f'{level}\n{e:,} kJ', color=color, va='center', fontsize=9)

ax1.set_yticks([])
ax1.set_xlabel('Relative energy (kJ)', color='white')
ax1.set_title('Energy Pyramid: 10% Rule', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Biomass over time with a disturbance
ax2.set_facecolor('#111827')
months = np.arange(0, 24)
np.random.seed(42)

# Normal ecosystem
algae = 1000 + 200 * np.sin(2 * np.pi * months / 12) + np.random.normal(0, 50, 24)
herbivores = 100 + 30 * np.sin(2 * np.pi * (months - 1) / 12) + np.random.normal(0, 10, 24)
predators = 10 + 5 * np.sin(2 * np.pi * (months - 2) / 12) + np.random.normal(0, 2, 24)

# Pollution event at month 12
algae[12:] *= 3  # algal bloom from nutrients
herbivores[13:] *= 0.4  # oxygen depletion kills them
predators[14:] *= 0.2  # cascade upward

ax2.plot(months, algae / 10, color='#22c55e', linewidth=2, label='Algae (÷10)')
ax2.plot(months, herbivores, color='#3b82f6', linewidth=2, label='Herbivores')
ax2.plot(months, predators * 5, color='#ef4444', linewidth=2, label='Predators (×5)')
ax2.axvline(12, color='#f59e0b', linestyle='--', linewidth=2, label='Pollution event')
ax2.set_xlabel('Month', color='white')
ax2.set_ylabel('Biomass (kg)', color='white')
ax2.set_title('Ecosystem Response to Pollution', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

# Species diversity along river
ax3.set_facecolor('#111827')
river_km = np.arange(0, 200)

# Headwaters (clean, cold, few species) → middle (most diverse) → lower (warm, fewer species)
fish_species = 5 + 20 * np.sin(np.pi * river_km / 200)**0.5
invertebrate_species = 10 + 30 * np.sin(np.pi * river_km / 200)**0.7
plant_species = 3 + 15 * np.sin(np.pi * river_km / 200)**0.3

ax3.plot(river_km, fish_species, color='#ef4444', linewidth=2, label='Fish species')
ax3.plot(river_km, invertebrate_species, color='#3b82f6', linewidth=2, label='Invertebrate species')
ax3.plot(river_km, plant_species, color='#22c55e', linewidth=2, label='Plant species')
ax3.set_xlabel('Distance downstream (km)', color='white')
ax3.set_ylabel('Number of species', color='white')
ax3.set_title('Species Diversity Along the River', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax3.tick_params(colors='gray')

# Annotate zones
ax3.text(20, 35, 'Headwaters\n(cold, fast)', color='#60a5fa', fontsize=8, ha='center')
ax3.text(100, 35, 'Middle reaches\n(most diverse)', color='#60a5fa', fontsize=8, ha='center')
ax3.text(180, 35, 'Lower river\n(warm, slow)', color='#60a5fa', fontsize=8, ha='center')

# Nutrient cycle
ax4.set_facecolor('#111827')
# Simple nutrient dynamics: input from agriculture vs natural processing
years = np.arange(0, 20)
natural_input = 10 + np.random.normal(0, 1, 20)  # tonnes/year
agricultural_input = 10 + 2 * years + np.random.normal(0, 2, 20)  # increasing
total_input = natural_input + agricultural_input

# River processing capacity
processing_capacity = 30  # tonnes/year (natural breakdown of nutrients)

ax4.plot(years, natural_input, color='#22c55e', linewidth=2, label='Natural nutrient input')
ax4.plot(years, agricultural_input, color='#f59e0b', linewidth=2, label='Agricultural runoff')
ax4.plot(years, total_input, color='#ef4444', linewidth=2, label='Total input')
ax4.axhline(processing_capacity, color='#3b82f6', linestyle='--', linewidth=2, label='Processing capacity')

ax4.fill_between(years, total_input, processing_capacity,
                 where=total_input > processing_capacity,
                 alpha=0.2, color='#ef4444', label='Excess (eutrophication risk)')

ax4.set_xlabel('Years from now', color='white')
ax4.set_ylabel('Nutrient input (tonnes/year)', color='white')
ax4.set_title('Nutrient Loading: When Capacity is Exceeded', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("River ecosystem summary:")
print(f"  Energy at base (algae): {energy[0]:,} kJ")
print(f"  Energy at top (predators): {energy[3]:,} kJ")
print(f"  Efficiency: {energy[3]/energy[0]*100:.2f}% of base reaches top")
print()
print("Key threats to the Barak River ecosystem:")
print("  1. Agricultural runoff (excess nutrients → algal blooms)")
print("  2. Industrial pollution (toxins → fish kills)")
print("  3. Overfishing (removes predators → ecosystem imbalance)")
print("  4. Dam construction (blocks fish migration)")
print("  5. Deforestation (increases sediment → smothers habitat)")`,
      challenge: 'If you remove all top predators (overfishing), what happens to the rest of the food web? This is called a "trophic cascade." Simulate it: set predators to 0 and track herbivore and algae populations over 24 months.',
      successHint: 'River ecosystems demonstrate that everything is connected. A change at any level — pollution, overfishing, damming — ripples through the entire web. Understanding these connections is essential for managing rivers sustainably.',
    },
    {
      title: 'Why fish jump — physics of the leap',
      concept: `Fish jump out of the water for several reasons — and the physics of each jump is remarkable:

**Reasons fish jump:**
- **Escaping predators**: a sudden leap confuses pursuing predators and can cover distance faster in air than water (no drag)
- **Clearing obstacles**: salmon leap waterfalls to reach spawning grounds. Mahseer in the Barak do the same.
- **Catching aerial insects**: many surface-feeding fish leap to snatch insects above the water
- **Dislodging parasites**: the impact of re-entering water can shake loose external parasites
- **Oxygen**: in low-oxygen water, jumping exposes gills to air briefly

**Physics of the jump:**
A fish leaving the water is a projectile. The maximum height depends on the launch speed and angle:

**h_max = v₀² × sin²(θ) / (2g)**

Where v₀ is the launch speed, θ is the angle, and g is gravity.

A mahseer can burst at ~8 m/s. At the optimal angle of 45°:
- h_max = 8² × sin²(45°) / (2 × 9.8) = 64 × 0.5 / 19.6 = 1.63 metres

But fish also need horizontal distance (to clear a waterfall). The optimal angle for maximum range is 45°:
- Range = v₀² × sin(2θ) / g = 64 × 1 / 9.8 = 6.5 metres

Some salmon have been recorded jumping 3.7m high — requiring a launch speed of over 8.5 m/s.`,
      analogy: 'A fish jumping is like a cannonball being fired — once it leaves the water, only gravity and air resistance act on it. The fish\'s tail is the cannon, the water is the barrel, and the fish\'s muscles are the gunpowder. Like a cannonball, the launch angle determines whether it goes high (straight up) or far (45 degrees).',
      storyConnection: 'The story asks "Why do fish jump in the Barak River?" The elders give a poetic answer. The physics gives a precise answer: they jump at specific speeds and angles, determined by their muscle power and the obstacle they need to clear. Both answers are true — the poetry captures the wonder, the physics captures the mechanics.',
      checkQuestion: 'A fish jumps at 6 m/s at a 60° angle. How high does it go? How far? Would 45° have been better for clearing a waterfall?',
      checkAnswer: 'Height: h = 6² × sin²(60°) / (2 × 9.8) = 36 × 0.75 / 19.6 = 1.38m. Range: R = 36 × sin(120°) / 9.8 = 36 × 0.866 / 9.8 = 3.18m. At 45°: h = 36 × 0.5 / 19.6 = 0.92m, R = 36 / 9.8 = 3.67m. The 60° angle goes higher (1.38m vs 0.92m) but shorter range. For a waterfall, 60° is better — you need height more than range. For clearing a horizontal log, 45° is better.',
      codeIntro: 'Simulate fish jumping trajectories at different speeds and angles.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Fish jump projectile physics
g = 9.8  # m/s²

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Trajectories at different angles
ax1.set_facecolor('#111827')
v0 = 8  # m/s (mahseer burst speed)
angles = [20, 30, 45, 60, 75]
colors_traj = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

for angle, color in zip(angles, colors_traj):
    theta = np.radians(angle)
    t_flight = 2 * v0 * np.sin(theta) / g
    t = np.linspace(0, t_flight, 100)
    x = v0 * np.cos(theta) * t
    y = v0 * np.sin(theta) * t - 0.5 * g * t**2

    h_max = v0**2 * np.sin(theta)**2 / (2 * g)
    r_max = v0**2 * np.sin(2 * theta) / g

    ax1.plot(x, y, color=color, linewidth=2, label=f'{angle}° (h={h_max:.1f}m, r={r_max:.1f}m)')

# Water line
ax1.axhline(0, color='#60a5fa', linewidth=2)
ax1.fill_between([-1, 8], -0.5, 0, color='#1e40af', alpha=0.2)

ax1.set_xlabel('Horizontal distance (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title(f'Fish Jump Trajectories (v₀ = {v0} m/s)', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_ylim(-0.5, 4)
ax1.set_xlim(-0.5, 8)

# Maximum height vs launch speed
ax2.set_facecolor('#111827')
speeds = np.linspace(1, 12, 100)
for angle in [30, 45, 60, 75]:
    theta = np.radians(angle)
    h_max = speeds**2 * np.sin(theta)**2 / (2 * g)
    ax2.plot(speeds, h_max, linewidth=2, label=f'{angle}°')

# Mark real fish
fish_data = [
    ('Carp', 3, 0.3), ('Catfish', 4, 0.5),
    ('Mahseer', 8, 1.6), ('Salmon', 8.5, 3.7),
]
for name, v, h in fish_data:
    ax2.plot(v, h, 'o', markersize=8, color='#f59e0b')
    ax2.annotate(name, xy=(v, h), xytext=(v + 0.3, h + 0.2), color='#f59e0b', fontsize=9)

ax2.set_xlabel('Launch speed (m/s)', color='white')
ax2.set_ylabel('Maximum jump height (m)', color='white')
ax2.set_title('Jump Height vs Speed', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# Energy cost of jumping
ax3.set_facecolor('#111827')
masses = np.linspace(0.1, 5, 50)  # kg
jump_speed = 6  # m/s
kinetic_energy = 0.5 * masses * jump_speed**2  # Joules

# Energy from food (1 insect ≈ 2 kJ)
insects_needed = kinetic_energy / 2000

ax3.plot(masses, kinetic_energy, color='#ef4444', linewidth=2, label='Energy per jump (J)')
ax3_twin = ax3.twinx()
ax3_twin.plot(masses, insects_needed, color='#22c55e', linewidth=2, linestyle='--', label='Insects needed')
ax3.set_xlabel('Fish mass (kg)', color='white')
ax3.set_ylabel('Energy (Joules)', color='#ef4444')
ax3_twin.set_ylabel('Insects to fuel one jump', color='#22c55e')
ax3.set_title('Energy Cost of Jumping', color='white', fontsize=12)
ax3.tick_params(colors='gray')
ax3_twin.tick_params(colors='gray')

lines1, labels1 = ax3.get_legend_handles_labels()
lines2, labels2 = ax3_twin.get_legend_handles_labels()
ax3.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Waterfall challenge: can the fish clear it?
ax4.set_facecolor('#111827')
ax4.set_xlim(-1, 5)
ax4.set_ylim(-1, 4)

# Draw waterfall
waterfall_x = [2, 2, 5]
waterfall_y = [0, 2, 2]
ax4.fill_between([2, 5], 0, 2, color='#92400e', alpha=0.5)
ax4.plot(waterfall_x, waterfall_y, color='#92400e', linewidth=3)

# Water below
ax4.fill_between([-1, 2], -1, 0, color='#1e40af', alpha=0.2)
# Water above
ax4.fill_between([2, 5], 1.5, 2, color='#1e40af', alpha=0.2)

# Fish trajectory that clears the waterfall
v0_jump = 7.5
theta_jump = np.radians(70)
t_max = 2 * v0_jump * np.sin(theta_jump) / g
t = np.linspace(0, t_max * 0.65, 50)
x_traj = 1.0 + v0_jump * np.cos(theta_jump) * t
y_traj = v0_jump * np.sin(theta_jump) * t - 0.5 * g * t**2

ax4.plot(x_traj, y_traj, color='#f59e0b', linewidth=2, label='Successful jump')

# Failed trajectory
v0_fail = 5
t_fail = np.linspace(0, 0.7, 50)
x_fail = 1.0 + v0_fail * np.cos(theta_jump) * t_fail
y_fail = v0_fail * np.sin(theta_jump) * t_fail - 0.5 * g * t_fail**2
ax4.plot(x_fail, y_fail, color='#ef4444', linewidth=2, linestyle='--', label='Failed jump')

ax4.set_title('Clearing a 2m Waterfall', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax4.tick_params(colors='gray')
ax4.set_aspect('equal')

plt.tight_layout()
plt.show()

print("Jump physics summary:")
for name, v, h in fish_data:
    ke = 0.5 * 2 * v**2  # assume 2kg fish
    print(f"  {name}: v={v}m/s, max height={h}m, energy={ke:.0f}J")
print()
print("To clear a 2m waterfall:")
v_min = np.sqrt(2 * g * 2)
print(f"  Minimum vertical speed: {v_min:.1f} m/s")
print(f"  At 70° angle, launch speed needed: {v_min / np.sin(np.radians(70)):.1f} m/s")`,
      challenge: 'Fish must jump from the pool at the base of a waterfall, not from still water. If the pool has a 1 m/s current pushing them downstream, how does this affect the trajectory? Add a horizontal current to the simulation.',
      successHint: 'The physics of a fish jumping is identical to the physics of a thrown ball, a rocket launch, or a basketball shot. Projectile motion is universal — and fish have been solving these equations with their muscles for millions of years.',
    },
    {
      title: 'Fish migration — journeys of survival',
      concept: `Many fish species in the Barak River undertake **migrations** — predictable, seasonal movements between different habitats. Migration is driven by the need to access different resources at different life stages.

Types of fish migration:
- **Anadromous**: live in the sea, migrate to freshwater to spawn (salmon, hilsa). They swim upstream, against the current, for hundreds of kilometres.
- **Catadromous**: live in freshwater, migrate to the sea to spawn (eels).
- **Potamodromous**: migrate entirely within freshwater (mahseer, many Barak River species). They move upstream to spawn in clean, fast-flowing headwaters.

Why migrate? Migration allows fish to use the best habitat for each life stage:
- Spawning grounds: clean gravel beds in cool, oxygenated headwaters
- Nursery areas: shallow, warm floodplain lakes with abundant food for juveniles
- Feeding grounds: deep pools and river channels with diverse prey

**Navigation** during migration is still partially mysterious. Fish use:
- Earth's magnetic field (like a built-in compass)
- Chemical signatures of their home stream (smell)
- Water temperature and flow direction
- Celestial cues (sun position)

Dams are the greatest threat to migratory fish. A dam blocks the migration route completely. Fish ladders help some species, but they are often ineffective for large-bodied fish or species unfamiliar with such structures.`,
      analogy: 'Fish migration is like a nomadic lifestyle driven by seasons. In summer, you move to the highlands for cool air and fresh grass (spawning grounds). In autumn, you bring your children to the lowlands where food is abundant (nursery areas). In winter, you settle near the river where resources are concentrated (feeding grounds). Each location is optimal for one purpose, and the journey is the cost of accessing all of them.',
      storyConnection: 'The Barak River communities have always known about fish migration. They set their nets at specific locations during specific weeks, knowing that migrating fish will pass through. This traditional knowledge is a form of ecological data — and it is being lost as younger generations move to cities. Documenting this knowledge is a conservation priority.',
      checkQuestion: 'A dam is built across the Barak River. Fish cannot reach their upstream spawning grounds. A fish ladder is installed, but only 10% of fish successfully use it. What happens to the population over 10 years?',
      checkAnswer: 'If only 10% reach spawning grounds, reproduction drops by 90%. Even with good survival of those that do spawn, the population declines exponentially. In 10 years (about 3-5 fish generations), the population could collapse to less than 10% of its original size. Additionally, the 10% that do get through may not be a random sample — they might be the smallest fish (fitting through the ladder), creating an evolutionary selection for small body size. The dam changes both the population size and its genetic composition.',
      codeIntro: 'Model fish migration patterns and the impact of dam construction.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Fish migration simulation
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Migration timing through the year
ax1.set_facecolor('#111827')
months = np.arange(1, 13)
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# Different species migrate at different times
species_migration = {
    'Mahseer': {'peak': 6, 'spread': 1.5, 'color': '#f59e0b'},
    'Hilsa': {'peak': 9, 'spread': 1.0, 'color': '#3b82f6'},
    'Catfish': {'peak': 7, 'spread': 2.0, 'color': '#22c55e'},
    'Carp': {'peak': 5, 'spread': 1.5, 'color': '#a855f7'},
}

for name, params in species_migration.items():
    intensity = np.exp(-((months - params['peak'])**2) / (2 * params['spread']**2))
    ax1.plot(months, intensity, color=params['color'], linewidth=2, label=name)
    ax1.fill_between(months, intensity, alpha=0.1, color=params['color'])

ax1.set_xticks(months)
ax1.set_xticklabels(month_names)
ax1.set_xlabel('Month', color='white')
ax1.set_ylabel('Migration intensity', color='white')
ax1.set_title('When Fish Migrate in the Barak River', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Migration route along river
ax2.set_facecolor('#111827')
river_x = np.linspace(0, 100, 200)
river_y = 5 * np.sin(river_x / 15) + river_x * 0.3

ax2.plot(river_x, river_y, color='#60a5fa', linewidth=3, alpha=0.3)

# Key locations
locations = [
    (10, 'Spawning\ngrounds', '#ef4444'),
    (40, 'Nursery\nareas', '#f59e0b'),
    (70, 'Feeding\ngrounds', '#22c55e'),
    (90, 'River\nmouth', '#3b82f6'),
]

for km, label, color in locations:
    idx = np.argmin(np.abs(river_x - km))
    ry = river_y[idx]
    ax2.plot(km, ry, 'o', color=color, markersize=12)
    ax2.text(km, ry + 3, label, ha='center', color=color, fontsize=9, fontweight='bold')

# Dam location
dam_km = 55
dam_idx = np.argmin(np.abs(river_x - dam_km))
dam_y = river_y[dam_idx]
ax2.plot([dam_km, dam_km], [dam_y - 3, dam_y + 3], color='#ef4444', linewidth=4)
ax2.text(dam_km, dam_y + 5, 'DAM', ha='center', color='#ef4444', fontsize=11, fontweight='bold')

# Migration arrows
for i in range(5):
    start_x = 85 - i * 8
    end_x = start_x - 7
    start_idx = np.argmin(np.abs(river_x - start_x))
    end_idx = np.argmin(np.abs(river_x - end_x))
    ax2.annotate('', xy=(end_x, river_y[end_idx]), xytext=(start_x, river_y[start_idx]),
                arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=1.5))

ax2.set_xlabel('Distance upstream (km)', color='white')
ax2.set_ylabel('Elevation (m)', color='white')
ax2.set_title('Migration Route & Dam Blockage', color='white', fontsize=13)
ax2.tick_params(colors='gray')

# Population decline with dam
ax3.set_facecolor('#111827')
years = np.arange(0, 30)

# Scenarios
passage_rates = [1.0, 0.5, 0.1, 0.0]
labels = ['No dam', '50% passage', '10% passage (fish ladder)', 'Complete blockage']
colors_pop = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

for rate, label, color in zip(passage_rates, labels, colors_pop):
    pop = np.zeros(30)
    pop[0] = 1000
    for y in range(1, 30):
        spawners = pop[y-1] * rate * 0.3  # fraction that migrates and spawns
        non_spawners = pop[y-1] * (1 - rate * 0.3 + rate * 0.3 * 0.7)  # adults that survive
        recruits = spawners * 2  # 2 surviving offspring per spawner
        pop[y] = min(non_spawners * 0.85 + recruits, 1500)
        pop[y] = max(pop[y], 0)

    ax3.plot(years, pop, color=color, linewidth=2, label=label)

ax3.set_xlabel('Years after dam construction', color='white')
ax3.set_ylabel('Population', color='white')
ax3.set_title('Dam Impact on Migratory Fish', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax3.tick_params(colors='gray')
ax3.axhline(100, color='gray', linestyle='--', linewidth=0.5)
ax3.text(25, 130, 'Near extinction', color='gray', fontsize=8)

# Energy expenditure during migration
ax4.set_facecolor('#111827')
distance_km = np.linspace(0, 200, 200)
current_speed = 1.5  # m/s average
swim_speed = 2.5  # m/s

# Energy cost increases with distance and current
base_cost = 50  # kJ per km in still water
current_cost = base_cost * (1 + (current_speed / swim_speed)**2)
cumulative_energy = current_cost * distance_km

# Fat reserves
initial_fat = 15000  # kJ (fat reserve at start)
fat_remaining = initial_fat - cumulative_energy

ax4.plot(distance_km, fat_remaining / 1000, color='#f59e0b', linewidth=2, label='Fat reserves')
ax4.axhline(0, color='#ef4444', linestyle='--', linewidth=1)
ax4.fill_between(distance_km, fat_remaining / 1000, 0,
                 where=fat_remaining > 0, alpha=0.1, color='#22c55e')
ax4.fill_between(distance_km, fat_remaining / 1000, 0,
                 where=fat_remaining < 0, alpha=0.1, color='#ef4444')

max_dist = initial_fat / current_cost
ax4.axvline(max_dist, color='#ef4444', linestyle=':', linewidth=1)
ax4.annotate(f'Maximum range:\n{max_dist:.0f} km', xy=(max_dist, 0),
            xytext=(max_dist + 20, 5), color='#ef4444', fontsize=10,
            arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax4.set_xlabel('Distance migrated (km)', color='white')
ax4.set_ylabel('Fat reserves (kJ × 1000)', color='white')
ax4.set_title('Energy Budget During Migration', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Migration summary:")
print(f"  Swimming speed: {swim_speed} m/s, current: {current_speed} m/s")
print(f"  Energy cost: {current_cost:.0f} kJ/km (against current)")
print(f"  Fat reserves: {initial_fat:,} kJ")
print(f"  Maximum migration distance: {max_dist:.0f} km")
print()
print("Dam impacts:")
print("  Complete blockage: population collapses within 10-15 years")
print("  10% fish ladder passage: slows but does not prevent decline")
print("  50% passage: population stabilizes at reduced level")
print("  Solution: dam removal or effective fish passage structures")`,
      challenge: 'The Barak River has two proposed dam sites. Dam A blocks 30% of spawning habitat but has 40% fish passage. Dam B blocks 60% of spawning habitat but has 80% fish passage. Which is worse for the fish population? Simulate both.',
      successHint: 'Fish migration connects distant habitats into one ecosystem. A dam does not just block a river — it disconnects the entire lifecycle of migratory species. Understanding migration biology is essential for making dam construction decisions that do not sacrifice irreplaceable fish populations.',
    },
    {
      title: 'Water quality — measuring the health of a river',
      concept: `Water quality determines which organisms can survive in a river. Scientists measure several key parameters:

- **Dissolved oxygen (DO)**: the amount of oxygen available for fish to breathe. Healthy rivers have >6 mg/L. Below 4 mg/L, sensitive species die. Below 2 mg/L, most fish die.
- **pH**: acidity/alkalinity. Most freshwater fish need pH 6.5-8.5. Outside this range, gills are damaged.
- **Temperature**: affects DO levels, metabolism, and reproduction. Each species has an optimal range.
- **Turbidity**: cloudiness from suspended sediment. High turbidity blocks light (kills algae), clogs gills, and smothers eggs.
- **Nutrients (N and P)**: nitrogen and phosphorus from fertilizers and sewage. Too much causes algal blooms → oxygen depletion → fish kills.
- **BOD (Biochemical Oxygen Demand)**: measures organic pollution. High BOD means bacteria are consuming lots of oxygen to decompose organic waste — leaving less for fish.

**Bioindication** is a powerful complement to chemical testing. Certain organisms only survive in clean water:
- Mayfly larvae: need clean, oxygenated water (DO > 7 mg/L). If present, the river is healthy.
- Rat-tail maggots: thrive in polluted, low-oxygen water. If abundant, the river is degraded.
- Diversity index: more species = healthier ecosystem.

A single water chemistry measurement is a snapshot. Bioindicators integrate conditions over weeks or months — they are the "memory" of the river.`,
      analogy: 'Water quality testing is like a medical check-up for the river. Dissolved oxygen is like blood oxygen level. pH is like blood pH. Turbidity is like a blood cell count (too many particles is bad). BOD is like a fever — it shows the body is fighting something. And the organisms living in the river are like the gut microbiome — their diversity tells you about overall health.',
      storyConnection: 'The story says the fish jump in the Barak River because "the river is alive." Water quality is what makes a river alive. When pollution kills the oxygen, the insects, and the algae, the fish stop jumping — and the river becomes silent. The old fishermen say they can tell the health of the river by listening: jumping fish mean good water. Silence means trouble.',
      checkQuestion: 'A factory upstream releases warm water (30°C) into a river that is normally 22°C. The water looks clean and contains no toxic chemicals. Is this harmful?',
      checkAnswer: 'Yes, thermal pollution is harmful even without chemicals. Warmer water holds less dissolved oxygen (about 20% less at 30°C vs 22°C). Fish metabolism increases in warm water (they need MORE oxygen) but there is LESS available — a double stress. Warm water also promotes bacterial and algal growth, increasing BOD. And it can disrupt spawning triggers for temperature-sensitive species. "Clean" warm water can be as deadly as chemically polluted water.',
      codeIntro: 'Simulate water quality measurements along a river with pollution sources.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Water quality along the Barak River
river_km = np.linspace(0, 200, 200)

# Base conditions (clean river)
base_do = 8.5  # mg/L
base_ph = 7.2
base_temp = 22  # °C
base_turbidity = 5  # NTU

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Pollution sources
# Town at km 50, factory at km 100, agricultural area km 130-170
town_effect = 3.0 * np.exp(-((river_km - 50)**2) / 200)
factory_effect = 4.0 * np.exp(-((river_km - 100)**2) / 100)
agri_effect = 1.5 * (1 / (1 + np.exp(-(river_km - 130) / 5)) - 1 / (1 + np.exp(-(river_km - 170) / 5)))

# Dissolved oxygen (decreases near pollution)
do_values = base_do - town_effect - factory_effect - agri_effect * 0.5
do_values += np.random.normal(0, 0.3, len(river_km))
do_values = np.maximum(do_values, 1)

# Self-purification (DO recovers downstream of pollution)
for i in range(1, len(do_values)):
    if do_values[i] < do_values[i-1] - 0.5:
        pass  # pollution source
    elif do_values[i] < base_do:
        do_values[i] = do_values[i-1] + 0.01  # slow recovery

ax1.set_facecolor('#111827')
ax1.plot(river_km, do_values, color='#3b82f6', linewidth=2)
ax1.fill_between(river_km, do_values, alpha=0.15, color='#3b82f6')
ax1.axhspan(0, 2, color='#ef4444', alpha=0.1, label='Lethal (<2 mg/L)')
ax1.axhspan(2, 4, color='#f59e0b', alpha=0.1, label='Stressed (2-4 mg/L)')
ax1.axhspan(6, 10, color='#22c55e', alpha=0.05, label='Healthy (>6 mg/L)')

# Mark pollution sources
for km, label in [(50, 'Town'), (100, 'Factory'), (150, 'Agriculture')]:
    ax1.annotate(label, xy=(km, do_values[int(km)]), xytext=(km, 9),
                color='#ef4444', fontsize=9, ha='center',
                arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax1.set_xlabel('Distance downstream (km)', color='white')
ax1.set_ylabel('Dissolved oxygen (mg/L)', color='white')
ax1.set_title('Dissolved Oxygen Along the River', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='lower right')
ax1.tick_params(colors='gray')

# pH changes
ax2.set_facecolor('#111827')
ph_values = base_ph - 0.3 * factory_effect + 0.2 * agri_effect + np.random.normal(0, 0.1, len(river_km))
ax2.plot(river_km, ph_values, color='#a855f7', linewidth=2)
ax2.axhspan(6.5, 8.5, color='#22c55e', alpha=0.05, label='Optimal range (6.5-8.5)')
ax2.axhline(6.5, color='#f59e0b', linestyle='--', linewidth=0.5)
ax2.axhline(8.5, color='#f59e0b', linestyle='--', linewidth=0.5)
ax2.set_xlabel('Distance downstream (km)', color='white')
ax2.set_ylabel('pH', color='white')
ax2.set_title('pH Along the River', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# Bioindicator species richness
ax3.set_facecolor('#111827')

# Species that need clean water decline near pollution
sensitive_species = 12 * (do_values / base_do)**2 + np.random.normal(0, 0.5, len(river_km))
sensitive_species = np.maximum(sensitive_species, 0)

# Pollution-tolerant species increase near pollution
tolerant_species = 3 + 8 * (1 - do_values / base_do) + np.random.normal(0, 0.5, len(river_km))
tolerant_species = np.maximum(tolerant_species, 0)

ax3.plot(river_km, sensitive_species, color='#22c55e', linewidth=2, label='Clean-water species')
ax3.plot(river_km, tolerant_species, color='#ef4444', linewidth=2, label='Pollution-tolerant species')
ax3.fill_between(river_km, sensitive_species, tolerant_species,
                 where=sensitive_species > tolerant_species, alpha=0.1, color='#22c55e')
ax3.fill_between(river_km, sensitive_species, tolerant_species,
                 where=sensitive_species < tolerant_species, alpha=0.1, color='#ef4444')
ax3.set_xlabel('Distance downstream (km)', color='white')
ax3.set_ylabel('Species count', color='white')
ax3.set_title('Bioindicators: Species Tell the Story', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Water quality index (composite score)
ax4.set_facecolor('#111827')
# Simple WQI: weighted average of normalized parameters
do_score = np.clip(do_values / 8 * 100, 0, 100)
ph_score = np.clip(100 - np.abs(ph_values - 7.5) * 30, 0, 100)
bio_score = np.clip(sensitive_species / 12 * 100, 0, 100)

wqi = 0.4 * do_score + 0.3 * ph_score + 0.3 * bio_score

# Color by quality
for i in range(len(river_km) - 1):
    color = '#22c55e' if wqi[i] > 70 else ('#f59e0b' if wqi[i] > 40 else '#ef4444')
    ax4.fill_between([river_km[i], river_km[i+1]], [wqi[i], wqi[i+1]], alpha=0.6, color=color)

ax4.plot(river_km, wqi, color='white', linewidth=1)
ax4.set_xlabel('Distance downstream (km)', color='white')
ax4.set_ylabel('Water Quality Index (0-100)', color='white')
ax4.set_title('Composite Water Quality Index', color='white', fontsize=12)
ax4.tick_params(colors='gray')

# Legend
from matplotlib.patches import Patch
legend_elements = [Patch(facecolor='#22c55e', label='Good (>70)'),
                   Patch(facecolor='#f59e0b', label='Fair (40-70)'),
                   Patch(facecolor='#ef4444', label='Poor (<40)')]
ax4.legend(handles=legend_elements, facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Water quality summary for the Barak River:")
print(f"  Overall WQI: {np.mean(wqi):.0f}/100")
print(f"  Worst section: km {river_km[np.argmin(wqi)]:.0f} (WQI = {np.min(wqi):.0f})")
print(f"  Best section: km {river_km[np.argmax(wqi)]:.0f} (WQI = {np.max(wqi):.0f})")
print()
print("Pollution sources identified:")
print("  km 50: Town (sewage → low DO, moderate impact)")
print("  km 100: Factory (industrial waste → low DO, low pH)")
print("  km 130-170: Agriculture (nutrients → eutrophication risk)")
print()
print("Bioindicators confirm: clean-water species vanish near pollution,")
print("pollution-tolerant species thrive. The biology matches the chemistry.")`,
      challenge: 'Design a monitoring programme: where along the river would you place 5 water quality sensors to catch ALL pollution events with the fewest sensors? What parameters would each sensor measure?',
      successHint: 'Water quality is the vital sign of aquatic ecosystems. Every parameter — dissolved oxygen, pH, temperature, turbidity, nutrients — tells part of the story. Together with bioindicators, they give a complete picture of river health. This is the science behind the simple question in our story: "Why do fish jump in the Barak River?" They jump when the water is good. They stop when it is not.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Fish Biology & Aquatic Ecosystems — no prior biology needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for biology and physics simulations. Click to start.</p>
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
