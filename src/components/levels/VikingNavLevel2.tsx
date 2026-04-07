import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function VikingNavLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Spherical trigonometry — compute great circle distances and bearings',
      concept: `On a flat surface, the shortest path between two points is a straight line. On a sphere, it's an arc of a **great circle** — the circle formed by slicing through the sphere's centre. Every long-distance ocean crossing follows a great circle route.

The **haversine formula** calculates the great circle distance between two points given their latitudes and longitudes:

**a = sin²(Δlat/2) + cos(lat₁) × cos(lat₂) × sin²(Δlon/2)**
**d = 2R × arcsin(√a)**

Where R is the Earth's radius (~6,371 km). The **bearing** — the compass direction from the start point to the destination — requires a separate calculation using arctan2.

Viking navigators didn't have these formulas, but they understood the principle intuitively: sailing "straight" across the Atlantic meant following a curved path on the globe. Their star-based navigation naturally tracked this curve.

📚 *A great circle divides the sphere into two equal hemispheres. Any two points on a sphere (unless diametrically opposite) define exactly one great circle. The equator and all lines of longitude are great circles; lines of latitude (except the equator) are not.*`,
      analogy: 'Stretch a string taut between two points on a globe. The string follows the great circle — the shortest path over the curved surface. If you plotted that string\'s path on a flat map, it would look curved, even though it\'s the straightest possible route on the sphere. That\'s why transatlantic flights fly over Greenland instead of heading due east.',
      storyConnection: 'When Leif Eriksson sailed from Greenland to Vinland (Newfoundland), his route was a great circle arc spanning roughly 2,500 km. The bearing shifted continuously during the voyage — starting southwest and curving southward — which his navigators tracked using the sun\'s position at noon and the stars at night.',
      checkQuestion: 'Bergen, Norway is at 60.4°N, 5.3°E. Reykjavik, Iceland is at 64.1°N, 21.9°W. Is the great circle distance shorter or longer than the distance measured on a flat map?',
      checkAnswer: 'Shorter. A flat (Mercator) map distorts distances at high latitudes, making them appear larger. The actual great circle distance is about 1,490 km. A naive calculation on a Mercator map might suggest 1,600+ km. This distortion is exactly why great circle navigation matters — especially in the North Atlantic where the Vikings sailed.',
      codeIntro: 'Calculate great circle distances and initial bearings for key Viking routes using the haversine formula.',
      code: `import numpy as np

def haversine(lat1, lon1, lat2, lon2):
    """
    Great circle distance between two points (in degrees).
    Returns distance in km and initial bearing in degrees.
    """
    R = 6371.0  # Earth radius in km
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    dist = R * c

    # Initial bearing
    x = np.sin(dlon) * np.cos(lat2)
    y = np.cos(lat1) * np.sin(lat2) - np.sin(lat1) * np.cos(lat2) * np.cos(dlon)
    bearing = np.degrees(np.arctan2(x, y)) % 360

    return dist, bearing

# Key Viking voyage locations
places = {
    "Bergen":     (60.39, 5.32),
    "Reykjavik":  (64.13, -21.90),
    "Brattahlid": (61.15, -45.52),   # Eastern Greenland settlement
    "L'Anse Meadows": (51.59, -55.53),  # Vinland (Newfoundland)
    "Faroe Is.":  (62.01, -6.77),
    "Trondheim":  (63.43, 10.40),
}

routes = [
    ("Bergen", "Faroe Is."),
    ("Faroe Is.", "Reykjavik"),
    ("Bergen", "Reykjavik"),
    ("Reykjavik", "Brattahlid"),
    ("Brattahlid", "L'Anse Meadows"),
    ("Bergen", "L'Anse Meadows"),    # Full transatlantic
]

print("=== Viking Great Circle Routes ===")
print(f"{'Route':<35} {'Distance':>10} {'Bearing':>10} {'Direction':>12}")
print("-" * 69)

total_stepping = 0
for start, end in routes:
    lat1, lon1 = places[start]
    lat2, lon2 = places[end]
    dist, bearing = haversine(lat1, lon1, lat2, lon2)

    # Cardinal direction
    dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    cardinal = dirs[int((bearing + 22.5) % 360 / 45)]

    print(f"{start} -> {end:<17} {dist:>8.0f} km {bearing:>8.1f}° {cardinal:>10}")
    if start != "Bergen" or end != "L'Anse Meadows":
        if routes.index((start, end)) < 5:
            total_stepping += dist

print(f"\\nStepping-stone total (Bergen->Vinland via stops): {total_stepping:.0f} km")
direct, _ = haversine(*places["Bergen"], *places["L'Anse Meadows"])
print(f"Direct great circle (Bergen->Vinland):             {direct:.0f} km")
print(f"Overhead from island-hopping: {(total_stepping/direct - 1)*100:.1f}%")`,
      challenge: 'The Vikings also sailed south to Constantinople (Istanbul: 41.0°N, 29.0°E) via rivers and the Black Sea, but the sea route around Iberia is much longer. Calculate both the direct great circle distance and the coastal route distance (Bergen -> Scotland -> Biscay -> Gibraltar -> Mediterranean). Why did the Vikings prefer the river route?',
      successHint: 'The haversine formula is used in every GPS device, mapping application, and flight planning system. You just computed the same distances that Viking navigators estimated using the sun, stars, and accumulated experience — remarkable accuracy given they had no instruments beyond a sun compass.',
    },
    {
      title: 'Precession — model how the celestial pole moves over 26,000 years',
      concept: `The Earth's axis doesn't point at a fixed spot in the sky — it slowly traces a circle over **25,772 years**. This is **axial precession**, caused by the gravitational pull of the Sun and Moon on the Earth's equatorial bulge.

Today, Polaris (the North Star) sits within 1° of the celestial north pole. But in 3000 BCE, the pole star was Thuban (in Draco). In 14,000 CE, it will be Vega (in Lyra). The Vikings (around 1000 CE) were lucky: Polaris was within about 6° of the pole — close enough to be useful for rough navigation, though not as accurate as it is today.

The precession formula models the pole's position as a circle on the celestial sphere:

**RA_pole(t) = RA₀ + 360° × (t - t₀) / 25772**
**Dec_pole(t) ≈ 90° - ε × cos(RA_pole(t) - RA_ecliptic_pole)**

Where ε ≈ 23.44° is the obliquity (tilt of Earth's axis).

📚 *Precession means star charts go out of date. A star catalogue from 1000 CE has different right ascension and declination values than one from today. Astronomers must "precess" coordinates to the current epoch.*`,
      analogy: 'Spin a top on a table. As it slows, the top\'s axis starts to wobble — tracing a cone in the air. The Earth does the same thing, just very slowly: one full wobble every 25,772 years. The axis points at different stars as it traces this cone, changing which star is the "North Star" over millennia.',
      storyConnection: 'Viking navigators relied on the pole star to determine north and estimate latitude. In 1000 CE, Polaris was about 6° from the true pole — a noticeable offset that experienced navigators would have corrected for. Earlier Norse sailors (500-700 CE) had an even worse pole star alignment, making celestial navigation harder and partly explaining why the major Atlantic crossings happened later.',
      checkQuestion: 'If Polaris is 6° from the true celestial pole, what error does this introduce in a latitude measurement taken at night?',
      checkAnswer: 'Up to ±6° — depending on the time of night (Polaris circles the pole). At high latitudes, 1° of latitude = 111 km, so ±6° could mean ±666 km of position error if uncorrected. Experienced Viking navigators knew to observe Polaris at specific times (when it was directly above or below the pole) to minimize this error.',
      codeIntro: 'Model axial precession and track the pole star over 26,000 years — find what the Vikings saw.',
      code: `import numpy as np

def precess_pole(year):
    """
    Calculate the approximate celestial pole position for a given year.
    Returns (RA in hours, Dec in degrees) of the north celestial pole
    projected on the ecliptic-based precession circle.
    """
    # Precession period
    P = 25772  # years
    # Reference: J2000.0 (year 2000)
    t = year - 2000.0

    # Obliquity of the ecliptic
    epsilon = 23.44  # degrees

    # RA of the ecliptic north pole: 18h (270°)
    ra_ecliptic = 270.0  # degrees

    # Precession angle from J2000
    prec_angle = 360.0 * t / P

    # Pole traces a circle of radius epsilon around the ecliptic pole
    ra_pole = ra_ecliptic + epsilon * np.sin(np.radians(prec_angle))
    dec_pole = 90.0 - epsilon + epsilon * np.cos(np.radians(prec_angle))

    # Normalize RA to 0-360
    ra_pole = ra_pole % 360
    ra_hours = ra_pole / 15.0  # convert to hours

    return ra_hours, dec_pole

# Notable stars near the precession circle
pole_stars = [
    ("Polaris (alpha UMi)", 2.53, 89.26, "Current pole star"),
    ("Thuban (alpha Dra)", 14.07, 64.38, "Pole star ~2700 BCE"),
    ("Vega (alpha Lyr)", 18.62, 38.78, "Pole star ~14000 CE"),
    ("Kochab (beta UMi)", 14.85, 74.16, "Pole star ~1500 BCE"),
    ("Alderamin (alpha Cep)", 21.31, 62.59, "Pole star ~7500 CE"),
]

print("=== Celestial Pole Position Through History ===")
print(f"{'Year':<12} {'Pole RA (h)':>12} {'Pole Dec (°)':>13} {'Nearest Star':>20}")
print("-" * 59)

key_years = [-3000, -1500, 0, 500, 1000, 1500, 2000, 4000, 7500, 14000]
for year in key_years:
    ra, dec = precess_pole(year)

    # Find nearest notable star
    min_dist = 999
    nearest = "none"
    for name, star_ra, star_dec, _ in pole_stars:
        # Angular distance (simplified)
        dra = abs(ra - star_ra) * 15 * np.cos(np.radians(dec))
        ddec = abs(dec - star_dec)
        dist = np.sqrt(dra**2 + ddec**2)
        if dist < min_dist:
            min_dist = dist
            nearest = name.split("(")[0].strip()

    label = f"  [{nearest}]" if min_dist < 20 else ""
    yr_label = f"{abs(year)} BCE" if year < 0 else f"{year} CE"
    print(f"{yr_label:<12} {ra:>10.2f}h {dec:>11.2f}° {nearest:>18}")

# Viking era analysis
print("\\n=== Viking Era Pole Star Analysis (800-1100 CE) ===")
for year in [800, 900, 1000, 1100]:
    ra, dec = precess_pole(year)
    # Angular distance to Polaris
    polaris_ra, polaris_dec = 2.53, 89.26
    dra = abs(ra - polaris_ra) * 15 * np.cos(np.radians(dec))
    ddec = abs(dec - polaris_dec)
    offset = np.sqrt(dra**2 + ddec**2)
    error_km = offset * 111  # km per degree of latitude
    print(f"  {year} CE: Polaris offset ~ {offset:.1f}°"
          f" (latitude error if uncorrected: ±{error_km:.0f} km)")`,
      challenge: 'In what year will Polaris be CLOSEST to the true celestial pole? (It\'s not today — Polaris is still approaching.) Search year-by-year from 2000 to 2200 and find the minimum offset. This is useful for understanding why modern Polaris-based navigation is so accurate.',
      successHint: 'Precession affects every astronomical measurement. All star catalogues must specify their "epoch" (reference date) and coordinates must be precessed to the observation date. You modelled the same effect that forced ancient navigators to update their star knowledge across generations.',
    },
    {
      title: 'Ocean current modeling — map North Atlantic currents and their effect on navigation',
      concept: `The North Atlantic has a complex system of currents that profoundly affected Viking voyages:

- **Gulf Stream**: warm, fast (up to 9 km/h), flows northeast from the Gulf of Mexico toward Europe
- **North Atlantic Current**: continuation of the Gulf Stream toward Norway and Iceland
- **East Greenland Current**: cold, flows south along Greenland's east coast
- **Irminger Current**: branches off toward Iceland's south coast

A ship sailing at 5 knots (~9 km/h) in a 2-knot current can have its effective speed range from 3 to 7 knots depending on direction. Over a 10-day crossing, currents can push a ship **200+ km off course** if not accounted for.

We model currents as a **vector field**: at each point in the ocean, there's a current vector (speed and direction). The ship's actual velocity is the **vector sum** of its sailing velocity and the current.

📚 *A vector field assigns a vector (magnitude + direction) to every point in a region. Wind maps, ocean currents, and magnetic field lines are all vector fields.*`,
      analogy: 'Imagine walking across a moving escalator. Your actual path isn\'t straight across — you drift sideways with the escalator. If you don\'t compensate by angling your walk, you end up somewhere unexpected. A ship in a current faces the same problem: it must "aim off" to compensate for the sideways drift.',
      storyConnection: 'Viking navigators knew the major currents from experience. The sagas mention that ships sailing from Iceland to Greenland should "bear south" to compensate for the southward-flowing East Greenland Current. They also knew the North Atlantic Current helped ships returning from Greenland to Norway — a tailwind in the water.',
      checkQuestion: 'A ship sails due west at 8 km/h. The current flows south at 3 km/h. What is the ship\'s actual speed and direction?',
      checkAnswer: 'Actual speed = sqrt(8² + 3²) = sqrt(73) ≈ 8.5 km/h. Direction = arctan(3/8) = 20.6° south of west (heading about 250° on the compass). Over 24 hours, the ship travels 192 km west but drifts 72 km south — a significant deviation on a multi-day crossing.',
      codeIntro: 'Model North Atlantic ocean currents as a vector field and simulate how they deflect Viking voyages.',
      code: `import numpy as np

def ocean_current(lat, lon):
    """
    Simplified model of North Atlantic currents.
    Returns (east_component, north_component) in km/h.
    """
    # Gulf Stream / North Atlantic Current (flows NE, strongest 40-55°N)
    gulf_stream_strength = 4.0 * np.exp(-((lat - 50)**2) / 200)
    gs_east = gulf_stream_strength * 0.7
    gs_north = gulf_stream_strength * 0.5

    # East Greenland Current (flows S along Greenland, lon ~ -40 to -30)
    egc_strength = 2.5 * np.exp(-((lon + 35)**2) / 50) * np.exp(-((lat - 65)**2) / 100)
    egc_north = -egc_strength  # southward

    # Irminger Current (branches toward Iceland, ~63°N, -25°W)
    irm_strength = 1.5 * np.exp(-((lon + 25)**2) / 80) * np.exp(-((lat - 63)**2) / 50)
    irm_east = irm_strength * 0.3
    irm_north = irm_strength * 0.8

    return gs_east + irm_east, gs_north + egc_north + irm_north

def simulate_voyage(start_lat, start_lon, heading_deg, ship_speed_kmh,
                    days, dt_hours=1):
    """
    Simulate a voyage with ocean currents.
    heading_deg: compass heading (0=N, 90=E, 180=S, 270=W)
    Returns list of (lat, lon) positions.
    """
    lat, lon = start_lat, start_lon
    track = [(lat, lon)]
    heading_rad = np.radians(heading_deg)

    for step in range(int(days * 24 / dt_hours)):
        # Ship velocity (km/h)
        ship_east = ship_speed_kmh * np.sin(heading_rad)
        ship_north = ship_speed_kmh * np.cos(heading_rad)

        # Current at this position
        curr_east, curr_north = ocean_current(lat, lon)

        # Actual velocity
        v_east = ship_east + curr_east
        v_north = ship_north + curr_north

        # Update position (approximate: 1° lat ≈ 111 km)
        lat += v_north * dt_hours / 111.0
        lon += v_east * dt_hours / (111.0 * np.cos(np.radians(lat)))
        track.append((lat, lon))

    return track

# Simulate key Viking routes
print("=== Viking Voyage Simulations (with ocean currents) ===\\n")

voyages = [
    ("Iceland to Greenland", 64.1, -21.9, 260, 9.0, 5),
    ("Greenland to Vinland", 61.2, -45.5, 200, 8.0, 8),
    ("Norway to Iceland", 60.4, 5.3, 290, 9.0, 7),
]

for name, lat0, lon0, heading, speed, days in voyages:
    track = simulate_voyage(lat0, lon0, heading, speed, days)
    final_lat, final_lon = track[-1]

    # Compare to no-current case
    no_curr_lat = lat0 + speed * np.cos(np.radians(heading)) * days * 24 / 111
    no_curr_lon = lon0 + speed * np.sin(np.radians(heading)) * days * 24 / (111 * np.cos(np.radians(lat0)))

    drift_lat = (final_lat - no_curr_lat) * 111  # km
    drift_lon = (final_lon - no_curr_lon) * 111 * np.cos(np.radians(final_lat))
    total_drift = np.sqrt(drift_lat**2 + drift_lon**2)

    print(f"{name} ({days} days at {speed} km/h, heading {heading}°):")
    print(f"  Start:     {lat0:.1f}°N, {abs(lon0):.1f}°W")
    print(f"  End:       {final_lat:.1f}°N, {abs(final_lon):.1f}°W")
    print(f"  No-current end: {no_curr_lat:.1f}°N, {abs(no_curr_lon):.1f}°W")
    print(f"  Current drift:  {total_drift:.0f} km ({drift_lat:.0f} km N/S, {drift_lon:.0f} km E/W)")
    print()`,
      challenge: 'Try different headings for the Iceland-to-Greenland route. What heading compensates for the southward East Greenland Current and lands closest to Brattahlid (61.2°N, 45.5°W)? This is the "crab angle" problem — aiming north of your target so the current carries you onto it.',
      successHint: 'Ocean current modeling is used by shipping companies to plan fuel-efficient routes, by coast guards for search and rescue, and by climate scientists to model heat transport. The vector addition of ship velocity and current velocity is the same physics used in aircraft wind correction — a fundamental navigation skill.',
    },
    {
      title: 'Birefringence physics — model how calcite splits light into two polarized beams',
      concept: `Iceland spar (calcite crystal) has a remarkable optical property: **birefringence** — it splits incoming light into two beams, each **polarized** in a different direction. When you look through calcite, you see double images.

Light is a transverse wave — it vibrates perpendicular to its direction of travel. In **unpolarized** light, vibrations occur in all perpendicular directions. A polarizing material filters out all vibrations except one direction.

In a birefringent crystal, light splits into an **ordinary ray** (follows Snell's law normally) and an **extraordinary ray** (bends differently depending on its angle to the crystal's optical axis). Each ray is polarized perpendicular to the other.

**n_ordinary = 1.658** (constant for calcite)
**n_extraordinary = 1.486** (varies with angle to optic axis)

The difference Δn = 0.172 is one of the largest of any natural mineral — which is why calcite produces such dramatic double images.

📚 *Birefringence means "double refraction." The refractive index depends on the polarization direction of the light. This causes light to split into two beams inside the crystal.*`,
      analogy: 'Imagine a fence with vertical slats. A rope threaded through the slats can only wave up and down — horizontal waves are blocked. The fence is a polarizer. Calcite is like TWO fences at different angles, each letting through a different wave direction — the light splits into two beams going in slightly different directions.',
      storyConnection: 'The Viking sagas mention a "sunstone" (solarsteinn) used to find the sun\'s position on cloudy days. The leading theory is that this was Iceland spar — calcite. Because skylight is partially polarized, a birefringent crystal can detect the sun\'s direction even through overcast by comparing the brightness of its two beams. Experiments have shown this works to within 1° accuracy.',
      checkQuestion: 'If calcite has n_ordinary = 1.658 and n_extraordinary = 1.486, and a ray enters at 30° to the surface, at what angles do the two rays emerge inside the crystal?',
      checkAnswer: 'Using Snell\'s law (n₁ sin θ₁ = n₂ sin θ₂) with n₁ = 1 (air): Ordinary ray: sin θ = sin(30°)/1.658 = 0.301, θ = 17.5°. Extraordinary ray: sin θ = sin(30°)/1.486 = 0.336, θ = 19.7°. The two rays separate by 2.2° — enough to produce a visible double image.',
      codeIntro: 'Model birefringence in calcite — calculate ray splitting, polarization, and the sunstone navigation effect.',
      code: `import numpy as np

def snell_refraction(theta_i_deg, n1, n2):
    """Apply Snell's law. Returns refracted angle in degrees."""
    theta_i = np.radians(theta_i_deg)
    sin_t = n1 * np.sin(theta_i) / n2
    if abs(sin_t) > 1:
        return None  # total internal reflection
    return np.degrees(np.arcsin(sin_t))

# Calcite optical properties
n_o = 1.658   # ordinary index
n_e = 1.486   # extraordinary index (max birefringence)
delta_n = n_o - n_e

print("=== Calcite Birefringence Model ===")
print(f"Ordinary index:      {n_o}")
print(f"Extraordinary index: {n_e}")
print(f"Birefringence Δn:    {delta_n:.3f}\\n")

# Ray splitting at different incidence angles
print("=== Double Refraction vs Incidence Angle ===")
print(f"{'Incidence':>10} {'Ordinary':>10} {'Extraord.':>11} {'Separation':>12}")
print("-" * 45)

for theta_i in range(0, 85, 5):
    theta_o = snell_refraction(theta_i, 1.0, n_o)
    theta_e = snell_refraction(theta_i, 1.0, n_e)
    if theta_o is not None and theta_e is not None:
        sep = abs(theta_e - theta_o)
        print(f"{theta_i:>8}° {theta_o:>9.2f}° {theta_e:>10.2f}° {sep:>10.2f}°")

# Sunstone navigation model
print("\\n=== Sunstone Navigation Accuracy ===")
print("Finding the sun through overcast using polarized skylight\\n")

def skylight_polarization(sun_angle_deg, sky_point_angle_deg):
    """
    Degree of polarization of skylight at a given angular distance
    from the sun. Rayleigh scattering gives maximum polarization
    at 90° from the sun.
    """
    gamma = np.radians(sky_point_angle_deg - sun_angle_deg)
    p = (1 - np.cos(gamma)**2) / (1 + np.cos(gamma)**2)
    return max(0, p)

# Simulate scanning the sky with a sunstone
sun_true = 45.0  # true sun azimuth (degrees)
scan_angles = np.arange(0, 180, 1)

print(f"True sun position: {sun_true}° azimuth")
print(f"{'Scan angle':>11} {'Polarization':>13} {'Brightness ratio':>17}")
print("-" * 43)

max_pol = 0
best_angle = 0
for angle in [0, 20, 40, 45, 50, 60, 80, 90, 120, 135, 160]:
    pol = skylight_polarization(sun_true, angle)
    # In calcite, the two beams differ in brightness by the polarization fraction
    ratio = (1 + pol) / (1 - pol + 0.01)
    if pol > max_pol:
        max_pol = pol
        best_angle = angle
    print(f"{angle:>9}° {pol:>12.3f} {ratio:>15.2f}")

print(f"\\nMax polarization at {best_angle}° from sun")
print(f"Sun is 90° from max polarization point: estimated at {(best_angle - 90) % 360}° or {(best_angle + 90) % 360}°")
print(f"Accuracy: within ~{abs(best_angle - 90 - sun_true):.0f}° of true position")`,
      challenge: 'The sunstone technique works best when the sky is partly polarized (thin overcast). Thick clouds destroy polarization. Model how cloud thickness affects detection accuracy by adding a "depolarization factor" (0 = clear sky, 1 = fully depolarized). At what cloud thickness does the sunstone become useless?',
      successHint: 'Birefringence is used in modern technology everywhere: LCD screens use polarized light, optical microscopes use birefringent filters, and telecommunications use polarization-maintaining fibres. You modelled the same physics that may have given the Vikings a navigation advantage over every other maritime culture of their era.',
    },
    {
      title: 'Kalman filtering — combine star fixes with dead reckoning for optimal position estimates',
      concept: `A Viking navigator had two ways to estimate position:

1. **Dead reckoning**: track speed and direction continuously to calculate position from the last known point. Accurate short-term, but errors accumulate over time.
2. **Star/sun fixes**: measure latitude from celestial observations. Accurate at the moment of observation, but only available when the sky is clear.

The **Kalman filter** is the mathematically optimal way to combine these two sources. It maintains a **state estimate** (position + velocity) and an **uncertainty** (how confident we are). At each time step:

- **Predict**: advance the state using dead reckoning, and INCREASE uncertainty (errors accumulate)
- **Update**: when a star fix is available, correct the state and DECREASE uncertainty (new information reduces doubt)

**K = P_predicted / (P_predicted + R)**

Where P is the uncertainty of the prediction and R is the measurement noise. K (the Kalman gain) determines how much to trust the new measurement vs the prediction.

📚 *The Kalman filter is used in every GPS receiver, every autopilot, every spacecraft navigation system. It was invented in 1960 and is arguably the most important algorithm in estimation theory.*`,
      analogy: 'You\'re walking through fog with a map and a compass. With each step, you mark your estimated position on the map (dead reckoning) — but small errors in direction and step length accumulate. Occasionally the fog clears and you spot a landmark (star fix) — you correct your position. The Kalman filter tells you exactly how much to trust the landmark vs your accumulated steps.',
      storyConnection: 'Viking navigators did exactly this — intuitively. During cloudy days, they relied on dead reckoning: counting waves, estimating speed from the feel of the hull, and tracking the bearing from the last sun sighting. When the sky cleared, a star or sun observation would "reset" their confidence. The Kalman filter formalizes this ancient practice into precise mathematics.',
      checkQuestion: 'After 3 days of dead reckoning (no star fixes), your position uncertainty has grown to ±50 km. You take a star fix with ±5 km accuracy. What does the Kalman filter say your new uncertainty should be?',
      checkAnswer: 'K = 50²/(50² + 5²) = 2500/2525 ≈ 0.99. New uncertainty = (1 - K) × 50² ≈ 0.01 × 2500 = 25, so √25 ≈ 5 km. The star fix almost completely overrides the dead reckoning — because the dead reckoning is so uncertain compared to the fix. The new estimate is 99% the star fix, 1% the dead reckoning.',
      codeIntro: 'Implement a 1D Kalman filter that fuses dead reckoning with periodic star fixes for Viking navigation.',
      code: `import numpy as np

np.random.seed(42)

def kalman_1d(measurements, dt=1.0, process_noise=5.0, meas_noise=10.0,
              speed=8.0, meas_available=None):
    """
    1D Kalman filter for position estimation.
    measurements: observed positions (star fixes) — may be None for cloudy periods.
    speed: assumed constant sailing speed (km/h).
    process_noise: dead reckoning uncertainty growth per step.
    meas_noise: star fix measurement uncertainty.
    meas_available: boolean array — True when a star fix is available.
    """
    n = len(measurements)
    x = measurements[0] if measurements[0] is not None else 0  # initial state
    P = meas_noise**2  # initial uncertainty

    estimates = []
    uncertainties = []
    gains = []

    for i in range(n):
        # PREDICT: advance by dead reckoning
        x_pred = x + speed * dt
        P_pred = P + process_noise**2

        # UPDATE: if measurement available, correct
        if meas_available is not None and meas_available[i]:
            K = P_pred / (P_pred + meas_noise**2)
            x = x_pred + K * (measurements[i] - x_pred)
            P = (1 - K) * P_pred
        else:
            x = x_pred
            P = P_pred
            K = 0

        estimates.append(x)
        uncertainties.append(np.sqrt(P))
        gains.append(K)

    return estimates, uncertainties, gains

# Simulate a 10-day Viking crossing with intermittent star fixes
days = 10
hours = days * 24
speed_kmh = 8.0
true_positions = np.array([speed_kmh * h for h in range(hours)])

# Add noise to true position (actual path deviates from straight line)
true_positions += np.cumsum(np.random.normal(0, 0.5, hours))

# Star fixes available only some hours (clear sky ~30% of time)
fix_available = np.random.random(hours) < 0.3
# No fixes at night (assume 12h daylight at 65°N summer)
for h in range(hours):
    if h % 24 > 12:  # nighttime — sun fixes unavailable
        fix_available[h] = False

# Generate noisy measurements
star_fixes = true_positions + np.random.normal(0, 10, hours)

# Run Kalman filter
estimates, uncertainties, gains = kalman_1d(
    star_fixes, dt=1.0, process_noise=3.0, meas_noise=10.0,
    speed=speed_kmh, meas_available=fix_available
)

# Report at daily intervals
print("=== Kalman Filter: Viking Position Estimation ===")
print(f"Ship speed: {speed_kmh} km/h | Star fixes available ~30% of daylight hours\\n")
print(f"{'Day':>4} {'True pos':>10} {'Estimated':>10} {'Error':>8} {'Uncertainty':>12} {'Fixes today':>12}")
print("-" * 58)

for day in range(days):
    h = (day + 1) * 24 - 1  # end of day
    true = true_positions[h]
    est = estimates[h]
    err = abs(est - true)
    unc = uncertainties[h]
    fixes = sum(fix_available[day*24:(day+1)*24])
    print(f"{day+1:>4} {true:>9.0f} km {est:>9.0f} km {err:>6.1f} km {unc:>10.1f} km {fixes:>10}")

# Summary
errors = np.abs(np.array(estimates) - true_positions)
print(f"\\nMean position error: {np.mean(errors):.1f} km")
print(f"Max position error:  {np.max(errors):.1f} km")
print(f"Dead reckoning only would give: ~{3.0 * np.sqrt(hours):.0f} km uncertainty")
print(f"Kalman filter reduces this to: ~{uncertainties[-1]:.0f} km")`,
      challenge: 'What happens during a 3-day storm with zero star fixes? Modify the code to have no fixes for hours 72-144 and observe how uncertainty balloons during the gap, then shrinks when fixes resume. This is exactly what happened to Viking ships in North Atlantic storms — and why multi-day storms were the most dangerous threat to navigation.',
      successHint: 'You just implemented the Kalman filter — the algorithm inside every GPS receiver, every drone autopilot, every spacecraft, and every self-driving car. It was developed for the Apollo moon missions and is one of the most impactful algorithms in history. The Vikings practiced the same principle by intuition; you now have the mathematics.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Navigation physics and computational methods</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 covers spherical trigonometry, axial precession, ocean currents, birefringence optics, and Kalman filtering.
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
