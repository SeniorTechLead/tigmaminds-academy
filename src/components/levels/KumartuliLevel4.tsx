import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KumartuliLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Pandal geometry generator — parametric design',
      concept: `A parametric design system generates structure geometry from a few input parameters: span, height, number of bays, roof curvature. Changing one parameter automatically updates the entire structure. This is how modern architects design complex forms — and how Kumartuli masters conceptualise their pandals.

The geometry defines: node positions, member connectivity, support conditions, and load application points. From this geometry, all structural analysis (forces, deflections, stability) can be computed automatically.

In the code below, you will build a parametric pandal generator that creates different structural forms from a small set of design parameters.`,
      analogy: 'A parametric generator is like a recipe with adjustable quantities. The recipe stays the same (connect nodes, add members, apply loads), but the quantities change (span, height, curvature). One recipe generates infinite variations — from a small shelter to a grand pavilion.',
      storyConnection: 'Master builder Rathin Chakraborty first sketches a pandal form on paper, then adjusts proportions by eye. A parametric generator does the same thing computationally — define the rules once, then explore variations instantly. The 2019 "Silver Jubilee" pandal used a catenary arch form that was optimised using exactly this kind of parametric exploration.',
      checkQuestion: 'A parametric pandal has 3 adjustable parameters: span (4-12 m), height (3-8 m), and bays (3-8). How many unique designs can be generated if each parameter has 5 possible values?',
      checkAnswer: '5 * 5 * 5 = 125 unique designs from just 3 parameters with 5 values each. With continuous parameters, the possibilities are infinite. This is the power of parametric design — exploring a vast design space from a compact set of rules.',
      codeIntro: 'Build a parametric pandal geometry generator with adjustable span, height, and roof shape.',
      code: `import numpy as np

def generate_pandal(span_m, height_m, n_bays, roof_type="flat",
                    curvature=0.3, side_angle_deg=90):
    """
    Generate a complete pandal geometry.
    Returns nodes, members, and member properties.
    """
    bay_w = span_m / n_bays
    nodes = {}
    members = []
    member_types = []
    nid = 0

    # Bottom chord nodes
    bottom = []
    for i in range(n_bays + 1):
        x = i * bay_w
        nodes[nid] = (x, 0)
        bottom.append(nid)
        nid += 1

    # Top chord nodes (with roof shape)
    top = []
    for i in range(n_bays + 1):
        x = i * bay_w
        t = i / n_bays  # 0 to 1

        if roof_type == "flat":
            y = height_m
        elif roof_type == "gable":
            y = height_m + curvature * span_m * (0.5 - abs(t - 0.5))
        elif roof_type == "arch":
            y = height_m + curvature * span_m * np.sin(np.pi * t)
        elif roof_type == "catenary":
            a = curvature * span_m
            y = height_m + a * (np.cosh((t - 0.5) * 2) - np.cosh(1)) / (np.cosh(0) - np.cosh(1))
        else:
            y = height_m

        # Apply side angle (leaning walls)
        if side_angle_deg != 90:
            lean = (height_m) * np.tan(np.radians(90 - side_angle_deg))
            if t < 0.5:
                x += lean * (1 - 2*t)
            else:
                x -= lean * (2*t - 1)

        nodes[nid] = (x, y)
        top.append(nid)
        nid += 1

    # Bottom chord members
    for i in range(n_bays):
        members.append((bottom[i], bottom[i+1]))
        member_types.append("bottom_chord")

    # Top chord members
    for i in range(n_bays):
        members.append((top[i], top[i+1]))
        member_types.append("top_chord")

    # Verticals
    for i in range(n_bays + 1):
        members.append((bottom[i], top[i]))
        member_types.append("vertical")

    # Diagonals (alternating direction)
    for i in range(n_bays):
        if i % 2 == 0:
            members.append((bottom[i], top[i+1]))
        else:
            members.append((bottom[i+1], top[i]))
        member_types.append("diagonal")

    # Calculate member lengths
    lengths = []
    for ni, nj in members:
        xi, yi = nodes[ni]
        xj, yj = nodes[nj]
        L = np.sqrt((xj-xi)**2 + (yj-yi)**2)
        lengths.append(L)

    return {
        "nodes": nodes,
        "members": members,
        "types": member_types,
        "lengths": lengths,
        "bottom": bottom,
        "top": top,
        "n_bays": n_bays,
    }

# Generate different roof types
roof_types = ["flat", "gable", "arch", "catenary"]

print("=== Parametric Pandal Generator ===")
print(f"Span: 10 m | Height: 5 m | Bays: 5")
print()

for roof in roof_types:
    p = generate_pandal(10, 5, 5, roof_type=roof, curvature=0.15)
    total_length = sum(p["lengths"])
    n_nodes = len(p["nodes"])
    n_members = len(p["members"])

    print(f"--- {roof.upper()} roof ---")
    print(f"  Nodes: {n_nodes} | Members: {n_members}")
    print(f"  Total bamboo length: {total_length:.1f} m")

    # Node heights (roof profile)
    top_heights = [p["nodes"][n][1] for n in p["top"]]
    print(f"  Roof heights: {', '.join(f'{h:.2f}' for h in top_heights)}")
    print()

# Material estimate
print("=== Material Estimate for Arch Pandal ===")
p = generate_pandal(10, 5, 5, roof_type="arch", curvature=0.15)
bamboo_dia = 0.10  # 10 cm
wall_ratio = 0.8
r_o = bamboo_dia / 2
r_i = r_o * wall_ratio
area = np.pi * (r_o**2 - r_i**2)

total_volume = sum(L * area for L in p["lengths"])
total_weight = total_volume * 750  # kg

print(f"Bamboo diameter: {bamboo_dia*100:.0f} cm")
print(f"Total bamboo length: {sum(p['lengths']):.1f} m")
print(f"Total bamboo volume: {total_volume:.3f} m3")
print(f"Total bamboo weight: {total_weight:.0f} kg")
print(f"Bamboo poles needed (~3 m each): {int(np.ceil(sum(p['lengths'])/3))}")

# Member length breakdown
from collections import Counter
type_counts = Counter(p["types"])
for mtype, count in sorted(type_counts.items()):
    type_lengths = [p["lengths"][i] for i, t in enumerate(p["types"]) if t == mtype]
    print(f"  {mtype}: {count} members, avg length {np.mean(type_lengths):.2f} m")`,
      challenge: 'Add a "gothic" roof type where the profile follows two circular arcs meeting at a peak (pointed arch). Generate it and compare total bamboo length to the other types. Gothic arches direct forces more vertically — calculate the angle of the top chord at the peak.',
      successHint: 'Parametric design is how modern architecture works — from Zaha Hadid\'s flowing forms to Norman Foster\'s geodesic domes. The computer generates geometry from rules, and the designer adjusts parameters until the form is right. You just built a simplified version of this workflow.',
    },
    {
      title: 'Full structural analysis — forces in every member',
      concept: `With the pandal geometry defined, we can now perform a complete structural analysis. The **stiffness method** assembles all members into a global system of equations: **[K]{u} = {F}**, where [K] is the stiffness matrix, {u} is the displacement vector, and {F} is the force vector.

Solving this system gives displacements at every node, from which we can calculate forces in every member, reactions at supports, and deflections throughout the structure.

This is the same method used by commercial structural analysis software (SAP2000, ETABS, ANSYS) — just simplified to 2D trusses.`,
      analogy: 'The stiffness method is like a network of springs. Each member is a spring with a known stiffness. Connect them all together and apply forces at the joints. The system finds the equilibrium position where all springs are balanced — that is the deflected shape, and the spring forces are the member forces.',
      storyConnection: 'Before computers, Kumartuli builders tested structures by building a small-scale model and loading it with weights. The model showed which members were in tension (they stretched) and which in compression (they shortened). The stiffness method does the same thing mathematically — a virtual load test.',
      checkQuestion: 'A truss has 10 nodes. Each node has 2 degrees of freedom (x and y displacement). How large is the stiffness matrix [K]?',
      checkAnswer: '20 x 20 (2 * 10 rows and columns). Each entry represents how a force at one degree of freedom affects displacement at another. For a 50-node truss, K would be 100x100 — still easily solvable by a computer in milliseconds.',
      codeIntro: 'Perform a complete stiffness-method analysis of the parametric pandal.',
      code: `import numpy as np

def analyse_truss(nodes, members, supports, loads, E=15e9, A=0.00283):
    """
    Full truss analysis using direct stiffness method.
    E: Young's modulus (Pa)
    A: cross-section area (m2) — 10cm hollow bamboo
    """
    n_dof = len(nodes) * 2
    K = np.zeros((n_dof, n_dof))
    node_list = sorted(nodes.keys())
    nidx = {nid: i for i, nid in enumerate(node_list)}

    # Assemble global stiffness matrix
    for ni, nj in members:
        xi, yi = nodes[ni]
        xj, yj = nodes[nj]
        L = np.sqrt((xj-xi)**2 + (yj-yi)**2)
        c = (xj - xi) / L
        s = (yj - yi) / L
        k = E * A / L

        # Local stiffness in global coordinates
        ke = k * np.array([
            [ c*c,  c*s, -c*c, -c*s],
            [ c*s,  s*s, -c*s, -s*s],
            [-c*c, -c*s,  c*c,  c*s],
            [-c*s, -s*s,  c*s,  s*s],
        ])

        # DOF indices
        dofs = [2*nidx[ni], 2*nidx[ni]+1, 2*nidx[nj], 2*nidx[nj]+1]
        for a in range(4):
            for b in range(4):
                K[dofs[a], dofs[b]] += ke[a, b]

    # Apply loads
    F = np.zeros(n_dof)
    for nid, (fx, fy) in loads.items():
        F[2*nidx[nid]] = fx
        F[2*nidx[nid]+1] = fy

    # Apply boundary conditions (zero displacement at supports)
    fixed_dofs = []
    for nid, stype in supports.items():
        if stype == 'pin':
            fixed_dofs.extend([2*nidx[nid], 2*nidx[nid]+1])
        else:
            fixed_dofs.append(2*nidx[nid]+1)

    free_dofs = [i for i in range(n_dof) if i not in fixed_dofs]

    # Solve reduced system
    K_ff = K[np.ix_(free_dofs, free_dofs)]
    F_f = F[free_dofs]
    u_f = np.linalg.solve(K_ff, F_f)

    # Full displacement vector
    u = np.zeros(n_dof)
    for i, dof in enumerate(free_dofs):
        u[dof] = u_f[i]

    # Calculate member forces
    member_forces = []
    for ni, nj in members:
        xi, yi = nodes[ni]
        xj, yj = nodes[nj]
        L = np.sqrt((xj-xi)**2 + (yj-yi)**2)
        c = (xj - xi) / L
        s = (yj - yi) / L

        ui = u[2*nidx[ni]:2*nidx[ni]+2]
        uj = u[2*nidx[nj]:2*nidx[nj]+2]
        delta = np.dot([c, s], uj - ui)
        force = E * A / L * delta
        member_forces.append(force)

    # Support reactions
    reactions = {}
    for nid in supports:
        rx = K[2*nidx[nid], :] @ u - F[2*nidx[nid]]
        ry = K[2*nidx[nid]+1, :] @ u - F[2*nidx[nid]+1]
        reactions[nid] = (rx, ry)

    return u, member_forces, reactions

# Build a pandal
span, height, n_bays = 10, 5, 5
bay_w = span / n_bays

nodes = {}
bottom, top = [], []
nid = 0
for i in range(n_bays + 1):
    nodes[nid] = (i * bay_w, 0)
    bottom.append(nid)
    nid += 1
    y = height + 0.15 * span * np.sin(np.pi * i / n_bays)  # arch
    nodes[nid] = (i * bay_w, y)
    top.append(nid)
    nid += 1

members = []
for i in range(n_bays):
    members.append((bottom[i], bottom[i+1]))
    members.append((top[i], top[i+1]))
for i in range(n_bays + 1):
    members.append((bottom[i], top[i]))
for i in range(n_bays):
    members.append((bottom[i], top[i+1]))

supports = {bottom[0]: 'pin', bottom[-1]: 'roller'}
loads = {top[i]: (0, -3000) for i in range(1, n_bays)}  # 3 kN at interior top nodes

u, forces, reactions = analyse_truss(nodes, members, supports, loads)

print("=== Complete Pandal Structural Analysis ===")
print(f"Arch pandal: {span} m span, {height} m height, {n_bays} bays")
print(f"Nodes: {len(nodes)} | Members: {len(members)}")
print()

# Member force summary
print(f"{'Member':>6} {'Type':<14} {'Force (kN)':>12} {'Status':<12}")
print("-" * 46)

types = (["bot_chord"] * n_bays + ["top_chord"] * n_bays +
         ["vertical"] * (n_bays+1) + ["diagonal"] * n_bays)

max_tension = 0
max_compress = 0
for i, (force, mtype) in enumerate(zip(forces, types)):
    f_kN = force / 1000
    status = "Tension" if f_kN > 0.1 else "Compression" if f_kN < -0.1 else "~Zero"
    print(f"{i:>6} {mtype:<14} {f_kN:>10.2f} {status:<12}")
    if f_kN > max_tension: max_tension = f_kN
    if f_kN < max_compress: max_compress = f_kN

print(f"\nMax tension:     {max_tension:.2f} kN")
print(f"Max compression: {max_compress:.2f} kN")

# Displacement summary
print()
print("=== Node Displacements ===")
node_list = sorted(nodes.keys())
max_disp = 0
for nid in top:
    idx = {n: i for i, n in enumerate(node_list)}[nid]
    dx = u[2*idx] * 1000
    dy = u[2*idx+1] * 1000
    disp = np.sqrt(dx**2 + dy**2)
    max_disp = max(max_disp, abs(dy))
    print(f"  Node {nid}: dx = {dx:.2f} mm, dy = {dy:.2f} mm")

print(f"\nMax vertical displacement: {max_disp:.2f} mm")
print(f"Limit (L/360): {span*1000/360:.1f} mm")
print(f"Status: {'OK' if max_disp < span*1000/360 else 'EXCEEDS LIMIT'}")`,
      challenge: 'Increase the load to 8 kN per node (heavy decorations). Does the deflection exceed L/360? Try increasing the bamboo diameter from 10 cm to 12 cm and re-run. What is the minimum diameter that keeps deflection within limits?',
      successHint: 'You just built a structural analysis engine — the same core algorithm used by professional software that designs skyscrapers and bridges. The stiffness method, assembled member by member and solved as a matrix equation, is the universal tool of structural engineering.',
    },
    {
      title: 'Load combination and design checks',
      concept: `Real structures must resist multiple load types simultaneously: **dead load** (self-weight), **live load** (people, equipment), **wind load**, and sometimes **seismic** or **impact** loads. Building codes define **load combinations** — specific multiplied combinations of these loads that the structure must survive.

Common load combinations: (1) 1.2*Dead + 1.6*Live, (2) 1.2*Dead + 1.0*Wind + 0.5*Live, (3) 0.9*Dead + 1.3*Wind (checks for uplift — wind can lift a light structure). The factors (1.2, 1.6, etc.) are **load factors** that account for uncertainty in each load type.

For each combination, every member must satisfy: **Demand/Capacity < 1.0** (the demand-to-capacity ratio, or DCR). A DCR of 0.8 means the member is at 80% of its limit — safe. A DCR above 1.0 means the member fails under that combination.`,
      analogy: 'Load combinations are like worst-case weather scenarios for a picnic. You plan for: sunny and crowded (high live load), windy and light crowd (high wind, low live load), and rainy with wind (combined environmental loads). The picnic tent must survive ALL scenarios, not just the sunny one.',
      storyConnection: 'Durga Puja pandals face all these loads simultaneously during the festival: heavy idols (dead load), thousands of visitors (live load), monsoon winds (wind load), and occasionally tremors from traffic or nearby construction (dynamic load). The critical combination is often "maximum crowd + gusty wind" — the most dangerous condition that actually occurs during the festival.',
      checkQuestion: 'Dead load = 10 kN, Live load = 8 kN, Wind load = 12 kN. Using combination 1.2D + 1.0W + 0.5L, what is the design load?',
      checkAnswer: '1.2*10 + 1.0*12 + 0.5*8 = 12 + 12 + 4 = 28 kN. Compare to dead + live only: 1.2*10 + 1.6*8 = 12 + 12.8 = 24.8 kN. The wind combination is more critical (28 > 24.8). Different combinations govern different members.',
      codeIntro: 'Check all load combinations and find the critical case for each pandal member.',
      code: `import numpy as np

# Load combination checker for pandal design

# Member capacities (kN)
members = [
    {"name": "Bottom chord 1", "capacity_T": 45, "capacity_C": 30},
    {"name": "Bottom chord 2", "capacity_T": 45, "capacity_C": 30},
    {"name": "Top chord 1", "capacity_T": 45, "capacity_C": 30},
    {"name": "Top chord 2", "capacity_T": 45, "capacity_C": 30},
    {"name": "Left column", "capacity_T": 20, "capacity_C": 25},
    {"name": "Centre column", "capacity_T": 20, "capacity_C": 25},
    {"name": "Right column", "capacity_T": 20, "capacity_C": 25},
    {"name": "Diagonal 1", "capacity_T": 35, "capacity_C": 15},
    {"name": "Diagonal 2", "capacity_T": 35, "capacity_C": 15},
    {"name": "Cross brace", "capacity_T": 35, "capacity_C": 15},
]

# Forces from each load case (kN, positive = tension)
# Obtained from separate analyses of each load type
dead_forces =  [-5, -4, -8, -7, -12, -15, -12, 6, 5, -2]
live_forces =  [-3, -3, -5, -5, -8, -10, -8, 4, 3, -1]
wind_forces =  [8, -2, 5, -6, 3, -1, -5, 10, -8, 12]

# Load combinations per building code
combinations = [
    ("1.4D", {"D": 1.4, "L": 0, "W": 0}),
    ("1.2D + 1.6L", {"D": 1.2, "L": 1.6, "W": 0}),
    ("1.2D + 1.0W + 0.5L", {"D": 1.2, "L": 0.5, "W": 1.0}),
    ("1.2D + 1.6W + 0.5L", {"D": 1.2, "L": 0.5, "W": 1.6}),
    ("0.9D + 1.3W (uplift)", {"D": 0.9, "L": 0, "W": 1.3}),
    ("1.0D + 1.0L + 1.0W (service)", {"D": 1.0, "L": 1.0, "W": 1.0}),
]

print("=== Load Combination Analysis ===")
print()

# For each member, find the critical combination
critical_results = []

for i, m in enumerate(members):
    worst_dcr = 0
    worst_combo = ""
    worst_force = 0

    for combo_name, factors in combinations:
        force = (factors["D"] * dead_forces[i] +
                 factors["L"] * live_forces[i] +
                 factors["W"] * wind_forces[i])

        if force >= 0:
            capacity = m["capacity_T"]
        else:
            capacity = m["capacity_C"]

        dcr = abs(force) / capacity

        if dcr > worst_dcr:
            worst_dcr = dcr
            worst_combo = combo_name
            worst_force = force

    status = "OK" if worst_dcr < 0.9 else "MARGINAL" if worst_dcr < 1.0 else "FAIL"
    critical_results.append({
        "name": m["name"], "dcr": worst_dcr,
        "combo": worst_combo, "force": worst_force, "status": status
    })

print(f"{'Member':<18} {'DCR':>6} {'Force (kN)':>10} {'Critical Combo':<28} {'Status':<8}")
print("-" * 74)

for r in critical_results:
    print(f"{r['name']:<18} {r['dcr']:>5.2f} {r['force']:>8.1f} {r['combo']:<28} {r['status']:<8}")

# Summary
failing = [r for r in critical_results if r["status"] == "FAIL"]
marginal = [r for r in critical_results if r["status"] == "MARGINAL"]

print()
print(f"Members OK:       {len(critical_results) - len(failing) - len(marginal)}")
print(f"Members MARGINAL: {len(marginal)}")
print(f"Members FAILING:  {len(failing)}")

if failing:
    print("\nMembers needing upgrade:")
    for r in failing:
        upgrade_factor = r["dcr"]
        new_dia = 10 * np.sqrt(upgrade_factor)
        print(f"  {r['name']}: increase diameter from 10 cm to {new_dia:.0f} cm")

# Which combination governs most members?
print()
print("=== Governing Combination Summary ===")
from collections import Counter
combo_counts = Counter(r["combo"] for r in critical_results)
for combo, count in combo_counts.most_common():
    print(f"  {combo}: governs {count} members")`,
      challenge: 'Add a "crowd impact" load case (sudden surge of 200 people): impact forces of [2, 1, 3, 2, 5, 8, 5, 1, 1, 0] kN. Create a new combination: 1.2D + 0.5L + 1.5*Impact. Does any member fail under this extreme scenario? This represents the worst case: a crowd surge during a wind gust.',
      successHint: 'Load combination analysis is mandatory for every engineered structure worldwide. Building codes in every country define specific combinations. You just performed the same checks that a licensed structural engineer does before signing off on a design.',
    },
    {
      title: 'Optimisation — lightest pandal that passes all checks',
      concept: `The final step in structural design is **optimisation**: finding the lightest (cheapest) structure that satisfies all strength, deflection, and stability requirements. This means adjusting member sizes so that no member is over-designed (wastefully thick) or under-designed (failing).

The objective is: **minimise total weight** subject to constraints: (1) all DCRs < 1.0, (2) all deflections < L/360, (3) all buckling FoS > 3, and (4) all connections adequate.

Optimisation can be done by: **trial and error** (the Kumartuli approach), **gradient descent** (adjust sizes in the direction that reduces weight while maintaining safety), or **genetic algorithms** (evolve populations of designs, keeping the fittest).`,
      analogy: 'Optimisation is like packing a suitcase for a weight limit. You want to bring everything useful (structural capacity) but minimise total weight (material cost). If one item is too heavy (over-designed member), swap it for a lighter alternative. If something is missing (under-designed member), add it even though it increases weight.',
      storyConnection: 'Kumartuli builders optimise intuitively — they use thick bamboo only where needed (columns, main beams) and thin bamboo elsewhere (purlins, bracing). An experienced builder can size every member by eye, arriving at a near-optimal design without calculation. The computational method formalises this intuition and can explore combinations that experience alone might miss.',
      checkQuestion: 'A pandal uses 10 cm bamboo everywhere (total weight: 500 kg). After optimisation, main members are 12 cm and secondary members are 8 cm. New weight: 420 kg. What is the weight savings?',
      checkAnswer: '(500 - 420) / 500 * 100 = 16% savings. This does not sound dramatic, but for large pandals using tonnes of bamboo, a 16% reduction saves significant material cost and construction time. More importantly, the optimised design places strength exactly where it is needed.',
      codeIntro: 'Optimise pandal member sizes to minimise weight while passing all structural checks.',
      code: `import numpy as np

# Structural optimisation of pandal member sizes

class PandalMember:
    def __init__(self, name, mtype, length_m, force_kN, mode):
        self.name = name
        self.mtype = mtype
        self.length = length_m
        self.force = abs(force_kN)
        self.mode = mode  # "tension" or "compression"
        self.diameter = 0.10  # initial guess (m)

    def capacity(self):
        r = self.diameter / 2
        ri = r * 0.8
        A = np.pi * (r**2 - ri**2)
        strength = 150 if self.mode == "tension" else 60  # MPa
        return strength * 1e6 * A / 1000  # kN

    def dcr(self):
        cap = self.capacity()
        return self.force / cap if cap > 0 else 999

    def weight(self):
        r = self.diameter / 2
        ri = r * 0.8
        A = np.pi * (r**2 - ri**2)
        return A * self.length * 750  # kg

    def set_min_diameter(self, fos=3.0):
        """Find minimum diameter for given FoS"""
        strength = 150 if self.mode == "tension" else 60  # MPa
        req_force = self.force * fos * 1000  # N
        req_area = req_force / (strength * 1e6)
        # A = pi * r^2 * 0.36 (hollow)
        r = np.sqrt(req_area / (np.pi * 0.36))
        self.diameter = max(2 * r, 0.04)  # minimum 4 cm

# Define pandal members with forces from analysis
member_data = [
    ("Bot chord 1", "chord", 2.0, 15.0, "tension"),
    ("Bot chord 2", "chord", 2.0, 18.0, "tension"),
    ("Bot chord 3", "chord", 2.0, 18.0, "tension"),
    ("Bot chord 4", "chord", 2.0, 15.0, "tension"),
    ("Top chord 1", "chord", 2.1, 20.0, "compression"),
    ("Top chord 2", "chord", 2.1, 25.0, "compression"),
    ("Top chord 3", "chord", 2.1, 25.0, "compression"),
    ("Top chord 4", "chord", 2.1, 20.0, "compression"),
    ("Column L", "column", 5.0, 18.0, "compression"),
    ("Column C", "column", 5.5, 22.0, "compression"),
    ("Column R", "column", 5.0, 18.0, "compression"),
    ("Diag 1", "diagonal", 3.2, 12.0, "tension"),
    ("Diag 2", "diagonal", 3.2, 8.0, "compression"),
    ("Diag 3", "diagonal", 3.2, 8.0, "compression"),
    ("Diag 4", "diagonal", 3.2, 12.0, "tension"),
    ("Brace 1", "brace", 2.8, 5.0, "tension"),
    ("Brace 2", "brace", 2.8, 3.0, "tension"),
]

members_list = [PandalMember(*d) for d in member_data]

# Initial design: uniform 10 cm
print("=== Initial Design (uniform 10 cm bamboo) ===")
total_weight_init = sum(m.weight() for m in members_list)
max_dcr_init = max(m.dcr() for m in members_list)
print(f"Total weight: {total_weight_init:.1f} kg")
print(f"Max DCR: {max_dcr_init:.3f}")
print()

# Optimise: set each member to minimum size for FoS = 3
for m in members_list:
    m.set_min_diameter(fos=3.0)

# Round up to available bamboo sizes (2 cm increments)
available = [0.04, 0.06, 0.08, 0.10, 0.12, 0.15, 0.18, 0.20]
for m in members_list:
    for d in available:
        if d >= m.diameter:
            m.diameter = d
            break
    else:
        m.diameter = available[-1]

print("=== Optimised Design (minimum size per member) ===")
print(f"{'Member':<16} {'Force':>6} {'Mode':<12} {'Dia (cm)':>8} {'DCR':>6} {'Wt (kg)':>8}")
print("-" * 60)

total_weight_opt = 0
for m in members_list:
    w = m.weight()
    total_weight_opt += w
    print(f"{m.name:<16} {m.force:>5.1f} {m.mode:<12} {m.diameter*100:>6.0f} {m.dcr():>5.2f} {w:>6.1f}")

print()
print(f"Initial weight:   {total_weight_init:.1f} kg")
print(f"Optimised weight: {total_weight_opt:.1f} kg")
print(f"Savings: {(1-total_weight_opt/total_weight_init)*100:.1f}%")

# Cost comparison
bamboo_cost_per_kg = 15  # INR
print()
cost_init = total_weight_init * bamboo_cost_per_kg
cost_opt = total_weight_opt * bamboo_cost_per_kg
print(f"Initial cost:   Rs {cost_init:.0f}")
print(f"Optimised cost: Rs {cost_opt:.0f}")
print(f"Saved: Rs {cost_init - cost_opt:.0f}")

# Size distribution
from collections import Counter
sizes = Counter(m.diameter * 100 for m in members_list)
print()
print("Bamboo size distribution:")
for size, count in sorted(sizes.items()):
    print(f"  {size:.0f} cm: {count} members")`,
      challenge: 'Try FoS values of 2, 3, 4, and 5. Plot total weight vs FoS. At what point does increasing FoS give diminishing returns? This trade-off curve is the fundamental tool for deciding how safe is safe enough.',
      successHint: 'Structural optimisation is a major field in engineering. Modern software can optimise thousands of members simultaneously, producing structures that use minimum material while meeting all safety codes. You just performed the core optimisation loop: size each member to match its demand, round to available sizes, and check all constraints.',
    },
    {
      title: 'Construction sequence — building the pandal step by step',
      concept: `A pandal cannot be built all at once — it must be erected in a specific **sequence**. Each step must be stable on its own before the next step adds more load. The construction sequence determines: which temporary supports (shoring) are needed, when they can be removed, and which step is the most dangerous.

Critical considerations: a partially built structure may have different load paths than the complete structure. Members designed to work in tension in the final structure might be in compression during construction (before all diagonal braces are installed). The construction sequence is often more critical than the final loading condition.

In the code below, you will simulate the construction of a pandal frame step by step, checking stability and member forces at each stage.`,
      analogy: 'Building a pandal is like assembling a card house. Each card placed must be stable before adding the next. Place them in the wrong order and the whole thing collapses. The final card house can support its own weight beautifully, but during construction, it goes through fragile intermediate states.',
      storyConnection: 'Kumartuli builders follow a strict construction sequence refined over generations: (1) erect corner columns with temporary guy ropes, (2) install ground-level beams to brace columns, (3) add diagonal braces bay by bay, (4) install roof beams and purlins, (5) add fabric covering, (6) remove temporary guy ropes. Skipping or reordering any step risks collapse.',
      checkQuestion: 'A pandal column is 5 m tall and freestanding (no beams yet). What prevents it from falling over? What minimum guy rope tension is needed if the column weighs 50 kg and wind pushes with 200 N at the top?',
      checkAnswer: 'Nothing prevents it falling without guy ropes — a freestanding column is inherently unstable. The guy rope must resist the overturning moment: 200 N * 5 m = 1000 N*m. If the rope attaches at 4 m height and anchors 3 m away, angle = atan(4/3), and the horizontal component must be 200 N. Rope tension = 200/cos(53) = 333 N.',
      codeIntro: 'Simulate the step-by-step construction of a pandal, checking stability at each stage.',
      code: `import numpy as np

# Construction sequence simulation

class ConstructionStage:
    def __init__(self, name, members_added, temp_supports=None):
        self.name = name
        self.members_added = members_added  # list of member indices
        self.temp_supports = temp_supports or []
        self.active_members = []
        self.is_stable = False
        self.max_force = 0
        self.critical_member = ""

def check_stage_stability(all_members, active_indices, temp_supports):
    """Check if the current construction stage is stable"""
    n_members = len(active_indices)
    n_joints = len(set(n for idx in active_indices
                       for n in [all_members[idx][0], all_members[idx][1]]))
    n_supports = 3 + len(temp_supports) * 2  # base + temp
    dof = 2 * n_joints
    constraints = n_members + n_supports

    is_stable = constraints >= dof
    is_determinate = constraints == dof
    return is_stable, is_determinate, n_joints, n_members

# Pandal member definitions: (node_i, node_j, name, type)
all_members = [
    (0, 1, "Col A", "column"),
    (2, 3, "Col B", "column"),
    (4, 5, "Col C", "column"),
    (6, 7, "Col D", "column"),
    (0, 2, "Beam AB ground", "beam"),
    (2, 4, "Beam BC ground", "beam"),
    (4, 6, "Beam CD ground", "beam"),
    (0, 3, "Diag A-B", "diagonal"),
    (2, 5, "Diag B-C", "diagonal"),
    (4, 7, "Diag C-D", "diagonal"),
    (1, 3, "Top beam AB", "beam"),
    (3, 5, "Top beam BC", "beam"),
    (5, 7, "Top beam CD", "beam"),
    (1, 4, "Cross brace 1", "brace"),
    (3, 6, "Cross brace 2", "brace"),
]

# Construction sequence
stages = [
    ConstructionStage(
        "1. Erect corner columns (with guy ropes)",
        [0, 3],  # Col A and Col D only
        temp_supports=["Guy rope A", "Guy rope D"]
    ),
    ConstructionStage(
        "2. Erect middle columns",
        [0, 1, 2, 3],  # All columns
        temp_supports=["Guy rope A", "Guy rope B", "Guy rope C", "Guy rope D"]
    ),
    ConstructionStage(
        "3. Install ground beams (columns now braced)",
        [0, 1, 2, 3, 4, 5, 6],  # Columns + ground beams
        temp_supports=["Guy rope A", "Guy rope D"]  # fewer guy ropes needed
    ),
    ConstructionStage(
        "4. Add diagonal bracing",
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],  # + diagonals
        temp_supports=[]  # self-stable now
    ),
    ConstructionStage(
        "5. Install top beams",
        list(range(13)),  # + top beams
        temp_supports=[]
    ),
    ConstructionStage(
        "6. Add cross bracing (complete)",
        list(range(15)),  # all members
        temp_supports=[]
    ),
]

print("=== Pandal Construction Sequence Analysis ===")
print()

for stage in stages:
    stable, det, nj, nm = check_stage_stability(
        all_members, stage.members_added, stage.temp_supports)

    stage.is_stable = stable
    members_in_stage = [all_members[i][2] for i in stage.members_added]

    print(f"{stage.name}")
    print(f"  Active members: {nm} | Joints: {nj}")
    print(f"  Temp supports: {', '.join(stage.temp_supports) if stage.temp_supports else 'None'}")
    print(f"  Stability: {'STABLE' if stable else 'UNSTABLE'} "
          f"({'determinate' if det else 'indeterminate' if stable else 'mechanism'})")

    # Risk assessment
    if not stable:
        print(f"  WARNING: Stage is unstable — add temporary bracing!")
    elif len(stage.temp_supports) > 0:
        print(f"  NOTE: Depends on {len(stage.temp_supports)} temporary supports")
    else:
        print(f"  Self-stable — temporary supports can be removed")
    print()

# Timeline and resource planning
print("=== Construction Timeline ===")
crew_size = 12
hours_per_stage = [3, 2, 4, 3, 4, 2]

total_hours = 0
for stage, hours in zip(stages, hours_per_stage):
    total_hours += hours
    print(f"  {stage.name.split('.')[0]}. [{hours} hours] "
          f"Cumulative: {total_hours} hours")

days = np.ceil(total_hours / 8)
print(f"\nTotal: {total_hours} hours ({days:.0f} working days)")
print(f"Crew: {crew_size} workers")
print(f"Person-hours: {total_hours * crew_size}")

# Critical path
print()
print("=== Critical Safety Points ===")
print("1. Stage 1-2: Columns freestanding — HIGHEST RISK")
print("   Wind gust can topple unbraced columns")
print("   Guy ropes must be tensioned before releasing crane")
print("2. Stage 3: Ground beams provide lateral stability")
print("   Guy ropes on middle columns can be removed")
print("3. Stage 4: Diagonal bracing makes structure self-stable")
print("   ALL temporary supports can be safely removed")
print("4. Stage 5-6: Adding load to a stable structure")
print("   Monitor deflections as beams are loaded")`,
      challenge: 'Reverse the construction sequence: try installing top beams before diagonal bracing. Check stability at each stage. Does the revised sequence work? What extra temporary supports would be needed? This demonstrates why construction sequence matters as much as final design.',
      successHint: 'Construction sequence planning prevents more collapses than structural analysis. The Hartford Civic Center roof collapsed in 1978 not because of a design flaw in the final structure, but because of a construction sequence error — loads were applied before bracing was complete. You just learned to think about structures as processes, not just finished objects.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Design and analyse a complete pandal structure</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises build a complete pandal design system — from parametric geometry to structural optimisation to construction planning.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
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
