import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import BethlehemMagnitudeDiagram from '../diagrams/BethlehemMagnitudeDiagram';
import BethlehemConjunctionDiagram from '../diagrams/BethlehemConjunctionDiagram';
import BethlehemCelestialNavDiagram from '../diagrams/BethlehemCelestialNavDiagram';
import BethlehemKeplerDiagram from '../diagrams/BethlehemKeplerDiagram';
import OrbitalMechanicsDiagram from '../diagrams/OrbitalMechanicsDiagram';
import LatLongGridDiagram from '../diagrams/LatLongGridDiagram';

export default function BethlehemStarLevel1() {
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
      title: 'Your first star chart — plotting brightness vs distance',
      concept: `The Magi followed a star. But how do astronomers measure how bright a star really is? They use a scale called **magnitude**, invented by the Greek astronomer Hipparchus around 130 BCE.

The key surprise: **lower numbers mean brighter stars**. The brightest stars are magnitude 1. The faintest visible stars are magnitude 6. The Sun is magnitude −26.7 (extremely negative = extremely bright).

Each step of 1 magnitude = a brightness change of exactly **2.512 times**. This number is the fifth root of 100: five magnitude steps = 100× brightness difference.

In the code below, you’ll use NumPy to create an array of magnitudes and calculate the corresponding brightness ratios. Then you’ll plot them with Matplotlib to see how the logarithmic scale works.

📚 *New to NumPy? \`np.array()\` creates a list of numbers you can do math on all at once.*`,
      analogy: 'Think of the magnitude scale like a volume knob that runs backwards — turning it DOWN makes the sound (brightness) LOUDER. And each click is not a simple addition but a multiplication by 2.512. Going from magnitude 1 to magnitude 6 does not make a star "5 units dimmer" — it makes it 100 times dimmer.',
      storyConnection: 'The Magi were trained astronomers who had catalogued thousands of stars by brightness. When something new appeared in the sky — brighter than usual, in an unexpected position — they noticed immediately. Their knowledge of the magnitude scale told them this was no ordinary star.',
      checkQuestion: 'Sirius (magnitude −1.5) and Polaris (magnitude 2.0) differ by 3.5 magnitudes. How many times brighter is Sirius?',
      checkAnswer: '2.512^3.5 ≈ 25 times brighter. Each magnitude step is 2.512×, so 3.5 steps = 2.512 × 2.512 × 2.512 × √2.512 ≈ 25. Sirius is about 25 times brighter than Polaris as seen from Earth.',
      codeIntro: 'Calculate and plot the magnitude-brightness relationship.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Magnitude scale: each step = 2.512x brightness difference
magnitudes = np.arange(-2, 7)  # from very bright to barely visible
brightness = 2.512 ** (0 - magnitudes)  # relative to magnitude 0

plt.figure(figsize=(10, 5))
plt.bar(magnitudes, brightness, color=['#fbbf24' if m < 0 else '#3b82f6' if m < 3 else '#64748b' for m in magnitudes], width=0.7)

# Label some famous objects
labels = {-2: 'Jupiter', 0: 'Vega', 2: 'Polaris', 6: 'Faintest\\nvisible'}
for mag, name in labels.items():
    idx = list(magnitudes).index(mag)
    plt.annotate(name, (mag, brightness[idx]), textcoords="offset points",
                 xytext=(0, 10), ha='center', fontsize=9, color='white')

plt.xlabel('Apparent Magnitude (lower = brighter)', fontsize=12)
plt.ylabel('Brightness (relative to Vega)', fontsize=12)
plt.title('The Magnitude Scale — How Astronomers Measure Starlight', fontsize=14)
plt.grid(axis='y', alpha=0.3)
plt.show()

print("Key insight: the scale is LOGARITHMIC, not linear.")
print(f"  1 magnitude step = {2.512:.3f}x brightness")
print(f"  5 magnitude steps = {2.512**5:.0f}x brightness")
print(f"  Sun (mag -26.7) vs Sirius (mag -1.5) = {2.512**25.2:.0e}x brighter")`,
      challenge: 'The full Moon has apparent magnitude −12.7. How many times brighter is the Sun (magnitude −26.7) than the full Moon? Calculate 2.512^14 in your code.',
      successHint: 'You just learned the foundation of observational astronomy. Every telescope measurement, every star catalogue, every brightness comparison uses this magnitude system — a scale so clever it has lasted 2,000 years.',
    },
    {
      title: 'Planetary conjunctions — when worlds align',
      concept: `One leading theory for the Star of Bethlehem is a **planetary conjunction** — when two planets appear very close together in the sky, sometimes merging into a single brilliant point of light.

In 7 BCE, Jupiter and Saturn had a **triple conjunction** in the constellation Pisces — they appeared close together three times in one year (May, September, and December). This is rare: it happens only every ~900 years.

Why does this happen? Because the planets orbit at different speeds. Jupiter takes **11.86 years** to orbit the Sun. Saturn takes **29.46 years**. From Earth, we see them move against the background stars at different rates. Occasionally, Earth overtakes Jupiter while Jupiter overtakes Saturn, creating the visual alignment.

The code below simulates planetary positions over time and identifies when conjunctions occur. You’ll use trigonometry to convert orbital periods into angular positions.`,
      analogy: 'Imagine two runners on a circular track. The fast one (Jupiter) laps the slow one (Saturn) every so often. From the spectator stands (Earth), they occasionally appear to be right next to each other, even though they are on completely different parts of the track. That moment of overlap is a conjunction.',
      storyConnection: 'Johannes Kepler himself — the astronomer who discovered the laws of planetary motion — calculated that a Jupiter-Saturn conjunction occurred around the time of Jesus’s birth and proposed it as the Star of Bethlehem in 1614. The conjunction of the two largest planets would have been enormously significant to ancient astrologers: Jupiter represented kingship, Saturn represented the land of Israel in Babylonian astrology, and Pisces represented the end of an age.',
      checkQuestion: 'If Jupiter orbits in 11.86 years and Saturn in 29.46 years, how often do they appear to meet in the sky?',
      checkAnswer: 'About every 19.86 years. The synodic period formula is: 1/P = 1/P_Jupiter − 1/P_Saturn = 1/11.86 − 1/29.46 = 0.0503 per year. So P ≈ 19.86 years between conjunctions. A TRIPLE conjunction (three meetings in one year due to retrograde motion) is much rarer — roughly every 900 years.',
      codeIntro: 'Simulate Jupiter and Saturn orbits and find their conjunctions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Orbital periods in years
P_jupiter = 11.86
P_saturn = 29.46

# Simulate 100 years of orbital angles (as seen from Sun)
years = np.linspace(0, 100, 10000)
angle_j = (360 / P_jupiter) * years % 360  # degrees
angle_s = (360 / P_saturn) * years % 360

# Angular separation (simplified — from Sun's perspective)
separation = np.abs(angle_j - angle_s)
separation = np.minimum(separation, 360 - separation)  # wrap around

# Find conjunctions (separation < 10 degrees)
conjunctions = years[separation < 5]

plt.figure(figsize=(10, 5))
plt.plot(years, separation, linewidth=1, color='#a78bfa', alpha=0.7)
plt.axhline(5, color='#fbbf24', linewidth=1, linestyle='--', label='Conjunction threshold (5°)')
plt.scatter(conjunctions, np.full_like(conjunctions, 0), color='#fbbf24', s=30, zorder=5, label='Conjunctions')

plt.xlabel('Years from start', fontsize=12)
plt.ylabel('Angular separation (°)', fontsize=12)
plt.title('Jupiter-Saturn Separation Over 100 Years', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.ylim(-5, 185)
plt.show()

gaps = np.diff(conjunctions[conjunctions > 1])
if len(gaps) > 0:
    print(f"Average time between conjunctions: {np.mean(gaps):.1f} years")
print(f"Number of conjunctions in 100 years: {len(set(conjunctions.astype(int)))}")`,
      challenge: 'Add Mars to the simulation (orbital period 1.88 years). When do all three planets align within 10 degrees? How rare is a triple-planet conjunction?',
      successHint: 'You have simulated the actual mechanics behind the Star of Bethlehem hypothesis. The conjunction of Jupiter and Saturn is governed by simple orbital periods — no mystery, just geometry and time.',
    },
    {
      title: 'Finding your way by the stars — celestial navigation basics',
      concept: `The Magi traveled from Persia (modern Iran) to Bethlehem — a journey of roughly 1,500 km across desert. How did they navigate without GPS? **Celestial navigation** — using the positions of stars to determine location.

The key principle: **the altitude of Polaris above the horizon equals your latitude**. If Polaris is 32° above the horizon, you are at 32° North latitude. This works because Polaris sits almost directly above the North Pole, so as you walk north, it rises; as you walk south, it sinks.

For longitude (east-west position), navigators measured the **time** when specific stars crossed the highest point in the sky (the **meridian**). Comparing this to the expected time at a reference location gives the east-west difference.

The code below calculates Polaris altitude for different latitudes and shows how the Magi could track their progress.`,
      analogy: 'Imagine a lighthouse on a very tall hill. The further away you are, the lower it appears above the horizon. If you know the lighthouse’s true height and measure its apparent angle, you can calculate your distance. Polaris is a cosmic lighthouse — its apparent height above the horizon tells you how far north you are.',
      storyConnection: 'The Gospel says the Magi followed the star "until it came to rest over the place where the child was." In navigation terms, they were tracking their latitude by Polaris and watching for a specific celestial event (the conjunction) to appear in the direction of Bethlehem. Ancient Persian astronomers were among the world’s best — they had star catalogues accurate to 0.5 degrees.',
      checkQuestion: 'If you are at the North Pole, where is Polaris? At the Equator?',
      checkAnswer: 'At the North Pole (90° N), Polaris is directly overhead — 90° above the horizon, at the zenith. At the Equator (0° N), Polaris sits right on the horizon at 0° altitude. South of the Equator, you cannot see Polaris at all — it is below the horizon. This is why Southern Hemisphere navigators used the Southern Cross instead.',
      codeIntro: 'Calculate Polaris altitude for different latitudes along the Magi’s route.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# The Magi's route: Persia (Tehran ~35.7°N) to Bethlehem (~31.7°N)
latitudes = np.linspace(20, 45, 100)
polaris_altitude = latitudes  # altitude = latitude (the key rule!)

# Key cities along the route
cities = [
    ('Babylon', 32.5, 'Starting point (scholars/astronomers)'),
    ('Palmyra', 34.5, 'Desert trading post'),
    ('Damascus', 33.5, 'Major city on the route'),
    ('Jerusalem', 31.8, 'King Herod\\'s palace'),
    ('Bethlehem', 31.7, 'Destination'),
]

plt.figure(figsize=(10, 5))
plt.plot(latitudes, polaris_altitude, linewidth=2.5, color='#fbbf24', label='Polaris altitude = latitude')
plt.fill_between(latitudes, 0, polaris_altitude, alpha=0.1, color='#fbbf24')

for name, lat, desc in cities:
    plt.scatter(lat, lat, s=60, zorder=5, color='#67e8f9')
    plt.annotate(name, (lat, lat), textcoords="offset points",
                 xytext=(8, 8), fontsize=9, color='white')

plt.xlabel('Latitude (° North)', fontsize=12)
plt.ylabel('Polaris altitude above horizon (°)', fontsize=12)
plt.title('The Magi\\'s GPS: Polaris Height = Latitude', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print("Route summary:")
for name, lat, desc in cities:
    print(f"  {name:12s}: {lat:.1f}°N — Polaris at {lat:.1f}° above horizon")
print()
print("The Magi traveled roughly 4° of latitude south.")
print("They could verify their progress every clear night.")`,
      challenge: 'Add the altitude of a second navigation star — Vega — which has a declination of +38.8°. Its maximum altitude at any latitude equals 90° − |latitude − 38.8°|. Plot both Polaris and Vega on the same chart. Why would two stars be better than one for navigation?',
      successHint: 'Celestial navigation is geometry applied to the sky. The principle — Polaris altitude equals latitude — was used by sailors, traders, and travelers for thousands of years. The Magi were among the most skilled navigators of the ancient world.',
    },
    {
      title: 'Kepler’s laws — why planets move the way they do',
      concept: `Johannes Kepler (1571–1630) — the same astronomer who investigated the Star of Bethlehem — discovered three laws that govern how every planet orbits every star:

**Law 1: Ellipses.** Planets orbit in ellipses (ovals) with the Sun at one **focus**, not the center. This means planets are sometimes closer to the Sun (perihelion) and sometimes farther (aphelion).

**Law 2: Equal areas.** A line from the Sun to a planet sweeps out equal areas in equal times. Near the Sun, the planet moves fast (short, fat triangle). Far from the Sun, it moves slowly (long, thin triangle). Same area, different shape.

**Law 3: The period–distance relationship.** T² ∝ a³ — the square of a planet’s orbital period is proportional to the cube of its average distance from the Sun.

The code below verifies Kepler’s third law using real solar system data.`,
      analogy: 'Imagine swinging a ball on a string in a circle. Now imagine the string is elastic — sometimes it stretches (planet far from Sun, moving slowly) and sometimes it contracts (planet near Sun, moving fast). The ball never stops, but it speeds up and slows down as the string length changes. That’s an elliptical orbit.',
      storyConnection: 'Kepler wrote a book called "De Stella Nova" (On the New Star) in 1606, studying a bright supernova. His interest in unusual celestial events led him to investigate the Star of Bethlehem. He used his own laws of planetary motion to calculate backward and identify the 7 BCE Jupiter-Saturn conjunction as the most likely candidate.',
      checkQuestion: 'Earth orbits at 1 AU and takes 1 year. Jupiter orbits at 5.2 AU. Using T² = a³, what is Jupiter’s orbital period?',
      checkAnswer: 'T² = 5.2³ = 140.6. So T = √140.6 ≈ 11.86 years. This matches perfectly! Kepler’s third law predicts Jupiter’s period from its distance alone — no need to watch it for 12 years. Newton later showed WHY this law works: it comes directly from the law of gravity.',
      codeIntro: 'Verify Kepler’s Third Law with real solar system data.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Real solar system data
planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn']
a_AU = np.array([0.387, 0.723, 1.000, 1.524, 5.203, 9.537])  # semi-major axis
T_years = np.array([0.241, 0.615, 1.000, 1.881, 11.86, 29.46])  # orbital period

# Kepler's 3rd law: T^2 should equal a^3 (in AU and years)
T_squared = T_years ** 2
a_cubed = a_AU ** 3

plt.figure(figsize=(10, 5))
plt.scatter(a_cubed, T_squared, s=80, color='#fbbf24', zorder=5)

# Perfect line T^2 = a^3
x_line = np.linspace(0, a_cubed[-1] * 1.1, 100)
plt.plot(x_line, x_line, color='#67e8f9', linewidth=2, linestyle='--', label='T² = a³ (perfect)')

for i, name in enumerate(planets):
    plt.annotate(name, (a_cubed[i], T_squared[i]), textcoords="offset points",
                 xytext=(8, 8), fontsize=10, color='white')

plt.xlabel('a³ (AU³)', fontsize=12)
plt.ylabel('T² (years²)', fontsize=12)
plt.title('Kepler\\'s Third Law: T² = a³', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print("Planet       a (AU)    T (yr)    a³        T²        Ratio T²/a³")
for i in range(len(planets)):
    ratio = T_squared[i] / a_cubed[i]
    print(f"  {planets[i]:10s} {a_AU[i]:7.3f}  {T_years[i]:7.3f}  {a_cubed[i]:9.3f}  {T_squared[i]:9.3f}  {ratio:.4f}")
print()
print("The ratio T²/a³ ≈ 1.000 for every planet. That\\'s Kepler\\'s law.")`,
      challenge: 'Add Uranus (a = 19.19 AU, T = 84.01 years) and Neptune (a = 30.07 AU, T = 164.8 years) to the plot. Do they still fall on the same line? Try predicting the period of an asteroid at 2.8 AU.',
      successHint: 'Kepler’s third law connects time and space with a single equation. It predicted Neptune’s existence before anyone saw it, and it is used today to calculate orbits of exoplanets around distant stars.',
    },
    {
      title: 'Apparent vs absolute magnitude — how far away is that star?',
      concept: `A candle 1 metre away looks bright. The same candle 100 metres away looks dim. Stars work the same way. The brightness you see from Earth is called **apparent magnitude**. But the true luminosity of the star is measured by its **absolute magnitude** — how bright it would look from a standard distance of 10 parsecs (32.6 light-years).

The relationship between the two is:

**m − M = 5 × log₁₀(d/10)**

where m = apparent magnitude, M = absolute magnitude, d = distance in parsecs.

This is called the **distance modulus**. If you know both m and M, you can calculate the distance. If you know m and the distance, you can find M.

The code below compares apparent and absolute magnitudes for several famous stars and calculates how far away they are.`,
      analogy: 'Imagine two streetlights. One is a weak 40-watt bulb close to you. The other is a powerful 1000-watt floodlight far away. From where you stand, they might look equally bright. Apparent magnitude is how bright they LOOK. Absolute magnitude is how powerful they actually ARE. The distance modulus connects the two.',
      storyConnection: 'The Magi had to distinguish between stars that appeared bright because they were close and stars that appeared bright because they were genuinely luminous. A nearby nova and a distant supernova can have the same apparent magnitude but vastly different absolute magnitudes — and therefore vastly different scientific significance.',
      checkQuestion: 'Sirius has apparent magnitude −1.46 and absolute magnitude +1.42. Is it intrinsically bright, or just close to us?',
      checkAnswer: 'It is mainly close to us! At 2.64 parsecs (8.6 light-years), Sirius is one of our nearest stellar neighbors. Its absolute magnitude of +1.42 means it is only about 25 times more luminous than the Sun. Compare Rigel: apparent magnitude +0.13 (dimmer than Sirius) but absolute magnitude −7.0 (a staggering 120,000 times more luminous than the Sun). Rigel is intrinsically brilliant; Sirius is a nearby modest star.',
      codeIntro: 'Calculate distances to famous stars using the distance modulus.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Famous stars: name, apparent mag, absolute mag
stars = [
    ('Sun', -26.74, 4.83, 0.0000048),  # 1 AU in parsecs
    ('Sirius', -1.46, 1.42, 2.64),
    ('Canopus', -0.74, -5.53, 95),
    ('Vega', 0.03, 0.58, 7.68),
    ('Polaris', 1.98, -3.64, 133),
    ('Betelgeuse', 0.42, -5.85, 200),
    ('Rigel', 0.13, -7.0, 265),
]

names = [s[0] for s in stars]
apparent = np.array([s[1] for s in stars])
absolute = np.array([s[2] for s in stars])
distances = np.array([s[3] for s in stars])

# Calculate distance from distance modulus: d = 10^((m-M+5)/5)
d_calc = 10 ** ((apparent - absolute + 5) / 5)

plt.figure(figsize=(10, 5))
colors = ['#fbbf24', '#67e8f9', '#a78bfa', '#3b82f6', '#94a3b8', '#ef4444', '#6366f1']
plt.scatter(apparent[1:], absolute[1:], s=80, c=colors[1:], zorder=5)

for i in range(1, len(stars)):
    plt.annotate(names[i], (apparent[i], absolute[i]), textcoords="offset points",
                 xytext=(8, 8), fontsize=9, color='white')

plt.xlabel('Apparent Magnitude (how bright it LOOKS)', fontsize=12)
plt.ylabel('Absolute Magnitude (how bright it IS)', fontsize=12)
plt.title('Apparent vs Absolute Magnitude', fontsize=14)
plt.gca().invert_xaxis()
plt.gca().invert_yaxis()
plt.grid(alpha=0.3)
plt.show()

print("Star         Apparent  Absolute  Distance    Calculated")
for i in range(len(stars)):
    print(f"  {names[i]:12s} {apparent[i]:+6.2f}    {absolute[i]:+6.2f}    {distances[i]:7.1f} pc   {d_calc[i]:7.1f} pc")
print()
print("Stars in the upper-right are faint AND dim (dwarf stars).")
print("Stars in the lower-left are bright AND luminous (giants).")`,
      challenge: 'A star has apparent magnitude +3.0 and you measure its distance as 50 parsecs. What is its absolute magnitude? Is it more or less luminous than the Sun (M = +4.83)?',
      successHint: 'The distance modulus is how astronomers measure the universe. It connects what you see (apparent) to what is real (absolute), using the known relationship between brightness and distance.',
    },
    {
      title: 'Simulating the night sky — plotting star positions',
      concept: `Time to combine everything. In this exercise you will plot a section of the night sky as it appeared from Bethlehem around 7 BCE, showing the Jupiter-Saturn conjunction.

Stars are located on the sky using two coordinates: **Right Ascension** (RA, measured in hours from 0 to 24, like a clock) and **Declination** (Dec, measured in degrees, like latitude on Earth).

The code creates a star chart with background stars of various brightnesses, then adds Jupiter and Saturn at their conjunction positions. You will see how two bright planets close together would dominate the sky — exactly what the Magi would have seen.

This is a simplified version of what planetarium software does: convert catalogue coordinates into a visual map of the sky.`,
      analogy: 'Right Ascension and Declination are like longitude and latitude on Earth, but projected onto the sky. RA is the east-west coordinate (measured in hours because the sky rotates once in 24 hours). Dec is the north-south coordinate (measured in degrees, with +90° at the North Celestial Pole). Together they uniquely locate any object in the sky.',
      storyConnection: 'Ancient astronomers divided the sky into constellations and catalogued star positions with remarkable accuracy. The Magi would have known the normal positions of Jupiter and Saturn to within a degree. When both planets appeared together in Pisces — a constellation they associated with significant change — they interpreted it as a cosmic sign.',
      checkQuestion: 'If two stars are separated by 1° in the sky, how does that compare to the apparent size of the full Moon?',
      checkAnswer: 'The full Moon is about 0.5° in diameter. So two stars 1° apart are separated by about two Moon-widths. During the 7 BCE conjunction, Jupiter and Saturn came within about 1° of each other — close enough that to the naked eye, they appeared to nearly merge into a single brilliant object.',
      codeIntro: 'Plot a star chart showing the Jupiter-Saturn conjunction of 7 BCE.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Generate random background stars
np.random.seed(42)
n_stars = 200
ra_stars = np.random.uniform(22, 26, n_stars) % 24  # RA in hours (Pisces region)
dec_stars = np.random.uniform(-15, 25, n_stars)       # Dec in degrees
mag_stars = np.random.uniform(2, 6, n_stars)           # magnitudes 2-6

# Size proportional to brightness (lower mag = bigger dot)
sizes = (7 - mag_stars) ** 2 * 2

# Jupiter and Saturn positions during conjunction (approximate)
jupiter_ra, jupiter_dec = 23.8, -4.5   # in Pisces
saturn_ra, saturn_dec = 23.9, -4.0     # very close!

plt.figure(figsize=(10, 7), facecolor='#0f172a')
ax = plt.gca()
ax.set_facecolor('#0f172a')

# Background stars
plt.scatter(ra_stars, dec_stars, s=sizes, color='white', alpha=0.5, marker='.')

# Jupiter
plt.scatter(jupiter_ra, jupiter_dec, s=200, color='#f59e0b', zorder=5, marker='*')
plt.annotate('Jupiter', (jupiter_ra, jupiter_dec), textcoords="offset points",
             xytext=(12, -12), fontsize=11, color='#f59e0b', fontweight='bold')

# Saturn
plt.scatter(saturn_ra, saturn_dec, s=120, color='#a78bfa', zorder=5, marker='*')
plt.annotate('Saturn', (saturn_ra, saturn_dec), textcoords="offset points",
             xytext=(12, 8), fontsize=11, color='#a78bfa', fontweight='bold')

# Circle showing how close they appear
circle = plt.Circle((23.85, -4.25), 0.8, fill=False, color='#67e8f9',
                     linewidth=1, linestyle='--', alpha=0.5)
ax.add_patch(circle)
plt.annotate('~1° separation', (23.85, -3.2), ha='center',
             fontsize=9, color='#67e8f9')

plt.xlabel('Right Ascension (hours)', fontsize=12, color='white')
plt.ylabel('Declination (degrees)', fontsize=12, color='white')
plt.title('The Sky Over Bethlehem, 7 BCE — Pisces Region', fontsize=14, color='white')
ax.tick_params(colors='white')
plt.gca().invert_xaxis()  # RA increases right to left
plt.grid(alpha=0.15, color='white')
plt.show()

print("Jupiter (mag ≈2.0) and Saturn (mag ≈0.5) together would appear")
print("as the brightest object in this region of the sky.")
print("To the Magi, this conjunction in Pisces was unmistakable.")`,
      challenge: 'Add Mars to the star chart at RA=0.5h, Dec=+2°, magnitude +1.0. How does the sky look with three planets visible? Try adding constellation lines for Pisces (a rough V-shape).',
      successHint: 'You have built a basic planetarium. Professional star charts use the same coordinate system (RA and Dec) and the same magnitude-to-size mapping. From here, you could build interactive sky maps, predict eclipses, or plan telescope observations.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Introduction to astronomy with Python</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for astronomical calculations. Click to start.</p>
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
            diagram={[BethlehemMagnitudeDiagram, BethlehemConjunctionDiagram, BethlehemCelestialNavDiagram, BethlehemKeplerDiagram, OrbitalMechanicsDiagram, LatLongGridDiagram][i] ? createElement([BethlehemMagnitudeDiagram, BethlehemConjunctionDiagram, BethlehemCelestialNavDiagram, BethlehemKeplerDiagram, OrbitalMechanicsDiagram, LatLongGridDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
