import { useState, useRef, useCallback } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function OrangeSunsetsLevel3() {
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
      title: 'Rayleigh scattering mathematics — why blue scatters 10x more than red',
      concept: `When sunlight enters Earth\'s atmosphere, it collides with nitrogen and oxygen molecules that are far smaller than the wavelength of visible light. Lord Rayleigh showed in 1871 that for particles much smaller than the wavelength, the scattering intensity follows an inverse fourth-power law: I is proportional to 1/lambda^4. This single equation explains why the sky is blue, why sunsets are orange, and why the moon looks reddish during a lunar eclipse.

The numbers are striking. Blue light has a wavelength of about 450 nm, and red light about 700 nm. The ratio of their scattering intensities is (700/450)^4, which equals approximately 5.7. When you include violet light at 380 nm, the ratio jumps to (700/380)^4, roughly 11.5. Violet scatters even more than blue, but our eyes are less sensitive to violet and the sun emits less of it, so we perceive the sky as blue rather than violet.

The physics behind the 1/lambda^4 dependence comes from the oscillating electric dipole model. An incoming electromagnetic wave forces the electrons in a molecule to oscillate. The oscillating charges re-radiate (scatter) light in all directions. The power radiated by an oscillating dipole scales as the fourth power of frequency, and since frequency is inversely proportional to wavelength, you get the 1/lambda^4 law. This derivation assumes the particle is much smaller than the wavelength — the "Rayleigh regime."`,
      analogy: 'Imagine throwing tennis balls at a chain-link fence. Small balls (high frequency, short wavelength) bounce off in all directions because the wire is comparable to their size. Bowling balls (low frequency, long wavelength) barely notice the fence — they pass straight through with minimal deflection. The atmosphere is a "fence" made of tiny molecules, so short-wavelength light gets bounced around everywhere while long-wavelength light punches through.',
      storyConnection: 'When the story describes Assam\'s sky turning deep orange and crimson at sunset, it is describing exactly this physics. The blue and violet light that made the daytime sky blue has been scattered away during the long path through the atmosphere. Only the longer wavelengths — orange and red — survive the journey to your eyes.',
      checkQuestion: 'If we define the Rayleigh scattering intensity as I = k / lambda^4, how many times more intensely is 400 nm light scattered compared to 600 nm light?',
      checkAnswer: 'I(400)/I(600) = (600/400)^4 = (1.5)^4 = 5.0625. So 400 nm violet-blue light scatters about 5 times more intensely than 600 nm orange light. This is exactly why the daytime sky appears blue — short wavelengths are preferentially scattered in all directions, filling the sky with blue light.',
      codeIntro: 'Plot the Rayleigh scattering intensity across the full visible spectrum (380-750 nm), calculate exact scattering ratios, and visualize why the sky is blue.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Visible spectrum wavelengths in nm
wavelengths = np.linspace(380, 750, 500)

# Rayleigh scattering: intensity proportional to 1/lambda^4
# Normalize to red (700 nm) for relative comparison
lambda_ref = 700  # nm
relative_intensity = (lambda_ref / wavelengths) ** 4

# Create wavelength-to-color mapping (approximate)
def wavelength_to_rgb(wl):
    """Convert wavelength (nm) to approximate RGB."""
    if 380 <= wl < 440:
        r, g, b = -(wl - 440) / (440 - 380), 0.0, 1.0
    elif 440 <= wl < 490:
        r, g, b = 0.0, (wl - 440) / (490 - 440), 1.0
    elif 490 <= wl < 510:
        r, g, b = 0.0, 1.0, -(wl - 510) / (510 - 490)
    elif 510 <= wl < 580:
        r, g, b = (wl - 510) / (580 - 510), 1.0, 0.0
    elif 580 <= wl < 645:
        r, g, b = 1.0, -(wl - 645) / (645 - 580), 0.0
    elif 645 <= wl <= 750:
        r, g, b = 1.0, 0.0, 0.0
    else:
        r, g, b = 0.0, 0.0, 0.0
    return (r, g, b)

colors = [wavelength_to_rgb(wl) for wl in wavelengths]

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#1f2937')

# Left: scattering intensity curve
ax = axes[0]
ax.set_facecolor('#111827')
for i in range(len(wavelengths) - 1):
    ax.fill_between(wavelengths[i:i+2], 0, relative_intensity[i:i+2],
                     color=colors[i], alpha=0.7)
ax.plot(wavelengths, relative_intensity, color='white', linewidth=1.5, alpha=0.8)
ax.set_xlabel('Wavelength (nm)', color='white', fontsize=12)
ax.set_ylabel('Relative scattering intensity', color='white', fontsize=12)
ax.set_title('Rayleigh scattering: I ~ 1/\\u03bb\\u2074', color='white', fontsize=14)
ax.tick_params(colors='gray')

# Annotate key wavelengths
for wl, name in [(450, 'Blue'), (550, 'Green'), (700, 'Red')]:
    idx = np.argmin(np.abs(wavelengths - wl))
    intensity = relative_intensity[idx]
    ax.annotate(f'{name}\\n{wl} nm\\nI = {intensity:.1f}x',
                xy=(wl, intensity), xytext=(wl + 30, intensity + 1),
                color='white', fontsize=9,
                arrowprops=dict(arrowstyle='->', color='white', lw=1))

# Right: bar chart of scattering ratios
ax2 = axes[1]
ax2.set_facecolor('#111827')
colors_bar = ['#7c3aed', '#3b82f6', '#06b6d4', '#22c55e', '#eab308', '#f97316', '#ef4444']
names = ['Violet\\n380', 'Blue\\n450', 'Cyan\\n490', 'Green\\n550', 'Yellow\\n580', 'Orange\\n620', 'Red\\n700']
wls = [380, 450, 490, 550, 580, 620, 700]
ratios = [(700 / wl) ** 4 for wl in wls]

bars = ax2.bar(names, ratios, color=colors_bar, edgecolor='white', linewidth=0.5)
ax2.set_ylabel('Scattering intensity (relative to red)', color='white', fontsize=12)
ax2.set_title('How much more each color scatters vs red', color='white', fontsize=14)
ax2.tick_params(colors='gray')
for bar, ratio in zip(bars, ratios):
    ax2.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.3,
             f'{ratio:.1f}x', ha='center', color='white', fontsize=10, fontweight='bold')

plt.tight_layout()
plt.show()

print("Rayleigh Scattering Intensity Ratios (relative to red at 700 nm):")
print(f"{'Color':<12} {'Wavelength':>10} {'Ratio (700/\\u03bb)\\u2074':>16}")
print("-" * 40)
for name, wl, ratio in zip(['Violet', 'Blue', 'Cyan', 'Green', 'Yellow', 'Orange', 'Red'],
                            wls, ratios):
    print(f"{name:<12} {wl:>7} nm {ratio:>14.2f}x")
print()
print("Key insight: violet scatters 11.5x more than red.")
print("Blue scatters 5.7x more than red.")
print("This is why the daytime sky is blue — short wavelengths")
print("are scattered in every direction by atmospheric molecules.")`,
      challenge: 'Extend the plot to include ultraviolet (300-380 nm) and near-infrared (750-1000 nm). How much more does UV scatter than visible red? Why is UV radiation particularly dangerous at high altitudes where there is less atmosphere to scatter it away?',
      successHint: 'The 1/lambda^4 law is one of the most elegant results in classical physics. It emerges purely from the fact that electromagnetic radiation is produced by accelerating charges, and the radiated power scales as the square of the acceleration, which scales as the square of the frequency. Frequency squared, times the incoming intensity which also picks up a frequency-squared factor, gives frequency to the fourth — or equivalently, 1/lambda^4.',
    },
    {
      title: 'Mie scattering and particle size — when clouds turn white',
      concept: `Rayleigh scattering only applies when the scattering particles are much smaller than the wavelength of light. Earth\'s N2 and O2 molecules are about 0.3 nm in diameter, far smaller than visible light wavelengths (380-750 nm). But what happens when particles grow larger — dust, water droplets, pollen, smoke?

