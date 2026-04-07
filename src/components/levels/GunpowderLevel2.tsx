import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GunpowderLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Thermochemistry — enthalpy of formation and Hess\'s law for gunpowder',
      concept: `Every chemical bond stores energy. When gunpowder reacts, bonds in the reactants break (absorbing energy) and new bonds form in the products (releasing energy). The **net** energy change is the **enthalpy of reaction** (ΔH_rxn).

**Hess's law** says: the total enthalpy change for a reaction is the same regardless of the path — you can calculate it by summing the **standard enthalpies of formation** (ΔH_f°) of products minus reactants:

**ΔH_rxn = Σ ΔH_f°(products) − Σ ΔH_f°(reactants)**

For gunpowder: 2KNO₃ + 3C + S → K₂S + 3CO₂ + N₂

Each product has a known ΔH_f° (the energy released or absorbed when forming 1 mole from its elements). By summing these, we get the total energy released per gram of gunpowder — the number that determines how powerful it is.

📚 *Enthalpy of formation (ΔH_f°) is defined as the energy change when 1 mole of a compound forms from its elements in their standard states. Elements in standard state (C graphite, S solid, N₂ gas) have ΔH_f° = 0 by definition.*`,
      analogy: 'Imagine climbing a mountain. Whether you take the steep trail or the winding switchback, the total height change is the same. Hess\'s law is the same idea for energy: whether the reaction happens in one step or many intermediate steps, the total energy released is identical. The "height" is the enthalpy — the path doesn\'t matter, only the start and end.',
      storyConnection: 'Chinese alchemists didn\'t know thermochemistry, but they discovered empirically that the 75:15:10 ratio of saltpetre:charcoal:sulphur produced the most violent reaction. This ratio turns out to be close to the stoichiometric optimum — the mix that maximises energy release per gram. Hess\'s law explains why.',
      checkQuestion: 'If ΔH_f°(CO₂) = -393.5 kJ/mol, ΔH_f°(K₂S) = -380.7 kJ/mol, ΔH_f°(KNO₃) = -494.6 kJ/mol, and elements have ΔH_f° = 0, what is ΔH_rxn for 2KNO₃ + 3C + S → K₂S + 3CO₂ + N₂?',
      checkAnswer: 'ΔH_rxn = [(-380.7) + 3(-393.5) + 0] − [2(-494.6) + 0 + 0] = [-380.7 − 1180.5] − [−989.2] = −1561.2 + 989.2 = −572.0 kJ. The negative sign means energy is RELEASED — the reaction is exothermic, which is why gunpowder explodes.',
      codeIntro: 'Calculate the enthalpy of reaction for gunpowder using Hess\'s law and compare energy densities of different propellants.',
      code: `import numpy as np

# Standard enthalpies of formation (kJ/mol)
dHf = {
    "KNO3": -494.6,
    "C":     0.0,       # element in standard state
    "S":     0.0,       # element in standard state
    "K2S":  -380.7,
    "CO2":  -393.5,
    "N2":    0.0,       # element in standard state
    "H2O":  -285.8,
    "Fe2O3":-824.2,
    "Al2O3":-1675.7,
}

# Gunpowder: 2KNO3 + 3C + S -> K2S + 3CO2 + N2
products_H = 1 * dHf["K2S"] + 3 * dHf["CO2"] + 1 * dHf["N2"]
reactants_H = 2 * dHf["KNO3"] + 3 * dHf["C"] + 1 * dHf["S"]
dH_rxn = products_H - reactants_H

print("=== Hess's Law: Gunpowder Enthalpy ===")
print(f"Products:  {products_H:.1f} kJ")
print(f"Reactants: {reactants_H:.1f} kJ")
print(f"ΔH_rxn  = {dH_rxn:.1f} kJ (per 2 mol KNO₃)")
print(f"{'Exothermic' if dH_rxn < 0 else 'Endothermic'} reaction\\n")

# Energy per gram of mixture
molar_mass_mix = 2*101.1 + 3*12.0 + 32.1  # g per formula unit
energy_per_gram = abs(dH_rxn) / molar_mass_mix * 1000  # J/g

print("=== Energy Density Comparison ===")
propellants = [
    ("Black powder (gunpowder)", energy_per_gram),
    ("TNT", 4184),
    ("Nitroglycerin", 6700),
    ("Smokeless powder", 5000),
    ("Thermite (Al + Fe₂O₃)", 3960),
    ("Gasoline (with air)", 2900),
]

print(f"{'Propellant':<30} {'Energy (J/g)':>12} {'Relative':>10}")
print("-" * 54)
for name, e in propellants:
    print(f"{name:<30} {e:>10.0f} {e/energy_per_gram:>9.2f}×")

print(f"\\nGunpowder releases ~{energy_per_gram:.0f} J/g")
print("Modern explosives release 3-5× more energy per gram.")
print("Gunpowder is a LOW explosive — it deflagrates (burns fast)")
print("rather than detonates (supersonic shock wave).")`,
      challenge: 'Calculate the adiabatic flame temperature of gunpowder — the temperature the gas would reach if no heat escaped. Use: T = ΔH / (n_gas × Cp), where n_gas is moles of gas produced and Cp ~ 30 J/(mol·K) for CO₂ and N₂. Why is real flame temperature lower? (Heat loss to solid residue K₂S.)',
      successHint: 'Hess\'s law is a direct consequence of conservation of energy — one of the most fundamental laws in physics. You used it to calculate an explosion\'s energy from a table of formation enthalpies. The same technique is used to design rocket fuels, assess bomb yields, and engineer industrial chemical processes.',
    },
    {
      title: 'Real gas corrections — why the ideal gas law fails at high pressure',
      concept: `The ideal gas law (PV = nRT) assumes gas molecules are point particles with no volume and no intermolecular forces. At low pressures, this works well. But inside an exploding gunpowder charge, pressures reach **200-300 MPa** — at these pressures, the ideal gas law gives errors of 30% or more.

The **van der Waals equation** corrects for two effects:

**(P + a·n²/V²)(V − nb) = nRT**

- The **a** term corrects for attractive forces between molecules (they pull each other together, reducing pressure below ideal)
- The **b** term corrects for molecular volume (at high pressure, the molecules themselves take up significant space, reducing available volume)

At high pressures, the **b** correction dominates: the actual pressure is HIGHER than ideal because the gas molecules are packed so tightly they can't compress further. This matters enormously for calculating the force a gunpowder charge exerts on a projectile.

📚 *The compressibility factor Z = PV/(nRT) measures deviation from ideal behaviour. Z = 1 means ideal. Z > 1 means repulsive forces dominate (high pressure). Z < 1 means attractive forces dominate (moderate pressure).*`,
      analogy: 'Imagine packing people into a room. If only 5 people are in a large room (low pressure), you can model them as points — they don\'t interact much. But pack 200 people in (high pressure) and suddenly their physical size matters (they can\'t overlap) and they push each other away. The van der Waals equation accounts for both the "size" and the "pushing."',
      storyConnection: 'When Chinese engineers designed early cannons, they had to estimate the pressure inside the barrel. Too little powder — the ball barely moves. Too much — the barrel bursts. They adjusted by trial and error. The van der Waals equation explains why: the gas pressure in the barrel is significantly higher than ideal gas calculations predict, because the combustion gases are extremely compressed.',
      checkQuestion: 'At 300 MPa and 2500 K, would you expect Z to be greater or less than 1 for CO₂?',
      checkAnswer: 'Z > 1. At 300 MPa, the repulsive (volume exclusion) effect dominates — the CO₂ molecules are packed so tightly that their finite size prevents further compression. The actual pressure is higher than the ideal gas law predicts. At more moderate pressures (~5 MPa), Z < 1 because attractive forces pull molecules together.',
      codeIntro: 'Compare ideal gas predictions with van der Waals corrections at gunpowder combustion pressures.',
      code: `import numpy as np

R = 8.314  # J/(mol·K)

# Van der Waals constants for gunpowder combustion gases
# (weighted average for CO2/N2 mixture)
vdw = {
    "CO2": {"a": 0.3658, "b": 4.286e-5},   # Pa·m⁶/mol², m³/mol
    "N2":  {"a": 0.1370, "b": 3.864e-5},
}

# Weighted average (3 mol CO2 + 1 mol N2 from gunpowder reaction)
a_mix = (3 * vdw["CO2"]["a"] + 1 * vdw["N2"]["a"]) / 4
b_mix = (3 * vdw["CO2"]["b"] + 1 * vdw["N2"]["b"]) / 4

def ideal_pressure(n, V, T):
    return n * R * T / V

def vdw_pressure(n, V, T, a, b):
    return n * R * T / (V - n * b) - a * (n / V)**2

# Simulate pressure in a cannon chamber
chamber_volume_L = np.array([0.5, 1.0, 2.0, 5.0, 10.0, 20.0])
chamber_volume_m3 = chamber_volume_L * 1e-3
n_gas = 4.0    # moles of gas from one formula unit of gunpowder
T = 2500       # K (flame temperature)

print("=== Ideal vs Van der Waals Pressure ===")
print(f"Gas: {n_gas:.0f} mol at {T} K")
print(f"{'Volume (L)':>10} {'P_ideal (MPa)':>14} {'P_vdW (MPa)':>14} {'Z':>8} {'Error%':>8}")
print("-" * 56)

for V_L, V_m3 in zip(chamber_volume_L, chamber_volume_m3):
    P_ideal = ideal_pressure(n_gas, V_m3, T) / 1e6    # MPa
    P_vdw = vdw_pressure(n_gas, V_m3, T, a_mix, b_mix) / 1e6
    Z = P_vdw / P_ideal if P_ideal > 0 else 0
    error = (P_vdw - P_ideal) / P_ideal * 100
    print(f"{V_L:>8.1f} {P_ideal:>12.1f} {P_vdw:>12.1f} {Z:>8.3f} {error:>7.1f}%")

print()
print("At small volumes (high pressure), Z >> 1:")
print("  Molecular volume (b term) makes actual pressure HIGHER")
print("  than ideal. A cannon built for ideal-gas pressure would BURST.")
print()
print("At large volumes (low pressure), Z ~ 1:")
print("  Ideal gas law is accurate — corrections are negligible.")`,
      challenge: 'Plot the compressibility factor Z across a range of pressures from 0.1 to 500 MPa. At what pressure does Z cross 1.0? Below that pressure, attractive forces dominate (Z < 1); above it, repulsive forces dominate (Z > 1). This crossover is called the Boyle temperature.',
      successHint: 'Real gas corrections are critical in any high-pressure system: rocket engines, gas pipelines, deep-sea diving, and chemical reactors. The van der Waals equation is the simplest correction — industrial engineers use more sophisticated equations of state (Peng-Robinson, Redlich-Kwong), but the principle is the same.',
    },
    {
      title: 'Internal ballistics — the pressure-time curve in a gun barrel',
      concept: `When gunpowder ignites in a sealed barrel, the pressure rises, peaks, and falls as the gas expands behind the projectile. This **pressure-time curve** determines the projectile's acceleration and muzzle velocity.

The physics: as the gunpowder burns, it generates gas at a rate proportional to the burning surface area. The gas pushes the projectile forward, increasing the barrel volume behind it. Pressure = gas generated / volume available.

Initially, pressure rises rapidly because gas is generated fast while the projectile has barely moved. Pressure **peaks** when the burn rate equals the rate of volume increase. After the powder is consumed, pressure drops as the projectile continues forward into expanding volume.

**Key equation**: F = P × A (force = pressure × bore area). The projectile accelerates: a = F/m. Muzzle velocity = integral of acceleration over the barrel length.

📚 *Internal ballistics is the study of projectile behaviour INSIDE the barrel. External ballistics covers flight after leaving the barrel. Terminal ballistics covers impact on the target.*`,
      analogy: 'Imagine blowing up a balloon inside a tube with a ping-pong ball at one end. As you blow, pressure builds behind the ball. The ball accelerates and pops out. If you blow harder (more gas), the ball goes faster. If the tube is longer, the gas has more time to push — higher exit speed. This is exactly what happens in a gun barrel.',
      storyConnection: 'Early Chinese fire lances (12th century) were open-ended bamboo tubes — the gas escaped freely, producing a jet of flame but little projectile force. The leap to closed-barrel guns (13th century) was revolutionary: sealing one end forced ALL the gas pressure onto the projectile, dramatically increasing range and lethality.',
      checkQuestion: 'A 50g projectile in a barrel with bore area 500 mm² experiences a peak pressure of 200 MPa. What is its peak acceleration in g-forces?',
      checkAnswer: 'F = P × A = 200×10⁶ × 500×10⁻⁶ = 100,000 N. a = F/m = 100,000/0.05 = 2,000,000 m/s². In g-forces: 2,000,000/9.81 ≈ 204,000 g. Projectiles experience enormous accelerations — which is why they must be made of hard, dense materials that can withstand these forces.',
      codeIntro: 'Simulate the pressure-time curve inside a gun barrel and calculate muzzle velocity.',
      code: `import numpy as np

def simulate_barrel(charge_g, bore_mm, barrel_length_m, projectile_g,
                    burn_rate_mm_s=10, powder_density=1600):
    """
    Simulate internal ballistics: pressure, velocity, and
    acceleration as projectile travels down the barrel.
    """
    bore_area = np.pi * (bore_mm / 2000)**2  # m²
    proj_mass = projectile_g / 1000           # kg
    charge_kg = charge_g / 1000
    R_gas = 300      # J/(kg·K) effective gas constant for products
    T_flame = 2500   # K

    # Discretise time
    dt = 1e-6  # 1 microsecond steps
    max_steps = 200000

    pos = 0.0          # projectile position (m from breech)
    vel = 0.0          # projectile velocity (m/s)
    gas_mass = 0.0     # mass of gas generated so far (kg)
    powder_left = charge_kg
    time_data, pressure_data, velocity_data, pos_data = [], [], [], []

    for step in range(max_steps):
        t = step * dt
        chamber_vol = bore_area * max(pos, 0.001)  # min 1mm to avoid div/0

        # Burn rate: mass converted per second
        if powder_left > 0:
            burn_mass = min(burn_rate_mm_s * powder_density * bore_area * dt,
                           powder_left)
            gas_mass += burn_mass
            powder_left -= burn_mass

        # Pressure from ideal gas (simplified)
        P = gas_mass * R_gas * T_flame / chamber_vol if chamber_vol > 0 else 0

        # Force and acceleration
        F = P * bore_area
        acc = F / proj_mass
        vel += acc * dt
        pos += vel * dt

        # Record data every 100 steps
        if step % 100 == 0:
            time_data.append(t * 1000)  # ms
            pressure_data.append(P / 1e6)  # MPa
            velocity_data.append(vel)
            pos_data.append(pos * 1000)  # mm

        # Stop when projectile exits barrel
        if pos >= barrel_length_m:
            break

    return (np.array(time_data), np.array(pressure_data),
            np.array(velocity_data), np.array(pos_data), vel)

# Simulate a medieval cannon
configs = [
    ("Fire lance (bamboo)",    10, 25, 5,   0.3),
    ("Early handgonne",        30, 20, 30,  0.3),
    ("Ming bronze cannon",     200, 80, 2000, 1.5),
    ("Large siege bombard",    2000, 200, 50000, 2.5),
]

print("=== Internal Ballistics Comparison ===")
print(f"{'Weapon':<24} {'Charge':>8} {'Bore':>6} {'Proj':>8} {'Muzzle V':>10} {'Energy':>10}")
print(f"{'':24} {'(g)':>8} {'(mm)':>6} {'(g)':>8} {'(m/s)':>10} {'(J)':>10}")
print("-" * 68)

for name, charge, bore, proj, barrel_len in configs:
    _, _, _, _, muzzle_v = simulate_barrel(charge, bore, barrel_len, proj)
    energy = 0.5 * (proj / 1000) * muzzle_v**2
    print(f"{name:<24} {charge:>6} {bore:>6} {proj:>6} {muzzle_v:>8.0f} {energy:>10.0f}")

print()
print("The jump from fire lance to cannon increased muzzle energy")
print("by orders of magnitude — the sealed barrel concentrates ALL")
print("the gas pressure onto the projectile instead of venting it.")`,
      challenge: 'Add barrel friction to the simulation (a constant retarding force of ~5% of the driving force). How does friction change the muzzle velocity? Why do real gun barrels need smooth, polished bores? (Friction wastes energy as heat, reducing projectile velocity.)',
      successHint: 'You just modelled internal ballistics — the same physics used to design every firearm and cannon. Modern ballistic simulators use the same equations with more refined burn models and real gas corrections. The pressure-time curve is the fundamental tool of weapon and propellant design.',
    },
    {
      title: 'Grain geometry — how surface area controls burn rate',
      concept: `Gunpowder doesn't burn as a solid block — it's formed into **grains** (small pellets or shapes). The grain geometry determines the **burn rate** because combustion occurs at the surface: more exposed surface area means faster gas generation.

Three geometries matter:

1. **Sphere/cylinder grains** — surface area DECREASES as they burn inward (degressive burning). Pressure peaks early, then drops. Used when you want a sharp initial push.

2. **Perforated grains** (tube with holes) — surface area stays roughly CONSTANT as the outer surface shrinks but inner hole surfaces grow (neutral burning). Gives a sustained, flat pressure curve.

3. **Multi-perforated grains** (7 holes) — surface area INCREASES as the grain burns (progressive burning). Pressure builds gradually to a peak at the end. Used in large guns where you want the projectile to accelerate steadily over a long barrel.

**Key insight**: the burn rate is proportional to surface area × linear burn speed. Geometry controls the surface area evolution; chemistry controls the linear burn speed.

📚 *"Corning" was the medieval breakthrough of forming gunpowder into uniform grains instead of loose powder. Corned powder was 3× more powerful because the grains had consistent, controlled burn characteristics.*`,
      analogy: 'Think of ice cubes melting. A big cube has relatively little surface area per gram — it melts slowly. Crush it into tiny shards — same mass, but enormous surface area — and it melts in seconds. Gunpowder grains work the same way: smaller grains have more surface area per gram and burn faster, producing higher peak pressure.',
      storyConnection: 'Before the 15th century, gunpowder was used as loose "serpentine" powder — inconsistent, dusty, and prone to separation during transport. European powder-makers invented "corning" around 1420: wetting the powder, pressing it into cakes, breaking the cakes into uniform grains, and sieving by size. Corned powder was dramatically more powerful and consistent than serpentine.',
      checkQuestion: 'A spherical grain of radius 5 mm burns at 2 mm/s. What is the initial surface area, and how long until it is fully consumed?',
      checkAnswer: 'Initial surface area = 4πr² = 4π(5)² = 314 mm². Time to consume = radius / burn rate = 5/2 = 2.5 seconds. After 1 second, r = 3 mm, area = 4π(3)² = 113 mm² — only 36% of initial. This is degressive burning: rapid pressure rise, then rapid decline.',
      codeIntro: 'Model the burn surface area evolution for different grain geometries.',
      code: `import numpy as np

def sphere_burn(r0, burn_rate, dt=0.01):
    """Spherical grain: surface decreases as it burns inward."""
    times, areas, fractions = [], [], []
    r = r0
    total_vol = 4/3 * np.pi * r0**3
    while r > 0:
        t = (r0 - r) / burn_rate
        area = 4 * np.pi * r**2
        vol_remaining = 4/3 * np.pi * r**3
        times.append(t)
        areas.append(area)
        fractions.append(1 - vol_remaining / total_vol)
        r -= burn_rate * dt
    return np.array(times), np.array(areas), np.array(fractions)

def tube_burn(r_out, r_in, length, burn_rate, dt=0.01):
    """Single-perf tubular grain: roughly neutral burning."""
    times, areas, fractions = [], [], []
    ro, ri = r_out, r_in
    total_vol = np.pi * (r_out**2 - r_in**2) * length
    while ro > ri:
        t = (r_out - ro) / burn_rate
        area_outer = 2 * np.pi * ro * length
        area_inner = 2 * np.pi * ri * length
        area_total = area_outer + area_inner
        vol_remaining = np.pi * (ro**2 - ri**2) * length
        times.append(t)
        areas.append(area_total)
        fractions.append(1 - vol_remaining / total_vol)
        ro -= burn_rate * dt
        ri += burn_rate * dt
    return np.array(times), np.array(areas), np.array(fractions)

# Compare grain geometries
r0 = 5.0        # mm outer radius
burn = 2.0       # mm/s linear burn rate

print("=== Grain Geometry: Surface Area Over Time ===\\n")

# Sphere
t_s, a_s, f_s = sphere_burn(r0, burn)
print("SPHERICAL GRAIN (degressive)")
for i in range(0, len(t_s), max(1, len(t_s)//6)):
    print(f"  t={t_s[i]:>4.2f}s  area={a_s[i]:>6.1f} mm²  burned={f_s[i]*100:>5.1f}%")

# Tube (neutral)
t_t, a_t, f_t = tube_burn(r0, 1.5, 20.0, burn)
print("\\nTUBULAR GRAIN (neutral)")
for i in range(0, len(t_t), max(1, len(t_t)//6)):
    print(f"  t={t_t[i]:>4.2f}s  area={a_t[i]:>6.1f} mm²  burned={f_t[i]*100:>5.1f}%")

# Gas generation comparison
print("\\n=== Peak Gas Generation Rate ===")
print(f"Sphere peak: {a_s[0]:>8.1f} mm² (at ignition, then drops)")
print(f"Tube   peak: {max(a_t):>8.1f} mm² (sustained throughout)")
print(f"Tube/Sphere ratio: {max(a_t)/a_s[0]:.1f}×")
print()
print("Tubular grains maintain higher surface area longer,")
print("giving a flatter pressure curve — essential for long barrels")
print("where sustained push beats a sharp initial spike.")`,
      challenge: 'Model a multi-perforated grain (7 holes in a cylinder). As the outer radius shrinks, the 7 inner hole radii grow — the total surface area INCREASES over time. Calculate the area evolution and show that this gives progressive burning. Why is progressive burning better for large naval guns?',
      successHint: 'Grain geometry is one of the most important design parameters in propellant engineering. Modern solid rocket motors use star-shaped, wagon-wheel, or slot-and-tube grain geometries to precisely control the thrust profile — the same principle you just analysed, scaled up to millions of newtons of thrust.',
    },
    {
      title: 'Corned powder chemistry — why granulation changes everything',
      concept: `Loose gunpowder ("serpentine") was a fine mixture of saltpetre, charcoal, and sulphur. It had three critical problems:

1. **Separation**: the three components have different densities (KNO₃: 2.1 g/cm³, charcoal: 0.5 g/cm³, sulphur: 2.0 g/cm³). During transport, the heavy saltpetre settled to the bottom, changing the mixture ratio.

2. **Packing**: fine powder packs tightly with little air space between particles. This reduces the burn rate because the flame front can't easily penetrate the mass.

3. **Inconsistency**: each batch had different particle sizes and mixing quality, making performance unpredictable.

**Corning** solved all three: wetting the powder, pressing it into dense cakes, breaking the cakes into uniform grains, and sieving by size. Each grain is a homogeneous micro-mixture — the components can't separate. The air gaps between grains allow the flame to propagate rapidly across all grains simultaneously.

The result: corned powder was **3× more powerful** than serpentine for the same mass, and far more consistent batch-to-batch.

📚 *Granulation is a key process in many industries: pharmaceuticals (pills), food (instant coffee), ceramics (spray-dried powders), and agriculture (fertiliser pellets). The physics is the same: controlling particle size controls performance.*`,
      analogy: 'Imagine trying to start a campfire with a log vs with kindling. The log has the same amount of wood, but the kindling ignites instantly because it has more surface area exposed to the flame. Corning gunpowder is like splitting a log into kindling: same material, but the increased accessible surface area makes the combustion dramatically faster and more complete.',
      storyConnection: 'The corning process was one of the most important military innovations of the 15th century. European armies adopted it rapidly after discovering that corned powder could propel a cannonball through castle walls that serpentine powder barely dented. The Chinese invention of gunpowder became militarily decisive only after the European innovation of corning.',
      checkQuestion: 'If corned powder is 3× more powerful than serpentine, why not make the grains even smaller for even more power?',
      checkAnswer: 'Smaller grains burn FASTER, producing a sharper pressure spike. In a strong cannon, this is desirable. But in a weaker gun, the peak pressure may exceed the barrel\'s strength — it explodes. Grain size must be matched to the weapon\'s pressure tolerance. Fine grain for pistols, coarse grain for cannons.',
      codeIntro: 'Model the performance difference between serpentine and corned powder, accounting for separation, packing, and burn propagation.',
      code: `import numpy as np

np.random.seed(42)

def simulate_burn(powder_type, n_trials=500):
    """
    Simulate powder combustion performance.
    Returns array of relative impulse values.
    """
    results = []
    for _ in range(n_trials):
        if powder_type == "serpentine":
            # Separation: saltpetre fraction varies ±20%
            kno3_fraction = np.random.normal(0.75, 0.15)
            kno3_fraction = np.clip(kno3_fraction, 0.4, 0.95)
            # Packing: dense, poor flame propagation
            flame_propagation = np.random.uniform(0.3, 0.7)
            # Burn completeness
            completeness = kno3_fraction * flame_propagation
        else:  # corned
            # Uniform composition in each grain
            kno3_fraction = np.random.normal(0.75, 0.02)
            kno3_fraction = np.clip(kno3_fraction, 0.70, 0.80)
            # Good flame propagation through air gaps
            flame_propagation = np.random.uniform(0.8, 0.98)
            completeness = kno3_fraction * flame_propagation

        # Relative impulse (proportional to completeness)
        impulse = completeness * 100
        results.append(impulse)

    return np.array(results)

serp = simulate_burn("serpentine")
corn = simulate_burn("corned")

print("=== Serpentine vs Corned Powder Performance ===")
print(f"(500 trials each)\\n")

for name, data in [("Serpentine", serp), ("Corned", corn)]:
    print(f"{name}:")
    print(f"  Mean impulse:     {np.mean(data):>6.1f}")
    print(f"  Std deviation:    {np.std(data):>6.1f}")
    print(f"  Min:              {np.min(data):>6.1f}")
    print(f"  Max:              {np.max(data):>6.1f}")
    print(f"  Coefficient of variation: {np.std(data)/np.mean(data)*100:.1f}%")
    print()

ratio = np.mean(corn) / np.mean(serp)
print(f"Performance ratio (corned/serpentine): {ratio:.2f}×")
print(f"Consistency improvement: {np.std(serp)/np.std(corn):.1f}× less variation")
print()

# Grain size vs peak pressure
print("=== Grain Size vs Peak Pressure ===")
grain_sizes_mm = [0.5, 1.0, 2.0, 4.0, 8.0, 15.0]
for gs in grain_sizes_mm:
    # Surface area to volume ratio ~ 1/grain_size
    sa_ratio = 6 / gs  # for a cube approximation
    burn_time = gs / 2.0  # time to burn through (ms)
    peak_pressure = sa_ratio * 50  # arbitrary scaling
    use = ("pistol" if gs < 1 else "musket" if gs < 3 else
           "field gun" if gs < 10 else "siege cannon")
    print(f"  Grain {gs:>5.1f} mm: SA/V = {sa_ratio:>5.1f}  "
          f"Burn time = {burn_time:>5.1f} ms  Peak P ~ {peak_pressure:>5.0f}  ({use})")`,
      challenge: 'Add a "moisture contamination" model: if corned powder absorbs 2% moisture, its performance drops by 30%. Serpentine absorbs moisture faster because of its higher surface area. Model 5 days of storage in humid conditions and compare degradation. This is why powder magazines had to be kept bone-dry.',
      successHint: 'The physics of granulation — surface area, packing density, flame propagation — applies far beyond gunpowder. Pharmaceutical engineers control drug dissolution rate with particle size. Battery engineers control charge rate with electrode particle geometry. The principle is universal: surface area controls reaction rate.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Thermochemistry, real gases, and internal ballistics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into enthalpy calculations, real gas corrections, barrel pressure curves, and grain geometry.
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
