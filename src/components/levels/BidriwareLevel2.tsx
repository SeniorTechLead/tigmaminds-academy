import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BidriwareLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Redox reactions — electron transfer in action',
      concept: `Every electrochemical process is a **redox reaction** — one species is **oxidized** (loses electrons) while another is **reduced** (gains electrons). The number of electrons lost must equal the number gained. Balancing redox equations requires tracking electron transfer carefully.

For the Bidriware darkening reaction: Zn(s) + Cu^2+(aq) -> Zn^2+(aq) + Cu(s). Zinc loses 2 electrons (oxidized). Copper ion gains 2 electrons (reduced). The reaction is balanced because 2 electrons are transferred.

More complex redox reactions involve different numbers of electrons on each side. The **half-reaction method** splits the reaction into an oxidation half and a reduction half, balances electrons in each, then combines them so electrons cancel.

📚 *Oxidation half-reaction: Zn -> Zn^2+ + 2e^-. Reduction half-reaction: Cu^2+ + 2e^- -> Cu. Combined: Zn + Cu^2+ -> Zn^2+ + Cu. The electrons appear in the half-reactions but cancel in the combined equation.*`,
      analogy: 'Think of a redox reaction as a bank transfer. The oxidized metal is the sender (loses electron "money"). The reduced metal is the receiver (gains electron "money"). The total transferred from all senders must equal the total received by all receivers — the bank (nature) does not create or destroy electrons.',
      storyConnection: 'Every step of Bidriware production involves redox chemistry. Smelting the zinc ore: ZnO + C -> Zn + CO (carbon reduces zinc oxide). Darkening: Zn + Cu^2+ -> Zn^2+ + Cu (zinc reduces copper ions). Even the long-term preservation: silver resists oxidation, keeping the inlay bright for centuries.',
      checkQuestion: 'Balance this redox reaction: Fe + Ag^+ -> Fe^2+ + Ag. How many silver ions are needed per iron atom?',
      checkAnswer: 'Iron loses 2 electrons: Fe -> Fe^2+ + 2e^-. Each silver gains 1 electron: Ag^+ + e^- -> Ag. To balance electrons: need 2 Ag^+ for every Fe. Balanced: Fe + 2Ag^+ -> Fe^2+ + 2Ag.',
      codeIntro: 'Balance redox reactions and calculate the mass of metals deposited or dissolved.',
      code: `# Redox reactions — balancing and stoichiometry

# Half-reactions database
half_reactions = {
    "Zn": {"ion": "Zn2+", "electrons": 2, "direction": "oxidation",
            "mass": 65.38},
    "Cu": {"ion": "Cu2+", "electrons": 2, "direction": "reduction",
            "mass": 63.55},
    "Ag": {"ion": "Ag+", "electrons": 1, "direction": "reduction",
            "mass": 107.87},
    "Fe": {"ion": "Fe2+", "electrons": 2, "direction": "oxidation",
            "mass": 55.85},
    "Au": {"ion": "Au3+", "electrons": 3, "direction": "reduction",
            "mass": 196.97},
}

def balance_redox(oxidized, reduced):
    """Balance a displacement reaction and calculate stoichiometry."""
    ox = half_reactions[oxidized]
    red = half_reactions[reduced]

    # Find LCM of electrons
    from math import gcd
    e_ox = ox["electrons"]
    e_red = red["electrons"]
    lcm = e_ox * e_red // gcd(e_ox, e_red)

    coeff_ox = lcm // e_ox  # moles of oxidized metal
    coeff_red = lcm // e_red  # moles of reduced metal

    return {
        "oxidized": oxidized, "reduced": reduced,
        "coeff_ox": coeff_ox, "coeff_red": coeff_red,
        "electrons": lcm,
        "mass_ox": coeff_ox * ox["mass"],
        "mass_red": coeff_red * red["mass"],
    }

print("=== Balanced Redox Reactions ===")
print()

reactions = [
    ("Zn", "Cu"),  # Bidriware darkening
    ("Zn", "Ag"),  # Silver recovery
    ("Fe", "Cu"),  # Copper cementation
    ("Zn", "Au"),  # Gold displacement
    ("Fe", "Ag"),  # Silver recovery
]

for ox, red in reactions:
    result = balance_redox(ox, red)
    print(f"{result['coeff_ox']}{ox} + {result['coeff_red']}{red}(ion) -> "
          f"{result['coeff_ox']}{ox}(ion) + {result['coeff_red']}{red}")
    print(f"  Electrons transferred: {result['electrons']}")
    print(f"  Mass ratio: {result['mass_ox']:.1f} g {ox} dissolves, "
          f"{result['mass_red']:.1f} g {red} deposits")
    print()

# Bidriware application: how much zinc dissolves during darkening?
print("=== Bidriware Darkening Calculation ===")
# A vase has 50 cm^2 surface area, darkening layer is 10 micrometres deep
surface_area_cm2 = 50
depth_um = 10
depth_cm = depth_um * 1e-4
volume_cm3 = surface_area_cm2 * depth_cm
density_zn = 7.13  # g/cm^3

mass_zn_dissolved = volume_cm3 * density_zn
moles_zn = mass_zn_dissolved / 65.38
moles_cu_deposited = moles_zn  # 1:1 ratio
mass_cu_deposited = moles_cu_deposited * 63.55

# CuSO4 needed (molecular weight 159.6)
mass_cuso4 = moles_cu_deposited * 159.6

print(f"Vase surface: {surface_area_cm2} cm^2")
print(f"Darkening depth: {depth_um} micrometres")
print(f"Zinc dissolved: {mass_zn_dissolved*1000:.2f} mg")
print(f"Copper deposited: {mass_cu_deposited*1000:.2f} mg")
print(f"CuSO4 needed: {mass_cuso4*1000:.2f} mg = {mass_cuso4:.4f} g")
print(f"If CuSO4 solution is 5% by weight: {mass_cuso4/0.05:.2f} g solution")`,
      challenge: 'Calculate how much silver (in grams) could be recovered from 1 litre of 0.1 M AgNO3 solution using zinc displacement. How much zinc would be consumed? Is this economically viable if silver is $800/kg and zinc is $2.50/kg?',
      successHint: 'Redox stoichiometry is the quantitative foundation of electrochemistry. It governs battery capacity (how many electrons can be stored), electroplating thickness (how much metal deposits), and corrosion rates (how fast a structure degrades). Every calculation you just performed is used daily in chemical engineering.',
    },
    {
      title: 'Electrochemical cells — turning chemistry into electricity',
      concept: `An **electrochemical cell** converts chemical energy into electrical energy (or vice versa). It consists of two **electrodes** (metals) immersed in **electrolyte** solutions, connected by a wire (for electron flow) and a **salt bridge** (for ion flow).

In a **galvanic cell** (battery), a spontaneous redox reaction drives electrons through the external circuit. The **anode** (negative terminal) is where oxidation occurs. The **cathode** (positive terminal) is where reduction occurs. Electrons flow from anode to cathode through the wire, doing useful work.

The voltage of the cell equals the difference in electrode potentials: **E_cell = E_cathode - E_anode**. A zinc-copper cell (Daniell cell) has E = 0.340 - (-0.762) = 1.102 V. A zinc-silver cell has E = 0.799 - (-0.762) = 1.561 V.

📚 *The Daniell cell (1836): zinc anode in ZnSO4 solution | salt bridge | copper cathode in CuSO4 solution. Zinc dissolves at the anode (Zn -> Zn^2+ + 2e^-), copper deposits at the cathode (Cu^2+ + 2e^- -> Cu). Voltage: 1.1 V.*`,
      analogy: 'Think of a waterfall. Water flows from high (anode, high energy metal) to low (cathode, low energy metal). The falling water can turn a wheel and do work (power a device). The height difference (voltage) determines how much work can be done. The flow rate (current) determines how fast.',
      storyConnection: 'The Bidriware darkening reaction (Zn + Cu^2+ -> Zn^2+ + Cu) is the SAME chemistry as a Daniell cell battery — but without the wire. If you separated the zinc and copper into different containers connected by a wire, you would have a 1.1V battery. The Bidriware artisan is "wasting" electrical energy as heat — an electrochemist would capture it.',
      checkQuestion: 'A zinc-silver cell has E = 1.56 V. If you connect 4 cells in series, what is the total voltage? If each cell can deliver 0.5 A, what power does the battery produce?',
      checkAnswer: 'Voltage: 4 * 1.56 = 6.24 V. Power: 6.24 * 0.5 = 3.12 W. This is enough to light a small LED or charge a phone slowly.',
      codeIntro: 'Design electrochemical cells and calculate their voltage, energy, and capacity.',
      code: `# Electrochemical cells — voltage and energy calculations

E0 = {
    "Li": -3.040, "K": -2.924, "Na": -2.714, "Mg": -2.372,
    "Al": -1.662, "Zn": -0.762, "Fe": -0.440, "Ni": -0.257,
    "Sn": -0.136, "Pb": -0.126, "H": 0.000, "Cu": 0.340,
    "Ag": 0.799, "Pt": 1.200, "Au": 1.500,
}

# Electrons transferred per atom
n_electrons = {
    "Li": 1, "K": 1, "Na": 1, "Mg": 2, "Al": 3, "Zn": 2,
    "Fe": 2, "Ni": 2, "Sn": 2, "Pb": 2, "Cu": 2, "Ag": 1, "Au": 3,
}

atomic_mass = {
    "Li": 6.94, "Zn": 65.38, "Fe": 55.85, "Al": 26.98,
    "Cu": 63.55, "Ag": 107.87, "Pb": 207.2, "Ni": 58.69,
}

F = 96485  # Faraday constant (C/mol)

def cell_voltage(anode, cathode):
    return E0[cathode] - E0[anode]

def cell_energy_per_kg(anode, cathode):
    """Theoretical energy density in Wh/kg (anode material only)."""
    V = cell_voltage(anode, cathode)
    n = n_electrons[anode]
    mass_kg = atomic_mass.get(anode, 100) / 1000  # kg per mol
    # Energy = V * n * F (joules per mol of anode)
    energy_j = V * n * F
    energy_wh = energy_j / 3600
    return energy_wh / mass_kg  # Wh per kg

print("=== Electrochemical Cell Voltages ===")
print("All possible cells (anode | cathode)")
print()

anodes = ["Li", "Zn", "Fe", "Al", "Pb", "Ni"]
cathodes = ["Cu", "Ag", "Au"]

print(f"{'':>6}", end="")
for cat in cathodes:
    print(f" {cat:>8}", end="")
print()
print("-" * 32)

for an in anodes:
    print(f"{an:>4} |", end="")
    for cat in cathodes:
        V = cell_voltage(an, cat)
        print(f" {V:>7.3f}V", end="")
    print()

print()
print("=== Battery Comparison ===")
batteries = [
    ("Daniell (Zn-Cu)", "Zn", "Cu"),
    ("Zinc-Silver", "Zn", "Ag"),
    ("Iron-Copper", "Fe", "Cu"),
    ("Aluminum-Silver", "Al", "Ag"),
    ("Lithium-Copper", "Li", "Cu"),
]

print(f"{'Battery':<25} {'Voltage':>8} {'Energy (Wh/kg)':>15}")
print("-" * 50)

for name, an, cat in batteries:
    V = cell_voltage(an, cat)
    if an in atomic_mass:
        E_density = cell_energy_per_kg(an, cat)
        print(f"{name:<25} {V:>7.3f}V {E_density:>13.0f}")
    else:
        print(f"{name:<25} {V:>7.3f}V {'N/A':>15}")

print()
# Bidriware as a "battery"
print("=== Bidriware: An Accidental Battery ===")
V_bidri = cell_voltage("Zn", "Cu")
print(f"Zinc-Copper (Bidriware darkening) voltage: {V_bidri:.3f} V")
print(f"When zinc contacts CuSO4, this {V_bidri:.1f}V of potential")
print(f"drives the displacement reaction spontaneously.")
print(f"The energy is released as heat, not captured as electricity.")

# How much energy is "wasted" darkening a vase?
moles_zn = 0.05  # approximate moles of Zn dissolved
energy_j = V_bidri * 2 * F * moles_zn
print(f"\\nEnergy released darkening a vase: {energy_j:.0f} J = {energy_j/4.184:.0f} cal")
print(f"Enough to heat {energy_j/(4.184*1000*1):.1f} mL of water by 1 degree C")`,
      challenge: 'Design a "Bidriware battery" using zinc and silver electrodes (since both metals are present in the artwork). What voltage would it produce? If the silver inlay weighs 5 grams, how many amp-hours of capacity would this battery have? (Hint: Ag^+ + e^- -> Ag, so 107.87 g of Ag = 1 Faraday = 26.8 Ah.)',
      successHint: 'Electrochemical cells are the basis of ALL batteries — from the zinc-carbon cells in a TV remote to the lithium-ion cells in your phone. The voltage calculation E = E_cathode - E_anode that you just used is the same equation battery engineers use to design every battery on Earth.',
    },
    {
      title: 'The Nernst equation — how concentration affects voltage',
      concept: `The standard electrode potential E0 applies only when all ion concentrations are 1 M (1 mole per litre) and temperature is 25C. In real systems, concentrations vary. The **Nernst equation** adjusts the voltage for non-standard conditions:

**E = E0 - (RT/nF) * ln(Q)**

Where R is the gas constant (8.314 J/mol*K), T is temperature in Kelvin, n is electrons transferred, F is Faraday constant (96,485 C/mol), and Q is the reaction quotient ([products]/[reactants]).

At 25C, this simplifies to: **E = E0 - (0.0592/n) * log10(Q)**

As the reaction proceeds, products accumulate and reactants are consumed. Q increases, and E decreases. Eventually, E reaches zero — the reaction has reached **equilibrium** and stops. This is why batteries go flat: the concentration changes reduce the voltage to zero.

📚 *The Nernst equation connects thermodynamics (energy) to chemistry (concentrations). At equilibrium, E = 0 and Q = K (the equilibrium constant). From E0, you can calculate K: ln(K) = nFE0/RT.*`,
      analogy: 'Think of a water tank with a tap at the bottom. When the tank is full (high concentration of reactants), water pressure is high and flow is fast (high voltage). As the tank empties (reactants consumed), pressure drops and flow slows. Eventually the tank is empty and flow stops — equilibrium.',
      storyConnection: 'During Bidriware darkening, the CuSO4 solution starts concentrated. As the reaction proceeds, Cu^2+ is consumed (deposited as metal) and Zn^2+ accumulates in solution. The Nernst equation predicts that the reaction slows down as the solution changes. Craftsmen must periodically refresh the darkening solution to maintain the reaction rate.',
      checkQuestion: 'For the Daniell cell (Zn-Cu) with E0 = 1.102 V, if Zn^2+ concentration rises to 1.0 M and Cu^2+ drops to 0.01 M, what is the new cell voltage?',
      checkAnswer: 'Q = [Zn^2+]/[Cu^2+] = 1.0/0.01 = 100. E = 1.102 - (0.0592/2) * log10(100) = 1.102 - 0.0296 * 2 = 1.102 - 0.059 = 1.043 V. The voltage drops by about 0.06 V — the battery is weakening.',
      codeIntro: 'Apply the Nernst equation to calculate how cell voltage changes with concentration.',
      code: `import numpy as np

# Nernst equation: E = E0 - (RT/nF) * ln(Q)

R = 8.314      # J/(mol*K)
F = 96485      # C/mol
T = 298.15     # K (25°C)

def nernst(E0, n, Q, temp=298.15):
    """Calculate cell voltage using Nernst equation."""
    if Q <= 0:
        return E0  # undefined for Q <= 0
    return E0 - (R * temp / (n * F)) * np.log(Q)

def nernst_simplified(E0, n, Q):
    """Simplified Nernst at 25°C: E = E0 - 0.0592/n * log10(Q)"""
    if Q <= 0:
        return E0
    return E0 - (0.05916 / n) * np.log10(Q)

# Daniell cell: Zn + Cu2+ -> Zn2+ + Cu
E0_daniell = 1.102
n = 2

print("=== Nernst Equation: Daniell Cell ===")
print(f"E0 = {E0_daniell} V | n = {n} electrons")
print()
print(f"{'[Zn2+]':>8} {'[Cu2+]':>8} {'Q':>10} {'E (V)':>8} {'% of E0':>8}")
print("-" * 44)

for zn_conc in [0.001, 0.01, 0.1, 1.0]:
    for cu_conc in [1.0, 0.1, 0.01, 0.001]:
        Q = zn_conc / cu_conc
        E = nernst_simplified(E0_daniell, n, Q)
        pct = E / E0_daniell * 100
        print(f"{zn_conc:>8.3f} {cu_conc:>8.3f} {Q:>10.1f} {E:>8.3f} {pct:>7.1f}%")

print()
# Battery discharge curve
print("=== Battery Discharge Simulation ===")
print("Starting: [Cu2+] = 1.0 M, [Zn2+] = 0.001 M")
print()

# Simulate discharge: Cu2+ decreases, Zn2+ increases
cu_initial = 1.0
zn_initial = 0.001
volume_L = 0.1  # 100 mL

# Each mole of reaction consumes 1 mol Cu2+ and produces 1 mol Zn2+
total_moles = cu_initial * volume_L  # moles available

print(f"{'Discharged %':<14} {'[Cu2+]':>8} {'[Zn2+]':>8} {'Q':>10} {'Voltage':>8}")
print("-" * 50)

for pct in range(0, 100, 5):
    reacted = total_moles * pct / 100
    cu_now = (cu_initial * volume_L - reacted) / volume_L
    zn_now = (zn_initial * volume_L + reacted) / volume_L
    if cu_now <= 0.0001:
        cu_now = 0.0001
    Q = zn_now / cu_now
    E = nernst_simplified(E0_daniell, n, Q)
    print(f"{pct:>10}%    {cu_now:>8.4f} {zn_now:>8.4f} {Q:>10.1f} {E:>7.3f}V")

print()
# Equilibrium
K = 10 ** (n * E0_daniell / 0.05916)
print(f"Equilibrium constant K = {K:.2e}")
print(f"At equilibrium, E = 0 V and Q = K")
print(f"The reaction is essentially complete (K >> 1)")`,
      challenge: 'How does temperature affect the voltage? Calculate the Daniell cell voltage at 0 degrees C (273 K) and 50 degrees C (323 K) with Q = 1. The Nernst equation predicts that at higher temperature, the voltage correction term is larger. Does this mean hot batteries have higher or lower voltage?',
      successHint: 'The Nernst equation is one of the most important equations in electrochemistry. It governs battery voltage, corrosion rates, pH sensors, and biological membrane potentials. The glucose sensor in a diabetic monitor and the pH meter in a chemistry lab both work on the Nernst equation.',
    },
    {
      title: 'Faraday laws — quantifying electrochemical reactions',
      concept: `**Faraday's laws of electrolysis** connect the amount of electricity passed through a cell to the amount of material deposited or dissolved. First law: the mass of substance deposited is proportional to the charge passed (Q = I * t). Second law: the mass deposited per coulomb depends on the atomic mass and valence of the element.

Combined: **m = (M * I * t) / (n * F)**, where m is mass deposited (grams), M is molar mass (g/mol), I is current (amps), t is time (seconds), n is electrons per ion, and F is Faraday constant (96,485 C/mol).

For silver electroplating: M = 107.87, n = 1. To deposit 1 gram of silver: t = (1 * 1 * 96485) / (107.87 * 1) = 895 seconds at 1 amp. For zinc: M = 65.38, n = 2. To dissolve 1 gram of zinc: t = (1 * 2 * 96485) / (65.38 * 1) = 2952 seconds.

📚 *One Faraday of charge (96,485 C) deposits one mole of a monovalent metal or half a mole of a divalent metal. This is because each mole of monovalent ions needs 1 mole of electrons, while divalent ions need 2 moles.*`,
      analogy: 'Think of a coin-operated vending machine. Each coin (electron) gets you one item (one atom of metal). Monovalent metals cost 1 coin per atom. Divalent metals cost 2 coins per atom. To get more atoms, insert more coins (more charge). Faraday law tells you exactly how many coins you need for a given amount of metal.',
      storyConnection: 'Modern Bidriware production could use electroplating to deposit silver into the engraved grooves — a faster and more uniform process than traditional hammering. Using Faraday law, a silversmith could calculate exactly how long to run the electroplating bath to achieve the desired silver thickness. Some contemporary workshops are beginning to explore this hybrid of traditional and modern techniques.',
      checkQuestion: 'To electroplate 5 grams of silver at 2 amps, how long does it take?',
      checkAnswer: 't = (m * n * F) / (M * I) = (5 * 1 * 96485) / (107.87 * 2) = 482425 / 215.74 = 2236 seconds = 37.3 minutes.',
      codeIntro: 'Use Faraday laws to calculate electroplating times and amounts for Bidriware production.',
      code: `import numpy as np

# Faraday's laws of electrolysis

F = 96485  # C/mol (Faraday constant)

def electroplating_time(mass_g, molar_mass, n_electrons, current_A):
    """Time to deposit a given mass of metal (seconds)."""
    return (mass_g * n_electrons * F) / (molar_mass * current_A)

def mass_deposited(current_A, time_s, molar_mass, n_electrons):
    """Mass deposited for given current and time (grams)."""
    return (molar_mass * current_A * time_s) / (n_electrons * F)

def thickness_from_mass(mass_g, area_cm2, density_g_cm3):
    """Thickness of deposit from mass and area (micrometres)."""
    volume_cm3 = mass_g / density_g_cm3
    thickness_cm = volume_cm3 / area_cm2
    return thickness_cm * 1e4  # cm to micrometres

# Electroplating parameters for different metals
metals = {
    "Silver": {"M": 107.87, "n": 1, "density": 10.49, "cost_kg": 800},
    "Copper": {"M": 63.55, "n": 2, "density": 8.96, "cost_kg": 8},
    "Gold": {"M": 196.97, "n": 3, "density": 19.32, "cost_kg": 60000},
    "Zinc": {"M": 65.38, "n": 2, "density": 7.13, "cost_kg": 2.5},
    "Nickel": {"M": 58.69, "n": 2, "density": 8.91, "cost_kg": 15},
}

print("=== Electroplating Calculator ===")
print("Target: 10 micrometre coating on 100 cm^2 surface")
print()

target_thickness_um = 10
area_cm2 = 100
current = 2.0  # amps

print(f"{'Metal':<10} {'Mass (g)':>9} {'Time (min)':>11} {'Charge (C)':>11} "
      f"{'Cost ($)':>9}")
print("-" * 52)

for name, props in metals.items():
    # Volume needed
    thickness_cm = target_thickness_um * 1e-4
    volume = area_cm2 * thickness_cm
    mass = volume * props["density"]
    time_s = electroplating_time(mass, props["M"], props["n"], current)
    charge = current * time_s
    cost = mass * props["cost_kg"] / 1000

    print(f"{name:<10} {mass:>9.3f} {time_s/60:>11.1f} {charge:>11.0f} "
          f"\{cost:>7.2f}")

print()
# Bidriware silver inlay comparison
print("=== Silver Inlay: Traditional vs Electroplating ===")
inlay_mass = 3.0  # grams of silver for a small vase

trad_time = 120  # minutes (skilled craftsman, hammering)
electro_time = electroplating_time(inlay_mass, 107.87, 1, 2.0) / 60

print(f"Silver mass: {inlay_mass} g")
print(f"Traditional hammering: ~{trad_time} minutes (skilled artisan)")
print(f"Electroplating at 2A: {electro_time:.1f} minutes")
print(f"Speed advantage: {trad_time/electro_time:.0f}x faster")
print()
print("But traditional inlay has DEPTH and TEXTURE that")
print("electroplating cannot easily replicate. The craft endures.")

print()
# Charge to deposit one mole of each metal
print("=== Charge per Gram for Each Metal ===")
print(f"{'Metal':<10} {'Charge/gram (C)':>16} {'Ah/gram':>10}")
print("-" * 38)
for name, props in metals.items():
    charge_per_g = props["n"] * F / props["M"]
    ah_per_g = charge_per_g / 3600
    print(f"{name:<10} {charge_per_g:>16.0f} {ah_per_g:>10.3f}")`,
      challenge: 'A Bidriware workshop wants to electroplate 50 small vases per day, each needing 2 g of silver. If they use a 10 A power supply, how many hours of plating time is needed? What is the daily electricity cost at $0.10/kWh if the cell voltage is 1.5 V?',
      successHint: 'Faraday laws are used in every electroplating shop, battery factory, and aluminum smelter in the world. The aluminum you use daily is produced by electrolysis using Faraday law calculations — consuming about 5% of the world total electricity. You just learned the quantitative tool behind this massive industry.',
    },
    {
      title: 'Galvanic corrosion — when two metals touch',
      concept: `When two different metals are in contact in the presence of moisture (electrolyte), the more reactive metal corrodes faster than it would alone. This is **galvanic corrosion** — the two metals form an unintentional battery, with the more reactive metal acting as the anode (dissolving) and the less reactive metal as the cathode (protected).

The rate of galvanic corrosion depends on: (1) the **potential difference** between the metals (larger difference = faster corrosion), (2) the **area ratio** (small anode + large cathode = fast corrosion of the anode), and (3) the **electrolyte conductivity** (saltwater is much worse than freshwater).

In Bidriware, zinc (anode) is in direct contact with silver (cathode). The potential difference is 1.56 V — very large. However, corrosion is slow because Bidriware is used indoors (no electrolyte) and the darkening treatment creates a protective oxide layer on the zinc.

📚 *The area ratio rule: a small anode connected to a large cathode corrodes rapidly (all the corrosion current is concentrated on a small area). A large anode with a small cathode corrodes slowly (the current is spread over a large area). This is why a tiny scratch in a protective coating can cause rapid localized corrosion.*`,
      analogy: 'Imagine two buckets connected by a pipe, one on a high shelf (reactive metal) and one on the floor (noble metal). Water flows from high to low (electrons flow from reactive to noble). The high bucket empties (the reactive metal dissolves). The height difference (voltage) determines how fast the flow happens.',
      storyConnection: 'The longevity of Bidriware depends on minimizing galvanic corrosion between the zinc body and silver inlay. The protective black oxide layer on the zinc acts as a barrier, reducing the effective electrolyte contact. In humid climates, Bidriware requires occasional waxing to maintain this barrier — without it, the zinc around the silver inlay would gradually dissolve.',
      checkQuestion: 'A steel bolt (iron, E0 = -0.44 V) is used to fasten an aluminum plate (E0 = -1.66 V). Which metal corrodes? What is the driving voltage?',
      checkAnswer: 'Aluminum is more reactive (more negative E0), so it acts as the anode and corrodes. Driving voltage = E0(Fe) - E0(Al) = -0.44 - (-1.66) = 1.22 V. This is a significant galvanic effect — the aluminum around the bolt will corrode rapidly in the presence of moisture.',
      codeIntro: 'Model galvanic corrosion rates and predict which metals are safe to use together.',
      code: `import numpy as np

# Galvanic corrosion model

E0 = {
    "Mg": -2.372, "Al": -1.662, "Zn": -0.762, "Fe": -0.440,
    "Ni": -0.257, "Sn": -0.136, "Cu": 0.340, "Ag": 0.799,
    "Ti": -1.630, "Cr": -0.744, "Au": 1.500,
}

def galvanic_risk(metal_a, metal_b):
    """Assess galvanic corrosion risk between two metals."""
    delta_E = abs(E0[metal_a] - E0[metal_b])
    anode = metal_a if E0[metal_a] < E0[metal_b] else metal_b
    cathode = metal_b if anode == metal_a else metal_a

    if delta_E < 0.15:
        risk = "LOW"
    elif delta_E < 0.50:
        risk = "MODERATE"
    elif delta_E < 1.0:
        risk = "HIGH"
    else:
        risk = "SEVERE"

    return anode, cathode, delta_E, risk

print("=== Galvanic Corrosion Compatibility Chart ===")
metals_list = ["Mg", "Al", "Zn", "Fe", "Ni", "Sn", "Cu", "Ag", "Au"]

# Header
print(f"{'':>4}", end="")
for m in metals_list:
    print(f" {m:>4}", end="")
print()
print("-" * (5 + 5 * len(metals_list)))

for m1 in metals_list:
    print(f"{m1:>4}", end="")
    for m2 in metals_list:
        if m1 == m2:
            print(f" {'--':>4}", end="")
        else:
            delta = abs(E0[m1] - E0[m2])
            if delta < 0.15:
                symbol = "."
            elif delta < 0.5:
                symbol = "o"
            elif delta < 1.0:
                symbol = "X"
            else:
                symbol = "!!"
            print(f" {symbol:>4}", end="")
    print()

print()
print("Legend: . = safe  o = caution  X = risky  !! = severe")

print()
# Bidriware specific analysis
print("=== Bidriware: Zinc-Silver Contact ===")
anode, cathode, delta, risk = galvanic_risk("Zn", "Ag")
print(f"Anode (corrodes): {anode}")
print(f"Cathode (protected): {cathode}")
print(f"Potential difference: {delta:.3f} V")
print(f"Risk level: {risk}")
print()

# Corrosion rate model (simplified Butler-Volmer)
print("=== Corrosion Rate vs Area Ratio ===")
# i_corr proportional to delta_E and cathode/anode area ratio
base_rate = 0.1  # mm/year at area ratio 1:1

print(f"{'Ag:Zn ratio':<14} {'Corrosion rate':>15} {'Years to 0.1mm':>16}")
print("-" * 47)

for ratio in [0.01, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0]:
    # Rate increases with cathode area (silver)
    rate = base_rate * (1 + ratio) / 2
    years = 0.1 / rate if rate > 0 else 999
    print(f"  {ratio:<12.2f} {rate:>13.4f} mm/yr {years:>14.0f}")

print()
print("Low Ag:Zn ratio (small silver inlay) means slow corrosion.")
print("High ratio (mostly silver surface) means fast zinc loss.")
print("Bidriware designs keep the silver area fraction small — wise!")`,
      challenge: 'Design a "corrosion-proof" bimetallic system. Choose two metals with a potential difference less than 0.1 V. What metals would you pair? Would they still look different enough to create a visual contrast like Bidriware?',
      successHint: 'Galvanic corrosion is a major engineering concern. The Statue of Liberty had to be repaired because copper skin in contact with iron framework caused galvanic corrosion. Ship hulls use sacrificial zinc anodes to protect the steel. You just analyzed the same phenomenon that costs industry billions of dollars annually.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Electrochemical cells and Nernst equation</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises model redox reactions, electrochemical cells, Nernst equation, and Faraday laws.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
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
