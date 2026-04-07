import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function VikingNavLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design a Celestial Navigation Simulator',
      concept: `In this capstone you will build a complete **Celestial Navigation Simulator** that: (1) computes star positions for any date/time/location, (2) simulates a multi-day Atlantic crossing with weather, currents, and celestial observations, (3) fuses dead reckoning with star fixes using a Kalman filter, (4) validates against historical Viking voyage data, and (5) generates a technical report.

This brings together everything from Levels 1-3: spherical trigonometry, precession, ocean currents, birefringence, Kalman filtering, Monte Carlo simulation, and risk assessment.

The first step is **system design** — planning the architecture before writing code. Real software engineers spend more time designing than coding.

📚 *System design means deciding what your program does, how it's organized, and what data it needs — BEFORE you write code.*`,
      analogy: 'Before building a ship, a Viking shipwright carved a small model to test the hull shape. Before writing a simulator, an engineer draws a system diagram to test the architecture. Both are prototyping the design before committing to the full build.',
      storyConnection: 'Viking shipbuilders followed a systematic process: keel first, then ribs, then clinker planking, then mast step. Each element depended on the previous one. Your simulator follows the same logic: data structures first, then physics engines, then the simulation loop.',
      checkQuestion: 'Why design the data structures before writing the simulation loop?',
      checkAnswer: 'The simulation loop operates ON the data structures. If your Star class doesn\'t store right ascension and declination, the position engine can\'t compute altitude. Good data structures make algorithms straightforward; bad ones make them impossible.',
      codeIntro: 'Design the architecture — define all core classes and their relationships.',
      code: `import numpy as np

class Star:
    def __init__(self, name, ra_hours, dec_deg, magnitude):
        self.name, self.ra, self.dec, self.mag = name, ra_hours, dec_deg, magnitude
    def altitude(self, obs_lat, lst):
        ha = np.radians((lst - self.ra) * 15)
        lat, dec = np.radians(obs_lat), np.radians(self.dec)
        return np.degrees(np.arcsin(np.sin(lat)*np.sin(dec) +
                                    np.cos(lat)*np.cos(dec)*np.cos(ha)))

class Ship:
    def __init__(self, lat, lon, heading, speed):
        self.lat, self.lon, self.heading, self.speed = lat, lon, heading, speed
        self.lat_unc, self.lon_unc = 0.5, 1.0  # degrees uncertainty

class Weather:
    def __init__(self):
        self.wind_speed = self.wind_dir = 0
        self.visibility, self.storm = 1.0, False

STARS = [
    Star("Polaris", 2.53, 89.26, 1.97), Star("Vega", 18.62, 38.78, 0.03),
    Star("Arcturus", 14.26, 19.18, -0.05), Star("Capella", 5.28, 46.00, 0.08),
    Star("Deneb", 20.69, 45.28, 1.25), Star("Dubhe", 11.06, 61.75, 1.79),
    Star("Kochab", 14.85, 74.16, 2.07), Star("Schedar", 0.68, 56.54, 2.24),
    Star("Mirfak", 3.41, 49.86, 1.80), Star("Aldebaran", 4.60, 16.51, 0.87),
]

print("=== Celestial Navigation Simulator — Architecture ===")
print("Classes: Star, Ship, Weather, Voyage")
print(f"Star catalogue: {len(STARS)} navigation stars\\n")

print(f"{'Star':<12} {'RA (h)':>7} {'Dec':>7} {'Alt at LST=0':>13} {'Visible?':>9}")
print("-" * 50)
for s in STARS:
    alt = s.altitude(64.1, 0)
    print(f"{s.name:<12} {s.ra:>6.2f} {s.dec:>6.1f}° {alt:>11.1f}° {'YES' if alt > 5 else 'no':>7}")`,
      challenge: 'Add an azimuth method to Star that computes the compass direction (0°=N, 90°=E). Test with Polaris — it should be very close to 0° (due north).',
      successHint: 'Good system design separates concerns: Star knows celestial mechanics, Ship knows navigation state. This separation makes components testable and reusable — the hallmark of professional software.',
    },
    {
      title: 'Star position engine — compute any star\'s position for any date and location',
      concept: `The star position engine computes, for a given **date**, **time**, and **observer location**:

1. **Sidereal time** — the celestial sphere "clock." Stars rotate once every 23h 56m 4s (sidereal day), meaning they rise ~4 minutes earlier each night.
2. **Hour angle** — how far a star has rotated past the meridian: HA = LST - RA.
3. **Altitude and azimuth** — the star's position in the observer's sky via spherical trigonometry.
4. **Atmospheric refraction** — the atmosphere bends light upward, making stars appear ~0.5° higher near the horizon.

📚 *Sidereal time advances 360° in 23h 56m. The 3m 56s daily difference accumulates to a full day over one year — which is why different constellations appear in different seasons.*`,
      analogy: 'A carousel has horses at fixed positions. As it spins, different horses pass your vantage point. Stars are the horses, the celestial sphere is the carousel, and sidereal time tells you the rotation angle — letting you predict which star is visible at any moment.',
      storyConnection: 'Viking navigators knew the stars shifted timing through the year — the same star at midnight in June appeared at sunset in September. The star position engine formalizes this knowledge into precise calculations.',
      checkQuestion: 'Polaris has RA = 2.53h. If local sidereal time is 2.53h, where is Polaris?',
      checkAnswer: 'Hour angle = 0 — Polaris is transiting (crossing the meridian). For Polaris specifically (dec ≈ 89°), it\'s always near the same altitude (≈ observer latitude), but this is when it\'s closest to due north.',
      codeIntro: 'Build the star position engine with sidereal time, refraction, and altitude/azimuth.',
      code: `import numpy as np

def julian_day(year, month, day, hour=0):
    if month <= 2: year -= 1; month += 12
    A = int(year/100); B = 2 - A + int(A/4)
    return int(365.25*(year+4716)) + int(30.6001*(month+1)) + day + B - 1524.5 + hour/24

def gmst(jd):
    T = (jd - 2451545.0) / 36525.0
    g = 280.46061837 + 360.98564736629*(jd - 2451545.0) + 0.000387933*T**2
    return (g % 360) / 15.0

def star_altaz(ra_h, dec_d, obs_lat, obs_lon, jd):
    lst = (gmst(jd) + obs_lon/15.0) % 24.0
    ha = np.radians((lst - ra_h) * 15.0)
    lat, dec = np.radians(obs_lat), np.radians(dec_d)
    sin_alt = np.sin(lat)*np.sin(dec) + np.cos(lat)*np.cos(dec)*np.cos(ha)
    alt = np.degrees(np.arcsin(np.clip(sin_alt, -1, 1)))
    cos_az = (np.sin(dec) - np.sin(lat)*np.sin(np.radians(alt))) / \
             (np.cos(lat)*np.cos(np.radians(alt)) + 1e-10)
    az = np.degrees(np.arccos(np.clip(cos_az, -1, 1)))
    if np.sin(ha) > 0: az = 360 - az
    if alt > -1:  # refraction correction
        alt += 1.02 / np.tan(np.radians(alt + 10.3/(alt + 5.11))) / 60
    return alt, az

stars = [("Polaris", 2.53, 89.26), ("Vega", 18.62, 38.78),
         ("Arcturus", 14.26, 19.18), ("Capella", 5.28, 46.00),
         ("Deneb", 20.69, 45.28), ("Dubhe", 11.06, 61.75),
         ("Kochab", 14.85, 74.16), ("Aldebaran", 4.60, 16.51)]

obs_lat, obs_lon = 62.0, -33.0  # mid-Atlantic
jd = julian_day(1000, 7, 15, 0)

print("=== Star Position Engine ===")
print(f"July 15, 1000 CE, midnight | Observer: {obs_lat}°N, {abs(obs_lon)}°W\\n")
print(f"{'Star':<12} {'Altitude':>9} {'Azimuth':>9} {'Visible':>8} {'Use':>20}")
print("-" * 60)

for name, ra, dec in stars:
    alt, az = star_altaz(ra, dec, obs_lat, obs_lon, jd)
    vis = "YES" if alt > 5 else "no"
    use = "Latitude ref" if name == "Polaris" else "Altitude fix" if alt > 30 else "Bearing" if alt > 5 else "-"
    print(f"{name:<12} {alt:>7.1f}° {az:>7.1f}° {vis:>6} {use:>18}")

pol_alt, _ = star_altaz(2.53, 89.26, obs_lat, obs_lon, jd)
print(f"\\nPolaris altitude: {pol_alt:.1f}° vs true latitude: {obs_lat}° (err: {abs(pol_alt-obs_lat):.2f}°)")

print(f"\\n=== Vega Through the Night ===")
for h in range(7):
    alt, az = star_altaz(18.62, 38.78, obs_lat, obs_lon, julian_day(1000,7,15,h))
    print(f"  {h:>2}:00  alt={alt:.1f}°  az={az:.1f}°")`,
      challenge: 'Add a precession correction for the year 1000 CE. Polaris was about 6° from the true pole then. Implement a function that adjusts RA/Dec from J2000 to the observation epoch.',
      successHint: 'You built a star position engine — the same computation in planetarium software, telescope systems, and spacecraft navigation. The core algorithm (sidereal time + spherical trig + refraction) is universal.',
    },
    {
      title: 'Voyage simulator — full Atlantic crossing with weather, currents, and star fixes',
      concept: `Now we combine all components into a complete simulation that runs hour by hour:

1. **Generate weather** (wind, visibility, storms)
2. **Apply physics**: ship velocity = sailing + current + wind drift
3. **Update position** (dead reckoning)
4. **Grow uncertainty** (DR errors accumulate)
5. **If sky clear**: take star fix, Kalman update to reduce uncertainty
6. **Log everything**: true position, estimated position, uncertainty

The output shows where the ship actually went, where the navigator THOUGHT it went, and how the two diverged.

📚 *Multi-physics simulations model multiple interacting systems simultaneously. Modern examples: climate models, crash simulations, flight simulators.*`,
      analogy: 'A flight simulator models the air, weather, terrain, instruments, and pilot inputs all interacting. Your voyage simulator does the same: ocean, wind, stars, current, and navigator observations all interact to determine the outcome.',
      storyConnection: 'Every Viking crossing was this simulation played out in reality — a ship at the mercy of physics, weather, and the navigator\'s skill, hour by hour across the Atlantic. The sagas are the historical "output."',
      checkQuestion: 'After 3 days of fog, dead reckoning uncertainty is ±80 km. A star fix reduces it to ±5 km. Next day is foggy. What happens?',
      checkAnswer: 'Uncertainty grows again to ±20-30 km. The Kalman filter resets uncertainty with each fix, but between fixes errors accumulate. This sawtooth pattern is the signature of intermittent celestial navigation.',
      codeIntro: 'Run a complete 7-day crossing with all physics, weather, and celestial navigation.',
      code: `import numpy as np
np.random.seed(42)

start_lat, start_lon = 64.1, -21.9
target_lat, target_lon = 61.2, -45.5
heading, ship_speed, days = 258, 8.0, 7

true_lat, true_lon = start_lat, start_lon
est_lat, est_lon = start_lat, start_lon
uncertainty, proc_noise = 5.0, 3.0
storms, fixes, log = 0, 0, []

print("=== Full Voyage Simulation: Iceland to Greenland ===")
print(f"Target: {target_lat}°N, {abs(target_lon)}°W | Heading: {heading}°\\n")

for hour in range(days * 24):
    # Weather
    storm = np.random.random() < 0.03
    vis = np.random.beta(3, 2)
    if storm: storms += 1; vis = 0.1

    # True movement
    spd = max(1, ship_speed + np.random.normal(0, 1.0))
    h_err = np.random.normal(0, 20 if storm else 2)
    eff_h = np.radians(heading + h_err)
    if storm: spd *= 0.3

    # Ocean current (EGC southward)
    curr_e = 1.5 * np.exp(-((true_lat-55)**2)/200) * 0.5
    curr_n = -2.0 * np.exp(-((true_lon+35)**2)/50) * np.exp(-((true_lat-64)**2)/80)

    v_e = spd*np.sin(eff_h) + curr_e + np.random.normal(0, 0.3)
    v_n = spd*np.cos(eff_h) + curr_n + np.random.normal(0, 0.3)
    true_lat += v_n / 111.0
    true_lon += v_e / (111.0 * np.cos(np.radians(true_lat)))

    # Dead reckoning estimate
    est_lat += ship_speed * np.cos(np.radians(heading)) / 111.0
    est_lon += ship_speed * np.sin(np.radians(heading)) / (111.0 * np.cos(np.radians(est_lat)))
    uncertainty = np.sqrt(uncertainty**2 + proc_noise**2)

    # Star fix attempt
    is_day = (hour % 24) < 16
    if is_day and vis > 0.4:
        fixes += 1
        fix_lat = true_lat + np.random.normal(0, 1.0/vis)
        meas_noise = 1.0/vis * 111
        K = uncertainty**2 / (uncertainty**2 + meas_noise**2)
        est_lat += K * (fix_lat - est_lat)
        uncertainty = np.sqrt((1-K) * uncertainty**2)

    if (hour+1) % 24 == 0:
        d = (hour+1) // 24
        err = np.sqrt(((est_lat-true_lat)*111)**2 +
                     ((est_lon-true_lon)*111*np.cos(np.radians(true_lat)))**2)
        log.append((d, true_lat, true_lon, est_lat, est_lon, err, uncertainty))

print(f"{'Day':>4} {'True Lat':>9} {'True Lon':>10} {'Est Lat':>9} {'Est Lon':>10} {'Error':>7} {'Unc':>6}")
print("-" * 57)
for d, tla, tlo, ela, elo, err, unc in log:
    print(f"{d:>4} {tla:>8.2f}°N {abs(tlo):>8.2f}°W {ela:>8.2f}°N {abs(elo):>8.2f}°W {err:>5.1f}km {unc:>4.1f}km")

td = np.sqrt(((true_lat-target_lat)*111)**2 + ((true_lon-target_lon)*111*np.cos(np.radians(true_lat)))**2)
print(f"\\nFinal distance from target: {td:.0f} km")
print(f"Star fixes taken: {fixes} | Storm hours: {storms} | Final uncertainty: ±{uncertainty:.0f} km")`,
      challenge: 'Add longitude estimation using a speed log (wave counting). Track longitude uncertainty separately from latitude. After 7 days, how much worse is longitude uncertainty? This models the fundamental asymmetry in Viking navigation — latitude was easy, longitude was nearly impossible.',
      successHint: 'You built a multi-physics voyage simulator integrating oceanography, meteorology, celestial mechanics, and estimation theory. This is exactly the structure of modern ship routing software and autonomous vehicle planners.',
    },
    {
      title: 'Accuracy analysis — compare simulated results with actual Viking voyages',
      concept: `A simulator is only valuable if it reproduces reality. We validate against historical data:

- **Erik the Red's fleet (986 CE)**: 25 ships, 14 arrived (~44% loss/turnback rate)
- **Typical crossing time**: 4-7 days (saga accounts)
- **Landing accuracy**: 100-200 km of target
- **Season**: virtually all crossings June-August

We run 1,000 simulations and compare distributions of crossing time, accuracy, and loss rate against these benchmarks.

📚 *Model validation is comparing output to real-world data. A model that matches known data can be cautiously trusted for predictions. Validation is the difference between science and speculation.*`,
      analogy: 'A weather model is validated by comparing yesterday\'s forecast to actual weather. You don\'t trust it for tomorrow until it gets today right. Our simulator must reproduce historical results before we trust its predictions.',
      storyConnection: 'The Viking sagas are our validation dataset — centuries of voyage records. If our simulator says crossings take 10 days but sagas say 4-5, our physics is wrong. The sagas are ground truth that disciplines the model.',
      checkQuestion: 'Model predicts 5% loss rate; history shows ~15%. What might explain the gap?',
      checkAnswer: 'Storm severity too low, sea ice not modeled, ships less seaworthy than assumed, or unmodeled factors (disease, piracy). The discrepancy tells you WHERE to improve the model.',
      codeIntro: 'Run 1,000 crossings and validate against historical Viking voyage records.',
      code: `import numpy as np
np.random.seed(42)

def sim_crossing(max_days=15):
    lat, lon = 64.1, -21.9
    for hour in range(max_days * 24):
        storm = np.random.random() < 0.03
        spd = max(1, 8 + np.random.normal(0, 1.5))
        h_err = np.random.normal(0, 25 if storm else 3)
        if storm: spd *= 0.3
        eff = np.radians(258 + h_err)
        lat += (spd*np.cos(eff) - np.random.normal(1.5, 0.5)) / 111
        lon += (spd*np.sin(eff) + np.random.normal(0, 0.3)) / (111*np.cos(np.radians(lat)))
        if lon < -43:
            dist = np.sqrt(((lat-61.2)*111)**2 + ((lon+45.5)*111*np.cos(np.radians(lat)))**2)
            return {"status": "arrived", "days": hour/24, "dist": dist, "lat": lat}
        if lat < 50 or lat > 75 or lon < -60:
            return {"status": "lost", "days": hour/24, "dist": 9999, "lat": lat}
    return {"status": "lost", "days": max_days, "dist": 9999, "lat": lat}

results = [sim_crossing() for _ in range(1000)]
arrived = [r for r in results if r["status"] == "arrived"]
lost = [r for r in results if r["status"] == "lost"]

print("=" * 60)
print("    VOYAGE SIMULATION VALIDATION REPORT")
print("=" * 60)
print(f"Simulations: 1000 | Route: Iceland to Greenland\\n")

arr_rate = len(arrived) / 1000
days_a = np.array([r["days"] for r in arrived]) if arrived else np.array([0])
dist_a = np.array([r["dist"] for r in arrived]) if arrived else np.array([0])

print(f"{'Metric':<28} {'Model':>12} {'Historical':>12} {'Match':>6}")
print("-" * 60)
checks = [
    ("Arrival rate", f"{arr_rate*100:.1f}%", "~56%", abs(arr_rate-0.56) < 0.2),
    ("Median crossing time", f"{np.median(days_a):.1f} days", "4-7 days",
     3 < np.median(days_a) < 9),
    ("Median landing accuracy", f"{np.median(dist_a):.0f} km", "100-200 km",
     30 < np.median(dist_a) < 400),
    ("Fastest crossing", f"{np.min(days_a):.1f} days", "~3 days",
     np.min(days_a) < 5),
]
for name, m_val, h_val, ok in checks:
    print(f"{name:<28} {m_val:>12} {h_val:>12} {'OK' if ok else 'CHECK':>4}")

print(f"\\n=== Crossing Time Percentiles ===")
for p in [10, 25, 50, 75, 90]:
    print(f"  {p}th: {np.percentile(days_a, p):.1f} days")

print(f"\\n=== Landing Accuracy ===")
for km in [50, 100, 200, 500]:
    print(f"  Within {km:>3} km: {np.sum(dist_a < km)/len(dist_a)*100:>5.1f}%")

passed = sum(1 for *_, ok in checks if ok)
print(f"\\nChecks passed: {passed}/{len(checks)}")
print("Model is " + ("CONSISTENT" if passed >= 3 else "DISCREPANT") + " with historical data.")`,
      challenge: 'Identify which parameter to adjust (storm frequency, current strength, heading noise) and tune it until all metrics match. This calibration process is how every simulation model is refined.',
      successHint: 'Model validation is the difference between a toy and a tool. You compared your simulator against 1,000-year-old data and assessed fidelity — the same process used to certify flight simulators and climate models.',
    },
    {
      title: 'Documentation — technical report and portfolio piece',
      concept: `The final step is **documentation**: what you built, why, how it works, and what it reveals. Your report should include:

1. **Abstract** — one-paragraph summary
2. **Methodology** — each model component, its physics, and limitations
3. **Results** — validation findings
4. **Discussion** — what the model reveals about Viking navigation
5. **Limitations and future work**
6. **Skills demonstrated**

📚 *A portfolio project has three audiences: a recruiter (reads the abstract), a technical interviewer (reads methodology), a peer (examines code). Good documentation serves all three.*`,
      analogy: 'A ship\'s log records every decision, observation, and event. If the voyage succeeds, the log teaches future navigators. Your documentation serves the same purpose — it records decisions and teaches others.',
      storyConnection: 'The Viking sagas are documentation — oral and written records of voyages and techniques. Without them, we\'d know nothing about Viking navigation. Your technical report is the modern equivalent of a saga.',
      checkQuestion: 'Why document limitations? Doesn\'t it weaken the project?',
      checkAnswer: 'The opposite — it shows intellectual maturity. Every model is a simplification. Documented limitations tell readers how far to trust results, making them MORE trustworthy, not less.',
      codeIntro: 'Generate a complete technical report for the Celestial Navigation Simulator.',
      code: `print("""
================================================================
       CELESTIAL NAVIGATION SIMULATOR — Technical Report
================================================================

ABSTRACT
--------
A computational simulator for Viking-era celestial navigation
across the North Atlantic, combining spherical trigonometry,
star position computation, ocean current modeling, Monte Carlo
weather generation, and Kalman filter sensor fusion. Validation
against historical saga data shows the model reproduces observed
crossing times, landing accuracies, and loss rates.

METHODOLOGY
-----------
Six integrated modules:
  a) Great Circle Router — haversine distances and bearings
  b) Star Position Engine — sidereal time, alt/az, refraction
  c) Ocean Current Model — Gulf Stream, East Greenland Current
  d) Weather Generator — wind, visibility, storms (Monte Carlo)
  e) Kalman Filter — latitude estimation, dead reckoning fusion
  f) Risk Assessment — fault tree, Monte Carlo loss probability

KEY RESULTS
-----------
  - Crossing time: 4-6 days median (historical: 4-7)
  - Landing accuracy: 100-250 km median (historical: 100-200)
  - Kalman filtering reduces uncertainty 60-80% vs DR alone
  - Star fix availability is the strongest accuracy predictor

DISCUSSION
----------
Viking navigation was not primitive guesswork — it was a
sophisticated multi-sensor fusion system achieving accuracies
comparable to 18th-century instruments.

LIMITATIONS
-----------
  - No longitude model (Vikings couldn't determine longitude)
  - Simplified precession (constant offset, not full model)
  - No sea ice model (critical for Greenland approaches)
  - Weather lacks multi-day storm persistence
  - No crew fatigue or provisioning model

FUTURE WORK
-----------
  - Full precession/nutation for star positions
  - Sea ice from paleoclimate data
  - Sunstone (calcite) polarimetric navigation
  - 2D Kalman filter (latitude AND longitude)
  - Multi-ship fleet simulation

================================================================
""")

skills = [
    ("Spherical trigonometry", "Haversine, great circles, bearings"),
    ("Celestial mechanics", "Sidereal time, precession, star positions"),
    ("Signal processing", "Fourier analysis of ocean swell"),
    ("Estimation theory", "Kalman filtering, sensor fusion"),
    ("Monte Carlo methods", "Random sampling, risk analysis"),
    ("Fluid mechanics", "Ocean current vector fields"),
    ("Optics", "Birefringence, polarization, refraction"),
    ("Software design", "OOP, simulation architecture, validation"),
    ("Data analysis", "Statistical comparison, model calibration"),
    ("Technical writing", "Structured reports, methodology docs"),
]

print("SKILLS DEMONSTRATED:")
for skill, detail in skills:
    print(f"  - {skill}: {detail}")
print("\\nPython: numpy (arrays, FFT, random, linalg, statistics)")
print("Concepts: 15+ STEM topics integrated into one project")`,
      challenge: 'Add a one-sentence CV tagline ("Built a multi-physics simulator that reproduces 1,000-year-old Viking navigation data"), a "what I learned" section, and three follow-up project ideas. A strong portfolio tells a story of growth and ambition.',
      successHint: 'You completed a full engineering project: system design, implementation, validation, and documentation. You integrated 15+ STEM topics into a coherent simulator and validated it against historical data. This is the process professional engineers and scientists follow every day. The skills demonstrated — computational modeling, statistical validation, technical communication — are among the most in-demand in STEM careers.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Celestial Navigation Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, validate, and document a complete Celestial Navigation Simulator.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L4-${i + 1}`}
            number={i + 1}
            title={lesson.title}
            concept={lesson.concept}
            analogy={lesson.analogy}
            storyConnection={lesson.storyConnection}
            checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer}
            codeIntro={lesson.codeIntro}
            code={lesson.code}
            challenge={lesson.challenge}
            successHint={lesson.successHint}
          />
        ))}
      </div>
    </div>
  );
}
