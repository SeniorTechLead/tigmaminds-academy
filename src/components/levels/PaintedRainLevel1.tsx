import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function PaintedRainLevel1() {
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
      title: 'What is color? — Light, wavelengths, and perception',
      concept: `When the girl in the story painted rain falling over the Brahmaputra, she wasn't just capturing water — she was capturing **light**. Color is not a property of objects. It's a property of the light that reaches your eyes.

**Visible light** is electromagnetic radiation with wavelengths between roughly 380 nm (violet) and 700 nm (red). When white sunlight hits an object, the object absorbs some wavelengths and reflects others. The reflected wavelengths are what you see as "color."

Key facts:
- **White** light contains all visible wavelengths mixed together
- A red flower absorbs blue and green light, reflects red
- A green leaf absorbs red and blue, reflects green
- A black object absorbs almost all wavelengths
- A white object reflects almost all wavelengths

Isaac Newton proved this in 1666 by splitting white sunlight through a prism into a rainbow of colors — and then recombining them back into white.`,
      analogy: 'Color is like a musical chord. White light is every note played at once. A prism separates them into individual notes (wavelengths). A red object is like a filter that blocks every note except one — you hear (see) only the red.',
      storyConnection: 'The girl painted rain, and rain scatters sunlight into all its component colors — that is literally what a rainbow is. Her monsoon paintings captured the full spectrum of light bouncing off water droplets, mud, green fields, and gray skies. Each color in her palette was a different wavelength of light reflected into her eyes.',
      checkQuestion: 'Why do objects look different colors under different lighting? A shirt that looks blue in sunlight might look purple under a warm incandescent bulb.',
      checkAnswer: 'Sunlight contains all wavelengths roughly equally. An incandescent bulb emits more red/yellow wavelengths and fewer blue ones. The blue shirt reflects blue light — but if the light source provides very little blue, there is less blue to reflect. The excess red from the bulb mixes with the reduced blue, and you perceive purple.',
      codeIntro: 'Visualize the visible light spectrum and how wavelength maps to color.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Approximate wavelength-to-RGB mapping for visible spectrum
def wavelength_to_rgb(wavelength):
    """Convert wavelength (380-700 nm) to RGB tuple (0-1)."""
    if 380 <= wavelength < 440:
        r = -(wavelength - 440) / (440 - 380)
        g = 0.0
        b = 1.0
    elif 440 <= wavelength < 490:
        r = 0.0
        g = (wavelength - 440) / (490 - 440)
        b = 1.0
    elif 490 <= wavelength < 510:
        r = 0.0
        g = 1.0
        b = -(wavelength - 510) / (510 - 490)
    elif 510 <= wavelength < 580:
        r = (wavelength - 510) / (580 - 510)
        g = 1.0
        b = 0.0
    elif 580 <= wavelength < 645:
        r = 1.0
        g = -(wavelength - 645) / (645 - 580)
        b = 0.0
    elif 645 <= wavelength <= 700:
        r = 1.0
        g = 0.0
        b = 0.0
    else:
        r = g = b = 0.0
    # Intensity falls off at edges
    if 380 <= wavelength < 420:
        factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380)
    elif 420 <= wavelength <= 680:
        factor = 1.0
    elif 680 < wavelength <= 700:
        factor = 0.3 + 0.7 * (700 - wavelength) / (700 - 680)
    else:
        factor = 0.0
    return (r * factor, g * factor, b * factor)

wavelengths = np.arange(380, 701)
colors = [wavelength_to_rgb(w) for w in wavelengths]

fig, ax = plt.subplots(figsize=(12, 3))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

for i, (w, c) in enumerate(zip(wavelengths, colors)):
    ax.axvline(w, color=c, linewidth=2)

ax.set_xlim(380, 700)
ax.set_xlabel('Wavelength (nm)', color='white', fontsize=11)
ax.set_title('The Visible Light Spectrum', color='white', fontsize=13)
ax.tick_params(colors='gray')

# Label regions
labels = [(400, 'Violet'), (450, 'Blue'), (500, 'Cyan'), (530, 'Green'),
          (570, 'Yellow'), (610, 'Orange'), (660, 'Red')]
