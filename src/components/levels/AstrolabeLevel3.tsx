import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';
import AstrolabeProjectionDiagram from '../diagrams/AstrolabeProjectionDiagram';
import AstrolabeFunctionsDiagram from '../diagrams/AstrolabeFunctionsDiagram';
import AstrolabeCelestialNavDiagram from '../diagrams/AstrolabeCelestialNavDiagram';
import CorrelationDiagram from '../diagrams/CorrelationDiagram';
import MeanMedianModeDiagram from '../diagrams/MeanMedianModeDiagram';
import SineWaveDiagram from '../diagrams/SineWaveDiagram';

export default function AstrolabeLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Measurement precision — how accurate can a brass disc be?',
      concept: `Every measuring instrument has a **precision limit** set by its physical design. For a brass astrolabe with a 20 cm diameter, the outer limb has a circumference of about 63 cm. Divided into 360 degrees, each degree occupies about 1.75 mm. You can read to maybe half a degree by eye — about 0.9 mm of arc.

Half a degree of error in altitude translates to about **55 km of latitude error** when navigating (since 1° of latitude = 111 km). For a sailor at sea, that might mean missing a port by 55 km. For telling time, 0.5° of solar altitude error means about **2 minutes of time error** near noon.

Islamic instrument makers pushed precision further by using larger instruments, finer engraving, and the **alidade with sighting vanes** that reduced parallax errors. The best astrolabes could achieve 0.1°–0.2° precision — about 10–20 km of navigation accuracy.`,
      analogy: 'Reading an astrolabe is like reading a ruler. A plastic ruler marked in centimeters lets you estimate to 0.5 cm. A steel ruler marked in millimeters lets you estimate to 0.2 mm. The finer the markings and the larger the instrument, the more precisely you can read it.',
      storyConnection: 'Zahra’s father was a coppersmith who made astrolabes for the observatory. The quality of his engraving directly determined how precisely the astronomers could measure. Craft precision and scientific accuracy are inseparable.',
      checkQuestion: 'A 30 cm diameter astrolabe has a circumference of about 94 cm. If it is divided into 360°, how many mm per degree?',
      checkAnswer: '94 cm / 360 = 0.261 cm = 2.61 mm per degree. You might read this to 0.25°, giving 28 km of latitude precision. A 50% increase in size gives roughly 50% better precision.',
      codeIntro: 'Model how instrument size affects measurement precision and navigation error.',
      code: `import numpy as np
import matplotlib.pyplot as plt

diameters = np.arange(5, 55, 5)  # cm
circumferences = np.pi * diameters
mm_per_degree = circumferences * 10 / 360

# Assume eye can resolve 0.8 mm -> precision in degrees
eye_resolution = 0.8  # mm
precision_deg = eye_resolution / mm_per_degree
navigation_error_km = precision_deg * 111  # km per degree latitude
time_error_min = precision_deg * 4  # ~4 min per degree near noon

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.5))

ax1.plot(diameters, precision_deg, 'o-', color='#fbbf24', linewidth=2)
ax1.set_xlabel('Astrolabe diameter (cm)', color='#e2e8f0')
ax1.set_ylabel('Angular precision (°)', color='#e2e8f0')
ax1.set_title('Precision vs Size', color='white')
ax1.grid(True, alpha=0.2)
# Mark common sizes
for d, label in [(15, 'Pocket'), (25, 'Standard'), (40, 'Observatory')]:
    p = eye_resolution / (np.pi * d * 10 / 360)
    ax1.annotate(label, (d, p), fontsize=8, color='#38bdf8',
                 xytext=(5, 10), textcoords='offset points')

ax2.plot(diameters, navigation_error_km, 'o-', color='#ef4444',
         linewidth=2, label='Latitude error (km)')
ax2.plot(diameters, time_error_min, 's-', color='#10b981',
         linewidth=2, label='Time error (min)')
ax2.set_xlabel('Astrolabe diameter (cm)', color='#e2e8f0')
ax2.set_ylabel('Error', color='#e2e8f0')
ax2.set_title('Navigation & Time Error', color='white')
ax2.legend(fontsize=8); ax2.grid(True, alpha=0.2)

plt.tight_layout()
plt.show()

print("\\n=== Summary ===")
for d in [15, 25, 40]:
    p = eye_resolution / (np.pi * d * 10 / 360)
    print(f"  {d}cm: {p:.2f}° precision = {p*111:.0f}km nav / {p*4:.1f}min time")`,
      challenge: 'Some observatory instruments were over 1 meter in diameter. Compute the precision of a 100 cm astrolabe. At what size does precision reach 0.1°?',
      successHint: 'Precision engineering is a theme throughout the Islamic Golden Age. Astronomers demanded better instruments, which drove craftsmen to develop finer techniques. Science and craft advancing together — exactly as Ibn al-Haytham told Zahra.',
    },
    {
      title: 'Error analysis — quantifying uncertainty',
      concept: `Every measurement has uncertainty. When Zahra read 32° for Polaris, the true altitude might have been anywhere from 31.5° to 32.5°. How do we handle this?

**Systematic errors** are consistent biases: maybe the alidade is slightly bent, always reading 0.3° too high. These can be corrected once discovered.

**Random errors** vary unpredictably: hand tremor, atmospheric shimmer, reading the scale slightly differently each time. These are reduced by **averaging multiple measurements**.

If you take N measurements and each has a random error of σ, the average has an error of **σ/√N**. Ten measurements reduce the error by a factor of √10 ≈ 3.16. This is why astronomers take many readings.

The **standard deviation** quantifies spread: for measurements x₁, x₂, ... x_N with mean μ:
σ = √(average of (xᵢ - μ)²)`,
      analogy: 'Imagine throwing darts at a target. Systematic error is like aiming consistently left — every dart hits left of center. Random error is like scattered darts around your aim point. Averaging multiple darts tells you where you are really aiming, even if individual throws scatter.',
      storyConnection: 'Islamic astronomers at observatories like Isfahan’s took repeated measurements of star positions and averaged them. Their star catalogs were the most accurate in the world for centuries because they understood the power of repeated observation.',
      checkQuestion: 'You take 25 measurements of Polaris altitude, each with random error σ = 0.5°. What is the error in the average?',
      checkAnswer: 'σ/√25 = 0.5/5 = 0.1°. Twenty-five measurements reduce the error by a factor of 5. This is why astronomers observed the same star on many nights — more measurements = more precision.',
      codeIntro: 'Simulate repeated astrolabe measurements and show how averaging reduces error.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
true_altitude = 32.65  # true Polaris altitude at Isfahan
instrument_error = 0.5  # degrees (single measurement)

# Simulate measurements
n_measurements = [1, 5, 10, 25, 50, 100]
n_trials = 1000

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.5))

