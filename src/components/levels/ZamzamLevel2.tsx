import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import ZamzamAquiferDiagram from '../diagrams/ZamzamAquiferDiagram';
import ZamzamPorosityDiagram from '../diagrams/ZamzamPorosityDiagram';
import ZamzamDarcyLawDiagram from '../diagrams/ZamzamDarcyLawDiagram';
import ZamzamWaterCycleDiagram from '../diagrams/ZamzamWaterCycleDiagram';
import WaterCycleDiagram from '../diagrams/WaterCycleDiagram';
import PressureDepthDiagram from '../diagrams/PressureDepthDiagram';

export default function ZamzamLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Hydraulic head and the potentiometric surface',
      concept: `In Level 1, you learned that water flows from high to low. In hydrogeology, we quantify this with **hydraulic head** — the total energy of water at a point, measured as an equivalent height in metres.

Hydraulic head = **elevation head** (height above a datum) + **pressure head** (pressure converted to metres of water).

For an unconfined aquifer, the water table IS the potentiometric surface. For a confined aquifer, the potentiometric surface may be far above the actual water — it represents where water WOULD rise if you drilled a well.

When you map the potentiometric surface across a region, you get a **flow net** — water always flows perpendicular to lines of equal head (equipotentials), from high head to low head.

The code builds a 2D potentiometric surface map and calculates flow directions.`,
      analogy: 'A potentiometric surface is like a topographic map of water pressure. Just as a ball rolls downhill on a topographic map (from high elevation to low), water flows "downhill" on the potentiometric surface (from high head to low head). The steeper the slope, the faster the flow.',
      storyConnection: 'The potentiometric surface beneath Mecca slopes from the Hejaz mountains toward the Red Sea coast. Zamzam sits in a zone where multiple flow paths converge, creating a natural collection point for groundwater. Mapping this surface was key to understanding why the well produces so much water in such an arid location.',
      checkQuestion: 'Two wells are drilled into the same confined aquifer. Well A is at 200m elevation, water rises to 180m. Well B is at 150m elevation, water rises to 175m. Which direction does groundwater flow?',
      checkAnswer: 'Hydraulic head at A = 180m. Hydraulic head at B = 175m. Water flows from high head to low head, so it flows from A toward B. Note: even though B is at a lower elevation, what matters is the potentiometric surface, not the ground surface. The water in Well B rises higher above the aquifer than in Well A, but the absolute head is still lower.',
      codeIntro: 'Build a 2D potentiometric surface map with flow vectors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create a 2D potentiometric surface
# Imagine a region 1km x 1km, with mountains to the east
x = np.linspace(0, 1000, 50)  # metres
y = np.linspace(0, 1000, 50)
X, Y = np.meshgrid(x, y)

# Head decreases from east (mountains) to west (coast)
# With a depression near centre (Zamzam-like feature)
head = 100 + 0.05 * X - 0.02 * ((X-500)**2 + (Y-500)**2) / 10000

# Calculate flow direction (negative gradient of head)
dy, dx = np.gradient(head, y[1]-y[0], x[1]-x[0])
flow_x = -dx  # water flows down the gradient
flow_y = -dy

plt.figure(figsize=(10, 8))

# Contour map of head
contours = plt.contour(X, Y, head, levels=15, colors='white', linewidths=0.5, alpha=0.4)
plt.clabel(contours, inline=True, fontsize=8, fmt='%.0fm')
plt.contourf(X, Y, head, levels=30, cmap='Blues')
plt.colorbar(label='Hydraulic head (m)')

# Flow arrows (subsample for clarity)
skip = 5
plt.quiver(X[::skip, ::skip], Y[::skip, ::skip],
           flow_x[::skip, ::skip], flow_y[::skip, ::skip],
           color='white', alpha=0.7, scale=0.02)

# Mark well location
plt.plot(500, 500, 'r*', markersize=15)
plt.annotate('Well (convergence zone)', xy=(500, 500), xytext=(550, 400),
             fontsize=10, color='red', arrowprops=dict(arrowstyle='->', color='red'))

plt.xlabel('East-West (m)', fontsize=12, color='lightgray')
plt.ylabel('North-South (m)', fontsize=12, color='lightgray')
plt.title('Potentiometric Surface Map with Flow Vectors', fontsize=14, color='white')
plt.tick_params(colors='lightgray')
plt.show()

