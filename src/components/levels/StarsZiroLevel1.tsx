import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function StarsZiroLevel1() {
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
      title: 'Light pollution — when humans steal the stars',
      concept: `Ziro Valley in Arunachal Pradesh is one of the few places in India where you can still see the Milky Way with the naked eye. Most of the world has lost this view to **light pollution** — the excessive or misdirected artificial light that washes out the night sky.

The Bortle scale measures sky darkness from 1 (pristine) to 9 (city center):
- **Class 1-2**: Milky Way casts shadows, thousands of stars visible (remote areas like Ziro)
- **Class 3-4**: Milky Way visible but faded, light domes on horizon
- **Class 5-6**: Milky Way barely visible, only bright stars
- **Class 7-9**: Only planets and brightest stars visible (most Indian cities)

Light pollution affects:
- **Astronomy**: ruins ground-based observations
- **Wildlife**: confuses migratory birds, disrupts insect behavior, affects sea turtle hatchlings
- **Human health**: suppresses melatonin production, disrupts circadian rhythm
- **Energy waste**: ~35% of outdoor lighting goes up into the sky, wasted

Over 80% of the world's population lives under light-polluted skies. A third of humanity cannot see the Milky Way at all.`,
      analogy: 'Light pollution is like noise pollution for your eyes. In a quiet library (dark sky), you can hear a whisper (faint star). In a loud concert (city), even shouting (bright star) is hard to hear. City lights are so "loud" that the "whispers" of distant stars are completely drowned out.',
      storyConnection: 'In the story, the children of Ziro Valley looked up and saw a universe teeming with stars. This is not fantasy — it is what every human saw before electric lights. The story reminds us of something real that most modern children have never experienced: a truly dark sky.',
      checkQuestion: 'If light pollution gets worse at the current rate, how long before there are no Bortle Class 1 sites left on Earth?',
      checkAnswer: 'Satellite data shows artificial light increasing by about 2% per year globally. At this rate, the last truly dark sites (remote deserts, deep forests, and valleys like Ziro) could be affected within 50-100 years. Some researchers argue that LEDs, while energy-efficient, have accelerated light pollution because they are cheap and encourage more lighting.',
      codeIntro: 'Simulate how many stars are visible at different levels of light pollution.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Star visibility model
# Human eye can see stars to ~magnitude 6.5 in perfect darkness
# Light pollution raises the limiting magnitude

bortle_classes = np.arange(1, 10)
limiting_mag = np.array([7.5, 7.0, 6.5, 6.0, 5.5, 5.0, 4.5, 4.0, 3.5])

# Approximate number of stars visible to naked eye at each limiting magnitude
# N(m) ≈ 10^(0.6*m - 0.4) (rough approximation)
stars_visible = 10**(0.6 * limiting_mag - 0.4)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Stars visible
ax1.set_facecolor('#111827')
bars = ax1.bar(bortle_classes, stars_visible, color=plt.cm.YlOrRd(np.linspace(0.1, 0.9, 9)))
ax1.set_xlabel('Bortle Class (1=pristine, 9=city)', color='white')
ax1.set_ylabel('Stars visible to naked eye', color='white')
ax1.set_title('Stars Lost to Light Pollution', color='white', fontsize=12)
ax1.tick_params(colors='gray')
ax1.set_yscale('log')

# Add labels
locations = ['Remote\\nwilderness', '', 'Rural\\nvillage', '', 'Suburban',
             '', 'City\\nedge', '', 'City\\ncenter']
for b, s, loc in zip(bortle_classes, stars_visible, locations):
    ax1.text(b, s * 1.3, f'{s:.0f}', ha='center', color='white', fontsize=8)
    if loc:
        ax1.text(b, 10, loc, ha='center', color='gray', fontsize=7, rotation=45)

# Sky brightness over time
ax2.set_facecolor('#111827')
years = np.arange(1950, 2030)
# Sky brightness increasing ~2% per year (log scale)
base_brightness = 21.5  # mag/arcsec² (natural dark sky)
brightness = base_brightness - 0.02 * (years - 1950)  # getting brighter = lower number

ax2.plot(years, brightness, color='#f59e0b', linewidth=2)
ax2.axhline(21.5, color='#22c55e', linestyle='--', alpha=0.5, label='Natural dark sky')
ax2.axhline(19.0, color='#ef4444', linestyle='--', alpha=0.5, label='Milky Way invisible')
ax2.fill_between(years, brightness, 21.5, alpha=0.1, color='#f59e0b')
ax2.set_xlabel('Year', color='white')
ax2.set_ylabel('Sky brightness (mag/arcsec²)\\n← brighter | darker →', color='white')
ax2.set_title('Global Average Sky Getting Brighter', color='white', fontsize=12)
ax2.legend(facecolor='#1f2937', labelcolor='white')
ax2.tick_params(colors='gray')
ax2.invert_yaxis()

plt.tight_layout()
plt.show()

print(f"Stars visible from Ziro Valley (Bortle 2): ~{stars_visible[1]:.0f}")
print(f"Stars visible from Delhi (Bortle 8):       ~{stars_visible[7]:.0f}")
print(f"That's a {stars_visible[1]/stars_visible[7]:.0f}x difference!")
print()
print("We've lost 99% of visible stars in our cities.")`,
      challenge: 'If a town installs fully shielded lights (directing all light downward), it might improve from Bortle 7 to Bortle 5. How many more stars become visible? Is the improvement worth the cost?',
      successHint: 'Light pollution is one of the most easily reversible forms of environmental damage. Turn off unnecessary lights, shield the rest, and the stars return immediately. No cleanup, no restoration — just darkness.',
    },
    {
      title: 'Stellar magnitude — measuring star brightness',
      concept: `Astronomers measure star brightness using **magnitude** — a scale invented by the Greek astronomer Hipparchus around 150 BCE. Confusingly, **lower numbers mean brighter stars**.

The magnitude scale is **logarithmic**: each step of 1 magnitude = 2.512× brightness difference. A difference of 5 magnitudes = exactly 100× brightness.

Key reference points:
- **Sun**: magnitude -26.7 (blindingly bright)
- **Full Moon**: -12.7
- **Venus** (brightest planet): -4.6
- **Sirius** (brightest star): -1.46
- **Polaris** (North Star): +2.0
- **Faintest naked-eye star**: +6.5
- **Faintest star visible to Hubble**: +31.5

The formula: brightness ratio = 2.512^(m₁ - m₂)

So the Sun is 2.512^(6.5 - (-26.7)) = 2.512^33.2 ≈ 1.6 × 10¹³ times brighter than the faintest star you can see. That is 16 trillion times brighter.`,
      analogy: 'The magnitude scale is like the Richter scale for earthquakes. Just as a magnitude 7 earthquake is not "a little more" than magnitude 6 (it is 10× more energy), a magnitude 1 star is not "a little brighter" than magnitude 2 — it is 2.5× brighter. Both scales compress enormous ranges into manageable numbers.',
      storyConnection: 'The children of Ziro saw stars spanning many magnitudes — from brilliant Sirius to the faintest points of the Milky Way. The magnitude system lets us quantify what they saw: roughly stars from magnitude -1 to +7, a brightness range of over 1,500 to 1.',
      checkQuestion: 'If two stars have magnitudes 1.0 and 6.0, how many times brighter is the first star?',
      checkAnswer: 'Brightness ratio = 2.512^(6.0 - 1.0) = 2.512^5 = 100. The magnitude 1 star is exactly 100 times brighter. This is by design — Pogson defined the scale in 1856 so that 5 magnitudes = exactly 100× brightness, giving 2.512 as the base per magnitude step.',
      codeIntro: 'Explore the magnitude scale and plot star brightness relationships.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Magnitude-brightness relationship
magnitudes = np.linspace(-2, 8, 200)
# Relative brightness (magnitude 0 = reference)
brightness = 2.512 ** (-magnitudes)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Magnitude vs brightness
ax1.set_facecolor('#111827')
ax1.semilogy(magnitudes, brightness, color='#f59e0b', linewidth=2)
ax1.set_xlabel('Apparent magnitude (← brighter | fainter →)', color='white')
ax1.set_ylabel('Relative brightness (log scale)', color='white')
ax1.set_title('The Magnitude-Brightness Relationship', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Mark famous objects
objects = [
    ('Sirius', -1.46, '#60a5fa'),
    ('Vega (reference)', 0.0, '#22c55e'),
    ('Polaris', 2.0, '#f59e0b'),
    ('Faintest naked eye', 6.5, '#ef4444'),
]
for name, mag, color in objects:
    b = 2.512 ** (-mag)
    ax1.plot(mag, b, 'o', color=color, markersize=8)
    ax1.annotate(name, xy=(mag, b), xytext=(mag+0.5, b*1.5),
                color=color, fontsize=9, arrowprops=dict(arrowstyle='->', color=color))

# Simulated night sky
ax2.set_facecolor('#0a0a14')  # Very dark blue-black

np.random.seed(42)
n_stars = 500
star_mags = np.random.exponential(2.5, n_stars) - 1  # magnitude distribution
star_x = np.random.uniform(0, 10, n_stars)
star_y = np.random.uniform(0, 10, n_stars)

# Size and alpha based on magnitude
star_sizes = np.clip(50 * 2.512 ** (-star_mags / 2), 0.5, 50)
star_alpha = np.clip(1.0 - star_mags / 8, 0.05, 1.0)

# Only show stars brighter than limiting magnitude
lim_mag = 6.5  # Dark sky
visible = star_mags < lim_mag

ax2.scatter(star_x[visible], star_y[visible], s=star_sizes[visible],
           c='white', alpha=star_alpha[visible], edgecolors='none')
ax2.set_title(f'Simulated Sky (limit mag {lim_mag}, {np.sum(visible)} stars)', color='white', fontsize=11)
ax2.set_xlim(0, 10)
ax2.set_ylim(0, 10)
ax2.axis('off')

plt.tight_layout()
plt.show()

print("Brightness ratios:")
for name, mag, _ in objects:
    ratio = 2.512 ** (6.5 - mag)
    print(f"  {name} (mag {mag}) is {ratio:.0f}x brighter than faintest visible star")`,
      challenge: 'Change the limiting magnitude to 4.0 (light-polluted suburban sky). How many stars disappear? What percentage of the sky\'s beauty is lost?',
      successHint: 'The magnitude system compresses a brightness range of trillions into a few numbers. This logarithmic compression is the same principle behind decibels (sound), pH (acidity), and the Richter scale (earthquakes).',
    },
    {
      title: 'Electromagnetic spectrum — light beyond what we see',
      concept: `Visible light — what our eyes detect — is a tiny slice of the **electromagnetic spectrum**. Stars emit radiation across the entire spectrum, and each wavelength tells us something different:

- **Radio waves** (>1mm): cold gas clouds, pulsars, cosmic background
- **Microwave** (1mm - 1m): cosmic microwave background (the afterglow of the Big Bang)
- **Infrared** (700nm - 1mm): warm objects, dust-obscured stars, exoplanet atmospheres
- **Visible** (400-700nm): surface temperature of stars (red=cool, blue=hot)
- **Ultraviolet** (10-400nm): hot stars, active galaxies
- **X-rays** (0.01-10nm): black hole accretion disks, supernova remnants
- **Gamma rays** (<0.01nm): most energetic events — neutron star mergers, gamma-ray bursts

**Wien's displacement law**: hotter objects emit shorter wavelengths.
- Sun (5,778 K): peak in visible light (yellow-green)
- Human body (310 K): peak in infrared
- Cosmic microwave background (2.7 K): peak in microwave

Every element absorbs and emits specific wavelengths — its spectral "fingerprint." By analyzing starlight with a spectrometer, astronomers can determine a star's temperature, composition, speed, and even whether it has planets.`,
      analogy: 'The electromagnetic spectrum is like a piano. Visible light is just one octave in the middle. Radio waves are the deep bass notes, gamma rays are the highest treble. Our eyes can "hear" only one octave, but with telescopes tuned to different wavelengths, we can hear the entire cosmic symphony.',
      storyConnection: 'The children of Ziro saw starlight — but only the visible portion. Each star was also broadcasting in radio, infrared, ultraviolet, and X-rays. The night sky is far richer than even the darkest sky reveals to naked eyes. Ziro\'s clear atmosphere lets through visible light beautifully, but a radio telescope there would hear even more.',
      checkQuestion: 'Why do astronomers put telescopes in space when we already have large ground-based telescopes?',
      checkAnswer: 'Earth\'s atmosphere blocks most wavelengths. It is transparent to visible light and radio waves but opaque to most infrared, ultraviolet, X-rays, and gamma rays. Space telescopes like Hubble (visible/UV), Chandra (X-ray), and JWST (infrared) can observe wavelengths that never reach the ground. Additionally, the atmosphere blurs visible light (why stars twinkle) — space telescopes see sharp images.',
      codeIntro: 'Model blackbody radiation curves for stars of different temperatures.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Planck's blackbody radiation law
def planck(wavelength, T):
    """Spectral radiance (W/m²/sr/m) for given wavelength (m) and temperature (K)"""
    h = 6.626e-34  # Planck constant
    c = 3e8         # Speed of light
    k = 1.381e-23   # Boltzmann constant
    a = 2 * h * c**2 / wavelength**5
    b = np.exp(h * c / (wavelength * k * T)) - 1
    return a / b

# Wavelength range: 100nm to 3000nm
wavelengths = np.linspace(100e-9, 3000e-9, 1000)
wavelengths_nm = wavelengths * 1e9

# Stars at different temperatures
stars = {
    'Betelgeuse (3500K)': {'T': 3500, 'color': '#ef4444'},
    'Sun (5778K)': {'T': 5778, 'color': '#f59e0b'},
    'Sirius (9940K)': {'T': 9940, 'color': '#93c5fd'},
    'Rigel (12100K)': {'T': 12100, 'color': '#60a5fa'},
}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))
fig.patch.set_facecolor('#1f2937')

