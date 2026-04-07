import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PithaLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'pH and taste — the chemistry of sour, bitter, and sweet',
      concept: `Every flavour you taste is a chemical signal. **pH** — the measure of hydrogen ion concentration — is directly responsible for sourness. The pH scale runs from 0 (extremely acidic) to 14 (extremely alkaline), with 7 being neutral.

- **Sour taste**: caused by H⁺ ions (acids). Lemon juice (pH 2), vinegar (pH 3), fermented rice batter (pH 4-5)
- **Bitter taste**: often caused by alkaloids (caffeine, quinine) — not directly pH-related but many bitter compounds are basic
- **Sweet taste**: triggered by sugars binding to T1R2/T1R3 taste receptors — a shape-based lock-and-key mechanism

The pH of food affects:
- **Maillard reaction speed**: alkaline conditions accelerate browning (baking soda in pretzels)
- **Protein structure**: acid denatures proteins (ceviche "cooks" fish with lime juice)
- **Starch behaviour**: acid breaks down starch faster (why acidic sauces are thinner)
- **Microbial safety**: pH below 4.6 prevents Clostridium botulinum growth (the basis of canning safety)

The mathematical definition: **pH = -log₁₀[H⁺]**, where [H⁺] is the molar concentration of hydrogen ions.`,
      analogy: 'pH is like a volume knob for sourness. At pH 7 (neutral), the volume is at zero — no sour signal. Turn it down to pH 3, and the sourness is cranked up to 10,000× louder. Each pH unit is a 10× change in H⁺ concentration — it\'s a logarithmic scale, like decibels for sound.',
      storyConnection: 'Grandmother\'s fermented rice batter starts at pH ~6 (nearly neutral) and drops to pH ~4 over 12 hours as lactic acid bacteria produce acid. She judged fermentation by smell and taste — that tangy sharpness told her the pH had dropped enough to make the batter safe and flavourful.',
      checkQuestion: 'Baking soda (sodium bicarbonate, pH ~8.5) is sometimes added to batter to make it brown faster. But it also makes the batter taste soapy if you add too much. Why?',
      checkAnswer: 'Baking soda is alkaline, and our taste buds detect alkalinity as a soapy/bitter taste (soap is also alkaline). The browning benefit comes from the Maillard reaction being faster at higher pH. The trick is using just enough to accelerate browning without raising pH enough to taste. Typically 1/4 teaspoon per cup of flour — a tiny amount that shifts pH by less than 1 unit.',
      codeIntro: 'Explore the logarithmic pH scale and map food pH values.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# pH scale visualization with foods
foods = {
    'Battery acid': 0.5,
    'Lemon juice': 2.0,
    'Vinegar': 2.5,
    'Orange juice': 3.5,
    'Fermented batter': 4.2,
    'Black coffee': 5.0,
    'Milk': 6.5,
    'Pure water': 7.0,
    'Baking soda': 8.3,
    'Soap': 10.0,
    'Bleach': 12.5,
}

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7))
fig.patch.set_facecolor('#1f2937')

# pH scale with foods
ax1.set_facecolor('#111827')
pH_range = np.linspace(0, 14, 300)
colors_map = plt.cm.RdYlGn(np.linspace(0, 1, 300))

for i in range(len(pH_range) - 1):
    ax1.barh(0, pH_range[i+1] - pH_range[i], left=pH_range[i], height=0.6,
             color=colors_map[i], edgecolor='none')

for food, ph in foods.items():
    ax1.plot(ph, 0, 'v', color='white', markersize=8)
    y_offset = 0.5 if list(foods.keys()).index(food) % 2 == 0 else -0.5
    ax1.annotate(f'{food}\\n(pH {ph})', xy=(ph, 0), xytext=(ph, y_offset),
                color='white', fontsize=7, ha='center', va='center',
                arrowprops=dict(arrowstyle='->', color='gray', lw=0.5))

ax1.set_xlim(-0.5, 14.5)
ax1.set_ylim(-1.2, 1.2)
ax1.set_xlabel('pH', color='white')
ax1.set_title('The pH Scale: Foods and Common Substances', color='white', fontsize=13)
ax1.tick_params(colors='gray')
ax1.set_yticks([])

# H+ concentration (logarithmic)
ax2.set_facecolor('#111827')
pH_values = np.arange(0, 15)
h_concentration = 10.0 ** (-pH_values)

