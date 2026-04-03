import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import MountainBarometricDiagram from '../diagrams/MountainBarometricDiagram';
import MountainO2PartialDiagram from '../diagrams/MountainO2PartialDiagram';
import AltitudeProfileDiagram from '../diagrams/AltitudeProfileDiagram';
import MountainZonationDiagram from '../diagrams/MountainZonationDiagram';
import MountainBodyAdaptDiagram from '../diagrams/MountainBodyAdaptDiagram';
import MountainPressureDiagram from '../diagrams/MountainPressureDiagram';

export default function SnowLeopardLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const diagrams = [
    MountainBarometricDiagram,
    MountainO2PartialDiagram,
    AltitudeProfileDiagram,
    MountainZonationDiagram,
    MountainBodyAdaptDiagram,
    MountainPressureDiagram,
  ];

  const miniLessons = [
    {
      title: 'The Barometric Formula',
      concept: `Before we can model anything about altitude, we need the single most important equation in atmospheric science: the **barometric formula**. It tells us how air pressure drops as you climb higher.

The equation is: **P = P0 * e^(-Mgh / RT)**

Every variable has a physical meaning you can feel. **P0** is sea-level pressure (101,325 Pa) -- the weight of the entire atmosphere pushing down on you at the beach. **M** is the molar mass of air (0.02896 kg/mol) -- how heavy one "packet" of air molecules is. **g** is gravitational acceleration (9.81 m/s2) -- Earth pulling those molecules downward. **h** is your altitude in meters -- how far above the beach you have climbed. **R** is the universal gas constant (8.314 J/(mol*K)) -- it converts between energy and temperature. **T** is temperature in Kelvin (we will use 288.15 K, a standard 15 C day).

Why does pressure drop exponentially rather than linearly? Because air is compressible. The air at the bottom is squeezed by all the air above it, making it dense. As you climb, there is less air above to do the squeezing, so each layer is thinner than the one below. This compounding effect gives us the exponential decay. At 5,500 m (snow leopard habitat), pressure is already down to about 50% of sea level.`,
      analogy: 'Imagine a stack of sponges. The bottom sponge is completely compressed by the weight of all the sponges above it -- it is thin and dense. The top sponge has nothing pressing on it, so it is fully expanded and fluffy. If you measure the density of each sponge from bottom to top, it does not drop by the same amount each layer -- it drops by a percentage of the remaining density. That is exponential decay, and air behaves exactly like this sponge stack.',
      storyConnection: 'The snow leopard in the story prowls ridgelines at 4,000-5,500 m where the air pressure is barely half of sea level. Every breath it takes delivers roughly half the air molecules compared to a lowland cat. The barometric formula quantifies this: at 5,000 m, P = 101325 * e^(-0.02896 * 9.81 * 5000 / (8.314 * 288.15)) = about 54,000 Pa. Understanding this equation is the first step to understanding why high-altitude life is so demanding.',
      checkQuestion: 'Using the barometric formula with T = 288.15 K, calculate the pressure at 3,000 m. Then calculate it at 6,000 m. Is the pressure at 6,000 m exactly half of the pressure at 3,000 m? Why or why not?',
      checkAnswer: 'At 3,000 m: P = 101325 * e^(-0.02896 * 9.81 * 3000 / (8.314 * 288.15)) = 101325 * e^(-0.3417) = 101325 * 0.7105 = 71,980 Pa. At 6,000 m: P = 101325 * e^(-0.6834) = 101325 * 0.5049 = 51,140 Pa. The ratio is 51140/71980 = 0.710, which IS the same factor as 71980/101325 = 0.710. This makes sense because exponential decay means each equal altitude step multiplies pressure by the same factor, not subtracts the same amount. So yes, the pressure at 6,000 m is about 71% of the pressure at 3,000 m -- the same ratio as 3,000 m to sea level.',
      codeIntro: 'Implement the barometric formula and compute pressure at key altitudes from sea level to 8,586 m.',
      code: `import numpy as np

# Constants for the barometric formula
P0 = 101325      # Sea-level pressure in Pascals
M  = 0.02896     # Molar mass of air (kg/mol)
g  = 9.81        # Gravitational acceleration (m/s^2)
R  = 8.314       # Universal gas constant (J/(mol*K))
T  = 288.15      # Standard temperature (K) = 15 C

def barometric_pressure(h):
    """Compute atmospheric pressure at altitude h (meters).
    Uses the barometric formula: P = P0 * exp(-Mgh / RT)
    """
    exponent = -(M * g * h) / (R * T)
    return P0 * np.exp(exponent)

# Test at key altitudes
altitudes = [0, 1000, 2000, 3000, 4000, 5000, 5500, 6000, 8000, 8586]

print("Barometric Formula: P = P0 * exp(-Mgh / RT)")
print(f"Constants: P0={P0} Pa, M={M} kg/mol, g={g} m/s2")
print(f"           R={R} J/(mol*K), T={T} K")
print("=" * 55)
print(f"{'Altitude (m)':>14} {'Pressure (Pa)':>15} {'% of sea level':>16}")
print("-" * 55)

for h in altitudes:
    p = barometric_pressure(h)
    pct = (p / P0) * 100
    print(f"{h:>14,} {p:>15,.0f} {pct:>15.1f}%")

print()
print("Key insight: pressure drops to ~50% at 5,500 m")
print("Snow leopard habitat (3,000-5,500 m): 71% to 50% of sea level")
print("Kangchenjunga summit (8,586 m): only 34% of sea level")`,
      challenge: 'The barometric formula assumes constant temperature, but real atmosphere cools with altitude (about 6.5 C per km). Modify the function to accept a lapse rate parameter and recompute pressures. How much does the temperature correction change the result at 8,586 m?',
      successHint: 'You now have the foundation: a function that converts any altitude to atmospheric pressure. Every calculation in the next five lessons builds on this single equation.',
      practice: [
        {
          label: 'Reinforce',
          prompt: 'Calculate the altitude where pressure drops to exactly 75% of sea level. Hint: rearrange the formula to solve for h.',
          starterCode: `import numpy as np

P0 = 101325
M  = 0.02896
g  = 9.81
R  = 8.314
T  = 288.15

# Rearrange: P/P0 = exp(-Mgh/RT)
# ln(P/P0) = -Mgh/RT
# h = -RT * ln(P/P0) / (Mg)
target_ratio = 0.75
h = # YOUR CODE HERE
print(f"Pressure drops to 75% at {h:.0f} m")`,
          hint: 'Use np.log(0.75) for the natural logarithm, then multiply by -RT/(Mg).',
        },
        {
          label: 'Apply',
          prompt: 'Mars has P0 = 610 Pa, M = 0.04340 kg/mol, g = 3.72 m/s2, T = 210 K. Compute pressure at Olympus Mons summit (21,229 m). How does the pressure ratio compare to Kangchenjunga?',
          starterCode: `import numpy as np

# Mars parameters
P0_mars = 610
M_mars  = 0.04340
g_mars  = 3.72
R       = 8.314
T_mars  = 210

h_olympus = 21229
p_olympus = P0_mars * np.exp(-(M_mars * g_mars * h_olympus) / (R * T_mars))
ratio_mars = p_olympus / P0_mars

print(f"Olympus Mons pressure: {p_olympus:.2f} Pa")
print(f"Ratio to Mars sea level: {ratio_mars:.3f}")
print(f"Compare: Kangchenjunga ratio on Earth is ~0.34")`,
          hint: 'The lower gravity on Mars means pressure drops more slowly with altitude, even though Olympus Mons is much taller than Kangchenjunga.',
        },
      ],
    },
    {
      title: 'Oxygen and Boiling Point',
      concept: `Atmospheric pressure alone does not tell us how hard it is to breathe or cook at altitude. We need two derived quantities: **oxygen partial pressure** and **boiling point of water**.

**Oxygen partial pressure** is straightforward. Air is 20.95% oxygen regardless of altitude -- the composition does not change, only the total pressure changes. So O2 partial pressure at any altitude is simply: **pO2 = 0.2095 * P(h)**. At sea level that gives 0.2095 * 101,325 = 21,228 Pa (about 159 mmHg). At 5,500 m it drops to about 11,300 Pa (85 mmHg). Below about 110 mmHg (roughly 2,400 m), most people start feeling the effects -- headaches, fatigue, shortness of breath. Below 70 mmHg (above 6,000 m), survival without supplemental oxygen becomes a race against time.

**Boiling point** requires the **Clausius-Clapeyron equation**, which relates vapor pressure to temperature. Water boils when its vapor pressure equals atmospheric pressure. The equation is: **T_boil = 1 / (1/T_ref - (R_gas / L) * ln(P / P_ref))**, where T_ref = 373.15 K (100 C, the boiling point at sea level), P_ref = 101,325 Pa, R_gas = 8.314 J/(mol*K), and L = 40,660 J/mol (latent heat of vaporization of water). At 5,500 m where P is about 50,500 Pa, the boiling point drops to about 83 C -- too low to cook rice properly, a real problem for mountain communities.`,
      analogy: 'Think of oxygen partial pressure like the percentage of useful payload in a delivery truck. The truck (total air) gets smaller at altitude, but the ratio of useful cargo (oxygen) to total cargo stays the same. A half-sized truck carrying 20.95% useful cargo delivers half the useful goods. For boiling point, imagine a pot of water as a crowded dance floor. At sea level, the "bouncers" (atmospheric pressure) are strong, keeping dancers (water molecules) from leaving. At altitude, the bouncers are weaker, so dancers escape more easily -- the water boils at a lower temperature.',
      storyConnection: 'Snow leopards hunt at altitudes where the oxygen partial pressure is barely half of sea level. Their enlarged lungs and efficient hemoglobin evolved specifically to extract enough oxygen from this thin air. Meanwhile, any climber trekking through snow leopard territory above 4,000 m knows that water boils at around 86 C -- tea tastes weak and rice stays hard. These are not minor inconveniences; they are direct consequences of the barometric formula you built in Lesson 1.',
      checkQuestion: 'At what altitude does water boil at 90 C? At that altitude, what is the oxygen partial pressure in mmHg? Would you need supplemental oxygen there?',
      checkAnswer: 'Working backward from the Clausius-Clapeyron equation: 90 C = 363.15 K. Solving for P gives about 70,100 Pa. Then using the barometric formula to find h: h = -(RT / Mg) * ln(P/P0) = -(8.314 * 288.15 / (0.02896 * 9.81)) * ln(70100/101325) = about 3,100 m. The O2 partial pressure there is 0.2095 * 70,100 = 14,686 Pa = 110 mmHg. This is right at the threshold where altitude sickness begins -- most healthy people can manage at 3,100 m, but those not acclimatized will feel headaches and fatigue.',
      codeIntro: 'Compute oxygen partial pressure and boiling point at every altitude from sea level to 8,586 m.',
      code: `import numpy as np

# --- Barometric formula from Lesson 1 ---
P0, M, g, R, T_atm = 101325, 0.02896, 9.81, 8.314, 288.15

def barometric_pressure(h):
    return P0 * np.exp(-(M * g * h) / (R * T_atm))

# --- Oxygen partial pressure ---
O2_FRACTION = 0.2095

def o2_partial_pressure(h):
    """O2 partial pressure (Pa) = 20.95% of total pressure."""
    return O2_FRACTION * barometric_pressure(h)

# --- Boiling point via Clausius-Clapeyron ---
T_REF   = 373.15   # Boiling point at sea level (K)
P_REF   = 101325   # Sea-level pressure (Pa)
L_WATER = 40660    # Latent heat of vaporization (J/mol)

def boiling_point(h):
    """Boiling point of water (C) at altitude h."""
    p = barometric_pressure(h)
    inv_T = (1.0 / T_REF) - (R / L_WATER) * np.log(p / P_REF)
    return (1.0 / inv_T) - 273.15

# --- Compute at key altitudes ---
altitudes = np.arange(0, 8700, 500)

print("Altitude Effects on Oxygen and Boiling Point")
print("=" * 62)
print(f"{'Alt (m)':>8} {'P (Pa)':>10} {'pO2 (Pa)':>10} "
      f"{'pO2 (mmHg)':>11} {'Boil (C)':>9}")
print("-" * 62)

for h in altitudes:
    p = barometric_pressure(h)
    po2 = o2_partial_pressure(h)
    po2_mmhg = po2 / 133.322
    bp = boiling_point(h)
    flag = ""
    if po2_mmhg < 110:
        flag = " <-- altitude sickness zone"
    if po2_mmhg < 70:
        flag = " <-- DEATH ZONE"
    print(f"{h:>8,} {p:>10,.0f} {po2:>10,.0f} "
          f"{po2_mmhg:>11.1f} {bp:>9.1f}{flag}")

print()
print("Snow leopard habitat (3000-5500 m):")
print(f"  O2 range: {o2_partial_pressure(5500)/133.322:.0f}"
      f" to {o2_partial_pressure(3000)/133.322:.0f} mmHg")
print(f"  Boiling point range: {boiling_point(5500):.1f}"
      f" to {boiling_point(3000):.1f} C")`,
      challenge: 'Add a column showing the percentage of sea-level oxygen available at each altitude. At what altitude does a climber get only 40% of sea-level oxygen? This is roughly the threshold for the "death zone."',
      successHint: 'You can now convert any altitude into three physical quantities: pressure, oxygen availability, and boiling point. These are the data series we will plot in the next lesson.',
      practice: [
        {
          label: 'Reinforce',
          prompt: 'If a pressure cooker raises internal pressure by 70 kPa above ambient, what is the boiling point of water inside a pressure cooker at 4,000 m?',
          starterCode: `import numpy as np

P0, M, g, R, T_atm = 101325, 0.02896, 9.81, 8.314, 288.15
T_REF, P_REF, L_WATER = 373.15, 101325, 40660

def barometric_pressure(h):
    return P0 * np.exp(-(M * g * h) / (R * T_atm))

p_ambient = barometric_pressure(4000)
p_cooker = p_ambient + 70000  # Extra 70 kPa

inv_T = (1.0 / T_REF) - (R / L_WATER) * np.log(p_cooker / P_REF)
bp = (1.0 / inv_T) - 273.15
print(f"Ambient pressure at 4000 m: {p_ambient:.0f} Pa")
print(f"Pressure cooker pressure: {p_cooker:.0f} Pa")
print(f"Boiling point in cooker: {bp:.1f} C")`,
          hint: 'The pressure cooker adds 70 kPa to whatever the ambient pressure is. This raises the total above sea-level pressure, so the boiling point goes above 100 C.',
        },
      ],
    },
    {
      title: 'Plotting the Altitude Profile',
      concept: `Numbers in a table are precise but hard to see patterns in. A **multi-panel altitude profile plot** makes the relationships between pressure, oxygen, and boiling point immediately visible.

We will create a figure with three vertically stacked subplots sharing the same x-axis (altitude from 0 to 8,586 m). The top panel shows atmospheric pressure dropping exponentially. The middle panel shows O2 partial pressure following the same curve (since it is a fixed fraction of total pressure). The bottom panel shows boiling point, which drops nearly linearly -- this is because the Clausius-Clapeyron equation is approximately linear over this pressure range.

Good scientific visualization follows rules. **Shared x-axis**: all three panels use the same altitude range, making vertical comparisons easy. **Labeled y-axes with units**: each panel needs its own y-axis label with correct units (Pa, mmHg, or C). **Consistent styling**: matching colors, fonts, and grid lines across panels so the eye can compare without re-orienting. **Altitude as the horizontal axis**: even though altitude is the "input," convention in atmospheric science puts altitude on the x-axis for profile plots because we think of altitude as "distance traveled upward."

The three curves tell a coherent story: as you climb, pressure and oxygen drop exponentially while boiling point drops nearly linearly. The nonlinearity of the first two is the key insight -- the first 2,000 m of climbing costs you less oxygen than the next 2,000 m, which costs less than the next. The mountain gets harder faster than it gets taller.`,
      analogy: 'A multi-panel plot is like a dashboard in a car. The speedometer, fuel gauge, and temperature gauge all show different quantities, but they are arranged so you can scan all three in one glance. If someone put the speedometer in the glove box and the fuel gauge in the trunk, you would crash trying to check them. Stacking our three altitude panels vertically with a shared x-axis is the atmospheric equivalent of a well-designed dashboard.',
      storyConnection: 'Imagine the snow leopard ascending from a valley at 3,000 m to a high pass at 5,500 m in pursuit of a bharal (blue sheep). Our plot shows that in those 2,500 vertical meters, pressure drops from 71% to 50% of sea level and oxygen from 112 mmHg to 85 mmHg. The plot makes visible what the leopard feels in its lungs with every stride uphill -- the air thinning noticeably, breath by breath.',
      checkQuestion: 'Why does the boiling point curve look nearly straight while the pressure curve is obviously curved? Both are derived from the same barometric formula.',
      checkAnswer: 'The boiling point depends on 1/(1/T_ref - (R/L)*ln(P/P_ref)). The natural log partially "straightens" the exponential pressure curve, and the reciprocal operation further compresses the range. Over the altitude range 0-8,586 m, the boiling point only changes from 100 C to about 72 C -- a 28-degree range that is well-approximated by a straight line. The pressure, by contrast, changes by a factor of 3, which is too large for linear approximation to hold.',
      codeIntro: 'Create a three-panel altitude profile plot with pressure, oxygen, and boiling point.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Functions from Lessons 1-2 ---
P0, M, g, R, T_atm = 101325, 0.02896, 9.81, 8.314, 288.15
T_REF, P_REF, L_WATER = 373.15, 101325, 40660

def pressure(h):
    return P0 * np.exp(-(M * g * h) / (R * T_atm))

def o2_pp(h):
    return 0.2095 * pressure(h)

def boil_pt(h):
    p = pressure(h)
    inv_T = (1/T_REF) - (R/L_WATER) * np.log(p/P_REF)
    return (1/inv_T) - 273.15

# --- Altitude array ---
h = np.linspace(0, 8586, 500)

# --- Three-panel figure ---
fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 10),
                                      sharex=True)