# Left: distribution of single vs averaged measurements
single = np.random.normal(true_altitude, instrument_error, 1000)
avg_25 = [np.mean(np.random.normal(true_altitude, instrument_error, 25))
          for _ in range(1000)]

ax1.hist(single, bins=30, alpha=0.6, color='#ef4444', label='Single reading')
ax1.hist(avg_25, bins=30, alpha=0.6, color='#10b981', label='Average of 25')
ax1.axvline(true_altitude, color='#fbbf24', linewidth=2,
            linestyle='--', label=f'True value ({true_altitude}°)')
ax1.set_xlabel('Measured altitude (°)', color='#e2e8f0')
ax1.set_ylabel('Count', color='#e2e8f0')
ax1.set_title('Single vs Averaged Measurements', color='white')
ax1.legend(fontsize=8)

# Right: error vs number of measurements
errors = []
for n in n_measurements:
    avgs = [np.mean(np.random.normal(true_altitude, instrument_error, n))
            for _ in range(n_trials)]
    errors.append(np.std(avgs))

theoretical = instrument_error / np.sqrt(n_measurements)
ax2.plot(n_measurements, errors, 'o-', color='#38bdf8',
         linewidth=2, label='Simulated')
ax2.plot(n_measurements, theoretical, '--', color='#fbbf24',
         linewidth=2, label='σ/√N (theory)')
ax2.set_xlabel('Number of measurements', color='#e2e8f0')
ax2.set_ylabel('Error in average (°)', color='#e2e8f0')
ax2.set_title('Error Reduction by Averaging', color='white')
ax2.legend(fontsize=8); ax2.grid(True, alpha=0.2)

