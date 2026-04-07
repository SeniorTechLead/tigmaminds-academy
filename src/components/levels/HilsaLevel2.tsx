import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HilsaLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Bernoulli\'s principle — pressure drops where speed increases',
      concept: `**Bernoulli's equation** states that for an ideal fluid flowing along a streamline: **P + 0.5*rho*v^2 + rho*g*h = constant**. This means that where flow speed increases, pressure decreases, and vice versa.

This principle explains lift on airplane wings, the curve of a spinning ball, and how fish sense their surroundings. When water flows faster over the curved top of a fish's body, the pressure drops — this creates a pressure distribution that the fish's lateral line organ can sense.

For fish swimming, Bernoulli's principle also explains why swimming near the riverbed or near other fish reduces energy cost: the flow field interactions create regions of reduced velocity where less effort is needed.`,
      analogy: 'Hold two sheets of paper vertically, close together, and blow between them. They move toward each other, not apart. The fast-moving air between them has lower pressure (Bernoulli), so the higher pressure outside pushes them together. This counterintuitive result is Bernoulli in action.',
      storyConnection: 'Hilsa are known to swim in tight schools during migration. Bernoulli\'s principle partly explains why: each fish creates a flow pattern that reduces drag on its neighbours. A fish swimming in the wake of the fish ahead encounters lower-speed water and spends less energy. The school collectively saves 10-30% energy compared to solo swimming.',
      checkQuestion: 'Water flows through a pipe that narrows from 10 cm to 5 cm diameter. If the speed in the wide section is 1 m/s, what is the speed in the narrow section? (Use continuity: A1*v1 = A2*v2)',
      checkAnswer: 'A1 = pi*(0.05)^2, A2 = pi*(0.025)^2. A1/A2 = (0.05/0.025)^2 = 4. So v2 = 4 * v1 = 4 m/s. The speed quadruples when the pipe diameter halves. By Bernoulli, the pressure in the narrow section drops significantly.',
      codeIntro: 'Apply Bernoulli\'s equation to model pressure distribution around a swimming hilsa.',
      code: `import numpy as np

# Bernoulli's equation: P + 0.5*rho*v^2 + rho*g*h = constant
# For horizontal flow: P1 + 0.5*rho*v1^2 = P2 + 0.5*rho*v2^2

rho = 1000  # water density

def bernoulli_pressure(v1, P1, v2):
    """Calculate P2 given P1, v1, v2 (horizontal flow)"""
    return P1 + 0.5 * rho * (v1**2 - v2**2)

# Pressure distribution around a fish body
# Model: flow accelerates over the widest part, then decelerates
print("=== Pressure Distribution Around a Hilsa ===")
print("Flow approaches at 1 m/s from the left")
print()

v_freestream = 1.0  # m/s
P_freestream = 101325  # Pa (1 atm)

# Position along the fish body (fraction of body length)
positions = [
    ("Nose (stagnation)", 0.00, 0.0),
    ("Forehead", 0.05, 0.8),
    ("Head widening", 0.15, 1.1),
    ("Max width", 0.30, 1.35),
    ("Mid body", 0.50, 1.20),
    ("Narrowing", 0.70, 1.10),
    ("Tail base", 0.85, 0.95),
    ("Tail tip", 0.95, 1.05),
    ("Wake (behind)", 1.10, 0.7),
]

print(f"{'Position':<24} {'x/L':>5} {'Speed (m/s)':>12} {'P - P0 (Pa)':>12}")
print("-" * 56)

for name, x_frac, v_local in positions:
    v = v_freestream * v_local
    dP = 0.5 * rho * (v_freestream**2 - v**2)
    print(f"{name:<24} {x_frac:>5.2f} {v:>10.2f} {dP:>10.1f}")

print()
print("Negative dP = lower pressure (suction)")
print("Positive dP = higher pressure (push)")
print("The fish feels this pressure pattern through its lateral line!")

# Pipe flow demonstration
print()
print("=== Bernoulli in a Constricting Channel ===")
print("(Models water flowing between rocks where hilsa rest)")
print()
print(f"{'Width (m)':>10} {'Speed (m/s)':>12} {'Pressure (kPa)':>16}")
print("-" * 40)

channel_flow = 2.0  # m3/s per metre depth
widths = [5.0, 3.0, 2.0, 1.0, 0.5]
v1 = channel_flow / widths[0]
P1 = 101.325  # kPa

for w in widths:
    v = channel_flow / w
    P = P1 + 0.5 * rho * (v1**2 - v**2) / 1000
    print(f"{w:>10.1f} {v:>10.2f} {P:>14.1f}")

print()
print("As the channel narrows, speed increases and pressure drops.")
print("Hilsa use narrow channels strategically — the low pressure")
print("zone near constrictions helps them conserve energy.")`,
      challenge: 'A hilsa rests behind a rock in a river. The flow speed upstream of the rock is 1.5 m/s. In the wake behind the rock, it drops to 0.3 m/s. Calculate the pressure difference. This pressure differential is what the fish "feels" and uses to find energy-saving positions.',
      successHint: 'Bernoulli\'s principle is everywhere: it explains how carburetors mix fuel and air, how water towers work, how flying works, and how fish sense water flow. The trade-off between pressure and velocity energy is one of the most powerful concepts in physics.',
    },
    {
      title: 'Flow velocity profiles — why fish swim where they do',
      concept: `In a river, water does not flow at the same speed everywhere. Near the riverbed and banks, friction slows the water to nearly zero — this is the **boundary layer**. In the centre of the channel, the flow reaches maximum speed. The velocity profile across a river cross-section follows a roughly **logarithmic** pattern.

The velocity at any height z above the riverbed is approximately: **v(z) = (v*/kappa) * ln(z/z0)**, where v* is the shear velocity (related to riverbed roughness), kappa is the von Karman constant (0.41), and z0 is the roughness length.

Fish are smart about exploiting this profile. During upstream migration, hilsa swim near the riverbed where the current is slowest — sometimes just centimetres above the bottom. When resting, they find eddies behind rocks or in channel bends where the local velocity is nearly zero.`,
      analogy: 'Watch water in a bathtub drain. The surface spins fast, but water touching the tub sides barely moves — friction holds it back. A river cross-section works the same way: fast in the middle, slow at the edges. Fish swim at the slow edges, like cyclists drafting in the wind shadow of a truck.',
      storyConnection: 'Sundarbans fishermen know that hilsa during migration swim close to the riverbed, especially in strong currents. They set their nets accordingly — low to the bottom in fast channels, higher in the water column in slower reaches. This traditional knowledge aligns perfectly with the boundary layer velocity profile.',
      checkQuestion: 'If the surface current is 2 m/s and the boundary layer velocity profile is logarithmic, what is the approximate speed at 10% of the depth from the bottom?',
      checkAnswer: 'At the bottom the speed is zero, and it increases logarithmically. At 10% depth, the speed is roughly 60-70% of the surface speed, so about 1.2-1.4 m/s. Near the very bottom (1% depth), it can be only 30% of surface speed — 0.6 m/s. This is where migrating hilsa swim.',
      codeIntro: 'Model the velocity profile across a river and find the energy-optimal swimming depth.',
      code: `import numpy as np

# River velocity profile model
# v(z) = (v_star / kappa) * ln(z / z0)

kappa = 0.41     # von Karman constant
z0 = 0.01        # roughness length (m) — sandy riverbed

def velocity_profile(depth_m, surface_speed_ms, n_points=50):
    """Calculate velocity at different heights above riverbed"""
    # Determine shear velocity from surface speed
    v_star = surface_speed_ms * kappa / np.log(depth_m / z0)

    heights = np.linspace(z0 * 2, depth_m, n_points)
    velocities = (v_star / kappa) * np.log(heights / z0)
    return heights, velocities, v_star

# Padma River during monsoon migration
river_depth = 8.0  # metres
surface_speed = 2.0  # m/s

heights, velocities, v_star = velocity_profile(river_depth, surface_speed)

print("=== Padma River Velocity Profile ===")
print(f"Depth: {river_depth} m | Surface speed: {surface_speed} m/s")
print(f"Shear velocity: {v_star:.3f} m/s")
print()
print(f"{'Height (m)':>12} {'% Depth':>8} {'Speed (m/s)':>12} {'% Surface':>10}")
print("-" * 44)

check_heights = [0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 4.0, 6.0, 8.0]
for h in check_heights:
    if h < z0 * 2:
        continue
    v = (v_star / kappa) * np.log(h / z0)
    pct_depth = h / river_depth * 100
    pct_surface = v / surface_speed * 100
    print(f"{h:>12.2f} {pct_depth:>6.0f}% {v:>10.2f} {pct_surface:>8.0f}%")

# Energy cost at different swimming depths
print()
print("=== Migration Energy vs Swimming Depth ===")
print("Hilsa swimming upstream at ground speed 0.5 m/s")
print()

rho = 1000
Cd = 0.06
A = 0.005
mass = 0.5
eff = 0.25
ground_speed = 0.5
distance = 100  # km

print(f"{'Depth (m)':>10} {'Current':>10} {'Water speed':>12} {'Drag (N)':>10} {'Energy (kJ)':>12}")
print("-" * 56)

for swim_depth in [0.1, 0.3, 0.5, 1.0, 2.0, 4.0, 6.0]:
    current = (v_star / kappa) * np.log(swim_depth / z0)
    water_speed = ground_speed + current  # must swim faster than current
    drag = 0.5 * rho * water_speed**2 * Cd * A
    power = drag * water_speed / eff
    time_s = distance * 1000 / ground_speed
    energy = power * time_s / 1000
    print(f"{swim_depth:>10.1f} {current:>8.2f} {water_speed:>10.2f} {drag:>8.4f} {energy:>10.0f}")

print()
print("Swimming near the bottom saves enormous energy!")
print("At 0.1 m depth: current is slowest, drag is lowest.")
print("This is why migrating hilsa hug the riverbed.")

# Effect of riverbed roughness
print()
print("=== Effect of Riverbed Type ===")
beds = [("Smooth mud", 0.001), ("Sandy", 0.01), ("Gravel", 0.05), ("Rocky", 0.20)]
swim_h = 0.3  # 30 cm above bottom

print(f"Velocity at {swim_h} m above bottom (surface = {surface_speed} m/s):")
for name, z0_val in beds:
    v_s = surface_speed * kappa / np.log(river_depth / z0_val)
    v_local = (v_s / kappa) * np.log(swim_h / z0_val)
    print(f"  {name:<16} v = {v_local:.2f} m/s (rougher bed = slower near-bottom flow)")`,
      challenge: 'A dam creates a deep, slow reservoir (15 m deep, 0.3 m/s surface). Below the dam, the river is shallow and fast (3 m deep, 3 m/s surface). Calculate velocity profiles for both. At what depth should the hilsa swim in each section? This analysis helps design fish passages.',
      successHint: 'Velocity profiles are essential in hydraulic engineering, environmental science, and marine biology. The same logarithmic profile applies to wind over terrain, giving us the "wind gradient" that wind turbine engineers and sailors use to optimise their designs.',
    },
    {
      title: 'Flow energy — kinetic and potential energy in moving water',
      concept: `A river carries enormous amounts of energy in two forms: **kinetic energy** (from the motion of the water) and **potential energy** (from the elevation of the water). The total energy per unit weight is called the **specific energy**: **E = y + v^2/(2g)**, where y is the water depth and v is the flow velocity.

A fascinating phenomenon occurs in rivers: when water flows over a shallow section (like rapids), it speeds up and depth decreases. When it reaches a deeper pool, it slows and depth increases. The total specific energy is approximately conserved (minus friction losses).

The **Froude number** (Fr = v / sqrt(g*y)) tells us the flow regime: Fr < 1 is **subcritical** (deep, slow — river pools), Fr > 1 is **supercritical** (shallow, fast — rapids). At Fr = 1, a **hydraulic jump** can occur — a sudden transition from fast-shallow to slow-deep flow.`,
      analogy: 'Think of a roller coaster. At the top of a hill: slow speed, high position (potential energy). At the bottom: fast speed, low position (kinetic energy). Total energy stays the same (minus friction). A river does the same — water trades depth (potential) for speed (kinetic) as the channel shape changes.',
      storyConnection: 'Hilsa migrating upstream must navigate both rapids (supercritical flow — fast and shallow) and pools (subcritical — deep and slow). In rapids, the current is too strong to swim against directly, so hilsa exploit eddies and boundary layers near rocks. In pools, they cruise easily in the slow deep water. Understanding flow energy helps explain the route hilsa choose through the river.',
      checkQuestion: 'Water in a river pool is 3 m deep and flowing at 0.5 m/s. What is the specific energy? The Froude number?',
      checkAnswer: 'E = 3 + 0.5^2/(2*9.81) = 3 + 0.0127 = 3.013 m. Fr = 0.5/sqrt(9.81*3) = 0.5/5.42 = 0.092. Fr < 1 means subcritical flow — deep and tranquil. Most of the energy is in depth (potential), very little in velocity (kinetic).',
      codeIntro: 'Calculate specific energy and Froude number along a river reach with changing depth.',
      code: `import numpy as np

# Flow energy and Froude number analysis
g = 9.81

def specific_energy(depth, velocity):
    """E = y + v^2/(2g)"""
    return depth + velocity**2 / (2 * g)

def froude_number(velocity, depth):
    """Fr = v / sqrt(g*y)"""
    return velocity / np.sqrt(g * depth)

# River cross-section with varying depth
# Model a reach with a pool, riffle, and another pool
river_km = np.linspace(0, 5, 50)  # 5 km reach

# Bed profile (depth varies)
bed_depth = 4 + 2 * np.sin(np.pi * river_km / 2.5) + np.random.RandomState(42).normal(0, 0.2, 50)
bed_depth = np.maximum(bed_depth, 0.5)

# Flow rate is constant (continuity): Q = v * A = v * depth * width
Q_per_width = 3.0  # m3/s per metre of width (discharge)
width = 100  # m (river width)
Q = Q_per_width

velocities = Q / bed_depth
energies = specific_energy(bed_depth, velocities)
froudes = froude_number(velocities, bed_depth)

print("=== River Flow Energy Profile ===")
print(f"Discharge: {Q:.1f} m2/s per unit width")
print()
print(f"{'km':>5} {'Depth (m)':>10} {'Speed (m/s)':>12} {'Energy (m)':>12} {'Fr':>6} {'Regime':<14}")
print("-" * 62)

for i in range(0, len(river_km), 5):
    regime = "Subcritical" if froudes[i] < 0.9 else "Critical" if froudes[i] < 1.1 else "Supercritical"
    print(f"{river_km[i]:>5.1f} {bed_depth[i]:>8.2f} {velocities[i]:>10.2f} "
          f"{energies[i]:>10.3f} {froudes[i]:>5.2f} {regime:<14}")

# Specific energy diagram (E vs y for constant Q)
print()
print("=== Specific Energy Diagram (constant Q) ===")
print(f"{'Depth (m)':<12} {'Velocity':>10} {'KE':>8} {'PE':>8} {'Total E':>8} {'Fr':>6}")
print("-" * 54)

depths_test = np.arange(0.3, 8.0, 0.5)
for y in depths_test:
    v = Q / y
    KE = v**2 / (2 * g)
    PE = y
    E = KE + PE
    Fr = froude_number(v, y)
    print(f"{y:<12.1f} {v:>8.2f} {KE:>6.3f} {PE:>6.1f} {E:>6.3f} {Fr:>5.2f}")

# Critical depth (where E is minimum)
y_c = (Q**2 / g) ** (1/3)
v_c = Q / y_c
E_c = specific_energy(y_c, v_c)
print(f"\\nCritical depth: {y_c:.2f} m (Fr = 1.0)")
print(f"Critical velocity: {v_c:.2f} m/s")
print(f"Minimum energy: {E_c:.3f} m")

# Hilsa strategy
print()
print("=== Hilsa Migration Strategy ===")
print(f"In deep pools (y > {y_c*2:.1f} m): current is slow, swim easily")
print(f"At riffles (y ~ {y_c:.1f} m): current is fastest, use rocks for shelter")
print(f"In rapids (y < {y_c*0.7:.1f} m): supercritical flow, may need to leap")`,
      challenge: 'A weir creates a hydraulic jump where supercritical flow (depth 0.3 m, speed 4 m/s) transitions to subcritical flow. Using energy conservation (approximately), what is the downstream depth and velocity? Hilsa must navigate this turbulent jump zone during migration.',
      successHint: 'Specific energy and Froude number are the foundation of open channel hydraulics — the engineering of rivers, canals, spillways, and drainage systems. The energy diagram you just explored is the same tool engineers use to design every hydraulic structure on Earth.',
    },
    {
      title: 'Schooling hydrodynamics — the energy savings of swimming together',
      concept: `Fish swimming in schools save energy by exploiting the **wake vortices** (spinning water masses) left by the fish ahead. Each tail beat creates two counter-rotating vortices. The fish behind can position itself to catch the "push" from these vortices, reducing the drag it experiences.

The energy savings depend on the **spacing** and **phase** of the fish. Optimal spacing is about **0.5-0.7 body lengths** behind the fish ahead. At this distance, the wake vortices are still strong enough to provide a meaningful thrust boost. Too close and the fish collides; too far and the vortices dissipate.

Studies show schooling fish save **10-30%** of their energy compared to solo swimming. For a migration of hundreds of kilometres, this savings can mean the difference between arriving with enough energy to spawn or dying en route.`,
      analogy: 'Cyclists in a peloton draft behind each other, saving up to 40% of their energy. The lead cyclist pushes through the air, creating a low-pressure wake. Followers ride in this wake, experiencing less drag. Fish schooling works on the same principle but in three dimensions — and the vortex interactions provide additional thrust, not just reduced drag.',
      storyConnection: 'Hilsa form massive schools during migration — sometimes millions of fish in a single formation. Fishermen call these schools "ilish jhank" and can spot them by the characteristic surface rippling. The school moves as a coordinated unit, with fish at the rear cycling to the front when they tire (like birds in a V-formation), sharing the energy cost of leading.',
      checkQuestion: 'A solo hilsa uses 100 kJ to swim 10 km. In a school, each fish saves 20% energy. How much energy does each fish in a school of 1000 use for the same distance?',
      checkAnswer: 'Each fish uses 100 * 0.80 = 80 kJ — a savings of 20 kJ per fish. For 1000 fish, the school collectively saves 20,000 kJ. But the savings are not equal: fish in the middle save more than those at the edges, and the lead fish saves nothing.',
      codeIntro: 'Model the energy savings of schooling fish at different formations and spacings.',
      code: `import numpy as np

# Fish schooling energy model

rho = 1000
Cd_solo = 0.06
A = 0.005

def solo_drag(v):
    return 0.5 * rho * v**2 * Cd_solo * A

def school_drag(v, position_in_school, spacing_BL, school_size):
    """
    Calculate drag for a fish at a given position in a school.
    spacing_BL: inter-fish spacing in body lengths
    position: 0 = leader, higher = further back
    """
    body_length = 0.35  # m
    spacing_m = spacing_BL * body_length

    if position_in_school == 0:
        # Leader: no savings (actually slightly worse due to induced drag)
        return solo_drag(v) * 1.02

    # Wake energy decays with distance
    # Savings increase to a maximum then decrease
    decay = np.exp(-0.3 * position_in_school * spacing_BL)
    # Lateral position effect (centre vs edge)
    wake_benefit = 0.30 * decay  # max 30% savings for optimal position

    # Interference at very close spacing
    if spacing_BL < 0.3:
        wake_benefit *= spacing_BL / 0.3  # reduced benefit when too close

    effective_Cd = Cd_solo * (1 - wake_benefit)
    return 0.5 * rho * v**2 * effective_Cd * A

v = 0.8  # m/s cruise speed
solo = solo_drag(v)

print("=== Schooling Energy Savings ===")
print(f"Swimming speed: {v} m/s | Solo drag: {solo:.4f} N")
print()

# Effect of spacing
print("--- Effect of Inter-Fish Spacing ---")
print(f"{'Spacing (BL)':>12} {'Drag (N)':>10} {'Savings %':>10}")
print("-" * 34)

for spacing in [0.2, 0.3, 0.5, 0.7, 1.0, 1.5, 2.0, 3.0]:
    d = school_drag(v, 2, spacing, 10)  # position 2 in school
    savings = (1 - d / solo) * 100
    print(f"{spacing:>12.1f} {d:>8.4f} {savings:>8.1f}%")

# Effect of position in school
print()
print("--- Energy by Position (spacing = 0.6 BL) ---")
print(f"{'Position':>10} {'Drag (N)':>10} {'Savings %':>10} {'Role':<14}")
print("-" * 46)

roles = ["Leader", "2nd", "3rd", "4th", "5th", "Middle",
         "Middle", "Middle", "Rear", "Last"]

school_size = 10
total_drag = 0
for pos in range(school_size):
    d = school_drag(v, pos, 0.6, school_size)
    savings = (1 - d / solo) * 100
    role = roles[min(pos, len(roles)-1)]
    total_drag += d
    print(f"{pos:>10} {d:>8.4f} {savings:>8.1f}% {role:<14}")

avg_drag = total_drag / school_size
avg_savings = (1 - avg_drag / solo) * 100
print(f"\\nAverage school drag: {avg_drag:.4f} N (savings: {avg_savings:.1f}%)")

# Migration energy comparison
print()
print("=== Migration Energy: Solo vs School ===")
distance = 250  # km
mass = 0.5
eff = 0.25
basal = 0.05  # W

time_s = distance * 1000 / v
power_solo = solo * v / eff + basal
power_school = avg_drag * v / eff + basal

E_solo = power_solo * time_s / 1000
E_school = power_school * time_s / 1000

fat_energy = 37  # kJ/g

print(f"Distance: {distance} km at {v} m/s")
print(f"Solo:   {E_solo:.0f} kJ ({E_solo/fat_energy:.0f} g fat)")
print(f"School: {E_school:.0f} kJ ({E_school/fat_energy:.0f} g fat)")
print(f"Fat saved per fish: {(E_solo-E_school)/fat_energy:.0f} g")
print(f"\\nFor a school of 10,000 fish:")
print(f"Total fat saved: {(E_solo-E_school)/fat_energy*10000/1000:.0f} kg!")`,
      challenge: 'Model a "rotating leadership" strategy where the leader swaps every 10 minutes. Compare the energy distribution to a fixed-leader school. Does rotating leadership make the school more equitable? What is the optimal rotation period?',
      successHint: 'Schooling hydrodynamics is an active research field with applications in autonomous vehicle platoons (truck convoys save fuel by drafting), drone swarm design, and wind farm layout (wake interactions between turbines). The physics of swimming together transfers directly to engineering challenges.',
    },
    {
      title: 'Vortex shedding — when flow patterns repeat',
      concept: `When water flows past an object, **vortices** (spinning whirlpools) can shed alternately from each side, creating a pattern called a **von Karman vortex street**. The frequency of shedding is given by the **Strouhal number**: **St = f*D/v**, where f is the shedding frequency, D is the object's diameter, and v is the flow speed.

For circular cylinders, St is approximately **0.21** across a wide range of Reynolds numbers. This means the shedding frequency is predictable: **f = 0.21 * v / D**. These oscillating vortices create alternating forces that can cause the object (or fish) to vibrate.

Fish actually exploit vortex shedding — they match their tail beat frequency to the natural vortex shedding frequency of their body, creating a resonant thrust mechanism that is more efficient than fighting against the vortices.`,
      analogy: 'Drag your finger through still water. Notice the alternating ripples that form on each side of the wake? Those are vortices. They alternate left-right at a regular frequency. A flagpole in wind does the same — each "flap" of the flag corresponds to a vortex shedding from one side.',
      storyConnection: 'When river water flows past bridge piers in the Padma, the vortex shedding creates visible whirlpools downstream. Hilsa are known to use these vortices to their advantage — positioning themselves in the still centre of a vortex or riding the energy of the rotating water to gain thrust with minimal effort. This "vortex surfing" is one of the hilsa\'s most efficient swimming strategies.',
      checkQuestion: 'A bridge pier is 2 m in diameter and the river flows at 1.5 m/s. If St = 0.21, what is the vortex shedding frequency?',
      checkAnswer: 'f = St * v / D = 0.21 * 1.5 / 2 = 0.158 Hz. One vortex sheds every 6.3 seconds — slow enough to see as a visible swirl in the water. A fish swimming near this pier would feel the alternating push from each vortex.',
      codeIntro: 'Model vortex shedding from obstacles in a river and the forces on a fish nearby.',
      code: `import numpy as np

# Vortex shedding and Strouhal number analysis

St = 0.21  # Strouhal number for circular objects

def vortex_frequency(v_flow, diameter):
    """Shedding frequency from St = f*D/v"""
    return St * v_flow / diameter

def vortex_force(v_flow, diameter, rho=1000):
    """Oscillating lift force from vortex shedding"""
    # Cl oscillates ~ 0.3-1.0 for cylinders
    Cl = 0.6
    A_projected = diameter * 1.0  # per unit length
    F_amplitude = 0.5 * rho * v_flow**2 * Cl * A_projected
    return F_amplitude

# River obstacles
obstacles = [
    {"name": "Tree root", "diameter": 0.1, "flow_speed": 1.0},
    {"name": "Submerged rock", "diameter": 0.5, "flow_speed": 1.5},
    {"name": "Bridge pier", "diameter": 2.0, "flow_speed": 2.0},
    {"name": "Hilsa body", "diameter": 0.06, "flow_speed": 0.8},
    {"name": "Anchored boat", "diameter": 1.5, "flow_speed": 1.0},
]

print("=== Vortex Shedding from River Obstacles ===")
print(f"{'Obstacle':<18} {'Dia (m)':>8} {'Speed':>8} {'Freq (Hz)':>10} {'Period (s)':>10}")
print("-" * 56)

for obs in obstacles:
    f = vortex_frequency(obs["flow_speed"], obs["diameter"])
    period = 1 / f if f > 0 else 0
    print(f"{obs['name']:<18} {obs['diameter']:>6.2f} {obs['flow_speed']:>6.1f} "
          f"{f:>8.2f} {period:>8.2f}")

# Time-series of vortex-induced oscillation
print()
print("=== Vortex Force on a Bridge Pier (time series) ===")
pier_d = 2.0
flow_v = 1.5
f_shed = vortex_frequency(flow_v, pier_d)
F_amp = vortex_force(flow_v, pier_d)

print(f"Pier diameter: {pier_d} m | Flow: {flow_v} m/s")
print(f"Shedding frequency: {f_shed:.3f} Hz | Force amplitude: {F_amp:.0f} N/m")
print()

t = np.linspace(0, 30, 60)
force = F_amp * np.sin(2 * np.pi * f_shed * t)

print(f"{'Time (s)':>8} {'Force (N/m)':>12} {'Direction':<10}")
print("-" * 32)
for i in range(0, len(t), 6):
    direction = "Left" if force[i] > 0 else "Right"
    bar = "+" * int(abs(force[i]) / F_amp * 10)
    print(f"{t[i]:>8.1f} {force[i]:>10.0f} {direction:<4} {bar}")

# Optimal tail beat frequency
print()
print("=== Optimal Tail Beat for Vortex Resonance ===")
body_d = 0.06  # hilsa max body diameter

for v in [0.5, 0.8, 1.0, 1.5, 2.0]:
    f_natural = vortex_frequency(v, body_d)
    print(f"At {v} m/s: natural shedding = {f_natural:.1f} Hz, "
          f"optimal tail beat ~ {f_natural:.1f} Hz")

print()
print("Fish that match their tail beat to the natural vortex")
print("frequency create constructive interference — more thrust")
print("from the same muscle effort. Evolution tuned this match!")`,
      challenge: 'A fish passage around a dam has cylindrical baffles (10 cm diameter) spaced 1 m apart. At flow speed 0.8 m/s, what is the shedding frequency? If a hilsa swims through at 0.5 m/s ground speed, how many vortex cycles does it experience per baffle? This determines whether the passage helps or hinders the fish.',
      successHint: 'Vortex shedding caused the spectacular collapse of the Tacoma Narrows Bridge in 1940 — wind-induced vortices matched the bridge\'s natural frequency, causing catastrophic resonance. Understanding vortex frequency is critical in bridge design, chimney engineering, heat exchanger design, and marine engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Bernoulli, flow profiles, and schooling hydrodynamics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model Bernoulli\'s principle, velocity profiles, and fish schooling energy dynamics.
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