fig.patch.set_facecolor('#1f2937')

for ax in (ax1, ax2, ax3):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.grid(True, alpha=0.15, color='gray')

# Panel 1: Atmospheric pressure
ax1.plot(h/1000, pressure(h)/1000, color='#3b82f6', lw=2.5)
ax1.set_ylabel('Pressure (kPa)', color='white', fontsize=11)
ax1.set_title('Altitude Profile: Sea Level to Kangchenjunga',
              color='white', fontsize=14, fontweight='bold')

# Panel 2: O2 partial pressure in mmHg
po2_mmhg = o2_pp(h) / 133.322
ax2.plot(h/1000, po2_mmhg, color='#22c55e', lw=2.5)
ax2.set_ylabel('O2 partial pressure (mmHg)', color='white',
               fontsize=11)
ax2.axhline(110, color='#fbbf24', ls='--', lw=1,
            label='Altitude sickness (110 mmHg)')
ax2.axhline(70, color='#ef4444', ls='--', lw=1,
            label='Death zone (70 mmHg)')
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray',
           labelcolor='white')

# Panel 3: Boiling point
ax3.plot(h/1000, boil_pt(h), color='#f59e0b', lw=2.5)
ax3.set_ylabel('Boiling point (C)', color='white', fontsize=11)
ax3.set_xlabel('Altitude (km)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Three-panel altitude profile complete.")
print(f"Altitude range: 0 to 8,586 m (Kangchenjunga)")
print(f"Pressure: {pressure(0)/1000:.1f} to "
      f"{pressure(8586)/1000:.1f} kPa")
print(f"O2: {o2_pp(0)/133.322:.0f} to "
      f"{o2_pp(8586)/133.322:.0f} mmHg")
print(f"Boiling point: {boil_pt(0):.1f} to "
      f"{boil_pt(8586):.1f} C")`,
      challenge: 'Add a fourth panel showing air density (kg/m3) vs altitude. Use the ideal gas law: density = P*M/(R*T). How does density compare to pressure -- same shape, or different?',
      successHint: 'Your three-panel plot is the core visualization of the altitude calculator. In the next lesson we will annotate it with real-world markers that give the curves physical meaning.',
      practice: [
        {
          label: 'Apply',
          prompt: 'Modify the plot to use altitude on the y-axis (vertical) and the physical quantities on the x-axis. This "atmospheric profile" format is common in meteorology. Which orientation makes altitude feel more intuitive?',
          starterCode: `import numpy as np
import matplotlib.pyplot as plt

P0, M, g, R, T_atm = 101325, 0.02896, 9.81, 8.314, 288.15

def pressure(h):
    return P0 * np.exp(-(M * g * h) / (R * T_atm))

h = np.linspace(0, 8586, 500)
fig, ax = plt.subplots(figsize=(6, 10))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')
ax.tick_params(colors='gray')
# Plot pressure on x-axis, altitude on y-axis
ax.plot(pressure(h)/1000, h/1000, color='#3b82f6', lw=2)
ax.set_xlabel('Pressure (kPa)', color='white')
ax.set_ylabel('Altitude (km)', color='white')
ax.set_title('Vertical Pressure Profile', color='white',
             fontweight='bold')
plt.tight_layout()
plt.show()`,
          hint: 'Vertical altitude profiles make it easier to "feel" the height. Horizontal altitude profiles make it easier to compare multiple curves.',
        },
      ],
    },
    {
      title: 'Marking the Danger Zones',
      concept: `A plot without annotations is just a curve. Adding **markers for real-world altitudes** transforms it from abstract math into a tool that tells a story about human survival and snow leopard ecology.

We will mark five altitude zones on the profile. **Base camp** (5,150 m for Kangchenjunga) is where climbers establish their highest permanent camp -- pressure is 54% of sea level, and boiling water at 83 C means freeze-dried food only. **Camp 1 / Acclimatization zone** (5,800-6,200 m) is where climbers spend days letting their bodies produce more red blood cells. **Camp 2** (6,800 m) is an advanced camp above most weather. **The death zone** begins at 8,000 m, where oxygen partial pressure drops below about 70 mmHg -- the human body consumes oxygen faster than it can absorb it, so every hour at this altitude damages cells. **The summit** at 8,586 m has only 34% of sea-level pressure.

We will also shade three ecological bands. The **snow leopard habitat zone** (3,000-5,500 m) where these cats live year-round. The **acclimatization zone** (5,000-7,000 m) where humans can survive with time to adapt. And the **death zone** (8,000 m+) where no mammal can live permanently. These shaded bands on our plot reveal a striking fact: the snow leopard's entire world sits in the altitude range where humans begin to struggle, yet below the zone where even acclimatized humans fail.`,
      analogy: 'Unmarked curves are like unmarked roads. A highway without signs showing "Exit 42," "Speed limit 65," or "Bridge freezes before road" is technically drivable but practically useless. Our altitude markers are the road signs of the mountain -- they tell the viewer exactly where the danger transitions happen and where the snow leopard lives, turning a mathematical curve into a survival guide.',
      storyConnection: 'The story describes the snow leopard as a ghost of the high mountains, appearing and vanishing across ridgelines that humans find exhausting to cross. Our annotated plot shows exactly why: the leopard operates comfortably at 3,000-5,500 m (oxygen at 85-112 mmHg), while a human without acclimatization starts struggling at 2,400 m (110 mmHg). The shaded zones reveal the leopard has claimed the altitude band that is maximally difficult for human intrusion -- an ecological fortress.',
      checkQuestion: 'Why does the "death zone" start at 8,000 m and not at some other altitude? What specific physiological threshold defines it?',
      checkAnswer: 'The death zone is defined by the oxygen partial pressure dropping below approximately 70 mmHg (about 9,300 Pa). At this pressure, hemoglobin oxygen saturation falls below about 70%, meaning tissues cannot get enough oxygen to maintain basic cellular function. The body begins consuming its own muscle protein for energy, cognitive function degrades severely, and without supplemental oxygen, death occurs within 2-3 days regardless of fitness level. The 8,000 m threshold is not arbitrary -- it is where the physics of gas exchange crosses the biological limit of human hemoglobin.',
      codeIntro: 'Add annotated altitude markers and shaded zones to the three-panel altitude profile.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Functions from previous lessons ---
P0, M, g, R, T_atm = 101325, 0.02896, 9.81, 8.314, 288.15
T_REF, P_REF, L_WATER = 373.15, 101325, 40660

def pressure(h):
    return P0 * np.exp(-(M * g * h) / (R * T_atm))

def o2_pp(h):
    return 0.2095 * pressure(h)

def boil_pt(h):
    p = pressure(h)
    inv_T = (1/T_REF) - (R/L_WATER) * np.log(p/P_REF)
    return (1/inv_T) - 273.15

h = np.linspace(0, 8586, 500)

# --- Altitude markers ---
markers = [
    (3000, 'Snow leopard\\nlower range', '#22c55e'),
    (5150, 'Base camp', '#3b82f6'),
    (5500, 'Snow leopard\\nupper range', '#22c55e'),
    (6800, 'Camp 2', '#f59e0b'),
    (8000, 'Death zone', '#ef4444'),
    (8586, 'Summit', '#a855f7'),
]

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(11, 11),
                                      sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Altitude Effects Calculator — Kangchenjunga',
             color='white', fontsize=14, fontweight='bold', y=0.98)

