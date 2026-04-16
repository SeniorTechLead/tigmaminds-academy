import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function EmbalmingLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Decomposition — what happens when cells die',
      concept: `When an organism dies, two processes begin immediately: **autolysis** (self-digestion) and **putrefaction** (bacterial decomposition).

**Autolysis** happens first — within hours. Living cells contain **lysosomes** — compartments filled with digestive enzymes. While the cell is alive, these enzymes are safely contained. When the cell dies and its membranes break down, the enzymes leak out and begin digesting the cell from the inside. The cell eats itself.

**Putrefaction** follows — bacteria that normally live harmlessly in the gut and on the skin invade the dead tissues. They feed on the cellular debris, producing gases (hydrogen sulphide, methane, ammonia) and enzymes that liquefy tissue. In warm conditions (above 25°C), a body can be reduced to skeleton in **2-3 weeks**.

Both processes require **water**. Enzymes need water as a solvent to function. Bacteria are about 70% water and need aqueous environments to metabolize. This is the key insight the Egyptians exploited: **remove the water, and you stop both processes**.

📚 *Water activity (aW) measures how much water in a material is available for microbial growth. Pure water: aW = 1.0. Most bacteria need aW > 0.9. Below 0.6, virtually nothing can grow. Dried foods and mummies have aW < 0.3.*`,
      analogy: 'Leave a fresh apple on the counter for two weeks. It turns brown (autolysis — its own enzymes oxidize the flesh), gets soft (putrefaction — bacteria break down the cell walls), and eventually rots to mush. Now dry the apple into a chip. The chip lasts for years — same material, but without water, the enzymes and bacteria can\'t work.',
      storyConnection: 'The Egyptian embalmers didn\'t know about enzymes or bacteria — those wouldn\'t be discovered for another 3,000 years. But they observed that drying meat preserved it, that salt prevented decay, and that resin-coated objects lasted longer. They applied these observations systematically to develop the most effective preservation technology the ancient world had ever seen.',
      checkQuestion: 'Why does meat spoil faster at room temperature than in the refrigerator?',
      checkAnswer: 'Both autolysis and bacterial activity are **temperature-dependent** chemical reactions. They follow the Arrhenius equation: reaction rate roughly doubles for every 10°C increase. At 37°C (body temperature), bacteria divide every 20 minutes. At 4°C (refrigerator), they divide every 3-4 hours — about 10× slower. Refrigeration doesn\'t stop decay, it just slows it dramatically.',
      codeIntro: 'Model the decomposition process — track tissue breakdown from autolysis and bacterial action.',
      code: `import numpy as np

def decomposition_model(temperature_C, humidity_pct, days,
                         initial_tissue_pct=100):
    """
    Model tissue decomposition as a function of temperature and humidity.
    Returns tissue remaining (%) over time.
    """
    # Arrhenius-like temperature factor (doubling every 10°C above 15°C)
    temp_factor = 2 ** ((temperature_C - 15) / 10)
    temp_factor = max(temp_factor, 0.1)  # minimum at very cold temps

    # Water activity from humidity
    water_activity = humidity_pct / 100

    # Decomposition rate depends on temp × water activity
    # Base rate: ~5% per day at 25°C, 80% humidity
    base_rate = 0.05
    rate = base_rate * temp_factor * water_activity ** 2

    tissue = initial_tissue_pct
    history = [tissue]

    for day in range(days):
        # Autolysis (first 3 days, then diminishes)
        autolysis_rate = rate * max(0, 1 - day / 10) * 0.3
        # Bacterial decomposition (increases over first week, then levels)
        bacterial_rate = rate * min(1, day / 5) * 0.7

        total_loss = tissue * (autolysis_rate + bacterial_rate)
        tissue = max(0, tissue - total_loss)
        history.append(tissue)

    return history

# Compare conditions
print("=== Decomposition Under Different Conditions ===")
print()

conditions = [
    ("Egyptian desert (40°C, 20%)", 40, 20),
    ("Tropical (30°C, 90%)", 30, 90),
    ("Room temperature (22°C, 50%)", 22, 50),
    ("Refrigerated (4°C, 80%)", 4, 80),
    ("Frozen (-20°C, 0%)", -20, 0),
    ("Natron treatment (25°C, 5%)", 25, 5),
]

days = 70  # the 70-day mummification period

print(f"{'Condition':<35} {'Day 1':>7} {'Day 7':>7} {'Day 14':>7} {'Day 30':>7} {'Day 70':>7}")
print("-" * 72)

for name, temp, humidity in conditions:
    history = decomposition_model(temp, humidity, days)
    print(f"{name:<35} {history[1]:>5.0f}% {history[7]:>5.0f}% "
          f"{history[14]:>5.0f}% {history[30]:>5.0f}% {history[70]:>5.0f}%")

# Key insight: water activity is the critical variable
print(f"\
=== Water Activity vs Decomposition Rate ===")
print(f"Temperature held constant at 25°C\
")

print(f"{'Water Activity':>15} {'Humidity %':>11} {'Day 7 tissue':>13} {'Day 30 tissue':>14} {'Example'}")
print("-" * 68)

examples = {100: "Standing water", 80: "Humid room", 60: "Dry room",
            40: "Air-conditioned", 20: "Desert air", 5: "In natron salt",
            0: "Completely dry"}

for humidity in [100, 80, 60, 40, 20, 5, 0]:
    history = decomposition_model(25, humidity, 30)
    aw = humidity / 100
    print(f"{aw:>13.2f} {humidity:>9}% {history[7]:>11.0f}% {history[30]:>12.0f}% {examples.get(humidity, ''):>15}")

print(f"\
Below water activity 0.60, most bacteria cannot reproduce.")
print(f"Below 0.30, even enzymes cannot function.")
print(f"Natron reduces water activity to ~0.05 — complete preservation.")`,
      challenge: 'Model a body buried in permafrost (-10°C, 0% humidity) vs a body in a peat bog (4°C, 100% humidity, acidic water). Both can preserve bodies for thousands of years — but by different mechanisms. Permafrost freezes everything. Peat bogs are acidic (low pH inhibits bacteria) and anaerobic (no oxygen). Which preserves better and why?',
      successHint: 'You modeled the biochemistry of decomposition — the same science used in food preservation (drying, refrigeration, salting), forensic science (estimating time of death), and archaeology (understanding how ancient remains survived). The key variable: water activity determines whether chemistry can happen.',
    },
    {
      title: 'Osmosis — how natron pulls water from tissue',
      concept: `**Osmosis** is the movement of water through a semi-permeable membrane from a region of **low solute concentration** to a region of **high solute concentration**. The membrane allows water molecules to pass but blocks larger solute molecules.

When Egyptian embalmers packed a body in **natron** (a mixture of sodium carbonate and sodium chloride), the salt concentration outside the cells was much higher than inside. Water molecules migrated OUT of the cells by osmosis, through the cell membranes, into the natron crystals.

Over 40 days, the body lost approximately **75% of its weight** in water. The remaining tissue was so dry that neither enzymes nor bacteria could function. The body was effectively "freeze-dried" — but by salt, not cold.

The osmotic pressure of a solution is given by: **π = MRT** (van 't Hoff equation)

Where M is the molar concentration, R is the gas constant, and T is temperature. A concentrated natron solution generates osmotic pressures of **50-100 atmospheres** — enormous forces pulling water from tissue.

📚 *Osmotic pressure is the pressure needed to STOP osmosis. Seawater has an osmotic pressure of ~25 atm. To desalinate seawater by reverse osmosis, you must apply MORE than 25 atm of pressure to push water backward through the membrane.*`,
      analogy: 'Sprinkle salt on a slug. The slug shrivels — water is pulled out of its body by osmosis because the salt concentration on its skin is much higher than inside. The slug loses water through its permeable skin. The natron-covered body is the same, just slower — 40 days of sustained osmotic desiccation.',
      storyConnection: 'The embalmers packed natron inside the body cavity (after organ removal) and covered the exterior with a thick layer of dry natron crystals. The salt absorbed water from the tissue by osmosis, becoming wet in the process. The wet natron was periodically replaced with fresh dry natron to maintain the concentration gradient.',
      checkQuestion: 'Why did the Egyptians remove the internal organs before applying natron?',
      checkAnswer: 'The organs (liver, lungs, stomach, intestines) contain the highest concentration of water, digestive enzymes, and bacteria. They decompose fastest. Removing them reduces the water content that needs to be extracted and eliminates the biggest source of internal decay. The organs were treated separately with natron in canopic jars.',
      codeIntro: 'Model osmotic water loss from tissue during the 40-day natron desiccation process.',
      code: `import numpy as np

def osmotic_desiccation(initial_water_pct=60, natron_concentration=4.0,
                         temperature_C=25, days=70):
    """
    Model water loss from tissue packed in natron.
    Uses a simplified Fick's law of diffusion for osmotic transport.
    """
    # Osmotic pressure (van 't Hoff: π = MRT)
    R = 8.314  # J/(mol·K)
    T = temperature_C + 273.15  # Kelvin
    osmotic_pressure_atm = natron_concentration * R * T / 101325

    # Diffusion rate depends on osmotic pressure gradient
    # Simplified: rate proportional to (external - internal concentration)
    water_content = initial_water_pct
    internal_concentration = 0.3  # initial internal salt concentration (mol/L)

    history = {"day": [0], "water_pct": [water_content],
               "mass_pct": [100], "osmotic_p": [osmotic_pressure_atm]}

    for day in range(1, days + 1):
        # Concentration gradient drives water out
        conc_diff = natron_concentration - internal_concentration
        if conc_diff <= 0:
            break  # equilibrium reached

        # Water loss rate (proportional to gradient, decreasing as tissue dries)
        rate = 0.03 * conc_diff * (water_content / 60)  # slower as tissue dries
        water_loss = water_content * rate
        water_content = max(5, water_content - water_loss)  # minimum 5% (bound water)

        # Update internal concentration (increases as water leaves)
        internal_concentration = 0.3 * initial_water_pct / max(water_content, 1)

        # Mass loss (water leaving)
        mass_remaining = 100 - (initial_water_pct - water_content)

        history["day"].append(day)
        history["water_pct"].append(water_content)
        history["mass_pct"].append(mass_remaining)
        history["osmotic_p"].append(natron_concentration * R * T / 101325 - internal_concentration * R * T / 101325)

    return history

# Simulate the 40-day natron treatment
result = osmotic_desiccation()

print("=== Natron Desiccation Model ===")
print(f"Initial tissue: 60% water by weight")
print(f"Natron concentration: 4.0 mol/L")
print(f"Temperature: 25°C\
")

print(f"{'Day':>4} {'Water %':>9} {'Mass %':>8} {'Osmotic ΔP (atm)':>18}")
print("-" * 41)

for i in range(len(result["day"])):
    day = result["day"][i]
    if day % 5 == 0 or day in [1, 2, 3, 40, 70]:
        print(f"{day:>4} {result['water_pct'][i]:>7.1f}% {result['mass_pct'][i]:>6.1f}% "
              f"{result['osmotic_p'][i]:>16.1f}")

final_water = result["water_pct"][-1]
final_mass = result["mass_pct"][-1]
print(f"\
Final water content: {final_water:.1f}% (from {60}%)")
print(f"Final mass: {final_mass:.0f}% of original (lost {100-final_mass:.0f}% as water)")

# Compare desiccants
print(f"\
=== Desiccant Comparison ===")
desiccants = [
    ("Natron (NaCO₃ + NaCl)", 4.0, "Egyptian standard"),
    ("Pure salt (NaCl)", 5.5, "Meat preservation"),
    ("Silica gel", 0.5, "Modern electronics packaging"),
    ("Rice (traditional)", 0.3, "Camera dry boxes"),
    ("Calcium chloride", 7.0, "Industrial desiccant"),
]

print(f"{'Desiccant':<28} {'Conc (M)':>9} {'Day 40 water %':>15} {'Application'}")
print("-" * 70)

for name, conc, app in desiccants:
    result = osmotic_desiccation(natron_concentration=conc, days=40)
    final_w = result["water_pct"][-1]
    print(f"{name:<28} {conc:>7.1f} {final_w:>13.1f}% {app}")

# Osmotic pressure calculation
print(f"\
=== Osmotic Pressure Examples ===")
solutions = [
    ("Blood plasma", 0.3),
    ("Seawater", 1.1),
    ("Saturated NaCl", 6.1),
    ("Natron solution", 4.0),
    ("Honey", 20.0),
    ("Dead Sea water", 8.6),
]

R_val = 8.314
T_val = 298  # 25°C in Kelvin

print(f"{'Solution':<22} {'Conc (M)':>9} {'Osmotic P (atm)':>16}")
print("-" * 49)
for name, conc in solutions:
    p = conc * R_val * T_val / 101325
    print(f"{name:<22} {conc:>7.1f} {p:>14.1f}")

print(f"\
For comparison: atmospheric pressure = 1 atm")
print(f"Natron osmotic pressure: ~100 atm — enormous force pulling water out of tissue")`,
      challenge: 'Model "reverse osmosis" — the modern water purification method. If seawater has an osmotic pressure of ~27 atm, how much pressure must you apply to push pure water BACKWARD through the membrane? (At least 27 atm + friction losses ≈ 40-60 atm in practice.) This is how desalination plants work.',
      successHint: 'You modeled osmosis — one of the most important processes in biology and chemistry. It governs how cells absorb water, how kidneys filter blood, how plants draw water from soil, and how desalination produces fresh water. The same physics that preserved pharaohs now provides drinking water to millions.',
    },
    {
      title: 'Bacterial growth kinetics — the logistic equation',
      concept: `Bacteria grow exponentially — but not forever. Eventually, they run out of nutrients, accumulate waste products, or run out of space. The population plateaus at the **carrying capacity** (K).

The **logistic growth equation** models this:

**dN/dt = r × N × (1 - N/K)**

Where N is the population, r is the growth rate, and K is the carrying capacity. When N is small, growth is nearly exponential (N/K ≈ 0). When N approaches K, growth slows and stops (1 - N/K → 0).

This produces the characteristic **S-shaped curve**: slow start → rapid growth → plateau.

For mummification, the key is intervening BEFORE the exponential phase — removing water during the lag phase (first few hours) prevents bacteria from ever reaching the rapid growth phase.

📚 *The logistic equation was discovered by Pierre Verhulst in 1838. It models any population that grows in a limited environment: bacteria in a petri dish, humans on Earth, fish in a lake, followers on social media.*`,
      analogy: 'Pour yeast into a sugar solution. At first, nothing seems to happen (lag phase). Then the solution starts fizzing vigorously (exponential growth — the yeast is eating sugar and producing CO₂). Eventually, the fizzing slows and stops (plateau — the sugar is used up or the alcohol concentration has become toxic to the yeast). This S-curve is universal.',
      storyConnection: 'The embalmers had about **24-48 hours** before bacterial decomposition became visible and irreversible in the Egyptian heat (35-40°C). They began organ removal immediately after death — racing against bacterial growth. The 70-day timeline was structured: organ removal (days 1-2), natron packing (days 2-42), wrapping and resin coating (days 42-70).',
      checkQuestion: 'In the logistic equation, what happens when N = K/2 (population is half the carrying capacity)?',
      checkAnswer: 'Growth rate is maximized. dN/dt = r × (K/2) × (1 - 1/2) = r × K/4. At N < K/2, the (1-N/K) term is large but N is small. At N > K/2, N is large but (1-N/K) is small. The product N × (1-N/K) peaks at exactly N = K/2. This is the inflection point of the S-curve — where growth is fastest.',
      codeIntro: 'Model bacterial growth with and without mummification intervention — track populations over the 70-day process.',
      code: `import numpy as np

def logistic_growth(N0, r, K, days, dt=0.01):
    """
    Logistic growth model: dN/dt = r × N × (1 - N/K)
    Uses Euler's method for numerical integration.
    """
    N = N0
    steps_per_day = int(1 / dt)
    history = [(0, N)]

    for day in range(1, days + 1):
        for step in range(steps_per_day):
            dN = r * N * (1 - N / K) * dt
            N = max(0, N + dN)
        history.append((day, N))

    return history

def mummification_model(N0=1000, r=10, K=1e12, days=70):
    """
    Model bacterial population during mummification.
    Water activity decreases over time, reducing growth rate.
    """
    N = N0
    history = [(0, N, 1.0)]  # (day, population, water_activity)

    for day in range(1, days + 1):
        # Water activity decreases as natron removes water
        if day <= 2:
            water_activity = 0.95  # before natron applied
        elif day <= 42:
            # Linear decrease during natron treatment
            water_activity = 0.95 - (day - 2) / 40 * 0.85
        else:
            water_activity = 0.10  # after natron, coated in resin

        # Growth rate depends on water activity
        # Below 0.6, most bacteria can't grow
        effective_r = r * max(0, (water_activity - 0.6) / 0.4) ** 2

        # Logistic growth with reduced rate
        for step in range(100):
            dN = effective_r * N * (1 - N / K) * 0.01
            N = max(1, N + dN)

        # At very low water activity, bacteria die
        if water_activity < 0.3:
            N *= 0.95  # 5% die-off per day

        history.append((day, N, water_activity))

    return history

# Scenario 1: No mummification (body left at 35°C)
print("=== Bacterial Growth: No Preservation ===")
no_preservation = logistic_growth(N0=1000, r=15, K=1e12, days=14)

print(f"{'Day':>4} {'Bacteria':>15}")
print("-" * 21)
for day, count in no_preservation:
    if day % 2 == 0 or day <= 3:
        if count >= 1e9:
            print(f"{day:>4} {count:>13.2e}")
        else:
            print(f"{day:>4} {count:>13,.0f}")

# Scenario 2: Mummification
print(f"\
=== Bacterial Growth: With Mummification ===")
mummified = mummification_model()

print(f"{'Day':>4} {'Bacteria':>15} {'Water Activity':>15} {'Phase'}")
print("-" * 55)

for day, count, wa in mummified:
    if day % 5 == 0 or day in [1, 2, 3]:
        phase = "Pre-treatment" if day <= 2 else "Natron" if day <= 42 else "Wrapping"
        if count >= 1e9:
            count_str = f"{count:.2e}"
        else:
            count_str = f"{count:,.0f}"
        print(f"{day:>4} {count_str:>15} {wa:>13.2f} {phase:>12}")

# Compare final states
no_pres_final = no_preservation[-1][1]
mum_final = mummified[-1][1]
print(f"\
=== Comparison at Day 14 ===")
print(f"No preservation: {no_preservation[14][1]:.2e} bacteria (body liquefied)")
print(f"With mummification: {mummified[14][1]:.2e} bacteria (declining)")

# The four phases of bacterial growth
print(f"\
=== Four Phases of Bacterial Growth ===")
phases = [
    ("Lag phase", "0-2 hours", "Bacteria adapt to environment, no growth",
     "Embalming starts HERE — maximum window for intervention"),
    ("Exponential phase", "2-12 hours", "Rapid doubling every 20 minutes",
     "If embalming hasn't started, it's getting too late"),
    ("Stationary phase", "12-48 hours", "Nutrients depleted, growth = death",
     "Significant tissue damage; partial preservation possible"),
    ("Death phase", "48+ hours", "More bacteria dying than dividing",
     "Advanced decomposition; preservation very difficult"),
]

print(f"{'Phase':<20} {'Time':<14} {'What Happens':<40} {'For Embalming'}")
print("-" * 100)
for phase, time, desc, emb in phases:
    print(f"{phase:<20} {time:<14} {desc:<40} {emb}")`,
      challenge: 'Model the effect of temperature on bacterial growth rate using the Arrhenius equation: r(T) = r₀ × exp(-Ea/(R×T)). At what temperature does growth rate become negligibly small? (Below about -20°C — which is why frozen food lasts indefinitely.) Compare this with the natron approach (reducing water activity instead of temperature).',
      successHint: 'You modeled bacterial population dynamics — the same mathematics used in food safety, clinical microbiology, ecology, and epidemiology. The logistic equation is one of the most versatile models in biology — it describes everything from bacteria in a dish to the human population on Earth. Understanding it is understanding growth under limits.',
    },
    {
      title: 'Gas chromatography — how we identify ancient chemicals',
      concept: `In 2023, researchers at **Saqqara** analyzed residues in labelled jars from an ancient embalming workshop — and for the first time matched Egyptian substance names to their actual chemical identities.

The technique: **gas chromatography-mass spectrometry (GC-MS)**. It works in three steps:

1. **Vaporize**: heat the sample until the molecules become gas
2. **Separate**: pass the gas through a long tube (column) coated with a stationary phase. Different molecules travel at different speeds based on their size, polarity, and volatility — they separate into bands
3. **Identify**: as each molecule exits the column, a mass spectrometer breaks it into fragments and measures their masses. The fragmentation pattern is a unique "fingerprint" for each molecule

GC-MS can identify trace amounts of specific compounds in a complex mixture — even from 2,600-year-old residues. The technique has revealed that Egyptian embalmers used specific tree resins (pistachio, pine, cedar), animal fats, beeswax, and bitumen — each contributing specific preservative properties.

📚 *Chromatography (from Greek "chroma" = colour, "graphein" = to write) was invented by Mikhail Tsvet in 1900 to separate plant pigments. The name stuck even though modern chromatography works with invisible molecules.*`,
      analogy: 'Imagine a race between different animals on a muddy track. A cheetah runs fast (volatile molecule), a dog runs medium (moderate volatility), a turtle is slow (heavy molecule). After the race, they\'re spread out along the track in order of speed. GC-MS is this race: molecules separate by speed through the column, and each is identified as it crosses the finish line.',
      storyConnection: 'The Saqqara study (2023) found that Egyptian embalmers used resins from trees that don\'t grow in Egypt — pistachio resin from the Levant, cedar oil from Lebanon. This proves that mummification relied on long-distance trade networks, importing specific substances from hundreds of kilometres away because they had unique preservative properties.',
      checkQuestion: 'Why can\'t you just look at an ancient residue and know what it is?',
      checkAnswer: 'Because after 2,600 years, the original substances have degraded. Oils have polymerized (hardened), volatile compounds have evaporated, and bacteria have consumed some components. What remains is a complex mixture of degradation products, contaminants, and residues. GC-MS identifies the molecular fragments — the "chemical DNA" — of what was originally there.',
      codeIntro: 'Simulate a simplified GC-MS analysis — separate and identify compounds in an ancient resin sample.',
      code: `import numpy as np

np.random.seed(42)

class GCMSAnalyzer:
    """Simplified gas chromatography-mass spectrometry simulator."""

    def __init__(self):
        self.compound_library = {
            "Abietic acid": {"retention_min": 12.3, "mass": 302, "source": "Pine resin"},
            "Pimaric acid": {"retention_min": 11.8, "mass": 302, "source": "Pine resin"},
            "Oleanolic acid": {"retention_min": 14.5, "mass": 456, "source": "Pistachio resin"},
            "Palmitic acid": {"retention_min": 8.2, "mass": 256, "source": "Animal fat"},
            "Stearic acid": {"retention_min": 9.1, "mass": 284, "source": "Animal fat/wax"},
            "Cerotic acid": {"retention_min": 15.8, "mass": 396, "source": "Beeswax"},
            "Guaiacol": {"retention_min": 5.4, "mass": 124, "source": "Wood smoke"},
            "Cedrol": {"retention_min": 10.7, "mass": 222, "source": "Cedar oil"},
            "Camphor": {"retention_min": 6.8, "mass": 152, "source": "Camphor tree"},
            "Bitumen marker": {"retention_min": 18.2, "mass": 500, "source": "Natural asphalt"},
        }

    def analyze_sample(self, compounds_present, noise_level=0.1):
        """Simulate GC-MS analysis of a sample."""
        results = []

        for compound in compounds_present:
            if compound in self.compound_library:
                info = self.compound_library[compound]
                # Add realistic noise to retention time and mass
                measured_rt = info["retention_min"] + np.random.normal(0, 0.1)
                measured_mass = info["mass"]  # mass spec is very accurate
                intensity = np.random.uniform(50, 100)  # arbitrary units
                results.append({
                    "retention_time": measured_rt,
                    "mass": measured_mass,
                    "intensity": intensity,
                    "identified_as": compound,
                    "source": info["source"],
                })

        # Add some noise peaks (unidentified)
        for _ in range(3):
            results.append({
                "retention_time": np.random.uniform(3, 20),
                "mass": np.random.randint(100, 400),
                "intensity": np.random.uniform(5, 20),
                "identified_as": "Unknown",
                "source": "Degradation product",
            })

        # Sort by retention time
        results.sort(key=lambda x: x["retention_time"])
        return results

# Create analyzer
gcms = GCMSAnalyzer()

# Analyze a mummy resin sample (based on Saqqara findings)
print("=== GC-MS Analysis: Saqqara Mummy Resin Sample ===")
print("Sample: Dark residue from embalming jar #7\
")

sample_compounds = [
    "Abietic acid", "Pimaric acid",  # pine resin
    "Oleanolic acid",                 # pistachio resin
    "Palmitic acid", "Stearic acid",  # animal fat
    "Cerotic acid",                    # beeswax
    "Cedrol",                          # cedar oil
]

results = gcms.analyze_sample(sample_compounds)

print(f"{'Peak':>5} {'RT (min)':>9} {'Mass (m/z)':>11} {'Intensity':>10} {'Compound':>20} {'Source':>18}")
print("-" * 75)

for i, r in enumerate(results, 1):
    print(f"{i:>5} {r['retention_time']:>7.1f} {r['mass']:>9} {r['intensity']:>8.0f} "
          f"{r['identified_as']:>20} {r['source']:>18}")

# Interpret results
print(f"\
=== Chemical Interpretation ===")
sources_found = set()
for r in results:
    if r["identified_as"] != "Unknown":
        sources_found.add(r["source"])

print(f"Natural substances identified: {len(sources_found)}")
for source in sorted(sources_found):
    compounds = [r["identified_as"] for r in results if r["source"] == source]
    print(f"  {source}: {', '.join(compounds)}")

# What this tells us
print(f"\
=== Archaeological Interpretation ===")
interpretations = [
    ("Pine resin (abietic acid)", "Antibacterial coating — prevents microbial growth"),
    ("Pistachio resin (oleanolic acid)", "Imported from Levant — shows long-distance trade"),
    ("Animal fat (palmitic acid)", "Waterproofing layer — prevents moisture reabsorption"),
    ("Beeswax (cerotic acid)", "Sealing layer — airtight coating over the resin"),
    ("Cedar oil (cedrol)", "Aromatic — also has antibacterial properties"),
]

print(f"{'Finding':<35} {'Significance'}")
print("-" * 75)
for finding, significance in interpretations:
    print(f"{finding:<35} {significance}")

# Modern validation
print(f"\
=== Testing Ancient Recipes ===")
print(f"Researchers tested the identified substances for antibacterial activity:")

substances = [
    ("Pine resin extract", 85, "Strong"),
    ("Pistachio resin extract", 72, "Moderate-strong"),
    ("Cedar oil", 68, "Moderate"),
    ("Beeswax (alone)", 12, "Minimal"),
    ("Animal fat (alone)", 8, "Minimal"),
    ("Combined recipe", 94, "Very strong"),
]

print(f"\
{'Substance':<24} {'Bacterial kill %':>16} {'Effectiveness':>14}")
print("-" * 56)
for name, kill, eff in substances:
    bar = "█" * int(kill / 5)
    print(f"{name:<24} {kill:>14}% {eff:>14} {bar}")

print(f"\
The combination is more effective than any single component —")
print(f"the Egyptians had empirically optimized a multi-component system.")`,
      challenge: 'The GC-MS also detected trace amounts of "Bitumen marker" — natural asphalt from the Dead Sea region. This was unexpected. What does the presence of Dead Sea bitumen in an Egyptian embalming jar tell us about ancient trade routes? Add bitumen to the sample and re-run the analysis.',
      successHint: 'You simulated a modern analytical chemistry technique (GC-MS) to solve an archaeological mystery. The same technology is used in drug testing, environmental monitoring, forensics, and food safety. The key insight: chemistry leaves molecular fingerprints that persist for millennia — and we now have tools to read them.',
    },
    {
      title: 'Preservation science — comparing ancient and modern methods',
      concept: `Egyptian mummification and modern food preservation share the same fundamental principle: **stop biological activity by controlling the environment**.

The key variables are:
1. **Water activity** (aW): below 0.6, most bacteria can't grow
2. **Temperature**: lower = slower reactions
3. **pH**: extreme acidity or alkalinity kills most organisms
4. **Oxygen**: many bacteria need oxygen (aerobic); removing it helps
5. **Antimicrobial agents**: chemicals that kill or inhibit microbes

Modern preservation methods:
- **Refrigeration**: reduces temperature (slows reactions)
- **Freeze-drying**: removes water (reduces aW to <0.1)
- **Canning**: sterilizes + seals (kills bacteria + removes oxygen)
- **Salting/curing**: reduces aW (osmotic dehydration)
- **Smoking**: adds antimicrobials (terpenes) + reduces aW
- **Irradiation**: kills bacteria with gamma rays
- **Vacuum packing**: removes oxygen

Egyptian mummification used: natron (reduces aW), resins (antimicrobials), wrapping (reduces oxygen + aW), and organ removal (removes the most decay-prone tissues).

📚 *Hurdle technology: using MULTIPLE preservation methods simultaneously. Each method is a "hurdle" that bacteria must overcome. Individually, each hurdle might be insufficient — but combined, they're insurmountable. Egyptian mummification is ancient hurdle technology.*`,
      analogy: 'Imagine a prison with multiple security measures: walls, fences, locked doors, guards, cameras. Any ONE measure might be bypassed — a prisoner could climb a wall. But ALL of them together make escape virtually impossible. Preservation works the same way: each method (drying, sealing, antimicrobials) is one barrier. Combined, they create an environment where no organism can survive.',
      storyConnection: 'Egyptian mummies have survived 3,000+ years — longer than any other preservation method in history. Modern freeze-drying can match this in theory, but no freeze-dried sample has been tested for 3,000 years. The mummies ARE the test — and they\'ve passed.',
      checkQuestion: 'Why does honey never spoil, even though it\'s a sugar-rich food that bacteria should love?',
      checkAnswer: 'Three reasons: (1) extremely low water activity (aW ≈ 0.6) — not enough free water for bacteria. (2) High sugar concentration creates osmotic pressure that dehydrates any bacteria that land on it. (3) Honey contains hydrogen peroxide (produced by the enzyme glucose oxidase) — a natural antimicrobial. It\'s a triple hurdle: dry, osmotic, AND antimicrobial.',
      codeIntro: 'Compare preservation methods — model how each one affects bacterial survival and calculate "hurdle" effectiveness.',
      code: `import numpy as np

def bacterial_survival(water_activity=1.0, temperature_C=25,
                        pH=7.0, oxygen_present=True,
                        antimicrobial_strength=0):
    """
    Estimate bacterial survival probability based on environmental conditions.
    Returns survival rate (0 = all dead, 1 = all survive).
    """
    # Water activity effect (most bacteria need aW > 0.9)
    if water_activity < 0.6:
        water_factor = 0.01  # virtually no growth
    elif water_activity < 0.9:
        water_factor = (water_activity - 0.6) / 0.3
    else:
        water_factor = 1.0

    # Temperature effect
    if temperature_C < -20:
        temp_factor = 0.0  # frozen solid
    elif temperature_C < 4:
        temp_factor = 0.1
    elif temperature_C < 60:
        # Optimal around 37°C
        temp_factor = np.exp(-((temperature_C - 37) / 20) ** 2)
    else:
        temp_factor = 0.01  # pasteurization temperatures

    # pH effect (most bacteria need 6-8)
    if pH < 3 or pH > 10:
        ph_factor = 0.01
    elif pH < 4 or pH > 9:
        ph_factor = 0.2
    else:
        ph_factor = 1.0

    # Oxygen effect (many bacteria are aerobic)
    oxygen_factor = 1.0 if oxygen_present else 0.5  # anaerobes still survive

    # Antimicrobial effect
    antimicrobial_factor = max(0.01, 1.0 - antimicrobial_strength)

    # Combined survival (multiply all factors — hurdle technology)
    survival = water_factor * temp_factor * ph_factor * oxygen_factor * antimicrobial_factor

    return survival

# Compare preservation methods
print("=== Preservation Method Comparison ===")
print()

methods = [
    ("No preservation", 1.0, 25, 7.0, True, 0.0),
    ("Refrigeration", 1.0, 4, 7.0, True, 0.0),
    ("Freezing", 0.0, -20, 7.0, True, 0.0),
    ("Salting/curing", 0.6, 25, 7.0, True, 0.0),
    ("Pickling (vinegar)", 0.9, 25, 3.5, True, 0.0),
    ("Canning (sealed)", 0.9, 100, 7.0, False, 0.0),
    ("Smoking", 0.7, 25, 7.0, True, 0.5),
    ("Freeze-drying", 0.1, 25, 7.0, True, 0.0),
    ("Honey (natural)", 0.6, 25, 3.9, False, 0.3),
    ("Egyptian mummy", 0.1, 25, 7.0, False, 0.8),
]

print(f"{'Method':<22} {'aW':>5} {'T°C':>5} {'pH':>5} {'O₂':>4} {'Anti':>5} {'Survival':>9}")
print("-" * 57)

for name, aw, temp, ph, o2, anti in methods:
    survival = bacterial_survival(aw, temp, ph, o2, anti)
    bar = "█" * int((1-survival) * 20)
    o2_str = "Y" if o2 else "N"
    print(f"{name:<22} {aw:>4.1f} {temp:>4} {ph:>4.1f} {o2_str:>4} {anti:>4.1f} "
          f"{survival:>7.4f} {bar}")

# Hurdle analysis for mummification
print(f"\
=== Mummification: Hurdle Analysis ===")
print(f"Each hurdle reduces bacterial survival multiplicatively:\
")

hurdles = [
    ("Organ removal", 1.0, 25, 7.0, True, 0.0, "Removes biggest decay source"),
    ("+ Natron drying", 0.1, 25, 7.0, True, 0.0, "Osmotic dehydration"),
    ("+ Resin coating", 0.1, 25, 7.0, True, 0.8, "Antimicrobial terpenes"),
    ("+ Linen wrapping", 0.1, 25, 7.0, False, 0.8, "Oxygen barrier"),
    ("+ Sealed tomb", 0.05, 20, 7.0, False, 0.8, "Cool, dark, sealed"),
]

print(f"{'Stage':<22} {'Survival':>9} {'Cumulative effect':<25}")
print("-" * 58)

prev_survival = 1.0
for name, aw, temp, ph, o2, anti, desc in hurdles:
    survival = bacterial_survival(aw, temp, ph, o2, anti)
    reduction = prev_survival / max(survival, 1e-10)
    print(f"{name:<22} {survival:>7.6f} {desc:<25}")
    prev_survival = survival

print(f"\
Final bacterial survival probability: {prev_survival:.8f}")
print(f"Reduction from no preservation: {1/prev_survival:.0f}× safer")

# Longevity comparison
print(f"\
=== Preservation Longevity ===")
longevity = [
    ("Room temperature food", "3-7 days"),
    ("Refrigerated food", "1-3 weeks"),
    ("Frozen food", "6-12 months (quality), years (safety)"),
    ("Canned food", "2-5 years (officially), decades (actually)"),
    ("Salt-preserved fish", "Months to years"),
    ("Honey (sealed)", "Indefinite (3000-year-old honey found edible)"),
    ("Freeze-dried food", "25-30 years"),
    ("Egyptian mummy", "3,000+ years (and counting)"),
]

print(f"{'Method':<30} {'Longevity'}")
print("-" * 55)
for method, time in longevity:
    print(f"{method:<30} {time}")`,
      challenge: 'Design a "maximum preservation" protocol using modern technology: what combination of methods would preserve a biological sample for 10,000 years? Consider: what if electricity fails? What if the container leaks? What if nobody maintains it? The Egyptians\' methods required zero maintenance after sealing — can your design match that?',
      successHint: 'You analyzed preservation as a multi-factor optimization problem — the same framework used in food science, pharmaceutical stability testing, and museum conservation. The key insight: multiple weak barriers combine multiplicatively to create strong preservation. This "hurdle technology" approach is used in every food processing plant in the world.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Biochemistry and preservation science through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model decomposition, osmosis, bacterial growth, chemical analysis, and preservation strategies.
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
