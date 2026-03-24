import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function EriSilkLevel2() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Lifecycle analysis — measuring a product\'s total impact',
      concept: `**Lifecycle Analysis (LCA)** is a systematic method for evaluating the environmental impact of a product from cradle to grave — every stage from raw material extraction to disposal.

The four phases of LCA (ISO 14040 standard):

1. **Goal & Scope**: What product? What boundaries? What functional unit? (e.g., "1 kg of finished eri silk fabric, from castor seed to landfill")

2. **Inventory Analysis**: Quantify all inputs (energy, water, chemicals, land) and outputs (emissions, waste, byproducts) at every stage.

3. **Impact Assessment**: Convert inventory data into environmental impact categories:
   - Global Warming Potential (GWP) — kg CO2 equivalent
   - Water footprint — liters
   - Eutrophication — kg PO4 equivalent
   - Acidification — kg SO2 equivalent
   - Land use — m2*years

4. **Interpretation**: Identify the biggest contributors ("hotspots"), compare alternatives, and recommend improvements.

LCA is how we move from "I feel like this is sustainable" to "I can prove this is sustainable with numbers." It's the scientific basis for environmental claims.`,
      analogy: 'LCA is like a full medical checkup for a product. A casual glance might tell you "this shirt looks healthy." But an LCA is the blood test, X-ray, and MRI combined — it reveals hidden problems (high water use in dyeing), unexpected strengths (low transport emissions for local production), and gives you a complete diagnosis.',
      storyConnection: 'The eri moth\'s peace extends through the entire lifecycle of its silk. An LCA of eri silk reveals that the peace isn\'t just at the cocoon stage — it\'s embedded at every phase: castor growth (no irrigation), spinning (home-based, low energy), and disposal (fully biodegradable). The story\'s peace is quantifiable.',
      checkQuestion: 'An LCA shows that organic cotton uses less pesticide but more land than conventional cotton. Which is "better"? How do you decide when different environmental metrics point in different directions?',
      checkAnswer: 'There\'s no single "better" — it depends on what you prioritize. If your region is pesticide-polluted, organic cotton is better. If your region is land-scarce, conventional might be better. LCA provides the DATA; the decision requires VALUE JUDGMENTS. This is why LCA results are often presented as trade-off maps rather than single scores. Weighting different impacts is inherently a political, not scientific, choice.',
      codeIntro: 'Build a simplified lifecycle analysis for eri silk vs. polyester.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified LCA: Eri silk vs Polyester vs Cotton
# Per functional unit: 1 kg of finished fabric

stages = ['Raw material\\nextraction', 'Processing', 'Manufacturing', 'Transport', 'Use phase\\n(washing)', 'End of life']

# CO2 emissions (kg CO2e per kg fabric) by stage
eri_co2 = [0.3, 0.5, 0.8, 0.2, 0.5, -0.1]  # negative = carbon sequestration at decomp
polyester_co2 = [2.0, 1.5, 1.0, 0.5, 1.5, 0.5]
cotton_co2 = [1.0, 2.0, 1.5, 0.5, 2.0, 0.0]

# Water usage (liters per kg fabric) by stage
eri_water = [200, 300, 500, 10, 4000, 0]
polyester_water = [5, 5, 5, 2, 4000, 0]
cotton_water = [5000, 2000, 1500, 10, 4000, 0]

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

x = np.arange(len(stages))
width = 0.25

# CO2 by stage
ax1.set_facecolor('#111827')
ax1.bar(x - width, eri_co2, width, label='Eri silk', color='#22c55e')
ax1.bar(x, polyester_co2, width, label='Polyester', color='#ef4444')
ax1.bar(x + width, cotton_co2, width, label='Cotton', color='#f59e0b')
ax1.set_ylabel('kg CO2e', color='white')
ax1.set_title('Carbon Footprint by Lifecycle Stage', color='white', fontsize=12)
ax1.set_xticks(x)
ax1.set_xticklabels(stages, color='white', fontsize=8)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')
ax1.axhline(0, color='gray', linewidth=0.5)

# Cumulative CO2
ax2.set_facecolor('#111827')
ax2.plot(range(len(stages)), np.cumsum(eri_co2), 'o-', color='#22c55e', linewidth=2, label='Eri silk')
ax2.plot(range(len(stages)), np.cumsum(polyester_co2), 'o-', color='#ef4444', linewidth=2, label='Polyester')
ax2.plot(range(len(stages)), np.cumsum(cotton_co2), 'o-', color='#f59e0b', linewidth=2, label='Cotton')
ax2.set_ylabel('Cumulative kg CO2e', color='white')
ax2.set_title('Cumulative Carbon Through Lifecycle', color='white', fontsize=12)
ax2.set_xticks(range(len(stages)))
ax2.set_xticklabels(stages, color='white', fontsize=8)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax2.tick_params(colors='gray')

# Water by stage
ax3.set_facecolor('#111827')
ax3.bar(x - width, eri_water, width, label='Eri silk', color='#22c55e')
ax3.bar(x, polyester_water, width, label='Polyester', color='#ef4444')
ax3.bar(x + width, cotton_water, width, label='Cotton', color='#f59e0b')
ax3.set_ylabel('Liters water', color='white')
ax3.set_title('Water Footprint by Lifecycle Stage', color='white', fontsize=12)
ax3.set_xticks(x)
ax3.set_xticklabels(stages, color='white', fontsize=8)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax3.tick_params(colors='gray')

