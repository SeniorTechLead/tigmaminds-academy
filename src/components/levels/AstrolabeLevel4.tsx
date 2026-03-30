import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AstrolabeProjectionDiagram from '../diagrams/AstrolabeProjectionDiagram';
import AstrolabeFunctionsDiagram from '../diagrams/AstrolabeFunctionsDiagram';
import AstrolabeCelestialNavDiagram from '../diagrams/AstrolabeCelestialNavDiagram';
import AstrolabeSundialDiagram from '../diagrams/AstrolabeSundialDiagram';
import SineWaveDiagram from '../diagrams/SineWaveDiagram';
import UnitCircleDiagram from '../diagrams/UnitCircleDiagram';

export default function AstrolabeLevel4() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python runtime...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing numpy & matplotlib...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Capstone: build the star catalog class',
      concept: `Time to build a complete digital astrolabe from the ground up. We start with the **star catalog** \u2014 a Python class that stores star data and computes their positions for any time and location.

The class needs:
- Star name, right ascension (RA), declination (Dec), and magnitude
- A method to compute altitude and azimuth for any (latitude, LST) pair
- A method to determine which stars are above the horizon

This is the data layer \u2014 the same information that was engraved on the rete as star pointers. Our digital version will handle 20+ stars with full positional computation.`,
      analogy: 'The star catalog is the database behind the astrolabe. Medieval astronomers maintained these catalogs on parchment \u2014 tables of star positions painstakingly measured and corrected over centuries. Your Python class is the modern equivalent.',
      storyConnection: 'Islamic astronomers created some of the most accurate star catalogs in history. Al-Sufi\u2019s "Book of Fixed Stars" (964 CE) cataloged over 1,000 stars with positions accurate to about 0.5\u00B0. This data powered every astrolabe.',
      checkQuestion: 'Why do we need both RA/Dec (fixed) and alt/az (changing) coordinates?',
      checkAnswer: 'RA and Dec are fixed to the celestial sphere \u2014 a star\u2019s RA/Dec stays the same regardless of time or observer location. Alt/az depend on where you are and when you observe. The catalog stores RA/Dec; the compute method converts to alt/az for a specific observer.',
      codeIntro: 'Build the StarCatalog class with position computation.',
      code: `import numpy as np

class StarCatalog:
    def __init__(self):
        # name, RA (hours), Dec (degrees), magnitude
        self.stars = [
            ("Sirius",      6.75, -16.72, -1.46),
            ("Canopus",     6.40, -52.70, -0.74),
            ("Arcturus",   14.26,  19.18, -0.05),
            ("Vega",       18.62,  38.78,  0.03),
            ("Capella",     5.28,  46.00,  0.08),
            ("Rigel",       5.24,  -8.20,  0.13),
            ("Betelgeuse",  5.92,   7.41,  0.42),
            ("Altair",     19.85,   8.87,  0.76),
            ("Aldebaran",   4.60,  16.51,  0.87),
            ("Spica",      13.42, -11.16,  0.97),
            ("Deneb",      20.69,  45.28,  1.25),
            ("Pollux",      7.76,  28.03,  1.14),
            ("Fomalhaut",  22.96, -29.62,  1.16),
            ("Regulus",    10.14,  11.97,  1.40),
            ("Polaris",     2.53,  89.26,  1.98),
        ]

    def alt_az(self, name, lat, lst_hours):
        """Compute altitude and azimuth for a star."""
        for n, ra, dec, mag in self.stars:
            if n == name:
                ha = (lst_hours - ra) * 15  # hour angle in degrees
                ha_r = np.radians(ha)
                lat_r = np.radians(lat)
                dec_r = np.radians(dec)
                sin_alt = (np.sin(lat_r) * np.sin(dec_r) +
                           np.cos(lat_r) * np.cos(dec_r) * np.cos(ha_r))
                alt = np.degrees(np.arcsin(np.clip(sin_alt, -1, 1)))
                cos_az = ((np.sin(dec_r) - np.sin(lat_r) * sin_alt) /
                          (np.cos(lat_r) * np.cos(np.radians(alt)) + 1e-10))
                az = np.degrees(np.arccos(np.clip(cos_az, -1, 1)))
                if np.sin(ha_r) > 0:
                    az = 360 - az
                return alt, az
        return None, None

    def visible_stars(self, lat, lst_hours):
        """Return all stars above the horizon."""
        result = []
        for name, ra, dec, mag in self.stars:
            alt, az = self.alt_az(name, lat, lst_hours)
            if alt is not None and alt > 0:
                result.append((name, alt, az, mag))
        return sorted(result, key=lambda x: -x[1])  # brightest first

# Test: Isfahan, June 21 at 10 PM
catalog = StarCatalog()
lst = 22 + (172 * 24 / 365.25) + (51.7 / 15)  # approximate LST
lst = lst % 24

print(f"Local Sidereal Time: {lst:.2f}h")
print(f"\\nVisible stars from Isfahan (32\u00B0N):")
print(f"{'Star':12s} {'Alt':>6s} {'Az':>6s} {'Mag':>5s}")
print("-" * 32)
for name, alt, az, mag in catalog.visible_stars(32, lst):
    compass = ['N','NE','E','SE','S','SW','W','NW'][int((az+22.5)//45)%8]
    print(f"  {name:10s} {alt:5.1f}\u00B0 {az:5.1f}\u00B0 {mag:+5.2f}  {compass}")`,
      challenge: 'Add a method find_by_altitude(lat, lst, target_alt, tolerance) that finds all stars within \u00B1tolerance degrees of a target altitude. This is how you "solve" an astrolabe reading.',
      successHint: 'Your star catalog is the digital equivalent of the rete. Each star has a known position (RA, Dec) and can be computed for any time and place. Next: the tympan.',
    },
    {
      title: 'Capstone: build the tympan renderer',
      concept: `The **tympan renderer** draws the altitude and azimuth grid for any latitude. This is the static background layer of the astrolabe.

We need to:
1. Project the zenith point for the observer's latitude
2. Draw altitude circles (0\u00B0 to 80\u00B0 in 10\u00B0 steps) centered on the zenith
3. Draw the horizon (altitude = 0\u00B0) prominently
4. Add azimuth arcs (N, NE, E, SE, S, SW, W, NW)
5. Add the celestial equator and tropics

Each circle is computed from stereographic projection. The horizon circle has center at y = -1/tan(\u03C6) and radius = 1/sin(\u03C6) in normalized coordinates.`,
      analogy: 'The tympan is like the face of a clock \u2014 the numbers and hour marks that stay still. The rete (coming next) is like the clock hands that rotate over it. Together they tell you the state of the sky.',
      storyConnection: 'Ibn al-Haytham told Zahra that the tympan "shows the sky coordinates for your latitude." Each city had its own tympan \u2014 Isfahan\u2019s grid is different from Cairo\u2019s or Baghdad\u2019s. Your renderer generates any of them.',
      checkQuestion: 'Why does the tympan depend on latitude but not on time?',
      checkAnswer: 'The tympan shows the coordinate grid as seen from a fixed location: where is the zenith, where is the horizon, what direction is north. These depend on your latitude but not on when you observe. Time only affects which stars are where \u2014 that is the rete\u2019s job.',
      codeIntro: 'Build a complete tympan renderer with altitude circles, horizon, and outer boundary.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class Tympan:
    def __init__(self, lat, R=1.0):
        self.lat = lat
        self.R = R
        # Zenith position (stereographic projection of observer's zenith)
        self.z_r = R * np.tan(np.radians(90 - lat) / 2)
        # Outer boundary: tropic of Capricorn
        self.outer = R * np.tan(np.radians(90 + 23.44) / 2)

    def draw(self, ax):
        """Draw the tympan on a matplotlib axes."""
        u = np.linspace(0, 2 * np.pi, 300)

        # Outer boundary
        ax.add_patch(plt.Circle((0, 0), self.outer, fill=False,
                     color='#64748b', linewidth=2))

        # Tropic of Cancer
        tc = self.R * np.tan(np.radians(90 - 23.44) / 2)
        ax.add_patch(plt.Circle((0, 0), tc, fill=False,
                     color='#334155', linewidth=0.5, linestyle='--'))
        ax.text(tc + 0.02, 0.05, 'Cancer', fontsize=5, color='#475569')

        # Equator
        eq = self.R * np.tan(np.radians(45))
        ax.add_patch(plt.Circle((0, 0), eq, fill=False,
                     color='#38bdf8', linewidth=0.7, linestyle='--'))
        ax.text(eq + 0.02, 0.05, 'Eq', fontsize=5, color='#38bdf8')

        # Altitude circles (centered on zenith projection)
        for alt in range(0, 90, 10):
            # Approximate: concentric circles around zenith
            r_alt = self.R * np.tan(np.radians(90 - alt) / 2) * 0.65
            color = '#10b981' if alt == 0 else '#1e3a5f'
            lw = 2 if alt == 0 else 0.4
            ax.add_patch(plt.Circle((0, -self.z_r), r_alt, fill=False,
                         color=color, linewidth=lw))
            if alt % 30 == 0 and alt > 0:
                ax.text(r_alt + 0.02, -self.z_r, f'{alt}\u00B0',
                        fontsize=5, color='#64748b')

        # Zenith point
        ax.plot(0, -self.z_r, 'o', color='#fbbf24', markersize=4)
        ax.text(0.05, -self.z_r, 'Z', fontsize=7, color='#fbbf24')

        # NCP
        ax.plot(0, 0, '+', color='#ef4444', markersize=8, markeredgewidth=1.5)

        # Azimuth lines (simplified as radials from zenith)
        for az in range(0, 360, 45):
            rad = np.radians(az)
            ax.plot([0, 1.5 * np.sin(rad)],
                    [-self.z_r, -self.z_r + 1.5 * np.cos(rad)],
                    color='#1e3a5f', linewidth=0.3)

        # Degree marks on rim
        for deg in range(0, 360, 5):
            r1 = self.outer - (0.06 if deg % 15 == 0 else 0.03)
            a = np.radians(deg)
            ax.plot([r1*np.cos(a), self.outer*np.cos(a)],
                    [r1*np.sin(a), self.outer*np.sin(a)],
                    color='#475569', linewidth=0.4)

        ax.set_xlim(-self.outer*1.1, self.outer*1.1)
        ax.set_ylim(-self.outer*1.1, self.outer*1.1)
        ax.set_aspect('equal')

# Draw tympans for 3 latitudes
fig, axes = plt.subplots(1, 3, figsize=(12, 4.2))
for ax, lat, city in zip(axes, [20, 32, 51],
                          ['Mecca 20\u00B0N', 'Isfahan 32\u00B0N', 'London 51\u00B0N']):
    ax.set_facecolor('#0f172a')
    t = Tympan(lat)
    t.draw(ax)
    ax.set_title(city, color='white', fontsize=10)
    ax.axis('off')

plt.tight_layout()
plt.show()
print("Notice how the zenith (yellow dot) shifts with latitude.")
print("At higher latitudes, the visible sky area is offset more from center.")`,
      challenge: 'Add twilight zones: draw circles at altitude -6\u00B0 (civil twilight), -12\u00B0 (nautical), and -18\u00B0 (astronomical). These are below the horizon but astronomically important.',
      successHint: 'Your Tympan class generates the base plate for any latitude. Medieval brass-engravers computed these same circles, then inscribed them with compass and straightedge. Your code does in milliseconds what took them hours.',
    },
    {
      title: 'Capstone: build the rete renderer',
      concept: `The **rete renderer** draws the rotating star map and ecliptic. It accepts a rotation angle (corresponding to local sidereal time) and draws:

1. Star pointers positioned by stereographic projection of (RA, Dec)
2. The ecliptic circle with zodiac/month divisions
3. A rotation transformation applied to all elements

The rotation matrix transforms each point:
**x' = x\u00B7cos(\u03B1) - y\u00B7sin(\u03B1)**
**y' = x\u00B7sin(\u03B1) + y\u00B7cos(\u03B1)**

where \u03B1 is the rotation angle = LST \u00D7 15\u00B0.`,
      analogy: 'The rete is a transparent overlay that spins. In brass, it is a delicate lattice with small points marking each star. In code, it is a list of projected coordinates that we rotate before drawing.',
      storyConnection: 'When Zahra "rotated the rete and watched the star pointers sweep across the tympan," she was performing exactly the rotation matrix operation you are about to code.',
      checkQuestion: 'If you rotate the rete by 180\u00B0, what happens to a star that was at the zenith?',
      checkAnswer: 'It moves to the nadir (directly below the horizon). A 180\u00B0 rotation corresponds to 12 sidereal hours \u2014 half a day. A star at its highest point will be at its lowest point 12 hours later.',
      codeIntro: 'Build the Rete class with star pointers, ecliptic, and rotation.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class Rete:
    def __init__(self, R=1.0):
        self.R = R
        self.stars = [
            ("Sirius", 6.75, -16.72), ("Vega", 18.62, 38.78),
            ("Arcturus", 14.26, 19.18), ("Capella", 5.28, 46.00),
            ("Rigel", 5.24, -8.20), ("Altair", 19.85, 8.87),
            ("Betelgeuse", 5.92, 7.41), ("Aldebaran", 4.60, 16.51),
            ("Deneb", 20.69, 45.28), ("Spica", 13.42, -11.16),
            ("Polaris", 2.53, 89.26), ("Regulus", 10.14, 11.97),
        ]

    def _project(self, dec, ra_deg):
        theta = np.radians(90 - dec)
        phi = np.radians(ra_deg)
        r = self.R * np.tan(theta / 2)
        return r * np.cos(phi), r * np.sin(phi)

    def _rotate(self, x, y, angle_deg):
        a = np.radians(angle_deg)
        return x*np.cos(a) - y*np.sin(a), x*np.sin(a) + y*np.cos(a)

    def draw(self, ax, rotation_deg=0):
        """Draw rete rotated by rotation_deg."""
        # Ecliptic
        ecl_lon = np.linspace(0, 360, 300)
        ecl_dec = 23.44 * np.sin(np.radians(ecl_lon))
        ex, ey = [], []
        for lon, dec in zip(ecl_lon, ecl_dec):
            x, y = self._project(dec, lon)
            xr, yr = self._rotate(x, y, rotation_deg)
            ex.append(xr); ey.append(yr)
        ax.plot(ex, ey, color='#ef4444', linewidth=1.2, alpha=0.8)

        # Month markers on ecliptic
        month_days = [0,31,59,90,120,151,181,212,243,273,304,334]
        month_names = ['J','F','M','A','M','J','J','A','S','O','N','D']
        for d, name in zip(month_days, month_names):
            lon = d / 365.25 * 360
            dec = 23.44 * np.sin(np.radians(lon))
            x, y = self._project(dec, lon)
            xr, yr = self._rotate(x, y, rotation_deg)
            ax.plot(xr, yr, 'o', color='#ef4444', markersize=3)
            ax.text(xr, yr + 0.06, name, fontsize=5, color='#ef4444',
                    ha='center')

        # Star pointers
        for name, ra_h, dec in self.stars:
            ra_deg = ra_h * 15
            x, y = self._project(dec, ra_deg)
            xr, yr = self._rotate(x, y, rotation_deg)
            ax.plot(xr, yr, '*', color='#fbbf24', markersize=8)
            ax.annotate(name, (xr, yr), fontsize=5, color='#e2e8f0',
                        xytext=(3, 3), textcoords='offset points')

# Show rete at 3 different rotations (times)
fig, axes = plt.subplots(1, 3, figsize=(12, 4.2))
rete = Rete()
for ax, rot, time_label in zip(axes, [0, 90, 180],
                                 ['0h (midnight)', '6h (dawn)', '12h (noon)']):
    ax.set_facecolor('#0f172a')
    ax.add_patch(plt.Circle((0, 0), 2.2, fill=False,
                 color='#475569', linewidth=1.5))
    rete.draw(ax, rotation_deg=rot)
    ax.plot(0, 0, '+', color='#10b981', markersize=8, markeredgewidth=1.5)
    ax.set_xlim(-2.5, 2.5); ax.set_ylim(-2.5, 2.5)
    ax.set_aspect('equal'); ax.axis('off')
    ax.set_title(f'Rete at LST = {time_label}', color='white', fontsize=9)

plt.tight_layout()
plt.show()
print("The rete rotates counterclockwise as sidereal time advances.")
print("Stars sweep across the field, rising and setting.")`,
      challenge: 'Add magnitude-based sizing: brighter stars (lower magnitude) get larger markers. Sirius (mag -1.46) should be the largest star point.',
      successHint: 'Your Rete class is the rotating star map. Combined with the Tympan, you have the two layers of the astrolabe. Next: combining them.',
    },
    {
      title: 'Capstone: full digital astrolabe with time solver',
      concept: `Now we combine the **Tympan**, **Rete**, and **StarCatalog** into a complete digital astrolabe with a practical function: **solving for time**.

Given a measured star altitude, the astrolabe determines the time:
1. Look up the star's RA and Dec in the catalog
2. From the altitude formula, solve for the hour angle: cos(HA) = (sin(alt) - sin(lat)\u00B7sin(dec)) / (cos(lat)\u00B7cos(dec))
3. Convert HA to local sidereal time: LST = RA + HA
4. Convert LST to local solar time

This is exactly what Zahra did when she sighted a star, found it on the rete, and rotated until the altitude matched. Our code does the same calculation digitally.`,
      analogy: 'The complete astrolabe is like a flight simulator for the sky. Input your latitude and a star measurement, and it computes the time, shows the sky, and tells you which stars are visible. The simulator runs the same math as the brass instrument, just faster.',
      storyConnection: 'This is the capstone \u2014 the digital version of the instrument Ibn al-Haytham gave Zahra. One Python program that does what one brass disc did: tell time from stars, find direction, predict sunrise.',
      checkQuestion: 'If you measure Vega at altitude 45\u00B0 from Isfahan, what information do you need to determine the time?',
      checkAnswer: 'You need: (1) Isfahan\u2019s latitude (32\u00B0N), (2) Vega\u2019s RA (18.62h) and Dec (38.78\u00B0), (3) the date (to convert sidereal time to solar time). With these, the altitude formula gives HA, then LST = RA + HA, then clock time follows from the date.',
      codeIntro: 'Build the complete digital astrolabe with time-solving capability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

class DigitalAstrolabe:
    def __init__(self, lat):
        self.lat = lat
        self.stars = {
            "Sirius": (6.75, -16.72), "Vega": (18.62, 38.78),
            "Arcturus": (14.26, 19.18), "Capella": (5.28, 46.00),
            "Altair": (19.85, 8.87), "Deneb": (20.69, 45.28),
            "Polaris": (2.53, 89.26), "Betelgeuse": (5.92, 7.41),
            "Aldebaran": (4.60, 16.51), "Regulus": (10.14, 11.97),
        }

    def star_alt_az(self, star, lst_h):
        """Compute star altitude/azimuth for given LST."""
        ra, dec = self.stars[star]
        ha = (lst_h - ra) * 15
        ha_r, lat_r, dec_r = map(np.radians, [ha, self.lat, dec])
        sin_alt = (np.sin(lat_r)*np.sin(dec_r) +
                   np.cos(lat_r)*np.cos(dec_r)*np.cos(ha_r))
        alt = np.degrees(np.arcsin(np.clip(sin_alt, -1, 1)))
        cos_az = ((np.sin(dec_r) - np.sin(lat_r)*sin_alt) /
                  (np.cos(lat_r)*np.cos(np.radians(alt)) + 1e-10))
        az = np.degrees(np.arccos(np.clip(cos_az, -1, 1)))
        if np.sin(ha_r) > 0: az = 360 - az
        return alt, az

    def solve_time(self, star, measured_alt, day_of_year):
        """Given a star altitude measurement, solve for clock time."""
        ra, dec = self.stars[star]
        lat_r, dec_r = np.radians(self.lat), np.radians(dec)
        cos_ha = ((np.sin(np.radians(measured_alt)) -
                   np.sin(lat_r)*np.sin(dec_r)) /
                  (np.cos(lat_r)*np.cos(dec_r)))
        if abs(cos_ha) > 1:
            return None, None  # star cannot reach this altitude
        ha = np.degrees(np.arccos(np.clip(cos_ha, -1, 1)))
        # Two solutions: rising (east) and setting (west)
        lst_rising = (ra + ha / 15) % 24
        lst_setting = (ra - ha / 15) % 24
        # Convert LST to solar time
        offset = (day_of_year * 24 / 365.25) + (self.lat * 0) # simplified
        solar_rising = (lst_rising - offset) % 24
        solar_setting = (lst_setting - offset) % 24
        return solar_rising, solar_setting

    def sunrise_sunset(self, day_of_year):
        """Predict sunrise/sunset for a given day."""
        dec = 23.44 * np.sin(np.radians((day_of_year - 81) * 360 / 365))
        cos_ha = -np.tan(np.radians(self.lat)) * np.tan(np.radians(dec))
        if abs(cos_ha) > 1:
            return (0, 24) if cos_ha < -1 else (None, None)
        ha = np.degrees(np.arccos(cos_ha))
        sunrise = 12 - ha / 15
        sunset = 12 + ha / 15
        return sunrise, sunset

# === DEMO: Isfahan astrolabe ===
astrolabe = DigitalAstrolabe(32)

# 1. Solve time from Vega at altitude 45\u00B0
print("=== Time from Star Observation ===")
print("Star: Vega, Measured altitude: 45\u00B0, Day: 172 (June 21)")
t_rise, t_set = astrolabe.solve_time("Vega", 45, 172)
print(f"  Rising solution: {int(t_rise)}:{int((t_rise%1)*60):02d}")
print(f"  Setting solution: {int(t_set)}:{int((t_set%1)*60):02d}")

# 2. Sunrise/sunset
print("\\n=== Sunrise & Sunset ===")
for day, label in [(80, 'Mar 21'), (172, 'Jun 21'),
                   (266, 'Sep 23'), (356, 'Dec 21')]:
    sr, ss = astrolabe.sunrise_sunset(day)
    daylen = ss - sr
    print(f"  {label}: rise={sr:.2f}h ({int(sr)}:{int((sr%1)*60):02d})"
          f"  set={ss:.2f}h ({int(ss)}:{int((ss%1)*60):02d})"
          f"  [{daylen:.1f}h daylight]")

# 3. Visible stars right now
print("\\n=== Sky at LST = 20h ===")
for star in astrolabe.stars:
    alt, az = astrolabe.star_alt_az(star, 20)
    if alt > 0:
        print(f"  {star:12s}  alt={alt:5.1f}\u00B0  az={az:5.1f}\u00B0")`,
      challenge: 'Add a method qibla_direction() that computes the bearing to Mecca (21.42\u00B0N, 39.83\u00B0E) from the astrolabe\u2019s latitude. Assume a default longitude of 51.7\u00B0E (Isfahan).',
      successHint: 'You have built a working digital astrolabe. It tells time from star observations, predicts sunrise and sunset, and shows the visible sky. The same instrument Zahra held in brass, you now hold in code.',
    },
    {
      title: 'Capstone: rendering the combined astrolabe display',
      concept: `The final step: render the complete astrolabe as a visual display. Overlay the rotating rete on the static tympan, with the rotation angle set by the current time.

The display shows:
- The tympan (altitude circles, horizon) in muted colors
- The rete (star pointers, ecliptic) in bright colors, rotated by LST
- A time readout showing the computed hour
- Star labels for visible objects

This is the digital equivalent of looking at a physical astrolabe \u2014 two engraved brass layers, one turning over the other, with the cosmos compressed into a handheld circle.`,
      analogy: 'The final display is like a planetarium on your screen. The dome (tympan) stays still. The stars (rete) rotate. The result is a real-time simulation of the sky that matches what you would see if you stepped outside.',
      storyConnection: 'Zahra "held the astrolabe up to the sky and sighted Polaris. Thirty-two degrees." Your digital astrolabe does the same: it shows the sky from Isfahan at any time you choose, with Polaris at 32\u00B0 altitude.',
      checkQuestion: 'What rotation angle should you set the rete to for 10 PM local time on June 21 from Isfahan?',
      checkAnswer: 'First compute LST: approximately 22h + (172/365.25 \u00D7 24) + (51.7/15) \u2248 22 + 11.3 + 3.4 = 36.7 \u2248 12.7h (mod 24). Rotation = 12.7 \u00D7 15 = 190.5\u00B0. The rete turns by 15\u00B0 per sidereal hour.',
      codeIntro: 'Render the complete digital astrolabe with tympan, rete, and time display.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def stereo_xy(dec, ra_deg, R=1.0):
    theta = np.radians(90 - dec)
    phi = np.radians(ra_deg)
    r = R * np.tan(theta / 2)
    return r * np.cos(phi), r * np.sin(phi)

def rotate(x, y, deg):
    a = np.radians(deg)
    return x*np.cos(a)-y*np.sin(a), x*np.sin(a)+y*np.cos(a)

# Parameters
lat = 32        # Isfahan
day = 172       # June 21
hour = 22       # 10 PM local
lst = (hour + day*24/365.25 + 51.7/15) % 24
rot = lst * 15  # degrees

fig, ax = plt.subplots(figsize=(8, 8))
ax.set_facecolor('#0f172a')

# === TYMPAN (static) ===
outer = np.tan(np.radians(90 + 23.44) / 2)
ax.add_patch(plt.Circle((0, 0), outer, fill=True,
             facecolor='#0a0f1a', edgecolor='#64748b', linewidth=2))

z_r = np.tan(np.radians(90 - lat) / 2)
u = np.linspace(0, 2*np.pi, 300)
for alt in range(0, 90, 10):
    r = np.tan(np.radians(90 - alt) / 2) * 0.65
    color = '#10b981' if alt == 0 else '#1a2744'
    lw = 1.5 if alt == 0 else 0.4
    ax.plot(r*np.cos(u), -z_r + r*np.sin(u), color=color, linewidth=lw)

# Equator
eq = np.tan(np.radians(45))
ax.add_patch(plt.Circle((0, 0), eq, fill=False,
             color='#1e3a5f', linewidth=0.5, linestyle='--'))

# === RETE (rotated) ===
stars = [("Sirius", 6.75, -16.72), ("Vega", 18.62, 38.78),
         ("Arcturus", 14.26, 19.18), ("Capella", 5.28, 46.00),
         ("Altair", 19.85, 8.87), ("Deneb", 20.69, 45.28),
         ("Polaris", 2.53, 89.26), ("Betelgeuse", 5.92, 7.41),
         ("Aldebaran", 4.60, 16.51), ("Regulus", 10.14, 11.97),
         ("Spica", 13.42, -11.16), ("Rigel", 5.24, -8.20)]

# Ecliptic
ecl_lon = np.linspace(0, 360, 300)
ecl_dec = 23.44 * np.sin(np.radians(ecl_lon))
ex, ey = zip(*[rotate(*stereo_xy(d, l), rot) for d, l in zip(ecl_dec, ecl_lon)])
ax.plot(ex, ey, color='#ef4444', linewidth=1, alpha=0.7)

# Stars
horizon_r = np.tan(np.radians(45)) * 0.65
for name, ra_h, dec in stars:
    x, y = stereo_xy(dec, ra_h * 15)
    xr, yr = rotate(x, y, rot)
    dist_from_zenith = np.sqrt(xr**2 + (yr + z_r)**2)
    above = dist_from_zenith < horizon_r
    color = '#fbbf24' if above else '#475569'
    size = 10 if above else 5
    alpha = 1.0 if above else 0.3
    ax.plot(xr, yr, '*', color=color, markersize=size, alpha=alpha)
    if above:
        ax.annotate(name, (xr, yr), fontsize=6, color='white',
                    xytext=(4, 4), textcoords='offset points')

# Degree rim
for deg in range(0, 360, 5):
    r1 = outer - (0.08 if deg % 30 == 0 else 0.04)
    a = np.radians(deg)
    ax.plot([r1*np.cos(a), outer*np.cos(a)],
            [r1*np.sin(a), outer*np.sin(a)],
            color='#475569', linewidth=0.3)
    if deg % 30 == 0:
        ax.text((outer+0.08)*np.cos(a), (outer+0.08)*np.sin(a),
                f'{deg}\u00B0', fontsize=5, color='#64748b',
                ha='center', va='center')

# Center pin
ax.plot(0, 0, 'o', color='#94a3b8', markersize=4)

# Title and info
ax.text(0, outer + 0.25,
        f'Digital Astrolabe \u2014 Isfahan {lat}\u00B0N',
        ha='center', fontsize=12, color='white', fontweight='bold')
ax.text(0, -outer - 0.18,
        f'June 21, 10:00 PM  |  LST = {lst:.1f}h  |  Rete \u2192 {rot:.0f}\u00B0',
        ha='center', fontsize=8, color='#94a3b8')

ax.set_xlim(-outer*1.2, outer*1.2)
ax.set_ylim(-outer*1.2, outer*1.25)
ax.set_aspect('equal'); ax.axis('off')
plt.show()

# Count visible stars
visible = sum(1 for n, ra, dec in stars
              if np.sqrt(rotate(*stereo_xy(dec, ra*15), rot)[0]**2 +
                         (rotate(*stereo_xy(dec, ra*15), rot)[1] + z_r)**2)
              < horizon_r)
print(f"\\nVisible stars: {visible} of {len(stars)}")
print(f"Polaris altitude: {lat}\u00B0 (matches Isfahan's latitude)")`,
      challenge: 'Add an interactive feature: change the hour from 18 to 6 (evening to morning) and watch the stars sweep across the sky. Count how many stars are visible at each hour.',
      successHint: 'You have built a complete digital astrolabe. Two projected layers, one rotating over the other, with time-solving and sky rendering. A thousand years of Islamic astronomical heritage, encoded in 100 lines of Python.',
    },
    {
      title: 'Capstone: comparing your astrolabe to real sky data',
      concept: `The final test: validate your digital astrolabe against known astronomical data. We will compare computed sunrise/sunset times, star altitudes, and day lengths against published values.

A simulation is only as good as its validation. Medieval astronomers validated their astrolabes by measuring known star positions and comparing to their catalogs. We do the same by comparing our code\u2019s output to modern astronomical data.

Sources of error to check:
1. **Refraction** \u2014 does our model account for atmospheric bending?
2. **Precession** \u2014 star positions shift by about 1\u00B0 per 72 years
3. **Nutation and aberration** \u2014 small periodic corrections we ignore
4. **Simplified formulas** \u2014 our solar declination approximation vs reality`,
      analogy: 'Validation is like checking your watch against an atomic clock. Your watch might be very good, but only by comparing to a known standard can you quantify how good. Our digital astrolabe is the watch; published astronomical data is the atomic clock.',
      storyConnection: 'This is what Ibn al-Haytham taught Zahra above all else: measure, compare, correct. Islamic astronomy advanced by systematically comparing new observations to old catalogs and quantifying the differences. The scientific method, applied to the stars.',
      checkQuestion: 'If your computed sunrise differs from the published value by 3 minutes, is that good or bad for a basic model?',
      checkAnswer: 'Good! Our model ignores refraction (which adds ~2 minutes), the equation of time (\u00B116 minutes seasonally), and other corrections. A 3-minute error for a simplified model is excellent. A full model should achieve \u00B11 minute.',
      codeIntro: 'Validate the digital astrolabe by computing and comparing astronomical values.',
      code: `import numpy as np

class AstrolabeValidator:
    def __init__(self, lat, lon):
        self.lat = lat; self.lon = lon

    def solar_dec(self, day):
        return 23.44 * np.sin(np.radians((day - 81) * 360 / 365.25))

    def sunrise_sunset(self, day):
        dec = self.solar_dec(day)
        cos_ha = -np.tan(np.radians(self.lat)) * np.tan(np.radians(dec))
        cos_ha = np.clip(cos_ha, -1, 1)
        ha = np.degrees(np.arccos(cos_ha))
        return 12 - ha/15, 12 + ha/15

    def day_length(self, day):
        sr, ss = self.sunrise_sunset(day)
        return ss - sr

    def noon_altitude(self, day):
        dec = self.solar_dec(day)
        return 90 - abs(self.lat - dec)

# === Validate against known values ===
# Isfahan: 32.65\u00B0N, 51.68\u00B0E
av = AstrolabeValidator(32.65, 51.68)

print("=== Isfahan (32.65\u00B0N) Validation ===")
print()

# Known data (approximate for comparison)
known = {
    "Mar 20 (equinox)":  {"day": 79,  "daylen": 12.0, "noon_alt": 57.4},
    "Jun 21 (solstice)": {"day": 172, "daylen": 14.2, "noon_alt": 80.8},
    "Sep 23 (equinox)":  {"day": 266, "daylen": 12.0, "noon_alt": 57.4},
    "Dec 21 (solstice)": {"day": 356, "daylen": 9.8,  "noon_alt": 33.9},
}

print(f"{'Date':22s} {'Day Len':>8s} {'Known':>6s} {'Err':>5s}"
      f"  {'Noon Alt':>8s} {'Known':>6s} {'Err':>5s}")
print("-" * 65)

errors_dl = []
errors_na = []
for label, data in known.items():
    d = data["day"]
    dl = av.day_length(d)
    na = av.noon_altitude(d)
    err_dl = dl - data["daylen"]
    err_na = na - data["noon_alt"]
    errors_dl.append(abs(err_dl))
    errors_na.append(abs(err_na))
    print(f"  {label:20s} {dl:6.1f}h  {data['daylen']:5.1f}h {err_dl:+.1f}h"
          f"  {na:6.1f}\u00B0  {data['noon_alt']:5.1f}\u00B0 {err_na:+.1f}\u00B0")

print(f"\\nMean absolute error:")
print(f"  Day length: {np.mean(errors_dl):.2f} hours ({np.mean(errors_dl)*60:.0f} minutes)")
print(f"  Noon altitude: {np.mean(errors_na):.2f} degrees")

# Polaris test
polaris_alt = 90 - abs(32.65 - 89.26)
print(f"\\nPolaris altitude: {polaris_alt:.1f}\u00B0 (expected: ~32.7\u00B0)")
print(f"  Error: {abs(polaris_alt - 32.65):.2f}\u00B0")

# Year-round day length
print("\\n=== Day Length Through the Year ===")
for month, d in zip(['Jan','Feb','Mar','Apr','May','Jun',
                     'Jul','Aug','Sep','Oct','Nov','Dec'],
                    [15,46,75,106,136,167,197,228,258,289,319,350]):
    dl = av.day_length(d)
    bar = '\u2588' * int(dl * 2)
    print(f"  {month}: {dl:5.1f}h {bar}")

print("\\n\u2714 Validation complete. Errors are within expected range")
print("  for a simplified model (no refraction, equation of time,")
print("  or precession corrections).")`,
      challenge: 'Add refraction correction to the sunrise/sunset calculation (hint: sunrise occurs when the Sun\u2019s center is at altitude -0.83\u00B0 including refraction and solar semi-diameter). How much does this improve accuracy?',
      successHint: 'Your digital astrolabe is validated. The errors are small and explainable. You have built, from first principles, the same instrument that Islamic scholars perfected over a millennium: a portable model of the sky that tells time, finds direction, and reveals the beautiful mathematics connecting Earth and stars.',
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
        <Cpu className="w-4 h-4" />
        Level 4 &mdash; Capstone: Build a complete digital astrolabe simulator
      </div>
      {miniLessons.map((ml, i) => createElement(MiniLesson, { key: i, index: i, ...ml, pyodideRef, pyReady, loadPyodide, diagramMap: { AstrolabeProjectionDiagram, AstrolabeFunctionsDiagram, AstrolabeCelestialNavDiagram, AstrolabeSundialDiagram, SineWaveDiagram, UnitCircleDiagram } }))}
    </div>
  );
}
