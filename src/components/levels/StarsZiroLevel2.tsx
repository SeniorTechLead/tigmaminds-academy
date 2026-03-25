import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function StarsZiroLevel2() {
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
      title: 'Spectroscopy — reading the fingerprints of starlight',
      concept: `Every element absorbs and emits light at specific wavelengths — its spectral fingerprint. When starlight passes through a star's atmosphere, elements absorb their characteristic wavelengths, creating dark **absorption lines** in the spectrum.

**Hydrogen**: the Balmer series at 656nm (red), 486nm (blue-green), 434nm (violet)
**Helium**: first discovered in the Sun's spectrum (helios = sun) before found on Earth
**Iron**: thousands of absorption lines — the most complex spectrum of any element
**Calcium**: strong lines at 393nm and 397nm — visible even in low-resolution spectra

From these lines, astronomers determine:
- **Composition**: which elements are present and in what amounts
- **Temperature**: line strengths depend on temperature (hotter → more ionization)
- **Velocity**: Doppler-shifted lines reveal how fast the star moves toward/away from us
- **Magnetic fields**: Zeeman splitting of lines indicates field strength
- **Rotation**: broadened lines indicate rapid rotation

A single spectrum contains more information about a star than any image could. This is why spectroscopy is called "the astronomer's most powerful tool."`,
      analogy: 'Spectroscopy is like recognizing a person by their voice over the phone. You cannot see them, but the unique pattern of their voice (spectral fingerprint) tells you who they are, how they feel (temperature), whether they are moving (Doppler shift), and even what they had for lunch (composition). Each star has a unique "voice" in light.',
      storyConnection: 'The children of Ziro saw white starlight. But split through a prism, each star reveals a unique barcode of dark lines — its chemical identity card. The stars are not just points of light; they are broadcasting their composition, temperature, and velocity in every photon they emit.',
      checkQuestion: 'Helium was discovered in the Sun\'s spectrum 27 years before it was found on Earth. How is it possible to discover an element in something 150 million km away?',
      checkAnswer: 'Because spectral lines are universal — each element has exactly the same absorption/emission wavelengths everywhere in the universe (adjusted for Doppler shift). The unknown lines in the Sun\'s spectrum did not match any known element. They were assigned to a new element named "helium" (from helios, Greek for sun). When helium was later found in uranium ore on Earth, its spectrum matched perfectly.',
      codeIntro: 'Simulate the absorption spectrum of a star showing element fingerprints.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate a stellar absorption spectrum
wavelengths = np.linspace(380, 700, 5000)  # visible range in nm

# Continuous spectrum (blackbody approximation for Sun-like star)
T = 5778  # K
# Simplified Planck in terms of nm
continuum = 1.0 / (wavelengths**5 * (np.exp(14388 / (wavelengths * T / 1e6)) - 1))
continuum = continuum / continuum.max()  # normalize

# Absorption lines (element, wavelength_nm, depth, width)
absorption_lines = [
    ('H-α', 656.3, 0.7, 0.5),
    ('H-β', 486.1, 0.5, 0.4),
    ('H-γ', 434.0, 0.4, 0.3),
    ('H-δ', 410.2, 0.3, 0.3),
    ('Na D₁', 589.6, 0.6, 0.2),
    ('Na D₂', 589.0, 0.6, 0.2),
    ('Ca K', 393.4, 0.8, 0.4),
    ('Ca H', 396.8, 0.7, 0.4),
    ('Fe', 527.0, 0.3, 0.2),
    ('Fe', 532.8, 0.25, 0.2),
    ('Mg', 518.4, 0.35, 0.3),
    ('Fe', 438.4, 0.2, 0.2),
]

# Apply absorption
spectrum = continuum.copy()
for name, center, depth, width in absorption_lines:
    gaussian = depth * np.exp(-((wavelengths - center) / width)**2)
    spectrum -= gaussian * continuum

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Full spectrum with rainbow background
ax1.set_facecolor('#111827')
# Color the background with approximate visible colors
rainbow_colors = plt.cm.Spectral(np.linspace(0, 1, len(wavelengths)))
for i in range(len(wavelengths)-1):
    ax1.fill_between(wavelengths[i:i+2], 0, spectrum[i:i+2],
                     color=rainbow_colors[i], alpha=0.3)
ax1.plot(wavelengths, spectrum, color='white', linewidth=0.5)
ax1.plot(wavelengths, continuum, '--', color='gray', linewidth=0.5, alpha=0.5, label='Continuum')

# Label strongest lines
labeled = set()
for name, center, depth, width in absorption_lines:
    if name not in labeled and depth > 0.3:
        ax1.annotate(name, xy=(center, spectrum[np.argmin(np.abs(wavelengths-center))]),
                    xytext=(center, 1.05), color='#f59e0b', fontsize=8, ha='center',
                    arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=0.5))
        labeled.add(name)

