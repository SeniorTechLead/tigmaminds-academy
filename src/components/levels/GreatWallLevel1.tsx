import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GreatWallLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Compressive strength — which material can hold the most weight?',
      concept: `In the story, Chen Wei had to choose between **rammed earth**, **fired brick**, and **stone** for his section of the wall. Each material can support a different amount of weight before it crushes — this is called **compressive strength**, measured in **megapascals (MPa)**.

One megapascal equals one million newtons of force per square metre. A newton is roughly the weight of a small apple. So 20 MPa means the material can hold 20 million apples per square metre before it fails.

In the code below, you'll compare the compressive strength of different wall-building materials. We use a Python **list of dictionaries** to store the data, then calculate how tall a wall of each material could be before the bottom layer crushes under the weight above it.

📚 *A dictionary stores named values: \`{"name": "brick", "strength": 25}\`. You access values with \`d["strength"]\`.*`,
      analogy: 'Think of stacking books on a cardboard box. With a few books, the box holds. With ten, it starts to buckle. The "compressive strength" of the box is the maximum weight it can hold. Replace the box with a metal safe — it holds much more weight. Materials have the same range: mud crumbles, brick resists, granite endures.',
      storyConnection: 'The earliest sections of the Great Wall (Qin Dynasty, ~221 BCE) used rammed earth — cheap but weak. The Ming Dynasty switched to fired brick — 10× stronger — because they needed walls that could support watchtowers and survive centuries of weather. The material choice determined whether the wall stands today or has crumbled back into the landscape.',
      checkQuestion: 'If rammed earth has a compressive strength of 2 MPa and fired brick has 25 MPa, how many times stronger is the brick?',
      checkAnswer: '25 ÷ 2 = 12.5 times stronger. This is why the Ming walls still stand after 600 years while most Qin-era rammed earth walls have disintegrated. The material upgrade wasn\'t just an improvement — it was a completely different engineering category.',
      codeIntro: 'Compare building materials by compressive strength and calculate maximum wall height for each.',
      code: `# Compressive strength comparison
# How tall can a wall be before the bottom crushes?

materials = [
    {"name": "Rammed earth (Qin Dynasty)", "strength_mpa": 2.0, "density_kg_m3": 1800},
    {"name": "Reed-gravel composite (Han)", "strength_mpa": 3.5, "density_kg_m3": 1600},
    {"name": "Fired brick (Ming Dynasty)", "strength_mpa": 25.0, "density_kg_m3": 2000},
    {"name": "Limestone", "strength_mpa": 40.0, "density_kg_m3": 2500},
    {"name": "Granite", "strength_mpa": 170.0, "density_kg_m3": 2700},
    {"name": "Modern concrete", "strength_mpa": 35.0, "density_kg_m3": 2400},
]

g = 9.81  # gravity (m/s²)

print("=== Maximum Wall Height Calculator ===")
print(f"{'Material':<32} {'Strength':>10} {'Max Height':>12}")
print("-" * 56)

for m in materials:
    # Pressure at base = density × gravity × height
    # Failure when pressure = compressive strength
    # height_max = strength / (density × gravity)
    strength_pa = m["strength_mpa"] * 1_000_000  # convert MPa to Pa
    max_height = strength_pa / (m["density_kg_m3"] * g)
    print(f"{m['name']:<32} {m['strength_mpa']:>7.1f} MPa  {max_height:>8.0f} m")

print()
print("The Great Wall is about 10 m tall — well within")
print("fired brick's limit but close to rammed earth's!")`,
      challenge: 'Add "Steel" to the materials list (strength: 250 MPa, density: 7800 kg/m³). How tall could a steel wall be? Why don\'t we build skyscrapers entirely of steel without concrete? (Hint: cost and weight.)',
      successHint: 'You just applied the formula pressure = density × gravity × height — one of the most important equations in structural engineering. Every building, dam, and bridge is designed using this same calculation.',
    },
    {
      title: 'Sintering — what heat does to clay at the molecular level',
      concept: `When clay is heated above **900°C** in a kiln, something permanent happens: the silica and alumina particles **fuse together** into a continuous glassy matrix. This is called **sintering**, and it's irreversible — you can't un-fire a brick.

The key concept is **bonding**. In unfired clay, particles are held together by weak forces — friction between grains and thin water films. These forces are easily broken by water or frost. In fired clay, the particles are bonded by **covalent bonds** (shared electrons) in the glassy matrix — thousands of times stronger than friction.

In the code below, you'll simulate sintering as a **phase transition**: track how clay properties change with temperature. Below 900°C, the clay is soft and porous. Above 900°C, it rapidly transforms into a hard ceramic.

📚 *A phase transition is a sudden change in a material's properties — like water freezing at 0°C or clay sintering at 900°C.*`,
      analogy: 'Imagine a pile of marbles in a bowl. You can shake them apart easily — they\'re held together only by contact. Now imagine melting the surfaces of the marbles so they fuse together into a single solid mass. You can\'t shake them apart anymore. That\'s sintering — melting the surfaces of clay particles so they bond into one continuous material.',
      storyConnection: 'The Ming builders fired their bricks at precisely controlled temperatures in kilns. Too cool and the brick would be soft and porous. Too hot and it would warp, crack, or vitrify (turn to glass). Each brick was stamped with the kiln, maker, and date — if a brick failed in the wall, they could trace it back to the person who fired it wrong.',
      checkQuestion: 'If sintering occurs at 900°C and a kiln reaches 1100°C, is the extra heat wasted?',
      checkAnswer: 'No — higher temperatures increase the degree of sintering, producing denser, less porous bricks. At 900°C, sintering begins but the brick is still somewhat porous. At 1100°C, more of the glassy matrix forms, reducing porosity further. Less porosity = less water absorption = better freeze-thaw resistance.',
      codeIntro: 'Model how clay properties change with kiln temperature — the sintering phase transition.',
      code: `import numpy as np

# Simulate sintering: clay properties vs temperature
temperatures = np.arange(200, 1200, 10)  # 200°C to 1200°C

def sintering_curve(temp, transition_temp=900, steepness=0.05):
    """Sigmoid function modeling the sintering transition"""
    return 1 / (1 + np.exp(-steepness * (temp - transition_temp)))

# Calculate properties at each temperature
sinter_fraction = sintering_curve(temperatures)
porosity = 35 * (1 - sinter_fraction) + 2  # 35% unfired → 2% fully fired
strength = 2 + 28 * sinter_fraction  # 2 MPa unfired → 30 MPa fired
water_absorption = 15 * (1 - sinter_fraction) + 0.5  # 15% → 0.5%

print("=== Sintering Phase Transition ===")
print(f"{'Temp (°C)':<12} {'Sintered %':>10} {'Porosity %':>12} {'Strength MPa':>14}")
print("-" * 50)

for temp in [400, 600, 800, 850, 900, 950, 1000, 1100]:
    idx = (temp - 200) // 10
    print(f"{temp:<12} {sinter_fraction[idx]*100:>9.1f}% {porosity[idx]:>10.1f}% {strength[idx]:>12.1f}")

print()
print("Notice the sharp transition around 900°C —")
print("below it, the clay is soft; above it, it's ceramic.")
print("This is a phase transition, like water freezing at 0°C.")`,
      challenge: 'Change the transition temperature to 700°C (a different type of clay). How does the property curve shift? What if you made the steepness parameter larger (e.g., 0.1)? This simulates a sharper, more sudden transition.',
      successHint: 'The sigmoid function you just used models phase transitions throughout science: melting, magnetization, population growth, even neural network activation functions. It captures the universal pattern of "gradually then suddenly."',
    },
    {
      title: 'Freeze-thaw cycles — simulating ice destroying stone',
      concept: `Water expands by **9%** when it freezes. This seems small, but the forces are enormous — enough to split rock, crack concrete, and destroy brick walls over time.

The process is cyclic: (1) rain seeps into a crack, (2) temperature drops below 0°C, (3) water freezes and expands, widening the crack, (4) temperature rises, ice melts, (5) more water flows into the now-wider crack, (6) next freeze widens it further. Each cycle makes the damage worse.

In the code below, you'll simulate this cumulative damage over many freeze-thaw cycles. Starting with a tiny crack, you'll model how each cycle widens it until the material fails.

📚 *Cumulative damage is damage that adds up over time. A single freeze-thaw cycle does almost nothing, but thousands of them can demolish a wall.*`,
      analogy: 'Imagine a tiny wedge in a crack in a rock. Each winter, frost drives the wedge in a tiny bit further. After 100 winters, the wedge has split the rock in half. The "wedge" is ice, and the "driving force" is the 9% expansion of freezing water.',
      storyConnection: 'The earliest sections of the Great Wall, built from porous rammed earth, were destroyed by freeze-thaw cycles within centuries. The Ming builders countered this with dense, low-porosity fired bricks (less water gets in) and drainage systems (water runs off rather than pooling). Their sections still stand 600 years later in the same harsh climate.',
      checkQuestion: 'A brick has 5% porosity (5% of its volume is tiny holes). If all the pores fill with water and freeze, by what percentage does the total brick volume increase?',
      checkAnswer: '5% of the brick is water. That water expands by 9%. So the volume increase = 5% × 9% = 0.45% of total brick volume. That sounds tiny, but it creates internal pressure of several MPa — enough to exceed the tensile strength of many materials and cause cracking.',
      codeIntro: 'Simulate cumulative freeze-thaw damage to a wall material over centuries.',
      code: `import numpy as np

# Simulate freeze-thaw damage over years
def simulate_freeze_thaw(porosity_pct, cycles_per_year, years,
                          expansion=0.09, damage_rate=0.001):
    """
    Model cumulative crack growth from freeze-thaw cycling.

    Each cycle: water fills crack → freezes (expands 9%) → widens crack
    Damage accumulates as the crack grows wider, letting in more water.
    """
    crack_width = 0.1  # starting crack width in mm
    history = [crack_width]

    for year in range(years):
        for cycle in range(cycles_per_year):
            # Water volume in crack proportional to crack width and porosity
            water_volume = crack_width * porosity_pct / 100
            # Expansion force widens the crack
            crack_growth = water_volume * expansion * damage_rate
            crack_width += crack_growth
        history.append(crack_width)

    return history

# Compare materials with different porosities
materials = [
    ("Rammed earth (35% porosity)", 35, 60),
    ("Ordinary brick (15% porosity)", 15, 60),
    ("Dense Ming brick (3% porosity)", 3, 60),
    ("Modern concrete (8% porosity)", 8, 60),
]

print("=== Freeze-Thaw Damage Over 500 Years ===")
print(f"{'Material':<35} {'Start':>8} {'100 yr':>8} {'300 yr':>8} {'500 yr':>8}")
print("-" * 70)

for name, porosity, cycles in materials:
    history = simulate_freeze_thaw(porosity, cycles, 500)
    print(f"{name:<35} {history[0]:>6.1f}mm {history[100]:>6.1f}mm "
          f"{history[300]:>6.1f}mm {history[500]:>6.1f}mm")

print()
print("Dense Ming brick barely degrades — low porosity means")
print("almost no water gets in. Rammed earth crumbles rapidly.")`,
      challenge: 'Add a "sealed brick" with 0.5% porosity (imagine a brick coated with waterproof sealant). How does it compare? Try changing cycles_per_year to 120 (a very cold climate with many freezes) vs 20 (mild climate). How does climate affect wall lifespan?',
      successHint: 'You just modeled one of the most important degradation processes in civil engineering. Every bridge, road, and building in a cold climate is designed to resist freeze-thaw damage — using the same principle: reduce porosity, minimize water entry.',
    },
    {
      title: 'Sticky rice mortar — modeling a composite material',
      concept: `The Ming builders discovered that adding **amylopectin** (the starch from glutinous rice) to lime mortar made it dramatically stronger. Modern lab tests confirm: sticky rice mortar is **stronger, more waterproof, and more crack-resistant** than plain lime mortar.

This is the principle of a **composite material** — combining two materials to get properties better than either one alone. The lime provides **hardness** (compressive strength). The rice starch provides **toughness** (crack resistance). Together, they form a composite that is both hard AND tough — a combination almost impossible to achieve with a single material.

In the code below, you'll model how adding rice starch changes mortar properties. The key insight: there's an **optimal ratio** — too little starch and the improvement is negligible; too much and the mortar becomes gummy and weak.

📚 *A composite material combines two or more materials to achieve properties superior to either component alone. Fibreglass, reinforced concrete, plywood, and bone are all composites.*`,
      analogy: 'Think of chocolate chip cookies. Plain dough is soft and crumbly. Chocolate chips alone are hard and brittle. Combined, the cookie is both chewy (the dough provides flexibility) and has satisfying hardness (the chips provide rigidity). Neither ingredient alone gives the final texture — it\'s the combination that works.',
      storyConnection: 'Some Ming-era walls bonded with sticky rice mortar are so strong that modern demolition teams have difficulty breaking them apart — 600 years later. The amylopectin molecules fill microscopic gaps between calcium carbonate crystals as the mortar cures, creating a denser, more uniform material with fewer weak points.',
      checkQuestion: 'Modern concrete is reinforced with steel bars (rebar). Sticky rice mortar is lime reinforced with amylopectin molecules. What principle do they share?',
      checkAnswer: 'Both are composites that combine a material strong in compression (lime/concrete — resists crushing) with a material strong in tension (starch molecules/steel — resists stretching and cracking). Neither component alone has both properties. The composite does.',
      codeIntro: 'Model how rice starch content affects mortar strength, porosity, and waterproofing.',
      code: `import numpy as np

# Model mortar properties vs rice starch content
starch_pct = np.linspace(0, 20, 100)  # 0% to 20% by weight

# Compressive strength: increases to an optimum, then decreases
# (too much starch makes the mortar gummy)
optimal_starch = 5.0  # optimal percentage
strength = 8 + 18 * np.exp(-((starch_pct - optimal_starch) / 4) ** 2)

# Porosity: decreases as starch fills gaps between crystals
porosity = 25 - 20 * (1 - np.exp(-starch_pct / 5))

# Water absorption: closely follows porosity
water_absorption = porosity * 0.6

print("=== Sticky Rice Mortar Optimizer ===")
print(f"{'Starch %':<12} {'Strength MPa':>14} {'Porosity %':>12} {'Water Abs %':>12}")
print("-" * 52)

for pct in [0, 1, 2, 3, 5, 8, 10, 15, 20]:
    idx = int(pct * 100 / 20)
    if idx >= len(starch_pct): idx = len(starch_pct) - 1
    print(f"{pct:<12} {strength[idx]:>12.1f} {porosity[idx]:>10.1f} {water_absorption[idx]:>10.1f}")

# Find the optimal starch percentage
best_idx = np.argmax(strength)
print(f"\\nOptimal starch content: {starch_pct[best_idx]:.1f}%")
print(f"Peak strength: {strength[best_idx]:.1f} MPa")
print(f"Strength without starch: {strength[0]:.1f} MPa")
print(f"Improvement: {strength[best_idx]/strength[0]:.1f}x stronger!")`,
      challenge: 'The model uses a Gaussian (bell curve) for strength — what happens if you change optimal_starch to 3.0 or 8.0? Try modifying the denominator in the exponent (currently 4) to make the peak sharper or broader. What does a sharp peak mean for the builder? (Very precise mixing is required.)',
      successHint: 'Optimization — finding the best value of a parameter — is one of the most important skills in engineering and data science. You just found the optimal starch percentage for maximum mortar strength. Machine learning, drug design, and rocket engineering all use similar optimization techniques.',
    },
    {
      title: 'The logistics problem — supplying 315 blocks per day',
      concept: `The Great Pyramid needed 315 blocks per day for 20 years. The Great Wall is even more extreme: it stretches **21,000 kilometres**. Building it required a **supply chain** — a coordinated system for quarrying stone, firing bricks, mixing mortar, transporting materials, and placing them in the wall.

The fundamental constraint is **throughput** — how many blocks can be delivered per unit time. This depends on: (1) how many workers carry blocks, (2) how far they carry them, (3) how fast they walk, and (4) how many hours they work.

In the code below, you'll build a **logistics calculator** — given wall dimensions, block sizes, and workforce parameters, calculate how many workers are needed and how long construction takes.

📚 *Throughput is the rate at which a system produces output — blocks per day, widgets per hour, pages per minute. It's limited by the slowest step in the chain (the "bottleneck").*`,
      analogy: 'Imagine an assembly line making sandwiches. One person slices bread (30/hour). One person adds filling (40/hour). One person wraps (50/hour). The whole line produces only 30 sandwiches/hour — limited by the slowest step (slicing). Adding more wrappers doesn\'t help. You need more slicers. Finding and fixing the bottleneck is the key to logistics.',
      storyConnection: 'Chen Wei organized his workers into relay teams. Each man carried two bricks (20 kg) up a mountain path — a 4-hour round trip. To supply enough bricks for one metre of wall per day, he needed 200 brick carriers. But he also needed stonemasons, mortar mixers, and carpenters — each group a potential bottleneck.',
      checkQuestion: 'If one worker makes a 4-hour round trip carrying 2 bricks, and works 12 hours per day, how many bricks does that worker deliver per day?',
      checkAnswer: '12 hours ÷ 4 hours per trip = 3 trips per day. 3 trips × 2 bricks = 6 bricks per day per worker. If you need 600 bricks per day, you need 600 ÷ 6 = 100 carriers — plus rest days, injuries, and weather delays.',
      codeIntro: 'Build a wall construction logistics calculator — workforce, time, and supply chain.',
      code: `# Great Wall construction logistics calculator

def calculate_construction(
    wall_length_km,      # total length in km
    wall_height_m,       # height in metres
    wall_width_m,        # base width in metres
    brick_size_m3=0.005, # volume of one brick (~25×12×17 cm)
    brick_weight_kg=10,  # weight of one brick
    carry_distance_km=2, # one-way distance to quarry
    walk_speed_kmh=3,    # walking speed with load
    work_hours=12,       # hours per day
    bricks_per_trip=2,   # bricks carried per trip
):
    # Total wall volume
    volume_m3 = wall_length_km * 1000 * wall_height_m * wall_width_m
    total_bricks = int(volume_m3 / brick_size_m3)

    # Worker productivity
    round_trip_hours = 2 * carry_distance_km / walk_speed_kmh
    trips_per_day = work_hours / round_trip_hours
    bricks_per_worker_day = trips_per_day * bricks_per_trip

    return {
        "volume_m3": volume_m3,
        "total_bricks": total_bricks,
        "round_trip_hours": round_trip_hours,
        "bricks_per_worker_day": bricks_per_worker_day,
    }

# Calculate for a 12 km section (Chen Wei's assignment)
result = calculate_construction(
    wall_length_km=12,
    wall_height_m=6,
    wall_width_m=5,
)

print("=== Great Wall Logistics Calculator ===")
print(f"Wall section: 12 km × 6 m × 5 m")
print(f"Total volume: {result['volume_m3']:,.0f} m³")
print(f"Total bricks needed: {result['total_bricks']:,}")
print(f"Round trip to quarry: {result['round_trip_hours']:.1f} hours")
print(f"Bricks per worker per day: {result['bricks_per_worker_day']:.0f}")
print()

# How many workers and how long?
for years in [1, 2, 3, 5]:
    days = years * 300  # ~300 working days/year
    bricks_per_day = result["total_bricks"] / days
    workers_needed = bricks_per_day / result["bricks_per_worker_day"]
    print(f"To finish in {years} year(s): {bricks_per_day:,.0f} bricks/day,"
          f" {workers_needed:,.0f} brick carriers needed")`,
      challenge: 'Try changing the quarry distance to 5 km or 10 km. How does it affect the workforce needed? This is why the Ming builders tried to use local stone wherever possible — transporting bricks 40 km from distant kilns required enormous manpower.',
      successHint: 'You just built a logistics model — the same type of tool modern construction managers use. The key insight: the bottleneck (slowest step) determines the whole system\'s speed. In this case, it\'s the round-trip walk time. Reducing that distance has more impact than adding workers.',
    },
    {
      title: 'Thermal expansion — why walls crack in the sun',
      concept: `All materials **expand when heated** and **contract when cooled**. This is **thermal expansion** — atoms vibrate more energetically at higher temperatures, pushing slightly further apart.

The amount of expansion is given by: **ΔL = L₀ × α × ΔT**

Where ΔL is the change in length, L₀ is the original length, α (alpha) is the **coefficient of thermal expansion** (different for each material), and ΔT is the temperature change.

For a 10-metre stone wall that experiences a daily temperature swing of 30°C, the expansion is: 10 m × 6×10⁻⁶ /°C × 30°C = **0.0018 m = 1.8 mm**. That sounds tiny — but if the wall is rigid, this 1.8 mm of expansion creates enormous internal stress, and over thousands of daily cycles, it cracks.

📚 *Thermal expansion is why bridges have expansion joints — gaps between sections that allow the bridge to grow and shrink with temperature without cracking.*`,
      analogy: 'Think of a jar lid that\'s stuck. You run hot water over the metal lid. It expands slightly — more than the glass jar — and loosens. That\'s thermal expansion in action. Different materials expand at different rates, which is why the metal lid loosens from the glass jar.',
      storyConnection: 'The Ming builders left small expansion gaps at regular intervals along the wall — joints filled with flexible mortar that could absorb the daily expansion and contraction. Without these gaps, the daily 30°C temperature swings on the mountain ridge would have cracked the wall within decades.',
      checkQuestion: 'A steel bridge is 500 metres long. Steel\'s coefficient of thermal expansion is 12×10⁻⁶ /°C. On a day when the temperature rises by 40°C, how much does the bridge grow?',
      checkAnswer: 'ΔL = 500 × 12×10⁻⁶ × 40 = 0.24 m = 24 cm. Nearly a quarter of a metre! This is why bridges have expansion joints — without them, the thermal forces would buckle or crack the steel.',
      codeIntro: 'Calculate thermal expansion for different wall materials across daily temperature cycles.',
      code: `import numpy as np

# Thermal expansion coefficients (per °C)
materials = {
    "Granite":          6e-6,
    "Limestone":        8e-6,
    "Fired brick":     5.5e-6,
    "Concrete":        12e-6,
    "Steel":           12e-6,
    "Rammed earth":     10e-6,
}

wall_length_m = 100  # 100 metre section
temp_swing_C = 30    # daily temperature swing

print("=== Thermal Expansion Calculator ===")
print(f"Wall length: {wall_length_m} m | Daily temp swing: {temp_swing_C}°C")
print(f"{'Material':<18} {'α (×10⁻⁶/°C)':>14} {'Daily Δ (mm)':>12} {'Annual cycles':>14}")
print("-" * 60)

for name, alpha in materials.items():
    daily_expansion_mm = wall_length_m * alpha * temp_swing_C * 1000
    # Over 365 days: total expansion-contraction distance
    annual_movement = daily_expansion_mm * 365 * 2  # expand + contract
    print(f"{name:<18} {alpha*1e6:>12.1f} {daily_expansion_mm:>10.2f} {annual_movement:>12.0f} mm")

print()
print("Expansion joints needed every ~50 m to absorb this movement.")
print("Without them, thermal stress accumulates and cracks the wall.")

# Stress calculation
print("\\n=== Stress if wall CANNOT expand ===")
for name, alpha in materials.items():
    # Young's modulus (approximate, GPa)
    E = {"Granite": 50, "Limestone": 30, "Fired brick": 15,
         "Concrete": 30, "Steel": 200, "Rammed earth": 0.5}[name]
    stress_mpa = E * 1000 * alpha * temp_swing_C / 1e6
    print(f"{name:<18} Thermal stress: {stress_mpa:.1f} MPa")`,
      challenge: 'What happens if the temperature swing is only 10°C (mild coastal climate) vs 50°C (extreme continental desert)? Calculate the expansion for both. Which climate is hardest on walls? This explains why the Great Wall degrades faster on the mountain ridges than in sheltered valleys.',
      successHint: 'Thermal expansion is why engineers must account for temperature in EVERY structure — bridges, railways, buildings, even spacecraft. The James Webb Space Telescope had to be designed to maintain its mirror shape within nanometres across a 300°C temperature range.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Materials science through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model materials, simulate freeze-thaw cycles, and calculate structural limits.
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
