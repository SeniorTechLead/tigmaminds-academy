import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PotterLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is clay? — the science of mud',
      concept: `The little potter of Dhubri begins each day at the riverbank, digging clay from where the Brahmaputra's flood waters have deposited it. Clay isn't just "dirt" — it's a specific type of mineral with remarkable properties.

**Clay minerals** are phyllosilicates — sheet-like structures made of silicon, oxygen, aluminium, and water. The key species:
- **Kaolinite** (Al₂Si₂O₅(OH)₄): the most common pottery clay. White when pure, often stained by iron oxides. Forms from weathered feldspar.
- **Montmorillonite**: swells dramatically when wet (can absorb 700% its weight in water). Used in drilling mud, cat litter.
- **Illite**: intermediate properties. Common in river sediments like the Brahmaputra's.

What makes clay special:
- **Plate-like particles**: flat, tiny (< 2 micrometres), with enormous surface area
- **Plasticity**: when wet, clay sheets slide past each other, making the material shapeable. When dry, they lock together.
- **Surface charge**: clay particles have a slight negative charge, attracting water molecules between the sheets (this is why clay is sticky when wet)

The Brahmaputra clay that the potter uses is alluvial clay — carried from the Himalayas and deposited during floods. It's a mix of kaolinite, illite, and organic material, naturally suited for pottery.`,
      analogy: 'Clay particles are like a deck of wet playing cards. Each card (clay platelet) is thin and flat. When wet, the cards slide easily over each other — you can shape the deck however you want. When dry, the cards stick together through friction and surface tension. Fire the deck in a kiln, and the cards fuse permanently — you can never reshuffle them.',
      storyConnection: 'The little potter knew good clay by feel: it should be smooth (fine particles), sticky (high surface charge), and plastic (right water content). "The river gives us the best clay," he told his daughter. "It has traveled thousands of kilometres from the mountains, getting finer and smoother with every bend." He was describing sediment sorting — a geological process he understood through his hands.',
      checkQuestion: 'Why does clay crack when it dries too quickly in the sun, but not when it dries slowly in the shade?',
      checkAnswer: 'When clay dries, water evaporates from between the platelet layers, causing the material to shrink (5-15% volume reduction). If the outside dries faster than the inside (strong sun), the outside shrinks and becomes rigid while the inside is still wet and expanded. This creates tensile stress in the outer layer, which cracks when the stress exceeds the material\'s strength. Slow, even drying lets the whole piece shrink uniformly, avoiding stress concentrations.',
      codeIntro: 'Visualize clay particle structure and the relationship between water content and plasticity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Clay plasticity vs water content
water_content = np.linspace(0, 60, 200)  # percent by weight

# Atterberg limits define clay behavior
shrinkage_limit = 12   # below: no volume change
plastic_limit = 22     # below: brittle
liquid_limit = 45      # above: flows like liquid

# Plasticity index = liquid limit - plastic limit
plasticity_index = liquid_limit - plastic_limit

# Strength model (arbitrary units)
strength = np.zeros_like(water_content)
strength[water_content < shrinkage_limit] = 100
strength[(water_content >= shrinkage_limit) & (water_content < plastic_limit)] = (
    100 - 80 * (water_content[(water_content >= shrinkage_limit) & (water_content < plastic_limit)] - shrinkage_limit) / (plastic_limit - shrinkage_limit))
strength[(water_content >= plastic_limit) & (water_content < liquid_limit)] = (
    20 - 15 * (water_content[(water_content >= plastic_limit) & (water_content < liquid_limit)] - plastic_limit) / (liquid_limit - plastic_limit))
strength[water_content >= liquid_limit] = 5

# Workability (plasticity)
workability = np.zeros_like(water_content)
workability[(water_content >= plastic_limit) & (water_content < liquid_limit)] = (
    np.sin(np.pi * (water_content[(water_content >= plastic_limit) & (water_content < liquid_limit)] - plastic_limit) / (liquid_limit - plastic_limit)) * 100)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# Strength and workability
ax1.set_facecolor('#111827')
ax1.plot(water_content, strength, color='#ef4444', linewidth=2, label='Strength')
ax1.plot(water_content, workability, color='#22c55e', linewidth=2, label='Workability')

# Mark Atterberg limits
for limit, name, color in [(shrinkage_limit, 'Shrinkage\
limit', '#f59e0b'),
                             (plastic_limit, 'Plastic\
limit', '#3b82f6'),
                             (liquid_limit, 'Liquid\
limit', '#a855f7')]:
    ax1.axvline(limit, color=color, linestyle='--', linewidth=1)
    ax1.text(limit, 105, name, ha='center', color=color, fontsize=8)

# Mark behavior zones
ax1.axvspan(0, shrinkage_limit, alpha=0.1, color='#ef4444')
ax1.text(6, 50, 'Solid\
(brittle)', ha='center', color='#ef4444', fontsize=9)
ax1.axvspan(shrinkage_limit, plastic_limit, alpha=0.1, color='#f59e0b')
ax1.text(17, 50, 'Semi-solid', ha='center', color='#f59e0b', fontsize=9)
ax1.axvspan(plastic_limit, liquid_limit, alpha=0.1, color='#22c55e')
ax1.text(33, 50, 'PLASTIC\
(workable!)', ha='center', color='#22c55e', fontsize=10, fontweight='bold')
ax1.axvspan(liquid_limit, 60, alpha=0.1, color='#3b82f6')
ax1.text(52, 50, 'Liquid\
(slurry)', ha='center', color='#3b82f6', fontsize=9)

