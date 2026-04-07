import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ChettinadLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Why food spoils — microbes, oxidation, and enzyme action',
      concept: `Food spoilage has three main causes: **microbial growth** (bacteria, moulds, yeasts consuming the food), **oxidation** (oxygen in the air reacting with fats and vitamins), and **enzymatic action** (the food's own enzymes breaking it down, like a bruised apple turning brown).

Each mechanism has different conditions that favour it: microbes need moisture and moderate temperatures (20-40 degrees C), oxidation needs oxygen and is accelerated by light and heat, and enzymes work fastest at the food's natural temperature (for living tissue) but can be deactivated by heat or acid.

In the code below, you will model the growth rate of spoilage bacteria as a function of temperature, moisture, and pH. This explains why refrigeration, drying, and pickling are the three oldest preservation methods — each attacks a different spoilage mechanism.

*Food preservation is fundamentally about controlling the environment to slow or stop these three mechanisms. Every preservation method — drying, salting, smoking, pickling, canning, freezing — targets at least one of them.*`,
      analogy: 'Think of food spoilage as three different armies attacking a castle. The microbial army needs water to march (moisture), the oxidation army needs air support (oxygen), and the enzyme army is an inside job (the food itself). To defend the castle, you can drain the moat (drying), cut off air supply (sealing), or freeze the traitors (heat treatment). Spice traders used all three strategies.',
      storyConnection: 'The Chettinad traders needed to transport pepper, cardamom, cloves, and cinnamon across the Indian Ocean — journeys of weeks to months in hot, humid conditions. They learned that dried spices resist microbial spoilage (low moisture), that whole spices resist oxidation better than ground (less surface area exposed to air), and that certain spice oils are natural antimicrobials.',
      checkQuestion: 'Why does grinding spices immediately before use give better flavour than using pre-ground spices?',
      checkAnswer: 'Grinding breaks open the spice cells, exposing volatile flavour compounds and oils to the air. Oxidation begins immediately, degrading the flavour. A whole peppercorn retains its flavour for years because the intact outer shell protects the oils inside. Once ground, the pepper loses significant flavour within weeks.',
      codeIntro: 'Model bacterial growth rate as a function of temperature, moisture, and pH.',
      code: `import numpy as np

def bacterial_growth_rate(temp_C, water_activity, pH):
    """Model relative bacterial growth rate (0 = no growth, 1 = maximum).

    Based on the Cardinal Temperature Model:
    - Bacteria grow fastest at ~37 C, stop below 5 C and above 60 C
    - Water activity (aw) below 0.6 stops most bacteria
    - pH below 4.5 or above 9 stops most bacteria
    """
    # Temperature factor (0-1)
    if temp_C < 5 or temp_C > 60:
        temp_factor = 0
    else:
        # Optimal at 37 C
        temp_factor = np.exp(-((temp_C - 37) / 15) ** 2)

    # Water activity factor (0-1)
    if water_activity < 0.6:
        aw_factor = 0
    else:
        aw_factor = (water_activity - 0.6) / 0.4

    # pH factor (0-1)
    if pH < 4.5 or pH > 9:
        pH_factor = 0
    else:
        pH_factor = np.exp(-((pH - 7) / 2.5) ** 2)

    return temp_factor * aw_factor * pH_factor

# Test across temperature range
print("=== Bacterial Growth Rate vs Temperature ===")
print("(at water activity 0.98, pH 7 -- ideal conditions)")
print()
header = "Temp (C)    Growth Rate    Risk Level"
print(header)
print("-" * len(header))

for temp in [0, 5, 10, 15, 20, 25, 30, 35, 37, 40, 45, 50, 55, 60, 70]:
    rate = bacterial_growth_rate(temp, 0.98, 7)
    risk = "NONE" if rate < 0.01 else "LOW" if rate < 0.2 else "MODERATE" if rate < 0.5 else "HIGH" if rate < 0.8 else "CRITICAL"
    bar = "#" * int(rate * 30)
    print(f"{temp:>7}    {rate:>10.3f}    {risk:<10} {bar}")

# Test preservation methods
print()
print("=== Preservation Methods and Their Effects ===")
print()

methods = [
    ("Fresh spice (unprotected)", 30, 0.98, 7.0),
    ("Refrigerated (5 C)", 5, 0.98, 7.0),
    ("Dried (low moisture)", 30, 0.40, 7.0),
    ("Pickled (low pH)", 30, 0.98, 3.5),
    ("Dried + cool storage", 15, 0.40, 7.0),
    ("Salted + dried", 30, 0.55, 7.0),
    ("Vacuum sealed", 30, 0.98, 7.0),  # still has aw, pH
]

header2 = "Method                      Temp   aw    pH   Growth Rate"
print(header2)
print("-" * len(header2))

for name, temp, aw, pH in methods:
    rate = bacterial_growth_rate(temp, aw, pH)
    print(f"{name:<28} {temp:>4}  {aw:.2f}  {pH:.1f}  {rate:>10.4f}")

print()
print("Drying is the most effective single method for spices.")
print("The Chettinad traders dried their spices to aw < 0.5")
print("and stored them in sealed containers for months at sea.")`,
      challenge: 'Add an oxidation rate model: rate = k * exp(-Ea/(R*T)) * oxygen_fraction. Use Ea = 50000 J/mol and k = 1e8. Show that ground spices (high surface area) oxidise faster than whole spices. Calculate the "flavour half-life" for each.',
      successHint: 'You just modelled the microbiology of food preservation — the same science used by food manufacturers, space agencies (for astronaut food), and humanitarian organizations (for emergency rations). The Chettinad traders were applied microbiologists centuries before the field existed.',
    },
    {
      title: 'Water activity — the key number that controls spoilage',
      concept: `**Water activity** (a_w) is the single most important number in food preservation. It measures how much of the water in a food is "available" for microbial growth and chemical reactions, on a scale from 0 (bone dry) to 1.0 (pure water).

Fresh fruits and meats have a_w around 0.98-0.99. At a_w below 0.91, most bacteria cannot grow. Below 0.80, most moulds stop. Below 0.60, virtually no microbial growth occurs. Dried spices typically have a_w between 0.30 and 0.50 — well below the danger zone.

In the code below, you will calculate the water activity of various spices and foods, and determine the shelf life based on the dominant spoilage mechanism at each water activity level.

*Water activity is NOT the same as moisture content. A food can have 10% moisture but high water activity if the water is not bound to other molecules. Conversely, a food can have 25% moisture but low water activity if the water is tightly bound to sugars or salts.*`,
      analogy: 'Imagine water molecules as workers in a factory. In fresh food, the workers are "free" — available to help bacteria grow. In dried food, the workers are "bound" — tied up in contracts with sugar or salt molecules, unavailable. Water activity measures what fraction of workers are free. Even if there are many workers total (high moisture), if most are bound (low a_w), bacteria cannot recruit them.',
      storyConnection: 'Chettinad spice merchants tested dryness by snapping a peppercorn — if it broke cleanly with a sharp crack, it was dry enough (a_w below 0.50). If it bent or felt rubbery, it still had too much free water and would mould during the voyage. This snap test is still used in spice markets today.',
      checkQuestion: 'Honey has about 17% moisture but a water activity of only 0.60. Why?',
      checkAnswer: 'Honey is about 80% sugar. The sugar molecules bind tightly to water molecules through hydrogen bonds, making the water unavailable for microbial growth. This is why honey never spoils (archaeologists have found edible honey in Egyptian tombs). The high sugar content acts as a natural preservative by reducing water activity.',
      codeIntro: 'Calculate water activity for spices and predict shelf life.',
      code: `import numpy as np

# Water activity data for common spices and foods
foods = [
    {"name": "Fresh pepper (on vine)", "moisture_pct": 75, "aw": 0.98, "category": "fresh"},
    {"name": "Sun-dried pepper", "moisture_pct": 12, "aw": 0.45, "category": "dried"},
    {"name": "Fresh cardamom", "moisture_pct": 80, "aw": 0.97, "category": "fresh"},
    {"name": "Dried cardamom", "moisture_pct": 8, "aw": 0.35, "category": "dried"},
    {"name": "Cinnamon bark", "moisture_pct": 10, "aw": 0.40, "category": "dried"},
    {"name": "Fresh turmeric", "moisture_pct": 85, "aw": 0.98, "category": "fresh"},
    {"name": "Turmeric powder", "moisture_pct": 6, "aw": 0.30, "category": "dried"},
    {"name": "Cloves (dried)", "moisture_pct": 7, "aw": 0.32, "category": "dried"},
    {"name": "Honey", "moisture_pct": 17, "aw": 0.60, "category": "preserved"},
    {"name": "Salt fish", "moisture_pct": 25, "aw": 0.75, "category": "preserved"},
    {"name": "Fresh fish", "moisture_pct": 75, "aw": 0.99, "category": "fresh"},
]

# Microbial growth limits
limits = [
    (0.98, "Most bacteria thrive"),
    (0.91, "Most bacteria stop"),
    (0.87, "Most yeasts stop"),
    (0.80, "Most moulds stop"),
    (0.75, "Halophilic bacteria stop"),
    (0.65, "Xerophilic moulds stop"),
    (0.60, "No microbial growth"),
]

print("=== Water Activity of Foods and Spices ===")
print()
header = "Food                       Moisture%   aw    Microbial Risk"
print(header)
print("-" * len(header))

for f in foods:
    aw = f["aw"]
    risk = "Critical" if aw > 0.95 else "High" if aw > 0.90 else "Moderate" if aw > 0.80 else "Low" if aw > 0.60 else "Minimal"
    print(f"{f['name']:<28} {f['moisture_pct']:>6}%   {aw:.2f}  {risk}")

print()
print("=== Microbial Growth Limits ===")
for aw, description in limits:
    print(f"  aw = {aw:.2f}: {description}")

# Shelf life estimation
print()
print("=== Estimated Shelf Life ===")
print()

def estimate_shelf_life_days(aw, temp_C, whole=True):
    """Rough shelf life estimate based on water activity and temperature."""
    if aw < 0.60:
        base_days = 365 * 3  # 3 years if very dry
    elif aw < 0.75:
        base_days = 365  # 1 year
    elif aw < 0.85:
        base_days = 90  # 3 months
    elif aw < 0.91:
        base_days = 30  # 1 month
    else:
        base_days = 7  # 1 week

    # Temperature adjustment (Q10 rule: rate doubles every 10 C)
    temp_factor = 2 ** ((30 - temp_C) / 10)
    # Whole vs ground (grinding accelerates oxidation)
    grind_factor = 1.0 if whole else 0.3

    return base_days * temp_factor * grind_factor

header2 = "Spice                  aw    Whole@25C   Ground@25C   Whole@35C"
print(header2)
print("-" * len(header2))

for f in foods:
    if f["category"] == "dried":
        sl_whole_25 = estimate_shelf_life_days(f["aw"], 25, whole=True)
        sl_ground_25 = estimate_shelf_life_days(f["aw"], 25, whole=False)
        sl_whole_35 = estimate_shelf_life_days(f["aw"], 35, whole=True)
        print(f"{f['name']:<22} {f['aw']:.2f}  {sl_whole_25:>7.0f} days  "
              f"{sl_ground_25:>7.0f} days  {sl_whole_35:>7.0f} days")`,
      challenge: 'Model the "sorption isotherm" — the relationship between moisture content and water activity for a specific spice. Use the GAB equation: aw = (C*K*m) / ((1-K*m)(1-K*m+C*K*m)) where m is moisture fraction. Plot aw vs moisture for pepper.',
      successHint: 'Water activity is the foundation of food science and safety. Every packaged food product has a target water activity designed to prevent specific spoilage organisms. You just applied the same science that the Chettinad traders used empirically for centuries.',
    },
    {
      title: 'Antimicrobial spice oils — nature\'s preservatives',
      concept: `Many spices contain **essential oils** that are natural antimicrobials — they kill or inhibit bacteria, moulds, and yeasts. Clove oil (eugenol), cinnamon oil (cinnamaldehyde), and thyme oil (thymol) are among the most potent natural preservatives known.

These oils work by disrupting the bacterial cell membrane, causing the cell contents to leak out. The **minimum inhibitory concentration** (MIC) is the lowest concentration of oil that stops bacterial growth. Lower MIC means more potent antimicrobial activity.

In the code below, you will compare the antimicrobial potency of various spice oils and calculate how much of each spice is needed to preserve a food product. This explains why spice-heavy cuisines (Chettinad, Thai, Mexican) evolved in hot climates — the spices were not just for flavour but for food safety.

*The "antimicrobial hypothesis" of spice use suggests that cuisines in hot climates use more spices because the antimicrobial properties of spices reduce foodborne illness. This has been statistically confirmed across global cuisine data.*`,
      analogy: 'Imagine each spice oil as a different antibiotic. Some are broad-spectrum (kill many types of bacteria, like clove oil) and some are narrow-spectrum (kill only specific types). The MIC is like the dosage — some oils are so potent that a tiny amount is effective (low MIC = strong medicine).',
      storyConnection: 'Chettinad traders wrapped delicate goods in cloth treated with clove and cinnamon oil to prevent mould during sea voyages. They also lined storage containers with neem leaves (another natural antimicrobial). This was practical chemistry — the oils created a hostile environment for microbes in the warm, humid cargo hold.',
      checkQuestion: 'If clove oil has an MIC of 0.1% against E. coli, how many grams of clove oil are needed to treat 1 litre of food?',
      checkAnswer: '0.1% of 1000 ml = 1 ml. At a typical oil density of 1.05 g/ml, that is about 1.05 grams of clove oil per litre. This is a small amount — roughly 1/4 teaspoon — yet enough to inhibit bacterial growth.',
      codeIntro: 'Compare antimicrobial potency of spice oils and calculate preservation doses.',
      code: `import numpy as np

# Minimum Inhibitory Concentration (MIC) of spice oils
# MIC in % (v/v) against common spoilage bacteria
# Lower MIC = more potent antimicrobial

spice_oils = [
    {"name": "Clove (eugenol)",         "mic_pct": 0.10, "oil_yield_pct": 15.0, "cost_per_kg": 25},
    {"name": "Cinnamon (cinnamaldehyde)","mic_pct": 0.12, "oil_yield_pct": 2.5,  "cost_per_kg": 12},
    {"name": "Oregano (carvacrol)",      "mic_pct": 0.15, "oil_yield_pct": 3.0,  "cost_per_kg": 18},
    {"name": "Thyme (thymol)",           "mic_pct": 0.18, "oil_yield_pct": 2.0,  "cost_per_kg": 22},
    {"name": "Black pepper (piperine)",  "mic_pct": 0.50, "oil_yield_pct": 3.5,  "cost_per_kg": 15},
    {"name": "Cardamom",                 "mic_pct": 0.80, "oil_yield_pct": 5.0,  "cost_per_kg": 40},
    {"name": "Ginger (gingerol)",        "mic_pct": 1.00, "oil_yield_pct": 2.0,  "cost_per_kg": 8},
    {"name": "Turmeric (curcumin)",      "mic_pct": 1.50, "oil_yield_pct": 5.0,  "cost_per_kg": 10},
    {"name": "Garlic (allicin)",         "mic_pct": 0.20, "oil_yield_pct": 0.3,  "cost_per_kg": 5},
]

print("=== Spice Oil Antimicrobial Potency ===")
print()
header = "Spice Oil                  MIC(%)  Potency  Oil Yield(%)"
print(header)
print("-" * len(header))

# Sort by potency (lowest MIC first)
sorted_oils = sorted(spice_oils, key=lambda x: x["mic_pct"])

for oil in sorted_oils:
    potency = "Excellent" if oil["mic_pct"] < 0.15 else "Good" if oil["mic_pct"] < 0.5 else "Moderate" if oil["mic_pct"] < 1.0 else "Mild"
    print(f"{oil['name']:<28} {oil['mic_pct']:>5.2f}   {potency:<10} {oil['oil_yield_pct']:>9.1f}%")

# Calculate practical preservation requirements
print()
print("=== Spice Needed to Preserve 1 kg of Food ===")
print()

food_volume_ml = 1000  # approximate 1 kg as 1000 ml

header2 = "Spice Oil                  Oil Needed(ml)  Spice Needed(g)  Cost($)"
print(header2)
print("-" * len(header2))

for oil in sorted_oils:
    oil_needed_ml = oil["mic_pct"] / 100 * food_volume_ml
    # How much whole spice to get that much oil
    spice_needed_g = oil_needed_ml / (oil["oil_yield_pct"] / 100)
    cost = spice_needed_g / 1000 * oil["cost_per_kg"]
    print(f"{oil['name']:<28} {oil_needed_ml:>12.2f}    {spice_needed_g:>13.1f}  {cost:>6.3f}")

print()
print("Clove is the most potent, but garlic requires the most raw")
print("material because it has very low oil yield (0.3%).")
print()

# Synergy: combinations are more effective than single oils
print("=== Synergy: Spice Oil Combinations ===")
combos = [
    ("Clove + Cinnamon", 0.06),
    ("Thyme + Oregano", 0.10),
    ("Clove + Black pepper", 0.08),
    ("Cinnamon + Garlic", 0.08),
]
print("Some combinations are more potent than either alone:")
for name, mic in combos:
    print(f"  {name:<25} MIC = {mic:.2f}% (synergistic)")`,
      challenge: 'Model the "kill curve" — how bacterial count decreases over time at different spice oil concentrations. Use an exponential decay model: N(t) = N0 * exp(-k*C*t) where C is concentration and k depends on the oil. At what concentration does each oil reduce bacteria by 99.9% in 1 hour?',
      successHint: 'You just performed antimicrobial efficacy analysis — the same type of study pharmaceutical companies do for antibiotics and food companies do for preservatives. The Chettinad spice trade was, at its heart, a pharmaceutical supply chain.',
    },
    {
      title: 'Drying kinetics — how fast does moisture leave a spice?',
      concept: `Drying is the most important preservation step for spices. The drying rate depends on temperature, humidity, airflow, and the size of the spice pieces. Understanding drying kinetics tells you how long sun-drying takes and whether the spice will reach a safe moisture level before microbes can grow.

The drying process has two phases: the **constant rate period** (when the surface is wet and moisture evaporates freely) and the **falling rate period** (when the surface dries out and moisture must diffuse from inside). The falling rate period takes much longer because diffusion through the solid spice is slow.

In the code below, you will model the complete drying curve for different spices and conditions. This is the science behind the Chettinad sun-drying process, which takes 5-10 days on rooftops in the tropical sun.

*Drying is a mass transfer process — moisture molecules move from high concentration (inside the spice) to low concentration (the dry air). The rate depends on the concentration difference and the resistance to flow (through the spice structure and the air boundary layer).*`,
      analogy: 'Imagine wringing out a wet towel. The first squeeze (constant rate) removes a lot of water easily — it is on the surface. But subsequent squeezes (falling rate) remove less and less — the remaining water is trapped deep in the fibres and must slowly work its way out. Drying a spice follows the same pattern: fast at first, then increasingly slow.',
      storyConnection: 'Chettinad families spread harvested pepper on large rooftop terraces for sun-drying. They turn the peppercorns every few hours to expose all surfaces. They know from generations of experience that 5-7 days of strong sun produces properly dried pepper, but cloudy or humid days extend this to 10-12 days. The drying kinetics model explains why.',
      checkQuestion: 'If pepper starts at 75% moisture and needs to reach 12% for safe storage, how much water must be removed from 10 kg of fresh pepper?',
      checkAnswer: 'Fresh pepper: 10 kg total, 7.5 kg water, 2.5 kg dry matter. At 12% moisture: dry matter = 88% of final weight, so final weight = 2.5 / 0.88 = 2.84 kg. Water removed = 10 - 2.84 = 7.16 kg. That is 71.6% of the original weight lost as water.',
      codeIntro: 'Model the drying curve for spices under different conditions.',
      code: `import numpy as np

def drying_curve(initial_moisture, target_moisture, temp_C,
                 humidity_pct, piece_size_mm, hours_max=200):
    """Model spice drying kinetics.

    Two-phase model: constant rate then falling rate.
    Returns arrays of time (hours) and moisture content (%).
    """
    # Drying rate depends on conditions
    # Higher temp, lower humidity, smaller pieces = faster drying
    temp_factor = np.exp((temp_C - 30) / 15)  # doubles every 15 C
    humidity_factor = (100 - humidity_pct) / 70  # lower humidity = faster
    size_factor = 5 / piece_size_mm  # smaller pieces dry faster

    base_rate = 0.5  # %/hour at reference conditions
    rate = base_rate * temp_factor * humidity_factor * size_factor

    # Critical moisture (transition from constant to falling rate)
    critical_moisture = 30  # %

    times = [0]
    moistures = [initial_moisture]
    m = initial_moisture
    dt = 0.5  # half-hour steps

    for step in range(int(hours_max / dt)):
        t = (step + 1) * dt
        if m > critical_moisture:
            # Constant rate period
            dm = rate * dt
        else:
            # Falling rate period (rate decreases as moisture drops)
            fraction = (m - target_moisture) / (critical_moisture - target_moisture)
            fraction = max(fraction, 0)
            dm = rate * fraction * dt

        m -= dm
        m = max(m, target_moisture * 0.9)  # asymptotic approach
        times.append(t)
        moistures.append(m)

        if m <= target_moisture:
            break

    return np.array(times), np.array(moistures)

# Compare drying conditions
print("=== Spice Drying Kinetics ===")
print()

conditions = [
    ("Tropical sun (35 C, 60% RH)", 35, 60),
    ("Hot dry climate (40 C, 30% RH)", 40, 30),
    ("Moderate (25 C, 70% RH)", 25, 70),
    ("Humid monsoon (30 C, 85% RH)", 30, 85),
    ("Mechanical dryer (60 C, 20% RH)", 60, 20),
]

print("--- Black Pepper (5mm peppercorns, 75% initial moisture) ---")
print()
header = "Conditions                        Time to 12%    Final %    Phase"
print(header)
print("-" * len(header))

for name, temp, rh in conditions:
    times, moistures = drying_curve(75, 12, temp, rh, 5)
    # Find time to reach 12%
    below_target = np.where(moistures <= 12.5)[0]
    if len(below_target) > 0:
        dry_time = times[below_target[0]]
        phase = "Complete"
    else:
        dry_time = times[-1]
        phase = "Incomplete"
    final_m = moistures[-1]
    print(f"{name:<35} {dry_time:>7.0f} hours  {final_m:>6.1f}%    {phase}")

# Compare spice sizes
print()
print("--- Effect of Piece Size (at 35 C, 60% RH) ---")
print()
spices = [
    ("Ground pepper (1mm)", 1, 50),
    ("Cracked pepper (3mm)", 3, 60),
    ("Whole peppercorn (5mm)", 5, 75),
    ("Cardamom pod (8mm)", 8, 80),
    ("Nutmeg (20mm)", 20, 85),
]

header2 = "Spice                    Size   Init%   Hours to 12%"
print(header2)
print("-" * len(header2))

for name, size, init_m in spices:
    times, moistures = drying_curve(init_m, 12, 35, 60, size)
    below = np.where(moistures <= 12.5)[0]
    dry_time = times[below[0]] if len(below) > 0 else times[-1]
    print(f"{name:<25} {size:>3}mm  {init_m:>4}%   {dry_time:>10.0f}")`,
      challenge: 'Add a "drying schedule optimizer": find the combination of temperature and duration that minimizes drying time while keeping temperature below 50 degrees C (to preserve volatile flavour compounds). Higher temperature dries faster but destroys essential oils above 50 degrees C.',
      successHint: 'You just modelled a mass transfer process — one of the fundamental operations in chemical engineering. The same drying kinetics apply to pharmaceutical manufacturing, paper production, and food processing. The Chettinad sun-drying tradition is an ancient form of chemical engineering.',
    },
    {
      title: 'Shelf life prediction — how long before the spice loses quality?',
      concept: `Shelf life is not a single number — it depends on what you define as "spoiled." A spice might be microbiologically safe for years but lose its flavour in months. The shelf life for **safety** (no dangerous microbes) is usually much longer than the shelf life for **quality** (full flavour and aroma).

The most common model for quality loss is the **Arrhenius equation**: rate = A * exp(-Ea / RT), where Ea is the activation energy (how sensitive the reaction is to temperature), R is the gas constant, and T is absolute temperature. This predicts that quality loss roughly doubles for every 10 degrees C increase in storage temperature — a rule called **Q10**.

In the code below, you will build a shelf life predictor that accounts for temperature, packaging (oxygen exposure), and spice form (whole vs ground). This is the tool that modern spice companies use to set "best before" dates.

*The Q10 rule says that for every 10 degrees C increase in temperature, the rate of chemical degradation doubles. This means spices stored at 35 degrees C degrade about 4x faster than spices at 15 degrees C.*`,
      analogy: 'Think of shelf life as a candle burning down. At room temperature, the candle burns slowly (long shelf life). At higher temperature, the flame burns bigger and the candle shortens faster (shorter shelf life). The Q10 rule tells you exactly how much faster: about twice as fast for every 10 degrees C warmer.',
      storyConnection: 'Chettinad merchants stored their most valuable spices — saffron, cardamom, vanilla — in cool underground rooms in their grand mansions (Chettinad houses are famous for their deep cellars). They knew that "cool and dark" preserved value. The underground storage was typically 10-15 degrees C cooler than the tropical surface temperature, effectively doubling the shelf life.',
      checkQuestion: 'If black pepper has a flavour shelf life of 6 months at 25 degrees C (Q10 = 2), what is the shelf life at 35 degrees C?',
      checkAnswer: '35 degrees C is 10 degrees C warmer than 25 degrees C. With Q10 = 2, the degradation rate doubles. So shelf life is halved: 6 / 2 = 3 months. At 45 degrees C, it would be 6 / 4 = 1.5 months. Temperature control is critical for spice quality.',
      codeIntro: 'Build a shelf life predictor for spices using the Arrhenius model.',
      code: `import numpy as np

def shelf_life_months(base_life_months, base_temp_C, storage_temp_C,
                      Q10=2.0, ground=False, vacuum_sealed=False):
    """Predict shelf life using Q10 temperature model.

    base_life_months: shelf life at base_temp_C
    Q10: rate increase per 10 C increase
    ground: if True, reduces shelf life (more oxidation)
    vacuum_sealed: if True, extends shelf life (less oxidation)
    """
    temp_diff = storage_temp_C - base_temp_C
    temp_factor = Q10 ** (temp_diff / 10)

    life = base_life_months / temp_factor

    if ground:
        life *= 0.3  # grinding reduces shelf life to ~30%
    if vacuum_sealed:
        life *= 2.5  # vacuum sealing extends by ~2.5x

    return life

# Shelf life data for common spices (at 25 C, whole, unsealed)
spices = [
    {"name": "Black pepper",   "base_life": 36, "Q10": 2.0},
    {"name": "Cardamom",       "base_life": 30, "Q10": 2.2},
    {"name": "Cinnamon sticks","base_life": 48, "Q10": 1.8},
    {"name": "Cloves",         "base_life": 48, "Q10": 1.9},
    {"name": "Cumin seeds",    "base_life": 24, "Q10": 2.3},
    {"name": "Turmeric root",  "base_life": 36, "Q10": 2.0},
    {"name": "Saffron",        "base_life": 24, "Q10": 2.5},
    {"name": "Star anise",     "base_life": 36, "Q10": 2.0},
]

print("=== Spice Shelf Life Predictor ===")
print("(Whole spices, unsealed, base at 25 C)")
print()

header = "Spice             Base(mo)  At 15C  At 25C  At 35C  At 45C"
print(header)
print("-" * len(header))

for s in spices:
    lives = [shelf_life_months(s["base_life"], 25, t, s["Q10"]) for t in [15, 25, 35, 45]]
    print(f"{s['name']:<18} {s['base_life']:>5}     "
          + "  ".join(f"{l:>5.0f}" for l in lives))

# Effect of grinding and packaging
print()
print("=== Black Pepper: Effect of Processing and Packaging ===")
print()

header2 = "Form & Packaging         At 15C   At 25C   At 35C"
print(header2)
print("-" * len(header2))

configs = [
    ("Whole, open",            False, False),
    ("Whole, vacuum sealed",   False, True),
    ("Ground, open",           True,  False),
    ("Ground, vacuum sealed",  True,  True),
]

for name, ground, vacuum in configs:
    lives = []
    for temp in [15, 25, 35]:
        life = shelf_life_months(36, 25, temp, 2.0, ground, vacuum)
        lives.append(life)
    print(f"{name:<25} " + "  ".join(f"{l:>5.0f}mo" for l in lives))

print()
print("Key insight: whole + vacuum + cool storage gives 10-20x")
print("longer shelf life than ground + open + warm storage.")
print("The Chettinad traders shipped whole spices in sealed")
print("containers in cool ship holds — optimal preservation.")`,
      challenge: 'Add a cost-benefit analysis: calculate the value loss per month for each storage condition. If pepper costs $30/kg and loses 2% of value per month at 25 degrees C open storage, but vacuum sealing costs $0.50/kg, at what point does the vacuum sealing investment pay for itself?',
      successHint: 'You just built a shelf life prediction system. This exact model is used by every food company in the world to set "best before" dates, design packaging, and plan distribution logistics. The Chettinad traders optimized the same variables — they just did it by experience rather than equations.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Food preservation science and spice chemistry</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model food spoilage, preservation methods, and spice chemistry.
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
