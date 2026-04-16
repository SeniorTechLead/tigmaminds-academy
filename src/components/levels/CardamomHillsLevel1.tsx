import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CardamomHillsLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is a molecule? — the building blocks of cardamom\'s aroma',
      concept: `Everything you smell is made of **molecules** — tiny clusters of atoms bonded together. When you crack open a cardamom pod, volatile molecules escape into the air and reach your nose.

**Atoms** are the fundamental particles: carbon (C), hydrogen (H), oxygen (O), nitrogen (N). Molecules are combinations of atoms held together by **chemical bonds**.

Cardamom contains over 50 different volatile compounds. The key ones:
- **1,8-Cineole (eucalyptol)**: C₁₀H₁₈O — the dominant "fresh, cooling" note (30-40% of oil)
- **α-Terpinyl acetate**: C₁₂H₂₀O₂ — floral, sweet aroma (25-35%)
- **Limonene**: C₁₀H₁₆ — citrusy, bright
- **Linalool**: C₁₀H₁₈O — floral, lavender-like
- **α-Pinene**: C₁₀H₁₆ — pine, resinous

Notice: most of these have the formula C₁₀H₁₆ or similar — they are **terpenes**, a family of molecules built from repeating 5-carbon units called **isoprene**.

📚 *We will use Python strings and dictionaries to represent molecules and count their atoms.*`,
      analogy: 'Molecules are like words built from an alphabet of atoms. Just as "cat" and "act" use the same letters in different arrangements, 1,8-cineole and limonene use the same atoms (C, H, O) in different structures — producing completely different smells. The "spelling" of a molecule determines its properties.',
      storyConnection: 'In the story, the cardamom hills of Sikkim are fragrant with spice — a scent so distinctive it carries on the mountain breeze. That scent is not one molecule but a symphony of 50+ volatile compounds, each contributing a note. The "perfume" of cardamom is organic chemistry in action.',
      checkQuestion: 'If 1,8-cineole has the formula C₁₀H₁₈O, how many total atoms are in one molecule?',
      checkAnswer: '10 carbon + 18 hydrogen + 1 oxygen = 29 atoms total. Despite being made of just three types of atoms, this 29-atom molecule has a specific 3D shape that fits perfectly into smell receptors in your nose. Change even one atom and the smell changes.',
      codeIntro: 'Represent cardamom\'s key molecules and analyze their atomic composition.',
      code: `# Cardamom essential oil: molecular analysis

molecules = {
    "1,8-Cineole (eucalyptol)": {"formula": "C10H18O", "C": 10, "H": 18, "O": 1, "percent": 35, "smell": "fresh, cooling"},
    "alpha-Terpinyl acetate": {"formula": "C12H20O2", "C": 12, "H": 20, "O": 2, "percent": 30, "smell": "floral, sweet"},
    "Limonene": {"formula": "C10H16", "C": 10, "H": 16, "O": 0, "percent": 8, "smell": "citrus, bright"},
    "Linalool": {"formula": "C10H18O", "C": 10, "H": 18, "O": 1, "percent": 5, "smell": "floral, lavender"},
    "alpha-Pinene": {"formula": "C10H16", "C": 10, "H": 16, "O": 0, "percent": 3, "smell": "pine, resinous"},
}

# Atomic weights (g/mol)
weights = {"C": 12.01, "H": 1.008, "O": 16.00}

print("=== Cardamom Essential Oil — Molecular Profile ===\
")
print(f"{'Compound':<30} {'Formula':<12} {'MW(g/mol)':>10} {'%Oil':>6} {'Aroma'}")
print("-" * 85)

for name, data in molecules.items():
    mw = data["C"] * weights["C"] + data["H"] * weights["H"] + data["O"] * weights["O"]
    total_atoms = data["C"] + data["H"] + data["O"]
    print(f"{name:<30} {data['formula']:<12} {mw:>10.1f} {data['percent']:>5}%  {data['smell']}")

print()

# Carbon content analysis
print("=== Carbon Content (what makes these 'organic') ===")
for name, data in molecules.items():
    mw = data["C"] * weights["C"] + data["H"] * weights["H"] + data["O"] * weights["O"]
    carbon_mass = data["C"] * weights["C"]
    carbon_pct = carbon_mass / mw * 100
    print(f"  {name[:25]:<25} carbon: {carbon_pct:.1f}% of molecular weight")

print()
print("All cardamom aroma molecules are carbon-based = 'organic'")
print("Most are terpenes: built from C5H8 isoprene units")
print(f"Cineole + terpinyl acetate = {35+30}% of the oil — they ARE the smell of cardamom!")`,
      challenge: 'Add myrcene (C₁₀H₁₆, 2%, herbal/earthy) to the dictionary. Which molecule has the highest carbon percentage?',
      successHint: 'You have learned to represent molecules as data structures. The molecular formula tells you the recipe; the molecular weight tells you how heavy the molecule is; and the carbon percentage reveals why these are called "organic" compounds — carbon is the backbone of life and flavor.',
    },
    {
      title: 'Boiling points — why you can smell cardamom from across the room',
      concept: `**Volatile** means "easily evaporated." Cardamom\'s aroma molecules are volatile — they escape from the pod into the air at room temperature. The **boiling point** determines how easily a liquid becomes a gas.

Key boiling points:
- Water: 100°C
- 1,8-Cineole: 176°C
- Limonene: 176°C
- Linalool: 198°C
- α-Terpinyl acetate: 220°C

Wait — if these boil above 100°C, how do you smell them at room temperature?

The answer: **vapor pressure**. Even below the boiling point, some molecules escape from the liquid surface. Higher vapor pressure = more molecules in the air = stronger smell.

Vapor pressure depends on:
- **Temperature**: higher temp → exponentially more molecules escape
- **Molecular weight**: lighter molecules escape more easily
- **Intermolecular forces**: weaker bonds between molecules → easier escape

When you crush a cardamom pod, you break open oil glands, exposing fresh oil to air. The lighter, more volatile compounds (pinene, limonene) escape first — the initial sharp, citrusy burst. Heavier compounds (terpinyl acetate) linger — the warm, sweet base note.

📚 *We will calculate vapor pressure using the Clausius-Clapeyron equation.*`,
      analogy: 'Think of molecules in a liquid as people in a crowded room. The door (liquid surface) is open. Some energetic people (high kinetic energy molecules) push through the crowd and escape. Raising the temperature is like playing loud music — everyone gets more energetic, more people escape. Boiling is when the music is so loud that everyone rushes for the door at once.',
      storyConnection: 'The cardamom hills of Sikkim smell strongest on warm, humid afternoons — exactly when the Clausius-Clapeyron equation predicts maximum vapor pressure. Temperature drives volatility, and the monsoon warmth liberates the molecules that make Sikkim\'s hills fragrant.',
      checkQuestion: 'Why does grinding cardamom release more aroma than leaving the pod whole?',
      checkAnswer: 'Grinding ruptures thousands of oil gland cells, exposing an enormous surface area of essential oil to air. Whole pods leak aroma slowly through the pod shell. Surface area is the key: more exposed oil surface → more evaporation → stronger smell. This is the same principle as why sugar dissolves faster when crushed.',
      codeIntro: 'Model vapor pressure vs. temperature for cardamom\'s key aroma compounds.',
      code: `# Vapor pressure and volatility of cardamom compounds

import math

# Clausius-Clapeyron: ln(P) = -ΔHvap/(R*T) + C
# We'll use Antoine equation: log10(P) = A - B/(C+T)
# P in mmHg, T in °C

# Antoine coefficients (approximate for terpenes)
compounds = {
    "alpha-Pinene": {"A": 6.85, "B": 1470, "C": 205, "bp": 156, "smell": "pine"},
    "Limonene":     {"A": 6.90, "B": 1550, "C": 210, "bp": 176, "smell": "citrus"},
    "1,8-Cineole":  {"A": 7.00, "B": 1600, "C": 215, "bp": 176, "smell": "fresh"},
    "Linalool":     {"A": 7.10, "B": 1700, "C": 220, "bp": 198, "smell": "floral"},
    "Terpinyl acetate": {"A": 7.20, "B": 1850, "C": 230, "bp": 220, "smell": "sweet"},
}

def vapor_pressure(A, B, C, T_celsius):
    """Antoine equation: returns vapor pressure in mmHg."""
    return 10**(A - B / (C + T_celsius))

print("=== Vapor Pressure of Cardamom Compounds ===")
print("(higher pressure = more molecules in air = stronger smell)\
")

temps = [20, 30, 50, 80, 100]

print(f"{'Compound':<22}", end="")
for t in temps:
    print(f"{'  ' + str(t) + '°C':>10}", end="")
print()
print("-" * 72)

for name, data in compounds.items():
    print(f"{name:<22}", end="")
    for t in temps:
        p = vapor_pressure(data["A"], data["B"], data["C"], t)
        print(f"{p:>10.2f}", end="")
    print(f"  mmHg  [{data['smell']}]")

print()
print("=== What You Smell First (at 25°C) ===")
pressures_25 = {}
for name, data in compounds.items():
    p = vapor_pressure(data["A"], data["B"], data["C"], 25)
    pressures_25[name] = p

ranked = sorted(pressures_25.items(), key=lambda x: -x[1])
for i, (name, p) in enumerate(ranked):
    bar = "█" * int(p * 3)
    print(f"  {i+1}. {name:<22} {p:.2f} mmHg  {bar}")

print()
print("Pinene and limonene dominate at room temp → the 'top notes'")
print("Terpinyl acetate is slow to evaporate → the 'base note'")
print("This is why cardamom's aroma evolves over time!")`,
      challenge: 'At what temperature does terpinyl acetate reach the same vapor pressure that pinene has at 20°C? This is the "equivalent volatility temperature."',
      successHint: 'You have modeled vapor pressure using the Antoine equation — a cornerstone of physical chemistry. The ranked volatility list explains the temporal evolution of cardamom\'s aroma: bright citrus top notes fade first, leaving warm sweet base notes. Perfumers and spice scientists use exactly this analysis.',
    },
    {
      title: 'The isoprene rule — nature\'s molecular LEGO',
      concept: `Nearly all cardamom aroma compounds are **terpenes** — molecules built from repeating 5-carbon units called **isoprene** (C₅H₈, 2-methyl-1,3-butadiene).

The **isoprene rule** (Ruzicka\'s rule) states that terpenes are assembled from isoprene units head-to-tail:

- **Monoterpenes** (C₁₀): 2 isoprene units — most cardamom volatiles
- **Sesquiterpenes** (C₁₅): 3 isoprene units — heavier, less volatile
- **Diterpenes** (C₂₀): 4 units — rarely volatile
- **Triterpenes** (C₃₀): 6 units — steroids, waxes
- **Tetraterpenes** (C₄₀): 8 units — carotenoids (pigments)

Why monoterpenes dominate in aroma:
- Small enough to be volatile (MW 136-154)
- Large enough to have complex shapes → diverse smells
- Easily synthesized by plants as defense chemicals

Plants make terpenes via the **MEP pathway** in chloroplasts. Cardamom evolved these molecules to:
1. **Repel insects** (cineole is a potent insect repellent)
2. **Attract pollinators** (floral compounds like linalool)
3. **Inhibit fungi** (antifungal activity of terpenes)
4. **Protect from UV** (antioxidant properties)

📚 *We will write Python functions to analyze whether a molecule follows the isoprene rule.*`,
      analogy: 'The isoprene rule is like nature\'s LEGO system. There is one standard brick (isoprene, C₅H₈). You can snap 2 together (monoterpene), 3 (sesquiterpene), or more. Each assembly creates a different shape and therefore a different smell, color, or biological function. Thousands of natural products are built from this one brick.',
      storyConnection: 'The cardamom hills of Sikkim produce a spice valued for millennia. The molecules responsible — terpenes — are not random creations but products of a simple, elegant building rule that nature repeats across all plants. The same isoprene unit that makes cardamom fragrant makes pine trees smell piney and oranges smell citrusy.',
      checkQuestion: 'Limonene (C₁₀H₁₆) and cineole (C₁₀H₁₈O) both have 10 carbons. Why do they smell completely different?',
      checkAnswer: 'Same number of carbons but different arrangements. Limonene is a ring with a double bond — compact and symmetric. Cineole has an oxygen bridge creating a cage-like structure. The 3D shape determines which smell receptor in your nose it activates. Think of them as keys: same metal (carbon), different cuts (structure), different locks (receptors).',
      codeIntro: 'Analyze cardamom compounds against the isoprene rule and classify them by terpene class.',
      code: `# The Isoprene Rule: Nature's Molecular LEGO

# Isoprene unit: C5H8
isoprene_c = 5
isoprene_h = 8

terpene_classes = {
    "Hemiterpene":    {"units": 1, "C": 5,  "examples": "Isoprene itself"},
    "Monoterpene":    {"units": 2, "C": 10, "examples": "Limonene, pinene, cineole"},
    "Sesquiterpene":  {"units": 3, "C": 15, "examples": "Farnesol, caryophyllene"},
    "Diterpene":      {"units": 4, "C": 20, "examples": "Retinol (vitamin A)"},
    "Sesterterpene":  {"units": 5, "C": 25, "examples": "Rare in nature"},
    "Triterpene":     {"units": 6, "C": 30, "examples": "Squalene, steroids"},
    "Tetraterpene":   {"units": 8, "C": 40, "examples": "Beta-carotene (orange pigment)"},
}

print("=== Terpene Classification System ===\
")
print(f"{'Class':<15} {'Units':>6} {'Carbons':>8} {'MW range':>10} {'Examples'}")
print("-" * 75)
for cls, data in terpene_classes.items():
    n = data["units"]
    c = data["C"]
    # H count for basic terpene: C_n * H_(2n) minus cyclizations
    h_acyclic = 2 * c  # fully saturated acyclic
    mw_low = c * 12 + (h_acyclic - 4) * 1  # typical range
    mw_high = c * 12 + h_acyclic * 1 + 32  # with O atoms
    print(f"{cls:<15} {n:>6} {c:>8} {mw_low:>4}-{mw_high:<4} {data['examples']}")

# Check cardamom compounds against isoprene rule
print("\
=== Cardamom Compounds: Isoprene Rule Check ===\
")

cardamom = [
    ("1,8-Cineole", 10, 18, 1),
    ("alpha-Terpinyl acetate", 12, 20, 2),
    ("Limonene", 10, 16, 0),
    ("Linalool", 10, 18, 1),
    ("alpha-Pinene", 10, 16, 0),
    ("Myrcene", 10, 16, 0),
    ("Geraniol", 10, 18, 1),
    ("Nerolidol", 15, 26, 1),
]

for name, c, h, o in cardamom:
    # Check if carbon count matches isoprene rule
    if c % 5 == 0:
        units = c // 5
        follows_rule = True
    elif c == 12 and o >= 2:
        # Acetate ester: monoterpene + acetyl group (C2H3O)
        units = 2
        follows_rule = True  # modified monoterpene
    else:
        units = c / 5
        follows_rule = False

    cls = "monoterpene" if units == 2 else "sesquiterpene" if units == 3 else f"{units}-mer"
    mw = c * 12 + h * 1 + o * 16

    check = "✓ follows rule" if follows_rule else "? modified"
    print(f"  {name:<25} C{c}H{h}{'O' + str(o) if o else '':4s}  MW={mw:3d}  {cls:14s} {check}")

print(f"\
{sum(1 for _, c, _, _ in cardamom if c % 5 == 0 or c == 12)}/{len(cardamom)} compounds follow the isoprene rule")
print("Nature builds aroma from a single 5-carbon brick!")`,
      challenge: 'Beta-carotene (the orange pigment in carrots) is C₄₀H₅₆. How many isoprene units is it? What terpene class? Why is it orange while monoterpenes are colorless?',
      successHint: 'You have discovered the isoprene rule — one of the great unifying principles of natural product chemistry. From the scent of cardamom to the color of carrots to the cholesterol in your blood, terpenes built from this simple 5-carbon unit are everywhere in biology.',
    },
    {
      title: 'Steam distillation — extracting the essence of cardamom',
      concept: `**Steam distillation** is the traditional method to extract essential oils from plant material. It works because:

1. Steam (100°C) passes through crushed cardamom pods
2. Heat ruptures oil gland cells, releasing volatile compounds
3. Volatile molecules co-distill with steam — they boil together below their individual boiling points
4. The steam-oil mixture condenses in a cooling coil
5. Oil and water separate (oil floats on top)

Why co-distillation works:
- In a mixture, the total vapor pressure = P_water + P_oil
- Boiling occurs when total P = atmospheric pressure (760 mmHg)
- Since water contributes most of the vapor pressure, the mixture boils near 100°C
- Even compounds with boiling points of 200°C+ are carried over with steam!

Yield depends on:
- **Material preparation**: finer grinding = more oil glands ruptured
- **Steam flow rate**: too slow = poor extraction, too fast = channeling
- **Duration**: most oil comes out in first 2-3 hours
- **Material freshness**: dried pods yield less than fresh

Cardamom oil yield: typically **3-8% by weight** (3-8 mL oil per 100 g pods).

📚 *We will model the extraction kinetics using exponential decay — the same math as radioactive decay.*`,
      analogy: 'Steam distillation is like washing clothes. The hot water (steam) loosens the dirt (essential oil) from the fabric (plant cells). It carries the dissolved material through the pipes (condenser) and deposits it in the washtub (collection flask). The key is enough hot water flowing for long enough to extract everything.',
      storyConnection: 'In the story, the cardamom farmers of Sikkim process their harvest using methods passed down for generations. Steam distillation is both ancient technology and applied chemistry — the farmers are performing organic chemistry in their processing sheds, using principles discovered formally only in the 19th century.',
      checkQuestion: 'Why does cardamom oil float on water after condensation?',
      checkAnswer: 'Density! Cardamom essential oil has a density of about 0.92 g/mL — lighter than water (1.00 g/mL). The oil molecules are mostly hydrocarbons (C and H), which are less dense than water. The oil-water mixture separates naturally because they are immiscible (do not mix) — terpenes are nonpolar, water is polar. Like oil and vinegar in salad dressing.',
      codeIntro: 'Model the extraction kinetics of steam distillation and calculate optimal processing time.',
      code: `# Steam distillation extraction model

import math

# Extraction follows first-order kinetics:
# oil_remaining(t) = oil_initial * e^(-k*t)
# oil_extracted(t) = oil_initial * (1 - e^(-k*t))

oil_initial = 5.0  # mL per 100g pods (5% yield potential)
k = 0.8            # extraction rate constant (per hour)

print("=== Steam Distillation of Cardamom ===")
print(f"Initial oil content: {oil_initial} mL per 100g")
print(f"Extraction rate constant: k = {k} /hr")
print()
print(f"{'Time(hr)':>10} {'Extracted(mL)':>14} {'Remaining(mL)':>14} {'Yield(%)':>10}")
print("-" * 52)

for t_min in range(0, 301, 30):
    t = t_min / 60  # hours
    extracted = oil_initial * (1 - math.exp(-k * t))
    remaining = oil_initial * math.exp(-k * t)
    yield_pct = extracted / oil_initial * 100
    print(f"{t:>10.1f} {extracted:>14.2f} {remaining:>14.2f} {yield_pct:>9.1f}%")

print()

# Economic analysis
print("=== Economic Analysis ===")
oil_price = 3000  # Rs per mL (premium cardamom oil)
steam_cost = 50   # Rs per hour (fuel for boiler)

for hours in [1, 2, 3, 4, 5]:
    extracted = oil_initial * (1 - math.exp(-k * hours))
    revenue = extracted * oil_price
    cost = steam_cost * hours
    profit = revenue - cost
    print(f"  {hours}hr distillation: {extracted:.2f} mL → Rs {revenue:.0f} revenue - Rs {cost:.0f} cost = Rs {profit:.0f} profit")

# Find optimal time (marginal revenue = marginal cost)
# d(revenue)/dt = oil_initial * k * e^(-k*t) * price
# d(cost)/dt = steam_cost
# Optimal when: oil_initial * k * e^(-k*t) * price = steam_cost
t_optimal = -math.log(steam_cost / (oil_initial * k * oil_price)) / k
print(f"\
Optimal distillation time: {t_optimal:.1f} hours")
print(f"After this point, fuel costs exceed oil revenue per hour")
optimal_yield = oil_initial * (1 - math.exp(-k * t_optimal))
print(f"Oil at optimal time: {optimal_yield:.2f} mL ({optimal_yield/oil_initial*100:.0f}% of maximum)")`,
      challenge: 'If the pods are not properly crushed (k drops from 0.8 to 0.3), how much longer must you distill to get 90% yield? Is it still economically viable?',
      successHint: 'You have modeled chemical extraction kinetics — the same exponential decay math used in pharmacology, radioactive decay, and chemical engineering. The economic analysis adds a real-world dimension: knowing when to stop distilling is as important as knowing how to start.',
    },
    {
      title: 'How your nose detects aroma — the lock and key of smell',
      concept: `Your nose contains approximately **400 types of olfactory receptors**, each a protein that binds specific molecular shapes. When a cardamom molecule enters your nose:

1. It dissolves in the mucus layer inside the nasal cavity
2. It drifts to the **olfactory epithelium** (a small patch of receptor cells)
3. The molecule\'s shape fits into a receptor protein (like a key in a lock)
4. The receptor triggers a nerve signal to the brain
5. The brain interprets the pattern of activated receptors as "cardamom"

Each molecule activates multiple receptors in a unique pattern — a "smell fingerprint." The brain does not identify individual molecules; it recognizes **patterns** of receptor activation.

1,8-Cineole activates receptors tuned to:
- Small ring structures (cyclic ethers)
- Moderate hydrophobicity
- Specific molecular diameter (~0.6 nm)

This is why menthol (from mint) and cineole (from cardamom) smell similar — they have similar ring shapes and activate overlapping receptor sets, even though they come from completely different plants.

📚 *We will model the receptor activation pattern for cardamom compounds.*`,
      analogy: 'Your nose works like a piano. Each receptor is a key. A molecule "plays" several keys at once — a chord. Your brain recognizes the chord, not the individual keys. Cardamom plays a complex chord (many receptors), while a single pure chemical plays a simpler chord. Master perfumers are like musicians who can identify individual notes within a chord.',
      storyConnection: 'When the story describes the rich scent of Sikkim\'s cardamom drifting through the hills, it is describing a molecular symphony. The monsoon breeze carries dozens of volatile compounds from the cardamom pods, each activating a different pattern of receptors. The brain combines these patterns into the unified sensation we call "cardamom."',
      checkQuestion: 'Why can you distinguish thousands of different smells if you only have 400 receptor types?',
      checkAnswer: 'Combinatorial coding. Each smell activates a unique combination of the 400 receptors. With 400 receptors, the number of possible on/off patterns is 2⁴⁰⁰ — astronomically large. Even using just 10% of receptors per smell, you get C(400,40) = trillions of unique patterns. This is like how 26 letters produce millions of words.',
      codeIntro: 'Simulate olfactory receptor activation patterns for cardamom compounds and compare their "smell fingerprints."',
      code: `# Olfactory receptor model: smell fingerprints

import random

random.seed(42)

# 20 receptor types (simplified from ~400)
receptor_names = [f"OR{i+1}" for i in range(20)]

# Each compound activates a subset of receptors with varying strength (0-1)
compounds = {
    "1,8-Cineole": {"type": "cyclic ether", "size": "medium"},
    "Limonene": {"type": "cyclic hydrocarbon", "size": "medium"},
    "Linalool": {"type": "acyclic alcohol", "size": "medium"},
    "alpha-Pinene": {"type": "bicyclic hydrocarbon", "size": "small"},
    "Terpinyl acetate": {"type": "cyclic ester", "size": "large"},
    "Menthol (mint)": {"type": "cyclic alcohol", "size": "medium"},
}

# Generate activation patterns
# Similar shapes → similar patterns
shape_profiles = {
    "cyclic ether": [0.9, 0.7, 0.3, 0.1, 0.8, 0.2, 0.5, 0.1, 0.0, 0.4,
                     0.6, 0.3, 0.1, 0.7, 0.0, 0.2, 0.8, 0.1, 0.3, 0.5],
    "cyclic hydrocarbon": [0.3, 0.8, 0.6, 0.2, 0.1, 0.7, 0.4, 0.3, 0.8, 0.1,
                           0.2, 0.6, 0.0, 0.3, 0.5, 0.7, 0.1, 0.4, 0.2, 0.6],
    "acyclic alcohol": [0.1, 0.2, 0.7, 0.8, 0.3, 0.1, 0.6, 0.5, 0.2, 0.7,
                        0.4, 0.1, 0.8, 0.3, 0.6, 0.0, 0.3, 0.7, 0.5, 0.1],
    "bicyclic hydrocarbon": [0.4, 0.7, 0.5, 0.1, 0.2, 0.8, 0.3, 0.2, 0.7, 0.2,
                             0.3, 0.7, 0.1, 0.4, 0.6, 0.8, 0.2, 0.3, 0.1, 0.5],
    "cyclic ester": [0.7, 0.5, 0.2, 0.3, 0.6, 0.1, 0.4, 0.2, 0.1, 0.5,
                     0.8, 0.4, 0.3, 0.6, 0.1, 0.3, 0.7, 0.2, 0.4, 0.6],
    "cyclic alcohol": [0.8, 0.6, 0.4, 0.2, 0.7, 0.3, 0.5, 0.2, 0.1, 0.5,
                       0.5, 0.4, 0.2, 0.6, 0.1, 0.3, 0.7, 0.2, 0.4, 0.4],
}

print("=== Olfactory Receptor Activation Patterns ===\
")

# Add noise and display
activations = {}
for name, data in compounds.items():
    profile = shape_profiles[data["type"]]
    noisy = [max(0, min(1, p + random.uniform(-0.1, 0.1))) for p in profile]
    activations[name] = noisy

    # Display as bar visualization
    bar = ""
    for val in noisy:
        if val > 0.7: bar += "█"
        elif val > 0.4: bar += "▓"
        elif val > 0.2: bar += "░"
        else: bar += " "
    print(f"  {name:<22} [{bar}]")

# Similarity analysis
print("\
=== Aroma Similarity (cosine similarity) ===")
import math

def cosine_sim(a, b):
    dot = sum(x*y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x**2 for x in a))
    mag_b = math.sqrt(sum(x**2 for x in b))
    return dot / (mag_a * mag_b) if mag_a * mag_b > 0 else 0

names = list(activations.keys())
print(f"\
{'':22}", end="")
for n in names:
    print(f"{n[:8]:>9}", end="")
print()

for i, n1 in enumerate(names):
    print(f"{n1:<22}", end="")
    for j, n2 in enumerate(names):
        sim = cosine_sim(activations[n1], activations[n2])
        print(f"{sim:>9.2f}", end="")
    print()

# Find most similar pair
print("\
Most similar pair (excluding self):")
best_sim = 0
best_pair = ("", "")
for i in range(len(names)):
    for j in range(i+1, len(names)):
        sim = cosine_sim(activations[names[i]], activations[names[j]])
        if sim > best_sim:
            best_sim = sim
            best_pair = (names[i], names[j])
print(f"  {best_pair[0]} ↔ {best_pair[1]}: {best_sim:.3f}")
print("  This is why these two smell somewhat similar!")`,
      challenge: 'Add vanilla (vanillin, cyclic aldehyde) to the model. Is it more similar to the floral or the resinous cardamom compounds? This explains why cardamom and vanilla pair well in cooking.',
      successHint: 'You have modeled olfactory coding using activation vectors and cosine similarity — the same mathematics used in machine learning for text similarity. The receptor pattern model explains both why different molecules smell different AND why some pairs smell similar despite being chemically distinct.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Organic chemistry fundamentals with Python</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L1-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
