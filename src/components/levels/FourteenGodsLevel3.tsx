import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function FourteenGodsLevel3() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Kepler\'s laws — the Moon\'s elliptical orbit',
      concept: `**Kepler's First Law**: Orbits are ellipses with the central body at one focus.
**Kepler's Second Law**: A line from the body to the focus sweeps equal areas in equal times (objects move faster when closer).
**Kepler's Third Law**: T² ∝ a³ (period squared is proportional to semi-major axis cubed).

For the Moon:
- Semi-major axis a = 384,400 km
- Eccentricity e = 0.0549 (mildly elliptical)
- Perigee = a(1-e) = 363,296 km
- Apogee = a(1+e) = 405,504 km

The Moon moves **fastest at perigee** and **slowest at apogee** (Kepler's Second Law). This causes the Moon's apparent motion across the sky to vary — affecting the exact timing of phases and eclipses.

📚 *We will implement Kepler's equation solver to compute the Moon's position at any time, and verify all three laws numerically.*`,
      analogy: 'A ball rolling inside a bowl speeds up at the bottom and slows at the top. The Moon does the same in its orbital "bowl" — speeding up at perigee (bottom) and slowing at apogee (top). This is Kepler\'s Second Law in action.',
      storyConnection: 'The uneven speed of the Moon through its orbit explains why lunar months are not all exactly 29.53 days — some are slightly shorter, others longer. The fourteen gods\' calendar keepers had to account for these variations when predicting exact festival dates.',
      checkQuestion: 'If the Moon moves faster at perigee, are lunar months centred on perigee shorter or longer than average?',
      checkAnswer: 'Shorter. When the Moon moves faster, it completes the phase cycle more quickly. A synodic month centred on perigee is about 29.27 days; one centred on apogee is about 29.83 days. The 0.56-day variation matters for precise eclipse timing.',
      codeIntro: 'Solve Kepler\'s equation to track the Moon\'s position and speed throughout its orbit.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Kepler's equation: M = E - e*sin(E)
# M = mean anomaly (linear with time)
# E = eccentric anomaly (what we solve for)
# e = eccentricity

def solve_kepler(M, e, tol=1e-10):
    """Solve Kepler's equation using Newton-Raphson method."""
    E = M  # initial guess
    for _ in range(50):
        dE = (E - e * np.sin(E) - M) / (1 - e * np.cos(E))
        E -= dE
        if np.all(np.abs(dE) < tol):
            break
    return E

# Moon parameters
a = 384400     # km, semi-major axis
e = 0.0549     # eccentricity
T = 27.3217    # days, sidereal period

# Compute position for one orbit
t = np.linspace(0, T, 500)
M = 2 * np.pi * t / T                    # mean anomaly
E = solve_kepler(M, e)                    # eccentric anomaly
true_anomaly = 2 * np.arctan2(np.sqrt(1+e) * np.sin(E/2),
                                np.sqrt(1-e) * np.cos(E/2))
r = a * (1 - e * np.cos(E))              # distance

# Cartesian coordinates
x = r * np.cos(true_anomaly)
y = r * np.sin(true_anomaly)

# Speed (vis-viva equation)
mu = 4 * np.pi**2 * a**3 / T**2  # gravitational parameter
v = np.sqrt(mu * (2/r - 1/a))     # km/day

fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

# Orbit plot
axes[0].plot(x/1000, y/1000, color='#60a5fa', linewidth=2)
axes[0].plot(0, 0, 'o', color='#34d399', markersize=12, label='Earth')
axes[0].plot(x[0]/1000, y[0]/1000, '^', color='#f59e0b', markersize=10, label='Perigee')
axes[0].plot(x[250]/1000, y[250]/1000, 'v', color='#ef4444', markersize=10, label='Apogee')
axes[0].set_xlabel('x (×1000 km)', color='white')
axes[0].set_ylabel('y (×1000 km)', color='white')
axes[0].set_title('Law 1: Elliptical Orbit', color='white', fontsize=11)
axes[0].set_aspect('equal')
axes[0].legend(facecolor='#374151', labelcolor='white', fontsize=7)

