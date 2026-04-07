import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function BridgeLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Free body diagrams — visualizing forces on a structure',
      concept: `A **free body diagram** (FBD) is the single most important tool in structural engineering. It's a simplified drawing that shows an object isolated from its surroundings, with every force acting on it drawn as an arrow.

The rules for drawing an FBD are strict:
1. **Isolate** the object — draw it alone, removed from everything touching it
2. **Replace** every contact with a force arrow (supports become reaction forces, cables become tension forces, ground becomes a normal force)
3. **Include** gravity (weight) acting downward through the center of mass
4. **Apply equilibrium**: for a static structure, all forces must balance — the sum of forces in every direction equals zero, and the sum of moments (torques) about any point equals zero

For a 2D structure, this gives three equations:
- Sum of horizontal forces = 0 (ΣFx = 0)
- Sum of vertical forces = 0 (ΣFy = 0)
- Sum of moments about any point = 0 (ΣM = 0)

These three equations let you solve for up to three unknown forces — which is exactly how many unknowns a simply supported beam has (two vertical reactions and one horizontal reaction).

A **pin support** resists horizontal and vertical movement (2 reaction forces). A **roller support** resists only vertical movement (1 reaction force). Together they give exactly 3 unknowns — a solvable system.`,
      analogy: 'Drawing an FBD is like taking an X-ray of a structure. You strip away the skin (the physical context) to see the skeleton (the forces). Just as a doctor needs an X-ray to diagnose a fracture, an engineer needs an FBD to diagnose a structural problem. Without it, you\'re guessing.',
      storyConnection: 'If you drew a free body diagram of a living root bridge, the forces would include: the distributed weight of the roots themselves, point loads from each person walking across, reaction forces at each anchor tree, and tension along every root segment. The complexity of the root network makes an exact FBD nearly impossible — which is why researchers use computer models (finite element analysis) to study them.',
      checkQuestion: 'A beam is supported by a pin at the left end and a roller at the right end. A 10 kN load acts downward at the midpoint. Draw the FBD mentally: how many unknown forces are there, and can you solve for all of them?',
      checkAnswer: 'Three unknowns: horizontal reaction at the pin (Ax), vertical reaction at the pin (Ay), and vertical reaction at the roller (By). Three equilibrium equations give: Ax = 0 (no horizontal loads), Ay = 5 kN, By = 5 kN (symmetry splits the load equally). The system is statically determinate — exactly solvable.',
      codeIntro: 'Draw a complete free body diagram and solve for all reactions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Free body diagram solver for a simply supported beam
# with multiple point loads

L = 8.0  # beam length (m)
loads = [
    (2.0, -5000),   # 5 kN down at x=2m
    (5.0, -12000),  # 12 kN down at x=5m
    (7.0, -3000),   # 3 kN down at x=7m
]

# Solve reactions using equilibrium
# Pin at x=0 (Ax, Ay), Roller at x=L (By)
# ΣFx = 0 → Ax = 0
# ΣFy = 0 → Ay + By + sum(loads) = 0
# ΣM about A = 0 → By * L + sum(P * x) = 0

total_load = sum(p for _, p in loads)
moment_about_A = sum(p * x for x, p in loads)

By = -moment_about_A / L
Ay = -total_load - By
Ax = 0.0

print("=" * 50)
print("FREE BODY DIAGRAM SOLUTION")
print("=" * 50)
print(f"Beam length: {L} m")
print(f"\\\nApplied loads:")
for x, p in loads:
    print(f"  {abs(p)/1000:.1f} kN downward at x = {x:.1f} m")
print(f"\\\nTotal applied load: {abs(total_load)/1000:.1f} kN")
print(f"\\\nReactions:")
print(f"  Pin (x=0):    Ax = {Ax/1000:.2f} kN, Ay = {Ay/1000:.2f} kN (upward)")
print(f"  Roller (x={L}): By = {By/1000:.2f} kN (upward)")
print(f"\\\nCheck ΣFy = {(Ay + By + total_load)/1000:.6f} kN (should be 0)")
print(f"Check ΣM_A = {(By * L + moment_about_A)/1000:.6f} kN·m (should be 0)")

