import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import ArkEcosystemDiagram from '../diagrams/ArkEcosystemDiagram';
import CarbonCycleDiagram from '../diagrams/CarbonCycleDiagram';
import EnergyPyramidDiagram from '../diagrams/EnergyPyramidDiagram';
import WaterCycleDiagram from '../diagrams/WaterCycleDiagram';
import NitrogenCycleDiagram from '../diagrams/NitrogenCycleDiagram';
import FoodWebDiagram from '../diagrams/FoodWebDiagram';

export default function NoahsArkLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The oxygen budget — breathing in a sealed box',
      concept: `Every animal on the ark breathes oxygen and exhales CO2. In an open environment, plants replenish oxygen. On the ark, there are no large plants growing — so where does the oxygen come from?

The Bible mentions a **cubit-high opening** (about 45 cm) below the roofline, running around the vessel. This creates natural **stack ventilation**: warm CO2-rich air rises and exits through the top opening, while cooler fresh air flows in through gaps lower in the hull.

The question is: does this provide enough airflow? The code models oxygen consumption vs. ventilation rates to see if the ark's animals would suffocate.

Key numbers: a human consumes about **550 litres of O2 per day**. Animals vary by body mass. Total O2 demand for 70,000 animals is enormous.`,
      analogy: 'Open a window at the top and bottom of a room on a warm day. Hot air exits the top, cool air enters the bottom. This is stack-effect ventilation — no fans needed. The ark used the same principle: warm animal breath rises and exits through the roofline gap, pulling fresh air in below.',
      storyConnection: 'The ark was sealed with pitch to be waterproof, but it was not airtight. The roofline ventilation slit and gaps in the timber construction would allow air exchange. In rough seas, waves might block lower vents temporarily, but the stack effect through the roof opening would continue as long as the animals generated heat.',
      checkQuestion: 'If all the ventilation gaps were sealed (completely airtight ark), how long would the oxygen last for 70,000 animals?',
      checkAnswer: 'The ark contains about 41,000 m³ of air, which is about 21% oxygen = 8,610 m³ of O2. If animals consume roughly 30,000 litres (30 m³) of O2 per hour combined, the oxygen would last about 287 hours or ~12 days. But CO2 toxicity would hit much sooner — above 5% CO2 concentration is lethal, which would happen in about 2.5 days. Ventilation was absolutely essential.',
      codeIntro: 'Model oxygen consumption and ventilation for the ark.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# O2 consumption scales with metabolic rate
# ~0.5 litres O2 per kcal of metabolism
def o2_litres_per_day(mass_kg):
    kcal = 70 * mass_kg**0.75
    return kcal * 0.5  # litres of O2

# Animal categories on the ark
categories = [
    ("Tiny",   31500, 0.05),
    ("Small",  24500, 3.0),
    ("Medium",  8400, 50.0),
    ("Large",   4200, 300.0),
    ("Mega",    1400, 3000.0),
]

total_o2_day = 0
print(f"{'Category':<10} {'Animals':>8} {'O2/animal':>12} {'Total O2':>14}")
print("=" * 50)
for name, count, mass in categories:
    o2 = o2_litres_per_day(mass)
    total = count * o2
    total_o2_day += total
    print(f"{name:<10} {count:>8,} {o2:>10.1f} L {total:>12,.0f} L/day")
print(f"\\\nTotal O2 demand: {total_o2_day:,.0f} litres/day")
print(f"               = {total_o2_day/1000:,.0f} m³/day")

# Ark air volume and ventilation
ark_volume = 41000  # m³
o2_fraction = 0.21
total_o2_m3 = ark_volume * o2_fraction

# Stack ventilation estimate
# Vent opening: 135m × 0.45m × 2 sides = ~122 m² opening area
# Air velocity through stack effect: ~0.5-1.0 m/s
vent_area = 135 * 0.45 * 2  # m²
air_speed = 0.5  # m/s (conservative)
air_exchange_m3_per_hour = vent_area * air_speed * 3600
fresh_o2_per_day = air_exchange_m3_per_hour * 24 * 0.21