plt.tight_layout()
plt.show()

print(f"Single measurement error: ±{instrument_error:.2f}° = ±{instrument_error*111:.0f} km")
print(f"Average of 25: ±{instrument_error/5:.2f}° = ±{instrument_error/5*111:.0f} km")
print(f"Average of 100: ±{instrument_error/10:.2f}° = ±{instrument_error/10*111:.0f} km")`,
      challenge: 'Add a systematic error of +0.3° (biased alidade). Now the average converges to the wrong value. How would an astronomer detect and correct this?',
      successHint: 'Error analysis is how science makes progress. Islamic astronomers understood this: their star catalogs improved over centuries as they accumulated more measurements and better instruments.',
    },
    {
      title: 'Atmospheric refraction — the sky lies',
      concept: `When you measure a star's altitude with an astrolabe, the atmosphere bends the light slightly upward. This is **atmospheric refraction**, and it makes every object appear **higher** than it truly is.

The effect is worst near the horizon: a star at true altitude 0° appears at about 0.57° (34 arcminutes). At true altitude 10°, the error is about 5 arcminutes. Above 45°, refraction is negligible.

This means when you see the Sun touching the horizon at sunset, it has already geometrically set — the Sun's disk is entirely below the horizon, but refraction bends its image upward so you can still see it. This adds about 2 extra minutes to every day.

The approximate refraction correction is:
**R ≈ 1/tan(h + 7.31/(h + 4.4))** (arcminutes)

