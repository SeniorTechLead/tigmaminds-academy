import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CharminorLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Triangulation — finding position from three known points',
      concept: `**Triangulation** determines an unknown position by measuring angles or distances to three or more known reference points. If you know the distance to three landmarks, your position is at the intersection of three circles centered on those landmarks. This is the fundamental principle behind GPS.

For 2D positioning on a flat surface, you need at least 3 reference points (2 points give two possible positions; the third disambiguates). For 3D positioning (including altitude), you need 4 reference points. This is why GPS requires a minimum of 4 satellites.

The mathematical process: for each reference point, draw a circle of radius equal to the measured distance. Two circles intersect at 0 or 2 points. The third circle identifies the unique solution. In practice, measurement errors mean the circles do not intersect perfectly — a least-squares algorithm finds the best-fit position.

📚 *Trilateration uses distance measurements to three points. Triangulation technically uses angle measurements. GPS uses trilateration (distances from satellite signal travel times), but the term "triangulation" is commonly used for both.*`,
      analogy: 'You are lost in a forest but can hear three church bells. You estimate each bell is 2 km, 3 km, and 4 km away based on loudness. On your map, you draw circles of these radii around each church. Where all three circles overlap — that is where you are standing.',
      storyConnection: 'Homing pigeons may use a form of triangulation — comparing the magnetic field, sun angle, and possibly infrasound (low-frequency sound from distant ocean waves or mountains) to triangulate their position relative to home. Each "reference signal" provides one constraint on position, and combining three or more signals narrows the position to a small area.',
      checkQuestion: 'You measure distances of 5 km, 7 km, and 6 km to three cell towers. How many position solutions exist? What if one measurement is wrong by 1 km?',
      checkAnswer: 'With perfect measurements: exactly 1 solution (the intersection of 3 circles). With a 1 km error: the 3 circles no longer intersect at a single point — they form a small "triangle of error." The best estimate is the center of this triangle.',
      codeIntro: 'Implement trilateration to find a position from three distance measurements.',
      code: `import numpy as np

def trilaterate(p1, r1, p2, r2, p3, r3):
    """Find position given 3 reference points and distances.
    Each p is (x, y) and r is the distance to that point.
    Returns the estimated position (x, y).
    """
    x1, y1 = p1
    x2, y2 = p2
    x3, y3 = p3

    # Solve using linearization (subtract circle equations pairwise)
    # Circle 1: (x-x1)^2 + (y-y1)^2 = r1^2
    # Circle 2: (x-x2)^2 + (y-y2)^2 = r2^2
    # Subtract: 2(x2-x1)x + 2(y2-y1)y = r1^2 - r2^2 - x1^2 + x2^2 - y1^2 + y2^2

    A = 2 * (x2 - x1)
    B = 2 * (y2 - y1)
    C = r1**2 - r2**2 - x1**2 + x2**2 - y1**2 + y2**2

    D = 2 * (x3 - x1)
    E = 2 * (y3 - y1)
    F = r1**2 - r3**2 - x1**2 + x3**2 - y1**2 + y3**2

    denom = A * E - B * D
    if abs(denom) < 1e-10:
        return None  # degenerate (points are collinear)

    x = (C * E - F * B) / denom
    y = (A * F - D * C) / denom
    return (x, y)

# Example: finding a pigeon's position in Hyderabad
# Using three cell towers as reference (coordinates in km from Charminar)
towers = [
    ("Tower A (Golconda)", (-5.0, 2.0)),
    ("Tower B (Secunderabad)", (2.0, 8.0)),
    ("Tower C (Airport)", (-3.0, -12.0)),
]

# The pigeon is actually at (1.0, 3.0) km from Charminar
true_pos = (1.0, 3.0)

# Calculate true distances
distances = []
for name, pos in towers:
    d = np.sqrt((true_pos[0]-pos[0])**2 + (true_pos[1]-pos[1])**2)
    distances.append(d)

print("=== Trilateration Demo ===")
print(f"True pigeon position: ({true_pos[0]}, {true_pos[1]}) km from Charminar")
print()

print("Reference points and distances:")
for (name, pos), d in zip(towers, distances):
    print(f"  {name}: position {pos}, distance = {d:.2f} km")

# Solve
result = trilaterate(towers[0][1], distances[0],
                     towers[1][1], distances[1],
                     towers[2][1], distances[2])

print(f"\nTrilaterated position: ({result[0]:.4f}, {result[1]:.4f})")
error = np.sqrt((result[0]-true_pos[0])**2 + (result[1]-true_pos[1])**2)
print(f"Error: {error:.6f} km = {error*1000:.2f} m")

print()
# With measurement noise
print("=== Effect of Measurement Error ===")
np.random.seed(42)
print(f"{'Noise (m)':>10} {'Avg error (m)':>14} {'Max error (m)':>14}")
print("-" * 40)

for noise_m in [0, 10, 50, 100, 500, 1000]:
    errors = []
    for _ in range(100):
        noisy_d = [d + np.random.normal(0, noise_m/1000) for d in distances]
        est = trilaterate(towers[0][1], noisy_d[0],
                         towers[1][1], noisy_d[1],
                         towers[2][1], noisy_d[2])
        if est:
            err = np.sqrt((est[0]-true_pos[0])**2 + (est[1]-true_pos[1])**2) * 1000
            errors.append(err)
    if errors:
        print(f"{noise_m:>10} {np.mean(errors):>14.1f} {np.max(errors):>14.1f}")

print()
print("GPS satellites have ~3m distance error -> ~5m position error.")
print("Pigeon 'trilateration' has much larger errors but still works!")`,
      challenge: 'What if you only have 2 reference points? The trilateration gives 2 possible positions. Write code to find both intersection points of two circles. How would a pigeon use additional information (like the sun direction) to choose between the two candidates?',
      successHint: 'Trilateration is the mathematical core of GPS, indoor positioning (WiFi/Bluetooth beacons), radar, sonar, and seismology (locating earthquake epicenters). You just implemented the same algorithm that your phone uses to determine your location.',
    },
    {
      title: 'GPS principles — satellite ranging and position fix',
      concept: `**GPS (Global Positioning System)** works by measuring the **time of arrival** of radio signals from multiple satellites. Each satellite broadcasts its position and the exact time. Your GPS receiver compares the arrival time with its own clock to calculate the distance to each satellite. With distances to 4+ satellites, trilateration gives your 3D position.

The key insight: radio signals travel at the speed of light (**c = 299,792,458 m/s**). A signal from a satellite 20,200 km above Earth takes about 0.067 seconds to arrive. A timing error of just **1 nanosecond** (one billionth of a second) causes a distance error of 0.3 metres. This is why GPS satellites carry atomic clocks accurate to within 10 nanoseconds.

The fourth satellite is needed to solve for the receiver's clock error — the receiver does not have an atomic clock, so its time is slightly wrong. With 4 satellites, you solve for 4 unknowns: x, y, z position and clock error.

📚 *Pseudorange: the distance calculated from signal travel time, before correcting for clock error. True range = pseudorange - c * clock_error. Solving 4 pseudorange equations simultaneously gives both position and clock correction.*`,
      analogy: 'Imagine you are blindfolded in a room with 4 speakers, each playing a different click at exactly the same time. You hear each click at a slightly different time because the speakers are at different distances. From the time differences, you can calculate your distance from each speaker and figure out where you are standing.',
      storyConnection: 'While pigeons do not use GPS satellites, the concept is analogous to their multi-signal navigation. A pigeon integrates signals from multiple sources (magnetic field, sun position, landmark recognition, perhaps infrasound) — each providing one "range" measurement — and combines them to determine position. GPS engineers and pigeon biologists are studying essentially the same problem: multi-source position estimation.',
      checkQuestion: 'A GPS signal takes 0.068 seconds to travel from satellite to receiver. What is the distance? If the receiver clock is 10 nanoseconds fast, what is the distance error?',
      checkAnswer: 'Distance = c * t = 299792458 * 0.068 = 20,385,887 m = 20,386 km. Clock error: 10 ns * c = 10e-9 * 3e8 = 3.0 m. A tiny clock error of 10 nanoseconds causes a 3 metre error in position.',
      codeIntro: 'Simulate GPS positioning: calculate pseudoranges and solve for position.',
      code: `import numpy as np

# GPS positioning simulation

C = 299792458  # speed of light (m/s)
R_EARTH = 6371000  # Earth radius (m)
R_ORBIT = 26571000  # GPS orbit radius (m) = 20200 km + Earth radius

def gps_pseudorange(sat_pos, receiver_pos, clock_error_ns=0):
    """Calculate pseudorange from satellite to receiver.
    Includes receiver clock error.
    """
    true_range = np.sqrt(sum((s - r)**2 for s, r in zip(sat_pos, receiver_pos)))
    pseudorange = true_range + C * clock_error_ns * 1e-9
    return pseudorange, true_range

def solve_gps(satellites, pseudoranges):
    """Solve GPS position using iterative least squares.
    satellites: list of (x, y, z) in metres
    pseudoranges: list of measured pseudoranges
    Returns: (x, y, z, clock_error_m)
    """
    # Initial guess: center of Earth
    x, y, z, b = 0, 0, R_EARTH, 0

    for iteration in range(20):
        residuals = []
        H = []  # Jacobian matrix

        for (sx, sy, sz), pr in zip(satellites, pseudoranges):
            r = np.sqrt((x-sx)**2 + (y-sy)**2 + (z-sz)**2)
            residuals.append(pr - r - b)
            H.append([-(x-sx)/r, -(y-sy)/r, -(z-sz)/r, -1])

        H = np.array(H)
        residuals = np.array(residuals)

        # Least squares update
        delta = np.linalg.lstsq(H, residuals, rcond=None)[0]
        x += delta[0]
        y += delta[1]
        z += delta[2]
        b += delta[3]

        if np.linalg.norm(delta[:3]) < 0.01:  # converged to 1 cm
            break

    return x, y, z, b

# Simulate GPS satellites above Hyderabad
# Hyderabad in ECEF coordinates (approximate)
hyd_lat = np.radians(17.36)
hyd_lon = np.radians(78.47)

hyd_x = R_EARTH * np.cos(hyd_lat) * np.cos(hyd_lon)
hyd_y = R_EARTH * np.cos(hyd_lat) * np.sin(hyd_lon)
hyd_z = R_EARTH * np.sin(hyd_lat)

# Place 6 satellites at various positions above
sat_angles = [(30, 45), (60, 120), (45, 200), (70, 300), (50, 80), (35, 260)]
satellites = []
for elev, azim in sat_angles:
    e, a = np.radians(elev), np.radians(azim)
    sx = R_ORBIT * np.cos(e) * np.cos(a + hyd_lon)
    sy = R_ORBIT * np.cos(e) * np.sin(a + hyd_lon)
    sz = R_ORBIT * np.sin(e)
    satellites.append((sx, sy, sz))

# Calculate pseudoranges (with 5 ns clock error)
clock_error_ns = 5.0
pseudoranges = []
true_ranges = []
for sat in satellites:
    pr, tr = gps_pseudorange(sat, (hyd_x, hyd_y, hyd_z), clock_error_ns)
    pseudoranges.append(pr)
    true_ranges.append(tr)

print("=== GPS Positioning Simulation ===")
print(f"True position: Hyderabad ({np.degrees(hyd_lat):.2f}N, {np.degrees(hyd_lon):.2f}E)")
print(f"Receiver clock error: {clock_error_ns} ns = {C * clock_error_ns * 1e-9:.1f} m")
print()

print(f"{'Satellite':>10} {'True range (km)':>16} {'Pseudorange (km)':>17} {'Error (m)':>10}")
print("-" * 55)
for i, (pr, tr) in enumerate(zip(pseudoranges, true_ranges)):
    print(f"  SAT-{i+1:>3} {tr/1000:>16.1f} {pr/1000:>17.1f} {(pr-tr):>10.1f}")

# Solve using 4, 5, and 6 satellites
print()
print("=== Position Solution ===")
for n_sats in [4, 5, 6]:
    x, y, z, b = solve_gps(satellites[:n_sats], pseudoranges[:n_sats])
    pos_error = np.sqrt((x-hyd_x)**2 + (y-hyd_y)**2 + (z-hyd_z)**2)
    clock_est = b / C * 1e9  # back to nanoseconds
    print(f"{n_sats} satellites: position error = {pos_error:.2f} m, "
          f"clock error = {clock_est:.2f} ns (true: {clock_error_ns})")`,
      challenge: 'Add 50 metres of random noise to each pseudorange (simulating atmospheric delay and multipath). Run the solver 100 times and compute the average position error. Then try with 4 vs 6 satellites — more satellites should reduce the average error. By how much?',
      successHint: 'You just simulated the entire GPS positioning algorithm — the same computation performed billions of times per second by GPS receivers worldwide. Understanding GPS from first principles gives you insight into autonomous vehicles, precision agriculture, surveying, and any technology that needs accurate positioning.',
    },
    {
      title: 'Distance calculation — the Haversine formula deep dive',
      concept: `The **Haversine formula** is the standard method for computing great-circle distances on a sphere. It is numerically stable even for small distances (unlike the law of cosines, which can have rounding errors for nearby points) and is computationally efficient.

The formula: **a = sin^2(dlat/2) + cos(lat1) * cos(lat2) * sin^2(dlon/2)**, **c = 2 * atan2(sqrt(a), sqrt(1-a))**, **d = R * c**.

The "haversine" function is hav(theta) = sin^2(theta/2) = (1 - cos(theta)) / 2. It was invented specifically for navigation calculations because it avoids subtracting nearly-equal numbers (which causes precision loss with the law of cosines).

For the highest accuracy, the **Vincenty formula** accounts for Earth's ellipsoidal shape (the Earth is slightly flattened at the poles). Vincenty is accurate to 0.5 mm but more complex. For most applications, the Haversine is sufficient (accurate to about 0.3%).

📚 *Earth is not a perfect sphere — it is an oblate spheroid with equatorial radius 6378.137 km and polar radius 6356.752 km. The flattening is about 1/298.257. For distances under 1000 km, the spherical Haversine is accurate to within 0.3%.*`,
      analogy: 'Imagine measuring the distance between two points on an orange by wrapping a piece of string along the surface. The string follows the shortest path — a great circle arc. The Haversine formula calculates the length of that string mathematically, using only the coordinates of the two endpoints.',
      storyConnection: 'A pigeon flying from Mumbai to Hyderabad (approximately 620 km) follows a path very close to a great circle — the shortest possible route over the curved Earth. Computing this distance accurately is essential for understanding pigeon homing performance: a pigeon that arrives within 1% of the great-circle path has extraordinary navigational precision.',
      checkQuestion: 'The Haversine distance from Hyderabad (17.36N, 78.47E) to Delhi (28.61N, 77.21E) should be close to what value? Estimate using the latitude difference alone.',
      checkAnswer: 'Latitude difference: 28.61 - 17.36 = 11.25 degrees * 111 km/degree = 1249 km. But there is also a small longitude difference. The Haversine gives approximately 1264 km — the longitude component adds about 15 km.',
      codeIntro: 'Implement the Haversine formula and build a comprehensive distance calculator.',
      code: `import numpy as np

# Haversine formula — deep dive implementation

R_EARTH = 6371.0  # km

def haversine_detailed(lat1, lon1, lat2, lon2):
    """Haversine with step-by-step intermediate values."""
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Haversine of the central angle
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2

    # Central angle
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))

    # Distance
    d = R_EARTH * c

    # Initial bearing
    x = np.sin(dlon) * np.cos(lat2)
    y = np.cos(lat1) * np.sin(lat2) - np.sin(lat1) * np.cos(lat2) * np.cos(dlon)
    bearing = np.degrees(np.arctan2(x, y)) % 360

    return {
        "distance_km": d,
        "central_angle_deg": np.degrees(c),
        "bearing_deg": bearing,
        "haversine_a": a,
    }

# Pigeon homing routes from Charminar
charminar = (17.3616, 78.4747)

destinations = [
    ("Golconda Fort", 17.3833, 78.4011),
    ("Warangal", 17.9784, 79.5941),
    ("Vijayawada", 16.5062, 80.6480),
    ("Mumbai", 19.0760, 72.8777),
    ("Bangalore", 12.9716, 77.5946),
    ("Chennai", 13.0827, 80.2707),
    ("Delhi", 28.6139, 77.2090),
    ("Kolkata", 22.5726, 88.3639),
    ("Colombo", 6.9271, 79.8612),
    ("Kathmandu", 27.7172, 85.3240),
]

print("=== Pigeon Homing Distances from Charminar ===")
print(f"{'Destination':<18} {'Distance':>10} {'Bearing':>8} {'Central angle':>14}")
print("-" * 52)

for name, lat, lon in destinations:
    result = haversine_detailed(charminar[0], charminar[1], lat, lon)
    print(f"{name:<18} {result['distance_km']:>8.1f} km {result['bearing_deg']:>7.1f} "
          f"{result['central_angle_deg']:>12.3f} deg")

print()
# Pigeon speed analysis
print("=== Pigeon Flight Time Estimates ===")
pigeon_speed_kmh = 80  # average homing pigeon speed

print(f"Average pigeon speed: {pigeon_speed_kmh} km/h")
print()
print(f"{'Destination':<18} {'Distance':>10} {'Flight time':>12} {'Feasible?'}")
print("-" * 50)

for name, lat, lon in destinations:
    result = haversine_detailed(charminar[0], charminar[1], lat, lon)
    d = result["distance_km"]
    time_h = d / pigeon_speed_kmh
    feasible = "Yes" if d < 800 else "Challenging" if d < 1500 else "Extreme"
    if time_h < 1:
        time_str = str(int(time_h * 60)) + " min"
    else:
        time_str = str(round(time_h, 1)) + " hrs"
    print(f"{name:<18} {d:>8.0f} km {time_str:>12} {feasible}")

print()
# Accuracy comparison: flat vs Haversine
print("=== Flat Earth vs Haversine Accuracy ===")
for name, lat, lon in destinations:
    d_flat = np.sqrt(((lat-charminar[0])*111)**2 +
                     ((lon-charminar[1])*111*np.cos(np.radians(charminar[0])))**2)
    d_haver = haversine_detailed(charminar[0], charminar[1], lat, lon)["distance_km"]
    error_pct = abs(d_flat - d_haver) / d_haver * 100
    print(f"  {name:<18} flat={d_flat:>7.0f} km  haver={d_haver:>7.0f} km  error={error_pct:.2f}%")`,
      challenge: 'Implement the Vincenty formula for ellipsoidal Earth (equatorial radius 6378.137 km, polar radius 6356.752 km). Compare its results with Haversine for the Hyderabad-Delhi route. How many metres of difference is there? Is it significant for pigeon navigation?',
      successHint: 'The Haversine formula is one of the most widely used formulas in technology. Every time you search for "restaurants near me," check a delivery estimate, or use a mapping app, the Haversine is computed. You now understand the math behind billions of daily distance calculations.',
    },
    {
      title: 'Waypoint navigation — bearing and distance to intermediate points',
      concept: `Real navigation rarely involves flying in a straight line from origin to destination. Obstacles, wind, terrain, and air traffic control require following a series of **waypoints** — intermediate points along the route. Navigation becomes: calculate bearing and distance to the next waypoint, fly there, then recalculate for the following waypoint.

Each **leg** of the route has a bearing and distance. The total route distance is the sum of all leg distances (which is always greater than or equal to the direct great-circle distance). The **efficiency** of a route is the ratio of direct distance to total route distance.

Pigeons do not follow perfectly straight paths either. They may deviate to follow rivers or coastlines (visual landmarks), avoid mountains, take advantage of tailwinds, or correct course as they update their position estimate.

📚 *A waypoint is a reference point in navigation. Modern aircraft and ships navigate using sequences of waypoints defined by coordinates. The autopilot calculates the bearing and distance to the next waypoint and adjusts the heading accordingly.*`,
      analogy: 'Driving across a city, you do not go in a straight line — you follow roads, turn at intersections, and navigate around buildings. Each intersection is a waypoint. The GPS gives you turn-by-turn directions: "in 500 metres, turn right." Pigeon navigation is similar, except the "waypoints" are landmarks like rivers, lakes, and mountain ridges.',
      storyConnection: 'A pigeon flying from Charminar to a loft in Secunderabad (8 km north) might not fly straight — it could follow the Musi River east, then turn north along a main road. Tracking studies show that pigeons often follow linear features like roads and rivers, especially in familiar territory. Only on long-distance flights over unfamiliar terrain do they rely primarily on compass navigation.',
      checkQuestion: 'A route has 3 legs: 5 km at 045 degrees, 3 km at 090 degrees, and 4 km at 000 degrees. What is the total route distance? If the direct distance is 10 km, what is the route efficiency?',
      checkAnswer: 'Total route distance: 5 + 3 + 4 = 12 km. Efficiency: 10/12 = 83%. The route is 17% longer than the direct path. Real pigeon routes typically have 85-95% efficiency.',
      codeIntro: 'Build a waypoint navigation system that calculates multi-leg routes.',
      code: `import numpy as np

R = 6371.0

def haversine(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1)*np.cos(lat2)*np.sin(dlon/2)**2
    return 2 * R * np.arctan2(np.sqrt(a), np.sqrt(1-a))

def bearing(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlon = lon2 - lon1
    x = np.sin(dlon) * np.cos(lat2)
    y = np.cos(lat1)*np.sin(lat2) - np.sin(lat1)*np.cos(lat2)*np.cos(dlon)
    return np.degrees(np.arctan2(x, y)) % 360

def destination_point(lat, lon, bearing_deg, distance_km):
    """Calculate destination given start, bearing, and distance."""
    lat, lon, brg = np.radians(lat), np.radians(lon), np.radians(bearing_deg)
    d = distance_km / R

    lat2 = np.arcsin(np.sin(lat)*np.cos(d) + np.cos(lat)*np.sin(d)*np.cos(brg))
    lon2 = lon + np.arctan2(np.sin(brg)*np.sin(d)*np.cos(lat),
                            np.cos(d) - np.sin(lat)*np.sin(lat2))
    return np.degrees(lat2), np.degrees(lon2)

# Define a pigeon route with waypoints
start = ("Charminar", 17.3616, 78.4747)
waypoints = [
    ("Musi River Bridge", 17.3680, 78.4500),
    ("Tank Bund", 17.4150, 78.4740),
    ("Secunderabad Station", 17.4340, 78.5020),
    ("Destination Loft", 17.4500, 78.4900),
]

all_points = [start] + waypoints

print("=== Pigeon Waypoint Navigation ===")
print(f"Route: {start[0]} -> {waypoints[-1][0]}")
print()

total_distance = 0
print(f"{'Leg':<4} {'From':<22} {'To':<22} {'Dist':>7} {'Bearing':>8}")
print("-" * 65)

for i in range(len(all_points) - 1):
    name1, lat1, lon1 = all_points[i]
    name2, lat2, lon2 = all_points[i + 1]
    d = haversine(lat1, lon1, lat2, lon2)
    b = bearing(lat1, lon1, lat2, lon2)
    total_distance += d
    print(f"{i+1:<4} {name1:<22} {name2:<22} {d:>5.2f}km {b:>7.1f}")

# Direct distance
direct = haversine(start[1], start[2], waypoints[-1][1], waypoints[-1][2])
direct_bearing = bearing(start[1], start[2], waypoints[-1][1], waypoints[-1][2])
efficiency = direct / total_distance * 100

print()
print(f"Total route distance: {total_distance:.2f} km")
print(f"Direct distance: {direct:.2f} km")
print(f"Route efficiency: {efficiency:.1f}%")
print(f"Direct bearing: {direct_bearing:.1f} degrees")

print()
# Simulate different route efficiencies
print("=== Route Efficiency Comparison ===")
routes = [
    ("Direct (great circle)", 100),
    ("Following main road", 92),
    ("Following Musi River", 85),
    ("Random exploration", 65),
    ("Lost pigeon (circular)", 40),
]

print(f"{'Route type':<25} {'Efficiency':>10} {'Time (min)*':>12} {'Extra km':>10}")
print("-" * 59)

speed = 60  # km/h
for name, eff in routes:
    actual_dist = direct / (eff / 100)
    time_min = actual_dist / speed * 60
    extra = actual_dist - direct
    print(f"{name:<25} {eff:>8}% {time_min:>10.1f} {extra:>8.1f}")

print(f"\n* Based on {speed} km/h flight speed, direct distance {direct:.1f} km")`,
      challenge: 'Generate a random "exploration flight" where the pigeon deviates from the direct path: at each step, it flies 0.5 km in a direction that is the correct bearing +/- 30 degrees of random error. Simulate 100 such flights and calculate the average arrival time and route efficiency.',
      successHint: 'Waypoint navigation is used by every aircraft, ship, drone, and autonomous vehicle in the world. The flight management system in a commercial aircraft stores hundreds of waypoints and calculates legs between them continuously. You just built a simplified version of the same system.',
    },
    {
      title: 'Signal strength and distance — the inverse square law',
      concept: `Many navigation signals (radio, light, sound, magnetic) weaken with distance according to the **inverse square law**: intensity is proportional to 1/distance^2. A signal at twice the distance is four times weaker. At three times the distance, nine times weaker.

GPS signals from 20,200 km away are extraordinarily weak by the time they reach your phone — about 10^-16 watts (0.0000000000000001 watts). Your phone GPS antenna and amplifier are engineering marvels for detecting such faint signals.

Pigeons may also use the inverse square law — they could estimate distance from signal strength. The magnetic field varies with distance from the pole approximately as 1/r^3 (dipole field), and sound intensity follows the 1/r^2 law. By comparing the strength of different navigation signals, pigeons could estimate how far they are from known reference points.

📚 *The inverse square law arises because the energy from a point source spreads over the surface of an expanding sphere. Surface area = 4*pi*r^2, so intensity (power per unit area) = P / (4*pi*r^2). Doubling r quadruples the area and quarters the intensity.*`,
      analogy: 'Imagine a campfire on a dark night. Up close, it is blindingly bright. At 10 metres, much dimmer. At 100 metres, barely visible. The light spreads out in all directions, so the further you are, the more thinly it is spread over space. This same law governs radio signals, sound, gravity, and magnetic fields.',
      storyConnection: 'A pigeon flying 200 km from home receives much weaker navigation signals than one flying 20 km away. The inverse square law means that at 200 km, the magnetic field differences that encode position information are 100 times weaker than at 20 km. This is one reason why long-distance pigeon homing is more difficult and less accurate than short-distance — the signal-to-noise ratio degrades with distance.',
      checkQuestion: 'A radio signal has power density 1 mW/m^2 at 1 km. What is the power density at 10 km? At 100 km?',
      checkAnswer: 'At 10 km: 1 / 10^2 = 0.01 mW/m^2 (100x weaker). At 100 km: 1 / 100^2 = 0.0001 mW/m^2 = 0.1 uW/m^2 (10,000x weaker). This rapid signal decay is why long-range communication requires powerful transmitters or sensitive receivers.',
      codeIntro: 'Model the inverse square law and calculate signal strength for navigation applications.',
      code: `import numpy as np

# Inverse square law and navigation signals

def signal_strength(power_W, distance_m):
    """Signal power density at distance (W/m^2)."""
    return power_W / (4 * np.pi * distance_m**2)

def distance_from_signal(power_W, measured_strength):
    """Estimate distance from measured signal strength."""
    return np.sqrt(power_W / (4 * np.pi * measured_strength))

# GPS satellite signal
gps_power = 50  # watts (typical GPS satellite transmitter)
gps_altitude = 20200e3  # metres

gps_strength = signal_strength(gps_power, gps_altitude)

print("=== GPS Signal Strength ===")
print(f"Satellite power: {gps_power} W")
print(f"Distance: {gps_altitude/1e3:.0f} km")
print(f"Signal at receiver: {gps_strength:.2e} W/m^2")
print(f"  = {10*np.log10(gps_strength*1000):.1f} dBm/m^2")
print()

# Compare with other signals
print("=== Signal Strength Comparison ===")
signals = [
    ("Cell tower (50W, 5km)", 50, 5e3),
    ("WiFi router (0.1W, 30m)", 0.1, 30),
    ("FM radio (50kW, 100km)", 50000, 100e3),
    ("GPS satellite (50W, 20200km)", 50, 20200e3),
    ("Pulsar star (1e26W, 1000 ly)", 1e26, 9.46e18),
]

print(f"{'Source':<35} {'Strength (W/m^2)':>18} {'dBm':>8}")
print("-" * 63)
for name, P, d in signals:
    S = signal_strength(P, d)
    dbm = 10 * np.log10(S * 1000) if S > 0 else -999
    print(f"{name:<35} {S:>18.2e} {dbm:>8.1f}")

print()
# Pigeon navigation: estimating distance from signal strength
print("=== Pigeon Distance Estimation ===")
print("If a pigeon senses magnetic field strength to estimate distance:")
print()

# Magnetic dipole field: B proportional to 1/r^3
def magnetic_field_strength(r_km, B_ref=45e-6, r_ref=6371):
    """Earth's field variation with distance (dipole model)."""
    return B_ref * (r_ref / (r_ref + r_km))**3

# Bird sensitivity: can detect ~50 nT changes
bird_sensitivity = 50e-9  # Tesla

print(f"{'Distance from ref':>18} {'B field (uT)':>13} {'Change (nT)':>12} {'Detectable?'}")
print("-" * 57)

B_home = magnetic_field_strength(0)
for d_km in [1, 5, 10, 50, 100, 200, 500, 1000]:
    B = magnetic_field_strength(d_km * 0.001)  # very rough
    change = abs(B - B_home) * 1e9  # in nT
    detectable = "Yes" if change > bird_sensitivity * 1e9 else "No"
    print(f"{d_km:>16} km {B*1e6:>11.3f} {change:>10.1f} {detectable:>12}")

print()
print(f"Bird magnetic sensitivity: ~{bird_sensitivity*1e9:.0f} nT")
print("This limits magnetic navigation to roughly 100-200 km precision.")`,
      challenge: 'A pigeon can detect a 50 nT magnetic field change. Earth field varies by about 20 uT from equator to pole over 10,000 km. What is the minimum distance the pigeon must fly before it can detect a change in field strength? This is the "resolution" of its magnetic map.',
      successHint: 'The inverse square law is one of the most universal laws in physics — it governs gravity, electrostatics, light, sound, and radiation. Understanding signal attenuation with distance is essential for telecommunications engineering, radar design, and even radio astronomy.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Triangulation, GPS, and distance calculation</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises implement triangulation, GPS positioning, and navigation algorithms.
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