# Summary radar
categories = ['Carbon\\nfootprint', 'Water\\nfootprint', 'Biodegradability', 'Durability', 'Ethical\\nscore', 'Renewability']
N = len(categories)
angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

# Scores (higher = better for environment)
eri_scores = [9, 7, 10, 7, 9, 9]
poly_scores = [3, 8, 1, 6, 5, 1]
cotton_scores = [5, 2, 8, 5, 4, 7]

ax4 = fig.add_subplot(224, polar=True)
ax4.set_facecolor('#111827')
for scores, name, color in [(eri_scores, 'Eri silk', '#22c55e'),
                              (poly_scores, 'Polyester', '#ef4444'),
                              (cotton_scores, 'Cotton', '#f59e0b')]:
    vals = scores + scores[:1]
    ax4.plot(angles, vals, 'o-', linewidth=2, label=name, color=color)
    ax4.fill(angles, vals, alpha=0.08, color=color)
ax4.set_xticks(angles[:-1])
ax4.set_xticklabels(categories, color='white', fontsize=8)
ax4.set_ylim(0, 10)
ax4.legend(loc='upper right', bbox_to_anchor=(1.4, 1.1), facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=9)
ax4.set_title('Overall LCA Profile', color='white', fontsize=11, pad=20)

plt.tight_layout()
plt.show()

print("Lifecycle totals per kg of fabric:")
print(f"  Eri silk:  {sum(eri_co2):.1f} kg CO2e, {sum(eri_water):,}L water")
print(f"  Polyester: {sum(polyester_co2):.1f} kg CO2e, {sum(polyester_water):,}L water")
print(f"  Cotton:    {sum(cotton_co2):.1f} kg CO2e, {sum(cotton_water):,}L water")
print()
print("Surprise finding: the USE PHASE (washing) dominates water")
print("for ALL fabrics. Reducing wash frequency and temperature")
print("has more impact than choosing the 'right' fabric.")`,
      challenge: 'The use phase (washing) dominates water for all fabrics. If you reduce washing from 50 to 25 washes over a garment\'s life, how much water do you save? Model a "wash less" campaign vs. "buy eri silk" campaign — which saves more water?',
      successHint: 'LCA often reveals that the biggest environmental impact is NOT where you expect it. Data-driven analysis is essential for making effective sustainability decisions rather than just feeling good about symbolic choices.',
    },
    {
      title: 'Environmental footprint calculation — putting numbers to impact',
      concept: `An **environmental footprint** quantifies how much of the planet's resources and waste-absorption capacity a product, person, or company uses. Key footprints:

**Carbon footprint**: Total greenhouse gas emissions (in CO2 equivalents)
- Measured in kg CO2e or tonnes CO2e
- Includes direct emissions (burning fuel) and indirect (electricity, supply chain)

**Water footprint**: Total freshwater consumed
- Blue water: surface/groundwater consumed (irrigation)
- Green water: rainwater consumed (rain-fed crops)
- Grey water: freshwater needed to dilute pollutants to safe levels

**Ecological footprint**: Land area needed to support consumption
- Measured in global hectares (gha)
- Includes cropland, forest, fishing ground, built land, carbon absorption land

For eri silk, the calculation:
- Carbon: ~2.2 kg CO2e per kg fabric (vs. 7.0 for polyester)
- Water: ~5,000 L per kg (vs. 17 for polyester, 10,000 for cotton)
- Land: ~15 m^2 per kg (castor cultivation) for ~6 months