# Distance vs time
axes[1].plot(t, r/1000, color='#fbbf24', linewidth=2)
axes[1].set_xlabel('Days', color='white')
axes[1].set_ylabel('Distance (×1000 km)', color='white')
axes[1].set_title('Distance Variation', color='white', fontsize=11)
axes[1].axhline(y=a/1000, color='#9ca3af', linestyle=':', alpha=0.5, label=f'Mean: {a/1000:.0f}k')
axes[1].legend(facecolor='#374151', labelcolor='white', fontsize=8)

# Speed vs time
axes[2].plot(t, v, color='#f87171', linewidth=2)
axes[2].set_xlabel('Days', color='white')
axes[2].set_ylabel('Speed (km/day)', color='white')
axes[2].set_title('Law 2: Speed Variation', color='white', fontsize=11)
axes[2].annotate(f'Fast at perigee\\\n{v.max():.0f} km/day', xy=(t[np.argmax(v)], v.max()),
                 xytext=(5, v.max()), color='#f59e0b', fontsize=8)

plt.tight_layout()
plt.savefig('kepler.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Perigee: {r.min():.0f} km, Speed: {v.max():.0f} km/day")
print(f"Apogee:  {r.max():.0f} km, Speed: {v.min():.0f} km/day")
print(f"Speed ratio: {v.max()/v.min():.3f}")`,
      challenge: 'Verify Kepler\'s Second Law: compute the area swept per unit time at perigee and apogee. They should be equal.',
      successHint: 'Kepler\'s equation is the foundation of all orbital mechanics. By solving it, you can predict the Moon\'s position to high accuracy for any time — past, present, or future.',
    },
    {
      title: 'Perturbation theory — the Moon\'s complex motion',
      concept: `The Moon does not follow a perfect Kepler ellipse. The Sun\'s gravity **perturbs** the orbit, causing:

1. **Evection** (±1.27°): the largest perturbation, caused by the Sun stretching the orbit
2. **Variation** (±0.66°): the Moon speeds up near New/Full Moon
3. **Annual equation** (±0.19°): Earth-Sun distance variation
4. **Parallactic inequality** (±0.03°): due to Earth\'s finite size

These perturbations were discovered over centuries:
- Ptolemy found the evection (~150 CE)
- Tycho Brahe found the variation (~1590)
- Newton explained them all with gravity (~1687)

The total effect can shift the Moon\'s position by over 2° from a simple Kepler prediction — that is 4 lunar diameters.

📚 *We will build a perturbation model by adding sinusoidal correction terms to the basic Kepler solution.*`,
      analogy: 'Imagine swinging a ball on a string while walking past a magnet. The magnet slightly tugs the ball off its circular path with each pass. The Sun does this to the Moon — gently pulling it off its Kepler orbit in a predictable, calculable way.',
      storyConnection: 'Ancient Indian astronomers noticed that the Moon sometimes arrived at predicted positions "early" or "late." These perturbations are real — the Moon\'s motion is genuinely complex. The fourteen gods\' calendar needed empirical corrections that we now understand as gravitational perturbations.',
      checkQuestion: 'If the evection can shift the Moon by ±1.27°, and the Moon moves about 13° per day, by how many hours can the evection shift the timing of a phase?',
      checkAnswer: '1.27° / 13°/day ≈ 0.098 days ≈ 2.3 hours. The evection alone can make a Full Moon arrive over 2 hours early or late compared to the simple Kepler prediction.',
      codeIntro: 'Build a perturbed lunar position model including major correction terms.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Time span: 1 year
days = np.linspace(0, 365.25, 5000)

# Basic mean longitude (degrees per day)
mean_rate = 360 / 29.5306  # synodic rate for phase

# Mean anomaly of Moon
M_moon = 2 * np.pi * days / 27.5546
# Mean anomaly of Sun
M_sun = 2 * np.pi * days / 365.25
# Moon's mean elongation from Sun
D = 2 * np.pi * days / 29.5306

# Perturbation terms (degrees)
evection = 1.274 * np.sin(2 * D - M_moon)
variation = 0.658 * np.sin(2 * D)
annual_eq = -0.186 * np.sin(M_sun)
parallactic = -0.035 * np.sin(D)

total_perturbation = evection + variation + annual_eq + parallactic
kepler_position = np.degrees(M_moon) % 360
corrected_position = (np.degrees(M_moon) + total_perturbation) % 360

fig, axes = plt.subplots(3, 1, figsize=(11, 8))
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

# Individual perturbations
axes[0].plot(days, evection, color='#f87171', linewidth=1.5, label='Evection (±1.27°)')
axes[0].plot(days, variation, color='#60a5fa', linewidth=1.5, label='Variation (±0.66°)')
axes[0].plot(days, annual_eq, color='#34d399', linewidth=1.5, label='Annual eq (±0.19°)')
axes[0].set_ylabel('Correction (degrees)', color='white')
axes[0].set_title('Major Lunar Perturbations', color='white', fontsize=13)
axes[0].legend(facecolor='#374151', labelcolor='white', fontsize=8)
axes[0].axhline(y=0, color='#9ca3af', linewidth=0.5)

# Total perturbation
axes[1].plot(days, total_perturbation, color='#fbbf24', linewidth=1.5)
axes[1].fill_between(days, 0, total_perturbation, alpha=0.15, color='#fbbf24')
axes[1].set_ylabel('Total correction (°)', color='white')
axes[1].set_title('Combined Perturbation', color='white', fontsize=12)
axes[1].axhline(y=0, color='#9ca3af', linewidth=0.5)

# Timing error if you ignore perturbations
timing_error_hours = total_perturbation / (360/29.5306) * 24
axes[2].plot(days, timing_error_hours, color='#a78bfa', linewidth=1.5)
axes[2].fill_between(days, 0, timing_error_hours, alpha=0.15, color='#a78bfa')
axes[2].set_ylabel('Timing error (hours)', color='white')
axes[2].set_xlabel('Days', color='white')
axes[2].set_title('Phase Timing Error Without Perturbation Corrections', color='white', fontsize=12)

plt.tight_layout()
plt.savefig('perturbations.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Max position error: {np.max(np.abs(total_perturbation)):.2f}°")
print(f"Max timing error:   {np.max(np.abs(timing_error_hours)):.1f} hours")
print("Without perturbation corrections, lunar predictions can be off by hours.")`,
      challenge: 'Add a 4th perturbation: the "reduction to the ecliptic" (±0.21°, period = half a sidereal month). How does it change the maximum error?',
      successHint: 'Perturbation theory shows that real orbits are messy — but predictably messy. Each correction term has a physical cause, and together they make lunar predictions accurate to minutes.',
    },
    {
      title: 'Tidal forces — the Moon\'s grip on Earth',
      concept: `The Moon\'s gravity is not uniform across Earth. The near side is pulled more strongly than the centre, and the centre more than the far side. This **differential force** creates tides.

Tidal acceleration: \`a_tidal = 2GM_moon × R_earth / d³\`

where d is the Earth-Moon distance and R_earth is Earth\'s radius.

Key consequences:
- **Two tidal bulges**: one toward the Moon, one on the opposite side
- **Spring tides**: Sun and Moon aligned (New/Full Moon) — extra-high tides
- **Neap tides**: Sun and Moon at 90° (Quarter Moons) — weaker tides
- **Tidal locking**: the Moon always shows the same face to Earth

The tidal force varies as **1/d³** — strongly dependent on distance. At perigee, tides are about 20% stronger than at apogee.

📚 *We will compute tidal forces as a function of Moon distance and lunar phase, modelling the spring/neap cycle.*`,
      analogy: 'Stretch a rubber band between your hands. The middle stretches evenly, but the edges closest to each hand feel the most pull. Earth is the rubber band, and the Moon\'s gravity is one hand — the nearest edge bulges toward the Moon, the farthest edge bulges away.',
      storyConnection: 'While Tripura is landlocked, the Moon\'s tidal influence affects rivers and groundwater. During Kharchi Puja (near the waning quarter), tidal forces are at neap — a period of relative calm. The fourteen gods\' timing may reflect ancient awareness of tidal rhythms.',
      checkQuestion: 'Why are there TWO tidal bulges, not just one on the side facing the Moon?',
      checkAnswer: 'The far side of Earth is pulled LESS than the centre, so relative to Earth\'s centre, it is effectively pushed away from the Moon. This creates a second bulge on the opposite side. Both bulges are caused by the same differential gravity.',
      codeIntro: 'Model tidal forces and the spring/neap cycle as a function of lunar phase and distance.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Constants
G = 6.674e-11          # gravitational constant
M_moon = 7.342e22      # kg
M_sun = 1.989e30       # kg
R_earth = 6.371e6      # m
d_moon_avg = 3.844e8   # m
d_sun_avg = 1.496e11   # m

# Tidal acceleration (differential gravity)
def tidal_accel(M, d, R):
    return 2 * G * M * R / d**3

# Moon tidal force over its orbit
synodic = 29.5306
anomalistic = 27.5546
t = np.linspace(0, synodic * 3, 1000)  # 3 months

# Moon distance variation
e = 0.0549
a = d_moon_avg
moon_dist = a * (1 - e * np.cos(2 * np.pi * t / anomalistic))

# Moon tidal acceleration
a_moon = tidal_accel(M_moon, moon_dist, R_earth)
a_sun = tidal_accel(M_sun, d_sun_avg, R_earth)

# Phase angle (0=new, 180=full)
phase = 2 * np.pi * t / synodic

# Combined tidal force (Sun and Moon add at new/full, subtract at quarters)
# Simplified: total = moon + sun * cos(2*phase)
a_total = a_moon + a_sun * np.cos(2 * phase)

fig, axes = plt.subplots(3, 1, figsize=(11, 8), sharex=True)
fig.patch.set_facecolor('#1f2937')

for ax in axes:
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

# Moon distance
axes[0].plot(t, moon_dist / 1e6, color='#60a5fa', linewidth=2)
axes[0].set_ylabel('Moon distance\\\n(×10⁶ km)', color='white', fontsize=10)
axes[0].set_title('Tidal Forces — Moon Distance & Phase Effects', color='white', fontsize=13)

# Individual contributions
axes[1].plot(t, a_moon * 1e6, color='#60a5fa', linewidth=2, label='Moon tidal')
axes[1].axhline(y=a_sun * 1e6, color='#fbbf24', linestyle='--', linewidth=1.5, label='Sun tidal (avg)')
axes[1].set_ylabel('Tidal accel\\\n(×10⁻⁶ m/s²)', color='white', fontsize=10)
axes[1].legend(facecolor='#374151', labelcolor='white', fontsize=8)

# Combined with spring/neap
axes[2].plot(t, a_total * 1e6, color='#a78bfa', linewidth=2)
axes[2].fill_between(t, 0, a_total * 1e6, alpha=0.15, color='#a78bfa')
axes[2].set_ylabel('Combined tidal\\\n(×10⁻⁶ m/s²)', color='white', fontsize=10)
axes[2].set_xlabel('Days', color='white')

# Mark spring and neap tides
for i, d in enumerate(np.arange(0, synodic * 3, synodic)):
    axes[2].axvline(x=d, color='#ef4444', linewidth=1, alpha=0.5)
    axes[2].axvline(x=d + synodic/2, color='#ef4444', linewidth=1, alpha=0.5)
    if i == 0:
        axes[2].annotate('Spring', xy=(d + 0.5, a_total.max() * 1e6 * 0.95),
                         color='#ef4444', fontsize=9)
    axes[2].axvline(x=d + synodic/4, color='#34d399', linewidth=1, alpha=0.5)
    axes[2].axvline(x=d + 3*synodic/4, color='#34d399', linewidth=1, alpha=0.5)

plt.tight_layout()
plt.savefig('tides.png', dpi=100, facecolor='#1f2937')
plt.show()
print(f"Moon tidal: {tidal_accel(M_moon, d_moon_avg, R_earth)*1e6:.3f} ×10⁻⁶ m/s²")
print(f"Sun tidal:  {a_sun*1e6:.3f} ×10⁻⁶ m/s²")
print(f"Moon/Sun ratio: {tidal_accel(M_moon, d_moon_avg, R_earth)/a_sun:.2f}")
print("Moon dominates tides despite the Sun being much more massive,")
print("because tidal force falls as distance CUBED.")`,
      challenge: 'Calculate the tidal force during a "supermoon" (perigee + Full Moon). How much stronger is it compared to a "micromoon" (apogee + Full Moon)?',
      successHint: 'Tidal forces explain ocean tides, the Moon\'s locked rotation, and even the slow recession of the Moon from Earth. The 1/d³ dependence makes distance the dominant factor.',
    },
    {
      title: 'Nodal precession — the 18.6-year eclipse cycle',
      concept: `The Moon's orbital nodes (where it crosses the ecliptic) are not fixed — they **precess** westward, completing a full cycle in **18.61 years**.

This nodal precession means:
- Eclipse seasons shift earlier by about 20 days per year
- A complete "eclipse year" is only 346.6 days (not 365.25)
- The pattern of eclipses repeats with an 18.6-year period

The precession is caused by the Sun's gravitational torque on the Moon's tilted orbit — like a spinning top that slowly wobbles.

The differential equation for precession rate:
\`dΩ/dt = -3n²_sun × cos(i) / (2n_moon)\`

where Ω is the node longitude, n_sun and n_moon are mean motions, and i is the inclination.

📚 *We will simulate nodal precession over multiple decades and show how eclipse seasons migrate through the calendar.*`,
      analogy: 'Spin a coin on a table — it does not just spin; it wobbles. The wobble traces a circle as the spin axis itself rotates. The Moon\'s orbit wobbles the same way, and the nodes trace a full circle every 18.6 years.',
      storyConnection: 'The 18.6-year nodal cycle means that over a generation, eclipses visible from Tripura shift in timing. The fourteen gods\' traditions, passed through generations, implicitly encoded this long cycle — elders who witnessed an eclipse could predict when the next would return.',
      checkQuestion: 'If eclipse season occurs in June 2024, when will the NEXT eclipse season arrive the following year?',
      checkAnswer: 'Eclipse seasons shift about 20 days earlier each year. So the next occurrence is around late May 2025 (about 346.6 days later, not 365 days).',
      codeIntro: 'Simulate the 18.6-year nodal precession and track eclipse season migration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Nodal precession
T_precession = 18.6134  # years
precession_rate = 360 / T_precession  # degrees per year

# Eclipse year (time between Sun passing same node)
eclipse_year = 346.620  # days
solar_year = 365.2422

print("NODAL PRECESSION ANALYSIS")
print("=" * 50)
print(f"Precession period: {T_precession:.4f} years")
print(f"Precession rate:   {precession_rate:.2f}°/year")
print(f"Eclipse year:      {eclipse_year:.3f} days")
print(f"Solar year:        {solar_year:.4f} days")
print(f"Drift:             {solar_year - eclipse_year:.2f} days/year earlier")
print()

# Track node longitude and eclipse seasons over 40 years
years = np.linspace(0, 40, 2000)
node_longitude = (360 - precession_rate * years) % 360

# Eclipse seasons occur when Sun is near a node
# Sun longitude increases ~1°/day, nodes decrease ~0.053°/day
# Eclipse season when |Sun_lon - Node_lon| < 18.5°

eclipse_season_start_year = 2024
seasons = []

for yr in range(40):
    # Approximate node longitude at start of year
    node_lon = (180 - precession_rate * yr) % 360
    # Sun passes this longitude around day = node_lon / (360/365.25)
    sun_day = node_lon / (360/365.25)
    # Also the opposite node
    sun_day2 = ((node_lon + 180) % 360) / (360/365.25)
    seasons.append((yr + eclipse_season_start_year, sun_day, sun_day2))

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(11, 7))
fig.patch.set_facecolor('#1f2937')

