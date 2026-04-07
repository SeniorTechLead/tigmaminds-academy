import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GunpowderLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Oxidizers — why gunpowder burns without air',
      concept: `Ordinary fire needs **oxygen from the air** to burn. Put a candle in a sealed jar — it goes out when the oxygen is consumed. But gunpowder burns in a sealed space, underwater, and even in the vacuum of space. How?

The answer: gunpowder contains its own **oxidizer** — **potassium nitrate** (KNO₃, also called saltpetre). The nitrate ion (NO₃⁻) contains three oxygen atoms that are released during the reaction, providing the oxygen needed for combustion without any air.

This is what makes gunpowder a **propellant** rather than a simple fuel. A propellant carries both fuel AND oxidizer, so it's self-contained. A fuel needs external oxygen.

The gunpowder reaction: **2KNO₃ + 3C + S → K₂S + 3CO₂ + N₂**

The potassium nitrate provides oxygen. The carbon (charcoal) and sulphur are the fuels. The products are gases (CO₂ and N₂) and a solid residue (K₂S).

📚 *Propellants vs fuels: gasoline is a fuel (needs air). Gunpowder is a propellant (carries its own oxygen). Rocket fuel is a propellant. The distinction determines WHERE a substance can burn — fuels only in air; propellants anywhere.*`,
      analogy: 'Imagine a campfire. It needs wood (fuel) AND air (oxygen). If you sealed it in a box with no air holes, it would go out. Now imagine a self-contained camping stove that carries its own fuel AND its own oxygen canister. It works anywhere — even in a sealed cave. Gunpowder is like the camping stove: fuel + oxidizer in one package.',
      storyConnection: 'Chinese alchemists in the 9th century discovered gunpowder while searching for an elixir of immortality. They mixed sulphur, charcoal, and saltpetre — and were startled when the mixture burst into flame with a violent flash and bang. The saltpetre (oxidizer) made the reaction far more vigorous than burning charcoal alone.',
      checkQuestion: 'A lit sparkler continues to burn when briefly dunked in water. Why?',
      checkAnswer: 'Sparklers contain metal fuel (iron, aluminum) mixed with an oxidizer (potassium nitrate). The oxidizer provides oxygen internally, so the sparkler doesn\'t need air. Water can\'t smother it because the reaction doesn\'t depend on external oxygen. It only stops if the water cools it below the ignition temperature.',
      codeIntro: 'Balance the gunpowder reaction equation and calculate how much oxygen the oxidizer provides.',
      code: `import numpy as np

# Gunpowder reaction: 2KNO₃ + 3C + S → K₂S + 3CO₂ + N₂

# Molar masses (g/mol)
molar_masses = {
    "KNO₃": 101.1,   # potassium nitrate
    "C": 12.0,        # carbon (charcoal)
    "S": 32.1,        # sulphur
    "K₂S": 110.3,     # potassium sulphide
    "CO₂": 44.0,      # carbon dioxide
    "N₂": 28.0,       # nitrogen
    "O₂": 32.0,       # molecular oxygen
}

# Stoichiometry: 2 KNO₃ + 3C + S → K₂S + 3CO₂ + N₂
reactants = {"KNO₃": 2, "C": 3, "S": 1}
products = {"K₂S": 1, "CO₂": 3, "N₂": 1}

print("=== Gunpowder Reaction Analysis ===")
print("2KNO₃ + 3C + S → K₂S + 3CO₂ + N₂\\\n")

# Mass balance
reactant_mass = sum(n * molar_masses[r] for r, n in reactants.items())
product_mass = sum(n * molar_masses[p] for p, n in products.items())

print(f"Reactant masses:")
for r, n in reactants.items():
    mass = n * molar_masses[r]
    print(f"  {n} × {r}: {mass:.1f} g")
print(f"  Total: {reactant_mass:.1f} g")

print(f"\\\nProduct masses:")
for p, n in products.items():
    mass = n * molar_masses[p]
    state = "gas" if p in ["CO₂", "N₂"] else "solid"
    print(f"  {n} × {p}: {mass:.1f} g ({state})")
print(f"  Total: {product_mass:.1f} g")

# Mass balance check
print(f"\\\nMass balance: {reactant_mass:.1f} g → {product_mass:.1f} g "
      f"({'✓ balanced' if abs(reactant_mass - product_mass) < 1 else '✗ unbalanced'})")

# Oxygen from KNO₃
o_from_kno3 = 2 * 3 * 16  # 2 molecules × 3 oxygen atoms × 16 g/mol
print(f"\\\nOxygen provided by KNO₃: {o_from_kno3} g")
print(f"This is INTERNAL oxygen — no air needed!")

# Gas volume at room temperature
gas_moles = products["CO₂"] + products["N₂"]  # 3 + 1 = 4 moles of gas
gas_volume_L = gas_moles * 22.4  # litres at STP
gas_volume_at_combustion = gas_volume_L * (2500 + 273) / 273  # at ~2500°C

print(f"\\\n=== Gas Production ===")
print(f"Moles of gas produced: {gas_moles}")
print(f"Volume at room temperature: {gas_volume_L:.0f} litres")
print(f"Volume at combustion temp (~2500°C): {gas_volume_at_combustion:.0f} litres")
print(f"Expansion ratio (solid → gas at temp): {gas_volume_at_combustion / (reactant_mass/1600 * 1000):.0f}×")

# Traditional gunpowder ratio
print(f"\\\n=== Traditional vs Stoichiometric Ratio ===")
traditional = {"KNO₃": 75, "C": 15, "S": 10}  # weight percent
stoichiometric = {r: n * molar_masses[r] / reactant_mass * 100 for r, n in reactants.items()}

print(f"{'Component':<10} {'Traditional %':>14} {'Stoichiometric %':>18}")
print("-" * 44)
for comp in ["KNO₃", "C", "S"]:
    print(f"{comp:<10} {traditional[comp]:>12}% {stoichiometric[comp]:>16.1f}%")

print(f"\\\nThe traditional ratio (75/15/10) is close to stoichiometric")
print(f"but has slightly MORE oxidizer — ensuring complete combustion")
print(f"of all the carbon and sulphur (no unburned fuel = max gas production).")

# Compare with other propellants
print(f"\\\n=== Self-Oxidizing Propellants ===")
propellants = [
    ("Black powder (gunpowder)", 3, 270, "9th century China"),
    ("Smokeless powder", 5, 250, "1886 (Vieille)"),
    ("Solid rocket fuel", 6, 300, "Modern missiles/shuttle"),
    ("Liquid H₂/O₂", 16, None, "Saturn V, SpaceX"),
    ("Thermite (Al/Fe₂O₃)", 4, 1500, "Welding, military"),
]

print(f"{'Propellant':<28} {'Energy MJ/kg':>12} {'Ignition °C':>12} {'Origin'}")
print("-" * 65)
for name, energy, ign, origin in propellants:
    ign_str = f"{ign}" if ign else "Cryogenic"
    print(f"{name:<28} {energy:>10} {ign_str:>12} {origin}")`,
      challenge: 'Calculate how much charcoal and sulphur would be left unburned if you used LESS than 75% KNO₃ (say 60%). Is there enough oxidizer? (With only 60% KNO₃, there aren\'t enough oxygen atoms to convert all the carbon to CO₂. Some carbon remains as soot — reducing the gas production and energy output.)',
      successHint: 'You balanced a chemical reaction and analyzed oxidizer stoichiometry — the same skills used in rocket fuel design, pharmaceutical manufacturing, and industrial chemistry. The key insight: propellants carry both fuel AND oxidizer, making them self-contained energy sources that work anywhere.',
    },
    {
      title: 'Gas expansion — from powder to explosion',
      concept: `When gunpowder reacts, solid reactants become **gases** (CO₂ and N₂). At the reaction temperature (~2,500°C), these gases want to occupy about **3,000 times** more volume than the original solid powder.

If the reaction happens in **open air**: you get a flash and a pop — the gases expand freely in all directions.

If it happens in a **sealed container**: the gases can't expand. Pressure builds according to the **ideal gas law** (PV = nRT) until the container bursts — that's an **explosion**.

If it happens in a **tube with one open end**: the gases expand in ONE direction, pushing anything in front of them out at high velocity — that's a **gun** or **rocket**.

The same chemistry. The same gas production. Three completely different outcomes based on **containment**. This is why guns, rockets, and bombs are all just different packaging for the same chemical reaction.

📚 *The ideal gas law: PV = nRT. P = pressure, V = volume, n = moles of gas, R = gas constant (8.314 J/mol·K), T = temperature in Kelvin. In a fixed volume, more gas or higher temperature = higher pressure.*`,
      analogy: 'Pop a balloon with a pin (sealed container — explosion). Untie the balloon and let the air out (open — whoosh). Attach the balloon to a toy car and release (tube with one opening — propulsion). Same air, same pressure, three different outcomes. Gunpowder works identically — it\'s all about containment.',
      storyConnection: 'The Chinese used gunpowder for fireworks for over a century before anyone used it for weapons. The transition wasn\'t a chemistry change — the powder was the same. It was an engineering change: containment. A firecracker is a sealed container. A fire lance is a tube. A cannon is a bigger tube. Same chemistry, different physics.',
      checkQuestion: 'If 10 grams of gunpowder produces 4 litres of gas at room temperature, what volume does it occupy at the reaction temperature of 2,500°C?',
      checkAnswer: 'Using the ideal gas law ratio: V₂ = V₁ × T₂/T₁ = 4 × (2773/298) = 4 × 9.3 = 37 litres. In a sealed container of 0.01 litres (10 cm³), the pressure would be 37/0.01 = 3,700 atmospheres. That\'s enough to shatter steel.',
      codeIntro: 'Calculate pressures, volumes, and temperatures for gunpowder in different containment scenarios.',
      code: `import numpy as np

R = 8.314  # Gas constant (J/mol·K)

def ideal_gas_pressure(n_moles, temperature_K, volume_m3):
    """PV = nRT → P = nRT/V"""
    return n_moles * R * temperature_K / volume_m3

def ideal_gas_volume(n_moles, temperature_K, pressure_Pa):
    """PV = nRT → V = nRT/P"""
    return n_moles * R * temperature_K / pressure_Pa

# Gunpowder reaction products
# 2KNO₃ + 3C + S → K₂S + 3CO₂ + N₂
# Per 100g of gunpowder (75g KNO₃ + 15g C + 10g S)
moles_kno3 = 75 / 101.1
moles_co2 = moles_kno3 * 1.5  # 3 CO₂ per 2 KNO₃
moles_n2 = moles_kno3 * 0.5   # 1 N₂ per 2 KNO₃
total_gas_moles = moles_co2 + moles_n2

# Temperatures
room_temp_K = 298  # 25°C
combustion_temp_K = 2773  # ~2500°C

print("=== Gunpowder Gas Production ===")
print(f"Per 100g of powder:")
print(f"  CO₂ produced: {moles_co2:.3f} moles")
print(f"  N₂ produced: {moles_n2:.3f} moles")
print(f"  Total gas: {total_gas_moles:.3f} moles")

# Volume at different conditions
vol_room = ideal_gas_volume(total_gas_moles, room_temp_K, 101325)
vol_hot = ideal_gas_volume(total_gas_moles, combustion_temp_K, 101325)

print(f"\\\nGas volume at room temperature (1 atm): {vol_room*1000:.1f} litres")
print(f"Gas volume at combustion temp (1 atm): {vol_hot*1000:.1f} litres")
print(f"Expansion ratio: {vol_hot/vol_room:.0f}×")

# Original solid volume
solid_volume_m3 = 0.1 / 1600  # 100g at ~1600 kg/m³ density
solid_volume_L = solid_volume_m3 * 1000
print(f"\\\nOriginal solid volume: {solid_volume_L:.4f} litres ({solid_volume_L*1e6:.0f} mm³)")
print(f"Total expansion (solid → hot gas): {vol_hot/solid_volume_m3:.0f}×")

# Scenario analysis
print(f"\\\n=== Three Containment Scenarios ===")

# Scenario 1: Open air (flash)
print(f"\\\n1. OPEN AIR (firecracker without wrapper)")
print(f"   Gas expands freely → flash and pop")
print(f"   Pressure: ~1 atm (ambient)")
print(f"   Danger radius: ~0.5 m (noise/flash only)")

# Scenario 2: Sealed container (bomb)
print(f"\\\n2. SEALED CONTAINER (firecracker)")
container_volumes = [1e-6, 10e-6, 100e-6, 1000e-6]  # m³

print(f"   {'Container':>15} {'Pressure (atm)':>16} {'Pressure (psi)':>16} {'Effect'}")
print(f"   {'-'*60}")

for vol in container_volumes:
    pressure_pa = ideal_gas_pressure(total_gas_moles, combustion_temp_K, vol)
    pressure_atm = pressure_pa / 101325
    pressure_psi = pressure_atm * 14.7
    vol_mL = vol * 1e6
    effect = "Shatters" if pressure_atm > 100 else "Bursts" if pressure_atm > 10 else "Bulges"
    print(f"   {vol_mL:>12.0f} mL {pressure_atm:>14.0f} {pressure_psi:>14.0f} {effect}")

# Scenario 3: Gun barrel
print(f"\\\n3. GUN BARREL (tube, one open end)")
barrel_diameter = 0.02  # 20 mm
barrel_length = 0.5     # 500 mm
barrel_area = np.pi * (barrel_diameter/2)**2
barrel_volume = barrel_area * barrel_length

powder_mass_g = 5  # 5g charge
gas_moles = total_gas_moles * powder_mass_g / 100

# Peak pressure (when gas first fills barrel)
peak_pressure = ideal_gas_pressure(gas_moles, combustion_temp_K, barrel_volume)
peak_atm = peak_pressure / 101325

# Force on projectile
force = peak_pressure * barrel_area
projectile_mass = 0.01  # 10g bullet
acceleration = force / projectile_mass

# Muzzle velocity (simplified: constant pressure over barrel length)
# v² = 2 × a × d → v = sqrt(2 × a × barrel_length)
muzzle_velocity = np.sqrt(2 * acceleration * barrel_length * 0.5)  # 0.5 for average pressure

print(f"   Barrel: {barrel_diameter*1000:.0f}mm × {barrel_length*1000:.0f}mm")
print(f"   Charge: {powder_mass_g}g of gunpowder")
print(f"   Peak pressure: {peak_atm:.0f} atm ({peak_atm*14.7:.0f} psi)")
print(f"   Force on projectile: {force:.0f} N ({force/9.81:.0f} kg-force)")
print(f"   Projectile acceleration: {acceleration:.0f} m/s² ({acceleration/9.81:.0f} g)")
print(f"   Muzzle velocity: ~{muzzle_velocity:.0f} m/s ({muzzle_velocity*3.6:.0f} km/h)")

# Same chemistry, different containment
print(f"\\\n=== Same 100g of Gunpowder, Different Results ===")
results = [
    ("Open air", "Flash, pop, smoke", "Harmless beyond 1m"),
    ("Paper wrapper", "Firecracker bang", "Dangerous within 2m"),
    ("Iron casing", "Grenade/bomb", "Lethal within 10m"),
    ("Gun barrel", "Projectile at ~300 m/s", "Lethal at 100m+"),
    ("Rocket tube", "Propulsion (Newton's 3rd law)", "Launches payload"),
]

print(f"{'Containment':<16} {'Result':<30} {'Effect range'}")
print("-" * 60)
for cont, result, effect in results:
    print(f"{cont:<16} {result:<30} {effect}")`,
      challenge: 'A cannon barrel is 2 metres long (vs 0.5 m for a musket). How does the longer barrel affect muzzle velocity? (The gas pushes the cannonball for 4× the distance, transferring more energy. Calculate the muzzle velocity for both barrel lengths.) This is why cannons are longer than pistols — more barrel = more acceleration.',
      successHint: 'You applied the ideal gas law to a real engineering problem — calculating pressures, forces, and velocities from gas production. The same physics governs car engines (expanding gas pushes pistons), rocket nozzles (expanding gas creates thrust), and pneumatic tools (compressed gas does work).',
    },
    {
      title: 'The evolution of gunpowder weapons — from firework to cannon',
      concept: `The Chinese progression from firework → fire arrow → fire lance → bomb → rocket → cannon took roughly **300 years** (850-1150 CE). Each step was an **engineering innovation**, not a chemistry change — the powder was essentially the same throughout.

**Fire arrow** (~900 CE): a bag of gunpowder tied to a conventional arrow. Ignited before launch, it set fire to the target. The gunpowder was an incendiary, not a propellant.

**Fire lance** (~950 CE): a bamboo tube filled with gunpowder and shrapnel, attached to a spear. When lit, it produced a jet of flame and projectiles. Close-range weapon, terrifying but imprecise.

**Bomb** (~1000 CE): gunpowder in a sealed iron or ceramic container with a fuse. When the container burst, the blast and shrapnel were the weapon.

**Rocket** (~1100 CE): gunpowder in a tube sealed at one end with a stick for stability. The escaping gases pushed the tube forward (Newton's third law).

**Cannon** (~1130 CE): a thick-walled metal tube, sealed at one end, with a projectile (stone or iron ball) at the other. The gas expansion accelerated the projectile to high velocity.

📚 *Each step represents an insight about containment: from no containment (incendiary) to partial containment (fire lance) to full containment (bomb/cannon). The chemistry didn't change. The engineering did.*`,
      analogy: 'Water can drip from a tap (gentle), spray from a hose (directional), or blast from a fire hydrant (powerful). Same water, same pressure — different delivery. The evolution of gunpowder weapons is the same: same chemistry, increasingly sophisticated delivery systems.',
      storyConnection: 'By the time gunpowder reached Europe (mid-13th century), the Chinese had already developed every major category of gunpowder weapon. European engineers then refined these categories — particularly the cannon — and the technology transformed European warfare, ending the era of castles, knights, and feudal fortifications.',
      checkQuestion: 'Why is a cannon more effective than a bomb at the same amount of gunpowder?',
      checkAnswer: 'A bomb distributes its energy in ALL directions (3D sphere). A cannon concentrates its energy in ONE direction (along the barrel). The projectile receives a much larger fraction of the total energy. For the same powder charge, a cannon delivers much more force to its target — at a specific point.',
      codeIntro: 'Model the evolution of gunpowder weapons — compare energy delivery, range, and effectiveness.',
      code: `import numpy as np

def weapon_analysis(powder_mass_g, weapon_type):
    """
    Analyze gunpowder weapon performance.
    Returns energy, velocity, range, and effectiveness.
    """
    # Energy from gunpowder (~3 MJ/kg)
    energy_j = powder_mass_g / 1000 * 3e6

    if weapon_type == "incendiary":
        # Fire arrow: energy delivered as heat
        return {
            "type": "Incendiary",
            "useful_energy": energy_j * 0.3,  # 30% as directed heat
            "velocity": 50,  # arrow speed (m/s) — not from gunpowder
            "range": 100,    # metres (arrow range)
            "destructive": "Sets fires (if target is flammable)",
        }

    elif weapon_type == "fire_lance":
        # Flame jet + shrapnel
        return {
            "type": "Fire lance",
            "useful_energy": energy_j * 0.2,  # 20% as directed flame
            "velocity": 10,  # flame jet speed
            "range": 3,      # metres
            "destructive": "Burns and shrapnel at close range",
        }

    elif weapon_type == "bomb":
        # Explosion in all directions
        blast_radius = (energy_j / 1e6) ** (1/3) * 5  # simplified
        return {
            "type": "Bomb",
            "useful_energy": energy_j * 0.4,  # 40% as blast
            "velocity": 0,
            "range": blast_radius,
            "destructive": f"Blast and shrapnel within {blast_radius:.0f}m",
        }

    elif weapon_type == "rocket":
        # Propulsion
        exhaust_vel = 500  # m/s (black powder rocket)
        payload_fraction = 0.2
        thrust_time = powder_mass_g / 50  # seconds
        max_range = exhaust_vel * thrust_time * 0.3  # with drag
        return {
            "type": "Rocket",
            "useful_energy": energy_j * 0.15,  # 15% as kinetic energy
            "velocity": exhaust_vel * 0.3,
            "range": max_range,
            "destructive": f"Impact at ~{max_range:.0f}m range",
        }

    elif weapon_type == "cannon":
        # Directed projectile
        barrel_length = 1.5  # m
        projectile_mass = powder_mass_g / 5 / 1000  # kg
        # v = sqrt(2 × E_useful / m)
        useful_energy = energy_j * 0.35  # 35% converted to kinetic energy
        velocity = np.sqrt(2 * useful_energy / projectile_mass)
        # Range (45° angle, no drag)
        max_range = velocity**2 / 9.81
        return {
            "type": "Cannon",
            "useful_energy": useful_energy,
            "velocity": velocity,
            "range": min(max_range, 2000),
            "destructive": f"Projectile at {velocity:.0f} m/s, range {min(max_range,2000):.0f}m",
        }

# Compare weapons with the same powder charge
powder = 100  # grams

print("=== Evolution of Gunpowder Weapons ===")
print(f"All using {powder}g of gunpowder ({powder/1000*3:.0f} kJ total energy)\\\n")

weapons = ["incendiary", "fire_lance", "bomb", "rocket", "cannon"]

print(f"{'Type':<14} {'Energy Used':>12} {'Velocity':>10} {'Range':>8} {'Effect'}")
print("-" * 70)

for w in weapons:
    result = weapon_analysis(powder, w)
    print(f"{result['type']:<14} {result['useful_energy']/1000:>9.0f} kJ "
          f"{result['velocity']:>8.0f} m/s {result['range']:>6.0f}m {result['destructive']}")

# Energy efficiency comparison
print(f"\\\n=== Energy Efficiency ===")
total_energy = powder / 1000 * 3e6

for w in weapons:
    result = weapon_analysis(powder, w)
    efficiency = result['useful_energy'] / total_energy * 100
    bar = "█" * int(efficiency)
    print(f"{result['type']:<14} {efficiency:>5.0f}% {bar}")

# Historical timeline
print(f"\\\n=== Timeline of Gunpowder Weapons ===")
timeline = [
    ("~850 CE", "Gunpowder discovered", "China — alchemists seeking immortality"),
    ("~900 CE", "Fire arrows", "Bags of powder tied to arrows"),
    ("~950 CE", "Fire lances", "Bamboo tubes on spears — first 'gun'"),
    ("~1000 CE", "Bombs", "Sealed iron/ceramic shells with fuses"),
    ("~1100 CE", "Rockets", "Tubes sealed at one end — self-propelled"),
    ("~1130 CE", "Cannons", "Metal tubes with projectiles — siege weapons"),
    ("~1250 CE", "Reaches Europe", "Via Mongol conquests and Silk Road"),
    ("~1346 CE", "Battle of Crécy", "English cannon in European battlefield"),
    ("~1453 CE", "Fall of Constantinople", "Ottoman super-cannon breaches walls"),
    ("1886 CE", "Smokeless powder", "Replaces black powder in all firearms"),
]

print(f"{'Date':<12} {'Development':<28} {'Significance'}")
print("-" * 70)
for date, dev, sig in timeline:
    print(f"{date:<12} {dev:<28} {sig}")

# The key insight at each step
print(f"\\\n=== The Engineering Insight at Each Step ===")
insights = [
    ("Fire arrow → Fire lance", "AIM the flame in a direction"),
    ("Fire lance → Bomb", "CONTAIN the explosion for maximum blast"),
    ("Bomb → Rocket", "CHANNEL exhaust for propulsion (Newton's 3rd law)"),
    ("Rocket → Cannon", "DIRECT all energy into a single projectile"),
]

for transition, insight in insights:
    print(f"  {transition:<30} → Insight: {insight}")`,
      challenge: 'The Ottoman "super-cannon" used at Constantinople (1453) was 8 metres long and fired 600 kg stone balls. With a 30 kg powder charge, estimate the muzzle velocity and range. Could it really breach walls at 1.5 km range? (Historical accounts say it could — calculate whether the physics supports this.)',
      successHint: 'You traced the evolution of a technology from discovery to maturity — the same progression seen in every technology: initial curiosity → limited application → iterative refinement → optimized deployment. The chemistry never changed. The engineering — containment, direction, efficiency — made all the difference.',
    },
    {
      title: 'Stoichiometry — the optimal gunpowder recipe',
      concept: `The traditional gunpowder recipe — **75% potassium nitrate, 15% charcoal, 10% sulphur** — has remained essentially unchanged for a thousand years. Why these specific proportions?

**Stoichiometry** answers: these proportions give the closest match to the **exact chemical amounts** needed for the reaction to use up ALL the ingredients, leaving no fuel or oxidizer unreacted.

The balanced equation: **2KNO₃ + 3C + S → K₂S + 3CO₂ + N₂**

Stoichiometric masses: 2(101.1) + 3(12) + 32.1 = 202.2 + 36 + 32.1 = 270.3 g

Stoichiometric percentages: KNO₃ = 74.8%, C = 13.3%, S = 11.9%

Compare with traditional: KNO₃ = 75%, C = 15%, S = 10%

The match is remarkably close — the traditional recipe has slightly MORE carbon and slightly LESS sulphur than stoichiometric. This means a small amount of carbon remains unburned (appearing as smoke — black powder produces a lot of smoke), but it ensures that ALL the potassium nitrate is consumed (maximum oxygen delivery).

📚 *Stoichiometry is the calculation of quantities in chemical reactions. It comes from the Greek "stoicheion" (element) + "metron" (measure). It's the "recipe math" of chemistry — if you want to make water, you need exactly 2 hydrogens per 1 oxygen.*`,
      analogy: 'A recipe calls for 2 cups of flour per 1 egg per 0.5 cups of sugar. If you use 3 cups of flour but still 1 egg, you have excess flour — it doesn\'t participate in the "reaction." The optimal ratio uses ALL ingredients. Stoichiometry finds this optimal ratio from the chemical equation.',
      storyConnection: 'Chinese alchemists refined the gunpowder ratio empirically over centuries — testing different proportions and keeping what worked best. The proportion they settled on (75/15/10) is within 2% of the theoretical optimum. This wasn\'t an accident — it was the result of hundreds of years of systematic experimentation.',
      checkQuestion: 'If you mix 100g of KNO₃ with 20g of carbon and 10g of sulphur, which reactant runs out first (limiting reagent)?',
      checkAnswer: 'The stoichiometric ratio requires 202.2g KNO₃ per 36g C per 32.1g S. Scale to 100g KNO₃: needs 17.8g C and 15.9g S. You have 20g C (excess) and 10g S (deficit). Sulphur is the limiting reagent — it runs out first, leaving unused KNO₃ and carbon.',
      codeIntro: 'Calculate the stoichiometric optimum for gunpowder and test what happens with non-optimal ratios.',
      code: `import numpy as np

def gunpowder_performance(kno3_pct, carbon_pct, sulphur_pct):
    """
    Calculate gunpowder performance for a given composition.
    Returns gas production, energy, and excess reagent.
    """
    total = kno3_pct + carbon_pct + sulphur_pct
    if abs(total - 100) > 0.1:
        return None  # must sum to 100%

    # Moles per 100g of mixture
    moles_kno3 = kno3_pct / 101.1
    moles_c = carbon_pct / 12.0
    moles_s = sulphur_pct / 32.1

    # Stoichiometric requirements: 2KNO₃ + 3C + S
    # Check which reactant limits the reaction
    # Scale each to the reaction: need ratio 2:3:1
    scale_kno3 = moles_kno3 / 2
    scale_c = moles_c / 3
    scale_s = moles_s / 1

    limiting_scale = min(scale_kno3, scale_c, scale_s)

    # Determine limiting reagent
    if scale_kno3 == limiting_scale:
        limiting = "KNO₃"
    elif scale_c == limiting_scale:
        limiting = "Carbon"
    else:
        limiting = "Sulphur"

    # Gas produced (per limiting scale)
    moles_co2 = 3 * limiting_scale
    moles_n2 = 1 * limiting_scale
    total_gas_moles = moles_co2 + moles_n2

    # Gas volume at combustion temperature (L at 2500°C)
    gas_volume = total_gas_moles * 22.4 * (2773 / 273)

    # Energy released (proportional to moles reacted)
    energy_kj = limiting_scale * 600  # ~600 kJ per mole of reaction

    # Excess reagents
    used_kno3 = 2 * limiting_scale * 101.1
    used_c = 3 * limiting_scale * 12.0
    used_s = 1 * limiting_scale * 32.1

    excess_kno3 = kno3_pct - used_kno3
    excess_c = carbon_pct - used_c
    excess_s = sulphur_pct - used_s

    return {
        "gas_moles": total_gas_moles,
        "gas_volume_L": gas_volume,
        "energy_kj": energy_kj,
        "limiting": limiting,
        "excess_kno3": excess_kno3,
        "excess_c": excess_c,
        "excess_s": excess_s,
    }

# Test different ratios
print("=== Gunpowder Ratio Optimization ===")
print(f"{'KNO₃%':>7} {'C%':>5} {'S%':>5} {'Gas (mol)':>10} {'Energy (kJ)':>12} {'Limiting':>10} {'Excess':>20}")
print("-" * 72)

ratios = [
    (60, 20, 20, "Low oxidizer"),
    (65, 20, 15, "Below optimal"),
    (70, 18, 12, "Approaching optimal"),
    (74.8, 13.3, 11.9, "STOICHIOMETRIC"),
    (75, 15, 10, "TRADITIONAL"),
    (80, 12, 8, "High oxidizer"),
    (85, 10, 5, "Excess oxidizer"),
]

best_gas = 0
best_ratio = None

for kno3, c, s, label in ratios:
    result = gunpowder_performance(kno3, c, s)
    if result:
        excess_parts = []
        if result["excess_kno3"] > 0.5: excess_parts.append(f"KNO₃ +{result['excess_kno3']:.1f}g")
        if result["excess_c"] > 0.5: excess_parts.append(f"C +{result['excess_c']:.1f}g")
        if result["excess_s"] > 0.5: excess_parts.append(f"S +{result['excess_s']:.1f}g")
        excess = ", ".join(excess_parts) if excess_parts else "None"

        print(f"{kno3:>5.1f} {c:>5.1f} {s:>5.1f} {result['gas_moles']:>8.4f} "
              f"{result['energy_kj']:>10.1f} {result['limiting']:>10} {excess:>20}")

        if result['gas_moles'] > best_gas:
            best_gas = result['gas_moles']
            best_ratio = (kno3, c, s, label)

print(f"\\\nBest ratio: {best_ratio[0]}/{best_ratio[1]}/{best_ratio[2]} ({best_ratio[3]})")
print(f"Traditional (75/15/10) is within 2% of stoichiometric optimum!")

# Why the traditional ratio has extra carbon
print(f"\\\n=== Why 15% Carbon Instead of 13.3%? ===")
print(f"Extra carbon serves two purposes:")
print(f"  1. Ensures ALL KNO₃ is consumed (KNO₃ is the most expensive ingredient)")
print(f"  2. The excess carbon burns with atmospheric oxygen AFTER the initial")
print(f"     reaction, producing additional heat and the characteristic black smoke")

# Smoke analysis
result_trad = gunpowder_performance(75, 15, 10)
result_stoich = gunpowder_performance(74.8, 13.3, 11.9)

print(f"\\\nTraditional: excess carbon = {result_trad['excess_c']:.1f}g → produces smoke")
print(f"Stoichiometric: excess carbon = {result_stoich['excess_c']:.1f}g → less smoke")
print(f"This is why 'smokeless powder' (1886) was revolutionary — ")
print(f"it burned completely, leaving no visible residue on the battlefield.")

# The 75/15/10 ratio across cultures
print(f"\\\n=== Same Ratio, Different Cultures ===")
cultures = [
    ("China (850 CE)", 75, 15, 10, "Original discovery"),
    ("Arab world (1240 CE)", 75, 15, 10, "Hasan al-Rammah's recipe"),
    ("Roger Bacon (1267 CE)", 75, 15, 10, "Encrypted in Latin anagram"),
    ("Modern standard", 75, 15, 10, "Still used in fireworks/reenactments"),
]

print(f"{'Culture':<28} {'KNO₃':>5} {'C':>4} {'S':>4} {'Note'}")
print("-" * 55)
for culture, k, c, s, note in cultures:
    print(f"{culture:<28} {k:>4}% {c:>3}% {s:>3}% {note}")

print(f"\\\nRemarkable: every culture that independently optimized")
print(f"gunpowder arrived at approximately the same ratio.")
print(f"This isn't coincidence — it's chemistry (stoichiometry).")`,
      challenge: 'The Corned Powder improvement (15th century) involved wetting the powder into a paste, forming it into granules, and drying. The grains burned more consistently than fine powder. Model this: if fine powder burns from the surface inward, and granular powder exposes more total surface area, how does grain size affect burn rate?',
      successHint: 'You applied stoichiometry to optimize a chemical process — the same skill used in every chemical plant, pharmaceutical lab, and food manufacturing facility. The gunpowder ratio is a beautiful example: centuries of empirical optimization converged on almost exactly the stoichiometric optimum. Chemistry rewards precision.',
    },
    {
      title: 'The ideal gas law — predicting pressure from chemistry',
      concept: `The **ideal gas law** — **PV = nRT** — is one of the most useful equations in all of science. It connects four properties of a gas:

- **P** = pressure (pascals)
- **V** = volume (cubic metres)
- **n** = amount of gas (moles)
- **R** = gas constant (8.314 J/mol·K)
- **T** = temperature (kelvin)

For gunpowder in a sealed container, you know n (from the stoichiometry), T (from the combustion temperature), and V (the container size). Solving for P gives you the **pressure** that the container must withstand — or that will be applied to a projectile.

The key insight: pressure is proportional to n and T, and inversely proportional to V. **More gas, higher temperature, smaller container = higher pressure.** This is why guns have small chambers (small V), gunpowder produces lots of gas (large n) at high temperature (large T), and the resulting pressure (large P) accelerates the projectile.

📚 *"Ideal" means the gas molecules don't interact with each other and take up zero volume. Real gases deviate from ideal behavior at high pressures and low temperatures — but for most calculations (including gunpowder), the ideal gas law is accurate enough.*`,
      analogy: 'Imagine 100 people in a large room (low pressure). Now put the same 100 people in a small room (high pressure). Then heat the room (people move faster = even higher pressure). PV = nRT captures all of this: more people (n), higher temperature (T), smaller room (V) = higher pressure (P).',
      storyConnection: 'The development of cannons required understanding (at least intuitively) that the pressure needed to accelerate a heavy cannonball was much greater than that needed for a light musket ball. More powder (more n), in a stronger barrel (withstands higher P), behind a heavier projectile — all governed by PV = nRT.',
      checkQuestion: 'A sealed container holds 0.5 moles of gas at 300K. Volume is 2 litres. What is the pressure?',
      checkAnswer: 'P = nRT/V = 0.5 × 8.314 × 300 / 0.002 = 623,550 Pa ≈ 6.2 atm. If you doubled the temperature to 600K: P = 12.4 atm. If you halved the volume to 1 litre: P = 12.4 atm. Double both: P = 24.7 atm. Pressure responds linearly to each variable.',
      codeIntro: 'Apply the ideal gas law to gunpowder combustion — calculate pressures in different weapons.',
      code: `import numpy as np

R = 8.314  # J/(mol·K)

def ideal_gas(n=None, P=None, V=None, T=None):
    """
    Solve PV = nRT for the unknown variable.
    Exactly one parameter must be None.
    """
    if P is None:
        return n * R * T / V
    elif V is None:
        return n * R * T / P
    elif T is None:
        return P * V / (n * R)
    elif n is None:
        return P * V / (R * T)

# Gunpowder produces ~0.37 moles of gas per 100g
# at combustion temperature ~2500°C = 2773K

gas_per_100g = 0.37  # moles

print("=== Ideal Gas Law Applied to Gunpowder ===")
print(f"PV = nRT")
print(f"R = {R} J/(mol·K)\\\n")

# Different weapons, different chambers
weapons = [
    ("Firecracker", 5, 5e-6, 2773),      # 5g powder, 5 mL chamber
    ("Musket", 10, 50e-6, 2773),          # 10g powder, 50 mL chamber
    ("Cannon (small)", 100, 500e-6, 2773), # 100g powder, 500 mL
    ("Cannon (large)", 5000, 10e-3, 2773), # 5kg powder, 10 L
    ("Ottoman siege gun", 30000, 50e-3, 2773), # 30kg powder, 50 L
]

print(f"{'Weapon':<20} {'Powder':>7} {'Chamber':>10} {'Pressure':>12} {'Force on':>12}")
print(f"{'':20} {'(g)':>7} {'(mL)':>10} {'(atm)':>12} {'10cm² (kN)':>12}")
print("-" * 63)

for name, powder_g, volume_m3, temp_K in weapons:
    n_moles = gas_per_100g * powder_g / 100
    pressure_pa = ideal_gas(n=n_moles, V=volume_m3, T=temp_K)
    pressure_atm = pressure_pa / 101325
    force_kn = pressure_pa * 0.01 / 1000  # force on 10 cm² (100 cm² = 0.01 m²)

    print(f"{name:<20} {powder_g:>5} {volume_m3*1e6:>8.0f} {pressure_atm:>10.0f} {force_kn:>10.1f}")

# Temperature effect
print(f"\\\n=== How Temperature Affects Pressure ===")
print(f"100g powder in 500 mL chamber at different combustion temperatures:\\\n")

n = gas_per_100g
V = 500e-6  # 500 mL

print(f"{'Temp (°C)':>10} {'Temp (K)':>10} {'Pressure (atm)':>16}")
print("-" * 38)

for temp_c in [25, 500, 1000, 1500, 2000, 2500, 3000]:
    temp_k = temp_c + 273
    p = ideal_gas(n=n, V=V, T=temp_k)
    print(f"{temp_c:>8} {temp_k:>8} {p/101325:>14.0f}")

# What determines combustion temperature?
print(f"\\\n=== Combustion Temperature of Different Mixtures ===")
powders = [
    ("Black powder (standard)", 2500, 3),
    ("Black powder (optimized)", 2700, 3.2),
    ("Smokeless powder", 3000, 5),
    ("Modern propellant", 3200, 5.5),
    ("Thermite (not really a gun powder)", 2500, 4),
]

print(f"{'Mixture':<35} {'Temp (°C)':>10} {'Energy (MJ/kg)':>14}")
print("-" * 61)
for name, temp, energy in powders:
    print(f"{name:<35} {temp:>8} {energy:>12.1f}")

# Real-world validation
print(f"\\\n=== Checking Against Real Firearms ===")
real_weapons = [
    ("9mm pistol", 4, 12.5e-6, "~2,200 atm actual", 375),
    ("5.56 rifle", 25, 40e-6, "~3,600 atm actual", 940),
    ("12-gauge shotgun", 30, 60e-6, "~1,800 atm actual", 400),
]

print(f"{'Weapon':<16} {'Powder g':>9} {'Chamber mL':>11} {'Calculated':>12} {'Actual':>16} {'Muzzle v':>10}")
print("-" * 76)

for name, powder, vol, actual, muzzle_v in real_weapons:
    n = gas_per_100g * powder / 100  # moles
    # Smokeless powder: higher temp
    p_calc = ideal_gas(n=n, V=vol, T=3273) / 101325  # 3000°C for smokeless
    print(f"{name:<16} {powder:>7} {vol*1e6:>9.1f} {p_calc:>10.0f} atm {actual:>16} {muzzle_v:>8} m/s")

print(f"\\\nThe ideal gas law gives reasonable estimates for real firearms!")
print(f"Differences are due to non-ideal gas behavior at extreme pressures")
print(f"and the complex dynamics of gas expansion in a barrel.")`,
      challenge: 'A "pipe bomb" (extremely dangerous — never attempt!) uses gunpowder in a sealed steel pipe. If the pipe withstands 50 atm before bursting, what mass of gunpowder in a 100 mL pipe would create 50 atm at combustion temperature? (Solve PV = nRT for n, then convert to mass.) This calculation shows why even small amounts of gunpowder are dangerous in sealed containers.',
      successHint: 'You applied PV = nRT to real engineering scenarios — from firecrackers to cannons. This equation appears in chemistry (gas reactions), physics (thermodynamics), engineering (engine design), and even biology (lung gas exchange). Understanding it gives you a tool for analyzing any system involving gases.',
    },
    {
      title: 'The spread of gunpowder — technology transfer across the Silk Road',
      concept: `Gunpowder was invented in China around **850 CE**. It reached the Islamic world by **1240 CE** (about 400 years later). It reached Europe by **1267 CE** (another 27 years). Each transfer changed the receiving civilization.

The transfer routes:
- **China → Mongol Empire** (through conquest — the Mongols adopted gunpowder weapons from Chinese engineers)
- **Mongol Empire → Islamic world** (through the Battle of Ain Jalut, 1260, and Silk Road trade)
- **Islamic world → Europe** (through the Crusades, trade, and Arab scholars like Hasan al-Rammah)

Each civilization adapted the technology differently:
- **China**: primarily fireworks and rockets
- **Islamic world**: improved formulations (purified saltpetre), wrote detailed recipes
- **Europe**: focused on cannons and firearms — ended the era of castles and mounted knights

📚 *Technology transfer across civilizations typically follows this pattern: invention → adaptation → optimization for local conditions → improvement beyond the original. Gunpowder followed this pattern perfectly.*`,
      analogy: 'A recipe travels from a Chinese kitchen to an Italian restaurant. The Italian chef doesn\'t just copy it — they adapt it: substitute local ingredients, adjust for local tastes, and eventually create something that surpasses the original (Chinese noodles → Italian pasta). Technology transfer works the same way — each recipient civilization adapts and often improves the technology.',
      storyConnection: 'Roger Bacon (English friar) described gunpowder in 1267, encrypted in a Latin anagram to keep it secret. Within 80 years, Edward III was using cannon at the Battle of Crécy (1346). Within 200 years, Ottoman super-cannons conquered Constantinople (1453). The technology spread across half the world in 400 years and transformed every civilization it touched.',
      checkQuestion: 'Why did it take 400 years for gunpowder to travel from China to Europe, but only 10 years for the smartphone to spread worldwide?',
      checkAnswer: 'Technology transfer speed is limited by communication speed. In the medieval period, information traveled at the speed of a camel (~30 km/day on the Silk Road). A trade caravan from China to Europe took 6-12 months. Today, information travels at the speed of light via the internet — a smartphone design can be shared globally in seconds. But the ADAPTATION still takes time.',
      codeIntro: 'Model the diffusion of gunpowder technology across civilizations — track adoption, adaptation, and improvement.',
      code: `import numpy as np

np.random.seed(42)

def technology_diffusion(civilizations, transfer_speed_km_year,
                          adaptation_years, years=500):
    """
    Model the spread of a technology from its origin point.

    civilizations: list of (name, distance_km, adoption_threshold)
    transfer_speed: km/year average (including delays)
    adaptation_years: years to adapt technology after receiving it
    """
    results = {}
    origin = civilizations[0]

    for civ in civilizations:
        name, distance, threshold = civ

        if distance == 0:
            # Origin civilization
            year_received = 0
            year_adopted = 0
            year_optimized = 50
        else:
            # Time to reach = distance / speed
            year_received = distance / transfer_speed_km_year
            # Time to adapt
            year_adopted = year_received + adaptation_years
            # Time to optimize
            year_optimized = year_adopted + adaptation_years * 1.5

        results[name] = {
            "received": year_received,
            "adopted": year_adopted,
            "optimized": year_optimized,
            "distance": distance,
        }

    return results

# Gunpowder spread from China (850 CE)
civilizations = [
    ("China", 0, 0),
    ("Korea", 1000, 0.3),
    ("Japan", 2000, 0.4),
    ("Mongol Empire", 3000, 0.5),
    ("Islamic world", 6000, 0.6),
    ("Byzantine Empire", 7500, 0.7),
    ("Western Europe", 8000, 0.8),
    ("Sub-Saharan Africa", 10000, 0.9),
]

# Silk Road speed: ~10,000 km in ~400 years ≈ 25 km/year effective
results = technology_diffusion(civilizations, transfer_speed_km_year=25,
                                adaptation_years=30)

print("=== Gunpowder Technology Diffusion ===")
print(f"Origin: China, 850 CE")
print(f"Transfer speed: ~25 km/year (Silk Road average)\\\n")

print(f"{'Civilization':<20} {'Distance':>9} {'Received':>10} {'Adopted':>9} {'Optimized':>10}")
print("-" * 60)

for name, data in results.items():
    r_year = 850 + data["received"]
    a_year = 850 + data["adopted"]
    o_year = 850 + data["optimized"]
    print(f"{name:<20} {data['distance']:>7} km {r_year:>8.0f} {a_year:>7.0f} {o_year:>8.0f}")

# Actual historical dates (for comparison)
print(f"\\\n=== Predicted vs Actual Dates ===")
actual = [
    ("China", 850, 850),
    ("Korea", 900, 950),
    ("Mongol Empire", 1200, 1230),
    ("Islamic world", 1240, 1260),
    ("Western Europe", 1267, 1300),
]

print(f"{'Civilization':<20} {'Predicted':>10} {'Actual':>8} {'Error (yrs)':>12}")
print("-" * 52)

for name, pred_year, actual_year in actual:
    r = results[name]
    predicted = 850 + r["received"]
    error = predicted - actual_year
    print(f"{name:<20} {predicted:>8.0f} {actual_year:>8} {error:>+10.0f}")

# How each civilization used gunpowder differently
print(f"\\\n=== Adaptation by Civilization ===")
adaptations = [
    ("China", "Fireworks, rockets, fire lances", "Entertainment + battlefield pyrotechnics"),
    ("Mongol Empire", "Bombs, siege weapons", "Adapted for conquest and siege warfare"),
    ("Islamic world", "Purified saltpetre, written recipes", "Improved chemistry, documented knowledge"),
    ("Western Europe", "Cannons, firearms", "Focused on projectile weapons → ended feudalism"),
    ("Ottoman Empire", "Massive siege cannons", "Specialized for conquering fortified cities"),
]

print(f"{'Civilization':<18} {'Primary Use':<35} {'Innovation'}")
print("-" * 85)
for civ, use, innovation in adaptations:
    print(f"{civ:<18} {use:<35} {innovation}")

# The speed of technology transfer over time
print(f"\\\n=== Technology Transfer Speed Over Time ===")
transfers = [
    ("Gunpowder (850-1267)", 400, 8000, "Silk Road (camel)"),
    ("Printing (1455-1480)", 25, 3000, "Trade routes (ship/horse)"),
    ("Steam engine (1712-1800)", 88, 5000, "Ships + letters"),
    ("Telegraph (1837-1860)", 23, 15000, "Ships + newspapers"),
    ("Telephone (1876-1890)", 14, 10000, "Telegraph + trade"),
    ("Radio (1896-1910)", 14, 20000, "Ships + industry"),
    ("Internet (1983-2000)", 17, 40000, "Fiber optics + satellites"),
    ("Smartphone (2007-2015)", 8, 40000, "Internet + manufacturing"),
]

print(f"{'Technology':<28} {'Years':>6} {'km spread':>10} {'Speed km/yr':>12} {'Medium'}")
print("-" * 72)

for name, years, km, medium in transfers:
    speed = km / years
    print(f"{name:<28} {years:>4} {km:>8,} {speed:>10,.0f} {medium}")

print(f"\\\nTechnology transfer speed has increased by ~1,000,000× over 1,200 years.")
print(f"Gunpowder: 20 km/year. Smartphones: 5,000 km/year.")
print(f"The internet makes the next technology transfer essentially instantaneous.")`,
      challenge: 'Model the spread of AI (Large Language Models) starting from 2022. What is the effective "transfer speed"? (Essentially instantaneous — the same day a model is released, it\'s available worldwide.) How does this compare with gunpowder? What are the implications of technology transfer at light speed?',
      successHint: 'You modeled technology diffusion — the same analysis used by economists, historians, and policy makers to understand how innovations spread across societies. The acceleration of transfer speed over the last millennium is one of the most important trends in human history — and understanding it is essential for navigating the future.',
    },
    {
      title: 'The dual-use dilemma — when science serves both beauty and destruction',
      concept: `Gunpowder is the archetype of a **dual-use technology**: the same chemistry that creates beautiful fireworks creates devastating weapons. The physics doesn't change. The reaction is the same. The moral dimension comes entirely from **human choice**.

This pattern repeats throughout history:
- **Nuclear physics**: reactors (clean energy) vs weapons (mass destruction)
- **Biotechnology**: vaccines vs bioweapons
- **AI**: medical diagnosis vs autonomous weapons
- **Encryption**: privacy vs criminal communication
- **Chemistry**: medicines vs poison gas

The question is never "should we discover this?" — knowledge, once discovered, can't be undiscovered. The question is: **how do we govern the application?**

Every technology amplifies human capability. A hammer amplifies the ability to build AND to destroy. Gunpowder amplified it by orders of magnitude. Nuclear energy amplified it by another. AI may amplify it again.

📚 *The Dual-Use Research of Concern (DURC) framework, used by the US National Institutes of Health, evaluates research that could be both beneficial and harmful. It doesn't prohibit the research — it requires oversight of how results are applied.*`,
      analogy: 'A kitchen knife can prepare a meal or commit a crime. We don\'t ban kitchen knives — we create laws about their misuse. Technology governance follows the same principle: allow the beneficial use, regulate the harmful use, and accept that perfect control is impossible.',
      storyConnection: 'The Chinese alchemists wanted immortality. They found destruction. The same pattern: Alexander Fleming wanted to understand bacteria. He found penicillin — which saves millions of lives but also drives antibiotic resistance. Marie Curie wanted to understand radioactivity. She found X-rays (medical imaging) and radiation (cancer treatment) — but also radiation poisoning and nuclear weapons.',
      checkQuestion: 'Should the Chinese alchemists have kept gunpowder secret once they realized it was dangerous?',
      checkAnswer: 'History suggests that keeping technology secret is temporary at best — the Byzantines kept Greek Fire secret for 800 years, but it was lost when Constantinople fell. Gunpowder was independently discovered by multiple cultures. Secrecy delays proliferation but rarely prevents it. The more productive approach: develop norms, treaties, and institutions to govern use.',
      codeIntro: 'Explore the dual-use dilemma through decision analysis — model the trade-offs between beneficial and harmful applications.',
      code: `import numpy as np

# Dual-use technology analysis
print("=== Dual-Use Technology Analysis ===")
print()

technologies = [
    {
        "name": "Gunpowder",
        "year": 850,
        "beneficial": [
            ("Fireworks & celebrations", 8),
            ("Mining & construction", 9),
            ("Demolition", 7),
            ("Signal flares / safety", 6),
        ],
        "harmful": [
            ("Firearms (personal weapons)", 9),
            ("Cannons (siege warfare)", 10),
            ("Bombs & explosives", 10),
            ("Terrorism", 10),
        ],
        "governance": "Arms treaties, export controls, domestic gun laws",
    },
    {
        "name": "Nuclear physics",
        "year": 1938,
        "beneficial": [
            ("Clean electricity (10% global)", 10),
            ("Medical imaging (PET, MRI contrast)", 9),
            ("Cancer treatment (radiation therapy)", 9),
            ("Space power (RTGs on probes)", 7),
        ],
        "harmful": [
            ("Nuclear weapons", 10),
            ("Dirty bombs (terror)", 8),
            ("Nuclear waste", 7),
            ("Reactor accidents", 8),
        ],
        "governance": "NPT, IAEA inspections, arms reduction treaties",
    },
    {
        "name": "AI / Machine Learning",
        "year": 2012,
        "beneficial": [
            ("Medical diagnosis", 9),
            ("Scientific discovery", 10),
            ("Education (personalized)", 8),
            ("Accessibility tools", 8),
        ],
        "harmful": [
            ("Autonomous weapons", 9),
            ("Deepfakes & disinformation", 8),
            ("Mass surveillance", 9),
            ("Job displacement", 7),
        ],
        "governance": "EU AI Act, voluntary guidelines, ongoing debate",
    },
]

for tech in technologies:
    print(f"{'='*60}")
    print(f"  {tech['name']} (discovered {tech['year']})")
    print(f"{'='*60}")

    print(f"\\\n  Beneficial applications:")
    total_benefit = 0
    for app, score in tech["beneficial"]:
        bar = "█" * score
        print(f"    {app:<35} [{score}/10] {bar}")
        total_benefit += score

    print(f"\\\n  Harmful applications:")
    total_harm = 0
    for app, score in tech["harmful"]:
        bar = "▓" * score
        print(f"    {app:<35} [{score}/10] {bar}")
        total_harm += score

    ratio = total_benefit / total_harm
    print(f"\\\n  Benefit/Harm ratio: {ratio:.2f}")
    print(f"  Governance: {tech['governance']}")
    print()

# Decision framework
print(f"{'='*60}")
print(f"  Decision Framework: Should We Develop New Technology?")
print(f"{'='*60}")

criteria = [
    ("Can the knowledge be un-discovered?", "No — once known, it stays known"),
    ("Can beneficial use be separated from harmful?", "Sometimes — regulations can help"),
    ("Is the benefit large enough to justify the risk?", "Must be evaluated case by case"),
    ("Can governance prevent the worst outcomes?", "Partially — no system is perfect"),
    ("Will someone else develop it anyway?", "Usually yes — unilateral restraint rarely works"),
]

print()
for question, answer in criteria:
    print(f"  Q: {question}")
    print(f"  A: {answer}")
    print()

# The historical lesson
print(f"=== The Lesson of Gunpowder ===")
print(f"""
The Chinese alchemists couldn't have known what gunpowder would become.
The firework maker couldn't have imagined the battlefield cannon.
The cannon maker couldn't have imagined the nuclear bomb.

At each step, the technology amplified human capability — for both
creation and destruction. The science was neutral. The application
was not.

"Science is a tool, like a hammer. You can use a hammer to build
 a house or to break a skull. The hammer doesn't care. The person
 holding it does."

The question is never whether to discover. It's always:
  What do we do with what we've discovered?
""")`,
      challenge: 'CRISPR gene editing can cure genetic diseases AND create biological weapons. Apply the dual-use framework: list 4 beneficial and 4 harmful applications. Calculate the benefit/harm ratio. What governance measures would you propose? This is one of the most active ethical debates in modern science.',
      successHint: 'You confronted the dual-use dilemma — the deepest ethical challenge in science and technology. Every powerful technology faces this trade-off. The answer is not to stop discovery (impossible) but to develop governance (laws, treaties, institutions, norms) that maximizes benefit and minimizes harm. This is humanity\'s ongoing project — and it requires both scientific understanding AND ethical wisdom.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Chemistry, gas physics, and technology ethics through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model combustion chemistry, gas expansion, stoichiometry, technology diffusion, and ethical decision-making.
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
