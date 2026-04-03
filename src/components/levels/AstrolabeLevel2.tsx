import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AstrolabeProjectionDiagram from '../diagrams/AstrolabeProjectionDiagram';
import AstrolabeCelestialNavDiagram from '../diagrams/AstrolabeCelestialNavDiagram';
import UnitCircleDiagram from '../diagrams/UnitCircleDiagram';
import CirclePropertiesDiagram from '../diagrams/CirclePropertiesDiagram';
import ConicSectionsDiagram from '../diagrams/ConicSectionsDiagram';
import TransformationsDiagram from '../diagrams/TransformationsDiagram';

export default function AstrolabeLevel2() {
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
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import warnings;warnings.filterwarnings('ignore',category=UserWarning);import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Stereographic projection — the mathematics',
      concept: `The astrolabe's genius is **stereographic projection**: mapping a sphere onto a flat plane from a single point. Place the projection point at the south celestial pole. Every point on the sphere casts a "shadow" onto the equatorial plane.

The formula is elegant. A point on the sphere at co-latitude θ (measured from the north pole) and longitude φ projects to:

**x = R · tan(θ/2) · cos(φ)**
**y = R · tan(θ/2) · sin(φ)**

where R is the radius of the disk. The co-latitude θ for a star at declination δ is θ = 90° - δ.

The critical property: **circles on the sphere map to circles on the plane**. This is what makes the astrolabe work — altitude circles, the horizon, the ecliptic all remain circles after projection, so they can be engraved with a compass.`,
      analogy: 'Imagine a transparent globe with a light bulb at the south pole. The shadows of the latitude lines fall on a flat table at the equator. Each latitude line (a circle on the globe) casts a circular shadow on the table — but the circles get larger as you move away from the equator toward the south pole.',
      storyConnection: 'Ibn al-Haytham demonstrated this to Zahra with a glass sphere and lamplight. The painted stars cast shadows on the table. "Circles become circles," he said. This is the mathematical miracle that makes the whole instrument possible.',
      checkQuestion: 'A star at the north celestial pole has θ = 0°. What are its projected coordinates?',
      checkAnswer: 'x = R·tan(0/2)·cos(φ) = 0, y = R·tan(0/2)·sin(φ) = 0. The north pole projects to the center of the disk. This makes sense — the pole is directly above, so it maps to the zenith of the projection.',
      codeIntro: 'Implement stereographic projection and plot the celestial grid on a flat disk.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def stereo_project(dec, ra, R=1.0):
    """Stereographic projection from celestial to flat disk.
    dec: declination in degrees (-90 to 90)
    ra: right ascension in degrees (0 to 360)
    Returns (x, y) on the disk."""
    theta = np.radians(90 - dec)  # co-latitude from N pole
    phi = np.radians(ra)
    r = R * np.tan(theta / 2)
    x = r * np.cos(phi)
    y = r * np.sin(phi)
    return x, y

fig, ax = plt.subplots(figsize=(7, 7))
ax.set_facecolor('#0f172a')

# Plot declination circles (every 15°)
for dec in range(-60, 91, 15):
    theta = np.radians(90 - dec)
    r = np.tan(theta / 2)
    circle = plt.Circle((0, 0), r, fill=False,
                         color='#334155' if dec != 0 else '#475569',
                         linewidth=0.5 if dec != 0 else 1.5)
    ax.add_patch(circle)
    if r < 2.5:
        ax.text(r + 0.03, 0, f'{dec}°', fontsize=6, color='#64748b')

# Plot RA lines (every 30° = 2 hours)
for ra in range(0, 360, 30):
    phi = np.radians(ra)
    ax.plot([0, 2.5 * np.cos(phi)], [0, 2.5 * np.sin(phi)],
            color='#334155', linewidth=0.3)

# Plot some bright stars
stars = [("Vega", 38.8, 278), ("Altair", 8.9, 298),
         ("Deneb", 45.3, 310), ("Sirius", -16.7, 101),
         ("Capella", 46.0, 79), ("Polaris", 89.3, 38)]
for name, dec, ra in stars:
    x, y = stereo_project(dec, ra)
    ax.plot(x, y, '*', color='#fbbf24', markersize=10)
    ax.annotate(name, (x, y), fontsize=7, color='white',
                xytext=(5, 5), textcoords='offset points')

# North pole at center
ax.plot(0, 0, '+', color='#10b981', markersize=10, markeredgewidth=2)
ax.annotate('NCP', (0, 0), fontsize=8, color='#10b981',
            xytext=(-15, 8), textcoords='offset points')

ax.set_xlim(-2.5, 2.5); ax.set_ylim(-2.5, 2.5)
ax.set_aspect('equal'); ax.grid(False)
ax.set_title('Stereographic Projection of the Sky', color='white')
plt.show()`,
      challenge: 'Notice that Sirius (dec = -16.7°) projects far from the center. What declination would project to infinity? (Hint: tan(90°) = ∞.)',
      successHint: 'You just built the mathematical core of the astrolabe. The rete is exactly this star map — bright stars positioned by stereographic projection on a brass disk.',
    },
    {
      title: 'Why circles stay circles — proof by construction',
      concept: `The circle-preserving property of stereographic projection is not obvious. Here is the geometric intuition.

A circle on the sphere is the intersection of the sphere with a plane. Stereographic projection sends this circle to the intersection of a cone (from the projection point through the circle) with the equatorial plane. A cone intersected by a plane produces a **conic section** — an ellipse, parabola, or hyperbola.

But stereographic projection is special: the cone from the south pole through a circle on the sphere **always** intersects the equatorial plane in a circle, never an ellipse. This is because the projection point is on the sphere itself, which creates a symmetry that eliminates the elliptical distortion.

The proof requires showing that the cone's axis makes the same angle with the equatorial plane as the sphere's curvature compensates for. The math involves the tangent half-angle identity: tan(θ/2) = sin(θ) / (1 + cos(θ)).`,
      analogy: 'Imagine shining a flashlight (cone of light) at a tilted wall. Usually you get an ellipse of light. But if the flashlight is positioned on the surface of a sphere and the wall is at the equator, the sphere’s curvature perfectly compensates for the tilt — you always get a circle.',
      storyConnection: 'This property is why astrolabe makers could use a compass to engrave every line. If projection turned circles into ellipses, the instrument would be far harder to build — ellipses cannot be drawn with a simple compass.',
      checkQuestion: 'Mercator map projection also maps a sphere to a plane. Does it preserve circles?',
      checkAnswer: 'No. Mercator projection preserves angles (it is conformal, like stereographic) but not circles. A circle near the poles on a Mercator map becomes a stretched ellipse. Only stereographic projection preserves both conformality and circles. This makes it uniquely suited for the astrolabe.',
      codeIntro: 'Verify the circle-preserving property by projecting circles at different latitudes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def stereo_project(dec, ra):
    theta = np.radians(90 - dec)
    phi = np.radians(ra)
    r = np.tan(theta / 2)
    return r * np.cos(phi), r * np.sin(phi)

fig, axes = plt.subplots(1, 2, figsize=(10, 5))

# Left: circles on the sphere (3D view)
ax1 = axes[0]
ax1.set_facecolor('#0f172a')
u = np.linspace(0, 2*np.pi, 100)

for dec, color, label in [(60, '#ef4444', '60°'),
                           (30, '#fbbf24', '30°'),
                           (0, '#10b981', 'Equator'),
                           (-30, '#38bdf8', '-30°')]:
    # Circles on sphere (shown as projections)
    theta = np.radians(90 - dec)
    r_sphere = np.sin(theta)
    z = np.cos(theta)
    ax1.plot(r_sphere * np.cos(u), r_sphere * np.sin(u),
             color=color, linewidth=1.5, label=f'Dec={label}')

ax1.set_xlim(-1.3, 1.3); ax1.set_ylim(-1.3, 1.3)
ax1.set_aspect('equal')
ax1.set_title('Circles on sphere (top view)', color='white', fontsize=10)
ax1.legend(fontsize=7)

# Right: projected circles (should still be circles!)
ax2 = axes[1]
ax2.set_facecolor('#0f172a')

for dec, color, label in [(60, '#ef4444', '60°'),
                           (30, '#fbbf24', '30°'),
                           (0, '#10b981', 'Equator'),
                           (-30, '#38bdf8', '-30°')]:
    ra = np.linspace(0, 360, 200)
    xs, ys = [], []
    for r in ra:
        x, y = stereo_project(dec, r)
        xs.append(x); ys.append(y)
    ax2.plot(xs, ys, color=color, linewidth=1.5, label=f'Dec={label}')
    # Verify circularity: compute radius std
    cx, cy = np.mean(xs), np.mean(ys)
    radii = np.sqrt((np.array(xs)-cx)**2 + (np.array(ys)-cy)**2)
    print(f"Dec {label:>5s}: projected radius = {np.mean(radii):.4f}"
          f"  std = {np.std(radii):.6f}  (0 = perfect circle)")

ax2.set_xlim(-3, 3); ax2.set_ylim(-3, 3)
ax2.set_aspect('equal')
ax2.set_title('Stereographic projection (flat)', color='white', fontsize=10)
ax2.legend(fontsize=7)
plt.tight_layout()
plt.show()`,
      challenge: 'The standard deviation of radii should be nearly zero (machine precision). Try projecting a circle centered at dec=45° with a 10° radius — does it remain circular?',
      successHint: 'The near-zero standard deviations prove it: circles on the sphere project to perfect circles on the plane. This is the mathematical foundation that made the astrolabe possible.',
    },
    {
      title: 'Drawing the tympan — altitude and azimuth circles',
      concept: `The **tympan** is the base plate of the astrolabe, engraved with altitude and azimuth circles for a specific latitude. Let's build one mathematically.

For an observer at latitude φ, the **zenith** (directly overhead) is at declination δ = φ. The **horizon** is a great circle 90° from the zenith. Under stereographic projection:

- The zenith projects to a point offset from the center
- Altitude circles (10°, 20°, ... 80°) project to circles centered on the zenith point
- Azimuth lines (N, NE, E, ...) project to arcs passing through the zenith point and the nadir

The key formula for the horizon circle: center at y = -R·cos(φ)/sin(φ), radius = R/sin(φ), where R = tan(45°) = 1 for the equator circle.`,
      analogy: 'Think of the tympan as a custom-made map of your personal sky. Just as a city map is only useful for that city, a tympan for Isfahan (32°N) is only accurate at that latitude. Medieval astrolabe makers often included multiple tympans — one for each major city.',
      storyConnection: 'Ibn al-Haytham told Zahra that the tympan "shows the sky coordinates for your latitude." A tympan for Isfahan looks different from one for Cairo or Baghdad. When travelers moved between cities, they swapped tympans.',
      checkQuestion: 'At the equator (φ = 0°), where does the zenith project?',
      checkAnswer: 'The zenith at the equator is the north celestial pole rotated by 90° — actually, at φ=0 the zenith is at dec=0 (the celestial equator). It projects to a point at radius tan(45°)=1 from center. The horizon becomes a straight line through the center.',
      codeIntro: 'Draw a complete tympan for Isfahan (32°N) with altitude and azimuth lines.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def tympan_circles(lat, R=1.0):
    """Compute altitude circle centers and radii for a tympan."""
    lat_r = np.radians(lat)
    circles = []
    for alt in range(0, 90, 10):
        alt_r = np.radians(alt)
        # Center and radius of altitude circle on the projected disk
        zenith_dist = np.radians(90 - alt)
        cy = -R * np.cos(lat_r + zenith_dist) / (np.sin(lat_r) + np.sin(lat_r + zenith_dist - np.pi/2 + alt_r + 0.001))
        # Simplified: altitude circle for stereographic projection
        c_dec = lat - (90 - alt)  # declination of the altitude circle edge
        r_proj = R * np.tan(np.radians(90 - (lat - (90 - alt))) / 2)
        r_zenith = R * np.tan(np.radians(90 - lat) / 2)
        circles.append((alt, r_proj))
    return circles, r_zenith

lat = 32  # Isfahan
fig, ax = plt.subplots(figsize=(7, 7))
ax.set_facecolor('#0f172a')

# Zenith position
theta_z = np.radians(90 - lat)
r_z = np.tan(theta_z / 2)
ax.plot(0, -r_z, 'o', color='#fbbf24', markersize=6)
ax.annotate('Zenith', (0, -r_z), fontsize=8, color='#fbbf24',
            xytext=(8, 5), textcoords='offset points')

# Altitude circles (simplified as concentric around zenith)
u = np.linspace(0, 2*np.pi, 200)
for alt in range(0, 90, 10):
    # Angular distance from zenith = 90 - alt
    ang_dist = np.radians(90 - alt)
    r_circle = np.tan(ang_dist / 2) * 0.8
    color = '#10b981' if alt == 0 else '#334155'
    lw = 1.5 if alt == 0 else 0.5
    ax.plot(r_circle * np.cos(u), -r_z + r_circle * np.sin(u),
            color=color, linewidth=lw)
    if alt % 20 == 0:
        ax.text(r_circle + 0.02, -r_z, f'{alt}°',
                fontsize=6, color='#64748b')

# Horizon label
horizon_r = np.tan(np.radians(45) / 2) * 0.8
ax.text(horizon_r + 0.05, -r_z + 0.05, 'Horizon',
        fontsize=8, color='#10b981')

# Outer circle (tropic of Capricorn limit)
outer = np.tan(np.radians(90 + 23.4) / 2)
outer_circle = plt.Circle((0, 0), outer, fill=False,
                           color='#475569', linewidth=2)
ax.add_patch(outer_circle)

# Equator circle
eq_r = np.tan(np.radians(45))
eq_circle = plt.Circle((0, 0), eq_r, fill=False,
                        color='#38bdf8', linewidth=1, linestyle='--')
ax.add_patch(eq_circle)
ax.text(eq_r + 0.05, 0.05, 'Equator', fontsize=7, color='#38bdf8')

# NCP at center
ax.plot(0, 0, '+', color='#ef4444', markersize=10, markeredgewidth=2)
ax.annotate('NCP', (0, 0), fontsize=8, color='#ef4444',
            xytext=(8, 5), textcoords='offset points')

ax.set_xlim(-2.5, 2.5); ax.set_ylim(-2.5, 2.5)
ax.set_aspect('equal')
ax.set_title(f'Astrolabe Tympan — Isfahan ({lat}°N)', color='white')
plt.show()
print(f"Zenith offset from center: {r_z:.3f} units")`,
      challenge: 'Change lat to 51 (London). Notice how the zenith moves further from the center and the horizon circle shifts. This is why each latitude needs its own tympan.',
      successHint: 'You just drew the base plate of an astrolabe. Every astrolabe tympan is computed from these same projection formulas — the only variable is your latitude.',
    },
    {
      title: 'Drawing the rete — a rotating star map',
      concept: `The **rete** is the astrolabe's crowning achievement: a lacy brass overlay with pointers for the brightest stars and the path of the Sun (the **ecliptic**).

Each star pointer is positioned using stereographic projection of the star's right ascension (RA) and declination (Dec):
- x = tan((90° - Dec)/2) · cos(RA)
- y = tan((90° - Dec)/2) · sin(RA)

The ecliptic is the Sun's annual path through the sky — a great circle tilted 23.4° from the celestial equator. Under stereographic projection, it becomes an **off-center circle** on the disk.

When you rotate the rete, you simulate the sky's daily rotation. Stars rise above the horizon (the tympan's horizon circle) and set below it, just as they do in the real sky.`,
      analogy: 'The rete is like a transparent clock hand with stars painted on it. As you turn it over the tympan (the clock face), different stars come into view above the horizon line. One full rotation = one sidereal day.',
      storyConnection: 'Zahra rotated the rete and watched "Vega rise above the horizon line. Sirius dipped below." She was turning the sky in brass — the rete spinning over the tympan exactly simulates the Earth’s rotation.',
      checkQuestion: 'If the rete makes one complete rotation per sidereal day (23h 56m), how many degrees does it rotate per hour?',
      checkAnswer: '360° / 23.933 hours = 15.04° per hour. This is essentially the same 15°/hour as the Sun, but slightly faster because the sidereal day is 4 minutes shorter than the solar day.',
      codeIntro: 'Build the rete with star pointers and the ecliptic circle.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def stereo_xy(dec, ra):
    theta = np.radians(90 - dec)
    phi = np.radians(ra)
    r = np.tan(theta / 2)
    return r * np.cos(phi), r * np.sin(phi)

# Star catalog: name, RA (degrees), Dec (degrees)
stars = [
    ("Sirius",    101.3, -16.7), ("Canopus",   96.0, -52.7),
    ("Arcturus",  214.0, 19.2),  ("Vega",     278.0, 38.8),
    ("Capella",    79.2, 46.0),  ("Rigel",     78.6, -8.2),
    ("Betelgeuse", 88.8, 7.4),   ("Altair",   298.0, 8.9),
    ("Aldebaran",  68.9, 16.5),  ("Spica",    201.3, -11.2),
    ("Deneb",     310.0, 45.3),  ("Pollux",   116.3, 28.0),
    ("Fomalhaut", 344.4, -29.6), ("Regulus",   152.1, 12.0),
]

fig, ax = plt.subplots(figsize=(7, 7))
ax.set_facecolor('#0f172a')

# Ecliptic: Sun's path (dec varies with ecliptic longitude)
ecl_ra = np.linspace(0, 360, 360)
ecl_dec = 23.44 * np.sin(np.radians(ecl_ra))
ex, ey = [], []
for r, d in zip(ecl_ra, ecl_dec):
    x, y = stereo_xy(d, r)
    ex.append(x); ey.append(y)
ax.plot(ex, ey, color='#ef4444', linewidth=1.5, label='Ecliptic (Sun path)')

# Equator
eq_r = np.tan(np.radians(45))
eq = plt.Circle((0, 0), eq_r, fill=False, color='#38bdf8',
                linewidth=1, linestyle='--', label='Equator')
ax.add_patch(eq)

# Star pointers
for name, ra, dec in stars:
    x, y = stereo_xy(dec, ra)
    ax.plot(x, y, '*', color='#fbbf24', markersize=10)
    ax.annotate(name, (x, y), fontsize=6, color='#e2e8f0',
                xytext=(4, 4), textcoords='offset points')
    # Rete pointer line (from nearby point toward star)
    dx, dy = x * 0.15, y * 0.15
    ax.plot([x - dx, x], [y - dy, y], color='#fbbf24',
            linewidth=0.5, alpha=0.5)

# NCP
ax.plot(0, 0, '+', color='#10b981', markersize=12, markeredgewidth=2)

# Outer limit
outer = np.tan(np.radians(90 + 23.4) / 2)
ax.add_patch(plt.Circle((0, 0), outer, fill=False,
             color='#475569', linewidth=1.5))

ax.set_xlim(-2.5, 2.5); ax.set_ylim(-2.5, 2.5)
ax.set_aspect('equal')
ax.set_title('Astrolabe Rete — Star Pointers & Ecliptic', color='white')
ax.legend(fontsize=8, loc='lower right')
plt.show()
print(f"Stars plotted: {len(stars)}")
print(f"Ecliptic offset from center: {np.mean(ey):.3f} units")`,
      challenge: 'Add the constellation lines for the Summer Triangle (Vega-Altair-Deneb). Just plot lines between the three stars.',
      successHint: 'You have built the rete — the rotating star map of the astrolabe. In brass, these star pointers are cut as delicate lace to let the tympan show through. In code, they are (x,y) coordinates from stereographic projection.',
    },
    {
      title: 'The ecliptic and the zodiac calendar',
      concept: `The **ecliptic** is the Sun's apparent path through the sky over a year. It is tilted 23.4° from the celestial equator because the Earth's axis is tilted.

The ecliptic is divided into 12 segments of 30° each, traditionally named after the zodiac constellations. On the astrolabe, these divisions serve as a **calendar**: by knowing the date, you find the Sun's position on the ecliptic, and from there you can compute sunrise, sunset, and time.

The Sun's ecliptic longitude increases by about 1° per day (360° / 365.25 days). Its declination follows:
**dec = 23.44° · sin(ecliptic_longitude)**

At the vernal equinox (March 20), longitude = 0°, dec = 0°. At summer solstice (June 21), longitude = 90°, dec = +23.44°.`,
      analogy: 'The ecliptic is like a tilted racetrack around the sky. The Sun drives around it once a year. The zodiac signs are mile markers along the track. Knowing the date tells you which mile marker the Sun is near.',
      storyConnection: 'Zahra set the rete to the Sun’s current position on the ecliptic to tell time. The ecliptic ring on the rete has month/zodiac divisions — it is a built-in calendar that connects dates to star positions.',
      checkQuestion: 'On December 21 (winter solstice), the Sun’s ecliptic longitude is 270°. What is its declination?',
      checkAnswer: 'dec = 23.44° × sin(270°) = 23.44° × (-1) = -23.44°. The Sun is at its most southerly point. For the Northern Hemisphere, this is the shortest day.',
      codeIntro: 'Plot the Sun’s path through the year: ecliptic longitude, declination, and projected position.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Sun's ecliptic longitude through the year
days = np.arange(0, 365)
ecl_lon = (days / 365.25) * 360  # degrees

# Declination from ecliptic longitude
dec = 23.44 * np.sin(np.radians(ecl_lon))

# Zodiac divisions
zodiac = ['Ari','Tau','Gem','Can','Leo','Vir',
          'Lib','Sco','Sag','Cap','Aqu','Pis']

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 7))