for ax in (ax1, ax2, ax3):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.grid(True, alpha=0.12, color='gray')
    # Shade zones
    ax.axvspan(3.0, 5.5, alpha=0.08, color='#22c55e',
               label='Snow leopard zone')
    ax.axvspan(8.0, 8.586, alpha=0.15, color='#ef4444',
               label='Death zone')

# Plot curves
ax1.plot(h/1000, pressure(h)/1000, color='#3b82f6', lw=2.5)
ax1.set_ylabel('Pressure (kPa)', color='white')

po2 = o2_pp(h) / 133.322
ax2.plot(h/1000, po2, color='#22c55e', lw=2.5)
ax2.set_ylabel('O2 (mmHg)', color='white')
ax2.axhline(110, color='#fbbf24', ls='--', lw=0.8, alpha=0.7)
ax2.axhline(70, color='#ef4444', ls='--', lw=0.8, alpha=0.7)

ax3.plot(h/1000, boil_pt(h), color='#f59e0b', lw=2.5)
ax3.set_ylabel('Boiling point (C)', color='white')
ax3.set_xlabel('Altitude (km)', color='white')

# Add vertical markers to all panels
for alt, label, clr in markers:
    for ax in (ax1, ax2, ax3):
        ax.axvline(alt/1000, color=clr, ls=':', lw=0.8, alpha=0.6)
    ax1.text(alt/1000, ax1.get_ylim()[1]*0.92, label,
             color=clr, fontsize=7, ha='center', va='top')

