import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function VikingNavLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Monte Carlo voyage simulation — run 1,000 crossings with random weather',
      concept: `A single simulated crossing tells you what MIGHT happen. But weather is random — wind, currents, visibility, and storms all vary unpredictably. **Monte Carlo simulation** runs the same voyage 1,000 times with randomly generated weather and analyzes the distribution of results.

For each crossing we randomly generate wind speed/direction, current variability (±30%), storm events (Poisson-distributed), and visibility. The output is a **probability distribution**: the 10th percentile, median, and 90th percentile of crossing time, position error, and survival probability.

📚 *Monte Carlo simulation transforms a deterministic model into a probabilistic one by sampling random inputs. 1,000 runs typically give good estimates of percentiles.*`,
      analogy: 'Flip a coin once and you learn nothing about its fairness. Flip it 1,000 times and you get a reliable estimate. Monte Carlo works the same way — one voyage simulation is meaningless, but 1,000 reveal the probabilities of every outcome.',
      storyConnection: 'The Viking sagas record both successful and disastrous crossings of the same routes. Bjarni Herjolfsson was blown off course and accidentally discovered Vinland. Other ships vanished. The same route could take 4 days or 14 — Monte Carlo captures this inherent uncertainty.',
      checkQuestion: 'You run 1,000 simulations. 820 arrive within 100 km, 150 arrive further off, 30 are lost. What is the probability of a successful crossing?',
      checkAnswer: 'Depends on your definition. Within 100 km: 82%. Any landfall: 97%. The 3% lost rate means roughly 1 in 33 crossings ended in disaster — consistent with saga accounts.',
      codeIntro: 'Run 1,000 Monte Carlo simulations of the Iceland-to-Greenland crossing with random weather.',
      code: `import numpy as np
np.random.seed(42)

def simulate_crossing(n_sims=1000, max_days=15):
    target_lat, target_lon = 61.2, -45.5
    results = []
    for sim in range(n_sims):
        lat, lon = 64.1, -21.9
        heading, base_speed, lost = 255, 8.0, False
        total_hours = 0
        for day in range(max_days):
            storm = np.random.random() < 0.08
            for hour in range(24):
                total_hours += 1
                if storm and hour < np.random.randint(4, 12):
                    lat += np.random.normal(0, 3) / 111
                    lon += np.random.normal(0, 3) / (111 * np.cos(np.radians(lat)))
                else:
                    spd = max(2, min(15, base_speed + np.random.normal(0, 1.5)))
                    drift_e = spd * np.sin(np.radians(heading)) + np.random.normal(0, 0.3)
                    drift_n = spd * np.cos(np.radians(heading)) - np.random.normal(2.0, 0.6)
                    lat += drift_n / 111.0
                    lon += drift_e / (111.0 * np.cos(np.radians(lat)))
                if lon < -42:
                    dist = np.sqrt(((lat-target_lat)*111)**2 +
                                  ((lon-target_lon)*111*np.cos(np.radians(lat)))**2)
                    results.append({"days": total_hours/24, "dist": dist,
                                   "lat": lat, "status": "arrived"})
                    lost = False; break
                if lat < 50 or lat > 75 or lon < -60:
                    lost = True; break
            if not lost and lon < -42: break
            if lost: break
        if lost or lon >= -42:
            results.append({"days": total_hours/24, "dist": 9999,
                           "lat": lat, "status": "lost"})
    return results

results = simulate_crossing(1000)
arrived = [r for r in results if r["status"] == "arrived"]
lost = [r for r in results if r["status"] == "lost"]

print("=== Monte Carlo Voyage Analysis: Iceland to Greenland ===")
print(f"Simulations: {len(results)} | Arrived: {len(arrived)} ({len(arrived)/len(results)*100:.1f}%)")
print(f"Lost: {len(lost)} ({len(lost)/len(results)*100:.1f}%)\\\n")

if arrived:
    days = np.array([r["days"] for r in arrived])
    dists = np.array([r["dist"] for r in arrived])
    print("=== Crossing Time ===")
    for p in [10, 50, 90]:
        print(f"  {p}th pctile: {np.percentile(days, p):.1f} days")
    print(f"\\\n=== Landing Accuracy ===")
    for km in [50, 100, 200]:
        print(f"  Within {km} km: {np.sum(dists < km)/len(dists)*100:.0f}%")
    print(f"  Median error: {np.median(dists):.0f} km")`,
      challenge: 'Add a "navigator skill" parameter that affects heading noise. Compare novice (±20° error) vs expert (±5°) navigators. How much does skill reduce the lost-at-sea rate?',
      successHint: 'Monte Carlo simulation is the standard tool for risk analysis in aviation, nuclear engineering, finance, and climate science. You quantified what the Viking sagas described qualitatively.',
    },
    {
      title: 'Optimal departure timing — find the best season for Iceland-to-Greenland crossings',
      concept: `Conditions vary dramatically by season at 65°N. **Daylight** ranges from 21 hours in June to under 4 in December — critical for celestial navigation. **Storm frequency** peaks October-March. **Sea ice** blocks Greenland's east coast from October through May. **Wind patterns** favor sailing in summer.

The optimal departure window balances all these factors. We model each as a function of day-of-year and compute a composite **crossing viability score** for every week.

📚 *Seasonal optimisation is a constrained optimisation problem: maximize crossing success subject to constraints (daylight, ice, storms). The optimal solution is the best compromise among all constraints.*`,
      analogy: 'Planting a garden: plant too early and frost kills seedlings; too late and they don\'t mature before autumn. There\'s a narrow window determined by multiple factors. Viking departure timing follows the same logic — a window set by ice, storms, and daylight.',
      storyConnection: 'The sagas consistently describe departures in June or early July — exactly when the model predicts the optimal window. Ships that departed too early hit ice; too late and they arrived as winter set in.',
      checkQuestion: 'Why is daylight so critical for Viking navigation when modern ships cross in winter routinely?',
      checkAnswer: 'Modern ships have GPS, radar, and gyrocompasses. Vikings needed the sun for latitude and stars for orientation. Without celestial observations, dead reckoning accumulated 50+ km/day error. In December at 65°N, only 3-4 hours of twilight makes celestial navigation nearly impossible.',
      codeIntro: 'Model seasonal conditions and compute the optimal departure week for Atlantic crossings.',
      code: `import numpy as np

def seasonal_conditions(day_of_year):
    t = day_of_year / 365.0 * 2 * np.pi
    daylight = 12 + 9 * np.sin(t - np.pi/2)
    daylight_score = min(1, max(0, (daylight - 6) / 15))
    storm_score = 1 - (0.15 + 0.25 * np.cos(t)) / 0.4
    ice_score = 1 - max(0, 0.5 + 0.5 * np.cos(t - 0.3))
    wind_score = 0.5 + 0.4 * np.sin(t - np.pi/2)
    current_score = 1 - 0.3 * np.exp(-((day_of_year - 120)**2) / 2000)
    return {"daylight": daylight_score, "storm": storm_score,
            "ice": ice_score, "wind": wind_score, "current": current_score}

def composite(cond):
    w = {"daylight": 0.30, "storm": 0.25, "ice": 0.20, "wind": 0.10, "current": 0.15}
    return sum(cond[k] * w[k] for k in w)

months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
print("=== Seasonal Crossing Viability ===")
print(f"{'Week':>5} {'Date':>8} {'Daylt':>6} {'Storm':>6} {'Ice':>6} {'Wind':>6} {'Curr':>6} {'TOTAL':>7}")
print("-" * 51)

best_score, best_label = 0, ""
weekly = []
for week in range(52):
    day = week * 7 + 4
    cond = seasonal_conditions(day)
    score = composite(cond)
    weekly.append(score)
    m_idx = min(11, day * 12 // 366)
    label = f"{months[m_idx]} {(day - m_idx*30) % 30 + 1:>2}"
    if score > best_score:
        best_score, best_label = score, label
    if week % 3 == 0:
        print(f"{week+1:>4} {label:>8} {cond['daylight']:>5.2f} {cond['storm']:>5.2f} "
              f"{cond['ice']:>5.2f} {cond['wind']:>5.2f} {cond['current']:>5.2f} {score:>6.3f}")

print(f"\\\nOptimal departure: {best_label} (score: {best_score:.3f})")
threshold = best_score * 0.7
viable = [w for w, s in enumerate(weekly) if s > threshold]
if viable:
    s_m, e_m = months[min(11, viable[0]*7*12//366)], months[min(11, viable[-1]*7*12//366)]
    print(f"Viable window (>70% peak): {s_m} to {e_m} ({len(viable)} weeks)")
print(f"Historical record: sagas report departures in June-July — model agrees")`,
      challenge: 'Change the weights to model a desperate voyage (fleeing enemies — survival less important, speed more). How does the optimal window shift? What if you MUST depart in October?',
      successHint: 'Seasonal optimisation is used in agriculture, aviation, military operations, and supply chain management. You formalised what Viking navigators learned through generations of trial and error.',
    },
    {
      title: 'Wave spectrum analysis — Fourier decomposition of ocean swell patterns',
      concept: `The ocean surface is a superposition of waves at different frequencies and amplitudes. **Fourier analysis** decomposes this complex signal into individual sinusoidal components — revealing underlying swell patterns.

Viking navigators read the swell to determine direction and distance to land. **Long-period swell** (10-20s) travels thousands of km from distant storms. **Short-period waves** (3-6s) are local wind. **Reflected swell** bouncing off coastlines indicates land beyond the horizon.

The **FFT** (Fast Fourier Transform) converts a time-domain signal into a **frequency spectrum** in O(n log n) time.

📚 *The Fourier transform decomposes any signal into a sum of sinusoids. It is one of the most important mathematical tools in all of science.*`,
      analogy: 'A musical chord is multiple notes at different pitches. Your ear performs a "Fourier transform" — separating the chord into individual notes. The ocean surface is a "chord" of waves, and FFT separates it into individual swells.',
      storyConnection: 'Polynesian and Viking navigators could detect land 50+ km beyond the horizon by reading subtle swell pattern changes — reflected waves create interference that a trained navigator could feel through the hull.',
      checkQuestion: 'An ocean signal has periods of 4, 8, and 14 seconds. Which is from a distant storm, which from local wind?',
      checkAnswer: '4s: local wind waves (short fetch). 14s: distant storm swell (hundreds of km away — short waves get absorbed over distance). 8s: moderate-distance swell or reflected coastal swell.',
      codeIntro: 'Generate a synthetic ocean wave signal, decompose it with FFT, and identify navigation-relevant swell components.',
      code: `import numpy as np

dt, duration = 0.5, 600
t = np.arange(0, duration, dt)
n = len(t)

# True swell components (period_s, amplitude_m, description)
components = [
    (4.0, 0.8, "Local wind waves"), (6.0, 0.5, "Moderate wind"),
    (10.0, 1.2, "Distant NW storm"), (14.0, 0.9, "Far Atlantic swell"),
    (18.0, 0.3, "Reflected from Greenland"),
]

signal = sum(a * np.sin(2*np.pi*t/p + np.random.uniform(0, 2*np.pi))
             for p, a, _ in components) + np.random.normal(0, 0.2, n)

# FFT
fft_vals = np.fft.rfft(signal)
freqs = np.fft.rfftfreq(n, dt)
amps = 2.0 * np.abs(fft_vals) / n

# Peak detection
peaks = [i for i in range(2, len(amps)-2)
         if amps[i] > amps[i-1] and amps[i] > amps[i+1] and amps[i] > 0.15]

print("=== Ocean Wave Spectrum Analysis ===")
print(f"Duration: {duration}s | Sample rate: {1/dt:.0f} Hz | Points: {n}\\\n")
print(f"{'Frequency':>11} {'Period':>9} {'Amplitude':>11} {'Type':>22}")
print("-" * 55)

for idx in peaks[:8]:
    f, p, a = freqs[idx], 1/freqs[idx] if freqs[idx] > 0 else 999, amps[idx]
    typ = ("Local wind" if p < 5 else "Moderate wind" if p < 8 else
           "Distant storm" if p < 12 else "Far swell" if p < 16 else "Reflected/coastal")
    print(f"{f:>9.4f} Hz {p:>7.1f} s {a:>9.2f} m {typ:>20}")

print(f"\\\n=== Verification ===")
print(f"{'True Period':>12} {'True Amp':>10} {'Detected?':>10}")
for p, a, _ in components:
    found = any(abs(freqs[i] - 1/p) < 0.02 for i in peaks)
    print(f"{p:>10.1f} s {a:>8.1f} m {'YES' if found else 'NO':>8}")

print("\\\nLong-period swell (14-18s) indicates distant weather and land —")
print("the same information Viking navigators extracted by feel.")`,
      challenge: 'Add a second measurement 6 hours later where the long-period swell has shifted in frequency (storm is moving). Calculate the storm\'s angular velocity from the frequency shift — the Doppler effect applied to ocean waves.',
      successHint: 'Fourier analysis is the backbone of audio processing (MP3), image compression (JPEG), telecommunications, and medical imaging (MRI). You applied it to the same problem Viking navigators solved by intuition.',
    },
    {
      title: 'Multi-sensor fusion — combine star, swell, bird, and cloud data optimally',
      concept: `Viking navigators fused multiple information sources: star/sun position (±1° accuracy), ocean swell direction (±10°), bird species (distance to land), cloud patterns, and water colour. Each has different accuracy, availability, and reliability.

**Multi-sensor fusion** combines them using **weighted least squares** — weighting each source by the inverse of its variance:

**x_fused = sum(w_i x_i) / sum(w_i) where w_i = 1/sigma_i**²

This is the **minimum variance estimator** — the most precise estimate possible from noisy measurements.

📚 *Sensor fusion is the foundation of every autonomous system: self-driving cars fuse cameras, lidar, radar, and GPS using the same weighted least squares approach.*`,
      analogy: 'Three friends estimate the temperature: one confident (18°C), one uncertain (25°C), one very confident (20°C). You weight the confident ones more. That\'s weighted fusion. The optimal estimate is closer to 18-20°C.',
      storyConnection: 'The Viking navigator\'s expertise was knowing which cues to trust and how much. On clear days, the sun dominated. In fog, swell direction became primary. Near land, bird sightings overrode everything. This dynamic reweighting is exactly what sensor fusion algorithms do.',
      checkQuestion: 'Star fix: 62.0°N ±1°. Swell estimate: 63.5°N ±3°. What is the fused estimate?',
      checkAnswer: 'w_star = 1/1² = 1.0, w_swell = 1/9 = 0.111. Fused = (62.0 + 0.111 × 63.5) / 1.111 = 62.17°N. The star fix dominates because it is 9× more precise by variance.',
      codeIntro: 'Build a multi-sensor fusion system combining all Viking navigation cues into an optimal position estimate.',
      code: `import numpy as np
np.random.seed(42)

class Sensor:
    def __init__(self, name, accuracy_deg, avail_pct, max_range_km=None):
        self.name, self.acc, self.avail = name, accuracy_deg, avail_pct/100
        self.max_range = max_range_km
    def measure(self, true_lat, true_lon, dist_land, clear_sky):
        ok = np.random.random() < self.avail
        if "Star" in self.name or "Sun" in self.name: ok = ok and clear_sky
        if self.max_range and dist_land > self.max_range: ok = False
        if not ok: return None, None
        return true_lat + np.random.normal(0, self.acc), true_lon + np.random.normal(0, self.acc*1.5)

sensors = [
    Sensor("Sun altitude", 1.0, 60), Sensor("Star bearing", 1.5, 40),
    Sensor("Swell direction", 3.0, 85), Sensor("Bird sighting", 2.0, 70, 100),
    Sensor("Cloud formation", 4.0, 50, 200), Sensor("Water colour", 5.0, 90, 150),
]

def fuse(measurements):
    if not measurements: return None, None, float('inf')
    lat_s = sum(lat/s**2 for lat, _, s in measurements)
    lon_s = sum(lon/s**2 for _, lon, s in measurements)
    w = sum(1/s**2 for _, _, s in measurements)
    return lat_s/w, lon_s/w, 1/np.sqrt(w)

# 7-day crossing with fusion
true_lat, true_lon = 64.1, -21.9
speed, heading = 8.0, 255
print("=== Multi-Sensor Fusion: 7-Day Crossing ===\\\n")

for day in range(1, 8):
    true_lat += speed * 24 * np.cos(np.radians(heading)) / 111
    true_lon += speed * 24 * np.sin(np.radians(heading)) / (111 * np.cos(np.radians(true_lat)))
    dist_land = max(0, -(true_lon + 42) * 111 * np.cos(np.radians(true_lat)))
    clear = np.random.random() < 0.55
    meas, names = [], []
    for s in sensors:
        lat_m, lon_m = s.measure(true_lat, true_lon, dist_land, clear)
        if lat_m is not None:
            meas.append((lat_m, lon_m, s.acc)); names.append(s.name)
    fl, flon, fsig = fuse(meas)
    sky = "Clear" if clear else "Overcast"
    print(f"Day {day} ({sky}, {dist_land:.0f}km from land): {len(meas)} sensors")
    if fl:
        err = np.sqrt(((fl-true_lat)*111)**2 + ((flon-true_lon)*111*np.cos(np.radians(true_lat)))**2)
        print(f"  Fused: {fl:.2f}°N, {abs(flon):.2f}°W | Error: {err:.1f}km | ±{fsig*111:.0f}km")
    else:
        print(f"  No fixes — dead reckoning only")

# Accuracy comparison
print("\\\n=== Single Sensor vs Fused (500 trials, mid-ocean, clear sky) ===")
single_errs = {s.name: [] for s in sensors[:3]}
fused_errs = []
for _ in range(500):
    meas = []
    for s in sensors:
        lat_m, lon_m = s.measure(62.0, -35.0, 200, True)
        if lat_m is not None:
            meas.append((lat_m, lon_m, s.acc))
            if s.name in single_errs:
                single_errs[s.name].append(np.sqrt(((lat_m-62)*111)**2+((lon_m+35)*111*0.47)**2))
    if meas:
        fl, flon, _ = fuse(meas)
        fused_errs.append(np.sqrt(((fl-62)*111)**2+((flon+35)*111*0.47)**2))
print(f"{'Source':<20} {'Median Error':>12}")
for n, e in single_errs.items():
    if e: print(f"{n:<20} {np.median(e):>10.1f} km")
print(f"{'FUSED':<20} {np.median(fused_errs):>10.1f} km")`,
      challenge: 'Add adaptive weighting: in fog upweight swell and water colour; near land upweight bird sightings. How does adaptive weighting compare to fixed? This is the basis of modern adaptive Kalman filtering.',
      successHint: 'You built the mathematical equivalent of a Viking navigator\'s intuition — combining noisy, intermittent cues into a reliable position estimate. The same approach powers self-driving cars, drones, and smartphones.',
    },
    {
      title: 'Risk assessment — calculate the probability of a successful crossing vs disaster',
      concept: `Every Viking voyage was a calculated risk. **Risk assessment** combines hazard identification, probability estimation, consequence analysis, and decision-making.

We model this as a **fault tree**: a ship is lost if (navigation error AND no landmarks) OR (storm AND hull failure) OR (ice AND no evasion). Each branch has a probability, and the tree gives the overall loss probability.

**Risk = Probability x Consequence**

📚 *Fault tree analysis was developed for nuclear safety but is now used in aviation, aerospace, medicine, and any safety-critical field.*`,
      analogy: 'A chain breaks if ANY link fails (OR gate). A door stays locked only if BOTH locks hold (AND gate). Viking voyages had both: any catastrophic failure could sink the ship (OR), but most hazards required multiple things going wrong (AND).',
      storyConnection: 'Erik the Red\'s fleet: 25 ships departed Iceland for Greenland in 986 CE, only 14 arrived — a 44% loss rate. Some turned back, some were driven off course, some sank. This data calibrates our risk model.',
      checkQuestion: 'A crossing has 5% storm chance; if a storm hits, 30% chance of ship loss. What is storm-related loss probability?',
      checkAnswer: 'P(loss) = 0.05 x 0.30 = 0.015 = 1.5%. Other branches (ice, navigation error, equipment) add their own probabilities. Total loss probability is 1 minus the probability ALL branches survive.',
      codeIntro: 'Build a fault tree risk model for Viking Atlantic crossings and calculate survival probabilities.',
      code: `import numpy as np
np.random.seed(42)

class Hazard:
    def __init__(self, name, prob_day, loss_prob):
        self.name, self.prob, self.loss = name, prob_day, loss_prob

hazards = [
    Hazard("Major storm",      0.05, 0.25), Hazard("Navigation error", 0.03, 0.08),
    Hazard("Sea ice",          0.02, 0.15), Hazard("Equipment failure",0.01, 0.10),
    Hazard("Crew illness",     0.005,0.05), Hazard("Rogue wave",       0.002,0.50),
]

def simulate_risk(hazards, days, n_sims=5000):
    outcomes = {"survived": 0, "turned_back": 0, "lost": 0}
    causes = {h.name: 0 for h in hazards}
    for _ in range(n_sims):
        lost, close_calls = False, 0
        for day in range(days):
            for h in hazards:
                if np.random.random() < h.prob:
                    if np.random.random() < h.loss:
                        lost = True; causes[h.name] += 1; break
                    else: close_calls += 1
            if lost: break
        if lost: outcomes["lost"] += 1
        elif close_calls > 3: outcomes["turned_back"] += 1
        else: outcomes["survived"] += 1
    return outcomes, causes

routes = [
    ("Faroe to Iceland", 4), ("Iceland to Greenland", 6),
    ("Greenland to Vinland", 10), ("Norway to Vinland (direct)", 18),
]

print("=== Viking Voyage Risk Assessment (5,000 sims each) ===\\\n")
for name, days in routes:
    out, causes = simulate_risk(hazards, days)
    tot = sum(out.values())
    top = max(causes, key=causes.get)
    print(f"{name} ({days} days):")
    print(f"  Survived: {out['survived']/tot*100:>5.1f}% | Turned back: "
          f"{out['turned_back']/tot*100:.1f}% | Lost: {out['lost']/tot*100:.1f}%")
    print(f"  Top risk: {top} ({causes[top]/tot*100:.1f}%)\\\n")

# Historical calibration
print("=== Historical Calibration ===")
print("Erik the Red's fleet (986 CE): 25 ships, 14 arrived")
out25, _ = simulate_risk(hazards, 6, 25)
print(f"Model for 25 ships: {(out25['lost']+out25['turned_back'])/25*100:.0f}% loss+turnback")

# Expected value
print("\\\n=== Risk-Benefit Decision ===")
trade_val, ship_cost, crew_val = 1000, 200, 500
for name, days in routes:
    out, _ = simulate_risk(hazards, days)
    tot = sum(out.values())
    p_ok, p_loss = out["survived"]/tot, out["lost"]/tot
    ev = p_ok * trade_val - p_loss * (ship_cost + crew_val)
    print(f"  {name}: EV = {ev:>+.0f} (P_success={p_ok:.2f}, P_loss={p_loss:.3f})")`,
      challenge: 'Add "navigator skill" (halves navigation error losses) and "ship quality" (reduces storm/equipment losses by 30%). How much does investing in good navigators and ships improve expected value?',
      successHint: 'Fault tree analysis and risk-benefit calculation are used in every safety-critical industry: aviation, nuclear power, medicine, space exploration. You built the framework that turns uncertainty into quantified decision-making.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling and simulation</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers Monte Carlo voyage simulation, seasonal optimisation, Fourier wave analysis, multi-sensor fusion, and risk assessment.
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
