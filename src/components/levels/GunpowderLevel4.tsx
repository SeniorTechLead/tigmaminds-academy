import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GunpowderLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: System design — Propellant, Chamber, and Projectile classes',
      concept: `In this capstone project, you will build a complete **Propellant Chemistry Simulator** — a Python program that models the entire chain from chemical reaction to projectile flight:

1. **Propellant** class — stores chemical properties, calculates energy release and gas production
2. **Chamber** class — models the sealed space where combustion occurs, tracks pressure buildup
3. **Projectile** class — tracks mass, velocity, and position as gas pushes it through a barrel

These three classes interact: the Propellant burns inside the Chamber, generating gas that pushes the Projectile. This object-oriented design separates concerns — each class handles its own physics, and the simulation engine connects them.

The first step is defining clean data structures and interfaces. A **Propellant** knows its energy content and burn rate. A **Chamber** knows its volume and pressure. A **Projectile** knows its mass and current velocity. None needs to know the internal details of the others.

📚 *Separation of concerns is the most important principle in software architecture. Each class has ONE job. The Propellant doesn't know about barrels. The Projectile doesn't know about chemistry. The simulation engine connects them through a clear interface.*`,
      analogy: 'Think of a car: the engine (Propellant) generates power, the transmission (Chamber) converts it to motion, and the wheels (Projectile) deliver it to the road. Each component has its own design team and specifications. They connect through standardised interfaces (crankshaft, driveshaft, axles). Our simulator uses the same principle.',
      storyConnection: 'Chinese weapon engineers designed each component separately: alchemists refined the gunpowder recipe, metalworkers cast the barrel, and armorers shaped the projectile. The genius was in integrating them — ensuring the powder\'s pressure matched the barrel\'s strength and the projectile\'s weight. Our class design mirrors this division of labour.',
      checkQuestion: 'Why define three separate classes instead of one big "Weapon" class with all the properties?',
      checkAnswer: 'Because different propellants can be used in the same chamber, and the same projectile can be fired from different weapons. Separate classes let you mix and match: test black powder vs smokeless in the same cannon, or fire a stone ball vs iron ball with the same charge. This composability is the power of object-oriented design.',
      codeIntro: 'Design the three core classes for the Propellant Chemistry Simulator.',
      code: `import numpy as np

class Propellant:
    """Models a chemical propellant's properties and combustion."""
    def __init__(self, name, energy_j_per_kg, density_kg_m3,
                 burn_rate_mm_s, gas_molecular_weight,
                 flame_temp_K, gas_gamma=1.25):
        self.name = name
        self.energy = energy_j_per_kg
        self.density = density_kg_m3
        self.burn_rate = burn_rate_mm_s     # linear burn rate (mm/s)
        self.mol_weight = gas_molecular_weight  # g/mol
        self.flame_temp = flame_temp_K
        self.gamma = gas_gamma
        # Derived: specific gas constant
        self.R_specific = 8314 / gas_molecular_weight  # J/(kg·K)

    def exhaust_velocity(self):
        """Theoretical exhaust velocity: v_e = sqrt(2*gamma/(gamma-1) * R*T)"""
        g = self.gamma
        return np.sqrt(2 * g / (g - 1) * self.R_specific * self.flame_temp)

    def gas_volume_per_kg(self, pressure_pa):
        """Volume of gas produced per kg of propellant at given pressure."""
        return self.R_specific * self.flame_temp / pressure_pa

class Chamber:
    """Models a combustion chamber / gun barrel breech."""
    def __init__(self, volume_cm3, max_pressure_mpa):
        self.volume = volume_cm3 * 1e-6     # convert to m³
        self.max_pressure = max_pressure_mpa * 1e6  # convert to Pa
        self.gas_mass = 0.0                  # kg of gas in chamber
        self.R_gas = 300                     # effective (set by propellant)
        self.T_gas = 300                     # K (set by propellant)

    def pressure(self):
        """Current chamber pressure from ideal gas law."""
        if self.volume <= 0:
            return self.max_pressure
        return self.gas_mass * self.R_gas * self.T_gas / self.volume

    def add_gas(self, mass_kg, R, T):
        """Add combustion gas to the chamber."""
        self.gas_mass += mass_kg
        self.R_gas = R
        self.T_gas = T

    def expand(self, delta_volume_m3):
        """Expand chamber volume (projectile moves forward)."""
        self.volume += delta_volume_m3

class Projectile:
    """Models a projectile moving through a barrel."""
    def __init__(self, mass_kg, bore_diameter_mm):
        self.mass = mass_kg
        self.bore_area = np.pi * (bore_diameter_mm / 2000)**2  # m²
        self.position = 0.0    # m from breech
        self.velocity = 0.0    # m/s

    def kinetic_energy(self):
        return 0.5 * self.mass * self.velocity**2

    def momentum(self):
        return self.mass * self.velocity

# Create component library
propellants = {
    "black_powder": Propellant("Black Powder", 2700000, 1600, 10, 34, 2500),
    "corned_powder": Propellant("Corned Powder", 2700000, 1700, 25, 34, 2600),
    "smokeless": Propellant("Smokeless Powder", 5000000, 1650, 5, 26, 3200, 1.24),
}

print("=== Propellant Chemistry Simulator ===")
print("System architecture: 3 classes defined\\\n")

print(f"{'Propellant':<20} {'Energy (MJ/kg)':>14} {'v_e (m/s)':>10} {'Flame T':>8}")
print("-" * 54)
for key, p in propellants.items():
    print(f"{p.name:<20} {p.energy/1e6:>12.1f} {p.exhaust_velocity():>8.0f} {p.flame_temp:>6} K")

# Quick integration test
print("\\\n=== Component Integration Test ===")
ch = Chamber(500, 300)  # 500 cm³ chamber, 300 MPa max
pr = Projectile(2.0, 80)  # 2 kg projectile, 80mm bore
bp = propellants["black_powder"]

ch.add_gas(0.1, bp.R_specific, bp.flame_temp)
print(f"Chamber pressure after 100g charge: {ch.pressure()/1e6:.1f} MPa")
print(f"Projectile bore area: {pr.bore_area*1e6:.0f} mm²")
print(f"Force on projectile: {ch.pressure() * pr.bore_area:.0f} N")
print(f"Acceleration: {ch.pressure() * pr.bore_area / pr.mass:.0f} m/s²")
print("\\\nAll three classes working. Ready for simulation engine.")`,
      challenge: 'Add a method to Propellant called `burn_mass(surface_area_mm2, dt_seconds)` that returns the mass of propellant consumed in time dt based on burn rate and density. Use: mass = burn_rate × surface_area × density × dt (convert units carefully). This connects the propellant to the time-stepping simulation.',
      successHint: 'You designed a clean three-class architecture where each component handles its own physics. This separation makes the code testable (test each class independently), reusable (swap propellants without changing the barrel code), and extensible (add new features to one class without breaking others). This is professional software engineering.',
    },
    {
      title: 'Combustion engine — pressure buildup with gas generation',
      concept: `Now we build the **simulation engine** — the time-stepping loop that connects Propellant, Chamber, and Projectile. Each time step:

1. **Burn**: a thin layer of propellant surface converts to gas (mass = burn_rate × surface_area × density × dt)
2. **Pressurize**: the new gas enters the chamber, increasing gas_mass and therefore pressure
3. **Accelerate**: the pressure acts on the projectile's base area, creating a force F = P × A
4. **Move**: the projectile advances by v × dt, expanding the chamber volume
5. **Update**: recalculate pressure with the new (larger) volume

The critical physics: pressure RISES while gas generation exceeds volume expansion, PEAKS when they balance, and FALLS as the remaining gas expands behind the accelerating projectile.

The time step dt must be small enough to capture the rapid pressure rise (typically 1-10 microseconds). Too large and the simulation misses the pressure peak; too small and it runs slowly.

📚 *This is an explicit Euler integration — the simplest time-stepping method. At each step, we use current values to predict the next step. It's accurate when dt is small relative to the rate of change. For faster-changing processes, more sophisticated methods (Runge-Kutta) are needed.*`,
      analogy: 'Imagine filling a balloon while someone pokes a hole that gets bigger over time. At first, the hole is tiny — air fills the balloon faster than it escapes, and pressure rises. Eventually the hole is so big that air escapes as fast as you pump — peak pressure. Then the hole keeps growing and pressure drops. The barrel is the expanding "hole" — as the projectile moves, it creates more volume for the gas to fill.',
      storyConnection: 'Every Chinese cannon fired with this same pressure curve. The gunpowder burned in the breech, pressure spiked, the stone ball accelerated, and pressure dropped as the ball flew down the barrel. Ming foundry masters learned by trial and error that the barrel had to be thickest at the breech (where pressure peaks) and could taper toward the muzzle — a design principle that our simulation now explains quantitatively.',
      checkQuestion: 'If the propellant burns out when the projectile is only 10% down the barrel, what happens to the pressure in the remaining 90%?',
      checkAnswer: 'The pressure drops continuously because no new gas is generated but the volume keeps increasing as the projectile moves. The gas expands adiabatically: P × V^γ = constant. This means the projectile is still accelerating (pressure > 0), but the force decreases with each centimetre of travel. This is why barrel length has diminishing returns.',
      codeIntro: 'Build the time-stepping combustion engine and generate the pressure-velocity curve for a gunpowder charge.',
      code: `import numpy as np

class CombustionEngine:
    """Time-stepping simulation of propellant combustion in a barrel."""

    def __init__(self, charge_mass_g, propellant_energy, propellant_density,
                 burn_rate_mm_s, R_gas, T_flame,
                 chamber_vol_cm3, bore_mm, barrel_length_m,
                 projectile_mass_g):
        self.charge_total = charge_mass_g / 1000   # kg
        self.charge_left = self.charge_total
        self.energy = propellant_energy
        self.density = propellant_density
        self.burn_rate = burn_rate_mm_s / 1000      # m/s
        self.R_gas = R_gas
        self.T_flame = T_flame
        self.bore_area = np.pi * (bore_mm / 2000)**2
        self.barrel_length = barrel_length_m
        self.proj_mass = projectile_mass_g / 1000
        self.chamber_vol = chamber_vol_cm3 * 1e-6

        # State
        self.gas_mass = 0.0
        self.proj_pos = 0.0
        self.proj_vel = 0.0

    def step(self, dt):
        """Advance one time step. Returns (pressure, velocity, position)."""
        # Current volume behind projectile
        vol = self.chamber_vol + self.bore_area * max(self.proj_pos, 0.001)

        # Burn propellant (simplified: constant surface area)
        if self.charge_left > 0:
            # Mass burned this step
            surface_area = 0.01  # m² (effective grain surface)
            dm = self.burn_rate * surface_area * self.density * dt
            dm = min(dm, self.charge_left)
            self.charge_left -= dm
            self.gas_mass += dm

        # Pressure
        P = self.gas_mass * self.R_gas * self.T_flame / vol if vol > 0 else 0

        # Force and acceleration
        F = P * self.bore_area
        friction = 0.03 * F  # 3% friction
        F_net = max(F - friction, 0)
        acc = F_net / self.proj_mass

        # Update projectile
        self.proj_vel += acc * dt
        self.proj_pos += self.proj_vel * dt

        return P, self.proj_vel, self.proj_pos

    def run(self, dt=1e-6, max_steps=500000):
        """Run until projectile exits barrel."""
        pressures, velocities, positions, times = [], [], [], []

        for i in range(max_steps):
            P, v, x = self.step(dt)
            if i % 50 == 0:
                times.append(i * dt * 1000)  # ms
                pressures.append(P / 1e6)     # MPa
                velocities.append(v)
                positions.append(x * 1000)    # mm

            if x >= self.barrel_length:
                break

        return (np.array(times), np.array(pressures),
                np.array(velocities), np.array(positions), v)

# Run simulation for a Ming bronze cannon
engine = CombustionEngine(
    charge_mass_g=200, propellant_energy=2.7e6,
    propellant_density=1600, burn_rate_mm_s=25,
    R_gas=245, T_flame=2500,
    chamber_vol_cm3=500, bore_mm=80,
    barrel_length_m=1.5, projectile_mass_g=2000
)

times, pressures, velocities, positions, muzzle_v = engine.run()

print("=== Combustion Simulation: Ming Bronze Cannon ===")
print(f"Charge: 200g corned powder | Bore: 80mm | Barrel: 1.5m\\\n")

print(f"{'Time (ms)':>10} {'Pressure (MPa)':>15} {'Velocity (m/s)':>15} {'Position (mm)':>14}")
print("-" * 56)

# Print at key moments
peak_idx = np.argmax(pressures)
indices = list(range(0, len(times), max(1, len(times)//8)))
if peak_idx not in indices:
    indices.append(peak_idx)
indices.sort()

for i in indices[:10]:
    marker = " <<< PEAK" if i == peak_idx else ""
    print(f"{times[i]:>8.2f} {pressures[i]:>13.1f} {velocities[i]:>13.0f} "
          f"{positions[i]:>12.0f}{marker}")

print(f"\\\nPeak pressure: {pressures[peak_idx]:.1f} MPa at {times[peak_idx]:.2f} ms")
print(f"Muzzle velocity: {muzzle_v:.0f} m/s")
print(f"Muzzle energy: {0.5 * 2.0 * muzzle_v**2:.0f} J")
print(f"Efficiency: {0.5 * 2.0 * muzzle_v**2 / (0.2 * 2.7e6) * 100:.1f}%")`,
      challenge: 'Modify the burn model to use degressive burning (spherical grains): surface area decreases as the grain burns. Compare the pressure curve with the constant-surface model. The degressive model produces a sharper peak followed by a steeper decline — closer to real black powder behaviour.',
      successHint: 'You built a physics simulation engine from scratch — the same type of numerical integrator used in professional ballistics software, rocket engine design, and combustion modelling. The time-stepping approach (calculate state, advance dt, repeat) is the backbone of computational physics.',
    },
    {
      title: 'Ballistics calculator — muzzle velocity, range, and energy',
      concept: `The combustion engine gives us **muzzle velocity** — the projectile's speed as it exits the barrel. Now we calculate what happens after: **external ballistics**.

Three key outputs:

1. **Range** — how far the projectile travels. With no air drag: R = v² sin(2θ) / g. With drag: much shorter, requiring numerical integration.

2. **Kinetic energy** — KE = ½mv². This determines destructive power. A 2 kg stone ball at 300 m/s carries 90,000 J — enough to breach brick walls.

3. **Terminal velocity** and **impact energy** — as the projectile flies, air drag decelerates it. Impact energy is always less than muzzle energy.

The **ballistic coefficient** BC = m / (Cd × A) determines how well a projectile maintains velocity. A heavy, streamlined projectile (high BC) retains speed better than a light, blunt one (low BC).

📚 *Medieval projectiles were spherical (blunt, high drag). Modern bullets are ogival (pointed, low drag). This shape difference alone doubles or triples effective range for the same muzzle velocity.*`,
      analogy: 'Throw a baseball vs a crumpled paper ball at the same speed. The baseball flies far because it\'s dense and relatively streamlined (high ballistic coefficient). The paper ball slows rapidly because it\'s light and has high drag (low BC). A cannonball is the baseball; a fire lance\'s burning debris is the paper ball.',
      storyConnection: 'Chinese engineers experimented with projectile shapes: round stone balls, iron balls, ceramic bombs filled with gunpowder (early grenades), and even rockets. Each had different ballistic characteristics. Round stone balls were cheap but had terrible aerodynamics. Iron balls were denser and carried more energy at impact. The trade-offs drove centuries of weapon development.',
      checkQuestion: 'A 2 kg iron ball and a 2 kg stone ball are fired at the same muzzle velocity. Which hits harder at 500 m range?',
      checkAnswer: 'The iron ball. Iron is denser, so the ball is smaller (less drag area) for the same mass. Its ballistic coefficient is higher, meaning it retains more velocity over distance. At 500 m, the iron ball might retain 70% of its muzzle velocity while the larger stone ball retains only 40%.',
      codeIntro: 'Build a ballistics calculator that computes range, impact energy, and trajectory for different projectile types.',
      code: `import numpy as np

def trajectory(v0, angle_deg, mass_kg, diameter_mm, Cd=0.47,
               dt=0.01, max_time=120):
    """
    Simulate projectile trajectory with air drag.
    Returns arrays of (x, y, t, v) and impact data.
    """
    angle = np.radians(angle_deg)
    vx = v0 * np.cos(angle)
    vy = v0 * np.sin(angle)
    x, y = 0.0, 0.0
    rho_air = 1.225  # kg/m³
    area = np.pi * (diameter_mm / 2000)**2  # m²

    xs, ys, ts, vs = [x], [y], [0], [v0]

    for step in range(1, int(max_time / dt)):
        t = step * dt
        v = np.sqrt(vx**2 + vy**2)
        if v < 0.1:
            break

        # Drag force
        F_drag = 0.5 * rho_air * Cd * area * v**2
        ax_drag = -F_drag * vx / (v * mass_kg)
        ay_drag = -F_drag * vy / (v * mass_kg)

        # Update velocity (drag + gravity)
        vx += ax_drag * dt
        vy += (ay_drag - 9.81) * dt

        # Update position
        x += vx * dt
        y += vy * dt

        if step % 10 == 0:
            xs.append(x)
            ys.append(y)
            ts.append(t)
            vs.append(v)

        # Impact
        if y < 0 and step > 1:
            impact_v = np.sqrt(vx**2 + vy**2)
            impact_ke = 0.5 * mass_kg * impact_v**2
            return (np.array(xs), np.array(ys), np.array(ts),
                    np.array(vs), x, impact_v, impact_ke)

    return (np.array(xs), np.array(ys), np.array(ts),
            np.array(vs), x, 0, 0)

# Compare projectile types
projectiles = [
    {"name": "Stone ball (2 kg)",  "mass": 2.0,  "diam": 80, "v0": 250},
    {"name": "Iron ball (4 kg)",   "mass": 4.0,  "diam": 60, "v0": 200},
    {"name": "Lead ball (6 kg)",   "mass": 6.0,  "diam": 55, "v0": 180},
    {"name": "Musket ball (30g)",  "mass": 0.03, "diam": 18, "v0": 400},
    {"name": "Grapeshot (0.5 kg)", "mass": 0.5,  "diam": 40, "v0": 300},
]

angles = [30, 45, 60]

print("=== Ballistics Calculator ===\\\n")
print(f"{'Projectile':<22} {'Angle':>6} {'Range (m)':>10} {'Impact v':>10} "
      f"{'Impact E (kJ)':>14} {'BC':>6}")
print("-" * 70)

for p in projectiles:
    area = np.pi * (p["diam"] / 2000)**2
    BC = p["mass"] / (0.47 * area)

    for angle in angles:
        xs, ys, ts, vs, rng, imp_v, imp_ke = trajectory(
            p["v0"], angle, p["mass"], p["diam"])
        print(f"{p['name']:<22} {angle:>4}° {rng:>8.0f} {imp_v:>8.0f} m/s "
              f"{imp_ke/1000:>12.1f} {BC:>6.0f}")
    print()

# Optimal angle analysis
print("=== Optimal Launch Angle (Iron ball, 4 kg) ===")
best_range, best_angle = 0, 0
for a in range(15, 76):
    _, _, _, _, rng, _, _ = trajectory(200, a, 4.0, 60)
    if rng > best_range:
        best_range, best_angle = rng, a

print(f"Optimal angle: {best_angle}° (range: {best_range:.0f} m)")
print("Note: with drag, optimal angle < 45° (unlike vacuum trajectory)")
print("because lower angles spend less time in the air = less drag.")`,
      challenge: 'Add a "wall penetration" model: if the impact energy exceeds a threshold (e.g., 50 kJ for brick, 200 kJ for stone), the projectile breaches the wall. For each projectile type, calculate the maximum range at which it can still breach a brick wall. This is the "effective range" — the military-relevant number.',
      successHint: 'You built an external ballistics simulator with air drag — the same physics used by every military and sporting ballistics program. The trajectory integrator, ballistic coefficient, and energy calculation are standard tools in weapon design, forensic science, and even golf ball engineering.',
    },
    {
      title: 'Weapon comparison tool — fire lance vs cannon vs rocket',
      concept: `Now we bring everything together into a **weapon comparison tool** that evaluates three historical Chinese gunpowder weapons across multiple performance dimensions:

1. **Fire lance** (12th century) — open-ended tube, low pressure, short range, used as a flamethrower/shotgun
2. **Cannon** (13th century) — sealed breech, high pressure, long range, fires a single heavy projectile
3. **Rocket** (13th century) — self-propelled, no barrel needed, moderate range, area effect

Each weapon has different strengths: the fire lance is cheap and terrifying at close range; the cannon has maximum single-target destructive power; the rocket has the best range-to-weight ratio and can be mass-produced.

The comparison uses a **multi-criteria decision matrix** — scoring each weapon on lethality, range, cost, portability, rate of fire, and reliability. The "best" weapon depends on the **mission**: defending a fortress wall, attacking a field army, or besieging a city.

📚 *Multi-criteria decision analysis (MCDA) is used in engineering, business, and policy whenever you must choose between options that are better in different ways. There is rarely a single "best" — only the best for a given set of priorities.*`,
      analogy: 'Choosing between a fire lance, cannon, and rocket is like choosing between a sports car, a truck, and a motorcycle. The sports car is fastest (cannon = most power). The truck carries the most cargo (fire lance = most versatile at close range). The motorcycle is lightest and cheapest (rocket = best portability). The "best" depends on what you need to do.',
      storyConnection: 'The Song and Ming dynasties deployed all three weapon types simultaneously — recognising that each excelled in different situations. Fire lances defended city gates against infantry assault. Cannons breached enemy walls. Rockets were launched in salvos against massed formations. This combined-arms approach was the most sophisticated military doctrine of the medieval world.',
      checkQuestion: 'A fortress needs to defend against infantry at 50 m and cavalry at 500 m. Which weapon(s) should it deploy?',
      checkAnswer: 'Both: fire lances for the 50 m infantry threat (devastating at close range, fast rate of fire, doesn\'t need accuracy) and cannons for the 500 m cavalry threat (long range, heavy projectile to break a charge). Rockets could supplement at 200-400 m range with area-effect salvos. Each weapon covers a different engagement zone.',
      codeIntro: 'Build a multi-criteria weapon comparison tool and evaluate Chinese gunpowder weapons for different missions.',
      code: `import numpy as np

class Weapon:
    """Models a gunpowder weapon's performance characteristics."""
    def __init__(self, name, era, max_range_m, rate_of_fire,
                 projectile_energy_j, weight_kg, cost_index,
                 reliability, accuracy):
        self.name = name
        self.era = era
        self.range = max_range_m
        self.rof = rate_of_fire        # rounds per minute
        self.energy = projectile_energy_j
        self.weight = weight_kg
        self.cost = cost_index          # 1-10 (10 = most expensive)
        self.reliability = reliability  # 0-1
        self.accuracy = accuracy        # 0-1

    def firepower_index(self):
        """Sustained damage output = rate × energy × accuracy × reliability"""
        return self.rof * self.energy * self.accuracy * self.reliability

    def mobility_index(self):
        """Lighter = more mobile. Inverse of weight, normalised."""
        return 100 / self.weight

    def cost_effectiveness(self):
        """Firepower per unit cost."""
        return self.firepower_index() / self.cost

weapons = [
    Weapon("Fire lance",       "12th c.", 3,    6, 500,    2, 1, 0.7, 0.3),
    Weapon("Hand cannon",      "13th c.", 50,   2, 2000,   5, 3, 0.6, 0.2),
    Weapon("Bronze field gun",  "14th c.", 800,  0.5, 90000, 500, 8, 0.8, 0.4),
    Weapon("Siege bombard",    "15th c.", 500,  0.1, 500000, 5000, 10, 0.7, 0.3),
    Weapon("Rocket (salvo)",   "13th c.", 400,  10, 3000,  15, 2, 0.5, 0.15),
    Weapon("Hwacha launcher",  "15th c.", 500,  100, 1000,  200, 5, 0.6, 0.1),
]

print("=== Chinese Gunpowder Weapons Comparison ===\\\n")
print(f"{'Weapon':<22} {'Era':>8} {'Range':>7} {'RoF':>5} {'Energy':>8} "
      f"{'Weight':>7} {'Rel':>5} {'Acc':>5}")
print("-" * 69)
for w in weapons:
    print(f"{w.name:<22} {w.era:>8} {w.range:>5}m {w.rof:>4}/m "
          f"{w.energy:>7} J {w.weight:>5}kg {w.reliability:>4.0%} {w.accuracy:>4.0%}")

# Multi-criteria scoring
print("\\\n=== Performance Indices ===")
print(f"{'Weapon':<22} {'Firepower':>10} {'Mobility':>10} {'Cost-Eff':>10}")
print("-" * 54)
for w in weapons:
    fp = w.firepower_index()
    mob = w.mobility_index()
    ce = w.cost_effectiveness()
    print(f"{w.name:<22} {fp:>10.0f} {mob:>10.1f} {ce:>10.0f}")

# Mission-specific scoring
missions = {
    "Fortress defence (close)": {"range": 0.1, "rof": 0.3, "energy": 0.2,
                                  "mobility": 0.1, "cost": 0.2, "reliability": 0.1},
    "Field battle (medium)":    {"range": 0.2, "rof": 0.2, "energy": 0.2,
                                  "mobility": 0.2, "cost": 0.1, "reliability": 0.1},
    "Siege attack (long)":      {"range": 0.1, "rof": 0.05, "energy": 0.5,
                                  "mobility": 0.05, "cost": 0.1, "reliability": 0.2},
}

print("\\\n=== Mission-Specific Ranking ===")
for mission, weights in missions.items():
    print(f"\\\n{mission}:")
    scores = []
    for w in weapons:
        # Normalise each attribute to 0-1 range
        max_range = max(wp.range for wp in weapons)
        max_rof = max(wp.rof for wp in weapons)
        max_energy = max(wp.energy for wp in weapons)
        max_weight = max(wp.weight for wp in weapons)
        max_cost = max(wp.cost for wp in weapons)

        score = (weights["range"] * w.range / max_range +
                 weights["rof"] * w.rof / max_rof +
                 weights["energy"] * w.energy / max_energy +
                 weights["mobility"] * (1 - w.weight / max_weight) +
                 weights["cost"] * (1 - w.cost / max_cost) +
                 weights["reliability"] * w.reliability)
        scores.append((w.name, score))

    scores.sort(key=lambda x: x[1], reverse=True)
    for rank, (name, score) in enumerate(scores, 1):
        marker = " <<<" if rank == 1 else ""
        print(f"  {rank}. {name:<22} Score: {score:.3f}{marker}")`,
      challenge: 'Add a "technology timeline" analysis: for each century (12th-16th), determine which weapon type dominated based on the available technology. How did the introduction of each new weapon type change military doctrine? This connects engineering to history.',
      successHint: 'Multi-criteria decision analysis is used everywhere: choosing materials in engineering, selecting drug candidates in pharma, evaluating policy options in government, and picking investments in finance. The skill is defining the criteria, weighting them appropriately, and being transparent about the trade-offs.',
    },
    {
      title: 'Documentation and portfolio — the Propellant Chemistry Simulator',
      concept: `Your Propellant Chemistry Simulator is complete. The final step is **documentation** — a clear, structured record of what you built and what it demonstrates.

A complete engineering portfolio project includes:

1. **Problem statement** — what question are you answering?
2. **System architecture** — what classes and modules, and how do they connect?
3. **Physics models** — what equations drive the simulation? What are the assumptions?
4. **Results** — what did the simulator reveal about gunpowder weapons?
5. **Validation** — how do your results compare with historical data?
6. **Limitations** — what does the model NOT capture?
7. **Skills demonstrated** — what did you learn and practice?

This documentation serves two purposes: it helps others understand your work, and it helps YOU understand it deeply. The act of explaining forces clarity of thought.

📚 *Richard Feynman: "If you can't explain it simply, you don't understand it well enough." Documentation is not a chore after the real work — it IS the real work of making your understanding complete and communicable.*`,
      analogy: 'A scientist who runs an experiment but doesn\'t publish the results has contributed nothing to science. A programmer who writes code but doesn\'t document it has created a tool nobody else can use. Documentation transforms personal knowledge into shared knowledge — it\'s the difference between a notebook sketch and an engineering drawing.',
      storyConnection: 'The *Wujing Zongyao* (1044 CE) — the Chinese military encyclopedia — documented gunpowder formulas, weapon designs, and tactical applications in meticulous detail. This document preserved knowledge across centuries and allowed later engineers to build on earlier work. Without it, each generation would have had to rediscover gunpowder from scratch.',
      checkQuestion: 'Your simulator predicts a muzzle velocity of 280 m/s for a Ming cannon. Historical estimates suggest 200-350 m/s. Is your model validated?',
      checkAnswer: 'Partially. Your result falls within the historical range, which is encouraging. But the range is wide (200-350 m/s), so the validation is weak — your model could be right for the wrong reasons. Stronger validation would compare specific barrel dimensions, charge weights, and projectile masses with documented historical weapons and their measured performance.',
      codeIntro: 'Generate the complete documentation for the Propellant Chemistry Simulator capstone project.',
      code: `import numpy as np

print("""
================================================================
        PROPELLANT CHEMISTRY SIMULATOR
            Project Documentation
================================================================

1. PROBLEM STATEMENT
--------------------
How did Chinese gunpowder weapon performance evolve from the
12th to the 16th century? What physics determines the
differences between fire lances, cannons, and rockets?

This simulator models the complete chain from chemical
combustion to projectile impact, enabling quantitative
comparison of historical weapon systems.

2. SYSTEM ARCHITECTURE
----------------------
Three core classes with clear separation of concerns:

  Propellant ─── stores chemistry ─── energy, burn rate, gas
       │                                properties
       ▼
  Chamber ────── models confinement ── volume, pressure, gas
       │                                accumulation
       ▼
  Projectile ─── tracks motion ─────── mass, velocity, position,
                                        trajectory

Simulation engine: explicit Euler time-stepping at 1μs
  resolution, connecting all three classes.

3. PHYSICS MODELS
-----------------
  a) Thermochemistry (Level 2):
     ΔH_rxn via Hess's law from formation enthalpies
     Energy density: ~2,700 J/g for black powder

  b) Gas dynamics (Level 2):
     Van der Waals corrections at high pressure
     Compressibility factor Z > 1 above ~50 MPa

  c) Internal ballistics (Level 2):
     Pressure-time curve from gas generation vs volume expansion
     Peak pressure: 50-300 MPa depending on charge/bore ratio

  d) External ballistics (Level 4):
     Trajectory with quadratic air drag
     Ballistic coefficient: BC = m / (Cd × A)

  e) Detonation theory (Level 3):
     Chapman-Jouguet velocity for explosive comparison
     Deflagration vs detonation distinction

4. KEY RESULTS
--------------
""")

# Generate summary results
weapons_data = [
    ("Fire lance",     3,   500,   "Close-range shock weapon"),
    ("Hand cannon",    50,  2000,  "Personal firearm"),
    ("Field cannon",   800, 90000, "Battlefield dominance"),
    ("Siege bombard",  500, 500000,"Fortification breaker"),
    ("Rocket (salvo)", 400, 3000,  "Area denial weapon"),
]

print(f"  {'Weapon':<18} {'Range (m)':>10} {'Energy (J)':>12} {'Role':<28}")
print(f"  {'-'*70}")
for name, rng, energy, role in weapons_data:
    print(f"  {name:<18} {rng:>8} {energy:>10,} {role:<28}")

print("""
  Key finding: the sealed barrel was the decisive innovation.
  Fire lances (open) delivered ~500 J. Cannons (sealed)
  delivered 90,000+ J — a 180× increase from the same
  chemical energy source.

5. HISTORICAL VALIDATION
-------------------------
  Predicted muzzle velocities: 200-350 m/s (Ming cannon)
  Historical estimates: 200-350 m/s — consistent

  Predicted max range (45°): 800-1200 m
  Historical records: "several hundred paces" (~500-1000 m)
  Within expected range given our simplified drag model.

6. LIMITATIONS
--------------
  - Simplified burn model (constant surface area)
  - Ideal gas law (van der Waals corrections shown but not
    integrated into main simulation)
  - No barrel heating or erosion effects
  - Spherical projectiles only (no spin stabilisation)
  - No wind or atmospheric variation
  - Single-point ignition (real ignition is complex)

7. SKILLS DEMONSTRATED
----------------------""")

skills = [
    ("Object-oriented design",    "3 classes with clean interfaces"),
    ("Numerical simulation",      "Euler integration, time-stepping"),
    ("Thermochemistry",           "Hess's law, enthalpy calculations"),
    ("Gas dynamics",              "Ideal gas, van der Waals corrections"),
    ("Internal ballistics",       "Pressure-time curves, muzzle velocity"),
    ("External ballistics",       "Trajectory with drag, impact energy"),
    ("Monte Carlo methods",       "Siege warfare, diffusion modelling"),
    ("Network analysis",          "Silk Road technology diffusion graph"),
    ("Multi-criteria analysis",   "Weapon comparison decision matrix"),
    ("Technical documentation",   "Structured report with validation"),
]

for skill, detail in skills:
    print(f"  {skill:<28} {detail}")

print("""
================================================================
  Complete capstone: 4 levels, 20 mini-lessons,
  from 9th-century alchemy to computational ballistics.
================================================================
""")`,
      challenge: 'Add a "what-if" section to the documentation: if Chinese engineers had discovered smokeless powder (5 MJ/kg instead of 2.7 MJ/kg) in the 14th century, how would weapon performance have changed? Run the simulation with smokeless powder parameters and document the difference. This is counterfactual analysis — a powerful tool for understanding why history unfolded the way it did.',
      successHint: 'You have completed a full engineering capstone project: problem definition, system design, implementation, simulation, analysis, comparison, and documentation. This is exactly the workflow of professional engineers and computational scientists. The Propellant Chemistry Simulator demonstrates real skills in physics, programming, and technical communication — skills that transfer directly to aerospace, materials science, chemical engineering, and computational modelling.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Propellant Chemistry Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Propellant Chemistry Simulator.
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
            id={`L4-${i + 1}`}
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