ax1.set_ylabel('Relative intensity', color='white')
ax1.set_title('Solar Absorption Spectrum', color='white', fontsize=13)
ax1.legend(facecolor='#1f2937', labelcolor='white')
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 1.2)

# Zoom on hydrogen Balmer series
ax2.set_facecolor('#111827')
h_lines = [(656.3, 'H-α (red)'), (486.1, 'H-β (blue-green)'),
           (434.0, 'H-γ (violet)'), (410.2, 'H-δ (violet)')]

for center, name in h_lines:
    mask = (wavelengths > center - 5) & (wavelengths < center + 5)
    color = '#ef4444' if 'red' in name else '#3b82f6' if 'blue' in name else '#a855f7'
    ax2.axvline(center, color=color, linestyle='--', alpha=0.5)
    ax2.text(center, 1.1, name, ha='center', color=color, fontsize=9, rotation=45)

ax2.plot(wavelengths, spectrum, color='white', linewidth=1)
ax2.set_xlabel('Wavelength (nm)', color='white')
ax2.set_ylabel('Relative intensity', color='white')
ax2.set_title('Hydrogen Balmer Series — The Most Recognizable Pattern in Astronomy', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 1.3)

plt.tight_layout()
plt.show()

print("Elements identified in this spectrum:")
elements = set(name.split()[0].split('-')[0] for name, _, _, _ in absorption_lines)
for elem in sorted(elements):
    lines = [(n, c) for n, c, _, _ in absorption_lines if n.startswith(elem)]
    print(f"  {elem}: {', '.join(f'{n} ({c}nm)' for n, c in lines)}")`,
      challenge: 'If a star is moving toward us at 300 km/s, all its spectral lines are blue-shifted. The H-α line at 656.3nm shifts to 655.6nm. Can you calculate the shift for each line using the formula: Δλ/λ = v/c?',
      successHint: 'Spectroscopy turned astronomy from a descriptive science (what does a star look like?) into a physical science (what IS a star?). Every element on the periodic table has been found in stars — because the laws of physics are universal.',
    },
    {
      title: 'Hertzsprung-Russell diagram — the map of all stars',
      concept: `The **Hertzsprung-Russell (HR) diagram** plots stars by temperature (x-axis, reversed: hot on left, cool on right) versus luminosity (y-axis). It is the most important diagram in all of astronomy.

When you plot thousands of stars, they do not scatter randomly. They cluster into distinct regions:

- **Main sequence**: a diagonal band from hot-bright (upper left) to cool-dim (lower right). About 90% of all stars, including our Sun, are here. They are burning hydrogen into helium.
- **Red giants**: upper right — cool but very luminous. Stars that have exhausted core hydrogen and expanded.
- **White dwarfs**: lower left — hot but very dim. Dead stellar cores the size of Earth.
- **Supergiants**: very top — the most luminous stars in the universe.

The HR diagram is like a stellar life story:
1. Star is born → joins main sequence
2. Burns hydrogen for millions-billions of years
3. Runs out of hydrogen → expands to red giant
4. Low-mass stars → shed outer layers → white dwarf
5. High-mass stars → supernova → neutron star or black hole

