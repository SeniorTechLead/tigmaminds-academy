import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GreekFireLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Thermodynamics of combustion — enthalpy and Hess\'s law',
      concept: `**Enthalpy of combustion** (ΔH_comb) is the heat released when a substance burns completely in oxygen. It's always negative — combustion releases energy.

For a hydrocarbon fuel like naphtha (C₁₀H₂₂):

**C₁₀H₂₂ + 15.5 O₂ → 10 CO₂ + 11 H₂O    ΔH = −6,778 kJ/mol**

**Hess's law** says: the total enthalpy change for a reaction is the same regardless of the route taken. This lets us calculate ΔH for reactions we can't measure directly by combining reactions we CAN measure:

**ΔH_rxn = Σ ΔH_f(products) − Σ ΔH_f(reactants)**

Where ΔH_f is the standard enthalpy of formation — the energy needed to form one mole of a compound from its elements.

Greek Fire's terrifying power came from combining multiple exothermic reactions: hydrocarbon combustion PLUS quicklime hydration (CaO + H₂O → Ca(OH)₂, ΔH = −65 kJ/mol). The total heat release was far greater than any single fuel.

📚 *Hess's law is a consequence of energy conservation — the First Law of Thermodynamics. Energy is a state function: it depends only on where you start and end, not on the path between them.*`,
      analogy: 'Imagine hiking from a valley to a mountain peak. Whether you take the steep direct trail or the winding switchback path, the elevation gain is the same. Hess\'s law says the same thing about energy: the total energy change between reactants and products is the same no matter what intermediate steps you go through.',
      storyConnection: 'The Byzantine alchemists who developed Greek Fire around 672 CE discovered that mixing naphtha with quicklime, sulphur, and pine resin created something far more devastating than any single fuel. Hess\'s law explains why: each component added its own exothermic reaction, and the total heat release was the sum of all contributions — a multi-fuel incendiary that burned on water.',
      checkQuestion: 'If burning 1 mol of naphtha releases 6,778 kJ, and hydrating 1 mol of quicklime releases 65 kJ, what is the total heat release from a mixture containing 1 mol of each?',
      checkAnswer: 'ΔH_total = −6,778 + (−65) = −6,843 kJ. The quicklime adds only about 1% more energy, but its real contribution is different: it reacts WITH water, generating heat that sustains the fire even when doused. The enthalpy tells you how much heat; the kinetics tell you when and where.',
      codeIntro: 'Calculate combustion enthalpies for Greek Fire components using Hess\'s law and formation enthalpies.',
      code: `import numpy as np

# Standard enthalpies of formation (kJ/mol)
delta_hf = {
    "CO2":    -393.5,
    "H2O_l":  -285.8,
    "H2O_g":  -241.8,
    "CaO":    -635.1,
    "Ca(OH)2":-986.1,
    "SO2":    -296.8,
    "C10H22":  -300.9,   # decane (naphtha proxy)
    "C10H8":    78.5,    # naphthalene
    "S":         0.0,    # element in standard state
    "O2":        0.0,
    "C":         0.0,
}

def hess_combustion(fuel_hf, products_hf, stoich_fuel=1):
    """Apply Hess's law: ΔH_rxn = Σ ΔH_f(products) - Σ ΔH_f(reactants)"""
    sum_products = sum(products_hf)
    sum_reactants = fuel_hf  # O2 has ΔH_f = 0
    return sum_products - sum_reactants

# Greek Fire components
components = [
    {
        "name": "Naphtha (C10H22)",
        "fuel_hf": delta_hf["C10H22"],
        "products_hf": [10 * delta_hf["CO2"], 11 * delta_hf["H2O_l"]],
        "mass_kg": 0.142,  # 1 mol
    },
    {
        "name": "Sulphur (S)",
        "fuel_hf": delta_hf["S"],
        "products_hf": [delta_hf["SO2"]],
        "mass_kg": 0.032,
    },
    {
        "name": "Quicklime + water",
        "fuel_hf": delta_hf["CaO"] + delta_hf["H2O_l"],
        "products_hf": [delta_hf["Ca(OH)2"]],
        "mass_kg": 0.056,
    },
    {
        "name": "Pine resin (proxy C10H16O)",
        "fuel_hf": -285.0,  # estimated
        "products_hf": [10 * delta_hf["CO2"], 8 * delta_hf["H2O_l"]],
        "mass_kg": 0.152,
    },
]

print("=== Greek Fire Component Enthalpies (Hess's Law) ===")
print(f"{'Component':<26} {'ΔH (kJ/mol)':>12} {'kJ/kg':>10} {'kJ per 100g':>12}")
print("-" * 62)

total_heat_per_100g = 0
for c in components:
    dh = hess_combustion(c["fuel_hf"], c["products_hf"])
    kj_per_kg = dh / c["mass_kg"]
    kj_100g = kj_per_kg * 0.1
    total_heat_per_100g += kj_100g * 0.25  # assume 25% each
    print(f"{c['name']:<26} {dh:>10.1f} {kj_per_kg:>10.0f} {kj_100g:>10.0f}")

print(f"\\nEstimated mixture (equal parts): {total_heat_per_100g:.0f} kJ per 100g")

# Compare to modern fuels
print("\\n=== Comparison to Modern Fuels ===")
modern = [
    ("Gasoline", 46000), ("Diesel", 45500), ("TNT", 4184),
    ("Thermite", 3985), ("Napalm", 39000),
]
for name, kj_kg in modern:
    print(f"  {name:<16} {kj_kg:>8,} kJ/kg")
print(f"  {'Greek Fire est.':<16} {int(total_heat_per_100g*10):>8,} kJ/kg")
print("\\nGreek Fire was not the most energetic — its power was the")
print("combination of water resistance, adhesion, and sustained burn.")`,
      challenge: 'Calculate what happens if you double the quicklime fraction. The total energy barely changes, but think about what happens when an enemy throws water on it: CaO + H2O is exothermic. More quicklime means more heat generated BY the water itself. This is why Greek Fire "burned on water."',
      successHint: 'Hess\'s law and formation enthalpies are how chemists predict energy changes for any reaction without running it. This is the foundation of fuel chemistry, rocket propellant design, and industrial process engineering.',
    },
    {
      title: 'Heat transfer modes — conduction, convection, and radiation rates',
      concept: `Heat moves in three ways, each with its own equation:

**Conduction** (through solids): Q = k × A × ΔT / d
Heat flows through material — the rate depends on thermal conductivity (k), area (A), temperature difference (ΔT), and thickness (d).

**Convection** (through moving fluids): Q = h × A × ΔT
Heat transfers between a surface and a moving fluid — the rate depends on the convection coefficient (h), which itself depends on fluid velocity and properties.

**Radiation** (through empty space): Q = ε × σ × A × T⁴
Every hot object radiates energy proportional to the FOURTH power of its absolute temperature. The Stefan-Boltzmann constant σ = 5.67 × 10⁻⁸ W/m²·K⁴.

A Greek Fire attack involved all three simultaneously: the burning mixture conducted heat into the ship's hull, convection carried hot gases upward to the sails, and radiation heated everything within line of sight.

📚 *The T⁴ dependence of radiation is why doubling the temperature increases radiant heat output 16-fold. A flame at 1,200°C radiates enormously more than a surface at 600°C.*`,
      analogy: 'Hold your hand near a campfire. The heat you feel on your face is radiation (it travels through air without warming it). The rising hot air above the fire is convection (hot air moves upward). If you touch the log, the heat entering your finger is conduction (through solid contact). Three mechanisms, one fire.',
      storyConnection: 'Byzantine naval commanders understood these three modes instinctively. They aimed siphons at the waterline (conduction into the hull), let rising heat ignite sails (convection), and knew that ships nearby would catch fire from radiant heat alone — the "heat shadow" of a burning vessel extended 20-30 metres.',
      checkQuestion: 'A Greek Fire flame at 1,200°C (1,473 K) radiates towards a ship 10 m away. If the flame cools to 800°C (1,073 K), by what factor does the radiant heat decrease?',
      checkAnswer: 'Radiation goes as T⁴. Ratio = (1073/1473)⁴ = (0.728)⁴ = 0.281. The radiant heat drops to just 28% — a 72% reduction from a 33% drop in temperature. This T⁴ dependence is why high-temperature fires are so much more dangerous than low-temperature ones.',
      codeIntro: 'Calculate heat transfer rates from Greek Fire through all three modes and compare their relative contributions.',
      code: `import numpy as np

sigma = 5.67e-8  # Stefan-Boltzmann constant (W/m²·K⁴)

# Greek Fire scenario: burning patch on a ship hull
fire_temp_C = 1100       # flame temperature
ambient_temp_C = 25       # air / water temperature
hull_thickness_m = 0.05   # 50mm oak hull
burning_area_m2 = 2.0     # 2 m² patch

fire_T = fire_temp_C + 273.15   # Kelvin
ambient_T = ambient_temp_C + 273.15

# 1. CONDUCTION through hull
k_oak = 0.17  # W/(m·K) — oak thermal conductivity
Q_cond = k_oak * burning_area_m2 * (fire_temp_C - ambient_temp_C) / hull_thickness_m
print("=== Heat Transfer from Greek Fire ===")
print(f"Fire: {fire_temp_C}°C | Area: {burning_area_m2} m² | Hull: {hull_thickness_m*1000:.0f}mm oak")
print(f"\\n1. CONDUCTION through hull:")
print(f"   Q = k × A × ΔT / d = {k_oak} × {burning_area_m2} × {fire_temp_C - ambient_temp_C} / {hull_thickness_m}")
print(f"   Q = {Q_cond:,.0f} W ({Q_cond/1000:.1f} kW)")

# 2. CONVECTION to air above
h_conv = 25  # W/(m²·K) — natural convection over fire
Q_conv = h_conv * burning_area_m2 * (fire_temp_C - ambient_temp_C)
print(f"\\n2. CONVECTION to air above:")
print(f"   Q = h × A × ΔT = {h_conv} × {burning_area_m2} × {fire_temp_C - ambient_temp_C}")
print(f"   Q = {Q_conv:,.0f} W ({Q_conv/1000:.1f} kW)")

# 3. RADIATION to surroundings
emissivity = 0.95  # soot-covered flame is nearly a blackbody
Q_rad = emissivity * sigma * burning_area_m2 * (fire_T**4 - ambient_T**4)
print(f"\\n3. RADIATION to surroundings:")
print(f"   Q = ε × σ × A × (T_fire⁴ - T_amb⁴)")
print(f"   Q = {Q_rad:,.0f} W ({Q_rad/1000:.1f} kW)")

total = Q_cond + Q_conv + Q_rad
print(f"\\n=== Total Heat Output: {total:,.0f} W ({total/1000:.1f} kW) ===")
print(f"   Conduction: {Q_cond/total*100:.1f}%")
print(f"   Convection: {Q_conv/total*100:.1f}%")
print(f"   Radiation:  {Q_rad/total*100:.1f}%")

# How fast does the hull burn through?
print(f"\\n=== Hull Ignition Time ===")
oak_density = 600       # kg/m³
oak_ignition_C = 300    # °C
cp_oak = 2400           # J/(kg·K) specific heat
hull_mass = oak_density * burning_area_m2 * hull_thickness_m
energy_to_ignition = hull_mass * cp_oak * (oak_ignition_C - ambient_temp_C)
time_s = energy_to_ignition / Q_cond
print(f"Hull mass under fire: {hull_mass:.1f} kg")
print(f"Energy to reach ignition: {energy_to_ignition/1000:.0f} kJ")
print(f"Time to ignition (conduction only): {time_s:.0f} seconds ({time_s/60:.1f} minutes)")`,
      challenge: 'At what fire temperature does radiation become dominant over convection? Plot the ratio Q_rad/Q_conv for temperatures from 300°C to 1,500°C. The crossover point explains why low-temperature fires (wood) are mainly convective, but high-temperature fires (metal, thermite) are dominated by radiation.',
      successHint: 'You just quantified the three fundamental heat transfer modes — the same analysis used to design furnaces, insulate buildings, cool electronics, and fight fires. Understanding which mode dominates in a given scenario is one of the most useful skills in thermal engineering.',
    },
    {
      title: 'Fluid jet dynamics — Bernoulli\'s equation and projectile motion',
      concept: `The Byzantines delivered Greek Fire through a **siphon** — a bronze pump that projected burning liquid as a jet. The physics of this jet involves two stages:

**Stage 1: Nozzle exit velocity** — governed by **Bernoulli's equation**:
**v = √(2ΔP / ρ)**
Where ΔP is the pump pressure and ρ is the fluid density. Higher pressure = faster jet.

**Stage 2: Projectile trajectory** — once the jet leaves the nozzle, it follows a parabolic arc under gravity:
**x(t) = v₀ cos(θ) × t**
**y(t) = v₀ sin(θ) × t − ½g t²**

The **range** (horizontal distance) is maximised at θ = 45°:
**R = v₀² sin(2θ) / g**

But the Byzantines didn't always aim for maximum range — they aimed for maximum impact. A flatter trajectory (lower angle) arrived faster and was harder to dodge, even though it didn't travel as far.

📚 *Bernoulli's equation is an energy conservation statement for fluids: pressure energy + kinetic energy + potential energy = constant along a streamline.*`,
      analogy: 'A garden hose with a nozzle works on the same principle. Squeeze the nozzle (increase pressure) and the water shoots further. Angle it up at 45° for maximum distance, or keep it flat for a direct hit nearby. The Byzantine siphon was a military-grade garden hose firing liquid fire.',
      storyConnection: 'The siphon operator on a Byzantine dromon warship had to judge distance, wind, and wave motion to land Greek Fire on an enemy deck. Too high an angle and the jet broke into droplets (less effective). Too low and it fell short into the sea. The optimal angle depended on the pump pressure and the distance to the target — exactly what Bernoulli and projectile physics predict.',
      checkQuestion: 'A siphon generates 200 kPa of pressure. Greek Fire has a density of 900 kg/m³. What is the exit velocity?',
      checkAnswer: 'v = √(2 × 200,000 / 900) = √(444.4) = 21.1 m/s. At 45°, range = (21.1)² × sin(90°) / 9.81 = 445.2 / 9.81 = 45.4 m. That\'s roughly 45 metres — consistent with historical accounts of Greek Fire ranges of 25-50 metres.',
      codeIntro: 'Model the siphon jet from pump pressure through nozzle exit to projectile trajectory.',
      code: `import numpy as np

g = 9.81  # m/s²

def exit_velocity(pressure_kpa, density):
    """Bernoulli: v = sqrt(2 * delta_P / rho)"""
    return np.sqrt(2 * pressure_kpa * 1000 / density)

def projectile_range(v0, angle_deg):
    """Horizontal range of a projectile (flat ground)."""
    theta = np.radians(angle_deg)
    return v0**2 * np.sin(2 * theta) / g

def trajectory(v0, angle_deg, dt=0.01):
    """Return x, y arrays for the trajectory."""
    theta = np.radians(angle_deg)
    vx = v0 * np.cos(theta)
    vy = v0 * np.sin(theta)
    xs, ys = [0], [2.0]  # starts 2m above waterline (deck height)
    t = 0
    while ys[-1] >= 0:
        t += dt
        xs.append(vx * t)
        ys.append(2.0 + vy * t - 0.5 * g * t**2)
    return np.array(xs), np.array(ys)

# Siphon parameters
fire_density = 900       # kg/m³ (lighter than water — it floats!)
pump_pressures = [100, 200, 300, 400]  # kPa

print("=== Siphon Exit Velocity vs Pump Pressure ===")
print(f"{'Pressure (kPa)':<16} {'Exit v (m/s)':>14} {'Range at 45° (m)':>18}")
print("-" * 50)
for p in pump_pressures:
    v = exit_velocity(p, fire_density)
    r = projectile_range(v, 45)
    print(f"{p:<16} {v:>12.1f} {r:>16.1f}")

# Angle optimisation
print("\\n=== Range vs Launch Angle (200 kPa pump) ===")
v0 = exit_velocity(200, fire_density)
print(f"Exit velocity: {v0:.1f} m/s")
print(f"{'Angle (°)':<12} {'Range (m)':>10} {'Flight time (s)':>16} {'Impact v (m/s)':>16}")
print("-" * 56)

for angle in [15, 20, 25, 30, 35, 40, 45, 50, 60]:
    r = projectile_range(v0, angle)
    theta = np.radians(angle)
    t_flight = 2 * v0 * np.sin(theta) / g + 2 * 0.2  # approx with deck height
    v_impact = np.sqrt((v0 * np.cos(theta))**2 + (v0 * np.sin(theta) - g * t_flight)**2)
    print(f"{angle:<12} {r:>8.1f} {t_flight:>14.2f} {v_impact:>14.1f}")

# Nozzle diameter effect
print("\\n=== Nozzle Diameter vs Flow Rate ===")
print(f"{'Diameter (mm)':<16} {'Area (cm²)':>12} {'Flow (L/s)':>12} {'Burn time (s)*':>16}")
print("-" * 58)
for d_mm in [10, 15, 20, 30, 40, 50]:
    area = np.pi * (d_mm/2000)**2
    flow_m3s = area * v0
    flow_Ls = flow_m3s * 1000
    tank_L = 50  # 50 litre tank
    burn_time = tank_L / flow_Ls
    print(f"{d_mm:<16} {area*1e4:>10.2f} {flow_Ls:>10.2f} {burn_time:>14.1f}")
print("* Assuming 50-litre tank capacity")`,
      challenge: 'Add wind resistance (drag). A real liquid jet experiences air drag that shortens the range by 20-40%. Model drag as a force proportional to v²: F_drag = 0.5 × C_d × ρ_air × A × v². How much shorter is the range with drag vs the ideal projectile calculation?',
      successHint: 'Bernoulli\'s equation and projectile motion combine to model any pressurised fluid system: fire hoses, water jets, fuel injectors, even blood flow. You just applied the same physics that aerospace engineers use for rocket nozzle design.',
    },
    {
      title: 'Chemical kinetics — the Arrhenius equation and burn rate',
      concept: `How fast a fuel burns depends on temperature — and the relationship is **exponential**, not linear. The **Arrhenius equation** describes this:

**k = A × e^(−Eₐ / RT)**

Where k is the reaction rate constant, A is the pre-exponential factor (frequency of molecular collisions), Eₐ is the activation energy (the energy barrier the reaction must overcome), R is the gas constant (8.314 J/mol·K), and T is temperature in Kelvin.

The key insight: a small increase in temperature causes a LARGE increase in reaction rate. Raising the temperature by 10°C roughly DOUBLES most reaction rates. This is why Greek Fire, once ignited, was nearly impossible to extinguish — the heat from the fire accelerated the combustion, which produced more heat, which accelerated the combustion further. This positive feedback loop is called **thermal runaway**.

📚 *Activation energy Eₐ is the minimum energy needed to start a reaction. A match provides Eₐ to wood — once the reaction starts, the heat it produces provides Eₐ for adjacent wood, and the fire sustains itself.*`,
      analogy: 'Imagine pushing a boulder over a hill. The hill is the activation energy — you need enough push to get over the top. Once over, the boulder rolls downhill on its own (the reaction releases energy). A higher temperature is like giving the boulder a running start — more molecules have enough energy to clear the hill, so more reactions happen per second.',
      storyConnection: 'The quicklime in Greek Fire served a critical kinetic role: when water was thrown on the fire, CaO + H₂O released heat, locally raising the temperature and increasing the Arrhenius rate constant for the surrounding naphtha combustion. The enemy\'s attempt to extinguish the fire literally accelerated it — a diabolical exploitation of chemical kinetics.',
      checkQuestion: 'If Eₐ = 80 kJ/mol, by what factor does the rate increase when temperature rises from 800°C (1073 K) to 900°C (1173 K)?',
      checkAnswer: 'k₂/k₁ = exp(−Eₐ/R × (1/T₂ − 1/T₁)) = exp(−80000/8.314 × (1/1173 − 1/1073)) = exp(−9624 × (−0.0000795)) = exp(0.765) = 2.15. A 100°C increase more than doubles the reaction rate. At high temperatures, every degree matters enormously.',
      codeIntro: 'Model burn rates using the Arrhenius equation and simulate the thermal runaway feedback loop.',
      code: `import numpy as np

R = 8.314  # gas constant J/(mol·K)

def arrhenius_rate(A, Ea, T_kelvin):
    """Arrhenius equation: k = A * exp(-Ea / (R*T))"""
    return A * np.exp(-Ea / (R * T_kelvin))

# Greek Fire component kinetics
fuels = [
    {"name": "Naphtha",     "A": 1e10, "Ea": 75000,  "ignition_C": 260},
    {"name": "Pine resin",  "A": 5e9,  "Ea": 85000,  "ignition_C": 300},
    {"name": "Sulphur",     "A": 2e8,  "Ea": 50000,  "ignition_C": 232},
    {"name": "Quicklime+H2O","A": 1e7, "Ea": 30000,  "ignition_C": 0},  # exothermic hydration
]

print("=== Arrhenius Burn Rate vs Temperature ===")
temps_C = [200, 400, 600, 800, 1000, 1200]
header = f"{'Fuel':<18}" + "".join(f"{t:>8}°C" for t in temps_C)
print(header)
print("-" * (18 + 9 * len(temps_C)))

for f in fuels:
    rates = []
    for t in temps_C:
        T_K = t + 273.15
        k = arrhenius_rate(f["A"], f["Ea"], T_K)
        rates.append(k)
    # Normalise to rate at 800°C for readability
    ref = arrhenius_rate(f["A"], f["Ea"], 800 + 273.15)
    row = f"{f['name']:<18}" + "".join(f"{r/ref:>8.2f}x" for r in rates)
    print(row)
print("(Rates normalised to 1.00× at 800°C)")

# Thermal runaway simulation
print("\\n=== Thermal Runaway Simulation ===")
print("Greek Fire ignited at 300°C, tracking temperature over time\\n")

T = 300.0 + 273.15  # start at ignition temperature (K)
dt = 0.1            # time step (seconds)
mass_fuel = 5.0     # kg of Greek Fire mixture
Cp_mix = 1800       # J/(kg·K) specific heat
heat_loss_coeff = 50 # W/K heat loss to surroundings
T_ambient = 298.15  # K

Ea_mix = 70000      # effective activation energy for mixture
A_mix = 5e9         # effective pre-exponential
heat_per_mol = 4000 # kJ/mol effective heat release

print(f"{'Time (s)':<10} {'Temp (°C)':>10} {'Rate (rel)':>12} {'Status':>12}")
print("-" * 46)

for step in range(200):
    t = step * dt
    T_C = T - 273.15
    rate = arrhenius_rate(A_mix, Ea_mix, T)
    rate_norm = rate / arrhenius_rate(A_mix, Ea_mix, 573.15)

    # Heat balance: heat generated - heat lost
    Q_gen = rate * heat_per_mol * 0.001  # simplified
    Q_loss = heat_loss_coeff * (T - T_ambient)
    dT = (Q_gen - Q_loss) / (mass_fuel * Cp_mix) * 1000

    T += dT * dt

    status = "igniting" if T_C < 500 else "spreading" if T_C < 900 else "RUNAWAY"

    if step % 20 == 0 or status == "RUNAWAY":
        print(f"{t:<10.1f} {T_C:>8.0f} {rate_norm:>10.1f}× {status:>12}")
    if T_C > 1300:
        print(f"\\nThermal runaway reached at t = {t:.1f} s")
        print(f"Peak temperature: {T_C:.0f}°C")
        print("At this point, throwing water only makes it worse (quicklime).")
        break`,
      challenge: 'Add a "water dousing" event at t = 5 seconds: reduce temperature by 200°C but add 65 kJ from quicklime hydration. Does the fire go out or recover? Find the critical temperature below which dousing succeeds and above which the quicklime feedback makes it worse.',
      successHint: 'The Arrhenius equation governs reaction rates across all of chemistry: combustion, corrosion, cooking, drug metabolism, battery degradation. Understanding thermal runaway is critical for battery safety, chemical plant design, and fire science.',
    },
    {
      title: 'Materials compatibility — bronze pump corrosion in Greek Fire service',
      concept: `The Byzantine siphon was made of **bronze** (copper-tin alloy) — one of the few metals that could survive contact with Greek Fire's corrosive ingredients. Understanding WHY requires **electrochemistry** and **corrosion science**.

Corrosion occurs when a metal loses electrons to its environment:
**M → M²⁺ + 2e⁻** (anodic reaction — metal dissolves)

The rate of corrosion depends on: (1) the metal's **electrode potential** (how easily it gives up electrons), (2) the **pH** of the environment (acid accelerates corrosion), (3) **temperature** (Arrhenius again — corrosion rates double per 10°C), and (4) the presence of **protective oxide films**.

Bronze survives because copper forms a stable oxide layer (patina) that protects the underlying metal — even in hot, acidic, sulphur-rich environments. Iron, by contrast, forms flaky rust that exposes fresh metal to continued attack.

📚 *Galvanic corrosion occurs when two different metals are in electrical contact in a corrosive environment. The more "active" metal corrodes preferentially, protecting the "noble" metal. This is why zinc-coated (galvanised) steel lasts longer — the zinc corrodes first.*`,
      analogy: 'Imagine two runners on a muddy track. One wears boots that shed mud easily (bronze — protective oxide layer). The other wears shoes that absorb mud and get heavier with each step (iron — rust that doesn\'t protect). Both face the same conditions, but one survives far longer because its "armour" works better.',
      storyConnection: 'The Byzantines guarded the siphon design as fiercely as the fire recipe itself. The choice of bronze was not accidental — early experiments with iron siphons likely failed as the hot, sulphurous mixture corroded them rapidly. Bronze was expensive (copper and tin had to be imported), but it was the only material that could withstand years of service pumping liquid fire.',
      checkQuestion: 'If iron corrodes at 0.5 mm/year in Greek Fire conditions and a siphon wall is 8 mm thick, how long before it fails? What if bronze corrodes at 0.02 mm/year?',
      checkAnswer: 'Iron: 8 / 0.5 = 16 years. Bronze: 8 / 0.02 = 400 years. The bronze siphon outlasts the iron one by 25×. Factor in that a corroding iron siphon weakens under pump pressure long before it\'s fully consumed, and the practical difference is even larger — iron might fail in 5-8 years under operational stress.',
      codeIntro: 'Model corrosion rates for candidate siphon metals in Greek Fire operating conditions.',
      code: `import numpy as np

def corrosion_rate(base_rate, pH, temp_C, has_oxide_film=True):
    """
    Model corrosion rate accounting for pH, temperature, and oxide film.
    Base rate in mm/year at pH 7, 25°C.
    """
    # pH effect: rate doubles for each pH unit below 7
    pH_factor = 2.0 ** max(0, 7 - pH)

    # Temperature effect: Arrhenius-like doubling per 25°C above 25
    temp_factor = 2.0 ** ((temp_C - 25) / 25)

    # Oxide film: reduces rate by 80-95%
    film_factor = 0.1 if has_oxide_film else 1.0

    return base_rate * pH_factor * temp_factor * film_factor

# Candidate siphon metals
metals = [
    {"name": "Cast iron",       "base_rate": 0.15, "film": False, "cost": 1.0},
    {"name": "Mild steel",      "base_rate": 0.12, "film": False, "cost": 1.2},
    {"name": "Bronze (Cu-Sn)",  "base_rate": 0.02, "film": True,  "cost": 5.0},
    {"name": "Brass (Cu-Zn)",   "base_rate": 0.04, "film": True,  "cost": 3.5},
    {"name": "Copper (pure)",   "base_rate": 0.03, "film": True,  "cost": 4.0},
    {"name": "Lead",            "base_rate": 0.01, "film": True,  "cost": 2.0},
]

# Operating conditions for Greek Fire siphon
conditions = [
    ("Storage (cold)", 7.0, 25),
    ("Pumping (warm)", 4.0, 80),
    ("Firing (hot)",   3.0, 200),
    ("Residue (acidic)", 2.0, 60),
]

print("=== Corrosion Rates in Greek Fire Service (mm/year) ===")
header = f"{'Metal':<20}" + "".join(f"{c[0]:>16}" for c in conditions)
print(header)
print("-" * (20 + 17 * len(conditions)))

for m in metals:
    row = f"{m['name']:<20}"
    for _, pH, temp in conditions:
        rate = corrosion_rate(m["base_rate"], pH, temp, m["film"])
        row += f"{rate:>14.3f}mm"
    print(row)

# Siphon lifespan analysis
print("\\n=== Siphon Lifespan (8mm wall thickness) ===")
wall_mm = 8.0
# Assume 10% time at each condition, 70% idle, 10% each active
weights = [0.70, 0.10, 0.10, 0.10]

for m in metals:
    effective_rate = sum(
        w * corrosion_rate(m["base_rate"], pH, temp, m["film"])
        for w, (_, pH, temp) in zip(weights, conditions)
    )
    lifespan = wall_mm / effective_rate if effective_rate > 0 else float('inf')
    cost_value = m["cost"] * 1000 / lifespan  # cost per year of service
    print(f"{m['name']:<20} Rate: {effective_rate:>6.3f} mm/yr  "
          f"Life: {lifespan:>6.0f} yr  Cost/yr: {cost_value:>5.1f}")

print("\\nLead corrodes slowest but is too soft for a pressure pump.")
print("Bronze wins: excellent corrosion resistance + mechanical strength.")`,
      challenge: 'The Byzantines could have used lead-lined bronze (lead interior for corrosion resistance, bronze exterior for strength). Model a composite siphon: lead lining corrodes first (2mm), then bronze takes over (6mm). What is the total lifespan? Is the added complexity worth it?',
      successHint: 'Corrosion science determines material selection for every engineering system that contacts fluids: pipelines, chemical reactors, marine vessels, medical implants. The combination of electrochemistry and Arrhenius kinetics you applied here is the foundation of industrial materials engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Combustion physics, heat transfer, and fluid dynamics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into thermodynamics, heat transfer, siphon fluid dynamics, Arrhenius kinetics, and materials corrosion.
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
