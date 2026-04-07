import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CloudWeaverLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Yarn count and denier — measuring thread thickness',
      concept: `In Level 1 we learned that fibres are twisted into yarn. But how thick is the yarn? The textile industry uses two systems to measure this:

- **Denier**: the weight in grams of 9,000 metres of yarn. A single silk filament is about 1 denier. Stockings are 15-30 denier. Rope can be 1000+ denier. Higher denier = thicker yarn.
- **Tex**: the weight in grams of 1,000 metres. (1 tex = 9 denier)
- **Count (Ne)**: the number of 840-yard lengths per pound. Used for cotton. Higher count = thinner yarn (inverse of denier).

The confusing part: in the denier/tex system, higher numbers mean thicker yarn. In the count system, higher numbers mean thinner yarn. This historical inconsistency causes endless confusion.

Why it matters: yarn thickness determines fabric weight, drape, strength, and feel. A 150-denier polyester is tough (backpack fabric). A 20-denier nylon is sheer (stockings). Choosing the right yarn count is the first engineering decision in fabric design.`,
      analogy: 'Denier is like measuring wire gauge, but backwards. In wire gauge, higher numbers mean thinner wire. In denier, higher numbers mean thicker yarn. It is as if two different professions invented rulers that go in opposite directions — and both stuck.',
      storyConnection: 'The Cloud Weaver was said to spin thread "so fine it was invisible, yet strong enough to hold the weight of rain." In denier terms, that would be an impossibly low denier with impossibly high tensile strength — the holy grail of textile engineering. Spider silk comes closest: ~1 denier with strength rivaling steel.',
      checkQuestion: 'Spider silk has a tensile strength of about 1.1 GPa and a denier of roughly 1. Why don\'t we farm spiders for silk?',
      checkAnswer: 'Spiders are territorial cannibals — put them together and they eat each other. Unlike silkworms, they cannot be domesticated. Researchers have genetically engineered goats and bacteria to produce spider silk proteins, but scaling up remains expensive. A spider silk farm is a biology problem, not a textile one.',
      codeIntro: 'Convert between yarn measurement systems and visualize yarn thickness relationships.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Denier values for common yarns
yarns = {
    'Spider silk': 1,
    'Silk filament': 1.25,
    'Fine nylon (stockings)': 15,
    'Cotton thread (sewing)': 40,
    'Muga silk yarn': 20,
    'Polyester (shirt)': 75,
    'Nylon (jacket)': 210,
    'Cordura (backpack)': 500,
    'Rope yarn': 1200,
}

# Convert to tex and approximate diameter
names = list(yarns.keys())
deniers = list(yarns.values())
tex = [d / 9 for d in deniers]

# Approximate diameter: d (mm) = 0.009 * sqrt(denier / density)
# Using density ~1.3 g/cm3 average
diameters = [0.009 * np.sqrt(d / 1.3) for d in deniers]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Denier bar chart (log scale)
ax1.set_facecolor('#111827')
colors = plt.cm.viridis(np.linspace(0.2, 0.9, len(names)))
bars = ax1.barh(names, deniers, color=colors)
ax1.set_xscale('log')
ax1.set_xlabel('Denier (log scale)', color='white')
ax1.set_title('Yarn Thickness in Denier', color='white', fontsize=13)
ax1.tick_params(colors='gray')
for bar, d in zip(bars, deniers):
    ax1.text(bar.get_width() * 1.1, bar.get_y() + bar.get_height()/2,
             f'{d}D', va='center', color='white', fontsize=9)

# Diameter visualization
ax2.set_facecolor('#111827')
for i, (name, diam) in enumerate(zip(names, diameters)):
    circle = plt.Circle((2, len(names) - i), diam * 15, color=colors[i], alpha=0.8)
    ax2.add_patch(circle)
    ax2.text(4, len(names) - i, f'{name}: {diam:.3f}mm', va='center', color='white', fontsize=8)

