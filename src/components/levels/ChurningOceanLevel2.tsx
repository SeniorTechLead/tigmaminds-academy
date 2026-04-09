import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import ChurningPolarityDiagram from '../diagrams/ChurningPolarityDiagram';
import ChurningCentrifugeDiagram from '../diagrams/ChurningCentrifugeDiagram';
import ChurningTitrationDiagram from '../diagrams/ChurningTitrationDiagram';
import ChurningDistillationDiagram from '../diagrams/ChurningDistillationDiagram';
import ChurningEmulsifierDiagram from '../diagrams/ChurningEmulsifierDiagram';
import ChurningSeparationPipelineDiagram from '../diagrams/ChurningSeparationPipelineDiagram';

export default function ChurningOceanLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Molecular polarity — why oil and water refuse to mix',
      concept: `In Level 1 you saw that oil floats on water because it is less dense. But there is a deeper question: why don't they **dissolve** into each other? After all, alcohol dissolves in water just fine, even though it is less dense too.

The answer is **polarity**. Water molecules have an uneven charge distribution — the oxygen end is slightly negative, the hydrogen ends slightly positive. This makes water a **polar** molecule. Water molecules attract each other through these charge differences (hydrogen bonds).

Oil molecules (long carbon-hydrogen chains) have charge distributed evenly — they are **nonpolar**. They cannot participate in hydrogen bonding with water.

The rule is: **like dissolves like**. Polar dissolves polar. Nonpolar dissolves nonpolar. Oil and water are opposite types, so they refuse to mix at the molecular level. No amount of stirring changes this fundamental incompatibility.

In the code, we model the attraction energy between molecules to show why polar-polar and nonpolar-nonpolar pairs are stable, but polar-nonpolar pairs are not.`,
      analogy: 'Think of magnets. A magnet (polar molecule) sticks to another magnet — they attract through their opposite poles. But a magnet will not stick to a wooden block (nonpolar molecule). The wooden block has no magnetic poles to interact with. You can press them together all day, but they will never bond. Oil molecules are the wooden blocks; water molecules are the magnets.',
      storyConnection: 'The churning myth describes the cosmic ocean as containing both nectar and poison that could not naturally coexist — they had to be forcefully separated. This is a poetic expression of immiscibility: some substances are fundamentally incompatible at the molecular level, just as oil and water cannot truly mix.',
      checkQuestion: 'Ethanol (alcohol) is less dense than water but dissolves in it completely. Why does ethanol mix with water when oil does not?',
      checkAnswer: 'Ethanol has an -OH group (hydroxyl) at one end that can form hydrogen bonds with water — it is polar on that end. Even though ethanol has a nonpolar carbon chain, the -OH group is strong enough to make the entire molecule water-soluble. Oil has NO polar groups at all — every part of the molecule is nonpolar. The -OH group is the key: it gives ethanol a "polar passport" into water.',
      codeIntro: 'Model molecular attraction energies for polar and nonpolar pairs.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulated interaction energies (kJ/mol)
# More negative = stronger attraction = more mixing
pairs = {
    "Water-Water\\n(polar-polar)": -20.0,
    "Oil-Oil\\n(nonpolar-nonpolar)": -5.0,
    "Water-Ethanol\\n(polar-polar)": -18.0,
    "Oil-Water\\n(polar-nonpolar)": -0.5,
}

names = list(pairs.keys())
energies = list(pairs.values())
colors = ['#3b82f6', '#fbbf24', '#8b5cf6', '#ef4444']

plt.figure(figsize=(10, 5))
bars = plt.bar(names, energies, color=colors, width=0.6, edgecolor='white')

plt.axhline(y=-3, color='white', linewidth=1, linestyle='--', alpha=0.3)
plt.text(3.5, -2.5, 'Mixing threshold', color='lightgray', fontsize=9)

