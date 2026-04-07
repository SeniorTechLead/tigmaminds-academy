import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SecretGardenLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Floating islands — how plants build land on water',
      concept: `Loktak Lake in Manipur contains one of the world's most unusual ecosystems: **phumdis** — floating islands made entirely of vegetation. These are not dirt islands that float; they are living mats of tangled roots, dead organic matter, and soil that form over decades.

How phumdis form:
1. Aquatic plants grow from the lake bottom toward the surface
2. Dead organic matter accumulates, forming a spongy mat
3. New plants colonize the mat, adding more root mass
4. The mat thickens until it detaches from the bottom and floats
5. Over years, the mat becomes thick enough (up to 2 meters) to support shrubs and even small trees

The Keibul Lamjao National Park on Loktak Lake is the world's only floating national park. It is home to the critically endangered Sangai deer, which has evolved soft, splayed hooves to walk on the spongy phumdis.

Phumdis demonstrate a key ecological concept: **ecosystem engineering** — organisms that physically modify their environment, creating habitat for other species.`,
      analogy: 'A phumdi is like a living raft that builds itself. Imagine if every piece of driftwood in a river spontaneously grew roots, tangled with its neighbors, and eventually formed a floating island. That is what aquatic plants do at Loktak — they are both the builders and the building material.',
      storyConnection: 'The secret garden of the story grows on water — an impossible garden in an impossible place. Loktak\'s phumdis prove that nature can do exactly this. Plants do not need solid ground; they can manufacture their own foundation from nothing but water, sunlight, and organic matter.',
      checkQuestion: 'Phumdis float during the monsoon (high water) but touch the lake bottom during dry season. How does this seasonal cycle affect the ecosystem?',
      checkAnswer: 'During monsoon (floating), phumdis provide aquatic habitat underneath — fish breed and shelter there. During dry season (grounded), they act as terrestrial habitat. This dual nature makes phumdis incredibly productive: they support both aquatic and terrestrial food chains seasonally. The Sangai deer depends on this cycle for grazing access.',
      codeIntro: 'Model phumdi growth over time as organic matter accumulates.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Phumdi thickness growth model
# Organic accumulation follows a logistic curve
years = np.arange(0, 100)
max_thickness = 200  # cm (2 meters max)
growth_rate = 0.08
midpoint = 40  # years

thickness = max_thickness / (1 + np.exp(-growth_rate * (years - midpoint)))

# Buoyancy threshold (must be this thick to float)
float_threshold = 50  # cm

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
fig.patch.set_facecolor('#1f2937')