When the particle diameter approaches the wavelength of light, we enter the **Mie scattering** regime, named after Gustav Mie who solved the exact equations in 1908. Mie scattering has two critical differences from Rayleigh: first, it is much less wavelength-dependent (it does not follow the 1/lambda^4 law), and second, it is strongly forward-directed rather than scattered equally in all directions. For very large particles (much bigger than wavelength), scattering becomes nearly wavelength-independent — all colors scatter equally.

This is why clouds are white. Cloud droplets range from 5 to 15 micrometers in diameter, roughly 10-30 times the wavelength of visible light. In the Mie regime at this size, red, green, and blue all scatter with similar efficiency. Equal scattering of all wavelengths produces white light. Fog is white for the same reason. Milk is white because fat globules are in the Mie regime. The transition from Rayleigh (wavelength-dependent, blue) to Mie (wavelength-independent, white) is governed by the **size parameter** x = pi * d / lambda, where d is the particle diameter. When x is much less than 1, you get Rayleigh. When x is around 1 or greater, Mie effects dominate.`,
      analogy: 'Think of ocean waves hitting obstacles. Small pebbles (like molecules for light) create tiny circular ripples that spread in all directions — this is Rayleigh scattering. A boulder the size of the wave (Mie regime) creates a complex diffraction pattern with most energy deflected forward. An entire seawall much larger than the wave simply reflects everything equally regardless of wave frequency — this is geometric scattering, the large-particle limit of Mie theory.',
      storyConnection: 'The story mentions how the sky over the Brahmaputra sometimes turns hazy white instead of blue during the humid monsoon season. That is Mie scattering in action — water droplets and aerosols grow large enough that all wavelengths scatter equally, washing out the blue and replacing it with a milky white sky. The brilliant orange sunsets return when the air dries and particles shrink back to the Rayleigh regime.',
      checkQuestion: 'A volcanic eruption injects sulfur dioxide into the stratosphere, which forms sulfate aerosol particles about 0.5 micrometers (500 nm) in diameter. Would these particles scatter light more like Rayleigh or Mie scattering? What color would they make the sky?',
      checkAnswer: 'The size parameter x = pi * d / lambda. For 500 nm particles and 500 nm light, x = pi, which is solidly in the Mie regime. These particles would scatter all visible wavelengths more equally than Rayleigh, tending to whiten the sky. After major eruptions like Pinatubo (1991), observers reported milky, washed-out skies and unusually vivid red sunsets because the aerosols both whitened the general sky and enhanced forward scattering at low sun angles.',
      codeIntro: 'Compute the scattering efficiency as a function of the size parameter for Rayleigh and Mie regimes, and visualize the transition between them.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Size parameter x = pi * d / lambda
# In Rayleigh regime (x << 1): scattering efficiency Q ~ x^4
# In Mie regime (x ~ 1): Q oscillates, approaches ~2 for large x
# We\'ll use the exact Mie efficiency approximation for spheres

def rayleigh_efficiency(x, n=1.33):
    """Rayleigh scattering efficiency for small x."""
    m = n  # refractive index
    K = (m**2 - 1) / (m**2 + 2)
    return (8.0 / 3.0) * x**4 * abs(K)**2

def mie_efficiency_approx(x, n=1.33):
    """Approximate Mie scattering efficiency using anomalous diffraction."""
    if x < 0.01:
        return rayleigh_efficiency(x, n)
    rho = 2 * x * (n - 1)
    if rho < 0.01:
        return rayleigh_efficiency(x, n)
    Q = 2 - (4 / rho) * np.sin(rho) + (4 / rho**2) * (1 - np.cos(rho))
    return max(Q, rayleigh_efficiency(x, n))

# Range of size parameters
x_values = np.logspace(-2, 2.5, 1000)
Q_rayleigh = np.array([rayleigh_efficiency(x) for x in x_values])
Q_mie = np.array([mie_efficiency_approx(x) for x in x_values])

fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('#1f2937')

# Left: scattering efficiency vs size parameter
ax = axes[0]
ax.set_facecolor('#111827')
ax.loglog(x_values, Q_rayleigh, color='#60a5fa', linewidth=2, linestyle='--',
          label='Rayleigh (Q ~ x\\u2074)', alpha=0.8)
ax.loglog(x_values, Q_mie, color='#f97316', linewidth=2.5,
          label='Mie (exact approx.)')
ax.axvline(x=1, color='#a855f7', linestyle=':', linewidth=1.5, alpha=0.7,
           label='x = 1 (transition)')
ax.axhline(y=2, color='gray', linestyle=':', linewidth=1, alpha=0.5)

# Annotate regimes
ax.text(0.03, 1e-6, 'Rayleigh\\nregime', color='#60a5fa', fontsize=11,
        fontweight='bold', ha='center')
ax.text(3, 0.3, 'Mie\\nregime', color='#f97316', fontsize=11,
        fontweight='bold', ha='center')
ax.text(100, 2.5, 'Geometric\\nlimit (Q\\u21922)', color='gray', fontsize=10,
        ha='center')

ax.set_xlabel('Size parameter x = \\u03c0d/\\u03bb', color='white', fontsize=12)
ax.set_ylabel('Scattering efficiency Q', color='white', fontsize=12)
ax.set_title('Scattering regimes: from molecules to cloud droplets', color='white', fontsize=13)
ax.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=10)
ax.tick_params(colors='gray')
ax.set_ylim(1e-9, 10)

# Right: wavelength dependence in each regime
ax2 = axes[1]
ax2.set_facecolor('#111827')
wavelengths = np.linspace(380, 750, 200)

# Different particle sizes
particle_sizes = [0.001, 0.01, 0.1, 1.0, 10.0]  # micrometers
particle_colors = ['#60a5fa', '#8b5cf6', '#f59e0b', '#f97316', '#ef4444']
particle_labels = ['1 nm (air molecules)', '10 nm (nanoparticle)',
                   '100 nm (fine aerosol)', '1 \\u03bcm (coarse aerosol)',
                   '10 \\u03bcm (cloud droplet)']

for d_um, color, label in zip(particle_sizes, particle_colors, particle_labels):
    d_nm = d_um * 1000  # convert to nm
    Q_spectrum = []
    for wl in wavelengths:
        x = np.pi * d_nm / wl
        Q_spectrum.append(mie_efficiency_approx(x))
    Q_arr = np.array(Q_spectrum)
    Q_arr = Q_arr / Q_arr.max()  # normalize for shape comparison
    ax2.plot(wavelengths, Q_arr, color=color, linewidth=2, label=label)

ax2.set_xlabel('Wavelength (nm)', color='white', fontsize=12)
ax2.set_ylabel('Normalized scattering efficiency', color='white', fontsize=12)
ax2.set_title('Wavelength dependence by particle size', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=8,
           loc='upper right')
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Scattering regime summary:")
print(f"{'Particle':<22} {'Diameter':>10} {'x at 500nm':>12} {'Regime':<15}")
print("-" * 62)
examples = [
    ('N2 molecule', '0.3 nm', np.pi * 0.3 / 500, 'Rayleigh'),
    ('Smoke particle', '100 nm', np.pi * 100 / 500, 'Transition'),
    ('Fog droplet', '5 \\u03bcm', np.pi * 5000 / 500, 'Mie'),
    ('Cloud droplet', '10 \\u03bcm', np.pi * 10000 / 500, 'Geometric'),
    ('Raindrop', '1 mm', np.pi * 1e6 / 500, 'Geometric'),
]
for name, size, x_val, regime in examples:
    print(f"{name:<22} {size:>10} {x_val:>12.2f} {regime:<15}")
print()
print("Key: small x means strong wavelength dependence (blue sky).")
print("Large x means weak wavelength dependence (white clouds).")`,
      challenge: 'Add a simulation of what happens to a white light beam passing through a fog bank. For each wavelength, compute the Mie scattering efficiency for 10 micrometer droplets and show that the transmitted spectrum is nearly flat (white) compared to Rayleigh-scattered light through clear air (blue). Plot both transmitted spectra side by side.',
      successHint: 'The transition from Rayleigh to Mie scattering is one of the most visually dramatic phenomena in nature. It explains why the sky shifts from deep blue on a crisp winter day to hazy white on a humid summer afternoon. The size parameter x = pi*d/lambda is the single number that determines which regime applies.',
    },
    {
      title: 'Atmospheric path length and optical depth — the geometry of sunsets',
      concept: `The daytime sky is blue because Rayleigh scattering preferentially removes short wavelengths from the direct solar beam and scatters them across the sky. But why does the sky turn orange and red at sunset? The answer is geometry: the path length through the atmosphere.

When the sun is directly overhead, light travels through about 8-10 km of dense atmosphere (the troposphere). At a zenith angle of 60 degrees, the path length doubles. At sunset, when the sun is on the horizon, the light must traverse roughly 38 times more atmosphere than at noon. This factor is called the **air mass** and is approximately 1/cos(theta) for moderate angles, though it saturates near the horizon due to Earth\'s curvature.

With 38 times more atmosphere, the 1/lambda^4 scattering law becomes devastating for short wavelengths. The probability that a blue photon survives the journey without being scattered out of the beam drops exponentially. This is the **Beer-Lambert law**: I = I0 * exp(-tau), where tau is the **optical depth**. Since tau is proportional to 1/lambda^4, the optical depth for blue light is roughly 5.7 times that of red light. After traversing 38 air masses, virtually all blue and green light has been scattered away, leaving only orange and red to reach your eyes. The deeper the sun dips below the horizon, the redder the remaining light becomes.`,
      analogy: 'Imagine shining a flashlight through a long hallway filled with smoke. If the hallway is short (noon sun, overhead), the beam reaches the wall with most colors intact, just slightly yellowish. Make the hallway 38 times longer (sunset), and the beam turns deep red at the far end because all the blue light has been scattered sideways into the smoke long before reaching the wall. The hallway length is the atmospheric path length, and the smoke particles are air molecules.',
      storyConnection: 'The story describes how the sunsets over the Brahmaputra are especially vivid during the dry season when the air is clear but the sun sets through a long, unobstructed atmospheric path. The clarity of the air means Rayleigh scattering dominates (no Mie whitening from humidity), and the long path length at low sun angles strips away everything except the deepest oranges and reds.',
      checkQuestion: 'If the optical depth for blue light (450 nm) at zenith is tau_blue = 0.3, what fraction of blue photons survive the direct beam at sunset when the air mass is 38? What about red photons (700 nm) if their zenith optical depth is tau_red = 0.05?',
      checkAnswer: 'For blue at sunset: I/I0 = exp(-0.3 * 38) = exp(-11.4) = 0.000011, or 0.001%. Virtually zero blue light survives. For red at sunset: I/I0 = exp(-0.05 * 38) = exp(-1.9) = 0.15, or 15%. A substantial fraction of red light punches through. That is why sunsets are red: 15% of red survives vs 0.001% of blue. The exponential function amplifies the wavelength difference dramatically over long path lengths.',
      codeIntro: 'Simulate sunlight passing through different amounts of atmosphere, showing how the surviving spectrum shifts from white to yellow to orange to red as the sun descends toward the horizon.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Solar spectrum (approximate blackbody at 5778 K, Planck function)
def planck_spectrum(wavelength_nm, T=5778):
    """Spectral radiance of a blackbody at temperature T."""
    wl_m = wavelength_nm * 1e-9
    h = 6.626e-34; c = 3e8; k = 1.381e-23
    return (2 * h * c**2 / wl_m**5) / (np.exp(h * c / (wl_m * k * T)) - 1)

wavelengths = np.linspace(380, 750, 500)
solar = planck_spectrum(wavelengths)
solar = solar / solar.max()  # normalize

# Rayleigh optical depth at zenith (approximate for sea level)
# tau_rayleigh ~ 0.008735 * lambda_um^(-4.08) per standard atmosphere
def rayleigh_optical_depth_zenith(wl_nm):
    wl_um = wl_nm / 1000.0
    return 0.008735 * wl_um ** (-4.08)

tau_zenith = np.array([rayleigh_optical_depth_zenith(wl) for wl in wavelengths])

# Air mass for different solar zenith angles
# Using Kasten-Young formula for atmospheric refraction
def air_mass(zenith_deg):
    z = np.radians(zenith_deg)
    if zenith_deg < 89:
        return 1.0 / (np.cos(z) + 0.50572 * (96.07995 - zenith_deg)**(-1.6364))
    return 38.0  # approximate horizon value

# Sun positions to simulate
sun_angles = [0, 30, 60, 75, 85, 90]  # zenith angles in degrees
angle_labels = ['Noon (0\\u00b0)', '30\\u00b0', '60\\u00b0', '75\\u00b0', '85\\u00b0', 'Horizon (90\\u00b0)']

fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.patch.set_facecolor('#1f2937')
fig.suptitle('How sunlight spectrum changes from noon to sunset',
             color='white', fontsize=16, fontweight='bold', y=0.98)

# Wavelength to RGB for coloring
def wl_to_rgb(wl):
    if 380 <= wl < 440: r, g, b = -(wl-440)/(440-380), 0.0, 1.0
    elif 440 <= wl < 490: r, g, b = 0.0, (wl-440)/(490-440), 1.0
    elif 490 <= wl < 510: r, g, b = 0.0, 1.0, -(wl-510)/(510-490)
    elif 510 <= wl < 580: r, g, b = (wl-510)/(580-510), 1.0, 0.0
    elif 580 <= wl < 645: r, g, b = 1.0, -(wl-645)/(645-580), 0.0
    elif 645 <= wl <= 750: r, g, b = 1.0, 0.0, 0.0
    else: r, g, b = 0.0, 0.0, 0.0
    return (r, g, b)

colors = [wl_to_rgb(wl) for wl in wavelengths]

for idx, (angle, label) in enumerate(zip(sun_angles, angle_labels)):
    ax = axes[idx // 3][idx % 3]
    ax.set_facecolor('#111827')

    am = air_mass(angle)
    # Beer-Lambert: transmitted = solar * exp(-tau * air_mass)
    transmitted = solar * np.exp(-tau_zenith * am)
    transmitted_norm = transmitted / solar.max()  # keep relative to noon peak

    # Fill with spectral colors
    for i in range(len(wavelengths) - 1):
        ax.fill_between(wavelengths[i:i+2], 0, transmitted_norm[i:i+2],
                         color=colors[i], alpha=0.8)

    # Compute perceived color (simplified)
    # Weight by CIE color matching approximation
    r_total = np.trapz(transmitted * np.exp(-0.5*((wavelengths-600)/50)**2), wavelengths)
    g_total = np.trapz(transmitted * np.exp(-0.5*((wavelengths-550)/40)**2), wavelengths)
    b_total = np.trapz(transmitted * np.exp(-0.5*((wavelengths-450)/30)**2), wavelengths)
    rgb_max = max(r_total, g_total, b_total, 1e-10)
    r_c, g_c, b_c = r_total/rgb_max, g_total/rgb_max, b_total/rgb_max
    r_c, g_c, b_c = min(1, max(0, r_c)), min(1, max(0, g_c)), min(1, max(0, b_c))

    ax.add_patch(plt.Rectangle((700, transmitted_norm.max()*0.7), 45, transmitted_norm.max()*0.25,
                                facecolor=(r_c, g_c, b_c), edgecolor='white', linewidth=1.5))
    ax.text(722, transmitted_norm.max()*0.82, 'Color', color='white', fontsize=8,
            ha='center', va='center', fontweight='bold')

    total_power = np.trapz(transmitted, wavelengths)
    noon_power = np.trapz(solar, wavelengths)
    ax.set_title(f'{label}  (AM={am:.1f}, {100*total_power/noon_power:.1f}% power)',
                 color='white', fontsize=11)
    ax.set_xlabel('Wavelength (nm)', color='white', fontsize=9)
    ax.set_ylabel('Intensity', color='white', fontsize=9)
    ax.tick_params(colors='gray', labelsize=8)
    ax.set_xlim(380, 750)

plt.tight_layout(rect=[0, 0, 1, 0.95])
plt.show()

print("Atmospheric path and surviving light:")
print(f"{'Zenith angle':<15} {'Air mass':>10} {'Blue surv.':>12} {'Red surv.':>12} {'Ratio R/B':>10}")
print("-" * 62)
for angle, label in zip(sun_angles, angle_labels):
    am = air_mass(angle)
    tau_blue = rayleigh_optical_depth_zenith(450) * am
    tau_red = rayleigh_optical_depth_zenith(700) * am
    surv_blue = np.exp(-tau_blue)
    surv_red = np.exp(-tau_red)
    ratio = surv_red / surv_blue if surv_blue > 1e-15 else float('inf')
    print(f"{label:<15} {am:>10.1f} {surv_blue:>11.4%} {surv_red:>11.4%} {ratio:>10.1f}")
print()
print("At the horizon, red light is >100,000x more likely to survive than blue.")
print("This exponential amplification of wavelength differences is why sunsets are red.")`,
      challenge: 'Add aerosol scattering to the model. Assume a Mie-like optical depth that is proportional to 1/lambda (not 1/lambda^4). Aerosols are larger particles. With aerosol optical depth of 0.1 at 550 nm, re-compute the sunset spectra. How do aerosols change the color from pure Rayleigh?',
      successHint: 'The exponential in Beer-Lambert law is what makes sunsets so dramatic. A small wavelength-dependent difference in optical depth gets amplified exponentially over long path lengths. This same principle applies in spectroscopy, fiber optics, and medical imaging — any time light passes through an absorbing or scattering medium.',
    },
    {
      title: 'Spectral analysis of sunlight — reading the atmosphere with light',
      concept: `When you disperse sunlight through a prism or diffraction grating, you do not see a smooth rainbow. Instead, you see hundreds of dark lines interrupting the continuous spectrum. Joseph von Fraunhofer cataloged 574 of these lines in 1814, and they now bear his name. Each **Fraunhofer line** corresponds to a specific atomic transition — a wavelength at which atoms in the sun's atmosphere or Earth\'s atmosphere absorb photons.

The principle is elegant: every element absorbs (and emits) light at characteristic wavelengths determined by its electron energy levels. Hydrogen absorbs at 656.3 nm (H-alpha, red), 486.1 nm (H-beta, cyan), and 434.0 nm (H-gamma, blue). Sodium produces the famous D lines at 589.0 and 589.6 nm (yellow). Oxygen produces absorption bands at 687 nm (the A band) and 760 nm (the B band). Water vapor has broad absorption features in the near-infrared.

This is the foundation of **spectroscopy**, one of the most powerful tools in all of science. By analyzing which wavelengths are absorbed, you can determine the chemical composition of the sun, distant stars, planetary atmospheres, and Earth\'s own atmosphere — all without collecting a physical sample. The same principle is used in pollution monitoring, medical diagnostics, and remote sensing satellites that map atmospheric gases from orbit.`,
      analogy: 'A spectral absorption line is like a fingerprint. Just as every person has a unique pattern of ridges and whorls, every element has a unique pattern of absorption wavelengths. If you find dark lines at 656.3, 486.1, and 434.0 nm, you have found hydrogen — no matter whether the source is the sun, a distant galaxy, or a flame in a chemistry lab. The spectral fingerprint is universal.',
      storyConnection: 'The story describes the children of Assam looking at sunlight reflected off the Brahmaputra and seeing colors they could not name. In reality, that reflected sunlight carries an encoded message — the chemical fingerprints of every gas it passed through. A spectrometer aimed at the river surface would reveal oxygen, water vapor, and even trace pollutants, all written in the pattern of missing wavelengths.',
      checkQuestion: 'If you observe the sun through a spectrometer at noon and again at sunset, how would the Fraunhofer lines differ? Which atmospheric absorption features would be stronger at sunset and why?',
      checkAnswer: 'At sunset, the light passes through 38 times more atmosphere than at noon. Earth-origin absorption features (O2 at 687/760 nm, H2O bands) would be dramatically deeper because there is 38 times more absorbing gas in the path. Solar-origin lines (hydrogen, calcium, iron) would appear the same depth relative to the local continuum but would be harder to see because the overall spectrum is much dimmer and redder. The telluric (Earth) lines are the ones that change with sun angle.',
      codeIntro: 'Simulate a solar spectrum with Fraunhofer absorption lines, then show how atmospheric absorption deepens as the sun approaches the horizon.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Solar blackbody spectrum
def planck(wl_nm, T=5778):
    wl_m = wl_nm * 1e-9
    h, c, k = 6.626e-34, 3e8, 1.381e-23
    return (2*h*c**2/wl_m**5) / (np.exp(h*c/(wl_m*k*T)) - 1)

wavelengths = np.linspace(380, 780, 2000)
solar = planck(wavelengths)
solar = solar / solar.max()

# Major Fraunhofer lines (wavelength nm, element, relative depth)
fraunhofer_lines = [
    (393.4, 'Ca II K', 0.60),
    (396.8, 'Ca II H', 0.55),
    (410.2, 'H\\u03b4', 0.25),
    (434.0, 'H\\u03b3', 0.30),
    (486.1, 'H\\u03b2', 0.35),
    (516.7, 'Mg I', 0.20),
    (518.4, 'Mg I', 0.18),
    (527.0, 'Fe I', 0.15),
    (589.0, 'Na D1', 0.40),
    (589.6, 'Na D2', 0.38),
    (656.3, 'H\\u03b1', 0.45),
]

# Telluric (Earth atmosphere) absorption bands
telluric_bands = [
    (687, 10, 'O\\u2082 A-band', 0.30),   # center, width, name, depth at zenith
    (719, 8, 'H\\u2082O', 0.20),
    (760, 12, 'O\\u2082 B-band', 0.50),
    (720, 15, 'H\\u2082O', 0.15),
]

def apply_fraunhofer(spectrum, wl):
    """Apply solar Fraunhofer absorption lines."""
    result = spectrum.copy()
    for line_wl, name, depth in fraunhofer_lines:
        # Gaussian absorption profile
        sigma = 0.3  # narrow lines
        absorption = depth * np.exp(-0.5 * ((wl - line_wl) / sigma)**2)
        result *= (1 - absorption)
    return result

def apply_telluric(spectrum, wl, air_mass=1.0):
    """Apply Earth atmospheric absorption bands, scaled by air mass."""
    result = spectrum.copy()
    for center, width, name, depth_zenith in telluric_bands:
        sigma = width / 2.35  # FWHM to sigma
        tau = depth_zenith * air_mass * np.exp(-0.5 * ((wl - center) / sigma)**2)
        result *= np.exp(-tau)
    return result

def apply_rayleigh(spectrum, wl, air_mass=1.0):
    """Apply Rayleigh scattering extinction."""
    wl_um = wl / 1000.0
    tau = 0.008735 * wl_um**(-4.08) * air_mass
    return spectrum * np.exp(-tau)

fig, axes = plt.subplots(3, 1, figsize=(14, 12))
fig.patch.set_facecolor('#1f2937')

# Panel 1: Clean solar spectrum with Fraunhofer lines labeled
ax1 = axes[0]
ax1.set_facecolor('#111827')
solar_with_lines = apply_fraunhofer(solar, wavelengths)
ax1.plot(wavelengths, solar, color='#fbbf24', linewidth=1, alpha=0.5, label='Blackbody (no lines)')
ax1.plot(wavelengths, solar_with_lines, color='#f97316', linewidth=1, label='With Fraunhofer lines')

for line_wl, name, depth in fraunhofer_lines:
    idx = np.argmin(np.abs(wavelengths - line_wl))
    ax1.annotate(f'{name}\\n{line_wl}', xy=(line_wl, solar_with_lines[idx]),
                 xytext=(line_wl, solar_with_lines[idx] + 0.12),
                 color='#93c5fd', fontsize=7, ha='center', rotation=45,
                 arrowprops=dict(arrowstyle='-', color='#93c5fd', lw=0.5))

ax1.set_title('Solar spectrum with Fraunhofer absorption lines', color='white', fontsize=14)
ax1.set_ylabel('Intensity', color='white')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=10)
ax1.tick_params(colors='gray')

# Panel 2: Noon vs sunset with telluric + Rayleigh
ax2 = axes[1]
ax2.set_facecolor('#111827')

for am, label, color, lw in [(1, 'Noon (AM=1)', '#fbbf24', 1.5),
                               (5, 'Late afternoon (AM=5)', '#f97316', 1.5),
                               (20, 'Near sunset (AM=20)', '#ef4444', 1.5),
                               (38, 'Horizon (AM=38)', '#991b1b', 2)]:
    spectrum = apply_fraunhofer(solar, wavelengths)
    spectrum = apply_telluric(spectrum, wavelengths, am)
    spectrum = apply_rayleigh(spectrum, wavelengths, am)
    ax2.plot(wavelengths, spectrum, color=color, linewidth=lw, label=label)

# Mark telluric bands
for center, width, name, depth in telluric_bands:
    ax2.axvspan(center - width/2, center + width/2, alpha=0.15, color='#60a5fa')
    ax2.text(center, 0.02, name, color='#93c5fd', fontsize=8, ha='center', rotation=90)

ax2.set_title('Solar spectrum through atmosphere: noon to sunset', color='white', fontsize=14)
ax2.set_ylabel('Transmitted intensity', color='white')
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=10)
ax2.tick_params(colors='gray')

