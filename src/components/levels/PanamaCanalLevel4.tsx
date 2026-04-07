import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PanamaCanalLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Architect the Canal Lock Simulator',
      concept: `In this capstone project, you will build a complete **Canal Lock Simulator** — a Python program that:

1. **Models lock filling** with Torricelli-based non-steady flow
2. **Schedules ship transits** through multiple locks to maximise throughput
3. **Tracks water balance** in Gatun Lake over seasons and years
4. **Generates reports** comparing scenarios and recommending operational strategies

This brings together everything from Levels 1-3: hydraulic flow, scheduling optimisation, water resource management, and structural constraints.

The first step is **system design** — defining the data structures, interfaces, and workflow before writing any simulation code. The Canal Lock Simulator has four interacting subsystems: the lock physics engine, the transit scheduler, the water manager, and the report generator.

📚 *System architecture means deciding how components interact. A good architecture keeps components independent (low coupling) so you can change one without breaking the others. The lock engine shouldn't need to know about scheduling — it just fills and empties on command.*`,
      analogy: 'Building a simulator is like building a factory. First you design the floor plan: where does each department go, how do materials flow between them, where are the inputs and outputs? Only after the layout is approved do you install the machines. Our "floor plan" is the class hierarchy; the "machines" are the algorithms we\'ll implement next.',
      storyConnection: 'The Panama Canal itself is a system of systems: the locks, the lake, the channels, the scheduling office, and the maintenance crews all interact. When George Goethals managed the canal construction, his first act was to reorganise the entire operation into clear departments with defined interfaces — system architecture applied to a 75,000-person construction project.',
      checkQuestion: 'Why should the LockEngine class NOT contain scheduling logic?',
      checkAnswer: 'Separation of concerns. The lock engine knows physics (flow rates, fill times, forces). The scheduler knows operations (which ship goes next, queue management). Mixing them creates a "god class" that is hard to test, debug, and modify. If you change the scheduling algorithm, you shouldn\'t need to touch the flow equations — and vice versa.',
      codeIntro: 'Design the architecture of the Canal Lock Simulator — define classes, interfaces, and data flow.',
      code: `import numpy as np

# Canal Lock Simulator — System Architecture

class Lock:
    """Represents a single lock chamber with its physical properties."""
    def __init__(self, name, length, width, lift, n_culverts, culvert_diam):
        self.name = name
        self.length = length          # m
        self.width = width            # m
        self.lift = lift              # m (water level change)
        self.n_culverts = n_culverts
        self.culvert_diam = culvert_diam  # m
        self.chamber_area = length * width
        self.culvert_area = n_culverts * np.pi * (culvert_diam / 2)**2
        self.water_volume = length * width * lift  # m³ per operation
        self.state = "empty"          # empty, filling, full, draining
        self.current_level = 0.0      # m above base

    def __repr__(self):
        return f"Lock({self.name}: {self.length}x{self.width}m, lift={self.lift}m)"


class Ship:
    """Represents a vessel transiting the canal."""
    def __init__(self, name, length, beam, draft, tonnage, ship_type):
        self.name = name
        self.length = length      # m
        self.beam = beam          # m
        self.draft = draft        # m
        self.tonnage = tonnage    # DWT
        self.ship_type = ship_type  # "panamax" or "neopanamax"
        self.arrival_time = 0     # minutes since midnight
        self.transit_start = None
        self.transit_end = None

    def fits_lock(self, lock):
        return self.beam < lock.width - 1.0 and self.length < lock.length - 5.0


class GatunLake:
    """Represents the water reservoir supplying the locks."""
    def __init__(self, area_km2, initial_level, min_level, max_level):
        self.area_m2 = area_km2 * 1e6
        self.level = initial_level
        self.min_level = min_level
        self.max_level = max_level
        self.daily_usage = 0

    def withdraw(self, volume_m3):
        delta = volume_m3 / self.area_m2
        self.level -= delta
        self.daily_usage += volume_m3
        return self.level > self.min_level  # True if still operational


# Build the canal system
gatun_locks = [
    Lock("Gatun-1", 304.8, 33.5, 9.14, 20, 5.5),
    Lock("Gatun-2", 304.8, 33.5, 9.14, 20, 5.5),
    Lock("Gatun-3", 304.8, 33.5, 9.14, 20, 5.5),
]
neopanamax_locks = [
    Lock("Agua Clara-1", 427.0, 55.0, 9.0, 24, 6.0),
    Lock("Agua Clara-2", 427.0, 55.0, 9.0, 24, 6.0),
    Lock("Agua Clara-3", 427.0, 55.0, 9.0, 24, 6.0),
]
lake = GatunLake(area_km2=425, initial_level=26.0, min_level=24.84, max_level=26.7)

# System overview
print("=== Canal Lock Simulator — Architecture ===\\\n")
print("Lock Systems:")
for lock in gatun_locks + neopanamax_locks:
    print(f"  {lock}")
    print(f"    Water per cycle: {lock.water_volume:,.0f} m³ ({lock.water_volume/1e6:.1f} ML)")

print(f"\\\nGatun Lake:")
print(f"  Area: {lake.area_m2/1e6:.0f} km² | Level: {lake.level:.1f}m")
print(f"  Operating range: {lake.min_level}-{lake.max_level}m")

# Test ship compatibility
test_ships = [
    Ship("MV Pacific Star", 250, 32.2, 12.0, 65000, "panamax"),
    Ship("MV Mega Container", 366, 51.2, 15.2, 120000, "neopanamax"),
    Ship("MSC Gulsun", 400, 61.5, 16.0, 230000, "too_large"),
]

print("\\\nShip Compatibility:")
for ship in test_ships:
    for lock in [gatun_locks[0], neopanamax_locks[0]]:
        fits = ship.fits_lock(lock)
        clearance = lock.width - ship.beam
        status = f"FITS (clearance {clearance:.1f}m)" if fits else "TOO LARGE"
        print(f"  {ship.name} in {lock.name}: {status}")`,
      challenge: 'Add a WaterSavingBasin class: the Neopanamax locks have 3 side basins per chamber that store 60% of the lock water for reuse. Modify the Lock class to accept an optional water_saving_pct parameter and reduce the water withdrawn from Gatun Lake accordingly. How much water does this save over 1,000 transits?',
      successHint: 'Good architecture makes everything else easier. You defined clear classes (Lock, Ship, GatunLake) with single responsibilities — the same design patterns used in real simulation software. The Lock doesn\'t know about scheduling; the Lake doesn\'t know about ships. This separation means you can improve each subsystem independently.',
    },
    {
      title: 'Lock filling engine — implement the core simulation with Torricelli flow',
      concept: `Now we implement the **lock filling engine** — the physics core of the simulator. Given a Lock object and a head difference, the engine computes:

1. **Time-series of water level** in the chamber (non-steady Torricelli flow)
2. **Flow rate** through the culverts at each time step
3. **Fill time** to reach the target level
4. **Water volume consumed** from Gatun Lake

The engine uses **Euler integration** of the Torricelli ODE: dh/dt = -(C_d × A_culvert × sqrt(2gh)) / A_lock. We integrate this step-by-step, updating h at each time step.

The engine also computes **ship safety metrics**: maximum flow velocity at culvert exits (must be < 2.5 m/s) and maximum water surface slope (indicates sloshing risk).

📚 *The lock filling engine is a "pure function" — given the same inputs, it always produces the same outputs. No hidden state, no side effects. This makes it easy to test and to run thousands of times in Monte Carlo simulations.*`,
      analogy: 'The lock engine is like a flight simulator\'s physics engine. It doesn\'t decide where to fly (that\'s the autopilot/scheduler). It just computes: given current altitude, speed, and throttle setting, what happens in the next 0.1 seconds? Our lock engine answers: given current water level and culvert size, what happens in the next 0.5 seconds?',
      storyConnection: 'The original Panama Canal engineers didn\'t have computers. They designed the culvert system using hand calculations and physical scale models — a 1:30 scale model of the Gatun Locks in a laboratory. Today we simulate the same physics digitally, but the equations are identical to what they used on paper in 1908.',
      checkQuestion: 'Why does the lock engine need to track flow rate over time, not just total fill time?',
      checkAnswer: 'Because the maximum instantaneous flow rate determines ship safety. A lock might fill in 8 minutes on average, but if the first 30 seconds produce a surge that exceeds 2.5 m/s exit velocity, the ship could be damaged. The time-series reveals dangerous transients that an average calculation would miss.',
      codeIntro: 'Implement the lock filling engine with Torricelli flow and ship safety metrics.',
      code: `import numpy as np

class LockEngine:
    """Core simulation engine for lock filling/draining."""

    def __init__(self, cd=0.6, g=9.81):
        self.cd = cd
        self.g = g

    def fill(self, lock_length, lock_width, n_culverts, culvert_diam,
             head_initial, dt=0.5, max_time=1200):
        """
        Simulate lock filling with non-steady Torricelli flow.
        Returns dict with time series and summary metrics.
        """
        A_lock = lock_length * lock_width
        A_culvert = n_culverts * np.pi * (culvert_diam / 2)**2

        times = [0]
        heads = [head_initial]
        flows = [0]
        volumes = [0]

        h = head_initial
        t = 0
        total_vol = 0

        while h > 0.005 and t < max_time:
            Q = self.cd * A_culvert * np.sqrt(2 * self.g * max(h, 0))
            v_culvert = Q / A_culvert  # velocity in culverts

            # Water level rise in lock
            dh = Q * dt / A_lock
            h = max(h - dh, 0)
            t += dt
            total_vol += Q * dt

            times.append(t)
            heads.append(h)
            flows.append(Q)
            volumes.append(total_vol)

        times = np.array(times)
        flows = np.array(flows)

        # Safety metrics
        max_flow = np.max(flows)
        max_velocity = max_flow / A_culvert
        # Estimate exit port velocity (100 floor ports, 0.6m diameter each)
        n_ports = 100
        port_area = n_ports * np.pi * 0.3**2
        max_exit_vel = max_flow / port_area

        return {
            "times": times,
            "heads": np.array(heads),
            "flows": flows,
            "volumes": np.array(volumes),
            "fill_time_s": t,
            "fill_time_min": t / 60,
            "total_volume_m3": total_vol,
            "max_flow_m3s": max_flow,
            "max_culvert_vel": max_velocity,
            "max_exit_vel": max_exit_vel,
        }

# Instantiate the engine
engine = LockEngine()

# Test with both lock types
configs = [
    ("Gatun (Panamax)",    304.8, 33.5, 20, 5.5, 9.14),
    ("Agua Clara (Neo)",   427.0, 55.0, 24, 6.0, 9.0),
]

print("=== Lock Filling Engine Test Results ===\\\n")

for name, length, width, n_culv, diam, head in configs:
    r = engine.fill(length, width, n_culv, diam, head)

    print(f"--- {name} ---")
    print(f"  Fill time: {r['fill_time_s']:.0f}s ({r['fill_time_min']:.1f} min)")
    print(f"  Water volume: {r['total_volume_m3']:,.0f} m³ ({r['total_volume_m3']/1e6:.2f} ML)")
    print(f"  Peak flow: {r['max_flow_m3s']:,.0f} m³/s")
    print(f"  Peak culvert velocity: {r['max_culvert_vel']:.1f} m/s")
    print(f"  Peak exit port velocity: {r['max_exit_vel']:.1f} m/s "
          f"({'SAFE' if r['max_exit_vel'] < 2.5 else 'DANGER'})")
    print()

    # Time series summary
    print(f"  {'Time (s)':>8} {'Head (m)':>9} {'Flow (m³/s)':>12} {'Vol (m³)':>10}")
    print(f"  {'-'*41}")
    indices = np.linspace(0, len(r["times"])-1, 8, dtype=int)
    for idx in indices:
        print(f"  {r['times'][idx]:>7.0f} {r['heads'][idx]:>8.2f} "
              f"{r['flows'][idx]:>10.0f} {r['volumes'][idx]:>9.0f}")
    print()

# Compare efficiency
print("=== Efficiency Comparison ===")
r1 = engine.fill(304.8, 33.5, 20, 5.5, 9.14)
r2 = engine.fill(427.0, 55.0, 24, 6.0, 9.0)
print(f"Gatun: {r1['total_volume_m3']/1e6:.1f} ML in {r1['fill_time_min']:.1f} min")
print(f"Agua Clara: {r2['total_volume_m3']/1e6:.1f} ML in {r2['fill_time_min']:.1f} min")
print(f"Neopanamax uses {r2['total_volume_m3']/r1['total_volume_m3']:.1f}x more water")
print(f"With 60% water saving basins: {r2['total_volume_m3']*0.4/1e6:.1f} ML from lake")`,
      challenge: 'Add a "controlled fill" mode where the culvert valves open gradually over the first 2 minutes (linearly from 0 to full opening) to reduce the initial surge. Compare the peak exit velocity between instant-open and controlled-open. How much does the controlled opening reduce peak velocity, and how much does it add to fill time?',
      successHint: 'You built a numerical simulation engine from scratch — the same class of code that powers industrial process simulators, power plant control systems, and aerospace design tools. The Torricelli ODE solver is a concrete example of how differential equations are solved in practice: one small time step at a time.',
    },
    {
      title: 'Transit scheduler — optimise ship scheduling for maximum throughput',
      concept: `The transit scheduler takes a queue of waiting ships and assigns them to lock chambers to **maximise daily throughput**. This is a real-time scheduling problem because:

1. Ships arrive at random times (Poisson process)
2. Different ships fit different locks (Panamax vs Neopanamax)
3. Each lock operation consumes water — scheduling must respect water limits
4. Ship direction matters — you can't fill and drain a lock simultaneously

We implement a **priority-based greedy scheduler**: at each decision point, it selects the highest-priority ship that fits the next available lock. Priority factors include: arrival time (first-come-first-served base), ship size (larger ships have higher toll revenue), and cargo urgency (LNG tankers have time-sensitive cargo).

📚 *Greedy algorithms make the locally optimal choice at each step. They don't always find the global optimum, but they're fast and often produce good-enough solutions for real-time scheduling where decisions must be made quickly.*`,
      analogy: 'A restaurant host seats the next party at the first available table that fits. A party of 2 goes to a 2-person table; a party of 8 waits for a large table. The host doesn\'t plan the entire evening\'s seating — they make the best decision right now with current information. Our scheduler works the same way: assign the best ship to the next available lock.',
      storyConnection: 'The Panama Canal Authority\'s scheduling office operates 24/7, managing ~40 transits per day across two lock systems (original and Neopanamax). In 2023, when drought forced transit restrictions, the scheduling office had to reduce throughput from 38 to 22 ships per day — deciding which ships waited (sometimes for weeks) and which transited. Those decisions were worth billions of dollars in economic impact.',
      checkQuestion: 'Why is a greedy scheduler "good enough" for the Panama Canal instead of computing the mathematically optimal schedule?',
      checkAnswer: 'Because conditions change constantly: ships arrive late, weather delays transits, equipment breaks down. An optimal schedule computed in the morning is obsolete by noon. A greedy scheduler adapts instantly to the current state — it doesn\'t need a perfect plan, just a good next decision. This is why most real-world scheduling systems use heuristics rather than exact optimisation.',
      codeIntro: 'Implement a transit scheduler that assigns ships to locks and tracks throughput.',
      code: `import numpy as np

np.random.seed(42)

class TransitScheduler:
    """Greedy scheduler for Panama Canal ship transits."""

    def __init__(self, lock_cycle_min, lake_volume_limit_m3):
        self.lock_cycle = lock_cycle_min  # minutes per lock cycle
        self.lake_limit = lake_volume_limit_m3  # daily water limit
        self.water_used = 0

    def generate_arrivals(self, n_ships, ship_mix):
        """Generate random ship arrivals for one day."""
        ships = []
        arrival_times = np.sort(np.random.uniform(0, 1440, n_ships))

        for i, arrival in enumerate(arrival_times):
            # Random ship type based on mix
            r = np.random.random()
            cumulative = 0
            for stype, fraction, props in ship_mix:
                cumulative += fraction
                if r <= cumulative:
                    ships.append({
                        "id": i + 1,
                        "type": stype,
                        "arrival": arrival,
                        "beam": props["beam"],
                        "water_m3": props["water"],
                        "toll": props["toll"],
                        "priority": props["priority"],
                        "transit_start": None,
                        "transit_end": None,
                    })
                    break
        return ships

    def schedule_day(self, ships, n_panamax_lanes, n_neo_lanes):
        """
        Schedule ships through locks for one day.
        Returns completed transits and metrics.
        """
        # Lock availability: time when each lane becomes free
        panamax_lanes = [0.0] * n_panamax_lanes
        neo_lanes = [0.0] * n_neo_lanes

        completed = []
        rejected = []
        queue = sorted(ships, key=lambda s: (s["arrival"], -s["priority"]))

        for ship in queue:
            # Check water limit
            if self.water_used + ship["water_m3"] > self.lake_limit:
                rejected.append(ship)
                continue

            # Find earliest available lock
            if ship["beam"] <= 32.3:  # fits Panamax
                best_lane = min(range(len(panamax_lanes)), key=lambda i: panamax_lanes[i])
                earliest = max(ship["arrival"], panamax_lanes[best_lane])
                # 3 locks in series
                transit_time = 3 * self.lock_cycle + 45  # + lake crossing
                panamax_lanes[best_lane] = earliest + transit_time

            elif ship["beam"] <= 54.0:  # fits Neopanamax
                best_lane = min(range(len(neo_lanes)), key=lambda i: neo_lanes[i])
                earliest = max(ship["arrival"], neo_lanes[best_lane])
                transit_time = 3 * self.lock_cycle + 45
                neo_lanes[best_lane] = earliest + transit_time
            else:
                rejected.append(ship)
                continue

            ship["transit_start"] = earliest
            ship["transit_end"] = earliest + transit_time
            ship["wait_time"] = earliest - ship["arrival"]
            self.water_used += ship["water_m3"]

            if ship["transit_end"] <= 1440 + 240:  # within day + 4hr buffer
                completed.append(ship)
            else:
                rejected.append(ship)

        return completed, rejected

# Ship type definitions
ship_mix = [
    ("Bulk carrier",  0.30, {"beam": 28, "water": 197000, "toll": 200000, "priority": 1}),
    ("Container (PM)", 0.25, {"beam": 32, "water": 197000, "toll": 350000, "priority": 2}),
    ("Tanker",        0.15, {"beam": 30, "water": 197000, "toll": 300000, "priority": 2}),
    ("Container (Neo)", 0.20, {"beam": 51, "water": 429000, "toll": 800000, "priority": 3}),
    ("LNG carrier",   0.10, {"beam": 49, "water": 429000, "toll": 700000, "priority": 4}),
]

# Simulate different demand levels
scheduler = TransitScheduler(lock_cycle_min=30, lake_volume_limit_m3=8e9)

print("=== Panama Canal Transit Scheduler ===\\\n")
print(f"{'Demand':>7} {'Completed':>10} {'Rejected':>9} {'Revenue':>12} "
      f"{'Avg Wait':>10} {'Water (ML)':>10}")
print("-" * 63)

for n_ships in [25, 35, 40, 45, 50, 60]:
    scheduler.water_used = 0
    ships = scheduler.generate_arrivals(n_ships, ship_mix)
    done, rejected = scheduler.schedule_day(ships, n_panamax_lanes=2, n_neo_lanes=2)

    revenue = sum(s["toll"] for s in done)
    avg_wait = np.mean([s["wait_time"] for s in done]) if done else 0
    water_ml = scheduler.water_used / 1e6

    print(f"{n_ships:>7} {len(done):>10} {len(rejected):>9} "
          f"{revenue/1e6:>9.1f}M {avg_wait:>8.0f}min {water_ml:>9.0f}")

# Detailed breakdown for 40-ship day
print("\\\n=== Detailed Day (40 ships) ===")
scheduler.water_used = 0
ships = scheduler.generate_arrivals(40, ship_mix)
done, rejected = scheduler.schedule_day(ships, 2, 2)

type_stats = {}
for s in done:
    t = s["type"]
    if t not in type_stats:
        type_stats[t] = {"count": 0, "revenue": 0, "wait": []}
    type_stats[t]["count"] += 1
    type_stats[t]["revenue"] += s["toll"]
    type_stats[t]["wait"].append(s["wait_time"])

print(f"{'Type':<18} {'Count':>6} {'Revenue':>10} {'Avg Wait':>10}")
print("-" * 46)
for t, stats in sorted(type_stats.items()):
    rev_m = stats['revenue']/1e6
    print(f"{t:<18} {stats['count']:>6} {rev_m:>8.1f}M "
          f"{np.mean(stats['wait']):>8.0f}min")`,
      challenge: 'Implement a "revenue-maximising" scheduler that prioritises high-toll ships over first-come-first-served. Compare it against the current priority scheduler: does revenue go up? What happens to average wait time for small bulk carriers? This is the fairness vs efficiency trade-off that every scheduling system faces.',
      successHint: 'You built a scheduling system for one of the busiest chokepoints in global trade. The same scheduling algorithms are used by airports (runway assignment), hospitals (operating theatres), and cloud computing platforms (job scheduling). The greedy heuristic with priority classes is a practical, widely-used approach.',
    },
    {
      title: 'Water management — integrate lake balance with lock operations',
      concept: `Now we connect the scheduler to the water budget: every ship transit withdraws water from Gatun Lake, and the lake level determines how many ships can transit. This creates a **feedback loop**:

- More transits → lower lake → fewer transits allowed → lake recovers
- Fewer transits → higher lake → more transits allowed → lake drops

The water manager implements this feedback by:
1. Tracking lake level daily
2. Setting transit limits based on current level
3. Accounting for rainfall, evaporation, and river inflow
4. Projecting when restrictions will be needed

This is a **control system** — the lake level is the controlled variable, the transit count is the manipulated variable, and the target is to keep the lake between operational bounds.

📚 *Feedback control is everywhere: a thermostat controls room temperature, cruise control maintains car speed, the Federal Reserve adjusts interest rates to control inflation. The Panama Canal's water management is the same principle applied to a 425 km² lake.*`,
      analogy: 'A thermostat keeps your house at 21 degrees C. When the temperature drops, the heater turns on. When it reaches 21, the heater turns off. The canal\'s water manager works the same way: when the lake drops below 25.5 m, transit limits tighten (reducing water "spending"). When the lake recovers above 26 m, limits relax. The goal is to keep the lake in the safe operating range.',
      storyConnection: 'In the 2023-2024 drought, the Panama Canal Authority implemented a tiered restriction system: Level 1 (reduce from 38 to 32 transits), Level 2 (reduce to 24), Level 3 (reduce to 18). Each tier was triggered by the lake dropping below a specific threshold. This is exactly the feedback control system we are modelling — and it cost the global economy billions when it activated.',
      checkQuestion: 'If restricting transits from 38 to 24 per day reduces water usage by 37%, and the lake is dropping 2 cm per day, will the restriction stabilise the lake?',
      checkAnswer: 'It depends on how much of the 2 cm/day drop is from lock usage vs evaporation exceeding rainfall. If lock usage accounts for more than 37% of the net drawdown, the restriction will slow the decline. If evaporation alone exceeds inflow (pure drought), even zero transits won\'t stop the lake from dropping. That is the extreme scenario the canal authority fears most.',
      codeIntro: 'Integrate the water manager with the lock engine and scheduler for a full annual simulation.',
      code: `import numpy as np

np.random.seed(42)

class WaterManager:
    """Manages Gatun Lake level with feedback-controlled transit limits."""

    def __init__(self, lake_area_km2, initial_level):
        self.lake_area_m2 = lake_area_km2 * 1e6
        self.level = initial_level
        self.history = []

        # Restriction tiers
        self.tiers = [
            (26.5, 38, "Normal"),
            (25.5, 32, "Tier 1"),
            (25.0, 24, "Tier 2"),
            (24.84, 18, "Tier 3 (Emergency)"),
        ]

    def get_transit_limit(self):
        for threshold, limit, name in self.tiers:
            if self.level >= threshold:
                return limit, name
        return 14, "Critical"

    def daily_update(self, month, ships_transited, water_per_ship_m3):
        """Update lake level for one day."""
        # Monthly climate data (mm/day averages)
        rain_mm = [1.3, 0.9, 1.0, 2.7, 7.3, 7.7, 6.5, 7.3, 8.3, 9.3, 8.7, 4.0][month]
        evap_mm = [4.0, 4.3, 4.5, 4.3, 3.3, 3.0, 3.1, 2.9, 2.8, 2.8, 3.0, 3.7][month]
        river_m3 = [2.7, 2.0, 1.7, 2.3, 6.7, 9.3, 8.7, 9.0, 10.0, 10.7, 9.3, 5.0][month] * 1e6

        # Add random variation
        rain_mm *= np.random.uniform(0.6, 1.4)
        river_m3 *= np.random.uniform(0.7, 1.3)

        # Water balance
        rain_m3 = rain_mm / 1000 * self.lake_area_m2
        evap_m3 = evap_mm / 1000 * self.lake_area_m2
        lock_m3 = ships_transited * water_per_ship_m3

        net_m3 = rain_m3 + river_m3 - evap_m3 - lock_m3
        self.level += net_m3 / self.lake_area_m2
        self.level = min(self.level, 26.7)  # spillway cap

        return net_m3

    def simulate_year(self, base_demand=38, water_per_ship=280000):
        """Simulate a full year of canal operations."""
        year_history = []
        total_ships = 0
        total_revenue = 0
        toll_per_ship = 400000

        for month in range(12):
            days = [31,28,31,30,31,30,31,31,30,31,30,31][month]
            for day in range(days):
                limit, tier_name = self.get_transit_limit()
                ships = min(base_demand, limit)

                self.daily_update(month, ships, water_per_ship)
                total_ships += ships
                total_revenue += ships * toll_per_ship

                year_history.append({
                    "month": month + 1, "day": day + 1,
                    "level": self.level, "ships": ships,
                    "tier": tier_name
                })

        return year_history, total_ships, total_revenue

# Run multi-year simulation
print("=== Integrated Water Management Simulation ===\\\n")

# Scenario: Normal conditions
mgr = WaterManager(425, 26.0)
all_history = []
total_ships_all = 0
total_rev_all = 0

for year in range(1, 6):
    year_hist, year_ships, year_rev = mgr.simulate_year(base_demand=38)
    all_history.extend(year_hist)
    total_ships_all += year_ships
    total_rev_all += year_rev

    min_level = min(h["level"] for h in year_hist)
    restricted_days = sum(1 for h in year_hist if h["tier"] != "Normal")
    print(f"Year {year}: {year_ships:,} ships | Revenue: {year_rev/1e9:.2f}B | "
          f"Min level: {min_level:.2f}m | Restricted days: {restricted_days}")

# Drought scenario (Year 3 has 40% less rainfall)
print("\\\n=== Drought Scenario (reduced rainfall Year 2-3) ===")
mgr2 = WaterManager(425, 26.0)

for year in range(1, 6):
    if year in [2, 3]:
        # Override with drought conditions
        year_hist = []
        year_ships = 0
        for month in range(12):
            days = [31,28,31,30,31,30,31,31,30,31,30,31][month]
            for day in range(days):
                limit, tier = mgr2.get_transit_limit()
                ships = min(38, limit)
                # Drought: reduce rainfall factor
                rain_factor = 0.6
                rain_mm = [1.3,0.9,1.0,2.7,7.3,7.7,6.5,7.3,8.3,9.3,8.7,4.0][month] * rain_factor
                evap_mm = [4.0,4.3,4.5,4.3,3.3,3.0,3.1,2.9,2.8,2.8,3.0,3.7][month]
                river_m3 = [2.7,2.0,1.7,2.3,6.7,9.3,8.7,9.0,10.0,10.7,9.3,5.0][month]*1e6*0.6

                rain_m3 = rain_mm/1000 * mgr2.lake_area_m2 * np.random.uniform(0.7,1.3)
                evap_m3 = evap_mm/1000 * mgr2.lake_area_m2
                lock_m3 = ships * 280000
                net = rain_m3 + river_m3 - evap_m3 - lock_m3
                mgr2.level += net / mgr2.lake_area_m2
                mgr2.level = min(mgr2.level, 26.7)
                year_ships += ships
                year_hist.append({"level": mgr2.level, "tier": tier})
        year_rev = year_ships * 400000
    else:
        year_hist, year_ships, year_rev = mgr2.simulate_year()

    min_lev = min(h["level"] for h in year_hist)
    restr = sum(1 for h in year_hist if h.get("tier", "Normal") != "Normal")
    print(f"Year {year}: {year_ships:,} ships | Min: {min_lev:.2f}m | Restricted: {restr}d"
          f"{' DROUGHT' if year in [2,3] else ''}")`,
      challenge: 'Add a "water saving basin" feature: when enabled, Neopanamax lock transits use 40% of normal water (60% saved). Assume 30% of transits are Neopanamax. How much longer can the canal maintain full operations during a drought with water-saving basins vs without? This is the actual business case that justified the $5.25B Neopanamax lock investment.',
      successHint: 'You built a feedback control system for water resource management — the same framework used by every reservoir, dam, and water utility in the world. The tiered restriction system is real: the Panama Canal Authority uses exactly this approach, and the drought response you modelled matches what happened in 2023-2024.',
    },
    {
      title: 'Report generation — comparative analysis and recommendations',
      concept: `The final step: take all simulation results and produce a **professional engineering report** with:

1. **Executive summary** — key findings in 3 sentences
2. **Scenario comparison** — side-by-side results for all simulated scenarios
3. **Risk assessment** — probability and impact of adverse events
4. **Recommendations** — specific, actionable engineering proposals
5. **Limitations and future work** — honest assessment of model accuracy

This is the deliverable that justifies the entire analysis. A simulation with no report is just code. A report without simulation is just opinion. Together, they form an **evidence-based recommendation** — the gold standard in engineering decision-making.

📚 *The most impactful skill in engineering is not building the model — it's communicating what the model tells you. A clear, concise report that non-technical stakeholders can understand is worth more than the most sophisticated simulation in the world.*`,
      analogy: 'A doctor doesn\'t hand you a printout of blood test numbers and walk away. They explain what the numbers mean, what\'s concerning, and what you should do about it. An engineering report does the same: it translates simulation output into decisions. The numbers are evidence; the report is the verdict.',
      storyConnection: 'When the U.S. Congress debated whether to build the Panama Canal in 1902, the decision came down to a report. The Isthmian Canal Commission produced a detailed engineering comparison of the Panama route vs the Nicaragua route, covering costs, construction time, disease risk, and earthquake hazard. That report — clear, comparative, and evidence-based — convinced Congress to invest $375 million (equivalent to $13 billion today) in the Panama route.',
      checkQuestion: 'A simulation shows that adding a new reservoir increases canal capacity by 15% at a cost of $2 billion. Is this a good investment?',
      checkAnswer: 'At ~40 ships/day and $400K average toll, the canal earns ~$5.8 billion/year. A 15% increase = $870 million/year in additional revenue. The $2B reservoir pays for itself in 2.3 years. Yes, it is an excellent investment — if the capacity increase is reliable. The report must quantify the confidence interval of that 15% estimate.',
      codeIntro: 'Generate the complete Canal Lock Simulator report with scenario comparison and recommendations.',
      code: `import numpy as np

np.random.seed(42)

def quick_annual_sim(initial_level, rain_factor, demand, water_per_ship,
                     n_years=10, n_sims=100):
    """Quick Monte Carlo simulation for report generation."""
    lake_area_m2 = 425e6
    base_rain = np.array([1.3,0.9,1.0,2.7,7.3,7.7,6.5,7.3,8.3,9.3,8.7,4.0])
    base_evap = np.array([4.0,4.3,4.5,4.3,3.3,3.0,3.1,2.9,2.8,2.8,3.0,3.7])
    base_river = np.array([2.7,2.0,1.7,2.3,6.7,9.3,8.7,9.0,10.0,10.7,9.3,5.0])

    annual_ships = []
    min_levels = []
    restricted_days_list = []

    for _ in range(n_sims):
        level = initial_level
        total_ships = 0
        restricted = 0

        for yr in range(n_years):
            for mo in range(12):
                days = [31,28,31,30,31,30,31,31,30,31,30,31][mo]
                for d in range(days):
                    # Transit limit based on level
                    if level >= 25.5: limit = demand
                    elif level >= 25.0: limit = 24
                    elif level >= 24.84: limit = 18
                    else: limit = 14

                    ships = min(demand, limit)
                    if ships < demand: restricted += 1

                    rain = base_rain[mo]*rain_factor*np.random.uniform(0.6,1.4)/1000*lake_area_m2
                    evap = base_evap[mo]/1000*lake_area_m2
                    river = base_river[mo]*rain_factor*np.random.uniform(0.7,1.3)*1e6
                    lock = ships * water_per_ship

                    level += (rain + river - evap - lock) / lake_area_m2
                    level = min(level, 26.7)
                    total_ships += ships

        annual_ships.append(total_ships / n_years)
        min_levels.append(level)
        restricted_days_list.append(restricted / n_years)

    return {
        "avg_ships_yr": np.mean(annual_ships),
        "p10_ships": np.percentile(annual_ships, 10),
        "avg_min_level": np.mean(min_levels),
        "avg_restricted_days": np.mean(restricted_days_list),
        "p90_restricted": np.percentile(restricted_days_list, 90),
    }

# Run all scenarios
scenarios = {
    "Baseline (current)": (26.0, 1.0, 38, 280000),
    "With water-saving basins": (26.0, 1.0, 38, 196000),  # 30% savings
    "Moderate drought": (26.0, 0.85, 38, 280000),
    "Drought + water saving": (26.0, 0.85, 38, 196000),
    "Severe drought": (26.0, 0.70, 38, 280000),
    "Severe + saving + reservoir": (26.0, 0.70, 38, 160000),  # savings + reservoir offset
}

print("=" * 72)
print("     PANAMA CANAL LOCK SIMULATOR — OPERATIONS REPORT")
print("=" * 72)

print("""
1. EXECUTIVE SUMMARY
--------------------
This report analyses Panama Canal operations under current conditions
and projected climate scenarios using Monte Carlo simulation (100 runs
x 10 years per scenario). Key finding: water-saving basins combined
with supplemental reservoir supply can maintain near-full capacity
even under severe drought conditions.
""")

print("2. SCENARIO COMPARISON")
print("-" * 72)
print(f"{'Scenario':<32} {'Ships/yr':>9} {'P10 Ships':>10} {'Rest. Days':>11} {'P90 Rest':>9}")
print("-" * 72)

results = {}
for name, (level, rain, demand, water) in scenarios.items():
    r = quick_annual_sim(level, rain, demand, water)
    results[name] = r
    print(f"{name:<32} {r['avg_ships_yr']:>8,.0f} {r['p10_ships']:>9,.0f} "
          f"{r['avg_restricted_days']:>10.0f} {r['p90_restricted']:>8.0f}")

# Revenue analysis
toll = 400000
print("\\\n3. REVENUE IMPACT")
print("-" * 72)
baseline_rev = results["Baseline (current)"]["avg_ships_yr"] * toll
for name, r in results.items():
    rev = r["avg_ships_yr"] * toll
    diff = rev - baseline_rev
    print(f"{name:<32} {rev/1e9:>5.2f}B/yr  ({'+' if diff >= 0 else ''}{diff/1e6:>7.0f}M)")

print("""
4. RISK ASSESSMENT
------------------
  - Drought probability (rain < 85% normal): ~20% in any given year
  - Severe drought (rain < 70%): ~5% per year, but increasing with
    climate change
  - Without mitigation, severe drought reduces revenue by $500M+/yr
  - Water-saving basins reduce drought impact by approximately 40%

5. RECOMMENDATIONS
------------------
  a) IMMEDIATE: Maximise water-saving basin utilisation for all
     Neopanamax transits (saves 60% of lock water per transit)
  b) SHORT-TERM: Complete Rio Indio reservoir to add 800M m³/yr
     supplemental supply — estimated to eliminate Tier 2+ restrictions
     under moderate drought
  c) LONG-TERM: Plan for increasing drought frequency — expand
     reservoir capacity and investigate water recycling technologies
  d) OPERATIONAL: Implement dynamic pricing to reduce demand during
     low-water periods (higher tolls = fewer marginal transits)

6. MODEL LIMITATIONS
--------------------
  - Simplified monthly climate model (real weather varies daily)
  - No sedimentation or water quality modelling
  - Assumes constant ship demand (real demand is economic-cycle dependent)
  - Lock fill times treated as constant (actual varies with maintenance)
  - No interaction between Atlantic and Pacific lock schedules

7. SKILLS DEMONSTRATED
----------------------
""")

skills = [
    ("Hydraulic engineering", "Torricelli flow, Bernoulli equation, shallow water equations"),
    ("Epidemiology", "SIR model with vector dynamics, R0 analysis"),
    ("Optimisation", "Excavation volume minimisation, schedule throughput maximisation"),
    ("Water resources", "Mass balance, feedback control, climate adaptation"),
    ("Structural analysis", "Hydrostatic forces, bending moments, safety factors"),
    ("Monte Carlo simulation", "Random weather, probability distributions, risk quantification"),
    ("System design", "OOP architecture, separation of concerns, modularity"),
    ("Technical communication", "Evidence-based reporting, scenario comparison"),
]

for skill, detail in skills:
    print(f"  {skill}: {detail}")

print("\\\n" + "=" * 72)`,
      challenge: 'Add a "dynamic pricing" scenario: when the lake drops below 25.5 m, double the toll. This reduces demand by 20% (price elasticity). Model this feedback and compare revenue: does the canal earn MORE by charging higher tolls to fewer ships? What is the optimal toll multiplier during drought? This is the real pricing question facing the Panama Canal Authority.',
      successHint: 'You completed a full engineering capstone project: from system architecture through physics simulation, scheduling optimisation, water management, and professional reporting. This is exactly how real infrastructure engineering decisions are made — the Panama Canal Authority commissions analyses like this to plan investments worth billions of dollars. You now have a portfolio project demonstrating hydraulic engineering, optimisation, Monte Carlo methods, and technical communication.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Canal Lock Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Canal Lock Simulator.
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
