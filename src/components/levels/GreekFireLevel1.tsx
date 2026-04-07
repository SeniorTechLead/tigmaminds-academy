import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GreekFireLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The fire triangle — what every fire needs',
      concept: `Every fire requires three things — the **fire triangle**: **fuel** (something to burn), **oxygen** (to sustain the reaction), and **heat** (to start and maintain it). Remove any one, and the fire goes out.

This is why you can extinguish fires in different ways:
- **Water** removes heat (cooling the fuel below its ignition temperature)
- **Smothering** (blanket, sand) removes oxygen
- **Firebreaks** remove fuel (clearing vegetation ahead of a wildfire)

Greek Fire was terrifying because **none of these worked**. Water added heat (quicklime reaction). Smothering failed (the sticky liquid spread). Removing fuel was impossible (it adhered to everything).

The chemistry of combustion: fuel (a hydrocarbon) reacts with oxygen to produce carbon dioxide, water, and **energy**: CₓHᵧ + O₂ → CO₂ + H₂O + Energy. The energy output depends on the fuel's **heat of combustion** — how much energy is released per kilogram.

📚 *The fire triangle was formalized in the 19th century, but firefighters have understood it intuitively for millennia. Every fire suppression technique targets one side of the triangle.*`,
      analogy: 'A fire is like a three-legged stool. Remove any leg (fuel, oxygen, or heat) and the stool falls over — the fire goes out. Greek Fire was a stool that had been reinforced so that kicking out any single leg didn\'t topple it — it brought its own oxygen (oxidizer) and generated its own heat (quicklime + water).',
      storyConnection: 'In 678 CE, Arab ships sailed toward Constantinople expecting a naval battle. Instead, they met jets of liquid fire that burned on water, stuck to hulls, and couldn\'t be extinguished. The Arab fleet was destroyed. The technology was so devastating that it protected Constantinople for another 775 years.',
      checkQuestion: 'A candle goes out when you put a glass jar over it. Which side of the fire triangle did you remove?',
      checkAnswer: 'Oxygen. The candle consumed the oxygen inside the jar and couldn\'t get more because the jar sealed it off. The fuel (wax) and heat (flame) were still present — but without oxygen, combustion stops. This is why fire blankets and CO₂ extinguishers work.',
      codeIntro: 'Model combustion reactions — calculate energy output for different fuels and test extinguishing methods.',
      code: `import numpy as np

# Heat of combustion for different fuels (MJ/kg)
fuels = {
    "Wood": {"heat_mj_kg": 16, "ignition_C": 300, "needs_air": True},
    "Coal": {"heat_mj_kg": 24, "ignition_C": 450, "needs_air": True},
    "Gasoline": {"heat_mj_kg": 46, "ignition_C": 280, "needs_air": True},
    "Naphtha (petroleum)": {"heat_mj_kg": 44, "ignition_C": 250, "needs_air": True},
    "Ethanol": {"heat_mj_kg": 27, "ignition_C": 365, "needs_air": True},
    "Hydrogen": {"heat_mj_kg": 142, "ignition_C": 500, "needs_air": True},
    "Gunpowder": {"heat_mj_kg": 3, "ignition_C": 270, "needs_air": False},
    "Thermite": {"heat_mj_kg": 4, "ignition_C": 1500, "needs_air": False},
}

print("=== Fuel Energy Comparison ===")
print(f"{'Fuel':<22} {'Energy (MJ/kg)':>14} {'Ignition (°C)':>14} {'Needs Air?':>11}")
print("-" * 63)

for name, props in fuels.items():
    air = "Yes" if props["needs_air"] else "NO — self-oxidizing"
    print(f"{name:<22} {props['heat_mj_kg']:>12} {props['ignition_C']:>12} {air:>22}")

# Fire triangle analysis
print(f"\\\n=== Fire Suppression Methods ===")
methods = [
    ("Water spray", "Removes HEAT", "Cools fuel below ignition temp",
     "Fails if fuel reacts with water (grease, metals, Greek Fire)"),
    ("CO₂ extinguisher", "Removes OXYGEN", "Displaces air around the fire",
     "Fails outdoors (wind disperses CO₂) or with self-oxidizers"),
    ("Sand/blanket", "Removes OXYGEN", "Smothers the fire surface",
     "Fails with liquid fires that flow out from under the blanket"),
    ("Firebreak", "Removes FUEL", "Clears combustible material",
     "Fails with projectile fires (Greek Fire was shot from siphons)"),
    ("Halon gas", "Removes HEAT + O₂", "Chemical interference with combustion",
     "Effective but environmentally harmful (ozone depleting)"),
]

print(f"{'Method':<20} {'Triangle Side':>14} {'How it works':<35} {'Limitation'}")
print("-" * 100)
for method, side, how, limit in methods:
    print(f"{method:<20} {side:>14} {how:<35} {limit}")

# Why Greek Fire defeated all methods
print(f"\\\n=== Why Greek Fire Was Inextinguishable ===")
gf_components = [
    ("Naphtha (petroleum)", "FUEL", "Burns intensely, sticks to surfaces"),
    ("Pine resin", "ADHESIVE", "Makes the mixture sticky — can't be scraped off"),
    ("Quicklime (CaO)", "HEAT SOURCE", "Reacts with water EXOTHERMICALLY — water makes it hotter"),
    ("Saltpetre (KNO₃)?", "OXIDIZER?", "Provides oxygen internally — burns without air"),
]

print(f"{'Component':<22} {'Role':>10} {'Effect'}")
print("-" * 65)
for comp, role, effect in gf_components:
    print(f"{comp:<22} {role:>10} {effect}")

print(f"\\\nAttack with water: FAILS — quicklime + water → heat → reignition")
print(f"Smother with blanket: FAILS — sticky liquid flows around the blanket")
print(f"Remove fuel: FAILS — resin adheres to surfaces, can't be removed")
print(f"Cut off air: FAILS — saltpetre may provide internal oxygen")

# Energy calculation
print(f"\\\n=== Greek Fire Energy Estimate ===")
gf_mass_kg = 5  # typical siphon load
naphtha_fraction = 0.6
gf_energy = gf_mass_kg * naphtha_fraction * 44  # MJ
print(f"5 kg of Greek Fire (~60% naphtha):")
print(f"  Energy content: {gf_energy:.0f} MJ")
print(f"  Equivalent to: {gf_energy/46:.1f} kg of gasoline")
print(f"  Burns for: ~{gf_energy/2:.0f} seconds at 1 MW")
print(f"  Enough to ignite a wooden warship in seconds")`,
      challenge: 'A grease fire in a kitchen should NEVER be put out with water. Why? (The water hits the hot oil, instantly vaporizes to 1,700× its volume as steam, and the expanding steam sprays burning oil everywhere — a fireball. Use a lid, baking soda, or a fire blanket instead.) Model this: calculate the steam volume from 100 mL of water at 300°C.',
      successHint: 'You analyzed the fire triangle — the foundation of all fire science. Every firefighter, chemical engineer, and safety officer uses this framework. The key insight: different fires require different suppression methods because different fuels interact differently with water, oxygen, and heat. One method does NOT fit all fires.',
    },
    {
      title: 'Exothermic reactions — when chemistry produces heat',
      concept: `An **exothermic reaction** releases energy (usually heat) as a product. The reactants have more chemical energy than the products — the difference is released to the surroundings.

The quicklime-water reaction is violently exothermic:

**CaO + H₂O → Ca(OH)₂ + 65 kJ/mol**

65 kJ per mole is a LOT of heat. One mole of CaO weighs 56 grams. So 1 kg of quicklime reacting with water releases: (1000/56) × 65 = **1,161 kJ** — enough to raise the temperature of 3 litres of water from room temperature to **boiling**.

This is likely how Greek Fire worked on water. The naphtha burned normally (fuel + oxygen + heat). When someone threw water on it to extinguish it, the quicklime component absorbed the water and released MORE heat — reigniting any parts of the fire that the water had temporarily cooled.

📚 *Endothermic reactions absorb heat (they get cold). Dissolving ammonium nitrate in water is endothermic — this is how instant cold packs work. Exothermic = releases heat. Endothermic = absorbs heat.*`,
      analogy: 'Snapping a hand warmer packet activates an exothermic reaction: iron powder oxidizes (rusts very quickly), releasing heat. The reaction is slow enough to warm your hands for hours. Quicklime + water is the same concept but MUCH faster and more violent — enough heat to boil water and reignite fire.',
      storyConnection: 'The Byzantine sailors knew that throwing water on Greek Fire made it burn harder. This was the weapon\'s most terrifying property — the natural human instinct to fight fire with water was not just useless but actively counterproductive. Enemies who tried to douse the flames only fed them.',
      checkQuestion: 'If 100 g of quicklime reacts with water and releases 116 kJ of heat, how much water (starting at 20°C) can this heat to boiling (100°C)?',
      checkAnswer: 'Energy needed to heat 1 kg of water by 1°C = 4.184 kJ. To go from 20°C to 100°C = 80°C rise. Energy needed per kg = 80 × 4.184 = 335 kJ. So 116 kJ heats 116/335 = 0.35 kg = 350 mL of water to boiling. Just 100 grams of quicklime boils a cup of water!',
      codeIntro: 'Model the quicklime-water reaction — calculate heat output, temperature rise, and compare with other exothermic reactions.',
      code: `import numpy as np

def reaction_heat(mass_reactant_g, molar_mass, enthalpy_kj_mol):
    """
    Calculate heat released by an exothermic reaction.
    mass_reactant_g: mass of reactant in grams
    molar_mass: g/mol
    enthalpy_kj_mol: kJ released per mole (positive for exothermic)
    """
    moles = mass_reactant_g / molar_mass
    heat_kj = moles * enthalpy_kj_mol
    return heat_kj

def temperature_rise(heat_kj, mass_water_g, specific_heat=4.184):
    """
    Calculate temperature rise of water from absorbed heat.
    Returns temperature rise in °C.
    """
    return heat_kj * 1000 / (mass_water_g * specific_heat)

# Quicklime-water reaction
print("=== Quicklime + Water Reaction ===")
print("CaO + H₂O → Ca(OH)₂ + 65 kJ/mol\\\n")

masses = [10, 50, 100, 500, 1000]
print(f"{'CaO (g)':>8} {'Heat (kJ)':>10} {'Water boiled (mL)':>18} {'ΔT of 1L water':>16}")
print("-" * 54)

for m in masses:
    heat = reaction_heat(m, 56, 65)  # CaO molar mass = 56
    water_boiled = heat / (4.184 * 80) * 1000  # mL boiled from 20°C
    delta_t = temperature_rise(heat, 1000)  # 1 litre of water
    print(f"{m:>6} g {heat:>8.0f} {water_boiled:>16.0f} {delta_t:>14.0f}°C")

# Compare exothermic reactions
print(f"\\\n=== Exothermic Reaction Comparison ===")
reactions = [
    ("CaO + H₂O (quicklime)", 56, 65, "Greek Fire reactivation"),
    ("NaOH + H₂O (lye dissolving)", 40, 45, "Drain cleaner heating"),
    ("Fe + O₂ (iron rusting)", 56, 412, "Hand warmers (slow)"),
    ("H₂ + O₂ (hydrogen burning)", 2, 286, "Rocket fuel"),
    ("CH₄ + O₂ (methane burning)", 16, 890, "Natural gas stove"),
    ("C₃H₈ + O₂ (propane)", 44, 2220, "Gas grill"),
    ("2Al + Fe₂O₃ (thermite)", 54, 850, "Welding/military"),
]

print(f"{'Reaction':<30} {'kJ/mol':>8} {'kJ/kg':>8} {'Application'}")
print("-" * 70)

for name, mw, enthalpy, app in reactions:
    kj_per_kg = enthalpy / mw * 1000
    print(f"{name:<30} {enthalpy:>6} {kj_per_kg:>6.0f} {app}")

# Greek Fire scenario simulation
print(f"\\\n=== Greek Fire Scenario: Water on Burning Ship ===")
print(f"A sailor throws 10 litres of water on burning Greek Fire")
print(f"containing 500g of quicklime:\\\n")

# Step 1: Water cools the fire temporarily
water_mass_g = 10000
fire_temp = 800  # °C
cooling = temperature_rise(-reaction_heat(water_mass_g, 18, 2.26), water_mass_g)
print(f"Step 1: Water absorbs heat → fire temperature drops temporarily")

# Step 2: Quicklime reacts with water
heat_from_lime = reaction_heat(500, 56, 65)
delta_t_water = temperature_rise(heat_from_lime, water_mass_g)
print(f"Step 2: CaO + H₂O releases {heat_from_lime:.0f} kJ")
print(f"        Water temperature rises by {delta_t_water:.0f}°C")
print(f"        If water started at 20°C, it's now at {20 + delta_t_water:.0f}°C")

# Step 3: Re-ignition
naphtha_ignition = 250  # °C
print(f"Step 3: Naphtha ignition temperature = {naphtha_ignition}°C")
print(f"        Heat from quicklime pushes surrounding temperature above this")
print(f"        → Fire REIGNITES, now fed by even more heat")
print(f"\\\nResult: The water made the fire WORSE. The sailor's instinct")
print(f"to fight fire with water was exactly what the Byzantines designed for.")`,
      challenge: 'Self-heating coffee cans use quicklime + water to warm the drink. If a can contains 50g of CaO and 300 mL of water, what temperature does the coffee reach (starting at 20°C)? Is it hot enough to drink comfortably (~60°C)? This is the same chemistry as Greek Fire, just slower and controlled.',
      successHint: 'You modeled exothermic reactions quantitatively — calculating heat output, temperature changes, and comparing reaction intensities. The same thermochemistry is used in every chemical plant, power station, and rocket engine. The key formula: heat = moles × enthalpy. Simple, powerful, universal.',
    },
    {
      title: 'Pressure and fluid jets — the physics of flamethrowers',
      concept: `Greek Fire was projected through bronze tubes using **air pressure** — essentially a pump-action flamethrower. The mechanism was a **force pump** connected to a heated, pressurized tank.

The physics of a pressurized liquid jet:
- **Bernoulli's equation**: as fluid speeds up through a narrow nozzle, pressure drops and velocity increases
- **Torricelli's law**: exit velocity depends on the pressure (height of fluid above the nozzle)
- **Projectile motion**: once the jet leaves the nozzle, it follows a parabolic trajectory under gravity

The range of the jet depends on: nozzle pressure (higher = faster), nozzle diameter (smaller = faster but less volume), and the angle of projection (45° gives maximum range for a given velocity, but lower angles were more practical).

Historical accounts describe a range of **15-20 metres** — devastating in close naval combat where ships were often within rowing distance of each other.

📚 *Bernoulli's equation: P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂². As velocity increases (through a nozzle), pressure decreases. This is why a garden hose nozzle increases the speed of water — the same volume must pass through a smaller opening, so it moves faster.*`,
      analogy: 'Put your thumb over a garden hose. The water sprays much further because the same volume is forced through a smaller opening — the velocity increases. The Byzantine siphon worked the same way: compressed air forced liquid through a narrow bronze nozzle, creating a jet that could reach enemy ships 15-20 metres away.',
      storyConnection: 'The delivery nozzles were often shaped like animal heads — lions, dragons, serpents — for psychological effect. Imagine seeing a bronze lion\'s head on the prow of an approaching ship, and then a stream of liquid fire erupting from its mouth. The terror was as much a weapon as the fire itself.',
      checkQuestion: 'A pump creates 3 atmospheres of pressure (300 kPa) behind the nozzle. Using Torricelli\'s law (v = √(2P/ρ)), what is the jet velocity? (Assume ρ = 900 kg/m³ for naphtha)',
      checkAnswer: 'v = √(2 × 300,000 / 900) = √(667) = 25.8 m/s ≈ 93 km/h. At this velocity and a 30° projection angle, the jet would reach about 35 metres (ignoring air resistance). At a more practical 15° angle: about 17 metres — matching historical accounts.',
      codeIntro: 'Model the Greek Fire siphon — calculate jet velocity, range, and the effect of pressure and nozzle size.',
      code: `import numpy as np

def jet_velocity(pressure_pa, density_kg_m3):
    """Torricelli's law for a pressurized container."""
    return np.sqrt(2 * pressure_pa / density_kg_m3)

def projectile_range(velocity, angle_deg, height=2.0):
    """
    Range of a projectile launched from height h at angle θ.
    Simplified (no air resistance).
    """
    g = 9.81
    theta = np.radians(angle_deg)
    vx = velocity * np.cos(theta)
    vy = velocity * np.sin(theta)

    # Time to hit water level (quadratic formula)
    # 0 = height + vy*t - 0.5*g*t²
    discriminant = vy**2 + 2 * g * height
    t = (vy + np.sqrt(discriminant)) / g

    return vx * t

def flow_rate(velocity, nozzle_diameter_m):
    """Volume flow rate through a circular nozzle."""
    area = np.pi * (nozzle_diameter_m / 2) ** 2
    return velocity * area * 1000  # litres per second

# Greek Fire siphon analysis
naphtha_density = 900  # kg/m³

print("=== Greek Fire Siphon Calculator ===")
print()

# Effect of pump pressure on jet velocity and range
print(f"{'Pressure (atm)':>15} {'Velocity (m/s)':>15} {'Range at 15°':>13} {'Range at 30°':>13}")
print("-" * 58)

for atm in [1, 2, 3, 4, 5]:
    pressure = atm * 101325  # convert to Pa
    vel = jet_velocity(pressure, naphtha_density)
    range_15 = projectile_range(vel, 15)
    range_30 = projectile_range(vel, 30)
    print(f"{atm:>13} {vel:>13.1f} {range_15:>11.1f} m {range_30:>11.1f} m")

# Nozzle diameter effect
print(f"\\\n=== Nozzle Size vs Flow Rate (at 3 atm) ===")
vel_3atm = jet_velocity(3 * 101325, naphtha_density)
print(f"Jet velocity at 3 atm: {vel_3atm:.1f} m/s\\\n")

print(f"{'Nozzle ∅ (cm)':>14} {'Flow (L/s)':>11} {'Burn time (5L)':>15} {'Jet width':>10}")
print("-" * 52)

for diam_cm in [1, 2, 3, 4, 5]:
    diam_m = diam_cm / 100
    flow = flow_rate(vel_3atm, diam_m)
    burn_time = 5 / flow  # 5 litres of fuel
    print(f"{diam_cm:>12} cm {flow:>9.2f} {burn_time:>13.1f} s {diam_cm:>8} cm")

# Complete siphon specification
print(f"\\\n=== Historical Greek Fire Siphon Spec ===")
spec = {
    "Tank capacity": "5-10 litres",
    "Operating pressure": "~3 atmospheres",
    "Nozzle diameter": "~3 cm",
    "Jet velocity": f"{vel_3atm:.0f} m/s ({vel_3atm*3.6:.0f} km/h)",
    "Effective range": f"{projectile_range(vel_3atm, 15):.0f} m",
    "Flow rate": f"{flow_rate(vel_3atm, 0.03):.1f} L/s",
    "Burn duration": f"{5/flow_rate(vel_3atm, 0.03):.0f} seconds per tank",
    "Nozzle shape": "Bronze animal head (lion, dragon)",
}

for key, val in spec.items():
    print(f"  {key:<20} {val}")

# Trajectory visualization (text-based)
print(f"\\\n=== Jet Trajectory at 3 atm, 15° angle ===")
vel = vel_3atm
angle = 15
g = 9.81
theta = np.radians(angle)
vx = vel * np.cos(theta)
vy = vel * np.sin(theta)

print(f"{'Time (s)':>8} {'x (m)':>8} {'y (m)':>8} {'Speed (m/s)':>12}")
print("-" * 38)

for t in np.arange(0, 2.0, 0.2):
    x = vx * t
    y = 2 + vy * t - 0.5 * g * t**2
    speed = np.sqrt(vx**2 + (vy - g*t)**2)
    if y >= 0:
        print(f"{t:>6.1f} {x:>6.1f} {y:>6.1f} {speed:>10.1f}")

total_range = projectile_range(vel, angle)
print(f"\\\nTotal range: {total_range:.1f} m")
print(f"Time of flight: {(vy + np.sqrt(vy**2 + 2*g*2))/g:.2f} s")`,
      challenge: 'Modern fire trucks can project water 30+ metres using pumps at 10 atm. Calculate the jet velocity and compare with the Greek Fire siphon. How much more pressure would the Byzantines need to match a modern fire truck\'s range? (About 10× more — which their bronze pumps couldn\'t achieve.)',
      successHint: 'You applied Bernoulli\'s equation and projectile motion to model an ancient weapon system — the same physics used to design fire hoses, paint sprayers, fuel injectors, and water jet cutters. Fluid dynamics and projectile motion are two of the most practical branches of physics.',
    },
    {
      title: 'Bond energies — calculating combustion heat from molecular structure',
      concept: `When a fuel burns, **chemical bonds break** (requiring energy) and **new bonds form** (releasing energy). If the new bonds release more energy than the old bonds required to break, the reaction is **exothermic** — it produces heat.

The heat of combustion can be estimated from **bond energies**: the energy needed to break or form each type of chemical bond.

Key bond energies (kJ/mol):
- C-H: 413
- C-C: 347
- O=O: 498
- C=O (in CO₂): 805
- O-H (in H₂O): 463

For methane (CH₄ + 2O₂ → CO₂ + 2H₂O):
- **Bonds broken**: 4×C-H + 2×O=O = 4(413) + 2(498) = 2,648 kJ
- **Bonds formed**: 2×C=O + 4×O-H = 2(805) + 4(463) = 3,462 kJ
- **Net energy**: 3,462 - 2,648 = **814 kJ/mol released** (exothermic)

The actual value (890 kJ/mol) differs because bond energies are averages, but the estimate is remarkably close.

📚 *Bond energy is the energy needed to break one mole of a specific bond in the gas phase. It's always positive (breaking bonds always requires energy). The sign of the reaction energy comes from the DIFFERENCE between breaking and forming.*`,
      analogy: 'Imagine demolishing a brick wall (breaking bonds = costs energy) and building a stronger concrete wall from the same materials (forming bonds = releases energy). If the concrete wall releases more energy when built than the brick wall cost to demolish, the overall process produces net energy. Combustion works the same way — old bonds break, new (stronger) bonds form, net energy is released.',
      storyConnection: 'Naphtha (a petroleum fraction) has a high proportion of C-H bonds, which are relatively weak. When they react with oxygen to form the much stronger C=O and O-H bonds in CO₂ and H₂O, a large amount of energy is released. This is why petroleum-based fuels (including the naphtha in Greek Fire) burn so vigorously.',
      checkQuestion: 'Which releases more energy when formed: a C=O bond (805 kJ/mol) or a C-H bond (413 kJ/mol)?',
      checkAnswer: 'The C=O bond — it releases nearly twice as much energy when formed. This is why the products of combustion (CO₂, with two C=O bonds per molecule) are so stable — you\'d need enormous energy to break them apart. Combustion produces stable products, which is why it releases so much energy.',
      codeIntro: 'Calculate combustion energies from bond energies — predict how much heat different fuels release.',
      code: `import numpy as np

# Bond energies (kJ/mol) — average values
BOND_ENERGIES = {
    "C-H": 413,
    "C-C": 347,
    "C=C": 614,
    "O=O": 498,
    "C=O": 805,  # in CO₂
    "O-H": 463,  # in H₂O
    "N≡N": 945,
    "C-O": 358,
    "C≡O": 1072,
    "H-H": 436,
}

def combustion_energy(c_atoms, h_atoms, molar_mass=None):
    """
    Estimate heat of combustion for a hydrocarbon CₓHᵧ.
    CₓHᵧ + (x + y/4)O₂ → xCO₂ + (y/2)H₂O

    Bonds broken: (c-1)×C-C + y×C-H + (x+y/4)×O=O
    Bonds formed: 2x×C=O + y×O-H
    """
    # Bonds broken (costs energy)
    cc_bonds = max(c_atoms - 1, 0)  # C-C bonds in chain
    ch_bonds = h_atoms
    o2_molecules = c_atoms + h_atoms / 4
    oo_bonds = o2_molecules

    energy_in = (cc_bonds * BOND_ENERGIES["C-C"] +
                 ch_bonds * BOND_ENERGIES["C-H"] +
                 oo_bonds * BOND_ENERGIES["O=O"])

    # Bonds formed (releases energy)
    co_bonds = 2 * c_atoms  # 2 C=O per CO₂
    oh_bonds = h_atoms       # 2 O-H per H₂O, y/2 water molecules → y O-H bonds

    energy_out = (co_bonds * BOND_ENERGIES["C=O"] +
                  oh_bonds * BOND_ENERGIES["O-H"])

    net_energy = energy_out - energy_in  # positive = exothermic

    if molar_mass:
        energy_per_kg = net_energy / molar_mass * 1000  # kJ/kg

    return net_energy, energy_in, energy_out

# Common fuels
print("=== Combustion Energy from Bond Energies ===")
print()

fuels = [
    ("Methane (CH₄)", 1, 4, 16),
    ("Ethane (C₂H₆)", 2, 6, 30),
    ("Propane (C₃H₈)", 3, 8, 44),
    ("Octane (C₈H₁₈)", 8, 18, 114),
    ("Naphtha (~C₁₀H₂₂)", 10, 22, 142),
    ("Ethanol (C₂H₅OH)*", 2, 6, 46),
    ("Hydrogen (H₂)**", 0, 2, 2),
]

print(f"{'Fuel':<22} {'Broken (kJ)':>12} {'Formed (kJ)':>12} {'Net (kJ/mol)':>13} {'kJ/kg':>8} {'Actual':>8}")
print("-" * 78)

actual_values = {
    "Methane (CH₄)": 890, "Ethane (C₂H₆)": 1560, "Propane (C₃H₈)": 2220,
    "Octane (C₈H₁₈)": 5470, "Naphtha (~C₁₀H₂₂)": 6830,
    "Ethanol (C₂H₅OH)*": 1367, "Hydrogen (H₂)**": 286,
}

for name, c, h, mw in fuels:
    net, e_in, e_out = combustion_energy(c, h, mw)
    kj_kg = net / mw * 1000
    actual = actual_values.get(name, "N/A")
    actual_str = f"{actual}" if isinstance(actual, int) else actual
    print(f"{name:<22} {e_in:>10.0f} {e_out:>10.0f} {net:>11.0f} {kj_kg:>6.0f} {actual_str:>8}")

print(f"\\\n* Ethanol has an O-H and C-O bond that affect the calculation")
print(f"** Hydrogen has no carbon — bonds broken: H-H + O=O; formed: 2×O-H")

# Why petroleum fuels are so energetic
print(f"\\\n=== Why Petroleum Burns So Hot ===")
print(f"The secret: C-H bonds are relatively WEAK (413 kJ/mol)")
print(f"but the products (C=O at 805, O-H at 463) are very STRONG.")
print(f"Breaking weak bonds and forming strong ones = lots of net energy.")
print(f"\\\nCompare:")
print(f"  C-H bond (broken): {BOND_ENERGIES['C-H']} kJ/mol — easy to break")
print(f"  C=O bond (formed): {BOND_ENERGIES['C=O']} kJ/mol — hard to break")
print(f"  Difference: {BOND_ENERGIES['C=O'] - BOND_ENERGIES['C-H']} kJ/mol NET per C-H converted to C=O")
print(f"  This energy difference is what powers combustion.")

# Greek Fire energy analysis
print(f"\\\n=== Greek Fire Energy Budget ===")
gf_mass_kg = 5
naphtha_fraction = 0.6
naphtha_mass = gf_mass_kg * naphtha_fraction
naphtha_energy = naphtha_mass * (6830 / 0.142)  # kJ from naphtha component
lime_mass = gf_mass_kg * 0.15
lime_energy = (lime_mass * 1000 / 56) * 65  # kJ from quicklime + water

print(f"5 kg of Greek Fire mixture:")
print(f"  Naphtha ({naphtha_mass:.0f} kg):  {naphtha_energy:.0f} kJ from combustion")
print(f"  Quicklime ({lime_mass:.1f} kg): {lime_energy:.0f} kJ from water reaction")
print(f"  Total energy:       {naphtha_energy + lime_energy:.0f} kJ")
print(f"  Quicklime adds {lime_energy/(naphtha_energy+lime_energy)*100:.0f}% of total energy")
print(f"  But its REAL value is reignition — turning water from")
print(f"  extinguisher into fuel for the fire.")`,
      challenge: 'Calculate the combustion energy of acetylene (C₂H₂) — used in welding torches. It has a C≡C triple bond (bond energy 839 kJ/mol) and only 2 C-H bonds. Is it more or less energetic per kg than octane? (More — the triple bond stores extra energy that is released during combustion.)',
      successHint: 'You calculated combustion energies from first principles — breaking bonds costs energy, forming bonds releases energy. This is the foundation of thermochemistry and is used to predict the energy content of any fuel, the temperature of any flame, and the heat output of any reaction. From Greek Fire to rocket fuel, it\'s all bond energies.',
    },
    {
      title: 'The mystery endures — what science can and cannot reconstruct',
      concept: `Despite centuries of research, no one has conclusively recreated Greek Fire with ALL its described properties:
1. Burns on water
2. Water makes it burn harder
3. Sticks to surfaces
4. Can be projected as a liquid jet
5. Burns with enough intensity to ignite wood at a distance

Several teams have come close using naphtha + quicklime + resin, but matching ALL properties simultaneously has proven elusive. The exact recipe — proportions, preparation method, ignition technique — was lost when Constantinople fell in 1453.

This raises an interesting scientific question: **what CAN we reconstruct from historical descriptions?** Texts tell us the properties (what it did). Chemistry gives us candidate ingredients (what could do those things). But the exact recipe — the specific proportions, preparation steps, and delivery technique — requires **empirical knowledge** that wasn't written down.

This is a common problem in historical science: we can explain WHY something worked (the chemistry), but the HOW (the craft knowledge) is lost. The same gap exists for Damascus steel, Roman concrete, and Stradivarius violins.

📚 *Tacit knowledge: knowledge that can only be acquired through practice, not written instructions. A master craftsman's "feel" for the right temperature, consistency, or timing is tacit knowledge — and it's the hardest to preserve across centuries.*`,
      analogy: 'Imagine trying to bake a cake from a recipe that says only: "Mix flour, sugar, eggs, and butter. Bake until done." You know the ingredients (chemical composition). But you don\'t know the proportions, mixing order, oven temperature, or baking time. The "recipe" is useless without the craft knowledge. Greek Fire is the same — we know the ingredients but not the recipe.',
      storyConnection: 'The recipe for Greek Fire was known only to the Kallinikos family and the reigning Emperor. It was passed down through generations under an oath of secrecy. When Constantinople fell in 1453, the secret died with the last people who knew it — a chain of knowledge transmission spanning nearly 800 years, broken forever.',
      checkQuestion: 'Why can\'t modern chemists simply try all combinations of naphtha, quicklime, and resin until they find the right one?',
      checkAnswer: 'Because the "search space" is enormous: different types of naphtha (light vs heavy petroleum fractions), different grades of quicklime (purity, particle size), different resins (pine, cedar, pistachio), different proportions (hundreds of possible ratios), different preparation methods (heating, mixing order, aging), and different delivery techniques. Testing all combinations systematically would take thousands of experiments. And even if you found a mixture that worked, how would you know it matched the original?',
      codeIntro: 'Model the "reconstruction problem" — how many experiments would be needed to search the entire recipe space?',
      code: `import numpy as np

np.random.seed(42)

def recipe_search_space():
    """
    Calculate the total number of possible Greek Fire recipes,
    given the range of each ingredient and preparation variable.
    """
    variables = [
        ("Naphtha type", 5, "light, medium, heavy, mixed, aged"),
        ("Naphtha fraction %", 10, "40-85% in 5% increments"),
        ("Quicklime fraction %", 8, "5-40% in 5% increments"),
        ("Resin type", 4, "pine, cedar, pistachio, mixed"),
        ("Resin fraction %", 6, "5-30% in 5% increments"),
        ("Saltpetre (yes/no)", 2, "with or without oxidizer"),
        ("Saltpetre fraction %", 4, "0, 5, 10, 15%"),
        ("Mixing temperature °C", 5, "ambient, 50, 100, 150, 200"),
        ("Mixing order", 6, "different sequences of adding ingredients"),
        ("Aging time", 4, "fresh, 1 day, 1 week, 1 month"),
        ("Particle size (lime)", 3, "fine, medium, coarse"),
    ]

    total = 1
    for name, options, desc in variables:
        total *= options

    return variables, total

variables, total_recipes = recipe_search_space()

print("=== Greek Fire Recipe Search Space ===")
print(f"\\\n{'Variable':<25} {'Options':>8} {'Description'}")
print("-" * 65)

for name, options, desc in variables:
    print(f"{name:<25} {options:>6} {desc}")

print(f"\\\nTotal possible recipes: {total_recipes:,}")
print(f"At 1 experiment per day: {total_recipes/365:.0f} years of testing")
print(f"At 10 experiments per day: {total_recipes/3650:.0f} years")

# How the Byzantines might have found the recipe
print(f"\\\n=== How the Byzantines Likely Found It ===")
print(f"Not by systematic search (too many combinations), but by:")
print(f"  1. Starting with known incendiary mixtures (naphtha + resin)")
print(f"  2. Accidental discovery (adding quicklime, observing water reaction)")
print(f"  3. Iterative refinement over decades (adjusting proportions)")
print(f"  4. Craft knowledge passed master → apprentice")

# Simulate random search vs guided search
def random_search(space_size, n_trials):
    """Probability of finding the right recipe by random search."""
    return 1 - (1 - 1/space_size) ** n_trials

def guided_search(space_size, n_trials, reduction_factor=10):
    """
    Guided search: each experiment reduces the remaining space.
    Expert knowledge eliminates most unpromising combinations.
    """
    effective_space = space_size / reduction_factor
    return 1 - (1 - 1/effective_space) ** n_trials

print(f"\\\n=== Random vs Guided Search ===")
print(f"{'Experiments':>12} {'Random P(find)':>16} {'Expert-guided':>14}")
print("-" * 44)

for n in [10, 100, 1000, 5000, 10000, 50000]:
    p_random = random_search(total_recipes, n) * 100
    p_guided = guided_search(total_recipes, n) * 100
    print(f"{n:>10,} {p_random:>14.4f}% {p_guided:>12.2f}%")

print(f"\\\nEven with expert guidance, you need ~{total_recipes//100:,} experiments")
print(f"to have a good chance of finding the recipe.")

# Modern reconstruction attempts
print(f"\\\n=== Modern Reconstruction Attempts ===")
attempts = [
    ("Haldon & Byrne (1977)", "Naphtha + quicklime + resin", "Burns on water ✓, sticky ✓, jet ✗"),
    ("Partington (1999)", "Naphtha + saltpetre + resin", "Jet ✓, water-resistant ✗"),
    ("Greek TV experiment (2006)", "Naphtha + CaO + pine pitch", "All properties partial ✓"),
    ("Various DIY (unsafe!)", "Gasoline + styrofoam + CaO", "Sticky napalm-like ✓, NOT authentic"),
]

print(f"{'Team':<28} {'Recipe':<30} {'Result'}")
print("-" * 85)
for team, recipe, result in attempts:
    print(f"{team:<28} {recipe:<30} {result}")

# The lesson
print(f"\\\n=== What Greek Fire Teaches About Knowledge ===")
lessons = [
    "Written descriptions ≠ reproducible recipes (tacit knowledge matters)",
    "800 years of secrecy shows knowledge CAN be kept secret",
    "When the chain of transmission breaks, knowledge is lost forever",
    "Modern chemistry can explain WHY it worked but not HOW to make it",
    "Craft knowledge (proportions, timing, technique) is as important as theory",
]

for i, lesson in enumerate(lessons, 1):
    print(f"  {i}. {lesson}")`,
      challenge: 'Design an experiment to test whether a particular Greek Fire candidate recipe works. What properties would you measure? What constitutes "success"? What safety precautions are essential? (This is experimental design — one of the most important skills in science. Note: do NOT actually try this — petroleum + quicklime experiments are extremely dangerous.)',
      successHint: 'You explored the intersection of chemistry, history, and the philosophy of knowledge. The Greek Fire mystery teaches a profound lesson: scientific understanding (knowing WHY something works) is not the same as practical knowledge (knowing HOW to make it). Both are needed, and losing either one can make a technology irreproducible — even with all our modern instruments.',
    },
    {
      title: 'Fire classification — why different fires need different responses',
      concept: `Not all fires are the same. Modern fire science classifies fires by the type of fuel:

- **Class A**: Ordinary combustibles (wood, paper, cloth) — water works
- **Class B**: Flammable liquids (gasoline, oil, naphtha) — water spreads them!
- **Class C**: Electrical fires — water conducts electricity = electrocution risk
- **Class D**: Metal fires (magnesium, sodium) — water reacts violently
- **Class K**: Cooking oils — water causes a steam explosion

Greek Fire was essentially a **Class B/D hybrid** — a flammable liquid containing a reactive metal oxide (quicklime). The worst possible combination for water-based suppression.

Each fire class has specific extinguishing agents:
- A: Water or foam
- B: CO₂, dry chemical, or foam
- C: CO₂ or dry chemical (non-conductive)
- D: Special dry powder (graphite, sodium chloride)
- K: Wet chemical (potassium acetate)

Understanding fire classification saves lives — using the wrong extinguisher can make a fire dramatically worse.

📚 *Modern fire suppression is a multi-billion dollar industry based on understanding fire chemistry. Every building has fire extinguishers rated for specific classes. Using the wrong type is dangerous.*`,
      analogy: 'Medicine: you don\'t treat every disease with the same drug. Antibiotics work on bacteria but not viruses. Anti-fungals work on fungi but not bacteria. Firefighting is the same: different "diseases" (fire classes) need different "treatments" (extinguishing agents). Using the wrong one doesn\'t just fail — it can make things worse.',
      storyConnection: 'Greek Fire exploited the weakness of the only fire suppression method available in 678 CE: water. The Byzantines designed a weapon specifically to defeat the enemy\'s natural response. Modern fire science has developed class-specific responses precisely because of lessons like Greek Fire — one method does NOT fit all fires.',
      checkQuestion: 'You walk into a kitchen and find a pan of burning oil. You grab a glass of water. Should you throw it on the fire?',
      checkAnswer: 'ABSOLUTELY NOT. The water would hit the 300°C oil, instantly vaporize (water at 300°C expands to 1,700× its liquid volume), and the expanding steam would spray burning oil across the kitchen — creating a fireball. Use a lid to smother it, baking soda (CO₂ release), or a Class K extinguisher. NEVER water on a grease fire.',
      codeIntro: 'Model fire classification and suppression effectiveness — which extinguisher works on which fire?',
      code: `import numpy as np

# Fire classification system
fire_classes = {
    "A": {
        "name": "Ordinary combustibles",
        "examples": "Wood, paper, cloth, rubber",
        "temperature": "300-600°C",
        "effective": ["Water", "Foam", "Dry chemical"],
        "dangerous": [],
    },
    "B": {
        "name": "Flammable liquids",
        "examples": "Gasoline, oil, naphtha, solvents",
        "temperature": "250-500°C",
        "effective": ["CO₂", "Foam", "Dry chemical"],
        "dangerous": ["Water (spreads the liquid)"],
    },
    "C": {
        "name": "Electrical",
        "examples": "Wiring, appliances, transformers",
        "temperature": "Variable",
        "effective": ["CO₂", "Dry chemical"],
        "dangerous": ["Water (conducts electricity)", "Foam (conductive)"],
    },
    "D": {
        "name": "Combustible metals",
        "examples": "Magnesium, sodium, potassium, titanium",
        "temperature": "650-3000°C",
        "effective": ["Dry powder (graphite, NaCl)", "Sand"],
        "dangerous": ["Water (violent reaction!)", "CO₂ (some metals burn in CO₂)"],
    },
    "K": {
        "name": "Cooking oils/fats",
        "examples": "Vegetable oil, lard, grease",
        "temperature": "370-400°C",
        "effective": ["Wet chemical (K-acetate)", "Lid/smother"],
        "dangerous": ["Water (steam explosion!)"],
    },
}

print("=== Fire Classification System ===\\\n")

for cls, info in fire_classes.items():
    print(f"CLASS {cls}: {info['name']}")
    print(f"  Examples: {info['examples']}")
    print(f"  Temperature: {info['temperature']}")
    print(f"  Effective: {', '.join(info['effective'])}")
    if info['dangerous']:
        print(f"  ⚠ DANGEROUS: {', '.join(info['dangerous'])}")
    print()

# Greek Fire classification
print("=== Greek Fire: Why No Class Fits ===")
print("Greek Fire combines elements of multiple classes:")
print("  • Class B: flammable liquid (naphtha)")
print("  • Class D: reactive metal oxide (quicklime)")
print("  • Self-oxidizing (possibly contains saltpetre)")
print("  • Adhesive (resin makes it stick)")
print()
print("This makes it resistant to EVERY standard suppression method:")

methods = [
    ("Water", "FAILS", "Quicklime reacts exothermically, reigniting the fire"),
    ("Foam", "FAILS", "Naphtha dissolves through foam; resin prevents coverage"),
    ("CO₂", "PARTIAL", "May suppress if oxidizer is external; fails if internal"),
    ("Dry chemical", "PARTIAL", "Disrupts flame chemistry but liquid continues burning"),
    ("Sand", "PARTIAL", "Can smother if thick enough, but liquid flows around it"),
    ("Wet chemical", "UNKNOWN", "Not available in 678 CE; might react with quicklime"),
]

print(f"\\\n{'Method':<16} {'Result':>8} {'Why'}")
print("-" * 70)
for method, result, reason in methods:
    print(f"{method:<16} {result:>8} {reason}")

# Suppression effectiveness matrix
print(f"\\\n=== Extinguisher Effectiveness Matrix ===")
print(f"{'Extinguisher':<18}", end="")
for cls in fire_classes:
    print(f" Class {cls:>3}", end="")
print()
print("-" * 55)

extinguishers = {
    "Water": {"A": "✓✓✓", "B": "✗✗✗", "C": "✗✗✗", "D": "✗✗✗", "K": "✗✗✗"},
    "Foam (AFFF)": {"A": "✓✓✓", "B": "✓✓", "C": "✗✗", "D": "✗", "K": "✗"},
    "CO₂": {"A": "✓", "B": "✓✓✓", "C": "✓✓✓", "D": "✗", "K": "✓"},
    "Dry chemical": {"A": "✓✓", "B": "✓✓✓", "C": "✓✓✓", "D": "✗", "K": "✓"},
    "Wet chemical": {"A": "✓", "B": "✗", "C": "✗", "D": "✗", "K": "✓✓✓"},
    "Dry powder": {"A": "✗", "B": "✗", "C": "✗", "D": "✓✓✓", "K": "✗"},
}

for ext, ratings in extinguishers.items():
    print(f"{ext:<18}", end="")
    for cls in fire_classes:
        print(f" {ratings[cls]:>7}", end="")
    print()

print(f"\\\n✓✓✓ = Highly effective | ✓✓ = Effective | ✓ = Marginal | ✗ = Ineffective/Dangerous")

# Quiz
print(f"\\\n=== Safety Quiz ===")
scenarios = [
    ("Campfire out of control", "A", "Water or dirt"),
    ("Oil pan fire in kitchen", "K", "Lid, baking soda, or K-class extinguisher"),
    ("Laptop battery fire", "C/D", "CO₂ or let it burn out safely; NOT water"),
    ("Gasoline spill on fire", "B", "Foam or CO₂; NOT water (spreads gasoline)"),
    ("Magnesium fire in lab", "D", "Dry powder ONLY; water causes explosion"),
]

print(f"{'Scenario':<30} {'Class':>6} {'Correct Response'}")
print("-" * 70)
for scenario, cls, response in scenarios:
    print(f"{scenario:<30} {cls:>6} {response}")`,
      challenge: 'Design a fictional "universal fire extinguisher" that works on ALL classes (A through K). What properties would it need? (It would need to: cool without reacting with metals, smother without conducting electricity, and chemically suppress the flame. No single substance does all of this — which is why we have different classes.)',
      successHint: 'You mastered fire classification — essential knowledge for laboratory safety, home safety, and any career involving chemicals or engineering. The key lesson: knowing the fire class determines the response. Using the wrong extinguisher can be more dangerous than doing nothing. This knowledge has saved millions of lives since the classification system was developed.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Combustion chemistry and thermodynamics through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model fire chemistry, exothermic reactions, fluid jet physics, and the mystery of Greek Fire.
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
