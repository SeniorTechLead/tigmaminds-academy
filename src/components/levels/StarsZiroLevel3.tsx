import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function StarsZiroLevel3() {
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
      title: 'Stellar magnitudes & the magnitude scale',
      concept: `When you look up at the night sky from Ziro Valley, some stars blaze brightly while others are barely visible. Astronomers needed a system to quantify these differences, and the result is the **magnitude scale** — one of the oldest measurement systems in science, dating back to Hipparchus around 130 BCE. He ranked stars from 1st magnitude (brightest) to 6th magnitude (faintest visible). The key insight: the scale is **inverted**. Lower numbers mean brighter objects. The Sun is magnitude -26.7, the full Moon is -12.6, and the faintest stars visible from Ziro Valley on a perfect night are about magnitude +6.5.

In the 1850s, Norman Pogson formalized the scale mathematically. He established that a difference of 5 magnitudes corresponds to exactly a factor of 100 in brightness. This means each magnitude step is a factor of 100^(1/5) = 2.512, known as **Pogson's ratio**. The relationship is logarithmic: m1 - m2 = -2.5 * log10(F1/F2), where m is magnitude and F is flux (brightness). This logarithmic nature mirrors how human vision works — our eyes perceive brightness on a roughly logarithmic scale, which is why Hipparchus's original ranking was so naturally useful.

There is a critical distinction between **apparent magnitude** (how bright a star appears from Earth) and **absolute magnitude** (how bright it would appear at a standard distance of 10 parsecs, or 32.6 light-years). Sirius has an apparent magnitude of -1.46 (the brightest star in our sky) but an absolute magnitude of only +1.42. Deneb, which appears dimmer at apparent magnitude +1.25, has an absolute magnitude of -8.4 — it is intrinsically about 200,000 times more luminous than the Sun. The difference between apparent and absolute magnitude is the **distance modulus**, and it directly encodes distance: m - M = 5 * log10(d/10), where d is distance in parsecs.`,
      analogy: 'Think of magnitude like comparing campfires. A small fire 10 meters away and a massive bonfire 2 kilometers away might look equally bright to you. Apparent magnitude is how bright each fire looks from where you stand. Absolute magnitude is how bright each fire would look if you placed them all exactly the same distance away — then the bonfire clearly wins. The magnitude scale is logarithmic for the same reason the Richter scale is: the range of brightnesses in the universe is so vast that a linear scale would be useless.',
      storyConnection: 'The Apatani people of Ziro Valley have observed the night sky for generations, noting how the stars shift with the seasons to guide their agricultural calendar. The remarkable darkness of their valley — nestled among the hills of Arunachal Pradesh — means they can see stars down to magnitude 6 or fainter, a privilege lost to most of the modern world. When the story says "stars are brighter in Ziro," it is really saying the sky background is darker, allowing fainter magnitudes to be seen.',
      checkQuestion: 'Star A has apparent magnitude +1.0 and star B has apparent magnitude +6.0. How many times brighter is star A than star B?',
      checkAnswer: 'The difference is 5.0 magnitudes. Since 5 magnitudes = a factor of exactly 100 in brightness, star A is 100 times brighter than star B. You can also compute it: 2.512^5 = 100. This is why a magnitude +6 star (the faintest visible to the naked eye) receives 100 times less light than a magnitude +1 star.',
      codeIntro: 'Build the magnitude scale from scratch: convert between magnitudes and fluxes, compute distance moduli, and plot a magnitude comparison chart for famous stars.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Pogson's ratio
POGSON = 100 ** (1/5)  # ~2.512

def mag_to_flux_ratio(m1, m2):
    """Flux ratio F1/F2 from magnitudes m1, m2."""
    return 10 ** ((m2 - m1) / 2.5)

def flux_ratio_to_mag_diff(ratio):
    """Magnitude difference from flux ratio."""
    return -2.5 * np.log10(ratio)

def distance_modulus(apparent_mag, absolute_mag):
    """Distance in parsecs from apparent and absolute magnitudes."""
    return 10 ** ((apparent_mag - absolute_mag + 5) / 5)

# Famous stars: name, apparent mag, absolute mag
stars = [
    ('Sun',       -26.74,  4.83),
    ('Sirius',     -1.46,  1.42),
    ('Canopus',    -0.74, -5.53),
    ('Vega',        0.03,  0.58),
    ('Betelgeuse',  0.42, -5.85),
    ('Deneb',       1.25, -8.38),
    ('Polaris',     1.98, -3.64),
    ('Ziro naked-eye limit', 6.5, None),
]

print("STELLAR MAGNITUDE TABLE")
print(f"{'Star':<22} {'App mag':>8} {'Abs mag':>8} {'Distance':>12} {'x brighter':>14}")
print("-" * 68)
for name, app, abso in stars:
    if abso is not None:
        d = distance_modulus(app, abso)
        ratio = mag_to_flux_ratio(app, 6.5)  # vs faintest visible
        print(f"{name:<22} {app:>8.2f} {abso:>8.2f} {d:>10.1f} pc {ratio:>12.1f}x")
    else:
        print(f"{name:<22} {app:>8.2f} {'---':>8} {'---':>12} {'1.0x (limit)':>14}")

# --- Plot 1: Magnitude scale visualization ---
fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

ax = axes[0]
ax.set_facecolor('#111827')

star_names = [s[0] for s in stars]
app_mags = [s[1] for s in stars]
colors = ['#fbbf24', '#60a5fa', '#f472b6', '#a78bfa', '#ef4444', '#34d399', '#fb923c', '#6b7280']

# Horizontal bar chart (inverted: brighter = longer bar)
max_mag = 8
bar_lengths = [max_mag - m for m in app_mags]
bars = ax.barh(range(len(stars)), bar_lengths, color=colors, edgecolor='none', height=0.6)
ax.set_yticks(range(len(stars)))
ax.set_yticklabels(star_names, color='white', fontsize=9)
ax.set_xlabel('Brightness (lower magnitude = brighter)', color='white')
ax.set_title('Apparent Magnitude Scale', color='white', fontsize=12)
ax.tick_params(colors='gray')
ax.invert_yaxis()

for i, (bar, mag) in enumerate(zip(bars, app_mags)):
    ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
            f'm = {mag:+.2f}', va='center', color='white', fontsize=8)

# --- Plot 2: Pogson's ratio demonstration ---
ax = axes[1]
ax.set_facecolor('#111827')

mag_diffs = np.arange(0, 11)
flux_ratios = POGSON ** mag_diffs

ax.semilogy(mag_diffs, flux_ratios, 'o-', color='#fbbf24', linewidth=2, markersize=8)
ax.set_xlabel('Magnitude difference', color='white')
ax.set_ylabel('Brightness ratio (log scale)', color='white')
ax.set_title("Pogson's ratio: each step = 2.512x", color='white', fontsize=12)
ax.tick_params(colors='gray')
ax.grid(True, alpha=0.2)

