import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MugaSilkLevel1() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'What is silk? — protein engineering by caterpillars',
      concept: `Silk is not a fabric — it's a **protein fibre** produced by the glands of caterpillars (silkworms). The caterpillar eats leaves, digests them, and converts the nutrients into two proteins: **fibroin** (the structural core) and **sericin** (the sticky coating that holds strands together).

The fibroin protein is remarkable: it self-assembles into **β-sheet crystals** — flat, stacked layers of amino acids held together by hydrogen bonds. These crystals give silk its tensile strength (stronger than steel by weight) and its smooth, lustrous feel.

Different silkworm species produce different silks:
- **Mulberry silk** (Bombyx mori) — white, cultivated, most common
- **Muga silk** (Antheraea assamensis) — golden, wild, only in Assam
- **Eri silk** — white/cream, "peace silk" (moth emerges alive)
- **Tasar silk** — brown/copper, wild`,
      analogy: 'A silkworm is a tiny 3D printer that uses protein instead of plastic. It takes raw material in (leaves), processes it internally, and extrudes a continuous strand of precisely structured protein through a nozzle (spinneret). The "print quality" is so high that humans still can\'t fully replicate it artificially.',
      storyConnection: 'Muga the silkworm set off on a journey to find colour that would never fade. In reality, the Antheraea assamensis moth feeds on som and sualu tree leaves — and something in those specific leaves gives muga silk its golden colour. The "journey" is biological: leaf → gut → protein → golden thread.',
      checkQuestion: 'Spider silk is 5× stronger than steel by weight. Muga silk is slightly weaker but has a property no other silk has. What is it?',
      checkAnswer: 'Its natural golden colour that never fades. All other silks are white or brown — they need to be dyed. Muga silk is golden from the inside because the pigment (xanthurenic acid) is chemically bonded into the fibroin protein itself. Dyes sit on the surface and wash out; muga\'s gold is structural.',
      codeIntro: 'Compare the properties of different fibres using data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Fibre property data (approximate real values)
fibres = ['Muga Silk', 'Mulberry Silk', 'Cotton', 'Nylon', 'Spider Silk', 'Steel Wire']
tensile_strength = [500, 600, 400, 900, 1400, 2000]  # MPa
elasticity = [35, 20, 8, 40, 30, 2]  # % elongation at break
density = [1.3, 1.3, 1.5, 1.1, 1.3, 7.8]  # g/cm³

# Strength-to-weight ratio (specific strength)
specific_strength = [t/d for t, d in zip(tensile_strength, density)]

fig, axes = plt.subplots(1, 3, figsize=(12, 4))
fig.patch.set_facecolor('#1f2937')

colors = ['#f59e0b', '#e5e7eb', '#a3e635', '#3b82f6', '#ef4444', '#6b7280']

for ax, data, title, unit in [
    (axes[0], tensile_strength, 'Tensile Strength', 'MPa'),
    (axes[1], elasticity, 'Elasticity', '% stretch'),
    (axes[2], specific_strength, 'Strength/Weight', 'MPa·cm³/g'),
]:
    bars = ax.barh(fibres, data, color=colors)
    ax.set_title(title, color='white', fontsize=10)
    ax.set_xlabel(unit, color='gray', fontsize=8)
    ax.set_facecolor('#111827')
    ax.tick_params(colors='gray', labelsize=7)

plt.tight_layout()
plt.show()

print("Muga silk's strength/weight is comparable to nylon")
print("But it has something no synthetic can match:")
print("  → Natural golden colour (permanent)")
print("  → UV resistance (doesn't degrade in sunlight)")
print("  → Biodegradable (unlike nylon)")`,
      challenge: 'Spider silk wins on raw strength. But it can\'t be farmed (spiders are territorial and eat each other). What makes muga silk commercially viable despite being weaker?',
      successHint: 'Materials science is about trade-offs. No single material is best at everything. The right choice depends on your application — and sometimes the "best" material is the one that\'s renewable, beautiful, AND strong enough.',
    },
    {
      title: 'Why is muga silk golden? — chemistry of colour',
      concept: `Most silk is white because fibroin protein is colourless. Muga silk is golden because of a molecule called **xanthurenic acid** — a yellow pigment produced during the caterpillar's metabolism of tryptophan (an amino acid found in som tree leaves).

