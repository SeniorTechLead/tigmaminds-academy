import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import StarMagnitudeFormulaDiagram from '../diagrams/StarMagnitudeFormulaDiagram';
import StarDistanceModulusDiagram from '../diagrams/StarDistanceModulusDiagram';
import StarBlackbodyDiagram from '../diagrams/StarBlackbodyDiagram';
import StarCCDDiagram from '../diagrams/StarCCDDiagram';
import StarAirmasssDiagram from '../diagrams/StarAirmasssDiagram';
import StarExtinctionDiagram from '../diagrams/StarExtinctionDiagram';

export default function StarsZiroLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

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

print("\\n[Full visualization in playground]")`,
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

print("\\n[Full visualization in playground]")`,
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

print("\\n[Full visualization in playground]")`,
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

print("\\n[Full visualization in playground]")`,
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
]

print("\\n[Full visualization in playground]")`,
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
            diagram={[StarMagnitudeFormulaDiagram, StarDistanceModulusDiagram, StarBlackbodyDiagram, StarCCDDiagram, StarAirmasssDiagram, StarExtinctionDiagram][i] ? createElement([StarMagnitudeFormulaDiagram, StarDistanceModulusDiagram, StarBlackbodyDiagram, StarCCDDiagram, StarAirmasssDiagram, StarExtinctionDiagram][i]) : undefined}
            />
        ))}
      </div>
    </div>
  );
}