for pos, name in labels:
    ax.annotate(name, xy=(pos, 0.85), xycoords=('data', 'axes fraction'),
                color='white', fontsize=8, ha='center', fontweight='bold',
                bbox=dict(boxstyle='round,pad=0.2', facecolor='black', alpha=0.5))

plt.tight_layout()
plt.show()

print("Visible spectrum: 380 nm (violet) to 700 nm (red)")
print("Below 380 nm: ultraviolet (UV) - invisible to humans")
print("Above 700 nm: infrared (IR) - invisible to humans")
print()
print("Each 'color' is a narrow band of wavelengths.")
print("White light = all these wavelengths mixed together.")`,
      challenge: 'Bees can see ultraviolet (down to ~300 nm) but cannot see red (above ~590 nm). Extend the spectrum to 300 nm and cut it off at 590 nm to show what a bee sees.',
      successHint: 'Color is physics. What your eye calls "red" is really electromagnetic radiation at 620-700 nm. Understanding this is the first step to understanding pigments, painting, screens, and cameras.',
    },
    {
      title: 'Primary colors — the great confusion between light and pigment',
      concept: `Ask anyone: "What are the primary colors?" Most will say red, yellow, blue. They're wrong — or rather, they're only half right.

There are **two completely different systems** of primary colors:

**Additive primaries (light):** Red, Green, Blue (RGB)
- Used by: screens, projectors, sunlight
- Mixing: Red + Green = Yellow, Red + Blue = Magenta, Green + Blue = Cyan
- All three together = **White**

**Subtractive primaries (pigment):** Cyan, Magenta, Yellow (CMY)
- Used by: paints, inks, dyes, printers
- Mixing: Cyan + Magenta = Blue, Cyan + Yellow = Green, Magenta + Yellow = Red
- All three together = **Black** (in theory; in practice, muddy brown — so printers add a K for blacK → CMYK)

The traditional "red, yellow, blue" taught in elementary school is an imprecise version of CMY. It works roughly, but it can't produce as many colors as true CMY primaries.`,
      analogy: 'Light primaries ADD wavelengths together (additive — start from darkness, add colors to get white). Pigment primaries SUBTRACT wavelengths from white light (subtractive — start from white paper, remove colors to get black). They are mirror images of each other.',
      storyConnection: 'The girl who painted rain used pigments on paper — subtractive color mixing. Every stroke absorbed certain wavelengths and reflected others. When she mixed all her paints together trying to make the perfect gray of monsoon clouds, she got muddy brown — because real pigments aren\'t perfect subtractive filters.',
      checkQuestion: 'Your phone screen shows yellow by mixing red and green pixels. There are no yellow LEDs in the screen. How does red + green = yellow in light, when mixing red and green paint gives brown?',
      checkAnswer: 'In light (additive), red photons + green photons stimulate both the red and green cone cells in your eye. Your brain interprets that combined signal as yellow. In paint (subtractive), red pigment absorbs blue and green; green pigment absorbs red and blue. Together they absorb almost everything — leaving very little reflected light, which looks brown/dark.',
      codeIntro: 'Visualize additive and subtractive color mixing side by side.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Additive color mixing (light: RGB)
ax1.set_facecolor('#000000')  # Start from black
theta = np.linspace(0, 2*np.pi, 100)

# Three overlapping circles
centers = [(0, 0.4), (-0.35, -0.2), (0.35, -0.2)]
colors_rgb = [(1, 0, 0, 0.5), (0, 1, 0, 0.5), (0, 0, 1, 0.5)]
labels_rgb = ['Red', 'Green', 'Blue']

for (cx, cy), color, label in zip(centers, colors_rgb, labels_rgb):
    circle = plt.Circle((cx, cy), 0.55, color=color[:3], alpha=0.5)
    ax1.add_patch(circle)
    ax1.annotate(label, xy=(cx*1.6, cy*1.6), color='white', fontsize=10,
                 ha='center', fontweight='bold')

