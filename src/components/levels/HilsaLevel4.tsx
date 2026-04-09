import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HilsaLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'River network model — mapping the migration route',
      concept: `A hilsa migration simulation needs a model of the river network: the Padma, Meghna, and their tributaries form a complex graph of channels with varying depths, widths, currents, and salinities. We represent this as a **weighted graph** where nodes are river junctions and edges are channel segments.

Each edge has properties: length, average depth, average current speed, turbulence intensity, and salinity. The hilsa must navigate from the Bay of Bengal to the spawning grounds, choosing the path that minimises total energy expenditure.

In the code below, you will build a river network model and implement a shortest-path algorithm that finds the energy-optimal migration route.`,
      analogy: 'Think of Google Maps finding the fastest route between two cities. It evaluates many possible paths, calculating travel time for each based on road speed, distance, and traffic. The hilsa\'s problem is identical — except "travel time" is replaced by "energy cost" and "roads" are replaced by "river channels."',
      storyConnection: 'Hilsa from the Bay of Bengal have multiple possible routes to the spawning grounds: up the Padma (direct but strong current), up the Meghna (longer but gentler current), or through smaller distributary channels (narrow but sheltered). Acoustic tagging studies show that individual hilsa consistently choose the same routes — suggesting they have evolved or learned to find the optimal path.',
      checkQuestion: 'A river network has 3 possible routes: A (100 km, 0.5 m/s current), B (150 km, 0.3 m/s current), C (80 km, 0.8 m/s current). If energy scales with current speed squared, which route minimises energy?',
      checkAnswer: 'Energy ~ distance * current^2. A: 100 * 0.25 = 25. B: 150 * 0.09 = 13.5. C: 80 * 0.64 = 51.2. Route B is cheapest despite being longest — the gentle current more than compensates for the extra distance.',
      codeIntro: 'Build a river network model and find the energy-optimal migration route for hilsa.',
      code: `import numpy as np

# River network model for hilsa migration

class RiverSegment:
    def __init__(self, name, length_km, depth_m, width_m,
                 current_ms, turbulence, salinity_gL):
        self.name = name
        self.length = length_km
        self.depth = depth_m
        self.width = width_m
        self.current = current_ms
        self.TI = turbulence
        self.salinity = salinity_gL

    def energy_cost(self, swim_speed=0.8, mass=0.5):
        """Energy to traverse this segment (kJ)"""
        rho, Cd, A, eff = 1000, 0.06, 0.005, 0.25
        v_water = swim_speed
        v_ground = swim_speed - self.current
        if v_ground <= 0:
            return float('inf')
        drag = 0.5 * rho * v_water**2 * Cd * A
        P_swim = drag * v_water / eff
        P_basal = 0.05
        turb_penalty = 1 + self.TI  # turbulence increases cost
        P_total = (P_swim + P_basal) * turb_penalty
        time_s = self.length * 1000 / v_ground
        return P_total * time_s / 1000

# Build the Padma-Meghna river network
segments = {
    # Main Padma route
    "bay_to_padma": RiverSegment("Bay to Padma mouth", 50, 15, 5000, 0.3, 0.15, 25),
    "lower_padma": RiverSegment("Lower Padma", 80, 10, 3000, 0.5, 0.20, 10),
    "mid_padma": RiverSegment("Mid Padma", 60, 8, 2000, 0.7, 0.25, 3),
    "upper_padma": RiverSegment("Upper Padma", 70, 6, 1500, 0.9, 0.30, 1),

    # Meghna alternative
    "bay_to_meghna": RiverSegment("Bay to Meghna", 60, 12, 4000, 0.2, 0.12, 20),
    "lower_meghna": RiverSegment("Lower Meghna", 100, 8, 2500, 0.4, 0.18, 8),
    "upper_meghna": RiverSegment("Upper Meghna", 90, 6, 1500, 0.5, 0.22, 2),
    "meghna_to_padma": RiverSegment("Meghna-Padma link", 40, 5, 800, 0.6, 0.25, 2),

    # Distributary route
    "bay_to_dist": RiverSegment("Bay to distributary", 40, 8, 2000, 0.2, 0.10, 22),
    "distributary": RiverSegment("Distributary channel", 120, 4, 300, 0.3, 0.15, 5),
    "dist_to_padma": RiverSegment("Distributary to Padma", 30, 3, 200, 0.4, 0.20, 2),
}

# Define routes (sequences of segments)
routes = {
    "Padma Direct": ["bay_to_padma", "lower_padma", "mid_padma", "upper_padma"],
    "Meghna Route": ["bay_to_meghna", "lower_meghna", "upper_meghna", "meghna_to_padma"],
    "Distributary": ["bay_to_dist", "distributary", "dist_to_padma", "upper_padma"],
}

print("=== Hilsa Migration Route Analysis ===")
print()

for route_name, seg_names in routes.items():
    total_dist = 0
    total_energy = 0
    total_time_h = 0

    print(f"--- {route_name} ---")
    print(f"{'Segment':<28} {'km':>5} {'Current':>8} {'Energy':>8}")
    print("-" * 52)

    for sname in seg_names:
        seg = segments[sname]
        E = seg.energy_cost()
        v_ground = 0.8 - seg.current
        T = seg.length * 1000 / v_ground / 3600 if v_ground > 0 else float('inf')
        total_dist += seg.length
        total_energy += E
        total_time_h += T
        print(f"{seg.name:<28} {seg.length:>5.0f} {seg.current:>6.1f} {E:>6.0f} kJ")

    print(f"{'TOTAL':<28} {total_dist:>5.0f} {'':>8} {total_energy:>6.0f} kJ")
    print(f"Travel time: {total_time_h:.0f} hours ({total_time_h/24:.1f} days)")
    fat_g = total_energy / 37
    print(f"Fat required: {fat_g:.0f} g ({fat_g/500*100:.0f}% of 500g fish)")
    print()

# Find optimal route
print("=== Optimal Route Summary ===")
for rname, segs in routes.items():
    E = sum(segments[s].energy_cost() for s in segs)
    D = sum(segments[s].length for s in segs)
    print(f"{rname:<20} {D:>5.0f} km  {E:>6.0f} kJ")`,
      challenge: 'Add a "monsoon" scenario where all current speeds increase by 50% and turbulence by 30%. Which route becomes optimal during monsoon? Does the optimal route change between dry season and monsoon? This explains why hilsa migration timing matters.',
      successHint: 'Route optimisation on networks is used in logistics (delivery trucks), telecommunications (packet routing), and transportation (airline scheduling). The same graph algorithms that find the cheapest hilsa route find the fastest delivery route for Amazon packages.',
    },
    {
      title: 'Energy-state model — tracking a fish through the journey',
      concept: `A migrating hilsa is a system with a **state** that evolves over time. The state includes: position along the route, remaining energy (fat reserves), current swimming speed, and physiological condition. At each time step, the fish spends energy (swimming and metabolism), gains or loses condition, and advances along the route.

This is a **state-space model** — the same framework used for spacecraft trajectories, robot navigation, and financial modelling. The state at time t+1 depends on the state at time t plus inputs (decisions like swimming speed) and disturbances (current changes, turbulence).

In the code below, you will simulate a hilsa's complete migration, tracking its state at each hour and determining whether it arrives with enough energy to spawn.`,
      analogy: 'Think of the hilsa as a car on a road trip with a limited fuel tank. At each moment, you track fuel remaining, distance covered, and road conditions. If fuel drops to zero, the trip fails. The car must choose its speed carefully — fast enough to arrive before "time runs out" (spawning season), slow enough not to run out of fuel.',
      storyConnection: 'Fisheries scientists use energy-state models to predict hilsa spawning success. If a population starts migration with low fat reserves (due to poor feeding conditions in the Bay), the model predicts fewer fish will reach the spawning grounds — and the next year\'s catch will be lower. This connection between ocean feeding conditions and river spawning success drives fisheries management decisions.',
      checkQuestion: 'A hilsa starts with 5,000 kJ of energy and burns 15 kJ per km. After 200 km, how much energy remains? If it needs 1,500 kJ for spawning, can it successfully reproduce?',
      checkAnswer: 'Energy remaining = 5000 - 200*15 = 5000 - 3000 = 2000 kJ. Spawning needs 1500 kJ, so 2000 > 1500 — yes, it can spawn with 500 kJ to spare. But if the current was stronger (20 kJ/km), remaining would be 5000 - 4000 = 1000 kJ — not enough.',
      codeIntro: 'Simulate a hilsa\'s complete migration as a state-space model, hour by hour.',
      code: `import numpy as np

# Hilsa migration state-space simulation

class HilsaState:
    def __init__(self, position_km=0, energy_kJ=5500, condition=1.0,
                 speed_ms=0.8, mass_kg=0.5):
        self.position = position_km
        self.energy = energy_kJ
        self.condition = condition  # 1.0 = healthy, 0 = dead
        self.speed = speed_ms
        self.mass = mass_kg
        self.alive = True
        self.spawned = False

def simulate_migration(route_segments, initial_energy, swim_speed=0.8):
    """Simulate hour-by-hour migration"""
    state = HilsaState(energy_kJ=initial_energy, speed_ms=swim_speed)
    rho, Cd, A, eff = 1000, 0.06, 0.005, 0.25
    P_basal = 0.05  # W
    hourly_log = []
    segment_idx = 0
    km_in_segment = 0

    total_distance = sum(s["length"] for s in route_segments)
    spawn_energy = 1500  # kJ needed for spawning

    for hour in range(2000):  # max 2000 hours
        if segment_idx >= len(route_segments):
            # Arrived at spawning ground!
            if state.energy >= spawn_energy:
                state.spawned = True
            break

        seg = route_segments[segment_idx]

        # Current conditions (with random variation)
        np.random.seed(hour * 7 + 13)
        current = seg["current"] * (1 + np.random.normal(0, 0.1))
        turb = seg["turbulence"] * (1 + np.random.normal(0, 0.2))

        # Swimming calculations
        v_water = state.speed
        v_ground = v_water - current

        if v_ground <= 0:
            # Current too strong — wait or burst
            v_water = current + 0.1  # minimum progress
            v_ground = 0.1
            state.speed = v_water

        # Energy expenditure this hour
        drag = 0.5 * rho * v_water**2 * Cd * A
        P_swim = drag * v_water / eff
        turb_cost = P_swim * turb
        P_total = P_swim + P_basal + turb_cost

        energy_spent = P_total * 3600 / 1000  # kJ per hour
        distance_covered = v_ground * 3.6  # km per hour

        # Update state
        state.energy -= energy_spent
        state.position += distance_covered
        km_in_segment += distance_covered
        state.condition = max(0, state.energy / initial_energy)

        # Check if moved to next segment
        if km_in_segment >= seg["length"]:
            km_in_segment -= seg["length"]
            segment_idx += 1

        # Log every 12 hours
        if hour % 12 == 0:
            hourly_log.append({
                "hour": hour, "day": hour / 24,
                "position": state.position,
                "energy": state.energy,
                "condition": state.condition,
                "segment": seg["name"],
            })

        # Check for death
        if state.energy <= 0:
            state.alive = False
            break

    return state, hourly_log

# Define route
route = [
    {"name": "Bay to Padma", "length": 50, "current": 0.3, "turbulence": 0.15},
    {"name": "Lower Padma", "length": 80, "current": 0.5, "turbulence": 0.20},
    {"name": "Mid Padma", "length": 60, "current": 0.7, "turbulence": 0.25},
    {"name": "Upper Padma", "length": 70, "current": 0.8, "turbulence": 0.30},
]

# Simulate with different starting energies
print("=== Migration Outcome vs Starting Energy ===")
print(f"{'Start (kJ)':>10} {'Arrived':>8} {'Spawned':>8} {'Time (d)':>8} {'End kJ':>8}")
print("-" * 44)

for start_E in [3000, 4000, 5000, 5500, 6000, 7000]:
    final, log = simulate_migration(route, start_E)
    time_d = log[-1]["day"] if log else 0
    print(f"{start_E:>10} {'Yes' if final.position > 250 else 'No':>8} "
          f"{'Yes' if final.spawned else 'No':>8} {time_d:>6.1f} {max(0,final.energy):>6.0f}")

# Detailed log for 5500 kJ start
print()
print("=== Detailed Migration Log (5500 kJ start) ===")
final, log = simulate_migration(route, 5500)
print(f"{'Day':>5} {'Position':>10} {'Energy':>10} {'Condition':>10} {'Segment':<20}")
print("-" * 57)
for entry in log:
    print(f"{entry['day']:>5.1f} {entry['position']:>8.1f} km {entry['energy']:>8.0f} kJ "
          f"{entry['condition']:>8.0%} {entry['segment']:<20}")

print(f"\\nFinal: {'ARRIVED' if final.position > 250 else 'FAILED'} "
      f"| {'SPAWNED' if final.spawned else 'TOO WEAK'} "
      f"| Energy: {max(0,final.energy):.0f} kJ")`,
      challenge: 'Run 100 simulations with random starting energy (4000-6000 kJ, uniform distribution). What fraction successfully spawns? This gives the population-level spawning success rate — the key metric for fisheries management.',
      successHint: 'State-space models are the backbone of modern simulation. Spacecraft trajectories, autonomous vehicle navigation, weather prediction, and financial risk modelling all use the same framework: define the state, the transition rules, and the inputs, then simulate forward in time.',
    },
    {
      title: 'Fish passage design — engineering a path for hilsa',
      concept: `A **fish passage** (fish ladder or fishway) allows fish to bypass dams and weirs. The key design parameters are: **maximum velocity** (must be less than the fish's sustained swimming speed), **resting pools** (fish need periodic rest areas), **turbulence** (must be low enough for orientation), and **depth** (must accommodate the fish's size).

Design criteria for hilsa: maximum velocity 1.0-1.5 m/s (hilsa sustained swimming speed), pool volume at least 5x fish body volume per fish, turbulence dissipation less than 150 W/m3, and minimum depth 0.5 m.

The energy dissipation in each pool is: **E_d = rho * g * Q * delta_h / V_pool**, where Q is the flow rate, delta_h is the head drop per pool, and V_pool is the pool volume. Keeping E_d below the threshold ensures fish can navigate without disorientation.`,
      analogy: 'A fish passage is like an escalator for fish. Instead of one giant leap (which most fish cannot make), the elevation change is broken into small steps (pools), each easy to navigate. The escalator (flowing water) carries the fish gently upward, with rest areas (pools) between each step.',
      storyConnection: 'The Farakka Barrage on the Ganges, built in 1975, devastated hilsa populations by blocking their migration route. Fish catches upstream dropped by 95% within a decade. A fish passage was built but was poorly designed — velocities exceeded 3 m/s and there were no resting pools. A redesigned passage based on modern engineering principles could restore hilsa access to 500 km of upstream habitat.',
      checkQuestion: 'A dam is 5 m high and the fish passage has 10 pools. What is the head drop per pool? If Q = 0.5 m3/s and each pool is 2 m3, what is the energy dissipation?',
      checkAnswer: 'Head per pool = 5/10 = 0.5 m. E_d = 1000 * 9.81 * 0.5 * 0.5 / 2 = 1226 W/m3. This far exceeds the 150 W/m3 limit for hilsa! Need either more pools (smaller head each) or larger pools (more volume to dissipate energy in).',
      codeIntro: 'Design a fish passage for hilsa at a dam, optimising pool dimensions and flow conditions.',
      code: `import numpy as np

# Fish passage design tool

g = 9.81
rho = 1000

class FishPassageDesign:
    def __init__(self, dam_height_m, flow_m3s, target_species="hilsa"):
        self.dam_height = dam_height_m
        self.Q = flow_m3s

        # Species-specific criteria
        if target_species == "hilsa":
            self.v_max = 1.2     # m/s max velocity
            self.v_burst = 3.0   # m/s burst speed
            self.Ed_max = 150    # W/m3 max energy dissipation
            self.min_depth = 0.5  # m
            self.body_length = 0.35  # m
            self.min_pool_vol_per_fish = 0.005  # m3 per fish

    def design_pools(self, n_pools, pool_length, pool_width, pool_depth):
        """Evaluate a pool-and-weir design"""
        head_per_pool = self.dam_height / n_pools
        pool_volume = pool_length * pool_width * pool_depth

        # Velocity over weir: v = sqrt(2*g*h)
        v_weir = np.sqrt(2 * g * head_per_pool)

        # Energy dissipation
        Ed = rho * g * self.Q * head_per_pool / pool_volume

        # Fish capacity (number of fish simultaneously)
        capacity = pool_volume / self.min_pool_vol_per_fish

        # Passage time per pool
        t_pool = pool_length / (self.v_max * 0.5)  # swim at half max speed

        # Total passage time
        t_total = t_pool * n_pools

        checks = {
            "Velocity": ("PASS" if v_weir < self.v_max else "FAIL",
                        v_weir, self.v_max),
            "Energy dissipation": ("PASS" if Ed < self.Ed_max else "FAIL",
                                  Ed, self.Ed_max),
            "Depth": ("PASS" if pool_depth >= self.min_depth else "FAIL",
                     pool_depth, self.min_depth),
        }

        return {
            "n_pools": n_pools,
            "head_per_pool": head_per_pool,
            "pool_volume": pool_volume,
            "v_weir": v_weir,
            "Ed": Ed,
            "capacity": capacity,
            "t_total_min": t_total / 60,
            "checks": checks,
        }

# Design for Farakka-type barrage
dam_h = 5.0   # m
flow = 0.3    # m3/s

fp = FishPassageDesign(dam_h, flow)

# Try different configurations
print("=== Fish Passage Design Tool ===")
print(f"Dam height: {dam_h} m | Flow: {flow} m3/s | Species: Hilsa")
print(f"Max velocity: {fp.v_max} m/s | Max Ed: {fp.Ed_max} W/m3")
print()

configs = [
    (5, 2.0, 1.5, 0.8),    # 5 pools, 2x1.5x0.8 m
    (10, 2.0, 1.5, 0.8),   # 10 pools
    (15, 2.0, 1.5, 0.8),   # 15 pools
    (20, 2.0, 2.0, 1.0),   # 20 pools, larger
    (25, 2.5, 2.0, 1.0),   # 25 pools, even larger
    (30, 3.0, 2.0, 1.0),   # 30 pools
]

print(f"{'Pools':>6} {'h/pool':>7} {'v_weir':>8} {'Ed':>10} {'Capacity':>10} {'Pass?':>6}")
print(f"{'':>6} {'(m)':>7} {'(m/s)':>8} {'(W/m3)':>10} {'(fish)':>10}")
print("-" * 50)

best = None
for n, pl, pw, pd in configs:
    r = fp.design_pools(n, pl, pw, pd)
    all_pass = all(c[0] == "PASS" for c in r["checks"].values())
    status = "YES" if all_pass else "NO"
    if all_pass and (best is None or n < best["n_pools"]):
        best = r
    print(f"{n:>6} {r['head_per_pool']:>5.2f} {r['v_weir']:>6.2f} "
          f"{r['Ed']:>8.1f} {r['capacity']:>8.0f} {status:>6}")

if best:
    print(f"\\nOptimal design: {best['n_pools']} pools")
    print(f"Passage time: {best['t_total_min']:.0f} minutes")
    print(f"Fish capacity: {best['capacity']:.0f} fish per pool")

# Cost estimate
if best:
    print()
    print("=== Cost Estimate ===")
    concrete_vol = best["n_pools"] * 2 * 2 * 0.3  # walls
    concrete_cost = concrete_vol * 8000  # INR per m3
    excavation = best["n_pools"] * 2 * 2 * 1 * 500  # INR per m3
    total_cost = concrete_cost + excavation
    print(f"Concrete: {concrete_vol:.0f} m3 (Rs {concrete_cost:,.0f})")
    print(f"Excavation: Rs {excavation:,.0f}")
    print(f"Total: Rs {total_cost:,.0f} (" + f"USD {total_cost/80:,.0f})")`,
      challenge: 'Design a passage for a 10 m high dam. How many pools are needed? What is the total passage length and construction cost? At what dam height does a fish passage become economically impractical? Consider a fish lift (elevator) as an alternative for very high dams.',
      successHint: 'Fish passage design is a growing field as countries recognise the ecological damage of dams. The same engineering principles — energy dissipation, velocity control, and capacity planning — apply to designing storm water systems, wastewater treatment, and hydraulic structures.',
    },
    {
      title: 'Population dynamics — will the hilsa survive?',
      concept: `Individual fish migration feeds into **population dynamics**: if enough fish successfully reach the spawning grounds and reproduce, the population sustains itself. If too many fish die or arrive too weak to spawn, the population declines.

The population model uses the **Beverton-Holt equation**: **R = a*S / (1 + b*S)**, where R is recruitment (number of offspring surviving to adulthood), S is spawning stock, and a and b are parameters related to habitat quality and density dependence.

The key metric is the **replacement ratio**: does each spawning pair produce at least 2 surviving offspring? If yes, the population grows. If no, it declines toward extinction.`,
      analogy: 'A population is like a bank account. Spawning adults deposit "interest" (offspring). Natural mortality and fishing are "withdrawals." If deposits exceed withdrawals, the balance grows. If not, it shrinks. The replacement ratio tells you whether the account is growing or shrinking.',
      storyConnection: 'Hilsa catches in Bangladesh peaked in the 1990s and have been declining since, despite being the national fish. The Farakka Barrage blocks upstream migration, reducing the spawning area. Overfishing removes adults before they can spawn. Climate change alters river flows. The population model helps predict whether current management strategies will reverse the decline or if hilsa will continue to diminish.',
      checkQuestion: 'If 100,000 hilsa attempt migration, 60% successfully reach the spawning grounds, each spawning female produces 500,000 eggs, and only 0.001% survive to adulthood, how many new adults are produced?',
      checkAnswer: '100,000 * 0.6 = 60,000 reach spawning grounds. Assume 50% female = 30,000 females. Eggs = 30,000 * 500,000 = 15 billion. Surviving to adulthood = 15e9 * 0.00001 = 150,000 new adults. Replacement ratio = 150,000/100,000 = 1.5 — population growing. But if passage success drops to 30%, only 75,000 adults — population declining.',
      codeIntro: 'Model hilsa population dynamics over 50 years under different management scenarios.',
      code: `import numpy as np

# Hilsa population dynamics model

def beverton_holt(spawners, a=3.0, b=0.00001):
    """Beverton-Holt stock-recruitment relationship"""
    return a * spawners / (1 + b * spawners)

def simulate_population(
    initial_pop,
    years,
    migration_success,   # fraction reaching spawning grounds
    fishing_rate,         # fraction caught by fishermen
    natural_mortality,    # annual natural death rate
    egg_survival,         # fraction of eggs surviving to juvenile
    passage_available,    # does a fish passage exist?
):
    """Simulate hilsa population over multiple years"""
    pop = initial_pop
    history = [pop]

    for year in range(years):
        # Step 1: Natural mortality
        pop_after_mort = pop * (1 - natural_mortality)

        # Step 2: Fishing
        catch = pop_after_mort * fishing_rate
        pop_after_fish = pop_after_mort - catch

        # Step 3: Migration
        if passage_available:
            migrants = pop_after_fish * migration_success
        else:
            migrants = pop_after_fish * migration_success * 0.3  # dam blocks 70%

        # Step 4: Spawning (Beverton-Holt)
        recruits = beverton_holt(migrants, a=2.5, b=0.000005)

        # Step 5: Egg/juvenile survival
        new_adults = recruits * egg_survival

        # Step 6: New population
        pop = pop_after_fish + new_adults
        pop = max(0, pop)
        history.append(pop)

    return history

initial = 1000000  # 1 million adults
years = 50

# Scenario 1: Current conditions (no passage, heavy fishing)
print("=== Hilsa Population Projections (50 years) ===")
print()

scenarios = [
    ("Status quo (no passage, high fishing)",
     0.6, 0.35, 0.15, 0.0001, False),
    ("Fish passage built",
     0.6, 0.35, 0.15, 0.0001, True),
    ("Passage + reduced fishing (25%)",
     0.6, 0.25, 0.15, 0.0001, True),
    ("Passage + fishing ban during migration",
     0.8, 0.15, 0.15, 0.0001, True),
    ("Worst case (no passage, overfishing)",
     0.4, 0.50, 0.15, 0.0001, False),
]

print(f"{'Scenario':<42} {'Year 10':>10} {'Year 25':>10} {'Year 50':>10} {'Trend':<8}")
print("-" * 82)

for name, mig, fish, mort, egg, passage in scenarios:
    hist = simulate_population(initial, years, mig, fish, mort, egg, passage)
    y10 = hist[10] / 1000
    y25 = hist[25] / 1000
    y50 = hist[50] / 1000
    trend = "Growing" if hist[50] > hist[0] else "Stable" if hist[50] > hist[0]*0.8 else "Declining"
    print(f"{name:<42} {y10:>8.0f}k {y25:>8.0f}k {y50:>8.0f}k {trend:<8}")

# Detailed simulation for "passage + reduced fishing"
print()
print("=== Detailed: Fish Passage + Reduced Fishing ===")
hist = simulate_population(initial, years, 0.6, 0.25, 0.15, 0.0001, True)

print(f"{'Year':>6} {'Population':>12} {'Change':>10}")
print("-" * 30)
for yr in [0, 1, 2, 5, 10, 15, 20, 30, 40, 50]:
    change = (hist[yr] / initial - 1) * 100
    print(f"{yr:>6} {hist[yr]:>10,.0f} {change:>8.1f}%")

# Sensitivity: what fishing rate allows sustainability?
print()
print("=== Sustainable Fishing Rate Analysis ===")
print(f"{'Fishing rate':>12} {'Pop at year 50':>16} {'Sustainable?':>14}")
print("-" * 44)

for frate in np.arange(0.05, 0.50, 0.05):
    h = simulate_population(initial, 50, 0.6, frate, 0.15, 0.0001, True)
    sustainable = "Yes" if h[50] >= initial * 0.9 else "Marginal" if h[50] >= initial * 0.5 else "No"
    print(f"{frate:>10.0%} {h[50]:>14,.0f} {sustainable:>14}")

# Maximum sustainable yield
print()
print("=== Maximum Sustainable Yield (MSY) ===")
best_catch = 0
best_rate = 0
for frate in np.arange(0.05, 0.45, 0.01):
    h = simulate_population(initial, 50, 0.6, frate, 0.15, 0.0001, True)
    if h[50] >= initial * 0.95:
        annual_catch = h[25] * frate
        if annual_catch > best_catch:
            best_catch = annual_catch
            best_rate = frate

print(f"Optimal fishing rate: {best_rate:.0%}")
print(f"Maximum sustainable annual catch: {best_catch:,.0f} fish")
print(f"This maintains population above {initial:,} (stable)")`,
      challenge: 'Add climate change: every decade, increase river current by 5% (harder migration) and decrease egg survival by 10% (warmer water stress). How does the timeline to population collapse change? What compensating management actions (lower fishing rate, more fish passages) could offset climate impacts?',
      successHint: 'Population dynamics models drive real fisheries management worldwide. The Maximum Sustainable Yield concept you just calculated is the target that fisheries managers try to achieve — harvesting the maximum catch that still allows the population to replenish itself. Getting this wrong leads to fishery collapse, as has happened to Atlantic cod, Bluefin tuna, and many other species.',
    },
    {
      title: 'Complete migration simulator — putting it all together',
      concept: `Now we combine everything: river network, fluid dynamics, fish energetics, and population dynamics into one integrated simulation. A school of hilsa starts in the Bay of Bengal and migrates upstream, with each fish making decisions about speed, depth, and route based on local conditions.

The simulation runs in **time steps** (1 hour each): at each step, each fish (1) senses local conditions (current, depth, turbulence), (2) decides swimming speed and depth, (3) expends energy, (4) updates position, and (5) checks for survival. At the end, we count how many fish reached the spawning grounds and how much energy they have left.

This **agent-based model** captures the emergent behaviour of the population — individual decisions lead to collective patterns like schooling, route selection, and arrival timing.`,
      analogy: 'This simulation is like The Oregon Trail game. Each hilsa is a "pioneer family" heading upstream. They face obstacles (rapids, dams, predators), make route decisions, manage resources (fat = food supplies), and some make it to the destination while others do not. The simulation tells us what fraction survives — and what we can change to improve the odds.',
      storyConnection: 'Bangladesh\'s Department of Fisheries uses population models to set annual hilsa management policies: fishing bans during peak migration (October-November), sanctuary zones where fishing is prohibited, and compensation programs for fishermen who comply. A simulation like this one helps evaluate whether proposed policies will actually work before they are implemented.',
      checkQuestion: 'In an agent-based model with 10,000 fish running for 500 time steps, how many total calculations are performed?',
      checkAnswer: '10,000 fish * 500 steps = 5,000,000 individual calculations. At each step, each fish does ~10 operations (sense, decide, move, update energy, etc.), so 50 million operations total. This is trivial for a modern computer — real ABMs often simulate millions of agents.',
      codeIntro: 'Build and run a complete hilsa migration simulation from sea to spawning ground.',
      code: `import numpy as np

# Complete hilsa migration simulator

class Hilsa:
    def __init__(self, fish_id, energy_kJ, mass_kg=0.5):
        self.id = fish_id
        self.position_km = 0
        self.energy = energy_kJ
        self.mass = mass_kg
        self.alive = True
        self.arrived = False
        self.speed = 0.8

    def decide_speed(self, current, turbulence):
        """Adaptive speed selection"""
        if current > 0.7:
            self.speed = current + 0.3  # swim harder
        elif turbulence > 0.3:
            self.speed = 0.6  # slow down in turbulence
        else:
            self.speed = 0.8  # cruise

    def swim_hour(self, current, turbulence, depth):
        """Simulate one hour of swimming"""
        if not self.alive:
            return

        rho, Cd, A, eff = 1000, 0.06, 0.005, 0.25
        v_ground = self.speed - current
        if v_ground <= 0:
            v_ground = 0.05
            self.speed = current + 0.05

        drag = 0.5 * rho * self.speed**2 * Cd * A
        P_total = (drag * self.speed / eff + 0.05) * (1 + turbulence)
        energy_spent = P_total * 3600 / 1000

        self.energy -= energy_spent
        self.position_km += v_ground * 3.6

        if self.energy <= 0:
            self.alive = False

def run_simulation(n_fish=200, target_km=260):
    """Run complete migration simulation"""
    np.random.seed(42)

    # Create fish population with variable starting energy
    fish = []
    for i in range(n_fish):
        energy = np.random.normal(5500, 800)
        energy = max(3000, min(8000, energy))
        fish.append(Hilsa(i, energy))

    # River conditions by km (simplified)
    def river_conditions(km):
        if km < 50:
            return 0.3, 0.15, 12  # estuary
        elif km < 130:
            return 0.5, 0.20, 8   # lower river
        elif km < 190:
            return 0.7, 0.28, 6   # mid river
        else:
            return 0.85, 0.32, 5  # upper river

    # Run hour by hour
    max_hours = 800
    snapshots = []

    for hour in range(max_hours):
        alive_fish = [f for f in fish if f.alive and not f.arrived]
        if not alive_fish:
            break

        for f in alive_fish:
            current, turb, depth = river_conditions(f.position_km)
            # Add random variation
            c = current * (1 + np.random.normal(0, 0.1))
            t = turb * (1 + np.random.normal(0, 0.15))
            f.decide_speed(c, t)
            f.swim_hour(c, t, depth)

            if f.position_km >= target_km:
                f.arrived = True

        # Snapshot every 24 hours
        if hour % 24 == 0:
            alive = sum(1 for f in fish if f.alive)
            arrived = sum(1 for f in fish if f.arrived)
            avg_pos = np.mean([f.position_km for f in fish if f.alive and not f.arrived]) if alive_fish else 0
            avg_E = np.mean([f.energy for f in fish if f.alive]) if alive > 0 else 0
            snapshots.append({
                "day": hour // 24, "alive": alive,
                "arrived": arrived, "avg_pos": avg_pos, "avg_E": avg_E
            })

    return fish, snapshots

# Run the simulation
print("=== Complete Hilsa Migration Simulation ===")
print(f"Population: 200 fish | Target: 260 km upstream")
print()

fish, snaps = run_simulation(200, 260)

print(f"{'Day':>4} {'Alive':>6} {'Arrived':>8} {'Avg km':>8} {'Avg Energy':>12}")
print("-" * 40)
for s in snaps:
    if s["day"] <= 35:
        print(f"{s['day']:>4} {s['alive']:>6} {s['arrived']:>8} "
              f"{s['avg_pos']:>6.0f} {s['avg_E']:>10.0f} kJ")

# Final statistics
arrived = [f for f in fish if f.arrived]
died = [f for f in fish if not f.alive]
stranded = [f for f in fish if f.alive and not f.arrived]

print()
print("=== Final Results ===")
print(f"Arrived at spawning ground: {len(arrived)} ({len(arrived)/200*100:.0f}%)")
print(f"Died en route: {len(died)} ({len(died)/200*100:.0f}%)")
print(f"Still swimming: {len(stranded)}")

if arrived:
    energies = [f.energy for f in arrived]
    spawn_threshold = 1500
    can_spawn = sum(1 for e in energies if e > spawn_threshold)
    print(f"\\nOf those arrived:")
    print(f"  Can spawn (>{spawn_threshold} kJ): {can_spawn} ({can_spawn/len(arrived)*100:.0f}%)")
    print(f"  Too weak to spawn: {len(arrived) - can_spawn}")
    print(f"  Avg energy on arrival: {np.mean(energies):.0f} kJ")
    print(f"  Min/Max energy: {np.min(energies):.0f} / {np.max(energies):.0f} kJ")

# Effective spawning success
total_spawners = can_spawn if arrived else 0
print(f"\\nEffective spawning rate: {total_spawners}/{200} = {total_spawners/200*100:.0f}%")
print(f"This rate determines next year's population!")`,
      challenge: 'Add a fish passage at km 180 that reduces the current from 0.85 to 0.5 m/s for the last section. Re-run the simulation. How many more fish arrive? How many more can spawn? Calculate the "fish saved per dollar" if the passage costs Rs 50 lakh — this is the metric that convinces policymakers to fund fish passages.',
      successHint: 'You just built an agent-based model — the same class of simulation used to model traffic, epidemics, financial markets, and ecosystems. Each agent (fish) follows simple rules, but the collective behaviour is complex and emergent. This is the frontier of computational science: understanding complex systems by simulating their individual components.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Simulate complete fish migration with current, energy, and navigation</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises build a complete hilsa migration simulator — from river networks to agent-based population modelling.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
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
