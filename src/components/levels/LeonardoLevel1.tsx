import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LeonardoLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Lift — how cambered wings push you upward',
      concept: `When air flows over a curved (cambered) wing, it must travel a longer path over the top surface than the bottom. The air on top speeds up to keep pace, and faster-moving air exerts **lower pressure** — this is **Bernoulli's principle**. The pressure difference between the high-pressure bottom and low-pressure top creates an upward force called **lift**.

The lift equation quantifies this:

**L = ½ × ρ × v² × A × C_L**

where ρ is air density (about **1.225 kg/m³** at sea level), v is airspeed in m/s, A is wing area in m², and C_L is the **lift coefficient** — a dimensionless number that captures how effectively the wing's shape redirects airflow. A flat plate has C_L ≈ 0.5. A well-designed cambered airfoil reaches C_L ≈ 1.5. Bird wings in active flight can reach C_L ≈ 2.0.

Leonardo da Vinci observed birds in flight for decades, sketching how they curved their wings and angled them against the wind. His notebooks contain drawings of cambered surfaces remarkably similar to modern airfoils — he understood intuitively that **shape matters more than brute force**.

📚 *Lift depends on the square of velocity — doubling your speed quadruples your lift. This is why takeoff and landing are the most dangerous phases of flight: at low speeds, you're barely generating enough lift to stay airborne.*`,
      analogy: 'Hold your hand flat out a car window, palm angled slightly upward. The wind pushes your hand up. Now cup your hand slightly — the upward force increases dramatically. That cupping is camber. A wing is just a carefully shaped version of your cupped hand, optimized so the lift-to-drag ratio is as high as possible.',
      storyConnection: 'Leonardo filled Codex on the Flight of Birds (1505) with observations of how birds angle their wings differently during ascent, gliding, and turning. He noticed that birds curve their wings more during slow flight — increasing camber to maintain lift at low speed. Modern aircraft do the same with flaps and slats.',
      checkQuestion: 'A wing has area 20 m², airspeed 15 m/s, and C_L = 1.2. What lift does it generate at sea level?',
      checkAnswer: 'L = 0.5 × 1.225 × 15² × 20 × 1.2 = 0.5 × 1.225 × 225 × 20 × 1.2 = 3,307.5 N. That is about 337 kg of lift — enough to support roughly 4 people. Note how sensitive lift is to speed: at 10 m/s, the same wing only produces 1,470 N (150 kg).',
      codeIntro: 'Calculate lift for different wing designs — compare Leonardo\'s ornithopter wings to bird wings and modern hang gliders.',
      code: `import numpy as np

def lift_force(rho, v, area, c_l):
    """Calculate aerodynamic lift (Newtons)."""
    return 0.5 * rho * v**2 * area * c_l

rho_sea = 1.225  # kg/m³ at sea level

# Wing designs to compare
wings = [
    ("Pigeon wing",           0.06,  1.6, 0.35),
    ("Eagle wing",            0.56,  1.5, 4.5),
    ("Albatross wing",        0.62,  1.4, 11.0),
    ("Leonardo ornithopter",  16.0,  0.9, 3.0),
    ("Modern hang glider",    14.0,  1.2, 8.0),
    ("Paraglider",            25.0,  1.3, 2.5),
    ("Cessna 172",            16.2,  1.5, 50.0),
]

print("=== Lift at Different Airspeeds ===")
print(f"Air density: {rho_sea} kg/m³ (sea level)\\\n")

speeds = [5, 10, 15, 20, 30]

for name, area, c_l, mass_kg in wings:
    print(f"--- {name} ---")
    print(f"  Wing area: {area} m²  |  C_L: {c_l}  |  Weight: {mass_kg * 9.81:.1f} N ({mass_kg} kg)")

    # Find minimum flight speed
    weight = mass_kg * 9.81
    v_min = np.sqrt(2 * weight / (rho_sea * area * c_l))
    print(f"  Minimum flight speed: {v_min:.1f} m/s ({v_min * 3.6:.1f} km/h)")

    for v in speeds:
        L = lift_force(rho_sea, v, area, c_l)
        surplus = L - weight
        status = "FLYING" if surplus > 0 else "falling"
        print(f"    v={v:>2} m/s: lift={L:>8.1f} N  surplus={surplus:>+8.1f} N  [{status}]")
    print()

# Leonardo's problem: the pilot
print("=== Leonardo's Ornithopter Problem ===")
pilot_mass = 75  # kg
frame_mass = 30  # kg
total_mass = pilot_mass + frame_mass
total_weight = total_mass * 9.81

wing_area = 16.0
c_l = 0.9

v_required = np.sqrt(2 * total_weight / (rho_sea * wing_area * c_l))
print(f"Pilot: {pilot_mass} kg  Frame: {frame_mass} kg  Total: {total_mass} kg")
print(f"Total weight: {total_weight:.0f} N")
print(f"Wing area: {wing_area} m²  C_L: {c_l}")
print(f"Speed needed for level flight: {v_required:.1f} m/s ({v_required * 3.6:.1f} km/h)")
print(f"\\\nThis speed is achievable in a GLIDE (downhill).")
print(f"But sustaining it by flapping? That requires power...")

# Effect of camber on lift
print(f"\\\n=== Camber Matters ===")
print(f"Same wing (16 m²), same speed (12 m/s), different C_L:\\\n")
for c_l_test in [0.3, 0.6, 0.9, 1.2, 1.5, 2.0]:
    L = lift_force(rho_sea, 12, 16, c_l_test)
    pct = L / total_weight * 100
    bar = "█" * int(pct / 5)
    print(f"  C_L={c_l_test:.1f}: {L:>7.0f} N ({pct:>5.1f}% of weight) {bar}")`,
      challenge: 'Add altitude effects: air density at 2,000 m is about 1.007 kg/m³ (18% less than sea level). Recalculate the minimum flight speed for Leonardo\'s ornithopter at altitude. How much faster must it fly to generate the same lift?',
      successHint: 'You quantified the relationship between wing shape, speed, and lift — the foundation of all aerodynamics. Leonardo\'s intuition about camber was correct, but he lacked the mathematical framework (Bernoulli wasn\'t born until 1700). The lift equation shows why his ornithopter wings were actually reasonable — the problem wasn\'t lift, it was power.',
    },
    {
      title: 'Drag — the invisible force fighting every flyer',
      concept: `Drag is the aerodynamic force that opposes motion through air. Every flying object must overcome drag to maintain speed, and drag determines how much **power** a flyer needs.

There are two main types:

**Parasitic drag** comes from the object pushing air out of the way. It depends on the object's cross-sectional area and shape:

**D_parasitic = ½ × ρ × v² × A_frontal × C_D**

where C_D is the **drag coefficient** — a flat plate perpendicular to flow has C_D ≈ 1.2, a sphere about 0.47, a streamlined body about 0.04, and a bird's body about 0.1.

**Induced drag** is the price of generating lift. When a wing creates lift, it deflects air downward. This deflection tilts the total aerodynamic force backward, creating a drag component. Induced drag is highest at **low speeds** (where the wing must work harder to generate lift) and decreases at high speeds.

**D_induced = L² / (½ × ρ × v² × π × b² × e)**

where b is wingspan and e is the span efficiency factor (about 0.8 for most wings).

The total drag has a **minimum** at some intermediate speed — the speed where parasitic and induced drag are equal. This is the speed for **maximum range**.

📚 *Leonardo sketched streamlined shapes for his flying machines, noting that fish and birds share similar tapered forms. He was observing convergent evolution driven by drag minimization — a concept not formalized until the 20th century.*`,
      analogy: 'Drag is like running through waist-deep water. Walk slowly and the resistance is gentle (low parasitic drag). Run fast and it becomes enormous (parasitic drag grows with v²). But there\'s a twist: if you\'re also carrying a heavy backpack (generating "lift" to keep it above water), that forces you to push harder even when moving slowly. The backpack drag is "induced drag" — the cost of supporting weight.',
      storyConnection: 'Leonardo designed the fusiform (spindle-shaped) fuselage for his flying machines after studying the body shape of birds and fish. His sketches show a pilot lying prone inside a streamlined shell — reducing the frontal area and drag coefficient compared to sitting upright. Modern hang glider pilots use the exact same prone position for the same reason.',
      checkQuestion: 'A flat plate (C_D = 1.2) and a streamlined fairing (C_D = 0.04) have the same frontal area of 0.5 m². At 15 m/s, how much more drag does the plate produce?',
      checkAnswer: 'D_plate = 0.5 × 1.225 × 225 × 0.5 × 1.2 = 82.7 N. D_fairing = 0.5 × 1.225 × 225 × 0.5 × 0.04 = 2.8 N. The plate produces 30× more drag. Streamlining is not a minor optimization — it is the single most important design choice in aerodynamics.',
      codeIntro: 'Model parasitic and induced drag — find the speed where total drag is minimized for different flying machines.',
      code: `import numpy as np

rho = 1.225  # sea level air density

def parasitic_drag(v, frontal_area, c_d):
    return 0.5 * rho * v**2 * frontal_area * c_d

def induced_drag(v, weight, wingspan, e=0.8):
    if v < 1:
        return float('inf')
    L = weight  # in steady flight, lift = weight
    return L**2 / (0.5 * rho * v**2 * np.pi * wingspan**2 * e)

def total_drag(v, frontal_area, c_d, weight, wingspan, e=0.8):
    return parasitic_drag(v, frontal_area, c_d) + induced_drag(v, weight, wingspan, e)

# Compare shapes at same speed
print("=== Drag Coefficients: Shape Matters ===")
print(f"Frontal area: 0.5 m²  |  Speed: 15 m/s\\\n")

shapes = [
    ("Flat plate (perpendicular)", 1.28),
    ("Cube",                       1.05),
    ("Sphere",                     0.47),
    ("Cylinder (lengthwise)",      0.82),
    ("Upright human body",         1.0),
    ("Prone human body",           0.4),
    ("Bird body",                  0.1),
    ("Streamlined fairing",        0.04),
]

for name, c_d in shapes:
    D = parasitic_drag(15, 0.5, c_d)
    bar = "█" * max(1, int(D / 5))
    print(f"  {name:<30} C_D={c_d:<5.2f}  D={D:>6.1f} N  {bar}")

# Drag breakdown for different flyers
print(f"\\\n=== Total Drag vs Speed ===")
flyers = [
    ("Pigeon",             0.003, 0.12, 0.35*9.81,  0.65),
    ("Eagle",              0.02,  0.10, 4.5*9.81,   2.0),
    ("Leonardo ornithopter", 0.4, 0.35, 105*9.81,   8.0),
    ("Modern hang glider", 0.25,  0.08, 105*9.81,  10.0),
]

for name, frontal, c_d, weight, span in flyers:
    print(f"\\\n--- {name} ---")
    print(f"  Frontal: {frontal} m²  C_D: {c_d}  Weight: {weight:.0f} N  Span: {span} m")
    print(f"  {'Speed':>7} {'Parasitic':>10} {'Induced':>10} {'Total':>10} {'L/D':>6}")

    min_drag = float('inf')
    best_speed = 0

    for v in range(3, 35):
        d_p = parasitic_drag(v, frontal, c_d)
        d_i = induced_drag(v, weight, span)
        d_t = d_p + d_i
        ld_ratio = weight / d_t if d_t > 0 else 0

        if d_t < min_drag:
            min_drag = d_t
            best_speed = v

        if v % 4 == 0 or v == 3:
            print(f"  {v:>5} m/s {d_p:>8.1f} N {d_i:>8.1f} N {d_t:>8.1f} N {ld_ratio:>5.1f}")

    print(f"  → Minimum drag at {best_speed} m/s (L/D = {weight/min_drag:.1f})")

# Leonardo vs modern: the streamlining gap
print(f"\\\n=== Leonardo vs Modern: Streamlining Gap ===")
v = 12  # m/s cruising speed
weight = 105 * 9.81

print(f"Speed: {v} m/s  Total weight: 105 kg\\\n")
configs = [
    ("Leonardo (upright pilot, rough frame)",  0.5, 0.6, 7.0),
    ("Leonardo (prone pilot, fabric skin)",    0.3, 0.35, 8.0),
    ("Modern hang glider (prone, clean)",      0.25, 0.08, 10.0),
    ("Modern sailplane (enclosed cockpit)",    0.10, 0.02, 15.0),
]

for name, frontal, c_d, span in configs:
    d_p = parasitic_drag(v, frontal, c_d)
    d_i = induced_drag(v, weight, span)
    d_t = d_p + d_i
    power = d_t * v
    print(f"  {name}")
    print(f"    Drag: {d_t:.1f} N  Power: {power:.0f} W  L/D: {weight/d_t:.1f}")`,
      challenge: 'Add a "drag budget" breakdown: for Leonardo\'s ornithopter at 12 m/s, calculate what percentage of total drag comes from the pilot\'s body, the wing frame, and induced drag. Which component should Leonardo focus on reducing first?',
      successHint: 'You discovered that drag has two competing components — one that grows with speed, one that shrinks. Every aircraft has a sweet spot. Leonardo\'s designs suffered from high parasitic drag (exposed pilot, rough wood frame), but his prone-pilot sketches show he understood the principle. The L/D ratio you calculated is the single most important number in aircraft design.',
    },
    {
      title: 'Power requirements — why humans cannot fly by flapping',
      concept: `The fundamental problem with Leonardo's ornithopter is not lift or drag — it is **power**. To sustain level flight, a flyer must produce enough power to overcome drag continuously:

**P = D × v = total_drag × airspeed**

For Leonardo's ornithopter (105 kg total, 16 m² wings), the minimum power for level flight works out to roughly **1,500 watts**. A trained human athlete can sustain about **75 watts** for hours, peak at **400 watts** for a few minutes, and sprint at **1,200 watts** for seconds.

The gap is devastating: sustained human-powered flapping flight requires **20× more power** than a human can produce.

Nature solves this with **extreme weight efficiency**. A 4 kg eagle generates about 20 watts of sustained flight power — achievable because it weighs only 4 kg. Scale that eagle up to 105 kg while keeping the same proportions, and the required power grows much faster than muscle power (this is the square-cube law, covered in the next lesson).

**Gliding** sidesteps the power problem entirely. A glider converts gravitational potential energy into forward motion. The only "power source" is altitude — and hills and thermals provide that for free.

📚 *The first successful human-powered flight (Gossamer Condor, 1977) used a 30 m wingspan, weighed only 32 kg empty, and flew at just 5 m/s. Even then, the pilot (a champion cyclist) was working at near-maximum sustainable output. The aircraft was essentially a powered glider — nothing like Leonardo's compact ornithopter.*`,
      analogy: 'Imagine pedaling a bicycle up a hill. On flat ground, you need maybe 75 watts. A gentle slope, 150 watts. A steep hill, 400 watts — and you\'re gasping. Now imagine the hill is so steep you need 1,500 watts to avoid rolling backward. That\'s ornithopter flight: the "hill" is gravity, and no amount of leg strength can overcome it without making the bicycle (aircraft) absurdly light.',
      storyConnection: 'Leonardo calculated the wing-beat frequency needed for his ornithopter and wrote that the pilot should use both arms and legs simultaneously. His sketches show elaborate pedal-and-pulley mechanisms to harness all four limbs. Despite this ingenuity, the arithmetic was against him — he had no way to know that the power gap was 20×, not 2×.',
      checkQuestion: 'A hang glider with L/D ratio of 10 weighs 105 kg total. At 12 m/s, how much power does gravity need to supply (i.e., what is the sink rate power)?',
      checkAnswer: 'Drag = Weight / (L/D) = 1030 / 10 = 103 N. Power = D × v = 103 × 12 = 1,236 W. Sink rate = Power / Weight = 1236 / 1030 = 1.2 m/s. The glider descends at 1.2 m/s, converting 1,236 W of gravitational potential energy into forward flight. No muscles needed.',
      codeIntro: 'Calculate the power budget for ornithopters, gliders, and human-powered aircraft — quantify why Leonardo\'s dream was impossible.',
      code: `import numpy as np

rho = 1.225

def flight_power(mass_kg, wing_area, c_l, c_d_total, wingspan, e=0.8):
    """Calculate minimum power for level flight."""
    weight = mass_kg * 9.81
    # Speed for minimum power (not same as minimum drag speed)
    # At min power: induced drag = 3 × parasitic drag
    # Approximate by scanning
    best_power = float('inf')
    best_speed = 0
    for v in np.linspace(3, 40, 200):
        lift = 0.5 * rho * v**2 * wing_area * c_l
        if lift < weight * 0.95:
            continue
        d_parasitic = 0.5 * rho * v**2 * wing_area * c_d_total
        d_induced = weight**2 / (0.5 * rho * v**2 * np.pi * wingspan**2 * e)
        d_total = d_parasitic + d_induced
        power = d_total * v
        if power < best_power:
            best_power = power
            best_speed = v
    return best_power, best_speed

# Human power output
print("=== Human Power Output ===")
print(f"  Sustained (hours):     75 W")
print(f"  Trained cyclist (1hr): 250 W")
print(f"  Sprint (seconds):      1200 W")
print(f"  Elite peak (5 sec):    2000 W\\\n")

# Flight power requirements
print("=== Power Required for Level Flight ===\\\n")

aircraft = [
    ("Pigeon",               0.35, 0.06, 1.6, 0.02, 0.65),
    ("Eagle",                4.5,  0.56, 1.5, 0.03, 2.0),
    ("Albatross",            9.0,  0.62, 1.4, 0.02, 3.4),
    ("Leonardo ornithopter", 105,  16.0, 0.9, 0.05, 8.0),
    ("Gossamer Condor",      100,  75.0, 1.1, 0.01, 29.0),
    ("Modern hang glider",   105,  14.0, 1.2, 0.02, 10.0),
]

for name, mass, area, c_l, c_d, span in aircraft:
    power, speed = flight_power(mass, area, c_l, c_d, span, e=0.8)
    power_per_kg = power / mass
    print(f"  {name}")
    print(f"    Mass: {mass} kg  Span: {span} m  Area: {area} m²")
    print(f"    Min power: {power:.0f} W at {speed:.1f} m/s ({speed*3.6:.0f} km/h)")
    print(f"    Power/kg: {power_per_kg:.1f} W/kg")
    human_ok = "YES" if power < 250 else "MAYBE (sprint)" if power < 1200 else "NO"
    print(f"    Human-sustainable? {human_ok}\\\n")

# The ornithopter vs alternatives
print("=== Why Gliding Works and Flapping Doesn't ===\\\n")

mass = 105  # kg (pilot + frame)
weight = mass * 9.81

# Gliding: convert altitude to range
print("Gliding from a 300 m hilltop:")
for ld in [5, 8, 10, 15, 20]:
    range_m = 300 * ld
    sink = weight / (ld * 12)  # approximate at 12 m/s
    time_aloft = 300 / (weight / (ld * 12) / weight * 9.81)
    print(f"  L/D={ld:>2}: range={range_m:>5} m  sink={9.81/ld:>4.1f} m/s")

# Flapping efficiency
print(f"\\\n=== Flapping Efficiency Penalty ===")
print(f"Flapping adds drag from wing oscillation.")
print(f"Muscle-to-thrust efficiency: ~25% (human) vs ~35% (bird)\\\n")

flap_penalty = 1.5  # flapping adds ~50% to power requirement
for name, mass, area, c_l, c_d, span in aircraft:
    p_glide, speed = flight_power(mass, area, c_l, c_d, span)
    p_flap = p_glide * flap_penalty / 0.25  # account for muscle efficiency
    if mass > 50:  # only show human-scale
        print(f"  {name}")
        print(f"    Glide power (gravity): {p_glide:.0f} W")
        print(f"    Flap power (muscles):  {p_flap:.0f} W")
        print(f"    Human sustainable?     {'Yes' if p_flap < 250 else 'No'}")
        print(f"    Shortfall factor:      {p_flap/250:.1f}×\\\n")`,
      challenge: 'The Gossamer Condor succeeded by being extremely light and slow. Calculate: if Leonardo could have built his ornithopter frame from modern carbon fiber (reducing frame mass from 30 kg to 5 kg) and increased wingspan to 12 m, would human-powered flight become possible? At what frame mass does it become feasible?',
      successHint: 'You proved mathematically what Leonardo could not: human muscles are roughly 20× too weak for ornithopter flight. This is not an engineering gap that better materials can close — it is a fundamental power-to-weight mismatch. The Gossamer Condor succeeded only by extreme wingspan (29 m), ultra-low weight, and a champion cyclist as pilot. Leonardo\'s genius was real; the physics was impossible.',
    },
    {
      title: 'The square-cube law — why giant birds cannot exist',
      concept: `The **square-cube law** is perhaps the most important scaling principle in physics and biology. It says:

When you scale an object up by a factor k, its surface area grows by **k²** but its volume (and mass) grows by **k³**.

For a bird, this is devastating. Muscle **strength** depends on cross-sectional area (k²), but body **weight** depends on volume (k³). Double a bird's size and its muscles are 4× stronger, but it weighs 8× more. The strength-to-weight ratio drops by half.

Wing area also scales as k², so lift scales as k². But weight scales as k³. This means **wing loading** (weight per unit wing area) increases linearly with size: W/A ∝ k.

To compensate, larger birds must fly **faster** (since lift ∝ v²). The minimum flight speed scales as **v ∝ √k**. A bird scaled up 10× must fly √10 ≈ 3.2× faster. And since power = drag × velocity, and drag also increases, the power requirement grows as approximately **k^3.5** — while available muscle power grows as only **k²**.

This is why there is a hard upper limit on flapping flight. The largest flying bird ever, **Argentavis magnificens** (wingspan 7 m, mass 70 kg), was probably at the absolute limit — and it was primarily a soarer, not a flapper.

📚 *Leonardo wanted to scale a bird up to carry a human. The square-cube law makes this physically impossible with biological materials. He could not have known this — the law was first articulated by Galileo in 1638, over a century after Leonardo's death.*`,
      analogy: 'Build a bridge from toothpicks that spans 30 cm. It works fine. Now try to build the same bridge, scaled up 100×, from proportionally larger wooden beams spanning 30 m. It collapses under its own weight. The beams are 10,000× stronger (area scales as 100²) but weigh 1,000,000× more (volume scales as 100³). The strength-to-weight ratio dropped by 100×. This is the square-cube law — and it applies to everything from bridges to birds to buildings.',
      storyConnection: 'Leonardo designed his ornithopter by closely studying pigeons and eagles, then scaling up their proportions to human size. This approach — scaling from nature — seemed logical. But the square-cube law means proportional scaling doesn\'t work. A pigeon scaled to human weight would need impossibly thin, long wings or impossibly powerful muscles. Leonardo\'s method was scientifically sound at the scale he observed; it just doesn\'t extrapolate.',
      checkQuestion: 'If a 0.5 kg bird has a wing area of 0.08 m², what wing area would a geometrically similar bird weighing 80 kg need? And what wing area would it actually need to maintain the same wing loading?',
      checkAnswer: 'Scale factor k = (80/0.5)^(1/3) = 160^(1/3) = 5.43. Geometric scaling gives wing area = 0.08 × 5.43² = 2.36 m². But to maintain the same wing loading (W/A = 0.5×9.81/0.08 = 61.3 N/m²), the 80 kg bird needs A = 80×9.81/61.3 = 12.8 m². That is 5.4× more wing area than geometric scaling provides — the bird would look nothing like a scaled-up version of itself.',
      codeIntro: 'Model the square-cube law across scales — show why scaling a bird to human size breaks flight physics.',
      code: `import numpy as np

rho = 1.225
g = 9.81

def scale_bird(base_mass, base_span, base_area, base_power, target_mass):
    """Scale a bird geometrically and compute flight parameters."""
    k = (target_mass / base_mass) ** (1/3)

    scaled_span = base_span * k
    scaled_area = base_area * k**2
    scaled_weight = target_mass * g

    # Strength scales as k² but weight as k³
    strength_ratio = k**2 / k**3  # relative to base = 1/k

    # Wing loading
    base_loading = base_mass * g / base_area
    scaled_loading = target_mass * g / scaled_area  # grows as k

    # Minimum flight speed (to generate enough lift with C_L=1.5)
    v_min = np.sqrt(2 * scaled_weight / (rho * scaled_area * 1.5))

    # Power available (muscle power scales as k^2 × v, approx k^2.33)
    power_available = base_power * k**2.33

    # Power required scales approximately as k^3.5
    power_required = base_power * k**3.5

    return {
        'k': k, 'span': scaled_span, 'area': scaled_area,
        'loading': scaled_loading, 'v_min': v_min,
        'strength_ratio': strength_ratio,
        'power_available': power_available,
        'power_required': power_required,
    }

# Base bird: pigeon
pigeon_mass = 0.35   # kg
pigeon_span = 0.65   # m
pigeon_area = 0.06   # m²
pigeon_power = 8     # watts sustained flight

print("=== Square-Cube Law: Scaling a Pigeon ===")
print(f"Base: pigeon ({pigeon_mass} kg, {pigeon_span} m span, {pigeon_power} W)\\\n")

print(f"{'Target':>12} {'k':>5} {'Span':>6} {'Area':>6} {'Loading':>8} "
      f"{'Vmin':>6} {'Str/Wt':>7} {'P_avail':>8} {'P_need':>8} {'Flies?':>7}")
print("-" * 85)

targets = [0.35, 1, 3, 10, 30, 70, 105, 200]
for mass in targets:
    r = scale_bird(pigeon_mass, pigeon_span, pigeon_area, pigeon_power, mass)
    flies = "YES" if r['power_available'] >= r['power_required'] else "NO"
    name = ""
    if mass == 0.35: name = " (pigeon)"
    elif mass == 4.5: name = " (eagle)"
    elif mass == 70: name = " (Argentavis)"
    elif mass == 105: name = " (human+)"

    print(f"{mass:>8.1f} kg{name:<12} {r['k']:>5.1f} {r['span']:>5.1f}m "
          f"{r['area']:>5.2f}m² {r['loading']:>6.0f}N/m² {r['v_min']:>5.1f}m/s "
          f"{r['strength_ratio']:>6.2f} {r['power_available']:>7.0f}W "
          f"{r['power_required']:>7.0f}W {flies:>7}")

# Real birds vs geometric prediction
print(f"\\\n=== Real Birds vs Geometric Scaling ===")
print(f"Real birds cheat: they change proportions as they get bigger.\\\n")

real_birds = [
    ("Hummingbird",   0.004, 0.08,  0.001),
    ("Sparrow",       0.03,  0.22,  0.008),
    ("Pigeon",        0.35,  0.65,  0.06),
    ("Crow",          0.5,   0.85,  0.10),
    ("Eagle",         4.5,   2.0,   0.56),
    ("Pelican",       8.0,   2.5,   0.80),
    ("Albatross",     9.0,   3.4,   0.62),
    ("Condor",        12.0,  3.0,   1.10),
    ("Bustard",       18.0,  2.7,   1.30),
    ("Argentavis*",   70.0,  7.0,   8.00),
]

print(f"{'Bird':<15} {'Mass':>6} {'Span':>6} {'Area':>6} {'Loading':>8} "
      f"{'Aspect':>7} {'Vmin':>6}")
print("-" * 60)
for name, mass, span, area in real_birds:
    loading = mass * g / area
    aspect = span**2 / area
    v_min = np.sqrt(2 * mass * g / (rho * area * 1.5))
    print(f"{name:<15} {mass:>5.2f}kg {span:>5.1f}m {area:>5.2f}m² "
          f"{loading:>6.0f}N/m² {aspect:>6.1f} {v_min:>5.1f}m/s")

print(f"\\\nNotice: larger birds have higher aspect ratios (longer, thinner wings)")
print(f"and much higher wing loading — they MUST fly faster.")
print(f"Argentavis needed ~11 m/s just to stay aloft — it was a thermal soarer,")
print(f"not a flapper. Leonardo's 105 kg ornithopter is beyond even this limit.")`,
      challenge: 'Reverse the problem: what is the maximum mass at which a geometrically-scaled pigeon can still sustain flapping flight? Find the crossover point where power required exceeds power available. This is the theoretical maximum size for a flapping bird.',
      successHint: 'You proved that the square-cube law imposes a hard ceiling on flapping flight — somewhere around 15-20 kg for sustained flappers, and about 70 kg for thermal soarers. This law governs far more than flight: it explains why insects can fall from any height unharmed, why elephants have thick legs, why large ships are more fuel-efficient per ton, and why you can\'t simply scale up a microchip design.',
    },
    {
      title: 'Glider design — Leonardo\'s hang glider analyzed with modern equations',
      concept: `Leonardo's most practical design was not the ornithopter but his **hang glider** — a rigid-wing device where the pilot shifts body weight to control pitch and roll. This is essentially the same principle as a modern hang glider.

A glider converts **altitude into range**. The key performance metric is the **glide ratio** (or lift-to-drag ratio, L/D): how far forward the glider travels for each meter of altitude lost.

**Glide ratio = L/D = horizontal distance / altitude lost**

A modern hang glider achieves L/D ≈ 15. Leonardo's design, with its wood-and-fabric construction and limited streamlining, would achieve perhaps L/D ≈ 5-8.

The **sink rate** tells you how fast you're losing altitude:

**V_sink = V × sin(glide_angle) ≈ V / (L/D)**

Minimum sink rate occurs at a different (slower) speed than best glide ratio. A pilot seeking maximum range flies at best-glide speed; a pilot seeking maximum time aloft flies at minimum-sink speed.

From a hilltop of height h, the maximum range is simply:

**Range = h × (L/D)**

With a 300 m hill and L/D = 7, Leonardo could fly 2.1 km. Not crossing the Alps, but genuinely useful — and genuinely flying.

📚 *Leonardo's 1505 notebook entry states he planned to test his "great bird" from Monte Ceceri near Florence (elevation gain ~200 m above the valley). At L/D ≈ 7, this gives a range of 1.4 km — a plausible first flight. Whether the test actually occurred is debated, but the physics checks out.*`,
      analogy: 'A glider is a ball rolling down a very gentle slope — except the slope is invisible (it\'s the glide angle through the air). A glide ratio of 15 means for every meter of invisible "slope" you descend, you travel 15 meters forward. A steeper slope (worse L/D) gets you down faster but with less range. Thermals are like conveyor belts that carry the ball back uphill — free altitude.',
      storyConnection: 'Leonardo wrote: "The great bird will take its first flight from the summit of Monte Ceceri, filling the universe with amazement." His assistant Tommaso Masini may have attempted a flight in 1506, reportedly breaking his leg. If this happened, it was likely a short glide that ended in a crash — exactly what the aerodynamic numbers predict for an unoptimized L/D ≈ 5 design.',
      checkQuestion: 'From a 200 m hilltop, a glider with L/D = 7 launches at 10 m/s. What is its range and time aloft?',
      checkAnswer: 'Range = 200 × 7 = 1,400 m (1.4 km). Sink rate = 10 / 7 = 1.43 m/s. Time aloft = 200 / 1.43 = 140 seconds (2 min 20 sec). A brief but real flight — enough to prove the concept.',
      codeIntro: 'Design and analyze gliders — calculate performance from Leonardo\'s wood-and-fabric prototype to modern competition hang gliders.',
      code: `import numpy as np

rho = 1.225
g = 9.81

def glider_performance(mass_kg, wing_area, c_l, c_d_wing, c_d_body,
                        frontal_body, wingspan, e=0.8):
    """Full glider performance analysis."""
    weight = mass_kg * g

    results = []
    for v in np.linspace(5, 30, 100):
        # Lift at this speed
        lift = 0.5 * rho * v**2 * wing_area * c_l
        if lift < weight * 0.9:
            continue

        # Adjust C_L to exactly support weight
        c_l_actual = 2 * weight / (rho * v**2 * wing_area)
        if c_l_actual > 2.0:
            continue

        # Drag components
        d_wing = 0.5 * rho * v**2 * wing_area * c_d_wing
        d_body = 0.5 * rho * v**2 * frontal_body * c_d_body
        d_induced = weight**2 / (0.5 * rho * v**2 * np.pi * wingspan**2 * e)
        d_total = d_wing + d_body + d_induced

        ld = weight / d_total
        sink = v / ld
        power_sink = weight * sink  # power from gravity

        results.append({
            'v': v, 'c_l': c_l_actual, 'drag': d_total,
            'ld': ld, 'sink': sink, 'power': power_sink
        })

    return results

# Glider designs spanning 500 years
designs = [
    ("Leonardo proto (1505)",   105, 14, 0.9, 0.015, 0.6, 0.5, 7.0),
    ("Leonardo improved",       100, 16, 1.0, 0.012, 0.4, 0.4, 8.5),
    ("Lilienthal (1896)",        95, 14, 1.1, 0.010, 0.3, 0.3, 7.0),
    ("Rogallo wing (1960s)",    100, 16, 1.1, 0.012, 0.2, 0.2, 9.0),
    ("Modern hang glider",      105, 14, 1.2, 0.008, 0.08, 0.2, 10.0),
    ("Competition glider",      105, 13, 1.3, 0.006, 0.05, 0.15, 15.0),
]

for name, mass, area, c_l, c_d_w, c_d_b, frontal, span in designs:
    results = glider_performance(mass, area, c_l, c_d_w, c_d_b, frontal, span)
    if not results:
        continue

    best_ld = max(results, key=lambda r: r['ld'])
    min_sink = min(results, key=lambda r: r['sink'])

    print(f"=== {name} ===")
    print(f"  Mass: {mass} kg  Area: {area} m²  Span: {span} m  AR: {span**2/area:.1f}")
    print(f"  Best glide: L/D = {best_ld['ld']:.1f} at {best_ld['v']:.1f} m/s "
          f"({best_ld['v']*3.6:.0f} km/h)")
    print(f"  Min sink:   {min_sink['sink']:.2f} m/s at {min_sink['v']:.1f} m/s "
          f"({min_sink['v']*3.6:.0f} km/h)")

    # Range from Monte Ceceri (200 m)
    range_m = 200 * best_ld['ld']
    time_s = 200 / min_sink['sink']
    print(f"  From Monte Ceceri (200 m): range {range_m:.0f} m, "
          f"max time {time_s:.0f} s ({time_s/60:.1f} min)\\\n")

# Speed-to-fly polar
print("=== Speed Polar: Leonardo vs Modern ===")
print(f"{'Speed':>7} {'Leonardo sink':>14} {'Modern sink':>12}")
print("-" * 35)

leo_r = glider_performance(105, 14, 0.9, 0.015, 0.6, 0.5, 7.0)
mod_r = glider_performance(105, 14, 1.2, 0.008, 0.08, 0.2, 10.0)

leo_dict = {round(r['v']): r['sink'] for r in leo_r}
mod_dict = {round(r['v']): r['sink'] for r in mod_r}

for v in range(7, 26):
    ls = leo_dict.get(v, None)
    ms = mod_dict.get(v, None)
    ls_str = f"{ls:.2f} m/s" if ls else "  ---"
    ms_str = f"{ms:.2f} m/s" if ms else "  ---"
    print(f"  {v:>3} m/s   {ls_str:>12}   {ms_str:>12}")`,
      challenge: 'Add thermal soaring: if a thermal provides a 2 m/s updraft, calculate the airspeed at which each glider can climb (updraft > sink rate). How long would it take Leonardo\'s glider to gain 500 m in a thermal, and how far could it then glide?',
      successHint: 'You analyzed Leonardo\'s glider with the same equations used to design modern sailplanes. His Monte Ceceri design was marginal but physically possible — L/D of 5-7 is poor by modern standards but sufficient for a short demonstration flight. The key insight: Leonardo\'s glider was his best design, not the ornithopter. Sometimes the simplest approach is the most viable.',
    },
    {
      title: 'Turbulence — Leonardo\'s sketches of chaotic flow',
      concept: `Leonardo da Vinci produced the first known scientific illustrations of **turbulence** — his detailed drawings of water flowing past obstacles, forming eddies, vortices, and chaotic swirling patterns. These sketches, made around 1510, remain strikingly accurate to this day.

Fluid flow transitions from smooth (**laminar**) to chaotic (**turbulent**) depending on the **Reynolds number**:

**Re = ρ × v × L / μ**

where ρ is fluid density, v is flow velocity, L is a characteristic length (like pipe diameter or wing chord), and μ is dynamic viscosity. For flow over a wing:

- **Re < 500,000**: laminar (smooth, predictable)
- **Re > 500,000**: turbulent (chaotic, energy-dissipating)

Turbulence has enormous consequences for flight. Turbulent boundary layers create **more skin friction drag** than laminar ones (roughly 5-10× more). But turbulent layers also resist **flow separation** better — they cling to the wing surface longer before breaking away. This is why golf balls have dimples: the dimples trigger turbulence, which keeps the airflow attached and reduces overall drag.

The mathematics of turbulence is described by the **Navier-Stokes equations** — and proving whether smooth solutions always exist is one of the seven **Millennium Prize Problems** (worth $1 million). After 500+ years since Leonardo's sketches and 180+ years since Navier-Stokes was written down, we still cannot fully solve turbulence.

📚 *Leonardo wrote: "Observe the motion of the surface of the water, which resembles that of hair, which has two motions, one of which depends on the weight of the hair, the other on the direction of the curls; thus the water has eddying motions, one of which follows the main current, and the other follows the incidental motion of deflection." This is a qualitative description of turbulent energy cascade — eddies within eddies — formalized by Kolmogorov in 1941.*`,
      analogy: 'Stir honey slowly with a spoon — the flow is smooth, predictable, and you can trace any path a honey particle would take. This is laminar flow. Now stir water rapidly — the flow explodes into chaotic swirls, vortices, and eddies at all scales. You cannot predict where any single water particle will go. This is turbulence. The transition depends on viscosity (honey vs water) and speed — captured by the Reynolds number.',
      storyConnection: 'Leonardo\'s turbulence drawings in the Codex Leicester show water pouring into a pool and forming vortex structures at multiple scales. He noticed that large eddies break into smaller ones, which break into still smaller ones — the turbulent energy cascade. He was 430 years ahead of Kolmogorov\'s mathematical description of this same phenomenon.',
      checkQuestion: 'A wing chord is 1.5 m, airspeed is 12 m/s, air density is 1.225 kg/m³, and dynamic viscosity of air is 1.81 × 10⁻⁵ Pa·s. What is the Reynolds number? Is the flow laminar or turbulent?',
      checkAnswer: 'Re = 1.225 × 12 × 1.5 / 1.81e-5 = 22.05 / 1.81e-5 = 1,218,000. This is well above the 500,000 transition — the flow is fully turbulent. This is typical for any human-scale aircraft.',
      codeIntro: 'Calculate Reynolds numbers for Leonardo\'s designs, model the laminar-turbulent transition, and explore why turbulence remains unsolved.',
      code: `import numpy as np

# Air and water properties
mu_air = 1.81e-5    # dynamic viscosity of air (Pa·s)
mu_water = 1.0e-3   # dynamic viscosity of water (Pa·s)
rho_air = 1.225      # kg/m³
rho_water = 998      # kg/m³

def reynolds(rho, v, L, mu):
    """Calculate Reynolds number."""
    return rho * v * L / mu

def flow_regime(Re):
    if Re < 2300:
        return "Laminar"
    elif Re < 500000:
        return "Transitional"
    else:
        return "Turbulent"

# Reynolds numbers across Leonardo's world
print("=== Reynolds Numbers: Leonardo's Observations ===\\\n")

scenarios = [
    ("Honey stirred slowly",      1400, 0.05, 0.02, 2.0),
    ("Blood in artery",           1060, 0.3,  0.01, 3.5e-3),
    ("Water in stream",           rho_water, 0.5, 0.3, mu_water),
    ("Water past rock in river",  rho_water, 1.0, 0.5, mu_water),
    ("River rapids",              rho_water, 3.0, 2.0, mu_water),
    ("Waterfall into pool",       rho_water, 5.0, 1.0, mu_water),
    ("Air past candle flame",     rho_air, 0.3, 0.01, mu_air),
    ("Bird wing (pigeon)",        rho_air, 15, 0.08, mu_air),
    ("Bird wing (eagle)",         rho_air, 12, 0.35, mu_air),
    ("Leonardo ornithopter wing", rho_air, 12, 2.0, mu_air),
    ("Modern hang glider",        rho_air, 15, 1.5, mu_air),
    ("Boeing 747 wing",           rho_air, 250, 8.0, mu_air),
]

print(f"{'Scenario':<30} {'Re':>12} {'Regime':<15}")
print("-" * 60)
for name, rho, v, L, mu in scenarios:
    Re = reynolds(rho, v, L, mu)
    regime = flow_regime(Re)
    exp = int(np.log10(max(Re, 1)))
    print(f"{name:<30} {Re:>12.0f} {regime:<15} (10^{exp})")

# Drag: laminar vs turbulent
print(f"\\\n=== Skin Friction: Laminar vs Turbulent ===")
print(f"The friction coefficient depends on Reynolds number:\\\n")

def c_f_laminar(Re):
    """Blasius solution for laminar flat plate."""
    return 1.328 / np.sqrt(Re)

def c_f_turbulent(Re):
    """Schlichting formula for turbulent flat plate."""
    return 0.455 / (np.log10(Re))**2.58

print(f"{'Re':>12} {'C_f laminar':>12} {'C_f turbulent':>14} {'Turb/Lam ratio':>16}")
print("-" * 56)
for exp in range(4, 9):
    Re = 10**exp
    c_fl = c_f_laminar(Re)
    c_ft = c_f_turbulent(Re)
    ratio = c_ft / c_fl
    print(f"  10^{exp:<6} {c_fl:>12.6f} {c_ft:>14.6f} {ratio:>14.1f}×")

# Leonardo's wing: transition effects
print(f"\\\n=== Leonardo's Wing: Transition Point ===")
chord = 2.0  # m
v = 12       # m/s

Re_chord = reynolds(rho_air, v, chord, mu_air)
print(f"Wing chord: {chord} m, Airspeed: {v} m/s")
print(f"Full-chord Re: {Re_chord:.0f}\\\n")

# Transition occurs at Re ≈ 500,000
x_transition = 500000 * mu_air / (rho_air * v)
pct = x_transition / chord * 100
print(f"Transition to turbulence at x = {x_transition:.2f} m ({pct:.0f}% of chord)")
print(f"Laminar region: 0 to {x_transition:.2f} m (low friction)")
print(f"Turbulent region: {x_transition:.2f} to {chord} m (high friction)")

# Drag comparison
area = 16  # m² wing area
d_lam = 0.5 * rho_air * v**2 * area * c_f_laminar(Re_chord)
d_turb = 0.5 * rho_air * v**2 * area * c_f_turbulent(Re_chord)
d_mixed = d_lam * (pct/100) + d_turb * (1 - pct/100)
print(f"\\\nSkin friction drag (16 m² wing at {v} m/s):")
print(f"  If fully laminar:    {d_lam:.1f} N")
print(f"  If fully turbulent:  {d_turb:.1f} N")
print(f"  Mixed (realistic):   {d_mixed:.1f} N")

# The Kolmogorov cascade
print(f"\\\n=== Turbulent Energy Cascade (Kolmogorov 1941) ===")
print(f"Leonardo sketched eddies within eddies — Kolmogorov quantified it.\\\n")

Re_flow = 1e6
eta = chord * Re_flow**(-3/4)  # Kolmogorov microscale
L_large = chord * 0.1          # largest eddy ~ 10% of chord
ratio = L_large / eta

print(f"Flow Re = {Re_flow:.0e}")
print(f"Largest eddy:       {L_large*1000:.1f} mm")
print(f"Smallest eddy (η):  {eta*1000:.4f} mm")
print(f"Scale ratio:        {ratio:.0f}:1")
print(f"\\\nEnergy cascades from {L_large*1000:.1f} mm eddies down to")
print(f"{eta*1000:.4f} mm eddies where viscosity dissipates it as heat.")
print(f"\\\nThis cascade is what Leonardo drew — and what the")
print(f"Navier-Stokes Millennium Prize problem asks us to prove")
print(f"always behaves smoothly. 500 years later, still unsolved.")`,
      challenge: 'Leonardo observed water, not air. Calculate the Reynolds number for water flowing past a 30 cm rock at 1 m/s, then find the equivalent airspeed that would produce the same Reynolds number around his 2 m wing chord. This explains why Leonardo could observe turbulence in water but not easily in air — same physics, different scales.',
      successHint: 'You connected Leonardo\'s 500-year-old water sketches to modern turbulence theory and the unsolved Navier-Stokes problem. His observations of the energy cascade — large eddies spawning smaller eddies — were formalized by Kolmogorov four centuries later. Turbulence affects every flying machine, every weather system, and every flowing fluid. It is the most important unsolved problem in classical physics, and Leonardo was the first to study it systematically.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Aerodynamics, biomimicry, and the square-cube law through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model lift, drag, power requirements, scaling laws, glider design, and turbulence — the physics behind Leonardo's flying machines.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
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