for md, fr in zip(mag_diffs[::2], flux_ratios[::2]):
    ax.annotate(f'{fr:.0f}x', (md, fr), textcoords='offset points',
                xytext=(10, 5), color='#fbbf24', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.show()

print()
print(f"Pogson's ratio: {POGSON:.4f}")
print(f"5 magnitudes = {POGSON**5:.1f}x brightness (exactly 100x by definition)")
print(f"10 magnitudes = {POGSON**10:.0f}x brightness")
print(f"Deneb distance: {distance_modulus(1.25, -8.38):.0f} parsecs ({distance_modulus(1.25, -8.38)*3.26:.0f} light-years)")`,
      challenge: 'Add the planets Jupiter (app mag -2.5), Mars (+1.8 at opposition), and Saturn (+0.5) to the chart. Calculate how many times brighter Venus (mag -4.4) is than the faintest star visible from Ziro Valley (mag +6.5).',
      successHint: 'The logarithmic magnitude scale is your gateway to all of observational astronomy. Every telescope spec, every sky survey, every photometry paper uses this system. Mastering it means you can read the astronomical literature.',
    },
    {
      title: 'Atmospheric seeing & scintillation — why stars twinkle',
      concept: `Stars do not actually twinkle. They are point sources of light, steady and unchanging. What makes them appear to flicker is Earth\'s atmosphere — a turbulent, churning ocean of air that bends and distorts starlight as it passes through. This phenomenon is called **scintillation**, and understanding it is essential to astronomy.

The atmosphere is made of layers at different temperatures and densities. As light passes through these layers, it refracts (bends) slightly at each boundary. Because the atmosphere is turbulent — wind shears, convection cells, temperature inversions — these refractive boundaries shift constantly. The result: the apparent position, brightness, and color of a star all fluctuate on timescales of milliseconds to seconds. You see this as twinkling. Planets twinkle far less because they are extended sources (tiny disks, not points), so the fluctuations average out across the disk.

The key metric for atmospheric turbulence is the **Fried parameter** (r0), which measures the diameter of an atmospheric "coherence cell" — the patch of atmosphere over which the light wavefront is approximately flat. Typical values range from 5 cm (poor seeing, turbulent city air) to 20+ cm (excellent seeing, high-altitude observatories). In Ziro Valley, the calm mountain air and lack of urban heat islands produce Fried parameters significantly larger than lowland cities. A telescope with an aperture smaller than r0 gives diffraction-limited images; one larger than r0 is limited by seeing. This is why professional observatories use **adaptive optics** — deformable mirrors that correct for atmospheric distortion hundreds of times per second, effectively restoring diffraction-limited performance.`,
      analogy: 'Imagine looking at a coin at the bottom of a swimming pool. On a calm day, you see it clearly. But when someone starts swimming and making waves, the coin appears to shimmer, shift position, and distort. The pool water is your atmosphere, the waves are turbulent air cells, and the coin is a star. The Fried parameter tells you the size of the calmest patches of water — if your eye is smaller than a calm patch, the coin looks steady.',
      storyConnection: 'Ziro Valley sits at about 1,500 meters in the Eastern Himalayas, shielded by surrounding hills from the thermal turbulence of the plains. The Apatani tribe noticed long ago that stars in their valley appear steadier and clearer than in the lowland towns. This is not imagination — the valley acts as a natural seeing-improvement site. The same atmospheric stability that makes their rice-fish cultivation system work (predictable weather patterns) also makes their sky exceptionally steady.',
      checkQuestion: 'A telescope has a 30 cm aperture. On a night when the Fried parameter is 10 cm, what limits the telescope resolution — diffraction or atmospheric seeing? What if r0 were 40 cm?',
      checkAnswer: 'When aperture (30 cm) > r0 (10 cm), the atmosphere limits resolution. The telescope effectively behaves like a 10 cm telescope. When r0 is 40 cm (larger than the aperture), the atmosphere is so calm that the telescope reaches its diffraction limit — it performs at full 30 cm resolution. This is why small telescopes are less affected by seeing and why Ziro Valley benefits all observers, not just those with large scopes.',
      codeIntro: 'Simulate atmospheric scintillation: model turbulent phase screens, show how the Fried parameter affects image quality, and demonstrate why stars twinkle but planets do not.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Simulate atmospheric turbulence using Kolmogorov phase screens ---
def generate_phase_screen(size, r0, L=10.0):
    """Generate a Kolmogorov turbulence phase screen.
    size: grid size in pixels
    r0: Fried parameter in meters
    L: physical size of screen in meters
    """
    freqs = np.fft.fftfreq(size, d=L/size)
    fx, fy = np.meshgrid(freqs, freqs)
    f_mag = np.sqrt(fx**2 + fy**2)
    f_mag[0, 0] = 1  # avoid division by zero

    # Kolmogorov power spectrum: PSD ~ f^(-11/3)
    psd = 0.023 * r0**(-5/3) * f_mag**(-11/3)
    psd[0, 0] = 0

    # Random phases
    noise = np.random.randn(size, size) + 1j * np.random.randn(size, size)
    phase_screen = np.real(np.fft.ifft2(noise * np.sqrt(psd) * size))
    return phase_screen

# --- Scintillation simulation ---
n_frames = 200
time_axis = np.linspace(0, 4, n_frames)  # 4 seconds

# Point source (star) scintillation at different r0
r0_values = [0.05, 0.10, 0.20]  # 5cm (city), 10cm (ok), 20cm (Ziro-like)
labels = ['City (r0=5cm)', 'Suburban (r0=10cm)', 'Ziro Valley (r0=20cm)']
colors = ['#ef4444', '#fbbf24', '#22c55e']

star_brightness = {}
for r0 in r0_values:
    brightness = []
    for _ in range(n_frames):
        screen = generate_phase_screen(64, r0)
        # Point source: intensity fluctuation ~ variance of phase
        phase_var = np.var(screen[28:36, 28:36])
        # Scintillation index approximation
        intensity = np.exp(-phase_var / 2) + 0.3 * np.random.randn() * (0.05 / r0)
        brightness.append(max(0.1, intensity))
    star_brightness[r0] = np.array(brightness)

# Extended source (planet) — averages over disk
planet_brightness = {}
for r0 in r0_values:
    brightness = []
    for _ in range(n_frames):
        screen = generate_phase_screen(64, r0)
        # Average over larger area (planet is extended)
        region = screen[20:44, 20:44]
        phase_var = np.var(region) / 16  # averaging reduces variance
        intensity = np.exp(-phase_var / 2) + 0.05 * np.random.randn() * (0.05 / r0)
        brightness.append(max(0.5, intensity))
    planet_brightness[r0] = np.array(brightness)

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Star scintillation at different r0
ax = axes[0, 0]
ax.set_facecolor('#111827')
for r0, label, color in zip(r0_values, labels, colors):
    b = star_brightness[r0]
    b_norm = b / np.mean(b)
    ax.plot(time_axis, b_norm, color=color, linewidth=0.8, alpha=0.9, label=label)
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Relative brightness', color='white')
ax.set_title('Star scintillation (twinkling)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 2: Planet vs star
ax = axes[0, 1]
ax.set_facecolor('#111827')
r0_demo = 0.10
s = star_brightness[r0_demo] / np.mean(star_brightness[r0_demo])
p = planet_brightness[r0_demo] / np.mean(planet_brightness[r0_demo])
ax.plot(time_axis, s, color='#fbbf24', linewidth=0.8, alpha=0.8, label=f'Star (point source)')
ax.plot(time_axis, p, color='#60a5fa', linewidth=0.8, alpha=0.8, label=f'Planet (extended)')
ax.set_xlabel('Time (seconds)', color='white')
ax.set_ylabel('Relative brightness', color='white')
ax.set_title('Star vs planet scintillation', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 3: Scintillation index vs Fried parameter
ax = axes[1, 0]
ax.set_facecolor('#111827')
r0_range = np.linspace(0.03, 0.30, 30)
scint_indices = []
for r0 in r0_range:
    vals = []
    for _ in range(100):
        screen = generate_phase_screen(32, r0)
        phase_var = np.var(screen[12:20, 12:20])
        vals.append(np.exp(-phase_var / 2) + 0.3 * np.random.randn() * (0.05 / r0))
    scint_indices.append(np.std(vals) / np.mean(vals))

ax.plot(r0_range * 100, scint_indices, 'o-', color='#a78bfa', linewidth=2, markersize=4)
ax.axvspan(18, 25, alpha=0.15, color='#22c55e', label='Ziro Valley range')
ax.axvspan(3, 8, alpha=0.15, color='#ef4444', label='City range')
ax.set_xlabel('Fried parameter r0 (cm)', color='white')
ax.set_ylabel('Scintillation index (lower = steadier)', color='white')
ax.set_title('Atmospheric quality vs twinkling', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 4: Phase screen examples
ax = axes[1, 1]
ax.set_facecolor('#111827')
screen_good = generate_phase_screen(64, 0.20)
screen_bad = generate_phase_screen(64, 0.05)
combined = np.hstack([screen_bad, np.full((64, 4), np.nan), screen_good])
im = ax.imshow(combined, cmap='RdYlBu', aspect='auto')
ax.set_title('Phase screens: City (left) vs Ziro (right)', color='white', fontsize=11)
ax.set_xticks([32, 68 + 2])
ax.set_xticklabels(['City r0=5cm', 'Ziro r0=20cm'], color='white', fontsize=9)
ax.set_yticks([])
ax.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Scintillation comparison:")
for r0, label in zip(r0_values, labels):
    s = star_brightness[r0]
    si = np.std(s) / np.mean(s)
    print(f"  {label}: scintillation index = {si:.3f}")
print()
print("Lower scintillation index = steadier stars = better observing.")
print("Ziro Valley's calm mountain air gives 3-4x less twinkling than a city.")`,
      challenge: 'Add a simulation for a telescope with adaptive optics: at each timestep, subtract the mean phase from the screen (simulating a tip-tilt corrector). How much does this reduce the scintillation index? Real AO systems correct hundreds of modes.',
      successHint: 'Understanding atmospheric seeing is what separates casual stargazers from serious astronomers. Every telescope observation is a battle against the atmosphere. Sites like Ziro Valley win that battle through geography alone.',
    },
    {
      title: 'Light pollution physics — how artificial light steals the stars',
      concept: `Light pollution is not simply "too much light." It is a specific atmospheric phenomenon: artificial light emitted upward (or reflected upward from the ground) scatters off molecules and aerosols in the atmosphere, creating a luminous veil that raises the background brightness of the sky. This elevated sky background drowns out faint stars — not because the stars are dimmer, but because the contrast between star and sky is destroyed.

The scattering mechanisms are well understood. **Rayleigh scattering** (by air molecules) is proportional to wavelength^(-4), meaning blue light scatters far more than red. This is why cities with blue-white LED streetlights create worse light pollution than those with warm sodium lamps. **Mie scattering** (by aerosols, dust, water droplets) is roughly wavelength-independent and dominates when humidity is high. In the humid conditions common in Arunachal Pradesh during monsoon season, Mie scattering can double or triple the light pollution from a given source compared to dry conditions.

Sky brightness is measured in **magnitudes per square arcsecond** (mag/arcsec^2). A pristine dark sky measures about 22.0 mag/arcsec^2. A typical suburban sky is 19-20 mag/arcsec^2. A city center might be 16-17 mag/arcsec^2. Each 1 mag/arcsec^2 brighter means the sky background is 2.512x more luminous. The relationship between light on the ground and sky brightness follows an inverse-distance law (roughly): sky glow from a city decreases with distance, but slowly — a city of 100,000 people can degrade the sky 50-100 km away. Light pollution is measured to be growing globally at 2-6% per year, with South and Southeast Asia among the fastest-growing regions.`,
      analogy: 'Imagine trying to see fireflies in a dark forest versus in a brightly lit parking lot. The fireflies are equally bright in both places, but in the parking lot, the ambient light overwhelms their tiny flashes. Light pollution does exactly this to stars — it raises the "noise floor" of the sky until faint signals (dim stars, the Milky Way, nebulae) disappear into the background glow.',
      storyConnection: 'Ziro Valley remains one of the darkest accessible sites in northeastern India precisely because of its geography: surrounded by hills that block direct light from distant towns, and home to the Apatani tribe whose traditional land use creates minimal artificial light. The story celebrates what the Apatani have preserved — a sky where the Milky Way casts shadows. But Itanagar, just 120 km away, already shows a growing sky glow. The physics of light pollution means Ziro is not immune forever.',
      checkQuestion: 'Two cities have identical populations and lighting. City A uses warm sodium lamps (589 nm). City B uses cool white LEDs (peak ~450 nm). Which creates worse light pollution, and why?',
      checkAnswer: 'City B (LEDs) creates significantly worse light pollution. Rayleigh scattering intensity goes as wavelength^(-4). Blue light at 450 nm scatters (589/450)^4 = 2.9 times more strongly than sodium light at 589 nm. The blue-rich LED light is nearly 3 times more efficient at illuminating the sky. This is why the transition to LED street lighting has been a disaster for astronomy and nocturnal ecology, despite being more energy-efficient.',
      codeIntro: 'Model light pollution from first principles: Rayleigh and Mie scattering, sky brightness vs distance from a light source, and the effect of different lamp spectra.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Light scattering physics ---
def rayleigh_scattering(wavelength_nm):
    """Relative Rayleigh scattering intensity (proportional to lambda^-4)."""
    return (550 / wavelength_nm) ** 4  # normalized to green=1

def mie_scattering(wavelength_nm, aerosol_factor=1.0):
    """Mie scattering: roughly wavelength-independent for large particles."""
    return aerosol_factor * np.ones_like(wavelength_nm)

# Lamp spectra (simplified)
wavelengths = np.linspace(380, 750, 200)

def sodium_spectrum(wl):
    """Low-pressure sodium: narrow emission at 589nm."""
    return np.exp(-((wl - 589) ** 2) / (2 * 5**2))

def led_cool_spectrum(wl):
    """Cool white LED: blue peak ~450nm + broad phosphor."""
    blue_peak = 0.8 * np.exp(-((wl - 450) ** 2) / (2 * 15**2))
    phosphor = 0.5 * np.exp(-((wl - 580) ** 2) / (2 * 60**2))
    return blue_peak + phosphor

def led_warm_spectrum(wl):
    """Warm white LED: reduced blue, stronger amber."""
    blue_peak = 0.3 * np.exp(-((wl - 450) ** 2) / (2 * 15**2))
    phosphor = 0.7 * np.exp(-((wl - 600) ** 2) / (2 * 60**2))
    return blue_peak + phosphor

# Compute scattered light for each lamp type
sodium_spec = sodium_spectrum(wavelengths)
led_cool_spec = led_cool_spectrum(wavelengths)
led_warm_spec = led_warm_spectrum(wavelengths)
rayleigh = rayleigh_scattering(wavelengths)

sodium_scattered = sodium_spec * rayleigh
led_cool_scattered = led_cool_spec * rayleigh
led_warm_scattered = led_warm_spec * rayleigh

# Total scattered light (integral)
sodium_total = np.trapz(sodium_scattered, wavelengths)
led_cool_total = np.trapz(led_cool_scattered, wavelengths)
led_warm_total = np.trapz(led_warm_scattered, wavelengths)

# Normalize to sodium = 1
norm = sodium_total
sodium_total /= norm
led_cool_total /= norm
led_warm_total /= norm

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: Lamp spectra
ax = axes[0, 0]
ax.set_facecolor('#111827')
ax.fill_between(wavelengths, sodium_spec, alpha=0.3, color='#fbbf24')
ax.plot(wavelengths, sodium_spec, color='#fbbf24', linewidth=2, label='Sodium (HPS)')
ax.fill_between(wavelengths, led_cool_spec, alpha=0.3, color='#60a5fa')
ax.plot(wavelengths, led_cool_spec, color='#60a5fa', linewidth=2, label='Cool white LED')
ax.plot(wavelengths, led_warm_spec, color='#f97316', linewidth=2, label='Warm white LED')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Relative intensity', color='white')
ax.set_title('Lamp emission spectra', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 2: Scattered spectra
ax = axes[0, 1]
ax.set_facecolor('#111827')
ax.fill_between(wavelengths, sodium_scattered, alpha=0.3, color='#fbbf24')
ax.plot(wavelengths, sodium_scattered, color='#fbbf24', linewidth=2, label='Sodium scattered')
ax.fill_between(wavelengths, led_cool_scattered, alpha=0.3, color='#60a5fa')
ax.plot(wavelengths, led_cool_scattered, color='#60a5fa', linewidth=2, label='Cool LED scattered')
ax.plot(wavelengths, led_warm_scattered, color='#f97316', linewidth=2, label='Warm LED scattered')
ax.plot(wavelengths, rayleigh / rayleigh.max() * 0.5, '--', color='gray', linewidth=1, label='Rayleigh curve')
ax.set_xlabel('Wavelength (nm)', color='white')
ax.set_ylabel('Sky-scattered intensity', color='white')
ax.set_title('What the sky sees (emission x scattering)', color='white', fontsize=11)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8)
ax.tick_params(colors='gray')

# Plot 3: Sky brightness vs distance from city
ax = axes[1, 0]
ax.set_facecolor('#111827')

distances_km = np.linspace(1, 200, 200)
# Sky glow model: brightness ~ population * lamp_factor / distance^2.5 (empirical)
population = 100000
for factor, label, color in [
    (sodium_total, 'Sodium lamps', '#fbbf24'),
    (led_cool_total, 'Cool LEDs', '#60a5fa'),
    (led_warm_total, 'Warm LEDs', '#f97316'),
]:
    sky_brightness = population * factor / (distances_km ** 2.5) * 1e4
    # Convert to mag/arcsec^2: natural sky = 22.0
    natural_sky = 22.0
    sky_mag = natural_sky - 2.5 * np.log10(1 + sky_brightness / 100)
    ax.plot(distances_km, sky_mag, color=color, linewidth=2, label=label)

ax.axhline(22.0, color='#22c55e', linestyle='--', alpha=0.5, label='Natural sky (22.0)')
ax.axhline(21.5, color='gray', linestyle=':', alpha=0.5, label='Bortle 2 limit')
ax.axhline(20.0, color='#ef4444', linestyle=':', alpha=0.5, label='Suburban (20.0)')
ax.axvline(120, color='#a78bfa', linestyle='--', alpha=0.5, label='Ziro-Itanagar dist')
ax.set_xlabel('Distance from city (km)', color='white')
ax.set_ylabel('Sky brightness (mag/arcsec²)', color='white')
ax.set_title('Sky glow vs distance (100k population)', color='white', fontsize=11)
ax.invert_yaxis()
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7, ncol=2)
ax.tick_params(colors='gray')

