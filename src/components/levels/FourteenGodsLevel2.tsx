import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FourteenGodsLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Plotting the lunar illumination cycle',
      concept: `The Moon's illumination follows a smooth cosine curve over the 29.53-day synodic month. Plotting this reveals the symmetry of the waxing and waning phases.

The illumination fraction: \`f = (1 - cos(2π × d / P)) / 2\`

where d is days since New Moon and P is the synodic period.

This formula gives:
- f = 0 at New Moon (d=0)
- f = 0.5 at First/Last Quarter (d≈7.4 and d≈22.1)
- f = 1.0 at Full Moon (d≈14.8)

📚 *We will use numpy and matplotlib to create a publication-quality plot of the lunar illumination cycle with phase labels.*`,
      analogy: 'The illumination curve is like a heartbeat on a monitor — a smooth, repeating wave. Each peak is a Full Moon, each trough a New Moon, and the rhythm never changes.',
      storyConnection: 'The fourteen gods\' priests needed to identify exact lunar days (tithis) for rituals. A plot like this would have been their calendar — knowing that day 8 of the dark fortnight falls at exactly 75% illumination during the waning phase.',
      checkQuestion: 'At what illumination percentage is the First Quarter Moon?',
      checkAnswer: 'Exactly 50%. The name "quarter" refers to the Moon being one-quarter through its cycle, not one-quarter illuminated. At First Quarter, exactly half the visible disk is lit.',
      codeIntro: 'Plot the complete lunar illumination cycle with phase markers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

synodic = 29.5306
days = np.linspace(0, synodic, 500)
illumination = (1 - np.cos(2 * np.pi * days / synodic)) / 2 * 100

phases = [
    (0, 'New Moon', 0), (7.38, 'First Quarter', 50),
    (14.76, 'Full Moon', 100), (22.15, 'Last Quarter', 50),
    (synodic, 'New Moon', 0),
]

# Kharchi day: 8th tithi of dark fortnight ≈ day 22
kharchi_day = 22.0
kharchi_illum = (1 - np.cos(2 * np.pi * kharchi_day / synodic)) / 2 * 100

fig, ax = plt.subplots(figsize=(11, 5))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

# Illumination curve
ax.plot(days, illumination, color='#fbbf24', linewidth=2.5)
ax.fill_between(days, 0, illumination, alpha=0.1, color='#fbbf24')

# Waxing/Waning shading
ax.axvspan(0, synodic/2, alpha=0.05, color='#34d399', label='Waxing (Shukla Paksha)')
ax.axvspan(synodic/2, synodic, alpha=0.05, color='#f87171', label='Waning (Krishna Paksha)')

# Phase markers
for d, name, illum in phases:
    ax.plot(d, illum, 'o', color='white', markersize=10, zorder=5)
    ax.annotate(name, xy=(d, illum), xytext=(d, illum + 7),
                ha='center', color='white', fontsize=9, fontweight='bold')