ax1.set_ylabel('Relative value (%)', color='white')
ax1.set_title('Clay Behavior vs Water Content', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Particle size distribution
ax2.set_facecolor('#111827')
sizes = np.logspace(-1, 3, 200)  # micrometres

# Different soil types
clay_dist = 100 / (1 + (sizes / 1) ** 3)
silt_dist = 100 / (1 + (sizes / 20) ** 3)
sand_dist = 100 / (1 + (sizes / 500) ** 3)

ax2.plot(sizes, clay_dist, color='#ef4444', linewidth=2, label="Potter's clay")
ax2.plot(sizes, silt_dist, color='#f59e0b', linewidth=2, label='Silt')
ax2.plot(sizes, sand_dist, color='#22c55e', linewidth=2, label='Sand')

ax2.axvline(2, color='white', linestyle=':', linewidth=1)
ax2.text(2, 105, '2μm (clay/silt boundary)', color='white', fontsize=8, ha='center')
ax2.axvline(50, color='white', linestyle=':', linewidth=1)
ax2.text(50, 105, '50μm (silt/sand boundary)', color='white', fontsize=8, ha='center')

ax2.set_xscale('log')
ax2.set_xlabel('Particle size (μm)', color='white')
ax2.set_ylabel('% finer than', color='white')
ax2.set_title('Particle Size Distribution', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Atterberg limits for typical pottery clay:")
print(f"  Shrinkage limit: {shrinkage_limit}% (below = no shrinkage)")
print(f"  Plastic limit: {plastic_limit}% (below = too dry to shape)")
print(f"  Liquid limit: {liquid_limit}% (above = too wet, flows)")
print(f"  Plasticity index: {plasticity_index}% (working range)")
print()
print("The potter works between {plastic_limit}% and {liquid_limit}% water content.")
print("Too dry → cracks. Too wet → collapses. Just right → holds any shape.")`,
      challenge: 'Different clays have different Atterberg limits. Kaolin: PL=30, LL=55. Montmorillonite: PL=50, LL=500. Which is easier to work with? Calculate the plasticity index for each and explain what a PI of 450 means practically.',
      successHint: 'The science of clay behavior governs not just pottery but civil engineering (foundations on clay soil), environmental science (clay barriers in landfills), and geology (clay minerals record ancient climates). The little potter is an intuitive materials scientist.',
    },
    {
      title: 'Crystal structure of ceramics — order from chaos',
      concept: `When the potter fires clay in a kiln, something extraordinary happens at the atomic level: disordered clay minerals transform into ordered crystalline ceramics. This transformation is the difference between a mud pot and a ceramic vessel.

**Crystal structure** means atoms arranged in a repeating 3D pattern. In ceramics:
- **Kaolinite** (raw clay): sheets of silicon-oxygen tetrahedra bonded to aluminium-oxygen octahedra. Layers held together by weak hydrogen bonds (which is why clay is soft when wet — water breaks these bonds).
- **Metakaolin** (after firing at 500-700°C): the hydroxyl groups (OH) are driven off, disrupting the crystal structure. The clay becomes permanently dehydrated.
- **Mullite** (after firing at 1000-1200°C): silicon and aluminium rearrange into a new crystal structure — mullite (3Al₂O₃·2SiO₂). This is one of the hardest common ceramics, giving pottery its strength and durability.

The transformation: soft, water-sensitive clay → hard, water-resistant ceramic. The process is irreversible — you can never turn a fired pot back into workable clay. The hydrogen bonds are replaced by strong covalent and ionic bonds that lock the structure permanently.`,
      analogy: 'Unfired clay is like a stack of sticky notes — they hold together loosely and can be rearranged. Firing is like laminating them: heat fuses the pages into a single solid sheet. You can\'t un-laminate a laminated document, and you can\'t un-fire a ceramic pot. The transformation is one-way.',
      storyConnection: 'The little potter\'s father once accidentally dropped an unfired pot into the river. It dissolved back into mud within hours. "But a fired pot," he told his son, "can sit in that same river for a thousand years and emerge intact. Fire changes clay forever." He was describing the irreversible phase transformation from phyllosilicate to mullite — 1,000°C of chemistry in one sentence.',
      checkQuestion: 'Ancient pottery survives for thousands of years, but ancient wooden objects rarely do. Both are organic/mineral materials. Why the difference?',
      checkAnswer: 'Fired ceramics are thermodynamically stable — they\'ve already been "burned" (oxidized, dehydrated). There\'s no further chemical energy for organisms to extract. Wood is thermodynamically unstable — it contains cellulose, which bacteria and fungi can metabolize for energy. Ceramics resist biodegradation because they\'ve already undergone the most extreme chemical transformation possible. They\'re the "ash" of clay, and you can\'t burn ash.',
      codeIntro: 'Visualize the phase transformations that clay undergoes during firing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Phase transformation during kiln firing
temperature = np.linspace(20, 1300, 300)

# Phase fractions (simplified)
# Kaolinite → Metakaolin (500-700°C)
# Metakaolin → Spinel + amorphous silica (900-1000°C)
# Spinel → Mullite + cristobalite (1000-1200°C)

def sigmoid(t, center, width):
    return 1 / (1 + np.exp(-(t - center) / width))

kaolinite = 1 - sigmoid(temperature, 600, 50)
metakaolin = sigmoid(temperature, 600, 50) - sigmoid(temperature, 950, 40)
metakaolin = np.maximum(metakaolin, 0)
spinel = sigmoid(temperature, 950, 40) - sigmoid(temperature, 1100, 30)
spinel = np.maximum(spinel, 0)
mullite = sigmoid(temperature, 1100, 30)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# Phase diagram
ax1.set_facecolor('#111827')
ax1.fill_between(temperature, 0, kaolinite, color='#3b82f6', alpha=0.6, label='Kaolinite (raw clay)')
ax1.fill_between(temperature, kaolinite, kaolinite + metakaolin, color='#f59e0b', alpha=0.6, label='Metakaolin')
ax1.fill_between(temperature, kaolinite + metakaolin, kaolinite + metakaolin + spinel, color='#a855f7', alpha=0.6, label='Spinel phase')
ax1.fill_between(temperature, 1 - mullite, 1, color='#ef4444', alpha=0.6, label='Mullite (ceramic)')

# Key temperature markers
events = [
    (100, 'Water evaporates'),
    (573, 'Quartz inversion'),
    (600, 'Dehydroxylation begins'),
    (950, 'Spinel formation'),
    (1100, 'Mullite crystallizes'),
]
for temp_mark, event in events:
    ax1.axvline(temp_mark, color='white', linestyle=':', linewidth=0.5, alpha=0.5)
    ax1.text(temp_mark, 1.05, event, rotation=45, color='white', fontsize=7, ha='left')

ax1.set_xlabel('Temperature (°C)', color='white')
ax1.set_ylabel('Phase fraction', color='white')
ax1.set_title('Clay Phase Transformations During Firing', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='center left')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 1.3)

# Material properties vs temperature
ax2.set_facecolor('#111827')

# Strength increases with firing temperature (up to a point)
strength = 5 + 45 * sigmoid(temperature, 800, 80) + 30 * sigmoid(temperature, 1100, 40)
# Porosity decreases
porosity = 45 - 30 * sigmoid(temperature, 700, 100) - 10 * sigmoid(temperature, 1100, 50)
porosity = np.maximum(porosity, 2)
# Shrinkage
shrinkage = 3 * sigmoid(temperature, 600, 60) + 5 * sigmoid(temperature, 1000, 50)

ax2.plot(temperature, strength, color='#ef4444', linewidth=2, label='Strength (MPa)')
ax2.plot(temperature, porosity, color='#3b82f6', linewidth=2, label='Porosity (%)')
ax2.plot(temperature, shrinkage, color='#f59e0b', linewidth=2, label='Shrinkage (%)')

# Mark pottery types
pottery_types = [
    (700, 'Earthenware', '#f59e0b'),
    (1000, 'Stoneware', '#22c55e'),
    (1200, 'Porcelain', '#a855f7'),
]
for temp_mark, name, color in pottery_types:
    idx = np.argmin(np.abs(temperature - temp_mark))
    ax2.axvline(temp_mark, color=color, linestyle='--', linewidth=1, alpha=0.5)
    ax2.text(temp_mark, 82, name, ha='center', color=color, fontsize=9, fontweight='bold')

ax2.set_xlabel('Firing temperature (°C)', color='white')
ax2.set_ylabel('Property value', color='white')
ax2.set_title('Material Properties vs Firing Temperature', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Pottery types by firing temperature:")
print("  Earthenware (600-900°C): porous, soft, red-brown. Dhubri pottery.")
print("  Stoneware (1000-1200°C): dense, hard, water-resistant.")
print("  Porcelain (1200-1400°C): translucent, very hard, vitrified.")
print()
print("The little potter of Dhubri fires at ~800°C (earthenware).")
print("Higher temperatures need better kilns and more fuel.")`,
      challenge: 'The little potter\'s kiln reaches 800°C. At this temperature, what phase is the clay in? What properties does it have? If he could build a kiln reaching 1200°C, how would his pots improve? What would he lose?',
      successHint: 'The same phase transformation principles that govern pottery also govern advanced ceramics in jet engines, semiconductor manufacturing, and space shuttle tiles. The little potter of Dhubri and a Rolls-Royce engineer both manage the same fundamental chemistry.',
    },
    {
      title: 'Firing and sintering — when particles become one',
      concept: `When the potter loads his kiln and lights the fire, he begins a process that takes 10-24 hours and transforms loose particles into a solid object. The key process is **sintering**: the bonding of particles at high temperature without melting the entire piece.

How sintering works:
1. **Initial stage** (< 600°C): water evaporates, organic matter burns off. The pot shrinks slightly.
2. **Intermediate stage** (600-900°C): particles begin to bond at contact points through **diffusion** — atoms migrate from particle surfaces to the neck between particles, driven by surface energy reduction.
3. **Final stage** (> 900°C): pores shrink and close. The material becomes denser and stronger. In porcelain, a glass phase forms (vitrification) that fills remaining pores.

The driving force is **surface energy minimization**. Particles have high surface energy (atoms at surfaces are less stable than atoms inside). By merging surfaces, total surface area decreases, energy decreases, and the system becomes more stable. This is the same reason soap bubbles merge — they minimize surface area.

The Dhubri potter's earthenware fires at ~800°C. At this temperature, sintering is incomplete — the pottery remains porous (can absorb water, which keeps contents cool through evaporation). Stoneware (~1100°C) sinters fully — watertight without glazing.`,
      analogy: 'Sintering is like pressing snowballs together. At first, each snowflake (particle) is separate. When you squeeze (heat), they bond at contact points. More pressure (higher temperature) creates a denser, harder ball. Eventually, you can\'t see individual flakes anymore — they\'ve fused into ice. The potter\'s kiln does this with clay particles instead of snow.',
      storyConnection: 'The little potter knew the fire was done when the pots "rang" — a clear, bell-like sound when tapped. Unsintered clay makes a dull thud. Sintered ceramic vibrates at a higher frequency because it\'s stiffer and more continuous. The potter was performing a non-destructive acoustic test — the same principle used to test jet engine blades for micro-cracks.',
      checkQuestion: 'The potter\'s earthenware pot "sweats" when filled with water — tiny droplets appear on the outside. Why is this useful, and why doesn\'t a stoneware pot do the same?',
      checkAnswer: 'Earthenware is porous (incomplete sintering) — water seeps through microscopic pores to the surface. There, it evaporates, absorbing heat from the pot and its contents (evaporative cooling). This can lower the water temperature by 5-10°C below ambient — a natural refrigerator. Stoneware is fully sintered — no pores, no seepage, no cooling. The Dhubri potter\'s "imperfect" firing is actually a design feature for the hot Assam climate.',
      codeIntro: 'Model the sintering process: how density and strength change with time and temperature.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sintering model
# Density increases with time at constant temperature
# Rate depends on temperature (Arrhenius)

time = np.linspace(0, 24, 200)  # hours

# Arrhenius sintering rate: k = A * exp(-Ea/RT)
R = 8.314  # J/(mol·K)
Ea = 200000  # J/mol (activation energy for clay sintering)
A = 1e8  # pre-exponential

temperatures_C = [600, 800, 1000, 1200]
colors_temp = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Density vs time at different temperatures
ax1.set_facecolor('#111827')

initial_density = 55  # % of theoretical (green body)
max_density = 98  # % (fully sintered)

for temp_C, color in zip(temperatures_C, colors_temp):
    temp_K = temp_C + 273.15
    k = A * np.exp(-Ea / (R * temp_K))
    density = initial_density + (max_density - initial_density) * (1 - np.exp(-k * time * 3600))
    ax1.plot(time, density, linewidth=2, color=color, label=f'{temp_C}°C')

ax1.axhline(70, color='gray', linestyle=':', linewidth=0.5)
ax1.text(0.5, 71, 'Earthenware threshold', color='gray', fontsize=8)
ax1.axhline(90, color='gray', linestyle=':', linewidth=0.5)
ax1.text(0.5, 91, 'Stoneware threshold', color='gray', fontsize=8)

ax1.set_xlabel('Time (hours)', color='white')
ax1.set_ylabel('Relative density (%)', color='white')
ax1.set_title('Sintering: Density vs Time at Different Temperatures', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(50, 100)

# Porosity and strength relationship
ax2.set_facecolor('#111827')

porosity = np.linspace(0, 45, 100)  # percent
# Strength decreases exponentially with porosity
# σ = σ0 * exp(-b * P)
sigma0 = 200  # MPa (zero porosity strength)
b = 0.07
strength = sigma0 * np.exp(-b * porosity)

ax2.plot(porosity, strength, color='#ef4444', linewidth=2)
ax2.fill_between(porosity, strength, alpha=0.15, color='#ef4444')

# Mark pottery types
pottery = [
    (35, 'Green\
(unfired)', '#3b82f6'),
    (25, 'Dhubri\
earthenware', '#f59e0b'),
    (10, 'Stoneware', '#22c55e'),
    (2, 'Porcelain', '#a855f7'),
]
for por, name, color in pottery:
    s = sigma0 * np.exp(-b * por)
    ax2.plot(por, s, 'o', color=color, markersize=10, zorder=5)
    ax2.annotate(name, (por, s), xytext=(por + 3, s + 10), color=color, fontsize=8,
                arrowprops=dict(arrowstyle='->', color=color, lw=0.5))

ax2.set_xlabel('Porosity (%)', color='white')
ax2.set_ylabel('Strength (MPa)', color='white')
ax2.set_title('Strength vs Porosity (exponential relationship)', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Sintering summary:")
for temp_C, color in zip(temperatures_C, colors_temp):
    temp_K = temp_C + 273.15
    k = A * np.exp(-Ea / (R * temp_K))
    # Time to reach 90% density
    target = (90 - initial_density) / (max_density - initial_density)
    t90 = -np.log(1 - target) / (k * 3600) if k > 0 else float('inf')
    print(f"  {temp_C}°C: sintering rate = {k:.2e}/s, time to 90% density = {t90:.1f} hours")

print()
print("The potter's trade-off:")
print("  Higher temperature → faster sintering, denser pottery, more fuel")
print("  Lower temperature → slower, more porous, less fuel, evaporative cooling")
print("  Dhubri earthenware (800°C) is intentionally porous — a feature, not a flaw.")`,
      challenge: 'If the potter switches from wood (max ~900°C) to coal (max ~1200°C), his sintering rate increases dramatically. Calculate the rate increase: exp(-Ea/(R×1473)) / exp(-Ea/(R×1173)). How much faster does sintering occur? Is it worth the fuel cost?',
      successHint: 'Sintering is the most important process in ceramics manufacturing — from bathroom tiles to dental crowns to nuclear fuel pellets. The Arrhenius equation governs them all, whether the kiln is on a Dhubri riverbank or in a billion-dollar semiconductor fab.',
    },
    {
      title: 'Glazing chemistry — the glass coat',
      concept: `Some of the potter's finest pieces receive a **glaze** — a thin layer of glass melted onto the ceramic surface. Glazing serves multiple purposes: waterproofing, decoration, food safety (sealing porous earthenware), and durability.

A glaze is essentially a thin layer of **glass** — an amorphous (non-crystalline) solid made primarily of:
- **Silica** (SiO₂): the glass former. Creates the network of Si-O bonds that is the backbone of glass.
- **Flux** (Na₂O, K₂O, CaO): lowers the melting point of silica. Pure silica melts at 1,713°C — too hot for most kilns. Adding flux brings it down to 800-1200°C.
- **Alumina** (Al₂O₃): the stabilizer. Makes the glass more resistant to water and acids. Without it, glazes dissolve in acidic foods.
- **Colourants**: metal oxides that produce colours. Iron oxide → browns/reds/greens. Copper oxide → greens/blues. Cobalt oxide → deep blue.

The colour of a glaze depends not just on the metal but on the **kiln atmosphere**:
- **Oxidation firing** (plenty of oxygen): copper → green, iron → red-brown
- **Reduction firing** (limited oxygen): copper → red (the famous copper-red glaze), iron → celadon green

The potter of Dhubri makes a simple glaze from rice husk ash (high silica) + wood ash (flux) + local red soil (iron colourant).`,
      analogy: 'Glazing is like painting a wall, but instead of paint that dries, you\'re applying glass that melts. The "paint" starts as a powder suspended in water, applied by dipping or brushing. In the kiln, it melts, flows to coat the surface, then freezes into a smooth glass layer on cooling. It\'s spray-painting with molten glass.',
      storyConnection: 'The little potter\'s best trick: he mixed rice husk ash from the paddy fields with clay and water to make a creamy paste, dipped his pots in it, and fired them. The rice ash, rich in silica, melted at kiln temperature and formed a natural glaze — golden-brown from the iron in the clay. No commercial chemicals needed. This "ash glaze" technique is thousands of years old.',
      checkQuestion: 'A glazed mug sometimes develops fine cracks (crazing) over time. Why?',
      checkAnswer: 'Crazing happens when the glaze and the clay body have different thermal expansion coefficients. As the piece cools after firing, both contract — but if the glaze contracts more than the body, it\'s put under tension (like a too-tight shirt). Over time, this tension causes the glaze to crack in a network of fine lines. The solution: match the expansion coefficients by adjusting the glaze recipe. Adding more silica to the glaze usually reduces its expansion.',
      codeIntro: 'Explore how glaze composition affects melting point and colour.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Glaze chemistry: ternary diagram of SiO2-Flux-Al2O3
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Melting point vs flux content
ax1.set_facecolor('#111827')

flux_pct = np.linspace(0, 60, 100)
# Melting point decreases with flux (approximately)
# Pure silica: 1713°C, typical glaze: 900-1200°C
melting_point = 1713 - 15 * flux_pct - 0.05 * flux_pct**2

ax1.plot(flux_pct, melting_point, color='#ef4444', linewidth=2)
ax1.fill_between(flux_pct, melting_point, 600, alpha=0.1, color='#ef4444')

# Mark common glazes
glazes = [
    (10, 'High-fire porcelain\
(1300°C)', '#a855f7'),
    (20, 'Stoneware glaze\
(1200°C)', '#22c55e'),
    (35, 'Earthenware glaze\
(1000°C)', '#f59e0b'),
    (50, 'Raku glaze\
(800°C)', '#3b82f6'),
]
for flux, label, color in glazes:
    mp = 1713 - 15 * flux - 0.05 * flux**2
    ax1.plot(flux, mp, 'o', color=color, markersize=10, zorder=5)
    ax1.annotate(label, (flux, mp), xytext=(flux+3, mp+30), color=color, fontsize=8,
                arrowprops=dict(arrowstyle='->', color=color, lw=0.5))

ax1.axhline(800, color='#f59e0b', linestyle=':', linewidth=1)
ax1.text(2, 810, 'Dhubri kiln max temp', color='#f59e0b', fontsize=8)

ax1.set_xlabel('Flux content (%)', color='white')
ax1.set_ylabel('Melting point (°C)', color='white')
ax1.set_title('Glaze Melting Point vs Flux Content', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# 2. Glaze colours from metal oxides
ax2.set_facecolor('#111827')

oxides = {
    'Iron oxide (Fe₂O₃)': {
        'oxidation': '#8B4513',  # brown
        'reduction': '#556B2F',  # olive green
        'pct_range': '1-10%',
    },
    'Copper oxide (CuO)': {
        'oxidation': '#2E8B57',  # green
        'reduction': '#B22222',  # red
        'pct_range': '0.5-3%',
    },
    'Cobalt oxide (CoO)': {
        'oxidation': '#000080',  # deep blue
        'reduction': '#000080',  # same (cobalt is stable)
        'pct_range': '0.1-1%',
    },
    'Manganese (MnO₂)': {
        'oxidation': '#4B0082',  # purple-brown
        'reduction': '#D2691E',  # tan
        'pct_range': '2-5%',
    },
    'Titanium (TiO₂)': {
        'oxidation': '#F5F5DC',  # cream/white
        'reduction': '#87CEEB',  # light blue
        'pct_range': '5-10%',
    },
}

y_pos = np.arange(len(oxides))
names_ox = list(oxides.keys())

for i, (name, data) in enumerate(oxides.items()):
    # Oxidation color swatch
    rect_ox = plt.Rectangle((0, i - 0.3), 0.4, 0.6, facecolor=data['oxidation'], edgecolor='white')
    ax2.add_patch(rect_ox)
    # Reduction color swatch
    rect_red = plt.Rectangle((0.5, i - 0.3), 0.4, 0.6, facecolor=data['reduction'], edgecolor='white')
    ax2.add_patch(rect_red)
    # Label
    ax2.text(1.1, i, f'{name} ({data["pct_range"]})', va='center', color='white', fontsize=9)

ax2.text(0.2, len(oxides) + 0.2, 'Oxidation', ha='center', color='white', fontsize=9, fontweight='bold')
ax2.text(0.7, len(oxides) + 0.2, 'Reduction', ha='center', color='white', fontsize=9, fontweight='bold')

ax2.set_xlim(-0.2, 3.5)
ax2.set_ylim(-0.5, len(oxides) + 0.5)
ax2.set_title('Glaze Colours from Metal Oxides', color='white', fontsize=12)
ax2.axis('off')

plt.tight_layout()
plt.show()

print("Glaze recipe for Dhubri-style ash glaze:")
print("  Rice husk ash: 40% (silica source)")
print("  Wood ash: 30% (flux — Na, K, Ca)")
print("  Local red clay: 20% (alumina + iron colourant)")
print("  Water: 10% (for application)")
print()
print("Expected result at 800°C oxidation firing:")
print("  Colour: golden-brown (from iron oxide in oxidation)")
print("  Surface: slightly rough (not fully melted at 800°C)")
print("  Function: partially waterproofs the earthenware")`,
      challenge: 'The potter wants a green glaze instead of brown. He needs copper oxide, but it\'s not locally available. Could he use the green patina (verdigris) from old brass utensils? Verdigris is copper(II) acetate, which decomposes to CuO at ~240°C. Would this work?',
      successHint: 'Glaze chemistry is the origin of glass science, which led to optical lenses (microscopes, telescopes), fiber optics (the internet), and semiconductor manufacturing (silicon is refined glass). The potter\'s kiln is the ancestor of the modern materials lab.',
    },
    {
      title: 'The pottery wheel — angular momentum in action',
      concept: `The potter sits at his wheel — a heavy stone disc mounted on a vertical axis. He kicks it with his foot, and it spins smoothly for minutes. While it spins, he shapes clay with both hands, using the wheel's rotation to create perfectly symmetrical forms. This is **angular momentum** in action.

Angular momentum (L) = moment of inertia (I) × angular velocity (ω)

**Moment of inertia** depends on mass distribution: more mass farther from the axis = more I = harder to start but longer spin. This is why pottery wheels are heavy at the rim.

**Conservation of angular momentum**: once the wheel is spinning, L stays constant (ignoring friction). If friction is low, the wheel spins for a long time. The potter kicks periodically to overcome friction.

The wheel's physics enable pottery:
- **Centripetal force**: the rotating clay tries to fly outward. The potter's hands counter this, shaping the clay.
- **Symmetry**: constant rotation means every point at the same radius receives the same treatment → perfect circles.
- **Consistency**: steady rotation speed means uniform wall thickness.

The oldest known pottery wheel dates to ~4500 BCE in Mesopotamia. It was one of humanity's first precision tools — and it's fundamentally unchanged.`,
      analogy: 'A pottery wheel is like a figure skater spinning. A heavy skater (heavy wheel) spins slower but longer. Arms out (mass far from axis) = slow spin. Arms in (mass near axis) = fast spin. The potter\'s heavy flywheel is like a skater with arms permanently extended — slow, steady, and powerful.',
      storyConnection: 'The little potter\'s wheel was made by his grandfather — a stone disc 60 cm across, mounted on a wooden axle greased with mustard oil. "A good wheel should spin for two minutes on a single kick," his father said. "That\'s enough to pull a small pot from start to finish." Two minutes of spin = low friction + high moment of inertia. Engineering wisdom encoded in craft tradition.',
      checkQuestion: 'Why is the potter\'s wheel heavy at the rim rather than at the center?',
      checkAnswer: 'Moment of inertia (I) = Σ(m × r²). Mass at the rim (large r) contributes r² more than mass at the center (small r). Moving 1 kg from the center to the rim can double or triple the moment of inertia. Higher I means more angular momentum per unit of angular velocity → the wheel stores more kinetic energy → it spins longer between kicks. The heavy rim is a flywheel, designed for maximum energy storage.',
      codeIntro: 'Model the physics of a pottery wheel: moment of inertia, spin-down time, and forces.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Pottery wheel physics
# Model: stone disc, kicked periodically, friction slows it

# Wheel parameters
wheel_radius = 0.3  # meters (60cm diameter)
wheel_mass = 25  # kg (stone wheel)

# Moment of inertia for a solid disc: I = 0.5 * m * r²
# For a rim-heavy wheel: closer to I = m * r²
I_solid = 0.5 * wheel_mass * wheel_radius**2
I_rim_heavy = 0.8 * wheel_mass * wheel_radius**2  # 80% mass at rim

# Friction torque (constant, from bearing friction)
tau_friction = 0.05  # N·m

# Angular deceleration: alpha = tau / I
alpha_solid = tau_friction / I_solid
alpha_rim = tau_friction / I_rim_heavy

# Initial angular velocity after kick
omega_0 = 10  # rad/s (~95 RPM)

# Spin-down curves
time = np.linspace(0, 300, 500)  # seconds

omega_solid = np.maximum(0, omega_0 - alpha_solid * time)
omega_rim = np.maximum(0, omega_0 - alpha_rim * time)

# Speed in RPM
rpm_solid = omega_solid * 60 / (2 * np.pi)
rpm_rim = omega_rim * 60 / (2 * np.pi)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Spin-down comparison
ax1.set_facecolor('#111827')
ax1.plot(time, rpm_solid, color='#3b82f6', linewidth=2, label=f'Solid disc (I={I_solid:.3f} kg·m²)')
ax1.plot(time, rpm_rim, color='#22c55e', linewidth=2, label=f'Rim-heavy (I={I_rim_heavy:.3f} kg·m²)')

# Mark usable speed range (30-90 RPM for pottery)
ax1.axhspan(30, 90, alpha=0.1, color='#f59e0b')
ax1.text(10, 60, 'Usable range\
(30-90 RPM)', color='#f59e0b', fontsize=9)

# Calculate usable time
usable_solid = (omega_0 - 30 * 2 * np.pi / 60) / alpha_solid
usable_rim = (omega_0 - 30 * 2 * np.pi / 60) / alpha_rim

ax1.axvline(usable_solid, color='#3b82f6', linestyle=':', linewidth=1)
ax1.axvline(usable_rim, color='#22c55e', linestyle=':', linewidth=1)

ax1.set_xlabel('Time (seconds)', color='white')
ax1.set_ylabel('Speed (RPM)', color='white')
ax1.set_title('Wheel Spin-Down: Solid vs Rim-Heavy', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Forces on clay during throwing
ax2.set_facecolor('#111827')

# Centripetal acceleration at different radii and speeds
radii = np.linspace(0.01, 0.15, 100)  # clay radius (m)
speeds = [40, 60, 80, 100]  # RPM
colors_speed = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

for rpm, color in zip(speeds, colors_speed):
    omega = rpm * 2 * np.pi / 60
    centripetal = omega**2 * radii  # m/s²
    force_per_kg = centripetal  # N/kg (=acceleration)
    ax2.plot(radii * 100, force_per_kg, linewidth=2, color=color, label=f'{rpm} RPM')

# Mark where clay starts to fly off (yield stress exceeded)
ax2.axhline(15, color='gray', linestyle=':', linewidth=1)
ax2.text(1, 16, 'Clay yield limit (~15 m/s²)', color='gray', fontsize=8)

ax2.set_xlabel('Distance from center (cm)', color='white')
ax2.set_ylabel('Centripetal acceleration (m/s²)', color='white')
ax2.set_title('Centripetal Force on Clay vs Radius & Speed', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Pottery wheel physics:")
print(f"  Solid disc I = {I_solid:.4f} kg·m²")
print(f"  Rim-heavy I = {I_rim_heavy:.4f} kg·m² ({I_rim_heavy/I_solid:.1f}× more)")
print(f"  Usable spin time (solid): {usable_solid:.0f} seconds")
print(f"  Usable spin time (rim-heavy): {usable_rim:.0f} seconds ({usable_rim/usable_solid:.1f}× longer)")
print()
print("The rim-heavy design gives 60% more working time per kick.")
print("This is why traditional wheels are always heavy at the edge.")`,
      challenge: 'If the potter adds a 5 kg lead weight at the very edge of the wheel (r = 0.3m), how much does the moment of inertia increase? Calculate: I_new = I_old + 5 × 0.3². How much longer does the wheel spin?',
      successHint: 'Angular momentum and moment of inertia apply far beyond pottery: gyroscopes (navigation), flywheels (energy storage), figure skating (spin control), and even neutron stars (which spin up to 716 times per second). The physics of the potter\'s wheel is the physics of the cosmos.',
    },
    {
      title: 'Archaeological significance — pottery as history',
      concept: `Pottery is the most important material in archaeology. It appears on almost every site from the Neolithic onwards (starting ~10,000 BCE), it's nearly indestructible (ceramics don't biodegrade), and its styles change over time in predictable ways — making it a clock for dating sites.

Why pottery matters:
- **Dating**: pottery styles change over centuries. If you know when a particular style was made, finding it dates the layer it was found in.
- **Trade networks**: pottery made from distinctive clay can be traced to its source (through chemical analysis), revealing trade routes.
- **Technology**: firing temperature indicates technological capability. Higher temperatures need better kilns.
- **Culture**: decoration styles reflect aesthetic traditions, religious beliefs, and social status.
- **Diet**: residues in cooking pots preserve molecular traces of what was cooked thousands of years ago (lipid analysis).

At Dhubri, the Brahmaputra's banks contain pottery fragments from multiple periods — prehistoric cord-impressed ware, medieval glazed ware, and modern earthenware like the little potter makes today. The tradition is unbroken across millennia: the same clay, the same river, the same hands shaping it.`,
      analogy: 'Pottery in archaeology is like ID cards at a crime scene. Each period has its distinctive "ID" (style, clay composition, firing technique). Finding a specific pottery type is like finding a dated document — it tells you when and who. And like fingerprints, pottery traces can be matched to their "suspect" (source clay, kiln, workshop).',
      storyConnection: 'The little potter\'s daughter found a strange pottery shard on the riverbank — different from her father\'s work. The clay was darker, the surface had cord impressions, and it felt harder. Her father recognized it: "This is old. Very old. My grandfather\'s grandfather didn\'t make pottery like this." It was likely 2,000+ years old — a fragment of India\'s Neolithic tradition, tumbled out of an eroding riverbank by the same Brahmaputra that provides clay for today\'s potter.',
      checkQuestion: 'If you found a pottery fragment and wanted to learn everything possible about it without breaking it, what tests would you run?',
      checkAnswer: 'Non-destructive analysis: 1) Photograph and measure (shape, size, wall thickness). 2) Petrographic thin-section (microscope examination of clay minerals). 3) XRF (X-ray fluorescence — chemical composition without touching). 4) Thermoluminescence (dating — measures last time the pot was heated). 5) Magnetic susceptibility (indicates firing temperature). 6) 3D scanning (permanent digital record). 7) CT scanning (internal structure without cutting). All give data without destroying the artifact.',
      codeIntro: 'Build a pottery classification and dating system based on attributes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Pottery classification system
# Simulate sherds from different periods with measurable attributes

n_sherds = 150

# Three periods with different characteristics
periods = {
    'Neolithic (3000-1000 BCE)': {
        'wall_thickness': (12, 3),  # mm, (mean, std)
        'firing_temp': (650, 80),   # °C
        'color_value': (30, 10),    # darkness (0-100)
        'count': 40,
        'color': '#ef4444',
    },
    'Medieval (800-1200 CE)': {
        'wall_thickness': (8, 2),
        'firing_temp': (850, 60),
        'color_value': (50, 15),
        'count': 60,
        'color': '#f59e0b',
    },
    'Modern (1800-present)': {
        'wall_thickness': (6, 1.5),
        'firing_temp': (780, 50),
        'color_value': (65, 10),
        'count': 50,
        'color': '#22c55e',
    },
}

# Generate data
all_thickness = []
all_firing = []
all_color = []
all_period = []

for period, params in periods.items():
    n = params['count']
    all_thickness.extend(np.random.normal(*params['wall_thickness'], n))
    all_firing.extend(np.random.normal(*params['firing_temp'], n))
    all_color.extend(np.random.normal(*params['color_value'], n))
    all_period.extend([period] * n)

all_thickness = np.array(all_thickness)
all_firing = np.array(all_firing)
all_color = np.array(all_color)

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

# 1. Wall thickness vs firing temperature (scatter)
ax = axes[0, 0]
ax.set_facecolor('#111827')

for period, params in periods.items():
    mask = [p == period for p in all_period]
    ax.scatter(all_thickness[mask], all_firing[mask], c=params['color'], s=30,
             label=period, alpha=0.6, edgecolors='white', linewidths=0.3)

ax.set_xlabel('Wall thickness (mm)', color='white')
ax.set_ylabel('Estimated firing temp (°C)', color='white')
ax.set_title('Pottery Classification: Thickness vs Firing Temp', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# 2. Attribute distributions
ax = axes[0, 1]
ax.set_facecolor('#111827')

for period, params in periods.items():
    mask = [p == period for p in all_period]
    ax.hist(all_thickness[mask], bins=15, alpha=0.5, color=params['color'], label=period, density=True)

ax.set_xlabel('Wall thickness (mm)', color='white')
ax.set_ylabel('Density', color='white')
ax.set_title('Wall Thickness Distribution by Period', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax.tick_params(colors='gray')

# 3. Technology progression timeline
ax = axes[1, 0]
ax.set_facecolor('#111827')

timeline = {
    'Hand-built coil': -3000,
    'Paddle & anvil': -2000,
    'Slow wheel': -1000,
    'Fast wheel': 0,
    'Kick wheel': 500,
    'Glazing introduced': 800,
    'Modern kiln': 1800,
}

y_pos = np.arange(len(timeline))
years = list(timeline.values())
names_tl = list(timeline.keys())

ax.barh(y_pos, [abs(y) if y < 0 else y for y in years], color='#3b82f6', alpha=0.7)
ax.set_yticks(y_pos)
ax.set_yticklabels(names_tl, color='white', fontsize=9)
ax.set_xlabel('Year (approximate)', color='white')
ax.set_title('Pottery Technology Timeline (Brahmaputra region)', color='white', fontsize=11)
ax.tick_params(colors='gray')

for i, year in enumerate(years):
    label = f'{abs(year)} {"BCE" if year < 0 else "CE"}'
    ax.text(max(abs(year), 100) + 50, i, label, va='center', color='white', fontsize=8)

# 4. Mystery sherd classifier
ax = axes[1, 1]
ax.set_facecolor('#111827')

# Simulate finding a mystery sherd
mystery_thickness = 10  # mm
mystery_firing = 720    # °C

# Distance to each period's centroid
for period, params in periods.items():
    t_dist = (mystery_thickness - params['wall_thickness'][0]) / params['wall_thickness'][1]
    f_dist = (mystery_firing - params['firing_temp'][0]) / params['firing_temp'][1]
    total_dist = np.sqrt(t_dist**2 + f_dist**2)

# Plot mystery sherd on the scatter
for period, params in periods.items():
    mask = [p == period for p in all_period]
    ax.scatter(all_thickness[mask], all_firing[mask], c=params['color'], s=20, alpha=0.3)

ax.scatter(mystery_thickness, mystery_firing, c='white', s=200, marker='*', zorder=5, label='Mystery sherd')
ax.set_xlabel('Wall thickness (mm)', color='white')
ax.set_ylabel('Firing temp (°C)', color='white')
ax.set_title('Mystery Sherd Classification', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Pottery classification results:")
print(f"  Mystery sherd: thickness={mystery_thickness}mm, firing={mystery_firing}°C")
print()
for period, params in periods.items():
    t_z = abs(mystery_thickness - params['wall_thickness'][0]) / params['wall_thickness'][1]
    f_z = abs(mystery_firing - params['firing_temp'][0]) / params['firing_temp'][1]
    distance = np.sqrt(t_z**2 + f_z**2)
    probability = 1 / (1 + distance)  # simple proximity score
    print(f"  {period}: distance={distance:.2f}, match={probability*100:.0f}%")`,
      challenge: 'Add a third attribute — clay mineral composition (measured by XRF). Neolithic pottery uses local clay (high iron), medieval uses mixed clay (medium iron), modern uses processed clay (low iron). Add this dimension to the classifier. Does it improve the classification?',
      successHint: 'Pottery classification is one of the oldest forms of data science — pattern recognition applied to material culture. The same clustering and classification techniques used here are used in machine learning, medical diagnosis, and customer segmentation. The little potter of Dhubri makes data points that will be analyzed for centuries.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Ceramics & Material Science — no prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for ceramics and materials science simulations. Click to start.</p>
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