# Plot 4: Comparison bar chart
ax = axes[1, 1]
ax.set_facecolor('#111827')
lamp_types = ['Sodium\\n(HPS)', 'Warm\\nLED', 'Cool\\nLED']
scatter_factors = [sodium_total, led_warm_total, led_cool_total]
bar_colors = ['#fbbf24', '#f97316', '#60a5fa']
bars = ax.bar(lamp_types, scatter_factors, color=bar_colors, edgecolor='none', width=0.5)
ax.set_ylabel('Relative sky pollution (sodium = 1.0)', color='white')
ax.set_title('Light pollution by lamp type', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, val in zip(bars, scatter_factors):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
            f'{val:.2f}x', ha='center', color='white', fontsize=12, fontweight='bold')

plt.tight_layout()
plt.show()

print(f"Relative sky pollution (Rayleigh scattering):")
print(f"  Sodium lamps:   {sodium_total:.2f}x (baseline)")
print(f"  Warm white LED: {led_warm_total:.2f}x")
print(f"  Cool white LED: {led_cool_total:.2f}x")
print()
print("Cool white LEDs produce {:.1f}x more sky glow than sodium lamps.".format(led_cool_total))
print("Switching to warm LEDs or filtered LEDs can cut light pollution significantly.")`,
      challenge: 'Add Mie scattering to the model with a humidity parameter (0 = dry, 1 = monsoon). Show how the relative advantage of sodium vs LED changes with humidity. In humid conditions, the wavelength advantage of sodium diminishes because Mie scattering is wavelength-independent.',
      successHint: 'Light pollution is a solvable problem. Unlike other forms of pollution, it disappears the instant you turn off the light. Understanding the physics empowers you to advocate for better lighting policies — shielded fixtures, warm color temperatures, and dark sky preserves like Ziro Valley.',
    },
    {
      title: 'Bortle scale & sky quality measurement',
      concept: `The **Bortle Dark-Sky Scale** is a nine-level numeric scale that rates the night sky's darkness and stellar visibility from a given location. Created by John Bortle in 2001, it ranges from Class 1 (the darkest sky attainable on Earth, found only in the most remote locations) to Class 9 (inner-city sky where only the Moon, planets, and a few bright stars are visible). Each class has specific observational criteria: can you see the zodiacal light? Is the Milky Way visible? Can you see M33 (the Triangulum Galaxy) with the naked eye? These benchmarks make the scale practical even without instruments.

