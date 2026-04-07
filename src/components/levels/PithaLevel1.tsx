import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PithaLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is cooking? The chemistry of heat',
      concept: `When Grandmother slides a pitha into hot oil, something magical happens: raw batter transforms into golden, fragrant food. But this isn't magic — it's **chemistry**. Cooking is the application of thermal energy to food, causing chemical and physical changes in its molecules.

Heat does three main things to food:
- **Denatures proteins**: heat unravels the coiled-up protein molecules (like straightening a tangled phone cord), changing texture from slimy to firm
- **Gelatinizes starches**: starch granules absorb water and swell, turning from gritty powder into smooth gel (this is why rice flour batter becomes soft pitha)
- **Triggers chemical reactions**: new flavour and colour molecules form (Maillard reaction, caramelization)

Temperature matters enormously. Water boils at 100°C, oil can reach 200°C+, and a tandoor oven hits 480°C. Each temperature unlocks different reactions.`,
      analogy: 'Cooking is like running a chemistry lab where the beakers are pots, the reagents are ingredients, and heat is the catalyst. Every recipe is really a protocol — specific temperatures, times, and sequences that produce predictable chemical outcomes.',
      storyConnection: 'Grandmother never used a thermometer, but she knew exactly when the oil was hot enough by the sound of the sizzle. That sizzle is water in the batter hitting oil above 100°C and instantly vaporizing — a phase transition Grandmother understood intuitively through decades of practice.',
      checkQuestion: 'Why does deep-fried pitha have a crispy outside but soft inside, even though the whole thing is submerged in the same hot oil?',
      checkAnswer: 'The outside reaches oil temperature (170-190°C), which drives off water and creates a dry, crispy crust via the Maillard reaction. But the inside never exceeds 100°C because the water inside is still evaporating — and water can\'t get hotter than its boiling point while it\'s still liquid. The crust acts as a barrier, trapping steam inside, which cooks the interior gently.',
      codeIntro: 'Model how temperature changes inside a pitha during frying.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate temperature at surface vs center during deep frying
time = np.linspace(0, 10, 200)  # minutes

# Oil temperature
oil_temp = 180  # °C

# Surface temperature: rises quickly toward oil temp
surface_temp = oil_temp - (oil_temp - 25) * np.exp(-1.5 * time)

# Center temperature: rises slower, plateaus near 100°C (water boiling)
# Uses a logistic curve capped at ~100°C while water remains
center_temp = 100 / (1 + np.exp(-1.2 * (time - 3)))
center_temp = np.minimum(center_temp, 100)

fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

ax.axhline(oil_temp, color='#ef4444', linestyle=':', linewidth=1, label=f'Oil: {oil_temp}°C')
ax.axhline(100, color='#3b82f6', linestyle=':', linewidth=1, label='Water boiling: 100°C')
ax.plot(time, surface_temp, color='#f59e0b', linewidth=2, label='Surface temperature')
ax.plot(time, center_temp, color='#22c55e', linewidth=2, label='Center temperature')

ax.fill_between(time, surface_temp, center_temp, alpha=0.1, color='#f59e0b')