plt.tight_layout(rect=[0, 0, 1, 0.96])
plt.show()

# Summary table
print("Annotated Altitude Zones")
print("=" * 55)
for alt, label, _ in markers:
    lbl = label.replace('\\n', ' ')
    print(f"  {alt:>5} m  {lbl:<22} "
          f"O2={o2_pp(alt)/133.322:>5.0f} mmHg  "
          f"Boil={boil_pt(alt):.0f} C")`,
      challenge: 'Add a second set of markers for Himalayan wildlife: yak grazing range (3,500-5,200 m), pika habitat (3,000-6,000 m), and bar-headed goose flight altitude (up to 8,800 m). Shade each with a different color and add a legend.',
      successHint: 'Your altitude profile now communicates real-world meaning. Anyone reading it can immediately see where snow leopards live, where humans start struggling, and where survival becomes impossible without oxygen tanks.',
      practice: [
        {
          label: 'Challenge',
          prompt: 'Add horizontal threshold lines on the O2 panel: 110 mmHg (mild altitude sickness), 90 mmHg (severe AMS), 70 mmHg (death zone). Label each threshold. At what altitude does each threshold occur?',
          starterCode: `import numpy as np

P0, M, g, R, T_atm = 101325, 0.02896, 9.81, 8.314, 288.15