For quantitative measurement, astronomers use a **Sky Quality Meter** (SQM), a handheld device that measures sky brightness in magnitudes per square arcsecond (mag/arcsec^2). The SQM has a sensor with a roughly 20-degree field of view pointed at zenith (straight up). Typical readings: Bortle 1 sites measure 21.7-22.0 mag/arcsec^2, Bortle 4 (rural-suburban) reads about 20.5-21.0, and Bortle 8-9 (city center) reads 16-18. The relationship between SQM readings and Bortle class is approximately linear, but local factors (altitude, humidity, aerosol content, Moon phase) introduce scatter.

The **limiting magnitude** — the faintest star visible to the naked eye — correlates with Bortle class. From a Bortle 1 site, a dark-adapted observer can see stars to magnitude +7.5 or fainter. From a Bortle 5 suburban site, the limit drops to about +5.0. From a Bortle 9 city center, you might only see stars to magnitude +3.0 or +4.0. This means a city dweller sees perhaps 200-500 stars, while a Ziro Valley observer can see over 9,000. The difference is not subtle — it is the difference between glimpsing a few constellations and witnessing the full structure of the Milky Way.`,
      analogy: 'The Bortle scale is like a hearing test for the sky. In a quiet recording studio (Bortle 1), you can hear a pin drop at 30 meters — faint stars, dim galaxies, the zodiacal light, gegenschein. In a noisy restaurant (Bortle 5), you can only hear people shouting — only the bright stars. In a rock concert (Bortle 9), you can barely hear the person next to you — only the Moon and planets. The SQM is the decibel meter that quantifies the noise floor.',
      storyConnection: 'Ziro Valley likely rates Bortle 2-3 on the best nights: the Milky Way is vivid with obvious structure, the zodiacal light is clearly visible, and dark-adapted eyes can see thousands of stars. This is what the Apatani people have always known. But as development reaches Arunachal Pradesh, the first signs of light pollution creep in — a faint dome of light over Itanagar to the south. Measuring and documenting the current sky quality with SQM data creates a baseline for conservation, just as the Apatani measure water quality in their fish ponds.',
      checkQuestion: 'An SQM reading of 21.5 mag/arcsec^2 means the sky brightness per square arcsecond is equivalent to a magnitude 21.5 star. If light pollution raises the sky brightness by 0.5 mag/arcsec^2 (to 21.0), by what factor has the sky brightness increased?',
      checkAnswer: 'A decrease of 0.5 magnitudes in sky brightness (remember, lower mag/arcsec^2 = brighter sky) means the sky is 10^(0.5/2.5) = 10^0.2 = 1.585 times brighter. This seemingly small change eliminates roughly 1,000 visible stars, as many faint stars now fall below the contrast threshold against the brighter background.',
      codeIntro: 'Build a complete Bortle scale classifier: input SQM readings and observational data, output Bortle class with predictions of visible objects and star counts.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# --- Bortle Scale Data ---
bortle_data = {
    1: {'name': 'Excellent dark-sky site', 'sqm_min': 21.75, 'sqm_max': 22.0,
        'limiting_mag': 7.6, 'stars_visible': 9000, 'color': '#1a1a2e'},
    2: {'name': 'Typical dark site', 'sqm_min': 21.6, 'sqm_max': 21.75,
        'limiting_mag': 7.1, 'stars_visible': 5500, 'color': '#16213e'},
    3: {'name': 'Rural sky', 'sqm_min': 21.3, 'sqm_max': 21.6,
        'limiting_mag': 6.6, 'stars_visible': 4500, 'color': '#1a1a4e'},
    4: {'name': 'Rural/suburban transition', 'sqm_min': 20.8, 'sqm_max': 21.3,
        'limiting_mag': 6.2, 'stars_visible': 3000, 'color': '#2a2a5e'},
    5: {'name': 'Suburban sky', 'sqm_min': 20.3, 'sqm_max': 20.8,
        'limiting_mag': 5.6, 'stars_visible': 1800, 'color': '#3a3a6e'},
    6: {'name': 'Bright suburban sky', 'sqm_min': 19.5, 'sqm_max': 20.3,
        'limiting_mag': 5.1, 'stars_visible': 1000, 'color': '#4a4a7e'},
    7: {'name': 'Suburban/urban transition', 'sqm_min': 18.5, 'sqm_max': 19.5,
        'limiting_mag': 4.6, 'stars_visible': 500, 'color': '#6a5a7e'},
    8: {'name': 'City sky', 'sqm_min': 17.5, 'sqm_max': 18.5,
        'limiting_mag': 4.0, 'stars_visible': 250, 'color': '#8a6a6e'},
    9: {'name': 'Inner-city sky', 'sqm_min': 16.0, 'sqm_max': 17.5,
        'limiting_mag': 3.0, 'stars_visible': 100, 'color': '#aa7a5e'},
}

def classify_bortle(sqm_reading):
    """Classify a sky quality reading into a Bortle class."""
    for cls in range(1, 10):
        data = bortle_data[cls]
        if sqm_reading >= data['sqm_min']:
            return cls
    return 9

def estimate_stars_visible(limiting_mag):
    """Estimate number of stars visible based on limiting magnitude.
    Uses empirical stellar count: N(m) ~ 10^(0.6*m) for m > 3."""
    if limiting_mag < 1:
        return 5
    return int(10 ** (0.6 * limiting_mag - 0.8))

# --- Simulate SQM readings for different locations ---
locations = {
    'Ziro Valley (Apatani plateau)': (21.7, 0.15),
    'Tawang monastery': (21.4, 0.2),
    'Shillong city outskirts': (19.8, 0.3),
    'Guwahati center': (17.5, 0.4),
    'Itanagar': (18.8, 0.3),
    'Delhi center': (16.5, 0.5),
}

np.random.seed(42)
n_readings = 50  # readings per location

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Plot 1: SQM readings distribution for each location
ax = axes[0, 0]
ax.set_facecolor('#111827')
loc_colors = ['#22c55e', '#34d399', '#fbbf24', '#ef4444', '#f97316', '#f43f5e']
positions = []
for i, (loc, (mean_sqm, std)) in enumerate(locations.items()):
    readings = np.random.normal(mean_sqm, std, n_readings)
    readings = np.clip(readings, 15, 22.5)
    bp = ax.boxplot(readings, positions=[i], widths=0.5, patch_artist=True,
                    boxprops=dict(facecolor=loc_colors[i], alpha=0.6),
                    medianprops=dict(color='white', linewidth=2),
                    whiskerprops=dict(color='gray'),
                    capprops=dict(color='gray'),
                    flierprops=dict(markeredgecolor='gray', markersize=3))
    positions.append(i)

ax.set_xticks(range(len(locations)))
ax.set_xticklabels([loc.split('(')[0].strip() for loc in locations.keys()],
                   color='white', fontsize=7, rotation=30, ha='right')
ax.set_ylabel('SQM reading (mag/arcsec²)', color='white')
ax.set_title('Sky quality: NE India locations', color='white', fontsize=11)
ax.invert_yaxis()
ax.tick_params(colors='gray')

# Add Bortle class bands
for cls, data in bortle_data.items():
    if cls <= 7:
        ax.axhspan(data['sqm_min'], data['sqm_max'], alpha=0.08, color='white')
        ax.text(len(locations) - 0.3, (data['sqm_min'] + data['sqm_max'])/2,
                f'B{cls}', color='gray', fontsize=7, va='center')

# Plot 2: Bortle scale visual
ax = axes[0, 1]
ax.set_facecolor('#111827')
classes = list(range(1, 10))
star_counts = [bortle_data[c]['stars_visible'] for c in classes]
bar_colors = [bortle_data[c]['color'] for c in classes]
bars = ax.bar(classes, star_counts, color=bar_colors, edgecolor='#333', width=0.7)
ax.set_xlabel('Bortle class', color='white')
ax.set_ylabel('Stars visible to naked eye', color='white')
ax.set_title('Bortle scale: what you lose', color='white', fontsize=11)
ax.tick_params(colors='gray')
for bar, count in zip(bars, star_counts):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 100,
            f'{count:,}', ha='center', color='white', fontsize=8)
ax.axvspan(1.5, 3.5, alpha=0.1, color='#22c55e', label='Ziro range')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')

# Plot 3: Limiting magnitude vs SQM
ax = axes[1, 0]
ax.set_facecolor('#111827')
sqm_range = np.linspace(16, 22, 100)
# Empirical relation: limiting mag ~ 2.0 + 7.93 - 5*log10(10^((21.58-SQM)/5) + 1)
# Simplified: lim_mag ~ SQM * 0.4 - 1.5 (roughly linear)
lim_mag = []
for sqm in sqm_range:
    for cls in range(1, 10):
        d = bortle_data[cls]
        if sqm >= d['sqm_min']:
            lim_mag.append(d['limiting_mag'] + (sqm - d['sqm_min']) / (d['sqm_max'] - d['sqm_min']) * 0.5)
            break
    else:
        lim_mag.append(3.0)

ax.plot(sqm_range, lim_mag, color='#fbbf24', linewidth=2.5)
ax.set_xlabel('SQM reading (mag/arcsec²)', color='white')
ax.set_ylabel('Naked-eye limiting magnitude', color='white')
ax.set_title('Sky quality vs star visibility', color='white', fontsize=11)
ax.tick_params(colors='gray')
ax.grid(True, alpha=0.15)

# Mark locations
for loc, (mean_sqm, _) in locations.items():
    bortle = classify_bortle(mean_sqm)
    lm = bortle_data[bortle]['limiting_mag']
    short_name = loc.split('(')[0].strip()
    if 'Ziro' in loc:
        ax.plot(mean_sqm, lm, 'o', color='#22c55e', markersize=10, zorder=5)
        ax.annotate(short_name, (mean_sqm, lm), textcoords='offset points',
                    xytext=(-60, 10), color='#22c55e', fontsize=8, fontweight='bold')
    else:
        ax.plot(mean_sqm, lm, 'o', color='#ef4444', markersize=6, zorder=5)
        ax.annotate(short_name, (mean_sqm, lm), textcoords='offset points',
                    xytext=(5, 5), color='gray', fontsize=7)

# Plot 4: What you can see at each Bortle class
ax = axes[1, 1]
ax.set_facecolor('#111827')
objects = {
    'M31 (Andromeda)':    (3.4, 1),
    'M45 (Pleiades)':     (1.6, 1),
    'M42 (Orion Nebula)': (4.0, 2),
    'M33 (Triangulum)':   (5.7, 2),
    'Milky Way center':   (None, 3),
    'Zodiacal light':     (None, 2),
    'Gegenschein':        (None, 1),
    'M81 (galaxy)':       (6.9, 3),
    'NGC 884 (cluster)':  (6.1, 3),
}
y_pos = range(len(objects))
for i, (obj, (mag, min_bortle)) in enumerate(objects.items()):
    bar_len = 10 - min_bortle
    ax.barh(i, bar_len, left=min_bortle, height=0.6,
            color='#a78bfa' if min_bortle <= 3 else '#fbbf24', alpha=0.7)
    ax.text(min_bortle - 0.2, i, obj, ha='right', va='center', color='white', fontsize=8)

ax.set_xlabel('Visible from Bortle class ... to 1', color='white')
ax.set_xlim(0, 10)
ax.set_yticks([])
ax.set_title('Deep sky objects: minimum Bortle class', color='white', fontsize=11)
ax.axvline(2.5, color='#22c55e', linestyle='--', alpha=0.5, label='Ziro (B2-3)')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white')
ax.tick_params(colors='gray')
ax.invert_xaxis()

plt.tight_layout()
plt.show()

print("\\nLocation analysis:")
print(f"{'Location':<35} {'SQM':>6} {'Bortle':>7} {'Stars':>7} {'Lim mag':>8}")
print("-" * 65)
for loc, (mean_sqm, _) in locations.items():
    bortle = classify_bortle(mean_sqm)
    data = bortle_data[bortle]
    print(f"{loc:<35} {mean_sqm:>6.1f} {bortle:>7} {data['stars_visible']:>7,} {data['limiting_mag']:>8.1f}")

print()
print("Ziro Valley: Bortle 2 — one of the darkest accessible sites in India.")
print("Guwahati: Bortle 8 — 36x fewer visible stars than Ziro.")`,
      challenge: 'Build an interactive Bortle classifier: given a set of yes/no observational questions (Can you see the Milky Way? Is it structured? Can you see zodiacal light?), determine the Bortle class without an SQM. This is how amateur astronomers classify sites in the field.',
      successHint: 'The Bortle scale transforms subjective impressions ("nice sky" vs "amazing sky") into reproducible science. Documenting Ziro Valley as a Bortle 2 site creates a scientific record that can drive dark sky conservation policy.',
    },
    {
      title: 'Photometry — measuring starlight with precision',
      concept: `Photometry is the science of measuring the brightness of celestial objects with precision. While your eye can estimate magnitudes to about +/- 0.5 mag, a modern CCD (charge-coupled device) detector can achieve +/- 0.001 mag — 500 times more precise. This precision has enabled the discovery of exoplanets (via tiny brightness dips during transits), the measurement of cosmic distances (via standard candles), and the classification of variable stars.

A CCD works by converting photons to electrons. Each pixel accumulates charge proportional to the number of photons hitting it during the exposure. The key challenge is **noise**: even a perfect detector has noise sources. **Photon noise** (shot noise) follows Poisson statistics — if you collect N photons, the uncertainty is sqrt(N). **Read noise** is electronic noise added when reading out the detector. **Dark current** is thermal electrons that accumulate even without light. **Sky background** is the biggest enemy in light-polluted sites: the sky itself adds photons to every pixel, and these photons bring their own shot noise. The fundamental metric is **signal-to-noise ratio** (SNR): SNR = S / sqrt(S + B + D + R^2), where S is star signal, B is sky background, D is dark current, and R is read noise.

**Aperture photometry** is the standard technique: place a circular aperture around a star, sum all the pixel values inside it (star + sky), then subtract the sky contribution measured from a surrounding annulus. The result is the net star flux. Calibrate against known standard stars, and you get a precise magnitude. Differential photometry — comparing your target to nearby comparison stars in the same image — can achieve millimagnitude precision even from a backyard telescope, because atmospheric effects cancel out when you divide by the comparison star.`,
      analogy: 'Photometry is like measuring rainfall with a rain gauge. The gauge collects water (photons) over time. But you also need to account for evaporation (dark current), splashing from nearby puddles (sky background), and the imprecision of reading the scale (read noise). Signal-to-noise is the difference between "it definitely rained 10mm" and "it rained somewhere between 0 and 20mm." Longer exposures (bigger gauge, more time) improve SNR because signal grows linearly but noise only grows as sqrt(time).',
      storyConnection: 'From Ziro Valley, even a small telescope with a CCD camera can do professional-quality photometry because the sky background (B in the SNR equation) is so low. A star that would be buried in sky noise from Guwahati stands out clearly from Ziro. This is why dark sky sites are not just beautiful — they are scientifically productive. The Apatani tradition of careful observation and measurement of their environment (water levels, fish growth, rice yields) parallels the astronomer\'s careful measurement of starlight.',
      checkQuestion: 'You observe a star that produces 10,000 photon counts. The sky background contributes 40,000 counts in the same aperture. What is the approximate SNR? How does this change if you observe from Ziro Valley where sky background is only 2,000 counts?',
      checkAnswer: 'From the bright site: SNR = 10000 / sqrt(10000 + 40000) = 10000/223.6 = 44.7. From Ziro Valley: SNR = 10000 / sqrt(10000 + 2000) = 10000/109.5 = 91.3. The dark site gives 2x better SNR, meaning 2x more precise measurements. To achieve the same SNR from the bright site, you would need 4x longer exposures (SNR scales as sqrt(time)).',
      codeIntro: 'Simulate CCD photometry from scratch: generate synthetic star fields with noise, perform aperture photometry, and show how sky brightness destroys SNR.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def generate_star_image(size=100, star_flux=10000, sky_brightness=100,
                        dark_current=10, read_noise=5, star_fwhm=3.0):
    """Generate a synthetic CCD image of a star with realistic noise."""
    y, x = np.mgrid[:size, :size]
    cx, cy = size // 2, size // 2
    sigma = star_fwhm / 2.355  # FWHM to sigma

    # Star PSF (Gaussian)
    star = star_flux * np.exp(-((x - cx)**2 + (y - cy)**2) / (2 * sigma**2))
    star /= (2 * np.pi * sigma**2)  # normalize, then scale
    star *= star_flux / star.sum()

    # Add sky background (Poisson)
    sky = np.random.poisson(sky_brightness, (size, size)).astype(float)

    # Add dark current (Poisson)
    dark = np.random.poisson(dark_current, (size, size)).astype(float)

    # Combine: signal is Poisson
    total_signal = star + sky_brightness + dark_current
    image = np.random.poisson(np.clip(total_signal, 0, None).astype(int)).astype(float)

    # Add read noise (Gaussian)
    image += np.random.normal(0, read_noise, (size, size))

    return image, star, sky_brightness