ax.set_xlabel('Time (minutes)', color='white')
ax.set_ylabel('Temperature (°C)', color='white')
ax.set_title('Deep Frying a Pitha: Surface vs Center Temperature', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(0, 200)

plt.tight_layout()
plt.show()

print("Key observations:")
print(f"  Surface reaches {surface_temp[-1]:.0f}°C (near oil temperature)")
print(f"  Center plateaus at ~100°C (water boiling point)")
print("  This temperature gap creates crispy outside + soft inside")
print("  The crust forms when surface water evaporates completely")`,
      challenge: 'What happens if you lower the oil temperature to 140°C? Change oil_temp and observe. This is why low-temperature frying makes greasy, soggy food — the crust forms too slowly.',
      successHint: 'Every time you cook, you\'re running a thermal physics experiment. Understanding heat transfer is the foundation of food science — and it explains why Grandmother\'s technique matters as much as her recipe.',
    },
    {
      title: 'The Maillard reaction — why food turns brown and delicious',
      concept: `That golden-brown colour on a perfectly fried pitha isn't just appearance — it's flavour. The **Maillard reaction** is a chemical reaction between amino acids (from proteins) and reducing sugars (like glucose) that occurs at temperatures above ~140°C.

The reaction produces:
- **Melanoidins**: brown-coloured polymers (the golden colour)
- **Hundreds of volatile flavour compounds**: the complex "cooked" smell
- **New textures**: the satisfying crunch of a crust

The Maillard reaction is NOT caramelization (that's pure sugar + heat, starts at ~160°C). And it's NOT burning (that's pyrolysis — breaking molecules into carbon). The Maillard reaction is the sweet spot between raw and burnt.

The reaction depends on: temperature (needs >140°C), moisture (too much water prevents it — water caps at 100°C), pH (slightly alkaline speeds it up), and time.`,
      analogy: 'The Maillard reaction is like a dance between two partners: amino acids and sugars. Below 140°C, they\'re standing on opposite sides of the room. At 140°C, they start dancing. At 180°C, they\'re doing complex choreography (hundreds of flavour compounds). Above 200°C, the dance floor catches fire (burning).',
      storyConnection: 'Grandmother always said, "Wait for the oil to speak before you add the pitha." She was waiting for the oil to reach Maillard temperature — around 170°C. Too cool and the pitha absorbs oil without browning. Too hot and it burns. The "voice" of the oil was her thermometer.',
      checkQuestion: 'Why does bread toast better when it\'s slightly stale (dry) than when it\'s fresh?',
      checkAnswer: 'Fresh bread has more moisture. Water must evaporate before the surface can exceed 100°C and reach Maillard temperatures (~140°C). Stale bread has less surface moisture, so it reaches Maillard temperatures faster and browns more evenly. This is also why patting meat dry before searing produces better browning.',
      codeIntro: 'Plot the Maillard reaction rate as a function of temperature.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Maillard reaction rate follows Arrhenius equation approximately
# rate = A * exp(-Ea / (R * T))
# Ea ≈ 50-100 kJ/mol for Maillard reaction

R = 8.314  # J/(mol·K)
Ea = 70000  # J/mol (activation energy)
A = 1e10   # pre-exponential factor (arbitrary units)

temp_C = np.linspace(20, 250, 200)
temp_K = temp_C + 273.15

rate = A * np.exp(-Ea / (R * temp_K))
rate_normalized = rate / rate.max() * 100  # normalize to percentage

fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

ax.plot(temp_C, rate_normalized, color='#f59e0b', linewidth=2)
ax.fill_between(temp_C, rate_normalized, alpha=0.15, color='#f59e0b')

# Mark key zones
zones = [
    (20, 100, 'No browning\\\n(water limited)', '#3b82f6', 0.15),
    (100, 140, 'Minimal\\\nreaction', '#22c55e', 0.15),
    (140, 180, 'Maillard\\\nsweet spot', '#f59e0b', 0.25),
    (180, 220, 'Intense\\\nbrowning', '#ef4444', 0.2),
    (220, 250, 'Burning\\\nzone', '#991b1b', 0.3),
]
for start, end, label, color, alpha in zones:
    ax.axvspan(start, end, alpha=alpha, color=color)
    ax.text((start + end) / 2, 85, label, ha='center', color='white', fontsize=8)

ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Reaction rate (% of max)', color='white')
ax.set_title('Maillard Reaction Rate vs Temperature', color='white', fontsize=13)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("The Maillard reaction is exponential with temperature:")
print(f"  At 100°C: {rate_normalized[np.argmin(np.abs(temp_C-100))]:.1f}% of max rate")
print(f"  At 140°C: {rate_normalized[np.argmin(np.abs(temp_C-140))]:.1f}% of max rate")
print(f"  At 170°C: {rate_normalized[np.argmin(np.abs(temp_C-170))]:.1f}% of max rate")
print(f"  At 200°C: {rate_normalized[np.argmin(np.abs(temp_C-200))]:.1f}% of max rate")
print()
print("This is the Arrhenius equation in action:")
print("rate = A × exp(-Ea / RT)")
print("Small temperature changes cause BIG rate changes.")`,
      challenge: 'Change Ea to 50000 (lower activation energy). The reaction starts at lower temperatures. Some foods brown faster because their amino acid-sugar combinations have lower activation energies. Which browning would be faster: milk powder or pure sugar?',
      successHint: 'The Arrhenius equation governs not just cooking, but all chemical reactions — from rusting to battery degradation to drug shelf life. Understanding it gives you power over temperature-dependent processes everywhere.',
    },
    {
      title: 'Fermentation — yeast and bacteria at work',
      concept: `Some pithas use fermented batter. Fermentation is one of the oldest biotechnologies — humans have been doing it for at least 9,000 years. It's the process where microorganisms (yeast, bacteria) break down sugars in the absence of oxygen.

**Alcoholic fermentation** (yeast): glucose → ethanol + CO₂
- The CO₂ bubbles make dough rise (bread, pitha batter)
- The ethanol evaporates during cooking

**Lactic acid fermentation** (bacteria): glucose → lactic acid
- Makes yogurt from milk, sauerkraut from cabbage
- The acid preserves food and creates tangy flavour
- Used in some Assamese fermented rice preparations

Key insight: fermentation is **anaerobic** (no oxygen needed). Yeast actually prefers aerobic respiration when oxygen is available — fermentation is their backup plan. But for bakers and brewers, that backup plan is everything.`,
      analogy: 'Fermentation is like a factory running on backup generators. Normal cellular respiration (with oxygen) is the main power grid — efficient, producing 36 ATP per glucose. Fermentation is the diesel generator — only 2 ATP per glucose, but it works when the main grid is down. The "exhaust" (CO₂ and ethanol) is what we actually want.',
      storyConnection: 'Grandmother would mix the rice flour batter the night before and cover it with a cloth. By morning, the batter had risen and developed a slightly sour smell. She was cultivating wild yeast and lactobacillus bacteria — the same organisms that make sourdough bread, just from the Assamese kitchen tradition.',
      checkQuestion: 'If fermentation produces CO₂ (gas), why doesn\'t the batter container explode overnight?',
      checkAnswer: 'The CO₂ gets trapped as small bubbles in the viscous batter (making it fluffy), but the cloth cover is porous — gas can slowly escape. If you sealed the container completely, pressure would build up. This is exactly how champagne works: fermentation in a sealed bottle creates the carbonation. Some homebrewers have had bottles explode from too much fermentation!',
      codeIntro: 'Simulate yeast population growth and CO₂ production during fermentation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Yeast growth and CO2 production model
# Yeast follow logistic growth (limited by sugar)

hours = np.linspace(0, 24, 200)

# Logistic growth parameters
carrying_capacity = 1e8  # max yeast cells/mL
initial_pop = 1e5       # starting cells/mL
growth_rate = 0.4       # per hour

# Logistic growth
yeast = carrying_capacity / (1 + ((carrying_capacity - initial_pop) / initial_pop) * np.exp(-growth_rate * hours))

# Sugar consumption (proportional to yeast population)
initial_sugar = 100  # grams/L
sugar = initial_sugar * (1 - yeast / carrying_capacity)
sugar = np.maximum(sugar, 0)

# CO2 production (proportional to sugar consumed)
co2 = (initial_sugar - sugar) * 0.49  # ~49% of sugar mass becomes CO2

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 9), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Yeast population
ax1.set_facecolor('#111827')
ax1.plot(hours, yeast / 1e6, color='#22c55e', linewidth=2)
ax1.fill_between(hours, yeast / 1e6, alpha=0.15, color='#22c55e')
ax1.set_ylabel('Yeast (millions/mL)', color='white')
ax1.set_title('Fermentation: Yeast Growth, Sugar Use, CO₂ Production', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Sugar remaining
ax2.set_facecolor('#111827')
ax2.plot(hours, sugar, color='#f59e0b', linewidth=2)
ax2.fill_between(hours, sugar, alpha=0.15, color='#f59e0b')
ax2.set_ylabel('Sugar remaining (g/L)', color='white')
ax2.tick_params(colors='gray')

# CO2 produced
ax3.set_facecolor('#111827')
ax3.plot(hours, co2, color='#3b82f6', linewidth=2)
ax3.fill_between(hours, co2, alpha=0.15, color='#3b82f6')
ax3.set_ylabel('CO₂ produced (g/L)', color='white')
ax3.set_xlabel('Time (hours)', color='white')
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fermentation timeline:")
for h in [0, 4, 8, 12, 16, 24]:
    idx = np.argmin(np.abs(hours - h))
    print(f"  Hour {h:2d}: {yeast[idx]/1e6:.1f}M yeast, {sugar[idx]:.1f}g sugar, {co2[idx]:.1f}g CO₂")
print()
print("The batter rises most between hours 4-12 (exponential yeast growth).")
print("After hour 16, sugar is nearly gone — fermentation slows.")`,
      challenge: 'What happens if you start with 10× more yeast (initial_pop = 1e6)? The batter rises faster but the flavour is different — why? Hint: slower fermentation allows lactic acid bacteria to contribute more complex flavours.',
      successHint: 'Fermentation is the foundation of biotechnology. The same logistic growth curves that model yeast also model antibiotic-producing bacteria in pharmaceutical factories and algae in biofuel reactors.',
    },
    {
      title: 'Starch chemistry — the secret architecture of rice flour',
      concept: `Rice flour — the main ingredient in pitha — is mostly **starch**. Starch is a polysaccharide: a long chain made of thousands of glucose molecules linked together. But not all starch is the same.

Starch comes in two forms:
- **Amylose**: straight chains of glucose (like uncooked spaghetti). Makes things firm and crispy.
- **Amylopectin**: branched chains (like a tree). Makes things sticky and chewy.

Different rice varieties have different ratios:
- **Sticky rice** (bora saul): ~0-5% amylose, ~95% amylopectin → very sticky
- **Regular rice** (joha): ~20-25% amylose → fluffy, separates
- **Long-grain rice**: ~25-30% amylose → firm, dry

When you add water and heat, starch undergoes **gelatinization**: the granules swell, absorb water, and the orderly crystal structure melts into a gel. This is why raw rice flour is gritty but cooked pitha is smooth.`,
      analogy: 'Amylose is like straight hair — it lies flat and separates easily. Amylopectin is like curly hair — it tangles and sticks together. The ratio of straight to curly determines the texture: all curly (sticky rice) or mostly straight (fluffy basmati). Cooking is like getting your hair wet — it changes shape temporarily.',
      storyConnection: 'Grandmother always said different rice for different pithas. Bora saul for til pitha (sticky, holds together around sesame filling). Joha for ghila pitha (needs to be firm enough to fry). She was selecting for amylose-to-amylopectin ratio without knowing the chemistry.',
      checkQuestion: 'Why does leftover rice become hard and dry in the fridge, then soft again when you reheat it?',
      checkAnswer: 'This is called retrogradation. When cooked starch cools, the amylose chains re-align into a crystalline structure, squeezing out water. The rice becomes hard. Reheating melts the crystals again (re-gelatinization) and the rice softens. Amylopectin retrogrades much more slowly — which is why sticky rice stays soft longer than regular rice.',
      codeIntro: 'Visualize starch gelatinization: how viscosity changes with temperature.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Starch gelatinization curve (viscosity vs temperature)
# Modeled as a modified sigmoid

temp = np.linspace(30, 100, 200)

# Gelatinization onset and peak temperatures differ by rice type
rice_types = {
    'Sticky rice (bora saul)': {'onset': 58, 'peak': 68, 'max_visc': 800, 'color': '#a855f7'},
    'Regular rice (joha)': {'onset': 65, 'peak': 75, 'max_visc': 500, 'color': '#22c55e'},
    'Long-grain rice': {'onset': 70, 'peak': 80, 'max_visc': 350, 'color': '#3b82f6'},
}

fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

for name, params in rice_types.items():
    # Rising phase (gelatinization)
    rising = params['max_visc'] / (1 + np.exp(-0.5 * (temp - params['onset'])))
    # Falling phase (granule breakdown at high temp)
    falling = 1 - 0.3 / (1 + np.exp(-0.3 * (temp - (params['peak'] + 10))))
    viscosity = rising * falling

    ax.plot(temp, viscosity, linewidth=2, label=name, color=params['color'])

# Mark key phases
ax.axvspan(55, 70, alpha=0.1, color='#f59e0b')
ax.text(62.5, 750, 'Gelatinization\\\nzone', ha='center', color='#f59e0b', fontsize=9)

ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Viscosity (arbitrary units)', color='white')
ax.set_title('Starch Gelatinization: Viscosity vs Temperature', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Starch gelatinization temperatures:")
for name, params in rice_types.items():
    print(f"  {name}:")
    print(f"    Onset: {params['onset']}°C | Peak: {params['peak']}°C | Max viscosity: {params['max_visc']}")
print()
print("Sticky rice gelatinizes at lower temperature and gets much thicker.")
print("This is why bora saul needs less cooking time and makes stickier pitha.")`,
      challenge: 'Add a fourth rice type: "waxy corn starch" with onset=62, peak=72, max_visc=1000. Corn starch is used in many sauces — why does its high viscosity make it a good thickener?',
      successHint: 'Starch chemistry is the foundation of food texture. Every sauce, every bread, every noodle is an exercise in controlling gelatinization and retrogradation. Grandmother\'s rice selection was materials science.',
    },
    {
      title: 'Nutrition basics — what\'s actually in a pitha?',
      concept: `A pitha is a delivery system for three macronutrients: **carbohydrates**, **proteins**, and **fats**. Each serves a different purpose:

- **Carbohydrates** (rice flour starch, sugar): primary energy source. 4 calories per gram. Broken down into glucose for cellular respiration.
- **Proteins** (from milk, coconut, sesame): building blocks for body structures. 4 calories per gram. Made of 20 different amino acids.
- **Fats** (from oil, coconut, ghee): concentrated energy storage. 9 calories per gram. Also needed for absorbing vitamins A, D, E, K.

A typical til pitha (sesame pitha) contains approximately:
- 65% carbohydrates (from rice flour + sugar)
- 12% protein (from sesame + rice)
- 18% fat (from sesame + frying oil)
- 5% water + fibre + micronutrients

The caloric density of traditional Assamese pithas makes biological sense: they were prepared for Bihu festivals during winter, when bodies needed extra energy for warmth.`,
      analogy: 'Your body is like a construction site. Carbohydrates are the electricity (energy to run everything). Proteins are the bricks (building material for structures). Fats are the fuel reserves in the storage shed (concentrated energy for later). You need all three, but in different amounts at different times.',
      storyConnection: 'Grandmother made different pithas for different occasions: lighter rice pithas for everyday, rich til pithas and narikol pithas for Bihu festivals. Intuitively, she was adjusting the macronutrient profile — more calories for cold-weather celebrations, lighter fare for regular meals.',
      checkQuestion: 'Fat has 9 calories per gram while carbohydrates and proteins have only 4. Why is fat so much more energy-dense?',
      checkAnswer: 'Fat molecules have many more C-H bonds than carbohydrates or proteins. Each C-H bond stores energy that\'s released during oxidation (metabolism). Carbohydrates already have some oxygen in their structure (C-H-O), so they\'re partially "pre-oxidized" and store less energy. Fat is essentially concentrated hydrogen — which is why it\'s also the most efficient way to store energy in a body.',
      codeIntro: 'Analyze the macronutrient composition of different pithas.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Macronutrient profiles of different pithas (approximate, per 100g)
pithas = {
    'Til Pitha': {'carb': 55, 'protein': 10, 'fat': 20, 'water': 12, 'fiber': 3},
    'Ghila Pitha': {'carb': 60, 'protein': 6, 'fat': 22, 'water': 8, 'fiber': 4},
    'Narikol Pitha': {'carb': 50, 'protein': 5, 'fat': 25, 'water': 15, 'fiber': 5},
    'Tekeli Pitha': {'carb': 68, 'protein': 7, 'fat': 8, 'water': 14, 'fiber': 3},
    'Sunga Pitha': {'carb': 72, 'protein': 8, 'fat': 5, 'water': 12, 'fiber': 3},
}

# Calculate calories
for p in pithas.values():
    p['calories'] = p['carb'] * 4 + p['protein'] * 4 + p['fat'] * 9

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Stacked bar chart
ax1.set_facecolor('#111827')
names = list(pithas.keys())
carbs = [pithas[n]['carb'] for n in names]
proteins = [pithas[n]['protein'] for n in names]
fats = [pithas[n]['fat'] for n in names]

x = np.arange(len(names))
width = 0.6

ax1.bar(x, carbs, width, label='Carbs', color='#22c55e')
ax1.bar(x, proteins, width, bottom=carbs, label='Protein', color='#3b82f6')
ax1.bar(x, fats, width, bottom=np.array(carbs) + np.array(proteins), label='Fat', color='#f59e0b')

ax1.set_ylabel('Grams per 100g', color='white')
ax1.set_title('Macronutrient Composition', color='white', fontsize=12)
ax1.set_xticks(x)
ax1.set_xticklabels(names, rotation=30, ha='right', color='white', fontsize=8)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Calorie comparison
ax2.set_facecolor('#111827')
cals = [pithas[n]['calories'] for n in names]
bars = ax2.barh(names, cals, color=['#a855f7', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6'])
ax2.set_xlabel('Calories per 100g', color='white')
ax2.set_title('Caloric Density', color='white', fontsize=12)
ax2.tick_params(colors='gray')
for bar, cal in zip(bars, cals):
    ax2.text(bar.get_width() + 5, bar.get_y() + bar.get_height()/2, f'{cal:.0f} kcal',
             va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Calorie breakdown by macronutrient:")
for name in names:
    p = pithas[name]
    carb_cal = p['carb'] * 4
    prot_cal = p['protein'] * 4
    fat_cal = p['fat'] * 9
    total = carb_cal + prot_cal + fat_cal
    print(f"  {name}: {total:.0f} kcal ({carb_cal/total*100:.0f}% carb, {prot_cal/total*100:.0f}% protein, {fat_cal/total*100:.0f}% fat)")`,
      challenge: 'Notice that Narikol Pitha has the most fat (coconut) and the most calories despite having less carbohydrate. Calculate what percentage of its calories come from fat alone. Why does this matter for diet planning?',
      successHint: 'Nutrition science is applied chemistry. Every food label, every diet plan, every hospital meal is calculated using these same macronutrient values. Grandmother\'s pithas are data points in a nutrition database.',
    },
    {
      title: 'Food preservation — keeping pitha fresh',
      concept: `Grandmother made extra pithas during Bihu because they had to last. Food preservation is the science of slowing or stopping the processes that cause food to spoil: **microbial growth**, **enzymatic reactions**, and **oxidation**.

Common preservation methods:
- **Drying**: removes water. Microbes need water to grow (water activity below 0.6 = safe). Sun-dried pitha lasts weeks.
- **Sugar/salt**: high concentrations draw water out of microbes via osmosis, killing them. Jaggery-coated pithas resist spoilage.
- **Frying**: the high heat kills surface microbes, and the oil coating seals out moisture and oxygen.
- **Fermentation**: beneficial bacteria produce acid, lowering pH below 4.6 where harmful bacteria can't grow.
- **Cold storage**: slows microbial reproduction (doesn't stop it). Every 10°C drop roughly halves bacterial growth rate.

The key concept is **water activity** (aw): the amount of "free" water available for microbial growth. Pure water = 1.0, honey = 0.6, crackers = 0.3. Most bacteria need aw > 0.9, most molds need > 0.7.`,
      analogy: 'Food preservation is like defending a castle. Microbes are the invaders. Drying is draining the moat (removing water). Salt and sugar are chemical weapons (osmotic stress). Heat is burning them with boiling oil from the ramparts. Cold is slowing their army\'s march. Fermentation is hiring friendly mercenaries (good bacteria) to fight the bad ones.',
      storyConnection: 'Grandmother stored ghila pithas in a tin layered with rice straw. The tin kept moisture and insects out, the straw absorbed any condensation, and the frying had already killed surface microbes. A multi-layer preservation strategy passed down through generations — empirical food science.',
      checkQuestion: 'Honey never spoils — archaeologists found 3,000-year-old honey in Egyptian tombs that was still edible. Why?',
      checkAnswer: 'Honey has extremely low water activity (~0.6), is acidic (pH 3.2-4.5), and contains hydrogen peroxide (produced by an enzyme called glucose oxidase). This triple defense makes it essentially sterile. Bacteria that land on honey have water sucked out of them by osmosis, are attacked by acid, and killed by peroxide. It\'s a biochemical fortress.',
      codeIntro: 'Model bacterial growth rate vs. water activity and temperature.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bacterial growth as function of water activity and temperature
water_activity = np.linspace(0.3, 1.0, 100)
temperatures = [5, 15, 25, 37]  # °C

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Growth rate vs water activity at different temperatures
ax1.set_facecolor('#111827')
colors_list = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

for temp, color in zip(temperatures, colors_list):
    # Growth rate model: zero below aw=0.9 for most bacteria
    # Increases with temperature (up to optimum)
    temp_factor = np.exp(-0.5 * ((temp - 37) / 15) ** 2)  # optimal at 37°C
    growth = np.maximum(0, (water_activity - 0.85) / 0.15) * temp_factor
    ax1.plot(water_activity, growth, linewidth=2, color=color, label=f'{temp}°C')

ax1.axvline(0.6, color='gray', linestyle=':', linewidth=1)
ax1.text(0.58, 0.8, 'Honey', color='gray', fontsize=8, ha='right')
ax1.axvline(0.85, color='gray', linestyle=':', linewidth=1)
ax1.text(0.83, 0.8, 'Salted fish', color='gray', fontsize=8, ha='right')

ax1.set_xlabel('Water Activity (aw)', color='white')
ax1.set_ylabel('Relative Growth Rate', color='white')
ax1.set_title('Bacterial Growth vs Water Activity', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Food preservation methods comparison
ax2.set_facecolor('#111827')
methods = ['Fresh pitha', 'Fried pitha', 'Sun-dried', 'Sugar-coated', 'Refrigerated', 'Frozen']
shelf_days = [1, 7, 30, 21, 5, 180]
colors_bars = ['#ef4444', '#f59e0b', '#22c55e', '#a855f7', '#3b82f6', '#06b6d4']

bars = ax2.barh(methods, shelf_days, color=colors_bars)
ax2.set_xlabel('Approximate shelf life (days)', color='white')
ax2.set_title('Pitha Preservation Methods', color='white', fontsize=12)
ax2.tick_params(colors='gray')
for bar, days in zip(bars, shelf_days):
    ax2.text(bar.get_width() + 2, bar.get_y() + bar.get_height()/2,
             f'{days} days', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Preservation strategies for pitha:")
print("  Fresh (uncooked): ~1 day (high aw, high microbial risk)")
print("  Fried: ~7 days (surface sterile, oil barrier)")
print("  Sun-dried: ~30 days (low aw, microbes can't grow)")
print("  Sugar-coated: ~21 days (osmotic stress on microbes)")
print("  Refrigerated: ~5 days (slowed growth, not stopped)")
print("  Frozen: ~180 days (growth essentially stopped)")`,
      challenge: 'Grandmother\'s tin storage method combined frying (heat kill) + tin (moisture barrier) + rice straw (desiccant). Estimate the combined shelf life. Why is a multi-method approach better than any single method?',
      successHint: 'Food preservation is applied microbiology. Every food safety regulation, every expiration date, every HACCP plan in a factory is based on these same principles — water activity, temperature, pH, and barrier methods.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Food Science & Chemistry — no prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for food science simulations. Click to start.</p>
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