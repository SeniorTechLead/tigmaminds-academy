import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function SwamimalaiLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Alloy composition — how mixing metals changes everything',
      concept: `An **alloy** is a mixture of two or more metals (or a metal and a non-metal). Bronze is one of humanity's oldest alloys: roughly 88-92% copper and 8-12% tin. But why these proportions? Each ratio gives different properties — hardness, colour, melting point, and castability all change with composition.

The relationship between composition and properties is not linear. Adding 5% tin does not simply give you "5% of tin's properties plus 95% of copper's properties." Instead, the tin atoms disrupt the copper crystal lattice in ways that create **entirely new behaviours** — like a melting point lower than either pure metal.

In the code below, you will explore how varying the copper-to-tin ratio affects multiple properties simultaneously. The Swamimalai casters must balance these competing properties: more tin means harder but more brittle; less tin means softer but tougher.

*Composition is expressed as weight percent (wt%): a 10 wt% Sn bronze means 10 grams of tin per 100 grams of alloy. The remaining 90 grams are copper.*`,
      analogy: 'Think of mixing paint colours. A tiny drop of blue in yellow gives a particular green. More blue shifts the green towards teal. The resulting colour is not just "average of blue and yellow" — the pigments interact in non-linear ways. Similarly, tin atoms interact with copper atoms to create properties that neither metal has alone.',
      storyConnection: 'Different Swamimalai sculptures require different bronze compositions. A large Nataraja statue needs a softer bronze (8% tin) so it can be chiselled and finished. A small bell needs a harder, more resonant bronze (20-22% tin, called "bell metal"). The master caster adjusts the recipe for each commission.',
      checkQuestion: 'If you have 4.5 kg of copper and want to make bronze with 10% tin, how much tin do you add?',
      checkAnswer: 'If the final alloy is 10% tin, then tin = 10% of total weight, and copper = 90% of total weight. So 4.5 kg = 90% of total, meaning total = 5.0 kg. Tin needed = 5.0 - 4.5 = 0.5 kg. Check: 0.5 / 5.0 = 10%. Correct.',
      codeIntro: 'Explore how bronze properties change with tin content.',
      code: `import numpy as np

# Bronze properties vs tin content
tin_range = np.arange(0, 25, 0.5)

# Hardness (Vickers HV) - increases with tin
hardness = 45 + 6.5 * tin_range + 0.1 * tin_range ** 2

# Elongation (% before fracture) - decreases with tin (more brittle)
elongation = 45 - 1.8 * tin_range - 0.02 * tin_range ** 2
elongation = np.maximum(elongation, 0.5)  # minimum ductility

# Colour (simplified RGB-ish scale: 0=copper red, 100=golden)
colour_index = np.minimum(100, 10 * tin_range)

# Melting point (simplified)
melt_point = 1085 - 10.5 * tin_range + 0.15 * tin_range ** 2

print("=== Bronze Properties vs Tin Content ===")
header = "Tin %   Hardness(HV)  Elongation(%)  Melt Point(C)  Colour"
print(header)
print("-" * len(header))

for pct in [0, 2, 4, 6, 8, 10, 12, 15, 18, 20, 24]:
    idx = int(pct / 0.5)
    if idx >= len(tin_range):
        idx = len(tin_range) - 1
    colour = "Copper red" if pct < 4 else "Rose gold" if pct < 8 else "Golden" if pct < 15 else "Pale gold"
    print(f"{pct:>5}   {hardness[idx]:>10.0f}    {elongation[idx]:>11.1f}    "
          f"{melt_point[idx]:>11.0f}    {colour}")

print()
print("=== Common Bronze Recipes ===")
recipes = [
    ("Sculpture bronze", 10, "Good castability, moderate hardness"),
    ("Bell metal", 22, "Very hard, resonant, brittle"),
    ("Gun metal", 8, "Tough, corrosion resistant"),
    ("Speculum", 33, "Mirror-bright polish, very brittle"),
]
for name, sn, note in recipes:
    print(f"  {name:<20} {sn:>2}% Sn  -- {note}")`,
      challenge: 'Add phosphorus as a third element. Phosphor bronze (0.5-1% P) is much harder and more wear-resistant. Create a new property row that shows how adding 0.5% phosphorus boosts hardness by about 30 HV across all tin levels.',
      successHint: 'You just built an alloy property calculator. Modern metallurgists use far more sophisticated versions of this — databases with thousands of alloy compositions and machine learning models that predict properties from composition. But the core concept is the same: composition determines properties.',
    },
    {
      title: 'Density and volume — predicting how much metal fills a mould',
      concept: `Before pouring bronze, the caster must know exactly how much molten metal is needed. Too little and the mould will not fill completely. Too much is wasteful and the excess must be removed. The key relationship is: **mass = density x volume**.

Bronze has a density of about **8800 kg/m cubed** — nearly nine times heavier than water. This means a small sculpture is surprisingly heavy. A Nataraja figure just 30 cm tall might weigh 5-8 kg of solid bronze.

But lost-wax sculptures are not solid — they have a **clay core** inside, so the bronze forms a shell typically 3-8 mm thick. This saves enormous amounts of expensive bronze. Calculating the volume of this shell requires subtracting the core volume from the outer volume.

*Density is mass per unit volume. Every material has a characteristic density: water is 1000 kg/m cubed, aluminium is 2700, bronze is 8800, gold is 19300.*`,
      analogy: 'Imagine a chocolate Easter egg. The chocolate shell has a volume much smaller than the whole egg — it is the volume of the egg minus the volume of the hollow inside. Similarly, a bronze sculpture is a thin shell around a clay core. The bronze volume is outer shape minus inner core.',
      storyConnection: 'Swamimalai casters are remarkably precise at estimating how much bronze to melt. They weigh the wax model and multiply by 8.5 (the density ratio of bronze to wax). If the wax model weighs 600 grams, they prepare about 5.1 kg of bronze plus a 10% margin for the pouring channels.',
      checkQuestion: 'A solid bronze cube measures 10 cm on each side. What is its mass?',
      checkAnswer: 'Volume = 10 cm x 10 cm x 10 cm = 1000 cm cubed = 0.001 m cubed. Mass = density x volume = 8800 kg/m cubed x 0.001 m cubed = 8.8 kg. That is nearly 9 kg for a cube the size of a grapefruit — bronze is heavy.',
      codeIntro: 'Calculate bronze requirements for sculptures of various sizes and shell thicknesses.',
      code: `import numpy as np

# Bronze density and casting calculations
bronze_density = 8800  # kg/m^3
wax_density = 960      # kg/m^3
clay_density = 1800    # kg/m^3

def sphere_volume(radius_m):
    return (4 / 3) * np.pi * radius_m ** 3

def cylinder_volume(radius_m, height_m):
    return np.pi * radius_m ** 2 * height_m

print("=== Bronze Shell Volume Calculator ===")
print("(Hollow casting: outer shell minus inner core)")
print()

# Various sculpture sizes (simplified as cylinders)
sculptures = [
    ("Small figurine",  0.05, 0.15, 0.004),  # radius, height, shell thickness (m)
    ("Medium deity",    0.08, 0.30, 0.005),
    ("Large Nataraja",  0.12, 0.45, 0.006),
    ("Temple statue",   0.20, 0.80, 0.008),
    ("Monumental",      0.35, 1.50, 0.010),
]

header = "Sculpture          Outer Vol(cm3)  Shell Vol(cm3)  Bronze(kg)  Saving %"
print(header)
print("-" * len(header))

for name, r, h, t in sculptures:
    outer_vol = cylinder_volume(r, h)
    inner_vol = cylinder_volume(r - t, h - 2 * t)
    shell_vol = outer_vol - inner_vol
    solid_mass = outer_vol * bronze_density
    shell_mass = shell_vol * bronze_density
    saving = (1 - shell_vol / outer_vol) * 100

    print(f"{name:<18} {outer_vol*1e6:>12.0f}    {shell_vol*1e6:>12.0f}    "
          f"{shell_mass:>8.2f}    {saving:>5.1f}%")

print()
print("=== Wax-to-Bronze Weight Ratio ===")
ratio = bronze_density / wax_density
print(f"Density ratio: {ratio:.1f}x")
print(f"If wax model weighs 500 g, bronze needed: ~{500 * ratio / 1000:.1f} kg")
print("Casters add 10-15% extra for pouring channels and waste.")`,
      challenge: 'Modify the calculator to handle a sphere shape (like a decorative bronze ball). Compare the shell volume of a sphere versus a cylinder of the same height and diameter. Which shape uses less bronze for the same visual size?',
      successHint: 'Volume and density calculations are essential in manufacturing, shipping, construction, and materials science. You just solved the same problem that every foundry in the world solves before every pour: how much metal do we need?',
    },
    {
      title: 'Binary phase diagrams — reading the map of metal mixtures',
      concept: `A **binary phase diagram** is the master map of a two-component alloy system. For copper-tin, it shows what phases (solid, liquid, or mixtures) exist at every combination of temperature and composition. It is arguably the single most important tool in metallurgy.

The diagram has several key features: the **liquidus line** (above which everything is liquid), the **solidus line** (below which everything is solid), and the region between them (the **mushy zone** where solid and liquid coexist). Where the liquidus and solidus meet at a minimum is the **eutectic point**.

In the code below, you will construct a simplified Cu-Sn phase diagram and use it to predict what happens when you cool a bronze alloy of any composition. This is exactly what metallurgists do when designing alloys.

*A phase diagram is like a weather map for metals — instead of pressure and temperature predicting rain or sun, composition and temperature predict solid, liquid, or mixtures.*`,
      analogy: 'Think of a map that shows where land and water meet on a coastline. The phase diagram is similar — it shows the boundary between "solid metal" and "liquid metal." Just as you can trace a line on the map to see if you are on land or water, you can trace a line on the phase diagram to see if your alloy is solid or liquid at a given temperature.',
      storyConnection: 'When a Swamimalai caster heats bronze to 1050 degrees C for pouring, the phase diagram tells us the metal is fully liquid. As it cools in the mould, it crosses the liquidus into the mushy zone, where solid crystals start forming in the remaining liquid. The final microstructure — and hence the strength and appearance — depends on how the alloy traverses this diagram.',
      checkQuestion: 'On a Cu-Sn phase diagram, bronze with 10% tin is heated to 1100 degrees C. Is it above or below the liquidus?',
      checkAnswer: 'The liquidus for 10% Sn bronze is approximately 1000 degrees C. At 1100 degrees C, the alloy is 100 degrees above the liquidus, so it is fully liquid. This extra temperature above the liquidus is called "superheat" and ensures the metal flows freely into the mould.',
      codeIntro: 'Build a simplified Cu-Sn binary phase diagram and trace cooling paths through it.',
      code: `import numpy as np

# Simplified Cu-Sn phase diagram
# Liquidus: temperature above which alloy is fully liquid
# Solidus: temperature below which alloy is fully solid

def liquidus(sn_pct):
    """Approximate liquidus curve for Cu-Sn system"""
    if sn_pct <= 13.5:
        return 1085 - 21.0 * sn_pct
    else:
        return 798 + 2.5 * (sn_pct - 13.5)

def solidus(sn_pct):
    """Approximate solidus curve for Cu-Sn system"""
    if sn_pct <= 13.5:
        return 798  # eutectic temperature
    else:
        return 798

def phase_at(sn_pct, temp_C):
    """Determine the phase at a given composition and temperature"""
    liq = liquidus(sn_pct)
    sol = solidus(sn_pct)
    if temp_C > liq:
        return "Liquid"
    elif temp_C < sol:
        return "Solid"
    else:
        frac = (liq - temp_C) / (liq - sol)
        return f"Mushy ({frac*100:.0f}% solid)"

print("=== Simplified Cu-Sn Phase Diagram ===")
print()
header = "Sn %    Liquidus(C)  Solidus(C)  Mushy Range(C)"
print(header)
print("-" * len(header))

for pct in range(0, 26, 2):
    liq = liquidus(pct)
    sol = solidus(pct)
    mushy = liq - sol
    marker = " <-- eutectic" if pct == 14 else ""
    print(f"{pct:>4}    {liq:>9.0f}    {sol:>9.0f}    {mushy:>13.0f}{marker}")

print()
print("=== Cooling Path for 10% Sn Bronze (from 1100 C) ===")
print()
for temp in [1100, 1050, 1000, 950, 900, 850, 800, 790]:
    phase = phase_at(10, temp)
    print(f"  {temp} C  -->  {phase}")

print()
print("=== Phase Map at 900 C ===")
print("Which compositions are liquid, mushy, or solid at 900 C?")
for pct in [0, 5, 10, 15, 20]:
    phase = phase_at(pct, 900)
    print(f"  {pct}% Sn at 900 C: {phase}")`,
      challenge: 'Add a function that calculates the "lever rule" — the exact percentage of solid and liquid in the mushy zone at a given temperature. For 10% Sn bronze at 900 degrees C, what fraction is solid and what fraction is liquid?',
      successHint: 'You just built a phase diagram reader. Metallurgists, ceramists, and materials scientists use phase diagrams every day to design alloys, predict casting behaviour, and troubleshoot manufacturing problems. The Cu-Sn diagram you modelled is one of the oldest and most studied in all of materials science.',
    },
    {
      title: 'Thermal expansion mismatch — why moulds crack',
      concept: `When the bronze caster heats the clay mould to 700 degrees C and then pours 1050 degree C bronze into it, both materials expand — but at different rates. This difference in thermal expansion is called a **thermal expansion mismatch**, and it creates stress at the interface between the mould and the metal.

If the mismatch stress exceeds the strength of the clay mould, it cracks. If it exceeds the strength of the solidifying bronze, the casting develops surface defects. The casters must carefully choose mould materials and heating schedules to minimize this mismatch.

The key equation is: **thermal stress = E x alpha x delta_T**, where E is the elastic modulus (stiffness), alpha is the coefficient of thermal expansion, and delta_T is the temperature change.

*Thermal expansion mismatch is why you preheat the mould before pouring — bringing it closer to the metal temperature reduces delta_T and hence the mismatch stress.*`,
      analogy: 'Imagine gluing a rubber band to a steel ruler, then heating both. The rubber expands much more than the steel, but the glue forces them to stay the same length. The result is stress — the rubber is compressed and the steel is stretched. If the stress exceeds the glue strength, they separate. This is thermal expansion mismatch.',
      storyConnection: 'This is why Swamimalai casters preheat their moulds in the furnace before pouring. A cold mould hit with 1050 degree C bronze would experience a massive temperature shock. By preheating to 700 degrees C, the temperature difference is only 350 degrees C instead of over 1000 degrees C, reducing the mismatch stress by two-thirds.',
      checkQuestion: 'If the mismatch stress is proportional to the temperature difference, and preheating reduces the difference from 1025 degrees C to 350 degrees C, by what factor is the stress reduced?',
      checkAnswer: 'Factor = 1025 / 350 = 2.93 times. The stress is reduced by nearly a factor of 3. This is the difference between a mould that survives the pour and one that cracks, ruining a sculpture that took weeks to prepare.',
      codeIntro: 'Calculate thermal expansion mismatch stresses between bronze and various mould materials.',
      code: `import numpy as np

# Thermal expansion properties
materials = {
    "Bronze":       {"alpha": 18e-6, "E_GPa": 110},
    "Clay mould":   {"alpha": 5e-6,  "E_GPa": 15},
    "Plaster":      {"alpha": 17e-6, "E_GPa": 3},
    "Steel flask":  {"alpha": 12e-6, "E_GPa": 200},
    "Graphite":     {"alpha": 4e-6,  "E_GPa": 10},
    "Ceramic shell":{"alpha": 6e-6,  "E_GPa": 20},
}

bronze_alpha = materials["Bronze"]["alpha"]
pour_temp = 1050  # C

print("=== Thermal Expansion Mismatch Analysis ===")
print(f"Bronze CTE (alpha): {bronze_alpha*1e6:.0f} x 10^-6 /C")
print()

# Compare mould preheating temperatures
preheat_temps = [25, 200, 400, 600, 700]

print("=== Mismatch Stress vs Mould Preheat Temperature ===")
print("(Bronze poured at 1050 C into clay mould)")
print()

clay = materials["Clay mould"]
delta_alpha = abs(bronze_alpha - clay["alpha"])
effective_E = clay["E_GPa"]  # mould is weaker, so it bears the stress

header = "Preheat(C)  Delta_T(C)  Mismatch Strain  Stress(MPa)  Risk"
print(header)
print("-" * len(header))

for preheat in preheat_temps:
    delta_T = pour_temp - preheat
    strain = delta_alpha * delta_T
    stress = effective_E * 1000 * strain / 1e6  # convert to MPa
    risk = "HIGH" if stress > 8 else "MEDIUM" if stress > 4 else "LOW"
    print(f"{preheat:>8}    {delta_T:>7}    {strain:>14.6f}    {stress:>9.1f}    {risk}")

print()
print("=== Comparison of Mould Materials (preheated to 700 C) ===")
print()
delta_T = pour_temp - 700
header2 = "Mould Material    Delta_alpha   Stress(MPa)"
print(header2)
print("-" * len(header2))

for name, props in materials.items():
    if name == "Bronze":
        continue
    da = abs(bronze_alpha - props["alpha"])
    stress = props["E_GPa"] * 1000 * da * delta_T / 1e6
    print(f"{name:<18} {da*1e6:>9.1f}e-6   {stress:>9.1f}")`,
      challenge: 'Add a "safety factor" calculation: divide the tensile strength of each mould material (clay ~3 MPa, plaster ~2 MPa, ceramic ~30 MPa) by the mismatch stress to get the safety factor. A safety factor below 1.0 means the mould will crack.',
      successHint: 'Thermal expansion mismatch is a critical design consideration in electronics (chip-to-board bonding), aerospace (composite structures), and dentistry (fillings in teeth). The same physics that cracks a Swamimalai mould can crack a spacecraft heat shield.',
    },
    {
      title: 'Oxidation and patina — the chemistry of bronze surfaces',
      concept: `Fresh bronze is a brilliant golden colour. But over time, it develops a green or brown surface layer called a **patina**. This is caused by **oxidation** — a chemical reaction where copper atoms on the surface combine with oxygen, water, and other chemicals in the air.

The primary reaction is: 2Cu + O2 -> 2CuO (copper oxide, black-brown). Over years, this further reacts with CO2 and water: 2CuO + CO2 + H2O -> Cu2(OH)2CO3 (copper carbonate, green). This green patina is what gives old bronze sculptures and the Statue of Liberty their distinctive colour.

In the code below, you will model the growth of patina over time using a **parabolic growth law**: the thickness of the oxide layer grows proportionally to the square root of time. This is because the reaction rate slows as the oxide layer gets thicker (oxygen must diffuse through the existing layer to reach fresh metal).

*Parabolic growth means the layer grows quickly at first then slows down. After 1 year, it might be 1 micrometre thick; after 100 years, only 10 micrometres — not 100.*`,
      analogy: 'Imagine painting a wall by throwing paint at it from a distance. The first coat goes on quickly because the bare wall catches paint easily. But each subsequent coat is harder because the paint must land on top of previous layers. The wall gets painted slower and slower — this is parabolic growth.',
      storyConnection: 'Swamimalai casters deliberately apply patina to their finished sculptures using chemical treatments — applying mixtures of salt, vinegar, and ammonia to accelerate the oxidation. They control the colour by varying the chemicals: liver of sulphur gives brown-black, cupric nitrate gives green. The patina protects the bronze and gives it an aged, dignified appearance.',
      checkQuestion: 'If the oxide thickness follows a square root law, and the patina is 2 micrometres after 4 years, how thick will it be after 16 years?',
      checkAnswer: 'Square root law: thickness is proportional to sqrt(time). sqrt(4) = 2, sqrt(16) = 4. Since thickness was 2 um at sqrt(4)=2, the constant is 1. At sqrt(16)=4, thickness = 4 micrometres. The patina only doubled even though the time quadrupled.',
      codeIntro: 'Model patina growth on bronze over centuries using oxidation kinetics.',
      code: `import numpy as np

# Parabolic oxidation model for bronze patina
# Thickness = k * sqrt(time)

def patina_thickness_um(years, k=1.0, environment="urban"):
    """Calculate patina thickness in micrometres.
    k depends on environment: marine > urban > rural > indoor
    """
    env_factors = {
        "marine": 2.5,
        "urban": 1.5,
        "rural": 1.0,
        "indoor": 0.3,
        "temple": 0.8,  # sheltered but incense smoke
    }
    factor = env_factors.get(environment, 1.0)
    return k * factor * np.sqrt(years)

years = np.array([0.1, 0.5, 1, 2, 5, 10, 25, 50, 100, 200, 500, 1000])

print("=== Bronze Patina Growth Over Time ===")
print()

environments = ["indoor", "temple", "rural", "urban", "marine"]

header = "Years    " + "  ".join(f"{e:>8}" for e in environments) + "  (micrometres)"
print(header)
print("-" * len(header))

for y in years:
    values = [patina_thickness_um(y, environment=e) for e in environments]
    row = f"{y:>6.1f}   " + "  ".join(f"{v:>8.2f}" for v in values)
    print(row)

print()
print("=== Patina Colour Stages ===")
stages = [
    (0.5, "Dull copper", "Initial tarnish (Cu2O)"),
    (2, "Brown", "Cuprite layer (CuO)"),
    (5, "Dark brown", "Mixed oxides"),
    (15, "Green-brown", "Carbonate forming (Cu2(OH)2CO3)"),
    (30, "Green", "Full verdigris patina"),
]
for thickness, colour, description in stages:
    indoor_years = (thickness / 0.3) ** 2
    outdoor_years = (thickness / 1.5) ** 2
    print(f"  {thickness:>4.1f} um: {colour:<14} {description}")
    print(f"         Indoor: ~{indoor_years:.0f} years | Outdoor: ~{outdoor_years:.0f} years")`,
      challenge: 'Add a "protective patina" calculation: once the patina reaches about 25 micrometres, it actually protects the bronze from further corrosion (the oxidation rate drops by 80%). Modify the model to reduce the growth rate after this threshold.',
      successHint: 'You just modelled a diffusion-controlled reaction — one of the most common types of chemical processes in nature and industry. Rusting of iron, scaling of boiler tubes, and even the growth of silicon oxide layers in semiconductor manufacturing all follow the same parabolic law.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Alloy science and phase diagrams</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model alloy composition, phase diagrams, and oxidation kinetics.
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
