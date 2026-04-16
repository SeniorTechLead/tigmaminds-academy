import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function HawkBlueLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Flight data recording database',
      concept: `A bird tracking database stores GPS positions, altitude, speed, and behavior over time. The schema includes:

- **birds**: species, weight, wing measurements, tag ID
- **flights**: recorded flight sessions (start/end time, weather)
- **waypoints**: GPS + altitude at each time step
- **thermals_detected**: locations and strengths of thermals encountered
- **behaviors**: classified activities (soaring, gliding, flapping, perched)

This is exactly the schema used by raptor research programs like Movebank, which tracks thousands of tagged birds worldwide.

📚 *SQL window functions like \`LAG()\` and \`LEAD()\` compare each row with previous/next rows — perfect for calculating speed and climb rate from sequential GPS points.*`,
      analogy: 'A flight database is like a detailed travel diary kept by a meticulous tourist. Each GPS point is a diary entry: "At 10:32 AM, I was at latitude X, longitude Y, altitude Z, moving northeast at 15 m/s." From thousands of such entries, you can reconstruct the complete journey and understand every decision the traveler made.',
      storyConnection: 'Researchers have tagged hawks near Phawngpui with GPS trackers weighing just 5 grams. These tiny devices record position every 10 seconds, creating a detailed record of flight behavior. The database we build is a simplified version of their research platform.',
      checkQuestion: 'Why store raw waypoints rather than just summary statistics (average speed, total distance)?',
      checkAnswer: 'Raw waypoints allow any analysis to be performed later. Summary statistics are lossy — you cannot reconstruct the flight path from averages. Maybe future research questions require analyzing turn rates, thermal centering behavior, or response to wind shifts. Raw data preserves all possibilities. Storage is cheap; field data collection is expensive.',
      codeIntro: 'Build a GPS flight tracking database and analyze hawk soaring patterns.',
      code: `import sqlite3
import random
import math

random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE birds (
    id INTEGER PRIMARY KEY, species TEXT, mass_kg REAL,
    wingspan_m REAL, tag_id TEXT
);
CREATE TABLE flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bird_id INTEGER REFERENCES birds(id),
    date TEXT, duration_min REAL, weather TEXT
);
CREATE TABLE waypoints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_id INTEGER REFERENCES flights(id),
    timestamp_s REAL, lat REAL, lon REAL,
    altitude_m REAL, speed_ms REAL, heading_deg REAL,
    behavior TEXT
);
''')

c.execute("INSERT INTO birds VALUES (1,'Oriental Honey Buzzard',1.3,1.35,'OHB-001')")
c.execute("INSERT INTO birds VALUES (2,'Black Kite',0.9,1.50,'BK-042')")

# Generate synthetic flight data for Bird 1
flight_id = 1
c.execute("INSERT INTO flights VALUES (?,1,'2025-03-15',45,'clear')", (flight_id,))

lat, lon = 23.0, 93.0  # near Phawngpui
alt = 1800.0
heading = 90  # east
speed = 12.0
t = 0

for i in range(270):  # 270 waypoints at 10s intervals = 45 min
    dt = 10
    t += dt

    # Determine behavior
    if t < 600:  # first 10 min: thermal climb
        behavior = 'thermal'
        alt += random.gauss(2.5, 0.5) * dt  # climb
        heading = (heading + 12) % 360  # circling
        speed = random.gauss(10, 1)
    elif t < 1800:  # 10-30 min: gliding
        behavior = 'glide'
        alt -= random.gauss(0.8, 0.2) * dt  # sink
        heading = random.gauss(85, 5) % 360
        speed = random.gauss(15, 1.5)
    elif t < 2400:  # 30-40 min: another thermal
        behavior = 'thermal'
        alt += random.gauss(3.0, 0.8) * dt
        heading = (heading + 15) % 360
        speed = random.gauss(11, 1)
    else:  # final glide
        behavior = 'glide'
        alt -= random.gauss(1.0, 0.3) * dt
        heading = random.gauss(90, 3) % 360
        speed = random.gauss(16, 1)

    lat += speed * math.cos(math.radians(heading)) * dt / 111000
    lon += speed * math.sin(math.radians(heading)) * dt / (111000 * math.cos(math.radians(lat)))
    alt = max(alt, 500)

    c.execute('INSERT INTO waypoints (flight_id, timestamp_s, lat, lon, altitude_m, speed_ms, heading_deg, behavior) VALUES (?,?,?,?,?,?,?,?)',
              (flight_id, t, round(lat, 6), round(lon, 6), round(alt, 1), round(speed, 1), round(heading, 1), behavior))

conn.commit()

print("HAWK FLIGHT DATABASE — ANALYSIS")
print("=" * 60)
print(f"Total waypoints: {c.execute('SELECT COUNT(*) FROM waypoints').fetchone()[0]}")

print("\
Flight summary:")
for row in c.execute('''
    SELECT behavior, COUNT(*) as points, ROUND(AVG(speed_ms),1) as avg_speed,
           ROUND(AVG(altitude_m),0) as avg_alt,
           ROUND(MIN(altitude_m),0) as min_alt, ROUND(MAX(altitude_m),0) as max_alt
    FROM waypoints GROUP BY behavior
'''):
    print(f"  {row[0]:<10}: {row[1]:>4} pts, speed={row[2]} m/s, alt={row[3]}m ({row[4]}-{row[5]}m)")

print("\
Climb rate analysis (thermal segments):")
for row in c.execute('''
    SELECT w1.timestamp_s,
           ROUND((w2.altitude_m - w1.altitude_m) / 10, 2) as climb_rate
    FROM waypoints w1 JOIN waypoints w2
    ON w1.flight_id = w2.flight_id AND w2.timestamp_s = w1.timestamp_s + 10
    WHERE w1.behavior = 'thermal'
    ORDER BY climb_rate DESC LIMIT 5
'''):
    print(f"  t={row[0]:.0f}s: climb = {row[1]} m/s")

print("\
Total distance traveled:")
row = c.execute('''
    SELECT ROUND(SUM(speed_ms * 10) / 1000, 1) as dist_km
    FROM waypoints
''').fetchone()
print(f"  {row[0]} km in 45 minutes")

conn.close()`,
      challenge: 'Add a "thermal detection" algorithm: identify contiguous sequences of waypoints where behavior=thermal and altitude is increasing. Store detected thermals (center lat/lon, max strength, diameter) in a thermals_detected table.',
      successHint: 'You built a GPS flight tracking database — the same technology used by ornithologists worldwide to study raptor migration, habitat use, and conservation. The Movebank database contains billions of GPS points from thousands of tracked birds.',
    },
    {
      title: 'Autonomous soaring algorithm',
      concept: `Can we program a drone to soar like a hawk? An **autonomous soaring algorithm** needs:

1. **Thermal detection**: identify rising air from onboard sensors (variometer, temperature)
2. **Centering**: once in a thermal, adjust circle to maximize climb
3. **Decision**: when to leave a thermal and glide to the next
4. **Navigation**: choose direction toward goal while exploiting thermals

The centering algorithm uses the **gradient method**: if the left wing gets more lift than the right, the thermal center is to the left. Adjust the circle to shift toward the center.

The departure decision uses **MacCready theory**: leave when the expected climb in the next thermal exceeds the current climb rate (accounting for the glide cost of reaching it).

📚 *We implement the soaring algorithm as a state machine: SEARCH → THERMAL_ENTRY → CENTERING → CLIMB → DEPARTURE → GLIDE → SEARCH.*`,
      analogy: 'The autonomous soaring algorithm is like teaching a robot to dance by watching humans. We observe hawks (the expert dancers), identify their decision rules (thermal centering, departure criteria), and encode these rules into software. The robot will not be as graceful as the original dancer, but it can learn the basic moves.',
      storyConnection: 'Researchers studying Blue Mountain hawks have identified specific behavioral rules: hawks enter thermals from the windward side, center by banking toward the wing with more lift, and depart when climb drops below a threshold. These biological observations become the engineering specifications for our algorithm.',
      checkQuestion: 'Why is thermal centering harder than it sounds?',
      checkAnswer: 'The hawk (or drone) is moving, the thermal is invisible, and the thermal structure changes moment to moment. You can only measure the updraft at your current position — you cannot see the whole thermal at once. It is like finding the top of a hill while blindfolded: you can only feel the slope at your feet and must navigate by feel.',
      codeIntro: 'Implement an autonomous soaring algorithm with thermal detection and centering.',
      code: `import sqlite3
import numpy as np

np.random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE sorties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    algorithm TEXT, total_distance_km REAL,
    max_altitude_m REAL, flight_time_min REAL,
    thermals_used INTEGER, energy_used REAL
);
''')

class SoaringDrone:
    def __init__(self, algorithm='hawk_inspired'):
        self.x, self.z = 0.0, 500.0
        self.vx = 14.0
        self.algorithm = algorithm
        self.state = 'SEARCH'
        self.thermals_used = 0
        self.energy = 0

    def get_thermal(self, x):
        """Simulated thermal field."""
        thermals = [(1000, 4.0, 200), (3500, 3.0, 180),
                    (6000, 3.5, 220), (9000, 2.5, 150),
                    (12000, 4.5, 250)]
        w = -0.3  # default sink
        for tx, tw, ts in thermals:
            dist = abs(x - tx)
            w += tw * np.exp(-dist**2 / (2 * ts**2))
        return w

    def step(self, dt=1.0):
        w = self.get_thermal(self.x)
        sink_rate = 1.0

        if self.algorithm == 'hawk_inspired':
            if self.state == 'SEARCH':
                self.vx = 16.0
                self.z -= sink_rate * dt
                if w > 1.5:
                    self.state = 'CLIMB'
                    self.thermals_used += 1
            elif self.state == 'CLIMB':
                self.vx = 3.0  # circling, slow forward
                self.z += (w - sink_rate * 0.7) * dt
                if w < 1.0 or self.z > 1500:
                    self.state = 'GLIDE'
            elif self.state == 'GLIDE':
                self.vx = 18.0  # MacCready speed
                self.z -= sink_rate * 1.2 * dt
                if w > 1.5:
                    self.state = 'CLIMB'
                    self.thermals_used += 1
                elif self.z < 200:
                    self.state = 'SEARCH'

        elif self.algorithm == 'always_glide':
            self.vx = 15.0
            self.z -= sink_rate * dt

        elif self.algorithm == 'always_circle':
            self.vx = 3.0
            self.z += (w - sink_rate * 0.7) * dt

        self.x += self.vx * dt
        self.z = max(self.z, 0)
        self.energy += abs(self.vx) * 0.01 * dt

# Run simulations
algorithms = ['hawk_inspired', 'always_glide', 'always_circle']
results = {}

for algo in algorithms:
    drone = SoaringDrone(algo)
    history_x, history_z = [drone.x], [drone.z]

    for _ in range(int(600 / 1)):  # 600 seconds
        drone.step(1.0)
        history_x.append(drone.x)
        history_z.append(drone.z)
        if drone.z <= 0:
            break

    results[algo] = (history_x, history_z, drone)
    c.execute('INSERT INTO sorties (algorithm, total_distance_km, max_altitude_m, flight_time_min, thermals_used, energy_used) VALUES (?,?,?,?,?,?)',
              (algo, round(drone.x/1000, 2), round(max(history_z), 0),
               round(len(history_x)/60, 1), drone.thermals_used, round(drone.energy, 1)))

conn.commit()

print("AUTONOMOUS SOARING ALGORITHM COMPARISON")
print("=" * 65)
print(f"{'Algorithm':<18} {'Distance':>10} {'Max Alt':>8} {'Time':>8} {'Thermals':>9} {'Energy':>8}")
print("-" * 60)
for row in c.execute('SELECT * FROM sorties ORDER BY total_distance_km DESC'):
    print(f"{row[1]:<18} {row[2]:>9.1f}km {row[3]:>7.0f}m {row[4]:>7.1f}m {row[5]:>9} {row[6]:>8.1f}")

# Best strategy analysis
best = c.execute('SELECT algorithm, total_distance_km FROM sorties ORDER BY total_distance_km DESC LIMIT 1').fetchone()
worst = c.execute('SELECT algorithm, total_distance_km FROM sorties ORDER BY total_distance_km ASC LIMIT 1').fetchone()
print(f"\
Best: {best[0]} ({best[1]} km)")
print(f"Worst: {worst[0]} ({worst[1]} km)")
print(f"Hawk-inspired is {best[1]/worst[1]:.1f}x better than worst strategy")

conn.close()`,
      challenge: 'Add a "learning" algorithm that adjusts its MacCready speed based on the average thermal strength it has encountered so far. Does this adaptive strategy outperform the fixed hawk-inspired algorithm?',
      successHint: 'You implemented an autonomous soaring algorithm — an active area of research for long-endurance UAVs. Companies like Airbus and DLR are developing solar-powered drones that use hawk-inspired soaring to stay aloft for months. Your state-machine approach is the foundation of these real systems.',
    },
    {
      title: 'Wind field reconstruction from flight data',
      concept: `Given GPS tracks of multiple hawks, we can **reconstruct the wind field** they flew through. This is an **inverse problem**: the hawks' flight paths are the data, and the wind field is what we want to estimate.

For each waypoint, the hawk's ground speed = airspeed + wind:
\`V_ground = V_air + V_wind\`

If we know (or can estimate) the hawk's airspeed from its wing loading, we can solve for wind at each point. With many hawks, we can map the entire wind field — thermals, ridge lift, and background wind.

This technique, called **biologging-based meteorology**, uses birds as atmospheric sensors.

📚 *We solve the inverse problem using least-squares fitting: minimize the difference between predicted and observed ground speeds across all waypoints.*`,
      analogy: 'Reconstructing wind from hawk tracks is like figuring out a river\'s current by watching boats. If you know each boat\'s engine power (airspeed) and observe its actual path over the ground (ground track), the difference is the current (wind). With enough boats, you can map the entire river current — even in places no boat visited, by interpolation.',
      storyConnection: 'Birds over Blue Mountain are living weather stations. Their flight paths encode information about thermals, wind shear, and turbulence. By analyzing GPS tracks from tagged hawks, researchers can create detailed atmospheric maps that complement traditional weather instruments — especially in remote mountainous areas where weather stations are sparse.',
      checkQuestion: 'Why do we need multiple birds to reconstruct the wind field?',
      checkAnswer: 'One bird samples the atmosphere along a single path — a 1D cross-section. Multiple birds sample different locations simultaneously, giving 2D coverage. The more birds and the more spread out their paths, the better the spatial resolution of the reconstructed wind field. This is the same principle as using multiple seismographs to locate an earthquake.',
      codeIntro: 'Reconstruct a 2D wind field from simulated hawk GPS tracks.',
      code: `import sqlite3
import numpy as np

np.random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE wind_observations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    x_km REAL, y_km REAL,
    wind_u REAL, wind_v REAL, wind_w REAL,
    source TEXT
);
CREATE TABLE wind_field (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    x_km REAL, y_km REAL,
    estimated_u REAL, estimated_v REAL, estimated_w REAL,
    confidence REAL
);
''')

# True wind field (unknown to the algorithm)
def true_wind(x, y):
    u = 5.0 + 0.5 * np.sin(y * 0.5)  # east wind + variation
    v = 1.0 + 0.3 * np.cos(x * 0.3)  # slight north wind
    # Thermals
    w = -0.3
    thermals = [(2, 3, 3.5, 0.4), (5, 1, 2.8, 0.3), (8, 4, 4.0, 0.5)]
    for tx, ty, tw, tr in thermals:
        dist2 = (x-tx)**2 + (y-ty)**2
        w += tw * np.exp(-dist2 / (2 * tr**2))
    return u, v, w

# Simulate 5 hawk tracks sampling the wind field
n_hawks = 5
for hawk in range(n_hawks):
    x = np.random.uniform(0, 2)
    y = np.random.uniform(0, 5)
    airspeed = np.random.uniform(12, 16)

    for step in range(50):
        u, v, w = true_wind(x, y)
        # Add measurement noise
        u_obs = u + np.random.normal(0, 0.5)
        v_obs = v + np.random.normal(0, 0.5)
        w_obs = w + np.random.normal(0, 0.3)

        c.execute('INSERT INTO wind_observations (x_km, y_km, wind_u, wind_v, wind_w, source) VALUES (?,?,?,?,?,?)',
                  (round(x, 2), round(y, 2), round(u_obs, 2), round(v_obs, 2), round(w_obs, 2), f'hawk_{hawk}'))

        # Move hawk
        heading = np.random.uniform(0, 360)
        x += (airspeed * np.cos(np.radians(heading)) + u) * 0.001
        y += (airspeed * np.sin(np.radians(heading)) + v) * 0.001
        x = np.clip(x, 0, 10)
        y = np.clip(y, 0, 5)

conn.commit()

# Reconstruct wind field using inverse distance weighting
grid_x = np.arange(0, 10.5, 0.5)
grid_y = np.arange(0, 5.5, 0.5)

obs = c.execute('SELECT x_km, y_km, wind_u, wind_v, wind_w FROM wind_observations').fetchall()
obs_array = np.array(obs)

for gx in grid_x:
    for gy in grid_y:
        distances = np.sqrt((obs_array[:, 0] - gx)**2 + (obs_array[:, 1] - gy)**2)
        distances = np.maximum(distances, 0.01)
        weights = 1 / distances**2

        est_u = np.average(obs_array[:, 2], weights=weights)
        est_v = np.average(obs_array[:, 3], weights=weights)
        est_w = np.average(obs_array[:, 4], weights=weights)
        confidence = min(np.sum(weights) / 100, 1.0)

        c.execute('INSERT INTO wind_field (x_km, y_km, estimated_u, estimated_v, estimated_w, confidence) VALUES (?,?,?,?,?,?)',
                  (gx, gy, round(est_u, 2), round(est_v, 2), round(est_w, 2), round(confidence, 3)))

conn.commit()

# Validation
print("WIND FIELD RECONSTRUCTION FROM HAWK GPS DATA")
print("=" * 60)
print(f"Observations: {len(obs)} from {n_hawks} hawks")
print(f"Grid points: {len(grid_x) * len(grid_y)}")

# Compare estimated vs true at thermal locations
print("\
Thermal detection accuracy:")
for tx, ty, tw, tr in [(2, 3, 3.5, 0.4), (5, 1, 2.8, 0.3), (8, 4, 4.0, 0.5)]:
    row = c.execute('SELECT estimated_w, confidence FROM wind_field WHERE x_km=? AND y_km=?', (tx, ty)).fetchone()
    if row:
        true_w = tw - 0.3
        error = abs(row[0] - true_w)
        print(f"  ({tx},{ty}): true_w={true_w:.1f}, est_w={row[0]:.1f}, error={error:.2f}, conf={row[1]:.3f}")

# Average error
print("\
Overall reconstruction quality:")
total_error = 0
count = 0
for row in c.execute('SELECT x_km, y_km, estimated_w FROM wind_field'):
    _, _, tw = true_wind(row[0], row[1])
    total_error += abs(row[2] - tw)
    count += 1
print(f"  Mean absolute error (vertical wind): {total_error/count:.2f} m/s")

conn.close()`,
      challenge: 'Improve the reconstruction by adding a Gaussian process prior (or kriging) instead of simple inverse distance weighting. How much does the error improve, especially in areas far from any hawk track?',
      successHint: 'You built a wind field reconstruction system from biological sensor data — an emerging field called biologging-based meteorology. This technique is used in real research: bird GPS tracks provide atmospheric data in remote regions where weather instruments are absent.',
    },
    {
      title: 'Bio-inspired drone flight planner',
      concept: `The capstone combines everything: aerodynamics, thermal models, soaring algorithms, and databases into a **complete drone flight planning system** inspired by hawk behavior.

The planner:
1. Queries weather and terrain databases
2. Predicts thermal locations and strengths
3. Plans an optimal route exploiting thermals
4. Simulates the flight with the soaring algorithm
5. Stores results and learns from experience

This is a **digital twin** of hawk soaring — a computational model that mimics biological intelligence for engineering applications.

📚 *The final system integrates sqlite3 databases, numpy simulations, and algorithmic optimization into a unified planning pipeline.*`,
      analogy: 'The bio-inspired flight planner is like a GPS navigation system that has learned from bird behavior. Instead of just finding the shortest road (direct path), it finds the most energy-efficient path by routing through "fuel stations" (thermals) that only exist at certain times and places. The route changes with weather, time of day, and season.',
      storyConnection: 'This planner is the computational distillation of everything hawks know about soaring over Blue Mountain. Millions of years of evolution produced a biological flight computer in the hawk\'s brain. We have reverse-engineered its principles into software — creating a tool that honors the hawk\'s expertise while extending it to human technology.',
      checkQuestion: 'What is the most important difference between this planner and a simple point-to-point drone controller?',
      checkAnswer: 'The simple controller fights the atmosphere — flying straight through headwinds and downdrafts, burning energy constantly. The bio-inspired planner cooperates with the atmosphere — seeking out free energy from thermals, riding ridge lift, avoiding sink zones. The energy difference can be 10-100× for long flights.',
      codeIntro: 'Build the complete bio-inspired drone flight planning system.',
      code: `import sqlite3
import numpy as np

np.random.seed(42)
conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.executescript('''
CREATE TABLE terrain (
    x_km REAL, y_km REAL, elevation_m REAL, surface_type TEXT
);
CREATE TABLE thermal_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    x_km REAL, y_km REAL, strength REAL,
    confidence REAL, time_window TEXT
);
CREATE TABLE flight_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, waypoints TEXT, total_dist_km REAL,
    est_energy REAL, est_time_min REAL, thermals_planned INTEGER
);
CREATE TABLE flight_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER, actual_dist REAL, actual_energy REAL,
    actual_time REAL, thermals_found INTEGER, success INTEGER
);
''')

# Build terrain
for x in np.arange(0, 20.5, 1):
    for y in np.arange(0, 10.5, 1):
        elev = 800 + 1300 * np.exp(-((x-10)**2 + (y-5)**2) / 20)
        surface = 'forest' if elev < 1500 else 'rock' if elev > 1800 else 'grassland'
        c.execute('INSERT INTO terrain VALUES (?,?,?,?)', (x, y, round(elev), surface))

# Predict thermals (based on terrain + time of day)
for x in np.arange(0, 20.5, 2):
    for y in np.arange(0, 10.5, 2):
        elev = 800 + 1300 * np.exp(-((x-10)**2 + (y-5)**2) / 20)
        row = c.execute('SELECT surface_type FROM terrain WHERE x_km=? AND y_km=?', (x, y)).fetchone()
        surface = row[0] if row else 'forest'

        base_strength = 1.0
        if surface == 'rock': base_strength = 3.5
        elif surface == 'grassland': base_strength = 2.5
        else: base_strength = 1.5

        # South-facing slopes get more sun
        slope_bonus = max(0, (y - 5) * 0.2)
        strength = base_strength + slope_bonus + np.random.normal(0, 0.3)
        confidence = 0.8 if surface in ['rock', 'grassland'] else 0.5

        if strength > 1.5:
            c.execute('INSERT INTO thermal_predictions (x_km, y_km, strength, confidence, time_window) VALUES (?,?,?,?,?)',
                      (x, y, round(strength, 1), round(confidence, 2), '10:00-14:00'))

conn.commit()

# Flight planning algorithm
def plan_route(start, goal, conn):
    """Plan route through predicted thermals."""
    thermals = conn.execute('SELECT x_km, y_km, strength, confidence FROM thermal_predictions WHERE strength > 2.0 ORDER BY strength DESC').fetchall()

    # Greedy: always go to nearest strong thermal toward goal
    route = [start]
    current = start
    thermals_planned = 0

    while np.sqrt((current[0]-goal[0])**2 + (current[1]-goal[1])**2) > 3:
        best_thermal = None
        best_score = -1

        for th in thermals:
            dist_to_th = np.sqrt((current[0]-th[0])**2 + (current[1]-th[1])**2)
            dist_th_to_goal = np.sqrt((th[0]-goal[0])**2 + (th[1]-goal[1])**2)
            progress = np.sqrt((current[0]-goal[0])**2 + (current[1]-goal[1])**2) - dist_th_to_goal

            if dist_to_th < 5 and progress > 0:
                score = th[2] * th[3] * progress / max(dist_to_th, 0.5)
                if score > best_score:
                    best_score = score
                    best_thermal = th

        if best_thermal:
            route.append((best_thermal[0], best_thermal[1]))
            current = (best_thermal[0], best_thermal[1])
            thermals_planned += 1
        else:
            break

    route.append(goal)
    return route, thermals_planned

# Plan and simulate flights
start = (0, 5)
goal = (18, 5)

route, n_thermals = plan_route(start, goal, conn)
total_dist = sum(np.sqrt((route[i+1][0]-route[i][0])**2 + (route[i+1][1]-route[i][1])**2) for i in range(len(route)-1))

# Estimate energy and time
glide_ratio = 15
energy_per_km = 1.0 / (1 + n_thermals * 0.3)  # thermals reduce energy
est_time = total_dist / 40 * 60  # ~40 km/h average

c.execute('INSERT INTO flight_plans (name, waypoints, total_dist_km, est_energy, est_time_min, thermals_planned) VALUES (?,?,?,?,?,?)',
          ('Blue Mountain Transit', str(route), round(total_dist, 1), round(energy_per_km * total_dist, 1), round(est_time, 0), n_thermals))

# Simulate 10 flights with random thermal variation
for trial in range(10):
    found = n_thermals - np.random.randint(0, 3)  # some thermals may be missing
    actual_energy = energy_per_km * total_dist * (1 + 0.3 * (n_thermals - found) / max(n_thermals, 1))
    actual_time = est_time * (1 + np.random.normal(0, 0.15))
    success = 1 if found >= n_thermals * 0.6 else 0

    c.execute('INSERT INTO flight_results (plan_id, actual_dist, actual_energy, actual_time, thermals_found, success) VALUES (?,?,?,?,?,?)',
              (1, round(total_dist * (1 + np.random.normal(0, 0.05)), 1), round(actual_energy, 1), round(actual_time, 0), found, success))

conn.commit()

# Report
print("BIO-INSPIRED DRONE FLIGHT PLANNER")
print("=" * 60)

plan = c.execute('SELECT * FROM flight_plans').fetchone()
print(f"\
Route: {plan[1]}")
print(f"Planned waypoints: {plan[2]}")
print(f"Distance: {plan[3]} km, Energy: {plan[4]}, Time: {plan[5]} min")
print(f"Thermals planned: {plan[6]}")

print(f"\
Simulation results (10 trials):")
print(f"{'Trial':>6} {'Dist':>6} {'Energy':>8} {'Time':>6} {'Thermals':>9} {'Success':>8}")
for row in c.execute('SELECT * FROM flight_results'):
    print(f"{row[0]:>6} {row[2]:>6.1f} {row[3]:>8.1f} {row[4]:>6.0f} {row[5]:>9} {'Yes' if row[6] else 'No':>8}")

avg = c.execute('SELECT AVG(actual_energy), AVG(actual_time), AVG(success)*100 FROM flight_results').fetchone()
print(f"\
Averages: energy={avg[0]:.1f}, time={avg[1]:.0f}min, success={avg[2]:.0f}%")

# Direct flight comparison
direct_dist = np.sqrt((goal[0]-start[0])**2 + (goal[1]-start[1])**2)
direct_energy = direct_dist * 3.0  # no thermals
print(f"\
Direct flight (no soaring): dist={direct_dist:.1f}km, energy={direct_energy:.1f}")
print(f"Soaring saves {(1-avg[0]/direct_energy)*100:.0f}% energy")

conn.close()`,
      challenge: 'Add weather uncertainty: thermal predictions have only 60% accuracy. Run 100 Monte Carlo simulations where thermals randomly fail to materialize. What is the probability of completing the mission? How many "backup thermals" should the planner include?',
      successHint: 'You built a complete bio-inspired drone flight planning system — the culmination of aerodynamics, thermal modeling, algorithmic optimization, and database engineering. This technology is being actively developed for solar-powered long-endurance drones that could provide internet, surveillance, or atmospheric sampling for weeks at a time, all powered by the same physics that hawks have exploited over Blue Mountain for millennia.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Database-Driven Autonomous Soaring</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Sparkles className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L4-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint} />
        ))}
      </div>
    </div>
  );
}