# Thickness over time
ax1.set_facecolor('#111827')
ax1.plot(years, thickness, color='#22c55e', linewidth=2)
ax1.axhline(float_threshold, color='#3b82f6', linestyle='--', label=f'Float threshold ({float_threshold}cm)')
ax1.fill_between(years, thickness, float_threshold, where=thickness > float_threshold,
                 alpha=0.15, color='#22c55e', label='Floating phase')
ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Phumdi thickness (cm)', color='white')
ax1.set_title('Phumdi Growth: From Lake Bottom to Floating Island', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Cross-section visualization
ax2.set_facecolor('#4a90d9')  # Water color
depths = np.linspace(0, 1, 100)
x = np.linspace(-2, 2, 100)

# Draw water
ax2.fill_between(x, -0.5, 1.0, color='#1e3a5f', alpha=0.3)

# Draw phumdi cross-section
phumdi_top = 0.6
phumdi_bottom = 0.2
ax2.fill_between(np.linspace(-1.5, 1.5, 50), phumdi_bottom, phumdi_top,
                color='#22c55e', alpha=0.6, label='Living vegetation')
ax2.fill_between(np.linspace(-1.5, 1.5, 50), 0.0, phumdi_bottom,
                color='#854d0e', alpha=0.6, label='Dead organic matter')
ax2.fill_between(np.linspace(-1.5, 1.5, 50), -0.2, 0.0,
                color='#525252', alpha=0.6, label='Decomposing roots')

# Water line
ax2.axhline(0.35, color='#60a5fa', linewidth=2, linestyle='-', alpha=0.5)
ax2.text(1.7, 0.37, 'Water line', color='#60a5fa', fontsize=9)

# Plants growing on top
for xp in [-1.0, -0.3, 0.2, 0.8, 1.2]:
    ax2.plot([xp, xp], [phumdi_top, phumdi_top + 0.2], color='#22c55e', linewidth=2)
    ax2.plot([xp-0.05, xp+0.05], [phumdi_top+0.2, phumdi_top+0.15], color='#22c55e', linewidth=1)

ax2.set_title('Phumdi Cross-Section', color='white', fontsize=12)
ax2.set_ylabel('Depth', color='white')
ax2.set_xlim(-2, 2)
ax2.set_ylim(-0.5, 1.0)
ax2.legend(facecolor='#1f2937', labelcolor='white', fontsize=8, loc='lower right')
ax2.tick_params(colors='gray')
ax2.set_xticks([])

plt.tight_layout()
plt.show()

print("Phumdi composition (typical):")
print("  Top layer: living plants, grasses, sedges")
print("  Middle: partially decomposed organic matter")
print("  Bottom: fully decomposed roots, humus")
print(f"  Floats when thickness > {float_threshold}cm")
print(f"  Maximum thickness: ~{max_thickness}cm (2 meters)")`,
      challenge: 'What happens if the growth rate increases (faster organic accumulation) but max thickness stays the same? Change growth_rate to 0.15. How much sooner does the phumdi start floating?',
      successHint: 'Phumdis are a natural example of self-organizing systems — complex structures emerging from simple rules. No blueprint, no architect — just plants growing, dying, and accumulating.',
    },
    {
      title: 'Aquatic plant adaptations — breathing underwater',
      concept: `Land plants breathe through tiny pores called **stomata** on their leaves. But what about aquatic plants? They face a unique challenge: getting CO₂ and O₂ when submerged.

Aquatic plant adaptations:
- **Aerenchyma**: spongy tissue with large air spaces that transport gases from leaves to submerged roots (like an internal snorkel system)
- **Thin leaves**: thinner leaves mean shorter diffusion distances for dissolved gases
- **Reduced cuticle**: the waxy coating on land plants prevents water loss — aquatic plants don't need it, so they reduce it to allow gas exchange
- **Flexible stems**: strong rigid stems would snap in currents; aquatic plants have bendy stems that go with the flow
- **Adventitious roots**: roots that grow from stems at water contact points, increasing nutrient absorption

The lotus (Nelumbo nucifera) has aerenchyma channels running from leaf to root through stems over 1 meter long. If you cut a lotus stem, you can see the hollow channels — and actually blow air through them like a straw.`,
      analogy: 'Aerenchyma is like a ventilation system in a submarine. The submarine (submerged plant) needs air from the surface. Internal ducts (aerenchyma) carry air from hatches (leaves above water) to all compartments (submerged roots). Without this system, the submarine — or the plant — suffocates.',
      storyConnection: 'The secret garden floated on Loktak Lake, meaning every plant in it had to solve the problem of living on water. The grasses, sedges, and reeds that form phumdis all have aerenchyma — internal air highways — that keep them alive while their roots dangle in water.',
      checkQuestion: 'Some aquatic plants have leaves both above and below the water surface. The submerged leaves are thin and finely divided, while the aerial leaves are broad and waxy. Why?',
      checkAnswer: 'Submerged leaves are thin and divided to maximize surface area for absorbing dissolved CO₂ (which diffuses 10,000× slower in water than in air). Aerial leaves are broad to catch sunlight and waxy to prevent water loss. This is called heterophylly — different leaf forms on the same plant — and it is direct evidence of environmental adaptation.',
      codeIntro: 'Compare gas diffusion rates in air vs. water to understand why aquatic plants need special adaptations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Gas diffusion rates: air vs water
# Diffusion coefficient of CO2: air ~1.6e-5 m²/s, water ~1.6e-9 m²/s
# That's 10,000x slower in water!

D_air = 1.6e-5  # m²/s
D_water = 1.6e-9  # m²/s

# Fick's law: flux = D * (C_outside - C_inside) / distance
# Time to diffuse across distance L: t ≈ L² / (2D)

distances = np.logspace(-5, -2, 100)  # 10μm to 1cm

time_air = distances**2 / (2 * D_air)
time_water = distances**2 / (2 * D_water)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Diffusion time comparison
ax1.set_facecolor('#111827')
ax1.loglog(distances * 1000, time_air, color='#f59e0b', linewidth=2, label='CO₂ in air')
ax1.loglog(distances * 1000, time_water, color='#3b82f6', linewidth=2, label='CO₂ in water')
ax1.set_xlabel('Diffusion distance (mm)', color='white')
ax1.set_ylabel('Time to diffuse (seconds)', color='white')
ax1.set_title('Gas Diffusion: Air vs Water', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Annotate key points
ax1.axvline(0.1, color='gray', linestyle=':', alpha=0.3)
ax1.text(0.12, 1e-4, 'Typical leaf\\\nthickness', color='gray', fontsize=8)

# Leaf adaptation comparison
ax2.set_facecolor('#111827')
adaptations = ['Leaf\\\nthickness', 'Cuticle\\\nthickness', 'Stomata\\\ndensity', 'Aerenchyma\\\nvolume', 'Stem\\\nrigidity']
land_values = [8, 9, 7, 2, 9]
water_values = [3, 2, 1, 9, 3]

x = np.arange(len(adaptations))
width = 0.35
ax2.bar(x - width/2, land_values, width, label='Land plant', color='#f59e0b', alpha=0.8)
ax2.bar(x + width/2, water_values, width, label='Aquatic plant', color='#3b82f6', alpha=0.8)
ax2.set_xticks(x)
ax2.set_xticklabels(adaptations, color='white', fontsize=9)
ax2.set_ylabel('Relative value (0-10)', color='white')
ax2.set_title('Land vs Aquatic Plant Traits', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key numbers:")
print(f"  CO₂ diffusion in air:   {D_air:.1e} m²/s")
print(f"  CO₂ diffusion in water: {D_water:.1e} m²/s")
print(f"  Ratio: {D_air/D_water:.0f}x slower in water!")
print()
print("This 10,000x difference explains why aquatic plants need:")
print("  - Thinner leaves (shorter diffusion distance)")
print("  - No waxy cuticle (removes a barrier)")
print("  - Aerenchyma (internal air channels bypass water)")`,
      challenge: 'Calculate how long it takes CO₂ to diffuse through a 0.5mm thick leaf in air vs water. The answer explains why aquatic leaves must be so thin.',
      successHint: 'The physics of gas diffusion drives the entire design of aquatic plants. Every adaptation — thin leaves, no cuticle, aerenchyma — is a solution to the same problem: gas moves 10,000× slower in water.',
    },
    {
      title: 'Wetland ecosystems — nature\'s water filters',
      concept: `Wetlands like Loktak Lake are among the most productive ecosystems on Earth — more productive per square meter than tropical rainforests. They also provide critical **ecosystem services**:

1. **Water filtration**: wetland plants absorb nitrogen, phosphorus, and heavy metals from water. A single hectare of wetland can filter millions of liters of water per year.
2. **Flood control**: wetlands act as sponges, absorbing excess water during monsoons and releasing it slowly during dry seasons.
3. **Carbon storage**: waterlogged soils prevent decomposition, trapping carbon in peat. Wetlands store ~30% of global soil carbon despite covering only 5-8% of land.
4. **Biodiversity**: wetlands support disproportionately high species diversity — especially fish, amphibians, and waterbirds.

Loktak Lake specifically supports:
- 233 species of aquatic plants
- 100+ species of birds
- 425 species of animals
- The endemic Sangai deer
- Livelihood for ~100,000 fishing families`,
      analogy: 'A wetland is like a city\'s water treatment plant, flood barrier, carbon vault, and wildlife sanctuary — all rolled into one, running for free, powered by sunlight. If we had to build machines to do what Loktak Lake does naturally, it would cost billions of dollars annually.',
      storyConnection: 'The secret garden on the floating island was surrounded by water that sustained everything around it. In reality, Loktak Lake sustains an entire regional ecosystem — the phumdis are just the visible part of an invisible web of nutrient cycling, water filtration, and habitat creation.',
      checkQuestion: 'Wetlands store 30% of global soil carbon in only 5-8% of land area. What would happen if these wetlands dried out?',
      checkAnswer: 'The carbon stored in waterlogged peat would be exposed to oxygen, and microbes would decompose it, releasing massive amounts of CO₂ and methane. This is already happening: drained peatlands account for about 5% of global greenhouse gas emissions. Protecting wetlands is one of the most cost-effective climate strategies available.',
      codeIntro: 'Model how a wetland filters pollutants from water as it flows through.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Wetland water filtration model
# Pollutant concentration decreases exponentially with distance through wetland
# C(x) = C0 * exp(-k * x) where k depends on plant density

distance = np.linspace(0, 100, 200)  # meters through wetland

# Different pollutants, different removal rates
pollutants = {
    'Nitrogen': {'k': 0.03, 'color': '#ef4444', 'initial': 50},  # mg/L
    'Phosphorus': {'k': 0.05, 'color': '#f59e0b', 'initial': 10},
    'Sediment': {'k': 0.08, 'color': '#854d0e', 'initial': 200},
    'Heavy metals': {'k': 0.02, 'color': '#a855f7', 'initial': 5},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Concentration vs distance
ax1.set_facecolor('#111827')
for name, props in pollutants.items():
    conc = props['initial'] * np.exp(-props['k'] * distance)
    pct_remaining = conc / props['initial'] * 100
    ax1.plot(distance, pct_remaining, color=props['color'], linewidth=2, label=name)

ax1.set_xlabel('Distance through wetland (m)', color='white')
ax1.set_ylabel('Pollutant remaining (%)', color='white')
ax1.set_title('Wetland Water Filtration', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.axhline(10, color='gray', linestyle=':', alpha=0.3)
ax1.text(2, 12, '90% removal', color='gray', fontsize=8)

# Ecosystem services valuation
ax2.set_facecolor('#111827')
services = ['Water\\\nfiltration', 'Flood\\\ncontrol', 'Carbon\\\nstorage', 'Fisheries', 'Biodiversity', 'Recreation']
values = [4500, 3200, 2800, 1500, 1200, 800]  # $/hectare/year (estimates)

bars = ax2.barh(services, values, color=['#3b82f6', '#22c55e', '#854d0e', '#f59e0b', '#a855f7', '#ef4444'])
ax2.set_xlabel('Value ($/hectare/year)', color='white')
ax2.set_title('Wetland Ecosystem Service Values', color='white', fontsize=12)
ax2.tick_params(colors='gray')
for bar, val in zip(bars, values):
    ax2.text(bar.get_width() + 50, bar.get_y() + bar.get_height()/2,
            f'{val:,}', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

total = sum(values)
print(f"Total estimated value: {total:,}/hectare/year")
print(f"Loktak Lake area: ~287 km² = 28,700 hectares")
print(f"Estimated annual ecosystem services: {total * 28700:,.0f}")
print()
print("This is why destroying wetlands is economically irrational —")
print("the 'free' services they provide far exceed development value.")`,
      challenge: 'A factory upstream releases 100 mg/L of nitrogen. If the wetland is 50m wide, what concentration reaches the other side? What if we double the wetland width to 100m?',
      successHint: 'Constructed wetlands are now used worldwide as low-cost water treatment systems. The same natural process that keeps Loktak Lake healthy can be engineered to clean agricultural runoff, sewage, and industrial waste.',
    },
    {
      title: 'Buoyancy — the physics of floating',
      concept: `Why do phumdis float? The same reason ships and ducks float: **Archimedes' principle**. An object floats when it displaces water equal to its own weight.

**Archimedes' principle**: The buoyant force on a submerged object equals the weight of the fluid it displaces.

F_buoyant = ρ_water × V_displaced × g

For an object to float:
- Its average density must be less than water's density (1000 kg/m³)
- Phumdis float because aerenchyma (air spaces) reduce their average density to ~600-800 kg/m³
- A solid block of wood (density ~500 kg/m³) floats with half its volume above water
- Steel (density ~7800 kg/m³) sinks — but a steel ship floats because its hull contains air, reducing average density

The fraction submerged = object density / fluid density
- Phumdi (700 kg/m³): 70% submerged, 30% above water
- Ice (917 kg/m³): 91.7% submerged — that's why icebergs are mostly underwater`,
      analogy: 'Buoyancy is like a weighing contest between an object and the water it pushes aside. If the object is lighter than the water it displaces, it wins — and floats. A phumdi wins because it is full of air pockets (aerenchyma). A rock loses because it is solid and dense.',
      storyConnection: 'The secret garden floated because the phumdi beneath it was full of air — trapped in dead organic matter and aerenchyma. Remove the air, and the garden sinks. The floating garden is not magic; it is Archimedes\' principle, discovered 2,200 years ago, applied by nature.',
      checkQuestion: 'A phumdi has an average density of 700 kg/m³ and is 1.5 meters thick. How much sticks above the water surface?',
      checkAnswer: 'Fraction submerged = 700/1000 = 0.7 (70%). So 30% is above water: 1.5m × 0.3 = 0.45m (45 cm). That is enough to support grasses, small shrubs, and even a walking Sangai deer. The deer itself adds weight, pushing the phumdi slightly deeper — which is why the deer evolved soft, spread-out hooves to distribute its weight.',
      codeIntro: 'Simulate objects with different densities to see which float and how much is submerged.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Buoyancy simulation
objects = {
    'Phumdi': {'density': 700, 'color': '#22c55e'},
    'Wood (oak)': {'density': 600, 'color': '#854d0e'},
    'Ice': {'density': 917, 'color': '#93c5fd'},
    'Cork': {'density': 120, 'color': '#f59e0b'},
    'Steel': {'density': 7800, 'color': '#6b7280'},
    'Human body': {'density': 1010, 'color': '#ef4444'},
}
water_density = 1000  # kg/m³

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')

# Bar chart: fraction submerged
ax1.set_facecolor('#111827')
names = list(objects.keys())
densities = [objects[n]['density'] for n in names]
colors = [objects[n]['color'] for n in names]
fractions = [min(d/water_density, 1.0) for d in densities]

bars = ax1.barh(names, fractions, color=colors, alpha=0.8)
ax1.axvline(1.0, color='#ef4444', linestyle='--', linewidth=1, label='Sinks (100%)')
ax1.set_xlabel('Fraction submerged', color='white')
ax1.set_title('How Deep Does It Sit?', color='white', fontsize=12)
ax1.tick_params(colors='gray')
for bar, frac, d in zip(bars, fractions, densities):
    label = f'{frac*100:.0f}% ({d} kg/m³)' if frac < 1 else f'SINKS ({d} kg/m³)'
    ax1.text(min(frac, 0.95) + 0.02, bar.get_y() + bar.get_height()/2,
            label, va='center', color='white', fontsize=8)

# Visual: objects in water
ax2.set_facecolor('#1e3a5f')  # Water
ax2.fill_between([-1, 8], -2, 0, color='#1e3a5f', alpha=0.3)
ax2.axhline(0, color='#60a5fa', linewidth=2)
ax2.text(7.5, 0.1, 'Water line', color='#60a5fa', fontsize=8)

floating = [(n, o) for n, o in objects.items() if o['density'] < water_density]
for i, (name, obj) in enumerate(floating):
    x = i * 2
    frac = obj['density'] / water_density
    height = 1.0  # total height
    submerged = height * frac
    above = height - submerged

    ax2.add_patch(plt.Rectangle((x - 0.4, -submerged), 0.8, height,
                  facecolor=obj['color'], alpha=0.7, edgecolor='white', linewidth=1))
    ax2.text(x, above + 0.15, name, ha='center', color='white', fontsize=8, fontweight='bold')

ax2.set_title('Floating Objects (to scale)', color='white', fontsize=12)
ax2.set_xlim(-1, 8)
ax2.set_ylim(-2, 2)
ax2.set_ylabel('Height relative to water line', color='white')
ax2.tick_params(colors='gray')
ax2.set_xticks([])

plt.tight_layout()
plt.show()

print("Archimedes' Principle: F_buoyant = ρ_water × V_displaced × g")
print()
for name, obj in objects.items():
    if obj['density'] < water_density:
        pct = (1 - obj['density']/water_density) * 100
        print(f"  {name}: {pct:.1f}% above water")
    else:
        print(f"  {name}: SINKS (density {obj['density']} > water {water_density})")`,
      challenge: 'A Sangai deer (mass 25 kg) stands on a 2m × 2m × 1.5m phumdi (density 700 kg/m³). How much deeper does the phumdi sink? Hint: the deer\'s weight must be balanced by additional displaced water.',
      successHint: 'Archimedes\' principle is 2,200 years old and still the foundation of naval architecture, submarine design, and understanding natural floating systems like phumdis.',
    },
    {
      title: 'Nutrient cycling — how floating gardens feed themselves',
      concept: `A floating island has no connection to the ground. So where does it get nutrients? The answer is **nutrient cycling** — the circular flow of essential elements through ecosystems.

Key nutrients for plants:
- **Nitrogen (N)**: needed for proteins and DNA. Fixed from atmosphere by bacteria, deposited by rain, or released from decomposing organic matter
- **Phosphorus (P)**: needed for DNA and energy transfer. Comes from sediment, decomposition, or bird droppings
- **Potassium (K)**: needed for water regulation. Dissolved in lake water

In a phumdi, the cycle is remarkably self-contained:
1. Plants grow using nutrients from the organic mat
2. Leaves and stems die and fall onto the mat
3. Decomposers (bacteria, fungi) break down dead matter
4. Released nutrients are reabsorbed by living roots
5. Some nutrients are lost to the water below (leaching)
6. These are replaced by nutrients from rainfall, dust, and bird droppings

This is a **nearly closed nutrient loop** — the floating garden recycles most of its own nutrients, with small inputs from rain and atmospheric deposition.`,
      analogy: 'Nutrient cycling in a phumdi is like a household that composts all its kitchen waste and grows a garden from the compost. Very little comes in from outside (occasional fertilizer = rain), very little goes out (occasional trash = leaching). The system is nearly self-sustaining.',
      storyConnection: 'The secret garden was self-sustaining — it did not need anyone to fertilize it or bring soil. Real floating islands work the same way. The dead layers feed the living layers. The garden literally grows on the corpses of its ancestors — a beautiful, if morbid, form of self-sufficiency.',
      checkQuestion: 'If a phumdi loses 5% of its nitrogen to leaching each year but gains 3% from rain and 2% from bird droppings, is it sustainable?',
      checkAnswer: 'Yes — barely. Loss = 5%, gain = 3% + 2% = 5%. The budget balances exactly. But if bird populations decline (due to habitat loss), the input drops below 5% and the phumdi slowly loses nitrogen, becoming less productive. This is why conserving waterbirds is essential for phumdi health — they are not just residents but nutrient couriers.',
      codeIntro: 'Model nitrogen cycling in a floating island over decades.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Nitrogen budget model for a phumdi (kg N per hectare)
years = np.arange(0, 50)
initial_N = 500  # kg N/ha

# Annual fluxes (kg N/ha/year)
rain_input = 15
bird_input = 10
fixation = 8  # nitrogen-fixing bacteria
decomposition_recycle = 150  # internal recycling

leaching_rate = 0.05  # 5% of total lost to water
plant_uptake_rate = 0.35  # 35% of available used by plants

N_pool = np.zeros(len(years))
N_pool[0] = initial_N
plant_biomass = np.zeros(len(years))

for i in range(1, len(years)):
    inputs = rain_input + bird_input + fixation
    losses = N_pool[i-1] * leaching_rate
    N_pool[i] = N_pool[i-1] + inputs - losses
    plant_biomass[i] = N_pool[i] * plant_uptake_rate

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Nitrogen pool over time
ax1.set_facecolor('#111827')
ax1.plot(years, N_pool, color='#22c55e', linewidth=2, label='Total N in phumdi')
ax1.plot(years, plant_biomass, color='#3b82f6', linewidth=2, label='N in plant biomass')
ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Nitrogen (kg/ha)', color='white')
ax1.set_title('Nitrogen Dynamics in a Floating Island', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')

# Nutrient flow diagram
ax2.set_facecolor('#111827')
# Simplified Sankey-style
flows = {
    'Rain': (15, 0.8, '#3b82f6'),
    'Birds': (10, 0.65, '#f59e0b'),
    'N-fixation': (8, 0.5, '#a855f7'),
    'Internal recycle': (150, 0.35, '#22c55e'),
    'Leaching (loss)': (25, 0.2, '#ef4444'),
}

labels = list(flows.keys())
values = [f[0] for f in flows.values()]
colors_flow = [f[2] for f in flows.values()]

bars = ax2.barh(labels, values, color=colors_flow, alpha=0.8)
ax2.set_xlabel('kg N / hectare / year', color='white')
ax2.set_title('Annual Nitrogen Flows', color='white', fontsize=12)
ax2.tick_params(colors='gray')

for bar, val in zip(bars, values):
    ax2.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
            f'{val} kg', va='center', color='white', fontsize=10)

plt.tight_layout()
plt.show()

equilibrium_N = (rain_input + bird_input + fixation) / leaching_rate
print(f"Long-term equilibrium N pool: {equilibrium_N:.0f} kg/ha")
print(f"Current pool: {N_pool[-1]:.0f} kg/ha")
print()
print("Internal recycling ({} kg) >> external inputs ({} kg)".format(
    decomposition_recycle, rain_input + bird_input + fixation))
print("The phumdi is >80% self-sustaining!")`,
      challenge: 'What happens if bird input drops to zero (birds driven away by development)? Rerun the model and see how quickly the nitrogen pool declines. At what point does the phumdi become unproductive?',
      successHint: 'Nutrient cycling is the hidden engine of every ecosystem. Understanding it helps us manage farms, restore degraded lands, and predict how ecosystems respond to disturbance.',
    },
    {
      title: 'Threats and conservation — saving Loktak\'s floating world',
      concept: `Loktak Lake faces multiple threats that endanger its unique floating ecosystem:

1. **Ithai Barrage** (built 1983): A dam that stabilized water levels for hydropower. Phumdis need seasonal water level changes — high water to float, low water to ground and regenerate. Constant high water causes phumdis to thicken unevenly and become waterlogged.

2. **Nutrient pollution**: Agricultural runoff adds excess nitrogen and phosphorus, causing algal blooms that block sunlight and deplete oxygen (eutrophication).

3. **Phumdi removal**: Some phumdis are removed for fish farming, reducing habitat.

4. **Invasive species**: Water hyacinth (Eichhornia crassipes) outcompetes native floating plants.

Conservation approaches:
- **Remote sensing**: Satellite imagery tracks phumdi extent over time
- **Water level management**: Mimicking natural seasonal fluctuations
- **Nutrient reduction**: Treating agricultural runoff before it enters the lake
- **Community involvement**: Local fishing communities as conservation partners

The lake's area has shrunk from 500 km² in the 1970s to ~287 km² today — a 43% loss in 50 years.`,
      analogy: 'Loktak Lake is like a patient on life support. The Ithai Barrage changed its heartbeat (seasonal water cycle). Pollution is clogging its arteries (nutrient overload). Invasive species are an infection (water hyacinth). Conservation is the treatment plan — but the patient needs all treatments simultaneously, not just one.',
      storyConnection: 'The secret garden in the story was hidden and protected by its isolation. Real-life Loktak has no such protection — it is accessible, exploited, and degrading. The story reminds us that some ecosystems are so special they deserve the fierce protection that stories give to magical places.',
      checkQuestion: 'The Ithai Barrage keeps water levels constantly high. Why would LOWER water levels sometimes be BETTER for the ecosystem?',
      checkAnswer: 'During natural low-water periods, phumdis touch the lake bottom, allowing roots to access sediment nutrients, decomposing waterlogged layers to dry and compact, and enabling land animals to access the phumdis. Without this grounding cycle, phumdis become waterlogged, structurally weak, and nutrient-depleted. The dam\'s "help" (stable water) is actually harm — the ecosystem evolved for fluctuation.',
      codeIntro: 'Analyze Loktak Lake area change over time and model eutrophication.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Loktak Lake area over time (estimated from satellite data)
years = np.array([1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020])
area_km2 = np.array([500, 480, 450, 400, 370, 350, 330, 310, 300, 290, 287])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Lake area decline
ax1.set_facecolor('#111827')
ax1.plot(years, area_km2, 'o-', color='#3b82f6', linewidth=2, markersize=6)
ax1.fill_between(years, area_km2, alpha=0.1, color='#3b82f6')
ax1.axvline(1983, color='#ef4444', linestyle='--', linewidth=1)
ax1.text(1984, 490, 'Ithai Barrage\\\nbuilt (1983)', color='#ef4444', fontsize=9)
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Lake area (km²)', color='white')
ax1.set_title('Loktak Lake: Shrinking Over Time', color='white', fontsize=12)
ax1.tick_params(colors='gray')

pct_loss = (1 - area_km2[-1]/area_km2[0]) * 100
ax1.text(2000, 460, f'{pct_loss:.0f}% area lost\\\nsince 1970', color='#ef4444', fontsize=10)

# Eutrophication model
# Nutrient input vs algal bloom threshold
ax2.set_facecolor('#111827')
nutrient_input = np.linspace(0, 100, 200)  # arbitrary units

# Algae growth: logistic response to nutrients
algae_max = 100
k_half = 30  # nutrient level for half-max algae
algae = algae_max * nutrient_input**2 / (k_half**2 + nutrient_input**2)

# Oxygen level: inversely related to algae
oxygen_max = 10  # mg/L (healthy)
oxygen = oxygen_max * (1 - 0.8 * algae / algae_max)

ax2.plot(nutrient_input, algae, color='#22c55e', linewidth=2, label='Algae density')
ax2_twin = ax2.twinx()
ax2_twin.plot(nutrient_input, oxygen, color='#3b82f6', linewidth=2, label='Dissolved O₂')
ax2_twin.axhline(4, color='#ef4444', linestyle='--', alpha=0.5)
ax2_twin.text(5, 4.3, 'Fish die below this', color='#ef4444', fontsize=8)

ax2.set_xlabel('Nutrient input (relative)', color='white')
ax2.set_ylabel('Algae density', color='#22c55e')
ax2_twin.set_ylabel('Dissolved O₂ (mg/L)', color='#3b82f6')
ax2.set_title('Eutrophication: Nutrients → Algae → O₂ Loss', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2_twin.tick_params(colors='gray')

lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Loktak Lake threats summary:")
print(f"  Area loss: {area_km2[0]} → {area_km2[-1]} km² ({pct_loss:.0f}% decline)")
print(f"  Rate: ~{(area_km2[0]-area_km2[-1])/(years[-1]-years[0]):.1f} km²/year")
print(f"  At this rate, critical area reached by: ~{2020 + int((area_km2[-1]-200)/4.3)}")
print()
print("Conservation is not optional — it is urgent.")`,
      challenge: 'If conservation efforts reduce the decline rate by 50%, how many more years does the lake have before reaching 200 km²? Plot both scenarios (business-as-usual vs conservation) on the same graph.',
      successHint: 'From floating islands to buoyancy to nutrient cycling to conservation — you have seen how a single ecosystem connects physics, chemistry, biology, and policy. Level 2 goes deeper into remote sensing and ecosystem modeling.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for aquatic ecology simulations. Click to start.</p>
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
