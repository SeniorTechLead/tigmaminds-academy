import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function PolynesianLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Spherical astronomy — hour angle and sidereal time',
      concept: `Stars don't rise at random — their positions are governed by **spherical astronomy**, the mathematics of objects on the celestial sphere. Two key concepts unlock the sky:

**Hour Angle (HA)**: the angular distance of a star west of the meridian (the imaginary line from north to south through the zenith). When HA = 0, the star is at its highest point (culmination). As Earth rotates, HA increases at 15°/hour — one full rotation (360°) every 23 hours 56 minutes.

**Sidereal Time (ST)**: a clock that tracks the rotation of the stars, not the Sun. Local Sidereal Time equals the Right Ascension of whatever star is currently on the meridian. The relationship is:

**HA = ST - RA**

Where RA is the star's Right Ascension (its fixed "longitude" on the celestial sphere). If you know the sidereal time and a star's RA, you instantly know where the star is in the sky.

Polynesian navigators tracked this relationship intuitively — they knew which stars would be on the meridian at each phase of the night, effectively running a mental sidereal clock calibrated by decades of observation.

📚 *A sidereal day (23h 56m 4s) is about 4 minutes shorter than a solar day (24h). This means stars rise ~4 minutes earlier each night — the sky shifts steadily through the year, completing one full cycle in 365 days.*`,
      analogy: 'Imagine a giant clock face painted on the ceiling above you. The stars are the numbers on the clock. As Earth rotates, the clock face turns — and the number directly above you (on the meridian) tells you the "star time." Polynesian navigators read this clock instinctively, knowing which constellation was overhead at each hour of each season.',
      storyConnection: 'When Mau Piailug guided Hōkūleʻa to Tahiti, he tracked the passage of stars across the meridian throughout the night. Each transit told him not just the direction, but the time — and since he knew how far they had sailed since sunset, the star transits let him estimate their east-west position without any clock or instrument.',
      checkQuestion: 'If the Local Sidereal Time is 14h and a star has RA = 10h, what is its hour angle? Where is it in the sky?',
      checkAnswer: 'HA = ST - RA = 14h - 10h = 4h. Since 1h = 15°, the star is 60° west of the meridian — it transited 4 hours ago and is now descending toward the western horizon. A navigator seeing this star low in the west knows it\'s roughly 4 hours past its culmination.',
      codeIntro: 'Calculate hour angles and track star positions through the night using sidereal time.',
      code: `import numpy as np

def solar_to_sidereal(solar_hour, day_of_year):
    """Convert solar time to approximate Local Sidereal Time.
    ST advances ~4 min per day ahead of solar time."""
    # At spring equinox (day ~80), LST = solar time at noon = 0h
    offset_hours = (day_of_year - 80) * (24 / 365.25)
    lst = (solar_hour + offset_hours) % 24
    return lst

def hour_angle(lst, ra_hours):
    """HA = LST - RA, in degrees."""
    ha = (lst - ra_hours) * 15  # convert hours to degrees
    # Normalise to -180..+180
    while ha > 180: ha -= 360
    while ha < -180: ha += 360
    return ha

def altitude(ha_deg, dec_deg, lat_deg):
    """Altitude of a star given HA, declination, latitude."""
    ha = np.radians(ha_deg)
    dec = np.radians(dec_deg)
    lat = np.radians(lat_deg)
    sin_alt = (np.sin(dec) * np.sin(lat) +
               np.cos(dec) * np.cos(lat) * np.cos(ha))
    return np.degrees(np.arcsin(np.clip(sin_alt, -1, 1)))

# Navigation stars with RA (hours) and Dec (degrees)
stars = [
    ("Hoku-le'a (Arcturus)",  14.26,  19.2),
    ("'A'a (Sirius)",          6.75, -16.7),
    ("Hikianalia (Spica)",    13.42, -11.2),
    ("Ke ali'i (Antares)",    16.49, -26.4),
    ("Na hiku (Dubhe)",       11.06,  61.8),
    ("Pi'ilani (Canopus)",     6.40, -52.7),
]

lat = 20.0  # Hawaii
day = 172   # June solstice

print("=== Star Positions Through the Night (June, Hawaii) ===")
print(f"Latitude: {lat}°N | Day of year: {day}\\n")

header = f"{'Star':<26}" + "".join(f"{'  '+str(h)+'h':>6}" for h in range(20, 30))
print(header.replace("24h"," 0h").replace("25h"," 1h").replace("26h"," 2h")
      .replace("27h"," 3h").replace("28h"," 4h").replace("29h"," 5h"))
print("-" * 86)

for name, ra, dec in stars:
    row = f"{name:<26}"
    for solar_h in range(20, 30):
        sh = solar_h % 24
        lst = solar_to_sidereal(sh, day)
        ha = hour_angle(lst, ra)
        alt = altitude(ha, dec, lat)
        if alt > 0:
            row += f"{alt:>5.0f}°"
        else:
            row += "   -- "
    print(row)

# Sidereal time shift across the year
print("\\n=== Sidereal Time at 9 PM Across the Year ===")
print("(Shows which stars are on the meridian at 9 PM each month)")
for month, day in [(1,15),(3,80),(6,172),(9,265),(12,349)]:
    lst = solar_to_sidereal(21, day)
    month_name = ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"][month-1]
    print(f"  {month_name}: LST = {lst:.1f}h — stars with RA ~{lst:.0f}h are on meridian")

print("\\nThis is why different constellations dominate different seasons.")
print("Navigators memorised these seasonal patterns over years of training.")`,
      challenge: 'Calculate the LST at midnight for your birthday. Which bright star (from the list) is closest to the meridian at that time? This is "your" navigation star — the one a Polynesian navigator would use to guide a canoe on the night you were born.',
      successHint: 'Hour angle and sidereal time are the foundation of all positional astronomy. Every telescope on Earth, every satellite tracker, and every planetarium program uses these same equations. You now understand the coordinate system that maps the rotating sky.',
    },
    {
      title: 'Wave interference patterns — double-slit analogy for island detection',
      concept: `When ocean swells hit an island, they **diffract** around it — bending and wrapping around the obstacle. The waves that pass on either side of the island then **interfere** with each other behind the island, creating a distinctive pattern of reinforced and cancelled waves.

This is exactly the **double-slit interference** pattern from physics. The island is the obstacle between two "slits" (the open ocean on either side). Behind the island, the diffracted waves overlap:

- Where crest meets crest: **constructive interference** — bigger waves
- Where crest meets trough: **destructive interference** — calm water

The result is a fan-shaped pattern of alternating rough and smooth water extending **downwind** from the island. Polynesian navigators could detect this pattern 30-50 km from land — long before the island was visible — by feeling the canoe's motion change.

The spacing of the interference fringes depends on the **wavelength** of the swell and the **width** of the island:

**d sin(θ) = nλ**

Where d is the island width, θ is the angle from centre, n is the fringe number, and λ is the wavelength.

📚 *The same equation governs light passing through slits, sound diffracting around barriers, and radio waves bending around buildings. Wave physics is universal.*`,
      analogy: 'Drop two pebbles into a still pond, side by side. Where the circular ripples from each pebble overlap, you see a pattern: some spots have big waves (both crests arrive together), other spots are nearly flat (a crest from one cancels a trough from the other). An island in the ocean creates the same pattern — and navigators read it like a map.',
      storyConnection: 'Polynesian navigators called these wave patterns "the wave shadow" or "the wave pillow" of an island. Approaching Tahiti, a navigator would feel the swell pattern change kilometres before seeing land. The specific angle and spacing of the interference told them the island\'s size and distance — a physics calculation done by feel rather than formula.',
      checkQuestion: 'An island is 10 km wide and the ocean swell has a wavelength of 200 m. At what angle from centre is the first interference fringe?',
      checkAnswer: 'sin(θ) = λ/d = 200/10000 = 0.02. θ = arcsin(0.02) = 1.15°. The first fringe is at about 1.15° from centre — very narrow. At 30 km downwind, this fringe is about 30000 × tan(1.15°) ≈ 600 m from the centre line. Navigators could detect this 600 m wide zone of changed wave height.',
      codeIntro: 'Model the wave interference pattern behind an island and calculate detection ranges.',
      code: `import numpy as np

def interference_pattern(island_width_m, wavelength_m, distance_m, n_points=200):
    """Calculate wave interference intensity behind an island.
    Uses the double-slit analogy: each side of the island acts as a source."""
    d = island_width_m
    lam = wavelength_m
    # Lateral positions across the wake
    y = np.linspace(-5000, 5000, n_points)
    # Phase difference between waves from each side of island
    path_diff = d * y / np.sqrt(distance_m**2 + y**2)
    phase = 2 * np.pi * path_diff / lam
    # Intensity: I = 4 * cos²(phase/2) for two-source interference
    intensity = 4 * np.cos(phase / 2)**2
    return y, intensity

# Polynesian navigation scenario: approaching an island
island_width = 8000    # 8 km wide island (like Tahiti)
wavelength = 180       # typical Pacific swell wavelength (metres)

print("=== Wave Interference Behind an Island ===")
print(f"Island width: {island_width/1000:.0f} km | Swell wavelength: {wavelength} m\\n")

for dist_km in [50, 30, 15, 5]:
    y, intensity = interference_pattern(island_width, wavelength, dist_km * 1000)
    max_I = np.max(intensity)
    min_I = np.min(intensity[len(intensity)//4:3*len(intensity)//4])
    contrast = (max_I - min_I) / (max_I + min_I)

    # Find fringe positions
    peaks = []
    for i in range(1, len(intensity)-1):
        if intensity[i] > intensity[i-1] and intensity[i] > intensity[i+1]:
            if abs(y[i]) > 100:  # skip central peak
                peaks.append(y[i])

    n_fringes = len(peaks)
    fringe_spacing = abs(peaks[1] - peaks[0]) if len(peaks) > 1 else 0

    print(f"Distance: {dist_km} km downstream")
    print(f"  Fringes detected: {n_fringes}")
    print(f"  Fringe spacing: {fringe_spacing:.0f} m")
    print(f"  Contrast (detectability): {contrast:.2f}")
    print(f"  {'Detectable by feel' if contrast > 0.05 else 'Too faint to detect'}")
    print()

# Detection range for different island sizes
print("=== Island Detection Range ===")
print(f"{'Island':<20} {'Width (km)':>10} {'Max Detection':>14}")
print("-" * 46)

for name, width in [("Small atoll", 2000), ("Medium island", 8000),
                     ("Large island", 30000), ("Hawaii (Big Is.)", 120000)]:
    # Detection threshold: contrast > 0.03
    for dist in range(100, 0, -1):
        y, intensity = interference_pattern(width, wavelength, dist * 1000, 100)
        max_I = np.max(intensity)
        min_I = np.min(intensity[len(intensity)//4:3*len(intensity)//4])
        contrast = (max_I - min_I) / (max_I + min_I)
        if contrast > 0.03:
            print(f"{name:<20} {width/1000:>8.0f} {dist:>12} km")
            break`,
      challenge: 'Ocean swells come from multiple directions simultaneously. Modify the model to add a second swell (wavelength 120 m) arriving at 30° to the first. How does the combined interference pattern differ from a single swell? This multi-swell reading is what made Polynesian navigation so difficult to learn — you had to mentally decompose overlapping wave patterns.',
      successHint: 'You modelled the same wave interference physics that governs Young\'s double-slit experiment (which proved light is a wave), X-ray crystallography (which revealed DNA\'s structure), and radio telescope arrays. Wave interference is one of the most universal patterns in physics — and Polynesian navigators detected it by feel.',
    },
    {
      title: 'Genetic drift simulation — the founder effect in island populations',
      concept: `When a small group of people (say 30-100) sails to a new island, they carry only a **fraction** of the genetic diversity of their home population. This is the **founder effect** — a specific case of **genetic drift**, where random chance (not natural selection) changes the genetic makeup of a population.

In a large population, rare alleles (gene variants) are maintained because many people carry them. In a small founding population, a rare allele might be absent entirely — or, by chance, be overrepresented. Over generations, this random drift can produce populations that are genetically distinct from their ancestors.

The mathematics is straightforward: if an allele has frequency p in the source population and the founding group has N people (2N gene copies), the probability of losing the allele entirely is:

**P(loss) = (1 - p)^(2N)**

For a rare allele (p = 0.05) in a founding group of 30 people (60 gene copies): P(loss) = 0.95^60 = 0.046 — about 5% chance of losing the allele. For a founding group of 10 people: P(loss) = 0.95^20 = 0.36 — a 36% chance.

📚 *Genetic drift is strongest in small populations. This is why island populations often have unusual genetic profiles — not because of adaptation, but because of the random sample that founded the colony.*`,
      analogy: 'Imagine a bag with 1,000 marbles: 950 blue, 50 red. If you grab a handful of 20 marbles to start a new bag, you might get 0, 1, 2, or 3 red ones — by pure chance. If you got zero red, the "red" variant is lost forever from the new population. This is the founder effect: the random sample that starts a new colony determines its genetic future.',
      storyConnection: 'DNA analysis of modern Polynesian populations reveals the founder effect clearly. Certain genetic markers that are common across Southeast Asia are rare or absent in Polynesia — they were lost when small canoe crews colonised new islands. Conversely, some rare variants became common in Polynesia simply because a founding crew happened to carry them.',
      checkQuestion: 'A founding crew of 40 people (80 gene copies) arrives at an island. An allele has frequency 10% in the source population. What is the probability this allele is present in the founding group?',
      checkAnswer: 'P(loss) = (1 - 0.10)^80 = 0.90^80 = 0.00024. P(present) = 1 - 0.00024 = 0.99976. At 10% frequency with 80 gene copies, the allele is almost certainly present. But at 1% frequency: P(loss) = 0.99^80 = 0.45 — a 45% chance of loss. Rare alleles are the ones at risk.',
      codeIntro: 'Simulate genetic drift across island colonisations and track allele frequency changes.',
      code: `import numpy as np

np.random.seed(42)

def founder_event(source_freq, founder_size):
    """Simulate one founder event: draw 2N gene copies from source."""
    copies = 2 * founder_size
    # Each gene copy is the allele with probability = source_freq
    count = np.random.binomial(copies, source_freq)
    return count / copies  # new frequency in founded population

def drift_generations(start_freq, pop_size, generations):
    """Simulate genetic drift over multiple generations."""
    freq = start_freq
    history = [freq]
    for _ in range(generations):
        if freq <= 0 or freq >= 1:
            history.append(freq)
            continue
        # Next generation: binomial sampling
        count = np.random.binomial(2 * pop_size, freq)
        freq = count / (2 * pop_size)
        history.append(freq)
    return history

# Simulate island colonisation chain: Mainland → Island 1 → Island 2 → Island 3
source_freq = 0.25  # allele at 25% in mainland population
founder_sizes = [50, 30, 20]  # crew sizes decrease for remote islands
island_names = ["Mainland", "Near Island", "Mid Island", "Remote Island"]

print("=== Founder Effect Across Island Chain ===")
print(f"Source allele frequency: {source_freq:.0%}\\n")

n_simulations = 500
all_results = {name: [] for name in island_names}
all_results["Mainland"] = [source_freq] * n_simulations

current_freqs = [source_freq] * n_simulations

for i, (size, dest) in enumerate(zip(founder_sizes, island_names[1:])):
    new_freqs = []
    for freq in current_freqs:
        new_freq = founder_event(freq, size)
        new_freqs.append(new_freq)
    current_freqs = new_freqs
    all_results[dest] = new_freqs

print(f"{'Island':<18} {'Mean freq':>10} {'Std dev':>8} {'Lost (0%)':>10} {'Fixed (100%)':>12}")
print("-" * 60)

for name in island_names:
    freqs = np.array(all_results[name])
    mean_f = np.mean(freqs)
    std_f = np.std(freqs)
    lost = np.mean(freqs == 0) * 100
    fixed = np.mean(freqs == 1) * 100
    print(f"{name:<18} {mean_f:>8.1%} {std_f:>8.3f} {lost:>8.1f}% {fixed:>10.1f}%")

# Long-term drift on each island
print("\\n=== 50-Generation Drift on Remote Island (pop=200) ===")
print("(5 independent simulations)\\n")

for sim in range(5):
    start = all_results["Remote Island"][sim]
    history = drift_generations(start, 200, 50)
    status = "LOST" if history[-1] == 0 else "FIXED" if history[-1] == 1 else f"{history[-1]:.1%}"
    changes = sum(1 for j in range(1, len(history)) if abs(history[j] - history[j-1]) > 0.02)
    print(f"  Sim {sim+1}: start={start:.1%} → end={status} ({changes} significant shifts)")`,
      challenge: 'Simulate what happens when two island populations merge (e.g., a second canoe arrives generations later). Average their allele frequencies weighted by population size. Does this "rescue" alleles that were lost in the first founding? This mixing effect explains why islands with ongoing contact retain more genetic diversity.',
      successHint: 'You simulated the same population genetics that scientists use to trace human migration, predict extinction risk for endangered species, and understand disease resistance in isolated populations. The founder effect explains why Polynesian, Ashkenazi Jewish, and Amish populations have distinctive genetic profiles.',
    },
    {
      title: 'Ocean current vector fields — mapping the invisible rivers',
      concept: `The Pacific Ocean contains permanent current systems — vast rivers of moving water driven by wind, Earth's rotation (Coriolis effect), and temperature gradients. These currents form a **vector field**: at every point in the ocean, the water has a speed and a direction.

Key Pacific currents for Polynesian navigation:
- **North Equatorial Current**: flows west at ~0.5 knots (3-20°N)
- **South Equatorial Current**: flows west at ~0.7 knots (0-20°S)
- **Equatorial Countercurrent**: flows east at ~0.5 knots (3-8°N)
- **Kuroshio / East Australian**: boundary currents, 1-2 knots

Navigators had to account for these currents — a canoe sailing "straight" from Hawaii to Tahiti would be carried hundreds of kilometres west by the currents during the 30-day voyage. The correction is **vector addition**:

**v_actual = v_canoe + v_current**

Where each velocity has both magnitude and direction. The navigator must aim east of the target to compensate for the westward current — sailing a "crab angle" that looks wrong but arrives correctly.

📚 *A vector field assigns a vector (magnitude + direction) to every point in space. Wind maps, weather charts, and ocean current charts are all examples of vector fields.*`,
      analogy: 'Imagine walking across a moving escalator at an angle. Your feet move forward, but the escalator carries you sideways. Your actual path across the floor is the combination (vector sum) of your walking direction and the escalator\'s movement. Navigators crossing currents face the same problem — they must aim "upstream" to end up at their target.',
      storyConnection: 'Polynesian navigators knew the current patterns from generations of observation. They could detect current changes by watching floating debris, feeling water temperature changes on the hull, and observing shifts in wave patterns. A navigator entering the Equatorial Countercurrent would feel the canoe accelerate eastward — a sign they had crossed a current boundary.',
      checkQuestion: 'A canoe sails south at 6 knots. The current flows west at 1 knot. What is the canoe\'s actual course and speed over ground?',
      checkAnswer: 'Actual speed = sqrt(6² + 1²) = sqrt(37) = 6.08 knots. Course deviation = arctan(1/6) = 9.5° west of south. Over a 30-day voyage at this drift, the canoe would end up about 30 × 24 × 1 = 720 nautical miles west of the intended track — completely missing a small island target.',
      codeIntro: 'Model Pacific current vector fields and calculate course corrections for canoe voyages.',
      code: `import numpy as np

def current_field(lat, lon):
    """Simplified Pacific current model.
    Returns (east_component, north_component) in knots."""
    # North Equatorial Current (3-20°N, flows west)
    if 3 < lat < 20 and 140 < lon < 260:
        return (-0.5, 0.0)
    # South Equatorial Current (0-20°S, flows west)
    if -20 < lat < 0 and 140 < lon < 280:
        return (-0.7, 0.0)
    # Equatorial Countercurrent (3-8°N, flows east)
    if 0 < lat < 3 and 150 < lon < 260:
        return (0.5, 0.1)
    return (0.0, 0.0)

def voyage_simulation(start_lat, start_lon, target_lat, target_lon,
                       canoe_speed_kts, heading_deg, days):
    """Simulate a canoe voyage with ocean currents.
    heading_deg: 0=N, 90=E, 180=S, 270=W."""
    lat, lon = start_lat, start_lon
    track = [(lat, lon)]

    for hour in range(days * 24):
        # Canoe velocity (in degrees per hour, approximate)
        kts_to_deg = 1 / 60  # 1 knot ≈ 1 nm/hr ≈ 1/60 degree/hr
        canoe_east = canoe_speed_kts * np.sin(np.radians(heading_deg)) * kts_to_deg
        canoe_north = canoe_speed_kts * np.cos(np.radians(heading_deg)) * kts_to_deg

        # Current at current position
        cur_east, cur_north = current_field(lat, lon)
        cur_east *= kts_to_deg
        cur_north *= kts_to_deg

        # Actual movement
        lon += canoe_east + cur_east
        lat += canoe_north + cur_north
        track.append((lat, lon))

    return track

# Voyage: Hawaii to Tahiti
hawaii = (20.0, 204.0)   # 20°N, 156°W = 204°E
tahiti = (-17.5, 210.5)   # 17.5°S, 149.5°W = 210.5°E

# Direct bearing
dlat = tahiti[0] - hawaii[0]
dlon = tahiti[1] - hawaii[1]
direct_bearing = np.degrees(np.arctan2(dlon, dlat)) % 360

print("=== Hawaii to Tahiti Voyage Simulation ===")
print(f"Start: {hawaii[0]}°N, {360-hawaii[1]:.0f}°W")
print(f"Target: {abs(tahiti[0])}°S, {360-tahiti[1]:.0f}°W")
print(f"Direct bearing: {direct_bearing:.1f}°\\n")

# Compare: no correction vs corrected heading
for label, correction in [("No correction", 0), ("5° east correction", 5),
                            ("10° east correction", 10), ("15° east correction", 15)]:
    heading = direct_bearing + correction
    track = voyage_simulation(*hawaii, *tahiti, 5.0, heading, 30)
    final_lat, final_lon = track[-1]
    error_lat = final_lat - tahiti[0]
    error_lon = final_lon - tahiti[1]
    error_nm = np.sqrt((error_lat*60)**2 + (error_lon*60*np.cos(np.radians(tahiti[0])))**2)

    print(f"{label}: heading {heading:.1f}°")
    print(f"  Final: {final_lat:.1f}°, {360-final_lon:.1f}°W")
    print(f"  Error: {error_nm:.0f} nm ({error_nm*1.852:.0f} km) from target")
    print()

# Current speed matters
print("=== Effect of Current Strength on Miss Distance ===")
print("(30-day voyage, no heading correction)")
for factor in [0, 0.5, 1.0, 1.5, 2.0]:
    # Scale currents by factor (would need to modify current_field)
    # Simplified: estimate drift
    drift_nm = factor * 0.6 * 30 * 24  # average 0.6 kts × hours
    print(f"  Current ×{factor:.1f}: lateral drift ≈ {drift_nm:.0f} nm ({drift_nm*1.852:.0f} km)")`,
      challenge: 'Add seasonal current variation: currents are 30% stronger during trade wind season (May-September) and 30% weaker during doldrums (October-April). How does the optimal heading correction change by season? This seasonal knowledge was critical — voyages were timed to specific months.',
      successHint: 'You modelled vector addition of velocities in a non-uniform field — the same mathematics used in aircraft navigation (wind correction), rocket trajectories (gravity assists), and ocean circulation models (climate science). The vector field concept is fundamental to physics and engineering.',
    },
    {
      title: 'Celestial sphere coordinate transforms — equatorial to horizon',
      concept: `A star's position can be described in two coordinate systems:

1. **Equatorial coordinates** (RA, Dec): fixed on the celestial sphere. A star's RA and Dec never change (ignoring precession). This is the star's "address" in the sky catalogue.

2. **Horizon coordinates** (Azimuth, Altitude): relative to the observer. A star's altitude and azimuth change continuously as Earth rotates. This is where the star appears from where you're standing.

The **coordinate transform** from equatorial to horizon requires knowing the observer's latitude and the Local Sidereal Time:

**sin(alt) = sin(dec)sin(lat) + cos(dec)cos(lat)cos(HA)**
**cos(alt)sin(az) = -cos(dec)sin(HA)**
**cos(alt)cos(az) = sin(dec)cos(lat) - cos(dec)sin(lat)cos(HA)**

This transform is the mathematical engine behind every planetarium, every telescope controller, and every star-chart app. Polynesian navigators performed an approximate version mentally — they knew where each star should appear at each time of night from each latitude.

📚 *Coordinate transforms convert between reference frames. GPS uses the same concept: satellite positions are in Earth-Centred coordinates; your phone converts them to latitude/longitude. Same mathematics, different application.*`,
      analogy: 'Imagine giving directions to your house. In "city coordinates" you say "123 Main St" — a fixed address. In "personal coordinates" you say "200 metres to your left" — which depends on where the listener is standing and which way they\'re facing. The equatorial-to-horizon transform converts from the sky\'s "fixed address" to "where to look from here."',
      storyConnection: 'When a Polynesian navigator said a star was "two fists above the eastern horizon," they were using horizon coordinates. When they said it was "the star that passes over Tahiti," they were using a form of equatorial coordinates (declination matches Tahiti\'s latitude). The mental transform between these two systems — knowing where each star will appear at each time — was the core of their expertise.',
      checkQuestion: 'Arcturus has Dec = +19.2° and RA = 14.26h. At LST = 14.26h (so HA = 0°) from latitude 19.2°N, what are its horizon coordinates?',
      checkAnswer: 'When HA = 0° and dec = lat, the star is at the zenith: altitude = 90°, azimuth is undefined (directly overhead). This is the key to latitude sailing — when Arcturus passes through the zenith, you know you\'re at latitude 19.2°N, the latitude of Hawaii.',
      codeIntro: 'Build the full equatorial-to-horizon coordinate transform and track stars across the sky.',
      code: `import numpy as np

def equatorial_to_horizon(ra_h, dec_deg, lat_deg, lst_h):
    """Transform equatorial (RA, Dec) to horizon (Alt, Az) coordinates."""
    ha_deg = (lst_h - ra_h) * 15  # hour angle in degrees
    ha = np.radians(ha_deg)
    dec = np.radians(dec_deg)
    lat = np.radians(lat_deg)

    # Altitude
    sin_alt = np.sin(dec)*np.sin(lat) + np.cos(dec)*np.cos(lat)*np.cos(ha)
    alt = np.degrees(np.arcsin(np.clip(sin_alt, -1, 1)))

    # Azimuth
    cos_az = (np.sin(dec) - np.sin(alt*np.pi/180)*np.sin(lat)) / \\
             (np.cos(alt*np.pi/180)*np.cos(lat) + 1e-10)
    az = np.degrees(np.arccos(np.clip(cos_az, -1, 1)))
    if np.sin(ha) > 0:
        az = 360 - az  # western half of sky

    return alt, az

# Polynesian navigation stars
stars = [
    ("Hoku-le'a (Arcturus)",  14.26,  19.2),
    ("'A'a (Sirius)",          6.75, -16.7),
    ("Hikianalia (Spica)",    13.42, -11.2),
    ("Ke ali'i (Antares)",    16.49, -26.4),
    ("Pi'ilani (Canopus)",     6.40, -52.7),
    ("Polaris",                2.53,  89.3),
]

lat = 20.0   # Hawaii
day = 80     # March equinox

print("=== Full Sky View: March Equinox, Hawaii ===")
print(f"Latitude: {lat}°N\\n")

# Track each star through the night
for name, ra, dec in stars:
    print(f"{name}:")
    visible_hours = 0
    max_alt = -90
    transit_az = None

    for solar_h_10 in range(180, 300):  # 6 PM to 6 AM in 0.1h steps
        solar_h = solar_h_10 / 10
        lst = (solar_h + (day - 80) * 24/365.25) % 24
        alt, az = equatorial_to_horizon(ra, dec, lat, lst)
        if alt > 0:
            visible_hours += 0.1
            if alt > max_alt:
                max_alt = alt
                transit_az = az

    if visible_hours > 0:
        print(f"  Visible: {visible_hours:.1f} hours | Max altitude: {max_alt:.1f}° | Transit az: {transit_az:.1f}°")
        zenith = ">>> PASSES THROUGH ZENITH <<<" if max_alt > 87 else ""
        if zenith: print(f"  {zenith}")
    else:
        print(f"  Not visible tonight")
    print()

# Compare star positions at two latitudes
print("=== Coordinate Comparison: Hawaii (20°N) vs Tahiti (17.5°S) ===")
print("(At LST = 14h — when Arcturus is near meridian)\\n")

for name, ra, dec in stars:
    alt_h, az_h = equatorial_to_horizon(ra, dec, 20.0, 14.0)
    alt_t, az_t = equatorial_to_horizon(ra, dec, -17.5, 14.0)
    print(f"{name}:")
    if alt_h > 0:
        print(f"  Hawaii:  alt={alt_h:>5.1f}°  az={az_h:>5.1f}°")
    else:
        print(f"  Hawaii:  below horizon")
    if alt_t > 0:
        print(f"  Tahiti:  alt={alt_t:>5.1f}°  az={az_t:>5.1f}°")
    else:
        print(f"  Tahiti:  below horizon")

print("\\nNote: Polaris is barely visible from Hawaii and invisible from Tahiti.")
print("Southern Cross is high from Tahiti but low from Hawaii.")
print("This shift is how navigators determined latitude.")`,
      challenge: 'Implement the reverse transform: given a star\'s observed altitude and azimuth, calculate the observer\'s latitude. This is the fundamental problem of celestial navigation — observe a star, calculate your position. (Hint: if you know the star\'s declination and its measured altitude at transit, latitude = 90° - altitude + declination.)',
      successHint: 'You built the complete equatorial-to-horizon coordinate transform — the same engine inside every planetarium program, telescope controller, and satellite tracker. This is one of the most important algorithms in astronomy, and Polynesian navigators implemented it mentally through years of training.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Navigator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Deeper astronomy, wave physics, and population genetics</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into spherical astronomy, wave interference, genetic drift, ocean currents, and celestial coordinate transforms.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {loadProgress}</>) : (<><Sparkles className="w-5 h-5" /> Load Python</>)}
          </button>
        </div>
      )}

      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson
            key={i}
            id={`L2-${i + 1}`}
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
