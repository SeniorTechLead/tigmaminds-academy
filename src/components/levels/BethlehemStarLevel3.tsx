import { useState, useRef, useCallback, createElement } from 'react';
import { Loader2, Cpu } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import BethlehemMagnitudeDiagram from '../diagrams/BethlehemMagnitudeDiagram';
import BethlehemConjunctionDiagram from '../diagrams/BethlehemConjunctionDiagram';
import BethlehemCelestialNavDiagram from '../diagrams/BethlehemCelestialNavDiagram';
import BethlehemKeplerDiagram from '../diagrams/BethlehemKeplerDiagram';
import OrbitalMechanicsDiagram from '../diagrams/OrbitalMechanicsDiagram';
import LatLongGridDiagram from '../diagrams/LatLongGridDiagram';

export default function BethlehemStarLevel3() {
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
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Solving Kepler’s equation — from mean anomaly to true position',
      concept: `Kepler’s laws tell us the shape of orbits, but to predict WHERE a planet is at a specific time, we need to solve **Kepler’s equation**:

**M = E − e sin(E)**

where M is the **mean anomaly** (proportional to time), E is the **eccentric anomaly** (the intermediate angle), and e is the eccentricity. From E, we calculate the **true anomaly** (the actual angle from perihelion).

The problem: this equation cannot be solved algebraically for E. You must solve it **numerically**. The standard method is **Newton-Raphson iteration**: guess E, compute the error, adjust, repeat until the error is tiny.

This is the exact calculation Kepler performed by hand. The code implements Newton-Raphson to solve Kepler’s equation and plot a planet’s position at any time.`,
      analogy: 'Imagine you know a runner’s average speed and how long they have been running, but the track is not circular — it’s oval. You know how much TIME has passed (mean anomaly), but you want to know WHERE on the oval they are (true anomaly). The oval shape means you cannot use simple division — you need to iterate to find the answer.',
      storyConnection: 'Kepler spent years solving this equation by hand for Mars using Tycho Brahe’s observations. The numerical method he developed (essentially Newton-Raphson before Newton) is still used today in every orbital mechanics calculation — from GPS satellites to Mars rovers to the conjunction predictions that the Magi would have needed.',
      checkQuestion: 'Why can’t Kepler’s equation be solved algebraically (in closed form)?',
      checkAnswer: 'Because M = E − e sin(E) mixes E as both a linear term and inside a trigonometric function. There is no algebraic operation that can isolate E from sin(E). This is a transcendental equation — it requires numerical methods. For e = 0 (circular orbit), E = M trivially. But for any non-zero eccentricity, iteration is required.',
      codeIntro: 'Solve Kepler’s equation using Newton-Raphson iteration.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def solve_kepler(M, e, tol=1e-10, max_iter=50):
    """Solve M = E - e*sin(E) for E using Newton-Raphson."""
    E = M  # initial guess
    for i in range(max_iter):
        f = E - e * np.sin(E) - M       # f(E) = 0 when solved
        fp = 1 - e * np.cos(E)           # f'(E)
        dE = -f / fp                      # Newton step
        E = E + dE
        if abs(dE) < tol:
            return E, i + 1
    return E, max_iter

def true_anomaly(E, e):
    """Convert eccentric anomaly to true anomaly."""
    return 2 * np.arctan2(np.sqrt(1+e) * np.sin(E/2), np.sqrt(1-e) * np.cos(E/2))

# Test with different eccentricities
eccentricities = [0.01, 0.1, 0.3, 0.6, 0.9]
M_values = np.linspace(0, 2*np.pi, 200)

plt.figure(figsize=(10, 5))
for e in eccentricities:
    nu_values = []
    for M in M_values:
        E, iters = solve_kepler(M, e)
        nu = true_anomaly(E, e)
        nu_values.append(nu)
    nu_arr = np.array(nu_values)
    # Unwrap and normalize
    nu_arr = np.unwrap(nu_arr)
    plt.plot(np.degrees(M_values), np.degrees(nu_arr), linewidth=2, label=f'e = {e}')

plt.plot([0, 360], [0, 360], 'k--', linewidth=1, alpha=0.3, label='Circular (e=0)')
plt.xlabel('Mean Anomaly M (°)', fontsize=12)
plt.ylabel('True Anomaly ν (°)', fontsize=12)
plt.title('Mean vs True Anomaly: How Eccentricity Distorts Time', fontsize=14)
plt.legend(fontsize=9)
plt.grid(alpha=0.3)
plt.show()

# Show convergence for a specific case
M_test = np.radians(120)
for e in [0.1, 0.5, 0.9]:
    E, iters = solve_kepler(M_test, e)
    nu = true_anomaly(E, e)
    print(f"e={e}: M=120° → E={np.degrees(E):.4f}° → ν={np.degrees(nu):.4f}° ({iters} iterations)")`,
      challenge: 'For Halley’s Comet (e = 0.967), how many iterations does Newton-Raphson need? High eccentricity makes convergence slower. Try implementing a better initial guess: E₀ = M + e·sin(M) (Bessel’s starting value).',
      successHint: 'You just implemented the core algorithm of orbital mechanics. Every satellite tracking system, every spacecraft trajectory, every ephemeris table runs Kepler’s equation solver. Newton-Raphson is one of the most powerful numerical methods in all of science.',
    },
    {
      title: 'Celestial coordinate transforms — equatorial to horizontal',
      concept: `Astronomers use **equatorial coordinates** (RA, Dec) to locate objects in the sky. But to actually point a telescope or navigate, you need **horizontal coordinates** (altitude, azimuth) — how high above the horizon and which compass direction.

The transformation depends on three things:
1. Your **latitude** (φ)
2. The **local sidereal time** (LST) — which RA is currently on your meridian
3. The object’s RA and Dec

The key formula uses **spherical trigonometry**:
- sin(alt) = sin(φ)·sin(Dec) + cos(φ)·cos(Dec)·cos(HA)
where HA = LST − RA is the **hour angle**.

This is the exact calculation the Magi would have performed mentally or with an astrolabe to find objects in the sky.`,
      analogy: 'RA and Dec are like longitude and latitude on a globe — fixed positions on the celestial sphere. But the sphere is rotating! Horizontal coordinates are like asking "where is that city relative to where I’m standing right now?" You need to know your own position and the current rotation angle (sidereal time) to convert between the two.',
      storyConnection: 'An astrolabe — the analog computer of the ancient world — performs exactly this coordinate transformation mechanically. The Magi almost certainly carried astrolabes. By setting the date, time, and latitude, they could read off the altitude and azimuth of any catalogued star or planet.',
      checkQuestion: 'Why is local sidereal time different from clock time?',
      checkAnswer: 'A sidereal day (one full rotation relative to the stars) is about 23 hours 56 minutes — 4 minutes shorter than a solar day. This is because Earth moves along its orbit, so it needs to rotate an extra ~1° each day to face the Sun again. Over a year, sidereal time gains a full day relative to solar time (366.25 sidereal days vs 365.25 solar days).',
      codeIntro: 'Transform equatorial coordinates to horizontal (altitude-azimuth).',
      code: `import numpy as np
import matplotlib.pyplot as plt

def equatorial_to_horizontal(ra_hours, dec_deg, lat_deg, lst_hours):
    """Convert RA/Dec to Altitude/Azimuth.
    ra: right ascension in hours, dec: declination in degrees,
    lat: observer latitude in degrees, lst: local sidereal time in hours.
    """
    ha = (lst_hours - ra_hours) * 15  # hour angle in degrees
    ha_rad = np.radians(ha)
    dec_rad = np.radians(dec_deg)
    lat_rad = np.radians(lat_deg)

    # Altitude
    sin_alt = (np.sin(lat_rad) * np.sin(dec_rad) +
               np.cos(lat_rad) * np.cos(dec_rad) * np.cos(ha_rad))
    alt = np.degrees(np.arcsin(np.clip(sin_alt, -1, 1)))

    # Azimuth
    cos_az = ((np.sin(dec_rad) - np.sin(lat_rad) * sin_alt) /
              (np.cos(lat_rad) * np.cos(np.radians(alt)) + 1e-10))
    az = np.degrees(np.arccos(np.clip(cos_az, -1, 1)))
    if np.sin(ha_rad) > 0:
        az = 360 - az
    return alt, az

# Bethlehem: latitude 31.7° N
lat = 31.7

# Track Polaris (RA=2.53h, Dec=+89.26°) through the night
lst_range = np.linspace(0, 24, 200)
polaris_alt = []
polaris_az = []
for lst in lst_range:
    a, az = equatorial_to_horizontal(2.53, 89.26, lat, lst)
    polaris_alt.append(a)
    polaris_az.append(az)

# Track Jupiter (approximate position in Pisces, Dec ~ -4.5°)
jupiter_alt = []
jupiter_az = []
for lst in lst_range:
    a, az = equatorial_to_horizontal(23.8, -4.5, lat, lst)
    jupiter_alt.append(a)
    jupiter_az.append(az)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))

