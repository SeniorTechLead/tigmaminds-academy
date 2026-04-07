import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PyramidsLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Finite element stress analysis — 2D stress distribution in a pyramid',
      concept: `A pyramid is not a uniform block — stress varies dramatically from apex to base. At the top, each stone carries almost nothing. At the base, each stone supports the weight of everything above it. Near internal chambers, stress must detour around the voids, creating **stress concentrations**.

**Finite element analysis (FEA)** divides the pyramid cross-section into a grid of small elements and calculates the stress at each point. For a pyramid, the stress at height h from the base is:

**sigma(h) = rho * g * (H - h) * (1 - h/H)^2 / (1 - h/H)^2**

Simplified: **sigma(h) = rho * g * (H - h)** — the weight of everything above, divided by the area at that height. But because the pyramid widens toward the base, the area grows as (base_width * (1 - h/H))^2, partially offsetting the increasing load.

The King's Chamber creates a void at 43 m height — the stress must flow around it, concentrating at the chamber walls. The builders addressed this with massive granite beams and five relieving chambers above.

*FEA was developed in the 1940s for aircraft stress analysis. We apply it here to a 4,500-year-old structure to understand why the builders placed relieving chambers where they did.*`,
      analogy: 'Imagine stacking books on a table. The bottom book carries all the weight above it. Now cut a rectangular hole through the middle of the stack — the books around the hole must carry extra weight because the hole can\'t support anything. The relieving chambers above the King\'s Chamber work like reinforced "book edges" around that hole.',
      storyConnection: 'The Great Pyramid\'s King\'s Chamber sits at 43 m height with 96 m of stone above it — roughly 2 million tonnes pressing down. The five relieving chambers above it distribute this load to the chamber walls, preventing the ceiling from collapsing. This is stress engineering at monumental scale, achieved without any mathematical theory of stress.',
      checkQuestion: 'The pyramid base is 230 m x 230 m. The total mass is 6.1 million tonnes. What is the average stress at the base?',
      checkAnswer: 'Area = 230^2 = 52,900 m^2. Weight = 6.1e6 * 1000 * 9.81 = 5.98e10 N. Stress = 5.98e10 / 52,900 = 1.13 MPa. Limestone\'s compressive strength is ~40 MPa, so the base is at only 2.8% of failure — a safety factor of 35. The pyramid is massively over-engineered at the base.',
      codeIntro: 'Build a 2D stress model of the Great Pyramid cross-section including the King\'s Chamber void.',
      code: `import numpy as np

# Great Pyramid dimensions
H = 146.5       # original height (m)
B = 230.4       # base width (m)
density = 2500  # limestone kg/m3
g = 9.81

# Divide into layers
n_layers = 30
layer_h = H / n_layers

print("=== 2D Stress Profile — Great Pyramid Cross-Section ===")
print(f"Height: {H}m | Base: {B}m | Density: {density} kg/m3\\\n")

print(f"{'Height (m)':>10} {'Width (m)':>10} {'Weight above (MN)':>18} {'Stress (kPa)':>14} {'% of limit':>10}")
print("-" * 64)

cumulative_weight = 0  # Newtons
kings_chamber_h = 43   # metres from base

for i in range(n_layers):
    h_top = H - i * layer_h
    h_bot = H - (i + 1) * layer_h
    h_mid = (h_top + h_bot) / 2

    # Width at this height (linear taper from apex to base)
    w_top = B * (1 - h_top / H)
    w_bot = B * (1 - h_bot / H)
    w_mid = (w_top + w_bot) / 2

    # Volume of this trapezoidal layer (per unit depth)
    layer_vol = (w_top + w_bot) / 2 * layer_h * 1  # 1m depth slice
    layer_weight = layer_vol * density * g

    cumulative_weight += layer_weight

    # Stress at bottom of this layer
    area = w_bot * 1  # 1m depth
    stress_kpa = cumulative_weight / area / 1000 if area > 0 else 0
    pct_limit = stress_kpa / 40000 * 100  # limestone limit ~40 MPa

    # Mark King's Chamber level
    marker = " <-- King's Chamber" if abs(h_mid - kings_chamber_h) < layer_h else ""
    print(f"{h_mid:>8.1f} {w_mid:>8.1f} {cumulative_weight/1e6:>16.2f} "
          f"{stress_kpa:>12.1f} {pct_limit:>8.1f}%{marker}")

# Stress concentration at King's Chamber
print("\\\n=== Stress Concentration at King's Chamber ===")
kc_width = 5.2     # chamber width (m)
kc_height = 5.8    # chamber height (m)
kc_level = 43      # height from base (m)

wall_width_at_kc = B * (1 - kc_level / H)
effective_width = wall_width_at_kc - kc_width
scf = wall_width_at_kc / effective_width  # basic stress concentration factor

# Weight above King's Chamber
weight_above = 0
for i in range(n_layers):
    h_top = H - i * layer_h
    h_bot = H - (i + 1) * layer_h
    if h_bot >= kc_level:
        w_top = B * (1 - h_top / H)
        w_bot = B * (1 - h_bot / H)
        vol = (w_top + w_bot) / 2 * layer_h * 1
        weight_above += vol * density * g

nominal_stress = weight_above / (wall_width_at_kc * 1) / 1000
peak_stress = nominal_stress * scf * 1.8  # corner amplification

print(f"Wall width at chamber level: {wall_width_at_kc:.1f} m")
print(f"Chamber width: {kc_width} m")
print(f"Effective load-bearing width: {effective_width:.1f} m")
print(f"Nominal stress: {nominal_stress:.0f} kPa")
print(f"Peak stress at chamber corners: {peak_stress:.0f} kPa ({peak_stress/40000*100:.1f}% of limit)")
print(f"Stress concentration factor: {scf * 1.8:.1f}x")
print(f"\\\nThe 5 relieving chambers reduce peak stress by distributing")
print(f"the load across a wider area above the King's Chamber.")`,
      challenge: 'The Grand Gallery (47 m long, 8.5 m tall, 2 m wide) creates an even larger void than the King\'s Chamber. Model its stress concentration. Why did the builders use a corbelled ceiling (stepped inward) instead of flat beams? (A corbelled ceiling distributes stress more gradually than a flat span.)',
      successHint: 'You performed a structural analysis of one of humanity\'s greatest engineering achievements. The same FEA principles apply to designing modern skyscrapers, bridges, and tunnels — dividing a complex structure into elements and calculating stress at each point to find where failure is most likely.',
    },
    {
      title: 'Astronomical alignment precision — statistical analysis of accuracy',
      concept: `The Great Pyramid\'s base is aligned to true north with an error of only 3 arcminutes (0.05 degrees). How precise is this, and how might it have been achieved?

**Statistical analysis** helps us evaluate this claim. If the builders had simply pointed at the North Star (which in 2560 BCE was Thuban, not Polaris), their accuracy would depend on:
1. The angular diameter of the reference star (~0.01 degrees)
2. Atmospheric refraction near the horizon (~0.5 degrees)
3. Measurement tool precision (merkhet — a plumb line and sighting bar)

To test whether the alignment could be achieved by chance or required systematic technique, we calculate the **probability** of achieving 3 arcminutes accuracy with different methods.

The leading theory: the builders used **simultaneous transit** — watching a star cross due north as it rises and as it sets, then bisecting the angle. This method cancels systematic errors and achieves arcminute precision even with crude instruments.

*Archaeoastronomy uses statistics to distinguish intentional alignment from coincidence. A single alignment could be luck; consistent alignment across multiple structures is evidence of technique.*`,
      analogy: 'Imagine throwing darts at a board blindfolded. Occasionally you\'ll hit the bullseye by luck. But if you hit it 4 times out of 4 (the four sides of the pyramid base are all aligned), that\'s not luck — it\'s skill. Statistical analysis tells us exactly how unlikely the "luck" explanation is.',
      storyConnection: 'All three Giza pyramids are aligned to within 5 arcminutes of true north — and they were built over a span of 75 years by different pharaohs. This consistency across multiple structures and generations proves the alignment was achieved by a reliable, teachable technique — not a lucky one-off measurement.',
      checkQuestion: 'If random orientation gives any angle from 0-360 degrees, what is the probability of being within 3 arcminutes (0.05 degrees) of true north by pure chance?',
      checkAnswer: 'P = 2 * 0.05 / 360 = 0.000278 (the factor of 2 accounts for +/- error). That\'s a 0.028% chance — about 1 in 3,600. For all four sides to be within 3 arcminutes independently: (0.000278)^4 = essentially zero. This is NOT chance.',
      codeIntro: 'Analyse the statistical significance of pyramid alignment and model different measurement techniques.',
      code: `import numpy as np

np.random.seed(42)

# Alignment data for Giza pyramids (arcminutes from true north)
alignments = {
    "Great Pyramid (Khufu)": {"error_arcmin": 3.4, "date_bce": 2560},
    "Pyramid of Khafre":     {"error_arcmin": 5.3, "date_bce": 2520},
    "Pyramid of Menkaure":   {"error_arcmin": 12.2, "date_bce": 2490},
}

print("=== Pyramid Alignment Analysis ===\\\n")
for name, data in alignments.items():
    err_deg = data["error_arcmin"] / 60
    # Probability of this accuracy by chance
    p_chance = 2 * err_deg / 360
    print(f"{name}:")
    print(f"  Error: {data['error_arcmin']:.1f} arcmin ({err_deg:.4f} degrees)")
    print(f"  P(by chance): {p_chance:.6f} ({1/p_chance:.0f}:1 against)")
    print()

# Combined probability (independent alignments)
combined_p = 1
for data in alignments.values():
    combined_p *= 2 * (data["error_arcmin"] / 60) / 360
print(f"Combined probability (all three by chance): {combined_p:.2e}")
print(f"This is approximately 1 in {1/combined_p:.0f} — clearly intentional.\\\n")

# Model different alignment techniques
print("=== Simulated Alignment Methods (10,000 trials each) ===\\\n")

def simulate_alignment(method, n_trials=10000):
    """Simulate alignment errors for different techniques."""
    if method == "random":
        return np.random.uniform(-180, 180, n_trials)
    elif method == "pole_star":
        # Thuban was ~2 degrees from true pole in 2560 BCE
        pole_offset = 2.0 * 60  # arcminutes
        instrument_error = np.random.normal(0, 15, n_trials)  # arcmin
        return instrument_error + pole_offset
    elif method == "solar_noon":
        # Shadow at solar noon points north, but equation of time adds error
        eot_error = np.random.normal(0, 8, n_trials)  # arcminutes
        shadow_precision = np.random.normal(0, 5, n_trials)
        return eot_error + shadow_precision
    elif method == "simultaneous_transit":
        # Watch star rise and set, bisect angle — errors cancel
        rise_error = np.random.normal(0, 10, n_trials)  # arcmin
        set_error = np.random.normal(0, 10, n_trials)
        # Bisecting cancels systematic error, reduces random by sqrt(2)
        return (rise_error + set_error) / 2
    elif method == "indian_circle":
        # Mark shadow tips at equal lengths, bisect
        shadow_error = np.random.normal(0, 6, n_trials)
        bisect_error = np.random.normal(0, 3, n_trials)
        return shadow_error + bisect_error

methods = [
    ("random", "Random guess"),
    ("pole_star", "Pole star (Thuban)"),
    ("solar_noon", "Solar noon shadow"),
    ("simultaneous_transit", "Simultaneous transit"),
    ("indian_circle", "Indian circle method"),
]

print(f"{'Method':<28} {'Median |err|':>12} {'Std dev':>8} {'P(< 5 arcmin)':>14}")
print("-" * 64)

for method_id, method_name in methods:
    errors = simulate_alignment(method_id)
    median_abs = np.median(np.abs(errors))
    std = np.std(errors)
    p_within_5 = np.mean(np.abs(errors) < 5) * 100
    print(f"{method_name:<28} {median_abs:>10.1f}' {std:>7.1f}' {p_within_5:>12.1f}%")

print("\\\nThe simultaneous transit method best matches the observed accuracy.")
print("It naturally cancels systematic errors through symmetry — a brilliant technique.")`,
      challenge: 'Precession of the equinoxes shifts the celestial pole over millennia. In 2560 BCE, Thuban was the pole star but was 2 degrees from the true pole. By 2000 CE, Polaris is within 0.7 degrees. How does the era affect pole-star alignment accuracy? Model both epochs.',
      successHint: 'You combined statistics, astronomy, and measurement science to analyse an ancient engineering achievement. This interdisciplinary approach — using quantitative methods to test archaeological hypotheses — is the foundation of archaeoastronomy, a field that reveals the scientific sophistication of ancient civilisations.',
    },
    {
      title: 'Workforce optimisation — linear programming for labour allocation',
      concept: `The Great Pyramid required approximately 20,000-30,000 workers at peak construction. These workers performed different tasks: quarrying, block transport, ramp building, block placement, and support services (food, water, tool repair). Each task has different skill requirements and productivity rates.

**Linear programming (LP)** finds the optimal allocation of workers to tasks. The objective is to **maximise daily block placement** (the final output) subject to constraints:
- Total workers cannot exceed the available workforce
- Each task has a minimum staffing requirement
- Output of each stage must balance (no use quarrying 500 blocks if transport can only move 200)
- Skilled workers are limited (not everyone can be a mason)

The LP solution finds the worker allocation that produces the maximum throughput — often revealing that moving even a few workers between tasks can dramatically improve output.

*Linear programming was developed by George Dantzig in 1947. The pyramid builders solved the same allocation problem through experience and trial-and-error over 20 years.*`,
      analogy: 'You\'re managing a restaurant with 30 staff. If you put 20 in the kitchen and 10 as waiters, food piles up unserved. If you put 10 in the kitchen and 20 as waiters, waiters stand idle. The optimal split depends on how fast each group works and what the bottleneck is. LP finds the exact numbers that maximise meals served per hour.',
      storyConnection: 'Ancient Egyptian administrative papyri record detailed work gang rosters, ration allocations, and daily output tallies. The "Diary of Merer" papyrus (discovered 2013 at Wadi al-Jarf) records a team leader\'s daily log of transporting limestone blocks, including crew sizes, trip counts, and travel times — the raw data an LP solver would need.',
      checkQuestion: 'You have 100 workers. Quarrying needs 1 worker per 5 blocks/day. Transport needs 1 worker per 2 blocks/day. Placement needs 1 worker per 4 blocks/day. What allocation maximises blocks placed?',
      checkAnswer: 'Let q, t, p = workers in each task. Constraints: q + t + p = 100, and 5q = 2t = 4p (balanced flow). From 5q = 2t: t = 2.5q. From 5q = 4p: p = 1.25q. So q + 2.5q + 1.25q = 100, giving q = 21, t = 53, p = 26. Output: 5 * 21 = 105 blocks/day.',
      codeIntro: 'Optimise workforce allocation across pyramid construction tasks using a simplified linear programming approach.',
      code: `import numpy as np

# Task definitions
tasks = [
    {"name": "Quarrying",        "blocks_per_worker": 5,  "min_workers": 20, "skill": "general"},
    {"name": "Block shaping",    "blocks_per_worker": 3,  "min_workers": 15, "skill": "mason"},
    {"name": "Sledge transport", "blocks_per_worker": 1.5,"min_workers": 50, "skill": "general"},
    {"name": "Ramp hauling",     "blocks_per_worker": 2,  "min_workers": 40, "skill": "general"},
    {"name": "Block placement",  "blocks_per_worker": 4,  "min_workers": 10, "skill": "mason"},
    {"name": "Ramp maintenance", "blocks_per_worker": 8,  "min_workers": 10, "skill": "general"},
    {"name": "Support services", "blocks_per_worker": 0,  "min_workers": 30, "skill": "general"},
]

total_workers = 20000
skilled_masons = 3000  # limited pool

# Brute force search over allocations
def evaluate_allocation(workers_per_task):
    """Throughput = minimum output across all production stages."""
    outputs = []
    for i, t in enumerate(tasks):
        if t["blocks_per_worker"] > 0:
            outputs.append(workers_per_task[i] * t["blocks_per_worker"])
    return min(outputs)  # bottleneck determines throughput

# Start with minimum allocation
current = [t["min_workers"] for t in tasks]
remaining = total_workers - sum(current)

# Check mason constraint
mason_tasks = [i for i, t in enumerate(tasks) if t["skill"] == "mason"]
mason_used = sum(current[i] for i in mason_tasks)
mason_remaining = skilled_masons - mason_used

print("=== Workforce Optimisation — Great Pyramid ===")
print(f"Total workers: {total_workers:,} | Skilled masons: {skilled_masons:,}\\\n")

# Iterative bottleneck relief
print("Starting from minimum staffing:")
for t, w in zip(tasks, current):
    output = w * t["blocks_per_worker"] if t["blocks_per_worker"] > 0 else 0
    print(f"  {t['name']:<20} {w:>5} workers -> {output:>6.0f} blocks/day")
print(f"  Throughput: {evaluate_allocation(current):.0f} blocks/day")
print(f"  Remaining to allocate: {remaining:,}")

# Greedy bottleneck relief
for iteration in range(20):
    if remaining <= 0:
        break
    # Find bottleneck
    outputs = []
    for i, t in enumerate(tasks):
        if t["blocks_per_worker"] > 0:
            outputs.append((current[i] * t["blocks_per_worker"], i))
    outputs.sort()
    bottleneck_idx = outputs[0][1]
    bottleneck_task = tasks[bottleneck_idx]

    # Add workers to bottleneck
    add = min(remaining, 500)
    if bottleneck_task["skill"] == "mason":
        add = min(add, mason_remaining)
        mason_remaining -= add
    current[bottleneck_idx] += add
    remaining -= add

print(f"\\\nOptimised allocation (after bottleneck relief):")
print(f"{'Task':<20} {'Workers':>8} {'Output':>10} {'Bottleneck?':>12}")
print("-" * 52)
throughput = evaluate_allocation(current)
for i, t in enumerate(tasks):
    output = current[i] * t["blocks_per_worker"] if t["blocks_per_worker"] > 0 else 0
    is_bn = "<<< YES" if t["blocks_per_worker"] > 0 and abs(output - throughput) < 1 else ""
    print(f"  {t['name']:<20} {current[i]:>6} {output:>8.0f}/day {is_bn}")

print(f"\\\nOptimised throughput: {throughput:.0f} blocks/day")
print(f"Total workers used: {sum(current):,}")
print(f"Blocks per year (300 days): {throughput * 300:,.0f}")
print(f"Years for 2.3M blocks: {2_300_000 / (throughput * 300):.1f}")`,
      challenge: 'Add a seasonal constraint: during the 3-month Nile flood season, 5,000 workers must be reassigned to agriculture. How does this seasonal reduction affect annual output? Should the builders adjust the allocation differently for flood vs dry season?',
      successHint: 'Linear programming is used everywhere: airline crew scheduling, factory production planning, investment portfolio optimisation, and military logistics. The core insight — finding the allocation that maximises output given constraints — is one of the most powerful ideas in operations research.',
    },
    {
      title: 'Erosion modelling — predicting pyramid degradation over millennia',
      concept: `The Great Pyramid originally stood 146.5 m tall with smooth white Tura limestone casing. Today it stands 138.8 m tall with the casing almost entirely stripped. The degradation comes from three sources:

1. **Wind erosion**: sand-laden wind abrades exposed limestone at 0.01-0.05 mm/year
2. **Chemical weathering**: acid rain (even natural CO2-dissolved rain at pH ~5.6) slowly dissolves calcium carbonate: CaCO3 + H2O + CO2 -> Ca(HCO3)2
3. **Human activity**: the casing was stripped for Cairo construction (1200s CE), and modern tourism causes foot traffic erosion

Erosion modelling combines these processes over time:

**Total erosion = wind_rate * t + chemical_rate * t + human_events**

But each rate varies with exposure, climate, and surface condition. Freshly exposed surfaces erode faster than weathered surfaces (which develop a protective patina).

*The Sphinx shows differential erosion: vertical channels from rainwater (suggesting a wetter climate in its early millennia) and horizontal striations from wind (the current desert climate). Erosion patterns are a geological clock.*`,
      analogy: 'Leave a bar of soap in the shower. Each day, a thin layer dissolves. After a year, it\'s noticeably smaller. After ten years, it would be gone. The pyramid is a giant "bar" of limestone dissolving in rain, abraded by wind, and chipped by tourists. The question is: how fast, and how much is left after 4,500 years?',
      storyConnection: 'The pyramid has lost 7.7 m of height and its entire casing in 4,500 years. But most of the casing loss was sudden (stripped by humans in the 1200s), not gradual erosion. Without human intervention, the casing would have lasted tens of thousands of years. The erosion model must separate natural weathering from catastrophic human events.',
      checkQuestion: 'If wind erosion removes 0.03 mm/year from exposed limestone, how much surface is lost in 4,500 years?',
      checkAnswer: '0.03 * 4500 = 135 mm = 13.5 cm. This is negligible for a structure with blocks averaging 1.2 m thick. Wind erosion alone would take ~40,000 years to erode through a single block. The real damage comes from water, earthquakes, and humans.',
      codeIntro: 'Model multi-factor pyramid degradation over 5,000 years including wind, rain, earthquakes, and human activity.',
      code: `import numpy as np

np.random.seed(42)

def simulate_pyramid_erosion(n_years=5000, n_sims=500):
    """Monte Carlo erosion simulation for the Great Pyramid."""
    original_height = 146.5  # metres
    original_casing = 100    # % casing intact

    results = []

    for sim in range(n_sims):
        height = original_height
        casing = original_casing
        height_history = [height]

        for year in range(1, n_years + 1):
            # Wind erosion: 0.01-0.05 mm/year on exposed surfaces
            wind = np.random.uniform(0.01, 0.05) / 1000  # metres
            # Only erodes where casing is missing
            wind_loss = wind * (1 - casing / 100) * 0.1  # height effect

            # Chemical weathering: pH-dependent dissolution
            rain_ph = np.random.normal(5.6, 0.3)
            acid_rate = 0.02 * (10 ** (5.6 - rain_ph)) / 1000  # metres
            chem_loss = acid_rate * 0.05

            # Natural casing deterioration: very slow
            casing_natural_loss = np.random.uniform(0, 0.005)

            # Earthquake events (0.3% per year in Egypt)
            if np.random.random() < 0.003:
                eq_magnitude = np.random.uniform(4, 7)
                if eq_magnitude > 5.5:
                    height_loss = (eq_magnitude - 5) * np.random.uniform(0.1, 0.5)
                    height -= height_loss
                    casing -= np.random.uniform(1, 5)

            # Human stripping event (historically ~1200-1400 CE)
            year_ce = year - 2560  # convert to CE
            if 1200 <= year_ce <= 1400:
                casing -= np.random.uniform(0.2, 0.8)

            # Modern tourism erosion (post-1800 CE)
            if year_ce > 1800:
                height -= 0.0001  # negligible per year but cumulative

            # Apply natural erosion
            height -= (wind_loss + chem_loss)
            casing = max(0, casing - casing_natural_loss)
            height = max(100, height)  # can't erode below core

            if year % 500 == 0 or year == n_years:
                height_history.append(height)

        results.append({"final_height": height, "final_casing": casing,
                        "history": height_history})

    return results

results = simulate_pyramid_erosion()

# Extract statistics
final_heights = [r["final_height"] for r in results]
final_casings = [r["final_casing"] for r in results]

print("=== Pyramid Erosion Model — 5,000 Year Simulation ===")
print(f"Original height: 146.5 m | Simulations: {len(results)}\\\n")

print(f"After 5,000 years:")
print(f"  Height — Median: {np.median(final_heights):.1f} m | "
      f"Range: {np.min(final_heights):.1f} - {np.max(final_heights):.1f} m")
print(f"  Actual (today): 138.8 m")
print(f"  Casing — Median: {np.median(final_casings):.1f}% remaining")
print(f"  Actual (today): ~0% (almost entirely stripped)")

# Height over time
print("\\\n=== Height Trajectory (median across simulations) ===")
checkpoints = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]
print(f"{'Year':>6} {'Era':>16} {'Height (m)':>12} {'Loss (m)':>10}")
print("-" * 46)

for idx, year in enumerate(checkpoints):
    heights_at_year = [r["history"][idx] for r in results if idx < len(r["history"])]
    if heights_at_year:
        median_h = np.median(heights_at_year)
        loss = 146.5 - median_h
        year_ce = year - 2560
        era = f"{abs(year_ce)} {'CE' if year_ce >= 0 else 'BCE'}"
        print(f"{year:>5} {era:>16} {median_h:>10.1f} {loss:>8.1f}")

# Erosion rate by source
print("\\\n=== Erosion Contribution by Source ===")
sources = [
    ("Wind abrasion", 0.03, "mm/year on exposed face"),
    ("Chemical weathering", 0.01, "mm/year (rain dissolution)"),
    ("Earthquake damage", 0.5, "m per major event (rare)"),
    ("Human stripping", 7.7, "m total (1200-1400 CE)"),
    ("Tourism", 0.01, "mm/year (post-1800)"),
]
for name, rate, unit in sources:
    print(f"  {name:<24} {rate:>6.2f} {unit}")`,
      challenge: 'Climate change models predict Egypt will get 10-20% less rainfall but more intense storms by 2100. Modify the erosion model to project pyramid condition in the year 3000 under climate change. Does reduced total rainfall help (less chemical weathering) or hurt (more intense erosion per storm)?',
      successHint: 'You built a multi-factor erosion model that separates natural weathering from human impact — the same methodology used by heritage conservationists worldwide to plan preservation of monuments from the Parthenon to Angkor Wat. Understanding degradation rates is essential for deciding what to protect and how.',
    },
    {
      title: 'Internal ramp theory — modelling Houdin\'s spiral ramp hypothesis',
      concept: `How did the Egyptians lift 2.5-tonne blocks to a height of 146 metres? The leading modern theory, proposed by architect Jean-Pierre Houdin in 2007, suggests an **internal spiral ramp**.

The external ramp theory has a fatal flaw: a straight ramp at 7 degrees to reach 146 m height would need to be 1.2 km long and contain more material than the pyramid itself. Houdin proposed that the builders used:
1. A **straight external ramp** for the lower 43 m (65% of the volume)
2. An **internal spiral ramp** within the pyramid structure for the upper courses

The internal ramp runs along the inside of each face, turning 90 degrees at each corner. At each corner, a small open notch allows the block sledge to be rotated.

**Force analysis**: On a 7-degree internal ramp, the pulling force is:
F = mg(sin(theta) + mu * cos(theta))

For a 2,500 kg block: F = 2500 * 9.81 * (sin(7) + 0.2 * cos(7)) = 7,850 N = ~16 workers.

*Microgravity surveys of the Great Pyramid in 1986 detected a spiral-shaped density anomaly consistent with an internal ramp — physical evidence supporting Houdin\'s theory.*`,
      analogy: 'Imagine building a multi-storey car park. You don\'t build a massive external ramp from the ground to the top floor — you build the ramp INSIDE the structure, spiralling up floor by floor. Houdin\'s internal ramp is the same idea: the ramp is built into the pyramid walls as they rise, then filled in once each section is complete.',
      storyConnection: 'The Great Pyramid\'s corners show slightly less density in microgravity surveys — exactly where Houdin predicts the ramp turns would be. The "notches" at the corners have been observed by climbers. And the ramp\'s 7-degree slope is consistent with the angle that minimises total construction effort for the given block mass.',
      checkQuestion: 'Why can\'t the entire pyramid be built with just an external ramp? What\'s the logistical problem?',
      checkAnswer: 'A straight ramp to 146 m at 7 degrees is 1,200 m long. At the top, it would need to be ~10 m wide for sledge traffic. Its volume would be ~2.5 million cubic metres — comparable to the pyramid itself (2.6 million m3). You\'d need to build a second pyramid just for the ramp, then dismantle it afterward.',
      codeIntro: 'Model the internal ramp geometry, calculate forces at each level, and compare ramp theories.',
      code: `import numpy as np

# Pyramid dimensions
H = 146.5        # height (m)
B = 230.4        # base width (m)
block_mass = 2500  # kg
g = 9.81
mu = 0.20        # friction (damp sand/sledge)

# External ramp analysis
print("=== External Ramp Analysis ===")
ramp_angles = [5, 7, 10, 15]
for angle in ramp_angles:
    rad = np.radians(angle)
    length = H / np.sin(rad)
    # Ramp cross-section: width 10m, height grows linearly
    ramp_volume = 0.5 * length * H * 10  # triangular prism
    pull_force = block_mass * g * (np.sin(rad) + mu * np.cos(rad))
    workers = int(np.ceil(pull_force / 500))
    print(f"  {angle} deg: length {length:.0f}m, volume {ramp_volume/1e6:.1f}M m3, "
          f"force {pull_force:.0f}N ({workers} workers)")

pyramid_volume = B**2 * H / 3
print(f"\\\nPyramid volume: {pyramid_volume/1e6:.1f}M m3")
print(f"A 7-degree ramp uses {0.5 * (H/np.sin(np.radians(7))) * H * 10 / 1e6 / (pyramid_volume/1e6) * 100:.0f}% "
      f"as much material as the pyramid itself!")

# Internal spiral ramp model
print("\\\n=== Houdin's Internal Spiral Ramp ===")
ramp_angle = 7  # degrees
ramp_width = 2.0  # metres
ramp_height = 2.5  # metres (clearance)

# Calculate ramp at different pyramid heights
print(f"{'Level (m)':>10} {'Pyramid width':>14} {'Ramp length/turn':>17} {'Force (N)':>10} {'Workers':>8}")
print("-" * 61)

total_ramp_length = 0
levels = np.arange(0, H, 5)

for h in levels:
    # Pyramid width at this height
    w = B * (1 - h / H)
    # One turn of the ramp = perimeter at this height
    perimeter = 4 * (w - 2 * ramp_width)  # inner perimeter
    if perimeter <= 0:
        break

    # Height gained per turn
    height_per_turn = perimeter * np.tan(np.radians(ramp_angle))

    # Force to pull block up ramp at this level
    rad = np.radians(ramp_angle)
    force = block_mass * g * (np.sin(rad) + mu * np.cos(rad))
    workers = int(np.ceil(force / 500))

    total_ramp_length += perimeter

    if int(h) % 20 == 0:
        print(f"{h:>8.0f} {w:>12.1f}m {perimeter:>15.1f}m {force:>8.0f} {workers:>6}")

# Ramp volume comparison
internal_volume = total_ramp_length * ramp_width * ramp_height
external_7deg = 0.5 * (H / np.sin(np.radians(7))) * H * 10

print(f"\\\n=== Ramp Volume Comparison ===")
print(f"External ramp (7 deg): {external_7deg:,.0f} m3")
print(f"Internal ramp:         {internal_volume:,.0f} m3")
print(f"Saving:                {(1 - internal_volume/external_7deg)*100:.0f}%")

# Hybrid model: external ramp to 43m, internal above
print("\\\n=== Hybrid Strategy (Houdin's proposal) ===")
switchover = 43  # metres
ext_ramp_length = switchover / np.sin(np.radians(7))
ext_ramp_vol = 0.5 * ext_ramp_length * switchover * 10

# Volume of pyramid below and above switchover
vol_below = (B**2 * switchover / 3) * (1 - (1 - switchover/H)**3) / (switchover/H)
vol_total = B**2 * H / 3
pct_below = 65  # approximately 65% of volume is in lower 43m

print(f"External ramp: ground to {switchover}m ({pct_below}% of pyramid volume)")
print(f"  Ramp length: {ext_ramp_length:.0f}m | Volume: {ext_ramp_vol:,.0f} m3")
print(f"Internal ramp: {switchover}m to {H}m ({100-pct_below}% of volume)")
print(f"  Ramp volume: {internal_volume * 0.35:,.0f} m3 (upper section only)")
print(f"\\\nTotal ramp material: {ext_ramp_vol + internal_volume * 0.35:,.0f} m3")
print(f"vs full external ramp: {external_7deg:,.0f} m3")
print(f"Material saving: {(1 - (ext_ramp_vol + internal_volume*0.35)/external_7deg)*100:.0f}%")`,
      challenge: 'The corner turns are the hardest part of the internal ramp — the sledge must rotate 90 degrees in a cramped space. Model the geometry of a corner turn: what minimum turning radius is needed for a 2.5m sledge? How wide must the corner notch be? This is the most debated aspect of Houdin\'s theory.',
      successHint: 'You analysed the engineering feasibility of a controversial archaeological hypothesis using force calculations, geometry, and volume analysis. This is exactly how engineers evaluate proposed solutions — not by opinion, but by calculating whether the physics works. Houdin\'s theory passes the quantitative test where the external ramp theory fails.',
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
            Level 3 covers finite element stress analysis, astronomical alignment, workforce optimisation, erosion modelling, and internal ramp theory.
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