These numbers let us compare products on equal footing and identify where to focus improvement efforts.`,
      analogy: 'Environmental footprints are like a financial budget for the planet. Carbon footprint is what you spend on "atmospheric space." Water footprint is what you spend on "clean water." Ecological footprint is what you spend on "productive land." Just like a household budget, if you overspend in one category, something else suffers. The planet has a fixed income (solar energy, rainfall, productive land) and we\'re currently overspending by 75%.',
      storyConnection: 'The eri moth treads lightly — it eats castor leaves that grow on marginal land, it produces silk from its own body chemistry (no industrial heat or chemicals), and when the silk garment finally wears out, it returns to the soil. The story\'s "peace" is also a tiny footprint.',
      checkQuestion: 'If the entire world switched from polyester to eri silk for clothing, we\'d need about 30 million tonnes of silk per year. How much castor plantation land would that require?',
      checkAnswer: 'At ~15 m^2 per kg for 6 months: 30 billion kg * 15 m^2/kg = 450 billion m^2 = 450,000 km^2. That\'s roughly the size of Sweden, or about 3% of global arable land. This is actually not unreasonable — but it shows that scale matters. No single solution works at planetary scale without trade-offs. The real answer is likely a mix: eri silk for premium items, recycled materials for basics, and dramatically fewer clothes overall.',
      codeIntro: 'Calculate and visualize the complete environmental footprint of eri silk production.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Detailed footprint calculation for 1 kg eri silk fabric

# Carbon footprint breakdown (kg CO2e)
carbon_items = {
    'Castor cultivation': 0.3,
    'Silkworm rearing': 0.1,
    'Cocoon harvesting': 0.05,
    'Spinning': 0.4,
    'Weaving': 0.35,
    'Dyeing (natural)': 0.2,
    'Transport (local)': 0.15,
    'Packaging': 0.1,
}

# Water footprint breakdown (liters)
water_items = {
    'Castor (green water)': 800,
    'Castor (blue water)': 200,
    'Rearing (cleaning)': 50,
    'Degumming': 300,
    'Dyeing': 500,
    'Washing/finishing': 200,
}

# Land footprint (m2*months)
land_items = {
    'Castor plantation': 90,
    'Rearing shed': 5,
    'Processing space': 2,
}

fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Carbon pie
ax1.set_facecolor('#111827')
colors_c = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#6b7280', '#14b8a6']
wedges1, texts1, auto1 = ax1.pie(carbon_items.values(), labels=None,
    autopct=lambda pct: f'{pct:.0f}%' if pct > 5 else '', colors=colors_c,
    pctdistance=0.75, textprops={'color': 'white', 'fontsize': 8})
ax1.legend(carbon_items.keys(), loc='center left', bbox_to_anchor=(-0.3, 0.5),
           facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
ax1.set_title(f'Carbon: {sum(carbon_items.values()):.2f} kg CO2e', color='white', fontsize=11)

# Water bar
ax2.set_facecolor('#111827')
w_names = list(water_items.keys())
w_vals = list(water_items.values())
w_colors = ['#22c55e', '#3b82f6', '#6b7280', '#f59e0b', '#a855f7', '#ef4444']
bars2 = ax2.barh(w_names, w_vals, color=w_colors[:len(w_names)], height=0.6)
ax2.set_xlabel('Liters', color='white')
ax2.set_title(f'Water: {sum(water_items.values()):,}L total', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_yticklabels(w_names, color='white', fontsize=8)
for bar, v in zip(bars2, w_vals):
    ax2.text(bar.get_width() + 10, bar.get_y() + bar.get_height()/2,
             f'{v}L', va='center', color='white', fontsize=9)

# Comparison summary
ax3.set_facecolor('#111827')
fabrics = ['Eri silk', 'Polyester', 'Cotton']
carbon_total = [sum(carbon_items.values()), 7.0, 8.0]
water_total = [sum(water_items.values()) / 1000, 0.017, 10.0]  # thousands of liters

x_pos = np.arange(len(fabrics))
width = 0.35
bars_c = ax3.bar(x_pos - width/2, carbon_total, width, label='Carbon (kg CO2e)', color='#ef4444', alpha=0.8)
ax3_twin = ax3.twinx()
bars_w = ax3_twin.bar(x_pos + width/2, water_total, width, label='Water (1000L)', color='#3b82f6', alpha=0.8)

ax3.set_ylabel('kg CO2e', color='#ef4444')
ax3_twin.set_ylabel('Water (1000L)', color='#3b82f6')
ax3.set_xticks(x_pos)
ax3.set_xticklabels(fabrics, color='white')
ax3.set_title('Footprint Comparison', color='white', fontsize=11)
ax3.tick_params(axis='y', colors='#ef4444')
ax3_twin.tick_params(axis='y', colors='#3b82f6')
ax3.tick_params(axis='x', colors='gray')

lines1, labels1 = ax3.get_legend_handles_labels()
lines2, labels2 = ax3_twin.get_legend_handles_labels()
ax3.legend(lines1 + lines2, labels1 + labels2, facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=9)

plt.tight_layout()
plt.show()

total_carbon = sum(carbon_items.values())
total_water = sum(water_items.values())
print("Eri silk footprint per kg of fabric:")
print(f"  Carbon: {total_carbon:.2f} kg CO2e")
print(f"  Water: {total_water:,} liters")
print(f"  Land: {sum(land_items.values())} m2*months")
print()
print("Compared to alternatives:")
print(f"  vs Polyester: {7.0/total_carbon:.1f}x less carbon, {17/total_water*1000:.0f}x more water")
print(f"  vs Cotton: {8.0/total_carbon:.1f}x less carbon, {10000/total_water:.1f}x less water")
print()
print("Eri silk's sweet spot: low carbon AND moderate water.")
print("Its main disadvantage: higher land use than synthetics.")`,
      challenge: 'Add a "garment lifetime" dimension. If an eri silk garment lasts 10 years and a polyester garment lasts 2 years, recalculate the footprint per year of use. How does durability change the equation?',
      successHint: 'Environmental footprint calculation turns vague sustainability claims into testable numbers. The ability to quantify impact is what separates greenwashing from genuine environmental responsibility.',
    },
    {
      title: 'Vegan materials science — beyond animal fibers',
      concept: `**Vegan materials science** develops alternatives to animal-derived materials (leather, silk, wool, fur) using plant-based, microbial, or synthetic sources.

Current frontiers:

**Plant-based leather alternatives**:
- Pinatex (from pineapple leaf fiber)
- Mycelium leather (from mushroom roots)
- Cactus leather (from nopal cactus)
- Apple leather (from apple waste)

**Silk alternatives**:
- Recombinant spider silk (Bolt Threads' Microsilk — engineered yeast produces spider silk protein)
- Orange Fiber (from citrus juice waste cellulose)
- Banana fiber silk (from banana plant stems)

**Wool alternatives**:
- Kapok (from kapok tree seed pods — hollow, warm, hypoallergenic)
- Hemp fleece (hemp fiber processed to be soft)
- Recycled PET fleece (plastic bottles → warm fabric)

Eri silk occupies an interesting position: it IS an animal product (silk moth) but IS produced without killing the animal. Is it vegan? Strict vegans say no (it still exploits an animal). Pragmatic ethicists say it's the most ethical animal fiber possible. This debate highlights that "ethical" is not binary.`,
      analogy: 'Vegan materials science is like the renewable energy transition for fashion. Just as solar panels started expensive and low-quality but are now competitive with fossil fuels, plant-based materials started as inferior substitutes but are rapidly approaching (and sometimes exceeding) animal-based performance. The transition is technology-driven, not just ethics-driven.',
      storyConnection: 'The eri moth found peace in our story, but vegan materials scientists ask a deeper question: should we use moths at all? The story\'s peace is about non-killing. The vegan perspective is about non-use. Both are valid ethical positions, and the science of alternatives is advancing rapidly enough that the choice may soon be moot.',
      checkQuestion: 'Bolt Threads engineers yeast to produce spider silk protein. Is this "natural" silk? Is it "synthetic"? Does the distinction matter?',
      checkAnswer: 'It\'s both and neither. The protein is identical to spider silk (natural molecule). But it\'s produced by engineered yeast in a bioreactor (synthetic process). The distinction between "natural" and "synthetic" breaks down when biology meets engineering. What matters more: the PROCESS (how it\'s made) or the PRODUCT (what it is)? There\'s no consensus — but the protein doesn\'t care about our labels.',
      codeIntro: 'Compare the properties of animal fibers vs. vegan alternatives.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Material comparison: animal vs vegan alternatives
materials = {
    'Mulberry silk': {'strength': 8, 'softness': 9, 'durability': 7, 'ethics': 2, 'sustainability': 5, 'cost': 4, 'type': 'animal'},
    'Eri silk': {'strength': 6, 'softness': 7, 'durability': 7, 'ethics': 8, 'sustainability': 8, 'cost': 5, 'type': 'animal'},
    'Recombinant silk': {'strength': 9, 'softness': 8, 'durability': 8, 'ethics': 9, 'sustainability': 6, 'cost': 2, 'type': 'bio-synth'},
    'Orange fiber': {'strength': 5, 'softness': 7, 'durability': 5, 'ethics': 10, 'sustainability': 9, 'cost': 3, 'type': 'plant'},
    'Leather': {'strength': 9, 'softness': 6, 'durability': 9, 'ethics': 1, 'sustainability': 3, 'cost': 5, 'type': 'animal'},
    'Mycelium leather': {'strength': 7, 'softness': 7, 'durability': 6, 'ethics': 10, 'sustainability': 8, 'cost': 3, 'type': 'bio-synth'},
    'Pinatex': {'strength': 6, 'softness': 5, 'durability': 6, 'ethics': 10, 'sustainability': 9, 'cost': 4, 'type': 'plant'},
}

type_colors = {'animal': '#ef4444', 'bio-synth': '#a855f7', 'plant': '#22c55e'}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Scatter: ethics vs performance (strength * durability)
ax1.set_facecolor('#111827')
for name, props in materials.items():
    perf = (props['strength'] + props['durability']) / 2
    ax1.scatter(props['ethics'], perf, s=props['sustainability'] * 30,
                color=type_colors[props['type']], alpha=0.7, edgecolors='white', linewidth=1)
    ax1.annotate(name, xy=(props['ethics'], perf),
                 xytext=(5, 5), textcoords='offset points',
                 color='white', fontsize=8)

ax1.set_xlabel('Ethics score (10 = best)', color='white')
ax1.set_ylabel('Performance score (strength + durability)', color='white')
ax1.set_title('Ethics vs Performance\\n(bubble size = sustainability)', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Legend for types
for t, c in type_colors.items():
    ax1.scatter([], [], color=c, s=80, label=t.capitalize())
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)

# Grouped bar: all properties
ax2.set_facecolor('#111827')
props_list = ['strength', 'softness', 'durability', 'ethics', 'sustainability', 'cost']
n_materials = len(materials)
n_props = len(props_list)
x = np.arange(n_props)
bar_width = 0.12

for i, (name, props) in enumerate(materials.items()):
    values = [props[p] for p in props_list]
    offset = (i - n_materials / 2) * bar_width
    ax2.bar(x + offset, values, bar_width, label=name, color=type_colors[props['type']],
            alpha=0.5 + 0.1 * i)

ax2.set_xticks(x)
ax2.set_xticklabels([p.capitalize() for p in props_list], color='white', fontsize=9)
ax2.set_ylabel('Score (0-10)', color='white')
ax2.set_title('Material Property Comparison', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7,
           loc='upper right')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Key findings:")
print("  - Recombinant silk: best performance + high ethics, but expensive")
print("  - Eri silk: best balance of real-world availability + ethics")
print("  - Mycelium leather: most promising leather alternative")
print("  - Plant fibers: highest ethics + sustainability, lower performance")
print()
print("The trend: bio-synthetic materials (recombinant silk, mycelium)")
print("are closing the gap with traditional animal materials.")
print("Within 10 years, the performance argument for animal fibers")
print("may disappear entirely.")`,
      challenge: 'Add "Wool" and "Kapok fiber" to the comparison. Research their properties. At what point does a vegan alternative become truly "as good" as the animal original? Define "as good" in your own terms.',
      successHint: 'Vegan materials science shows that ethics and performance are converging. The question is shifting from "can we replace animal materials?" to "why haven\'t we already?"',
    },
    {
      title: 'Biodegradable polymers — materials that return to earth',
      concept: `A **biodegradable polymer** is a material that microorganisms (bacteria, fungi) can break down into natural substances: water, CO2, and biomass.

Silk fibroin is nature's biodegradable polymer. Synthetic equivalents include:

**PLA (Polylactic Acid)**:
- Made from corn starch or sugarcane
- Biodegrades in industrial composting (60C, 6 months)
- Used in 3D printing, packaging, medical implants
- Problem: doesn't biodegrade in oceans or landfills (needs heat)

**PHA (Polyhydroxyalkanoates)**:
- Produced by bacteria as energy storage (like biological plastic)
- Biodegrades in soil AND ocean
- Expensive to produce (5-10x polyethylene)

**Silk fibroin**:
- Nature's original biodegradable polymer
- Biodegrades via proteolytic enzymes (naturally present in soil)
- Controlled degradation rate (tunable from weeks to years)
- Used in medical sutures, tissue scaffolds, drug delivery

The key insight: **degradation rate must match application**. A shopping bag should degrade in months. A medical implant should degrade in years. Silk's tunability makes it uniquely versatile.

The mechanism: enzymes (protease, chymotrypsin) cleave the peptide bonds in fibroin's beta sheets. The amino acids are released and absorbed by soil microorganisms. Nothing toxic remains.`,
      analogy: 'Biodegradable polymers are like ice cubes designed to melt at specific temperatures. Regular ice melts at 0C. You could engineer "ice" that melts at 10C, 20C, or 37C. Biodegradable polymers are designed to "melt" (degrade) under specific conditions: industrial compost heat (PLA), ocean bacteria (PHA), or soil enzymes (silk). Choose the wrong polymer for the wrong environment and it persists like regular plastic.',
      storyConnection: 'The eri moth\'s silk, once spun and woven, will eventually return to the earth — broken down by soil microbes into amino acids that nourish new castor plants that feed new moths. The cycle is complete. The "peace" in our story includes peace with time: nothing is wasted, nothing persists as pollution.',
      checkQuestion: 'PLA is labeled "biodegradable" but requires 60C industrial composting to actually break down. If someone throws a PLA cup in the ocean, what happens?',
      checkAnswer: 'Almost nothing — for decades. Ocean water is too cold (average 3.5C) and lacks the specific microorganisms needed to break PLA down. The PLA cup will behave almost exactly like conventional plastic in the ocean: floating, fragmenting into microplastics, being eaten by marine life. "Biodegradable" without specifying CONDITIONS is misleading. This is one of the biggest greenwashing problems in materials labeling.',
      codeIntro: 'Model the degradation rates of different biodegradable polymers under various conditions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Biodegradation model: mass remaining over time
# Different polymers in different environments

def degradation(t, half_life):
    """Exponential decay model for biodegradation."""
    return 100 * np.exp(-0.693 * t / half_life)

months = np.linspace(0, 60, 500)  # 5 years

# Half-lives (months) for different materials in different environments
materials = {
    'Silk fibroin': {'soil': 3, 'compost': 1, 'ocean': 12, 'landfill': 6},
    'PLA': {'soil': 120, 'compost': 3, 'ocean': 600, 'landfill': 240},
    'PHA': {'soil': 6, 'compost': 2, 'ocean': 6, 'landfill': 12},
    'Polyester (PET)': {'soil': 6000, 'compost': 6000, 'ocean': 6000, 'landfill': 6000},
}

colors_mat = {'Silk fibroin': '#22c55e', 'PLA': '#f59e0b', 'PHA': '#3b82f6', 'Polyester (PET)': '#ef4444'}
environments = ['soil', 'compost', 'ocean', 'landfill']

fig, axes = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

for idx, env in enumerate(environments):
    ax = axes[idx // 2][idx % 2]
    ax.set_facecolor('#111827')

    for mat_name, half_lives in materials.items():
        hl = half_lives[env]
        remaining = degradation(months, hl)
        ax.plot(months, remaining, linewidth=2, label=mat_name, color=colors_mat[mat_name])

    ax.axhline(10, color='gray', linestyle=':', linewidth=1, alpha=0.5)
    ax.set_xlabel('Months', color='white')
    ax.set_ylabel('Mass remaining (%)', color='white')
    ax.set_title(f'Degradation in {env.capitalize()}', color='white', fontsize=12)
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
    ax.tick_params(colors='gray')
    ax.set_ylim(0, 105)

plt.tight_layout()
plt.show()

print("Time to 90% degradation (months):")
for mat_name, half_lives in materials.items():
    print(f"  {mat_name}:")
    for env, hl in half_lives.items():
        t90 = hl * np.log(10) / np.log(2)  # time to 10% remaining
        years = t90 / 12
        if years > 10:
            print(f"    {env}: {years:.0f} years")
        else:
            print(f"    {env}: {t90:.0f} months ({years:.1f} years)")
print()
print("Key insight: 'biodegradable' means NOTHING without specifying")
print("the environment. PLA in ocean = plastic. Silk in soil = compost.")`,
      challenge: 'Model what happens if we blend PLA with silk fibroin (50/50). Would the blend degrade faster than PLA alone? Research how material blends behave in degradation — is it linear interpolation or something more complex?',
      successHint: 'Biodegradability is conditional, not absolute. Understanding degradation kinetics is essential for choosing materials that actually decompose rather than just claiming to.',
    },
    {
      title: 'Circular economy — designing waste out of the system',
      concept: `The **circular economy** replaces the linear "take-make-dispose" model with a closed loop where materials circulate indefinitely:

**Linear economy**: Extract raw material -> Manufacture -> Use -> Dispose (landfill/incinerate)

**Circular economy**: Design for longevity -> Use -> Repair/Reuse -> Remanufacture -> Recycle -> (back to beginning)

Key principles (Ellen MacArthur Foundation):
1. **Design out waste**: Products should be designed so every component can be reused or recycled
2. **Keep products and materials in use**: Repair, refurbish, share, remanufacture
3. **Regenerate natural systems**: Return biological materials to the earth to enrich soil

Eri silk is naturally circular:
- **Biological cycle**: Castor plant grows -> feeds moth -> moth produces silk -> silk is woven -> garment is worn -> garment biodegrades -> nutrients return to soil -> castor plant grows
- **Technical components**: Metal buttons, zippers can be recovered and reused
- **Zero waste**: Castor seeds produce castor oil (industrial lubricant). Moth pupae are eaten as protein in many NE Indian communities. Nothing is wasted.

The circular economy isn't just an environmental concept — it's an economic model. McKinsey estimates it could generate $4.5 trillion in economic value by 2030.`,
      analogy: 'The linear economy is like a river: water flows from source to sea, one direction, no return. The circular economy is like the water cycle: evaporation, condensation, precipitation, flow — the same water molecules cycle endlessly. Nature has no landfills because everything is someone else\'s food. The circular economy copies this design.',
      storyConnection: 'The eri moth\'s lifecycle IS a circular economy: castor leaf -> moth body -> silk fiber -> (human use) -> soil nutrients -> castor leaf. Our story\'s "peace" is also the peace of a balanced cycle — no extraction without return, no consumption without regeneration. The moth teaches us not just ethics but systems design.',
      checkQuestion: 'Fast fashion produces 92 million tonnes of textile waste per year. If we transitioned to a circular model, how much of this could theoretically be eliminated?',
      checkAnswer: 'Theoretically, nearly 100% — in a perfect circular system, there IS no waste. Practically, 80-90% reduction is achievable through: (1) designing for durability (fewer garments produced), (2) repair and resale (extending garment life 2-3x), (3) fiber-to-fiber recycling (turning old clothes into new fabric), and (4) composting natural fibers. The remaining 10-20% is unavoidable micro-losses (lint, abrasion) and contaminated material.',
      codeIntro: 'Model a circular vs. linear economy for textile production.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate 20 years of textile production: linear vs circular

years = np.arange(0, 21)
annual_demand = 100  # million tonnes of new fabric demand per year

# Linear economy: everything produced is eventually wasted
linear_produced = annual_demand * years
linear_waste = np.zeros(21)
linear_in_use = np.zeros(21)
garment_life = 3  # years average in linear economy
for y in years:
    linear_in_use[y] = annual_demand * min(y, garment_life)
    linear_waste[y] = max(0, annual_demand * (y - garment_life))
linear_waste_cumulative = np.cumsum(np.diff(np.concatenate([[0], linear_waste])))

# Circular economy: repair, recycle, compost
circ_virgin = np.zeros(21)  # new raw material needed
circ_recycled = np.zeros(21)  # recycled material
circ_waste = np.zeros(21)  # actual waste
circ_in_use = np.zeros(21)
recycle_rate = 0.7  # 70% of end-of-life fabric is recycled
garment_life_circ = 6  # longer life due to repair culture
for y in range(21):
    # Material available from recycling (from garments reaching end of life)
    if y >= garment_life_circ:
        recyclable = annual_demand * recycle_rate
    else:
        recyclable = 0
    circ_recycled[y] = recyclable
    circ_virgin[y] = max(0, annual_demand - recyclable)
    circ_waste[y] = annual_demand - recyclable if y >= garment_life_circ else 0
    circ_in_use[y] = min(y, garment_life_circ) * annual_demand

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Cumulative virgin material used
ax1.set_facecolor('#111827')
ax1.plot(years, np.cumsum(np.ones(21) * annual_demand), color='#ef4444', linewidth=2, label='Linear')
ax1.plot(years, np.cumsum(circ_virgin), color='#22c55e', linewidth=2, label='Circular')
ax1.fill_between(years, np.cumsum(np.ones(21) * annual_demand), np.cumsum(circ_virgin),
                 alpha=0.15, color='#22c55e')
ax1.set_xlabel('Years', color='white')
ax1.set_ylabel('Cumulative virgin material (Mt)', color='white')
ax1.set_title('Virgin Material Consumption', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Cumulative waste
ax2.set_facecolor('#111827')
lin_waste_cum = np.cumsum(np.maximum(0, np.ones(21) * annual_demand - 0))
circ_waste_cum = np.cumsum(circ_waste)
for i in range(21):
    if i < garment_life:
        lin_waste_cum[i] = 0
    else:
        lin_waste_cum[i] = (i - garment_life) * annual_demand
ax2.plot(years, lin_waste_cum, color='#ef4444', linewidth=2, label='Linear waste')
ax2.plot(years, circ_waste_cum, color='#22c55e', linewidth=2, label='Circular waste')
ax2.fill_between(years, lin_waste_cum, circ_waste_cum, alpha=0.15, color='#ef4444')
ax2.set_xlabel('Years', color='white')
ax2.set_ylabel('Cumulative waste (Mt)', color='white')
ax2.set_title('Cumulative Waste Generated', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Material flow sankey-like (stacked area)
ax3.set_facecolor('#111827')
ax3.stackplot(years, circ_virgin, circ_recycled,
              colors=['#3b82f6', '#22c55e'], alpha=0.7,
              labels=['Virgin material', 'Recycled material'])
ax3.set_xlabel('Years', color='white')
ax3.set_ylabel('Annual material input (Mt)', color='white')
ax3.set_title('Circular Economy: Material Sources', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Summary comparison
ax4.set_facecolor('#111827')
metrics = ['Virgin material\\n(20yr total)', 'Waste\\n(20yr total)', 'Garment\\nlifetime', 'Resource\\nefficiency']
linear_vals = [2000, lin_waste_cum[-1], garment_life, 30]  # normalized scores for efficiency
circular_vals = [sum(circ_virgin), circ_waste_cum[-1], garment_life_circ, 70]
x_pos = np.arange(len(metrics))
width = 0.35
ax4.bar(x_pos - width/2, [2000, lin_waste_cum[-1], garment_life * 100, 30],
        width, label='Linear', color='#ef4444', alpha=0.8)
ax4.bar(x_pos + width/2, [sum(circ_virgin), circ_waste_cum[-1], garment_life_circ * 100, 70],
        width, label='Circular', color='#22c55e', alpha=0.8)
ax4.set_xticks(x_pos)
ax4.set_xticklabels(metrics, color='white', fontsize=9)
ax4.set_title('20-Year Impact Comparison', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

savings_material = (2000 - sum(circ_virgin)) / 2000 * 100
savings_waste = (lin_waste_cum[-1] - circ_waste_cum[-1]) / max(lin_waste_cum[-1], 1) * 100
print(f"Over 20 years, circular economy saves:")
print(f"  Virgin material: {savings_material:.0f}% reduction")
print(f"  Waste: {savings_waste:.0f}% reduction")
print(f"  Garment lifetime: {garment_life_circ/garment_life:.1f}x longer")
print()
print("Eri silk in the circular economy:")
print("  - Castor is perennial (doesn't need replanting)")
print("  - Silk biodegrades (returns nutrients to soil)")
print("  - Moth pupae are food (zero waste)")
print("  - Skills are cultural heritage (social sustainability)")`,
      challenge: 'What if the recycling rate improved from 70% to 90% over 10 years? Model this gradual improvement. Also model what happens if garment lifetime doubles (from 6 to 12 years through repair culture). Which intervention saves more material?',
      successHint: 'The circular economy is not just recycling — it\'s a complete redesign of how we produce and consume. Eri silk from Northeast India is one of the oldest examples of circular production on Earth.',
    },
    {
      title: 'Textile recycling technology — closing the loop',
      concept: `Textile recycling is the technology needed to make the circular economy real. Current approaches:

**Mechanical recycling**:
- Shredding old fabrics into fibers, then re-spinning
- Works for cotton, wool, and some synthetics
- Problem: fiber length decreases with each cycle (quality degrades)
- Typically produces "downcycled" products (insulation, rags, not new clothes)

**Chemical recycling**:
- Dissolving fabric and regenerating fibers from the solution
- Cellulose: dissolve cotton in ionic liquids, regenerate as lyocell-type fiber (Renewcell's Circulose)
- Polyester: depolymerize PET back to monomers, re-polymerize (Worn Again Technologies)
- Problem: expensive, energy-intensive, limited capacity

**Enzymatic recycling**:
- Using enzymes to selectively break down specific fibers in blended fabrics
- Silk fibroin can be digested by protease enzymes, leaving synthetic fibers intact
- Emerging technology: Carbios uses engineered PETase enzyme to depolymerize polyester

**The blended fabric problem**: Most modern textiles are blends (65% polyester, 35% cotton). Separating blended fibers is the biggest unsolved challenge in textile recycling. Current rate: only 1% of clothing is recycled into new clothing.

Eri silk advantage: pure protein fiber, fully biodegradable. No separation needed — just compost it.`,
      analogy: 'Textile recycling is like un-baking a cake. Mechanical recycling is crumbling the cake back into flour-like pieces (loses structure). Chemical recycling is dissolving the cake and extracting pure ingredients (expensive but high quality). Enzymatic recycling is using a magic enzyme that eats only the flour, leaving the sugar and eggs intact (for blended "cakes"). The easier approach? Don\'t blend ingredients that can\'t be separated.',
      storyConnection: 'The eri moth\'s silk can return to earth directly — no recycling technology needed, just soil microbes doing what they\'ve done for millions of years. Our story\'s peace extends to the end of the garment\'s life: no industrial processing, no toxic byproducts, just quiet decomposition. The most advanced recycling technology is the one nature already provides.',
      checkQuestion: 'If only 1% of clothing is currently recycled into new clothing, where does the other 99% go?',
      checkAnswer: 'About 73% goes to landfill or incineration. About 12% is "downcycled" into industrial rags, insulation, or stuffing. About 14% is exported to developing countries as secondhand clothing (which often ends up in THEIR landfills). Only 1% becomes new fabric. The "recycling" symbol on clothing labels is misleading — it usually means the fabric CAN be recycled, not that it WILL be. Infrastructure, economics, and technology all lag behind the need.',
      codeIntro: 'Model the different recycling pathways and their effectiveness.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Textile recycling flow model
# Track 1000 kg of textile waste through different pathways

total_waste = 1000  # kg

# Current reality (2024)
current_flow = {
    'Landfill': 530,
    'Incineration': 200,
    'Downcycled (rags/insulation)': 120,
    'Exported (secondhand)': 140,
    'Recycled to new fabric': 10,
}

# Future target (2035)
future_flow = {
    'Landfill': 100,
    'Incineration': 50,
    'Downcycled (rags/insulation)': 150,
    'Exported (secondhand)': 100,
    'Mechanical recycling': 200,
    'Chemical recycling': 250,
    'Composted (natural fibers)': 150,
}

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(13, 9))
fig.patch.set_facecolor('#1f2937')

# Current pie
ax1.set_facecolor('#111827')
colors_curr = ['#ef4444', '#f59e0b', '#6b7280', '#3b82f6', '#22c55e']
wedges, texts, autos = ax1.pie(current_flow.values(), labels=None,
    autopct='%1.0f%%', colors=colors_curr, pctdistance=0.8,
    textprops={'color': 'white', 'fontsize': 9})
ax1.legend(current_flow.keys(), loc='center left', bbox_to_anchor=(-0.4, 0.5),
           facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.set_title('Current (2024): Where Clothes Go', color='white', fontsize=12)

# Future pie
ax2.set_facecolor('#111827')
colors_fut = ['#ef4444', '#f59e0b', '#6b7280', '#3b82f6', '#a855f7', '#ec4899', '#22c55e']
wedges2, texts2, autos2 = ax2.pie(future_flow.values(), labels=None,
    autopct='%1.0f%%', colors=colors_fut, pctdistance=0.8,
    textprops={'color': 'white', 'fontsize': 9})
ax2.legend(future_flow.keys(), loc='center left', bbox_to_anchor=(-0.4, 0.5),
           facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax2.set_title('Target (2035): Circular Fashion', color='white', fontsize=12)

# Recycling quality comparison
ax3.set_facecolor('#111827')
methods = ['Mechanical', 'Chemical\\n(cellulose)', 'Chemical\\n(polyester)', 'Enzymatic', 'Composting\\n(silk/cotton)']
quality = [4, 8, 9, 7, 0]  # output fiber quality (0 = nutrient return)
cost = [2, 7, 8, 9, 1]  # relative cost
energy = [3, 7, 6, 5, 1]  # energy intensity

x = np.arange(len(methods))
width = 0.25
ax3.bar(x - width, quality, width, label='Output quality', color='#22c55e')
ax3.bar(x, cost, width, label='Relative cost', color='#ef4444')
ax3.bar(x + width, energy, width, label='Energy use', color='#3b82f6')
ax3.set_xticks(x)
ax3.set_xticklabels(methods, color='white', fontsize=8)
ax3.set_ylabel('Score (0-10)', color='white')
ax3.set_title('Recycling Method Comparison', color='white', fontsize=12)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax3.tick_params(colors='gray')

# Fiber quality over recycling cycles
ax4.set_facecolor('#111827')
cycles = np.arange(0, 8)
mech_quality = 100 * 0.7 ** cycles  # loses 30% per cycle
chem_quality = 100 * 0.95 ** cycles  # loses 5% per cycle
silk_compost = np.where(cycles == 0, 100, 0)  # one cycle then soil
silk_regrow = np.full_like(cycles, 100, dtype=float)  # new silk from new moth

ax4.plot(cycles, mech_quality, 'o-', color='#f59e0b', linewidth=2, label='Mechanical recycling')
ax4.plot(cycles, chem_quality, 'o-', color='#a855f7', linewidth=2, label='Chemical recycling')
ax4.plot(cycles, silk_regrow, 's--', color='#22c55e', linewidth=2, label='Eri silk (compost + regrow)')
ax4.set_xlabel('Recycling cycles', color='white')
ax4.set_ylabel('Fiber quality (%)', color='white')
ax4.set_title('Fiber Quality Over Multiple Recycling Cycles', color='white', fontsize=12)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Current textile recycling reality:")
print(f"  Landfill + incineration: {530+200} kg / 1000 kg = 73%")
print(f"  True recycling to new fabric: 10 kg / 1000 kg = 1%")
print()
print("The eri silk advantage:")
print("  - No recycling technology needed (biodegrades naturally)")
print("  - No quality loss (new silk from new moths, not recycled fiber)")
print("  - Nutrients return to soil (feeds next generation of castor plants)")
print("  - The cycle is: grow -> spin -> wear -> compost -> grow")
print()
print("For synthetic/blended fabrics, we need industrial recycling.")
print("For pure natural fibers like eri silk, nature recycles for free.")`,
      challenge: 'Model a scenario where 50% of global clothing switches to biodegradable natural fibers (eri silk, organic cotton, hemp) and 50% stays synthetic but with 80% chemical recycling. How much landfill waste would this eliminate compared to today? What infrastructure would be needed?',
      successHint: 'From lifecycle analysis to footprint calculation to vegan materials to biodegradable polymers to circular economy to recycling technology — you\'ve built a complete framework for sustainable materials science. The eri moth\'s peace extends from biology through chemistry to economics and systems design.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 silk biology foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for sustainability and materials science simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}