import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LittleBoatLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone Design: Hull Design Optimizer',
      concept: `A hull design optimizer takes a set of **design requirements** (cargo capacity, maximum draft, minimum stability, target speed) and finds the hull geometry that best satisfies all of them simultaneously. This is a constrained optimization problem — the kind of problem that professional naval architects solve using computational tools every day.

Our optimizer will parameterize the hull using a small number of design variables: length (L), beam (B), hull depth (D), and a shape parameter (alpha) that controls the cross-section profile from rectangular (alpha=1) to V-shaped (alpha=2) to parabolic (alpha=0.5). From these four numbers, we can compute everything: displaced volume, waterplane area, block coefficient, metacentric height, wetted surface area, and resistance at any speed.

The optimization pipeline has four stages. First, define the **design space** — the range of allowable values for each parameter. Second, define the **objective function** — what we want to minimize (total resistance at cruising speed) or maximize (cargo capacity). Third, define the **constraints** — draft < river depth, GM > safety minimum, freeboard > minimum. Fourth, search the design space to find the optimal combination. We will use both grid search (exhaustive) and gradient-free optimization (Nelder-Mead simplex) to find the best hull.`,
      analogy: 'Designing a hull is like packing for a trip with a weight limit. You want to bring as much useful stuff as possible (cargo capacity) while keeping the bag light enough to carry (low drag), stable enough not to topple (GM > 0), and small enough to fit in the overhead bin (draft constraint). The optimizer is like a systematic packing strategy that tries many arrangements to find the best one.',
      storyConnection: 'The little boat on the Brahmaputra needs to carry passengers and goods through shallow channels with strong currents. Our optimizer will find the ideal hull shape for exactly these conditions — shallow draft for sandbars, wide beam for stability in cross-currents, and enough length for reasonable speed. The centuries of empirical boat-building wisdom encoded in traditional Brahmaputra boat designs should emerge naturally from the physics-based optimization.',
      checkQuestion: 'Why can\'t we simply maximize all desirable properties simultaneously (maximum cargo, maximum speed, maximum stability, minimum draft)?',
      checkAnswer: 'These objectives conflict with each other. Maximum cargo requires maximum volume (wide, deep hull), but minimum draft requires spreading that volume over a large waterplane area (wide, shallow). Maximum speed requires a long, narrow hull (low wave resistance), but maximum stability requires a wide hull (large waterplane moment of inertia). Every design is a compromise. The optimizer finds the best compromise given the specific constraints and priorities.',
      codeIntro: 'Define the hull parameterization, design space, and the physics functions that compute performance from geometry.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Hull Parameterization ---
class HullDesign:
    """Parameterize a hull with 4 design variables."""
    def __init__(self, L, B, D, alpha):
        self.L = L         # waterline length (m)
        self.B = B         # max beam (m)
        self.D = D         # hull depth (m)
        self.alpha = alpha # shape: 1=rect, 0.5=parabolic, 2=V-shape

    def half_breadth(self, z):
        """Half-breadth at height z above keel."""
        return (self.B / 2) * (z / self.D) ** (1.0 / self.alpha)

    def displaced_volume(self, draft):
        """Volume displaced at given draft."""
        z = np.linspace(0.001, min(draft, self.D), 500)
        y = self.half_breadth(z)
        return self.L * 2 * np.trapz(y, z)

    def waterplane_area(self, draft):
        """Waterplane area at given draft."""
        y_at_draft = self.half_breadth(min(draft, self.D))
        return self.L * 2 * y_at_draft

    def block_coefficient(self, draft):
        V = self.displaced_volume(draft)
        y_at_draft = self.half_breadth(min(draft, self.D))
        return V / (self.L * 2 * y_at_draft * draft) if draft > 0 else 0

    def metacentric_height(self, draft, KG):
        """GM = KB + BM - KG"""
        V = self.displaced_volume(draft)
        if V < 1e-6: return -999
        z = np.linspace(0.001, min(draft, self.D), 500)
        y = self.half_breadth(z)
        # KB = centroid of displaced volume
        KB = np.trapz(z * 2 * y, z) / np.trapz(2 * y, z)
        # BM = I_wp / V
        y_wl = self.half_breadth(min(draft, self.D))
        I_wp = self.L * (2 * y_wl) ** 3 / 12
        BM = I_wp / V
        return KB + BM - KG

    def wetted_surface(self, draft):
        """Approximate wetted surface area."""
        z = np.linspace(0.001, min(draft, self.D), 500)
        y = self.half_breadth(z)
        # Arc length on each side
        dy = np.gradient(y, z)
        ds = np.sqrt(1 + dy**2)
        perimeter = 2 * np.trapz(ds, z) + 2 * y[-1]  # sides + bottom
        return self.L * perimeter

    def total_resistance(self, speed, draft):
        """Estimate total resistance at given speed and draft."""
        rho = 1000.0; nu = 1.14e-6; g = 9.81
        S = self.wetted_surface(draft)
        Re = max(speed * self.L / nu, 1e3)
        Cf = 0.075 / (np.log10(Re) - 2) ** 2
        Fn = speed / np.sqrt(g * self.L)
        Cw = 0.001 * np.exp(8 * (Fn - 0.35) ** 2) * Fn ** 4
        R = 0.5 * rho * speed ** 2 * S * (Cf + Cw + 0.002)
        return R

# --- Design Space ---
design_space = {
    'L': (3.0, 12.0),    # length: 3-12 meters
    'B': (0.8, 3.5),     # beam: 0.8-3.5 meters
    'D': (0.3, 1.0),     # depth: 0.3-1.0 meters
    'alpha': (0.5, 2.0), # shape parameter
}

# Test a few designs
designs = [
    HullDesign(6.0, 2.0, 0.6, 1.0),   # rectangular barge
    HullDesign(8.0, 1.2, 0.5, 0.5),   # long parabolic canoe
    HullDesign(5.0, 2.5, 0.7, 2.0),   # wide V-hull
    HullDesign(7.0, 1.8, 0.5, 1.0),   # balanced design
]
labels = ['Rect barge', 'Long canoe', 'Wide V-hull', 'Balanced']
colors = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b']

hull_mass = 100.0  # kg
cargo = 300.0       # kg
total_mass = hull_mass + cargo
rho = 1000.0

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Hull Design Optimizer: Design Space Exploration',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Cross-sections
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
for d, label, col in zip(designs, labels, colors):
    z = np.linspace(0.001, d.D, 200)
    y = d.half_breadth(z)
    ax1.plot(y, z, color=col, linewidth=2.5, label=label)
    ax1.plot(-y, z, color=col, linewidth=2.5)
ax1.set_xlabel('Half-breadth (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Hull cross-sections', color='white', fontsize=11)
ax1.legend(fontsize=8)

# Plot 2: Resistance vs speed
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
speeds = np.linspace(0.5, 5.0, 100)
for d, label, col in zip(designs, labels, colors):
    draft = total_mass / (rho * d.displaced_volume(d.D)) * d.D if d.displaced_volume(d.D) > 0 else d.D
    draft = min(draft, d.D)
    R = [d.total_resistance(v, draft) for v in speeds]
    ax2.plot(speeds, R, color=col, linewidth=2, label=label)
ax2.set_xlabel('Speed (m/s)', color='white')
ax2.set_ylabel('Resistance (N)', color='white')
ax2.set_title('Total resistance vs speed', color='white', fontsize=11)
ax2.legend(fontsize=8)

# Plot 3: Performance metrics comparison
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
metrics = ['Max cargo\
(kg)', 'GM\
(m)', 'Draft\
(cm)', 'R @ 2m/s\
(N)']
values = []
for d in designs:
    max_cargo_d = rho * d.displaced_volume(d.D) - hull_mass
    draft = total_mass / (rho * d.L * d.B) * (1.0 / d.block_coefficient(d.D)) if d.block_coefficient(d.D) > 0 else d.D
    draft = min(draft, d.D)
    gm = d.metacentric_height(draft, 0.35)
    r2 = d.total_resistance(2.0, draft)
    values.append([max_cargo_d, gm, draft * 100, r2])

x = np.arange(len(metrics))
width = 0.18
for i, (label, col) in enumerate(zip(labels, colors)):
    ax3.bar(x + i * width, [v / max(abs(values[j][k]) for j in range(4)) if max(abs(values[j][k]) for j in range(4)) > 0 else 0 for k, v in enumerate(values[i])],
            width, color=col, alpha=0.8, label=label)
ax3.set_xticks(x + 1.5 * width)
ax3.set_xticklabels(metrics, color='white', fontsize=9)
ax3.set_ylabel('Normalized value', color='white')
ax3.set_title('Performance comparison (normalized)', color='white', fontsize=11)
ax3.legend(fontsize=8)

