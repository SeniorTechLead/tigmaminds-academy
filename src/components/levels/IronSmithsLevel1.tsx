import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function IronSmithsLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Elements and atoms — what is iron?',
      concept: `**Iron** (Fe, from Latin "ferrum") is element number 26 in the periodic table. Each iron atom has:
- 26 protons (defines it as iron)
- 26 electrons (in a neutral atom)
- ~30 neutrons (varies by isotope)
- Atomic mass: 55.845 amu

Iron is the **most stable element in the universe**. Its nucleus has the highest binding energy per nucleon — forming iron releases the maximum nuclear energy. This is why iron is the end product of fusion in massive stars.

Iron makes up ~5% of Earth's crust and ~35% of Earth's total mass (most of it in the core).

📚 *In Python, we store element data in variables and dictionaries. Dictionaries use \`key: value\` pairs to organize related information.*`,
      analogy: 'An iron atom is like a tiny solar system. The nucleus (sun) holds 26 protons and ~30 neutrons tightly packed together. The 26 electrons orbit in shells at different distances, like planets. But unlike planets, electrons can "jump" between orbits, releasing or absorbing energy as light.',
      storyConnection: 'The Lushai iron smiths of Mizoram worked with iron for centuries, transforming reddish ore into gleaming tools and weapons. They did not know about atoms or electrons, but they understood iron\'s properties intimately — its hardness, its response to heat, its tendency to rust. Modern chemistry explains what they knew through experience.',
      checkQuestion: 'Iron has atomic number 26. What does this tell you about the atom?',
      checkAnswer: 'It has exactly 26 protons in its nucleus. This is what makes it iron — change the number of protons and you get a different element (25 protons = manganese, 27 = cobalt). The number of electrons equals the protons in a neutral atom, and neutrons can vary (creating isotopes like Fe-54, Fe-56, Fe-57, Fe-58).',
      codeIntro: 'Explore the properties of iron compared to other common elements.',
      code: `# Iron and its neighbors on the periodic table

elements = {
    'Cr': {'name': 'Chromium', 'number': 24, 'mass': 52.0, 'density': 7.19, 'melting': 1907},
    'Mn': {'name': 'Manganese', 'number': 25, 'mass': 54.9, 'density': 7.21, 'melting': 1246},
    'Fe': {'name': 'Iron',      'number': 26, 'mass': 55.8, 'density': 7.87, 'melting': 1538},
    'Co': {'name': 'Cobalt',    'number': 27, 'mass': 58.9, 'density': 8.90, 'melting': 1495},
    'Ni': {'name': 'Nickel',    'number': 28, 'mass': 58.7, 'density': 8.91, 'melting': 1455},
    'Cu': {'name': 'Copper',    'number': 29, 'mass': 63.5, 'density': 8.96, 'melting': 1085},
}

print("IRON AND ITS PERIODIC TABLE NEIGHBORS")
print("=" * 65)
print(f"{'Sym':<4} {'Element':<12} {'#':>3} {'Mass':>6} {'Density':>8} {'Melting':>8}")
print(f"{'':4} {'':12} {'':3} {'(amu)':>6} {'(g/cm³)':>8} {'(°C)':>8}")
print("-" * 45)

for sym, props in elements.items():
    marker = " ◄ IRON" if sym == 'Fe' else ""
    print(f"{sym:<4} {props['name']:<12} {props['number']:>3} "
          f"{props['mass']:>6.1f} {props['density']:>8.2f} {props['melting']:>8}{marker}")

# Iron's electron configuration
shells = [2, 8, 14, 2]  # 1s², 2s²2p⁶, 3s²3p⁶3d⁶, 4s²
print(f"\\\nIron electron configuration: [Ar] 3d⁶ 4s²")
print("Electrons per shell:", shells, f"(total: {sum(shells)})")

# Why iron is special
print(f"\\\nIron is special because:")
print(f"  - Most stable nucleus (highest binding energy)")
print(f"  - 4th most abundant element in Earth's crust")
print(f"  - Earth's core is ~85% iron")
print(f"  - Essential for hemoglobin (carries oxygen in blood)")
print(f"  - Melting point: {elements['Fe']['melting']}°C (needs intense heat to smelt)")`,
      challenge: 'Calculate the number of iron atoms in a 1 kg iron bar. (Hint: Avogadro\'s number is 6.022 × 10²³, and iron\'s atomic mass is 55.845 g/mol.) How many atoms is that?',
      successHint: 'You explored iron\'s place in the periodic table and its fundamental properties. Understanding the element at the atomic level explains why the Lushai smiths found iron so useful — it is dense, strong, and has a high melting point that allows it to be shaped without melting.',
    },
    {
      title: 'Oxidation and reduction — the chemistry of smelting',
      concept: `Iron ore is not pure iron — it is **iron oxide** (rust). The most common ore is hematite (Fe₂O₃). To get iron, we must remove the oxygen. This is **reduction**:

\`Fe₂O₃ + 3CO → 2Fe + 3CO₂\`

The carbon monoxide (CO) comes from burning charcoal (carbon) in the furnace:
\`2C + O₂ → 2CO\`

**Oxidation** = losing electrons (or gaining oxygen)
**Reduction** = gaining electrons (or losing oxygen)

The mnemonic: **OIL RIG** — Oxidation Is Loss, Reduction Is Gain (of electrons).

In smelting:
- Iron is **reduced** (Fe³⁺ gains electrons → Fe⁰)
- Carbon is **oxidized** (C⁰ loses electrons → C⁴⁺ in CO₂)

📚 *We track oxidation states as integers. Chemical equations must balance: same number of each element on both sides.*`,
      analogy: 'Oxidation and reduction are like a tug of war over electrons. Iron oxide is iron that lost the tug of war — oxygen pulled its electrons away. Smelting brings carbon into the game. Carbon is even more willing to give up electrons than iron, so it pulls the oxygen away from iron, freeing the metal. The carbon "sacrifices" itself so iron can be free.',
      storyConnection: 'The Lushai iron smiths built clay furnaces fueled by charcoal, exactly replicating this chemistry. They did not know the equations, but they knew that charcoal and iron ore, heated together with forced air, produced metallic iron. Their empirical knowledge was the chemistry of redox in action.',
      checkQuestion: 'In the equation Fe₂O₃ + 3CO → 2Fe + 3CO₂, which species is oxidized and which is reduced?',
      checkAnswer: 'Iron is reduced: Fe³⁺ → Fe⁰ (gains 3 electrons per atom). Carbon is oxidized: C²⁺ (in CO) → C⁴⁺ (in CO₂) (loses 2 electrons per molecule). The CO is the reducing agent (it causes reduction of iron by being oxidized itself).',
      codeIntro: 'Balance chemical equations for iron smelting and calculate the amounts of materials needed.',
      code: `# Iron smelting chemistry calculations

# Molar masses (g/mol)
Fe_mass = 55.845
O_mass = 16.0
C_mass = 12.011
Fe2O3_mass = 2 * Fe_mass + 3 * O_mass  # 159.69 g/mol
CO_mass = C_mass + O_mass                # 28.01 g/mol
CO2_mass = C_mass + 2 * O_mass           # 44.01 g/mol

print("IRON SMELTING CHEMISTRY")
print("=" * 50)
print(f"\\\nReaction: Fe₂O₃ + 3CO → 2Fe + 3CO₂")
print(f"\\\nMolar masses:")
print(f"  Fe₂O₃ (hematite): {Fe2O3_mass:.2f} g/mol")
print(f"  CO (carbon monoxide): {CO_mass:.2f} g/mol")
print(f"  Fe (iron): {Fe_mass:.3f} g/mol")
print(f"  CO₂ (carbon dioxide): {CO2_mass:.2f} g/mol")

# For 1 kg of iron, how much ore and charcoal needed?
target_iron_kg = 1.0
target_iron_g = target_iron_kg * 1000

moles_Fe = target_iron_g / Fe_mass
moles_Fe2O3 = moles_Fe / 2  # 1 mol Fe₂O₃ → 2 mol Fe
moles_CO = moles_Fe2O3 * 3   # 3 mol CO per mol Fe₂O₃
moles_C = moles_CO            # 1 mol C → 1 mol CO

ore_needed_g = moles_Fe2O3 * Fe2O3_mass
charcoal_needed_g = moles_C * C_mass
co2_produced_g = moles_CO * CO2_mass

print(f"\\\nTo produce {target_iron_kg} kg of pure iron:")
print(f"  Ore needed (Fe₂O₃):    {ore_needed_g:.0f} g = {ore_needed_g/1000:.2f} kg")
print(f"  Charcoal needed (C):    {charcoal_needed_g:.0f} g = {charcoal_needed_g/1000:.2f} kg")
print(f"  CO₂ produced:           {co2_produced_g:.0f} g = {co2_produced_g/1000:.2f} kg")

# Yield calculation
theoretical_yield = 2 * Fe_mass / Fe2O3_mass * 100
print(f"\\\nTheoretical iron yield from ore: {theoretical_yield:.1f}%")
print(f"Real yield (with losses): ~{theoretical_yield * 0.7:.1f}%")

# Oxidation states
print(f"\\\nOxidation state changes:")
print(f"  Fe: +3 (in ore) → 0 (metal)  [REDUCED, gained 3e⁻]")
print(f"  C:  +2 (in CO)  → +4 (in CO₂) [OXIDIZED, lost 2e⁻]")
print(f"  O:  -2 → -2  [unchanged, spectator]")`,
      challenge: 'Calculate how much ore and charcoal a Lushai smith would need to make a 2 kg iron blade. If the furnace is only 40% efficient (60% of iron is lost as slag), how much extra ore is needed?',
      successHint: 'You learned to balance chemical equations and calculate stoichiometric quantities — the fundamental skill of chemistry. Every industrial process, from steel making to drug manufacturing, starts with this kind of calculation.',
    },
    {
      title: 'Temperature and energy — heating the furnace',
      concept: `Smelting requires extremely high temperatures. Iron\'s melting point is **1538°C** — far above what a wood fire can reach (~600°C). Charcoal with forced air (bellows) can reach 1200-1400°C.

The energy needed to heat iron ore involves:
1. **Sensible heat**: raising temperature (\`Q = m × c × ΔT\`)
2. **Latent heat**: phase change at melting point (\`Q = m × L\`)
3. **Reaction energy**: the redox reaction itself (exothermic or endothermic)

Where:
- c = specific heat capacity (0.449 J/g·°C for iron)
- L = latent heat of fusion (247 J/g for iron)
- ΔT = temperature change

📚 *We use the formula Q = mcΔT repeatedly for different temperature ranges. Python loops make these repetitive calculations efficient.*`,
      analogy: 'Heating iron is like climbing a staircase with a landing. The stairs (sensible heat) represent gradual temperature increase. The landing (latent heat) is the melting point — you keep adding energy but the temperature does not change until all the iron melts. Then you continue climbing (more sensible heat in the liquid phase).',
      storyConnection: 'The Lushai smiths used bellows — hand-pumped devices that forced air into the furnace. More air means more oxygen, which makes the charcoal burn hotter. The bellows were the critical technology that made the difference between a cooking fire and a smelting furnace.',
      checkQuestion: 'Why does temperature stop increasing during melting, even though you keep adding heat?',
      checkAnswer: 'During melting, the added energy breaks the bonds between iron atoms in the crystal lattice, converting solid to liquid. This bond-breaking requires energy (latent heat) but does not increase the kinetic energy of the atoms (which is what temperature measures). Once all bonds are broken (fully melted), temperature rises again.',
      codeIntro: 'Calculate the total energy needed to smelt iron ore, from room temperature to molten iron.',
      code: `# Energy calculations for iron smelting

# Properties of iron
c_solid = 0.449    # J/(g·°C) specific heat (solid)
c_liquid = 0.82    # J/(g·°C) specific heat (liquid)
L_fusion = 247     # J/g latent heat of fusion
T_melt = 1538      # °C melting point
T_start = 25       # °C room temperature
T_final = 1600     # °C (slightly above melting for pouring)

mass_g = 1000  # 1 kg of iron

# Step 1: Heat solid from room temp to melting point
Q1 = mass_g * c_solid * (T_melt - T_start)

# Step 2: Melt at constant temperature
Q2 = mass_g * L_fusion

# Step 3: Heat liquid to pouring temperature
Q3 = mass_g * c_liquid * (T_final - T_melt)

Q_total = Q1 + Q2 + Q3

print("ENERGY TO SMELT 1 KG OF IRON")
print("=" * 50)
print(f"\\\nStep 1: Heat solid ({T_start}°C → {T_melt}°C)")
print(f"  Q = {mass_g} g × {c_solid} J/(g·°C) × {T_melt - T_start}°C")
print(f"  Q = {Q1:,.0f} J = {Q1/1000:.1f} kJ")

print(f"\\\nStep 2: Melt at {T_melt}°C")
print(f"  Q = {mass_g} g × {L_fusion} J/g")
print(f"  Q = {Q2:,.0f} J = {Q2/1000:.1f} kJ")

print(f"\\\nStep 3: Heat liquid ({T_melt}°C → {T_final}°C)")
print(f"  Q = {mass_g} g × {c_liquid} J/(g·°C) × {T_final - T_melt}°C")
print(f"  Q = {Q3:,.0f} J = {Q3/1000:.1f} kJ")

print(f"\\\nTotal energy: {Q_total:,.0f} J = {Q_total/1000:.1f} kJ")
print(f"\\\nEnergy breakdown:")
print(f"  Heating solid:  {Q1/Q_total*100:5.1f}%  {'█' * int(Q1/Q_total*30)}")
print(f"  Melting:        {Q2/Q_total*100:5.1f}%  {'█' * int(Q2/Q_total*30)}")
print(f"  Heating liquid: {Q3/Q_total*100:5.1f}%  {'█' * int(Q3/Q_total*30)}")

# How much charcoal needed?
charcoal_energy = 29000  # J/g (energy content of charcoal)
furnace_efficiency = 0.15  # only 15% of heat goes into the iron
charcoal_needed = Q_total / (charcoal_energy * furnace_efficiency)

print(f"\\\nCharcoal needed (at {furnace_efficiency*100:.0f}% efficiency): {charcoal_needed:.0f} g = {charcoal_needed/1000:.1f} kg")
print(f"That is {charcoal_needed/mass_g:.1f} kg of charcoal per kg of iron!")`,
      challenge: 'Compare the energy needed to melt iron vs. copper (melting point 1085°C, specific heat 0.385 J/g·°C, latent heat 207 J/g). Why did the Bronze Age come before the Iron Age?',
      successHint: 'You calculated the thermodynamics of iron smelting. The enormous energy requirement explains why iron smelting was one of the most transformative technologies in human history — it required mastering high-temperature furnaces, which only became possible with charcoal and bellows.',
    },
    {
      title: 'Crystal structure — why iron is strong',
      concept: `Iron atoms arrange themselves in regular **crystal lattices**. The structure depends on temperature:

- **BCC (Body-Centered Cubic)** — α-iron, below 912°C: atoms at cube corners + 1 in center. Hard, magnetic.
- **FCC (Face-Centered Cubic)** — γ-iron, 912-1394°C: atoms at cube corners + face centers. Can dissolve more carbon.
- **BCC again** — δ-iron, 1394-1538°C: back to BCC before melting.

The BCC-to-FCC transition at 912°C is crucial for steelmaking. FCC iron can dissolve up to 2% carbon (forming **austenite**), while BCC can only hold 0.02%.

This means:
- Heat iron above 912°C → FCC → absorbs carbon
- Cool slowly → carbon has time to separate out (soft iron)
- Cool quickly (quench) → carbon trapped in BCC → hard steel!

📚 *We model crystal structures as 3D coordinates. Each atom position can be described by (x, y, z) coordinates within a unit cell.*`,
      analogy: 'BCC is like a box of oranges with one orange in the middle — compact but with gaps. FCC is like stacking oranges in the most efficient way possible — like a pyramid at a grocery store. The FCC arrangement has larger gaps between atoms, which is why it can fit carbon atoms inside (like hiding marbles between the oranges).',
      storyConnection: 'When the Lushai smiths heated iron and hammered it, they were manipulating crystal structures without knowing it. Heating above 912°C transformed BCC to FCC, allowing carbon from the charcoal to dissolve into the iron. Quenching locked the carbon in place, creating steel. This empirical knowledge was metallurgy.',
      checkQuestion: 'Why can FCC iron dissolve 100× more carbon than BCC iron?',
      checkAnswer: 'FCC has larger interstitial spaces (gaps between atoms). The octahedral holes in FCC are 0.052 nm radius, while in BCC they are only 0.036 nm. A carbon atom (0.077 nm radius) fits into FCC holes with some lattice distortion, but barely fits in BCC holes at all. This size difference limits carbon solubility.',
      codeIntro: 'Calculate properties of BCC and FCC iron crystal structures.',
      code: `import math

# Iron crystal structure calculations

# BCC (Body-Centered Cubic)
a_bcc = 0.2866  # lattice parameter in nm
atoms_per_bcc = 2  # 8 corners × 1/8 + 1 center = 2
Fe_mass_kg = 55.845e-3 / 6.022e23  # mass of one Fe atom in kg

# FCC (Face-Centered Cubic)
a_fcc = 0.3571  # lattice parameter in nm

atoms_per_fcc = 4  # 8 corners × 1/8 + 6 faces × 1/2 = 4

# Volume calculations
vol_bcc = (a_bcc * 1e-9)**3  # m³
vol_fcc = (a_fcc * 1e-9)**3  # m³

# Density
density_bcc = atoms_per_bcc * Fe_mass_kg / vol_bcc  # kg/m³
density_fcc = atoms_per_fcc * Fe_mass_kg / vol_fcc  # kg/m³

# Packing fraction
r_Fe = 0.126  # atomic radius in nm
pf_bcc = atoms_per_bcc * (4/3 * math.pi * (r_Fe)**3) / (a_bcc)**3
pf_fcc = atoms_per_fcc * (4/3 * math.pi * (r_Fe)**3) / (a_fcc)**3

print("IRON CRYSTAL STRUCTURES")
print("=" * 55)
print(f"{'Property':<30} {'BCC (α-iron)':>12} {'FCC (γ-iron)':>12}")
print("-" * 55)
print(f"{'Temperature range':<30} {'< 912°C':>12} {'912-1394°C':>12}")
print(f"{'Lattice parameter (nm)':<30} {a_bcc:>12.4f} {a_fcc:>12.4f}")
print(f"{'Atoms per unit cell':<30} {atoms_per_bcc:>12} {atoms_per_fcc:>12}")
print(f"{'Density (kg/m³)':<30} {density_bcc:>12.0f} {density_fcc:>12.0f}")
print(f"{'Packing fraction':<30} {pf_bcc:>12.3f} {pf_fcc:>12.3f}")
print(f"{'Max carbon solubility':<30} {'0.02%':>12} {'2.14%':>12}")
print(f"{'Magnetic?':<30} {'Yes':>12} {'No':>12}")

# Interstitial hole sizes
oct_bcc = 0.155 * a_bcc  # octahedral hole in BCC
oct_fcc = 0.414 * (a_fcc / (2 * math.sqrt(2))) * 2  # simplified

print(f"\\\nInterstitial spaces:")
print(f"  BCC octahedral hole radius: ~{oct_bcc:.3f} nm")
print(f"  FCC octahedral hole radius: ~{oct_fcc:.3f} nm")
print(f"  Carbon atom radius:          0.077 nm")
print(f"\\\n  FCC holes are larger → more room for carbon → steel!")

# Carbon atoms per unit cell at max solubility
c_per_fcc = 4 * 0.0214  # 2.14% of 4 Fe atoms
c_per_bcc = 2 * 0.0002  # 0.02% of 2 Fe atoms
print(f"\\\n  Carbon atoms per FCC cell at max: ~{c_per_fcc:.3f}")
print(f"  Carbon atoms per BCC cell at max: ~{c_per_bcc:.4f}")
print(f"  Ratio: {c_per_fcc/c_per_bcc:.0f}x more carbon in FCC!")`,
      challenge: 'If you could create an alloy with a lattice parameter 10% larger than FCC iron, how much more carbon could it potentially dissolve? (Hint: interstitial hole size scales with lattice parameter.)',
      successHint: 'You calculated crystal structure properties from first principles. The BCC-FCC transition is the key to understanding why iron can be made into steel — and why the Lushai smiths\' techniques of heating and quenching worked. Materials science is applied crystallography.',
    },
    {
      title: 'Quenching — trapping carbon to make steel',
      concept: `**Quenching** is rapid cooling — plunging hot iron into water or oil. The speed of cooling determines the final structure:

- **Slow cooling**: atoms have time to rearrange. Carbon separates out as **cementite** (Fe₃C). Result: soft, ductile **pearlite**.
- **Fast cooling (quenching)**: atoms freeze in place. Carbon trapped in distorted BCC forms **martensite** — extremely hard but brittle.
- **Medium cooling**: mixture of phases. **Bainite** — intermediate hardness and toughness.

The cooling rate determines everything:
- Water quench: ~300°C/second → martensite (hard, brittle)
- Oil quench: ~50°C/second → bainite (tough)
- Air cool: ~5°C/second → pearlite (soft)

**Tempering** after quenching (reheating to 200-600°C) reduces brittleness while keeping most of the hardness.

📚 *Exponential decay models cooling: \`T(t) = T_env + (T_0 - T_env) × e^(-kt)\`. The constant k depends on the cooling medium.*`,
      analogy: 'Quenching is like freeze-tag. When iron is hot (FCC), carbon atoms are "running around" freely in the lattice. Quenching is like yelling "FREEZE!" — everyone stops where they are. In martensite, the carbon atoms are caught in positions they would not normally occupy, creating internal stress that makes the material hard.',
      storyConnection: 'The Lushai smiths quenched their blades in water after heating. They discovered that quenched iron was harder than air-cooled iron — perfect for cutting tools and weapons. They also discovered that reheating (tempering) made the blade less likely to shatter. This was empirical materials science.',
      checkQuestion: 'Why is martensite hard but brittle, while pearlite is soft but ductile?',
      checkAnswer: 'Martensite has carbon atoms trapped in the wrong positions, distorting the crystal lattice. This distortion resists deformation (hardness) but also creates stress concentrations that propagate as cracks (brittleness). Pearlite has carbon neatly organized into cementite layers, leaving the iron free to deform without cracking.',
      codeIntro: 'Model the cooling curves for different quenching methods and predict the resulting phase.',
      code: `import math

# Cooling curve simulation for different quenching media

T_start = 900  # °C (austenitizing temperature)
T_env = {
    'Water (20°C)': 20,
    'Oil (50°C)': 50,
    'Air (25°C)': 25,
}

# Cooling rate constants (1/seconds)
k_values = {
    'Water (20°C)': 0.15,   # fast
    'Oil (50°C)': 0.03,     # medium
    'Air (25°C)': 0.005,    # slow
}

# Critical temperatures for phase transformation
T_martensite_start = 220  # below this → martensite
T_bainite_range = (250, 550)  # bainite forms in this range
T_pearlite_range = (550, 727)  # pearlite forms here

print("QUENCHING ANALYSIS — COOLING FROM 900°C")
print("=" * 60)

for medium in T_env:
    k = k_values[medium]
    Te = T_env[medium]

    print(f"\\\n--- {medium} ---")
    print(f"{'Time (s)':>8} {'Temp (°C)':>10} {'Phase Zone':<20}")
    print("-" * 42)

    # Track time in each temperature zone
    time_in_zone = {'austenite': 0, 'pearlite': 0, 'bainite': 0, 'martensite': 0}
    dt = 0.5  # time step

    for t_10 in range(0, 121, 5):  # 0 to 60 seconds
        t = t_10
        T = Te + (T_start - Te) * math.exp(-k * t)

        if T > 727:
            zone = "Austenite (γ)"
        elif T > 550:
            zone = "Pearlite zone"
        elif T > 250:
            zone = "Bainite zone"
        elif T > T_martensite_start:
            zone = "→ Martensite"
        else:
            zone = "Martensite (α')"

        if t <= 30 or t % 10 == 0:
            bar = "█" * int((T - Te) / (T_start - Te) * 25)
            print(f"{t:>8.0f} {T:>10.1f} {zone:<20} {bar}")

    # Final phase prediction
    T_at_10s = Te + (T_start - Te) * math.exp(-k * 10)
    cooling_rate = (T_start - T_at_10s) / 10  # °C/s in first 10s

    if cooling_rate > 100:
        result = "MARTENSITE (hard, brittle)"
    elif cooling_rate > 20:
        result = "BAINITE (tough, intermediate)"
    else:
        result = "PEARLITE (soft, ductile)"

    print(f"  Cooling rate (first 10s): {cooling_rate:.0f} °C/s")
    print(f"  Predicted phase: {result}")

print("\\\n\\\nSummary:")
print("  Water quench → Martensite → Hard blade (but may crack)")
print("  Oil quench   → Bainite    → Tough blade (good balance)")
print("  Air cool     → Pearlite   → Soft, workable iron")`,
      challenge: 'Add a "tempering" step: after water quenching, reheat to 300°C and hold for 1 hour, then air cool. How does this change the final properties? Research the tempering temperature ranges for different applications (springs, knives, swords).',
      successHint: 'You modeled the cooling curves that determine iron\'s final structure. This is the core of heat treatment — the process that transforms soft iron into hard steel. Every knife, sword, spring, and structural beam owes its properties to controlled cooling.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Metallurgy & Chemistry of Iron</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