# Kharchi Puja marker
ax.plot(kharchi_day, kharchi_illum, '*', color='#f59e0b', markersize=18, zorder=6)
ax.annotate(f'Kharchi Puja\\n(day {kharchi_day:.0f}, {kharchi_illum:.0f}%)',
            xy=(kharchi_day, kharchi_illum), xytext=(kharchi_day - 3, kharchi_illum + 12),
            color='#f59e0b', fontsize=10, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

ax.set_xlabel('Days since New Moon', color='white', fontsize=12)
ax.set_ylabel('Illumination (%)', color='white', fontsize=12)
ax.set_title('Lunar Illumination Cycle — Kharchi Puja Timing', color='white', fontsize=13)
ax.legend(facecolor='#374151', labelcolor='white', loc='upper left')
ax.set_xlim(0, synodic)
ax.set_ylim(-5, 115)

plt.tight_layout()
plt.savefig('lunar_cycle.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Kharchi Puja falls on day {kharchi_day:.0f} at {kharchi_illum:.0f}% illumination")
print("This is in the waning (Krishna) phase — the dark fortnight")`,
      challenge: 'Add vertical lines for each tithi (lunar day = synodic/30) and label them 1-30. Highlight tithi 23 (Ashtami of Krishna Paksha).',
      successHint: 'The illumination plot is a bridge between astronomy and culture — it shows exactly why certain ritual days correspond to specific Moon appearances.',
    },
    {
      title: 'Eclipse geometry — the Moon\'s tilted orbit',
      concept: `The Moon's orbit is tilted 5.14° from the ecliptic (Earth's orbital plane). This tilt is what makes eclipses rare.

We can visualise this by plotting the Moon's position in 3D:
- x, y: the Moon's position in the ecliptic plane
- z: the Moon's height above or below the ecliptic

The **nodes** are where the Moon's orbit crosses the ecliptic. Eclipses only happen near nodes.

The nodes themselves rotate (precess) with a period of 18.61 years — this is the **nodal precession**. It means the eclipse pattern shifts over time.

📚 *We will use numpy trigonometry and matplotlib to plot the Moon's 3D orbit and mark the nodes where eclipses can occur.*`,
      analogy: 'Imagine a Frisbee (ecliptic plane) and a hula hoop tilted 5° from it (Moon orbit). They intersect at two points (nodes). Only when the Moon is at a node AND aligned with the Sun can an eclipse happen — like threading a needle through a specific point on the hoop.',
      storyConnection: 'Ancient Tripura astronomers observed that eclipses did not happen at every Full or New Moon. The 5° tilt explains this mystery. The fourteen gods were believed to control these alignments — in reality, it is geometry.',
      checkQuestion: 'If the Moon orbit were tilted 10° instead of 5.14°, would eclipses be more or less frequent?',
      checkAnswer: 'Less frequent. A steeper tilt means the Moon is further from the ecliptic for most of its orbit, so the "eclipse window" near each node becomes narrower. At 0° tilt, we would have eclipses every month; at 90° tilt, almost never.',
      codeIntro: 'Visualise the Moon\'s tilted orbit and its eclipse nodes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Moon's orbit parameters
inclination = 5.14  # degrees
inc_rad = np.radians(inclination)
R_moon = 384400  # km (average distance)

theta = np.linspace(0, 2 * np.pi, 500)

# Moon position in 3D (simplified circular orbit)
x = R_moon * np.cos(theta)
y = R_moon * np.sin(theta) * np.cos(inc_rad)
z = R_moon * np.sin(theta) * np.sin(inc_rad)

# Nodes: where z = 0 (ascending at theta=0, descending at theta=pi)
node_theta = [0, np.pi]
node_x = [R_moon * np.cos(t) for t in node_theta]
node_y = [R_moon * np.sin(t) * np.cos(inc_rad) for t in node_theta]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#1f2937')

# Side view (x-z plane) - shows the tilt
ax1.set_facecolor('#1f2937')
ax1.tick_params(colors='white')
for spine in ax1.spines.values():
    spine.set_color('white')

ax1.plot(x / 1000, z / 1000, color='#60a5fa', linewidth=2, label='Moon orbit')
ax1.axhline(y=0, color='#9ca3af', linestyle='--', alpha=0.5, label='Ecliptic plane')
ax1.plot(0, 0, 'o', color='#34d399', markersize=15, label='Earth')
ax1.plot(node_x[0]/1000, 0, '^', color='#f59e0b', markersize=12, label='Ascending node')
ax1.plot(node_x[1]/1000, 0, 'v', color='#ef4444', markersize=12, label='Descending node')

# Show tilt angle
ax1.annotate(f'{inclination}°', xy=(200, 10), color='#fbbf24', fontsize=14, fontweight='bold')
ax1.set_xlabel('Distance (×1000 km)', color='white')
ax1.set_ylabel('Height above ecliptic (×1000 km)', color='white')
ax1.set_title('Moon Orbit — Side View', color='white', fontsize=12)
ax1.legend(facecolor='#374151', labelcolor='white', fontsize=8)
ax1.set_ylim(-60, 60)

# Top view (x-y plane) - shows the orbit
ax2.set_facecolor('#1f2937')
ax2.tick_params(colors='white')
for spine in ax2.spines.values():
    spine.set_color('white')

# Color by height
colors = plt.cm.coolwarm((z - z.min()) / (z.max() - z.min()))
for i in range(len(theta) - 1):
    ax2.plot(x[i:i+2]/1000, y[i:i+2]/1000, color=colors[i], linewidth=2)

ax2.plot(0, 0, 'o', color='#34d399', markersize=15)
ax2.plot(node_x[0]/1000, node_y[0]/1000, '^', color='#f59e0b', markersize=12)
ax2.plot(node_x[1]/1000, node_y[1]/1000, 'v', color='#ef4444', markersize=12)

# Eclipse zones
for nx, ny in zip(node_x, node_y):
    circle = plt.Circle((nx/1000, ny/1000), 40, color='#fbbf2440', fill=True)
    ax2.add_patch(circle)

ax2.set_xlabel('x (×1000 km)', color='white')
ax2.set_ylabel('y (×1000 km)', color='white')
ax2.set_title('Moon Orbit — Top View (red=above, blue=below)', color='white', fontsize=12)
ax2.set_aspect('equal')

plt.tight_layout()
plt.savefig('moon_orbit.png', dpi=100, facecolor='#1f2937')
plt.show()

max_height = R_moon * np.sin(inc_rad)
print(f"Maximum height above ecliptic: {max_height:.0f} km")
print(f"That is {max_height / R_moon * 100:.1f}% of the orbital radius")
print(f"Eclipse zones (yellow circles) cover only a small fraction of the orbit")`,
      challenge: 'Add the Sun direction as an arrow. Show how the eclipse zone and Sun direction must align for an eclipse to occur.',
      successHint: 'The 3D geometry of the Moon orbit explains all eclipse phenomena. A 5° tilt — seemingly tiny — is enough to make eclipses rare events rather than monthly occurrences.',
    },
    {
      title: 'The Saros cycle — when eclipse patterns repeat',
      concept: `The **Saros cycle** is 6,585.32 days (≈ 18 years, 11 days, 8 hours). After one Saros, the Sun, Moon, and nodes return to almost the same relative positions, producing a nearly identical eclipse.

Why this period works:
- 223 synodic months = 6,585.32 days (same phase)
- 242 draconic months = 6,585.36 days (same node position)
- 239 anomalistic months = 6,585.54 days (same distance)

These three periods align to within hours — a remarkable coincidence of orbital mechanics.

The ⅓-day remainder means each successive Saros eclipse shifts about 120° westward in longitude. After 3 Saros periods (54 years), the eclipse returns to roughly the same location.

📚 *We will verify the Saros cycle numerically and plot how eclipse locations shift over multiple cycles.*`,
      analogy: 'Imagine three gears meshing together: one for the Moon\'s phase, one for its node position, and one for its distance. Normally they are out of sync. But every 6,585 days, all three gears click into the same alignment — and the eclipse pattern repeats.',
      storyConnection: 'Babylonian astronomers discovered the Saros cycle around 500 BCE. The knowledge may have reached the Indian subcontinent through trade routes. The Tripura tradition of tracking celestial events across generations suggests familiarity with long-period cycles.',
      checkQuestion: 'If a total solar eclipse occurs on July 2, 2019, when is the next Saros-related eclipse?',
      checkAnswer: 'Add 6,585.32 days ≈ 18 years, 11 days, 8 hours. The next eclipse in this Saros series occurs around July 13, 2037, shifted about 120° west in longitude.',
      codeIntro: 'Verify the Saros cycle and visualise how eclipses shift across the globe.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Orbital periods
synodic = 29.530589    # New Moon to New Moon
draconic = 27.212221   # node to node
anomalistic = 27.554550  # perigee to perigee

# Saros: find when all three nearly align
# Known: 223 synodic months
saros_syn = 223 * synodic
saros_dra = 242 * draconic
saros_ano = 239 * anomalistic

print("SAROS CYCLE VERIFICATION")
print("=" * 50)
print(f"223 synodic months:     {saros_syn:.2f} days")
print(f"242 draconic months:    {saros_dra:.2f} days")
print(f"239 anomalistic months: {saros_ano:.2f} days")
print(f"Max discrepancy:        {max(saros_syn, saros_dra, saros_ano) - min(saros_syn, saros_dra, saros_ano):.2f} days")
print(f"Saros period:           {saros_syn:.2f} days")
print(f"                      = {saros_syn/365.25:.2f} years")
print(f"                      = 18 years + {saros_syn - 18*365.25:.2f} days")
print()

# Longitude shift
day_fraction = saros_syn - int(saros_syn)
longitude_shift = day_fraction * 360  # degrees (Earth rotates 360° per day)
print(f"Fractional day: {day_fraction:.4f}")
print(f"Longitude shift per Saros: {longitude_shift:.1f}° westward")
print(f"After 3 Saros (exeligmos): {longitude_shift * 3 % 360:.1f}° ≈ return")
print()

# Plot eclipse positions over multiple Saros cycles
n_saros = 15
lons = [(i * longitude_shift) % 360 for i in range(n_saros)]
lons = [l - 360 if l > 180 else l for l in lons]
years = [2019 + i * saros_syn / 365.25 for i in range(n_saros)]

fig, ax = plt.subplots(figsize=(10, 4))
fig.patch.set_facecolor('#1f2937')
ax.set_facecolor('#1f2937')
ax.tick_params(colors='white')
for spine in ax.spines.values():
    spine.set_color('white')

scatter = ax.scatter(lons, [0]*n_saros, c=range(n_saros),
                     cmap='plasma', s=200, zorder=5, edgecolors='white')

for i, (lon, yr) in enumerate(zip(lons, years)):
    ax.annotate(f'{yr:.0f}', xy=(lon, 0.15), ha='center',
                color='white', fontsize=7, rotation=45)

ax.set_xlabel('Longitude (degrees)', color='white', fontsize=12)
ax.set_title(f'Eclipse Longitude Shift — {n_saros} Saros Cycles', color='white', fontsize=13)
ax.set_xlim(-200, 200)
ax.set_ylim(-0.5, 0.8)
ax.axhline(y=0, color='#9ca3af', alpha=0.3)

# Mark the 3-Saros return
ax.annotate('3 Saros ≈ return\\nto same region',
            xy=(lons[3], 0), xytext=(lons[3], 0.5),
            color='#f59e0b', fontsize=10, ha='center',
            arrowprops=dict(arrowstyle='->', color='#f59e0b'))

plt.tight_layout()
plt.savefig('saros.png', dpi=100, facecolor='#1f2937')
plt.show()`,
      challenge: 'A Saros series typically lasts about 1,300 years and produces 70-85 eclipses. Plot the latitude progression of eclipses in a series (they slowly shift from pole to pole).',
      successHint: 'The Saros cycle reveals that eclipses are not random events but members of long families stretching over millennia. Predicting eclipses is predicting the rhythm of orbital mechanics.',
    },
    {
      title: 'Moon distance and apparent size — why eclipses differ',
      concept: `The Moon's orbit is **elliptical**, with:
- **Perigee** (closest): 356,500 km — Moon appears larger
- **Apogee** (farthest): 406,700 km — Moon appears smaller

The apparent angular size: \`θ = 2 × arctan(R_moon / distance)\`

When the Moon is at perigee during a solar eclipse, it fully covers the Sun → **total eclipse**
When at apogee, it is too small to cover the Sun → **annular eclipse** (ring of fire)

The Sun's apparent size also varies (Earth's orbit is slightly elliptical):
- Perihelion: 0.542° (January, closer to Sun)
- Aphelion: 0.524° (July, farther)

Whether an eclipse is total or annular depends on the relative apparent sizes of Sun and Moon at that moment.

📚 *We will calculate apparent sizes throughout the Moon's orbit and plot the total/annular eclipse zones.*`,
      analogy: 'Hold a coin at arm\'s length — it might just cover a distant lamppost. Move the coin closer to your eye, and it covers more. Move it farther away, and it does not quite cover the lamppost. The Moon does the same thing relative to the Sun.',
      storyConnection: 'Tripura has witnessed both total and annular eclipses. The difference between an awe-inspiring total eclipse (where the corona appears) and a mere annular ring depends entirely on the Moon\'s distance — a fact the fourteen gods\' astronomers could not have known, but which we can now calculate precisely.',
      checkQuestion: 'The Moon\'s diameter is 3,474 km. What is its apparent angular size at perigee vs apogee?',
      checkAnswer: 'At perigee (356,500 km): θ = 2×arctan(1737/356500) = 0.558°. At apogee (406,700 km): θ = 2×arctan(1737/406700) = 0.489°. A 14% difference — enough to determine eclipse type.',
      codeIntro: 'Plot the Moon and Sun apparent sizes to determine when total vs annular eclipses occur.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Moon orbit (elliptical)
R_moon = 1737.4    # km radius
perigee = 356500   # km
apogee = 406700    # km
a_moon = (perigee + apogee) / 2
e_moon = (apogee - perigee) / (apogee + perigee)

# Sun apparent size (also varies slightly)
R_sun = 696340     # km radius
sun_dist_peri = 147.1e6   # km (January)
sun_dist_apo = 152.1e6    # km (July)

anomalistic = 27.5546  # days
t = np.linspace(0, anomalistic * 4, 1000)  # 4 anomalistic months

# Moon distance over time
theta_moon = 2 * np.pi * t / anomalistic
moon_dist = a_moon * (1 - e_moon**2) / (1 + e_moon * np.cos(theta_moon))

# Apparent angular size (degrees)
moon_angular = 2 * np.degrees(np.arctan(R_moon / moon_dist))

# Sun angular size (smooth seasonal variation)
t_year = np.linspace(0, 365.25, 1000)
sun_dist = (sun_dist_peri + sun_dist_apo) / 2 + \
           (sun_dist_apo - sun_dist_peri) / 2 * np.cos(2 * np.pi * t_year / 365.25)
sun_angular = 2 * np.degrees(np.arctan(R_sun / sun_dist))

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
fig.patch.set_facecolor('#1f2937')

for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

# Moon distance and angular size
ax1.plot(t, moon_dist / 1000, color='#60a5fa', linewidth=2)
ax1.set_ylabel('Moon Distance (×1000 km)', color='white', fontsize=11)
ax1.set_title('Moon Distance & Apparent Size Variation', color='white', fontsize=13)
ax1.axhline(y=perigee/1000, color='#34d399', linestyle=':', alpha=0.5, label=f'Perigee {perigee/1000:.1f}k km')
ax1.axhline(y=apogee/1000, color='#f87171', linestyle=':', alpha=0.5, label=f'Apogee {apogee/1000:.1f}k km')
ax1.legend(facecolor='#374151', labelcolor='white')

# Angular sizes comparison
ax2.fill_between(t, moon_angular.min(), moon_angular.max(), alpha=0.15, color='#60a5fa')
ax2.plot(t, moon_angular, color='#60a5fa', linewidth=2, label='Moon apparent size')
ax2.axhline(y=sun_angular.mean(), color='#fbbf24', linewidth=2, linestyle='--', label=f'Sun avg: {sun_angular.mean():.3f}°')
ax2.axhspan(sun_angular.min(), sun_angular.max(), alpha=0.1, color='#fbbf24')

# Mark total vs annular zones
ax2.fill_between(t, sun_angular.min(), moon_angular,
                 where=moon_angular > sun_angular.max(), alpha=0.2, color='#34d399', label='Total eclipse possible')
ax2.fill_between(t, moon_angular, sun_angular.max(),
                 where=moon_angular < sun_angular.min(), alpha=0.2, color='#ef4444', label='Annular eclipse possible')

ax2.set_xlabel('Days', color='white', fontsize=11)
ax2.set_ylabel('Angular Size (degrees)', color='white', fontsize=11)
ax2.legend(facecolor='#374151', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.savefig('eclipse_types.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Moon angular size: {moon_angular.min():.3f}° to {moon_angular.max():.3f}°")
print(f"Sun angular size:  {sun_angular.min():.3f}° to {sun_angular.max():.3f}°")
print(f"Total eclipses when Moon > Sun: Moon at perigee + Sun at apogee")
print(f"Annular eclipses when Moon < Sun: Moon at apogee + Sun at perihelion")`,
      challenge: 'Calculate the probability of a random eclipse being total vs annular. (Hint: what fraction of the Moon orbit has angular size > Sun angular size?)',
      successHint: 'The cosmic coincidence that the Moon and Sun have nearly the same apparent size from Earth is extraordinary. It makes our planet one of the few places in the solar system where total eclipses are possible.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Visualising Celestial Mechanics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