def pressure(h):
    return P0 * np.exp(-(M * g * h) / (R * T_atm))

def o2_pp_mmhg(h):
    return 0.2095 * pressure(h) / 133.322

thresholds = [110, 90, 70]
for t in thresholds:
    # Find altitude where O2 = t mmHg
    # O2 = 0.2095 * P0 * exp(-Mgh/RT) / 133.322
    # Solve for h
    target_pa = t * 133.322 / 0.2095
    h_m = -(R * T_atm) / (M * g) * np.log(target_pa / P0)
    print(f"O2 = {t} mmHg at altitude {h_m:.0f} m")`,
          hint: 'Rearrange the combined barometric + O2 formula to isolate h, then use np.log.',
        },
      ],
    },
    {
      title: 'Validating Against Real Data',
      concept: `A model is only as good as its agreement with reality. We have built a calculator based on the **barometric formula** with constant temperature T = 288.15 K, but the real atmosphere is more complex: temperature drops with altitude (the **lapse rate**), humidity affects air density, and local geography creates pressure anomalies. We need to compare our model predictions against **published measurements from high-altitude research stations**.

Key validation data points come from well-documented stations. **Namche Bazaar** (3,440 m) in Nepal, a gateway to Everest, has measured average pressure of about 66,000 Pa. **Jungfraujoch** (3,571 m) in Switzerland has excellent long-term records showing average pressure around 65,200 Pa. **Mauna Kea Observatory** (4,205 m) in Hawaii reports about 61,500 Pa. **Cerro Chajnantor** (5,612 m) in Chile, site of an astronomical observatory, measures about 50,000 Pa.

