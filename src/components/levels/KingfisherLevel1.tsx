import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function KingfisherLevel1() {
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
      title: 'Pigment vs structural color — two ways to make color',
      concept: `There are two fundamentally different ways to produce color in nature:

**Pigment color**: Molecules absorb certain wavelengths of light and reflect others. Chlorophyll absorbs red and blue, reflects green — so leaves look green. Melanin absorbs most wavelengths — so hair looks dark. Pigments work by **subtraction**: removing colors from white light.

**Structural color**: Nanoscale structures interfere with light waves, selectively reflecting certain wavelengths. No pigment molecules needed. The blue of a kingfisher's feathers, the iridescence of a soap bubble, the shimmer of an opal — all structural color.

Key difference: pigment color **fades** (molecules break down in sunlight), but structural color **doesn't** (the nanostructure remains intact). A 40-million-year-old beetle fossil can still show iridescent structural color. Pigment-based colors in similar fossils are long gone.`,
      analogy: 'Pigment color is like a colored filter on a flashlight — it removes certain colors from white light. Structural color is like a prism — it separates white light into its component colors using physical structure, not chemistry. A filter eventually degrades; a prism works forever.',
      storyConnection: 'The kingfisher\'s famous blue coat isn\'t blue paint — it\'s architecture. There\'s no blue pigment in a kingfisher feather. If you grind up a blue feather, the powder is brown (melanin, the only pigment present). The blue exists only because of the nanostructure in the feather barbs.',
      checkQuestion: 'If you crush a blue kingfisher feather into powder, what color is the powder? Why?',
      checkAnswer: 'Brown. The only pigment in the feather is melanin (brown/black). The blue color comes from the feather\'s nanostructure, which is destroyed by crushing. No structure = no structural color. Only the pigment color remains. This is the definitive test for structural vs. pigment color.',
      codeIntro: 'Visualize the visible spectrum and how pigments subtract color from white light.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
fig.patch.set_facecolor('#1f2937')

# 1. The visible spectrum
ax1.set_facecolor('#111827')
wavelengths = np.linspace(380, 750, 1000)

def wavelength_to_rgb(wl):
    """Approximate conversion of wavelength to RGB."""
    if 380 <= wl < 440:
        r, g, b = -(wl-440)/(440-380), 0, 1
    elif 440 <= wl < 490:
        r, g, b = 0, (wl-440)/(490-440), 1
    elif 490 <= wl < 510:
        r, g, b = 0, 1, -(wl-510)/(510-490)
    elif 510 <= wl < 580:
        r, g, b = (wl-510)/(580-510), 1, 0
    elif 580 <= wl < 645:
        r, g, b = 1, -(wl-645)/(645-580), 0
    elif 645 <= wl <= 750:
        r, g, b = 1, 0, 0
    else:
        r, g, b = 0, 0, 0
    return (r, g, b)

for i, wl in enumerate(wavelengths):
    ax1.axvline(wl, color=wavelength_to_rgb(wl), linewidth=1.5)

ax1.set_xlim(380, 750)
ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_title('The Visible Spectrum: 380nm (violet) to 750nm (red)', color='white', fontsize=13)
ax1.set_yticks([])
ax1.tick_params(colors='gray')

# Label regions
regions = [('Violet', 410), ('Blue', 470), ('Cyan', 500), ('Green', 540),
           ('Yellow', 580), ('Orange', 610), ('Red', 680)]
for name, pos in regions:
    ax1.text(pos, 0.5, name, ha='center', va='center', color='white', fontsize=8,
             fontweight='bold', rotation=90)

# 2. Pigment absorption spectra
ax2.set_facecolor('#111827')
wl = np.linspace(380, 750, 500)

# Chlorophyll: absorbs red and blue, reflects green
chlorophyll_absorption = np.exp(-((wl-430)/30)**2) * 0.9 + np.exp(-((wl-660)/25)**2) * 0.8
chlorophyll_reflection = 1 - chlorophyll_absorption

# Melanin: absorbs broadly, more at shorter wavelengths
melanin_absorption = 0.9 * np.exp(-(wl-380)/200)
melanin_reflection = 1 - melanin_absorption

# Carotenoid: absorbs blue/green, reflects yellow/red
carotenoid_absorption = np.exp(-((wl-450)/40)**2) * 0.85
carotenoid_reflection = 1 - carotenoid_absorption

ax2.plot(wl, chlorophyll_reflection, color='#22c55e', linewidth=2, label='Chlorophyll (green)')
ax2.plot(wl, melanin_reflection, color='#8b7355', linewidth=2, label='Melanin (brown/black)')
ax2.plot(wl, carotenoid_reflection, color='#f59e0b', linewidth=2, label='Carotenoid (yellow/orange)')

ax2.fill_between(wl, chlorophyll_reflection, alpha=0.1, color='#22c55e')
ax2.set_xlabel('Wavelength (nm)', color='white')
ax2.set_ylabel('Reflectance', color='white')
ax2.set_title('Pigment Reflectance: What They Reflect = What You See', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Pigment color: selective absorption (subtractive)")
print("  Chlorophyll reflects green (absorbs red + blue)")
print("  Melanin reflects very little (absorbs broadly = dark)")
print("  Carotenoid reflects yellow/orange (absorbs blue)")
print()
print("Structural color: interference (no pigment needed)")
print("  Kingfisher blue: ~470nm reflected by nanostructure")
print("  No blue pigment exists in the feather")`,
      challenge: 'Leaves turn red/orange in autumn. Is this pigment or structural color? What\'s happening chemically? (Hint: chlorophyll breaks down, revealing other pigments that were there all along.)',
      successHint: 'Understanding the difference between pigment and structural color is the gateway to nanophotonics, biomimicry, and materials science. The kingfisher\'s feather is a physics lesson wearing a biological disguise.',
    },
    {
      title: 'Why feathers are iridescent — the thin film effect',
      concept: `When light hits a thin transparent film (like a soap bubble or an oil slick), something remarkable happens: it reflects from **both** the top and bottom surfaces. The two reflected beams **interfere** with each other.

- If the beams are in phase (crests align): **constructive interference** — that color is bright
- If the beams are out of phase (crest meets trough): **destructive interference** — that color is cancelled

The condition for constructive interference depends on:
- **Film thickness** (d): thicker films reflect longer wavelengths
- **Angle of viewing**: changing the angle changes the path length
- **Refractive index** (n): how much the film bends light

Formula: **2nd cos(θ) = mλ** (where m is an integer, λ is wavelength)

This is why soap bubbles show rainbow colors: the film thickness varies across the bubble, reflecting different wavelengths at different spots. It's also why iridescent feathers change color when you tilt them — the viewing angle changes.`,
      analogy: 'Imagine two people clapping in a room. If they clap at the same moment (in phase), the sound is loud (constructive interference). If one claps exactly when the other\'s hands are apart (out of phase), they partially cancel (destructive interference). Light from thin film surfaces works the same way — the two reflected "claps" of light either reinforce or cancel each other.',
      storyConnection: 'The kingfisher\'s blue coat shifts slightly as the bird moves — sometimes more blue-green, sometimes more violet-blue. This iridescence is the hallmark of structural color: the reflected wavelength depends on the viewing angle. A pigment-colored bird (like a robin\'s red breast) looks the same from every angle.',
      checkQuestion: 'A soap bubble looks different colors at different spots. Why?',
      checkAnswer: 'The film thickness varies across the bubble — thicker at the bottom (gravity pulls soap down), thinner at the top. Different thicknesses reflect different wavelengths constructively. Just before the bubble pops, the top gets so thin it becomes "black" — too thin for any visible wavelength to constructively interfere.',
      codeIntro: 'Simulate thin film interference and show how color depends on thickness and angle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def thin_film_reflectance(wavelength, thickness, n_film=1.5, angle=0):
    """Calculate reflectance of a thin film using interference."""
    theta_film = np.arcsin(np.sin(angle) / n_film)
    path_diff = 2 * n_film * thickness * np.cos(theta_film)
    phase_diff = 2 * np.pi * path_diff / wavelength + np.pi  # +pi for phase shift at interface
    reflectance = 4 * 0.04 * np.sin(phase_diff / 2)**2  # simplified
    return reflectance

wavelengths = np.linspace(380, 750, 500)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Reflectance vs wavelength for different thicknesses
ax1.set_facecolor('#111827')
thicknesses = [100, 150, 200, 250, 300]  # nm
colors_t = ['#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

for d, color in zip(thicknesses, colors_t):
    R = np.array([thin_film_reflectance(wl, d) for wl in wavelengths])
    ax1.plot(wavelengths, R, color=color, linewidth=2, label=f'd = {d} nm')

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Reflectance', color='white')
ax1.set_title('Thin Film Reflectance vs Wavelength', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')

# Color map: thickness vs angle
ax2.set_facecolor('#111827')
angles = np.linspace(0, np.pi/3, 100)  # 0 to 60 degrees
thick_range = np.linspace(50, 400, 100)  # nm

# For each thickness and angle, find the peak reflected wavelength
color_map = np.zeros((len(thick_range), len(angles)))
for i, d in enumerate(thick_range):
    for j, a in enumerate(angles):
        R = np.array([thin_film_reflectance(wl, d, angle=a) for wl in wavelengths])
        peak_wl = wavelengths[np.argmax(R)]
        color_map[i, j] = peak_wl

im = ax2.imshow(color_map, aspect='auto', cmap='rainbow',
                extent=[0, 60, 50, 400], origin='lower',
                vmin=380, vmax=750)
ax2.set_xlabel('Viewing angle (degrees)', color='white')
ax2.set_ylabel('Film thickness (nm)', color='white')
ax2.set_title('Peak Reflected Color vs Thickness & Angle', color='white', fontsize=13)
cbar = plt.colorbar(im, ax=ax2, label='Peak wavelength (nm)')
cbar.ax.yaxis.label.set_color('white')
cbar.ax.tick_params(colors='gray')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Thin film interference:")
print("  Constructive: 2nd·cos(θ) = mλ → bright color")
print("  Destructive: 2nd·cos(θ) = (m+½)λ → color cancelled")
print()
print("  d=150nm, n=1.5 → peak at ~450nm (blue) → kingfisher feather!")
print("  d=250nm, n=1.5 → peak at ~550nm (green)")
print("  d=300nm, n=1.5 → peak at ~620nm (orange)")
print()
print("Changing angle shifts the peak → iridescence!")`,
      challenge: 'A kingfisher feather has melanin-filled nanostructures with d ≈ 150nm and n ≈ 1.5. Calculate the peak reflected wavelength. Then calculate for d = 120nm. What color would that feather be?',
      successHint: 'Thin film interference is the same physics behind anti-reflective coatings on glasses, iridescent car paint, and fiber optic sensors. The kingfisher discovered it 50 million years before humans did.',
    },
    {
      title: 'Nanostructure and light interference — the physics of blue',
      concept: `Kingfisher feathers aren't simple thin films — they're far more sophisticated. Inside each feather barb is a **spongy nanostructure** of melanin granules and air pockets arranged in a quasi-ordered pattern.

The nanostructure works like a **photonic crystal**: a material with periodic variation in refractive index on the scale of light wavelengths (~100-300 nm). Different wavelengths of light constructively interfere with different structure sizes.

The math is elegant: the scattered light intensity peaks when the Bragg condition is met:
**2d sin(θ) = nλ**

where d is the spacing between melanin granules, θ is the scattering angle, n is an integer, and λ is the wavelength.

For a kingfisher, d ≈ 150 nm → peak reflection at λ ≈ 470 nm (blue). Different kingfisher species have different d values, producing different blues, greens, and even oranges. Same physics, different engineering parameters.`,
      analogy: 'A photonic crystal is like an acoustic concert hall. The hall\'s shape and materials are designed so that certain sound frequencies are amplified (constructive interference) and others are dampened (destructive). The result is rich, resonant sound. A photonic crystal does the same for light — its nanostructure amplifies certain colors and suppresses others.',
      storyConnection: 'Why is the kingfisher\'s coat blue? Because its feather nanostructure has a spacing of ~150 nm, which Bragg-reflects blue light at ~470 nm. Evolution "tuned" this spacing over millions of years — birds with slightly different blues had different mating success and predator visibility. The blue coat is simultaneously physics and evolution.',
      checkQuestion: 'If a kingfisher evolved in an environment where green visibility was advantageous (forest canopy), what nanostructure spacing would produce green (~550 nm)?',
      checkAnswer: 'Using 2d = λ/n (at normal incidence, simplified): d ≈ λ/(2n) ≈ 550/(2 × 1.5) ≈ 183 nm. The nanostructure would need larger spacing (~183 nm vs ~157 nm for blue). This is actually observed: forest-dwelling kingfisher species tend to be green, and their feather nanostructures have larger spacings than blue species.',
      codeIntro: 'Model the Bragg scattering that produces the kingfisher\'s blue.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Bragg scattering model
def bragg_reflectance(wavelength, d_spacing, n_refrac=1.5, n_layers=10):
    """Model reflectance from a quasi-periodic nanostructure."""
    delta = 2 * np.pi * n_refrac * d_spacing / wavelength
    # Simplified multi-layer reflectance
    r_single = (n_refrac - 1)**2 / (n_refrac + 1)**2
    R = r_single * n_layers**2 * np.sinc((delta - np.pi) / np.pi)**2
    return np.clip(R, 0, 1)

wavelengths = np.linspace(350, 800, 500)

# Different kingfisher species
ax1.set_facecolor('#111827')
species = [
    ('Common Kingfisher', 155, '#3b82f6'),
    ('White-throated', 170, '#06b6d4'),
    ('Stork-billed', 185, '#22c55e'),
    ('Ruddy Kingfisher', 210, '#f97316'),
]

for name, d, color in species:
    R = np.array([bragg_reflectance(wl, d) for wl in wavelengths])
    ax1.plot(wavelengths, R, color=color, linewidth=2, label=f'{name} (d={d}nm)')
    peak_wl = wavelengths[np.argmax(R)]
    ax1.axvline(peak_wl, color=color, linestyle=':', alpha=0.3)

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Reflectance', color='white')
ax1.set_title('Kingfisher Species: Same Physics, Different Colors', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Nanostructure visualization
ax2.set_facecolor('#111827')

# Draw a simplified feather nanostructure cross-section
np.random.seed(42)
n_granules = 150
# Quasi-ordered: regular grid + noise
d = 155  # nm spacing
grid_x, grid_y = np.meshgrid(np.arange(0, 1500, d), np.arange(0, 800, d))
gx = grid_x.flatten() + np.random.normal(0, 15, grid_x.size)
gy = grid_y.flatten() + np.random.normal(0, 15, grid_y.size)

# Melanin granules (dark circles)
for x, y in zip(gx, gy):
    if 0 < x < 1500 and 0 < y < 800:
        circle = plt.Circle((x, y), 30, facecolor='#4b5563', alpha=0.6, edgecolor='#6b7280', linewidth=0.5)
        ax2.add_patch(circle)

# Air pockets (lighter areas between granules)
ax2.set_xlim(0, 1500)
ax2.set_ylim(0, 800)

# Show spacing
ax2.annotate('', xy=(155, 750), xytext=(0, 750),
             arrowprops=dict(arrowstyle='<->', color='#f59e0b', lw=2))
ax2.text(77, 770, f'd = {d} nm', ha='center', color='#f59e0b', fontsize=10)

# Incident and reflected light
ax2.annotate('', xy=(400, 800), xytext=(200, 1000),
             arrowprops=dict(arrowstyle='->', color='white', lw=1.5))
ax2.annotate('', xy=(200, 1000), xytext=(400, 800),
             arrowprops=dict(arrowstyle='->', color='#3b82f6', lw=2))
ax2.text(150, 850, 'White\\nlight in', color='white', fontsize=8)
ax2.text(350, 900, 'Blue\\nlight out', color='#3b82f6', fontsize=8)

ax2.set_title('Feather Nanostructure (cross-section)', color='white', fontsize=13)
ax2.set_xlabel('nm', color='white')
ax2.set_ylabel('nm', color='white')
ax2.tick_params(colors='gray')
ax2.set_aspect('equal')

plt.tight_layout()
plt.show()

print("Bragg condition: 2d·sin(θ) = nλ")
print()
for name, d, _ in species:
    peak = 2 * d * 1.5  # at normal incidence (simplified)
    print(f"  {name}: d={d}nm → peak at ~{peak:.0f}nm")`,
      challenge: 'What nanostructure spacing would produce UV-reflective feathers (λ ≈ 350 nm)? Some birds have UV structural color that\'s invisible to humans but visible to other birds. Calculate d for UV.',
      successHint: 'The kingfisher\'s nanostructure is a naturally evolved photonic crystal. Humans didn\'t create photonic crystals until the 1980s. Nature had a 50-million-year head start.',
    },
    {
      title: 'Kingfisher beak and the Shinkansen — biomimicry in action',
      concept: `Japan's Shinkansen bullet train had a problem: every time it exited a tunnel, it created a **sonic boom** — a pressure wave so loud it violated noise regulations. The air compressed in front of the blunt train nose couldn't disperse fast enough.

Engineer **Eiji Nakatsu**, a birdwatcher, noticed that kingfishers dive from air into water (a medium 800× denser) with almost no splash. The secret: their beak is a long, tapered shape that gradually increases in cross-section, pushing the water (or air) aside smoothly instead of slamming into it.

Nakatsu redesigned the Shinkansen nose to mimic the kingfisher's beak profile. Results:
- **15% less electricity** used (less air resistance)
- **10% faster** at the same power
- **No more sonic booms** exiting tunnels

This is **biomimicry**: solving engineering problems by copying nature's solutions. The kingfisher's beak was shaped by 50 million years of natural selection for efficient diving. Nakatsu borrowed that design in one afternoon.`,
      analogy: 'Biomimicry is like open-source software for engineering. Nature has been "debugging" biological designs for billions of years. When engineers face a hard problem, they can check if nature already solved it — and usually it has. The kingfisher beak → Shinkansen nose is one of the most famous examples.',
      storyConnection: 'The story says the kingfisher\'s blue coat is a gift from the sky. In reality, the kingfisher\'s entire body is a masterwork of engineering: beak for hydrodynamic efficiency, feathers for structural color, eyes for underwater vision correction. Every feature has a lesson for human technology.',
      checkQuestion: 'The kingfisher\'s beak is not just pointy — its cross-section changes in a specific mathematical way. What shape is it, and why does that particular profile minimize splash?',
      checkAnswer: 'The kingfisher beak cross-section follows an approximately logarithmic profile — it increases in diameter slowly at first, then more rapidly. This profile produces a smooth, continuous pressure increase as the object enters a denser medium, avoiding the sudden pressure spike that causes splash (or sonic boom). The same principle is used in acoustic horn design.',
      codeIntro: 'Model the aerodynamics: compare a blunt nose vs. kingfisher-inspired nose.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Beak/nose profiles
ax1.set_facecolor('#111827')
x = np.linspace(0, 1, 200)

# Blunt profile (hemisphere)
blunt_r = np.sqrt(np.maximum(1 - (x * 2 - 1)**2, 0)) * 0.5

# Kingfisher profile (cubic taper)
kingfisher_r = 0.5 * x**1.5

# Conical profile
cone_r = 0.5 * x

ax1.fill_between(x, kingfisher_r, -kingfisher_r, color='#22c55e', alpha=0.3, label='Kingfisher beak')
ax1.plot(x, kingfisher_r, color='#22c55e', linewidth=2)
ax1.plot(x, -kingfisher_r, color='#22c55e', linewidth=2)

ax1.fill_between(x, cone_r, -cone_r, color='#3b82f6', alpha=0.15, label='Simple cone')
ax1.plot(x, cone_r, color='#3b82f6', linewidth=1.5, linestyle='--')
ax1.plot(x, -cone_r, color='#3b82f6', linewidth=1.5, linestyle='--')

# Draw old blunt nose for reference
ax1.plot([0.5, 0.5, 1], [0.5, 0.5, 0.5], color='#ef4444', linewidth=2, linestyle=':', label='Blunt (original)')
ax1.plot([0.5, 0.5, 1], [-0.5, -0.5, -0.5], color='#ef4444', linewidth=2, linestyle=':')
semi = np.linspace(-np.pi/2, np.pi/2, 100)
ax1.plot(0.5 + 0.5*np.sin(semi), 0.5*np.cos(semi), color='#ef4444', linewidth=2, linestyle=':')

ax1.set_xlabel('Length (normalized)', color='white')
ax1.set_ylabel('Width', color='white')
ax1.set_title('Nose Profile Comparison', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_aspect('equal')

# 2. Pressure wave comparison
ax2.set_facecolor('#111827')

# Simulate pressure at tunnel exit
position = np.linspace(0, 1, 200)

# Blunt: sudden pressure spike
blunt_pressure = np.zeros_like(position)
blunt_pressure[position > 0.4] = 1
blunt_pressure[position > 0.45] = 1.5
blunt_pressure[position > 0.5] = 0.8
blunt_pressure[position > 0.55] = 0.2
blunt_pressure[position > 0.6] = 0

# Kingfisher: gradual pressure change
kingfisher_pressure = 0.6 * np.exp(-((position - 0.5)/0.15)**2)

# Smooth the blunt pressure for visualization
from numpy import convolve
kernel = np.ones(5)/5
blunt_smooth = convolve(blunt_pressure, kernel, mode='same')

ax2.plot(position, blunt_smooth, color='#ef4444', linewidth=2, label='Blunt nose (sonic boom!)')
ax2.plot(position, kingfisher_pressure, color='#22c55e', linewidth=2, label='Kingfisher nose (smooth)')

ax2.fill_between(position, blunt_smooth, alpha=0.15, color='#ef4444')
ax2.fill_between(position, kingfisher_pressure, alpha=0.15, color='#22c55e')

ax2.axhline(1.0, color='#f59e0b', linestyle=':', alpha=0.5, label='Noise regulation limit')
ax2.set_xlabel('Distance through tunnel exit', color='white')
ax2.set_ylabel('Pressure wave amplitude', color='white')
ax2.set_title('Tunnel Exit Pressure Wave', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Shinkansen biomimicry results:")
print("  Original (blunt nose): sonic boom at every tunnel exit")
print("  Kingfisher-inspired nose:")
print("    - 15% less electricity used")
print("    - 10% faster at same power")
print("    - Zero sonic booms")
print()
print("Other biomimicry examples:")
print("  Shark skin → drag-reducing swimsuits")
print("  Lotus leaf → self-cleaning surfaces")
print("  Gecko feet → reversible adhesives")
print("  Spider silk → ultra-strong fibers")`,
      challenge: 'The kingfisher also has to deal with light refraction when diving — objects underwater appear shifted from their true position. How does the kingfisher compensate? (Hint: Snell\'s law and the bird\'s brain.)',
      successHint: 'Biomimicry isn\'t just clever copying — it\'s recognizing that evolution is the world\'s oldest and most successful R&D department. Every organism is a solution to a design problem. The engineer\'s job is to ask the right question.',
    },
    {
      title: 'Biomimicry in engineering — nature as design library',
      concept: `The kingfisher beak is just one example. **Biomimicry** is now a systematic approach to engineering:

Famous examples:
- **Velcro** (1941): George de Mestral noticed burrs sticking to his dog's fur. Hook-and-loop fastener.
- **Bullet train** (1997): Kingfisher beak → Shinkansen nose
- **Gecko tape** (2003): Gecko foot pads have millions of nanoscale hairs (setae) that create van der Waals adhesion. Reusable adhesive.
- **Shark skin swimsuits** (2008): Tiny riblets reduce drag by 8%
- **Humpback whale turbines** (2012): Bumps (tubercles) on whale fins reduce stall and increase efficiency. Applied to wind turbine blades.
- **Namib beetle water collection** (2001): Desert beetle's shell has hydrophilic bumps and hydrophobic troughs that collect water from fog

The principle: evolution has been optimizing designs for 3.8 billion years. Any engineering problem you face, some organism has probably already solved a similar one. The biomimicry design process: **identify the function → find the organism → abstract the principle → apply to engineering**.`,
      analogy: 'Biomimicry is like asking 8.7 million consultants (one per species) for advice on your engineering problem. Each species has survived millions of years of testing (natural selection). Their solutions are battle-tested. Hiring a biomimicry consultant is like hiring someone with 3.8 billion years of experience.',
      storyConnection: 'The kingfisher\'s blue coat (structural color → iridescent materials), its beak (hydrodynamic shape → bullet train), and its diving ability (light refraction compensation → underwater optics) are three biomimicry lessons from a single bird. Imagine what all 10,000 bird species could teach us.',
      checkQuestion: 'Termite mounds maintain a constant temperature of ~30°C despite outside temperatures ranging from 3°C to 42°C. How? And what building did this inspire?',
      checkAnswer: 'Termite mounds have a network of channels that create convective air currents — warm air rises through the center and cool air enters at the base. The Eastgate Centre in Harare, Zimbabwe, was designed using this principle. It uses 90% less energy for ventilation than a conventional building of the same size. No air conditioning needed.',
      codeIntro: 'Survey biomimicry examples: map the inspiration source to the engineering application.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# 1. Biomimicry timeline
ax1.set_facecolor('#111827')
examples = [
    (1941, 'Velcro', 'Burrs on dog fur', '#22c55e'),
    (1982, 'Lotus Effect', 'Self-cleaning leaf', '#3b82f6'),
    (1997, 'Shinkansen', 'Kingfisher beak', '#06b6d4'),
    (2001, 'Fog harvester', 'Namib beetle', '#f59e0b'),
    (2003, 'Gecko tape', 'Gecko foot setae', '#a855f7'),
    (2008, 'Swimsuits', 'Shark skin riblets', '#ef4444'),
    (2012, 'Wind turbines', 'Whale fin bumps', '#ec4899'),
    (2020, 'COVID masks', 'Spider web filters', '#84cc16'),
]

for i, (year, name, source, color) in enumerate(examples):
    ax1.plot(year, i, 'o', color=color, markersize=12)
    ax1.text(year + 2, i, f'{name}\n({source})', va='center', color='white', fontsize=8)
    ax1.axhline(i, color='#4b5563', alpha=0.1, linewidth=0.5)

ax1.set_xlabel('Year', color='white')
ax1.set_title('Biomimicry Timeline', color='white', fontsize=13)
ax1.set_yticks([])
ax1.tick_params(colors='gray')
ax1.set_xlim(1935, 2030)

# 2. Performance improvements
ax2.set_facecolor('#111827')
applications = ['Shinkansen\\n(energy)', 'Shark suit\\n(drag)', 'Whale turbine\\n(efficiency)',
                'Eastgate Bldg\\n(cooling)', 'Gecko tape\\n(adhesion)', 'Lotus coating\\n(cleaning)']
improvements = [15, 8, 35, 90, 200, 95]  # percent improvement
colors_app = ['#06b6d4', '#ef4444', '#ec4899', '#f59e0b', '#a855f7', '#3b82f6']

bars = ax2.barh(applications, improvements, color=colors_app, alpha=0.8, edgecolor='white', linewidth=0.5)
for bar, val in zip(bars, improvements):
    ax2.text(bar.get_width() + 2, bar.get_y() + bar.get_height()/2,
             f'{val}%', va='center', color='white', fontsize=10, fontweight='bold')

ax2.set_xlabel('Performance improvement (%)', color='white')
ax2.set_title('Biomimicry Performance Gains', color='white', fontsize=13)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Biomimicry design process:")
print("  1. IDENTIFY the engineering problem (e.g., tunnel sonic booms)")
print("  2. BIOLOGIZE: reframe as nature's problem (entering a denser medium)")
print("  3. DISCOVER: find organisms that solved it (kingfisher diving)")
print("  4. ABSTRACT: extract the design principle (tapered profile)")
print("  5. EMULATE: apply to engineering (reshape the train nose)")
print()
print("Key insight: nature doesn't engineer — it evolves.")
print("But the resulting designs are often optimal or near-optimal,")
print("because millions of years of testing eliminated the failures.")`,
      challenge: 'Pick an engineering problem you care about (water purification, cooling, adhesion, etc.) and find an organism that has solved a similar problem. Describe the biological solution and how it could be applied.',
      successHint: 'Biomimicry is not just a clever trick — it\'s a paradigm shift in engineering. Instead of designing from first principles, we learn from 3.8 billion years of evolutionary R&D. The kingfisher\'s blue coat and streamlined beak are just the beginning.',
    },
    {
      title: 'Color that never fades — structural color applications',
      concept: `Structural color doesn't fade because it comes from physical structure, not chemical pigments. This property has enormous practical applications:

**Current applications**:
- **Anti-counterfeiting**: structural color patterns are nearly impossible to replicate (credit cards, banknotes, passports)
- **Displays**: Qualcomm's Mirasol display used interference (like butterfly wings) for e-readers visible in sunlight
- **Cosmetics**: structural color pigments for shimmer without chemical dyes
- **Automotive paint**: multi-layer interference coatings create color-shifting effects

**Emerging applications**:
- **Sensors**: structural color changes when the nanostructure swells/shrinks (humidity, chemical detection)
- **Sustainable textiles**: fabric color without chemical dyes (no toxic waste, no fading)
- **Solar cells**: photonic crystal coatings increase light absorption
- **Stealth technology**: controlling structural color in the infrared for military applications

The big vision: replace all chemical dyes and pigments with structural color. No toxic chemicals, no fading, no environmental pollution from the dye industry. Nature already does this — the kingfisher's blue, the morpho butterfly's blue, the peacock's green.`,
      analogy: 'Structural color is like a hologram — the pattern is in the structure, not in any chemical ink. Holograms don\'t fade because the information is encoded physically. Similarly, structural colors don\'t fade because the color is encoded in nanostructure, not in molecules that can be destroyed by UV light.',
      storyConnection: 'The story says the kingfisher\'s blue coat is a permanent gift from the sky. Science agrees — it really is permanent. Museum specimens of kingfishers from 100+ years ago still show vivid blue structural color, while the pigment colors of other specimens have faded to brown. Structural color is the closest thing to truly permanent color in nature.',
      checkQuestion: 'The textile industry is one of the world\'s largest polluters. Could structural color replace chemical dyes? What are the challenges?',
      checkAnswer: 'In principle, yes — structural color requires no chemicals and never fades. The challenges: (1) fabricating nanostructures on fibers at industrial scale is expensive (currently), (2) structural color can be angle-dependent (iridescent), which isn\'t always desirable, (3) current techniques can\'t replicate all colors equally well. Researchers are making rapid progress, especially with self-assembling nanoparticles on fabrics.',
      codeIntro: 'Demonstrate how structural color could be used as a sensor — color changes with structural dimension.',
      code: `import numpy as np
import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# 1. Structural color sensor: nanostructure swells with humidity
ax1.set_facecolor('#111827')
wavelengths = np.linspace(380, 750, 500)

humidity_levels = [20, 40, 60, 80, 100]  # %RH
# Base spacing: 180nm. Swells ~1% per 10%RH increase
base_d = 180  # nm
n = 1.45

for rh in humidity_levels:
    d = base_d * (1 + 0.001 * rh)  # swell with humidity
    # Simplified reflectance peak
    peak_wl = 2 * n * d
    R = np.exp(-((wavelengths - peak_wl) / 20)**2) * 0.8
    color_val = peak_wl / 750
    color = plt.cm.rainbow(color_val)
    ax1.plot(wavelengths, R, linewidth=2, color=color, label=f'{rh}% RH (d={d:.0f}nm)')

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Reflectance', color='white')
ax1.set_title('Structural Color Humidity Sensor', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# 2. Permanence comparison: structural vs pigment color over time
ax2.set_facecolor('#111827')
years = np.linspace(0, 100, 200)

# Pigment fading (exponential decay)
pigment_reds = 100 * np.exp(-years / 20)  # half-life ~14 years
pigment_blues = 100 * np.exp(-years / 30)  # blue pigments last longer
pigment_yellows = 100 * np.exp(-years / 10)  # yellows fade fastest

# Structural color: virtually no fading
structural = 100 * np.ones_like(years) - years * 0.02  # tiny degradation

ax2.plot(years, pigment_reds, color='#ef4444', linewidth=2, linestyle='--', label='Red pigment')
ax2.plot(years, pigment_blues, color='#3b82f6', linewidth=2, linestyle='--', label='Blue pigment')
ax2.plot(years, pigment_yellows, color='#f59e0b', linewidth=2, linestyle='--', label='Yellow pigment')
ax2.plot(years, structural, color='#22c55e', linewidth=3, label='Structural color')

ax2.set_xlabel('Years of UV exposure', color='white')
ax2.set_ylabel('Color intensity (%)', color='white')
ax2.set_title('Color Permanence: Pigment vs Structural', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 110)

plt.tight_layout()
plt.show()

print("Structural color advantages over pigments:")
print("  1. Permanent: doesn't fade in UV light")
print("  2. Non-toxic: no chemical dyes needed")
print("  3. Tunable: change the nanostructure, change the color")
print("  4. Responsive: can be designed to change with environment")
print()
print("Applications already in use:")
print("  - Morpho butterfly-inspired anti-counterfeiting")
print("  - Interference coatings on eyeglasses")
print("  - Automotive color-shifting paint")
print("  - Photonic crystal sensors")`,
      challenge: 'Design a structural color sensor for temperature: if the nanostructure expands 0.05% per degree C, and starts at d=200nm at 20°C, what color does it show at 20°C, 30°C, and 40°C? Plot the reflectance curves.',
      successHint: 'From kingfisher feathers to anti-counterfeiting to pollution-free textiles — structural color is one of nature\'s most promising gifts to human technology. Level 2 dives into the nanophotonics equations that make it all work.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Structural Color & Nanostructures — no prior experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for optics and color simulations. Click to start.</p>
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