for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

# Node longitude over time
ax1.plot(years + eclipse_season_start_year, node_longitude, color='#a78bfa', linewidth=2)
ax1.set_ylabel('Ascending Node Longitude (°)', color='white', fontsize=11)
ax1.set_title('Lunar Node Precession (18.6-year cycle)', color='white', fontsize=13)
ax1.axhline(y=0, color='#9ca3af', linestyle=':', alpha=0.3)
ax1.axhline(y=180, color='#9ca3af', linestyle=':', alpha=0.3)

# Eclipse season timing through calendar
years_list = [s[0] for s in seasons]
day1_list = [s[1] for s in seasons]
day2_list = [s[2] for s in seasons]

ax2.scatter(years_list, day1_list, color='#ef4444', s=30, label='Season 1')
ax2.scatter(years_list, day2_list, color='#3b82f6', s=30, label='Season 2')
ax2.set_ylabel('Day of year', color='white', fontsize=11)
ax2.set_xlabel('Year', color='white', fontsize=11)
ax2.set_title('Eclipse Season Dates (migrate through calendar)', color='white', fontsize=12)

month_days = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
month_names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
ax2.set_yticks(month_days)
ax2.set_yticklabels(month_names)
ax2.set_ylim(0, 365)
ax2.legend(facecolor='#374151', labelcolor='white')