def aperture_photometry(image, cx, cy, r_aperture=10, r_inner=15, r_outer=25):
    """Perform aperture photometry with sky annulus subtraction."""
    y, x = np.mgrid[:image.shape[0], :image.shape[1]]
    dist = np.sqrt((x - cx)**2 + (y - cy)**2)

    # Star aperture
    star_mask = dist <= r_aperture
    star_sum = np.sum(image[star_mask])
    n_star_pixels = np.sum(star_mask)

    # Sky annulus
    sky_mask = (dist >= r_inner) & (dist <= r_outer)
    sky_per_pixel = np.median(image[sky_mask])
    n_sky_pixels = np.sum(sky_mask)

    # Subtract sky
    net_flux = star_sum - n_star_pixels * sky_per_pixel

    # SNR estimation
    noise = np.sqrt(np.abs(net_flux) + n_star_pixels * sky_per_pixel +
                    n_star_pixels * 10 + n_star_pixels * 25)  # dark + read^2
    snr = net_flux / noise if noise > 0 else 0

    return net_flux, sky_per_pixel, snr, star_mask, sky_mask

# --- Generate images at different sky brightnesses ---
sky_levels = [50, 500, 2000, 8000]  # photons/pixel: dark, rural, suburban, city
sky_labels = ['Dark site\\n(Ziro Valley)', 'Rural', 'Suburban', 'City\\n(Guwahati)']
sky_colors = ['#22c55e', '#34d399', '#fbbf24', '#ef4444']
star_flux = 10000

fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('CCD Photometry: Same star, different skies', color='white', fontsize=13)

snr_values = []
for i, (sky, label) in enumerate(zip(sky_levels, sky_labels)):
    image, star_truth, _ = generate_star_image(star_flux=star_flux, sky_brightness=sky)
    net_flux, sky_per_pix, snr, star_mask, sky_mask = aperture_photometry(image, 50, 50)
    snr_values.append(snr)

    # Top row: images
    ax = axes[0, i]
    ax.set_facecolor('#111827')
    vmin = np.percentile(image, 5)
    vmax = np.percentile(image, 99)
    ax.imshow(image[30:70, 30:70], cmap='hot', vmin=vmin, vmax=vmax, origin='lower')
    ax.set_title(f'{label}\\nSky={sky} e-/pix', color='white', fontsize=9)
    ax.set_xticks([]); ax.set_yticks([])

    # Draw apertures
    circle1 = plt.Circle((20, 20), 10, fill=False, color='cyan', linewidth=1)
    circle2 = plt.Circle((20, 20), 15, fill=False, color='gray', linewidth=0.5, linestyle='--')
    circle3 = plt.Circle((20, 20), 25, fill=False, color='gray', linewidth=0.5, linestyle='--')
    ax.add_patch(circle1)
    ax.add_patch(circle2)
    ax.add_patch(circle3)

    # Bottom row: radial profile
    ax = axes[1, i]
    ax.set_facecolor('#111827')
    cx, cy = 50, 50
    radii = np.arange(0, 40)
    profile = []
    for r in radii:
        y, x = np.mgrid[:100, :100]
        mask = (np.sqrt((x-cx)**2 + (y-cy)**2) >= r) & (np.sqrt((x-cx)**2 + (y-cy)**2) < r+1)
        if np.sum(mask) > 0:
            profile.append(np.mean(image[mask]))
        else:
            profile.append(0)
    ax.plot(radii, profile, color=sky_colors[i], linewidth=2)
    ax.axhline(sky_per_pix, color='gray', linestyle='--', linewidth=1, label=f'Sky: {sky_per_pix:.0f}')
    ax.axvline(10, color='cyan', linestyle=':', linewidth=1, label='Aperture edge')
    ax.set_xlabel('Radius (pixels)', color='white', fontsize=8)
    ax.set_ylabel('Counts/pixel', color='white', fontsize=8)
    ax.set_title(f'SNR = {snr:.1f}', color=sky_colors[i], fontsize=11, fontweight='bold')
    ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=7)
    ax.tick_params(colors='gray', labelsize=7)