# Blackbody curves
ax1.set_facecolor('#111827')

# Visible light band
ax1.axvspan(400, 700, alpha=0.15, color='white', label='Visible light')

for name, props in stars.items():
    radiance = planck(wavelengths, props['T'])
    radiance_norm = radiance / radiance.max()  # Normalize
    ax1.plot(wavelengths_nm, radiance_norm, color=props['color'], linewidth=2, label=name)

    # Wien's law: peak wavelength
    peak = 2.898e-3 / props['T'] * 1e9  # nm
    if 50 < peak < 3000:
        ax1.axvline(peak, color=props['color'], linestyle=':', alpha=0.3)

ax1.set_xlabel('Wavelength (nm)', color='white')
ax1.set_ylabel('Relative intensity', color='white')
ax1.set_title('Blackbody Radiation: Star Temperatures', color='white', fontsize=12)
ax1.legend(facecolor='#1f2937', labelcolor='white', fontsize=8)
ax1.tick_params(colors='gray')
ax1.set_xlim(100, 2500)

# Electromagnetic spectrum overview
ax2.set_facecolor('#111827')
bands = [
    ('Gamma', 0.001, 0.01, '#a855f7'),
    ('X-ray', 0.01, 10, '#3b82f6'),
    ('UV', 10, 400, '#60a5fa'),
    ('Visible', 400, 700, '#22c55e'),
    ('IR', 700, 1e6, '#f59e0b'),
    ('Microwave', 1e6, 1e9, '#ef4444'),
    ('Radio', 1e9, 1e12, '#dc2626'),
]