plt.tight_layout()
plt.savefig('precession.png', dpi=100, facecolor='#1f2937')
plt.show()
print("Eclipse seasons migrate through the calendar over 18.6 years.")
print("This is why eclipses from Tripura are visible at different times each decade.")`,
      challenge: 'Find all years between 2024-2060 when an eclipse season falls in July (near Kharchi Puja). How often does this coincidence occur?',
      successHint: 'Nodal precession is the key to understanding long-term eclipse patterns. The 18.6-year cycle connects individual eclipses into families spanning centuries.',
    },
    {
      title: 'Numerical integration — the three-body problem',
      concept: `The Sun-Earth-Moon system is a **three-body problem** — one of the most famous unsolved problems in physics. Unlike two-body problems (which have exact Kepler solutions), three-body problems generally have no closed-form solution.

We must solve numerically:
\`d²r_i/dt² = Σ G×M_j × (r_j - r_i) / |r_j - r_i|³\`

for each body i, summed over all other bodies j.

This system of coupled differential equations captures:
- The Moon orbiting Earth
- Both being perturbed by the Sun
- All the perturbation effects we studied earlier (evection, variation, etc.)

We use a **symplectic integrator** (velocity Verlet) which conserves energy better than simpler methods.

📚 *We will implement a three-body gravitational simulator and observe how the Sun perturbs the Moon\'s orbit around Earth.*`,
      analogy: 'Three magnets on a frictionless table: push one, and all three start moving in complex patterns that depend on every interaction simultaneously. There is no formula for where they end up — you can only simulate step by step.',
      storyConnection: 'The fourteen gods represent the complexity of celestial motion. The Moon\'s orbit is genuinely complex — influenced by Earth, Sun, and even Jupiter. Our simulation captures this irreducible complexity, showing why lunar prediction required centuries of careful observation.',
      checkQuestion: 'Why can\'t we solve the three-body problem exactly like Kepler solved the two-body problem?',
      checkAnswer: 'The two-body problem reduces to an equivalent one-body problem (a single ellipse). With three bodies, the mutual interactions create feedback loops: A pulls B, which changes B\'s effect on C, which changes C\'s effect on A. This coupling prevents reduction to a simpler form.',
      codeIntro: 'Simulate the Sun-Earth-Moon three-body problem and observe lunar orbit perturbations.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Simplified 2D Sun-Earth-Moon (scaled units)
