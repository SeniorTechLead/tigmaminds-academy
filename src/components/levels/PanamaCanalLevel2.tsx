import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PanamaCanalLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Torricelli\'s law advanced — non-steady flow as head decreases',
      concept: `In Level 1 you met Torricelli's law: v = sqrt(2gh). That assumes the water level (head h) stays constant. But when filling a lock, the head **decreases** as water rises on the low side — the driving pressure drops over time, so flow slows down.

The differential equation for non-steady draining is:

**A_lock × dh/dt = -C_d × A_culvert × sqrt(2g × h(t))**

Where A_lock is the lock chamber area, A_culvert is the culvert opening area, C_d is the discharge coefficient (~0.6), and h(t) is the instantaneous head difference. Solving this ODE gives h(t) — the head as a function of time — and from that, the fill time.

The key insight: the last 10% of filling takes disproportionately long because the driving head is small. This is why lock engineers oversize culverts — to keep fill times under 8 minutes even as flow slows.

📚 *This is a first-order nonlinear ODE. The sqrt(h) term makes it nonlinear — you can't solve it by simple multiplication. Numerical methods (Euler's method) handle it easily.*`,
      analogy: 'Imagine pouring water from a jug into a glass. At first the jug is full and water pours fast. As the jug empties, the stream weakens. The "head" (water height in the jug) drives the flow, and as it drops, the flow rate drops with it. Filling a canal lock follows the same physics — the head difference shrinks as the lock fills.',
      storyConnection: 'The Panama Canal\'s original Gatun Locks use 20 culverts per chamber, each 5.5 m in diameter, to fill a lock in about 8 minutes. The engineers at the Isthmian Canal Commission calculated the non-steady flow to ensure the massive 33.5 m wide chambers filled fast enough to keep ship traffic moving — every extra minute of fill time meant fewer ships per day.',
      checkQuestion: 'If the initial head difference is 9.14 m (one Gatun lock lift) and the lock is 304.8 m long by 33.5 m wide, why does the flow rate at the end of filling approach zero?',
      checkAnswer: 'As the water level in the lock rises toward the upstream level, h(t) approaches zero. Since flow rate depends on sqrt(h), it approaches sqrt(0) = 0. The last metre of filling is dramatically slower than the first metre. This is why the actual fill takes ~8 minutes even though a naive constant-flow calculation would predict ~5 minutes.',
      codeIntro: 'Simulate non-steady lock filling using Euler\'s method to solve the Torricelli ODE.',
      code: `import numpy as np

def simulate_lock_filling(lock_length, lock_width, head_initial,
                          n_culverts, culvert_diameter, cd=0.6, dt=0.5):
    """
    Simulate lock filling with decreasing head using Euler's method.
    Returns time array, head array, flow rate array.
    """
    A_lock = lock_length * lock_width  # lock chamber area (m²)
    A_culvert = n_culverts * np.pi * (culvert_diameter / 2)**2  # total culvert area
    g = 9.81

    times, heads, flows = [0], [head_initial], [0]
    h = head_initial
    t = 0

    while h > 0.01:  # stop when head < 1 cm
        Q = cd * A_culvert * np.sqrt(2 * g * h)  # flow rate (m³/s)
        dh = -Q * dt / A_lock  # head change in lock
        h = max(h + dh, 0)
        t += dt
        times.append(t)
        heads.append(h)
        flows.append(Q)

    return np.array(times), np.array(heads), np.array(flows)

# Panama Canal Gatun Lock parameters
lock_length = 304.8   # m (1000 ft)
lock_width = 33.5     # m (110 ft)
head_lift = 9.14      # m (30 ft) per lock step
n_culverts = 20
culvert_diam = 5.5    # m (18 ft)

times, heads, flows = simulate_lock_filling(
    lock_length, lock_width, head_lift, n_culverts, culvert_diam)

print("=== Non-Steady Lock Filling Simulation ===")
print(f"Lock: {lock_length}m x {lock_width}m | Head: {head_lift}m")
print(f"Culverts: {n_culverts} x {culvert_diam}m diameter\\\n")

print(f"{'Time (s)':>9} {'Head (m)':>9} {'Flow (m³/s)':>12} {'% Filled':>10}")
print("-" * 42)

total_volume = lock_length * lock_width * head_lift
for i in range(0, len(times), max(1, len(times) // 12)):
    pct = (1 - heads[i] / head_lift) * 100
    print(f"{times[i]:>8.1f} {heads[i]:>8.2f} {flows[i]:>10.0f} {pct:>9.1f}%")

fill_time = times[-1]
print(f"\\\nTotal fill time: {fill_time:.0f} seconds ({fill_time/60:.1f} minutes)")
print(f"Volume moved: {total_volume:,.0f} m³ ({total_volume/1000:.0f} megalitres)")

# Compare: first half vs second half fill time
half_idx = np.argmin(np.abs(heads - head_lift / 2))
print(f"\\\nTime to fill first 50%: {times[half_idx]:.0f}s")
print(f"Time to fill last 50%: {fill_time - times[half_idx]:.0f}s")
print("The last half takes longer — the sqrt(h) slowdown in action.")`,
      challenge: 'The new Neopanamax locks (2016) are 427 m long, 55 m wide, with a 9.0 m lift but use water-saving basins that recycle 60% of lock water. Modify the simulation to model this: only 40% of the head is filled from the lake, the rest from side basins at lower pressure. How does this change the fill profile?',
      successHint: 'You just solved a nonlinear ODE numerically — the same technique used in weather forecasting, orbital mechanics, and circuit simulation. The key insight: when the driving force depends on the state (head depends on how full the lock is), you need step-by-step integration, not a simple formula.',
    },
    {
      title: 'Bernoulli\'s equation — flow through culverts with varying cross-sections',
      concept: `**Bernoulli's equation** relates pressure, velocity, and elevation along a streamline:

**P + 0.5 × rho × v² + rho × g × h = constant**

When water flows from the lake through a culvert into the lock, it accelerates as the cross-section narrows (continuity: A₁v₁ = A₂v₂) and pressure drops (Bernoulli). At the culvert exit, velocity is high and pressure is low.

This matters for lock design because:
- High velocity at culvert exits creates **turbulence** that can damage ship hulls
- Low pressure zones can cause **cavitation** — water vapourises and implodes, eroding concrete
- Energy losses from friction and turbulence reduce the effective flow rate

The Panama Canal culverts are designed with gradual contractions and diffusers to manage velocity and prevent cavitation — pure Bernoulli engineering.

📚 *Cavitation occurs when local pressure drops below the water's vapour pressure. Tiny bubbles form and collapse violently, sending shockwaves that pit and erode even hardened steel. It's the enemy of every hydraulic engineer.*`,
      analogy: 'Put your thumb over a garden hose. The opening gets smaller, so the water speeds up (continuity). The fast-moving water has lower pressure (Bernoulli). If you squeeze hard enough, the stream breaks into a spray — that\'s the threshold where cavitation would begin in a culvert.',
      storyConnection: 'The original Panama Canal culverts use a network of lateral tunnels that distribute water across the lock floor through 100+ holes. This diffuser design keeps exit velocities below 2.5 m/s — slow enough to avoid battering ships. The Bernoulli equation told the engineers exactly how large to make each hole to hit that velocity target.',
      checkQuestion: 'Water flows at 1 m/s through a 5 m diameter culvert that narrows to 3 m diameter. What is the velocity in the narrow section?',
      checkAnswer: 'Continuity: A₁v₁ = A₂v₂. A₁ = pi × 2.5² = 19.63 m². A₂ = pi × 1.5² = 7.07 m². v₂ = v₁ × A₁/A₂ = 1 × 19.63/7.07 = 2.78 m/s. The velocity nearly triples when the diameter is reduced by 40%. This is why constrictions are dangerous — small changes in geometry cause large velocity increases.',
      codeIntro: 'Model flow through a culvert system with varying cross-sections using Bernoulli\'s equation.',
      code: `import numpy as np

def bernoulli_flow(head_m, sections, rho=1000, g=9.81):
    """
    Calculate velocity and pressure at each section of a culvert.
    sections: list of (name, diameter_m, length_m, friction_factor)
    """
    results = []
    total_energy = rho * g * head_m  # initial energy (pressure head)

    for name, diam, length, f in sections:
        area = np.pi * (diam / 2)**2
        # Velocity from continuity (first section sets reference)
        if not results:
            v = np.sqrt(2 * g * head_m * 0.8)  # 80% efficiency
        else:
            v = results[0]["flow_rate"] / area

        flow_rate = v * area

        # Bernoulli: P + 0.5*rho*v² = constant (along streamline)
        dynamic_pressure = 0.5 * rho * v**2
        static_pressure = total_energy - dynamic_pressure

        # Friction loss (Darcy-Weisbach)
        friction_loss = f * (length / diam) * dynamic_pressure
        total_energy -= friction_loss

        # Cavitation check
        vapour_pressure = 2340  # Pa at 20°C
        cavitation_risk = static_pressure < vapour_pressure * 3  # safety margin

        results.append({
            "name": name, "diameter": diam, "velocity": v,
            "flow_rate": flow_rate, "static_P": static_pressure,
            "dynamic_P": dynamic_pressure, "friction_loss": friction_loss,
            "cavitation": cavitation_risk
        })

    return results

# Gatun Lock culvert system
head = 9.14  # m head difference
sections = [
    ("Main culvert",     5.5, 30.0, 0.015),
    ("Branch tunnel",    3.0, 15.0, 0.018),
    ("Floor diffuser",   1.2,  5.0, 0.020),
    ("Exit port",        0.6,  1.0, 0.025),
]

results = bernoulli_flow(head, sections)

print("=== Bernoulli Analysis: Gatun Lock Culvert System ===")
print(f"Driving head: {head} m\\\n")
print(f"{'Section':<18} {'Diam':>5} {'Vel':>7} {'Static P':>10} {'Dyn P':>8} {'Cavit?':>7}")
print(f"{'':18} {'(m)':>5} {'(m/s)':>7} {'(kPa)':>10} {'(kPa)':>8}")
print("-" * 57)

for r in results:
    cav = "RISK!" if r["cavitation"] else "OK"
    print(f"{r['name']:<18} {r['diameter']:>4.1f} {r['velocity']:>6.1f} "
          f"{r['static_P']/1000:>9.1f} {r['dynamic_P']/1000:>7.1f} {cav:>7}")

print(f"\\\nTotal flow rate: {results[0]['flow_rate']:,.0f} m³/s per culvert line")
print(f"Exit velocity: {results[-1]['velocity']:.1f} m/s", end="")
print(f" ({'SAFE' if results[-1]['velocity'] < 3 else 'TOO HIGH'} — limit is 2.5 m/s)")

# Energy budget
total_friction = sum(r["friction_loss"] for r in results)
print(f"\\\nEnergy budget:")
print(f"  Available head energy: {head * 1000 * 9.81 / 1000:.1f} kJ/m³")
print(f"  Lost to friction: {total_friction / 1000:.1f} kJ/m³")
print(f"  Hydraulic efficiency: {(1 - total_friction / (head * 1000 * 9.81)) * 100:.0f}%")`,
      challenge: 'The Neopanamax locks use a different culvert geometry with larger floor ports to reduce exit velocity. Redesign the sections array with 1.8 m exit ports instead of 0.6 m. How does this change the exit velocity and cavitation risk? What is the trade-off? (Larger ports mean more holes in the lock floor, which is structurally weaker.)',
      successHint: 'Bernoulli\'s equation is the foundation of fluid mechanics — used to design aircraft wings (lift), carburettors (fuel-air mixing), Venturi meters (flow measurement), and every hydraulic system on Earth. You applied it to one of the largest hydraulic structures ever built.',
    },
    {
      title: 'Vector disease modelling — SIR model with mosquito lifecycle',
      concept: `Building the Panama Canal killed over 25,000 workers — most from **malaria** and **yellow fever**, both transmitted by mosquitoes. Understanding disease spread required modelling both the human population and the **vector** (mosquito) lifecycle.

The **SIR model** divides the human population into Susceptible (S), Infected (I), and Recovered (R). Adding a mosquito vector creates a coupled system:

**Humans:** dS/dt = -beta × S × I_m,  dI/dt = beta × S × I_m - gamma × I
**Mosquitoes:** eggs → larvae → adults (with temperature-dependent development)
Infected mosquitoes (I_m) bite susceptible humans; infected humans infect biting mosquitoes.

The **basic reproduction number** R₀ measures how many new infections one case causes. If R₀ > 1, the disease spreads. If R₀ < 1, it dies out. William Gorgas reduced R₀ below 1 by draining standing water (killing larvae) and screening buildings.

📚 *A vector-borne disease requires a "bridge" species to transmit between humans. Breaking any link in the chain — killing vectors, preventing bites, treating the infected — can stop the epidemic.*`,
      analogy: 'Imagine a fire spreading through a forest. Trees are "susceptible," burning trees are "infected," and burnt-out stumps are "recovered." Mosquitoes are like wind carrying embers — they don\'t burn themselves, but they spread fire to new trees. Gorgas fought the epidemic by eliminating the "wind" (mosquitoes), not by fireproofing every tree.',
      storyConnection: 'The French attempt under de Lesseps (1881-1889) failed largely because of disease — they didn\'t understand mosquito transmission. When the Americans took over in 1904, Colonel William Gorgas spent the first two years on mosquito control: draining swamps, oiling standing water, installing screens. Only after malaria rates dropped 90% could construction proceed safely.',
      checkQuestion: 'If each infected person infects 3 others (R₀ = 3) and the mosquito population is cut by 80%, what happens to R₀?',
      checkAnswer: 'R₀ depends on mosquito density. Cut mosquitoes by 80% and R₀ drops to roughly 3 × 0.2 = 0.6. Since 0.6 < 1, the epidemic dies out. This is exactly what Gorgas achieved — he didn\'t need to eliminate every mosquito, just enough to push R₀ below 1.',
      codeIntro: 'Simulate a malaria outbreak coupled with mosquito lifecycle dynamics.',
      code: `import numpy as np

def simulate_vector_sir(N_human, N_mosquito_init, days, params):
    """
    SIR model with mosquito vector lifecycle.
    Mosquitoes: eggs -> larvae -> adults (temperature dependent).
    """
    beta_hm = params["beta_hm"]     # human-to-mosquito transmission
    beta_mh = params["beta_mh"]     # mosquito-to-human transmission
    gamma = params["gamma"]         # human recovery rate
    bite_rate = params["bite_rate"] # bites per mosquito per day
    egg_rate = params["egg_rate"]   # eggs per adult per day
    larva_dev = params["larva_dev"] # days to develop from egg to adult
    adult_life = params["adult_life"]  # adult mosquito lifespan (days)
    larva_mortality = params["larva_mortality"]  # daily larva death rate

    S, I, R = N_human - 10, 10, 0  # start with 10 infected
    M_adult = N_mosquito_init
    M_infected = int(N_mosquito_init * 0.05)
    M_larvae = N_mosquito_init * 2
    M_eggs = N_mosquito_init * 3

    history = []
    dt = 1  # daily steps

    for day in range(days):
        # Mosquito lifecycle
        new_adults = M_eggs / larva_dev * (1 - larva_mortality)
        new_eggs = M_adult * egg_rate
        adult_deaths = M_adult / adult_life

        M_eggs = max(0, M_eggs + new_eggs - M_eggs / larva_dev)
        M_larvae = max(0, M_larvae + M_eggs / larva_dev - new_adults)
        M_adult = max(0, M_adult + new_adults - adult_deaths)

        # Disease transmission
        bites = bite_rate * M_adult * dt
        new_human_infections = min(S, beta_mh * bites * M_infected / max(M_adult, 1) * S / N_human)
        new_mosquito_infections = beta_hm * bites * I / N_human

        S = max(0, S - new_human_infections)
        I = max(0, I + new_human_infections - gamma * I)
        R = N_human - S - I
        M_infected = min(M_adult, max(0, M_infected + new_mosquito_infections - M_infected / adult_life))

        history.append({"day": day, "S": S, "I": I, "R": R,
                        "M_adult": M_adult, "M_inf": M_infected})

    return history

N_workers = 40000  # canal workforce
N_mosquitoes = 200000

params = {
    "beta_hm": 0.3, "beta_mh": 0.2, "gamma": 1/14,
    "bite_rate": 0.5, "egg_rate": 10, "larva_dev": 12,
    "adult_life": 30, "larva_mortality": 0.1
}

# Scenario 1: No mosquito control (French era)
print("=== Malaria Outbreak Simulation ===")
print(f"Workers: {N_workers:,} | Initial mosquitoes: {N_mosquitoes:,}\\\n")

history = simulate_vector_sir(N_workers, N_mosquitoes, 180, params)

print("--- No Mosquito Control (French Era) ---")
print(f"{'Day':>5} {'Susceptible':>12} {'Infected':>10} {'Recovered':>10} {'Mosquitoes':>11}")
print("-" * 50)
for h in history[::30]:
    print(f"{h['day']:>5} {h['S']:>11.0f} {h['I']:>9.0f} {h['R']:>9.0f} {h['M_adult']:>10.0f}")

peak = max(history, key=lambda h: h["I"])
print(f"\\\nPeak infection: Day {peak['day']}, {peak['I']:.0f} workers sick simultaneously")

# Scenario 2: Gorgas mosquito control
params_gorgas = {**params, "larva_mortality": 0.7, "egg_rate": 3}
history2 = simulate_vector_sir(N_workers, N_mosquitoes, 180, params_gorgas)

print("\\\n--- With Gorgas Mosquito Control (American Era) ---")
for h in history2[::30]:
    print(f"{h['day']:>5} {h['S']:>11.0f} {h['I']:>9.0f} {h['R']:>9.0f} {h['M_adult']:>10.0f}")

peak2 = max(history2, key=lambda h: h["I"])
print(f"\\\nPeak infection: Day {peak2['day']}, {peak2['I']:.0f} workers sick")
print(f"Reduction: {(1 - peak2['I']/peak['I'])*100:.0f}% fewer cases at peak")`,
      challenge: 'Add a "screening" intervention: after day 30, infected workers are detected and isolated (removed from the susceptible-infected cycle) at a rate of 50% per day. How does combining screening with mosquito control compare to mosquito control alone? This models modern integrated disease management.',
      successHint: 'You just built an epidemiological model — the same framework used to predict COVID-19 spread, design vaccination campaigns, and allocate medical resources. The SIR model with vector dynamics is specifically how malaria, dengue, and Zika are modelled by the WHO and CDC.',
    },
    {
      title: 'Excavation optimisation — minimising dig volume for the Culebra Cut',
      concept: `The **Culebra Cut** (now Gaillard Cut) was the most challenging section of the Panama Canal — a 12.6 km channel carved through the Continental Divide at an elevation of 95 m. The question: what **cross-sectional profile** minimises total excavation while maintaining a safe channel?

A wider cut is safer (less slope = fewer landslides) but requires moving more rock. A narrower cut moves less rock but has steeper slopes that are prone to collapse. The terrain varies along the length — some sections are hard basalt (steep cuts OK), others are soft clay (gentle slopes required).

This is a **constrained optimisation problem**: minimise total excavation volume subject to:
- Minimum channel width of 91.5 m (300 ft) at water level
- Maximum slope angle depends on rock type
- Channel depth of 12.8 m (42 ft) below water surface

📚 *The Culebra Cut required removing 76 million cubic metres of rock — more than the entire Suez Canal. Landslides added another 50 million m³ of re-excavation. Getting the slope angle right was literally a matter of life and death.*`,
      analogy: 'Imagine digging a swimming pool in a hillside. You could dig straight down (minimum volume but the walls collapse) or dig at a gentle angle (stable walls but enormous volume). The optimal angle depends on the soil — sandy soil needs gentle slopes, rock can be cut steep. Now scale that up to a 12.6 km trench through a mountain.',
      storyConnection: 'Chief Engineer John Stevens and later George Goethals wrestled with the Culebra Cut for a decade. Landslides in soft Cucaracha Formation clay kept widening the cut beyond design limits. The final solution: different slope angles for different rock types, drainage galleries to reduce pore water pressure, and accepting a wider cut in clay zones.',
      checkQuestion: 'If reducing the slope angle from 45 degrees to 30 degrees doubles the excavation volume but eliminates landslide risk, is it worth it?',
      checkAnswer: 'Yes — a landslide in the Culebra Cut buried equipment, killed workers, and required re-excavating the same material (sometimes multiple times). The total cost of landslides far exceeded the cost of a gentler initial slope. Prevention is cheaper than repair — a fundamental engineering principle.',
      codeIntro: 'Optimise the Culebra Cut cross-section for minimum excavation volume given terrain constraints.',
      code: `import numpy as np

def excavation_volume(channel_width, depth, slope_angle_deg, length_m):
    """
    Calculate excavation volume for a trapezoidal channel cross-section.
    Returns volume in cubic metres.
    """
    slope_rad = np.radians(slope_angle_deg)
    # Top width = channel width + 2 * depth / tan(slope angle)
    side_width = depth / np.tan(slope_rad)
    top_width = channel_width + 2 * side_width
    # Trapezoidal area
    area = 0.5 * (channel_width + top_width) * depth
    return area * length_m, top_width

# Culebra Cut terrain segments
segments = [
    {"name": "Gold Hill (basalt)",     "length": 2000, "max_slope": 70, "terrain_elev": 95},
    {"name": "Contractor's Hill",      "length": 2500, "max_slope": 55, "terrain_elev": 80},
    {"name": "Cucaracha clay zone",    "length": 3000, "max_slope": 25, "terrain_elev": 75},
    {"name": "Mixed rock/clay",        "length": 2600, "max_slope": 40, "terrain_elev": 70},
    {"name": "Pacific approach",       "length": 2500, "max_slope": 50, "terrain_elev": 50},
]

channel_width = 91.5   # m minimum at water level
water_depth = 12.8     # m below water surface
water_level = 26.0     # m (Gatun Lake level)

print("=== Culebra Cut Excavation Optimisation ===")
print(f"Channel width: {channel_width}m | Water depth: {water_depth}m\\\n")

total_volume = 0
print(f"{'Segment':<24} {'Length':>7} {'Slope':>6} {'Cut Depth':>10} {'Volume':>12} {'Top Width':>10}")
print("-" * 71)

for seg in segments:
    cut_depth = seg["terrain_elev"] - water_level + water_depth
    vol, top_w = excavation_volume(channel_width, cut_depth, seg["max_slope"], seg["length"])
    total_volume += vol
    print(f"{seg['name']:<24} {seg['length']:>5}m {seg['max_slope']:>4}° "
          f"{cut_depth:>8.1f}m {vol/1e6:>10.1f}M m³ {top_w:>8.1f}m")

print(f"\\\nTotal excavation: {total_volume/1e6:,.1f} million m³")

# Optimise: find minimum volume slope angles that avoid landslides
print("\\\n=== Slope Optimisation ===")
print("Testing slope angles to minimise volume while maintaining stability:\\\n")

for seg in segments:
    cut_depth = seg["terrain_elev"] - water_level + water_depth
    best_angle = seg["max_slope"]
    best_vol = float('inf')

    # Safety factor: slope angle must be <= max_slope - 10° margin
    safe_max = seg["max_slope"]

    for angle in range(20, safe_max + 1):
        vol, _ = excavation_volume(channel_width, cut_depth, angle, seg["length"])
        if vol < best_vol:
            best_vol = vol
            best_angle = angle

    conservative_vol, _ = excavation_volume(channel_width, cut_depth, safe_max - 15, seg["length"])
    steep_vol, _ = excavation_volume(channel_width, cut_depth, safe_max, seg["length"])

    savings = (conservative_vol - steep_vol) / 1e6
    print(f"{seg['name']:<24} Steep ({safe_max}°): {steep_vol/1e6:.1f}M m³  "
          f"Conservative ({safe_max-15}°): {conservative_vol/1e6:.1f}M m³  "
          f"Diff: {savings:.1f}M m³")`,
      challenge: 'The Cucaracha clay zone experienced repeated landslides. Model this: if slope > 30 degrees in clay, there is a 40% chance per year of a landslide that adds 20% re-excavation. Over 10 years of construction, what is the EXPECTED total excavation including landslide costs? At what slope angle does the expected cost of landslides exceed the savings from a steeper cut?',
      successHint: 'You optimised one of the largest earthmoving operations in history. The same constrained optimisation framework applies to open-pit mining, highway design, dam construction, and any project where you must balance excavation volume against slope stability.',
    },
    {
      title: 'Ship stress in locks — forces from asymmetric water flow',
      concept: `When a lock fills, water enters from culverts in the floor and walls. This inflow is not perfectly symmetric — one side may fill faster than the other, creating a **lateral force** on the ship. If the ship is large relative to the lock (Neopanamax ships fill 93% of the lock width), even small asymmetries create significant forces.

The forces on the ship include:
- **Hydrostatic force**: pressure difference across the hull from uneven water levels
- **Hydrodynamic force**: momentum of the incoming water pushing the ship sideways
- **Mooring line tension**: the lines holding the ship must resist both forces

If mooring forces exceed the line strength, lines snap. If the ship touches the lock wall, both ship and lock are damaged — causing weeks of repair and millions in lost revenue.

📚 *A Neopanamax container ship weighs 120,000 tonnes. Even moving it 1 metre sideways in a lock requires enormous force. The challenge is that water forces are invisible — you can't see the asymmetry until the ship lurches.*`,
      analogy: 'Fill a bathtub with a toy boat in it while pouring water from one side. The boat drifts toward the opposite side — the incoming flow pushes it. Now imagine the "bathtub" is 427 m long, the "toy" weighs 120,000 tonnes, and the gap between boat and wall is 3.5 m. That is the Neopanamax lock challenge.',
      storyConnection: 'The original Gatun Locks were designed for ships up to 294 m long and 32.3 m wide — with comfortable clearance. Modern Neopanamax ships are 366 m long and 51.25 m wide in locks only 55 m wide — just 1.87 m clearance on each side. The margin for error from asymmetric filling forces is almost zero.',
      checkQuestion: 'If the water level is 0.3 m higher on the port side of a ship than the starboard side, and the ship has a draft of 12 m and length of 300 m, what is the net lateral hydrostatic force?',
      checkAnswer: 'Force = rho × g × delta_h × draft × length = 1000 × 9.81 × 0.3 × 12 × 300 = 10,594,800 N = about 10.6 MN (1,080 tonnes-force). A 30 cm water level difference creates over a thousand tonnes of lateral force — enough to snap mooring lines if they\'re not designed for it.',
      codeIntro: 'Calculate forces on a ship during asymmetric lock filling.',
      code: `import numpy as np

def ship_forces_in_lock(ship_length, ship_beam, ship_draft, ship_mass,
                        lock_width, head_asymmetry, flow_velocity):
    """
    Calculate forces on a ship during lock filling with asymmetric flow.
    """
    rho = 1000  # water density (kg/m³)
    g = 9.81
    gap_each_side = (lock_width - ship_beam) / 2

    # Hydrostatic force from water level asymmetry
    F_hydrostatic = rho * g * head_asymmetry * ship_draft * ship_length

    # Hydrodynamic force from flow momentum
    # Flow hitting the hull side: F = 0.5 * rho * Cd * A * v²
    Cd = 1.2  # drag coefficient for flat plate
    wetted_area = ship_draft * ship_length
    F_hydrodynamic = 0.5 * rho * Cd * wetted_area * flow_velocity**2

    # Total lateral force
    F_total = F_hydrostatic + F_hydrodynamic

    # Mooring line analysis (assume 6 lines per side)
    n_lines = 6
    line_force = F_total / n_lines
    line_capacity = 800000  # N (800 kN per line — typical)
    safety_factor = line_capacity / line_force

    return {
        "F_hydrostatic": F_hydrostatic,
        "F_hydrodynamic": F_hydrodynamic,
        "F_total": F_total,
        "line_force": line_force,
        "safety_factor": safety_factor,
        "gap": gap_each_side
    }

# Panamax ship in original lock
print("=== Ship Forces During Lock Filling ===\\\n")

ships = [
    ("Panamax vessel",    250, 32.2, 12.0, 65000e3, 33.5),
    ("Neopanamax vessel", 366, 51.2, 15.2, 120000e3, 55.0),
]

asymmetries = [0.05, 0.10, 0.20, 0.30, 0.50]  # metres

for ship_name, length, beam, draft, mass, lock_w in ships:
    print(f"--- {ship_name} in {lock_w}m lock ---")
    print(f"Ship: {length}m x {beam}m, draft {draft}m")
    print(f"Lock clearance: {(lock_w - beam)/2:.2f}m each side\\\n")

    print(f"{'Asymm (m)':>10} {'F_static':>10} {'F_dynamic':>10} {'F_total':>10} "
          f"{'Per line':>10} {'Safety':>7}")
    print(f"{'':>10} {'(kN)':>10} {'(kN)':>10} {'(kN)':>10} {'(kN)':>10}")
    print("-" * 59)

    for asym in asymmetries:
        flow_v = 0.5 + asym * 2  # higher asymmetry = higher local velocity
        r = ship_forces_in_lock(length, beam, draft, mass, lock_w, asym, flow_v)
        sf_str = f"{r['safety_factor']:.1f}x"
        if r['safety_factor'] < 1.5:
            sf_str += " !"
        print(f"{asym:>9.2f} {r['F_hydrostatic']/1000:>9.0f} "
              f"{r['F_hydrodynamic']/1000:>9.0f} {r['F_total']/1000:>9.0f} "
              f"{r['line_force']/1000:>9.0f} {sf_str:>7}")
    print()

print("Key insight: Neopanamax ships have LESS clearance and MORE force")
print("(larger draft and length). The safety margin is razor-thin.")
print("This is why Neopanamax lock filling is precisely computer-controlled.")`,
      challenge: 'Add a time dimension: as the lock fills, the flow velocity changes (high at start, low at end per Torricelli). Calculate the maximum lateral force during the fill cycle and the time at which it occurs. Is the peak force at the beginning of filling (maximum flow) or somewhere in the middle?',
      successHint: 'You analysed forces on a ship in a canal lock — the same naval architecture calculations used to design mooring systems for supertankers, offshore platforms, and floating bridges. The key skill: converting pressure differences and flow velocities into structural forces, then checking whether the restraint system can handle them.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Deeper physics and engineering analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into non-steady flow, Bernoulli analysis, disease modelling, excavation optimisation, and ship forces.
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
