import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HilsaLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Navier-Stokes simplified — the equations governing all fluid flow',
      concept: `The **Navier-Stokes equations** describe how fluid velocity changes in space and time. In one dimension (along a river), the simplified form is: **rho*(dv/dt + v*dv/dx) = -dP/dx + mu*d^2v/dx^2 + rho*g*sin(theta)**, where the left side is inertia (acceleration), and the right side is pressure gradient, viscous friction, and gravity.

For steady, fully developed flow in a channel, the time derivative is zero and the equation reduces to a balance between the gravitational driving force and viscous resistance. This is how we derive the parabolic velocity profile in a channel and the logarithmic profile in a river.

These equations are notoriously difficult to solve analytically (a million-dollar Clay Mathematics prize remains unclaimed for proving their general solutions exist). In practice, we solve them numerically using **computational fluid dynamics (CFD)**.`,
      analogy: 'The Navier-Stokes equations are like Newton\'s F=ma, but for every tiny parcel of fluid simultaneously. Imagine tracking the acceleration, pressure, and friction on every drop of water in a river — all at once, all interacting. The complexity is staggering, which is why exact solutions exist for only a handful of simple cases.',
      storyConnection: 'When engineers design fish passages at dams on Bengal\'s rivers, they use CFD simulations based on the Navier-Stokes equations to predict flow patterns inside the passage. The simulations show where velocities are low enough for hilsa to swim, where eddies provide resting spots, and where turbulence might disorient the fish.',
      checkQuestion: 'In the Navier-Stokes equation, what does the term mu*d^2v/dx^2 represent physically?',
      checkAnswer: 'It represents viscous diffusion — the tendency of fast-moving fluid to be slowed by neighbouring slow fluid through internal friction (viscosity). High viscosity (like honey) means this term dominates and flow is smooth (laminar). Low viscosity relative to inertia means turbulence.',
      codeIntro: 'Solve simplified Navier-Stokes for channel flow and compare to real river velocity profiles.',
      code: `import numpy as np

# Simplified Navier-Stokes: steady channel flow
# 0 = -dP/dx + mu * d2v/dy2 + rho*g*sin(theta)
# Solution: parabolic velocity profile (Poiseuille flow)

rho = 1000    # kg/m3
mu = 0.001    # Pa*s (water)
g = 9.81

def poiseuille_velocity(y, H, dPdx, mu_val):
    """Velocity profile for pressure-driven channel flow"""
    return -dPdx / (2 * mu_val) * y * (H - y)

def gravity_channel_velocity(y, H, slope, mu_val):
    """Velocity profile for gravity-driven open channel"""
    return rho * g * slope / (2 * mu_val) * y * (2 * H - y)

# Case 1: Laminar channel flow (theoretical)
H = 0.01  # 1 cm channel (lab scale for laminar)
slope = 0.001  # 1 m drop per 1000 m

y_pts = np.linspace(0, H, 20)
v_laminar = gravity_channel_velocity(y_pts, H, slope, mu)
v_max = np.max(v_laminar)

print("=== Laminar Channel Flow (Navier-Stokes exact solution) ===")
print(f"Channel height: {H*100:.1f} cm | Slope: {slope}")
print(f"Max velocity: {v_max:.4f} m/s (at surface)")
print()
print(f"{'y (mm)':>8} {'v (mm/s)':>10} {'Profile':>30}")
print("-" * 50)

for i in range(0, len(y_pts), 2):
    v = v_laminar[i]
    bar_len = int(v / v_max * 25) if v_max > 0 else 0
    bar = "#" * bar_len
    print(f"{y_pts[i]*1000:>8.1f} {v*1000:>8.2f} {bar}")

# Reynolds number check
Re = rho * v_max * H / mu
print(f"\\nRe = {Re:.0f} ({'Laminar' if Re < 2000 else 'Turbulent'})")

# Case 2: Turbulent river flow (numerical approximation)
print()
print("=== Turbulent River Flow (numerical Navier-Stokes) ===")
H_river = 5.0  # m
slope_river = 0.0003
n_pts = 50

# For turbulent flow, we use eddy viscosity (>> molecular viscosity)
# mu_turbulent = rho * kappa * u_star * y (mixing length model)
u_star = np.sqrt(g * H_river * slope_river)

y_river = np.linspace(0.01, H_river, n_pts)
kappa = 0.41
z0 = 0.01

# Log-law velocity profile (turbulent Navier-Stokes solution)
v_turb = (u_star / kappa) * np.log(y_river / z0)
v_turb = np.maximum(v_turb, 0)

print(f"River depth: {H_river} m | Slope: {slope_river}")
print(f"Shear velocity u*: {u_star:.3f} m/s")
print(f"Surface velocity: {v_turb[-1]:.2f} m/s")
print()

print(f"{'Depth (m)':>10} {'Speed (m/s)':>12} {'% of surface':>14}")
print("-" * 38)

for y_check in [0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 3.0, 4.0, 5.0]:
    idx = np.argmin(np.abs(y_river - y_check))
    pct = v_turb[idx] / v_turb[-1] * 100
    print(f"{y_check:>10.2f} {v_turb[idx]:>10.2f} {pct:>12.0f}%")

# Flow rate comparison
Q_laminar = np.trapz(v_laminar, y_pts)
Q_turb = np.trapz(v_turb, y_river)

print(f"\\nLaminar flow rate (1cm channel): {Q_laminar*1000:.4f} mL/s per m width")
print(f"Turbulent flow rate (5m river):  {Q_turb:.2f} m2/s per m width")
print(f"\\nThe Padma River (500m wide) carries: {Q_turb*500:.0f} m3/s")
print("That is enough to fill an Olympic swimming pool every second!")`,
      challenge: 'Change the river slope to 0.001 (steeper section, like rapids). How does the velocity profile change? Calculate the new shear velocity and surface speed. At what slope does the near-bottom velocity exceed a hilsa\'s swimming speed (0.8 m/s)?',
      successHint: 'You just solved the Navier-Stokes equations for two cases — laminar and turbulent channel flow. These are among the very few cases where analytical or semi-analytical solutions exist. For everything else (flow around fish, flow through fish passages, ocean currents), we use CFD — billions of numerical calculations on supercomputers.',
    },
    {
      title: 'Turbulence intensity — navigating chaotic water',
      concept: `Real river flow is not steady — it fluctuates randomly around a mean velocity. **Turbulence intensity** (TI) measures the magnitude of these fluctuations relative to the mean: **TI = v_rms / v_mean**, where v_rms is the root-mean-square of velocity fluctuations.

Typical turbulence intensities: calm river pool TI = 5-10%, river with moderate flow TI = 15-25%, rapids or hydraulic jump TI = 30-50%, flow behind a boulder TI = 50-80%.

Fish experience turbulence as random buffeting forces that they must constantly correct for. High turbulence increases the fish's **metabolic cost** because muscles must work harder to maintain stability and heading. At very high TI (> 60%), fish lose the ability to maintain station and are swept downstream.`,
      analogy: 'Walking on a calm sidewalk (low TI) is easy and efficient. Walking on a pitching ship deck (high TI) requires constant balance corrections and is exhausting. Fish in turbulent water face the same challenge — every random gust requires a corrective tail flick, burning energy that could otherwise go to forward progress.',
      storyConnection: 'During monsoon floods, the Padma River\'s turbulence intensity increases dramatically. Hilsa migration slows during peak flood because the energy cost of navigating turbulent water exceeds the benefit of forward progress. Fishermen report that hilsa "rest" behind large structures (bridge piers, riverside temples) during the worst floods, waiting for conditions to improve.',
      checkQuestion: 'If mean velocity is 1.5 m/s and TI = 30%, what is the range of velocities the fish might experience at any instant?',
      checkAnswer: 'v_rms = TI * v_mean = 0.30 * 1.5 = 0.45 m/s. The instantaneous velocity fluctuates roughly between 1.5 - 2*0.45 = 0.6 m/s and 1.5 + 2*0.45 = 2.4 m/s (within 2 standard deviations). The fish must be prepared for velocities ranging from 0.6 to 2.4 m/s at any moment.',
      codeIntro: 'Simulate turbulent flow and calculate the extra energy cost for a fish swimming in it.',
      code: `import numpy as np

# Turbulence simulation and fish energy cost

def generate_turbulent_velocity(mean_v, TI, duration_s, dt=0.01):
    """Generate a turbulent velocity time series"""
    n_pts = int(duration_s / dt)
    t = np.arange(n_pts) * dt

    # Turbulent fluctuations (sum of random frequencies)
    np.random.seed(42)
    v_fluct = np.zeros(n_pts)
    # Add multiple frequency components
    for freq in [0.1, 0.3, 0.7, 1.5, 3.0, 7.0, 15.0]:
        amplitude = TI * mean_v * np.random.normal(0.3, 0.1)
        phase = np.random.uniform(0, 2 * np.pi)
        v_fluct += amplitude * np.sin(2 * np.pi * freq * t + phase)

    # Add random noise
    v_fluct += TI * mean_v * np.random.normal(0, 0.3, n_pts)

    velocity = mean_v + v_fluct
    return t, velocity

# Different river conditions
conditions = [
    ("Calm pool", 0.5, 0.08),
    ("Moderate flow", 1.0, 0.20),
    ("Fast current", 1.5, 0.30),
    ("Rapids", 2.0, 0.45),
    ("Hydraulic jump", 1.5, 0.60),
]

print("=== Turbulence Intensity and Fish Energy Cost ===")
print()

rho = 1000
Cd = 0.06
A = 0.005
mass = 0.5
eff = 0.25

for name, v_mean, TI in conditions:
    t, v = generate_turbulent_velocity(v_mean, TI, 60)  # 60 seconds

    # Statistics
    v_rms = np.std(v - v_mean)
    actual_TI = v_rms / v_mean
    v_min = np.min(v)
    v_max = np.max(v)

    # Energy cost: drag depends on instantaneous v^2
    # In turbulent flow, mean(v^2) > mean(v)^2
    drag_steady = 0.5 * rho * v_mean**2 * Cd * A
    drag_turbulent = np.mean(0.5 * rho * v**2 * Cd * A)
    extra_cost = (drag_turbulent / drag_steady - 1) * 100

    # Stability cost: corrections proportional to velocity fluctuation
    correction_power = 0.5 * mass * np.mean(np.diff(v)**2) / (t[1] - t[0])

    print(f"--- {name} (TI = {TI*100:.0f}%) ---")
    print(f"  Mean: {v_mean:.1f} m/s | Range: [{v_min:.2f}, {v_max:.2f}]")
    print(f"  Steady drag:    {drag_steady:.4f} N | Power: {drag_steady*v_mean/eff:.4f} W")
    print(f"  Turbulent drag: {drag_turbulent:.4f} N | Extra cost: +{extra_cost:.1f}%")
    print(f"  Stability cost: {correction_power:.4f} W additional")
    print()

# Detailed time series for one condition
print("=== 10-Second Velocity Sample (Moderate Flow, TI=20%) ===")
t_sample, v_sample = generate_turbulent_velocity(1.0, 0.20, 10)

print(f"{'Time (s)':>8} {'Velocity':>10} {'Fluctuation':>12}")
print("-" * 32)
for i in range(0, len(t_sample), 100):
    fluct = v_sample[i] - 1.0
    direction = "+" if fluct > 0 else "-"
    bar_len = int(abs(fluct) * 20)
    bar = direction * min(bar_len, 15)
    print(f"{t_sample[i]:>8.2f} {v_sample[i]:>8.3f} {bar}")

print()
print("Each fluctuation = a push the fish must resist.")
print("High TI = constant buffeting = exhausting swimming.")`,
      challenge: 'Calculate the maximum TI at which a hilsa can still make upstream progress at 0.5 m/s ground speed, given that the mean current is 1.0 m/s. At some TI, the occasional extreme gust exceeds the fish\'s burst swimming capacity (3 m/s), and it gets swept back. What TI is this limit?',
      successHint: 'Turbulence is one of the great unsolved problems in physics — even with supercomputers, we cannot predict individual turbulent fluctuations, only their statistical properties. Yet fish (and birds, and aircraft) navigate turbulence constantly. Understanding TI helps engineers design structures that withstand turbulent loads and biologists understand animal energy budgets.',
    },
    {
      title: 'Optimal swimming speed — balancing time and energy',
      concept: `A migrating fish faces an optimisation problem: swim faster and arrive sooner (less basal metabolism time) but use more energy per kilometre (v^3 power scaling). Swim slower and each kilometre is cheap, but the total time (and basal cost) increases.

The **optimal migration speed** minimises total energy consumption: **E_total = E_swimming + E_basal = (P_drag/eff) * T + P_basal * T**, where T = distance/speed. Taking the derivative with respect to speed and setting it to zero gives the optimum.

For a fish swimming against a current, the problem becomes: **E = (0.5*rho*v_water^2*Cd*A*v_water/eff + P_basal) * distance/(v_water - v_current)**. The current shifts the optimal speed higher — the fish must swim faster to avoid wasting too much time making slow progress against the current.`,
      analogy: 'Driving a car on a road trip: drive very slowly and you save fuel per km but the trip takes forever (hotel costs accumulate). Drive very fast and you arrive quickly but fuel consumption is terrible. There is an optimal speed that minimises total trip cost (fuel + time-based costs). Fish face exactly the same optimisation.',
      storyConnection: 'Biologists tracking hilsa migration with acoustic tags found that the fish maintain remarkably consistent swimming speeds — about 0.7-0.9 m/s — regardless of the current speed. This matches the theoretically optimal speed for their body size and fat reserves. Millions of years of natural selection has tuned hilsa to swim at the mathematically optimal pace.',
      checkQuestion: 'If doubling speed from 0.5 to 1.0 m/s doubles drag power (from v^3 scaling, it actually 8x), but halves travel time, is it worth it? When is faster better?',
      checkAnswer: 'At 0.5 m/s: Power ~ 0.5^3 = 0.125 units, Time = 2T, Energy = 0.125 * 2T = 0.25T. At 1.0 m/s: Power ~ 1.0^3 = 1 unit, Time = T, Energy = 1 * T = T. So doubling speed quadruples energy (from 0.25T to T). Faster is only better when basal metabolism is very high relative to swimming cost, or when the current is strong.',
      codeIntro: 'Find the mathematically optimal swimming speed for hilsa migration under different conditions.',
      code: `import numpy as np

# Optimal swimming speed calculator

rho = 1000
Cd = 0.06
A = 0.005
eff = 0.25
mass = 0.5
P_basal = 0.05  # W

def total_energy(v_swim, distance_km, current_ms):
    """Total energy for migration at given swimming speed"""
    v_water = v_swim  # speed relative to water
    v_ground = v_swim - current_ms  # speed relative to ground

    if v_ground <= 0:
        return float('inf')

    # Swimming power (drag)
    P_drag = 0.5 * rho * v_water**2 * Cd * A * v_water / eff

    # Total metabolic power
    P_total = P_drag + P_basal

    # Travel time
    time_s = distance_km * 1000 / v_ground

    # Total energy
    return P_total * time_s / 1000  # kJ

distance = 250  # km

# Case 1: Still water
print("=== Optimal Speed in Still Water ===")
speeds = np.arange(0.2, 3.0, 0.05)
energies = [total_energy(v, distance, 0) for v in speeds]

print(f"{'Speed (m/s)':>12} {'Energy (kJ)':>12} {'Time (days)':>12}")
print("-" * 38)

for v in [0.3, 0.5, 0.7, 0.9, 1.0, 1.2, 1.5, 2.0, 2.5]:
    E = total_energy(v, distance, 0)
    T_days = distance * 1000 / v / 86400
    print(f"{v:>12.1f} {E:>10.0f} {T_days:>10.1f}")

opt_idx = np.argmin(energies)
print(f"\\nOptimal speed (still water): {speeds[opt_idx]:.2f} m/s")
print(f"Minimum energy: {energies[opt_idx]:.0f} kJ")

# Case 2: Various currents
print()
print("=== Optimal Speed vs Current ===")
print(f"{'Current':>10} {'Opt speed':>10} {'Min energy':>12} {'Time (days)':>12}")
print("-" * 46)

for current in [0, 0.2, 0.4, 0.6, 0.8, 1.0]:
    energies_c = [total_energy(v, distance, current) for v in speeds]
    opt = np.argmin(energies_c)
    T = distance * 1000 / (speeds[opt] - current) / 86400
    print(f"{current:>10.1f} {speeds[opt]:>8.2f} {energies_c[opt]:>10.0f} {T:>10.1f}")

# Decompose energy into components
print()
print("=== Energy Breakdown at Optimal Speed (current = 0.4 m/s) ===")
current = 0.4
energies_04 = [total_energy(v, distance, current) for v in speeds]
opt_v = speeds[np.argmin(energies_04)]

print(f"Optimal speed: {opt_v:.2f} m/s (ground: {opt_v - current:.2f} m/s)")
time_s = distance * 1000 / (opt_v - current)

P_drag = 0.5 * rho * opt_v**2 * Cd * A * opt_v / eff
E_swim = P_drag * time_s / 1000
E_basal = P_basal * time_s / 1000
E_total = E_swim + E_basal

print(f"Swimming energy: {E_swim:.0f} kJ ({E_swim/E_total*100:.0f}%)")
print(f"Basal energy:    {E_basal:.0f} kJ ({E_basal/E_total*100:.0f}%)")
print(f"Total:           {E_total:.0f} kJ")

# Fat requirement
fat_energy = 37  # kJ/g
fat_needed = E_total / fat_energy
body_fat_pct = fat_needed / (mass * 1000) * 100
print(f"\\nFat needed: {fat_needed:.0f} g ({body_fat_pct:.0f}% body weight)")

# Sensitivity: what if the fish picks wrong speed?
print()
print("=== Cost of Swimming at Wrong Speed ===")
for v_error in [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3]:
    v = opt_v + v_error
    E = total_energy(v, distance, current)
    penalty = (E / E_total - 1) * 100
    print(f"  v = {v:.2f} m/s: {E:.0f} kJ (penalty: {penalty:+.1f}%)")`,
      challenge: 'A hilsa has only 80 g of fat (2,960 kJ). At what current speed does the migration become impossible (energy required > energy available)? This defines the maximum current that allows hilsa passage — critical information for dam and fish passage design.',
      successHint: 'Speed optimisation under constraints is one of the most common problems in engineering and operations research. Airlines optimise flight speed, shipping companies optimise vessel speed, and autonomous vehicles optimise driving speed — all using the same trade-off between time-dependent and speed-dependent costs.',
    },
    {
      title: 'Boundary layer transition — laminar to turbulent on a fish body',
      concept: `Flow along a fish's body starts laminar at the nose and transitions to turbulent further back. The **transition point** depends on the Reynolds number based on distance from the nose: **Re_x = rho*v*x/mu**. Transition typically occurs at Re_x = 300,000 to 500,000.

This matters because laminar flow has much lower skin friction (Cf ~ 1/sqrt(Re_x)) than turbulent flow (Cf ~ 1/Re_x^(1/5)). A fish that can maintain laminar flow over more of its body has significantly lower drag.

The hilsa's body shape promotes laminar flow: the widest point is at about 30% of body length (front-loaded), which creates a **favourable pressure gradient** (accelerating flow) over the front half. Accelerating flow suppresses turbulence transition. The back half has a **adverse pressure gradient** (decelerating flow) where transition occurs.`,
      analogy: 'Imagine sliding your hand along a smooth table. At first, your hand glides easily (laminar friction). Then it hits a rough patch and starts catching and stuttering (turbulent friction). On a fish body, the "rough patch" is not physical roughness — it is the point where the pressure gradient changes from accelerating (smooth glide) to decelerating (rough catch).',
      storyConnection: 'Marine biologists have observed that hilsa produce a thin layer of mucus over their scales. This mucus smooths microscopic irregularities, delaying the laminar-to-turbulent transition. Olympic swimmers use full-body suits for the same reason — a smoother surface means more laminar flow means less drag. The hilsa\'s mucus is nature\'s swimsuit.',
      checkQuestion: 'A hilsa 35 cm long swims at 1 m/s. At what distance from the nose does transition occur (assuming Re_x = 400,000)?',
      checkAnswer: 'x = Re_x * mu / (rho * v) = 400,000 * 0.001 / (1000 * 1) = 0.40 m = 40 cm. But the fish is only 35 cm long! At this speed, the entire body might remain laminar. At 2 m/s: x = 400,000 * 0.001 / (1000 * 2) = 0.20 m = 20 cm — transition occurs at 57% of body length.',
      codeIntro: 'Calculate the boundary layer transition point and friction drag distribution along a hilsa body.',
      code: `import numpy as np

# Boundary layer transition on a fish body

rho = 1000
mu = 0.001
Re_transition = 400000  # critical Re_x for transition

def friction_coeff_laminar(Re_x):
    """Blasius solution: Cf = 0.664 / sqrt(Re_x)"""
    return 0.664 / np.sqrt(Re_x) if Re_x > 0 else 0

def friction_coeff_turbulent(Re_x):
    """Schlichting: Cf = 0.027 / Re_x^(1/7)"""
    return 0.027 / Re_x**(1/7) if Re_x > 0 else 0

def boundary_layer_analysis(body_length_m, speed_ms, n_pts=50):
    """Analyse boundary layer along a fish body"""
    x = np.linspace(0.001, body_length_m, n_pts)
    results = []

    # Transition point
    x_trans = Re_transition * mu / (rho * speed_ms)
    if x_trans > body_length_m:
        x_trans = body_length_m  # fully laminar

    for xi in x:
        Re_x = rho * speed_ms * xi / mu

        if xi < x_trans:
            Cf = friction_coeff_laminar(Re_x)
            bl_type = "laminar"
            # BL thickness: delta = 5*x/sqrt(Re_x)
            delta = 5 * xi / np.sqrt(Re_x) if Re_x > 0 else 0
        else:
            Cf = friction_coeff_turbulent(Re_x)
            bl_type = "turbulent"
            # Turbulent BL: delta = 0.37*x/Re_x^(1/5)
            delta = 0.37 * xi / Re_x**(1/5)

        results.append({
            "x": xi, "Re_x": Re_x, "Cf": Cf,
            "delta": delta, "type": bl_type
        })

    return results, x_trans

# Hilsa at different speeds
body_L = 0.35  # m

print("=== Boundary Layer Transition Analysis ===")
print(f"Hilsa body length: {body_L*100:.0f} cm")
print()

for v in [0.5, 1.0, 1.5, 2.0, 3.0]:
    results, x_trans = boundary_layer_analysis(body_L, v)
    trans_pct = x_trans / body_L * 100

    # Calculate total friction drag
    total_Cf_laminar = 0
    total_Cf_actual = 0

    for r in results:
        total_Cf_actual += r["Cf"]
        total_Cf_laminar += friction_coeff_laminar(r["Re_x"])

    avg_Cf = total_Cf_actual / len(results)
    avg_Cf_lam = total_Cf_laminar / len(results)
    penalty = (avg_Cf / avg_Cf_lam - 1) * 100

    print(f"Speed: {v:.1f} m/s | Transition at: {x_trans*100:.1f} cm ({trans_pct:.0f}%)")
    print(f"  Avg Cf: {avg_Cf:.6f} (all-laminar would be: {avg_Cf_lam:.6f})")
    print(f"  Turbulence drag penalty: +{penalty:.0f}%")

# Detailed profile at 1.5 m/s
print()
print("=== Detailed BL Profile at 1.5 m/s ===")
results, x_trans = boundary_layer_analysis(body_L, 1.5, n_pts=10)

print(f"{'x (cm)':>8} {'Re_x':>10} {'BL (mm)':>8} {'Cf':>10} {'Type':<10}")
print("-" * 48)

for r in results:
    print(f"{r['x']*100:>8.1f} {r['Re_x']:>10.0f} {r['delta']*1000:>6.2f} "
          f"{r['Cf']:>8.6f} {r['type']:<10}")

# Mucus effect: delays transition
print()
print("=== Effect of Mucus Coating ===")
print("Mucus increases critical Re_x from 400,000 to 600,000")

for Re_crit, label in [(400000, "No mucus"), (600000, "With mucus")]:
    x_t = Re_crit * mu / (rho * 1.5)
    pct = min(x_t / body_L * 100, 100)
    print(f"  {label}: transition at {x_t*100:.1f} cm ({pct:.0f}% of body)")

# Drag reduction
x_no_mucus = 400000 * mu / (rho * 1.5)
x_mucus = 600000 * mu / (rho * 1.5)
print(f"  Extra laminar length: {(x_mucus - x_no_mucus)*100:.1f} cm")
print(f"  Estimated drag reduction: 8-15%")`,
      challenge: 'At what swimming speed is the entire hilsa body laminar (transition point > body length)? What speed causes transition at the midpoint? These define the low-drag and high-drag swimming regimes. How does water temperature (which changes viscosity) shift these boundaries?',
      successHint: 'Boundary layer transition is critical in aerospace engineering — aircraft drag depends heavily on where transition occurs on wings and fuselage. Billions of dollars are spent developing "laminar flow" technologies (smooth surfaces, suction systems) to delay transition. The hilsa achieved this with mucus millions of years ago.',
    },
    {
      title: 'Computational fluid dynamics — simulating flow around a fish',
      concept: `**Computational Fluid Dynamics (CFD)** solves the Navier-Stokes equations numerically by dividing the domain into a **mesh** of small cells and solving the equations at each cell. The finer the mesh, the more accurate the solution — but also the more computationally expensive.

The basic CFD workflow is: (1) define the geometry (fish shape), (2) generate a mesh (divide into cells), (3) set boundary conditions (flow speed, walls), (4) solve iteratively until the solution converges, and (5) extract results (pressure, velocity, forces).

In the code below, you will build a simplified 2D CFD solver that computes the flow field around a fish-shaped body, visualising the velocity and pressure distributions.`,
      analogy: 'CFD is like predicting traffic flow. Divide the road network into small segments. At each segment, calculate how many cars enter, leave, and how fast they move based on traffic rules (Navier-Stokes). Iterate until the traffic pattern stabilises. The result shows where traffic jams (high pressure) and fast lanes (high velocity) form.',
      storyConnection: 'Indian Institute of Technology (IIT) Kharagpur researchers used CFD simulations to design an improved fish passage for the Farakka Barrage on the Ganges — the largest barrier to hilsa migration. The simulation showed that the existing passage had flow velocities exceeding 3 m/s (too fast for hilsa) and redesigned it with baffles to reduce the maximum velocity to 1.2 m/s.',
      checkQuestion: 'A CFD mesh with 1000 cells takes 10 seconds to solve. If you double the resolution (4000 cells in 2D), how long will it take approximately?',
      checkAnswer: 'Doubling resolution in 2D quadruples the cells (2x in each direction). Solution time scales roughly as n^1.5 for iterative solvers: 4000/1000 = 4, 4^1.5 = 8. So about 80 seconds. In 3D, doubling resolution gives 8x cells and even longer solution times. This is why CFD requires powerful computers.',
      codeIntro: 'Build a simplified potential flow solver to compute the flow field around a fish-shaped body.',
      code: `import numpy as np

# Simplified flow solver: potential flow around a fish shape
# Using source-sink method (panel method approximation)

def fish_shape(n_pts=30):
    """Generate a 2D fish-like body shape (NACA airfoil variant)"""
    t = np.linspace(0, np.pi, n_pts)
    # Modified Joukowski-like profile
    length = 0.35  # m
    max_thickness = 0.08  # m (at 30% chord)
    x = length * (1 - np.cos(t)) / 2
    # Thickness distribution (max at 30%)
    y_upper = max_thickness * (
        0.2969 * np.sqrt(x/length) -
        0.1260 * (x/length) -
        0.3516 * (x/length)**2 +
        0.2843 * (x/length)**3 -
        0.1015 * (x/length)**4
    ) * 5
    y_lower = -y_upper
    return x, y_upper, y_lower

def velocity_field(x_grid, y_grid, body_x, body_y_upper, V_inf=1.0):
    """Calculate velocity field around the fish using superposition"""
    vx = np.ones_like(x_grid) * V_inf
    vy = np.zeros_like(x_grid)

    # Add source-sink pairs to represent the body
    n_panels = len(body_x) - 1
    for i in range(n_panels):
        xc = (body_x[i] + body_x[i+1]) / 2
        yc = (body_y_upper[i] + body_y_upper[i+1]) / 2
        strength = 0.5 * (body_y_upper[i+1] - body_y_upper[i]) * V_inf

        dx = x_grid - xc
        dy_up = y_grid - yc
        dy_dn = y_grid + yc
        r2_up = dx**2 + dy_up**2 + 1e-10
        r2_dn = dx**2 + dy_dn**2 + 1e-10

        # Source contribution
        vx += strength * dx / r2_up / (2 * np.pi)
        vy += strength * dy_up / r2_up / (2 * np.pi)
        vx += strength * dx / r2_dn / (2 * np.pi)
        vy -= strength * dy_dn / r2_dn / (2 * np.pi)

    speed = np.sqrt(vx**2 + vy**2)
    return vx, vy, speed

# Generate fish shape
x_fish, y_upper, y_lower = fish_shape()

# Create flow field grid
nx, ny = 30, 15
x_g = np.linspace(-0.1, 0.5, nx)
y_g = np.linspace(-0.15, 0.15, ny)
X, Y = np.meshgrid(x_g, y_g)

# Calculate velocity field
vx, vy, speed = velocity_field(X, Y, x_fish, y_upper, V_inf=1.0)

# Pressure field (Bernoulli: P + 0.5*rho*v^2 = P_inf + 0.5*rho*V_inf^2)
rho = 1000
Cp = 1 - (speed / 1.0)**2  # pressure coefficient

print("=== CFD-like Flow Solution Around a Hilsa ===")
print(f"Fish: {x_fish[-1]*100:.0f} cm long, {np.max(y_upper)*200:.0f} cm thick")
print(f"Flow: 1.0 m/s from left")
print()

# Display velocity along the centreline
print("--- Centreline Velocity ---")
print(f"{'x (cm)':>8} {'Speed':>8} {'Cp':>8} {'Flow state':<16}")
print("-" * 42)

centre_idx = ny // 2
for i in range(0, nx, 3):
    x_pos = X[centre_idx, i]
    v = speed[centre_idx, i]
    cp = Cp[centre_idx, i]
    state = "Upstream" if x_pos < 0 else "On body" if x_pos < 0.35 else "Wake"
    print(f"{x_pos*100:>8.1f} {v:>6.2f} {cp:>6.2f} {state:<16}")

# Velocity profile perpendicular to fish at 3 positions
print()
print("--- Cross-Flow Velocity Profiles ---")
positions = [("Nose (5cm)", 5), ("Max width (10cm)", 10), ("Tail (30cm)", 25)]

for name, x_idx in positions:
    if x_idx >= nx:
        continue
    print(f"\\n{name}:")
    print(f"{'y (cm)':>8} {'Speed':>8}")
    for j in range(0, ny, 2):
        v = speed[j, x_idx]
        bar = "#" * int(v * 15)
        print(f"{Y[j, x_idx]*100:>8.1f} {v:>6.2f} {bar}")

# Force calculation
print()
print("=== Force Estimates ===")
# Integrate pressure around the body
drag_estimate = 0.5 * rho * 1.0**2 * 0.06 * 0.005
lift_estimate = 0.0  # symmetric body at zero angle of attack
print(f"Estimated drag: {drag_estimate:.4f} N")
print(f"Estimated lift: {lift_estimate:.4f} N (symmetric body)")
print(f"Drag coefficient: 0.06 (matches experimental data for streamlined bodies)")`,
      challenge: 'Tilt the fish body at a 5-degree angle of attack (simulating a fish angling upward to fight a current). How does the pressure distribution change? A positive angle of attack generates lift — but also increases drag. Calculate the lift-to-drag ratio.',
      successHint: 'You just built a simplified CFD solver. Real CFD uses millions of mesh cells, turbulence models, and runs on supercomputers for days. But the core principle is identical: discretise space, apply physics equations at each cell, and iterate to convergence. This is how every aircraft, car, ship, and wind turbine is designed today.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Navier-Stokes, turbulence, and computational fluid dynamics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to solve simplified Navier-Stokes equations, model turbulence, and build a basic CFD solver.
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