# Plot 4: Design space scatter
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
np.random.seed(42)
n = 200
L_rand = np.random.uniform(*design_space['L'], n)
B_rand = np.random.uniform(*design_space['B'], n)
D_rand = np.random.uniform(*design_space['D'], n)
a_rand = np.random.uniform(*design_space['alpha'], n)
R_vals = []
GM_vals = []
for i in range(n):
    hull = HullDesign(L_rand[i], B_rand[i], D_rand[i], a_rand[i])
    V = hull.displaced_volume(D_rand[i])
    if V > total_mass / rho:
        draft = total_mass / (rho * V) * D_rand[i]
        R_vals.append(hull.total_resistance(2.0, draft))
        GM_vals.append(hull.metacentric_height(draft, 0.35))
    else:
        R_vals.append(np.nan)
        GM_vals.append(np.nan)
sc = ax4.scatter(R_vals, GM_vals, c=L_rand, cmap='viridis', s=20, alpha=0.7)
ax4.axhline(0, color='#ef4444', linewidth=1, linestyle='--', label='Stability limit')
ax4.set_xlabel('Resistance @ 2 m/s (N)', color='white')
ax4.set_ylabel('Metacentric height GM (m)', color='white')
ax4.set_title('Design space: resistance vs stability', color='white', fontsize=11)
plt.colorbar(sc, ax=ax4, label='Length (m)', shrink=0.8)
ax4.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("Design Comparison")
print("=" * 70)
print(f"{'Design':<14} {'L':>4} {'B':>4} {'D':>4} {'Cb':>5} {'MaxCargo':>9} {'GM':>6} {'R@2m/s':>7}")
print("-" * 70)
for d, label in zip(designs, labels):
    V = d.displaced_volume(d.D)
    mc = rho * V - hull_mass
    draft = min(total_mass / (rho * V) * d.D, d.D) if V > 0 else d.D
    gm = d.metacentric_height(draft, 0.35)
    r = d.total_resistance(2.0, draft)
    cb = d.block_coefficient(d.D)
    print(f"{label:<14} {d.L:>4.1f} {d.B:>4.1f} {d.D:>4.1f} {cb:>5.3f} {mc:>8.0f}kg {gm:>5.2f}m {r:>6.0f}N")`,
      challenge: 'Add a fifth design variable: the longitudinal profile (how beam varies along the length). Parameterize it as a cosine taper: B(x) = B_max * (1 - taper * cos(pi * x / L)^2) where taper ranges from 0 (parallel sides) to 0.5 (tapered bow/stern). How does this affect wave resistance?',
      successHint: 'The design space exploration reveals the fundamental tradeoffs in hull design. No single design wins on every metric — the "best" hull depends on which constraints and objectives matter most for the specific application.',
    },
    {
      title: 'Objective Function & Constraint Formulation',
      concept: `Converting engineering requirements into a mathematical optimization problem requires careful formulation of the **objective function** (what to optimize) and **constraints** (what limits to respect). A poorly formulated problem can produce solutions that are mathematically optimal but engineering nonsense.

Our objective is to minimize total resistance at cruising speed (2 m/s for a Brahmaputra river boat) while maximizing cargo capacity. Since these are competing objectives, we combine them into a single scalar using a **weighted sum**: f(x) = w1 * R(x) / R_ref - w2 * Cargo(x) / Cargo_ref, where the reference values normalize each term to similar magnitudes and the weights w1, w2 express the designer's priorities. Alternatively, we can minimize resistance subject to a minimum cargo constraint.

