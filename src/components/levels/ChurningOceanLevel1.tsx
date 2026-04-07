import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import ChurningDensityColumnDiagram from '../diagrams/ChurningDensityColumnDiagram';
import ChurningEmulsionDiagram from '../diagrams/ChurningEmulsionDiagram';
import PHScaleDiagram from '../diagrams/PHScaleDiagram';
import BuoyancyDiagram from '../diagrams/BuoyancyDiagram';
import MolecularMotionDiagram from '../diagrams/MolecularMotionDiagram';
import ParticleModelDiagram from '../diagrams/ParticleModelDiagram';

export default function ChurningOceanLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is density? — measuring matter with code',
      concept: `In the story of the Churning of the Ocean, the gods and demons churned the cosmic ocean and different substances rose or sank based on how heavy they were for their size. That is **density** — the amount of mass packed into a given volume.

**Density = mass / volume**

A block of iron (density 7.87 g/cm³) sinks in water (1.00 g/cm³), but a block of wood (0.6 g/cm³) floats. It is not about total weight — a huge log floats while a tiny iron nail sinks. What matters is how tightly the atoms are packed.

In the code below, you will calculate density for several materials using Python. The key operation is division: \`density = mass / volume\`. We use a Python **dictionary** to store mass-volume pairs, then compute density for each.

📚 *A dictionary in Python stores key-value pairs: \`{"iron": 7.87}\`. You access values with \`d["iron"]\`.*`,
      analogy: 'Think of density like packing a suitcase. You can stuff a heavy winter coat into a small bag (high density) or loosely fold a silk scarf into the same bag (low density). The bag is the same size — the volume is identical — but the mass inside differs. Density tells you how "packed" something is.',
      storyConnection: 'When the ocean was churned, the mythical nectar (amrita) rose to the surface while poison (halahala) sank — a poetic description of density separation. In real chemistry, lighter substances float and heavier ones sink, just as oil floats on water. The churning rod acted like a centrifuge, separating substances by density.',
      checkQuestion: 'A solid cube has mass 270 g and volume 100 cm³. Will it float in water (density 1.00 g/cm³)?',
      checkAnswer: 'Density = 270/100 = 2.7 g/cm³. Since 2.7 > 1.0, it is denser than water and will SINK. This is actually the density of aluminum. To float, an object must have density LESS than the liquid it is in.',
      codeIntro: 'Calculate density for common materials and determine which float or sink.',
      code: `# Density = mass / volume
# Let's calculate density for materials from the story

materials = {
    "Gold (treasure)":   {"mass": 193.0, "volume": 10.0},
    "Milk (ocean)":      {"mass": 103.0, "volume": 100.0},
    "Water":             {"mass": 100.0, "volume": 100.0},
    "Oil (ghee)":        {"mass": 92.0,  "volume": 100.0},
    "Wood (churning rod)": {"mass": 60.0, "volume": 100.0},
    "Cork":              {"mass": 24.0,  "volume": 100.0},
}

print("=== Density Calculator ===")
print(f"{'Material':<22} {'Density':>10} {'Float/Sink':>12}")
print("-" * 46)

for name, data in materials.items():
    density = data["mass"] / data["volume"]
    status = "FLOATS" if density < 1.0 else "SINKS"
    print(f"{name:<22} {density:>8.2f} g/cm³  {status:>8}")

print()
print("Rule: if density < 1.0 g/cm³, it floats in water")
print("The churning separated light from heavy — density in action!")`,
      challenge: 'Add a new material to the dictionary — try "Ice" with mass 91.7 g and volume 100 cm³. Does ice float or sink? This explains why icebergs float and why frozen lakes have ice on top.',
      successHint: 'You just wrote your first density calculator. The formula density = mass/volume is one of the most fundamental in all of science. Every separation technique in chemistry starts with understanding density.',
    },
    {
      title: 'Emulsions — simulating oil and water mixing',
      concept: `When you shake oil and water together vigorously, they temporarily mix into a cloudy liquid called an **emulsion**. The oil breaks into tiny droplets suspended in the water. But leave it alone and they separate again — oil floats to the top, water sinks to the bottom.

This is exactly what happens when you churn butter. Milk is a natural emulsion — tiny fat droplets suspended in water. Churning breaks the emulsion: the fat droplets collide, stick together, and eventually form a solid mass (butter), while the water (buttermilk) separates out.

In the code below, we simulate this process. We create random "oil droplets" with positions in a 2D space, then simulate them rising upward over time (because oil is less dense than water). The key function is \`np.random.uniform()\` which generates random positions.

📚 *\`np.random.uniform(low, high, size)\` generates random numbers between low and high. It is how we simulate the randomness of real physics.*`,
      analogy: 'Imagine throwing a handful of ping-pong balls into a swimming pool and stirring. Initially they are scattered everywhere underwater. But the moment you stop stirring, every ball rises to the surface because it is less dense than water. Oil droplets in water behave exactly the same way — they always want to rise.',
      storyConnection: 'The churning of the ocean is essentially an emulsion being broken. The vigorous churning mixed everything together, but then substances separated by density: the nectar of immortality (lightest) rose to the top, while the poison (heaviest) sank. Real churning of milk follows the same physics — fat rises, water sinks.',
      checkQuestion: 'Why does milk look white even though both water and fat are mostly transparent?',
      checkAnswer: 'Milk looks white because the tiny fat droplets (1-10 micrometers) scatter ALL wavelengths of light equally — this is Mie scattering, the same reason clouds are white. The droplets are just the right size to scatter visible light. Skim milk (fewer fat droplets) looks slightly blue because there is less Mie scattering and more Rayleigh scattering from casein proteins.',
      codeIntro: 'Simulate oil droplets rising through water after churning stops.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# 50 oil droplets randomly scattered in water
n_drops = 50
x = np.random.uniform(0, 10, n_drops)
y = np.random.uniform(0, 10, n_drops)

# Simulate separation over time
# Oil rises because density_oil < density_water
rise_speed = 0.3  # cm per time step (lighter = faster rise)

fig, axes = plt.subplots(1, 4, figsize=(14, 4))
times = [0, 5, 15, 30]

for ax, t in zip(axes, times):
    y_now = np.clip(y + rise_speed * t, 0, 10)
    ax.scatter(x, y_now, c='gold', s=40, edgecolors='orange', alpha=0.7)
    ax.axhline(y=8, color='gold', linewidth=8, alpha=0.3, label='Oil layer')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.set_title(f't = {t}s', fontsize=11, color='white')
    ax.set_facecolor('#1e3a5f')
    ax.set_xlabel('x (cm)', fontsize=9, color='lightgray')
    if t == 0: ax.set_ylabel('Height (cm)', fontsize=9, color='lightgray')
    ax.tick_params(colors='lightgray', labelsize=8)

plt.suptitle('Oil Droplets Rising in Water After Churning',
             fontsize=13, color='white', y=1.02)
plt.tight_layout()
plt.show()

print("At t=0: droplets scattered randomly (emulsion)")
print("Over time: droplets rise because oil is less dense")
print("Eventually: all oil collects at the top (separation)")`,
      challenge: 'Change rise_speed to 0.1 (more viscous liquid) and to 0.8 (very light oil). How does the separation speed change? In real life, cream separates from milk slowly — it takes hours without a centrifuge.',
      successHint: 'You have simulated the fundamental process behind the churning myth. Emulsions are temporary mixtures that separate when left alone. Understanding this is key to dairy science, cosmetics, paint making, and oil refining.',
    },
    {
      title: 'The pH scale — building a pH calculator',
      concept: `When the cosmic ocean was churned, one of the first things to emerge was a terrible poison (halahala). In chemistry, many dangerous substances are either strong **acids** (like sulfuric acid) or strong **bases** (like lye). The **pH scale** measures how acidic or basic a substance is.

**pH = -log₁₀[H⁺]**

The scale runs from 0 to 14:
- **pH < 7** = acidic (more H⁺ ions). Examples: lemon juice (pH 2), vinegar (pH 3)
- **pH = 7** = neutral. Pure water
- **pH > 7** = basic/alkaline (fewer H⁺ ions). Examples: soap (pH 10), bleach (pH 13)

The scale is **logarithmic** — each step is 10 times more acidic or basic. pH 3 is 10× more acidic than pH 4, and 100× more acidic than pH 5.

In the code, you will calculate pH from hydrogen ion concentration using \`np.log10()\`, and plot a color-coded pH scale. The negative sign in the formula flips the scale so that more H⁺ = lower pH number.

📚 *\`np.log10(x)\` computes the base-10 logarithm. If x = 0.001 = 10⁻³, then log₁₀(x) = -3, and pH = -(-3) = 3.*`,
      analogy: 'Think of pH like a volume knob for acidity. Turning it from 7 toward 0 increases the "volume" of acid (more H⁺ ions flooding in). Turning it from 7 toward 14 increases the "volume" of base. But this knob is logarithmic — each click is 10× louder, not just a little louder. pH 2 is not "a bit more acidic" than pH 4 — it is 100 TIMES more acidic.',
      storyConnection: 'The halahala poison that emerged from the churning was so dangerous that Lord Shiva had to drink it to save the universe. In chemistry, extremely acidic (pH ~0) or extremely basic (pH ~14) substances are equally destructive — they dissolve organic matter on contact. The mythical poison is like a substance at the extreme end of the pH scale.',
      checkQuestion: 'If you dilute an acid with water (add more water), what happens to the pH?',
      checkAnswer: 'The pH increases (moves toward 7). Adding water reduces the concentration of H⁺ ions — there are the same number of H⁺ ions in a larger volume. Since pH = -log₁₀[H⁺], lower concentration means higher pH. This is why dilution is a safety response for acid spills. But be careful: diluting a strong acid releases heat (exothermic), so you always add acid to water, never water to acid.',
      codeIntro: 'Calculate pH from hydrogen ion concentrations and build a pH scale.',
      code: `import numpy as np

# pH = -log10([H+])
# [H+] is hydrogen ion concentration in moles per liter

substances = [
    ("Battery acid",  1e-0),    # [H+] = 1.0 M
    ("Stomach acid",  1e-1),    # [H+] = 0.1 M
    ("Lemon juice",   1e-2),
    ("Vinegar",       1e-3),
    ("Coffee",        1e-5),
    ("Pure water",    1e-7),
    ("Blood",         4e-8),
    ("Baking soda",   10**(-8.5)),
    ("Soap",          1e-10),
    ("Bleach",        1e-13),
]

print("=== pH Calculator ===")
print(f"{'Substance':<16} {'[H+] (M)':>12} {'pH':>6} {'Type':>8}")
print("-" * 46)

for name, h_conc in substances:
    ph = -np.log10(h_conc)
    if ph < 6.5:
        kind = "ACID"
    elif ph > 7.5:
        kind = "BASE"
    else:
        kind = "NEUTRAL"
    print(f"{name:<16} {h_conc:>12.1e} {ph:>6.1f} {kind:>8}")

print()
print("Key insight: each pH step = 10x difference!")
print(f"  Lemon (pH 2) vs coffee (pH 5) = {10**3}x more acidic")
print(f"  Stomach acid (pH 1) vs water (pH 7) = {10**6}x more acidic")`,
      challenge: 'Calculate the pH of a solution with [H+] = 3.5e-4 M. Is it acidic or basic? Then try: if you mix equal volumes of pH 3 and pH 5 solutions, is the result pH 4? (Hint: you cannot simply average pH values because the scale is logarithmic.)',
      successHint: 'You built a pH calculator from the fundamental formula. The logarithmic nature of pH means small changes in the number represent huge changes in chemistry — a concept that applies to earthquakes (Richter scale), sound (decibels), and star brightness (magnitudes).',
    },
    {
      title: 'Simple separation — a filtering simulation',
      concept: `The simplest way to separate a mixture is **filtration** — pouring it through a barrier that lets some things through and blocks others. A coffee filter lets water through but blocks grounds. A pasta strainer lets water through but blocks noodles.

In chemistry, we filter mixtures to separate **solids from liquids**. The filter has tiny holes (pores). Particles smaller than the pores pass through; larger particles are trapped. The liquid that passes through is called the **filtrate**; the solid left behind is the **residue**.

Different filter sizes separate different things:
- **Coffee filter** (~20 micrometers): stops grounds, passes dissolved flavors
- **Lab filter paper** (~2 micrometers): stops fine precipitates
- **Membrane filter** (~0.2 micrometers): stops bacteria
- **Reverse osmosis** (~0.001 micrometers): stops dissolved salts

In the code, we simulate particles of different sizes hitting a filter. We use a simple rule: if \`particle_size > pore_size\`, it is blocked.`,
      analogy: 'Imagine a playground fence with gaps between the slats. A basketball cannot fit through — it is blocked (residue). A tennis ball squeezes through some gaps. A marble rolls through easily (filtrate). The same fence separates balls by size, just as a filter separates particles by size. Change the gap width and you change what passes through.',
      storyConnection: 'In the churning story, different treasures emerged at different stages — some early, some late. This is like running a mixture through filters of decreasing pore size: the largest particles are caught first, then medium ones, then tiny ones. Each "filter" reveals a new treasure hidden in the mixture.',
      checkQuestion: 'Can you separate dissolved salt from water using a coffee filter? Why or why not?',
      checkAnswer: 'No. Dissolved salt exists as individual Na⁺ and Cl⁻ ions (~0.2 nanometers), which are FAR smaller than coffee filter pores (~20 micrometers = 20,000 nanometers). The ions pass right through. To separate dissolved salt, you need evaporation (boil off the water) or reverse osmosis (membrane with ~1 nm pores). Filtration only works for undissolved solids.',
      codeIntro: 'Simulate particles of different sizes passing through filters.',
      code: `import numpy as np

np.random.seed(42)

# Generate 200 random particles with different sizes
n = 200
sizes = np.random.exponential(scale=5.0, size=n)  # micrometers

# Different filter pore sizes
filters = [
    ("Coarse sieve (100 um)", 100),
    ("Coffee filter (20 um)", 20),
    ("Lab filter (2 um)", 2),
    ("Membrane (0.2 um)", 0.2),
]

print("=== Filtration Simulation ===")
print(f"Total particles: {n}")
print(f"Size range: {sizes.min():.2f} to {sizes.max():.2f} um")
print()

remaining = sizes.copy()
for name, pore_size in filters:
    blocked = remaining[remaining > pore_size]
    passed = remaining[remaining <= pore_size]
    pct = len(blocked) / n * 100
    print(f"{name}")
    print(f"  Blocked: {len(blocked):>4} particles ({pct:.1f}%)")
    print(f"  Passed:  {len(passed):>4} particles")
    remaining = passed
    print()

print(f"After all filters: {len(remaining)} particles remain")
print("Each filter catches a different size range!")`,
      challenge: 'Modify the code to use a normal distribution instead of exponential: `sizes = np.random.normal(loc=10, scale=5, size=n)`. How does the distribution change what each filter catches? Try `np.abs(sizes)` to avoid negative sizes.',
      successHint: 'Filtration is the workhorse of separation science. Water treatment plants use multiple filter stages, each catching smaller particles. Your simulation shows the same principle — cascading filters of decreasing pore size.',
    },
    {
      title: 'Buoyancy — Archimedes\' principle in code',
      concept: `When an object is placed in a fluid, it experiences an upward force called **buoyancy**. This force equals the weight of the fluid the object displaces. This is **Archimedes' principle**:

**Buoyant force = density_fluid × volume_submerged × g**

If the buoyant force exceeds the object's weight, it floats. If not, it sinks. This is why:
- A steel ship floats (its hull encloses a huge volume of air, displacing lots of water)
- A steel ball sinks (solid steel displaces only its own small volume)
- You float more easily in the Dead Sea (higher salt concentration = higher water density = more buoyancy)

The code calculates buoyancy for objects of different densities in water and determines what fraction of each object sits below the surface. For floating objects, the fraction submerged equals \`density_object / density_fluid\`.

📚 *\`g = 9.81 m/s²\` is gravitational acceleration. Weight = mass × g. Buoyant force = ρ_fluid × V × g.*`,
      analogy: 'Imagine pushing a beach ball underwater in a pool. You feel the water pushing it back up — that is buoyancy. The deeper you push it (more water displaced), the harder the water pushes back. When you let go, the ball rockets upward because the buoyant force exceeds the ball\'s weight. A lead weight, on the other hand, displaces the same volume of water but weighs much more — the buoyant force is not enough, so it sinks.',
      storyConnection: 'In the churning myth, Mount Mandara was used as the churning rod, but it was so heavy it started sinking into the ocean floor. Vishnu took the form of a turtle (Kurma) to support it from below. In physics terms, the mountain\'s density exceeded that of the ocean — it needed additional buoyant support. The turtle provided the upward force that Archimedes\' principle could not.',
      checkQuestion: 'An ice cube floats with about 90% of its volume underwater. What does this tell you about the density of ice compared to water?',
      checkAnswer: 'The fraction submerged = density_ice / density_water. If 90% is submerged, then density_ice / density_water = 0.9, meaning ice has density 0.9 g/cm³ (water is 1.0 g/cm³). Ice is less dense than water because water molecules form a crystalline structure when freezing that takes up MORE space than liquid water. This is unusual — most solids are denser than their liquid form.',
      codeIntro: 'Calculate buoyancy forces and floating depth for various objects.',
      code: `import numpy as np

g = 9.81  # gravity (m/s^2)
rho_water = 1000  # water density (kg/m^3)

# Objects: name, density (kg/m^3), volume (m^3)
objects = [
    ("Cork",       240, 0.001),
    ("Ice",        917, 0.001),
    ("Wood (oak)", 750, 0.001),
    ("Whole egg",  1030, 0.00005),
    ("Iron",       7874, 0.0001),
    ("Gold",       19320, 0.00005),
]

print("=== Archimedes' Buoyancy Calculator ===")
print(f"{'Object':<14} {'Weight':>8} {'Buoyancy':>10} {'Result':>10} {'% Under':>8}")
print("-" * 54)

for name, rho_obj, vol in objects:
    weight = rho_obj * vol * g
    buoyancy_max = rho_water * vol * g  # if fully submerged

    if rho_obj < rho_water:
        # Floats! Calculate fraction submerged
        frac = rho_obj / rho_water
        result = "FLOATS"
        pct = f"{frac*100:.1f}%"
    else:
        frac = 1.0
        result = "SINKS"
        pct = "100%+"

    print(f"{name:<14} {weight:>7.2f}N {buoyancy_max:>9.2f}N {result:>10} {pct:>8}")

print()
print("Rule: if object density < fluid density → it floats")
print("Fraction submerged = density_object / density_fluid")`,
      challenge: 'The Dead Sea has density ~1240 kg/m³. Change rho_water to 1240 and re-run. Which objects that sank in freshwater now float in the Dead Sea? This is why people float effortlessly in the Dead Sea.',
      successHint: 'Archimedes\' principle connects density to real-world behavior. Ships, submarines, hot air balloons, and even fish bladders all use this principle. The churning myth is a story about buoyancy — different substances finding their level based on density.',
    },
    {
      title: 'Density column — plotting layers with matplotlib',
      concept: `Now let's bring everything together. A **density column** is a beautiful demonstration where you carefully pour liquids of different densities into a container. They naturally layer themselves — densest at the bottom, lightest at the top — just like the substances that emerged from the churned ocean.

In the code, you will create a density column visualization using matplotlib. For each liquid, you draw a colored horizontal band at the correct height. The key insight: **liquids self-sort by density**. You do not need to manually arrange them — gravity does the work.

We use \`plt.barh()\` (horizontal bar chart) to draw each layer, and \`plt.annotate()\` to label them. The colors are chosen to match the real liquids.

This is also your first **data visualization project** — combining NumPy data with matplotlib styling to produce a clear, informative chart. Scientists spend much of their time making charts like this.`,
      analogy: 'A density column is like a multi-story parking garage where cars park themselves. Heavy trucks go to the ground floor, regular cars to the middle, and motorcycles to the top. No one directs them — the weight limit on each floor naturally sorts them. In a density column, gravity is the weight limit, and each liquid finds its own floor.',
      storyConnection: 'The churned ocean produced treasures in order: the deadly poison first (densest, from the depths), then animals, then trees, then gems, then the moon, then the nectar of immortality (lightest, floating on top). This mythical sequence is a density column — each substance rising to its natural level based on how heavy it is.',
      checkQuestion: 'If you drop a grape (density ~1.1 g/cm³) into a column with honey (1.42), water (1.00), and oil (0.92), where does it end up?',
      checkAnswer: 'The grape (1.1 g/cm³) is denser than water (1.0) and oil (0.92), but less dense than honey (1.42). So it sinks through the oil and water layers but floats on the honey. It ends up at the water-honey interface. Each object finds the boundary between a liquid denser than itself and one lighter than itself.',
      codeIntro: 'Build and plot a density column showing layered liquids.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Liquids sorted by density (heaviest first)
liquids = [
    ("Honey",            1.42, "#d97706"),
    ("Corn syrup",       1.33, "#92400e"),
    ("Maple syrup",      1.32, "#b45309"),
    ("Whole milk",       1.03, "#fef3c7"),
    ("Water",            1.00, "#60a5fa"),
    ("Vegetable oil",    0.92, "#fbbf24"),
    ("Rubbing alcohol",  0.79, "#c4b5fd"),
    ("Lamp oil",         0.80, "#fca5a5"),
]

# Sort by density (heaviest at bottom)
liquids.sort(key=lambda x: x[1], reverse=True)

fig, ax = plt.subplots(figsize=(8, 6))

for i, (name, density, color) in enumerate(liquids):
    ax.barh(i, density, color=color, height=0.8, edgecolor='white', linewidth=0.5)
    ax.text(density + 0.02, i, f"{name} ({density:.2f} g/cm³)",
            va='center', fontsize=10, color='lightgray')

ax.set_yticks([])
ax.set_xlabel('Density (g/cm³)', fontsize=12, color='lightgray')
ax.set_title('Density Column — Liquids Self-Sort by Weight',
             fontsize=14, color='white')
ax.axvline(x=1.0, color='cyan', linewidth=1, linestyle='--', alpha=0.5, label='Water')
ax.legend(fontsize=9, labelcolor='lightgray')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='lightgray')
ax.set_xlim(0, 2.0)
plt.tight_layout()
plt.show()

print("Heaviest liquids sink to the bottom, lightest float on top.")
print("This is exactly what happens when you churn a mixture —")
print("the components separate into layers by density!")`,
      challenge: 'Add an object to the chart: a cherry tomato (density 0.98 g/cm³). Where does it float in the column? Draw it as a red dot at the correct position using plt.plot().',
      successHint: 'You have built a complete density column visualization. This combines everything from this level: density calculations, floating/sinking rules, and data visualization. Real chemists use density columns to identify unknown liquids — measure the density, find where it sits in the column, and you know what it is.',
    },
  ];

  const diagrams = [ChurningDensityColumnDiagram, ChurningEmulsionDiagram, PHScaleDiagram, ParticleModelDiagram, BuoyancyDiagram, MolecularMotionDiagram];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Chemistry and fluid dynamics through code</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for chemistry and fluid dynamics simulations. Click to start.</p>
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={diagrams[i] ? createElement(diagrams[i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