# Draw the FBD
fig, ax = plt.subplots(figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

beam_y = 4.0
scale = 0.0003  # arrow scale

# Draw beam
ax.plot([0, L], [beam_y, beam_y], color='#94a3b8', linewidth=8,
        solid_capstyle='round', zorder=3)

# Draw pin support at x=0
pin_size = 0.3
pin = plt.Polygon([[0-pin_size, beam_y-pin_size*1.5],
                    [0+pin_size, beam_y-pin_size*1.5],
                    [0, beam_y-0.05]], color='#64748b', zorder=4)
ax.add_patch(pin)
ax.plot([0-pin_size*1.2, 0+pin_size*1.2],
        [beam_y-pin_size*1.5, beam_y-pin_size*1.5],
        color='#64748b', linewidth=3)
ax.text(0, beam_y - pin_size*1.5 - 0.4, 'Pin\\\nSupport A',
        ha='center', color='#94a3b8', fontsize=8)

# Draw roller support at x=L
roller_r = 0.15
circle = plt.Circle((L, beam_y - pin_size - roller_r), roller_r,
                     color='#64748b', fill=False, linewidth=2, zorder=4)
ax.add_patch(circle)
ax.plot([L-pin_size*1.2, L+pin_size*1.2],
        [beam_y - pin_size - 2*roller_r, beam_y - pin_size - 2*roller_r],
        color='#64748b', linewidth=3)
ax.text(L, beam_y - pin_size*1.5 - 0.7, 'Roller\\\nSupport B',
        ha='center', color='#94a3b8', fontsize=8)

# Draw applied loads (red, downward)
for x, p in loads:
    arrow_len = abs(p) * scale
    ax.annotate('', xy=(x, beam_y + 0.05), xytext=(x, beam_y + arrow_len + 0.5),
                arrowprops=dict(arrowstyle='->', color='#ef4444', lw=2.5))
    ax.text(x, beam_y + arrow_len + 0.7, f'{abs(p)/1000:.0f} kN',
            ha='center', color='#ef4444', fontsize=11, fontweight='bold')

# Draw reaction forces (green, upward)
# Ay at pin
ay_len = Ay * scale
ax.annotate('', xy=(0, beam_y - 0.05), xytext=(0, beam_y - ay_len - 0.8),
            arrowprops=dict(arrowstyle='->', color='#22c55e', lw=2.5))
ax.text(0, beam_y - ay_len - 1.1, f'Ay = {Ay/1000:.2f} kN',
        ha='center', color='#22c55e', fontsize=10, fontweight='bold')

# By at roller
by_len = By * scale
ax.annotate('', xy=(L, beam_y - 0.05), xytext=(L, beam_y - by_len - 1.1),
            arrowprops=dict(arrowstyle='->', color='#22c55e', lw=2.5))
ax.text(L, beam_y - by_len - 1.4, f'By = {By/1000:.2f} kN',
        ha='center', color='#22c55e', fontsize=10, fontweight='bold')

# Dimension line
ax.annotate('', xy=(0, beam_y + 3.5), xytext=(L, beam_y + 3.5),
            arrowprops=dict(arrowstyle='<->', color='gray', lw=1))
ax.text(L/2, beam_y + 3.7, f'L = {L} m', ha='center', color='gray', fontsize=10)

# Position markers
for x, _ in loads:
    ax.plot([x, x], [beam_y + 3.3, beam_y + 3.5], color='gray', linewidth=0.5)
    ax.text(x, beam_y + 3.1, f'{x}m', ha='center', color='gray', fontsize=8)

ax.set_xlim(-1.5, L + 1.5)
ax.set_ylim(0, beam_y + 5)
ax.set_aspect('equal')
ax.set_title('Free Body Diagram — Simply Supported Beam', color='white',
             fontsize=14, fontweight='bold')
ax.axis('off')

# Legend
ax.text(L + 0.8, beam_y + 2, 'Red = Applied loads', color='#ef4444', fontsize=9)
ax.text(L + 0.8, beam_y + 1.5, 'Green = Reactions', color='#22c55e', fontsize=9)

plt.tight_layout()
plt.show()`,
      challenge: 'Add a fourth load: 8 kN at x = 4m. Recalculate the reactions. Then try a distributed load (e.g., the bridge\'s own weight of 2 kN/m spread over the full length) — replace the loads list with a single equivalent point load at the centroid.',
      successHint: 'Every structure ever built starts with an FBD. Master this skill and you can analyze any beam, truss, or frame. The three equilibrium equations are the foundation of all structural analysis.',
    },
    {
      title: 'Calculating beam deflection — how much a bridge bends under load',
      concept: `When you load a beam, it bends. The amount of bending — **deflection** — determines whether the bridge feels safe to walk on, whether attached elements crack, and whether the structure meets building codes.

Deflection depends on four things:
- **Load** (P): more load = more deflection
- **Span** (L): longer span = much more deflection (deflection scales with L³ or L⁴)
- **Material stiffness** (E, Young's modulus): stiffer material = less deflection
- **Cross-section shape** (I, second moment of area): deeper beam = much less deflection

The fundamental equation for a simply supported beam with a central point load is:

**δ_max = PL³ / (48EI)**

This tells you that doubling the span increases deflection by 8x (L³), but doubling the beam depth reduces deflection by 8x (I scales with depth³). This is why bridges get deeper as they get longer — or switch to trusses, arches, or cables.

Building codes typically limit deflection to **L/360** for bridges (1/360th of the span length). A 10-meter bridge should deflect no more than about 28 mm. Beyond this, the bridge feels "bouncy" and pedestrians lose confidence — even if the structure is perfectly safe.`,
      analogy: 'Think of a diving board. A short, thick diving board barely bends when you stand on the end — low deflection. A long, thin diving board bends dramatically — high deflection. The "springiness" you feel is deflection. Engineers want bridges to feel like solid ground, not diving boards.',
      storyConnection: 'Living root bridges have naturally low deflection because the interwoven root mass creates an extremely deep cross-section relative to the span. A 30-meter root bridge might have a root mass 1-2 meters deep — far thicker proportionally than a steel beam bridge of the same span. The roots also have some elasticity, which absorbs dynamic loads (footsteps) rather than transmitting vibrations.',
      checkQuestion: 'A steel I-beam bridge spans 10m and deflects 15mm under full load. You need to span 20m with the same maximum deflection. If you use the same beam cross-section, how much stiffer must the material be?',
      checkAnswer: 'Deflection scales with L³. Doubling L increases deflection by 2³ = 8x. To keep deflection at 15mm, you need 8x the stiffness (E × I product). Since you\'re keeping the same cross-section (same I), you need E to be 8x higher. Steel\'s E is 200 GPa; you\'d need 1600 GPa — which doesn\'t exist in conventional materials. This is why long spans use deeper beams (increase I) or switch to trusses/cables.',
      codeIntro: 'Calculate and visualize beam deflection for different spans, loads, and cross-sections.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Beam deflection analysis
# δ(x) for simply supported beam with central point load

def beam_deflection(x, P, L, E, I):
    """Deflection of simply supported beam, point load at center."""
    mid = L / 2
    delta = np.zeros_like(x)
    left = x <= mid
    right = ~left
    # Left half
    delta[left] = P * x[left] / (48 * E * I) * (3 * L**2 - 4 * x[left]**2)
    # Right half (symmetry)
    x_mirror = L - x[right]
    delta[right] = P * x_mirror / (48 * E * I) * (3 * L**2 - 4 * x_mirror**2)
    return delta

# Parameters
P = 10000  # 10 kN load

# Compare different scenarios
scenarios = [
    {'label': 'Steel I-beam (L=10m)', 'L': 10, 'E': 200e9, 'I': 2e-4,
     'color': '#3b82f6'},
    {'label': 'Steel I-beam (L=20m)', 'L': 20, 'E': 200e9, 'I': 2e-4,
     'color': '#ef4444'},
    {'label': 'Steel deep beam (L=20m, 2×I)', 'L': 20, 'E': 200e9, 'I': 4e-4,
     'color': '#f59e0b'},
    {'label': 'Wood beam (L=10m)', 'L': 10, 'E': 12e9, 'I': 5e-4,
     'color': '#22c55e'},
    {'label': 'Root bridge est. (L=10m)', 'L': 10, 'E': 2e9, 'I': 8e-3,
     'color': '#a855f7'},
]

fig, axes = plt.subplots(2, 1, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Deflection curves
ax = axes[0]
ax.set_facecolor('#111827')

for s in scenarios:
    x = np.linspace(0, s['L'], 200)
    delta = beam_deflection(x, P, s['L'], s['E'], s['I']) * 1000  # mm
    # Normalize x to [0, 1] for comparison
    ax.plot(x / s['L'], delta, linewidth=2, color=s['color'], label=s['label'])
    max_d = np.max(delta)
    # L/360 limit
    limit = s['L'] * 1000 / 360
    pass_fail = "PASS" if max_d < limit else "FAIL"

ax.set_xlabel('Position along beam (normalized)', color='white')
ax.set_ylabel('Deflection (mm)', color='white')
ax.set_title('Beam Deflection Curves — 10 kN Central Load', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8,
          loc='upper right')
ax.tick_params(colors='gray')
ax.invert_yaxis()  # deflection is downward

# Plot 2: Deflection vs span (parametric study)
ax2 = axes[1]
ax2.set_facecolor('#111827')

spans = np.linspace(2, 30, 100)
E_steel = 200e9
I_beam = 2e-4

max_deflections = P * spans**3 / (48 * E_steel * I_beam) * 1000  # mm
limit_line = spans * 1000 / 360  # L/360 limit in mm

ax2.plot(spans, max_deflections, color='#3b82f6', linewidth=2.5,
         label='Steel I-beam deflection')
ax2.plot(spans, limit_line, color='#ef4444', linewidth=2, linestyle='--',
         label='L/360 limit (building code)')
ax2.fill_between(spans, max_deflections, limit_line,
                 where=max_deflections > limit_line,
                 alpha=0.2, color='#ef4444', label='FAILS code')
ax2.fill_between(spans, max_deflections, limit_line,
                 where=max_deflections <= limit_line,
                 alpha=0.2, color='#22c55e', label='PASSES code')

# Find crossover
crossover_idx = np.argmin(np.abs(max_deflections - limit_line))
ax2.plot(spans[crossover_idx], max_deflections[crossover_idx], 'o',
         color='#f59e0b', markersize=10, zorder=5)
ax2.annotate(f'Max span: {spans[crossover_idx]:.1f}m',
             xy=(spans[crossover_idx], max_deflections[crossover_idx]),
             xytext=(spans[crossover_idx] + 2, max_deflections[crossover_idx] + 10),
             color='#f59e0b', fontsize=10, fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax2.set_xlabel('Span (m)', color='white')
ax2.set_ylabel('Max Deflection (mm)', color='white')
ax2.set_title('Maximum Span for a Given Beam (10 kN load)', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Results summary:")
for s in scenarios:
    max_d = P * s['L']**3 / (48 * s['E'] * s['I']) * 1000
    limit = s['L'] * 1000 / 360
    pf = "PASS" if max_d < limit else "FAIL"
    print(f"  {s['label']}:")
    print(f"    Max deflection: {max_d:.1f} mm | Limit (L/360): {limit:.1f} mm | {pf}")`,
      challenge: 'The formula δ = PL³/(48EI) assumes a central point load. For a uniformly distributed load w (N/m), the formula is δ = 5wL⁴/(384EI). Add a distributed load case of w = 2000 N/m and compare it to the 10 kN point load for a 10m steel beam.',
      successHint: 'Deflection calculations are what separate "this bridge feels safe" from "this bridge IS safe." The L³ and L⁴ dependencies explain why long bridges must use fundamentally different structural systems — you can\'t just scale up a short beam.',
    },
    {
      title: 'Truss analysis — triangles as the strongest shape',
      concept: `A **truss** is a structure made entirely of triangles. Each member (bar) carries only axial force — pure tension or pure compression, never bending. This makes trusses extraordinarily efficient: they use the minimum material for the maximum load capacity.

Why triangles? A triangle is the only polygon that is **inherently rigid**. A square made of four pin-jointed bars can collapse into a diamond. A pentagon can fold. But a triangle cannot change shape without changing the length of at least one side — which requires breaking or stretching a member. This geometric rigidity is why every truss, crane, tower, and space frame is built from triangles.

The **method of joints** analyzes a truss by isolating each joint (node) and applying equilibrium:
1. Start at a joint with only 2 unknown member forces
2. Apply ΣFx = 0 and ΣFy = 0
3. Solve for the 2 unknowns
4. Move to the next joint — the forces you just solved become known forces there
5. Repeat until all members are solved

The **method of sections** is faster when you need only a few member forces: cut the truss along a line through no more than 3 members, and apply all three equilibrium equations to one side of the cut.

A member in **tension** is being pulled (positive force convention). A member in **compression** is being pushed (negative). Compression members can **buckle** — a failure mode where a slender bar suddenly bows sideways. Tension members cannot buckle, which is why they can be thinner.`,
      analogy: 'Imagine building a bridge from playing cards. A single card bends easily. Two cards leaning against each other form a triangle — and suddenly they can support weight. The triangle transforms flimsy elements into a rigid structure. This is exactly what a truss does with steel bars.',
      storyConnection: 'The living root bridge doesn\'t use deliberate triangles, but the interwoven root network creates a natural truss-like structure. When roots cross over each other and fuse (a process called inosculation), they form closed loops that function like triangles — resisting deformation. Nature stumbled onto the same geometric principle that engineers formalized in the 18th century.',
      checkQuestion: 'A Pratt truss has vertical members and diagonals that slope toward the center. A Warren truss has no verticals — just alternating up-and-down diagonals. Which uses fewer members for the same span?',
      checkAnswer: 'A Warren truss uses fewer members because it eliminates the verticals. Each triangle shares sides with its neighbors. However, the Warren truss puts higher forces in each member (fewer members share the load), so each member must be thicker. It\'s a trade-off: fewer parts but heavier parts. The Pratt truss distributes forces more evenly.',
      codeIntro: 'Build and analyze a simple truss using the method of joints.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simple Pratt truss analysis
# 6 joints, 9 members, simply supported

# Joint coordinates (x, y) in meters
joints = np.array([
    [0, 0],    # 0: left support (pin)
    [3, 0],    # 1: bottom middle-left
    [6, 0],    # 2: bottom middle-right
    [9, 0],    # 3: right support (roller)
    [3, 3],    # 4: top middle-left
    [6, 3],    # 5: top middle-right
])

# Members as (joint_i, joint_j)
members = [
    (0, 1), (1, 2), (2, 3),   # bottom chord
    (0, 4), (4, 5), (5, 3),   # top chord + diagonals to supports
    (1, 4), (2, 5),           # verticals
    (1, 5),                    # diagonal
]

# External loads (applied at joints)
# 10 kN downward at joints 1 and 2
ext_forces = {1: (0, -10000), 2: (0, -10000)}

# Solve using method of joints (matrix method)
n_joints = len(joints)
n_members = len(members)
n_dof = 2 * n_joints  # 2 DOF per joint

# Build equilibrium matrix A
A = np.zeros((n_dof, n_members + 3))  # 3 reaction unknowns (Ax, Ay, By)

for m_idx, (i, j) in enumerate(members):
    dx = joints[j][0] - joints[i][0]
    dy = joints[j][1] - joints[i][1]
    length = np.sqrt(dx**2 + dy**2)
    cos_a = dx / length
    sin_a = dy / length

    # Joint i: force component from member
    A[2*i, m_idx] = cos_a
    A[2*i+1, m_idx] = sin_a
    # Joint j: opposite direction
    A[2*j, m_idx] = -cos_a
    A[2*j+1, m_idx] = -sin_a

# Reaction columns: Ax at joint 0 (col n_members), Ay at joint 0 (col n_members+1),
# By at joint 3 (col n_members+2)
A[0, n_members] = 1      # Ax at joint 0, x-direction
A[1, n_members + 1] = 1  # Ay at joint 0, y-direction
A[7, n_members + 2] = 1  # By at joint 3, y-direction

# Load vector
b = np.zeros(n_dof)
for joint_idx, (fx, fy) in ext_forces.items():
    b[2*joint_idx] = -fx
    b[2*joint_idx + 1] = -fy

# Solve
try:
    forces = np.linalg.lstsq(A, b, rcond=None)[0]
    member_forces = forces[:n_members]
    reactions = forces[n_members:]
except Exception:
    member_forces = np.zeros(n_members)
    reactions = np.zeros(3)

# Visualization
fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Left: Truss geometry with forces
ax = axes[0]
ax.set_facecolor('#111827')

# Draw members colored by tension/compression
max_force = max(abs(member_forces)) if max(abs(member_forces)) > 0 else 1
for m_idx, (i, j) in enumerate(members):
    f = member_forces[m_idx]
    if abs(f) < 1:  # near zero
        color = '#94a3b8'
        lw = 1.5
    elif f > 0:  # tension
        color = '#3b82f6'
        lw = 1 + 3 * abs(f) / max_force
    else:  # compression
        color = '#ef4444'
        lw = 1 + 3 * abs(f) / max_force
    ax.plot([joints[i][0], joints[j][0]], [joints[i][1], joints[j][1]],
            color=color, linewidth=lw, zorder=2)
    # Label
    mx = (joints[i][0] + joints[j][0]) / 2
    my = (joints[i][1] + joints[j][1]) / 2
    ax.text(mx, my + 0.2, f'{f/1000:.1f}kN', ha='center', fontsize=7,
            color=color, fontweight='bold')

# Draw joints
for idx, (x, y) in enumerate(joints):
    ax.plot(x, y, 'o', color='white', markersize=8, zorder=3)
    ax.text(x, y - 0.5, f'J{idx}', ha='center', color='gray', fontsize=8)

# Draw loads
for joint_idx, (fx, fy) in ext_forces.items():
    jx, jy = joints[joint_idx]
    ax.annotate('', xy=(jx, jy), xytext=(jx, jy + 1.5),
                arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=2.5))
    ax.text(jx, jy + 1.7, f'{abs(fy)/1000:.0f}kN', ha='center',
            color='#f59e0b', fontsize=10, fontweight='bold')

# Supports
pin = plt.Polygon([[-0.2, -0.3], [0.2, -0.3], [0, 0]], color='#64748b', zorder=4)
ax.add_patch(pin)
ax.plot(9, -0.15, 'o', color='#64748b', markersize=12, zorder=4)

ax.set_xlim(-1, 10)
ax.set_ylim(-1.5, 5)
ax.set_aspect('equal')
ax.set_title('Truss: Member Forces', color='white', fontsize=12)
ax.axis('off')

# Legend
ax.text(0, 4.5, 'Blue = Tension (+)', color='#3b82f6', fontsize=9, fontweight='bold')
ax.text(0, 4.0, 'Red = Compression (−)', color='#ef4444', fontsize=9, fontweight='bold')
ax.text(0, 3.5, 'Line width ∝ force magnitude', color='gray', fontsize=8)

# Right: Bar chart of member forces
ax2 = axes[1]
ax2.set_facecolor('#111827')

member_labels = [f'{i}-{j}' for i, j in members]
bar_colors = ['#3b82f6' if f > 0 else '#ef4444' if f < 0 else '#94a3b8'
              for f in member_forces]

bars = ax2.barh(member_labels, member_forces / 1000, color=bar_colors, height=0.6)
ax2.axvline(0, color='gray', linewidth=0.5)
ax2.set_xlabel('Force (kN)', color='white')
ax2.set_ylabel('Member (joint-joint)', color='white')
ax2.set_title('Member Forces Summary', color='white', fontsize=12)
ax2.tick_params(colors='gray')

for bar, f in zip(bars, member_forces):
    label = f'{f/1000:.1f} kN'
    x_pos = bar.get_width() + 0.3 if f >= 0 else bar.get_width() - 0.3
    ha = 'left' if f >= 0 else 'right'
    ax2.text(x_pos, bar.get_y() + bar.get_height()/2, label,
             va='center', ha=ha, color='white', fontsize=8)

plt.tight_layout()
plt.show()

print(f"\\\nReactions: Ax = {reactions[0]/1000:.2f} kN, Ay = {reactions[1]/1000:.2f} kN, By = {reactions[2]/1000:.2f} kN")
print(f"\\\nMember analysis:")
for m_idx, (i, j) in enumerate(members):
    f = member_forces[m_idx]
    state = "TENSION" if f > 0 else "COMPRESSION" if f < 0 else "ZERO-FORCE"
    print(f"  Member {i}-{j}: {f/1000:+.2f} kN ({state})")`,
      challenge: 'Add a horizontal wind load of 5 kN at joint 4 (to the right). How do the member forces change? Which members are now more critical? Does the truss still work if you remove the diagonal member 1-5?',
      successHint: 'Truss analysis is the gateway to understanding all skeletal structures: bridge trusses, roof frames, crane booms, transmission towers, and even the International Space Station. Every triangle you see in an engineered structure is there for a reason.',
    },
    {
      title: 'Safety factors — why engineers over-design',
      concept: `No engineer designs a bridge to carry exactly the expected load. Every structure is designed with a **safety factor** (also called factor of safety, FoS) — a multiplier that ensures the structure can handle more than it will ever see in practice.

**Safety Factor = Ultimate Strength / Maximum Expected Stress**

A safety factor of 2.0 means the structure can carry twice the expected maximum load before failing. Typical safety factors:
- Bridges: 2.0 - 3.0
- Buildings: 1.5 - 2.5
- Aircraft: 1.25 - 1.5 (weight is critical, so lower FoS with more testing)
- Nuclear reactors: 4.0 - 10.0
- Space structures: 1.1 - 1.4 (every gram costs thousands to launch)

Why not just use a safety factor of 10 for everything? Because material costs money, and excess weight creates its own problems. A bridge with FoS = 10 would cost 5-10x more and might be so heavy it can't support itself.

The safety factor accounts for:
- **Material variability**: a batch of steel might be 5-10% weaker than spec
- **Construction imperfections**: welds have defects, concrete has air pockets
- **Unexpected loads**: a bridge might see heavier trucks than planned
- **Degradation**: corrosion, fatigue, weathering reduce strength over time
- **Modeling uncertainty**: our equations are approximations of reality

A living root bridge has an unusual safety factor profile: it starts with FoS < 1 (too weak to use) and increases over time as the roots grow. After decades, the FoS can exceed 5 — higher than most engineered bridges. The bridge keeps getting safer.`,
      analogy: 'A safety factor is like packing extra food for a hike. If the hike should take 4 hours, you pack food for 8 hours (FoS = 2). You probably won\'t need it — but if you get lost, injured, or delayed, that extra food could save your life. The cost of carrying extra food is small; the cost of running out is catastrophic. Engineering works the same way.',
      storyConnection: 'The living root bridges of Meghalaya have been observed to support 50+ people simultaneously, yet they typically carry only a few at a time. Their safety factor increases every year as roots thicken — the opposite of conventional bridges, where the safety factor decreases with age due to corrosion and fatigue. A 200-year-old root bridge is safer than a 20-year-old steel bridge.',
      checkQuestion: 'An aircraft wing is designed with a safety factor of 1.5, while a parking garage column has FoS = 3.0. Why is the aircraft allowed a lower safety factor?',
      checkAnswer: 'Three reasons: (1) Every kilogram on an aircraft increases fuel consumption over its lifetime — the cost of over-design is enormous. (2) Aircraft undergo extremely rigorous testing — every component is tested to destruction, so there\'s less uncertainty. (3) Aircraft are inspected frequently (before every flight), so degradation is caught early. A parking garage column is inspected maybe once a year and weighs nothing relative to its load. Different contexts justify different safety factors.',
      codeIntro: 'Analyze safety factors for a bridge under various loading scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Safety factor analysis for a bridge beam
# Compare different materials and loading scenarios

# Material properties
materials = {
    'Structural Steel (A36)': {'yield': 250, 'ultimate': 400, 'E': 200, 'color': '#3b82f6'},
    'Reinforced Concrete': {'yield': 30, 'ultimate': 40, 'E': 30, 'color': '#94a3b8'},
    'Douglas Fir Wood': {'yield': 35, 'ultimate': 50, 'E': 12, 'color': '#f59e0b'},
    'Ficus Root (mature)': {'yield': 10, 'ultimate': 18, 'E': 2, 'color': '#22c55e'},
    'Bamboo': {'yield': 30, 'ultimate': 45, 'E': 15, 'color': '#a855f7'},
}

# Loading scenarios (max stress in MPa at critical point)
scenarios = {
    'Dead load only': 5,
    'Dead + pedestrians': 12,
    'Dead + vehicle': 30,
    'Dead + crowd + wind': 25,
    'Extreme event (earthquake)': 50,
    'Dead + flood debris': 40,
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Safety Factor Analysis', color='white', fontsize=14, fontweight='bold')

# 1. Safety factor by material and scenario
ax = axes[0, 0]
ax.set_facecolor('#111827')

x = np.arange(len(scenarios))
width = 0.15
for idx, (mat_name, props) in enumerate(materials.items()):
    fos_values = [props['yield'] / stress for stress in scenarios.values()]
    bars = ax.bar(x + idx * width, fos_values, width, color=props['color'],
                  alpha=0.8, label=mat_name.split('(')[0].strip())
    # Mark failures
    for i, fos in enumerate(fos_values):
        if fos < 1.0:
            ax.plot(x[i] + idx * width, fos, 'x', color='white', markersize=8, zorder=5)

ax.axhline(1.0, color='#ef4444', linewidth=2, linestyle='--', label='FoS = 1 (failure)')
ax.axhline(2.0, color='#f59e0b', linewidth=1, linestyle=':', label='FoS = 2 (typical min)')
ax.set_xticks(x + width * 2)
ax.set_xticklabels(scenarios.keys(), color='white', fontsize=7, rotation=30, ha='right')
ax.set_ylabel('Safety Factor', color='white')
ax.set_title('Safety Factor by Material & Load Scenario', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7,
          loc='upper right')
ax.tick_params(colors='gray')

# 2. Safety factor over time (aging)
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')

years = np.arange(0, 150, 1)
applied_stress = 15  # typical service stress (MPa)

# Steel: starts strong, degrades
steel_strength = 250 * np.exp(-0.003 * years)
steel_fos = steel_strength / applied_stress

# Concrete: starts strong, degrades faster
concrete_strength = 30 * np.exp(-0.005 * years)
concrete_fos = concrete_strength / applied_stress

# Living root: starts weak, grows stronger
root_strength = 18 * (1 - np.exp(-0.05 * years))
root_fos = root_strength / applied_stress

ax2.plot(years, steel_fos, color='#3b82f6', linewidth=2.5, label='Steel')
ax2.plot(years, concrete_fos, color='#94a3b8', linewidth=2.5, label='Concrete')
ax2.plot(years, root_fos, color='#22c55e', linewidth=2.5, label='Living root')

ax2.axhline(1.0, color='#ef4444', linewidth=2, linestyle='--')
ax2.axhline(2.0, color='#f59e0b', linewidth=1, linestyle=':')
ax2.fill_between(years, 0, 1, alpha=0.1, color='#ef4444')
ax2.text(75, 0.5, 'FAILURE ZONE', ha='center', color='#ef4444', fontsize=10, fontweight='bold')

ax2.set_xlabel('Years', color='white')
ax2.set_ylabel('Safety Factor', color='white')
ax2.set_title('Safety Factor Over Time (Aging)', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 18)

# 3. Probability of failure vs safety factor
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')

fos_range = np.linspace(0.5, 5, 200)
# Simple model: probability of failure decreases exponentially with FoS
# Accounting for material variability (CoV = 0.1) and load variability (CoV = 0.2)
cov_strength = 0.10
cov_load = 0.20

# Using reliability index: β = (mean_strength - mean_load) / sqrt(σ_s² + σ_l²)
# P_failure ≈ Φ(-β)
from math import erfc, sqrt
def p_failure(fos, cov_s=0.10, cov_l=0.20):
    beta = (fos - 1) / sqrt((fos * cov_s)**2 + cov_l**2)
    return 0.5 * erfc(beta / sqrt(2))

pf = np.array([p_failure(f) for f in fos_range])

ax3.semilogy(fos_range, pf, color='#ef4444', linewidth=2.5)

# Mark typical FoS values
fos_marks = {'Aircraft (1.5)': 1.5, 'Bridge (2.5)': 2.5, 'Nuclear (4.0)': 4.0}
for label, fos_val in fos_marks.items():
    pf_val = p_failure(fos_val)
    ax3.plot(fos_val, pf_val, 'o', color='#f59e0b', markersize=8, zorder=5)
    ax3.annotate(f'{label}\\\nPf={pf_val:.1e}', xy=(fos_val, pf_val),
                xytext=(fos_val + 0.2, pf_val * 5),
                color='#f59e0b', fontsize=8,
                arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax3.set_xlabel('Safety Factor', color='white')
ax3.set_ylabel('Probability of Failure', color='white')
ax3.set_title('Probability of Failure vs Safety Factor', color='white', fontsize=11)
ax3.tick_params(colors='gray')
ax3.set_ylim(1e-10, 1)

# 4. Cost vs safety factor trade-off
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')

fos_design = np.linspace(1.0, 5.0, 100)
# Construction cost scales roughly linearly with FoS
construction_cost = 100 * fos_design
# Risk cost (expected loss) decreases with FoS
consequence = 10000  # cost of failure
risk_cost = np.array([consequence * p_failure(f) for f in fos_design])
# Total cost
total_cost = construction_cost + risk_cost * 1e6  # scale risk cost

ax4.plot(fos_design, construction_cost, color='#3b82f6', linewidth=2, label='Construction cost')
ax4.plot(fos_design, risk_cost * 1e6, color='#ef4444', linewidth=2, label='Expected failure cost')
ax4.plot(fos_design, total_cost, color='#f59e0b', linewidth=2.5, label='Total cost')

# Optimal FoS
optimal_idx = np.argmin(total_cost)
ax4.plot(fos_design[optimal_idx], total_cost[optimal_idx], 'o', color='#22c55e',
         markersize=12, zorder=5)
ax4.annotate(f'Optimal FoS = {fos_design[optimal_idx]:.1f}',
             xy=(fos_design[optimal_idx], total_cost[optimal_idx]),
             xytext=(fos_design[optimal_idx] + 0.5, total_cost[optimal_idx] + 50),
             color='#22c55e', fontsize=10, fontweight='bold',
             arrowprops=dict(arrowstyle='->', color='#22c55e'))

ax4.set_xlabel('Safety Factor', color='white')
ax4.set_ylabel('Cost (relative units)', color='white')
ax4.set_title('Cost Optimization: Finding the Best Safety Factor', color='white', fontsize=11)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Engineering truth: safety costs money, but failure costs more.")
print(f"\\\nOptimal safety factor (this scenario): {fos_design[optimal_idx]:.1f}")
print(f"Probability of failure at FoS=2.5: {p_failure(2.5):.2e}")
print(f"Probability of failure at FoS=1.5: {p_failure(1.5):.2e}")
print(f"\\\nThat's a {p_failure(1.5)/p_failure(2.5):.0f}x higher chance of failure")
print("— which is why bridges use FoS=2.5, not 1.5.")`,
      challenge: 'Change the material variability (cov_strength) from 0.10 to 0.20 — representing a less controlled manufacturing process. How does this shift the optimal safety factor? What does this tell you about quality control?',
      successHint: 'Safety factors are where engineering meets economics, ethics, and statistics. The "right" safety factor balances cost against risk, and that balance depends on consequences: a footbridge over a garden stream needs less FoS than a highway bridge over a populated area.',
    },
    {
      title: 'Material testing — stress-strain curves for different materials',
      concept: `The **stress-strain curve** is the fingerprint of a material. It tells you everything about how the material behaves under load: how stiff it is, when it starts to permanently deform, how much it can stretch before breaking, and how much energy it absorbs.

To create one, you take a sample, pull it (or compress it) while measuring the force and elongation, and plot stress (force/area) vs. strain (elongation/original length).

Key features of a stress-strain curve:

**Linear elastic region**: Stress and strain are proportional. The slope is **Young's modulus** (E). Remove the load, and the material returns to its original shape. Like a spring.

**Yield point**: The stress at which the material begins to **permanently deform**. Below yield, it's elastic (springs back). Above yield, it's plastic (stays deformed). The yield stress is what engineers design to — not the ultimate stress.

**Strain hardening**: After yielding, many metals get temporarily stronger as the crystal structure rearranges. The stress keeps rising even though the material is permanently deforming.

**Ultimate tensile strength (UTS)**: The maximum stress the material can sustain. After this point, the material "necks" (thins at one spot) and weakens rapidly.

**Fracture**: The material breaks. **Ductile** materials (steel, copper) stretch a lot before breaking — giving warning. **Brittle** materials (concrete, glass, cast iron) break suddenly with little stretching — no warning. This is why steel is preferred for bridges: if overloaded, it bends visibly before failing. Concrete just snaps.`,
      analogy: 'Pull a rubber band slowly. At first, it stretches proportionally to how hard you pull (elastic region). At some point, it starts to feel "different" — looser, less springy (yield point). Keep pulling and it gets thin in one spot (necking). Then it snaps (fracture). You just performed a stress-strain test. The rubber band\'s behavior from start to snap IS its stress-strain curve.',
      storyConnection: 'The roots of Ficus elastica have an unusual stress-strain curve: they are relatively flexible when young (low E, high strain at failure — they can bend without breaking) and become stiffer as they mature (higher E, more lignin). This biological adaptation is perfect for bridge construction: flexible roots can be guided into position, and they stiffen once locked in. No synthetic material changes its stress-strain curve over time like this.',
      checkQuestion: 'A structural engineer is choosing between two steels for a bridge in an earthquake zone. Steel A has yield stress 350 MPa and 5% elongation at fracture. Steel B has yield stress 250 MPa and 25% elongation. Which is better for earthquake resistance, and why?',
      checkAnswer: 'Steel B, despite its lower yield stress. In an earthquake, the bridge will experience extreme deformations. Steel B can stretch 25% before breaking — it absorbs enormous energy through plastic deformation. Steel A would reach its 5% elongation limit and fracture suddenly. For earthquake resistance, ductility (ability to deform without breaking) matters more than raw strength.',
      codeIntro: 'Generate and analyze stress-strain curves for bridge materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def steel_curve(strain, E=200e3, fy=250, fu=400, ey=None, eu=0.15, ef=0.25):
    """Generate steel stress-strain curve (MPa units)."""
    if ey is None:
        ey = fy / E
    stress = np.zeros_like(strain)
    # Elastic
    mask_e = strain <= ey
    stress[mask_e] = E * strain[mask_e]
    # Yield plateau
    esh = ey * 10  # start of strain hardening
    mask_y = (strain > ey) & (strain <= esh)
    stress[mask_y] = fy
    # Strain hardening
    mask_h = (strain > esh) & (strain <= eu)
    stress[mask_h] = fy + (fu - fy) * ((strain[mask_h] - esh) / (eu - esh)) ** 0.5
    # Necking to fracture
    mask_n = (strain > eu) & (strain <= ef)
    stress[mask_n] = fu * (1 - 2 * ((strain[mask_n] - eu) / (ef - eu)) ** 2)
    # Beyond fracture
    stress[strain > ef] = 0
    return stress

def concrete_curve(strain, fc=40, ec=0.002, eu=0.003):
    """Concrete stress-strain (compression, MPa)."""
    stress = np.zeros_like(strain)
    mask_asc = strain <= ec
    stress[mask_asc] = fc * (2 * strain[mask_asc] / ec - (strain[mask_asc] / ec) ** 2)
    mask_desc = (strain > ec) & (strain <= eu)
    stress[mask_desc] = fc * (1 - 0.5 * (strain[mask_desc] - ec) / (eu - ec))
    stress[strain > eu] = 0
    return stress

def wood_curve(strain, E=12e3, fy=35, fu=50, ef=0.015):
    """Wood stress-strain (along grain, MPa)."""
    ey = fy / E
    stress = np.zeros_like(strain)
    mask_e = strain <= ey
    stress[mask_e] = E * strain[mask_e]
    mask_p = (strain > ey) & (strain <= ef)
    stress[mask_p] = fy + (fu - fy) * ((strain[mask_p] - ey) / (ef - ey)) ** 0.3
    stress[strain > ef] = 0
    return stress

def root_curve(strain, E_young=500, E_mature=2000, fy=10, fu=18, ef=0.08):
    """Ficus root stress-strain (estimated, MPa). Two curves: young and mature."""
    ey_y = fy / E_young
    ey_m = fy / E_mature
    young = np.zeros_like(strain)
    mature = np.zeros_like(strain)
    # Young root (flexible)
    mask = strain <= ey_y
    young[mask] = E_young * strain[mask]
    mask2 = (strain > ey_y) & (strain <= ef)
    young[mask2] = fy + (fu - fy) * ((strain[mask2] - ey_y) / (ef - ey_y)) ** 0.5
    young[strain > ef] = 0
    # Mature root (stiffer)
    mask = strain <= ey_m
    mature[mask] = E_mature * strain[mask]
    mask2 = (strain > ey_m) & (strain <= ef * 0.6)
    mature[mask2] = fy + (fu * 1.3 - fy) * ((strain[mask2] - ey_m) / (ef * 0.6 - ey_m)) ** 0.4
    mature[strain > ef * 0.6] = 0
    return young, mature

# Generate curves
strain = np.linspace(0, 0.30, 1000)
strain_concrete = np.linspace(0, 0.004, 500)
strain_wood = np.linspace(0, 0.02, 500)
strain_root = np.linspace(0, 0.10, 500)

steel_stress = steel_curve(strain)
concrete_stress = concrete_curve(strain_concrete)
wood_stress = wood_curve(strain_wood)
root_young, root_mature = root_curve(strain_root)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Stress-Strain Curves for Bridge Materials', color='white',
             fontsize=14, fontweight='bold')