print(f"\\\n--- Ventilation Analysis ---")
print(f"Vent opening area: {vent_area:.0f} m²")
print(f"Air exchange: {air_exchange_m3_per_hour:,.0f} m³/hour")
print(f"Fresh O2 supply: {fresh_o2_per_day:,.0f} m³/day")
print(f"O2 demand: {total_o2_day/1000:,.0f} m³/day")
ratio = fresh_o2_per_day / (total_o2_day/1000)
print(f"Supply/demand ratio: {ratio:.1f}x")
print(f"{'✓ Sufficient ventilation' if ratio > 1 else '✗ Insufficient!'}")

# Plot O2 over time with and without ventilation
hours = np.arange(0, 72)
o2_no_vent = total_o2_m3 - (total_o2_day/1000/24) * hours
o2_with_vent = np.full_like(hours, total_o2_m3, dtype=float)
for i in range(1, len(hours)):
    consumed = total_o2_day/1000/24
    replenished = fresh_o2_per_day / 24
    o2_with_vent[i] = o2_with_vent[i-1] - consumed + replenished

plt.figure(figsize=(10, 5))
plt.plot(hours, o2_no_vent, 'r--', linewidth=2, label='No ventilation')
plt.plot(hours, np.clip(o2_with_vent, 0, None), 'g-', linewidth=2, label='With stack vent')
plt.axhline(ark_volume * 0.16, color='orange', linestyle=':', label='Danger: 16% O2')
plt.xlabel('Hours'); plt.ylabel('O2 in ark (m³)')
plt.title('Oxygen Budget: Sealed vs Ventilated Ark')
plt.legend(); plt.grid(alpha=0.3); plt.show()`,
      challenge: 'What if a storm forces the vents shut for 6 hours? How much does O2 drop? At what hour does O2 concentration fall below the 16% danger threshold? Add this scenario to the plot.',
      successHint: 'Oxygen budgeting is critical for any sealed environment — submarines, spacecraft, underground mines, and yes, arks. The math is simple (consumption vs. supply) but the consequences of getting it wrong are fatal.',
    },
    {
      title: 'Water budget — the heaviest cargo',
      concept: `Water is the ark's heaviest logistical challenge. Animals drink, food preparation needs water, and cleaning requires it. A year's supply for 70,000 animals is staggering.

But the ark had one advantage: it was floating on an ocean of water. The flood was fresh rainwater (at least initially). Collecting rainwater from the ark's roof (~3,000 m² of surface area) could supplement stored water.