ax1.plot(lst_range, polaris_alt, linewidth=2, color='#fbbf24', label='Polaris')
ax1.plot(lst_range, jupiter_alt, linewidth=2, color='#a78bfa', label='Jupiter (in Pisces)')
ax1.axhline(0, color='#94a3b8', linewidth=1, linestyle='--', label='Horizon')
ax1.fill_between(lst_range, -10, 0, alpha=0.1, color='#ef4444')
ax1.set_ylabel('Altitude (°)', fontsize=12)
ax1.set_title('Star Altitude from Bethlehem (31.7°N)', fontsize=13)
ax1.legend(fontsize=9)
ax1.set_xlim(0, 24)
ax1.grid(alpha=0.3)

ax2.plot(lst_range, polaris_az, linewidth=2, color='#fbbf24', label='Polaris')
ax2.plot(lst_range, jupiter_az, linewidth=2, color='#a78bfa', label='Jupiter')
ax2.set_xlabel('Local Sidereal Time (hours)', fontsize=12)
ax2.set_ylabel('Azimuth (°)', fontsize=12)
ax2.set_title('Star Azimuth (0°=N, 90°=E, 180°=S, 270°=W)', fontsize=13)
ax2.legend(fontsize=9)
ax2.set_xlim(0, 24)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("Polaris stays at ~32° altitude all night (circumpolar).")
print("Jupiter rises, crosses the meridian, and sets — visible only part of the night.")`,
      challenge: 'Add Saturn to the plot (RA = 23.9h, Dec = −4.0° during the conjunction). At what sidereal time are both planets highest in the sky? That would be the best time for the Magi to observe them.',
      successHint: 'Coordinate transformation is the bridge between the abstract celestial sphere and what you actually see when you look up. Every telescope mount, every planetarium app, every satellite tracker performs this calculation continuously.',
    },
    {
      title: 'Gravitational two-body problem — deriving Kepler from Newton',
      concept: `Kepler discovered his laws empirically (from data). Newton’s law of gravity **explains** why they work.

