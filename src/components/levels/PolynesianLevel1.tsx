import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PolynesianLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'The star compass — mapping the sky as a navigation tool',
      concept: `Every star rises at a specific compass bearing on the eastern horizon and sets at a specific bearing in the west. Polynesian navigators memorized the rising and setting points of approximately **220 stars**, creating a mental compass with dozens of directional references around the horizon.

Unlike a magnetic compass (which gives you one direction — north), the star compass gives you **dozens of directions** simultaneously, each confirmed by a different star. As one star rises too high to be useful, the next one appears at the same horizon point — creating a continuous chain of references through the night.

The rising azimuth of a star depends on its **declination** (position north or south of the celestial equator) and your **latitude**:

**cos(azimuth) = sin(declination) / cos(latitude)**

A star on the celestial equator (declination 0°) always rises due east (90°). Stars with positive declination rise north of east; negative declination, south of east.

📚 *The star compass is not a physical object — it's a mental model. A trained navigator carries the entire compass in memory, refined over years of practice. This is why navigation was a specialized profession, passed from master to apprentice.*`,
      analogy: 'Imagine standing in a dark room with 50 flashlights mounted on the walls at known positions. Even though you can\'t see the walls, the flashlight positions tell you exactly where you\'re facing. Stars are nature\'s flashlights — fixed at known positions on the sky\'s "wall," each one confirming your direction.',
      storyConnection: 'Mau Piailug, one of the last traditional navigators from Satawal (Micronesia), guided the replica canoe Hōkūleʻa from Hawaii to Tahiti in 1976 using only the star compass — no instruments. He demonstrated that traditional navigation could reliably guide a canoe across 4,000 km of open ocean.',
      checkQuestion: 'If a star has declination +20° and you\'re at latitude 20°N, at what azimuth does it rise?',
      checkAnswer: 'cos(az) = sin(20°) / cos(20°) = 0.342 / 0.940 = 0.364. az = arccos(0.364) = 68.6°. The star rises at about 69° from north — roughly east-northeast. A navigator facing this direction when the star appears knows they\'re looking ENE.',
      codeIntro: 'Build a star compass — calculate rising azimuths for navigation stars at different latitudes.',
      code: `import numpy as np

def star_rising_azimuth(declination_deg, latitude_deg):
    """Calculate where a star rises on the horizon."""
    dec = np.radians(declination_deg)
    lat = np.radians(latitude_deg)
    cos_az = np.sin(dec) / np.cos(lat)
    if abs(cos_az) > 1:
        return None  # circumpolar or never rises
    return np.degrees(np.arccos(cos_az))

# Key Polynesian navigation stars
stars = [
    ("Hokupa'a (Polaris)", 89.3),
    ("Hoku-le'a (Arcturus)", 19.2),
    ("'A'a (Sirius)", -16.7),
    ("Ke ali'i (S. Cross α)", -63.1),
    ("Na hiku (Big Dipper avg)", 55.0),
    ("Hikianalia (Spica)", -11.2),
    ("Ka iwikuamo'o (Scorpius α)", -26.4),
    ("Pi'ilani (Canopus)", -52.7),
    ("Hanaiakamalama (S. Cross β)", -59.7),
    ("Ka Makau Nui (Scorpius hook)", -34.3),
]

# Build compass at Hawaiian latitude (20°N)
latitude = 20.0
print(f"=== Star Compass at {latitude}°N (Hawaii) ===\
")

print(f"{'Star (Hawaiian name)':<30} {'Dec':>6} {'Rising Az':>10} {'Direction':>10}")
print("-" * 58)

for name, dec in stars:
    az = star_rising_azimuth(dec, latitude)
    if az is None:
        status = "Circumpolar" if dec > 0 else "Never rises"
        print(f"{name:<30} {dec:>5.1f}° {'':>10} {status:>10}")
    else:
        dirs = [(0,"N"),(22.5,"NNE"),(45,"NE"),(67.5,"ENE"),(90,"E"),
                (112.5,"ESE"),(135,"SE"),(157.5,"SSE"),(180,"S")]
        direction = min(dirs, key=lambda d: abs(d[0]-az))[1]
        print(f"{name:<30} {dec:>5.1f}° {az:>8.1f}° {direction:>10}")

# Compare across Polynesian latitudes
print(f"\
=== Arcturus (Hoku-le'a) at Different Latitudes ===")
print(f"Arcturus is the 'zenith star' of Hawaii — it passes directly")
print(f"overhead at latitude 19.2°N.\
")

for lat in [-20, -10, 0, 10, 19.2, 30, 40, 50]:
    az = star_rising_azimuth(19.2, lat)
    if az:
        print(f"  Latitude {lat:>5.1f}°: rises at {az:>5.1f}° — ", end="")
        if abs(90 - lat - 19.2) < 1:
            print("passes through ZENITH ← navigators sail until this happens")
        else:
            print(f"{'north of east' if az < 90 else 'east' if abs(az-90)<1 else 'south of east'}")
    else:
        print(f"  Latitude {lat:>5.1f}°: does not rise")

# The latitude sailing technique
print(f"\
=== Latitude Sailing ===")
print(f"Method: sail north/south until your zenith star passes overhead,")
print(f"then sail due east or west along that latitude.")
print(f"\
Example: Hawaii → Tahiti")
print(f"  1. Sail south from Hawaii (20°N)")
print(f"  2. Watch Arcturus — when it no longer passes through zenith,")
print(f"     you've gone too far south")
print(f"  3. Tahiti is at 17.5°S — different zenith stars guide you there")
print(f"  4. Sail east/west along 17.5°S until you detect Tahiti's signs")`,
      challenge: 'Calculate the star compass for Tahiti (17.5°S) instead of Hawaii (20°N). Which stars that are visible from Hawaii can\'t be seen from Tahiti, and vice versa? This difference is what navigators used to know when they\'d arrived at the right latitude.',
      successHint: 'You built a celestial navigation system using spherical trigonometry — the same mathematics used in GPS satellite positioning, telescope pointing, and spacecraft navigation. The Polynesians solved these equations by memorization; you solved them with code. Same physics, different tools.',
    },
    {
      title: 'Wave refraction — detecting islands beyond the horizon',
      concept: `Ocean swells travel thousands of kilometres in straight lines. When they encounter an island, they **refract** (bend around it), **reflect** (bounce off it), and **diffract** (spread behind it), creating disturbance patterns detectable up to **100 km** from the island.

A navigator lying in the canoe hull — feeling the motion rather than looking — can detect these disturbances. Normal swell produces a regular rocking pattern. Near an island, the reflected and refracted waves create interference, disrupting the regular pattern.

The physics: when a wave encounters an obstacle, the wavefronts bend around it according to **Huygens' principle** — each point on the wavefront acts as a source of secondary wavelets. Behind the island, these secondary wavelets interfere, creating zones of constructive interference (stronger waves) and destructive interference (calmer water).

📚 *Wave refraction is universal: water waves around islands, light waves through lenses, sound waves around buildings. The mathematics is identical. Polynesian navigators used water wave refraction 3,000 years before physicists formalized it.*`,
      analogy: 'Drop a pebble near a rock in a pond. The ripples bend around the rock, creating a complex pattern behind it — some areas are choppy (waves meeting), some are calm (waves canceling). Now scale up: the pebble is a distant storm, the ripples are ocean swells, the rock is an island. Same physics, vastly larger scale.',
      storyConnection: 'Marshall Islanders created "stick charts" — maps made of palm ribs and shells showing wave refraction patterns between islands. The sticks represent wave fronts; the shells represent islands. These charts encode the interference patterns that navigators learned to feel through the canoe hull.',
      checkQuestion: 'If an island is 10 km wide and the dominant swell wavelength is 200 m, will the swell refract significantly around the island?',
      checkAnswer: 'Yes — the island is 50 times the wavelength. Most of the swell will reflect off the island, with some diffracting around the edges. The reflected waves create interference patterns extending 50-100 km behind the island. These patterns are what navigators detect.',
      codeIntro: 'Model ocean swell encountering an island — calculate the interference pattern and detection range.',
      code: `import numpy as np

def wave_pattern(island_width_km, swell_wavelength_m, distance_km):
    """
    Calculate the wave amplitude disturbance at a given distance
    behind an island, at the center line.

    Returns amplitude relative to undisturbed (1.0 = normal).
    """
    wl_km = swell_wavelength_m / 1000
    half_w = island_width_km / 2

    if distance_km < 1:
        return 0.1  # in the shadow zone

    # Path difference from each edge of the island
    d_left = np.sqrt(half_w**2 + distance_km**2)
    d_right = d_left  # symmetric at center line

    # Fresnel number (determines diffraction regime)
    fresnel = half_w**2 / (wl_km * distance_km)

    # Amplitude in shadow zone (simplified)
    if fresnel > 10:
        # Geometric shadow — strong reduction
        amplitude = 0.1 + 0.3 * np.exp(-fresnel / 20)
    elif fresnel > 1:
        # Transition zone — partial shadow
        amplitude = 0.4 + 0.3 * np.sin(np.pi * fresnel / 4)
    else:
        # Far field — weak diffraction effects
        amplitude = 0.9 + 0.1 * np.cos(2 * np.pi * distance_km / (wl_km * 10))

    return amplitude

# Analyze detection range for different island sizes
print("=== Wave Disturbance Behind Islands ===")
print(f"Swell wavelength: 250 m\
")

islands = [
    ("Small atoll", 2),
    ("Medium island", 10),
    ("Large island (like Hawaii)", 50),
]

distances = [5, 10, 20, 30, 50, 75, 100, 150]

for name, width in islands:
    print(f"{name} ({width} km wide):")
    print(f"  {'Distance':>10} {'Amplitude':>10} {'Disturbance':>12} {'Detectable?':>12}")
    print(f"  {'-'*46}")

    for d in distances:
        amp = wave_pattern(width, 250, d)
        disturbance = abs(1.0 - amp) * 100
        detectable = "YES" if disturbance > 5 else "Maybe" if disturbance > 2 else "No"
        bar = "█" * int(disturbance)
        print(f"  {d:>8} km {amp:>8.2f} {disturbance:>10.0f}% {detectable:>12} {bar}")
    print()

# Multiple signal types
print("=== Multi-Signal Detection ===")
print("Navigators used MULTIPLE signals simultaneously:\
")

signals = [
    ("Swell disturbance", 60, 0.3, "Feel canoe hull motion change"),
    ("Cloud buildup", 120, 0.2, "Cumulus clouds pile over warm islands"),
    ("Seabirds (terns)", 80, 0.5, "Terns fly 80km to feed, return at dusk"),
    ("Seabirds (frigate)", 200, 0.2, "Frigates range further but less reliable"),
    ("Water colour", 30, 0.6, "Green = shallow reef. Blue = deep ocean"),
    ("Bioluminescence", 20, 0.4, "Phosphorescence patterns near reefs"),
    ("Floating debris", 40, 0.3, "Palm fronds, coconuts in current"),
    ("Smell of land", 30, 0.5, "Vegetation scent on downwind approach"),
]

print(f"{'Signal':<24} {'Range km':>9} {'Reliability':>12} {'Method'}")
print("-" * 70)
for name, range_km, reliability, method in signals:
    print(f"{name:<24} {range_km:>7} {reliability:>10.0%} {method}")

# Combined detection probability
print(f"\
=== Combined Detection Probability ===")
for d in [150, 100, 80, 60, 40, 20, 10]:
    prob_miss = 1.0
    for name, range_km, reliability, _ in signals:
        if d <= range_km:
            signal_strength = reliability * (range_km / d)**0.5
            signal_strength = min(signal_strength, 0.95)
            prob_miss *= (1 - signal_strength)

    prob_detect = 1 - prob_miss
    bar = "█" * int(prob_detect * 20)
    print(f"  {d:>3} km: {prob_detect:>5.0%} {bar}")

print(f"\
The 10 km island becomes a ~200 km detection zone")
print(f"when all signals are combined — a 20× target expansion.")`,
      challenge: 'A navigator approaches from the northeast at night (no visual signals). Only swell disturbance and bioluminescence are available. Recalculate the detection probability. How much does losing visual signals reduce detection range?',
      successHint: 'You modeled wave physics and multi-sensor detection — the same mathematics used in radar, sonar, autonomous vehicle sensing, and search-and-rescue operations. The key insight: combining weak independent signals creates strong detection. This is sensor fusion — and the Polynesians were the first to practice it systematically.',
    },
    {
      title: 'Dead reckoning — navigating by speed, heading, and time',
      concept: `Between celestial observations, navigators tracked position by **dead reckoning**: starting from a known point and updating based on estimated speed, heading, and elapsed time.

**New position = old position + velocity × time**

The problem: every estimate has **error**. Speed is judged by watching wake patterns. Heading drifts with currents. Time is estimated from the sun and stars. These errors **accumulate** — after days of dead reckoning, position uncertainty can be tens of kilometres.

This is why periodic **fixes** (sun altitude at noon, star observations at night) were essential — they reset the error. Without fixes, dead reckoning error grows without bound, following a **random walk**: error ∝ √(time).

The mathematics of error accumulation: if each measurement has standard deviation σ, and measurements are independent, the cumulative error after n measurements is σ × √n. This means error grows more slowly than you might expect — but it never stops growing.

📚 *Dead reckoning is still used by submarines (can't access GPS underwater), aircraft (as GPS backup), and spacecraft (between star fixes). It's the universal fallback when external references aren't available.*`,
      analogy: 'Walk blindfolded through your house, counting steps. After 10 steps, you\'re probably close to where you think you are. After 50 steps, you\'ve bumped into walls and your mental map is way off. Dead reckoning is the same: accurate over short distances, increasingly wrong over long ones. Periodic "peeks" (removing the blindfold = taking a star fix) reset the error.',
      storyConnection: 'A Polynesian voyage from Hawaii to Tahiti (4,000 km) took about 2-3 weeks. Dead reckoning accumulated error daily, corrected by star observations when the sky was clear. On cloudy nights, error grew. This is why navigators preferred to sail during seasons with clear skies and predictable winds.',
      checkQuestion: 'If dead reckoning error is ±5 km per day, what is the expected error after 14 days?',
      checkAnswer: 'If errors are random and independent: σ_total = 5 × √14 = 18.7 km. NOT 5 × 14 = 70 km — because random errors partially cancel each other. This √n growth is much better than linear growth, but it still means uncertainty grows with voyage length.',
      codeIntro: 'Simulate dead reckoning navigation with cumulative errors — compare with periodic star fixes.',
      code: `import numpy as np

np.random.seed(42)

def simulate_voyage(start_lat, start_lon, target_lat, target_lon,
                     speed_knots=6, days=14,
                     heading_error_std=3, speed_error_std=0.5,
                     current_north=0.2, current_east=-0.3,
                     fix_interval=None):
    """
    Simulate a Polynesian voyage with dead reckoning.
    fix_interval: days between star fixes (None = no fixes).
    """
    nm_per_degree = 60  # nautical miles per degree latitude
    hours_per_day = 12  # sailing hours

    true_lat, true_lon = start_lat, start_lon
    est_lat, est_lon = start_lat, start_lon

    log = []

    for day in range(1, days + 1):
        # Intended heading toward target
        dlat = target_lat - est_lat
        dlon = target_lon - est_lon
        intended = np.degrees(np.arctan2(dlon, dlat))

        # Actual heading (with error)
        actual = intended + np.random.normal(0, heading_error_std)
        actual_speed = speed_knots + np.random.normal(0, speed_error_std)
        distance = actual_speed * hours_per_day  # nautical miles

        # True position (includes current drift)
        rad = np.radians(actual)
        true_lat += (distance * np.cos(rad) + current_north * hours_per_day) / nm_per_degree
        true_lon += (distance * np.sin(rad) + current_east * hours_per_day) / (nm_per_degree * np.cos(np.radians(true_lat)))

        # Estimated position (no knowledge of current or heading error)
        est_rad = np.radians(intended)
        est_dist = speed_knots * hours_per_day
        est_lat += est_dist * np.cos(est_rad) / nm_per_degree
        est_lon += est_dist * np.sin(est_rad) / (nm_per_degree * np.cos(np.radians(est_lat)))

        # Star fix (resets latitude error)
        if fix_interval and day % fix_interval == 0:
            fix_error = np.random.normal(0, 0.5)  # ±0.5° accuracy
            est_lat = true_lat + fix_error

        error = np.sqrt((true_lat-est_lat)**2 + (true_lon-est_lon)**2) * 111

        log.append({"day": day, "true_lat": true_lat, "true_lon": true_lon,
                     "est_lat": est_lat, "est_lon": est_lon, "error_km": error})

    return log

# Hawaii to Tahiti
print("=== Polynesian Voyage: Hawaii → Tahiti ===")
print(f"Distance: ~4,000 km | Duration: ~14 days\
")

# Scenario 1: No star fixes
no_fix = simulate_voyage(20.0, -155.5, -17.5, -149.4, fix_interval=None)

# Scenario 2: Star fix every 3 days
with_fix = simulate_voyage(20.0, -155.5, -17.5, -149.4, fix_interval=3)

# Scenario 3: Star fix every night
nightly = simulate_voyage(20.0, -155.5, -17.5, -149.4, fix_interval=1)

print(f"{'Day':>4} {'No Fix Error':>13} {'Fix/3d Error':>13} {'Nightly Error':>14}")
print("-" * 46)

for i in range(14):
    print(f"{i+1:>4} {no_fix[i]['error_km']:>10.0f} km"
          f" {with_fix[i]['error_km']:>10.0f} km"
          f" {nightly[i]['error_km']:>11.0f} km")

print(f"\
Final errors:")
print(f"  No fixes:     {no_fix[-1]['error_km']:>5.0f} km")
print(f"  Fix every 3d: {with_fix[-1]['error_km']:>5.0f} km")
print(f"  Nightly fix:  {nightly[-1]['error_km']:>5.0f} km")

# Can they find Tahiti?
print(f"\
Tahiti is ~50 km wide. Detection zone: ~200 km.")
for name, log in [("No fix", no_fix), ("3-day fix", with_fix), ("Nightly", nightly)]:
    err = log[-1]['error_km']
    found = "LANDFALL LIKELY" if err < 200 else "MIGHT MISS" if err < 400 else "LOST"
    print(f"  {name}: error {err:.0f} km → {found}")

# Error growth: √n law
print(f"\
=== Error Growth: √n Law ===")
print(f"Daily error std: 5 km")
print(f"{'Days':>5} {'Linear (5×n)':>14} {'√n (5×√n)':>12} {'Actual avg':>11}")
print("-" * 44)

for n in [1, 3, 5, 7, 10, 14, 21]:
    linear = 5 * n
    sqrt_n = 5 * np.sqrt(n)
    # Run 100 simulations to get actual
    errors = []
    for _ in range(100):
        log = simulate_voyage(20.0, -155.5, -17.5, -149.4, days=n, fix_interval=None)
        errors.append(log[-1]['error_km'])
    actual = np.mean(errors)
    print(f"{n:>5} {linear:>12.0f} km {sqrt_n:>10.0f} km {actual:>9.0f} km")`,
      challenge: 'Add an ocean current that changes direction every 3 days (simulating tidal currents). How does variable current affect dead reckoning error compared to constant current? (Variable current is worse because the navigator can\'t learn and compensate for it.)',
      successHint: 'You simulated dead reckoning navigation with error accumulation and periodic corrections — the same mathematics used in inertial navigation systems (submarines, aircraft), robot localization (SLAM algorithms), and even financial modeling (random walks in stock prices). The √n error growth law is universal for random processes.',
    },
    {
      title: 'Probability and search — finding a 10 km target in a 15,000 km ocean',
      concept: `A Pacific island is ~10 km wide. The Pacific Ocean is ~15,000 km across. The probability of stumbling across the island randomly is about **10/15,000 = 0.07%**. Hopeless.

But Polynesian navigators didn't search randomly. They used **directed search** — sailing toward a target along a known latitude, maximizing the detection zone. And the target wasn't just a 10 km island — it was a **200 km detection zone** when all signals (waves, birds, clouds, smell) are combined.

**Signal detection theory** (developed for WWII radar) quantifies this: the probability of detecting a target depends on signal strength (how obvious the clues are), noise level (how variable the normal ocean is), and observer sensitivity (how trained the navigator is).

Key concept: **false alarm rate**. If you're too sensitive (reacting to every slight wave change), you'll chase phantom islands. If you're not sensitive enough, you'll sail past real ones. The optimal sensitivity balances **detection probability** against **false alarm rate** — the receiver operating characteristic (ROC) curve.

📚 *The ROC curve is used in medical testing (sensitivity vs specificity), spam filtering (catching spam vs blocking real email), and machine learning (precision vs recall). It's the universal framework for binary detection problems.*`,
      analogy: 'A doctor reading an X-ray must decide: tumour or shadow? Too cautious (calling every shadow a tumour) = lots of false alarms, unnecessary biopsies. Too dismissive (ignoring subtle shadows) = missed cancers. The doctor finds the optimal balance. A navigator reading wave patterns faces the same trade-off: react to every disturbance (many false leads) or only obvious ones (might miss the island).',
      storyConnection: 'Polynesian voyagers were trained from childhood — spending years learning to distinguish real island signals from random ocean variability. This training was the "calibration" of their biological detection system. A novice might mistake a dolphin pod for a reef disturbance; an expert navigator would not.',
      checkQuestion: 'If the detection zone is 200 km diameter and the navigator\'s heading uncertainty is ±100 km, what is the probability of passing through the detection zone?',
      checkAnswer: 'The detection zone width is 200 km. The uncertainty corridor is ±100 km = 200 km wide. The probability of overlap depends on how well the navigator aimed, but if the center of the corridor passes within 100 km of the island, the detection zone is hit. With ±100 km error, there\'s roughly a 50-80% chance — good odds for a directed search.',
      codeIntro: 'Model search probability — calculate detection likelihood for different navigation accuracies and island sizes.',
      code: `import numpy as np

np.random.seed(42)

def search_probability(island_size_km, detection_zone_km,
                        heading_error_km, n_simulations=10000):
    """
    Monte Carlo simulation of island detection probability.
    Navigator aims at the island but has heading uncertainty.
    """
    detections = 0

    for _ in range(n_simulations):
        # Navigator's actual closest approach to island center
        miss_distance = abs(np.random.normal(0, heading_error_km))

        # Detection happens if miss < detection zone radius
        if miss_distance < detection_zone_km / 2:
            detections += 1

    return detections / n_simulations

# Detection probability for different scenarios
print("=== Island Detection Probability ===\
")

print(f"{'Island':>14} {'Det Zone':>10} {'Nav Error':>10} {'P(detect)':>10}")
print("-" * 46)

scenarios = [
    # (island_km, detection_zone_km, heading_error_km)
    ("Tiny atoll", 2, 50, 50),
    ("Tiny atoll", 2, 50, 100),
    ("Tiny atoll", 2, 50, 200),
    ("Medium isle", 10, 200, 50),
    ("Medium isle", 10, 200, 100),
    ("Medium isle", 10, 200, 200),
    ("Large island", 50, 300, 50),
    ("Large island", 50, 300, 100),
    ("Large island", 50, 300, 200),
]

for name, island, zone, error in scenarios:
    prob = search_probability(island, zone, error)
    bar = "█" * int(prob * 20)
    print(f"{name:>14} {zone:>8} km {error:>8} km {prob:>8.0%} {bar}")

# ROC analysis for wave signal detection
print(f"\
=== ROC Curve: Wave Signal Detection ===")
print(f"How sensitive should the navigator be?\
")

def roc_analysis(signal_strength, noise_level, thresholds):
    """
    Calculate ROC curve points.
    signal_strength: mean disturbance near island
    noise_level: random ocean variability
    """
    results = []
    for threshold in thresholds:
        # True positive: detect island when it's there
        tp = 1 - 0.5 * (1 + np.math.erf((threshold - signal_strength) / (noise_level * np.sqrt(2))))
        # False positive: "detect" island when it's not there
        fp = 1 - 0.5 * (1 + np.math.erf((threshold - 0) / (noise_level * np.sqrt(2))))
        results.append((threshold, tp, fp))
    return results

thresholds = np.arange(0, 3, 0.2)
roc = roc_analysis(signal_strength=1.0, noise_level=0.5, thresholds=thresholds)

print(f"{'Threshold':>10} {'Detection':>10} {'False Alarm':>12} {'Assessment'}")
print("-" * 44)

for thresh, tp, fp in roc:
    if tp > 0.9 and fp > 0.3:
        assess = "Too sensitive"
    elif tp > 0.7 and fp < 0.15:
        assess = "OPTIMAL"
    elif tp < 0.5:
        assess = "Too cautious"
    else:
        assess = ""
    print(f"{thresh:>8.1f} {tp:>8.0%} {fp:>10.0%} {assess:>12}")

# Expert vs novice
print(f"\
=== Expert vs Novice Navigator ===")
expert_roc = roc_analysis(1.0, 0.3, thresholds)  # low noise (trained)
novice_roc = roc_analysis(1.0, 0.8, thresholds)  # high noise (untrained)

# Find optimal operating point (maximize TP - FP)
best_expert = max(expert_roc, key=lambda x: x[1] - x[2])
best_novice = max(novice_roc, key=lambda x: x[1] - x[2])

print(f"Expert: Detection = {best_expert[1]:.0%}, False Alarm = {best_expert[2]:.0%}")
print(f"Novice: Detection = {best_novice[1]:.0%}, False Alarm = {best_novice[2]:.0%}")
print(f"\
The expert detects {'more' if best_expert[1] > best_novice[1] else 'fewer'} real islands")
print(f"AND has {'fewer' if best_expert[2] < best_novice[2] else 'more'} false alarms.")
print(f"Training doesn't just make you more sensitive — it makes you")
print(f"better at distinguishing signal from noise. That's the real skill.")

# Target expansion summary
print(f"\
=== Target Expansion Summary ===")
print(f"A 10 km island becomes a {200} km detection zone")
print(f"through multi-signal detection:")
print(f"  Physical island:    10 km")
print(f"  + Wave disturbance: 60 km radius")
print(f"  + Cloud patterns:   120 km radius")
print(f"  + Seabird range:    80 km radius")
print(f"  + Water colour:     30 km radius")
print(f"  = Detection zone:   ~200 km diameter")
print(f"  = Target expansion: 20×")
print(f"\
This transforms a 0.07% random-search probability into")
print(f"a 70%+ directed-search probability. That's why navigation")
print(f"works — it's not luck, it's signal detection theory.")`,
      challenge: 'Model a "return voyage" — sailing back from Tahiti to Hawaii. The navigator must find Hawaii (Big Island, 150 km wide) from 4,000 km away. Is the return easier or harder than the outbound voyage? (Hawaii is much larger than most Pacific islands, so the detection zone is correspondingly larger — the return is actually easier.)',
      successHint: 'You applied signal detection theory — the same mathematics used in medical diagnosis (sensitivity/specificity), radar (detection/false alarm), machine learning (precision/recall), and information theory (signal/noise ratio). The Polynesians practiced it 3,000 years before the math was formalized.',
    },
    {
      title: 'DNA evidence — proving the settlement pattern',
      concept: `How do we KNOW the Polynesians intentionally settled the Pacific? The evidence comes from **genetics**, **linguistics**, and **archaeology** — three independent lines of evidence that all tell the same story.

**Genetic evidence**: DNA analysis of modern Polynesian populations shows clear patterns of relatedness that match a west-to-east settlement sequence. Populations in Samoa are genetically closest to those in Tonga, then the Cook Islands, then Tahiti, then Hawaii, then Easter Island. This gradient is exactly what you'd expect from a sequential migration.

**Linguistic evidence**: Polynesian languages form a family tree mirroring the genetic evidence. Hawaiian, Tahitian, Maori, and Rapa Nui are all related — with mutual intelligibility decreasing with geographic (and temporal) distance. The language changes follow a **molecular clock** pattern — predictable divergence over time.

**Archaeological evidence**: Carbon-14 dating of settlements shows a clear chronological sequence: Samoa/Tonga (~1000 BCE), Cook Islands (~800 CE), Society Islands (~900 CE), Hawaii (~1000 CE), Easter Island (~1200 CE), New Zealand (~1300 CE). The dates match the genetic and linguistic sequences perfectly.

📚 *When three independent lines of evidence converge on the same conclusion, scientists call it "consilience." It's the strongest form of evidence — each line alone might have alternative explanations, but three pointing the same way is powerful.*`,
      analogy: 'A detective solving a crime finds three independent clues: fingerprints (DNA evidence), a note in the suspect\'s handwriting (linguistic evidence), and security camera footage (archaeological evidence). Each alone is suggestive. All three pointing to the same person = case closed. Polynesian settlement has the same three-clue convergence.',
      storyConnection: 'The sweet potato — a South American plant — was cultivated across Polynesia BEFORE European contact. DNA analysis of Polynesian sweet potatoes shows they\'re most closely related to South American varieties. This is genetic evidence that Polynesians reached South America — and brought back sweet potatoes — centuries before Columbus.',
      checkQuestion: 'If a language changes at a rate of 14% of basic vocabulary per 1,000 years, and Hawaiian and Tahitian share 76% of basic vocabulary, how long ago did they diverge?',
      checkAnswer: 'The retention rate is 1 - 0.14 = 0.86 per 1,000 years. If they share 76% vocabulary: 0.86^n = 0.76, where n is thousands of years. ln(0.76)/ln(0.86) = 1.82 thousand years ≈ 1,800 years. This matches the archaeological estimate that Hawaii was settled from the Society Islands around 1000 CE — roughly 1,000 years ago. The small discrepancy is because language change rates are approximate.',
      codeIntro: 'Model the genetic, linguistic, and archaeological evidence for Polynesian settlement — show how they converge.',
      code: `import numpy as np

# Settlement sequence with dates
settlements = [
    ("Samoa/Tonga", -1000, -14, -172),     # year, lat, lon
    ("Fiji", -800, -18, 178),
    ("Cook Islands", 800, -21, -160),
    ("Society Islands (Tahiti)", 900, -17.5, -149.4),
    ("Marquesas", 1000, -9, -139),
    ("Hawaii", 1050, 20, -155.5),
    ("Easter Island (Rapa Nui)", 1200, -27, -109),
    ("New Zealand (Aotearoa)", 1300, -41, 174),
]

print("=== Polynesian Settlement Sequence ===\
")
print(f"{'Location':<28} {'Year':>6} {'Lat':>6} {'Lon':>7}")
print("-" * 49)
for name, year, lat, lon in settlements:
    era = "BCE" if year < 0 else "CE"
    print(f"{name:<28} {abs(year):>4} {era} {lat:>5.1f}° {lon:>6.1f}°")

# Genetic distance model
print(f"\
=== Genetic Distance (simulated) ===")
print(f"Genetic distance increases with geographic distance and time\
")

def genetic_distance(years_apart, km_apart):
    """Simplified genetic distance model."""
    # Genetic drift rate: ~0.1% per generation (25 years)
    generations = abs(years_apart) / 25
    drift = 0.001 * generations
    # Founder effect: each migration reduces diversity
    founder_effect = 0.05 * np.log(1 + km_apart / 1000)
    return min(drift + founder_effect, 1.0)

print(f"{'Pop A':<20} {'Pop B':<20} {'Years':>6} {'km':>7} {'Gen Dist':>9}")
print("-" * 64)

pairs = [
    ("Samoa", "Tonga", 200, 800),
    ("Samoa", "Tahiti", 1900, 3200),
    ("Tahiti", "Hawaii", 150, 4000),
    ("Tahiti", "Easter Island", 300, 7500),
    ("Hawaii", "New Zealand", 250, 7400),
    ("Samoa", "New Zealand", 2300, 5500),
]

for a, b, years, km in pairs:
    dist = genetic_distance(years, km)
    bar = "█" * int(dist * 50)
    print(f"{a:<20} {b:<20} {years:>4} {km:>5} {dist:>7.3f} {bar}")

# Linguistic divergence
print(f"\
=== Linguistic Divergence ===")
print(f"Basic vocabulary retention rate: ~86% per 1000 years\
")

def vocabulary_shared(years_apart, retention_per_1000=0.86):
    """Estimate shared vocabulary between two divergent languages."""
    return retention_per_1000 ** (years_apart / 1000)

print(f"{'Language A':<16} {'Language B':<16} {'Years':>6} {'Shared Vocab':>13} {'Status'}")
print("-" * 55)

lang_pairs = [
    ("Samoan", "Tongan", 500, "High mutual intelligibility"),
    ("Tahitian", "Hawaiian", 1000, "Partial intelligibility"),
    ("Tahitian", "Maori", 1300, "Some shared words"),
    ("Hawaiian", "Rapa Nui", 1500, "Limited recognition"),
    ("Samoan", "Hawaiian", 2000, "Different but recognizably related"),
]

for a, b, years, status in lang_pairs:
    shared = vocabulary_shared(years) * 100
    print(f"{a:<16} {b:<16} {years:>4} {shared:>11.0f}% {status}")

# Archaeological dating
print(f"\
=== Archaeological Consilience ===")
print(f"Three independent lines of evidence converge:\
")

evidence_types = [
    ("Carbon-14 dating", "Physical dates from settlement sites",
     "Clear west→east chronological sequence"),
    ("Genetic analysis", "DNA from modern populations",
     "Diversity gradient matching settlement order"),
    ("Linguistic analysis", "Vocabulary comparison across languages",
     "Language tree mirrors genetic and archaeological trees"),
    ("Botanical evidence", "Plant DNA (sweet potato, taro)",
     "South American sweet potato in Polynesia before European contact"),
    ("Material culture", "Pottery, tools, fishhooks",
     "Lapita pottery trail from Melanesia through Polynesia"),
]

for name, method, finding in evidence_types:
    print(f"  {name}:")
    print(f"    Method: {method}")
    print(f"    Finding: {finding}\
")

print(f"All five lines of evidence tell the SAME story:")
print(f"intentional, planned migration from west to east,")
print(f"carrying plants, animals, and cultural knowledge,")
print(f"over approximately 3,000 years.")
print(f"\
This is consilience — the gold standard of scientific evidence.")`,
      challenge: 'The sweet potato controversy: some scientists argue the sweet potato floated to Polynesia naturally (no human transport needed). How would you test this? (Grow sweet potatoes, put them in seawater for the time a drift crossing would take — months — and see if they\'re still viable. This has been tested: sweet potatoes do NOT survive long ocean crossings. The human transport theory is strongly supported.)',
      successHint: 'You analyzed consilience — multiple independent lines of evidence converging on the same conclusion. This is the strongest form of scientific argument. The same approach is used in climate science (ice cores + tree rings + temperature records), evolutionary biology (fossils + DNA + biogeography), and forensics (physical + digital + testimonial evidence).',
    },
    {
      title: 'The Hōkūleʻa — proving that traditional navigation works',
      concept: `In 1976, the **Hōkūleʻa** — a replica double-hulled Polynesian canoe — sailed from Hawaii to Tahiti using only traditional navigation methods. No compass, no sextant, no GPS, no charts. Navigator **Mau Piailug** from Satawal guided the canoe across 4,000 km of open ocean using stars, swells, birds, and clouds.

The voyage was controversial: many Western academics believed Polynesian settlement was accidental — fishermen blown off course who happened to find islands. The Hōkūleʻa proved them wrong.

Since 1976, the Hōkūleʻa has sailed over **240,000 km** across three oceans — always using traditional navigation. In 2014-2017, it completed a **worldwide circumnavigation** — proving that traditional Polynesian techniques work not just in the Pacific but on every ocean on Earth.

The key scientific insight: the Hōkūleʻa is an **existence proof**. It doesn't just suggest traditional navigation might work — it demonstrates conclusively that it DOES work. One successful voyage eliminates the "impossible" objection forever.

📚 *An existence proof in mathematics shows that a solution exists — without necessarily finding the best one. The Hōkūleʻa is a navigational existence proof: it demonstrates that Polynesian techniques can reliably guide a canoe across any ocean.*`,
      analogy: 'Before Roger Bannister ran the 4-minute mile in 1954, many believed it was humanly impossible. After he did it, dozens of others broke 4 minutes within years. Bannister was an existence proof — he showed it was possible. The Hōkūleʻa did the same for Polynesian navigation: it proved the "impossible" was not only possible but reliable.',
      storyConnection: 'Mau Piailug was one of the last traditional navigators trained in the ancient method. He agreed to share his knowledge with the Hōkūleʻa crew because he feared the tradition would die with him. Thanks to the Hōkūleʻa program, traditional navigation has been revived — Nainoa Thompson and others now practice and teach the skills that nearly disappeared.',
      checkQuestion: 'Why did Western academics believe Polynesian settlement was accidental? What evidence changed their minds?',
      checkAnswer: 'Western academics couldn\'t believe that "primitive" canoes without instruments could navigate accurately across thousands of kilometres. This was cultural bias — they judged the technology by Western standards. The Hōkūleʻa proved that instrument-free navigation is not just possible but reliable. The vessel sailed 240,000 km across three oceans without once using modern instruments — a record no "accidental drifting" theory can explain.',
      codeIntro: 'Analyze the Hōkūleʻa\'s voyages — calculate distances, durations, and navigation accuracy.',
      code: `import numpy as np

def great_circle_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two points on Earth's surface.
    Uses the Haversine formula. Returns distance in km.
    """
    R = 6371  # Earth radius in km
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    return R * 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))

# Hōkūleʻa voyage database
voyages = [
    {"name": "Hawaii → Tahiti (1976)", "from": "Honolulu",
     "to": "Papeete", "lat1": 21.3, "lon1": -157.8,
     "lat2": -17.5, "lon2": -149.4, "days": 31,
     "navigator": "Mau Piailug", "method": "Traditional only"},
    {"name": "Hawaii → Tahiti (1980)", "from": "Honolulu",
     "to": "Papeete", "lat1": 21.3, "lon1": -157.8,
     "lat2": -17.5, "lon2": -149.4, "days": 29,
     "navigator": "Nainoa Thompson", "method": "Traditional only"},
    {"name": "Hawaii → NZ (1985)", "from": "Honolulu",
     "to": "Auckland", "lat1": 21.3, "lon1": -157.8,
     "lat2": -36.8, "lon2": 174.8, "days": 47,
     "navigator": "Nainoa Thompson", "method": "Traditional only"},
    {"name": "Hawaii → Rapa Nui (1999)", "from": "Honolulu",
     "to": "Easter Island", "lat1": 21.3, "lon1": -157.8,
     "lat2": -27.1, "lon2": -109.3, "days": 24,
     "navigator": "Nainoa Thompson", "method": "Traditional only"},
    {"name": "Worldwide voyage (2014-17)", "from": "Honolulu",
     "to": "Honolulu (circumnavigation)", "lat1": 21.3, "lon1": -157.8,
     "lat2": 21.3, "lon2": -157.8, "days": 1095,
     "navigator": "Multiple", "method": "Traditional + GPS backup"},
]

print("=== Hōkūleʻa Voyage Analysis ===\
")
print(f"{'Voyage':<35} {'Distance km':>12} {'Days':>5} {'km/day':>8} {'Navigator'}")
print("-" * 75)

total_km = 0
for v in voyages:
    if v["name"] == "Worldwide voyage (2014-17)":
        dist = 60000  # approximate circumnavigation
    else:
        dist = great_circle_distance(v["lat1"], v["lon1"], v["lat2"], v["lon2"])
    total_km += dist
    speed = dist / v["days"]
    print(f"{v['name']:<35} {dist:>10,.0f} {v['days']:>5} {speed:>6.0f} {v['navigator']}")

print(f"\
Total distance sailed: {total_km:,.0f} km")
print(f"Total voyages using traditional navigation: {len(voyages)}")
print(f"Navigation failures: 0")

# Accuracy analysis
print(f"\
=== Navigation Accuracy ===")
print(f"1976 voyage: Hawaii to Tahiti")

# Simulate the expected vs actual arrival
target_lat, target_lon = -17.5, -149.4
hawaii_lat, hawaii_lon = 21.3, -157.8
distance = great_circle_distance(hawaii_lat, hawaii_lon, target_lat, target_lon)

print(f"Target: Tahiti ({target_lat}°, {target_lon}°)")
print(f"Distance: {distance:.0f} km")
print(f"Actual landfall: within 50 km of target")
print(f"Navigation error: <1.3% of total distance")
print(f"\
For comparison:")

comparisons = [
    ("GPS", 0.001, "10 metres"),
    ("Modern sextant", 0.05, "2 km"),
    ("Hōkūleʻa (traditional)", 1.3, "50 km"),
    ("Random drift", 100, "Anywhere"),
]

print(f"{'Method':<28} {'Error %':>8} {'Accuracy'}")
print("-" * 48)
for name, error, accuracy in comparisons:
    print(f"{name:<28} {error:>6.2f}% {accuracy:>12}")

# Existence proof analysis
print(f"\
=== Existence Proof ===")
print(f"Before Hōkūleʻa (pre-1976):")
print(f"  Western theory: settlement was ACCIDENTAL (drift voyages)")
print(f"  Evidence: 'Primitive canoes can't navigate accurately'")
print(f"  Problem: cultural bias — judging by Western technology standards")
print(f"\
After Hōkūleʻa (1976+):")
print(f"  Proof: a canoe navigated 4,000 km by stars alone")
print(f"  240,000 km total over 40+ years, zero navigation failures")
print(f"  Circumnavigated the Earth using traditional methods")
print(f"  Result: accidental drift theory DISPROVEN")

# The cultural impact
print(f"\
=== Cultural Revival ===")
print(f"The Hōkūleʻa revived Hawaiian cultural identity:")
print(f"  Before: traditional navigation nearly extinct (Mau was among the last)")
print(f"  After: navigation schools established across Polynesia")
print(f"  Nainoa Thompson trained a new generation of navigators")
print(f"  Traditional canoe building revived in Hawaii, NZ, and Tahiti")
print(f"  The Hōkūleʻa became a symbol of indigenous scientific achievement")
print(f"\
'The star compass is not a simple tool. It is a worldview —")
print(f" a way of understanding your relationship to the Earth,")
print(f" the ocean, and the sky.' — Nainoa Thompson")`,
      challenge: 'Calculate the Hōkūleʻa\'s average speed in knots across all its voyages. How does this compare with a modern sailboat (~6-8 knots) and a cargo ship (~12-15 knots)? The traditional canoe is slower but completely self-sufficient — no fuel, no electronics, no external support.',
      successHint: 'You analyzed a scientific existence proof — one of the most powerful forms of evidence. The Hōkūleʻa didn\'t just support the theory of intentional Polynesian navigation — it PROVED it by demonstration. The same approach is used in engineering (build a prototype to prove the concept), medicine (clinical trials prove a treatment works), and mathematics (construct an example to prove a theorem).',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Navigation science and signal detection through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model star compasses, wave refraction, dead reckoning, search probability, genetic evidence, and the Hōkūleʻa voyages.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L1-${i + 1}`}
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