The code models daily water consumption, storage requirements, and rainwater collection. This is the same mass-balance calculation used for the ISS water system.`,
      analogy: 'Imagine your family\'s water usage for a year with no plumbing and no tap. You would need to store about 150 litres per person per day × 365 days × family members. Now multiply that problem by 70,000 animals. The ark\'s water challenge is a household water problem scaled up by a factor of ten thousand.',
      storyConnection: 'The flood itself was the water supply — rain fell for 40 days and the ark floated for over a year. Collecting rainwater from the deck and roof would have been essential. Many ancient ships carried rain-catching sails and funnels for exactly this purpose. Noah may have had the wettest water supply problem in history: surrounded by water on all sides.',
      checkQuestion: 'The ISS recycles 93% of its water. If the ark could recycle just 50% of its water (collecting animal urine and condensation), how much less storage would it need?',
      checkAnswer: 'With 50% recycling, you need half as much initial water storage. Instead of ~12,800 m³ for a year, you need ~6,400 m³. That saves about 6,400 tonnes of weight and frees up 6,400 m³ of volume — nearly 16% of the ark\'s total capacity. Even primitive recycling (settling and filtering) would have enormous impact.',
      codeIntro: 'Model the ark\'s water budget: consumption, storage, and rainwater collection.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Water consumption by animal size (litres/day)
# Rough scaling: ~0.1 * mass^0.75 litres/day
def water_L_day(mass_kg):
    return 0.1 * mass_kg**0.75

categories = [
    ("Tiny",   31500, 0.05),
    ("Small",  24500, 3.0),
    ("Medium",  8400, 50.0),
    ("Large",   4200, 300.0),
    ("Mega",    1400, 3000.0),
]

daily_water = sum(count * water_L_day(mass) for _, count, mass in categories)
annual_water = daily_water * 365

print(f"Daily water demand: {daily_water:,.0f} litres ({daily_water/1000:.0f} m³)")
print(f"Annual water demand: {annual_water:,.0f} litres ({annual_water/1000:,.0f} m³)")
print(f"Weight of annual water: {annual_water/1000:,.0f} tonnes")

# Rainwater collection
roof_area = 135 * 22.5  # m² = 3037.5
# During 40 days of rain, assume 50mm/day collection
rain_days = 40
rain_mm_per_day = 50  # heavy rain
daily_rain_litres = roof_area * rain_mm_per_day  # 1mm on 1m² = 1 litre
total_rain = daily_rain_litres * rain_days

print(f"\\\n--- Rainwater Collection ---")
print(f"Roof area: {roof_area:,.0f} m²")
print(f"Rain collected in 40 days: {total_rain:,.0f} litres ({total_rain/1000:,.0f} m³)")
print(f"Days of water supply from rain: {total_rain/daily_water:.0f} days")

# Storage needed
stored_needed = annual_water - total_rain
stored_m3 = max(0, stored_needed / 1000)
print(f"\\\nStorage needed: {stored_m3:,.0f} m³")
print(f"That is {stored_m3 / 41000 * 100:.0f}% of ark volume")

# Timeline plot
days = np.arange(0, 366)
stored = np.zeros(366)
stored[0] = stored_m3 * 1000  # litres
for d in range(1, 366):
    consumed = daily_water
    rain = daily_rain_litres if d <= rain_days else 0
    stored[d] = stored[d-1] - consumed + rain

plt.figure(figsize=(10, 5))
plt.plot(days, stored/1000, 'cyan', linewidth=2)
plt.axhline(0, color='red', linestyle='--', label='Empty!')
plt.axvspan(0, 40, alpha=0.15, color='blue', label='Rain period')
plt.xlabel('Day of voyage'); plt.ylabel('Water remaining (m³)')
plt.title("Ark Water Budget Over One Year")
plt.legend(); plt.grid(alpha=0.3); plt.show()

if min(stored) > 0:
    print("\\\n✓ Water lasts the full year")
else:
    dry_day = np.argmax(stored <= 0)
    print(f"\\\n✗ Water runs out on day {dry_day}")`,
      challenge: 'Add a 50% water recycling rate: each day, 50% of consumed water is recovered. How does this change the timeline? Does the ark now have surplus water capacity?',
      successHint: 'Water budgeting is the most critical logistic for any closed system. The ISS spends more engineering effort on water recycling than almost any other system. For the ark, rainwater collection was the lifeline.',
    },
    {
      title: 'The food chain problem — who eats what?',
      concept: `On the ark, carnivores and herbivores lived side by side. This creates a unique food chain problem: you cannot let the lions eat the sheep, because you need both species to survive.

In nature, **food chains** flow from producers (plants) → primary consumers (herbivores) → secondary consumers (carnivores) → apex predators. Energy is lost at each level — roughly **90%** is lost as heat. This means you need about 10 kg of plants to support 1 kg of herbivore, and 10 kg of herbivore to support 1 kg of carnivore.

On the ark, the food chain is broken: there are no producers (growing plants). Everything is stored food. Carnivores must eat preserved meat, dried fish, or — as some scholars suggest — be fed a grain-based diet temporarily.

The code models the energy pyramid and calculates food storage by trophic level.`,
      analogy: 'Think of a food chain as a pyramid of coins. Start with 1,000 coins (plants). Herbivores take 100 (10%). Carnivores take 10. Apex predators get 1. Each level loses 90% to waste heat. This "10% rule" means carnivores need vastly more stored food (in plant-equivalent terms) than herbivores.',
      storyConnection: 'Noah had to pre-load enough food for every trophic level. Herbivores could eat grain and hay — shelf-stable for months. Carnivores are the challenge: dried meat, salted fish, or — controversially — a temporary vegetarian diet. Some biblical scholars note that before the flood, all animals were described as herbivorous. Whether or not you accept that, the logistics favour stored grain over stored meat.',
      checkQuestion: 'Why does the 10% rule mean that ecosystems can only support a few apex predators?',
      checkAnswer: 'Because of cumulative energy loss. To support 1 kg of lion, you need 10 kg of zebra, which needs 100 kg of grass. The energy pyramid narrows sharply at each level. This is why there are billions of insects, millions of mice, thousands of foxes, and only hundreds of wolves in a given area. The ark mirrors this: few large predators, many small herbivores.',
      codeIntro: 'Model the energy pyramid and food storage requirements by trophic level.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Trophic levels on the ark
levels = {
    "Herbivores (grain/hay)": {
        "animals": 50000, "avg_mass": 5, "food_type": "grain",
        "food_density": 3.5,  # kcal per gram
    },
    "Omnivores (mixed)": {
        "animals": 12000, "avg_mass": 15, "food_type": "mixed",
        "food_density": 3.0,
    },
    "Insectivores (dried insects)": {
        "animals": 5000, "avg_mass": 0.5, "food_type": "dried insects",
        "food_density": 4.0,
    },
    "Carnivores (dried meat/fish)": {
        "animals": 3000, "avg_mass": 50, "food_type": "dried meat",
        "food_density": 2.5,
    },
}

print(f"{'Level':<30} {'Animals':>8} {'Food/day':>10} {'Food/year':>12}")
print("=" * 65)
yearly_totals = {}
for name, info in levels.items():
    # Daily kcal need per animal
    kcal = 70 * info["avg_mass"]**0.75
    food_g = kcal / info["food_density"]
    daily_total_kg = info["animals"] * food_g / 1000
    yearly_t = daily_total_kg * 365 / 1000
    yearly_totals[name] = yearly_t
    print(f"{name:<30} {info['animals']:>8,} {daily_total_kg:>8,.0f} kg "
          f"{yearly_t:>10,.0f} t")

total_food_t = sum(yearly_totals.values())
print(f"\\\nTotal food storage: {total_food_t:,.0f} tonnes")
print(f"Volume at ~600 kg/m³ packing: {total_food_t*1000/600:,.0f} m³")

# Energy pyramid visualization
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Pyramid
labels = list(levels.keys())
values = [levels[k]["animals"] for k in labels]
colors = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444']
y_pos = range(len(labels))
for i, (label, val) in enumerate(zip(labels, values)):
    width = val / max(values) * 10
    ax1.barh(i, width, color=colors[i], height=0.6, left=(10-width)/2)
    ax1.text(5, i, f'{val:,}', ha='center', va='center',
             fontsize=10, color='white', fontweight='bold')
ax1.set_yticks(y_pos); ax1.set_yticklabels([l.split('(')[0] for l in labels],
                                             fontsize=9)
ax1.set_title('Trophic Pyramid (animal count)')
ax1.set_xlim(0, 10); ax1.set_xticks([])

# Food storage pie
ax2.pie(yearly_totals.values(), labels=[k.split('(')[0] for k in yearly_totals],
        colors=colors, autopct='%1.0f%%',
        textprops={'fontsize': 9, 'color': 'white'})
ax2.set_title(f'Food Storage: {total_food_t:,.0f} tonnes/year')
plt.tight_layout(); plt.show()`,
      challenge: 'What if all carnivores were switched to a grain diet? Recalculate with food_density = 3.5 for carnivores. How much total food tonnage is saved? This is why some ark researchers argue for a universal grain diet during the voyage.',
      successHint: 'The 10% rule and trophic pyramids explain why ecosystems are shaped the way they are — lots of plants, fewer herbivores, very few apex predators. On the ark, this structure determined how much of each food type to store.',
    },
    {
      title: 'Waste management — the unglamorous essential',
      concept: `Here is the least glamorous but most urgent problem on the ark: **waste**. Every animal produces faeces and urine daily. The amounts scale with body mass, and with 70,000 animals, the total is staggering.

Without waste removal, three things happen fast:
1. **Ammonia** from urine becomes toxic above 25 ppm — it would reach lethal levels within days
2. **Methane** from decomposing manure is explosive at 5-15% concentration
3. **Disease** — pathogens spread through faecal contact, especially in crowded conditions

The code calculates daily waste production, ammonia buildup, and the labour required for eight people to manage it all.`,
      analogy: 'Imagine you are camping with 70,000 friends and no plumbing. How quickly does the campsite become unlivable? Now imagine that campsite is on a rocking boat with no exits. Waste management is not optional — it is survival priority number one.',
      storyConnection: 'Noah\'s family of eight had to manage waste for 70,000 animals every single day for over a year. If each person worked 16 hours per day on waste duty alone, they would have about 6.5 seconds per animal pen per day. This requires clever design: sloped floors, drainage channels, and composting holds below deck.',
      checkQuestion: 'Modern dairy farms use automated scrapers and flush systems. If Noah had none of this technology, how could waste be managed?',
      checkAnswer: 'Gravity and slope. Sloped floors direct liquid waste to central channels that drain to the lowest deck (bilge). Solid waste can be swept or shovelled into the same channels. The bilge could be pumped or bailed overboard through scuppers (drain holes in the hull). This low-tech approach works — Roman aqueduct systems used pure gravity to move water and waste for centuries.',
      codeIntro: 'Calculate daily waste production and ammonia buildup on the ark.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Waste production: ~5-8% of body mass per day (faeces + urine)
def waste_kg_day(mass_kg):
    return 0.06 * mass_kg  # 6% of body mass

categories = [
    ("Tiny",   31500, 0.05),
    ("Small",  24500, 3.0),
    ("Medium",  8400, 50.0),
    ("Large",   4200, 300.0),
    ("Mega",    1400, 3000.0),
]

total_waste_day = 0
print(f"{'Category':<10} {'Animals':>8} {'Waste/animal':>14} {'Total':>12}")
print("=" * 50)
for name, count, mass in categories:
    w = waste_kg_day(mass)
    total = count * w
    total_waste_day += total
    print(f"{name:<10} {count:>8,} {w:>12.3f} kg {total:>10,.0f} kg")

print(f"\\\nTotal daily waste: {total_waste_day:,.0f} kg ({total_waste_day/1000:.0f} tonnes)")
print(f"Annual waste: {total_waste_day * 365 / 1000:,.0f} tonnes")

# Labour analysis: 8 people, 16 hours/day
workers = 8
hours_per_day = 16
total_pens = sum(count for _, count, _ in categories)
seconds_per_pen = (workers * hours_per_day * 3600) / total_pens
print(f"\\\n--- Labour Analysis ---")
print(f"Workers: {workers} | Hours/day: {hours_per_day}")
print(f"Time per pen: {seconds_per_pen:.1f} seconds")
print(f"That's barely enough to shovel and move on!")

# Ammonia buildup without ventilation
ark_volume_m3 = 41000
# ~0.5% of waste nitrogen becomes ammonia
# 1 kg waste produces ~2g ammonia
ammonia_g_per_day = total_waste_day * 2  # grams
ammonia_ppm_per_day = (ammonia_g_per_day / 17) * 24.45 / (ark_volume_m3 * 1000) * 1e6

days = np.arange(0, 30)
ammonia_no_vent = ammonia_ppm_per_day * days
ammonia_with_clean = ammonia_ppm_per_day * 0.1 * days  # 90% removed by cleaning

plt.figure(figsize=(10, 5))
plt.plot(days, ammonia_no_vent, 'r-', linewidth=2, label='No waste removal')
plt.plot(days, ammonia_with_clean, 'g-', linewidth=2, label='Daily cleaning (90% removal)')
plt.axhline(25, color='orange', linestyle='--', label='Toxic threshold (25 ppm)')
plt.axhline(300, color='red', linestyle=':', label='Lethal (300 ppm)')
plt.xlabel('Days'); plt.ylabel('Ammonia (ppm)')
plt.title('Ammonia Buildup: Cleaning vs No Cleaning')
plt.legend(); plt.grid(alpha=0.3)
plt.ylim(0, 400); plt.show()

no_clean_toxic = 25 / ammonia_ppm_per_day
print(f"\\\nWithout cleaning: toxic in {no_clean_toxic:.1f} days")
print(f"With daily cleaning: safe indefinitely (if 90% removed)")`,
      challenge: 'What if Noah composted the waste (reducing ammonia by 95%) and used it as fuel for heating? Calculate the energy content: dry manure produces ~15 MJ/kg. How much heating energy could the ark generate from its daily waste?',
      successHint: 'Waste management is the unglamorous backbone of any closed system. The ISS devotes enormous engineering to it. Ancient ships had bilge pumps and scuppers. The ark needed industrial-scale waste processing — and only eight workers to do it.',
    },
    {
      title: 'Temperature regulation — keeping a zoo comfortable',
      concept: `The ark housed animals from every climate zone: tropical parrots, arctic foxes, desert lizards, temperate deer. They all have different temperature needs. How do you keep everyone comfortable in one vessel?

The answer is **metabolic heat**. Every animal is a living heater. A cow produces about **1,000 watts** of body heat. 70,000 animals collectively generate enormous amounts of heat. The challenge is not warming the ark — it is preventing overheating.

The lower deck (packed with large animals) would be warmest. The upper deck (more ventilation) coolest. This natural temperature gradient could be used strategically: cold-adapted animals high, warm-adapted animals low.

The code calculates the heat budget and temperature distribution across decks.`,
      analogy: 'Pack 500 people into a gymnasium and close the doors. Within 30 minutes, the room is uncomfortably warm — even in winter. Each person radiates about 100 watts of heat. Now imagine 70,000 animals in a wooden ship. The problem is not cold — it is overheating.',
      storyConnection: 'During the flood, the ark was surrounded by water — a massive heat sink. The wooden hull would conduct heat outward, and the ventilation slit would release hot air. The combination of animal body heat, hull conduction, and ventilation created a passive temperature regulation system. Not perfect, but survivable.',
      checkQuestion: 'Why are large animals (elephants, hippos) placed on the lowest deck from a temperature perspective?',
      checkAnswer: 'Large animals generate the most heat. Hot air rises. By placing heat generators at the bottom, you create natural convection currents that push warm air upward and out through the roofline ventilation. Cold-adapted animals on the upper deck benefit from the cooler air near the vents. It is a natural stratification system.',
      codeIntro: 'Calculate the heat budget and temperature gradient across the ark\'s decks.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Metabolic heat: ~10 * mass^0.75 watts per animal
def heat_watts(mass_kg):
    return 10 * mass_kg**0.75

# Deck assignments
decks = {
    "Lower": {"animals": [("Mega", 1400, 3000), ("Large", 4200, 300)],
              "volume": 41000/3, "height_range": (0, 4.5)},
    "Middle": {"animals": [("Medium", 8400, 50), ("Small-part", 10000, 3)],
               "volume": 41000/3, "height_range": (4.5, 9.0)},
    "Upper": {"animals": [("Small-rest", 14500, 3), ("Tiny", 31500, 0.05)],
              "volume": 41000/3, "height_range": (9.0, 13.5)},
}

print(f"{'Deck':<10} {'Animals':>8} {'Heat (kW)':>10} {'Temp rise':>12}")
print("=" * 45)
for deck_name, info in decks.items():
    total_heat = sum(count * heat_watts(mass) for _, count, mass in info["animals"])
    total_count = sum(count for _, count, _ in info["animals"])
    # Temp rise: Q = m*c*dT, but for steady state: dT ≈ Q / (ventilation_rate * air_density * c_p)
    # Rough: each kW raises ~13,000 m³ of air by about 0.3°C with moderate ventilation
    temp_rise = total_heat / 1000 * 0.3
    print(f"{deck_name:<10} {total_count:>8,} {total_heat/1000:>8.0f} kW "
          f"{temp_rise:>10.1f} °C")

# Temperature profile
ambient = 15  # °C outside
heat_by_deck = []
for info in decks.values():
    h = sum(count * heat_watts(mass)/1000 for _, count, mass in info["animals"])
    heat_by_deck.append(h)

# Simple model: lower is hotter, stack effect carries heat up
temps = [ambient + h * 0.3 for h in heat_by_deck]
# Heat rises, so upper also gets some lower-deck heat
temps[1] += temps[0] * 0.1
temps[2] += temps[0] * 0.05 + temps[1] * 0.1

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Heat by deck
deck_names = list(decks.keys())
ax1.barh(deck_names, heat_by_deck, color=['#ef4444', '#f59e0b', '#3b82f6'])
ax1.set_xlabel('Heat output (kW)'); ax1.set_title('Metabolic Heat by Deck')

# Temperature profile
heights = [2.25, 6.75, 11.25]
ax2.plot(temps, heights, 'o-', color='#ef4444', linewidth=2, markersize=10)
ax2.axvline(ambient, color='cyan', linestyle='--', label=f'Outside: {ambient}°C')
ax2.set_xlabel('Temperature (°C)'); ax2.set_ylabel('Height in ark (m)')
ax2.set_title('Temperature Profile')
ax2.legend()

for i, (t, h) in enumerate(zip(temps, heights)):
    ax2.annotate(f'{t:.0f}°C — {deck_names[i]}', xy=(t, h),
                 xytext=(t+2, h), fontsize=10, color='white')

plt.tight_layout(); plt.show()
print(f"\\\nLower deck: {temps[0]:.0f}°C (tropical animals)")
print(f"Upper deck: {temps[2]:.0f}°C (temperate/cold animals)")
print(f"Temperature range: {temps[2]-temps[0]:.0f}°C difference between decks")`,
      challenge: 'What happens in a tropical climate where ambient temperature is 30°C instead of 15°C? Recalculate. At what point does the lower deck become dangerously hot (>40°C)? How much additional ventilation would be needed?',
      successHint: 'Temperature management in confined animal spaces is a real engineering discipline — modern livestock transport ships have forced ventilation systems for exactly this reason. The ark\'s natural ventilation and deck stratification was a primitive but functional approach.',
    },
    {
      title: 'The ISS comparison — modern closed systems',
      concept: `Let's compare the ark to the most advanced closed system humans have built: the **International Space Station**.

The ISS keeps 6 people alive in a sealed environment. The ark needed to keep 70,000+ animals alive. Both face the same five challenges: oxygen, water, food, waste, and temperature. But their solutions are vastly different.

The ISS uses technology: electrolysis splits water into O2, CO2 scrubbers remove carbon dioxide, water recyclers process urine, and solar panels power everything. The ark used nature: passive ventilation, stored food, rainwater collection, and gravity drainage.

The code creates a side-by-side comparison dashboard of both closed systems.`,
      analogy: 'The ISS is like a high-tech studio apartment for 6 people: everything recycled, everything measured, everything controlled by computers. The ark is like a massive barn floating on water: low-tech, gravity-powered, and managed by 8 people with shovels. Same problem, radically different solutions.',
      storyConnection: 'The ark was arguably the first closed-system life support challenge in recorded literature. The ISS is the latest. Between them lie submarines (since the 1800s), sealed biosphere experiments (Biosphere 2 in 1991), and proposed Mars habitats. Every closed system must solve the same five problems. The ark did it with wood and pitch; the ISS does it with titanium and solar cells.',
      checkQuestion: 'Biosphere 2 (1991) sealed 8 people in a 1.27-hectare glass enclosure for 2 years. It nearly failed. What went wrong?',
      checkAnswer: 'Oxygen levels dropped to dangerous levels (14.5%, equivalent to 4,080m altitude) because soil bacteria consumed more O2 than plants produced. CO2 was absorbed by concrete. Crop yields fell short, and the crew nearly starved. Ants and cockroaches overran the enclosure while most vertebrates died. Biosphere 2 proved that even with modern technology, closed ecosystems are extraordinarily hard to balance.',
      codeIntro: 'Build a side-by-side comparison of the ark and the ISS as closed systems.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Comparison data
metrics = [
    "Crew / passengers",
    "Duration (days)",
    "Volume (m³)",
    "O2 supply method",
    "Water recycling %",
    "Food source",
    "Waste method",
    "Power source",
    "Volume per occupant (m³)",
]

ark_data = [
    "8 + ~70,000 animals",
    "~370",
    "41,000",
    "Passive ventilation",
    "~0% (rainwater supplement)",
    "Pre-loaded stores",
    "Gravity drainage, shovels",
    "None (passive)",
    "0.59",
]

iss_data = [
    "3-6 astronauts",
    "Continuous (since 2000)",
    "916",
    "Electrolysis (O2 from H2O)",
    "93%",
    "Resupply missions",
    "Compacted, deorbited",
    "Solar panels (120 kW)",
    "153-305",
]

# Print comparison table
print(f"{'Metric':<30} {'Noah\'s Ark':<28} {'ISS'}")
print("=" * 85)
for m, a, i in zip(metrics, ark_data, iss_data):
    print(f"{m:<30} {a:<28} {i}")

# Efficiency comparison chart
fig, axes = plt.subplots(1, 3, figsize=(14, 4))

# Volume per occupant
ax = axes[0]
ax.bar(['Ark', 'ISS'], [0.59, 229], color=['#b45309', '#3b82f6'])
ax.set_title('Volume per occupant (m³)')
ax.set_ylabel('m³')
for i, v in enumerate([0.59, 229]):
    ax.text(i, v + 5, f'{v}', ha='center', color='white')

# Water recycling
ax = axes[1]
ax.bar(['Ark', 'ISS'], [5, 93], color=['#b45309', '#3b82f6'])
ax.set_title('Water recycling (%)')
ax.set_ylabel('%'); ax.set_ylim(0, 100)

# Duration
ax = axes[2]
ax.bar(['Ark', 'ISS'], [370, 9000], color=['#b45309', '#3b82f6'])
ax.set_title('Duration (days)')
ax.set_ylabel('Days')

plt.suptitle("Closed System Comparison: Ark vs ISS", fontsize=13)
plt.tight_layout(); plt.show()

# Key insight
print("\\\n--- Key Insight ---")
print("The ISS supports 6 people with $150 billion of technology.")
print("The ark needed to support 70,000+ organisms with wood and pitch.")
print("Volume per occupant: ISS gives each astronaut 229 m³.")
print("The ark gave each animal 0.59 m³ on average.")
print("The ISS is luxurious. The ark was survival-mode.")`,
      challenge: 'Design a hypothetical "Space Ark" for 1,000 species (2,000 animals) using ISS-level technology. Calculate: required volume (10 m³ per animal average), water needs with 93% recycling, solar power for electrolysis. What size spacecraft would you need? Compare it to the actual ISS.',
      successHint: 'Comparing the ark to the ISS reveals that closed-system life support is one of humanity\'s hardest engineering problems. The ark solved it primitively for a short duration. The ISS solves it expensively for a long duration. Neither is perfect. Future Mars missions will face the same challenge at an intermediate scale.',
    },
  ];

  const diagrams = [ArkEcosystemDiagram, WaterCycleDiagram, EnergyPyramidDiagram, NitrogenCycleDiagram, CarbonCycleDiagram, FoodWebDiagram];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Analyst
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Ecosystem modelling, closed systems, and the ISS comparison</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises model the ark as a closed ecosystem. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
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
            diagram={diagrams[i] ? createElement(diagrams[i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
