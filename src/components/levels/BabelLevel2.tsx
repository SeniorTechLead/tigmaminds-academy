import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import BabelForcesDiagram from '../diagrams/BabelForcesDiagram';
import BabelBucklingDiagram from '../diagrams/BabelBucklingDiagram';
import BabelSkyscraperDiagram from '../diagrams/BabelSkyscraperDiagram';
import BabelNLPDiagram from '../diagrams/BabelNLPDiagram';

export default function BabelLevel2() {
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
      title: 'Stress and strain \u2014 quantifying deformation',
      concept: `In Level 1, we met compression, tension, and shear as concepts. Now we need precise numbers. Engineers use two quantities:

**Stress (\u03C3)** = Force / Area (measured in Pascals, Pa)
**Strain (\u03B5)** = Change in length / Original length (dimensionless ratio)

These are related by **Young\u2019s modulus (E)**: \u03C3 = E \u00D7 \u03B5. This is Hooke\u2019s law for materials \u2014 just like a spring, a material stretches proportionally to the force applied, up to a limit.

Young\u2019s modulus is the material\u2019s stiffness: steel E = 200 GPa, concrete E = 30 GPa, wood E = 12 GPa, rubber E = 0.01 GPa. Higher E = stiffer = less deformation under load.

The code generates stress-strain curves for different materials and finds their yield points.`,
      analogy: 'Stress is like blood pressure \u2014 the intensity of force per unit area. Strain is how much the material actually deforms. Young\u2019s modulus is the material\u2019s personality: a stiff person (steel, high E) barely budges under pressure; a flexible person (rubber, low E) stretches dramatically.',
      storyConnection: 'The mud bricks of Babel had a low Young\u2019s modulus (~2 GPa) and a low yield stress (~2 MPa). This means they would visibly deform and crack long before a stone or steel structure showed any distress. The builders would have seen their tower slowly sagging and cracking \u2014 a clear sign the materials were failing.',
      checkQuestion: 'A steel rod (E = 200 GPa, area = 0.001 m\u00B2) supports 100 kN. How much does it stretch per metre of length?',
      checkAnswer: 'Stress = 100,000 / 0.001 = 100 MPa. Strain = stress / E = 100\u00D710\u2076 / 200\u00D710\u2079 = 0.0005 = 0.05%. Per metre: 0.5 mm. Steel barely stretches under enormous loads \u2014 this is why we trust it with our tallest buildings.',
      codeIntro: 'Plot stress-strain curves for structural materials.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Material properties: (Young's modulus GPa, yield stress MPa, ultimate MPa)
materials = {
    "Mud brick":    (2,    2,    2.5),
    "Concrete":     (30,   30,   40),
    "Wood (oak)":   (12,   40,   50),
    "Structural steel": (200, 250, 400),
    "Titanium":     (116,  880,  950),
}

plt.figure(figsize=(10, 6))
for name, (E, yield_s, ult) in materials.items():
    # Elastic region: stress = E * strain
    strain_yield = yield_s / (E * 1000)  # convert GPa to MPa
    strains = np.linspace(0, strain_yield * 1.8, 200)
    stresses = np.minimum(E * 1000 * strains, ult)
    # Cap at yield then gradual rise to ultimate
    elastic = strains <= strain_yield
    stresses[~elastic] = yield_s + (ult - yield_s) * (
        (strains[~elastic] - strain_yield) / (strain_yield * 0.8))
    stresses = np.minimum(stresses, ult)

    plt.plot(strains * 100, stresses, linewidth=2, label=f'{name} (E={E} GPa)')

plt.xlabel('Strain (%)', fontsize=12)
plt.ylabel('Stress (MPa)', fontsize=12)
plt.title('Stress-Strain Curves: Why Material Choice Matters', fontsize=13)
plt.legend(fontsize=9)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()

