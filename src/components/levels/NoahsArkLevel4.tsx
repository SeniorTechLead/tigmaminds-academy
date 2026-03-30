import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import ArkBuoyancyDiagram from '../diagrams/ArkBuoyancyDiagram';
import ArkCapacityDiagram from '../diagrams/ArkCapacityDiagram';
import ArkEcosystemDiagram from '../diagrams/ArkEcosystemDiagram';
import ArkBiodiversityDiagram from '../diagrams/ArkBiodiversityDiagram';
import ActivityFloatTestDiagram from '../diagrams/ActivityFloatTestDiagram';
import Volume3DDiagram from '../diagrams/Volume3DDiagram';

export default function NoahsArkLevel4() {
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
      title: 'Capstone Part 1 — the ark data model',
      concept: `In this capstone level, we build a complete **Ark Capacity Calculator** from scratch. We combine naval architecture (buoyancy, stability) with biodiversity data (species counts, body masses) and life-support engineering (food, water, oxygen, waste).

The first step is building the **data model** — Python classes and dictionaries that represent every aspect of the ark and its passengers. Good data modelling means every calculation downstream is clean and reusable.

We define:
- **ArkSpecs**: dimensions, hull weight, ventilation area
- **AnimalCategory**: name, species count, average mass, diet type
- **SupplyCalc**: functions for food, water, and waste per animal per day

This is how real engineering software is structured: data models first, calculations second, visualisations third.`,
      analogy: 'Before building a house, you draw blueprints. Before writing a novel, you outline the plot. Before calculating the ark\'s capacity, you define the data structures. The data model IS the blueprint — it determines what questions you can answer.',
      storyConnection: 'Noah received his blueprint from God: exact dimensions, materials, and a passenger list ("two of every kind"). We are doing the same thing computationally — defining every parameter before running any calculation. The difference: Noah had divine specifications. We have Python dictionaries.',
      checkQuestion: 'Why use classes and dictionaries instead of just plain variables?',
      checkAnswer: 'Organisation and reusability. With 70,000 animals across dozens of categories, you cannot have a separate variable for each one. A dictionary or class groups related data together (name, mass, count, diet) so you can loop over categories, add new ones easily, and pass entire datasets to functions. This is the foundation of software engineering.',
      codeIntro: 'Build the complete data model for the Ark Capacity Calculator.',
      code: `import numpy as np

# === ARK SPECIFICATIONS ===
ark = {
    "length": 135,       # metres
    "width": 22.5,
    "height": 13.5,
    "decks": 3,
    "hull_mass_t": 5000, # tonnes
    "min_freeboard": 3.0,# metres
    "vent_area_m2": 135 * 0.45 * 2,  # roofline slit
    "usable_fraction": 0.65,
}
ark["volume"] = ark["length"] * ark["width"] * ark["height"]
ark["deck_area"] = ark["length"] * ark["width"] * ark["decks"]
ark["usable_area"] = ark["deck_area"] * ark["usable_fraction"]
ark["max_draft"] = ark["height"] - ark["min_freeboard"]
ark["max_displacement"] = ark["length"] * ark["width"] * ark["max_draft"] * 1.0
ark["max_cargo"] = ark["max_displacement"] - ark["hull_mass_t"]

# === ANIMAL CATEGORIES ===
animals = [
    {"name": "Tiny",   "species": 15750, "avg_mass_kg": 0.05,
     "pen_m2": 0.04, "diet": "seeds",     "deck": "Upper"},
    {"name": "Small",  "species": 12250, "avg_mass_kg": 3.0,
     "pen_m2": 0.15, "diet": "grain",     "deck": "Middle"},
    {"name": "Medium", "species":  4200, "avg_mass_kg": 50.0,
     "pen_m2": 1.0,  "diet": "hay/grain", "deck": "Middle"},
    {"name": "Large",  "species":  2100, "avg_mass_kg": 300.0,
     "pen_m2": 4.0,  "diet": "hay",       "deck": "Lower"},
    {"name": "Mega",   "species":   700, "avg_mass_kg": 3000.0,
     "pen_m2": 15.0, "diet": "hay/grain", "deck": "Lower"},
]

# === SUPPLY FUNCTIONS ===
def food_kg_day(mass_kg):
    return 70 * mass_kg**0.75 / 3000  # Kleiber's law

def water_L_day(mass_kg):
    return 0.1 * mass_kg**0.75

def waste_kg_day(mass_kg):
    return 0.06 * mass_kg

def heat_watts(mass_kg):
    return 10 * mass_kg**0.75

def o2_L_day(mass_kg):
    return 70 * mass_kg**0.75 * 0.5

# === VERIFY DATA MODEL ===
print("=== ARK SPECS ===")
for k, v in ark.items():
    if isinstance(v, float):
        print(f"  {k}: {v:,.1f}")
    else:
        print(f"  {k}: {v}")

print(f"\\n=== ANIMAL CATEGORIES ({len(animals)}) ===")
total_sp = sum(a["species"] for a in animals)
total_an = total_sp * 2
print(f"Total species: {total_sp:,} | Total animals: {total_an:,}")

print(f"\\n=== SUPPLY FUNCTIONS (test: 100 kg animal) ===")
test_mass = 100
print(f"  Food:  {food_kg_day(test_mass):.2f} kg/day")
print(f"  Water: {water_L_day(test_mass):.2f} L/day")
print(f"  Waste: {waste_kg_day(test_mass):.2f} kg/day")
print(f"  Heat:  {heat_watts(test_mass):.0f} W")
print(f"  O2:    {o2_L_day(test_mass):.0f} L/day")
print(f"\\n✓ Data model ready for calculations")`,
      challenge: 'Add a sixth category: "Aquatic-transitional" (species like crocodiles, turtles, seals) — 800 species, avg mass 30 kg, pen_m2 2.0, diet "fish", deck "Lower". How does this affect the total passenger count?',
      successHint: 'The data model is the foundation. With clean data structures, every subsequent calculation is a simple loop or function call. Messy data = messy code. Clean data = clean engineering.',
    },
    {
      title: 'Capstone Part 2 — the space allocation engine',
      concept: `With the data model built, we now solve the **space allocation problem**: can all the animals fit, and is there room left for supplies?

This is a **constraint satisfaction** problem. We have:
- Fixed constraint: 5,923 m² of usable floor space (three decks at 65%)
- Variable demands: pen areas for each animal category
- Additional needs: corridors (10%), supply storage, crew quarters

The algorithm: allocate pens first, then check remaining space for supplies. If pens exceed available space, flag the deficit and suggest compression strategies (stacking small-animal cages, using "kind" level instead of "species" level).`,
      analogy: 'This is like packing a moving truck. You know the truck volume. You know each piece of furniture\'s size. You pack the biggest items first, then fill gaps with small items. If everything does not fit, you either get a bigger truck or leave some items behind. The ark calculator does this mathematically.',
      storyConnection: 'Noah had to solve this problem physically: build pens, install barriers, create walkways, and designate storage areas — all before the animals arrived. Carpentry was his algorithm. Our Python code is the digital equivalent: allocate space, check constraints, adjust if needed.',
      checkQuestion: 'If you stack small-animal cages 4 high instead of placing them on the floor, how much floor space do you save?',
      checkAnswer: 'You reduce their floor footprint by 75%. If tiny and small animals originally need 1,260 + 3,675 = 4,935 m², stacking 4-high reduces this to about 1,234 m². That saves 3,701 m² — enough for thousands of additional supply pallets. Vertical stacking is the key to making the space work.',
      codeIntro: 'Build the space allocation engine for the ark.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# From Part 1
ark = {"length": 135, "width": 22.5, "height": 13.5, "decks": 3,
       "usable_fraction": 0.65}
ark["usable_area"] = ark["length"] * ark["width"] * ark["decks"] * ark["usable_fraction"]

animals = [
    {"name": "Tiny",   "count": 31500, "pen_m2": 0.04, "stack": 4},
    {"name": "Small",  "count": 24500, "pen_m2": 0.15, "stack": 3},
    {"name": "Medium", "count":  8400, "pen_m2": 1.0,  "stack": 1},
    {"name": "Large",  "count":  4200, "pen_m2": 4.0,  "stack": 1},
    {"name": "Mega",   "count":  1400, "pen_m2": 15.0, "stack": 1},
]

# === SPACE ALLOCATION ===
print("=== SPACE ALLOCATION ENGINE ===\\n")
corridor_pct = 0.10
crew_m2 = 50  # crew quarters
available = ark["usable_area"] * (1 - corridor_pct) - crew_m2

print(f"Total usable:  {ark['usable_area']:,.0f} m²")
print(f"- Corridors:   {ark['usable_area'] * corridor_pct:,.0f} m²")
print(f"- Crew:        {crew_m2:,.0f} m²")
print(f"= Available:   {available:,.0f} m²\\n")

pen_total = 0
supply_space = 0
print(f"{'Category':<10} {'Animals':>8} {'Raw m²':>10} {'Stacked':>10} {'Floor m²':>10}")
print("-" * 52)
for cat in animals:
    raw = cat["count"] * cat["pen_m2"]
    stacked = raw / cat["stack"]
    pen_total += stacked
    print(f"{cat['name']:<10} {cat['count']:>8,} {raw:>10,.0f} "
          f"{'×' + str(cat['stack']):>10} {stacked:>10,.0f}")

supply_space = available - pen_total
print(f"\\nPen floor area:    {pen_total:,.0f} m²")
print(f"Supply area:       {supply_space:,.0f} m²")
print(f"Utilisation:       {pen_total/available*100:.0f}%")

status = "✓ FITS" if supply_space > 0 else "✗ OVERFLOW"
print(f"\\nStatus: {status}")

# Visualization
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Stacked bar: pen area vs supply area
labels = [c["name"] for c in animals] + ["Supplies", "Corridors", "Crew"]
areas = [c["count"]*c["pen_m2"]/c["stack"] for c in animals]
areas += [max(0, supply_space), ark["usable_area"]*corridor_pct, crew_m2]
colors = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#a855f7',
          '#6b7280','#374151','#1f2937']
