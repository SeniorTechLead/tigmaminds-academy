import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GreatWallLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Stress and strain — quantifying how materials deform',
      concept: `**Stress** is the force applied per unit area: σ = F/A (measured in pascals). **Strain** is the resulting deformation: ε = ΔL/L₀ (dimensionless — a ratio).

These two are linked by **Young's modulus** (E): σ = E × ε. Young's modulus tells you how stiff a material is — high E means the material deforms very little under load (stiff like steel), low E means it deforms a lot (flexible like rubber).

When stress exceeds the **ultimate strength** of the material, it fails — cracking, crushing, or shattering depending on the type of stress (tension, compression, or shear).

In the code below, you'll calculate stress-strain curves for different wall materials and find their failure points — the stress at which the wall cracks.

📚 *Young's modulus E is the slope of the stress-strain curve in the elastic (reversible) region. It tells you: for every 1% of strain, how many MPa of stress are needed?*`,
      analogy: 'Imagine pulling a rubber band. The force you apply divided by the cross-section of the band is stress. The amount it stretches divided by its original length is strain. A thick, stiff band (high E) barely stretches. A thin, stretchy one (low E) extends easily. Both break when stress exceeds their ultimate strength.',
      storyConnection: 'The Great Wall\'s base must support the weight of everything above it. The stress at the base = weight above / base area. The Ming builders made the base 6 m wide specifically to keep this stress below the brick\'s ultimate compressive strength of ~25 MPa.',
      checkQuestion: 'A column has a cross-sectional area of 0.5 m² and supports a load of 10,000,000 N. What is the stress?',
      checkAnswer: 'σ = F/A = 10,000,000 / 0.5 = 20,000,000 Pa = 20 MPa. If the column is made of brick (ultimate strength ~25 MPa), it\'s at 80% of its capacity — safe but not with much margin.',
      codeIntro: 'Calculate stress-strain curves and find failure points for wall materials.',
      code: `import numpy as np

# Material properties
materials = [
    {"name": "Rammed earth", "E_gpa": 0.5, "ult_mpa": 2.0},
    {"name": "Fired brick",  "E_gpa": 15.0, "ult_mpa": 25.0},
    {"name": "Limestone",    "E_gpa": 30.0, "ult_mpa": 40.0},
    {"name": "Granite",      "E_gpa": 50.0, "ult_mpa": 170.0},
    {"name": "Concrete",     "E_gpa": 30.0, "ult_mpa": 35.0},
]

print("=== Stress-Strain Analysis ===")
print(f"{'Material':<16} {'E (GPa)':>8} {'Ult (MPa)':>10} {'Fail Strain':>12} {'Max Deform':>12}")
print("-" * 60)

for m in materials:
    # Failure strain = ultimate stress / Young's modulus
    fail_strain = m["ult_mpa"] / (m["E_gpa"] * 1000)  # convert GPa to MPa
    # For a 10m wall, how much does it deform at failure?
    deform_mm = fail_strain * 10000  # 10m = 10000mm
    print(f"{m['name']:<16} {m['E_gpa']:>6.1f} {m['ult_mpa']:>8.1f} {fail_strain:>10.4f} {deform_mm:>10.1f} mm")

# Wall height analysis: at what height does base stress = ultimate strength?
print("\\n=== Maximum Safe Wall Height ===")
for m in materials:
    density = {"Rammed earth": 1800, "Fired brick": 2000, "Limestone": 2500,
               "Granite": 2700, "Concrete": 2400}[m["name"]]
    max_h = m["ult_mpa"] * 1e6 / (density * 9.81)
    safety_h = max_h / 3  # factor of safety = 3
    print(f"{m['name']:<16} Theoretical: {max_h:>6.0f} m  With safety factor 3: {safety_h:>6.0f} m")`,
      challenge: 'Engineers use a "factor of safety" — they design structures to handle 3× the expected load. Modify the code to show how the safe height changes with safety factors of 2, 3, and 5. Why not use a safety factor of 10? (Cost — you\'d use 10× more material for the same wall.)',
      successHint: 'Stress, strain, and Young\'s modulus form the foundation of solid mechanics — the branch of engineering that designs everything from bridges to spacecraft. The stress-strain curve is the first thing engineers look at when selecting a material.',
    },
    {
      title: 'Mortar chemistry — the carbonation reaction',
      concept: `Lime mortar hardens through a chemical reaction called **carbonation**:

**Ca(OH)₂ + CO₂ → CaCO₃ + H₂O**

Calcium hydroxide (slaked lime) reacts with carbon dioxide from the air to form calcium carbonate (limestone). This reaction is slow — the CO₂ must diffuse from the air into the mortar, and it can only penetrate a few millimetres per year.

This means a thick mortar joint might take **decades** to fully harden at its centre. Fresh mortar is soft. Old mortar is rock-hard. Some Roman mortar is stronger today than when it was laid — because the carbonation reaction is still continuing after 2,000 years.

In the code below, you'll model the diffusion-limited carbonation process — how the hardening front advances into the mortar over time.

📚 *Diffusion is the process by which molecules move from high concentration to low concentration. CO₂ diffuses from the air (high concentration) into the mortar (low concentration), driving the carbonation reaction.*`,
      analogy: 'Imagine dropping food colouring into a glass of still water. It slowly spreads outward from the drop — diffusing from high concentration (the drop) to low concentration (the clear water). CO₂ entering mortar follows the same physics — it slowly penetrates from the surface inward.',
      storyConnection: 'The Ming builders knew that mortar takes time to cure — they didn\'t load the wall with heavy watchtowers until the mortar had hardened for months. The sticky rice addition accelerated curing by providing nucleation sites for calcium carbonate crystals, but the fundamental process was the same slow carbonation.',
      checkQuestion: 'If carbonation penetrates at 5 mm per year, how long does it take for a 50 mm mortar joint to fully harden?',
      checkAnswer: 'If carbonation advances from both sides simultaneously: 50 mm / 2 sides = 25 mm per side. At 5 mm/year, that\'s 5 years. But diffusion slows as the carbonated layer thickens (the CO₂ has further to travel), so realistically it takes 8-10 years.',
      codeIntro: 'Model the carbonation front advancing into mortar over time using Fick\'s law of diffusion.',
      code: `import numpy as np

def carbonation_depth(time_years, diffusion_coeff=2.5):
    """
    Carbonation depth follows a square-root law:
    depth = k × sqrt(time)
    where k depends on porosity, CO2 concentration, and humidity.
    """
    return diffusion_coeff * np.sqrt(time_years)

# Compare mortar types
mortars = [
    ("Plain lime mortar", 3.0),
    ("Sticky rice mortar", 2.0),      # denser = slower diffusion but faster curing
    ("Modern Portland cement", 1.5),   # very dense
    ("Roman pozzolanic mortar", 2.5),  # volcanic ash addition
]

years = [1, 5, 10, 25, 50, 100, 500]

print("=== Carbonation Depth Over Time (mm) ===")
header = f"{'Mortar Type':<28}" + "".join(f"{y:>6}yr" for y in years)
print(header)
print("-" * len(header))

for name, k in mortars:
    depths = [carbonation_depth(y, k) for y in years]
    row = f"{name:<28}" + "".join(f"{d:>7.1f}" for d in depths)
    print(row)

print()
print("Carbonation follows a square-root law: depth ~ √time")
print("This means the first year hardens as much as years 1-4 combined!")
print()

# Strength vs age
print("=== Mortar Strength vs Age (MPa) ===")
for name, k in mortars:
    print(f"\\n{name}:")
    base_strength = {"Plain lime mortar": 2, "Sticky rice mortar": 5,
                     "Modern Portland cement": 25, "Roman pozzolanic mortar": 4}[name]
    for y in [1, 10, 100, 1000]:
        # Strength increases logarithmically with age
        strength = base_strength * (1 + 0.3 * np.log(y + 1))
        print(f"  Age {y:>5} years: {strength:.1f} MPa")`,
      challenge: 'Roman concrete structures (like the Pantheon) are STILL gaining strength after 2,000 years. Modify the strength model to show what happens at 2,000 years. Why does strength increase logarithmically? (Each year adds proportionally less new carbonation, because the reaction front has further to travel.)',
      successHint: 'The square-root law for diffusion (depth ~ √time) appears everywhere in science: heat conduction, drug delivery, pollution spread, even the stock market (random walk). Recognizing this pattern is a fundamental skill in modeling.',
    },
    {
      title: 'Heat transfer through walls — the U-value',
      concept: `A wall separates the warm inside from the cold outside. Heat flows through the wall from hot to cold — the question is: **how fast?**

The rate of heat flow depends on: (1) the **temperature difference** (bigger difference = faster flow), (2) the **wall area** (bigger wall = more flow), and (3) the wall's **thermal resistance** (thicker, more insulating walls = slower flow).

The **U-value** (W/m²·K) measures how much heat flows through 1 m² of wall per degree of temperature difference. A low U-value means good insulation. A high U-value means heat escapes quickly.

**U = k / d** where k is the material's thermal conductivity (W/m·K) and d is the wall thickness (m).

📚 *Thermal conductivity (k) measures how easily heat flows through a material. Metals have high k (good conductors). Air, wool, and brick have low k (good insulators).*`,
      analogy: 'A wall is like a coat. A thin summer shirt (high U-value) lets heat escape quickly — you feel cold. A thick winter parka (low U-value) traps heat — you stay warm. The Great Wall\'s thick mud-brick is like wearing a very thick coat — the temperature inside the watchtower stayed comfortable even when the mountain air was freezing.',
      storyConnection: 'The Great Wall\'s watchtowers served as shelters for soldiers — they needed to stay warm in winter and cool in summer. The thick brick walls (often 2+ metres) acted as thermal mass, absorbing heat during the day and releasing it at night — naturally regulating the interior temperature without any heating or cooling system.',
      checkQuestion: 'Wall A is 200 mm thick with k = 0.8 W/m·K. Wall B is 400 mm thick with the same k. Which has the lower U-value (better insulation)?',
      checkAnswer: 'Wall A: U = 0.8/0.2 = 4.0 W/m²·K. Wall B: U = 0.8/0.4 = 2.0 W/m²·K. Wall B has half the U-value — it\'s twice as insulating. Doubling the thickness halves the heat loss. This is why the Great Wall\'s base is 5-6 m thick.',
      codeIntro: 'Calculate U-values and heat loss rates for different wall constructions.',
      code: `import numpy as np

# Thermal properties of wall materials
materials = [
    {"name": "Rammed earth",  "k": 1.0, "density": 1800},
    {"name": "Fired brick",   "k": 0.8, "density": 2000},
    {"name": "Limestone",     "k": 1.5, "density": 2500},
    {"name": "Granite",       "k": 2.5, "density": 2700},
    {"name": "Sārooj (Persian)", "k": 0.4, "density": 1600},
    {"name": "Modern insulation", "k": 0.04, "density": 30},
]

wall_thickness_m = 2.0  # Great Wall base thickness
temp_diff_C = 30        # inside vs outside temperature difference
wall_area_m2 = 10       # 10 m² section

print("=== Wall Heat Loss Calculator ===")
print(f"Wall thickness: {wall_thickness_m} m | ΔT: {temp_diff_C}°C | Area: {wall_area_m2} m²")
print(f"{'Material':<22} {'k (W/m·K)':>10} {'U-value':>10} {'Heat Loss (W)':>14}")
print("-" * 58)

for m in materials:
    u_value = m["k"] / wall_thickness_m
    heat_loss = u_value * wall_area_m2 * temp_diff_C
    print(f"{m['name']:<22} {m['k']:>8.2f} {u_value:>8.2f} {heat_loss:>12.0f}")

print()
print("Lower U-value = better insulation = less heat loss")
print("The Great Wall's 2m brick walls had U-values comparable to")
print("modern uninsulated masonry — decent for keeping watchtowers habitable.")

# Thermal mass: how long to heat up / cool down
print("\\n=== Thermal Time Constant (hours to reach equilibrium) ===")
for m in materials:
    # Simplified: τ = (density × specific_heat × thickness) / k
    cp = 900  # approximate specific heat for most masonry (J/kg·K)
    tau_seconds = m["density"] * cp * wall_thickness_m**2 / m["k"]
    tau_hours = tau_seconds / 3600
    print(f"{m['name']:<22} Time constant: {tau_hours:>6.0f} hours ({tau_hours/24:.0f} days)")`,
      challenge: 'A modern insulated wall uses 100 mm of brick + 100 mm of insulation. Calculate the combined U-value. (Hint: add the thermal resistances: R_total = d₁/k₁ + d₂/k₂, then U = 1/R_total.) How does it compare to a 2 m thick solid brick wall?',
      successHint: 'U-values are how buildings are rated for energy efficiency. Every building code specifies maximum U-values for walls, roofs, and windows. The physics you just applied is used by every architect and HVAC engineer in the world.',
    },
    {
      title: 'Water absorption and the Darcy flow model',
      concept: `Water enters porous materials like brick and stone through **capillary action** — the same force that makes a paper towel soak up a spill. The rate of water entry depends on the material's **porosity** (how many pores) and **permeability** (how connected the pores are).

**Darcy's law** describes fluid flow through porous materials:

**Q = (k × A × ΔP) / (μ × L)**

Where Q is flow rate, k is permeability, A is area, ΔP is pressure difference, μ is fluid viscosity, and L is the flow path length.

For the Great Wall, water absorption determines how much water enters the brick — and thus how much ice can form during freeze-thaw cycles. Lower porosity = less water = less damage.

📚 *Capillary action pulls water upward through narrow spaces. It's what makes water climb up a thin glass tube, a paper towel, or the pores in brick — against gravity.*`,
      analogy: 'Think of a sponge. A coarse sponge with big, connected holes absorbs water quickly (high permeability). A dense, fine sponge with tiny holes absorbs slowly (low permeability). Dense Ming brick is like the fine sponge — water can barely get in. Rammed earth is like the coarse sponge — it soaks up water rapidly.',
      storyConnection: 'The Ming builders fired their bricks at high temperatures specifically to reduce porosity — creating a dense, glass-like surface that resisted water penetration. This was the primary defence against freeze-thaw damage. A brick that absorbs 15% water by weight will be destroyed in decades; one that absorbs 2% will last centuries.',
      checkQuestion: 'Two bricks are exposed to rain. Brick A absorbs 12% of its weight in water. Brick B absorbs 2%. In a winter with 60 freeze-thaw cycles, which brick accumulates more damage?',
      checkAnswer: 'Brick A — dramatically more. Since freeze-thaw damage is proportional to water content, Brick A accumulates roughly 6× more damage per cycle than Brick B. Over 60 cycles per winter and centuries of winters, the difference is the difference between a wall that stands and one that crumbles.',
      codeIntro: 'Model water absorption rates for different brick porosities and calculate freeze-thaw vulnerability.',
      code: `import numpy as np

def water_absorption(porosity_pct, time_hours, permeability=1e-15):
    """
    Model water uptake using a square-root-of-time law
    (typical for capillary absorption in porous materials).
    Absorption = S × √t where S is the sorptivity.
    """
    sorptivity = porosity_pct * 0.1  # simplified: higher porosity = faster uptake
    return sorptivity * np.sqrt(time_hours)

# Compare brick types
bricks = [
    ("Unfired mud brick", 35),
    ("Low-fire brick (700°C)", 20),
    ("Standard brick (900°C)", 12),
    ("Dense Ming brick (1100°C)", 3),
    ("Vitrified brick (1200°C)", 1),
]

print("=== Water Absorption Over Time (% by weight) ===")
times = [0.5, 1, 4, 12, 24, 48]
header = f"{'Brick Type':<28}" + "".join(f"{t:>6.0f}hr" for t in times)
print(header)
print("-" * len(header))

for name, porosity in bricks:
    absorptions = [min(water_absorption(porosity, t), porosity) for t in times]
    row = f"{name:<28}" + "".join(f"{a:>6.1f}%" for a in absorptions)
    print(row)

# Freeze-thaw vulnerability index
print("\\n=== Freeze-Thaw Vulnerability Index ===")
print("(Higher = more vulnerable to frost damage)")
for name, porosity in bricks:
    # Vulnerability = water absorbed in 24h × expansion factor
    water_24h = min(water_absorption(porosity, 24), porosity)
    vulnerability = water_24h * 0.09  # 9% expansion of ice
    rating = "CRITICAL" if vulnerability > 1.5 else "HIGH" if vulnerability > 0.5 else "MODERATE" if vulnerability > 0.1 else "LOW"
    print(f"{name:<28} Water (24h): {water_24h:>5.1f}%  "
          f"Expansion stress: {vulnerability:>5.2f}%  Rating: {rating}")`,
      challenge: 'What happens if you apply a waterproof coating (reduce effective porosity to 0.1%) to an ordinary brick? Calculate the improvement. Modern buildings use water-repellent treatments — you\'re modeling the same technology.',
      successHint: 'Darcy\'s law and capillary absorption are used to model everything from oil wells to drug delivery. You\'ve learned that porosity and permeability determine how fast fluids penetrate materials — the key to understanding waterproofing, insulation, and material durability.',
    },
    {
      title: 'Supply chain optimisation — the travelling worker problem',
      concept: `Chen Wei\'s real challenge wasn\'t physics — it was **logistics**. He had to coordinate quarry workers, brick carriers, mortar mixers, stonemasons, and carpenters across a 12 km construction site on a mountain ridge, with limited roads and no communication faster than a runner.

This is a **network optimisation problem**. The "network" is the set of quarries, kilns, staging areas, and wall sections, connected by paths. The "optimisation" is finding the arrangement that **minimises total transport time** while meeting the construction schedule.

The key insight: the **bottleneck** — the slowest step in the process — determines the speed of the entire system. Adding workers to a non-bottleneck step wastes resources. Adding workers to the bottleneck improves the whole system.

📚 *The Theory of Constraints (Eli Goldratt, 1984) says: "A chain is only as strong as its weakest link." In logistics, the system is only as fast as its slowest step.*`,
      analogy: 'Imagine a highway with one lane narrowing to a single lane for 1 km. It doesn\'t matter how wide the rest of the highway is — traffic backs up at the narrow section. Adding lanes everywhere EXCEPT the narrow section doesn\'t help. The narrow section is the bottleneck. Fix it, and the whole system speeds up.',
      storyConnection: 'Chen Wei\'s bottleneck was the mountain path — narrow enough for only one worker at a time, with a 4-hour round trip. He couldn\'t add more paths (the terrain was too steep). So he optimised the one path he had: relay teams, staging areas, and strict scheduling to eliminate waiting time.',
      checkQuestion: 'A construction project has three stages: quarrying (100 blocks/day), transport (60 blocks/day), and laying (90 blocks/day). What is the overall throughput?',
      checkAnswer: '60 blocks/day — the bottleneck is transport. Adding quarry workers or bricklayers doesn\'t help. Only improving transport (wider path, more carriers, closer quarry) increases overall output. The system can never exceed the bottleneck\'s capacity.',
      codeIntro: 'Model a multi-stage supply chain and find the bottleneck.',
      code: `import numpy as np

def simulate_supply_chain(stages, days=30):
    """
    Simulate a multi-stage supply chain.
    Each stage has a max throughput (blocks/day).
    The overall throughput is limited by the slowest stage (bottleneck).
    """
    throughput = min(s["capacity"] for s in stages)
    bottleneck = min(stages, key=lambda s: s["capacity"])

    daily_output = []
    total = 0
    for day in range(1, days + 1):
        total += throughput
        daily_output.append(total)

    return throughput, bottleneck, total, daily_output

# Chen Wei's supply chain
stages = [
    {"name": "Quarrying",   "capacity": 400, "workers": 50},
    {"name": "Kiln firing",  "capacity": 350, "workers": 30},
    {"name": "Transport",    "capacity": 200, "workers": 100},
    {"name": "Mortar mixing", "capacity": 500, "workers": 20},
    {"name": "Bricklaying",  "capacity": 300, "workers": 40},
]

throughput, bottleneck, total_30d, _ = simulate_supply_chain(stages)

print("=== Supply Chain Analysis ===")
print(f"{'Stage':<18} {'Capacity':>10} {'Workers':>8} {'Bottleneck?':>12}")
print("-" * 50)
for s in stages:
    is_bn = ">>> YES <<<" if s["name"] == bottleneck["name"] else ""
    print(f"{s['name']:<18} {s['capacity']:>8} b/d {s['workers']:>6} {is_bn}")

print(f"\\nOverall throughput: {throughput} blocks/day")
print(f"Bottleneck: {bottleneck['name']} ({bottleneck['capacity']} blocks/day)")
print(f"30-day production: {total_30d:,} blocks")

# What if we improve the bottleneck?
print("\\n=== Impact of Improving the Bottleneck ===")
for improvement in [1.0, 1.25, 1.5, 2.0, 3.0]:
    modified = [dict(s) for s in stages]
    for s in modified:
        if s["name"] == bottleneck["name"]:
            s["capacity"] = int(s["capacity"] * improvement)
    new_throughput = min(s["capacity"] for s in modified)
    print(f"Transport capacity ×{improvement}: throughput = {new_throughput} blocks/day "
          f"({new_throughput/throughput:.0%} of baseline)")`,
      challenge: 'After improving transport to 350 blocks/day, what becomes the NEW bottleneck? (Hint: re-run the analysis with the modified capacity.) This cascading improvement — fix one bottleneck, find the next — is the core of continuous process improvement in modern manufacturing.',
      successHint: 'You just applied the Theory of Constraints — one of the most powerful frameworks in operations management. Toyota, Amazon, and every modern factory use bottleneck analysis to optimise their supply chains. The same mathematics applies to computer networks, hospital emergency departments, and even cooking dinner.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Engineering analysis and deeper physics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into stress analysis, mortar chemistry, thermal physics, and supply chain optimisation.
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