# Label overlaps
ax1.annotate('Yellow', xy=(0, 0.7), color='#ffff00', fontsize=8, ha='center')
ax1.annotate('Cyan', xy=(-0.1, -0.35), color='#00ffff', fontsize=8, ha='center')
ax1.annotate('Magenta', xy=(0.15, -0.35), color='#ff00ff', fontsize=8, ha='center')
ax1.annotate('WHITE', xy=(0, 0.05), color='white', fontsize=9, ha='center', fontweight='bold')

ax1.set_xlim(-1.2, 1.2)
ax1.set_ylim(-1, 1.2)
ax1.set_aspect('equal')
ax1.set_title('Additive (Light): RGB', color='white', fontsize=13)
ax1.axis('off')

# Subtractive color mixing (pigment: CMY)
ax2.set_facecolor('#ffffff')  # Start from white

centers2 = [(0, 0.4), (-0.35, -0.2), (0.35, -0.2)]
colors_cmy = [(0, 1, 1, 0.5), (1, 0, 1, 0.5), (1, 1, 0, 0.5)]
labels_cmy = ['Cyan', 'Magenta', 'Yellow']

for (cx, cy), color, label in zip(centers2, colors_cmy, labels_cmy):
    circle = plt.Circle((cx, cy), 0.55, color=color[:3], alpha=0.5)
    ax2.add_patch(circle)
    ax2.annotate(label, xy=(cx*1.6, cy*1.6), color='black', fontsize=10,
                 ha='center', fontweight='bold')

ax2.annotate('Blue', xy=(0, 0.7), color='#000088', fontsize=8, ha='center')
ax2.annotate('Green', xy=(-0.15, -0.35), color='#006600', fontsize=8, ha='center')
ax2.annotate('Red', xy=(0.15, -0.35), color='#880000', fontsize=8, ha='center')
ax2.annotate('BLACK', xy=(0, 0.05), color='black', fontsize=9, ha='center', fontweight='bold')

ax2.set_xlim(-1.2, 1.2)
ax2.set_ylim(-1, 1.2)
ax2.set_aspect('equal')
ax2.set_title('Subtractive (Pigment): CMY', color='black', fontsize=13)
ax2.axis('off')

plt.tight_layout()
plt.show()

print("ADDITIVE (light, screens):")
print("  R + G = Yellow    R + B = Magenta    G + B = Cyan")
print("  R + G + B = White")
print()
print("SUBTRACTIVE (pigment, paint):")
print("  C + M = Blue    C + Y = Green    M + Y = Red")
print("  C + M + Y = Black (ideally)")`,
      challenge: 'A stage light technician has only red, green, and blue spotlights. How would they create cyan light? What about orange? Modify the additive mixing to explore.',
      successHint: 'Once you understand additive vs. subtractive mixing, you understand why your screen has RGB pixels, your printer has CMYK cartridges, and why mixing all your paints together never makes white.',
    },
    {
      title: 'Pigment chemistry — what makes a color stick',
      concept: `A **pigment** is a substance that absorbs specific wavelengths of light and reflects the rest. Unlike dyes (which dissolve), pigments are tiny solid particles that are suspended in a medium (oil, water, egg, acrylic).

How pigments work at the molecular level:
- Pigment molecules have **conjugated double bonds** — alternating single and double bonds between carbon atoms
- These conjugated systems have electrons that can absorb photons of specific energies (wavelengths)
- The more conjugated bonds, the longer the wavelength absorbed (shifting from UV toward visible light)