The Sun has been on the main sequence for 4.6 billion years and will remain there for another ~5 billion.`,
      analogy: 'The HR diagram is like a map of a city where every building represents a star. The main sequence is the main boulevard — most buildings are here, varying in size (luminosity) and style (temperature). Red giants are the sprawling mansions in the suburbs. White dwarfs are the tiny apartments downtown. The diagram tells you the "neighborhood" (life stage) of any star.',
      storyConnection: 'Every star the children of Ziro saw occupies a specific place on the HR diagram. Sirius is a hot main-sequence star (upper left). Betelgeuse is a red supergiant (upper right). Our Sun is a modest yellow star in the middle. The HR diagram gives every star an address in the cosmic city.',
      checkQuestion: 'Two stars have the same temperature but star A is 10,000× more luminous than star B. What can you conclude about their sizes?',
      checkAnswer: 'Luminosity = surface area × flux per area. Same temperature means same flux per unit area. So star A must have 10,000× more surface area. Since surface area ∝ radius², star A has 100× the radius. If B is the Sun, A is 100 solar radii — a red giant or supergiant. This is how the HR diagram reveals stellar sizes without directly measuring them.',
      codeIntro: 'Generate an HR diagram and plot different types of stars.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Generate stars for each region of the HR diagram
# Temperature (K) on x-axis, Luminosity (solar units) on y-axis

def generate_main_sequence(n=500):
    temp = np.random.uniform(3000, 30000, n)
    # L ∝ T^4 approximately on main sequence, with scatter
    log_L = 4 * np.log10(temp/5778) + np.random.normal(0, 0.3, n)
    return temp, 10**log_L

def generate_red_giants(n=80):
    temp = np.random.uniform(3000, 5000, n)
    log_L = np.random.uniform(1.5, 3.5, n)
    return temp, 10**log_L

def generate_white_dwarfs(n=50):
    temp = np.random.uniform(6000, 30000, n)
    log_L = np.random.uniform(-4, -1, n)
    return temp, 10**log_L

def generate_supergiants(n=15):
    temp = np.random.uniform(3500, 25000, n)
    log_L = np.random.uniform(3.5, 5.5, n)
    return temp, 10**log_L

ms_t, ms_l = generate_main_sequence()
rg_t, rg_l = generate_red_giants()
wd_t, wd_l = generate_white_dwarfs()
sg_t, sg_l = generate_supergiants()

fig, ax = plt.subplots(figsize=(10, 8))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#111827')

# Color by temperature
def temp_color(T):
    if T > 10000: return '#93c5fd'
    elif T > 7500: return '#bfdbfe'
    elif T > 6000: return '#fef9c3'
    elif T > 4500: return '#fed7aa'
    else: return '#fca5a5'

# Plot each group
ax.scatter(ms_t, ms_l, s=3, alpha=0.4, c=[temp_color(t) for t in ms_t], label='Main Sequence')
ax.scatter(rg_t, rg_l, s=15, alpha=0.6, c=[temp_color(t) for t in rg_t], marker='o', label='Red Giants')
ax.scatter(wd_t, wd_l, s=8, alpha=0.5, c=[temp_color(t) for t in wd_t], marker='s', label='White Dwarfs')
ax.scatter(sg_t, sg_l, s=30, alpha=0.7, c=[temp_color(t) for t in sg_t], marker='D', label='Supergiants')

# Mark famous stars
famous = [
    ('Sun', 5778, 1, '#f59e0b'),
    ('Sirius', 9940, 25, '#93c5fd'),
    ('Betelgeuse', 3500, 1.3e5, '#ef4444'),
    ('Rigel', 12100, 1.2e5, '#60a5fa'),
    ('Proxima Cen', 3042, 0.0017, '#ef4444'),
    ('Sirius B', 25200, 0.026, '#93c5fd'),
]
for name, t, l, color in famous:
    ax.plot(t, l, '*', color=color, markersize=12, markeredgecolor='white', markeredgewidth=0.5)
    ax.annotate(name, xy=(t, l), xytext=(t*0.75, l*2), color=color, fontsize=9,
               arrowprops=dict(arrowstyle='->', color=color, lw=0.5))

ax.set_xscale('log')
ax.set_yscale('log')
ax.invert_xaxis()  # Hot on left, cool on right
ax.set_xlabel('Temperature (K) ← hotter | cooler →', color='white', fontsize=11)
ax.set_ylabel('Luminosity (solar units)', color='white', fontsize=11)
ax.set_title('Hertzsprung-Russell Diagram', color='white', fontsize=14)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax.tick_params(colors='gray')

# Add spectral class labels
for t, label in [(30000, 'O'), (10000, 'B'), (7500, 'A'), (6000, 'F'),
                 (5200, 'G'), (3700, 'K'), (3000, 'M')]:
    ax.text(t, 5e5, label, ha='center', color='white', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.show()

print("Star regions on the HR diagram:")
print(f"  Main Sequence: {len(ms_t)} stars (90% of all stars)")
print(f"  Red Giants: {len(rg_t)} stars (evolved, hydrogen-exhausted)")
print(f"  White Dwarfs: {len(wd_t)} stars (stellar remnants)")
print(f"  Supergiants: {len(sg_t)} stars (rare, massive, short-lived)")`,
      challenge: 'Our Sun will become a red giant in ~5 billion years. Plot its evolutionary track: from current position (5778K, 1 L☉) to red giant (3500K, 2000 L☉) to white dwarf (100,000K initially, 0.001 L☉).',
      successHint: 'The HR diagram is the Rosetta Stone of stellar astronomy. It revealed that stars are not eternal — they are born, they age, they die. Every point on the diagram tells a story of nuclear physics, gravity, and time.',
    },
    {
      title: 'Dark matter — the invisible scaffold of the universe',
      concept: `Only about 5% of the universe is ordinary matter (atoms). The rest is:
- **Dark matter** (~27%): an unknown substance that has gravity but does not emit, absorb, or reflect light
- **Dark energy** (~68%): an unknown force causing the universe's expansion to accelerate

Evidence for dark matter:
1. **Galaxy rotation curves**: stars at the edges of galaxies orbit too fast. Without extra invisible mass, they would fly off. The visible matter alone cannot hold them.
2. **Gravitational lensing**: massive galaxy clusters bend light from background objects more than their visible mass should allow.
3. **Cosmic microwave background**: the pattern of the CMB requires dark matter to explain its structure.
4. **Galaxy cluster dynamics**: galaxy clusters are held together by ~10× more gravity than visible matter provides.

Dark matter candidates:
- **WIMPs** (Weakly Interacting Massive Particles): hypothetical particles that interact only through gravity and the weak force
- **Axions**: very light hypothetical particles
- **Primordial black holes**: small black holes formed in the early universe

Despite decades of searching, dark matter has never been directly detected. It is one of the greatest unsolved problems in physics.`,
      analogy: 'Dark matter is like wind. You cannot see wind, but you can see its effects: leaves move, flags flutter, boats sail. Similarly, you cannot see dark matter, but you can see its gravitational effects: galaxies rotate too fast, light bends too much, clusters hold together too tightly. Something invisible is pulling the strings.',
      storyConnection: 'The children of Ziro saw a universe filled with stars. But for every kilogram of visible matter they could see, there were 5 kilograms of invisible dark matter surrounding it. The stars they admired are just the visible foam on an ocean of darkness. The true structure of the universe is invisible — shaped by matter we have yet to understand.',
      checkQuestion: 'If dark matter does not interact with light, how can we ever hope to detect it directly?',
      checkAnswer: 'Several approaches: (1) Underground detectors watch for rare dark matter particle collisions with normal atoms (XENON, LUX experiments). (2) Particle accelerators try to create dark matter particles (LHC at CERN). (3) Space telescopes look for gamma rays from dark matter annihilation. So far, no direct detection — but the indirect gravitational evidence is overwhelming. We know it is there; we just do not know what it is.',
      codeIntro: 'Plot a galaxy rotation curve showing the evidence for dark matter.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Galaxy rotation curve
# v(r) = orbital velocity at distance r from galaxy center

r = np.linspace(0.5, 50, 200)  # kpc (kiloparsecs)

# Visible matter contribution (exponential disk)
M_visible = 5e10  # solar masses
r_disk = 3.0  # scale length in kpc
v_visible = np.sqrt(4.3e-3 * M_visible * (1 - np.exp(-r/r_disk)) * r_disk / r)

# Dark matter halo contribution (NFW-like profile)
M_halo = 5e11  # 10x visible matter
r_halo = 15.0  # scale radius
v_dark = np.sqrt(4.3e-3 * M_halo * (np.log(1 + r/r_halo) - r/(r+r_halo)) / r)

# Total
v_total = np.sqrt(v_visible**2 + v_dark**2)

# Simulated observations (with scatter)
np.random.seed(42)
r_obs = np.linspace(2, 45, 25)
v_obs = np.sqrt(v_visible[np.searchsorted(r, r_obs)]**2 +
               v_dark[np.searchsorted(r, r_obs)]**2)
v_obs += np.random.normal(0, 8, len(r_obs))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5.5))
fig.patch.set_facecolor('#1f2937')

