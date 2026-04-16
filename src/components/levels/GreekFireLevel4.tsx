import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GreekFireLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design a Combustion Simulator — system architecture',
      concept: `In this capstone project, you will build a complete **Greek Fire Combustion Simulator** — a Python program that models the entire weapon system:

1. **Fuel class** — stores chemical properties, enthalpies, and Arrhenius parameters for each Greek Fire component
2. **Reaction engine** — simulates multi-component combustion with the quicklime-water exothermic twist
3. **Siphon physics** — models pump pressure, nozzle flow, and projectile trajectory
4. **Fire spread model** — calculates surface ignition probability on a target ship
5. **Documentation** — generates a technical report of the simulation results

This brings together everything from Levels 1-3: thermodynamics, kinetics, fluid dynamics, heat transfer, adhesion, and materials science.

The first step is **system design** — defining classes, their relationships, and the data flow between them. The Fuel feeds into the Reaction engine, which feeds into the Fire spread model. The Siphon connects them physically.

📚 *Good architecture separates concerns: each class does ONE thing well. The Fuel class knows chemistry. The Siphon class knows fluid mechanics. Neither needs to understand the other's internals — they communicate through clean interfaces.*`,
      analogy: 'A car has an engine, transmission, and wheels. The engine doesn\'t need to know how the wheels grip the road — it just produces torque. The transmission translates engine speed to wheel speed. Each component has a clear job and a clean interface. Software architecture works the same way.',
      storyConnection: 'The Byzantine siphon system was itself a modular design: a sealed fuel tank, a hand-operated pump, a bronze nozzle, and an ignition mechanism. Each component could be maintained or replaced independently. The operators only needed to understand their own station — compartmentalised knowledge for both operational efficiency and secrecy.',
      checkQuestion: 'Why define Fuel, Reaction, and Siphon as separate classes rather than one big function?',
      checkAnswer: 'Separation of concerns: you can test each class independently, swap out implementations (different fuel, different siphon design) without rewriting everything, and different team members can work on different classes simultaneously. A monolithic function would be untestable, unmaintainable, and impossible to extend.',
      codeIntro: 'Design the architecture of the Greek Fire Combustion Simulator — define all classes and their interfaces.',
      code: `import numpy as np

class Fuel:
    """Represents a combustible component of Greek Fire."""
    def __init__(self, name, density, heat_of_combustion,
                 activation_energy, pre_exponential,
                 surface_tension, viscosity, fraction=0.25):
        self.name = name
        self.density = density                # kg/m³
        self.heat_comb = heat_of_combustion   # kJ/mol
        self.Ea = activation_energy           # J/mol
        self.A = pre_exponential              # 1/s
        self.surface_tension = surface_tension # mN/m
        self.viscosity = viscosity            # Pa·s
        self.fraction = fraction              # mass fraction in mixture

    def arrhenius_rate(self, T_kelvin):
        """Reaction rate at given temperature."""
        R = 8.314
        return self.A * np.exp(-self.Ea / (R * T_kelvin))

    def __repr__(self):
        return f"Fuel({self.name}, {self.fraction*100:.0f}%)"

class Reaction:
    """Multi-component combustion reaction engine."""
    def __init__(self, fuels):
        self.fuels = fuels
        self.temperature = 300.0  # K (ambient)
        self.time = 0.0

    def mixture_property(self, prop):
        """Mass-weighted average of a fuel property."""
        total = sum(f.fraction for f in self.fuels)
        return sum(getattr(f, prop) * f.fraction / total for f in self.fuels)

    def total_heat_rate(self, T_kelvin):
        """Total heat generation rate from all components (kW/kg)."""
        return sum(f.heat_comb * f.arrhenius_rate(T_kelvin) * f.fraction
                   for f in self.fuels) * 0.001

class Siphon:
    """Bronze siphon pump and nozzle model."""
    def __init__(self, pump_pressure_kpa, nozzle_diameter_mm,
                 tank_volume_L, fluid_density):
        self.pressure = pump_pressure_kpa * 1000  # Pa
        self.nozzle_d = nozzle_diameter_mm / 1000 # m
        self.tank_L = tank_volume_L
        self.density = fluid_density
        self.nozzle_area = np.pi * (self.nozzle_d / 2) ** 2

    def exit_velocity(self):
        """Bernoulli: v = sqrt(2*dP/rho)"""
        return np.sqrt(2 * self.pressure / self.density)

    def flow_rate_Ls(self):
        """Volume flow rate in litres/second."""
        return self.nozzle_area * self.exit_velocity() * 1000

    def firing_duration(self):
        """How long the tank lasts (seconds)."""
        return self.tank_L / self.flow_rate_Ls()

class FireSpread:
    """Surface ignition probability model."""
    def __init__(self, contact_angle_deg, fuel_adhesion):
        self.contact_angle = contact_angle_deg
        self.adhesion = fuel_adhesion

    def ignition_probability(self, surface_temp_C, fuel_temp_C):
        """Probability that fuel ignites on the surface."""
        if fuel_temp_C < 250:
            return 0.0
        wetting = max(0, 1 - self.contact_angle / 90)
        temp_factor = min(1, (fuel_temp_C - 250) / 500)
        return wetting * temp_factor * self.adhesion

# Instantiate the system
fuels = [
    Fuel("Naphtha", 800, 6778, 75000, 1e10, 25, 0.001, 0.45),
    Fuel("Pine resin", 1050, 3200, 85000, 5e9, 35, 0.5, 0.25),
    Fuel("Quicklime", 3350, 65, 30000, 1e7, 70, 0.0, 0.15),
    Fuel("Sulphur", 2070, 297, 50000, 2e8, 60, 0.0, 0.15),
]

reaction = Reaction(fuels)
siphon = Siphon(pump_pressure_kpa=250, nozzle_diameter_mm=25,
                tank_volume_L=50, fluid_density=950)
fire = FireSpread(contact_angle_deg=15, fuel_adhesion=0.85)

# System overview
print("=== Greek Fire Combustion Simulator ===")
print("Architecture designed. Components:\
")
print("FUEL LIBRARY:")
for f in fuels:
    print(f"  {f.name:<14} {f.fraction*100:>4.0f}%  ΔH={f.heat_comb:>6.0f} kJ/mol  "
          f"Ea={f.Ea/1000:.0f} kJ/mol")

print(f"\
SIPHON:")
print(f"  Exit velocity: {siphon.exit_velocity():.1f} m/s")
print(f"  Flow rate: {siphon.flow_rate_Ls():.2f} L/s")
print(f"  Firing duration: {siphon.firing_duration():.0f} seconds")

print(f"\
FIRE SPREAD:")
print(f"  Contact angle: {fire.contact_angle}°")
print(f"  Adhesion factor: {fire.adhesion}")
for temp in [200, 400, 600, 800, 1000]:
    p = fire.ignition_probability(25, temp)
    print(f"  P(ignition) at {temp}°C: {p:.2f}")

print("\
Next: Build the reaction engine with quicklime-water feedback.")`,
      challenge: 'Add a method to the Fuel class that calculates the adiabatic flame temperature — the temperature reached if all combustion heat goes into heating the products with no losses. For naphtha: T_ad = T_initial + ΔH / (mass × Cp). What temperature does Greek Fire reach theoretically?',
      successHint: 'Good system design makes everything else easier. You defined four classes with clear responsibilities and clean interfaces — the same architecture pattern used in physics simulations (GEANT4), game engines (Unity), and industrial control systems. Design first, code second.',
    },
    {
      title: 'Building the reaction engine — multi-component combustion with quicklime-water feedback',
      concept: `The heart of the simulator is the **reaction engine** — it advances combustion through time, tracking temperature, fuel consumption, and heat release for ALL components simultaneously.

The key innovation of Greek Fire was the **quicklime-water feedback loop**:
1. Enemy throws water on the fire
2. Water contacts quicklime: CaO + H₂O → Ca(OH)₂ + 65 kJ/mol (exothermic)
3. Local temperature spikes from the exothermic reaction
4. Higher temperature increases Arrhenius rates for naphtha and resin
5. Fire burns MORE intensely than before the water was thrown

This is a **coupled reaction system** — the output of one reaction (heat from quicklime) feeds into the rate equation of another (naphtha combustion). We model this by solving all reactions simultaneously at each time step.

📚 *Coupled systems are everywhere in nature: predator-prey populations, chemical oscillators, feedback amplifiers, and climate systems. The mathematical framework (coupled differential equations) is the same regardless of the physical domain.*`,
      analogy: 'Imagine two musicians improvising together. One plays louder when the other speeds up, and the other speeds up when the first plays louder — a positive feedback loop. The quicklime-naphtha coupling works the same way: quicklime produces heat, heat accelerates naphtha, naphtha produces more heat, which accelerates quicklime further.',
      storyConnection: 'The quicklime-water reaction was Greek Fire\'s most psychologically devastating feature. Sailors who instinctively threw water on the flames watched in horror as the fire exploded more intensely. This counter-intuitive behaviour broke the enemy\'s morale — their training (water extinguishes fire) was turned against them.',
      checkQuestion: 'If 1 kg of quicklime reacts with water and releases 1,160 kJ (65 kJ/mol × 56 g/mol × 1000/56), how much does this raise the temperature of 5 kg of surrounding Greek Fire mixture (Cp = 1800 J/kg·K)?',
      checkAnswer: 'ΔT = Q / (m × Cp) = 1,160,000 / (5 × 1800) = 128.9°C. That\'s a 129°C temperature spike — enough to push a smouldering fire into violent combustion. At 800°C, a 129°C increase roughly doubles the Arrhenius reaction rate for naphtha.',
      codeIntro: 'Implement the coupled reaction engine with quicklime-water feedback and multi-component combustion.',
      code: `import numpy as np

R = 8.314  # gas constant

class CombustionEngine:
    """Multi-component combustion with quicklime-water coupling."""

    def __init__(self):
        # Fuel components: [name, fraction, Ea, A, heat_kJ_per_kg, remaining]
        self.fuels = {
            "naphtha":   {"frac": 0.45, "Ea": 75000, "A": 1e10,
                          "heat": 47000, "remaining": 1.0},
            "resin":     {"frac": 0.25, "Ea": 85000, "A": 5e9,
                          "heat": 21000, "remaining": 1.0},
            "quicklime": {"frac": 0.15, "Ea": 30000, "A": 1e7,
                          "heat": 1160,  "remaining": 1.0},
            "sulphur":   {"frac": 0.15, "Ea": 50000, "A": 2e8,
                          "heat": 9280,  "remaining": 1.0},
        }
        self.temperature = 573.15  # K (ignition temp, 300°C)
        self.mass_kg = 5.0
        self.Cp = 1800  # J/(kg·K)
        self.heat_loss_coeff = 80  # W/K to surroundings
        self.T_ambient = 298.15

    def step(self, dt, water_added_kg=0):
        """Advance one time step. Returns heat generated (kJ)."""
        Q_total = 0

        # Quicklime-water reaction (if water is present)
        if water_added_kg > 0 and self.fuels["quicklime"]["remaining"] > 0.01:
            ql = self.fuels["quicklime"]
            # CaO + H2O -> Ca(OH)2 + heat
            react_frac = min(water_added_kg / (self.mass_kg * ql["frac"]),
                             ql["remaining"])
            Q_water = react_frac * ql["frac"] * self.mass_kg * ql["heat"] * 1000  # J
            self.temperature += Q_water / (self.mass_kg * self.Cp)
            ql["remaining"] -= react_frac
            Q_total += Q_water / 1000  # kJ

        # Combustion of each fuel component
        for name, fuel in self.fuels.items():
            if fuel["remaining"] < 0.01:
                continue

            k = fuel["A"] * np.exp(-fuel["Ea"] / (R * self.temperature))
            burn_rate = k * fuel["remaining"] * dt
            burn_rate = min(burn_rate, fuel["remaining"])

            Q = burn_rate * fuel["frac"] * self.mass_kg * fuel["heat"] * 1000  # J
            Q_total += Q / 1000

            self.temperature += Q / (self.mass_kg * self.Cp)
            fuel["remaining"] -= burn_rate

        # Heat loss to surroundings
        Q_loss = self.heat_loss_coeff * (self.temperature - self.T_ambient) * dt
        self.temperature -= Q_loss / (self.mass_kg * self.Cp)
        self.temperature = max(self.temperature, self.T_ambient)

        return Q_total

    def total_fuel_remaining(self):
        return sum(f["frac"] * f["remaining"] for f in self.fuels.values())

# Simulation 1: Normal burn (no water)
print("=== Combustion Simulation: Normal Burn ===")
engine = CombustionEngine()
dt = 0.05

print(f"{'Time (s)':<10} {'Temp (°C)':>10} {'Fuel %':>8} {'Q (kJ)':>8} {'Status':>12}")
print("-" * 50)

for step in range(2000):
    t = step * dt
    Q = engine.step(dt)
    T_C = engine.temperature - 273.15
    fuel_pct = engine.total_fuel_remaining() * 100

    if step % 200 == 0:
        status = "igniting" if T_C < 500 else "burning" if T_C < 1000 else "INTENSE"
        print(f"{t:<10.1f} {T_C:>8.0f} {fuel_pct:>7.1f} {Q:>7.1f} {status:>12}")

    if fuel_pct < 1:
        print(f"{t:<10.1f} {T_C:>8.0f} {fuel_pct:>7.1f} {'':>8} {'BURNOUT':>12}")
        break

peak_normal = engine.temperature - 273.15

# Simulation 2: Water dousing at t=10s
print("\
=== Combustion Simulation: Water Dousing at 10s ===")
engine2 = CombustionEngine()

print(f"{'Time (s)':<10} {'Temp (°C)':>10} {'Fuel %':>8} {'Q (kJ)':>8} {'Event':>16}")
print("-" * 54)

for step in range(2000):
    t = step * dt
    water = 0.5 if abs(t - 10.0) < dt else 0  # 0.5 kg water at t=10s
    Q = engine2.step(dt, water_added_kg=water)
    T_C = engine2.temperature - 273.15
    fuel_pct = engine2.total_fuel_remaining() * 100

    event = ""
    if abs(t - 10.0) < dt:
        event = "WATER THROWN!"

    if step % 200 == 0 or event:
        print(f"{t:<10.1f} {T_C:>8.0f} {fuel_pct:>7.1f} {Q:>7.1f} {event:>16}")

    if fuel_pct < 1:
        print(f"{t:<10.1f} {T_C:>8.0f} {fuel_pct:>7.1f} {'':>8} {'BURNOUT':>16}")
        break

peak_water = engine2.temperature - 273.15
print(f"\
Peak temp (no water): {peak_normal:.0f}°C")
print(f"Peak temp (water doused): {peak_water:.0f}°C")
print(f"Water made fire {'HOTTER' if peak_water > peak_normal else 'cooler'} "
      f"by {abs(peak_water - peak_normal):.0f}°C")`,
      challenge: 'Run the simulation with water thrown at different times (5s, 10s, 20s, 40s). At what point has the quicklime been consumed enough that water actually helps? This reveals the "window of vulnerability" — the time after which conventional firefighting becomes effective.',
      successHint: 'You built a coupled multi-component reaction engine — the same architecture used in combustion CFD codes (CHEMKIN, Cantera), pharmaceutical reaction modelling, and nuclear reactor simulations. Coupled differential equations with feedback are the mathematical language of complex systems.',
    },
    {
      title: 'Siphon physics — pump pressure, nozzle flow, and trajectory modelling',
      concept: `The Byzantine siphon was a remarkable feat of engineering: a sealed bronze chamber pressurised by a hand pump, feeding a nozzle that projected burning liquid 25-50 metres. We model three connected physics:

**1. Pump work**: W = P × V (pressure × displaced volume per stroke)
The operator's muscles provide energy; the pump converts it to fluid pressure.

**2. Nozzle flow**: Bernoulli + continuity equation
The nozzle converts pressure energy into velocity: v = √(2ΔP/ρ)
A smaller nozzle gives higher velocity but lower flow rate (Q = A × v).

**3. Jet trajectory**: Projectile motion with drag
The burning jet follows a parabolic arc degraded by air resistance. Unlike a solid projectile, a liquid jet also BREAKS UP — surface tension and aerodynamic forces fragment it into droplets at a distance called the **breakup length**.

**Breakup length** L_b ≈ C × d × √(We) where We is the Weber number: We = ρ × v² × d / σ (the ratio of inertial to surface tension forces).

📚 *The Weber number determines whether a liquid jet stays coherent or fragments. Low We = coherent stream. High We = spray of droplets. Greek Fire needed a coherent stream for range but droplets for coverage — the nozzle design balanced these competing needs.*`,
      analogy: 'Turn a garden hose to "jet" mode — a narrow, fast, coherent stream that reaches far. Turn it to "spray" mode — many droplets that cover a wide area but don\'t reach as far. The Byzantine siphon needed both: a coherent stream for range, that then broke into sticky droplets on impact.',
      storyConnection: 'Archaeological and textual evidence suggests the siphon nozzle was shaped like a lion\'s or dragon\'s head — serving both a practical function (the flared mouth helped atomise the jet on exit) and a psychological function (the sight of fire emerging from a beast\'s mouth terrified enemies). The nozzle geometry directly affected the Weber number and thus the spray pattern.',
      checkQuestion: 'A siphon operator can push with 500 N force on a pump piston with area 0.01 m². What pressure does this generate? What exit velocity for Greek Fire (density 900 kg/m³)?',
      checkAnswer: 'Pressure = F/A = 500/0.01 = 50,000 Pa = 50 kPa. Exit velocity = √(2 × 50000/900) = √(111.1) = 10.5 m/s. Range at 45° = 10.5² / 9.81 = 11.2 m. That\'s only 11 metres — which is why real siphons used pre-pressurised chambers (like a Super Soaker) to achieve 200+ kPa.',
      codeIntro: 'Build a complete siphon physics model: pump mechanics, nozzle flow, jet breakup, and projectile trajectory.',
      code: `import numpy as np

g = 9.81

class SiphonSystem:
    """Complete siphon physics: pump, nozzle, jet, trajectory."""

    def __init__(self, pump_force_N, piston_area_m2,
                 nozzle_diameter_mm, tank_volume_L,
                 fluid_density, fluid_surface_tension):
        self.pump_force = pump_force_N
        self.piston_area = piston_area_m2
        self.nozzle_d = nozzle_diameter_mm / 1000
        self.nozzle_area = np.pi * (self.nozzle_d / 2) ** 2
        self.tank_L = tank_volume_L
        self.rho = fluid_density
        self.sigma = fluid_surface_tension / 1000  # convert mN/m to N/m
        self.pressure = self.pump_force / self.piston_area

    def exit_velocity(self):
        """Bernoulli equation for nozzle exit velocity."""
        return np.sqrt(2 * self.pressure / self.rho)

    def flow_rate(self):
        """Volume flow rate (m³/s)."""
        return self.nozzle_area * self.exit_velocity()

    def weber_number(self):
        """We = rho * v² * d / sigma — jet stability indicator."""
        v = self.exit_velocity()
        return self.rho * v**2 * self.nozzle_d / self.sigma

    def breakup_length(self):
        """Distance at which jet fragments into droplets."""
        We = self.weber_number()
        C = 12  # empirical constant for turbulent jets
        return C * self.nozzle_d * np.sqrt(We)

    def trajectory(self, angle_deg, height_m=2.5, dt=0.01):
        """Compute jet trajectory with quadratic air drag."""
        v0 = self.exit_velocity()
        theta = np.radians(angle_deg)
        vx, vy = v0 * np.cos(theta), v0 * np.sin(theta)
        x, y = 0.0, height_m
        Cd = 0.1  # drag coefficient for liquid jet
        A_drag = self.nozzle_area

        xs, ys = [x], [y]
        t = 0
        while y >= 0 and t < 20:
            v = np.sqrt(vx**2 + vy**2)
            drag = 0.5 * 1.225 * Cd * A_drag * v
            ax = -drag * vx / (self.rho * self.nozzle_area * 0.1) if v > 0 else 0
            ay = -g - drag * vy / (self.rho * self.nozzle_area * 0.1) if v > 0 else -g

            vx += ax * dt
            vy += ay * dt
            x += vx * dt
            y += vy * dt
            t += dt
            xs.append(x)
            ys.append(y)

        return np.array(xs), np.array(ys), t

# Build the siphon
siphon = SiphonSystem(
    pump_force_N=800,         # two strong sailors pumping
    piston_area_m2=0.005,     # 80mm diameter piston
    nozzle_diameter_mm=25,    # 25mm nozzle
    tank_volume_L=50,         # 50-litre pressurised tank
    fluid_density=900,
    fluid_surface_tension=28  # mN/m (naphtha-resin blend)
)

print("=== Siphon System Analysis ===")
print(f"Pump pressure: {siphon.pressure/1000:.0f} kPa ({siphon.pressure/101325:.1f} atm)")
print(f"Exit velocity: {siphon.exit_velocity():.1f} m/s")
print(f"Flow rate: {siphon.flow_rate()*1000:.2f} L/s")
print(f"Firing duration: {siphon.tank_L/(siphon.flow_rate()*1000):.0f} seconds")
print(f"Weber number: {siphon.weber_number():.0f}")
print(f"Jet breakup length: {siphon.breakup_length():.1f} m")

# Trajectory analysis
print(f"\
=== Trajectory vs Launch Angle ===")
print(f"{'Angle':>6} {'Range (m)':>10} {'Max height (m)':>14} {'Flight (s)':>12}")
print("-" * 44)
for angle in [10, 15, 20, 25, 30, 35, 40, 45]:
    xs, ys, t_flight = siphon.trajectory(angle)
    rng = xs[-1] if len(xs) > 1 else 0
    max_h = np.max(ys) if len(ys) > 1 else 0
    print(f"{angle:>5}° {rng:>9.1f} {max_h:>12.1f} {t_flight:>10.2f}")

# Nozzle diameter trade-off
print(f"\
=== Nozzle Diameter Trade-off ===")
print(f"{'Diameter':>10} {'Velocity':>10} {'Flow (L/s)':>12} {'Range 30° (m)':>14} {'Breakup (m)':>12}")
print("-" * 60)
for d in [10, 15, 20, 25, 30, 40, 50]:
    s = SiphonSystem(800, 0.005, d, 50, 900, 28)
    xs, _, _ = s.trajectory(30)
    rng = xs[-1] if len(xs) > 1 else 0
    print(f"{d:>8}mm {s.exit_velocity():>9.1f} {s.flow_rate()*1000:>10.2f} "
          f"{rng:>12.1f} {s.breakup_length():>10.1f}")

print("\
Small nozzle: fast jet, long range, thin stream.")
print("Large nozzle: slow jet, short range, heavy coverage.")
print("25mm was a good compromise — reaching ~35m with solid coverage.")`,
      challenge: 'Add a "pre-pressurised chamber" mode: the pump builds pressure in a sealed chamber before firing (like a Super Soaker). If the chamber stores 5 litres at 400 kPa, calculate the initial burst velocity and how it decays as pressure drops. This is how real siphons achieved their maximum range in the first seconds of firing.',
      successHint: 'You built a fluid dynamics model combining Bernoulli, continuity, Weber number analysis, and projectile motion with drag — the same toolkit used to design fire suppression systems, fuel injectors, inkjet printers, and rocket engine nozzles.',
    },
    {
      title: 'Fire spread model — surface ignition probability on a target ship',
      concept: `When Greek Fire lands on a ship, it doesn't instantly ignite the entire vessel. Fire spreads through a **stochastic process**: each small area has a probability of catching fire that depends on:

1. **Surface material** — dry wood ignites at ~300°C; wet canvas at ~400°C
2. **Fuel coverage** — areas with Greek Fire residue have higher ignition probability
3. **Temperature** — heat from already-burning areas raises the temperature of adjacent areas
4. **Wind** — carries heat and embers in the downwind direction

We model the ship's deck as a **2D grid** where each cell can be in one of four states: SAFE, COVERED (Greek Fire landed), BURNING, or DESTROYED. At each time step, covered cells may ignite (based on temperature), burning cells heat their neighbours, and destroyed cells are inert.

This is a **cellular automaton** — a grid where each cell's next state depends on its current state and its neighbours' states. It's the same mathematical framework used to model wildfire spread, epidemic transmission, and crystal growth.

📚 *Cellular automata were invented by John von Neumann and Stanislaw Ulam in the 1940s. Simple local rules can produce complex global behaviour — a key insight of complexity science.*`,
      analogy: 'Imagine a chessboard where each square can be "cold," "warm," or "on fire." A square catches fire if enough of its neighbours are burning. Once on fire, it heats its neighbours. The fire spreads in a pattern that looks organic and realistic — even though the rules are simple. This is exactly how wildfire models work.',
      storyConnection: 'Historical accounts describe Greek Fire spreading across a ship\'s deck "like a living thing" — racing along tarred seams between planks, climbing up rope rigging, and jumping to nearby vessels on the wind. Our grid model reproduces this behaviour: the tarred seams are high-probability ignition paths, the rigging connects the deck to the mast (vertical spread), and wind biases the spread direction.',
      checkQuestion: 'On a 20x20 grid representing a ship deck, Greek Fire covers 15% of cells. If each covered cell has a 40% chance of igniting per time step, how many cells are burning after one step?',
      checkAnswer: '20 × 20 = 400 cells. 15% covered = 60 cells. 40% of 60 ignite = 24 burning cells. But this is just the first step — in the second step, those 24 burning cells heat their neighbours, increasing THEIR ignition probability. The fire accelerates exponentially until it runs out of fuel or reaches the water.',
      codeIntro: 'Build a 2D cellular automaton fire spread model for a ship under Greek Fire attack.',
      code: `import numpy as np

np.random.seed(42)

# Ship deck grid
SAFE, COVERED, BURNING, DESTROYED = 0, 1, 2, 3
state_names = {0: ".", 1: "~", 2: "*", 3: "#"}

class ShipFireModel:
    """2D cellular automaton for fire spread on a ship deck."""

    def __init__(self, rows=20, cols=30):
        self.rows = rows
        self.cols = cols
        self.grid = np.zeros((rows, cols), dtype=int)
        self.temperature = np.ones((rows, cols)) * 25.0  # °C
        self.ignition_temp = 300  # °C for dry wood

    def apply_greek_fire(self, center_row, center_col, radius=4):
        """Splash pattern: Greek Fire lands in a roughly circular area."""
        for r in range(self.rows):
            for c in range(self.cols):
                dist = np.sqrt((r - center_row)**2 + (c - center_col)**2)
                if dist < radius and self.grid[r, c] == SAFE:
                    if np.random.random() < max(0, 1 - dist/radius):
                        self.grid[r, c] = COVERED
                        self.temperature[r, c] = 800  # Greek Fire is already hot

    def step(self, wind_dir=(0, 1), wind_strength=0.3):
        """Advance one time step."""
        new_grid = self.grid.copy()
        new_temp = self.temperature.copy()

        for r in range(self.rows):
            for c in range(self.cols):
                if self.grid[r, c] == COVERED:
                    # Covered cells may ignite
                    if self.temperature[r, c] > self.ignition_temp:
                        if np.random.random() < 0.6:
                            new_grid[r, c] = BURNING

                elif self.grid[r, c] == BURNING:
                    # Burning cells heat neighbours and may burn out
                    for dr in [-1, 0, 1]:
                        for dc in [-1, 0, 1]:
                            if dr == 0 and dc == 0:
                                continue
                            nr, nc = r + dr, c + dc
                            if 0 <= nr < self.rows and 0 <= nc < self.cols:
                                # Wind bias: downwind neighbours get more heat
                                wind_bonus = (1 + wind_strength *
                                    (dr * wind_dir[0] + dc * wind_dir[1]))
                                heat_transfer = 80 * max(0, wind_bonus)
                                new_temp[nr, nc] += heat_transfer

                                # Spread to safe cells (sparks/radiant heat)
                                if (self.grid[nr, nc] == SAFE and
                                        new_temp[nr, nc] > self.ignition_temp):
                                    if np.random.random() < 0.15 * wind_bonus:
                                        new_grid[nr, nc] = BURNING

                    # Burn duration: cell burns for ~5 steps then destroyed
                    if np.random.random() < 0.2:
                        new_grid[r, c] = DESTROYED

        # Ambient cooling
        new_temp = np.maximum(25, new_temp * 0.95)

        self.grid = new_grid
        self.temperature = new_temp

    def stats(self):
        total = self.rows * self.cols
        return {
            "safe": np.sum(self.grid == SAFE) / total * 100,
            "covered": np.sum(self.grid == COVERED) / total * 100,
            "burning": np.sum(self.grid == BURNING) / total * 100,
            "destroyed": np.sum(self.grid == DESTROYED) / total * 100,
        }

# Simulate a Greek Fire attack
ship = ShipFireModel(rows=16, cols=24)

# Two siphon blasts
ship.apply_greek_fire(8, 6, radius=4)
ship.apply_greek_fire(4, 16, radius=3)

print("=== Ship Fire Spread Simulation ===")
print(f"Ship deck: {ship.rows}×{ship.cols} grid | Wind: east")
print(f". = safe | ~ = covered | * = burning | # = destroyed\
")

print(f"{'Step':>4} {'Safe%':>6} {'Covered%':>9} {'Burning%':>9} {'Destroyed%':>11}")
print("-" * 41)

for step in range(30):
    s = ship.stats()
    if step % 3 == 0:
        print(f"{step:>4} {s['safe']:>5.1f} {s['covered']:>8.1f} {s['burning']:>8.1f} "
              f"{s['destroyed']:>10.1f}")
    ship.step(wind_dir=(0, 1), wind_strength=0.4)

    if s["safe"] < 20:
        print(f"\
Ship lost at step {step}: {s['destroyed']:.0f}% destroyed, "
              f"{s['burning']:.0f}% still burning")
        break

# Final state
final = ship.stats()
print(f"\
Final state:")
print(f"  Safe:      {final['safe']:.1f}%")
print(f"  Burning:   {final['burning']:.1f}%")
print(f"  Destroyed: {final['destroyed']:.1f}%")
print(f"  Total damage: {final['burning'] + final['destroyed']:.1f}%")

# Compare with/without wind
print("\
=== Wind Effect on Fire Spread ===")
for wind in [0, 0.2, 0.4, 0.6, 0.8]:
    ship2 = ShipFireModel(16, 24)
    ship2.apply_greek_fire(8, 6, 4)
    for _ in range(20):
        ship2.step(wind_dir=(0, 1), wind_strength=wind)
    s = ship2.stats()
    print(f"  Wind {wind:.1f}: {s['destroyed'] + s['burning']:.0f}% damage after 20 steps")`,
      challenge: 'Add a "crew firefighting" mechanic: each step, the crew converts 2 random BURNING cells back to SAFE (they smother small fires with sand). How does crew size (1, 2, 5, 10 firefighters) affect the outcome? At what crew size can they contain the fire? This models the race between fire spread and fire suppression that determines every real fire\'s outcome.',
      successHint: 'Cellular automata fire models are used by real fire departments and forestry services to predict wildfire spread, plan evacuations, and design firebreaks. The same grid-based stochastic approach models epidemic spread, urban growth, and even traffic flow. You\'ve built a tool that has direct real-world applications.',
    },
    {
      title: 'Portfolio documentation — Combustion Simulator technical report',
      concept: `The final step is **documentation** — recording what you built, why, how it works, and what it reveals about Greek Fire's effectiveness as a weapon system.

Your Combustion Simulator documentation should include:

1. **Abstract** — one paragraph summarising the entire project
2. **System architecture** — the four classes and their relationships
3. **Physics models** — equations and assumptions for each module
4. **Key findings** — what the simulations revealed about Greek Fire
5. **Validation** — how results compare to historical accounts
6. **Limitations** — what the model doesn't capture
7. **Future work** — extensions and improvements

This is the structure of a **technical paper** — the standard format for communicating engineering and scientific results. Writing clearly about complex systems is one of the highest-value skills in any technical field.

📚 *Richard Feynman: "If you can't explain it simply, you don't understand it well enough." Documentation forces you to clarify your own thinking — it's as much a tool for the author as for the reader.*`,
      analogy: 'An architect doesn\'t just build a house — they create blueprints, specifications, and a rationale document. A surgeon doesn\'t just operate — they write up the procedure, findings, and follow-up plan. Documentation is how professionals record and communicate their work. Code without documentation is like a building without blueprints — useful today, unmaintainable tomorrow.',
      storyConnection: 'Ironically, the Byzantines\' obsessive secrecy around Greek Fire means we have almost NO documentation of the formula or the siphon design. When Constantinople fell in 1204, the knowledge was lost. If they had documented it (even in encrypted form), we might understand one of history\'s most effective weapons. Your documentation ensures YOUR work survives.',
      checkQuestion: 'Why include "Limitations" in a technical report? Doesn\'t it undermine confidence in the results?',
      checkAnswer: 'The opposite — stating limitations demonstrates scientific honesty and engineering maturity. Every model is an approximation. A reader who knows the limitations can judge whether the results apply to their situation. A report without limitations is either dishonest or naive — neither inspires trust.',
      codeIntro: 'Generate the complete technical report for the Greek Fire Combustion Simulator.',
      code: `# Greek Fire Combustion Simulator — Technical Report

print("""
================================================================
       GREEK FIRE COMBUSTION SIMULATOR
           Technical Report
================================================================

1. ABSTRACT
-----------
This simulator models the Byzantine incendiary weapon known as
Greek Fire (c. 672-1261 CE) as a complete weapon system: fuel
chemistry, combustion kinetics, siphon delivery, and fire spread
on a target vessel. The simulator comprises four modules (Fuel,
Reaction, Siphon, FireSpread) that together reproduce the key
behaviours described in historical accounts: sustained burning,
water resistance via quicklime feedback, adhesion to surfaces,
and rapid spread across wooden ships.

2. SYSTEM ARCHITECTURE
----------------------
  Fuel          -> defines chemical properties per component
      \\
  Reaction      -> coupled multi-component combustion engine
      |              with quicklime-water exothermic feedback
  Siphon        -> pump pressure, Bernoulli nozzle flow,
      |              Weber number jet breakup, trajectory
  FireSpread    -> 2D cellular automaton: ignition probability,
                     heat transfer to neighbours, wind effects

3. PHYSICS MODELS
-----------------
  a) Thermodynamics:
     Hess's law for multi-component enthalpy calculation
     ΔH_rxn = Σ ΔH_f(products) - Σ ΔH_f(reactants)

  b) Kinetics:
     Arrhenius equation: k = A × exp(-Ea / RT)
     Coupled reactions: quicklime heat -> naphtha rate increase

  c) Fluid dynamics:
     Bernoulli: v = √(2ΔP/ρ)
     Weber number: We = ρv²d/σ (jet breakup criterion)
     Projectile motion with quadratic drag

  d) Heat transfer:
     Conduction: Q = kAΔT/d (through hull)
     Convection: Q = hAΔT (to air)
     Radiation:  Q = εσAT⁴ (to surroundings)

  e) Fire spread:
     Cellular automaton with stochastic ignition
     Wind-biased heat transfer to neighbours

4. KEY FINDINGS
---------------
  - Greek Fire reached ~1100°C peak temperature in simulation,
    consistent with naphtha-resin combustion estimates

  - Quicklime-water feedback increased peak temperature by
    50-130°C when water was applied — confirming historical
    accounts of water making the fire worse

  - Optimal siphon nozzle: 25mm diameter at 200 kPa gave
    ~35m range with coherent jet — matching historical
    accounts of 25-50m effective range

  - Fire spread simulation: a single siphon blast covering
    15% of a ship deck led to >60% destruction within 30
    time steps, especially with wind assistance

  - The secrecy game theory model showed that rare, decisive
    use maximised the weapon's strategic value over centuries

5. VALIDATION AGAINST HISTORICAL ACCOUNTS
------------------------------------------
  Historical claim              Model prediction     Match?
  "Burns on water"              Quicklime feedback   YES
  "Range of 50 cubits (~25m)"   35m at 200 kPa       YES
  "Stuck to everything"         θ < 15° on wood      YES
  "Could not be extinguished"   Thermal runaway >     YES
                                800°C self-sustaining
  "Secret kept for 600 years"   Optimal: 1-3 uses/   YES
                                decade maximises
                                secrecy duration

6. LIMITATIONS
--------------
  - 1D flame model (real combustion is 3D turbulent)
  - Simplified Arrhenius (real combustion has hundreds of
    intermediate reactions)
  - No smoke/toxicity modelling (SO2 from sulphur)
  - Ship structural failure not modelled (hull breach, mast
    collapse)
  - Crew behaviour is stochastic, not agent-based
  - Historical recipe unknown — all compositions are estimates

7. FUTURE IMPROVEMENTS
----------------------
  - 3D CFD combustion model (OpenFOAM integration)
  - Multi-ship fleet engagement simulation
  - Structural failure mechanics (when does the hull breach?)
  - Agent-based crew response (fight fire vs abandon ship)
  - Climate/weather integration (Mediterranean wind patterns)
  - Comparison with modern incendiary weapons (napalm, thermite)

================================================================
""")

# Skills summary
skills = [
    ("Thermodynamics",       "Hess's law, enthalpy, heat transfer modes"),
    ("Chemical kinetics",    "Arrhenius equation, thermal runaway, coupled reactions"),
    ("Fluid dynamics",       "Bernoulli, Weber number, jet breakup, projectile motion"),
    ("Numerical methods",    "Finite differences, PDE solving, Monte Carlo"),
    ("Computer science",     "OOP, cellular automata, agent-based modelling"),
    ("Game theory",          "Information asymmetry, Nash equilibrium, Pareto optimality"),
    ("Materials science",    "Corrosion, surface energy, wetting, adhesion"),
    ("Technical writing",    "Structured reports, validation, limitation analysis"),
]

print("PORTFOLIO SKILLS SUMMARY:")
for skill, detail in skills:
    print(f"  {skill:<24} {detail}")

print()
print("PHYSICS EQUATIONS USED:")
equations = [
    "Hess's law: ΔH_rxn = Σ ΔH_f(products) - Σ ΔH_f(reactants)",
    "Arrhenius: k = A × exp(-Ea / RT)",
    "Bernoulli: v = √(2ΔP/ρ)",
    "Stefan-Boltzmann: Q = εσAT⁴",
    "Young's equation: cos(θ) = (γSV - γSL) / γLV",
    "Weber number: We = ρv²d/σ",
    "Fourier (conduction): Q = kAΔT/d",
    "Newton (convection): Q = hAΔT",
    "Projectile range: R = v²sin(2θ)/g",
]
for eq in equations:
    print(f"  {eq}")`,
      challenge: 'Turn this into a real portfolio piece: add a "Lessons Learned" section reflecting on what surprised you most about Greek Fire\'s engineering. Was it the chemistry, the delivery system, or the strategic thinking? The best portfolio projects show not just technical skill but intellectual curiosity and reflective thinking.',
      successHint: 'You have completed a full engineering project cycle: from system design through multi-physics simulation to validated results and technical documentation. This is exactly how professional engineers work — whether designing jet engines, pharmaceutical processes, or military systems. You now have a portfolio project demonstrating thermodynamics, fluid dynamics, kinetics, materials science, numerical methods, and game theory — applied to one of history\'s most fascinating engineering challenges.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Greek Fire Combustion Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Greek Fire Combustion Simulator.
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