for i, (name, low, high, color) in enumerate(bands):
    ax2.barh(i, np.log10(high) - np.log10(low), left=np.log10(low),
            color=color, alpha=0.7, height=0.6)
    ax2.text(np.log10(low) + (np.log10(high)-np.log10(low))/2, i,
            name, ha='center', va='center', color='white', fontsize=9, fontweight='bold')

# Atmospheric transparency
ax2.set_xlabel('log₁₀(wavelength in nm)', color='white')
ax2.set_title('Electromagnetic Spectrum', color='white', fontsize=12)
ax2.set_yticks([])
ax2.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Wien's displacement law: λ_peak = 2,898,000 / T")
for name, props in stars.items():
    peak = 2.898e6 / props['T']
    print(f"  {name}: peak at {peak:.0f} nm")`,
      challenge: 'What temperature would a star need to be for its peak emission to be in the ultraviolet (peak at 300 nm)? What about X-ray (peak at 1 nm)? Use Wien\'s law.',
      successHint: 'Every object with a temperature above absolute zero emits electromagnetic radiation. The same physics that describes starlight describes the infrared glow of your own body. Wien\'s law connects temperature to light — a universal translator.',
    },
    {
      title: 'Celestial navigation — finding your way by starlight',
      concept: `For thousands of years, humans navigated using stars. The Apatani people of Ziro Valley, like all pre-modern cultures, read the night sky for direction, season, and time.

