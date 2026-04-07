import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RasLilaLevel2() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Plotting circular orbits — the dance of the planets',
      concept: `Visualising orbits brings Kepler's laws to life. Using **matplotlib** and **numpy**, we can plot the positions of planets over time on their orbital paths.

For a circular orbit, the position at time t is:
- x(t) = r x cos(omega x t)
- y(t) = r x sin(omega x t)

Where omega = 2*pi/T is the angular velocity.

For an **elliptical** orbit, we use:
- x(t) = a x cos(E) - c  (where a = semi-major axis, c = ae, e = eccentricity)
- y(t) = b x sin(E)  (where b = a x sqrt(1 - e²))

We solve Kepler's equation M = E - e*sin(E) to get E from time.`,
      analogy: 'Plotting an orbit is like tracing the path of a dancer on stage with a spotlight. The spotlight (our code) follows the dancer frame by frame, leaving a trail that shows the complete pattern of the dance.',
      storyConnection: 'Each Ras Lila dancer traces a circle. Each planet traces an ellipse. Our matplotlib plots show both — revealing that the sacred geometry of the dance mirrors the cosmic geometry of the solar system.',
      checkQuestion: 'Why do we need to solve Kepler\'s equation instead of just using angle = 2*pi*t/T?',
      checkAnswer: 'For circles, angle = 2*pi*t/T works perfectly. But for ellipses, the planet moves faster near perihelion and slower near aphelion (Kepler\'s second law). The mean anomaly M increases uniformly with time, but the eccentric anomaly E does not. Kepler\'s equation M = E - e*sin(E) bridges the gap, but has no analytical solution — we must solve it numerically.',
      codeIntro: 'Plot the inner solar system with accurate orbital positions.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Inner solar system orbits
planets = {
    'Mercury': {'a': 0.387, 'e': 0.206, 'T': 87.97, 'color': '#a78bfa'},
    'Venus':   {'a': 0.723, 'e': 0.007, 'T': 224.7, 'color': '#f59e0b'},
    'Earth':   {'a': 1.000, 'e': 0.017, 'T': 365.25, 'color': '#3b82f6'},
    'Mars':    {'a': 1.524, 'e': 0.093, 'T': 687.0, 'color': '#ef4444'},
}

def solve_kepler(M, e, tol=1e-8):
    """Solve M = E - e*sin(E) by Newton's method."""
    E = M.copy()
    for _ in range(50):
        dE = (M - E + e * np.sin(E)) / (1 - e * np.cos(E))
        E += dE
        if np.max(np.abs(dE)) < tol:
            break
    return E

fig, ax = plt.subplots(1, 1, figsize=(8, 8))
ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Sun at centre
ax.plot(0, 0, 'o', color='#fbbf24', markersize=15, zorder=10)
ax.annotate('Sun', (0.05, 0.05), color='#fbbf24', fontsize=9)

t_days = np.linspace(0, 687, 1000)  # up to Mars period

for name, p in planets.items():
    a, e, T = p['a'], p['e'], p['T']
    b = a * np.sqrt(1 - e**2)
    c = a * e

    # Mean anomaly over time
    M = 2 * np.pi * t_days / T
    E = solve_kepler(M, e)

    # Position in orbital plane
    x = a * np.cos(E) - c
    y = b * np.sin(E)

    ax.plot(x, y, color=p['color'], linewidth=1.5, alpha=0.6)
    # Current position (t=0)
    ax.plot(x[0], y[0], 'o', color=p['color'], markersize=8, zorder=5)
    ax.annotate(name, (x[0]+0.05, y[0]+0.05), color=p['color'], fontsize=9)

# Add Ras Lila circle for comparison (scaled)
theta = np.linspace(0, 2*np.pi, 100)
dance_r = 0.15  # scaled to AU
ax.plot(dance_r * np.cos(theta), dance_r * np.sin(theta), '--', color='#34d399', linewidth=1, alpha=0.5)
ax.annotate('Ras Lila\\n(to scale!)', (0.12, 0.12), color='#34d399', fontsize=7, style='italic')

ax.set_title('Inner Solar System — Cosmic Ras Lila', color='white', fontsize=14, fontweight='bold')
ax.set_xlabel('x (AU)', color='white')
ax.set_ylabel('y (AU)', color='white')
ax.tick_params(colors='white')
ax.set_aspect('equal')
ax.grid(True, alpha=0.15, color='white')
ax.set_xlim(-2, 2)
ax.set_ylim(-2, 2)

