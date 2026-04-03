import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import ArkBuoyancyDiagram from '../diagrams/ArkBuoyancyDiagram';
import ArkCapacityDiagram from '../diagrams/ArkCapacityDiagram';
import BuoyancyDiagram from '../diagrams/BuoyancyDiagram';
import Volume3DDiagram from '../diagrams/Volume3DDiagram';
import BalanceScaleDiagram from '../diagrams/BalanceScaleDiagram';
import VariablesDiagram from '../diagrams/VariablesDiagram';

export default function NoahsArkLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Density — why some things sink and others float',
      concept: `Before we can understand how Noah's ark floats, we need one number: **density**. Density = mass / volume. It tells you how tightly packed a material is.

Water has a density of **1.0 g/cm³**. Anything denser sinks. Anything less dense floats. A rock (density ~2.5) sinks. Wood (density ~0.5) floats. Ice (density 0.92) floats — which is why icebergs exist.

In Python, we store density as a variable and compare objects to water. The code below builds a table of common materials and checks which ones float.`,
      analogy: 'Imagine packing a suitcase. If you stuff in heavy books, the suitcase is dense — lots of mass in a small space. If you pack fluffy pillows, same size but much less mass — low density. Density is just how much "stuff" is crammed into a given space.',
      storyConnection: 'Noah used gopher wood and pitch. Wood floats because its density is less than water. Pitch (tar) is slightly denser than water on its own, but spread as a thin waterproof coating, it adds mass without much volume — keeping the overall density of the ark well below 1.0 g/cm³.',
      checkQuestion: 'Steel has a density of 7.8 g/cm³ — nearly 8 times denser than water. So why do steel ships float?',
      checkAnswer: 'Because a ship is not a solid block of steel. It is a hollow shell. The density that matters is the OVERALL density — the total mass of steel divided by the total volume of the hull (including all the air inside). A hollow steel ship has an overall density far below 1.0 g/cm³, so it floats.',
      codeIntro: 'Compare densities of different materials to water.',
      code: `import numpy as np

# Material densities in g/cm³
materials = {
    "Balsa wood":   0.16,
    "Cork":         0.24,
    "Oak wood":     0.60,
    "Ice":          0.92,
    "Water":        1.00,
    "Bone":         1.85,
    "Granite":      2.65,
    "Iron":         7.87,
    "Gold":        19.30,
}

print("Material          Density   Floats?")
print("=" * 42)
for name, d in materials.items():
    floats = "YES" if d < 1.0 else "NO"
    symbol = "🚢" if d < 1.0 else "⬇️"
    print(f"{name:<18} {d:>5.2f}     {floats} {symbol}")

# Noah's ark: gopher wood (~0.55) + pitch coating (~0.02)
ark_density = 0.55
print(f"\\nArk hull density: ~{ark_density} g/cm³")
print(f"Floats with {(1.0 - ark_density)/1.0 * 100:.0f}% margin")`,
      challenge: 'Add "Aluminium" (2.70), "Pumice" (0.64), and "Milk" (1.03) to the dictionary. Which surprise you — does pumice (volcanic rock) really float?',
      successHint: 'Density is the gatekeeper of floating. Below 1.0 g/cm³ → float. Above 1.0 → sink. But the hollow-shape trick lets dense materials (steel, even concrete) make floating vessels.',
    },
    {
      title: 'Archimedes\' principle — the buoyant force',
      concept: `Here is the rule that governs every boat, submarine, and floating object on Earth:

**Buoyant force = weight of displaced water**

When you push an object into water, it shoves water aside. The water pushes back with a force equal to the weight of the water displaced. If that push exceeds the object's weight, the object floats.

The ark's hull displaces water as it settles into the flood. It sinks until the displaced water weighs exactly as much as the loaded ark. Then it stops sinking and floats.

The code calculates how deep the ark sits in the water (its **draft**) based on its total loaded weight.`,
      analogy: 'Step into a full bathtub. Water spills over the edge — you displaced it. The amount that spills out weighs roughly as much as the buoyant force pushing you up. This is literally what Archimedes discovered when he stepped into his bath and shouted "Eureka!"',
      storyConnection: 'The ark was loaded with thousands of animals plus food, water, and eight people. Every kilogram added increased the draft — the ark sank a little deeper. Noah needed the hull deep enough to carry the load, but not so deep that water poured over the sides. Naval architects call this the "freeboard" — the distance from waterline to deck edge.',
      checkQuestion: 'If you add 1,000 kg of cargo to a floating boat, how much deeper does it sink?',
      checkAnswer: 'It sinks until it displaces an additional 1,000 kg of water. For a flat-bottomed boat with area A square metres, the extra depth = 1000 / (A × 1000) metres. For a 10m × 5m boat, that is 1000 / 50000 = 0.02 metres (2 cm). Bigger boats barely notice extra cargo.',
      codeIntro: 'Calculate the ark\'s draft (how deep it sits in water) based on its cargo.',
      code: `import numpy as np

# Ark dimensions (metres)
length = 135
width = 22.5
height = 13.5

# Total volume
total_volume = length * width * height
print(f"Total volume: {total_volume:,.0f} m³")

# Estimate total loaded weight
hull_mass = 5000       # tonnes (wood + pitch)
animals_mass = 3000    # tonnes (70,000 animals)
food_water = 8000      # tonnes (year's supply)
people = 1             # tonnes (8 people, negligible)
total_mass = hull_mass + animals_mass + food_water + people

# Draft = total_mass / (length × width × water_density)
water_density = 1.0    # tonnes per m³ (freshwater)
draft = total_mass / (length * width * water_density)

freeboard = height - draft
print(f"\\nTotal loaded mass: {total_mass:,.0f} tonnes")
print(f"Draft (depth in water): {draft:.1f} m")
print(f"Freeboard (above water): {freeboard:.1f} m")
print(f"\\nSafety margin: {freeboard/height*100:.0f}% of hull above water")

if freeboard > 2:
    print("✓ Safe — plenty of freeboard")
else:
    print("⚠ Dangerously low freeboard!")`,
      challenge: 'What if the flood water was salty (density 1.025 tonnes/m³ instead of 1.0)? Change water_density and see how the draft changes. Salt water is denser — does the ark float higher or lower?',
      successHint: 'Archimedes\' principle is the foundation of all naval architecture. Draft, freeboard, displacement tonnage — every ship specification traces back to "buoyant force = weight of displaced fluid."',
    },
    {
      title: 'Volume and area — calculating the ark\'s capacity',
      concept: `The ark had three decks. Each deck is a flat rectangular floor: **135 m × 22.5 m = 3,037.5 m²**. Three decks = 9,112.5 m² of total floor space.

But not all of that is usable. You need corridors for walking, structural beams and walls, ventilation shafts, and access ramps between decks. A realistic usable fraction is about **60-70%** — similar to modern ships.

The code below calculates usable floor area, then divides it among animal pens of different sizes. This is the core of the capacity problem: can 70,000 animals fit in 9,000 square metres?`,
      analogy: 'Think about your bedroom. It might be 12 square metres total, but your bed takes 2 m², your desk 1 m², the door swing 1 m², and you need walking space. Your usable floor area is maybe 60% of the total. The ark is the same problem at ship scale.',
      storyConnection: 'Noah had to organise three decks for maximum efficiency. Heavy animals (cattle, hippos) on the lowest deck for ballast — keeping weight low stabilises the ship. Birds and small animals on the upper deck where ventilation is best. Supplies and medium animals in the middle. Every square metre mattered.',
      checkQuestion: 'If you halve the width of the ark (from 22.5m to 11.25m), what happens to the floor area?',
      checkAnswer: 'Floor area halves too — from 3,037.5 m² to 1,518.75 m² per deck. Area scales linearly with each dimension. But stability would suffer dramatically: a narrower ship is much more likely to roll and capsize. The 6:1 ratio was chosen for good reason.',
      codeIntro: 'Calculate usable floor area and pen allocation across three decks.',
      code: `import numpy as np

length = 135   # metres
width = 22.5
decks = 3

gross_area_per_deck = length * width
total_gross = gross_area_per_deck * decks
usable_fraction = 0.65  # 65% after corridors, structure
usable_area = total_gross * usable_fraction

print(f"Gross floor area per deck: {gross_area_per_deck:,.0f} m²")
print(f"Total gross (3 decks):     {total_gross:,.0f} m²")
print(f"Usable area (65%):         {usable_area:,.0f} m²")

# Pen sizes by animal category
categories = {
    "Tiny (<1kg)":     {"count": 31500, "pen_m2": 0.05},
    "Small (1-10kg)":  {"count": 24500, "pen_m2": 0.2},
    "Medium (10-100kg)": {"count": 8400, "pen_m2": 1.0},
    "Large (100-1000kg)": {"count": 4200, "pen_m2": 4.0},
    "Mega (>1000kg)":  {"count": 1400, "pen_m2": 15.0},
}

print(f"\\n{'Category':<22} {'Animals':>8} {'Pen m²':>8} {'Total m²':>10}")
print("=" * 52)
total_needed = 0
for cat, info in categories.items():
    area = info["count"] * info["pen_m2"]
    total_needed += area
    print(f"{cat:<22} {info['count']:>8,} {info['pen_m2']:>8.2f} {area:>10,.0f}")

print(f"\\nTotal pen area needed: {total_needed:,.0f} m²")
print(f"Usable area available: {usable_area:,.0f} m²")
diff = usable_area - total_needed
print(f"{'Surplus' if diff > 0 else 'Deficit'}: {abs(diff):,.0f} m²")`,
      challenge: 'The numbers above assume "species" level. Try using "kinds" (family level) — roughly 1,500 kinds instead of 35,000 species. Adjust the counts proportionally. Does the ark now have surplus space for food storage?',
      successHint: 'Volume and area calculations are the bread and butter of engineering. Every building, ship, warehouse, and space station starts with this: how much space do we have, and how much do we need?',
    },
    {
      title: 'Displacement calculations — how much can the ark carry?',
      concept: `The maximum weight a ship can carry is determined by its **displacement** — the total weight of water the hull can push aside before sinking.

For the ark: maximum displacement = length × width × max draft × water density. If the ark can safely use 10 metres of its 13.5m height as draft (keeping 3.5m of freeboard), then:

**Max displacement = 135 × 22.5 × 10 × 1.0 = 30,375 tonnes**

Subtract the hull weight, and you get the **cargo capacity** — the maximum weight of animals, food, and water combined.

The code builds a complete loading calculator with a visual load meter.`,
      analogy: 'A displacement calculation is like checking how much a backpack can hold before it gets too heavy to carry. The "backpack" is the hull, the "weight limit" is the buoyancy, and the "contents" are animals and supplies. Go over the limit and the backpack (ark) sinks.',
      storyConnection: 'Noah could not have known tonnes or displacement formulas. But experienced boat builders have always had an intuitive sense of loading limits — how far a vessel can sink before waves lap over the sides. The "Plimsoll line" painted on modern ships marks the maximum safe loading depth. Noah needed the ancient equivalent: load until the freeboard looks dangerously low, then stop.',
      checkQuestion: 'If the flood water was pure freshwater (1,000 kg/m³), but then became brackish (1,015 kg/m³) as it mixed with seawater, what happens to the ark\'s maximum cargo capacity?',
      checkAnswer: 'It increases by 1.5%. Denser water provides more buoyancy per cubic metre displaced. Max cargo = length × width × draft × (1015 - 1000) / 1000 extra tonnes per m³. For the ark, that is about 456 extra tonnes of capacity. Ships going from river to sea literally rise slightly as the denser saltwater supports them better.',
      codeIntro: 'Build a full ark loading calculator with cargo breakdown.',
      code: `import numpy as np
import matplotlib.pyplot as plt

length, width, height = 135, 22.5, 13.5
min_freeboard = 3.5  # metres above water
max_draft = height - min_freeboard
water_density = 1.0  # tonnes/m³

max_displacement = length * width * max_draft * water_density
hull_weight = 5000  # tonnes
max_cargo = max_displacement - hull_weight

# Cargo breakdown
cargo = {
    "Animals":     3000,
    "Grain/hay":   4000,
    "Water casks": 3500,
    "Bedding":      500,
    "Tools/misc":   200,
}
total_cargo = sum(cargo.values())
remaining = max_cargo - total_cargo

# Visual load meter
labels = list(cargo.keys()) + ["Remaining"]
sizes = list(cargo.values()) + [max(0, remaining)]
colors = ['#f59e0b','#22c55e','#3b82f6','#a855f7','#6b7280','#374151']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
ax1.barh(labels, sizes, color=colors[:len(labels)])
ax1.set_xlabel('Tonnes'); ax1.set_title('Cargo Breakdown')
for i, v in enumerate(sizes):
    ax1.text(v + 100, i, f'{v:,}t', va='center', fontsize=9, color='white')

# Draft gauge
pct = total_cargo / max_cargo * 100
ax2.barh(['Load'], [pct], color='#f59e0b', height=0.4)
ax2.barh(['Load'], [100-pct], left=[pct], color='#374151', height=0.4)
ax2.set_xlim(0, 100); ax2.set_xlabel('% of max cargo')
ax2.set_title(f'Load: {pct:.0f}% | Draft: {max_draft * pct/100:.1f}m')
plt.tight_layout(); plt.show()

print(f"Max displacement: {max_displacement:,.0f} tonnes")
print(f"Max cargo: {max_cargo:,.0f} tonnes")
print(f"Loaded cargo: {total_cargo:,.0f} tonnes")
print(f"Remaining capacity: {remaining:,.0f} tonnes")`,
      challenge: 'What if a storm adds 500 tonnes of rainwater pooling on the upper deck? Add it to the cargo and check if the ark is still safe. Also: what if some animals die during the voyage and are thrown overboard — how does that affect the draft?',
      successHint: 'Displacement is the master equation of naval architecture. Every ship has a maximum displacement, and the cargo planner\'s job is to stay under it while fitting everything needed aboard.',
    },
    {
      title: 'Stability — centre of gravity vs centre of buoyancy',
      concept: `A ship can float but still capsize if its weight is distributed badly. **Stability** depends on the relationship between two points:

- **Centre of gravity (CG)**: the average position of all the weight. Load heavy things high and CG rises.
- **Centre of buoyancy (CB)**: the centre of the displaced water volume. It is always below the waterline.

For a ship to be stable, the CG must be **below** a critical point called the **metacentre** (M). The distance from CG to M is called the **metacentric height** (GM). A positive GM means the ship self-rights when tilted. A negative GM means it rolls over.

The ark's strategy: heavy animals on the lowest deck (lowering CG), empty air above (raising CB relative to CG). The code simulates what happens when you move cargo between decks.`,
      analogy: 'Stand up and hold a heavy book above your head. You wobble. Now hold the same book at your waist. Much more stable. Your centre of gravity is lower, so you resist tipping. The ark works the same way — heavy cargo low, light cargo high.',
      storyConnection: 'Noah placed heavy animals (cattle, hippos, elephants) on the lowest deck. This was not just convenience — it was essential physics. An elephant on the upper deck would raise the centre of gravity dangerously. Ancient shipbuilders knew this instinctively: ballast stones go in the bottom, cargo above, people on top.',
      checkQuestion: 'Why do race cars have flat, low bodies instead of tall shapes like buses?',
      checkAnswer: 'Low centre of gravity. A race car\'s CG is only about 30cm above the ground, making it extremely resistant to rolling. A bus has a CG about 1.5m up, which is why buses can tip over on sharp curves. The ark needed bus-like stability in storm waves — achieved by keeping the heaviest cargo on the lowest deck.',
      codeIntro: 'Simulate stability by moving cargo between decks.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Ark deck heights (metres from keel)
deck_heights = {"Lower": 2.25, "Middle": 6.75, "Upper": 11.25}
hull_cg = 4.5  # hull weight centred at 4.5m
hull_mass = 5000

# Cargo on each deck (tonnes)
scenarios = {
    "Good: heavy low": {"Lower": 8000, "Middle": 2500, "Upper": 700},
    "Balanced":        {"Lower": 4000, "Middle": 4000, "Upper": 3200},
    "Bad: heavy high": {"Lower": 700,  "Middle": 2500, "Upper": 8000},
}

fig, axes = plt.subplots(1, 3, figsize=(14, 5))

for idx, (name, loads) in enumerate(scenarios.items()):
    total_mass = hull_mass + sum(loads.values())
    # Weighted average CG
    moment = hull_mass * hull_cg
    for deck, mass in loads.items():
        moment += mass * deck_heights[deck]
    cg = moment / total_mass

    # Approximate metacentre height
    # M = I/V + CB, where I = L*W³/12
    draft = total_mass / (135 * 22.5 * 1.0)
    cb = draft / 2
    I = 135 * 22.5**3 / 12
    V = 135 * 22.5 * draft
    bm = I / V
    metacentre = cb + bm
    gm = metacentre - cg

    ax = axes[idx]
    # Draw ark cross-section
    for deck, h in deck_heights.items():
        ax.barh(h, loads[deck]/200, height=3.5, color='#92400e',
                alpha=0.3 + loads[deck]/12000, left=0)
        ax.text(loads[deck]/200 + 1, h, f'{loads[deck]}t', fontsize=9,
                va='center', color='white')

    ax.axhline(cg, color='red', linestyle='--', label=f'CG = {cg:.1f}m')
    ax.axhline(metacentre, color='cyan', linestyle=':',
               label=f'M = {metacentre:.1f}m')
    ax.set_title(f'{name}\\nGM = {gm:.1f}m', fontsize=10,
                 color='lime' if gm > 0 else 'red')
    ax.set_ylabel('Height (m)'); ax.set_ylim(0, 14)
    ax.legend(fontsize=8)

plt.suptitle('Ark Stability: Centre of Gravity vs Metacentre', fontsize=13)
plt.tight_layout(); plt.show()`,
      challenge: 'Add a fourth scenario: "Elephants on roof" — put 5,000 tonnes on the upper deck and only 500 on the lower. What is the GM? At what point does GM go negative (unstable)?',
      successHint: 'Stability is life or death at sea. The principle is simple: keep heavy things low. The math (metacentric height) quantifies exactly how stable a vessel is. Every ship is designed with a positive GM under all loading conditions.',
    },
    {
      title: 'Putting it together — the ark loading simulator',
      concept: `Now let's build a complete simulation: given the ark's dimensions and a list of animals, calculate the total weight, the draft, the freeboard, the centre of gravity, and the stability — then produce a visual cross-section showing the loaded ark floating in water.

This brings together everything from the previous lessons:
- Density and floating (lesson 1)
- Buoyancy and draft (lesson 2)
- Volume and area (lesson 3)
- Displacement limits (lesson 4)
- Stability (lesson 5)

The code creates a single dashboard for the ark's engineering status.`,
      analogy: 'This is like the cockpit instrument panel of an aircraft. Pilots don\'t check altitude OR speed OR fuel — they check ALL of them at once. Our ark dashboard shows draft, freeboard, cargo load, stability, and space usage all together — because all of these interact.',
      storyConnection: 'When Noah finished loading the ark and God closed the door, the vessel was a fully loaded engineering system. Every variable — weight distribution, water supply, ventilation, stability — had to be within safe limits simultaneously. One failure (overloaded, unstable, insufficient food) and the mission fails. This is systems engineering: making everything work together.',
      checkQuestion: 'If the ark hit a large wave and tilted 15 degrees, what would happen to the animals on the upper deck?',
      checkAnswer: 'They would slide toward the low side, temporarily shifting the centre of gravity further off-centre and making the tilt worse. This is why cargo ships use partitions and tie-downs — and why Noah would have needed strong pens and barriers. A rolling ship with loose heavy cargo is a ship in mortal danger.',
      codeIntro: 'Build a complete ark engineering dashboard.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === ARK SPECS ===
L, W, H = 135, 22.5, 13.5
decks = 3
water_rho = 1.0  # t/m³

# === LOADING ===
hull_t = 5000
animals_t = 3000
food_t = 4000
water_t = 3500
misc_t = 500
total_t = hull_t + animals_t + food_t + water_t + misc_t

# === CALCULATIONS ===
draft = total_t / (L * W * water_rho)
freeboard = H - draft
max_disp = L * W * (H - 3.0) * water_rho  # 3m min freeboard
load_pct = total_t / max_disp * 100

# CG (heavy cargo low)
cg = (hull_t*4.5 + animals_t*3.0 + food_t*6.0 + water_t*2.5 + misc_t*10) / total_t
cb = draft / 2
bm = (L * W**3 / 12) / (L * W * draft)
gm = cb + bm - cg

# === DASHBOARD ===
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# 1. Cross-section with waterline
ax = axes[0, 0]
# Hull
hull = plt.Polygon([[0,0],[0,H],[W,H],[W,0]], fill=False,
                     edgecolor='#b45309', linewidth=2)
ax.add_patch(hull)
# Water
ax.axhspan(0, draft, color='#1e3a5f', alpha=0.4)
ax.axhline(draft, color='#60a5fa', linestyle='--', label=f'Waterline ({draft:.1f}m)')
# Deck lines
for d in [H/3, 2*H/3]:
    ax.axhline(d, color='#78350f', linewidth=0.5, alpha=0.5)
ax.axhline(cg, color='red', linestyle=':', label=f'CG ({cg:.1f}m)')
ax.set_xlim(-2, W+2); ax.set_ylim(-1, H+2)
ax.set_title('Cross Section'); ax.set_ylabel('Height (m)')
ax.legend(fontsize=8)

# 2. Cargo pie
ax = axes[0, 1]
labels = ['Hull', 'Animals', 'Food', 'Water', 'Misc']
sizes = [hull_t, animals_t, food_t, water_t, misc_t]
colors = ['#78350f', '#f59e0b', '#22c55e', '#3b82f6', '#6b7280']
ax.pie(sizes, labels=labels, colors=colors, autopct='%1.0f%%',
       textprops={'fontsize': 9, 'color': 'white'})
ax.set_title(f'Weight: {total_t:,}t')

# 3. Safety gauges
ax = axes[1, 0]
metrics = ['Load %', 'Freeboard (m)', 'GM (m)']
values = [load_pct, freeboard, gm]
safe = [load_pct < 90, freeboard > 3, gm > 0.5]
bar_colors = ['#22c55e' if s else '#ef4444' for s in safe]
ax.barh(metrics, values, color=bar_colors)
for i, v in enumerate(values):
    ax.text(v + 0.5, i, f'{v:.1f}', va='center', color='white')
ax.set_title('Safety Metrics')

# 4. Summary text
ax = axes[1, 1]
ax.axis('off')
summary = f"""ARK ENGINEERING REPORT
{'='*30}
Dimensions: {L} x {W} x {H} m
Volume: {L*W*H:,.0f} m³
Total weight: {total_t:,} tonnes
Draft: {draft:.1f} m
Freeboard: {freeboard:.1f} m
Load: {load_pct:.0f}% of max
CG: {cg:.1f} m from keel
GM: {gm:.1f} m ({"STABLE" if gm > 0 else "UNSTABLE"})
Status: {"✓ SEAWORTHY" if all(safe) else "⚠ CHECK LIMITS"}"""
ax.text(0.1, 0.95, summary, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', fontfamily='monospace', color='white')

plt.suptitle("Noah's Ark — Engineering Dashboard", fontsize=14,
             color='gold')
plt.tight_layout(); plt.show()`,
      challenge: 'Double the number of animals (6,000 tonnes instead of 3,000). Does the ark remain seaworthy? At what total weight does freeboard drop below 3 metres (danger zone)? Find the breaking point.',
      successHint: 'You just built a complete naval engineering simulation from first principles. Density, buoyancy, displacement, stability — all combined into one dashboard. This is how real ships are designed: calculate everything, visualise everything, then verify safety margins.',
    },
  ];

  const diagrams = [VariablesDiagram, ArkBuoyancyDiagram, Volume3DDiagram, BalanceScaleDiagram, BuoyancyDiagram, ArkCapacityDiagram];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Buoyancy, density, and displacement calculations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python to simulate ark engineering. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={diagrams[i] ? createElement(diagrams[i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