ax1.barh(labels, areas, color=colors[:len(labels)])
ax1.set_xlabel('Floor area (m²)'); ax1.set_title('Space Allocation')

# Deck layout (simplified top-down view)
ax2.set_xlim(0, 135); ax2.set_ylim(0, 22.5)
# Corridors
ax2.axhline(11.25, color='white', linewidth=0.5, linestyle='--')
# Zones
ax2.add_patch(plt.Rectangle((0, 0), 60, 22.5, color='#22c55e', alpha=0.3))
ax2.text(30, 11, 'Tiny+Small\\n(stacked cages)', ha='center', fontsize=9, color='white')
ax2.add_patch(plt.Rectangle((60, 0), 40, 22.5, color='#f59e0b', alpha=0.3))
ax2.text(80, 11, 'Medium\\nLarge', ha='center', fontsize=9, color='white')
ax2.add_patch(plt.Rectangle((100, 0), 20, 22.5, color='#ef4444', alpha=0.3))
ax2.text(110, 11, 'Mega', ha='center', fontsize=9, color='white')
ax2.add_patch(plt.Rectangle((120, 0), 15, 22.5, color='#6b7280', alpha=0.3))
ax2.text(127, 11, 'Store', ha='center', fontsize=9, color='white')
ax2.set_title('Single Deck Layout (top view)')
ax2.set_xlabel('Length (m)'); ax2.set_ylabel('Width (m)')

