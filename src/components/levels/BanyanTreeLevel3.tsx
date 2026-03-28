import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function BanyanTreeLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Strangler fig life cycle — modeling parasitic growth dynamics',
      concept: `The banyan (Ficus benghalensis) is a strangler fig: it germinates in the canopy of a host tree, sends roots downward, and eventually envelops and kills the host. This is not parasitism in the usual sense — the banyan does not feed on the host. Instead, it competes for light above and water below, slowly shading out and root-competing the host to death over decades.

The growth dynamics follow a logistic competition model:

dB/dt = r_B * B * (1 - (B + alpha*H) / K_B)
dH/dt = r_H * H * (1 - (H + beta*B) / K_H)

Where B = banyan biomass, H = host biomass, r = growth rates, K = carrying capacities, and alpha/beta = competition coefficients. The critical asymmetry: alpha (banyan's effect on host) is much larger than beta (host's effect on banyan) because the banyan attacks from both above (light competition) and below (root competition).

The outcome depends on timing. A banyan seed that lands on a vigorous young tree faces strong competition. One that lands on an old, declining tree faces weak competition. This is why banyans often succeed on ancient host trees — the host is already weakening.`,
      analogy: 'The banyan growth pattern is like a corporate takeover in slow motion. The acquiring company (banyan) starts small — a satellite office inside the target company building (seed in the canopy). It gradually expands, taking over floor after floor (sending down aerial roots), until the original company is squeezed out entirely. The building (ecological niche) remains, but the occupant has changed.',
      storyConnection: 'The ancient banyan in the story sheltered an entire village beneath its canopy. That immense spread started from a single seed lodged in a host tree crack, perhaps centuries ago. The host tree is long gone — dissolved into the banyan lattice of aerial roots. The story captures the end state; our model captures the journey.',
      checkQuestion: 'Why does the competition model predict that banyans rarely succeed on young, vigorous host trees?',
      checkAnswer: 'A young host tree has high growth rate r_H and high remaining capacity (H is far from K_H). The host can outgrow the banyan seedling — adding biomass faster than the banyan can establish root contact and begin light competition. The competition coefficient beta (host suppressing banyan) dominates when the host is vigorous. Only when the host is old (H near K_H, growth slowing) does the banyan asymmetry (alpha >> beta) take effect.',
      codeIntro: 'Simulate the Lotka-Volterra competition model for banyan vs. host tree over a 200-year timeline.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Lotka-Volterra competition: Banyan vs Host ---
def simulate_competition(B0, H0, r_B, r_H, K_B, K_H, alpha, beta, years=200, dt=0.1):
    """Simulate banyan-host competition dynamics.

    B = banyan biomass, H = host biomass
    alpha = banyan's competitive effect on host (high)
    beta = host's competitive effect on banyan (low)
    """
    steps = int(years / dt)
    t = np.linspace(0, years, steps)
    B = np.zeros(steps)
    H = np.zeros(steps)
    B[0], H[0] = B0, H0

    for i in range(1, steps):
        dB = r_B * B[i-1] * (1 - (B[i-1] + alpha * H[i-1]) / K_B)
        dH = r_H * H[i-1] * (1 - (H[i-1] + beta * B[i-1]) / K_H)
        B[i] = max(0, B[i-1] + dB * dt)
        H[i] = max(0, H[i-1] + dH * dt)

    return t, B, H

# Scenario 1: Banyan on old host (typical success)
t1, B1, H1 = simulate_competition(
    B0=0.5, H0=80,       # tiny banyan, large old host
    r_B=0.08, r_H=0.02,  # banyan grows faster than aging host
    K_B=100, K_H=100,
    alpha=1.8,            # banyan strongly suppresses host
    beta=0.3,             # host weakly suppresses banyan
    years=200
)

# Scenario 2: Banyan on young host (typical failure)
t2, B2, H2 = simulate_competition(
    B0=0.5, H0=20,       # tiny banyan, small vigorous host
    r_B=0.08, r_H=0.12,  # young host grows faster
    K_B=100, K_H=100,
    alpha=1.8, beta=0.3,
    years=200
)

# Scenario 3: Equal competitors (rare stalemate)
t3, B3, H3 = simulate_competition(
    B0=0.5, H0=50,
    r_B=0.06, r_H=0.06,
    K_B=100, K_H=100,
    alpha=0.8, beta=0.8,
    years=200
)

# --- Plot ---
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

scenarios = [
    (t1, B1, H1, 'Old host (banyan wins)'),
    (t2, B2, H2, 'Young host (host survives)'),
    (t3, B3, H3, 'Equal competitors (coexistence)'),
]

for ax, (t, B, H, title) in zip(axes, scenarios):
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.plot(t, B, color='#22c55e', linewidth=2, label='Banyan')
    ax.plot(t, H, color='#f59e0b', linewidth=2, label='Host tree')
    ax.fill_between(t, B, alpha=0.1, color='#22c55e')
    ax.fill_between(t, H, alpha=0.1, color='#f59e0b')
    ax.set_xlabel('Years', color='white')
    ax.set_ylabel('Biomass (relative)', color='white')
    ax.set_title(title, color='white', fontsize=11)
    ax.legend(fontsize=9)
    ax.set_ylim(0, 110)

plt.tight_layout()
plt.show()

# Analysis
for name, B, H in [('Old host', B1, H1), ('Young host', B2, H2), ('Equal', B3, H3)]:
    final_B, final_H = B[-1], H[-1]
    winner = 'Banyan' if final_B > final_H else 'Host' if final_H > final_B else 'Tie'
    crossover = np.argmax(B > H) * 0.1 if np.any(B > H) else -1
    print(f"{name}: Banyan={final_B:.1f}, Host={final_H:.1f} -> {winner} wins"
          + (f" (crossover at year {crossover:.0f})" if crossover > 0 else ""))`,
      challenge: 'Add environmental stochasticity: multiply each growth rate by (1 + noise) where noise is drawn from a normal distribution each year. Run 100 simulations and plot the distribution of outcomes. What fraction of the time does the banyan win on a young host?',
      successHint: 'You can now model competition dynamics between strangler fig and host tree — the ecological foundation of banyan biology.',
    },
    {
      title: 'Aerial root biomechanics — modeling structural support systems',
      concept: `Banyan aerial roots are engineering marvels. Starting as thin, flexible filaments hanging from branches, they thicken upon reaching the ground and eventually become load-bearing pillars. A single banyan can have thousands of aerial roots forming a distributed support system.

The biomechanics involve two phases:

**Phase 1 — Pendant root (hanging)**: The root hangs in tension, loaded by its own weight. Its diameter is limited by the branch's carrying capacity. Stress = Force / Area = (mass × g) / (π × r²). If stress exceeds the root tissue's tensile strength (~10 MPa for young aerial roots), the root breaks.

