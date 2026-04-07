import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FriendshipBridgeLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Statics and equilibrium — forces in bridge structures',
      concept: `A bridge in static equilibrium has zero net force and zero net torque. For a simply-supported beam bridge with supports at both ends, the vertical reaction forces R_A and R_B must satisfy: R_A + R_B = W (total load) and R_A × L = W × d (moment balance about B), where L is span length and d is the load's distance from B. These two equations let us solve for both reactions.

Truss bridges use triangular arrangements of members that carry only axial forces (tension or compression, no bending). This is structurally efficient because materials are strongest in pure tension/compression. The method of joints analyzes each node: at every joint, the sum of horizontal forces = 0 and sum of vertical forces = 0. For a truss with n joints and m members, we need 2n equations (2 per joint) and m + 3 unknowns (member forces + 3 reaction forces). The truss is statically determinate when m + 3 = 2n.

Real bridges in Northeast India face unique challenges: monsoon flooding increases hydraulic loads, seismic forces from the active tectonic zone, and heavy vehicle loads on narrow mountain roads. The traditional bamboo bridges of Meghalaya (living root bridges) solve the material challenge brilliantly — using growing Ficus elastica roots as natural structural members that strengthen over time rather than degrading.`,
      analogy: 'A truss bridge is like a group of people standing in a triangle formation, each holding hands with their neighbors. When weight is placed on top, each person either pushes against or pulls on their neighbors (compression or tension). No single person bends — they all stay straight. The triangle shape ensures that no matter where the weight is placed, the forces distribute evenly. This is why triangles are the fundamental shape of structural engineering.',
      storyConnection: 'The friendship bridge in the story connects two communities separated by a river gorge. Building it requires understanding forces — how the weight of people crossing creates reactions at the supports, how wind creates lateral loads, and how the bridge must resist all these forces simultaneously. The story of building the bridge is the story of structural engineering.',
      checkQuestion: 'A bridge spans 20m with supports at each end. A 10,000 kg truck sits 8m from the left support. Calculate both support reactions. If the bridge is a truss with 7 joints and 11 members, is it statically determinate?',
      checkAnswer: 'Weight W = 10000 × 9.81 = 98,100 N. Taking moments about left support: R_B × 20 = 98100 × 8, so R_B = 39,240 N. From vertical equilibrium: R_A = 98100 - 39240 = 58,860 N. Check: the truck is closer to A, so A carries more load — makes sense. Determinacy: m + 3 = 11 + 3 = 14. 2n = 2 × 7 = 14. Since m + 3 = 2n, the truss is statically determinate — we can solve all member forces using equilibrium alone.',
      codeIntro: 'Analyze a truss bridge using the method of joints, calculate support reactions, and visualize member forces (tension vs compression).',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simple truss bridge analysis
# Warren truss: 6 panels, triangular members
span = 24  # meters
height = 4  # meters
n_panels = 6
panel_width = span / n_panels

# Node coordinates
top_nodes = [(i * panel_width, height) for i in range(1, n_panels)]
bottom_nodes = [(i * panel_width, 0) for i in range(n_panels + 1)]
nodes = bottom_nodes + top_nodes
n_nodes = len(nodes)
nodes = np.array(nodes)

# Member connectivity (node index pairs)
members = []
# Bottom chord
for i in range(n_panels):
    members.append((i, i + 1))
# Top chord
for i in range(n_panels + 1, n_nodes - 1):
    members.append((i, i + 1))
# Verticals and diagonals
for i in range(n_panels - 1):
    # Vertical from bottom to top
    members.append((i + 1, n_panels + 1 + i))
    # Diagonals
    members.append((i, n_panels + 1 + i))
    members.append((i + 1 + 1, n_panels + 1 + i))
# End diagonals
members.append((0, n_panels + 1))
members.append((n_panels, n_nodes - 1))
n_members = len(members)

# Apply loads
loads = np.zeros((n_nodes, 2))
# Uniform load on bottom chord (dead weight + traffic)
dead_load = -5000  # N per node
for i in range(n_panels + 1):
    loads[i, 1] = dead_load
# Point load (truck) at node 3
loads[3, 1] += -50000

# Solve using direct stiffness method (simplified for 2D truss)
# Assemble global stiffness matrix
E = 200e9  # Pa (steel)
A = 0.005  # m^2 cross-section area
ndof = 2 * n_nodes
K = np.zeros((ndof, ndof))
for m_idx, (i, j) in enumerate(members):
    dx = nodes[j, 0] - nodes[i, 0]
    dy = nodes[j, 1] - nodes[i, 1]
    L = np.sqrt(dx**2 + dy**2)
    c, s = dx / L, dy / L
    k_local = E * A / L * np.array([
        [c*c, c*s, -c*c, -c*s],
        [c*s, s*s, -c*s, -s*s],
        [-c*c, -c*s, c*c, c*s],
        [-c*s, -s*s, c*s, s*s]
    ])
    dofs = [2*i, 2*i+1, 2*j, 2*j+1]
    for a in range(4):
        for b in range(4):
            K[dofs[a], dofs[b]] += k_local[a, b]

# Boundary conditions: pin at node 0 (fix x,y), roller at node n_panels (fix y)
fixed_dofs = [0, 1, 2*n_panels + 1]  # node 0 x,y and node n_panels y
free_dofs = [i for i in range(ndof) if i not in fixed_dofs]

# Load vector
F = loads.flatten()
K_ff = K[np.ix_(free_dofs, free_dofs)]
F_f = F[free_dofs]

# Solve
u_f = np.linalg.solve(K_ff, F_f)
u = np.zeros(ndof)
u[free_dofs] = u_f

# Calculate member forces
member_forces = []
for i, j in members:
    dx = nodes[j, 0] - nodes[i, 0]
    dy = nodes[j, 1] - nodes[i, 1]
    L = np.sqrt(dx**2 + dy**2)
    c, s = dx / L, dy / L
    du = np.array([u[2*j] - u[2*i], u[2*j+1] - u[2*i+1]])
    axial_deform = c * du[0] + s * du[1]
    force = E * A / L * axial_deform
    member_forces.append(force)
member_forces = np.array(member_forces)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Truss geometry with member forces
ax = axes[0, 0]
ax.set_facecolor('#111827')
max_force = max(abs(member_forces.max()), abs(member_forces.min()))
for idx, ((i, j), force) in enumerate(zip(members, member_forces)):
    x = [nodes[i, 0], nodes[j, 0]]
    y = [nodes[i, 1], nodes[j, 1]]
    if abs(force) < 100:
        color, lw = 'gray', 1
    elif force > 0:
        color = '#ef4444'  # tension (red)
        lw = 1 + 3 * abs(force) / max_force
    else:
        color = '#3b82f6'  # compression (blue)
        lw = 1 + 3 * abs(force) / max_force
    ax.plot(x, y, color=color, linewidth=lw, alpha=0.8)
# Draw nodes
ax.scatter(nodes[:, 0], nodes[:, 1], c='white', s=30, zorder=5, edgecolors='gray')
# Load arrows
for i in range(n_nodes):
    if loads[i, 1] != 0:
        ax.annotate('', xy=(nodes[i, 0], nodes[i, 1]),
                    xytext=(nodes[i, 0], nodes[i, 1] - np.sign(loads[i, 1]) * 1.5),
                    arrowprops=dict(arrowstyle='->', color='#fbbf24', lw=1.5))
# Support symbols
ax.plot(nodes[0, 0], -0.3, '^', color='#22c55e', markersize=15)
ax.plot(nodes[n_panels, 0], -0.3, 'o', color='#22c55e', markersize=12)
ax.set_aspect('equal')
ax.set_title('Truss Bridge: Member Forces', color='white', fontsize=12, fontweight='bold')
ax.text(span/2, -1.5, 'Red = TENSION, Blue = COMPRESSION, width = force magnitude',
        color='gray', fontsize=8, ha='center')
ax.tick_params(colors='gray')
ax.set_xlabel('Position (m)', color='white')

