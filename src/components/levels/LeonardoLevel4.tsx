import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function LeonardoLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: System design — Wing, Atmosphere, and Aircraft classes',
      concept: `In this capstone, you build a complete **Flight Simulator** that: (1) defines Wing, Atmosphere, and Aircraft classes, (2) calculates lift/drag forces at any speed and angle, (3) predicts glide range and sink rate, (4) optimises wing dimensions, and (5) generates a design report.

The first step is **system design** — defining classes and relationships before algorithms. The Wing handles aerodynamics. The Atmosphere handles air density. The Aircraft combines them and delegates calculations.

📚 *Object-oriented design separates concerns: each class owns one domain. The Wing doesn't know about payload. The Atmosphere doesn't know about wings. The Aircraft orchestrates them — independently testable and reusable.*`,
      analogy: 'A flight simulator is like a recipe with three ingredient groups: the wing (flour — provides structure), the atmosphere (water — the medium everything operates in), and the aircraft (the complete dough — combining ingredients into something functional). Define each ingredient group clearly, and the recipe writes itself.',
      storyConnection: 'Leonardo sketched wing, frame, harness, and controls together but couldn\'t test components in isolation. Our object-oriented approach tests each separately, then combines them — a methodology Leonardo would have envied.',
      checkQuestion: 'Why is it better to have a separate Atmosphere class rather than hardcoding air density in the Wing class?',
      checkAnswer: 'Atmospheric conditions change with altitude, temperature, and humidity. A separate class lets you test the same wing at sea level and 3,000 m without modifying the Wing class — just swap Atmosphere instances.',
      codeIntro: 'Design the architecture of the Flight Simulator — define the Wing, Atmosphere, and Aircraft classes with their properties and interfaces.',
      code: `import numpy as np

class Atmosphere:
    def __init__(self, altitude_m=0, temperature_C=15):
        self.altitude = altitude_m
        T_sea = temperature_C + 273.15
        self.temperature = T_sea - 0.0065 * altitude_m
        self.pressure = 101325 * (self.temperature / T_sea) ** 5.2561
        self.density = self.pressure / (287.05 * self.temperature)
    def __repr__(self):
        return f"Atmosphere(alt={self.altitude}m, rho={self.density:.3f} kg/m3)"

class Wing:
    def __init__(self, span, chord, camber=0.04, thickness=0.12,
                 oswald_e=0.85, cd0=0.03):
        self.span, self.chord = span, chord
        self.area = span * chord
        self.aspect_ratio = span**2 / self.area
        self.camber, self.thickness = camber, thickness
        self.oswald_e, self.cd0 = oswald_e, cd0

    @property
    def cl_max(self):
        return 0.9 + 8 * self.camber + 0.1 * self.thickness * 10

    def cl(self, alpha_deg):
        alpha_0 = -2 * self.camber
        return min(2 * np.pi * (np.radians(alpha_deg) - alpha_0), self.cl_max)

    def cd(self, cl):
        return self.cd0 + cl**2 / (np.pi * self.aspect_ratio * self.oswald_e)

    def __repr__(self):
        return f"Wing(span={self.span}m, area={self.area:.1f}m2, AR={self.aspect_ratio:.1f})"

class Aircraft:
    def __init__(self, name, wing, mass_empty, mass_pilot=75):
        self.name, self.wing = name, wing
        self.mass_empty, self.mass_pilot = mass_empty, mass_pilot
        self.mass_total = mass_empty + mass_pilot
        self.weight = self.mass_total * 9.81

    @property
    def wing_loading(self):
        return self.weight / self.wing.area

    def __repr__(self):
        return f"Aircraft('{self.name}', {self.mass_total}kg, WL={self.wing_loading:.1f} N/m2)"


# Build Leonardo's designs
atm_sea = Atmosphere(0)
atm_mountain = Atmosphere(1500)  # testing from a hilltop

leo_ornithopter = Aircraft(
    "Leonardo Ornithopter",
    Wing(span=8, chord=1.5, camber=0.05, thickness=0.08, cd0=0.06),
    mass_empty=55
)

leo_glider = Aircraft(
    "Leonardo Glider (1505)",
    Wing(span=12, chord=1.5, camber=0.04, thickness=0.10, cd0=0.04),
    mass_empty=25
)

modern_glider = Aircraft(
    "Modern Sailplane",
    Wing(span=18, chord=1.0, camber=0.02, thickness=0.15, cd0=0.008),
    mass_empty=250, mass_pilot=80
)

# System overview
print("=== Flight Simulator — System Architecture ===\\n")
print(f"Atmospheres:")
print(f"  {atm_sea}")
print(f"  {atm_mountain}")
print(f"\\nAircraft:")
for ac in [leo_ornithopter, leo_glider, modern_glider]:
    print(f"  {ac}")
    print(f"    Wing: {ac.wing}")
    print(f"    Cl_max: {ac.wing.cl_max:.2f}")
    print(f"    Wing loading: {ac.wing_loading:.1f} N/m²")`,
      challenge: 'Add a "Propulsion" class with attributes for power_available (W) and propulsive_efficiency. Attach it to the Aircraft class. For Leonardo\'s ornithopter, power_available = 75 W (human), efficiency = 0.15. For a modern HPV, power = 200 W, efficiency = 0.85. How does propulsion interact with the aerodynamic model?',
      successHint: 'Good system design makes everything else easier. You defined three classes with clear responsibilities — Atmosphere handles air properties, Wing handles aerodynamics, Aircraft combines them. This separation of concerns is the foundation of all engineering software from MATLAB to ANSYS.',
    },
    {
      title: 'The lift-drag engine — calculating forces at any speed and angle',
      concept: `The **force engine** calculates lift, drag, and net forces at any flight condition: q = 0.5 × rho × V², L = q × S × Cl(alpha), D = q × S × Cd(Cl), plus vertical and horizontal force components.

It detects: **stall** (Cl exceeds Cl_max), **structural overload** (load factor too high), and **power deficit** (drag exceeds thrust). Every performance calculation calls this function.

📚 *Load factor n = L/W measures g's experienced. Normal flight = 1g. 60-degree bank = 2g. Structural limits: 3-4g for gliders, 6-9g for aerobatic aircraft.*`,
      analogy: 'The force engine is like a kitchen scale that weighs all the forces acting on the aircraft at a single instant. Lift pushes up, weight pulls down, drag pushes back. The difference tells you whether the aircraft climbs, descends, accelerates, or decelerates. Run this calculation every fraction of a second and you have a flight simulator.',
      storyConnection: 'Leonardo sketched force diagrams showing weight, air resistance, and "impetus" (his word for lift). His diagrams were qualitatively correct — the force engine makes them quantitative.',
      checkQuestion: 'An aircraft weighs 1,000 N and flies at q = 500 Pa with S = 10 m² and Cl = 0.2. What is the lift? Is the aircraft climbing or descending?',
      checkAnswer: 'L = q × S × Cl = 500 × 10 × 0.2 = 1,000 N. Lift exactly equals weight — the aircraft is in level flight (neither climbing nor descending). If speed increases slightly, Cl must decrease (or the aircraft climbs). If speed decreases, Cl must increase (or the aircraft descends).',
      codeIntro: 'Build the force calculation engine and compute the complete force balance for Leonardo\'s aircraft at various flight conditions.',
      code: `import numpy as np

class Atmosphere:
    def __init__(self, altitude_m=0):
        T = 288.15 - 0.0065 * altitude_m
        self.density = 101325 * (T / 288.15) ** 5.2561 / (287.05 * T)

class Wing:
    def __init__(self, span, chord, camber=0.04, thickness=0.12, oswald_e=0.85, cd0=0.03):
        self.area, self.ar = span * chord, span**2 / (span * chord)
        self.camber, self.oswald_e, self.cd0 = camber, oswald_e, cd0
        self.cl_max = 0.9 + 8 * camber + 0.1 * thickness * 10
    def aero(self, alpha_deg):
        cl = min(2 * np.pi * (np.radians(alpha_deg) + 2 * self.camber), self.cl_max)
        return cl, self.cd0 + cl**2 / (np.pi * self.ar * self.oswald_e)

class Aircraft:
    def __init__(self, name, wing, mass_total):
        self.name, self.wing, self.mass = name, wing, mass_total
        self.weight = mass_total * 9.81

def calculate_forces(aircraft, atm, speed_ms, alpha_deg):
    """Calculate all aerodynamic forces at a given flight condition."""
    cl, cd = aircraft.wing.aero(alpha_deg)
    q = 0.5 * atm.density * speed_ms**2
    S = aircraft.wing.area
    lift, drag = q * S * cl, q * S * cd
    alpha_rad = np.radians(alpha_deg)
    return {
        "cl": cl, "cd": cd, "q": q, "lift": lift, "drag": drag,
        "ld_ratio": cl / cd if cd > 0 else 0,
        "f_vertical": lift * np.cos(alpha_rad) - aircraft.weight - drag * np.sin(alpha_rad),
        "f_horizontal": -drag * np.cos(alpha_rad) + lift * np.sin(alpha_rad),
        "load_factor": lift / aircraft.weight,
        "stalled": cl >= aircraft.wing.cl_max * 0.98,
        "power_required": drag * speed_ms
    }

# Build aircraft
atm = Atmosphere(0)

aircraft_list = [
    Aircraft("Leonardo Ornithopter",
             Wing(8, 1.5, 0.05, 0.08, 0.85, 0.06), 130),
    Aircraft("Leonardo Glider",
             Wing(12, 1.5, 0.04, 0.10, 0.85, 0.04), 100),
    Aircraft("Wright Flyer",
             Wing(12.3, 2.0, 0.03, 0.06, 0.80, 0.035), 340),
    Aircraft("Modern Sailplane",
             Wing(18, 1.0, 0.02, 0.15, 0.90, 0.008), 330),
]

# Force table at 10 m/s, 5 degrees
print("=== Force Analysis at V=10 m/s, alpha=5 deg ===")
print(f"{'Aircraft':<24} {'Lift(N)':>8} {'Drag(N)':>8} {'L/D':>6} {'n':>5} {'Pwr(W)':>7} {'Status':>8}")
print("-" * 68)

for ac in aircraft_list:
    f = calculate_forces(ac, atm, 10, 5)
    excess = f["lift"] - ac.weight
    status = "STALL" if f["stalled"] else "CLIMB" if excess > 10 else "LEVEL" if abs(excess) < 10 else "SINK"
    print(f"{ac.name:<24} {f['lift']:>7.0f} {f['drag']:>7.0f} {f['ld_ratio']:>5.1f} "
          f"{f['load_factor']:>4.2f} {f['power_required']:>6.0f} {status:>8}")

# Speed sweep for Leonardo's glider
print("\\n=== Leonardo's Glider: Force vs Speed ===")
leo = aircraft_list[1]
print(f"{'Speed':>7} {'Cl':>6} {'Lift':>7} {'Drag':>6} {'L/D':>6} {'Pwr':>7} {'Stall?':>7}")
print("-" * 48)
for v in [5, 7, 9, 11, 13, 15, 18, 22]:
    # Find alpha for level flight: L = W => Cl = W / (q*S)
    q = 0.5 * atm.density * v**2
    cl_needed = leo.weight / (q * leo.wing.area)
    # Invert Cl to find alpha
    alpha_needed = np.degrees(cl_needed / (2 * np.pi) - 2 * leo.wing.camber)
    f = calculate_forces(leo, atm, v, max(alpha_needed, -5))
    stall_flag = "YES" if f["stalled"] else "no"
    print(f"{v:>5}m/s {f['cl']:>5.2f} {f['lift']:>6.0f} {f['drag']:>5.0f} "
          f"{f['ld_ratio']:>5.1f} {f['power_required']:>6.0f}W {stall_flag:>6}")

print("\\nThe force engine reveals the complete performance envelope:")
print("where the aircraft can fly, where it stalls, and how much power it needs.")`,
      challenge: 'Add a "gust response" calculation: if a vertical gust of 3 m/s hits the aircraft, the effective angle of attack increases by arctan(w_gust / V). Calculate the load factor spike for each aircraft at V = 12 m/s. The sailplane (low wing loading) will experience a larger load factor change than the heavier Wright Flyer — explaining why light aircraft are bumpier in turbulence.',
      successHint: 'You built the aerodynamic force engine — the core of every flight simulator. Lift, drag, and weight must balance for steady flight. Any imbalance causes acceleration. This force balance is the fundamental equation of flight.',
    },
    {
      title: 'Glide performance predictor — range, sink rate, best glide speed',
      concept: `Without an engine, glide performance is everything. **Glide ratio** = L/D = horizontal distance per metre of altitude lost. **Sink rate** = descent speed = V × sin(gamma). **Best glide speed** maximises range; minimum sink speed maximises time aloft.

For Leonardo launching from a hilltop: **Range = height × L/D**. Modern sailplanes achieve 50:1; Leonardo's glider would manage 5-7:1.

📚 *Glide angle gamma = arctan(1/(L/D)). At L/D = 10, gamma = 5.7 deg (gentle). At L/D = 3, gamma = 18.4 deg (steep, dangerous).*`,
      analogy: 'Imagine sliding down a hill on a sled. A smooth, icy hill (low friction = low drag) lets you travel far. A rough, gravel hill (high friction) stops you quickly. The L/D ratio is the "smoothness" of the air-hill your glider slides down. Higher L/D = smoother hill = further range.',
      storyConnection: 'Leonardo planned to test from Monte Ceceri near Florence — 300 m above the valley. With L/D of 5-7, he could glide 1,500-2,100 m. Whether he actually flew is debated, but the mathematics suggest a steep but controlled glide was plausible.',
      checkQuestion: 'Leonardo launches from a 200 m hilltop with L/D = 6. How far can he glide? What is his glide angle?',
      checkAnswer: 'Range = 200 × 6 = 1,200 m. Glide angle = arctan(1/6) = 9.5 degrees. This is a steep descent — about twice as steep as a typical approach path for a commercial jet (3 degrees). The landing would be rough but survivable if the terrain was flat and soft.',
      codeIntro: 'Build the glide performance predictor — calculate range, sink rate, and best glide speed for Leonardo\'s machines.',
      code: `import numpy as np

class Wing:
    def __init__(self, span, chord, camber=0.04, thickness=0.12, oswald_e=0.85, cd0=0.03):
        self.area, self.ar = span * chord, span**2 / (span * chord)
        self.camber, self.oswald_e, self.cd0 = camber, oswald_e, cd0
        self.cl_max = 0.9 + 8 * camber + 0.1 * thickness * 10

class Aircraft:
    def __init__(self, name, wing, mass):
        self.name, self.wing, self.mass = name, wing, mass
        self.weight = mass * 9.81

def glide_analysis(aircraft, rho=1.225, n_speeds=200):
    """Calculate glide performance across all feasible speeds."""
    results = []
    w = aircraft.wing
    for v in np.linspace(5, 35, n_speeds):
        q = 0.5 * rho * v**2
        cl = aircraft.weight / (q * w.area)
        if cl > w.cl_max or cl < 0: continue
        cd = w.cd0 + cl**2 / (np.pi * w.ar * w.oswald_e)
        ld = cl / cd
        glide_angle_rad = np.arctan(1 / ld)
        results.append({"speed": v, "cl": cl, "cd": cd, "ld": ld,
            "glide_angle_deg": np.degrees(glide_angle_rad),
            "sink_rate": v * np.sin(glide_angle_rad)})
    return results

# Define aircraft
craft = [
    Aircraft("Leonardo Ornithopter",
             Wing(8, 1.5, 0.05, 0.08, 0.85, 0.06), 130),
    Aircraft("Leonardo Glider (1505)",
             Wing(12, 1.5, 0.04, 0.10, 0.85, 0.04), 100),
    Aircraft("Hang Glider",
             Wing(10, 1.5, 0.03, 0.12, 0.85, 0.025), 120),
    Aircraft("Modern Sailplane",
             Wing(18, 1.0, 0.02, 0.15, 0.90, 0.008), 330),
]

launch_height = 300  # Monte Ceceri elevation above valley

print("=== Glide Performance Analysis ===")
print(f"Launch height: {launch_height} m | Sea level conditions\\n")

print(f"{'Aircraft':<24} {'Best L/D':>8} {'V_bg':>7} {'V_ms':>7} {'Sink_min':>9} {'Range':>7}")
print("-" * 64)

for ac in craft:
    results = glide_analysis(ac)
    if not results:
        continue

    # Best glide speed: maximum L/D
    best_ld_point = max(results, key=lambda r: r["ld"])
    # Minimum sink: lowest sink rate
    min_sink_point = min(results, key=lambda r: r["sink_rate"])

    glide_range = launch_height * best_ld_point["ld"]

    print(f"{ac.name:<24} {best_ld_point['ld']:>6.1f}:1 "
          f"{best_ld_point['speed']:>5.1f}ms {min_sink_point['speed']:>5.1f}ms "
          f"{min_sink_point['sink_rate']:>7.2f}ms {glide_range:>6.0f}m")

# Detailed speed polar for Leonardo's glider
print("\\n=== Leonardo's Glider: Speed Polar ===")
leo_results = glide_analysis(craft[1])
print(f"{'Speed':>7} {'Cl':>6} {'Cd':>7} {'L/D':>6} {'Sink':>7} {'Glide':>6} {'Range':>7}")
print("-" * 48)
for r in leo_results:
    if abs(r["speed"] - round(r["speed"])) < 0.1 and 6 <= r["speed"] <= 22:
        rng = launch_height * r["ld"]
        print(f"{r['speed']:>5.0f}ms {r['cl']:>5.2f} {r['cd']:>6.4f} "
              f"{r['ld']:>5.1f} {r['sink_rate']:>5.2f}ms {r['glide_angle_deg']:>4.1f}d {rng:>6.0f}m")

# Effect of altitude (thinner air)
print("\\n=== Altitude Effect on Glide Speed ===")
leo = craft[1]
for alt in [0, 1000, 2000, 3000]:
    T = 288.15 - 0.0065 * alt
    rho = 101325 * (T / 288.15) ** 5.2561 / (287.05 * T)
    results = glide_analysis(leo, rho)
    if results:
        best = max(results, key=lambda r: r["ld"])
        print(f"  {alt:>5}m: rho={rho:.3f}, V_bg={best['speed']:.1f}m/s")
print("L/D stays constant with altitude, but true airspeed increases.")`,
      challenge: 'Leonardo\'s assistant reportedly tested a glider from Monte Ceceri and broke his leg on landing. Calculate the landing speed at the end of a 300 m glide (it equals the best glide speed). Then estimate the vertical impact speed (sink rate at that speed). Is a broken leg the expected outcome? Compare to a modern hang glider\'s landing speed.',
      successHint: 'Glide performance analysis is how glider pilots plan flights — range from current altitude at best glide speed. Leonardo\'s glider had marginal but real performance: enough for a short, steep flight from a hilltop.',
    },
    {
      title: 'Design optimiser — wing dimensions for maximum range',
      concept: `What is the **optimal wing** for a human-launched glider? Variables: span, chord, camber, thickness. Objective: maximise glide range from 300 m. Constraints: realistic mass, structural soundness, stall speed < 12 m/s, span < 15 m.

This is **constrained optimisation** — grid search over thousands of combinations, checking each against constraints and the objective function.

📚 *Every aircraft, bridge, and circuit board is the result of maximising performance subject to constraints on weight, cost, strength, and manufacturability.*`,
      analogy: 'Imagine choosing the best backpack for a hiking trip. You want maximum capacity (range), but it can\'t weigh more than 2 kg (structural limit), must fit through doorways (span limit), and you must be able to lift it onto your back (stall speed). You try every backpack in the store and pick the best one that meets all constraints. That\'s grid search optimisation.',
      storyConnection: 'Leonardo iterated on his designs by sketching variants — wider wings, narrower wings, more camber, less camber. He was doing manual optimisation. But without quantitative analysis, he couldn\'t evaluate each variant objectively. The optimiser you\'re building does what Leonardo\'s intuition attempted: systematically search for the best design.',
      checkQuestion: 'An optimisation finds that a 14 m wingspan gives the best glide range, but the wing breaks at 3g loads. A 12 m wing survives 4g but has 15% less range. Which is the better design?',
      checkAnswer: 'The 12 m wing — an aircraft that breaks in turbulence is not a viable design regardless of its range. The constraint (structural survival) is not negotiable. This is why constrained optimisation matters: the true optimum is the best design WITHIN the feasible region, not the absolute mathematical maximum.',
      codeIntro: 'Search for the optimal wing design for Leonardo\'s hilltop glider — maximum range subject to structural and practical constraints.',
      code: `import numpy as np

def evaluate_design(span, chord, camber, thickness, pilot_mass=75, launch_height=300):
    """Evaluate glider design: performance and constraint check."""
    area, ar = span * chord, span**2 / (span * chord)
    frame_mass = 5 + 0.4 * span**2.5 + 2 * area * thickness
    total_mass = frame_mass + pilot_mass
    weight = total_mass * 9.81

    cd0 = 0.015 + 0.005 * thickness + 0.002 * span / chord
    oswald_e = 0.85
    cl_max = 0.9 + 8 * camber + 0.1 * thickness * 10
    cl_best = np.sqrt(cd0 * np.pi * ar * oswald_e)
    ld_max = cl_best / (2 * cd0)
    v_stall = np.sqrt(2 * weight / (1.225 * area * cl_max))
    v_bg = np.sqrt(2 * weight / (1.225 * area * cl_best))
    glide_range = launch_height * ld_max

    # Structural check: wooden spar (poplar, yield ~40 MPa)
    root_moment = weight * span / (3 * np.pi)
    r_min = (4 * root_moment / (np.pi * 40e6))**(1/3)
    spar_mm = 2 * r_min * 1000

    feasible, violations = True, []
    if span > 15: feasible = False; violations.append("span>15m")
    if v_stall > 12: feasible = False; violations.append(f"v_stall={v_stall:.1f}>12")
    if spar_mm > 80: feasible = False; violations.append(f"spar={spar_mm:.0f}mm>80")
    if frame_mass > 60: feasible = False; violations.append(f"frame={frame_mass:.0f}kg>60")

    details = {"span": span, "chord": chord, "camber": camber, "thickness": thickness,
        "area": area, "ar": ar, "frame_mass": frame_mass, "total_mass": total_mass,
        "ld_max": ld_max, "v_stall": v_stall, "v_bg": v_bg,
        "sink_rate": v_bg / ld_max, "range": glide_range, "spar_mm": spar_mm,
        "violations": violations}
    return glide_range, feasible, details

# Grid search
best_range = 0
best_design = None
all_results = []
feasible_count = 0

for span in np.arange(6, 15.5, 0.5):
    for chord in np.arange(0.8, 2.5, 0.2):
        for camber in [0.02, 0.03, 0.04, 0.05, 0.06]:
            for thickness in [0.06, 0.08, 0.10, 0.12, 0.15]:
                rng, ok, det = evaluate_design(span, chord, camber, thickness)
                all_results.append(det)
                if ok:
                    feasible_count += 1
                    if rng > best_range:
                        best_range = rng
                        best_design = det

print("=== Wing Design Optimisation ===")
print(f"Searched {len(all_results):,} combinations")
print(f"Feasible designs: {feasible_count} ({feasible_count/len(all_results)*100:.1f}%)\\n")

if best_design:
    d = best_design
    print("OPTIMAL DESIGN:")
    print(f"  Span: {d['span']:.1f} m | Chord: {d['chord']:.1f} m | Area: {d['area']:.1f} m²")
    print(f"  Camber: {d['camber']*100:.0f}% | Thickness: {d['thickness']*100:.0f}%")
    print(f"  Aspect ratio: {d['ar']:.1f}")
    print(f"  Frame mass: {d['frame_mass']:.1f} kg | Total: {d['total_mass']:.1f} kg")
    print(f"  L/D max: {d['ld_max']:.1f}:1")
    print(f"  Stall speed: {d['v_stall']:.1f} m/s")
    print(f"  Best glide: {d['v_bg']:.1f} m/s | Sink: {d['sink_rate']:.2f} m/s")
    print(f"  Spar diameter: {d['spar_mm']:.0f} mm")
    print(f"  RANGE from 300m: {d['range']:.0f} m")

# Compare to Leonardo's actual design
print("\\n=== Comparison: Leonardo vs Optimal ===")
_, _, leo = evaluate_design(8, 1.5, 0.05, 0.08)
print(f"{'Metric':<20} {'Leonardo':>10} {'Optimal':>10} {'Improvement':>12}")
print("-" * 54)
for key, label in [("span", "Span (m)"), ("ar", "Aspect ratio"),
                    ("total_mass", "Mass (kg)"), ("ld_max", "L/D max"),
                    ("v_stall", "V_stall (m/s)"), ("range", "Range (m)")]:
    l_val = leo[key]
    o_val = best_design[key]
    pct = (o_val - l_val) / l_val * 100 if l_val != 0 else 0
    print(f"{label:<20} {l_val:>9.1f} {o_val:>9.1f} {pct:>+10.0f}%")`,
      challenge: 'Add a headwind of 3 m/s to the range calculation (effective groundspeed = airspeed - headwind). How does the optimal design change? In a headwind, you should fly faster than best-glide speed to minimise time exposed to the headwind. Recalculate the optimal speed in a 3 m/s headwind — this is the "speed to fly" problem that glider pilots solve in real time.',
      successHint: 'You optimised an aircraft design — the same process used at Boeing and Airbus. Grid search is the simplest method; real tools use gradient descent and genetic algorithms. The principle is identical: evaluate, compare, select the best feasible design.',
    },
    {
      title: 'Portfolio documentation — the complete Flight Simulator report',
      concept: `The final step is **documentation** — a professional report covering: introduction, architecture, physics models, results, optimisation, historical context, and limitations. This transforms code into a **portfolio piece**.

📚 *In aerospace, the design review report determines whether a project proceeds. A brilliant analysis in a poor report will be rejected — communication is as important as computation.*`,
      analogy: 'A chef who invents a brilliant recipe but can\'t write it down clearly will never open a restaurant. Documentation is the recipe book for your engineering work — it lets others understand, verify, reproduce, and build on your analysis. Leonardo\'s notebooks ARE his legacy — without them, his engineering work would be forgotten.',
      storyConnection: 'Leonardo\'s Codex on the Flight of Birds is the first aerospace engineering report — observations, hypotheses, and designs in systematic detail, still studied five centuries later. Your report follows the same tradition.',
      checkQuestion: 'A limitation of the simulator is that it doesn\'t model turbulence. Why is this worth documenting?',
      checkAnswer: 'Because turbulence could change the results. If the optimal wing is fragile and turbulence causes 3g loads, the optimal design might not be the safest design. By documenting this limitation, you tell the reader: "These results assume calm air. In turbulent conditions, structural margins should be increased." An informed reader can adjust their decisions accordingly.',
      codeIntro: 'Generate the complete Flight Simulator portfolio report — summarising architecture, results, and insights.',
      code: `import numpy as np

print("""
================================================================
        LEONARDO'S FLIGHT SIMULATOR — Portfolio Report
================================================================

1. INTRODUCTION: Evaluates Leonardo's flying machines (c. 1485-1505)
   using modern aerodynamics. Could his machines have flown?

2. ARCHITECTURE: Atmosphere (ISA density), Wing (Cl, Cd, Cl_max),
   Aircraft (weight, forces, performance). Key methods:
   calculate_forces(), glide_analysis(), evaluate_design()

3. PHYSICS: Cl = 2*pi*(alpha - alpha_0), Cd = Cd0 + Cl^2/(pi*AR*e),
   Range = height * L/D_max, M_root = W*b/(3*pi)

4. KEY FINDINGS:
""")

# Quick recalculation for the report
designs = {
    "Leonardo Ornithopter (1485)": (8, 1.5, 0.05, 0.08),
    "Leonardo Glider (1505)":      (12, 1.5, 0.04, 0.10),
    "Optimised (this study)":      (14.0, 1.0, 0.04, 0.08),
}

for name, (sp, ch, ca, th) in designs.items():
    area = sp * ch
    ar = sp**2 / area
    frame_mass = 5 + 0.4 * sp**2.5 + 2 * area * th
    total = frame_mass + 75
    cd0 = 0.015 + 0.005 * th + 0.002 * sp / ch
    cl_best = np.sqrt(cd0 * np.pi * ar * 0.85)
    ld = cl_best / (2 * cd0)
    v_stall = np.sqrt(2 * total * 9.81 / (1.225 * area * (0.9 + 8*ca + th)))
    rng = 300 * ld
    print(f"  {name}:")
    print(f"    Span={sp}m  Area={area:.0f}m²  AR={ar:.1f}  Mass={total:.0f}kg")
    print(f"    L/D={ld:.1f}  V_stall={v_stall:.1f}m/s  Range={rng:.0f}m")
    print()

print("""5. CONCLUSIONS:
  a) Ornithopter CANNOT fly — power deficit ~800 W
  b) 1505 glider COULD glide from hilltop (L/D 5-7, range 1500-2100 m)
  c) Optimised glider achieves L/D 10-12 with Leonardo's materials
  d) Critical missing elements: STABILITY and CONTROL, not aerodynamics

6. LIMITATIONS: Inviscid flow, no turbulence, simplified structure,
   empirical mass model, no lateral stability, hard stall cap

7. FUTURE: Viscous corrections, 6-DOF dynamics, aeroelasticity,
   thermal lift, Monte Ceceri wind data

8. SKILLS DEMONSTRATED:""")

skills = [
    ("Object-oriented design", "Python classes, encapsulation, interfaces"),
    ("Aerodynamics", "Thin airfoil theory, drag polar, panel methods"),
    ("Flight mechanics", "Glide analysis, power curves, stability margins"),
    ("Structural analysis", "Bending moments, spar sizing, material limits"),
    ("Numerical optimisation", "Grid search, constrained optimisation"),
    ("Biomechanics", "Wing loading scaling, square-cube law, bird comparison"),
    ("Technical communication", "Design reports, limitation analysis"),
]

for skill, detail in skills:
    print(f"  * {skill}: {detail}")

print("\\n" + "=" * 64)
print("  Leonardo da Vinci, Codex on the Flight of Birds, 1505:")
print('  "Once you have tasted flight, you will forever walk the')
print('   earth with your eyes turned skyward."')
print("=" * 64)`,
      challenge: 'Add a section to the report comparing your simulator\'s predictions to the actual performance of the Gossamer Albatross (L/D = 30, range = 35 km, speed = 5.5 m/s, mass = 100 kg). How close does your model get? The discrepancy reveals which simplifications matter most. This is the process of model validation — comparing predictions to real data and understanding the gaps.',
      successHint: 'You\'ve completed a full aerospace engineering project: sketches through theory, computation, optimisation, and documentation. This is the workflow at NASA and SpaceX — same process, more sophisticated tools. You now have a portfolio project bridging 500 years of flight engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Flight Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Flight Simulator for Leonardo's flying machines.
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