G = 1.0
M_sun = 333000     # solar masses
M_earth = 1.0
M_moon = 0.0123    # Earth masses

# Initial conditions (AU and AU/day scaled)
# Earth orbiting Sun at 1 AU
r_sun = np.array([0.0, 0.0])
r_earth = np.array([1.0, 0.0])
r_moon = np.array([1.00257, 0.0])  # Moon 384400/149.6e6 AU from Earth

v_sun = np.array([0.0, 0.0])
# Earth orbital speed: 2*pi AU/year
v_earth = np.array([0.0, 2 * np.pi])
# Moon speed: Earth speed + orbital speed around Earth
v_moon_rel = 2 * np.pi * 0.00257 / (27.32/365.25)  # Moon orbital speed in AU/year
v_moon = np.array([0.0, 2 * np.pi + v_moon_rel])

dt = 0.0001  # years
steps = 10000  # ~1 year

# Velocity Verlet integrator
positions_earth = []
positions_moon = []

re, rm, rs = r_earth.copy(), r_moon.copy(), r_sun.copy()
ve, vm, vs = v_earth.copy(), v_moon.copy(), v_sun.copy()

def accel(r1, r2, M2):
    dr = r2 - r1
    dist = np.sqrt(np.sum(dr**2))
    return G * M2 * dr / dist**3

