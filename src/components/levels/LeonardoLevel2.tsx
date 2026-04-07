import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LeonardoLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Airfoil analysis — NACA profiles and pressure distribution',
      concept: `An **airfoil** is the cross-sectional shape of a wing. The shape determines how air flows around it and, therefore, how much lift it generates.

The **NACA 4-digit system** describes airfoil shapes with four numbers. For example, NACA 2412 means: maximum camber of 2% at 40% chord, with 12% thickness. From these four digits, you can compute the exact upper and lower surface coordinates of the wing.

**Pressure distribution** is what actually creates lift. Air flowing over the curved upper surface speeds up (Bernoulli's principle), creating lower pressure above the wing than below. The integral of this pressure difference across the chord gives the total lift force.

Leonardo sketched dozens of wing profiles in his notebooks — some flat, some cambered, some with slots. He was searching for the shape that produced the most lift, but without pressure measurement tools, he could only guess. Modern NACA profiles are the result of systematic wind tunnel testing that Leonardo could only dream of.

📚 *Camber is the curvature of the airfoil's centreline. More camber generates more lift at low speeds but also more drag. Thickness affects structural strength — thicker wings are stronger but create more drag.*`,
      analogy: 'Hold your hand flat out of a car window, palm slightly tilted up. You feel a lifting force. Now cup your hand slightly — more lift, because you\'ve added camber. The NACA system is a precise way to describe exactly how much you\'ve "cupped" the wing and how thick it is.',
      storyConnection: 'Leonardo\'s ornithopter sketches show wing profiles with noticeable camber — he observed that bird wings are curved, not flat. His Codex on the Flight of Birds (1505) contains cross-sections remarkably similar to modern low-speed airfoils. He had the right intuition but lacked the mathematics to optimise the shape.',
      checkQuestion: 'NACA 4412 has 4% camber at 40% chord with 12% thickness. NACA 0012 has 0% camber with 12% thickness. Which produces more lift at the same angle of attack?',
      checkAnswer: 'NACA 4412 — its camber generates lift even at zero angle of attack. NACA 0012 (symmetric) produces zero lift at zero angle of attack. The cambered airfoil\'s curved upper surface forces air to travel a longer path, creating a pressure difference even when the wing is level.',
      codeIntro: 'Generate NACA 4-digit airfoil coordinates and calculate the pressure distribution using thin airfoil theory.',
      code: `import numpy as np

def naca_4digit(m, p, t, n_points=80):
    """
    Generate NACA 4-digit airfoil coordinates.
    m = max camber (fraction), p = camber position (fraction), t = thickness (fraction)
    """
    x = (1 - np.cos(np.linspace(0, np.pi, n_points))) / 2  # cosine spacing

    # Thickness distribution
    yt = 5 * t * (0.2969 * np.sqrt(x) - 0.1260 * x - 0.3516 * x**2
                  + 0.2843 * x**3 - 0.1015 * x**4)

    # Camber line
    yc = np.where(x < p,
                  m / p**2 * (2 * p * x - x**2),
                  m / (1 - p)**2 * (1 - 2 * p + 2 * p * x - x**2)) if p > 0 else np.zeros_like(x)

    return x, yc, yt

# Compare several NACA profiles
profiles = [
    ("NACA 0012 (symmetric)", 0.00, 0.01, 0.12),
    ("NACA 2412 (light camber)", 0.02, 0.40, 0.12),
    ("NACA 4412 (moderate camber)", 0.04, 0.40, 0.12),
    ("NACA 6412 (heavy camber)", 0.06, 0.40, 0.12),
    ("NACA 4424 (thick wing)", 0.04, 0.40, 0.24),
]

print("=== NACA Airfoil Analysis ===")
print(f"{'Profile':<30} {'Max Camber':>10} {'Thickness':>10} {'Cl at 5deg':>11}")
print("-" * 63)

for name, m, p, t in profiles:
    # Thin airfoil theory: Cl = 2*pi*(alpha + camber_effect)
    alpha_rad = 5 * np.pi / 180  # 5 degrees angle of attack
    camber_effect = m * 2  # simplified camber contribution
    cl = 2 * np.pi * (alpha_rad + camber_effect)

    print(f"{name:<30} {m*100:>8.1f}% {t*100:>8.1f}% {cl:>9.3f}")

# Pressure distribution for NACA 2412 at 5 degrees
print("\\\n=== Pressure Distribution: NACA 2412 at alpha=5 deg ===")
x, yc, yt = naca_4digit(0.02, 0.40, 0.12)
alpha = 5 * np.pi / 180

# Simplified pressure coefficient (thin airfoil approximation)
# Cp_upper < 0 (suction), Cp_lower > 0 (pressure)
cp_upper = -2 * (alpha + 2 * 0.02) * np.sqrt((1 - x) / (x + 0.001))
cp_lower = 2 * alpha * np.sqrt((1 - x) / (x + 0.001)) * 0.3

print(f"{'x/c':>6} {'Cp_upper':>10} {'Cp_lower':>10} {'Delta_Cp':>10}")
print("-" * 38)
for i in range(0, len(x), 10):
    dcp = cp_lower[i] - cp_upper[i]
    print(f"{x[i]:>5.2f} {cp_upper[i]:>9.3f} {cp_lower[i]:>9.3f} {dcp:>9.3f}")

print("\\\nNegative Cp_upper = suction (lift). The leading edge has the")
print("strongest suction — this is where most lift is generated.")`,
      challenge: 'Add a NACA 2406 (thin wing like a bird feather) to the comparison. Thin airfoils have less drag but are structurally weaker. At what thickness does the wing become too flimsy to support a human pilot? Leonardo faced exactly this trade-off — his wood-and-fabric wings were thin but flexible.',
      successHint: 'NACA airfoil profiles are the foundation of aerospace engineering. Every wing on every aircraft was designed starting from these shapes. You just computed what wind tunnel engineers measured experimentally for decades — thin airfoil theory replaced thousands of hours of testing.',
    },
    {
      title: 'Induced drag — aspect ratio effects and wingtip vortices',
      concept: `Lift doesn't come free — it creates **induced drag**. When a wing generates lift, high-pressure air below the wing spills around the wingtips to the low-pressure region above, creating **wingtip vortices** — spinning tubes of air that trail behind the wing.

These vortices tilt the local airflow downward (called **downwash**), which tilts the lift vector backward, creating a drag component. This is **induced drag**: the unavoidable cost of generating lift with a finite-span wing.

**Aspect ratio** (AR = span² / area) is the key parameter. Long, narrow wings (high AR, like an albatross) have small wingtip vortices relative to their span, so less induced drag. Short, stubby wings (low AR, like a sparrow) have proportionally larger vortices and more induced drag.

The formula: **C_Di = C_L² / (pi × AR × e)** where e is the Oswald efficiency factor (0.7-0.9 for real wings).

📚 *Induced drag decreases as speed increases (because the required lift coefficient decreases), while parasitic drag increases with speed squared. There's an optimal speed where total drag is minimised — the best range speed.*`,
      analogy: 'Imagine rowing a wide, flat paddle through water — most of your energy moves water backward (useful thrust). Now row with a narrow stick — water curls around the edges, wasting energy in swirls. Wingtip vortices are those swirls. A longer paddle (higher aspect ratio) wastes less energy in edge swirls.',
      storyConnection: 'Leonardo\'s ornithopter designs had short, broad wings — an aspect ratio of about 4-5, similar to a pigeon. He never considered long, narrow wings like an albatross (AR ~18). This was a critical limitation: his designs had roughly 4× the induced drag of an optimised glider, making human-powered flight even more impossible.',
      checkQuestion: 'Wing A has a span of 10 m and area of 20 m² (AR = 5). Wing B has a span of 20 m and area of 20 m² (AR = 20). Both generate the same lift. Which has less induced drag?',
      checkAnswer: 'Wing B — its induced drag coefficient is C_L²/(pi×20×e), which is 4× lower than Wing A\'s C_L²/(pi×5×e). Quadrupling the aspect ratio quarters the induced drag. This is why gliders and albatrosses have long, narrow wings — they need to minimise drag to stay aloft.',
      codeIntro: 'Calculate induced drag for different wing geometries and find the optimal aspect ratio for Leonardo\'s flying machine.',
      code: `import numpy as np

def induced_drag_coeff(cl, aspect_ratio, oswald_e=0.85):
    """Calculate induced drag coefficient."""
    return cl**2 / (np.pi * aspect_ratio * oswald_e)

def total_drag(speed_ms, wing_area, aspect_ratio, mass_kg,
               cd0=0.03, oswald_e=0.85, rho=1.225):
    """
    Calculate total drag = parasitic + induced.
    Returns drag force in Newtons.
    """
    q = 0.5 * rho * speed_ms**2            # dynamic pressure
    cl = mass_kg * 9.81 / (q * wing_area)   # required lift coefficient
    cd_induced = cl**2 / (np.pi * aspect_ratio * oswald_e)
    cd_total = cd0 + cd_induced
    drag = q * wing_area * cd_total
    return drag, cl, cd_induced, cd0

# Compare wing designs for a 90 kg pilot + 30 kg airframe = 120 kg
mass = 120  # kg
wing_area = 15  # m² (large hang glider)
speed = 10  # m/s (slow flight)

print("=== Induced Drag vs Aspect Ratio ===")
print(f"Mass: {mass} kg | Wing area: {wing_area} m² | Speed: {speed} m/s")
print(f"{'AR':>4} {'Span (m)':>9} {'Cl':>6} {'Cd_i':>8} {'Cd_0':>8} {'Drag (N)':>9} {'L/D':>6}")
print("-" * 52)

for ar in [3, 5, 7, 10, 14, 18, 25]:
    span = np.sqrt(ar * wing_area)
    drag, cl, cdi, cd0 = total_drag(speed, wing_area, ar, mass)
    lift = mass * 9.81
    ld_ratio = lift / drag
    print(f"{ar:>4} {span:>7.1f} {cl:>6.2f} {cdi:>7.4f} {cd0:>7.4f} {drag:>8.1f} {ld_ratio:>5.1f}")

# Speed sweep for AR=8 (Leonardo-style) vs AR=18 (modern glider)
print("\\\n=== Drag vs Speed: Leonardo (AR=8) vs Modern Glider (AR=18) ===")
print(f"{'Speed':>6} {'Drag AR=8':>10} {'Drag AR=18':>11} {'Saving':>8}")
print("-" * 37)
for v in [6, 8, 10, 12, 15, 20]:
    d8, _, _, _ = total_drag(v, wing_area, 8, mass)
    d18, _, _, _ = total_drag(v, wing_area, 18, mass)
    saving = (1 - d18 / d8) * 100
    print(f"{v:>4}m/s {d8:>9.1f}N {d18:>9.1f}N {saving:>6.0f}%")

print("\\\nHigher AR dramatically reduces drag at low speeds —")
print("exactly where human-powered flight would need to operate.")`,
      challenge: 'Wingtip devices (winglets) effectively increase the Oswald efficiency factor from ~0.85 to ~0.95. Add winglets to the AR=8 Leonardo wing and compare its drag to the plain AR=8 wing. How much drag reduction do winglets provide? Modern airliners save 3-5% fuel with winglets — you\'re calculating the same benefit.',
      successHint: 'Induced drag is the reason aircraft wings look the way they do. Every wing is a compromise between aspect ratio (less drag) and structural weight (shorter wings are lighter). Understanding this trade-off is the core of wing design — from Leonardo\'s ornithopter to the Boeing 787.',
    },
    {
      title: 'Propulsion analysis — human power vs engine power curves',
      concept: `Leonardo's flying machines were designed for **human-powered flight** — the pilot would pedal, crank, or flap to generate thrust. But can a human produce enough power to fly?

A fit human can sustain about **75 watts** (1/10 horsepower) for extended periods, and burst up to **400 watts** for short sprints. A Tour de France cyclist averages about 250 watts.

The **power required** to fly at a given speed is: **P = Drag × Speed = (q × S × Cd) × V** where q is dynamic pressure, S is wing area, and Cd is total drag coefficient. This power curve has a minimum — the speed at which flight requires the least energy.

If the minimum power required exceeds human capacity, human-powered flight is impossible for that design. The challenge is to make the aircraft efficient enough that the power minimum falls below ~250 watts.

📚 *Power required for flight follows a U-shaped curve: at low speeds, induced drag is high (you need a high angle of attack). At high speeds, parasitic drag is high (air resistance). The minimum is between these extremes.*`,
      analogy: 'Imagine cycling uphill on a bicycle. At very low speed, you wobble and waste energy staying balanced (like induced drag at low airspeed). At very high speed, wind resistance is enormous (parasitic drag). There\'s a sweet spot where you cover the most distance per pedal stroke — that\'s the speed of minimum power.',
      storyConnection: 'Leonardo estimated that a human could generate enough power to fly by flapping wings. He was wrong by roughly a factor of 10 — his ornithopter designs would have required 800-1,500 watts, far beyond human capacity. The Gossamer Albatross (1979) finally achieved human-powered flight by being ultralight (32 kg) with a 29 m wingspan — the extreme opposite of Leonardo\'s compact designs.',
      checkQuestion: 'A human produces 200 watts. An aircraft requires 300 watts to fly at minimum power speed. Can it fly in a 5 m/s headwind that adds 50 watts of extra drag?',
      checkAnswer: 'No — total power needed is 300 + 50 = 350 watts, nearly double the human\'s output. Even without the headwind, 200 < 300 means the aircraft cannot sustain flight. The pilot could briefly fly in ground effect (reduced induced drag) but would lose altitude in sustained flight.',
      codeIntro: 'Calculate power-required curves for Leonardo\'s ornithopter and compare to human power output.',
      code: `import numpy as np

def power_required(speed, mass, wing_area, ar, cd0=0.03, oswald_e=0.85, rho=1.225):
    """
    Calculate power required for level flight at a given speed.
    P = D × V where D = parasitic_drag + induced_drag.
    """
    if speed < 1:
        return float('inf')
    q = 0.5 * rho * speed**2
    cl = mass * 9.81 / (q * wing_area)
    cd_i = cl**2 / (np.pi * ar * oswald_e)
    cd_total = cd0 + cd_i
    drag = q * wing_area * cd_total
    power = drag * speed
    return power

# Aircraft configurations
configs = [
    {"name": "Leonardo ornithopter",   "mass": 130, "area": 12, "ar": 5,  "cd0": 0.06},
    {"name": "Leonardo glider (1505)", "mass": 110, "area": 18, "ar": 7,  "cd0": 0.04},
    {"name": "Gossamer Albatross",     "mass": 100, "area": 40, "ar": 18, "cd0": 0.02},
    {"name": "Modern hang glider",     "mass": 120, "area": 15, "ar": 8,  "cd0": 0.03},
    {"name": "Optimised HPV",          "mass": 90,  "area": 30, "ar": 22, "cd0": 0.015},
]

# Human power output levels
human_power = {"Sustained (1hr)": 75, "Fit cyclist": 200, "Sprint (30s)": 400}

print("=== Power Required for Level Flight ===")
print(f"{'Aircraft':<26} {'Min Power':>10} {'@ Speed':>8} {'Human?':>10}")
print("-" * 56)

for cfg in configs:
    speeds = np.linspace(3, 25, 200)
    powers = [power_required(v, cfg["mass"], cfg["area"], cfg["ar"], cfg["cd0"]) for v in speeds]
    min_power = min(powers)
    min_speed = speeds[np.argmin(powers)]
    feasible = "YES" if min_power < 250 else "NO"
    print(f"{cfg['name']:<26} {min_power:>8.0f} W {min_speed:>6.1f}m/s {feasible:>8}")

print()
print("Human power thresholds:")
for label, watts in human_power.items():
    print(f"  {label}: {watts} W")

# Detailed power curve for Leonardo vs Gossamer
print("\\\n=== Power Curve: Leonardo vs Gossamer Albatross ===")
print(f"{'Speed':>7} {'Leo Power':>10} {'Goss Power':>11} {'Ratio':>7}")
print("-" * 37)
for v in [5, 7, 9, 11, 13, 15, 18, 22]:
    p_leo = power_required(v, 130, 12, 5, 0.06)
    p_goss = power_required(v, 100, 40, 18, 0.02)
    ratio = p_leo / p_goss if p_goss > 0 else float('inf')
    print(f"{v:>5}m/s {p_leo:>9.0f}W {p_goss:>9.0f}W {ratio:>6.1f}x")

print("\\\nLeonardo's design needs 5-10x more power than the Gossamer Albatross.")
print("Human-powered flight requires extreme efficiency — every gram and every")
print("percentage of drag counts.")`,
      challenge: 'Calculate how much the ornithopter\'s mass would need to decrease (keeping the same wing) to bring minimum power below 250 W. Then calculate how much the wing area would need to increase (keeping the same mass). Which is more practical? Leonardo had neither ultralight materials nor enormous wings.',
      successHint: 'Power-required curves are fundamental to aircraft design. Every aircraft has a speed of minimum power (for maximum endurance) and a speed of minimum drag (for maximum range). Pilots, airlines, and military planners use these curves daily to optimise fuel consumption and flight profiles.',
    },
    {
      title: 'Structural analysis — wing spar bending moments',
      concept: `A wing must support its own weight plus the aerodynamic lift distributed along its span. The **wing spar** — the main structural beam running from root to tip — carries this load. The critical engineering question: **will the spar break?**

The **bending moment** at any point along the spar equals the total lift force outboard of that point times its distance. The bending moment is maximum at the **wing root** (where the wing meets the fuselage), because the root must support the entire wing's lift.

For a uniform lift distribution: **M_root = (L/2) × (b/4)** where L is total lift and b is wingspan. For an elliptical distribution (more realistic): **M_root = (L/2) × (b/(3*pi)) × 4**.

The spar must be designed so that the **bending stress** (sigma = M × y / I, where I is the moment of inertia and y is the distance from the neutral axis) does not exceed the material's yield strength.

📚 *Moment of inertia (I) measures a cross-section's resistance to bending. A tall, thin I-beam has much higher I than a solid square of the same area — which is why beams are I-shaped, not square.*`,
      analogy: 'Hold a ruler at one end and press down on the other. The ruler bends most at the point where you\'re holding it — that\'s the root. If you attach a weight at the far end, the bending at the root increases. A wing spar is exactly like this ruler: lift pulls upward along the span, and the root must resist the total bending force.',
      storyConnection: 'Leonardo\'s wing frames used wooden spars — likely poplar or willow, which are light but flexible. His designs show a single main spar with ribs. For a 5 m half-span wing carrying a 100 kg pilot, the root bending moment would be approximately 1,200 N·m — near the breaking limit of a wooden spar thin enough for flight. Leonardo never solved this structural problem.',
      checkQuestion: 'A wing has a span of 12 m and total lift of 1,200 N (supporting 120 kg). What is the approximate root bending moment assuming uniform lift distribution?',
      checkAnswer: 'M_root = (L/2) × (b/4) = (1200/2) × (12/4) = 600 × 3 = 1,800 N·m. Each half-wing carries 600 N of lift, and the centroid of a uniform distribution is at b/4 = 3 m from the root. The spar must resist 1,800 N·m without yielding — a significant structural demand.',
      codeIntro: 'Calculate bending moments along a wing spar for different lift distributions and check if Leonardo\'s wooden spar could handle the load.',
      code: `import numpy as np

def spar_bending_moment(span, total_lift, distribution="uniform", n_points=50):
    """
    Calculate bending moment along a wing spar (one half-wing).
    distribution: 'uniform', 'elliptical', or 'triangular'
    """
    half_span = span / 2
    y = np.linspace(0, half_span, n_points)  # 0 = root, half_span = tip
    half_lift = total_lift / 2

    if distribution == "uniform":
        lift_per_m = half_lift / half_span
        # M(y) = integral from y to tip of lift * distance
        moment = lift_per_m * (half_span - y)**2 / 2

    elif distribution == "elliptical":
        # Lift per unit span: l(y) = l0 * sqrt(1 - (y/b_half)^2)
        l0 = half_lift * 4 / (np.pi * half_span)
        moment = np.zeros_like(y)
        for i, yi in enumerate(y):
            # Numerical integration from yi to tip
            y_int = np.linspace(yi, half_span * 0.999, 200)
            l_dist = l0 * np.sqrt(1 - (y_int / half_span)**2)
            moment[i] = np.trapz(l_dist * (y_int - yi), y_int)

    elif distribution == "triangular":
        # Linear: maximum at root, zero at tip
        l0 = 2 * half_lift / half_span
        moment = l0 * (half_span - y)**3 / (6 * half_span) + \
                 l0 * (half_span - y)**2 / 2 * (1 - (half_span - y) / (3 * half_span))
        # Simplified: M(y) = l0/6 * (b-y)^2 * (2b+y) / b
        moment = l0 / (6 * half_span) * (half_span - y)**2 * (2 * half_span + y)

    return y, moment

# Leonardo's wing parameters
mass = 120       # kg (pilot + frame)
g = 9.81
total_lift = mass * g  # 1177 N
span = 10        # m (estimated from Leonardo's sketches)

print("=== Wing Spar Bending Analysis ===")
print(f"Mass: {mass} kg | Lift: {total_lift:.0f} N | Span: {span} m\\\n")

for dist in ["uniform", "elliptical", "triangular"]:
    y, M = spar_bending_moment(span, total_lift, dist)
    print(f"{dist.capitalize()} distribution:")
    print(f"  Root moment: {M[0]:>8.1f} N·m")
    print(f"  Mid-span:    {M[len(M)//2]:>8.1f} N·m")
    print(f"  Tip moment:  {M[-1]:>8.1f} N·m")

# Can Leonardo's wooden spar handle it?
print("\\\n=== Spar Stress Check ===")
# Assume circular wooden spar
materials = [
    ("Poplar (Leonardo's likely choice)", 40, 300),   # yield MPa, density kg/m³
    ("Spruce (modern gliders)", 60, 400),
    ("Bamboo", 80, 600),
    ("Carbon fibre tube", 1500, 200),
]

root_moment = spar_bending_moment(span, total_lift, "elliptical")[1][0]
print(f"Root bending moment (elliptical): {root_moment:.0f} N·m\\\n")

print(f"{'Material':<36} {'Min dia':>8} {'Mass/m':>8} {'Status':>10}")
print("-" * 64)
for name, yield_mpa, density in materials:
    # For circular section: sigma = M*r/I, I = pi*r^4/4
    # sigma = 4*M / (pi*r^3) => r = (4*M/(pi*sigma))^(1/3)
    sigma = yield_mpa * 1e6  # Pa
    r_min = (4 * root_moment / (np.pi * sigma))**(1.0 / 3.0)
    d_min = 2 * r_min * 1000  # mm
    mass_per_m = np.pi * r_min**2 * density
    status = "FEASIBLE" if d_min < 80 else "TOO HEAVY"
    print(f"{name:<36} {d_min:>6.0f}mm {mass_per_m:>6.2f}kg {status:>10}")`,
      challenge: 'An I-beam spar has 4x the moment of inertia of a solid circular spar of the same mass. Recalculate the minimum dimensions for an I-beam poplar spar. Does this make Leonardo\'s design feasible? (Hint: Leonardo actually sketched I-beam-like cross-sections for his wing frames.)',
      successHint: 'Bending moment analysis is how every beam, bridge, and wing in the world is designed. The root bending moment is the critical design driver for wings — it determines the spar size, which determines the wing weight, which determines how much lift you need, which closes the design loop. This interdependence is why aircraft design is iterative.',
    },
    {
      title: 'Bird biomechanics — wing loading across species',
      concept: `Leonardo studied birds obsessively — his Codex on the Flight of Birds contains detailed observations of how different species fly. The key metric he was unknowingly investigating is **wing loading**: the ratio of body weight to wing area.

**Wing loading = W / S** (N/m² or kg/m²)

Low wing loading (large wings, light body) = slow flight, tight turns, easy takeoff. Think: owl, albatross.
High wing loading (small wings, heavy body) = fast flight, poor manoeuvrability, needs a runway. Think: duck, swan.

Birds scale with a fundamental constraint: mass increases as the cube of body length (volume ~ L³), but wing area increases as the square (area ~ L²). This means larger birds have proportionally higher wing loading — which is why there's a maximum size for flying birds (~15 kg for bustards).

For a human (70 kg), scaling up bird proportions gives impossibly large wings — or impossibly high flight speeds. This is the **square-cube law** that doomed Leonardo's ornithopter concept.

📚 *The square-cube law: when you scale up an object, surface area grows as L² but volume (and mass) grows as L³. This is why ants can carry 50× their weight but elephants can barely support their own — and why giant birds can't exist.*`,
      analogy: 'Compare a paper aeroplane (very low wing loading — light, large wings relative to weight) to a dart (very high wing loading — heavy, tiny fins). The paper aeroplane floats slowly and turns easily. The dart flies fast and straight. Birds span this entire spectrum, and Leonardo needed to figure out where a human flier would fall.',
      storyConnection: 'Leonardo measured bird wingspans and body sizes, comparing eagles, kites, and swallows. He noted that larger birds flap more slowly and glide more — his intuition about wing loading was correct. But he dramatically underestimated the wing size needed for human flight: his 10 m span for a 100 kg aircraft gives a wing loading of 80 kg/m², comparable to a peregrine falcon in a dive — far too high for sustained flight.',
      checkQuestion: 'A 3 kg hawk has a wingspan of 1.2 m and wing area of 0.24 m². A 70 kg human has the same body proportions but scaled up. What wing area would the human need?',
      checkAnswer: 'Scaling the hawk: the human is 70/3 = 23.3× heavier. To maintain the same wing loading (3×9.81/0.24 = 123 N/m²), the human needs area = 70×9.81/123 = 5.6 m². But this assumes the human can produce the same power-to-weight ratio as the hawk — which they can\'t. Realistic wing loading for human flight is ~30-50 N/m², requiring 14-23 m² of wing.',
      codeIntro: 'Analyse wing loading across bird species and extrapolate to human-scale flight — quantifying why Leonardo\'s designs couldn\'t work.',
      code: `import numpy as np

# Bird data: (name, mass_kg, wingspan_m, wing_area_m2)
birds = [
    ("Hummingbird",     0.004,  0.10, 0.0008),
    ("Sparrow",         0.030,  0.22, 0.008),
    ("Pigeon",          0.350,  0.65, 0.060),
    ("Peregrine falcon",0.900,  1.00, 0.120),
    ("Red-tailed hawk", 1.200,  1.30, 0.240),
    ("Bald eagle",      4.500,  2.00, 0.560),
    ("Albatross",       8.500,  3.40, 0.620),
    ("Mute swan",       12.00,  2.40, 0.650),
    ("Great bustard",   15.00,  2.50, 0.800),
]

print("=== Bird Wing Loading Analysis ===")
print(f"{'Species':<22} {'Mass':>6} {'Span':>6} {'Area':>6} {'WL(N/m2)':>9} {'AR':>5}")
print("-" * 56)

for name, mass, span, area in birds:
    wl = mass * 9.81 / area  # wing loading N/m²
    ar = span**2 / area       # aspect ratio
    print(f"{name:<22} {mass:>5.3f} {span:>5.2f} {area:>5.3f} {wl:>8.1f} {ar:>5.1f}")

# Square-cube law: scaling analysis
print("\\\n=== Square-Cube Law: Scaling Birds to Human Size ===")
ref_mass = 1.2    # hawk
ref_area = 0.24   # hawk wing area
ref_span = 1.30   # hawk wingspan
human_mass = 90   # pilot + minimal frame

# If we scale the hawk isometrically to human mass:
scale_factor = (human_mass / ref_mass)**(1.0/3.0)
scaled_span = ref_span * scale_factor
scaled_area = ref_area * scale_factor**2
scaled_wl = human_mass * 9.81 / scaled_area

print(f"Hawk scaled to {human_mass} kg (isometric):")
print(f"  Scale factor: {scale_factor:.1f}x")
print(f"  Wingspan: {scaled_span:.1f} m")
print(f"  Wing area: {scaled_area:.1f} m²")
print(f"  Wing loading: {scaled_wl:.0f} N/m²")

# What area do we ACTUALLY need?
target_wl = [30, 50, 80, 120]
print(f"\\\n=== Required Wing Area for {human_mass} kg at Target Wing Loadings ===")
for wl in target_wl:
    area_needed = human_mass * 9.81 / wl
    span_needed = np.sqrt(area_needed * 10)  # assume AR=10
    feasibility = "Gossamer-class" if wl <= 30 else "Hang glider" if wl <= 50 else "Fast glider" if wl <= 80 else "Impossible sustained"
    print(f"  WL={wl:>3} N/m²: area={area_needed:>5.1f} m², span~{span_needed:.1f} m  ({feasibility})")

# Power to fly: larger birds need more power per kg
print("\\\n=== Metabolic Power vs Mass (Scaling Law) ===")
print("Flight power scales as mass^(7/6) — larger = disproportionately harder")
for name, mass, span, area in birds:
    power_per_kg = 10 * mass**(1.0/6.0)  # simplified scaling law W/kg
    total_power = power_per_kg * mass
    print(f"  {name:<20} {power_per_kg:>5.1f} W/kg × {mass:>5.1f} kg = {total_power:>7.1f} W")

human_power_per_kg = 10 * human_mass**(1.0/6.0)
human_total = human_power_per_kg * human_mass
print(f"  {'Human (scaled)':<20} {human_power_per_kg:>5.1f} W/kg × {human_mass:>5.1f} kg = {human_total:>7.1f} W")
print(f"  Actual sustained human output: ~75-200 W (deficit: {human_total - 200:.0f} W)")`,
      challenge: 'Pteranodon had a mass of ~20 kg and wingspan of 7 m. Calculate its wing loading and aspect ratio. Compare to the albatross — the largest modern flying bird. Why could pterosaurs be larger than modern birds? (Hint: hollow bones, different muscle attachment, and possibly different atmospheric conditions.)',
      successHint: 'You\'ve quantified the fundamental limits of biological flight. The square-cube law, wing loading, and power scaling explain why birds can\'t be arbitrarily large — and why human-powered flight requires engineering solutions (ultralight materials, extreme aspect ratios) that Leonardo couldn\'t have imagined. Biomechanics is where biology meets engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Aerodynamic analysis and flight engineering</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into airfoil analysis, induced drag, propulsion limits, structural mechanics, and bird biomechanics.
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
