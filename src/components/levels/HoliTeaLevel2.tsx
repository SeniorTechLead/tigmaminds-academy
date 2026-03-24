import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function HoliTeaLevel2() {
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
      title: 'Molecular structure of dyes — why shape determines colour',
      concept: `In Level 1, we learned that objects have colour because their molecules absorb specific wavelengths. In Level 2, we ask: what molecular features determine which wavelengths are absorbed?

The answer lies in **electron delocalization**. When electrons can move freely across a large region of a molecule (rather than being stuck between two atoms), the energy gaps between electron states shrink. Smaller gaps mean lower-energy photons are absorbed — and lower-energy visible light means longer wavelengths (red end of the spectrum).

Key structural features of dye molecules:
- **Alternating single and double bonds** (conjugation): creates a pathway for electrons to delocalize
- **Aromatic rings** (benzene-like structures): provide planar regions for electron delocalization
- **Electron-donating groups** (NH2, OH): push electrons into the conjugated system
- **Electron-withdrawing groups** (NO2, COOH): pull electrons, extending delocalization

The more conjugation, the more delocalized the electrons, the longer the wavelength absorbed. A molecule with 4 conjugated double bonds absorbs UV (colourless). One with 8 conjugated double bonds absorbs blue (appears yellow). One with 11+ absorbs in the visible range and appears deeply coloured.

Beta-carotene (the orange pigment in carrots) has 11 conjugated double bonds — enough to absorb blue-green light and appear orange.`,
      analogy: 'Conjugation is like a guitar string. A short string (few conjugated bonds) vibrates at high frequency (absorbs high-energy UV light — no colour). A long string (many conjugated bonds) vibrates at low frequency (absorbs lower-energy visible light — has colour). Extending the string lowers the note. Extending conjugation shifts absorption toward red.',
      storyConnection: 'The tea garden Holi colours range from gentle yellows (short conjugation — turmeric has moderate conjugation) to deep reds and blues (long conjugation — indigo has extensive conjugation). The molecular "length" of the electron highway determines the colour. Nature builds these highways differently in each pigment.',
      checkQuestion: 'Lycopene (in tomatoes) has 11 conjugated double bonds and is red. Beta-carotene (in carrots) also has 11 conjugated double bonds but is orange. Why do they differ if conjugation length is the same?',
      checkAnswer: 'The shape of the conjugation pathway matters, not just its length. Lycopene is linear (all-trans), giving maximum delocalization. Beta-carotene has ring structures at both ends that partially disrupt the planarity, reducing effective conjugation slightly. This shifts its absorption to shorter wavelengths (from red to orange). Geometry matters as much as length.',
      codeIntro: 'Model how conjugation length shifts the absorption wavelength.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Particle in a box model for conjugated systems
# Energy levels: E_n = n^2 * h^2 / (8 * m * L^2)
# Absorption wavelength for HOMO->LUMO transition

h = 6.626e-34    # Planck's constant
m = 9.109e-31    # electron mass
c = 3e8           # speed of light
bond_length = 1.4e-10  # average C-C bond in conjugation (meters)

# Number of conjugated double bonds
n_bonds = np.arange(2, 15)
# Box length = number of bonds * bond length * 2 (each double bond spans ~2 bond lengths)
L = n_bonds * 2 * bond_length

# Number of pi electrons = 2 * number of double bonds
n_electrons = 2 * n_bonds
# HOMO level = n_electrons / 2
# LUMO level = n_electrons / 2 + 1
n_homo = n_electrons // 2
n_lumo = n_homo + 1

# Energy gap
delta_E = (n_lumo**2 - n_homo**2) * h**2 / (8 * m * L**2)
# Wavelength
wavelength = h * c / delta_E * 1e9  # convert to nm

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Wavelength vs conjugation length
ax1.set_facecolor('#111827')

# Colour each point by its wavelength
def wl_to_color(wl):
    if wl < 380: return '#444444'
    elif wl < 440: return '#8b00ff'
    elif wl < 490: return '#0000ff'
    elif wl < 510: return '#00ff00'
    elif wl < 580: return '#ffff00'
    elif wl < 620: return '#ff8c00'
    elif wl < 700: return '#ff0000'
    else: return '#8b0000'

colors = [wl_to_color(w) for w in wavelength]

ax1.scatter(n_bonds, wavelength, c=colors, s=100, edgecolors='white', linewidth=1, zorder=5)
ax1.plot(n_bonds, wavelength, color='gray', linewidth=1, alpha=0.5)

# Visible range
ax1.axhspan(380, 700, alpha=0.1, color='white')
ax1.axhline(380, color='#a855f7', linestyle=':', linewidth=0.5)
ax1.axhline(700, color='#ef4444', linestyle=':', linewidth=0.5)
ax1.text(13.5, 390, 'Visible range', color='gray', fontsize=8)

# Label some molecules
molecules = {3: 'Butadiene\n(UV, colourless)', 5: 'Vitamin A\n(UV, colourless)',
             8: 'Turmeric\n(blue abs, yellow)', 11: 'Beta-carotene\n(blue-green abs, orange)'}
for n, label in molecules.items():
    idx = list(n_bonds).index(n)
    ax1.annotate(label, xy=(n, wavelength[idx]), xytext=(n + 0.5, wavelength[idx] + 30),
                 color='white', fontsize=8, arrowprops=dict(arrowstyle='->', color='gray'))

ax1.set_xlabel('Number of conjugated double bonds', color='white')
ax1.set_ylabel('Absorption wavelength (nm)', color='white')
ax1.set_title('Conjugation Length vs Colour', color='white', fontsize=13)
ax1.tick_params(colors='gray')

# Energy level diagram for 3 different molecules
ax2.set_facecolor('#111827')
for i, (n, label, x_offset) in enumerate([(3, 'Short\n(colourless)', 0), (7, 'Medium\n(yellow)', 4), (11, 'Long\n(orange)', 8)]):
    L_val = n * 2 * bond_length
    for level in range(1, n + 2):
        E = level**2 * h**2 / (8 * m * L_val**2) * 1e19  # scale for display
        filled = level <= n
        color = '#3b82f6' if filled else '#ef4444'
        ax2.plot([x_offset, x_offset + 2], [E, E], color=color, linewidth=2)
        if level <= n:
            ax2.plot(x_offset + 1, E, 'o', color='#3b82f6', markersize=4)

    # HOMO-LUMO gap arrow
    E_homo = n**2 * h**2 / (8 * m * L_val**2) * 1e19
    E_lumo = (n+1)**2 * h**2 / (8 * m * L_val**2) * 1e19
    ax2.annotate('', xy=(x_offset + 2.5, E_lumo), xytext=(x_offset + 2.5, E_homo),
                 arrowprops=dict(arrowstyle='<->', color='#f59e0b', linewidth=2))
    gap_ev = (E_lumo - E_homo)
    ax2.text(x_offset + 1, -0.5, label, color='white', fontsize=9, ha='center')

ax2.set_ylabel('Energy (relative)', color='white')
ax2.set_title('Energy Levels: Longer conjugation = smaller gap', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_xticks([])

plt.tight_layout()
plt.show()

print("Particle-in-a-box model predictions:")
for n, wl in zip(n_bonds, wavelength):
    region = "UV (colourless)" if wl < 380 else f"Visible ({wl:.0f}nm)"
    print(f"  {n} conjugated double bonds: {wl:.0f} nm — {region}")`,
      challenge: 'The particle-in-a-box model overestimates wavelengths for real molecules. Why? (Hint: real molecules are not perfect 1D boxes.) Try multiplying L by 0.7 as a correction factor.',
      successHint: 'The connection between molecular structure and colour is one of the most beautiful results in chemistry. A simple quantum mechanical model (particle in a box) predicts real-world colours from first principles.',
    },
    {
      title: 'Conjugation and colour — the chromophore',
      concept: `A **chromophore** is the part of a molecule responsible for its colour. It is the minimum structural unit that absorbs visible light.

Common chromophores:
- **Azo group** (-N=N-): found in most synthetic dyes. Two nitrogen atoms double-bonded, linking two aromatic rings. Azo dyes account for ~70% of all commercial dyes.
- **Carbonyl group** (C=O): when conjugated with aromatic rings, absorbs visible light. Found in anthraquinone dyes.
- **Nitro group** (-NO2): electron-withdrawing, shifts absorption to longer wavelengths.
- **Quinoid system**: alternating pattern in the ring. Found in indigo.

**Auxochromes** are groups that don't cause colour by themselves but modify the chromophore's colour:
- **Bathochromic shift** (red shift): adding electron-donating groups (-OH, -NH2) shifts absorption to longer wavelength (toward red). The colour deepens.
- **Hypsochromic shift** (blue shift): adding electron-withdrawing groups or disrupting planarity shifts absorption to shorter wavelength (toward blue). The colour lightens.

This is how dye chemists design colours: start with a chromophore, then fine-tune with auxochromes. Want deeper red? Add more -NH2 groups. Want to shift toward blue? Add -NO2 groups or modify the ring structure.`,
      analogy: 'A chromophore is the engine of a car (it provides the essential function — colour). Auxochromes are the modifications: turbocharger (bathochromic — more power, deeper colour), governor (hypsochromic — limits output, lighter colour). The engine alone determines the car\'s basic type; the modifications fine-tune performance.',
      storyConnection: 'The tea garden Holi colours come in infinite shades — not just red, but every red from scarlet to maroon. In dye chemistry, this range comes from modifying the same chromophore with different auxochromes. One azo chromophore can produce hundreds of colour variants. The palette is built from modular chemistry.',
      checkQuestion: 'Indigo (blue) and Tyrian purple (purple) have very similar molecular structures. What small difference makes one blue and the other purple?',
      checkAnswer: 'Tyrian purple (6,6\'-dibromoindigo) has two bromine atoms attached to the indigo molecule. The heavy bromine atoms extend the electron cloud slightly, causing a bathochromic shift — absorbing at slightly longer wavelengths, which shifts the apparent colour from blue toward purple. Two atoms change a $10/kg commodity dye into what was once worth more than gold.',
      codeIntro: 'Simulate bathochromic and hypsochromic shifts by modifying a base chromophore.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(300, 750, 500)

def absorption_peak(wavelengths, center, width, intensity=1.0):
    return intensity * np.exp(-0.5 * ((wavelengths - center) / width) ** 2)

# Base chromophore (azo dye): absorbs at ~480 nm (appears orange)
base = absorption_peak(wavelengths, 480, 25)

# Bathochromic shifts (red shift): adding electron-donating groups
shift_1 = absorption_peak(wavelengths, 510, 28)  # +NH2
shift_2 = absorption_peak(wavelengths, 540, 30)  # +NH2 + OH
shift_3 = absorption_peak(wavelengths, 580, 32)  # extended conjugation

# Hypsochromic shift (blue shift)
blue_shift = absorption_peak(wavelengths, 440, 22)  # -NO2 ortho

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Absorption spectra
ax1.set_facecolor('#111827')
spectra = [
    (blue_shift, 'Hypsochromic (-NO2 added)', '#a855f7', '--'),
    (base, 'Base chromophore (azo)', '#f59e0b', '-'),
    (shift_1, 'Bathochromic (+NH2)', '#22c55e', '-'),
    (shift_2, 'More bathochromic (+NH2, +OH)', '#3b82f6', '-'),
    (shift_3, 'Extended conjugation', '#ef4444', '-'),
]

for spectrum, label, color, style in spectra:
    ax1.plot(wavelengths, spectrum, linewidth=2, color=color, linestyle=style, label=label)
    peak_wl = wavelengths[np.argmax(spectrum)]
    ax1.axvline(peak_wl, color=color, linestyle=':', linewidth=0.3, alpha=0.5)

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Absorption', color='white')
ax1.set_title('Chromophore Modifications Shift Absorption', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Arrow showing shift direction
ax1.annotate('', xy=(380, 0.85), xytext=(480, 0.85),
             arrowprops=dict(arrowstyle='->', color='#a855f7', linewidth=2))
ax1.text(410, 0.88, 'Blue shift\n(hypsochromic)', color='#a855f7', fontsize=8, ha='center')

ax1.annotate('', xy=(600, 0.85), xytext=(500, 0.85),
             arrowprops=dict(arrowstyle='->', color='#ef4444', linewidth=2))
ax1.text(560, 0.88, 'Red shift\n(bathochromic)', color='#ef4444', fontsize=8, ha='center')

# Resulting apparent colour
ax2.set_facecolor('#111827')

def absorbed_to_apparent(peak_nm):
    """Complementary colour lookup."""
    if peak_nm < 430: return '#f59e0b', 'Yellow'
    elif peak_nm < 480: return '#ef4444', 'Orange-Red'
    elif peak_nm < 510: return '#dc2626', 'Red'
    elif peak_nm < 540: return '#a855f7', 'Purple'
    elif peak_nm < 580: return '#3b82f6', 'Blue'
    elif peak_nm < 620: return '#22c55e', 'Green'
    else: return '#f59e0b', 'Yellow'

modifications = ['Base\n(azo dye)', '+NH2\n(donor)', '+NH2 +OH\n(2 donors)', 'Extended\nconjugation', '-NO2\n(withdrawing)']
peaks = [480, 510, 540, 580, 440]
apparent_colors = [absorbed_to_apparent(p) for p in peaks]

for i, (mod, peak, (color, name)) in enumerate(zip(modifications, peaks, apparent_colors)):
    ax2.barh(i, 1, color=color, alpha=0.8, height=0.6)
    ax2.text(0.5, i, f'{mod}\nAbsorbs {peak}nm -> Appears {name}', color='white',
             fontsize=9, ha='center', va='center', fontweight='bold')

ax2.set_xlim(0, 1)
ax2.set_yticks([])
ax2.set_xticks([])
ax2.set_title('Resulting Apparent Colour After Modification', color='white', fontsize=11)

plt.tight_layout()
plt.show()

print("Dye design rules:")
print("  Add electron donors (-NH2, -OH): red shift (deeper colour)")
print("  Add electron withdrawers (-NO2): blue shift (lighter colour)")
print("  Extend conjugation: red shift")
print("  Break planarity: blue shift")
print()
print("This is how chemists create specific colours to order.")
print("Modern computational chemistry can predict the colour")
print("of a molecule before it is even synthesized.")`,
      challenge: 'If the base azo dye absorbs at 480 nm (appears red), and you need it to absorb at exactly 550 nm (appear blue), how many electron-donating groups might you need? Extrapolate from the pattern above.',
      successHint: 'Chromophore chemistry is molecular engineering. Understanding how structure creates colour lets you design dyes rationally rather than by trial and error. This is the foundation of materials science, pharmaceutical chemistry, and photovoltaic research.',
    },
    {
      title: 'Chromophores — the minimum unit of colour',
      concept: `A **chromophore** is the specific part of a molecule responsible for absorbing visible light. It is the minimum structural unit that produces colour — strip it away and the molecule becomes colourless.

Common chromophores in dyes and nature:
- **Azo group** (-N=N-): the single most important chromophore in the dye industry. Two nitrogen atoms double-bonded, linking aromatic rings. Azo dyes account for ~70% of all commercial dyes.
- **Carbonyl group** (C=O): when conjugated with aromatic rings (as in anthraquinone dyes), absorbs visible light. Found in alizarin (red from madder root).
- **Quinoid system**: alternating single-double bonds in a ring. Found in indigo (the blue of jeans).
- **Porphyrin ring**: the chromophore in chlorophyll (green) and haemoglobin (red). A large, planar ring with a metal atom at the centre.

The colour of a chromophore can be fine-tuned by attaching **auxochromes** — groups that modify the electron distribution without being chromophores themselves. Common auxochromes: -OH (hydroxyl), -NH2 (amino), -NO2 (nitro), -SO3H (sulphonic acid).

The relationship: chromophore + auxochrome = the full dye molecule. The chromophore provides the base colour; the auxochrome adjusts the shade, solubility, and fibre-binding ability.`,
      analogy: 'If a dye molecule is a car, the chromophore is the engine (it produces the essential function — colour). The auxochromes are the accessories: turbocharger (deepens colour), air conditioning (adds water solubility), tow hook (adds fibre-binding). You cannot drive without the engine, but the accessories determine where and how well you drive.',
      storyConnection: 'Every colour in the tea garden Holi celebration exists because of a specific chromophore. The yellow of turmeric: a bis-keto chromophore. The blue of indigo: a quinoid chromophore. The red of lac dye: an anthraquinone chromophore. Nature invented these chromophores; chemists learned to read and replicate them.',
      checkQuestion: 'The azo group (-N=N-) is the most common chromophore in synthetic dyes. But there are almost no azo chromophores in nature. Why might evolution have avoided this structure?',
      checkAnswer: 'Azo bonds are relatively unstable to enzymatic reduction — bacteria in soil and gut can easily cleave them, releasing the aromatic amines on either side. Some of these amines are toxic or carcinogenic. Evolution may have selected against azo-based pigments because they would break down into harmful fragments inside living organisms. Synthetic chemistry does not face this selection pressure, which is why azo dyes dominate industrially but are absent biologically.',
      codeIntro: 'Visualize the major chromophore families and their absorption characteristics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(300, 750, 500)

def gaussian_peak(wl, center, width, intensity=1.0):
    return intensity * np.exp(-0.5 * ((wl - center) / width) ** 2)

# Major chromophore families
chromophores = {
    'Azo (-N=N-)': {'peak': 480, 'width': 35, 'color': '#ef4444', 'apparent': 'Red-Orange'},
    'Anthraquinone (C=O)': {'peak': 520, 'width': 30, 'color': '#a855f7', 'apparent': 'Red-Violet'},
    'Quinoid (indigo)': {'peak': 610, 'width': 28, 'color': '#3b82f6', 'apparent': 'Blue'},
    'Porphyrin (chlorophyll)': {'peak': 430, 'width': 20, 'color': '#22c55e', 'apparent': 'Green'},
    'Triphenylmethane': {'peak': 590, 'width': 25, 'color': '#06b6d4', 'apparent': 'Blue-Green'},
}

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# Absorption spectra
ax1.set_facecolor('#111827')
for name, data in chromophores.items():
    spectrum = gaussian_peak(wavelengths, data['peak'], data['width'])
    ax1.plot(wavelengths, spectrum, linewidth=2, color=data['color'],
             label=f"{name} (abs: {data['peak']}nm)")
    ax1.fill_between(wavelengths, spectrum, alpha=0.1, color=data['color'])

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Absorption', color='white')
ax1.set_title('Absorption Spectra of Major Chromophore Families', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')

# Commercial usage bar chart
ax2.set_facecolor('#111827')
names = list(chromophores.keys())
market_share = [70, 12, 5, 0, 8]  # approximate % of synthetic dye market
apparent_colors = [d['apparent'] for d in chromophores.values()]
colors = [d['color'] for d in chromophores.values()]

bars = ax2.barh(names, market_share, color=colors, alpha=0.8)
ax2.set_xlabel('Share of synthetic dye market (%)', color='white')
ax2.set_title('Chromophore Usage in Industry', color='white', fontsize=13)
ax2.tick_params(colors='gray')

for bar, share, app in zip(bars, market_share, apparent_colors):
    ax2.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
             f'{share}% — appears {app}', va='center', color='white', fontsize=9)

plt.tight_layout()
plt.show()

print("Chromophore families:")
for name, data in chromophores.items():
    print(f"  {name}")
    print(f"    Absorbs at: {data['peak']} nm")
    print(f"    Appears: {data['apparent']}")
print()
print("Azo dyes dominate (70% market share) because:")
print("  - Easy to synthesize (diazotization + coupling)")
print("  - Wide colour range (modify auxochromes)")
print("  - Good fastness properties")
print("  - Low cost")`,
      challenge: 'Porphyrin chromophores appear in chlorophyll (green, Mg centre) and haemoglobin (red, Fe centre). Same chromophore, different metal, different colour. Why does the metal matter?',
      successHint: 'The chromophore concept reduces the complexity of dye chemistry to a manageable set of structural motifs. Learn these five families and you can understand the colour of any molecule.',
    },
    {
      title: 'Spectrophotometry — measuring colour scientifically',
      concept: `How do we know exactly what wavelengths a substance absorbs? We use a **spectrophotometer** — an instrument that shines light through a sample and measures how much is absorbed at each wavelength.

The process:
1. A light source emits a broad spectrum (white light)
2. A **monochromator** (prism or diffraction grating) selects one wavelength at a time
3. The selected light passes through the sample
4. A **detector** measures how much light comes through
5. **Absorbance** = log10(I0/I), where I0 is incident light and I is transmitted light

**Beer-Lambert Law**: A = epsilon * c * l
- A = absorbance
- epsilon = molar absorptivity (how strongly the molecule absorbs at that wavelength)
- c = concentration (mol/L)
- l = path length through the sample (cm)

This law means absorbance is directly proportional to concentration. Double the dye concentration, double the absorbance. This makes spectrophotometry the standard tool for:
- Measuring dye concentration in solutions
- Quality control in textile dyeing
- Identifying unknown substances
- Monitoring water pollution (dye in effluent)`,
      analogy: 'A spectrophotometer is like a colour-specific thermometer. A thermometer measures how hot something is (one number). A spectrophotometer measures how much of each colour something absorbs (hundreds of numbers — one per wavelength). Together, these numbers form the "absorption spectrum," which is the molecule\'s unique colour fingerprint.',
      storyConnection: 'In the tea garden Holi story, colours are everywhere — vibrant, chaotic, beautiful. But a spectrophotometer sees each colour not as "beautiful red" but as "peak absorption at 520 nm with molar absorptivity 45,000." Science does not remove beauty; it adds precision. The sunset is still beautiful even when you know the wavelengths.',
      checkQuestion: 'A factory discharges dye-contaminated water into a river. The legal limit for dye concentration is 0.5 mg/L. You measure the absorbance of a water sample at the dye\'s peak wavelength and get A = 0.35. A standard solution of 1 mg/L gives A = 0.50. Is the factory in violation?',
      checkAnswer: 'By Beer-Lambert law, absorbance is proportional to concentration. If 1 mg/L gives A = 0.50, then A = 0.35 corresponds to 0.35/0.50 * 1 = 0.70 mg/L. This exceeds the 0.5 mg/L limit. The factory is in violation. This is exactly how environmental regulators test water quality — spectrophotometry is the standard method.',
      codeIntro: 'Simulate a spectrophotometer: Beer-Lambert law and calibration curve.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Beer-Lambert Law: A = epsilon * c * l
# epsilon = molar absorptivity (L/(mol*cm))
# c = concentration (mol/L)
# l = path length (cm)

# Example: measuring dye concentration in textile effluent
epsilon = 45000  # L/(mol*cm) - typical for azo dyes
l = 1.0  # 1 cm cuvette

# Calibration: known concentrations
known_conc = np.array([0, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0]) * 1e-5  # mol/L
known_abs = epsilon * known_conc * l

# Unknown samples
unknown_abs = np.array([0.22, 0.68, 1.35])
unknown_conc = unknown_abs / (epsilon * l)

# Full absorption spectrum of the dye
wavelengths = np.linspace(350, 700, 500)
concentrations = [1e-5, 3e-5, 5e-5, 10e-5]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Absorption spectrum at different concentrations
ax = axes[0, 0]
ax.set_facecolor('#111827')
colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
for conc, c in zip(concentrations, colors):
    # Gaussian absorption peak at 520 nm
    spectrum = epsilon * conc * l * np.exp(-0.5 * ((wavelengths - 520) / 30) ** 2)
    ax.plot(wavelengths, spectrum, linewidth=2, color=c, label=f'{conc*1e5:.0f} x 10⁻⁵ M')

ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Absorbance', color='white')
ax.set_title('Absorption Spectrum at Different Concentrations', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Calibration curve
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.plot(known_conc * 1e5, known_abs, 'o-', color='#3b82f6', linewidth=2, markersize=8, label='Standards')

# Mark unknowns
for i, (a, conc) in enumerate(zip(unknown_abs, unknown_conc)):
    ax.plot(conc * 1e5, a, 's', color='#ef4444', markersize=10)
    ax.annotate(f'Unknown {i+1}\nA={a}, c={conc*1e5:.2f}x10⁻⁵M',
                xy=(conc * 1e5, a), xytext=(conc * 1e5 + 1, a + 0.1),
                color='#ef4444', fontsize=8, arrowprops=dict(arrowstyle='->', color='#ef4444'))

ax.set_xlabel('Concentration (x10⁻⁵ mol/L)', color='white')
ax.set_ylabel('Absorbance at 520 nm', color='white')
ax.set_title('Calibration Curve (Beer-Lambert)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Transmittance vs concentration
ax = axes[1, 0]
ax.set_facecolor('#111827')
conc_range = np.linspace(0, 10e-5, 200)
abs_range = epsilon * conc_range * l
transmittance = 10 ** (-abs_range) * 100  # percent

ax.plot(conc_range * 1e5, transmittance, color='#a855f7', linewidth=2)
ax.fill_between(conc_range * 1e5, transmittance, alpha=0.15, color='#a855f7')
ax.set_xlabel('Concentration (x10⁻⁵ mol/L)', color='white')
ax.set_ylabel('Transmittance (%)', color='white')
ax.set_title('Transmittance Drops Exponentially', color='white', fontsize=11)
ax.tick_params(colors='gray')

# Spectrophotometer schematic
ax = axes[1, 1]
ax.set_facecolor('#111827')
components = ['Light\nsource', 'Mono-\nchromator', 'Sample\ncuvette', 'Detector', 'Computer']
x_pos = np.arange(len(components))
colors_comp = ['#f59e0b', '#a855f7', '#3b82f6', '#22c55e', '#ef4444']

for i, (comp, c) in enumerate(zip(components, colors_comp)):
    ax.add_patch(plt.Rectangle((i * 2, 0.3), 1.5, 0.4, facecolor=c, alpha=0.6, edgecolor='white'))
    ax.text(i * 2 + 0.75, 0.5, comp, color='white', fontsize=8, ha='center', va='center', fontweight='bold')
    if i < len(components) - 1:
        ax.annotate('', xy=(i * 2 + 2, 0.5), xytext=(i * 2 + 1.5, 0.5),
                     arrowprops=dict(arrowstyle='->', color='white', linewidth=2))

ax.set_xlim(-0.5, 10)
ax.set_ylim(0, 1)
ax.set_title('Spectrophotometer Components', color='white', fontsize=11)
ax.axis('off')

plt.tight_layout()
plt.show()

print("Beer-Lambert Law: A = epsilon * c * l")
print(f"  epsilon = {epsilon:,} L/(mol*cm)")
print(f"  l = {l} cm (cuvette path length)")
print()
print("Unknown sample results:")
for i, (a, conc) in enumerate(zip(unknown_abs, unknown_conc)):
    print(f"  Unknown {i+1}: A = {a:.2f} -> concentration = {conc*1e6:.1f} x 10⁻⁶ mol/L")`,
      challenge: 'What happens to the calibration curve at very high concentrations? (Hint: Beer-Lambert law deviates when A > 2.) Add points at concentrations 20 and 50 x10^-5 M and observe the deviation.',
      successHint: 'Spectrophotometry is one of the most widely used analytical techniques in science. It turns colour — a qualitative observation — into concentration — a quantitative measurement. This single technique underpins medical diagnostics, environmental monitoring, food safety, and chemical research.',
    },
    {
      title: 'Dyeing kinetics — how fast does colour bind?',
      concept: `In Level 1, we modelled dye uptake as first-order kinetics: dye moves from solution to fibre exponentially. In Level 2, we dig deeper into the **mechanisms** that control dyeing speed.

The dyeing process has three rate-limiting steps:
1. **Diffusion through the boundary layer**: a thin layer of still water surrounds the fibre surface. Dye molecules must diffuse through it. Stirring the dye bath reduces this layer.
2. **Adsorption onto the fibre surface**: dye molecules must find and attach to binding sites. Depends on dye-fibre affinity and surface chemistry.
3. **Diffusion into the fibre interior**: the slowest step for most fibres. Dye must penetrate between polymer chains. Temperature dramatically increases the diffusion rate.

The overall rate depends on which step is slowest (the bottleneck):
- At low temperature: interior diffusion is the bottleneck
- At high agitation: adsorption is the bottleneck
- At high temperature + low agitation: boundary layer is the bottleneck

**Arrhenius equation**: k = A * exp(-Ea / RT)
- k = rate constant
- Ea = activation energy (energy barrier for diffusion)
- T = temperature (Kelvin)
- R = gas constant

Raising temperature by 10°C typically doubles the dyeing rate. This is why industrial dyeing happens at 60-130°C.`,
      analogy: 'Dyeing kinetics is like a three-lane highway with a traffic jam. Lane 1 (boundary layer) can be cleared by stirring. Lane 2 (surface adsorption) depends on how attractive the destination is. Lane 3 (interior diffusion) requires heat to open the road. The slowest lane determines overall speed. Good dyeing conditions keep all three lanes moving.',
      storyConnection: 'The traditional dyers in the tea garden region boil their dye baths, stir them constantly, and soak fabrics for hours. Each of these practices targets a different rate-limiting step: heat increases diffusion, stirring reduces the boundary layer, and long soak times ensure complete penetration. Traditional knowledge encodes kinetic science.',
      checkQuestion: 'Why do you need to wash dyed fabric multiple times after dyeing? If the dye is "bonded," why would any come off?',
      checkAnswer: 'Not all dye molecules bond properly. Some are trapped on the surface (adsorbed but not fixed), some are in the boundary layer, and some are unfixed excess. Washing removes these loose molecules. If you skip washing, the unfixed dye will transfer to other fabrics later (bleeding). Professional dyeing includes "soaping off" — washing at high temperature with soap to remove all unfixed dye.',
      codeIntro: 'Model dyeing kinetics with temperature dependence (Arrhenius equation).',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Arrhenius equation: k = A * exp(-Ea / (R * T))
R = 8.314  # J/(mol*K)
A = 1e8    # pre-exponential factor (1/min)
Ea = 50000 # activation energy (J/mol) — typical for dye diffusion

temperatures_C = [40, 60, 80, 100]
temperatures_K = [T + 273.15 for T in temperatures_C]

time = np.linspace(0, 120, 500)  # minutes
C0 = 100  # initial dye concentration

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Dye uptake at different temperatures
ax = axes[0, 0]
ax.set_facecolor('#111827')
colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
rate_constants = []

for T_C, T_K, c in zip(temperatures_C, temperatures_K, colors):
    k = A * np.exp(-Ea / (R * T_K))
    rate_constants.append(k)
    uptake = C0 * (1 - np.exp(-k * time))
    ax.plot(time, uptake, linewidth=2, color=c, label=f'{T_C}°C (k={k:.4f})')

ax.set_xlabel('Time (minutes)', color='white')
ax.set_ylabel('Dye on fibre (%)', color='white')
ax.set_title('Dye Uptake at Different Temperatures', color='white', fontsize=12)
ax.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')
ax.axhline(90, color='gray', linestyle=':', linewidth=0.5)
ax.text(100, 92, '90% target', color='gray', fontsize=8)

# Arrhenius plot: ln(k) vs 1/T
ax = axes[0, 1]
ax.set_facecolor('#111827')
inv_T = [1/T for T in temperatures_K]
ln_k = [np.log(k) for k in rate_constants]
ax.plot(inv_T, ln_k, 'o-', color='#a855f7', markersize=8, linewidth=2)
ax.set_xlabel('1/T (1/K)', color='white')
ax.set_ylabel('ln(k)', color='white')
ax.set_title('Arrhenius Plot (slope = -Ea/R)', color='white', fontsize=12)
ax.tick_params(colors='gray')

slope = -Ea / R
ax.text(np.mean(inv_T), np.mean(ln_k) + 1,
        f'Ea = {Ea/1000:.0f} kJ/mol\nSlope = -Ea/R = {slope:.0f} K',
        color='#a855f7', fontsize=9)

# Time to 90% uptake vs temperature
ax = axes[1, 0]
ax.set_facecolor('#111827')
temps_range = np.linspace(30, 130, 100) + 273.15
k_range = A * np.exp(-Ea / (R * temps_range))
t90 = -np.log(0.1) / k_range  # time for 90% uptake

ax.plot(temps_range - 273.15, t90, color='#22c55e', linewidth=2)
ax.fill_between(temps_range - 273.15, t90, alpha=0.15, color='#22c55e')
ax.set_xlabel('Temperature (°C)', color='white')
ax.set_ylabel('Time to 90% uptake (minutes)', color='white')
ax.set_title('Temperature Dramatically Reduces Dyeing Time', color='white', fontsize=12)
ax.tick_params(colors='gray')
ax.set_ylim(0, min(200, max(t90)))

# Effect of agitation (reduces boundary layer)
ax = axes[1, 1]
ax.set_facecolor('#111827')
agitation_levels = ['No\nstirring', 'Gentle\nstir', 'Moderate\nagitation', 'Vigorous\nagitation']
boundary_thickness = [1.0, 0.5, 0.2, 0.05]  # mm
effective_rate = [0.01, 0.02, 0.04, 0.045]  # overall k at 80°C

x_pos = np.arange(len(agitation_levels))
bars = ax.bar(x_pos, effective_rate, color=colors)
ax.set_xticks(x_pos)
ax.set_xticklabels(agitation_levels, color='white', fontsize=9)
ax.set_ylabel('Effective rate constant', color='white')
ax.set_title('Effect of Agitation on Dyeing Rate (80°C)', color='white', fontsize=12)
ax.tick_params(colors='gray')

for bar, bt in zip(bars, boundary_thickness):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.001,
            f'BL: {bt}mm', ha='center', color='white', fontsize=8)

plt.tight_layout()
plt.show()

print("Dyeing rate vs temperature:")
for T_C, k in zip(temperatures_C, rate_constants):
    t = -np.log(0.1) / k
    print(f"  {T_C}°C: k={k:.4f}/min, time to 90%: {t:.0f} min")
print()
print("Rule of thumb: +10°C roughly doubles the rate.")
print(f"  Rate at 40°C: {rate_constants[0]:.5f}")
print(f"  Rate at 60°C: {rate_constants[1]:.5f} ({rate_constants[1]/rate_constants[0]:.1f}x)")
print(f"  Rate at 80°C: {rate_constants[2]:.5f} ({rate_constants[2]/rate_constants[0]:.1f}x)")`,
      challenge: 'Natural indigo dyeing happens at room temperature (25°C) but takes hours of repeated dipping. Calculate the rate constant at 25°C and the time to 90% uptake. Why did traditional dyers accept this slow process?',
      successHint: 'Kinetics is where chemistry meets engineering. Knowing the rate constants and their temperature dependence lets you design industrial processes: choose the right temperature, agitation, and time to minimize cost and waste.',
    },
    {
      title: 'Green chemistry — designing safer dyes',
      concept: `The textile dye industry produces ~700,000 tonnes of dye per year and generates enormous pollution: 200 billion litres of contaminated wastewater annually. **Green chemistry** aims to redesign this system from the molecular level up.

The 12 Principles of Green Chemistry (Anastas & Warner, 1998), applied to dyes:
1. **Prevention**: design dyes that bind efficiently, reducing waste
2. **Atom economy**: maximize the fraction of raw material atoms that end up in the final dye
3. **Less hazardous synthesis**: avoid toxic reagents
4. **Safer chemicals**: design dyes without carcinogenic aromatic amines
5. **Safer solvents**: use water instead of organic solvents (many traditional dyers already do this)
6. **Energy efficiency**: design dyes that work at lower temperatures
7. **Renewable feedstocks**: bio-based dyes from plant or microbial sources
8. **Reduce derivatives**: fewer synthesis steps
9. **Catalysis**: use catalysts instead of stoichiometric reagents
10. **Design for degradation**: dyes that biodegrade after their useful life
11. **Real-time analysis**: monitor dyeing in real-time to prevent overuse
12. **Accident prevention**: avoid explosive or toxic intermediates

Current green dye innovations:
- **Colorifix**: a biotech company that uses engineered bacteria to produce and fix dyes. The bacteria grow the pigment and deposit it directly onto fabric, eliminating 90% of the water and chemicals.
- **DyeCoo**: supercritical CO2 dyeing — uses pressurized CO2 instead of water. No wastewater at all.
- **Natural dye standardization**: making traditional dyes (like Assam's lac and turmeric) consistent enough for industrial use.`,
      analogy: 'Green chemistry is like redesigning a factory so it produces zero waste. Traditional chemistry is a messy kitchen: ingredients everywhere, scraps in the bin, oil down the drain. Green chemistry is a professional kitchen: every ingredient measured exactly, scraps composted, oil recycled. The food (dye) tastes the same; the process is cleaner.',
      storyConnection: 'The tea gardens in the Holi story are already a green system: plants grow using sunlight, produce pigments naturally, and the colours return to the earth. Green chemistry seeks to make industrial dyeing more like a tea garden — using biology, sunlight, and water instead of petrochemicals and toxic solvents.',
      checkQuestion: 'If bacteria can produce dyes (Colorifix), why haven\'t they replaced chemical dyes entirely?',
      checkAnswer: 'Scale and consistency. Bacteria produce small quantities slowly, and the colour range is limited to what biology can make (no fluorescents, no neons). The colour must be consistent from batch to batch, which is harder with living organisms. Cost is currently higher than chemical dyes. But the gap is closing: as environmental regulations tighten and chemical costs rise, bio-dyes become more competitive.',
      codeIntro: 'Compare the environmental footprint of conventional vs. green dyeing processes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

processes = ['Conventional\n(reactive dye)', 'Low-temp\nreactive', 'Supercritical\nCO2 (DyeCoo)', 'Bio-dyeing\n(Colorifix)', 'Traditional\nnatural dye']

# Environmental metrics (normalized, lower = better)
water_use = [100, 70, 0, 10, 80]          # litres per kg fabric
chemical_use = [100, 60, 20, 5, 30]       # chemical load
energy = [100, 80, 90, 40, 50]            # energy consumption
wastewater_tox = [100, 50, 0, 5, 20]      # wastewater toxicity
co2_emissions = [100, 70, 50, 30, 40]     # carbon footprint

metrics = ['Water\nuse', 'Chemical\nload', 'Energy', 'Wastewater\ntoxicity', 'CO2\nemissions']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Stacked bar chart of total impact
ax1.set_facecolor('#111827')
totals = [sum(x) for x in zip(water_use, chemical_use, energy, wastewater_tox, co2_emissions)]
colors_proc = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#a855f7']
bars = ax1.bar(range(len(processes)), totals, color=colors_proc, alpha=0.8)
ax1.set_xticks(range(len(processes)))
ax1.set_xticklabels(processes, color='white', fontsize=8)
ax1.set_ylabel('Total environmental impact (lower = better)', color='white')
ax1.set_title('Overall Environmental Footprint', color='white', fontsize=13)
ax1.tick_params(colors='gray')

for bar, total in zip(bars, totals):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
             f'{total}', ha='center', color='white', fontsize=10, fontweight='bold')

# Radar chart comparison
ax2 = fig.add_subplot(122, polar=True)
ax2.set_facecolor('#111827')

N = len(metrics)
angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
angles += angles[:1]

for i, (process, c) in enumerate(zip(processes, colors_proc)):
    values = [water_use[i], chemical_use[i], energy[i], wastewater_tox[i], co2_emissions[i]]
    values += values[:1]
    ax2.plot(angles, values, 'o-', linewidth=2, label=process.replace('\n', ' '), color=c)
    ax2.fill(angles, values, alpha=0.05, color=c)

ax2.set_xticks(angles[:-1])
ax2.set_xticklabels(metrics, color='white', fontsize=8)
ax2.set_ylim(0, 110)
ax2.set_yticks([25, 50, 75, 100])
ax2.set_yticklabels(['25', '50', '75', '100'], color='gray', fontsize=7)
ax2.set_title('Impact Profile by Metric', color='white', fontsize=11, pad=20)
ax2.legend(loc='upper right', bbox_to_anchor=(1.4, 1.1), facecolor='#1f2937',
           edgecolor='gray', labelcolor='white', fontsize=7)

plt.tight_layout()
plt.show()

print("Environmental impact rankings (lower = better):")
for process, total, c in sorted(zip(processes, totals, colors_proc), key=lambda x: x[1]):
    bar = '#' * (total // 10)
    print(f"  {process.replace(chr(10), ' '):30s} {total:4d} {bar}")
print()
print("Key insight: no single green technology wins everywhere.")
print("  DyeCoo: zero water, but high energy")
print("  Colorifix: low everything, but limited colour range")
print("  Traditional: low toxicity, but high water use")
print("  The future: hybrid approaches combining the best of each.")`,
      challenge: 'If Colorifix scales up and reduces cost by 50%, making bio-dyeing cheaper than conventional dyeing, what market share could it capture? Model a 10-year adoption curve (S-shaped, like the sigmoid in Level 1).',
      successHint: 'Green chemistry is not just about reducing harm — it is about redesigning entire systems for sustainability. From molecular structure to industrial process to global impact, the chemistry of colour touches every scale. The Holi tea garden story ends where it began: colour from nature, returned to nature, without harm.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Innovator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Builds on Level 1 colour chemistry concepts</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for organic chemistry simulations. Click to start.</p>
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