for step in range(steps):
    # Accelerations
    ae = accel(re, rs, M_sun) + accel(re, rm, M_moon)
    am = accel(rm, rs, M_sun) + accel(rm, re, M_earth)

    # Half-step velocity
    ve_half = ve + ae * dt / 2
    vm_half = vm + am * dt / 2

    # Full-step position
    re = re + ve_half * dt
    rm = rm + vm_half * dt

    # New accelerations
    ae_new = accel(re, rs, M_sun) + accel(re, rm, M_moon)
    am_new = accel(rm, rs, M_sun) + accel(rm, re, M_earth)

    # Full-step velocity
    ve = ve_half + ae_new * dt / 2
    vm = vm_half + am_new * dt / 2

    if step % 5 == 0:
        positions_earth.append(re.copy())
        positions_moon.append(rm.copy())

pe = np.array(positions_earth)
pm = np.array(positions_moon)

# Moon relative to Earth
moon_rel = pm - pe

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
fig.patch.set_facecolor('#1f2937')

for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('white')

# Full system
ax1.plot(pe[:, 0], pe[:, 1], color='#34d399', linewidth=0.5, alpha=0.7, label='Earth')
ax1.plot(pm[:, 0], pm[:, 1], color='#60a5fa', linewidth=0.3, alpha=0.5, label='Moon')
ax1.plot(0, 0, '*', color='#fbbf24', markersize=15, label='Sun')
ax1.set_title('Sun-Earth-Moon System', color='white', fontsize=12)
ax1.set_xlabel('x (AU)', color='white')
ax1.set_ylabel('y (AU)', color='white')
ax1.legend(facecolor='#374151', labelcolor='white', fontsize=8)
ax1.set_aspect('equal')