# 1. Steel
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(strain * 100, steel_stress, color='#3b82f6', linewidth=2.5)
ax.axhline(250, color='#f59e0b', linewidth=1, linestyle=':', alpha=0.5)
ax.text(10, 260, 'Yield (250 MPa)', color='#f59e0b', fontsize=8)
ax.axhline(400, color='#ef4444', linewidth=1, linestyle=':', alpha=0.5)
ax.text(10, 410, 'Ultimate (400 MPa)', color='#ef4444', fontsize=8)
# Mark regions
ax.annotate('Elastic', xy=(0.05, 125), color='#22c55e', fontsize=9, fontweight='bold')
ax.annotate('Yield\\\nplateau', xy=(0.5, 220), color='#f59e0b', fontsize=8)
ax.annotate('Strain\\\nhardening', xy=(5, 350), color='#a855f7', fontsize=8)
ax.annotate('Necking', xy=(17, 300), color='#ef4444', fontsize=8)
ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Structural Steel (A36)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 2. Concrete
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(strain_concrete * 100, concrete_stress, color='#94a3b8', linewidth=2.5)
ax.axhline(40, color='#ef4444', linewidth=1, linestyle=':', alpha=0.5)
ax.text(0.15, 42, "f'c = 40 MPa", color='#ef4444', fontsize=8)
ax.annotate('Brittle failure!\\\n(no warning)', xy=(0.3, 20),
            color='#ef4444', fontsize=9, fontweight='bold')
ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Concrete (Compression)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 3. Wood
ax = axes[1, 0]
ax.set_facecolor('#111827')
ax.plot(strain_wood * 100, wood_stress, color='#f59e0b', linewidth=2.5)
ax.annotate('Fiber breakage\\\n(semi-brittle)', xy=(1.2, 30),
            color='#ef4444', fontsize=9)
ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Douglas Fir (Along Grain)', color='white', fontsize=11)
ax.tick_params(colors='gray')