The gravitational force between two bodies: **F = GMm/r²**

From F = ma and this force law, we can derive all three of Kepler’s laws:
- Law 1 (ellipses): comes from the r² in the denominator
- Law 2 (equal areas): comes from conservation of angular momentum
- Law 3 (T² ∝ a³): comes from equating gravitational and centripetal force

The code numerically integrates the two-body problem (Sun + planet) and verifies that all three laws emerge naturally from Newton’s gravity.`,
      analogy: 'Kepler’s laws are like saying "cars on this highway always take 2 hours to travel 100 miles." Newton’s gravity is like understanding the engine, the fuel, the friction, and the road surface. Kepler told us WHAT planets do. Newton told us WHY. From Newton’s one equation, all of Kepler’s laws follow as mathematical consequences.',
      storyConnection: 'The progression from observation (Magi) to pattern (Kepler) to explanation (Newton) mirrors the scientific method itself. The Magi observed a bright object; Kepler showed it was a conjunction predicted by orbital laws; Newton showed those laws follow from universal gravity.',
      checkQuestion: 'If gravity followed a 1/r³ law instead of 1/r², would orbits still be ellipses?',
      checkAnswer: 'No. The 1/r² law is special: it is one of only two force laws that produce closed (repeating) orbits (the other is Hooke’s law, F ∝ r). A 1/r³ law would produce spiraling orbits that never repeat. Bertrand’s theorem proves this mathematically. The fact that planetary orbits are closed is direct evidence that gravity follows the inverse square law.',
      codeIntro: 'Numerically integrate gravity to produce Kepler’s elliptical orbits.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Constants (normalized: G*M_sun = 4*pi^2 AU^3/yr^2)
GM = 4 * np.pi**2  # so that a=1 AU gives T=1 yr (Kepler's 3rd law)

def simulate_orbit(a, e, dt=0.0001, n_orbits=1):
    """Simulate orbit using Euler-Cromer (symplectic) integration."""
    # Initial conditions at perihelion
    r0 = a * (1 - e)
    v0 = np.sqrt(GM * (2/r0 - 1/a))  # vis-viva equation

    x, y = r0, 0.0
    vx, vy = 0.0, v0
    xs, ys = [x], [y]
    areas = []
    T = 2 * np.pi * np.sqrt(a**3 / GM)  # predicted period

    t = 0
    area_sum = 0
    area_dt = T / 12  # measure area in 1/12 orbit chunks
    last_area_t = 0

    while t < T * n_orbits:
        r = np.sqrt(x**2 + y**2)
        ax = -GM * x / r**3
        ay = -GM * y / r**3
        # Euler-Cromer (update v first, then x)
        vx += ax * dt
        vy += ay * dt
        x += vx * dt
        y += vy * dt
        t += dt

        # Track area swept (cross product / 2)
        area_sum += 0.5 * abs(x * vy - y * vx) * dt

        if t - last_area_t >= area_dt:
            areas.append(area_sum)
            area_sum = 0
            last_area_t = t

        if len(xs) < 50000:
            xs.append(x)
            ys.append(y)

    return np.array(xs), np.array(ys), areas, T

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Left: orbit shape
for e, color, label in [(0.0, '#67e8f9', 'Circle'),
                         (0.2, '#3b82f6', 'e=0.2'),
                         (0.5, '#a78bfa', 'e=0.5'),
                         (0.8, '#ef4444', 'e=0.8')]:
    xs, ys, areas, T = simulate_orbit(3.0, e)
    axes[0].plot(xs, ys, linewidth=1.5, color=color, label=label)

axes[0].plot(0, 0, 'o', color='#fbbf24', markersize=8, zorder=10)
axes[0].set_aspect('equal')
axes[0].set_title('Orbits from Newton\\'s Gravity', fontsize=13)
axes[0].legend(fontsize=9)
axes[0].grid(alpha=0.2)

# Right: verify Kepler's 2nd law (equal areas)
xs, ys, areas, T = simulate_orbit(3.0, 0.5)
if len(areas) > 2:
    axes[1].bar(range(len(areas)), areas, color='#a78bfa', alpha=0.7)
    axes[1].axhline(np.mean(areas), color='#fbbf24', linewidth=2, linestyle='--', label=f'Mean area = {np.mean(areas):.3f}')
    axes[1].set_xlabel('Time chunk (1/12 orbit)', fontsize=12)
    axes[1].set_ylabel('Area swept', fontsize=12)
    axes[1].set_title('Kepler\\'s 2nd Law: Equal Areas?', fontsize=13)
    axes[1].legend(fontsize=9)
    axes[1].grid(alpha=0.3)

plt.tight_layout()
plt.show()

# Verify Kepler's 3rd law
print("Kepler\\'s 3rd Law verification:")
for a in [0.5, 1.0, 2.0, 5.0, 10.0]:
    xs, ys, areas, T = simulate_orbit(a, 0.1, dt=0.0001)
    print(f"  a = {a:5.1f} AU: T = {T:.4f} yr, T² = {T**2:.3f}, a³ = {a**3:.3f}, ratio = {T**2/a**3:.6f}")`,
      challenge: 'Add a third body (another planet) to the simulation. Does the orbit remain a perfect ellipse? The three-body problem has no general closed-form solution — this is one of the most famous unsolved problems in physics.',
      successHint: 'You just derived Kepler’s laws from first principles. Starting with F = GMm/r² and numerically integrating, elliptical orbits, equal-area sweeps, and T² = a³ all emerged naturally. This is the power of simulation: you can verify theoretical predictions by watching the physics play out.',
    },
    {
      title: 'Stellar photometry — measuring brightness precisely',
      concept: `Modern astronomers measure star brightness with **photometry** — counting the exact number of photons collected by a sensor. This is far more precise than the naked-eye estimates of Hipparchus.

A CCD sensor (the same technology in your phone camera) converts photons to electrons. The key formula:

**m = −2.5 × log₁₀(F) + C**

where F is the measured flux (photons per second per area) and C is a calibration constant.

The challenge: **noise**. Sensors have read noise, dark current, and shot noise (from the quantum nature of photons). Signal-to-noise ratio (SNR) determines how precisely you can measure a star’s magnitude.

The code simulates CCD photometry: generating star signals with realistic noise and measuring magnitudes.`,
      analogy: 'Imagine counting raindrops falling on a bucket in 10 seconds. Some seconds you count 50, others 55, others 48 — random variation (shot noise). If the rain is heavy (bright star), the variation is a small percentage of the total. If the rain is light (faint star), a few extra or missing drops make a big percentage difference. That’s why faint stars are harder to measure precisely.',
      storyConnection: 'The Magi estimated magnitudes by eye — accurate to about 0.5 magnitudes. Modern CCD photometry achieves 0.001 magnitude precision. This million-fold improvement is what lets us detect exoplanet transits (a 0.01 magnitude dip when a planet crosses its star) and measure the cosmic distance ladder.',
      checkQuestion: 'Why does doubling the exposure time improve SNR by only √2, not 2×?',
      checkAnswer: 'Signal grows linearly with time (2× time = 2× photons). But shot noise grows as √N (square root of photon count). So SNR = signal/noise = N/√N = √N. Doubling N (time) gives SNR = √(2N) = √2 × √N. You need 4× the exposure to double the SNR. This is a fundamental limit set by quantum physics.',
      codeIntro: 'Simulate CCD photometry with realistic noise models.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

def simulate_photometry(true_mag, exposure_time, aperture_area=1.0,
                        sky_bg=100, read_noise=10, dark_current=5):
    """Simulate a CCD magnitude measurement with noise."""
    # Convert magnitude to flux (photons/s/area)
    flux = 10 ** (-0.4 * true_mag) * 1e6  # arbitrary zero point

    # Signal photons
    signal = flux * exposure_time * aperture_area

    # Noise sources
    shot_noise = np.sqrt(signal)                    # Poisson
    sky_noise = np.sqrt(sky_bg * exposure_time)     # sky background
    dark_noise = np.sqrt(dark_current * exposure_time)
    total_noise = np.sqrt(shot_noise**2 + sky_noise**2 +
                         dark_noise**2 + read_noise**2)

    # Measured signal with noise
    measured = signal + np.random.normal(0, total_noise)
    snr = signal / total_noise
    measured_mag = -2.5 * np.log10(max(measured, 1) / 1e6 / exposure_time)

    return measured_mag, snr, signal, total_noise

# Measure stars of different magnitudes
true_mags = np.arange(0, 8, 0.5)
n_measurements = 50
exposure = 30  # seconds

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

for mag in true_mags:
    measured = [simulate_photometry(mag, exposure)[0] for _ in range(n_measurements)]
    ax1.scatter(np.full(n_measurements, mag), measured, s=5, alpha=0.3, color='#a78bfa')
    mean_m = np.mean(measured)
    std_m = np.std(measured)
    ax1.errorbar(mag, mean_m, yerr=std_m, fmt='o', color='#fbbf24',
                markersize=5, capsize=3)

ax1.plot([0, 8], [0, 8], 'k--', alpha=0.3, label='Perfect measurement')
ax1.set_xlabel('True Magnitude', fontsize=12)
ax1.set_ylabel('Measured Magnitude', fontsize=12)
ax1.set_title('Photometric Accuracy vs Brightness', fontsize=13)
ax1.legend(fontsize=9)
ax1.grid(alpha=0.3)

# SNR vs magnitude
snrs = [simulate_photometry(m, exposure)[1] for m in true_mags]
ax2.semilogy(true_mags, snrs, 'o-', color='#67e8f9', linewidth=2)
ax2.axhline(10, color='#ef4444', linewidth=1, linestyle='--', label='SNR = 10 (min for good measurement)')
ax2.set_xlabel('Magnitude', fontsize=12)
ax2.set_ylabel('Signal-to-Noise Ratio', fontsize=12)
ax2.set_title('SNR Drops for Fainter Stars', fontsize=13)
ax2.legend(fontsize=9)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print("Brighter stars (low mag) have high SNR → precise measurements.")
print("Fainter stars (high mag) have low SNR → noisy measurements.")`,
      challenge: 'Try different exposure times (10s, 30s, 120s, 300s). Plot how the SNR improves. At what exposure time can you reliably measure a magnitude 8 star (SNR > 10)?',
      successHint: 'Photometry is the quantitative backbone of astronomy. Every discovery — from exoplanets to dark energy — relies on measuring brightness to extreme precision. The noise models you coded are the same ones used to design telescope surveys costing billions of dollars.',
    },
    {
      title: 'Orbital perturbations — why planets don’t follow perfect ellipses',
      concept: `Kepler’s laws describe perfect two-body orbits (one planet, one Sun). In reality, every planet pulls on every other planet, causing **perturbations** — small deviations from the ideal ellipse.

Jupiter’s gravity tugs on Saturn, causing Saturn’s orbit to wobble. This wobble is predictable but complex. For the triple conjunction of 7 BCE, perturbations shifted the timing by several weeks compared to the unperturbed prediction.

Perturbation theory was one of the great triumphs of 18th-century mathematics. Lagrange, Laplace, and others developed methods to calculate these effects. The discovery of Neptune in 1846 was a direct result of perturbation analysis — Uranus’s orbit deviated from predictions, and the perturbation pointed to an unseen planet.

The code simulates a simplified three-body problem (Sun, Jupiter, Saturn) to see how perturbations affect Saturn’s orbit.`,
      analogy: 'Imagine you are walking in a straight line across a field. A strong magnet sits off to one side (Jupiter’s gravity). As you pass the magnet, your iron belt buckle is tugged sideways — you deviate from your straight path. The pull is small but real, and if you are carrying a compass, you can measure exactly how much you were deflected. That deflection is a perturbation.',
      storyConnection: 'When Kepler calculated the 7 BCE conjunction, he used his laws assuming perfect ellipses. The actual conjunction timing was shifted by perturbations. Modern ephemeris calculations account for perturbations from all planets, relativistic corrections, and even the gravitational effects of large asteroids. The result: we can predict planetary positions thousands of years into the past or future to within arcseconds.',
      checkQuestion: 'Jupiter’s mass is about 1/1000 of the Sun’s. Why does such a small fraction cause significant perturbations?',
      checkAnswer: 'Because perturbations accumulate over many orbits. A tiny tug on each orbit adds up over decades and centuries. Saturn’s orbital period is ~29.5 years. Over 100 years (3+ orbits), even a 0.1% force imbalance per orbit accumulates into a measurable position shift. Also, during close approaches (conjunctions), Jupiter’s pull on Saturn can briefly exceed 1/100 of the Sun’s pull — enough to shift Saturn’s position by a noticeable amount.',
      codeIntro: 'Simulate the Sun-Jupiter-Saturn three-body problem.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Normalized units: AU, years, solar masses
GM_sun = 4 * np.pi**2
GM_jup = GM_sun / 1047  # Jupiter mass ~ 1/1047 solar mass

def three_body(dt=0.001, T_max=60):
    """Simulate Sun + Jupiter + Saturn."""
    # Initial conditions (approximate)
    # Jupiter: a=5.2, e~0
    jx, jy = 5.2, 0.0
    jvx, jvy = 0.0, np.sqrt(GM_sun / 5.2)
    # Saturn: a=9.54, e~0
    sx, sy = 9.54, 0.0
    svx, svy = 0.0, np.sqrt(GM_sun / 9.54)

    jxs, jys, sxs, sys_ = [jx], [jy], [sx], [sy]
    # Also simulate unperturbed Saturn
    sx2, sy2 = 9.54, 0.0
    svx2, svy2 = 0.0, np.sqrt(GM_sun / 9.54)
    sx2s, sy2s = [sx2], [sy2]

    t = 0
    while t < T_max:
        # Jupiter-Sun distance
        jr = np.sqrt(jx**2 + jy**2)
        # Saturn-Sun distance
        sr = np.sqrt(sx**2 + sy**2)
        # Jupiter-Saturn distance
        djs = np.sqrt((jx-sx)**2 + (jy-sy)**2)

        # Forces on Jupiter (from Sun only, simplified)
        jax = -GM_sun * jx / jr**3
        jay = -GM_sun * jy / jr**3

        # Forces on Saturn (from Sun + Jupiter)
        sax = -GM_sun * sx / sr**3 - GM_jup * (sx-jx) / djs**3
        say = -GM_sun * sy / sr**3 - GM_jup * (sy-jy) / djs**3

        # Unperturbed Saturn (Sun only)
        sr2 = np.sqrt(sx2**2 + sy2**2)
        sax2 = -GM_sun * sx2 / sr2**3
        say2 = -GM_sun * sy2 / sr2**3

        # Euler-Cromer integration
        jvx += jax * dt; jvy += jay * dt
        jx += jvx * dt; jy += jvy * dt
        svx += sax * dt; svy += say * dt
        sx += svx * dt; sy += svy * dt
        svx2 += sax2 * dt; svy2 += say2 * dt
        sx2 += svx2 * dt; sy2 += svy2 * dt

        t += dt
        if int(t / dt) % 100 == 0:
            jxs.append(jx); jys.append(jy)
            sxs.append(sx); sys_.append(sy)
            sx2s.append(sx2); sy2s.append(sy2)

    return (np.array(jxs), np.array(jys),
            np.array(sxs), np.array(sys_),
            np.array(sx2s), np.array(sy2s))

jx, jy, sx, sy, sx2, sy2 = three_body()

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
ax1.plot(jx, jy, linewidth=0.5, color='#f59e0b', alpha=0.7, label='Jupiter')
ax1.plot(sx, sy, linewidth=0.5, color='#a78bfa', alpha=0.7, label='Saturn (perturbed)')
ax1.plot(sx2, sy2, linewidth=0.5, color='#67e8f9', alpha=0.3, label='Saturn (ideal)')
ax1.plot(0, 0, 'o', color='#fbbf24', markersize=8)
ax1.set_aspect('equal')
ax1.set_title('Orbits: Perturbed vs Ideal', fontsize=13)
ax1.legend(fontsize=8)
ax1.grid(alpha=0.2)

# Perturbation magnitude
perturbation = np.sqrt((sx - sx2)**2 + (sy - sy2)**2)
t_pts = np.linspace(0, 60, len(perturbation))
ax2.plot(t_pts, perturbation, linewidth=1.5, color='#ef4444')
ax2.set_xlabel('Time (years)', fontsize=12)
ax2.set_ylabel('Position difference (AU)', fontsize=12)
ax2.set_title('Saturn\\'s Perturbation by Jupiter', fontsize=13)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

print(f"Max perturbation over 60 years: {np.max(perturbation):.4f} AU")
print(f"That\\'s {np.max(perturbation) * 1.496e8:.0f} km — measurable even in ancient times")`,
      challenge: 'Add Earth to the simulation (a = 1.0 AU) and see how it is perturbed by Jupiter. Is Earth’s perturbation larger or smaller than Saturn’s? Why?',
      successHint: 'Perturbation theory is where orbital mechanics meets real-world complexity. The three-body problem has no closed-form solution — numerical simulation is the only way to track the full gravitational dance. This is what modern ephemeris services (JPL Horizons) compute for every planet, asteroid, and spacecraft.',
    },
    {
      title: 'Building an ephemeris — predicting planetary positions for any date',
      concept: `An **ephemeris** is a table of predicted positions for celestial objects at regular time intervals. For millennia, astronomers built ephemerides by hand. Today, they are computed numerically.

Your task: build a simplified ephemeris that predicts the ecliptic longitude of Jupiter and Saturn for any date, including historical dates like 7 BCE. The algorithm:

1. Start from known positions at a reference date (J2000.0 epoch)
2. Integrate orbits forward or backward using Kepler’s equation
3. Transform heliocentric positions to geocentric (as seen from Earth)
4. Output ecliptic longitude at each time step

This is a stripped-down version of what JPL’s HORIZONS system does for the entire solar system.`,
      analogy: 'An ephemeris is like a train timetable for planets. The timetable tells you where each train (planet) will be at any time. But unlike trains, planets follow smooth mathematical curves, so you can calculate past and future positions with equal precision. Our code is the timetable calculator.',
      storyConnection: 'Babylonian astronomers maintained ephemerides on clay tablets. The MUL.APIN tablets (around 1000 BCE) recorded planetary positions over centuries. The Magi inherited this tradition. When they computed the upcoming Jupiter-Saturn conjunction, they were reading their own ephemeris — built from generations of observations.',
      checkQuestion: 'Why do professional ephemerides include relativistic corrections?',
      checkAnswer: 'Mercury’s orbit precesses by 43 arcseconds per century more than Newtonian gravity predicts. Einstein’s general relativity explains this: spacetime curvature near the Sun causes the orbit to precess. For high-precision predictions (needed for spacecraft navigation), relativistic corrections are essential. Even GPS satellites must account for both special and general relativity to maintain position accuracy.',
      codeIntro: 'Build a simplified ephemeris for Jupiter and Saturn.',
      code: `import numpy as np
import matplotlib.pyplot as plt

def kepler_solve(M, e, tol=1e-12):
    E = M
    for _ in range(50):
        dE = -(E - e * np.sin(E) - M) / (1 - e * np.cos(E))
        E += dE
        if abs(dE) < tol: break
    return E

def planet_ecliptic_longitude(t_years, a, e, P, L0, omega):
    """Ecliptic longitude of a planet at time t (years from J2000)."""
    # Mean anomaly
    n = 2 * np.pi / P  # mean motion
    M = n * t_years + np.radians(L0 - omega)
    M = M % (2 * np.pi)
    # Solve Kepler
    E = kepler_solve(M, e)
    # True anomaly
    nu = 2 * np.arctan2(np.sqrt(1+e) * np.sin(E/2), np.sqrt(1-e) * np.cos(E/2))
    # Heliocentric longitude
    lon = nu + np.radians(omega)
    return np.degrees(lon) % 360

def geocentric_longitude(t, a_p, e_p, P_p, L0_p, omega_p):
    """Apparent ecliptic longitude from Earth."""
    # Earth parameters (simplified)
    a_e, e_e, P_e = 1.0, 0.017, 1.0
    L0_e, omega_e = 100.46, 102.94

    # Heliocentric positions
    lon_e = np.radians(planet_ecliptic_longitude(t, a_e, e_e, P_e, L0_e, omega_e))
    lon_p = np.radians(planet_ecliptic_longitude(t, a_p, e_p, P_p, L0_p, omega_p))

    r_e = a_e * (1 - e_e**2) / (1 + e_e * np.cos(lon_e - np.radians(omega_e)))
    r_p = a_p * (1 - e_p**2) / (1 + e_p * np.cos(lon_p - np.radians(omega_p)))

    ex, ey = r_e * np.cos(lon_e), r_e * np.sin(lon_e)
    px, py = r_p * np.cos(lon_p), r_p * np.sin(lon_p)

    return np.degrees(np.arctan2(py - ey, px - ex)) % 360

# Generate ephemeris for 7 BCE (approximately -2006.0 from J2000)
# J2000 = 2000.0, so 7 BCE = -6.0, offset = -2006.0
t_range = np.linspace(-2006.5, -2005.5, 1000)  # one year around 7 BCE

jup_lon = [geocentric_longitude(t, 5.203, 0.048, 11.86, 34.40, 14.75) for t in t_range]
sat_lon = [geocentric_longitude(t, 9.537, 0.054, 29.46, 49.94, 92.43) for t in t_range]

jup_lon = np.array(jup_lon)
sat_lon = np.array(sat_lon)

# Angular separation
sep = np.abs(jup_lon - sat_lon)
sep = np.minimum(sep, 360 - sep)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8))

ax1.plot(t_range + 2006, jup_lon, linewidth=2, color='#f59e0b', label='Jupiter')
ax1.plot(t_range + 2006, sat_lon, linewidth=2, color='#a78bfa', label='Saturn')
ax1.set_ylabel('Ecliptic Longitude (°)', fontsize=12)
ax1.set_title('Ephemeris: Jupiter & Saturn in 7 BCE', fontsize=13)
ax1.legend(fontsize=10)
ax1.grid(alpha=0.3)

ax2.plot(t_range + 2006, sep, linewidth=2, color='#67e8f9')
ax2.axhline(5, color='#ef4444', linewidth=1, linestyle='--', label='5° threshold')
ax2.fill_between(t_range + 2006, 0, sep, where=sep < 5, alpha=0.2, color='#fbbf24')
ax2.set_xlabel('Months (0 = start of year)', fontsize=12)
ax2.set_ylabel('Angular Separation (°)', fontsize=12)
ax2.set_title('Jupiter-Saturn Separation During 7 BCE', fontsize=13)
ax2.legend(fontsize=10)
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()

close_times = t_range[sep < 5] + 2006
if len(close_times) > 0:
    print(f"Close approaches (< 5°) span months {close_times[0]:.2f} to {close_times[-1]:.2f}")
    min_sep_idx = np.argmin(sep)
    print(f"Closest approach: {sep[min_sep_idx]:.2f}° at month {t_range[min_sep_idx]+2006:.2f}")`,
      challenge: 'Run the ephemeris for the year 2020 and find the December 2020 Great Conjunction (Jupiter-Saturn at 0.1° separation). Compare with the 7 BCE conjunction. Which was closer?',
      successHint: 'You have built the core of an ephemeris engine. Professional versions (JPL HORIZONS, IMCCE) use the same principles but with higher-precision orbital elements, perturbation corrections, and relativistic adjustments. The Magi’s observations, Kepler’s calculations, and your Python code all solve the same problem: where will the planets be?',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Cpu className="w-4 h-4" /> Level 3: Advanced Orbital Mechanics
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Numerical methods, perturbation theory, and ephemeris computation</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for advanced orbital simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Cpu className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            diagram={[BethlehemKeplerDiagram, BethlehemCelestialNavDiagram, OrbitalMechanicsDiagram, BethlehemMagnitudeDiagram, BethlehemConjunctionDiagram, LatLongGridDiagram][i] ? createElement([BethlehemKeplerDiagram, BethlehemCelestialNavDiagram, OrbitalMechanicsDiagram, BethlehemMagnitudeDiagram, BethlehemConjunctionDiagram, LatLongGridDiagram][i]) : undefined}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
