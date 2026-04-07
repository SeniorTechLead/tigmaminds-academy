import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HilsaLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Drag force — what slows a fish down',
      concept: `When a hilsa swims through water, the water pushes back — this resistance is called **drag**. The drag force depends on the fish's speed, its frontal area, its shape, and the water's density: **F_drag = 0.5 * rho * v^2 * Cd * A**, where rho is water density (1000 kg/m3), v is velocity, Cd is the drag coefficient (shape factor), and A is the frontal cross-section area.

A streamlined fish like the hilsa has a very low drag coefficient (Cd = 0.04-0.08) compared to a flat plate (Cd = 1.2) or a sphere (Cd = 0.47). This streamlining allows the hilsa to swim efficiently over hundreds of kilometres during its annual migration.

In the code below, you will calculate drag forces at different swimming speeds and compare the hilsa's streamlined shape to less efficient shapes.`,
      analogy: 'Stick your hand out of a moving car. Palm flat to the wind — enormous force (high Cd). Turn your hand sideways, fingers together — much less force (low Cd). The hilsa\'s body is like a perfectly angled hand — it slips through water with minimum resistance.',
      storyConnection: 'Every monsoon, millions of hilsa swim from the Bay of Bengal up the rivers of Bengal — against the current — to spawn in freshwater. This journey of 200-300 km requires extraordinary energy efficiency. The hilsa\'s torpedo-shaped body minimises drag so that more of its muscle energy goes to forward motion rather than fighting water resistance.',
      checkQuestion: 'A hilsa swims at 1 m/s with frontal area 0.005 m2 and Cd = 0.06. What is the drag force? (Water density = 1000 kg/m3)',
      checkAnswer: 'F_drag = 0.5 * 1000 * 1^2 * 0.06 * 0.005 = 0.15 N. That is about the weight of a small coin — remarkably little drag for a fish moving at 1 m/s. This efficiency is the secret to long-distance migration.',
      codeIntro: 'Calculate drag forces on a hilsa at different speeds and compare body shapes.',
      code: `import numpy as np

# Drag force calculator
# F = 0.5 * rho * v^2 * Cd * A

rho = 1000  # water density (kg/m3)

# Different body shapes and their drag coefficients
shapes = [
    {"name": "Hilsa (streamlined)", "Cd": 0.06, "A_m2": 0.005},
    {"name": "Rohu (moderate)", "Cd": 0.12, "A_m2": 0.008},
    {"name": "Pufferfish (blunt)", "Cd": 0.35, "A_m2": 0.012},
    {"name": "Flat plate (broadside)", "Cd": 1.20, "A_m2": 0.010},
    {"name": "Perfect sphere", "Cd": 0.47, "A_m2": 0.008},
    {"name": "Submarine (engineered)", "Cd": 0.04, "A_m2": 0.006},
]

print("=== Drag Force Comparison at 1 m/s ===")
print(f"{'Shape':<28} {'Cd':>6} {'Area (cm2)':>10} {'Drag (N)':>10}")
print("-" * 56)

for s in shapes:
    F = 0.5 * rho * 1.0**2 * s["Cd"] * s["A_m2"]
    print(f"{s['name']:<28} {s['Cd']:>6.2f} {s['A_m2']*10000:>8.0f} {F:>8.3f}")

# How drag changes with speed (quadratic!)
print()
print("=== Hilsa Drag vs Swimming Speed ===")
hilsa_Cd = 0.06
hilsa_A = 0.005

print(f"{'Speed (m/s)':<12} {'Speed (km/h)':>12} {'Drag (N)':>10} {'Power (W)':>10}")
print("-" * 46)

for v in [0.2, 0.5, 0.8, 1.0, 1.5, 2.0, 2.5, 3.0]:
    F = 0.5 * rho * v**2 * hilsa_Cd * hilsa_A
    # Power = Force * velocity
    P = F * v
    print(f"{v:<12.1f} {v*3.6:>10.1f} {F:>8.3f} {P:>8.4f}")

print()
print("Key insight: drag scales with v^2, but POWER scales with v^3!")
print("Doubling speed requires 8x the power — this is why fish")
print("swim at a moderate, efficient cruising speed.")

# Energy for the entire migration
print()
print("=== Migration Energy Budget ===")
distance_km = 250  # total migration distance
cruise_speed = 0.8  # m/s (optimal cruise speed)

F_cruise = 0.5 * rho * cruise_speed**2 * hilsa_Cd * hilsa_A
P_cruise = F_cruise * cruise_speed
time_hours = (distance_km * 1000) / cruise_speed / 3600
energy_kJ = P_cruise * time_hours * 3600 / 1000

print(f"Cruise speed: {cruise_speed} m/s ({cruise_speed*3.6:.1f} km/h)")
print(f"Drag at cruise: {F_cruise:.3f} N")
print(f"Power at cruise: {P_cruise:.4f} W")
print(f"Travel time: {time_hours:.0f} hours ({time_hours/24:.1f} days)")
print(f"Energy for drag: {energy_kJ:.1f} kJ")
print(f"(Muscle efficiency ~25%, so total energy: {energy_kJ/0.25:.0f} kJ)")`,
      challenge: 'The hilsa swims upstream against a current of 0.5 m/s. Its ground speed is only 0.3 m/s, but its water speed is 0.8 m/s. Recalculate travel time and total energy. How much extra energy does swimming against the current cost compared to still water?',
      successHint: 'The drag equation is one of the most important in fluid mechanics. It applies to cars, aircraft, ships, and even cyclists. The v^2 scaling explains why fuel consumption skyrockets at high speeds and why fuel-efficient vehicles are always streamlined.',
    },
    {
      title: 'Thrust — how fish propel themselves',
      concept: `To swim, a fish must generate **thrust** equal to or greater than drag. Fish generate thrust by oscillating their tail (caudal fin), which pushes water backward. By Newton's third law, the water pushes the fish forward.

The thrust depends on tail beat frequency, tail area, and the angle of the tail stroke. A simplified model: **F_thrust = 0.5 * rho * A_tail * v_tail^2 * sin(2*theta)**, where A_tail is the tail fin area, v_tail is the tail tip velocity, and theta is the maximum sweep angle.

At **steady swimming speed**, thrust exactly equals drag: the fish neither accelerates nor decelerates. The fish adjusts its tail beat frequency to maintain this balance — faster beats for higher speed, slower beats to conserve energy.`,
      analogy: 'A fish tail works like an oar. Pull the oar through the water and the boat moves forward. The faster and wider you stroke, the more thrust you generate. The fish does this continuously with its tail, hundreds of times per minute.',
      storyConnection: 'Hilsa are exceptionally fast swimmers — they can burst up to 4 m/s to escape predators or leap over obstacles. Their deeply forked tail is optimised for the cruising-speed oscillation pattern. During migration, they swim at a steady 0.5-1.0 m/s, beating their tails about 2-3 times per second — a pace they can maintain for weeks.',
      checkQuestion: 'At steady speed, thrust equals drag. If a hilsa\'s drag at 1 m/s is 0.15 N, and its muscles are 25% efficient, how much metabolic power does it need?',
      checkAnswer: 'Mechanical power = drag * speed = 0.15 * 1 = 0.15 W. At 25% efficiency, metabolic power = 0.15 / 0.25 = 0.60 W. The hilsa burns 0.6 joules per second to swim at 1 m/s — about the power of a small LED.',
      codeIntro: 'Model thrust generation from tail oscillation and find the steady-state swimming speed.',
      code: `import numpy as np

# Fish thrust model
# Thrust from tail oscillation

rho = 1000  # water density

def tail_thrust(tail_area_m2, tail_freq_hz, tail_amplitude_m, sweep_angle_deg):
    """Calculate thrust from tail oscillation"""
    theta = np.radians(sweep_angle_deg)
    # Tail tip velocity = 2 * pi * freq * amplitude
    v_tail = 2 * np.pi * tail_freq_hz * tail_amplitude_m
    # Thrust (simplified Lighthill model)
    thrust = 0.5 * rho * tail_area_m2 * v_tail**2 * np.sin(2 * theta) * 0.3
    return thrust

def drag_force(v, Cd=0.06, A=0.005):
    return 0.5 * rho * v**2 * Cd * A

# Hilsa tail parameters
tail_area = 0.003    # m2 (caudal fin area)
tail_amp = 0.04      # m (half-amplitude of tail sweep)
sweep_angle = 30     # degrees

print("=== Thrust vs Tail Beat Frequency ===")
print(f"Tail area: {tail_area*10000:.0f} cm2 | Amplitude: {tail_amp*100:.0f} cm")
print()
print(f"{'Freq (Hz)':>10} {'Thrust (N)':>12} {'Steady speed (m/s)':>20}")
print("-" * 44)

for freq in [1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 8.0]:
    T = tail_thrust(tail_area, freq, tail_amp, sweep_angle)
    # Find steady speed where thrust = drag
    # 0.5*rho*v^2*Cd*A = T => v = sqrt(2T/(rho*Cd*A))
    v_steady = np.sqrt(2 * T / (rho * 0.06 * 0.005))
    print(f"{freq:>10.1f} {T:>10.4f} {v_steady:>18.2f}")

# Thrust-drag balance diagram
print()
print("=== Thrust-Drag Balance ===")
print(f"{'Speed (m/s)':<12} {'Drag (N)':>10} {'Thrust @2Hz':>12} {'Thrust @3Hz':>12} {'Balance':<10}")
print("-" * 58)

for v in np.arange(0.2, 3.0, 0.3):
    D = drag_force(v)
    T2 = tail_thrust(tail_area, 2.0, tail_amp, sweep_angle)
    T3 = tail_thrust(tail_area, 3.0, tail_amp, sweep_angle)
    balance = "Accel" if T2 > D else "Decel" if T2 < D else "Steady"
    print(f"{v:<12.1f} {D:>8.4f} {T2:>10.4f} {T3:>10.4f} {balance:<10}")

# Swimming efficiency
print()
print("=== Swimming Efficiency (Cost of Transport) ===")
print("Cost of Transport = Energy per unit distance per unit mass")
print()

mass_kg = 0.8  # hilsa mass
print(f"{'Speed':>8} {'Drag':>8} {'Power':>8} {'Efficiency':>12} {'CoT':>12}")
print(f"{'(m/s)':>8} {'(N)':>8} {'(W)':>8} {'(muscle)':>12} {'(J/m/kg)':>12}")
print("-" * 50)

for v in [0.3, 0.5, 0.8, 1.0, 1.5, 2.0]:
    D = drag_force(v)
    P_mech = D * v
    # Muscle efficiency varies with speed (optimal at moderate speed)
    eff = 0.25 * np.exp(-((v - 0.8) / 0.8)**2) + 0.10
    P_total = P_mech / eff
    cot = P_total / (v * mass_kg)
    print(f"{v:>8.1f} {D:>6.3f} {P_mech:>6.4f} {eff:>10.1%} {cot:>10.2f}")

print()
print("Minimum CoT occurs at moderate speed — the optimal cruise speed.")
print("Too slow: low efficiency. Too fast: v^3 power scaling dominates.")`,
      challenge: 'A hilsa needs to jump over a 30 cm high barrier (a small weir). To clear it, it needs a vertical velocity of sqrt(2*g*0.3) = 2.43 m/s. What tail beat frequency would generate enough thrust for this burst? How many tail beats to reach this speed?',
      successHint: 'Thrust-drag balance determines the swimming speed of every aquatic animal, the cruising speed of every ship, and the terminal velocity of every falling object. The balance point — where driving force equals resistance — is a universal concept in physics.',
    },
    {
      title: 'Reynolds number — why size and speed matter together',
      concept: `The **Reynolds number** (Re) is a dimensionless number that predicts whether flow around an object will be smooth (laminar) or chaotic (turbulent): **Re = rho * v * L / mu**, where L is the object's length and mu is the fluid's dynamic viscosity.

At low Re (< 2000), flow is laminar — smooth, predictable, and gentle. At high Re (> 500,000), flow is turbulent — chaotic, mixing, and high-drag. In between is the **transition zone** where flow can be either.

A swimming hilsa has Re around 100,000-500,000 — right in the transition zone. Its streamlined shape helps maintain laminar flow over most of its body, keeping drag low. Any bump, scratch, or protruding scale that disrupts this laminar flow increases drag significantly.`,
      analogy: 'Pour honey slowly from a spoon (low Re) — it flows in a smooth, predictable stream. Pour water quickly from a glass (high Re) — it splashes and tumbles chaotically. The Reynolds number tells you whether a flow "behaves like honey" (laminar) or "behaves like a waterfall" (turbulent).',
      storyConnection: 'The hilsa\'s scales are remarkably smooth and overlapping, like roof tiles. This smooth surface delays the transition from laminar to turbulent flow, reducing drag. Fishermen have noticed that hilsa with damaged scales (from nets or predator attacks) swim noticeably slower — the rough patches trigger early turbulence, increasing drag by 20-30%.',
      checkQuestion: 'A hilsa is 30 cm long, swims at 1 m/s in water with viscosity 0.001 Pa*s. What is the Reynolds number? Is the flow laminar or turbulent?',
      checkAnswer: 'Re = 1000 * 1.0 * 0.30 / 0.001 = 300,000. This is in the transition zone (between 2000 and 500,000). The smooth, streamlined body helps keep flow laminar over most of the fish, but turbulence develops near the tail where the body narrows.',
      codeIntro: 'Calculate Reynolds numbers for different fish at different speeds and predict flow regimes.',
      code: `import numpy as np

# Reynolds number calculator
# Re = rho * v * L / mu

rho = 1000       # water density (kg/m3)
mu = 0.001       # dynamic viscosity of water at 20C (Pa*s)

# Different aquatic creatures
creatures = [
    {"name": "Bacteria", "length_m": 0.000002, "speed_ms": 0.00003},
    {"name": "Plankton", "length_m": 0.001, "speed_ms": 0.001},
    {"name": "Minnow", "length_m": 0.05, "speed_ms": 0.3},
    {"name": "Hilsa (cruising)", "length_m": 0.35, "speed_ms": 0.8},
    {"name": "Hilsa (burst)", "length_m": 0.35, "speed_ms": 3.0},
    {"name": "Salmon", "length_m": 0.70, "speed_ms": 2.0},
    {"name": "Tuna", "length_m": 2.0, "speed_ms": 6.0},
    {"name": "Blue whale", "length_m": 25.0, "speed_ms": 10.0},
    {"name": "Submarine", "length_m": 100.0, "speed_ms": 15.0},
]

print("=== Reynolds Number Across Scales ===")
print(f"{'Creature':<22} {'Length':>8} {'Speed':>8} {'Re':>14} {'Flow Regime':<14}")
print("-" * 68)

for c in creatures:
    Re = rho * c["speed_ms"] * c["length_m"] / mu
    if Re < 1:
        regime = "Stokes (creep)"
    elif Re < 2000:
        regime = "Laminar"
    elif Re < 500000:
        regime = "Transition"
    else:
        regime = "Turbulent"
    print(f"{c['name']:<22} {c['length_m']:>6.3f}m {c['speed_ms']:>6.2f} {Re:>12.0f} {regime:<14}")

# Hilsa Re variation with speed
print()
print("=== Hilsa Reynolds Number vs Speed ===")
L_hilsa = 0.35  # m

speeds = np.linspace(0.1, 3.0, 15)
print(f"{'Speed (m/s)':>12} {'Re':>12} {'Cd (estimated)':>16} {'Drag (N)':>10}")
print("-" * 52)

for v in speeds:
    Re = rho * v * L_hilsa / mu
    # Cd depends on Re (simplified relationship)
    if Re < 100000:
        Cd = 0.08
    elif Re < 300000:
        Cd = 0.06
    elif Re < 500000:
        Cd = 0.05  # laminar-to-turbulent transition reduces Cd
    else:
        Cd = 0.07  # fully turbulent: Cd increases again
    drag = 0.5 * rho * v**2 * Cd * 0.005
    print(f"{v:>12.2f} {Re:>10.0f} {Cd:>14.3f} {drag:>8.4f}")

# Temperature effect on viscosity (and thus Re)
print()
print("=== Temperature Effect (viscosity changes) ===")
temps_C = [5, 10, 15, 20, 25, 30]
# Approximate viscosity vs temperature
viscosities = [0.00152, 0.00131, 0.00114, 0.00100, 0.00089, 0.00080]

v_swim = 0.8  # m/s
print(f"{'Temp (C)':>10} {'Viscosity':>12} {'Re':>12} {'Flow':<14}")
print("-" * 50)

for T, mu_T in zip(temps_C, viscosities):
    Re = rho * v_swim * L_hilsa / mu_T
    regime = "Transition" if Re < 500000 else "Turbulent"
    print(f"{T:>10} {mu_T:>12.5f} {Re:>10.0f} {regime:<14}")

print()
print("Warmer water = lower viscosity = higher Re = more turbulence.")
print("Hilsa migrate during monsoon (warm water, high Re) — their")
print("smooth scales are extra important in these conditions!")`,
      challenge: 'A hilsa fry (baby) is only 3 cm long and swims at 0.1 m/s. Calculate its Re. The fry lives in a completely different flow regime than the adult! How does this affect the optimal body shape for a baby fish vs an adult?',
      successHint: 'The Reynolds number is one of the most powerful concepts in fluid mechanics. It tells you whether two flow situations are physically similar — a model airplane in a wind tunnel can match a real airplane if the Re matches. This principle of "dynamic similarity" enables all scale-model testing.',
    },
    {
      title: 'Streamlining — the science of low-drag shapes',
      concept: `A **streamlined** body has a gently tapering shape that allows flow to stay attached to the surface — preventing the chaotic, high-drag separated flow (wake) that forms behind blunt objects. The ideal streamlined shape has a length-to-width ratio (fineness ratio) of about **4:1 to 6:1**.

The drag on a streamlined body has two components: **friction drag** (water rubbing along the surface) and **pressure drag** (high pressure at the front minus low pressure in the wake). For blunt objects, pressure drag dominates. For streamlined objects, friction drag dominates.

The hilsa's fineness ratio is about 4.5:1 — nearly optimal. Too thin (ratio > 7) increases surface area and friction drag. Too fat (ratio < 3) creates a large wake and pressure drag.`,
      analogy: 'Think of a raindrop falling through air. It starts as a sphere (high drag) and gets squeezed into a teardrop shape (low drag) by the airflow. But the ideal shape is actually more like an elongated egg — rounded at the front, gradually tapering at the back. This is the shape fish evolved and engineers copied.',
      storyConnection: 'The hilsa\'s body shape is so hydrodynamically efficient that marine engineers study it. The Bengal fishing boat (nouka) has a hull shape remarkably similar to the hilsa — developed over centuries of empirical refinement. The boat builders, watching hilsa slice through the water, unconsciously optimised their hull forms to mimic the fish.',
      checkQuestion: 'A hilsa is 35 cm long and 8 cm at its widest. What is its fineness ratio? Is this in the optimal range?',
      checkAnswer: 'Fineness ratio = 35/8 = 4.375. This is right in the sweet spot (4-6). Too thin would mean more surface area for friction. Too fat would create a larger wake. The hilsa\'s body is naturally optimised for minimum total drag.',
      codeIntro: 'Calculate drag for different body shapes and fineness ratios to find the optimal streamlined form.',
      code: `import numpy as np

# Streamlining analysis
# Compare body shapes by their drag components

rho = 1000  # water density
v = 1.0     # swimming speed (m/s)

def total_drag(fineness_ratio, volume_m3, Cd_friction=0.003, v=1.0):
    """
    Calculate friction + pressure drag for a streamlined body.
    fineness_ratio = length / max_diameter
    """
    # Approximate dimensions from volume and fineness ratio
    # For an ellipsoid: V = (pi/6) * L * D^2
    # L = fineness_ratio * D
    # V = (pi/6) * fineness_ratio * D^3
    D = (6 * volume_m3 / (np.pi * fineness_ratio)) ** (1/3)
    L = fineness_ratio * D

    # Surface area (ellipsoid approximation)
    S = np.pi * D * L * 0.8  # approximate wetted area

    # Frontal area
    A_frontal = np.pi * (D/2)**2

    # Friction drag (proportional to surface area)
    Re = rho * v * L / 0.001
    Cf = 0.075 / (np.log10(Re) - 2)**2 if Re > 100 else 0.01  # Schoenherr formula
    F_friction = 0.5 * rho * v**2 * Cf * S

    # Pressure drag (depends on shape — sharper taper = less wake)
    # Cd_pressure decreases with fineness ratio
    if fineness_ratio < 2:
        Cd_p = 0.5
    elif fineness_ratio < 4:
        Cd_p = 0.3 / fineness_ratio
    else:
        Cd_p = 0.05 / (fineness_ratio / 4)
    F_pressure = 0.5 * rho * v**2 * Cd_p * A_frontal

    return F_friction, F_pressure, F_friction + F_pressure, L, D

# Constant volume (same-size fish, different shapes)
volume = 0.0004  # m3 (400 mL — roughly hilsa-sized)

print("=== Drag vs Fineness Ratio (same volume) ===")
print(f"Volume: {volume*1000:.0f} mL | Speed: {v} m/s")
print()
print(f"{'Ratio':>6} {'L (cm)':>8} {'D (cm)':>8} {'Friction':>10} {'Pressure':>10} {'Total (N)':>10}")
print("-" * 54)

ratios = [1.5, 2, 2.5, 3, 4, 4.5, 5, 6, 7, 8, 10]
best_ratio = 0
min_drag = 999

for fr in ratios:
    Ff, Fp, Ft, L, D = total_drag(fr, volume)
    if Ft < min_drag:
        min_drag = Ft
        best_ratio = fr
    marker = " <-- min" if fr == best_ratio and fr == ratios[-1] else ""
    print(f"{fr:>6.1f} {L*100:>6.1f} {D*100:>6.1f} {Ff:>8.4f} {Fp:>8.4f} {Ft:>8.4f}{marker}")

# Find and display optimum
drags = [total_drag(fr, volume)[2] for fr in np.arange(2, 10, 0.1)]
opt_fr = np.arange(2, 10, 0.1)[np.argmin(drags)]
print(f"\\nOptimal fineness ratio: {opt_fr:.1f}")
print(f"Hilsa fineness ratio:   4.5")
print(f"Match: {'Excellent' if abs(opt_fr - 4.5) < 1 else 'Good'}")

# Compare real fish shapes
print()
print("=== Real Fish Shape Comparison ===")
fish = [
    ("Pufferfish", 1.5, 0.0005),
    ("Carp", 3.0, 0.001),
    ("Hilsa", 4.5, 0.0004),
    ("Barracuda", 8.0, 0.0006),
    ("Needlefish", 12.0, 0.0003),
]

print(f"{'Fish':<16} {'Ratio':>6} {'Total Drag (N)':>14} {'Efficiency':>12}")
print("-" * 50)

for name, fr, vol in fish:
    _, _, drag, _, _ = total_drag(fr, vol)
    eff = 1 / drag if drag > 0 else 0  # inverse drag = efficiency
    print(f"{name:<16} {fr:>6.1f} {drag:>12.4f} {eff:>10.0f}")`,
      challenge: 'A submarine designer wants minimum drag for a vessel of volume 1000 m3. What fineness ratio minimises total drag? How does the optimal ratio change at higher speeds (10 m/s vs 1 m/s)? At higher speeds, friction drag becomes relatively more important, shifting the optimum.',
      successHint: 'Streamlining is one of the most studied topics in engineering. The teardrop shape you see in aircraft fuselages, car bodies, train noses, and swim caps all come from the same optimisation: minimise the sum of friction drag and pressure drag. Nature solved this problem millions of years before engineers did.',
    },
    {
      title: 'Swimming energetics — the cost of migration',
      concept: `The total energy a hilsa needs for its migration depends on: distance, swimming speed, drag, muscle efficiency, and current conditions. The **cost of transport (CoT)** measures energy per unit distance per unit mass: **CoT = P / (m * v)**, where P is metabolic power, m is mass, and v is swimming speed.

There is an **optimal speed** that minimises CoT: too slow and the fish wastes time (and energy on basic metabolism); too fast and the v^3 power scaling makes swimming prohibitively expensive. This optimal speed is typically 1-2 body lengths per second for most fish.

In the code below, you will calculate the total energy budget for a hilsa's migration — from the Bay of Bengal to the Padma River spawning grounds — and determine how much body fat the fish needs to carry.`,
      analogy: 'A car has an optimal fuel-efficient speed — too slow and the engine runs inefficiently, too fast and air resistance dominates. Fish are the same. The optimal migration speed balances the "fixed costs" of being alive (metabolism) against the "variable cost" of swimming (drag power).',
      storyConnection: 'Hilsa stop eating when they begin their upstream migration — they rely entirely on stored body fat. A 500-gram hilsa might start with 30% body fat (150 grams of fat). At 37 kJ per gram of fat, that is 5,550 kJ of stored energy. If the migration costs 3,000 kJ, the fish arrives at the spawning ground with energy to spare. But if the journey is longer or the current stronger, the fish may arrive too depleted to spawn successfully.',
      checkQuestion: 'A hilsa has 150 g of body fat (37 kJ/g = 5,550 kJ total). The migration costs 12 kJ per km. How far can it swim before running out of energy?',
      checkAnswer: '5,550 / 12 = 462 km. This is more than enough for the typical 250 km migration, but leaves a safety margin for spawning activity and the return journey. Fish that start with less fat may not make it — natural selection ensures only well-fed hilsa successfully reproduce.',
      codeIntro: 'Calculate the complete energy budget for a hilsa migration from sea to spawning ground.',
      code: `import numpy as np

# Hilsa migration energy budget

# Fish parameters
mass_kg = 0.5       # 500 g hilsa
length_m = 0.35     # 35 cm
fat_fraction = 0.30  # 30% body fat
fat_energy_kJ_g = 37 # energy density of fish fat

# Drag parameters
rho = 1000
Cd = 0.06
A = 0.005  # frontal area

# Metabolic parameters
basal_rate_W = 0.05  # basal metabolic rate (just staying alive)
muscle_efficiency = 0.25

def migration_cost(speed_ms, distance_km, current_ms=0):
    """Calculate total energy cost of migration"""
    # Effective speed relative to water
    water_speed = speed_ms
    # Ground speed
    ground_speed = speed_ms - current_ms

    if ground_speed <= 0:
        return float('inf'), float('inf'), 0

    # Drag power (at water speed)
    F_drag = 0.5 * rho * water_speed**2 * Cd * A
    P_drag = F_drag * water_speed  # mechanical power

    # Metabolic power for swimming
    P_swim = P_drag / muscle_efficiency

    # Total metabolic power (swimming + basal)
    P_total = P_swim + basal_rate_W

    # Travel time
    time_s = (distance_km * 1000) / ground_speed
    time_hours = time_s / 3600

    # Total energy
    energy_kJ = P_total * time_s / 1000

    # Cost of transport
    cot = P_total / (mass_kg * ground_speed)

    return energy_kJ, time_hours, cot

# Energy available
fat_mass_g = mass_kg * 1000 * fat_fraction
total_energy_kJ = fat_mass_g * fat_energy_kJ_g

print("=== Hilsa Migration Energy Budget ===")
print(f"Mass: {mass_kg*1000:.0f} g | Fat: {fat_fraction*100:.0f}% ({fat_mass_g:.0f} g)")
print(f"Energy stored: {total_energy_kJ:.0f} kJ")
print()

# Find optimal speed (no current)
distance = 250  # km
print(f"=== Optimal Speed (still water, {distance} km) ===")
print(f"{'Speed':>8} {'Energy (kJ)':>12} {'Time (h)':>10} {'CoT':>10} {'Fat used %':>10}")
print("-" * 52)

best_speed = 0
min_energy = float('inf')

for v in np.arange(0.3, 2.5, 0.1):
    E, T, cot = migration_cost(v, distance, 0)
    fat_pct = E / total_energy_kJ * 100
    if E < min_energy:
        min_energy = E
        best_speed = v
    marker = " *" if abs(v - best_speed) < 0.05 else ""
    print(f"{v:>8.1f} {E:>10.0f} {T:>8.0f} {cot:>8.2f} {fat_pct:>8.1f}%{marker}")

print(f"\\nOptimal speed: {best_speed:.1f} m/s")
print(f"Minimum energy: {min_energy:.0f} kJ ({min_energy/total_energy_kJ*100:.1f}% of reserves)")

# Effect of river current
print()
print(f"=== Effect of River Current (speed = {best_speed} m/s) ===")
print(f"{'Current':>10} {'Energy (kJ)':>12} {'Time (h)':>10} {'Fat used %':>10} {'Feasible':>10}")
print("-" * 54)

for current in [0, 0.2, 0.4, 0.6, 0.8, 1.0]:
    E, T, cot = migration_cost(best_speed, distance, current)
    fat_pct = E / total_energy_kJ * 100
    feasible = "Yes" if fat_pct < 80 else "Barely" if fat_pct < 100 else "No"
    if E == float('inf'):
        print(f"{current:>10.1f} {'Cannot swim':>12} {'N/A':>10} {'N/A':>10} {'No':>10}")
    else:
        print(f"{current:>10.1f} {E:>10.0f} {T:>8.0f} {fat_pct:>8.1f}% {feasible:>10}")

# How much fat is needed?
print()
print("=== Minimum Fat Reserves Needed ===")
for current in [0, 0.3, 0.5]:
    E, _, _ = migration_cost(best_speed, distance, current)
    # Need energy for migration + spawning (30% extra) + return (optional)
    needed_kJ = E * 1.3  # 30% buffer for spawning
    fat_needed_g = needed_kJ / fat_energy_kJ_g
    fat_pct = fat_needed_g / (mass_kg * 1000) * 100
    print(f"Current {current} m/s: need {fat_needed_g:.0f} g fat ({fat_pct:.0f}% body weight)")`,
      challenge: 'During monsoon, the river current increases to 1.2 m/s in some stretches. At what speed must the hilsa swim to make progress? How much extra energy does this cost? Would it be more efficient to wait for the current to slow down? Calculate the "waiting cost" (basal metabolism while stationary) vs the "swimming cost" (higher energy but making progress).',
      successHint: 'You just built an energy budget model — the same approach ecologists use to predict animal migrations, conservationists use to design fish passages, and engineers use to design autonomous underwater vehicles. The optimal speed calculation is identical to finding a car\'s most fuel-efficient speed.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Drag, thrust, and fluid dynamics basics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model drag forces, swimming efficiency, and the physics of fish migration.
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
