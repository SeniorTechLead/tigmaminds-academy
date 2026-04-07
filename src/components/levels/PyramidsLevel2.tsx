import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PyramidsLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Tribology — advanced friction analysis with Coulomb\'s law',
      concept: `**Tribology** is the science of friction, wear, and lubrication. When the Egyptians dragged 2.5-tonne limestone blocks across sand, they were performing tribology experiments at industrial scale.

**Coulomb's law of friction** states: F_friction = mu * N, where mu is the coefficient of friction and N is the normal force (the weight pressing the surfaces together). But real friction is more nuanced:

- **Static friction** (mu_s) is the force needed to START sliding — it's always higher than kinetic friction
- **Kinetic friction** (mu_k) is the force needed to KEEP sliding — once moving, it's easier to stay moving
- **Lubricated friction** dramatically reduces both coefficients — the Egyptians discovered that wetting sand halved the drag force

The transition from static to kinetic friction explains why blocks "jerk" when they first start moving, then glide more smoothly. Understanding this transition is critical for calculating the workforce needed to move each block.

*Tribology was named in 1966, but the Egyptians were practicing it 4,500 years ago. The tomb of Djehutihotep shows a man pouring water ahead of a sledge — the earliest recorded lubrication experiment.*`,
      analogy: 'Push a heavy bookcase across the floor. You have to push HARD to get it started (static friction), but once it\'s moving, it takes less effort to keep it sliding (kinetic friction). Now spray water on the floor — the bookcase slides much more easily (lubricated friction). The Egyptians did exactly this with wet sand under multi-tonne blocks.',
      storyConnection: 'A painting in the tomb of Djehutihotep (c. 1900 BCE) shows 172 men dragging a colossal statue on a sledge, with one man pouring water ahead of it. University of Amsterdam researchers proved in 2014 that wetting sand reduces the friction coefficient from ~0.5 to ~0.25 — halving the required workforce. This single insight saved the pyramid builders millions of person-hours.',
      checkQuestion: 'A 2,500 kg block sits on dry sand (mu_s = 0.55). What force is needed to start it moving? How does this change if the sand is wetted (mu_s = 0.28)?',
      checkAnswer: 'Dry: F = 0.55 * 2500 * 9.81 = 13,487 N. Wet: F = 0.28 * 2500 * 9.81 = 6,867 N. Wetting saves 6,620 N of force — about 6-7 fewer workers needed per block. Over 2.3 million blocks, that\'s an enormous saving.',
      codeIntro: 'Model static vs kinetic friction for block transport with dry and lubricated sand.',
      code: `import numpy as np

# Friction coefficients for different surface conditions
conditions = [
    {"name": "Dry sand",            "mu_s": 0.55, "mu_k": 0.40},
    {"name": "Damp sand (optimal)",  "mu_s": 0.28, "mu_k": 0.20},
    {"name": "Wet sand (too wet)",   "mu_s": 0.35, "mu_k": 0.25},
    {"name": "Wooden rollers on sand", "mu_s": 0.15, "mu_k": 0.10},
    {"name": "Greased sledge",       "mu_s": 0.12, "mu_k": 0.08},
]

block_mass_kg = 2500  # average limestone block
g = 9.81
N = block_mass_kg * g  # normal force

print("=== Friction Analysis for Pyramid Block Transport ===")
print(f"Block mass: {block_mass_kg} kg | Weight: {N:.0f} N")
print(f"{'Condition':<26} {'mu_s':>6} {'mu_k':>6} {'F_start (N)':>12} {'F_slide (N)':>12} {'Workers*':>8}")
print("-" * 72)

for c in conditions:
    f_start = c["mu_s"] * N
    f_slide = c["mu_k"] * N
    # Each worker can sustain ~500 N pulling force
    workers = int(np.ceil(f_start / 500))
    print(f"{c['name']:<26} {c['mu_s']:>5.2f} {c['mu_k']:>5.2f} {f_start:>10.0f} {f_slide:>10.0f} {workers:>6}")

print("* Workers needed to START block moving (sustained pull ~500 N each)")

# Ramp friction: inclined plane adds gravity component
print("\\\n=== Friction on Inclined Ramp ===")
ramp_angles = [5, 10, 15, 20, 25]
mu_k = 0.20  # damp sand

print(f"Condition: damp sand (mu_k = {mu_k})")
print(f"{'Angle':>7} {'F_pull (N)':>12} {'F_gravity (N)':>14} {'F_total (N)':>12} {'Workers':>8}")
print("-" * 55)

for angle in ramp_angles:
    rad = np.radians(angle)
    # Force to pull block up ramp = friction + gravity component
    f_friction = mu_k * N * np.cos(rad)
    f_gravity = N * np.sin(rad)
    f_total = f_friction + f_gravity
    workers = int(np.ceil(f_total / 500))
    print(f"{angle:>5}deg {f_friction:>10.0f} {f_gravity:>12.0f} {f_total:>10.0f} {workers:>6}")

print("\\\nSteeper ramp = easier to build but harder to drag blocks up.")
print("The Egyptians likely used 7-10 degree ramps as a compromise.")`,
      challenge: 'At what ramp angle does the gravity component exceed the friction component? This is the "crossover angle" where the ramp becomes impractical. Calculate it analytically: tan(theta) = mu_k. For damp sand, theta = arctan(0.20) = 11.3 degrees. Verify with the code.',
      successHint: 'Coulomb\'s friction law is foundational to mechanical engineering — every machine with moving parts must account for friction. The static-to-kinetic transition you modelled is why anti-lock brakes pump (they prevent the tires from transitioning to lower kinetic friction), and why the Egyptians needed extra workers at the start of each pull.',
    },
    {
      title: 'Capillary forces — water bridge formation between sand grains',
      concept: `When you add the right amount of water to sand, something remarkable happens: **capillary bridges** form between grains. These are tiny menisci of water held by surface tension in the gaps between adjacent grains.

Each capillary bridge acts like a tiny spring pulling the grains together, creating **cohesion** — the sand grains stick to each other instead of flowing freely. This is why damp sand holds a shape (sandcastles!) while dry sand and saturated sand both collapse.

The force from a single capillary bridge is: **F = pi * gamma * d** where gamma is surface tension (~0.072 N/m for water) and d is the grain diameter. Tiny force per bridge, but there are billions of bridges per cubic centimetre.

The optimal water content is 2-5% by volume. Below this, too few bridges form. Above this, the water fills the pore spaces and the bridges disappear (the sand becomes a slurry).

*This is exactly what the Amsterdam researchers discovered: at 2-5% water content, sand stiffness doubles and friction halves. The Egyptians found this empirically 4,500 years before the physics was understood.*`,
      analogy: 'Hold two wet glass slides together — they\'re surprisingly hard to pull apart. That\'s a capillary bridge: a thin film of water held by surface tension that creates an attractive force between the surfaces. Now imagine billions of these micro-bridges between every pair of sand grains. Each is tiny, but collectively they transform loose sand into a firm surface.',
      storyConnection: 'The Giza plateau is covered in fine limestone sand with grain diameters of 0.1-0.5 mm. At this grain size, capillary bridges are strongest at 3-5% water content — a few litres per square metre of sledge path. The worker depicted pouring water in Djehutihotep\'s tomb wasn\'t guessing: he was applying precisely the right amount to maximise capillary cohesion.',
      checkQuestion: 'Why does too much water make sand WORSE for dragging? Shouldn\'t more lubrication always help?',
      checkAnswer: 'Too much water fills all the pore space, destroying the capillary bridges. The sand becomes a slurry with no internal cohesion — it flows like mud and the sledge sinks into it. The optimal point is where bridges exist but pores are not saturated: 2-5% water by volume.',
      codeIntro: 'Model capillary bridge forces and find the optimal water content for sand compaction.',
      code: `import numpy as np

# Surface tension of water
gamma = 0.072  # N/m at 20C

# Capillary bridge force between two spherical grains
def bridge_force(grain_diameter_mm, separation_mm=0.01):
    """Force from a single capillary bridge (Newtons)."""
    d = grain_diameter_mm / 1000  # convert to metres
    sep = separation_mm / 1000
    # Simplified model: F = pi * gamma * d * cos(theta)
    # Contact angle theta ~ 30 degrees for water on quartz
    return np.pi * gamma * d * np.cos(np.radians(30))

# Force per bridge for different grain sizes
print("=== Single Capillary Bridge Force ===")
grain_sizes = [0.05, 0.1, 0.2, 0.5, 1.0, 2.0]
for d in grain_sizes:
    f = bridge_force(d)
    print(f"  Grain d = {d:.2f} mm: F = {f*1e6:.2f} uN ({f:.2e} N)")

# Sand bed cohesion vs water content
print("\\\n=== Sand Bed Properties vs Water Content ===")
grain_d = 0.2  # mm, typical Giza sand
porosity = 0.38  # typical sand packing

water_contents = np.linspace(0, 15, 31)  # % by volume

print(f"Grain diameter: {grain_d} mm | Porosity: {porosity*100:.0f}%")
print(f"{'Water %':>8} {'Bridges/cm3':>12} {'Cohesion (kPa)':>15} {'Stiffness':>10} {'Rating':>10}")
print("-" * 57)

for wc in [0, 1, 2, 3, 5, 7, 10, 15]:
    if wc == 0:
        bridges_per_cm3 = 0
        cohesion = 0
        stiffness = 1.0
    elif wc < porosity * 100:
        # Pendular regime: bridges form at grain contacts
        # Number of bridges proportional to water content up to saturation
        saturation = wc / (porosity * 100)
        bridges_per_cm3 = int(6e4 * min(saturation, 0.3) / 0.3)
        f_single = bridge_force(grain_d)
        cohesion = bridges_per_cm3 * f_single * 1e4  # scale to kPa
        # Stiffness peaks at ~5% then drops
        stiffness = 1.0 + 3.0 * saturation * (1 - saturation)
    else:
        bridges_per_cm3 = 0
        cohesion = 0
        stiffness = 0.3  # saturated slurry

    rating = "Too dry" if wc < 1 else "Optimal" if 2 <= wc <= 5 else "Good" if wc < 8 else "Too wet"
    print(f"{wc:>6.0f}% {bridges_per_cm3:>10,} {cohesion:>13.2f} {stiffness:>8.1f}x {rating:>10}")

# Drag force reduction
print("\\\n=== Drag Force vs Water Content ===")
block_weight = 2500 * 9.81  # N
mu_dry = 0.50
for wc in [0, 2, 3, 5, 8, 12]:
    if wc == 0:
        mu_eff = mu_dry
    elif wc <= 5:
        mu_eff = mu_dry * (1 - 0.5 * wc / 5)  # linear reduction to half
    else:
        mu_eff = mu_dry * (0.5 + 0.3 * (wc - 5) / 10)  # increases again when too wet
    drag = mu_eff * block_weight
    print(f"  Water {wc:>2}%: mu = {mu_eff:.2f}, drag = {drag:,.0f} N ({drag/500:.0f} workers)")`,
      challenge: 'Temperature affects surface tension: gamma decreases from 0.076 N/m at 10C to 0.059 N/m at 50C. The Giza desert can reach 50C. Modify the model to show how capillary forces weaken in extreme heat. Would the builders have needed more water on hot days?',
      successHint: 'Capillary forces are the same physics behind ink in a pen, water in plant roots, and blood in capillaries. You modelled how microscopic surface tension creates macroscopic material properties — this bridge from molecular physics to engineering behaviour is at the heart of materials science.',
    },
    {
      title: 'Project scheduling — critical path method for pyramid construction',
      concept: `Building the Great Pyramid required coordinating thousands of tasks over 20 years. Some tasks can happen simultaneously (quarrying while building ramps), but others are sequential (you can\'t place a block until it\'s been quarried, transported, and lifted).

The **Critical Path Method (CPM)** identifies the longest chain of dependent tasks — the **critical path**. This path determines the minimum project duration. Any delay on the critical path delays the entire project. Tasks NOT on the critical path have **slack** — they can be delayed without affecting the overall schedule.

**CPM algorithm:**
1. List all tasks with durations and dependencies
2. Forward pass: calculate the earliest start time for each task
3. Backward pass: calculate the latest start time without delaying the project
4. Slack = latest start - earliest start
5. Tasks with zero slack are on the critical path

*CPM was invented in 1957 for DuPont chemical plant construction. The pyramid builders solved the same problem intuitively — but with 100,000 workers instead of a computer.*`,
      analogy: 'Cooking a complex meal: you can chop vegetables while the oven preheats (parallel), but you can\'t serve the dish before it\'s cooked (sequential). The critical path is the sequence of tasks that takes the longest — the one that determines when dinner is ready. If preheating takes 20 minutes and chopping takes 10, the oven is the critical path.',
      storyConnection: 'The Great Pyramid of Khufu was built in approximately 20 years. With 2.3 million blocks averaging 2.5 tonnes each, that\'s 315 blocks per day — one every 4.6 minutes during daylight hours. This pace was only possible because quarrying, transport, and placement ran in parallel with precise scheduling.',
      checkQuestion: 'If quarrying takes 2 months, transport takes 1 month, and placement takes 1 month, and each must follow the previous, what is the minimum time for one "batch" of blocks?',
      checkAnswer: '4 months — the sum of all sequential tasks. But the beauty of CPM is that you can START quarrying the next batch while the first batch is being transported. After the initial 2-month startup, the system produces a finished batch every 2 months (the bottleneck). This is pipelining.',
      codeIntro: 'Apply CPM to schedule the major phases of pyramid construction.',
      code: `import numpy as np

# Define pyramid construction tasks
tasks = [
    {"id": "A", "name": "Survey and level site",     "duration": 6,  "deps": []},
    {"id": "B", "name": "Build workers village",      "duration": 4,  "deps": []},
    {"id": "C", "name": "Open limestone quarry",      "duration": 3,  "deps": ["A"]},
    {"id": "D", "name": "Build main ramp",            "duration": 8,  "deps": ["A"]},
    {"id": "E", "name": "Quarry granite (Aswan)",     "duration": 12, "deps": []},
    {"id": "F", "name": "Transport granite by Nile",  "duration": 4,  "deps": ["E"]},
    {"id": "G", "name": "Lay foundation courses",     "duration": 6,  "deps": ["A", "C"]},
    {"id": "H", "name": "Build lower 2/3 (130 courses)", "duration": 96, "deps": ["G", "D"]},
    {"id": "I", "name": "Build upper 1/3 (70 courses)", "duration": 72, "deps": ["H"]},
    {"id": "J", "name": "Install King's Chamber",     "duration": 6,  "deps": ["H", "F"]},
    {"id": "K", "name": "Place capstone (pyramidion)", "duration": 1,  "deps": ["I", "J"]},
    {"id": "L", "name": "Casing stone finishing",      "duration": 24, "deps": ["K"]},
    {"id": "M", "name": "Remove ramps",               "duration": 12, "deps": ["L"]},
]

# Forward pass: earliest start and finish
task_map = {t["id"]: t for t in tasks}
for t in tasks:
    if not t["deps"]:
        t["es"] = 0
    else:
        t["es"] = max(task_map[d]["ef"] for d in t["deps"])
    t["ef"] = t["es"] + t["duration"]

project_duration = max(t["ef"] for t in tasks)

# Backward pass: latest start and finish
for t in reversed(tasks):
    successors = [s for s in tasks if t["id"] in s["deps"]]
    if not successors:
        t["lf"] = project_duration
    else:
        t["lf"] = min(s["ls"] for s in successors)
    t["ls"] = t["lf"] - t["duration"]
    t["slack"] = t["ls"] - t["es"]

print("=== Critical Path Method — Pyramid Construction ===")
print(f"{'ID':<4} {'Task':<32} {'Dur':>4} {'ES':>5} {'EF':>5} {'LS':>5} {'LF':>5} {'Slack':>6} {'Critical':>9}")
print("-" * 76)

critical_path = []
for t in tasks:
    is_critical = t["slack"] == 0
    if is_critical:
        critical_path.append(t["id"])
    marker = "<<< YES" if is_critical else ""
    print(f"{t['id']:<4} {t['name']:<32} {t['duration']:>3}m {t['es']:>4} {t['ef']:>4} "
          f"{t['ls']:>4} {t['lf']:>4} {t['slack']:>5}m {marker}")

print(f"\\\nCritical path: {' -> '.join(critical_path)}")
print(f"Project duration: {project_duration} months ({project_duration/12:.1f} years)")
print(f"\\\nDelaying any critical task by 1 month delays the ENTIRE project by 1 month.")
print(f"Non-critical tasks have slack — they can be delayed without affecting completion.")`,
      challenge: 'What if the granite quarrying at Aswan (task E) takes 18 months instead of 12 due to a hard vein? Recalculate the critical path. Does the granite delay affect the project completion date? (Check if E-F-J is on the critical path.)',
      successHint: 'CPM is used to schedule every major construction project in the world — from skyscrapers to spacecraft. You modelled the same scheduling problem that Hemiunu (Khufu\'s vizier and chief architect) solved 4,500 years ago. The tools change; the mathematics is eternal.',
    },
    {
      title: 'Surveying mathematics — error propagation in levelling',
      concept: `The Great Pyramid\'s base is level to within 2.1 cm across 230 metres — an error of just 0.009%. This extraordinary precision was achieved using **water levelling**: trenches cut around the base were filled with water (which always finds its own level), and the surrounding rock was cut down to match.

But every measurement has **error**, and errors **propagate** through calculations. If you level one section with +/- 3mm accuracy, and then level the next section relative to the first, the total error grows. Over N independent measurements, random errors grow as:

**Total error = single_error * sqrt(N)**

This is the **root-sum-square (RSS)** rule for error propagation. It means that to achieve 21 mm total error over 230 m, each individual levelling step had to be extraordinarily precise.

*Error propagation is the foundation of measurement science (metrology). Every scientific measurement — from CERN particle physics to your bathroom scale — is meaningless without an uncertainty estimate.*`,
      analogy: 'Imagine measuring the length of a football field by laying down 1-metre sticks end to end, each accurate to +/- 1 mm. After 100 sticks, the total error isn\'t 100 mm (worst case) — it\'s sqrt(100) * 1 = 10 mm (RSS). Random errors partially cancel because some are positive and some are negative. This statistical cancellation is why the RSS rule works.',
      storyConnection: 'The pyramid builders couldn\'t use modern laser levels or GPS. They had copper tools, string, plumb bobs, and water. Yet they achieved levelling accuracy that wouldn\'t be surpassed until the invention of the theodolite in the 16th century — 4,000 years later. Their technique: water levelling in channels, repeated and cross-checked obsessively.',
      checkQuestion: 'If each levelling measurement has +/- 2 mm error and you chain 100 measurements, what is the expected total error?',
      checkAnswer: 'RSS rule: total = 2 * sqrt(100) = 20 mm. This is much less than the worst case (2 * 100 = 200 mm) because random errors partially cancel. The Great Pyramid\'s 21 mm error over its base is consistent with approximately 100 levelling stations at +/- 2 mm each — remarkable for Bronze Age technology.',
      codeIntro: 'Model error propagation in pyramid surveying and compare ancient vs modern levelling techniques.',
      code: `import numpy as np

np.random.seed(42)

# Error propagation: RSS rule
def rss_error(single_error, n_measurements):
    """Root-sum-square error propagation."""
    return single_error * np.sqrt(n_measurements)

# Pyramid base levelling
base_length_m = 230.4  # Great Pyramid base side
target_error_mm = 21    # actual achieved accuracy

print("=== Error Propagation in Pyramid Levelling ===")
print(f"Base length: {base_length_m} m | Achieved accuracy: {target_error_mm} mm\\\n")

# Different levelling step sizes and their required accuracy
print("If levelling in steps of X metres, each step must be accurate to:")
print(f"{'Step size':>10} {'N steps':>8} {'Required per-step (mm)':>24} {'Technique':>20}")
print("-" * 64)

for step in [1, 2, 5, 10, 20, 50]:
    n = int(np.ceil(base_length_m / step))
    per_step = target_error_mm / np.sqrt(n)
    technique = "Extremely difficult" if per_step < 1 else "Water level" if per_step < 3 else "String and plumb" if per_step < 10 else "Visual"
    print(f"{step:>8}m {n:>6} {per_step:>22.2f} {technique:>20}")

# Monte Carlo simulation of levelling process
print("\\\n=== Monte Carlo: 10,000 Simulated Levelling Runs ===")
n_sims = 10000
step_size = 5  # metres
n_steps = int(np.ceil(base_length_m / step_size))

for instrument_error in [1.0, 2.0, 3.0, 5.0, 10.0]:
    # Each step has random error drawn from normal distribution
    total_errors = []
    for _ in range(n_sims):
        errors = np.random.normal(0, instrument_error, n_steps)
        total_errors.append(np.sum(errors))
    total_errors = np.array(total_errors)

    rss_predicted = rss_error(instrument_error, n_steps)
    actual_std = np.std(total_errors)

    print(f"Per-step error: +/-{instrument_error:.0f}mm | "
          f"RSS predicted: {rss_predicted:.1f}mm | "
          f"Simulated std: {actual_std:.1f}mm | "
          f"95% within: {np.percentile(np.abs(total_errors), 95):.1f}mm")

# Comparison: ancient vs modern surveying
print("\\\n=== Surveying Accuracy Through History ===")
methods = [
    ("Water levelling (Egypt)", 2.0, "2600 BCE"),
    ("Groma (Roman)", 5.0, "100 BCE"),
    ("Theodolite (early)", 1.0, "1570 CE"),
    ("Optical level (modern)", 0.3, "1900 CE"),
    ("Laser level", 0.05, "1980 CE"),
    ("GPS RTK", 0.01, "2000 CE"),
]

print(f"{'Method':<28} {'Error/step':>12} {'Over 230m':>10} {'Era':>10}")
print("-" * 62)
for name, err, era in methods:
    total = rss_error(err, 46)  # 5m steps
    print(f"{name:<28} {err:>10.2f}mm {total:>8.1f}mm {era:>10}")`,
      challenge: 'Systematic errors (like a poorly calibrated water channel) do NOT cancel with RSS — they accumulate linearly. If there\'s a 0.1 mm systematic bias per step plus 2 mm random error, what\'s the total error over 46 steps? (Systematic: 0.1 * 46 = 4.6 mm. Random: 2 * sqrt(46) = 13.6 mm. Total: sqrt(4.6^2 + 13.6^2) = 14.4 mm.)',
      successHint: 'Error propagation is one of the most important concepts in all of science and engineering. Every GPS position, every medical test, every climate projection, and every physics measurement includes an uncertainty estimate calculated using exactly the RSS rule you just applied.',
    },
    {
      title: 'Material logistics — optimal quarry allocation and transport routing',
      concept: `The Great Pyramid required stone from multiple quarries: local limestone for the core (quarried 300 m south), fine Tura limestone for the casing (quarried 15 km across the Nile), and granite for the King\'s Chamber (quarried 900 km south at Aswan).

**Logistics optimisation** asks: given multiple quarries with different stone types, capacities, and distances, how do you allocate production and route transport to **minimise total cost** (or total time)?

This is a **transportation problem** — a classic optimisation problem where you must ship goods from multiple sources to multiple destinations at minimum cost. The cost of each route depends on distance, terrain, and transport method (sledge, river barge, or human carry).

The constraint: each quarry has a maximum daily output, and each pyramid layer requires a specific volume of stone. The objective: deliver the right stone to the right place at the lowest total cost.

*The transportation problem was first solved mathematically by Leonid Kantorovich in 1939 (he won the Nobel Prize for it). The Egyptians solved a version of it 4,500 years earlier through organisational genius.*`,
      analogy: 'Imagine you run three pizza restaurants and supply them from two warehouses. Warehouse A is close to restaurants 1 and 2 but far from 3. Warehouse B is close to 3 but far from 1. The optimal allocation ships from A to 1 and 2, from B to 3 — minimising total delivery distance. Now scale that to millions of stone blocks and you have the pyramid logistics problem.',
      storyConnection: 'Archaeological evidence shows the pyramid builders maintained meticulous records of stone deliveries. Quarry marks on blocks record the work gang\'s name, the date, and the quarry of origin. Papyrus records from Wadi al-Jarf (the "diary of Merer") describe day-by-day transport operations, including the exact number of blocks delivered by each team.',
      checkQuestion: 'Quarry A produces 200 blocks/day at 300 m distance. Quarry B produces 100 blocks/day at 15 km distance. If you need 300 blocks/day, what\'s the minimum total transport effort (block-km)?',
      checkAnswer: 'Take all 200 from A (200 * 0.3 = 60 block-km) and 100 from B (100 * 15 = 1,500 block-km). Total: 1,560 block-km. You can\'t avoid using B since A\'s capacity is only 200. The distant quarry dominates the transport cost even though it supplies only 1/3 of the blocks.',
      codeIntro: 'Optimise quarry allocation for pyramid construction using a transportation cost model.',
      code: `import numpy as np

# Quarry data
quarries = [
    {"name": "Giza local",     "capacity": 250, "distance_km": 0.3,
     "stone": "core limestone",  "cost_per_block_km": 1.0},
    {"name": "Tura (east bank)", "capacity": 80,  "distance_km": 15,
     "stone": "casing limestone", "cost_per_block_km": 2.0},  # Nile crossing
    {"name": "Aswan",           "capacity": 5,   "distance_km": 900,
     "stone": "granite",         "cost_per_block_km": 5.0},   # long-haul river
    {"name": "Faiyum",          "capacity": 40,  "distance_km": 80,
     "stone": "basalt",          "cost_per_block_km": 3.0},
]

# Demand per pyramid layer type
demands = [
    {"layer": "Core (courses 1-130)",   "blocks_per_day": 280, "stone": "core limestone"},
    {"layer": "Casing",                  "blocks_per_day": 30,  "stone": "casing limestone"},
    {"layer": "King's Chamber",          "blocks_per_day": 2,   "stone": "granite"},
    {"layer": "Mortuary temple floor",   "blocks_per_day": 5,   "stone": "basalt"},
]

print("=== Quarry Allocation Optimiser ===\\\n")
print("Quarry capacities:")
for q in quarries:
    daily_cost = q["capacity"] * q["distance_km"] * q["cost_per_block_km"]
    print(f"  {q['name']:<20} {q['capacity']:>4} blocks/day | {q['distance_km']:>6.1f} km | "
          f"Daily transport cost: {daily_cost:>8,.0f} units")

print("\\\nDemand schedule:")
total_demand = 0
for d in demands:
    total_demand += d["blocks_per_day"]
    print(f"  {d['layer']:<28} {d['blocks_per_day']:>4} blocks/day ({d['stone']})")
print(f"  {'TOTAL':<28} {total_demand:>4} blocks/day")

# Greedy allocation: match demand to cheapest source
print("\\\n=== Optimal Allocation (minimum cost) ===")
total_cost = 0
allocations = []
for d in demands:
    # Find quarry that supplies this stone type
    matching = [q for q in quarries if q["stone"] == d["stone"]]
    for q in matching:
        allocated = min(d["blocks_per_day"], q["capacity"])
        cost = allocated * q["distance_km"] * q["cost_per_block_km"]
        total_cost += cost
        allocations.append((q["name"], d["layer"], allocated, cost))
        print(f"  {q['name']:<20} -> {d['layer']:<28} {allocated:>4} blocks | cost: {cost:>8,.0f}")

print(f"\\\nTotal daily transport cost: {total_cost:,.0f} units")

# Annual logistics summary
print("\\\n=== Annual Logistics Summary ===")
days_per_year = 300  # working days (Nile flood season = no quarrying)
annual_cost = total_cost * days_per_year
annual_blocks = total_demand * days_per_year
print(f"Working days per year: {days_per_year}")
print(f"Annual blocks delivered: {annual_blocks:,}")
print(f"Annual transport cost: {annual_cost:,.0f} units")
print(f"Total blocks needed (2.3M): ~{2_300_000 / annual_blocks:.0f} years of production")
print(f"Cost per block delivered: {total_cost / total_demand:.1f} units")

# What-if: closer quarry for casing stone
print("\\\n=== What-if: Tura quarry 5 km closer (new road)? ===")
tura_saving = 80 * (15 - 10) * 2.0  # blocks * distance_saved * cost_rate
print(f"Daily saving: {tura_saving:,.0f} units")
print(f"Annual saving: {tura_saving * days_per_year:,.0f} units")
print(f"20-year saving: {tura_saving * days_per_year * 20:,.0f} units")`,
      challenge: 'During the Nile flood season (3 months), the river rises and barges can reach closer to the site — reducing Tura distance from 15 km to 8 km and Aswan transport cost by 30%. Model the seasonal variation in logistics cost. Should the builders stockpile casing stone during flood season?',
      successHint: 'You just solved a simplified transportation problem — the same class of optimisation used by Amazon for warehouse allocation, by airlines for route planning, and by military logistics for supply chain management. The mathematics of getting the right material to the right place at minimum cost is universal.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Engineering analysis and construction science</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into tribology, capillary physics, project scheduling, surveying mathematics, and material logistics.
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