**Phase 2 — Pillar root (grounded)**: Once rooted, the aerial root transitions from tension to compression. It thickens through secondary growth, eventually supporting branch loads. The critical parameter is the **slenderness ratio** L/r (length/radius): tall, thin roots buckle; short, thick roots are stable. Euler's buckling load: P_cr = π²EI/L² where E = elastic modulus, I = moment of inertia = πr⁴/4.

The distributed pillar system gives banyans extraordinary stability. Unlike a single-trunk tree that fails catastrophically if the trunk breaks, a banyan with 100 pillar roots can lose 20% and still stand. This is **structural redundancy** — the same principle used in bridge engineering.`,
      analogy: 'A banyan root system is like a tent held up by many poles instead of one central mast. If a storm breaks one pole, the tent sags locally but does not collapse. A cathedral with one massive column fails if that column cracks; a banyan-like structure with many smaller columns degrades gracefully. This is why banyans survive cyclones that topple conventional trees.',
      storyConnection: 'The story describes children playing among the aerial roots — each root thick as a small tree trunk. Those roots started as threads and grew into pillars through decades of secondary growth. The biomechanical transition from pendant filament to load-bearing column is the hidden engineering that makes the banyan a living building.',
      checkQuestion: 'Why does the slenderness ratio L/r matter more than absolute root diameter for structural stability?',
      checkAnswer: 'A root that is 10cm in diameter and 1m tall is extremely stable. The same 10cm root at 10m tall would buckle under modest loads. Euler buckling load scales as r⁴/L² — so doubling the length reduces the critical load by 4x, while doubling the radius increases it by 16x. Slenderness ratio captures this scaling: a thick, short root (low L/r) is always more stable than a thin, tall one (high L/r), regardless of absolute size.',
      codeIntro: 'Model the biomechanics of aerial root development from pendant phase through grounded pillar phase, computing structural loads and safety factors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Aerial Root Biomechanics Model ---
class AerialRoot:
    """Model a single banyan aerial root through its lifecycle."""

    def __init__(self, branch_height, initial_diameter=0.002):
        self.branch_height = branch_height  # meters
        self.diameter = initial_diameter     # meters (starts as 2mm thread)
        self.length = 0.1                    # initial hanging length
        self.grounded = False
        self.age = 0                         # years

        # Material properties
        self.density = 800          # kg/m³ (green wood)
        self.tensile_strength = 10e6  # Pa (10 MPa)
        self.elastic_modulus = 2e9    # Pa (2 GPa — young wood)
        self.growth_rate_diameter = 0.003  # m/year radial growth
        self.growth_rate_length = 0.5      # m/year downward growth

    def radius(self):
        return self.diameter / 2

    def cross_section_area(self):
        return np.pi * self.radius()**2

    def mass(self):
        return self.density * self.cross_section_area() * self.length

    def tensile_stress(self):
        """Stress when hanging (pendant phase)."""
        if self.grounded:
            return 0
        return (self.mass() * 9.81) / self.cross_section_area()

    def safety_factor_tension(self):
        stress = self.tensile_stress()
        return self.tensile_strength / stress if stress > 0 else float('inf')

    def moment_of_inertia(self):
        return np.pi * self.radius()**4 / 4

    def euler_buckling_load(self):
        """Critical buckling load (compression, grounded phase)."""
        if not self.grounded or self.length < 0.01:
            return float('inf')
        return np.pi**2 * self.elastic_modulus * self.moment_of_inertia() / self.length**2

    def slenderness_ratio(self):
        r = self.radius()
        return self.length / r if r > 0 else float('inf')

    def grow_one_year(self):
        """Simulate one year of growth."""
        self.age += 1

        if not self.grounded:
            # Pendant phase: grow downward
            self.length = min(self.length + self.growth_rate_length, self.branch_height)
            self.diameter += self.growth_rate_diameter * 0.5  # slower growth when hanging

            # Check if reached ground
            if self.length >= self.branch_height * 0.95:
                self.grounded = True
        else:
            # Grounded phase: thicken rapidly
            self.diameter += self.growth_rate_diameter * 2  # faster thickening
            # Elastic modulus increases with age (wood matures)
            self.elastic_modulus = min(self.elastic_modulus * 1.02, 10e9)

# --- Simulate root development ---
root = AerialRoot(branch_height=8.0)
years = 60

history = {
    'age': [], 'diameter': [], 'length': [], 'mass': [],
    'tensile_stress': [], 'safety_factor': [], 'slenderness': [],
    'buckling_load': [], 'grounded': [],
}

for year in range(years):
    root.grow_one_year()
    history['age'].append(root.age)
    history['diameter'].append(root.diameter * 100)  # cm
    history['length'].append(root.length)
    history['mass'].append(root.mass())
    history['tensile_stress'].append(root.tensile_stress() / 1e6)  # MPa
    history['safety_factor'].append(min(root.safety_factor_tension(), 50))
    history['slenderness'].append(min(root.slenderness_ratio(), 500))
    history['buckling_load'].append(root.euler_buckling_load() / 1000 if root.grounded else 0)  # kN
    history['grounded'].append(root.grounded)

ground_year = next(i for i, g in enumerate(history['grounded']) if g) + 1

# --- Plot ---
fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')
    ax.axvline(ground_year, color='#f59e0b', linestyle='--', alpha=0.5, linewidth=1)

axes[0,0].plot(history['age'], history['diameter'], color='#22c55e', linewidth=2)
axes[0,0].set_title('Root diameter (cm)', color='white', fontsize=11)
axes[0,0].set_xlabel('Years', color='white')

axes[0,1].plot(history['age'], history['length'], color='#3b82f6', linewidth=2)
axes[0,1].set_title('Root length (m)', color='white', fontsize=11)
axes[0,1].axhline(8.0, color='gray', linestyle=':', alpha=0.5, label='Ground level')
axes[0,1].legend(fontsize=8)

axes[0,2].plot(history['age'], history['mass'], color='#a855f7', linewidth=2)
axes[0,2].set_title('Root mass (kg)', color='white', fontsize=11)

axes[1,0].plot(history['age'], history['tensile_stress'], color='#ef4444', linewidth=2)
axes[1,0].axhline(10, color='#ef4444', linestyle=':', alpha=0.5, label='Tensile limit (10 MPa)')
axes[1,0].set_title('Tensile stress (MPa)', color='white', fontsize=11)
axes[1,0].legend(fontsize=8)

axes[1,1].plot(history['age'], history['slenderness'], color='#f59e0b', linewidth=2)
axes[1,1].set_title('Slenderness ratio (L/r)', color='white', fontsize=11)
axes[1,1].set_xlabel('Years', color='white')

axes[1,2].plot(history['age'], history['buckling_load'], color='#22c55e', linewidth=2)
axes[1,2].set_title('Euler buckling load (kN)', color='white', fontsize=11)
axes[1,2].set_xlabel('Years', color='white')

for ax in axes.flat:
    ax.text(ground_year + 1, ax.get_ylim()[1]*0.9, 'Grounded', color='#f59e0b', fontsize=8)

plt.tight_layout()
plt.show()

print(f"Root reaches ground at year {ground_year}")
print(f"Final diameter: {history['diameter'][-1]:.1f} cm")
print(f"Final mass: {history['mass'][-1]:.1f} kg")
print(f"Max tensile stress (pendant phase): {max(history['tensile_stress'][:ground_year]):.2f} MPa")
print(f"Final buckling load: {history['buckling_load'][-1]:.1f} kN ({history['buckling_load'][-1]*1000/9.81:.0f} kg)")
print(f"Final slenderness: {history['slenderness'][-1]:.0f}")`,
      challenge: 'Simulate 50 aerial roots at different branch heights (4-15m) with random variation in growth rates. Plot the distribution of grounding times and final diameters. Which branch height produces the most structurally effective pillars?',
      successHint: 'You can now model the biomechanical lifecycle of aerial roots — from pendant filament to load-bearing pillar.',
    },
    {
      title: 'Canopy expansion — modeling spatial growth with fractal branching',
      concept: `A mature banyan's canopy can cover over 20,000 m². This extraordinary spread follows fractal branching patterns: each branch produces sub-branches at characteristic angles and length ratios, creating a self-similar structure across scales.

The **L-system** (Lindenmayer system) is the standard model for plant branching:
- Start with an axiom (trunk): "F"
- Apply production rules iteratively: F -> F[+F]F[-F]F
- F = draw forward, + = turn left, - = turn right, [ = push state, ] = pop state

For banyans, we add aerial root rules:
- At each branch node, there is a probability of dropping an aerial root.
- Roots that reach the ground become new support points.
- New support points enable further canopy extension (branches can grow longer when supported).

This creates a **positive feedback loop**: more roots → more support → longer branches → more canopy area → more root drop points → more roots. This is why banyans expand exponentially once established — each new pillar enables further expansion.

The canopy shape is not circular but **lobate** — extending further in directions with more successful root establishment. Wind, light, and soil conditions create asymmetric root success, producing the irregular outlines seen in real banyans.`,
      analogy: 'Banyan canopy expansion is like a city growing along highways. The first highway (trunk) enables suburban development (branches). Successful suburbs build their own exits (aerial roots), which become new growth centers. The city does not expand uniformly — it follows infrastructure. The banyan does not expand uniformly — it follows its root-pillar infrastructure.',
      storyConnection: 'The story describes the banyan as a living village — its canopy sheltering homes, markets, and gathering places. That canopy shape was not planned; it emerged from decades of fractal branching guided by where aerial roots succeeded. The tree is not an architect — it is an emergent system, building its structure from simple local rules repeated thousands of times.',
      checkQuestion: 'Why does the positive feedback between roots and canopy expansion eventually slow down?',
      checkAnswer: 'Resource limitation. Each new branch and root competes with existing ones for water (finite soil moisture), light (self-shading within the canopy), and nutrients. As the tree gets larger, the ratio of photosynthetic canopy surface to total biomass decreases (the square-cube law). Eventually, the metabolic cost of maintaining existing structure exceeds the energy gained from new expansion. The growth curve is logistic, not exponential.',
      codeIntro: 'Simulate banyan canopy growth using an L-system with aerial root feedback, visualizing the expanding crown over time.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- L-system Banyan Growth Model ---
class BanyanGrowth:
    """Simulate banyan canopy expansion with aerial root feedback."""

    def __init__(self):
        self.branches = []       # (x1,y1,x2,y2,generation)
        self.roots = []          # (x, y_branch, y_ground, is_grounded)
        self.support_points = [(0, 0)]  # (x, y) grounded root positions
        self.canopy_radius = 2.0
        self.max_branch_length = 3.0

    def distance_to_nearest_support(self, x, y):
        """Distance from (x,y) to nearest grounded root."""
        if not self.support_points:
            return float('inf')
        dists = [np.sqrt((x-sx)**2 + (y-sy)**2) for sx, sy in self.support_points]
        return min(dists)

    def grow_generation(self, gen):
        """Add one generation of branches."""
        if gen == 0:
            # Initial trunk splits
            n_primary = np.random.randint(4, 7)
            angles = np.linspace(0, 2*np.pi, n_primary, endpoint=False)
            angles += np.random.normal(0, 0.2, n_primary)
            for angle in angles:
                length = self.max_branch_length * np.random.uniform(0.7, 1.0)
                x2 = length * np.cos(angle)
                y2 = length * np.sin(angle)
                self.branches.append((0, 0, x2, y2, gen))
        else:
            # Extend from tips of previous generation
            prev_tips = [(b[2], b[3]) for b in self.branches if b[4] == gen-1]
            new_branches = []

            for tx, ty in prev_tips:
                # Branch length depends on support proximity
                support_dist = self.distance_to_nearest_support(tx, ty)
                max_extension = self.max_branch_length * max(0.3, 1.0 - support_dist / 20)

                # 1-3 sub-branches per tip
                n_sub = np.random.choice([1, 2, 3], p=[0.3, 0.5, 0.2])
                base_angle = np.arctan2(ty, tx)

                for _ in range(n_sub):
                    angle = base_angle + np.random.normal(0, 0.6)
                    length = max_extension * np.random.uniform(0.5, 1.0)
                    x2 = tx + length * np.cos(angle)
                    y2 = ty + length * np.sin(angle)
                    new_branches.append((tx, ty, x2, y2, gen))

                # Aerial root probability (higher near branch tips, lower near supports)
                root_prob = 0.15 if support_dist > 5 else 0.05
                if np.random.random() < root_prob:
                    # Root drops from this branch point
                    grounded = np.random.random() < 0.6  # 60% reach ground
                    self.roots.append((tx, ty, grounded))
                    if grounded:
                        self.support_points.append((tx, ty))

            self.branches.extend(new_branches)

    def canopy_area(self):
        """Estimate canopy area from branch tip positions."""
        if not self.branches:
            return 0
        tips_x = [b[2] for b in self.branches]
        tips_y = [b[3] for b in self.branches]
        # Convex hull approximation: use max radius
        radii = [np.sqrt(x**2+y**2) for x, y in zip(tips_x, tips_y)]
        max_r = max(radii) if radii else 0
        return np.pi * max_r**2

# --- Simulate growth over 8 generations ---
tree = BanyanGrowth()
n_gens = 8
gen_stats = []

for g in range(n_gens):
    tree.grow_generation(g)
    gen_stats.append({
        'generation': g,
        'branches': len(tree.branches),
        'roots': len(tree.roots),
        'grounded_roots': len(tree.support_points) - 1,  # minus initial
        'canopy_area': tree.canopy_area(),
    })

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 11))
fig.patch.set_facecolor('#1f2937')

