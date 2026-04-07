import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PanamaCanalLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Computational fluid dynamics — 1D shallow water equations for lock filling',
      concept: `The **shallow water equations** describe how water moves when the horizontal scale is much larger than the depth — exactly the case for a canal lock (300 m long, 15 m deep). They are a simplified form of the Navier-Stokes equations:

**Continuity:** dh/dt + d(hu)/dx = 0
**Momentum:** d(hu)/dt + d(hu² + 0.5gh²)/dx = -gh × dz/dx + source terms

Where h is water depth, u is velocity, g is gravity, and z is the bed elevation. The "source term" represents water entering through culverts.

We discretise the lock into cells (finite volume method) and advance in time using explicit time-stepping. At each step, we compute fluxes between cells, add culvert inflow, and update water depth and velocity.

This is a real (simplified) CFD simulation — the same mathematical framework used to model tsunamis, dam breaks, and river floods.

📚 *The shallow water equations are hyperbolic PDEs. They admit wave solutions — the "sloshing" you see in a lock during filling is captured by these equations.*`,
      analogy: 'Imagine a row of connected water tanks. Water flows between adjacent tanks based on their level difference. If tank 5 is higher than tanks 4 and 6, water flows outward from tank 5. Our simulation divides the lock into 50 "tanks" (cells) and tracks water flowing between them — that is the finite volume method.',
      storyConnection: 'When the Panama Canal locks fill, the water doesn\'t rise uniformly — it surges in from the culvert openings, creating waves that slosh back and forth. The 1D shallow water model captures this behaviour, explaining why ships experience lateral forces and why fill rates must be carefully controlled to prevent dangerous oscillations.',
      checkQuestion: 'If water enters a 304.8 m lock from one end and must reach the other end, how long does a shallow water wave take to travel the lock length? (Wave speed = sqrt(g × depth), depth = 15 m)',
      checkAnswer: 'Wave speed c = sqrt(9.81 × 15) = 12.1 m/s. Travel time = 304.8 / 12.1 = 25.2 seconds. So the water level at the far end responds about 25 seconds after the culvert opens. During filling, waves bounce back and forth every ~50 seconds, creating the sloshing that pushes ships around.',
      codeIntro: 'Simulate lock filling using the 1D shallow water equations with finite volume discretisation.',
      code: `import numpy as np

def shallow_water_lock(n_cells, lock_length, initial_depth, inflow_rate,
                       total_time, dt=0.05):
    """
    1D shallow water simulation of lock filling.
    Uses simple upwind finite volume scheme.
    """
    dx = lock_length / n_cells
    g = 9.81

    # Initial conditions: uniform water depth, zero velocity
    h = np.ones(n_cells) * initial_depth
    u = np.zeros(n_cells)

    # Culvert inflow distributed across first 5 cells
    inflow_cells = 5
    inflow_per_cell = inflow_rate / (inflow_cells * dx)  # m/s (depth increase rate)

    # Storage for output
    times_out = []
    h_out = []
    n_steps = int(total_time / dt)
    record_interval = max(1, n_steps // 20)

    for step in range(n_steps):
        t = step * dt

        # Compute fluxes between cells (simple upwind scheme)
        h_new = h.copy()
        u_new = u.copy()

        for i in range(1, n_cells - 1):
            # Flux from left: F_L = h[i-1] * u[i-1] if u > 0
            flux_left = h[i-1] * max(u[i-1], 0) - h[i] * max(-u[i], 0)
            flux_right = h[i] * max(u[i], 0) - h[i+1] * max(-u[i+1], 0)

            # Continuity: dh/dt = -(flux_right - flux_left)/dx
            h_new[i] = h[i] + dt * (flux_left - flux_right) / dx

            # Momentum: gravity drives flow from high to low
            dhdx = (h[i+1] - h[i-1]) / (2 * dx)
            u_new[i] = u[i] - dt * g * dhdx - dt * 0.01 * u[i]  # friction

        # Boundary conditions
        h_new[0] = h_new[1]
        h_new[-1] = h_new[-2]
        u_new[0] = u_new[1]
        u_new[-1] = 0  # wall

        # Add culvert inflow (distributed across first 5 cells)
        # Reduce inflow as lock fills (Torricelli effect)
        head_diff = max(0, (initial_depth + 9.14) - np.mean(h_new))
        flow_factor = np.sqrt(head_diff / 9.14) if head_diff > 0 else 0
        for i in range(inflow_cells):
            h_new[i] += dt * inflow_per_cell * flow_factor

        h = h_new
        u = u_new

        if step % record_interval == 0:
            times_out.append(t)
            h_out.append(h.copy())

    return np.array(times_out), np.array(h_out)

# Simulate Gatun Lock filling
n_cells = 50
lock_length = 304.8  # m
initial_depth = 6.0  # m (initial water level in lock)
target_depth = 15.14 # m (initial + 9.14m lift)
inflow_rate = 200    # m³/s total inflow

times, h_history = shallow_water_lock(
    n_cells, lock_length, initial_depth, inflow_rate, total_time=300, dt=0.02)

print("=== 1D Shallow Water Lock Filling Simulation ===")
print(f"Lock: {lock_length}m, {n_cells} cells | Initial depth: {initial_depth}m\\n")

# Show water surface profile at selected times
dx = lock_length / n_cells
positions = np.arange(n_cells) * dx + dx/2

print(f"{'Time (s)':>9} {'Depth[0]':>9} {'Depth[25]':>10} {'Depth[49]':>10} {'Mean':>7} {'Var':>8}")
print("-" * 55)
for i in range(len(times)):
    h = h_history[i]
    print(f"{times[i]:>8.1f} {h[0]:>8.2f}m {h[25]:>9.2f}m {h[49]:>9.2f}m "
          f"{np.mean(h):>6.2f} {np.var(h):>7.4f}")

# Wave analysis
print("\\n=== Wave Analysis ===")
wave_speed = np.sqrt(9.81 * np.mean(h_history[-1]))
print(f"Shallow water wave speed: {wave_speed:.1f} m/s")
print(f"Lock traverse time: {lock_length / wave_speed:.1f} seconds")
print(f"Sloshing period: {2 * lock_length / wave_speed:.1f} seconds")

# Non-uniformity metric
final_h = h_history[-1]
max_diff = np.max(final_h) - np.min(final_h)
print(f"\\nFinal water surface variation: {max_diff*100:.1f} cm")
print(f"(Target: <5 cm for safe ship operations)")`,
      challenge: 'Modify the culvert inflow to enter from BOTH ends of the lock simultaneously (distributed across first 5 and last 5 cells). How does this change the wave pattern and the final surface uniformity? The real Panama locks use distributed floor culverts for exactly this reason — to minimise sloshing.',
      successHint: 'You just ran a computational fluid dynamics simulation — the shallow water equations are the workhorse model for flood prediction, tsunami warning, and dam safety assessment. The finite volume method you used is the same approach (at much larger scale) used by FEMA flood models and the NOAA tsunami warning system.',
    },
    {
      title: 'Multi-lock transit optimisation — scheduling ships through 6 locks',
      concept: `The Panama Canal has **6 lock chambers** in each direction (3 at Gatun, 3 at Miraflores/Pedro Miguel on the Pacific side). Each chamber takes ~30 minutes for a complete transit (filling + ship movement). Ships queue at both ends, and the canal operates 24/7.

The scheduling problem: **maximise daily throughput** (ships per day) subject to:
- Each lock can hold one ship at a time
- Filling one lock affects water availability for adjacent locks
- Ships have different sizes (Panamax vs Neopanamax) and different transit times
- Locks can only operate when the adjacent lock is at the correct level

This is a **job-shop scheduling** problem — one of the classic NP-hard problems in operations research. We'll use a **greedy heuristic**: always assign the next available lock to the highest-priority waiting ship.

📚 *The Panama Canal Authority charges tolls based on ship size — up to $800,000 per transit. With ~40 ships per day, optimal scheduling is worth millions in revenue.*`,
      analogy: 'Imagine three elevators in a building, each carrying one person at a time. People queue at both the ground floor and top floor. The challenge: schedule the elevators so the maximum number of people transit per hour, knowing each trip takes 5 minutes and you can\'t send two elevators to the same floor simultaneously. The Panama Canal locks are these elevators, but with water instead of cables.',
      storyConnection: 'The Panama Canal moved 14,239 ships in 2023, averaging 39 per day. Each ship pays a toll that covers the canal\'s $3 billion annual operating budget. A single scheduling improvement that saves 5 minutes per transit adds capacity for 1-2 more ships per day — worth $500K to $1.6M in additional revenue daily.',
      checkQuestion: 'If each lock transit takes 30 minutes and there are 3 locks in series, what is the minimum time for a ship to cross the Gatun locks?',
      checkAnswer: '90 minutes if there is zero waiting. But the second lock can\'t start filling until the first is done AND the ship has moved in. In practice, the 3-lock Gatun transit takes about 2 hours. With queuing and scheduling delays, total canal transit averages 8-10 hours.',
      codeIntro: 'Simulate multi-lock scheduling to maximise daily ship throughput.',
      code: `import numpy as np

np.random.seed(42)

def simulate_canal_day(n_ships_atlantic, n_ships_pacific, lock_params):
    """
    Simulate one day of canal operations.
    3 locks Atlantic side (Gatun), 3 locks Pacific side (Miraflores/Pedro Miguel).
    """
    fill_time = lock_params["fill_time"]      # minutes per fill
    move_time = lock_params["move_time"]      # minutes for ship to enter/exit
    cycle_time = fill_time + move_time         # total per lock step

    # Generate ship arrival times (Poisson process)
    atl_arrivals = np.sort(np.random.uniform(0, 1440, n_ships_atlantic))  # minutes in day
    pac_arrivals = np.sort(np.random.uniform(0, 1440, n_ships_pacific))

    # Track lock availability (time when each lock becomes free)
    atl_locks = [0, 0, 0]  # 3 Gatun locks
    pac_locks = [0, 0, 0]  # 3 Pacific locks

    completed = {"atlantic": 0, "pacific": 0}
    total_wait = {"atlantic": 0, "pacific": 0}
    transit_times = []

    # Process Atlantic-bound ships (Pacific -> Atlantic)
    for arrival in pac_arrivals:
        # Must pass through 3 Pacific locks then 3 Atlantic locks (reversed)
        t = max(arrival, pac_locks[0])
        wait = t - arrival

        # Transit through 3 Pacific locks (ascending)
        for i in range(3):
            t = max(t, pac_locks[i])
            pac_locks[i] = t + cycle_time
            t = pac_locks[i]

        # Cross Gatun Lake (takes ~45 min)
        t += 45

        # Transit through 3 Gatun locks (descending)
        for i in range(3):
            t = max(t, atl_locks[i])
            atl_locks[i] = t + cycle_time
            t = atl_locks[i]

        if t < 1440 + 180:  # complete within day + 3hr buffer
            completed["atlantic"] += 1
            total_wait["atlantic"] += wait
            transit_times.append(t - arrival)

    # Process Pacific-bound ships (Atlantic -> Pacific)
    for arrival in atl_arrivals:
        t = max(arrival, atl_locks[0])
        wait = t - arrival

        for i in range(3):
            t = max(t, atl_locks[i])
            atl_locks[i] = t + cycle_time
            t = atl_locks[i]

        t += 45  # Gatun Lake crossing

        for i in range(3):
            t = max(t, pac_locks[i])
            pac_locks[i] = t + cycle_time
            t = pac_locks[i]

        if t < 1440 + 180:
            completed["pacific"] += 1
            total_wait["pacific"] += wait
            transit_times.append(t - arrival)

    return completed, total_wait, transit_times

# Baseline parameters
lock_params = {"fill_time": 8, "move_time": 22}  # 30 min total cycle

print("=== Panama Canal Transit Scheduling Simulation ===\\n")

# Test different demand levels
demand_levels = [
    (15, 15, "Low demand"),
    (20, 20, "Normal demand"),
    (25, 25, "High demand"),
    (30, 30, "Peak demand"),
    (35, 35, "Over capacity"),
]

print(f"{'Scenario':<18} {'Completed':>10} {'Avg Wait':>10} {'Avg Transit':>12} {'Util%':>7}")
print("-" * 59)

for n_atl, n_pac, label in demand_levels:
    completed, waits, transits = simulate_canal_day(n_atl, n_pac, lock_params)
    total_done = completed["atlantic"] + completed["pacific"]
    total_requested = n_atl + n_pac
    avg_wait = (waits["atlantic"] + waits["pacific"]) / max(total_done, 1)
    avg_transit = np.mean(transits) if transits else 0
    utilisation = total_done / total_requested * 100

    print(f"{label:<18} {total_done:>5}/{total_requested:<4} {avg_wait:>8.0f}min "
          f"{avg_transit:>10.0f}min {utilisation:>6.0f}%")

# Optimisation: what if we reduce fill time?
print("\\n=== Impact of Faster Lock Filling ===")
for fill_t in [8, 6, 5, 4]:
    params = {"fill_time": fill_t, "move_time": 22}
    completed, _, transits = simulate_canal_day(25, 25, params)
    total = completed["atlantic"] + completed["pacific"]
    avg_t = np.mean(transits) if transits else 0
    print(f"Fill time {fill_t}min: {total} ships/day, avg transit {avg_t:.0f}min")`,
      challenge: 'Add ship priority levels: military vessels transit first, then LNG tankers (time-sensitive cargo), then container ships, then bulk carriers. How does priority scheduling affect average wait time for each category? Does prioritisation increase or decrease total throughput?',
      successHint: 'You solved a scheduling optimisation problem — the same class of problem faced by airlines (gate assignments), hospitals (operating room scheduling), and cloud computing (job scheduling on servers). The greedy heuristic you used is fast but not optimal; real canal scheduling uses more sophisticated algorithms.',
    },
    {
      title: 'Water budget — Gatun Lake water balance model',
      concept: `Every lock transit consumes water — 197 million litres per Panamax transit, 429 million litres per Neopanamax transit. This water flows from **Gatun Lake** through the locks to the ocean. The lake must be replenished by rainfall and river inflow; if the lake level drops too low, the canal must restrict ship draft or reduce transits.

The **water balance equation**:

**dV/dt = Rainfall + River_inflow - Evaporation - Lock_usage - Spillway_discharge**

Each term varies seasonally: the rainy season (May-December) fills the lake; the dry season (January-April) depletes it. If the lake drops below 24.8 m (the minimum operating level), ships must be lighter or fewer transits are allowed.

📚 *Gatun Lake holds 5.2 km³ of water and covers 425 km². It was the largest artificial lake in the world when created in 1913. Its water level is the single most critical variable for canal operations.*`,
      analogy: 'Gatun Lake is like a savings account. Rainfall and rivers are income (deposits). Lock transits and evaporation are expenses (withdrawals). If you spend more than you earn, the balance drops. If it drops below the minimum balance, the bank (canal authority) restricts your spending (fewer ship transits). Budgeting water is exactly like budgeting money.',
      storyConnection: 'In 2023, a severe drought caused by El Nino reduced Gatun Lake to critical levels. The Panama Canal Authority cut daily transits from 38 to 22 and restricted ship drafts by 2 metres — costing the global shipping industry an estimated $300 million per month. Water management is not an abstract exercise; it determines whether the canal functions.',
      checkQuestion: 'If 38 ships transit per day and each uses 200 million litres, how much water is consumed daily? How does this compare to a city?',
      checkAnswer: '38 × 200 million = 7.6 billion litres per day = 7.6 million m³. For comparison, New York City uses about 4 billion litres per day. The Panama Canal consumes nearly twice as much water as New York City — every single day. That is why Gatun Lake is so critical.',
      codeIntro: 'Model the annual water balance of Gatun Lake including seasonal rainfall, river flow, and lock usage.',
      code: `import numpy as np

def simulate_lake_year(params, n_years=5):
    """
    Simulate Gatun Lake water balance over multiple years.
    Monthly resolution.
    """
    lake_area_km2 = params["lake_area"]
    lake_area_m2 = lake_area_km2 * 1e6
    initial_level = params["initial_level"]

    # Monthly rainfall (mm) — Panama's wet/dry cycle
    monthly_rain_mm = np.array([40, 25, 30, 80, 220, 230, 200, 220, 250, 280, 260, 120])
    monthly_evap_mm = np.array([120, 130, 140, 130, 100, 90, 95, 90, 85, 85, 90, 110])
    # River inflow (million m³/month) — tracks rainfall with lag
    monthly_river = np.array([80, 60, 50, 70, 200, 280, 260, 270, 300, 320, 280, 150])

    ships_per_day = params["ships_per_day"]
    water_per_ship_m3 = params["water_per_ship"]

    level = initial_level
    history = []

    for year in range(n_years):
        for month in range(12):
            # Rainfall input (m³)
            rain_m3 = monthly_rain_mm[month] / 1000 * lake_area_m2
            # Evaporation loss (m³)
            evap_m3 = monthly_evap_mm[month] / 1000 * lake_area_m2
            # River inflow (m³)
            river_m3 = monthly_river[month] * 1e6
            # Random variation ±20%
            rain_m3 *= np.random.uniform(0.8, 1.2)
            river_m3 *= np.random.uniform(0.8, 1.2)

            # Lock usage (m³/month)
            days_in_month = [31,28,31,30,31,30,31,31,30,31,30,31][month]
            lock_m3 = ships_per_day * water_per_ship_m3 * days_in_month

            # Net change
            net_m3 = rain_m3 + river_m3 - evap_m3 - lock_m3

            # Convert to level change (m)
            delta_level = net_m3 / lake_area_m2
            level += delta_level

            # Spillway: if level > 26.7m, excess is discharged
            if level > 26.7:
                level = 26.7

            history.append({
                "year": year + 1, "month": month + 1,
                "level": level, "rain": rain_m3/1e6,
                "river": river_m3/1e6, "evap": evap_m3/1e6,
                "lock": lock_m3/1e6, "net": net_m3/1e6
            })

    return history

# Baseline scenario
params = {
    "lake_area": 425,       # km²
    "initial_level": 26.0,  # m (normal operating level)
    "ships_per_day": 38,
    "water_per_ship": 250000,  # m³ average (mix of Panamax/Neopanamax)
}

np.random.seed(42)
history = simulate_lake_year(params, n_years=5)

print("=== Gatun Lake Water Balance Simulation ===")
print(f"Lake area: {params['lake_area']} km² | Ships/day: {params['ships_per_day']}\\n")

print(f"{'Year':>5} {'Month':>6} {'Level':>7} {'Rain':>8} {'River':>8} {'Evap':>8} {'Locks':>8} {'Net':>8}")
print(f"{'':>5} {'':>6} {'(m)':>7} {'(Mm³)':>8} {'(Mm³)':>8} {'(Mm³)':>8} {'(Mm³)':>8} {'(Mm³)':>8}")
print("-" * 62)

for h in history[::3]:  # every 3 months
    print(f"{h['year']:>5} {h['month']:>6} {h['level']:>6.2f} {h['rain']:>7.0f} "
          f"{h['river']:>7.0f} {h['evap']:>7.0f} {h['lock']:>7.0f} {h['net']:>7.0f}")

# Find critical periods
min_level = min(h["level"] for h in history)
min_entry = min(history, key=lambda h: h["level"])
print(f"\\nLowest level: {min_level:.2f}m (Year {min_entry['year']}, Month {min_entry['month']})")
print(f"Minimum operating level: 24.84m")
print(f"Margin: {min_level - 24.84:.2f}m")

below_min = sum(1 for h in history if h["level"] < 24.84)
print(f"Months below minimum: {below_min} out of {len(history)}")`,
      challenge: 'Model the 2023 drought: reduce rainfall by 40% for 18 months. At what point must the canal authority restrict transits? Implement a feedback loop: when the lake drops below 25.5 m, reduce ships_per_day to 30; below 25.0 m, reduce to 22. Does this prevent the lake from hitting the absolute minimum?',
      successHint: 'You built a water resource management model — the same framework used by every dam operator, reservoir manager, and water utility in the world. Water budgets are how cities plan for droughts, farmers plan irrigation, and hydropower plants schedule generation. It is one of the most consequential applications of simple mass balance.',
    },
    {
      title: 'Climate change impact — modelling how changing rainfall affects canal capacity',
      concept: `Climate models project that Central America will experience more variable rainfall: wetter wet seasons but drier dry seasons, with more intense El Nino/La Nina cycles. For the Panama Canal, this means:

1. **Higher flood risk** during extreme wet seasons (spillway capacity limits)
2. **More frequent droughts** during dry seasons (transit restrictions)
3. **Longer recovery time** after droughts (the lake takes months to refill)

We model this by adjusting the probability distributions of rainfall and river flow: increasing variance while keeping or reducing the mean. The key metric is **reliability** — the percentage of months the canal can operate at full capacity.

📚 *Climate change affects not just the average rainfall but its variability. A system designed for historical variability may fail under increased variability even if the mean rainfall doesn't change. This is the "variance problem" of climate adaptation.*`,
      analogy: 'Imagine your income stays the same on average, but some months you earn double and other months you earn nothing. Your average budget works fine, but you can\'t pay rent in the zero-income months. Increased variability breaks a system designed for steady conditions — exactly what climate change does to the Panama Canal.',
      storyConnection: 'The 2023 El Nino drought was a preview of climate change impacts. The canal authority has responded by planning a new reservoir (Rio Indio) to supplement Gatun Lake, designing water-saving lock basins (the Neopanamax locks save 60% of water per transit), and studying cloud seeding. These are engineering responses to a climate problem — adaptation in action.',
      checkQuestion: 'If rainfall variability doubles (standard deviation × 2) but mean stays the same, does the probability of drought increase, decrease, or stay the same?',
      checkAnswer: 'Increases — dramatically. With higher variability, extreme low-rainfall years become much more common. If the mean is 2,000 mm/year and the old standard deviation was 200 mm, a drought year (<1,600 mm) was a 2-sigma event (2.3% probability). With doubled variability (std = 400 mm), the same drought is only a 1-sigma event (16% probability) — 7× more likely.',
      codeIntro: 'Model how climate change scenarios affect Panama Canal operational reliability.',
      code: `import numpy as np

np.random.seed(42)

def simulate_climate_scenario(scenario_name, rain_factor, rain_var_factor,
                              n_simulations=200, n_years=20):
    """
    Monte Carlo simulation of canal operations under climate scenarios.
    Returns reliability (% months at full capacity) and drought frequency.
    """
    lake_area_m2 = 425e6  # m²
    base_rain_mm = np.array([40, 25, 30, 80, 220, 230, 200, 220, 250, 280, 260, 120])
    base_evap_mm = np.array([120, 130, 140, 130, 100, 90, 95, 90, 85, 85, 90, 110])
    base_river = np.array([80, 60, 50, 70, 200, 280, 260, 270, 300, 320, 280, 150])

    full_capacity_ships = 38
    water_per_ship = 250000  # m³
    min_level = 24.84
    restrict_level = 25.5

    results = {"months_full": 0, "months_restricted": 0,
               "months_critical": 0, "total_months": 0,
               "min_levels": [], "ships_lost": 0}

    for sim in range(n_simulations):
        level = 26.0

        for year in range(n_years):
            for month in range(12):
                # Climate-adjusted rainfall
                mean_rain = base_rain_mm[month] * rain_factor
                std_rain = base_rain_mm[month] * 0.3 * rain_var_factor
                rain_mm = max(0, np.random.normal(mean_rain, std_rain))

                rain_m3 = rain_mm / 1000 * lake_area_m2
                evap_m3 = base_evap_mm[month] / 1000 * lake_area_m2
                river_m3 = max(0, np.random.normal(
                    base_river[month] * rain_factor,
                    base_river[month] * 0.3 * rain_var_factor)) * 1e6

                # Determine ship capacity based on lake level
                if level >= restrict_level:
                    ships = full_capacity_ships
                    results["months_full"] += 1
                elif level >= min_level:
                    ships = 22
                    results["months_restricted"] += 1
                    results["ships_lost"] += (full_capacity_ships - 22) * 30
                else:
                    ships = 15
                    results["months_critical"] += 1
                    results["ships_lost"] += (full_capacity_ships - 15) * 30

                days = [31,28,31,30,31,30,31,31,30,31,30,31][month]
                lock_m3 = ships * water_per_ship * days

                net = rain_m3 + river_m3 - evap_m3 - lock_m3
                level += net / lake_area_m2
                level = min(level, 26.7)

                results["total_months"] += 1

        results["min_levels"].append(level)

    return results

# Climate scenarios
scenarios = [
    ("Historical baseline",    1.0, 1.0),
    ("Mild change (+var)",     1.0, 1.5),
    ("Moderate (-10% rain)",   0.9, 1.5),
    ("Severe (-20% rain, +var)", 0.8, 2.0),
    ("Extreme drought pattern", 0.7, 2.5),
]

print("=== Climate Change Impact on Panama Canal ===")
print(f"200 simulations x 20 years per scenario\\n")
print(f"{'Scenario':<28} {'Full%':>6} {'Restrict%':>10} {'Critical%':>10} {'Ships Lost':>11}")
print("-" * 67)

for name, rain_f, var_f in scenarios:
    r = simulate_climate_scenario(name, rain_f, var_f)
    total = r["total_months"]
    pct_full = r["months_full"] / total * 100
    pct_restr = r["months_restricted"] / total * 100
    pct_crit = r["months_critical"] / total * 100
    print(f"{name:<28} {pct_full:>5.1f} {pct_restr:>9.1f} {pct_crit:>9.1f} "
          f"{r['ships_lost']:>10,}")

# Revenue impact
toll_per_ship = 400000  # USD average
toll_str = f"{toll_per_ship:,}"
print(f"\\n=== Revenue Impact (avg toll {toll_str}/ship) ===")
for name, rain_f, var_f in scenarios:
    r = simulate_climate_scenario(name, rain_f, var_f)
    annual_lost = r["ships_lost"] / 200 / 20  # per simulation per year
    revenue_lost = annual_lost * toll_per_ship
    print(f"{name:<28} Ships lost/yr: {annual_lost:>6.0f}  "
          f"Revenue lost: {revenue_lost/1e6:>6.1f}M/yr")`,
      challenge: 'Model a mitigation strategy: the Rio Indio reservoir adds 800 million m³/year of supplemental water when the lake drops below 25.5 m. Add this to the "Severe" scenario. Does it restore full reliability? What size reservoir would be needed to maintain full capacity under the "Extreme" scenario? This is the actual engineering question the Panama Canal Authority is studying.',
      successHint: 'You built a climate adaptation model — the same approach used by every water utility, hydropower company, and agricultural system facing climate uncertainty. The key insight: reliability analysis (what fraction of time can we operate normally?) is more useful than predicting the average outcome. Extremes, not averages, drive infrastructure failure.',
    },
    {
      title: 'Structural analysis of lock gates — hydrostatic force on massive steel gates',
      concept: `The Panama Canal lock gates are among the largest moving structures ever built. Each original Gatun gate leaf is 19.5 m wide, 20 m tall, and 2.1 m thick — weighing 750 tonnes. They must resist the full hydrostatic force of a 9+ metre head of water.

**Hydrostatic force on a vertical surface:**

**F = 0.5 × rho × g × h² × w**

Where h is the water depth and w is the gate width. The force acts at h/3 from the bottom (the centroid of the triangular pressure distribution).

The gate must also resist **bending moments** — the water pushes harder at the bottom than the top, trying to bend the gate outward. The structural design uses a hollow cellular construction (like a honeycomb) to resist bending while keeping weight manageable.

📚 *Hydrostatic pressure increases linearly with depth: P = rho × g × h. This means the bottom of the gate experiences 20× the pressure of the top. Designing for this non-uniform load is the core structural challenge.*`,
      analogy: 'Hold a book flat against a stream of water from a hose. The water pushes the book backward — that is hydrostatic force. Now imagine the hose stream gets stronger toward the bottom of the book. The book wants to bend — the bottom is pushed harder than the top. The lock gate must resist this bending over an area the size of a football pitch.',
      storyConnection: 'The original Gatun Lock gates were designed and built by the Army Corps of Engineers in 1913 — and most are still in service over 110 years later. Each gate leaf swings on a massive hinge pin at the lock wall. The "mitre" design (two leaves meeting at an angle) uses the water pressure to push the gates together more tightly — an elegant solution where the load strengthens the seal.',
      checkQuestion: 'A lock gate is 20 m tall and 19.5 m wide with 15 m of water on one side and 6 m on the other. What is the net hydrostatic force?',
      checkAnswer: 'High side: F = 0.5 × 1000 × 9.81 × 15² × 19.5 = 21.5 MN. Low side: F = 0.5 × 1000 × 9.81 × 6² × 19.5 = 3.4 MN. Net force = 21.5 - 3.4 = 18.1 MN (1,845 tonnes-force). This net force is what the gate hinges and mitre seal must resist — continuously, 24 hours a day, for over a century.',
      codeIntro: 'Calculate hydrostatic forces and bending moments on Panama Canal lock gates.',
      code: `import numpy as np

def gate_analysis(gate_width, gate_height, upstream_depth, downstream_depth,
                  n_segments=100):
    """
    Detailed hydrostatic force analysis on a lock gate.
    Divides gate into horizontal segments and calculates force distribution.
    """
    rho = 1000
    g = 9.81
    dz = gate_height / n_segments

    forces = []
    moments = []
    depths = []

    total_force = 0
    total_moment = 0

    for i in range(n_segments):
        z = (i + 0.5) * dz  # height from bottom
        depth_upstream = max(0, upstream_depth - (gate_height - z - dz/2))
        depth_downstream = max(0, downstream_depth - (gate_height - z - dz/2))

        # Pressure at this height
        p_up = rho * g * max(0, upstream_depth - (gate_height - z))
        p_down = rho * g * max(0, downstream_depth - (gate_height - z))
        net_pressure = p_up - p_down

        # Force on this strip
        strip_force = net_pressure * gate_width * dz
        # Moment about the bottom hinge
        strip_moment = strip_force * z

        forces.append(strip_force)
        moments.append(strip_moment)
        depths.append(z)

        total_force += strip_force
        total_moment += strip_moment

    # Centre of pressure (from bottom)
    cop = total_moment / total_force if total_force > 0 else 0

    return {
        "total_force": total_force,
        "total_moment": total_moment,
        "centre_of_pressure": cop,
        "forces": np.array(forces),
        "depths": np.array(depths)
    }

# Original Gatun Lock gate
gate_w = 19.5  # m
gate_h = 20.0  # m

print("=== Panama Canal Lock Gate Structural Analysis ===\\n")

# Different operating conditions
conditions = [
    ("Full head (lock empty)",     15.24, 6.1),
    ("Half filling",               15.24, 10.67),
    ("Nearly equalised",           15.24, 14.5),
    ("Neopanamax full head",       18.0,  9.0),
    ("Emergency: gate failure",    15.24, 0.0),
]

print(f"{'Condition':<28} {'Up (m)':>7} {'Down (m)':>9} {'Force (MN)':>11} "
      f"{'Moment (MNm)':>13} {'CoP (m)':>8}")
print("-" * 78)

for name, up, down in conditions:
    r = gate_analysis(gate_w, gate_h, up, down)
    print(f"{name:<28} {up:>6.1f} {down:>8.1f} {r['total_force']/1e6:>10.1f} "
          f"{r['total_moment']/1e6:>12.1f} {r['centre_of_pressure']:>7.2f}")

# Force distribution profile
print("\\n=== Force Distribution (Full Head Condition) ===")
r = gate_analysis(gate_w, gate_h, 15.24, 6.1, n_segments=10)
print(f"{'Height (m)':>11} {'Force (kN)':>11} {'% of Total':>11}")
print("-" * 35)
total = r["total_force"]
for i in range(len(r["depths"])):
    pct = r["forces"][i] / total * 100 if total > 0 else 0
    bar = "#" * int(pct / 2)
    print(f"{r['depths'][i]:>10.1f} {r['forces'][i]/1000:>10.0f} {pct:>9.1f}%  {bar}")

# Gate structural design check
print("\\n=== Structural Design Check ===")
max_force = r["total_force"]
gate_thickness = 2.1  # m
gate_mass = 750000    # kg
steel_yield = 250e6   # Pa (structural steel)

# Bending stress in the gate (simplified beam model)
# Maximum bending moment at the hinge
M_max = r["total_moment"]
# Section modulus for a hollow rectangular section
t_plate = 0.025  # 25mm plate thickness
I = (gate_w * gate_thickness**3 / 12) - ((gate_w - 2*t_plate) * (gate_thickness - 2*t_plate)**3 / 12)
sigma_bend = M_max * (gate_thickness / 2) / I

print(f"Maximum bending moment: {M_max/1e6:.1f} MN·m")
print(f"Section moment of inertia: {I:.2f} m⁴")
print(f"Maximum bending stress: {sigma_bend/1e6:.1f} MPa")
print(f"Steel yield stress: {steel_yield/1e6:.0f} MPa")
print(f"Safety factor: {steel_yield / sigma_bend:.1f}×")`,
      challenge: 'The mitre gate design means the two leaves meet at an angle (typically 18 degrees from perpendicular). The water pressure pushes the gates together, creating a compressive force along the gate leaf. Calculate this compressive force and check if it causes buckling. Hint: the horizontal water force resolves into a component pushing the gates together and a component pushing them into the lock wall.',
      successHint: 'You performed a structural analysis of one of the most iconic engineering structures in the world. Hydrostatic force calculations on gates, dams, and retaining walls are a core topic in civil engineering. The same pressure distribution analysis applies to submarine hulls, ship hulls, and underwater tunnels — any structure resisting water pressure.',
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
            Level 3 covers computational fluid dynamics, transit scheduling, water budgets, climate impact modelling, and structural analysis.
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
