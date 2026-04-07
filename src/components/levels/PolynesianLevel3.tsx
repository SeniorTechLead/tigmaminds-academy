import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PolynesianLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Full sky simulation — star positions for any date and location',
      concept: `A planetarium program computes the **altitude and azimuth of every visible star** from any location on Earth at any time. This requires combining several astronomical calculations into a single pipeline:

1. **Date to Julian Day Number** — a continuous day count used in astronomy (avoids calendar irregularities)
2. **Julian Day to Greenwich Sidereal Time** — the rotation angle of Earth relative to the stars
3. **Greenwich to Local Sidereal Time** — adjusted for the observer's longitude
4. **For each star: RA, Dec → Hour Angle → Altitude, Azimuth** — the coordinate transform from Level 2

The output is a complete snapshot of the sky: which stars are visible, how high they are, and in which direction. By computing this for multiple times, you can generate the full arc of each star across the sky — the motion pattern that navigators memorised.

This is not an approximation — with a good star catalogue and these equations, you can compute accurate star positions for any date within a few thousand years of the present.

📚 *The Julian Day Number starts at noon on January 1, 4713 BCE. Today's JD is approximately 2,460,410. This continuous count eliminates the complexity of leap years, calendar reforms, and time zones.*`,
      analogy: 'A planetarium projector has thousands of tiny holes representing stars. It rotates at sidereal rate (one turn per 23h 56m) and tilts to match your latitude. Our code does the same thing mathematically: given a star catalogue, a time, and a location, it calculates where every star appears in the sky.',
      storyConnection: 'Polynesian navigation schools (like the Tautai tradition in Samoa) trained students by having them lie on their backs in a canoe night after night, memorising the paths of stars across the sky. Our simulation generates exactly what they saw — the full sky from any Polynesian island at any time of year.',
      checkQuestion: 'Why do we need Julian Day Numbers? Why not just use calendar dates?',
      checkAnswer: 'Calendar dates are irregular: months have different lengths, February has 28 or 29 days, there were calendar reforms (the Gregorian switch skipped 10 days in 1582). Julian Day Numbers are a simple, continuous count of days — making time differences trivial to compute. Days between two dates = JD2 - JD1.',
      codeIntro: 'Build a complete sky simulator that computes all visible star positions for any date and location.',
      code: `import numpy as np

def date_to_jd(year, month, day, hour=0):
    """Convert calendar date to Julian Day Number."""
    if month <= 2:
        year -= 1
        month += 12
    A = int(year / 100)
    B = 2 - A + int(A / 4)
    jd = int(365.25 * (year + 4716)) + int(30.6001 * (month + 1)) + day + hour/24 + B - 1524.5
    return jd

def jd_to_gmst(jd):
    """Julian Day to Greenwich Mean Sidereal Time (hours)."""
    T = (jd - 2451545.0) / 36525.0
    gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + \
           0.000387933 * T**2 - T**3 / 38710000
    return (gmst / 15) % 24  # convert degrees to hours

def eq_to_horizon(ra_h, dec_deg, lat_deg, lst_h):
    """Equatorial to horizon coordinates."""
    ha = np.radians((lst_h - ra_h) * 15)
    dec = np.radians(dec_deg)
    lat = np.radians(lat_deg)
    sin_alt = np.sin(dec)*np.sin(lat) + np.cos(dec)*np.cos(lat)*np.cos(ha)
    alt = np.degrees(np.arcsin(np.clip(sin_alt, -1, 1)))
    cos_az = (np.sin(dec) - np.sin(np.radians(alt))*np.sin(lat)) / \
             (np.cos(np.radians(alt))*np.cos(lat) + 1e-12)
    az = np.degrees(np.arccos(np.clip(cos_az, -1, 1)))
    if np.sin(ha) > 0:
        az = 360 - az
    return alt, az

# Navigation star catalogue (name, RA hours, Dec degrees, magnitude)
catalogue = [
    ("Polaris",       2.53,  89.3, 2.0),
    ("Arcturus",     14.26,  19.2, 0.0),
    ("Sirius",        6.75, -16.7, -1.5),
    ("Canopus",       6.40, -52.7, -0.7),
    ("Spica",        13.42, -11.2, 1.0),
    ("Antares",      16.49, -26.4, 1.1),
    ("Vega",         18.62,  38.8, 0.0),
    ("Rigel",         5.24,  -8.2, 0.1),
    ("Betelgeuse",    5.92,   7.4, 0.4),
    ("Altair",       19.85,   8.9, 0.8),
    ("Aldebaran",     4.60,  16.5, 0.9),
    ("Fomalhaut",    22.96, -29.6, 1.2),
    ("Deneb",        20.69,  45.3, 1.3),
    ("Achernar",      1.63, -57.2, 0.5),
    ("Acrux",        12.44, -63.1, 0.8),
    ("Dubhe",        11.06,  61.8, 1.8),
    ("Procyon",       7.65,   5.2, 0.3),
    ("Capella",       5.28,  46.0, 0.1),
    ("Regulus",      10.14,  12.0, 1.4),
    ("Pollux",        7.76,  28.0, 1.1),
]

# Simulate the sky from Hawaii on March equinox at 10 PM
year, month, day, hour = 2024, 3, 20, 22
lat, lon = 20.0, -156.0  # Hawaii (Maui)

jd = date_to_jd(year, month, day, hour)
gmst = jd_to_gmst(jd)
lst = (gmst + lon / 15) % 24

print(f"=== Sky Simulation: {year}-{month:02d}-{day:02d} {hour}:00 ===")
print(f"Location: {lat}°N, {abs(lon)}°W (Hawaii)")
print(f"JD: {jd:.2f} | GMST: {gmst:.2f}h | LST: {lst:.2f}h\\\n")

visible = []
for name, ra, dec, mag in catalogue:
    alt, az = eq_to_horizon(ra, dec, lat, lst)
    if alt > 5:  # above horizon (with 5° buffer for refraction)
        visible.append((name, alt, az, mag))

visible.sort(key=lambda s: -s[1])  # sort by altitude (highest first)

print(f"{'Star':<16} {'Alt':>6} {'Az':>6} {'Mag':>5} {'Direction':>10}")
print("-" * 45)
dirs = [(0,"N"),(45,"NE"),(90,"E"),(135,"SE"),(180,"S"),(225,"SW"),(270,"W"),(315,"NW"),(360,"N")]

for name, alt, az, mag in visible:
    direction = min(dirs, key=lambda d: abs(d[0]-az))[1]
    print(f"{name:<16} {alt:>5.1f}° {az:>5.1f}° {mag:>4.1f} {direction:>10}")

print(f"\\\n{len(visible)} of {len(catalogue)} catalogue stars visible")
print(f"Brightest visible: {min(visible, key=lambda s: s[3])[0]}")
print(f"Highest visible: {visible[0][0]} at {visible[0][1]:.1f}°")`,
      challenge: 'Run the simulation for the same time from Tahiti (17.5°S, 149.5°W) and compare the visible stars. Which stars are visible from Hawaii but not Tahiti, and vice versa? This difference is what a navigator monitors during a north-south voyage — the changing star visibility tells them their latitude.',
      successHint: 'You built a planetarium engine — the same computation inside Stellarium, SkySafari, and every observatory\'s telescope control system. With a larger star catalogue (the Hipparcos catalogue has 118,000 stars), this code generates a complete, accurate sky view for any moment in history.',
    },
    {
      title: 'Bayesian position estimation — combining uncertain observations',
      concept: `A navigator in the open Pacific has no GPS. Every observation — a star altitude, a wave pattern, a current reading — is **uncertain**. The star altitude might be off by 1-2° due to horizon haze. The current estimate might be wrong by 20%. The wave pattern could be ambiguous.

**Bayesian estimation** is the mathematical framework for combining uncertain evidence into a best estimate. It starts with a **prior** (where you think you are) and updates it with each new **observation** (likelihood), producing a **posterior** (improved estimate):

**P(position | observation) ∝ P(observation | position) × P(position)**

Each observation narrows the probability distribution. A star altitude constrains you to a circle on Earth's surface. A wave bearing constrains you to a line. A current observation shifts your estimated drift. Combined, these overlapping constraints converge on a position estimate.

The key insight: **no single observation is reliable enough, but multiple independent observations, combined correctly, give excellent accuracy**. This is why navigators used every available signal — stars, waves, currents, birds, clouds — simultaneously.

📚 *Bayes' theorem (1763) is the foundation of modern statistical inference, machine learning, spam filtering, medical diagnosis, and autonomous navigation. It's the mathematically optimal way to update beliefs with evidence.*`,
      analogy: 'Imagine searching for a friend in a dark forest. You hear a shout from the east — they\'re somewhere in a wide arc to your east. Then you smell their campfire from the northeast — that narrows it further. Then you see a faint glow to the east-northeast. Each clue independently is vague, but combined, you can pinpoint their location. Bayesian estimation does this mathematically.',
      storyConnection: 'Polynesian navigators were natural Bayesians. They never relied on a single signal — they combined star bearings, wave feel, current observations, bird flight directions, and cloud patterns into a running estimate of position. When signals conflicted, they weighted the more reliable ones more heavily — exactly what Bayes\' theorem prescribes.',
      checkQuestion: 'A star observation suggests you\'re at latitude 15°N ± 2°. A wave pattern suggests 17°N ± 3°. What is the Bayesian combined estimate?',
      checkAnswer: 'The combined estimate is a weighted average, with weights inversely proportional to variance. Weight1 = 1/2² = 0.25, Weight2 = 1/3² = 0.111. Combined: (15×0.25 + 17×0.111)/(0.25+0.111) = (3.75+1.887)/0.361 = 15.6°N with uncertainty ≈ 1.66°. The more precise observation dominates.',
      codeIntro: 'Implement a Bayesian position estimator that combines multiple uncertain navigation observations.',
      code: `import numpy as np

np.random.seed(42)

class BayesianNavigator:
    """Bayesian position estimator for ocean navigation."""

    def __init__(self, prior_lat, prior_lon, prior_uncertainty_nm):
        """Start with a prior estimate of position."""
        self.lat = prior_lat
        self.lon = prior_lon
        self.uncertainty = prior_uncertainty_nm  # nautical miles
        self.history = [(prior_lat, prior_lon, prior_uncertainty_nm, "Prior")]

    def update_star(self, observed_lat, star_uncertainty_nm):
        """Update position from a star altitude observation.
        Star altitude constrains latitude (primarily)."""
        w_prior = 1 / self.uncertainty**2
        w_obs = 1 / star_uncertainty_nm**2
        self.lat = (self.lat * w_prior + observed_lat * w_obs) / (w_prior + w_obs)
        self.uncertainty = 1 / np.sqrt(w_prior + w_obs)
        self.history.append((self.lat, self.lon, self.uncertainty, "Star obs"))

    def update_wave(self, bearing_to_island_deg, bearing_uncertainty_deg,
                     island_lat, island_lon):
        """Update position from wave interference bearing."""
        # Bearing constrains longitude relative to island
        bearing_rad = np.radians(bearing_to_island_deg)
        dist_est = np.sqrt((self.lat - island_lat)**2 +
                            (self.lon - island_lon)**2) * 60
        # Lateral uncertainty from bearing error
        lateral_nm = dist_est * np.radians(bearing_uncertainty_deg)
        lon_correction = np.sin(bearing_rad) * lateral_nm / 60
        w_prior = 1 / self.uncertainty**2
        w_obs = 1 / lateral_nm**2
        self.lon = (self.lon * w_prior + (self.lon + lon_correction * 0.1) * w_obs) / (w_prior + w_obs)
        self.uncertainty = 1 / np.sqrt(w_prior + w_obs)
        self.history.append((self.lat, self.lon, self.uncertainty, "Wave obs"))

    def update_current(self, drift_east_nm, drift_north_nm, drift_uncertainty_nm):
        """Update position for estimated current drift."""
        self.lat += drift_north_nm / 60
        self.lon += drift_east_nm / (60 * np.cos(np.radians(self.lat)))
        # Drift adds uncertainty
        self.uncertainty = np.sqrt(self.uncertainty**2 + drift_uncertainty_nm**2)
        self.history.append((self.lat, self.lon, self.uncertainty, "Current drift"))

# Simulate a night of navigation
true_lat, true_lon = -5.2, -155.3  # true position (unknown to navigator)

# Navigator's prior estimate (from dead reckoning)
nav = BayesianNavigator(
    prior_lat=-4.5,    # 0.7° off in latitude
    prior_lon=-156.0,  # 0.7° off in longitude
    prior_uncertainty_nm=60  # very uncertain
)

print("=== Bayesian Navigation: One Night of Observations ===")
print(f"True position: {true_lat}°, {true_lon}°")
print(f"Initial estimate: {nav.lat:.1f}°, {nav.lon:.1f}° (±{nav.uncertainty:.0f} nm)\\\n")

# Observation 1: Star altitude (noisy measurement of latitude)
star_lat = true_lat + np.random.normal(0, 0.3)  # ±0.3° error
nav.update_star(star_lat, 20)

# Observation 2: Current drift correction
nav.update_current(-5, -3, 8)  # 5 nm west, 3 nm south

# Observation 3: Second star at different time
star_lat2 = true_lat + np.random.normal(0, 0.2)  # better seeing
nav.update_star(star_lat2, 12)

# Observation 4: Wave pattern bearing to island
nav.update_wave(bearing_to_island_deg=210, bearing_uncertainty_deg=10,
                island_lat=-8.0, island_lon=-154.0)

# Observation 5: Third star near dawn
star_lat3 = true_lat + np.random.normal(0, 0.15)
nav.update_star(star_lat3, 10)

# Print observation history
print(f"{'Step':<4} {'Event':<16} {'Lat':>8} {'Lon':>9} {'Uncertainty':>12}")
print("-" * 51)
for i, (lat, lon, unc, event) in enumerate(nav.history):
    err = np.sqrt((lat - true_lat)**2 + (lon - true_lon)**2) * 60
    print(f"{i:<4} {event:<16} {lat:>7.2f}° {lon:>8.2f}° {unc:>8.1f} nm  (err: {err:.0f} nm)")

print(f"\\\nFinal estimate: {nav.lat:.2f}°, {nav.lon:.2f}°")
print(f"True position:  {true_lat}°, {true_lon}°")
final_err = np.sqrt((nav.lat-true_lat)**2 + (nav.lon-true_lon)**2) * 60
print(f"Final error: {final_err:.0f} nm ({final_err*1.852:.0f} km)")
print(f"Uncertainty reduced: {nav.history[0][2]:.0f} nm → {nav.uncertainty:.0f} nm")`,
      challenge: 'Run the estimator with 10 star observations instead of 3. How does the uncertainty decrease with each additional observation? Plot (mentally or in code) uncertainty vs number of observations. You should see a 1/sqrt(N) relationship — the fundamental law of averaging.',
      successHint: 'You implemented Bayesian sensor fusion — the same algorithm used in GPS receivers (combining satellite signals), autonomous vehicles (combining LIDAR, cameras, and radar), and medical diagnosis (combining test results). The principle that multiple uncertain observations combine to give precise estimates is one of the most powerful ideas in all of applied mathematics.',
    },
    {
      title: 'Phylogenetic trees from linguistic data — tracing migration routes',
      concept: `Languages change over time — sounds shift, words are borrowed, grammar evolves. When a population splits (as when Polynesian voyagers colonise a new island), their language diverges. By measuring the **distance between languages**, we can reconstruct the family tree of related languages — a **phylogenetic tree**.

The method is borrowed from biology (where it traces species evolution from DNA). For languages, we use **cognate analysis**: comparing basic vocabulary across languages and counting shared word roots.

The **Swadesh list** is a standard set of 100-200 basic words (numbers, body parts, natural features) that are resistant to borrowing. The percentage of shared cognates between two languages estimates how long ago they diverged:

**t = -ln(C/C₀) / (2λ)**

Where C is the current cognate percentage, C₀ is the initial percentage (~100%), λ is the rate of lexical replacement (~0.14 per 1000 years for basic vocabulary), and t is the separation time in millennia.

📚 *Glottochronology (language dating) and lexicostatistics (language distance measurement) are controversial — replacement rates aren't perfectly constant. But combined with archaeology and genetics, they provide a third line of evidence for migration history.*`,
      analogy: 'Imagine a family that splits up and moves to different cities. Over generations, each branch develops its own slang, pronunciations, and expressions — but they all still share the core family vocabulary. By measuring how different each branch\'s speech has become, you can estimate when they separated and reconstruct the family tree. Language phylogenetics does this for entire populations.',
      storyConnection: 'The Austronesian language family — which includes all Polynesian languages — is one of the largest in the world (1,200+ languages). Linguistic analysis shows that this family originated in Taiwan around 3000 BCE, spread through Island Southeast Asia, and reached Polynesia by 1000 CE. The language tree matches the archaeological record of eastward island colonisation almost perfectly.',
      checkQuestion: 'Hawaiian and Maori share about 70% cognates on the Swadesh list. Hawaiian and Fijian share about 50%. Which pair separated more recently?',
      checkAnswer: 'Hawaiian and Maori (70% shared cognates) separated more recently than Hawaiian and Fijian (50%). Using the formula: t(Haw-Mao) = -ln(0.70)/(2×0.00014) ≈ 1,274 years. t(Haw-Fij) = -ln(0.50)/(2×0.00014) ≈ 2,477 years. This matches archaeology: Fiji was settled ~3,000 years ago; Hawaii and New Zealand ~800-1,000 years ago.',
      codeIntro: 'Build a phylogenetic tree from linguistic distance data for Polynesian and Austronesian languages.',
      code: `import numpy as np

def cognate_to_time(cognate_pct, rate=0.14):
    """Estimate divergence time from cognate percentage.
    Rate is per 1000 years (glottochronology)."""
    if cognate_pct >= 1.0:
        return 0
    if cognate_pct <= 0:
        return 10000  # cap at 10,000 years
    return -np.log(cognate_pct) / (2 * rate / 1000)

# Cognate percentages from Swadesh list comparisons
# (simplified but based on real linguistic data)
languages = ["Proto-Austronesian", "Malay", "Fijian", "Tongan",
             "Samoan", "Hawaiian", "Maori", "Rapanui", "Tahitian"]

# Pairwise cognate percentages (approximate)
cognates = {
    ("Malay", "Fijian"): 0.30,
    ("Malay", "Tongan"): 0.25,
    ("Fijian", "Tongan"): 0.55,
    ("Fijian", "Samoan"): 0.52,
    ("Tongan", "Samoan"): 0.72,
    ("Samoan", "Hawaiian"): 0.62,
    ("Samoan", "Maori"): 0.60,
    ("Samoan", "Tahitian"): 0.68,
    ("Hawaiian", "Tahitian"): 0.76,
    ("Hawaiian", "Maori"): 0.70,
    ("Hawaiian", "Rapanui"): 0.55,
    ("Maori", "Tahitian"): 0.72,
    ("Maori", "Rapanui"): 0.50,
    ("Tahitian", "Rapanui"): 0.58,
    ("Tongan", "Hawaiian"): 0.55,
    ("Tongan", "Maori"): 0.50,
}

print("=== Linguistic Distance Matrix (divergence time in years) ===\\\n")

poly_langs = ["Tongan", "Samoan", "Tahitian", "Hawaiian", "Maori", "Rapanui"]

header = f"{'':>12}" + "".join(f"{l[:6]:>8}" for l in poly_langs)
print(header)
print("-" * (12 + 8 * len(poly_langs)))

for l1 in poly_langs:
    row = f"{l1:>12}"
    for l2 in poly_langs:
        if l1 == l2:
            row += f"{'---':>8}"
        else:
            key = (l1, l2) if (l1, l2) in cognates else (l2, l1)
            if key in cognates:
                t = cognate_to_time(cognates[key])
                row += f"{t:>7.0f}y"
            else:
                row += f"{'?':>8}"
    print(row)

# Build a simple tree using UPGMA (Unweighted Pair Group Method)
print("\\\n=== Phylogenetic Tree (UPGMA clustering) ===\\\n")

# Find closest pairs iteratively
remaining = list(poly_langs)
clusters = {l: [l] for l in remaining}
merge_history = []

while len(remaining) > 1:
    best_dist = float('inf')
    best_pair = None
    for i in range(len(remaining)):
        for j in range(i+1, len(remaining)):
            l1, l2 = remaining[i], remaining[j]
            # Average distance between all members of each cluster
            dists = []
            for m1 in clusters[l1]:
                for m2 in clusters[l2]:
                    key = (m1, m2) if (m1, m2) in cognates else (m2, m1)
                    if key in cognates:
                        dists.append(cognate_to_time(cognates[key]))
            if dists and np.mean(dists) < best_dist:
                best_dist = np.mean(dists)
                best_pair = (l1, l2)

    if best_pair is None:
        break
    l1, l2 = best_pair
    new_name = f"({l1}+{l2})"
    clusters[new_name] = clusters[l1] + clusters[l2]
    merge_history.append((l1, l2, best_dist))
    remaining.remove(l1)
    remaining.remove(l2)
    remaining.append(new_name)

print("Merge order (earliest to most recent):")
for l1, l2, dist in sorted(merge_history, key=lambda x: -x[2]):
    print(f"  {dist:>5.0f} years ago: {l1} ←→ {l2}")

print("\\\nThis tree matches the archaeological migration sequence:")
print("  Tonga/Samoa (~3000 ya) → Tahiti/Marquesas (~1500 ya)")
print("  → Hawaii, NZ, Rapa Nui (~800-1000 ya)")`,
      challenge: 'Add Malay to the tree. It should branch off much earlier than the Polynesian languages (3,000-5,000 years ago). Does the tree correctly place Malay as an outgroup? This outgroup relationship confirms that Polynesian languages evolved from a western Austronesian ancestor — supporting the "out of Taiwan" migration theory.',
      successHint: 'You built a phylogenetic analysis tool using the same algorithms (UPGMA clustering, distance matrices) that biologists use to reconstruct evolutionary trees from DNA sequences. Linguistic phylogenetics and biological phylogenetics are mathematically identical — both trace divergence from common ancestors through accumulated changes.',
    },
    {
      title: 'Canoe hydrodynamics — hull resistance and sail forces',
      concept: `A Polynesian voyaging canoe (like Hōkūleʻa) is a **double-hulled catamaran** — two narrow hulls connected by a platform. This design is a masterpiece of hydrodynamic engineering:

**Hull resistance** has three main components:
1. **Friction drag**: water rubbing against the hull surface. Proportional to wetted area and speed squared: F_f = ½ρv²C_f A
2. **Wave-making drag**: energy lost creating the bow wave. Increases sharply near "hull speed": v_hull = 1.34 × √(L) knots (L in feet)
3. **Form drag**: pressure difference between bow and stern due to hull shape

**Sail forces** generate both forward drive and sideways force (heeling). The useful force is the component along the desired course. A crab-claw sail (traditional Polynesian design) is remarkably efficient at converting wind into forward drive, especially when sailing across the wind (reaching).

The key parameter is the **lift-to-drag ratio** of the sail — how much forward force you get per unit of sideways force. Higher L/D = better upwind performance.

📚 *Hull speed is not a hard limit but a practical one: above hull speed, wave drag increases dramatically and the hull "climbs" its own bow wave. Planing hulls can exceed hull speed; displacement hulls (like traditional canoes) generally cannot.*`,
      analogy: 'Imagine pushing a stick through water. A thin stick (narrow hull) meets little resistance. A wide paddle (blunt hull) meets a lot. The Polynesian double hull is two thin sticks — minimum resistance, maximum stability. The platform between them is above the water and adds no drag. It\'s the same principle as a racing bicycle with thin tyres vs a mountain bike with fat tyres.',
      storyConnection: 'Hōkūleʻa\'s hulls are 19 metres long and only 1 metre wide — a length-to-beam ratio of 19:1. This extreme narrowness minimises wave drag but would make a single hull unstable. The double-hull design solves both problems: low drag AND high stability. Modern racing catamarans use the same principle.',
      checkQuestion: 'Hōkūleʻa is 19 m (62 ft) long. What is her theoretical hull speed?',
      checkAnswer: 'v_hull = 1.34 × √62 = 1.34 × 7.87 = 10.5 knots. In practice, Hōkūleʻa typically sails at 4-8 knots — well below hull speed. This means she operates in the efficient part of the drag curve. Trying to exceed hull speed would require dramatically more wind force for diminishing speed gains.',
      codeIntro: 'Model canoe hull resistance and sail forces to calculate performance across different conditions.',
      code: `import numpy as np

def friction_drag(speed_kts, wetted_area_m2, length_m):
    """Frictional resistance using ITTC 1957 formula."""
    speed_ms = speed_kts * 0.5144
    if speed_ms < 0.01:
        return 0
    Re = speed_ms * length_m / 1.19e-6  # Reynolds number (seawater)
    Cf = 0.075 / (np.log10(Re) - 2)**2  # friction coefficient
    rho = 1025  # seawater density kg/m³
    return 0.5 * rho * speed_ms**2 * Cf * wetted_area_m2

def wave_drag(speed_kts, length_m, displacement_kg):
    """Wave-making resistance (simplified Michell integral)."""
    speed_ms = speed_kts * 0.5144
    Fn = speed_ms / np.sqrt(9.81 * length_m)  # Froude number
    # Wave drag increases sharply above Fn ≈ 0.35 (hull speed)
    Cw = 0.001 * np.exp(8 * (Fn - 0.35)) if Fn > 0.2 else 0
    return 0.5 * 1025 * speed_ms**2 * Cw * (displacement_kg / 1025)**(2/3)

def sail_force(wind_speed_kts, apparent_angle_deg, sail_area_m2):
    """Force generated by a crab-claw sail.
    Returns (drive_force, side_force) in Newtons."""
    wind_ms = wind_speed_kts * 0.5144
    angle_rad = np.radians(apparent_angle_deg)
    # Lift and drag coefficients for crab-claw sail
    Cl = 1.2 * np.sin(2 * angle_rad)  # lift coefficient
    Cd = 0.1 + 0.8 * np.sin(angle_rad)**2  # drag coefficient
    q = 0.5 * 1.225 * wind_ms**2  # dynamic pressure (air)
    lift = q * Cl * sail_area_m2
    drag = q * Cd * sail_area_m2
    # Resolve into drive (forward) and side (heeling) forces
    drive = lift * np.sin(angle_rad) - drag * np.cos(angle_rad)
    side = lift * np.cos(angle_rad) + drag * np.sin(angle_rad)
    return max(drive, 0), side

# Hōkūleʻa specifications
length = 19.0        # metres (hull length)
beam = 1.0           # metres (per hull)
draft = 0.9          # metres
displacement = 11000 # kg (loaded for voyage)
sail_area = 55       # m² (crab-claw sail)
wetted_area = 2 * length * (beam + 2 * draft) * 0.7  # two hulls

print("=== Hōkūleʻa Performance Analysis ===")
print(f"Length: {length}m | Displacement: {displacement}kg | Sail: {sail_area}m²\\\n")

# Hull speed
hull_speed = 1.34 * np.sqrt(length * 3.281)  # convert m to ft
print(f"Theoretical hull speed: {hull_speed:.1f} knots\\\n")

# Resistance vs speed
print("=== Total Hull Resistance ===")
print(f"{'Speed':>6} {'Friction':>10} {'Wave':>10} {'Total':>10} {'Power':>8}")
print("-" * 46)

for speed in np.arange(1, 12, 1):
    Ff = friction_drag(speed, wetted_area, length)
    Fw = wave_drag(speed, length, displacement)
    total = Ff + Fw
    power_kw = total * speed * 0.5144 / 1000
    marker = " ← hull speed" if abs(speed - hull_speed) < 0.5 else ""
    print(f"{speed:>5.0f}kt {Ff:>8.0f}N {Fw:>8.0f}N {total:>8.0f}N {power_kw:>6.1f}kW{marker}")

# Sail performance at different wind angles
print("\\\n=== Sail Performance (15 knot wind) ===")
print(f"{'Wind Angle':>11} {'Drive':>8} {'Side':>8} {'L/D':>6} {'Eq. Speed':>10}")
print("-" * 45)

for angle in range(30, 181, 15):
    drive, side = sail_force(15, angle, sail_area)
    ld = drive / (side + 1) if side > 0 else 0
    # Equilibrium speed: where drive = resistance
    eq_speed = 0
    for s in np.arange(0.5, 12, 0.1):
        resist = friction_drag(s, wetted_area, length) + wave_drag(s, length, displacement)
        if resist > drive:
            eq_speed = s - 0.1
            break
    point = " ← best VMG" if 50 < angle < 70 else ""
    print(f"{angle:>9}° {drive:>7.0f}N {side:>7.0f}N {ld:>5.1f} {eq_speed:>8.1f}kt{point}")`,
      challenge: 'Compare the crab-claw sail to a modern Bermuda rig (higher Cl at small angles, lower at broad angles). At which wind angles does the traditional design outperform the modern one? Traditional sails were optimised for trade-wind sailing (beam reach, ~90°) — they\'re not trying to sail upwind.',
      successHint: 'You applied naval architecture fundamentals — friction drag, wave drag, and sail aerodynamics. These same equations are used to design America\'s Cup racers, cargo ships, and submarines. The Polynesian double-hull design is so efficient that modern high-speed ferries and racing sailboats use the same catamaran concept.',
    },
    {
      title: 'Weather pattern prediction from cloud observations',
      concept: `Polynesian navigators predicted weather 12-48 hours in advance by observing **cloud types, wind shifts, swell changes, and sky colour**. This is not folklore — it's applied meteorology based on the physics of atmospheric pressure systems.

Key predictive signals:
- **High cirrus clouds** moving from the west: warm front approaching (rain in 12-24 hours)
- **Cumulonimbus towers**: convective instability (thunderstorms within hours)
- **Wind backing** (shifting counterclockwise): low pressure system approaching
- **Red sunset**: dust/dry air to the west (fair weather tomorrow)
- **Swell direction change**: distant storm has shifted the wave field

These observations can be formalised as a **naive Bayes classifier**: each observation provides evidence for or against certain weather outcomes. The combined probability of each outcome is the product of the individual likelihoods.

**P(storm) ∝ P(cirrus | storm) × P(wind_backing | storm) × P(swell_change | storm) × P(storm)**

📚 *Weather prediction from surface observations is a pattern recognition problem. Meteorologists call it "nowcasting" — forecasting the next 0-6 hours from what you can see right now, without models or satellites.*`,
      analogy: 'A doctor diagnoses illness from symptoms: fever + cough + fatigue = likely flu, not just a cold. Each symptom alone is ambiguous, but the combination is diagnostic. A navigator reads the sky the same way: cirrus + backing wind + falling barometer = approaching storm. Each sign alone could mean several things; together they point to one conclusion.',
      storyConnection: 'Polynesian voyagers had no radar, no satellite imagery, no barometer. Yet they predicted weather accurately enough to make 30-day crossings across the Pacific — one of the most weather-volatile oceans on Earth. Their ability to read clouds, wind, and swell was a life-or-death skill refined over hundreds of generations.',
      checkQuestion: 'You observe: (1) high cirrus from the west, (2) wind shifting counterclockwise, (3) long-period swell from the southwest. What weather is approaching?',
      checkAnswer: 'A low-pressure system (likely a warm front followed by a cold front) is approaching from the west/southwest. Expected sequence: increasing cloud cover (12h), steady rain (18-24h), wind shift and clearing (30-36h). The swell from the southwest confirms a distant storm in that direction generating large waves. A navigator would prepare for rough weather and adjust course.',
      codeIntro: 'Build a Bayesian weather predictor that combines cloud, wind, and wave observations.',
      code: `import numpy as np

class WeatherPredictor:
    """Naive Bayes weather classifier for ocean navigation."""

    def __init__(self):
        # Prior probabilities of each weather outcome
        self.priors = {
            "Fair":      0.50,
            "Light rain": 0.20,
            "Storm":     0.15,
            "Squall":    0.10,
            "Calm/doldrums": 0.05,
        }

        # Likelihood tables: P(observation | weather)
        self.likelihoods = {
            "cirrus_west": {
                "Fair": 0.1, "Light rain": 0.6, "Storm": 0.8, "Squall": 0.3, "Calm/doldrums": 0.05
            },
            "cumulus_towers": {
                "Fair": 0.2, "Light rain": 0.3, "Storm": 0.5, "Squall": 0.9, "Calm/doldrums": 0.05
            },
            "wind_backing": {
                "Fair": 0.1, "Light rain": 0.5, "Storm": 0.7, "Squall": 0.4, "Calm/doldrums": 0.1
            },
            "wind_steady": {
                "Fair": 0.8, "Light rain": 0.4, "Storm": 0.2, "Squall": 0.3, "Calm/doldrums": 0.6
            },
            "swell_change": {
                "Fair": 0.1, "Light rain": 0.3, "Storm": 0.8, "Squall": 0.6, "Calm/doldrums": 0.1
            },
            "red_sunset": {
                "Fair": 0.7, "Light rain": 0.2, "Storm": 0.05, "Squall": 0.1, "Calm/doldrums": 0.4
            },
            "green_flash": {
                "Fair": 0.8, "Light rain": 0.1, "Storm": 0.02, "Squall": 0.05, "Calm/doldrums": 0.5
            },
            "halo_moon": {
                "Fair": 0.05, "Light rain": 0.7, "Storm": 0.6, "Squall": 0.2, "Calm/doldrums": 0.05
            },
        }

    def predict(self, observations):
        """Compute posterior probabilities from a list of observations."""
        posteriors = {}
        for weather, prior in self.priors.items():
            log_prob = np.log(prior)
            for obs in observations:
                if obs in self.likelihoods:
                    log_prob += np.log(self.likelihoods[obs][weather])
            posteriors[weather] = log_prob

        # Convert from log space and normalise
        max_log = max(posteriors.values())
        for w in posteriors:
            posteriors[w] = np.exp(posteriors[w] - max_log)
        total = sum(posteriors.values())
        for w in posteriors:
            posteriors[w] /= total

        return posteriors

predictor = WeatherPredictor()

# Test scenarios
scenarios = [
    ("Evening: red sunset, steady wind",
     ["red_sunset", "wind_steady"]),
    ("Morning: cirrus from west, wind backing",
     ["cirrus_west", "wind_backing"]),
    ("Afternoon: towering cumulus, swell change, wind backing",
     ["cumulus_towers", "swell_change", "wind_backing"]),
    ("Night: moon halo, cirrus from west, swell change",
     ["halo_moon", "cirrus_west", "swell_change"]),
    ("Dawn: green flash, steady wind, red sunset (prev evening)",
     ["green_flash", "wind_steady", "red_sunset"]),
]

print("=== Bayesian Weather Predictor ===\\\n")

for desc, obs in scenarios:
    posteriors = predictor.predict(obs)
    prediction = max(posteriors, key=posteriors.get)
    confidence = posteriors[prediction] * 100

    print(f"Observations: {desc}")
    print(f"  Signals: {', '.join(obs)}")
    print(f"  Prediction: {prediction} ({confidence:.0f}% confidence)")

    # Show all probabilities
    for weather, prob in sorted(posteriors.items(), key=lambda x: -x[1]):
        bar = "#" * int(prob * 40)
        print(f"    {weather:<16} {prob:>5.1%} {bar}")
    print()

# How many observations are needed?
print("=== Confidence vs Number of Observations ===")
print("(Storm scenario: progressively adding evidence)\\\n")
storm_obs = ["cirrus_west", "wind_backing", "swell_change", "cumulus_towers", "halo_moon"]
for n in range(1, len(storm_obs) + 1):
    posteriors = predictor.predict(storm_obs[:n])
    storm_prob = posteriors.get("Storm", 0) * 100
    print(f"  {n} observation(s): Storm probability = {storm_prob:.0f}%  ({', '.join(storm_obs[:n])})")`,
      challenge: 'Add a "seasonal adjustment" — during trade wind season (May-September), fair weather is more likely (prior = 0.65) and storms less likely (prior = 0.08). During cyclone season (November-April), storms are more likely (prior = 0.25). How do the predictions change? This seasonal context is exactly what experienced navigators carried in their heads.',
      successHint: 'You built a naive Bayes classifier — the same algorithm used in spam filters, medical diagnosis systems, and recommendation engines. The key insight is that multiple weak signals, combined with Bayes\' theorem, produce strong predictions. Polynesian navigators were doing Bayesian inference centuries before Bayes was born.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Wayfinder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced simulation, Bayesian estimation, and systems modelling</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers sky simulation, Bayesian navigation, linguistic phylogenetics, canoe hydrodynamics, and weather prediction.
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