print("Steeper curve = stiffer material (higher Young's modulus)")
print("Higher plateau = stronger material (higher yield stress)")
print("Mud brick fails at 2 MPa. Steel survives 250 MPa.")
print("That is a 125x difference — the gap between Babel and Burj Khalifa.")`,
      challenge: 'Add carbon fibre (E=230 GPa, yield=3500 MPa, ultimate=3500 MPa). It has a higher Young\u2019s modulus than steel AND much higher yield stress. Why is it not used for buildings? (Hint: cost and brittleness.)',
      successHint: 'Stress-strain curves are the fingerprint of every material. One chart tells you stiffness (slope), strength (height), and ductility (width). Every structural engineer reads these before designing anything.',
    },
    {
      title: 'Moment of inertia \u2014 shape matters more than mass',
      concept: `Here is a surprising fact: a hollow steel tube can be **stronger** than a solid steel bar of the same weight. How? Because in bending and buckling, what matters is not just how much material you have, but **where** you put it.

The **moment of inertia (I)** measures how spread out the cross-section is. For a solid circle: I = \u03C0d\u2074/64. For a hollow tube: I = \u03C0(d_outer\u2074 \u2212 d_inner\u2074)/64. Moving material away from the centre increases I dramatically.

This is why I-beams (the classic \u2018H\u2019 shape) are used in construction. The wide flanges at top and bottom place material far from the neutral axis, maximising I. The thin web in the middle uses minimal material.