# Panel 3: Ratio (sunset / noon) showing which wavelengths survive
ax3 = axes[2]
ax3.set_facecolor('#111827')

noon = apply_rayleigh(apply_telluric(apply_fraunhofer(solar, wavelengths), wavelengths, 1), wavelengths, 1)
sunset = apply_rayleigh(apply_telluric(apply_fraunhofer(solar, wavelengths), wavelengths, 38), wavelengths, 38)
survival_ratio = sunset / (noon + 1e-20)

for i in range(len(wavelengths) - 1):
    wl = wavelengths[i]
    if 380 <= wl < 440: c = (0.3, 0.0, 1.0)
    elif 440 <= wl < 490: c = (0.0, 0.5, 1.0)
    elif 490 <= wl < 510: c = (0.0, 1.0, 0.5)
    elif 510 <= wl < 580: c = (0.5, 1.0, 0.0)
    elif 580 <= wl < 645: c = (1.0, 0.7, 0.0)
    else: c = (1.0, 0.0, 0.0)
    ax3.fill_between(wavelengths[i:i+2], 0, survival_ratio[i:i+2], color=c, alpha=0.8)

ax3.set_title('Photon survival ratio: sunset / noon', color='white', fontsize=14)
ax3.set_xlabel('Wavelength (nm)', color='white', fontsize=12)
ax3.set_ylabel('Fraction surviving', color='white')
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Spectral analysis of atmospheric effects:")
print(f"{'Wavelength':<12} {'Color':<10} {'Noon':>8} {'Sunset':>8} {'Survival':>10}")
print("-" * 52)
for wl_check, name in [(400, 'Violet'), (450, 'Blue'), (500, 'Cyan'),
                         (550, 'Green'), (600, 'Orange'), (650, 'Red'), (700, 'Deep red')]:
    idx = np.argmin(np.abs(wavelengths - wl_check))
    print(f"{wl_check} nm    {name:<10} {noon[idx]:>8.4f} {sunset[idx]:>8.6f} {survival_ratio[idx]:>9.6f}")