plt.tight_layout(); plt.show()`,
      challenge: 'What if you use "kind" (family) level instead of species — 1,500 families × 2 = 3,000 animals? Recalculate space allocation. How much surplus space do you get? What could you do with the extra room?',
      successHint: 'Space allocation is a classic optimisation problem. The stacking insight — small cages go vertical — is the key that makes the numbers work. Real warehouse logistics, shipping container planning, and spacecraft design all use similar algorithms.',
    },
    {
      title: 'Capstone Part 3 — the supply chain calculator',
      concept: `With animals allocated to pens, we now calculate the **supply chain**: how much food, water, and bedding does the ark need for 370 days?

This combines:
- **Kleiber's law** for food requirements
- **Allometric scaling** for water needs
- **Storage density** estimates for hay, grain, and water casks
- **Volume accounting** to verify everything fits

The output is a complete supply manifest: tonnes of each supply, volume required, and a day-by-day consumption timeline.`,
      analogy: 'This is like planning food for a year-long camping trip with 70,000 people. You calculate calories per person per day, multiply by days, convert to kilograms of food, then figure out how many trucks are needed to carry it all. The ark calculator does exactly this, but with Kleiber\'s law adjusting for animal size.',
      storyConnection: 'The Bible says Noah loaded food "for you and for them." The Hebrew word translated as "food" (oklah) covers all types of provisions. The planning required was immense: different diets for herbivores, insectivores, and carnivores, all preserved for over a year without refrigeration. Grain, dried fruit, salted meat, hay bales, and seed stores — a logistical feat by any standard.',
      checkQuestion: 'Hay has a storage density of about 150 kg/m³ (loosely baled). Grain is about 750 kg/m³. If both supply the same calories, which is more space-efficient to store?',
      checkAnswer: 'Grain is about 5 times more space-efficient by volume. 1 m³ of grain = 750 kg ≈ 2.6 million kcal. 1 m³ of hay = 150 kg ≈ 300,000 kcal. Grain provides nearly 9 times more calories per cubic metre. This is why grain was likely the primary stored food — it packs the most nutrition into the least space.',
      codeIntro: 'Build the complete supply chain calculator.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Supply functions
def food_kg_day(mass): return 70 * mass**0.75 / 3000
def water_L_day(mass): return 0.1 * mass**0.75

voyage_days = 370

categories = [
    {"name": "Tiny",   "count": 31500, "mass": 0.05, "diet": "seeds"},
    {"name": "Small",  "count": 24500, "mass": 3.0,  "diet": "grain"},
    {"name": "Medium", "count":  8400, "mass": 50.0, "diet": "hay/grain"},
    {"name": "Large",  "count":  4200, "mass": 300,  "diet": "hay"},
    {"name": "Mega",   "count":  1400, "mass": 3000, "diet": "hay/grain"},
]

# Storage densities (kg/m³)
storage_density = {"seeds": 700, "grain": 750, "hay/grain": 400, "hay": 150}

print("=== SUPPLY CHAIN MANIFEST ===\\n")
print(f"Voyage duration: {voyage_days} days\\n")
print(f"{'Category':<10} {'Food/day':>10} {'Water/day':>10} "
      f"{'Food total':>12} {'Water total':>12}")
print("=" * 60)

total_food_t = 0; total_water_t = 0; total_food_vol = 0
food_by_cat = {}

for cat in categories:
    food_d = cat["count"] * food_kg_day(cat["mass"])
    water_d = cat["count"] * water_L_day(cat["mass"])
    food_total = food_d * voyage_days / 1000  # tonnes
    water_total = water_d * voyage_days / 1000
    food_vol = food_total * 1000 / storage_density[cat["diet"]]
    total_food_t += food_total
    total_water_t += water_total
    total_food_vol += food_vol
    food_by_cat[cat["name"]] = food_total
    print(f"{cat['name']:<10} {food_d:>8,.0f} kg {water_d:>8,.0f} L "
          f"{food_total:>10,.0f} t {water_total:>10,.0f} t")

# Rainwater offset (40 days × 3037.5 m² × 50mm/day)
rain_offset = 3037.5 * 0.05 * 40 / 1000  # tonnes
net_water = total_water_t - rain_offset

print(f"\\n{'TOTALS':<10} {'':>10} {'':>10} "
      f"{total_food_t:>10,.0f} t {total_water_t:>10,.0f} t")
print(f"Rainwater offset: {rain_offset:,.0f} t")
print(f"Net water storage: {net_water:,.0f} t")
print(f"Food volume: {total_food_vol:,.0f} m³")
print(f"Water volume: {net_water:,.0f} m³")
print(f"Total supply volume: {total_food_vol + net_water:,.0f} m³")
print(f"Ark total volume: 41,000 m³")
print(f"Supply fraction: {(total_food_vol + net_water)/41000*100:.0f}%")

# Timeline: supplies remaining
days = np.arange(0, voyage_days + 1)
daily_food = sum(c["count"] * food_kg_day(c["mass"]) for c in categories) / 1000
daily_water = sum(c["count"] * water_L_day(c["mass"]) for c in categories) / 1000
food_remain = total_food_t - daily_food * days
water_remain = np.zeros(len(days))
water_remain[0] = net_water
for d in range(1, len(days)):
    rain = 3037.5 * 0.05 / 1000 if d <= 40 else 0
    water_remain[d] = water_remain[d-1] - daily_water + rain

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
ax1.plot(days, food_remain, 'gold', linewidth=2)
ax1.axhline(0, color='red', linestyle='--')
ax1.set_xlabel('Day'); ax1.set_ylabel('Food (tonnes)')
ax1.set_title('Food Remaining'); ax1.grid(alpha=0.3)

ax2.plot(days, water_remain, 'cyan', linewidth=2)
ax2.axhline(0, color='red', linestyle='--')
ax2.axvspan(0, 40, alpha=0.1, color='blue', label='Rain period')
ax2.set_xlabel('Day'); ax2.set_ylabel('Water (tonnes)')
ax2.set_title('Water Remaining'); ax2.legend(); ax2.grid(alpha=0.3)

plt.suptitle('Supply Chain Timeline', fontsize=13)
plt.tight_layout(); plt.show()`,
      challenge: 'Add a "spoilage" factor: 0.1% of food spoils per day (cumulative). How much extra food must be loaded to account for spoilage over 370 days? At what spoilage rate does the food run out before day 370?',
      successHint: 'Supply chain calculation is logistics engineering. Armies, hospitals, space missions, and yes, floating zoos all face this problem: how much of each supply, stored how, consumed at what rate, over what duration? The math is straightforward; the scale is what makes it hard.',
    },
    {
      title: 'Capstone Part 4 — the stability and safety checker',
      concept: `Our calculator needs a **safety module** — checking that the loaded ark meets all engineering requirements simultaneously:

1. **Buoyancy**: total weight < max displacement
2. **Freeboard**: waterline height leaves enough hull above water
3. **Stability**: centre of gravity is below the metacentre (GM > 0)
4. **Ventilation**: O2 supply exceeds O2 demand
5. **Supply sufficiency**: food and water last the full voyage

If any check fails, the calculator flags it and suggests remedies. This is how real ship certification works — the vessel must pass ALL safety checks before sailing.`,
      analogy: 'This is like a pre-flight checklist for an aircraft. Fuel? Check. Controls? Check. Weather? Check. Every item must pass. One failure = no takeoff. The ark safety checker works the same way: every metric must be in the green zone.',
      storyConnection: 'When God closed the door of the ark, every safety parameter had to be within limits. The hull had to be watertight (pitch coating). The weight had to be within buoyancy limits. The ventilation had to work. The food had to last. It was a pass/fail moment with no second chances. Our safety checker simulates that moment computationally.',
      checkQuestion: 'If one safety metric fails but all others pass, should the ark sail?',
      checkAnswer: 'No. Safety systems work on an AND logic — ALL checks must pass. A ship with perfect buoyancy but insufficient food will starve. A ship with plenty of food but negative GM will capsize. Real certification requires every metric to be within safe limits simultaneously. This is why engineering has safety factors: you design for more capacity than you think you need.',
      codeIntro: 'Build the comprehensive safety checker for the loaded ark.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === COMPLETE ARK MODEL ===
L, W, H = 135, 22.5, 13.5
hull_t = 5000
min_freeboard = 3.0

# Load summary from Parts 1-3
animals_t = 3200   # total animal mass
food_t = 4100      # total food stores
water_t = 3800     # net water stores
misc_t = 400       # bedding, tools
total_t = hull_t + animals_t + food_t + water_t + misc_t

# === SAFETY CHECKS ===
checks = {}

# 1. Buoyancy
max_disp = L * W * (H - min_freeboard) * 1.0
checks["Buoyancy"] = {
    "value": total_t,
    "limit": max_disp,
    "unit": "tonnes",
    "pass": total_t <= max_disp,
    "detail": f"{total_t:,.0f}t loaded vs {max_disp:,.0f}t max"
}

# 2. Freeboard
draft = total_t / (L * W * 1.0)
freeboard = H - draft
checks["Freeboard"] = {
    "value": freeboard,
    "limit": min_freeboard,
    "unit": "m",
    "pass": freeboard >= min_freeboard,
    "detail": f"{freeboard:.1f}m vs {min_freeboard:.1f}m minimum"
}

# 3. Stability (GM)
cg = (hull_t*4.5 + animals_t*2.5 + food_t*6 + water_t*2 + misc_t*10) / total_t
cb = draft / 2
bm = (L * W**3 / 12) / (L * W * draft)
gm = cb + bm - cg
checks["Stability (GM)"] = {
    "value": gm,
    "limit": 0.5,
    "unit": "m",
    "pass": gm >= 0.5,
    "detail": f"GM = {gm:.1f}m (need > 0.5m)"
}

# 4. Ventilation
o2_demand_m3 = 720  # approximate total O2 m³/day from L3
vent_area = L * 0.45 * 2
o2_supply = vent_area * 0.5 * 3600 * 24 * 0.21 / 1000
checks["Ventilation"] = {
    "value": o2_supply,
    "limit": o2_demand_m3,
    "unit": "m³ O2/day",
    "pass": o2_supply >= o2_demand_m3,
    "detail": f"{o2_supply:,.0f} supplied vs {o2_demand_m3:,.0f} needed"
}

# 5. Food duration
daily_food = food_t / 370  # simplified
food_days = food_t / (daily_food if daily_food > 0 else 1)
checks["Food supply"] = {
    "value": food_days,
    "limit": 370,
    "unit": "days",
    "pass": food_days >= 370,
    "detail": f"{food_days:.0f} days supply vs 370 needed"
}

# 6. Water duration
daily_water = water_t / 370
water_days = water_t / (daily_water if daily_water > 0 else 1)
checks["Water supply"] = {
    "value": water_days,
    "limit": 370,
    "unit": "days",
    "pass": water_days >= 370,
    "detail": f"{water_days:.0f} days vs 370 needed"
}

# === PRINT REPORT ===
print("=" * 60)
print(f"{'NOAH\\'S ARK — SAFETY CERTIFICATION REPORT':^60}")
print("=" * 60)
all_pass = True
for name, check in checks.items():
    status = "PASS ✓" if check["pass"] else "FAIL ✗"
    if not check["pass"]: all_pass = False
    print(f"\\n  [{status}] {name}")
    print(f"         {check['detail']}")

print("\\n" + "=" * 60)
verdict = "SEAWORTHY — CLEARED TO SAIL" if all_pass else "NOT CLEARED — FIX FAILURES"
print(f"  VERDICT: {verdict}")
print("=" * 60)

# === DASHBOARD ===
fig, axes = plt.subplots(2, 3, figsize=(14, 8))
axes = axes.flatten()

for idx, (name, check) in enumerate(checks.items()):
    ax = axes[idx]
    pct = min(check["value"] / check["limit"] * 100, 150)
    color = '#22c55e' if check["pass"] else '#ef4444'
    ax.barh([''], [pct], color=color, height=0.4)
    ax.axvline(100, color='white', linestyle='--', linewidth=1)
    ax.set_xlim(0, 150)
    ax.set_title(name, fontsize=10, color=color)
    ax.text(pct/2, 0, f'{check["value"]:.0f} {check["unit"]}',
            ha='center', va='center', fontsize=9, color='white')

plt.suptitle(f"Safety Dashboard — {'ALL PASS' if all_pass else 'CHECK FAILURES'}",
             fontsize=14, color='lime' if all_pass else 'red')
plt.tight_layout(); plt.show()`,
      challenge: 'Increase animal mass to 6,000 tonnes (simulating larger average species). Which safety checks fail first? Adjust food and water proportionally. At what total tonnage does the ark become unsafe?',
      successHint: 'The safety checker is the crown jewel of the calculator. Real ships, aircraft, and spacecraft all have systems like this — automated checks that verify ALL safety parameters before departure. You just built one from first principles.',
    },
    {
      title: 'Capstone Part 5 — sensitivity analysis',
      concept: `Engineers do not just calculate a single answer — they ask "what if?" hundreds of times. This is **sensitivity analysis**: systematically varying each input parameter to see how it affects the output.

Key questions for the ark:
- How does the number of species affect feasibility?
- What if the voyage is longer or shorter?
- What if we use "kind" (family) instead of "species"?
- How much does water recycling help?

The code sweeps each variable across a range and plots the result. This reveals which parameters matter most — the **sensitive** variables where small changes have big effects.`,
      analogy: 'When baking, some ingredients are sensitive: a little too much salt ruins the dish, but extra flour barely matters. Sensitivity analysis finds the "salt" variables — the ones where small changes cause big problems. For the ark, those are the variables you must get right.',
      storyConnection: 'The biblical account gives specific dimensions but not specific passenger counts. Sensitivity analysis lets us ask: "At what number of species does the ark become infeasible?" and "How much does the definition of kind matter?" These are not theological questions — they are engineering questions with mathematical answers.',
      checkQuestion: 'If the ark\'s length were increased by 10% (to 148.5m) but width and height stayed the same, how would capacity change?',
      checkAnswer: 'Volume increases by 10% (linearly with length). Max displacement increases by 10%. Floor area increases by 10%. But stability changes too — a longer ship has a different metacentric height. Overall capacity improves roughly 10%, but the hull weight also increases. The net benefit is about 7-8% more cargo capacity. Length is a moderate sensitivity variable.',
      codeIntro: 'Run sensitivity analysis on the key ark parameters.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Base case
base = {
    "species": 35000,
    "voyage_days": 370,
    "water_recycle_pct": 0,
    "ark_length": 135,
    "cubit_cm": 45,
}

def calc_feasibility(species, voyage_days, water_recycle, length):
    width = length / 6  # maintain 6:1 ratio
    height = length / 10
    volume = length * width * height
    max_cargo = length * width * (height - 3) * 1.0 - 5000

    animals = species * 2
    animal_mass = animals * 5  # avg 5 kg (skewed small)

    food_t = sum(
        animals * frac * (70 * mass**0.75 / 3000) * voyage_days / 1000
        for frac, mass in [(0.45, 0.05), (0.35, 3), (0.12, 50), (0.06, 300), (0.02, 3000)]
    )
    water_t = sum(
        animals * frac * (0.1 * mass**0.75) * voyage_days / 1000
        for frac, mass in [(0.45, 0.05), (0.35, 3), (0.12, 50), (0.06, 300), (0.02, 3000)]
    ) * (1 - water_recycle / 100)

    total_cargo = animal_mass / 1000 + food_t + water_t
    margin = (max_cargo - total_cargo) / max_cargo * 100
    return margin  # positive = feasible

# Sweep each parameter
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# 1. Species count
ax = axes[0, 0]
sp_range = np.arange(1000, 50000, 500)
margins = [calc_feasibility(s, 370, 0, 135) for s in sp_range]
ax.plot(sp_range/1000, margins, 'gold', linewidth=2)
ax.axhline(0, color='red', linestyle='--')
ax.axvline(35, color='cyan', linestyle=':', label='35K species')
ax.set_xlabel('Species (thousands)'); ax.set_ylabel('Cargo margin %')
ax.set_title('Species Count'); ax.legend(fontsize=8); ax.grid(alpha=0.3)

# 2. Voyage duration
ax = axes[0, 1]
day_range = np.arange(30, 730, 10)
margins = [calc_feasibility(35000, d, 0, 135) for d in day_range]
ax.plot(day_range, margins, 'cyan', linewidth=2)
ax.axhline(0, color='red', linestyle='--')
ax.axvline(370, color='gold', linestyle=':', label='370 days')
ax.set_xlabel('Voyage days'); ax.set_title('Duration'); ax.legend(fontsize=8)
ax.grid(alpha=0.3)

# 3. Water recycling
ax = axes[1, 0]
recycle_range = np.arange(0, 96, 1)
margins = [calc_feasibility(35000, 370, r, 135) for r in recycle_range]
ax.plot(recycle_range, margins, 'lime', linewidth=2)
ax.axhline(0, color='red', linestyle='--')
ax.set_xlabel('Water recycling %'); ax.set_title('Recycling Impact')
ax.grid(alpha=0.3)

# 4. Ark length (maintaining ratios)
ax = axes[1, 1]
len_range = np.arange(80, 200, 2)
margins = [calc_feasibility(35000, 370, 0, l) for l in len_range]
ax.plot(len_range, margins, '#a855f7', linewidth=2)
ax.axhline(0, color='red', linestyle='--')
ax.axvline(135, color='gold', linestyle=':', label='Biblical size')
ax.set_xlabel('Ark length (m)'); ax.set_title('Size Impact')
ax.legend(fontsize=8); ax.grid(alpha=0.3)

plt.suptitle('Sensitivity Analysis: What Makes or Breaks the Ark?', fontsize=14)
plt.tight_layout(); plt.show()

# Find breakpoints
for s in range(1000, 50000, 100):
    if calc_feasibility(s, 370, 0, 135) < 0:
        print(f"\\nSpecies breakpoint: ~{s:,} (infeasible beyond this)")
        break
print(f"At 1,500 families: margin = {calc_feasibility(1500, 370, 0, 135):.0f}%")
print(f"At 35,000 species: margin = {calc_feasibility(35000, 370, 0, 135):.0f}%")
print(f"With 50% recycling: margin = {calc_feasibility(35000, 370, 50, 135):.0f}%")`,
      challenge: 'Add a fifth sensitivity variable: cubit size. Some scholars argue a cubit was 52.5 cm (Egyptian royal cubit) instead of 45 cm. Sweep cubit from 40 to 55 cm, recalculate ark dimensions, and plot the feasibility margin. How much does cubit definition matter?',
      successHint: 'Sensitivity analysis reveals that the "kind" vs "species" question dominates everything else. At family level (1,500 kinds), the ark has enormous surplus capacity. At species level (35,000), it is marginal or infeasible. The definition of "kind" is the single most sensitive parameter.',
    },
    {
      title: 'Capstone Part 6 — the final report',
      concept: `The last step in any engineering project is the **report**: a comprehensive summary of all findings, presented clearly for decision-makers.

Our final code generates a multi-panel dashboard that includes:
- Ark cross-section with loaded cargo
- Safety certification status
- Supply timeline
- Sensitivity summary
- Feasibility verdict under different assumptions

This is the deliverable — the output that Noah's chief engineer would present before loading begins. It answers: "Can we do this, and under what conditions?"`,
      analogy: 'An engineering report is like a doctor\'s complete diagnosis. Not just "you are healthy" but blood pressure, heart rate, test results, risk factors, and recommendations — all in one document. Our ark report does the same: every metric, every check, one verdict.',
      storyConnection: 'The ark story is one of faith meeting physics. Noah trusted the blueprint he was given. Our analysis quantifies what that blueprint could achieve. Whether you read the story literally or allegorically, the engineering analysis stands on its own: the dimensions given produce a remarkably capable vessel. The 6:1 ratio, the three-deck layout, the ventilation design — these are sound engineering principles, whatever their source.',
      checkQuestion: 'If you were writing this report for a real client, what would be the single most important number to highlight?',
      checkAnswer: 'The cargo margin — the percentage of maximum capacity that remains after loading everything aboard. A positive margin means the project is feasible. A negative margin means it is not. All other numbers feed into this one metric. In our analysis, the margin depends critically on whether "kind" means species or family. Highlighting this uncertainty is the most honest thing an engineer can do.',
      codeIntro: 'Generate the complete Ark Engineering Report.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec

# === FINAL REPORT DATA ===
L, W, H = 135, 22.5, 13.5
hull_t, min_fb = 5000, 3.0

scenarios = {
    "Species level (35K)": {"species": 35000, "recycle": 0},
    "Species + 50% recycle": {"species": 35000, "recycle": 50},
    "Family level (1.5K)": {"species": 1500, "recycle": 0},
    "Family + 50% recycle": {"species": 1500, "recycle": 50},
}

def full_analysis(species, recycle_pct):
    animals = species * 2
    cats = [(0.45, 0.05), (0.35, 3), (0.12, 50), (0.06, 300), (0.02, 3000)]
    animal_t = sum(animals * f * m / 1000 for f, m in cats)
    food_t = sum(animals * f * 70 * m**0.75 / 3000 * 370 / 1000 for f, m in cats)
    water_t = sum(animals * f * 0.1 * m**0.75 * 370 / 1000 for f, m in cats)
    water_t *= (1 - recycle_pct / 100)
    total = hull_t + animal_t + food_t + water_t
    draft = total / (L * W)
    fb = H - draft
    max_cargo = L * W * (H - min_fb) - hull_t
    margin = (max_cargo - (total - hull_t)) / max_cargo * 100
    return {
        "animals": animals, "animal_t": animal_t,
        "food_t": food_t, "water_t": water_t,
        "total_t": total, "draft": draft, "freeboard": fb,
        "margin": margin, "feasible": margin > 0
    }

# === GENERATE REPORT ===
fig = plt.figure(figsize=(16, 10))
gs = GridSpec(3, 4, figure=fig, hspace=0.4, wspace=0.3)

# 1. Scenario comparison (top row, full width)
ax = fig.add_subplot(gs[0, :])
names = list(scenarios.keys())
results = [full_analysis(**s) for s in scenarios.values()]
margins = [r["margin"] for r in results]
colors = ['#22c55e' if m > 0 else '#ef4444' for m in margins]
bars = ax.barh(names, margins, color=colors, height=0.5)
ax.axvline(0, color='white', linewidth=2)
for bar, m in zip(bars, margins):
    ax.text(m + (2 if m > 0 else -8), bar.get_y() + 0.25,
            f'{m:.0f}%', va='center', fontsize=11, color='white', fontweight='bold')
ax.set_xlabel('Cargo margin (%)')
ax.set_title('FEASIBILITY UNDER DIFFERENT ASSUMPTIONS', fontsize=13, fontweight='bold')

# 2. Weight breakdown for base case
ax = fig.add_subplot(gs[1, 0:2])
r = results[0]
labels = ['Hull', 'Animals', 'Food', 'Water']
sizes = [hull_t, r["animal_t"], r["food_t"], r["water_t"]]
cols = ['#78350f', '#f59e0b', '#22c55e', '#3b82f6']
ax.pie(sizes, labels=labels, colors=cols, autopct='%1.0f%%',
       textprops={'color': 'white', 'fontsize': 9})
ax.set_title(f'Weight: {r["total_t"]:,.0f}t (species level)')

# 3. Cross section
ax = fig.add_subplot(gs[1, 2:4])
# Hull outline
ax.plot([0, 0, W, W, 0], [0, H, H, 0, 0], 'b-', linewidth=2, color='#b45309')
# Water
r0 = results[0]
ax.axhspan(0, r0["draft"], xmin=0, xmax=1, color='#1e3a5f', alpha=0.5)
ax.axhline(r0["draft"], color='#60a5fa', linestyle='--', linewidth=1)
# Decks
for d in [H/3, 2*H/3]:
    ax.axhline(d, color='#78350f', linewidth=0.5)
ax.text(W/2, H/6, 'Heavy animals', ha='center', color='white', fontsize=9)
ax.text(W/2, H/2, 'Supplies + medium', ha='center', color='white', fontsize=9)
ax.text(W/2, 5*H/6, 'Small + birds', ha='center', color='white', fontsize=9)
ax.set_xlim(-2, W+2); ax.set_ylim(-1, H+2)
ax.set_title(f'Cross Section — draft {r0["draft"]:.1f}m')

# 4. Key findings text
ax = fig.add_subplot(gs[2, :])
ax.axis('off')
report = """
FINDINGS:
1. At SPECIES level (35,000 species, 70,000 animals): the ark is at or beyond capacity.
   Cargo margin is {m0:.0f}%. {'Feasible but tight.' if results[0]['feasible'] else 'Infeasible without modifications.'}

2. At FAMILY level (1,500 families, 3,000 animals): the ark has {m2:.0f}% surplus capacity.
   This is comfortably feasible with room for extensive food and water stores.

3. Water recycling has a significant impact: 50% recycling improves margins by ~{abs(margins[1]-margins[0]):.0f} percentage points.

4. The single most sensitive variable is the definition of "kind" — species vs family level.
   This one assumption shifts the verdict from marginal to highly feasible.

VERDICT: The biblical ark dimensions produce a vessel with sound naval architecture
(6:1 ratio, good stability, adequate ventilation). Feasibility depends primarily on
the number of passengers, which depends on the taxonomic interpretation of "kind."
""".format(m0=margins[0], m2=margins[2])
ax.text(0.02, 0.95, report, transform=ax.transAxes, fontsize=9.5,
        verticalalignment='top', fontfamily='monospace', color='#d1d5db')

plt.suptitle("NOAH'S ARK — COMPLETE ENGINEERING REPORT", fontsize=15,
             fontweight='bold', color='gold', y=0.98)
plt.show()

print("\\n=== Report complete. ===")
print("This capstone combined: buoyancy, displacement, stability,")
print("biodiversity, taxonomy, Kleiber's law, closed-system ecology,")
print("sensitivity analysis, and data visualisation.")
print("You built a complete engineering assessment from first principles.")`,
      challenge: 'Add one more scenario: "Juvenile animals only" — assume young animals at 25% of adult mass. Recalculate all logistics. Many ark researchers argue that taking juveniles dramatically reduces weight and food needs while still preserving the species. How much does this help?',
      successHint: 'You have built a complete, multi-disciplinary engineering analysis: naval architecture, biology, ecology, and data science — all driven by one ancient story. The ark is a masterclass in systems engineering: every subsystem (buoyancy, food, water, ventilation, stability) must work simultaneously. Change one parameter and everything shifts. This is what real engineering looks like.',
    },
  ];

  const diagrams = [ArkCapacityDiagram, ArkBuoyancyDiagram, ArkEcosystemDiagram, ArkBiodiversityDiagram, ActivityFloatTestDiagram, Volume3DDiagram];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Capstone: Build the Ark Capacity Calculator</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone builds a complete ark engineering simulation. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={diagrams[i] ? createElement(diagrams[i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