# Tree visualization
ax0 = axes[0, 0]
ax0.set_facecolor('#111827')
ax0.tick_params(colors='gray')

# Color branches by generation
cmap = plt.cm.YlGn
for b in tree.branches:
    x1, y1, x2, y2, gen = b
    color = cmap(0.3 + 0.7 * gen / n_gens)
    lw = max(0.3, 2.0 - gen * 0.2)
    ax0.plot([x1, x2], [y1, y2], color=color, linewidth=lw, alpha=0.7)

# Plot support points
for i, (sx, sy) in enumerate(tree.support_points):
    color = '#f59e0b' if i == 0 else '#a855f7'
    size = 80 if i == 0 else 30
    ax0.scatter(sx, sy, c=color, s=size, zorder=5, edgecolors='white', linewidth=0.5)

# Pendant roots
for rx, ry, grounded in tree.roots:
    color = '#a855f7' if grounded else '#ef4444'
    ax0.plot([rx, rx], [ry, ry-0.5], color=color, linewidth=0.5, alpha=0.5)

ax0.set_title(f'Banyan canopy ({len(tree.branches)} branches, {len(tree.support_points)-1} pillars)',
    color='white', fontsize=11)
ax0.set_aspect('equal')
ax0.set_xlabel('X (m)', color='white')
ax0.set_ylabel('Y (m)', color='white')