plt.ylabel('Interaction energy (kJ/mol)', fontsize=11, color='lightgray')
plt.title('Why Do Some Liquids Mix?', fontsize=14, color='white')
plt.tick_params(colors='lightgray', labelsize=9)
plt.grid(axis='y', alpha=0.2)
plt.tight_layout()
plt.show()

print("More negative energy = stronger attraction = better mixing")
print()
print("Water-Water:    Strong H-bonds keep water together")
print("Oil-Oil:        Weak Van der Waals keeps oil together")
print("Water-Ethanol:  Ethanol's -OH group H-bonds with water → MIXES")
print("Oil-Water:      No H-bond possible → SEPARATES")`,
      challenge: 'Add "Soap-Water" (energy: -15) and "Soap-Oil" (energy: -4) to the dictionary. Soap has both a polar and nonpolar end — this is why it can clean grease off your hands. Plot all 6 pairs.',
      successHint: 'Polarity is the molecular explanation for the macroscopic observation that "oil and water don\'t mix." This principle underlies cell membranes (lipid bilayers), drug delivery, waterproof coatings, and the entire soap industry.',
    },
    {
      title: 'Centrifugal separation — cream separator physics',
      concept: `In Level 1, we watched oil droplets slowly rise in water under gravity. A centrifuge massively speeds this up by spinning the mixture at thousands of RPM, creating a force much greater than gravity.

**Centrifugal force = m × omega² × r**

Where omega (angular velocity) = 2 × pi × RPM / 60, and r is the radius. At 6,000 RPM in a 10 cm radius centrifuge, the effective "gravity" is about **4,000 times** normal gravity. Separation that takes hours under normal gravity happens in minutes.

This is how cream separators work. Whole milk enters a spinning bowl. The denser skim milk (1.035 g/cm³) is pushed outward by centrifugal force. The lighter cream (0.93 g/cm³) stays near the center. Two separate outlets collect each fraction.