print("White arrows show groundwater flow direction")
print("Water flows perpendicular to head contours")
print("The star marks where flow lines converge — ideal well location!")`,
      challenge: 'Add a pumping well at (500, 500) by subtracting a cone of depression: head -= 20 * np.exp(-((X-500)**2 + (Y-500)**2) / 20000). How do the flow vectors change? All water now converges on the well.',
      successHint: 'Potentiometric surface maps are the primary tool hydrogeologists use to predict groundwater flow. Where the arrows converge, you drill your well. Real surveys measure head in dozens of observation wells to build these maps.',
    },
    {
      title: 'The Theis equation — modelling a pumping well',
      concept: `When you turn on a pump, the water table does not drop instantly everywhere. The drawdown spreads outward like a ripple, creating the **cone of depression**. The Theis equation (1935) predicts how deep the drawdown is at any distance and time:

**s(r,t) = Q/(4πT) × W(u)**

Where:
- s = drawdown (m)
- Q = pumping rate (m³/s)
- T = transmissivity (K × aquifer thickness, m²/s)
- W(u) = the "well function" (a special integral)
- u = r²S/(4Tt) where r=distance, S=storativity, t=time

This equation is complex but powerful. It tells you: how far the cone extends, how long until a nearby well is affected, and how fast the aquifer recovers when pumping stops.

