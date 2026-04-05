import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function GreatWallLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Finite element analysis — modelling stress distribution in a wall section',
      concept: `Real structures don't have uniform stress — forces concentrate at corners, around openings (windows, arrow slits), and where different materials meet. **Finite element analysis (FEA)** divides a structure into a grid of small elements and calculates the stress in each one.

We'll build a simplified 2D FEA model of a Great Wall cross-section: a trapezoidal wall (wider at the base, narrower at the top) with a watchtower on top. By dividing it into a grid and calculating the stress at each grid point, we can find where the wall is most likely to crack.

The key physics: **stress = force / area**. At the top, the wall carries only its own weight above that point. At the base, it carries the entire wall plus the watchtower. Near an arrow slit, stress concentrates around the opening because the force must flow around the hole.

📚 *Stress concentration: when a force encounters a hole or notch, it must "detour" around it, squeezing through a smaller area — increasing the local stress by 2-3× near the edges of the opening.*`,
      analogy: 'Imagine water flowing in a river. Where the river is wide, the current is gentle. Where it narrows, the current speeds up — the same amount of water squeezes through less space. Stress in a wall follows the same pattern: where material is removed (arrow slits, windows), the force flows through less material and the stress increases.',
      storyConnection: 'The Great Wall\'s watchtowers had arrow slits — narrow vertical openings for firing arrows. The Ming builders reinforced the areas around these slits with thicker brick courses and stone lintels, instinctively addressing the stress concentration problem that FEA would later formalise.',
      checkQuestion: 'A wall is 5 m wide but has a 1 m wide window cut through it. The remaining material is 4 m wide. If the wall carries a load of 500 kN, what is the stress at the window level vs above the window?',
      checkAnswer: 'Above window: σ = 500,000 / (5 × 1) = 100 kPa (assuming 1 m depth). At window level: σ = 500,000 / (4 × 1) = 125 kPa — 25% higher. In reality, stress concentration at the window corners can raise local stress to 200-300 kPa (2-3× amplification).',
      codeIntro: 'Build a simplified 2D stress model of a Great Wall cross-section with a watchtower.',
      code: `import numpy as np

# Simplified 2D stress analysis of a wall cross-section
# Wall is trapezoidal: 6m base, 4.5m top, 10m tall
# Watchtower adds 50 kN point load at top centre

height_m = 10
base_width_m = 6.0
top_width_m = 4.5
tower_load_kn = 50
brick_density = 2000  # kg/m³
g = 9.81

# Divide wall into vertical slices
n_layers = 20
layer_height = height_m / n_layers

print("=== Wall Stress Profile (base to top) ===")
print(f"{'Height (m)':<12} {'Width (m)':>10} {'Weight above (kN)':>18} {'Stress (kPa)':>14}")
print("-" * 56)

cumulative_weight = tower_load_kn  # start with tower load

for i in range(n_layers):
    h = height_m - (i + 0.5) * layer_height  # height from bottom
    # Wall width at this height (linear taper)
    fraction = h / height_m
    width = base_width_m - (base_width_m - top_width_m) * fraction

    # Weight of this layer (per metre of wall length)
    layer_volume = width * layer_height * 1  # 1m depth
    layer_weight = layer_volume * brick_density * g / 1000  # kN

    cumulative_weight += layer_weight

    # Stress at this height
    stress_kpa = cumulative_weight / (width * 1)  # kPa

    if i % 4 == 0 or i == n_layers - 1:
        print(f"{h:>10.1f} {width:>8.2f} {cumulative_weight:>16.1f} {stress_kpa:>12.1f}")

# Arrow slit stress concentration
print("\\n=== Stress Concentration at Arrow Slit ===")
slit_width = 0.15  # 15 cm wide slit
slit_height = 5.0  # at 5m height
wall_width_at_slit = base_width_m - (base_width_m - top_width_m) * (slit_height / height_m)
effective_width = wall_width_at_slit - slit_width
concentration_factor = wall_width_at_slit / effective_width

# Stress at slit level without slit
normal_stress = cumulative_weight * (slit_height / height_m) / wall_width_at_slit
# With stress concentration
peak_stress = normal_stress * concentration_factor * 2.5  # theoretical SCF for sharp corners

print(f"Wall width at slit: {wall_width_at_slit:.2f} m")
print(f"Effective width: {effective_width:.2f} m")
print(f"Normal stress: {normal_stress:.1f} kPa")
print(f"Peak stress at slit corners: {peak_stress:.1f} kPa")
print(f"Stress concentration factor: {peak_stress/normal_stress:.1f}×")`,
      challenge: 'Add a doorway (1.5 m wide, 2.5 m tall) at the base of the wall. How does this change the stress distribution? The doorway creates a much larger stress concentration than an arrow slit — which is why doorways always have massive stone lintels or arches above them.',
      successHint: 'You just performed a simplified finite element analysis — the same technique used to design aircraft wings, car chassis, and skyscrapers. Modern FEA software divides structures into millions of elements, but the principle is identical: calculate stress at each point and find where it exceeds the material\'s strength.',
    },
    {
      title: 'Composite material modelling — the rule of mixtures',
      concept: `Sticky rice mortar is a **composite** — a mixture of lime and starch with properties different from either component alone. To predict a composite's properties from its components, engineers use the **rule of mixtures**:

**E_composite = V₁ × E₁ + V₂ × E₂**

Where V₁ and V₂ are the volume fractions and E₁, E₂ are the properties of each component. This gives an upper bound (parallel model). The inverse rule of mixtures gives a lower bound (series model):

**1/E_composite = V₁/E₁ + V₂/E₂**

The actual property falls between these bounds, depending on the geometry of the composite (how the components are arranged).

📚 *The rule of mixtures works for many properties: stiffness, thermal conductivity, density. It's the foundation of composite material design — from carbon fibre to concrete.*`,
      analogy: 'Imagine two springs connected in parallel (side by side) — their stiffnesses add up. Now connect them in series (end to end) — the combined stiffness is less than either one alone. The rule of mixtures is like parallel springs (upper bound). The inverse rule is like series springs (lower bound). Real composites fall somewhere between.',
      storyConnection: 'The Great Wall itself is a composite structure: brick shell filled with rubble and rammed earth. The properties of this composite wall (strength, thermal performance, weight) depend on the proportions and arrangement of the components — exactly what the rule of mixtures predicts.',
      checkQuestion: 'A mortar is 95% lime (E = 10 GPa) and 5% amylopectin (E = 0.5 GPa). What does the rule of mixtures predict for the composite stiffness?',
      checkAnswer: 'Upper bound: E = 0.95 × 10 + 0.05 × 0.5 = 9.525 GPa. Lower bound: 1/E = 0.95/10 + 0.05/0.5 = 0.195, E = 5.13 GPa. The actual value is between 5 and 10 GPa — the starch is much softer than the lime, so it reduces overall stiffness but adds toughness (crack resistance).',
      codeIntro: 'Model composite properties using the rule of mixtures — predict how adding rice starch changes mortar behaviour.',
      code: `import numpy as np

def rule_of_mixtures(v1, e1, e2):
    """Upper bound (Voigt model - parallel)"""
    v2 = 1 - v1
    return v1 * e1 + v2 * e2

def inverse_rom(v1, e1, e2):
    """Lower bound (Reuss model - series)"""
    v2 = 1 - v1
    return 1 / (v1/e1 + v2/e2)

# Lime mortar properties
E_lime = 10.0    # GPa (stiffness)
E_starch = 0.5   # GPa
k_lime = 0.8     # W/m·K (thermal conductivity)
k_starch = 0.2   # W/m·K
rho_lime = 2200   # kg/m³ (density)
rho_starch = 1500 # kg/m³

starch_fractions = np.linspace(0, 0.20, 50)  # 0% to 20%

print("=== Composite Mortar Properties ===")
print(f"{'Starch %':<10} {'E upper':>8} {'E lower':>8} {'k':>8} {'Density':>8} {'Toughness*':>10}")
print("-" * 54)

for frac in [0, 0.02, 0.05, 0.08, 0.10, 0.15, 0.20]:
    e_upper = rule_of_mixtures(1-frac, E_lime, E_starch)
    e_lower = inverse_rom(1-frac, E_lime, E_starch)
    k_comp = rule_of_mixtures(1-frac, k_lime, k_starch)
    rho = rule_of_mixtures(1-frac, rho_lime, rho_starch)
    # Toughness increases with starch (starch bridges cracks)
    toughness = 1.0 + 8.0 * frac * (1 - frac/0.15)  # peaks at ~10%
    print(f"{frac*100:>7.0f}% {e_upper:>7.2f} {e_lower:>7.2f} {k_comp:>7.2f} {rho:>7.0f} {toughness:>9.1f}×")

print()
print("* Toughness relative to plain lime = 1.0×")
print("Note: starch reduces stiffness but INCREASES toughness.")
print("This is the classic composite trade-off: stiffness vs toughness.")

# The optimal composite
print("\\n=== Optimal Design ===")
best_toughness = 0
best_frac = 0
for frac in starch_fractions:
    toughness = 1.0 + 8.0 * frac * (1 - frac/0.15)
    e_lower = inverse_rom(1-frac, E_lime, E_starch)
    if toughness > best_toughness and e_lower > 3.0:  # min stiffness constraint
        best_toughness = toughness
        best_frac = frac

print(f"Best starch fraction: {best_frac*100:.1f}%")
print(f"Peak toughness: {best_toughness:.1f}× plain lime")
print(f"Stiffness at this fraction: {inverse_rom(1-best_frac, E_lime, E_starch):.1f} GPa")`,
      challenge: 'Modern fibre-reinforced concrete uses steel or polymer fibres at 1-2% by volume. Modify the model to use steel fibres (E = 200 GPa) at 1% in concrete (E = 30 GPa). What stiffness does the rule of mixtures predict? How does this compare to the sticky rice approach? (Steel adds stiffness; starch adds toughness — different strategies for different problems.)',
      successHint: 'The rule of mixtures is the starting point for designing every composite material: carbon fibre, fibreglass, reinforced concrete, bone (collagen + hydroxyapatite), and even sticky rice mortar. Understanding how components combine is a core skill in materials engineering.',
    },
    {
      title: 'Monte Carlo simulation — predicting wall lifespan under random weather',
      concept: `Real weather is **random**: some winters have 80 freeze-thaw cycles, others have 40. Some years get 1,200 mm of rain, others 600. Some decades have earthquakes. How do you predict a wall's lifespan when the stresses are unpredictable?

**Monte Carlo simulation** uses random numbers to model uncertain processes. Instead of calculating one outcome, you calculate **thousands** — each with randomly generated weather — and look at the statistical distribution of results.

If 95% of simulations show the wall lasting more than 300 years, you can be reasonably confident it will last that long. If 10% show failure before 100 years, you know there's a significant risk.

📚 *Monte Carlo methods are named after the casino in Monaco — they use randomness as a computational tool, just as a roulette wheel uses randomness to determine outcomes.*`,
      analogy: 'To predict how long a car will last, you could calculate wear for one "average" journey. But no journey is average — some are smooth, some are rough. Monte Carlo says: simulate 10,000 lifetimes with random road conditions, and the distribution of outcomes tells you the probability of lasting X years.',
      storyConnection: 'The Great Wall has survived for centuries — but different sections degraded at very different rates. The Jinshanling section is in excellent condition; the Badaling section was heavily reconstructed. The difference: local weather patterns, stone quality, and maintenance history — all random variables that a Monte Carlo simulation can model.',
      checkQuestion: 'If you run 1,000 simulations and 950 show the wall lasting >500 years, what is the "95th percentile lifespan"?',
      checkAnswer: 'Approximately 500 years. The 95th percentile means 95% of outcomes exceed this value — so you can be 95% confident the wall will last at least 500 years. The remaining 5% account for extreme weather years, earthquakes, or unusually poor material quality.',
      codeIntro: 'Run a Monte Carlo simulation to predict wall lifespan under random weather conditions.',
      code: `import numpy as np

np.random.seed(42)

def simulate_wall_lifespan(
    porosity=3.0,        # % — brick porosity
    strength_mpa=25.0,   # initial compressive strength
    n_simulations=1000,
    max_years=1000,
):
    """
    Monte Carlo simulation of wall degradation.
    Each year: random freeze-thaw cycles, random rainfall,
    small chance of earthquake. Wall fails when strength
    drops below 5 MPa.
    """
    lifespans = []

    for sim in range(n_simulations):
        current_strength = strength_mpa
        crack_width = 0.1  # mm

        for year in range(1, max_years + 1):
            # Random weather
            freeze_cycles = int(np.random.normal(60, 15))  # mean 60, std 15
            rainfall_mm = np.random.normal(800, 200)       # mean 800, std 200

            # Freeze-thaw damage (proportional to porosity and cycles)
            water_absorbed = porosity / 100 * max(rainfall_mm / 1000, 0)
            ft_damage = freeze_cycles * water_absorbed * 0.09 * 0.002
            crack_width += ft_damage

            # Strength degradation (cracks reduce effective cross-section)
            strength_loss = crack_width * 0.01
            current_strength = max(strength_mpa - strength_loss * strength_mpa, 0)

            # Earthquake (1% chance per year, reduces strength by 10-30%)
            if np.random.random() < 0.01:
                eq_damage = np.random.uniform(0.1, 0.3)
                current_strength *= (1 - eq_damage)

            # Check failure
            if current_strength < 5.0:
                lifespans.append(year)
                break
        else:
            lifespans.append(max_years)

    return np.array(lifespans)

# Run simulations for different brick types
print("=== Monte Carlo Wall Lifespan Analysis ===")
print(f"(1,000 simulations each)\\n")

for name, porosity, strength in [
    ("Rammed earth", 35, 2),
    ("Standard brick", 12, 15),
    ("Dense Ming brick", 3, 25),
    ("Modern concrete", 8, 35),
]:
    lifespans = simulate_wall_lifespan(porosity, strength)
    print(f"{name}:")
    print(f"  Median lifespan: {np.median(lifespans):.0f} years")
    print(f"  5th percentile: {np.percentile(lifespans, 5):.0f} years (worst case)")
    print(f"  95th percentile: {np.percentile(lifespans, 95):.0f} years (best case)")
    print(f"  Failures before 100 years: {np.sum(lifespans < 100) / len(lifespans) * 100:.1f}%")
    print()`,
      challenge: 'Add a "maintenance" parameter: every 50 years, if the wall is still standing, reduce crack_width by 50% (simulating repairs). How does periodic maintenance change the lifespan distribution? This is the argument for preventive maintenance in all infrastructure.',
      successHint: 'Monte Carlo simulation is one of the most powerful tools in engineering, finance, physics, and data science. You just used it to predict structural lifespan — the same technique is used to price financial derivatives, model climate change, and simulate nuclear reactors.',
    },
    {
      title: 'Multivariable optimisation — designing the best wall',
      concept: `An engineer designing a wall must choose: **material**, **thickness**, **height**, **mortar type**, and **drainage design**. Each choice affects cost, strength, lifespan, and construction time. The goal is to find the combination that gives the **best performance at acceptable cost**.

This is **multivariable optimisation** — finding the best point in a space with many dimensions. You can't just optimise each variable independently, because they interact: thicker walls are stronger but cost more; denser bricks resist freeze-thaw but are heavier and need stronger foundations.

We'll use a **grid search** — evaluating the cost-performance function at every combination of variables and finding the best one.

📚 *Optimisation in multiple dimensions is computationally expensive: if each variable has 10 possible values and you have 5 variables, there are 10⁵ = 100,000 combinations to check. This is why fast computers and smart search algorithms matter.*`,
      analogy: 'Imagine adjusting both the temperature and cooking time for a cake. Too hot and too long = burnt. Too cool and too short = raw. There\'s a sweet spot that depends on both variables simultaneously — you can\'t optimise them independently because they interact. Multivariable optimisation finds that sweet spot.',
      storyConnection: 'Chen Wei had to balance material quality, transport cost, workforce size, and construction speed. Using cheaper rammed earth would save money but reduce lifespan. Using granite would last forever but would take 10× longer to transport. The optimal solution — fired brick with sticky rice mortar — balanced all constraints.',
      checkQuestion: 'If doubling wall thickness doubles the lifespan but quadruples the cost, is it worth it?',
      checkAnswer: 'Depends on how you weight cost vs lifespan. If lifespan is 2× more important than cost, then doubling thickness (2× lifespan, 4× cost) gives a score of 2/4 = 0.5 — worse than the original (1/1 = 1.0). You\'d need lifespan to be 4× more important than cost to justify the extra thickness.',
      codeIntro: 'Find the optimal wall design by searching across multiple variables simultaneously.',
      code: `import numpy as np

def evaluate_wall(thickness, porosity, starch_pct, height):
    """
    Score a wall design on multiple criteria.
    Returns (cost, lifespan, strength_score, overall_score).
    """
    # Cost model (arbitrary units)
    material_cost = thickness * height * 100
    starch_cost = starch_pct * 50
    firing_cost = max(0, (10 - porosity)) * 20  # denser = more firing = more cost
    total_cost = material_cost + starch_cost + firing_cost

    # Lifespan model (years)
    base_lifespan = 100
    thickness_factor = thickness / 2.0  # normalised to 2m base
    porosity_factor = max(0.1, 1 - porosity / 40)  # lower porosity = longer life
    starch_factor = 1 + 3 * starch_pct * (1 - starch_pct / 15)  # optimal at ~5%
    lifespan = base_lifespan * thickness_factor * porosity_factor * starch_factor

    # Strength (MPa)
    strength = 8 + 22 * (1 - porosity / 40) + 10 * starch_pct * (1 - starch_pct / 10)

    # Overall score: lifespan per unit cost (efficiency)
    efficiency = lifespan / total_cost * 1000

    return total_cost, lifespan, strength, efficiency

# Grid search over design parameters
best_score = 0
best_design = None
results = []

for thickness in np.arange(1.0, 4.0, 0.5):
    for porosity in [3, 5, 8, 12, 20, 35]:
        for starch in [0, 2, 5, 8, 12]:
            for height in [6, 8, 10, 12]:
                cost, life, strength, score = evaluate_wall(
                    thickness, porosity, starch, height)
                results.append((thickness, porosity, starch, height,
                               cost, life, strength, score))
                if score > best_score:
                    best_score = score
                    best_design = results[-1]

print("=== Wall Design Optimisation ===")
print(f"Searched {len(results):,} combinations\\n")

print("Top 5 designs (by efficiency = lifespan / cost):")
print(f"{'Thick':>6} {'Poro%':>6} {'Starch%':>8} {'Height':>7} {'Cost':>6} {'Life':>6} {'Score':>6}")
print("-" * 47)

sorted_results = sorted(results, key=lambda r: r[7], reverse=True)
for r in sorted_results[:5]:
    print(f"{r[0]:>5.1f}m {r[1]:>5.0f}% {r[2]:>7.0f}% {r[3]:>6.0f}m {r[4]:>5.0f} {r[5]:>5.0f}y {r[7]:>5.1f}")

print(f"\\nOptimal design:")
print(f"  Thickness: {best_design[0]:.1f} m")
print(f"  Porosity: {best_design[1]:.0f}%")
print(f"  Starch content: {best_design[2]:.0f}%")
print(f"  Height: {best_design[3]:.0f} m")
print(f"  Predicted lifespan: {best_design[5]:.0f} years")
print(f"  Cost: {best_design[4]:.0f} units")`,
      challenge: 'Add a "defence score" that increases with height and wall thickness. Now the optimisation must balance THREE objectives: low cost, long lifespan, AND high defence. There may not be a single "best" design — instead, you get a set of trade-offs called the Pareto frontier.',
      successHint: 'Multivariable optimisation is how engineers design real products: aircraft, circuits, drugs, buildings. You searched 1,000+ combinations — real optimisation problems might have billions. Machine learning and gradient descent are tools for navigating these vast design spaces efficiently.',
    },
    {
      title: 'Data analysis — what satellite imagery reveals about the wall today',
      concept: `The Great Wall stretches 21,000 km — far too long to inspect on foot. Modern analysis uses **satellite imagery** and **remote sensing** to assess the wall's condition.

Key techniques include: **NDVI** (Normalized Difference Vegetation Index) to detect plant growth invading cracks, **thermal imaging** to find sections with water damage (wet areas are cooler), and **change detection** to compare images over decades and measure erosion rates.

In the code below, you'll simulate a satellite data analysis pipeline: generate synthetic wall condition data, classify sections by degradation level, and identify the segments most urgently needing restoration.

📚 *Remote sensing uses satellite-mounted sensors to measure properties of the Earth's surface — vegetation, temperature, moisture, elevation — from space. It's how we monitor deforestation, glacial retreat, and urban sprawl.*`,
      analogy: 'A doctor uses an X-ray to see inside your body without surgery. Remote sensing is like an X-ray for the Earth — satellites look at the wall from space using different wavelengths of light to detect things the human eye can\'t see: moisture content, vegetation invasion, thermal anomalies.',
      storyConnection: 'Satellite surveys have revealed that about 30% of the Ming-era Great Wall has disappeared entirely — eroded, buried, or dismantled for building materials. Another 20% is in critical condition. The remaining 50% ranges from fair to good. Remote sensing is how archaeologists discovered and mapped wall sections that had been lost for centuries.',
      checkQuestion: 'If NDVI (vegetation index) is high on a wall section, what does that tell you about the wall\'s condition?',
      checkAnswer: 'Plants are growing in the cracks — which means the wall has significant deterioration. Roots widen cracks, hold moisture (worsening freeze-thaw), and break apart the brick. High NDVI on a wall is a sign of structural distress, not healthy greenery.',
      codeIntro: 'Simulate satellite analysis of Great Wall condition data — classify sections and identify priorities.',
      code: `import numpy as np

np.random.seed(42)

# Simulate satellite data for 100 wall sections (each 1 km)
n_sections = 100

# Generate synthetic condition data
sections = []
for i in range(n_sections):
    age_factor = np.random.uniform(0.5, 1.0)  # older sections degrade more
    sections.append({
        "id": i + 1,
        "length_km": 1.0,
        "ndvi": np.random.beta(2, 5) * age_factor,  # 0=no vegetation, 1=covered
        "moisture": np.random.beta(3, 4) * 100 * age_factor,  # % moisture content
        "crack_density": np.random.exponential(5) * age_factor,  # cracks per metre
        "missing_pct": np.random.beta(1.5, 6) * 100,  # % of wall missing
    })

# Classify condition
def classify(section):
    score = (section["ndvi"] * 25 +
             section["moisture"] / 4 +
             section["crack_density"] * 2 +
             section["missing_pct"] / 5)
    if score > 30: return "CRITICAL"
    if score > 20: return "POOR"
    if score > 10: return "FAIR"
    return "GOOD"

# Add classification
for s in sections:
    s["condition"] = classify(s)

# Summary statistics
conditions = [s["condition"] for s in sections]
print("=== Great Wall Satellite Condition Assessment ===")
print(f"Total sections analysed: {n_sections}\\n")

for level in ["GOOD", "FAIR", "POOR", "CRITICAL"]:
    count = conditions.count(level)
    pct = count / n_sections * 100
    print(f"  {level:<10} {count:>3} sections ({pct:.0f}%)")

# Top priority sections for restoration
critical = sorted([s for s in sections if s["condition"] == "CRITICAL"],
                   key=lambda s: s["missing_pct"], reverse=True)

print(f"\\n=== Top 5 Priority Sections for Restoration ===")
print(f"{'Section':>8} {'NDVI':>6} {'Moist%':>7} {'Cracks/m':>9} {'Missing%':>9}")
print("-" * 41)
for s in critical[:5]:
    print(f"  #{s['id']:<5} {s['ndvi']:>5.2f} {s['moisture']:>6.1f} "
          f"{s['crack_density']:>8.1f} {s['missing_pct']:>8.1f}")

# Correlation analysis
ndvi_vals = np.array([s["ndvi"] for s in sections])
crack_vals = np.array([s["crack_density"] for s in sections])
corr = np.corrcoef(ndvi_vals, crack_vals)[0, 1]
print(f"\\nCorrelation: NDVI vs crack density = {corr:.2f}")
print("(Positive = more vegetation where more cracks — plants invade damaged areas)")`,
      challenge: 'Add a "cost to restore" estimate for each section based on its condition metrics. Then create a "budget allocation" model: given a total budget of 10 million units, which sections should be restored first to save the most wall? This is the real-world prioritisation problem facing heritage conservationists.',
      successHint: 'You just built a remote sensing analysis pipeline — the same type of tool used to monitor deforestation (NDVI), assess flood damage (moisture), and plan urban development (change detection). Satellite data analysis is one of the fastest-growing fields in environmental science.',
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
            Level 3 covers finite element analysis, composite modelling, Monte Carlo simulation, and satellite data analysis.
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