# Rotation curve
ax1.set_facecolor('#111827')
ax1.plot(r, v_visible, '--', color='#f59e0b', linewidth=2, label='Visible matter only')
ax1.plot(r, v_dark, ':', color='#a855f7', linewidth=2, label='Dark matter halo')
ax1.plot(r, v_total, '-', color='#22c55e', linewidth=2, label='Total (visible + dark)')
ax1.errorbar(r_obs, v_obs, yerr=10, fmt='o', color='white', markersize=4,
            ecolor='gray', capsize=2, label='Observed', zorder=5)

ax1.set_xlabel('Distance from center (kpc)', color='white')
ax1.set_ylabel('Orbital velocity (km/s)', color='white')
ax1.set_title('Galaxy Rotation Curve: Evidence for Dark Matter', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Annotate the discrepancy
ax1.annotate('Expected drop-off\\n(without dark matter)', xy=(30, v_visible[120]),
            xytext=(35, 80), color='#f59e0b', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))
ax1.annotate('Observed: stays flat!', xy=(30, v_total[120]),
            xytext=(35, 250), color='#22c55e', fontsize=9,
            arrowprops=dict(arrowstyle='->', color='#22c55e'))

# Universe composition pie chart
ax2.set_facecolor('#1f2937')
sizes = [68.3, 26.8, 4.9]
labels = ['Dark Energy\n68.3%', 'Dark Matter\n26.8%', 'Ordinary Matter\n4.9%']
colors = ['#3b82f6', '#a855f7', '#22c55e']
explode = (0.02, 0.02, 0.08)