print()
print("The O\\u2082 A-band at 687 nm and B-band at 760 nm are")
print("dramatically deeper at sunset — 38x more oxygen in the light path.")`,
      challenge: 'Add a methane (CH4) absorption band at 890 nm and a CO2 band at 730 nm with modest zenith optical depths (0.05). Extend the wavelength range to 900 nm and show how these greenhouse gas signatures become detectable at sunset when the long path length amplifies weak absorption features.',
      successHint: 'Spectroscopy is how we know what the sun is made of, how we detect exoplanet atmospheres, and how satellites monitor greenhouse gases. The same physics that makes Assam\'s sunsets orange also lets us measure CO2 concentrations from space. Every absorption line is a message encoded in light.',
    },
    {
      title: 'Radiative transfer modeling — pollution, humidity, and sunset color',
      concept: `Real atmospheres are not uniform. Temperature, pressure, gas concentrations, and aerosol loads all vary with altitude and location. **Radiative transfer** is the physics of how electromagnetic radiation propagates through such complex media, accounting for absorption, emission, and scattering at every point along the path.

The fundamental equation is the **Beer-Lambert law** in its differential form: dI/ds = -alpha * I + j, where I is intensity, s is distance, alpha is the extinction coefficient (absorption + scattering), and j is the source term (emission and in-scattering from other directions). For our sunset problem, emission is negligible in the visible, so the equation simplifies to pure extinction: I(s) = I(0) * exp(-integral of alpha ds).