Famous pigments and their chemistry:
- **Ultramarine blue**: ground lapis lazuli (sulfur-containing aluminosilicate)
- **Vermillion**: mercury sulfide (HgS) — brilliant red, but toxic
- **Chrome yellow**: lead chromate (PbCrO₄) — used by Van Gogh, also toxic
- **Ochre**: iron oxide (Fe₂O₃) — the oldest pigment, used in cave paintings 40,000+ years ago
- **Indigo**: from the indigo plant — Assam was historically one of the world's largest indigo producers`,
      analogy: 'A pigment molecule is like a bouncer at a club. It lets certain wavelengths (people) pass through or bounce off, but grabs and absorbs others. Which wavelengths get absorbed depends on the molecule\'s electron structure — its "rules list." Change the molecule, change the rules, change the color.',
      storyConnection: 'The girl who painted rain didn\'t use synthetic paints from a store. She ground her own pigments from earth and plants — ochre from riverbank clay, indigo from local plants, turmeric yellow from the kitchen. These are the same pigments that have colored Assamese textiles and art for centuries.',
      checkQuestion: 'Cave paintings from 40,000 years ago still show vibrant colors. Modern watercolors fade in decades. Why do ancient pigments last longer?',
      checkAnswer: 'Ancient pigments are inorganic minerals (iron oxide, manganese oxide, carbon black). They are chemically stable — heat, light, and water barely affect them. Modern organic dyes have complex molecular structures that break down under UV light (photodegradation). The simpler the molecule, the more stable the color.',
      codeIntro: 'Model how conjugated bond length affects the wavelength of light absorbed by a pigment.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Particle-in-a-box model for conjugated systems
# Absorbed wavelength ~ L^2 (box length, proportional to conjugation length)
# lambda = 8 * m * L^2 / (h * (2n+1)) simplified

# Number of conjugated double bonds
n_bonds = np.arange(2, 15)

# Approximate absorption wavelength (nm) using particle-in-a-box
# Each conjugated bond adds ~0.139 nm to the box length
bond_length = 0.139e-9  # meters
h = 6.626e-34  # Planck's constant
m = 9.109e-31  # electron mass

wavelengths = []
for n in n_bonds:
    L = n * bond_length * 2  # approximate box length
    n_electrons = 2 * n  # 2 pi electrons per double bond
    # Transition from HOMO to LUMO
    lam = 8 * m * L**2 / (h * (2 * n_electrons + 1))
    lam_nm = lam * 1e9 * 2e17  # scale to realistic nm range
    wavelengths.append(lam_nm)

# Use realistic approximate values instead
wavelengths_approx = [200, 230, 270, 310, 360, 410, 450, 490, 530, 570, 610, 640, 670]

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Color each point by what color it absorbs
def wavelength_to_rgb(w):
    if w < 380: return (0.5, 0.0, 0.5)
    elif w < 440: return (0.5 - 0.5*(w-380)/60, 0.0, 1.0)
    elif w < 490: return (0.0, (w-440)/50, 1.0)
    elif w < 510: return (0.0, 1.0, 1.0-(w-490)/20)
    elif w < 580: return ((w-510)/70, 1.0, 0.0)
    elif w < 645: return (1.0, 1.0-(w-580)/65, 0.0)
    elif w <= 700: return (1.0, 0.0, 0.0)
    else: return (0.5, 0.0, 0.0)

colors = [wavelength_to_rgb(w) for w in wavelengths_approx]

ax.scatter(n_bonds, wavelengths_approx, c=colors, s=120, zorder=5, edgecolors='white', linewidths=1)
ax.plot(n_bonds, wavelengths_approx, color='#9ca3af', linewidth=1, linestyle='--', alpha=0.5)

# Mark the visible region
ax.axhspan(380, 700, alpha=0.1, color='white', label='Visible range')
ax.axhline(380, color='#a855f7', linestyle=':', linewidth=1, alpha=0.5)
ax.axhline(700, color='#ef4444', linestyle=':', linewidth=1, alpha=0.5)

# Annotate some examples
examples = [(3, 'Ethylene\\n(UV, colorless)'), (7, 'Beta-carotene\\n(absorbs blue, looks orange)'),
            (11, 'Chlorophyll\\n(absorbs red, looks green)')]
for n, label in examples:
    idx = n - 2
    ax.annotate(label, xy=(n, wavelengths_approx[idx]),
                xytext=(n + 0.8, wavelengths_approx[idx] + 40),
                color='white', fontsize=9,
                arrowprops=dict(arrowstyle='->', color='white', lw=0.8))

ax.set_xlabel('Number of conjugated double bonds', color='white', fontsize=11)
ax.set_ylabel('Approximate absorption wavelength (nm)', color='white', fontsize=11)
ax.set_title('More Conjugation = Longer Wavelength Absorbed', color='white', fontsize=13)
ax.tick_params(colors='gray')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