where h is the apparent altitude in degrees.`,
      analogy: 'Stick a pencil in a glass of water and it looks bent at the surface. The atmosphere does the same to starlight — dense air near the ground bends light more than thin air above. Objects near the horizon are "bent" upward the most.',
      storyConnection: 'Islamic astronomers were among the first to tabulate refraction corrections. Ibn al-Haytham himself wrote the foundational work on optics (Kitab al-Manazir) that explained how light bends when passing between materials of different density.',
      checkQuestion: 'If the Sun’s true altitude is -0.57° (below the horizon), can you still see it?',
      checkAnswer: 'Yes! Atmospheric refraction at the horizon is about 0.57° upward. A Sun at true altitude -0.57° is refracted to apparent altitude 0° — right on the horizon. This is why sunset lasts longer than it "should."',
      codeIntro: 'Compute and visualise atmospheric refraction at different altitudes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def refraction(h_apparent):
    """Atmospheric refraction in arcminutes.
    h_apparent: apparent altitude in degrees."""
    if h_apparent < -1: return 0
    h = max(h_apparent, 0.1)
    return 1.0 / np.tan(np.radians(h + 7.31 / (h + 4.4)))

altitudes = np.linspace(0, 90, 200)
refr = [refraction(h) for h in altitudes]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.5))

# Left: refraction vs altitude
ax1.plot(altitudes, refr, color='#ef4444', linewidth=2)
ax1.set_xlabel('Apparent altitude (°)', color='#e2e8f0')
ax1.set_ylabel('Refraction (arcminutes)', color='#e2e8f0')
ax1.set_title('Atmospheric Refraction', color='white')
ax1.grid(True, alpha=0.2)
ax1.annotate(f'At horizon: {refraction(0):.1f}\'',
             (0, refraction(0)), fontsize=9, color='#fbbf24',
             xytext=(10, -10), textcoords='offset points')
ax1.annotate(f'At 10°: {refraction(10):.1f}\'',
             (10, refraction(10)), fontsize=9, color='#fbbf24',
             xytext=(10, 5), textcoords='offset points')

# Right: effect on sunset timing
# At Isfahan (32°N), June 21, how much extra daylight?
lat = 32
dec = 23.44

# True sunset: alt = 0
cos_ha = -np.tan(np.radians(lat)) * np.tan(np.radians(dec))
ha_true = np.degrees(np.arccos(cos_ha))

# Apparent sunset: alt = -0.57 (refracted to horizon)
cos_ha_ref = ((-np.sin(np.radians(-0.57)) -
              np.sin(np.radians(lat)) * np.sin(np.radians(dec))) /
             (np.cos(np.radians(lat)) * np.cos(np.radians(dec))))
cos_ha_ref = np.clip(cos_ha_ref, -1, 1)
ha_refr = np.degrees(np.arccos(cos_ha_ref))

extra_minutes = 2 * (ha_refr - ha_true) / 15 * 60

# Bar chart
cities = ['Equator', 'Delhi', 'Isfahan', 'London', 'Tromso']
lats = [0, 28, 32, 51, 69.6]
extras = []
for la in lats:
    c1 = -np.tan(np.radians(la)) * np.tan(np.radians(dec))
    c1 = np.clip(c1, -1, 1)
    h1 = np.degrees(np.arccos(c1))
    c2 = ((-np.sin(np.radians(-0.57)) -
          np.sin(np.radians(la)) * np.sin(np.radians(dec))) /
         (np.cos(np.radians(la)) * np.cos(np.radians(dec))))
    c2 = np.clip(c2, -1, 1)
    h2 = np.degrees(np.arccos(c2))
    extras.append(2 * (h2 - h1) / 15 * 60)

ax2.barh(cities, extras, color='#38bdf8')
ax2.set_xlabel('Extra daylight from refraction (min)', color='#e2e8f0')
ax2.set_title('Refraction Extends Every Day', color='white')
ax2.grid(True, alpha=0.2, axis='x')

plt.tight_layout()
plt.show()

print(f"Isfahan: refraction adds {extra_minutes:.1f} extra minutes of daylight")
print(f"At higher latitudes, the effect is even stronger!")`,
      challenge: 'The Moon appears larger at the horizon than overhead (the Moon illusion). Is this caused by refraction? (No — refraction actually slightly compresses the Moon’s vertical diameter. The illusion is psychological.)',
      successHint: 'Every precision instrument must account for the medium between observer and target. Atmospheric refraction is the astrolabe’s biggest source of systematic error, and Islamic astronomers developed the first correction tables for it.',
    },
    {
      title: 'Calibrating with known stars — instrument verification',
      concept: `How do you know your astrolabe is accurate? You **calibrate** it against known reference points.

The process:
1. Measure the altitude of a star whose position is precisely known (like Polaris)
2. Compare your reading to the predicted altitude from a star catalog
3. The difference is your **instrument error**
4. Repeat for multiple stars at different altitudes to check for **scale errors** (where the error varies with altitude)

A well-made astrolabe should have consistent small errors. If the error is +0.3° at low altitudes but -0.2° at high altitudes, the degree scale is not evenly engraved. If the error is +0.3° everywhere, the alidade has a fixed offset.

Modern instruments use the same principle: GPS receivers calibrate against known satellite positions; telescopes calibrate against reference stars.`,
      analogy: 'Calibration is like checking a kitchen scale by weighing a 1 kg bag of sugar. If the scale reads 1.02 kg, you know every reading is 2% too high. You can then correct all future readings by that offset. An astrolabe is calibrated by "weighing" known stars.',
      storyConnection: 'When Ibn al-Haytham gave Zahra the task of sighting Polaris, he was teaching her calibration. Polaris is the most reliable reference point in the Northern Hemisphere sky — nearly stationary, well-cataloged, always visible.',
      checkQuestion: 'You calibrate against 5 stars and get errors of +0.2, +0.3, +0.1, +0.2, +0.3°. Is this a systematic or random error?',
      checkAnswer: 'Systematic — all errors are positive. The alidade likely has a fixed offset of about +0.22° (the mean). A random error pattern would have positive and negative values scattered around zero.',
      codeIntro: 'Simulate calibrating an astrolabe against reference stars and computing correction factors.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# True star altitudes (from a precise catalog)
stars = [("Polaris", 32.65), ("Vega", 62.3), ("Altair", 44.8),
         ("Capella", 55.1), ("Arcturus", 38.7), ("Deneb", 69.5),
         ("Betelgeuse", 24.9), ("Sirius", 15.2)]

# Simulated astrolabe readings (with systematic + random error)
systematic_error = 0.25  # degrees (alidade offset)
random_error = 0.3       # degrees (reading precision)

readings = []
for name, true_alt in stars:
    measured = true_alt + systematic_error + np.random.normal(0, random_error)
    readings.append((name, true_alt, measured))

# Compute errors
names = [r[0] for r in readings]
true_vals = np.array([r[1] for r in readings])
measured_vals = np.array([r[2] for r in readings])
errors = measured_vals - true_vals

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.5))