The code implements the Theis solution and plots the cone of depression at different times.`,
      analogy: 'Drop a stone in a pond. The wave spreads outward in a ring, getting weaker with distance. A pumping well creates a similar "wave" — but instead of a water surface rising, the water table drops. The drawdown ripple spreads outward over time, reaching further wells gradually. Stop pumping, and the "ripple" slowly reverses as the cone refills.',
      storyConnection: 'When Zamzam is pumped at peak rate during Hajj, the cone of depression extends outward. Engineers use the Theis equation to predict how far the drawdown reaches and ensure it does not affect other water sources in the area. The equation tells them exactly how long the well needs to rest between heavy pumping cycles.',
      checkQuestion: 'If you double the pumping rate, does the cone of depression double in depth?',
      checkAnswer: 'Yes — drawdown is directly proportional to Q in the Theis equation (s = Q/(4πT) × W(u)). Doubling Q doubles s at every point. However, the cone does not double in radius at the same time — the relationship with distance is logarithmic. So doubling the pumping rate makes the cone twice as deep but only slightly wider.',
      codeIntro: 'Implement the Theis well function and plot the cone of depression.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.special import exp1  # will work in Pyodide

# Theis solution: s = Q/(4*pi*T) * W(u)
# W(u) = -Ei(-u) = exp1(u) in scipy
# u = r^2 * S / (4 * T * t)

Q = 0.015       # pumping rate (m^3/s) — Zamzam rate
T = 5e-3        # transmissivity (m^2/s)
S = 0.001       # storativity (confined aquifer)

def drawdown(r, t, Q=Q, T=T, S=S):
    u = r**2 * S / (4 * T * t)
    u = np.maximum(u, 1e-10)  # avoid zero
    return Q / (4 * np.pi * T) * exp1(u)

r = np.linspace(1, 500, 200)  # distance from well (m)
times = [3600, 86400, 604800, 2592000]  # 1hr, 1day, 1week, 1month
labels = ['1 hour', '1 day', '1 week', '1 month']
colors = ['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8']

plt.figure(figsize=(10, 5))
for t, label, color in zip(times, labels, colors):
    s = drawdown(r, t)
    plt.plot(r, -s, linewidth=2, color=color, label=label)

plt.xlabel('Distance from well (m)', fontsize=12, color='lightgray')
plt.ylabel('Drawdown (m)', fontsize=12, color='lightgray')
plt.title('Cone of Depression Over Time (Theis Solution)', fontsize=14, color='white')
plt.legend(fontsize=10, labelcolor='lightgray')
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')
plt.show()

print("The cone deepens and widens over time:")
for t, label in zip(times, labels):
    s_at_well = drawdown(1, t)
    s_at_100m = drawdown(100, t)
    print(f"  {label:10s}: at well = {s_at_well:.1f}m, at 100m = {s_at_100m:.2f}m")`,
      challenge: 'Add a recovery curve: after pumping for 1 month, turn the pump off and calculate how the water table recovers. Use the superposition principle: recovery drawdown = drawdown(t_total) - drawdown(t_total - t_pump).',
      successHint: 'The Theis equation is the workhorse of groundwater engineering. It lets you predict drawdown, plan well spacing, estimate aquifer properties from pump tests, and design sustainable pumping schedules.',
    },
    {
      title: 'Groundwater recharge estimation',
      concept: `How do you know how much rain actually reaches the aquifer? Not all rainfall becomes recharge — most of it evaporates, runs off the surface, or is absorbed by plant roots. The fraction that reaches the water table is typically 1-30% of rainfall.

We can estimate recharge using the **water balance** method:

**Recharge = Rainfall - Evapotranspiration - Runoff**

Each term depends on climate, soil, slope, and vegetation. Desert regions like Mecca might have only 1-5% recharge. Flat grasslands with sandy soil might have 20-30%.

In the code, you will calculate recharge for different climate zones and see how small changes in rainfall dramatically affect aquifer sustainability.`,
      analogy: 'Imagine pouring a glass of water onto a sloping table covered with a sponge sheet. Some water soaks into the sponge (infiltration). Some slides off the edges (runoff). Some evaporates from the hot surface (evapotranspiration). The tiny amount that seeps through the sponge and drips off the bottom is recharge. In a desert, that drip might be a single drop per glass.',
      storyConnection: 'Mecca receives only about 100mm of rainfall per year. With perhaps 2% recharge, only 2mm/year reaches the aquifer. Over the 14 km² Wadi Ibrahim catchment that feeds Zamzam, that is 28,000 m³/year. Zamzam pumps about 500,000 m³/year. The mismatch suggests the aquifer is drawing on water that recharged thousands of years ago during wetter climate periods.',
      checkQuestion: 'If recharge is only 2mm/year but pumping removes the equivalent of 35mm/year, what is happening to the aquifer?',
      checkAnswer: 'The aquifer is being mined — water is being extracted 17.5 times faster than it replenishes. The water level will drop over time. This is only sustainable if the aquifer has a large stored volume accumulated over millennia. Zamzam’s continued flow suggests the stored volume is substantial, but it is not infinite. This is why careful management is essential.',
      codeIntro: 'Calculate groundwater recharge for different climate and soil scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Water balance: Recharge = Rainfall - ET - Runoff
climates = {
    "Mecca (arid)":       {"rain": 100,  "et_frac": 0.85, "runoff_frac": 0.12},
    "Delhi (semi-arid)":  {"rain": 800,  "et_frac": 0.65, "runoff_frac": 0.15},
    "Assam (tropical)":   {"rain": 2500, "et_frac": 0.55, "runoff_frac": 0.25},
    "London (temperate)": {"rain": 600,  "et_frac": 0.50, "runoff_frac": 0.20},
    "Amazon (equatorial)":{"rain": 3000, "et_frac": 0.70, "runoff_frac": 0.15},
}

names = list(climates.keys())
rain = [climates[c]["rain"] for c in names]
recharge = []
for c in names:
    d = climates[c]
    r = d["rain"] * (1 - d["et_frac"] - d["runoff_frac"])
    recharge.append(max(r, 0))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Rainfall vs recharge
ax1.bar(range(len(names)), rain, alpha=0.4, color='#60a5fa', label='Total rainfall')
ax1.bar(range(len(names)), recharge, alpha=0.8, color='#10b981', label='Recharge')
ax1.set_xticks(range(len(names)))
ax1.set_xticklabels([n.split('(')[0].strip() for n in names],
                     rotation=30, fontsize=9, color='lightgray')
ax1.set_ylabel('mm/year', fontsize=11, color='lightgray')
ax1.set_title('Rainfall vs Aquifer Recharge', fontsize=13, color='white')
ax1.legend(fontsize=9, labelcolor='lightgray')
ax1.tick_params(colors='lightgray')

# Recharge as % of rainfall
pct = [r/p*100 if p > 0 else 0 for r, p in zip(recharge, rain)]
ax2.barh(range(len(names)), pct, color='#f59e0b', alpha=0.7)
ax2.set_yticks(range(len(names)))
ax2.set_yticklabels([n.split('(')[0].strip() for n in names],
                     fontsize=9, color='lightgray')
ax2.set_xlabel('Recharge as % of rainfall', fontsize=11, color='lightgray')
ax2.set_title('Recharge Efficiency', fontsize=13, color='white')
ax2.tick_params(colors='lightgray')

plt.tight_layout()
plt.show()

for name, r, rch in zip(names, rain, recharge):
    print(f"  {name:25s}: {r:5.0f} mm rain -> {rch:5.1f} mm recharge ({rch/r*100:.1f}%)")`,
      challenge: 'Add "Managed Recharge" for Mecca: same rainfall, but build infiltration basins that increase recharge fraction to 15%. How much more water reaches the aquifer? This is called Managed Aquifer Recharge (MAR) and is being explored in Saudi Arabia.',
      successHint: 'Recharge estimation is the first step in any groundwater management plan. If you do not know how fast the aquifer refills, you cannot know how fast you can safely pump. In arid regions, the answer is often: very slowly.',
    },
    {
      title: 'Isotope hydrology — dating ancient water',
      concept: `How old is the water in Zamzam? You cannot just look at it. But you CAN measure its **isotopes** — atoms of the same element with different numbers of neutrons.

Water contains oxygen-18 (¹⁸O, heavier) and oxygen-16 (¹⁶O, lighter). The ratio ¹⁸O/¹⁶O depends on temperature at the time of rainfall. During cold periods (ice ages), rain has less ¹⁸O. During warm periods, more.

Even more powerful: **tritium** (³H, radioactive hydrogen with a half-life of 12.3 years) was injected into the atmosphere by nuclear bomb tests in the 1950s-60s. Any water containing tritium must have rained AFTER 1952. Water with NO tritium is older than ~60 years.

**Carbon-14** dating works for even older water (up to 50,000 years). Dissolved CO₂ in rainwater contains ¹⁴C, which decays with a 5,730-year half-life. Less ¹⁴C = older water.

Studies of Zamzam water show a mix of ages — some modern recharge and some very old water.`,
      analogy: 'Isotope dating is like checking the expiry date on a carton of milk, except the "date" is written in atoms. Tritium is the short-term calendar (last 60 years). Carbon-14 is the long-term calendar (up to 50,000 years). Oxygen-18 is a thermometer that records the temperature when the rain fell. Together, they tell the complete biography of a water drop.',
      storyConnection: 'Isotope analysis of Zamzam water revealed a mix: some water recharged recently from nearby wadis, and some is thousands of years old, dating to wetter climate periods in the Arabian Peninsula. The story of Zamzam "springing forth" in ancient times aligns with the isotope data showing a deep, ancient groundwater component.',
      checkQuestion: 'A groundwater sample has zero tritium and a ¹⁴C age of 8,000 years. What does this tell you?',
      checkAnswer: 'Zero tritium means the water rained down before 1952 (or more precisely, the tritium has decayed below detection limits, so the water is older than ~60 years). The ¹⁴C age of 8,000 years narrows it further — this water fell as rain roughly 8,000 years ago, during the early Holocene when the climate was wetter (the "Green Sahara" period). This water has been sitting in the aquifer for 8 millennia.',
      codeIntro: 'Calculate radioactive decay ages for groundwater samples.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Carbon-14 dating: N(t) = N0 * exp(-lambda * t)
# Half-life of C-14: 5730 years
# lambda = ln(2) / half_life

half_life_C14 = 5730  # years
lambda_C14 = np.log(2) / half_life_C14

# Tritium dating: half-life = 12.3 years
half_life_H3 = 12.3
lambda_H3 = np.log(2) / half_life_H3

# Decay curves
t_C14 = np.linspace(0, 40000, 500)
remaining_C14 = 100 * np.exp(-lambda_C14 * t_C14)

t_H3 = np.linspace(0, 100, 500)
remaining_H3 = 100 * np.exp(-lambda_H3 * t_H3)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.plot(t_C14, remaining_C14, linewidth=2.5, color='#f59e0b')
ax1.axhline(y=50, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax1.axvline(x=half_life_C14, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax1.set_xlabel('Age (years)', fontsize=11, color='lightgray')
ax1.set_ylabel('% C-14 remaining', fontsize=11, color='lightgray')
ax1.set_title('Carbon-14 Dating (ancient water)', fontsize=13, color='white')
ax1.annotate('Half-life: 5730 yrs', xy=(5730, 50), fontsize=10, color='#f59e0b')
ax1.tick_params(colors='lightgray')
ax1.grid(alpha=0.2)

ax2.plot(t_H3, remaining_H3, linewidth=2.5, color='#10b981')
ax2.axhline(y=50, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax2.axvline(x=half_life_H3, color='white', linewidth=0.5, linestyle='--', alpha=0.3)
ax2.set_xlabel('Years since 1960s bomb tests', fontsize=11, color='lightgray')
ax2.set_ylabel('% Tritium remaining', fontsize=11, color='lightgray')
ax2.set_title('Tritium Dating (modern water)', fontsize=13, color='white')
ax2.annotate('Half-life: 12.3 yrs', xy=(12.3, 50), fontsize=10, color='#10b981')
ax2.tick_params(colors='lightgray')
ax2.grid(alpha=0.2)

plt.tight_layout()
plt.show()

# Date some water samples
print("=== Dating Water Samples ===")
samples = [
    ("Zamzam deep", 45, "C-14"),  # 45% remaining
    ("Zamzam shallow", 82, "C-14"),
    ("Modern well", 25, "H-3"),   # 25% tritium
]
for name, pct, method in samples:
    if method == "C-14":
        age = -np.log(pct/100) / lambda_C14
        print(f"  {name}: {pct}% C-14 -> age ~ {age:.0f} years")
    else:
        age = -np.log(pct/100) / lambda_H3
        print(f"  {name}: {pct}% tritium -> recharged ~ {age:.0f} years ago")`,
      challenge: 'A Zamzam sample shows 38% C-14 remaining. Calculate its age. If the aquifer volume is 10 million m³ and the average age is 6,000 years, how much has it recharged per year on average? (Volume / Age)',
      successHint: 'Isotope hydrology reveals the invisible history of groundwater. Every water molecule carries a timestamp in its atoms. This science has transformed our understanding of aquifer systems, from Zamzam to the Great Artesian Basin in Australia.',
    },
    {
      title: 'Well design — screen, casing, and gravel pack',
      concept: `A well is not just a hole in the ground. A properly designed well has multiple components:

1. **Casing** — a steel or PVC pipe lining the borehole, preventing collapse
2. **Screen** — a slotted section at the aquifer depth, allowing water in while keeping sand out
3. **Gravel pack** — carefully graded gravel between the screen and the borehole wall, acting as a filter
4. **Seal** — cement or clay above the screen, preventing surface contamination

The screen slot size must match the aquifer grain size. Too large: sand enters the well. Too small: water cannot flow in fast enough. The gravel pack bridges the gap between screen slots and aquifer grains.

Zamzam’s modern renovation includes a sophisticated multi-screen design that draws water from multiple aquifer zones.`,
      analogy: 'A well screen is like a tea strainer. Too-coarse mesh lets tea leaves through into your cup. Too-fine mesh blocks water from flowing and your tea pours agonisingly slowly. The gravel pack is like wrapping the strainer in a cloth — it catches the medium-sized particles that are too small for the screen but too large for the aquifer pores.',
      storyConnection: 'The original Zamzam was an open hole in fractured rock. Over centuries, it was lined with stone blocks. Modern renovation in 1980 installed a concrete-lined well with multiple stainless steel screens at different depths, drawing from both the alluvial aquifer and the deeper fractured bedrock. This engineering ensures clean water at sustainable flow rates.',
      checkQuestion: 'A well screen has 0.5mm slots but the aquifer is fine sand (grain size 0.1mm). What happens?',
      checkAnswer: 'Sand enters the well. The screen slots (0.5mm) are 5 times larger than the sand grains (0.1mm), so fine sand passes straight through. Over time, sand fills the bottom of the well, reduces capacity, and damages the pump. Solution: install a gravel pack with grains 2-3mm in diameter between the screen and the aquifer. The gravel catches the fine sand while the screen catches the gravel.',
      codeIntro: 'Design a well screen: calculate optimal slot size and gravel pack for different aquifers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Well design rules:
# Screen slot size should retain 40-50% of aquifer grains
# Gravel pack ratio = gravel D50 / aquifer D50 = 4-6

def design_well(aquifer_d50_mm, aquifer_d10_mm, name):
    """Design a well for a given aquifer grain size"""
    # Screen slot = aquifer D10 (retains 90% of grains)
    slot_size = aquifer_d10_mm

    # Gravel pack D50 = 5 * aquifer D50
    gravel_d50 = 5 * aquifer_d50_mm

    # Uniformity coefficient
    Cu = aquifer_d50_mm / aquifer_d10_mm

    return {
        "name": name,
        "aquifer_d50": aquifer_d50_mm,
        "aquifer_d10": aquifer_d10_mm,
        "slot_size": slot_size,
        "gravel_d50": gravel_d50,
        "Cu": Cu,
    }

# Different aquifer types
designs = [
    design_well(0.5, 0.15, "Fine sand"),
    design_well(1.0, 0.4, "Medium sand"),
    design_well(2.0, 0.8, "Coarse sand"),
    design_well(5.0, 2.0, "Gravel"),
    design_well(0.8, 0.3, "Zamzam alluvium"),
]

print("=== Well Design Calculator ===")
print(f"{'Aquifer':<18} {'D50':>6} {'D10':>6} {'Slot':>8} {'Gravel':>8}")
print(f"{'':18} {'(mm)':>6} {'(mm)':>6} {'(mm)':>8} {'D50(mm)':>8}")
print("-" * 50)
for d in designs:
    print(f"{d['name']:<18} {d['aquifer_d50']:>6.1f} {d['aquifer_d10']:>6.2f} "
          f"{d['slot_size']:>8.2f} {d['gravel_d50']:>8.1f}")

# Visualize particle size distributions
fig, ax = plt.subplots(figsize=(10, 5))
sizes = np.logspace(-2, 2, 200)  # mm

for d in designs:
    # Simplified log-normal distribution
    mu = np.log(d['aquifer_d50'])
    sigma = 0.5
    dist = np.exp(-(np.log(sizes) - mu)**2 / (2*sigma**2))
    ax.plot(sizes, dist, linewidth=2, label=d['name'])
    ax.axvline(x=d['slot_size'], linestyle=':', alpha=0.3, color='white')

ax.set_xscale('log')
ax.set_xlabel('Grain size (mm)', fontsize=12, color='lightgray')
ax.set_ylabel('Relative frequency', fontsize=12, color='lightgray')
ax.set_title('Aquifer Grain Size vs Screen Slot Size', fontsize=14, color='white')
ax.legend(fontsize=9, labelcolor='lightgray')
ax.grid(alpha=0.2)
ax.tick_params(colors='lightgray')
plt.show()`,
      challenge: 'Add a "Fractured limestone" aquifer where the "grains" are fracture openings averaging 5mm. How does the screen design change? In fractured rock, you often skip the gravel pack entirely. Why?',
      successHint: 'A poorly designed well screen can reduce yield by 50% or cause catastrophic sand intrusion. The difference between a well that lasts 50 years and one that fails in 5 often comes down to proper screen and gravel pack design.',
    },
    {
      title: 'Build a complete well field model',
      concept: `Real water supply systems use multiple wells (“well fields”) spread across an aquifer. The challenge: when multiple wells pump simultaneously, their cones of depression interact and overlap. Each well draws down the water table not just at its own location, but at every other well too.

The total drawdown at any point is the **sum** of drawdowns from all wells (superposition principle). This means wells must be spaced far enough apart that their combined drawdown does not exceed the aquifer’s capacity.

In this exercise, you will design a 3-well system for a town, calculating optimal spacing, individual pumping rates, and total sustainable yield.`,
      analogy: 'Imagine three people drinking from the same large bowl of soup with straws. If they sit far apart, each gets a good flow. If they sit close together, they compete — the soup level drops faster between them and everyone’s straw might start sucking air. Well field design is about spacing the straws (wells) far enough apart that everyone gets enough soup (water) without draining the bowl.',
      storyConnection: 'The Saudi government does not rely on Zamzam alone for Mecca’s water supply. A network of wells, desalination plants, and pipeline systems work together. Understanding well field interference was critical to ensuring Zamzam’s continued flow while also meeting the city’s growing demand.',
      checkQuestion: 'Three wells are each pumped at 10 L/s. They are 50m apart. At the centre point between all three wells, is the drawdown equal to what one well would cause, or more?',
      checkAnswer: 'Much more. By superposition, the drawdown at the centre is the SUM of what each well causes at that point. Since the centre is equidistant from all three wells, the drawdown is approximately 3 times what a single well would cause at that distance. This is why well spacing is so critical — too close and the combined drawdown can dewater the aquifer between them.',
      codeIntro: 'Design and simulate a 3-well field with interference effects.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified steady-state drawdown: s = Q/(2*pi*T) * ln(R/r)
# where R = radius of influence, r = distance from well
T = 5e-3   # transmissivity (m^2/s)
R = 500    # radius of influence (m)

def drawdown_steady(x, y, well_x, well_y, Q):
    r = np.sqrt((x - well_x)**2 + (y - well_y)**2)
    r = np.maximum(r, 0.1)  # avoid log(0)
    s = Q / (2 * np.pi * T) * np.log(R / np.minimum(r, R-1))
    return np.maximum(s, 0)

# Three wells in a triangle
wells = [
    {"x": 0,   "y": 0,    "Q": 0.010, "name": "Well A"},
    {"x": 200, "y": 0,    "Q": 0.010, "name": "Well B"},
    {"x": 100, "y": 173,  "Q": 0.010, "name": "Well C"},
]

# Create grid
gx = np.linspace(-200, 400, 200)
gy = np.linspace(-200, 400, 200)
GX, GY = np.meshgrid(gx, gy)

# Total drawdown = sum of all wells (superposition)
total_drawdown = np.zeros_like(GX)
for w in wells:
    total_drawdown += drawdown_steady(GX, GY, w["x"], w["y"], w["Q"])

plt.figure(figsize=(10, 8))
contours = plt.contourf(GX, GY, total_drawdown, levels=20, cmap='Blues_r')
plt.colorbar(contours, label='Total drawdown (m)')
plt.contour(GX, GY, total_drawdown, levels=10, colors='white', linewidths=0.5, alpha=0.4)

# Mark wells
for w in wells:
    plt.plot(w["x"], w["y"], 'r^', markersize=12)
    plt.annotate(w["name"], xy=(w["x"], w["y"]), xytext=(w["x"]+15, w["y"]+15),
                 fontsize=10, color='red')

plt.xlabel('East (m)', fontsize=12, color='lightgray')
plt.ylabel('North (m)', fontsize=12, color='lightgray')
plt.title('Well Field: Combined Cone of Depression', fontsize=14, color='white')
plt.tick_params(colors='lightgray')
plt.axis('equal')
plt.show()

# Calculate interference at each well
print("=== Well Field Interference ===")
for i, w in enumerate(wells):
    own = drawdown_steady(w["x"]+0.1, w["y"], w["x"], w["y"], w["Q"])
    interference = sum(
        drawdown_steady(w["x"], w["y"], other["x"], other["y"], other["Q"])
        for j, other in enumerate(wells) if j != i
    )
    print(f"{w['name']}: own drawdown = {own:.1f}m, "
          f"interference = {interference:.1f}m, total = {own+interference:.1f}m")

print(f"\\nTotal field yield: {sum(w['Q']*1000 for w in wells):.0f} L/s")`,
      challenge: 'Try increasing well spacing to 400m between each well. How does interference change? Then try 100m spacing. Find the minimum spacing where no well exceeds 10m total drawdown.',
      successHint: 'Well field design is where hydrogeology meets engineering. The superposition principle — total drawdown equals the sum of individual contributions — is the key to designing systems that work. Every major city’s water supply depends on these calculations.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 hydrology foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced hydrology modelling. Click to start.</p>
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
            diagram={[ZamzamAquiferDiagram, ZamzamDarcyLawDiagram, ZamzamWaterCycleDiagram, ZamzamPorosityDiagram, PressureDepthDiagram, WaterCycleDiagram][i] ? createElement([ZamzamAquiferDiagram, ZamzamDarcyLawDiagram, ZamzamWaterCycleDiagram, ZamzamPorosityDiagram, PressureDepthDiagram, WaterCycleDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
