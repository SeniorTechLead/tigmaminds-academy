import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function VikingNavLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Star positions — calculating where a star rises on the horizon',
      concept: `Every star rises at a specific compass bearing on the eastern horizon and sets at a specific bearing in the west. This bearing — called the star's **azimuth** — depends on the star's **declination** (its position north or south of the celestial equator) and your **latitude** (how far north or south you are on Earth).

The formula for a star's rising azimuth is:

**cos(azimuth) = sin(declination) / cos(latitude)**

A star with declination 0° (on the celestial equator) rises due east (90°) regardless of your latitude. A star with positive declination rises north of east. Negative declination rises south of east.

The Viking navigators memorized the rising and setting azimuths of about 220 stars — creating a mental compass with dozens of directional points around the horizon.

📚 *Declination is to the sky what latitude is to the Earth — it measures a star's position north or south of the celestial equator, in degrees.*`,
      analogy: 'Imagine the sky is a giant dome over your head, with stars painted on it. The dome rotates once every 24 hours (actually, the Earth rotates, but it looks the same). Each star traces a circle as the dome turns. Where that circle intersects the horizon — that\'s the star\'s rising and setting point. Different stars, different circles, different horizon points.',
      storyConnection: 'A Viking navigator standing on the deck of a longship would face the eastern horizon at dusk, waiting for specific stars to appear. As Sirius rose at about 110° (south-southeast), then Arcturus at about 63° (east-northeast), each one confirmed a compass direction — without any instrument.',
      checkQuestion: 'A star rises due east (azimuth = 90°). What is its declination?',
      checkAnswer: 'Declination = 0°. From the formula: cos(90°) = 0 = sin(declination)/cos(latitude). Since cos(latitude) is never zero (except at the poles), sin(declination) must be 0, so declination = 0°. Stars on the celestial equator always rise due east.',
      codeIntro: 'Calculate the rising azimuth of navigation stars at different latitudes — build a star compass.',
      code: `import numpy as np

def rising_azimuth(declination_deg, latitude_deg):
    """
    Calculate where a star rises on the horizon.
    Returns azimuth in degrees (0=N, 90=E, 180=S, 270=W).
    """
    dec = np.radians(declination_deg)
    lat = np.radians(latitude_deg)

    cos_az = np.sin(dec) / np.cos(lat)

    # Clamp to valid range (star might not rise at this latitude)
    if abs(cos_az) > 1:
        return None  # star is circumpolar or never rises

    azimuth = np.degrees(np.arccos(cos_az))
    return azimuth  # this is the angle from NORTH, measured through EAST

# Navigation stars used by Norse sailors
stars = [
    ("Polaris (North Star)", 89.3),    # almost at north celestial pole
    ("Sirius (brightest star)", -16.7),
    ("Arcturus", 19.2),
    ("Vega", 38.8),
    ("Capella", 46.0),
    ("Rigel", -8.2),
    ("Betelgeuse", 7.4),
    ("Aldebaran", 16.5),
    ("Spica", -11.2),
    ("Deneb", 45.3),
]

# Calculate for a Viking latitude (Norway ≈ 60°N)
latitude = 60.0

print(f"=== Star Compass at {latitude}°N (Norway) ===")
print(f"{'Star':<28} {'Dec (°)':>8} {'Rising Az':>10} {'Direction':>12}")
print("-" * 60)

for name, dec in stars:
    az = rising_azimuth(dec, latitude)
    if az is None:
        status = "Circumpolar" if dec > 0 else "Never rises"
        print(f"{name:<28} {dec:>7.1f}° {'':>10} {status:>12}")
    else:
        # Convert to compass direction
        if az < 22.5: direction = "N"
        elif az < 67.5: direction = "NE"
        elif az < 112.5: direction = "E"
        elif az < 157.5: direction = "SE"
        else: direction = "S"
        print(f"{name:<28} {dec:>7.1f}° {az:>8.1f}° {direction:>12}")

# Compare at different latitudes
print(f"\\n=== Sirius Rising Azimuth at Different Latitudes ===")
for lat in [0, 20, 40, 50, 60, 65]:
    az = rising_azimuth(-16.7, lat)
    if az:
        print(f"  Latitude {lat}°N: Sirius rises at {az:.1f}° (from North)")
    else:
        print(f"  Latitude {lat}°N: Sirius does not rise (too far north)")`,
      challenge: 'At what latitude does Sirius stop rising altogether? (Find the latitude where cos(azimuth) exceeds 1, making the arccos impossible.) This is the latitude limit for using Sirius as a navigation star. Try other stars — each has a different limit.',
      successHint: 'You just calculated star positions using spherical trigonometry — the mathematics of angles on a sphere. This is the same math used in GPS satellite positioning, telescope pointing, and spacecraft navigation. The Vikings solved these equations by memorization; you solved them with code.',
    },
    {
      title: 'Solar altitude and latitude — finding your position from the sun',
      concept: `At **solar noon** (when the sun reaches its highest point), its altitude above the horizon depends on your **latitude** and the **date** (which determines the sun's declination).

The formula is: **Altitude = 90° - latitude + declination**

If you know the date (giving you the declination) and measure the sun's altitude, you can solve for latitude:

**Latitude = 90° - altitude + declination**

The Vikings used a **bearing dial** — a wooden disc with a vertical pin (gnomon) that casts a shadow. The shadow length at noon gives the sun's altitude. Combined with knowledge of the approximate date, this gives latitude.

This is **latitude sailing**: sail north or south until your noon sun altitude matches the latitude of your destination, then sail due east or west along that line.

📚 *The sun's declination varies from +23.5° (summer solstice, June 21) to -23.5° (winter solstice, December 21), and is 0° at the equinoxes (March 20, September 22).*`,
      analogy: 'Imagine a lamp (the sun) hanging from the ceiling of a long hall. If you stand directly under it, you look straight up (altitude = 90°). Walk to the far end of the hall and you look at a low angle (altitude maybe 20°). The angle you look at tells you how far you are from directly under the lamp — that\'s how latitude works with the real sun.',
      storyConnection: 'Viking navigators measured the shadow of a gnomon pin on a wooden dial every day at noon. If the shadow was shorter than expected for their destination\'s latitude, they were too far south. If longer, too far north. They adjusted course until the shadow matched — then sailed due west toward Iceland, Greenland, or Vinland.',
      checkQuestion: 'On March 20 (equinox, declination = 0°), you measure the noon sun altitude as 45°. What is your latitude?',
      checkAnswer: 'Latitude = 90° - 45° + 0° = 45°N. You\'re at the latitude of Montreal, Lyon, or Sapporo. On an equinox, the calculation is simplest because declination is zero.',
      codeIntro: 'Build a latitude calculator from solar noon observations — the Viking navigation method.',
      code: `import numpy as np

def solar_declination(day_of_year):
    """
    Approximate solar declination for a given day.
    Day 1 = Jan 1, Day 172 = June 21 (summer solstice).
    """
    return 23.45 * np.sin(np.radians(360 / 365 * (day_of_year - 81)))

def noon_altitude(latitude, declination):
    """Sun's altitude at solar noon."""
    return 90 - latitude + declination

def latitude_from_altitude(altitude, declination):
    """Calculate latitude from measured noon sun altitude."""
    return 90 - altitude + declination

# Viking voyage: Norway (60°N) to Iceland (65°N)
# Departure: June 1 (day 152)
departure_day = 152
declination = solar_declination(departure_day)

print(f"=== Viking Latitude Calculator ===")
print(f"Date: June 1 (day {departure_day})")
print(f"Solar declination: {declination:.1f}°")
print()

# What the navigator sees at different latitudes
print(f"{'Latitude':>10} {'Noon Sun Alt':>14} {'Shadow angle':>14}")
print("-" * 40)
for lat in [55, 58, 60, 62, 64, 65, 67, 70]:
    alt = noon_altitude(lat, declination)
    shadow = 90 - alt  # shadow angle from vertical
    print(f"{lat:>8}°N {alt:>12.1f}° {shadow:>12.1f}°")

# Simulate a voyage with daily noon observations
print(f"\\n=== Simulated Voyage: Norway to Iceland ===")
print("Navigator measures noon sun each day and calculates latitude.")

np.random.seed(42)
true_latitude = 60.0  # start at Norway
target_latitude = 65.0  # destination Iceland
heading_north = True

print(f"{'Day':>4} {'True Lat':>10} {'Measured Alt':>14} {'Calc Lat':>10} {'Error':>8}")
print("-" * 48)

for day in range(10):
    voyage_day = departure_day + day
    dec = solar_declination(voyage_day)

    # True altitude
    true_alt = noon_altitude(true_latitude, dec)

    # Add measurement error (±0.5°, typical for a bearing dial)
    measured_alt = true_alt + np.random.normal(0, 0.5)

    # Navigator's calculated latitude
    calc_lat = latitude_from_altitude(measured_alt, dec)
    error = calc_lat - true_latitude

    print(f"{day+1:>4} {true_latitude:>8.1f}°N {measured_alt:>12.1f}° "
          f"{calc_lat:>8.1f}°N {error:>+6.1f}°")

    # Sail north toward Iceland (about 1° latitude per day)
    if true_latitude < target_latitude:
        true_latitude += 0.8 + np.random.normal(0, 0.2)

print(f"\\nArrived near {true_latitude:.1f}°N (target: {target_latitude}°N)")
print(f"Typical error: ±0.5-1° latitude = ±55-111 km")
print(f"Good enough to hit Iceland (300 km long) from 500 km away.")`,
      challenge: 'Simulate the same voyage in December instead of June. How does the low sun angle (and potentially below-horizon sun at high latitudes) affect navigation? At what latitude does the sun not rise at all in December? This is why Vikings timed their voyages for summer.',
      successHint: 'You built a celestial navigation system — calculating latitude from the sun\'s altitude. This is the same principle used by sailors for thousands of years and is still taught as backup navigation in naval academies worldwide. GPS may fail; the sun won\'t.',
    },
    {
      title: 'Dead reckoning — tracking position without landmarks',
      concept: `Between noon sun observations, a Viking navigator had to track the ship's position by **dead reckoning**: starting from a known position and updating it based on **speed**, **heading**, and **time**.

**New position = old position + (speed × time × direction)**

The problem: every measurement has **error**. Speed is estimated by watching flotsam pass the hull. Heading drifts with currents. Time is estimated from the sun and stars. These errors **accumulate** — after days of dead reckoning, your estimated position can be tens of kilometres off.

This is why noon sun fixes were essential: they **reset** the latitude error to the accuracy of the sun measurement (about ±1°). Without periodic fixes, dead reckoning errors grow without bound.

📚 *Dead reckoning is still used by submarines (which can\'t use GPS underwater), aircraft (as backup to GPS), and spacecraft (between star fixes). It\'s the universal fallback when external references aren\'t available.*`,
      analogy: 'Walk through your house blindfolded, counting steps and turns. After 10 steps, you\'re probably close to where you think you are. After 100, you\'ve bumped into walls and your mental map is way off. Dead reckoning is the same: accurate over short distances, increasingly wrong over long ones.',
      storyConnection: 'Leif Erikson\'s voyage from Greenland to Newfoundland was about 2,500 km. At a sailing speed of 5-8 knots, this took about 2 weeks. Dead reckoning errors accumulated daily, corrected by noon sun observations when the sky was clear. On cloudy days, error grew — making the voyage a probabilistic exercise in navigation.',
      checkQuestion: 'A ship sails at 6 knots on heading 270° (due west) for 10 hours. How far has it traveled and where is it relative to the start?',
      checkAnswer: '6 knots × 10 hours = 60 nautical miles (111 km) due west. But if there\'s a current of 1 knot pushing south, the ship has also drifted 10 nautical miles (18.5 km) south — ending up at a different position than intended.',
      codeIntro: 'Simulate dead reckoning navigation with cumulative errors — track estimated vs actual position.',
      code: `import numpy as np

np.random.seed(42)

def dead_reckoning_voyage(
    start_lat, start_lon,
    target_lat, target_lon,
    speed_knots=6,
    hours_per_day=12,
    days=14,
    heading_error_std=3,    # degrees
    speed_error_std=0.5,    # knots
    current_north=0.3,      # knots (ocean current)
    current_east=-0.2,
):
    """Simulate a Viking voyage with dead reckoning errors."""

    # Conversion: 1 degree latitude ≈ 111 km ≈ 60 nautical miles
    nm_per_degree = 60

    true_lat = start_lat
    true_lon = start_lon
    est_lat = start_lat
    est_lon = start_lon

    # Calculate ideal heading
    delta_lat = target_lat - start_lat
    delta_lon = target_lon - start_lon
    ideal_heading = np.degrees(np.arctan2(delta_lon, delta_lat))

    log = []

    for day in range(1, days + 1):
        # Navigator's intended heading (toward target)
        intended_heading = np.degrees(np.arctan2(
            target_lon - est_lon, target_lat - est_lat))

        # Actual heading (with error)
        actual_heading = intended_heading + np.random.normal(0, heading_error_std)

        # Actual speed (with error)
        actual_speed = speed_knots + np.random.normal(0, speed_error_std)

        # Distance sailed (nautical miles)
        distance_nm = actual_speed * hours_per_day

        # True position update (includes current)
        heading_rad = np.radians(actual_heading)
        true_lat += (distance_nm * np.cos(heading_rad) + current_north * hours_per_day) / nm_per_degree
        true_lon += (distance_nm * np.sin(heading_rad) + current_east * hours_per_day) / (nm_per_degree * np.cos(np.radians(true_lat)))

        # Estimated position (navigator doesn't know about errors or current)
        est_heading_rad = np.radians(intended_heading)
        est_distance = speed_knots * hours_per_day
        est_lat += (est_distance * np.cos(est_heading_rad)) / nm_per_degree
        est_lon += (est_distance * np.sin(est_heading_rad)) / (nm_per_degree * np.cos(np.radians(est_lat)))

        # Position error
        error_km = np.sqrt((true_lat - est_lat)**2 + (true_lon - est_lon)**2) * 111

        log.append({
            "day": day,
            "true_lat": true_lat, "true_lon": true_lon,
            "est_lat": est_lat, "est_lon": est_lon,
            "error_km": error_km,
        })

    return log

# Simulate Leif Erikson's voyage: Greenland to Newfoundland
voyage = dead_reckoning_voyage(
    start_lat=64.2, start_lon=-51.7,   # Brattahlíð, Greenland
    target_lat=51.6, target_lon=-55.5,  # L'Anse aux Meadows, Newfoundland
)

print("=== Viking Atlantic Crossing Simulation ===")
print("Route: Greenland → Newfoundland (~2,500 km)")
print(f"{'Day':>4} {'True Lat':>9} {'True Lon':>9} {'Est Lat':>9} {'Est Lon':>9} {'Error km':>9}")
print("-" * 51)

for entry in voyage:
    print(f"{entry['day']:>4} {entry['true_lat']:>8.1f}° {entry['true_lon']:>8.1f}° "
          f"{entry['est_lat']:>8.1f}° {entry['est_lon']:>8.1f}° {entry['error_km']:>7.0f}")

final = voyage[-1]
print(f"\\nFinal position error: {final['error_km']:.0f} km")
print(f"Newfoundland is about 300 km long — {'LANDFALL POSSIBLE' if final['error_km'] < 300 else 'MIGHT MISS'}")
print("\\nNote: errors accumulate daily without correction.")
print("A noon sun fix every 2-3 days resets the latitude error,")
print("keeping the total error manageable.")`,
      challenge: 'Add a "noon sun fix" every 3 days: reset est_lat to true_lat + small random error (±0.5°). How much does this reduce the final position error? This shows why clear skies were essential for Viking navigation — cloudy days meant growing uncertainty.',
      successHint: 'You simulated dead reckoning with cumulative errors — the fundamental navigation challenge for any vessel without GPS. The same mathematics applies to autonomous vehicles, robot navigation, and inertial guidance systems. Error accumulation and periodic correction are universal navigation problems.',
    },
    {
      title: 'Ocean swell analysis — detecting land beyond the horizon',
      concept: `The Pacific Ocean has dominant **swell patterns** — long, low waves generated by distant storms. These swells travel thousands of kilometres in straight lines. When they encounter an island, they **refract** (bend around it), **reflect** (bounce off it), and **diffract** (spread behind it), creating disturbance patterns detectable up to **100 km** from the island.

The key physics: when a wave encounters an obstacle larger than its wavelength, it diffracts around it. The obstacle creates a "shadow zone" behind it where the wave amplitude is reduced, surrounded by interference patterns where waves from either side of the obstacle meet.

Polynesian navigators detected these patterns by **feeling the canoe's motion** — subtle changes in the regular rocking indicated nearby land, even when the island was far below the horizon.

📚 *Diffraction is the bending of waves around obstacles. All waves do it: light, sound, water waves. The amount of bending depends on the ratio of wavelength to obstacle size.*`,
      analogy: 'Drop a pebble in a pond near a rock sticking out of the water. Watch the ripples: they bend around the rock, creating a calm zone behind it and a pattern of overlapping waves on the sides. Now imagine the pebble is a distant storm, the ripples are ocean swells, and the rock is an island. Same physics, bigger scale.',
      storyConnection: 'Polynesian navigators were trained from childhood to lie in the hull of the canoe with their eyes closed, feeling the wave patterns through the boat\'s motion. A disruption in the normal swell — unusual chop, unexpected calm — signalled the presence of land. This passive detection system required no technology at all.',
      checkQuestion: 'An ocean swell has a wavelength of 200 metres. An island is 10 km wide. Will the swell diffract around the island?',
      checkAnswer: 'Yes, but only slightly. Diffraction is strongest when the obstacle is comparable in size to the wavelength. A 10 km island is 50× the wavelength — the swell will mostly reflect off the island with some diffraction at the edges, creating interference patterns behind it. These are the patterns navigators detect.',
      codeIntro: 'Simulate ocean swell encountering an island — model the interference pattern and detection range.',
      code: `import numpy as np

def wave_interference(island_width_m, swell_wavelength_m,
                      grid_size=200, grid_extent_km=100):
    """
    Simplified model of wave diffraction/interference behind an island.
    Uses Huygens' principle: each point on the wave front is a source
    of secondary wavelets.
    """
    # Grid in km
    x = np.linspace(-grid_extent_km, grid_extent_km, grid_size)
    y = np.linspace(0, grid_extent_km * 2, grid_size)

    # Island is centered at (0, 0), swell comes from y < 0
    island_half = island_width_m / 2000  # convert to km

    # Calculate interference pattern behind island
    amplitude = np.zeros((grid_size, grid_size))

    for j, yy in enumerate(y):
        for i, xx in enumerate(x):
            if yy < 5:  # near the island, just direct wave
                if abs(xx) > island_half:
                    amplitude[j, i] = 1.0
                else:
                    amplitude[j, i] = 0.1  # shadow zone
            else:
                # Distance from each edge of the island
                d_left = np.sqrt((xx + island_half)**2 + yy**2)
                d_right = np.sqrt((xx - island_half)**2 + yy**2)
                wl_km = swell_wavelength_m / 1000

                # Interference from waves diffracting around each edge
                phase_left = 2 * np.pi * d_left / wl_km
                phase_right = 2 * np.pi * d_right / wl_km

                # Sum of two diffracted waves (simplified)
                amp = abs(np.cos(phase_left) + np.cos(phase_right)) / 2

                # Direct wave contribution (weakened in shadow zone)
                if abs(xx) > island_half * 1.5:
                    amp = 0.9 + 0.1 * amp  # mostly direct wave

                amplitude[j, i] = amp

    return x, y, amplitude

# Simulate for a typical Pacific island
island_width = 10000  # 10 km
swell_wavelength = 250  # metres

x, y, amp = wave_interference(island_width, swell_wavelength)

# Analyze detection range
print("=== Ocean Swell Interference Pattern ===")
print(f"Island width: {island_width/1000:.0f} km")
print(f"Swell wavelength: {swell_wavelength} m")
print()

# Find disturbance level at different distances behind the island
print(f"{'Distance behind island':>24} {'Center amplitude':>18} {'Detectable?':>12}")
print("-" * 56)

for dist_km in [5, 10, 20, 30, 50, 75, 100]:
    j = int((dist_km / (200)) * len(y))
    if j >= len(y): j = len(y) - 1
    center_i = len(x) // 2
    amp_center = amp[j, center_i]
    # "Normal" swell amplitude is ~1.0; disturbance = deviation from 1.0
    disturbance = abs(1.0 - amp_center)
    detectable = "YES" if disturbance > 0.05 else "Marginal" if disturbance > 0.02 else "No"
    print(f"{dist_km:>20} km {amp_center:>16.3f} {detectable:>12}")

print()
print("Polynesian navigators could detect disturbances of just 5%")
print("through the motion of their canoe hull — trained sensitivity")
print("developed over a lifetime of practice.")

# Expand detection zone with other signals
print("\\n=== Total Detection Zone ===")
signals = [
    ("Wave disturbance", 50, "Medium"),
    ("Cloud buildup over island", 120, "Clear day only"),
    ("Seabirds (terns, boobies)", 80, "Dawn/dusk"),
    ("Water colour change", 30, "Close approach"),
    ("Floating vegetation", 40, "Variable"),
    ("Smell of vegetation", 20, "Downwind only"),
]

print(f"{'Signal Type':<28} {'Range (km)':>10} {'Conditions':>16}")
print("-" * 56)
for signal, range_km, condition in signals:
    print(f"{signal:<28} {range_km:>8} km {condition:>16}")

max_range = max(s[1] for s in signals)
island_apparent_size = island_width / 1000 + 2 * max_range
print(f"\\nIsland actual size: {island_width/1000:.0f} km")
print(f"Effective detection zone: {island_apparent_size:.0f} km diameter")
print(f"Target expansion factor: {island_apparent_size/(island_width/1000):.0f}×")`,
      challenge: 'A small atoll is only 2 km wide. Calculate its detection zone. Is it still findable? (Smaller islands have smaller wave disturbance patterns — but birds and cloud patterns still help. The detection zone might be 50 km instead of 200 km.)',
      successHint: 'You modeled wave diffraction — one of the most beautiful phenomena in physics. The same mathematics applies to light bending through a slit (creating interference patterns), sound bending around corners, and radio waves diffracting around buildings. Polynesian navigators used it without mathematics; you modeled it with code.',
    },
    {
      title: 'Polarised light — how a sunstone finds the sun through clouds',
      concept: `Sunlight is **unpolarised** — its electric field oscillates in all random directions. But when sunlight scatters off air molecules (Rayleigh scattering), it becomes **partially polarised**: the oscillations favour one specific direction.

The pattern of polarisation across the sky always points toward the sun, even when the sun is hidden behind clouds. **Calcite** (Iceland spar) is a birefringent crystal that splits light into two beams, each polarised differently. By rotating the crystal until both beams have **equal brightness**, the navigator finds the polarisation direction — and thus the sun's position.

The key physics: when light scatters at 90° from its original direction, it becomes **maximally polarised**. The sky at 90° from the sun is the most polarised part of the sky. This creates a ring of maximum polarisation centered on the sun.

📚 *Birefringence means a material has two different refractive indices for light polarised in different directions. This causes a single beam to split into two — the "double image" effect of calcite.*`,
      analogy: 'Imagine a rope shaking wildly in all directions (unpolarised light). Now pass it through a vertical slit — only the vertical component gets through (polarised). If you pass it through a second slit at 45°, the brightness dims. At 90° (horizontal), nothing gets through. Rotating the crystal is like rotating the second slit — finding the angle where both polarisations match tells you the direction of the first slit (the sun).',
      storyConnection: 'The Viking sunstone — likely calcite from Iceland — could determine the sun\'s position to within 1° accuracy, even through overcast skies. This was critical for North Atlantic crossings where clouds could obscure the sky for days. Without the sunstone, the navigator had no directional reference and would drift off course.',
      checkQuestion: 'If the sun is directly behind you, and you look at the sky straight ahead (180° from the sun), is the sky polarised?',
      checkAnswer: 'Minimally. Maximum polarisation occurs at 90° from the sun\'s direction. At 180° (directly opposite), the light has scattered through a wide range of angles, mixing the polarisation directions. The strongest polarisation is in a ring at 90° from the sun.',
      codeIntro: 'Model sky polarisation patterns and simulate how a calcite sunstone detects the sun\'s position.',
      code: `import numpy as np

def sky_polarisation(sun_azimuth, sun_altitude, observer_azimuth, observer_altitude):
    """
    Calculate the degree of polarisation of skylight at a given
    direction, based on the angle from the sun.

    Maximum polarisation occurs at 90° from the sun.
    """
    # Convert to radians
    sun_az, sun_alt = np.radians(sun_azimuth), np.radians(sun_altitude)
    obs_az, obs_alt = np.radians(observer_azimuth), np.radians(observer_altitude)

    # Angular distance between sun and observation direction
    # Using the spherical law of cosines
    cos_angle = (np.sin(sun_alt) * np.sin(obs_alt) +
                 np.cos(sun_alt) * np.cos(obs_alt) *
                 np.cos(sun_az - obs_az))
    angle = np.arccos(np.clip(cos_angle, -1, 1))
    angle_deg = np.degrees(angle)

    # Degree of polarisation (Rayleigh model)
    # Maximum at 90° from sun, zero at 0° and 180°
    polarisation = np.sin(angle)**2 / (1 + np.cos(angle)**2)

    return polarisation, angle_deg

# Sun position: hidden behind clouds at azimuth 250° (WSW), altitude 15°
sun_az = 250
sun_alt = 15

# Scan the sky in all directions at 30° altitude
print(f"=== Sky Polarisation Pattern ===")
print(f"Sun position: azimuth {sun_az}°, altitude {sun_alt}° (hidden by clouds)")
print(f"Scanning at altitude 30°:")
print(f"\\n{'Observer Az':>12} {'Direction':>10} {'Angle from Sun':>16} {'Polarisation':>14}")
print("-" * 54)

for obs_az in range(0, 360, 30):
    pol, angle = sky_polarisation(sun_az, sun_alt, obs_az, 30)
    # Direction label
    dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    direction = dirs[obs_az // 22 % 16] if obs_az % 30 == 0 else ""
    bar = "█" * int(pol * 20)
    print(f"{obs_az:>10}° {direction:>10} {angle:>14.0f}° {pol:>12.2f} {bar}")

# Simulate sunstone detection
print(f"\\n=== Sunstone Detection Simulation ===")
print("Navigator rotates crystal at each sky direction.")
print("Maximum polarisation direction → sun's bearing.")

max_pol = 0
max_az = 0
for obs_az in range(0, 360, 5):
    pol, _ = sky_polarisation(sun_az, sun_alt, obs_az, 30)
    if pol > max_pol:
        max_pol = pol
        max_az = obs_az

# The sun is 90° from the maximum polarisation direction
sun_estimate = (max_az + 90) % 360  # or (max_az - 90) % 360
sun_estimate2 = (max_az - 90) % 360

print(f"\\nMaximum polarisation found at azimuth: {max_az}°")
print(f"Sun must be 90° from this → azimuth {sun_estimate}° or {sun_estimate2}°")
print(f"Actual sun azimuth: {sun_az}°")
print(f"Error: {min(abs(sun_estimate - sun_az), abs(sun_estimate2 - sun_az))}°")
print(f"(A skilled navigator resolves the ambiguity using the sun's")
print(f" expected position based on time of day.)")`,
      challenge: 'Simulate the effect of cloud cover: reduce the overall polarisation by 50% (multiply all values by 0.5) and add random noise (±0.05). Can the sunstone still find the sun through heavy clouds? (Yes, but with reduced accuracy. Modern experiments show accuracy degrades from ±1° to ±3-4° through heavy overcast.)',
      successHint: 'You modeled light polarisation and simulated the Viking sunstone — connecting atmospheric optics, crystal physics, and practical navigation. The same polarisation physics is used in LCD screens, sunglasses, camera filters, and quantum computing. The Vikings used it to cross oceans.',
    },
    {
      title: 'Signal detection theory — finding an island in an ocean',
      concept: `A typical Pacific island is 10 km wide. The Pacific Ocean is 15,000 km across. Finding the island by sailing randomly is nearly impossible — like finding a coin in a football field.

**Signal detection theory** (developed for radar in WWII) addresses this: how do you detect a weak signal (the island) against a noisy background (the featureless ocean)?

The key concept is the **detection zone**: the area around the island where at least one signal (waves, birds, clouds, water colour) becomes detectable. A 10 km island with a 100 km detection radius has an effective target of **200 km diameter** — a 20× expansion.

The probability of detecting the island depends on: **signal strength** (how obvious the sign is), **noise level** (how variable the normal ocean is), and the **observer's sensitivity** (how trained the navigator is).

📚 *Signal detection theory is used in medicine (detecting tumours in X-rays), radar (detecting aircraft), spam filtering (detecting junk email), and machine learning (classification). The mathematics is identical whether you're detecting an island, a tumour, or a spam email.*`,
      analogy: 'Metal detectors at the beach: the detector beeps more strongly when closer to metal. But it also beeps from random noise (minerals, interference). You need the signal from the metal to be strong enough to distinguish from the noise. Closer = stronger signal = easier to detect. Same with islands: closer = stronger wave disturbance = more certain detection.',
      storyConnection: 'Polynesian navigators used EVERY available signal — waves, birds, clouds, water colour, floating debris, smell — simultaneously. Each individual signal might be weak and ambiguous, but multiple weak signals from the same direction create a strong, reliable combined detection. This is multi-sensor fusion — the same principle used in self-driving cars.',
      checkQuestion: 'If a navigator can detect wave disturbance at 50 km, seabirds at 80 km, and cloud buildup at 120 km, what is the effective detection radius?',
      checkAnswer: '120 km — the maximum of all detection ranges. But using all three signals together increases CONFIDENCE at shorter ranges (inside 50 km, all three signals are active, making detection nearly certain). Multiple independent signals are more reliable than a single strong one.',
      codeIntro: 'Model the probability of detecting an island as a function of distance, signal types, and navigator skill.',
      code: `import numpy as np

np.random.seed(42)

def detection_probability(distance_km, island_size_km, signals):
    """
    Calculate the probability of detecting an island at a given distance.
    Each signal has a max range and a strength that decays with distance.
    Combine signals using the "at least one" probability rule.
    """
    # Probability of NOT detecting with each signal
    prob_miss_all = 1.0

    for signal in signals:
        if distance_km > signal["range_km"]:
            continue  # out of range for this signal

        # Signal strength decays with distance (inverse square for most)
        signal_strength = signal["base_strength"] * (signal["range_km"] / max(distance_km, 1))**2
        signal_strength = min(signal_strength, 0.99)  # cap at 99%

        # Add noise (harder to detect in rough conditions)
        noise = signal.get("noise", 0.1)
        detection_prob = signal_strength * (1 - noise)

        prob_miss_all *= (1 - detection_prob)

    return 1 - prob_miss_all  # probability of detecting at least one signal

# Define detection signals
signals = [
    {"name": "Wave disturbance", "range_km": 60, "base_strength": 0.4, "noise": 0.15},
    {"name": "Cloud buildup", "range_km": 120, "base_strength": 0.3, "noise": 0.25},
    {"name": "Seabird range", "range_km": 80, "base_strength": 0.5, "noise": 0.10},
    {"name": "Water colour", "range_km": 30, "base_strength": 0.6, "noise": 0.20},
    {"name": "Floating debris", "range_km": 40, "base_strength": 0.3, "noise": 0.30},
    {"name": "Vegetation smell", "range_km": 20, "base_strength": 0.7, "noise": 0.15},
]

island_size = 10  # km

print("=== Island Detection Probability ===")
print(f"Island size: {island_size} km")
print(f"Signals available: {len(signals)}")
print()

# Detection probability at different distances
print(f"{'Distance (km)':>14} {'P(detect)':>10} {'Confidence':>12}")
print("-" * 38)

for d in [150, 120, 100, 80, 60, 50, 40, 30, 20, 10, 5]:
    prob = detection_probability(d, island_size, signals)
    conf = "Certain" if prob > 0.95 else "High" if prob > 0.7 else "Moderate" if prob > 0.4 else "Low" if prob > 0.1 else "None"
    bar = "█" * int(prob * 20)
    print(f"{d:>12} km {prob:>8.1%} {conf:>12} {bar}")

# Which signal contributes most at each range?
print(f"\\n=== Dominant Signal by Distance ===")
for d in [100, 60, 30, 10]:
    best_signal = None
    best_prob = 0
    for sig in signals:
        if d <= sig["range_km"]:
            p = sig["base_strength"] * (sig["range_km"] / d)**2 * (1 - sig["noise"])
            p = min(p, 0.99)
            if p > best_prob:
                best_prob = p
                best_signal = sig["name"]
    if best_signal:
        print(f"  At {d:>3} km: {best_signal} (p = {best_prob:.0%})")

# Effective target expansion
print(f"\\n=== Target Expansion ===")
# Find distance where P(detect) > 50%
for d in range(200, 0, -1):
    if detection_probability(d, island_size, signals) > 0.5:
        print(f"50% detection range: {d} km")
        print(f"Effective target diameter: {2*d} km")
        print(f"Expansion factor: {2*d/island_size:.0f}× (from {island_size} km island)")
        break`,
      challenge: 'Simulate a "novice navigator" by doubling the noise for every signal. Then simulate an "expert" by halving it. Compare detection ranges. This shows why navigation was a highly trained specialization — sensitivity to weak signals was developed over years of practice.',
      successHint: 'You applied signal detection theory — the same mathematics used in radar, medical imaging, spam filtering, and machine learning classification. The core insight: multiple weak independent signals combine to create strong detection, and trained observers extract signal from noise more effectively than untrained ones.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Navigation science through code</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to model celestial navigation, dead reckoning, wave physics, and signal detection.
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