The code compares different cross-section shapes to find the most efficient.`,
      analogy: 'Hold a piece of paper flat and it flops. Now fold it into a V-shape (like a paper airplane wing) and it becomes rigid. You used the exact same amount of paper \u2014 but by moving material away from the centre, you increased the moment of inertia and made it resist bending.',
      storyConnection: 'The Babel builders used solid rectangular bricks \u2014 the least efficient shape for resisting bending. If they had used hollow tubes or T-shaped beams (impossible with mud brick, but possible with cut stone), the same amount of material could have supported a much taller tower.',
      checkQuestion: 'Why are bicycle frames made of hollow tubes, not solid rods?',
      checkAnswer: 'A solid rod and a hollow tube of the same weight: the tube has a larger diameter (material is further from centre), so it has a much higher moment of inertia. It resists bending better. The hollow core also saves weight without sacrificing stiffness. This is pure moment-of-inertia efficiency.',
      codeIntro: 'Compare the bending strength of different cross-section shapes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# All shapes use the same total area (same amount of material)
target_area = 0.01  # m² (100 cm²)

# 1. Solid circle
d_solid = np.sqrt(4 * target_area / np.pi)
I_solid = np.pi * d_solid**4 / 64

# 2. Hollow tube (outer diameter 2x solid, calculated inner)
d_outer = d_solid * 2
d_inner = np.sqrt(d_outer**2 - 4 * target_area / np.pi)
I_tube = np.pi * (d_outer**4 - d_inner**4) / 64

# 3. Square solid
side = np.sqrt(target_area)
I_square = side**4 / 12

# 4. I-beam approximation (flanges + web)
flange_w = 0.15    # m
flange_t = 0.02    # m
web_h = (target_area - 2 * flange_w * flange_t) / 0.008
web_t = 0.008
total_h = web_h + 2 * flange_t
# Parallel axis theorem for flanges
I_beam = (web_t * web_h**3 / 12 +
          2 * (flange_w * flange_t**3 / 12 +
               flange_w * flange_t * ((web_h + flange_t) / 2)**2))

shapes = ['Solid\\ncircle', 'Hollow\\ntube', 'Solid\\nsquare', 'I-beam']
I_values = [I_solid, I_tube, I_square, I_beam]
relative = [I / I_solid for I in I_values]

fig, ax = plt.subplots(figsize=(10, 5))
colors = ['#6b7280', '#60a5fa', '#f59e0b', '#22c55e']
bars = ax.bar(shapes, relative, color=colors, width=0.6)

for bar, val in zip(bars, relative):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
            f'{val:.1f}x', ha='center', fontsize=11, fontweight='bold', color='white')

ax.set_ylabel('Relative Moment of Inertia', fontsize=12)
ax.set_title('Same Material, Different Shape = Different Strength', fontsize=13)
ax.axhline(1, color='white', linewidth=0.5, linestyle=':', alpha=0.3)
ax.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.show()

print(f"All shapes use {target_area*1e4:.0f} cm² of material.")
print(f"Solid circle I = {I_solid:.6f} m⁴ (baseline)")
print(f"Hollow tube  I = {I_tube:.6f} m⁴ ({I_tube/I_solid:.1f}x better!)")
print(f"I-beam       I = {I_beam:.6f} m⁴ ({I_beam/I_solid:.1f}x better!)")
print()
print("Moving material AWAY from the centre is the key.")
print("This is why modern buildings use I-beams, not solid blocks.")`,
      challenge: 'Experiment with the hollow tube dimensions: try d_outer = d_solid * 3 (thinner wall, wider tube). How does I change? At what point is the wall so thin it becomes impractical?',
      successHint: 'Moment of inertia is arguably the single most important concept in structural engineering. It is why birds have hollow bones, why bamboo is hollow, and why steel I-beams revolutionised construction.',
    },
    {
      title: 'Wind load analysis \u2014 the invisible enemy',
      concept: `The tallest buildings are not defeated by their own weight \u2014 they are defeated by **wind**. At 300+ metres, wind speed increases dramatically (no ground friction to slow it), and wind pressure grows with the **square** of velocity: P = \u00BD\u03C1v\u00B2.

At ground level, wind might be 10 m/s. At 500 m, it can reach 50 m/s. The pressure at 500 m is 25 times higher than at ground level (50\u00B2/10\u00B2 = 25).

Wind does not just push a building sideways \u2014 it creates **vortex shedding**: alternating low-pressure zones on each side that cause rhythmic swaying. If the sway frequency matches the building\u2019s natural frequency, **resonance** amplifies the motion until the structure fails.

The code models wind pressure at different heights and calculates the bending moment at the base.`,
      analogy: 'Stand in a strong wind and lean into it. Your feet stay planted but your upper body pushes forward. Now imagine being 800 metres tall \u2014 your head experiences wind 25 times stronger than your feet. That enormous difference in force between top and bottom is what tries to snap a skyscraper at its base.',
      storyConnection: 'Ancient Mesopotamia, where Babel was built, is a flat plain with no windbreaks. A 90-metre mud brick tower would face significant wind loading with no way to resist it \u2014 mud brick has almost zero tensile strength, and wind creates tension on the leeward side. The tower would crack and peel apart in a storm.',
      checkQuestion: 'The Taipei 101 tower has a 730-tonne steel ball hanging near the top (a tuned mass damper). Why?',
      checkAnswer: 'The ball swings in the opposite direction to wind-induced sway, cancelling out the motion. When wind pushes the building right, the ball swings left, absorbing the energy. This is tuned to the building\u2019s natural frequency so it specifically counteracts resonance. Without it, occupants on upper floors would feel nauseating sway during typhoons.',
      codeIntro: 'Calculate wind pressure and bending moment on a tower at every height.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Wind speed profile: v(h) = v_ref * (h / h_ref)^alpha
# Power law profile — wind increases with height
v_ref = 15        # m/s at reference height
h_ref = 10        # metres (standard measurement)
alpha = 0.2       # terrain roughness exponent (city)
rho = 1.225       # air density (kg/m³)

# Building parameters
H = 500           # total height (m)
width = 50        # building width (m)
heights = np.linspace(1, H, 200)

# Wind speed at each height
v = v_ref * (heights / h_ref) ** alpha

# Dynamic wind pressure: P = 0.5 * rho * v^2
pressure = 0.5 * rho * v**2

# Force per metre of height = pressure × width
force_per_m = pressure * width

# Total overturning moment at base
# M = integral of (force_per_m × height) from 0 to H
moment_cumulative = np.cumsum(force_per_m * heights * (heights[1] - heights[0]))

fig, axes = plt.subplots(1, 3, figsize=(14, 6))

# Wind speed profile
axes[0].plot(v, heights, linewidth=2.5, color='#60a5fa')
axes[0].set_xlabel('Wind Speed (m/s)', fontsize=11)
axes[0].set_ylabel('Height (m)', fontsize=11)
axes[0].set_title('Wind Speed vs Height', fontsize=12)
axes[0].grid(alpha=0.3)

# Pressure profile
axes[1].plot(pressure, heights, linewidth=2.5, color='#ef4444')
axes[1].fill_betweenx(heights, 0, pressure, alpha=0.15, color='#ef4444')
axes[1].set_xlabel('Pressure (Pa)', fontsize=11)
axes[1].set_title('Wind Pressure (= \u00BDρv²)', fontsize=12)
axes[1].grid(alpha=0.3)

# Bending moment
axes[2].plot(moment_cumulative / 1e6, heights, linewidth=2.5, color='#fbbf24')
axes[2].set_xlabel('Cumulative Moment (MN·m)', fontsize=11)
axes[2].set_title('Overturning Moment', fontsize=12)
axes[2].grid(alpha=0.3)

plt.suptitle(f'{H}m Tower Wind Analysis', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.show()

print(f"Wind at ground: {v[0]:.1f} m/s ({v[0]*3.6:.0f} km/h)")
print(f"Wind at {H}m: {v[-1]:.1f} m/s ({v[-1]*3.6:.0f} km/h)")
print(f"Pressure ratio (top/bottom): {pressure[-1]/pressure[0]:.1f}x")
print(f"Total overturning moment: {moment_cumulative[-1]/1e6:.0f} MN·m")`,
      challenge: 'Change alpha to 0.14 (open terrain like Mesopotamia). How does wind pressure change? Then try H = 828 (Burj Khalifa height). What overturning moment must its foundation resist?',
      successHint: 'Wind engineering is the primary challenge of supertall construction. Everything above 200 m is essentially a wind-resistance problem. The Burj Khalifa\u2019s Y-shape, tapered profile, and setbacks all exist to manage wind loads.',
    },
    {
      title: 'Foundation engineering \u2014 transferring load to earth',
      concept: `A skyscraper is only as strong as its **foundation**. The Burj Khalifa weighs 500,000 tonnes. All that weight must pass through the foundation into bedrock without the ground sinking or shifting.

Two main foundation types:
- **Shallow foundations** (spread footings): spread the load over a wide area of soil. Used for lighter buildings.
- **Deep foundations** (piles): long columns driven or drilled into bedrock. Used for heavy buildings or soft soil.

The Burj Khalifa uses 194 piles, each 1.5 m in diameter and 43 m long, driven through sand into a layer of rock. The total pile area distributes the 500,000-tonne load so that no point experiences more than the soil\u2019s bearing capacity.

The code calculates required foundation sizes for different building weights and soil types.`,
      analogy: 'Stand on soft sand in regular shoes \u2014 you sink. Put on snowshoes (wide base) \u2014 you stay on top. A shallow foundation is a snowshoe for a building. Piles are like stilts that reach down through soft layers to stand on hard ground underneath.',
      storyConnection: 'Ancient Mesopotamia sits on alluvial clay from the Tigris and Euphrates rivers. Clay has a low bearing capacity (75\u2013150 kPa). A massive tower on this soil without deep foundations would slowly sink, tilt, and collapse \u2014 exactly what happened to many ziggurats over the centuries.',
      checkQuestion: 'The Leaning Tower of Pisa tilts because one side of its foundation sits on softer soil. Why was it not simply rebuilt on better ground?',
      checkAnswer: 'By the time the tilt was noticed (during construction of the third floor in 1178), the lower floors had already settled into the soil. Rebuilding was impossible. Instead, engineers spent 800 years trying to stabilise it \u2014 most recently by removing soil from under the high side (1990\u20132001), reducing the tilt from 5.5\u00B0 to 3.97\u00B0. The lean is now stable for at least 200 more years.',
      codeIntro: 'Calculate foundation requirements for buildings of different sizes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Soil bearing capacities (kPa)
soils = {
    "Soft clay (Mesopotamia)": 75,
    "Stiff clay": 200,
    "Dense sand": 400,
    "Gravel": 600,
    "Soft rock": 1500,
    "Hard rock (granite)": 10000,
}

# Building weights (tonnes)
buildings = {
    "Tower of Babel (est.)": 200000,
    "Great Pyramid":         6000000,
    "Empire State":          365000,
    "Burj Khalifa":          500000,
}

print("Required Foundation Area (m²)")
print("=" * 65)
print(f"{'Building':<25s}", end="")
for soil in soils:
    print(f" {soil[:8]:>10s}", end="")
print()

for bldg, weight_tonnes in buildings.items():
    weight_kn = weight_tonnes * 9.8  # kN
    print(f"{bldg:<25s}", end="")
    for soil, capacity in soils.items():
        area = weight_kn / capacity
        print(f" {area:>10,.0f}", end="")
    print()

print()
# Pile calculation for Burj Khalifa
n_piles = 194
pile_d = 1.5      # diameter (m)
pile_l = 43       # length (m)
pile_area = np.pi * (pile_d/2)**2
skin_friction = 120   # kPa (average along pile)
end_bearing = 5000    # kPa (rock at tip)

capacity_per_pile = (skin_friction * np.pi * pile_d * pile_l +
                     end_bearing * pile_area) / 1000  # tonnes

print(f"Burj Khalifa pile capacity:")
print(f"  {n_piles} piles × {capacity_per_pile:.0f} tonnes each")
print(f"  Total capacity: {n_piles * capacity_per_pile:,.0f} tonnes")
print(f"  Building weight: 500,000 tonnes")
print(f"  Safety factor: {n_piles * capacity_per_pile / 500000:.1f}x")`,
      challenge: 'The Tower of Babel site is soft Mesopotamian clay (75 kPa). Calculate the minimum foundation area needed. If the tower base is 91 m \u00D7 91 m = 8,281 m\u00B2, is that enough? What does this tell you about the feasibility of the biblical structure?',
      successHint: 'Foundations are the hidden half of engineering. We admire the tower, but it is the foundation that makes it possible. Every record-breaking skyscraper starts with record-breaking foundations.',
    },
    {
      title: 'Phonology \u2014 the physics of speech sounds',
      concept: `When God confused the languages at Babel, what actually changed? Linguists would say: the **phonemes** \u2014 the basic sound units of language.

Every language uses a small set of sounds (phonemes) from a much larger set of possible human sounds. English uses about 44 phonemes. Hawaiian uses 13. !X\u00F3\u00F5 (a Khoisan language) uses over 140, including click consonants.

Phonemes are produced by precise control of the **vocal tract**: the tongue, lips, teeth, palate, and larynx. A tiny change in tongue position can flip one phoneme into another ("bat" vs "bet" \u2014 tongue height changes by millimetres).

The code analyses the phonemic inventories of languages and plots their distribution.`,
      analogy: 'Think of phonemes as the alphabet of sound. English has 26 letters but 44 phonemes (some letters make multiple sounds: "c" in "cat" vs "city"). Each language picks a different subset of sounds from the full human repertoire \u2014 like different card games using different subsets from the same deck.',
      storyConnection: 'At Babel, the sudden inability to communicate would feel like everyone switching to different phoneme sets overnight. In reality, sound changes happen gradually \u2014 the Great Vowel Shift in English took 300 years (1400\u20131700) and completely changed how vowels sounded, turning Middle English into something unrecognisable.',
      checkQuestion: 'Japanese has no "L" phoneme, and English speakers struggle with the Hindi retroflex "T". Why is it hard for adults to learn foreign phonemes?',
      checkAnswer: 'During the first year of life, babies can distinguish all human phonemes. But by age 12 months, the brain prunes unused phoneme categories, strengthening the ones heard in the native language. Adult learners must reactivate these pruned categories, which requires extensive practice. This is called perceptual narrowing \u2014 the brain optimises for its environment at the cost of flexibility.',
      codeIntro: 'Analyse phoneme inventories across the world\u2019s languages.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Phoneme counts for selected languages
# (consonants, vowels, total phonemes)
languages = {
    "Hawaiian":    (8,  5, 13),
    "Japanese":    (15, 5, 20),
    "Spanish":     (19, 5, 24),
    "Mandarin":    (21, 9, 35),  # including tones
    "English":     (24, 20, 44),
    "Hindi":       (33, 11, 44),
    "German":      (25, 17, 42),
    "Arabic":      (28, 6, 34),
    "Georgian":    (28, 5, 33),
    "!Xoo":        (83, 58, 141),
}

names = list(languages.keys())
consonants = [v[0] for v in languages.values()]
vowels = [v[1] for v in languages.values()]
totals = [v[2] for v in languages.values()]

fig, ax = plt.subplots(figsize=(12, 5))
x = np.arange(len(names))
ax.bar(x, consonants, 0.4, label='Consonants', color='#60a5fa')
ax.bar(x, vowels, 0.4, bottom=consonants, label='Vowels', color='#f472b6')

ax.set_xticks(x)
ax.set_xticklabels(names, rotation=30, ha='right', fontsize=10)
ax.set_ylabel('Number of Phonemes', fontsize=12)
ax.set_title('Phoneme Inventories of World Languages', fontsize=13)
ax.legend(fontsize=10)
ax.grid(axis='y', alpha=0.3)

for i, t in enumerate(totals):
    ax.text(i, t + 2, str(t), ha='center', fontsize=9, color='white')

plt.tight_layout()
plt.show()

print(f"Average phonemes across languages: {np.mean(totals):.0f}")
print(f"Range: {min(totals)} (Hawaiian) to {max(totals)} (!Xoo)")
print()
print("Most languages cluster around 20-45 phonemes.")
print("!Xoo is an outlier with click consonants.")
print("Hawaiian is minimalist — just 13 sounds build every word.")`,
      challenge: 'If English has 44 phonemes, how many possible 3-phoneme syllables exist? (44\u00B3 = 85,184). How many does English actually use? Research this and add a print statement with the answer.',
      successHint: 'Phonology is the bridge between the physics of sound and the structure of language. Every word you speak is a precise sequence of articulatory gestures, each producing a specific phoneme. Babel scattered these gestures into thousands of different systems.',
    },
    {
      title: 'Building a simple translator with Python dictionaries',
      concept: `Let us now build the simplest possible translation system: a **dictionary-based translator**. It maps words one-to-one from one language to another.

This approach is extremely limited \u2014 it cannot handle word order changes, grammar differences, or words with multiple meanings. But it demonstrates the core challenge: translation is not just swapping words, it is mapping **meaning** between systems with different structures.

The code builds an English\u2192French dictionary translator and shows exactly where it breaks down. This motivates the need for statistical and neural translation systems that understand context.`,
      analogy: 'A dictionary translator is like a tourist with a phrasebook. It works for simple sentences ("Where is the bathroom?") but fails hilariously for anything complex ("Time flies like an arrow; fruit flies like a banana"). Real understanding requires knowing how words relate to each other in context.',
      storyConnection: 'If the Babel workers suddenly spoke different languages, the first instinct would be to point at things and build a word list \u2014 exactly what a dictionary translator does. But word lists cannot capture grammar, idioms, or nuance. The confusion would persist long after basic vocabulary was shared.',
      checkQuestion: 'Why can "bank" mean a financial institution OR the side of a river? How would a translator handle this?',
      checkAnswer: 'These are called homonyms \u2014 words spelled and pronounced the same but with different meanings. A dictionary translator picks one meaning and uses it everywhere, producing errors. A context-aware system (like a transformer) looks at surrounding words: "money in the bank" vs "sitting on the river bank" and picks the correct translation. This is why context is everything in NLP.',
      codeIntro: 'Build a dictionary-based translator and see where it fails.',
      code: `# Simple English -> French dictionary translator
dictionary = {
    "the": "le", "a": "un", "is": "est", "are": "sont",
    "cat": "chat", "dog": "chien", "bird": "oiseau",
    "big": "grand", "small": "petit", "red": "rouge",
    "sits": "est_assis", "runs": "court", "flies": "vole",
    "on": "sur", "in": "dans", "under": "sous",
    "mat": "tapis", "table": "table", "house": "maison",
    "time": "temps", "bank": "banque", "light": "lumiere",
    "I": "je", "you": "tu", "he": "il", "she": "elle",
    "love": "aime", "see": "vois", "eat": "mange",
}

def translate(sentence):
    words = sentence.lower().replace(".", "").replace(",", "").split()
    translated = []
    unknown = []
    for w in words:
        if w in dictionary:
            translated.append(dictionary[w])
        else:
            translated.append(f"[{w}?]")
            unknown.append(w)
    return " ".join(translated), unknown

# Test sentences
tests = [
    "The cat sits on the mat",
    "The big red dog runs",
    "I love you",
    "Time flies like a bird",
    "She sits on the bank",
    "I see the light in the house",
    "The cat and the dog are friends",
]

print("Dictionary Translator: English -> French")
print("=" * 55)
for sentence in tests:
    result, unknown = translate(sentence)
    print(f"  EN: {sentence}")
    print(f"  FR: {result}")
    if unknown:
        print(f"  ?? Unknown words: {unknown}")
    print()

print("PROBLEMS with dictionary translation:")
print("1. 'Time flies like a bird' -> literal nonsense")
print("   (it is an idiom about time passing quickly)")
print("2. 'bank' always maps to 'banque' (financial)")
print("   even when it means riverbank ('berge')")
print("3. No grammar: French adjectives go AFTER nouns")
print("   'big red dog' should be 'chien grand rouge'")
print("4. Unknown words are simply skipped")`,
      challenge: 'Add 10 more words to the dictionary. Then try translating "the bird flies under the big table" \u2014 does the word order need to change for correct French? Add a rule that swaps adjective-noun order.',
      successHint: 'Dictionary translation shows exactly why NLP is hard. Language is not just vocabulary \u2014 it is structure, context, culture, and ambiguity. Every improvement in machine translation has come from finding better ways to capture these layers of meaning.',
    },
  ];

  return (
    <div className="space-y-8">
      {loading && (
        <div className="flex items-center gap-3 bg-amber-500/10 text-amber-300 px-4 py-3 rounded-lg text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadProgress}
        </div>
      )}
      {miniLessons.map((lesson, i) => (
        <MiniLesson
          key={i}
          id={`babel-l2-${i + 1}`}
          number={i + 1}
          title={lesson.title}
          concept={lesson.concept}
          analogy={lesson.analogy}
          storyConnection={lesson.storyConnection}
          checkQuestion={lesson.checkQuestion}
          checkAnswer={lesson.checkAnswer}
          diagram={i === 0 ? createElement(BabelForcesDiagram) : i === 2 ? createElement(BabelSkyscraperDiagram) : i === 5 ? createElement(BabelNLPDiagram) : undefined}
          code={lesson.code}
          codeIntro={lesson.codeIntro}
          challenge={lesson.challenge}
          successHint={lesson.successHint}
          pyodideRef={pyodideRef}
          onLoadPyodide={loadPyodide}
          pyReady={pyReady}
        />
      ))}
    </div>
  );
}