The extinction coefficient alpha depends on wavelength, altitude, and atmospheric composition. In a clean atmosphere, Rayleigh scattering by gas molecules dominates. Add water vapor, and you get broad absorption bands. Add aerosols (dust, smoke, pollution), and you get Mie scattering with a different wavelength dependence. The interplay between these components determines the exact color of a sunset. Clean, dry air produces vivid orange-red sunsets. Humid air adds Mie scattering that washes colors toward white and pink. Heavy pollution can produce strikingly deep reds by preferentially removing shorter wavelengths even more aggressively than Rayleigh alone.`,
      analogy: 'Radiative transfer is like tracking a rumor through a crowded room. The original message (white sunlight) enters on one side. As it passes through the crowd, some people absorb parts of the message (absorption), some garble it and pass it in random directions (scattering), and some add their own commentary (emission). What emerges on the other side depends on the crowd density, how many different types of people are present, and how far the message has to travel.',
      storyConnection: 'The story describes how the sunsets over the Brahmaputra change with the seasons — vivid orange in the dry winter, softer pink in the humid monsoon, and occasionally apocalyptic red when farmers burn crop stubble. Each of these is a different radiative transfer scenario: clean Rayleigh-only, Rayleigh plus water vapor Mie, and Rayleigh plus heavy aerosol loading. The physics explains every variation the children observe.',
      checkQuestion: 'Why do volcanic eruptions (which inject sulfate aerosols into the stratosphere) produce unusually vivid red sunsets worldwide for months afterward, while urban pollution (which stays in the lower troposphere) mainly makes sunsets look hazy and washed out?',
      checkAnswer: 'Volcanic aerosols reach the stratosphere (15-25 km altitude) where they spread globally and persist for months. At sunset, light passes through this elevated layer at a very oblique angle, creating an enormous optical path through the aerosol layer. The stratospheric aerosols are in the Mie regime but at sizes that still have some wavelength dependence, preferentially removing blue-green and creating vivid reds. Urban pollution stays near the surface where it creates thick, forward-scattering haze that mixes scattered white light into the scene, washing out color contrast.',
      codeIntro: 'Build a layered atmosphere radiative transfer model comparing clean, humid, polluted, and volcanic atmospheres to see how each changes the sunset spectrum.',
      code: `import numpy as np
import matplotlib.pyplot as plt

wavelengths = np.linspace(380, 780, 500)

# Solar spectrum (blackbody)
def planck(wl_nm, T=5778):
    wl_m = wl_nm * 1e-9
    h, c, k = 6.626e-34, 3e8, 1.381e-23
    return (2*h*c**2/wl_m**5) / (np.exp(h*c/(wl_m*k*T)) - 1)

solar = planck(wavelengths)
solar = solar / solar.max()

# Extinction models for different components
def rayleigh_tau(wl_nm, air_mass=1.0):
    """Rayleigh scattering optical depth."""
    wl_um = wl_nm / 1000.0
    return 0.008735 * wl_um**(-4.08) * air_mass