What makes this remarkable: the xanthurenic acid isn't a surface dye. It's **covalently bonded** into the fibroin protein structure. This means:
- You can't wash it out (it's part of the molecule)
- It doesn't fade in sunlight (the bond is UV-stable)
- It gets more lustrous with age and washing (surface sericin wears away, exposing more golden fibroin)

This is the "Sun's gift" from the story — except the real gift came from the som tree, not the sun. The specific diet of the Antheraea assamensis caterpillar produces a pigment that no other silkworm creates.`,
      analogy: 'Imagine writing with a pen on paper (surface dye) vs. mixing ink into the paper pulp before it\'s made (structural colour). The pen writing fades and washes off. The ink-in-pulp paper is coloured all the way through — you can\'t remove it because it IS the paper. Muga silk\'s gold is ink-in-pulp.',
      storyConnection: 'The Sun told Muga: "I will dip your thread in my light." In reality, the "light" comes from the caterpillar\'s diet. The som tree provides tryptophan → the caterpillar\'s body converts it to xanthurenic acid → the acid bonds into the silk protein. No dyeing, no processing — the colour is born inside the thread.',
      checkQuestion: 'If you raised an Antheraea assamensis caterpillar on mulberry leaves instead of som leaves, what colour would its silk be?',
      checkAnswer: 'Likely white or very pale — without the specific chemistry triggered by som leaf compounds, the caterpillar wouldn\'t produce enough xanthurenic acid. Experiments have shown that diet affects silk colour. The golden colour is a biological outcome of a specific plant-insect relationship.',
      codeIntro: 'Visualize UV degradation — why muga silk outlasts other materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulated UV degradation over time (hours of UV exposure)
hours = np.arange(0, 500, 10)

# Color retention (% of original color remaining)
muga = 100 - 2 * np.log1p(hours)  # barely degrades
mulberry = 100 * np.exp(-hours / 200)  # moderate fading
cotton_dyed = 100 * np.exp(-hours / 80)  # fades quickly
nylon = 100 * np.exp(-hours / 150)  # moderate

fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

ax.plot(hours, muga.clip(80, 100), color='#f59e0b', linewidth=2.5, label='Muga silk (structural gold)')
ax.plot(hours, mulberry, color='#e5e7eb', linewidth=2, label='Mulberry silk (dyed)', linestyle='--')
ax.plot(hours, cotton_dyed, color='#a3e635', linewidth=2, label='Dyed cotton', linestyle='--')
ax.plot(hours, nylon, color='#3b82f6', linewidth=2, label='Dyed nylon', linestyle='--')

ax.set_xlabel('UV Exposure (hours)', color='white')
ax.set_ylabel('Color Retention (%)', color='white')
ax.set_title('UV Degradation: Why Muga Silk Never Fades', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(0, 105)

plt.tight_layout()
plt.show()

print("After 500 hours of UV exposure:")
print(f"  Muga silk: ~{muga[-1]:.0f}% color retained (structural pigment)")
print(f"  Mulberry silk (dyed): ~{mulberry[-1]:.0f}% retained")
print(f"  Dyed cotton: ~{cotton_dyed[-1]:.0f}% retained")
print(f"  Dyed nylon: ~{nylon[-1]:.0f}% retained")`,
      challenge: 'The Sun\'s promise never expires. Can you think of other natural structural colors? (Hint: peacock feathers, butterfly wings, opals — all use structure, not dye, for their colour.)',
      successHint: 'Structural colour is one of nature\'s greatest innovations. Researchers are now studying muga silk\'s UV-resistant proteins for medical sutures, wound dressings, and biodegradable electronics.',
    },
    {
      title: 'Tensile testing — measuring strength scientifically',
      concept: `Saying "silk is strong" isn't science. Measuring **exactly how strong** and comparing it to other materials — that's materials science.

A **tensile test** measures how much force a material can withstand before it breaks. You clamp a fibre, pull it with increasing force, and record:
- **Stress**: force per unit area (measured in MPa or N/mm²)
- **Strain**: how much it stretches as a percentage of original length
- **Breaking point**: the stress at which it snaps

The relationship between stress and strain produces a **stress-strain curve** — the fingerprint of a material. From this curve, you can read:
- **Stiffness**: how steep the initial slope is (steeper = stiffer)
- **Strength**: where it breaks
- **Toughness**: the total area under the curve (energy absorbed before breaking)`,
      analogy: 'A tensile test is like a tug-of-war with a measuring tape. You pull harder and harder while measuring how much the rope stretches. A stiff rope barely stretches before snapping. An elastic rope stretches a lot. A tough rope stretches AND requires enormous force. The stress-strain curve records the entire contest.',
      storyConnection: 'Malini wove the golden thread into a mekhela chador so beautiful that people came from every village to see it. But beauty isn\'t enough — the fabric needs to survive years of washing, wearing, and sun. Tensile testing is how we verify that beauty comes with durability.',
      checkQuestion: 'Material A breaks at 800 MPa with 5% stretch. Material B breaks at 400 MPa with 40% stretch. Which is stronger? Which is tougher?',
      checkAnswer: 'A is stronger (higher breaking stress). But B is likely tougher — it absorbs more energy before breaking (larger area under the stress-strain curve). A sword blade needs to be strong; a climbing rope needs to be tough. Different applications, different priorities.',
      codeIntro: 'Plot stress-strain curves for different fibres and compare them.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulated stress-strain curves
strain = np.linspace(0, 50, 200)  # % elongation

def stress_strain(max_stress, max_strain, stiffness):
    """Generate a realistic stress-strain curve."""
    s = np.zeros_like(strain)
    for i, e in enumerate(strain):
        if e <= max_strain:
            # Elastic region then plastic flow
            s[i] = max_stress * (1 - np.exp(-stiffness * e / max_strain))
        else:
            s[i] = np.nan  # broken
    return s

curves = {
    'Muga Silk': stress_strain(500, 35, 3),
    'Spider Silk': stress_strain(1400, 30, 4),
    'Cotton': stress_strain(400, 8, 5),
    'Nylon': stress_strain(900, 40, 2.5),
    'Steel Wire': stress_strain(2000, 2, 20),
}
colors = {'Muga Silk': '#f59e0b', 'Spider Silk': '#ef4444', 'Cotton': '#a3e635', 'Nylon': '#3b82f6', 'Steel Wire': '#6b7280'}

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

for name, stress in curves.items():
    ax.plot(strain, stress, color=colors[name], linewidth=2, label=name)

ax.set_xlabel('Strain (% elongation)', color='white')
ax.set_ylabel('Stress (MPa)', color='white')
ax.set_title('Stress-Strain Curves: Comparing Fibres', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Steel: extremely strong but brittle (breaks with barely any stretch)")
print("Spider silk: strong AND stretchy (nature's best all-rounder)")
print("Muga silk: good balance of strength and elasticity")
print("Cotton: moderate strength, low stretch")
print("Nylon: good stretch, moderate strength (synthetic alternative)")`,
      challenge: 'Calculate the "toughness" (approximate area under each curve). Which fibre absorbs the most energy before breaking? That\'s the one you\'d want for a parachute.',
      successHint: 'You can now read a stress-strain curve — the most important chart in materials science. Every material you touch has one. The shape tells you if it\'s brittle, elastic, tough, or stiff.',
    },
    {
      title: 'The scientific method — designing an experiment',
      concept: `All the data above came from experiments someone designed. In Level 2, you'll run your own experiments on real fibre samples. But first, you need to understand **how to design a fair experiment**.

The scientific method for materials testing:
1. **Hypothesis**: "Muga silk is more UV-resistant than dyed cotton because its colour is structural"
2. **Variables**: what you change (UV exposure time), what you measure (colour retention), what you keep constant (sample size, light intensity, temperature)
3. **Control**: an unexposed sample of each material for comparison
4. **Procedure**: step-by-step instructions anyone could follow to reproduce your results
5. **Data collection**: tables of measurements, not just "it looked faded"
6. **Analysis**: charts, calculations, statistical significance
7. **Conclusion**: does the data support or refute the hypothesis?

The hardest part isn't the experiment — it's controlling variables. If your muga sample is thicker than your cotton sample, is the difference due to the material or the thickness?`,
      analogy: 'A good experiment is like a fair race. Everyone starts at the same line (control), runs the same distance (same conditions), and you only change one thing at a time (the variable). If you let one runner wear shoes and another go barefoot, you\'re testing shoes, not speed.',
      storyConnection: 'When Muga the silkworm asked the Sun for colour, the Sun set a condition: "Spin me a scarf." That\'s a hypothesis test — if Muga can spin fine enough thread, the Sun will provide the colour. The condition was met, the experiment succeeded, and the result was permanent golden silk.',
      checkQuestion: 'You want to test if muga silk resists UV better than cotton. You expose muga silk to sunlight for 48 hours and cotton for 24 hours. Is this a fair test?',
      checkAnswer: 'No! The exposure time is different — that\'s an uncontrolled variable. Muga might look better just because cotton got twice the UV. Both samples must be exposed for the same duration, in the same location, at the same angle to the sun. Control your variables.',
      codeIntro: 'Design a data collection template for a UV degradation experiment.',
      code: `import numpy as np

# === EXPERIMENT DESIGN ===
print("=" * 50)
print("  UV DEGRADATION EXPERIMENT DESIGN")
print("=" * 50)
print()
print("Hypothesis:")
print("  Muga silk retains colour better than dyed cotton")
print("  under prolonged UV exposure because its pigment")
print("  is structural (covalently bonded), not surface dye.")
print()
print("Materials:")
print("  - Muga silk sample (5cm × 5cm)")
print("  - Dyed cotton sample (5cm × 5cm, same colour)")
print("  - UV lamp (365nm) or direct sunlight")
print("  - Colorimeter or smartphone camera + software")
print()
print("Controlled variables:")
print("  - Sample size: identical")
print("  - UV source: same lamp, same distance")
print("  - Temperature: room temp (record it)")
print("  - Initial colour: measured before exposure")
print()

# Data collection table
print("DATA TABLE:")
print(f"{'Hours':>6} {'Muga Color':>12} {'Cotton Color':>13} {'Muga %':>8} {'Cotton %':>9}")
print("-" * 52)

# Simulated readings
np.random.seed(42)
muga_initial = 100
cotton_initial = 100

for hours in [0, 4, 8, 16, 24, 48]:
    muga_val = muga_initial * (0.99 ** hours) + np.random.normal(0, 0.5)
    cotton_val = cotton_initial * (0.97 ** hours) + np.random.normal(0, 1)
    print(f"{hours:>6} {muga_val:>12.1f} {cotton_val:>13.1f} {muga_val:>7.1f}% {cotton_val:>8.1f}%")

print()
print("Analysis: Compare decay rates. Calculate half-life")
print("of colour for each material (time to reach 50%).")`,
      challenge: 'What if the cotton sample started darker than the muga sample? Would that affect your conclusion? How would you control for initial colour differences?',
      successHint: 'You just designed a real experiment — hypothesis, controlled variables, data table, and analysis plan. This is the format used in every scientific paper. In Level 2, you\'ll execute this experiment with real materials.',
    },
    {
      title: 'Data analysis — what the numbers mean',
      concept: `Raw data is meaningless without analysis. You need to answer: **is the difference between muga and cotton statistically significant, or could it be random variation?**

Key analysis tools:
- **Mean and standard deviation**: average performance and how consistent it is
- **Percentage change**: how much each material degraded relative to its starting state
- **Half-life**: how long until the material loses 50% of its property (colour, strength, etc.)
- **Bar charts and line graphs**: visual comparison
- **Error bars**: showing measurement uncertainty

A material scientist doesn't just say "muga is better." They say "muga retained 95.2% ± 1.3% of its colour after 48 hours of UV exposure, compared to 71.8% ± 3.7% for dyed cotton (p < 0.01)." The numbers, the uncertainty, and the statistical test make the claim credible.`,
      analogy: 'Data analysis is like reviewing game tape after a match. The score tells you who won, but the analysis tells you why — which plays worked, where the mistakes were, and what to change next time. Raw data is the score. Analysis is the coaching session.',
      storyConnection: 'Malini didn\'t just say "the silk is beautiful." People came from every village to see it — and eventually, scientists measured exactly why muga silk is unique. The numbers validated what Malini\'s eyes already told her. Good science confirms intuition with evidence.',
      checkQuestion: 'Muga: 95% ± 2% colour retention. Cotton: 72% ± 15%. The cotton has much higher uncertainty. What does that mean?',
      checkAnswer: 'Cotton\'s results were inconsistent — some samples faded a lot, others less. The ±15% means the true value could be anywhere from 57% to 87%. Muga\'s tight ±2% means its behaviour is very predictable. For a consumer product, predictability is almost as important as performance.',
      codeIntro: 'Analyze experimental data and produce a materials science report.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Simulated experiment: 5 samples of each, measured at 0, 24, 48 hours
hours = [0, 24, 48]
n_samples = 5

# Muga: barely degrades
muga_data = np.array([[100 + np.random.normal(0, 1) for _ in range(n_samples)],
                       [97 + np.random.normal(0, 1.5, n_samples)],
                       [95 + np.random.normal(0, 1.5, n_samples)]])

# Cotton: degrades significantly with more variance
cotton_data = np.array([[100 + np.random.normal(0, 2) for _ in range(n_samples)],
                         [85 + np.random.normal(0, 5, n_samples)],
                         [72 + np.random.normal(0, 8, n_samples)]])

muga_means = muga_data.mean(axis=1)
muga_stds = muga_data.std(axis=1)
cotton_means = cotton_data.mean(axis=1)
cotton_stds = cotton_data.std(axis=1)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Line plot with error bars
ax1.set_facecolor('#111827')
ax1.errorbar(hours, muga_means, yerr=muga_stds, color='#f59e0b', linewidth=2, marker='o', capsize=5, label='Muga silk')
ax1.errorbar(hours, cotton_means, yerr=cotton_stds, color='#a3e635', linewidth=2, marker='s', capsize=5, label='Dyed cotton')
ax1.set_xlabel('UV Exposure (hours)', color='white')
ax1.set_ylabel('Colour Retention (%)', color='white')
ax1.set_title('UV Degradation Over Time', color='white', fontsize=11)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(50, 110)

# Bar chart: 48-hour comparison
ax2.set_facecolor('#111827')
x = np.arange(2)
bars = ax2.bar(x, [muga_means[2], cotton_means[2]], yerr=[muga_stds[2], cotton_stds[2]],
               color=['#f59e0b', '#a3e635'], capsize=8, width=0.5)
ax2.set_xticks(x)
ax2.set_xticklabels(['Muga Silk', 'Dyed Cotton'])
ax2.set_ylabel('Colour Retention at 48h (%)', color='white')
ax2.set_title('48-Hour Comparison', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_ylim(50, 110)

plt.tight_layout()
plt.show()

print("=== RESULTS ===")
print(f"Muga silk at 48h: {muga_means[2]:.1f}% ± {muga_stds[2]:.1f}%")
print(f"Cotton at 48h:    {cotton_means[2]:.1f}% ± {cotton_stds[2]:.1f}%")
print(f"Difference: {muga_means[2] - cotton_means[2]:.1f} percentage points")
print()
print("Conclusion: Muga silk retained significantly more")
print("colour than dyed cotton after 48 hours of UV exposure,")
print("consistent with structural vs. surface pigmentation.")`,
      challenge: 'Add nylon to the comparison. Generate simulated data with cotton-like degradation but lower variance (nylon is more consistent than cotton). What does the 3-way comparison reveal?',
      successHint: 'You can now analyze experimental data, calculate statistics, plot with error bars, and draw conclusions. This is the output of every materials science paper — and you built it from scratch.',
    },
    {
      title: 'From silk to biomimicry — what nature teaches us',
      concept: `Muga silk is one example of a broader field called **biomimicry** — designing human technology by imitating nature's solutions. Nature has had billions of years of R&D. The results are often better than anything we've engineered:

- **Spider silk** → synthetic super-fibres for bulletproof vests and surgical sutures
- **Gecko feet** → reusable adhesives that work in a vacuum (for space applications)
- **Lotus leaves** → self-cleaning surfaces for buildings and solar panels
- **Shark skin** → drag-reducing surfaces for ships and swimsuits
- **Muga silk** → UV-resistant biodegradable materials for medicine and electronics

Materials science isn't just about measuring what exists — it's about learning from nature to create what doesn't exist yet. Every biological material is a design solution to an engineering problem.

In Level 2, you'll conduct hands-on experiments with real fibres, use a microscope to see fibre structure, and write a full materials science report.`,
      storyConnection: 'The Sun\'s gift to Muga wasn\'t just golden thread — it was a lesson in materials engineering. A colour that never fades because it\'s woven into the molecular structure. Nature solved UV resistance millions of years before humans invented sunscreen. The question is: what else has nature solved that we haven\'t noticed yet?',
      checkQuestion: 'Why is biomimicry increasingly important in a world worried about sustainability?',
      checkAnswer: 'Natural materials are biodegradable, produced at room temperature, self-healing, and use abundant raw materials (water, sunlight, CO₂, proteins). Synthetic materials often require high heat, toxic chemicals, and produce waste. Biomimicry aims for the performance of synthetics with the sustainability of nature.',
      codeIntro: 'Summarize everything you\'ve learned.',
      code: `print("=" * 50)
print("  YOUR MATERIALS SCIENCE JOURNEY")
print("=" * 50)
print()
print("Level 1 — What you learned:")
print("  ✓ Silk biology: protein structure, β-sheet crystals")
print("  ✓ Why muga silk is golden: xanthurenic acid in fibroin")
print("  ✓ Tensile testing: stress-strain curves")
print("  ✓ Experimental design: hypothesis, controls, variables")
print("  ✓ Data analysis: means, std dev, error bars")
print("  ✓ Biomimicry: nature as engineering teacher")
print()
print("Level 2 — What you'll do:")
print("  → Examine real fibres under a microscope")
print("  → Run tensile strength experiments")
print("  → Test water absorption and UV degradation")
print("  → Write a formal materials science report")
print()
print("From a folktale about a silkworm and the Sun")
print("to real science that could change medicine and")
print("manufacturing. That's the TigmaMinds way:")
print("story first, science always.")`,
      challenge: 'Before Level 2: what experiment would YOU design to test a property of muga silk? Pick a hypothesis, identify your variables, and sketch a data table.',
      successHint: 'From "what is silk?" to biomimicry and experimental design — all through the story of Muga and the Sun. You understand protein science, materials testing, and the scientific method.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior science experience needed</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python for data analysis and visualization. Click below to start.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python Environment</>)}
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
