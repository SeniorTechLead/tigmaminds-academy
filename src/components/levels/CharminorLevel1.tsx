import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CharminorLevel1() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: "Earth's magnetic field — the invisible force that guides pigeons",
      concept: `The Earth generates a **magnetic field** that extends from the core out into space. This field has a **north pole** (near geographic north) and a **south pole** (near geographic south). At any point on Earth's surface, the field has both a **horizontal component** (pointing roughly toward magnetic north) and a **vertical component** (pointing downward in the Northern Hemisphere, upward in the Southern).

The field strength varies from about **25 microtesla** near the equator to **65 microtesla** near the poles. For comparison, a refrigerator magnet is about 5,000 microtesla — 100 times stronger. Yet birds, sea turtles, and even bacteria can detect Earth's faint field and use it for navigation.

Pigeons, like those that flock around Charminar, are among the best-studied magnetoreception animals. They can detect both the **direction** (which way is north) and the **intensity** (how strong the field is, which correlates with latitude) of the magnetic field.

📚 *A magnetic field is described by a vector at each point in space. The vector has magnitude (strength, in Tesla) and direction. At Earth's surface, the field vector points roughly toward magnetic north and downward (in the Northern Hemisphere), making an angle called the inclination or dip angle with the horizontal.*`,
      analogy: 'Imagine an invisible wind blowing from south to north everywhere on Earth. You cannot see it or feel it, but you have a tiny flag (compass needle) that always points into this wind. Birds have biological "flags" — microscopic magnetic crystals or chemical sensors — that detect this invisible magnetic wind and tell them which way is north.',
      storyConnection: 'The pigeons of Charminar in Hyderabad are famous — hundreds of them roost on the monument and fly across the city daily. Homing pigeons can navigate home from hundreds of kilometres away, even when transported in covered containers. Their primary navigation tool is Earth magnetic field, supplemented by visual landmarks, the sun position, and even smell. Understanding magnetoreception starts with understanding the field itself.',
      checkQuestion: 'At Hyderabad (latitude 17N), the magnetic field has a horizontal component of about 38 microtesla and a vertical component of about 22 microtesla. What is the total field strength?',
      checkAnswer: 'Total = sqrt(38^2 + 22^2) = sqrt(1444 + 484) = sqrt(1928) = 43.9 microtesla. The inclination (dip angle) = arctan(22/38) = 30 degrees below horizontal.',
      codeIntro: "Model Earth's magnetic field and calculate its properties at different locations.",
      code: `import numpy as np

# Earth's magnetic field model

def dipole_field(latitude_deg, B_equator=30e-6):
    """
    Simplified dipole model of Earth's magnetic field.
    Returns (B_horizontal, B_vertical, B_total, inclination_deg)
    """
    lat = np.radians(latitude_deg)
    # Horizontal component
    B_h = B_equator * np.cos(lat)
    # Vertical component (twice horizontal at poles)
    B_v = 2 * B_equator * np.sin(lat)
    # Total
    B_total = np.sqrt(B_h**2 + B_v**2)
    # Inclination (dip angle)
    inclination = np.degrees(np.arctan2(B_v, B_h))
    return B_h, B_v, B_total, inclination

print("=== Earth's Magnetic Field vs Latitude ===")
print(f"{'Location':<25} {'Lat':>5} {'B_h (uT)':>9} {'B_v (uT)':>9} "
      f"{'B_total':>8} {'Dip':>6}")
print("-" * 64)

locations = [
    ("Equator", 0), ("Hyderabad", 17), ("Cairo", 30),
    ("Rome", 42), ("London", 51), ("Moscow", 56),
    ("Reykjavik", 64), ("North Pole", 90),
    ("Cape Town", -34), ("Sydney", -34),
    ("South Pole", -90),
]

for name, lat in locations:
    Bh, Bv, Bt, inc = dipole_field(lat)
    print(f"{name:<25} {lat:>4} {Bh*1e6:>9.1f} {Bv*1e6:>9.1f} "
          f"{Bt*1e6:>8.1f} {inc:>5.1f}")

print()
print("=== Compass Behavior ===")
print("A compass needle aligns with B_horizontal (ignores B_vertical)")
print(f"{'Latitude':>10} {'B_h (uT)':>10} {'Compass usefulness'}")
print("-" * 42)
for lat in range(0, 91, 10):
    Bh, _, _, _ = dipole_field(lat)
    if Bh * 1e6 > 20:
        use = "excellent"
    elif Bh * 1e6 > 10:
        use = "good"
    elif Bh * 1e6 > 5:
        use = "poor"
    else:
        use = "useless (near pole)"
    print(f"{lat:>8} N {Bh*1e6:>10.1f} {use}")

print()
print("Near the poles, B_horizontal is too weak for a compass.")
print("Pigeons near the poles must rely more on other cues (sun, stars).")`,
      challenge: 'The magnetic pole is not at the geographic pole — it is offset by about 11 degrees. If the magnetic north pole is at 86N, 160W, calculate the declination (angle between magnetic and geographic north) at Hyderabad. How does this affect a compass reading?',
      successHint: "You just modeled Earth's magnetic field using the dipole approximation — the same model that navigators, geophysicists, and satellite engineers use. GPS devices include a magnetic field model (the World Magnetic Model) to convert between magnetic and true north.",
    },
    {
      title: 'Compass basics — converting magnetic field to direction',
      concept: `A **compass** works by allowing a magnetized needle to align with the horizontal component of Earth's magnetic field. The needle points toward **magnetic north**, which is close to but not exactly at geographic north. The angle between magnetic north and true north is called **declination** (or magnetic variation).

Declination varies with location: in Hyderabad, it is about 1 degree west. In some places, it can exceed 20 degrees. A navigator who ignores declination will drift off course — over a 100 km journey, a 10-degree error means arriving 17 km off target.

A pigeon's biological compass is even more remarkable than a metal needle. Research suggests pigeons use **cryptochrome proteins** in their eyes that are sensitive to magnetic field direction. These proteins change their chemical state depending on the field orientation, effectively giving the pigeon a visual overlay of magnetic information.

📚 *Declination is the angle between magnetic north (where the compass points) and true north (toward the geographic pole). It is positive when magnetic north is east of true north, and negative when it is west. Declination changes slowly over time as the magnetic poles shift.*`,
      analogy: 'Imagine you are in a room with an invisible fan blowing from one direction (magnetic north). A flag on a pole (compass needle) points toward the fan. But the door (true north) is in a slightly different direction. The angle between the flag and the door is the declination. To find the door, you must know this angle.',
      storyConnection: 'Pigeons navigating from the Charminar rooftop to their home lofts across Hyderabad use magnetic direction as one input to their navigation system. But they must also account for the magnetic declination — which in Hyderabad is small (about 1 degree) but in other locations can be much larger. Their biological systems integrate magnetic direction with sun position and landmarks to build a complete directional picture.',
      checkQuestion: 'A compass in Hyderabad reads 359 degrees (almost due north). The declination is 1 degree west. What is the true bearing?',
      checkAnswer: 'True bearing = compass bearing + declination (east positive). Declination is -1 degree (west). True = 359 + (-1) = 358 degrees. The true north is 2 degrees to the right of where the compass points.',
      codeIntro: 'Build a compass system that converts magnetic readings to true bearings.',
      code: `import numpy as np

# Compass navigation system

def magnetic_to_true(magnetic_bearing, declination):
    """Convert magnetic bearing to true bearing.
    Declination: positive = east, negative = west.
    """
    true_bearing = (magnetic_bearing + declination) % 360
    return true_bearing

def true_to_magnetic(true_bearing, declination):
    """Convert true bearing to magnetic bearing."""
    return (true_bearing - declination) % 360

def bearing_to_direction(bearing):
    """Convert numeric bearing to cardinal direction."""
    directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                   "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    idx = int((bearing + 11.25) / 22.5) % 16
    return directions[idx]

# Declination at various cities
declinations = {
    "Hyderabad": -0.7,
    "Mumbai": -0.8,
    "Delhi": -0.5,
    "London": -0.8,
    "New York": -13.0,
    "San Francisco": 13.5,
    "Moscow": 11.0,
    "Tokyo": -7.5,
    "Sydney": 12.0,
    "Sao Paulo": -21.5,
}

print("=== Declination at Major Cities ===")
print(f"{'City':<18} {'Declination':>12} {'Direction'}")
print("-" * 42)

for city, dec in sorted(declinations.items(), key=lambda x: x[1]):
    direction = "East" if dec > 0 else "West" if dec < 0 else "None"
    print(f"{city:<18} {dec:>+10.1f} deg  {direction}")

print()
# Navigation error from ignoring declination
print("=== Navigation Error from Ignoring Declination ===")
print("Walking 10 km on a compass bearing of 0 (magnetic north)")
print()
print(f"{'City':<18} {'Decl':>6} {'Actual heading':>15} {'Lateral error':>14}")
print("-" * 55)

distance_km = 10
for city, dec in declinations.items():
    actual_heading = magnetic_to_true(0, dec)
    # Lateral error = distance * sin(declination)
    error_km = distance_km * np.sin(np.radians(abs(dec)))
    error_m = error_km * 1000
    print(f"{city:<18} {dec:>+5.1f} {actual_heading:>13.1f} deg {error_m:>12.0f} m")

print()
# Compass rose
print("=== Compass Rose (Hyderabad, decl = -0.7 deg) ===")
print(f"{'True bearing':>13} {'Magnetic':>10} {'Direction':<6}")
print("-" * 32)

for true_b in range(0, 360, 45):
    mag_b = true_to_magnetic(true_b, -0.7)
    direction = bearing_to_direction(true_b)
    print(f"{true_b:>11} deg {mag_b:>8.1f} deg {direction}")

print()
# Pigeon homing compass
print("=== Pigeon Homing: Charminar to Destinations ===")
charminar = (17.3616, 78.4747)  # lat, lon

destinations = [
    ("Golconda Fort", 17.3833, 78.4011),
    ("Hussain Sagar", 17.4239, 78.4738),
    ("Airport", 17.2403, 78.4294),
    ("Secunderabad", 17.4399, 78.4983),
]

print(f"{'Destination':<20} {'Bearing':>8} {'Distance':>10}")
print("-" * 40)

for name, lat, lon in destinations:
    dlat = lat - charminar[0]
    dlon = lon - charminar[1]
    bearing = np.degrees(np.arctan2(dlon, dlat)) % 360
    dist = np.sqrt(dlat**2 + (dlon * np.cos(np.radians(charminar[0])))**2) * 111
    direction = bearing_to_direction(bearing)
    print(f"{name:<20} {bearing:>6.1f} ({direction:<3}) {dist:>7.1f} km")`,
      challenge: 'The magnetic pole moves about 50 km per year. If Hyderabad declination changes by 0.1 degree per decade, how much will it change in 100 years? Will this affect pigeon navigation? (Hint: pigeons recalibrate constantly, but long-lived magnetic maps might shift.)',
      successHint: 'Compass navigation is fundamental to all transportation. Every ship, aircraft, and smartphone uses magnetic declination corrections. The World Magnetic Model, updated every 5 years by NOAA and the British Geological Survey, provides the same declination data you just computed.',
    },
    {
      title: 'Coordinate systems — latitude, longitude, and bearing',
      concept: `Any location on Earth can be specified by two numbers: **latitude** (angle north or south of the equator, 0 to 90 degrees) and **longitude** (angle east or west of the Prime Meridian in Greenwich, 0 to 180 degrees). Together, these form a **coordinate system** that uniquely identifies every point on the globe.

A **bearing** is the direction from one point to another, measured as an angle clockwise from north (0 = north, 90 = east, 180 = south, 270 = west). To navigate from Charminar to any destination, you need the bearing (which direction to fly) and the distance (how far to fly).

Converting between coordinates and bearings requires **trigonometry on a sphere** — the math of curved surfaces. For short distances (under 100 km), you can approximate the Earth as flat. For longer distances, you must account for the curvature.

📚 *One degree of latitude is approximately 111 km everywhere on Earth. One degree of longitude is 111 km at the equator but shrinks to 0 km at the poles: longitude_km = 111 * cos(latitude). This is because the longitude circles (meridians) converge at the poles.*`,
      analogy: 'Think of latitude and longitude as the row and column numbers on a spreadsheet. Latitude is the row (how far up or down from the equator). Longitude is the column (how far east or west from Greenwich). Just as a cell address (row, column) uniquely identifies a cell, a coordinate (latitude, longitude) uniquely identifies a spot on Earth.',
      storyConnection: 'The Charminar stands at coordinates 17.3616N, 78.4747E. When a homing pigeon is released at an unfamiliar location, it must somehow determine its own coordinates and calculate the bearing and distance back to Charminar. Scientists believe pigeons build a "magnetic map" — using magnetic field intensity and inclination to estimate their latitude and longitude.',
      checkQuestion: 'Charminar is at 17.36N, 78.47E. Golconda Fort is at 17.38N, 78.40E. What is the approximate distance? (1 degree latitude = 111 km, 1 degree longitude at 17N = 111 * cos(17) = 106 km.)',
      checkAnswer: 'Latitude difference: (17.38-17.36) * 111 = 0.02 * 111 = 2.22 km north. Longitude difference: (78.40-78.47) * 106 = -0.07 * 106 = -7.42 km west. Distance = sqrt(2.22^2 + 7.42^2) = sqrt(4.9 + 55.1) = sqrt(60) = 7.7 km.',
      codeIntro: 'Calculate distances and bearings between locations using coordinate geometry.',
      code: `import numpy as np

# Coordinate geometry and navigation

def flat_earth_distance(lat1, lon1, lat2, lon2):
    """Approximate distance for short ranges (< 100 km)."""
    dlat = (lat2 - lat1) * 111.0  # km
    dlon = (lon2 - lon1) * 111.0 * np.cos(np.radians((lat1 + lat2) / 2))
    return np.sqrt(dlat**2 + dlon**2)

def flat_earth_bearing(lat1, lon1, lat2, lon2):
    """Approximate bearing for short ranges."""
    dlat = (lat2 - lat1) * 111.0
    dlon = (lon2 - lon1) * 111.0 * np.cos(np.radians((lat1 + lat2) / 2))
    bearing = np.degrees(np.arctan2(dlon, dlat)) % 360
    return bearing

def bearing_name(b):
    dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE",
            "S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return dirs[int((b + 11.25) / 22.5) % 16]

# Charminar coordinates
charminar = (17.3616, 78.4747)

# Hyderabad landmarks
landmarks = [
    ("Golconda Fort", 17.3833, 78.4011),
    ("Hussain Sagar", 17.4239, 78.4738),
    ("Birla Mandir", 17.4062, 78.4691),
    ("HiTec City", 17.4435, 78.3772),
    ("Rajiv Gandhi Airport", 17.2403, 78.4294),
    ("University of Hyderabad", 17.4604, 78.3340),
    ("Ramoji Film City", 17.2543, 78.6808),
]

print("=== Pigeon Navigation Table: From Charminar ===")
print(f"{'Destination':<25} {'Lat':>7} {'Lon':>7} {'Dist (km)':>10} {'Bearing':>8} {'Dir':<4}")
print("-" * 63)

for name, lat, lon in landmarks:
    dist = flat_earth_distance(charminar[0], charminar[1], lat, lon)
    bear = flat_earth_bearing(charminar[0], charminar[1], lat, lon)
    print(f"{name:<25} {lat:>7.3f} {lon:>7.3f} {dist:>10.1f} {bear:>7.1f} {bearing_name(bear)}")

print()
# How latitude/longitude resolution affects precision
print("=== Coordinate Precision ===")
print(f"{'Decimal places':>15} {'Resolution':>12} {'Example use'}")
print("-" * 50)

for dp, res, use in [
    (0, "111 km", "Country level"),
    (1, "11.1 km", "City level"),
    (2, "1.1 km", "Neighborhood"),
    (3, "111 m", "Street level"),
    (4, "11 m", "Building"),
    (5, "1.1 m", "Person"),
    (6, "0.11 m", "Surveying"),
]:
    print(f"{dp:>15} {res:>12} {use}")

print()
# Distance matrix between landmarks
print("=== Distance Matrix (km) ===")
all_places = [("Charminar", *charminar)] + [(n, la, lo) for n, la, lo in landmarks[:5]]

print(f"{'':>12}", end="")
for name, _, _ in all_places:
    print(f" {name[:8]:>8}", end="")
print()

for n1, la1, lo1 in all_places:
    print(f"{n1[:12]:<12}", end="")
    for n2, la2, lo2 in all_places:
        d = flat_earth_distance(la1, lo1, la2, lo2)
        print(f" {d:>8.1f}", end="")
    print()`,
      challenge: 'Calculate the coordinates of a point that is exactly 5 km due north and 3 km due east of Charminar. Then calculate the bearing from Charminar to that point. Verify by computing the inverse — the bearing from the new point back to Charminar should be 180 degrees different.',
      successHint: 'Coordinate geometry is the foundation of ALL navigation systems — from ancient celestial navigation to modern GPS. Every mapping app, every drone flight controller, and every autonomous vehicle uses the same latitude-longitude-bearing calculations you just performed.',
    },
    {
      title: 'Distance calculation — flat Earth vs curved Earth',
      concept: `For distances under about 10 km (like navigating within Hyderabad), the flat Earth approximation works well. But for longer distances — like a pigeon navigating from 200 km away — you must account for Earth's curvature.

The **Haversine formula** calculates the great-circle distance between two points on a sphere. It accounts for the curvature and gives accurate results for any distance. The formula uses the **law of cosines on a sphere**: d = R * arccos(sin(lat1)*sin(lat2) + cos(lat1)*cos(lat2)*cos(dlon)).

The Haversine version is numerically more stable: **a = sin^2(dlat/2) + cos(lat1)*cos(lat2)*sin^2(dlon/2)**, **d = 2R * arctan2(sqrt(a), sqrt(1-a))**.

📚 *A great circle is the largest circle that can be drawn on a sphere's surface — it divides the sphere into two equal halves. The shortest path between two points on a sphere follows a great circle. This is why airplane routes on a flat map look curved — they are following great circles.*`,
      analogy: 'Imagine stretching a string tightly between two points on a globe. The string follows the shortest path along the curved surface — a great circle. On a flat map, this path looks curved (which is why flights from London to Tokyo go over the Arctic). The Haversine formula calculates the length of this taut string.',
      storyConnection: 'A homing pigeon released 500 km from Charminar cannot navigate using flat-Earth math — the errors would be several kilometres. Instead, pigeons seem to navigate along near-great-circle routes, suggesting they somehow solve the spherical geometry problem. Their combination of magnetic map, sun compass, and visual landmarks achieves a navigation precision that GPS only recently matched.',
      checkQuestion: 'Using the flat Earth approximation, the distance from Hyderabad to Mumbai is about 620 km. Using the Haversine formula (proper sphere), it is 617 km. What is the error of the flat approximation?',
      checkAnswer: 'Error = (620 - 617) / 617 * 100 = 0.49%. For 600 km, the flat Earth error is less than 1% — still quite good. But for intercontinental distances, the error grows significantly.',
      codeIntro: 'Implement both flat and Haversine distance calculations and compare their accuracy.',
      code: `import numpy as np

# Distance calculations: flat vs Haversine

R_EARTH = 6371  # km

def flat_distance(lat1, lon1, lat2, lon2):
    """Flat Earth approximation."""
    dlat = (lat2 - lat1) * 111.0
    dlon = (lon2 - lon1) * 111.0 * np.cos(np.radians((lat1 + lat2) / 2))
    return np.sqrt(dlat**2 + dlon**2)

def haversine(lat1, lon1, lat2, lon2):
    """Haversine formula for great-circle distance."""
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    return 2 * R_EARTH * np.arctan2(np.sqrt(a), np.sqrt(1-a))

def initial_bearing(lat1, lon1, lat2, lon2):
    """Initial bearing along great circle route."""
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1
    x = np.sin(dlon) * np.cos(lat2)
    y = np.cos(lat1) * np.sin(lat2) - np.sin(lat1) * np.cos(lat2) * np.cos(dlon)
    return np.degrees(np.arctan2(x, y)) % 360

# Compare distances from Charminar to various cities
charminar = (17.3616, 78.4747)

cities = [
    ("Golconda Fort", 17.3833, 78.4011),
    ("Warangal", 17.9784, 79.5941),
    ("Vijayawada", 16.5062, 80.6480),
    ("Mumbai", 19.0760, 72.8777),
    ("Bangalore", 12.9716, 77.5946),
    ("Chennai", 13.0827, 80.2707),
    ("Delhi", 28.6139, 77.2090),
    ("Kolkata", 22.5726, 88.3639),
]

print("=== Flat vs Haversine Distance Comparison ===")
print(f"{'City':<18} {'Flat (km)':>10} {'Haversine':>10} {'Error %':>8} {'Bearing':>8}")
print("-" * 56)

for name, lat, lon in cities:
    d_flat = flat_distance(*charminar, lat, lon)
    d_haver = haversine(*charminar, lat, lon)
    error = abs(d_flat - d_haver) / d_haver * 100
    bearing = initial_bearing(*charminar, lat, lon)
    print(f"{name:<18} {d_flat:>10.1f} {d_haver:>10.1f} {error:>7.2f}% {bearing:>7.1f}")

print()
print("=== Error Growth with Distance ===")
# Show how flat Earth error grows
print(f"{'Distance (km)':>14} {'Flat error %':>13}")
print("-" * 29)

# Points due east at increasing distances
for target_km in [1, 10, 50, 100, 500, 1000, 2000, 5000]:
    dlon = target_km / (111 * np.cos(np.radians(charminar[0])))
    d_flat = flat_distance(charminar[0], charminar[1],
                           charminar[0], charminar[1] + dlon)
    d_haver = haversine(charminar[0], charminar[1],
                        charminar[0], charminar[1] + dlon)
    error = abs(d_flat - d_haver) / d_haver * 100
    print(f"{target_km:>12} km {error:>11.3f}%")

print()
print("Flat Earth works well under 100 km (error < 0.1%).")
print("For pigeon homing over 200+ km, Haversine is essential.")`,
      challenge: 'Calculate the great-circle distance from Hyderabad to New York (40.7128N, -74.0060W). Then calculate the initial bearing. Would a pigeon fly east or west? (Hint: the great circle route from India to the US east coast goes northeast over Central Asia and the Arctic, not west across the Pacific.)',
      successHint: 'The Haversine formula is used in every GPS device, every ride-sharing app (Uber/Ola distance calculation), every weather model, and every flight planning system. You just implemented the same distance algorithm that powers location-based technology worldwide.',
    },
    {
      title: 'Magnetic declination map — variation across the globe',
      concept: `The **declination** (angle between true north and magnetic north) varies dramatically across the globe. In some places it is near zero; in others it exceeds 20 degrees. A navigator who ignores declination could end up far off course.

The declination pattern is complex because Earth's magnetic field is not a perfect dipole. The field is generated by convection currents in the liquid iron outer core, which create an irregular, shifting pattern. The **agonic line** is where declination is zero — the compass points at true north. The **isogonic lines** connect points of equal declination.

Furthermore, declination **changes over time** — the magnetic poles wander at about 50 km per year. Over decades, the declination at a fixed location can change by several degrees. Navigation charts must be updated regularly.

📚 *The World Magnetic Model (WMM) is a mathematical model of Earth's magnetic field, updated every 5 years. It is used by GPS devices, compasses, and navigation systems worldwide. The current version is WMM2020, valid through 2025.*`,
      analogy: 'Imagine a room where the "wind" (magnetic field) is blowing from slightly different directions in different corners. A weathervane (compass) in each corner points in a slightly different direction. A map showing the wind direction at each point is like a declination map — it tells you the compass error at every location.',
      storyConnection: 'A pigeon flying from Delhi to Hyderabad (about 1,250 km) must account for the changing declination along the route — it varies by about 0.5 degrees over this distance. While small, this would cause a 10 km error over the full distance. Pigeons somehow compensate for this variation, possibly by continuous recalibration using the sun position and local magnetic field characteristics.',
      checkQuestion: 'A pilot in Sao Paulo, Brazil (declination -21 degrees west) wants to fly due north (true bearing 000). What magnetic heading should they set?',
      checkAnswer: 'Magnetic heading = true bearing - declination = 0 - (-21) = 21 degrees. The pilot must point 21 degrees east of where the compass says north is. This is a significant correction — ignoring it over a 500 km flight would put them 180 km off course.',
      codeIntro: 'Build a simplified magnetic declination model and visualize it across India.',
      code: `import numpy as np

# Magnetic declination model

def declination_model(lat, lon):
    """Simplified declination model for India/South Asia.
    Real models use spherical harmonic expansions with 100+ terms.
    This is a rough approximation for educational purposes.
    """
    # Base declination decreasing from east to west across India
    dec = -0.5 + 0.02 * (lon - 78) - 0.01 * (lat - 20)
    # Add some nonlinearity
    dec += 0.3 * np.sin(np.radians(lat * 3))
    return dec

# Indian cities
cities = [
    ("Hyderabad", 17.38, 78.47),
    ("Mumbai", 19.08, 72.88),
    ("Delhi", 28.61, 77.21),
    ("Chennai", 13.08, 80.27),
    ("Kolkata", 22.57, 88.36),
    ("Bangalore", 12.97, 77.59),
    ("Thiruvananthapuram", 8.52, 76.95),
    ("Guwahati", 26.14, 91.74),
    ("Jaipur", 26.91, 75.79),
    ("Ahmedabad", 23.02, 72.57),
]

print("=== Magnetic Declination Across India ===")
print(f"{'City':<22} {'Lat':>6} {'Lon':>7} {'Declination':>12}")
print("-" * 49)

for name, lat, lon in cities:
    dec = declination_model(lat, lon)
    direction = "East" if dec > 0 else "West"
    print(f"{name:<22} {lat:>5.1f} {lon:>6.1f} {dec:>+10.2f} deg ({direction})")

print()
# Navigation error analysis
print("=== Navigation Error: Charminar to Each City ===")
charminar = (17.3616, 78.4747)

print(f"{'Destination':<22} {'Dist':>8} {'Decl at dest':>13} {'Lateral error':>14}")
print("-" * 59)

for name, lat, lon in cities:
    dlat = (lat - charminar[0]) * 111
    dlon = (lon - charminar[1]) * 111 * np.cos(np.radians((lat + charminar[0]) / 2))
    dist = np.sqrt(dlat**2 + dlon**2)

    dec = declination_model(lat, lon)
    error_km = dist * np.sin(np.radians(abs(dec)))

    print(f"{name:<22} {dist:>6.0f} km {dec:>+11.2f} deg {error_km:>12.1f} km")

print()
# Declination grid for visualization
print("=== Declination Grid (India) ===")
print("Latitude 8-30N, Longitude 68-92E")
print()

lat_range = range(30, 7, -2)
lon_range = range(68, 93, 3)

print(f"{'Lat\\Lon':>7}", end="")
for lon in lon_range:
    print(f" {lon:>5}E", end="")
print()
print("-" * (8 + 6 * len(list(lon_range))))

for lat in lat_range:
    print(f"{lat:>5}N |", end="")
    for lon in lon_range:
        dec = declination_model(lat, lon)
        print(f" {dec:>+5.1f}", end="")
    print()

print()
print("Declination is small across India (< 2 degrees),")
print("but it matters for long-distance pigeon navigation.")`,
      challenge: 'If the magnetic pole shifts 50 km/year and is currently at 86N, 160W, estimate how the declination at Hyderabad would change over the next 50 years. (This is a simplified calculation — the real relationship between pole position and local declination is complex.)',
      successHint: 'Magnetic declination mapping is essential for ALL compass-based navigation. Every nautical chart, aviation map, and orienteering compass includes declination information. The same spherical harmonic models used by professional navigators are computed from satellite data — the Swarm mission satellites measure the magnetic field with exquisite precision.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 1: Explorer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Magnetic fields, compass basics, and coordinates</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises use Python to explore magnetic fields, compass navigation, and coordinate systems.
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