# Plot 2: Force distribution in members
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
sorted_forces = np.sort(member_forces)
colors_f = ['#ef4444' if f > 0 else '#3b82f6' for f in sorted_forces]
ax2.barh(range(n_members), sorted_forces / 1000, color=colors_f, alpha=0.8,
         edgecolor='white', linewidth=0.3)
ax2.axvline(0, color='white', linewidth=0.5)
ax2.set_xlabel('Force (kN)', color='white')
ax2.set_ylabel('Member (sorted)', color='white')
ax2.set_title('Member Force Distribution', color='white', fontsize=12, fontweight='bold')
ax2.tick_params(colors='gray')
ax2.text(max(member_forces)/2000, n_members-2, 'TENSION →', color='#ef4444', fontsize=10)
ax2.text(min(member_forces)/2000, n_members-2, '← COMPRESSION', color='#3b82f6', fontsize=10, ha='right')

# Plot 3: Deflected shape
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
scale = 200  # amplification factor for visibility
displaced = nodes.copy()
for i in range(n_nodes):
    displaced[i, 0] += u[2*i] * scale
    displaced[i, 1] += u[2*i+1] * scale
# Draw original
for i, j in members:
    ax3.plot([nodes[i,0], nodes[j,0]], [nodes[i,1], nodes[j,1]],
            color='gray', linewidth=0.5, linestyle='--', alpha=0.5)
# Draw displaced
for idx, (i, j) in enumerate(members):
    ax3.plot([displaced[i,0], displaced[j,0]], [displaced[i,1], displaced[j,1]],
            color='#f59e0b', linewidth=1.5, alpha=0.8)
ax3.scatter(displaced[:, 0], displaced[:, 1], c='#f59e0b', s=20, zorder=5)
max_deflection = np.max(np.abs(u[1::2])) * 1000
ax3.set_aspect('equal')
ax3.set_title(f'Deflected Shape ({scale}x amplified, max = {max_deflection:.1f} mm)', color='white', fontsize=11, fontweight='bold')
ax3.tick_params(colors='gray')
ax3.set_xlabel('Position (m)', color='white')

# Plot 4: Load position vs max deflection
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
positions = np.linspace(0, span, 50)
max_deflections = []
for pos in positions:
    loads_test = np.zeros((n_nodes, 2))
    for i in range(n_panels + 1):
        loads_test[i, 1] = dead_load
    # Find nearest node
    nearest = np.argmin(np.abs(nodes[:n_panels+1, 0] - pos))
    loads_test[nearest, 1] += -50000
    F_test = loads_test.flatten()
    F_f_test = F_test[free_dofs]
    u_f_test = np.linalg.solve(K_ff, F_f_test)
    u_test = np.zeros(ndof)
    u_test[free_dofs] = u_f_test
    max_deflections.append(np.max(np.abs(u_test[1::2])) * 1000)

ax4.plot(positions, max_deflections, color='#3b82f6', linewidth=2.5)
ax4.fill_between(positions, 0, max_deflections, alpha=0.15, color='#3b82f6')
ax4.axhline(span / 300 * 1000, color='#fbbf24', linestyle='--', linewidth=1,
            label=f'L/300 limit ({span/300*1000:.1f} mm)')
ax4.set_xlabel('Load position along bridge (m)', color='white')
ax4.set_ylabel('Maximum deflection (mm)', color='white')
ax4.set_title('Influence Line: Max Deflection vs Load Position', color='white', fontsize=11, fontweight='bold')
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    TRUSS BRIDGE STRUCTURAL ANALYSIS")
print("=" * 60)
print(f"\\nBridge: {span}m span, {height}m height, {n_panels} panels")
print(f"Nodes: {n_nodes}, Members: {n_members}")
print(f"Determinacy: m+3 = {n_members + 3}, 2n = {2*n_nodes}")
print(f"\\nMax tension: {max(member_forces)/1000:.1f} kN")
print(f"Max compression: {min(member_forces)/1000:.1f} kN")
print(f"Max deflection: {max_deflection:.2f} mm")
print(f"Deflection limit (L/300): {span/300*1000:.1f} mm")
print(f"Safety: {'PASS' if max_deflection < span/300*1000 else 'FAIL'}")`,
      challenge: 'Add a moving load analysis: simulate a heavy truck crossing the bridge from left to right, and track how member forces change at each position. Identify which member experiences the maximum force and when.',
      successHint: 'You have performed a complete structural analysis of a truss bridge — from geometry to forces to deflections. This is the same analysis real structural engineers do, just with fewer members.',
    },
    {
      title: 'Material properties — steel, bamboo, and concrete in bridge construction',
      concept: `Bridge materials must resist tension, compression, and sometimes bending. Steel has high tensile strength (~400 MPa) and compressive strength (~250 MPa), with a Young's modulus of ~200 GPa. Concrete is strong in compression (~30-50 MPa) but weak in tension (~3-5 MPa). Reinforced concrete combines both: steel rebar handles tension while concrete handles compression.

Bamboo, used in traditional Northeast Indian bridges, has remarkable properties: tensile strength up to 230 MPa along the grain (comparable to mild steel per unit weight), but only 5-10% of that perpendicular to the grain. Its modulus (~15-20 GPa) is lower than steel, so bamboo bridges deflect more. The hollow circular cross-section gives bamboo an excellent strength-to-weight ratio: I/A is high for hollow sections, meaning more stiffness per unit mass.

