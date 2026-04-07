import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CathedralsLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: '2D finite element analysis for arch structures',
      concept: `In Level 2, we calculated stress at individual points. **Finite element analysis (FEA)** divides the entire arch into a mesh of small triangular or rectangular elements and solves for the stress and displacement in every element simultaneously.

The key equations come from **elasticity theory**: each element deforms according to its stiffness (Young's modulus), and adjacent elements must remain connected (compatibility condition). The forces at every node must balance (equilibrium condition).

For a 2D arch, we discretise the structure into a grid of elements. Each element has:
- A **stiffness matrix** that relates forces to displacements: [K]{u} = {F}
- **Boundary conditions** — the base of the arch is fixed (zero displacement)
- **Applied loads** — the weight of stone above and any external loads

Solving the global system [K_global]{u} = {F_global} gives the displacement at every node, from which we calculate the stress in every element.

📚 *FEA was invented in the 1940s-50s for aircraft design. Today it's used for everything from artificial joints to nuclear reactors. The principle: divide a complex shape into simple pieces, solve each piece, and assemble the results.*`,
      analogy: 'Imagine a chain mail shirt — thousands of small rings linked together. If you pull on one ring, all the neighbouring rings deform slightly, spreading the load. FEA treats a structure the same way: thousands of small elements linked at nodes, each sharing load with its neighbours. The mesh of elements is like the chain mail — each one is simple, but together they capture complex behaviour.',
      storyConnection: 'The pointed arch of a Gothic cathedral concentrates forces differently from a semicircular Romanesque arch. FEA reveals exactly where stress concentrations form — at the springing points (where the arch meets the wall) and at the keystone. Medieval builders learned this from collapses; we learn it from computation.',
      checkQuestion: 'An FEA mesh has 200 nodes, each with 2 degrees of freedom (x and y displacement). How many equations must be solved simultaneously?',
      checkAnswer: '400 equations (200 nodes × 2 DOF). The global stiffness matrix is 400×400. For a real 3D cathedral model with millions of nodes, the matrix can have billions of entries — which is why FEA requires powerful computers and efficient sparse matrix solvers.',
      codeIntro: 'Build a simplified 2D finite element model of a pointed Gothic arch under gravity loading.',
      code: `import numpy as np

class Arch2DFEA:
    """Simplified 2D FEA for a pointed Gothic arch using bar elements."""

    def __init__(self, span_m, rise_m, n_segments=16, thickness_m=0.8):
        self.span = span_m
        self.rise = rise_m
        self.n_seg = n_segments
        self.thickness = thickness_m
        self.E = 20e9       # Young's modulus (Pa) — limestone
        self.density = 2500  # kg/m³
        self.area = thickness_m * 1.0  # cross-sectional area (m²)

        # Generate arch nodes along a pointed arch curve
        self.nodes = self._generate_nodes()
        self.n_nodes = len(self.nodes)

    def _generate_nodes(self):
        """Generate nodes along a pointed Gothic arch."""
        half = self.span / 2
        R = (half**2 + self.rise**2) / (2 * self.rise)
        arc_angle = np.arcsin(half / R)

        nodes = []
        # Left half: centre at (half, 0)
        cx = half
        for i in range(self.n_seg // 2 + 1):
            theta = np.pi - arc_angle + i * (arc_angle / (self.n_seg // 2))
            x = cx + R * np.cos(theta)
            y = R * np.sin(theta)
            nodes.append((x, y))

        # Right half: centre at (-half + span, 0) = (half, 0) mirrored
        cx2 = half
        for i in range(1, self.n_seg // 2 + 1):
            theta = np.pi + i * (arc_angle / (self.n_seg // 2))
            x = cx2 + R * np.cos(theta) + self.span - 2 * half
            # Mirror approach: use symmetry
            left_idx = self.n_seg // 2 - i
            if left_idx >= 0:
                x = self.span - nodes[left_idx][0]
                y = nodes[left_idx][1]
            nodes.append((x, y))

        return np.array(nodes)

    def solve(self):
        """Assemble and solve the global system."""
        n = self.n_nodes
        ndof = 2 * n

        # Global stiffness matrix and force vector
        K = np.zeros((ndof, ndof))
        F = np.zeros(ndof)

        # Assemble bar elements
        for i in range(n - 1):
            x1, y1 = self.nodes[i]
            x2, y2 = self.nodes[i + 1]
            L = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
            c = (x2 - x1) / L  # cos
            s = (y2 - y1) / L  # sin

            # Element stiffness in global coordinates
            k_local = self.E * self.area / L
            ke = k_local * np.array([
                [ c*c,  c*s, -c*c, -c*s],
                [ c*s,  s*s, -c*s, -s*s],
                [-c*c, -c*s,  c*c,  c*s],
                [-c*s, -s*s,  c*s,  s*s],
            ])

            # Global DOF indices
            dofs = [2*i, 2*i+1, 2*(i+1), 2*(i+1)+1]
            for a in range(4):
                for b in range(4):
                    K[dofs[a], dofs[b]] += ke[a, b]

            # Gravity load (distribute element weight to its two nodes)
            weight = self.density * self.area * L * 9.81
            F[2*i + 1] -= weight / 2      # y-direction (downward)
            F[2*(i+1) + 1] -= weight / 2

        # Boundary conditions: pin supports at both ends
        fixed_dofs = [0, 1, 2*(n-1), 2*(n-1)+1]
        free_dofs = [d for d in range(ndof) if d not in fixed_dofs]

        # Solve reduced system
        K_red = K[np.ix_(free_dofs, free_dofs)]
        F_red = F[free_dofs]

        # Add small diagonal for numerical stability
        K_red += np.eye(len(free_dofs)) * 1e-6

        u_red = np.linalg.solve(K_red, F_red)

        # Full displacement vector
        u = np.zeros(ndof)
        for i, d in enumerate(free_dofs):
            u[d] = u_red[i]

        # Calculate element forces and stresses
        stresses = []
        for i in range(n - 1):
            x1, y1 = self.nodes[i]
            x2, y2 = self.nodes[i + 1]
            L = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
            c = (x2 - x1) / L
            s = (y2 - y1) / L

            du = np.array([u[2*(i+1)] - u[2*i], u[2*(i+1)+1] - u[2*i+1]])
            axial_deform = c * du[0] + s * du[1]
            stress = self.E * axial_deform / L
            stresses.append(stress)

        return u, np.array(stresses)

# Analyse a Gothic arch
arch = Arch2DFEA(span_m=10, rise_m=15, n_segments=16, thickness_m=0.8)
displacements, stresses = arch.solve()

print("=== 2D FEA of Pointed Gothic Arch ===")
print(f"Span: {arch.span}m | Rise: {arch.rise}m | Segments: {arch.n_seg}")
print(f"Material: Limestone (E={arch.E/1e9:.0f} GPa)")
print()

print(f"{'Node':>5} {'X (m)':>8} {'Y (m)':>8} {'dX (mm)':>10} {'dY (mm)':>10}")
print("-" * 43)
for i in range(arch.n_nodes):
    x, y = arch.nodes[i]
    dx = displacements[2*i] * 1000
    dy = displacements[2*i + 1] * 1000
    if i % 2 == 0 or i == arch.n_nodes - 1:
        print(f"{i:>5} {x:>7.2f} {y:>7.2f} {dx:>9.4f} {dy:>9.4f}")

print(f"\\nMax vertical displacement: {np.min(displacements[1::2])*1000:.4f} mm")
print(f"Max horizontal displacement: {np.max(np.abs(displacements[0::2]))*1000:.4f} mm")
print(f"\\nElement stresses (MPa):")
print(f"  Max compression: {np.min(stresses)/1e6:.2f} MPa")
print(f"  Max tension: {np.max(stresses)/1e6:.2f} MPa")
print(f"  Limestone strength: ~40 MPa compression")
safety = 40 / (abs(np.min(stresses))/1e6) if abs(np.min(stresses)) > 0 else float('inf')
print(f"  Safety factor: {safety:.1f}")`,
      challenge: 'Increase the span to 15 m while keeping the rise the same. How does this change the stress distribution? Now increase the rise to 20 m. Gothic builders discovered that taller, narrower arches (higher rise-to-span ratio) produce lower horizontal thrust — which is why the pointed arch replaced the round arch.',
      successHint: 'You just built a working finite element solver from scratch — assembling element stiffness matrices, applying boundary conditions, and solving the global system. This is the core algorithm behind every commercial FEA package (ANSYS, Abaqus, SAP2000). Real packages use millions of elements; yours used 16. The principle is identical.',
    },
    {
      title: 'Wind loading on tall structures — lateral forces on cathedral towers',
      concept: `Gothic cathedrals are among the tallest medieval structures, with spires reaching 100+ metres. At these heights, **wind loading** becomes a critical design concern. Wind pressure increases with height (the **wind profile**), and tall, slender structures can experience dynamic effects like **vortex shedding** and **resonance**.

The basic wind pressure at height z is: **q(z) = 0.5 × ρ × v(z)²**

where ρ is air density (~1.225 kg/m³) and v(z) is the wind speed at height z. Wind speed increases with height following the **power law**: v(z) = v_ref × (z / z_ref)^α, where α ≈ 0.2 for open terrain.

The total wind force on a structure is: **F = q × Cd × A**, where Cd is the drag coefficient (depends on shape) and A is the projected area.

For a cathedral tower or spire, the overturning moment at the base equals the integral of wind pressure × height over the full height — creating enormous stress at the foundation.

📚 *The power law wind profile reflects the fact that wind is slowed by friction with the ground. At ground level, buildings and terrain slow the wind. Higher up, there's less obstruction, so wind speed increases.*`,
      analogy: 'Hold a piece of cardboard flat in the wind — it catches the wind and pulls hard. Turn it edge-on — almost no force. A cathedral tower is like a giant piece of cardboard: its broad face catches the wind, creating a massive lateral force. The wider the face and the taller the tower, the greater the overturning moment at the base.',
      storyConnection: 'The spire of Beauvais Cathedral (153 m — the tallest structure in medieval Europe) collapsed in 1573, just four years after completion. Wind loading was a major factor: at 153 m, the wind pressure is roughly 2.5× what it is at ground level. The stone masonry simply couldn\'t resist the lateral forces at that height.',
      checkQuestion: 'Wind speed doubles from 20 m/s to 40 m/s. By what factor does the wind pressure increase?',
      checkAnswer: 'Wind pressure is proportional to v². So doubling speed quadruples pressure: (40/20)² = 4×. This is why storms are so destructive — a Category 4 hurricane (250 km/h) exerts 4× the pressure of a Category 2 (180 km/h), even though the speed only increased by 40%.',
      codeIntro: 'Calculate wind loading profiles on Gothic cathedral towers and determine overturning moments.',
      code: `import numpy as np

def wind_speed_profile(z, v_ref=20, z_ref=10, alpha=0.2):
    """Wind speed at height z using power law profile."""
    return v_ref * (z / z_ref)**alpha

def wind_pressure(v, rho=1.225):
    """Dynamic wind pressure (Pa)."""
    return 0.5 * rho * v**2

def tower_wind_analysis(height_m, width_m, depth_m, n_layers=20,
                        v_ref=20, Cd=1.3):
    """
    Calculate wind loading on a cathedral tower.
    Returns total force, base moment, and stress at base.
    """
    dz = height_m / n_layers
    total_force = 0
    base_moment = 0
    layer_data = []

    for i in range(n_layers):
        z_mid = (i + 0.5) * dz
        v = wind_speed_profile(z_mid, v_ref)
        q = wind_pressure(v)
        area = width_m * dz  # projected area of this layer
        force = q * Cd * area
        moment = force * z_mid

        total_force += force
        base_moment += moment
        layer_data.append((z_mid, v, q, force))

    # Base stress: moment / section modulus
    # Section modulus of rectangular base: W = width × depth² / 6
    W = width_m * depth_m**2 / 6
    base_stress_kpa = base_moment / W / 1000

    return {
        "total_force": total_force,
        "base_moment": base_moment,
        "base_stress_kpa": base_stress_kpa,
        "layers": layer_data,
    }

# Analyse famous cathedral towers
towers = [
    ("Chartres (south)", 105, 16, 16),
    ("Notre-Dame tower", 69, 13, 13),
    ("Beauvais spire", 153, 8, 8),
    ("Cologne spire", 157, 12, 12),
    ("Salisbury spire", 123, 9, 9),
]

print("=== Wind Loading on Gothic Cathedral Towers ===")
print(f"Reference wind: 20 m/s at 10m height | Drag coeff: 1.3\\n")

print(f"{'Tower':<24} {'H(m)':>5} {'V_top':>7} {'Force':>8} "
      f"{'Moment':>10} {'Base σ':>10}")
print("-" * 68)

for name, h, w, d in towers:
    r = tower_wind_analysis(h, w, d)
    v_top = wind_speed_profile(h)
    print(f"{name:<24} {h:>4}m {v_top:>5.1f}m/s {r['total_force']:>6.0f}kN "
          f"{r['base_moment']:>8.0f}kN·m {r['base_stress_kpa']:>8.0f}kPa")

# Wind speed sensitivity analysis
print("\\n=== Beauvais Spire: Wind Speed Sensitivity ===")
for v_ref in [10, 15, 20, 25, 30, 40]:
    r = tower_wind_analysis(153, 8, 8, v_ref=v_ref)
    stone_limit = 2000  # kPa — tensile/bending limit for limestone
    ratio = r["base_stress_kpa"] / stone_limit * 100
    status = "SAFE" if ratio < 50 else "MARGINAL" if ratio < 80 else "DANGER"
    print(f"  v_ref={v_ref:>2} m/s: Force={r['total_force']:>6.0f}kN  "
          f"Stress={r['base_stress_kpa']:>6.0f}kPa  "
          f"({ratio:.0f}% of limit) [{status}]")

# Wind profile visualization
print("\\n=== Wind Speed Profile (height vs speed) ===")
heights = [0, 10, 20, 30, 50, 75, 100, 125, 150]
for z in heights:
    if z == 0:
        continue
    v = wind_speed_profile(z)
    bar = "#" * int(v * 2)
    print(f"  {z:>4}m: {v:>5.1f} m/s {bar}")`,
      challenge: 'Gothic spires often taper (get narrower with height). Modify the analysis so the tower width decreases linearly from the base width to 50% at the top. How does tapering change the total force and base moment compared to a uniform tower? This is why spires taper — reducing the projected area where wind pressure is highest.',
      successHint: 'Wind loading analysis is a core requirement for every tall structure designed today. You just calculated the same forces that structural engineers compute using wind tunnel tests and computational fluid dynamics (CFD). The power-law wind profile and drag force equations are used worldwide in building codes (Eurocode, ASCE 7, etc.).',
    },
    {
      title: 'Rose window geometry — n-fold symmetry and mathematical patterns',
      concept: `The great rose windows of Gothic cathedrals are masterpieces of geometric design. They exhibit **n-fold rotational symmetry** — the pattern repeats n times around the centre. Chartres' north rose has **12-fold symmetry**; Notre-Dame's west rose has **12-fold** as well, but with a different internal structure.

The geometry is built from nested rings of elements:
1. A **central roundel** (the "oculus")
2. **Inner ring** of n lancets (pointed arched panels) radiating from the centre
3. **Outer rings** of smaller lancets, often with 2n or 3n elements
4. **Tracery** — the stone framework that holds the glass, made from arcs of circles

The mathematical beauty: the positions and sizes of all elements can be computed from just the **number of petals (n)**, the **window radius**, and the **tracery width**. Every element is defined by intersecting circles.

📚 *Rotational symmetry of order n means the pattern looks identical after rotating by 360°/n. A regular hexagon has 6-fold symmetry. A circle has infinite-fold symmetry. Rose windows use 6, 8, 10, or 12-fold symmetry.*`,
      analogy: 'Cut a circular piece of paper, fold it into n equal wedges (like a pizza), and cut a pattern along one edge. Unfold it — you get n-fold symmetry. Rose windows are designed the same way: the master mason designed one wedge (1/n of the circle) and repeated it n times. The beauty comes from the interaction of the repeated elements.',
      storyConnection: 'The north rose window of Chartres (c. 1235) is considered the finest rose window ever created. Its 12-fold symmetry contains 12 lancets in the inner ring, 12 quatrefoils in the next ring, and 12 smaller circles in the outer ring — a total of 169 glass panels, each a different colour, creating a kaleidoscopic effect when sunlight strikes.',
      checkQuestion: 'A rose window has 8-fold symmetry and a radius of 5 m. What is the angular spacing between petals, and how wide is each petal at the outer edge?',
      checkAnswer: 'Angular spacing = 360°/8 = 45°. At the outer edge (radius 5 m), the arc length of each petal = 2π × 5 / 8 = 3.93 m. But the tracery (stone frame) takes up about 15% of this width, leaving ~3.3 m of glass per petal.',
      codeIntro: 'Generate the mathematical geometry of a Gothic rose window with n-fold symmetry.',
      code: `import numpy as np

class RoseWindow:
    """Mathematical model of a Gothic rose window with n-fold symmetry."""

    def __init__(self, n_petals=12, radius_m=5.0, tracery_width_m=0.12):
        self.n = n_petals
        self.R = radius_m
        self.tw = tracery_width_m

    def generate_geometry(self):
        """Compute all geometric elements of the rose window."""
        n = self.n
        R = self.R
        angle_step = 2 * np.pi / n

        # Central oculus
        oculus_r = R * 0.12
        oculus_area = np.pi * oculus_r**2

        # Inner ring: n lancet panels
        inner_r_start = oculus_r + self.tw
        inner_r_end = R * 0.4
        inner_panels = []
        for i in range(n):
            theta = i * angle_step
            # Panel centroid
            r_mid = (inner_r_start + inner_r_end) / 2
            cx = r_mid * np.cos(theta + angle_step / 2)
            cy = r_mid * np.sin(theta + angle_step / 2)
            # Panel area (sector minus tracery)
            arc_length = r_mid * angle_step
            height = inner_r_end - inner_r_start
            panel_area = (arc_length - self.tw) * height
            inner_panels.append({
                "id": f"I-{i+1}", "cx": cx, "cy": cy,
                "area": max(panel_area, 0), "ring": "inner"
            })

        # Middle ring: 2n smaller panels
        mid_r_start = inner_r_end + self.tw
        mid_r_end = R * 0.7
        mid_panels = []
        for i in range(2 * n):
            theta = i * angle_step / 2
            r_mid = (mid_r_start + mid_r_end) / 2
            cx = r_mid * np.cos(theta + angle_step / 4)
            cy = r_mid * np.sin(theta + angle_step / 4)
            arc_length = r_mid * angle_step / 2
            height = mid_r_end - mid_r_start
            panel_area = (arc_length - self.tw) * height
            mid_panels.append({
                "id": f"M-{i+1}", "cx": cx, "cy": cy,
                "area": max(panel_area, 0), "ring": "middle"
            })

        # Outer ring: 3n panels (or 2n for simpler designs)
        outer_r_start = mid_r_end + self.tw
        outer_r_end = R - self.tw
        outer_panels = []
        for i in range(3 * n):
            theta = i * angle_step / 3
            r_mid = (outer_r_start + outer_r_end) / 2
            cx = r_mid * np.cos(theta + angle_step / 6)
            cy = r_mid * np.sin(theta + angle_step / 6)
            arc_length = r_mid * angle_step / 3
            height = outer_r_end - outer_r_start
            panel_area = (arc_length - self.tw) * height
            outer_panels.append({
                "id": f"O-{i+1}", "cx": cx, "cy": cy,
                "area": max(panel_area, 0), "ring": "outer"
            })

        all_panels = inner_panels + mid_panels + outer_panels

        # Tracery (stone framework) area
        total_window = np.pi * R**2
        glass_area = sum(p["area"] for p in all_panels) + oculus_area
        tracery_area = total_window - glass_area

        return {
            "oculus": {"radius": oculus_r, "area": oculus_area},
            "inner": inner_panels,
            "middle": mid_panels,
            "outer": outer_panels,
            "total_panels": len(all_panels) + 1,  # +1 for oculus
            "glass_area": glass_area,
            "tracery_area": tracery_area,
            "total_area": total_window,
            "glass_fraction": glass_area / total_window,
        }

# Generate famous rose windows
windows = [
    ("Chartres North", 12, 5.4),
    ("Notre-Dame West", 12, 4.8),
    ("Strasbourg", 16, 4.5),
    ("York Minster", 8, 5.0),
    ("Reims", 12, 6.0),
]

print("=== Gothic Rose Window Geometry ===\\n")

for name, n, r in windows:
    rw = RoseWindow(n, r)
    g = rw.generate_geometry()

    print(f"{name} ({n}-fold, R={r}m)")
    print(f"  Panels: {g['total_panels']} "
          f"(inner:{len(g['inner'])}, mid:{len(g['middle'])}, outer:{len(g['outer'])})")
    print(f"  Total area: {g['total_area']:.1f} m²")
    print(f"  Glass area: {g['glass_area']:.1f} m² ({g['glass_fraction']:.0%})")
    print(f"  Tracery area: {g['tracery_area']:.1f} m²")
    print(f"  Oculus radius: {g['oculus']['radius']*100:.0f} cm")
    print()

# Symmetry analysis
print("=== Symmetry Properties ===")
for n in [4, 6, 8, 10, 12, 16, 24]:
    angle = 360 / n
    total = n + 2*n + 3*n  # inner + middle + outer
    print(f"  {n:>2}-fold: rotation angle={angle:>5.1f}°  "
          f"total panels={total:>3}  reflection axes={n}")`,
      challenge: 'Some rose windows use different symmetry in different rings — for example, 12-fold in the inner ring but 24-fold in the outer ring (each inner petal subdivides into 2 outer panels). Modify the model so the outer ring has a different symmetry order (e.g., 4n instead of 3n). How does this change the panel count and glass fraction?',
      successHint: 'Rose window geometry is a beautiful application of group theory and rotational symmetry. The same mathematics describes crystal structures, molecular symmetry (chemistry), and pattern design in Islamic art. You computed coordinates using polar-to-Cartesian conversion — a fundamental technique in computer graphics and robotics.',
    },
    {
      title: 'Organ pipe acoustics — standing waves and harmonic series',
      concept: `The pipe organ is the instrument of the Gothic cathedral. Each pipe produces a note by creating a **standing wave** — a vibration pattern that fits exactly inside the pipe length. The frequency of the note is determined by the pipe length:

**f = v / (2L)** for an open pipe (fundamental frequency)
**f = v / (4L)** for a stopped (closed-end) pipe

where v is the speed of sound (~343 m/s at 20°C) and L is the pipe length.

Each pipe also produces **harmonics** — integer multiples of the fundamental:
- Open pipe: f, 2f, 3f, 4f, ... (all harmonics)
- Stopped pipe: f, 3f, 5f, 7f, ... (odd harmonics only)

The harmonic content determines the **timbre** (tone colour) — why an organ pipe sounds different from a flute or a trumpet playing the same note.

Additionally, the pipe's **diameter** affects the tuning: wider pipes sound slightly flat because the standing wave extends slightly beyond the physical end of the pipe (the **end correction**: ΔL ≈ 0.6 × radius).

📚 *Standing waves form when a wave reflects back and forth inside a confined space. At certain frequencies, the reflected waves reinforce each other (constructive interference), creating stable vibration patterns called modes.*`,
      analogy: 'Blow across the top of a bottle — you hear a note. Use a shorter bottle — higher note. Use a longer bottle — lower note. The air inside vibrates at a frequency determined by the bottle\'s length. An organ pipe is exactly the same principle, but precision-manufactured so the note is perfectly tuned.',
      storyConnection: 'The great organ of Notre-Dame de Paris has over 8,000 pipes, ranging from 10 metres long (producing a rumbling 16 Hz — below human hearing) to a few centimetres (producing a piercing 8,000 Hz). The organ was designed to fill the cathedral\'s enormous volume: the longest pipes produce bass notes with enough energy to excite the building\'s 6-second reverberation.',
      checkQuestion: 'An open organ pipe is 2 metres long. What is its fundamental frequency? What note is this?',
      checkAnswer: 'f = 343 / (2 × 2) = 85.75 Hz. This is close to F2 (87.3 Hz) — a low bass note. To play middle C (261.6 Hz), you need a pipe of length L = 343 / (2 × 261.6) = 0.656 m — about 66 cm.',
      codeIntro: 'Model organ pipe acoustics — calculate frequencies, harmonics, and the harmonic spectrum for different pipe types.',
      code: `import numpy as np

def pipe_frequency(length_m, pipe_type="open", temperature_C=20, radius_m=0.025):
    """
    Calculate fundamental frequency of an organ pipe.
    Includes end correction for finite pipe diameter.
    """
    # Speed of sound varies with temperature
    v_sound = 331.3 * np.sqrt(1 + temperature_C / 273.15)

    # End correction (wider pipes need more correction)
    end_correction = 0.6 * radius_m

    if pipe_type == "open":
        # Open pipe: both ends open, correction at both ends
        effective_length = length_m + 2 * end_correction
        f0 = v_sound / (2 * effective_length)
    else:
        # Stopped pipe: one end closed, correction at open end only
        effective_length = length_m + end_correction
        f0 = v_sound / (4 * effective_length)

    return f0, v_sound

def harmonics(f0, pipe_type="open", n_harmonics=8):
    """Generate the harmonic series for a pipe."""
    if pipe_type == "open":
        return [f0 * n for n in range(1, n_harmonics + 1)]
    else:
        return [f0 * n for n in range(1, 2 * n_harmonics, 2)]

def note_name(freq):
    """Convert frequency to nearest musical note name."""
    notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    if freq <= 0:
        return "---"
    semitones = 12 * np.log2(freq / 440.0) + 9  # semitones from C0
    octave = int(semitones // 12)
    note_idx = int(round(semitones)) % 12
    return f"{notes[note_idx]}{octave}"

# Organ pipe calculation table
print("=== Organ Pipe Frequency Calculator ===\\n")

# Standard organ pipe lengths
lengths = [8.0, 4.0, 2.0, 1.0, 0.5, 0.25, 0.125]

print(f"{'Length':>8} {'Open f₀':>9} {'Note':>6} {'Stopped f₀':>11} {'Note':>6}")
print("-" * 43)
for L in lengths:
    f_open, _ = pipe_frequency(L, "open")
    f_stopped, _ = pipe_frequency(L, "stopped")
    print(f"{L:>7.3f}m {f_open:>8.1f}Hz {note_name(f_open):>5} "
          f"{f_stopped:>10.1f}Hz {note_name(f_stopped):>5}")

# Harmonic series comparison
print("\\n=== Harmonic Series: Open vs Stopped Pipe (L=1m) ===")
f0_open, _ = pipe_frequency(1.0, "open")
f0_stopped, _ = pipe_frequency(1.0, "stopped")

h_open = harmonics(f0_open, "open", 8)
h_stopped = harmonics(f0_stopped, "stopped", 8)

print(f"{'Harmonic':>9} {'Open Pipe':>12} {'Note':>6} {'Stopped Pipe':>14} {'Note':>6}")
print("-" * 50)
for i in range(8):
    o = h_open[i] if i < len(h_open) else 0
    s = h_stopped[i] if i < len(h_stopped) else 0
    print(f"{'#'+str(i+1):>8} {o:>10.1f}Hz {note_name(o):>5} "
          f"{s:>12.1f}Hz {note_name(s):>5}")

# Temperature sensitivity
print("\\n=== Temperature Effect on Tuning ===")
print("(An organ goes out of tune as the cathedral heats up!)")
f_ref, _ = pipe_frequency(1.0, "open", 15)  # tuned at 15°C
for temp in [5, 10, 15, 20, 25, 30]:
    f, v = pipe_frequency(1.0, "open", temp)
    cents_off = 1200 * np.log2(f / f_ref)  # deviation in cents
    print(f"  {temp:>2}°C: v={v:.1f}m/s  f={f:.1f}Hz  "
          f"deviation: {cents_off:>+5.1f} cents {'(in tune)' if abs(cents_off) < 5 else ''}")

# Notre-Dame organ statistics
print("\\n=== Notre-Dame Organ Statistics ===")
stops = [
    ("32-foot (Bombarde)", 9.75, "open"),
    ("16-foot (Principal)", 4.88, "open"),
    ("8-foot (Montre)", 2.44, "open"),
    ("4-foot (Prestant)", 1.22, "open"),
    ("2-foot (Doublette)", 0.61, "open"),
    ("1-foot (Piccolo)", 0.305, "open"),
]
for name, L, ptype in stops:
    f, _ = pipe_frequency(L, ptype)
    print(f"  {name:<28} L={L:.3f}m  f₀={f:>7.1f}Hz ({note_name(f)})")`,
      challenge: 'Organ builders use "scaling" — the ratio of pipe diameter to length — to control timbre. A wide pipe (high scale) sounds fluty and mellow; a narrow pipe (low scale) sounds string-like and bright. Model the end correction for three different scales (radius = 2%, 5%, and 10% of length) and show how scale affects the tuning of each pipe. This is the art behind organ voicing.',
      successHint: 'You just applied the physics of standing waves and harmonics — the same physics that governs every musical instrument, every acoustic space, and every sound system. The harmonic series is also fundamental to signal processing, radio engineering, and quantum mechanics (electron orbitals are standing waves!).',
    },
    {
      title: 'Comparative Gothic — Chartres vs Notre-Dame vs Beauvais',
      concept: `The three great Gothic cathedrals of the Île-de-France represent an **evolutionary sequence**: Notre-Dame (begun 1163) pioneered the flying buttress; Chartres (1194) perfected the High Gothic plan; Beauvais (1225) pushed the limits until collapse.

A **comparative analysis** quantifies the differences across multiple dimensions: structural (height, span, buttress design), optical (window area, glass fraction), acoustic (volume, RT60), and constructional (duration, cost, workforce).

By normalising each metric to a common scale, we can create a **multi-dimensional comparison** that reveals the trade-offs each cathedral made. Chartres prioritised stained glass (huge windows). Notre-Dame prioritised width (double aisles). Beauvais prioritised height (tallest Gothic vault ever).

This is **multi-criteria analysis** — the engineering technique for comparing complex alternatives when no single metric tells the whole story.

📚 *Multi-criteria analysis (MCA) assigns weights to different objectives and scores each alternative on each criterion. The weighted sum gives an overall score that balances competing goals.*`,
      analogy: 'Choosing a university is multi-criteria: you weigh academics, location, cost, campus life, and career outcomes. No university is best on every criterion — you choose based on which criteria matter most to you. Comparing cathedrals is the same: there\'s no "best" cathedral, only different priorities expressed in stone.',
      storyConnection: 'When Bishop Milon de Nanteuil commissioned Beauvais Cathedral in 1225, he explicitly sought to surpass Chartres in height. The resulting vault (48 m) exceeded Chartres (37 m) by 30% — but the choir collapsed in 1284. The comparative data reveals why: Beauvais achieved greater height without proportionally greater buttressing.',
      checkQuestion: 'Cathedral A has vault height 37 m, wall thickness 2.5 m, and buttress span 12 m. Cathedral B has vault height 48 m, wall thickness 2.0 m, and buttress span 10 m. Which is structurally riskier?',
      checkAnswer: 'Cathedral B (Beauvais) — it is 30% taller but has thinner walls and shorter buttresses. The height-to-thickness ratio is 48/2.0 = 24, vs 37/2.5 = 14.8 for Cathedral A (Chartres). Higher ratio = more slender = more vulnerable to overturning. Beauvais proved this when its vault collapsed.',
      codeIntro: 'Perform a multi-dimensional comparative analysis of three great Gothic cathedrals.',
      code: `import numpy as np

# Cathedral data (approximate historical measurements)
cathedrals = {
    "Notre-Dame": {
        "begun": 1163, "completed": 1345,
        "length_m": 128, "width_m": 40, "vault_height_m": 33,
        "nave_span_m": 12, "wall_thickness_m": 2.2,
        "buttress_span_m": 10, "n_buttresses": 28,
        "window_area_pct": 25, "volume_m3": 108000,
        "spire_height_m": 96,  # original
    },
    "Chartres": {
        "begun": 1194, "completed": 1220,
        "length_m": 130, "width_m": 32, "vault_height_m": 37,
        "nave_span_m": 16, "wall_thickness_m": 2.5,
        "buttress_span_m": 14, "n_buttresses": 24,
        "window_area_pct": 40, "volume_m3": 100000,
        "spire_height_m": 113,
    },
    "Beauvais": {
        "begun": 1225, "completed": 1600,  # never fully completed
        "length_m": 72, "width_m": 27, "vault_height_m": 48,
        "nave_span_m": 15, "wall_thickness_m": 2.0,
        "buttress_span_m": 12, "n_buttresses": 16,
        "window_area_pct": 35, "volume_m3": 80000,
        "spire_height_m": 153,  # collapsed 1573
    },
}

# Derived structural metrics
print("=== Comparative Gothic Analysis ===\\n")
print("--- Structural Metrics ---")
print(f"{'Metric':<30} {'Notre-Dame':>12} {'Chartres':>12} {'Beauvais':>12}")
print("-" * 68)

metrics = {}
for name, c in cathedrals.items():
    m = {}
    m["Height-to-thickness"] = c["vault_height_m"] / c["wall_thickness_m"]
    m["Span-to-height"] = c["nave_span_m"] / c["vault_height_m"]
    m["Buttress ratio"] = c["buttress_span_m"] / c["vault_height_m"]
    m["Slenderness"] = c["vault_height_m"] / c["width_m"]
    m["Volume efficiency (m³/m)"] = c["volume_m3"] / c["length_m"]

    # Stability estimate (restoring moment / overturning moment)
    wall_weight = c["wall_thickness_m"] * c["vault_height_m"] * 2400 * 9.81 / 1000
    restore = wall_weight * c["wall_thickness_m"] / 2
    thrust = wall_weight * 0.3  # approximate horizontal thrust
    overturn = thrust * c["vault_height_m"] * 0.85
    m["Stability index"] = restore / overturn if overturn > 0 else 0
    metrics[name] = m

for metric_name in ["Height-to-thickness", "Span-to-height", "Buttress ratio",
                     "Slenderness", "Stability index", "Volume efficiency (m³/m)"]:
    vals = [metrics[n][metric_name] for n in cathedrals]
    print(f"{metric_name:<30} " + "  ".join(f"{v:>10.2f}" for v in vals))

# Multi-criteria scoring
print("\\n--- Multi-Criteria Scoring (0-100, higher = better) ---")
criteria = {
    "Structural safety": {"weight": 0.30, "metric": "Stability index", "higher_better": True},
    "Interior height": {"weight": 0.20, "metric": lambda c: c["vault_height_m"], "higher_better": True},
    "Light (window area)": {"weight": 0.20, "metric": lambda c: c["window_area_pct"], "higher_better": True},
    "Volume": {"weight": 0.15, "metric": lambda c: c["volume_m3"], "higher_better": True},
    "Build speed": {"weight": 0.15, "metric": lambda c: 1/(c["completed"]-c["begun"]+1), "higher_better": True},
}

scores = {name: {} for name in cathedrals}

print(f"{'Criterion':<24} {'Wt':>4} {'Notre-Dame':>12} {'Chartres':>12} {'Beauvais':>12}")
print("-" * 68)

for crit_name, crit in criteria.items():
    raw = {}
    for name, c in cathedrals.items():
        if callable(crit["metric"]):
            raw[name] = crit["metric"](c)
        else:
            raw[name] = metrics[name][crit["metric"]]

    # Normalize to 0-100
    vals = list(raw.values())
    vmin, vmax = min(vals), max(vals)
    rng = vmax - vmin if vmax != vmin else 1

    for name in cathedrals:
        if crit["higher_better"]:
            scores[name][crit_name] = (raw[name] - vmin) / rng * 100
        else:
            scores[name][crit_name] = (vmax - raw[name]) / rng * 100

    print(f"{crit_name:<24} {crit['weight']:.2f} " +
          "  ".join(f"{scores[n][crit_name]:>10.0f}" for n in cathedrals))

# Weighted total
print("-" * 68)
totals = {}
for name in cathedrals:
    total = sum(scores[name][cn] * c["weight"]
                for cn, c in criteria.items())
    totals[name] = total

print(f"{'WEIGHTED TOTAL':<24} {'':>4} " +
      "  ".join(f"{totals[n]:>10.1f}" for n in cathedrals))

winner = max(totals, key=totals.get)
print(f"\\nHighest overall score: {winner}")
print("(But remember: Beauvais's choir collapsed. Models must be validated against reality.)")`,
      challenge: 'Change the weights to reflect different priorities: (1) a military commander who values structural safety above all else, (2) an artist who values light and beauty, (3) a bishop who wants the tallest vault to glorify God. How does the "winner" change with each stakeholder\'s priorities? This is why multi-criteria analysis is used in public policy — different stakeholders weight the same criteria differently.',
      successHint: 'Multi-criteria analysis is used everywhere complex decisions are made: infrastructure planning, environmental policy, product design, medical treatment selection. You learned to normalise diverse metrics to a common scale, assign weights, and compute composite scores — the foundation of systematic decision-making.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling and analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers finite element analysis, wind loading, rose window geometry, organ pipe acoustics, and comparative Gothic analysis.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
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
