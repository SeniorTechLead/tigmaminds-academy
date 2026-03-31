import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import AstrolabeSundialDiagram from '../diagrams/AstrolabeSundialDiagram';
import AstrolabeProjectionDiagram from '../diagrams/AstrolabeProjectionDiagram';
import AstrolabeCelestialNavDiagram from '../diagrams/AstrolabeCelestialNavDiagram';
import AstrolabeFunctionsDiagram from '../diagrams/AstrolabeFunctionsDiagram';
import UnitCircleDiagram from '../diagrams/UnitCircleDiagram';
import SineWaveDiagram from '../diagrams/SineWaveDiagram';

export default function AstrolabeLevel1() {
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
      title: 'Celestial coordinates — altitude and azimuth',
      concept: `To locate a star in the sky, you need two numbers — just like you need latitude and longitude to locate a city on Earth.

**Altitude** is how far above the horizon the star is: 0° means it is on the horizon, 90° means it is directly overhead (the zenith).

**Azimuth** is the compass direction: 0° = north, 90° = east, 180° = south, 270° = west.

Together, altitude and azimuth form the **horizontal coordinate system**. Every object in the sky has a unique (alt, az) pair at any given moment. But these coordinates change as the Earth rotates — a star that is at altitude 30° now will be at a different altitude an hour later.

In Python, we use **trigonometric functions** (sin, cos) to convert between angles and positions. The key relationship: if a star is at altitude α and azimuth θ, its position on a flat sky map is x = cos(α)·sin(θ) and y = cos(α)·cos(θ).`,
      analogy: 'Think of a clock face flat on a table. The hour hand points in a direction (azimuth). Now tilt the hand upward off the table — the tilt angle is the altitude. Together they point to any spot in the dome above you.',
      storyConnection: 'Zahra sighted Polaris with the alidade and read 32 degrees altitude. That single measurement told her the latitude of Isfahan. Every astrolabe reading starts with measuring altitude — the angle from horizon to star.',
      checkQuestion: 'A star is at altitude 45°, azimuth 90° (due east). If you face east and look halfway up from the horizon to directly overhead, where is the star?',
      checkAnswer: 'Exactly where you are looking. 45° is halfway between the horizon (0°) and the zenith (90°), and azimuth 90° is due east. The horizontal coordinate system is intuitive — it describes the sky exactly as you see it from where you stand.',
      codeIntro: 'Convert altitude and azimuth to x,y positions and plot a sky map of bright stars.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Bright stars: (name, altitude, azimuth) for a sample sky
stars = [
    ("Polaris",  89, 0),   ("Vega",    62, 80),
    ("Altair",   45, 170), ("Deneb",   70, 50),
    ("Capella",  55, 320), ("Sirius",  15, 210),
    ("Arcturus", 40, 250), ("Betelgeuse", 25, 190),
]

fig, ax = plt.subplots(figsize=(7, 7), subplot_kw={'projection': 'polar'})
ax.set_facecolor('#1a1a2e')

for name, alt, az in stars:
    r = 90 - alt  # distance from center (zenith = 0)
    theta = np.radians(az)
    ax.plot(theta, r, 'o', markersize=8, color='#fbbf24')
    ax.annotate(name, (theta, r), fontsize=7,
                color='white', textcoords="offset points",
                xytext=(5, 5))

ax.set_theta_zero_location('N')
ax.set_theta_direction(-1)
ax.set_rlim(0, 90)
ax.set_rticks([0, 30, 60, 90])
ax.set_yticklabels(['90°', '60°', '30°', '0° (horizon)'],
                    fontsize=7, color='#94a3b8')
ax.set_title('Sky Map (Altitude-Azimuth)', color='white', pad=15)
ax.grid(True, alpha=0.3)
plt.show()
print("Center = directly overhead (zenith, 90°)")
print("Edge = horizon (0°)")`,
      challenge: 'Add 3 more stars with made-up coordinates. What happens to a star at altitude 0°? It should appear at the edge of the plot — right on the horizon.',
      successHint: 'You just built a sky chart. The astrolabe does the same thing in brass: center = zenith, edge = horizon, and stars are positioned by altitude and azimuth.',
    },
    {
      title: 'The Sun’s daily path — computing solar altitude',
      concept: `The Sun does not stay at a fixed altitude. It rises, climbs to a maximum height at solar noon, and sets. The altitude of the Sun at any time depends on three things:

1. Your **latitude** (how far north or south you are)
2. The **solar declination** (how far north or south the Sun appears, which changes with the seasons: +23.4° at summer solstice, -23.4° at winter solstice)
3. The **hour angle** (how far the Sun has moved from its noon position, at 15° per hour)

The formula for solar altitude is:
**sin(alt) = sin(lat)·sin(dec) + cos(lat)·cos(dec)·cos(HA)**

This single equation is the heart of the astrolabe. Every time Zahra measured the Sun's altitude and read the time, she was solving this equation mechanically with brass circles.`,
      analogy: 'Imagine the Sun riding a tilted circular track across the sky. Your latitude sets how tilted the track is. The declination shifts the track north or south with the seasons. The hour angle is how far along the track the Sun has traveled since noon.',
      storyConnection: 'Zahra learned to tell time by measuring the Sun’s altitude with the alidade, then matching it on the astrolabe. The brass instrument solves the solar altitude equation mechanically — no calculator needed.',
      checkQuestion: 'At the equator (lat = 0°) on the equinox (dec = 0°) at solar noon (HA = 0°), what is the Sun’s altitude?',
      checkAnswer: 'sin(alt) = sin(0)·sin(0) + cos(0)·cos(0)·cos(0) = 0 + 1·1·1 = 1. So alt = arcsin(1) = 90°. The Sun is directly overhead! This is why equinoxes are special — the Sun passes through the zenith at the equator.',
      codeIntro: 'Plot the Sun’s altitude throughout the day for different latitudes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def solar_altitude(lat, dec, hour):
    """Compute Sun altitude given latitude, declination, and hour."""
    lat_r = np.radians(lat)
    dec_r = np.radians(dec)
    HA = np.radians((hour - 12) * 15)  # hour angle
    sin_alt = (np.sin(lat_r) * np.sin(dec_r) +
               np.cos(lat_r) * np.cos(dec_r) * np.cos(HA))
    alt = np.degrees(np.arcsin(np.clip(sin_alt, -1, 1)))
    return alt

hours = np.linspace(4, 20, 200)
dec = 23.4  # summer solstice

fig, ax = plt.subplots(figsize=(9, 5))
for lat, color, city in [(28, '#ef4444', 'Delhi 28°N'),
                          (32, '#fbbf24', 'Isfahan 32°N'),
                          (51, '#38bdf8', 'London 51°N'),
                          (64, '#a78bfa', 'Reykjavik 64°N')]:
    alts = [solar_altitude(lat, dec, h) for h in hours]
    ax.plot(hours, alts, color=color, linewidth=2, label=city)

ax.axhline(0, color='#475569', linewidth=1, linestyle='--')
ax.fill_between(hours, 0, -10, color='#1e293b', alpha=0.5)
ax.set_xlabel('Hour of day', color='#e2e8f0')
ax.set_ylabel('Sun altitude (°)', color='#e2e8f0')
ax.set_title('Sun\\'s Daily Arc — Summer Solstice', color='white')
ax.legend(fontsize=8)
ax.set_xlim(4, 20); ax.set_ylim(-10, 90)
ax.grid(True, alpha=0.2)
plt.show()

noon_isfahan = solar_altitude(32, 23.4, 12)
print(f"Isfahan noon altitude on summer solstice: {noon_isfahan:.1f}°")`,
      challenge: 'Change dec to 0 (equinox) and -23.4 (winter solstice). How does the Sun’s path change? Which city has the lowest noon Sun in winter?',
      successHint: 'The solar altitude equation is what the astrolabe computes mechanically. By rotating the rete to match the date, the tympan’s altitude circles give you the Sun’s height at any hour.',
    },
    {
      title: 'Time from the stars — sidereal vs solar time',
      concept: `There are two kinds of time: **solar time** (based on the Sun) and **sidereal time** (based on the stars).

A solar day is 24 hours — noon to noon. But a sidereal day is only **23 hours, 56 minutes, and 4 seconds**. Why the difference? Because the Earth is orbiting the Sun while it rotates. After one full rotation relative to the stars (sidereal day), the Earth has moved a bit along its orbit, so it needs to rotate about 1° more to bring the Sun back to the same position. That extra 1° takes about 4 minutes.

This means the stars rise 4 minutes earlier each night. Over a year, they cycle through a full 24-hour shift. The astrolabe accounts for this: the rete rotates slightly faster than once per day, matching sidereal time.

**Local Sidereal Time (LST)** tells you which stars are currently overhead. If you know the LST, you know the sky.`,
      analogy: 'Imagine running laps around a track while a friend stands in the centre. Each time you complete a lap (one rotation), your friend has turned slightly. You have to run a tiny bit more to face them again. That extra bit is the 4-minute difference between sidereal and solar time.',
      storyConnection: 'Zahra learned to tell time at night by sighting a star, finding it on the rete, and rotating the rete until star and altitude matched. She was using sidereal time — the astrolabe’s rete is a sidereal clock.',
      checkQuestion: 'If Vega rises at 9:00 PM tonight, what time will it rise tomorrow night?',
      checkAnswer: '8:56 PM — four minutes earlier. Stars rise 4 minutes earlier each night because the sidereal day is 4 minutes shorter than the solar day. Over a month, that’s about 2 hours earlier. Over a year, the full 24 hours cycle back around.',
      codeIntro: 'Compute local sidereal time and show which stars are above the horizon right now.',
      code: `import numpy as np

def local_sidereal_time(day_of_year, hour, longitude):
    """Approximate LST in hours for a given date/time/longitude."""
    # LST ~ solar time + offset that increases ~4 min/day
    lst = hour + (day_of_year * 24 / 365.25) + (longitude / 15)
    return lst % 24

# Isfahan: longitude 51.7E, day 172 (June 21), 10 PM local
lst = local_sidereal_time(172, 22, 51.7)
print(f"Local Sidereal Time: {int(lst)}h {int((lst % 1) * 60)}m")
print()

# Star catalog: name, RA (hours), Dec (degrees)
stars = [
    ("Vega",       18.62, 38.8),
    ("Altair",     19.85, 8.9),
    ("Deneb",      20.69, 45.3),
    ("Polaris",     2.53, 89.3),
    ("Sirius",      6.75, -16.7),
    ("Capella",     5.27, 46.0),
    ("Betelgeuse",  5.92, 7.4),
    ("Arcturus",   14.26, 19.2),
]

print("Stars currently above the horizon (Isfahan, June 21, 10 PM):")
print("-" * 50)
lat = 32  # Isfahan

for name, ra, dec in stars:
    # Hour angle = LST - RA
    ha = (lst - ra) * 15  # convert to degrees
    ha_r = np.radians(ha)
    lat_r = np.radians(lat)
    dec_r = np.radians(dec)
    sin_alt = (np.sin(lat_r) * np.sin(dec_r) +
               np.cos(lat_r) * np.cos(dec_r) * np.cos(ha_r))
    alt = np.degrees(np.arcsin(np.clip(sin_alt, -1, 1)))
    status = "ABOVE" if alt > 0 else "below"
    print(f"  {name:12s}  alt = {alt:+6.1f}°  [{status}]")`,
      challenge: 'Change the hour to 4 AM (hour=4) and see which stars have set and which new ones have risen. The sky rotates!',
      successHint: 'Sidereal time is the key to star positions. The astrolabe’s rete encodes the same star catalog you just built in Python — but in brass pointers instead of code.',
    },
    {
      title: 'The 15°-per-hour rule and time zones',
      concept: `The Earth rotates 360° in 24 hours, which means **15° per hour**. This single number connects geography to timekeeping.

If you know the Sun's position and your longitude, you can compute the exact local solar time. But "local solar time" varies continuously — every kilometer east or west shifts the time by a few seconds. That was fine when the fastest travel was by horse.

When railroads arrived in the 19th century, the chaos of thousands of local times became dangerous (trains collided because stations didn't agree on the time). In 1884, the world adopted **standard time zones**: 24 strips, each 15° wide, centered on multiples of 15° longitude. Greenwich (0°) is the reference — UTC+0.

The astrolabe predates time zones by centuries, but it computes local solar time naturally. The difference between solar time at two locations is simply their longitude difference divided by 15.`,
      analogy: 'Time zones are like drawing 24 vertical stripes on a spinning globe. Each stripe agrees on one time. Without stripes, every point has its own slightly different time — a nightmare for scheduling.',
      storyConnection: 'Zahra could compute the time at any longitude using her astrolabe and a star catalog. Islamic astronomers maintained tables of city longitudes specifically for this purpose — so travellers could adjust their prayer times.',
      checkQuestion: 'Isfahan is at 51.7°E longitude. Delhi is at 77.1°E. What is the solar time difference?',
      checkAnswer: 'Longitude difference = 77.1 - 51.7 = 25.4°. Time difference = 25.4 / 15 = 1.69 hours, or about 1 hour 41 minutes. Delhi’s solar noon arrives 1h41m before Isfahan’s because Delhi is further east.',
      codeIntro: 'Calculate solar time differences between cities and visualise time zones.',
      code: `import numpy as np
import matplotlib.pyplot as plt

cities = {
    "London":    (51.5, -0.1),
    "Cairo":     (30.0, 31.2),
    "Isfahan":   (32.7, 51.7),
    "Delhi":     (28.6, 77.1),
    "Beijing":   (39.9, 116.4),
    "Tokyo":     (35.7, 139.7),
    "New York":  (40.7, -74.0),
    "Mecca":     (21.4, 39.8),
}

# Solar time difference from Isfahan
isfahan_lon = 51.7
print("Solar time offset from Isfahan:")
print("-" * 45)
for city, (lat, lon) in sorted(cities.items(), key=lambda x: x[1][1]):
    diff_hrs = (lon - isfahan_lon) / 15
    sign = "+" if diff_hrs >= 0 else ""
    mins = abs(diff_hrs * 60)
    print(f"  {city:12s}  lon={lon:+7.1f}°  {sign}{diff_hrs:.2f}h  ({int(mins)}min)")

# Plot cities on a longitude strip
fig, ax = plt.subplots(figsize=(10, 3))
for city, (lat, lon) in cities.items():
    tz = round(lon / 15)
    ax.plot(lon, 0, 'o', markersize=10, color='#fbbf24')
    ax.annotate(city, (lon, 0.15), fontsize=8, color='white',
                ha='center', rotation=45)

# Time zone boundaries
for tz in range(-12, 13):
    ax.axvline(tz * 15 - 7.5, color='#334155', linewidth=0.5)
    ax.text(tz * 15, -0.4, f'UTC{tz:+d}', ha='center',
            fontsize=6, color='#64748b')

ax.set_xlim(-180, 180); ax.set_ylim(-0.6, 0.6)
ax.set_xlabel('Longitude', color='#e2e8f0')
ax.set_title('Cities & Time Zones (15° per hour)', color='white')
ax.set_yticks([])
plt.show()`,
      challenge: 'The qibla direction (towards Mecca) was crucial for Islamic astronomers. Add code to calculate the longitude difference between each city and Mecca.',
      successHint: 'The 15°/hour rule is simple but powerful. The astrolabe uses it implicitly — the 360° limb scale divided by 24 gives 15° per hour division.',
    },
    {
      title: 'Degrees, radians, and trigonometry',
      concept: `Every astrolabe calculation uses **trigonometry** — the mathematics of angles and triangles. Before going further, let's make sure the foundations are solid.

**Degrees** divide a full circle into 360 parts. **Radians** divide it into 2π parts (about 6.283). Python's math functions use radians, so you often need to convert: radians = degrees × π/180.

The three key functions:
- **sin(θ)** = opposite / hypotenuse
- **cos(θ)** = adjacent / hypotenuse
- **tan(θ)** = opposite / adjacent = sin(θ) / cos(θ)

For the astrolabe, the most important identity is:
**sin(alt) = sin(lat)·sin(dec) + cos(lat)·cos(dec)·cos(HA)**

This is the spherical law of cosines, and it connects every measurable angle on the astrolabe.`,
      analogy: 'Trigonometry is the language of circles. Just as you need words to describe a story, you need sin, cos, and tan to describe the positions and paths of stars on the celestial sphere.',
      storyConnection: 'When Ibn al-Haytham said "the geometry of circles and the trigonometry of spheres," he meant exactly these functions. Islamic mathematicians refined trigonometry far beyond the Greek originals, developing the sine, cosine, and tangent tables that astrolabe makers depended on.',
      checkQuestion: 'What is sin(90°)? And why does this matter for the astrolabe?',
      checkAnswer: 'sin(90°) = 1. It matters because when a star is at 90° altitude (directly overhead), sin(alt) = 1. The solar altitude formula then requires sin(lat)·sin(dec) + cos(lat)·cos(dec) = 1, which only happens when lat = dec. This tells you exactly which latitude the Sun passes directly overhead on a given day.',
      codeIntro: 'Build a visual unit circle with sin and cos, then apply it to altitude calculations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Unit circle
theta = np.linspace(0, 2*np.pi, 360)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.5))

# Left: unit circle with sin/cos
ax1.plot(np.cos(theta), np.sin(theta), color='#475569')
angle = np.radians(32)  # Isfahan latitude
ax1.plot([0, np.cos(angle)], [0, np.sin(angle)], 'o-',
         color='#fbbf24', linewidth=2, markersize=6)
ax1.plot([np.cos(angle), np.cos(angle)], [0, np.sin(angle)],
         '--', color='#ef4444', linewidth=1.5, label=f'sin(32°) = {np.sin(angle):.3f}')
ax1.plot([0, np.cos(angle)], [0, 0],
         '--', color='#38bdf8', linewidth=1.5, label=f'cos(32°) = {np.cos(angle):.3f}')
ax1.set_xlim(-1.3, 1.3); ax1.set_ylim(-1.3, 1.3)
ax1.set_aspect('equal'); ax1.grid(True, alpha=0.2)
ax1.legend(fontsize=8)
ax1.set_title('Unit Circle at 32° (Isfahan)', color='white', fontsize=10)

# Right: sin and cos waves
angles = np.linspace(0, 90, 100)
ax2.plot(angles, np.sin(np.radians(angles)), color='#ef4444',
         linewidth=2, label='sin(θ)')
ax2.plot(angles, np.cos(np.radians(angles)), color='#38bdf8',
         linewidth=2, label='cos(θ)')
ax2.axvline(32, color='#fbbf24', linestyle='--', alpha=0.5,
            label='32° (Isfahan)')
ax2.set_xlabel('Angle (°)', color='#e2e8f0')
ax2.set_title('Trig Functions 0°–90°', color='white', fontsize=10)
ax2.legend(fontsize=8); ax2.grid(True, alpha=0.2)
plt.tight_layout()
plt.show()

print(f"sin(32°) = {np.sin(np.radians(32)):.4f}")
print(f"cos(32°) = {np.cos(np.radians(32)):.4f}")
print(f"tan(32°) = {np.tan(np.radians(32)):.4f}")`,
      challenge: 'The alidade measures the altitude of a minaret as 38° from 50 meters away. Height = 50 × tan(38°). Compute this — it is exactly how Zahra surveyed the mosque.',
      successHint: 'Trig is the language of the astrolabe. Every circle on the tympan, every star pointer on the rete, every time reading — all computed through sin, cos, and tan.',
    },
    {
      title: 'Sunrise and sunset — predicting daylight hours',
      concept: `One of the astrolabe's most practical functions: predicting when the Sun rises and sets on any day of the year.

Sunrise and sunset happen when the Sun's altitude equals 0°. Setting sin(alt) = 0 in the solar altitude formula:
0 = sin(lat)·sin(dec) + cos(lat)·cos(dec)·cos(HA)

Solving for the hour angle:
**cos(HA_sunrise) = -tan(lat)·tan(dec)**

The sunrise hour angle gives the time before noon; sunset is the same angle after noon. Day length = 2 × HA_sunrise / 15 hours.

When tan(lat)·tan(dec) > 1 or < -1, the formula has no solution — meaning the Sun never sets (midnight sun) or never rises (polar night). This happens inside the Arctic and Antarctic circles.`,
      analogy: 'Imagine tilting a hula hoop (the Sun’s path) over a table (the horizon). When the hoop is steeply tilted, a big chunk is above the table (long day). When it’s barely tilted, most is below (short day). Tilt it enough and the whole hoop is above — the Sun never sets.',
      storyConnection: 'Zahra learned to predict sunrise and sunset by setting the rete to the date and reading where the ecliptic crosses the horizon line. The astrolabe gives the answer visually — no formula needed. But the formula is what makes the brass circles work.',
      checkQuestion: 'At the equator (lat=0°), what is the day length on any day? Hint: tan(0) = 0.',
      checkAnswer: 'cos(HA) = -tan(0)·tan(dec) = 0. So HA = 90°. Day length = 2 × 90/15 = 12 hours. At the equator, every day is exactly 12 hours long regardless of season. This is why "equator" comes from the same root as "equal."',
      codeIntro: 'Calculate and plot day length throughout the year for different latitudes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def day_length(lat, dec):
    """Hours of daylight given latitude and solar declination."""
    lat_r = np.radians(lat)
    dec_r = np.radians(dec)
    cos_ha = -np.tan(lat_r) * np.tan(dec_r)
    if cos_ha <= -1: return 24.0  # midnight sun
    if cos_ha >= 1:  return 0.0   # polar night
    ha = np.degrees(np.arccos(cos_ha))
    return 2 * ha / 15

# Solar declination throughout the year
days = np.arange(1, 366)
dec = 23.44 * np.sin(np.radians((days - 81) * 360 / 365))

fig, ax = plt.subplots(figsize=(9, 5))
for lat, color, city in [(0, '#10b981', 'Equator'),
                          (28, '#ef4444', 'Delhi 28°N'),
                          (32, '#fbbf24', 'Isfahan 32°N'),
                          (51, '#38bdf8', 'London 51°N'),
                          (66.5, '#a78bfa', 'Arctic Circle')]:
    lengths = [day_length(lat, d) for d in dec]
    ax.plot(days, lengths, color=color, linewidth=2, label=city)

ax.axhline(12, color='#475569', linestyle='--', linewidth=1)
ax.set_xlabel('Day of year', color='#e2e8f0')
ax.set_ylabel('Hours of daylight', color='#e2e8f0')
ax.set_title('Day Length Through the Year', color='white')
ax.set_xlim(1, 365); ax.set_ylim(0, 24)
months = ['Jan','Feb','Mar','Apr','May','Jun',
          'Jul','Aug','Sep','Oct','Nov','Dec']
ax.set_xticks(np.cumsum([0,31,28,31,30,31,30,31,31,30,31,30]))
ax.set_xticklabels(months, fontsize=7, color='#94a3b8')
ax.legend(fontsize=8); ax.grid(True, alpha=0.2)
plt.show()

# Isfahan summer solstice
print(f"Isfahan, June 21: {day_length(32, 23.44):.1f} hours of daylight")
print(f"Isfahan, Dec 21:  {day_length(32, -23.44):.1f} hours of daylight")`,
      challenge: 'Find the latitude where the longest day is exactly 18 hours. Try different latitudes until day_length(lat, 23.44) returns 18.0. (Hint: it’s around 58°N — close to Stockholm.)',
      successHint: 'You’ve built a day-length calculator that works for any latitude and any date. The astrolabe does the same thing: set the rete to the date, and the horizon line on the tympan shows you sunrise, sunset, and everything in between.',
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
        Level 1 &mdash; Celestial coordinates, solar time, and the Sun&apos;s path
      </div>
      {miniLessons.map((ml, i) => createElement(MiniLesson, { key: i, index: i, ...ml, pyodideRef, pyReady, loadPyodide, diagramMap: { AstrolabeSundialDiagram, AstrolabeProjectionDiagram, AstrolabeCelestialNavDiagram, AstrolabeFunctionsDiagram, UnitCircleDiagram, SineWaveDiagram } }))}
    </div>
  );
}