ax2.set_xlim(0, 12)
ax2.set_ylim(-0.5, len(names) + 0.5)
ax2.set_title('Approximate Yarn Diameter', color='white', fontsize=13)
ax2.set_aspect('equal')
ax2.axis('off')

plt.tight_layout()
plt.show()

print("Conversion formulas:")
print("  Tex = Denier / 9")
print("  Ne (cotton count) = 5315 / Denier")
print()
for name, d in yarns.items():
    print(f"  {name}: {d}D = {d/9:.1f} tex = Ne {5315/d:.0f}")`,
      challenge: 'Add Kevlar (1500 denier) and carbon fibre (800 denier) to the chart. These are technical textiles used in body armour and aerospace.',
      successHint: 'Denier is the language of the textile industry. Knowing it lets you read spec sheets, compare fabrics quantitatively, and make engineering decisions about which yarn to use for which application.',
    },
    {
      title: 'Fabric testing — tensile and abrasion',
      concept: `How do you know if a fabric is "good"? Not by feel alone — textile engineers use standardized tests:

**Tensile testing** (ASTM D5034): Clamp a strip of fabric and pull it until it breaks. Measure:
- **Breaking force** (Newtons): how much force to tear it
- **Elongation at break** (%): how much it stretches before tearing
- **Modulus**: stiffness (force per unit stretch)

**Abrasion testing** (Martindale method): Rub fabric against a standard abrasive under controlled pressure. Count cycles until:
- A hole appears, or
- Weight loss exceeds a threshold

Results in "Martindale cycles": cotton shirting ~15,000; denim ~25,000; nylon backpack >100,000.

**Pilling test** (ICI method): tumble fabric samples in a box with cork liners. Rate pilling after a set time on a 1-5 scale (5 = no pills).

