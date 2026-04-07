import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KumartuliLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Forces on a structure — tension, compression, and shear',
      concept: `Every structure experiences three fundamental types of force: **compression** (pushing together), **tension** (pulling apart), and **shear** (sliding past). A bamboo column under a pandal roof is in compression — the roof weight pushes down. The ropes holding a banner are in tension — they are being pulled taut. A nail holding two boards together resists shear — the boards try to slide past each other.

Understanding which parts of a structure are in tension and which are in compression is the first step in structural engineering. Materials have different strengths in each mode: bamboo is excellent in tension (its fibres resist pulling) and good in compression (if short and thick), but weak in shear (it splits along its fibres).

In the code below, you will calculate the forces in a simple pandal frame — identifying which members are in tension, which in compression, and how close each is to failure.`,
      analogy: 'Squeeze a sponge (compression) — it shortens. Pull a rubber band (tension) — it stretches. Try to slide the top of a deck of cards over the bottom (shear) — the cards slip. Every structure is just a complex arrangement of these three simple forces.',
      storyConnection: 'In Kumartuli, artisans build enormous pandal structures — temporary pavilions up to 30 metres tall — from bamboo, rope, and fabric for Durga Puja. These structures must support their own weight, the weight of the idols (sometimes tonnes), wind loads, and the vibration of thousands of visitors. The artisans intuitively understand tension and compression, even without formal engineering training.',
      checkQuestion: 'A bamboo column 10 cm in diameter supports a roof weighing 500 kg. If the column cross-section area is pi*r^2 = 78.5 cm^2, what is the compressive stress in MPa?',
      checkAnswer: 'Force = 500 * 9.81 = 4905 N. Area = 78.5 cm^2 = 78.5e-4 m^2 = 0.00785 m^2. Stress = 4905 / 0.00785 = 625,000 Pa = 0.625 MPa. Bamboo compressive strength is about 50-80 MPa, so the column is at about 1% of its capacity — very safe.',
      codeIntro: 'Calculate forces and stresses in a simple pandal frame structure.',
      code: `import numpy as np

# Pandal frame force analysis
# Simple post-and-beam structure

# Material properties
materials = {
    "Bamboo": {"density_kg_m3": 700, "compress_MPa": 60, "tension_MPa": 150, "shear_MPa": 8},
    "Sal wood": {"density_kg_m3": 870, "compress_MPa": 45, "tension_MPa": 80, "shear_MPa": 12},
    "Steel tube": {"density_kg_m3": 7800, "compress_MPa": 250, "tension_MPa": 400, "shear_MPa": 150},
    "Rope (jute)": {"density_kg_m3": 1300, "compress_MPa": 0, "tension_MPa": 40, "shear_MPa": 0},
}

g = 9.81  # gravity

# Pandal dimensions
span_m = 8       # beam span
height_m = 5     # column height
beam_dia_m = 0.12  # beam diameter
col_dia_m = 0.10   # column diameter

# Loads
roof_weight_kg = 300   # fabric + bamboo frame
idol_weight_kg = 800   # clay idol
visitor_load_kg = 200  # distributed live load

total_load_kg = roof_weight_kg + idol_weight_kg + visitor_load_kg
total_force_N = total_load_kg * g

# 4 columns share the load
force_per_column_N = total_force_N / 4

print("=== Pandal Force Analysis ===")
print(f"Span: {span_m} m | Height: {height_m} m")
print(f"Total load: {total_load_kg} kg ({total_force_N:.0f} N)")
print(f"Force per column: {force_per_column_N:.0f} N")
print()

# Column stress analysis
col_area = np.pi * (col_dia_m / 2) ** 2
col_stress_MPa = force_per_column_N / (col_area * 1e6)

# Beam bending — maximum stress at midspan
# For a uniformly distributed load: M = wL^2/8
# Bending stress: sigma = M*c/I
beam_area = np.pi * (beam_dia_m / 2) ** 2
I_beam = np.pi * (beam_dia_m / 2) ** 4 / 4  # moment of inertia
c_beam = beam_dia_m / 2  # distance to outer fibre

w_per_m = total_force_N / span_m  # N/m distributed load
M_max = w_per_m * span_m ** 2 / 8  # N*m
beam_stress_MPa = M_max * c_beam / (I_beam * 1e6)

print(f"{'Component':<18} {'Stress (MPa)':>12} {'Mode':<14}")
print("-" * 46)
print(f"{'Column':<18} {col_stress_MPa:>10.2f} {'Compression':<14}")
print(f"{'Beam (bottom)':<18} {beam_stress_MPa:>10.2f} {'Tension':<14}")
print(f"{'Beam (top)':<18} {beam_stress_MPa:>10.2f} {'Compression':<14}")
print()

# Compare materials
print("=== Material Comparison ===")
print(f"{'Material':<14} {'Column FoS':>10} {'Beam FoS':>10} {'Verdict':<16}")
print("-" * 52)

for name, props in materials.items():
    if props["compress_MPa"] > 0:
        col_fos = props["compress_MPa"] / col_stress_MPa
    else:
        col_fos = 0
    beam_fos = props["tension_MPa"] / beam_stress_MPa if beam_stress_MPa > 0 else 999
    safe = "SAFE" if col_fos > 3 and beam_fos > 3 else "MARGINAL" if col_fos > 1.5 else "UNSAFE"
    print(f"{name:<14} {col_fos:>8.1f} {beam_fos:>8.1f} {safe:<16}")

print()
print("Factor of Safety (FoS) > 3 is recommended for temporary structures.")
print("Bamboo achieves this easily — that is why Kumartuli uses it!")`,
      challenge: 'Double the idol weight to 1,600 kg. Which material starts to become marginal? Now add a second beam alongside the first (doubling beam area). How does this change the beam FoS? This is why large pandals use bundled bamboo beams.',
      successHint: 'You just performed a structural analysis — the same process engineers use for every building, bridge, and scaffold. The Factor of Safety concept is universal: design for 3x the expected load so the structure survives unexpected conditions.',
    },
    {
      title: 'Load paths — tracing forces from roof to ground',
      concept: `A **load path** is the route that force takes from where it is applied to the ground. In a pandal, the path is: idol weight on platform, platform transfers load to beams, beams transfer to columns, columns transfer to foundations, foundations spread load into the ground.

Every load path must be **continuous** — if any link in the chain is missing, the structure collapses. A common failure mode is a beam-to-column connection that cannot transfer the load — the beam is strong, the column is strong, but the joint between them fails.

In the code below, you will trace load paths through a multi-storey pandal structure, calculating the accumulated force at each level from top to bottom.`,
      analogy: 'Think of a load path like a relay race. The baton (force) is passed from runner to runner (structural member to member). If any runner drops the baton (a connection fails), the race is over (the structure collapses). Every handoff must be secure.',
      storyConnection: 'Kumartuli master builders check load paths intuitively — they push and pull on each joint, feeling for flex or play. A joint that "gives" under hand pressure will fail under full load. They reinforce weak joints with extra rope lashing, bamboo pegs, or steel wire — ensuring every link in the load path is solid.',
      checkQuestion: 'A 3-storey pandal has floors weighing 200, 300, and 400 kg (top to bottom). What is the total compressive force on the ground-floor columns?',
      checkAnswer: 'Forces accumulate downward: ground floor columns carry all three floors plus the roof. Total = 200 + 300 + 400 = 900 kg weight above ground floor, plus the ground floor itself. Each storey adds to the cumulative load below it.',
      codeIntro: 'Trace load paths through a multi-level pandal structure from top to ground.',
      code: `import numpy as np

# Load path analysis for a multi-level pandal

g = 9.81

# Structure definition (from top to bottom)
levels = [
    {"name": "Crown/spire", "self_weight_kg": 50, "live_load_kg": 0,
     "columns": 1, "col_dia_m": 0.06},
    {"name": "Upper platform", "self_weight_kg": 150, "live_load_kg": 100,
     "columns": 4, "col_dia_m": 0.08},
    {"name": "Main idol level", "self_weight_kg": 300, "live_load_kg": 800,
     "columns": 4, "col_dia_m": 0.10},
    {"name": "Lower gallery", "self_weight_kg": 400, "live_load_kg": 500,
     "columns": 6, "col_dia_m": 0.12},
    {"name": "Ground platform", "self_weight_kg": 500, "live_load_kg": 1000,
     "columns": 8, "col_dia_m": 0.15},
]

bamboo_compress_MPa = 60

print("=== Load Path Analysis: Multi-Level Pandal ===")
print(f"{'Level':<22} {'Self (kg)':>10} {'Live (kg)':>10} {'Cumul (N)':>12} {'Per col (N)':>12} {'Stress':>8}")
print("-" * 76)

cumulative_N = 0
all_safe = True

for level in levels:
    level_load_N = (level["self_weight_kg"] + level["live_load_kg"]) * g
    cumulative_N += level_load_N

    force_per_col = cumulative_N / level["columns"]
    col_area = np.pi * (level["col_dia_m"] / 2) ** 2
    stress_MPa = force_per_col / (col_area * 1e6)
    fos = bamboo_compress_MPa / stress_MPa

    status = f"{stress_MPa:.2f} MPa"
    if fos < 3:
        status += " !"
        all_safe = False

    print(f"{level['name']:<22} {level['self_weight_kg']:>10} {level['live_load_kg']:>10} "
          f"{cumulative_N:>10.0f} {force_per_col:>10.0f} {status:>8}")

print()
print(f"Total load at foundation: {cumulative_N:.0f} N ({cumulative_N/g:.0f} kg)")
print(f"Structure is {'SAFE' if all_safe else 'NEEDS REINFORCEMENT'} (all FoS > 3)")

# Foundation check
print()
print("=== Foundation Check ===")
num_ground_cols = levels[-1]["columns"]
force_per_foundation = cumulative_N / num_ground_cols

# Pad footing on soft soil (Sundarbans clay)
soil_bearing_kPa = 50  # soft clay bearing capacity
required_area = force_per_foundation / (soil_bearing_kPa * 1000)
pad_side = np.sqrt(required_area)

print(f"Force per foundation: {force_per_foundation:.0f} N")
print(f"Soil bearing capacity: {soil_bearing_kPa} kPa")
print(f"Required pad area: {required_area*10000:.0f} cm^2")
print(f"Square pad size: {pad_side*100:.0f} cm x {pad_side*100:.0f} cm")

# Connection forces
print()
print("=== Critical Connection Forces ===")
cumul = 0
for i, level in enumerate(levels):
    load = (level["self_weight_kg"] + level["live_load_kg"]) * g
    cumul += load
    if i < len(levels) - 1:
        next_cols = levels[i+1]["columns"]
        shear_per_joint = cumul / next_cols
        print(f"{level['name']:<22} -> {levels[i+1]['name']:<22} "
              f"Shear: {shear_per_joint:.0f} N per joint")`,
      challenge: 'Add a "wind load" of 500 N horizontal force at each level. Calculate the overturning moment (force * height) and check if the structure\'s weight is enough to resist tipping. What minimum base width prevents overturning?',
      successHint: 'Load path analysis is the foundation of structural engineering. Before computers, engineers traced load paths by hand through every member and joint. Modern software automates this, but the concept is identical: force must flow continuously from application to ground.',
    },
    {
      title: 'Bamboo as a structural material — strength-to-weight champion',
      concept: `Bamboo has an exceptional **strength-to-weight ratio** — it is stronger per unit weight than steel in tension. This is because bamboo is a natural **fibre composite**: long, strong cellulose fibres embedded in a lignin matrix, oriented along the culm's length.

The key structural properties are: **tensile strength** (100-200 MPa along the grain), **compressive strength** (40-80 MPa), **flexural modulus** (10-20 GPa), and **density** (600-900 kg/m3). For comparison, mild steel has tensile strength 400 MPa but density 7,800 kg/m3 — so bamboo's strength-to-weight ratio in tension is comparable to steel.

In the code below, you will compare bamboo to other structural materials using specific strength (strength/density) and specific stiffness (modulus/density) — the metrics that matter for lightweight structures.`,
      analogy: 'Compare a bamboo pole to a steel rod of the same weight. The bamboo pole is much larger (because it is lighter), so it resists bending better. It is like comparing a cardboard tube to a steel wire — the tube is weaker per unit area but stronger per unit weight because its shape distributes material away from the centre.',
      storyConnection: 'Kumartuli artisans choose bamboo not just because it is cheap and available, but because it is light enough to carry, strong enough to build tall, and flexible enough to absorb wind gusts without cracking. A steel pandal would be stronger per member but impossibly heavy to erect without cranes — and cranes cannot navigate Kumartuli\'s narrow lanes.',
      checkQuestion: 'Bamboo has tensile strength 150 MPa and density 750 kg/m3. Steel has 400 MPa and 7800 kg/m3. Which has the higher specific strength (strength/density)?',
      checkAnswer: 'Bamboo: 150/750 = 0.20 MPa/(kg/m3). Steel: 400/7800 = 0.051 MPa/(kg/m3). Bamboo\'s specific strength is 0.20/0.051 = 3.9 times higher than steel. Per unit weight, bamboo is nearly 4x stronger in tension.',
      codeIntro: 'Compare structural materials by specific strength and stiffness for pandal design.',
      code: `import numpy as np

# Material property comparison for lightweight structures

materials = [
    {"name": "Bamboo (Muli)", "density": 750, "tension": 150, "compress": 60,
     "modulus": 15, "cost_per_kg": 0.3},
    {"name": "Bamboo (Bhaluka)", "density": 680, "tension": 120, "compress": 50,
     "modulus": 12, "cost_per_kg": 0.25},
    {"name": "Sal wood", "density": 870, "tension": 80, "compress": 45,
     "modulus": 12, "cost_per_kg": 1.5},
    {"name": "Teak wood", "density": 650, "tension": 95, "compress": 55,
     "modulus": 13, "cost_per_kg": 8.0},
    {"name": "Mild steel", "density": 7800, "tension": 400, "compress": 250,
     "modulus": 200, "cost_per_kg": 1.0},
    {"name": "Aluminum", "density": 2700, "tension": 310, "compress": 280,
     "modulus": 70, "cost_per_kg": 3.0},
    {"name": "GFRP (fibreglass)", "density": 1800, "tension": 500, "compress": 350,
     "modulus": 30, "cost_per_kg": 5.0},
    {"name": "Carbon fibre", "density": 1600, "tension": 2000, "compress": 1200,
     "modulus": 150, "cost_per_kg": 25.0},
]

print("=== Specific Strength Comparison ===")
print(f"{'Material':<22} {'Density':>8} {'Tension':>8} {'Spec Str':>10} {'Rank':>6}")
print(f"{'':22} {'(kg/m3)':>8} {'(MPa)':>8} {'(kN m/kg)':>10}")
print("-" * 56)

# Calculate and sort by specific tensile strength
for m in materials:
    m["spec_tension"] = m["tension"] / m["density"] * 1000  # kN*m/kg

ranked = sorted(materials, key=lambda x: x["spec_tension"], reverse=True)
for rank, m in enumerate(ranked, 1):
    print(f"{m['name']:<22} {m['density']:>8} {m['tension']:>8} {m['spec_tension']:>8.0f} {rank:>6}")

print()
print("=== Cost-Effectiveness for Pandal Building ===")
print(f"{'Material':<22} {'Spec Strength':>14} {'Cost/kg':>8} {'Value Index':>12}")
print("-" * 58)

for m in ranked:
    value = m["spec_tension"] / m["cost_per_kg"]
    print(f"{m['name']:<22} {m['spec_tension']:>12.0f} {m['cost_per_kg']:>8.2f} {value:>10.0f}")

print()
print("Value Index = Specific Strength / Cost per kg")
print("Bamboo dominates: strongest per rupee spent!")

# Hollow vs solid comparison
print()
print("=== Why Bamboo is Hollow (Section Efficiency) ===")
outer_d = 0.10  # 10 cm outer diameter
wall_t = 0.01   # 1 cm wall thickness
inner_d = outer_d - 2 * wall_t

# Solid circular section
A_solid = np.pi * (outer_d / 2) ** 2
I_solid = np.pi * (outer_d / 2) ** 4 / 4

# Hollow section (like bamboo)
A_hollow = np.pi * ((outer_d / 2) ** 2 - (inner_d / 2) ** 2)
I_hollow = np.pi * ((outer_d / 2) ** 4 - (inner_d / 2) ** 4) / 4

print(f"Solid:  Area = {A_solid*10000:.1f} cm2, I = {I_solid*1e8:.1f} cm4")
print(f"Hollow: Area = {A_hollow*10000:.1f} cm2, I = {I_hollow*1e8:.1f} cm4")
print(f"Area ratio: {A_hollow/A_solid:.2f} (hollow uses {A_hollow/A_solid*100:.0f}% material)")
print(f"I ratio:    {I_hollow/I_solid:.2f} (hollow retains {I_hollow/I_solid*100:.0f}% stiffness)")
print(f"Efficiency: {(I_hollow/I_solid)/(A_hollow/A_solid):.2f}x more stiff per unit material")`,
      challenge: 'Calculate the weight of bamboo vs steel columns needed to support the same 10,000 N load with the same Factor of Safety of 5. Which is lighter? By how much? This explains why even modern engineers are returning to bamboo for temporary structures.',
      successHint: 'Specific strength and specific stiffness are the metrics that aerospace engineers use to choose materials for aircraft and rockets. Bamboo\'s natural hollow tube shape and fibre composite structure anticipate engineering solutions that humans only recently invented with carbon fibre.',
    },
    {
      title: 'Beam deflection — will the roof sag?',
      concept: `A beam under load does not just resist breaking — it also **deflects** (bends). Too much deflection makes the structure look unsafe, allows water to pool on the roof, and can damage attached elements. Building codes limit deflection to **L/360** of the span (about 3 mm per metre).

Deflection depends on load, span, material stiffness (Young's modulus E), and cross-section shape (moment of inertia I). For a simply supported beam with a uniform load: **delta_max = 5wL^4 / (384EI)**.

The key insight: deflection scales with the **fourth power of span**. Double the span and deflection increases 16x. This is why long spans need much stiffer beams — or intermediate supports.`,
      analogy: 'Hold a ruler flat on the edge of a desk with different amounts of overhang. A short overhang barely bends. Double the overhang and it droops noticeably. Triple it and the ruler sags dramatically. That is L^4 scaling — small increases in span cause enormous increases in deflection.',
      storyConnection: 'Kumartuli pandal builders deal with deflection constantly. A bamboo beam spanning 6 metres might sag 30 mm under the roof weight — visible but acceptable. The same beam spanning 10 metres would sag 130 mm — dangerously visible and pooling rain. This is why large pandals use many intermediate columns or triangulated trusses to keep spans short.',
      checkQuestion: 'If a beam deflects 5 mm over a 4 m span, and you double the span to 8 m (same beam, same load per metre), what is the new deflection?',
      checkAnswer: 'Deflection scales with L^4: (8/4)^4 = 2^4 = 16. New deflection = 5 * 16 = 80 mm. That is 8 cm of sag — clearly visible and structurally concerning. This dramatic scaling is why long-span structures require fundamentally different designs.',
      codeIntro: 'Calculate beam deflection for bamboo pandal beams at different spans and loads.',
      code: `import numpy as np

# Beam deflection calculator
# delta_max = 5 * w * L^4 / (384 * E * I)

def beam_deflection(span_m, load_per_m_N, E_GPa, diameter_m, hollow_ratio=0.8):
    """Calculate max deflection of a hollow circular beam"""
    E = E_GPa * 1e9  # convert to Pa
    r_outer = diameter_m / 2
    r_inner = r_outer * hollow_ratio
    I = np.pi / 4 * (r_outer**4 - r_inner**4)
    delta = 5 * load_per_m_N * span_m**4 / (384 * E * I)
    return delta * 1000  # mm

# Pandal beam parameters
beam_dia = 0.10  # 10 cm
E_bamboo = 15    # GPa
load = 500       # N/m (roof + live load)

print("=== Beam Deflection vs Span ===")
print(f"Bamboo beam: {beam_dia*100:.0f} cm diameter, E = {E_bamboo} GPa")
print(f"Load: {load} N/m distributed")
print()
print(f"{'Span (m)':<10} {'Deflection (mm)':>16} {'L/360 limit (mm)':>18} {'Status':<10}")
print("-" * 56)

for span in [2, 3, 4, 5, 6, 7, 8, 10]:
    defl = beam_deflection(span, load, E_bamboo, beam_dia)
    limit = span * 1000 / 360
    status = "OK" if defl <= limit else "EXCESS"
    print(f"{span:<10} {defl:>14.1f} {limit:>16.1f} {status:<10}")

# Effect of beam diameter
print()
print("=== Fix the Span at 6 m — Vary Beam Diameter ===")
span = 6
print(f"{'Diameter (cm)':<14} {'Deflection (mm)':>16} {'Weight (kg)':>12} {'Status':<10}")
print("-" * 54)

for dia_cm in [6, 8, 10, 12, 15, 20]:
    dia = dia_cm / 100
    defl = beam_deflection(span, load, E_bamboo, dia)
    # Weight of hollow bamboo beam
    r_o = dia / 2
    r_i = r_o * 0.8
    area = np.pi * (r_o**2 - r_i**2)
    weight = area * span * 750  # kg (bamboo density)
    limit = span * 1000 / 360
    status = "OK" if defl <= limit else "EXCESS"
    print(f"{dia_cm:<14} {defl:>14.1f} {weight:>10.1f} {status:<10}")

# Bundled bamboo solution
print()
print("=== Bundled Bamboo (Kumartuli technique) ===")
single_defl = beam_deflection(6, load, E_bamboo, 0.08)
print(f"Single 8 cm bamboo: {single_defl:.1f} mm")

# 3 bamboos bundled: I_total = 3*I + parallel axis contributions
r_o = 0.04
r_i = 0.032
I_single = np.pi / 4 * (r_o**4 - r_i**4)
# Bundled in triangle: centre-to-centre = 2*r_outer
d_offset = 2 * r_o
I_bundle = 3 * I_single + 2 * (np.pi * (r_o**2 - r_i**2)) * (d_offset/2)**2
# Deflection with bundled I
delta_bundle = 5 * load * 6**4 / (384 * E_bamboo * 1e9 * I_bundle) * 1000
print(f"3x bundled 8 cm bamboo: {delta_bundle:.1f} mm")
print(f"Improvement: {single_defl/delta_bundle:.1f}x stiffer!")`,
      challenge: 'A pandal builder wants to span 8 metres with a single bamboo beam (no intermediate column). What minimum diameter bamboo is needed to stay within the L/360 limit? What if they bundle 4 bamboo poles together? Calculate both solutions.',
      successHint: 'The L^4 scaling of deflection is one of the most important facts in structural engineering. It explains why bridges need deep girders, why floor joists get deeper as rooms get wider, and why Kumartuli builders space their columns so carefully.',
    },
    {
      title: 'Factor of safety — designing for the unexpected',
      concept: `No engineer designs a structure to *exactly* handle the expected load. They add a **Factor of Safety (FoS)**: the ratio of a structure's strength to the expected load. A FoS of 3 means the structure can handle 3x the expected load before failing.

The FoS accounts for: material variability (bamboo strength varies by 30-40% between culms), load uncertainty (a crowd on a platform might weigh more than expected), construction quality (joints may not be perfect), and degradation over time (bamboo weakens when wet).

Different codes require different FoS: permanent buildings need FoS of 3-5, temporary structures need 2-3, and aircraft need only 1.5 (because every gram matters and materials are tightly controlled).

In the code below, you will calculate the required member sizes for a pandal at different FoS values and see the trade-off between safety and material cost.`,
      analogy: 'A FoS of 3 is like packing 3 spare tyres instead of 1. Probably overkill for a smooth highway, but sensible for a rough dirt road where multiple flats are possible. The rougher the conditions (more uncertainty), the more "spares" (safety margin) you need.',
      storyConnection: 'Kumartuli builders use traditional rules of thumb that implicitly include high safety factors. "Never use bamboo thinner than your wrist for a column" is a rule that ensures FoS > 5 for most pandals. These rules were developed over centuries of trial and error — failures taught the community what margins are needed.',
      checkQuestion: 'A bamboo column can hold 50 kN before failing. The expected load is 12 kN. What is the Factor of Safety? Is this adequate for a temporary structure with visiting crowds?',
      checkAnswer: 'FoS = 50 / 12 = 4.17. For a temporary structure (code requirement: FoS > 2-3), this is more than adequate. The extra margin covers crowd overload, wind gusts, bamboo variability, and the risk of a poorly made joint.',
      codeIntro: 'Design pandal members for different safety factors and compare the cost trade-offs.',
      code: `import numpy as np

# Factor of Safety design calculator

g = 9.81
bamboo_density = 750  # kg/m3
bamboo_strength = 60  # MPa compression
bamboo_cost_per_m3 = 300  # INR per m3

def design_column(load_N, height_m, fos, material_strength_MPa):
    """Design a column for given load and FoS"""
    design_load = load_N * fos
    # Required area: A = F / sigma
    required_area = design_load / (material_strength_MPa * 1e6)
    # Diameter for hollow bamboo (wall = 20% of radius)
    # A = pi * (r^2 - (0.8r)^2) = pi * r^2 * 0.36
    r = np.sqrt(required_area / (np.pi * 0.36))
    diameter = 2 * r
    # Volume and weight
    volume = required_area * height_m
    weight = volume * bamboo_density
    cost = volume * bamboo_cost_per_m3
    return {
        "diameter_cm": diameter * 100,
        "area_cm2": required_area * 10000,
        "weight_kg": weight,
        "cost_INR": cost,
    }

# Expected column load
expected_load = 15000  # N (about 1500 kg above)
height = 4  # m

print("=== Column Design at Different Safety Factors ===")
print(f"Expected load: {expected_load} N | Height: {height} m")
print()
print(f"{'FoS':>5} {'Diameter (cm)':>14} {'Weight (kg)':>12} {'Cost (INR)':>12} {'Context':<24}")
print("-" * 70)

contexts = {
    1.0: "Theoretical minimum",
    1.5: "Aircraft standard",
    2.0: "Minimum for temporary",
    3.0: "Recommended temporary",
    4.0: "Conservative practice",
    5.0: "Kumartuli tradition",
    8.0: "Extremely conservative",
}

for fos in [1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 8.0]:
    col = design_column(expected_load, height, fos, bamboo_strength)
    print(f"{fos:>5.1f} {col['diameter_cm']:>12.1f} {col['weight_kg']:>10.2f} "
          f"{col['cost_INR']:>10.1f} {contexts[fos]:<24}")

# What happens when things go wrong
print()
print("=== Failure Probability vs FoS ===")
print("(Assuming material strength varies by +/- 30%)")
print()

np.random.seed(42)
n_simulations = 10000

for fos in [1.5, 2.0, 3.0, 4.0, 5.0]:
    failures = 0
    for _ in range(n_simulations):
        # Random variation in load (+/- 50%) and strength (+/- 30%)
        actual_load = expected_load * (1 + np.random.normal(0, 0.25))
        actual_strength = bamboo_strength * (1 + np.random.normal(0, 0.15))
        col = design_column(expected_load, height, fos, bamboo_strength)
        actual_capacity = actual_strength * 1e6 * col["area_cm2"] / 10000
        if actual_load > actual_capacity:
            failures += 1
    prob = failures / n_simulations * 100
    print(f"FoS {fos:.1f}: {failures:>5} failures in {n_simulations} trials ({prob:.2f}%)")

print()
print("Even FoS 3 still has rare failures — that is why")
print("Kumartuli builders traditionally use FoS 4-5.")`,
      challenge: 'Run the Monte Carlo simulation with 100,000 trials. At what FoS does the failure probability drop below 0.01% (1 in 10,000)? This is the reliability target for structures that protect human life.',
      successHint: 'Factor of Safety is not about being wasteful — it is about managing uncertainty. The Monte Carlo simulation you just ran is exactly how modern engineers assess structural reliability. Traditional builders like those in Kumartuli arrived at the same safety margins through centuries of empirical learning.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Forces, loads, and structural basics through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to analyse forces, load paths, and safety factors in bamboo pandal structures.
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