# Moon relative to Earth
ax2.plot(moon_rel[:, 0] * 23455, moon_rel[:, 1] * 23455, color='#60a5fa', linewidth=0.8)
ax2.plot(0, 0, 'o', color='#34d399', markersize=10, label='Earth')
ax2.set_title('Moon Orbit (Earth frame)', color='white', fontsize=12)
ax2.set_xlabel('x (Earth radii)', color='white')
ax2.set_ylabel('y (Earth radii)', color='white')
ax2.legend(facecolor='#374151', labelcolor='white', fontsize=8)
ax2.set_aspect('equal')

plt.tight_layout()
plt.savefig('threebody.png', dpi=100, facecolor='#1f2937')
plt.show()

# Measure perturbation: distance variation
dists = np.sqrt(moon_rel[:, 0]**2 + moon_rel[:, 1]**2) * 149.6e6
print(f"Moon distance range: {dists.min():.0f} to {dists.max():.0f} km")
print(f"This includes both orbital eccentricity AND solar perturbations.")
print("The wobbles in the Earth-frame orbit are the Sun's influence.")`,
      challenge: 'Run the simulation for 3 years and measure how the Moon\'s orbital eccentricity changes over time. Plot e(t) and identify the evection period.',
      successHint: 'The three-body simulation captures all lunar perturbations in one calculation — evection, variation, and more emerge naturally from the gravitational interactions. This is the power of numerical simulation.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced Orbital Mechanics</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
