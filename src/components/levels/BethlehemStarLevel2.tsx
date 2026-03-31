import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import BethlehemMagnitudeDiagram from '../diagrams/BethlehemMagnitudeDiagram';
import BethlehemConjunctionDiagram from '../diagrams/BethlehemConjunctionDiagram';
import BethlehemCelestialNavDiagram from '../diagrams/BethlehemCelestialNavDiagram';
import BethlehemKeplerDiagram from '../diagrams/BethlehemKeplerDiagram';
import OrbitalMechanicsDiagram from '../diagrams/OrbitalMechanicsDiagram';
import LatLongGridDiagram from '../diagrams/LatLongGridDiagram';

export default function BethlehemStarLevel2() {
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
      title: 'The inverse square law — how brightness falls with distance',
      concept: `In Level 1 you learned the magnitude system. Now let’s understand the physics behind it: the **inverse square law**.

Light radiates outward from a star in all directions, like an expanding sphere. At distance d, that light is spread over a sphere of area 4πd². Double the distance and the sphere has 4× the area — so each square metre receives only 1/4 the light.

**Brightness ∝ 1/d²**

This is why magnitude differences translate to distance: the distance modulus formula m − M = 5 log(d/10) is a direct consequence of the inverse square law. The factor of 5 comes from the magnitude system’s definition (5 magnitudes = 100× brightness = 10× distance).

The code builds the inverse square law from scratch and shows how it governs everything from starlight to navigation beacons.`,
      analogy: 'Spray paint from a can. Hold the can close to the wall and you get a bright, concentrated dot. Move twice as far away and the paint spreads over four times the area — the colour is four times fainter. That’s the inverse square law. Stars are cosmic spray cans, and light is their paint.',
      storyConnection: 'The Magi needed to distinguish a bright-but-nearby object (like a comet) from a brilliant-but-distant one (like a supernova). The inverse square law governs this distinction. Jupiter is about 5 AU away; the nearest bright star is 8.6 light-years away. That factor-of-a-million distance difference is why planets and stars can appear equally bright.',
      checkQuestion: 'If you move a lamp from 1 metre away to 3 metres away, how much dimmer does it appear?',
      checkAnswer: '9 times dimmer. Brightness falls as 1/d². At 3 metres, d² = 9, so brightness = 1/9 of the original. This is why car headlights that blind you at 10 metres are barely visible at 300 metres — the brightness dropped by (300/10)² = 900 times.',
      codeIntro: 'Build the inverse square law and connect it to the magnitude system.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Distance in parsecs
d = np.linspace(1, 100, 500)

# Brightness relative to 10 parsecs (standard distance)
brightness = (10 / d) ** 2

# Convert to magnitude difference
mag_diff = -2.5 * np.log10(brightness)  # distance modulus

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

# Left: inverse square law
ax1.plot(d, brightness, linewidth=2.5, color='#fbbf24')
ax1.fill_between(d, 0, brightness, alpha=0.1, color='#fbbf24')
ax1.set_xlabel('Distance (parsecs)', fontsize=12)
ax1.set_ylabel('Relative brightness', fontsize=12)
ax1.set_title('Inverse Square Law: B ∝ 1/d²', fontsize=13)
ax1.axhline(1, color='#67e8f9', linewidth=1, linestyle='--', alpha=0.5, label='10 pc (standard)')
ax1.legend(fontsize=9)
ax1.grid(alpha=0.3)

# Right: distance modulus
ax2.plot(d, mag_diff, linewidth=2.5, color='#a78bfa')
ax2.set_xlabel('Distance (parsecs)', fontsize=12)
ax2.set_ylabel('m − M (magnitudes)', fontsize=12)
ax2.set_title('Distance Modulus: m − M = 5 log(d/10)', fontsize=13)
ax2.axhline(0, color='#67e8f9', linewidth=1, linestyle='--', alpha=0.5, label='10 pc reference')
ax2.legend(fontsize=9)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("At 10 pc: brightness = 1.0, distance modulus = 0")
print(f"At 100 pc: brightness = {(10/100)**2:.4f}, modulus = {5*np.log10(100/10):.2f}")
print(f"At 1 pc: brightness = {(10/1)**2:.1f}, modulus = {5*np.log10(1/10):.2f}")`,
      challenge: 'Calculate the distance modulus for the Andromeda galaxy (770,000 parsecs). How much fainter does a star in Andromeda appear compared to the same star at 10 parsecs?',
      successHint: 'The inverse square law is one of the most universal laws in physics. It governs light, gravity, sound, radiation — anything that spreads out from a point source. Mastering it is essential for all of astronomy.',
    },
    {
      title: 'Retrograde motion — why planets appear to move backward',
      concept: `Here’s something that would have amazed the Magi: sometimes Jupiter and Saturn appear to **move backward** against the stars for a few months, then resume forward motion. This is called **retrograde motion**, and it was one of the biggest puzzles in ancient astronomy.

The explanation is simple: Earth moves faster than the outer planets. As Earth overtakes Jupiter, Jupiter appears to drift backward — just like a slower car appears to move backward when you pass it on the highway.

Retrograde motion is critical for understanding conjunctions. During the 7 BCE triple conjunction, Jupiter went retrograde while near Saturn, causing them to approach, separate, approach again, separate, and approach a third time. This is why the conjunction was triple — retrograde made Jupiter "dance" back and forth near Saturn.

The code simulates retrograde motion by computing the apparent position of an outer planet as seen from Earth.`,
      analogy: 'You are on a merry-go-round (Earth) that spins faster than a second merry-go-round (Jupiter) outside yours. When you are on the side nearest Jupiter, it appears to move backward relative to the distant background. When you swing to the far side, it appears normal again. The "backward" motion is an illusion of perspective — both merry-go-rounds always spin the same direction.',
      storyConnection: 'Ancient geocentric astronomy (Ptolemy) required complicated "epicycles" — circles upon circles — to explain retrograde motion. Copernicus showed in 1543 that if Earth orbits the Sun, retrograde motion is simply a perspective effect. Kepler’s laws completed the explanation by showing exactly how the planets move.',
      checkQuestion: 'If Earth moves faster than Mars, why does Mars appear to go backward during opposition?',
      checkAnswer: 'At opposition, Earth passes between Mars and the Sun. Earth moves at 29.8 km/s while Mars moves at 24.1 km/s. As Earth overtakes Mars on the "inside lane," Mars appears to drift westward against the background stars — like a slow truck appearing to move backward when you pass it. The retrograde lasts about 2.5 months for Mars.',
      codeIntro: 'Simulate apparent retrograde motion of Jupiter as seen from Earth.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Orbital parameters
P_earth = 1.0      # years
P_jupiter = 11.86  # years
R_earth = 1.0      # AU
R_jupiter = 5.2    # AU

# Time array: 3 years at fine resolution
t = np.linspace(0, 3, 3000)

# Positions in 2D (circular orbits for simplicity)
earth_x = R_earth * np.cos(2 * np.pi * t / P_earth)
earth_y = R_earth * np.sin(2 * np.pi * t / P_earth)
jup_x = R_jupiter * np.cos(2 * np.pi * t / P_jupiter)
jup_y = R_jupiter * np.sin(2 * np.pi * t / P_jupiter)

# Vector from Earth to Jupiter
dx = jup_x - earth_x
dy = jup_y - earth_y

# Apparent angle of Jupiter on the sky (ecliptic longitude)
apparent_angle = np.degrees(np.arctan2(dy, dx))

# Unwrap for continuity
apparent_angle = np.unwrap(np.radians(apparent_angle))
apparent_angle = np.degrees(apparent_angle)

# Detect retrograde: where the angle decreases
velocity = np.diff(apparent_angle) / np.diff(t)
retro_mask = velocity < 0

plt.figure(figsize=(10, 5))
plt.plot(t[:-1], velocity, linewidth=1.5, color='#a78bfa')
plt.fill_between(t[:-1], velocity, 0, where=retro_mask, alpha=0.3, color='#ef4444', label='Retrograde (moving backward)')
plt.fill_between(t[:-1], velocity, 0, where=~retro_mask, alpha=0.1, color='#4ade80', label='Prograde (normal)')
plt.axhline(0, color='#94a3b8', linewidth=1, linestyle='--')

plt.xlabel('Time (years)', fontsize=12)
plt.ylabel('Apparent angular velocity (°/year)', fontsize=12)
plt.title('Jupiter\\'s Apparent Motion — Retrograde Periods', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

retro_count = np.sum(np.diff(retro_mask.astype(int)) == 1)
print(f"Retrograde episodes in 3 years: {retro_count}")
print("Jupiter goes retrograde roughly once per year")
print("(every time Earth overtakes it on the 'inside lane').")`,
      challenge: 'Modify the code to simulate Saturn’s retrograde motion. Saturn is slower (P = 29.46 years, R = 9.54 AU), so its retrograde should last longer. Compare the retrograde durations of Jupiter and Saturn.',
      successHint: 'Retrograde motion is a beautiful example of how perspective changes perception. The planets never actually move backward — but from our moving platform (Earth), they appear to. This insight ended 1,500 years of epicycle astronomy.',
    },
    {
      title: 'Orbital mechanics — ellipses, eccentricity, and focus',
      concept: `Kepler’s first law says orbits are ellipses. But what exactly IS an ellipse, and how does eccentricity affect planetary motion?

An ellipse has two special points called **foci** (singular: focus). The Sun sits at one focus. The sum of distances from any point on the ellipse to both foci is constant: d1 + d2 = 2a, where a is the semi-major axis.

**Eccentricity** (e) measures how stretched the ellipse is:
- e = 0: perfect circle
- e = 0.5: moderately elongated
- e = 1: parabola (escape trajectory)

Earth’s orbit has e = 0.017 (nearly circular). Mars has e = 0.093 (noticeably oval). Comets can have e > 0.9 (extremely elongated).

The code draws ellipses with different eccentricities and computes perihelion and aphelion distances.`,
      analogy: 'Stick two pins in a board, loop a string around them, and draw with a pencil keeping the string taut. The shape you draw is an ellipse. The pins are the foci. Short string = nearly circular (low eccentricity). Long string relative to pin spacing = very circular. Moving the pins far apart = elongated ellipse (high eccentricity).',
      storyConnection: 'Kepler spent years trying to fit Mars’s orbit to a circle. When he finally accepted it was an ellipse, he unlocked all three laws of planetary motion. The eccentricity of Jupiter’s orbit (0.048) and Saturn’s (0.054) determine exactly when and where conjunctions occur — slightly different from what a circular model would predict.',
      checkQuestion: 'Halley’s Comet has eccentricity 0.967. How does its orbit differ from Earth’s?',
      checkAnswer: 'Halley’s orbit is extremely elongated. At perihelion it comes inside Venus’s orbit (0.59 AU). At aphelion it goes beyond Neptune’s orbit (35 AU). Earth’s orbit is nearly circular: perihelion 0.983 AU, aphelion 1.017 AU — only a 3.4% difference. Halley’s has a 98.3% difference between closest and farthest points.',
      codeIntro: 'Draw elliptical orbits with different eccentricities.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def draw_orbit(ax, a, e, color, label):
    """Draw an elliptical orbit with semi-major axis a and eccentricity e."""
    b = a * np.sqrt(1 - e**2)  # semi-minor axis
    c = a * e                   # focus distance from center
    theta = np.linspace(0, 2*np.pi, 500)
    r = a * (1 - e**2) / (1 + e * np.cos(theta))
    x = r * np.cos(theta)
    y = r * np.sin(theta)
    ax.plot(x, y, linewidth=2, color=color, label=f'{label} (e={e})')
    # Mark perihelion and aphelion
    peri = a * (1 - e)
    aph = a * (1 + e)
    ax.plot(peri, 0, 'o', color=color, markersize=5)
    ax.plot(-aph, 0, 'o', color=color, markersize=5, alpha=0.5)

fig, ax = plt.subplots(figsize=(10, 8))

# Sun at origin (focus)
ax.plot(0, 0, 'o', color='#fbbf24', markersize=12, zorder=10)
ax.annotate('Sun', (0, 0), textcoords="offset points", xytext=(15, -5),
            fontsize=11, color='#fbbf24', fontweight='bold')

# Different eccentricities at same semi-major axis
draw_orbit(ax, 5.0, 0.0, '#67e8f9', 'Circle')
draw_orbit(ax, 5.0, 0.2, '#3b82f6', 'Mild')
draw_orbit(ax, 5.0, 0.5, '#a78bfa', 'Moderate')
draw_orbit(ax, 5.0, 0.8, '#ef4444', 'High')

ax.set_aspect('equal')
ax.set_xlabel('Distance (AU)', fontsize=12)
ax.set_ylabel('Distance (AU)', fontsize=12)
ax.set_title('Eccentricity: How Stretched Is the Orbit?', fontsize=14)
ax.legend(fontsize=10, loc='upper right')
ax.grid(alpha=0.2)
plt.show()

# Real solar system eccentricities
data = [('Earth', 1.0, 0.017), ('Mars', 1.52, 0.093),
        ('Jupiter', 5.20, 0.048), ('Saturn', 9.54, 0.054),
        ('Halley', 17.8, 0.967)]
print("Planet       a (AU)   e        Perihelion  Aphelion")
for name, a, e in data:
    peri = a * (1 - e)
    aph = a * (1 + e)
    print(f"  {name:10s} {a:6.2f}   {e:.3f}    {peri:8.3f}    {aph:8.3f}")`,
      challenge: 'Draw the actual orbits of Earth, Mars, Jupiter, and Saturn on the same plot, using their real semi-major axes and eccentricities. Which orbit looks the most elliptical?',
      successHint: 'Eccentricity is the single number that distinguishes circular orbits from elongated comet trails. Every orbit in the solar system — from Mercury’s e=0.206 to Neptune’s e=0.009 — is uniquely described by just two numbers: a and e.',
    },
    {
      title: 'The equation of time — why sundials disagree with clocks',
      concept: `Ancient navigators like the Magi used the Sun’s position to tell time. But there’s a complication: the Sun does not move at a constant speed across the sky. Some days it’s ahead of schedule, some days behind. The difference between "sundial time" and "clock time" is called the **equation of time**.

Two effects cause this:
1. **Earth’s elliptical orbit** (Kepler’s 2nd law): Earth moves faster at perihelion (January) and slower at aphelion (July).
2. **Earth’s axial tilt** (23.44°): the Sun’s path across the sky is not parallel to the equator.

These combine to create a variation of up to ±16 minutes throughout the year. For celestial navigation, ignoring this correction means your longitude calculation could be wrong by up to 4 degrees — a serious error.

The code computes the equation of time from orbital mechanics.`,
      analogy: 'Imagine a clock with a second hand that runs slightly fast in winter and slightly slow in summer. After a year it’s back to the correct time, but at any given moment it’s off by up to 16 minutes. The Sun is that clock. Earth’s elliptical orbit and tilted axis make the "solar clock" run unevenly.',
      storyConnection: 'The Magi measured time by the Sun’s position. If they used noon (Sun at highest point) as a reference for calculating longitude, they would need the equation of time correction. Persian astronomers had tables for this — remarkably accurate given their tools. A 16-minute error in noon timing translates to a 4-degree longitude error, which over desert terrain could mean missing your destination by 400 km.',
      checkQuestion: 'On what date does the equation of time reach its maximum value? What is happening astronomically?',
      checkAnswer: 'The maximum is around November 3, when the equation of time reaches about +16.5 minutes (sundial ahead of clock). This is when both effects (orbital eccentricity and axial tilt) add constructively. The minimum is around February 12 at about −14.2 minutes. The equation crosses zero four times per year.',
      codeIntro: 'Compute the equation of time from orbital mechanics.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Day of year
days = np.arange(1, 366)
B = 2 * np.pi * (days - 81) / 365  # orbital angle (approximate)

# Equation of time (Spencer's formula, in minutes)
# Two components:
# 1. Eccentricity effect (Earth's elliptical orbit)
ecc_effect = 7.53 * np.cos(B) + 9.87 * np.sin(2*B)

# 2. Obliquity effect (axial tilt)
obl_effect = -1.5 * np.sin(B) - 3.53 * np.cos(2*B)

# Combined equation of time
eot = ecc_effect + obl_effect  # simplified approximation

# More accurate: Spencer (1971)
eot_spencer = (9.87 * np.sin(2*B) - 7.53 * np.cos(B)
               - 1.5 * np.sin(B))

plt.figure(figsize=(10, 5))
plt.plot(days, eot_spencer, linewidth=2.5, color='#fbbf24', label='Equation of Time')
plt.fill_between(days, 0, eot_spencer, where=eot_spencer > 0, alpha=0.2, color='#f59e0b', label='Sundial ahead')
plt.fill_between(days, 0, eot_spencer, where=eot_spencer < 0, alpha=0.2, color='#3b82f6', label='Sundial behind')
plt.axhline(0, color='#94a3b8', linewidth=1, linestyle='--')

# Mark key dates
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
month_days = [15, 46, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349]
plt.xticks(month_days, months)

plt.xlabel('Month', fontsize=12)
plt.ylabel('Equation of Time (minutes)', fontsize=12)
plt.title('Why Sundials Disagree with Clocks', fontsize=14)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

max_idx = np.argmax(eot_spencer)
min_idx = np.argmin(eot_spencer)
print(f"Maximum: +{eot_spencer[max_idx]:.1f} min on day {days[max_idx]} (~Nov {days[max_idx]-305})")
print(f"Minimum: {eot_spencer[min_idx]:.1f} min on day {days[min_idx]} (~Feb {days[min_idx]-31})")
print()
print("For navigation: 1 minute of time error = 0.25° longitude error")
print(f"Max error: {abs(eot_spencer[max_idx]) * 0.25:.1f}° longitude = ~{abs(eot_spencer[max_idx]) * 0.25 * 111 * np.cos(np.radians(32)):.0f} km at Bethlehem\\'s latitude")`,
      challenge: 'Plot the eccentricity component and obliquity component separately. Which one contributes more to the equation of time? When do they reinforce each other, and when do they cancel?',
      successHint: 'The equation of time connects orbital mechanics (Kepler’s laws) to practical navigation. It explains why the earliest sunset does not fall on the shortest day, why the latest sunrise does not match the winter solstice, and why ancient astronomers needed mathematical tables to navigate accurately.',
    },
    {
      title: 'Precession — the 26,000-year wobble of Earth’s axis',
      concept: `Here’s a fact that would surprise the Magi: the "fixed" stars are not fixed. Earth’s axis slowly wobbles like a tilted spinning top, tracing a circle in the sky every **26,000 years**. This is called **precession**.

Today, Polaris is our North Star. In 3000 BCE (when the pyramids were built), the North Star was **Thuban** in Draco. In 14,000 CE, it will be **Vega** in Lyra.

Precession means that the constellations visible at any time of year slowly shift. The "first point of Aries" (where the Sun crosses the equator at the spring equinox) has precessed into Pisces — which is why astrologers still say the equinox is in Aries even though it hasn’t been for 2,000 years.

The code simulates the precession circle and tracks which star is "North Star" at different epochs.`,
      analogy: 'Spin a top on a table. It does not spin perfectly upright — its axis traces a slow circle. That wobble is precession. Earth’s axis does the same thing, but very slowly: one complete wobble takes 26,000 years. The cause is the gravitational pull of the Sun and Moon on Earth’s equatorial bulge.',
      storyConnection: 'Precession means the sky the Magi saw was slightly different from what we see today. In 2,000 years, the constellations have shifted about 28 degrees along the ecliptic. The vernal equinox has moved from Aries into Pisces. Some scholars argue that the Magi’s association of Pisces with a "new age" was connected to the precession of the equinoxes — they were living through the transition from the Age of Aries to the Age of Pisces.',
      checkQuestion: 'If precession moves the equinox by 1° every 72 years, how far has it moved since 7 BCE?',
      checkAnswer: 'About 28.2 degrees. (2033 years / 72 years per degree ≈ 28.2°). That’s nearly one full constellation width. Star charts from 7 BCE need to be corrected by this amount before comparing with modern observations. This is why Kepler had to correct for precession when calculating the 7 BCE conjunction.',
      codeIntro: 'Simulate Earth’s precession and track the pole star over 26,000 years.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Precession: Earth's axis traces a circle of radius 23.44°
# around the ecliptic pole every 26,000 years
P_prec = 26000  # years
obliquity = 23.44  # degrees

years = np.linspace(-5000, 25000, 1000)
# Angle of precession (0 = current epoch)
prec_angle = 2 * np.pi * years / P_prec

# North Celestial Pole position (in ecliptic coordinates)
pole_x = obliquity * np.cos(prec_angle)
pole_y = obliquity * np.sin(prec_angle)

# Approximate positions of candidate pole stars (ecliptic coords)
pole_stars = [
    ('Polaris', 0, 23, 2000, '#fbbf24'),      # current
    ('Thuban', -10, 20, -2800, '#a78bfa'),     # Egyptian era
    ('Vega', 15, 15, 14000, '#67e8f9'),        # future
    ('Deneb', 20, 5, 10000, '#3b82f6'),        # intermediate
]

plt.figure(figsize=(8, 8))
plt.plot(pole_x, pole_y, linewidth=1.5, color='#64748b', alpha=0.5)

# Mark current position
now_idx = np.argmin(np.abs(years - 2024))
plt.scatter(pole_x[now_idx], pole_y[now_idx], s=100, color='#ef4444', zorder=10)
plt.annotate('NOW (2024)', (pole_x[now_idx], pole_y[now_idx]),
             textcoords="offset points", xytext=(10, 10), fontsize=10,
             color='#ef4444', fontweight='bold')

# Mark 7 BCE
bce_idx = np.argmin(np.abs(years - (-7)))
plt.scatter(pole_x[bce_idx], pole_y[bce_idx], s=80, color='#fbbf24', zorder=10)
plt.annotate('7 BCE\\n(Star of Bethlehem)', (pole_x[bce_idx], pole_y[bce_idx]),
             textcoords="offset points", xytext=(10, -15), fontsize=9,
             color='#fbbf24')

# Mark key epochs
for name, px, py, yr, color in pole_stars:
    plt.scatter(px, py, s=60, color=color, zorder=8, marker='*')
    plt.annotate(f'{name}\\n({yr})', (px, py), textcoords="offset points",
                 xytext=(10, 5), fontsize=9, color=color)

# Ecliptic pole at center
plt.scatter(0, 0, s=80, color='white', zorder=10, marker='+')
plt.annotate('Ecliptic Pole', (0, 0), textcoords="offset points",
             xytext=(8, -12), fontsize=9, color='white')

plt.xlabel('Degrees', fontsize=12)
plt.ylabel('Degrees', fontsize=12)
plt.title('Precession: Earth\\'s North Pole Traces a Circle in 26,000 Years', fontsize=13)
plt.gca().set_aspect('equal')
plt.grid(alpha=0.2)
plt.show()

print("The North Celestial Pole slowly circles the sky.")
print(f"Rate: 360° / {P_prec} years = {360/P_prec:.4f}°/year = 1° every {P_prec/360:.0f} years")
print()
print("Pole stars through history:")
print("  ~2800 BCE: Thuban (Egyptian pyramids aligned to it)")
print("  ~2024 CE:  Polaris (within 0.7° of true pole)")
print("  ~14000 CE: Vega (will be the pole star)")`,
      challenge: 'Calculate how close Polaris actually is to the true North Celestial Pole today (it’s not exactly on it). If precession moves the pole at a constant rate, when was/will Polaris be closest to the true pole?',
      successHint: 'Precession connects timescales from human history (the Magi’s era) to geological time (26,000 years). It is caused by the same gravitational physics that governs tides and orbital mechanics — the Sun and Moon pulling on Earth’s equatorial bulge.',
    },
    {
      title: 'Building a conjunction predictor — the Magi’s toolkit',
      concept: `Let’s combine orbital mechanics, the inverse square law, and celestial coordinates into a single program: a **conjunction predictor** that calculates when any two planets will appear close together in the sky.

The algorithm:
1. Calculate each planet’s heliocentric position (where it is relative to the Sun)
2. Transform to geocentric position (where it appears from Earth)
3. Convert to ecliptic longitude (position along the zodiac)
4. Find times when the angular separation drops below a threshold

This is a simplified version of what Kepler did by hand in 1614 when he calculated the 7 BCE triple conjunction.`,
      analogy: 'Think of it like predicting when two airplanes, flying different circular routes at different speeds, will appear to be in the same part of the sky from your position on the ground. You need to know each plane’s route (orbit), speed (period), and your own position (Earth’s orbit). The math is the same for planets.',
      storyConnection: 'The Babylonian and Persian astronomical tradition passed down tables that predicted planetary positions decades in advance. The Magi did not stumble upon the Star of Bethlehem by accident — they were trained astronomers who had predicted the conjunction and planned their journey months in advance.',
      checkQuestion: 'Why are triple conjunctions (three meetings in one year) much rarer than single conjunctions?',
      checkAnswer: 'A triple conjunction requires the outer planet to be near opposition (opposite the Sun) during the conjunction, so that retrograde motion carries it backward past the inner planet. The geometry only works when the planets’ positions align with Earth’s position at opposition. For Jupiter-Saturn, this alignment repeats roughly every 900 years.',
      codeIntro: 'Build a conjunction predictor for Jupiter and Saturn.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified orbital model (circular orbits)
def planet_pos(t, a, P):
    """Heliocentric position at time t (years)."""
    angle = 2 * np.pi * t / P
    return a * np.cos(angle), a * np.sin(angle)

def apparent_longitude(t, a_planet, P_planet):
    """Apparent ecliptic longitude from Earth."""
    ex, ey = planet_pos(t, 1.0, 1.0)  # Earth
    px, py = planet_pos(t, a_planet, P_planet)
    return np.degrees(np.arctan2(py - ey, px - ex)) % 360

# Search for conjunctions over 100 years
t = np.linspace(0, 100, 100000)
lon_j = np.array([apparent_longitude(ti, 5.2, 11.86) for ti in t])
lon_s = np.array([apparent_longitude(ti, 9.54, 29.46) for ti in t])

# Angular separation
sep = np.abs(lon_j - lon_s)
sep = np.minimum(sep, 360 - sep)

# Find conjunction events (separation < 2°)
threshold = 2.0
conj_mask = sep < threshold
events = []
in_event = False
for i in range(len(t)):
    if conj_mask[i] and not in_event:
        in_event = True
        start = i
    elif not conj_mask[i] and in_event:
        in_event = False
        min_idx = start + np.argmin(sep[start:i])
        events.append((t[min_idx], sep[min_idx]))

plt.figure(figsize=(12, 5))
plt.plot(t, sep, linewidth=0.5, color='#a78bfa', alpha=0.7)
plt.axhline(threshold, color='#fbbf24', linewidth=1, linestyle='--', label=f'Conjunction threshold ({threshold}°)')

for yr, s in events:
    plt.scatter(yr, s, s=40, color='#fbbf24', zorder=5)

plt.xlabel('Years from start', fontsize=12)
plt.ylabel('Angular separation (°)', fontsize=12)
plt.title('Jupiter-Saturn Conjunction Predictor', fontsize=14)
plt.ylim(-2, 30)
plt.legend(fontsize=10)
plt.grid(alpha=0.3)
plt.show()

print(f"Found {len(events)} conjunctions in 100 years:")
for yr, s in events:
    print(f"  Year {yr:.1f}: minimum separation {s:.2f}°")
if len(events) > 1:
    gaps = [events[i+1][0] - events[i][0] for i in range(len(events)-1)]
    print(f"\\nAverage interval: {np.mean(gaps):.1f} years")`,
      challenge: 'Modify the predictor to also track Mars. Find times when Jupiter, Saturn, and Mars are all within 15° of each other. How rare are triple-planet groupings compared to two-planet conjunctions?',
      successHint: 'You have built a tool that replicates what ancient astronomers did with decades of patient observation. The conjunction predictor combines Kepler’s laws, coordinate geometry, and computational search — a genuine piece of computational astronomy.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Investigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Deeper orbital mechanics and celestial navigation</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for orbital simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            diagram={[BethlehemMagnitudeDiagram, BethlehemConjunctionDiagram, BethlehemKeplerDiagram, OrbitalMechanicsDiagram, BethlehemCelestialNavDiagram, LatLongGridDiagram][i] ? createElement([BethlehemMagnitudeDiagram, BethlehemConjunctionDiagram, BethlehemKeplerDiagram, OrbitalMechanicsDiagram, BethlehemCelestialNavDiagram, LatLongGridDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