wedges, texts = ax2.pie(sizes, explode=explode, labels=labels, colors=colors,
                         startangle=90, labeldistance=1.15,
                         wedgeprops=dict(edgecolor='#1f2937', linewidth=2))
for t in texts:
    t.set_color('white')
    t.set_fontsize(10)
ax2.set_title('Composition of the Universe', color='white', fontsize=12, pad=15)

plt.tight_layout()
plt.show()

print("The dark matter problem:")
print(f"  Visible matter predicts velocity dropping as 1/sqrt(r)")
print(f"  Observed velocity stays FLAT out to edge of galaxy")
print(f"  Discrepancy requires ~{M_halo/M_visible:.0f}x more mass than visible")
print()
print("We are made of 4.9% of the universe.")
print("The other 95.1% is completely unknown.")`,
      challenge: 'If we could somehow remove all dark matter from the Milky Way, what would happen to the Sun\'s orbit? Calculate the new orbital velocity using only visible matter.',
      successHint: 'Dark matter is arguably the biggest mystery in modern physics. We can measure its effects precisely, model its distribution mathematically, but we have no idea what it actually is. The universe is mostly made of things we cannot see — a humbling reminder from the stars of Ziro.',
    },
    {
      title: 'Gravitational lensing — when gravity bends light',
      concept: `Einstein predicted that massive objects curve spacetime, causing light to follow curved paths. When a massive galaxy or cluster lies between us and a distant object, it acts as a **gravitational lens**, bending and magnifying the distant light.

Types of gravitational lensing:
- **Strong lensing**: creates multiple images, arcs, or Einstein rings from a single background source. Requires a very massive foreground object perfectly aligned.
- **Weak lensing**: subtly distorts shapes of thousands of background galaxies. Used to map dark matter distribution.
- **Microlensing**: a star passes in front of another star, briefly magnifying it. Used to detect exoplanets and MACHOs (Massive Astrophysical Compact Halo Objects).

The Einstein radius (angular size of the ring) depends on:
- Mass of the lens
- Distance to the lens
- Distance to the source

