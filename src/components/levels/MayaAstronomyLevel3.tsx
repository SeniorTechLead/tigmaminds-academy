import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function MayaAstronomyLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Planetary ephemeris calculation — approximate planet positions',
      concept: `An **ephemeris** is a table of positions — where each planet will be on each date. A good approximation uses **Keplerian orbital elements**: six numbers describing each planet's elliptical orbit.

From these, you compute the **mean anomaly** M = L - omega, solve **Kepler's equation** (M = E - e sin E) for the **eccentric anomaly** E, then convert to the **true anomaly** to find the planet's actual position.

Kepler's equation cannot be solved algebraically — it requires **iteration** (Newton's method). This is one of the oldest computational problems in science, posed by Kepler in 1609.

The Maya used interpolation between observed positions instead. Their approach was functionally equivalent: given observed positions at known dates, predict positions at future dates.

📚 *Kepler's equation is transcendental — mixing E and sin(E). Every ephemeris computation since 1609 has required numerical methods.*`,
      analogy: 'If a car travels at constant speed on a straight road, predicting its position is trivial. But if the road is elliptical and the car speeds up near one end (like a planet near perihelion), you need Kepler\'s equation to convert "time elapsed" into "position on the ellipse."',
      storyConnection: 'The Dresden Codex Mars tables predict Mars\'s position over 780-day synodic cycles using a piecewise-linear interpolation scheme — different correction factors for different parts of the cycle. This is functionally similar to a low-order ephemeris.',
      checkQuestion: 'Why does a planet move faster at perihelion (closest to the Sun) than at aphelion (farthest)?',
      checkAnswer: 'Kepler\'s Second Law: a planet sweeps equal areas in equal times. Near perihelion, the radius is short, so the planet must move through a larger angle to sweep the same area. Near aphelion, the radius is long, so a smaller angle suffices.',
      codeIntro: 'Build a simplified planetary ephemeris — solve Kepler\'s equation and compute planet positions for any date.',
      code: `import numpy as np

def solve_kepler(M, e, tol=1e-8):
    """Solve M = E - e*sin(E) via Newton-Raphson."""
    E = M
    for _ in range(50):
        dE = (M - E + e * np.sin(E)) / (1 - e * np.cos(E))
        E += dE
        if abs(dE) < tol: break
    return E

def true_anomaly(E, e):
    return 2 * np.arctan2(np.sqrt(1+e)*np.sin(E/2), np.sqrt(1-e)*np.cos(E/2))

planets = {
    "Mercury": {"a": 0.387, "e": 0.2056, "T": 87.97,  "L0": 252.25, "w": 77.46},
    "Venus":   {"a": 0.723, "e": 0.0068, "T": 224.70, "L0": 181.98, "w": 131.53},
    "Earth":   {"a": 1.000, "e": 0.0167, "T": 365.25, "L0": 100.46, "w": 102.95},
    "Mars":    {"a": 1.524, "e": 0.0934, "T": 686.97, "L0": 355.45, "w": 336.04},
    "Jupiter": {"a": 5.203, "e": 0.0484, "T": 4332.6, "L0": 34.40,  "w": 14.33},
    "Saturn":  {"a": 9.537, "e": 0.0542, "T": 10759., "L0": 49.94,  "w": 93.06},
}

def planet_pos(name, day_offset):
    p = planets[name]
    n = 360.0 / p["T"]
    L = (p["L0"] + n * day_offset) % 360
    M = np.radians((L - p["w"]) % 360)
    E = solve_kepler(M, p["e"])
    v = true_anomaly(E, p["e"])
    r = p["a"] * (1 - p["e"] * np.cos(E))
    angle = v + np.radians(p["w"])
    return r * np.cos(angle), r * np.sin(angle), r, np.degrees(v)

day = 9500  # ~2026
print("=== Planetary Ephemeris ===")
print(f"Day from J2000: {day} (~year {2000 + day/365.25:.1f})")
print(f"{'Planet':<10} {'x (AU)':>8} {'y (AU)':>8} {'r (AU)':>8} {'True anom':>10}")
print("-" * 46)
for name in planets:
    x, y, r, v = planet_pos(name, day)
    print(f"{name:<10} {x:>8.3f} {y:>8.3f} {r:>8.3f} {v:>8.1f} deg")

# Show Kepler convergence for Mars
print("\\nKepler's equation convergence (Mars, e=0.0934):")
M = np.radians(120); E = M
for i in range(6):
    res = M - E + 0.0934 * np.sin(E)
    dE = res / (1 - 0.0934 * np.cos(E))
    E += dE
    print(f"  Iter {i+1}: E={np.degrees(E):.8f} deg, residual={abs(res):.2e}")

# Venus distance over time
print("\\n=== Venus-Earth Distance (sampled) ===")
for d in range(day, day + 1200, 100):
    xv, yv, _, _ = planet_pos("Venus", d)
    xe, ye, _, _ = planet_pos("Earth", d)
    dist = np.sqrt((xv-xe)**2 + (yv-ye)**2)
    print(f"  Day {d}: {dist:.3f} AU")`,
      challenge: 'Compute the date of the next Venus inferior conjunction (minimum Earth-Venus distance) by scanning day by day. Compare the interval between conjunctions to the synodic period of 583.9 days.',
      successHint: 'You built a planetary ephemeris engine — the same type of calculation used by NASA\'s JPL to navigate spacecraft. The core algorithm (solve Kepler\'s equation by iteration) has not changed since Newton.',
    },
    {
      title: 'Lunar theory — nodes, libration, and the draconic month',
      concept: `The Moon's motion is complex because it's pulled by both Earth AND the Sun. This creates several distinct periods:

- **Synodic month** (29.531 days): new Moon to new Moon
- **Sidereal month** (27.322 days): one orbit relative to stars
- **Draconic month** (27.212 days): node to node (governs eclipses)
- **Anomalistic month** (27.555 days): perigee to perigee (governs apparent size)

The **nodes** — where the Moon's orbit crosses the ecliptic — precess westward over **18.613 years**. This is why eclipse seasons shift earlier by ~20 days each year.

The Maya tracked the draconic month implicitly through their eclipse tables. Their 11,960-day cycle equals 439.5 draconic months — close to a half-integer, meaning eclipses alternate between nodes.

📚 *The Moon's motion involves over 1,400 periodic terms in modern lunar theory. The Maya solved it empirically by pattern-matching centuries of observations.*`,
      analogy: 'The Moon is like a ball on a rubber sheet (Earth\'s gravity well) also being tugged by a distant magnet (the Sun). It doesn\'t orbit cleanly — it wobbles and tilts. The different "months" are different ways of measuring one wobble-affected orbit, depending on which reference point you use.',
      storyConnection: 'The Dresden Codex eclipse table groups eclipses into sets of 5 or 6 lunar months (148 or 177 days), corresponding to eclipse half-years. The Maya noticed eclipses cluster in seasons ~173 days apart — matching the theoretical draconic half-year perfectly.',
      checkQuestion: 'If the synodic month is 29.531 days and the draconic month is 27.212 days, after how many synodic months do the two nearly synchronise?',
      checkAnswer: '223 synodic months = 6585.32 days, and 242 draconic months = 6585.36 days — they match to within 0.04 days! This is the saros cycle.',
      codeIntro: 'Model the Moon\'s multiple periods, verify the saros cycle, and predict eclipse windows.',
      code: `import numpy as np

SYNODIC = 29.530589; SIDEREAL = 27.321662
DRACONIC = 27.212221; ANOMALISTIC = 27.554550

print("=== Lunar Month Types ===")
for name, p in [("Synodic",SYNODIC),("Sidereal",SIDEREAL),
                ("Draconic",DRACONIC),("Anomalistic",ANOMALISTIC)]:
    print(f"  {name:<14} {p:.6f} days")

print(f"\\nSynodic - Sidereal = {SYNODIC-SIDEREAL:.4f}d (Sun catch-up)")
print(f"Sidereal - Draconic = {SIDEREAL-DRACONIC:.4f}d (node regression)")

# Eclipse season geometry
ECLIPSE_LIMIT = 18.5  # degrees
node_rate = 360.0 / (18.613 * 365.25)  # deg/day
sun_rate = 360.0 / 365.25
relative_rate = sun_rate + node_rate
eclipse_season = 2 * ECLIPSE_LIMIT / relative_rate
print(f"\\n=== Eclipse Geometry ===")
print(f"Eclipse season: {eclipse_season:.1f} days")
print(f"Eclipse half-year: {180.0/relative_rate:.1f} days (Maya: ~177)")

# Saros verification
s_syn = 223 * SYNODIC; s_dra = 242 * DRACONIC; s_ano = 239 * ANOMALISTIC
print(f"\\n=== Saros Cycle ===")
print(f"223 synodic:     {s_syn:.2f} days")
print(f"242 draconic:    {s_dra:.2f} days  (diff: {abs(s_syn-s_dra):.2f}d)")
print(f"239 anomalistic: {s_ano:.2f} days  (diff: {abs(s_syn-s_ano):.2f}d)")

# Maya cycle
maya = 11960
print(f"\\n=== Maya 11,960-Day Cycle ===")
print(f"Synodic months: {maya/SYNODIC:.2f} (Maya: 405)")
print(f"Draconic months: {maya/DRACONIC:.2f}")
print(f"Error: {abs(maya - round(maya/DRACONIC)*DRACONIC):.2f} days over {maya/365.25:.1f} yr")

# Predict eclipse windows
print(f"\\n=== Eclipse Windows (next 730 days) ===")
print(f"{'Day':>6} {'Node dist':>10} {'Type':>8}")
for day in range(730):
    syn_phase = (day / SYNODIC) % 1.0
    drac_phase = (day / DRACONIC) % 1.0
    node_dist = min(drac_phase, 1-drac_phase) * 360
    is_new = syn_phase < 0.03 or syn_phase > 0.97
    is_full = abs(syn_phase - 0.5) < 0.03
    if (is_new or is_full) and node_dist < ECLIPSE_LIMIT:
        etype = "Solar" if is_new else "Lunar"
        print(f"{day:>6} {node_dist:>8.1f} deg {etype:>8}")`,
      challenge: 'Add the anomalistic month: when a solar eclipse occurs near lunar perigee, classify it as "total"; near apogee, classify it as "annular". How many of each type occur in 2 years?',
      successHint: 'You\'ve modelled the three fundamental lunar cycles that govern eclipses. The fact that 223, 242, and 239 of these nearly coincide is a numerical accident of our solar system — but one that civilisations from Babylon to Mesoamerica exploited.',
    },
    {
      title: 'Archaeoastronomy methods — analysing building alignments',
      concept: `**Archaeoastronomy** investigates ancient astronomical knowledge by analysing **building alignments**. If a sightline points toward a specific celestial event (solstice sunrise, Venus at its extreme), this suggests intentional design.

The statistical challenge: a building has many sightlines, and there are many celestial targets. With enough of each, random matches are inevitable — the **look-elsewhere effect**.

The test: does the building have MORE precise alignments than random chance predicts? You enumerate all sightlines, all targets, calculate the probability of each random match, and use Monte Carlo simulation to determine if the observed count is statistically significant.

📚 *The look-elsewhere effect is a statistical trap: if you test enough hypotheses, some will appear significant by chance. Only a cluster of precise alignments exceeds the chance expectation.*`,
      analogy: 'Flip a coin 100 times and you\'ll find streaks of 6-7 heads — expected by chance, not evidence of a loaded coin. A building with many walls will have SOME wall aligned with SOME celestial event. The question is whether there are MORE alignments than random predicts.',
      storyConnection: 'The Caracol at Chichen Itza has three windows. Window 1 aligns with Venus\'s maximum southerly setting (within 0.5 degrees). Window 2 aligns with equinox sunset. Window 3 aligns with Venus\'s maximum northerly setting. Three precise alignments from three windows is far beyond chance.',
      checkQuestion: 'A building has 12 sightlines and 20 targets. If alignments count within +/-2 degrees, how many random alignments are expected?',
      checkAnswer: 'Each pair: 4/360 = 1.11% chance. With 240 pairs: 240 x 0.0111 = 2.67 expected. Finding 2 alignments is NOT significant. Finding 8+ would be (p < 0.001).',
      codeIntro: 'Build a statistical archaeoastronomy toolkit — analyse building alignments and test significance with Monte Carlo.',
      code: `import numpy as np
np.random.seed(42)

def sunrise_azimuth(lat_deg, dec_deg):
    lat = np.radians(lat_deg); dec = np.radians(dec_deg)
    return np.degrees(np.arccos(np.clip(np.sin(dec)/np.cos(lat), -1, 1)))

lat = 20.68  # Chichen Itza
targets = []
for name, dec in [("Summer solstice",23.44),("Winter solstice",-23.44),("Equinox",0)]:
    az = sunrise_azimuth(lat, dec)
    targets += [(f"{name} rise", az), (f"{name} set", 360-az)]
for name, dec in [("Venus max N",28.0),("Venus max S",-28.0)]:
    az = sunrise_azimuth(lat, dec)
    targets += [(f"{name} rise", az), (f"{name} set", 360-az)]
targets += [("Pleiades rise",67),("Sirius rise",110),("Canopus rise",140)]

print("=== Celestial Targets at Chichen Itza ===")
for name, az in sorted(targets, key=lambda t: t[1]):
    print(f"  {name:<28} {az:>6.1f} deg")

caracol = [
    ("Window 1 diagonal",250.5),("Window 2 centre",266.5),
    ("Window 3 centre",282.5),("Main staircase",27.5),
    ("Window 1 left",247),("Window 1 right",254),
    ("Window 2 left",263),("Window 2 right",270),
    ("Window 3 left",279),("Window 3 right",286),
    ("Platform NE",55),("Platform NW",325),
]

tol = 2.0
print(f"\\n=== Alignments (tolerance +/-{tol} deg) ===")
n_match = 0
for sl_name, sl_az in caracol:
    for tg_name, tg_az in targets:
        diff = abs(sl_az - tg_az) % 360
        if diff > 180: diff = 360 - diff
        if diff <= tol:
            print(f"  {sl_name} ({sl_az:.1f}) <-> {tg_name} ({tg_az:.1f}) [{diff:.1f} deg]")
            n_match += 1

n_sl = len(caracol); n_tg = len(targets)
p_single = 2*tol/360; expected = n_sl * n_tg * p_single
print(f"\\n=== Significance ===")
print(f"Pairs tested: {n_sl*n_tg}  Expected random: {expected:.1f}  Observed: {n_match}")

# Monte Carlo
random_counts = []
for _ in range(10000):
    az_rand = np.random.uniform(0, 360, n_sl)
    c = sum(1 for az in az_rand for _, taz in targets
            if min(abs(az-taz)%360, 360-abs(az-taz)%360) <= tol)
    random_counts.append(c)
p_val = np.mean(np.array(random_counts) >= n_match)
print(f"Monte Carlo p-value: {p_val:.4f}")
print(f"Verdict: {'SIGNIFICANT' if p_val < 0.01 else 'Not significant'}")`,
      challenge: 'Add the Pyramid of Kukulkan whose four stairways face the cardinal directions within 0.5 degrees. Does it produce MORE significant alignments than the Caracol?',
      successHint: 'You built a rigorous archaeoastronomy tool that distinguishes intentional alignments from coincidence. This exact methodology is used by professional archaeoastronomers — the key question is always: "Could this pattern arise by chance?"',
    },
    {
      title: 'Error analysis — systematic vs random, confidence intervals',
      concept: `**Random error** varies unpredictably between measurements and is reduced by averaging (decreases as 1/sqrt(N)). **Systematic error** is a consistent bias that averaging does NOT fix.

A **confidence interval** quantifies uncertainty: **CI = mean +/- z x (s / sqrt(N))** where z = 1.96 for 95% confidence.

The Maya demonstrated equivalent understanding: the Dresden Codex Venus table includes four correction points where accumulated error is reset, showing they quantified drift and built in systematic corrections.

📚 *Systematic error is the harder problem. Detecting it requires either a different measurement method or a very long baseline where cumulative drift becomes visible — exactly what the Maya used.*`,
      analogy: 'A scale that always reads 2 kg heavy has systematic error — averaging 100 readings gives a precise but wrong weight. A scale that fluctuates +/-0.5 kg has random error — averaging 100 readings converges to the true weight.',
      storyConnection: 'The Dresden Codex Venus table uses 584 days per cycle but includes four corrections where 8 days are subtracted. Over 65 cycles: 65 x 584 = 37,960 days, but 65 x 583.92 = 37,955 — a 5-day systematic drift that the corrections compensate.',
      checkQuestion: 'You measure Venus\'s period 25 times. Mean 584.1 days, std dev 1.8 days. What is the 95% confidence interval?',
      checkAnswer: 'CI = 584.1 +/- 1.96 x (1.8/sqrt(25)) = 584.1 +/- 0.71 days = [583.39, 584.81]. The true value (583.92) falls inside — our measurements are consistent with reality.',
      codeIntro: 'Build a complete error analysis toolkit — quantify random and systematic errors, compute confidence intervals, and model the Maya correction scheme.',
      code: `import numpy as np
np.random.seed(42)

TRUE_VENUS = 583.9214; MAYA_VENUS = 584

# Random vs systematic error
obs_random = TRUE_VENUS + np.random.normal(0, 1.5, 25)
obs_biased = TRUE_VENUS + 0.5 + np.random.normal(0, 1.5, 25)

print("=== Random vs Systematic Error ===")
for label, data in [("Random only", obs_random), ("Random + systematic", obs_biased)]:
    m = np.mean(data); s = np.std(data, ddof=1); se = s/np.sqrt(len(data))
    ci = 1.96 * se; bias = m - TRUE_VENUS
    print(f"\\n{label}:")
    print(f"  Mean: {m:.4f}  Std error: {se:.4f}  95% CI: [{m-ci:.4f}, {m+ci:.4f}]")
    print(f"  Bias: {bias:+.4f}d  True in CI: {'YES' if abs(bias)<ci else 'NO'}")

# Error accumulation
print("\\n=== Error Accumulation Over Venus Cycles ===")
print(f"{'Cycles':>8} {'Drift (days)':>14} {'Drift (hours)':>14}")
for n in [1, 5, 13, 25, 50, 65]:
    drift = n * (MAYA_VENUS - TRUE_VENUS)
    print(f"{n:>8} {drift:>+12.2f}d {drift*24:>+12.1f}h")

# Maya correction scheme
print("\\n=== Dresden Codex Correction Scheme ===")
corrections = {9: 8, 24: 8, 49: 8, 65: 8}
running_maya = 0; running_true = 0.0
print(f"{'Cycle':>6} {'Maya':>8} {'True':>10} {'Error':>8} {'Corr':>6}")
for cyc in range(1, 66):
    running_maya += MAYA_VENUS; running_true += TRUE_VENUS
    corr = corrections.get(cyc, 0)
    running_maya -= corr
    if cyc in [1, 5, 9, 13, 24, 33, 49, 65]:
        err = running_maya - running_true
        print(f"{cyc:>6} {running_maya:>8} {running_true:>8.1f} {err:>+7.2f}d {corr:>4}d")

print(f"\\nFinal error with corrections: {running_maya-running_true:+.2f}d")
print(f"Without corrections: {65*MAYA_VENUS-65*TRUE_VENUS:+.2f}d")

# Confidence intervals for all Maya periods
print("\\n=== Maya Period Confidence Intervals ===")
for name, true_v, n_cyc in [("Venus",583.9214,65),("Mars",779.9361,42),
                              ("Lunar month",29.53059,405)]:
    ep_err = 1.0  # endpoint error
    per_cyc = ep_err / n_cyc; ci = 1.96 * per_cyc
    meas = true_v + np.random.normal(0, per_cyc)
    print(f"  {name}: {meas:.4f} +/- {ci:.4f}d (95% CI, {n_cyc} cycles)")`,
      challenge: 'The Maya Mars table covers 42 synodic cycles. If the true period is 779.9361 days and the Maya used 780, what is the total drift? Design a correction scheme keeping error below 1 day at all points.',
      successHint: 'Error analysis is the foundation of all quantitative science. The Maya correction scheme is a pre-modern version of calibration — the same concept used in every scientific instrument today.',
    },
    {
      title: 'Comparative calendar systems — Maya, Islamic, Hebrew, Chinese',
      concept: `The fundamental tension: the solar year (~365.2422 days) is not a whole number of lunar months (~29.5306 days). 365.2422 / 29.5306 = 12.368 months. Every calendar system handles that 0.368 differently:

**Maya**: Tzolk'in (260d) + Haab' (365d) + Long Count. No intercalation — Haab' drifts 0.25 days/year.
**Islamic**: Purely lunar — 354/355 days. Months rotate through seasons over ~33 years.
**Hebrew**: Lunisolar — 12 or 13 months, leap month 7 times per 19-year Metonic cycle.
**Chinese**: Lunisolar — similar Metonic intercalation plus 24 solar terms for agriculture.
**Gregorian**: Purely solar — 365.2425 days. Ignores the Moon entirely.

📚 *There is no "correct" calendar — each optimises for different constraints. Gregorian for solar accuracy, Islamic for simplicity, Hebrew/Chinese for lunar-solar alignment, Maya for long-term cyclical timekeeping.*`,
      analogy: 'Imagine fitting rectangular tiles (lunar months, ~29.5 days) into a strip 365.25 units long. 12 tiles: too short. 13: too long. Each calendar is a different strategy for the gap: ignore it (Islamic), add a tile periodically (Hebrew), use different tile sizes (Maya), or abandon tiles entirely (Gregorian).',
      storyConnection: 'The Maya Long Count is the only pre-modern calendar providing absolute dates without ambiguity — a continuous day count from a fixed epoch. The 2012 media frenzy was about the Long Count completing 13 baktuns (1,872,000 days) — not an apocalypse, but a cycle completion, like an odometer rolling over.',
      checkQuestion: 'The Islamic year has 354 days. After how many years do its seasons realign with the Gregorian calendar?',
      checkAnswer: 'The Islamic year is 10.875 days shorter. To gain a full year: 365.25/10.875 = 33.6 years. Ramadan cycles through all seasons over ~33 Islamic years.',
      codeIntro: 'Build a multi-calendar converter and compare how each system tracks the solar year and lunar months.',
      code: `import numpy as np

TROPICAL_YEAR = 365.2422; SYNODIC_MONTH = 29.53059
print(f"=== The Calendar Problem ===")
print(f"Months per year: {TROPICAL_YEAR/SYNODIC_MONTH:.6f}")
print(f"Gap: {(TROPICAL_YEAR/SYNODIC_MONTH - 12)*SYNODIC_MONTH:.2f} extra days\\n")

cals = {
    "Gregorian":  365.2425, "Maya Haab'": 365.0,
    "Islamic":    354.37,   "Hebrew":     365.2468, "Chinese": 365.2422,
}
print("=== Calendar Drift ===")
print(f"{'Calendar':<14} {'Year (d)':>9} {'Drift/yr':>10} {'Drift/100yr':>12}")
for name, yd in cals.items():
    d = yd - TROPICAL_YEAR
    print(f"{name:<14} {yd:>8.4f} {d:>+9.4f}d {d*100:>+10.2f}d")

# Metonic cycle
print(f"\\n=== Metonic Cycle ===")
solar_19 = 19 * TROPICAL_YEAR; lunar_235 = 235 * SYNODIC_MONTH
print(f"19 years = {solar_19:.2f}d  |  235 months = {lunar_235:.2f}d")
print(f"Difference: {abs(solar_19-lunar_235):.2f}d ({abs(solar_19-lunar_235)/19*60:.1f} min/yr)")

# Long Count converter
def greg_to_maya(year, month, day):
    a = (14 - month) // 12; y = year + 4800 - a; m = month + 12*a - 3
    jdn = day + (153*m+2)//5 + 365*y + y//4 - y//100 + y//400 - 32045
    md = jdn - 584283
    b = md//144000; r = md%144000
    k = r//7200; r %= 7200; t = r//360; r %= 360
    u = r//20; ki = r%20
    return md, (b, k, t, u, ki)

print(f"\\n=== Key Dates in Maya Long Count ===")
dates = [(2026,4,5,"Today"),(2012,12,21,"13 Baktun"),(2000,1,1,"Y2K"),
         (1969,7,20,"Moon landing"),(1492,10,12,"Columbus")]
print(f"{'Event':<20} {'Gregorian':<12} {'Long Count':<16} {'Days':>10}")
for y,m,d,label in dates:
    md, lc = greg_to_maya(y,m,d)
    print(f"{label:<20} {y}-{m:02d}-{d:02d}    {'.'.join(str(x) for x in lc):<16} {md:>10,}")

# Ramadan drift
print(f"\\n=== Ramadan Through the Seasons ===")
drift_yr = TROPICAL_YEAR - 354.37
seasons = {0:"Jan",1:"Feb",2:"Mar",3:"Apr",4:"May",5:"Jun",
           6:"Jul",7:"Aug",8:"Sep",9:"Oct",10:"Nov",11:"Dec"}
for yr in range(0, 34, 5):
    offset = (yr * drift_yr) % TROPICAL_YEAR
    mo = int(offset / 30.44)
    print(f"  Year {yr:>2}: Ramadan ~ {seasons.get(mo,'?')}")`,
      challenge: 'Add the French Republican calendar (12 months x 30 days + 5-6 extra) and the Baha\'i calendar (19 x 19 + 4-5 extra) to the drift analysis. Which has the smallest drift?',
      successHint: 'You\'ve built a comparative calendar engine spanning five civilisations. The key insight: the astronomical cycles (day, month, year) are incommensurable — not exact multiples of each other. Every calendar is a compromise.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling, archaeoastronomy, and error analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers planetary ephemeris calculation, lunar theory, archaeoastronomy statistics, error analysis, and comparative calendar systems.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L3-${i + 1}`}
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