plt.tight_layout()
plt.show()

print("Key insight: molecular structure determines color")
print("  2-3 bonds: absorbs UV (molecule appears colorless)")
print("  5-7 bonds: absorbs violet/blue (appears yellow/orange)")
print("  8-10 bonds: absorbs blue/green (appears red/purple)")
print("  11+ bonds: absorbs red (appears green/blue)")`,
      challenge: 'Beta-carotene (in carrots) has 11 conjugated double bonds and absorbs blue light, appearing orange. If you could add 3 more bonds, what color would it absorb and what color would it appear?',
      successHint: 'Pigment chemistry connects quantum physics to art. The color of every paint, dye, flower, and sunset depends on how electrons in molecules absorb light. Change the molecule, change the color.',
    },
    {
      title: 'Mixing colors — the math behind mud and masterpieces',
      concept: `When you mix two pigments, you don't get the "average" of their colors. Subtractive mixing is more complex because each pigment absorbs different wavelengths, and the mixture absorbs the **union** of what both absorb.

The **Kubelka-Munk theory** (1931) is the standard model for pigment mixing:
- Each pigment has an **absorption coefficient (K)** and a **scattering coefficient (S)** at each wavelength
- The ratio K/S determines the reflectance
- Mixing pigments at different concentrations changes K and S proportionally

Practical rules:
- **Complementary colors** (opposite on the color wheel) mixed together → gray/brown (they absorb almost everything)
- **Analogous colors** (neighbors on the wheel) mixed → a clean intermediate color
- **Tinting** (adding white) increases scattering → lighter, desaturated color
- **Shading** (adding black) increases absorption → darker color
- Every mix is **darker** than either parent — because you're always adding more absorption`,
      analogy: 'Mixing pigments is like wearing multiple pairs of sunglasses at once. Each pair blocks certain wavelengths. Wear red-blocking and blue-blocking glasses together, and you only see green. Three pairs → almost nothing gets through → darkness. Every added pigment removes more light.',
      storyConnection: 'The girl spent hours mixing pigments to match the exact gray-green of monsoon clouds over the Brahmaputra. This is the hardest color to mix — it requires balancing blue, yellow, and white with just a touch of red. Too much of any one pigment and the delicate balance tips into mud.',
      checkQuestion: 'Why is it nearly impossible to make a bright, vivid purple by mixing red and blue paint, but easy on a screen?',
      checkAnswer: 'Red paint absorbs blue and green. Blue paint absorbs red and green. Mixed, they both absorb green, and between them they absorb a lot of blue and red too — leaving very little light reflected. The result is a dull, dark purple. On a screen, red and blue pixels emit light simultaneously at full brightness — nothing is absorbed — giving vivid magenta/purple.',
      codeIntro: 'Simulate subtractive color mixing by modeling reflectance spectra.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.arange(380, 701)

# Simplified reflectance spectra for pigments (0 to 1)
def gaussian(x, center, width, height):
    return height * np.exp(-((x - center) ** 2) / (2 * width ** 2))

# Red pigment: reflects mostly red (600-700 nm)
red_refl = gaussian(wavelengths, 640, 40, 0.9) + 0.05

# Blue pigment: reflects mostly blue (430-490 nm)
blue_refl = gaussian(wavelengths, 460, 35, 0.85) + 0.05

# Yellow pigment: reflects green and red (500-700 nm)
yellow_refl = gaussian(wavelengths, 560, 60, 0.85) + gaussian(wavelengths, 620, 50, 0.6) + 0.05

# Subtractive mixing: multiply reflectances
red_blue_mix = red_refl * blue_refl
red_yellow_mix = red_refl * yellow_refl
blue_yellow_mix = blue_refl * yellow_refl

fig, axes = plt.subplots(2, 3, figsize=(14, 8))
fig.patch.set_facecolor('#1f2937')