def aerosol_tau(wl_nm, aod_550=0.0, angstrom=1.3, air_mass=1.0):
    """Aerosol optical depth using Angstrom relation: tau ~ lambda^(-alpha)."""
    wl_um = wl_nm / 1000.0
    return aod_550 * (wl_um / 0.55)**(-angstrom) * air_mass

def water_vapor_absorption(wl_nm, precipitable_water_cm=1.0, air_mass=1.0):
    """Simplified water vapor absorption bands in visible/near-IR."""
    tau = np.zeros_like(wl_nm, dtype=float)
    # Weak bands in visible
    bands = [(720, 15, 0.03), (690, 8, 0.01)]
    for center, width, strength in bands:
        tau += strength * precipitable_water_cm * np.exp(-0.5*((wl_nm - center)/(width/2.35))**2)
    return tau * air_mass

# Atmosphere scenarios
scenarios = {
    'Clean dry air': {
        'aod': 0.02, 'angstrom': 1.5, 'pw': 0.5,
        'color': '#3b82f6', 'description': 'Winter day, low humidity'
    },
    'Humid tropical': {
        'aod': 0.08, 'angstrom': 1.0, 'pw': 4.0,
        'color': '#f472b6', 'description': 'Monsoon season, high humidity'
    },
    'Urban polluted': {
        'aod': 0.4, 'angstrom': 1.5, 'pw': 2.0,
        'color': '#a78bfa', 'description': 'City smog, fine particles'
    },
    'Crop burning': {
        'aod': 0.8, 'angstrom': 1.8, 'pw': 1.5,
        'color': '#ef4444', 'description': 'Agricultural burning season'
    },
    'Volcanic (Pinatubo)': {
        'aod': 0.3, 'angstrom': 0.5, 'pw': 1.0,
        'color': '#f97316', 'description': 'Stratospheric sulfate aerosols'
    },
}

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.patch.set_facecolor('#1f2937')

# Panel 1: Sunset spectra for each scenario (AM=20, sun near horizon)
ax1 = axes[0, 0]
ax1.set_facecolor('#111827')
am_sunset = 20

for name, params in scenarios.items():
    tau_total = (rayleigh_tau(wavelengths, am_sunset) +
                 aerosol_tau(wavelengths, params['aod'], params['angstrom'], am_sunset) +
                 water_vapor_absorption(wavelengths, params['pw'], am_sunset))
    transmitted = solar * np.exp(-tau_total)
    transmitted /= transmitted.max() + 1e-20  # normalize each for shape comparison
    ax1.plot(wavelengths, transmitted, color=params['color'], linewidth=2, label=name)

ax1.set_title('Sunset spectra (AM=20) by atmosphere type', color='white', fontsize=13)
ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Normalized intensity', color='white')
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax1.tick_params(colors='gray')

# Panel 2: Perceived sunset colors across sun elevation
ax2 = axes[0, 1]
ax2.set_facecolor('#111827')

zenith_angles = np.linspace(0, 90, 50)

def perceived_rgb(wl, spectrum):
    """Convert spectrum to approximate RGB."""
    r = np.trapz(spectrum * np.exp(-0.5*((wl-600)/50)**2), wl)
    g = np.trapz(spectrum * np.exp(-0.5*((wl-550)/40)**2), wl)
    b = np.trapz(spectrum * np.exp(-0.5*((wl-450)/30)**2), wl)
    mx = max(r, g, b, 1e-20)
    return (min(1, max(0, r/mx)), min(1, max(0, g/mx)), min(1, max(0, b/mx)))

for s_idx, (name, params) in enumerate(scenarios.items()):
    colors_strip = []
    for za in zenith_angles:
        z_rad = np.radians(za)
        if za < 89:
            am = 1.0 / (np.cos(z_rad) + 0.50572 * (96.07995 - za)**(-1.6364))
        else:
            am = 38.0
        tau_total = (rayleigh_tau(wavelengths, am) +
                     aerosol_tau(wavelengths, params['aod'], params['angstrom'], am) +
                     water_vapor_absorption(wavelengths, params['pw'], am))
        transmitted = solar * np.exp(-tau_total)
        colors_strip.append(perceived_rgb(wavelengths, transmitted))

    # Plot as colored strip
    for i, (za, rgb) in enumerate(zip(zenith_angles, colors_strip)):
        ax2.barh(s_idx, 1.8, left=za, height=0.8, color=rgb)

ax2.set_yticks(range(len(scenarios)))
ax2.set_yticklabels(list(scenarios.keys()), color='white', fontsize=9)
ax2.set_xlabel('Solar zenith angle (degrees)', color='white')
ax2.set_title('Perceived sun color: noon to sunset', color='white', fontsize=13)
ax2.tick_params(colors='gray')
ax2.set_xlim(0, 92)

# Panel 3: Optical depth breakdown at sunset
ax3 = axes[1, 0]
ax3.set_facecolor('#111827')

tau_ray = rayleigh_tau(wavelengths, am_sunset)
tau_aer_clean = aerosol_tau(wavelengths, 0.02, 1.5, am_sunset)
tau_aer_polluted = aerosol_tau(wavelengths, 0.4, 1.5, am_sunset)
tau_h2o = water_vapor_absorption(wavelengths, 2.0, am_sunset)

ax3.plot(wavelengths, tau_ray, color='#60a5fa', linewidth=2, label='Rayleigh')
ax3.plot(wavelengths, tau_aer_clean, color='#22c55e', linewidth=2, label='Aerosol (clean)')
ax3.plot(wavelengths, tau_aer_polluted, color='#ef4444', linewidth=2, label='Aerosol (polluted)')
ax3.plot(wavelengths, tau_h2o, color='#a78bfa', linewidth=2, label='Water vapor')
ax3.plot(wavelengths, tau_ray + tau_aer_polluted + tau_h2o, color='white',
         linewidth=2, linestyle='--', label='Total (polluted)', alpha=0.7)

ax3.set_xlabel('Wavelength (nm)', color='white')
ax3.set_ylabel('Optical depth at sunset (AM=20)', color='white')
ax3.set_title('Optical depth components', color='white', fontsize=13)
ax3.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax3.tick_params(colors='gray')

# Panel 4: Total transmitted power vs zenith angle
ax4 = axes[1, 1]
ax4.set_facecolor('#111827')

for name, params in scenarios.items():
    powers = []
    for za in zenith_angles:
        z_rad = np.radians(za)
        if za < 89:
            am = 1.0 / (np.cos(z_rad) + 0.50572 * (96.07995 - za)**(-1.6364))
        else:
            am = 38.0
        tau_total = (rayleigh_tau(wavelengths, am) +
                     aerosol_tau(wavelengths, params['aod'], params['angstrom'], am) +
                     water_vapor_absorption(wavelengths, params['pw'], am))
        transmitted = solar * np.exp(-tau_total)
        powers.append(np.trapz(transmitted, wavelengths))
    powers = np.array(powers) / powers[0]  # normalize to noon
    ax4.plot(zenith_angles, powers, color=params['color'], linewidth=2, label=name)

ax4.set_xlabel('Solar zenith angle (degrees)', color='white')
ax4.set_ylabel('Relative total intensity', color='white')
ax4.set_title('Light dimming: noon to sunset', color='white', fontsize=13)
ax4.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=9)
ax4.tick_params(colors='gray')
ax4.set_yscale('log')
ax4.set_ylim(1e-4, 1.5)

plt.tight_layout()
plt.show()

