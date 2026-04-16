import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SundarbansLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The Nernst equation — electrical potential across a membrane',
      concept: `When ions are distributed unevenly across a membrane, an electrical potential develops. The **Nernst equation** calculates this potential: **E = (RT / zF) * ln(C_out / C_in)**, where R is the gas constant, T is temperature, z is the ion charge, F is Faraday's constant, and C_out/C_in are the concentrations on each side.

This potential is not just a theoretical number — it is a real, measurable voltage. Mangrove root cell membranes typically maintain a potential of **-120 to -180 mV** (negative inside), which helps repel negatively charged chloride ions and attract positively charged potassium ions.

In the code below, you will calculate the Nernst potential for different ions across a mangrove root membrane and see how the electrical gradient works alongside the concentration gradient to control ion movement.`,
      analogy: 'Imagine a hill (concentration gradient) with an electric fence partway up (electrical potential). A charged ball rolling downhill might be stopped by the fence, even though gravity pulls it down. The Nernst equation tells you exactly how strong the fence needs to be to stop the ball at any given steepness of hill.',
      storyConnection: 'Mangrove root cells maintain precise electrical potentials across their membranes. This is not passive — it requires energy from ATP. The electrical potential acts as a second barrier against unwanted ions, complementing the physical barrier of the membrane. It is like having both a wall and an electric fence around the cell.',
      checkQuestion: 'At 25 C, if Na+ concentration is 10x higher outside the cell than inside, what is the Nernst potential? (Use RT/F = 25.7 mV at 25 C, z = +1)',
      checkAnswer: 'E = (25.7 mV / 1) * ln(10) = 25.7 * 2.303 = 59.2 mV. The equilibrium potential is +59.2 mV (positive outside). To keep Na+ out, the cell maintains a negative interior potential, pushing Na+ away from the cell.',
      codeIntro: 'Calculate Nernst potentials for different ions across a mangrove root cell membrane.',
      code: `import numpy as np

# Nernst equation calculator
# E = (RT / zF) * ln(C_out / C_in)

R = 8.314      # J/(mol K)
T = 303        # 30 C (Sundarbans)
F = 96485      # Faraday constant (C/mol)

# RT/F at 30 C
RT_F = R * T / F  # in volts
print(f"RT/F at {T-273} C = {RT_F*1000:.2f} mV")
print()

# Ion concentrations (mM) in mangrove root cells
ions = [
    {"name": "Na+",  "z": 1,  "C_out": 470, "C_in": 10},
    {"name": "K+",   "z": 1,  "C_out": 10,  "C_in": 140},
    {"name": "Cl-",  "z": -1, "C_out": 545, "C_in": 5},
    {"name": "Ca2+", "z": 2,  "C_out": 10,  "C_in": 0.1},
    {"name": "Mg2+", "z": 2,  "C_out": 53,  "C_in": 2},
    {"name": "H+",   "z": 1,  "C_out": 0.00004, "C_in": 0.0001},
]

print("=== Nernst Potentials Across Root Cell Membrane ===")
print(f"{'Ion':<8} {'C_out (mM)':>10} {'C_in (mM)':>10} {'Ratio':>8} {'E_nernst (mV)':>14}")
print("-" * 54)

for ion in ions:
    ratio = ion["C_out"] / ion["C_in"]
    E = (RT_F / ion["z"]) * np.log(ratio) * 1000  # mV
    print(f"{ion['name']:<8} {ion['C_out']:>10.1f} {ion['C_in']:>10.4f} {ratio:>8.1f} {E:>12.1f}")

# Actual membrane potential
V_membrane = -150  # mV (typical mangrove root cell)
print(f"\
Actual membrane potential: {V_membrane} mV")
print()

# Driving force for each ion
print("=== Electrochemical Driving Force ===")
print(f"{'Ion':<8} {'E_nernst':>10} {'V_memb':>8} {'Driving force':>14} {'Direction':<12}")
print("-" * 56)

for ion in ions:
    ratio = ion["C_out"] / ion["C_in"]
    E = (RT_F / ion["z"]) * np.log(ratio) * 1000
    driving = V_membrane - E
    if ion["z"] > 0:
        direction = "Into cell" if driving < 0 else "Out of cell"
    else:
        direction = "Out of cell" if driving < 0 else "Into cell"
    print(f"{ion['name']:<8} {E:>8.1f} {V_membrane:>8} {driving:>12.1f} {direction:<12}")

print()
print("Negative driving force for Na+ means it WANTS to enter —")
print("the cell must actively pump it out using ATP energy.")`,
      challenge: 'What happens if the cell membrane potential changes to -100 mV (less negative)? Recalculate the driving forces. Which ions would now leak in that were previously held out? This is what happens when a mangrove root is energy-starved — its defenses weaken.',
      successHint: 'The Nernst equation is foundational to neuroscience (nerve signals), cardiology (heart rhythms), battery design, and corrosion science. You just applied it to mangrove biology — the same math governs every system where charged particles cross a barrier.',
    },
    {
      title: 'Active transport — the ATP cost of pumping ions',
      concept: `When ions need to move against their electrochemical gradient (from low concentration to high concentration), the cell must spend energy. This is **active transport**, and the energy currency is **ATP** (adenosine triphosphate).

The minimum energy to move one mole of ions against a potential difference is: **Delta_G = z * F * Delta_V + RT * ln(C_in / C_out)**. The first term is the electrical work, the second is the concentration work. Each ATP molecule provides about **30.5 kJ/mol** of energy.

The **Na+/K+ ATPase** pump moves 3 Na+ out and 2 K+ in per ATP hydrolyzed. In mangrove roots, this pump runs constantly to maintain the low internal sodium concentration — consuming a significant fraction of the cell's energy budget.`,
      analogy: 'Active transport is like a sump pump in a basement. Water naturally seeps in (ions leak down their gradient). The pump runs continuously to remove water (pump ions out). If the power goes out (ATP runs low), the basement floods (ions accumulate). The electricity bill (ATP cost) depends on how fast the water seeps in and how high you need to pump it.',
      storyConnection: 'Mangrove root cells run their Na+/K+ pumps around the clock. In highly saline conditions, more sodium leaks in, and the pumps must work harder. This is the primary energy cost that slows mangrove growth in salty environments — the cells are spending ATP on survival (pumping salt out) instead of growth (building new tissue).',
      checkQuestion: 'If the Na+/K+ ATPase moves 3 Na+ out per ATP, and a mangrove root cell needs to pump out 10 million Na+ ions per second, how many ATP molecules per second are consumed?',
      checkAnswer: '10,000,000 / 3 = 3,333,333 ATP per second. Each ATP provides 30.5 kJ/mol, and one mole = 6.022e23 molecules. So energy per ATP = 30,500 / 6.022e23 = 5.07e-20 J. Total power = 3.33e6 * 5.07e-20 = 1.69e-13 W. Tiny per cell, but a tree has billions of root cells.',
      codeIntro: 'Calculate the ATP cost of maintaining low sodium in mangrove root cells at different salinities.',
      code: `import numpy as np

# Active transport energy calculator
# Delta_G = z*F*Delta_V + R*T*ln(C_in/C_out)

R = 8.314      # J/(mol K)
T = 303        # 30 C
F = 96485      # C/mol

# Cell parameters
V_membrane = -0.150  # V (-150 mV)

# Na+/K+ ATPase: 3 Na+ out, 2 K+ in per ATP
# ATP energy: 30.5 kJ/mol

atp_energy = 30500  # J/mol

def energy_to_pump_na(c_out_mM, c_in_mM, voltage):
    """Energy to move 1 mol Na+ from inside to outside"""
    z = 1  # Na+ charge
    # Electrical work (moving + charge from - to +)
    elec_work = z * F * (-voltage)  # positive since moving against potential
    # Concentration work
    conc_work = R * T * np.log(c_out_mM / c_in_mM)
    return elec_work + conc_work

# Different salinity scenarios
salinities = [
    ("Fresh water",  5,   10),   # C_out mM, C_in mM
    ("Low brackish", 50,  10),
    ("Sundarbans avg", 300, 10),
    ("Full seawater", 470, 10),
    ("Hypersaline",  700, 10),
]

print("=== ATP Cost of Sodium Exclusion ===")
print(f"Membrane potential: {V_membrane*1000:.0f} mV")
print(f"Internal Na+ target: 10 mM")
print()
print(f"{'Condition':<18} {'Na+ out':>8} {'Energy':>14} {'ATP/Na+':>10}")
print(f"{'':18} {'(mM)':>8} {'(kJ/mol)':>14} {'molecules':>10}")
print("-" * 54)

for name, c_out, c_in in salinities:
    dG = energy_to_pump_na(c_out, c_in, V_membrane) / 1000  # kJ/mol
    atp_per_mol = dG / 30.5  # mol ATP per mol Na+
    # Na+/K+ ATPase moves 3 Na+ per ATP, so effective:
    atp_molecules = 1 / 3  # per Na+ ion (theoretical minimum)
    actual_ratio = max(atp_per_mol, 1/3)  # can't be less than pump stoichiometry
    print(f"{name:<18} {c_out:>8} {dG:>12.1f} {actual_ratio:>8.2f}")

# Daily ATP budget for a root system
print()
print("=== Daily Energy Budget (one root segment) ===")
na_flux_mol_day = 0.001  # mol Na+ leaking in per day per cm2

for name, c_out, c_in in salinities:
    dG = energy_to_pump_na(c_out, c_in, V_membrane)
    daily_energy_j = dG * na_flux_mol_day * 100  # 100 cm2 root area
    daily_energy_kj = daily_energy_j / 1000
    atp_mol = daily_energy_j / atp_energy
    glucose_mg = atp_mol * 180 / 36 * 1000  # 36 ATP per glucose, MW 180
    print(f"{name:<18} Energy: {daily_energy_kj:>6.1f} kJ  Glucose: {glucose_mg:>6.1f} mg")

print()
print("Higher salinity = more energy = more glucose burned just to survive.")`,
      challenge: 'What if the mangrove could increase its membrane potential to -200 mV? Recalculate the driving force for Na+ entry. A stronger potential would reduce leakage and lower ATP costs — but generating the potential itself costs ATP. Find the sweet spot where total ATP cost is minimized.',
      successHint: 'Active transport is one of the biggest energy expenditures in all living cells. Your kidneys spend about 80% of their ATP on ion pumping. Understanding this energy cost is key to physiology, pharmacology, and bio-inspired engineering.',
    },
    {
      title: 'The Goldman equation — membrane potential with multiple ions',
      concept: `Real membranes are permeable to multiple ions simultaneously. The **Goldman-Hodgkin-Katz (GHK) equation** calculates the membrane potential when multiple ions contribute:

**V_m = (RT/F) * ln((P_K[K+]_out + P_Na[Na+]_out + P_Cl[Cl-]_in) / (P_K[K+]_in + P_Na[Na+]_in + P_Cl[Cl-]_out))**

The key difference from the Nernst equation: each ion's contribution is weighted by its **permeability** (P). An ion with high permeability has more influence on the membrane potential. In mangrove roots, the permeability to K+ is much higher than to Na+, which helps maintain a negative resting potential.

In the code below, you will use the GHK equation to calculate the membrane potential of a mangrove root cell and explore how changing permeabilities shifts the potential.`,
      analogy: 'The GHK equation is like a weighted vote. Three groups (K+, Na+, Cl-) each want a different outcome (different equilibrium potentials). The final result (membrane potential) is a weighted average, where each group\'s vote counts in proportion to its influence (permeability). If K+ has 100x more influence than Na+, the result is close to the K+ preference.',
      storyConnection: 'When a mangrove root encounters a sudden salinity spike (monsoon tide change), the membrane permeabilities shift temporarily. Na+ permeability increases (more Na+ leaks in), the membrane depolarizes (becomes less negative), and the cell triggers emergency responses — closing ion channels, activating more pumps, and producing stress proteins. The GHK equation captures this dynamic response.',
      checkQuestion: 'If P_K is 100 times larger than P_Na, which ion dominates the membrane potential? What is the approximate potential if K+ Nernst potential is -90 mV and Na+ is +60 mV?',
      checkAnswer: 'K+ dominates because its permeability is 100x higher. The potential will be very close to -90 mV (the K+ Nernst potential). With the GHK equation, it works out to about -84 mV — slightly less negative than -90 because Na+ pulls it a tiny bit positive.',
      codeIntro: 'Calculate the Goldman membrane potential for mangrove root cells with multiple ion permeabilities.',
      code: `import numpy as np

# Goldman-Hodgkin-Katz equation
# V = (RT/F) * ln((P_K*K_out + P_Na*Na_out + P_Cl*Cl_in) /
#                  (P_K*K_in + P_Na*Na_in + P_Cl*Cl_out))

R = 8.314
T = 303
F = 96485

def goldman_potential(K_out, K_in, Na_out, Na_in, Cl_out, Cl_in,
                      P_K=1.0, P_Na=0.04, P_Cl=0.45):
    """Calculate Goldman membrane potential in mV"""
    numerator = P_K * K_out + P_Na * Na_out + P_Cl * Cl_in
    denominator = P_K * K_in + P_Na * Na_in + P_Cl * Cl_out
    V = (R * T / F) * np.log(numerator / denominator)
    return V * 1000  # convert to mV

# Mangrove root cell ion concentrations (mM)
K_out, K_in = 10, 140
Na_out, Na_in = 470, 10
Cl_out, Cl_in = 545, 5

# Normal conditions
V_normal = goldman_potential(K_out, K_in, Na_out, Na_in, Cl_out, Cl_in)
print("=== Goldman Membrane Potential ===")
print(f"Normal conditions: {V_normal:.1f} mV")
print()

# Vary Na+ permeability (simulating salt stress)
print("=== Effect of Na+ Permeability (Salt Stress) ===")
print(f"{'P_Na/P_K ratio':>15} {'V_membrane (mV)':>16} {'Status':<20}")
print("-" * 54)

na_ratios = [0.01, 0.02, 0.04, 0.08, 0.15, 0.30, 0.50, 1.0]
for ratio in na_ratios:
    V = goldman_potential(K_out, K_in, Na_out, Na_in, Cl_out, Cl_in,
                          P_K=1.0, P_Na=ratio, P_Cl=0.45)
    status = "Healthy" if V < -120 else "Stressed" if V < -80 else "Critical"
    print(f"{ratio:>15.2f} {V:>14.1f} {status:<20}")

# Effect of external salinity
print()
print("=== Effect of Tidal Salinity Changes ===")
print(f"{'Na+ out (mM)':>12} {'Cl- out (mM)':>12} {'V_memb (mV)':>12}")
print("-" * 40)

# Na and Cl change together with salinity
for salinity_factor in [0.2, 0.5, 0.8, 1.0, 1.2, 1.5]:
    na = 470 * salinity_factor
    cl = 545 * salinity_factor
    V = goldman_potential(10, K_in, na, Na_in, cl, Cl_in)
    print(f"{na:>12.0f} {cl:>12.0f} {V:>10.1f}")

print()
print("Rising salinity depolarizes the membrane, forcing the cell")
print("to spend more ATP on pumps to restore the resting potential.")`,
      challenge: 'During a cyclone, the Sundarbans can temporarily become almost fresh (Na+ drops to 50 mM). Calculate the new Goldman potential. Then simulate what happens when the tide returns and Na+ spikes back to 600 mM within hours. How fast must the cell respond?',
      successHint: 'The Goldman equation is the foundation of all neurophysiology — every nerve impulse, every heartbeat, every muscle contraction depends on membrane potentials calculated by this equation. You just applied it to plant biology, showing its universal power.',
    },
    {
      title: 'Energy cost of salt exclusion — thermodynamic limits',
      concept: `There is a theoretical minimum energy to separate salt from water, set by **thermodynamics**. This minimum is: **W_min = -RT * (n_w * ln(x_w) + n_s * ln(x_s))**, where n_w and n_s are the moles of water and salt, and x_w and x_s are their mole fractions.

For seawater at 50% recovery, the minimum energy is about **1.06 kWh/m3**. No process — biological or engineered — can beat this limit. Real systems always use more: RO plants use 3-5 kWh/m3 (3-5x the minimum), and mangrove roots use an estimated 8-15 kWh/m3 equivalent (their biological machinery is less mechanically efficient but self-repairing).

The **second law efficiency** measures how close a real process comes to the thermodynamic limit: **eta = W_min / W_actual * 100%**.`,
      analogy: 'The thermodynamic minimum is like the shortest possible driving distance between two cities (a straight line). No real road achieves this — there are hills, curves, and detours. But the straight-line distance tells you the absolute best any road could be. The thermodynamic minimum tells you the absolute best any desalination process could be.',
      storyConnection: 'Mangrove roots evolved under no pressure to be energy-efficient in the engineering sense. They optimize for reliability, self-repair, and adaptability to changing salinity — not for minimum energy consumption. An RO plant is more efficient but breaks down without maintenance. A mangrove root is less efficient but self-repairs and adapts for decades.',
      checkQuestion: 'If the thermodynamic minimum is 1.06 kWh/m3 and an RO plant uses 3.5 kWh/m3, what is the second law efficiency?',
      checkAnswer: 'eta = 1.06 / 3.5 * 100 = 30.3%. The plant wastes about 70% of its energy as heat and friction. Modern plants with energy recovery devices achieve up to 40% second law efficiency.',
      codeIntro: 'Calculate the thermodynamic minimum energy for desalination at different salinities and recoveries.',
      code: `import numpy as np

# Thermodynamic minimum energy for desalination
# W_min at a given recovery rate

R = 8.314  # J/(mol K)
T = 298    # 25 C

def min_energy_kwh_m3(salinity_gL, recovery):
    """
    Minimum energy to desalinate water at given recovery.
    Uses the mixing entropy approach.
    """
    # Moles of NaCl per litre of feed
    MW_NaCl = 58.44
    n_salt = salinity_gL / MW_NaCl  # mol/L

    # Moles of water per litre
    MW_water = 18.015
    n_water = (1000 - salinity_gL) / MW_water  # mol/L

    # Brine concentration at given recovery
    brine_salt = salinity_gL / (1 - recovery)
    n_salt_brine = brine_salt / MW_NaCl
    n_water_brine = (1000 - brine_salt) / MW_water

    # Mole fractions
    x_w_feed = n_water / (n_water + 2 * n_salt)  # 2 for dissociation
    x_w_brine = n_water_brine / (n_water_brine + 2 * n_salt_brine)

    # Minimum work per mole of permeate water
    # Simplified: W_min = RT * ln(x_w_brine / x_w_feed) per mol water
    # Integrated over recovery
    W_per_mol = R * T * np.log(1 / x_w_brine)  # J/mol (approximate)

    # Convert to kWh/m3
    # 1 m3 = 55,556 mol water
    W_per_m3 = W_per_mol * 55556 / recovery
    return W_per_m3 / 3.6e6  # J to kWh

# Different salinities
salinities = [2, 5, 10, 20, 35, 50, 70]

print("=== Thermodynamic Minimum Energy ===")
print(f"Recovery: 50% | Temperature: {T-273} C")
print()
print(f"{'Salinity (g/L)':>14} {'W_min (kWh/m3)':>16} {'System Type':<20}")
print("-" * 52)

for s in salinities:
    w = min_energy_kwh_m3(s, 0.5)
    sys_type = "Brackish" if s < 10 else "Seawater" if s < 40 else "Brine"
    print(f"{s:>14} {w:>14.2f} {sys_type:<20}")

# Effect of recovery rate
print()
print("=== Seawater (35 g/L) at Different Recoveries ===")
print(f"{'Recovery %':>10} {'W_min (kWh/m3)':>16} {'Actual RO':>12} {'Efficiency':>12}")
print("-" * 52)

for rec in [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]:
    w_min = min_energy_kwh_m3(35, rec)
    # Typical actual energy (increases with recovery)
    w_actual = 3.0 + 5.0 * (rec - 0.3)
    eff = w_min / w_actual * 100 if w_actual > 0 else 0
    print(f"{rec*100:>10.0f} {w_min:>14.2f} {w_actual:>10.1f} {eff:>10.1f}%")

# Compare biological vs engineered
print()
print("=== Biological vs Engineered Desalination ===")
systems = [
    ("Mangrove root", 35, 12.0),
    ("Modern RO plant", 35, 3.5),
    ("Best RO + ERD", 35, 2.0),
    ("Thermodynamic limit", 35, 1.06),
]

w_min = min_energy_kwh_m3(35, 0.5)
for name, sal, actual in systems:
    eff = w_min / actual * 100
    print(f"{name:<25} {actual:>6.1f} kWh/m3  Efficiency: {eff:>5.1f}%")`,
      challenge: 'Calculate the minimum energy for desalinating Dead Sea water (340 g/L). Why is this so much higher than seawater? What is the maximum recovery theoretically possible before the brine becomes saturated (NaCl solubility is 360 g/L)?',
      successHint: 'You just applied the second law of thermodynamics to a practical engineering problem. The thermodynamic minimum sets an absolute floor that no technology can break — understanding this limit prevents wasting resources chasing impossible efficiencies.',
    },
    {
      title: 'Ultrafiltration cascade — modeling a multi-stage root system',
      concept: `Mangrove roots do not filter salt in a single step. Multiple cell layers create a **filtration cascade** — each layer removes some salt, and the cumulative effect achieves the 95-97% total rejection observed in live trees.

A cascade with N stages, each with rejection rate r, achieves total rejection: **R_total = 1 - (1-r)^N**. If each stage rejects 50%, two stages reject 75%, three stages reject 87.5%, and so on. This is far more energy-efficient than achieving 97% in a single stage.

In the code below, you will model a multi-stage filtration cascade and optimize the number of stages for minimum total energy consumption.`,
      analogy: 'Filtering in stages is like wringing out a wet towel. One big wring removes most of the water, but a lot remains. A second wring removes half of what is left. A third gets half again. Each wring requires less effort than one enormous squeeze would, and the cumulative result is drier than any single wring.',
      storyConnection: 'Cross-sections of mangrove roots reveal 4-6 distinct cell layers between the outer surface and the central water-conducting xylem. Each layer has different membrane properties — the outer layers do coarse filtration, removing most salt. Inner layers do fine filtration, polishing the water to nearly fresh. This natural cascade inspired multi-stage industrial filtration.',
      checkQuestion: 'If each root cell layer rejects 60% of remaining salt and there are 5 layers, what is the total rejection?',
      checkAnswer: 'R_total = 1 - (1 - 0.6)^5 = 1 - 0.4^5 = 1 - 0.01024 = 0.9898 = 98.98%. Five stages of 60% each achieve nearly 99% total rejection — much easier than building one membrane that rejects 99% on its own.',
      codeIntro: 'Model a multi-stage filtration cascade and optimize for minimum energy use.',
      code: `import numpy as np

# Multi-stage filtration cascade model
# R_total = 1 - (1 - r)^N

def cascade_rejection(single_stage_r, num_stages):
    """Total rejection of N stages each with rejection r"""
    return 1 - (1 - single_stage_r) ** num_stages

def cascade_energy(single_stage_r, num_stages, feed_salinity, volume_L):
    """Approximate energy for multi-stage filtration"""
    total_energy = 0
    current_salinity = feed_salinity

    for stage in range(num_stages):
        # Osmotic pressure of current feed
        M = current_salinity / 58.44
        P_osmotic = 2 * M * 0.0821 * 303
        # Need pressure > P_osmotic; use 1.5x for practical operation
        P_applied = P_osmotic * 1.5
        # Energy = P * V (in atm*L, converted to kJ)
        energy_kj = P_applied * volume_L * 0.101325
        total_energy += energy_kj
        # Permeate salinity for next stage
        current_salinity = current_salinity * (1 - single_stage_r)

    return total_energy

# Compare single-stage vs multi-stage
print("=== Cascade Filtration: Total Rejection ===")
print(f"{'Stages':>8} {'Per-stage':>10} {'Total Rejection':>16}")
print("-" * 36)

for r in [0.3, 0.5, 0.6, 0.7]:
    for n in [1, 2, 3, 5, 8]:
        total = cascade_rejection(r, n) * 100
        if total >= 95 and total <= 99.5:
            print(f"{n:>8} {r*100:>8.0f}% {total:>14.2f}%")

# Find optimal number of stages
print()
print("=== Optimizing Number of Stages (target: 97% rejection) ===")
print(f"Feed: 35 g/L seawater, 100 L/day")
print()
print(f"{'Stages':>8} {'Per-stage r':>12} {'Total r':>10} {'Energy (kJ)':>12}")
print("-" * 44)

target = 0.97
for n in range(1, 9):
    # Find per-stage rejection needed to achieve 97% total
    # 1 - (1-r)^n = 0.97 => r = 1 - 0.03^(1/n)
    r = 1 - (1 - target) ** (1.0 / n)
    energy = cascade_energy(r, n, 35, 100)
    total_r = cascade_rejection(r, n) * 100
    print(f"{n:>8} {r*100:>10.1f}% {total_r:>8.1f}% {energy:>10.1f}")

# Mangrove root layers
print()
print("=== Mangrove Root Cross-Section Model ===")
layers = [
    ("Epidermis", 0.40),
    ("Exodermis", 0.55),
    ("Cortex layer 1", 0.30),
    ("Cortex layer 2", 0.35),
    ("Endodermis", 0.70),
]

cumulative = 0
salt = 35.0
print(f"{'Layer':<20} {'Rejection':>10} {'Salt after (g/L)':>16} {'Cumulative R':>14}")
print("-" * 62)

remaining_fraction = 1.0
for name, r in layers:
    remaining_fraction *= (1 - r)
    cumulative = 1 - remaining_fraction
    salt_after = 35.0 * remaining_fraction
    print(f"{name:<20} {r*100:>8.0f}% {salt_after:>14.2f} {cumulative*100:>12.1f}%")

print(f"\
Final salt in xylem sap: {35.0 * remaining_fraction:.2f} g/L")
print(f"Total rejection: {(1-remaining_fraction)*100:.1f}%")`,
      challenge: 'Add a sixth layer (aquaporin gate) with 50% rejection. How close to 100% can you get? Then try making one layer fail (set rejection to 0). How does the cascade handle partial failure? This redundancy is why mangroves are so resilient.',
      successHint: 'Cascade filtration is used in uranium enrichment, petroleum refining, water treatment, and pharmaceutical purification. The mathematical principle is identical: moderate rejection per stage, multiplied across many stages, achieves extreme purity with less energy than a single extreme stage.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Electrochemistry and active transport at the molecular level</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model Nernst potentials, active transport, and multi-stage filtration cascades.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
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