plt.tight_layout()
plt.show()

# --- SNR vs exposure time ---
print("Photometry results (star flux = 10,000 photons):")
print(f"{'Site':<20} {'Sky (e-/pix)':>12} {'Net flux':>10} {'SNR':>8}")
print("-" * 54)
for label, sky, snr in zip(sky_labels, sky_levels, snr_values):
    clean_label = label.replace('\\n', ' ')
    print(f"{clean_label:<20} {sky:>12} {star_flux:>10} {snr:>8.1f}")

print()
print(f"Ziro Valley SNR is {snr_values[0]/snr_values[3]:.1f}x better than city SNR.")
print(f"To match Ziro's SNR from a city, you need {(snr_values[0]/snr_values[3])**2:.0f}x longer exposures.")`,
      challenge: 'Implement differential photometry: add a second "comparison star" to the image and measure the brightness ratio between target and comparison. Show that atmospheric variations (simulate by multiplying the whole image by a random factor each frame) cancel out in the ratio.',
      successHint: 'Photometry is the workhorse of observational astronomy. Exoplanet discoveries, supernova classifications, and asteroid surveys all depend on measuring brightness precisely. A dark sky like Ziro Valley gives every observation a head start in SNR.',
    },
    {
      title: 'Stellar classification — the OBAFGKM sequence & the HR diagram',
      concept: `Every star has a **spectral type** determined by its surface temperature. The classification scheme — **O, B, A, F, G, K, M** (remembered as "Oh Be A Fine Girl/Guy, Kiss Me") — runs from the hottest blue stars (O-type, ~30,000-50,000 K) to the coolest red stars (M-type, ~2,400-3,700 K). Our Sun is a G2V star: spectral type G, subtype 2 (on a 0-9 scale within each letter), luminosity class V (main sequence dwarf). Each spectral type is further divided into 10 subtypes (B0 through B9, then A0 through A9, etc.), giving a smooth temperature sequence.

The classification is based on **absorption lines** in the star's spectrum. Different temperatures excite different atoms and ions: O stars show ionized helium lines, A stars show strong hydrogen lines (Balmer series), G stars show calcium and iron lines, and M stars show titanium oxide molecular bands. This is not because the chemical compositions differ — most stars are ~73% hydrogen and ~25% helium — but because temperature determines which electron transitions are energetically favorable.

The **Hertzsprung-Russell (HR) diagram** plots luminosity (or absolute magnitude) against temperature (or spectral type). Stars do not scatter randomly across this plot. Most fall on the **main sequence**, a diagonal band from hot/luminous (upper-left) to cool/dim (lower-right). This band represents stars fusing hydrogen in their cores — the longest and most stable phase of stellar life. Above the main sequence sit **red giants** and **supergiants** (cool but luminous because they are enormous). Below it lie **white dwarfs** (hot but dim because they are tiny). The HR diagram is the single most important tool in stellar astrophysics: it reveals a star's mass, age, evolutionary state, and future.`,
      analogy: 'The HR diagram is like a census of a city plotted as income (luminosity) vs age (temperature, inverted). Most people fall on a "main sequence" — young adults earning moderate salaries. A few outliers are high up: elderly retirees with enormous wealth (red giants — cool but luminous). A few are at the bottom: young startup founders with tiny companies but burning hot (white dwarfs — hot but dim). The diagram tells you the entire life story of the population at a glance.',
      storyConnection: 'Looking up from Ziro Valley on a clear night, you see stars of every spectral type without even realizing it. Red Betelgeuse (M2, upper right of the HR diagram) and blue Rigel (B8, upper left) are both visible in Orion, illustrating the full temperature range in one constellation. The Apatani elders who named and tracked these stars were classifying them by color — reddish, bluish, white — which maps directly to the OBAFGKM sequence. They were proto-spectroscopists.',
      checkQuestion: 'Two stars have the same luminosity (same absolute magnitude). Star X is spectral type B0 (30,000 K) and star Y is spectral type M0 (3,800 K). Which star has a larger radius, and by approximately how much?',
      checkAnswer: 'Since luminosity L = 4*pi*R^2*sigma*T^4 and both have the same L: R_Y/R_X = (T_X/T_Y)^2 = (30000/3800)^2 = 62.3. Star Y (the M star) has a radius 62 times larger than star X. This is why cool luminous stars are called "giants" — the only way to be luminous at low temperature is to have an enormous surface area.',
      codeIntro: 'Build a Hertzsprung-Russell diagram from stellar data, color-code by spectral type, and trace the main sequence, giant branch, and white dwarf region.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# --- Stellar data by spectral type ---
spectral_types = {
    'O': {'temp_range': (30000, 50000), 'color': '#9999ff', 'abs_mag_range': (-6, -3)},
    'B': {'temp_range': (10000, 30000), 'color': '#aaccff', 'abs_mag_range': (-4, 0)},
    'A': {'temp_range': (7500, 10000), 'color': '#ffffff', 'abs_mag_range': (-1, 2)},
    'F': {'temp_range': (6000, 7500), 'color': '#ffffaa', 'abs_mag_range': (1, 4)},
    'G': {'temp_range': (5200, 6000), 'color': '#ffff00', 'abs_mag_range': (3, 6)},
    'K': {'temp_range': (3700, 5200), 'color': '#ffaa00', 'abs_mag_range': (5, 9)},
    'M': {'temp_range': (2400, 3700), 'color': '#ff4400', 'abs_mag_range': (8, 16)},
}