print("Radiative transfer comparison at sunset (AM=20):")
print(f"{'Scenario':<22} {'Peak \\u03bb (nm)':>12} {'Red/Blue':>10} {'Total power':>12}")
print("-" * 58)
for name, params in scenarios.items():
    tau_total = (rayleigh_tau(wavelengths, am_sunset) +
                 aerosol_tau(wavelengths, params['aod'], params['angstrom'], am_sunset) +
                 water_vapor_absorption(wavelengths, params['pw'], am_sunset))
    transmitted = solar * np.exp(-tau_total)
    peak_wl = wavelengths[np.argmax(transmitted)]
    idx_r = np.argmin(np.abs(wavelengths - 650))
    idx_b = np.argmin(np.abs(wavelengths - 450))
    rb = transmitted[idx_r] / (transmitted[idx_b] + 1e-30)
    power = np.trapz(transmitted, wavelengths)
    print(f"{name:<22} {peak_wl:>9.0f} nm {rb:>10.0f}x {power:>12.4f}")
print()
print("Clean air: vivid orange-red (strong wavelength selection).")
print("Pollution: deeper red but dimmer (more total extinction).")
print("Volcanic: extreme reds (stratospheric aerosol layer).")`,
      challenge: 'Add a forest fire smoke layer between 1-3 km altitude with very high AOD (1.5) and high Angstrom exponent (2.0, meaning very fine particles). How does this differ from crop burning? Plot the difference in sunset color and intensity. Also add an ozone layer that absorbs in the Chappuis band (500-650 nm, weak) and see if ozone affects sunset color.',
      successHint: 'Radiative transfer is the workhorse of atmospheric science, climate modeling, and remote sensing. The same Beer-Lambert equation used here is how satellites measure aerosol loading, how climate models compute heating rates, and how medical imaging works (X-rays passing through tissue). The physics is universal — only the extinction coefficients change.',
    },
    {
      title: 'Color science and chromaticity — from spectra to perceived color',
      concept: `A spectrum is a continuous function of intensity versus wavelength. But human color perception reduces this infinite-dimensional signal to just three numbers — the responses of our three cone cell types (S, M, L for short, medium, and long wavelength). This is why we can represent any perceivable color with three coordinates, and why RGB displays with just three primary colors can reproduce millions of colors.

The **CIE 1931 color space** formalizes this. It defines three **color matching functions** — x_bar(lambda), y_bar(lambda), z_bar(lambda) — that represent the standard human observer's response. To convert a spectrum S(lambda) to tristimulus values, you integrate: X = integral of S(lambda) * x_bar(lambda) d_lambda, and similarly for Y and Z. The **chromaticity coordinates** x = X/(X+Y+Z) and y = Y/(X+Y+Z) project this 3D space onto a 2D diagram, the famous horseshoe-shaped CIE chromaticity diagram.

