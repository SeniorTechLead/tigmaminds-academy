import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function AqueductsLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Branching network analysis — Kirchhoff\'s laws for fluid distribution',
      concept: `Rome's water system wasn't a single pipe — it was a **branching network** with junctions, splits, and loops. Analysing flow in networks requires the same mathematics as electrical circuits: **Kirchhoff's laws**.

**Kirchhoff's first law (conservation of mass):** At any junction, the total flow in equals the total flow out. If 1000 L/s enters a junction and three pipes leave, the sum of their flows must equal 1000 L/s.

**Kirchhoff's second law (pressure loops):** Around any closed loop in the network, the total pressure drop must equal zero. If you follow a path from point A to point B by two different routes, you must get the same pressure at B regardless of which route you take.

The head loss in each pipe follows the Darcy-Weisbach equation: h_f = f × (L/D) × (v²/2g). Combined with Kirchhoff's laws, this gives a system of equations that can be solved for the flow in every pipe.

📚 *The Hardy-Cross method (1936) is an iterative algorithm for solving pipe network equations. It's the hydraulic engineer's equivalent of solving simultaneous equations — and it's fundamentally the same mathematics as solving electrical circuits.*`,
      analogy: 'Think of a road network during rush hour. Cars (water) flow from suburbs (source) to the city centre (fountains). At every intersection (junction), the number of cars entering equals the number leaving. If one road is congested (high friction), traffic redistributes to parallel routes until the travel time (pressure drop) is equalised on all paths. Water in pipe networks behaves identically.',
      storyConnection: 'Rome had 11 major aqueducts feeding a distribution network of over 500 km of pipes. Water from different aqueducts mixed at junction points called castella (distribution tanks). Frontinus documented the flow from each aqueduct to each district — essentially creating the first pipe network flow balance. His data, recorded in De Aquaeductu, is detailed enough that modern engineers have re-analysed it using Hardy-Cross.',
      checkQuestion: 'At a junction, Pipe A delivers 200 L/s and Pipe B delivers 150 L/s. Three pipes leave: C takes 100 L/s, D takes 120 L/s. How much does Pipe E take?',
      checkAnswer: 'By Kirchhoff\'s first law: flow in = flow out. 200 + 150 = 100 + 120 + Q_E. Q_E = 350 - 220 = 130 L/s. Conservation of mass is absolute — you cannot create or destroy water at a junction.',
      codeIntro: 'Solve a branching pipe network using Kirchhoff\'s laws and iterative flow balancing.',
      code: `import numpy as np

class Pipe:
    """A pipe segment with friction properties."""
    def __init__(self, name, length, diameter, roughness=0.001):
        self.name = name
        self.length = length
        self.diameter = diameter
        self.roughness = roughness

    def head_loss(self, flow):
        """Head loss for a given flow rate (m³/s). Sign follows flow direction."""
        if abs(flow) < 1e-10:
            return 0
        area = np.pi * (self.diameter/2)**2
        velocity = abs(flow) / area
        Re = velocity * self.diameter / 1e-6
        if Re < 2300:
            f = 64 / max(Re, 1)
        else:
            term = self.roughness / (3.7 * self.diameter) + 5.74 / Re**0.9
            f = 0.25 / (np.log10(term))**2
        h = f * (self.length / self.diameter) * velocity**2 / (2 * 9.81)
        return h * np.sign(flow)

# Rome's simplified distribution network
# Source -> Castellum -> 4 districts
pipes = {
    "main":     Pipe("Main conduit",    5000, 0.8, 0.0005),
    "north":    Pipe("North branch",    2000, 0.4, 0.001),
    "south":    Pipe("South branch",    3000, 0.5, 0.001),
    "east":     Pipe("East branch",     1500, 0.35, 0.0015),
    "west":     Pipe("West branch",     2500, 0.45, 0.001),
    "cross_ns": Pipe("N-S crosslink",   1000, 0.3, 0.001),
}

# Demands at each district (m³/s)
demands = {"north": 0.08, "south": 0.12, "east": 0.05, "west": 0.10}
total_demand = sum(demands.values())

# Initial flow distribution (proportional to demand)
flows = {
    "main": total_demand,
    "north": demands["north"],
    "south": demands["south"],
    "east": demands["east"],
    "west": demands["west"],
    "cross_ns": 0.01,  # small initial guess for crosslink
}

print("=== Roman Water Distribution Network ===")
print(f"Total source supply: {total_demand*1000:.0f} L/s\\n")

# Kirchhoff check: junction balance
print("Junction Balance Check (Kirchhoff's 1st Law):")
castellum_in = flows["main"]
castellum_out = flows["north"] + flows["south"] + flows["east"] + flows["west"]
print(f"  Castellum: In = {castellum_in*1000:.1f} L/s, Out = {castellum_out*1000:.1f} L/s "
      f"{'BALANCED' if abs(castellum_in - castellum_out) < 0.001 else 'IMBALANCED'}")

# Head losses in each branch
print(f"\\nHead Loss in Each Branch:")
print(f"{'Branch':<18} {'Flow (L/s)':>10} {'Head Loss (m)':>14}")
print("-" * 44)
for name, pipe in pipes.items():
    flow = flows.get(name, 0)
    h = pipe.head_loss(flow)
    print(f"{pipe.name:<18} {flow*1000:>8.1f} {h:>12.2f}")

# Pressure at each district
source_head = 50  # metres of head at source
print(f"\\nPressure at Each District (source head = {source_head} m):")
main_loss = pipes["main"].head_loss(flows["main"])
for district in ["north", "south", "east", "west"]:
    branch_loss = pipes[district].head_loss(flows[district])
    pressure = source_head - main_loss - branch_loss
    pressure_atm = pressure * 9810 / 101325
    print(f"  {district.capitalize():<8} Head: {pressure:>5.1f} m ({pressure_atm:.1f} atm)  "
          f"Flow: {flows[district]*1000:.0f} L/s")

# What if north branch is blocked?
print("\\n=== Scenario: North Branch Blocked ===")
blocked_north = demands["north"]
redistributed = blocked_north / 3
for d in ["south", "east", "west"]:
    new_flow = demands[d] + redistributed
    branch_loss = pipes[d].head_loss(new_flow)
    pressure = source_head - main_loss - branch_loss
    print(f"  {d.capitalize():<8} New flow: {new_flow*1000:.0f} L/s  Head: {pressure:.1f} m")`,
      challenge: 'Add a second source (a second aqueduct) feeding the east district. Now you have two supply points — how does the flow distribution change? In a real network, multiple sources provide redundancy: if one aqueduct fails, the others compensate. Model the failure of the main source and show how the backup source supplies the network.',
      successHint: 'Pipe network analysis using Kirchhoff\'s laws is how every modern water utility designs and operates its distribution system. The mathematical framework is identical to electrical circuit analysis — one of the most elegant cross-domain analogies in engineering. If you understand one, you understand both.',
    },
    {
      title: 'Terrain-following gradient optimisation — routing the aqueduct',
      concept: `Routing an aqueduct across real terrain is an **optimisation problem**: find the path from source to city that maintains a steady downhill gradient while minimising construction cost.

The constraints are:
1. **Minimum gradient** (~0.3 m/km) — water must keep flowing
2. **Maximum gradient** (~3 m/km) — too steep and erosion damages the channel
3. **Tunnels are expensive** — boring through hills costs 10× more per km than surface channels
4. **Bridges are expensive** — crossing valleys with arched bridges costs 5-20× more than surface channels
5. **Siphons are cheaper than bridges** for deep valleys — but require pressure pipes

The optimal route follows contour lines around hills (longer but cheaper) rather than going straight through them (shorter but requiring tunnels). This is a **shortest-path problem with weighted edges** — the same class of problem as GPS navigation.

📚 *Contour-following is why Roman aqueducts are so long relative to the straight-line distance. The Aqua Marcia travels 91 km to cover a straight-line distance of only 37 km — it winds around hills to avoid tunnels.*`,
      analogy: 'Walking from one valley to another, you could climb straight over the mountain (short but exhausting) or follow a contour path around it (longer but easy). Roman engineers made the same choice: follow the contour (cheap surface channel) rather than bore through the mountain (expensive tunnel). The "best" route balances distance against difficulty.',
      storyConnection: 'The engineers who built the Aqua Claudia spent years surveying the terrain with groma (surveying tools) and chorobates (levelling instruments). They identified a route that dropped 320 m over 69 km — a gradient of 4.6 m/km — while avoiding the worst terrain obstacles. Where they couldn\'t avoid a valley, they built the magnificent Arcus Caelimontani arched channel across it.',
      checkQuestion: 'Route A is 40 km of surface channel. Route B is 25 km of surface channel + 5 km of tunnel. If surface costs 10 units/km and tunnel costs 80 units/km, which is cheaper?',
      checkAnswer: 'Route A: 40 × 10 = 400 units. Route B: 25 × 10 + 5 × 80 = 250 + 400 = 650 units. Route A is 38% cheaper despite being 10 km longer. This is why Roman aqueducts meander — the extra distance of surface channel is far cheaper than a short tunnel.',
      codeIntro: 'Find the optimal aqueduct route across a terrain profile, minimising total construction cost.',
      code: `import numpy as np

np.random.seed(42)

# Generate a terrain profile (elevation vs distance)
n_points = 100
x_km = np.linspace(0, 50, n_points)  # 50 km from source to city

# Create realistic terrain with hills and valleys
terrain = 300  # start elevation
elevations = [terrain]
for i in range(1, n_points):
    # Random walk with some structure (hills, valleys)
    change = np.random.normal(-2, 8)  # slight downhill trend
    terrain = max(50, terrain + change)
    elevations.append(terrain)
elevations = np.array(elevations)
elevations[-1] = 80  # city elevation

# Source and city
source_elev = elevations[0]
city_elev = elevations[-1]

print(f"=== Aqueduct Route Optimisation ===")
print(f"Source elevation: {source_elev:.0f} m | City elevation: {city_elev:.0f} m")
print(f"Total drop available: {source_elev - city_elev:.0f} m over {x_km[-1]:.0f} km")
print(f"Ideal gradient: {(source_elev - city_elev)/x_km[-1]:.1f} m/km\\n")

# Cost per km for different construction types
COST_SURFACE = 10     # surface channel
COST_TUNNEL = 80      # tunnel through hill
COST_BRIDGE = 120     # arched bridge across valley
COST_SIPHON = 60      # inverted siphon across valley

# Simple routing: follow ideal gradient line and build what's needed
ideal_gradient = (source_elev - city_elev) / x_km[-1]  # m/km
ideal_line = source_elev - ideal_gradient * x_km

# Classify each segment
total_cost = 0
segment_types = {"surface": 0, "tunnel": 0, "bridge": 0}

print(f"{'km Range':<12} {'Terrain':>8} {'Ideal':>8} {'Type':<10} {'Cost':>6}")
print("-" * 46)

for i in range(0, n_points - 1, 10):  # report every 10 segments
    j = min(i + 10, n_points - 1)
    segment_length = x_km[j] - x_km[i]
    avg_terrain = np.mean(elevations[i:j])
    avg_ideal = np.mean(ideal_line[i:j])

    if avg_terrain > avg_ideal + 15:
        seg_type = "tunnel"
        cost = segment_length * COST_TUNNEL
        segment_types["tunnel"] += segment_length
    elif avg_terrain < avg_ideal - 15:
        seg_type = "bridge"
        cost = segment_length * COST_BRIDGE
        segment_types["bridge"] += segment_length
    else:
        seg_type = "surface"
        cost = segment_length * COST_SURFACE
        segment_types["surface"] += segment_length

    total_cost += cost
    print(f"{x_km[i]:>4.0f}-{x_km[j]:>4.0f} km {avg_terrain:>6.0f} m {avg_ideal:>6.0f} m "
          f"{seg_type:<10} {cost:>5.0f}")

print(f"\\n=== Cost Summary ===")
for stype, length in segment_types.items():
    unit_cost = {"surface": COST_SURFACE, "tunnel": COST_TUNNEL, "bridge": COST_BRIDGE}[stype]
    print(f"  {stype.capitalize():<10} {length:>5.1f} km × {unit_cost:>3} = {length * unit_cost:>6.0f} units")
print(f"  Total cost: {total_cost:.0f} units")

# Compare: what if we added 20% more distance to avoid tunnels?
surface_only_cost = x_km[-1] * 1.2 * COST_SURFACE
print(f"\\n=== Alternative: Contour-following route (+20% distance) ===")
print(f"  Length: {x_km[-1]*1.2:.0f} km all surface channel")
print(f"  Cost: {surface_only_cost:.0f} units")
print(f"  Savings vs direct route: {total_cost - surface_only_cost:.0f} units "
      f"({(total_cost - surface_only_cost)/total_cost*100:.0f}%)")`,
      challenge: 'Implement a dynamic programming solution: at each point, choose between (a) continue at surface level, (b) tunnel through high ground, or (c) bridge/siphon across low ground. Find the route that minimises total cost while maintaining the gradient constraint. This is the same algorithm GPS navigation uses to find the cheapest (fastest) route.',
      successHint: 'Route optimisation across terrain is a fundamental problem in civil engineering, applied to roads, railways, pipelines, and power lines. The trade-off between distance and construction difficulty appears in every infrastructure project. Roman surveyors solved it empirically; modern engineers solve it with algorithms — but the underlying mathematics is the same.',
    },
    {
      title: 'Sediment transport modelling — keeping the channel clean',
      concept: `Water flowing through an aqueduct carries **suspended sediment** — fine particles of sand, silt, and clay. If the water slows down, sediment settles out and **clogs the channel**. Over decades, this sedimentation can reduce a channel's capacity by 50% or more.

The critical parameter is the **settling velocity** of sediment particles, given by **Stokes' law**:

**v_s = (ρ_s - ρ_w) × g × d² / (18μ)**

Where ρ_s is particle density, ρ_w is water density, d is particle diameter, and μ is water viscosity.

If the flow velocity exceeds the settling velocity, particles stay suspended. If the flow slows below the settling velocity, particles settle to the bottom. The **critical velocity** to keep sediment moving is the minimum design velocity for the channel.

Roman engineers installed **settling basins** (piscinae) at intervals along the aqueduct — wide, slow sections where sediment could settle out and be removed by workers, rather than accumulating in the narrow channel.

📚 *Stokes' law applies to spherical particles in laminar flow. Real sediment is irregular, so engineers use an "equivalent diameter" — the diameter of a sphere with the same settling velocity.*`,
      analogy: 'Shake a jar of muddy water. Large sand grains settle immediately. Fine silt takes minutes. The finest clay takes hours. Stokes\' law explains why: settling velocity depends on particle diameter squared — a particle 10× smaller settles 100× slower. An aqueduct must flow fast enough to keep the worst sediment suspended, or install basins to catch it.',
      storyConnection: 'Archaeological excavations of Roman aqueducts reveal thick layers of calcium carbonate (sinter) and sediment inside the channels — sometimes reducing the cross-section by half. The Eifel Aqueduct supplying Roman Cologne accumulated such thick mineral deposits that medieval locals mined the sinter as a building material. The Romans fought this with regular cleaning crews and piscinae spaced every few kilometres.',
      checkQuestion: 'A sand grain (d = 0.5 mm, ρ = 2650 kg/m³) and a clay particle (d = 0.005 mm, ρ = 2500 kg/m³) are in an aqueduct. The flow velocity is 0.3 m/s. Which settles out?',
      checkAnswer: 'Sand settling velocity: v_s ∝ d² = (0.5e-3)² = 2.5e-7 → ~0.2 m/s. This is comparable to flow velocity — sand may settle. Clay: v_s ∝ (0.005e-3)² = 2.5e-11 → ~0.00002 m/s. Clay stays suspended easily. Sand is the problem — it settles in slow sections. This is why settling basins target sand-sized particles.',
      codeIntro: 'Model sediment transport and settling in an aqueduct channel — predict where clogging occurs.',
      code: `import numpy as np

def stokes_settling(diameter_m, rho_s=2650, rho_w=1000, mu=1e-3, g=9.81):
    """Settling velocity of a spherical particle (m/s)."""
    return (rho_s - rho_w) * g * diameter_m**2 / (18 * mu)

def channel_velocity(slope_m_per_m, width, depth, n=0.015):
    """Manning's equation for open channel velocity."""
    area = width * depth
    perimeter = width + 2 * depth
    R_h = area / perimeter
    return (1/n) * R_h**(2/3) * slope_m_per_m**0.5

# Sediment classes
sediments = [
    {"name": "Coarse sand",   "d_mm": 1.0,   "rho": 2650},
    {"name": "Medium sand",   "d_mm": 0.5,   "rho": 2650},
    {"name": "Fine sand",     "d_mm": 0.1,   "rho": 2650},
    {"name": "Coarse silt",   "d_mm": 0.05,  "rho": 2600},
    {"name": "Fine silt",     "d_mm": 0.01,  "rho": 2500},
    {"name": "Clay",          "d_mm": 0.002, "rho": 2400},
]

print("=== Sediment Settling Velocity ===")
print(f"{'Particle':<16} {'Diameter':>10} {'Settling v':>12} {'Settles in 1m':>14}")
print("-" * 54)

for s in sediments:
    d_m = s["d_mm"] * 1e-3
    v_s = stokes_settling(d_m, s["rho"])
    time_1m = 1.0 / v_s if v_s > 0 else float('inf')
    print(f"{s['name']:<16} {s['d_mm']:>8.3f} mm {v_s:>10.6f} m/s {time_1m:>10.0f} sec")

# Aqueduct sections with varying gradient
print("\\n=== Sediment Transport Along Aqueduct ===")
sections = [
    {"name": "Mountain source", "slope_m_per_km": 5.0, "width": 0.8, "depth": 0.5},
    {"name": "Valley bridge",   "slope_m_per_km": 0.5, "width": 1.2, "depth": 0.7},
    {"name": "Suburban tunnel",  "slope_m_per_km": 2.0, "width": 0.9, "depth": 0.6},
    {"name": "City approach",    "slope_m_per_km": 0.3, "width": 1.0, "depth": 0.5},
    {"name": "Settling basin",   "slope_m_per_km": 0.05, "width": 3.0, "depth": 1.5},
]

print(f"{'Section':<20} {'Velocity':>9} {'Sand':>8} {'Silt':>8} {'Clay':>8}")
print("-" * 55)

for sec in sections:
    slope = sec["slope_m_per_km"] / 1000
    v = channel_velocity(slope, sec["width"], sec["depth"])

    statuses = []
    for name, d_mm in [("Sand", 0.5), ("Silt", 0.05), ("Clay", 0.002)]:
        v_s = stokes_settling(d_mm * 1e-3)
        if v > v_s * 5:
            statuses.append("moves")
        elif v > v_s:
            statuses.append("slow")
        else:
            statuses.append("SETTLES")

    print(f"{sec['name']:<20} {v:>7.3f}m/s {statuses[0]:>8} {statuses[1]:>8} {statuses[2]:>8}")

# Sedimentation rate over time
print("\\n=== Channel Capacity Loss Over Time ===")
print("(Assuming 50 mg/L sediment load, 0.1 m³/s flow)")
sediment_load = 50e-6  # kg/L = 50 mg/L
flow_rate = 0.1        # m³/s
channel_area = 0.8 * 0.5  # m²
deposit_density = 1600  # kg/m³ compacted sediment

annual_sediment_kg = sediment_load * flow_rate * 1000 * 3600 * 24 * 365
deposit_volume_per_m = annual_sediment_kg / deposit_density / 1000  # per km

for year in [1, 5, 10, 25, 50, 100]:
    total_deposit = deposit_volume_per_m * year
    capacity_loss = min(total_deposit / channel_area * 100, 100)
    print(f"  Year {year:>4}: Deposit thickness ~{total_deposit*1000:.0f} mm  "
          f"Capacity loss: {capacity_loss:.1f}%")`,
      challenge: 'Design an optimal piscina (settling basin). It needs to be wide enough and long enough that sand settles out but the water keeps flowing. Calculate the minimum basin length for a given flow rate and target particle size. This is the same design problem faced by modern water treatment plants — the physics of sedimentation hasn\'t changed in 2,000 years.',
      successHint: 'Sediment transport modelling is essential in hydraulic engineering, environmental science, and geomorphology. The same Stokes\' law that describes aqueduct clogging describes blood cell sedimentation rates, atmospheric dust settling, and marine sediment deposition. It\'s one of the most widely applicable equations in physics.',
    },
    {
      title: 'Aqueduct vs pipeline — cost-benefit analysis across centuries',
      concept: `Should you build an open gravity-fed aqueduct (Roman style) or a pressurised pipeline (modern style)? This is a **cost-benefit analysis** that must account for:

1. **Capital cost** — construction cost (aqueduct: bridges, tunnels, channels; pipeline: pipes, pumps, pump stations)
2. **Operating cost** — maintenance per year (aqueduct: cleaning, repair; pipeline: pump energy, pipe replacement)
3. **Lifetime** — how many years the system operates (aqueduct: 500+ years; pipeline: 50-100 years)
4. **Capacity** — how much water is delivered (pipeline wins for volume; aqueduct wins for energy cost)
5. **Net present value (NPV)** — future costs discounted to today's value, because money spent in 100 years is worth less than money spent today

**NPV = Σ (benefit_t - cost_t) / (1 + r)^t**

Where r is the discount rate and t is the year. A low discount rate (1%) favours long-lived infrastructure (aqueducts). A high discount rate (10%) favours cheap, short-lived solutions (pipelines).

📚 *Discount rate captures the time value of money: 1000 units today is worth more than 1000 units in 50 years, because today's money can be invested. The discount rate is the assumed investment return.*`,
      analogy: 'Choosing between an aqueduct and a pipeline is like choosing between a stone house and a wooden house. The stone house costs 5× more to build but lasts 500 years. The wooden house is cheap but must be rebuilt every 50 years. Over 500 years, which is cheaper? It depends on how you value future money — and that\'s what the discount rate captures.',
      storyConnection: 'The Aqua Marcia, built in 144 BC, delivered water to Rome for over 400 years. Its construction cost was enormous — estimated at 180 million sesterces (roughly 2 billion modern dollars). But spread over 400 years of service, the cost per year was remarkably low. Modern pipelines cost less to build but must be replaced every 50-80 years. The Roman approach was the ultimate long-term investment.',
      checkQuestion: 'System A costs 100 units to build and lasts 50 years. System B costs 400 units and lasts 400 years. Which has a lower annualised cost?',
      checkAnswer: 'System A: 100/50 = 2 units/year. System B: 400/400 = 1 unit/year. System B is 50% cheaper per year of service — but it requires 4× the upfront investment. An empire that plans for centuries (Rome) chooses B. A government that plans for election cycles (4-5 years) may choose A.',
      codeIntro: 'Compare gravity aqueduct vs pressurised pipeline using net present value analysis.',
      code: `import numpy as np

def npv(cash_flows, discount_rate):
    """Net present value of a series of annual cash flows."""
    years = np.arange(len(cash_flows))
    return np.sum(cash_flows / (1 + discount_rate)**years)

def annuity(total_cost, lifetime, discount_rate):
    """Convert a total cost into equivalent annual payments."""
    if discount_rate == 0:
        return total_cost / lifetime
    return total_cost * discount_rate / (1 - (1 + discount_rate)**(-lifetime))

# System specifications
systems = {
    "Roman Aqueduct": {
        "capital": 5000,       # construction cost (units)
        "annual_maintenance": 30,
        "annual_energy": 0,    # gravity-fed = no energy cost
        "lifetime": 500,
        "capacity_m3_day": 50000,
        "rebuild_cost": 0,     # doesn't need rebuilding
    },
    "Modern Pipeline": {
        "capital": 1200,
        "annual_maintenance": 60,
        "annual_energy": 150,  # pumping cost
        "lifetime": 75,
        "capacity_m3_day": 80000,
        "rebuild_cost": 1000,  # replacement at end of life
    },
    "Hybrid (gravity + pipe)": {
        "capital": 2500,
        "annual_maintenance": 45,
        "annual_energy": 40,
        "lifetime": 200,
        "capacity_m3_day": 65000,
        "rebuild_cost": 500,
    },
}

analysis_period = 500  # years
discount_rates = [0.01, 0.03, 0.05, 0.08]

print("=== Aqueduct vs Pipeline: Cost-Benefit Analysis ===")
print(f"Analysis period: {analysis_period} years\\n")

# Annualised cost comparison
print("Annualised Cost (capital + operating) at various discount rates:")
print(f"{'System':<25}" + "".join(f"{'r='+str(int(r*100))+'%':>10}" for r in discount_rates))
print("-" * 65)

for name, sys in systems.items():
    row = f"{name:<25}"
    for r in discount_rates:
        # Total cost over analysis period
        cash_flows = np.zeros(analysis_period)
        cash_flows[0] = sys["capital"]

        for year in range(analysis_period):
            cash_flows[year] += sys["annual_maintenance"] + sys["annual_energy"]
            # Rebuilds for shorter-lived systems
            if sys["lifetime"] > 0 and year > 0 and year % sys["lifetime"] == 0:
                cash_flows[year] += sys["rebuild_cost"]

        total_npv = npv(cash_flows, r)
        annual_equiv = total_npv / analysis_period
        row += f"{annual_equiv:>10.1f}"
    print(row)

# Cost per m³ delivered
print(f"\\n=== Cost per 1000 m³ Delivered (at 3% discount rate) ===")
r = 0.03
for name, sys in systems.items():
    cash_flows = np.zeros(analysis_period)
    cash_flows[0] = sys["capital"]
    for year in range(analysis_period):
        cash_flows[year] += sys["annual_maintenance"] + sys["annual_energy"]
        if sys["lifetime"] > 0 and year > 0 and year % sys["lifetime"] == 0:
            cash_flows[year] += sys["rebuild_cost"]

    total_npv_cost = npv(cash_flows, r)
    total_water = sys["capacity_m3_day"] * 365 * analysis_period / 1000  # thousand m³
    cost_per_1000m3 = total_npv_cost / total_water * 1e6
    print(f"  {name:<25} NPV: {total_npv_cost:>8.0f}  Cost/1000m³: {cost_per_1000m3:>6.2f}")

# Crossover analysis
print(f"\\n=== Break-Even Analysis ===")
print("Year when aqueduct becomes cheaper than pipeline (cumulative cost):")
for r in [0.01, 0.03, 0.05]:
    aq_cumul = 5000
    pipe_cumul = 1200
    crossover = None
    for year in range(1, analysis_period + 1):
        aq_cumul += 30 / (1+r)**year
        pipe_cumul += (60 + 150) / (1+r)**year
        if year % 75 == 0:
            pipe_cumul += 1000 / (1+r)**year
        if aq_cumul < pipe_cumul and crossover is None:
            crossover = year
    result = f"year {crossover}" if crossover else "never"
    print(f"  Discount rate {r*100:.0f}%: {result}")`,
      challenge: 'Add a carbon cost: pipeline pumps consume electricity, producing CO2. At a carbon price of 50 units per tonne of CO2, how does the comparison change? Gravity aqueducts have zero operational carbon. This is why some modern engineers are revisiting gravity-fed water systems — the energy and carbon savings over centuries are enormous.',
      successHint: 'Cost-benefit analysis with NPV is the standard tool for evaluating infrastructure investments: roads, bridges, power plants, water systems. The discount rate debate — how much to value the future — is one of the most important questions in climate economics. A low discount rate says "invest in long-lived infrastructure"; a high rate says "solve today\'s problems cheaply and let the future take care of itself."',
    },
    {
      title: 'Lead pipe toxicology — dose-response modelling',
      concept: `Roman water pipes were often made of lead (plumbum — hence "plumbing"). The question is: **did lead pipes poison the Romans?**

The answer requires **dose-response modelling**: how much lead dissolves into the water, how much do people ingest, and at what dose does harm occur?

Lead dissolves slowly in water according to equilibrium chemistry. The **dissolved lead concentration** depends on water chemistry (pH, mineral content), temperature, and contact time. Hard water (high calcium) forms a protective calcium carbonate layer inside the pipe, dramatically reducing lead dissolution.

The **dose-response relationship** for lead follows a **threshold model** for acute effects and a **linear no-threshold (LNT) model** for chronic effects:

- Acute toxicity: blood lead > 70 μg/dL causes severe symptoms
- Chronic effects: every 1 μg/dL increase in blood lead reduces IQ by ~0.5 points (no safe threshold)

📚 *The dose-response curve relates the amount of exposure (dose) to the severity of effect (response). For most toxins, there's a threshold below which no effect is seen. For lead, modern science says there is NO safe level — any exposure causes some harm.*`,
      analogy: 'Think of sunburn. A little sun exposure causes no visible damage (below threshold). A lot causes painful burns (above threshold). But even small exposures cause invisible DNA damage that accumulates over years (no-threshold effect). Lead works the same way: you might not feel sick, but every microgram is slightly reducing cognitive function.',
      storyConnection: 'Vitruvius (Roman architect, 1st century BC) warned against lead pipes: "Water conducted through earthen pipes is more wholesome than that through lead... lead is found to be harmful." He recommended terracotta pipes instead. Some Roman engineers listened; others used lead for its workability. Modern analysis of Roman skeletal remains shows blood lead levels 20-100× higher than pre-industrial humans.',
      checkQuestion: 'If lead dissolves at 50 μg/L in a pipe, a person drinks 2 L/day, and 10% of ingested lead is absorbed into the blood (5 L volume), what is the steady-state blood lead level?',
      checkAnswer: 'Daily intake: 50 × 2 = 100 μg. Absorbed: 100 × 0.1 = 10 μg/day. At steady state (elimination balances intake), with lead half-life of ~30 days: steady-state = daily_dose × half_life / ln(2) / blood_volume = 10 × 30 / 0.693 / 0.05 = ~8,660 μg/L = ~87 μg/dL. This is above the acute toxicity threshold — severely dangerous.',
      codeIntro: 'Model lead dissolution, ingestion, and dose-response for Roman water consumers.',
      code: `import numpy as np

def lead_dissolution(ph, hardness_mg_L, contact_time_hours, temp_C=15):
    """
    Estimate dissolved lead concentration (μg/L).
    Lower pH = more dissolution. Higher hardness = protective scale.
    """
    # Base dissolution rate (empirical model)
    base_rate = 200 * np.exp(-0.5 * (ph - 5))  # peaks at low pH
    # Hardness protection factor
    protection = 1 / (1 + hardness_mg_L / 100)
    # Time factor (approaches equilibrium)
    time_factor = 1 - np.exp(-contact_time_hours / 4)
    # Temperature factor
    temp_factor = 1 + 0.02 * (temp_C - 15)
    return base_rate * protection * time_factor * temp_factor

def blood_lead_steady_state(water_lead_ug_L, daily_water_L=2.0,
                              absorption_fraction=0.10, half_life_days=30):
    """Steady-state blood lead level (μg/dL)."""
    daily_absorbed = water_lead_ug_L * daily_water_L * absorption_fraction
    # Steady state: intake rate × mean residence time / blood volume
    residence_time = half_life_days / np.log(2)
    blood_volume_dL = 50  # 5 litres = 50 dL
    return daily_absorbed * residence_time / blood_volume_dL

def iq_reduction(blood_lead_ug_dL):
    """IQ points lost (linear no-threshold model)."""
    return blood_lead_ug_dL * 0.5

# Water chemistry scenarios
scenarios = [
    {"name": "Soft mountain spring (pH 6.5)", "ph": 6.5, "hardness": 30,  "contact_hr": 8},
    {"name": "Hard limestone water (pH 7.8)", "ph": 7.8, "hardness": 250, "contact_hr": 8},
    {"name": "Typical Roman supply (pH 7.2)", "ph": 7.2, "hardness": 150, "contact_hr": 6},
    {"name": "Stagnant overnight (pH 7.2)",   "ph": 7.2, "hardness": 150, "contact_hr": 12},
    {"name": "Modern limit comparison",        "ph": 7.5, "hardness": 200, "contact_hr": 1},
]

print("=== Lead Pipe Toxicology Model ===")
print(f"{'Scenario':<36} {'Pb (μg/L)':>10} {'Blood Pb':>10} {'IQ Loss':>8} {'Risk':>10}")
print("-" * 76)

for s in scenarios:
    pb_water = lead_dissolution(s["ph"], s["hardness"], s["contact_hr"])
    pb_blood = blood_lead_steady_state(pb_water)
    iq_loss = iq_reduction(pb_blood)

    if pb_blood > 70:
        risk = "ACUTE"
    elif pb_blood > 25:
        risk = "HIGH"
    elif pb_blood > 10:
        risk = "MODERATE"
    elif pb_blood > 5:
        risk = "LOW"
    else:
        risk = "Minimal"

    print(f"{s['name']:<36} {pb_water:>8.1f} {pb_blood:>8.1f} μg/dL {iq_loss:>6.1f} pts {risk:>10}")

# Population-level impact
print("\\n=== Population Impact on Rome (est. 1 million people) ===")
population = 1_000_000
typical_pb = lead_dissolution(7.2, 150, 6)
typical_blood = blood_lead_steady_state(typical_pb)
typical_iq = iq_reduction(typical_blood)

print(f"Typical water lead: {typical_pb:.0f} μg/L")
print(f"Typical blood lead: {typical_blood:.1f} μg/dL")
print(f"Average IQ reduction: {typical_iq:.1f} points")
print(f"Population with blood Pb > 25 μg/dL (high risk): ~{population * 0.3:,.0f}")

# Vitruvius was right — terracotta comparison
print("\\n=== What If Vitruvius Had Won the Argument? ===")
terracotta_pb = 2.0  # μg/L (ceramic leaches almost no lead)
terra_blood = blood_lead_steady_state(terracotta_pb)
terra_iq = iq_reduction(terra_blood)
print(f"Terracotta pipes: {terracotta_pb} μg/L → blood {terra_blood:.1f} μg/dL → IQ loss {terra_iq:.1f} pts")
print(f"IQ points saved per person: {typical_iq - terra_iq:.1f}")
print(f"Total IQ points saved across Rome: {(typical_iq - terra_iq) * population:,.0f}")`,
      challenge: 'The Flint, Michigan water crisis (2014) occurred when the city switched to a water source with lower hardness — dissolving the protective calcium carbonate scale inside old lead pipes. Model this scenario: start with hard water (hardness 250), then switch to soft water (hardness 50) while keeping the same pipes. How quickly does blood lead rise? This is the same chemistry that affected Romans with soft mountain water.',
      successHint: 'Dose-response modelling is the foundation of toxicology, pharmacology, and environmental health. You just applied it to a 2,000-year-old problem that is still relevant today — the Flint water crisis proved that lead pipe toxicology is not ancient history. Understanding dose-response curves is essential for evaluating any chemical risk, from medications to pollutants.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling and network analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers network flow, gradient optimisation, sediment transport, cost-benefit analysis, and lead toxicology.
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