# Growth curves
ax1 = axes[0, 1]
ax1.set_facecolor('#111827')
ax1.tick_params(colors='gray')
gens = [s['generation'] for s in gen_stats]
ax1.plot(gens, [s['branches'] for s in gen_stats], 'o-', color='#22c55e', label='Branches')
ax1.plot(gens, [s['grounded_roots']*10 for s in gen_stats], 's-', color='#a855f7', label='Pillars (x10)')
ax1.set_xlabel('Generation', color='white')
ax1.set_ylabel('Count', color='white')
ax1.set_title('Growth dynamics', color='white', fontsize=11)
ax1.legend(fontsize=9)

# Canopy area growth
ax2 = axes[1, 0]
ax2.set_facecolor('#111827')
ax2.tick_params(colors='gray')
areas = [s['canopy_area'] for s in gen_stats]
ax2.plot(gens, areas, 'o-', color='#f59e0b', linewidth=2)
ax2.fill_between(gens, areas, alpha=0.2, color='#f59e0b')
ax2.set_xlabel('Generation', color='white')
ax2.set_ylabel('Canopy area (m²)', color='white')
ax2.set_title('Canopy expansion', color='white', fontsize=11)

# Support point distribution
ax3 = axes[1, 1]
ax3.set_facecolor('#111827')
ax3.tick_params(colors='gray')
sp_x = [s[0] for s in tree.support_points]
sp_y = [s[1] for s in tree.support_points]
sp_dist = [np.sqrt(x**2+y**2) for x, y in zip(sp_x, sp_y)]
ax3.hist(sp_dist, bins=15, color='#a855f7', edgecolor='#111827', alpha=0.8)
ax3.set_xlabel('Distance from trunk (m)', color='white')
ax3.set_ylabel('Number of pillars', color='white')
ax3.set_title('Pillar root distribution', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print(f"After {n_gens} generations:")
print(f"  Branches: {len(tree.branches)}")
print(f"  Aerial roots: {len(tree.roots)}")
print(f"  Grounded pillars: {len(tree.support_points)-1}")
print(f"  Canopy area: {tree.canopy_area():.0f} m²")
print(f"  Max canopy radius: {max(np.sqrt(b[2]**2+b[3]**2) for b in tree.branches):.1f} m")`,
      challenge: 'Add wind bias: make branches grow preferentially in the downwind direction (e.g., add +0.3 to the angle for branches growing eastward). How does persistent wind affect canopy symmetry and root distribution?',
      successHint: 'You can now model fractal canopy expansion with aerial root feedback — capturing the positive loop that makes banyans the largest single-organism canopies on Earth.',
    },
    {
      title: 'Keystone species analysis — quantifying ecological importance',
      concept: `A keystone species has disproportionate ecological impact relative to its abundance. Banyans are keystone species because:

1. **Habitat provision**: A single banyan supports 100+ species — epiphytes, insects, birds, bats, reptiles, and mammals that nest in its complex structure.
2. **Food source**: Figs fruit asynchronously (different trees fruit at different times), providing year-round food when other sources are scarce. Figs are a "famine food" for frugivores.
3. **Microclimate modification**: The canopy reduces temperature by 5-10°C, increases humidity by 15-20%, and reduces wind speed — creating a habitat island in otherwise inhospitable terrain.
4. **Seed dispersal hub**: Birds and bats consuming figs defecate seeds of dozens of other species, making the banyan a seed dispersal epicenter.

Quantifying keystoneness uses **network analysis**. Build a food web or interaction network: species are nodes, interactions are edges. Remove the banyan (node deletion) and measure how many other species lose their primary resource or habitat. A keystone species, when removed, causes a **trophic cascade** — collapse propagating through the network.

The **interaction strength** is not binary. Some species depend entirely on the banyan (obligate mutualists like fig wasps); others use it opportunistically. The weighted network captures this spectrum.`,
      analogy: 'A keystone species is like the central server in a corporate network. Remove any ordinary computer and the network barely notices. Remove the server and dozens of departments lose email, files, and connectivity. The server is not the biggest machine — it is the most connected, the one with the most dependencies. The banyan is the ecological server of its forest.',
      storyConnection: 'The story describes the banyan as the heart of the village — not just a tree but a gathering place, a shade provider, a home for birds and bats. The ecological reality mirrors the cultural symbolism: remove the banyan, and the web of life it supports unravels, just as the village community would fragment without its central gathering tree.',
      checkQuestion: 'Why are figs considered a "keystone resource" even though they contain relatively little energy per fruit compared to other tropical fruits?',
      checkAnswer: 'Temporal availability matters more than per-fruit energy. Most tropical trees fruit synchronously during the wet season, creating a "feast or famine" cycle. Figs fruit asynchronously — some tree always has ripe figs. During the dry season, when no other fruit is available, figs may be the only food keeping frugivore populations alive. Removing figs during this bottleneck period would cause population crashes that ripple through the food web. Low energy per fruit is irrelevant when they are the only energy available.',
      codeIntro: 'Build an ecological interaction network centered on the banyan, simulate node removal, and quantify keystoneness by measuring cascade effects.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Ecological Interaction Network ---
class EcologicalNetwork:
    """Model species interaction network around a banyan tree."""

    def __init__(self):
        self.species = {}    # name -> {type, dependency_on_banyan}
        self.interactions = []  # (species_a, species_b, strength, type)

    def add_species(self, name, category, banyan_dependency):
        """banyan_dependency: 0-1, how much this species depends on banyan."""
        self.species[name] = {'category': category, 'banyan_dep': banyan_dependency}

    def add_interaction(self, sp_a, sp_b, strength, interaction_type='mutualism'):
        self.interactions.append((sp_a, sp_b, strength, interaction_type))

    def remove_species(self, target):
        """Simulate removal and compute cascade."""
        surviving = set(self.species.keys()) - {target}
        lost = {target}
        cascade_rounds = 0

        while True:
            cascade_rounds += 1
            newly_lost = set()
            for sp in list(surviving):
                deps = self.species[sp]['banyan_dep']
                # Check if this species depends on any lost species
                interaction_loss = 0
                total_interaction = 0
                for a, b, strength, _ in self.interactions:
                    if a == sp and b in lost:
                        interaction_loss += strength
                    if a == sp:
                        total_interaction += strength

                # Species lost if >60% of interactions gone or direct banyan dependency
                if target == 'Banyan' and deps > 0.7:
                    newly_lost.add(sp)
                elif total_interaction > 0 and interaction_loss / total_interaction > 0.6:
                    newly_lost.add(sp)

            if not newly_lost:
                break
            lost |= newly_lost
            surviving -= newly_lost

        return {
            'removed': target,
            'lost_species': lost,
            'n_lost': len(lost),
            'n_surviving': len(surviving),
            'cascade_rounds': cascade_rounds,
            'pct_lost': len(lost) / len(self.species) * 100,
        }

# --- Build banyan-centered network ---
net = EcologicalNetwork()

# Banyan
net.add_species('Banyan', 'tree', 0)

# Direct dependents
direct = [
    ('Fig wasp', 'insect', 0.95),         # obligate pollinator
    ('Fruit bat', 'mammal', 0.7),          # primary food source
    ('Coppersmith barbet', 'bird', 0.8),   # nests in cavities, eats figs
    ('Flying fox', 'mammal', 0.75),        # roosts in canopy, eats figs
    ('Epiphytic orchid', 'plant', 0.9),    # grows on banyan branches
    ('Banyan beetle', 'insect', 0.85),     # feeds on bark
    ('Tree frog', 'amphibian', 0.6),       # lives in root hollows
    ('Monitor lizard', 'reptile', 0.5),    # shelter in root system
    ('Hanging parrot', 'bird', 0.65),      # nests in canopy, eats figs
    ('Langur monkey', 'mammal', 0.4),      # partial fig diet
]

for name, cat, dep in direct:
    net.add_species(name, cat, dep)
    net.add_interaction(name, 'Banyan', dep, 'dependency')

# Indirect dependents (depend on direct dependents)
indirect = [
    ('Hawk', 'bird', 0.1),
    ('Snake', 'reptile', 0.1),
    ('Spider', 'insect', 0.15),
    ('Parasitic wasp', 'insect', 0.3),
    ('Owl', 'bird', 0.2),
    ('Ant colony', 'insect', 0.25),
    ('Moss', 'plant', 0.5),
    ('Lichen', 'plant', 0.4),
    ('Butterfly', 'insect', 0.2),
    ('Civet', 'mammal', 0.15),
]

for name, cat, dep in indirect:
    net.add_species(name, cat, dep)
    # Connect to random direct dependents
    n_links = np.random.randint(2, 5)
    for d_name, _, _ in np.random.choice(direct, n_links, replace=False):
        net.add_interaction(name, d_name, np.random.uniform(0.2, 0.6))

# --- Simulate removal of different species ---
removal_results = []
for sp in list(net.species.keys()):
    result = net.remove_species(sp)
    removal_results.append(result)

removal_results.sort(key=lambda r: r['n_lost'], reverse=True)

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Network visualization (simplified as dependency circle)
ax0 = axes[0, 0]
species_list = list(net.species.keys())
n_sp = len(species_list)
angles = np.linspace(0, 2*np.pi, n_sp, endpoint=False)
positions = {sp: (2*np.cos(a), 2*np.sin(a)) for sp, a in zip(species_list, angles)}
positions['Banyan'] = (0, 0)  # center

# Draw interactions
for a, b, strength, _ in net.interactions:
    if a in positions and b in positions:
        xa, ya = positions[a]
        xb, yb = positions[b]
        ax0.plot([xa, xb], [ya, yb], color='gray', alpha=strength*0.5, linewidth=strength*2)

# Draw species nodes
categories = {'tree': '#22c55e', 'insect': '#f59e0b', 'bird': '#3b82f6',
              'mammal': '#ef4444', 'reptile': '#a855f7', 'amphibian': '#06b6d4', 'plant': '#84cc16'}
for sp, info in net.species.items():
    x, y = positions[sp]
    color = categories.get(info['category'], 'gray')
    size = 200 if sp == 'Banyan' else 60
    ax0.scatter(x, y, c=color, s=size, zorder=5, edgecolors='white', linewidth=0.5)
    if sp == 'Banyan' or info['banyan_dep'] > 0.7:
        ax0.annotate(sp, (x, y+0.2), color='white', fontsize=7, ha='center')

ax0.set_title('Interaction network (banyan at center)', color='white', fontsize=11)
ax0.set_aspect('equal')

# Keystoneness ranking
ax1 = axes[0, 1]
top_10 = removal_results[:10]
names = [r['removed'] for r in top_10]
losses = [r['n_lost'] for r in top_10]
colors_bar = ['#ef4444' if n == 'Banyan' else '#22c55e' for n in names]
ax1.barh(range(len(names)), losses, color=colors_bar)
ax1.set_yticks(range(len(names)))
ax1.set_yticklabels(names, color='white', fontsize=9)
ax1.set_xlabel('Species lost (including self)', color='white')
ax1.set_title('Keystoneness ranking (removal impact)', color='white', fontsize=11)
ax1.invert_yaxis()

# Dependency distribution
ax2 = axes[1, 0]
deps = [info['banyan_dep'] for info in net.species.values()]
ax2.hist(deps, bins=10, range=(0,1), color='#22c55e', edgecolor='#111827', alpha=0.8)
ax2.set_xlabel('Banyan dependency (0=none, 1=obligate)', color='white')
ax2.set_ylabel('Number of species', color='white')
ax2.set_title('Dependency distribution', color='white', fontsize=11)

# Cascade visualization for banyan removal
ax3 = axes[1, 1]
banyan_result = net.remove_species('Banyan')
lost_cats = {}
for sp in banyan_result['lost_species']:
    if sp in net.species:
        cat = net.species[sp]['category']
        lost_cats[cat] = lost_cats.get(cat, 0) + 1

cats = list(lost_cats.keys())
counts = [lost_cats[c] for c in cats]
cat_colors = [categories.get(c, 'gray') for c in cats]
ax3.bar(cats, counts, color=cat_colors)
ax3.set_xlabel('Category', color='white')
ax3.set_ylabel('Species lost', color='white')
ax3.set_title(f'Banyan removal cascade ({banyan_result["n_lost"]} species lost)', color='white', fontsize=11)

for label in ax3.get_xticklabels():
    label.set_color('white')
    label.set_fontsize(8)
    label.set_rotation(45)

plt.tight_layout()
plt.show()

print(f"Network: {n_sp} species, {len(net.interactions)} interactions")
print(f"\\nBanyan removal: {banyan_result['n_lost']} species lost ({banyan_result['pct_lost']:.0f}%)")
print(f"Cascade rounds: {banyan_result['cascade_rounds']}")
print(f"\\nTop 5 keystone species:")
for r in removal_results[:5]:
    print(f"  {r['removed']}: removing it loses {r['n_lost']} species ({r['pct_lost']:.0f}%)")`,
      challenge: 'Add redundancy: for each species, add a second, weaker interaction to a different food source. How does redundancy change the banyan keystoneness score? At what redundancy level does the banyan stop being the top keystone species?',
      successHint: 'You can now quantify ecological keystoneness through network analysis and cascade simulation — the scientific foundation for conservation prioritization.',
    },
    {
      title: 'Allometric scaling — predicting tree age from measurable dimensions',
      concept: `Estimating a banyan tree's age is notoriously difficult: they do not produce clear annual rings in tropical climates, and their multi-trunk structure defies simple measurement. Instead, we use **allometric scaling** — mathematical relationships between measurable tree dimensions.

Allometric relationships follow power laws:
  Y = a × X^b

Where X and Y are different measurements (trunk girth, canopy diameter, height, root count). The exponents arise from physical constraints:

- **Metabolic scaling**: West-Brown-Enquist theory predicts that biological rates scale with mass^(3/4) because of fractal nutrient distribution networks. For trees: diameter ~ mass^(3/8), height ~ mass^(1/4).
- **Structural scaling**: To support its own weight, a tree column must not buckle. This requires diameter to scale as height^(3/2) — Greenhill's formula for elastic self-buckling.
- **Canopy scaling**: Canopy area scales with trunk cross-section because each unit of trunk area must transport water to a proportional area of leaves.

For banyans specifically, the relationship between **total basal area** (sum of cross-sections of all trunks/pillars) and canopy area is more predictive than any single-trunk measurement. Total basal area integrates the entire support system.

Age estimation combines multiple allometric predictors: canopy diameter, aerial root count, total basal area, and height. Each has measurement error; combining them with regression reduces the uncertainty.`,
      analogy: 'Allometric scaling is like estimating a person age from their measurements. You cannot count their birthdays, but you can measure height, weight, grey hair percentage, and skin elasticity. Each measurement correlates imperfectly with age, but together they narrow the estimate. Similarly, each tree measurement correlates imperfectly with age, but the allometric ensemble converges on a reliable estimate.',
      storyConnection: 'The ancient banyan in the story was said to be hundreds of years old. But how would you verify that? You cannot cut it down to count rings. Allometric scaling lets you estimate age non-destructively: measure the canopy, count the aerial roots, total up the trunk cross-sections, and let the power laws translate measurements into years.',
      checkQuestion: 'Why does total basal area predict canopy size better than a single trunk diameter measurement for banyans?',
      checkAnswer: 'A banyan with 200 pillar roots has a narrow main trunk relative to its canopy — the main trunk alone vastly underestimates the water transport and structural capacity. Total basal area (sum of all trunk and pillar root cross-sections) captures the entire hydraulic and structural system. It accounts for the distributed support architecture that makes banyans unique among trees. Single-trunk allometry is designed for single-trunk trees and fails for multi-stemmed organisms.',
      codeIntro: 'Fit allometric power laws to simulated banyan measurement data and build a multi-predictor age estimation model.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Generate allometric dataset ---
# Simulate measurements from 80 banyans of known age (from dated records)
n_trees = 80
true_ages = np.random.uniform(20, 500, n_trees)  # years

# Allometric relationships (with noise)
def generate_measurements(ages):
    n = len(ages)
    # Canopy diameter (m): scales roughly as age^0.5
    canopy_diam = 2.5 * ages**0.45 * np.random.lognormal(0, 0.15, n)

    # Aerial root count: increases with age^1.2 (accelerating)
    root_count = 0.02 * ages**1.3 * np.random.lognormal(0, 0.25, n)
    root_count = np.round(root_count).astype(int)

    # Total basal area (m²): sum of all trunk cross-sections
    # scales as age^0.8
    total_basal = 0.001 * ages**0.85 * np.random.lognormal(0, 0.2, n)

    # Height (m): saturates early (logistic-like)
    max_height = 25
    height = max_height * (1 - np.exp(-0.01 * ages)) * np.random.lognormal(0, 0.08, n)

    # Main trunk girth (m): grows then plateaus as pillars take over
    girth = 0.1 * ages**0.4 * np.random.lognormal(0, 0.2, n)
    girth = np.minimum(girth, 15)  # cap at 15m

    return canopy_diam, root_count, total_basal, height, girth

canopy, roots, basal, height, girth = generate_measurements(true_ages)

# --- Fit power law: log(Y) = log(a) + b*log(X) ---
def fit_power_law(x, y):
    """Fit Y = a * X^b using log-linear regression."""
    log_x = np.log(x + 1e-10)
    log_y = np.log(y + 1e-10)
    # Linear regression in log space
    n = len(x)
    sx = np.sum(log_x)
    sy = np.sum(log_y)
    sxx = np.sum(log_x**2)
    sxy = np.sum(log_x * log_y)
    b = (n*sxy - sx*sy) / (n*sxx - sx**2)
    log_a = (sy - b*sx) / n
    a = np.exp(log_a)

    # R²
    y_pred = a * x**b
    ss_res = np.sum((y - y_pred)**2)
    ss_tot = np.sum((y - np.mean(y))**2)
    r2 = 1 - ss_res/ss_tot

    return a, b, r2

# Fit allometric relationships
predictors = [
    ('Canopy diameter', canopy),
    ('Root count', roots.astype(float)),
    ('Total basal area', basal),
    ('Height', height),
    ('Main trunk girth', girth),
]

print("Allometric relationships: Age = a * X^b")
print("=" * 55)
fits = {}
for name, x in predictors:
    a, b, r2 = fit_power_law(x, true_ages)
    fits[name] = (a, b, r2)
    print(f"  {name:20s}: a={a:.4f}, b={b:.3f}, R²={r2:.3f}")

# --- Multi-predictor regression ---
# log(age) = w0 + w1*log(canopy) + w2*log(roots) + w3*log(basal) + ...
log_age = np.log(true_ages)
X_multi = np.column_stack([
    np.log(canopy + 0.1),
    np.log(roots + 1),
    np.log(basal + 0.001),
    np.log(height + 0.1),
])
X_aug = np.column_stack([np.ones(n_trees), X_multi])

# Normal equations: w = (X'X)^-1 X'y
w = np.linalg.lstsq(X_aug, log_age, rcond=None)[0]
pred_log_age = X_aug @ w
pred_age = np.exp(pred_log_age)

ss_res = np.sum((true_ages - pred_age)**2)
ss_tot = np.sum((true_ages - np.mean(true_ages))**2)
r2_multi = 1 - ss_res/ss_tot
rmse = np.sqrt(np.mean((true_ages - pred_age)**2))

# --- Plot ---
fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')

for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Individual allometric fits
for idx, (name, x) in enumerate(predictors[:4]):
    ax = axes.flat[idx]
    a, b, r2 = fits[name]
    ax.scatter(x, true_ages, s=15, c='#22c55e', alpha=0.6)
    x_fit = np.linspace(x.min(), x.max(), 100)
    ax.plot(x_fit, a * x_fit**b, color='#f59e0b', linewidth=2)
    ax.set_xlabel(name, color='white', fontsize=9)
    ax.set_ylabel('Age (years)', color='white', fontsize=9)
    ax.set_title(f'{name} (R²={r2:.3f})', color='white', fontsize=10)

# Multi-predictor result
ax4 = axes[1, 1]
ax4.scatter(true_ages, pred_age, s=15, c='#3b82f6', alpha=0.6)
ax4.plot([0, 500], [0, 500], '--', color='#f59e0b', linewidth=1, label='Perfect prediction')
ax4.set_xlabel('True age (years)', color='white')
ax4.set_ylabel('Predicted age (years)', color='white')
ax4.set_title(f'Multi-predictor model (R²={r2_multi:.3f})', color='white', fontsize=10)
ax4.legend(fontsize=8)

# Error distribution
ax5 = axes[1, 2]
errors = pred_age - true_ages
pct_errors = errors / true_ages * 100
ax5.hist(pct_errors, bins=20, color='#a855f7', edgecolor='#111827', alpha=0.8)
ax5.axvline(0, color='white', linestyle='--')
ax5.set_xlabel('Prediction error (%)', color='white')
ax5.set_ylabel('Count', color='white')
ax5.set_title(f'Error distribution (RMSE={rmse:.0f} years)', color='white', fontsize=10)

plt.tight_layout()
plt.show()

print(f"\\nMulti-predictor model:")
print(f"  R² = {r2_multi:.3f}")
print(f"  RMSE = {rmse:.0f} years")
print(f"  Median absolute error: {np.median(np.abs(errors)):.0f} years")
print(f"  90% of predictions within ±{np.percentile(np.abs(pct_errors), 90):.0f}%")`,
      challenge: 'Use leave-one-out cross-validation: for each tree, train the model on the other 79 and predict its age. Compare the cross-validated R² to the in-sample R². How much overfitting is there?',
      successHint: 'You can now estimate banyan tree age from non-destructive measurements using allometric power laws and multi-predictor regression.',
    },
    {
      title: 'Conservation modeling — predicting banyan population dynamics under threats',
      concept: `Banyans face multiple threats: urbanization (root cutting for construction), climate change (altered fruiting phenology), and loss of pollinators (fig wasps are highly sensitive to temperature). Modeling population dynamics under these threats informs conservation strategy.

The population model uses a **stage-structured matrix** (Leslie matrix variant):

Stages: Seedling → Juvenile (< 10 years) → Mature (10-100 years) → Ancient (> 100 years)

Each stage has:
- **Survival probability**: fraction surviving to next time step.
- **Growth probability**: fraction transitioning to next stage.
- **Fecundity**: number of seedlings produced per individual.

The matrix equation: N(t+1) = M × N(t)

Where N is the population vector [seedlings, juveniles, matures, ancients] and M is the transition matrix.

Under threats, we modify survival rates:
- **Urbanization**: reduces survival of all stages (root cutting, pollution).
- **Climate change**: reduces seedling survival (altered germination conditions) and fecundity (pollinator mismatch).
- **Pollinator loss**: directly reduces fecundity to near zero.

The **dominant eigenvalue** of M determines population growth rate. If λ₁ > 1, population grows. If λ₁ < 1, it declines. The **eigenvector** gives the stable stage distribution. We compute these under different threat scenarios to identify which threats are most dangerous and which life stages are most vulnerable.`,
      analogy: 'Population modeling is like a business forecasting its workforce. You track employees at different levels: interns, junior, senior, executive. Each level has a retention rate (survival), a promotion rate (growth), and a hiring rate (fecundity). If you cut hiring (pollinator loss), the pipeline dries up. If you increase turnover at the senior level (urbanization cutting mature trees), you lose institutional knowledge. The model predicts which interventions prevent workforce collapse.',
      storyConnection: 'The story ends with the village protecting their ancient banyan. But one tree is not a population. Conservation requires understanding whether banyans across the region are replacing themselves fast enough to persist. Our model reveals whether the ancient tree in the story is the last of its kind or one of a healthy population — and what must change if the answer is alarming.',
      checkQuestion: 'Why is pollinator loss potentially more catastrophic than urbanization for banyan populations?',
      checkAnswer: 'Urbanization reduces survival rates across all stages, but some individuals survive. Pollinator loss (fig wasp extinction) reduces fecundity to zero — no new seedlings at all. With zero recruitment, the population decays deterministically: existing trees age and die with no replacements. A population with reduced survival can recover if conditions improve; a population with zero fecundity is on a terminal countdown. The demographic algebra is unforgiving.',
      codeIntro: 'Build a stage-structured population model, compute eigenvalue growth rates, and simulate banyan population trajectories under threat scenarios.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Stage-structured population model ---
class BanyanPopulationModel:
    """Leslie-type matrix model for banyan populations."""

    STAGES = ['Seedling', 'Juvenile', 'Mature', 'Ancient']

    def __init__(self, survival, growth, fecundity):
        """
        survival: [s0, s1, s2, s3] — survival prob per stage per decade
        growth: [g01, g12, g23] — transition prob to next stage per decade
        fecundity: [f0, f1, f2, f3] — seedlings produced per individual per decade
        """
        self.survival = np.array(survival)
        self.growth = np.array(growth)
        self.fecundity = np.array(fecundity)
        self.matrix = self._build_matrix()

    def _build_matrix(self):
        s, g, f = self.survival, self.growth, self.fecundity
        # M[i,j] = contribution of stage j to stage i next time step
        M = np.zeros((4, 4))
        # Fecundity (top row): each stage produces seedlings
        M[0, :] = f
        # Survival in same stage (diagonal)
        M[0, 0] += s[0] * (1 - g[0])  # seedlings that survive but don\'t grow
        M[1, 1] = s[1] * (1 - g[1])
        M[2, 2] = s[2] * (1 - g[2])
        M[3, 3] = s[3]  # ancients stay ancient
        # Growth to next stage (sub-diagonal)
        M[1, 0] = s[0] * g[0]
        M[2, 1] = s[1] * g[1]
        M[3, 2] = s[2] * g[2]
        return M

    def growth_rate(self):
        """Dominant eigenvalue = population growth rate."""
        eigenvalues = np.linalg.eigvals(self.matrix)
        return np.max(np.abs(eigenvalues))

    def stable_distribution(self):
        """Stable stage distribution (dominant eigenvector)."""
        eigenvalues, eigenvectors = np.linalg.eig(self.matrix)
        dominant_idx = np.argmax(np.abs(eigenvalues))
        v = np.abs(eigenvectors[:, dominant_idx])
        return v / v.sum()

    def simulate(self, initial_pop, decades=50):
        """Simulate population over time."""
        N = np.array(initial_pop, dtype=float)
        history = [N.copy()]
        for _ in range(decades):
            N = self.matrix @ N
            N = np.maximum(N, 0)
            history.append(N.copy())
        return np.array(history)

# --- Define scenarios ---
# Baseline: healthy population
baseline = BanyanPopulationModel(
    survival=[0.3, 0.85, 0.95, 0.90],   # seedlings have low survival
    growth=[0.1, 0.15, 0.05],            # slow stage transitions
    fecundity=[0, 0, 5.0, 8.0],          # only mature/ancient reproduce
)

# Urbanization: reduced survival across all stages
urban = BanyanPopulationModel(
    survival=[0.15, 0.65, 0.75, 0.70],
    growth=[0.1, 0.15, 0.05],
    fecundity=[0, 0, 3.0, 5.0],
)

# Climate change: reduced seedling survival + fecundity
climate = BanyanPopulationModel(
    survival=[0.10, 0.80, 0.92, 0.88],
    growth=[0.08, 0.12, 0.05],
    fecundity=[0, 0, 2.0, 3.0],
)

# Pollinator loss: near-zero fecundity
pollinator = BanyanPopulationModel(
    survival=[0.3, 0.85, 0.95, 0.90],
    growth=[0.1, 0.15, 0.05],
    fecundity=[0, 0, 0.1, 0.2],          # almost no reproduction
)

# Conservation: enhanced survival + restoration planting
conservation = BanyanPopulationModel(
    survival=[0.45, 0.90, 0.97, 0.93],
    growth=[0.12, 0.15, 0.05],
    fecundity=[0, 0, 6.0, 10.0],
)

scenarios = {
    'Baseline': baseline,
    'Urbanization': urban,
    'Climate change': climate,
    'Pollinator loss': pollinator,
    'Conservation': conservation,
}

initial = [500, 100, 50, 10]  # current population vector
decades = 30

# --- Simulate ---
results = {}
for name, model in scenarios.items():
    lam = model.growth_rate()
    dist = model.stable_distribution()
    history = model.simulate(initial, decades)
    results[name] = {'lambda': lam, 'distribution': dist, 'history': history}

# --- Plot ---
fig, axes = plt.subplots(2, 2, figsize=(13, 10))
fig.patch.set_facecolor('#1f2937')
for ax in axes.flat:
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray')

# Total population trajectories
ax0 = axes[0, 0]
colors_sc = {'Baseline':'#22c55e', 'Urbanization':'#ef4444',
             'Climate change':'#f59e0b', 'Pollinator loss':'#a855f7',
             'Conservation':'#3b82f6'}
for name, res in results.items():
    total_pop = res['history'].sum(axis=1)
    time = np.arange(len(total_pop)) * 10
    ax0.plot(time, total_pop, linewidth=2, color=colors_sc[name],
             label=f"{name} (λ={res['lambda']:.3f})")
ax0.set_xlabel('Years', color='white')
ax0.set_ylabel('Total population', color='white')
ax0.set_title('Population trajectories', color='white', fontsize=11)
ax0.legend(fontsize=8)
ax0.axhline(sum(initial), color='gray', linestyle=':', alpha=0.5)

# Growth rates comparison
ax1 = axes[0, 1]
names = list(scenarios.keys())
lambdas = [results[n]['lambda'] for n in names]
bar_colors = [colors_sc[n] for n in names]
bars = ax1.bar(range(len(names)), lambdas, color=bar_colors)
ax1.axhline(1.0, color='white', linestyle='--', label='λ=1 (stable)')
ax1.set_xticks(range(len(names)))
ax1.set_xticklabels(names, rotation=30, ha='right', color='white', fontsize=8)
ax1.set_ylabel('Growth rate (λ)', color='white')
ax1.set_title('Population growth rates', color='white', fontsize=11)
ax1.legend(fontsize=8)

# Stable stage distributions
ax2 = axes[1, 0]
x = np.arange(4)
width = 0.15
for i, (name, res) in enumerate(results.items()):
    ax2.bar(x + i*width, res['distribution'], width, color=colors_sc[name], label=name)
ax2.set_xticks(x + width*2)
ax2.set_xticklabels(BanyanPopulationModel.STAGES, color='white', fontsize=9)
ax2.set_ylabel('Proportion', color='white')
ax2.set_title('Stable stage distributions', color='white', fontsize=11)
ax2.legend(fontsize=7)

# Stage-specific trajectories (baseline vs worst)
ax3 = axes[1, 1]
for i, stage in enumerate(BanyanPopulationModel.STAGES):
    time = np.arange(decades+1) * 10
    ax3.plot(time, results['Baseline']['history'][:, i], color=f'C{i}',
             linewidth=2, label=f'{stage} (baseline)')
    ax3.plot(time, results['Pollinator loss']['history'][:, i], color=f'C{i}',
             linewidth=1, linestyle='--', label=f'{stage} (no pollinator)')
ax3.set_xlabel('Years', color='white')
ax3.set_ylabel('Population', color='white')
ax3.set_title('Stage dynamics: baseline vs pollinator loss', color='white', fontsize=10)
ax3.legend(fontsize=6, ncol=2)

plt.tight_layout()
plt.show()

print("Population Growth Rates (λ):")
print("=" * 45)
for name in names:
    lam = results[name]['lambda']
    status = 'GROWING' if lam > 1 else 'DECLINING' if lam < 1 else 'STABLE'
    doubling = np.log(2) / np.log(lam) * 10 if lam > 1 else float('inf')
    halving = np.log(0.5) / np.log(lam) * 10 if lam < 1 else float('inf')
    time_str = f"doubles in {doubling:.0f} years" if lam > 1 else f"halves in {abs(halving):.0f} years"
    print(f"  {name:20s}: λ={lam:.4f} [{status}] — {time_str}")`,
      challenge: 'Implement a sensitivity analysis: vary each survival and fecundity parameter by ±20% one at a time and measure the change in λ. Which parameter has the largest effect on population growth? This identifies the most effective conservation intervention target.',
      successHint: 'You have built a complete conservation analysis: from growth dynamics to biomechanics to population modeling. The integration of ecological theory with computational tools is what makes modern conservation science effective.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Machine Learning Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (ecology and biomechanics fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for ecological modeling and biomechanical analysis. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
