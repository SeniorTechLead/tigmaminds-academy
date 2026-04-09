import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KumartuliLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Bending moments — where beams fail first',
      concept: `When a beam bends under load, it develops **internal moments** — twisting forces that try to rotate cross-sections relative to each other. The **bending moment** at any point equals the sum of all forces times their distances on one side of that point.

For a simply supported beam with uniform load w (N/m) over span L: the maximum moment occurs at midspan and equals **M_max = wL^2 / 8**. This is where the beam is most likely to fail.

The bending moment creates **bending stress**: tension on the bottom face (being pulled apart) and compression on the top face (being squeezed). The stress at any point is: **sigma = M * y / I**, where y is the distance from the neutral axis and I is the moment of inertia.`,
      analogy: 'Hold a stick at both ends and push down in the middle. The bottom of the stick stretches (tension) and the top compresses. The middle of the stick — where you push — has the maximum bending moment. If the stick breaks, it breaks there.',
      storyConnection: 'Kumartuli builders instinctively reinforce beams at midspan — they lash extra bamboo poles or add diagonal braces right where the bending moment is highest. They also know to orient bamboo with its natural curve facing upward (pre-cambered), so gravity flattens it rather than adding to the sag.',
      checkQuestion: 'A 6 m beam carries 800 N/m. What is the maximum bending moment? Where does it occur?',
      checkAnswer: 'M_max = wL^2/8 = 800 * 6^2 / 8 = 800 * 36 / 8 = 3,600 N*m. It occurs at midspan (3 m from either support). The supports themselves have zero bending moment — they can rotate freely.',
      codeIntro: 'Calculate and plot bending moment diagrams for pandal beams under different loading conditions.',
      code: `import numpy as np

# Bending moment diagram calculator

def moment_diagram(span_m, loads, n_points=100):
    """
    Calculate bending moment along a simply supported beam.
    loads: list of (position_m, force_N) for point loads
           or ("uniform", w_N_per_m) for distributed loads
    """
    x = np.linspace(0, span_m, n_points)
    M = np.zeros(n_points)

    # Calculate support reactions first
    total_moment_about_A = 0
    total_load = 0

    for load in loads:
        if load[0] == "uniform":
            w = load[1]
            total_load += w * span_m
            total_moment_about_A += w * span_m * span_m / 2
        else:
            pos, force = load
            total_load += force
            total_moment_about_A += force * pos

    R_B = total_moment_about_A / span_m
    R_A = total_load - R_B

    # Calculate moment at each point using left-side sum
    for i, xi in enumerate(x):
        Mi = R_A * xi
        for load in loads:
            if load[0] == "uniform":
                w = load[1]
                Mi -= w * xi * xi / 2
            else:
                pos, force = load
                if xi > pos:
                    Mi -= force * (xi - pos)
        M[i] = Mi

    return x, M, R_A, R_B

# Case 1: Uniform roof load
print("=== Case 1: Uniform Roof Load ===")
span = 6  # m
w = 500   # N/m

x, M, Ra, Rb = moment_diagram(span, [("uniform", w)])
max_M = np.max(M)
max_pos = x[np.argmax(M)]

print(f"Span: {span} m, Distributed load: {w} N/m")
print(f"Reactions: R_A = {Ra:.0f} N, R_B = {Rb:.0f} N")
print(f"Max moment: {max_M:.0f} N*m at x = {max_pos:.1f} m")
print(f"Formula check: wL^2/8 = {w*span**2/8:.0f} N*m")
print()

# Show moment at key positions
print(f"{'Position (m)':<14} {'Moment (N*m)':>14}")
print("-" * 30)
for pos in [0, 1, 2, 3, 4, 5, 6]:
    idx = int(pos / span * 99)
    print(f"{pos:<14} {M[idx]:>12.0f}")

# Case 2: Idol at midspan (point load)
print()
print("=== Case 2: Idol at Midspan + Roof Load ===")
idol_weight = 5000  # N (500 kg idol)
x2, M2, Ra2, Rb2 = moment_diagram(span, [("uniform", w), (3.0, idol_weight)])
max_M2 = np.max(M2)

print(f"Added: {idol_weight} N point load at midspan")
print(f"Max moment: {max_M2:.0f} N*m (was {max_M:.0f} without idol)")
print(f"Increase: {(max_M2-max_M)/max_M*100:.0f}%")

# Beam stress check
print()
print("=== Beam Stress Check ===")
diameters = [0.08, 0.10, 0.12, 0.15]
print(f"{'Diameter (cm)':<14} {'I (cm4)':>10} {'Max stress':>12} {'FoS':>6}")
print("-" * 44)

bamboo_tension = 150  # MPa

for d in diameters:
    r = d / 2
    ri = r * 0.8  # hollow
    I = np.pi / 4 * (r**4 - ri**4)
    stress = max_M2 * (d/2) / I / 1e6  # MPa
    fos = bamboo_tension / stress
    print(f"{d*100:<14.0f} {I*1e8:>8.1f} {stress:>10.1f} MPa {fos:>4.1f}")`,
      challenge: 'Move the idol to the quarter-span (1.5 m from one end). How does the moment diagram change? Where is the maximum now? This asymmetric loading is common when builders place heavy elements off-centre.',
      successHint: 'Bending moment diagrams are the most important tool in structural engineering. Every beam in every building has been analyzed this way — from a bamboo pandal beam to a suspension bridge cable. The parabolic shape for uniform load and the triangular shape for point load are patterns you will see everywhere.',
    },
    {
      title: 'Beam deflection formulas — predicting sag precisely',
      concept: `Deflection tells you how much a beam sags. The general formula for a simply supported beam is derived from **Euler-Bernoulli beam theory**: **EI * d^2y/dx^2 = M(x)**, where E is Young's modulus, I is the moment of inertia, and M(x) is the bending moment at position x.

For standard cases, closed-form solutions exist. Uniform load: **delta_max = 5wL^4 / (384EI)** at midspan. Central point load P: **delta_max = PL^3 / (48EI)** at midspan. These formulas scale differently with span: uniform load as L^4, point load as L^3.

For combined loading, we can use **superposition**: the total deflection is the sum of deflections from each load case separately (valid because the equations are linear for small deflections).`,
      analogy: 'Superposition is like mixing paint colours. Red light plus blue light makes purple — you can predict the result by adding the components. Similarly, the sag from the roof weight plus the sag from the idol equals the total sag. Each load\'s effect adds independently.',
      storyConnection: 'When a Kumartuli builder adds a heavy decoration to a beam that already supports the roof, the beam sags more. Superposition lets us predict exactly how much more — critical for deciding whether a beam needs reinforcement before adding the extra load.',
      checkQuestion: 'A beam deflects 8 mm under uniform roof load and 12 mm under a central idol. What is the total deflection?',
      checkAnswer: 'By superposition: total = 8 + 12 = 20 mm. This works because each load contributes independently to the deflection. The beam does not "know" about the other load — it just responds to the total bending moment at each point.',
      codeIntro: 'Calculate deflections using standard formulas and superposition for combined loads.',
      code: `import numpy as np

# Beam deflection using standard formulas and superposition

def deflection_uniform(x, L, w, E, I):
    """Deflection of simply supported beam under uniform load w"""
    return w * x * (L**3 - 2*L*x**2 + x**3) / (24 * E * I)

def deflection_point(x, L, P, a, E, I):
    """Deflection at x for point load P at position a (a <= L/2)"""
    b = L - a
    if x <= a:
        return P * b * x * (L**2 - b**2 - x**2) / (6 * E * I * L)
    else:
        return P * a * (L - x) * (2*L*x - x**2 - a**2) / (6 * E * I * L)

# Beam properties
L = 6.0        # span (m)
d = 0.12       # diameter (m)
r_o = d / 2
r_i = r_o * 0.8
I = np.pi / 4 * (r_o**4 - r_i**4)
E = 15e9       # bamboo Young's modulus (Pa)

# Loads
w = 600        # N/m (roof + self weight)
P_idol = 4000  # N (central idol)
P_deco = 1500  # N (decoration at quarter-span)

x = np.linspace(0, L, 200)

# Individual deflections
d_uniform = np.array([deflection_uniform(xi, L, w, E, I) for xi in x])
d_idol = np.array([deflection_point(xi, L, P_idol, L/2, E, I) for xi in x])
d_deco = np.array([deflection_point(xi, L, P_deco, L/4, E, I) for xi in x])
d_total = d_uniform + d_idol + d_deco

print("=== Beam Deflection by Superposition ===")
print(f"Span: {L} m | Bamboo: {d*100:.0f} cm dia, E = {E/1e9:.0f} GPa")
print(f"I = {I*1e8:.2f} cm4")
print()

print(f"{'Load Case':<24} {'Max Deflection (mm)':>20} {'At position (m)':>16}")
print("-" * 62)

cases = [
    ("Uniform roof (600 N/m)", d_uniform),
    ("Idol (4000 N, centre)", d_idol),
    ("Deco (1500 N, L/4)", d_deco),
    ("TOTAL (superposition)", d_total),
]

for name, d_arr in cases:
    max_d = np.max(d_arr) * 1000  # mm
    max_pos = x[np.argmax(d_arr)]
    print(f"{name:<24} {max_d:>18.1f} {max_pos:>14.1f}")

# Check against limit
limit_mm = L * 1000 / 360
print(f"\\nDeflection limit (L/360): {limit_mm:.1f} mm")
total_max = np.max(d_total) * 1000
print(f"Total deflection: {total_max:.1f} mm")
print(f"Status: {'OK' if total_max <= limit_mm else 'EXCEEDS LIMIT'}")

# Parametric study: what diameter is needed?
print()
print("=== Required Diameter for Different Load Combos ===")
print(f"{'Load combo':<30} {'Min dia (cm)':>12}")
print("-" * 44)

load_combos = [
    ("Roof only", w, 0, 0),
    ("Roof + idol", w, P_idol, 0),
    ("Roof + idol + deco", w, P_idol, P_deco),
    ("Roof + 2x idol", w, P_idol*2, 0),
]

for name, w_val, p1, p2 in load_combos:
    # Binary search for minimum diameter
    for d_test_cm in np.arange(6, 25, 0.5):
        d_t = d_test_cm / 100
        r_t = d_t / 2
        ri_t = r_t * 0.8
        I_t = np.pi / 4 * (r_t**4 - ri_t**4)
        max_def = 0
        for xi in np.linspace(0, L, 50):
            total = deflection_uniform(xi, L, w_val, E, I_t)
            if p1 > 0:
                total += deflection_point(xi, L, p1, L/2, E, I_t)
            if p2 > 0:
                total += deflection_point(xi, L, p2, L/4, E, I_t)
            max_def = max(max_def, total)
        if max_def * 1000 <= limit_mm:
            print(f"{name:<30} {d_test_cm:>10.1f}")
            break`,
      challenge: 'Add a second decoration load of 2000 N at 3/4 span. Use superposition to find the total deflection. Where is the maximum now? (Hint: it may not be at midspan anymore.) This asymmetric loading shifts the worst-case position.',
      successHint: 'Superposition is one of the most powerful principles in engineering. It works for deflections, stresses, electrical circuits, wave interference, and signal processing. Master it here, and you have a tool that transfers to dozens of other fields.',
    },
    {
      title: 'Moment of inertia — why shape matters more than material',
      concept: `The **moment of inertia** (I) measures how a cross-section resists bending. It depends entirely on the *shape* of the cross-section and how material is distributed relative to the bending axis. Material far from the centre contributes much more to I than material near the centre.

For a solid circle: **I = pi*r^4/4**. For a hollow circle: **I = pi*(r_o^4 - r_i^4)/4**. The hollow section has less area but can have nearly the same I — because the material is distributed farther from the centre.

This is why bamboo evolved as a hollow tube, why steel beams are I-shaped (flanges far from centre), and why corrugated cardboard is stiffer than flat cardboard. Shape efficiency — getting maximum I per unit area — is the key to lightweight structures.`,
      analogy: 'Spin a figure skater. Arms tucked in (mass close to axis) — she spins fast (low I). Arms spread wide (mass far from axis) — she spins slowly (high I). The same mass, distributed farther out, resists rotation more strongly. A beam cross-section works identically — material farther from the bending axis resists bending more.',
      storyConnection: 'Kumartuli builders sometimes split a thick bamboo and re-form it into a box section by lashing pieces together. This crude box beam has a much higher moment of inertia than the original round section because the material is spread farther from the neutral axis. It is heavier (more lashing and overlaps) but dramatically stiffer.',
      checkQuestion: 'A solid bamboo pole has diameter 10 cm. A hollow one has outer diameter 10 cm and wall thickness 1 cm. What fraction of the solid\'s I does the hollow retain?',
      checkAnswer: 'Solid: I = pi*5^4/4 = 490.9 cm4. Hollow: r_o = 5 cm, r_i = 4 cm, I = pi*(5^4 - 4^4)/4 = pi*(625-256)/4 = 289.8 cm4. Ratio = 289.8/490.9 = 59%. The hollow section keeps 59% of the stiffness with only 36% of the material — that is 1.64x more efficient per unit material.',
      codeIntro: 'Compare moment of inertia for different cross-section shapes used in pandal construction.',
      code: `import numpy as np

# Moment of inertia comparison for different cross-sections

def I_solid_circle(d):
    return np.pi * (d/2)**4 / 4

def I_hollow_circle(d_out, d_in):
    return np.pi * ((d_out/2)**4 - (d_in/2)**4) / 4

def I_rectangle(b, h):
    return b * h**3 / 12

def I_hollow_rectangle(b_out, h_out, b_in, h_in):
    return (b_out * h_out**3 - b_in * h_in**3) / 12

def I_i_beam(flange_w, flange_t, web_h, web_t):
    """I-beam: two flanges + web"""
    total_h = web_h + 2 * flange_t
    # Outer rectangle minus inner voids
    I_outer = flange_w * total_h**3 / 12
    void_h = web_h
    void_w = (flange_w - web_t) / 2
    I_voids = 2 * (void_w * void_h**3 / 12)
    return I_outer - I_voids

# All sections designed with approximately same area (~30 cm2)
target_area = 30  # cm2

sections = []

# Solid circle: A = pi*r^2 = 30 => r = 3.09 cm
r_solid = np.sqrt(target_area / np.pi)
d_solid = 2 * r_solid
sections.append(("Solid circle", target_area, I_solid_circle(d_solid) , d_solid))

# Hollow circle: A = pi*(r_o^2 - r_i^2) = 30, r_i = 0.8*r_o
# 30 = pi * r_o^2 * (1 - 0.64) => r_o = sqrt(30 / (pi*0.36))
r_o = np.sqrt(target_area / (np.pi * 0.36))
r_i = 0.8 * r_o
d_out = 2 * r_o
d_in = 2 * r_i
A_hollow = np.pi * (r_o**2 - r_i**2)
sections.append(("Hollow circle", A_hollow, I_hollow_circle(d_out, d_in), d_out))

# Solid square: A = s^2 = 30 => s = 5.48 cm
s = np.sqrt(target_area)
sections.append(("Solid square", target_area, I_rectangle(s, s), s))

# Hollow square: 10 cm x 10 cm, t = wall thickness
# A = 10^2 - (10-2t)^2 = 30 => solve for t
# 100 - (10-2t)^2 = 30 => (10-2t)^2 = 70 => 10-2t = 8.37 => t = 0.815 cm
h_box = 10
t_box = 0.815
inner = h_box - 2 * t_box
A_box = h_box**2 - inner**2
sections.append(("Hollow square", A_box, I_hollow_rectangle(h_box, h_box, inner, inner), h_box))

# I-beam: flanges 8x1 cm, web 8x0.5 cm
# A = 2*(8*1) + 8*0.5 = 16+4 = 20 — adjust
fw, ft, wh, wt = 10, 1.0, 8, 1.0
A_i = 2 * fw * ft + wh * wt
I_ib = I_i_beam(fw, ft, wh, wt)
sections.append(("I-beam", A_i, I_ib, wh + 2*ft))

print("=== Cross-Section Comparison (equal area ~30 cm2) ===")
print(f"{'Shape':<18} {'Area (cm2)':>10} {'I (cm4)':>10} {'Height (cm)':>12} {'I/A ratio':>10}")
print("-" * 62)

for name, area, I_val, height in sections:
    I_cm4 = I_val  # already in cm4 (inputs in cm)
    ratio = I_cm4 / area
    print(f"{name:<18} {area:>8.1f} {I_cm4:>8.1f} {height:>10.1f} {ratio:>8.1f}")

# Efficiency ranking
print()
print("=== Shape Efficiency Ranking ===")
sorted_sections = sorted(sections, key=lambda x: x[2]/x[1], reverse=True)
for rank, (name, area, I_val, _) in enumerate(sorted_sections, 1):
    eff = I_val / area
    print(f"  {rank}. {name:<18} Efficiency (I/A): {eff:.1f} cm2")

print()
print("Hollow and I-beam shapes get MORE stiffness per unit material.")
print("Bamboo's natural hollow tube is evolution's optimal solution!")`,
      challenge: 'Design a "bundled bamboo I-beam": two horizontal bamboo poles (flanges) connected by vertical bamboo strips (web). Calculate its I using the parallel axis theorem. Compare to a single bamboo of the same total weight.',
      successHint: 'The moment of inertia principle explains every structural shape you see: why steel beams have flanges, why floor joists are tall and thin, why aircraft fuselages are cylindrical, and why bamboo is hollow. Material far from the centre does more work than material at the centre.',
    },
    {
      title: 'Combined loading — axial force plus bending',
      concept: `Real structural members rarely experience pure compression or pure bending alone. A pandal column that leans slightly experiences both **axial compression** (from the weight above) and **bending** (from the lean angle). This combined loading is more dangerous than either alone.

The combined stress is: **sigma = P/A + M*y/I**, where P/A is the axial stress and M*y/I is the bending stress. On one side, the stresses add (both compressive); on the other side, they partially cancel (compression from axial, tension from bending).

For columns, bending from eccentricity or lean can cause **buckling** — a sudden sideways collapse. Euler's buckling formula gives the critical load: **P_cr = pi^2 * E * I / L_eff^2**, where L_eff is the effective length (depends on end conditions).`,
      analogy: 'Push straight down on a drinking straw — it holds a surprising amount of weight. Now push slightly off-centre — it buckles immediately. The off-centre push creates a bending moment that, combined with the axial compression, triggers buckling at a fraction of the pure compression strength.',
      storyConnection: 'Wind loads on a pandal push columns sideways, creating bending in members designed mainly for compression. Kumartuli builders counteract this with diagonal bracing — bamboo poles tied at 45 degrees that convert lateral forces into axial forces along the diagonals. This bracing is why pandals survive the fierce winds that often accompany monsoon-season Durga Puja.',
      checkQuestion: 'A column has axial stress of 5 MPa (compression) and bending stress of 8 MPa. What is the maximum combined stress? On which face?',
      checkAnswer: 'On the compression face: 5 + 8 = 13 MPa (both compressive, they add). On the tension face: 5 - 8 = -3 MPa (net tension). The compression face fails first at 13 MPa. Combined loading creates higher stress than either component alone.',
      codeIntro: 'Analyse combined axial and bending loads on pandal columns, including buckling check.',
      code: `import numpy as np

# Combined loading analysis for pandal columns

g = 9.81

def column_analysis(height_m, diameter_m, axial_load_N,
                    lateral_load_N=0, eccentricity_m=0,
                    E_GPa=15, hollow_ratio=0.8):
    """Analyse a column under combined axial + bending"""
    r_o = diameter_m / 2
    r_i = r_o * hollow_ratio
    A = np.pi * (r_o**2 - r_i**2)
    I = np.pi * (r_o**4 - r_i**4) / 4
    E = E_GPa * 1e9

    # Axial stress
    sigma_axial = axial_load_N / A / 1e6  # MPa

    # Bending from eccentricity
    M_eccentric = axial_load_N * eccentricity_m

    # Bending from lateral load (cantilever: M = F*L at base)
    M_lateral = lateral_load_N * height_m

    M_total = M_eccentric + M_lateral
    sigma_bending = M_total * (diameter_m / 2) / I / 1e6  # MPa

    # Combined stresses
    sigma_max = sigma_axial + sigma_bending  # compression face
    sigma_min = sigma_axial - sigma_bending  # tension face

    # Euler buckling load
    # Pin-pin: Leff = L, Fixed-pin: Leff = 0.7L
    L_eff = height_m * 0.85  # assume partially fixed base
    P_euler = np.pi**2 * E * I / L_eff**2

    # Buckling FoS
    fos_buckling = P_euler / axial_load_N

    return {
        "sigma_axial": sigma_axial,
        "sigma_bending": sigma_bending,
        "sigma_max": sigma_max,
        "sigma_min": sigma_min,
        "M_total": M_total,
        "P_euler": P_euler,
        "fos_buckling": fos_buckling,
    }

# Case 1: Perfect column (no eccentricity, no wind)
print("=== Case 1: Perfect Vertical Column ===")
h = 4.0   # m
d = 0.10  # m
P = 10000 # N

r1 = column_analysis(h, d, P)
print(f"Height: {h} m | Diameter: {d*100:.0f} cm | Axial: {P} N")
print(f"Axial stress: {r1['sigma_axial']:.2f} MPa")
print(f"Bending stress: {r1['sigma_bending']:.2f} MPa")
print(f"Euler buckling load: {r1['P_euler']:.0f} N")
print(f"Buckling FoS: {r1['fos_buckling']:.1f}")

# Case 2: Leaning column (50mm eccentricity)
print()
print("=== Case 2: Column Leaning 50mm ===")
r2 = column_analysis(h, d, P, eccentricity_m=0.05)
print(f"Eccentricity: 50 mm")
print(f"Axial stress: {r2['sigma_axial']:.2f} MPa")
print(f"Bending stress: {r2['sigma_bending']:.2f} MPa")
print(f"Max combined: {r2['sigma_max']:.2f} MPa (compression face)")
print(f"Min combined: {r2['sigma_min']:.2f} MPa ({'tension' if r2['sigma_min'] < 0 else 'compression'})")

# Case 3: Wind load
print()
print("=== Case 3: Column with Wind Load ===")
wind_force = 500  # N lateral
r3 = column_analysis(h, d, P, lateral_load_N=wind_force)
print(f"Wind force: {wind_force} N lateral")
print(f"Bending moment at base: {r3['M_total']:.0f} N*m")
print(f"Max combined stress: {r3['sigma_max']:.2f} MPa")
print(f"Buckling FoS: {r3['fos_buckling']:.1f}")

# Parametric: effect of slenderness (height/diameter ratio)
print()
print("=== Slenderness Effect on Buckling ===")
print(f"{'H/D ratio':>10} {'Height (m)':>10} {'P_euler (kN)':>14} {'FoS':>6}")
print("-" * 42)

for hd_ratio in [10, 20, 30, 40, 50, 60]:
    h_var = d * hd_ratio
    r = column_analysis(h_var, d, P)
    print(f"{hd_ratio:>10} {h_var:>10.1f} {r['P_euler']/1000:>12.1f} {r['fos_buckling']:>4.1f}")

print()
print("As slenderness increases, buckling capacity drops as 1/L^2.")
print("Tall, thin columns buckle before they crush!")`,
      challenge: 'A column is 5 m tall, 10 cm diameter, carrying 8000 N, leaning 30 mm, with 300 N wind. Calculate all stresses. Then find the minimum diameter where the buckling FoS stays above 3. This combined analysis is what Kumartuli builders do intuitively when they judge column sizes.',
      successHint: 'Combined loading analysis is essential for every real structure. Pure textbook cases (axial only, bending only) almost never occur in practice. Every column leans a little, every beam has some axial force, and wind pushes on everything. Engineers must always check combined effects.',
    },
    {
      title: 'Connection design — the joint is the weakest link',
      concept: `In a bamboo pandal, the connections (joints) are almost always weaker than the members themselves. A lashed bamboo joint can transfer only a fraction of the bamboo's full strength. The joint efficiency is: **eta = Joint capacity / Member capacity * 100%**.

Typical bamboo joint efficiencies: rope lashing 20-40%, bolted connection 40-60%, steel clamp 60-80%, fish-mouth joint with epoxy 70-90%. The overall structure is only as strong as its weakest joint.

Joint failure modes include: **bearing** (the bolt or rope crushes into the bamboo), **shear** (the bamboo splits along its grain), **pullout** (the connection slides apart), and **rope failure** (the lashing snaps).`,
      analogy: 'A chain is only as strong as its weakest link. You could use the world\'s strongest bamboo, but if the rope holding two pieces together fails at half the bamboo\'s capacity, the structure is only half as strong as the bamboo would suggest. Designing joints is often harder than designing members.',
      storyConnection: 'The Kumartuli lashing technique uses specific knot patterns passed down through generations. A master builder\'s knot uses the rope\'s full strength and grips the bamboo without crushing it. An amateur\'s knot might look similar but can be 50% weaker. The difference is in the details: number of wraps, direction of the cross-ties, and how the rope is tensioned.',
      checkQuestion: 'A bamboo member can resist 20 kN in tension. The lashed joint connecting it to the frame has an efficiency of 35%. What is the effective capacity of the connection?',
      checkAnswer: 'Joint capacity = 20 * 0.35 = 7 kN. The bamboo member can handle 20 kN but the joint limits the system to 7 kN — less than half. This is why joint design dominates bamboo structural engineering.',
      codeIntro: 'Design and analyse bamboo connections for a pandal frame.',
      code: `import numpy as np

# Bamboo connection analysis

class BambooJoint:
    def __init__(self, name, bamboo_dia_cm, bamboo_strength_MPa,
                 joint_type, efficiency_pct):
        self.name = name
        self.dia = bamboo_dia_cm / 100  # m
        self.strength = bamboo_strength_MPa
        self.type = joint_type
        self.efficiency = efficiency_pct / 100

        # Bamboo member capacity
        r = self.dia / 2
        ri = r * 0.8
        self.area = np.pi * (r**2 - ri**2)
        self.member_capacity = self.strength * 1e6 * self.area
        self.joint_capacity = self.member_capacity * self.efficiency

# Joint types used in pandal construction
joints = [
    BambooJoint("Roof-to-beam", 8, 60, "Simple rope lashing", 25),
    BambooJoint("Beam-to-column", 10, 60, "Cross-lashed rope", 35),
    BambooJoint("Column-to-base", 12, 60, "Steel base plate", 70),
    BambooJoint("Diagonal brace", 8, 150, "Fish-mouth + rope", 30),
    BambooJoint("Beam splice", 10, 150, "Overlap + lash", 40),
    BambooJoint("Critical joint", 10, 60, "Bolted steel clamp", 65),
]

print("=== Pandal Joint Analysis ===")
print(f"{'Joint':<18} {'Type':<22} {'Member (kN)':>12} {'Joint (kN)':>12} {'Eff %':>6}")
print("-" * 72)

for j in joints:
    print(f"{j.name:<18} {j.type:<22} "
          f"{j.member_capacity/1000:>10.1f} {j.joint_capacity/1000:>10.1f} {j.efficiency*100:>4.0f}%")

# How many rope wraps are needed?
print()
print("=== Rope Lashing Design ===")
rope_dia_mm = 8
rope_strength_MPa = 40  # jute rope
rope_area = np.pi * (rope_dia_mm/2000)**2
single_rope_capacity = rope_strength_MPa * 1e6 * rope_area

print(f"Rope: {rope_dia_mm} mm jute, capacity = {single_rope_capacity:.0f} N")
print()

# Different joint loads
print(f"{'Joint Load (kN)':>16} {'Wraps needed':>14} {'Rope length (m)':>16}")
print("-" * 48)

for load_kN in [1, 2, 5, 8, 10, 15]:
    load_N = load_kN * 1000
    # Each wrap provides ~2x rope capacity (friction multiplier)
    friction_factor = 1.8
    wraps = int(np.ceil(load_N / (single_rope_capacity * friction_factor)))
    # Rope length per wrap (around 10cm bamboo)
    circumference = np.pi * 0.10
    rope_length = wraps * circumference * 1.5  # 1.5x for crossing pattern
    print(f"{load_kN:>16} {wraps:>14} {rope_length:>14.1f}")

# System analysis: find the weakest joint
print()
print("=== System Bottleneck Analysis ===")
weakest = min(joints, key=lambda j: j.joint_capacity)
strongest = max(joints, key=lambda j: j.joint_capacity)
print(f"Weakest joint: {weakest.name} ({weakest.type})")
print(f"  Capacity: {weakest.joint_capacity/1000:.1f} kN")
print(f"Strongest joint: {strongest.name} ({strongest.type})")
print(f"  Capacity: {strongest.joint_capacity/1000:.1f} kN")
print(f"System limited by weakest: {weakest.joint_capacity/1000:.1f} kN")
print()

# Cost to upgrade weakest joint
upgrade_cost = {"Simple rope lashing": 50, "Cross-lashed rope": 100,
                "Fish-mouth + rope": 200, "Overlap + lash": 150,
                "Bolted steel clamp": 500, "Steel base plate": 800}
print("Upgrade path (weakest to strongest):")
sorted_types = sorted(upgrade_cost.items(), key=lambda x: x[1])
for jtype, cost in sorted_types:
    matching = [j for j in joints if j.type == jtype]
    if matching:
        print(f"  {jtype:<22} Eff: {matching[0].efficiency*100:.0f}%  Cost: Rs {cost}")`,
      challenge: 'The weakest joint limits the entire structure. Calculate: if you upgrade only the weakest joint from rope lashing (25%) to steel clamp (65%), how much does the system capacity increase? What is the cost per kN gained? This cost-effectiveness analysis guides real upgrade decisions.',
      successHint: 'Connection design is often the most critical and most neglected part of structural engineering. Spectacular failures (bridge collapses, building collapses) are more often caused by joint failures than member failures. Always check the joints first.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Moment calculations, deflection, and connection design</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to calculate bending moments, deflections, and connection capacities for pandal structures.
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