In the code, you will calculate the centrifugal acceleration at different RPMs and plot how separation time decreases as RPM increases. The relationship is inverse-square: doubling RPM cuts separation time by 4×.`,
      analogy: 'Imagine a merry-go-round spinning fast. If you put a heavy ball and a light ball on it, the heavy ball rolls to the outside edge while the light ball stays near the center. The spinning creates a force that sorts objects by weight — heavier things get pushed out more. A centrifuge is a high-speed merry-go-round for molecules.',
      storyConnection: 'Mount Mandara spinning in the ocean is essentially a giant centrifuge. The mythical churning rod spinning at the center of the ocean creates centrifugal force that separates substances — the densest materials are flung outward while the lightest concentrate at the center. Modern cream separators use the same physics, just at 6,000 RPM.',
      checkQuestion: 'A blood centrifuge separates blood into plasma (top), white blood cells (middle), and red blood cells (bottom). What does this ordering tell you about their relative densities?',
      checkAnswer: 'Red blood cells are densest (~1.10 g/cm³), so they are pushed to the bottom (outside in the spinning tube). White blood cells are intermediate (~1.07 g/cm³). Plasma is lightest (~1.025 g/cm³) and stays at the top (near the center). The centrifuge separates them in minutes; under normal gravity, blood would take days to settle.',
      codeIntro: 'Calculate centrifugal force at different RPMs and plot separation efficiency.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Centrifuge physics
radius = 0.10  # 10 cm radius
density_cream = 930   # kg/m^3
density_skim = 1035   # kg/m^3
delta_rho = density_skim - density_cream  # density difference

rpms = np.linspace(100, 10000, 200)
omega = 2 * np.pi * rpms / 60  # angular velocity (rad/s)
g_force = omega**2 * radius / 9.81  # multiples of gravity

# Separation time is inversely proportional to g-force
# Normalize so 1g takes 360 minutes (6 hours)
t_gravity = 360  # minutes at 1g
sep_time = t_gravity / g_force

plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
plt.plot(rpms, g_force, color='cyan', linewidth=2)
plt.xlabel('RPM', color='lightgray')
plt.ylabel('Effective gravity (×g)', color='lightgray')
plt.title('Centrifugal Force vs RPM', color='white', fontsize=12)
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')

plt.subplot(1, 2, 2)
plt.plot(rpms, sep_time, color='orange', linewidth=2)
plt.xlabel('RPM', color='lightgray')
plt.ylabel('Separation time (min)', color='lightgray')
plt.title('Separation Time vs RPM', color='white', fontsize=12)
plt.ylim(0, 60)
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')

plt.tight_layout()
plt.show()

print(f"At 1,000 RPM: {g_force[np.argmin(np.abs(rpms-1000))]:.0f}×g")
print(f"At 6,000 RPM: {g_force[np.argmin(np.abs(rpms-6000))]:.0f}×g")
print(f"Separation at 6,000 RPM takes ~{sep_time[np.argmin(np.abs(rpms-6000))]:.1f} min")`,
      challenge: 'An ultracentrifuge spins at 100,000 RPM. Extend the RPM range and calculate its g-force. At what RPM can you separate individual protein molecules (requires ~100,000 g)?',
      successHint: 'Centrifugal separation is one of the most powerful tools in science. It separates cream from milk, plasma from blood, uranium isotopes for nuclear energy, and DNA in genetics labs. The physics is simple (F = m*omega^2*r) but the applications are vast.',
    },
    {
      title: 'Acid-base titration — neutralization curves',
      concept: `In Level 1 you calculated pH values. Now let's explore what happens when you mix an acid and a base together. This is **titration** — slowly adding a base to an acid (or vice versa) until they exactly neutralize each other.

**HCl + NaOH → NaCl + H₂O** (acid + base → salt + water)

The key feature of a titration curve is the **equivalence point** — where the moles of acid exactly equal the moles of base. At this point, all the acid has been neutralized. The pH jumps dramatically near this point, from acidic (~3) to basic (~11) over just a few drops of base.

This sharp jump is what makes titration useful — you can detect the exact moment of neutralization. In labs, an **indicator** (like phenolphthalein) changes color right at this jump, turning the solution pink.

The code simulates a titration curve by calculating pH at each addition of NaOH to HCl. The Henderson-Hasselbalch-like calculation shows the characteristic S-shaped curve with its dramatic jump.`,
      analogy: 'Imagine filling a bucket with water (adding base to acid). For most of the filling, the water level rises gradually. But right at the rim, one more drop and the bucket overflows — a tiny addition causes a huge change. The titration equivalence point is like the rim of the bucket: the pH is "balanced" right at the edge, and one extra drop of base tips it from acidic to basic.',
      storyConnection: 'The halahala poison from the churning was neutralized when Shiva consumed it — a mythical acid-base neutralization. In chemistry, neutralization is how we render dangerous substances safe: adding the right amount of a base to an acid (or vice versa) produces harmless salt and water. The equivalence point is the moment of perfect balance.',
      checkQuestion: 'If you are titrating 50 mL of 0.1 M HCl with 0.1 M NaOH, how many mL of NaOH do you need to reach the equivalence point?',
      checkAnswer: 'Exactly 50 mL. At the equivalence point, moles of acid = moles of base. Moles HCl = 0.050 L × 0.1 mol/L = 0.005 mol. To get 0.005 mol NaOH at 0.1 M, you need 0.005/0.1 = 0.050 L = 50 mL. Equal concentrations require equal volumes — elegant symmetry.',
      codeIntro: 'Simulate a strong acid-strong base titration and plot the pH curve.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Titration: 50 mL of 0.1 M HCl + NaOH (0.1 M)
V_acid = 50.0  # mL
C_acid = 0.1   # mol/L
C_base = 0.1   # mol/L
moles_acid = V_acid * C_acid / 1000

V_base = np.linspace(0.1, 100, 500)  # mL of NaOH added
pH_values = []

for vb in V_base:
    moles_base = vb * C_base / 1000
    total_vol = (V_acid + vb) / 1000  # liters

    if moles_base < moles_acid:
        # Excess acid
        excess_H = (moles_acid - moles_base) / total_vol
        pH_values.append(-np.log10(excess_H))
    elif moles_base > moles_acid:
        # Excess base
        excess_OH = (moles_base - moles_acid) / total_vol
        pOH = -np.log10(excess_OH)
        pH_values.append(14 - pOH)
    else:
        pH_values.append(7.0)

plt.figure(figsize=(10, 5))
plt.plot(V_base, pH_values, color='#a78bfa', linewidth=2.5)
plt.axhline(y=7, color='gray', linewidth=1, linestyle='--', alpha=0.4)
plt.axvline(x=50, color='#10b981', linewidth=1, linestyle='--', alpha=0.6)
plt.annotate('Equivalence\\npoint', xy=(50, 7), xytext=(60, 4),
             fontsize=10, color='#10b981',
             arrowprops=dict(arrowstyle='->', color='#10b981'))
plt.xlabel('Volume NaOH added (mL)', fontsize=11, color='lightgray')
plt.ylabel('pH', fontsize=11, color='lightgray')
plt.title('Strong Acid-Strong Base Titration', fontsize=14, color='white')
plt.ylim(0, 14)
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')
plt.tight_layout()
plt.show()

print(f"Equivalence point: {V_acid:.0f} mL NaOH (pH = 7.0)")
print("Notice the sharp S-curve near 50 mL!")`,
      challenge: 'Change C_base to 0.2 M (double concentration). Where is the new equivalence point? How does the curve shape change? Also try titrating a weak acid (add a buffer factor) to see a flatter curve.',
      successHint: 'Titration is how chemists determine unknown concentrations with high precision. The sharp equivalence point lets you detect the exact moment of neutralization. This technique is used in water quality testing, pharmaceutical manufacturing, and food science.',
    },
    {
      title: 'Distillation simulation — boiling point separation',
      concept: `Different liquids boil at different temperatures. **Distillation** exploits this: heat a mixture, and the component with the lowest boiling point evaporates first. Cool the vapor and you collect that component as a pure liquid.

**Water**: 100°C. **Ethanol**: 78.4°C. **Acetone**: 56°C. **Methanol**: 64.7°C.

When you heat a water-ethanol mixture, ethanol vapor rises first (lower boiling point). Cool the vapor in a condenser and you get concentrated ethanol — this is how distilleries make spirits from fermented grain.

The code simulates heating a two-component mixture and tracking the vapor composition at each temperature. The key concept is **vapor pressure** — at any given temperature, each component contributes vapor pressure proportional to its mole fraction and its pure vapor pressure (Raoult's law):

**P_total = x_A × P°_A + x_B × P°_B**

The liquid boils when P_total equals atmospheric pressure (101.3 kPa).`,
      analogy: 'Imagine a swimming pool party where people leave when the temperature gets too hot for them. The most heat-sensitive people (lowest "boiling point") leave first when it is mildly warm. As the temperature rises further, more people leave. Eventually only the most heat-resistant person remains. Distillation works the same way — each component "leaves" the liquid (becomes vapor) at its own threshold temperature.',
      storyConnection: 'The churning separated the cosmic ocean into its components, each emerging at a different stage. Distillation works similarly — heat the mixture and substances emerge one by one in order of their boiling points. The first to emerge is the most volatile (lowest boiling point), just as the first treasure from the ocean was the most reactive.',
      checkQuestion: 'Why can\'t you distill a mixture of salt and water by boiling? (Or can you?)',
      checkAnswer: 'You CAN — and it works perfectly. Salt does not evaporate (its boiling point is 1,465°C). When you boil saltwater, pure water vapor rises, leaving the salt behind. Cool the vapor and you get pure fresh water. This is desalination. It works because the boiling points are so far apart (100°C vs 1,465°C) that separation is complete in one pass.',
      codeIntro: 'Simulate distillation of an ethanol-water mixture using Raoult\'s law.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Boiling points and Antoine equation (simplified)
# Vapor pressure increases exponentially with temperature
def vapor_pressure(T, bp):
    """Simplified: P = 101.3 * exp(factor * (T - bp) / bp)"""
    return 101.3 * np.exp(8.0 * (T - bp) / bp)

bp_ethanol = 78.4   # °C
bp_water = 100.0     # °C
x_ethanol = 0.40     # mole fraction of ethanol

T_range = np.linspace(70, 105, 200)

# Vapor composition at each temperature
y_ethanol = []
for T in T_range:
    P_eth = x_ethanol * vapor_pressure(T, bp_ethanol)
    P_wat = (1 - x_ethanol) * vapor_pressure(T, bp_water)
    P_total = P_eth + P_wat
    y_ethanol.append(P_eth / P_total)  # vapor fraction

plt.figure(figsize=(10, 5))
plt.plot(T_range, [x_ethanol]*len(T_range), '--', color='cyan',
         linewidth=1.5, label=f'Liquid: {x_ethanol*100:.0f}% ethanol')
plt.plot(T_range, y_ethanol, color='orange', linewidth=2.5,
         label='Vapor composition')
plt.fill_between(T_range, x_ethanol, y_ethanol, alpha=0.1, color='orange')

plt.xlabel('Temperature (°C)', fontsize=11, color='lightgray')
plt.ylabel('Ethanol fraction', fontsize=11, color='lightgray')
plt.title('Distillation: Vapor Is Richer in Ethanol', fontsize=14, color='white')
plt.legend(fontsize=10, labelcolor='lightgray')
plt.grid(alpha=0.2)
plt.tick_params(colors='lightgray')
plt.tight_layout()
plt.show()

print("The vapor (orange) is always richer in ethanol than the liquid (cyan)")
print(f"At 80°C: liquid is {x_ethanol*100:.0f}% ethanol,", end=" ")
print(f"vapor is ~{y_ethanol[np.argmin(np.abs(T_range-80))]*100:.0f}% ethanol")
print("This enrichment is the whole point of distillation!")`,
      challenge: 'Try x_ethanol = 0.10 (dilute beer) and x_ethanol = 0.80 (nearly pure). How does the enrichment factor change? At what liquid composition does distillation become ineffective? (Hint: look up "azeotrope".)',
      successHint: 'Distillation is one of humanity\'s oldest separation techniques — used for thousands of years to purify water and make spirits. Oil refineries distill crude oil into gasoline, diesel, and jet fuel using the same physics, just at industrial scale with fractional distillation columns.',
    },
    {
      title: 'Emulsifiers — how soap bridges oil and water',
      concept: `In Level 1 you learned that oil and water separate because one is polar and the other is nonpolar. But what if you need them to stay mixed? That is where **emulsifiers** come in.

An emulsifier molecule has two ends:
- A **polar (hydrophilic) head** that dissolves in water
- A **nonpolar (hydrophobic) tail** that dissolves in oil

This dual nature lets emulsifiers sit at the oil-water boundary, with one end in each phase. They form a shell around oil droplets, preventing them from merging back together. The result: a stable emulsion that does not separate.

Examples of emulsifiers:
- **Soap/detergent**: cleans grease off dishes by emulsifying oil in water
- **Lecithin** (in egg yolks): stabilizes mayonnaise (oil + vinegar emulsion)
- **Casein** (in milk): keeps milk fat emulsified

The code models how emulsifier concentration affects emulsion stability, measured by how long the emulsion takes to separate.`,
      analogy: 'An emulsifier is a bilingual translator at a peace negotiation between two countries that speak different languages (oil and water). Without the translator, the two sides cannot communicate and walk away (separate). With the translator bridging both languages, they stay at the table (emulsified). More translators = more stable negotiation.',
      storyConnection: 'In the myth, the serpent Vasuki served as the churning rope — a bridge between the two sides (gods and demons). Emulsifiers serve a similar bridging role: they connect two incompatible phases. Without Vasuki, no churning could happen; without emulsifiers, no stable emulsion can exist.',
      checkQuestion: 'Why does adding dish soap to a pan of greasy water cause the grease to disperse?',
      checkAnswer: 'Soap molecules have a polar head (attracted to water) and a nonpolar tail (attracted to grease). When soap is added, the tails embed in grease droplets while the heads extend into the water. This coats each grease droplet in a shell of soap molecules, with the water-loving heads on the outside. The water can now "hold onto" the coated droplets, preventing them from coalescing. The grease is emulsified — broken into tiny droplets stable enough to wash away.',
      codeIntro: 'Model emulsion stability as a function of emulsifier concentration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Emulsifier concentration (% by weight)
conc = np.linspace(0, 5, 100)

# Separation time increases with emulsifier (Langmuir-type curve)
# t_sep = t_max * conc / (K + conc)
t_max = 720  # minutes (12 hours max stability)
K = 0.5      # half-saturation constant

t_sep = t_max * conc / (K + conc)
t_sep[0] = 5  # without emulsifier: separates in 5 minutes

# Droplet size decreases with emulsifier
d_max = 100  # micrometers (no emulsifier)
droplet_size = d_max * K / (K + conc)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

ax1.plot(conc, t_sep, color='#10b981', linewidth=2.5)
ax1.set_xlabel('Emulsifier (%)', fontsize=11, color='lightgray')
ax1.set_ylabel('Time before separation (min)', fontsize=11, color='lightgray')
ax1.set_title('Emulsion Stability', fontsize=13, color='white')
ax1.grid(alpha=0.2)
ax1.tick_params(colors='lightgray')
ax1.axhline(y=360, color='gray', linestyle='--', alpha=0.3)
ax1.text(4, 370, '6 hours', color='gray', fontsize=9)

ax2.plot(conc, droplet_size, color='#f59e0b', linewidth=2.5)
ax2.set_xlabel('Emulsifier (%)', fontsize=11, color='lightgray')
ax2.set_ylabel('Avg droplet size (um)', fontsize=11, color='lightgray')
ax2.set_title('Droplet Size', fontsize=13, color='white')
ax2.grid(alpha=0.2)
ax2.tick_params(colors='lightgray')

plt.tight_layout()
plt.show()

print("More emulsifier → smaller droplets → longer stability")
print(f"At 0% emulsifier: separates in {t_sep[0]:.0f} min")
print(f"At 2% emulsifier: stable for {t_sep[np.argmin(np.abs(conc-2))]:.0f} min")
print(f"At 5% emulsifier: stable for {t_sep[-1]:.0f} min")`,
      challenge: 'Modify the code to test what happens when you add TOO much emulsifier (try concentrations up to 20%). In reality, excess emulsifier forms micelles that can destabilize the emulsion. Add a declining section after 10% concentration.',
      successHint: 'Emulsifiers are everywhere: in food (lecithin, gum arabic), cosmetics (cetyl alcohol), medicine (polysorbate), and industry (surfactants). Understanding how they work at the molecular level lets you design products from mayonnaise to drug delivery systems.',
    },
    {
      title: 'Industrial separation — modeling a refinery',
      concept: `Now let's scale up. An oil refinery is the ultimate separation machine — it takes crude oil (a mixture of hundreds of hydrocarbons) and separates it into useful products by **fractional distillation**.

A fractional distillation column is a tall tower where temperature decreases from bottom (400°C) to top (25°C). Crude oil enters at the bottom as vapor. As vapors rise, they cool. Each component condenses at the height where the temperature matches its boiling point:

- **Bottom (>350°C)**: Bitumen, lubricating oil (heavy, long-chain molecules)
- **Middle (~200°C)**: Diesel, kerosene (medium chains)
- **Top (~40°C)**: Gasoline, propane, butane (light, short chains)

The column has dozens of **trays** where liquid collects. Vapors bubble through liquid on each tray, exchanging heat and mass. This gives much better separation than simple distillation.

The code models a simplified distillation column with 5 fractions and shows how each product is collected at a specific temperature range.`,
      analogy: 'Think of a multi-story apartment building in winter, where each floor is a different temperature. The penthouse is freezing (light gases condense), middle floors are moderate (gasoline condenses), and the lobby is warm (heavy oils condense). Crude oil enters the building as a group of tenants — each one moves to the floor that matches their "comfort temperature" (boiling point). The building sorts them automatically.',
      storyConnection: 'The churning produced many treasures, each emerging at a different stage. A refinery column is the industrial version of this myth — crude oil enters as a chaotic mixture, and pure products emerge at different levels. The ancient story intuitively captured the principle of fractional separation: one mixture, many useful products, each appearing in order.',
      checkQuestion: 'Why is crude oil useless as fuel directly, even though it contains gasoline?',
      checkAnswer: 'Crude oil is a mixture of thousands of different hydrocarbons with chain lengths from C1 (methane) to C50+ (bitumen). The heavy components do not burn cleanly in engines — they clog injectors, produce soot, and corrode metal. Gasoline engines need a narrow range (C5-C12) of hydrocarbon chain lengths for efficient combustion. Separation is essential to extract the useful fraction and remove the rest.',
      codeIntro: 'Model a fractional distillation column showing where each product condenses.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Refinery fractions: name, boiling range (°C), yield (%), color
fractions = [
    ("Refinery gas",   [25, 50],   5, "#e2e8f0"),
    ("Gasoline",       [50, 150],  25, "#fbbf24"),
    ("Kerosene",       [150, 250], 15, "#60a5fa"),
    ("Diesel",         [250, 350], 20, "#f97316"),
    ("Lubricating oil",[350, 400], 10, "#a78bfa"),
    ("Bitumen/residue",[400, 500], 25, "#1f2937"),
]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Column visualization
for i, (name, bp_range, yld, color) in enumerate(fractions):
    y_bottom = i
    ax1.barh(y_bottom, bp_range[1] - bp_range[0], left=bp_range[0],
             height=0.7, color=color, edgecolor='white', linewidth=0.5)
    ax1.text(bp_range[1] + 10, y_bottom, f"{name} ({bp_range[0]}-{bp_range[1]}°C)",
             va='center', fontsize=9, color='lightgray')

ax1.set_xlabel('Boiling point (°C)', fontsize=11, color='lightgray')
ax1.set_title('Boiling Point Ranges', fontsize=13, color='white')
ax1.set_yticks([])
ax1.tick_params(colors='lightgray')
ax1.grid(axis='x', alpha=0.2)

# Yield pie chart
names = [f[0] for f in fractions]
yields = [f[2] for f in fractions]
colors = [f[3] for f in fractions]
ax2.pie(yields, labels=names, colors=colors, autopct='%1.0f%%',
        textprops={'fontsize': 9, 'color': 'lightgray'}, startangle=90)
ax2.set_title('Crude Oil Composition', fontsize=13, color='white')

plt.tight_layout()
plt.show()

print("One barrel of crude oil (159 liters) produces:")
for name, _, yld, _ in fractions:
    vol = 159 * yld / 100
    print(f"  {name:<20s}: {vol:.1f} liters ({yld}%)")`,
      challenge: 'Add a "Naphtha" fraction (boiling range 80-180°C, yield 10%) used in petrochemicals. Adjust other yields so they still sum to 100%. How does adding this fraction overlap with gasoline?',
      successHint: 'A refinery is chemistry at industrial scale — the same separation principles (density, boiling point, polarity) but applied to millions of barrels per day. You have now connected the mythical churning of the ocean to the very real churning of crude oil in a refinery.',
    },
  ];

  const diagrams = [ChurningPolarityDiagram, ChurningCentrifugeDiagram, ChurningTitrationDiagram, ChurningDistillationDiagram, ChurningEmulsifierDiagram, ChurningSeparationPipelineDiagram];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Intermediate chemistry and separation science</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for chemistry simulations. Click to start.</p>
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
            diagram={diagrams[i] ? createElement(diagrams[i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