# Top: declination through the year
ax1.plot(days, dec, color='#fbbf24', linewidth=2)
ax1.axhline(0, color='#475569', linestyle='--')
ax1.axhline(23.44, color='#ef4444', linestyle=':', alpha=0.5)
ax1.axhline(-23.44, color='#38bdf8', linestyle=':', alpha=0.5)

# Mark solstices and equinoxes
for d, label in [(80, 'Vernal Eq'), (172, 'Summer Sol'),
                 (266, 'Autumnal Eq'), (356, 'Winter Sol')]:
    ax1.axvline(d, color='#64748b', linestyle=':', alpha=0.3)
    ax1.text(d, 25, label, fontsize=7, color='#94a3b8',
             ha='center', rotation=0)

ax1.set_ylabel('Declination (°)', color='#e2e8f0')
ax1.set_title('Sun\\'s Declination Through the Year', color='white')

# Zodiac markers
for i, sign in enumerate(zodiac):
    ax1.axvline(i * 30.44 + 80, color='#334155', linewidth=0.3)
    ax1.text(i * 30.44 + 95, -28, sign, fontsize=6,
             color='#64748b', ha='center')

ax1.set_xlim(0, 365); ax1.set_ylim(-30, 30)

# Bottom: projected ecliptic on astrolabe disk
def stereo_xy(dec_d, ra_d):
    theta = np.radians(90 - dec_d)
    phi = np.radians(ra_d)
    r = np.tan(theta / 2)
    return r * np.cos(phi), r * np.sin(phi)

ax2.set_facecolor('#0f172a')
ex, ey = zip(*[stereo_xy(d, l) for d, l in zip(dec, ecl_lon)])
ax2.plot(ex, ey, color='#ef4444', linewidth=2, label='Ecliptic')
# Mark months
for m, d in enumerate([0,31,59,90,120,151,181,212,243,273,304,334]):
    x, y = stereo_xy(dec[d], ecl_lon[d])
    ax2.plot(x, y, 'o', color='#fbbf24', markersize=5)
    ax2.text(x, y+0.08, ['J','F','M','A','M','J',
             'J','A','S','O','N','D'][m],
             fontsize=7, color='#fbbf24', ha='center')

ax2.add_patch(plt.Circle((0,0), 1, fill=False,
              color='#38bdf8', linewidth=0.5, linestyle='--'))
ax2.set_xlim(-2, 2); ax2.set_ylim(-2, 2)
ax2.set_aspect('equal')
ax2.set_title('Ecliptic on the Astrolabe Disk', color='white')
ax2.legend(fontsize=8)
plt.tight_layout()
plt.show()`,
      challenge: 'The ecliptic on the astrolabe is an off-center circle. Compute its center coordinates and radius from the projected points.',
      successHint: 'The ecliptic ring on the rete is the astrolabe’s calendar. Match the date to a point on the ecliptic, set the rete to the correct sidereal time, and you can read sunrise, sunset, and prayer times.',
    },
    {
      title: 'Assembling the astrolabe — tympan + rete overlay',
      concept: `Now we combine everything: overlay the rete (star map + ecliptic) on the tympan (altitude/azimuth grid) to create a working digital astrolabe.

The key operation: **rotation**. When you rotate the rete by an angle α, every star pointer rotates by that angle. The rotation matrix is:

x' = x·cos(α) - y·sin(α)
y' = x·sin(α) + y·cos(α)

The rotation angle α corresponds to the local sidereal time (LST). As LST increases, the rete rotates counterclockwise (matching the sky's apparent motion). Stars cross the horizon circle — they rise in the east and set in the west.

This is the complete astrolabe: a static tympan with moving rete. Two layers of circles, one rotating over the other.`,
      analogy: 'Think of two transparent sheets stacked together. The bottom (tympan) has altitude circles drawn in blue. The top (rete) has stars drawn in gold. Pin them together at the center and rotate the top sheet — you see stars moving through the altitude circles. That is the astrolabe.',
      storyConnection: 'Zahra rotated the rete and "watched the star pointers sweep across the tympan." This is the moment the astrolabe comes alive — two static engravings, combined with rotation, simulate the living sky.',
      checkQuestion: 'If you rotate the rete by 90° (6 sidereal hours), what happens to a star that was on the eastern horizon?',
      checkAnswer: 'It moves to the highest point in the sky (the meridian). 90° of rotation = 6 hours. A star on the east horizon at time T is at its maximum altitude 6 hours later when it crosses the meridian. This is exactly what you see on the astrolabe — the star pointer moves from the horizon circle to near the zenith.',
      codeIntro: 'Build the complete astrolabe: tympan + rotating rete, animated through one day.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def stereo_xy(dec, ra):
    theta = np.radians(90 - dec)
    phi = np.radians(ra)
    r = np.tan(theta / 2)
    return r * np.cos(phi), r * np.sin(phi)

def rotate(x, y, angle_deg):
    a = np.radians(angle_deg)
    return x*np.cos(a) - y*np.sin(a), x*np.sin(a) + y*np.cos(a)

lat = 32  # Isfahan
rotation = 45  # degrees (= 3 sidereal hours past midnight)

fig, ax = plt.subplots(figsize=(7, 7))
ax.set_facecolor('#0f172a')

# --- TYMPAN (static) ---
# Horizon circle (simplified as centered on zenith offset)
zenith_y = -np.tan(np.radians(90 - lat) / 2)
for alt in range(0, 90, 10):
    r = np.tan(np.radians(90 - alt) / 2) * 0.7
    color = '#10b981' if alt == 0 else '#1e3a5f'
    lw = 1.5 if alt == 0 else 0.3
    circle = plt.Circle((0, zenith_y), r, fill=False,
                         color=color, linewidth=lw)
    ax.add_patch(circle)

ax.plot(0, zenith_y, 'o', color='#fbbf24', markersize=4)

# --- RETE (rotated) ---
stars = [("Vega", 278, 38.8), ("Altair", 298, 8.9),
         ("Deneb", 310, 45.3), ("Sirius", 101, -16.7),
         ("Capella", 79, 46.0), ("Arcturus", 214, 19.2),
         ("Betelgeuse", 89, 7.4), ("Aldebaran", 69, 16.5)]

for name, ra, dec in stars:
    x, y = stereo_xy(dec, ra)
    xr, yr = rotate(x, y, rotation)
    ax.plot(xr, yr, '*', color='#fbbf24', markersize=10)
    ax.annotate(name, (xr, yr), fontsize=6, color='white',
                xytext=(4, 4), textcoords='offset points')

# Ecliptic (rotated)
ecl_ra = np.linspace(0, 360, 200)
ecl_dec = 23.44 * np.sin(np.radians(ecl_ra))
for r, d in zip(ecl_ra, ecl_dec):
    x, y = stereo_xy(d, r)
    xr, yr = rotate(x, y, rotation)
    ax.plot(xr, yr, '.', color='#ef4444', markersize=1)

# Outer rim
outer = np.tan(np.radians(90 + 23.4) / 2)
ax.add_patch(plt.Circle((0, 0), outer, fill=False,
             color='#64748b', linewidth=2))

# Degree marks on rim
for deg in range(0, 360, 15):
    r1, r2 = outer - 0.05, outer
    a = np.radians(deg)
    ax.plot([r1*np.cos(a), r2*np.cos(a)],
            [r1*np.sin(a), r2*np.sin(a)],
            color='#64748b', linewidth=0.5)

ax.plot(0, 0, '+', color='#10b981', markersize=10, markeredgewidth=2)
ax.set_xlim(-2.5, 2.5); ax.set_ylim(-2.5, 2.5)
ax.set_aspect('equal')
ax.set_title(f'Astrolabe — Isfahan 32°N (rete rotated {rotation}°)',
             color='white')
plt.show()
print(f"Rete rotation: {rotation}° = {rotation/15:.1f} sidereal hours")
print("Try changing 'rotation' to see the sky at different times!")`,
      challenge: 'Animate the astrolabe: loop rotation from 0 to 360 in steps of 15° and watch the stars sweep across the sky. Which stars never dip below the horizon? (Those are circumpolar stars.)',
      successHint: 'You have built a working digital astrolabe. Two projected layers (tympan + rete), one rotating over the other, reproducing the sky’s motion for any latitude at any time. This is exactly what Zahra held in her hands.',
    },
  ];

  return (
    <div className="space-y-8">
      {loading && (
        <div className="flex items-center gap-3 text-amber-200 bg-amber-900/30 rounded-lg px-4 py-3 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> {loadProgress}
        </div>
      )}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
        <Sparkles className="w-4 h-4" />
        Level 2 &mdash; Stereographic projection, tympan, rete, and the ecliptic
      </div>
      {miniLessons.map((ml, i) => createElement(MiniLesson, { key: i, index: i, ...ml, pyodideRef, pyReady, loadPyodide, diagramMap: { AstrolabeProjectionDiagram, AstrolabeCelestialNavDiagram, UnitCircleDiagram, CirclePropertiesDiagram, ConicSectionsDiagram, TransformationsDiagram } }))}
    </div>
  );
}
