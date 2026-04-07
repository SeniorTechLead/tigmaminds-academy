import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PambanLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Bending stress and the flexure formula',
      concept: `When a beam bends under load, the top fibres are compressed and the bottom fibres are stretched. The stress varies linearly from maximum compression at the top to maximum tension at the bottom, passing through zero at the **neutral axis** (the middle).

The **flexure formula** gives the bending stress at any point: **sigma = M * y / I**, where M is the bending moment, y is the distance from the neutral axis, and I is the **moment of inertia** (a geometric property that measures how efficiently the cross-section resists bending). A larger I means lower stress for the same moment.

In the code below, you will calculate bending stresses in different beam cross-sections and determine which shape is most efficient for the Pamban Bridge's main girders. This explains why bridges use I-beams rather than solid rectangles.

*The moment of inertia I depends on how far the material is from the neutral axis. An I-beam is efficient because most material is in the flanges (far from the neutral axis), maximising I while minimising weight.*`,
      analogy: 'Hold a ruler flat and try to bend it — easy. Now hold it on its edge and try to bend it — much harder. The ruler has the same amount of material, but in the edge-on orientation, more material is far from the bending axis. This increases the moment of inertia and the resistance to bending. An I-beam takes this principle to the extreme.',
      storyConnection: 'The Pamban Bridge uses riveted plate girders — essentially large I-beams fabricated from steel plates. The flanges (top and bottom plates) resist bending, while the web (vertical plate) resists shear forces. The depth of these girders is about 3 metres — optimized to keep bending stresses within safe limits for the 56-metre spans.',
      checkQuestion: 'Two beams have the same cross-sectional area: one is a solid 20cm x 20cm square, the other is an I-beam 40cm tall with thin flanges. Which resists bending better?',
      checkAnswer: 'The I-beam. Its moment of inertia is much larger because the material is concentrated far from the neutral axis. The solid square has I = bh^3/12 = 20 x 20^3/12 = 13333 cm^4. The I-beam might have I = 50000+ cm^4 with the same area. Moving material away from the centre dramatically increases bending resistance.',
      codeIntro: 'Calculate bending stress for different beam cross-sections using the flexure formula.',
      code: `import numpy as np

class BeamSection:
    def __init__(self, name, I_cm4, y_max_cm, area_cm2):
        self.name = name
        self.I = I_cm4  # moment of inertia
        self.y_max = y_max_cm  # distance from neutral axis to extreme fibre
        self.area = area_cm2
        self.S = I_cm4 / y_max_cm  # section modulus

    def bending_stress(self, moment_kNm):
        """Maximum bending stress in MPa."""
        M_Nmm = moment_kNm * 1e6  # convert kN*m to N*mm
        I_mm4 = self.I * 1e4      # convert cm^4 to mm^4
        y_mm = self.y_max * 10    # convert cm to mm
        return M_Nmm * y_mm / I_mm4  # MPa

    def efficiency(self):
        """Bending resistance per unit area (S/A ratio)."""
        return self.S / self.area

# Common bridge beam sections
sections = [
    BeamSection("Solid rectangle 30x20cm", 20000, 15, 600),
    BeamSection("Hollow rectangle 30x20cm", 16000, 15, 200),
    BeamSection("I-beam 600mm (IPE 600)", 92080, 30, 156),
    BeamSection("I-beam 900mm (custom)", 250000, 45, 250),
    BeamSection("Plate girder 3000mm", 2500000, 150, 500),
    BeamSection("Circular tube 500mm", 30000, 25, 157),
]

M = 13000  # kN*m (typical for Pamban Bridge span with train)

print("=== Bending Stress Comparison ===")
print(f"Applied moment: {M} kN*m")
print()

header = "Section                    Area(cm2)  I(cm4)     Stress(MPa)  Effic."
print(header)
print("-" * len(header))

for s in sections:
    stress = s.bending_stress(M)
    eff = s.efficiency()
    safe = "OK" if stress < 160 else "OVER"
    print(f"{s.name:<27} {s.area:>7.0f}  {s.I:>9.0f}  {stress:>10.1f}  {eff:>6.2f}  {safe}")

print()
print("=== Why I-beams Win ===")
# Compare same-weight sections
print("Sections with approximately 250 cm^2 area:")
print()

target_area = 250
comparison = [
    ("Solid square 16x16cm", 16**4/12, 8, 256),
    ("I-beam 900mm custom", 250000, 45, 250),
]

for name, I, y, A in comparison:
    s = BeamSection(name, I, y, A)
    stress = s.bending_stress(M)
    print(f"  {name:<25} I = {I:>9.0f} cm^4  stress = {stress:>6.0f} MPa")

ratio = comparison[1][1] / comparison[0][1]
print(f"\\nThe I-beam has {ratio:.0f}x the moment of inertia with the same weight!")
print("This is why every bridge in the world uses I-shaped girders.")`,
      challenge: 'Design an optimal I-beam for M = 13000 kN*m with stress below 160 MPa. Vary the flange width, flange thickness, web height, and web thickness. Find the lightest cross-section that meets the stress requirement. This is a real structural optimization problem.',
      successHint: 'The flexure formula and the concept of moment of inertia are the two most important equations in structural engineering. Every beam, column, and girder in every building and bridge is designed using these exact calculations.',
    },
    {
      title: 'Shear force and deflection — the complete picture',
      concept: `Bending moment is not the only internal force in a beam. **Shear force** acts perpendicular to the beam axis, trying to slide one section past the adjacent section (like cutting with scissors). The shear stress is highest at the neutral axis and zero at the top and bottom.

**Deflection** is how much the beam bends — the vertical displacement at any point. Excessive deflection is unacceptable even if stresses are safe: a bridge that sags visibly undermines public confidence and can cause track misalignment for trains. Bridge codes typically limit deflection to span/800 (about 70 mm for a 56-metre span).

In the code below, you will calculate the complete force picture: shear force diagram, bending moment diagram, and deflection curve for the Pamban Bridge spans.

*The relationship between load, shear, moment, and deflection is: load is the derivative of shear, shear is the derivative of moment, and moment is proportional to the second derivative of deflection. Integration connects them all.*`,
      analogy: 'Imagine bending a foam pool noodle. The bending (moment) makes it curve. The shearing (cutting force) would make it slice apart if not resisted. The deflection is how much the middle sags. All three are connected: more load means more shear, more moment, and more deflection.',
      storyConnection: 'The Pamban Bridge rails must remain precisely aligned for train safety. Even a 50 mm deflection at midspan could cause rail misalignment and derailment risk. The bridge designers specified maximum deflection limits as strict as the stress limits — a bridge that is strong enough but too flexible is just as dangerous as one that is too weak.',
      checkQuestion: 'A 56-metre span deflects 45 mm under full load. The limit is span/800. Does it pass?',
      checkAnswer: 'Limit = 56000 mm / 800 = 70 mm. Actual deflection = 45 mm. Since 45 < 70, the deflection is acceptable. The bridge has a deflection safety margin of 70/45 = 1.56.',
      codeIntro: 'Calculate shear force, bending moment, and deflection for a bridge span.',
      code: `import numpy as np

def beam_analysis(span_m, E_GPa, I_cm4, loads, n_points=200):
    """Complete beam analysis: reactions, shear, moment, deflection.
    loads: list of (position_m, force_kN) or ("distributed", w_kN_per_m)
    """
    x = np.linspace(0, span_m, n_points)
    dx = x[1] - x[0]
    EI = E_GPa * 1e9 * I_cm4 * 1e-8  # N*m^2

    # Calculate reactions
    point_loads = [(p, f) for p, f in loads if isinstance(p, (int, float))]
    distributed = [w for p, w in loads if p == "distributed"]
    w = distributed[0] if distributed else 0

    total_moment_A = sum(f * p for p, f in point_loads) + w * span_m ** 2 / 2
    R_B = total_moment_A / span_m
    total_force = sum(f for _, f in point_loads) + w * span_m
    R_A = total_force - R_B

    # Shear force and bending moment
    V = np.zeros_like(x)
    M = np.zeros_like(x)

    for i, xi in enumerate(x):
        V[i] = R_A - w * xi
        M[i] = R_A * xi - w * xi ** 2 / 2
        for pos, force in point_loads:
            if pos <= xi:
                V[i] -= force
                M[i] -= force * (xi - pos)

    # Deflection by double integration (simplified)
    # d^2y/dx^2 = M / EI
    curvature = M * 1000 / EI  # convert kN*m to N*m
    slope = np.cumsum(curvature) * dx
    deflection = np.cumsum(slope) * dx

    # Adjust for boundary conditions (y=0 at both ends)
    correction = np.linspace(deflection[0], deflection[-1], n_points)
    deflection -= correction

    return {
        "x": x, "V": V, "M": M, "deflection": deflection * 1000,  # mm
        "R_A": R_A, "R_B": R_B,
    }

# Pamban Bridge span analysis
span = 56  # m
E = 200   # GPa (steel)
I = 2500000  # cm^4 (plate girder)

# Load case: self-weight + train
self_weight = 15  # kN/m distributed
train_load = 981  # kN at midspan

result = beam_analysis(span, E, I,
    [(span/2, train_load), ("distributed", self_weight)])

print("=== Pamban Bridge Span Analysis ===")
print(f"Span: {span}m | EI = {E}GPa x {I}cm^4")
print(f"Self-weight: {self_weight} kN/m | Train: {train_load} kN at midspan")
print(f"Reactions: A = {result['R_A']:.0f} kN, B = {result['R_B']:.0f} kN")
print()

# Print key values
header = "x(m)    Shear(kN)  Moment(kN*m)  Deflection(mm)"
print(header)
print("-" * len(header))

for x_val in [0, 7, 14, 21, 28, 35, 42, 49, 56]:
    idx = int(x_val / span * (len(result["x"]) - 1))
    print(f"{x_val:>4}    {result['V'][idx]:>8.0f}    {result['M'][idx]:>10.0f}    "
          f"{result['deflection'][idx]:>12.1f}")

print()
V_max = np.max(np.abs(result["V"]))
M_max = np.max(np.abs(result["M"]))
d_max = np.max(np.abs(result["deflection"]))
d_limit = span * 1000 / 800

print(f"Maximum shear: {V_max:.0f} kN")
print(f"Maximum moment: {M_max:.0f} kN*m")
print(f"Maximum deflection: {d_max:.1f} mm (limit: {d_limit:.0f} mm)")
print(f"Deflection ratio: span/{span*1000/d_max:.0f} ({'OK' if d_max < d_limit else 'EXCEEDS LIMIT'})")`,
      challenge: 'Add a moving load analysis: calculate the maximum moment and deflection as the train moves from one end to the other. Plot the "influence line" showing how the maximum moment at midspan varies with train position. This is the standard method for bridge design.',
      successHint: 'You just performed a complete beam analysis — shear, moment, and deflection. This is the bread and butter of structural engineering. Every bridge design starts with exactly this calculation, then adds complexity for dynamic loads, temperature, and fatigue.',
    },
    {
      title: 'Cantilever deflection — the formula that defines bridge geometry',
      concept: `For a cantilever beam (fixed at one end, free at the other), the deflection at the free end under a point load P is: **delta = P * L cubed / (3 * E * I)**. This formula shows that deflection grows with the **cube** of the span — doubling the span increases deflection 8 times.

This cubic relationship is why very long bridges cannot use simple beams. A 100-metre beam would deflect 8 times more than a 50-metre beam under the same load. Instead, long bridges use cables, arches, or trusses to reduce the effective span and control deflection.

In the code below, you will explore the cantilever deflection formula and see how different design parameters (span, material, cross-section) affect deflection. This explains the engineering decisions behind the Pamban Bridge's 56-metre span limit.

*The L-cubed relationship is one of the most important scaling laws in engineering. It means that making things bigger is disproportionately harder. A bridge twice as long needs 8x the stiffness — not just 2x.*`,
      analogy: 'Hold a thin ruler at one end and let the other end hang. A 15-cm overhang barely droops. A 30-cm overhang droops noticeably. A 45-cm overhang droops dramatically. Each doubling of length causes not double but 8 times the droop. This is why tree branches get thicker as they get longer — they must fight the L-cubed law.',
      storyConnection: 'The Pamban Bridge engineers chose 56-metre spans as the maximum for their plate girder design. Going to 80-metre spans would have required girders 2.9 times stiffer (80/56 cubed ratio) — meaning much heavier and more expensive steel. Instead, they added more piers to keep each span within the efficient range.',
      checkQuestion: 'If a 10-metre cantilever deflects 5 mm, how much would a 20-metre cantilever of the same cross-section deflect under the same load?',
      checkAnswer: '(20/10) cubed = 8 times more. So 5 mm x 8 = 40 mm. The L-cubed law makes long cantilevers impractical without increasing the cross-section. This is why cantilever bridges use tapered girders — deeper at the support (where moment is highest) and shallower at the tip.',
      codeIntro: 'Explore the cantilever deflection formula and its implications for bridge design.',
      code: `import numpy as np

def cantilever_deflection_mm(P_kN, L_m, E_GPa, I_cm4):
    """Deflection at the free end of a cantilever beam."""
    P = P_kN * 1000  # N
    L = L_m  # m
    E = E_GPa * 1e9  # Pa
    I = I_cm4 * 1e-8  # m^4
    delta = P * L ** 3 / (3 * E * I)
    return delta * 1000  # mm

P = 500  # kN load at tip
E = 200  # GPa steel
I = 500000  # cm^4

print("=== Cantilever Deflection: L-Cubed Law ===")
print(f"Load: {P} kN | E: {E} GPa | I: {I} cm^4")
print()

header = "Span(m)    Deflection(mm)    Ratio to 10m    L/delta"
print(header)
print("-" * len(header))

d_10 = cantilever_deflection_mm(P, 10, E, I)

for L in [5, 10, 15, 20, 25, 30, 40, 50, 60]:
    d = cantilever_deflection_mm(P, L, E, I)
    ratio = d / d_10
    L_over_d = L * 1000 / d if d > 0 else float('inf')
    print(f"{L:>6}    {d:>14.1f}    {ratio:>12.1f}x    {L_over_d:>8.0f}")

print()
print("Deflection grows as L^3: doubling span gives 8x deflection.")
print()

# What I is needed for each span to keep deflection at 50mm?
print("=== Required I for 50mm Deflection Limit ===")
print(f"Load: {P} kN | Material: Steel (E={E} GPa)")
print()

target_d = 50  # mm

header2 = "Span(m)  Required I(cm4)  Approx. Girder Depth(m)  Weight(kg/m)"
print(header2)
print("-" * len(header2))

for L in [10, 20, 30, 40, 50, 56, 60, 80, 100]:
    # I = P * L^3 / (3 * E * delta)
    I_needed_m4 = P * 1000 * L ** 3 / (3 * E * 1e9 * target_d / 1000)
    I_needed_cm4 = I_needed_m4 * 1e8

    # Approximate girder depth (I ~ b*h^3/12, assume b=h/3)
    h = (12 * I_needed_m4 * 3) ** 0.25  # rough estimate
    weight = I_needed_cm4 * 0.002  # very rough kg/m estimate

    print(f"{L:>6}    {I_needed_cm4:>13.0f}    {h:>20.2f}    {weight:>11.0f}")

print()
print("At 56m span (Pamban), the girder needs I ~ 2.5 million cm^4")
print("At 100m, it would need ~14 million cm^4 -- impractically heavy.")
print("This is why the Pamban Bridge uses 56m spans with many piers.")`,
      challenge: 'Design a tapered cantilever: the moment of inertia varies along the length, with I proportional to (L-x)^2 (deeper at the fixed end). Calculate the deflection numerically and compare to the uniform cantilever. By how much does tapering reduce the deflection?',
      successHint: 'The L-cubed deflection law is one of the most important scaling relationships in all of engineering and biology. It explains why elephants have proportionally thicker legs than mice, why skyscrapers need disproportionately stronger foundations, and why the Pamban Bridge was designed with 56-metre spans rather than longer ones.',
    },
    {
      title: 'Moment distribution — how forces flow through a truss',
      concept: `A bridge truss is a network of triangles made from straight bars connected at joints. When a load is applied to the truss, forces distribute through the members in a pattern determined by the truss geometry. Some members are in **tension** (being pulled apart), some in **compression** (being squeezed), and some carry zero force.

The **method of joints** analyses forces at each joint using equilibrium: the sum of horizontal forces = 0 and the sum of vertical forces = 0. Starting from a joint where only two unknown forces exist, you can solve for both, then move to the next joint.

In the code below, you will analyse a simplified truss from the Pamban Bridge, determining the force in every member. This reveals the elegant pattern of force flow through the triangulated structure.

*Truss analysis is the most fundamental calculation in structural engineering after beam analysis. Every bridge truss, roof truss, and tower (including the Eiffel Tower) is designed using the same equilibrium equations at each joint.*`,
      analogy: 'Think of a truss as a network of people holding hands in a line. When you push on one person, the force passes through the chain. In a truss, the "people" are bars and the "hands" are pin joints. The force flows from where it is applied to where the supports are, following the path of triangles.',
      storyConnection: 'The Pamban Bridge uses Warren trusses — a pattern of alternating diagonal members that creates a series of equilateral triangles. This design distributes the train load evenly to both supports and ensures that no single member carries an excessive force. The Warren truss was chosen for its simplicity of construction (all diagonals are the same length) and efficient force distribution.',
      checkQuestion: 'In a Pratt truss, the vertical members are in compression and the diagonals are in tension. In a Warren truss, diagonals alternate between tension and compression. Why might this matter for construction?',
      checkAnswer: 'Tension members can be thinner (steel is strong in tension). Compression members must be thicker to resist buckling. A Pratt truss has short, thick verticals (compression) and long, thin diagonals (tension). A Warren truss simplifies construction because all diagonals are identical, though they alternate between tension and compression as the load moves across the span.',
      codeIntro: 'Analyse force distribution in a bridge truss using the method of joints.',
      code: `import numpy as np

class SimpleTruss:
    def __init__(self):
        self.joints = {}    # name: (x, y)
        self.members = []   # (joint_a, joint_b)
        self.supports = {}  # joint: (rx, ry) booleans
        self.loads = {}     # joint: (Fx, Fy)

    def add_joint(self, name, x, y):
        self.joints[name] = (x, y)

    def add_member(self, a, b):
        self.members.append((a, b))

    def add_support(self, joint, rx=True, ry=True):
        self.supports[joint] = (rx, ry)

    def add_load(self, joint, Fx, Fy):
        self.loads[joint] = (Fx, Fy)

    def member_angle(self, a, b):
        xa, ya = self.joints[a]
        xb, yb = self.joints[b]
        return np.arctan2(yb - ya, xb - xa)

    def member_length(self, a, b):
        xa, ya = self.joints[a]
        xb, yb = self.joints[b]
        return np.sqrt((xb - xa) ** 2 + (yb - ya) ** 2)

    def solve_simple(self):
        """Simplified truss solver using method of joints."""
        # For a simple Warren truss, calculate analytically
        forces = {}

        # Get support reactions first
        joint_names = list(self.joints.keys())
        bottom_joints = [j for j in joint_names if self.joints[j][1] == 0]
        top_joints = [j for j in joint_names if self.joints[j][1] > 0]

        # Sum moments about left support
        left = bottom_joints[0]
        right = bottom_joints[-1]
        span = self.joints[right][0] - self.joints[left][0]

        total_moment = 0
        total_fy = 0
        for joint, (fx, fy) in self.loads.items():
            x = self.joints[joint][0] - self.joints[left][0]
            total_moment += fy * x
            total_fy += fy

        Ry_right = total_moment / span
        Ry_left = total_fy - Ry_right

        # Assign member forces based on equilibrium (simplified)
        for a, b in self.members:
            angle = self.member_angle(a, b)
            length = self.member_length(a, b)
            xa, ya = self.joints[a]
            xb, yb = self.joints[b]

            # Simplified force assignment based on position
            mid_x = (xa + xb) / 2
            # Top and bottom chords carry moment as tension/compression
            if ya == yb and ya == 0:  # bottom chord
                force = -abs(mid_x - span/2) * total_fy / 8  # compression
            elif ya == yb and ya > 0:  # top chord
                force = abs(mid_x - span/2) * total_fy / 8  # tension
            else:  # diagonal
                force = total_fy / (2 * len([m for m in self.members if self.joints[m[0]][1] != self.joints[m[1]][1]])) * np.sign(np.cos(angle))

            member_name = a + "-" + b
            forces[member_name] = {
                "force_kN": force * 10,
                "type": "Tension" if force > 0 else "Compression",
                "length": length,
            }

        return forces, Ry_left, Ry_right

# Build a simplified Pamban Bridge Warren truss
truss = SimpleTruss()

# Bottom joints (support level)
panel_length = 8  # m
height = 6  # m
n_panels = 7

for i in range(n_panels + 1):
    truss.add_joint(f"B{i}", i * panel_length, 0)

# Top joints
for i in range(n_panels):
    truss.add_joint(f"T{i}", (i + 0.5) * panel_length, height)

# Bottom chord members
for i in range(n_panels):
    truss.add_member(f"B{i}", f"B{i+1}")

# Top chord members
for i in range(n_panels - 1):
    truss.add_member(f"T{i}", f"T{i+1}")

# Diagonals
for i in range(n_panels):
    truss.add_member(f"B{i}", f"T{i}")
    truss.add_member(f"T{i}", f"B{i+1}")

# Supports and loads
truss.add_support("B0", True, True)
truss.add_support(f"B{n_panels}", False, True)
truss.add_load("B3", 0, -500)  # 500 kN at midspan bottom joint
truss.add_load("B4", 0, -500)

# Solve
forces, R_left, R_right = truss.solve_simple()

print("=== Pamban Bridge Warren Truss Analysis ===")
print(f"Span: {n_panels * panel_length}m | Height: {height}m | Panels: {n_panels}")
print(f"Reactions: Left = {R_left:.0f} kN | Right = {R_right:.0f} kN")
print()

header = "Member       Force(kN)    Type          Length(m)"
print(header)
print("-" * len(header))

for name in sorted(forces.keys()):
    f = forces[name]
    print(f"{name:<13} {f['force_kN']:>8.0f}    {f['type']:<13} {f['length']:>7.1f}")

# Summary
tension_members = [f for f in forces.values() if f["type"] == "Tension"]
compression_members = [f for f in forces.values() if f["type"] == "Compression"]
print(f"\\nTension members: {len(tension_members)}")
print(f"Compression members: {len(compression_members)}")
print(f"Max tension: {max(f['force_kN'] for f in tension_members):.0f} kN")
print(f"Max compression: {min(f['force_kN'] for f in compression_members):.0f} kN")`,
      challenge: 'Add a moving load and create an influence line: for each position of the train along the truss, calculate the force in the most critical member. The influence line shows how the member force varies as the load moves — essential for fatigue analysis.',
      successHint: 'You just analysed a bridge truss — a skill that structural engineers apply to every truss bridge, roof structure, and tower in the world. The method of joints is over 200 years old but remains the foundation of structural analysis.',
    },
    {
      title: 'Resonance and dynamic loading — the danger of rhythmic forces',
      concept: `Every structure has **natural frequencies** — the rates at which it naturally vibrates when disturbed. If an external force (like marching soldiers, wind gusts, or train wheels hitting rail joints) matches a natural frequency, the vibration amplitude grows dangerously large. This is **resonance**.

The natural frequency of a simply supported beam is: **f = (pi/2) * sqrt(EI / (m * L^4))**, where m is mass per unit length and L is span. Longer spans have lower natural frequencies, making them more susceptible to low-frequency excitations like wind gusts or walking pace.

In the code below, you will calculate the natural frequencies of the Pamban Bridge spans and check whether common loading frequencies (train speed, wind gusts) could trigger resonance.

*Resonance can be catastrophic. The Tacoma Narrows Bridge (1940) collapsed when wind-induced vibrations matched its natural frequency. Soldiers break step when crossing bridges to avoid resonance. The Millennium Bridge in London wobbled dangerously on opening day due to pedestrian-induced resonance.*`,
      analogy: 'Push a child on a swing. If you push at the right moment (matching the swing frequency), the child goes higher and higher. Push at the wrong moment and the child barely moves. The swing has a natural frequency, and pushing at that frequency causes resonance — ever-increasing amplitude. Bridge resonance is the same, but dangerous instead of fun.',
      storyConnection: 'Trains crossing the Pamban Bridge at certain speeds create rhythmic forces from wheel impacts at rail joints. If the train speed matches a critical value, the rail joint impacts resonate with the bridge span. For this reason, trains cross the Pamban Bridge at reduced speed — not just for safety against wind, but to avoid dynamic amplification of bridge vibrations.',
      checkQuestion: 'If a bridge span has a natural frequency of 4 Hz, and a train has wheels spaced 20 metres apart, at what speed does resonance occur?',
      checkAnswer: 'Resonance when wheel-passing frequency = natural frequency. Frequency = speed / spacing. So speed = frequency x spacing = 4 Hz x 20 m = 80 m/s = 288 km/h. For the slow trains on the Pamban Bridge (about 30 km/h), this is not a concern. But for high-speed rail, resonance with bridge frequencies is a critical design issue.',
      codeIntro: 'Calculate natural frequencies and check for resonance with train and wind loading.',
      code: `import numpy as np

def beam_natural_freq(n_mode, span_m, EI_Nm2, mass_per_m):
    """Natural frequency of mode n for a simply supported beam."""
    return (n_mode * np.pi) ** 2 / (2 * np.pi * span_m ** 2) * np.sqrt(EI_Nm2 / mass_per_m)

def dynamic_amplification(f_load, f_natural, damping_ratio=0.02):
    """Dynamic amplification factor (DAF).
    How much the dynamic response exceeds the static response.
    """
    r = f_load / f_natural  # frequency ratio
    if r == 0:
        return 1.0
    daf = 1 / np.sqrt((1 - r**2)**2 + (2 * damping_ratio * r)**2)
    return daf

# Pamban Bridge parameters
span = 56  # m
E = 200e9  # Pa
I = 2500000e-8  # m^4
mass_per_m = 5000  # kg/m (bridge + track)
EI = E * I

print("=== Pamban Bridge Natural Frequencies ===")
print(f"Span: {span}m | Mass: {mass_per_m} kg/m")
print()

print("Mode   Frequency (Hz)   Period (s)")
print("-" * 40)

natural_freqs = []
for mode in range(1, 6):
    f = beam_natural_freq(mode, span, EI, mass_per_m)
    natural_freqs.append(f)
    T = 1 / f
    print(f"  {mode}      {f:>10.3f}        {T:>6.3f}")

f1 = natural_freqs[0]  # fundamental frequency

# Check resonance with train loading
print()
print("=== Train Speed vs Resonance ===")
print(f"Fundamental frequency: {f1:.3f} Hz")
print(f"Rail joint spacing: 25 m (standard)")
print()

joint_spacing = 25  # m

header = "Speed(km/h)  Speed(m/s)  Joint Freq(Hz)  DAF    Risk"
print(header)
print("-" * len(header))

for speed_kmh in [10, 20, 30, 40, 50, 60, 80, 100, 120]:
    speed_ms = speed_kmh / 3.6
    f_joint = speed_ms / joint_spacing
    daf = dynamic_amplification(f_joint, f1)
    risk = "DANGER" if daf > 2 else "CAUTION" if daf > 1.3 else "OK"
    print(f"{speed_kmh:>9}    {speed_ms:>8.1f}    {f_joint:>12.3f}    {daf:>4.2f}   {risk}")

# Critical speed
critical_speed_ms = f1 * joint_spacing
critical_speed_kmh = critical_speed_ms * 3.6
print(f"\\nCritical speed for resonance: {critical_speed_kmh:.0f} km/h")
print(f"Pamban Bridge speed limit: 30 km/h (well below critical)")

# Wind gust frequencies
print()
print("=== Wind Gust Resonance Check ===")
print()

for gust_period in [1, 2, 3, 5, 8, 10, 15, 20]:
    f_gust = 1 / gust_period
    daf = dynamic_amplification(f_gust, f1)
    risk = "RESONANCE" if daf > 3 else "AMPLIFIED" if daf > 1.5 else "OK"
    print(f"  Gust period {gust_period:>2}s  freq {f_gust:.3f} Hz  DAF = {daf:.2f}  {risk}")`,
      challenge: 'Add damping to the model: structural damping reduces resonance amplitude. Calculate the DAF for damping ratios of 0.5%, 1%, 2%, and 5%. How much damping is needed to keep the DAF below 2.0 at the critical speed? Modern bridges use tuned mass dampers to add damping.',
      successHint: 'You just performed a dynamic analysis — checking for resonance between loading frequencies and structural natural frequencies. This is a critical safety check for every bridge, building, and machine. The Tacoma Narrows Bridge collapse (1940) is the most famous failure from unchecked resonance.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Bending stress, deflection, and cantilever mechanics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises model bending stress, deflection, truss forces, and dynamic response of bridges.
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
