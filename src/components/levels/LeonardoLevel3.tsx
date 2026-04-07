import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LeonardoLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Computational aerodynamics — the panel method simplified',
      concept: `Wind tunnels are expensive. The **panel method** replaces the airfoil surface with flat **panels**, each emitting a vortex of unknown strength, then solves for the strengths that prevent flow through the surface.

For N panels, you get N equations with N unknowns: **A × gamma = b** where A is the influence matrix, gamma is the vortex strengths, and b is the freestream boundary condition. Once solved, you calculate velocity and pressure at every surface point. Integrating pressure gives lift.

📚 *The panel method assumes inviscid (frictionless) flow. It predicts lift accurately but not friction drag — which is why modern CFD is much more complex.*`,
      analogy: 'Imagine placing tiny fans along the wing surface, each blowing air at an unknown speed. You adjust each fan\'s speed until the total airflow pattern looks correct — no air going through the wing. The panel method does this mathematically: each "fan" is a vortex panel, and you solve for all the fan speeds simultaneously.',
      storyConnection: 'Leonardo tested wing shapes by moving them through air — an analogue "computer." He wrote: "The same force which moves the air against the stationary thing, moves the thing against the stationary air." This equivalence principle is the foundation of both wind tunnel testing and the panel method.',
      checkQuestion: 'A panel method uses 20 panels to model an airfoil. How many equations must be solved simultaneously?',
      checkAnswer: '20 equations with 20 unknowns — one per panel enforcing the no-flow-through condition. Modern methods use 200-500 panels. Cost scales as N² for setup and N³ for solution.',
      codeIntro: 'Implement a simplified panel method to calculate lift on a NACA airfoil — computational aerodynamics from scratch.',
      code: `import numpy as np

def simple_panel_method(camber, thickness, alpha_deg, n_panels=30):
    """
    Simplified panel method for a symmetric-ish airfoil.
    Uses discrete vortex panels along the camber line.
    Returns lift coefficient.
    """
    alpha = np.radians(alpha_deg)
    chord = 1.0

    # Panel endpoints along the chord
    theta = np.linspace(0, np.pi, n_panels + 1)
    x = chord * (1 - np.cos(theta)) / 2  # cosine spacing

    # Camber line (simplified parabolic)
    yc = 4 * camber * x * (1 - x)

    # Control points (midpoints of panels)
    xc = (x[:-1] + x[1:]) / 2
    ycc = 4 * camber * xc * (1 - xc)

    # Panel angles
    dx = np.diff(x)
    dy = np.diff(yc)
    panel_angle = np.arctan2(dy, dx)

    # Build influence coefficient matrix
    # A[i,j] = influence of vortex j on control point i (normal direction)
    A = np.zeros((n_panels, n_panels))
    for i in range(n_panels):
        for j in range(n_panels):
            rx = xc[i] - (x[j] + x[j+1]) / 2
            ry = ycc[i] - (yc[j] + yc[j+1]) / 2
            r2 = rx**2 + ry**2 + 1e-10
            # Normal velocity induced by vortex j at point i
            vn = (rx * np.sin(panel_angle[i]) - ry * np.cos(panel_angle[i])) / (2 * np.pi * r2)
            A[i, j] = vn * np.sqrt(dx[j]**2 + dy[j]**2)

    # Right-hand side: freestream normal component
    b = -np.sin(alpha - panel_angle)

    # Solve for vortex strengths
    try:
        gamma = np.linalg.solve(A, b)
    except np.linalg.LinAlgError:
        gamma = np.linalg.lstsq(A, b, rcond=None)[0]

    # Lift coefficient from Kutta-Joukowski
    total_circulation = np.sum(gamma * np.sqrt(dx**2 + dy**2))
    cl = 2 * total_circulation / chord

    return cl, gamma, xc

# Run panel method for several configurations
print("=== Panel Method Aerodynamic Analysis ===")
print(f"{'Configuration':<30} {'alpha':>6} {'Cl (panel)':>10} {'Cl (theory)':>12}")
print("-" * 60)

for name, camber, thick, alpha in [
    ("Flat plate", 0, 0.01, 5),
    ("NACA 0012 (symmetric)", 0, 0.12, 5),
    ("NACA 2412 (light camber)", 0.02, 0.12, 5),
    ("NACA 4412 (mod camber)", 0.04, 0.12, 5),
    ("NACA 2412 at 0 deg", 0.02, 0.12, 0),
    ("NACA 2412 at 10 deg", 0.02, 0.12, 10),
    ("NACA 4412 at 10 deg", 0.04, 0.12, 10),
]:
    cl_panel, _, _ = simple_panel_method(camber, thick, alpha)
    # Thin airfoil theory for comparison
    cl_theory = 2 * np.pi * (np.radians(alpha) + 2 * camber)
    print(f"{name:<30} {alpha:>4}deg {cl_panel:>9.3f} {cl_theory:>10.3f}")

# Convergence study: how many panels are enough?
print("\\\n=== Panel Convergence Study (NACA 2412, alpha=5) ===")
print(f"{'Panels':>8} {'Cl':>8} {'Delta':>8}")
prev_cl = 0
for n in [5, 10, 20, 40, 60, 80, 100]:
    cl, _, _ = simple_panel_method(0.02, 0.12, 5, n)
    delta = abs(cl - prev_cl)
    print(f"{n:>8} {cl:>7.4f} {delta:>7.5f}")
    prev_cl = cl

print("\\\nThe solution converges as panel count increases.")
print("30-50 panels are typically sufficient for engineering accuracy.")`,
      challenge: 'Run the panel method at angles from -5 to 15 degrees and plot the Cl vs alpha curve. Where does the curve become non-linear? In reality, the wing stalls (Cl drops sharply) at about 12-15 degrees — the panel method can\'t predict stall because it assumes inviscid flow. This is its fundamental limitation.',
      successHint: 'You implemented the core of computational aerodynamics. The panel method (Hess & Smith, 1960s) was the first practical computational tool for wing design. Modern CFD codes (XFOIL, OpenFOAM, ANSYS Fluent) descend from this same idea.',
    },
    {
      title: 'Stability analysis — centre of pressure vs centre of gravity',
      concept: `A flying machine needs **stability**: if disturbed in pitch, it must naturally return to equilibrium. The key is the relationship between the **centre of gravity** (CG) and the **centre of pressure** (CP).

For stability, the CG must be **forward** of the CP. A pitch-up tilts the lift vector (acting behind CG) to create a nose-down restoring moment. If CG is behind CP, the aircraft is **unstable** — any disturbance grows until it tumbles. Tails shift the overall CP rearward, enabling a forward CG.

📚 *The "static margin" = (CP - CG) / chord. Positive = stable. Typical: 5-15% for conventional aircraft, ~0% for fighter jets (computer-stabilised).*`,
      analogy: 'Balance a pencil on your finger. If the heavy end (CG) is above your finger, it\'s unstable — it falls over. If the heavy end is below (like a pendulum), it\'s stable — it swings back to centre. An aircraft in pitch works the same way: weight forward of lift creates a stable "pendulum" effect.',
      storyConnection: 'Leonardo placed the pilot at the wing\'s centre — roughly at the centre of pressure. With no tail and no static margin concept, his machines would have been violently unstable. Every gust would have sent the machine into a nosedive or stall — the most critical flaw in his designs.',
      checkQuestion: 'An aircraft has its CG at 25% chord and its CP at 30% chord (measured from the leading edge). Is it stable or unstable?',
      checkAnswer: 'Stable — the CG (25%) is forward of the CP (30%). The static margin is 30% - 25% = 5% chord, which is positive. If the aircraft pitches up, lift acts behind the CG, creating a nose-down restoring moment. A 5% static margin is a bit low (typical is 10-15%) but workable.',
      codeIntro: 'Analyse pitch stability for Leonardo\'s flying machine — calculate static margin and determine what a tail would need to look like.',
      code: `import numpy as np

def centre_of_pressure(alpha_deg, camber=0.04, x_ac=0.25):
    """CP moves with alpha: x_cp = x_ac - Cm_ac/Cl."""
    alpha = np.radians(alpha_deg)
    cl = 2 * np.pi * (alpha + 2 * camber)
    cm_ac = -np.pi * camber / 2
    if abs(cl) < 0.01: return 0.5
    return x_ac - cm_ac / cl

def static_margin(x_cg, x_cp):
    """Static margin as fraction of chord. Positive = stable."""
    return x_cp - x_cg

def tail_sizing(x_cg, x_wing_cp, wing_area, wing_chord,
                tail_arm, target_margin=0.10):
    """Calculate required tail area for target static margin."""
    x_tail = x_cg + tail_arm / wing_chord
    x_cp_target = x_cg + target_margin
    if x_tail <= x_cp_target:
        return float('inf')
    return max(wing_area * (x_cp_target - x_wing_cp) / (x_tail - x_cp_target), 0)

# Analyse Leonardo's designs
print("=== Pitch Stability Analysis ===\\\n")

# CP movement with angle of attack
print("Centre of pressure vs angle of attack (NACA 4-series camber):")
print(f"{'Alpha':>6} {'Cl':>6} {'x_cp/c':>8} {'SM at CG=0.25':>14}")
print("-" * 36)
for alpha in [-2, 0, 2, 5, 8, 10, 12, 15]:
    xcp = centre_of_pressure(alpha, camber=0.04)
    cl = 2 * np.pi * (np.radians(alpha) + 0.08)
    sm = static_margin(0.25, xcp)
    stability = "STABLE" if sm > 0 else "UNSTABLE"
    print(f"{alpha:>4}deg {cl:>5.2f} {xcp:>7.3f} {sm:>+7.3f} ({stability})")

# Leonardo's machines — stability check
print("\\\n=== Leonardo's Designs — Stability Assessment ===")
designs = [
    ("Ornithopter (no tail)",    0.50, 0.35, 12, 0, 1.2),
    ("Ornithopter (pilot forward)", 0.35, 0.35, 12, 0, 1.2),
    ("Glider with small tail",   0.30, 0.32, 15, 3.0, 1.5),
    ("Modern hang glider",       0.25, 0.30, 15, 0, 1.5),
    ("Conventional aircraft",    0.25, 0.40, 20, 5.0, 2.0),
]

print(f"{'Design':<30} {'CG':>5} {'CP':>5} {'SM':>6} {'Status':>12}")
print("-" * 60)
for name, cg, cp, area, tail_arm, chord in designs:
    sm = static_margin(cg, cp)
    status = "STABLE" if sm > 0.05 else "MARGINAL" if sm > 0 else "UNSTABLE"
    print(f"{name:<30} {cg:>4.2f} {cp:>4.2f} {sm:>+5.2f} {status:>12}")

# Tail sizing for Leonardo
print("\\\n=== Required Tail to Stabilise Leonardo's Ornithopter ===")
wing_area = 12  # m²
chord = 1.2     # m
for arm in [1.5, 2.0, 3.0, 4.0, 5.0]:
    s_tail = tail_sizing(0.40, 0.35, wing_area, chord, arm, 0.10)
    pct = s_tail / wing_area * 100
    print(f"  Tail arm {arm:.1f}m: tail area = {s_tail:.2f} m² ({pct:.0f}% of wing)")`,
      challenge: 'The Wright brothers used a canard (forward tail) instead of a rear tail. In a canard, the CP of the forward surface is ahead of the CG. Modify the analysis: if the canard is 2 m forward of the CG with an area of 3 m², where is the overall CP? Is the configuration stable? (The Wrights\' canard was actually unstable — they controlled it manually.)',
      successHint: 'Stability analysis separates flyable aircraft from unflyable ones. Leonardo\'s greatest missed insight was stability — not understood until Cayley\'s work in the 1800s, three centuries later. You analysed the problem that stumped the greatest engineer of the Renaissance.',
    },
    {
      title: 'Wind tunnel simulation — mapping the lift-drag polar',
      concept: `A **wind tunnel** measures lift and drag at every angle of attack, producing the **lift-drag polar** (Cl vs Cd plot) — the most important chart in aerodynamics.

The polar reveals: Cl_max (determines stall speed), Cd_min (determines top speed), L/D_max (determines glide range), and stall angle. We'll simulate a virtual wind tunnel sweep from -5 to 20 degrees, modelling: (1) potential flow lift, (2) parasitic drag, (3) induced drag, and (4) stall.

📚 *The lift-drag polar completely characterises a wing's performance envelope — it's to an aerodynamicist what a stress-strain curve is to a materials engineer.*`,
      analogy: 'Imagine testing a car at every speed from 0 to 200 km/h, measuring fuel consumption at each speed. The resulting curve shows where the car is most efficient, where it wastes the most fuel, and its maximum speed. A wind tunnel polar does exactly this for a wing, sweeping through angles instead of speeds.',
      storyConnection: 'Leonardo built rotating-arm devices to test wing shapes in moving air — a primitive wind tunnel precursor. He tested flat plates, curved surfaces, and helical screws, doing qualitative aerodynamic testing 400 years before the Wrights\' 1901 wind tunnel.',
      checkQuestion: 'A wing has Cl_max = 1.5 and stalls at 14 degrees. If the aircraft weighs 1,200 N and has 15 m² of wing, what is the minimum flight speed (stall speed)?',
      checkAnswer: 'At stall: L = W, so 0.5 × rho × V² × S × Cl_max = W. V_stall = sqrt(2W / (rho × S × Cl_max)) = sqrt(2 × 1200 / (1.225 × 15 × 1.5)) = sqrt(87.1) = 9.3 m/s (33.5 km/h). Below this speed, the wing can\'t generate enough lift to fly — it stalls.',
      codeIntro: 'Run a virtual wind tunnel sweep and build the complete lift-drag polar for Leonardo\'s wing.',
      code: `import numpy as np

def wind_tunnel_sweep(camber, thickness, ar, cd0_base=0.01,
                      alpha_range=(-5, 22), n_points=100):
    """Simulate wind tunnel sweep: Cl and Cd at each alpha with stall model."""
    alphas = np.linspace(alpha_range[0], alpha_range[1], n_points)
    results = []
    cl_alpha = 2 * np.pi
    alpha_0 = -np.degrees(2 * camber)
    cl_max = 0.9 + 8 * camber + 0.1 * thickness * 10

    for alpha_deg in alphas:
        cl_linear = cl_alpha * (np.radians(alpha_deg) - np.radians(alpha_0))
        stall_angle = np.degrees(np.radians(alpha_0) + cl_max / cl_alpha)
        if alpha_deg < stall_angle:
            cl = cl_linear
        else:
            cl = cl_max - 0.05 * (alpha_deg - stall_angle)**1.5

        cd_parasitic = cd0_base + 0.005 * thickness
        cd_induced = cl**2 / (np.pi * ar * 0.85)
        cd_separation = 0.002 * max(0, alpha_deg - stall_angle + 2)**2
        cd_total = cd_parasitic + cd_induced + cd_separation
        ld_ratio = cl / cd_total if cd_total > 0 else 0
        results.append({"alpha": alpha_deg, "cl": cl, "cd": cd_total,
                        "cd_i": cd_induced, "cd_p": cd_parasitic, "ld": ld_ratio})
    return results

# Test configurations
configs = [
    ("Leonardo ornithopter", 0.06, 0.08, 5, 0.04),
    ("Leonardo glider",      0.04, 0.10, 7, 0.03),
    ("Wright Flyer",         0.03, 0.06, 6, 0.025),
    ("Modern sailplane",     0.02, 0.12, 20, 0.008),
]

print("=== Virtual Wind Tunnel Results ===\\\n")

for name, camber, thick, ar, cd0 in configs:
    results = wind_tunnel_sweep(camber, thick, ar, cd0)

    # Extract key performance numbers
    cl_vals = [r["cl"] for r in results]
    cd_vals = [r["cd"] for r in results]
    ld_vals = [r["ld"] for r in results]

    max_cl_idx = np.argmax(cl_vals)
    max_ld_idx = np.argmax(ld_vals)
    min_cd_idx = np.argmin(cd_vals)

    print(f"--- {name} (AR={ar}) ---")
    print(f"  Cl_max:    {cl_vals[max_cl_idx]:.3f} at alpha={results[max_cl_idx]['alpha']:.1f} deg")
    print(f"  Cd_min:    {cd_vals[min_cd_idx]:.4f} at alpha={results[min_cd_idx]['alpha']:.1f} deg")
    print(f"  L/D_max:   {ld_vals[max_ld_idx]:.1f} at alpha={results[max_ld_idx]['alpha']:.1f} deg")

    # Stall speed for 120 kg aircraft, 15 m² wing
    v_stall = np.sqrt(2 * 120 * 9.81 / (1.225 * 15 * cl_vals[max_cl_idx]))
    print(f"  V_stall:   {v_stall:.1f} m/s ({v_stall * 3.6:.0f} km/h)")
    print()

# Detailed polar for Leonardo's glider
print("=== Detailed Polar: Leonardo's Glider ===")
results = wind_tunnel_sweep(0.04, 0.10, 7, 0.03)
print(f"{'Alpha':>6} {'Cl':>7} {'Cd':>7} {'Cd_i':>7} {'L/D':>6}")
print("-" * 35)
for r in results:
    if -4 <= r["alpha"] <= 18 and abs(r["alpha"] - round(r["alpha"])) < 0.15:
        print(f"{r['alpha']:>5.0f}  {r['cl']:>6.3f} {r['cd']:>6.4f} {r['cd_i']:>6.4f} {r['ld']:>5.1f}")`,
      challenge: 'Add a "flap" effect: when flaps are deployed, camber effectively increases by 0.05 and Cd0 increases by 0.01. How does this change Cl_max and stall speed? Flaps allow slower landing speeds at the cost of more drag — the same physics used on every airliner today.',
      successHint: 'The lift-drag polar is the most important performance document for any wing. You built a virtual wind tunnel producing results that qualitatively match real data. This is modern aerospace: simulate first, validate selectively, iterate. Leonardo had to build and crash — you can simulate and optimise.',
    },
    {
      title: 'Wright Flyer comparison — what Leonardo missed',
      concept: `The Wright brothers flew in 1903 — 400 years after Leonardo. The **five pillars of flight** explain what they understood that he didn't:

1. **Lift**: Both understood curved surfaces generate lift. Leonardo: check.
2. **Propulsion**: Leonardo used human muscle (~0.1 HP). Wrights: 12 HP engine. Leonardo: fail.
3. **Structures**: Both used wood and fabric. Comparable.
4. **Stability**: Leonardo had no tail or CG-CP concept. Wrights used a canard. Leonardo: fail.
5. **Control**: Leonardo had no roll/pitch/yaw system. Wrights invented wing warping. Leonardo: critical fail.

The Wrights' genius was solving ALL five simultaneously. Leonardo addressed lift and structures but missed propulsion, stability, and control.

📚 *The Wrights spent more time on control than any other problem — a pilot who can't control the aircraft is just a passenger on a crash.*`,
      analogy: 'Building a car requires an engine, a chassis, steering, brakes, AND a transmission. If you have a brilliant engine but no steering, the car is a missile, not a vehicle. Leonardo had a "brilliant engine" (well, brilliant wing concept) but was missing the steering, brakes, and transmission of flight.',
      storyConnection: 'Leonardo\'s aerodynamic intuition was correct — curved surfaces generate more lift. But he lacked a lightweight engine, stability theory, and control framework. Comparing his work to the Wright Flyer shows exactly which gaps needed closing.',
      checkQuestion: 'The Wright Flyer had a 12 HP engine and weighed 340 kg (with pilot). Leonardo\'s ornithopter would weigh ~130 kg with a human producing ~0.1 HP. What is the power-to-weight ratio of each?',
      checkAnswer: 'Wright Flyer: 12 HP / 340 kg = 0.035 HP/kg. Leonardo: 0.1 HP / 130 kg = 0.00077 HP/kg. The Wrights had 45× more power per kilogram. This alone explains why they flew and Leonardo couldn\'t — the power deficit was insurmountable with human muscles.',
      codeIntro: 'Quantitatively compare Leonardo\'s designs to the Wright Flyer across all five pillars of flight.',
      code: `import numpy as np

# Aircraft specifications
aircraft = {
    "Leonardo Ornithopter": {
        "mass_kg": 130, "wing_area_m2": 12, "span_m": 8,
        "power_W": 75, "cd0": 0.06, "camber": 0.05,
        "has_tail": False, "has_control": False, "has_engine": False
    },
    "Leonardo Glider (1505)": {
        "mass_kg": 100, "wing_area_m2": 18, "span_m": 12,
        "power_W": 0, "cd0": 0.04, "camber": 0.04,
        "has_tail": False, "has_control": False, "has_engine": False
    },
    "Wright Flyer (1903)": {
        "mass_kg": 340, "wing_area_m2": 47, "span_m": 12.3,
        "power_W": 8950, "cd0": 0.035, "camber": 0.03,
        "has_tail": True, "has_control": True, "has_engine": True
    },
    "Cayley Glider (1853)": {
        "mass_kg": 80, "wing_area_m2": 14, "span_m": 10,
        "power_W": 0, "cd0": 0.05, "camber": 0.03,
        "has_tail": True, "has_control": False, "has_engine": False
    },
}

print("=== Five Pillars of Flight: Comparative Analysis ===\\\n")

# Pillar 1: Lift
print("--- Pillar 1: LIFT ---")
print(f"{'Aircraft':<28} {'WL(N/m2)':>9} {'Cl_need':>8} {'Vstall':>7}")
print("-" * 54)
for name, a in aircraft.items():
    wl = a["mass_kg"] * 9.81 / a["wing_area_m2"]
    cl_max = 0.9 + 8 * a["camber"]
    v_stall = np.sqrt(2 * a["mass_kg"] * 9.81 / (1.225 * a["wing_area_m2"] * cl_max))
    print(f"{name:<28} {wl:>7.1f} {cl_max:>7.2f} {v_stall:>5.1f}m/s")

# Pillar 2: Propulsion
print("\\\n--- Pillar 2: PROPULSION ---")
print(f"{'Aircraft':<28} {'Power(W)':>9} {'P/W':>10} {'Excess':>10}")
print("-" * 59)
for name, a in aircraft.items():
    pw = a["power_W"] / a["mass_kg"] if a["mass_kg"] > 0 else 0
    # Minimum power required for flight
    ar = a["span_m"]**2 / a["wing_area_m2"]
    speeds = np.linspace(5, 30, 100)
    min_power = float('inf')
    for v in speeds:
        q = 0.5 * 1.225 * v**2
        cl = a["mass_kg"] * 9.81 / (q * a["wing_area_m2"])
        cd = a["cd0"] + cl**2 / (np.pi * ar * 0.85)
        p = q * a["wing_area_m2"] * cd * v
        if p < min_power:
            min_power = p
    excess = a["power_W"] - min_power
    status = "SURPLUS" if excess > 0 else "GLIDER" if a["power_W"] == 0 else "DEFICIT"
    print(f"{name:<28} {a['power_W']:>7.0f} {pw:>8.2f} {excess:>+8.0f}W ({status})")

# Pillar 3: Structure (wing loading capacity)
print("\\\n--- Pillar 3: STRUCTURES ---")
for name, a in aircraft.items():
    ar = a["span_m"]**2 / a["wing_area_m2"]
    root_moment = a["mass_kg"] * 9.81 * a["span_m"] / 8
    print(f"  {name:<28} Root moment: {root_moment:>6.0f} N·m | AR: {ar:.1f}")

# Pillar 4: Stability
print("\\\n--- Pillar 4: STABILITY ---")
for name, a in aircraft.items():
    stable = "YES (tail)" if a["has_tail"] else "NO (no tail)"
    print(f"  {name:<28} Longitudinal stability: {stable}")

# Pillar 5: Control
print("\\\n--- Pillar 5: CONTROL ---")
for name, a in aircraft.items():
    control = "3-axis (wing warp + rudder + canard)" if a["has_control"] else "NONE"
    print(f"  {name:<28} Control: {control}")

# Summary scorecard
print("\\\n=== SCORECARD ===")
print(f"{'Aircraft':<28} {'Lift':>5} {'Power':>6} {'Struct':>7} {'Stab':>5} {'Ctrl':>5} {'Total':>6}")
print("-" * 64)
for name, a in aircraft.items():
    lift_ok = 1
    power_ok = 1 if a["power_W"] > 200 or a["power_W"] == 0 else 0
    struct_ok = 1
    stab_ok = 1 if a["has_tail"] else 0
    ctrl_ok = 1 if a["has_control"] else 0
    total = lift_ok + power_ok + struct_ok + stab_ok + ctrl_ok
    can_fly = "CAN FLY" if total == 5 or (total >= 4 and a["power_W"] == 0) else "CANNOT"
    print(f"{name:<28} {lift_ok:>4}/1 {power_ok:>4}/1 {struct_ok:>5}/1 {stab_ok:>4}/1 {ctrl_ok:>4}/1 {total}/5 {can_fly}")`,
      challenge: 'Add Lilienthal\'s 1896 glider to the comparison (mass: 95 kg with pilot, span: 7 m, area: 13 m², no engine, no tail, partial body-shift control). Lilienthal actually flew over 2,000 flights. How did he succeed without a tail? (Answer: he hung below the wing, making his body the pendulum — CG naturally below CP. But he died when he stalled and couldn\'t recover — proving that stability without control is not enough.)',
      successHint: 'The five-pillar framework explains why flight took so long: you need ALL five simultaneously. Four out of five means a crash. The history of aviation is closing each gap, one by one, over four centuries.',
    },
    {
      title: 'Biomimicry design methodology — from birds to engineering',
      concept: `Leonardo's approach — studying birds to design flying machines — is now a formal methodology called **biomimicry**: (1) Identify the function needed, (2) Discover biological models, (3) Abstract the design principle, (4) Emulate in engineering, (5) Evaluate against constraints.

Leonardo excelled at steps 1-3 but lacked the materials and theory for 4-5. Modern biomimicry has produced: Velcro (burr hooks), bullet train noses (kingfisher beaks), building ventilation (termite mounds), and drone designs (dragonfly flight).

📚 *Biomimicry doesn't copy nature exactly — it abstracts the PRINCIPLE and adapts it. A Boeing 787 wing doesn't look like a bird wing, but uses the same pressure-differential principle.*`,
      analogy: 'A chef visits a forest and tastes wild berries. They don\'t serve raw berries at the restaurant — they extract the flavour principle (tartness + sweetness) and create a sauce that works with their menu. Biomimicry is the same: extract the engineering principle from nature and adapt it to human constraints.',
      storyConnection: 'Leonardo was history\'s first systematic biomimicist. His Codex on the Flight of Birds (1505) documents wing shapes, flapping patterns, and turning mechanisms across dozens of species, translating each into a mechanical design. His methodology was sound — modern biomimicry follows his exact process with better tools.',
      checkQuestion: 'A kingfisher dives into water without a splash because its beak is shaped to minimise the pressure wave. What engineering problem could this solve?',
      checkAnswer: 'The Shinkansen bullet train. When it entered tunnels at 300 km/h, it created a sonic boom at the exit. Engineer Eiji Nakatsu redesigned the nose to match the kingfisher beak profile — eliminating the boom AND reducing drag by 15%. This is real biomimicry: biological observation → engineering principle → practical solution.',
      codeIntro: 'Apply the biomimicry methodology systematically — match biological flight strategies to engineering requirements.',
      code: `import numpy as np

# Biological flight strategies database
bio_strategies = [
    {
        "organism": "Albatross",
        "strategy": "Dynamic soaring",
        "principle": "Extract energy from wind shear between layers",
        "wing_loading": 130,  # N/m²
        "aspect_ratio": 18,
        "speed_ms": 15,
        "efficiency": 0.95,
        "applicable_to": ["Long-range UAVs", "Solar aircraft", "Sailplanes"],
    },
    {
        "organism": "Hummingbird",
        "strategy": "Hovering via figure-8 wing stroke",
        "principle": "Generate lift on both up and down strokes",
        "wing_loading": 25,
        "aspect_ratio": 4,
        "speed_ms": 0,
        "efficiency": 0.45,
        "applicable_to": ["Micro-drones", "Inspection robots", "Pollination drones"],
    },
    {
        "organism": "Dragonfly",
        "strategy": "Tandem wing with phase control",
        "principle": "Fore and aft wings create vortex interactions",
        "wing_loading": 8,
        "aspect_ratio": 8,
        "speed_ms": 10,
        "efficiency": 0.60,
        "applicable_to": ["MAVs", "Indoor drones", "Surveillance platforms"],
    },
    {
        "organism": "Peregrine falcon",
        "strategy": "Variable sweep for speed control",
        "principle": "Tuck wings to reduce drag in dive, spread to brake",
        "wing_loading": 75,
        "aspect_ratio": 7,
        "speed_ms": 90,
        "efficiency": 0.85,
        "applicable_to": ["Fighter aircraft", "Fast drones", "Morphing wings"],
    },
    {
        "organism": "Maple seed",
        "strategy": "Autorotation",
        "principle": "Single wing spins to generate lift during descent",
        "wing_loading": 5,
        "aspect_ratio": 6,
        "speed_ms": 1,
        "efficiency": 0.30,
        "applicable_to": ["Sensor drops", "Emergency descent", "Seed-like robots"],
    },
    {
        "organism": "Swift",
        "strategy": "Morphing wing geometry",
        "principle": "Continuously adjust span and sweep for conditions",
        "wing_loading": 35,
        "aspect_ratio": 10,
        "speed_ms": 20,
        "efficiency": 0.88,
        "applicable_to": ["Adaptive UAVs", "Urban air taxis", "Efficient cruise"],
    },
]

print("=== Biomimicry Flight Strategy Database ===\\\n")
print(f"{'Organism':<18} {'Strategy':<30} {'WL':>5} {'AR':>4} {'Eff':>5}")
print("-" * 64)
for b in bio_strategies:
    print(f"{b['organism']:<18} {b['strategy']:<30} {b['wing_loading']:>4.0f} {b['aspect_ratio']:>4} {b['efficiency']:>4.0f}%")

# Design matching: given requirements, find best bio-inspiration
print("\\\n=== Design Matching: Bio-Inspiration Selector ===")
requirements = [
    {"name": "Cargo drone (heavy, long range)", "wl_target": 100, "speed_target": 20, "hover": False},
    {"name": "Indoor inspection drone",         "wl_target": 10,  "speed_target": 3,  "hover": True},
    {"name": "Leonardo's flying machine",        "wl_target": 80,  "speed_target": 10, "hover": False},
    {"name": "Emergency descent device",         "wl_target": 50,  "speed_target": 2,  "hover": False},
]

for req in requirements:
    print(f"\\\nRequirement: {req['name']}")
    print(f"  Target WL: {req['wl_target']} N/m² | Speed: {req['speed_target']} m/s | Hover: {req['hover']}")

    # Score each bio-strategy
    scores = []
    for b in bio_strategies:
        wl_match = 1 / (1 + abs(b["wing_loading"] - req["wl_target"]) / 50)
        speed_match = 1 / (1 + abs(b["speed_ms"] - req["speed_target"]) / 10)
        hover_match = 1 if (req["hover"] and b["speed_ms"] < 2) or not req["hover"] else 0.3
        score = (wl_match + speed_match + hover_match) * b["efficiency"]
        scores.append((b["organism"], b["strategy"], score))

    scores.sort(key=lambda x: x[2], reverse=True)
    print(f"  Best match: {scores[0][0]} ({scores[0][1]}), score={scores[0][2]:.2f}")
    print(f"  Runner-up:  {scores[1][0]} ({scores[1][1]}), score={scores[1][2]:.2f}")

# Leonardo's biomimicry assessment
print("\\\n=== Leonardo's Biomimicry Scorecard ===")
steps = [
    ("1. Identify function",    "EXCELLENT", "Clearly defined: human flight"),
    ("2. Discover bio-models",  "EXCELLENT", "Studied dozens of bird species"),
    ("3. Abstract principles",  "GOOD",      "Curved surfaces, flapping, soaring"),
    ("4. Emulate in engineering","PARTIAL",   "Wood/fabric wings, no engine or control"),
    ("5. Evaluate constraints",  "WEAK",      "No quantitative analysis possible"),
]
for step, rating, detail in steps:
    print(f"  {step:<28} [{rating:<9}] {detail}")`,
      challenge: 'Add the owl to the database — owls fly silently because their feathers have serrated edges that break up turbulent vortices. What modern engineering application does this inspire? (Answer: quieter wind turbines. GE and Siemens have added serrated trailing edges to turbine blades, reducing noise by 5-10 dB using the owl\'s principle.)',
      successHint: 'You built a systematic matching system between biological strategies and engineering requirements — the methodology used by PAX Scientific, Qualcomm, and Interface. Leonardo\'s greatest legacy isn\'t any single design — it\'s the biomimicry methodology itself.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling and computational aerodynamics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers computational aerodynamics, stability analysis, wind tunnel simulation, historical comparison, and biomimicry methodology.
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
