import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PambanLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Forces on a bridge — tension, compression, and equilibrium',
      concept: `Every bridge must resist two fundamental forces: **compression** (squeezing) and **tension** (stretching). When a train crosses the Pamban Bridge, its weight pushes down, compressing the bridge deck and piers. The bridge structure must redirect these forces safely to the ground through a combination of compression in vertical members and tension in horizontal or diagonal members.

For a bridge to stand, all forces must be in **equilibrium** — every push must be balanced by an equal and opposite push. If any force is unbalanced, the structure accelerates (moves, bends, or collapses). The engineer's job is to design a structure where every member is in equilibrium under the expected loads.

In the code below, you will calculate the forces in a simple beam bridge under different loading conditions. This is the starting point for understanding the Pamban Bridge's cantilever design.

*Equilibrium means the sum of all forces equals zero (no acceleration) and the sum of all moments (torques) equals zero (no rotation). These two conditions — force balance and moment balance — are the foundation of all structural engineering.*`,
      analogy: 'Imagine holding a heavy book on your outstretched palm. Your hand pushes up (reaction force) to balance the book pushing down (gravity). Your arm is in compression (like a bridge pier), and your shoulder muscles are in tension (like a bridge cable). If your muscles are not strong enough, your arm drops — equilibrium is lost.',
      storyConnection: 'The Pamban Bridge connects Rameswaram island to mainland India across the Palk Strait. Opened in 1914, it was India\'s first sea bridge. The engineers faced extreme conditions: strong tidal currents, cyclone winds, and corrosive salt spray. Every member of the bridge had to be designed to handle these forces with a safety margin.',
      checkQuestion: 'A 100-ton train is at the centre of a 50-metre beam bridge. What is the reaction force at each support?',
      checkAnswer: 'By symmetry, each support carries half the weight: 50 tons each. In Newtons: 100,000 kg x 9.81 m/s squared = 981,000 N total, so 490,500 N (490.5 kN) per support. This is the starting point for calculating the internal forces in every bridge member.',
      codeIntro: 'Calculate support reactions and internal forces for a simple beam bridge.',
      code: `import numpy as np

def beam_reactions(span_m, loads):
    """Calculate support reactions for a simply supported beam.
    loads: list of (position_m, force_N) tuples
    Returns (reaction_A, reaction_B) at positions 0 and span_m
    """
    # Moment about A = 0: sum(F_i * x_i) = R_B * span
    total_moment_A = sum(force * pos for pos, force in loads)
    R_B = total_moment_A / span_m

    # Vertical equilibrium: R_A + R_B = sum(forces)
    total_force = sum(force for _, force in loads)
    R_A = total_force - R_B

    return R_A, R_B

def max_bending_moment(span_m, loads):
    """Find maximum bending moment along the beam."""
    max_M = 0
    max_x = 0
    R_A, R_B = beam_reactions(span_m, loads)

    for x in np.linspace(0, span_m, 200):
        M = R_A * x
        for pos, force in loads:
            if pos <= x:
                M -= force * (x - pos)
        if abs(M) > abs(max_M):
            max_M = M
            max_x = x

    return max_M, max_x

# Pamban Bridge: simplified as a beam
span = 56  # metres (one span of the bridge)
g = 9.81

print("=== Pamban Bridge: Force Analysis ===")
print(f"Span length: {span} m")
print()

# Case 1: Single train at centre
train_mass = 100000  # kg (100 tons)
train_weight = train_mass * g
loads_centre = [(span / 2, train_weight)]

R_A, R_B = beam_reactions(span, loads_centre)
M_max, M_x = max_bending_moment(span, loads_centre)

print("Case 1: 100-ton train at centre")
print(f"  Support A reaction: {R_A/1000:>8.1f} kN ({R_A/g/1000:.1f} tons)")
print(f"  Support B reaction: {R_B/1000:>8.1f} kN ({R_B/g/1000:.1f} tons)")
print(f"  Max bending moment: {M_max/1000:>8.1f} kN*m at x = {M_x:.1f} m")
print()

# Case 2: Train at quarter span
loads_quarter = [(span / 4, train_weight)]
R_A, R_B = beam_reactions(span, loads_quarter)
M_max, M_x = max_bending_moment(span, loads_quarter)

print("Case 2: 100-ton train at quarter span")
print(f"  Support A reaction: {R_A/1000:>8.1f} kN")
print(f"  Support B reaction: {R_B/1000:>8.1f} kN")
print(f"  Max bending moment: {M_max/1000:>8.1f} kN*m at x = {M_x:.1f} m")
print()

# Case 3: Two trains
loads_two = [(span * 0.3, train_weight), (span * 0.7, train_weight)]
R_A, R_B = beam_reactions(span, loads_two)
M_max, M_x = max_bending_moment(span, loads_two)

print("Case 3: Two 100-ton trains")
print(f"  Support A reaction: {R_A/1000:>8.1f} kN")
print(f"  Support B reaction: {R_B/1000:>8.1f} kN")
print(f"  Max bending moment: {M_max/1000:>8.1f} kN*m at x = {M_x:.1f} m")
print()

# Bending moment diagram for centre load
print("=== Bending Moment Diagram (centre load) ===")
R_A, _ = beam_reactions(span, loads_centre)
for x in range(0, span + 1, 4):
    M = R_A * x
    for pos, force in loads_centre:
        if pos <= x:
            M -= force * (x - pos)
    bar = "#" * int(abs(M) / 50000)
    print(f"  x={x:>3}m  M={M/1000:>8.0f} kN*m  {bar}")`,
      challenge: 'Add a distributed load (self-weight of the bridge): 5 kN/m along the entire span. Calculate the reactions and maximum bending moment with both self-weight and a centred train. How much of the bending moment comes from self-weight alone?',
      successHint: 'You just performed a structural analysis — the same calculation civil engineers do for every bridge, building, and tower. The principles of equilibrium you applied were formalized by Isaac Newton and are the foundation of all structural engineering.',
    },
    {
      title: 'Beam types — simply supported, cantilever, and continuous',
      concept: `Not all bridges are the same. The three basic beam types have very different force distributions. A **simply supported beam** rests on two supports with no resistance to rotation. A **cantilever beam** is fixed at one end and free at the other (like a diving board). A **continuous beam** spans multiple supports.

The Pamban Bridge uses a combination: most spans are simply supported, but the central navigational span is a **Scherzer rolling bascule** — a counterweighted cantilever that can lift to allow ships to pass. Understanding the cantilever principle is key to understanding how this movable span works.

In the code below, you will compare the bending moment distributions for these three beam types under the same load. The results show why cantilever designs are used for movable bridges and long spans.

*The maximum bending moment determines the beam size needed. A lower maximum moment means a lighter, cheaper beam. Different beam types redistribute the moment in different ways, creating opportunities for optimization.*`,
      analogy: 'A simply supported beam is like a plank resting on two sawhorses — it can flex and rotate at the supports. A cantilever is like a shelf bracket — fixed firmly at the wall, hanging free at the other end. A continuous beam is like a long rail resting on multiple ties — the supports share the load.',
      storyConnection: 'The Pamban Bridge\'s bascule span rotates upward by rolling along a curved track, like a rocking chair. The counterweight on the short end balances the weight of the long end, so only a small force is needed to lift the entire span. This is the cantilever principle in action — the fixed end provides the moment needed to support the free end.',
      checkQuestion: 'A 10-metre cantilever beam (fixed at the left end) has a 50 kN load at the free end. What is the moment at the fixed end?',
      checkAnswer: 'Moment = Force x Distance = 50 kN x 10 m = 500 kN*m. This is the moment that the fixed support must resist. Compare this to a simply supported beam of the same span with the same centre load: M_max = 50 x 5 = 250 kN*m. The cantilever has double the maximum moment — that is why cantilevers need stronger supports.',
      codeIntro: 'Compare force distributions across three bridge beam types.',
      code: `import numpy as np

def simply_supported_moment(x, span, P, load_pos):
    """Bending moment at position x for simply supported beam."""
    R_A = P * (span - load_pos) / span
    if x <= load_pos:
        return R_A * x
    else:
        return R_A * x - P * (x - load_pos)

def cantilever_moment(x, length, P, load_pos):
    """Bending moment for cantilever (fixed at x=0, free at x=length)."""
    if x <= load_pos:
        return -P * (load_pos - x)
    else:
        return 0

def continuous_two_span_moment(x, span, P, load_pos):
    """Approximate bending moment for two-span continuous beam.
    Total length = 2*span, middle support at x=span.
    Load on first span.
    """
    # Simplified: moment redistribution reduces peak by ~20%
    if x <= span:
        ss_moment = simply_supported_moment(x, span, P, load_pos)
        # Hogging moment at middle support
        M_middle = -P * load_pos * (span - load_pos) / (4 * span)
        redistribution = M_middle * x / span
        return ss_moment + redistribution
    else:
        x2 = x - span
        return -P * load_pos * (span - load_pos) / (4 * span) * (1 - x2 / span)

span = 56  # metres
P = 981  # kN (100 tons)
load_pos = span / 2

print("=== Comparison of Beam Types ===")
print(f"Span: {span}m | Load: {P} kN at midspan")
print()

# Calculate moments at key positions
positions = np.arange(0, span + 1, 4)

print("--- Bending Moment at Key Positions (kN*m) ---")
header = "x(m)     Simply Supp    Cantilever    Continuous"
print(header)
print("-" * len(header))

ss_max = 0
cant_max = 0
cont_max = 0

for x in positions:
    M_ss = simply_supported_moment(x, span, P, load_pos)
    M_cant = cantilever_moment(x, span, P, load_pos)
    M_cont = continuous_two_span_moment(x, span, P, load_pos)

    ss_max = max(ss_max, abs(M_ss))
    cant_max = max(cant_max, abs(M_cant))
    cont_max = max(cont_max, abs(M_cont))

    print(f"{x:>4}     {M_ss:>10.0f}    {M_cant:>10.0f}    {M_cont:>10.0f}")

print()
print("=== Maximum Bending Moments ===")
print(f"  Simply supported: {ss_max:>10.0f} kN*m (baseline)")
print(f"  Cantilever:       {cant_max:>10.0f} kN*m ({cant_max/ss_max:.1f}x)")
print(f"  Continuous:       {cont_max:>10.0f} kN*m ({cont_max/ss_max:.1f}x)")
print()
print("The continuous beam has the lowest peak moment")
print("because the middle support shares the load.")
print("The cantilever has the highest because all the")
print("moment is concentrated at the fixed end.")

# Required beam depth (proportional to moment)
print()
print("=== Required Steel I-Beam Depth ===")
print("(For the same steel grade)")
for name, M in [("Simply supported", ss_max), ("Cantilever", cant_max), ("Continuous", cont_max)]:
    # Approximate: depth proportional to sqrt(moment)
    depth = 0.8 * np.sqrt(M)  # crude approximation in cm
    print(f"  {name:<20} M={M:.0f} kN*m  depth ~{depth:.0f} cm")`,
      challenge: 'Add a propped cantilever — a cantilever with an additional support at the free end. Calculate the moment distribution and show that it falls between the pure cantilever and the simply supported beam. The Pamban bascule span acts as a propped cantilever when closed.',
      successHint: 'You just compared the fundamental beam types — the building blocks of all bridge engineering. Every bridge in the world is some combination of simply supported, cantilever, and continuous spans. Understanding their moment distributions is the first step to designing any structure.',
    },
    {
      title: 'Wind and wave forces — horizontal loads on the Pamban Bridge',
      concept: `The Pamban Bridge faces extreme horizontal forces from **wind** and **waves**. Cyclone winds in the Palk Strait can exceed 200 km/h, and tidal currents create strong wave forces on the piers. These horizontal forces create **overturning moments** that try to topple the bridge sideways.

Wind force on a structure is calculated as: **F = 0.5 x rho x v squared x Cd x A**, where rho is air density (1.225 kg/m cubed), v is wind speed, Cd is the drag coefficient (depends on shape), and A is the exposed area. The force increases with the **square** of wind speed — doubling the wind quadruples the force.

In the code below, you will calculate wind and wave forces on the Pamban Bridge piers and determine the stability against overturning. This is the critical safety check for any bridge in a coastal environment.

*Wind force scales with v squared because both the mass of air hitting the structure and the speed at which it hits increase linearly with wind speed. The combined effect is quadratic — making hurricanes devastatingly more powerful than strong winds.*`,
      analogy: 'Hold your hand flat out of a car window at low speed — you feel a gentle push. At highway speed, the push is much stronger. Double the speed and the force is four times greater. This is the v-squared law. At cyclone speeds (200+ km/h), the force is enormous — enough to strip roofs off buildings and push bridge decks sideways.',
      storyConnection: 'The 1964 Rameswaram cyclone destroyed the original Pamban Bridge, killing over 100 people. The bridge was rebuilt with stronger piers and improved wind resistance. The new design had to withstand wind speeds of 250 km/h — the maximum expected in a once-in-500-year cyclone event.',
      checkQuestion: 'If wind force at 100 km/h is 500 N/m squared, what is it at 200 km/h?',
      checkAnswer: 'Force scales with v squared. Speed ratio = 200/100 = 2. Force ratio = 2 squared = 4. So force at 200 km/h = 500 x 4 = 2000 N/m squared. This fourfold increase is why cyclones are so destructive — moderate winds are manageable, but extreme winds produce enormous forces.',
      codeIntro: 'Calculate wind and wave forces on the Pamban Bridge piers.',
      code: `import numpy as np

def wind_force(speed_kmh, area_m2, Cd=1.5, rho=1.225):
    """Calculate wind force in Newtons.
    speed_kmh: wind speed in km/h
    area_m2: exposed area in m^2
    Cd: drag coefficient (1.5 for flat surfaces)
    """
    v = speed_kmh / 3.6  # convert to m/s
    return 0.5 * rho * v ** 2 * Cd * area_m2

def wave_force(wave_height_m, pier_diameter_m, water_depth_m, rho_water=1025):
    """Estimate wave force on a cylindrical pier using Morrison's equation (simplified)."""
    Cd = 1.2  # drag coefficient for cylinder
    area = pier_diameter_m * water_depth_m  # projected area
    # Wave velocity approximately sqrt(g * depth)
    v_wave = np.sqrt(9.81 * wave_height_m)
    return 0.5 * rho_water * v_wave ** 2 * Cd * area

# Pamban Bridge pier dimensions
pier_height = 12  # m above water
pier_width = 3    # m
pier_depth = 6    # m underwater
pier_diameter = 2.5  # m (cylindrical underwater)
pier_exposed_area = pier_height * pier_width  # m^2

print("=== Wind Force on Pamban Bridge Pier ===")
print(f"Pier dimensions: {pier_width}m wide x {pier_height}m above water")
print(f"Exposed area: {pier_exposed_area} m^2")
print()

header = "Wind Speed    Force(kN)   Pressure(kPa)   Category"
print(header)
print("-" * len(header))

for speed in [30, 50, 80, 100, 120, 150, 180, 200, 250]:
    F = wind_force(speed, pier_exposed_area)
    pressure = F / pier_exposed_area / 1000
    if speed < 63:
        cat = "Normal"
    elif speed < 118:
        cat = "Cyclone Cat 1"
    elif speed < 154:
        cat = "Cyclone Cat 2"
    elif speed < 178:
        cat = "Cyclone Cat 3"
    elif speed < 209:
        cat = "Cyclone Cat 4"
    else:
        cat = "Cyclone Cat 5"
    print(f"{speed:>8} km/h  {F/1000:>8.1f}    {pressure:>12.2f}    {cat}")

# Wave force
print()
print("=== Wave Force on Pier (underwater section) ===")
print(f"Pier diameter: {pier_diameter}m | Water depth: {pier_depth}m")
print()

header2 = "Wave Height(m)  Force(kN)   Combined Wind+Wave(kN)"
print(header2)
print("-" * len(header2))

design_wind = 200  # km/h design wind speed
F_wind = wind_force(design_wind, pier_exposed_area)

for wave_h in [0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0]:
    F_wave = wave_force(wave_h, pier_diameter, pier_depth)
    combined = F_wind + F_wave
    print(f"{wave_h:>13.1f}    {F_wave/1000:>7.1f}    {combined/1000:>19.1f}")

# Overturning check
print()
print("=== Overturning Stability Check ===")
pier_mass = 200000  # kg
stabilizing_moment = pier_mass * 9.81 * pier_width / 2  # weight x half-width
overturn_moment = (F_wind * pier_height / 2 +
                   wave_force(3, pier_diameter, pier_depth) * pier_depth / 2)

safety_factor = stabilizing_moment / overturn_moment
print(f"Stabilizing moment (weight): {stabilizing_moment/1000:.0f} kN*m")
print(f"Overturning moment (wind+wave): {overturn_moment/1000:.0f} kN*m")
print(f"Safety factor: {safety_factor:.2f}")
print(f"Status: {'SAFE (>1.5)' if safety_factor > 1.5 else 'UNSAFE (<1.5)'}")`,
      challenge: 'Add the effect of train weight on stability: a train on the bridge adds weight (increases stabilizing moment) but also increases the exposed area to wind. Calculate the safety factor with and without a train during a cyclone. Is it safer to have a train on the bridge during a storm?',
      successHint: 'You just performed a wind and wave load analysis — one of the most critical calculations for coastal structures. The same analysis applies to offshore oil platforms, wind turbines, harbour walls, and high-rise buildings. The v-squared wind force law is one of the most important relationships in engineering.',
    },
    {
      title: 'Material strength — steel under tension and compression',
      concept: `The Pamban Bridge is built from **structural steel**, which has well-defined strength properties. The key properties are: **yield strength** (the stress at which the steel begins to permanently deform, about 250 MPa for mild steel), **ultimate tensile strength** (the maximum stress before fracture, about 400 MPa), and **elastic modulus** (the stiffness, about 200 GPa).

**Stress** = Force / Area, measured in megapascals (MPa). One MPa equals one million newtons per square metre. If the stress in any bridge member exceeds the yield strength, the member begins to bend permanently. If it exceeds the ultimate strength, it breaks.

In the code below, you will calculate the stress in bridge members under different loads and check them against the steel's capacity. This is the fundamental safety check for every structural member.

*A factor of safety (FOS) is applied to ensure the bridge can handle unexpected loads: FOS = material strength / actual stress. Bridge codes typically require FOS of 1.5-2.0, meaning the bridge is designed to be 50-100% stronger than the maximum expected load.*`,
      analogy: 'Imagine a rubber band. Pull it gently and it stretches (elastic deformation) — release it and it returns to original shape. Pull harder and it stays stretched even after release (yield — permanent deformation). Pull even harder and it snaps (ultimate failure). Steel behaves the same way, just at much higher forces.',
      storyConnection: 'The original 1914 Pamban Bridge used wrought iron and early mild steel. After the 1964 cyclone damage, the rebuilt sections used higher-grade structural steel with better corrosion resistance. The material upgrade, combined with improved pier design, gave the new bridge a much higher safety factor against cyclone loading.',
      checkQuestion: 'A steel bridge member has a cross-section of 100 cm squared (0.01 m squared) and carries 2000 kN of tension. What is the stress, and is it safe (yield = 250 MPa)?',
      checkAnswer: 'Stress = Force / Area = 2,000,000 N / 0.01 m squared = 200,000,000 Pa = 200 MPa. Since 200 MPa < 250 MPa (yield), the member is safe. Factor of safety = 250 / 200 = 1.25. This is below the typical minimum of 1.5, so the design should use a larger member.',
      codeIntro: 'Calculate stresses in bridge members and check against material capacity.',
      code: `import numpy as np

class SteelMember:
    def __init__(self, name, area_cm2, length_m, member_type="tension"):
        self.name = name
        self.area = area_cm2 / 10000  # convert to m^2
        self.area_cm2 = area_cm2
        self.length = length_m
        self.type = member_type

    def stress(self, force_kN):
        """Calculate stress in MPa."""
        return force_kN * 1000 / self.area / 1e6

    def check_capacity(self, force_kN, yield_mpa=250, fos_required=1.5):
        """Check if member can safely carry the force."""
        stress = self.stress(force_kN)
        fos = yield_mpa / stress if stress > 0 else float('inf')
        safe = fos >= fos_required
        return {
            "stress_mpa": stress,
            "yield_mpa": yield_mpa,
            "fos": fos,
            "fos_required": fos_required,
            "safe": safe,
        }

# Pamban Bridge members (simplified)
members = [
    SteelMember("Top chord", 300, 8, "compression"),
    SteelMember("Bottom chord", 280, 8, "tension"),
    SteelMember("Vertical post", 150, 6, "compression"),
    SteelMember("Diagonal brace", 120, 10, "tension"),
    SteelMember("Cross beam", 200, 5, "bending"),
    SteelMember("Deck stringer", 80, 8, "bending"),
]

# Loading: 100-ton train + self-weight
forces = {
    "Top chord": 1800,
    "Bottom chord": 1600,
    "Vertical post": 900,
    "Diagonal brace": 700,
    "Cross beam": 500,
    "Deck stringer": 300,
}

print("=== Pamban Bridge Member Stress Analysis ===")
print(f"Steel grade: S250 (yield = 250 MPa)")
print(f"Required factor of safety: 1.5")
print()

header = "Member            Area(cm2)  Force(kN)  Stress(MPa)  FOS    Status"
print(header)
print("-" * len(header))

for m in members:
    F = forces[m.name]
    result = m.check_capacity(F)
    status = "OK" if result["safe"] else "UPGRADE"
    print(f"{m.name:<18} {m.area_cm2:>7.0f}    {F:>7.0f}    "
          f"{result['stress_mpa']:>9.1f}    {result['fos']:>4.2f}   {status}")

# Temperature effect on yield strength
print()
print("=== Steel Strength vs Temperature ===")
print("(Yield strength decreases at high temperatures)")
print()

header2 = "Temp (C)    Yield (MPa)   Retained %"
print(header2)
print("-" * len(header2))

for temp in [20, 100, 200, 300, 400, 500, 600, 700]:
    if temp <= 300:
        retained = 1.0
    elif temp <= 700:
        retained = 1.0 - (temp - 300) / 500
    else:
        retained = 0.1
    yield_at_temp = 250 * retained
    print(f"{temp:>7}    {yield_at_temp:>9.0f}     {retained*100:>8.0f}%")

print()
print("Steel retains full strength up to ~300 C.")
print("Above 600 C, it loses most of its strength (fire risk).")`,
      challenge: 'Add buckling analysis for compression members: a slender column under compression can buckle (bow sideways) at a load much lower than the yield strength. Use Euler\'s formula: P_critical = pi squared * E * I / L squared. Calculate the buckling load for each compression member.',
      successHint: 'You just performed a structural member capacity check — the core calculation in structural engineering. Every steel beam, column, and truss member in every building and bridge is checked using exactly this approach: calculate stress, compare to capacity, verify safety factor.',
    },
    {
      title: 'Tidal forces and the bascule mechanism',
      concept: `The Pamban Bridge has a **bascule span** — a movable section that lifts to allow ships to pass through the strait. The bascule works on the **counterweight principle**: a heavy weight on the short arm balances the bridge deck on the long arm, so minimal force is needed to rotate the span.

The physics is that of a **lever**: Moment = Force x Distance from pivot. For the bascule to balance, the counterweight moment must equal the deck moment: **W_cw x d_cw = W_deck x d_deck**. A heavier counterweight at a shorter distance can balance a lighter deck at a greater distance.

In the code below, you will model the bascule mechanism, calculate the required counterweight, and determine the force needed to lift the span. You will also model the tidal currents that the mechanism must operate against.

*The bascule (French for "seesaw") bridge is one of the oldest movable bridge designs. Tower Bridge in London is a famous double-leaf bascule. The Pamban Bridge uses a Scherzer rolling bascule, where the bridge rolls on a curved track rather than rotating on a pivot.*`,
      analogy: 'Think of a seesaw at a playground. If a heavy child sits close to the pivot and a light child sits far from the pivot, they can balance. The bascule bridge is the same: a heavy counterweight close to the pivot balances the long bridge deck on the other side. Pushing down on either side tips the seesaw — a small force can move a large weight.',
      storyConnection: 'The Pamban bascule span must open against tidal currents that create drag forces on the lifting deck. During spring tides (when the moon and sun align), the current through the strait can reach 3-4 knots. The bascule mechanism must be powerful enough to overcome both the gravitational imbalance and the tidal drag.',
      checkQuestion: 'A bascule deck weighs 200 tons and has its centre of gravity 15 metres from the pivot. The counterweight is 8 metres from the pivot. How heavy must the counterweight be?',
      checkAnswer: 'For balance: W_cw x 8 = 200 x 15. W_cw = 200 x 15 / 8 = 375 tons. The counterweight must be 375 tons — heavier than the deck because it is closer to the pivot. In practice, the counterweight is slightly heavier than needed so the span naturally wants to lift (slightly overbalanced), and a brake holds it down.',
      codeIntro: 'Model the bascule mechanism and tidal forces on the Pamban Bridge.',
      code: `import numpy as np

class BasculeSpan:
    def __init__(self, deck_mass_kg, deck_cg_m, cw_distance_m, span_length_m):
        self.deck_mass = deck_mass_kg
        self.deck_cg = deck_cg_m  # CG distance from pivot
        self.cw_dist = cw_distance_m
        self.span_length = span_length_m
        self.g = 9.81

    def required_counterweight(self):
        """Mass needed to balance the deck."""
        return self.deck_mass * self.deck_cg / self.cw_dist

    def lifting_torque(self, angle_deg, wind_speed_kmh=0, current_speed_ms=0):
        """Net torque required to lift the span to a given angle."""
        angle_rad = np.radians(angle_deg)

        # Gravitational torques (change with angle as CG shifts)
        deck_moment = self.deck_mass * self.g * self.deck_cg * np.cos(angle_rad)
        cw_mass = self.required_counterweight() * 1.02  # 2% overbalanced
        cw_moment = cw_mass * self.g * self.cw_dist * np.cos(angle_rad)

        # Wind drag on raised span
        exposed_area = self.span_length * 3 * np.sin(angle_rad)  # 3m depth
        v = wind_speed_kmh / 3.6
        wind_force = 0.5 * 1.225 * v ** 2 * 1.5 * exposed_area
        wind_moment = wind_force * self.span_length / 2

        # Tidal current drag (on submerged portion)
        submerged_length = self.span_length * (1 - np.sin(angle_rad)) * 0.3
        current_force = 0.5 * 1025 * current_speed_ms ** 2 * 1.2 * submerged_length * 2
        current_moment = current_force * submerged_length / 2

        net_torque = deck_moment - cw_moment + wind_moment + current_moment
        return {
            "deck_moment": deck_moment,
            "cw_moment": cw_moment,
            "wind_moment": wind_moment,
            "current_moment": current_moment,
            "net_torque": net_torque,
        }

# Pamban bascule span
bascule = BasculeSpan(
    deck_mass_kg=200000,    # 200 tons
    deck_cg_m=15,           # CG 15m from pivot
    cw_distance_m=8,        # counterweight 8m from pivot
    span_length_m=56,       # span length
)

cw = bascule.required_counterweight()
print("=== Pamban Bascule Span Analysis ===")
print(f"Deck mass: {bascule.deck_mass/1000:.0f} tons")
print(f"Required counterweight: {cw/1000:.0f} tons")
print(f"Actual counterweight (2% over): {cw*1.02/1000:.0f} tons")
print()

# Torque vs angle (calm conditions)
print("--- Lifting Torque vs Angle (calm) ---")
header = "Angle  Deck Moment  CW Moment   Wind    Current   Net Torque"
print(header)
print("-" * len(header))

for angle in range(0, 85, 5):
    t = bascule.lifting_torque(angle)
    print(f"{angle:>4} deg  {t['deck_moment']/1000:>9.0f}  {t['cw_moment']/1000:>9.0f}  "
          f"{t['wind_moment']/1000:>6.0f}  {t['current_moment']/1000:>8.0f}  "
          f"{t['net_torque']/1000:>10.0f} kN*m")

# Effect of tidal current
print()
print("--- Effect of Tidal Current (at 30 deg opening) ---")
header2 = "Current(m/s)  Current Force(kN)  Extra Torque(kN*m)"
print(header2)
print("-" * len(header2))

for current in [0, 0.5, 1.0, 1.5, 2.0, 2.5]:
    t = bascule.lifting_torque(30, current_speed_ms=current)
    t0 = bascule.lifting_torque(30, current_speed_ms=0)
    extra = t["net_torque"] - t0["net_torque"]
    print(f"{current:>10.1f}    {t['current_moment']/1000:>14.1f}    {extra/1000:>16.1f}")`,
      challenge: 'Calculate the power required to open the bascule span in 2 minutes (from 0 to 80 degrees). Power = Torque x angular velocity. Account for the varying torque at each angle by integrating over the rotation. Compare to the power of the original steam engines and modern electric motors.',
      successHint: 'You just analysed a real movable bridge mechanism. The same lever and torque principles apply to drawbridges, crane booms, excavator arms, and robotic manipulators. The counterweight principle is one of the most elegant solutions in engineering — using gravity to assist rather than fight.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Bridge forces, beam types, and structural fundamentals</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to analyse forces, stresses, and mechanisms in bridge engineering.
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
