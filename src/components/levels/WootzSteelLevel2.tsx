import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function WootzSteelLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Diffusion in solids — Fick\'s second law for carbon in iron',
      concept: `Carbon atoms don't stay put inside iron — they **diffuse**, migrating from regions of high concentration to low concentration. This process is governed by **Fick's second law**:

**dC/dt = D × d²C/dx²**

Where C is concentration, t is time, D is the diffusion coefficient (m²/s), and x is position. The diffusion coefficient depends exponentially on temperature:

**D = D₀ × exp(-Q / (R × T))**

Where D₀ is the pre-exponential factor, Q is the activation energy, R is the gas constant (8.314 J/mol·K), and T is the absolute temperature (K).

At room temperature, carbon barely moves in iron — D is around 10⁻²⁰ m²/s. But at 1100°C (the temperature used to forge wootz), D jumps to 10⁻¹⁰ m²/s — a factor of 10 billion faster. This is why high-temperature processing is essential: only at forging temperatures can carbon redistribute to create the banded microstructure that gives wootz its legendary patterns.

📚 *Fick's second law describes how concentration profiles evolve over time. The solution for a semi-infinite solid with constant surface concentration is: C(x,t) = C_s × erfc(x / (2√(Dt))).*`,
      analogy: 'Imagine dropping ink into one corner of a still glass of water. Over minutes, the ink slowly spreads — diffusing from the concentrated drop outward. Now heat the water and the ink spreads much faster. Carbon atoms in iron behave identically — they diffuse slowly at low temperature and rapidly at high temperature. The erfc solution tells you exactly how far the "ink" has spread at any time.',
      storyConnection: 'Wootz steel was produced by sealing iron and carbon sources (wood, leaves) in a clay crucible and heating to ~1200°C for days. This long, high-temperature hold allowed carbon to diffuse uniformly into the iron — creating a homogeneous 1.5% carbon steel. Without sufficient diffusion time, the carbon would remain concentrated in spots, producing brittle, inconsistent steel.',
      checkQuestion: 'The diffusion coefficient of carbon in iron at 900°C is about 2×10⁻¹¹ m²/s. Estimate the diffusion distance after 10 hours.',
      checkAnswer: 'Diffusion distance ≈ √(D × t) = √(2×10⁻¹¹ × 36000) = √(7.2×10⁻⁷) ≈ 8.5×10⁻⁴ m ≈ 0.85 mm. After 10 hours at 900°C, carbon has penetrated less than 1 mm. This is why wootz crucibles were held at temperature for 24+ hours — to ensure carbon diffused through centimetre-scale ingots.',
      codeIntro: 'Model carbon diffusion in iron using Fick\'s second law — calculate concentration profiles at different temperatures and times.',
      code: `import numpy as np

# Diffusion parameters for carbon in gamma-iron (austenite)
D0 = 2.3e-5       # pre-exponential factor (m²/s)
Q = 148000         # activation energy (J/mol)
R = 8.314          # gas constant (J/mol·K)

def diffusion_coeff(T_celsius):
    """Arrhenius equation for diffusion coefficient."""
    T_K = T_celsius + 273.15
    return D0 * np.exp(-Q / (R * T_K))

def erfc(x):
    """Complementary error function approximation."""
    a = 0.3480242
    b = -0.0958798
    c = 0.7478556
    t = 1.0 / (1.0 + 0.47047 * np.abs(x))
    result = t * (a + t * (b + t * c)) * np.exp(-x**2)
    return np.where(x >= 0, result, 2 - result)

def concentration_profile(x_mm, time_hours, T_celsius, C_surface=1.5):
    """Fick's 2nd law solution for semi-infinite solid."""
    D = diffusion_coeff(T_celsius)
    t = time_hours * 3600  # convert to seconds
    x = x_mm / 1000        # convert to metres
    if D * t == 0:
        return np.zeros_like(x)
    return C_surface * erfc(x / (2 * np.sqrt(D * t)))

# Temperature dependence of diffusion
print("=== Diffusion Coefficient vs Temperature ===")
print(f"{'Temp (°C)':<12} {'D (m²/s)':<15} {'Distance in 24h (mm)':<22}")
print("-" * 50)
for T in [500, 700, 900, 1000, 1100, 1200]:
    D = diffusion_coeff(T)
    dist = np.sqrt(D * 86400) * 1000  # 24 hours, convert to mm
    print(f"{T:<12} {D:<15.2e} {dist:<20.2f}")

# Concentration profiles at wootz forging temperature
print("\
=== Carbon Profile at 1100°C (Wootz Crucible) ===")
print(f"{'Depth (mm)':<12}", end="")
for t in [1, 6, 12, 24, 48]:
    print(f"{'  ' + str(t) + 'h':>8}", end="")
print("  (wt% C)")
print("-" * 55)

depths = np.array([0.0, 0.5, 1.0, 2.0, 3.0, 5.0, 8.0, 10.0])
for d in depths:
    print(f"{d:<12.1f}", end="")
    for t in [1, 6, 12, 24, 48]:
        c = concentration_profile(np.array([d]), t, 1100)[0]
        print(f"{c:>8.2f}", end="")
    print()

print("\
Key insight: at 1100°C, carbon penetrates ~5 mm in 24 hours.")
print("Wootz ingots were typically 30-50 mm — requiring days of soaking.")`,
      challenge: 'Calculate how long it takes for the centre of a 40 mm diameter wootz ingot to reach 90% of the surface carbon concentration at 1100°C. (Hint: solve C(20mm, t) = 0.9 × C_surface by iterating over time.) This determines the minimum crucible hold time.',
      successHint: 'Fick\'s laws are the foundation of all solid-state diffusion science — used in semiconductor doping, case-hardening of gears, and carburizing of steel. The Arrhenius temperature dependence (exponential activation) appears in nearly every rate-dependent process in chemistry and materials science.',
    },
    {
      title: 'TTT diagrams — time-temperature-transformation',
      concept: `When you cool hot steel, the carbon-rich austenite phase must **transform** into a lower-temperature structure. WHAT it transforms into depends on HOW FAST you cool it:

- **Slow cooling** (hours) → **Pearlite**: alternating layers of soft ferrite and hard cementite. Tough but not extremely hard.
- **Medium cooling** (seconds to minutes) → **Bainite**: finer structure, harder than pearlite.
- **Very fast cooling** (quenching) → **Martensite**: carbon trapped in a distorted lattice. Extremely hard but brittle.

A **TTT diagram** (Time-Temperature-Transformation) maps these outcomes. The x-axis is time (log scale), the y-axis is temperature. Curves show when each transformation starts and finishes. The "nose" of the curve — around 500-550°C for plain carbon steel — is where transformation happens fastest.

The wootz smiths controlled cooling rate to produce a microstructure with **carbide bands in a pearlitic matrix** — the combination that creates the visible damask pattern AND excellent blade properties.

📚 *TTT diagrams are also called "isothermal transformation diagrams" because they show what happens when steel is held at a constant temperature. The related CCT (Continuous Cooling Transformation) diagram shows what happens during continuous cooling.*`,
      analogy: 'Imagine water freezing. Cool it slowly and you get large, clear ice crystals. Cool it fast (flash-freeze) and you get tiny, opaque crystals. Cool it incredibly fast (vitrification) and you get amorphous ice — no crystals at all. Steel does the same: slow cooling gives coarse pearlite, fast cooling gives fine bainite, and quenching gives martensite (the "amorphous ice" of steel).',
      storyConnection: 'The legendary wootz smiths of southern India controlled cooling with extraordinary precision — burying crucibles in sand or exposing them to specific wind conditions. They were navigating the TTT diagram by intuition, producing the exact microstructure needed for damask patterns centuries before the diagram was formally understood.',
      checkQuestion: 'You have a piece of 1.5% carbon steel at 1100°C. You quench it in water (cooling in ~2 seconds). What microstructure do you expect?',
      checkAnswer: 'Martensite — the cooling is too fast for the carbon to diffuse out and form pearlite or bainite. The carbon is trapped in the iron lattice, distorting it into a body-centred tetragonal structure. The result is extremely hard (~65 HRC) but also extremely brittle — it would shatter like glass if struck.',
      codeIntro: 'Simulate TTT diagram behaviour — predict microstructure from cooling rate for wootz-composition steel.',
      code: `import numpy as np

def ttt_nose_time(carbon_pct):
    """Estimate the nose time of the TTT curve (seconds)."""
    # Higher carbon = slower transformation = more time at the nose
    return 0.5 * np.exp(2.0 * carbon_pct)

def predict_microstructure(carbon_pct, cooling_rate_Cs):
    """
    Predict resulting microstructure based on cooling rate.
    cooling_rate_Cs: degrees Celsius per second
    """
    nose_time = ttt_nose_time(carbon_pct)
    # Time to pass through nose region (~500-600°C)
    # Starting from 800°C, need to cool ~250°C
    time_through_nose = 250 / cooling_rate_Cs

    if time_through_nose > nose_time * 10:
        return "Coarse Pearlite + Cementite", 20, 0.6
    elif time_through_nose > nose_time * 3:
        return "Fine Pearlite + Cementite", 30, 0.5
    elif time_through_nose > nose_time:
        return "Bainite", 45, 0.35
    elif time_through_nose > nose_time * 0.3:
        return "Bainite + Martensite", 55, 0.2
    else:
        return "Martensite", 65, 0.05

# Analyse wootz steel (1.5% C)
carbon = 1.5
print(f"=== TTT Analysis for {carbon}% Carbon Steel (Wootz) ===")
print(f"Nose time estimate: {ttt_nose_time(carbon):.1f} seconds\
")

cooling_rates = [0.1, 0.5, 1, 5, 10, 50, 100, 500]
print(f"{'Cool Rate (°C/s)':<18} {'Microstructure':<28} {'HRC':>5} {'Toughness':>10}")
print("-" * 63)

for rate in cooling_rates:
    structure, hardness, toughness = predict_microstructure(carbon, rate)
    print(f"{rate:<18.1f} {structure:<28} {hardness:>4} {toughness:>9.2f}")

# Compare different carbon contents
print("\
=== Effect of Carbon Content on TTT Nose ===")
print(f"{'Carbon %':<10} {'Nose Time (s)':>14} {'Hardenability':>14}")
print("-" * 40)
for c in [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.5, 2.0]:
    nose = ttt_nose_time(c)
    harden = "Low" if nose < 1 else "Medium" if nose < 5 else "High"
    print(f"{c:<10.1f} {nose:>12.1f} {harden:>14}")

# Wootz optimal cooling strategy
print("\
=== Optimal Cooling for Wootz Damask Pattern ===")
target_rate = 0.5  # °C/s — slow air cool
struct, hrc, tough = predict_microstructure(carbon, target_rate)
print(f"Recommended cooling: {target_rate} °C/s (slow air cooling)")
print(f"Expected structure: {struct}")
print(f"Hardness: ~{hrc} HRC | Toughness index: {tough}")
print("This produces the carbide banding responsible for the damask pattern.")`,
      challenge: 'Wootz smiths reportedly cooled blades in cycles — quench briefly, then reheat, then air cool. Simulate this by applying a fast rate (100°C/s) for the first 200°C drop, then a slow rate (0.5°C/s) for the rest. What mixed microstructure might result? This is essentially a tempering process.',
      successHint: 'TTT diagrams are the roadmap of steel heat treatment. Every blade smith, automotive engineer, and toolmaker uses them to predict and control the microstructure of steel. You just learned to read that roadmap — connecting cooling rate to structure to properties.',
    },
    {
      title: 'Hardness testing — Vickers and Rockwell scales',
      concept: `**Hardness** measures a material's resistance to permanent deformation when a hard object is pressed into it. Two major scales are used:

**Vickers hardness (HV)**: A diamond pyramid is pressed into the surface with a known force. The size of the indent is measured under a microscope. Smaller indent = harder material.

**HV = 1.854 × F / d²**

Where F is the force (N) and d is the mean diagonal of the indent (mm).

**Rockwell hardness (HRC)**: A diamond cone is pressed in with a standard load. The depth of penetration is measured automatically. Shallower penetration = harder material.

**HRC = 100 - (depth in units of 0.002 mm)**

For wootz steel, hardness varies across the blade: the carbide-rich bands (cementite, Fe₃C) are ~800 HV, while the matrix between them (pearlite/ferrite) is ~250 HV. This alternation of hard and soft — visible as the damask pattern — gives wootz its unique combination of a sharp, hard edge with a tough, flexible body.

📚 *Hardness and strength are related but not identical. Hardness ≈ 3 × yield strength for metals (in the same units). A material can be hard but brittle (glass) or soft but tough (rubber).*`,
      analogy: 'Pressing your thumb into butter, cheese, and a wooden table. Butter deforms easily (soft, low hardness). Cheese deforms with more effort (medium hardness). Wood barely dents at all (hard, high hardness). The Vickers test does exactly this — but with a diamond point and precise measurements.',
      storyConnection: 'European metallurgists who examined wootz blades in the 18th century were astonished: the steel was harder than anything they could produce, yet it didn\'t shatter. The secret was the micro-scale hardness variation — hard carbide bands for cutting, soft matrix for flexibility. Modern hardness testing finally revealed this dual structure.',
      checkQuestion: 'A Vickers test on a wootz blade produces an indent with diagonals of 0.045 mm and 0.047 mm at 500 gf (4.9 N) force. What is the Vickers hardness?',
      checkAnswer: 'Mean diagonal d = (0.045 + 0.047) / 2 = 0.046 mm. HV = 1.854 × 4.9 / (0.046)² = 1.854 × 4.9 / 0.002116 = 4293. Wait — that seems high. Rechecking: F should be in kgf for the standard formula. HV = 1.854 × 0.5 / (0.046)² = 1.854 × 0.5 / 0.002116 ≈ 438 HV. That aligns with tempered wootz — harder than mild steel (~150 HV) but below pure cementite (~800 HV).',
      codeIntro: 'Calculate and compare hardness values for different steel phases and simulate a hardness traverse across a wootz blade.',
      code: `import numpy as np

def vickers_hardness(force_kgf, diagonal_mm):
    """Calculate Vickers hardness number."""
    return 1.854 * force_kgf / (diagonal_mm ** 2)

def hv_to_hrc(hv):
    """Approximate conversion: Vickers to Rockwell C."""
    if hv < 200:
        return max(0, (hv - 100) * 0.1)
    return min(70, 0.0536 * hv - 1.0)

# Hardness of steel phases
phases = [
    ("Ferrite (pure iron)", 80),
    ("Pearlite (0.8% C)", 250),
    ("Bainite", 400),
    ("Tempered martensite", 500),
    ("Fresh martensite (1.5%C)", 700),
    ("Cementite (Fe3C)", 800),
    ("Wootz carbide band", 750),
    ("Wootz matrix", 280),
]

print("=== Hardness of Steel Phases ===")
print(f"{'Phase':<30} {'HV':>6} {'HRC':>6} {'Indent (mm)*':>13}")
print("-" * 57)

for name, hv in phases:
    hrc = hv_to_hrc(hv)
    # Reverse: what indent size at 1 kgf?
    indent = np.sqrt(1.854 * 1.0 / hv)
    print(f"{name:<30} {hv:>5} {hrc:>5.1f} {indent:>11.4f}")

print("* Indent diagonal at 1 kgf load")

# Simulate hardness traverse across wootz blade
print("\
=== Hardness Traverse Across Wootz Blade ===")
print("(Measuring every 0.1 mm across the cross-section)")

np.random.seed(42)
positions = np.arange(0, 5.0, 0.1)  # 5 mm traverse
band_spacing = 0.4  # mm between carbide bands

hardness_profile = []
for pos in positions:
    # Carbide bands are periodic with some randomness
    in_band = np.sin(2 * np.pi * pos / band_spacing) > 0.7
    if in_band:
        hv = np.random.normal(750, 30)  # carbide band
    else:
        hv = np.random.normal(280, 20)  # matrix
    hardness_profile.append(max(hv, 100))

hardness_profile = np.array(hardness_profile)

print(f"{'Position (mm)':<15} {'HV':>6} {'Phase':>15}")
print("-" * 38)
for i in range(0, len(positions), 5):
    hv = hardness_profile[i]
    phase = "Carbide" if hv > 500 else "Matrix"
    bar = "#" * int(hv / 20)
    print(f"{positions[i]:<15.1f} {hv:>5.0f} {phase:>14}  {bar}")

# Statistics
print(f"\
Traverse statistics:")
print(f"  Mean hardness: {np.mean(hardness_profile):.0f} HV")
print(f"  Max (carbide): {np.max(hardness_profile):.0f} HV")
print(f"  Min (matrix):  {np.min(hardness_profile):.0f} HV")
print(f"  Std deviation: {np.std(hardness_profile):.0f} HV")
print(f"  Hardness ratio (max/min): {np.max(hardness_profile)/np.min(hardness_profile):.1f}×")`,
      challenge: 'The "ideal" wootz blade has a hardness ratio of about 3:1 (carbide:matrix). Modify the band spacing and see how changing the density of carbide bands affects the average hardness and the ratio. What band spacing maximises the average hardness while keeping toughness acceptable?',
      successHint: 'Hardness testing is the most common quality control method in metallurgy. Every gear, bearing, spring, and blade is hardness-tested before it ships. The Vickers and Rockwell scales you just used are international standards (ASTM E92 and E18) used in every materials lab in the world.',
    },
    {
      title: 'Tensile testing simulation — stress-strain curve to failure',
      concept: `A **tensile test** pulls a sample until it breaks, recording the force and elongation at every instant. The resulting **stress-strain curve** reveals everything about a material's mechanical behaviour:

1. **Elastic region**: stress is proportional to strain (Hooke's law). Remove the load and the sample springs back. The slope is **Young's modulus** (E).
2. **Yield point**: the material begins to deform permanently. This is the **yield strength** (σ_y).
3. **Strain hardening**: continued deformation requires increasing force as dislocations pile up.
4. **Necking**: deformation localises in one spot. The engineering stress drops.
5. **Fracture**: the sample breaks. The stress at fracture is the **ultimate tensile strength** (UTS).

Wootz steel has a distinctive stress-strain curve: high yield strength (~800 MPa), significant strain hardening, and moderate ductility (~8% elongation). This is unusual — most steels this hard are brittle (1-2% elongation). The carbide bands act as crack deflectors, forcing cracks to follow tortuous paths and absorbing energy.

📚 *Engineering stress = F/A₀ (original area). True stress = F/A (current area). They diverge after necking because the cross-section shrinks.*`,
      analogy: 'Stretch a piece of taffy. At first it resists and springs back (elastic). Pull harder and it starts to flow permanently (yield). Keep pulling and it gets thinner in one spot (necking). Finally it snaps (fracture). A tensile test does this to a metal sample, measuring the exact force at every step.',
      storyConnection: 'Damascus/wootz blades were prized because they could flex without breaking — a warrior\'s blade that survives combat. The tensile test quantifies this: wootz\'s combination of high strength AND moderate ductility means the blade absorbs energy from impacts rather than shattering. European swords of the same era, made from lower-carbon steel or poorly quenched high-carbon steel, were either too soft or too brittle.',
      checkQuestion: 'A wootz sample has a yield strength of 800 MPa and a Young\'s modulus of 200 GPa. What is the elastic strain at the yield point?',
      checkAnswer: 'ε = σ/E = 800 × 10⁶ / (200 × 10⁹) = 0.004 = 0.4%. This means the sample stretches only 0.4% before it begins to deform permanently. For a 100 mm gauge length, that is only 0.4 mm of elastic stretch — the rest of the 8% total elongation is plastic (permanent).',
      codeIntro: 'Simulate complete tensile tests for different steel microstructures and compare their stress-strain curves.',
      code: `import numpy as np

def tensile_test(E_gpa, yield_mpa, uts_mpa, elongation_pct, n_points=200):
    """
    Generate a stress-strain curve to failure.
    Uses a Ramberg-Osgood-like model for the plastic region.
    """
    E = E_gpa * 1000  # convert to MPa
    elong = elongation_pct / 100
    yield_strain = yield_mpa / E

    # Elastic region
    n_elastic = int(n_points * 0.15)
    strain_e = np.linspace(0, yield_strain, n_elastic)
    stress_e = E * strain_e

    # Plastic region (strain hardening)
    n_plastic = int(n_points * 0.6)
    strain_p = np.linspace(yield_strain, elong * 0.8, n_plastic)
    hardening = (uts_mpa - yield_mpa) * (1 - np.exp(-8 * (strain_p - yield_strain)))
    stress_p = yield_mpa + hardening

    # Necking to failure
    n_neck = n_points - n_elastic - n_plastic
    strain_n = np.linspace(elong * 0.8, elong, n_neck)
    stress_n = np.linspace(stress_p[-1], uts_mpa * 0.85, n_neck)

    strain = np.concatenate([strain_e, strain_p, strain_n])
    stress = np.concatenate([stress_e, stress_p, stress_n])
    return strain, stress

# Steel microstructures
steels = [
    ("Mild steel (0.2%C, ferrite)",    200, 250,  400, 25),
    ("Medium carbon (0.4%C, pearlite)",200, 450,  650, 15),
    ("Wootz steel (1.5%C, banded)",    200, 800, 1050,  8),
    ("Quenched martensite (1.5%C)",    200,1200, 1500,  2),
    ("Tempered wootz (optimised)",     200, 900, 1150, 10),
]

print("=== Tensile Test Results ===")
print(f"{'Steel':<36} {'E':>5} {'σ_y':>6} {'UTS':>6} {'ε_f':>5} {'Toughness*':>10}")
print("-" * 71)

for name, E, sy, uts, elong in steels:
    strain, stress = tensile_test(E, sy, uts, elong)
    # Toughness = area under stress-strain curve (MJ/m³)
    toughness = np.trapz(stress, strain)
    print(f"{name:<36} {E:>4} {sy:>5} {uts:>5} {elong:>4}% {toughness:>8.1f}")

print("\
* Toughness = area under curve (MPa = MJ/m³)")

# Detailed wootz curve
print("\
=== Wootz Steel Stress-Strain Curve (detailed) ===")
strain, stress = tensile_test(200, 800, 1050, 8)
print(f"{'Strain (%)':>10} {'Stress (MPa)':>14} {'Region':<20}")
print("-" * 46)

landmarks = [
    (0, "Start"),
    (0.2, "Elastic"),
    (0.4, "Yield point"),
    (1.0, "Strain hardening"),
    (3.0, "Hardening"),
    (5.0, "Approaching UTS"),
    (6.5, "Necking begins"),
    (8.0, "Fracture"),
]

for target_pct, label in landmarks:
    idx = np.argmin(np.abs(strain * 100 - target_pct))
    print(f"{strain[idx]*100:>9.1f}% {stress[idx]:>12.0f} {label:<20}")

print(f"\
Key: Wootz combines high strength ({steels[2][3]} MPa UTS)")
print(f"with moderate ductility ({steels[2][4]}% elongation) — rare for high-carbon steel.")`,
      challenge: 'Calculate the "resilience" (area under the elastic region only) for each steel. Resilience = energy absorbed before permanent deformation. Which steel has the highest resilience? (Hint: resilience = σ_y² / (2E).) How does resilience differ from toughness, and why do both matter for a blade?',
      successHint: 'The tensile test is the most fundamental mechanical test in materials science. Every structural material — from aluminium aircraft skins to titanium hip implants — is characterised by its stress-strain curve. You now understand the full curve: elasticity, yielding, hardening, necking, and fracture.',
    },
    {
      title: 'Alloy design optimisation — finding the ideal wootz composition',
      concept: `Wootz steel isn't just iron and carbon — trace elements dramatically alter its properties. **Vanadium** (V) and **molybdenum** (Mo) form stable carbides that create the visible damask pattern. **Silicon** (Si) promotes graphite formation. **Manganese** (Mn) increases hardenability. **Phosphorus** (P) above 0.04% causes brittleness.

**Alloy design optimisation** means finding the composition that maximises desired properties (hardness, toughness, pattern visibility) while satisfying constraints (cost, availability, processability).

This is a **constrained optimisation problem**:
- **Objective**: maximise a weighted score of hardness + toughness + pattern quality
- **Variables**: carbon, vanadium, manganese, silicon content (wt%)
- **Constraints**: carbon 1.0-2.0%, vanadium 0-0.05%, Mn 0-0.5%, Si 0-0.5%, phosphorus < 0.04%

We'll use a grid search to evaluate thousands of compositions and find the Pareto-optimal set — compositions where no single property can be improved without worsening another.

📚 *Pareto optimality: a design is Pareto-optimal if you can't improve one objective without making another worse. The set of all Pareto-optimal designs forms the "Pareto frontier" — the boundary of what's achievable.*`,
      analogy: 'Baking a perfect cake: more sugar makes it sweeter but too much makes it gritty. More butter makes it richer but too much makes it greasy. There is a set of recipes where you can\'t add more sugar without adding too much grease — that set is the Pareto frontier. Alloy design works the same way: more carbon increases hardness but reduces toughness.',
      storyConnection: 'Historical wootz ingots from different Indian production centres (Hyderabad, Mysore, Salem) had subtly different compositions — each region\'s iron ore contained different trace elements. Modern analysis of surviving wootz blades shows that the best ones contain ~1.5% C, 0.02-0.04% V, and very low P — a narrow compositional window that the ancient smiths found by centuries of trial and error.',
      checkQuestion: 'A wootz alloy has 1.5% C, 0.03% V, 0.3% Mn, 0.2% Si, and 0.02% P. If you increase carbon to 2.0%, what trade-off do you expect?',
      checkAnswer: 'Higher carbon increases hardness (more cementite) and makes the damask pattern more visible (stronger carbide bands). But it also reduces toughness (more brittle carbide network) and makes forging more difficult (narrower forging temperature range). The trade-off is hardness vs. toughness — the fundamental dilemma of blade steel design.',
      codeIntro: 'Search the alloy design space for optimal wootz compositions — balancing hardness, toughness, and pattern quality.',
      code: `import numpy as np

def evaluate_alloy(C, V, Mn, Si, P):
    """
    Score a wootz alloy composition on multiple criteria.
    Returns (hardness, toughness, pattern, overall).
    """
    # Hardness (HV): increases with C, V, Mn
    hardness = 150 + 350 * C + 2000 * V + 100 * Mn - 50 * Si
    hardness = min(hardness, 850)

    # Toughness (J): decreases with C, increases with Mn
    toughness = 60 - 25 * C + 30 * Mn + 15 * Si - 500 * P
    toughness = max(toughness, 2)

    # Pattern visibility: peaks at C~1.5, enhanced by V
    pattern = 10 * np.exp(-3 * (C - 1.5)**2) * (1 + 50 * V) * (1 - 5 * P)
    pattern = max(pattern, 0)

    # Processability: decreases with C (harder to forge)
    processability = 10 - 4 * C - 100 * V + 2 * Mn

    return hardness, toughness, pattern, processability

# Grid search over composition space
best_score = 0
best_alloy = None
results = []

for C in np.arange(1.0, 2.05, 0.1):
    for V in np.arange(0, 0.055, 0.01):
        for Mn in np.arange(0, 0.55, 0.1):
            for Si in np.arange(0, 0.55, 0.1):
                P = 0.02  # fixed low phosphorus
                h, t, p, proc = evaluate_alloy(C, V, Mn, Si, P)
                # Weighted overall score
                score = 0.3 * (h / 850) + 0.3 * (t / 60) + 0.25 * (p / 15) + 0.15 * (proc / 10)
                results.append((C, V, Mn, Si, h, t, p, proc, score))
                if score > best_score:
                    best_score = score
                    best_alloy = results[-1]

print(f"=== Wootz Alloy Design Optimisation ===")
print(f"Evaluated {len(results):,} compositions\
")

# Top 8 alloys
sorted_r = sorted(results, key=lambda r: r[8], reverse=True)
print(f"{'C%':>5} {'V%':>5} {'Mn%':>5} {'Si%':>5} {'HV':>6} {'Tough':>6} {'Pattern':>8} {'Score':>6}")
print("-" * 52)
for r in sorted_r[:8]:
    print(f"{r[0]:>4.1f} {r[1]:>5.3f} {r[2]:>4.1f} {r[3]:>4.1f} "
          f"{r[4]:>5.0f} {r[5]:>5.1f} {r[6]:>7.1f} {r[8]:>5.3f}")

print(f"\
Optimal composition:")
b = best_alloy
print(f"  Carbon:    {b[0]:.1f}%")
print(f"  Vanadium:  {b[1]:.3f}%")
print(f"  Manganese: {b[2]:.1f}%")
print(f"  Silicon:   {b[3]:.1f}%")
print(f"  Hardness:  {b[4]:.0f} HV ({b[4]*0.0536-1:.0f} HRC)")
print(f"  Toughness: {b[5]:.1f} J")
print(f"  Pattern:   {b[6]:.1f} / 15")

# Historical comparison
print("\
=== Historical vs Optimised ===")
hist_h, hist_t, hist_p, _ = evaluate_alloy(1.5, 0.03, 0.3, 0.2, 0.02)
print(f"Historical wootz (1.5C, 0.03V, 0.3Mn, 0.2Si):")
print(f"  Hardness: {hist_h:.0f} HV | Toughness: {hist_t:.1f} J | Pattern: {hist_p:.1f}")
print(f"Optimised:  Hardness: {b[4]:.0f} HV | Toughness: {b[5]:.1f} J | Pattern: {b[6]:.1f}")`,
      challenge: 'Add phosphorus as a variable (0.01-0.05%) and re-run the search. How sensitive is the result to phosphorus content? Historical analysis shows that the best wootz blades always had P < 0.03% — does your model confirm this? Why is phosphorus so destructive? (It segregates to grain boundaries, causing brittle fracture.)',
      successHint: 'Alloy design is a multi-billion-dollar field — every new steel grade (automotive, aerospace, nuclear) is designed by searching the compositional space for optimal property combinations. You just performed a simplified version of the same process used by companies like ArcelorMittal and Nippon Steel.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Metallurgical analysis and materials testing</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into diffusion, TTT diagrams, hardness testing, tensile simulation, and alloy optimisation.
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