Key principles of celestial navigation:
- **Polaris** (North Star) sits almost exactly above Earth's North Pole. Its altitude angle equals your **latitude**. From Ziro (27°N), Polaris is 27° above the horizon.
- **Star trails**: stars appear to rotate around Polaris due to Earth's rotation. A 15-second exposure shows dots; a 30-minute exposure shows arcs.
- **Seasonal constellations**: different stars are visible at different times of year because Earth orbits the Sun. Orion is a winter constellation; Scorpius is summer.
- **Time from stars**: the sky rotates 15° per hour (360°/24h). The position of a known star tells you the time.

The sextant — the precision instrument of maritime navigation — measures the angle between a star and the horizon. Combined with an accurate clock and star tables, this gives your position to within ~1 nautical mile.

GPS has replaced celestial navigation for most purposes, but every spacecraft still carries star trackers — cameras that identify stars to determine orientation in space.`,
      analogy: 'Celestial navigation is like using a giant clock painted on the ceiling. The stars are the clock hands, the constellations are the hour markers. If you know which "clock hand" is pointing where, you can read the time (by star position) and your location (by Polaris altitude). The clock runs on Earth\'s rotation.',
      storyConnection: 'The children of Ziro looked up and saw patterns in the stars. These patterns — constellations — were humanity\'s first maps. Long before Google Maps, the Milky Way was the highway and Polaris was the compass. The story connects modern children to the same sky their ancestors used to navigate.',
      checkQuestion: 'At the North Pole, Polaris is directly overhead (90° altitude). At the equator, Polaris is on the horizon (0° altitude). Why?',
      checkAnswer: 'Polaris is almost directly above Earth\'s North Pole. Your latitude = the angle between your position and the equator, measured from Earth\'s center. This is also the angle at which you see Polaris above your horizon. At the North Pole (90°N), you look straight up to see Polaris. At the equator (0°), Polaris is at the horizon. At Ziro (27°N), Polaris is 27° up. Geometry makes latitude measurement trivially easy if you can find Polaris.',
      codeIntro: 'Simulate star trails showing Earth\'s rotation effect on the night sky.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simulate star trails (long-exposure photograph)
np.random.seed(42)

# Generate random stars on the celestial sphere
n_stars = 200
# Declination (celestial latitude) and right ascension (celestial longitude)
dec = np.random.uniform(-30, 90, n_stars)  # degrees
ra = np.random.uniform(0, 360, n_stars)  # degrees
brightness = np.random.exponential(1.5, n_stars)

# Observer at Ziro Valley: latitude 27.5°N
lat = 27.5

# Convert to altitude-azimuth for different times
def equatorial_to_altaz(ra, dec, lat, lst):
    """Convert RA/Dec to Alt/Az given latitude and local sidereal time."""
    ra_r = np.radians(ra)
    dec_r = np.radians(dec)
    lat_r = np.radians(lat)
    lst_r = np.radians(lst)
    ha = lst_r - ra_r  # hour angle

    alt = np.arcsin(np.sin(dec_r)*np.sin(lat_r) + np.cos(dec_r)*np.cos(lat_r)*np.cos(ha))
    az_y = -np.sin(ha) * np.cos(dec_r)
    az_x = np.cos(ha)*np.sin(lat_r)*np.cos(dec_r) - np.sin(dec_r)*np.cos(lat_r)
    az = np.arctan2(az_y, az_x)

    return np.degrees(alt), np.degrees(az)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5.5))
fig.patch.set_facecolor('#0a0a14')

# Single moment snapshot
ax1.set_facecolor('#0a0a14')
alt0, az0 = equatorial_to_altaz(ra, dec, lat, 0)
visible = alt0 > 0
sizes = brightness[visible] * 5
ax1.scatter(az0[visible], alt0[visible], s=sizes, c='white', alpha=0.8, edgecolors='none')

# Mark Polaris (approximately Dec=89.3°, RA=37.95°)
alt_p, az_p = equatorial_to_altaz(37.95, 89.3, lat, 0)
ax1.scatter([az_p], [alt_p], s=50, c='#f59e0b', marker='*', zorder=5)
ax1.annotate('Polaris', xy=(az_p, alt_p), xytext=(az_p+10, alt_p+5),
            color='#f59e0b', fontsize=10)
ax1.axhline(lat, color='#22c55e', linestyle='--', alpha=0.3)
ax1.text(-170, lat+2, f'Polaris altitude = latitude = {lat}°', color='#22c55e', fontsize=8)
ax1.set_xlabel('Azimuth (°)', color='gray')
ax1.set_ylabel('Altitude (°)', color='gray')
ax1.set_title('Night Sky from Ziro Valley (snapshot)', color='white', fontsize=11)
ax1.tick_params(colors='gray')
ax1.set_ylim(0, 90)

# Star trails (4-hour exposure)
ax2.set_facecolor('#0a0a14')
hours = np.linspace(0, 60, 30)  # 60 degrees = 4 hours of rotation

for i in range(min(n_stars, 100)):
    trail_alt = []
    trail_az = []
    for lst in hours:
        a, z = equatorial_to_altaz(ra[i], dec[i], lat, lst)
        if a > 0:
            trail_alt.append(a)
            trail_az.append(z)

    if len(trail_az) > 1:
        alpha = min(brightness[i] / 5, 0.8)
        ax2.plot(trail_az, trail_alt, color='white', alpha=alpha, linewidth=0.5)

# Polaris stays nearly fixed
ax2.scatter([az_p], [alt_p], s=80, c='#f59e0b', marker='*', zorder=5)
ax2.annotate('Polaris\\n(nearly fixed)', xy=(az_p, alt_p), xytext=(az_p+15, alt_p-10),
            color='#f59e0b', fontsize=9, arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax2.set_xlabel('Azimuth (°)', color='gray')
ax2.set_ylabel('Altitude (°)', color='gray')
ax2.set_title('Star Trails (4-hour exposure)', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_ylim(0, 90)

plt.tight_layout()
plt.show()

print(f"Observer latitude: {lat}°N (Ziro Valley)")
print(f"Polaris altitude: {alt_p:.1f}° (≈ latitude)")
print(f"Earth rotates 15°/hour → stars trail 60° in 4 hours")
print()
print("Stars near Polaris trace small circles (circumpolar).")
print("Stars near the equator trace large arcs across the sky.")`,
      challenge: 'Change the latitude to 0° (equator) and 90° (North Pole). How do the star trails change? At the equator, all stars rise and set. At the pole, all visible stars are circumpolar.',
      successHint: 'Celestial navigation connected humanity to the cosmos for millennia. GPS satellites have replaced the stars for navigation, but the math is the same — triangulation using known reference points.',
    },
    {
      title: 'Telescopes — extending human vision into the cosmos',
      concept: `The naked eye collects light through a pupil about 7mm in diameter (when fully dark-adapted). A telescope is simply a bigger light-collecting "pupil."

**Light-gathering power** scales with the area of the aperture:
- A = π(D/2)² where D is the diameter
- A 100mm (4-inch) telescope collects (100/7)² ≈ 200× more light than the eye
- It can see stars 200× fainter — about 5.8 magnitudes deeper

Types of telescopes:
- **Refractor**: uses lenses (Galileo's design). Limited by lens size and chromatic aberration.
- **Reflector**: uses mirrors (Newton's design). Can be made much larger. All major telescopes are reflectors.
- **Radio telescope**: collects radio waves with a dish antenna. Can observe through clouds and daylight.

The largest telescopes:
- **Eye**: 7mm, sees to magnitude 6.5
- **Binoculars** (50mm): magnitude 9.5 (~13,000 stars)
- **Small telescope** (200mm): magnitude 13 (~millions of objects)
- **Hubble** (2.4m): magnitude 31.5
- **ELT** (39m, under construction): magnitude 34 — will see galaxies forming 13 billion years ago`,
      analogy: 'A telescope is like a rain gauge for light. A bigger bucket catches more raindrops. A bigger telescope mirror catches more photons. Double the diameter → 4× the light-collecting area → see objects 4× fainter. The universe is always "raining" photons; we just need bigger buckets to catch the faintest ones.',
      storyConnection: 'The children of Ziro saw the universe with their naked eyes — the most basic telescopes. But even from Ziro\'s dark skies, they could see only a fraction of what exists. A small telescope would reveal Jupiter\'s moons, Saturn\'s rings, and thousands of deep-sky objects — all invisible to their unaided eyes.',
      checkQuestion: 'The James Webb Space Telescope has a 6.5-meter mirror. How many times more light does it collect than the Hubble (2.4m)?',
      checkAnswer: 'Light-gathering power ∝ area ∝ diameter². JWST/Hubble = (6.5/2.4)² = 7.3×. JWST collects 7.3 times more light. But JWST observes in infrared (not visible), so it sees different things — cooler objects, more distant galaxies, and objects hidden by dust. The comparison is not just "more light" but "different light."',
      codeIntro: 'Calculate and visualize how telescope size determines what you can see.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Telescope aperture vs limiting magnitude
apertures_mm = np.array([7, 25, 50, 100, 200, 500, 1000, 2400, 6500, 10000, 39000])
names = ['Eye', 'Finder', 'Binoculars', '4-inch', '8-inch', '20-inch',
         '1m pro', 'Hubble', 'JWST', '10m Keck', 'ELT (39m)']

# Limiting magnitude: m_limit = m_eye + 5*log10(D/D_eye)
m_eye = 6.5
D_eye = 7  # mm
limiting_mags = m_eye + 5 * np.log10(apertures_mm / D_eye)

# Approximate number of objects visible
n_objects = 10**(0.6 * limiting_mags - 2)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Aperture vs limiting magnitude
ax1.set_facecolor('#111827')
ax1.semilogx(apertures_mm, limiting_mags, 'o-', color='#f59e0b', linewidth=2, markersize=6)
for d, m, name in zip(apertures_mm, limiting_mags, names):
    ax1.annotate(name, xy=(d, m), xytext=(d*1.2, m+0.5),
                color='white', fontsize=7, rotation=0)
ax1.set_xlabel('Aperture (mm, log scale)', color='white')
ax1.set_ylabel('Limiting magnitude (fainter →)', color='white')
ax1.set_title('Bigger Telescope = Fainter Objects', color='white', fontsize=12)
ax1.tick_params(colors='gray')

# Number of visible objects
ax2.set_facecolor('#111827')
ax2.semilogy(names[:8], n_objects[:8], 'o-', color='#22c55e', linewidth=2, markersize=6)
ax2.set_xlabel('Telescope', color='white')
ax2.set_ylabel('Approx. objects visible (log scale)', color='white')
ax2.set_title('Objects Visible per Telescope Size', color='white', fontsize=12)
ax2.tick_params(colors='gray', axis='y')
ax2.tick_params(colors='white', axis='x')
plt.setp(ax2.xaxis.get_majorticklabels(), rotation=45, ha='right', fontsize=8)

for n, name in zip(n_objects[:8], names[:8]):
    ax2.annotate(f'{n:.0e}', xy=(name, n), xytext=(0, 10),
                textcoords='offset points', color='#f59e0b', fontsize=8, ha='center')

plt.tight_layout()
plt.show()

print("Telescope comparison:")
print(f"{'Telescope':<15} {'Aperture':>10} {'Lim mag':>10} {'Light gain':>12}")
print("-" * 50)
for d, m, name in zip(apertures_mm, limiting_mags, names):
    gain = (d/D_eye)**2
    print(f"{name:<15} {d:>8}mm {m:>10.1f} {gain:>10.0f}x")`,
      challenge: 'If you could build a telescope with a 100-meter mirror, what magnitude could it reach? How many times more light would it collect than the human eye?',
      successHint: 'Telescope size is the single most important factor in astronomy. Every major discovery — from Jupiter\'s moons to exoplanets to dark energy — was made possible by building bigger light-collecting mirrors.',
    },
    {
      title: 'Exoplanets — searching for other worlds from Earth',
      concept: `As of 2025, astronomers have confirmed over 5,500 exoplanets — planets orbiting stars other than our Sun. Most were found using two methods:

**1. Transit method**: When a planet passes in front of its star, it blocks a tiny fraction of the star's light. The Kepler space telescope found thousands of planets this way.
- Transit depth = (R_planet/R_star)² — typically 0.01% to 1%
- Jupiter blocking the Sun: ~1% dip
- Earth blocking the Sun: ~0.008% dip (incredibly hard to detect)

**2. Radial velocity method**: A planet's gravity tugs its star in a small orbit. This creates a Doppler shift in the star's light — blue when approaching, red when receding.
- Jupiter tugs the Sun at ~12.5 m/s
- Earth tugs the Sun at ~0.09 m/s (near the detection limit)

From Ziro Valley's dark skies, many exoplanet host stars are visible to the naked eye. The star 51 Pegasi (magnitude 5.5) has a confirmed hot Jupiter — an entire alien solar system visible from a Himalayan valley.

The next frontier: analyzing exoplanet atmospheres for biosignatures — gases like oxygen, methane, and water that might indicate life.`,
      analogy: 'Finding an exoplanet by the transit method is like detecting a fly crossing a car headlight from a kilometer away. The fly blocks a tiny fraction of the light for a brief moment. To see this, you need incredibly precise light measurements — and the patience to watch the headlight for hours.',
      storyConnection: 'The children of Ziro looked at the stars and wondered what was out there. Modern astronomy has answered: planets. Billions of them. Many in the "habitable zone" where liquid water could exist. The stars the children saw are not lonely points of light — they are suns with worlds of their own.',
      checkQuestion: 'Earth-sized planets in habitable zones are the hardest exoplanets to detect. Why?',
      checkAnswer: 'They are small (tiny transit depth: 0.008%), far from their star (long orbital period: 1 year means you need to watch for years to see repeated transits), and their gravitational tug is tiny (0.09 m/s radial velocity — at the noise limit of current instruments). Finding another Earth requires extreme precision, long observation campaigns, and space-based telescopes above atmospheric interference.',
      codeIntro: 'Simulate an exoplanet transit light curve and radial velocity signal.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Transit light curve simulation
def transit_lightcurve(t, t0, period, r_ratio, duration):
    """Simple box-shaped transit model."""
    phase = ((t - t0) % period) / period
    phase[phase > 0.5] -= 1  # center at 0

    transit_half = duration / (2 * period)
    in_transit = np.abs(phase) < transit_half
    flux = np.ones_like(t)
    flux[in_transit] -= r_ratio**2
    return flux

# Parameters for a hot Jupiter
t = np.linspace(0, 10, 5000)  # 10 days
period = 3.5  # days
r_ratio = 0.1  # planet radius / star radius (Jupiter-like)
duration = 0.15  # transit duration in days

flux_jupiter = transit_lightcurve(t, 1.0, period, r_ratio, duration)
noise = np.random.normal(0, 0.001, len(t))
flux_observed = flux_jupiter + noise

# Earth-like planet
r_ratio_earth = 0.009  # Earth/Sun ratio
flux_earth = transit_lightcurve(t, 1.0, period, r_ratio_earth, duration)
flux_earth_obs = flux_earth + noise

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(12, 9))
fig.patch.set_facecolor('#1f2937')

# Hot Jupiter transit
ax1.set_facecolor('#111827')
ax1.plot(t, flux_observed, '.', color='gray', markersize=1, alpha=0.3)
ax1.plot(t, flux_jupiter, color='#f59e0b', linewidth=1.5)
ax1.set_ylabel('Relative flux', color='white')
ax1.set_title(f'Hot Jupiter Transit (R_p/R_star = {r_ratio}, depth = {r_ratio**2*100:.1f}%)', color='white', fontsize=11)
ax1.tick_params(colors='gray')
ax1.set_ylim(0.985, 1.005)

# Earth-like transit
ax2.set_facecolor('#111827')
ax2.plot(t, flux_earth_obs, '.', color='gray', markersize=1, alpha=0.3)
ax2.plot(t, flux_earth, color='#22c55e', linewidth=1.5)
ax2.set_ylabel('Relative flux', color='white')
ax2.set_title(f'Earth-like Transit (R_p/R_star = {r_ratio_earth}, depth = {r_ratio_earth**2*100:.4f}%)', color='white', fontsize=11)
ax2.tick_params(colors='gray')
ax2.set_ylim(0.995, 1.005)
ax2.text(5, 0.996, 'Transit is buried in noise!', color='#ef4444', fontsize=10, ha='center')

# Radial velocity
ax3.set_facecolor('#111827')
rv_amplitude = 50  # m/s for hot Jupiter
rv = rv_amplitude * np.sin(2 * np.pi * t / period)
rv_noise = np.random.normal(0, 5, len(t))

ax3.plot(t, rv + rv_noise, '.', color='gray', markersize=2, alpha=0.5)
ax3.plot(t, rv, color='#3b82f6', linewidth=1.5)
ax3.axhline(0, color='gray', linestyle=':', alpha=0.3)
ax3.set_xlabel('Time (days)', color='white')
ax3.set_ylabel('Radial velocity (m/s)', color='white')
ax3.set_title(f'Radial Velocity Signal (K = {rv_amplitude} m/s)', color='white', fontsize=11)
ax3.tick_params(colors='gray')

plt.tight_layout()
plt.show()

print("Detection comparison:")
print(f"  Hot Jupiter: transit depth = {r_ratio**2*100:.1f}% — EASY to detect")
print(f"  Earth-like:  transit depth = {r_ratio_earth**2*10000:.1f} ppm — VERY hard")
print(f"  Ratio: Jupiter signal is {(r_ratio/r_ratio_earth)**2:.0f}x stronger")
print()
print(f"  Kepler detected {r_ratio_earth**2*1e6:.0f} ppm transits from space.")
print(f"  From Ziro Valley, ground-based telescopes can detect ~{r_ratio**2*100:.0f}% dips.")`,
      challenge: 'If a planet has twice Earth\'s radius, how much deeper is its transit? Can you design a detection threshold that catches Jupiter-sized planets but not Earth-sized ones?',
      successHint: 'From counting stars in Ziro\'s sky to detecting planets around distant suns — astronomy spans the simplest observations (look up) to the most precise measurements humans have ever made. The same photons that fall on your eyes carry information about alien worlds.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">No prior astronomy experience needed</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for astronomy simulations. Click to start.</p>
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