def plot_spectrum(ax, wavelengths, spectrum, title, fill_color):
    ax.set_facecolor('#111827')
    ax.fill_between(wavelengths, spectrum, alpha=0.3, color=fill_color)
    ax.plot(wavelengths, spectrum, color=fill_color, linewidth=2)
    ax.set_ylim(0, 1)
    ax.set_title(title, color='white', fontsize=10)
    ax.tick_params(colors='gray')
    ax.set_xlabel('Wavelength (nm)', color='gray', fontsize=8)

plot_spectrum(axes[0, 0], wavelengths, red_refl, 'Red pigment', '#ef4444')
plot_spectrum(axes[0, 1], wavelengths, blue_refl, 'Blue pigment', '#3b82f6')
plot_spectrum(axes[0, 2], wavelengths, yellow_refl, 'Yellow pigment', '#eab308')
plot_spectrum(axes[1, 0], wavelengths, red_blue_mix, 'Red + Blue = Dark purple', '#7c3aed')
plot_spectrum(axes[1, 1], wavelengths, red_yellow_mix, 'Red + Yellow = Orange', '#f97316')
plot_spectrum(axes[1, 2], wavelengths, blue_yellow_mix, 'Blue + Yellow = Green', '#22c55e')

plt.suptitle('Subtractive Color Mixing: Reflectance Spectra', color='white', fontsize=14, y=1.02)
plt.tight_layout()
plt.show()

print("Subtractive mixing = multiply reflectances")
print("  Red + Blue: both absorb green, little light left -> dark purple")
print("  Red + Yellow: overlap in orange region -> bright orange")
print("  Blue + Yellow: overlap in green region -> green")
print()
print("Notice: every mixture is DARKER than either parent.")
print("Subtractive mixing always removes light, never adds it.")`,
      challenge: 'Mix all three pigments (red * blue * yellow reflectance). What color do you get? Plot the result. This is why mixing all your paints makes brown/black.',
      successHint: 'Understanding reflectance spectra transforms color mixing from guesswork to science. Professional painters, textile designers, and cosmetics chemists all use spectral models to predict mixture colors.',
    },
    {
      title: 'Natural dyes of Assam — chemistry from the earth',
      concept: `Assam has one of the richest traditions of natural dyeing in the world. The Mishing, Bodo, and Karbi communities have used plant-based dyes for centuries on Muga, Eri, and Pat silk.

Major natural dyes of Assam and their chemistry:
- **Indigo** (from *Strobilanthes cusia*, locally called "rum"): the molecule contains two conjugated ring systems; fermentation converts the precursor (indican) into indigotin, a deep blue
- **Turmeric** (from *Curcuma longa*): curcumin absorbs blue light (420-430 nm), reflects yellow-orange; pH-sensitive — turns red in alkaline solutions
- **Lac** (from lac insects on trees): anthraquinone-based red dye, used on Muga silk
- **Iron rust** (from soaking iron in water): produces black/dark brown by forming iron tannate when combined with tannin-rich bark
- **Symplocos bark**: used as a mordant — it doesn't add color but helps other dyes bind to fabric