Why can cameras not capture what our eyes see at sunset? Three reasons: first, camera sensors have different spectral sensitivities than human cones and may clip in the red channel. Second, displays have a limited **gamut** — the triangle of colors they can reproduce is smaller than the full CIE diagram. Third, the human visual system adapts to ambient light (chromatic adaptation), so a sunset that looks vivid orange to your adapted eyes may photograph as washed-out yellow because the camera applies a fixed white balance. This is the domain of **color science** — the intersection of physics, physiology, and engineering.`,
      analogy: 'Imagine listening to a full orchestra (the spectrum) but you can only describe the sound through three microphones, each tuned to a different frequency range: bass, midrange, and treble. Two completely different orchestral arrangements could produce the same three readings — this is called a **metamer** in color science. Your three cone types are those three microphones. Color is not a property of light; it is a property of human perception of light.',
      storyConnection: 'The story describes how no photograph could ever capture the exact orange of Assam\'s sunsets, how the color seemed richer and deeper to the eye than any screen could show. This is not poetic exaggeration — it is color science. The deep, saturated oranges of a sunset often fall outside the sRGB gamut of standard displays. The spectral purity of sunset light, dominated by a narrow band of long wavelengths, maps to chromaticity coordinates that lie beyond what three RGB phosphors can reproduce.',
      checkQuestion: 'Two different light spectra can produce the identical perceived color. How is this possible, and what is this phenomenon called?',
      checkAnswer: 'This is called metamerism. Because our eyes have only three types of cones, many different spectral distributions can produce the same three cone responses (S, M, L) and therefore appear identical. For example, a monochromatic 589 nm yellow light and a mixture of 550 nm green plus 650 nm red can stimulate the M and L cones in exactly the same ratio, making them indistinguishable. This is why RGB displays work — they produce metamers of natural spectra, not the actual spectra themselves.',
      codeIntro: 'Convert atmospheric sunset spectra to CIE chromaticity coordinates and plot the color trajectory as the sun descends from noon to horizon on the CIE diagram.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# CIE 1931 2-degree color matching functions (sampled at 5 nm)
# Using analytical approximation (Wyman et al. 2013)
def cie_x_bar(wl):
    t1 = (wl - 442.0) * (0.0624 if wl < 442.0 else 0.0374)
    t2 = (wl - 599.8) * (0.0264 if wl < 599.8 else 0.0323)
    t3 = (wl - 501.1) * (0.0490 if wl < 501.1 else 0.0382)
    return 0.362 * np.exp(-0.5*t1*t1) + 1.056 * np.exp(-0.5*t2*t2) - 0.065 * np.exp(-0.5*t3*t3)

def cie_y_bar(wl):
    t1 = (wl - 568.8) * (0.0213 if wl < 568.8 else 0.0247)
    t2 = (wl - 530.9) * (0.0613 if wl < 530.9 else 0.0322)
    return 0.821 * np.exp(-0.5*t1*t1) + 0.286 * np.exp(-0.5*t2*t2)

def cie_z_bar(wl):
    t1 = (wl - 437.0) * (0.0845 if wl < 437.0 else 0.0278)
    t2 = (wl - 459.0) * (0.0385 if wl < 459.0 else 0.0725)
    return 1.217 * np.exp(-0.5*t1*t1) + 0.681 * np.exp(-0.5*t2*t2)

wavelengths = np.linspace(380, 780, 500)
x_bar = np.array([cie_x_bar(wl) for wl in wavelengths])
y_bar = np.array([cie_y_bar(wl) for wl in wavelengths])
z_bar = np.array([cie_z_bar(wl) for wl in wavelengths])

def spectrum_to_XYZ(spectrum, wl):
    """Convert spectral power distribution to CIE XYZ."""
    X = np.trapz(spectrum * x_bar, wl)
    Y = np.trapz(spectrum * y_bar, wl)
    Z = np.trapz(spectrum * z_bar, wl)
    return X, Y, Z

def XYZ_to_xy(X, Y, Z):
    """Convert XYZ to chromaticity coordinates."""
    s = X + Y + Z
    if s < 1e-20:
        return 0.333, 0.333
    return X / s, Y / s

def XYZ_to_sRGB(X, Y, Z):
    """Convert XYZ to sRGB with gamma correction."""
    # XYZ to linear sRGB
    r =  3.2406 * X - 1.5372 * Y - 0.4986 * Z
    g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z
    b =  0.0557 * X - 0.2040 * Y + 1.0570 * Z
    # Gamma correction
    def gamma(u):
        u = max(0, u)
        return 12.92 * u if u <= 0.0031308 else 1.055 * u**(1/2.4) - 0.055
    return (min(1, gamma(r)), min(1, gamma(g)), min(1, gamma(b)))

# Solar spectrum
def planck(wl_nm, T=5778):
    wl_m = wl_nm * 1e-9
    h, c, k = 6.626e-34, 3e8, 1.381e-23
    return (2*h*c**2/wl_m**5) / (np.exp(h*c/(wl_m*k*T)) - 1)

solar = planck(wavelengths)
solar = solar / solar.max()

def rayleigh_tau(wl_nm, am):
    return 0.008735 * (wl_nm / 1000.0)**(-4.08) * am

def air_mass(zenith_deg):
    if zenith_deg < 89:
        z = np.radians(zenith_deg)
        return 1.0 / (np.cos(z) + 0.50572 * (96.07995 - zenith_deg)**(-1.6364))
    return 38.0

# Compute sunset trajectory on chromaticity diagram
zenith_angles = np.linspace(0, 90, 100)
xy_trajectory = []
rgb_trajectory = []
brightness = []

for za in zenith_angles:
    am = air_mass(za)
    tau = rayleigh_tau(wavelengths, am)
    transmitted = solar * np.exp(-tau)
    X, Y, Z = spectrum_to_XYZ(transmitted, wavelengths)
    x, y = XYZ_to_xy(X, Y, Z)
    xy_trajectory.append((x, y))
    # Normalize for display
    maxval = max(X, Y, Z, 1e-20)
    rgb = XYZ_to_sRGB(X/maxval, Y/maxval, Z/maxval)
    rgb_trajectory.append(rgb)
    brightness.append(Y)

xy_trajectory = np.array(xy_trajectory)

fig, axes = plt.subplots(1, 2, figsize=(14, 7))
fig.patch.set_facecolor('#1f2937')

# Left: CIE chromaticity diagram
ax1 = axes[0]
ax1.set_facecolor('#111827')

# Draw spectral locus
spectral_x = []
spectral_y = []
spectral_colors = []
for wl in np.arange(380, 781, 2):
    xb = cie_x_bar(wl)
    yb = cie_y_bar(wl)
    zb = cie_z_bar(wl)
    s = xb + yb + zb
    if s > 0.001:
        spectral_x.append(xb / s)
        spectral_y.append(yb / s)
        # Approximate color
        X, Y, Z = xb, yb, zb
        mx = max(X, Y, Z, 1e-20)
        spectral_colors.append(XYZ_to_sRGB(X/mx, Y/mx, Z/mx))

# Fill the gamut area
from matplotlib.patches import Polygon
locus_points = list(zip(spectral_x, spectral_y))
locus_points.append(locus_points[0])
gamut_poly = Polygon(locus_points, facecolor='#1a1a2e', edgecolor='white',
                     linewidth=1.5, alpha=0.3)
ax1.add_patch(gamut_poly)

# Spectral locus with colors
for i in range(len(spectral_x) - 1):
    ax1.plot(spectral_x[i:i+2], spectral_y[i:i+2],
             color=spectral_colors[i], linewidth=3)

# sRGB gamut triangle
srgb_corners = [(0.64, 0.33), (0.30, 0.60), (0.15, 0.06), (0.64, 0.33)]
srgb_x = [c[0] for c in srgb_corners]
srgb_y = [c[1] for c in srgb_corners]
ax1.plot(srgb_x, srgb_y, 'w--', linewidth=1.5, alpha=0.6, label='sRGB gamut')

# Sunset trajectory
for i in range(len(xy_trajectory) - 1):
    ax1.plot(xy_trajectory[i:i+2, 0], xy_trajectory[i:i+2, 1],
             color=rgb_trajectory[i], linewidth=3)

# Mark key points
key_angles = [0, 30, 60, 75, 85, 90]
key_labels = ['Noon', '30\\u00b0', '60\\u00b0', '75\\u00b0', '85\\u00b0', 'Sunset']
for za, label in zip(key_angles, key_labels):
    idx = np.argmin(np.abs(zenith_angles - za))
    ax1.plot(xy_trajectory[idx, 0], xy_trajectory[idx, 1], 'o',
             color=rgb_trajectory[idx], markersize=10, markeredgecolor='white',
             markeredgewidth=1.5)
    offset = (0.02, 0.02) if za < 80 else (-0.05, -0.03)
    ax1.annotate(label, xy=(xy_trajectory[idx, 0], xy_trajectory[idx, 1]),
                 xytext=(xy_trajectory[idx, 0] + offset[0],
                         xy_trajectory[idx, 1] + offset[1]),
                 color='white', fontsize=9, fontweight='bold',
                 arrowprops=dict(arrowstyle='->', color='white', lw=0.8))

# White point (D65)
ax1.plot(0.3127, 0.3290, '*', color='white', markersize=12, label='D65 white point')

ax1.set_xlabel('x', color='white', fontsize=14)
ax1.set_ylabel('y', color='white', fontsize=14)
ax1.set_title('CIE 1931 chromaticity: noon-to-sunset trajectory', color='white', fontsize=13)
ax1.set_xlim(-0.05, 0.85)
ax1.set_ylim(-0.05, 0.9)
ax1.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=10)
ax1.tick_params(colors='gray')
ax1.set_aspect('equal')

# Right: RGB channel values through the sunset
ax2 = axes[1]
ax2.set_facecolor('#111827')

r_vals = [rgb[0] for rgb in rgb_trajectory]
g_vals = [rgb[1] for rgb in rgb_trajectory]
b_vals = [rgb[2] for rgb in rgb_trajectory]

ax2.plot(zenith_angles, r_vals, color='#ef4444', linewidth=2.5, label='R channel')
ax2.plot(zenith_angles, g_vals, color='#22c55e', linewidth=2.5, label='G channel')
ax2.plot(zenith_angles, b_vals, color='#3b82f6', linewidth=2.5, label='B channel')

# Show color strip at bottom
for i, (za, rgb) in enumerate(zip(zenith_angles, rgb_trajectory)):
    ax2.axvspan(za - 0.5, za + 0.5, ymin=0, ymax=0.08, color=rgb)

# Mark where blue channel drops to zero
b_zero_idx = next((i for i, b in enumerate(b_vals) if b < 0.01), len(b_vals)-1)
ax2.axvline(zenith_angles[b_zero_idx], color='#3b82f6', linestyle=':', alpha=0.5)
ax2.text(zenith_angles[b_zero_idx] + 1, 0.5, 'Blue\\ngone', color='#3b82f6',
         fontsize=10)

ax2.set_xlabel('Solar zenith angle (degrees)', color='white', fontsize=12)
ax2.set_ylabel('sRGB channel value (normalized)', color='white', fontsize=12)
ax2.set_title('RGB decomposition: noon to sunset', color='white', fontsize=13)
ax2.legend(facecolor='#1f2937', edgecolor='gray', labelcolor='white', fontsize=11)
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Chromaticity coordinates from noon to sunset:")
print(f"{'Zenith':<10} {'x':>8} {'y':>8} {'R':>6} {'G':>6} {'B':>6} {'In sRGB?':>10}")
print("-" * 56)
for za, label in zip(key_angles, key_labels):
    idx = np.argmin(np.abs(zenith_angles - za))
    x, y = xy_trajectory[idx]
    r, g, b = rgb_trajectory[idx]
    # Check if in sRGB gamut (simplified: all channels 0-1 without clipping)
    X, Y, Z = spectrum_to_XYZ(solar * np.exp(-rayleigh_tau(wavelengths, air_mass(za))), wavelengths)
    mx = max(X, Y, Z, 1e-20)
    r_lin = 3.2406*X/mx - 1.5372*Y/mx - 0.4986*Z/mx
    g_lin = -0.9689*X/mx + 1.8758*Y/mx + 0.0415*Z/mx
    b_lin = 0.0557*X/mx - 0.2040*Y/mx + 1.0570*Z/mx
    in_gamut = "Yes" if (0 <= r_lin <= 1 and 0 <= g_lin <= 1 and 0 <= b_lin <= 1) else "CLIPPED"
    print(f"{label:<10} {x:>8.4f} {y:>8.4f} {r:>6.3f} {g:>6.3f} {b:>6.3f} {in_gamut:>10}")
print()
print("Key insight: deep sunset colors move OUTSIDE the sRGB triangle.")
print("Your screen literally cannot display the exact color your eyes see.")
print("This is why sunset photos never look quite right.")`,
      challenge: 'Add a second trajectory for a polluted atmosphere (AOD=0.5) on the same chromaticity diagram. Compare where clean and polluted sunsets end up in color space. Also add the Planck locus (blackbody colors from 1000K to 10000K) to show that sunset colors approximate lower-temperature blackbodies.',
      successHint: 'Color science bridges physics and human perception. The CIE diagram is one of the most important tools in display engineering, printing, photography, and lighting design. Understanding that "color" is a perceptual construct — not an intrinsic property of light — is a profound insight that connects optics, neuroscience, and engineering.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Requires Level 2 (atmospheric optics fundamentals)</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python with numpy and matplotlib for real physics simulations. Click to start.</p>
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
