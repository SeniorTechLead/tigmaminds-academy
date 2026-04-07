import { createElement } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CharminorLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {title:'Great circle distance — optimal paths on a sphere',concept:`The **great circle** is the shortest path between two points on a sphere. Every great circle divides the sphere into two equal hemispheres. The equator is a great circle, as is every line of longitude (meridian). Lines of latitude (except the equator) are NOT great circles.\n\nThe great-circle distance formula uses the **law of cosines for spheres**: cos(c) = cos(a)*cos(b) + sin(a)*sin(b)*cos(C), where a and b are the colatitudes (90 minus latitude) of the two points and C is the difference in longitude. The distance is then d = R * c.\n\nFor numerical stability, the Haversine form is preferred (as we implemented in Level 2). For this level, we will use both and explore their properties, including computing intermediate points along the great circle.\n\n📚 *On a flat map (Mercator projection), a great circle appears as a curve. On a globe, it is a straight line. This is why airplane routes on flat maps look curved — they are actually following the shortest path.*`,analogy:'Stretch a rubber band between two pins on a globe. The rubber band follows the great circle — the shortest path on the curved surface. Now look at the same path on a flat map — it curves, even though on the globe it is perfectly straight. Great circle math calculates the length and direction of this rubber-band path.',storyConnection:'A pigeon flying the 1264 km from Hyderabad to Delhi follows a path that is very close to a great circle. Deviations from the great circle (to follow rivers or avoid mountains) cost extra distance. A pigeon that flies a great-circle path with 95% efficiency covers only 1264/0.95 = 1331 km — adding only 67 km of detour over the entire journey.',checkQuestion:'The great circle from London to Tokyo passes over the North Pole region. Why is this shorter than flying due east along the 51st parallel?',checkAnswer:'The 51st parallel is a small circle (not a great circle). Its circumference is 111*cos(51)*360 = 25,100 km. The great circle route via the Arctic is about 9,560 km. Flying due east along the parallel would be about 9,800 km — 240 km longer. The difference is small at this latitude but grows at higher latitudes.',codeIntro:'Compute great circle distances, intermediate waypoints, and compare with rhumb line routes.',code:`import numpy as np

R = 6371.0

def haversine(lat1, lon1, lat2, lon2):
    la1, lo1, la2, lo2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat, dlon = la2 - la1, lo2 - lo1
    a = np.sin(dlat/2)**2 + np.cos(la1)*np.cos(la2)*np.sin(dlon/2)**2
    return 2 * R * np.arctan2(np.sqrt(a), np.sqrt(1-a))

def intermediate_point(lat1, lon1, lat2, lon2, fraction):
    """Point along great circle at given fraction (0=start, 1=end)."""
    la1, lo1 = np.radians(lat1), np.radians(lon1)
    la2, lo2 = np.radians(lat2), np.radians(lon2)
    d = haversine(lat1, lon1, lat2, lon2) / R
    if abs(d) < 1e-10:
        return lat1, lon1
    a_coeff = np.sin((1 - fraction) * d) / np.sin(d)
    b_coeff = np.sin(fraction * d) / np.sin(d)
    x = a_coeff * np.cos(la1) * np.cos(lo1) + b_coeff * np.cos(la2) * np.cos(lo2)
    y = a_coeff * np.cos(la1) * np.sin(lo1) + b_coeff * np.cos(la2) * np.sin(lo2)
    z = a_coeff * np.sin(la1) + b_coeff * np.sin(la2)
    return np.degrees(np.arctan2(z, np.sqrt(x**2 + y**2))), np.degrees(np.arctan2(y, x))

def rhumb_distance(lat1, lon1, lat2, lon2):
    """Distance along a constant-bearing (rhumb line) path."""
    la1, lo1, la2, lo2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = la2 - la1
    dlon = lo2 - lo1
    if abs(dlat) < 1e-10:
        q = np.cos(la1)
    else:
        dphi = np.log(np.tan(np.pi/4 + la2/2) / np.tan(np.pi/4 + la1/2))
        q = dlat / dphi if abs(dphi) > 1e-10 else np.cos(la1)
    dlon = ((dlon + np.pi) % (2 * np.pi)) - np.pi
    return R * np.sqrt(dlat**2 + q**2 * dlon**2)

# Great circle vs rhumb line comparison
routes = [
    ("Hyderabad-Delhi", 17.36, 78.47, 28.61, 77.21),
    ("Hyderabad-Mumbai", 17.36, 78.47, 19.08, 72.88),
    ("Hyderabad-Kolkata", 17.36, 78.47, 22.57, 88.36),
    ("London-Tokyo", 51.51, -0.13, 35.68, 139.69),
    ("New York-London", 40.71, -74.01, 51.51, -0.13),
]

print("=== Great Circle vs Rhumb Line ===")
print(f"{'Route':<25} {'GC (km)':>9} {'Rhumb (km)':>11} {'Diff %':>8}")
print("-" * 55)

for name, la1, lo1, la2, lo2 in routes:
    gc = haversine(la1, lo1, la2, lo2)
    rh = rhumb_distance(la1, lo1, la2, lo2)
    diff = (rh - gc) / gc * 100
    print(f"{name:<25} {gc:>9.0f} {rh:>11.0f} {diff:>+7.2f}%")

print()
# Waypoints along great circle
print("=== Great Circle Waypoints: Hyderabad to Delhi ===")
hyd = (17.36, 78.47)
del_ = (28.61, 77.21)

print(f"{'Fraction':>9} {'Lat':>8} {'Lon':>8} {'Dist from start':>16}")
print("-" * 43)

for frac in np.arange(0, 1.01, 0.1):
    lat, lon = intermediate_point(hyd[0], hyd[1], del_[0], del_[1], frac)
    d = haversine(hyd[0], hyd[1], lat, lon)
    print(f"{frac:>9.1f} {lat:>8.2f} {lon:>8.2f} {d:>14.0f} km")`,challenge:'For the London-Tokyo route, compute 20 intermediate waypoints along the great circle. Plot the latitude vs longitude. Notice how the path curves far north through the Arctic. Then compute the rhumb line waypoints (constant bearing). How much longer is the rhumb line?',successHint:'Great circle navigation is used by every long-haul aircraft and ship in the world. The flight from London to Tokyo over the Arctic saves about 700 km compared to the "straight" east-west route on a flat map. You just computed the same optimizations that airlines use to save millions of dollars in fuel annually.'},
    {title:'The Haversine formula — derivation and edge cases',concept:`The **Haversine formula** is derived from the spherical law of cosines, rewritten for numerical stability. The "haversine" function hav(theta) = sin^2(theta/2) = (1 - cos(theta))/2 was created specifically to avoid subtracting two nearly-equal cosine values (which causes catastrophic cancellation for small angles).\n\nThe derivation: starting from the law of cosines on a sphere, cos(c) = cos(a)cos(b) + sin(a)sin(b)cos(C), we substitute a = pi/2 - lat1, b = pi/2 - lat2, C = dlon, and use hav() to get: hav(c) = hav(a-b) + cos(a)cos(b)hav(C). Solving for c gives the distance.\n\nEdge cases: (1) **antipodal points** (exactly opposite on the globe) — the formula gives distance = pi*R = 20,015 km. (2) **identical points** — distance = 0 (hav returns 0, atan2(0,1) = 0). (3) **points on the equator** — simplifies to d = R * |dlon|.\n\n📚 *Catastrophic cancellation: when subtracting two nearly equal floating-point numbers, most significant digits cancel, leaving few accurate digits. Example: cos(0.001 radians) = 0.9999995, and 1 - cos(0.001) = 0.0000005 — only 1 significant digit survives from the original 7. The haversine avoids this.*`,analogy:'Imagine measuring the thickness of a hair by subtracting two ruler readings. The ruler reads 10.001 cm and 10.002 cm. The difference is 0.001 cm — but if the ruler is only accurate to 0.001 cm, your answer could be 0.000 or 0.002. The Haversine avoids this by reformulating the calculation to never subtract nearly-equal numbers.',storyConnection:'For a pigeon flying 500 metres from its loft to a feeding spot, the angular distance on the Earth surface is tiny — about 0.00005 radians. Computing this using the law of cosines involves subtracting 0.99999999998 from 1, losing almost all precision. The Haversine handles this correctly, giving accurate distances even for nearby points. This matters because pigeon tracking studies often measure movements of just tens of metres.',checkQuestion:'For two points 1 metre apart, what is the angular distance in radians? How many significant digits are lost when computing cos(theta) for this small angle?',checkAnswer:'Angular distance = 1 / 6371000 = 1.57e-7 radians. cos(1.57e-7) = 0.99999999999998... The value 1 - cos(theta) = 2e-14, which has only 1-2 significant digits in standard double precision. The haversine sin^2(theta/2) = sin^2(7.8e-8) = 6.1e-15, which is computed with full precision.',codeIntro:'Implement the Haversine from first principles and test edge cases.',code:`import numpy as np

# Haversine formula: derivation and edge cases

def hav(theta):
    """The haversine function: hav(theta) = sin^2(theta/2)."""
    return np.sin(theta / 2) ** 2

def haversine_from_scratch(lat1, lon1, lat2, lon2, R=6371.0):
    """Haversine formula built step by step."""
    phi1, phi2 = np.radians(lat1), np.radians(lat2)
    dphi = np.radians(lat2 - lat1)
    dlambda = np.radians(lon2 - lon1)

    # Step 1: compute haversine of central angle
    a = hav(dphi) + np.cos(phi1) * np.cos(phi2) * hav(dlambda)

    # Step 2: central angle (using atan2 for stability)
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))

    # Step 3: distance
    return R * c

def law_of_cosines_distance(lat1, lon1, lat2, lon2, R=6371.0):
    """Law of cosines (less stable for small distances)."""
    phi1, phi2 = np.radians(lat1), np.radians(lat2)
    dlambda = np.radians(lon2 - lon1)

    cos_c = np.sin(phi1)*np.sin(phi2) + np.cos(phi1)*np.cos(phi2)*np.cos(dlambda)
    cos_c = np.clip(cos_c, -1, 1)
    c = np.arccos(cos_c)
    return R * c

# Test edge cases
print("=== Edge Case Testing ===")
print()

cases = [
    ("Same point", 17.36, 78.47, 17.36, 78.47),
    ("1 metre apart", 17.36, 78.47, 17.36 + 1/111000, 78.47),
    ("10 metres", 17.36, 78.47, 17.36 + 10/111000, 78.47),
    ("100 metres", 17.36, 78.47, 17.36 + 100/111000, 78.47),
    ("1 km", 17.36, 78.47, 17.36 + 1/111, 78.47),
    ("100 km", 17.36, 78.47, 18.26, 78.47),
    ("1000 km", 17.36, 78.47, 26.36, 78.47),
    ("Half globe", 17.36, 78.47, -17.36, -101.53),
    ("Antipodal", 17.36, 78.47, -17.36, -101.53 + 0.001),
]

print(f"{'Case':<20} {'Haversine (km)':>15} {'Law of cos':>12} {'Diff (m)':>10}")
print("-" * 59)

for name, la1, lo1, la2, lo2 in cases:
    d_hav = haversine_from_scratch(la1, lo1, la2, lo2)
    d_loc = law_of_cosines_distance(la1, lo1, la2, lo2)
    diff_m = abs(d_hav - d_loc) * 1000
    print(f"{name:<20} {d_hav:>15.6f} {d_loc:>12.6f} {diff_m:>10.3f}")

print()
print("For small distances, law of cosines may lose precision.")
print("Haversine is accurate at all scales.")

print()
# Performance: batch distance calculation
print("=== Batch Distance Calculation ===")
# Calculate distance from Charminar to 1000 random points
np.random.seed(42)
n_points = 1000
lats = 17.36 + np.random.uniform(-2, 2, n_points)
lons = 78.47 + np.random.uniform(-2, 2, n_points)

distances = np.array([haversine_from_scratch(17.36, 78.47, la, lo)
                       for la, lo in zip(lats, lons)])

print(f"Calculated {n_points} distances")
print(f"Min: {distances.min():.1f} km | Max: {distances.max():.1f} km")
print(f"Mean: {distances.mean():.1f} km | Median: {np.median(distances):.1f} km")
print(f"Points within 50 km: {np.sum(distances < 50)}")
print(f"Points within 100 km: {np.sum(distances < 100)}")
print(f"Points within 200 km: {np.sum(distances < 200)}")`,challenge:'Implement the Vincenty inverse formula for ellipsoidal Earth. Compare with Haversine for 10 city pairs. What is the maximum error of the spherical Haversine? At what distance does the error exceed 1 km?',successHint:'The Haversine formula is one of the most used formulas in software engineering. It runs in every ride-sharing app, delivery service, social media location feature, and mapping application. Understanding its derivation and limitations makes you a better engineer for any location-based technology.'},
    {title:'Pathfinding algorithms — A* search for optimal routes',concept:`**Pathfinding** finds the shortest (or cheapest) route between two points on a graph. The most famous algorithm is **A*** (A-star), which combines the best features of Dijkstra's algorithm (guaranteed optimal) and greedy best-first search (fast by using heuristics).\n\nA* maintains a priority queue of nodes to explore, sorted by **f(n) = g(n) + h(n)**, where g(n) is the cost from the start to node n (known), and h(n) is the estimated cost from n to the goal (heuristic). If h(n) never overestimates the true cost (admissible heuristic), A* is guaranteed to find the optimal path.\n\nFor geographic routing, the Haversine distance to the goal is a perfect admissible heuristic — straight-line distance never overestimates road distance. This is why Google Maps can find routes so quickly: A* with Haversine heuristic explores far fewer nodes than Dijkstra.\n\n📚 *A* is optimal and complete (finds the best path if one exists) when the heuristic is admissible (never overestimates) and consistent (satisfies the triangle inequality). The Haversine distance is both admissible and consistent for road routing.*`,analogy:'Imagine finding your way through a maze. Dijkstra algorithm explores every path equally in all directions — slow but thorough. Greedy search always moves toward the goal — fast but might hit dead ends. A* is smart: it explores paths that are both short so far AND heading toward the goal. It combines the reliability of Dijkstra with the speed of greedy search.',storyConnection:'A pigeon navigating through a city with buildings, parks, and rivers faces a pathfinding problem similar to A*. The pigeon knows the general direction of home (heuristic) and can see local obstacles (graph structure). It combines these to find a good route — not necessarily optimal, but far better than random exploration.',checkQuestion:'In A*, if h(n) = 0 for all nodes, what does A* become? If g(n) = 0, what does it become?',checkAnswer:'If h(n) = 0: A* becomes Dijkstra algorithm (explores based only on known cost, ignoring the goal direction). If g(n) = 0: A* becomes greedy best-first search (ignores cost so far, goes straight for the goal). A* balances both.',codeIntro:'Implement A* pathfinding on a grid and find optimal routes through a city map.',code:`import numpy as np
import heapq

class CityGrid:
    """Simple grid-based city map for pathfinding."""

    def __init__(self, width, height, obstacle_prob=0.2):
        self.w = width
        self.h = height
        np.random.seed(42)
        self.grid = np.random.random((height, width)) > obstacle_prob
        # Ensure start and end are clear
        self.grid[0, 0] = True
        self.grid[height-1, width-1] = True

    def neighbors(self, pos):
        """Get walkable neighbors (8-connected)."""
        r, c = pos
        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                if dr == 0 and dc == 0:
                    continue
                nr, nc = r + dr, c + dc
                if 0 <= nr < self.h and 0 <= nc < self.w and self.grid[nr, nc]:
                    cost = 1.414 if (dr != 0 and dc != 0) else 1.0
                    yield (nr, nc), cost

    def heuristic(self, pos, goal):
        """Euclidean distance heuristic."""
        return np.sqrt((pos[0]-goal[0])**2 + (pos[1]-goal[1])**2)

def a_star(city, start, goal):
    """A* pathfinding algorithm."""
    open_set = [(0, start)]
    came_from = {}
    g_score = {start: 0}
    f_score = {start: city.heuristic(start, goal)}
    explored = 0

    while open_set:
        _, current = heapq.heappop(open_set)
        explored += 1

        if current == goal:
            # Reconstruct path
            path = [current]
            while current in came_from:
                current = came_from[current]
                path.append(current)
            return list(reversed(path)), g_score[goal], explored

        for neighbor, cost in city.neighbors(current):
            tentative_g = g_score[current] + cost
            if tentative_g < g_score.get(neighbor, float('inf')):
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score[neighbor] = tentative_g + city.heuristic(neighbor, goal)
                heapq.heappush(open_set, (f_score[neighbor], neighbor))

    return None, float('inf'), explored

# Create city grid
city = CityGrid(20, 15, obstacle_prob=0.25)

start = (0, 0)
goal = (14, 19)

# Run A*
path, cost, explored = a_star(city, start, goal)

print("=== A* Pathfinding on City Grid ===")
print(f"Grid: {city.w}x{city.h} | Start: {start} | Goal: {goal}")
print()

if path:
    # Display grid with path
    for r in range(city.h):
        row = ""
        for c in range(city.w):
            if (r, c) == start:
                row += "S"
            elif (r, c) == goal:
                row += "G"
            elif (r, c) in path:
                row += "*"
            elif city.grid[r, c]:
                row += "."
            else:
                row += "#"
        print(f"  {row}")

    direct = city.heuristic(start, goal)
    efficiency = direct / cost * 100

    print(f"\\\nPath length: {len(path)} steps")
    print(f"Path cost: {cost:.1f} units")
    print(f"Direct distance: {direct:.1f} units")
    print(f"Route efficiency: {efficiency:.1f}%")
    print(f"Nodes explored: {explored} (of {city.w * city.h} total)")
    print(f"Search efficiency: {explored / (city.w * city.h) * 100:.1f}% of grid explored")
else:
    print("No path found!")

print()
# Compare A* with Dijkstra (h=0)
print("=== A* vs Dijkstra Comparison ===")
for obs_prob in [0.1, 0.2, 0.3]:
    test_city = CityGrid(30, 20, obs_prob)
    s, g_pt = (0, 0), (19, 29)

    # A* with heuristic
    _, cost_a, exp_a = a_star(test_city, s, g_pt)

    # Save original heuristic, replace with 0 for Dijkstra
    orig_h = test_city.heuristic
    test_city.heuristic = lambda p, g: 0
    _, cost_d, exp_d = a_star(test_city, s, g_pt)
    test_city.heuristic = orig_h

    speedup = exp_d / max(exp_a, 1)
    print(f"  Obstacles {obs_prob:.0%}: A* explored {exp_a}, "
          f"Dijkstra {exp_d} ({speedup:.1f}x more)")`,challenge:'Modify the grid to represent Hyderabad: add a "river" (horizontal line of obstacles) with bridges at specific points. Add "highways" (double-speed edges) along certain paths. How does the optimal route change compared to the simple grid?',successHint:'A* is the backbone of navigation in every GPS device, video game, robot, and autonomous vehicle. Google Maps uses a variant of A* (with precomputed shortcuts called "contraction hierarchies") to find routes among billions of road segments in milliseconds. You just built the fundamental algorithm.'},
    {title:'Magnetic map model — how pigeons estimate position from field variations',concept:`Scientists believe homing pigeons build a **magnetic map** — a mental model of how Earth magnetic field varies across their territory. The field has two independent components that vary with position: **intensity** (total field strength, varies mainly with latitude) and **inclination** (dip angle, also varies with latitude but with different gradients).\n\nBy measuring both intensity and inclination at their current location and comparing with their remembered values at home, pigeons can estimate their displacement from home — essentially performing **bicoordinate navigation** using the magnetic field as a map.\n\nThe resolution of this magnetic map is limited by the pigeon sensitivity (about 50 nT for intensity, about 0.1 degree for inclination) and the local field gradients (how rapidly the field changes with distance). Near magnetic anomalies (iron ore deposits, volcanic rock), the gradients are steeper and the map is more precise.\n\n📚 *Bicoordinate navigation: using two independent parameters that vary in different directions to determine position. Latitude is encoded by field intensity (strongest at poles) and inclination (90 degrees at poles, 0 at equator). These two gradients are roughly perpendicular in many locations, enabling 2D position estimation.*`,analogy:'Imagine a room where temperature increases from left to right, and humidity increases from front to back. If you know the temperature and humidity at your seat, and you know the gradients, you can figure out where in the room you are sitting. Pigeons do the same thing with magnetic intensity and inclination — two "climate" variables that vary in different directions.',storyConnection:'A pigeon displaced from Charminar to an unfamiliar location 200 km away would sense that the magnetic field intensity and inclination are different from home values. By comparing the differences with its memorized magnetic map (built during earlier flights), it calculates the approximate direction and distance home. This biological GPS is accurate to about 10-50 km — enough to get the pigeon close, where visual landmarks take over.',checkQuestion:'At Hyderabad, the magnetic intensity is 43.5 uT and the inclination is 30 degrees. At a point 100 km north, intensity is 44.0 uT and inclination is 31.5 degrees. What are the gradients per km?',checkAnswer:'Intensity gradient: (44.0 - 43.5) / 100 = 0.005 uT/km = 5 nT/km. Inclination gradient: (31.5 - 30.0) / 100 = 0.015 degrees/km. With a sensitivity of 50 nT, the pigeon can resolve position to 50/5 = 10 km using intensity alone.',codeIntro:'Build a magnetic map model and simulate pigeon navigation using field measurements.',code:`import numpy as np

# Pigeon magnetic map model

class MagneticMap:
    """Model Earth's magnetic field variations for pigeon navigation."""

    def __init__(self, home_lat=17.36, home_lon=78.47):
        self.home_lat = home_lat
        self.home_lon = home_lon
        # Base field at home
        self.B_home = 43.5e-6  # Tesla
        self.inc_home = 30.0   # degrees
        # Gradients (approximate for Hyderabad region)
        self.dB_dlat = 5e-9    # T per km north (5 nT/km)
        self.dB_dlon = 1e-9    # T per km east (1 nT/km)
        self.dinc_dlat = 0.015 # degrees per km north
        self.dinc_dlon = 0.003 # degrees per km east

    def field_at(self, lat, lon):
        """Calculate magnetic field at a given location."""
        dlat_km = (lat - self.home_lat) * 111.0
        dlon_km = (lon - self.home_lon) * 111.0 * np.cos(np.radians(self.home_lat))

        B = self.B_home + self.dB_dlat * dlat_km + self.dB_dlon * dlon_km
        inc = self.inc_home + self.dinc_dlat * dlat_km + self.dinc_dlon * dlon_km

        # Add noise (measurement uncertainty)
        return B, inc

    def estimate_position(self, B_measured, inc_measured, noise_B=50e-9, noise_inc=0.1):
        """Estimate position from field measurements (inverse problem)."""
        # Add measurement noise
        B_noisy = B_measured + np.random.normal(0, noise_B)
        inc_noisy = inc_measured + np.random.normal(0, noise_inc)

        # Solve: dB = dB_dlat * dlat + dB_dlon * dlon
        #        dinc = dinc_dlat * dlat + dinc_dlon * dlon
        dB = B_noisy - self.B_home
        dinc = inc_noisy - self.inc_home

        # Matrix equation: [dB_dlat dB_dlon; dinc_dlat dinc_dlon] * [dlat; dlon] = [dB; dinc]
        A = np.array([[self.dB_dlat, self.dB_dlon],
                      [self.dinc_dlat, self.dinc_dlon]])
        b = np.array([dB, dinc])

        try:
            displacement_km = np.linalg.solve(A, b)
            est_lat = self.home_lat + displacement_km[0] / 111.0
            est_lon = self.home_lon + displacement_km[1] / (111.0 * np.cos(np.radians(self.home_lat)))
            return est_lat, est_lon
        except np.linalg.LinAlgError:
            return self.home_lat, self.home_lon

mag_map = MagneticMap()

# Test: pigeon displaced to various locations
print("=== Magnetic Map Navigation ===")
print(f"Home: ({mag_map.home_lat}, {mag_map.home_lon}) Hyderabad")
print()

test_locations = [
    ("50 km North", 17.81, 78.47),
    ("50 km East", 17.36, 78.94),
    ("100 km NE", 17.99, 79.31),
    ("200 km North", 19.16, 78.47),
    ("200 km South", 15.56, 78.47),
]

print(f"{'Location':<18} {'True B (uT)':>11} {'True Inc':>9} {'Est error (km)':>15}")
print("-" * 55)

np.random.seed(42)
for name, true_lat, true_lon in test_locations:
    B, inc = mag_map.field_at(true_lat, true_lon)

    # Run 100 trials with noise
    errors = []
    for _ in range(100):
        est_lat, est_lon = mag_map.estimate_position(B, inc)
        err = np.sqrt(((est_lat - true_lat)*111)**2 +
                      ((est_lon - true_lon)*111*np.cos(np.radians(true_lat)))**2)
        errors.append(err)

    avg_err = np.mean(errors)
    print(f"{name:<18} {B*1e6:>9.3f} {inc:>7.2f} deg {avg_err:>13.1f}")

print()
print("=== Navigation Accuracy vs Displacement ===")
print(f"{'Displacement':>13} {'Avg error':>10} {'Error %':>8}")
print("-" * 33)

for dist_km in [10, 25, 50, 100, 200, 500]:
    lat = mag_map.home_lat + dist_km / 111
    B, inc = mag_map.field_at(lat, mag_map.home_lon)
    errors = []
    for _ in range(200):
        el, elo = mag_map.estimate_position(B, inc)
        err = abs(el - lat) * 111
        errors.append(err)
    avg = np.mean(errors)
    pct = avg / dist_km * 100
    print(f"{dist_km:>11} km {avg:>8.1f} km {pct:>6.1f}%")`,challenge:'Add a magnetic anomaly at a specific location (e.g., an iron ore deposit 50 km east that adds 200 nT to the field). How does this affect the pigeon position estimate when near the anomaly? Real-world magnetic anomalies are a major challenge for pigeon magnetic navigation.',successHint:'Magnetic map navigation is an active research area in biology and physics. Understanding how pigeons solve the inverse problem of estimating position from field measurements has inspired better algorithms for magnetic navigation in submarines, spacecraft, and autonomous vehicles that cannot rely on GPS.'},
    {title:'Multi-sensor fusion — combining magnetic, solar, and visual cues',concept:`No single navigation sensor is perfect. Pigeons, like modern navigation systems, use **sensor fusion** — combining multiple imperfect signals to get a better estimate than any single signal could provide. The main pigeon sensors are: (1) **magnetic compass** (direction, ~5 degree accuracy), (2) **sun compass** (direction, ~2 degree accuracy, requires internal clock), (3) **magnetic map** (position, ~20 km accuracy), and (4) **visual landmarks** (position, ~100 m accuracy when familiar).\n\nThe mathematical framework for sensor fusion is the **Kalman filter** — an algorithm that optimally combines noisy measurements from multiple sensors, weighting each measurement by its reliability (inverse of noise). A precise measurement gets more weight; a noisy measurement gets less.\n\nThe simplified update rule: **estimate = (sigma_2^2 * measurement_1 + sigma_1^2 * measurement_2) / (sigma_1^2 + sigma_2^2)**, where sigma is the uncertainty. This automatically gives more weight to the more precise measurement.\n\n📚 *The Kalman filter (1960) is one of the most important algorithms in engineering. It is used in GPS receivers, aircraft autopilots, spacecraft navigation, robot localization, and financial prediction. It optimally estimates the state of a system from noisy, incomplete measurements.*`,analogy:'Imagine trying to guess someone weight. You can look at them (visual estimate, rough: +/- 10 kg), ask their height and use a chart (formula estimate, +/- 5 kg), or weigh them on a bathroom scale (measurement, +/- 2 kg). The best estimate combines all three, trusting the most precise source the most. That is sensor fusion.',storyConnection:'A pigeon returning to Charminar from 200 km away uses all its sensors. Far from home, the magnetic map provides a rough position estimate (within 20 km). The sun compass provides direction (within 5 degrees). As it gets closer and recognizes landmarks (the Musi River, Golconda Fort), visual navigation takes over with much higher precision. The pigeon brain performs sensor fusion to combine these cues seamlessly.',checkQuestion:'Sensor A estimates position with 20 km uncertainty. Sensor B estimates with 10 km uncertainty. Using the fusion formula, what is the combined uncertainty?',checkAnswer:'Combined variance = (sigma_A^2 * sigma_B^2) / (sigma_A^2 + sigma_B^2) = (400 * 100) / (400 + 100) = 40000 / 500 = 80. Combined sigma = sqrt(80) = 8.9 km. Better than either sensor alone!',codeIntro:'Implement sensor fusion to combine magnetic, solar, and visual navigation for a pigeon simulation.',code:`import numpy as np

class PigeonNavigator:
    """Multi-sensor navigation simulator for a homing pigeon."""

    def __init__(self, home_lat=17.3616, home_lon=78.4747):
        self.home = np.array([home_lat, home_lon])

    def magnetic_estimate(self, true_pos):
        """Magnetic map position estimate (coarse)."""
        noise = np.random.normal(0, 0.15, 2)  # ~16 km uncertainty
        return true_pos + noise

    def sun_compass_bearing(self, true_pos):
        """Sun compass bearing toward home (direction only)."""
        true_bearing = np.degrees(np.arctan2(
            self.home[1] - true_pos[1],
            self.home[0] - true_pos[0]
        )) % 360
        noise = np.random.normal(0, 3)  # 3 degree uncertainty
        return (true_bearing + noise) % 360

    def visual_estimate(self, true_pos, familiarity):
        """Visual landmark navigation (only works when familiar).
        familiarity: 0 (unknown) to 1 (home territory)
        """
        if familiarity < 0.1:
            return None  # no landmarks recognized
        noise_scale = 0.01 / familiarity  # better when more familiar
        noise = np.random.normal(0, noise_scale, 2)
        return true_pos + noise

    def fuse_positions(self, estimates, uncertainties):
        """Combine multiple position estimates using weighted average.
        Simplified Kalman-like fusion.
        """
        weights = [1.0 / (u**2) for u in uncertainties]
        total_weight = sum(weights)
        fused = np.zeros(2)
        for est, w in zip(estimates, weights):
            fused += np.array(est) * w
        fused /= total_weight
        fused_uncertainty = np.sqrt(1.0 / total_weight)
        return fused, fused_uncertainty

# Simulate a pigeon homing from 150 km away
pigeon = PigeonNavigator()
np.random.seed(42)

# Starting position: 150 km NE of home
start = np.array([18.5, 79.7])

print("=== Pigeon Multi-Sensor Homing Simulation ===")
print(f"Home: ({pigeon.home[0]:.4f}, {pigeon.home[1]:.4f})")
print(f"Start: ({start[0]:.4f}, {start[1]:.4f})")
start_dist = np.sqrt(((start[0]-pigeon.home[0])*111)**2 +
                      ((start[1]-pigeon.home[1])*106)**2)
print(f"Initial distance: {start_dist:.0f} km")
print()

# Simulate navigation at different distances from home
print(f"{'Dist (km)':>10} {'Mag err':>8} {'Visual':>8} {'Fused':>8} {'Improvement':>12}")
print("-" * 48)

for dist_frac in [1.0, 0.7, 0.5, 0.3, 0.15, 0.05, 0.01]:
    pos = pigeon.home + (start - pigeon.home) * dist_frac
    dist_km = np.sqrt(((pos[0]-pigeon.home[0])*111)**2 +
                       ((pos[1]-pigeon.home[1])*106)**2)

    # Familiarity increases as pigeon approaches home
    familiarity = max(0, 1 - dist_km / 30)  # familiar within 30 km

    # Run 200 trials
    mag_errs, vis_errs, fused_errs = [], [], []
    for _ in range(200):
        # Magnetic estimate
        mag_est = pigeon.magnetic_estimate(pos)
        mag_err = np.sqrt(((mag_est[0]-pos[0])*111)**2 + ((mag_est[1]-pos[1])*106)**2)
        mag_errs.append(mag_err)

        estimates = [mag_est]
        uncertainties = [16.0]  # km

        # Visual estimate (if available)
        vis_est = pigeon.visual_estimate(pos, familiarity)
        if vis_est is not None:
            vis_err = np.sqrt(((vis_est[0]-pos[0])*111)**2 + ((vis_est[1]-pos[1])*106)**2)
            vis_errs.append(vis_err)
            estimates.append(vis_est)
            uncertainties.append(max(0.5, 5.0 / max(familiarity, 0.1)))

        # Fused estimate
        fused, _ = pigeon.fuse_positions(estimates, uncertainties)
        fused_err = np.sqrt(((fused[0]-pos[0])*111)**2 + ((fused[1]-pos[1])*106)**2)
        fused_errs.append(fused_err)

    avg_mag = np.mean(mag_errs)
    avg_vis = np.mean(vis_errs) if vis_errs else float('nan')
    avg_fused = np.mean(fused_errs)
    improve = (avg_mag - avg_fused) / avg_mag * 100 if avg_mag > 0 else 0

    vis_str = f"{avg_vis:.1f}" if not np.isnan(avg_vis) else "N/A"
    print(f"{dist_km:>8.0f} {avg_mag:>7.1f} {vis_str:>8} {avg_fused:>7.1f} {improve:>9.0f}%")

print()
print("Sensor fusion always improves on the worst sensor.")
print("Near home, visual landmarks dominate (sub-km precision).")
print("Far from home, magnetic map is the only guide (~16 km).")`,challenge:'Add a third sensor: an olfactory (smell) map that provides position estimates with 30 km uncertainty over the full range. Include it in the fusion. How much does the three-sensor system improve over two sensors? Research: there is real evidence that pigeons use smell for navigation!',successHint:'Sensor fusion and the Kalman filter are arguably the most important algorithms in modern engineering. Every GPS receiver, every autonomous car, every drone, and every spacecraft uses sensor fusion. The pigeon brain has been doing sensor fusion for millions of years — and we are only now building technology that approaches its capabilities.'},
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Researcher
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Great circles, pathfinding, and magnetic maps</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These exercises implement great circle navigation, A* pathfinding, and magnetic map models.
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
