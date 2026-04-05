import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PanamaCanalLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Buoyancy — why ships float and how locks lift them',
      concept: `A steel nail sinks. A steel ship floats. The difference is **shape** — the ship is a hollow shell that encloses a large volume of air, making its average density less than water.

**Archimedes' principle** explains exactly how much the ship sinks: it sinks until the **weight of water it displaces** equals its own weight. A 50,000-tonne container ship displaces exactly 50,000 tonnes of seawater.

In a lock chamber, buoyancy does the lifting. As water fills the chamber from above, the water level rises. The ship, floating at the surface, rises with it — effortlessly. No crane, no pulley, no motor. Just water flowing downhill and a ship riding the surface.

In the code below, you'll calculate buoyancy forces, displacement, and the draft (depth below waterline) for ships of different sizes.

📚 *Draft is how deep a ship sits in the water. A loaded cargo ship has a deeper draft than an empty one because it needs to displace more water to support its greater weight.*`,
      analogy: 'Think of a bathtub. When you get in, the water level rises — your body pushes water aside (displaces it). If you weigh 70 kg, you displace exactly 70 litres of water (since 1 litre of water weighs 1 kg). The bathtub "lifts" you by the buoyant force — equal to the weight of displaced water.',
      storyConnection: 'The Panama Canal locks lift ships 26 metres above sea level — the height of Gatun Lake. Each lock chamber holds 100 million litres of water. When a 50,000-tonne container ship enters, the water level in the chamber rises by several centimetres as the ship displaces water. Then more water flows in from the lake above, and ship and water rise together.',
      checkQuestion: 'A boat weighs 500 kg. How many litres of water must it displace to float? (Hint: 1 litre of water weighs 1 kg.)',
      checkAnswer: '500 litres. The boat sinks until it pushes aside 500 kg of water — which occupies 500 litres. This is Archimedes\' principle in action: buoyancy force = weight of displaced fluid = weight of the floating object.',
      codeIntro: 'Calculate displacement, draft, and buoyancy for ships passing through the Panama Canal.',
      code: `import numpy as np

# Archimedes' principle: buoyancy = weight of displaced water

def calculate_draft(mass_tonnes, length_m, beam_m, block_coeff=0.8):
    """
    Calculate how deep a ship sits in the water.

    Draft = mass / (length × beam × block_coefficient × water_density)
    Block coefficient accounts for the hull shape (not a perfect box).
    """
    water_density = 1025  # kg/m³ (seawater)
    mass_kg = mass_tonnes * 1000
    draft = mass_kg / (length_m * beam_m * block_coeff * water_density)
    displacement_m3 = mass_kg / water_density
    return draft, displacement_m3

# Ships that transit the Panama Canal
ships = [
    {"name": "Small cargo ship",   "mass": 5000,   "length": 100, "beam": 15},
    {"name": "Panamax container",  "mass": 52500,  "length": 294, "beam": 32},
    {"name": "New Panamax",        "mass": 120000, "length": 366, "beam": 49},
    {"name": "Columbus's Santa María", "mass": 100, "length": 19,  "beam": 5.7},
    {"name": "Zheng He treasure ship", "mass": 3000, "length": 120, "beam": 50},
]

print("=== Panama Canal Ship Calculator ===")
print(f"{'Ship':<28} {'Mass (t)':>9} {'Draft (m)':>10} {'Displaced m³':>13}")
print("-" * 62)

for ship in ships:
    draft, disp = calculate_draft(ship["mass"], ship["length"], ship["beam"])
    print(f"{ship['name']:<28} {ship['mass']:>7,} {draft:>8.1f} {disp:>11,.0f}")

print()
print("Panamax ships are designed to JUST fit through the original")
print("Panama Canal locks (max beam 32.3 m, max draft 12.0 m).")
print("New Panamax locks (opened 2016) allow ships up to 49 m beam.")

# Lock chamber calculation
lock_length = 305  # metres
lock_width = 33.5  # metres
lock_depth = 12.8  # metres
lock_volume = lock_length * lock_width * lock_depth

print(f"\\nLock chamber volume: {lock_volume:,.0f} m³ ({lock_volume/1000:,.0f} thousand m³)")
print(f"That's {lock_volume/1000:.0f} million litres of water per fill!")`,
      challenge: 'A loaded container ship weighs 52,500 tonnes. After unloading 20,000 tonnes of cargo at the Pacific end, how much does its draft change? Calculate both drafts and the difference. This is why ships sit higher after unloading — they\'re displacing less water.',
      successHint: 'You just applied Archimedes\' principle — one of the oldest and most useful principles in physics (250 BCE). Every ship, submarine, hot air balloon, and fish uses the same physics: the buoyant force equals the weight of fluid displaced.',
    },
    {
      title: 'Torricelli\'s law — how water flows through a valve',
      concept: `When you open the drain plug in a full bathtub, water rushes out quickly at first, then slows as the tub empties. **Torricelli's law** explains why: the velocity of water flowing out of an opening depends on the **height of water above** it.

**v = √(2gh)**

Where v is the flow velocity (m/s), g is gravity (9.81 m/s²), and h is the height of water above the opening (m).

This means: deeper water → faster flow. As the water level drops, the flow slows. The lock chambers in the Panama Canal exploit this: opening the bottom valve lets water rush in from the higher lake, driven by the 26-metre height difference. No pumps — just gravity and Torricelli's law.

📚 *Torricelli derived this in 1643 by recognizing that water falling from height h reaches the same speed whether it falls freely or flows through a hole. The kinetic energy at the bottom equals the potential energy at the top.*`,
      analogy: 'Imagine two water towers — one 10 metres tall, one 30 metres tall. Both have a tap at the bottom. Which tap has higher water pressure? The 30-metre tower — water pressure increases with height. This is why water towers are tall, and why the Panama Canal locks need Gatun Lake to be 26 metres above sea level.',
      storyConnection: 'The Panama Canal locks fill and drain through **culverts** — tunnels in the lock walls, controlled by valves at the bottom. When the valve opens, water from the higher side rushes through at velocities determined by Torricelli\'s law. Filling one lock chamber takes about 8 minutes — 100 million litres flowing through nothing but gravity.',
      checkQuestion: 'How fast does water flow out of an opening 10 metres below the surface?',
      checkAnswer: 'v = √(2 × 9.81 × 10) = √(196.2) = 14.0 m/s — about 50 km/h. That\'s the speed of a car on a city street, driven by nothing but the weight of 10 metres of water above. This is why high dams are so powerful — and so dangerous if they fail.',
      codeIntro: 'Simulate water flowing through a lock valve using Torricelli\'s law — track water level, flow rate, and fill time.',
      code: `import numpy as np

def simulate_lock_fill(lock_length, lock_width, target_height,
                       valve_area, lake_height, dt=1.0):
    """
    Simulate filling a lock chamber from a lake above.
    Uses Torricelli's law: v = sqrt(2g × height_difference)
    """
    g = 9.81
    water_height = 0  # start empty (at sea level)
    time = 0
    history = [(0, 0, 0)]

    while water_height < target_height - 0.01:
        # Height difference between lake and current lock level
        h_diff = lake_height - water_height
        if h_diff <= 0:
            break

        # Flow velocity (Torricelli's law)
        velocity = np.sqrt(2 * g * h_diff)

        # Volume flow rate = velocity × valve area
        flow_rate = velocity * valve_area  # m³/s

        # Volume entering in this time step
        volume_in = flow_rate * dt  # m³

        # Height rise in lock chamber
        lock_area = lock_length * lock_width
        height_rise = volume_in / lock_area

        water_height = min(water_height + height_rise, target_height)
        time += dt

        history.append((time, water_height, flow_rate))

    return history

# Simulate filling one Gatun Lock chamber
history = simulate_lock_fill(
    lock_length=305,   # metres
    lock_width=33.5,   # metres
    target_height=8.5, # metres (one lock lift)
    valve_area=5.0,    # m² (total valve opening area)
    lake_height=8.5,   # metres above lock floor
)

print("=== Lock Chamber Filling Simulation ===")
print(f"{'Time (min)':<12} {'Water Level (m)':>16} {'Flow Rate (m³/s)':>18}")
print("-" * 48)

for t, h, q in history:
    if t % 60 < 1 or t == history[-1][0]:  # every minute
        print(f"{t/60:>10.1f} {h:>14.2f} {q:>16.1f}")

total_time_min = history[-1][0] / 60
total_volume = 305 * 33.5 * 8.5
print(f"\\nFill time: {total_time_min:.1f} minutes")
print(f"Total volume: {total_volume:,.0f} m³ ({total_volume/1000:.0f} thousand m³)")
print(f"Note how flow rate DECREASES as the lock fills —")
print(f"the height difference shrinks, so Torricelli's velocity drops.")`,
      challenge: 'Double the valve area from 5 m² to 10 m². How much faster does the lock fill? (Not twice as fast — because the flow also depends on height difference, which changes the same way.) This shows why the canal engineers had to balance valve size against the force of water slamming against the lock gates.',
      successHint: 'Torricelli\'s law connects gravitational potential energy to fluid velocity — it\'s the fluid equivalent of dropping a ball from a height. The same equation governs dam spillways, fire hydrant pressure, blood flow in arteries, and the exit velocity of rocket exhaust from nozzles.',
    },
    {
      title: 'The SIR model — how Colonel Gorgas defeated yellow fever',
      concept: `The French canal attempt killed **20,000 workers** from malaria and yellow fever. The American attempt succeeded partly because Colonel William Gorgas applied **epidemiological thinking** to eliminate the mosquito vector.

We can model the epidemic using the **SIR model** — dividing the population into **Susceptible** (can get sick), **Infected** (currently sick), and **Recovered** (immune or dead).

The model is governed by two rates:
- **β** (transmission rate): how fast the disease spreads
- **γ** (recovery rate): how fast people recover or die

The key number is **R₀ = β/γ** — the average number of new infections per case. If R₀ > 1, the epidemic grows. If R₀ < 1, it dies out.

Gorgas's environmental measures (draining swamps, oiling puddles, screening windows) reduced β — the transmission rate — by eliminating mosquito breeding sites. He drove R₀ below 1 without drugs or vaccines.

📚 *The SIR model was formalized by Kermack and McKendrick in 1927 — but Gorgas applied the same logic empirically in 1904, 23 years earlier.*`,
      analogy: 'Imagine a forest fire. R₀ is like the wind speed — strong wind (high R₀) means each burning tree ignites many neighbours. Gorgas\'s approach was not to put out each burning tree (cure each patient), but to create firebreaks (eliminate mosquito habitat) so the fire couldn\'t spread. No wind, no spread.',
      storyConnection: 'The French hospitals unknowingly bred mosquitoes by placing water dishes under beds and planting flowers. Gorgas reversed this: drain standing water, oil pond surfaces, screen windows. Yellow fever was eliminated in 2 years. Malaria dropped 90%. The disease death rate fell from catastrophic to manageable.',
      checkQuestion: 'If R₀ for yellow fever via mosquitoes is 4.0, and Gorgas eliminates 80% of mosquitoes, what is the new effective R₀?',
      checkAnswer: 'New R₀ = 4.0 × 0.20 = 0.8. Since 0.8 < 1, the epidemic will die out. Gorgas didn\'t need to kill ALL mosquitoes — just enough to push R₀ below 1. This is the mathematical basis for vector control.',
      codeIntro: 'Simulate the yellow fever epidemic with and without Gorgas\'s mosquito control measures.',
      code: `import numpy as np

def sir_model(population, beta, gamma, I0, days):
    """
    SIR epidemic model.
    S → I at rate β×S×I/N
    I → R at rate γ×I
    """
    S = population - I0
    I = I0
    R = 0
    N = population
    history = {"day": [0], "S": [S], "I": [I], "R": [R]}

    for day in range(1, days + 1):
        new_infections = beta * S * I / N
        new_recoveries = gamma * I

        S -= new_infections
        I += new_infections - new_recoveries
        R += new_recoveries

        S = max(S, 0)
        I = max(I, 0)

        history["day"].append(day)
        history["S"].append(S)
        history["I"].append(I)
        history["R"].append(R)

    return history

population = 30000  # canal workers
I0 = 5              # initial infected
days = 365

# Scenario 1: No mosquito control (French era)
R0_french = 4.0
gamma = 1/7  # 7-day illness
beta_french = R0_french * gamma

# Scenario 2: Gorgas's mosquito control
R0_gorgas = 0.6  # 85% mosquito reduction
beta_gorgas = R0_gorgas * gamma

print("=== Yellow Fever Epidemic Simulation ===")
print(f"Population: {population:,} | Initial infected: {I0}")
print(f"R₀ (French): {R0_french} | R₀ (Gorgas): {R0_gorgas}")
print()

for label, beta, R0 in [("French era (no control)", beta_french, R0_french),
                         ("Gorgas era (mosquito control)", beta_gorgas, R0_gorgas)]:
    h = sir_model(population, beta, gamma, I0, days)
    peak_infected = max(h["I"])
    peak_day = h["I"].index(peak_infected)
    total_infected = h["R"][-1]
    death_rate = 0.20  # 20% case fatality for yellow fever
    deaths = total_infected * death_rate

    print(f"{label}:")
    print(f"  R₀ = {R0}")
    print(f"  Peak infected: {peak_infected:,.0f} (day {peak_day})")
    print(f"  Total infected: {total_infected:,.0f} ({total_infected/population*100:.0f}%)")
    print(f"  Estimated deaths: {deaths:,.0f}")
    print()

print("Gorgas didn't cure yellow fever. He made it unable to spread.")
print("By eliminating 85% of mosquitoes, he pushed R₀ below 1.")
print("The epidemic collapsed on its own — no drugs, no vaccine.")`,
      challenge: 'What percentage of mosquitoes must Gorgas eliminate to push R₀ from 4.0 to exactly 1.0? (Answer: 75%. At 75% reduction, R₀ = 4.0 × 0.25 = 1.0 — the tipping point.) Try simulating 70% vs 80% reduction. How sensitive is the outcome to this 10% difference?',
      successHint: 'You just modeled an epidemic and showed that environmental control (reducing the vector) can eliminate a disease without any medical intervention. This is the same approach used against malaria today — bed nets, insecticide-treated walls, and drainage reduce mosquito transmission, driving R₀ below 1.',
    },
    {
      title: 'Pressure and depth — why the locks work without pumps',
      concept: `The Panama Canal locks are filled and drained by **gravity alone** — no pumps. This works because of a fundamental relationship between depth and pressure:

**P = ρ × g × h**

Where P is pressure (pascals), ρ is water density (1000 kg/m³), g is gravity (9.81 m/s²), and h is the depth below the surface (metres).

At the bottom of a 26-metre-deep lake: P = 1000 × 9.81 × 26 = **255,060 Pa ≈ 2.5 atmospheres**. This pressure pushes water through the culverts (tunnels) in the lock walls when the valve opens. The deeper the lake, the greater the pressure, the faster the fill.

The beauty is that this pressure is **free** — it's provided by gravity acting on the water. The lake is refilled by rain, which is evaporated by the Sun. The entire lock system runs on solar energy, stored as the gravitational potential energy of elevated water.

📚 *Hydrostatic pressure increases linearly with depth: 10 metres of water ≈ 1 atmosphere of pressure. This is why your ears hurt when you dive deep and why submarine hulls must be thick.*`,
      analogy: 'Stack 26 textbooks on your hand. That\'s about 26 kg, pressing down on your palm. The weight of those books creates pressure — just as the weight of 26 metres of water creates pressure at the bottom of Gatun Lake. More books = more pressure. More water = more pressure. It\'s the same physics.',
      storyConnection: 'The lock system\'s genius is that NO energy input is needed to move ships. The sun evaporates ocean water, rain fills the lake, and gravity pulls the lake water down through the lock chambers. Each transit uses about 200 million litres of lake water, which drains to sea level. The sun replenishes the lake. The cycle is solar-powered.',
      checkQuestion: 'How much pressure does a diver experience at 30 metres depth in the ocean?',
      checkAnswer: 'P = 1025 × 9.81 × 30 = 301,658 Pa ≈ 3 atm. Plus 1 atm from the atmosphere above the water, the total is about 4 atm — four times the pressure at the surface. This is why deep-sea divers need pressurized equipment.',
      codeIntro: 'Calculate pressures, forces, and energy in the Panama Canal lock system.',
      code: `import numpy as np

def hydrostatic_pressure(depth_m, density=1000, g=9.81):
    """Pressure at given depth: P = ρgh (Pa)"""
    return density * g * depth_m

def pressure_to_atm(pressure_pa):
    """Convert pascals to atmospheres"""
    return pressure_pa / 101325

# Pressure at different levels in the canal system
print("=== Hydrostatic Pressure in the Canal System ===")
locations = [
    ("Sea level (lock floor)", 0),
    ("First lock filled (8.5m)", 8.5),
    ("Second lock (17m)", 17),
    ("Gatun Lake (26m)", 26),
    ("Lake bottom (deepest, 27m)", 27),
]

for name, depth in locations:
    p = hydrostatic_pressure(depth)
    print(f"{name:<35} {p/1000:>7.1f} kPa ({pressure_to_atm(p):>4.2f} atm)")

# Force on lock gates
print("\\n=== Force on Lock Gates ===")
gate_width = 33.5  # metres
gate_heights = [8.5, 17, 26]  # water height against the gate

for h in gate_heights:
    # Average pressure on a rectangular gate = ρg × (h/2)
    avg_pressure = hydrostatic_pressure(h / 2)
    # Total force = average pressure × gate area
    gate_area = gate_width * h
    force = avg_pressure * gate_area
    force_tonnes = force / (1000 * 9.81)
    print(f"Water height {h:>4.1f}m: Force = {force/1e6:.1f} MN ({force_tonnes:,.0f} tonnes-force)")

# Energy calculation: how much gravitational PE does each transit use?
print("\\n=== Energy Per Transit ===")
lake_height = 26  # metres above sea level
transit_volume = 200_000  # m³ (approximate water used per transit)
water_mass = transit_volume * 1000  # kg
PE = water_mass * 9.81 * lake_height  # joules
PE_kwh = PE / 3.6e6

print(f"Water used per transit: {transit_volume:,} m³")
print(f"Mass: {water_mass/1e6:.0f} million kg")
print(f"Gravitational PE released: {PE/1e9:.1f} GJ = {PE_kwh:,.0f} kWh")
print(f"That's enough energy to power {PE_kwh/30:.0f} homes for a day!")
print(f"And it's FREE — provided by the Sun evaporating water and")
print(f"gravity pulling it back down through the locks.")`,
      challenge: 'Calculate the total energy the canal "uses" per year (14,000 transits × energy per transit). Compare this to a typical power plant\'s annual output (~5 billion kWh). The canal moves enormous amounts of energy — all from gravity.',
      successHint: 'You connected hydrostatic pressure, force on surfaces, and gravitational potential energy — three of the most fundamental concepts in fluid mechanics. The Panama Canal is a textbook demonstration of all three, operating at massive scale on nothing but solar-gravitational energy.',
    },
    {
      title: 'The Culebra Cut — excavation volumes and earthmoving',
      concept: `The most difficult part of the canal was the **Culebra Cut** (now Gaillard Cut) — an 12.6 km channel cut through the Continental Divide. At its deepest, the builders excavated through **87 metres** of rock and soil.

The total excavation for the entire canal was approximately **205 million cubic metres** of earth and rock — roughly equivalent to digging a 1-metre-deep trench around the entire Earth.

Calculating excavation volumes requires **cross-sectional area × length**. But the canal isn't a simple rectangle — it's a trapezoidal channel with sloped sides (to prevent landslides) and varying depth. The calculation uses integration: divide the channel into thin slices, calculate each slice's area, and sum them up.

📚 *Integration is the mathematical operation of adding up infinitely many infinitely thin slices — the inverse of differentiation. It's how you calculate volumes, areas, and work for shapes that aren't simple rectangles.*`,
      analogy: 'Imagine slicing a loaf of bread. Each slice is thin, and you can easily calculate its area. Multiply each slice\'s area by its thickness and add up all the slices — you get the total volume of the loaf. Integration does the same thing, but with infinitely thin slices for perfect accuracy.',
      storyConnection: 'The French plan required excavating 120 million m³ for a sea-level canal (cutting 110 m deep). The American lock plan required only about 80 million m³ for the Culebra Cut (cutting about 87 m at the deepest). This difference — 40 million m³ less digging — is what made the American plan feasible.',
      checkQuestion: 'A channel is 10 km long, 30 m wide at the top, and 20 m wide at the bottom (trapezoidal), and 15 m deep. What is the excavation volume?',
      checkAnswer: 'Cross-sectional area of a trapezoid = (top + bottom) / 2 × height = (30 + 20) / 2 × 15 = 375 m². Volume = 375 × 10,000 = 3,750,000 m³ = 3.75 million m³.',
      codeIntro: 'Calculate the excavation volume of the Culebra Cut from elevation profile data.',
      code: `import numpy as np

def channel_volume(length_km, top_width, bottom_width, depth, slope_angle=45):
    """
    Calculate excavation volume for a trapezoidal channel.
    Includes side slopes to prevent landslides.
    """
    # Cross-sectional area (trapezoid)
    area = (top_width + bottom_width) / 2 * depth
    volume = area * length_km * 1000  # length in metres
    return volume

# Culebra Cut profile (simplified)
# In reality, depth varies along the length
sections = [
    {"name": "North approach", "length_km": 2.5, "depth": 20, "top_w": 200, "bot_w": 100},
    {"name": "Gold Hill (deepest)", "length_km": 1.5, "depth": 87, "top_w": 300, "bot_w": 100},
    {"name": "Central section", "length_km": 4.0, "depth": 50, "top_w": 250, "bot_w": 100},
    {"name": "Contractors Hill", "length_km": 2.0, "depth": 65, "top_w": 280, "bot_w": 100},
    {"name": "South approach", "length_km": 2.6, "depth": 25, "top_w": 210, "bot_w": 100},
]

print("=== Culebra Cut Excavation Calculator ===")
print(f"{'Section':<24} {'Length':>7} {'Depth':>6} {'Volume (M m³)':>14}")
print("-" * 53)

total_volume = 0
for s in sections:
    vol = channel_volume(s["length_km"], s["top_w"], s["bot_w"], s["depth"])
    total_volume += vol
    print(f"{s['name']:<24} {s['length_km']:>5.1f}km {s['depth']:>4.0f}m {vol/1e6:>12.1f}")

print(f"{'TOTAL':<24} {sum(s['length_km'] for s in sections):>5.1f}km {'':>6} {total_volume/1e6:>12.1f}")

# Put in perspective
print(f"\\nTotal excavation: {total_volume/1e6:.0f} million m³")
print(f"That's {total_volume / (1 * 1 * 40075e3):.0f}× a 1m-deep trench around Earth")

# Time and workforce
steam_shovels = 100  # Bucyrus steam shovels
capacity_per_shovel = 500  # m³ per day
daily_output = steam_shovels * capacity_per_shovel
years_needed = total_volume / daily_output / 300  # 300 work days/year
print(f"\\nWith {steam_shovels} steam shovels at {capacity_per_shovel} m³/day each:")
print(f"Daily output: {daily_output:,} m³")
print(f"Time needed: {years_needed:.1f} years")

# French vs American comparison
print("\\n=== French vs American Plan ===")
french_vol = 120e6  # sea-level plan
american_vol = total_volume
print(f"French (sea-level): {french_vol/1e6:.0f} million m³")
print(f"American (locks):   {american_vol/1e6:.0f} million m³")
print(f"Savings: {(french_vol - american_vol)/1e6:.0f} million m³ ({(french_vol - american_vol)/french_vol*100:.0f}%)")`,
      challenge: 'The Culebra Cut experienced massive landslides during construction — the sides would collapse, refilling the channel. If each metre of depth requires the top width to be 2.5× the depth (to prevent landslides), how does this change the excavation volume for the 87 m deep section? Landslides were the biggest engineering problem during construction.',
      successHint: 'You calculated excavation volumes using trapezoidal cross-sections — the same method civil engineers use for canals, tunnels, roads, and foundations. The key insight: volume = sum of (cross-section × thickness) for each slice. This is numerical integration.',
    },
    {
      title: 'Transit time — modelling a full ship passage',
      concept: `A complete Panama Canal transit takes **8-10 hours**. The ship passes through three ascending locks (Gatun), crosses Gatun Lake (about 33 km), passes through the Culebra Cut (12.6 km), and descends through three locks (Pedro Miguel + Miraflores) to the Pacific.

Each step takes a different amount of time:
- Lock filling: ~8 minutes per chamber
- Ship entering/exiting lock: ~20 minutes
- Lake crossing: speed-limited to 6 knots (11 km/h) to prevent wake damage
- Culebra Cut: speed-limited to 8 knots (15 km/h)

Modelling the total transit requires adding up the time for each segment — a **sequential process** where each step must complete before the next begins.

📚 *A knot is one nautical mile per hour. A nautical mile = 1.852 km. Ships use knots because one nautical mile equals one minute of latitude — useful for navigation.*`,
      analogy: 'Think of driving through a city with traffic lights, speed limits, and toll booths. Your total trip time isn\'t just distance ÷ speed — it includes waiting at lights (lock filling), slowing through school zones (Culebra Cut speed limit), and stopping at toll booths (entering/exiting locks). The transit model accounts for all of these.',
      storyConnection: 'The Panama Canal handles about 14,000 transits per year — roughly 38 per day. Each transit uses 200 million litres of freshwater from Gatun Lake. During dry seasons, water levels drop and the canal authority restricts the number of transits to conserve water. Managing throughput is as much a water management problem as a shipping problem.',
      checkQuestion: 'A ship crosses 33 km of Gatun Lake at 6 knots (11.1 km/h). How long does the lake crossing take?',
      checkAnswer: '33 / 11.1 = 2.97 hours ≈ 3 hours. Add the lock times and Culebra Cut, and you get the 8-10 hour total transit time.',
      codeIntro: 'Simulate a complete Panama Canal transit — calculate time for each segment and total.',
      code: `import numpy as np

def knots_to_kmh(knots):
    return knots * 1.852

def transit_time(ship_name, ship_beam, ship_draft):
    """Simulate a full Panama Canal transit."""

    segments = [
        {"name": "Approach (Atlantic)", "type": "sail",
         "distance_km": 8, "speed_knots": 8},
        {"name": "Gatun Locks (3 chambers)", "type": "locks",
         "n_chambers": 3, "fill_min": 8, "transit_min": 20},
        {"name": "Gatun Lake crossing", "type": "sail",
         "distance_km": 33, "speed_knots": 6},
        {"name": "Culebra Cut", "type": "sail",
         "distance_km": 12.6, "speed_knots": 6},
        {"name": "Pedro Miguel Lock (1 chamber)", "type": "locks",
         "n_chambers": 1, "fill_min": 8, "transit_min": 20},
        {"name": "Miraflores Lake", "type": "sail",
         "distance_km": 1.5, "speed_knots": 5},
        {"name": "Miraflores Locks (2 chambers)", "type": "locks",
         "n_chambers": 2, "fill_min": 8, "transit_min": 20},
        {"name": "Approach (Pacific)", "type": "sail",
         "distance_km": 5, "speed_knots": 8},
    ]

    total_minutes = 0
    results = []

    for seg in segments:
        if seg["type"] == "sail":
            speed_kmh = knots_to_kmh(seg["speed_knots"])
            time_min = seg["distance_km"] / speed_kmh * 60
        else:  # locks
            time_min = seg["n_chambers"] * (seg["fill_min"] + seg["transit_min"])

        total_minutes += time_min
        results.append({"name": seg["name"], "time_min": time_min})

    return results, total_minutes

# Simulate transit
results, total = transit_time("Panamax Container Ship", 32, 12)

print("=== Panama Canal Transit Simulation ===")
print(f"Ship: Panamax Container Ship (32m beam)\\n")

print(f"{'Segment':<35} {'Time (min)':>10} {'Time (hr)':>10}")
print("-" * 57)

cumulative = 0
for r in results:
    cumulative += r["time_min"]
    print(f"{r['name']:<35} {r['time_min']:>8.0f} {r['time_min']/60:>8.1f}")

print("-" * 57)
print(f"{'TOTAL TRANSIT TIME':<35} {total:>8.0f} {total/60:>8.1f}")
print(f"\\nThat's {total/60:.1f} hours to cross 82 km of canal.")
print(f"Without the canal: 22,500 km around Cape Horn = ~30 days.")
print(f"Time saved: ~{30 - total/60/24:.0f} days per voyage!")

# Throughput
print("\\n=== Canal Throughput ===")
for hours_per_day in [12, 18, 24]:
    transits = hours_per_day * 60 / total
    print(f"{hours_per_day}h operation: {transits:.1f} transits/day "
          f"({transits * 365:.0f}/year)")`,
      challenge: 'The new Neopanamax locks (opened 2016) have bigger chambers — 427m × 55m × 18m — but take 15 minutes to fill instead of 8 (because they\'re larger). Modify the simulation for a Neopanamax transit. Is the total transit time longer or shorter? (The locks are slower, but the ship can carry 3× more cargo — making each transit more efficient.)',
      successHint: 'You modelled a complex sequential process — the same analytical approach used for factory production lines, airport runway scheduling, hospital patient flow, and software build pipelines. Breaking a complex system into segments, timing each, and finding the bottleneck is universal.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Fluid dynamics and epidemiology through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model buoyancy, water flow, epidemics, and canal transit times.
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