# 4. Living root (young vs mature)
ax = axes[1, 1]
ax.set_facecolor('#111827')
ax.plot(strain_root * 100, root_young, color='#86efac', linewidth=2.5,
        label='Young root (5 years)')
ax.plot(strain_root * 100, root_mature, color='#166534', linewidth=2.5,
        label='Mature root (50+ years)')
ax.annotate('Flexible\\\n(easy to guide)', xy=(5, 8), color='#86efac', fontsize=9)
ax.annotate('Stiff\\\n(rigid bridge)', xy=(2, 18), color='#166534', fontsize=9)
ax.set_xlabel('Strain (%)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Ficus elastica Root (Estimated)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Key metrics
print("Material Comparison:")
print(f"{'Material':<25} {'Yield':>8} {'Ultimate':>8} {'Ductility':>10} {'E (GPa)':>8}")
print("-" * 65)
print(f"{'Structural Steel':<25} {'250':>8} {'400':>8} {'25%':>10} {'200':>8}")
print(f"{'Concrete (compression)':<25} {'30':>8} {'40':>8} {'0.3%':>10} {'30':>8}")
print(f"{'Douglas Fir':<25} {'35':>8} {'50':>8} {'1.5%':>10} {'12':>8}")
print(f"{'Ficus Root (young)':<25} {'10':>8} {'18':>8} {'8%':>10} {'0.5':>8}")
print(f"{'Ficus Root (mature)':<25} {'10':>8} {'23':>8} {'5%':>10} {'2':>8}")
print()
print("Key insight: Steel is ductile (bends before breaking = warning).")
print("Concrete is brittle (snaps without warning = dangerous).")
print("Living roots are moderately ductile AND self-healing — unique.")`,
      challenge: 'Calculate the area under each stress-strain curve (using np.trapz). This area represents the energy absorbed before fracture — called toughness. Which material is toughest? Which is most brittle? Why does toughness matter for bridges?',
      successHint: 'The stress-strain curve is the Rosetta Stone of materials engineering. Once you can read it, you understand why engineers choose specific materials for specific applications. The living root\'s changing curve over time is a property no synthetic material possesses.',
    },
    {
      title: 'Designing your own bridge — constraints, trade-offs, optimization',
      concept: `Real bridge design is an optimization problem with competing constraints. You never get to maximize everything — you have to choose what matters most and accept trade-offs.

The design process:
1. **Define requirements**: span length, load capacity, clearance below, design life, aesthetics
2. **Identify constraints**: budget, available materials, construction time, environmental regulations, site conditions
3. **Generate alternatives**: consider multiple bridge types and materials
4. **Analyze each alternative**: calculate forces, deflections, safety factors
5. **Evaluate trade-offs**: cost vs. durability, speed vs. sustainability, strength vs. weight
6. **Select and refine**: choose the best overall solution and optimize details

The objective function might be: minimize total lifecycle cost (construction + maintenance + eventual demolition) while satisfying all structural requirements and constraints.

For a living root bridge, the constraints are different:
- Construction time: 15-30 years (vs. 1-3 years for conventional)
- Span limit: ~50m (vs. 2000m for suspension)
- Load limit: pedestrian only (no vehicles)
- Maintenance: nearly zero over centuries
- Carbon footprint: negative (absorbs CO2)
- Lifespan: 500+ years

The "best" bridge depends entirely on your time horizon, your values, and your constraints. Modern engineers are beginning to realize that the Khasi optimization — patience in exchange for permanence — may be more rational than our optimization of speed in exchange for planned obsolescence.`,
      analogy: 'Designing a bridge is like planning a meal for 100 guests. You must balance taste (performance), cost (budget), preparation time (construction time), dietary restrictions (constraints), and nutrition (long-term value). You can\'t serve filet mignon on a soup kitchen budget. You can\'t serve a five-course meal in 10 minutes. Design is about finding the best possible meal given your specific constraints.',
      storyConnection: 'The Khasi bridge builders solved an optimization problem that modern engineers are only beginning to formalize: how do you build infrastructure for a community that needs it to last forever, using only local materials and no external energy? Their solution — grow it — is elegant precisely because it respects constraints that Western engineering has historically ignored: sustainability, self-repair, and multi-century lifespans.',
      checkQuestion: 'You need a 20-meter pedestrian bridge over a river in rural Meghalaya. Option A: steel truss (built in 6 months, lasts 50 years, costs $50,000). Option B: living root bridge (usable in 20 years, lasts 500+ years, costs $2,000 in labor). Which do you choose, and why?',
      checkAnswer: 'There\'s no single right answer — it depends on urgency. If people need to cross now (medical access, school), Option A wins despite higher lifecycle cost. If the community can wait (alternate route exists), Option B is dramatically cheaper per year of service ($4/year vs $1,000/year) and is carbon-negative. The best answer might be both: build a temporary bamboo bridge now, start growing the root bridge immediately, and remove the bamboo bridge when the root bridge matures.',
      codeIntro: 'Build a bridge design optimizer that evaluates trade-offs across multiple criteria.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bridge Design Optimizer
# Compare designs across multiple weighted criteria

# Design alternatives
designs = {
    'Steel Truss': {
        'span_capacity': 9,    # /10
        'load_capacity': 10,
        'construction_speed': 8,
        'initial_cost': 3,     # lower = more expensive, inverted
        'maintenance_cost': 4,
        'lifespan': 4,
        'sustainability': 2,
        'self_repair': 0,
        'aesthetics': 5,
        'local_materials': 2,
    },
    'Reinforced Concrete': {
        'span_capacity': 7,
        'load_capacity': 9,
        'construction_speed': 6,
        'initial_cost': 5,
        'maintenance_cost': 5,
        'lifespan': 5,
        'sustainability': 2,
        'self_repair': 0,
        'aesthetics': 4,
        'local_materials': 4,
    },
    'Living Root Bridge': {
        'span_capacity': 3,
        'load_capacity': 4,
        'construction_speed': 1,
        'initial_cost': 9,
        'maintenance_cost': 10,
        'lifespan': 10,
        'sustainability': 10,
        'self_repair': 10,
        'aesthetics': 9,
        'local_materials': 10,
    },
    'Bamboo Suspension': {
        'span_capacity': 5,
        'load_capacity': 5,
        'construction_speed': 9,
        'initial_cost': 8,
        'maintenance_cost': 3,
        'lifespan': 2,
        'sustainability': 8,
        'self_repair': 2,
        'aesthetics': 7,
        'local_materials': 9,
    },
    'Cable-Stayed Steel': {
        'span_capacity': 10,
        'load_capacity': 10,
        'construction_speed': 5,
        'initial_cost': 1,
        'maintenance_cost': 3,
        'lifespan': 6,
        'sustainability': 1,
        'self_repair': 0,
        'aesthetics': 8,
        'local_materials': 1,
    },
}

criteria = list(list(designs.values())[0].keys())
design_names = list(designs.keys())

# Three different stakeholder weight profiles
weight_profiles = {
    'Speed-focused\\\n(Emergency)': {
        'span_capacity': 0.1, 'load_capacity': 0.15, 'construction_speed': 0.25,
        'initial_cost': 0.15, 'maintenance_cost': 0.05, 'lifespan': 0.05,
        'sustainability': 0.05, 'self_repair': 0.05, 'aesthetics': 0.05,
        'local_materials': 0.10,
    },
    'Cost-focused\\\n(Budget)': {
        'span_capacity': 0.05, 'load_capacity': 0.10, 'construction_speed': 0.10,
        'initial_cost': 0.20, 'maintenance_cost': 0.20, 'lifespan': 0.15,
        'sustainability': 0.05, 'self_repair': 0.05, 'aesthetics': 0.02,
        'local_materials': 0.08,
    },
    'Sustainability\\\n(Long-term)': {
        'span_capacity': 0.05, 'load_capacity': 0.05, 'construction_speed': 0.02,
        'initial_cost': 0.05, 'maintenance_cost': 0.10, 'lifespan': 0.20,
        'sustainability': 0.20, 'self_repair': 0.15, 'aesthetics': 0.08,
        'local_materials': 0.10,
    },
}

fig, axes = plt.subplots(2, 2, figsize=(15, 11))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Bridge Design Optimization: Trade-offs & Priorities',
             color='white', fontsize=14, fontweight='bold')

design_colors = {
    'Steel Truss': '#3b82f6',
    'Reinforced Concrete': '#94a3b8',
    'Living Root Bridge': '#22c55e',
    'Bamboo Suspension': '#f59e0b',
    'Cable-Stayed Steel': '#a855f7',
}

# 1. Raw scores heatmap
ax = axes[0, 0]
ax.set_facecolor('#111827')
score_matrix = np.array([[designs[d][c] for c in criteria] for d in design_names])
im = ax.imshow(score_matrix, cmap='RdYlGn', aspect='auto', vmin=0, vmax=10)
ax.set_xticks(range(len(criteria)))
ax.set_xticklabels([c.replace('_', '\\\n') for c in criteria], color='white',
                    fontsize=7, rotation=45, ha='right')
ax.set_yticks(range(len(design_names)))
ax.set_yticklabels(design_names, color='white', fontsize=9)
ax.set_title('Raw Scores (0-10)', color='white', fontsize=11)
# Add text annotations
for i in range(len(design_names)):
    for j in range(len(criteria)):
        ax.text(j, i, f'{score_matrix[i,j]}', ha='center', va='center',
                color='black' if score_matrix[i,j] > 4 else 'white', fontsize=8)

# 2. Weighted scores by stakeholder
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')

x = np.arange(len(design_names))
width = 0.25
for idx, (profile_name, weights) in enumerate(weight_profiles.items()):
    weighted_scores = []
    for d_name in design_names:
        score = sum(designs[d_name][c] * weights[c] for c in criteria)
        weighted_scores.append(score)
    bars = ax2.bar(x + idx * width, weighted_scores, width,
                   label=profile_name, alpha=0.8,
                   color=['#ef4444', '#f59e0b', '#22c55e'][idx])
    # Mark winner
    winner_idx = np.argmax(weighted_scores)
    ax2.text(x[winner_idx] + idx * width, weighted_scores[winner_idx] + 0.1,
             '*', ha='center', color='white', fontsize=16, fontweight='bold')

ax2.set_xticks(x + width)
ax2.set_xticklabels(design_names, color='white', fontsize=8, rotation=20, ha='right')
ax2.set_ylabel('Weighted Score', color='white')
ax2.set_title('Winner Depends on Priorities (* = best)', color='white', fontsize=11)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.tick_params(colors='gray')

# 3. Lifecycle cost comparison
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')

years = np.arange(0, 301)
lifecycle_costs = {}

# Steel truss
cost = np.zeros_like(years, dtype=float)
cost[0] = 100  # construction
cost += 3      # annual maintenance
cost[np.arange(0, 301, 50)[1:]] += 40  # major repairs every 50 years
lifecycle_costs['Steel Truss'] = np.cumsum(cost)

# Concrete
cost = np.zeros_like(years, dtype=float)
cost[0] = 80
cost += 2
cost[np.arange(0, 301, 60)[1:]] += 50
lifecycle_costs['Reinforced Concrete'] = np.cumsum(cost)

# Living root
cost = np.zeros_like(years, dtype=float)
cost[:25] = 2   # labor for root guidance
cost[25:] = 0.3  # minimal upkeep
lifecycle_costs['Living Root Bridge'] = np.cumsum(cost)

# Bamboo
cost = np.zeros_like(years, dtype=float)
cost[0] = 15
cost += 5  # frequent replacement
cost[np.arange(0, 301, 10)[1:]] += 15  # rebuild every 10 years
lifecycle_costs['Bamboo Suspension'] = np.cumsum(cost)

for name, costs in lifecycle_costs.items():
    ax3.plot(years, costs, color=design_colors[name], linewidth=2.5, label=name)

ax3.set_xlabel('Years', color='white')
ax3.set_ylabel('Cumulative Cost (relative units)', color='white')
ax3.set_title('300-Year Lifecycle Cost', color='white', fontsize=11)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax3.tick_params(colors='gray')

# 4. Pareto frontier: cost vs lifespan
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')

initial_costs = [100, 80, 50, 15, 200]  # relative
lifespans = [75, 80, 500, 10, 100]  # years
load_caps = [100, 90, 30, 25, 120]  # relative

for i, name in enumerate(design_names):
    ax4.scatter(initial_costs[i], lifespans[i], s=load_caps[i] * 5,
                color=design_colors[name], alpha=0.7, zorder=5,
                edgecolors='white', linewidth=1)
    ax4.annotate(name, xy=(initial_costs[i], lifespans[i]),
                xytext=(initial_costs[i] + 5, lifespans[i] + 15),
                color=design_colors[name], fontsize=9,
                arrowprops=dict(arrowstyle='->', color=design_colors[name], lw=0.8))

# Pareto frontier
pareto_x = [15, 50, 80]
pareto_y = [10, 500, 80]
ax4.plot([15, 50], [10, 500], '--', color='gray', alpha=0.5)
ax4.text(30, 250, 'Pareto\\\nfrontier', color='gray', fontsize=9, rotation=70)

ax4.set_xlabel('Initial Cost (relative)', color='white')
ax4.set_ylabel('Lifespan (years)', color='white')
ax4.set_title('Cost vs Lifespan (bubble size = load capacity)', color='white', fontsize=11)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("DESIGN OPTIMIZATION RESULTS:")
print("=" * 60)
for profile_name, weights in weight_profiles.items():
    scores = {}
    for d_name in design_names:
        scores[d_name] = sum(designs[d_name][c] * weights[c] for c in criteria)
    winner = max(scores, key=scores.get)
    print(f"\\\n{profile_name.replace(chr(10), ' ')}:")
    for d_name in sorted(scores, key=scores.get, reverse=True):
        marker = " <-- WINNER" if d_name == winner else ""
        print(f"  {d_name:<25} {scores[d_name]:.2f}{marker}")

print("\\\n" + "=" * 60)
print("The living root bridge wins on sustainability and long-term cost.")
print("Steel wins on speed and load capacity.")
print("There is no universally 'best' bridge — only the best bridge")
print("for your specific constraints, values, and time horizon.")`,
      challenge: 'Create your own weight profile — what matters most to YOU? Adjust the weights (they must sum to 1.0) and see which bridge wins. Then add a 6th design of your own invention (perhaps a hybrid: steel cables with living root deck?) and score it.',
      successHint: 'You\'ve completed Level 2. You can now draw free body diagrams, calculate deflections, analyze trusses, apply safety factors, read stress-strain curves, and optimize designs under constraints. You\'ve also seen that the living root bridges of Meghalaya are not primitive relics — they are sophisticated engineering solutions optimized for a different set of constraints than modern bridges. The best engineers don\'t just calculate; they question assumptions about what "best" means.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Structural Engineering — basic algebra and comfort with Level 1 concepts recommended</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for structural analysis and design optimization. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
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