Gravitational lensing is:
- A test of general relativity (confirmed in 1919 solar eclipse)
- A tool for measuring dark matter (mass = lens strength)
- A natural telescope (magnifies distant galaxies by 10-50×)`,
      analogy: 'Gravitational lensing is like looking through the bottom of a wine glass. The curved glass bends light from objects behind it, creating distorted, magnified, and sometimes multiple images. The "glass" in space is curved spacetime, and the "wine" is the mass causing the curvature.',
      storyConnection: 'From Ziro Valley, every photon of starlight reaching the children\'s eyes has been very slightly deflected by the gravity of every massive object along its path. Space itself is curved by mass. The straight lines of geometry become curves in the presence of gravity — and the universe becomes a hall of distorted mirrors.',
      checkQuestion: 'During a total solar eclipse in 1919, Arthur Eddington measured the positions of stars near the Sun. They appeared shifted by 1.75 arcseconds from their known positions. Why did this make Einstein famous?',
      checkAnswer: 'Einstein\'s general relativity predicted that the Sun\'s gravity would bend starlight by exactly 1.75 arcseconds. Newton\'s gravity predicted only 0.87 arcseconds (half the value). Eddington\'s measurement matched Einstein\'s prediction, confirming that gravity curves spacetime, not just pulls objects. Headlines read "LIGHTS ALL ASKEW IN THE HEAVENS" — and Einstein became a household name overnight.',
      codeIntro: 'Simulate gravitational lensing of a background source by a foreground mass.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Gravitational lensing simulation (point mass lens)
# Lens equation: theta_s = theta - theta_E^2 / theta
# theta_s = source position, theta = image position, theta_E = Einstein radius

theta_E = 1.0  # Einstein radius (arcseconds, normalized)

# Grid for deflection field
x = np.linspace(-3, 3, 400)
y = np.linspace(-3, 3, 400)
X, Y = np.meshgrid(x, y)
R = np.sqrt(X**2 + Y**2) + 1e-10  # distance from lens center

# Deflection angle
alpha_x = theta_E**2 * X / R**2
alpha_y = theta_E**2 * Y / R**2

# Source position (ray-traced from image plane)
source_X = X - alpha_x
source_Y = Y - alpha_y

fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.patch.set_facecolor('#1f2937')

# Background source (a circular galaxy)
source_x0, source_y0 = 0.3, 0.2  # slightly offset from lens
source_r = 0.3
source = np.exp(-((source_X - source_x0)**2 + (source_Y - source_y0)**2) / (2 * source_r**2))

# Unlensed source
unlensed = np.exp(-((X - source_x0)**2 + (Y - source_y0)**2) / (2 * source_r**2))

# Plot unlensed source
axes[0].set_facecolor('#0a0a14')
axes[0].imshow(unlensed, extent=[-3, 3, -3, 3], cmap='inferno', vmin=0, vmax=1, origin='lower')
axes[0].plot(0, 0, '+', color='#22c55e', markersize=15, markeredgewidth=2)
axes[0].set_title('Source (no lens)', color='white', fontsize=11)
axes[0].set_xlabel('arcseconds', color='gray')
axes[0].tick_params(colors='gray')

# Plot lensed image
axes[1].set_facecolor('#0a0a14')
axes[1].imshow(source, extent=[-3, 3, -3, 3], cmap='inferno', vmin=0, vmax=1, origin='lower')
axes[1].plot(0, 0, '+', color='#22c55e', markersize=15, markeredgewidth=2)
circle = plt.Circle((0, 0), theta_E, fill=False, color='#22c55e', linestyle='--', linewidth=1)
axes[1].add_patch(circle)
axes[1].set_title('Lensed Image (arc/ring)', color='white', fontsize=11)
axes[1].set_xlabel('arcseconds', color='gray')
axes[1].tick_params(colors='gray')
axes[1].text(0.5, -2.5, f'Einstein radius = {theta_E}"', color='#22c55e', fontsize=9)

# Magnification map
magnification = 1.0 / np.abs(1 - (theta_E / R)**4)
magnification = np.clip(magnification, 0, 20)

axes[2].set_facecolor('#0a0a14')
im = axes[2].imshow(magnification, extent=[-3, 3, -3, 3], cmap='hot', vmin=1, vmax=10, origin='lower')
axes[2].plot(0, 0, '+', color='#22c55e', markersize=15, markeredgewidth=2)
circle2 = plt.Circle((0, 0), theta_E, fill=False, color='#22c55e', linestyle='--', linewidth=1)
axes[2].add_patch(circle2)
axes[2].set_title('Magnification Map', color='white', fontsize=11)
axes[2].set_xlabel('arcseconds', color='gray')
axes[2].tick_params(colors='gray')
plt.colorbar(im, ax=axes[2], shrink=0.8, label='Magnification factor')

plt.tight_layout()
plt.show()

print("Gravitational lensing key facts:")
print(f"  Einstein radius: {theta_E} arcsecond")
print(f"  Source offset: ({source_x0}, {source_y0}) arcsec from lens")
print(f"  Peak magnification: {magnification.max():.0f}x (at Einstein ring)")
print()
print("Applications:")
print("  - Mapping dark matter (mass → lens strength)")
print("  - Magnifying distant galaxies (natural telescope)")
print("  - Detecting exoplanets (microlensing events)")`,
      challenge: 'Move the source directly behind the lens (x0=0, y0=0). What shape does the lensed image become? This is the famous Einstein ring — predicted in 1936, first observed in 1998.',
      successHint: 'Gravitational lensing turns the universe into a lens shop. Every massive object bends light, and by measuring the bending, we can weigh the invisible. It is the primary tool for mapping dark matter — turning Einstein\'s abstract equations into a practical astronomical instrument.',
    },
    {
      title: 'Cosmological redshift — measuring the expanding universe',
      concept: `In 1929, Edwin Hubble discovered that almost every galaxy is moving away from us, and the farther away a galaxy is, the faster it recedes. This is **Hubble's Law**:

**v = H₀ × d**

Where v is recession velocity, H₀ is the Hubble constant (~70 km/s/Mpc), and d is distance.

This does not mean galaxies are flying through space away from us. Space itself is expanding, carrying galaxies along. The light from distant galaxies is stretched during its journey, shifting its wavelength toward the red end of the spectrum — **cosmological redshift**.

Redshift z is defined as: z = (λ_observed - λ_emitted) / λ_emitted

Key redshift values:
- z = 0: here and now
- z = 0.1: galaxy ~1.4 billion light-years away
- z = 1: galaxy ~7.7 billion light-years away (light took 7.7 billion years)
- z = 10: galaxy ~13.1 billion years ago (early universe)
- z = 1089: cosmic microwave background (380,000 years after Big Bang)

The expansion means the universe had a beginning — the Big Bang, ~13.8 billion years ago. The children of Ziro, looking at distant galaxies, were looking back in time.`,
      analogy: 'Cosmological redshift is like dots drawn on a balloon being inflated. As the balloon (space) expands, every dot (galaxy) moves away from every other dot. A bug crawling between two dots (a photon of light) has to travel farther because the surface stretches during the journey. The stretching of the bug\'s path = redshift of light.',
      storyConnection: 'When the children of Ziro looked at the Andromeda galaxy (visible to the naked eye at magnitude 3.4), they were seeing light that left 2.5 million years ago — when our ancestors were first learning to use stone tools. Every star, every galaxy they saw was a time machine, showing the universe as it was, not as it is.',
      checkQuestion: 'If the universe is expanding, does that mean we are at the center of the expansion?',
      checkAnswer: 'No. Every point in the universe sees every other point receding. It is like the balloon analogy: no dot on the balloon is the "center of expansion." The expansion is uniform — there is no center, no edge. This is called the cosmological principle: the universe looks the same from every point (on large scales). The children of Ziro are no more or less "central" than observers anywhere else in the cosmos.',
      codeIntro: 'Visualize Hubble\'s Law and the expanding universe.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Hubble's Law: v = H0 * d
H0 = 70  # km/s/Mpc (Hubble constant)

distances = np.linspace(0, 5000, 200)  # Mpc
velocities = H0 * distances  # km/s

# Redshift: z = v/c for small v (special relativity approximation)
c = 3e5  # km/s
redshift_approx = velocities / c

# More accurate: 1+z = sqrt((1+v/c)/(1-v/c)) for special relativity
# But for cosmological redshift, need full GR. Use approximation for visualization.

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5.5))
fig.patch.set_facecolor('#1f2937')