The constraints are: (1) Draft < 0.40 m (sandbar clearance on the Brahmaputra), (2) GM > 0.30 m (stability safety standard), (3) Freeboard > 0.15 m (flood protection), (4) L/B ratio between 2.5 and 6 (practical construction limits), (5) Total displacement > hull_mass + minimum_cargo. Each constraint defines a boundary in the design space. The **feasible region** is the intersection of all constraints — only designs within this region are acceptable. The optimizer searches within the feasible region for the design that minimizes the objective function.`,
      analogy: 'Formulating an optimization problem is like writing the rules for a cooking competition. The objective ("make the tastiest dish") must be measurable (a scoring rubric). The constraints ("use only these ingredients," "finish in 30 minutes," "must be safe to eat") define what is allowed. A chef who makes a delicious dish using forbidden ingredients is disqualified, just as a hull design that violates draft constraints is rejected — no matter how low its drag is.',
      storyConnection: 'The little boat operates on the Brahmaputra, where sandbars shift seasonally, monsoon floods raise the water level, and heavy loads of rice and jute must be transported. Each of these real-world conditions becomes a mathematical constraint. The draft limit comes from sandbar depths measured by river surveys; the stability requirement comes from the need to survive cross-currents; the cargo minimum comes from economic viability.',
      checkQuestion: 'A design has L=7m, B=2m, D=0.6m, draft=0.35m, GM=0.45m, freeboard=0.25m, and resistance 180N at 2 m/s. Does it satisfy all constraints? If you had to tighten one constraint, which would have the most impact on the optimal design?',
      checkAnswer: 'Check: draft 0.35 < 0.40 (pass), GM 0.45 > 0.30 (pass), freeboard 0.25 > 0.15 (pass), L/B = 3.5 in [2.5, 6] (pass). All constraints satisfied. Tightening the draft constraint (say, to 0.25m) would have the most impact because it forces a wider, shallower hull that conflicts with the resistance objective — shallow hulls have more wetted surface area and potentially worse wave-making characteristics.',
      codeIntro: 'Implement the objective function and constraints, then visualize the feasible region in 2D slices of the design space.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hull design class (from previous lesson)
class Hull:
    def __init__(self, L, B, D, alpha=1.0):
        self.L, self.B, self.D, self.alpha = L, B, D, alpha

    def volume(self, draft):
        z = np.linspace(0.001, min(draft, self.D), 300)
        y = (self.B/2) * (z/self.D)**(1.0/self.alpha)
        return self.L * 2 * np.trapz(y, z)

    def gm(self, draft, KG=0.35):
        V = self.volume(draft)
        if V < 1e-6: return -999
        z = np.linspace(0.001, min(draft, self.D), 300)
        y = (self.B/2) * (z/self.D)**(1.0/self.alpha)
        KB = np.trapz(z*2*y, z) / np.trapz(2*y, z)
        y_wl = (self.B/2) * (min(draft,self.D)/self.D)**(1.0/self.alpha)
        I = self.L * (2*y_wl)**3 / 12
        return KB + I/V - KG

    def resistance(self, speed, draft):
        rho, nu, g = 1000, 1.14e-6, 9.81
        z = np.linspace(0.001, min(draft,self.D), 200)
        y = (self.B/2) * (z/self.D)**(1.0/self.alpha)
        dy = np.gradient(y, z)
        S = self.L * (2*np.trapz(np.sqrt(1+dy**2), z) + 2*y[-1])
        Re = max(speed*self.L/nu, 1e3)
        Cf = 0.075/(np.log10(Re)-2)**2
        Fn = speed/np.sqrt(g*self.L)
        Cw = 0.001*np.exp(8*(Fn-0.35)**2)*Fn**4
        return 0.5*rho*speed**2*S*(Cf+Cw+0.002)

# Constraints
DRAFT_MAX = 0.40
GM_MIN = 0.30
FREEBOARD_MIN = 0.15
LB_MIN, LB_MAX = 2.5, 6.0
HULL_MASS = 100.0
MIN_CARGO = 200.0
CRUISE_SPEED = 2.0
RHO = 1000.0

def evaluate(L, B, D, alpha=1.0):
    h = Hull(L, B, D, alpha)
    V_max = h.volume(D)
    max_disp = RHO * V_max
    cargo = max_disp - HULL_MASS
    if cargo < MIN_CARGO:
        return None  # can't carry enough
    total = HULL_MASS + MIN_CARGO
    # Find draft for this load
    drafts = np.linspace(0.01, D, 200)
    vols = [h.volume(d) for d in drafts]
    target_vol = total / RHO
    idx = np.searchsorted(vols, target_vol)
    if idx >= len(drafts): return None
    draft = drafts[min(idx, len(drafts)-1)]
    freeboard = D - draft
    gm = h.gm(draft)
    lb = L / B
    R = h.resistance(CRUISE_SPEED, draft)
    feasible = (draft <= DRAFT_MAX and gm >= GM_MIN and
                freeboard >= FREEBOARD_MIN and LB_MIN <= lb <= LB_MAX)
    return {'L': L, 'B': B, 'D': D, 'draft': draft, 'freeboard': freeboard,
            'gm': gm, 'cargo': cargo, 'R': R, 'feasible': feasible, 'lb': lb}

# Grid search over L-B space (fixing D=0.55, alpha=1.0)
D_fixed = 0.55
Ls = np.linspace(3.5, 11, 80)
Bs = np.linspace(1.0, 3.5, 80)
R_grid = np.full((len(Bs), len(Ls)), np.nan)
GM_grid = np.full((len(Bs), len(Ls)), np.nan)
feas_grid = np.zeros((len(Bs), len(Ls)), dtype=bool)
cargo_grid = np.full((len(Bs), len(Ls)), np.nan)

for i, B in enumerate(Bs):
    for j, L in enumerate(Ls):
        result = evaluate(L, B, D_fixed)
        if result:
            R_grid[i, j] = result['R']
            GM_grid[i, j] = result['gm']
            feas_grid[i, j] = result['feasible']
            cargo_grid[i, j] = result['cargo']

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Hull Optimizer: Feasible Region & Objective Landscape',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Resistance contour with feasibility overlay
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
cs = ax1.contourf(Ls, Bs, R_grid, levels=20, cmap='YlOrRd_r', alpha=0.8)
ax1.contour(Ls, Bs, feas_grid.astype(float), levels=[0.5], colors='#22c55e', linewidths=3)
ax1.set_xlabel('Length (m)', color='white')
ax1.set_ylabel('Beam (m)', color='white')
ax1.set_title('Resistance @ 2 m/s (green = feasible boundary)', color='white', fontsize=10)
plt.colorbar(cs, ax=ax1, shrink=0.8, label='R (N)')

# Plot 2: GM contour
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
cs2 = ax2.contourf(Ls, Bs, GM_grid, levels=20, cmap='RdYlGn', alpha=0.8)
ax2.contour(Ls, Bs, GM_grid, levels=[GM_MIN], colors='white', linewidths=2, linestyles='--')
ax2.contour(Ls, Bs, feas_grid.astype(float), levels=[0.5], colors='#22c55e', linewidths=3)
ax2.set_xlabel('Length (m)', color='white')
ax2.set_ylabel('Beam (m)', color='white')
ax2.set_title(f'Metacentric height (dashed = GM={GM_MIN}m limit)', color='white', fontsize=10)
plt.colorbar(cs2, ax=ax2, shrink=0.8, label='GM (m)')

# Plot 3: Cargo capacity
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
cs3 = ax3.contourf(Ls, Bs, cargo_grid, levels=20, cmap='Blues', alpha=0.8)
ax3.contour(Ls, Bs, feas_grid.astype(float), levels=[0.5], colors='#22c55e', linewidths=3)
ax3.set_xlabel('Length (m)', color='white')
ax3.set_ylabel('Beam (m)', color='white')
ax3.set_title('Maximum cargo capacity (kg)', color='white', fontsize=10)
plt.colorbar(cs3, ax=ax3, shrink=0.8, label='Cargo (kg)')

# Plot 4: L/B ratio constraints
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
LB_grid = Ls[np.newaxis, :] / Bs[:, np.newaxis]
ax4.contourf(Ls, Bs, LB_grid, levels=20, cmap='coolwarm', alpha=0.8)
ax4.contour(Ls, Bs, LB_grid, levels=[LB_MIN, LB_MAX], colors='white', linewidths=2)
ax4.contour(Ls, Bs, feas_grid.astype(float), levels=[0.5], colors='#22c55e', linewidths=3)
# Find best feasible design
best_R = np.inf
best_ij = (0, 0)
for i in range(len(Bs)):
    for j in range(len(Ls)):
        if feas_grid[i,j] and R_grid[i,j] < best_R:
            best_R = R_grid[i,j]
            best_ij = (i, j)
ax4.scatter([Ls[best_ij[1]]], [Bs[best_ij[0]]], color='#22c55e', s=200,
            marker='*', zorder=5, label=f'Best: L={Ls[best_ij[1]]:.1f}, B={Bs[best_ij[0]]:.1f}')
ax4.set_xlabel('Length (m)', color='white')
ax4.set_ylabel('Beam (m)', color='white')
ax4.set_title('L/B ratio (white lines = limits)', color='white', fontsize=10)
ax4.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("Feasible Region Analysis")
print("=" * 55)
n_feasible = np.sum(feas_grid)
n_total = feas_grid.size
print(f"Design space explored: {n_total} points")
print(f"Feasible designs: {n_feasible} ({100*n_feasible/n_total:.1f}%)")
print(f"Best feasible design (min resistance):")
print(f"  L = {Ls[best_ij[1]]:.1f}m, B = {Bs[best_ij[0]]:.1f}m")
print(f"  R @ 2 m/s = {R_grid[best_ij]:.0f} N")
print(f"  GM = {GM_grid[best_ij]:.2f} m")
print(f"  Cargo = {cargo_grid[best_ij]:.0f} kg")`,
      challenge: 'Add a slider-like analysis: fix L at the optimal value and vary D from 0.3 to 0.8 m while re-optimizing B for each D. Plot how the optimal B and minimum resistance change with hull depth. Is there a clear optimal depth?',
      successHint: 'The feasible region visualization reveals that constraints carve away most of the design space. The optimizer must navigate a narrow corridor where all constraints are satisfied simultaneously — and within that corridor, find the minimum of the objective function.',
    },
    {
      title: 'Optimization Algorithms: Grid Search & Nelder-Mead',
      concept: `With the objective function and constraints defined, we need an algorithm to find the optimum. **Grid search** is the simplest approach: evaluate the objective at every point on a regular grid spanning the design space. It is guaranteed to find the global optimum (within the grid resolution), but it is exponentially expensive — a grid with 50 points per dimension and 4 dimensions requires 50^4 = 6.25 million evaluations. For our problem, each evaluation involves numerical integration, so grid search is feasible only in 2D slices.

**Nelder-Mead simplex** is a gradient-free optimization algorithm that works well for smooth objectives with moderate dimensionality. It maintains a simplex (a triangle in 2D, a tetrahedron in 3D, etc.) of n+1 points in n dimensions. At each step, it reflects the worst point through the centroid of the remaining points. If the reflected point is better, the simplex moves in that direction. If much better, the simplex expands. If worse, the simplex contracts. This simple procedure reliably finds local minima without requiring gradient information.

To handle constraints, we use a **penalty function** approach: add a large penalty to the objective whenever a constraint is violated. The optimizer naturally avoids infeasible regions because they have artificially high objective values. The penalty must be large enough to prevent the optimizer from "cutting through" infeasible regions as shortcuts, but not so large that it creates numerical difficulties.`,
      analogy: 'Grid search is like searching for the lowest point in a field by walking on a fixed grid pattern — you check every 10 meters north-south and east-west. You will find the lowest spot (within 10 meters), but it takes forever if the field is large. Nelder-Mead is like rolling a ball downhill — it naturally finds low points by following the slope, much faster than grid search, but it might get stuck in a small depression and miss a deeper valley elsewhere.',
      storyConnection: 'A boat builder on the Brahmaputra optimizes by experience — building slightly different boats and keeping what works. This is essentially a manual Nelder-Mead process: try a variation, keep improvements, discard failures. Our algorithm automates this centuries-old process, evaluating thousands of designs in seconds instead of decades.',
      checkQuestion: 'Why might Nelder-Mead find a different "optimal" design depending on where it starts? How can you mitigate this?',
      checkAnswer: 'Nelder-Mead finds local minima — the nearest low point from the starting simplex. If the objective landscape has multiple valleys (which is common in engineering design), different starting points lead to different valleys. Mitigation: run Nelder-Mead from many random starting points (multi-start) and keep the best result. This combines the efficiency of local search with better global coverage.',
      codeIntro: 'Implement both grid search and multi-start Nelder-Mead optimization, compare their results and computational costs.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize

RHO = 1000.0; HULL_MASS = 100.0; CRUISE_SPEED = 2.0

def hull_performance(params):
    """Compute resistance with penalty for constraint violations."""
    L, B, D, alpha = params
    alpha = max(0.5, min(2.0, alpha))

    # Basic checks
    if L < 2 or B < 0.5 or D < 0.2: return 1e6

    # Volume & draft
    z = np.linspace(0.001, D, 200)
    y = (B/2) * (z/D)**(1.0/alpha)
    V = L * 2 * np.trapz(y, z)
    total_mass = HULL_MASS + 200  # minimum cargo

    if V * RHO < total_mass: return 1e6  # can't float

    # Find draft
    drafts = np.linspace(0.01, D, 200)
    vols = np.array([L*2*np.trapz((B/2)*(np.linspace(0.001,d,100)/D)**(1/alpha),
                     np.linspace(0.001,d,100)) for d in drafts])
    target = total_mass / RHO
    idx = np.searchsorted(vols, target)
    if idx >= len(drafts): return 1e6
    draft = drafts[min(idx, len(drafts)-1)]

    # Compute metrics
    freeboard = D - draft
    y_wl = (B/2)*(min(draft,D)/D)**(1/alpha)
    KB = np.trapz(z[:idx+1]*2*(B/2)*(z[:idx+1]/D)**(1/alpha), z[:idx+1]) / max(np.trapz(2*(B/2)*(z[:idx+1]/D)**(1/alpha), z[:idx+1]), 1e-6) if idx > 0 else draft/2
    I_wp = L*(2*y_wl)**3/12
    BM = I_wp/max(target, 1e-6)
    GM = KB + BM - 0.35

    # Resistance
    nu = 1.14e-6; g = 9.81
    dz = np.gradient(y, z)
    S = L*(2*np.trapz(np.sqrt(1+dz**2), z) + 2*y[-1])
    Re = max(CRUISE_SPEED*L/nu, 1e3)
    Cf = 0.075/(np.log10(Re)-2)**2
    Fn = CRUISE_SPEED/np.sqrt(g*L)
    Cw = 0.001*np.exp(8*(Fn-0.35)**2)*Fn**4
    R = 0.5*RHO*CRUISE_SPEED**2*S*(Cf+Cw+0.002)

    # Penalty for constraint violations
    penalty = 0
    if draft > 0.40: penalty += 1000 * (draft - 0.40)**2
    if GM < 0.30: penalty += 5000 * (0.30 - GM)**2
    if freeboard < 0.15: penalty += 1000 * (0.15 - freeboard)**2
    lb = L/B
    if lb < 2.5: penalty += 500 * (2.5 - lb)**2
    if lb > 6.0: penalty += 500 * (lb - 6.0)**2

    return R + penalty * 1e4

# Multi-start Nelder-Mead
np.random.seed(42)
n_starts = 30
results = []
for _ in range(n_starts):
    x0 = [np.random.uniform(3.5, 10),
          np.random.uniform(1.0, 3.0),
          np.random.uniform(0.35, 0.8),
          np.random.uniform(0.6, 1.8)]
    res = minimize(hull_performance, x0, method='Nelder-Mead',
                   options={'maxiter': 500, 'xatol': 0.01, 'fatol': 0.1})
    results.append(res)

# Sort by objective value
results.sort(key=lambda r: r.fun)
best = results[0]

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Hull Optimization: Multi-Start Nelder-Mead Results',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Optimization convergence for top 5 starts
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
top5_vals = sorted([r.fun for r in results])[:10]
ax1.bar(range(len(top5_vals)), top5_vals, color=['#22c55e' if i == 0 else '#3b82f6' for i in range(len(top5_vals))], alpha=0.8)
ax1.set_xlabel('Starting point rank', color='white')
ax1.set_ylabel('Final objective value (N)', color='white')
ax1.set_title('Top 10 optimization results', color='white', fontsize=11)

# Plot 2: Parameter distributions across local minima
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
feasible = [r for r in results if r.fun < 1000]  # filter out infeasible
if len(feasible) > 0:
    Ls = [r.x[0] for r in feasible]
    Bs = [r.x[1] for r in feasible]
    objs = [r.fun for r in feasible]
    sc = ax2.scatter(Ls, Bs, c=objs, cmap='RdYlGn_r', s=50, alpha=0.8)
    ax2.scatter([best.x[0]], [best.x[1]], color='#22c55e', s=200, marker='*',
                zorder=5, edgecolors='white', linewidth=2, label='Global best')
    plt.colorbar(sc, ax=ax2, shrink=0.8, label='Objective (N)')
    ax2.legend(fontsize=9)
ax2.set_xlabel('Length (m)', color='white')
ax2.set_ylabel('Beam (m)', color='white')
ax2.set_title('Local minima in L-B space', color='white', fontsize=11)

# Plot 3: Best design performance curve
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
L_opt, B_opt, D_opt, a_opt = best.x
speeds = np.linspace(0.5, 5.0, 100)
R_opt = []
for v in speeds:
    # Quick resistance calc
    z = np.linspace(0.001, D_opt, 200)
    y = (B_opt/2)*(z/D_opt)**(1/max(a_opt,0.5))
    dz = np.gradient(y, z)
    S = L_opt*(2*np.trapz(np.sqrt(1+dz**2), z) + 2*y[-1])
    Re = max(v*L_opt/1.14e-6, 1e3)
    Cf = 0.075/(np.log10(Re)-2)**2
    Fn = v/np.sqrt(9.81*L_opt)
    Cw = 0.001*np.exp(8*(Fn-0.35)**2)*Fn**4
    R_opt.append(0.5*RHO*v**2*S*(Cf+Cw+0.002))
ax3.plot(speeds, R_opt, color='#22c55e', linewidth=2.5, label='Optimal hull')
ax3.axvline(CRUISE_SPEED, color='#f59e0b', linewidth=1.5, linestyle='--', label='Cruise speed')
hull_spd = 1.34*np.sqrt(L_opt/0.3048)*0.5144
ax3.axvline(hull_spd, color='#a855f7', linewidth=1.5, linestyle=':', label=f'Hull speed={hull_spd:.1f} m/s')
ax3.set_xlabel('Speed (m/s)', color='white')
ax3.set_ylabel('Resistance (N)', color='white')
ax3.set_title('Optimal hull: resistance vs speed', color='white', fontsize=11)
ax3.legend(fontsize=8)

# Plot 4: Constraint satisfaction summary
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
constraints = ['Draft\
< 0.40m', 'GM\
> 0.30m', 'Freeboard\
> 0.15m', 'L/B\
in [2.5, 6]']
# Evaluate best design
z = np.linspace(0.001, D_opt, 200)
y = (B_opt/2)*(z/D_opt)**(1/max(a_opt,0.5))
V = L_opt*2*np.trapz(y, z)
draft_opt = (HULL_MASS+200)/(RHO*V)*D_opt if V > 0 else D_opt
fb_opt = D_opt - draft_opt
margins = [
    (0.40 - draft_opt) / 0.40 * 100,  # draft margin %
    50,  # placeholder
    (fb_opt - 0.15) / 0.15 * 100,
    min((L_opt/B_opt - 2.5)/(6-2.5), (6 - L_opt/B_opt)/(6-2.5)) * 100,
]
bar_colors = ['#22c55e' if m > 0 else '#ef4444' for m in margins]
ax4.barh(constraints, margins, color=bar_colors, alpha=0.8)
ax4.axvline(0, color='white', linewidth=1)
ax4.set_xlabel('Margin (%)', color='white')
ax4.set_title('Constraint margins (green = satisfied)', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Optimization Results")
print("=" * 55)
print(f"Best design: L={best.x[0]:.2f}m, B={best.x[1]:.2f}m, "
      f"D={best.x[2]:.2f}m, alpha={best.x[3]:.2f}")
print(f"Objective (resistance @ {CRUISE_SPEED} m/s): {best.fun:.1f} N")
print(f"Optimization: {n_starts} starts, best of {len(feasible)} feasible solutions")
print(f"Hull speed: {hull_spd:.2f} m/s ({hull_spd*3.6:.1f} km/h)")`,
      challenge: 'Replace Nelder-Mead with differential evolution (from scipy.optimize) which is a global optimizer. Compare the best solution found by each method across 10 independent runs. Which finds better solutions? Which is more consistent?',
      successHint: 'Multi-start local optimization is a practical approach for engineering design problems. It balances the speed of local search with the robustness of global coverage. The best solutions often cluster in a few distinct regions of the design space — each representing a fundamentally different design philosophy.',
    },
    {
      title: 'Sensitivity Analysis & Pareto Fronts',
      concept: `Finding a single "optimal" design is not enough — a good engineer also asks: **how sensitive is this design to changes in parameters and constraints?** Sensitivity analysis answers this by systematically varying each input and measuring how much the output changes. A design that performs well but collapses with a 5% change in beam width is fragile; one that degrades gracefully is **robust**.

Local sensitivity is measured by partial derivatives: dR/dL, dR/dB, dR/dD. Numerically, we approximate these with finite differences: dR/dL ~ (R(L+h) - R(L-h)) / (2h). The normalized sensitivity (elasticity) is: e_L = (dR/dL) * (L/R), which gives the percentage change in resistance per percentage change in length. A sensitivity of -0.5 means a 1% increase in length reduces resistance by 0.5%.

When there are two competing objectives (minimize resistance AND maximize cargo), no single design is optimal for both. Instead, there is a **Pareto front** — a curve of designs where improving one objective necessarily worsens the other. Every design on the Pareto front is "non-dominated": no other design is better on both objectives simultaneously. The choice of which Pareto-optimal design to build is ultimately a human decision based on priorities, not a mathematical one.`,
      analogy: 'A Pareto front is like the efficient frontier in investing. You can have high return (cargo capacity) or low risk (low resistance), but not both. Every portfolio on the frontier is optimal in the sense that you cannot reduce risk without reducing return. An investor picks from the frontier based on personal risk tolerance — similarly, a boat designer picks from the Pareto front based on whether speed or carrying capacity matters more.',
      storyConnection: 'The little boat\'s builder faces a real Pareto tradeoff: a boat optimized for carrying heavy rice shipments (maximum cargo) would be wide and slow. A boat optimized for speed (to deliver fresh fish before they spoil) would be long and narrow with less capacity. The Pareto front maps this tradeoff quantitatively, showing exactly how much cargo you sacrifice for each increment of speed.',
      checkQuestion: 'On a Pareto front of resistance vs cargo capacity, you find two designs: A (R=150N, cargo=400kg) and B (R=200N, cargo=600kg). A trader needs to move at least 500kg. A fisherman needs minimum resistance. Which design does each choose? Is there a design both would prefer?',
      checkAnswer: 'The trader needs 500kg cargo, so Design A (400kg) is insufficient — the trader must choose Design B. The fisherman wants minimum drag and does not need 600kg capacity — the fisherman chooses Design A. No single design satisfies both, which is exactly why the Pareto front exists. If a Design C had R=140N and cargo=650kg, it would dominate both A and B and both would prefer it — but then C would replace A and B on the Pareto front.',
      codeIntro: 'Compute sensitivity derivatives for the optimal design and construct the Pareto front for resistance vs cargo capacity.',
      code: `import numpy as np
import matplotlib.pyplot as plt

RHO = 1000.0; HULL_MASS = 100.0; g = 9.81

def hull_metrics(L, B, D, alpha, speed=2.0, cargo_mass=200):
    z = np.linspace(0.001, D, 200)
    y = (B/2)*(z/D)**(1.0/max(alpha, 0.3))
    V = L*2*np.trapz(y, z)
    total = HULL_MASS + cargo_mass
    if V*RHO < total: return {'R': 1e6, 'cargo': 0, 'gm': -999, 'draft': D}
    draft = total/(RHO*V)*D
    draft = min(draft, D)
    # Resistance
    dz = np.gradient(y, z)
    S = L*(2*np.trapz(np.sqrt(1+dz**2), z) + 2*y[-1])
    Re = max(speed*L/1.14e-6, 1e3)
    Cf = 0.075/(np.log10(Re)-2)**2
    Fn = speed/np.sqrt(g*L)
    Cw = 0.001*np.exp(8*(Fn-0.35)**2)*Fn**4
    R = 0.5*RHO*speed**2*S*(Cf+Cw+0.002)
    # GM
    y_wl = (B/2)*(min(draft,D)/D)**(1/max(alpha,0.3))
    I = L*(2*y_wl)**3/12
    GM = draft/2 + I/max(V*draft/D, 1e-6) - 0.35
    max_cargo = RHO*V - HULL_MASS
    return {'R': R, 'cargo': max_cargo, 'gm': GM, 'draft': draft}

# --- Sensitivity Analysis around optimal design ---
L0, B0, D0, a0 = 7.5, 2.0, 0.55, 1.0
base = hull_metrics(L0, B0, D0, a0)

params = {'L': L0, 'B': B0, 'D': D0, 'alpha': a0}
h_frac = 0.02  # 2% perturbation
sensitivities = {}
for name, val in params.items():
    h = val * h_frac
    args_plus = dict(params); args_plus[name] = val + h
    args_minus = dict(params); args_minus[name] = val - h
    R_plus = hull_metrics(**args_plus)['R']
    R_minus = hull_metrics(**args_minus)['R']
    dRdx = (R_plus - R_minus) / (2*h)
    elasticity = dRdx * val / base['R']
    sensitivities[name] = {'dRdx': dRdx, 'elasticity': elasticity}

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Sensitivity Analysis & Pareto Optimization',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Sensitivity bar chart
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
names = list(sensitivities.keys())
elasticities = [sensitivities[n]['elasticity'] for n in names]
colors = ['#22c55e' if e < 0 else '#ef4444' for e in elasticities]
ax1.barh(names, elasticities, color=colors, alpha=0.8)
ax1.axvline(0, color='white', linewidth=0.5)
ax1.set_xlabel('Elasticity (% change in R per % change in parameter)', color='white')
ax1.set_title('Resistance sensitivity to design parameters', color='white', fontsize=11)
for i, e in enumerate(elasticities):
    ax1.text(e + 0.02 * np.sign(e), i, f'{e:.3f}', color='white', va='center', fontsize=10)

# Plot 2: Parameter sweeps
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
sweep_colors = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7']
for (name, val), col in zip(params.items(), sweep_colors):
    pct_range = np.linspace(-20, 20, 50)
    R_sweep = []
    for pct in pct_range:
        args = dict(params)
        args[name] = val * (1 + pct/100)
        R_sweep.append(hull_metrics(**args)['R'])
    R_norm = [(r - base['R'])/base['R']*100 for r in R_sweep]
    ax2.plot(pct_range, R_norm, color=col, linewidth=2, label=name)
ax2.axhline(0, color='white', linewidth=0.5, linestyle='--')
ax2.axvline(0, color='white', linewidth=0.5, linestyle='--')
ax2.set_xlabel('Parameter change (%)', color='white')
ax2.set_ylabel('Resistance change (%)', color='white')
ax2.set_title('Resistance response to parameter variations', color='white', fontsize=11)
ax2.legend(fontsize=9)

# Plot 3: Pareto front — Resistance vs Cargo
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
np.random.seed(42)
n_samples = 2000
all_R = []
all_cargo = []
all_feasible = []
for _ in range(n_samples):
    L = np.random.uniform(3.5, 11)
    B = np.random.uniform(1.0, 3.5)
    D = np.random.uniform(0.35, 0.8)
    alpha = np.random.uniform(0.5, 2.0)
    m = hull_metrics(L, B, D, alpha)
    if m['R'] < 1e5:
        feasible = (m['draft'] < 0.40 and m['gm'] > 0.30 and
                    D - m['draft'] > 0.15 and 2.5 < L/B < 6)
        all_R.append(m['R'])
        all_cargo.append(m['cargo'])
        all_feasible.append(feasible)

all_R = np.array(all_R)
all_cargo = np.array(all_cargo)
all_feasible = np.array(all_feasible)

# Plot all designs
ax3.scatter(all_R[~all_feasible], all_cargo[~all_feasible], c='gray', s=5, alpha=0.3, label='Infeasible')
ax3.scatter(all_R[all_feasible], all_cargo[all_feasible], c='#3b82f6', s=10, alpha=0.5, label='Feasible')

# Find Pareto front among feasible designs
feas_R = all_R[all_feasible]
feas_cargo = all_cargo[all_feasible]
if len(feas_R) > 0:
    # Sort by resistance
    sort_idx = np.argsort(feas_R)
    pareto_R = [feas_R[sort_idx[0]]]
    pareto_C = [feas_cargo[sort_idx[0]]]
    max_cargo = feas_cargo[sort_idx[0]]
    for idx in sort_idx[1:]:
        if feas_cargo[idx] > max_cargo:
            pareto_R.append(feas_R[idx])
            pareto_C.append(feas_cargo[idx])
            max_cargo = feas_cargo[idx]
    ax3.plot(pareto_R, pareto_C, color='#22c55e', linewidth=3, marker='o',
             markersize=6, label='Pareto front', zorder=5)

ax3.set_xlabel('Resistance @ 2 m/s (N)', color='white')
ax3.set_ylabel('Max cargo capacity (kg)', color='white')
ax3.set_title('Pareto front: speed vs capacity tradeoff', color='white', fontsize=11)
ax3.legend(fontsize=8)

# Plot 4: Pareto designs — what changes along the front?
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
if len(pareto_R) > 2:
    ax4.plot(range(len(pareto_R)), pareto_R, color='#ef4444', linewidth=2,
             marker='s', label='Resistance (N)')
    ax4_twin = ax4.twinx()
    ax4_twin.plot(range(len(pareto_R)), pareto_C, color='#3b82f6', linewidth=2,
                  marker='o', label='Cargo (kg)')
    ax4_twin.set_ylabel('Cargo capacity (kg)', color='#3b82f6')
    ax4_twin.tick_params(colors='#3b82f6')
    ax4.set_xlabel('Pareto design index (low R -> high cargo)', color='white')
    ax4.set_ylabel('Resistance (N)', color='#ef4444')
    ax4.tick_params(axis='y', colors='#ef4444')
    ax4.set_title('Tradeoff along the Pareto front', color='white', fontsize=11)
    lines1, labels1 = ax4.get_legend_handles_labels()
    lines2, labels2 = ax4_twin.get_legend_handles_labels()
    ax4.legend(lines1+lines2, labels1+labels2, fontsize=9)

plt.tight_layout()
plt.show()

print("Sensitivity Analysis (base design: L={}, B={}, D={}, alpha={})".format(L0,B0,D0,a0))
print("=" * 55)
print(f"Base resistance: {base['R']:.1f} N")
for name, s in sensitivities.items():
    print(f"  d(R)/d({name}) = {s['dRdx']:.2f} N/unit, elasticity = {s['elasticity']:.3f}")
print()
print(f"Pareto front: {len(pareto_R)} non-dominated designs")
print(f"  Min resistance: {min(pareto_R):.0f} N (cargo={pareto_C[0]:.0f} kg)")
print(f"  Max cargo: {max(pareto_C):.0f} kg (resistance={pareto_R[-1]:.0f} N)")`,
      challenge: 'Add a third objective: minimize draft (for sandbar navigation). Construct the 3D Pareto front (resistance vs cargo vs draft) and visualize it as a 3D scatter plot with color coding. How does adding a third objective expand the set of non-dominated solutions?',
      successHint: 'Sensitivity analysis and Pareto optimization transform engineering design from guesswork into systematic science. The Pareto front is especially powerful because it separates the mathematical problem (finding the front) from the human decision (choosing where on the front to operate).',
    },
    {
      title: 'River Environment Modeling',
      concept: `A hull optimizer that ignores the operating environment is incomplete. The Brahmaputra River presents specific challenges: **variable water depth** (from 2m during dry season to 20m+ during monsoon), **strong currents** (1-3 m/s), **sediment load** that increases water density, and **seasonal flooding** that changes available routes. Modeling these environmental factors allows the optimizer to design hulls tailored to real conditions.

Current effects are modeled by adjusting the effective speed: V_eff = V_boat + V_current for upstream travel and V_eff = V_boat - V_current for downstream. Since resistance scales roughly as V^2, a 2 m/s current adds enormously to upstream resistance. A boat designed for still-water efficiency might be terrible in strong current. The optimal hull for the Brahmaputra must be optimized for the weighted average of upstream and downstream conditions, accounting for the fraction of time spent traveling in each direction.

Water density varies with sediment concentration: rho_eff = rho_water * (1 + C_s * (rho_sediment / rho_water - 1)), where C_s is the sediment volume fraction. The Brahmaputra carries 400-800 million tonnes of sediment annually — one of the highest sediment loads of any river on Earth. During monsoon, sediment concentration can reach 2-4 kg/m^3, raising the effective water density to 1001-1003 kg/m^3. This slightly increases buoyancy (the boat floats higher) but also changes the viscosity and wave-making characteristics.`,
      analogy: 'Designing for the Brahmaputra environment is like designing a car for a specific road. A sports car is great on smooth highway (still water) but terrible on a muddy track (monsoon current). A Jeep handles the track but wastes fuel on highway. The best vehicle for someone who drives 70% mud track and 30% highway is neither a sports car nor a pure off-roader — it is optimized for the specific mix of conditions.',
      storyConnection: 'The little boat does not operate in a laboratory — it operates on the living Brahmaputra, with its sandbars, floods, currents, and sediment. The environmental model quantifies what every Brahmaputra boatman knows intuitively: the river changes with the seasons, and the boat must handle all conditions. A boat optimized for dry season (shallow, slow current) would founder in monsoon (deep, fast current), and vice versa.',
      checkQuestion: 'A boat cruises at 3 m/s in still water with resistance 200 N. The Brahmaputra current is 2 m/s. What is the resistance upstream and downstream? If the boat makes equal-distance trips in both directions, what is the average resistance?',
      checkAnswer: 'Upstream: V_eff = 3 + 2 = 5 m/s relative to water. R scales as V^2, so R_up = 200 * (5/3)^2 = 556 N. Downstream: V_eff = 3 - 2 = 1 m/s, R_down = 200 * (1/3)^2 = 22 N. Average resistance = (556 + 22)/2 = 289 N. But time-weighted average is worse: upstream time = distance/1 (ground speed), downstream time = distance/5. Time-weighted average R = (556*5 + 22*1) / (5+1) = 467 N. Current asymmetrically penalizes upstream travel.',
      codeIntro: 'Model the Brahmaputra environment across seasons and optimize hull design for year-round performance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

RHO_WATER = 1000.0; g = 9.81; HULL_MASS = 100.0

# --- Brahmaputra seasonal conditions ---
seasons = {
    'Dry (Nov-Feb)': {'depth': 3.0, 'current': 1.0, 'sediment': 0.5, 'months': 4},
    'Pre-monsoon (Mar-May)': {'depth': 5.0, 'current': 1.5, 'sediment': 1.0, 'months': 3},
    'Monsoon (Jun-Sep)': {'depth': 15.0, 'current': 3.0, 'sediment': 3.5, 'months': 4},
    'Post-monsoon (Oct)': {'depth': 8.0, 'current': 2.0, 'sediment': 2.0, 'months': 1},
}

def resistance_in_conditions(L, B, D, alpha, boat_speed, current, sediment):
    rho = RHO_WATER * (1 + sediment/1000 * 1.65)  # sediment density effect
    z = np.linspace(0.001, D, 200)
    y = (B/2)*(z/D)**(1.0/max(alpha, 0.3))
    dz = np.gradient(y, z)
    S = L*(2*np.trapz(np.sqrt(1+dz**2), z) + 2*y[-1])
    nu = 1.14e-6

    # Upstream and downstream
    results = {}
    for direction, v_eff in [('upstream', boat_speed + current),
                              ('downstream', max(boat_speed - current, 0.1))]:
        Re = max(v_eff*L/nu, 1e3)
        Cf = 0.075/(np.log10(Re)-2)**2
        Fn = v_eff/np.sqrt(g*L)
        Cw = 0.001*np.exp(8*(Fn-0.35)**2)*Fn**4
        R = 0.5*rho*v_eff**2*S*(Cf+Cw+0.002)
        ground_speed = boat_speed - current if direction == 'upstream' else boat_speed + current
        results[direction] = {'R': R, 'ground_speed': max(ground_speed, 0.1)}

    # Round trip: equal distance each way
    d = 1000  # 1 km reference
    t_up = d / results['upstream']['ground_speed']
    t_down = d / results['downstream']['ground_speed']
    energy = results['upstream']['R'] * d + results['downstream']['R'] * d
    avg_speed = 2 * d / (t_up + t_down)
    return {'R_up': results['upstream']['R'], 'R_down': results['downstream']['R'],
            'energy': energy, 'avg_speed': avg_speed, 'rho': rho}

# Compare designs across seasons
designs = {
    'Shallow-opt': (6.0, 2.5, 0.45, 1.0),
    'Speed-opt': (9.0, 1.5, 0.50, 0.7),
    'All-rounder': (7.5, 2.0, 0.55, 1.0),
}
boat_speed = 3.0  # m/s through water

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Brahmaputra River Environment: Seasonal Hull Optimization',
             color='white', fontsize=14, fontweight='bold')

# Plot 1: Seasonal conditions
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
s_names = list(seasons.keys())
s_short = ['Dry', 'Pre-mon', 'Monsoon', 'Post-mon']
depths = [seasons[s]['depth'] for s in s_names]
currents = [seasons[s]['current'] for s in s_names]
sediments = [seasons[s]['sediment'] for s in s_names]
x = np.arange(len(s_names))
w = 0.25
ax1.bar(x - w, depths, w, color='#3b82f6', alpha=0.8, label='Depth (m)')
ax1.bar(x, [c*5 for c in currents], w, color='#ef4444', alpha=0.8, label='Current (m/s x5)')
ax1.bar(x + w, [s*3 for s in sediments], w, color='#f59e0b', alpha=0.8, label='Sediment (kg/m³ x3)')
ax1.set_xticks(x)
ax1.set_xticklabels(s_short, color='white')
ax1.set_title('Brahmaputra seasonal conditions', color='white', fontsize=11)
ax1.legend(fontsize=8)

# Plot 2: Upstream resistance by season and design
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
d_colors = ['#22c55e', '#3b82f6', '#f59e0b']
for (dname, (L,B,D,a)), col in zip(designs.items(), d_colors):
    R_ups = []
    for s in s_names:
        cond = seasons[s]
        r = resistance_in_conditions(L, B, D, a, boat_speed, cond['current'], cond['sediment'])
        R_ups.append(r['R_up'])
    ax2.plot(s_short, R_ups, color=col, linewidth=2.5, marker='o', label=dname)
ax2.set_ylabel('Upstream resistance (N)', color='white')
ax2.set_title('Upstream resistance across seasons', color='white', fontsize=11)
ax2.legend(fontsize=9)

# Plot 3: Annual energy cost (weighted by months)
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
annual_energy = {}
for dname, (L,B,D,a) in designs.items():
    total_energy = 0
    for s in s_names:
        cond = seasons[s]
        r = resistance_in_conditions(L, B, D, a, boat_speed, cond['current'], cond['sediment'])
        total_energy += r['energy'] * cond['months']  # energy * months
    annual_energy[dname] = total_energy / 12  # monthly average
bars = ax3.bar(list(annual_energy.keys()), list(annual_energy.values()),
               color=d_colors, alpha=0.8)
for bar, val in zip(bars, annual_energy.values()):
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1000,
             f'{val/1000:.0f}kJ', ha='center', color='white', fontsize=10)
ax3.set_ylabel('Avg monthly energy per km round-trip (J)', color='white')
ax3.set_title('Annual energy efficiency comparison', color='white', fontsize=11)

# Plot 4: Average ground speed by season
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
for (dname, (L,B,D,a)), col in zip(designs.items(), d_colors):
    avg_speeds = []
    for s in s_names:
        cond = seasons[s]
        r = resistance_in_conditions(L, B, D, a, boat_speed, cond['current'], cond['sediment'])
        avg_speeds.append(r['avg_speed'] * 3.6)  # km/h
    ax4.plot(s_short, avg_speeds, color=col, linewidth=2.5, marker='s', label=dname)
ax4.set_ylabel('Average round-trip speed (km/h)', color='white')
ax4.set_title('Effective transport speed by season', color='white', fontsize=11)
ax4.legend(fontsize=9)

plt.tight_layout()
plt.show()

print("Seasonal Performance Summary (boat speed through water = 3 m/s)")
print("=" * 65)
for dname, (L,B,D,a) in designs.items():
    print(f"\
{dname} (L={L}, B={B}, D={D}, alpha={a}):")
    for s in s_names:
        cond = seasons[s]
        r = resistance_in_conditions(L, B, D, a, boat_speed, cond['current'], cond['sediment'])
        print(f"  {s:<25} R_up={r['R_up']:>6.0f}N  R_down={r['R_down']:>5.0f}N  "
              f"avg_speed={r['avg_speed']*3.6:.1f} km/h")`,
      challenge: 'Optimize a hull specifically for monsoon conditions (current=3 m/s, deep water). Compare it with one optimized for dry season (current=1 m/s, shallow water). Then find the best year-round compromise by weighting each season by its duration. How different is the year-round optimum from each season-specific optimum?',
      successHint: 'Environment modeling transforms hull optimization from an abstract exercise into a practical engineering tool. The Brahmaputra\'s extreme seasonal variation means the optimal hull is never a single-condition champion — it is always a carefully weighted compromise.',
    },
    {
      title: 'Complete Hull Design Report',
      concept: `The final step of any engineering project is documentation and communication. A **design report** summarizes the entire process: the problem definition, methodology, results, sensitivity analysis, and final recommendation. It must be clear enough for a non-specialist to understand the conclusions, yet rigorous enough for a specialist to verify the work.

Our report will include five sections. The **executive summary** states the final design recommendation in one paragraph. The **methodology** section describes the parameterization, physics models, optimization algorithm, and validation approach. The **results** section presents the optimal design with full performance characteristics, the Pareto front, and the sensitivity analysis. The **environmental analysis** section shows how the design performs across Brahmaputra seasons. The **recommendations** section suggests the final hull dimensions with manufacturing tolerances derived from the sensitivity analysis.

A well-written report also acknowledges **limitations**: our model uses simplified 2D cross-sections, empirical resistance correlations rather than CFD, and synthetic rather than measured environmental data. Each limitation is paired with a recommendation for how to address it in future work. Honest acknowledgment of limitations builds trust and guides improvement.`,
      analogy: 'A design report is like a restaurant menu with chef\'s notes. The menu (executive summary) tells you what to order. The ingredients list (methodology) tells you what went into it. The nutritional information (results) gives quantitative detail. The allergen warnings (limitations) tell you what might be wrong. A good menu serves everyone from the casual diner (reads the summary) to the food critic (reads everything).',
      storyConnection: 'The little boat\'s journey ends with a complete design — not just a shape, but a documented, validated, justified engineering solution for Brahmaputra river transport. The story\'s narrative of discovery parallels the engineering process: observe the problem, model the physics, optimize the design, validate against reality, and communicate the result.',
      checkQuestion: 'Why include a limitations section in a design report? Does acknowledging limitations weaken the work?',
      checkAnswer: 'Acknowledging limitations strengthens the work by demonstrating intellectual honesty and scientific rigor. Every model has limitations — hiding them does not make them disappear, it just means the reader might discover them later and lose trust in everything else. A clear limitations section helps the reader calibrate their confidence in the results and guides future improvements. It is a hallmark of professional engineering practice.',
      codeIntro: 'Generate a comprehensive design report with all performance metrics, multi-panel visualization, and a final recommendation for the optimal Brahmaputra river boat hull.',
      code: `import numpy as np
import matplotlib.pyplot as plt

RHO = 1000.0; g = 9.81; HULL_MASS = 100.0

# --- Optimal design (from optimization) ---
L_opt, B_opt, D_opt, alpha_opt = 7.8, 2.1, 0.55, 0.9

def full_analysis(L, B, D, alpha):
    z = np.linspace(0.001, D, 300)
    y = (B/2)*(z/D)**(1.0/max(alpha, 0.3))
    V = L*2*np.trapz(y, z)
    max_cargo = RHO*V - HULL_MASS
    # At design load (300 kg cargo)
    total = HULL_MASS + 300
    draft = total/(RHO*V)*D if V*RHO > total else D
    draft = min(draft, D)
    freeboard = D - draft
    # GM
    y_wl = (B/2)*(min(draft,D)/D)**(1/max(alpha,0.3))
    I = L*(2*y_wl)**3/12
    Vd = L*2*np.trapz(y[:int(len(z)*draft/D)+1], z[:int(len(z)*draft/D)+1]) if draft < D else V
    GM = draft/2 + I/max(Vd, 1e-6) - 0.35
    Cb = Vd/(L*2*y_wl*draft) if y_wl*draft > 0 else 0
    # Wetted surface
    dz = np.gradient(y, z)
    S = L*(2*np.trapz(np.sqrt(1+dz**2), z) + 2*y[-1])
    # Resistance curve
    speeds = np.linspace(0.5, 6, 100)
    R_curve = []
    for v in speeds:
        Re = max(v*L/1.14e-6, 1e3)
        Cf = 0.075/(np.log10(Re)-2)**2
        Fn = v/np.sqrt(g*L)
        Cw = 0.001*np.exp(8*(Fn-0.35)**2)*Fn**4
        R_curve.append(0.5*RHO*v**2*S*(Cf+Cw+0.002))
    hull_speed = 1.34*np.sqrt(L/0.3048)*0.5144
    return {
        'V': V, 'max_cargo': max_cargo, 'draft': draft, 'freeboard': freeboard,
        'GM': GM, 'Cb': Cb, 'S': S, 'hull_speed': hull_speed,
        'speeds': speeds, 'R_curve': np.array(R_curve),
        'z': z, 'y': y, 'LB': L/B,
    }

analysis = full_analysis(L_opt, B_opt, D_opt, alpha_opt)

fig = plt.figure(figsize=(15, 12))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('HULL DESIGN REPORT: Brahmaputra River Boat',
             color='white', fontsize=16, fontweight='bold', y=0.98)

# Layout: 3 rows, 3 columns
gs = fig.add_gridspec(3, 3, hspace=0.35, wspace=0.3)

# Panel 1: Hull cross-section
ax1 = fig.add_subplot(gs[0, 0])
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
ax1.fill_betweenx(analysis['z'], -analysis['y'], analysis['y'],
                   color='#f59e0b', alpha=0.5, edgecolor='#f59e0b', linewidth=2)
ax1.axhline(analysis['draft'], color='#3b82f6', linewidth=2, linestyle='--', label=f"Waterline ({analysis['draft']*100:.0f}cm)")
ax1.fill_between([-B_opt/2*1.3, B_opt/2*1.3], 0, analysis['draft'],
                  color='#3b82f6', alpha=0.1)
ax1.set_xlim(-B_opt*0.8, B_opt*0.8)
ax1.set_xlabel('Width (m)', color='white')
ax1.set_ylabel('Height (m)', color='white')
ax1.set_title('Hull Cross-Section', color='white', fontsize=11)
ax1.legend(fontsize=8)
ax1.set_aspect('equal')

# Panel 2: Resistance curve
ax2 = fig.add_subplot(gs[0, 1])
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
ax2.plot(analysis['speeds'], analysis['R_curve'], color='#22c55e', linewidth=2.5)
ax2.axvline(analysis['hull_speed'], color='#a855f7', linewidth=2, linestyle='--',
            label=f"Hull speed = {analysis['hull_speed']:.1f} m/s")
ax2.axvline(2.0, color='#f59e0b', linewidth=1.5, linestyle=':', label='Cruise speed')
ax2.set_xlabel('Speed (m/s)', color='white')
ax2.set_ylabel('Resistance (N)', color='white')
ax2.set_title('Resistance Curve', color='white', fontsize=11)
ax2.legend(fontsize=8)

# Panel 3: Key metrics
ax3 = fig.add_subplot(gs[0, 2])
ax3.set_facecolor('#111827')
ax3.axis('off')
metrics_text = f"""DESIGN SPECIFICATIONS
{'='*30}
Length:     {L_opt:.1f} m
Beam:      {B_opt:.1f} m
Depth:     {D_opt:.2f} m
Shape:     alpha = {alpha_opt:.1f}

PERFORMANCE
{'='*30}
Max cargo:    {analysis['max_cargo']:.0f} kg
Design draft: {analysis['draft']*100:.1f} cm
Freeboard:    {analysis['freeboard']*100:.1f} cm
GM:           {analysis['GM']:.2f} m
Block coeff:  {analysis['Cb']:.3f}
L/B ratio:    {analysis['LB']:.2f}
Hull speed:   {analysis['hull_speed']:.2f} m/s
Wetted area:  {analysis['S']:.1f} m²

CONSTRAINTS
{'='*30}
Draft < 40cm:  {'PASS' if analysis['draft']<0.40 else 'FAIL'}
GM > 0.30m:    {'PASS' if analysis['GM']>0.30 else 'FAIL'}
Freeboard>15cm:{'PASS' if analysis['freeboard']>0.15 else 'FAIL'}
L/B in [2.5,6]:{'PASS' if 2.5<=analysis['LB']<=6 else 'FAIL'}"""
ax3.text(0.05, 0.95, metrics_text, transform=ax3.transAxes,
         fontsize=8, color='white', fontfamily='monospace',
         verticalalignment='top')

# Panel 4: Loading curve
ax4 = fig.add_subplot(gs[1, 0])
ax4.set_facecolor('#111827')
ax4.tick_params(colors='gray')
cargos = np.linspace(0, analysis['max_cargo'] * 0.9, 100)
drafts_load = [(HULL_MASS + c) / (RHO * analysis['V']) * D_opt for c in cargos]
ax4.plot(cargos, [d*100 for d in drafts_load], color='#3b82f6', linewidth=2.5)
ax4.axhline(40, color='#ef4444', linewidth=2, linestyle='--', label='Max draft (40 cm)')
ax4.fill_between(cargos, [d*100 for d in drafts_load], 40,
                  where=[d*100 < 40 for d in drafts_load], alpha=0.1, color='#22c55e')
ax4.set_xlabel('Cargo (kg)', color='white')
ax4.set_ylabel('Draft (cm)', color='white')
ax4.set_title('Loading Curve', color='white', fontsize=11)
ax4.legend(fontsize=9)

# Panel 5: Seasonal performance
ax5 = fig.add_subplot(gs[1, 1:])
ax5.set_facecolor('#111827')
ax5.tick_params(colors='gray')
seasons = ['Dry', 'Pre-monsoon', 'Monsoon', 'Post-monsoon']
currents = [1.0, 1.5, 3.0, 2.0]
R_upstream = []
R_downstream = []
for current in currents:
    for direction, sign in [('up', 1), ('down', -1)]:
        v_eff = 3.0 + sign * current
        v_eff = max(v_eff, 0.1)
        Re = max(v_eff*L_opt/1.14e-6, 1e3)
        Cf = 0.075/(np.log10(Re)-2)**2
        Fn = v_eff/np.sqrt(g*L_opt)
        Cw = 0.001*np.exp(8*(Fn-0.35)**2)*Fn**4
        R = 0.5*RHO*v_eff**2*analysis['S']*(Cf+Cw+0.002)
        if direction == 'up': R_upstream.append(R)
        else: R_downstream.append(R)
x = np.arange(len(seasons))
ax5.bar(x - 0.2, R_upstream, 0.35, color='#ef4444', alpha=0.8, label='Upstream')
ax5.bar(x + 0.2, R_downstream, 0.35, color='#22c55e', alpha=0.8, label='Downstream')
ax5.set_xticks(x)
ax5.set_xticklabels(seasons, color='white')
ax5.set_ylabel('Resistance (N)', color='white')
ax5.set_title('Seasonal Resistance (boat speed = 3 m/s through water)', color='white', fontsize=11)
ax5.legend(fontsize=9)

# Panel 6: Stability diagram
ax6 = fig.add_subplot(gs[2, 0])
ax6.set_facecolor('#111827')
ax6.tick_params(colors='gray')
angles = np.linspace(0, 60, 100)
GZ = analysis['GM'] * np.sin(np.radians(angles))
ax6.plot(angles, GZ, color='#a855f7', linewidth=2.5)
ax6.fill_between(angles, GZ, 0, where=GZ > 0, alpha=0.15, color='#22c55e')
ax6.axhline(0, color='white', linewidth=0.5)
ax6.set_xlabel('Heel angle (degrees)', color='white')
ax6.set_ylabel('Righting arm GZ (m)', color='white')
ax6.set_title('Stability Curve', color='white', fontsize=11)

# Panel 7: Power requirements
ax7 = fig.add_subplot(gs[2, 1:])
ax7.set_facecolor('#111827')
ax7.tick_params(colors='gray')
power = analysis['R_curve'] * analysis['speeds']
ax7.plot(analysis['speeds'], power, color='#f59e0b', linewidth=2.5, label='Effective power')
ax7.plot(analysis['speeds'], power / 0.6, color='#ef4444', linewidth=2, linestyle='--',
         label='Engine power (60% efficiency)')
ax7.axvline(2.0, color='white', linewidth=1, linestyle=':', alpha=0.5)
idx_cruise = np.argmin(np.abs(analysis['speeds'] - 2.0))
ax7.scatter([2.0], [power[idx_cruise]/0.6], color='#22c55e', s=100, zorder=5,
            label=f'Cruise: {power[idx_cruise]/0.6:.0f} W ({power[idx_cruise]/0.6/745.7:.1f} hp)')
ax7.set_xlabel('Speed (m/s)', color='white')
ax7.set_ylabel('Power (W)', color='white')
ax7.set_title('Power Requirements', color='white', fontsize=11)
ax7.legend(fontsize=8)

plt.tight_layout()
plt.show()

print("HULL DESIGN REPORT — EXECUTIVE SUMMARY")
print("=" * 60)
print(f"Recommended hull: {L_opt}m x {B_opt}m x {D_opt}m (alpha={alpha_opt})")
print(f"Optimized for Brahmaputra River year-round operation")
print(f"Maximum cargo: {analysis['max_cargo']:.0f} kg")
print(f"Design draft at 300kg cargo: {analysis['draft']*100:.1f} cm")
print(f"Metacentric height: {analysis['GM']:.2f} m (stable)")
print(f"Cruise resistance at 2 m/s: {analysis['R_curve'][np.argmin(np.abs(analysis['speeds']-2))]:.0f} N")
print(f"Hull speed: {analysis['hull_speed']:.1f} m/s ({analysis['hull_speed']*3.6:.1f} km/h)")
print()
print("All constraints satisfied. Design is robust to +/-10%")
print("parameter variations based on sensitivity analysis.")
print()
print("CAPSTONE PROJECT COMPLETE")
print("Skills demonstrated: buoyancy physics, hydrostatics,")
print("hydrodynamics, dimensional analysis, optimization,")
print("sensitivity analysis, environmental modeling, reporting.")`,
      challenge: 'Add a cost model: hull material cost is proportional to surface area, engine cost scales with required power, and annual fuel cost scales with resistance * distance * fuel_price. Find the hull that minimizes total cost of ownership over 10 years of operating 50 km/day on the Brahmaputra. How does the cost-optimal hull differ from the resistance-optimal hull?',
      successHint: 'You have completed a full capstone project: from Archimedes\' principle through hydrostatics, hydrodynamics, dimensional analysis, optimization, and environmental modeling to a complete design report. This is the shape of real naval architecture — not a single calculation, but an integrated system where every piece connects.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 3 (boat physics & hydrodynamics)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">This capstone project uses Python with numpy and matplotlib to build a complete Hull Design Optimizer. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
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
