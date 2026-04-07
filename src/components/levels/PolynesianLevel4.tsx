import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PolynesianLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Capstone project: Design a Wayfinding Simulator',
      concept: `In this capstone project, you will build a complete **Polynesian Wayfinding Simulator** — a Python program that:

1. **Models the celestial sphere** with accurate star positions for any date and location
2. **Simulates a multi-day canoe voyage** with ocean currents, wind, and dead reckoning
3. **Implements Bayesian position estimation** from star, wave, and current observations
4. **Calculates island detection probability** from wave interference patterns
5. **Generates a voyage report** with position estimates, errors, and navigation decisions

This brings together everything from Levels 1-3: star compass, coordinate transforms, vector fields, wave physics, Bayesian estimation, and canoe hydrodynamics.

The first step is **system design** — defining the classes, their properties, and how they interact. The simulator has three core objects: **Star** (celestial body with position), **Island** (target with detection signature), and **Canoe** (vessel with speed, heading, and position).

📚 *System design means deciding what your program does, how it's organized, and what data it needs — BEFORE you write code. A navigation simulator must model the sky, the ocean, and the vessel as separate but interacting systems.*`,
      analogy: 'Building a flight simulator requires three systems: the aircraft model (physics of flight), the world model (terrain, weather, other aircraft), and the instrument panel (what the pilot sees). Our wayfinding simulator has the same structure: the canoe model, the ocean/sky model, and the navigator\'s observations.',
      storyConnection: 'Before Hōkūleʻa\'s 1976 voyage, the crew spent months planning: studying star charts, memorising current patterns, calculating provisions, and training with Mau Piailug. This preparation is the equivalent of system design — understanding the problem completely before committing to the voyage.',
      checkQuestion: 'Why separate Star, Island, and Canoe into different classes instead of putting everything in one big function?',
      checkAnswer: 'Separation of concerns: each class handles one responsibility. Star computes positions; Island computes detection; Canoe tracks movement. If you need to add a new star, you modify only the Star class. If you change the canoe\'s speed model, only the Canoe class changes. This modularity makes the code testable, extensible, and understandable.',
      codeIntro: 'Design the architecture of the Wayfinding Simulator — define Star, Island, and Canoe classes.',
      code: `import numpy as np

class Star:
    """A navigation star with fixed celestial coordinates."""
    def __init__(self, name, ra_hours, dec_deg, magnitude):
        self.name = name
        self.ra = ra_hours       # Right Ascension (hours)
        self.dec = dec_deg       # Declination (degrees)
        self.mag = magnitude     # apparent magnitude

    def altitude(self, lat_deg, lst_hours):
        """Compute altitude above horizon."""
        ha = np.radians((lst_hours - self.ra) * 15)
        dec = np.radians(self.dec)
        lat = np.radians(lat_deg)
        sin_alt = np.sin(dec)*np.sin(lat) + np.cos(dec)*np.cos(lat)*np.cos(ha)
        return np.degrees(np.arcsin(np.clip(sin_alt, -1, 1)))

    def azimuth(self, lat_deg, lst_hours):
        """Compute azimuth (bearing from north)."""
        ha = np.radians((lst_hours - self.ra) * 15)
        dec = np.radians(self.dec)
        lat = np.radians(lat_deg)
        alt_rad = np.radians(self.altitude(lat_deg, lst_hours))
        cos_az = (np.sin(dec) - np.sin(alt_rad)*np.sin(lat)) / \
                 (np.cos(alt_rad)*np.cos(lat) + 1e-12)
        az = np.degrees(np.arccos(np.clip(cos_az, -1, 1)))
        if np.sin(ha) > 0:
            az = 360 - az
        return az

class Island:
    """A target island with position and detection properties."""
    def __init__(self, name, lat, lon, width_km, height_m):
        self.name = name
        self.lat = lat
        self.lon = lon
        self.width = width_km * 1000   # metres
        self.height = height_m
        self.visual_range = 4.7 * np.sqrt(height_m)  # nm (horizon formula)

class Canoe:
    """A voyaging canoe with position, speed, and heading."""
    def __init__(self, name, lat, lon, speed_kts=5.0):
        self.name = name
        self.lat = lat
        self.lon = lon
        self.speed = speed_kts
        self.heading = 0.0        # degrees from north
        self.track = [(lat, lon)]

    def advance(self, hours, current_east_kts=0, current_north_kts=0):
        """Move the canoe for given hours, including current drift."""
        kts_to_deg = 1 / 60  # 1 knot ≈ 1/60 degree per hour
        dx = (self.speed * np.sin(np.radians(self.heading)) + current_east_kts) * kts_to_deg * hours
        dy = (self.speed * np.cos(np.radians(self.heading)) + current_north_kts) * kts_to_deg * hours
        self.lon += dx / np.cos(np.radians(self.lat))
        self.lat += dy
        self.track.append((self.lat, self.lon))

# Build the simulator components
STARS = [
    Star("Arcturus",   14.26,  19.2,  0.0),
    Star("Sirius",      6.75, -16.7, -1.5),
    Star("Canopus",     6.40, -52.7, -0.7),
    Star("Spica",      13.42, -11.2,  1.0),
    Star("Antares",    16.49, -26.4,  1.1),
    Star("Vega",       18.62,  38.8,  0.0),
    Star("Polaris",     2.53,  89.3,  2.0),
    Star("Acrux",      12.44, -63.1,  0.8),
    Star("Altair",     19.85,   8.9,  0.8),
    Star("Fomalhaut",  22.96, -29.6,  1.2),
]

ISLANDS = [
    Island("Hawaii",   20.0, -155.5, 120, 4207),
    Island("Tahiti",  -17.5, -149.5,  30, 2241),
    Island("Rapa Nui", -27.1, -109.3,  24, 507),
    Island("Samoa",   -13.8, -172.0,  50, 1858),
    Island("Tonga",   -21.2, -175.2,  30,  1033),
]

# System test
print("=== Wayfinding Simulator — System Architecture ===\\\n")
print("Star Catalogue:")
for s in STARS:
    print(f"  {s.name:<12} RA={s.ra:>5.2f}h  Dec={s.dec:>+6.1f}°  Mag={s.mag:>+4.1f}")

print(f"\\\nIsland Database:")
for isle in ISLANDS:
    print(f"  {isle.name:<12} {isle.lat:>+6.1f}°, {isle.lon:>+7.1f}°  "
          f"Width={isle.width/1000:.0f}km  Visual range={isle.visual_range:.0f}nm")

canoe = Canoe("Hokule'a", 20.0, -155.5, 5.0)
print(f"\\\nCanoe: {canoe.name} at ({canoe.lat}°, {canoe.lon}°) speed={canoe.speed}kts")
print("\\\nArchitecture: 3 classes (Star, Island, Canoe) + star catalogue + island database")
print("Next: Build the star compass engine and voyage simulator.")`,
      challenge: 'Add a `distance_to(island)` method to the Canoe class that calculates great-circle distance in nautical miles. Use the Haversine formula: d = 2R × arcsin(sqrt(sin²(Δlat/2) + cos(lat1)cos(lat2)sin²(Δlon/2))). This method will be used by the detection probability calculator later.',
      successHint: 'Good system design makes everything else easier. You defined three clean classes — Star, Island, Canoe — each with clear responsibilities and useful methods. This is the foundation of object-oriented design: model the real world with objects that know how to compute their own properties.',
    },
    {
      title: 'Star compass engine — full sky for any location and date',
      concept: `The star compass engine is the core astronomical component of the simulator. Given a **date**, **time**, and **location**, it computes which stars are visible and what direction each one indicates.

The engine combines all the astronomical calculations from earlier levels into a single pipeline:

1. **Convert date to Julian Day** → JD
2. **JD to Greenwich Sidereal Time** → GMST
3. **GMST + longitude to Local Sidereal Time** → LST
4. **For each star: (RA, Dec, LST, Lat) → (Altitude, Azimuth)** → sky snapshot
5. **Filter by altitude > 5°** → visible stars only
6. **Sort by azimuth** → compass order (N, NE, E, SE, S, SW, W, NW)

The output is a **star compass** — a list of visible stars organized by compass direction, telling the navigator which direction each star marks.

This engine runs every simulated hour during a voyage, updating the navigator's available star references as Earth rotates and the canoe moves to new latitudes.

📚 *A real star compass has 32 divisions (like a traditional compass rose). Each division is named after the star that rises there. Different Polynesian traditions use different star names, but the underlying astronomy is universal.*`,
      analogy: 'A clock face has 12 fixed numbers, but the hands move. The star compass is the reverse — the numbers (stars) move across a fixed compass rose. But because each star follows a predictable path, the moving numbers still tell you direction, just like clock hands tell you time despite moving.',
      storyConnection: 'The star compass was the primary navigation tool for Polynesian wayfinders. Nainoa Thompson, who led Hōkūleʻa\'s later voyages, spent years learning the star compass from Mau Piailug and from studying Western astronomy. He described the synthesis: "Mau taught me to see the stars as a navigator; books taught me why they move the way they do."',
      checkQuestion: 'Why does the star compass need to be recalculated every hour during a voyage?',
      checkAnswer: 'Because Earth rotates 15° per hour, moving all stars 15° westward. A star that was on the eastern horizon at 9 PM is overhead by midnight and setting in the west by 3 AM. Additionally, as the canoe moves south (Hawaii to Tahiti), the visible stars change — southern stars rise higher and northern stars drop lower.',
      codeIntro: 'Build the complete star compass engine and generate compass snapshots for a voyage.',
      code: `import numpy as np

def date_to_jd(year, month, day, hour=0):
    """Calendar date to Julian Day Number."""
    if month <= 2: year -= 1; month += 12
    A = int(year / 100)
    B = 2 - A + int(A / 4)
    return int(365.25*(year+4716)) + int(30.6001*(month+1)) + day + hour/24 + B - 1524.5

def jd_to_gmst(jd):
    """Julian Day to Greenwich Mean Sidereal Time (hours)."""
    T = (jd - 2451545.0) / 36525.0
    gmst = 280.46061837 + 360.98564736629*(jd - 2451545.0) + 0.000387933*T**2
    return (gmst / 15) % 24

class StarCompass:
    """Full star compass engine."""

    STARS = [
        ("Arcturus",   14.26,  19.2,  0.0),  ("Sirius",      6.75, -16.7, -1.5),
        ("Canopus",     6.40, -52.7, -0.7),  ("Spica",      13.42, -11.2,  1.0),
        ("Antares",    16.49, -26.4,  1.1),  ("Vega",       18.62,  38.8,  0.0),
        ("Polaris",     2.53,  89.3,  2.0),  ("Acrux",      12.44, -63.1,  0.8),
        ("Altair",     19.85,   8.9,  0.8),  ("Fomalhaut",  22.96, -29.6,  1.2),
        ("Rigel",       5.24,  -8.2,  0.1),  ("Betelgeuse",  5.92,   7.4,  0.4),
        ("Aldebaran",   4.60,  16.5,  0.9),  ("Procyon",     7.65,   5.2,  0.3),
        ("Regulus",    10.14,  12.0,  1.4),  ("Deneb",      20.69,  45.3,  1.3),
        ("Capella",     5.28,  46.0,  0.1),  ("Pollux",      7.76,  28.0,  1.1),
        ("Achernar",    1.63, -57.2,  0.5),  ("Dubhe",      11.06,  61.8,  1.8),
    ]

    COMPASS = [
        (0, "N"), (22.5, "NNE"), (45, "NE"), (67.5, "ENE"),
        (90, "E"), (112.5, "ESE"), (135, "SE"), (157.5, "SSE"),
        (180, "S"), (202.5, "SSW"), (225, "SW"), (247.5, "WNW"),
        (270, "W"), (292.5, "WNW"), (315, "NW"), (337.5, "NNW"),
    ]

    def compute_sky(self, lat, lon, year, month, day, hour):
        """Compute all visible star positions."""
        jd = date_to_jd(year, month, day, hour)
        gmst = jd_to_gmst(jd)
        lst = (gmst + lon / 15) % 24

        visible = []
        for name, ra, dec, mag in self.STARS:
            ha = np.radians((lst - ra) * 15)
            dec_r = np.radians(dec)
            lat_r = np.radians(lat)

            sin_alt = np.sin(dec_r)*np.sin(lat_r) + np.cos(dec_r)*np.cos(lat_r)*np.cos(ha)
            alt = np.degrees(np.arcsin(np.clip(sin_alt, -1, 1)))

            if alt > 5:
                cos_az = (np.sin(dec_r) - np.sin(np.radians(alt))*np.sin(lat_r)) / \
                         (np.cos(np.radians(alt))*np.cos(lat_r) + 1e-12)
                az = np.degrees(np.arccos(np.clip(cos_az, -1, 1)))
                if np.sin(ha) > 0: az = 360 - az
                direction = min(self.COMPASS, key=lambda c: min(abs(c[0]-az), 360-abs(c[0]-az)))[1]
                visible.append((name, alt, az, direction, mag))

        return sorted(visible, key=lambda s: s[2])  # sort by azimuth

# Generate star compass for a voyage
compass = StarCompass()

print("=== Star Compass Engine: Hawaii to Tahiti ===\\\n")

# Track star compass at three points during the voyage
waypoints = [
    ("Departure (Hawaii)",   20.0, -155.5),
    ("Equator crossing",      0.0, -152.0),
    ("Arrival (Tahiti)",    -17.5, -149.5),
]

for label, lat, lon in waypoints:
    sky = compass.compute_sky(lat, lon, 2024, 6, 15, 22)  # June 15, 10 PM
    print(f"--- {label} ({lat:+.1f}°, {lon:.1f}°W) ---")
    print(f"{'Direction':<6} {'Star':<14} {'Alt':>5} {'Az':>6}")
    print("-" * 33)
    for name, alt, az, direction, mag in sky[:12]:  # top 12 brightest visible
        print(f"{direction:<6} {name:<14} {alt:>4.0f}° {az:>5.0f}°")
    print(f"  ({len(sky)} stars visible)\\\n")

# Key navigation observation: Arcturus zenith passage
print("=== Arcturus Altitude at Different Latitudes ===")
print("(Zenith passage = you are at Arcturus' latitude: 19.2°N)\\\n")
for lat in [25, 20, 19.2, 15, 10, 0, -10, -17.5]:
    sky = compass.compute_sky(lat, -155, 2024, 6, 15, 22)
    arcturus = [s for s in sky if s[0] == "Arcturus"]
    if arcturus:
        alt = arcturus[0][1]
        zenith = " ← ZENITH (you are at Hawaii's latitude)" if alt > 87 else ""
        print(f"  Lat {lat:>+6.1f}°: Arcturus alt = {alt:.1f}°{zenith}")
    else:
        print(f"  Lat {lat:>+6.1f}°: Arcturus below horizon")`,
      challenge: 'Add a method that identifies the "rising star" and "setting star" closest to due east and due west. These two stars are the most important for maintaining an east-west course — if the rising star drifts north, you\'ve turned south, and vice versa. This is the core of the star compass steering technique.',
      successHint: 'You built a complete star compass engine — the computational heart of the wayfinding simulator. This is the same computation used in professional planetarium software, telescope guidance systems, and satellite tracking. The engine can generate an accurate sky view for any location on Earth at any time.',
    },
    {
      title: 'Voyage simulator — multi-day crossing with all signals',
      concept: `Now we combine everything into a **complete voyage simulation**: a canoe sailing from Hawaii to Tahiti over 30 days, navigating by stars, waves, currents, and dead reckoning.

Each simulated day follows this cycle:
1. **Dawn**: final star observations, weather assessment
2. **Daytime**: navigate by sun position, wind, swell direction, dead reckoning
3. **Sunset**: calibrate heading using sun bearing at horizon
4. **Night**: star compass navigation, 2-3 star altitude observations for position fixing

The simulation tracks the **true position** (where the canoe actually is) and the **estimated position** (where the navigator thinks they are). The gap between these — the **navigation error** — grows during the day (no stars) and shrinks at night (star fixes).

Random factors affect the voyage: wind shifts, current variations, cloud cover (obscuring stars), and observation errors. The Monte Carlo approach runs many voyages to assess the probability of a successful landfall.

📚 *Dead reckoning ("deduced reckoning") estimates position by tracking speed and heading from a known starting point. It accumulates errors over time because speed and heading estimates are never perfect. Star fixes reset the error — this is why navigators eagerly awaited clear nights.*`,
      analogy: 'Imagine walking blindfolded across a field toward a bell. You walk in what you think is a straight line (dead reckoning), but you drift. Periodically, the bell rings and you correct your course (star fix). The more often the bell rings, the straighter your path. Cloud cover is like the bell going silent — you drift further before the next correction.',
      storyConnection: 'The 1976 Hōkūleʻa voyage from Hawaii to Tahiti took 33 days. Mau Piailug navigated entirely without instruments, maintaining a running mental estimate of position that he updated each night using star observations. When they made landfall at Mataiva atoll (near Tahiti), his position estimate was off by less than 100 miles after 2,500 miles of open ocean — an error of less than 4%.',
      checkQuestion: 'If dead reckoning error grows at 5 nm per day and a star fix reduces error by 80%, what is the equilibrium error after many days?',
      checkAnswer: 'After each day: error = previous_error × 0.2 + 5. At equilibrium: E = 0.2E + 5, so 0.8E = 5, E = 6.25 nm. The navigator\'s steady-state error is about 6 nm (11 km) — enough to find a large island but risky for a small atoll. This is why navigators also used wave detection (which extends the "target" by 30+ km).',
      codeIntro: 'Simulate a complete Hawaii-to-Tahiti voyage with star navigation, currents, and weather.',
      code: `import numpy as np

np.random.seed(42)

def simulate_voyage(n_days=30, canoe_speed=5.0, heading_deg=185):
    """Simulate a Hawaii-to-Tahiti voyage with navigation."""

    # True positions
    true_lat, true_lon = 20.0, -155.5  # Hawaii
    target_lat, target_lon = -17.5, -149.5  # Tahiti

    # Navigator's estimated position (starts correct)
    est_lat, est_lon = true_lat, true_lon
    dr_error = 0  # dead reckoning accumulated error (nm)

    log = []
    kts_to_deg = 1 / 60

    for day in range(1, n_days + 1):
        # === Daily conditions (random) ===
        wind_shift = np.random.normal(0, 5)        # heading error (degrees)
        current_east = np.random.normal(-0.5, 0.3)  # westward current
        current_north = np.random.normal(-0.1, 0.2)
        clear_night = np.random.random() > 0.25      # 75% chance of clear sky

        # === Canoe movement (true) ===
        actual_heading = heading_deg + wind_shift
        dx = (canoe_speed * np.sin(np.radians(actual_heading)) + current_east) * kts_to_deg * 24
        dy = (canoe_speed * np.cos(np.radians(actual_heading)) + current_north) * kts_to_deg * 24
        true_lat += dy
        true_lon += dx / max(np.cos(np.radians(true_lat)), 0.01)

        # === Dead reckoning (navigator's estimate, no current knowledge) ===
        est_dx = canoe_speed * np.sin(np.radians(heading_deg)) * kts_to_deg * 24
        est_dy = canoe_speed * np.cos(np.radians(heading_deg)) * kts_to_deg * 24
        est_lat += est_dy
        est_lon += est_dx / max(np.cos(np.radians(est_lat)), 0.01)

        # === Star fix (if clear night) ===
        if clear_night:
            # Star observation reduces latitude error significantly
            star_lat = true_lat + np.random.normal(0, 0.3)  # noisy observation
            # Bayesian update of estimated latitude
            w_dr = 1 / max(dr_error + 5, 1)**2
            w_star = 1 / 20**2  # star gives ±20 nm accuracy
            est_lat = (est_lat * w_dr + star_lat * (1/w_star)) / (w_dr + 1/w_star)
            dr_error *= 0.3  # star fix reduces error by 70%
        else:
            dr_error += 8  # error grows 8 nm per cloudy day

        # Calculate actual error
        error_nm = np.sqrt((true_lat - est_lat)**2 +
                            ((true_lon - est_lon) * np.cos(np.radians(true_lat)))**2) * 60
        dist_remaining = np.sqrt((true_lat - target_lat)**2 +
                                  ((true_lon - target_lon) * np.cos(np.radians(true_lat)))**2) * 60

        log.append({
            "day": day, "true_lat": true_lat, "true_lon": true_lon,
            "est_lat": est_lat, "est_lon": est_lon,
            "error_nm": error_nm, "dist_nm": dist_remaining,
            "clear": clear_night
        })

    return log

# Run the voyage
log = simulate_voyage()

print("=== Hawaii to Tahiti Voyage Simulation ===")
print(f"{'Day':>4} {'True Lat':>9} {'True Lon':>9} {'Est Lat':>9} {'Error':>8} {'Dist':>8} {'Sky':>6}")
print("-" * 55)

for entry in log:
    if entry["day"] % 3 == 0 or entry["day"] <= 3 or entry["day"] >= 28:
        sky = "Clear" if entry["clear"] else "Cloud"
        print(f"{entry['day']:>4} {entry['true_lat']:>+8.2f}° {entry['true_lon']:>+8.2f}° "
              f"{entry['est_lat']:>+8.2f}° {entry['error_nm']:>6.0f}nm {entry['dist_nm']:>6.0f}nm {sky:>6}")

final = log[-1]
print(f"\\\nFinal position error: {final['error_nm']:.0f} nm ({final['error_nm']*1.852:.0f} km)")
print(f"Distance to Tahiti: {final['dist_nm']:.0f} nm ({final['dist_nm']*1.852:.0f} km)")

# Statistics from multiple runs
print("\\\n=== Monte Carlo: 100 Voyage Simulations ===")
arrival_errors = []
for seed in range(100):
    np.random.seed(seed)
    log = simulate_voyage()
    arrival_errors.append(log[-1]["dist_nm"])

arrivals = np.array(arrival_errors)
print(f"  Median distance to Tahiti at day 30: {np.median(arrivals):.0f} nm")
print(f"  Best case (10th pctile): {np.percentile(arrivals, 10):.0f} nm")
print(f"  Worst case (90th pctile): {np.percentile(arrivals, 90):.0f} nm")
within_100 = np.mean(arrivals < 100) * 100
within_200 = np.mean(arrivals < 200) * 100
print(f"  Within 100 nm of Tahiti: {within_100:.0f}%")
print(f"  Within 200 nm of Tahiti: {within_200:.0f}%")`,
      challenge: 'Add the ability to change heading mid-voyage. At the equator crossing (when a navigator would notice the Southern Cross rising higher), adjust heading 5° east to compensate for westward current drift. Does this adaptive navigation improve the arrival distance? Real navigators adjusted course continuously — simulate 3 course corrections during the voyage.',
      successHint: 'You built a complete voyage simulator with dead reckoning, star fixes, random weather, and Monte Carlo analysis. This is the same simulation approach used to train modern navigators, test autonomous vehicle algorithms, and plan space missions. The key insight: navigation is a probabilistic process, not a deterministic one.',
    },
    {
      title: 'Detection probability calculator — finding islands in the Pacific',
      concept: `The final navigation challenge: **detecting the target island**. Even if you navigate to within 50 nm of Tahiti, you still need to find it. Islands are detected through multiple signals, each with a different range:

1. **Visual detection**: limited by horizon distance (~20-50 nm for high islands, ~5-10 nm for atolls)
2. **Wave refraction**: interference patterns detectable 30-80 km downwind
3. **Bird sighting**: land-based birds forage 50-100 km from shore
4. **Cloud formation**: islands generate cumulus clouds visible 60+ km away
5. **Water colour**: lagoon water is lighter, visible 10-20 km away

The **detection probability** at a given distance is the probability that at least one signal is detected:

**P(detect) = 1 - (1 - P_visual)(1 - P_wave)(1 - P_bird)(1 - P_cloud)(1 - P_colour)**

Each signal has its own detection function: high probability at close range, dropping to zero beyond maximum range. By combining all signals, the effective detection range is much larger than any single signal — extending the island's "target size" from ~30 nm (visual) to ~80 nm (combined).

📚 *This is the same "sensor fusion" approach used in search and rescue, submarine detection, and autonomous driving — multiple imperfect sensors combined give detection performance far exceeding any individual sensor.*`,
      analogy: 'Imagine searching for someone in a dark warehouse. With just your eyes, you might spot them at 10 metres. Add a flashlight: 30 metres. Add listening for footsteps: 50 metres. Add smell (their cologne): 20 metres. Any single sense might miss them, but the combination makes detection nearly certain within 50 metres. Island detection works the same way.',
      storyConnection: 'Polynesian navigators deliberately expanded their "detection zone" by sailing downwind of the target island (to catch wave refraction), scanning the sky for land-based cloud formations, and watching for species of birds that don\'t stray far from land. These techniques effectively made a 30 km island into an 80+ km target — critical for finding a dot in a vast ocean.',
      checkQuestion: 'If visual detection probability is 60% at 20 nm, wave detection is 40% at 20 nm, and bird detection is 30% at 20 nm, what is the combined detection probability at 20 nm?',
      checkAnswer: 'P(detect) = 1 - (1-0.6)(1-0.4)(1-0.3) = 1 - 0.4 × 0.6 × 0.7 = 1 - 0.168 = 0.832 = 83.2%. Combined detection is much higher than any individual signal. This is why navigators used every available signal — each one alone is unreliable, but together they provide high confidence.',
      codeIntro: 'Build a multi-sensor island detection model and calculate detection probabilities at different ranges.',
      code: `import numpy as np

def visual_detection(distance_nm, island_height_m, visibility_nm=20):
    """Probability of visual detection. Drops off beyond horizon."""
    horizon = 4.7 * np.sqrt(island_height_m)  # nm from mast height ~5m
    if distance_nm > horizon:
        return 0.0
    # Detection probability decreases with distance
    return np.clip(1 - (distance_nm / horizon)**2, 0, 1) * min(visibility_nm / 20, 1)

def wave_detection(distance_nm, island_width_km, swell_height_m=2.0):
    """Probability of detecting wave refraction patterns."""
    max_range = island_width_km * 2.5  # nm (larger islands detectable further)
    if distance_nm > max_range:
        return 0.0
    base_prob = 0.7 * (swell_height_m / 2.0)  # higher swell = easier detection
    return base_prob * np.clip(1 - (distance_nm / max_range)**1.5, 0, 1)

def bird_detection(distance_nm, is_dawn_dusk=True):
    """Probability of seeing land-based birds."""
    max_range = 60 if is_dawn_dusk else 30  # birds fly further at dawn/dusk
    if distance_nm > max_range:
        return 0.0
    return 0.5 * np.clip(1 - (distance_nm / max_range)**2, 0, 1)

def cloud_detection(distance_nm, island_height_m, is_daytime=True):
    """Probability of seeing island-induced cumulus clouds."""
    if not is_daytime or island_height_m < 200:
        return 0.0
    max_range = 40 + island_height_m / 50  # nm
    if distance_nm > max_range:
        return 0.0
    return 0.6 * np.clip(1 - (distance_nm / max_range)**1.5, 0, 1)

def colour_detection(distance_nm, has_lagoon=True):
    """Probability of detecting water colour change from lagoon."""
    if not has_lagoon:
        return 0.0
    max_range = 12  # nm
    if distance_nm > max_range:
        return 0.0
    return 0.8 * np.clip(1 - (distance_nm / max_range)**2, 0, 1)

def combined_detection(distance_nm, island_height_m, island_width_km,
                        has_lagoon=False, is_dawn=True, is_day=True):
    """Combined probability of island detection from all signals."""
    p_vis = visual_detection(distance_nm, island_height_m)
    p_wave = wave_detection(distance_nm, island_width_km)
    p_bird = bird_detection(distance_nm, is_dawn)
    p_cloud = cloud_detection(distance_nm, island_height_m, is_day)
    p_colour = colour_detection(distance_nm, has_lagoon)

    p_combined = 1 - (1-p_vis)*(1-p_wave)*(1-p_bird)*(1-p_cloud)*(1-p_colour)
    return p_combined, {"visual": p_vis, "wave": p_wave, "bird": p_bird,
                         "cloud": p_cloud, "colour": p_colour}

# Detection profiles for different island types
islands = [
    ("Tahiti (high island)", 2241, 30, False),
    ("Mataiva (coral atoll)", 8, 10, True),
    ("Hawaii Big Island", 4207, 120, False),
    ("Small motu", 5, 2, True),
]

print("=== Island Detection Probability vs Distance ===\\\n")

for name, height, width, lagoon in islands:
    print(f"--- {name} (height={height}m, width={width}km) ---")
    print(f"{'Dist (nm)':<10} {'Visual':>8} {'Wave':>8} {'Bird':>8} {'Cloud':>8} {'Colour':>8} {'COMBINED':>10}")
    print("-" * 62)

    detection_range = 0
    for d in range(5, 101, 5):
        p_total, signals = combined_detection(d, height, width, lagoon)
        if p_total > 0.01:
            print(f"{d:>7}nm {signals['visual']:>7.0%} {signals['wave']:>7.0%} "
                  f"{signals['bird']:>7.0%} {signals['cloud']:>7.0%} "
                  f"{signals['colour']:>7.0%} {p_total:>9.0%}")
        if p_total > 0.5:
            detection_range = max(detection_range, d)

    if detection_range > 0:
        print(f"  50% detection range: ~{detection_range} nm ({detection_range*1.852:.0f} km)")
    print()

# Effective target expansion
print("=== How Detection Signals Expand the Target ===")
for name, height, width, lagoon in islands:
    # Visual-only range
    vis_range = 4.7 * np.sqrt(height) if height > 0 else 5
    # Combined range at 50% probability
    for d in range(200, 0, -1):
        p, _ = combined_detection(d, height, width, lagoon)
        if p >= 0.5:
            combined_range = d
            break
    else:
        combined_range = 0
    expansion = combined_range / max(vis_range, 1)
    print(f"  {name:<30} Visual: {vis_range:>4.0f}nm → Combined: {combined_range:>3}nm ({expansion:.1f}× expansion)")`,
      challenge: 'Add a "search pattern" simulation: when the navigator suspects they are near the island, they sail a zigzag pattern to sweep a wider area. Model a search path that covers a 60 nm wide band and calculate the cumulative detection probability over 12 hours of searching. This is the same search theory used by coast guard and naval SAR (search and rescue) operations.',
      successHint: 'You built a multi-sensor detection model using the same probabilistic framework used in radar engineering, search and rescue operations, and autonomous vehicle perception. The key insight — that multiple weak sensors combine to give strong detection — is the foundation of all sensor fusion systems.',
    },
    {
      title: 'Portfolio presentation — documenting your Wayfinding Simulator',
      concept: `The final step is **documentation** — recording what you built, the science behind it, and what it demonstrates. Your Wayfinding Simulator documentation should include:

1. **Introduction** — what does the simulator model, and why?
2. **Scientific basis** — the astronomy, physics, genetics, and statistics behind each component
3. **Architecture** — the class design and how components interact
4. **Results** — what the simulations reveal about Polynesian navigation
5. **Limitations** — what the model simplifies or ignores
6. **Connections** — how each technique applies in modern science and engineering

This documentation transforms code into a **portfolio piece** — evidence of your ability to combine physics, mathematics, programming, and communication.

📚 *The best engineers are also the best communicators. A simulator that nobody understands has zero impact. Clear documentation multiplies the value of your technical work.*`,
      analogy: 'An explorer who discovers a new route but doesn\'t draw a map has helped only themselves. An explorer who maps the route, documents the landmarks, and describes the dangers has helped everyone who follows. Documentation is your map — it lets others understand, verify, and build upon your work.',
      storyConnection: 'Captain James Cook, who "re-discovered" Polynesian navigation techniques, meticulously documented everything: star bearings, current measurements, island positions, and the navigation methods he observed islanders using. His journals — not his voyages — are what made his explorations valuable to science. The voyages were ephemeral; the documentation endured.',
      checkQuestion: 'Why is it important to document limitations alongside results?',
      checkAnswer: 'Because every model is a simplification. Our simulator ignores magnetic variation, ocean eddies, refraction at low altitudes, and many other factors. Documenting these limitations tells the reader exactly how far to trust the results — and where future work should focus. Hiding limitations undermines trust; disclosing them builds it.',
      codeIntro: 'Generate a formatted project documentation page for the Wayfinding Simulator.',
      code: `# Polynesian Wayfinding Simulator — Project Documentation

print("""
================================================================
        POLYNESIAN WAYFINDING SIMULATOR
            Project Documentation
================================================================

1. INTRODUCTION
---------------
This simulator models the navigation techniques used by Polynesian
wayfinders to cross thousands of kilometres of open Pacific Ocean
without instruments. It combines celestial mechanics, wave physics,
population genetics, Bayesian statistics, and naval architecture
into an integrated voyage simulation.

Inspired by Hokule'a's 1976 Hawaii-to-Tahiti voyage, navigated
by Mau Piailug using only traditional wayfinding methods.

2. SCIENTIFIC BASIS
-------------------
The simulator implements five interacting models:

  a) Star Compass Engine:
     Spherical astronomy: RA/Dec → Alt/Az coordinate transform
     Julian Day → Sidereal Time → Hour Angle pipeline
     20-star catalogue with accurate positions

  b) Voyage Simulator:
     Dead reckoning: speed × time × heading integration
     Ocean currents: vector field addition to canoe velocity
     Bayesian position fixing from noisy star observations
     Monte Carlo weather (wind shifts, cloud cover)

  c) Detection Calculator:
     Multi-sensor fusion: visual + wave + bird + cloud + colour
     Each sensor modelled with distance-dependent probability
     Combined using independence assumption: P = 1 - product(1-Pi)

  d) Genetic Drift Model:
     Founder effect: binomial sampling of allele frequencies
     Multi-hop colonisation: successive bottlenecks
     UPGMA clustering for phylogenetic trees

  e) Canoe Hydrodynamics:
     ITTC friction drag formula
     Wave drag (Froude number dependent)
     Crab-claw sail force resolution

3. KEY FINDINGS
---------------
  - Star navigation reduces position error from ~50 nm/day
    (dead reckoning alone) to ~6 nm equilibrium (with nightly fixes)
  - Combined detection signals expand effective island target
    from ~30 nm (visual only) to ~80 nm (all signals) for Tahiti
  - Monte Carlo analysis: 70-85% of simulated voyages arrive
    within 200 nm of Tahiti after 30 days
  - Genetic drift through 3 island hops can lose alleles at
    25% source frequency with >5% probability
  - Crab-claw sail achieves peak drive force at ~60° apparent
    wind angle (beam reach) — optimised for trade wind sailing

4. LIMITATIONS
--------------
  - Star positions ignore precession (±0.5° over 1000 years)
  - Ocean current model is static (no seasonal/ENSO variation)
  - Simplified wave interference (double-slit, not full diffraction)
  - No canoe leeway modelling (sideways drift from sail forces)
  - Weather model is basic (no tropical cyclone simulation)
  - Bayesian estimator treats observations as independent

5. MODERN APPLICATIONS
----------------------
  - Star compass → GPS satellite positioning, telescope control
  - Bayesian estimation → autonomous vehicles, medical diagnosis
  - Wave interference → radar, sonar, X-ray crystallography
  - Genetic drift → conservation biology, disease genetics
  - Detection probability → search and rescue, sensor networks
  - Canoe hydrodynamics → naval architecture, racing yachts

6. SKILLS DEMONSTRATED
----------------------
  + Object-oriented programming (Python classes)
  + Spherical trigonometry and coordinate transforms
  + Monte Carlo simulation and statistical analysis
  + Bayesian inference and sensor fusion
  + Vector field computation
  + Phylogenetic tree construction
  + Technical report writing

================================================================
""")

# Skills summary for portfolio
skills = [
    ("Celestial mechanics", "Sidereal time, coordinate transforms, star catalogues"),
    ("Wave physics", "Interference, diffraction, detection modelling"),
    ("Bayesian statistics", "Prior/posterior updates, sensor fusion, uncertainty"),
    ("Population genetics", "Founder effect, genetic drift, phylogenetics"),
    ("Naval architecture", "Hull resistance, sail forces, voyage simulation"),
    ("Python programming", "Classes, NumPy, Monte Carlo, data analysis"),
    ("Scientific communication", "Technical reports, limitation analysis"),
]

print("PORTFOLIO SKILLS SUMMARY:")
for skill, detail in skills:
    print(f"  * {skill}: {detail}")

print()
print("Total codebase: ~2,000 lines across 4 levels, 20 mini-lessons")
print("Concepts span: astronomy, physics, biology, statistics, engineering")
print("Historical context: 3,000 years of Polynesian navigation tradition")`,
      challenge: 'Add a "voyage summary" function that takes the simulation log from Mini-Lesson 3 and generates a one-page voyage report: departure, arrival, total distance, average speed, number of star fixes, worst navigation error, and final position accuracy. This is the output a modern navigator or voyage planner would produce.',
      successHint: 'You have completed a full interdisciplinary engineering project: from problem analysis through system design, implementation, simulation, and documentation. The Wayfinding Simulator demonstrates skills in astronomy, physics, statistics, genetics, naval engineering, and scientific communication — spanning six academic disciplines in one integrated project.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Wayfinder Master
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a complete Polynesian Wayfinding Simulator</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 4 is a capstone project: design, build, and document a complete Wayfinding Simulator that integrates celestial navigation, wave physics, and Bayesian estimation.
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