We will compute our model's prediction for each station, calculate the **percentage error**, and see where our simple formula works well and where it breaks down. The constant-temperature assumption is the biggest weakness: in reality, temperature drops about 6.5 K per kilometer (the "lapse rate"), which makes real pressures slightly different from our isothermal model. Understanding model error is just as important as building the model -- it tells you where you can trust it and where you need corrections.`,
      analogy: 'Validating a model is like calibrating a kitchen scale. You buy a scale that claims to be accurate, but you do not trust it until you weigh something whose weight you already know -- say, a 1 kg bag of flour from the store. If the scale says 1.02 kg, you know it has a 2% error, and you can either live with that or adjust. Our research station data is the "bag of flour" -- measurements we trust because they come from calibrated instruments at known altitudes.',
      storyConnection: 'The snow leopard does not care about our model errors, but conservation scientists do. Estimating oxygen availability in snow leopard habitat requires accurate pressure predictions. If our model is off by 5% at 5,000 m, that translates to an error of several mmHg in O2 partial pressure -- potentially misclassifying whether a habitat is physiologically easy or stressful for these cats. Validation tells us whether our calculator is trustworthy enough for ecological research.',
      checkQuestion: 'Our isothermal model assumes T = 288.15 K at all altitudes. In reality, temperature drops about 6.5 K per km. At 5,000 m, the real temperature is roughly 288.15 - 32.5 = 255.7 K. Will our model over-predict or under-predict pressure at 5,000 m? Why?',
      checkAnswer: 'Our model will slightly over-predict pressure. Colder air is denser, which means the pressure drops faster with altitude in reality than in our warm-air model. The barometric formula exponent is -Mgh/(RT): with smaller T (colder), the exponent becomes more negative, making e^(exponent) smaller, meaning lower pressure. Our model uses T = 288.15 (too warm), giving a less negative exponent and therefore predicting higher pressure than actually measured. The error grows with altitude because the cumulative temperature difference increases.',
      codeIntro: 'Compare model predictions against published measurements from five high-altitude research stations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

P0, M, g, R, T_atm = 101325, 0.02896, 9.81, 8.314, 288.15

def model_pressure(h):
    return P0 * np.exp(-(M * g * h) / (R * T_atm))

# --- Published research station data ---
stations = [
    ('Kathmandu',        1400, 85800),
    ('Namche Bazaar',    3440, 66000),
    ('Jungfraujoch',     3571, 65200),
    ('Mauna Kea',        4205, 61500),
    ('Cerro Chajnantor', 5612, 50000),
]

names = [s[0] for s in stations]
alts  = np.array([s[1] for s in stations])
measured = np.array([s[2] for s in stations])
predicted = np.array([model_pressure(h) for h in alts])
errors = (predicted - measured) / measured * 100

# --- Validation plot ---
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
h_line = np.linspace(0, 6000, 300)
ax1.plot(h_line/1000, model_pressure(h_line)/1000,
         color='#3b82f6', lw=2, label='Model')
ax1.scatter(alts/1000, measured/1000, color='#ef4444',
            s=80, zorder=5, label='Measured')
for n, a, m in zip(names, alts, measured):
    ax1.annotate(n, (a/1000, m/1000), fontsize=7,
                 color='white', xytext=(5, 8),
                 textcoords='offset points')
ax1.set_xlabel('Altitude (km)', color='white')
ax1.set_ylabel('Pressure (kPa)', color='white')
ax1.set_title('Model vs Measured Pressure', color='white',
              fontweight='bold')
ax1.legend(facecolor='#1f2937', edgecolor='gray',
           labelcolor='white', fontsize=9)

ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
colors = ['#22c55e' if abs(e) < 3 else '#f59e0b'
          if abs(e) < 5 else '#ef4444' for e in errors]
ax2.barh(names, errors, color=colors, height=0.5)
ax2.set_xlabel('Model error (%)', color='white')
ax2.set_title('Prediction Error by Station', color='white',
              fontweight='bold')
ax2.axvline(0, color='gray', lw=0.5)

plt.tight_layout()
plt.show()

print("Model Validation Report")
print("=" * 62)
print(f"{'Station':<18} {'Alt':>6} {'Measured':>10} "
      f"{'Predicted':>10} {'Error':>7}")
print("-" * 62)
for n, a, m, p, e in zip(names, alts, measured,
                          predicted, errors):
    print(f"{n:<18} {a:>5}m {m:>9} Pa "
          f"{p:>9.0f} Pa {e:>+6.1f}%")

rmse = np.sqrt(np.mean((predicted - measured)**2))
print(f"\\nRMSE: {rmse:.0f} Pa ({rmse/P0*100:.2f}% of P0)")
print(f"Max error: {max(abs(errors)):.1f}%")`,
      challenge: 'Implement a lapse-rate corrected model that uses T(h) = 288.15 - 0.0065*h instead of constant temperature. The pressure integral becomes P = P0 * (1 - 0.0065*h/288.15)^(g*M/(R*0.0065)). Compare the errors of both models. Which stations show the biggest improvement?',
      successHint: 'You now know exactly how accurate your model is: within 2-4% for most stations, with systematic over-prediction due to the isothermal assumption. A validated model is a trustworthy model.',
      practice: [
        {
          label: 'Reinforce',
          prompt: 'Calculate the mean absolute error (MAE) in addition to RMSE. Which metric is less sensitive to outliers? Which station contributes most to the RMSE?',
          starterCode: `import numpy as np