ax2.bar(pH_values, h_concentration, color='#ef4444', alpha=0.8)
ax2.set_yscale('log')
ax2.set_xlabel('pH', color='white')
ax2.set_ylabel('[H⁺] concentration (mol/L)', color='white')
ax2.set_title('H⁺ Concentration: Each pH Unit = 10× Change', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("pH = -log₁₀[H⁺]")
print()
print("Each pH unit = 10× change in H⁺ concentration:")
for ph in [1, 3, 5, 7, 9, 11]:
    print(f"  pH {ph}: [H⁺] = {10**(-ph):.0e} mol/L")
print()
print("Lemon juice (pH 2) has 100,000× more H⁺ than water (pH 7)!")`,
      challenge: 'If Grandmother\'s batter goes from pH 6 to pH 4 during fermentation, by what factor does the H⁺ concentration increase? Calculate 10^(6-4). Why does this relatively small pH change make such a big taste difference?',
      successHint: 'The logarithmic nature of pH means our taste buds are effectively logarithmic sensors too — they respond to orders-of-magnitude changes. This is a recurring theme in biology: Weber\'s law says all our senses work on log scales.',
    },
    {
      title: 'Emulsions and colloids — when oil and water mix',
      concept: `Oil and water don't mix — unless you force them. An **emulsion** is a mixture of two immiscible liquids, stabilized by an **emulsifier**. Emulsions are everywhere in cooking:

- **Oil-in-water (O/W)**: tiny oil droplets suspended in water. Milk, mayonnaise, cream.
- **Water-in-oil (W/O)**: tiny water droplets in oil. Butter, margarine.

An emulsifier is a molecule with one end that loves water (hydrophilic) and one end that loves oil (hydrophobic). It sits at the interface between oil and water droplets, preventing them from merging back together.

Common food emulsifiers:
- **Lecithin** (egg yolk): the classic emulsifier for mayonnaise
- **Casein** (milk protein): keeps fat suspended in milk
- **Gum arabic**: from tree sap, used in soft drinks

**Colloids** are the broader category: any system where tiny particles (1nm - 1μm) are dispersed in another substance. Fog (water in air), smoke (solids in air), gelatin (liquid in solid) are all colloids.

Pitha batter is a complex colloid: starch granules, protein aggregates, and fat droplets all dispersed in water.`,
      analogy: 'An emulsifier is like a bilingual diplomat at a peace conference between Oil Nation and Water Republic. One arm speaks Oil (hydrophobic), the other speaks Water (hydrophilic). Without the diplomat, the two sides immediately separate. With enough diplomats at the border, peace (a stable emulsion) holds.',
      storyConnection: 'When Grandmother grinds sesame for til pitha, the seeds release both oil and water-soluble proteins. The grinding action creates an emulsion — the proteins act as natural emulsifiers, keeping the sesame paste smooth instead of separating into oil and gritty solids. Too little grinding = grainy. Too much = the emulsion breaks and oil pools.',
      checkQuestion: 'Why does homogenized milk look white, but the cream that rises on non-homogenized milk looks yellow?',
      checkAnswer: 'White colour comes from light scattering off tiny fat droplets (Tyndall effect). In homogenized milk, fat is forced through tiny nozzles, creating very small droplets (~1μm) that scatter all wavelengths equally → white. In non-homogenized milk, fat droplets are larger and float to the top. Concentrated fat without the scattering effect appears yellow (from beta-carotene in the fat).',
      codeIntro: 'Simulate an emulsion: oil droplets in water with and without an emulsifier.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulate oil droplets in water
n_droplets = 50

# Without emulsifier: droplets merge and separate (float to top)
# With emulsifier: droplets stay small and dispersed

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
fig.patch.set_facecolor('#1f2937')

# Without emulsifier (after 1 hour)
ax1.set_facecolor('#1a3a5c')  # water-blue background
ax1.set_title('Without Emulsifier (separated)', color='white', fontsize=12)

# Oil rises to top and merges into large blobs
# Large merged droplets at top
for _ in range(5):
    x = np.random.uniform(0.1, 0.9)
    r = np.random.uniform(0.06, 0.12)
    circle = plt.Circle((x, np.random.uniform(0.7, 0.9)), r, color='#f59e0b', alpha=0.7)
    ax1.add_patch(circle)

# A few small ones still sinking
for _ in range(8):
    x = np.random.uniform(0.1, 0.9)
    y = np.random.uniform(0.1, 0.5)
    r = np.random.uniform(0.01, 0.03)
    circle = plt.Circle((x, y), r, color='#f59e0b', alpha=0.5)
    ax1.add_patch(circle)

ax1.set_xlim(0, 1)
ax1.set_ylim(0, 1)
ax1.set_aspect('equal')
ax1.text(0.5, 0.95, 'OIL LAYER', ha='center', color='white', fontsize=10, fontweight='bold')
ax1.text(0.5, 0.3, 'WATER', ha='center', color='white', fontsize=10, fontweight='bold')
ax1.tick_params(colors='gray')

# With emulsifier (stable after 1 hour)
ax2.set_facecolor('#1a3a5c')
ax2.set_title('With Emulsifier (stable emulsion)', color='white', fontsize=12)

# Small, evenly distributed droplets
for _ in range(n_droplets):
    x = np.random.uniform(0.05, 0.95)
    y = np.random.uniform(0.05, 0.95)
    r = np.random.uniform(0.015, 0.03)
    # Droplet with emulsifier ring
    circle = plt.Circle((x, y), r, color='#f59e0b', alpha=0.7)
    ring = plt.Circle((x, y), r + 0.005, color='#22c55e', alpha=0.5, fill=False, linewidth=1.5)
    ax2.add_patch(circle)
    ax2.add_patch(ring)

ax2.set_xlim(0, 1)
ax2.set_ylim(0, 1)
ax2.set_aspect('equal')
ax2.text(0.5, 0.95, 'STABLE EMULSION', ha='center', color='white', fontsize=10, fontweight='bold')
ax2.tick_params(colors='gray')

# Legend
ax2.plot([], [], 'o', color='#f59e0b', markersize=8, label='Oil droplet')
ax2.plot([], [], 'o', color='#22c55e', markersize=8, label='Emulsifier coating')
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='lower right')

plt.tight_layout()
plt.show()

print("Emulsion stability depends on:")
print("  1. Droplet size: smaller = more stable (more surface area per volume)")
print("  2. Emulsifier strength: better coating = harder to merge")
print("  3. Viscosity: thicker continuous phase = slower separation")
print("  4. Density difference: smaller gap = less buoyancy force")
print()
print("Homogenization forces oil through tiny holes:")
print("  Raw milk fat droplets: ~3-5 μm")
print("  Homogenized: ~0.5-1 μm")
print("  Smaller droplets = white colour (Tyndall scattering)")`,
      challenge: 'Modify the simulation to show what happens with too MUCH emulsifier — create 200 droplets of very small size (r = 0.005-0.01). This is essentially what happens in ultra-processed foods: hyper-stable emulsions that never break down.',
      successHint: 'Emulsion science is worth billions of dollars. Cosmetics (lotions are emulsions), pharmaceuticals (drug delivery), paints, and foods all depend on controlling these oil-water interfaces. The same physics governs them all.',
    },
    {
      title: 'Calorimetry — measuring the energy in food',
      concept: `How do we know a til pitha has 450 calories per 100g? We measure it with **calorimetry** — the science of measuring heat. The classic method is the **bomb calorimeter**:

1. Place a dried, weighed food sample in a sealed steel chamber
2. Fill the chamber with pure oxygen
3. Ignite the food with an electric spark (it burns completely)
4. Measure the temperature rise of the surrounding water
5. Calculate energy: **Q = m × c × ΔT**

Where:
- Q = energy (joules)
- m = mass of water (kg)
- c = specific heat capacity of water (4,186 J/kg·°C)
- ΔT = temperature change (°C)

1 food Calorie (kcal) = 4,186 joules = the energy needed to raise 1 kg of water by 1°C.

Modern nutrition labels use the **Atwater system** instead: multiply grams of each macronutrient by standard factors (carbs: 4 kcal/g, protein: 4 kcal/g, fat: 9 kcal/g). This is faster than burning every food in a bomb calorimeter, though less precise.`,
      analogy: 'A bomb calorimeter is like measuring how much fuel is in a car by burning all the fuel and measuring the heat produced. It\'s destructive but precise. The Atwater system is like estimating fuel by knowing the tank size and fuel type — faster but approximate.',
      storyConnection: 'Grandmother never counted calories, but her body was a calorimeter. If she felt energetic after eating a ghila pitha, it was calorie-dense. If she felt hungry again quickly, it wasn\'t. Our hunger and satiety signals are the body\'s own (imperfect) calorimetry system, refined by millions of years of evolution.',
      checkQuestion: 'A food label says a snack has 200 Calories. If you burned that snack, how much water could you heat from 20°C to 100°C?',
      checkAnswer: '200 kcal = 200,000 cal. To heat water from 20°C to 100°C is an 80°C rise. Mass = Q / (c × ΔT) = 200,000 / (1 × 80) = 2,500 grams = 2.5 kg of water. A single snack bar contains enough energy to boil 2.5 litres of water — which puts into perspective how energy-dense food is.',
      codeIntro: 'Simulate a bomb calorimetry experiment with different food samples.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bomb calorimetry simulation
# Q = m_water * c_water * delta_T

c_water = 4.186  # kJ/(kg·°C)
m_water = 2.0    # kg of water in calorimeter

# Food samples (1 gram each, energy in kJ/g)
foods = {
    'Rice flour': {'energy_kj': 15.1, 'color': '#22c55e'},
    'Sugar': {'energy_kj': 16.7, 'color': '#3b82f6'},
    'Sesame seeds': {'energy_kj': 24.0, 'color': '#f59e0b'},
    'Coconut oil': {'energy_kj': 37.0, 'color': '#ef4444'},
    'Til pitha (mixed)': {'energy_kj': 18.8, 'color': '#a855f7'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Temperature rise curves
ax1.set_facecolor('#111827')
time = np.linspace(0, 60, 200)  # seconds

for name, props in foods.items():
    delta_T = props['energy_kj'] / (m_water * c_water)
    # Temperature rise follows: T = T0 + dT * (1 - exp(-t/tau))
    tau = 8  # time constant (seconds)
    temp = 20 + delta_T * (1 - np.exp(-time / tau))
    ax1.plot(time, temp, linewidth=2, color=props['color'], label=f"{name} (ΔT={delta_T:.2f}°C)")

ax1.set_xlabel('Time (seconds)', color='white')
ax1.set_ylabel('Water temperature (°C)', color='white')
ax1.set_title('Bomb Calorimeter: Temperature Rise per Gram', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Energy comparison bar chart
ax2.set_facecolor('#111827')
names = list(foods.keys())
energies_kcal = [foods[n]['energy_kj'] / 4.186 for n in names]
colors_list = [foods[n]['color'] for n in names]

bars = ax2.barh(names, energies_kcal, color=colors_list)
ax2.set_xlabel('Energy (kcal per gram)', color='white')
ax2.set_title('Caloric Density of Pitha Ingredients', color='white', fontsize=12)
ax2.tick_params(colors='gray')

for bar, kcal in zip(bars, energies_kcal):
    ax2.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
             f'{kcal:.1f} kcal/g', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Calorimetry formula: Q = m × c × ΔT")
print(f"  Water mass: {m_water} kg")
print(f"  Specific heat: {c_water} kJ/(kg·°C)")
print()
for name in names:
    e = foods[name]['energy_kj']
    dT = e / (m_water * c_water)
    print(f"  {name}: {e:.1f} kJ/g = {e/4.186:.1f} kcal/g → ΔT = {dT:.2f}°C")
print()
print("Coconut oil has ~2.5× the energy of rice flour per gram.")
print("This is why fat is the most efficient energy storage in nature.")`,
      challenge: 'A whole til pitha weighs about 50g. Calculate the total energy in kJ and kcal. If a person needs ~2000 kcal per day, how many pithas would that be? Use: energy = mass × energy_density.',
      successHint: 'Calorimetry is the bridge between chemistry and nutrition. Every food label in the world is based on these measurements. Understanding energy content lets you reason about diet, exercise, and metabolism quantitatively.',
    },
    {
      title: 'Food safety — bacterial growth curves',
      concept: `Food poisoning isn't random bad luck — it's predictable microbiology. Bacteria follow a well-defined **growth curve** with four phases:

1. **Lag phase**: bacteria adjust to new environment (0-2 hours). Low risk.
2. **Log (exponential) phase**: bacteria divide rapidly, doubling every 20-30 minutes. Risk increases fast.
3. **Stationary phase**: nutrients depleted, growth = death rate. Maximum population.
4. **Death phase**: waste products accumulate, population declines.

The **danger zone** for food is 5°C to 60°C — temperatures where most bacteria grow rapidly. The "2-hour rule": food left in the danger zone for more than 2 hours is unsafe.

Key foodborne bacteria:
- **Salmonella**: poultry, eggs. Doubling time ~25 min at 37°C
- **E. coli O157:H7**: ground beef. Produces Shiga toxin
- **Staphylococcus aureus**: human skin → food. Produces heat-stable toxin (cooking doesn't help once it's produced)
- **Clostridium botulinum**: anaerobic (no oxygen). Produces the most toxic substance known to science`,
      analogy: 'Bacterial growth is like a rumour spreading in a school. Lag phase: one person tells two friends. Log phase: each friend tells two more — suddenly the whole school knows. Stationary phase: everyone\'s already heard it. Death phase: people stop caring and the rumour dies. The "2-hour rule" is like catching the rumour before it goes viral.',
      storyConnection: 'Grandmother always said "eat pitha fresh" and "never leave it out overnight in summer." She didn\'t know about bacterial doubling times, but she knew from experience: food left in Assam\'s warm, humid climate spoils faster than in cool climates. At 35°C, bacteria double every ~20 minutes. After 4 hours, one bacterium becomes 4,096.',
      checkQuestion: 'Why is reheating food sometimes not enough to make it safe, even if you heat it above 75°C?',
      checkAnswer: 'Some bacteria produce heat-stable toxins. Staphylococcus aureus toxin survives boiling. Bacillus cereus toxin in rice survives reheating. Heating kills the bacteria but the toxin remains — and it\'s the toxin that makes you sick, not the bacteria itself. This is why prevention (keeping food cold) is more important than treatment (reheating).',
      codeIntro: 'Model the four-phase bacterial growth curve and the danger zone.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bacterial growth curve model
hours = np.linspace(0, 24, 500)

# Four-phase model using modified logistic with lag
def bacterial_growth(t, lag=2, growth_rate=0.7, carrying_capacity=1e9, initial=100):
    """Logistic growth with lag phase"""
    effective_t = np.maximum(0, t - lag)
    return carrying_capacity / (1 + ((carrying_capacity - initial) / initial) * np.exp(-growth_rate * effective_t))

# Growth at different temperatures
temps_and_rates = {
    '5°C (fridge)': {'lag': 8, 'rate': 0.05, 'color': '#3b82f6'},
    '20°C (room)': {'lag': 3, 'rate': 0.35, 'color': '#22c55e'},
    '37°C (body temp)': {'lag': 1, 'rate': 0.7, 'color': '#f59e0b'},
    '45°C (warm)': {'lag': 2, 'rate': 0.4, 'color': '#ef4444'},
}

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')

# Growth curves at different temperatures
ax1.set_facecolor('#111827')
for label, params in temps_and_rates.items():
    pop = bacterial_growth(hours, lag=params['lag'], growth_rate=params['rate'])
    ax1.plot(hours, pop, linewidth=2, color=params['color'], label=label)

ax1.set_yscale('log')
ax1.set_ylabel('Bacteria count (log scale)', color='white')
ax1.set_title('Bacterial Growth at Different Temperatures', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.set_ylim(10, 1e10)

# Mark dangerous threshold
ax1.axhline(1e6, color='#ef4444', linestyle=':', linewidth=1)
ax1.text(0.5, 2e6, 'Infectious dose (~10⁶)', color='#ef4444', fontsize=9)

# 2-hour rule visualization
ax1.axvline(2, color='gray', linestyle='--', linewidth=1)
ax1.text(2.2, 1e9, '2-hour\\nrule', color='gray', fontsize=8)

# Temperature danger zone
ax2.set_facecolor('#111827')
temp_range = np.linspace(-10, 100, 200)
growth_rate_curve = np.zeros_like(temp_range)

# Growth rate peaks around 37°C, drops to zero below 5 and above 60
for i, t in enumerate(temp_range):
    if 5 < t < 60:
        growth_rate_curve[i] = np.exp(-0.5 * ((t - 37) / 12) ** 2)

ax2.fill_between(temp_range, growth_rate_curve, alpha=0.3, color='#ef4444')
ax2.plot(temp_range, growth_rate_curve, color='#ef4444', linewidth=2)
ax2.axvspan(5, 60, alpha=0.1, color='#ef4444')
ax2.text(32, 0.85, 'DANGER ZONE\\n(5°C - 60°C)', ha='center', color='#ef4444', fontsize=11, fontweight='bold')

ax2.axvline(5, color='#3b82f6', linestyle='--', linewidth=1)
ax2.text(3, 0.5, '5°C', color='#3b82f6', fontsize=9, ha='right')
ax2.axvline(60, color='#f59e0b', linestyle='--', linewidth=1)
ax2.text(62, 0.5, '60°C', color='#f59e0b', fontsize=9)

ax2.set_xlabel('Temperature (°C)', color='white')
ax2.set_ylabel('Relative growth rate', color='white')
ax2.set_title('The Temperature Danger Zone', color='white', fontsize=12)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The 2-hour rule in numbers (starting from 100 bacteria at 37°C):")
for h in [0, 1, 2, 3, 4, 6]:
    pop = bacterial_growth(h, lag=1, growth_rate=0.7)
    print(f"  Hour {h}: {pop:,.0f} bacteria")
print()
print("At 37°C, bacteria can reach infectious dose in ~4 hours.")
print("At fridge temp (5°C), the same growth takes days.")`,
      challenge: 'Calculate the exact time it takes to reach 1,000,000 bacteria at 37°C starting from 100. Rearrange the logistic equation to solve for t. This is the math behind every food safety regulation.',
      successHint: 'Food safety is applied microbiology with real consequences: 48 million Americans get foodborne illness annually. Understanding growth curves transforms food safety from "rules to memorize" to "math you can calculate."',
    },
    {
      title: 'Industrial food processing — scaling Grandmother\'s recipe',
      concept: `Grandmother makes 50 pithas for Bihu. A factory makes 50,000 per day. The chemistry is the same; the engineering is completely different.

Industrial food processing involves:
- **Continuous mixing**: ingredients are fed in at one end, mixed product comes out the other (vs. Grandmother's batch mixing in a bowl)
- **Extrusion**: dough is forced through shaped dies at high pressure and temperature (think: pasta, cereal shapes, puffed snacks)
- **Spray drying**: liquid becomes powder by spraying into hot air (instant coffee, milk powder, spice mixes)
- **Retort processing**: sealed containers heated under pressure to sterilize (canned food, shelf-stable meals)
- **Modified atmosphere packaging (MAP)**: replacing air with nitrogen/CO₂ to extend shelf life

The challenge of scale-up isn't just "make a bigger pot." Heat transfer changes with volume: a large batch heats unevenly (hot outside, cold inside). Mixing dynamics change. Reaction times change. Every doubling of batch size requires re-optimization.

This is governed by **dimensional analysis**: surface area scales as r², but volume scales as r³. Double the pot radius → 4× surface area but 8× volume. Heat transfer per unit volume drops by half.`,
      analogy: 'Scaling a recipe is like scaling a campfire. A small fire (Grandmother\'s kitchen) heats evenly — everything\'s close to the flame. A bonfire (factory) has the outside burning while the inside is cold. Industrial engineering is the art of making bonfires that heat like campfires — through forced convection, thin layers, and continuous flow.',
      storyConnection: 'If Grandmother\'s pitha recipe were industrialized, every step would need engineering: the rice would be milled to exact particle size (consistency), the batter mixed in a planetary mixer (uniformity), portioned by a depositor (weight accuracy), fried in a continuous fryer (temperature control), and packaged in MAP (shelf life). Her intuition would become a Standard Operating Procedure.',
      checkQuestion: 'Why do mass-produced cookies taste different from homemade ones, even when the recipe is identical?',
      checkAnswer: 'Several reasons: 1) Industrial ovens have more uniform heat → less variation (no delightfully uneven edges). 2) Ingredients are standardized (exact fat melting points vs. whatever butter was available). 3) Mixing is more thorough (less texture variation). 4) Preservatives and emulsifiers are added for shelf life, which affect texture and flavour. 5) Time from oven to mouth is days, not minutes — staling begins immediately after baking.',
      codeIntro: 'Model the surface-area-to-volume ratio problem in scale-up.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Scale-up problem: surface area vs volume
# For a sphere (or roughly, a pot): SA = 4πr², V = (4/3)πr³
# SA/V ratio = 3/r → decreases as size increases

radii = np.linspace(0.05, 1.0, 100)  # meters (5cm to 1m)
surface_area = 4 * np.pi * radii**2
volume = (4/3) * np.pi * radii**3
sa_to_v = surface_area / volume

# Heat transfer rate is proportional to SA/V
# Time to heat center is proportional to r²

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# SA/V ratio
ax1.set_facecolor('#111827')
ax1.plot(radii * 100, sa_to_v, color='#f59e0b', linewidth=2)
ax1.fill_between(radii * 100, sa_to_v, alpha=0.15, color='#f59e0b')

# Mark kitchen vs factory scales
kitchen_r = 0.1  # 10cm pot radius
factory_r = 0.5  # 50cm tank radius
ax1.plot(kitchen_r * 100, 3/kitchen_r, 'o', color='#22c55e', markersize=10, zorder=5)
ax1.annotate(f'Kitchen pot\\n(SA/V = {3/kitchen_r:.0f}/m)', xy=(kitchen_r*100, 3/kitchen_r),
            xytext=(kitchen_r*100 + 10, 3/kitchen_r + 5), color='#22c55e', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#22c55e'))
ax1.plot(factory_r * 100, 3/factory_r, 'o', color='#ef4444', markersize=10, zorder=5)
ax1.annotate(f'Factory tank\\n(SA/V = {3/factory_r:.0f}/m)', xy=(factory_r*100, 3/factory_r),
            xytext=(factory_r*100 + 10, 3/factory_r + 3), color='#ef4444', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax1.set_xlabel('Radius (cm)', color='white')
ax1.set_ylabel('SA/V ratio (1/m)', color='white')
ax1.set_title('Surface-Area-to-Volume: The Scale-Up Problem', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Heating time comparison
ax2.set_facecolor('#111827')
# Time to heat center ∝ r² (Fourier's law)
heating_time = radii**2 / (0.05**2)  # normalized to smallest pot = 1

ax2.plot(radii * 100, heating_time, color='#ef4444', linewidth=2)
ax2.fill_between(radii * 100, heating_time, alpha=0.15, color='#ef4444')
ax2.set_xlabel('Radius (cm)', color='white')
ax2.set_ylabel('Relative heating time', color='white')
ax2.set_title('Time to Heat Center (quadratic with radius)', color='white', fontsize=12)
ax2.tick_params(colors='gray')

# Scale comparison
scales = ['Grandmother\\n(10cm pot)', 'Restaurant\\n(30cm pot)', 'Factory\\n(50cm tank)']
times_relative = [(0.1/0.05)**2, (0.3/0.05)**2, (0.5/0.05)**2]
ax2_inset = ax2.inset_axes([0.45, 0.4, 0.5, 0.5])
ax2_inset.set_facecolor('#111827')
ax2_inset.bar(scales, times_relative, color=['#22c55e', '#f59e0b', '#ef4444'])
ax2_inset.set_ylabel('Relative time', color='white', fontsize=8)
ax2_inset.tick_params(colors='gray', labelsize=7)
ax2_inset.set_title('Heating time comparison', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("The scale-up problem:")
print(f"  Kitchen pot (r=10cm): SA/V = {3/0.1:.0f}/m, heating time = 1×")
print(f"  Restaurant (r=30cm): SA/V = {3/0.3:.0f}/m, heating time = {(0.3/0.1)**2:.0f}×")
print(f"  Factory (r=50cm): SA/V = {3/0.5:.0f}/m, heating time = {(0.5/0.1)**2:.0f}×")
print()
print("Solution: industrial processes use thin layers, continuous flow,")
print("and forced convection to maintain high effective SA/V ratios.")`,
      challenge: 'A factory wants to fry pithas at the same rate as Grandmother (3 minutes per batch) but make 1000× more. If they can\'t make the fryer 1000× larger (scale-up problem), what design would you propose? Think: conveyor belt fryer with thin layer of oil.',
      successHint: 'The SA/V ratio problem appears everywhere in engineering: heat sinks in computers, drug delivery particles, chemical reactors, even animal body size (elephants overheat, mice lose heat too fast). Scale changes everything.',
    },
    {
      title: 'Molecular gastronomy — the science of avant-garde cooking',
      concept: `Molecular gastronomy is where food science meets art. It applies physics and chemistry techniques to create entirely new textures and experiences. The term was coined by Hungarian physicist Nicholas Kurti and French chemist Herve This in 1988.

Key techniques:
- **Spherification**: using sodium alginate and calcium chloride to create gel spheres that burst in your mouth (like caviar made from juice)
- **Gelification**: using agar, gellan gum, or methylcellulose to create gels with specific melting points
- **Sous vide**: vacuum-sealed food cooked in precisely controlled water baths (±0.1°C accuracy)
- **Foaming**: using lecithin or xanthan gum to create stable foams from any liquid
- **Cryogenic freezing**: liquid nitrogen (-196°C) for instant freezing (smooth ice cream, shattered herbs)

The science: each technique exploits a specific physical or chemical property. Spherification works because alginate (a polymer from seaweed) cross-links with calcium ions to form a gel membrane. The reaction happens at the surface of a droplet, creating a thin shell around a liquid center.

Imagine: a pitha that looks like a traditional til pitha but bursts with liquid jaggery when you bite it. That's spherification applied to Assamese cuisine.`,
      analogy: 'Molecular gastronomy is to traditional cooking what electronic music is to acoustic music. Both make "music" (food), but the tools are different. A synthesizer (spherification kit) can create sounds (textures) no acoustic instrument (pot and pan) ever could. Neither is "better" — they serve different purposes.',
      storyConnection: 'What if Grandmother\'s pitha met molecular gastronomy? Imagine: a til pitha sphere that\'s liquid inside (spherification), served on a foam of rice milk (foaming), with a dust of freeze-dried jaggery (cryogenic processing). The flavours are Assamese; the technique is 21st-century physics.',
      checkQuestion: 'Sous vide cooking holds food at exactly 56°C for hours. At that temperature, the food never gets hotter than 56°C. Why does this produce such different results from conventional cooking at 200°C?',
      checkAnswer: 'At 56°C, collagen in meat slowly converts to gelatin (tender) without squeezing out water (juicy). At 200°C, the outside reaches target temperature but overshoots — the outer layers are well done while the center might be perfect. Sous vide eliminates the temperature gradient: every point in the food reaches exactly 56°C and stays there. It\'s the difference between a precise scalpel and a sledgehammer.',
      codeIntro: 'Model the spherification process: gel thickness over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Spherification model
# Alginate + Calcium → gel membrane
# Gel thickness grows as sqrt(time) (diffusion-limited process)

time_seconds = np.linspace(0, 300, 200)  # 5 minutes
time_minutes = time_seconds / 60

# Gel thickness = k * sqrt(t)
# k depends on calcium concentration
concentrations = {
    '0.5% CaCl₂': {'k': 0.15, 'color': '#3b82f6'},
    '1.0% CaCl₂': {'k': 0.25, 'color': '#22c55e'},
    '2.0% CaCl₂': {'k': 0.40, 'color': '#f59e0b'},
    '5.0% CaCl₂': {'k': 0.65, 'color': '#ef4444'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Gel thickness over time
ax1.set_facecolor('#111827')
for label, params in concentrations.items():
    thickness = params['k'] * np.sqrt(time_seconds)
    ax1.plot(time_minutes, thickness, linewidth=2, color=params['color'], label=label)

# Mark ideal zone
ax1.axhspan(0.5, 1.5, alpha=0.1, color='#22c55e')
ax1.text(4, 1.0, 'Ideal: thin enough to burst,\\nthick enough to hold', color='#22c55e',
         fontsize=8, ha='right')

ax1.set_xlabel('Time in calcium bath (minutes)', color='white')
ax1.set_ylabel('Gel membrane thickness (mm)', color='white')
ax1.set_title('Spherification: Gel Growth Over Time', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Molecular gastronomy techniques comparison
ax2.set_facecolor('#111827')
techniques = ['Spherification', 'Sous vide', 'Foaming', 'Gelification', 'Cryo-freezing']
precision_temp = [2, 0.1, 5, 3, 1]  # °C precision needed
time_range = [30, 3600, 10, 300, 5]  # seconds typical process time

# Normalize for radar-like comparison
ax2_twin = ax2.twinx()

x = np.arange(len(techniques))
width = 0.35

bars1 = ax2.bar(x - width/2, precision_temp, width, color='#3b82f6', alpha=0.8, label='Temp precision (°C)')
bars2 = ax2_twin.bar(x + width/2, [np.log10(t) for t in time_range], width, color='#f59e0b', alpha=0.8, label='Process time (log₁₀ s)')

ax2.set_ylabel('Temperature precision (°C)', color='#3b82f6')
ax2_twin.set_ylabel('Process time (log₁₀ seconds)', color='#f59e0b')
ax2.set_title('Molecular Gastronomy: Precision Requirements', color='white', fontsize=12)
ax2.set_xticks(x)
ax2.set_xticklabels(techniques, rotation=25, ha='right', color='white', fontsize=8)
ax2.tick_params(axis='y', colors='#3b82f6')
ax2_twin.tick_params(axis='y', colors='#f59e0b')
ax2.tick_params(axis='x', colors='gray')

# Combined legend
lines1, labels1 = ax2.get_legend_handles_labels()
lines2, labels2 = ax2_twin.get_legend_handles_labels()
ax2.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Spherification timing guide (1% CaCl₂):")
for t_sec in [10, 30, 60, 120, 300]:
    thickness = 0.25 * np.sqrt(t_sec)
    print(f"  {t_sec:3d}s ({t_sec/60:.1f} min): {thickness:.2f}mm thick", end='')
    if 0.5 < thickness < 1.5:
        print(" ← IDEAL")
    elif thickness < 0.5:
        print(" (too thin, will break)")
    else:
        print(" (too thick, won't burst)")
print()
print("The √t relationship means: double the thickness requires 4× the time.")
print("This is diffusion-limited kinetics — the same math governs drug release,")
print("rust formation, and semiconductor doping.")`,
      challenge: 'If you want a gel membrane exactly 1.0mm thick using 1% CaCl₂ (k=0.25), how many seconds should you leave it in the calcium bath? Solve: 1.0 = 0.25 × √t for t.',
      successHint: 'Molecular gastronomy is where food science, physics, chemistry, and art converge. From Grandmother\'s intuitive cooking to precisely controlled spherification — the journey from Level 1 to Level 2 mirrors the journey from empirical tradition to quantitative science.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Food Technology — builds on Level 1 concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for food technology simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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