plt.tight_layout()
plt.savefig('orbits.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("Orbital eccentricities:")
for name, p in planets.items():
    print(f"  {name}: e = {p['e']:.3f} ({'nearly circular' if p['e'] < 0.05 else 'noticeably elliptical'})")`,
      challenge: 'Add Jupiter to the plot (a=5.2 AU, e=0.048, T=4331 days). You will need to expand the axis limits. How does Jupiter\'s orbit compare to the inner planets?',
      successHint: 'You just plotted real planetary orbits using Kepler\'s equation. This is the same computation that NASA uses for mission planning — solved numerically because there is no closed-form solution.',
    },
    {
      title: 'Gravity wells — visualising the invisible pull',
      concept: `Gravity is invisible, but we can visualise it as a **gravity well** — a funnel-shaped surface where deeper means stronger gravity. An object placed on this surface naturally rolls toward the centre, mimicking orbital motion.

The gravitational potential is:
**U = -G x M / r**

The deeper the well (more negative U), the harder it is to escape. The **escape velocity** is the speed needed to climb out:
**v_escape = sqrt(2 x G x M / r)**

Different bodies create different gravity wells:
- The Sun's well is deep and wide — hard to escape the solar system
- Earth's well is much shallower — rockets can escape with enough speed
- The Moon's well is shallow — you could almost jump out`,
      analogy: 'A gravity well is like a bowl on a table. A marble placed on the rim rolls inward. Roll it fast enough along the rim, and it orbits. Roll it fast enough to reach the top of the rim, and it escapes. The shape of the bowl determines how fast the marble needs to go.',
      storyConnection: 'The Ras Lila dancers are "trapped" in their circular path by the choreography — just as planets are trapped in their orbits by the Sun\'s gravity well. A dancer who breaks formation "escapes" the dance, just as a spacecraft with escape velocity escapes the gravity well.',
      checkQuestion: 'Why is the gravitational potential negative? Does that mean gravity gives negative energy?',
      checkAnswer: 'The convention is that U = 0 at infinite distance (completely free). Any bound orbit has U < 0, meaning the object has lost energy falling into the well. To escape, you must add enough kinetic energy to make total energy >= 0. Negative potential just means "you owe the gravity well energy before you can leave."',
      codeIntro: 'Visualise the gravity wells of the Sun, Earth, and Moon.',
      code: `import numpy as np
import matplotlib.pyplot as plt

G = 6.674e-11

bodies = {
    'Sun':   {'M': 1.989e30, 'R': 6.96e8, 'color': '#fbbf24'},
    'Earth': {'M': 5.972e24, 'R': 6.371e6, 'color': '#3b82f6'},
    'Moon':  {'M': 7.342e22, 'R': 1.737e6, 'color': '#9ca3af'},
}

fig, axes = plt.subplots(1, 3, figsize=(12, 4))
fig.patch.set_facecolor('#1f2937')

for idx, (name, body) in enumerate(bodies.items()):
    ax = axes[idx]
    ax.set_facecolor('#1f2937')

    M, R = body['M'], body['R']
    r = np.linspace(R, R * 20, 500)
    U = -G * M / r

    # Normalise for visual comparison
    U_surface = -G * M / R
    U_norm = U / abs(U_surface)

    r_norm = r / R

    ax.fill_between(r_norm, U_norm, -1.1, alpha=0.2, color=body['color'])
    ax.plot(r_norm, U_norm, color=body['color'], linewidth=2)
    ax.axhline(y=0, color='white', alpha=0.3, linestyle='--')

    v_escape = np.sqrt(2 * G * M / R)
    ax.set_title(f"{name}\\nv_esc = {v_escape/1000:.1f} km/s", color='white', fontsize=11, fontweight='bold')
    ax.set_xlabel('r / R_surface', color='white')
    if idx == 0:
        ax.set_ylabel('U / |U_surface|', color='white')
    ax.tick_params(colors='white')
    ax.set_ylim(-1.1, 0.1)
    ax.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('gravity_wells.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("Escape velocities:")
for name, body in bodies.items():
    v_esc = np.sqrt(2 * G * body['M'] / body['R'])
    print(f"  {name}: {v_esc/1000:.1f} km/s ({v_esc/1000*3600:.0f} km/h)")
print(f"\\nTo leave the solar system from Earth's orbit: {np.sqrt(2*G*1.989e30/1.496e11)/1000:.1f} km/s")`,
      challenge: 'Calculate the escape velocity from the surface of Mars (M=6.39e23 kg, R=3.39e6 m). Compare it to Earth\'s. Why is it much easier to launch rockets from Mars?',
      successHint: 'Gravity wells explain why it costs so much energy to leave Earth but relatively little to leave the Moon. Every space mission is fundamentally about climbing out of gravity wells.',
    },
    {
      title: 'Circular motion in everyday life — beyond dance and planets',
      concept: `Circular motion is everywhere:

- **Centrifuges**: spin blood samples to separate plasma from cells (a_c up to 100,000g!)
- **Washing machines**: spin clothes to extract water via centripetal action
- **Banked roads**: tilted curves that let cars turn without sliding
- **Satellites**: orbit Earth, providing GPS, weather data, and communications
- **Roller coasters**: loops require minimum speed at the top to maintain contact

Each uses **F = mv²/r** in a different context. The "centripetal force" is provided by different physical forces in each case: tension (centrifuge), friction (car), gravity (orbit), normal force (loop).`,
      analogy: 'F = mv²/r is like a recipe that works with different ingredients. The recipe says "you need X amount of inward force." For a satellite, gravity provides it. For a car on a curve, friction provides it. For a ball on a string, tension provides it. Same recipe, different ingredients.',
      storyConnection: 'The Ras Lila dance is one of the most elegant examples of circular motion in human culture. But the physics it embodies — centripetal force, angular velocity, the relationship between speed, radius, and period — governs everything from atoms to galaxies.',
      checkQuestion: 'On a banked road with no friction, what determines the safe speed for a turn?',
      checkAnswer: 'On a frictionless banked road, the horizontal component of the normal force provides all the centripetal force: N*sin(theta) = mv²/r. The safe speed is v = sqrt(r*g*tan(theta)). Too slow, and you slide inward. Too fast, and you slide outward. There is exactly one "design speed" for each banking angle and radius.',
      codeIntro: 'Calculate safe speeds, forces, and conditions for circular motion in real-world applications.',
      code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.8

# Banked road analysis
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

# Safe speed vs banking angle for different radii
angles = np.linspace(5, 45, 100)  # degrees
for radius in [50, 100, 200, 500]:
    v_safe = np.sqrt(radius * g * np.tan(np.radians(angles)))
    ax1.plot(angles, v_safe * 3.6, linewidth=2, label=f'r={radius}m')

ax1.set_title('Banked Road: Safe Speed vs Banking Angle', color='white', fontsize=11, fontweight='bold')
ax1.set_xlabel('Banking angle (degrees)', color='white')
ax1.set_ylabel('Safe speed (km/h)', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
ax1.grid(True, alpha=0.2, color='white')
ax1.set_ylim(0, 250)

# Centrifuge g-forces
rpms = np.linspace(100, 20000, 200)
for radius_cm in [5, 10, 15, 20]:
    r = radius_cm / 100
    omega = rpms * 2 * np.pi / 60
    a_centripetal = omega**2 * r
    g_force = a_centripetal / g
    ax2.plot(rpms, g_force, linewidth=2, label=f'r={radius_cm}cm')

ax2.set_title('Centrifuge: g-force vs RPM', color='white', fontsize=11, fontweight='bold')
ax2.set_xlabel('RPM', color='white')
ax2.set_ylabel('g-force (multiples of gravity)', color='white')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
ax2.grid(True, alpha=0.2, color='white')
ax2.set_yscale('log')

plt.tight_layout()
plt.savefig('circular_applications.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

# Roller coaster minimum speed at top of loop
print("=== Roller Coaster Loop ===")
for radius in [5, 8, 10, 15]:
    v_min = np.sqrt(g * radius)
    print(f"Loop radius {radius}m: minimum top speed = {v_min:.1f} m/s ({v_min*3.6:.0f} km/h)")

print("\\n=== Washing Machine ===")
drum_radius = 0.25  # metres
for rpm in [400, 800, 1200, 1600]:
    omega = rpm * 2 * np.pi / 60
    a = omega**2 * drum_radius
    print(f"  {rpm} RPM: {a/g:.0f}g force on clothes")`,
      challenge: 'Calculate the minimum speed at the top of a vertical loop for a Ras Lila dancer (impossible in practice!). If the loop radius is 3 metres, what speed is needed? Why is this impractical?',
      successHint: 'Circular motion physics governs an enormous range of technology. From medical centrifuges to highway curves to satellite orbits, the same equation F = mv²/r explains them all.',
    },
    {
      title: 'Orbital energy — the balance of speed and height',
      concept: `An orbiting object has two types of energy:
- **Kinetic energy**: KE = 0.5 x m x v²
- **Gravitational potential energy**: PE = -G x M x m / r

The total **orbital energy** is: E = KE + PE

For a circular orbit: E = -G x M x m / (2r)

Key insight: total energy is **negative** for bound orbits. If you add enough energy to make E >= 0, the object escapes.

The **virial theorem** for gravity says: KE = -0.5 x PE. The kinetic energy is exactly half the magnitude of the potential energy. This beautiful relationship means:
- Adding energy makes the orbit larger (higher r) but slower (lower v)
- Removing energy makes the orbit smaller (lower r) but faster (higher v)

This seems backwards: to go faster, you need to LOSE energy (drop to a lower orbit).`,
      analogy: 'Orbital energy is like a bank balance. A bound orbit has a "negative balance" (in energy debt to gravity). The deeper the debt (more negative E), the tighter the orbit. To "pay off the debt" (escape), you must add enough kinetic energy. And paradoxically, falling into a lower orbit (going deeper into debt) actually makes you move faster.',
      storyConnection: 'In Ras Lila, dancers who step inward to a tighter circle must speed up (to maintain timing). Dancers who step outward slow down. Orbits work the same way — inner orbits are faster, outer orbits are slower. The dancers embody orbital mechanics.',
      checkQuestion: 'If you fire a rocket to speed up a satellite, does it go to a higher or lower orbit?',
      checkAnswer: 'Higher orbit! Adding speed adds kinetic energy, making E less negative. The satellite climbs to a larger orbit — but then slows down in that larger orbit. This is the Hohmann transfer orbit principle used by all space agencies. To go from low Earth orbit to a higher orbit, you burn your engine to speed up, coast upward, then burn again to match the higher orbit speed.',
      codeIntro: 'Calculate and plot orbital energies for satellites at different altitudes.',
      code: `import numpy as np
import matplotlib.pyplot as plt

G = 6.674e-11
M_earth = 5.972e24
R_earth = 6.371e6

altitudes = np.linspace(200e3, 40000e3, 500)  # 200 km to 40,000 km
r = R_earth + altitudes

# Orbital mechanics
v = np.sqrt(G * M_earth / r)        # orbital speed
KE = 0.5 * v**2                      # per unit mass
PE = -G * M_earth / r                # per unit mass
E_total = KE + PE

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

alt_km = altitudes / 1000

ax1.plot(alt_km, v / 1000, color='#34d399', linewidth=2)
ax1.set_title('Orbital Speed vs Altitude', color='white', fontsize=12, fontweight='bold')
ax1.set_xlabel('Altitude (km)', color='white')
ax1.set_ylabel('Speed (km/s)', color='white')
ax1.tick_params(colors='white')
ax1.grid(True, alpha=0.2, color='white')

# Mark key orbits
key_orbits = [(400, 'ISS'), (20200, 'GPS'), (35786, 'GEO')]
for alt, label in key_orbits:
    v_at = np.sqrt(G * M_earth / (R_earth + alt*1000))
    ax1.plot(alt, v_at/1000, 'o', markersize=8, zorder=5)
    ax1.annotate(label, (alt+500, v_at/1000+0.1), color='white', fontsize=9)

ax2.plot(alt_km, KE/1e6, color='#34d399', linewidth=2, label='KE')
ax2.plot(alt_km, PE/1e6, color='#ef4444', linewidth=2, label='PE')
ax2.plot(alt_km, E_total/1e6, color='#f59e0b', linewidth=2, label='Total E')
ax2.axhline(y=0, color='white', alpha=0.3, linestyle='--')
ax2.set_title('Orbital Energy vs Altitude', color='white', fontsize=12, fontweight='bold')
ax2.set_xlabel('Altitude (km)', color='white')
ax2.set_ylabel('Energy per kg (MJ/kg)', color='white')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax2.grid(True, alpha=0.2, color='white')

plt.tight_layout()
plt.savefig('orbital_energy.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print("Key orbital parameters:")
for alt_km_val, name in key_orbits:
    r_val = R_earth + alt_km_val * 1000
    v_val = np.sqrt(G * M_earth / r_val)
    T_val = 2 * np.pi * r_val / v_val
    print(f"  {name} ({alt_km_val}km): v={v_val/1000:.2f} km/s, T={T_val/3600:.1f} hours")

# Virial theorem check
v_iss = np.sqrt(G * M_earth / (R_earth + 400e3))
KE_iss = 0.5 * v_iss**2
PE_iss = -G * M_earth / (R_earth + 400e3)
print(f"\\nVirial theorem (ISS): KE = {KE_iss/1e6:.2f} MJ/kg, -PE/2 = {-PE_iss/2/1e6:.2f} MJ/kg")
print(f"Ratio KE / (-PE/2) = {KE_iss / (-PE_iss/2):.4f} (should be 1.000)")`,
      challenge: 'Calculate the energy needed to move a 1000 kg satellite from ISS orbit (400 km) to geostationary orbit (35,786 km). This is the "delta-v" budget in rocket science.',
      successHint: 'Orbital energy is counter-intuitive: speeding up raises your orbit and eventually slows you down. This paradox is central to understanding space travel and is beautifully illustrated by the Ras Lila connection between radius and speed.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Orbital Mechanics & Visualization</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
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
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