measured  = np.array([85800, 66000, 65200, 61500, 50000])
predicted = np.array([86058, 67483, 66414, 62196, 51492])

abs_errors = np.abs(predicted - measured)
mae = np.mean(abs_errors)
rmse = np.sqrt(np.mean((predicted - measured)**2))

print(f"MAE:  {mae:.0f} Pa")
print(f"RMSE: {rmse:.0f} Pa")
print(f"Max single error: {max(abs_errors):.0f} Pa")`,
          hint: 'MAE treats all errors equally; RMSE penalizes large errors more heavily because of the squaring. The station with the largest absolute error dominates RMSE.',
        },
      ],
    },
    {
      title: 'Complete Altitude Calculator',
      concept: `Now we combine every piece into a single, polished **Altitude Effects Calculator**. This is real engineering: taking five separate components (barometric formula, O2 calculation, boiling point, annotations, and validation) and assembling them into a cohesive tool that accepts user input and produces a comprehensive report.

The calculator will take a single input -- an altitude in meters -- and produce: (1) atmospheric pressure in both Pascals and kPa, (2) oxygen partial pressure in both Pascals and mmHg, (3) percentage of sea-level oxygen, (4) boiling point of water, (5) which zone the altitude falls in (safe / caution / danger / death zone), and (6) a physiological assessment based on oxygen level.