These tests turn subjective impressions ("this feels sturdy") into objective numbers that can be specified, compared, and guaranteed.`,
      analogy: 'Fabric testing is like crash-testing cars. You destroy the product under controlled conditions to measure its limits. Just as a car gets a safety rating (5 stars), a fabric gets tensile strength, abrasion cycles, and pilling score. Numbers replace guesswork.',
      storyConnection: 'The Cloud Weaver\'s cloth was said to "never wear, never tear, never fade." In textile testing terms, that would be infinite tensile strength, infinite Martindale cycles, and perfect colour fastness — a theoretical ideal that real engineering approaches but never reaches.',
      checkQuestion: 'Two fabrics have the same breaking force, but one has 5% elongation and the other has 30%. Which is better for a backpack strap?',
      checkAnswer: 'The low-elongation fabric (5%). A backpack strap should not stretch — you want the load to stay in place. High elongation is desirable for sportswear (needs to move with the body) but not for structural applications. "Better" depends entirely on the application.',
      codeIntro: 'Simulate a tensile test: stress-strain curves for different fabrics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate stress-strain curves for different fabrics
strain = np.linspace(0, 0.6, 300)  # 0 to 60% elongation

def stress_curve(modulus, break_strain, break_stress):
    """Simple model: linear to yield, then curve to break."""
    stress = np.zeros_like(strain)
    for i, s in enumerate(strain):
        if s <= break_strain:
            # Polynomial fit for realistic curve shape
            t = s / break_strain
            stress[i] = break_stress * (1.5 * t - 0.5 * t**2)
        else:
            stress[i] = np.nan  # fabric has broken
    return stress

fabrics = {
    'Cotton (plain)': (0.08, 25),    # break_strain, break_stress (MPa)
    'Wool (twill)': (0.30, 15),
    'Silk (satin)': (0.20, 40),
    'Nylon': (0.40, 70),
    'Polyester': (0.15, 55),
    'Muga silk': (0.22, 45),
}

colors = ['#22c55e', '#f59e0b', '#a855f7', '#3b82f6', '#ef4444', '#06b6d4']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Stress-strain curves
ax1.set_facecolor('#111827')
for (name, (bs, bst)), c in zip(fabrics.items(), colors):
    stress = stress_curve(None, bs, bst)
    ax1.plot(strain * 100, stress, linewidth=2, label=name, color=c)
    # Mark break point
    ax1.plot(bs * 100, bst * 1.0, 'x', color=c, markersize=10, markeredgewidth=2)

ax1.set_xlabel('Strain (% elongation)', color='white')
ax1.set_ylabel('Stress (MPa)', color='white')
ax1.set_title('Tensile Test: Stress vs Strain', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.annotate('x = break point', xy=(0.7, 0.95), xycoords='axes fraction',
             color='gray', fontsize=9)

# Abrasion resistance (Martindale cycles)
ax2.set_facecolor('#111827')
abrasion = {
    'Cotton shirt': 15000,
    'Wool suit': 20000,
    'Silk blouse': 5000,
    'Nylon bag': 100000,
    'Denim jeans': 25000,
    'Muga mekhela': 18000,
}
names = list(abrasion.keys())
cycles = list(abrasion.values())
bars = ax2.barh(names, cycles, color=colors)
ax2.set_xlabel('Martindale cycles to failure', color='white')
ax2.set_title('Abrasion Resistance', color='white', fontsize=13)
ax2.tick_params(colors='gray')
for bar, cyc in zip(bars, cycles):
    ax2.text(bar.get_width() + 1000, bar.get_y() + bar.get_height()/2,
             f'{cyc:,}', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Key engineering insights:")
print("  Nylon: stretches most AND is strongest (great for ropes, bags)")
print("  Silk: strong but breaks at modest elongation")
print("  Wool: weak but very stretchy (forgiving fabric)")
print("  Cotton: moderate in all respects (versatile workhorse)")
print()
print("The x marks show WHERE each fabric fails — that's the")
print("engineering limit you design around.")`,
      challenge: 'Add Kevlar to the stress-strain plot (break strain: 3.5%, break stress: 200 MPa). How does its curve shape differ from all the others?',
      successHint: 'The stress-strain curve is the fingerprint of a fabric. It tells you everything: stiffness, elasticity, toughness, and breaking point. Textile engineers read these curves the way doctors read ECGs.',
    },
    {
      title: 'Dyeing chemistry — how colour bonds to fibre',
      concept: `Dyeing is not just soaking fabric in coloured water. It is **chemistry**: the dye molecule must form a bond with the fibre molecule, or the colour will wash out.

Different fibres need different dye types:
- **Cellulose fibres (cotton, linen)**: use **reactive dyes** — they form covalent bonds with the hydroxyl groups on cellulose
- **Protein fibres (wool, silk)**: use **acid dyes** — ionic bonds between dye sulphonate groups and fibre amino groups
- **Synthetic fibres (polyester)**: use **disperse dyes** — no bond at all; dye molecules physically dissolve into the fibre at high temperature (like sugar dissolving into hot water)

The dyeing process involves:
1. **Dissolution**: dissolve dye in water
2. **Adsorption**: dye molecules move to fibre surface
3. **Absorption/Diffusion**: dye molecules penetrate inside the fibre
4. **Fixation**: dye bonds to fibre (or gets trapped inside)

Temperature, pH, salt concentration, and time all affect the outcome. Traditional dyers in Assam controlled these variables intuitively — using wood ash for pH, specific boiling times, and mordants like iron or alum.`,
      analogy: 'Dyeing is like writing on different surfaces with different pens. A permanent marker bonds to paper (reactive dye on cotton). A dry-erase marker sits on a whiteboard surface and can be wiped off (disperse dye on polyester before heat-setting). An ink stamp on wet clay embeds itself permanently (acid dye on wool).',
      storyConnection: 'The Cloud Weaver was said to "catch the colours of sunset and weave them into cloth." Real dyers do something similar: they take colour from one substance (plant, mineral, chemical) and transfer it permanently to fibre. The chemistry of bonding is what makes a colour "stay."',
      checkQuestion: 'Why does a red sock turn white clothes pink in the washing machine?',
      checkAnswer: 'The dye on the sock was not properly fixed — either the wrong dye type was used, or the fixation step was inadequate. Unfixed dye molecules dissolve into the wash water and then adsorb onto other fabrics. Professional dyeing includes multiple wash-off steps to remove unfixed dye. Your red sock skipped quality control.',
      codeIntro: 'Model dye uptake kinetics: how dye concentration in solution changes over time during dyeing.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Dye uptake follows first-order kinetics
# C_solution(t) = C0 * exp(-k * t)
# C_fibre(t) = C0 * (1 - exp(-k * t))

time = np.linspace(0, 120, 200)  # minutes
C0 = 100  # initial dye concentration (arbitrary units)

# Different dye-fibre combinations have different rate constants
systems = {
    'Reactive dye on cotton (60°C)': 0.03,
    'Acid dye on wool (100°C)': 0.05,
    'Disperse dye on polyester (130°C)': 0.02,
    'Natural indigo on cotton': 0.015,
}

colors = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Dye remaining in solution
ax1.set_facecolor('#111827')
for (name, k), c in zip(systems.items(), colors):
    C_solution = C0 * np.exp(-k * time)
    ax1.plot(time, C_solution, linewidth=2, label=name, color=c)
    # Mark 90% exhaustion
    t90 = -np.log(0.1) / k
    if t90 < 120:
        ax1.plot(t90, C0 * 0.1, 'o', color=c, markersize=6)

ax1.set_xlabel('Time (minutes)', color='white')
ax1.set_ylabel('Dye in solution (%)', color='white')
ax1.set_title('Dye Exhaustion from Solution', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Dye absorbed by fibre
ax2.set_facecolor('#111827')
for (name, k), c in zip(systems.items(), colors):
    C_fibre = C0 * (1 - np.exp(-k * time))
    ax2.plot(time, C_fibre, linewidth=2, label=name, color=c)

ax2.set_xlabel('Time (minutes)', color='white')
ax2.set_ylabel('Dye on fibre (%)', color='white')
ax2.set_title('Dye Uptake by Fibre', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')
ax2.axhline(90, color='gray', linestyle=':', linewidth=0.5)
ax2.text(2, 92, '90% uptake target', color='gray', fontsize=8)

plt.tight_layout()
plt.show()

print("Time to reach 90% dye uptake:")
for name, k in systems.items():
    t90 = -np.log(0.1) / k
    print(f"  {name}: {t90:.0f} minutes")
print()
print("Faster uptake = less dye wasted in the effluent.")
print("Slower uptake = more dye goes down the drain (pollution).")`,
      challenge: 'What if you raise the temperature? Higher temperature increases k. Double the rate constant for natural indigo (0.015 -> 0.03). How much faster does it reach 90%?',
      successHint: 'Dyeing kinetics determine how much dye is wasted, how much water is polluted, and how long the process takes. Optimizing k is both an economic and environmental imperative.',
    },
    {
      title: 'Smart textiles — fabrics that sense and respond',
      concept: `Smart textiles (e-textiles) are fabrics embedded with electronics, sensors, or responsive materials. They bridge textile engineering and computer science.

Categories:
- **Passive smart**: sense the environment but don't react (fabric with embedded sensors, e.g., strain gauges woven into cloth)
- **Active smart**: sense AND react (photochromic fabrics that darken in sunlight, thermochromic fabrics that change colour with temperature)
- **Ultra-smart**: sense, react, AND adapt (fabrics with microprocessors that adjust heating, compression, or stiffness based on data)

Current applications:
- Heart-rate-monitoring shirts (conductive yarns as ECG electrodes)
- Heated jackets (carbon fibre heating elements woven into fabric)
- Pressure-sensing insoles (piezoelectric fibres detect foot strike patterns)
- Shape-memory fabrics (self-folding origami textiles for deployable structures)

The enabling technology is **conductive yarn** — yarn made from or coated with conductive materials (silver, carbon, conductive polymers). These yarns can be woven or knitted into circuits directly.`,
      analogy: 'A smart textile is like putting a smartphone inside a shirt. The fabric is the case, conductive yarns are the wires, and the sensors are the apps. The difference from simply strapping a device to your body is that the sensing is distributed — the entire garment becomes the sensor.',
      storyConnection: 'The Cloud Weaver\'s cloth was said to change colour with the wearer\'s emotions — warm gold when happy, cool blue when sad. Thermochromic and electrochromic fabrics can already change colour in response to temperature or electrical signals. "Emotion-sensing" fabric is a research goal, not a fantasy.',
      checkQuestion: 'Why can\'t you just wash a smart textile in a regular washing machine?',
      checkAnswer: 'Water can short-circuit conductive pathways, mechanical agitation can break delicate electronic connections, and detergents can corrode metal-coated yarns. Some smart textiles are washable (encapsulated electronics, waterproof coatings), but most require special care. Washability is one of the biggest unsolved problems in e-textiles.',
      codeIntro: 'Simulate a conductive yarn sensor: resistance changes with stretching (strain gauge principle).',
      code: `import numpy as np
import matplotlib.pyplot as plt

# A conductive yarn acts as a strain gauge
# Resistance changes with stretch: R = R0 * (1 + GF * strain)
# GF = gauge factor (sensitivity)

time = np.linspace(0, 10, 1000)  # seconds

# Simulate arm bending (cyclical strain)
strain = 0.05 * np.sin(2 * np.pi * 0.5 * time)  # 5% strain, 0.5 Hz
strain += 0.02 * np.sin(2 * np.pi * 2 * time)    # high-freq noise (muscle tremor)
strain = np.maximum(strain, 0)  # strain can't be negative (fabric doesn't compress well)

R0 = 100  # base resistance in ohms
GF = 2.5  # gauge factor for silver-coated yarn

resistance = R0 * (1 + GF * strain)

# Voltage divider to convert to measurable voltage
V_supply = 3.3  # volts
R_fixed = 100   # reference resistor
voltage = V_supply * R_fixed / (R_fixed + resistance)

fig, axes = plt.subplots(3, 1, figsize=(12, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

# Strain
axes[0].set_facecolor('#111827')
axes[0].plot(time, strain * 100, color='#22c55e', linewidth=1.5)
axes[0].set_ylabel('Strain (%)', color='white')
axes[0].set_title('Smart Textile Strain Sensor Simulation', color='white', fontsize=13)
axes[0].tick_params(colors='gray')

# Resistance
axes[1].set_facecolor('#111827')
axes[1].plot(time, resistance, color='#f59e0b', linewidth=1.5)
axes[1].set_ylabel('Resistance (ohms)', color='white')
axes[1].tick_params(colors='gray')

# Voltage output
axes[2].set_facecolor('#111827')
axes[2].plot(time, voltage, color='#3b82f6', linewidth=1.5)
axes[2].set_ylabel('Sensor voltage (V)', color='white')
axes[2].set_xlabel('Time (seconds)', color='white')
axes[2].tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("How it works:")
print(f"  Base resistance: {R0} ohms")
print(f"  Gauge factor: {GF} (higher = more sensitive)")
print(f"  Max strain: {np.max(strain)*100:.1f}%")
print(f"  Resistance range: {np.min(resistance):.1f} - {np.max(resistance):.1f} ohms")
print(f"  Voltage range: {np.min(voltage):.3f} - {np.max(voltage):.3f} V")
print()
print("A microcontroller reads the voltage, converts it to strain,")
print("and infers body motion. This is how smart shirts track movement.")`,
      challenge: 'Change the gauge factor to 10 (some carbon nanotube yarns achieve this). How does the voltage signal change? Higher GF means easier to detect small movements.',
      successHint: 'Smart textiles merge two ancient crafts — weaving and electronics. The conductive yarn is both a textile element and a circuit component. This convergence is creating entirely new product categories.',
    },
    {
      title: 'Industrial knitting machines — automated fabric construction',
      concept: `Knitting is different from weaving. In weaving, two thread sets cross each other. In knitting, a single yarn forms interlocking loops.

**Weft knitting**: loops are formed across the width (like hand knitting). Stretchy, used for T-shirts, socks, sweaters.
**Warp knitting**: loops are formed along the length. More stable, used for swimwear, lace, sportswear.

Industrial knitting machines are extraordinary:
- A modern circular knitting machine has **2000+ needles** arranged in a circle
- It produces a continuous tube of fabric at **30+ metres per hour**
- Each needle performs **1200 loops per minute**
- A single machine can produce 500 kg of fabric per day

**Flatbed knitting machines** can produce shaped panels — knitting the sleeve, body, and collar of a shirt in one piece (3D knitting), eliminating cutting waste.

**Whole-garment machines** (Shima Seiki, Stoll) knit a complete shirt, socks, or gloves with zero seams. This is the future: design a garment on a computer, press a button, and the machine knits it — like 3D printing, but with yarn.`,
      analogy: 'A circular knitting machine is like a very fast, very precise spider spinning a web in a circle. Each needle is a tiny mechanical finger forming a loop, passing the yarn to the next finger, forming the next loop. 2000 fingers working in unison, 1200 times per minute.',
      storyConnection: 'The Cloud Weaver\'s loom "moved on its own, faster than the eye could follow, producing cloth without seam or edge." A modern whole-garment knitting machine does exactly this: automated, fast, seamless. The story described 21st-century technology in the language of myth.',
      checkQuestion: 'Why does a knitted T-shirt stretch more than a woven dress shirt, even if both are 100% cotton?',
      checkAnswer: 'In knitting, the yarn forms loops that can open and close. Pulling the fabric straightens the loops, allowing stretch. In weaving, threads cross at right angles with minimal slack — there is nowhere to stretch. Knit structure = stretchy. Woven structure = stable. Same yarn, different architecture, different behaviour.',
      codeIntro: 'Visualize the geometry of knit loops and calculate fabric properties from loop dimensions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Model a single knit loop as a mathematical curve
# Using a simplified sinusoidal model

t = np.linspace(0, 2 * np.pi, 100)

# Course (horizontal row of loops)
loop_width = 2.0   # mm
loop_height = 3.0  # mm

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# 1. Single loop anatomy
ax = axes[0]
ax.set_facecolor('#111827')
x = loop_width * np.sin(t) / 2
y = loop_height * (t / (2 * np.pi) - 0.5)
ax.plot(x, y, color='#22c55e', linewidth=3)
ax.plot(x[0], y[0], 'o', color='#f59e0b', markersize=8, label='Needle loop')
ax.plot(x[50], y[50], 's', color='#ef4444', markersize=8, label='Sinker loop')
ax.set_title('Single Knit Loop', color='white', fontsize=11)
ax.set_aspect('equal')
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# 2. Knit fabric grid (5x5 loops)
ax = axes[1]
ax.set_facecolor('#111827')
rows = 6
cols = 8
for row in range(rows):
    for col in range(cols):
        offset_x = col * loop_width
        offset_y = row * loop_height
        phase = np.pi if col % 2 == 0 else 0
        lx = offset_x + loop_width * np.sin(t + phase) / 3
        ly = offset_y + loop_height * t / (2 * np.pi)
        color = '#22c55e' if row % 2 == 0 else '#3b82f6'
        ax.plot(lx, ly, color=color, linewidth=1.5, alpha=0.8)

ax.set_title(f'Knit Fabric ({rows} courses x {cols} wales)', color='white', fontsize=11)
ax.set_aspect('equal')
ax.tick_params(colors='gray')

# 3. Production statistics
ax = axes[2]
ax.set_facecolor('#111827')
machines = ['Hand\\\nknitting', 'Flat\\\nmachine', 'Circular\\\n(small)', 'Circular\\\n(large)', 'Whole\\\ngarment']
speed_m_hr = [0.05, 5, 15, 30, 2]  # metres per hour
garments_day = [0.3, 20, 80, 200, 50]  # equivalent garments

x_pos = np.arange(len(machines))
bars = ax.bar(x_pos, speed_m_hr, color=['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'])
ax.set_xticks(x_pos)
ax.set_xticklabels(machines, color='white', fontsize=8)
ax.set_ylabel('Metres fabric/hour', color='white')
ax.set_title('Knitting Machine Speed', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, s in zip(bars, speed_m_hr):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
            f'{s}', ha='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Knit fabric math:")
print(f"  Loop width (wale spacing): {loop_width} mm")
print(f"  Loop height (course spacing): {loop_height} mm")
print(f"  Wales per cm: {10/loop_width:.0f}")
print(f"  Courses per cm: {10/loop_height:.1f}")
print(f"  Loops per cm²: {(10/loop_width)*(10/loop_height):.0f}")
print()
yarn_per_loop = np.pi * np.sqrt((loop_width/2)**2 + loop_height**2)
print(f"  Yarn per loop: ~{yarn_per_loop:.1f} mm")
print(f"  Yarn for 1m² fabric: ~{yarn_per_loop * (10/loop_width) * (10/loop_height) * 10000 / 1000:.0f} metres")`,
      challenge: 'If a circular machine has 2000 needles and runs at 1200 loops/minute/needle, how many loops does it create per second? How many square centimetres of fabric is that?',
      successHint: 'Industrial knitting is where textile tradition meets precision engineering. Understanding loop geometry lets you predict fabric weight, stretch, and coverage from first principles.',
    },
    {
      title: 'Circular economy in fashion — closing the loop',
      concept: `The linear model of fashion is: extract resources -> make fabric -> sew garments -> wear -> discard. This produces 92 million tonnes of waste per year. The **circular economy** model replaces this with: make -> wear -> collect -> recycle/reuse -> make again.

Key strategies:
- **Design for disassembly**: use mono-material construction (100% polyester, not blends) so the garment can be recycled. Blended fabrics (polycotton) are nearly impossible to recycle because you can't separate the fibres.
- **Mechanical recycling**: shred old garments back into fibres, spin into new yarn. Works for cotton and wool. Quality degrades each cycle.
- **Chemical recycling**: dissolve old polyester into its monomers, re-polymerize into virgin-quality yarn. Energy-intensive but truly circular.
- **Resale and repair**: extend garment lifespan. Doubling the useful life of clothes reduces their environmental impact by 44%.

The NE India model: traditional handloom garments are mono-material (100% muga, 100% cotton), designed to last decades, and repaired rather than replaced. They are inherently more circular than fast fashion.`,
      analogy: 'The linear fashion model is like using paper plates — convenient, but you throw them away after one meal. The circular model is like using ceramic plates — you wash them and reuse them. If a plate chips, you repair it. If it finally breaks beyond repair, you grind it into material for new plates.',
      storyConnection: 'The Cloud Weaver\'s cloth was passed down through generations, "growing softer with age, never wearing out." This describes the ideal circular textile: durable, improves with use, infinitely long-lived. Traditional Assamese muga silk actually does get softer and more lustrous with washing — a real-world parallel.',
      checkQuestion: 'Why is a 60% cotton / 40% polyester blend shirt one of the worst things you can buy from a sustainability perspective?',
      checkAnswer: 'You get the worst of both worlds. The cotton requires pesticides and water. The polyester sheds microplastics. And the blend is nearly impossible to recycle because the two fibres cannot be economically separated. After one life of wear, it goes to landfill. Mono-material garments are far easier to recycle.',
      codeIntro: 'Model the material flow in linear vs. circular fashion systems.',
      code: `import numpy as np
import matplotlib.pyplot as plt

years = np.arange(0, 21)

# Linear model: new resources in, waste out
annual_production = 100  # arbitrary units
linear_virgin_material = annual_production * np.ones_like(years, dtype=float)
linear_waste = annual_production * np.ones_like(years, dtype=float)
linear_cumulative_waste = np.cumsum(linear_waste)

# Circular model: gradually increasing recycling rate
# Start at 10% recycling, increase 4% per year
recycling_rate = np.minimum(0.10 + 0.04 * years, 0.80)  # cap at 80%
circular_virgin_material = annual_production * (1 - recycling_rate)
circular_waste = annual_production * (1 - recycling_rate) * 0.3  # some waste even from virgin
circular_cumulative_waste = np.cumsum(circular_waste)

fig, axes = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Linear vs Circular Fashion: 20-Year Model', color='white', fontsize=14)

# Virgin material needed
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(years, linear_virgin_material, color='#ef4444', linewidth=2, label='Linear')
ax.plot(years, circular_virgin_material, color='#22c55e', linewidth=2, label='Circular')
ax.fill_between(years, circular_virgin_material, linear_virgin_material, alpha=0.15, color='#22c55e')
ax.set_ylabel('Virgin material needed', color='white')
ax.set_title('Raw Material Demand', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# Recycling rate
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(years, recycling_rate * 100, color='#3b82f6', linewidth=2)
ax.fill_between(years, recycling_rate * 100, alpha=0.15, color='#3b82f6')
ax.set_ylabel('Recycling rate (%)', color='white')
ax.set_title('Circular Economy Transition', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Annual waste
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.bar(years - 0.2, linear_waste, 0.4, color='#ef4444', alpha=0.7, label='Linear')
ax.bar(years + 0.2, circular_waste, 0.4, color='#22c55e', alpha=0.7, label='Circular')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Annual waste', color='white')
ax.set_title('Waste Generation', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

# Cumulative waste
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(years, linear_cumulative_waste, color='#ef4444', linewidth=2, label='Linear')
ax.plot(years, circular_cumulative_waste, color='#22c55e', linewidth=2, label='Circular')
ax.fill_between(years, circular_cumulative_waste, linear_cumulative_waste, alpha=0.15, color='#22c55e')
ax.set_xlabel('Year', color='white')
ax.set_ylabel('Total cumulative waste', color='white')
ax.set_title('Cumulative Waste (the real cost)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

saved = linear_cumulative_waste[-1] - circular_cumulative_waste[-1]
print(f"After 20 years:")
print(f"  Linear cumulative waste: {linear_cumulative_waste[-1]:.0f} units")
print(f"  Circular cumulative waste: {circular_cumulative_waste[-1]:.0f} units")
print(f"  Waste reduction: {saved:.0f} units ({saved/linear_cumulative_waste[-1]*100:.0f}%)")
print()
virgin_saved = np.sum(linear_virgin_material - circular_virgin_material)
print(f"  Virgin material saved: {virgin_saved:.0f} units")
print(f"  That's {virgin_saved/np.sum(linear_virgin_material)*100:.0f}% less extraction from the Earth.")`,
      challenge: 'What if the recycling rate caps at 50% instead of 80%? Some experts think 50% is realistic for the next 20 years. How does this change the waste reduction?',
      successHint: 'The circular economy is not just environmentalism — it is engineering economics. Every unit of recycled material is a unit not extracted, not processed, and not shipped from scratch. The Cloud Weaver\'s eternal cloth is the circular ideal.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 textile concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for textile engineering simulations. Click to start.</p>
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
            />
        ))}
      </div>
    </div>
  );
}