Material selection involves trade-offs: steel is strongest but expensive and requires skilled welding; concrete is cheap but heavy and brittle; bamboo is free and renewable but degrades in moisture and has variable properties. For rural Meghalaya bridges, bamboo lashed with cane is often optimal — locally available, maintainable by the community, and adequate for pedestrian loads.`,
      analogy: 'Choosing bridge materials is like choosing tools for a job. Steel is like a precision power tool — extremely capable but expensive and needs a specialist. Concrete is like a heavy-duty hammer — cheap, good for certain tasks (compression), terrible for others (tension). Bamboo is like a Swiss Army knife — versatile, lightweight, locally available, but not as strong as specialized tools. The best choice depends on what you need: a highway bridge demands steel; a footpath over a stream works perfectly with bamboo.',
      storyConnection: 'The friendship bridge could be built from steel, concrete, or bamboo — each choice reflects the community\'s resources and needs. The story\'s bridge symbolizes connection, and the material choice determines whether that connection lasts one season or one century. Understanding material properties lets us design bridges that match both the structural requirements and the community\'s ability to maintain them.',
      checkQuestion: 'A bridge member must resist 50 kN of tension. Compare the required cross-sectional area for: (a) steel (σ_allow = 160 MPa), (b) bamboo along grain (σ_allow = 80 MPa), (c) concrete (σ_allow = 3 MPa). Why is concrete impractical for tension members?',
      checkAnswer: 'Required area A = F/σ. (a) Steel: A = 50,000/160 = 312.5 mm² (about 20mm diameter rod). (b) Bamboo: A = 50,000/80 = 625 mm² (about 28mm diameter, or one medium bamboo culm). (c) Concrete: A = 50,000/3 = 16,667 mm² (129mm × 129mm block — massive and impractical). Concrete is impractical for tension because its tensile strength is only 1.5-2% of steel\'s. It would require 53x the cross-section of steel, making tension members absurdly large. This is why concrete bridges use steel reinforcement for all tension zones.',
      codeIntro: 'Compare material properties for bridge construction, optimize cross-sections, and analyze cost-performance trade-offs.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Material properties database
materials = {
    'Structural steel': {'E': 200, 'fy_t': 250, 'fy_c': 250, 'density': 7850, 'cost': 80, 'color': '#3b82f6'},
    'High-strength steel': {'E': 200, 'fy_t': 400, 'fy_c': 400, 'density': 7850, 'cost': 120, 'color': '#1d4ed8'},
    'Concrete (M30)': {'E': 27, 'fy_t': 3, 'fy_c': 30, 'density': 2400, 'cost': 5, 'color': '#6b7280'},
    'Bamboo (along)': {'E': 17, 'fy_t': 180, 'fy_c': 60, 'density': 700, 'cost': 2, 'color': '#22c55e'},
    'Timber (teak)': {'E': 12, 'fy_t': 80, 'fy_c': 50, 'density': 650, 'cost': 30, 'color': '#f59e0b'},
    'GFRP composite': {'E': 25, 'fy_t': 300, 'fy_c': 200, 'density': 1800, 'cost': 200, 'color': '#a855f7'},
}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Strength comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
names = list(materials.keys())
tensions = [m['fy_t'] for m in materials.values()]
compressions = [m['fy_c'] for m in materials.values()]
colors_m = [m['color'] for m in materials.values()]
x = np.arange(len(names))
width = 0.35
ax.barh(x - width/2, tensions, width, color=colors_m, alpha=0.8, label='Tensile strength')
ax.barh(x + width/2, compressions, width, color=colors_m, alpha=0.4, edgecolor=colors_m,
        linewidth=2, label='Compressive strength')
ax.set_yticks(x)
ax.set_yticklabels([n.split('(')[0].strip()[:12] for n in names], fontsize=8)
ax.set_xlabel('Strength (MPa)', color='white')
ax.set_title('Material Strength Comparison', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Specific strength (strength/density) — what matters for bridges
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
specific_t = [m['fy_t'] / (m['density'] / 1000) for m in materials.values()]
specific_c = [m['fy_c'] / (m['density'] / 1000) for m in materials.values()]
ax2.barh(x - width/2, specific_t, width, color=colors_m, alpha=0.8, label='Specific tensile')
ax2.barh(x + width/2, specific_c, width, color=colors_m, alpha=0.4, edgecolor=colors_m,
         linewidth=2, label='Specific compressive')
ax2.set_yticks(x)
ax2.set_yticklabels([n.split('(')[0].strip()[:12] for n in names], fontsize=8)
ax2.set_xlabel('Specific strength (MPa/(kg/m³ × 10³))', color='white')
ax2.set_title('Specific Strength (per unit weight)', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Cost-performance analysis
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
costs = [m['cost'] for m in materials.values()]
strengths_avg = [(m['fy_t'] + m['fy_c']) / 2 for m in materials.values()]
densities = [m['density'] for m in materials.values()]
# Performance metric: specific strength / cost
performance = [s / (d / 1000) / c for s, d, c in zip(strengths_avg, densities, costs)]
for i, (name, perf, color) in enumerate(zip(names, performance, colors_m)):
    short_name = name.split('(')[0].strip()[:10]
    ax3.scatter(costs[i], specific_t[i], s=200, c=color, edgecolors='white', linewidths=1, zorder=5)
    ax3.annotate(short_name, (costs[i], specific_t[i]), textcoords='offset points',
                 xytext=(8, 5), color=color, fontsize=8)
ax3.set_xlabel('Cost (Rs/kg)', color='white')
ax3.set_ylabel('Specific tensile strength', color='white')
ax3.set_title('Cost vs Performance', color='white', fontsize=12, fontweight='bold')
ax3.tick_params(colors='gray')
ax3.set_xscale('log')

# Plot 4: Required cross-section for 50 kN tension
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
F_required = 50000  # N
safety_factor = 1.5
required_areas = [F_required * safety_factor / (m['fy_t'] * 1e6) * 1e6 for m in materials.values()]  # mm²
required_masses = [a * 1e-6 * m['density'] for a, m in zip(required_areas, materials.values())]  # kg/m

bars = ax4.bar(range(len(names)), required_areas, color=colors_m, alpha=0.8,
               edgecolor='white', linewidth=0.5)
ax4.set_xticks(range(len(names)))
ax4.set_xticklabels([n.split('(')[0].strip()[:10] for n in names], fontsize=7, rotation=45, ha='right')
ax4.set_ylabel('Required area (mm²)', color='white')
ax4.set_title('Cross-Section for 50 kN Tension (SF=1.5)', color='white', fontsize=11, fontweight='bold')
ax4.tick_params(colors='gray')
ax4.set_yscale('log')
for bar, area in zip(bars, required_areas):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() * 1.2,
             f'{area:.0f}', ha='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("=" * 60)
print("    BRIDGE MATERIAL COMPARISON")
print("=" * 60)
print(f"\\nFor 50 kN tension member (SF = {safety_factor}):")
for name, area, mass in zip(names, required_areas, required_masses):
    equiv_dia = 2 * np.sqrt(area / np.pi)
    print(f"  {name:<22}: A = {area:>8.0f} mm² (d = {equiv_dia:.0f} mm), mass = {mass:.1f} kg/m")
print(f"\\nBamboo requires {required_areas[3]/required_areas[0]:.1f}x the area of steel")
print(f"but only {required_masses[3]/required_masses[0]:.1f}x the mass — bamboo is competitive by weight!")`,
      challenge: 'Design a composite bamboo-concrete bridge member where bamboo handles tension and concrete handles compression. Calculate the neutral axis position and compare the composite member to pure bamboo and pure concrete alternatives.',
      successHint: 'You have compared bridge materials quantitatively — bamboo\'s excellent specific strength explains its widespread use in traditional Northeast Indian bridges, while steel and concrete dominate modern construction for their absolute strength and durability.',
    },
    {
      title: 'Load analysis — dead loads, live loads, and dynamic amplification',
      concept: `Bridge loads fall into three categories: (1) Dead loads — the permanent weight of the bridge structure itself. For a steel truss bridge, this is typically 3-8 kN/m of bridge length. For concrete, much heavier: 20-50 kN/m. (2) Live loads — temporary loads from traffic, pedestrians, and cargo. Indian standards (IRC) specify different loading classes: Class AA (tracked military vehicles, 70 tons), Class A (standard trucks, 55.4 tons), and Class B (lighter vehicles). (3) Environmental loads — wind, seismic, water current, temperature effects.

Dynamic amplification factor (DAF) accounts for the fact that a moving load has greater effect than a static load at the same position. When a truck crosses a bridge, its bouncing and vibration amplifies the force. DAF typically ranges from 1.1 to 1.4 depending on span length and road surface roughness: DAF = 1 + 15/(40 + L), where L is span in meters (simplified IRC formula).

Load combinations are critical: the bridge must resist the worst-case combination of dead + live + wind + seismic loads, each multiplied by appropriate load factors. The fundamental equation is: Design load = 1.35 × DL + 1.5 × LL + 1.5 × WL (for strength limit state). The bridge must also satisfy serviceability limits — deflection < L/300 for highway bridges, L/500 for railway bridges.`,
      analogy: 'Think of standing on a bathroom scale. Your weight is the dead load — always there. When you jump (dynamic load), the scale briefly reads much more than your weight — that\'s dynamic amplification. If someone pushes you sideways while you\'re standing on the scale (wind load), you need to brace (stronger structure). A bridge must handle all three simultaneously: its own weight, bouncing trucks, and monsoon winds — all at the same time.',
      storyConnection: 'The friendship bridge must carry people, their goods, and perhaps small vehicles across the gorge. The design must account for the heaviest realistic load — perhaps a crowd of villagers crossing together during a festival, or a loaded cart during harvest season. The monsoon brings additional challenges: wind loads increase, river levels rise (adding hydraulic pressure on supports), and the wet surface increases dynamic amplification.',
      checkQuestion: 'A 20m footbridge has dead load 2 kN/m and must carry 4 kN/m² live load on a 2m wide deck. Maximum wind load is 1.5 kN/m. Calculate the design load per meter using IRC load factors. What is the total design force on each support?',
      checkAnswer: 'Dead load: 2 kN/m. Live load: 4 × 2 = 8 kN/m. Wind load: 1.5 kN/m (lateral). For vertical design load: w_design = 1.35 × 2 + 1.5 × 8 = 2.7 + 12 = 14.7 kN/m. Including DAF: DAF = 1 + 15/(40+20) = 1.25. Live load with DAF: 1.5 × 8 × 1.25 = 15 kN/m. So w_design = 2.7 + 15 = 17.7 kN/m. Total force: 17.7 × 20 = 354 kN. Each support: 354/2 = 177 kN (equivalent to 18 tons). The bridge supports must each carry the weight of about 18 tons — mostly from live load amplification.',
      codeIntro: 'Analyze bridge loading combinations, calculate dynamic amplification, and determine design loads for different bridge types.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Bridge load analysis
def dynamic_amp_factor(span_m):
    """IRC simplified dynamic amplification factor."""
    return 1 + 15 / (40 + span_m)

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Load components for different bridge types
ax = axes[0, 0]
ax.set_facecolor('#111827')
bridge_types = ['Footbridge\\n(bamboo)', 'Footbridge\\n(steel)', 'Rural road\\n(concrete)', 'Highway\\n(steel-conc)', 'Railway\\n(steel)']
dead_loads = [1, 3, 25, 15, 30]  # kN/m
live_loads = [5, 8, 20, 40, 80]  # kN/m
wind_loads = [0.5, 1, 2, 3, 2]   # kN/m
x = np.arange(len(bridge_types))
width = 0.25
ax.bar(x - width, dead_loads, width, color='#6b7280', alpha=0.8, label='Dead load')
ax.bar(x, live_loads, width, color='#3b82f6', alpha=0.8, label='Live load')
ax.bar(x + width, wind_loads, width, color='#22c55e', alpha=0.8, label='Wind load')
ax.set_xticks(x)
ax.set_xticklabels(bridge_types, fontsize=8)
ax.set_ylabel('Load intensity (kN/m)', color='white')
ax.set_title('Load Components by Bridge Type', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Dynamic amplification factor vs span
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
spans = np.linspace(5, 100, 200)
daf = [dynamic_amp_factor(s) for s in spans]
ax2.plot(spans, daf, color='#ef4444', linewidth=2.5)
ax2.fill_between(spans, 1, daf, alpha=0.15, color='#ef4444')
ax2.axhline(1.0, color='gray', linestyle=':', linewidth=0.5)
# Mark common bridge spans
for s, label in [(10, 'Village'), (20, 'Town'), (50, 'Highway'), (80, 'Major')]:
    d = dynamic_amp_factor(s)
    ax2.plot(s, d, 'o', color='#fbbf24', markersize=8)
    ax2.annotate(f'{label}\\nDAF={d:.2f}', (s, d), textcoords='offset points',
                 xytext=(10, 10), color='#fbbf24', fontsize=8,
                 arrowprops=dict(arrowstyle='->', color='#fbbf24'))
ax2.set_xlabel('Bridge span (m)', color='white')
ax2.set_ylabel('Dynamic amplification factor', color='white')
ax2.set_title('Dynamic Amplification vs Span', color='white', fontsize=12, fontweight='bold')
ax2.tick_params(colors='gray')

# Plot 3: Load combination envelope
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
span = 20
x_bridge = np.linspace(0, span, 200)
# Dead load moment (uniform) — parabolic
w_dead = 5  # kN/m
M_dead = w_dead * x_bridge * (span - x_bridge) / 2
# Live load moment (moving point load at worst position)
P_live = 50  # kN
M_live = np.zeros_like(x_bridge)
for i, x_pos in enumerate(x_bridge):
    # Point load at x_pos: M_max at x_pos
    R_a = P_live * (span - x_pos) / span
    M_live[i] = R_a * x_pos if x_pos <= span/2 else P_live * (span - x_pos) * x_pos / span

M_factored = 1.35 * M_dead + 1.5 * M_live * dynamic_amp_factor(span)

ax3.plot(x_bridge, M_dead, color='#6b7280', linewidth=1.5, linestyle='--', label='Dead load moment')
ax3.plot(x_bridge, M_live, color='#3b82f6', linewidth=1.5, linestyle='--', label='Live load moment')
ax3.plot(x_bridge, M_factored, color='#ef4444', linewidth=2.5, label='Design moment (factored)')
ax3.fill_between(x_bridge, 0, M_factored, alpha=0.1, color='#ef4444')
ax3.set_xlabel('Position along bridge (m)', color='white')
ax3.set_ylabel('Bending moment (kN·m)', color='white')
ax3.set_title('Bending Moment Envelope', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Safety factor across load scenarios
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
scenarios = ['Normal\\ntraffic', 'Heavy\\ntruck', 'Festival\\ncrowd', 'Monsoon\\n+ wind', 'Seismic\\nevent', 'Extreme\\n(all)']
design_capacity = 500  # kN·m (bridge design capacity)
applied_moments = [180, 320, 280, 350, 400, 480]
safety_factors = [design_capacity / m for m in applied_moments]
colors_sf = ['#22c55e' if sf > 1.5 else '#f59e0b' if sf > 1.0 else '#ef4444' for sf in safety_factors]

bars = ax4.bar(range(len(scenarios)), safety_factors, color=colors_sf, alpha=0.8,
               edgecolor='white', linewidth=0.5)
ax4.axhline(1.5, color='#fbbf24', linestyle='--', linewidth=1.5, label='Target SF = 1.5')
ax4.axhline(1.0, color='#ef4444', linestyle='--', linewidth=1.5, label='Minimum SF = 1.0')
ax4.set_xticks(range(len(scenarios)))
ax4.set_xticklabels(scenarios, fontsize=8)
ax4.set_ylabel('Safety factor', color='white')
ax4.set_title('Safety Factor Across Load Scenarios', color='white', fontsize=12, fontweight='bold')
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')
for bar, sf in zip(bars, safety_factors):
    ax4.text(bar.get_x() + bar.get_width()/2, sf + 0.05, f'{sf:.2f}',
             ha='center', color='white', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    BRIDGE LOAD ANALYSIS")
print("=" * 60)
print(f"\\nDesign parameters (20m span):")
print(f"  Dead load: {w_dead} kN/m")
print(f"  Point live load: {P_live} kN")
print(f"  DAF: {dynamic_amp_factor(20):.3f}")
print(f"  Max design moment: {max(M_factored):.1f} kN·m")
print(f"\\nSafety factors:")
for scen, sf in zip(scenarios, safety_factors):
    status = "SAFE" if sf > 1.5 else "MARGINAL" if sf > 1.0 else "UNSAFE"
    print(f"  {scen.replace(chr(10), ' '):<18}: SF = {sf:.2f} ({status})")`,
      challenge: 'Add earthquake analysis: model seismic base shear using V = Z × I × (Sa/g) / (2R) × W (IS 1893 method) for Zone V (Northeast India). Show how seismic forces compare to wind forces and determine which governs the design.',
      successHint: 'You have performed a complete load analysis including dead loads, live loads with dynamic amplification, and safety factor evaluation across scenarios — the core of bridge design practice.',
    },
    {
      title: 'Foundation engineering — how bridges connect to the ground',
      concept: `A bridge is only as strong as its foundations. Foundations transfer the bridge loads to the soil or rock beneath. Two main types: (1) Shallow foundations (footings) — used when strong soil/rock is near the surface. The bearing capacity of soil determines the required footing size: q_ult = c × Nc + γ × D × Nq + 0.5 × γ × B × Nγ, where c is soil cohesion, γ is unit weight, D is footing depth, B is footing width, and Nc, Nq, Nγ are bearing capacity factors that depend on the soil friction angle. (2) Deep foundations (piles) — used when surface soil is weak. Piles transfer load to stronger soil below through shaft friction and end bearing.

In Northeast India's river valleys, foundations face additional challenges: scour (river current eroding soil around foundations) can undermine the entire bridge. The scour depth depends on flow velocity, sediment size, and foundation geometry: d_s = 1.34 × (Q^2 / (d × f))^(1/3) (Lacey's formula), where Q is discharge, d is grain size, and f is Lacey's silt factor. During monsoon floods, scour can deepen by several meters in hours.

Settlement is equally important: foundations must not sink more than allowable limits (typically 25-50mm for bridge piers). Differential settlement between adjacent piers is even more critical — it distorts the bridge deck and can cause structural failure. Settlement = q × B × (1 - ν²) / E_soil × I_s, where I_s depends on footing shape and soil layering.`,
      analogy: 'A bridge foundation is like the roots of a tree. Shallow foundations are like the spread roots of a banyan tree — they cover a wide area near the surface to distribute weight. Deep foundations (piles) are like a pine tree\'s taproot — they drive deep to find solid ground below soft surface soil. Just as a tree can topple if its roots are undermined by erosion, a bridge can fail if scour removes the soil around its foundations during a flood.',
      storyConnection: 'Building the friendship bridge across a river gorge requires understanding the ground on both banks. Rocky ground on one side may support a simple footing; soft alluvial soil on the other may need piles driven deep. The monsoon river threatens to scour around the piers, so the foundation design must account for the worst flood — the bridge must stand through decades of monsoon seasons.',
      checkQuestion: 'A bridge pier exerts 2000 kN on a footing. The soil has bearing capacity 200 kN/m² and allowable settlement of 25mm. What footing size is needed? If monsoon scour removes 2m of soil from around the footing (originally at 1.5m depth), is the footing still safe?',
      checkAnswer: 'Required area: A = 2000/200 = 10 m². For a square footing: B = sqrt(10) = 3.16 m, use 3.2 m × 3.2 m. If 2m of scour removes soil to a depth below the footing base (originally at 1.5m), the footing is now exposed and has lost its embedment. The bearing capacity drops dramatically because the Nq term (which depends on D, the embedment depth) goes to zero: q_ult_new ≈ 0.5 × γ × B × Nγ only, which is much less than the original q_ult. The foundation is likely unsafe after scour. Solution: either deepen the footing beyond maximum scour depth (>3.5m), or use piles, or install scour protection (riprap).',
      codeIntro: 'Model bridge foundation design including bearing capacity, settlement, and scour analysis for Northeast Indian river conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Foundation engineering models
def bearing_capacity(c, gamma, D, B, phi):
    """Terzaghi bearing capacity equation."""
    phi_rad = np.radians(phi)
    Nc = (np.exp(np.pi * np.tan(phi_rad)) * np.tan(np.radians(45 + phi/2))**2 - 1) / np.tan(phi_rad) if phi > 0 else 5.14
    Nq = np.exp(np.pi * np.tan(phi_rad)) * np.tan(np.radians(45 + phi/2))**2
    Ngamma = 2 * (Nq + 1) * np.tan(phi_rad)
    q_ult = c * Nc + gamma * D * Nq + 0.5 * gamma * B * Ngamma
    return q_ult, Nc, Nq, Ngamma

def scour_depth_lacey(Q, f_silt):
    """Lacey's scour depth formula."""
    d_LQ = 1.34 * (Q**2 / f_silt)**(1/3)
    return d_LQ

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Bearing capacity vs friction angle
ax = axes[0, 0]
ax.set_facecolor('#111827')
phi_range = np.linspace(5, 40, 100)
soil_types = [
    ('Soft clay (c=25, no friction)', 25, 0, '#ef4444'),
    ('Stiff clay (c=50, phi=5)', 50, 5, '#f59e0b'),
    ('Sandy soil (c=0, phi=30)', 0, 30, '#22c55e'),
    ('Dense gravel (c=0, phi=38)', 0, 38, '#3b82f6'),
]
B, D, gamma = 3.0, 1.5, 18  # footing width, depth, soil unit weight
for name, c, phi_val, color in soil_types:
    phis = np.linspace(max(1, phi_val-5), min(45, phi_val+5), 50) if phi_val > 0 else np.linspace(1, 10, 50)
    q_vals = [bearing_capacity(c, gamma, D, b_test, p)[0] for p, b_test in zip(phis, [B]*50)]
    if phi_val == 0:
        ax.axhline(bearing_capacity(c, gamma, D, B, 1)[0], color=color, linewidth=2, label=name, linestyle='--')
    else:
        ax.plot(phis, [q/1000 for q in q_vals], color=color, linewidth=2, label=name)
q_various = [bearing_capacity(0, gamma, D, B, p)[0]/1000 for p in phi_range]
ax.plot(phi_range, q_various, color='gray', linewidth=1, linestyle=':', alpha=0.5, label='c=0, varying phi')
ax.set_xlabel('Friction angle (degrees)', color='white')
ax.set_ylabel('Bearing capacity (kPa × 10³)', color='white')
ax.set_title('Bearing Capacity vs Soil Type', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Scour depth analysis
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
Q_range = np.linspace(100, 5000, 200)  # discharge m³/s
silt_factors = [0.5, 1.0, 1.5, 2.0]  # Lacey's silt factor
silt_labels = ['Fine silt (0.5)', 'Medium sand (1.0)', 'Coarse sand (1.5)', 'Gravel (2.0)']
silt_colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']
for f, label, color in zip(silt_factors, silt_labels, silt_colors):
    d_scour = [scour_depth_lacey(q, f) for q in Q_range]
    ax2.plot(Q_range, d_scour, color=color, linewidth=2, label=label)
ax2.axhline(3, color='#fbbf24', linestyle='--', linewidth=1, label='Typical footing depth (3m)')
ax2.set_xlabel('River discharge (m³/s)', color='white')
ax2.set_ylabel('Scour depth (m)', color='white')
ax2.set_title('Scour Depth vs River Discharge', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Footing size optimization
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
B_range = np.linspace(1, 6, 100)
P_load = 2000  # kN
phi_design = 25
c_design = 10
q_ult_vals = [bearing_capacity(c_design, gamma, 1.5, b, phi_design)[0] for b in B_range]
q_applied = P_load / B_range**2  # kPa (square footing)
safety_factor_vals = np.array(q_ult_vals) / (q_applied * 1000)

ax3.plot(B_range, np.array(q_ult_vals) / 1000, color='#22c55e', linewidth=2, label='Bearing capacity')
ax3.plot(B_range, q_applied, color='#ef4444', linewidth=2, label='Applied pressure')
ax3.fill_between(B_range, q_applied, np.array(q_ult_vals)/1000,
                  where=np.array(q_ult_vals)/1000 > q_applied, alpha=0.15, color='#22c55e')
# Find minimum safe footing size
safe_idx = np.where(np.array(q_ult_vals)/1000 > q_applied * 2.5)[0]  # SF > 2.5
if len(safe_idx) > 0:
    B_min = B_range[safe_idx[0]]
    ax3.axvline(B_min, color='#fbbf24', linestyle='--', linewidth=1.5)
    ax3.text(B_min + 0.1, max(q_applied) * 0.8, f'Min B = {B_min:.1f}m\\n(SF > 2.5)',
             color='#fbbf24', fontsize=10)
ax3.set_xlabel('Footing width B (m)', color='white')
ax3.set_ylabel('Pressure (kPa × 10³)', color='white')
ax3.set_title('Footing Size Optimization (2000 kN load)', color='white', fontsize=11, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: Foundation depth vs scour + bearing capacity
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
D_range = np.linspace(0.5, 8, 200)
q_ult_depth = [bearing_capacity(c_design, gamma, d, 3.0, phi_design)[0] / 1000 for d in D_range]
# Monsoon scour profile
normal_scour = 1.5
monsoon_scour = 4.0
extreme_scour = 6.0

ax4.plot(D_range, q_ult_depth, color='#3b82f6', linewidth=2.5, label='Bearing capacity')
ax4.axhline(P_load / 9, color='#ef4444', linestyle='--', linewidth=1.5, label='Required capacity')
ax4.axvline(normal_scour, color='#22c55e', linewidth=1.5, linestyle=':', label=f'Normal scour ({normal_scour}m)')
ax4.axvline(monsoon_scour, color='#f59e0b', linewidth=1.5, linestyle=':', label=f'Monsoon scour ({monsoon_scour}m)')
ax4.axvline(extreme_scour, color='#ef4444', linewidth=1.5, linestyle=':', label=f'Extreme scour ({extreme_scour}m)')
ax4.axvspan(monsoon_scour, extreme_scour, alpha=0.15, color='#ef4444')
ax4.set_xlabel('Foundation depth (m)', color='white')
ax4.set_ylabel('Bearing capacity (kPa × 10³)', color='white')
ax4.set_title('Foundation Depth: Capacity vs Scour Risk', color='white', fontsize=11, fontweight='bold')
ax4.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    BRIDGE FOUNDATION ANALYSIS")
print("=" * 60)
q_design = bearing_capacity(c_design, gamma, 1.5, 3.0, phi_design)
print(f"\\nDesign soil: c={c_design} kPa, phi={phi_design}°, gamma={gamma} kN/m³")
print(f"Bearing capacity (B=3m, D=1.5m): {q_design[0]/1000:.0f} kPa")
print(f"Applied load: {P_load} kN → pressure = {P_load/9:.0f} kPa")
print(f"Safety factor: {q_design[0]/(P_load/9*1000):.1f}")
print(f"\\nScour analysis (Q=1000 m³/s):")
for f, label in zip(silt_factors, silt_labels):
    d = scour_depth_lacey(1000, f)
    print(f"  {label}: scour depth = {d:.1f} m")
print(f"\\nMinimum foundation depth: max(scour) + 1m safety = {extreme_scour + 1:.0f}m")`,
      challenge: 'Design a pile foundation for soft alluvial soil: calculate the number of piles needed, pile spacing (minimum 3× diameter), and group efficiency. Compare the cost of a pile foundation vs a deep spread footing.',
      successHint: 'You have analyzed bridge foundations including bearing capacity, scour, and depth optimization — the hidden but critical part of every bridge that keeps it standing through monsoon floods.',
    },
    {
      title: 'Cable and suspension bridge mechanics — spanning long distances',
      concept: `When spans exceed 50-100m, truss bridges become inefficient and cable systems take over. A suspension bridge uses main cables in catenary shape (or approximately parabolic under uniform load) suspended between towers, with vertical hangers transferring deck load to the cables. The cable tension is enormous: T = w × L² / (8 × f), where w is load per unit length, L is span, and f is cable sag. More sag means less tension (but taller towers).

Cable-stayed bridges use cables running directly from towers to the deck, creating a fan or harp pattern. Each cable carries a fraction of the deck weight. The cable force in a fan arrangement: F_cable = w × Δx / sin(θ), where Δx is the deck segment length and θ is the cable angle. Steeper angles (more tower height) reduce cable forces.

For pedestrian suspension bridges common in Northeast India's hilly terrain, the design is simpler: two main cables support a deck of planks. The critical design parameter is cable sag ratio (f/L): too little sag (< 1/10) creates enormous cable tension; too much sag (> 1/5) creates excessive deck slope at the ends. The optimal range is f/L = 1/10 to 1/12, balancing cable force, tower height, and walkability.`,
      analogy: 'A suspension bridge cable works like a clothesline. When you hang heavy wet clothes (deck load) on a clothesline, it sags. The more you tighten the line (reduce sag), the higher the tension — until the line snaps. The posts (towers) must be strong enough to hold the tension. A clever clothesline user allows some sag to reduce tension, but not so much that the clothes drag on the ground. Bridge engineers solve the exact same optimization.',
      storyConnection: 'The friendship bridge connecting two communities might be a suspension bridge — the most natural way to span a deep gorge with minimal materials. The rope bridges of Arunachal Pradesh use exactly this principle: cane ropes as main cables, bamboo planks as deck, and natural trees as towers. The story\'s bridge is a direct application of catenary mechanics.',
      checkQuestion: 'A pedestrian suspension bridge spans 60m between two cliff-top towers. The deck weighs 3 kN/m including design live load. If the cable sag is 5m (f/L = 1/12), what is the maximum cable tension? How does this change if sag is reduced to 3m?',
      checkAnswer: 'At f = 5m: T_max = w × L² / (8 × f) × sec(θ_max). Horizontal tension: H = wL²/(8f) = 3 × 60² / (8 × 5) = 10800 / 40 = 270 kN. The maximum tension occurs at the towers where the cable angle is steepest: tan(θ) = 4f/L = 4×5/60 = 0.333, so T_max = H/cos(θ) = 270/cos(18.4°) = 284 kN. At f = 3m: H = 3 × 3600 / 24 = 450 kN. T_max = 450/cos(atan(4×3/60)) = 450/cos(11.3°) = 459 kN. Reducing sag from 5m to 3m increases cable tension by 62% — demonstrating the dramatic effect of sag ratio on structural demands.',
      codeIntro: 'Model suspension and cable-stayed bridges, analyze cable forces, and optimize sag ratios for pedestrian bridges.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Suspension bridge mechanics
def parabolic_cable(x, L, f):
    """Parabolic cable shape y(x) with sag f at midspan."""
    return 4 * f * x * (L - x) / L**2

def cable_tension(w, L, f, x):
    """Cable tension at position x (horizontal + vertical components)."""
    H = w * L**2 / (8 * f)  # horizontal tension (constant)
    V = w * (L/2 - x)  # vertical component at x
    T = np.sqrt(H**2 + V**2)
    return T, H

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Suspension bridge profile
ax = axes[0, 0]
ax.set_facecolor('#111827')
L = 60  # m
f = 5   # m sag
w = 3   # kN/m
x_cable = np.linspace(0, L, 200)
y_cable = parabolic_cable(x_cable, L, f)
# Tower height = sag + clearance
clearance = 8
tower_h = f + clearance
# Draw bridge
ax.plot(x_cable, clearance + y_cable, color='#ef4444', linewidth=3, label='Main cable')
ax.plot(x_cable, np.full_like(x_cable, clearance), color='#6b7280', linewidth=2, label='Deck')
# Hangers
for xi in np.linspace(3, L-3, 20):
    yi = parabolic_cable(xi, L, f) + clearance
    ax.plot([xi, xi], [clearance, yi], color='#3b82f6', linewidth=0.8, alpha=0.6)
# Towers
ax.plot([0, 0], [0, tower_h + clearance], color='#f59e0b', linewidth=4)
ax.plot([L, L], [0, tower_h + clearance], color='#f59e0b', linewidth=4)
# Ground and gorge
ax.fill_between([-5, 0], -2, 0, color='#4a5568', alpha=0.5)
ax.fill_between([L, L+5], -2, 0, color='#4a5568', alpha=0.5)
ax.fill_between([0, L], -2, -1, color='#1e3a5f', alpha=0.3)
ax.set_xlim(-8, L+8)
ax.set_ylim(-3, tower_h + clearance + 2)
ax.set_aspect('equal')
ax.set_title(f'Suspension Bridge Profile (L={L}m, f={f}m)', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_xlabel('Position (m)', color='white')

# Plot 2: Cable tension distribution
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
tensions = [cable_tension(w, L, f, x)[0] for x in x_cable]
H_const = cable_tension(w, L, f, 0)[1]
ax2.plot(x_cable, tensions, color='#ef4444', linewidth=2.5, label='Total tension')
ax2.axhline(H_const, color='#3b82f6', linestyle='--', linewidth=1.5, label=f'Horizontal component ({H_const:.0f} kN)')
max_T = max(tensions)
ax2.plot([0, L], [max_T, max_T], ':', color='#fbbf24', linewidth=1)
ax2.text(L/2, max_T + 5, f'Max tension: {max_T:.0f} kN', color='#fbbf24', fontsize=10, ha='center')
ax2.set_xlabel('Position along bridge (m)', color='white')
ax2.set_ylabel('Cable tension (kN)', color='white')
ax2.set_title('Cable Tension Distribution', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Sag ratio optimization
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
sag_ratios = np.linspace(1/20, 1/4, 100)
sags = sag_ratios * L
H_vals = w * L**2 / (8 * sags)
tower_heights = sags + clearance
cable_lengths = [np.sum(np.sqrt(np.diff(x_cable)**2 + np.diff(parabolic_cable(x_cable, L, s))**2)) for s in sags]
# Deck slope at tower
slopes = [np.degrees(np.arctan(4*s/L)) for s in sags]
# Cost model (proportional to cable force × length + tower height × cost)
cable_cost = np.array(H_vals) * np.array(cable_lengths) / 1e6
tower_cost = tower_heights * 2 * 50  # 2 towers × height × cost factor
total_cost = cable_cost + tower_cost
total_cost_norm = total_cost / total_cost.min()

ax3.plot(1/sag_ratios, H_vals, color='#ef4444', linewidth=2, label='Max cable tension (kN)')
ax3_twin = ax3.twinx()
ax3_twin.plot(1/sag_ratios, slopes, color='#3b82f6', linewidth=2, label='Deck slope at tower (°)')
ax3_twin.plot(1/sag_ratios, total_cost_norm * 10, color='#fbbf24', linewidth=2, linestyle='--', label='Relative cost')
ax3.axvspan(10, 12, alpha=0.15, color='#22c55e', label='Optimal range')
ax3.set_xlabel('L/f ratio (inverse sag)', color='white')
ax3.set_ylabel('Cable tension (kN)', color='#ef4444')
ax3_twin.set_ylabel('Slope (°) / Cost index', color='#3b82f6')
ax3.set_title('Sag Ratio Optimization', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper left')
ax3_twin.legend(fontsize=7, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper right')
ax3.tick_params(axis='y', colors='#ef4444')
ax3_twin.tick_params(axis='y', colors='#3b82f6')
ax3.tick_params(axis='x', colors='gray')

# Plot 4: Cable-stayed vs suspension comparison
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
spans = np.linspace(20, 200, 100)
# Suspension bridge cost (cable dominated, scales with L²)
cost_suspension = 0.1 * spans**2 + 500
# Cable-stayed (tower + cable, scales with L^1.5)
cost_stayed = 2 * spans**1.5 + 300
# Truss (material scales with L^1.5 but less efficient at long spans)
cost_truss = 5 * spans**1.3 + 100
# Beam
cost_beam = 10 * spans**1.5

ax4.plot(spans, cost_suspension, color='#ef4444', linewidth=2, label='Suspension')
ax4.plot(spans, cost_stayed, color='#3b82f6', linewidth=2, label='Cable-stayed')
ax4.plot(spans, cost_truss, color='#22c55e', linewidth=2, label='Truss')
ax4.plot(spans, cost_beam, color='#f59e0b', linewidth=2, label='Beam')
ax4.set_xlabel('Span (m)', color='white')
ax4.set_ylabel('Relative cost index', color='white')
ax4.set_title('Bridge Type Selection by Span', color='white', fontsize=12, fontweight='bold')
ax4.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')
# Optimal zones
ax4.axvspan(0, 30, alpha=0.05, color='#f59e0b')
ax4.axvspan(30, 80, alpha=0.05, color='#22c55e')
ax4.axvspan(80, 150, alpha=0.05, color='#3b82f6')
ax4.axvspan(150, 200, alpha=0.05, color='#ef4444')
ax4.text(15, max(cost_beam)*0.9, 'Beam', color='#f59e0b', fontsize=8, ha='center')
ax4.text(55, max(cost_beam)*0.9, 'Truss', color='#22c55e', fontsize=8, ha='center')
ax4.text(115, max(cost_beam)*0.9, 'Cable\\nstayed', color='#3b82f6', fontsize=8, ha='center')
ax4.text(175, max(cost_beam)*0.9, 'Suspension', color='#ef4444', fontsize=8, ha='center')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    SUSPENSION BRIDGE ANALYSIS")
print("=" * 60)
T_max, H = cable_tension(w, L, f, 0)
print(f"\\nDesign: L={L}m, f={f}m, w={w} kN/m")
print(f"Sag ratio: L/f = {L/f:.0f}")
print(f"Horizontal tension: {H:.0f} kN")
print(f"Max cable tension (at towers): {T_max:.0f} kN")
print(f"Tower height: {tower_h + clearance:.0f} m")
print(f"Deck slope at tower: {np.degrees(np.arctan(4*f/L)):.1f}°")
print(f"\\nSag comparison:")
for f_test in [3, 5, 7.5, 10]:
    T_test, H_test = cable_tension(w, L, f_test, 0)
    print(f"  f={f_test}m (L/f={L/f_test:.0f}): T_max={T_test:.0f} kN, slope={np.degrees(np.arctan(4*f_test/L)):.1f}°")`,
      challenge: 'Model wind-induced oscillation of the suspension bridge using the simplified Tacoma Narrows approach. Calculate the natural frequency of the bridge and show resonance conditions that could cause catastrophic vibration.',
      successHint: 'You have analyzed cable bridge mechanics — the physics that enables humans to span gorges and rivers with elegant structures. The friendship bridge is a direct application of catenary and suspension principles.',
    },
    {
      title: 'Bridge design optimization — balancing strength, cost, and constructability',
      concept: `Bridge design is a multi-objective optimization problem: minimize cost while satisfying constraints on strength (all members within allowable stress), serviceability (deflection within limits), durability (corrosion resistance, fatigue life), and constructability (can it be built with available skills and equipment?). The design variables include: member sizes, material choices, span arrangement, and structural system type.

For rural bridges in Northeast India, constructability often dominates: a bamboo truss that the village can build and maintain is better than a steel bridge requiring specialized welders who must travel from the city. The optimization includes social variables: community labor availability, maintenance skill level, and material sourcing distance.

The optimization can be formulated as: minimize C(x) = Σ(material_cost × volume + labor_cost × complexity) subject to: σ_max < σ_allowable, δ_max < L/300, fatigue_life > 50 years, and foundation_capacity > applied_loads. Modern optimization uses genetic algorithms or gradient descent to search the design space. But even a simple parametric study — varying member size and checking constraints — reveals the key trade-offs.`,
      analogy: 'Bridge design optimization is like planning a community feast. You want to feed everyone (strength requirement) with delicious food (serviceability), within budget (cost), using ingredients available locally (constructability). A feast with imported ingredients might be "optimal" on paper but impractical. The best feast uses local produce creatively — just as the best rural bridge uses local materials and skills to their maximum potential.',
      storyConnection: 'Building the friendship bridge requires the community to optimize with real-world constraints: limited budget, local bamboo and stone, community labor with basic tools, and a gorge that floods annually. The design must be simple enough for non-engineers to build and maintain, yet robust enough to survive decades of monsoon seasons. This is engineering optimization at its most practical and meaningful.',
      checkQuestion: 'Design A uses 10 tons of steel at Rs 80/kg (total Rs 8 lakh), spans 30m, and requires specialist welders. Design B uses 15 tons of bamboo at Rs 5/kg (total Rs 0.75 lakh) plus 2 tons of cane at Rs 20/kg (Rs 0.4 lakh), spans 30m, and can be built by the community. Bamboo needs replacement every 5 years (Rs 0.5 lakh each). Over 30 years, which is cheaper? Which factors beyond cost should influence the choice?',
      checkAnswer: 'Design A: Rs 8 lakh initial + Rs 1 lakh maintenance over 30 years = Rs 9 lakh. Design B: Rs 1.15 lakh initial + 5 replacements × Rs 0.5 lakh = Rs 2.5 lakh + Rs 1.15 = Rs 3.65 lakh. Design B is 2.5x cheaper over 30 years. Beyond cost: (1) Bamboo builds community capacity and independence — they can repair without outside help. (2) Steel is more reliable in extreme events (floods, earthquakes). (3) Bamboo is carbon-neutral; steel has high embodied energy. (4) If the community might later need vehicle traffic, steel is upgradeable; bamboo is not. The "best" design depends on the community\'s values, not just engineering metrics.',
      codeIntro: 'Perform bridge design optimization across materials, configurations, and life-cycle costs for a rural Northeast Indian setting.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Bridge design optimization
def bridge_cost(material, span, width, load_kN_m):
    """Estimate bridge cost (Rs in lakhs) for different materials."""
    if material == 'steel':
        weight_per_m = 0.3 * span * 0.015  # tonnes/m (rough)
        material_cost = weight_per_m * span * 80000 / 1e5  # Rs lakh
        labor_cost = span * 0.15  # Rs lakh
        foundation_cost = 2.0  # Rs lakh
        maintenance_annual = material_cost * 0.02
        lifespan = 50
    elif material == 'concrete':
        volume_per_m = 0.5 * width * 0.3  # m³/m
        material_cost = volume_per_m * span * 5000 / 1e5
        labor_cost = span * 0.2
        foundation_cost = 3.0
        maintenance_annual = material_cost * 0.01
        lifespan = 75
    elif material == 'bamboo':
        weight_per_m = 0.05 * span * 0.01
        material_cost = weight_per_m * span * 5000 / 1e5
        labor_cost = span * 0.05  # community labor (low cost)
        foundation_cost = 0.5
        maintenance_annual = material_cost * 0.15
        lifespan = 5
    elif material == 'timber':
        weight_per_m = 0.15 * span * 0.01
        material_cost = weight_per_m * span * 30000 / 1e5
        labor_cost = span * 0.1
        foundation_cost = 1.0
        maintenance_annual = material_cost * 0.05
        lifespan = 20
    return {
        'initial': material_cost + labor_cost + foundation_cost,
        'annual_maint': maintenance_annual,
        'lifespan': lifespan,
        'material_cost': material_cost,
        'labor_cost': labor_cost,
    }

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Life-cycle cost comparison
ax = axes[0, 0]
ax.set_facecolor('#111827')
analysis_period = 50  # years
materials_list = ['steel', 'concrete', 'bamboo', 'timber']
colors_mat = ['#3b82f6', '#6b7280', '#22c55e', '#f59e0b']
span = 30
width = 2
load = 5

for mat, color in zip(materials_list, colors_mat):
    info = bridge_cost(mat, span, width, load)
    years = np.arange(0, analysis_period + 1)
    costs = np.zeros(analysis_period + 1)
    costs[0] = info['initial']
    n_replacements = 0
    for yr in range(1, analysis_period + 1):
        costs[yr] = costs[yr-1] + info['annual_maint']
        if yr % info['lifespan'] == 0 and yr < analysis_period:
            costs[yr] += info['initial'] * 0.8  # replacement cost
            n_replacements += 1
    ax.plot(years, costs, color=color, linewidth=2, label=f'{mat.title()} ({n_replacements} replacements)')
ax.set_xlabel('Years', color='white')
ax.set_ylabel('Cumulative cost (Rs lakh)', color='white')
ax.set_title(f'Life-Cycle Cost ({span}m bridge, {analysis_period} years)', color='white', fontsize=11, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

# Plot 2: Optimal material by span length
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
spans_range = np.arange(10, 80, 2)
best_material = []
costs_by_span = {mat: [] for mat in materials_list}
for s in spans_range:
    best_cost = float('inf')
    best = ''
    for mat in materials_list:
        info = bridge_cost(mat, s, 2, 5)
        lcc = info['initial'] + info['annual_maint'] * min(analysis_period, info['lifespan'])
        if s > 40 and mat == 'bamboo':
            lcc *= 3  # bamboo impractical for long spans
        costs_by_span[mat].append(lcc)
        if lcc < best_cost:
            best_cost = lcc
            best = mat
    best_material.append(best)

for mat, color in zip(materials_list, colors_mat):
    ax2.plot(spans_range, costs_by_span[mat], color=color, linewidth=2, label=mat.title())
ax2.set_xlabel('Bridge span (m)', color='white')
ax2.set_ylabel('Life-cycle cost (Rs lakh)', color='white')
ax2.set_title('Optimal Material by Span Length', color='white', fontsize=12, fontweight='bold')
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Multi-criteria decision matrix
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
criteria = ['Cost', 'Strength', 'Durability', 'Constructability', 'Sustainability', 'Maintenance']
scores = {
    'Steel':    [3, 9, 8, 4, 3, 7],
    'Concrete': [5, 7, 9, 5, 4, 8],
    'Bamboo':   [9, 5, 3, 9, 9, 4],
    'Timber':   [6, 6, 5, 7, 7, 5],
}
angles = np.linspace(0, 2 * np.pi, len(criteria) + 1)
for mat, color in zip(['Steel', 'Concrete', 'Bamboo', 'Timber'], colors_mat):
    values = scores[mat] + [scores[mat][0]]
    ax3.plot(angles, values, 'o-', color=color, linewidth=2, label=mat)
    ax3.fill(angles, values, alpha=0.1, color=color)
ax3.set_xticks(angles[:-1])
ax3.set_xticklabels(criteria, fontsize=8, color='white')
ax3.set_ylim(0, 10)
ax3.set_title('Multi-Criteria Comparison (radar)', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white', loc='upper right')
ax3.tick_params(colors='gray')
ax3.set_facecolor('#111827')

# Plot 4: Constructability index
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
construct_factors = ['Local\\nmaterial', 'Local\\nlabor', 'No heavy\\nequipment', 'Quick\\nbuild', 'Easy\\nrepair', 'Community\\nownership']
steel_scores = [2, 3, 2, 4, 3, 3]
bamboo_scores = [9, 9, 9, 7, 8, 9]
concrete_scores = [5, 5, 3, 3, 4, 4]
timber_scores = [7, 8, 7, 6, 7, 7]

x = np.arange(len(construct_factors))
width = 0.2
ax4.bar(x - 1.5*width, steel_scores, width, color='#3b82f6', alpha=0.8, label='Steel')
ax4.bar(x - 0.5*width, concrete_scores, width, color='#6b7280', alpha=0.8, label='Concrete')
ax4.bar(x + 0.5*width, timber_scores, width, color='#f59e0b', alpha=0.8, label='Timber')
ax4.bar(x + 1.5*width, bamboo_scores, width, color='#22c55e', alpha=0.8, label='Bamboo')
ax4.set_xticks(x)
ax4.set_xticklabels(construct_factors, fontsize=8)
ax4.set_ylabel('Score (0-10)', color='white')
ax4.set_title('Constructability for Rural NE India', color='white', fontsize=12, fontweight='bold')
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("=" * 60)
print("    BRIDGE DESIGN OPTIMIZATION")
print("=" * 60)
print(f"\\nDesign for {span}m span, {width}m wide bridge:")
for mat, color in zip(materials_list, colors_mat):
    info = bridge_cost(mat, span, width, load)
    lcc = info['initial'] + info['annual_maint'] * analysis_period
    print(f"\\n{mat.upper()}:")
    print(f"  Initial cost: Rs {info['initial']:.2f} lakh")
    print(f"  Annual maintenance: Rs {info['annual_maint']:.2f} lakh")
    print(f"  Lifespan: {info['lifespan']} years")
    print(f"  {analysis_period}-year LCC: Rs {lcc:.2f} lakh")
print(f"\\nFor a rural NE Indian community, bamboo wins on cost and")
print(f"constructability, while steel/concrete win on durability.")
print(f"The optimal choice depends on local priorities and resources.")`,
      challenge: 'Implement a genetic algorithm that optimizes member sizes for a truss bridge: each "gene" is a member cross-section area, the fitness function is inverse of total weight subject to stress and deflection constraints. Show how the algorithm converges to an efficient design.',
      successHint: 'You have performed multi-criteria bridge design optimization — the real-world challenge of balancing competing objectives with limited resources. This is engineering at its most practical and human.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Structural engineering, bridge load analysis, and truss design</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for structural analysis. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            />
        ))}
      </div>
    </div>
  );
}
