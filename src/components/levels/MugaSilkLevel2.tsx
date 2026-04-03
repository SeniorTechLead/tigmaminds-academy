import { useState, useRef, useCallback } from 'react';
import { Loader2, Zap } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function MugaSilkLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r,j)=>{s.onload=()=>r();s.onerror=()=>j(new Error('Failed'))}); }
      setLoadProgress('Starting Python...');
      const py = await (window as any).loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'});
      setLoadProgress('Installing packages...');
      await py.loadPackage('micropip'); const mp=py.pyimport('micropip');
      for(const p of['numpy','matplotlib']){try{await mp.install(p)}catch{await py.loadPackage(p).catch(()=>{})}}
      await py.runPythonAsync(`
import sys,io
class OC:
 def __init__(self):self.o=[]
 def write(self,t):self.o.append(t)
 def flush(self):pass
 def get_output(self):return''.join(self.o)
 def clear(self):self.o=[]
_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture
import matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64
def _get_plot_as_base64():
 buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s
`);
      pyodideRef.current=py;setPyReady(true);setLoading(false);setLoadProgress('');return py;
    }catch(e:any){setLoading(false);setLoadProgress('Error: '+e.message);return null;}
  },[]);

  const miniLessons = [
    {
      title: 'Microscopy — seeing fibre structure',
      concept: `In Level 1 you learned that silk is a protein fibre with β-sheet crystal structure. But you saw it as diagrams and data. In Level 2, you examine it **directly** — through a microscope.

Under 40x magnification, you can see the difference between fibres:
- **Silk**: smooth, triangular cross-section that refracts light (causing lustre)
- **Cotton**: twisted, ribbon-like fibres with a hollow center (lumen)
- **Nylon**: perfectly smooth, circular cross-section (manufactured precision)
- **Wool**: overlapping scales (like roof tiles) that trap air for insulation

The cross-section shape determines how light interacts with the fibre — which is why silk shimmers and cotton doesn't. Muga silk's triangular cross-section acts like a prism, splitting light and creating its characteristic golden glow.`,
      analogy: 'Looking at fibres under a microscope is like looking at wood grain. From far away, oak and pine look similar. Zoom in and the cell structure is completely different — that\'s why one is strong and the other is soft. Same principle, smaller scale.',
      storyConnection: 'When Malini held the golden thread to the light, she saw it glow "like a tiny sunrise." Under a microscope, you\'d see why: the triangular fibroin strands split light into warm gold wavelengths. The Sun\'s gift is visible at the molecular level.',
      codeIntro: 'Simulate microscope observations by plotting fibre cross-sections.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 4, figsize=(12, 3))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Fibre Cross-Sections (40x)', color='white', fontsize=13)

# Silk: triangular
t = np.linspace(0, 2*np.pi, 4)
axes[0].fill(np.cos(t + np.pi/6) * 0.8, np.sin(t + np.pi/6) * 0.8, color='#f59e0b', alpha=0.7)
axes[0].set_title('Muga Silk\\n(triangular)', color='white', fontsize=9)

# Cotton: twisted ribbon with hollow center
t = np.linspace(0, 2*np.pi, 50)
axes[1].fill(np.cos(t)*0.9, np.sin(t)*0.5, color='#a3e635', alpha=0.5)
axes[1].fill(np.cos(t)*0.4, np.sin(t)*0.2, color='#1f2937', alpha=1)
axes[1].set_title('Cotton\\n(flat, hollow)', color='white', fontsize=9)

# Nylon: perfect circle
axes[2].fill(np.cos(t)*0.7, np.sin(t)*0.7, color='#3b82f6', alpha=0.7)
axes[2].set_title('Nylon\\n(circular)', color='white', fontsize=9)

# Wool: scaly surface
r = 0.7 + 0.1 * np.sin(12 * t)
axes[3].fill(r * np.cos(t), r * np.sin(t), color='#f87171', alpha=0.5)
axes[3].set_title('Wool\\n(scaly)', color='white', fontsize=9)

for ax in axes:
    ax.set_facecolor('#111827')
    ax.set_xlim(-1.2, 1.2); ax.set_ylim(-1.2, 1.2)
    ax.set_aspect('equal')
    ax.tick_params(colors='gray', labelsize=6)

plt.tight_layout()
plt.show()

print("Silk's triangular shape refracts light → lustre/shimmer")
print("Cotton's hollow center absorbs water → good for towels")
print("Nylon's perfect circle = consistent manufactured quality")
print("Wool's scales trap air → insulation (warmth)")`,
      challenge: 'The cross-section shape explains almost everything: lustre, water absorption, strength, flexibility. Can you think of a fibre property that cross-section alone doesn\'t explain?',
      successHint: 'You now understand why different fibres feel and behave differently — it\'s all in the microstructure. This is what you\'d see under a real microscope.',
    },
    {
      title: 'Tensile testing rig — measuring breaking force',
      concept: `In Level 1 you plotted stress-strain curves from given data. In Level 2, you **generate** the data yourself using a simple test rig: a clamp, a ruler, and small weights.

**Procedure**: clamp one end of a fibre sample (known length, known cross-section area). Hang weights from the other end, increasing gradually. Measure how much the fibre stretches at each weight. Record when it breaks.

**Calculations**:
- Stress = Force / Area (in MPa or N/mm²)
- Strain = ΔLength / OriginalLength (as %)
- Breaking strength = stress at the breaking point
- Stiffness = slope of the initial linear region`,
      storyConnection: 'The mekhela chador Malini wove needed to survive decades of wearing, washing, and monsoon humidity. Tensile testing is how we verify that golden beauty comes with golden durability.',
      codeIntro: 'Process raw experimental data into a stress-strain curve.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulated raw experimental data
# Weight (grams) and extension (mm) for a 50mm silk sample, 0.05mm diameter
weights_g = np.array([0, 10, 20, 30, 50, 80, 120, 160, 200, 230, 250])
extension_mm = np.array([0, 0.2, 0.5, 0.8, 1.5, 2.8, 5.0, 8.5, 13.0, 17.5, 19.0])
broke_at_index = 10  # broke at 250g

# Convert to engineering units
force_N = weights_g * 9.81 / 1000  # grams to Newtons
area_mm2 = np.pi * (0.05/2)**2  # cross-section area
stress_MPa = force_N / area_mm2
strain_pct = extension_mm / 50 * 100  # % of original length

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Raw data
ax1.set_facecolor('#111827')
ax1.plot(weights_g, extension_mm, 'o-', color='#f59e0b', linewidth=2, markersize=5)
ax1.plot(weights_g[broke_at_index], extension_mm[broke_at_index], 'x', color='#ef4444', markersize=15, markeredgewidth=3)
ax1.set_xlabel('Weight (grams)', color='white')
ax1.set_ylabel('Extension (mm)', color='white')
ax1.set_title('Raw Experimental Data', color='white', fontsize=11)
ax1.tick_params(colors='gray')

# Stress-strain curve
ax2.set_facecolor('#111827')
ax2.plot(strain_pct, stress_MPa, 'o-', color='#f59e0b', linewidth=2, markersize=5)
ax2.plot(strain_pct[broke_at_index], stress_MPa[broke_at_index], 'x', color='#ef4444', markersize=15, markeredgewidth=3)
ax2.set_xlabel('Strain (%)', color='white')
ax2.set_ylabel('Stress (MPa)', color='white')
ax2.set_title('Stress-Strain Curve', color='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print(f"Breaking force: {weights_g[broke_at_index]}g = {force_N[broke_at_index]:.3f}N")
print(f"Breaking stress: {stress_MPa[broke_at_index]:.0f} MPa")
print(f"Breaking strain: {strain_pct[broke_at_index]:.1f}%")
print(f"Sample diameter: 0.05mm, length: 50mm")`,
      challenge: 'Run this same test on cotton, nylon, and any other fibre you have. Plot all curves on the same chart. Which fibre is strongest? Most elastic?',
      successHint: 'You just processed raw experimental data into a standard stress-strain curve. This is exactly what materials scientists publish in journals.',
    },
    {
      title: 'UV degradation experiment — measuring colour loss',
      concept: `The hypothesis: "Muga silk retains colour better than dyed cotton under UV exposure because its pigment is structural."

To test this, you expose samples to UV light (sunlight or UV lamp) for controlled durations and measure colour change at each interval using a colorimeter or a phone camera with consistent lighting.

The analysis: plot colour retention (%) vs. exposure time (hours) for each material. Calculate the **half-life** — how long until the material loses 50% of its colour. Compare half-lives to quantify the difference.`,
      storyConnection: 'The Sun\'s promise to Muga was that the gold would never fade. This experiment tests that promise with controlled UV exposure and quantitative measurement.',
      codeIntro: 'Analyze UV degradation data and calculate colour half-lives.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Experimental data: colour retention (%) at each time point
hours = np.array([0, 4, 8, 16, 24, 48, 96, 200])

# Muga silk (structural pigment — barely degrades)
muga = np.array([100, 99.2, 98.5, 97.8, 97.1, 95.8, 94.2, 92.0])
muga += np.random.normal(0, 0.5, len(muga))

# Dyed cotton (surface dye — degrades exponentially)
cotton = np.array([100, 92, 85, 72, 62, 45, 28, 15])
cotton += np.random.normal(0, 2, len(cotton))

# Dyed nylon
nylon = np.array([100, 95, 90, 82, 75, 60, 42, 25])
nylon += np.random.normal(0, 1.5, len(nylon))

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

for data, name, color, marker in [
    (muga, 'Muga silk', '#f59e0b', 'o'),
    (cotton, 'Dyed cotton', '#a3e635', 's'),
    (nylon, 'Dyed nylon', '#3b82f6', '^'),
]:
    ax.plot(hours, data, marker + '-', color=color, linewidth=2, markersize=6, label=name)

ax.axhline(50, color='#ef4444', linestyle='--', alpha=0.5, label='50% threshold')
ax.set_xlabel('UV Exposure (hours)', color='white', fontsize=11)
ax.set_ylabel('Colour Retention (%)', color='white', fontsize=11)
ax.set_title('UV Degradation Study', color='white', fontsize=14)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(0, 110)

plt.tight_layout()
plt.show()

# Estimate half-lives (time to reach 50%)
print("=== HALF-LIFE ANALYSIS ===")
print(f"Muga silk:   Never reaches 50% in 200h (estimated >1000h)")
print(f"Dyed cotton: ~48h (crosses 50% between 24-48h)")
print(f"Dyed nylon:  ~90h (crosses 50% between 48-96h)")
print()
print("Conclusion: Muga silk's structural pigment is")
print("20x more UV-resistant than surface dyes.")
print("The Sun's promise holds.")`,
      challenge: 'Calculate the exact half-life for cotton by interpolating between the data points where it crosses 50%. Is it closer to 40h or 55h?',
      successHint: 'You designed an experiment, collected data, plotted results, and calculated a meaningful metric (half-life). This is a publishable result.',
    },
    {
      title: 'Water absorption — another material property',
      concept: `UV resistance is just one property. A complete materials characterization tests multiple properties. **Water absorption** matters for clothing (comfort), medical applications (wound contact), and conservation (mold resistance).

**Procedure**: weigh dry samples. Submerge in distilled water for 30 minutes. Remove, blot surface water, weigh again. Calculate: absorption = (wet - dry) / dry × 100%.

Silk absorbs 10-30% of its weight in water (hydrophilic protein structure). Cotton absorbs 25-65% (hollow fibres act as reservoirs). Nylon absorbs only 3-8% (hydrophobic synthetic). Muga silk falls in the lower silk range — its tight β-sheet structure limits water penetration.`,
      storyConnection: 'In Assam\'s monsoon, everything gets wet. A mekhela chador that absorbs too much water becomes heavy and uncomfortable. Muga silk\'s moderate absorption — enough to wick sweat but not enough to soak through — makes it perfect for the climate.',
      codeIntro: 'Plot water absorption data as a comparative bar chart.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Water absorption data (5 samples each)
materials = ['Muga Silk', 'Mulberry Silk', 'Cotton', 'Nylon', 'Wool']
means = [12.5, 18.3, 42.7, 4.2, 35.8]  # % weight gain
stds = [1.8, 2.5, 5.3, 0.8, 4.2]
colors = ['#f59e0b', '#e5e7eb', '#a3e635', '#3b82f6', '#f87171']

fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

bars = ax.bar(materials, means, yerr=stds, capsize=8, color=colors, width=0.6, edgecolor='none')
ax.set_ylabel('Water Absorption (% weight gain)', color='white', fontsize=11)
ax.set_title('Water Absorption Test (30-minute soak)', color='white', fontsize=13)
ax.tick_params(colors='gray')

# Add value labels
for bar, mean, std in zip(bars, means, stds):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + std + 1,
            f'{mean:.1f}%', ha='center', color='white', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.show()

print("Cotton wins for towels (highest absorption)")
print("Nylon wins for raincoats (lowest absorption)")
print("Muga silk is moderate — breathable but not soaking")
print("Wool absorbs well but also retains heat — insulation")
print()
print("No single material is 'best' — it depends on the application.")`,
      challenge: 'If you were choosing a material for surgical sutures (stitching wounds), which properties matter most? Strength, absorption, biodegradability, or UV resistance?',
      successHint: 'Three experiments down: tensile strength, UV degradation, water absorption. A full materials characterization would add: heat resistance, abrasion, dyeability, and cost.',
    },
    {
      title: 'Writing the lab report — science as communication',
      concept: `Data and charts aren't science until they're **communicated**. A lab report follows a strict structure that's universal across all scientific disciplines:

1. **Title & Abstract**: what you studied and the key finding (2-3 sentences)
2. **Introduction**: background, why this matters, your hypothesis
3. **Methods**: exactly what you did (reproducible by anyone)
4. **Results**: data tables, charts, statistical analysis (no interpretation yet)
5. **Discussion**: what the results mean, do they support the hypothesis?
6. **Conclusion**: one paragraph summary of the key finding
7. **References**: where your background information came from

The most common mistake: mixing results and discussion. Results = "muga retained 92% colour at 200h." Discussion = "this suggests structural pigmentation is significantly more UV-resistant than surface dyes, consistent with covalent bonding of xanthurenic acid."`,
      storyConnection: 'Dipankar kept meticulous records in his library notebook. Rongpharpi\'s knowledge of elephant vibrations was passed down through story. But scientific knowledge needs a more precise format — one that anyone, anywhere can read, reproduce, and build upon. That\'s what a lab report does.',
      codeIntro: 'Generate a structured lab report from your experimental data.',
      code: `print("=" * 55)
print("  MATERIALS SCIENCE LAB REPORT")
print("=" * 55)
print()
print("Title: Comparative UV Resistance of Natural")
print("       and Synthetic Fibres")
print()
print("Abstract:")
print("  Muga silk, dyed cotton, and dyed nylon were")
print("  exposed to UV light for 200 hours. Muga silk")
print("  retained 92% of its colour vs. 15% for cotton")
print("  and 25% for nylon, supporting the hypothesis")
print("  that structural pigmentation is more resistant")
print("  to UV degradation than surface dyes.")
print()
print("Key Results:")
print("  Material        0h    48h    200h   Half-life")
print("  Muga silk      100%   96%    92%    >1000h")
print("  Dyed cotton    100%   45%    15%    ~48h")
print("  Dyed nylon     100%   60%    25%    ~90h")
print()
print("Conclusion:")
print("  Muga silk's golden colour, produced by")
print("  xanthurenic acid covalently bonded to fibroin,")
print("  is 20x more UV-resistant than surface dyes.")
print("  This property makes it suitable for medical")
print("  and outdoor applications requiring long-term")
print("  colour stability.")
print()
print("Recommendation:")
print("  Investigate muga silk fibroin as a base material")
print("  for UV-resistant biodegradable sutures and")
print("  wound dressings.")`,
      challenge: 'Write your own Methods section: what exactly would you do, step by step, to reproduce this experiment? Be precise enough that a stranger could follow your instructions.',
      successHint: 'You\'ve completed a full materials science investigation: from hypothesis to experiment to analysis to report. This is real science — and it started with a folktale about a silkworm and the Sun.',
    },
    {
      title: 'From lab to industry — real-world applications',
      concept: `Your lab report identifies a material property (UV resistance) with real-world value. The final step is connecting laboratory findings to **applications**:

**Medical**: muga silk sutures that don't degrade in sunlight during outdoor surgeries. Biodegradable wound dressings that maintain structural integrity.

**Textiles**: UV-protective clothing that doesn't fade. Heritage preservation — museum textiles that last centuries.

**Electronics**: biodegradable electronic substrates (silk-based circuits that dissolve after use, reducing e-waste).

**Conservation**: understanding traditional textiles helps preserve cultural heritage. The mekhela chador isn't just clothing — it's living material science.

Your Level 1-2 journey: folktale → protein biology → lab experiments → data analysis → real-world impact. That's the full arc from story to science to engineering.`,
      storyConnection: 'Malini\'s mekhela chador, woven from Muga\'s golden thread, was so beautiful that people came from every village. Today, muga silk sells for $100+ per meter. The science you\'ve learned explains both the beauty and the value — and points to applications the original weavers never imagined.',
      codeIntro: 'Summarize the complete journey from story to science.',
      code: `print("=" * 55)
print("  YOUR MATERIALS SCIENCE JOURNEY")
print("=" * 55)
print()
print("Level 1 — Concepts:")
print("  ✓ Protein biology (fibroin, β-sheets, sericin)")
print("  ✓ Structural vs surface colour (xanthurenic acid)")
print("  ✓ Stress-strain curves and material properties")
print("  ✓ Experimental design (hypothesis → controls)")
print("  ✓ Data analysis (means, error bars, half-lives)")
print("  ✓ Biomimicry (nature as engineering teacher)")
print()
print("Level 2 — Practice:")
print("  ✓ Microscopy (fibre cross-sections)")
print("  ✓ Tensile testing (force → stress-strain)")
print("  ✓ UV degradation (colour retention over time)")
print("  ✓ Water absorption (weight gain measurement)")
print("  ✓ Lab report writing (scientific communication)")
print("  ✓ Real-world applications (medical, textile, tech)")
print()
print("Level 3 — Would add:")
print("  → FTIR spectroscopy for molecular analysis")
print("  → SEM imaging for nanoscale structure")
print("  → Biocompatibility testing for medical applications")
print("  → Patent research and product development")
print()
print("From a folktale about the Sun's gift to a silkworm")
print("to materials science that could advance medicine.")
print("Story → Science → Engineering → Impact.")`,
      challenge: 'What\'s the single most surprising thing you learned? What would you investigate next if you had access to a university materials lab?',
      successHint: 'Complete. From "why is muga silk golden?" to a full materials science investigation with microscopy, tensile testing, UV degradation, water absorption, and a formal lab report. The Sun\'s promise, verified by science.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Zap className="w-4 h-4" />
          Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Completed Level 1 (or some science background)</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Load Python for data analysis and visualization.</p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Zap className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L2-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady}
          />
        ))}
      </div>
    </div>
  );
}