# Left: error vs true altitude
ax1.bar(names, errors, color=['#ef4444' if e > 0 else '#38bdf8' for e in errors])
ax1.axhline(np.mean(errors), color='#fbbf24', linewidth=2,
            linestyle='--', label=f'Mean error: {np.mean(errors):+.2f}°')
ax1.axhline(0, color='#475569', linewidth=1)
ax1.set_ylabel('Error (°)', color='#e2e8f0')
ax1.set_title('Calibration Errors', color='white')
ax1.legend(fontsize=8)
plt.setp(ax1.get_xticklabels(), rotation=45, fontsize=7)

# Right: corrected readings
corrected = measured_vals - np.mean(errors)
residuals = corrected - true_vals
ax2.scatter(true_vals, residuals, color='#10b981', s=60)
ax2.axhline(0, color='#fbbf24', linewidth=1, linestyle='--')
ax2.set_xlabel('True altitude (°)', color='#e2e8f0')
ax2.set_ylabel('Residual error after correction (°)', color='#e2e8f0')
ax2.set_title('After Systematic Correction', color='white')
ax2.grid(True, alpha=0.2)

for i, name in enumerate(names):
    ax2.annotate(name, (true_vals[i], residuals[i]),
                 fontsize=7, color='#94a3b8')

plt.tight_layout()
plt.show()

print("=== Calibration Summary ===")
print(f"Systematic error (mean):  {np.mean(errors):+.3f}°")
print(f"Random error (std):       {np.std(errors):.3f}°")
print(f"After correction, RMS:    {np.sqrt(np.mean(residuals**2)):.3f}°")
print(f"Navigation accuracy:      ±{np.sqrt(np.mean(residuals**2))*111:.0f} km")`,
      challenge: 'Add a scale error: make the systematic error proportional to altitude (e.g., 0.005 × altitude). Now the mean correction is not enough — you need a linear fit. Implement least-squares correction.',
      successHint: 'Calibration transforms a good instrument into a precise one. Islamic astronomers calibrated their astrolabes at purpose-built observatories, maintaining star catalogs that served as their "ground truth" for centuries.',
    },
    {
      title: 'The qibla problem — spherical trigonometry',
      concept: `One of the astrolabe's most important functions for Muslim scholars: finding the **qibla** — the direction of Mecca from any location on Earth.

This is a problem in **spherical trigonometry**. On a flat surface, the shortest path between two points is a straight line. On a sphere, it is a **great circle** — the intersection of the sphere with a plane through its center.

The bearing (direction) from point A to point B on a sphere is:

**bearing = atan2(sin(Δλ)·cos(φ₂), cos(φ₁)·sin(φ₂) - sin(φ₁)·cos(φ₂)·cos(Δλ))**

where φ = latitude, λ = longitude, and Δλ = longitude difference.

