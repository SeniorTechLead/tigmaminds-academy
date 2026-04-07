import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function KumartuliLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Truss analysis — the method of joints',
      concept: `A **truss** is a structure made of triangular units connected at **pin joints**. Because triangles are inherently rigid (unlike rectangles, which can collapse into parallelograms), trusses are extremely efficient at spanning large distances with minimal material.

In a truss, every member carries only **axial force** — either tension or compression. There is no bending. This is the method of joints: at each joint, the sum of all forces must equal zero (equilibrium). If there are two unknowns at a joint, two equilibrium equations (sum of horizontal forces = 0, sum of vertical forces = 0) can solve for both.

Pandal builders create triangulated frames instinctively — diagonal bracing turns a wobbly rectangle into a rigid triangle. In the code below, you will solve for member forces in a simple truss using the method of joints.`,
      analogy: 'A triangle made of stiff sticks cannot change shape — push on any corner and the whole triangle resists. A rectangle of the same sticks can be pushed into a parallelogram with almost no force. Adding one diagonal brace across the rectangle creates two triangles and makes it rigid. This is why roof trusses are triangulated.',
      storyConnection: 'The largest Kumartuli pandals — some over 25 metres tall — use elaborate truss systems. The master builder Rathin Chakraborty is known for creating curved roof trusses from bamboo that span 15 metres without intermediate supports. The triangulated structure allows these remarkable spans with members no thicker than a human arm.',
      checkQuestion: 'A simple truss has 3 members and 3 joints (a triangle). If you add 2 more members and 1 joint (extending to 5 members, 4 joints), how many unknowns and equations do you have?',
      checkAnswer: '5 member forces + 3 support reactions = 8 unknowns. 4 joints * 2 equations each = 8 equations. The system is solvable! For a stable truss: m = 2j - 3 (members = 2*joints - 3). Check: 5 = 2*4 - 3. Correct.',
      codeIntro: 'Solve member forces in a pandal roof truss using the method of joints.',
      code: `import numpy as np

# Truss analysis using method of joints
# Simple Warren truss (triangulated beam)

def solve_truss(nodes, members, supports, loads):
    """
    Solve a 2D truss by assembling equilibrium equations.
    nodes: dict of node_id -> (x, y)
    members: list of (node_i, node_j)
    supports: dict of node_id -> ('pin' or 'roller')
    loads: dict of node_id -> (Fx, Fy)
    """
    n_nodes = len(nodes)
    n_members = len(members)

    # Count unknowns: member forces + support reactions
    n_reactions = sum(2 if s == 'pin' else 1 for s in supports.values())
    n_unknowns = n_members + n_reactions
    n_equations = 2 * n_nodes

    # Build coefficient matrix
    A = np.zeros((n_equations, n_unknowns))
    b = np.zeros(n_equations)

    node_ids = sorted(nodes.keys())
    node_idx = {nid: i for i, nid in enumerate(node_ids)}

    # Member force contributions
    for m_idx, (ni, nj) in enumerate(members):
        xi, yi = nodes[ni]
        xj, yj = nodes[nj]
        length = np.sqrt((xj-xi)**2 + (yj-yi)**2)
        cos_a = (xj - xi) / length
        sin_a = (yj - yi) / length

        # Force on node i (if member in tension, pulls toward j)
        row_ix = 2 * node_idx[ni]
        row_iy = 2 * node_idx[ni] + 1
        A[row_ix, m_idx] = cos_a
        A[row_iy, m_idx] = sin_a

        # Force on node j (opposite direction)
        row_jx = 2 * node_idx[nj]
        row_jy = 2 * node_idx[nj] + 1
        A[row_jx, m_idx] = -cos_a
        A[row_jy, m_idx] = -sin_a

    # Support reactions
    react_col = n_members
    for nid, stype in supports.items():
        ridx = node_idx[nid]
        if stype == 'pin':
            A[2*ridx, react_col] = 1      # Rx
            A[2*ridx+1, react_col+1] = 1  # Ry
            react_col += 2
        else:  # roller (vertical reaction only)
            A[2*ridx+1, react_col] = 1     # Ry
            react_col += 1

    # External loads
    for nid, (fx, fy) in loads.items():
        ridx = node_idx[nid]
        b[2*ridx] = -fx
        b[2*ridx+1] = -fy

    # Solve
    try:
        forces = np.linalg.solve(A, b)
    except np.linalg.LinAlgError:
        forces = np.linalg.lstsq(A, b, rcond=None)[0]

    return forces[:n_members], forces[n_members:]

# Define a simple Warren truss (pandal roof)
# 4 top nodes, 3 bottom nodes
span = 8  # metres
height = 2  # metres

nodes = {
    0: (0, 0),          # bottom left (support)
    1: (span/3, height),  # top
    2: (span/3, 0),     # bottom
    3: (2*span/3, height), # top
    4: (2*span/3, 0),   # bottom
    5: (span, 0),       # bottom right (support)
}

members = [
    (0, 1), (0, 2), (1, 2), (1, 3), (2, 3),
    (2, 4), (3, 4), (3, 5), (4, 5),
]

supports = {0: 'pin', 5: 'roller'}

# Loads: 5 kN at each top node (roof + live load)
loads = {1: (0, -5000), 3: (0, -5000)}

member_forces, reactions = solve_truss(nodes, members, supports, loads)

print("=== Pandal Roof Truss Analysis ===")
print(f"Span: {span} m | Height: {height} m")
print(f"Loads: 5 kN at each top node")
print()
print(f"{'Member':>8} {'Nodes':>10} {'Force (kN)':>12} {'Type':<12}")
print("-" * 44)

for i, (ni, nj) in enumerate(members):
    force_kN = member_forces[i] / 1000
    mtype = "Tension" if force_kN > 0.01 else "Compression" if force_kN < -0.01 else "Zero"
    print(f"{i:>8} {str(ni)+'-'+str(nj):>10} {force_kN:>10.2f} {mtype:<12}")

print()
print("Support reactions:")
print(f"  Left pin:  Rx = {reactions[0]/1000:.2f} kN, Ry = {reactions[1]/1000:.2f} kN")
print(f"  Right roller: Ry = {reactions[2]/1000:.2f} kN")

# Verify equilibrium
total_ext_y = sum(fy for _, (fx, fy) in loads.items())
total_react_y = reactions[1] + reactions[2]
print(f"\\nEquilibrium check: loads = {total_ext_y/1000:.1f} kN, "
      f"reactions = {total_react_y/1000:.1f} kN")`,
      challenge: 'Add a third load of 8 kN at the midspan bottom node (heavy idol). Which members see the largest force increase? Does any member switch from tension to compression? This analysis guides builders on where to add reinforcement.',
      successHint: 'The method of joints is one of the oldest and most elegant methods in structural analysis. Every bridge truss, roof truss, and tower crane has been designed using this exact approach. You just solved a real engineering problem from first principles.',
    },
    {
      title: 'Structural redundancy — what happens when a member fails',
      concept: `A **statically determinate** truss has exactly enough members to be stable (m = 2j - 3). Remove one member and it collapses. A **redundant** truss has extra members beyond the minimum — if one fails, the remaining members can redistribute the load.

**Redundancy** is critical for structures that must survive damage — wind tears off a brace, a bamboo splits, or a rope snaps. The **degree of redundancy** = actual members - minimum required members.

In the code below, you will simulate member failure in a pandal truss and calculate how forces redistribute. A redundant truss survives single-member failure; a determinate truss does not.`,
      analogy: 'A three-legged stool falls if you remove one leg. A four-legged table wobbles but stays up if you remove one leg — it has one degree of redundancy. A structure with redundancy can lose a member and keep standing, giving occupants time to evacuate safely.',
      storyConnection: 'Kumartuli builders add "extra" diagonal braces that seem unnecessary by simple analysis. These provide redundancy — if one brace fails (bamboo splits in the wind, a rope loosens), the adjacent braces pick up the load. During the 2019 cyclone Bulbul, several pandals lost individual members but did not collapse because of this built-in redundancy.',
      checkQuestion: 'A truss has 8 joints and 15 members. The minimum for stability is 2*8 - 3 = 13 members. What is the degree of redundancy?',
      checkAnswer: 'Redundancy = 15 - 13 = 2. The truss can lose up to 2 members before it becomes unstable. However, which 2 members it can lose depends on their positions — losing 2 adjacent critical members might still cause collapse.',
      codeIntro: 'Simulate member failure in a truss and observe force redistribution.',
      code: `import numpy as np

# Structural redundancy analysis
# Compare determinate vs redundant truss under member failure

def truss_member_forces(n_bays, height, span, loads_at_top, extra_diagonals=False):
    """Build and solve a Pratt truss with optional redundant diagonals"""
    bay_width = span / n_bays
    nodes = {}
    members = []

    # Create nodes
    nid = 0
    bottom_nodes = []
    top_nodes = []

    for i in range(n_bays + 1):
        nodes[nid] = (i * bay_width, 0)
        bottom_nodes.append(nid)
        nid += 1
        nodes[nid] = (i * bay_width, height)
        top_nodes.append(nid)
        nid += 1

    # Bottom chord
    for i in range(n_bays):
        members.append((bottom_nodes[i], bottom_nodes[i+1]))

    # Top chord
    for i in range(n_bays):
        members.append((top_nodes[i], top_nodes[i+1]))

    # Verticals
    for i in range(n_bays + 1):
        members.append((bottom_nodes[i], top_nodes[i]))

    # Diagonals (one per bay)
    for i in range(n_bays):
        members.append((bottom_nodes[i], top_nodes[i+1]))

    # Extra diagonals (redundant cross-bracing)
    if extra_diagonals:
        for i in range(n_bays):
            members.append((bottom_nodes[i+1], top_nodes[i]))

    return nodes, members, bottom_nodes, top_nodes

# Parameters
n_bays = 4
height = 2.0
span = 8.0

print("=== Determinate Truss (no extra diagonals) ===")
nodes, members, bn, tn = truss_member_forces(n_bays, height, span, True, False)
n_joints = len(nodes)
n_members = len(members)
min_members = 2 * n_joints - 3
redundancy = n_members - min_members

print(f"Joints: {n_joints} | Members: {n_members} | Min required: {min_members}")
print(f"Redundancy: {redundancy}")
print()

print("=== Redundant Truss (cross-braced) ===")
nodes_r, members_r, bn_r, tn_r = truss_member_forces(n_bays, height, span, True, True)
n_joints_r = len(nodes_r)
n_members_r = len(members_r)
min_members_r = 2 * n_joints_r - 3
redundancy_r = n_members_r - min_members_r

print(f"Joints: {n_joints_r} | Members: {n_members_r} | Min required: {min_members_r}")
print(f"Redundancy: {redundancy_r}")
print()

# Simulate member failure scenarios
print("=== Member Failure Simulation ===")
print("Removing one member at a time and checking stability...")
print()

def check_stability(nodes, members, supports_nodes):
    """Check if truss is stable using rank of stiffness matrix"""
    n = len(nodes)
    n_eq = 2 * n
    n_m = len(members)
    n_react = len(supports_nodes) * 2  # simplified
    node_list = sorted(nodes.keys())
    nidx = {nid: i for i, nid in enumerate(node_list)}

    A = np.zeros((n_eq, n_m + n_react))
    for mi, (ni, nj) in enumerate(members):
        xi, yi = nodes[ni]
        xj, yj = nodes[nj]
        L = np.sqrt((xj-xi)**2 + (yj-yi)**2)
        if L < 1e-10:
            continue
        cx, cy = (xj-xi)/L, (yj-yi)/L
        A[2*nidx[ni], mi] = cx
        A[2*nidx[ni]+1, mi] = cy
        A[2*nidx[nj], mi] = -cx
        A[2*nidx[nj]+1, mi] = -cy

    col = n_m
    for sid in supports_nodes:
        A[2*nidx[sid], col] = 1
        A[2*nidx[sid]+1, col+1] = 1
        col += 2

    rank = np.linalg.matrix_rank(A)
    return rank >= n_eq

supports = [bn[0], bn[-1]]

# Test determinate truss
det_survive = 0
det_fail = 0
for i in range(len(members)):
    reduced = members[:i] + members[i+1:]
    stable = check_stability(nodes, reduced, supports)
    if stable:
        det_survive += 1
    else:
        det_fail += 1

print(f"Determinate truss ({n_members} members):")
print(f"  Survives single failure: {det_survive}/{n_members} cases")
print(f"  Collapses on failure:    {det_fail}/{n_members} cases")

# Test redundant truss
red_survive = 0
red_fail = 0
for i in range(len(members_r)):
    reduced = members_r[:i] + members_r[i+1:]
    stable = check_stability(nodes_r, reduced, supports)
    if stable:
        red_survive += 1
    else:
        red_fail += 1

print(f"\\nRedundant truss ({n_members_r} members):")
print(f"  Survives single failure: {red_survive}/{n_members_r} cases")
print(f"  Collapses on failure:    {red_fail}/{n_members_r} cases")

print(f"\\nExtra members added: {n_members_r - n_members}")
print(f"Reliability improvement: {red_survive/n_members_r*100:.0f}% vs "
      f"{det_survive/n_members*100:.0f}% survival rate")`,
      challenge: 'Test double-member failure: remove 2 members at a time from the redundant truss. What fraction of 2-member combinations cause collapse? How many extra diagonals would you need for full double-failure survival?',
      successHint: 'Redundancy analysis is how engineers design structures to survive damage — from earthquake-resistant buildings to aircraft that can fly with one engine failed. The trade-off between material cost (more members) and safety (higher redundancy) is a core engineering judgment.',
    },
    {
      title: 'Wind load on temporary structures — when the monsoon hits',
      concept: `Wind exerts **dynamic pressure** on structures: **q = 0.5 * rho * v^2**, where rho is air density (1.225 kg/m3) and v is wind speed. For a 100 km/h wind (monsoon gust), q = 0.5 * 1.225 * 27.8^2 = **473 Pa** (about 48 kg per m2 of surface).

The actual force on a structure depends on the **drag coefficient** (Cd) and the exposed area: **F = Cd * q * A**. A flat wall has Cd = 1.2-2.0. A rounded surface has Cd = 0.5-1.0. A pandal with an open front has lower Cd than one with solid walls.

Wind loads are the primary cause of pandal failures during Durga Puja — the festival coincides with the tail end of the monsoon, when cyclonic storms are common.`,
      analogy: 'Hold a sheet of paper flat against the wind — it catches the full force (high Cd). Turn it edge-on — almost no force (low Cd). Curve it into a dome — moderate force but distributed smoothly. The shape of a structure dramatically affects how much wind force it must resist.',
      storyConnection: 'In 2020, Cyclone Amphan struck Kolkata during pandal construction season with winds exceeding 150 km/h. Pandals with solid fabric walls were destroyed; those with open sides and aerodynamic curves survived. Since then, builders have adopted curved profiles and ventilation openings that reduce wind load by 40-60%.',
      checkQuestion: 'A pandal wall is 10 m wide and 5 m tall (50 m2). Wind speed is 80 km/h (22.2 m/s). With Cd = 1.5, what is the total wind force?',
      checkAnswer: 'q = 0.5 * 1.225 * 22.2^2 = 302 Pa. F = 1.5 * 302 * 50 = 22,650 N = 22.65 kN. That is the weight of about 2,300 kg pushing sideways on the wall — enough to topple an unbraced structure.',
      codeIntro: 'Calculate wind loads on different pandal configurations and design bracing to resist them.',
      code: `import numpy as np

# Wind load analysis for pandal structures

rho = 1.225  # air density (kg/m3)

def wind_pressure(speed_kmh):
    """Dynamic wind pressure in Pa"""
    v = speed_kmh / 3.6  # convert to m/s
    return 0.5 * rho * v**2

def wind_force(speed_kmh, area_m2, Cd):
    """Total wind force in N"""
    q = wind_pressure(speed_kmh)
    return Cd * q * area_m2

# Wind conditions during Durga Puja season
conditions = [
    ("Calm", 10),
    ("Light breeze", 25),
    ("Moderate wind", 45),
    ("Strong wind", 65),
    ("Monsoon gust", 90),
    ("Cyclone warning", 120),
    ("Severe cyclone", 160),
]

print("=== Wind Pressure vs Speed ===")
print(f"{'Condition':<20} {'Speed (km/h)':>12} {'Pressure (Pa)':>14} {'kg/m2':>8}")
print("-" * 56)

for name, speed in conditions:
    q = wind_pressure(speed)
    print(f"{name:<20} {speed:>12} {q:>12.1f} {q/9.81:>6.1f}")

# Pandal configurations
print()
print("=== Wind Force on Different Pandal Designs ===")
print(f"Wall area: 10 m x 5 m = 50 m2 | Wind: 90 km/h (monsoon gust)")

designs = [
    ("Solid flat wall", 50, 1.8),
    ("Solid curved wall", 50, 1.0),
    ("Wall with 30% openings", 35, 1.5),
    ("Open sides (roof only)", 15, 0.8),
    ("Dome shape", 40, 0.5),
    ("Streamlined/tapered", 30, 0.6),
]

speed = 90  # km/h

print()
print(f"{'Design':<26} {'Eff Area':>9} {'Cd':>5} {'Force (kN)':>12} {'Reduction':>10}")
print("-" * 64)

base_force = wind_force(speed, 50, 1.8) / 1000

for name, area, cd in designs:
    F = wind_force(speed, area, cd) / 1000
    reduction = (1 - F/base_force) * 100
    print(f"{name:<26} {area:>7} m2 {cd:>5.1f} {F:>10.1f} {reduction:>8.0f}%")

# Bracing design to resist wind
print()
print("=== Diagonal Bracing Design ===")
wind_F = wind_force(90, 50, 1.2) / 1000  # kN, moderate design
print(f"Design wind force: {wind_F:.1f} kN")

height = 5  # m
num_brace_sets = [1, 2, 3, 4]

print()
print(f"{'Brace sets':>10} {'Force/brace (kN)':>16} {'Bamboo dia (cm)':>16}")
print("-" * 44)

for n in num_brace_sets:
    force_per = wind_F / n
    # Brace at 45 degrees: axial = force/cos(45) = force * sqrt(2)
    axial = force_per * np.sqrt(2)
    # Required bamboo diameter (hollow, tension)
    bamboo_tension = 150  # MPa
    req_area = axial * 1000 / (bamboo_tension * 1e6)  # m2
    # A = pi * r^2 * 0.36 (hollow)
    r = np.sqrt(req_area / (np.pi * 0.36))
    dia_cm = 2 * r * 100
    print(f"{n:>10} {force_per:>14.1f} {dia_cm:>14.1f}")

# Overturning check
print()
print("=== Overturning Stability Check ===")
F_wind = wind_force(90, 50, 1.2)
h_wind = 2.5  # centre of pressure height
M_overturn = F_wind * h_wind  # N*m

# Restoring moment from self-weight
pandal_weight = 3000 * 9.81  # N
base_width = 8  # m
M_restore = pandal_weight * base_width / 2

fos_overturn = M_restore / M_overturn
print(f"Wind overturning moment: {M_overturn/1000:.1f} kN*m")
print(f"Self-weight restoring:   {M_restore/1000:.1f} kN*m")
print(f"Overturning FoS: {fos_overturn:.2f}")
print(f"Status: {'STABLE' if fos_overturn > 1.5 else 'NEEDS ANCHORING'}")`,
      challenge: 'Calculate the anchor force needed if the overturning FoS is below 1.5. If ground anchors (bamboo stakes driven 1 m into soil) can each resist 2 kN of uplift, how many anchors are needed? Where should they be placed for maximum effectiveness?',
      successHint: 'Wind engineering is one of the most important specialities in structural engineering. Every tall building, bridge, and temporary structure must be designed for wind. The drag coefficient and exposed area are the two levers designers use to reduce wind force — shaping structures to "slip through" the wind.',
    },
    {
      title: 'Progressive collapse — the domino effect in structures',
      concept: `**Progressive collapse** occurs when the failure of one element triggers a chain reaction of failures throughout the structure — like dominoes. The classic example is the Ronan Point apartment collapse (1968), where a gas explosion on the 18th floor caused the entire corner of the building to peel away floor by floor.

The mechanism is **load redistribution**: when a member fails, its load transfers to neighbours. If the neighbours are already near their capacity, they fail too, transferring even more load to the next set of neighbours. The collapse propagates until either the load finds a path to the ground or the entire structure falls.

Preventing progressive collapse requires **alternate load paths** — multiple routes for force to reach the ground, so that if one path is lost, others can carry the redistributed load.`,
      analogy: 'Imagine a crowd standing on a frozen lake. If one patch of ice cracks and someone falls through, the people nearby step back — concentrating their weight on a smaller area of ice. This can crack the ice further, and more people fall through. Each failure makes the next more likely. That is progressive collapse.',
      storyConnection: 'In 2017, a large Kolkata pandal partially collapsed when a single diagonal brace snapped in a wind gust. The brace had been carrying load from the curved roof. When it failed, the adjacent braces received 40% more load — one of them buckled, transferring even more load to the next. Three braces failed in sequence before the collapse stopped at a node with extra reinforcement. Seven members failed, but the pandal did not completely collapse.',
      checkQuestion: 'A pandal has 6 columns each carrying 10 kN. One column is removed. If the load redistributes equally to the remaining 5, what is the new load per column? What FoS do they need to survive?',
      checkAnswer: 'New load = 60 / 5 = 12 kN per column (20% increase). If they were designed with FoS = 3 (capacity 30 kN), they easily survive at 12 kN (new FoS = 2.5). If they were designed with FoS = 1.5 (capacity 15 kN), they survive but barely (new FoS = 1.25). If FoS = 1.2 (capacity 12 kN), the next column fails and the cascade begins.',
      codeIntro: 'Simulate progressive collapse in a pandal frame after a member failure.',
      code: `import numpy as np

# Progressive collapse simulation

class Member:
    def __init__(self, name, capacity_kN, current_load_kN):
        self.name = name
        self.capacity = capacity_kN
        self.load = current_load_kN
        self.failed = False
        self.utilization = current_load_kN / capacity_kN

    def apply_extra(self, extra_kN):
        self.load += extra_kN
        self.utilization = self.load / self.capacity
        if self.utilization >= 1.0:
            self.failed = True

def simulate_collapse(members, initial_failure_idx, redistribution_map):
    """
    Simulate progressive collapse.
    redistribution_map: {member_idx: [(neighbour_idx, fraction), ...]}
    """
    steps = []
    active = [m for m in members]
    active[initial_failure_idx].failed = True
    failed_load = active[initial_failure_idx].load

    steps.append({
        "trigger": active[initial_failure_idx].name,
        "released_load": failed_load,
        "total_failed": 1,
    })

    cascade = True
    while cascade:
        cascade = False
        new_failures = []

        for failed_idx, m in enumerate(active):
            if not m.failed:
                continue
            if failed_idx not in redistribution_map:
                continue

            # Redistribute this member's load to neighbours
            neighbours = redistribution_map[failed_idx]
            for neigh_idx, fraction in neighbours:
                if not active[neigh_idx].failed:
                    extra = failed_load * fraction
                    active[neigh_idx].apply_extra(extra)
                    if active[neigh_idx].failed:
                        new_failures.append(neigh_idx)
                        cascade = True

            # Remove from redistribution after processing
            del redistribution_map[failed_idx]

        for idx in new_failures:
            failed_load = active[idx].load
            steps.append({
                "trigger": active[idx].name,
                "released_load": failed_load,
                "total_failed": sum(1 for m in active if m.failed),
            })

    return steps, active

# Pandal with 8 main structural members
np.random.seed(42)
member_names = [
    "Left column", "Left diagonal", "Left beam",
    "Centre column", "Centre beam",
    "Right beam", "Right diagonal", "Right column"
]

# Different design scenarios
for fos_design in [1.5, 2.0, 3.0, 4.0]:
    print(f"=== Design FoS: {fos_design} ===")

    base_load = 10.0  # kN per member
    members = [Member(name, base_load * fos_design, base_load)
               for name in member_names]

    # Redistribution: each member sends load to 2 nearest neighbours
    redist = {
        0: [(1, 0.6), (3, 0.4)],
        1: [(0, 0.3), (2, 0.4), (3, 0.3)],
        2: [(1, 0.4), (4, 0.6)],
        3: [(2, 0.3), (4, 0.4), (5, 0.3)],
        4: [(3, 0.4), (5, 0.6)],
        5: [(4, 0.4), (6, 0.4), (7, 0.2)],
        6: [(5, 0.4), (7, 0.6)],
        7: [(6, 0.6), (5, 0.4)],
    }

    # Trigger failure of centre column (critical member)
    steps, final = simulate_collapse(members, 3, dict(redist))

    total_failed = sum(1 for m in final if m.failed)
    print(f"Initial failure: {member_names[3]}")
    print(f"Collapse steps: {len(steps)}")
    print(f"Total members failed: {total_failed} / {len(members)}")

    for s in steps:
        print(f"  -> {s['trigger']} failed (released {s['released_load']:.1f} kN, "
              f"total failed: {s['total_failed']})")

    surviving = [m for m in final if not m.failed]
    print(f"Surviving members: {len(surviving)}")
    for m in surviving:
        print(f"  {m.name}: {m.utilization*100:.0f}% utilized")
    print()

print("Higher FoS = more capacity to absorb redistributed load")
print("= fewer cascading failures = structure survives!")`,
      challenge: 'Modify the simulation so that only the centre column has reduced FoS (simulating a defective member). At what FoS ratio (defective/normal) does progressive collapse begin? This identifies the minimum quality for any single member.',
      successHint: 'Progressive collapse analysis changed building codes worldwide after major failures. Modern buildings must demonstrate that they can survive the loss of any single column without progressive collapse. The Kumartuli approach of redundant bracing naturally provides this resilience.',
    },
    {
      title: 'Dynamic response — vibration from crowds and wind gusts',
      concept: `Structures are not static — they vibrate when subjected to time-varying loads like wind gusts, walking crowds, or music from loudspeakers. Every structure has a **natural frequency** (f_n) determined by its stiffness and mass: **f_n = (1/2pi) * sqrt(k/m)**.

If the loading frequency matches the natural frequency, **resonance** occurs — vibrations amplify dramatically. This is why soldiers break step when crossing bridges, and why wind can destroy structures (Tacoma Narrows Bridge, 1940).

For a pandal, dangerous frequencies are: **1-3 Hz** (walking/dancing crowd), **0.5-2 Hz** (wind gusts), and **20-80 Hz** (loudspeaker bass). If the pandal's natural frequency falls in these ranges, vibration problems are likely.`,
      analogy: 'Push a child on a swing at the right rhythm (natural frequency) and they go higher with each push. Push at the wrong rhythm and the swing barely moves. Resonance is when external forces push at exactly the frequency the structure "wants" to vibrate — each push amplifies the previous one.',
      storyConnection: 'During Durga Puja, thousands of visitors walk through pandals simultaneously. Their footsteps create a rhythmic force at about 2 Hz (2 steps per second). If the pandal floor has a natural frequency near 2 Hz, visitors feel the floor bouncing under their feet — alarming but usually not dangerous. However, if the crowd starts dancing (common near loudspeakers), the amplified vibration can damage connections and trigger panic.',
      checkQuestion: 'A pandal platform weighs 2000 kg and the bamboo supports have combined stiffness of 500,000 N/m. What is its natural frequency?',
      checkAnswer: 'f_n = (1/2pi) * sqrt(k/m) = (1/6.283) * sqrt(500000/2000) = (1/6.283) * sqrt(250) = (1/6.283) * 15.81 = 2.52 Hz. This is right in the danger zone for crowd-induced vibration (2-3 Hz). The platform needs stiffening or damping.',
      codeIntro: 'Calculate natural frequencies and simulate dynamic response of pandal structures to crowd and wind excitation.',
      code: `import numpy as np

# Dynamic response analysis

def natural_frequency(stiffness_N_m, mass_kg):
    """Natural frequency in Hz"""
    return 1 / (2 * np.pi) * np.sqrt(stiffness_N_m / mass_kg)

def dynamic_response(f_natural, f_excite, damping_ratio, static_defl_mm, n_cycles=50):
    """
    Simulate forced vibration response.
    Returns peak dynamic deflection.
    """
    # Dynamic amplification factor (DAF)
    r = f_excite / f_natural  # frequency ratio
    DAF = 1 / np.sqrt((1 - r**2)**2 + (2 * damping_ratio * r)**2)
    peak_defl = static_defl_mm * DAF
    return DAF, peak_defl

# Pandal platform analysis
mass = 2000     # kg (platform + idol)
stiffness = 500000  # N/m (bamboo column stiffness)
static_defl = mass * 9.81 / stiffness * 1000  # mm

f_n = natural_frequency(stiffness, mass)

print("=== Pandal Platform Dynamic Analysis ===")
print(f"Mass: {mass} kg | Stiffness: {stiffness/1000:.0f} kN/m")
print(f"Static deflection: {static_defl:.1f} mm")
print(f"Natural frequency: {f_n:.2f} Hz")
print()

# Excitation sources
sources = [
    ("Slow walking (1.5 Hz)", 1.5, 200),
    ("Normal walking (2.0 Hz)", 2.0, 300),
    ("Fast walking (2.5 Hz)", 2.5, 300),
    ("Dancing (2.8 Hz)", 2.8, 500),
    ("Jumping (3.5 Hz)", 3.5, 800),
    ("Wind gusts (0.5 Hz)", 0.5, 150),
    ("Bass speaker (30 Hz)", 30, 50),
]

damping = 0.05  # 5% damping (typical bamboo)

print(f"{'Source':<28} {'f_exc (Hz)':>10} {'DAF':>6} {'Peak (mm)':>10} {'Risk':<10}")
print("-" * 66)

for name, f_exc, force_N in sources:
    DAF, peak = dynamic_response(f_n, f_exc, damping, static_defl)
    risk = "HIGH" if DAF > 3 else "MODERATE" if DAF > 1.5 else "LOW"
    print(f"{name:<28} {f_exc:>8.1f} {DAF:>5.1f} {peak:>8.1f} {risk:<10}")

# Effect of damping
print()
print("=== Effect of Damping (at resonance, f_exc = f_n) ===")
print(f"{'Damping %':>10} {'DAF':>6} {'Peak (mm)':>10} {'Description':<24}")
print("-" * 52)

descriptions = {
    0.01: "Bare bamboo",
    0.02: "Rope lashings",
    0.05: "Fabric panels",
    0.10: "Sand-filled bamboo",
    0.15: "Rubber dampers",
    0.25: "Heavy damping system",
}

for damp in [0.01, 0.02, 0.05, 0.10, 0.15, 0.25]:
    DAF, peak = dynamic_response(f_n, f_n, damp, static_defl)
    desc = descriptions.get(damp, "")
    print(f"{damp*100:>8.0f}% {DAF:>5.1f} {peak:>8.1f} {desc:<24}")

# Stiffening solution
print()
print("=== Stiffening to Avoid Resonance ===")
target_fn = 5.0  # Hz (above crowd frequency range)
required_k = (2 * np.pi * target_fn)**2 * mass
print(f"Target natural frequency: {target_fn} Hz")
print(f"Required stiffness: {required_k/1000:.0f} kN/m")
print(f"Current stiffness:  {stiffness/1000:.0f} kN/m")
print(f"Need to increase by: {required_k/stiffness:.1f}x")
print("Add diagonal bracing to increase stiffness!")`,
      challenge: 'If 200 people (average 70 kg each) stand on the platform, the total mass becomes 2000 + 14000 = 16000 kg. Recalculate the natural frequency. Does the extra mass move it into or out of the danger zone? This is the paradox: a crowded platform is heavier (lower frequency) but also experiences the most excitation.',
      successHint: 'Dynamic analysis is essential for any structure that people use. Concert stages, sports stadiums, dance floors, and pedestrian bridges all require vibration analysis. The Millennium Bridge in London famously wobbled on opening day because designers underestimated the synchronisation of walking pedestrians — a resonance effect.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Truss analysis, wind loads, and structural dynamics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to solve truss forces, simulate collapse scenarios, and analyse dynamic vibration response.
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
            id={`L3-${i + 1}`}
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