We will also add a **full-range visualization** that plots all three curves from sea level to 8,586 m, marks the user's chosen altitude with a highlighted point, and shows all the danger zone annotations. This is the difference between a script and a tool: the script computes numbers, while the tool presents those numbers in context with clear labels, warnings, and visualizations. The final step is adding a comparison table showing the user's altitude alongside standard reference altitudes so they can see where they stand relative to base camp, snow leopard habitat, and the death zone.`,
      analogy: 'Building the final calculator is like assembling a Swiss Army knife from individual blades you have already forged. Each blade (barometric formula, O2 calculation, boiling point, markers, validation) works on its own, but the value of the tool comes from combining them into a single, pocket-sized package. The handle (user input and formatted output) is what makes it usable -- without it, you just have a pile of sharp metal.',
      storyConnection: 'With this complete calculator, you can answer any question about the snow leopard story quantitatively. What oxygen level does the leopard breathe at its favorite 4,500 m hunting ground? (Answer: 96 mmHg, 60% of sea level.) Can a human boil water for tea there? (Yes, but only at 85 C.) How much harder is the summit of Kangchenjunga than base camp? (34% vs 54% of sea-level oxygen -- a 37% further reduction.) The calculator turns the poetic story of a mountain ghost into a precise physiological portrait.',
      checkQuestion: 'A mountaineer at 7,500 m asks: "How much supplemental oxygen flow do I need to make the effective altitude equivalent to 5,000 m?" What calculation would you do to answer this?',
      checkAnswer: 'First, find the O2 partial pressure at 5,000 m: 0.2095 * P(5000) = about 11,200 Pa = 84 mmHg. Then find the total pressure at 7,500 m: P(7500) = about 38,500 Pa, giving ambient O2 of 0.2095 * 38,500 = 8,066 Pa = 60 mmHg. The deficit is 84 - 60 = 24 mmHg. The supplemental O2 system must deliver enough pure oxygen to raise the inspired O2 from 60 to 84 mmHg, which requires a flow rate of about 2 L/min with a standard mask (since pure O2 at that pressure provides roughly 12 mmHg per L/min of flow).',
      codeIntro: 'Assemble the complete Altitude Effects Calculator with user input, full visualization, and physiological assessment.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# === Core functions ===
P0, M, g, R, T_atm = 101325, 0.02896, 9.81, 8.314, 288.15
T_REF, P_REF, L_WATER = 373.15, 101325, 40660

def pressure(h):
    return P0 * np.exp(-(M * g * h) / (R * T_atm))

def o2_pp(h):
    return 0.2095 * pressure(h)

def boil_pt(h):
    p = pressure(h)
    inv_T = (1/T_REF) - (R/L_WATER) * np.log(p/P_REF)
    return (1/inv_T) - 273.15

def classify_zone(h):
    if h < 2400: return "Safe zone", "#22c55e"
    if h < 5000: return "Caution zone", "#fbbf24"
    if h < 8000: return "Danger zone", "#f59e0b"
    return "DEATH ZONE", "#ef4444"

# === User input altitude ===
user_alt = 4500  # Change this to explore!

# === Full visualization ===
h = np.linspace(0, 8586, 500)
fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 10),
                                      sharex=True)
fig.patch.set_facecolor('#1f2937')
fig.suptitle(f'Altitude Effects Calculator | Input: {user_alt} m',
             color='white', fontsize=14, fontweight='bold')

for ax in (ax1, ax2, ax3):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.grid(True, alpha=0.12, color='gray')
    ax.axvspan(3.0, 5.5, alpha=0.06, color='#22c55e')
    ax.axvspan(8.0, 8.6, alpha=0.12, color='#ef4444')
    ax.axvline(user_alt/1000, color='white', ls='-', lw=1.5,
               alpha=0.8)

ax1.plot(h/1000, pressure(h)/1000, color='#3b82f6', lw=2.5)
ax1.scatter([user_alt/1000], [pressure(user_alt)/1000],
            color='white', s=100, zorder=5, edgecolors='#3b82f6')
ax1.set_ylabel('Pressure (kPa)', color='white')

po2 = o2_pp(h) / 133.322
ax2.plot(h/1000, po2, color='#22c55e', lw=2.5)
ax2.scatter([user_alt/1000], [o2_pp(user_alt)/133.322],
            color='white', s=100, zorder=5, edgecolors='#22c55e')
ax2.axhline(110, color='#fbbf24', ls='--', lw=0.8, alpha=0.6)
ax2.axhline(70, color='#ef4444', ls='--', lw=0.8, alpha=0.6)
ax2.set_ylabel('O2 (mmHg)', color='white')

ax3.plot(h/1000, boil_pt(h), color='#f59e0b', lw=2.5)
ax3.scatter([user_alt/1000], [boil_pt(user_alt)],
            color='white', s=100, zorder=5, edgecolors='#f59e0b')
ax3.set_ylabel('Boiling point (C)', color='white')
ax3.set_xlabel('Altitude (km)', color='white')

plt.tight_layout(rect=[0, 0, 1, 0.95])
plt.show()

# === Comprehensive report ===
zone, _ = classify_zone(user_alt)
p = pressure(user_alt)
po2_val = o2_pp(user_alt)
bp = boil_pt(user_alt)
o2_pct = (po2_val / o2_pp(0)) * 100

print("=" * 55)
print("  ALTITUDE EFFECTS CALCULATOR — REPORT")
print("=" * 55)
print(f"  Input altitude:    {user_alt:,} m")
print(f"  Zone:              {zone}")
print(f"  Pressure:          {p:,.0f} Pa ({p/1000:.1f} kPa)")
print(f"  O2 partial press.: {po2_val:,.0f} Pa "
      f"({po2_val/133.322:.0f} mmHg)")
print(f"  O2 vs sea level:   {o2_pct:.1f}%")
print(f"  Boiling point:     {bp:.1f} C")
print("-" * 55)

# Comparison table
refs = [('Sea level', 0), ('Tawang', 3048),
        ('Snow leopard (low)', 3000),
        ('Your altitude', user_alt),
        ('Snow leopard (high)', 5500),
        ('Base camp', 5150), ('Death zone', 8000),
        ('Summit', 8586)]
print(f"{'Location':<22} {'Alt':>6} {'O2%':>6} {'Boil':>6}")
print("-" * 44)
for name, alt in sorted(refs, key=lambda x: x[1]):
    pct = (o2_pp(alt) / o2_pp(0)) * 100
    tag = " <--" if alt == user_alt else ""
    print(f"{name:<22} {alt:>5}m {pct:>5.0f}% "
          f"{boil_pt(alt):>5.1f}C{tag}")`,
      challenge: 'Add a function that takes two altitudes and computes the "altitude cost" of moving between them: the change in O2 partial pressure, the change in boiling point, and an estimated time to acclimatize (roughly 1 day per 300 m above 3,000 m). Print a travel advisory for a trek from 3,000 m to 5,500 m.',
      successHint: 'You have built a complete, validated Altitude Effects Calculator from scratch -- starting from a single equation (the barometric formula) and ending with a tool that produces visualizations, comparisons, and physiological assessments. This is what real scientific software looks like: physics in, decisions out.',
      practice: [
        {
          label: 'Apply',
          prompt: 'Modify the calculator to accept a list of altitudes (simulating a trekking route) and print a day-by-day report showing conditions at each stop. Include a warning if the altitude gain between consecutive days exceeds 500 m above 3,000 m.',
          starterCode: `import numpy as np

P0, M, g, R, T_atm = 101325, 0.02896, 9.81, 8.314, 288.15

def pressure(h):
    return P0 * np.exp(-(M * g * h) / (R * T_atm))
def o2_pp(h):
    return 0.2095 * pressure(h)

route = [2800, 3200, 3600, 3600, 4100, 4100, 4500, 5000, 5150]
print("Trekking Route Report")
print("=" * 50)
for day, alt in enumerate(route, 1):
    o2_pct = o2_pp(alt) / o2_pp(0) * 100
    gain = alt - route[day-2] if day > 1 else 0
    warn = " WARNING: >500m gain!" if gain > 500 and alt > 3000 else ""
    print(f"Day {day}: {alt}m | O2: {o2_pct:.0f}% | "
          f"Gain: {gain:+d}m{warn}")`,
          hint: 'Rest days (same altitude as previous day) are essential for acclimatization above 3,000 m. The route above includes two rest days.',
        },
        {
          label: 'Challenge',
          prompt: 'Export the calculator results as a CSV string. Each row should have: altitude, pressure_pa, pressure_kpa, o2_pa, o2_mmhg, o2_pct, boiling_c, zone. Generate rows for every 100 m from 0 to 8,586 m.',
          starterCode: `import numpy as np

P0, M, g, R, T_atm = 101325, 0.02896, 9.81, 8.314, 288.15
T_REF, P_REF, L_WATER = 373.15, 101325, 40660

def pressure(h):
    return P0 * np.exp(-(M * g * h) / (R * T_atm))
def o2_pp(h):
    return 0.2095 * pressure(h)
def boil_pt(h):
    p = pressure(h)
    inv_T = (1/T_REF) - (R/L_WATER) * np.log(p/P_REF)
    return (1/inv_T) - 273.15
def zone(h):
    if h < 2400: return "safe"
    if h < 5000: return "caution"
    if h < 8000: return "danger"
    return "death"

lines = ["altitude_m,pressure_pa,pressure_kpa,o2_pa,o2_mmhg,o2_pct,boiling_c,zone"]
for alt in range(0, 8600, 100):
    p = pressure(alt)
    o2 = o2_pp(alt)
    bp = boil_pt(alt)
    pct = o2 / o2_pp(0) * 100
    lines.append(f"{alt},{p:.0f},{p/1000:.1f},{o2:.0f},"
                 f"{o2/133.322:.1f},{pct:.1f},{bp:.1f},{zone(alt)}")

csv_text = "\\n".join(lines)
print(csv_text[:500])
print(f"\\n... ({len(lines)-1} data rows total)")`,
          hint: 'CSV export makes your calculator useful to others who might want to import the data into Excel or another analysis tool.',
        },
      ],
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build an Altitude Effects Calculator from sea level to 8,586 m</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build an altitude effects calculator. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
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
            practice={lesson.practice}
            diagram={diagrams[i] ? createElement(diagrams[i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
