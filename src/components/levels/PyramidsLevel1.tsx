import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PyramidsLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The logistics equation — 315 blocks per day for 20 years',
      concept: `The Great Pyramid contains **2.3 million stone blocks**. It was built in approximately **20 years**. Let's do the arithmetic that the foreman Meryre did:

2,300,000 ÷ 20 years ÷ 365 days = **315 blocks per day**

During a 12-hour working day, that's one block placed every **2.3 minutes**. Every single day. For twenty years. No weekends, no holidays, no rain days.

This number — 315 — is what separates fantasy from engineering. The pyramid wasn't built by magic or aliens. It was built by people who could **do the arithmetic** and then organise a workforce to meet the target.

In the code below, you'll build a pyramid logistics calculator: given the pyramid dimensions, block sizes, and workforce parameters, calculate the daily throughput required and the number of workers needed.

📚 *Throughput is the rate at which a system produces output. Manufacturing, logistics, and computing all measure performance in throughput: items per hour, data per second, blocks per day.*`,
      analogy: 'Imagine you need to move 2,300 books from one room to another. Each trip carries 2 books and takes 5 minutes. How many trips? 1,150. How long? 96 hours. How many helpers do you need to finish in 8 hours? 12 people. This is the same calculation — just scaled up by a million.',
      storyConnection: 'Meryre\'s quarry teams at Tura worked in shifts. One team quarried blocks while another hauled them to the river. A third team loaded barges. A fourth unloaded at Giza. A fifth dragged blocks up the ramp. The pipeline ran continuously — every part of the chain producing output simultaneously.',
      checkQuestion: 'If 315 blocks per day is the target and each worker can place 3 blocks per day, how many block-placement workers are needed?',
      checkAnswer: '315 ÷ 3 = 105 workers just for placement. But you also need quarriers, haulers, ramp builders, mortar mixers, surveyors, cooks, and overseers. The total workforce was about 20,000-25,000 at peak.',
      codeIntro: 'Build a pyramid logistics calculator — given dimensions, calculate blocks, workforce, and time.',
      code: `import numpy as np

def pyramid_logistics(base_m, height_m, block_size_m=1.0,
                      block_weight_kg=2500, work_hours=12,
                      years=20, work_days_per_year=350):
    """
    Calculate the logistics of building a pyramid.
    Assumes square base, limestone blocks, manual labour.
    """
    # Volume of a pyramid = (1/3) × base² × height
    volume_m3 = (1/3) * base_m**2 * height_m

    # Number of blocks
    block_vol = block_size_m**3
    total_blocks = int(volume_m3 / block_vol)

    # Total weight
    total_weight_kg = total_blocks * block_weight_kg
    total_weight_tonnes = total_weight_kg / 1000

    # Daily requirement
    total_days = years * work_days_per_year
    blocks_per_day = total_blocks / total_days

    # Blocks per minute during working hours
    blocks_per_minute = blocks_per_day / (work_hours * 60)

    return {
        "volume_m3": volume_m3,
        "total_blocks": total_blocks,
        "total_weight_tonnes": total_weight_tonnes,
        "blocks_per_day": blocks_per_day,
        "minutes_per_block": 1 / blocks_per_minute if blocks_per_minute > 0 else float('inf'),
        "total_days": total_days,
    }

# The Great Pyramid of Khufu
khufu = pyramid_logistics(base_m=230, height_m=146)

print("=== Great Pyramid Logistics ===")
print(f"Base: 230m × 230m | Height: 146m")
print(f"Volume: {khufu['volume_m3']:,.0f} m³")
print(f"Total blocks: {khufu['total_blocks']:,}")
print(f"Total weight: {khufu['total_weight_tonnes']:,.0f} tonnes ({khufu['total_weight_tonnes']/1e6:.1f} million tonnes)")
print(f"Construction time: 20 years ({khufu['total_days']:,} working days)")
print(f"Blocks per day: {khufu['blocks_per_day']:,.0f}")
print(f"Minutes per block: {khufu['minutes_per_block']:.1f}")
print()

# Compare with other pyramids
print("=== Pyramid Comparison ===")
pyramids = [
    ("Khufu (Great Pyramid)", 230, 146, 20),
    ("Khafre", 215, 143, 18),
    ("Menkaure (smallest)", 103, 65, 10),
    ("Step Pyramid (Djoser)", 109, 62, 15),
    ("Red Pyramid (Sneferu)", 220, 105, 12),
]

print(f"{'Name':<28} {'Blocks':>12} {'Per Day':>8} {'Min/Block':>10}")
print("-" * 60)
for name, base, height, years in pyramids:
    stats = pyramid_logistics(base, height, years=years)
    print(f"{name:<28} {stats['total_blocks']:>12,} {stats['blocks_per_day']:>6.0f} {stats['minutes_per_block']:>8.1f}")

# Workforce calculation
print("\
=== Workforce Estimate (Khufu) ===")
blocks_per_day = khufu["blocks_per_day"]

roles = [
    ("Quarry workers", 0.3, 8),    # 30% of blocks, 8 blocks/worker/day
    ("Haulers/draggers", 0.4, 4),   # 40%, 4 blocks/team/day
    ("Ramp workers", 0.2, 6),       # 20%, 6 blocks/worker/day
    ("Masons & placers", 0.1, 3),   # 10%, 3 blocks/worker/day
]

total_workers = 0
for role, fraction, productivity in roles:
    needed = (blocks_per_day * fraction) / productivity
    total_workers += needed
    print(f"  {role:<20} {needed:>6.0f} workers")

print(f"  {'Support (cooks, etc.)':<20} {total_workers * 0.3:>6.0f} workers")
print(f"  {'TOTAL':<20} {total_workers * 1.3:>6.0f} workers")`,
      challenge: 'The Great Pyramid was built in 20 years. What if the pharaoh demanded it in 10 years? Calculate the new daily block rate and workforce size. What practical problems would doubling the speed create? (Hint: you can\'t just double the workers — the ramp becomes a bottleneck.)',
      successHint: 'You just did exactly what the ancient Egyptian engineers did: convert a massive construction goal into daily targets and workforce requirements. This is project management — the same skill used to plan buildings, software projects, and space missions. Start with the end, work backward to daily tasks.',
    },
    {
      title: 'Inclined planes and friction — the physics of ramps',
      concept: `A 2.5-tonne limestone block. A 146-metre-tall pyramid. No cranes, no pulleys, no wheels. How do you move the block up?

A **ramp** (inclined plane). It's one of the six **simple machines**: devices that trade distance for force. A ramp doesn't reduce the total **work** (energy) needed — you still raise 2,500 kg by 146 metres. But it lets you apply a **smaller force** over a **longer distance**.

The force needed to push a block up a ramp: **F = mg × sin(θ) + mg × cos(θ) × μ**

Where θ is the ramp angle, m is the mass, g is gravity, and μ is the friction coefficient. The first term is the component of gravity along the ramp. The second is friction.

At 7% grade (the steepest a team of men can reasonably pull a heavy load), the ramp must be about **14 metres long for every 1 metre of height gain**.

📚 *Work = Force × Distance. A ramp reduces force but increases distance, keeping work constant. This is the fundamental trade-off of all simple machines.*`,
      analogy: 'Carry a heavy suitcase up a flight of stairs: hard, steep, short distance. Or roll it up a wheelchair ramp: easy, gentle, long distance. Same height gained, same work done. The ramp is the inclined plane — trading distance for force.',
      storyConnection: 'The internal ramp theory (Jean-Pierre Houdin, 2007) proposes that the Great Pyramid\'s blocks were hauled up a spiral ramp INSIDE the pyramid — 1.6 km of ramp spiraling upward. This would have been invisible from outside, which explains why no archaeological evidence of massive external ramps has been found.',
      checkQuestion: 'A ramp rises 1 metre over 14 metres of length. What is its grade as a percentage?',
      checkAnswer: '1/14 × 100 = 7.1%. This is the maximum grade used by the pyramid builders. For comparison, most wheelchair ramps are 8.3% (1:12), and highway grades rarely exceed 6%.',
      codeIntro: 'Calculate the force needed to drag a stone block up ramps of different angles, with and without wet sand.',
      code: `import numpy as np

def ramp_force(mass_kg, angle_deg, friction_coeff):
    """
    Force needed to push a block up a ramp.
    F = mg × sin(θ) + mg × cos(θ) × μ
    """
    theta = np.radians(angle_deg)
    g = 9.81
    gravity_component = mass_kg * g * np.sin(theta)
    friction_component = mass_kg * g * np.cos(theta) * friction_coeff
    return gravity_component + friction_component

def workers_needed(force_N, force_per_worker=500):
    """Each worker can sustain about 500 N of pulling force."""
    return int(np.ceil(force_N / force_per_worker))

block_mass = 2500  # kg (average block)

print("=== Ramp Physics Calculator ===")
print(f"Block mass: {block_mass} kg ({block_mass/1000:.1f} tonnes)")

# Compare dry sand vs wet sand
print(f"\
{'Grade':>6} {'Angle':>7} {'Force (dry)':>12} {'Workers (dry)':>14} "
      f"{'Force (wet)':>12} {'Workers (wet)':>14}")
print("-" * 67)

for grade_pct in [3, 5, 7, 10, 15, 20]:
    angle = np.degrees(np.arctan(grade_pct / 100))
    ramp_length = 1 / np.sin(np.radians(angle))  # per metre of height

    # Dry sand: μ ≈ 0.5
    f_dry = ramp_force(block_mass, angle, 0.5)
    w_dry = workers_needed(f_dry)

    # Wet sand: μ ≈ 0.25 (50% reduction)
    f_wet = ramp_force(block_mass, angle, 0.25)
    w_wet = workers_needed(f_wet)

    print(f"{grade_pct:>5}% {angle:>5.1f}° {f_dry:>10,.0f} N {w_dry:>12} "
          f"{f_wet:>10,.0f} N {w_wet:>12}")

# Ramp length for the full pyramid height
print(f"\
=== Ramp Length for Full Pyramid (146m height) ===")
for grade_pct in [5, 7, 10]:
    ramp_length = 146 / (grade_pct / 100)
    print(f"  {grade_pct}% grade: ramp length = {ramp_length:,.0f} m ({ramp_length/1000:.1f} km)")

print(f"\
Wet sand savings: {(1 - 0.25/0.5) * 100:.0f}% reduction in workers needed")
print(f"For 315 blocks/day, that's thousands fewer workers — or")
print(f"the same workers moving blocks 50% faster.")

# Work calculation
print(f"\
=== Total Energy to Build the Pyramid ===")
height = 146  # average height each block is raised (simplified: center of mass at h/4)
avg_height = height / 4  # average block is raised to ~1/4 of total height
total_blocks = 2300000
work_joules = total_blocks * block_mass * 9.81 * avg_height
work_kwh = work_joules / 3.6e6
print(f"Average block height: {avg_height:.0f} m")
print(f"Total work: {work_joules:.2e} joules = {work_kwh:,.0f} kWh")
print(f"Human power output: ~75 watts sustained")
print(f"Worker-hours needed: {work_joules / 75 / 3600:,.0f}")
print(f"With 20,000 workers at 12h/day: {work_joules / 75 / 3600 / 20000 / 12:.0f} days")`,
      challenge: 'The internal ramp theory says blocks were hauled around corners using rotating platforms at each turn. What is the maximum block weight that can turn a 90° corner on a 4-metre-wide ramp? (Hint: the block\'s diagonal must fit the turning radius.) This is the geometric constraint that limits block size in the upper levels.',
      successHint: 'You applied the physics of inclined planes and friction — fundamental concepts used in every construction project, factory conveyor, and logistics system. The key insight: you can\'t change the total work needed, but you CAN change how much force is needed at any moment by choosing the right angle.',
    },
    {
      title: 'The square-cube law — why pyramids are pyramid-shaped',
      concept: `When you double the size of a structure, its **weight** increases 8× (cube of 2) but its **base area** increases only 4× (square of 2). The pressure on the base doubles.

This is the **square-cube law**, and it explains why:
- Elephants have thick legs (proportionally much thicker than ants')
- Tall buildings need wide foundations
- And pyramids are the shape they are

A pyramid is one of the few shapes that naturally handles the square-cube law: each layer is smaller than the one below, so the cumulative weight at any level is always supported by enough area. The stress at the base of a pyramid is remarkably uniform — there are no dangerous stress concentrations.

📚 *The square-cube law was first stated by Galileo in 1638. He used it to explain why you can\'t just scale up an animal — a mouse-sized elephant would collapse under its own weight.*`,
      analogy: 'Build a tower of sugar cubes. Each layer is the same size, so each cube at the bottom supports ALL the cubes above it. The bottom layer feels the most stress. Now build a pyramid of sugar cubes — each layer smaller than the last. The bottom cubes support less weight per cube because the pyramid narrows. This is why pyramids don\'t crush themselves.',
      storyConnection: 'The Egyptians tried other shapes before the pyramid. The Bent Pyramid at Dahshur starts at a 54° angle but suddenly changes to 43° halfway up — the builders realized the original angle was too steep and the base was cracking. They literally bent the pyramid to reduce the weight. The lesson learned led to the true pyramid shape.',
      checkQuestion: 'A cube tower is 10 m tall with a 5 m × 5 m base. Its volume is 250 m³. If you double every dimension to 20 m tall with 10 m × 10 m base, what is the new volume?',
      checkAnswer: 'Volume = 10 × 10 × 20 = 2,000 m³. That\'s 8× the original (2³ = 8). But the base area is only 4× larger (10² vs 5² = 100 vs 25). So the stress on the base (weight/area) has doubled. This is the square-cube law in action.',
      codeIntro: 'Model the stress distribution in a pyramid layer by layer — see how the pyramid shape keeps stress uniform.',
      code: `import numpy as np

def pyramid_stress_profile(base_m, height_m, n_layers=50,
                           density_kg_m3=2500, block_weight_kg=2500):
    """
    Calculate the compressive stress at each layer of a pyramid.
    """
    layer_height = height_m / n_layers
    g = 9.81

    results = []
    cumulative_weight = 0

    for i in range(n_layers):
        h = height_m - (i + 0.5) * layer_height  # height above ground
        fraction = h / height_m

        # Layer dimensions (square pyramid, linear taper)
        side = base_m * (1 - fraction)  # side length at this height
        area = side ** 2

        # Layer volume and weight
        volume = area * layer_height
        weight = volume * density_kg_m3 * g  # newtons
        cumulative_weight += weight

        # Stress at this level
        if area > 0:
            stress_pa = cumulative_weight / area
            stress_mpa = stress_pa / 1e6
        else:
            stress_mpa = 0

        results.append({
            "layer": i + 1,
            "height": h,
            "side": side,
            "area": area,
            "cum_weight_kN": cumulative_weight / 1000,
            "stress_mpa": stress_mpa,
            "blocks": int(volume / (block_weight_kg / density_kg_m3)),
        })

    return results

# Analyze the Great Pyramid
layers = pyramid_stress_profile(230, 146)

print("=== Great Pyramid — Stress Profile ===")
print(f"{'Layer':>6} {'Height':>8} {'Side':>7} {'Weight (kN)':>12} {'Stress (MPa)':>14} {'Blocks':>8}")
print("-" * 57)

for l in layers:
    if l["layer"] % 10 == 0 or l["layer"] == 1 or l["layer"] == 50:
        print(f"{l['layer']:>6} {l['height']:>6.0f}m {l['side']:>5.0f}m "
              f"{l['cum_weight_kN']:>10,.0f} {l['stress_mpa']:>12.2f} {l['blocks']:>8,}")

# Compare with a cube tower of same volume
pyramid_volume = (1/3) * 230**2 * 146
cube_side = pyramid_volume ** (1/3)
cube_height = cube_side  # cube
cube_base_area = cube_side ** 2
cube_weight = pyramid_volume * 2500 * 9.81
cube_base_stress = cube_weight / cube_base_area / 1e6

print(f"\
=== Shape Comparison (same total volume) ===")
pyramid_base_stress = layers[-1]["stress_mpa"]
print(f"Pyramid: base stress = {pyramid_base_stress:.2f} MPa")
print(f"Cube:    base stress = {cube_base_stress:.2f} MPa")
print(f"Ratio:   cube is {cube_base_stress/pyramid_base_stress:.1f}× more stressed")
print(f"\
Limestone compressive strength: ~40 MPa")
print(f"Pyramid base: {pyramid_base_stress:.2f} MPa — {pyramid_base_stress/40*100:.0f}% of limit (SAFE)")
print(f"Cube base:    {cube_base_stress:.2f} MPa — {cube_base_stress/40*100:.0f}% of limit", end="")
print(" (SAFE)" if cube_base_stress < 40 else " (FAILURE!)")

# Blocks per layer (diminishing returns)
print(f"\
=== Blocks Per Layer ===")
total_blocks = sum(l["blocks"] for l in layers)
print(f"Total blocks: {total_blocks:,}")
print(f"Bottom 10 layers: {sum(l['blocks'] for l in layers[-10:]):,} blocks "
      f"({sum(l['blocks'] for l in layers[-10:])/total_blocks*100:.0f}%)")
print(f"Top 10 layers: {sum(l['blocks'] for l in layers[:10]):,} blocks "
      f"({sum(l['blocks'] for l in layers[:10])/total_blocks*100:.0f}%)")
print(f"The bottom 20% of height contains {sum(l['blocks'] for l in layers[-10:])/total_blocks*100:.0f}% of the blocks!")`,
      challenge: 'The Bent Pyramid starts at 54° and changes to 43° halfway up. Model this: calculate stress at the transition point with the original 54° angle. Does it exceed limestone\'s strength? (This is likely why they changed the angle — the builders realized the base was approaching failure.)',
      successHint: 'The square-cube law is one of the most important principles in engineering and biology. It explains why ants can carry 50× their weight but elephants can barely carry their own, why Godzilla is impossible, and why there\'s a maximum size for any structure made of a given material.',
    },
    {
      title: 'Wet sand friction — the 2014 experiment',
      concept: `In 2014, physicists at the University of Amsterdam proved something the Egyptians knew 4,500 years ago: **wetting sand reduces the friction** needed to drag heavy objects across it by about **50%**.

The physics: dry sand grains pile up in front of the sledge like a tiny snowplow. But when sand is moistened to **2-5% water by volume**, **capillary bridges** form between the grains — tiny water bridges held together by surface tension. These bridges lock the grains in place, preventing them from piling up.

The result: the sledge glides over a firm, smooth surface instead of plowing through loose sand. The friction coefficient drops from about **0.5** (dry) to **0.25** (optimally wet).

This discovery was prompted by a painting in the tomb of **Djehutihotep** (circa 1900 BCE) showing workers dragging a statue on a sledge while one man pours water on the sand ahead. The Egyptians drew the answer; it just took modern physicists 3,900 years to understand it.

📚 *Capillary bridges form when a small amount of water fills the contact points between grains. Surface tension holds the bridge together, locking the grains. Too much water, and the surface becomes mud — worse than dry sand.*`,
      analogy: 'Walk on dry beach sand — your feet sink in and it\'s hard to walk. Now walk on the wet sand near the waterline — it\'s firm and easy. That\'s the same effect: water bridges lock the sand grains together, creating a solid surface. The optimal moisture is "damp" — not dry, not muddy.',
      storyConnection: 'The painting in Djehutihotep\'s tomb clearly shows a man pouring water in front of the sledge. Egyptologists dismissed this as a ritual act for decades. The 2014 Amsterdam experiment proved it was practical engineering — the Egyptians were depicting a real technique that halved the required workforce.',
      checkQuestion: 'If wetting sand reduces friction by 50%, and you need 40 workers to drag a block on dry sand, how many do you need on wet sand?',
      checkAnswer: '20 workers. Halving the friction halves the force needed, which halves the workforce. For the entire pyramid (2.3 million blocks), this saved approximately 10,000 workers over 20 years — an enormous resource saving.',
      codeIntro: 'Model the relationship between sand moisture and friction — find the optimal water content.',
      code: `import numpy as np

def friction_coefficient(moisture_pct):
    """
    Model how friction coefficient varies with sand moisture content.
    Optimal at ~3-5% water by volume:
    - Too dry: grains pile up (high friction)
    - Optimal: capillary bridges lock grains (low friction)
    - Too wet: mud (high friction again)
    """
    if moisture_pct <= 0:
        return 0.50  # dry sand

    # Friction decreases sharply from 0% to 4% moisture
    # Then increases again above 8% (becoming mud)
    optimal = 4.0  # optimal moisture %
    dry_friction = 0.50
    wet_friction = 0.24  # minimum friction at optimal moisture
    mud_friction = 0.55  # muddy sand is even worse than dry

    if moisture_pct <= optimal:
        # Decrease from dry to optimal
        fraction = moisture_pct / optimal
        return dry_friction - (dry_friction - wet_friction) * fraction
    else:
        # Increase from optimal toward mud
        excess = (moisture_pct - optimal) / (15 - optimal)
        return wet_friction + (mud_friction - wet_friction) * min(excess, 1.0)

# Calculate friction across moisture range
print("=== Sand Friction vs Moisture Content ===")
print(f"{'Moisture %':>11} {'μ (friction)':>13} {'Force (N)':>10} {'Workers':>8} {'Condition':>12}")
print("-" * 56)

block_mass = 2500  # kg
g = 9.81

for moisture in [0, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20]:
    mu = friction_coefficient(moisture)
    force = block_mass * g * mu
    workers = int(np.ceil(force / 500))  # 500 N per worker
    condition = "Dry" if moisture < 1 else "Damp" if moisture < 3 else "Optimal" if moisture < 6 else "Wet" if moisture < 12 else "Mud"
    bar = "█" * int(mu * 40)
    print(f"{moisture:>9.0f}% {mu:>11.3f} {force:>8,.0f} {workers:>7} {condition:>12} {bar}")

# Workforce savings calculation
dry_workers_per_block = int(np.ceil(block_mass * g * 0.50 / 500))
wet_workers_per_block = int(np.ceil(block_mass * g * 0.24 / 500))
daily_blocks = 315
savings_per_day = (dry_workers_per_block - wet_workers_per_block) * daily_blocks

print(f"\
=== Workforce Savings ===")
print(f"Workers per block (dry): {dry_workers_per_block}")
print(f"Workers per block (wet): {wet_workers_per_block}")
print(f"Savings per block: {dry_workers_per_block - wet_workers_per_block} workers")
print(f"At 315 blocks/day: {savings_per_day:,} fewer worker-assignments per day")

# Water requirements
print(f"\
=== Water Requirements ===")
path_width = 2.5  # metres
path_depth = 0.05  # 5 cm of wet sand
daily_path_length = 315 * 50  # 315 blocks × ~50m average drag distance
water_volume = path_width * path_depth * daily_path_length * 0.04  # 4% moisture
print(f"Daily drag distance: {daily_path_length:,} m")
print(f"Water needed: {water_volume:,.0f} litres/day")
print(f"That's about {water_volume/200:.0f} bathtubs of water per day —")
print(f"easily supplied from the Nile, which was right next to the site.")`,
      challenge: 'On a rainy day, the sand might be at 12-15% moisture — too wet (mud). What should the builders do? (Wait for the sun to dry it to the optimal 3-5%, or mix dry sand into the wet sand to reduce moisture. This is why desert construction often happened in the dry season.)',
      successHint: 'You modeled the physics of friction and capillary forces — the same physics used in soil mechanics, road engineering, and manufacturing. The optimal moisture curve you calculated is used by civil engineers today when compacting soil for foundations. The Egyptians found the same optimum 4,500 years ago.',
    },
    {
      title: 'Astronomical alignment — finding true north from stars',
      concept: `The Great Pyramid is aligned to true north with an error of just **3/60 of a degree**. Modern surveying achieves about 1/60 of a degree with GPS. The Egyptians were almost as accurate — using nothing but **stars and a plumb line**.

The method (proposed by astronomer Kate Spence, 2000): in 2467 BCE, two stars — **Kochab** (Ursa Minor) and **Mizar** (Ursa Major) — were equidistant from the celestial north pole. When both stars were vertically aligned (one directly above the other), a plumb line through them pointed to **true north** on the ground.

The precision depends on two factors: (1) how accurately you can judge when two stars are vertically aligned, and (2) how close the two stars actually are to being equidistant from the pole. In 2467 BCE, this method could achieve an accuracy of about **3 arcminutes** (3/60 of a degree) — matching the pyramid's actual alignment.

📚 *Precession: the Earth\'s axis wobbles slowly over a 26,000-year cycle, changing which stars are near the celestial pole. Polaris is near the pole NOW, but wasn\'t in 2467 BCE. In 12,000 years, Vega will be the "North Star."*`,
      analogy: 'Hold a pendulum (plumb line) in front of your face and look at a distant lamppost. When the pendulum string lines up perfectly with the lamppost, the lamppost is directly ahead of you. The Egyptian surveyors did the same thing, but with two stars instead of a lamppost — and the "ahead" direction was true north.',
      storyConnection: 'Every measurement of the Great Pyramid confirms extraordinary precision: the base is level to within 2.1 cm over 230 metres. The sides are equal in length to within 4.4 cm. The corners are square to within 12 arc-seconds. This precision was achieved with ropes, pegs, and the Pythagorean theorem — a thousand years before Pythagoras.',
      checkQuestion: 'If the Earth\'s axis precesses through a full circle every 26,000 years, how many degrees per year does the pole move?',
      checkAnswer: '360° / 26,000 years ≈ 0.0138° per year. That\'s about 50 arc-seconds — barely measurable. But over centuries, it adds up. The alignment method that worked in 2467 BCE would give different results in 2000 BCE because the stars would have shifted relative to the pole.',
      codeIntro: 'Calculate the positions of pole stars across millennia and simulate the Egyptian alignment method.',
      code: `import numpy as np

def precession_pole(year_bce, epoch_ra=0, epoch_dec=90):
    """
    Simplified model of where the celestial north pole points
    at different times, due to Earth's axial precession.

    Returns the angular offset from the current pole position.
    """
    # Precession rate: ~50.3 arc-seconds per year
    precession_rate = 50.3 / 3600  # degrees per year

    # Years from epoch (J2000 = 0 CE for simplicity)
    years_from_epoch = -year_bce  # negative for BCE
    total_precession = precession_rate * years_from_epoch

    return total_precession % 360

def alignment_accuracy(year_bce):
    """
    Estimate the alignment accuracy achievable using the
    Kochab-Mizar method at a given date.

    Returns accuracy in arcminutes.
    """
    # In ~2467 BCE, the method is most accurate
    # Accuracy degrades as the stars move away from symmetric positions
    optimal_year = 2467
    time_offset = abs(year_bce - optimal_year)

    # Each century of offset adds ~3 arcminutes of error
    base_accuracy = 3  # arcminutes at optimal year
    degradation = time_offset / 100 * 3

    return base_accuracy + degradation

# Pole star throughout history
print("=== Pole Stars Through the Ages ===")
pole_stars = [
    (12000, "Vega", "BCE"),
    (2800, "Thuban", "BCE"),
    (2467, "Between Kochab & Mizar", "BCE (pyramid alignment)"),
    (1, "No bright pole star", "CE"),
    (2024, "Polaris", "CE (current)"),
    (4000, "Errai (Gamma Cephei)", "CE"),
    (14000, "Vega (again)", "CE"),
]

print(f"{'Year':<8} {'Pole Star':<30} {'Era'}")
print("-" * 60)
for year, star, era in pole_stars:
    print(f"{year:<8} {star:<30} {era}")

# Alignment accuracy at different times
print(f"\
=== Pyramid Alignment Accuracy vs Construction Date ===")
print(f"{'Year (BCE)':>12} {'Accuracy':>12} {'Error on 230m base':>20}")
print("-" * 46)

for year in [3000, 2800, 2600, 2467, 2400, 2200, 2000, 1500]:
    accuracy_arcmin = alignment_accuracy(year)
    # Convert to error on the 230m base
    error_m = 230 * np.tan(np.radians(accuracy_arcmin / 60))
    print(f"{year:>10} {accuracy_arcmin:>8.0f}' {error_m:>16.2f} m")

# The actual Great Pyramid alignment
actual_error_arcmin = 3.4  # measured value
actual_error_m = 230 * np.tan(np.radians(actual_error_arcmin / 60))
print(f"\
Actual Great Pyramid error: {actual_error_arcmin}' = {actual_error_m:.2f} m on the base")
print(f"Kochab-Mizar method in 2467 BCE predicts: 3' accuracy")
print(f"Match: EXCELLENT — the method explains the observed precision")

# Precision of base measurements
print(f"\
=== Pyramid Base Precision ===")
measurements = [
    ("North side", 230.253),
    ("South side", 230.454),
    ("East side", 230.391),
    ("West side", 230.357),
]

lengths = [m[1] for m in measurements]
mean_length = np.mean(lengths)
max_diff = max(lengths) - min(lengths)
std_dev = np.std(lengths)

print(f"{'Side':<12} {'Length (m)':>10}")
print("-" * 24)
for name, length in measurements:
    print(f"{name:<12} {length:>10.3f}")

print(f"\
Mean: {mean_length:.3f} m")
print(f"Max difference: {max_diff:.3f} m ({max_diff/mean_length*100:.003f}%)")
print(f"Std deviation: {std_dev:.3f} m")
print(f"\
The four sides are equal to within 20 cm over 230 m —")
print(f"a precision of 0.09%. Achieved with ropes and pegs.")`,
      challenge: 'Calculate when the Kochab-Mizar method will be accurate again — when will those two stars next be equidistant from the pole? (Hint: precession is a ~26,000-year cycle, so the same configuration repeats roughly every 26,000 years.) Will the same method work in the year 23,500 CE?',
      successHint: 'You calculated stellar positions across millennia and used them for precision surveying — connecting astronomy, geometry, and engineering. The same trigonometry is used today in GPS satellite positioning, telescope pointing, and spacecraft navigation. The mathematics is timeless even as the pole star changes.',
    },
    {
      title: 'Layer-by-layer construction — modelling the build sequence',
      concept: `A pyramid is built from the **bottom up** — the largest, heaviest layer first, then progressively smaller layers on top. This creates a natural construction sequence where each layer must be completed before the next can begin.

The number of blocks per layer decreases as you go up (because each layer is smaller), but the **difficulty** increases (because each block must be raised higher). This creates an interesting optimisation: the easy layers are big (lots of blocks, low ramp), and the hard layers are small (few blocks, high ramp).

The total blocks in each layer of a square pyramid: **n_layer = (side_length / block_size)²**

Where side_length decreases linearly from base to apex. This means block counts follow a **quadratic** decrease: the bottom layer has thousands of blocks, the middle has hundreds, and the top has just a few.

📚 *The center of mass of a pyramid is at 1/4 of the total height (not 1/3, as you might guess). This means the "average" block is raised only 36.5 metres, not 73 metres — a significant reduction in total work.*`,
      analogy: 'Stack coins into a pyramid: the bottom row might have 16 coins (4×4), the next 9 (3×3), then 4 (2×2), then 1 (1×1). Total: 30 coins. But most of them (over half) are in the bottom two layers. Building a pyramid means most of the work happens early, at low height — the hard part (height) only applies to the few blocks at the top.',
      storyConnection: 'The Great Pyramid took 20 years, but the pace of construction wasn\'t constant. The first few years were the most intense — laying the massive base required the most blocks per day. As the pyramid grew taller, fewer blocks were needed per layer, but each one had to be raised higher. The work shifted from "many easy blocks" to "few hard blocks."',
      checkQuestion: 'If the bottom layer of a pyramid has 10,000 blocks and the top has 1, where is the layer with the most total work (blocks × height)?',
      checkAnswer: 'Somewhere in the lower-middle region. The bottom layers have many blocks but low height. The top layers have few blocks but high height. The layer where (number_of_blocks × height) is maximized is roughly 1/3 of the way up. This is where the most total energy is expended.',
      codeIntro: 'Simulate the layer-by-layer construction of the Great Pyramid — track blocks, weight, and work per layer.',
      code: `import numpy as np

def pyramid_build_sequence(base_m, height_m, block_m=1.0,
                           block_mass_kg=2500):
    """
    Model the layer-by-layer construction of a pyramid.
    Returns data for each course (layer) of stone.
    """
    g = 9.81
    layers = []
    n_layers = int(height_m / block_m)
    cumulative_blocks = 0
    cumulative_work = 0

    for i in range(n_layers):
        h = i * block_m  # height of this layer
        fraction = h / height_m
        side = base_m * (1 - fraction)
        blocks_per_side = max(1, int(side / block_m))
        blocks_in_layer = blocks_per_side ** 2

        # Work to raise these blocks to height h
        work_joules = blocks_in_layer * block_mass_kg * g * h
        cumulative_blocks += blocks_in_layer
        cumulative_work += work_joules

        layers.append({
            "layer": i + 1,
            "height_m": h,
            "side_m": side,
            "blocks": blocks_in_layer,
            "cum_blocks": cumulative_blocks,
            "work_MJ": work_joules / 1e6,
            "cum_work_MJ": cumulative_work / 1e6,
        })

    return layers

layers = pyramid_build_sequence(230, 146)
total_blocks = layers[-1]["cum_blocks"]
total_work = layers[-1]["cum_work_MJ"]

print("=== Great Pyramid Build Sequence ===")
print(f"{'Layer':>6} {'Height':>8} {'Side':>7} {'Blocks':>10} {'Cum Blocks':>12} {'Work (MJ)':>10}")
print("-" * 55)

# Show every 15th layer for readability
for l in layers:
    if l["layer"] % 15 == 0 or l["layer"] == 1 or l["layer"] == len(layers):
        pct = l["cum_blocks"] / total_blocks * 100
        print(f"{l['layer']:>6} {l['height_m']:>6.0f}m {l['side_m']:>5.0f}m "
              f"{l['blocks']:>10,} {l['cum_blocks']:>10,} ({pct:>4.0f}%) {l['work_MJ']:>8.0f}")

# Key statistics
print(f"\
=== Construction Statistics ===")
print(f"Total blocks: {total_blocks:,}")
print(f"Total work: {total_work:,.0f} MJ ({total_work/3600:.0f} MWh)")

# Where is most of the work done?
work_by_quarter = [0, 0, 0, 0]
blocks_by_quarter = [0, 0, 0, 0]
for l in layers:
    quarter = min(3, int(l["height_m"] / (146/4)))
    work_by_quarter[quarter] += l["work_MJ"]
    blocks_by_quarter[quarter] += l["blocks"]

print(f"\
{'Quarter':<16} {'Blocks':>10} {'Work (MJ)':>10} {'% of blocks':>12} {'% of work':>10}")
print("-" * 60)
for q in range(4):
    h_range = f"{q*146//4}-{(q+1)*146//4}m"
    print(f"{h_range:<16} {blocks_by_quarter[q]:>10,} {work_by_quarter[q]:>8,.0f} "
          f"{blocks_by_quarter[q]/total_blocks*100:>10.0f}% {work_by_quarter[q]/total_work*100:>8.0f}%")

# Center of mass
total_moment = sum(l["blocks"] * l["height_m"] for l in layers)
com = total_moment / total_blocks
print(f"\
Center of mass height: {com:.1f} m ({com/146*100:.0f}% of total height)")
print(f"Average block raised: {com:.0f} m (not {146//2} m = half height)")
print(f"This saves {(1 - com/(146/2))*100:.0f}% of work vs a constant-width tower")

# Timeline (20 years)
years = 20
blocks_per_day = total_blocks / (years * 350)
print(f"\
At {blocks_per_day:.0f} blocks/day:")

cum = 0
for year in range(1, years + 1):
    target_cum = year / years * total_blocks
    while cum < len(layers) and layers[cum]["cum_blocks"] < target_cum:
        cum += 1
    if cum < len(layers):
        print(f"  Year {year:>2}: reaching layer {layers[cum]['layer']}, "
              f"height {layers[cum]['height_m']:.0f}m")`,
      challenge: 'If you could double the block-placement rate for the bottom 50 layers (perhaps using a wider ramp while the pyramid is still short), how much time would you save overall? (Calculate: what percentage of total blocks are in the bottom 50 layers?) This shows why investing in the early stages of construction has the biggest impact.',
      successHint: 'You modeled the complete construction sequence of the Great Pyramid — from the first block to the capstone. This is project scheduling: breaking a massive project into phases, calculating resource needs for each phase, and understanding where the biggest challenges lie. Every construction project, from a house to a space station, follows the same logic.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Pyramid engineering through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model ramp physics, friction, astronomical alignment, and construction logistics.
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
