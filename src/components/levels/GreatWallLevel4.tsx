import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GreatWallLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design a Materials Strength Simulator',
      concept: `In this capstone project, you will build a complete **Materials Strength Simulator** — a Python program that:

1. **Accepts user input** for material properties (density, compressive strength, porosity, thermal expansion coefficient)
2. **Simulates freeze-thaw degradation** over centuries using Monte Carlo methods
3. **Calculates structural limits** (maximum height, load capacity, safety factor)
4. **Compares materials** side by side and recommends the best choice for given conditions
5. **Generates a report** with key findings

This brings together everything from Levels 1-3: compressive strength, sintering, freeze-thaw, composite materials, stress analysis, and Monte Carlo simulation.

The first step is **system design** — planning the architecture before writing code. Real software engineers spend more time designing than coding. A good design makes the code clean, testable, and extensible.

📚 *System design means deciding what your program does, how it's organized, and what data it needs — BEFORE you write code. This is the most important skill in software engineering.*`,
      analogy: 'Before building a house, an architect draws blueprints. Before cooking a complex meal, a chef writes a prep list. Before writing a program, an engineer designs the architecture. Skipping this step leads to messy, unmaintainable code — just as skipping blueprints leads to a house that doesn\'t work.',
      storyConnection: 'Chen Wei didn\'t start placing bricks on day one — he spent weeks planning the logistics: quarry locations, relay teams, mortar supply, drainage design. His planning is the equivalent of system design in software engineering.',
      checkQuestion: 'Why is it better to define your data structures before writing your algorithms?',
      checkAnswer: 'Because the data structure determines how the algorithm accesses and manipulates data. A bad data structure forces convoluted algorithms. A good data structure makes algorithms straightforward. "Show me your data structures and I can predict your code" — Eric Raymond.',
      codeIntro: 'Design the architecture of the Materials Strength Simulator — define data structures, interfaces, and workflow.',
      code: `# Materials Strength Simulator — System Design
# Step 1: Define data structures

class Material:
    """Represents a building material with its key properties."""
    def __init__(self, name, density, compressive_strength,
                 porosity, thermal_expansion, thermal_conductivity,
                 youngs_modulus):
        self.name = name
        self.density = density                    # kg/m³
        self.compressive_strength = compressive_strength  # MPa
        self.porosity = porosity                  # % (0-100)
        self.thermal_expansion = thermal_expansion  # per °C
        self.thermal_conductivity = thermal_conductivity  # W/(m·K)
        self.youngs_modulus = youngs_modulus       # GPa

    def max_wall_height(self, safety_factor=3):
        """Maximum wall height before base crushes."""
        h = self.compressive_strength * 1e6 / (self.density * 9.81)
        return h / safety_factor

    def u_value(self, thickness):
        """Thermal transmittance for a given wall thickness."""
        return self.thermal_conductivity / thickness

# Define the material library
MATERIALS = {
    "rammed_earth": Material("Rammed Earth", 1800, 2.0, 35, 10e-6, 1.0, 0.5),
    "fired_brick": Material("Fired Brick (Ming)", 2000, 25.0, 3, 5.5e-6, 0.8, 15),
    "limestone": Material("Limestone", 2500, 40.0, 8, 8e-6, 1.5, 30),
    "granite": Material("Granite", 2700, 170.0, 1, 6e-6, 2.5, 50),
    "concrete": Material("Modern Concrete", 2400, 35.0, 8, 12e-6, 1.5, 30),
}

# System overview
print("=== Materials Strength Simulator ===")
print("Architecture designed. Key components:")
print("  1. Material class with property calculations")
print("  2. Material library with 5 pre-defined entries")
print("  3. Methods: max_wall_height(), u_value()")
print()

# Quick test
for key, mat in MATERIALS.items():
    h = mat.max_wall_height()
    u = mat.u_value(2.0)
    print(f"{mat.name:<24} Max height: {h:>6.0f}m  U-value (2m wall): {u:.2f}")

print()
print("Next step: Add freeze-thaw simulation and Monte Carlo analysis.")`,
      challenge: 'Add a method to the Material class called `thermal_expansion_mm(length_m, delta_T)` that calculates how much a wall of given length expands for a given temperature change. Test it with a 100m granite wall experiencing a 30°C temperature swing.',
      successHint: 'Good system design makes everything else easier. You defined a Material class with clear properties and methods — a reusable, testable component. Real engineering software (SAP2000, ANSYS, Abaqus) uses exactly this pattern: objects with properties and calculation methods.',
    },
    {
      title: 'Building the freeze-thaw simulation engine',
      concept: `Now we implement the core simulation: **freeze-thaw degradation over time**. This combines:

- **Random weather** (Monte Carlo): each year has a different number of freeze-thaw cycles and rainfall, drawn from probability distributions
- **Cumulative damage**: each cycle adds damage proportional to water content and porosity
- **Material response**: different materials degrade at different rates based on their properties

The simulation runs year by year, tracking crack growth, strength loss, and the probability of failure. The output is a **degradation curve** — strength vs time — for each material.

This is the heart of the simulator: the engine that takes material properties + climate data and predicts how long the wall will last.

📚 *A simulation engine is the core loop that advances the model through time. It's the "physics" of the simulator — everything else (input, output, visualization) is interface.*`,
      analogy: 'A flight simulator\'s engine calculates position, speed, altitude, and fuel consumption every fraction of a second. Our wall simulator\'s engine calculates crack width, strength, and water absorption every year. Both advance a model through time using physics equations.',
      storyConnection: 'The Great Wall has been "running" its own 2,000-year experiment in materials degradation. Different sections, built with different materials in different climates, have degraded at different rates. Our simulation models this same process — just faster.',
      checkQuestion: 'Why is randomness important in the simulation? Why not just use average weather?',
      checkAnswer: 'Because extremes matter more than averages. A year with 100 freeze-thaw cycles does far more damage than two years of 50 cycles each — the relationship is non-linear. Using averages would underestimate damage from extreme years and overestimate the wall\'s lifespan.',
      codeIntro: 'Implement the freeze-thaw simulation engine with Monte Carlo weather generation.',
      code: `import numpy as np

np.random.seed(42)

class Material:
    def __init__(self, name, density, strength, porosity, thermal_exp):
        self.name = name
        self.density = density
        self.strength = strength
        self.porosity = porosity
        self.thermal_exp = thermal_exp

class WallSimulation:
    """Simulates wall degradation over time."""

    def __init__(self, material, thickness=2.0, height=10.0):
        self.material = material
        self.thickness = thickness
        self.height = height

    def simulate(self, years=500, n_runs=200):
        """Run Monte Carlo simulation. Returns array of lifespans."""
        lifespans = []

        for run in range(n_runs):
            strength = self.material.strength
            crack = 0.1  # mm

            for year in range(1, years + 1):
                # Random weather
                ft_cycles = max(0, int(np.random.normal(55, 18)))
                rain_mm = max(0, np.random.normal(750, 200))

                # Damage from freeze-thaw
                water = self.material.porosity / 100 * rain_mm / 1000
                crack += ft_cycles * water * 0.09 * 0.0015

                # Strength degradation
                degradation = 1 - (crack * 0.008)
                strength = self.material.strength * max(degradation, 0)

                # Random earthquake (0.5% per year)
                if np.random.random() < 0.005:
                    strength *= np.random.uniform(0.7, 0.95)

                if strength < 3.0:
                    lifespans.append(year)
                    break
            else:
                lifespans.append(years)

        return np.array(lifespans)

# Run simulations
materials = [
    Material("Rammed Earth", 1800, 2.0, 35, 10e-6),
    Material("Standard Brick", 2000, 15.0, 12, 5.5e-6),
    Material("Dense Ming Brick", 2000, 25.0, 3, 5.5e-6),
    Material("Modern Concrete", 2400, 35.0, 8, 12e-6),
]

print("=== Wall Degradation Simulation ===")
print(f"200 runs per material | 500-year horizon\\n")

for mat in materials:
    sim = WallSimulation(mat)
    lifespans = sim.simulate()

    print(f"{mat.name}:")
    print(f"  Median life: {np.median(lifespans):>5.0f} years")
    print(f"  10th pctile: {np.percentile(lifespans, 10):>5.0f} years")
    print(f"  90th pctile: {np.percentile(lifespans, 90):>5.0f} years")
    print(f"  Survival >200yr: {np.mean(lifespans > 200) * 100:>4.0f}%")
    print()`,
      challenge: 'Add a "climate" parameter to the simulation: "cold mountain" (mean 80 FT cycles, std 25) vs "temperate valley" (mean 30 FT cycles, std 10). Run the same materials in both climates. How much does climate affect lifespan compared to material choice?',
      successHint: 'You built a Monte Carlo simulation engine — the same class of tool used by structural engineers to certify bridges, by insurers to price policies, and by climate scientists to project warming scenarios. The key skill: encoding physics into code and letting randomness reveal the range of possible outcomes.',
    },
    {
      title: 'Comparative analysis — generating the recommendation report',
      concept: `A simulation is only useful if it produces **actionable insights**. The final step is to take the raw simulation output and transform it into a clear, comparative report that answers the question: **which material should we use?**

The report should include:
1. **Summary statistics** — median lifespan, worst-case, best-case for each material
2. **Cost-benefit analysis** — cost per year of lifespan
3. **Risk assessment** — probability of failure before a target lifespan
4. **Recommendation** — the best material for given constraints

This is **data analysis and communication** — the skill of extracting meaning from numbers and presenting it clearly. It's the most undervalued skill in engineering.

📚 *The best analysis is worthless if nobody understands it. A good report tells the reader: what did you do, what did you find, and what should they do about it.*`,
      analogy: 'A doctor runs blood tests — that\'s the simulation. Then they write a diagnosis and treatment plan — that\'s the report. Raw numbers (cholesterol: 240, blood pressure: 145/95) are meaningless without interpretation (you have high cholesterol and hypertension, here\'s what to do).',
      storyConnection: 'Chen Wei didn\'t just know which brick was strongest — he had to balance strength against cost, transport time, and construction speed to make a recommendation that the Emperor\'s generals would accept. Engineering is always about trade-offs, and the report is where those trade-offs are made explicit.',
      checkQuestion: 'A material costs 3× more than another but lasts 5× longer. Which is the better value?',
      checkAnswer: 'The expensive one — its cost per year of lifespan is 3/5 = 0.6× the cheap one. You\'re paying 60% of the cost for the same amount of "wall-year." This is cost-effectiveness analysis — the same framework used to evaluate medical treatments, infrastructure investments, and climate policies.',
      codeIntro: 'Generate a comparative analysis report from simulation results.',
      code: `import numpy as np

np.random.seed(42)

# Simplified simulation for the report
def quick_simulate(strength, porosity, n=500, years=600):
    lifespans = []
    for _ in range(n):
        s, c = strength, 0.1
        for y in range(1, years + 1):
            ft = max(0, int(np.random.normal(55, 18)))
            rain = max(0, np.random.normal(750, 200))
            c += ft * porosity/100 * rain/1000 * 0.09 * 0.0015
            s = strength * max(1 - c * 0.008, 0)
            if s < 3: lifespans.append(y); break
        else: lifespans.append(years)
    return np.array(lifespans)

# Materials with costs
candidates = [
    {"name": "Rammed Earth",    "str": 2,  "por": 35, "cost_per_m3": 10},
    {"name": "Standard Brick",  "str": 15, "por": 12, "cost_per_m3": 45},
    {"name": "Dense Ming Brick","str": 25, "por": 3,  "cost_per_m3": 80},
    {"name": "Limestone Block",  "str": 40, "por": 8,  "cost_per_m3": 60},
    {"name": "Modern Concrete", "str": 35, "por": 8,  "cost_per_m3": 35},
]

target_lifespan = 300  # years — design requirement

print("=" * 65)
print("    MATERIALS STRENGTH SIMULATOR — COMPARATIVE REPORT")
print("=" * 65)
print(f"Target lifespan: {target_lifespan} years | 500 simulations per material")
print()

results = []
for c in candidates:
    lifespans = quick_simulate(c["str"], c["por"])
    median = np.median(lifespans)
    p10 = np.percentile(lifespans, 10)
    p90 = np.percentile(lifespans, 90)
    survival = np.mean(lifespans >= target_lifespan) * 100
    cost_per_year = c["cost_per_m3"] / median * 1000
    results.append({**c, "median": median, "p10": p10, "p90": p90,
                    "survival": survival, "cost_per_year": cost_per_year})

# Summary table
print(f"{'Material':<22} {'Median':>7} {'10th%':>7} {'90th%':>7} {'P(>{target_lifespan}yr)':>10} {'Cost/yr':>8}")
print("-" * 63)
for r in results:
    meets = "✓" if r["survival"] > 90 else "✗"
    print(f"{r['name']:<22} {r['median']:>5.0f}yr {r['p10']:>5.0f}yr "
          f"{r['p90']:>5.0f}yr {r['survival']:>8.0f}% {r['cost_per_year']:>6.1f} {meets}")

# Recommendation
viable = [r for r in results if r["survival"] > 90]
if viable:
    best = min(viable, key=lambda r: r["cost_per_year"])
    print(f"\\n{'=' * 65}")
    print(f"RECOMMENDATION: {best['name']}")
    print(f"{'=' * 65}")
    print(f"  Meets {target_lifespan}-year target with {best['survival']:.0f}% confidence")
    print(f"  Median lifespan: {best['median']:.0f} years")
    print(f"  Cost efficiency: {best['cost_per_year']:.1f} units per year of service")
    print(f"  10th percentile (worst case): {best['p10']:.0f} years")
else:
    print("\\nNo material meets the target with >90% confidence.")
    print("Consider composite designs or increased wall thickness.")`,
      challenge: 'The report currently optimises for cost per year. Add a "risk premium" — penalise materials with high variance (large gap between 10th and 90th percentile). A client might prefer a more predictable lifespan even at higher cost. How does the recommendation change?',
      successHint: 'Congratulations — you built a complete engineering analysis tool: from material properties through Monte Carlo simulation to a comparative report with a data-driven recommendation. This is exactly how real structural engineering decisions are made — the same process, just with more sophisticated models and larger datasets.',
    },
    {
      title: 'Portfolio presentation — documenting your simulator',
      concept: `The final step in any engineering project is **documentation** — recording what you built, why, how it works, and what it tells you. A well-documented project becomes a **portfolio piece** that demonstrates your skills to future employers, collaborators, or universities.

Your Materials Strength Simulator documentation should include:

1. **Introduction** — what problem does it solve?
2. **Methodology** — what models and assumptions did you use?
3. **Results** — what did you find?
4. **Conclusions** — what would you recommend?
5. **Limitations** — what does the model NOT capture?
6. **Future work** — how could it be improved?

This is the structure of a **technical report** — the standard format in engineering, science, and industry for communicating results.

📚 *The ability to explain technical work clearly is often more valuable than the technical work itself. A brilliant analysis that nobody can understand has zero impact.*`,
      analogy: 'A recipe book doesn\'t just list ingredients — it explains WHY you\'re adding each one, WHAT happens if you skip a step, and WHEN to adjust. Good documentation does the same for code: not just what it does, but why it does it that way.',
      storyConnection: 'Frontinus, the Roman water commissioner, wrote a complete technical manual of Rome\'s aqueduct system — including measurements, flow rates, and maintenance procedures. His *De Aquaeductu* is the most detailed engineering document from the ancient world and is still studied today, 1,900 years later. Good documentation outlasts the structure it describes.',
      checkQuestion: 'Why is documenting limitations important? Doesn\'t it make your work look weak?',
      checkAnswer: 'The opposite — documenting limitations shows intellectual honesty and engineering maturity. Every model is a simplification. A reader who trusts your results because you didn\'t mention limitations is being misled. A reader who trusts your results despite knowing the limitations is making an informed decision. That\'s what engineering requires.',
      codeIntro: 'Generate a formatted project documentation page for the Materials Strength Simulator.',
      code: `# Materials Strength Simulator — Project Documentation

print("""
================================================================
          MATERIALS STRENGTH SIMULATOR
              Project Documentation
================================================================

1. INTRODUCTION
---------------
This simulator predicts the structural lifespan of wall-building
materials under freeze-thaw cycling, seismic events, and thermal
stress. It was inspired by the engineering of the Great Wall of
China — a 21,000 km structure built with materials ranging from
rammed earth to fired brick over 2,000 years.

2. METHODOLOGY
--------------
The simulator uses three core models:

  a) Compressive strength model:
     Max height = (strength × 10⁶) / (density × g × safety_factor)

  b) Freeze-thaw degradation model:
     Each cycle: crack_growth = porosity × water × 0.09 × damage_rate
     Strength loss proportional to cumulative crack width

  c) Monte Carlo engine:
     N=500 simulations per material with random weather:
     - Freeze-thaw cycles: Normal(55, 18) per year
     - Rainfall: Normal(750, 200) mm per year
     - Earthquake: 0.5% per year, 5-30% strength reduction

3. KEY FINDINGS
---------------
  - Dense Ming brick (porosity 3%) survives 5-10× longer than
    rammed earth (porosity 35%) in the same climate
  - Material porosity is the single strongest predictor of lifespan
  - Climate (number of freeze-thaw cycles) has almost as much
    impact as material choice
  - Cost-effectiveness analysis shows dense brick is cheapest
    per year of service despite higher initial cost

4. LIMITATIONS
--------------
  - 2D model only — does not capture 3D stress distribution
  - Simplified freeze-thaw model — real damage depends on pore
    size distribution, not just total porosity
  - No mortar degradation — assumes joints are as strong as bricks
  - Earthquake model is crude — does not simulate actual ground
    acceleration or resonance effects
  - No maintenance model — real walls are repaired periodically

5. FUTURE IMPROVEMENTS
----------------------
  - Add mortar degradation (carbonation rate, moisture ingress)
  - Implement 3D finite element mesh for stress analysis
  - Model different climate zones (arctic, temperate, desert)
  - Add cost optimisation with Pareto frontier analysis
  - Integrate real climate data from weather station databases

6. SKILLS DEMONSTRATED
----------------------
  ✓ Object-oriented programming (Python classes)
  ✓ Monte Carlo simulation
  ✓ Statistical analysis (percentiles, distributions)
  ✓ Materials science (stress, strain, thermal expansion)
  ✓ Data-driven decision making
  ✓ Technical report writing

================================================================
""")

# Skills summary for portfolio
skills = [
    ("Python programming", "Classes, functions, NumPy, data analysis"),
    ("Materials science", "Compressive strength, sintering, composites"),
    ("Monte Carlo methods", "Random sampling, statistical inference"),
    ("Structural engineering", "Stress analysis, safety factors, FEA concepts"),
    ("Data communication", "Technical reports, comparative analysis"),
]

print("PORTFOLIO SKILLS SUMMARY:")
for skill, detail in skills:
    print(f"  • {skill}: {detail}")`,
      challenge: 'Turn this documentation into a real portfolio piece. Add your name, date, and a 2-sentence summary suitable for a CV/resume. If you built all four levels, list the specific Python concepts you used (classes, NumPy, Monte Carlo, optimisation, data analysis). This document — plus your code — is evidence of real engineering skills.',
      successHint: 'You\'ve completed a full engineering project cycle: problem definition → system design → implementation → simulation → analysis → documentation. This is exactly what professional engineers do — the tools are more sophisticated, but the process is identical. You now have a portfolio project that demonstrates real materials engineering and computational skills.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Materials Strength Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Materials Strength Simulator.
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
