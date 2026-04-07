import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SundarbansLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Osmosis — why water moves through membranes',
      concept: `In the Sundarbans, mangrove roots sit in seawater containing about **35 grams of salt per litre**. Yet the water inside the tree's cells is nearly fresh. How does the tree keep salt out? The answer is **osmosis** — the movement of water through a **semipermeable membrane** from a region of low solute concentration to high solute concentration.

A semipermeable membrane lets water molecules pass but blocks larger solute molecules (like salt ions). When two solutions of different concentrations are separated by such a membrane, water naturally flows toward the more concentrated side, trying to equalize the concentrations. This flow creates **osmotic pressure** — a measurable force.

In the code below, you will calculate osmotic pressure for different salt concentrations using the van 't Hoff equation: **Pi = iMRT**, where i is the van 't Hoff factor, M is molarity, R is the gas constant, and T is temperature in Kelvin.`,
      analogy: 'Imagine two rooms separated by a door that only lets people through, not furniture. One room is packed with furniture (high concentration); the other is nearly empty. People naturally drift toward the crowded room to "help out" — that flow of people is like osmosis. The door is the semipermeable membrane.',
      storyConnection: 'The Sundarbans mangroves face a daily osmotic challenge. Their roots are bathed in saltwater, yet their leaves need fresh water for photosynthesis. The root cell membranes act as natural filters, using osmotic pressure differences to draw in water while rejecting most salt ions. Without this ability, the trees would dehydrate and die within days.',
      checkQuestion: 'Seawater has about 0.6 M NaCl. If the van \'t Hoff factor for NaCl is 2 (it splits into Na+ and Cl-), R = 0.0821 L atm/(mol K), and T = 298 K, what is the osmotic pressure?',
      checkAnswer: 'Pi = i * M * R * T = 2 * 0.6 * 0.0821 * 298 = 29.3 atm. That is nearly 30 atmospheres — the pressure at about 300 metres underwater. Mangrove roots must generate negative pressure greater than this to pull fresh water out of seawater.',
      codeIntro: 'Calculate osmotic pressure for different salt concentrations using the van \'t Hoff equation.',
      code: `# Osmotic pressure calculator using van 't Hoff equation
# Pi = i * M * R * T

R = 0.0821  # gas constant (L atm / mol K)
T = 298     # temperature in Kelvin (25 C)

# NaCl dissociates into 2 ions: Na+ and Cl-
i_NaCl = 2

# Different water sources and their salt concentrations
water_sources = [
    {"name": "Fresh water (river)", "molarity": 0.001},
    {"name": "Brackish water", "molarity": 0.1},
    {"name": "Typical seawater", "molarity": 0.6},
    {"name": "Sundarbans estuary", "molarity": 0.45},
    {"name": "Dead Sea", "molarity": 5.5},
    {"name": "Mangrove root sap", "molarity": 0.01},
]

print("=== Osmotic Pressure Calculator ===")
print(f"Temperature: {T} K ({T - 273} C)")
print(f"{'Water Source':<28} {'Molarity (M)':>12} {'Pressure (atm)':>16}")
print("-" * 58)

for source in water_sources:
    M = source["molarity"]
    pressure = i_NaCl * M * R * T
    print(f"{source['name']:<28} {M:>12.3f} {pressure:>14.1f}")

print()
# Pressure difference the mangrove must overcome
sea_pressure = i_NaCl * 0.6 * R * T
sap_pressure = i_NaCl * 0.01 * R * T
diff = sea_pressure - sap_pressure
print(f"Pressure difference (sea vs root sap): {diff:.1f} atm")
print(f"The mangrove root must exert at least {diff:.0f} atm")
print("to pull fresh water from seawater!")`,
      challenge: 'Add "Mangrove leaf sap" with molarity 0.05 M. Calculate the pressure difference between the root sap and the leaf sap. This internal gradient drives water upward through the tree. How does it compare to the external gradient?',
      successHint: 'You just used the van \'t Hoff equation — the same equation used to design dialysis machines, IV solutions in hospitals, and water purification systems. Osmotic pressure is one of the most important concepts in biology and chemical engineering.',
    },
    {
      title: 'Concentration gradients — the engine of diffusion',
      concept: `A **concentration gradient** is a difference in the amount of a substance between two regions. Molecules naturally move from high concentration to low concentration — this is **diffusion**. The steeper the gradient, the faster the diffusion.

Mathematically, diffusion rate is described by **Fick's first law**: **J = -D * (dC/dx)**, where J is the flux (amount per area per time), D is the diffusion coefficient (how easily the substance moves), and dC/dx is the concentration gradient (change in concentration per unit distance).

In the code below, you will model how salt concentration changes across a mangrove root membrane. The root maintains a steep gradient — high salt outside, low salt inside — which drives water inward by osmosis while the membrane blocks salt.`,
      analogy: 'Open a bottle of perfume in one corner of a room. Within minutes, you can smell it across the room. The perfume molecules diffused down a concentration gradient — from high concentration (near the bottle) to low concentration (far away). The bigger the room and the weaker the perfume, the slower the spread. Fick\'s law quantifies exactly this process.',
      storyConnection: 'In the Sundarbans tidal channels, salt concentration changes constantly with the tides. At high tide, seawater pushes in and salt concentration spikes. At low tide, freshwater from rivers dilutes it. The mangrove roots must handle this fluctuating gradient — sometimes filtering against 35 g/L salt, sometimes only 10 g/L. Their membranes adapt dynamically.',
      checkQuestion: 'If the salt concentration outside a root is 35 g/L and inside is 1 g/L, and the membrane is 0.1 mm thick, what is the concentration gradient in g/L per mm?',
      checkAnswer: 'Gradient = (35 - 1) / 0.1 = 340 g/L per mm. This extremely steep gradient over a very short distance is what makes mangrove filtration so effective — the driving force for diffusion is enormous.',
      codeIntro: 'Model salt concentration profiles across a mangrove root membrane using Fick\'s law.',
      code: `import numpy as np

# Model salt concentration across a mangrove root membrane
# Using Fick's first law: J = -D * (dC/dx)

# Membrane properties
membrane_thickness_mm = 0.1
D_salt = 1.5e-9  # diffusion coefficient of NaCl in water (m2/s)

# Concentrations (g/L)
C_outside = 35.0   # seawater
C_inside = 1.0     # root interior (nearly fresh)

# Create position array across the membrane
x = np.linspace(0, membrane_thickness_mm, 50)

# Concentration profile (linear for simple diffusion)
C_profile = C_outside - (C_outside - C_inside) * x / membrane_thickness_mm

# Calculate gradient at each point
gradient = (C_outside - C_inside) / membrane_thickness_mm  # g/L per mm

print("=== Salt Concentration Across Root Membrane ===")
print(f"Outside (seawater): {C_outside} g/L")
print(f"Inside (root sap):  {C_inside} g/L")
print(f"Membrane thickness: {membrane_thickness_mm} mm")
print(f"Concentration gradient: {gradient:.0f} g/L per mm")
print()

print(f"{'Position (mm)':<16} {'Salt (g/L)':>12} {'Description':>20}")
print("-" * 50)

checkpoints = [0, 0.02, 0.04, 0.06, 0.08, 0.1]
labels = ["Outer surface", "20% through", "40% through",
          "60% through", "80% through", "Inner surface"]

for pos, label in zip(checkpoints, labels):
    idx = min(int(pos / membrane_thickness_mm * 49), 49)
    print(f"{pos:<16.3f} {C_profile[idx]:>10.1f} {label:>20}")

# Different tidal conditions
print()
print("=== Gradient Under Different Tides ===")
tidal_conditions = [
    ("Low tide (river-dominated)", 10),
    ("Mid tide (brackish)", 20),
    ("High tide (full seawater)", 35),
    ("Storm surge (concentrated)", 40),
]

for name, c_out in tidal_conditions:
    grad = (c_out - C_inside) / membrane_thickness_mm
    print(f"{name:<32} Gradient: {grad:>6.0f} g/L per mm")`,
      challenge: 'What happens if the membrane thickness doubles to 0.2 mm? Calculate the new gradient. A thicker membrane means a gentler gradient and slower diffusion — but also slower water intake. The mangrove balances membrane thickness between filtration quality and water flow rate.',
      successHint: 'Fick\'s law governs diffusion everywhere: oxygen entering your lungs, nutrients entering cells, pollutants spreading in groundwater. The concentration gradient is nature\'s most fundamental transport mechanism — no pumps required.',
    },
    {
      title: 'Water potential — predicting which way water flows',
      concept: `**Water potential** (symbol: psi, measured in MPa) is the "energy status" of water in a system. Water always flows from **high water potential** to **low water potential** — like a ball rolling downhill.

Water potential has two main components: **pressure potential** (physical pressure on the water) and **solute potential** (the effect of dissolved substances). Pure water at atmospheric pressure has a water potential of zero. Adding solute makes it negative. Adding pressure makes it positive.

The equation is: **psi = psi_p + psi_s**, where psi_p is pressure potential and psi_s is solute potential. Solute potential is calculated as: **psi_s = -iMRT** (note the negative sign — solutes always lower water potential).

In the code below, you will calculate water potential at different points in a mangrove tree — from the seawater outside to the leaves at the top — and trace the path water follows.`,
      analogy: 'Think of water potential like altitude on a hill. A ball at the top of a hill has high potential energy and rolls downward. Water at high water potential "rolls" toward low water potential. Solutes act like digging a pit — they lower the potential, attracting water. Pressure acts like building a mound — it raises the potential, pushing water away.',
      storyConnection: 'A Sundarbans mangrove tree creates a chain of decreasing water potential from root to leaf. The roots have lower water potential than the surrounding seawater (pulling water in). The stem has lower potential than the roots (pulling water up). The leaves have the lowest potential of all (pulling water to the canopy where it evaporates). This unbroken chain of decreasing potential is the tree\'s water highway.',
      checkQuestion: 'If the solute potential of root cells is -3.0 MPa and the pressure potential is 0.5 MPa, what is the total water potential?',
      checkAnswer: 'psi = psi_p + psi_s = 0.5 + (-3.0) = -2.5 MPa. Since seawater has a water potential of about -2.4 MPa, the root at -2.5 MPa has lower potential, so water flows from seawater into the root. The difference is small — the mangrove is just barely "winning" the tug-of-war.',
      codeIntro: 'Calculate water potential at every point in a mangrove tree and trace the water flow path.',
      code: `# Water potential calculator for a mangrove tree
# psi = psi_p (pressure) + psi_s (solute)
# psi_s = -i * M * R * T

R = 0.00831  # gas constant in L MPa / (mol K)
T = 303      # 30 C in Kelvin (tropical Sundarbans)
i_NaCl = 2   # van 't Hoff factor for NaCl

def solute_potential(molarity):
    """Calculate solute potential from molarity"""
    return -i_NaCl * molarity * R * T

# Water potential at each location in the mangrove system
locations = [
    {"name": "Open seawater", "molarity": 0.60, "pressure_MPa": 0.1},
    {"name": "Soil around roots", "molarity": 0.55, "pressure_MPa": 0.1},
    {"name": "Root surface", "molarity": 0.50, "pressure_MPa": 0.1},
    {"name": "Root interior", "molarity": 0.05, "pressure_MPa": 0.5},
    {"name": "Stem (xylem)", "molarity": 0.03, "pressure_MPa": -0.5},
    {"name": "Branch", "molarity": 0.03, "pressure_MPa": -1.0},
    {"name": "Leaf mesophyll", "molarity": 0.04, "pressure_MPa": -1.5},
    {"name": "Leaf surface (air)", "molarity": 0.0, "pressure_MPa": -100.0},
]

print("=== Water Potential Along a Mangrove Tree ===")
print(f"{'Location':<22} {'Solute (MPa)':>13} {'Pressure (MPa)':>15} {'Total (MPa)':>12}")
print("-" * 65)

prev_psi = None
for loc in locations:
    psi_s = solute_potential(loc["molarity"])
    psi_p = loc["pressure_MPa"]
    psi_total = psi_s + psi_p
    arrow = ""
    if prev_psi is not None:
        arrow = " <-- water flows this way" if psi_total < prev_psi else ""
    print(f"{loc['name']:<22} {psi_s:>11.2f} {psi_p:>13.2f} {psi_total:>10.2f}{arrow}")
    prev_psi = psi_total

print()
print("Water flows from high potential to low potential.")
print("The mangrove creates a continuous downhill gradient")
print("from seawater to leaf — pulling water upward!")`,
      challenge: 'Increase the seawater molarity to 0.8 M (very salty conditions after a dry spell). Does water still flow into the root? What would the root need to change to restore flow? (Hint: it could increase internal solute concentration or increase negative pressure.)',
      successHint: 'Water potential is the master equation of plant biology. Every farmer irrigating crops, every doctor managing IV fluids, and every engineer designing a water treatment plant uses this same concept — water flows from high potential to low potential, always.',
    },
    {
      title: 'Calculating salt rejection — the efficiency of a natural filter',
      concept: `Mangrove roots don't reject 100% of salt — no filter is perfect. The **salt rejection rate** measures how effective the filter is: **R = (1 - C_permeate / C_feed) * 100%**, where C_feed is the salt concentration in the water entering the filter and C_permeate is the salt concentration in the water that passes through.

A rejection rate of 95% means that for every 35 g/L of salt in seawater, only 1.75 g/L gets through. Different mangrove species achieve different rejection rates: some exclude up to **97%** of salt at the root, while others let more through and excrete the excess through special glands on their leaves.

In the code below, you will calculate rejection rates for different mangrove species and compare them to engineered membranes used in desalination plants.`,
      analogy: 'Think of a coffee filter. It lets water through but catches the grounds. If you measure 100 mg of grounds in the water before filtering and 5 mg after, the filter rejected 95% of the grounds. The mangrove root is a biological coffee filter, but for salt ions instead of coffee grounds.',
      storyConnection: 'The Sundarbans has dozens of mangrove species, each with different salt-handling strategies. Rhizophora (stilt-root mangroves) reject up to 97% of salt at the root surface. Avicennia (grey mangroves) reject less — about 85% — but compensate by excreting salt through leaf glands. You can actually taste the salt crystals on Avicennia leaves.',
      checkQuestion: 'If seawater has 35 g/L salt and a mangrove root rejects 95%, how much salt enters the tree? If the tree takes in 5 litres of water per day, how much salt per day?',
      checkAnswer: 'Permeate concentration = 35 * (1 - 0.95) = 1.75 g/L. Daily salt intake = 1.75 * 5 = 8.75 grams per day. The tree must deal with nearly 9 grams of salt every day — either storing it in old leaves, excreting it through glands, or sequestering it in bark.',
      codeIntro: 'Compare salt rejection rates across mangrove species and engineered desalination membranes.',
      code: `# Salt rejection rate calculator
# R = (1 - C_permeate / C_feed) * 100%

seawater_salt = 35.0  # g/L

# Different filtration systems
filters = [
    {"name": "Rhizophora (stilt root)", "rejection_pct": 97},
    {"name": "Avicennia (grey mangrove)", "rejection_pct": 85},
    {"name": "Bruguiera (orange mangrove)", "rejection_pct": 92},
    {"name": "Ceriops (yellow mangrove)", "rejection_pct": 90},
    {"name": "Basic sand filter", "rejection_pct": 10},
    {"name": "Activated carbon filter", "rejection_pct": 30},
    {"name": "Nanofiltration membrane", "rejection_pct": 70},
    {"name": "RO membrane (industrial)", "rejection_pct": 99},
]

daily_water_litres = 5.0  # water intake per day

print("=== Salt Rejection Rate Comparison ===")
print(f"Feed water: {seawater_salt} g/L (seawater)")
print(f"Daily water intake: {daily_water_litres} L")
print()
print(f"{'Filter System':<30} {'Rejection':>10} {'Permeate':>12} {'Daily Salt':>12}")
print(f"{'':30} {'(%)':>10} {'(g/L)':>12} {'(g/day)':>12}")
print("-" * 66)

for f in filters:
    rejection = f["rejection_pct"] / 100
    permeate = seawater_salt * (1 - rejection)
    daily_salt = permeate * daily_water_litres
    print(f"{f['name']:<30} {f['rejection_pct']:>8}% {permeate:>10.2f} {daily_salt:>10.2f}")

print()
# Salt accumulation over a year for a mangrove
rhizo_daily = seawater_salt * (1 - 0.97) * daily_water_litres
yearly_salt = rhizo_daily * 365
print(f"Rhizophora yearly salt intake: {yearly_salt:.0f} g ({yearly_salt/1000:.1f} kg)")
print("This salt must be stored, excreted, or shed with old leaves!")`,
      challenge: 'If a Rhizophora mangrove lives for 50 years and takes in 5 L/day with 97% rejection, how many kg of salt does it accumulate over its lifetime? Where does all that salt go? (Research: salt glands, leaf shedding, bark storage.)',
      successHint: 'You just compared biological and engineered filtration systems. Modern reverse osmosis membranes achieve 99% rejection — only slightly better than a mangrove root at 97%. Engineers study mangrove membranes to design better, lower-energy desalination systems.',
    },
    {
      title: 'Energy cost of filtration — why mangroves grow slowly',
      concept: `Filtering salt from seawater requires **energy**. The minimum theoretical energy to desalinate seawater is about **1.06 kWh per cubic metre** (at 50% recovery). Real desalination plants use 3-5 kWh/m3. Mangrove roots, working at biological temperatures and pressures, use energy from **ATP** (the cell's energy currency).

The energy required is related to osmotic pressure: **W = Pi * V**, where Pi is the osmotic pressure the membrane must overcome and V is the volume of water processed. Higher salt concentration means higher osmotic pressure means more energy needed.

This energy cost explains why mangroves grow slower than freshwater trees — a significant fraction of their photosynthetic energy goes to salt exclusion rather than growth.

In the code below, you will calculate the energy budget of a mangrove tree, showing how much of its energy goes to salt filtration versus growth.`,
      analogy: 'Imagine running on a treadmill while carrying a heavy backpack. You are still running (growing), but slower because some of your energy goes to carrying the weight (filtering salt). A freshwater tree is running without the backpack — same effort, faster speed. The salt filtration "tax" explains why mangroves rarely grow as tall as rainforest trees.',
      storyConnection: 'Fishermen in the Sundarbans have long noticed that mangroves near river mouths (lower salinity) grow taller than those in the open estuary (higher salinity). The science confirms their observation: trees in lower salinity spend less energy on salt exclusion and can invest more in height and leaf growth. Salinity is the invisible tax on every mangrove.',
      checkQuestion: 'If a mangrove produces 100 units of energy from photosynthesis and spends 30 units on salt filtration, what fraction is available for growth? How does this compare to a freshwater tree that spends 0 units on filtration?',
      checkAnswer: 'The mangrove has 70/100 = 70% of its energy for growth. The freshwater tree has 100/100 = 100%. The mangrove can grow at most 70% as fast, all else being equal. In reality, other stresses (tidal flooding, anaerobic soil) further reduce mangrove growth rates.',
      codeIntro: 'Model the energy budget of a mangrove tree — photosynthesis vs salt filtration costs.',
      code: `# Mangrove energy budget calculator
# How much energy goes to salt filtration vs growth?

import numpy as np

# Osmotic pressure of seawater at different salinities
R = 0.0821   # L atm / (mol K)
T = 303      # 30 C
i = 2        # NaCl van 't Hoff factor

def osmotic_energy_kwh(molarity, volume_litres):
    """Energy to overcome osmotic pressure (kWh)"""
    pressure_atm = i * molarity * R * T
    # Work = pressure * volume, convert atm*L to kWh
    # 1 atm*L = 101.325 J, 1 kWh = 3.6e6 J
    energy_j = pressure_atm * volume_litres * 101.325
    return energy_j / 3.6e6

# Daily water uptake
daily_water_L = 50  # mature mangrove tree

# Compare different salinities
salinities = [
    ("Fresh water (river)", 0.001),
    ("Low brackish", 0.1),
    ("Sundarbans average", 0.4),
    ("Full seawater", 0.6),
    ("Hypersaline lagoon", 1.0),
]

print("=== Mangrove Energy Budget ===")
print(f"Daily water uptake: {daily_water_L} L")
print()
print(f"{'Salinity Source':<25} {'Molarity':>8} {'Energy (Wh)':>12} {'% of budget':>12}")
print("-" * 60)

# Assume total daily photosynthetic energy ~ 500 Wh for a mature tree
total_energy_wh = 500

for name, mol in salinities:
    energy = osmotic_energy_kwh(mol, daily_water_L) * 1000  # convert to Wh
    pct = energy / total_energy_wh * 100
    print(f"{name:<25} {mol:>8.3f} {energy:>10.1f} {pct:>10.1f}%")

print()
print("=== Growth Rate Impact ===")
print(f"{'Salinity':<25} {'Energy for growth':>18} {'Relative growth':>16}")
print("-" * 60)

for name, mol in salinities:
    filtration_wh = osmotic_energy_kwh(mol, daily_water_L) * 1000
    growth_wh = total_energy_wh - filtration_wh
    relative = growth_wh / total_energy_wh * 100
    print(f"{name:<25} {growth_wh:>14.0f} Wh {relative:>13.0f}%")

print()
print("Higher salinity = more energy spent filtering = slower growth.")
print("This is why Sundarbans mangroves are shorter than rainforest trees!")`,
      challenge: 'What salinity would use 100% of the tree\'s energy budget, leaving nothing for growth? Calculate the molarity at which filtration energy equals 500 Wh. This is the theoretical maximum salinity a mangrove can survive at — compare it to real-world observations.',
      successHint: 'You just built an energy budget model — the same approach ecologists use to understand why organisms live where they do. Energy allocation between survival and growth is a universal trade-off in biology, from bacteria to whales.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Osmosis and salt filtration through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model osmosis, concentration gradients, and water potential in mangrove root systems.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