This formula gives the initial bearing of the great circle from A to B. For Mecca (φ=21.42°N, λ=39.83°E), this bearing is the qibla.`,
      analogy: 'If you stretch a string on a globe between two cities and pull it taut, the string follows the great circle. The direction the string leaves your city is the bearing. On a flat map, this path looks curved. On the globe, it is the shortest route.',
      storyConnection: 'Zahra learned to find the qibla from Isfahan using the astrolabe. Islamic astronomers developed extensive qibla tables for hundreds of cities, all computed using the spherical trigonometry formula above.',
      checkQuestion: 'Why can’t you just draw a straight line on a flat map from your city to Mecca?',
      checkAnswer: 'Because flat maps distort distances and directions. A straight line on a Mercator map is a **rhumb line** (constant compass bearing), not the shortest path. The true shortest path (great circle) appears curved on most flat maps. The error can be many degrees for distant cities.',
      codeIntro: 'Calculate the qibla direction from cities worldwide using the great-circle bearing formula.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def qibla_bearing(lat1, lon1, lat2=21.42, lon2=39.83):
    """Great-circle bearing from (lat1,lon1) to Mecca."""
    phi1, phi2 = np.radians(lat1), np.radians(lat2)
    dl = np.radians(lon2 - lon1)
    x = np.sin(dl) * np.cos(phi2)
    y = (np.cos(phi1) * np.sin(phi2) -
         np.sin(phi1) * np.cos(phi2) * np.cos(dl))
    bearing = np.degrees(np.arctan2(x, y)) % 360
    return bearing

def great_circle_dist(lat1, lon1, lat2=21.42, lon2=39.83):
    """Distance in km via Haversine formula."""
    phi1, phi2 = np.radians(lat1), np.radians(lat2)
    dp = np.radians(lat2 - lat1)
    dl = np.radians(lon2 - lon1)
    a = np.sin(dp/2)**2 + np.cos(phi1)*np.cos(phi2)*np.sin(dl/2)**2
    return 6371 * 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))

cities = {
    "Isfahan":    (32.65, 51.68),
    "Cairo":      (30.04, 31.24),
    "Istanbul":   (41.01, 28.98),
    "Delhi":      (28.61, 77.21),
    "Jakarta":    (-6.21, 106.85),
    "London":     (51.51, -0.13),
    "New York":   (40.71, -74.01),
    "Tokyo":      (35.68, 139.69),
    "Cordoba":    (37.88, -4.78),
    "Timbuktu":   (16.77, -3.01),
}

print("=== Qibla Direction from Major Cities ===")
print(f"{'City':15s} {'Qibla (°)':>10s} {'Distance (km)':>14s}")
print("-" * 42)
for city, (lat, lon) in sorted(cities.items()):
    q = qibla_bearing(lat, lon)
    d = great_circle_dist(lat, lon)
    compass = ['N','NE','E','SE','S','SW','W','NW'][int((q+22.5)//45) % 8]
    print(f"  {city:13s} {q:7.1f}° {compass:>3s}  {d:10,.0f} km")

# Visualise qibla arrows on a map-like plot
fig, ax = plt.subplots(figsize=(9, 5))
for city, (lat, lon) in cities.items():
    q = qibla_bearing(lat, lon)
    ax.plot(lon, lat, 'o', color='#38bdf8', markersize=6)
    dx = 8 * np.sin(np.radians(q))
    dy = 8 * np.cos(np.radians(q))
    ax.annotate('', (lon + dx, lat + dy), (lon, lat),
                arrowprops=dict(arrowstyle='->', color='#fbbf24', lw=1.5))
    ax.text(lon + 2, lat + 2, city, fontsize=7, color='#e2e8f0')

# Mark Mecca
ax.plot(39.83, 21.42, '*', color='#ef4444', markersize=15)
ax.text(39.83, 18, 'Mecca', fontsize=9, color='#ef4444', ha='center')

ax.set_xlim(-100, 160); ax.set_ylim(-15, 60)
ax.set_xlabel('Longitude', color='#e2e8f0')
ax.set_ylabel('Latitude', color='#e2e8f0')
ax.set_title('Qibla Directions Worldwide', color='white')
ax.grid(True, alpha=0.2)
plt.show()`,
      challenge: 'Find two cities where the qibla points in nearly opposite compass directions. What does this tell you about their locations relative to Mecca?',
      successHint: 'The qibla calculation demonstrates spherical trigonometry in its most practical form. For over a millennium, this problem drove advances in mathematics, astronomy, and instrument design throughout the Islamic world.',
    },
    {
      title: 'Surveying with the alidade — measuring heights',
      concept: `The **alidade** is a rotating sighting bar on the back of the astrolabe, used to measure angles of elevation. Point it at the top of a minaret, read the angle, and calculate the height using trigonometry.

If you stand distance **d** from a building and measure the angle of elevation α to the top:

**height = d × tan(α) + eye_height**

For inaccessible distances (you cannot measure d directly), use **two measurements** from different positions:

1. Measure angle α₁ from position 1
2. Walk a known distance s toward the object
3. Measure angle α₂ from position 2
4. Compute: **height = s × tan(α₁) × tan(α₂) / (tan(α₂) - tan(α₁)) + eye_height**

This technique was used to survey everything from minarets to mountains. It requires only the astrolabe and your feet.`,
      analogy: 'Hold your thumb at arm’s length and close one eye. Move closer to an object and your thumb’s angle to the top changes. Measure that angle precisely and you can calculate the height without climbing.',
      storyConnection: 'Zahra learned to survey the height of the Friday Mosque’s minaret by measuring the angle to its top and pacing off the distance. The alidade on the back of the astrolabe is specifically designed for this.',
      checkQuestion: 'You stand 30 meters from a minaret and measure the angle of elevation as 55°. Your eye height is 1.5 m. How tall is the minaret?',
      checkAnswer: 'height = 30 × tan(55°) + 1.5 = 30 × 1.428 + 1.5 = 42.84 + 1.5 = 44.3 meters.',
      codeIntro: 'Implement both single-distance and two-position surveying methods with error analysis.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def survey_single(distance, angle_deg, eye_height=1.5):
    """Height from single distance measurement."""
    return distance * np.tan(np.radians(angle_deg)) + eye_height

def survey_double(s, angle1_deg, angle2_deg, eye_height=1.5):
    """Height from two-position measurement. s = distance between positions."""
    t1 = np.tan(np.radians(angle1_deg))
    t2 = np.tan(np.radians(angle2_deg))
    return s * t1 * t2 / (t2 - t1) + eye_height

# Example: Isfahan Friday Mosque minaret
print("=== Single-Position Survey ===")
distance = 50  # meters
angle = 38     # degrees
h = survey_single(distance, angle)
print(f"Distance: {distance}m, Angle: {angle}°")
print(f"Minaret height: {h:.1f} m")

print("\\n=== Two-Position Survey ===")
angle1 = 28  # from far position
angle2 = 42  # from near position (closer)
spacing = 20 # meters between positions
h2 = survey_double(spacing, angle1, angle2)
print(f"Angles: {angle1}° and {angle2}°, spacing: {spacing}m")
print(f"Minaret height: {h2:.1f} m")

# Error analysis: how angle precision affects height
fig, ax = plt.subplots(figsize=(8, 5))
angle_errors = np.linspace(-1, 1, 100)  # degrees of error
h_single = [survey_single(50, 38 + e) for e in angle_errors]
h_double = [survey_double(20, 28 + e, 42 + e) for e in angle_errors]

ax.plot(angle_errors, h_single, color='#ef4444', linewidth=2,
        label='Single-position')
ax.plot(angle_errors, h_double, color='#38bdf8', linewidth=2,
        label='Two-position')
ax.axvline(0, color='#475569', linewidth=1, linestyle='--')
ax.axhline(h, color='#fbbf24', linewidth=1, linestyle='--',
           label=f'True height ({h:.1f}m)')
ax.set_xlabel('Angle measurement error (°)', color='#e2e8f0')
ax.set_ylabel('Computed height (m)', color='#e2e8f0')
ax.set_title('Height Sensitivity to Angle Error', color='white')
ax.legend(fontsize=8); ax.grid(True, alpha=0.2)
plt.show()

print(f"\\n±0.5° error in angle causes:")
print(f"  Single-position: ±{abs(survey_single(50,38.5) - h):.1f} m error")
print(f"  Two-position:    ±{abs(survey_double(20,28.5,42.5) - h2):.1f} m error")`,
      challenge: 'The two-position method is more sensitive to angle errors. Can you figure out why? (Hint: look at the denominator tan(α₂) - tan(α₁). When the angles are close, this is small, amplifying errors.)',
      successHint: 'Surveying with the alidade demonstrates the astrolabe as an engineering tool. The same principles are used in modern theodolites and laser rangefinders — the mathematics has not changed in a thousand years.',
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
        Level 3 &mdash; Precision, calibration, error analysis, and spherical trigonometry
      </div>
      {miniLessons.map((ml, i) => createElement(MiniLesson, { key: i, index: i, ...ml, pyodideRef, pyReady, loadPyodide, diagramMap: { AstrolabeProjectionDiagram, AstrolabeFunctionsDiagram, AstrolabeCelestialNavDiagram, CorrelationDiagram, MeanMedianModeDiagram, SineWaveDiagram } }))}
    </div>
  );
}