**Mordants** are metal salts (alum, iron, tin, chrome) that form a chemical bridge between the fiber and the dye molecule. Without a mordant, most natural dyes wash out. With one, they can last centuries.`,
      analogy: 'A mordant is like glue between a sticker (dye) and a surface (fiber). The sticker alone might peel off in the wash. The glue (mordant) chemically bonds both to the dye and to the fiber, making the color permanent. Different glues (mordants) also change the color — iron darkens, alum brightens, tin yellows.',
      storyConnection: 'The girl gathered her pigments from the land around her — riverbank clay for ochre, indigo leaves for blue, turmeric root for yellow. This is exactly how Assamese weavers have prepared dyes for generations. Her monsoon paintings were made with the same molecules that color Muga silk.',
      checkQuestion: 'If you dip turmeric-dyed cloth into soapy water (which is alkaline), it turns red. Why? And what happens when you rinse it in vinegar (acidic)?',
      checkAnswer: 'Curcumin is a pH indicator. In alkaline conditions (soap, pH > 8), the molecule changes shape — a proton is removed, altering the conjugated system and shifting absorption from blue to green. This makes it reflect red instead of yellow. In acid (vinegar, pH < 6), the proton returns, restoring the yellow color. It is a reversible chemical reaction.',
      codeIntro: 'Plot the absorption spectra of major Assamese natural dyes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.arange(380, 701)

def gaussian(x, center, width, height):
    return height * np.exp(-((x - center) ** 2) / (2 * width ** 2))

# Approximate absorption spectra of natural dyes
dyes = {
    'Indigo (rum plant)': {
        'absorption': gaussian(wavelengths, 610, 35, 0.9) + gaussian(wavelengths, 660, 30, 0.6),
        'color': '#1e40af',
        'reflects': 'blue',
    },
    'Turmeric (curcumin)': {
        'absorption': gaussian(wavelengths, 425, 30, 0.85) + gaussian(wavelengths, 460, 25, 0.5),
        'color': '#eab308',
        'reflects': 'yellow-orange',
    },
    'Lac dye (anthraquinone)': {
        'absorption': gaussian(wavelengths, 520, 35, 0.8) + gaussian(wavelengths, 490, 25, 0.5),
        'color': '#dc2626',
        'reflects': 'red',
    },
    'Iron tannate (black)': {
        'absorption': 0.7 + gaussian(wavelengths, 500, 100, 0.25),
        'color': '#374151',
        'reflects': 'very little (dark)',
    },
}

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('Natural Dyes of Assam: Absorption Spectra', color='white', fontsize=14)

for ax, (name, data) in zip(axes.flat, dyes.items()):
    ax.set_facecolor('#111827')
    absorption = np.clip(data['absorption'], 0, 1)
    reflectance = 1 - absorption

    ax.fill_between(wavelengths, absorption, alpha=0.4, color=data['color'])
    ax.plot(wavelengths, absorption, color=data['color'], linewidth=2, label='Absorption')
    ax.plot(wavelengths, reflectance, color='white', linewidth=1, linestyle='--', alpha=0.5, label='Reflectance')

    ax.set_title(name, color='white', fontsize=10)
    ax.set_ylim(0, 1.1)
    ax.set_xlabel('Wavelength (nm)', color='gray', fontsize=8)
    ax.tick_params(colors='gray')
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)

plt.tight_layout()
plt.show()

print("Natural dyes of Assam:")
print("  Indigo: absorbs red/orange -> appears deep blue")
print("  Turmeric: absorbs blue/violet -> appears yellow")
print("  Lac: absorbs green/blue -> appears red")
print("  Iron tannate: absorbs broadly -> appears black/dark brown")
print()
print("These dyes have colored Muga silk for over 1,000 years.")
print("The chemistry is the same as synthetic dyes —")
print("conjugated bonds absorbing specific wavelengths.")`,
      challenge: 'Turmeric changes color with pH. Model this: shift the absorption peak from 425 nm (yellow, pH 4) to 550 nm (red, pH 10). Plot both spectra on the same graph.',
      successHint: 'Natural dyes are applied chemistry that predates chemistry as a field. Assamese weavers were practicing spectral absorption and mordant chemistry centuries before scientists had names for these processes.',
    },
    {
      title: 'Color in culture — why red means different things in different places',
      concept: `Color is physics, but color **meaning** is culture. The same wavelength of light triggers completely different emotional and symbolic responses across civilizations.

In Assamese culture:
- **Red** (rongali): fertility, marriage, prosperity. Brides wear red *mekhela sadors*. The Rongali Bihu festival name literally means "colorful/joyful."
- **White** (boga): purity, mourning. Worn during Bohag Bihu prayers and funerals.
- **Gold/Yellow** (xonali): Muga silk's natural golden color represents Assam's identity. The word "Muga" comes from "muga" meaning amber-colored.
- **Indigo/Blue**: the working color — indigo-dyed cotton was everyday wear for farmers and weavers.

Contrast with other cultures:
- In China, red = luck and prosperity (same as Assam). White = death and mourning (same as Assam, opposite of Western).
- In the West, white = purity and weddings. Black = mourning. Red = danger or love.
- In Islam, green is sacred. In Hinduism, saffron orange is sacred.

These associations are learned, not innate. A newborn has no color associations — culture installs them.`,
      analogy: 'Color symbolism is like language. The sound "dog" means a four-legged animal in English, but nothing in Japanese. Similarly, the color red means "stop" on a traffic light, "love" on a Valentine card, and "good luck" at a Chinese New Year celebration. Same stimulus, different meaning — because meaning is assigned by culture, not physics.',
      storyConnection: 'The girl didn\'t just paint what she saw — she chose colors loaded with meaning. The vermillion red in her monsoon sky wasn\'t just a wavelength; it was rongali, the color of Bihu joy. The indigo in her clouds wasn\'t just absorbed orange; it was the color of Assamese working life. Her paintings spoke two languages: physics and culture.',
      checkQuestion: 'Why do most warning signs around the world use red and yellow, even in cultures where those colors have positive meanings?',
      checkAnswer: 'Biological constraints override cultural associations when survival is at stake. Red and yellow are the wavelengths our eyes detect most efficiently against green backgrounds (vegetation). Our primate ancestors evolved to spot ripe red fruit and yellow predators. This biological wiring for attention to red/yellow is universal, even though the cultural meanings vary.',
      codeIntro: 'Map color associations across cultures using a visualization.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Color associations across cultures
cultures = ['Assamese', 'Western', 'Chinese', 'Japanese', 'Islamic']
colors_list = ['Red', 'White', 'Black', 'Gold/Yellow', 'Green', 'Blue']

# Association matrix: -1 (negative), 0 (neutral), 1 (positive)
associations = np.array([
    # Red  White Black Gold Green Blue
    [ 1,    0,   -1,    1,    0,    0],  # Assamese
    [ 0,    1,   -1,    1,    0,    0],  # Western
    [ 1,   -1,    0,    1,    0,    0],  # Chinese
    [ 0,   -1,   -1,    1,    0,    1],  # Japanese
    [ 0,    1,   -1,    1,    1,    0],  # Islamic
])

fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Custom colormap: red for negative, gray for neutral, green for positive
from matplotlib.colors import LinearSegmentedColormap
cmap = LinearSegmentedColormap.from_list('custom', ['#ef4444', '#374151', '#22c55e'])

im = ax.imshow(associations, cmap=cmap, aspect='auto', vmin=-1, vmax=1)

ax.set_xticks(range(len(colors_list)))
ax.set_xticklabels(colors_list, color='white', fontsize=10, rotation=30, ha='right')
ax.set_yticks(range(len(cultures)))
ax.set_yticklabels(cultures, color='white', fontsize=10)

# Add text labels
labels = {1: 'Positive', 0: 'Neutral', -1: 'Negative'}
for i in range(len(cultures)):
    for j in range(len(colors_list)):
        val = associations[i, j]
        text_color = 'white' if val != 0 else 'gray'
        ax.text(j, i, labels[val], ha='center', va='center',
                color=text_color, fontsize=8, fontweight='bold')

ax.set_title('Color Symbolism Across Cultures', color='white', fontsize=13)

# Add colorbar
cbar = plt.colorbar(im, ax=ax, ticks=[-1, 0, 1])
cbar.ax.set_yticklabels(['Negative\\n(mourning,\\ndanger)', 'Neutral', 'Positive\\n(luck,\\npurity)'], color='white', fontsize=8)
cbar.ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Same color, different meaning:")
print("  Red: marriage joy (Assam) vs. danger (West) vs. luck (China)")
print("  White: mourning (Assam, China) vs. purity (West)")
print("  Gold: sacred across almost all cultures")
print()
print("Color physics is universal. Color meaning is cultural.")
print("A painter must understand both to communicate effectively.")`,
      challenge: 'Add a row for your own cultural background. What do the six colors mean to you? Are your associations more like Assamese or Western patterns?',
      successHint: 'From wavelengths to pigment chemistry to cultural symbolism — color sits at the intersection of physics, chemistry, biology, and anthropology. In Level 2, we move into digital color: RGB, color spaces, and programming with color.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior science experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for color science simulations. Click to start.</p>
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
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
