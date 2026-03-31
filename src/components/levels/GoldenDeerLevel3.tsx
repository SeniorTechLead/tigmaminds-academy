import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function GoldenDeerLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true);
    setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => { script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed')); });
      }
      setLoadProgress('Starting Python...');
      const pyodide = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...');
      await pyodide.loadPackage('micropip');
      const micropip = pyodide.pyimport('micropip');
      for (const pkg of ['numpy', 'matplotlib']) {
        try { await micropip.install(pkg); } catch { await pyodide.loadPackage(pkg).catch(() => {}); }
      }
      await pyodide.runPythonAsync(`
import sys, io
class OutputCapture:
    def __init__(self): self.output = []
    def write(self, text): self.output.append(text)
    def flush(self): pass
    def get_output(self): return ''.join(self.output)
    def clear(self): self.output = []
_stdout_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
import matplotlib; matplotlib.use('AGG')
import matplotlib.pyplot as plt; import base64
def _get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='#1f2937', edgecolor='none')
    buf.seek(0); img_str = base64.b64encode(buf.read()).decode('utf-8'); plt.close('all'); return img_str
`);
      pyodideRef.current = pyodide; setPyReady(true); setLoading(false); setLoadProgress('');
      return pyodide;
    } catch (err: any) { setLoading(false); setLoadProgress('Error: ' + err.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Electromagnetic spectrum deep dive — wavelength, frequency, and energy',
      concept: `Visible light is only a tiny sliver of the electromagnetic (EM) spectrum. The full spectrum stretches from radio waves with wavelengths of kilometers down to gamma rays with wavelengths smaller than an atom. Every type of EM radiation — radio, microwave, infrared, visible, ultraviolet, X-ray, gamma — is the same fundamental thing: oscillating electric and magnetic fields traveling at the speed of light. The only difference is wavelength.

Three quantities are linked by two equations. Wavelength (λ) and frequency (f) are inversely related through the speed of light: c = λ × f. Because c is constant (~3 × 10⁸ m/s), shorter wavelengths mean higher frequencies. The energy of a single photon is given by Planck's equation: E = hf, where h is Planck's constant (6.626 × 10⁻³⁴ J·s). This means higher frequency = higher energy. A gamma ray photon carries billions of times more energy than a radio photon.

This relationship explains everything from why UV light causes sunburn (high-energy photons break DNA bonds) to why your microwave heats food (the frequency matches water molecule resonances). Understanding the spectrum is the foundation of all spectroscopy — the science of reading light to learn what things are made of.`,
      analogy: 'Think of the EM spectrum like a piano keyboard stretched across the universe. Radio waves are the deep bass notes on the far left — long wavelengths, low energy. Visible light is a single octave somewhere in the middle. Gamma rays are the highest notes on the far right — short wavelengths, enormous energy. Most of the keyboard is invisible to human eyes; we hear only one octave of a cosmic symphony.',
      storyConnection: 'The golden deer of Kamakhya glowed with a light that seemed otherworldly. That golden color corresponds to wavelengths around 570-590 nanometers — a specific slice of the visible spectrum. The temple at Kamakhya, lit by oil lamps and sunlight filtered through stone, would have produced a warm spectrum dominated by these golden frequencies. Every color in the story maps to a precise wavelength and energy.',
      checkQuestion: 'If you double the frequency of a photon, what happens to its wavelength and its energy?',
      checkAnswer: 'The wavelength halves (since c = λ×f, doubling f means λ must halve to keep c constant). The energy doubles (since E = hf, doubling f doubles E). Frequency, wavelength, and energy are all locked together by these two equations.',
      codeIntro: 'Visualize the full electromagnetic spectrum and plot the wavelength-frequency-energy relationships using Planck\'s equation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Physical constants
c = 3e8          # speed of light (m/s)
h = 6.626e-34    # Planck's constant (J*s)

# EM spectrum regions (wavelength in meters)
regions = [
    ('Radio',      1e3,    1e-1,   '#6366f1'),
    ('Microwave',  1e-1,   1e-3,   '#8b5cf6'),
    ('Infrared',   1e-3,   7e-7,   '#ef4444'),
    ('Visible',    7e-7,   4e-7,   '#f59e0b'),
    ('Ultraviolet',4e-7,   1e-8,   '#a855f7'),
    ('X-ray',      1e-8,   1e-11,  '#3b82f6'),
    ('Gamma',      1e-11,  1e-14,  '#10b981'),
]

fig, axes = plt.subplots(3, 1, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: EM spectrum overview
ax = axes[0]
ax.set_facecolor('#111827')
for name, lam_max, lam_min, color in regions:
    f_min = c / lam_max
    f_max = c / lam_min
    ax.barh(0, np.log10(f_max) - np.log10(f_min), left=np.log10(f_min),
            height=0.6, color=color, alpha=0.8, edgecolor='white', linewidth=0.5)
    mid = (np.log10(f_min) + np.log10(f_max)) / 2
    ax.text(mid, 0, name, ha='center', va='center', fontsize=7,
            color='white', fontweight='bold', rotation=45)
ax.set_xlabel('log₁₀(Frequency / Hz)', color='white', fontsize=10)
ax.set_title('The Electromagnetic Spectrum', color='white', fontsize=13, fontweight='bold')
ax.set_yticks([])
ax.tick_params(colors='gray')

# Plot 2: Wavelength vs Frequency (inverse relationship)
ax2 = axes[1]
ax2.set_facecolor('#111827')
wavelengths = np.logspace(-14, 3, 500)  # meters
frequencies = c / wavelengths
ax2.loglog(wavelengths * 1e9, frequencies, color='#f59e0b', linewidth=2)
ax2.axvspan(400, 700, alpha=0.3, color='#f59e0b', label='Visible light')
ax2.set_xlabel('Wavelength (nm)', color='white', fontsize=10)
ax2.set_ylabel('Frequency (Hz)', color='white', fontsize=10)
ax2.set_title('Wavelength vs Frequency: c = λf', color='white', fontsize=12)
ax2.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# Plot 3: Energy vs Frequency (linear, E = hf)
ax3 = axes[2]
ax3.set_facecolor('#111827')
freq_range = np.logspace(4, 22, 500)
energies_eV = h * freq_range / 1.602e-19  # convert J to eV
ax3.loglog(freq_range, energies_eV, color='#22c55e', linewidth=2)
# Mark visible range
vis_f_min, vis_f_max = c / 700e-9, c / 400e-9
ax3.axvspan(vis_f_min, vis_f_max, alpha=0.3, color='#f59e0b', label='Visible light')
# Mark golden deer wavelength ~580nm
golden_f = c / 580e-9
golden_E = h * golden_f / 1.602e-19
ax3.plot(golden_f, golden_E, 'o', color='#fbbf24', markersize=10, zorder=5,
         label=f'Golden light (580nm): {golden_E:.2f} eV')
ax3.set_xlabel('Frequency (Hz)', color='white', fontsize=10)
ax3.set_ylabel('Photon Energy (eV)', color='white', fontsize=10)
ax3.set_title("Planck's Equation: E = hf", color='white', fontsize=12)
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

# Compute some key values
print("Electromagnetic Spectrum Key Values:")
print(f"{'Region':<14} {'Wavelength':>14} {'Frequency':>14} {'Photon Energy':>14}")
print("-" * 60)
examples = [
    ('Radio FM',    3.0,        'meters'),
    ('Microwave',   0.01,       'meters'),
    ('Infrared',    10e-6,      'meters'),
    ('Golden light', 580e-9,    'meters'),
    ('Ultraviolet', 100e-9,     'meters'),
    ('X-ray',       1e-10,      'meters'),
    ('Gamma ray',   1e-13,      'meters'),
]
for name, lam, _ in examples:
    f = c / lam
    E_eV = h * f / 1.602e-19
    if lam >= 1e-3:
        lam_str = f"{lam*100:.1f} cm"
    elif lam >= 1e-6:
        lam_str = f"{lam*1e6:.1f} μm"
    else:
        lam_str = f"{lam*1e9:.1f} nm"
    print(f"{name:<14} {lam_str:>14} {f:>14.2e} Hz {E_eV:>10.4f} eV")

print()
print("The golden deer's coat reflects 580nm photons, each carrying 2.14 eV.")
print("That\'s enough energy to excite electrons but not enough to break bonds.")
print("UV photons (>3.1 eV) start breaking molecular bonds -- that\'s why UV is dangerous.")`,
      challenge: 'Add a fourth subplot that shows the visible spectrum as a color bar (380-750nm). Map each wavelength to an approximate RGB color and display it. Hint: use a simple piecewise function to convert wavelength to RGB.',
      successHint: 'The two equations c=λf and E=hf are the Rosetta Stone of the electromagnetic spectrum. With them you can convert between any representation — wavelength, frequency, or energy — and understand why different parts of the spectrum interact with matter so differently.',
    },
    {
      title: 'Spectroscopy and emission spectra — fingerprints of the elements',
      concept: `When you heat an element until it glows, it does not produce white light. It produces light at specific, discrete wavelengths that are unique to that element. Hydrogen emits at 656.3nm (red), 486.1nm (cyan), 434.0nm (blue), and 410.2nm (violet) — always these exact wavelengths, nowhere else. This is its emission spectrum, and it is as unique as a fingerprint.

Why discrete lines? Because electrons in atoms can only occupy specific energy levels (quantum states). When an excited electron drops from a higher energy level to a lower one, it emits a photon whose energy equals the exact difference between those levels: E_photon = E_high - E_low. Since energy levels are fixed, the emitted wavelengths are fixed. Hydrogen's simplest transition (n=3 to n=2) produces the 656.3nm red line. The n=4 to n=2 transition gives the 486.1nm cyan line. These are the Balmer series.

Spectroscopy — the science of measuring these spectral lines — is one of the most powerful tools in all of science. It tells us what distant stars are made of, detects pollutants in air, identifies unknown chemicals in a lab, and even measures the speed at which galaxies are moving away from us (through Doppler shifts of spectral lines).`,
      analogy: 'Imagine every element is a musician who can only play certain notes. Hydrogen plays four notes in the visible range — always the same four. Sodium plays one loud note at 589nm (bright yellow). Neon plays several notes in orange-red. If you hear music from behind a curtain, you can identify every musician by their unique notes. That is spectroscopy: identifying elements by the specific wavelengths of light they emit.',
      storyConnection: 'The golden glow surrounding the deer of Kamakhya was not just any gold — it was the specific warm amber of firelight filtered through temple incense. Sodium in salt produces a brilliant yellow at 589nm when heated. The golden temples of Assam, lit by oil lamps containing sodium compounds, would glow with this exact spectral signature. Every sacred flame has a chemical story written in its spectrum.',
      checkQuestion: 'If you see an emission spectrum with bright lines at 656nm, 486nm, and 434nm, and someone claims the sample is neon, how would you respond?',
      checkAnswer: 'Those are the Balmer series lines of hydrogen, not neon. Neon has a completely different set of emission lines, mostly in the orange-red region (585nm, 603nm, 640nm, etc.). Each element has a unique spectral fingerprint. This is exactly how spectroscopy identifies elements — by matching observed lines to known reference spectra.',
      codeIntro: 'Simulate emission spectra for hydrogen, sodium, and neon, computing wavelengths from energy level transitions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hydrogen energy levels: E_n = -13.6 / n^2 eV
def hydrogen_energy(n):
    return -13.6 / n**2

# Compute Balmer series (transitions to n=2)
balmer_lines = []
for n_high in range(3, 8):
    dE = hydrogen_energy(n_high) - hydrogen_energy(2)  # negative (emission)
    E_photon = abs(dE)  # eV
    # E = hc/lambda => lambda = hc/E
    lam_nm = 1240 / E_photon  # shortcut: hc = 1240 eV*nm
    balmer_lines.append((n_high, lam_nm, E_photon))

# Known spectral lines for other elements (nm)
sodium_lines = [589.0, 589.6]  # famous sodium doublet
neon_lines = [585.2, 588.2, 603.0, 607.4, 616.4, 621.7, 626.6, 633.4, 640.2, 650.6, 659.9]
iron_lines = [382.0, 385.9, 404.6, 438.4, 466.8, 495.8, 516.7, 527.0, 532.8, 537.1]

def wavelength_to_rgb(wavelength):
    """Approximate RGB color for a given wavelength (380-750 nm)."""
    w = wavelength
    if 380 <= w < 440:
        r, g, b = -(w - 440) / 60, 0.0, 1.0
    elif 440 <= w < 490:
        r, g, b = 0.0, (w - 440) / 50, 1.0
    elif 490 <= w < 510:
        r, g, b = 0.0, 1.0, -(w - 510) / 20
    elif 510 <= w < 580:
        r, g, b = (w - 510) / 70, 1.0, 0.0
    elif 580 <= w < 645:
        r, g, b = 1.0, -(w - 645) / 65, 0.0
    elif 645 <= w <= 750:
        r, g, b = 1.0, 0.0, 0.0
    else:
        r, g, b = 0.3, 0.3, 0.3
    return (r, g, b)

fig, axes = plt.subplots(4, 1, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

elements = [
    ('Hydrogen (Balmer series)', [l[1] for l in balmer_lines]),
    ('Sodium', sodium_lines),
    ('Neon', neon_lines),
    ('Iron', iron_lines),
]

for ax, (name, lines) in zip(axes, elements):
    ax.set_facecolor('#111827')
    ax.set_xlim(370, 760)

    # Draw each emission line with its actual color
    for lam in lines:
        color = wavelength_to_rgb(lam)
        ax.axvline(lam, color=color, linewidth=3, alpha=0.9)
        # Add a glow effect
        ax.axvline(lam, color=color, linewidth=8, alpha=0.2)

    ax.set_title(f'{name} Emission Spectrum', color='white', fontsize=11, fontweight='bold')
    ax.set_yticks([])
    ax.set_xlabel('Wavelength (nm)', color='white', fontsize=9)
    ax.tick_params(colors='gray')

    # Shade visible range background
    for w in range(380, 750):
        ax.axvspan(w, w+1, alpha=0.04, color=wavelength_to_rgb(w))

plt.tight_layout()
plt.show()

print("Hydrogen Balmer Series (transitions to n=2):")
print(f"{'Transition':<12} {'Wavelength':>12} {'Energy':>10}")
print("-" * 36)
for n_high, lam, E in balmer_lines:
    print(f"  n={n_high} -> n=2  {lam:>10.1f} nm  {E:>8.3f} eV")

print(f"\\nSodium doublet: {sodium_lines[0]:.1f} nm and {sodium_lines[1]:.1f} nm")
print("  (The yellow glow of street lamps and sodium flames)")
print(f"\\nNeon has {len(neon_lines)} visible lines -- mostly orange/red")
print("  (That\'s why neon signs glow orange-red)")
print(f"\\nIron has {len(iron_lines)} visible lines -- a complex spectrum")
print("  (Iron lines in sunlight revealed the Sun's composition)")
print()
print("Each element's spectral lines are unique.")
print("This is how we know what stars billions of light-years away are made of.")`,
      challenge: 'Add a fifth element: mercury (Hg), with lines at 404.7nm, 435.8nm, 546.1nm, 577.0nm, 579.1nm. Modify the plot to include it and note which mercury line is closest to the golden deer\'s color (~580nm).',
      successHint: 'Emission spectra are quantized because energy levels are quantized. This was one of the first clues that classical physics was incomplete — it led directly to quantum mechanics. Every element broadcasts its identity in light.',
    },
    {
      title: 'Absorption spectra — reading the dark lines in starlight',
      concept: `Emission spectra show bright lines on a dark background — hot gas glowing at specific wavelengths. Absorption spectra are the photographic negative: dark lines on a bright, continuous background. When white light (containing all wavelengths) passes through a cooler gas, atoms in that gas absorb photons at exactly the same wavelengths they would emit. The absorbed wavelengths appear as dark gaps — Fraunhofer lines — in the otherwise continuous spectrum.

The Sun's spectrum is the most famous example. Its core produces a continuous rainbow of light, but as that light passes through the cooler outer atmosphere, atoms of hydrogen, helium, sodium, iron, calcium, and dozens of other elements each absorb their characteristic wavelengths. By 1860, Kirchhoff and Bunsen had matched solar absorption lines to laboratory emission lines and proved the Sun contains the same elements found on Earth. Helium was actually discovered in the Sun's spectrum before it was found on Earth — its name comes from Helios, the Greek sun god.

Absorption spectroscopy is used everywhere today: atmospheric scientists measure ozone by its UV absorption, astronomers determine stellar composition and temperature, and even wine quality is assessed by how the liquid absorbs specific wavelengths. The principle is always the same — matter absorbs light at frequencies that match its internal energy level spacings.`,
      analogy: 'Imagine shining a flashlight through a picket fence. The full beam represents white light. Each picket blocks a specific strip of light, leaving dark shadows. The pattern of shadows tells you the spacing and width of every picket. Absorption spectroscopy works the same way: the dark lines in starlight are shadows cast by atoms, and each shadow pattern reveals a different element.',
      storyConnection: 'The sunlight that bathes the Kamakhya temple passes through Earth\'s atmosphere before illuminating the golden deer. That sunlight carries dark absorption lines from hydrogen, oxygen, and water vapor in our atmosphere — plus lines from the Sun\'s own atmosphere. The golden light the deer reflects has already been "filtered" by multiple layers of atomic absorption. The deer\'s golden coat is sunlight with specific wavelengths removed.',
      checkQuestion: 'If hydrogen\'s emission spectrum has bright lines at 656nm and 486nm, what would hydrogen\'s absorption spectrum show at those same wavelengths?',
      checkAnswer: 'Dark lines at exactly 656nm and 486nm on an otherwise continuous spectrum. Absorption and emission are mirror images — an atom absorbs at the same wavelengths it emits. The absorbed photons are re-emitted in random directions, so the observer looking at the light source sees those wavelengths weakened (dark lines).',
      codeIntro: 'Simulate continuous sunlight passing through a stellar atmosphere, creating Fraunhofer absorption lines.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Create continuous blackbody-like spectrum (simplified)
wavelengths = np.linspace(380, 750, 2000)

# Approximate solar spectrum (blackbody at 5778K, simplified)
def planck_visible(lam_nm, T=5778):
    lam_m = lam_nm * 1e-9
    h, c, k = 6.626e-34, 3e8, 1.381e-23
    intensity = (2*h*c**2 / lam_m**5) / (np.exp(h*c/(lam_m*k*T)) - 1)
    return intensity / intensity.max()  # normalize

continuous = planck_visible(wavelengths)

# Fraunhofer lines (element, wavelength in nm, relative depth)
fraunhofer = [
    ('Ca K',   393.4, 0.6),
    ('Ca H',   396.8, 0.5),
    ('Hδ',    410.2, 0.3),
    ('Ca g',   422.7, 0.25),
    ('Hγ',    434.0, 0.35),
    ('Fe',     438.4, 0.2),
    ('Hβ',    486.1, 0.4),
    ('Mg b',   517.3, 0.3),
    ('Fe',     527.0, 0.2),
    ('Na D1',  589.0, 0.55),
    ('Na D2',  589.6, 0.55),
    ('Hα',    656.3, 0.5),
    ('O₂',    687.0, 0.35),
    ('O₂',    718.0, 0.2),
]

def wavelength_to_rgb(w):
    if 380 <= w < 440:
        r, g, b = -(w-440)/60, 0.0, 1.0
    elif 440 <= w < 490:
        r, g, b = 0.0, (w-440)/50, 1.0
    elif 490 <= w < 510:
        r, g, b = 0.0, 1.0, -(w-510)/20
    elif 510 <= w < 580:
        r, g, b = (w-510)/70, 1.0, 0.0
    elif 580 <= w < 645:
        r, g, b = 1.0, -(w-645)/65, 0.0
    elif 645 <= w <= 750:
        r, g, b = 1.0, 0.0, 0.0
    else:
        r, g, b = 0.2, 0.2, 0.2
    return (r, g, b)

# Apply absorption lines
absorbed = continuous.copy()
for name, lam_center, depth in fraunhofer:
    # Gaussian absorption profile
    sigma = 0.8  # line width in nm
    absorption = depth * np.exp(-0.5 * ((wavelengths - lam_center) / sigma) ** 2)
    absorbed *= (1 - absorption)

fig, axes = plt.subplots(3, 1, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Continuous spectrum (before absorption)
ax = axes[0]
ax.set_facecolor('#111827')
for i in range(len(wavelengths) - 1):
    ax.fill_between(wavelengths[i:i+2], 0, continuous[i:i+2],
                    color=wavelength_to_rgb(wavelengths[i]), alpha=0.8)
ax.set_title('Continuous Solar Spectrum (from core)', color='white', fontsize=12)
ax.set_ylabel('Intensity', color='white')
ax.set_xlim(380, 750)
ax.tick_params(colors='gray')

# Plot 2: Absorption spectrum (after passing through atmosphere)
ax2 = axes[1]
ax2.set_facecolor('#111827')
for i in range(len(wavelengths) - 1):
    color = wavelength_to_rgb(wavelengths[i])
    ax2.fill_between(wavelengths[i:i+2], 0, absorbed[i:i+2],
                     color=color, alpha=0.8)
# Label Fraunhofer lines
for name, lam, depth in fraunhofer:
    if depth > 0.25:
        ax2.annotate(name, xy=(lam, 0), xytext=(lam, -0.15),
                    color='#f59e0b', fontsize=7, ha='center', fontweight='bold')
ax2.set_title('Solar Absorption Spectrum (Fraunhofer lines)', color='white', fontsize=12)
ax2.set_ylabel('Intensity', color='white')
ax2.set_xlim(380, 750)
ax2.tick_params(colors='gray')

# Plot 3: The absorption profile itself
ax3 = axes[2]
ax3.set_facecolor('#111827')
ax3.plot(wavelengths, continuous - absorbed, color='#ef4444', linewidth=1)
ax3.fill_between(wavelengths, 0, continuous - absorbed, color='#ef4444', alpha=0.3)
for name, lam, depth in fraunhofer:
    if depth > 0.3:
        ax3.annotate(name, xy=(lam, depth * 0.9), xytext=(lam, depth + 0.1),
                    color='#fbbf24', fontsize=8, ha='center',
                    arrowprops=dict(arrowstyle='->', color='#fbbf24', lw=0.8))
ax3.set_title('Absorbed Light (what the atmosphere removed)', color='white', fontsize=12)
ax3.set_xlabel('Wavelength (nm)', color='white')
ax3.set_ylabel('Absorption', color='white')
ax3.set_xlim(380, 750)
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fraunhofer Lines in the Solar Spectrum:")
print(f"{'Line':<8} {'Element':<12} {'Wavelength':>10} {'Depth':>8}")
print("-" * 42)
for name, lam, depth in fraunhofer:
    elem = name.split()[0] if ' ' in name else name.rstrip('0123456789')
    print(f"{name:<8} {'':>12} {lam:>8.1f} nm  {depth:>6.0%}")

print(f"\\nTotal lines shown: {len(fraunhofer)}")
print("The real solar spectrum has thousands of absorption lines.")
print("Notice Na D lines at 589nm -- right in the golden region.")
print("The golden deer's color comes from wavelengths BETWEEN absorption lines.")
print("Starlight is an open book -- absorption lines are the text.")`,
      challenge: 'Add a "mystery star" with a different temperature (e.g., 3500K, a red dwarf). Plot its absorption spectrum and compare the relative line depths. How does temperature affect which absorption lines are strongest?',
      successHint: 'Absorption spectroscopy is arguably the most important analytical technique in all of science. It allows us to determine the composition of objects we can never touch — from distant stars to exoplanet atmospheres. Every dark line is a message written by atoms.',
    },
    {
      title: 'Fluorescence and phosphorescence — why some materials glow under UV',
      concept: `Some materials absorb light at one wavelength and re-emit it at a longer wavelength. This is fluorescence. Shine UV light (invisible, ~365nm) on a fluorescent mineral, a highlighter pen, or certain biological molecules, and they glow visibly — often in vivid greens, blues, or oranges. The key principle: the emitted photon always has less energy (longer wavelength) than the absorbed photon. The difference is lost as heat (vibrational energy in the molecule).

The process works like this: (1) a UV photon excites an electron to a high energy state, (2) the electron quickly loses some energy to molecular vibrations (non-radiative relaxation), dropping to the lowest level of the excited state, (3) the electron then falls back to the ground state, emitting a photon. Because step 2 lost some energy, the emitted photon has less energy (longer wavelength) than the absorbed one. This wavelength shift is called the Stokes shift.

Phosphorescence is the slow cousin of fluorescence. In phosphorescent materials, the excited electron gets "trapped" in a metastable state (a triplet state, in quantum terms). It can stay there for seconds, minutes, or even hours before finally emitting a photon. This is why glow-in-the-dark toys continue to glow after the light source is removed. Fluorescence stops instantly when you turn off the UV lamp; phosphorescence persists.`,
      analogy: 'Fluorescence is like a ball bouncing down stairs. You throw it to the third floor (UV absorption). It loses a little energy bouncing off the landing (vibrational relaxation), then falls to the ground floor and bounces back up to the second floor (visible emission). It can never bounce higher than where it started — the emitted light is always lower energy than the absorbed light. Phosphorescence is like the ball getting stuck on a landing for a while before finally continuing its descent.',
      storyConnection: 'The legends say the golden deer of Kamakhya glowed even in dim forest shade, as if carrying its own inner light. Many minerals in the hills of Assam are fluorescent — they absorb UV from sunlight and re-emit visible golden-yellow light. A deer moving through dappled sunlight near fluorescent rocks could appear to glow with an otherworldly golden aura. The "magical" glow has a photophysical explanation.',
      checkQuestion: 'A fluorescent dye absorbs at 350nm (UV) and emits at 520nm (green). Could it ever emit at 300nm (shorter than what it absorbed)?',
      checkAnswer: 'No. The emitted photon must have less energy (longer wavelength) than the absorbed photon because some energy is always lost to vibrational relaxation (Stokes shift). Emitting at 300nm would require more energy than the 350nm photon provided, violating conservation of energy. The emitted wavelength is always longer (redder) than the absorbed wavelength.',
      codeIntro: 'Model the Jablonski energy diagram and simulate fluorescence/phosphorescence emission with Stokes shifts.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate fluorescence: absorption at UV, emission at visible
# Using Gaussian line shapes

wavelengths = np.linspace(250, 700, 2000)

def gaussian(x, center, width, amplitude):
    return amplitude * np.exp(-0.5 * ((x - center) / width) ** 2)

# Fluorescent dye properties
materials = [
    {
        'name': 'Fluorescein (highlighter yellow)',
        'abs_peak': 490, 'abs_width': 25, 'abs_color': '#3b82f6',
        'em_peak': 520, 'em_width': 30, 'em_color': '#22c55e',
        'stokes': 30,
    },
    {
        'name': 'Rhodamine B (laser red)',
        'abs_peak': 540, 'abs_width': 25, 'abs_color': '#22c55e',
        'em_peak': 580, 'em_width': 30, 'em_color': '#f59e0b',
        'stokes': 40,
    },
    {
        'name': 'DAPI (DNA stain, UV-excited)',
        'abs_peak': 360, 'abs_width': 30, 'abs_color': '#a855f7',
        'em_peak': 460, 'em_width': 35, 'em_color': '#3b82f6',
        'stokes': 100,
    },
]

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot fluorescent spectra for each material
for idx, mat in enumerate(materials):
    ax = axes[idx // 2, idx % 2]
    ax.set_facecolor('#111827')

    abs_spectrum = gaussian(wavelengths, mat['abs_peak'], mat['abs_width'], 1.0)
    em_spectrum = gaussian(wavelengths, mat['em_peak'], mat['em_width'], 0.7)

    ax.fill_between(wavelengths, 0, abs_spectrum, color=mat['abs_color'],
                    alpha=0.4, label=f"Absorption ({mat['abs_peak']}nm)")
    ax.plot(wavelengths, abs_spectrum, color=mat['abs_color'], linewidth=2)

    ax.fill_between(wavelengths, 0, em_spectrum, color=mat['em_color'],
                    alpha=0.4, label=f"Emission ({mat['em_peak']}nm)")
    ax.plot(wavelengths, em_spectrum, color=mat['em_color'], linewidth=2)

    # Mark Stokes shift
    ax.annotate('', xy=(mat['em_peak'], 0.85), xytext=(mat['abs_peak'], 0.85),
                arrowprops=dict(arrowstyle='<->', color='#fbbf24', lw=2))
    ax.text((mat['abs_peak'] + mat['em_peak'])/2, 0.9,
            f'Stokes shift: {mat["stokes"]}nm', ha='center', color='#fbbf24',
            fontsize=9, fontweight='bold')

    ax.set_title(mat['name'], color='white', fontsize=11)
    ax.set_xlabel('Wavelength (nm)', color='white')
    ax.set_ylabel('Intensity', color='white')
    ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
    ax.tick_params(colors='gray')

# Plot 4: Phosphorescence decay curve
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')

time = np.linspace(0, 10, 500)  # seconds

# Fluorescence: nanosecond lifetime (appears instant at this scale)
fluor_decay = np.exp(-time / 1e-8)  # ~0 immediately
# Phosphorescence: second-scale lifetime
phos_decays = {
    'Fast phosphor (τ=0.5s)': np.exp(-time / 0.5),
    'Medium phosphor (τ=2s)': np.exp(-time / 2.0),
    'Glow-in-dark (τ=5s)': np.exp(-time / 5.0),
}

colors = ['#22c55e', '#f59e0b', '#ef4444']
for (name, decay), color in zip(phos_decays.items(), colors):
    ax4.plot(time, decay, color=color, linewidth=2, label=name)

ax4.axvline(0, color='#a855f7', linewidth=1, linestyle='--', alpha=0.5, label='Light turned OFF')
ax4.set_title('Phosphorescence Decay (after light off)', color='white', fontsize=11)
ax4.set_xlabel('Time (seconds)', color='white')
ax4.set_ylabel('Emission intensity', color='white')
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Fluorescence vs Phosphorescence:")
print("-" * 50)
print(f"{'Property':<25} {'Fluorescence':<15} {'Phosphorescence'}")
print(f"{'Lifetime':<25} {'ns (10⁻⁹ s)':<15} {'ms to hours'}")
print(f"{'Spin state':<25} {'Singlet→Singlet':<15} {'Triplet→Singlet'}")
print(f"{'After light off':<25} {'Stops instantly':<15} {'Continues glowing'}")
print(f"{'Stokes shift':<25} {'Small (10-50nm)':<15} {'Large (50-200nm)'}")
print()
print("Stokes shifts for our examples:")
for mat in materials:
    abs_E = 1240 / mat['abs_peak']
    em_E = 1240 / mat['em_peak']
    loss = abs_E - em_E
    print(f"  {mat['name']}: absorb {mat['abs_peak']}nm ({abs_E:.2f}eV) "
          f"→ emit {mat['em_peak']}nm ({em_E:.2f}eV), "
          f"energy lost to heat: {loss:.2f}eV")
print()
print("The golden glow in legends often matches fluorescent mineral emission.")
print("Calcite and willemite fluoresce golden-yellow under UV sunlight.")`,
      challenge: 'Create a simulation of a "glow stick" reaction: model the chemiluminescence as fluorescence excited by a chemical reaction instead of UV light. Show the emission spectrum changing color as the dye concentration decreases over time (blue-shifting the emission peak).',
      successHint: 'Fluorescence and phosphorescence demonstrate that matter does not just passively reflect light — it actively transforms it. The Stokes shift is a direct measurement of energy dissipation at the molecular level. Fluorescence microscopy and fluorescent markers have revolutionized biology.',
    },
    {
      title: 'Polarization of light — waves vibrating in one direction',
      concept: `Light is a transverse wave — its electric field oscillates perpendicular to the direction of travel. Ordinary sunlight is unpolarized: the electric field vibrates in all directions perpendicular to the beam. A polarizer is a filter that transmits only the component vibrating in one specific direction, turning unpolarized light into polarized light.

Malus's Law describes what happens when polarized light hits a second polarizer (analyzer) at angle θ: I = I₀ cos²(θ). At θ=0° (aligned), all light passes through. At θ=90° (crossed), no light passes — complete extinction. This is why rotating one lens of polarized sunglasses blocks or transmits glare. The cos² dependence was a triumph of wave optics and is still used today in LCD screens, photography, and 3D cinema.

Polarization has profound applications. LCD screens work by sandwiching liquid crystals between two crossed polarizers — applying voltage rotates the polarization, switching pixels on and off. 3D movies use circular polarization: the left-eye image is left-circularly polarized, the right-eye image is right-circularly polarized, and the glasses separate them. Polarimetry in astronomy reveals magnetic field structures in nebulae. Even some animals (bees, mantis shrimp) can see polarized light and use it for navigation.`,
      analogy: 'Imagine a rope threaded through a picket fence. If you shake the rope vertically, the wave passes through the vertical slots. If you shake it horizontally, the fence blocks it. The fence is a polarizer — it only transmits vibrations aligned with its slots. Two fences at right angles block everything. That is exactly what crossed polarizers do to light waves.',
      storyConnection: 'The golden light reflecting off the deer\'s coat would be partially polarized. When light reflects off a surface at a specific angle (Brewster\'s angle), the reflected beam becomes strongly polarized. A deer\'s fur has a layered structure that preferentially reflects certain polarizations. Photographers use polarizing filters to cut glare from animal fur and water surfaces — revealing the true golden color beneath surface reflections.',
      checkQuestion: 'Two polarizers are crossed at 90°, blocking all light. You insert a third polarizer between them at 45° to both. What happens and why?',
      checkAnswer: 'Light comes through! The first polarizer creates vertically polarized light. The 45° middle polarizer transmits the cos²(45°) = 50% component along its axis, now polarized at 45°. The final polarizer (horizontal) transmits cos²(45°) = 50% of that. So 25% of the post-first-polarizer light gets through. Adding a filter between two blockers actually increases transmission — a beautifully counterintuitive result.',
      codeIntro: 'Simulate Malus\'s Law, crossed polarizers, and the three-polarizer paradox with visual plots.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Malus's Law: I = I0 * cos^2(theta)
angles_deg = np.linspace(0, 360, 1000)
angles_rad = np.radians(angles_deg)
malus = np.cos(angles_rad) ** 2

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Malus's Law
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.plot(angles_deg, malus, color='#f59e0b', linewidth=2.5)
ax.fill_between(angles_deg, 0, malus, color='#f59e0b', alpha=0.15)
ax.axhline(0.5, color='gray', linestyle='--', linewidth=0.8)
ax.axhline(0, color='gray', linewidth=0.5)
for angle in [0, 90, 180, 270, 360]:
    ax.axvline(angle, color='gray', linestyle=':', linewidth=0.5, alpha=0.5)
ax.set_xlabel('Analyzer angle θ (degrees)', color='white')
ax.set_ylabel('Transmitted intensity I/I₀', color='white')
ax.set_title("Malus's Law: I = I₀cos²θ", color='white', fontsize=12, fontweight='bold')
ax.tick_params(colors='gray')

# Plot 2: Polar plot of Malus's Law
ax2 = axes[0, 1]
ax2.remove()
ax2 = fig.add_subplot(2, 2, 2, projection='polar')
ax2.set_facecolor('#111827')
ax2.plot(angles_rad, malus, color='#f59e0b', linewidth=2)
ax2.fill(angles_rad, malus, color='#f59e0b', alpha=0.2)
ax2.set_title("Malus's Law (polar)", color='white', fontsize=11, pad=15)
ax2.tick_params(colors='gray')
ax2.set_rmax(1.0)

# Plot 3: Three-polarizer experiment
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')

# Vary the middle polarizer angle from 0 to 90
mid_angles = np.linspace(0, 90, 200)
# Two crossed polarizers: first at 0, last at 90
# Light after first: I0 (polarized at 0)
# After middle at angle theta: I0 * cos^2(theta)
# After last at 90: I0 * cos^2(theta) * cos^2(90-theta)
two_crossed = np.zeros_like(mid_angles)  # no middle: zero transmission
three_pol = np.cos(np.radians(mid_angles))**2 * np.cos(np.radians(90 - mid_angles))**2

ax3.plot(mid_angles, three_pol, color='#22c55e', linewidth=2.5,
         label='With middle polarizer')
ax3.axhline(0, color='#ef4444', linewidth=2, linestyle='--',
            label='Without middle (zero)')
ax3.axvline(45, color='#a855f7', linewidth=1, linestyle=':',
            label='Optimum at 45°')
# Mark maximum
max_val = np.max(three_pol)
ax3.plot(45, max_val, 'o', color='#fbbf24', markersize=10, zorder=5)
ax3.annotate(f'Max = {max_val:.2%}', xy=(45, max_val),
             xytext=(55, max_val + 0.05), color='#fbbf24', fontsize=10,
             arrowprops=dict(arrowstyle='->', color='#fbbf24'))
ax3.set_xlabel('Middle polarizer angle (degrees)', color='white')
ax3.set_ylabel('Transmitted fraction', color='white')
ax3.set_title('Three-Polarizer Paradox', color='white', fontsize=12, fontweight='bold')
ax3.legend(fontsize=9, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax3.tick_params(colors='gray')

# Plot 4: N-polarizer sequence (approaching 100% with many steps)
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')
n_polarizers = np.arange(2, 51)
transmissions = []
for n in n_polarizers:
    # n polarizers evenly spaced from 0 to 90 degrees
    step = 90 / (n - 1)
    T = 1.0
    for i in range(1, n):
        T *= np.cos(np.radians(step)) ** 2
    transmissions.append(T)

ax4.plot(n_polarizers, transmissions, color='#3b82f6', linewidth=2.5)
ax4.fill_between(n_polarizers, 0, transmissions, color='#3b82f6', alpha=0.15)
ax4.axhline(1.0, color='gray', linestyle='--', linewidth=0.8)
ax4.set_xlabel('Number of polarizers (0° to 90°)', color='white')
ax4.set_ylabel('Total transmission', color='white')
ax4.set_title('N Polarizers: Approaching 100%', color='white', fontsize=12, fontweight='bold')
ax4.tick_params(colors='gray')
ax4.annotate(f'N=3: {transmissions[1]:.1%}', xy=(3, transmissions[1]),
             xytext=(10, transmissions[1]-0.1), color='#fbbf24', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#fbbf24'))
ax4.annotate(f'N=50: {transmissions[-1]:.1%}', xy=(50, transmissions[-1]),
             xytext=(35, transmissions[-1]-0.15), color='#fbbf24', fontsize=9,
             arrowprops=dict(arrowstyle='->', color='#fbbf24'))

plt.tight_layout()
plt.show()

print("Malus's Law: I = I₀ cos²(θ)")
print("-" * 50)
for angle in [0, 30, 45, 60, 90]:
    T = np.cos(np.radians(angle))**2
    print(f"  θ = {angle:>3}°  →  I/I₀ = {T:.4f} ({T:.1%})")

print(f"\\nThree-polarizer paradox:")
print(f"  Two crossed polarizers (0° + 90°): 0% transmission")
print(f"  Add middle at 45°: {0.25:.1%} transmission!")
print(f"  Adding a filter INCREASES total light — counterintuitive.")

print(f"\\nN-polarizer limit (0° to 90° in N steps):")
for n in [3, 5, 10, 20, 50]:
    step = 90 / (n-1)
    T = np.cos(np.radians(step))**(2*(n-1))
    print(f"  N={n:>2}: {T:.4f} ({T:.1%})")
print("  N→∞: 100% (each step is infinitesimal → cos²(ε)≈1)")
print()
print("This is the physics behind LCD screens:")
print("Liquid crystals rotate polarization by controlled amounts.")
print("No voltage = twisted crystal = light passes. Voltage = aligned = light blocked.")`,
      challenge: 'Simulate Brewster\'s angle: at what angle of incidence does reflected light become perfectly polarized? Plot reflectance vs angle for s-polarization and p-polarization using the Fresnel equations (assume glass, n=1.5).',
      successHint: 'Polarization reveals that light is a transverse wave with a specific vibration direction. This property is invisible to our eyes but measurable with simple filters. LCD screens, 3D cinema, glare reduction, and stress analysis all exploit polarization.',
    },
    {
      title: 'Quantum optics introduction — photons, the photoelectric effect, and wave-particle duality',
      concept: `Classical wave optics explains interference, diffraction, and polarization beautifully. But it fails catastrophically in certain situations. The photoelectric effect — discovered experimentally by Hertz and explained theoretically by Einstein in 1905 — was the first crack in the classical edifice. When you shine light on a metal surface, electrons are ejected. Classical wave theory predicts that brighter light should give electrons more energy. But experiments showed something different: the electron energy depends only on the light's frequency, not its brightness. Below a threshold frequency, no electrons are emitted no matter how bright the light.

Einstein's explanation: light comes in discrete packets — photons — each carrying energy E = hf. A single photon either has enough energy to free an electron (hf > φ, the work function) or it does not. More photons (brighter light) eject more electrons but do not give each one more energy. This was revolutionary: light behaves as particles when being absorbed or emitted, but as waves when propagating. This is wave-particle duality.

The implications are staggering. Every quantum of light is both a wave (with wavelength and frequency) and a particle (with energy and momentum). The double-slit experiment makes this visceral: send photons one at a time through two slits, and each lands as a single dot (particle), but after thousands of dots, an interference pattern emerges (wave). No classical object does both. This duality is not a limitation of our understanding — it is a fundamental feature of nature.`,
      analogy: 'Imagine rain falling on a pond. Each raindrop is a discrete particle that makes a single splash (like a photon hitting a detector). But the ripples from many drops overlap and interfere, creating wave patterns on the surface. If you look at one splash, you see a particle. If you look at the pattern of many splashes, you see waves. Light does both — and that is not a metaphor, it is literal.',
      storyConnection: 'The golden deer of Kamakhya was said to shimmer and shift, sometimes appearing solid, sometimes dissolving into golden light. This mirrors the deepest truth of quantum optics: light is neither purely a wave nor purely a particle — it is something more fundamental that manifests as each depending on how you observe it. The deer\'s golden glow is made of individual photons, each carrying exactly 2.14 eV of energy, yet collectively they create the smooth, wave-like golden shimmer that enchanted all who saw it.',
      checkQuestion: 'A UV lamp (λ=250nm) and a red lamp (λ=650nm) both shine on a metal with work function φ=3.0 eV. Which one ejects electrons, and what is the maximum kinetic energy of the ejected electrons?',
      checkAnswer: 'UV photon energy: E = 1240/250 = 4.96 eV. Since 4.96 > 3.0, electrons are ejected with max KE = 4.96 - 3.0 = 1.96 eV. Red photon energy: E = 1240/650 = 1.91 eV. Since 1.91 < 3.0, no electrons are ejected regardless of how bright the red lamp is. This is the key insight Einstein won the Nobel Prize for.',
      codeIntro: 'Simulate the photoelectric effect and the double-slit experiment with single photons building up an interference pattern.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.patch.set_facecolor('#1f2937')

# --- Plot 1: Photoelectric effect ---
ax = axes[0, 0]
ax.set_facecolor('#111827')

work_functions = {
    'Cesium (φ=2.1 eV)': 2.1,
    'Sodium (φ=2.3 eV)': 2.3,
    'Copper (φ=4.7 eV)': 4.7,
}
colors_pe = ['#22c55e', '#f59e0b', '#3b82f6']

frequencies = np.linspace(0, 2e15, 500)  # Hz
h = 6.626e-34
eV = 1.602e-19

for (name, phi), color in zip(work_functions.items(), colors_pe):
    # KE_max = hf - phi (only when hf > phi)
    energies = h * frequencies / eV  # photon energy in eV
    KE = np.maximum(0, energies - phi)
    # Threshold frequency
    f_thresh = phi * eV / h
    ax.plot(frequencies / 1e14, KE, color=color, linewidth=2, label=name)
    ax.axvline(f_thresh / 1e14, color=color, linewidth=1, linestyle=':', alpha=0.5)

ax.set_xlabel('Frequency (×10¹⁴ Hz)', color='white')
ax.set_ylabel('Max electron KE (eV)', color='white')
ax.set_title('Photoelectric Effect: KE = hf - φ', color='white', fontsize=12, fontweight='bold')
ax.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.set_ylim(-0.5, 6)

# --- Plot 2: Photon energy for golden light ---
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')

wavelengths_nm = np.linspace(200, 800, 500)
photon_energies = 1240 / wavelengths_nm  # eV

ax2.plot(wavelengths_nm, photon_energies, color='#a855f7', linewidth=2)
ax2.fill_between(wavelengths_nm, 0, photon_energies,
                 where=(wavelengths_nm >= 380) & (wavelengths_nm <= 750),
                 color='#f59e0b', alpha=0.15, label='Visible range')
# Mark golden deer wavelength
golden_E = 1240 / 580
ax2.plot(580, golden_E, 'o', color='#fbbf24', markersize=12, zorder=5,
         label=f'Golden deer (580nm, {golden_E:.2f}eV)')
ax2.set_xlabel('Wavelength (nm)', color='white')
ax2.set_ylabel('Photon energy (eV)', color='white')
ax2.set_title('Photon Energy vs Wavelength', color='white', fontsize=12)
ax2.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

# --- Plot 3: Double-slit single-photon simulation ---
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')

np.random.seed(42)
n_photons = 5000
wavelength = 580e-9  # golden light
slit_sep = 0.2e-3    # 0.2mm
screen_dist = 1.0    # 1m

# Probability distribution: I = cos^2(pi*d*sin(theta)/lambda)
# For small angles: sin(theta) ~ x/L
x_screen = np.linspace(-0.01, 0.01, 1000)  # +/- 1cm on screen
# Intensity pattern (double-slit)
phase = np.pi * slit_sep * x_screen / (wavelength * screen_dist)
intensity = np.cos(phase) ** 2
# Add single-slit envelope
a = 0.05e-3  # slit width
single_phase = np.pi * a * x_screen / (wavelength * screen_dist)
envelope = np.sinc(single_phase / np.pi) ** 2
intensity *= envelope
intensity /= intensity.sum()

# Sample photon positions from this distribution
photon_x = np.random.choice(x_screen, size=n_photons, p=intensity)
photon_y = np.random.uniform(-0.5, 0.5, n_photons)

# Show buildup in stages
stages = [50, 500, 5000]
for i, n in enumerate(stages):
    alpha = 0.3 + 0.3 * i
    ax3.scatter(photon_x[:n] * 1000, photon_y[:n], s=0.3, alpha=alpha,
                color='#fbbf24', rasterized=True)

ax3.set_xlabel('Position on screen (mm)', color='white')
ax3.set_ylabel('(random y for visibility)', color='white')
ax3.set_title(f'Double Slit: {n_photons} single photons', color='white', fontsize=12, fontweight='bold')
ax3.tick_params(colors='gray')

# --- Plot 4: Interference pattern emerging ---
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')

for n_show, color, label in [(50, '#ef4444', '50 photons'),
                              (500, '#f59e0b', '500 photons'),
                              (5000, '#22c55e', '5000 photons')]:
    counts, bins = np.histogram(photon_x[:n_show], bins=100)
    centers = (bins[:-1] + bins[1:]) / 2
    ax4.plot(centers * 1000, counts / counts.max(), color=color, linewidth=1.5,
             label=label, alpha=0.8)

# Theoretical curve
theory_x = np.linspace(-0.01, 0.01, 1000)
theory_phase = np.pi * slit_sep * theory_x / (wavelength * screen_dist)
theory_I = np.cos(theory_phase)**2
single_p = np.pi * a * theory_x / (wavelength * screen_dist)
theory_I *= np.sinc(single_p / np.pi)**2
ax4.plot(theory_x * 1000, theory_I / theory_I.max(), color='white',
         linewidth=1, linestyle='--', label='Theory (wave)', alpha=0.7)

ax4.set_xlabel('Position on screen (mm)', color='white')
ax4.set_ylabel('Normalized counts', color='white')
ax4.set_title('Wave Pattern Emerges from Particles', color='white', fontsize=12, fontweight='bold')
ax4.legend(fontsize=8, facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax4.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Photoelectric Effect Summary:")
print("-" * 50)
for (name, phi) in work_functions.items():
    f_thresh = phi * eV / h
    lam_thresh = 3e8 / f_thresh * 1e9
    print(f"  {name}")
    print(f"    Threshold: f = {f_thresh:.2e} Hz, λ = {lam_thresh:.0f} nm")

print(f"\\nGolden deer photon (580nm):")
print(f"  Energy: {1240/580:.2f} eV")
print(f"  Could eject electrons from cesium ({1240/580-2.1:.2f} eV kinetic)")
print(f"  Could eject electrons from sodium ({1240/580-2.3:.2f} eV kinetic)")
print(f"  Cannot eject from copper (needs 4.7 eV, has only {1240/580:.2f} eV)")

print(f"\\nDouble-slit experiment:")
print(f"  Each photon arrives as a single dot (PARTICLE)")
print(f"  Pattern of many photons shows interference fringes (WAVE)")
print(f"  This is wave-particle duality -- not a metaphor, but physics.")
print(f"  The golden deer glows with ~10¹⁶ photons per second,")
print(f"  each one a quantum, collectively a golden wave.")`,
      challenge: 'Simulate the single-slit diffraction pattern and compare it to the double-slit pattern. Then simulate what happens when you close one slit — the interference pattern disappears. This demonstrates that each photon must "know" about both slits.',
      successHint: 'Quantum optics is where the story of light reaches its deepest chapter. Light is not a wave. Light is not a particle. Light is a quantum field that manifests as each depending on the experiment. The golden deer\'s shimmer is 10^16 photons per second, each one a quantum of energy, collectively creating the wave-like golden glow.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (optics fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real optics and spectroscopy simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python + NumPy</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
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