# Hubble diagram
ax1.set_facecolor('#111827')
ax1.plot(distances, velocities, color='#ef4444', linewidth=2)
ax1.set_xlabel('Distance (Mpc)', color='white')
ax1.set_ylabel('Recession velocity (km/s)', color='white')
ax1.set_title("Hubble's Law: v = H₀ × d", color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Add some "observed galaxies"
np.random.seed(42)
obs_d = np.random.uniform(50, 4000, 30)
obs_v = H0 * obs_d + np.random.normal(0, 500, 30)
ax1.scatter(obs_d, obs_v, c='white', s=20, alpha=0.7, zorder=5, label='Observed galaxies')

ax1.text(1000, 300000, f'H₀ = {H0} km/s/Mpc', color='#f59e0b', fontsize=11)
ax1.text(1000, 270000, f'Slope = Hubble constant', color='#f59e0b', fontsize=9)
ax1.legend(facecolor='#1f2937', labelcolor='white')

# Expansion visualization (dots on expanding grid)
ax2.set_facecolor('#0a0a14')

# Show universe at 3 different times
np.random.seed(7)
n_galaxies = 15
base_x = np.random.uniform(-1, 1, n_galaxies)
base_y = np.random.uniform(-1, 1, n_galaxies)

scale_factors = [0.5, 0.75, 1.0]
times = ['Early universe', 'Middle age', 'Today']
colors = ['#3b82f6', '#f59e0b', '#22c55e']
offsets = [-3, 0, 3]

for sf, t, color, offset in zip(scale_factors, times, colors, offsets):
    gx = base_x * sf + offset
    gy = base_y * sf
    ax2.scatter(gx, gy, c=color, s=40, alpha=0.8, zorder=5)
    ax2.text(offset, -1.8, f'{t}\\n(a={sf})', ha='center', color=color, fontsize=9)

    # Draw expansion arrows between epochs
    if sf < 1.0:
        next_sf = scale_factors[scale_factors.index(sf) + 1]
        next_offset = offsets[scale_factors.index(sf) + 1]

# Arrows showing expansion
for i in range(len(scale_factors)-1):
    ax2.annotate('', xy=(offsets[i+1]-1.2, 0), xytext=(offsets[i]+1.2, 0),
                arrowprops=dict(arrowstyle='->', color='white', lw=1.5))
    ax2.text((offsets[i]+offsets[i+1])/2, 0.3, 'expansion', ha='center', color='white', fontsize=8)

ax2.set_title('Universe Expansion: Galaxies Move Apart', color='white', fontsize=12)
ax2.set_xlim(-5, 5)
ax2.set_ylim(-2.5, 2)
ax2.axis('off')

plt.tight_layout()
plt.show()

# Lookback times for different redshifts
print("Redshift → lookback time → distance:")
redshifts = [0.01, 0.1, 0.5, 1.0, 2.0, 5.0, 10.0]
for z in redshifts:
    # Approximate lookback time (simplified flat ΛCDM)
    from_age = 13.8 / (1 + z)**1.5  # very rough
    lookback = 13.8 - from_age
    d_mpc = z * c / H0  # linear approx, valid for small z
    print(f"  z={z:>5.2f}: lookback ~{lookback:.1f} Gyr, d ~{min(d_mpc, 14000):.0f} Mpc")

print()
print(f"Age of universe: 13.8 billion years")
print(f"Observable universe radius: ~46.5 billion light-years")
print(f"(Larger than 13.8 Gly because space expanded during light travel)")`,
      challenge: 'If H₀ were 100 km/s/Mpc instead of 70, the universe would be younger. Calculate the "Hubble time" (1/H₀) for both values. The Hubble time approximates the age of the universe.',
      successHint: 'From the dark skies of Ziro Valley to the expanding universe — you have journeyed from photons hitting retinas to the largest-scale structure of reality. The same stars the Apatani people have watched for millennia are our connection to a cosmos 13.8 billion years old, 93 billion light-years across, and still expanding.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build on Level 1 astronomy foundations</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced astrophysics simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
