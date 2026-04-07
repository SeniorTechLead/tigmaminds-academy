import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function NagaDaoLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Pressure — why sharp edges cut better',
      concept: `**Pressure** is force distributed over an area:

**P = F / A**

Where P is in Pascals (Pa), F in Newtons (N), and A in square meters (m²).

The Naga dao (a traditional machete-like blade) has an edge ground to extreme sharpness. A sharp edge has a tiny contact area, concentrating force into enormous pressure:

- Blunt edge (1 mm wide): A = 0.001 × 0.15 = 1.5 × 10⁻⁴ m² → P = 100/0.00015 = 667,000 Pa
- Sharp edge (0.01 mm): A = 0.00001 × 0.15 = 1.5 × 10⁻⁶ m² → P = 100/0.0000015 = 66,700,000 Pa

The sharp edge produces 100× more pressure from the same force!

📚 *Python uses the ** operator for exponents: 10**6 means "10 to the power of 6" = 1,000,000.*`,
      analogy: 'Pressure is why you can push a thumbtack into a wall with your thumb but cannot push your thumb directly into the wall. The same force is concentrated onto the tiny point of the tack, creating enormous pressure. A dao edge works the same way — a thin edge concentrates cutting force into a tiny area.',
      storyConnection: 'Naga blacksmiths spend hours grinding the dao edge to razor sharpness. They understand intuitively that a sharper edge cuts better, even though they may not use the word "pressure." The physics validates what generations of craftsmen discovered through practice.',
      checkQuestion: 'If you could make the edge infinitely sharp (zero width), would the pressure be infinite?',
      checkAnswer: 'Mathematically, P → infinity as A → 0. In practice, no edge can be infinitely sharp because atoms have finite size (~0.1-0.3 nm). The sharpest possible edge is about 1 atom wide. At this scale, the edge still has a measurable area, so pressure is enormous but finite. Obsidian (volcanic glass) can fracture to near-atomic sharpness, which is why it was prized for surgical tools in ancient times.',
      codeIntro: 'Calculate the pressure exerted by dao edges of different sharpness.',
      code: `# Pressure analysis: Naga Dao edge

force = 100  # Newtons (moderate chopping force)
blade_length = 0.15  # meters (15 cm cutting edge)

# Different edge widths
edge_widths_mm = [2.0, 1.0, 0.5, 0.1, 0.05, 0.01, 0.001]

print("Naga Dao — Edge Pressure Analysis")
print(f"Cutting force: {force} N | Blade length: {blade_length*100:.0f} cm")
print("=" * 65)
print(f"{'Edge width':>12} | {'Contact area':>14} | {'Pressure':>12} | {'Equivalent'}")
print("-" * 65)

for width_mm in edge_widths_mm:
    width_m = width_mm / 1000
    area = width_m * blade_length
    pressure = force / area
    pressure_mpa = pressure / 1e6

    if pressure_mpa < 1:
        equiv = "gentle touch"
    elif pressure_mpa < 10:
        equiv = "firm press"
    elif pressure_mpa < 100:
        equiv = "cuts soft wood"
    elif pressure_mpa < 1000:
        equiv = "cuts hardwood"
    else:
        equiv = "cuts bone/metal"

    print(f"  {width_mm:>8.3f} mm | {area:.2e} m² | {pressure_mpa:>8.1f} MPa | {equiv}")

print()
# Comparison with materials' shear strength
materials = [
    ("Tomato skin", 0.5),
    ("Bamboo", 15),
    ("Hardwood (oak)", 50),
    ("Bone", 80),
    ("Mild steel", 250),
]

sharp_edge = 0.01 / 1000  # 0.01 mm
area_sharp = sharp_edge * blade_length
pressure_sharp = force / area_sharp / 1e6

print(f"With a sharp dao (0.01 mm edge, {force} N force):")
print(f"  Pressure generated: {pressure_sharp:.0f} MPa")
print()
for name, strength in materials:
    can_cut = "YES" if pressure_sharp > strength else "no"
    print(f"  Can it cut {name:15s} (strength: {strength:>5.1f} MPa)? {can_cut}")`,
      challenge: 'A Naga blacksmith applies 200 N of chopping force with a blade ground to 0.02 mm edge width. Can this dao cut through bamboo (shear strength 15 MPa)? Through hardwood (50 MPa)?',
      successHint: 'You have learned the fundamental physics of cutting: P = F/A. Everything about blade design — edge geometry, sharpness, bevel angle — is about maximizing pressure at the cutting point.',
    },
    {
      title: 'Iron and carbon — what makes steel strong',
      concept: `Steel is not a single material — it is iron with controlled amounts of **carbon**. The carbon content determines the steel's properties:

- **Wrought iron** (< 0.08% C): very soft, easy to forge, weak edge
- **Mild steel** (0.1-0.3% C): moderate strength, tough, cannot hold an edge
- **Medium steel** (0.3-0.6% C): strong, good edge retention
- **High-carbon steel** (0.6-1.0% C): very hard, excellent edge, but brittle
- **Cast iron** (> 2% C): very hard but extremely brittle, shatters on impact

The Naga dao requires the perfect balance: hard enough to hold a sharp edge, tough enough to survive chopping impacts. This typically means 0.4-0.7% carbon.

📚 *Python **lists** and **for loops** work together: for item in [1, 2, 3] processes each item in sequence.*`,
      analogy: 'Carbon in steel is like salt in cooking. Too little and the dish is bland (soft iron, no edge). Just right and it enhances everything (good steel, sharp and tough). Too much and the dish is ruined (brittle cast iron, shatters). The Naga blacksmith\'s skill is knowing exactly how much "salt" to add.',
      storyConnection: 'Traditional Naga blacksmiths cannot measure carbon content with instruments. They judge by color during heating (straw, brown, blue, cherry red), by the sound when struck (ring vs thud), and by how the metal responds to filing. These are indirect measurements of carbon content, refined over generations.',
      checkQuestion: 'Why does adding carbon make iron harder?',
      checkAnswer: 'Carbon atoms are much smaller than iron atoms. They fit into the gaps (interstitial sites) between iron atoms in the crystal lattice. These carbon atoms block the movement of dislocations (crystal defects that allow metal to deform). More carbon = more blocked dislocations = harder material. But too much carbon forms iron carbide (Fe₃C), which is extremely hard but brittle — like glass. The art is having enough carbon to block dislocations without forming too much brittle carbide.',
      codeIntro: 'Model how carbon content affects steel hardness, strength, and brittleness.',
      code: `# Steel properties vs carbon content

carbon_pcts = [0.02, 0.08, 0.15, 0.30, 0.45, 0.60, 0.80, 1.0, 1.5, 2.5]

print("Steel Properties vs Carbon Content")
print("=" * 75)
print(f"{'Carbon %':>9} | {'Type':>15} | {'Hardness':>10} | {'Strength':>10} | {'Ductility':>10} | {'Edge'}")
print("-" * 75)

for c_pct in carbon_pcts:
    # Empirical models (simplified)
    # Hardness increases roughly linearly with carbon up to ~0.8%
    hardness_hrc = min(65, 10 + 70 * c_pct)

    # Tensile strength peaks around 0.8% carbon
    strength_mpa = 300 + 800 * c_pct if c_pct < 0.8 else 940 - 200 * (c_pct - 0.8)

    # Ductility decreases with carbon
    ductility_pct = max(1, 35 - 35 * c_pct)

    # Classification
    if c_pct < 0.08:
        steel_type = "wrought iron"
    elif c_pct < 0.3:
        steel_type = "mild steel"
    elif c_pct < 0.6:
        steel_type = "medium steel"
    elif c_pct <= 1.0:
        steel_type = "high-carbon"
    else:
        steel_type = "cast iron"

    # Edge holding ability
    if hardness_hrc < 30:
        edge = "poor"
    elif hardness_hrc < 45:
        edge = "fair"
    elif hardness_hrc < 55:
        edge = "good"
    elif hardness_hrc < 62:
        edge = "excellent"
    else:
        edge = "brittle!"

    tag = " <-- dao ideal" if 0.4 <= c_pct <= 0.7 else ""
    print(f"  {c_pct:>6.2f}% | {steel_type:>15} | {hardness_hrc:>7.0f} HRC | {strength_mpa:>7.0f} MPa | {ductility_pct:>8.1f}% | {edge}{tag}")

print()
print("The Naga dao sweet spot: 0.4-0.7% carbon")
print("  Hard enough (45-55 HRC) to hold a sharp edge for days of jungle work")
print("  Tough enough (10-20% ductility) to survive impacts without chipping")`,
      challenge: 'If a Naga blacksmith accidentally adds too much carbon (1.2%), the dao becomes brittle. What hardness would it reach? Would it shatter when chopping hardwood? What should the smith do to fix it?',
      successHint: 'You now understand the carbon-steel relationship that forms the basis of all blade metallurgy. The dao\'s carbon content is its most critical specification, determining whether it is a useful tool or a dangerous failure.',
    },
    {
      title: 'Heat treatment — hardening and tempering',
      concept: `**Heat treatment** transforms steel's crystal structure by controlled heating and cooling:

1. **Annealing** (slow cool): soft, workable, large grains → for shaping
2. **Quenching** (fast cool in water/oil): extremely hard but brittle → forms martensite
3. **Tempering** (reheat to 150-600°C): reduces brittleness while keeping hardness

The crystal phases of steel:
- **Ferrite** (α-iron): soft, body-centered cubic (BCC), stable at room temperature
- **Austenite** (γ-iron): high-temperature phase, face-centered cubic (FCC)
- **Martensite**: supersaturated carbon in distorted BCC, extremely hard
- **Pearlite**: layered ferrite + cementite (Fe₃C), moderate hardness

📚 *Python can use **if/elif/else** chains to categorize values. This is useful for classifying heat treatment temperatures into crystal phases.*`,
      analogy: 'Heat treatment is like baking bread. Mixing dough (annealing) makes it soft and workable. Baking at high temperature (quenching) transforms it into a rigid structure. But overbaking makes it hard and crumbly (too brittle). Tempering is like adding a brief rest period — it softens the crust just enough while keeping the bread firm.',
      storyConnection: 'Naga blacksmiths heat the dao blade to cherry red (~800°C), then quench it in water. They then temper by reheating gently until the surface turns straw-yellow (~200°C). These color-temperature relationships are their temperature sensors — no thermometer needed, just generations of accumulated knowledge.',
      checkQuestion: 'Why does quenching in water make steel harder than slow cooling in air?',
      checkAnswer: 'At high temperature (~800°C), steel is in the austenite phase where carbon dissolves evenly in the crystal lattice. Slow cooling gives carbon time to separate out into soft pearlite (ferrite + cementite layers). Fast cooling (quenching) traps the carbon in the lattice, creating martensite — a strained crystal structure that is extremely hard because the trapped carbon atoms prevent dislocation movement. Speed of cooling determines whether carbon escapes (soft) or stays trapped (hard).',
      codeIntro: 'Model the relationship between heat treatment temperature and resulting steel properties.',
      code: `# Heat treatment of dao steel

# Tempering temperature vs properties for 0.6% carbon steel
temper_temps = list(range(20, 650, 10))

print("Naga Dao Heat Treatment — Temper Temperature Guide")
print("Starting from: quenched martensite (65 HRC, very brittle)")
print("=" * 70)

print(f"{'Temp (°C)':>10} | {'Color':>12} | {'Hardness':>10} | {'Toughness':>10} | {'Use'}")
print("-" * 70)

for temp in [20, 100, 150, 200, 250, 300, 350, 400, 500, 600]:
    # Hardness decreases with tempering temperature
    if temp < 100:
        hardness = 65
        color = "untempered"
        toughness = 5
        use = "too brittle for dao"
    elif temp < 175:
        hardness = 62 - (temp - 100) * 0.05
        color = "light straw"
        toughness = 10
        use = "razor blades"
    elif temp < 220:
        hardness = 58 - (temp - 175) * 0.06
        color = "straw yellow"
        toughness = 20
        use = "fine cutting tools"
    elif temp < 280:
        hardness = 55 - (temp - 220) * 0.08
        color = "brown/gold"
        toughness = 30
        use = "DAO IDEAL RANGE"
    elif temp < 340:
        hardness = 50 - (temp - 280) * 0.08
        color = "purple"
        toughness = 45
        use = "springs, chisels"
    elif temp < 400:
        hardness = 45 - (temp - 340) * 0.10
        color = "blue"
        toughness = 55
        use = "saws, screwdrivers"
    else:
        hardness = max(20, 38 - (temp - 400) * 0.05)
        color = "gray (past blue)"
        toughness = 70
        use = "too soft for cutting"

    marker = " <--" if "DAO" in use else ""
    bar_h = "█" * int(hardness / 3)
    bar_t = "▒" * int(toughness / 3)
    print(f"  {temp:>6}°C | {color:>12} | {hardness:>5.0f} HRC {bar_h} | {toughness:>4.0f}% {bar_t} | {use}{marker}")

print()
print("Naga blacksmith's method:")
print("  1. Heat to cherry red (~800°C) → austenite forms")
print("  2. Quench in water → martensite (65 HRC, brittle)")
print("  3. Polish the flat and watch the color as you reheat:")
print("     - Stop at straw-to-brown (200-260°C) for the dao edge")
print("  4. The spine can be tempered to blue (300°C+) for toughness")
print("  This creates a DIFFERENTIAL temper: hard edge, tough spine!")`,
      challenge: 'Model a differential temper: the edge is tempered to 220°C (hard) and the spine to 350°C (tough). What are the hardness values? Why is this better than a uniform temper?',
      successHint: 'You have learned the three-step heat treatment process (anneal, quench, temper) that transforms soft iron into functional steel. The Naga blacksmith\'s color-based temperature sensing is remarkably accurate — within ±20°C of modern thermocouple readings.',
    },
    {
      title: 'Bevel geometry — the angle that determines everything',
      concept: `The **bevel angle** (the angle at which the blade edge is ground) determines the balance between sharpness and durability:

- **Very acute** (10-15°): extremely sharp but delicate (razors, scalpels)
- **Moderate** (15-25°): sharp and reasonably durable (kitchen knives)
- **Working angle** (25-35°): good balance for heavy use (dao, machete)
- **Obtuse** (35-45°): very durable but not very sharp (axes, cleavers)

The bevel angle affects:
- **Edge thickness**: t = 2 × h × tan(θ/2), where h is bevel height
- **Cutting force**: lower angles = less force needed
- **Edge retention**: higher angles = stronger edge, less chipping
- **Cutting geometry**: angle determines how the blade enters material

📚 *Python's **math** module provides trigonometric functions. math.tan() requires angles in radians: use math.radians(degrees) to convert.*`,
      analogy: 'A bevel angle is like the point of a pencil. A very sharp point (acute angle) writes fine lines but breaks easily. A blunt point (obtuse angle) is durable but writes thick lines. The ideal depends on the task — fine writing needs a sharp point, while a toddler\'s pencil needs a blunt, unbreakable point. The dao\'s 25-30° bevel is the "workman\'s pencil" of the blade world.',
      storyConnection: 'Naga blacksmiths grind different bevel angles for different tasks: a narrower bevel for skinning and food preparation, a wider bevel for chopping bamboo and wood. The angle is not arbitrary — it is matched to the material being cut and the forces involved.',
      checkQuestion: 'Why does a knife with a 10° edge angle dull faster than one with a 25° edge?',
      checkAnswer: 'At 10°, the edge metal is extremely thin — the two bevels meet at a nearly flat angle, leaving very little material at the tip. This thin edge is easily deformed by contact with hard materials (bone, cutting boards) and by lateral forces (slicing motion). At 25°, more metal supports the edge, providing greater resistance to deformation. The trade-off: the 10° edge starts sharper but dulls quickly; the 25° edge starts less sharp but retains its edge much longer.',
      codeIntro: 'Calculate edge geometry and cutting performance for different bevel angles.',
      code: `import math

# Bevel geometry analysis

bevel_height = 10  # mm (height of the bevel from edge to spine)

print("Naga Dao — Bevel Geometry Analysis")
print(f"Bevel height: {bevel_height} mm")
print("=" * 75)

angles = [10, 15, 20, 25, 30, 35, 40, 45]

print(f"{'Angle':>7} | {'Edge (mm)':>9} | {'Edge (μm)':>9} | {'Sharpness':>10} | {'Durability':>11} | {'Use'}")
print("-" * 75)

for angle in angles:
    half_angle = math.radians(angle / 2)
    edge_thickness_mm = 2 * bevel_height * math.tan(half_angle) / math.cos(half_angle) * 0.01  # simplified
    edge_thickness_um = edge_thickness_mm * 1000

    # Sharpness inversely proportional to edge thickness
    sharpness = 100 / (1 + edge_thickness_um / 10)
    # Durability proportional to edge angle
    durability = angle / 45 * 100

    if angle <= 15:
        use = "razor/scalpel"
    elif angle <= 22:
        use = "kitchen knife"
    elif angle <= 32:
        use = "DAO / machete"
    elif angle <= 40:
        use = "axe / cleaver"
    else:
        use = "splitting wedge"

    marker = " <--" if 25 <= angle <= 30 else ""
    bar_s = "█" * int(sharpness / 5)
    bar_d = "▓" * int(durability / 5)
    print(f"  {angle:>4}° | {edge_thickness_mm:>7.3f} | {edge_thickness_um:>7.1f} | S:{bar_s:15s} | D:{bar_d:15s} | {use}{marker}")

# Cutting force model
print()
print("Cutting Force vs Bevel Angle (100 N applied force):")
applied_force = 100
for angle in [15, 20, 25, 30, 35]:
    # Cutting force component depends on wedge angle
    theta = math.radians(angle / 2)
    # Normal force on cut surface = F * sin(theta) / cos(theta)
    cutting_pressure_factor = 1 / math.tan(theta)
    effective_pressure = applied_force * cutting_pressure_factor
    print(f"  {angle}° bevel: effective cutting pressure = {effective_pressure:.0f}x (relative)")

print()
print("The Naga dao at 25-30° balances:")
print("  - Enough sharpness to slice bamboo with minimal effort")
print("  - Enough edge strength to chop hardwood without chipping")
print("  - Practical for all-day jungle work without constant resharpening")`,
      challenge: 'A Naga blacksmith grinds an asymmetric edge: 20° on the cutting side, 30° on the flat side. Calculate the total included angle and explain why this chisel-like grind might be useful for specific tasks.',
      successHint: 'Bevel geometry is the bridge between metallurgy and practical performance. The Naga dao\'s 25-30° bevel is an engineering optimum for a general-purpose jungle tool.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Metallurgy Foundations</span>
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