# Generate main sequence stars
ms_temps = []
ms_mags = []
ms_colors = []
ms_labels = []

for stype, data in spectral_types.items():
    n = 40 if stype in ('G', 'K', 'M') else 20  # more cool stars (realistic)
    temps = np.random.uniform(*data['temp_range'], n)
    # Main sequence relation: log(L) ~ 3.5*log(T) - const
    mags = data['abs_mag_range'][0] + (data['abs_mag_range'][1] - data['abs_mag_range'][0]) * \
           (data['temp_range'][1] - temps) / (data['temp_range'][1] - data['temp_range'][0])
    mags += np.random.normal(0, 0.3, n)  # scatter
    ms_temps.extend(temps)
    ms_mags.extend(mags)
    ms_colors.extend([data['color']] * n)
    ms_labels.extend([stype] * n)

# Generate red giants (cool but luminous)
giant_temps = np.random.uniform(3000, 5500, 30)
giant_mags = np.random.uniform(-5, 1, 30)
giant_colors = ['#ff6600'] * 30

# Generate white dwarfs (hot but dim)
wd_temps = np.random.uniform(8000, 40000, 20)
wd_mags = np.random.uniform(10, 15, 20)
wd_colors = ['#ccccff'] * 20

# Famous stars
famous_stars = [
    ('Sun', 5778, 4.83, '#ffff00'),
    ('Sirius', 9940, 1.42, '#ffffff'),
    ('Betelgeuse', 3500, -5.85, '#ff4400'),
    ('Rigel', 12100, -6.69, '#aaccff'),
    ('Vega', 9602, 0.58, '#ffffff'),
    ('Proxima Cen', 3042, 15.6, '#ff2200'),
    ('Deneb', 8525, -8.38, '#ffffaa'),
    ('Polaris', 6015, -3.64, '#ffffaa'),
    ('Aldebaran', 3910, -0.63, '#ff6600'),
]

fig, axes = plt.subplots(1, 2, figsize=(16, 9))
fig.patch.set_facecolor('#1f2937')

# --- HR Diagram ---
ax = axes[0]
ax.set_facecolor('#0a0a1a')

# Main sequence
ax.scatter(ms_temps, ms_mags, c=ms_colors, s=15, alpha=0.6, edgecolors='none', zorder=2)

# Giants
ax.scatter(giant_temps, giant_mags, c=giant_colors, s=40, alpha=0.5, edgecolors='none',
           marker='s', zorder=2, label='Red giants')

# White dwarfs
ax.scatter(wd_temps, wd_mags, c=wd_colors, s=10, alpha=0.5, edgecolors='none',
           marker='^', zorder=2, label='White dwarfs')

# Famous stars
for name, temp, mag, color in famous_stars:
    ax.plot(temp, mag, '*', color=color, markersize=15, markeredgecolor='white',
            markeredgewidth=0.5, zorder=5)
    offset = (200, -0.8) if name != 'Proxima Cen' else (200, 0.5)
    ax.annotate(name, (temp, mag), textcoords='offset points',
                xytext=(15, -5), color='white', fontsize=7,
                arrowprops=dict(arrowstyle='->', color='gray', lw=0.5))

# Labels for regions
ax.text(35000, -7, 'MAIN SEQUENCE', color='#888', fontsize=10, rotation=-35, style='italic')
ax.text(3500, -3, 'RED\\nGIANTS', color='#ff6600', fontsize=10, ha='center', fontweight='bold')
ax.text(25000, 13, 'WHITE\\nDWARFS', color='#aaaaff', fontsize=10, ha='center', fontweight='bold')

# Spectral type labels at top
for stype, data in spectral_types.items():
    mid_temp = np.mean(data['temp_range'])
    ax.text(mid_temp, -9.5, stype, color=data['color'], fontsize=12,
            ha='center', fontweight='bold')

ax.set_xlabel('Temperature (K)', color='white', fontsize=11)
ax.set_ylabel('Absolute Magnitude', color='white', fontsize=11)
ax.set_title('Hertzsprung-Russell Diagram', color='white', fontsize=14)
ax.invert_xaxis()  # hot stars on left (convention)
ax.invert_yaxis()  # brighter at top
ax.set_xlim(55000, 2000)
ax.set_ylim(17, -10)
ax.tick_params(colors='gray')
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8, loc='lower left')
ax.grid(True, alpha=0.1)

# --- Spectral type bar chart: what Ziro Valley shows ---
ax = axes[1]
ax.set_facecolor('#111827')

# Stars visible from Ziro (Bortle 2, limiting mag ~7.1)
# Approximate fraction by spectral type in a magnitude-limited sample
type_names = ['O', 'B', 'A', 'F', 'G', 'K', 'M']
type_counts_bright = [2, 120, 350, 300, 400, 600, 50]  # naked-eye (app mag < 6.5)
type_temps = [40000, 20000, 8750, 6750, 5600, 4450, 3050]
type_colors_list = [spectral_types[t]['color'] for t in type_names]

bars = ax.bar(type_names, type_counts_bright, color=type_colors_list, edgecolor='none', width=0.6)
ax.set_xlabel('Spectral Type', color='white', fontsize=11)
ax.set_ylabel('Number visible (naked eye from Ziro)', color='white', fontsize=11)
ax.set_title('Stars visible by spectral type (Bortle 2)', color='white', fontsize=12)
ax.tick_params(colors='gray')

for bar, count, temp in zip(bars, type_counts_bright, type_temps):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 15,
            f'{count}', ha='center', color='white', fontsize=9)
    ax.text(bar.get_x() + bar.get_width()/2, -60,
            f'{temp:,}K', ha='center', color='gray', fontsize=7)

# Add temperature axis label
ax.text(3.0, -100, 'Surface temperature', ha='center', color='gray', fontsize=8, style='italic')

plt.tight_layout()
plt.show()

print("SPECTRAL CLASSIFICATION SUMMARY")
print(f"{'Type':<6} {'Temp range (K)':>16} {'Example':>15} {'Color':>10}")
print("-" * 52)
examples = ['Zeta Oph', 'Rigel', 'Sirius', 'Polaris', 'Sun', 'Aldebaran', 'Betelgeuse']
color_names = ['Blue', 'Blue-white', 'White', 'Yellow-white', 'Yellow', 'Orange', 'Red']
for stype, example, cname in zip(type_names, examples, color_names):
    data = spectral_types[stype]
    print(f"{stype:<6} {data['temp_range'][0]:>6,} - {data['temp_range'][1]:>6,} {example:>15} {cname:>10}")

print()
print(f"Total naked-eye stars from Ziro: ~{sum(type_counts_bright):,}")
print("Most visible stars are K and G type (orange/yellow).")
print("M stars are the most common in the universe, but most are too dim to see.")
print("The HR diagram reveals that the night sky from Ziro is a living textbook of stellar evolution.")`,
      challenge: 'Add stellar evolution tracks to the HR diagram: show how a Sun-like star moves from the main sequence to the red giant branch to the white dwarf region. Plot the track as a colored path with arrows showing the direction of evolution.',
      successHint: 'The HR diagram is to astronomy what the periodic table is to chemistry — a single visualization that organizes an entire field. Every star you see from Ziro Valley has a place on this diagram, and that place tells you its mass, temperature, size, age, and fate.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Astronomy & Light Pollution Science
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (optics & sensor fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real astronomy computations. Click to start.</p>
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
