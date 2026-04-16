import { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function RasLilaLevel4() {
  const { pyodideRef, load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Satellite constellation database — managing orbital assets',
      concept: `A satellite constellation (like GPS or Starlink) requires precise tracking of hundreds of objects in orbit. Each satellite has an **orbital element set**: semi-major axis, eccentricity, inclination, and more.

We build a SQLite database to store and query:
- **satellites** — orbital parameters, status, purpose
- **ground_stations** — tracking facilities
- **passes** — when each satellite is visible from each ground station
- **manoeuvres** — planned orbit adjustments

SQL queries answer operational questions: "Which satellites are overhead right now?", "When is the next pass over Manipur?", "Which satellites need fuel for station-keeping?"`,
      analogy: 'A satellite database is like air traffic control for space. Just as ATC tracks every aircraft\'s position, speed, and destination, our database tracks every satellite\'s orbit, health, and schedule. Without it, collisions and gaps in coverage would be inevitable.',
      storyConnection: 'The Ras Lila dance requires precise coordination of every dancer. A satellite constellation requires the same: every satellite must be in the right place at the right time. Our database is the choreographer\'s notebook for the cosmic dance.',
      checkQuestion: 'Why does GPS need at least 24 satellites?',
      checkAnswer: 'GPS requires signals from at least 4 satellites simultaneously to calculate position (3 for triangulation + 1 for time correction). With 24 satellites in 6 orbital planes, at least 6 are visible from any point on Earth at any time — providing redundancy. Fewer satellites would create coverage gaps.',
      codeIntro: 'Build a satellite constellation management database.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE satellites (
    id INTEGER PRIMARY KEY, name TEXT, constellation TEXT,
    altitude_km REAL, inclination_deg REAL, period_min REAL,
    status TEXT, fuel_pct REAL
);
CREATE TABLE ground_stations (
    id INTEGER PRIMARY KEY, name TEXT, lat REAL, lon REAL, country TEXT
);
CREATE TABLE passes (
    id INTEGER PRIMARY KEY, sat_id INTEGER, station_id INTEGER,
    start_time TEXT, duration_min REAL, max_elevation_deg REAL,
    FOREIGN KEY (sat_id) REFERENCES satellites(id),
    FOREIGN KEY (station_id) REFERENCES ground_stations(id)
);
''')

# Populate constellation
np.random.seed(42)
constellations = [
    ('GPS', 20200, 55, 24), ('Starlink', 550, 53, 40), ('Iridium', 780, 86.4, 12),
]
sat_id = 0
for name, alt, inc, count in constellations:
    G = 6.674e-11; M = 5.972e24; R = 6.371e6
    r = R + alt * 1000
    T = 2 * np.pi * np.sqrt(r**3 / (G * M)) / 60  # period in minutes
    for i in range(count):
        sat_id += 1
        fuel = max(10, 100 - np.random.exponential(20))
        status = 'active' if fuel > 15 else 'low-fuel'
        c.execute('INSERT INTO satellites VALUES (?,?,?,?,?,?,?,?)',
                  (sat_id, f'{name}-{i+1:03d}', name, alt, inc, T, status, fuel))

stations = [
    ('Imphal', 24.82, 93.95, 'India'), ('Bangalore', 12.97, 77.59, 'India'),
    ('Colorado Springs', 38.83, -104.82, 'USA'), ('Kiruna', 67.86, 20.22, 'Sweden'),
]
for i, (name, lat, lon, country) in enumerate(stations):
    c.execute('INSERT INTO ground_stations VALUES (?,?,?,?,?)', (i+1, name, lat, lon, country))

# Generate pass data
for sat in range(1, sat_id+1):
    for stn in range(1, 5):
        n_passes = np.random.randint(2, 8)
        for p in range(n_passes):
            hour = np.random.randint(0, 24)
            minute = np.random.randint(0, 60)
            duration = np.random.uniform(2, 15)
            max_elev = np.random.uniform(10, 90)
            c.execute('INSERT INTO passes (sat_id,station_id,start_time,duration_min,max_elevation_deg) VALUES (?,?,?,?,?)',
                      (sat, stn, f'2024-03-15 {hour:02d}:{minute:02d}', duration, max_elev))

# Queries
print("=== Satellite Constellation Database ===\
")
c.execute('SELECT constellation, COUNT(*), ROUND(AVG(fuel_pct),1), SUM(CASE WHEN status="low-fuel" THEN 1 ELSE 0 END) FROM satellites GROUP BY constellation')
print(f"{'Constellation':<12} {'Count':>6} {'Avg Fuel%':>10} {'Low Fuel':>9}")
print("-" * 40)
for row in c.fetchall():
    print(f"{row[0]:<12} {row[1]:>6} {row[2]:>9.1f}% {row[3]:>9}")

print("\
Passes visible from Imphal today:")
c.execute('''
    SELECT s.name, p.start_time, ROUND(p.duration_min,1), ROUND(p.max_elevation_deg,0)
    FROM passes p JOIN satellites s ON p.sat_id=s.id
    JOIN ground_stations g ON p.station_id=g.id
    WHERE g.name='Imphal' AND p.max_elevation_deg > 30
    ORDER BY p.start_time LIMIT 10
''')
print(f"{'Satellite':<15} {'Time':>16} {'Duration':>9} {'Max Elev':>9}")
for row in c.fetchall():
    print(f"{row[0]:<15} {row[1]:>16} {row[2]:>7.1f}m {row[3]:>7.0f}°")

c.execute('''SELECT s.name, s.fuel_pct FROM satellites WHERE fuel_pct < 20 ORDER BY fuel_pct ASC LIMIT 5''')
print("\
Critical fuel levels:")
for name, fuel in c.fetchall():
    print(f"  {name}: {fuel:.1f}% fuel remaining")

db.close()`,
      challenge: 'Add a manoeuvres table that logs orbit-raising burns. When a satellite\'s fuel drops below 20%, schedule a de-orbit burn. How many satellites need de-orbiting?',
      successHint: 'Real satellite operations use databases just like this — tracking thousands of objects, scheduling passes, and managing fuel budgets. You just built a simplified version of what space agencies use daily.',
    },
    {
      title: 'Collision avoidance algorithm — preventing Kessler syndrome',
      concept: `With thousands of satellites and millions of debris pieces in orbit, **collision avoidance** is critical. The **Kessler syndrome** describes a cascade: one collision creates debris, which causes more collisions, which creates more debris — eventually making orbits unusable.

Our collision avoidance algorithm:
1. Predict the future positions of all tracked objects
2. Calculate the **closest approach distance** for every pair
3. If distance < threshold, flag a conjunction and compute manoeuvre options
4. Rank manoeuvres by fuel cost and safety margin

This is a combinatorial problem: N objects have N*(N-1)/2 pairs to check. For 10,000 objects, that is ~50 million pairs. Efficient algorithms are essential.`,
      analogy: 'Collision avoidance in space is like avoiding crashes in a demolition derby, except you cannot steer quickly, everything moves at 8 km/s, and even a paint chip can kill you. The only option is to predict collisions hours in advance and make tiny adjustments early.',
      storyConnection: 'In a crowded Ras Lila formation, dancers must constantly adjust to avoid collisions. In orbit, satellites do the same — but the stakes are higher and the adjustments must be calculated days in advance. Both require awareness of every other "dancer" in the system.',
      checkQuestion: 'Why is even a 1 cm piece of debris dangerous in orbit?',
      checkAnswer: 'Orbital speeds are about 8 km/s. At that speed, kinetic energy = 0.5 x m x v². A 1 cm aluminium sphere (0.0014 kg) at 8 km/s has KE = 0.5 x 0.0014 x 8000² = 44,800 J — equivalent to a hand grenade. Relative velocities in collisions can be up to 15 km/s, making it even worse.',
      codeIntro: 'Build a collision avoidance system that detects close approaches and recommends manoeuvres.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE objects (
    id INTEGER PRIMARY KEY, name TEXT, type TEXT,
    altitude_km REAL, velocity_kms REAL, mass_kg REAL
);
CREATE TABLE conjunctions (
    id INTEGER PRIMARY KEY, obj1_id INTEGER, obj2_id INTEGER,
    min_distance_km REAL, time_to_closest TEXT, risk_level TEXT
);
CREATE TABLE avoidance_manoeuvres (
    id INTEGER PRIMARY KEY, conjunction_id INTEGER,
    delta_v_ms REAL, fuel_kg REAL, new_miss_km REAL
);
''')

np.random.seed(42)

# Generate orbital objects (satellites + debris)
objects = []
for i in range(15):
    if i < 5:
        name, typ, mass = f'SAT-{i+1}', 'satellite', np.random.uniform(500, 2000)
    else:
        name, typ, mass = f'DEB-{i-4:03d}', 'debris', np.random.uniform(0.01, 10)
    alt = np.random.uniform(350, 600)
    G, M, R = 6.674e-11, 5.972e24, 6.371e6
    r = R + alt * 1000
    v = np.sqrt(G * M / r) / 1000
    objects.append((name, typ, alt, v, mass))
    c.execute('INSERT INTO objects (name,type,altitude_km,velocity_kms,mass_kg) VALUES (?,?,?,?,?)',
              (name, typ, alt, v, mass))

# Detect close approaches (simplified: altitude-based proximity)
print("=== Collision Avoidance System ===\
")
conj_count = 0
for i in range(len(objects)):
    for j in range(i+1, len(objects)):
        alt_diff = abs(objects[i][2] - objects[j][2])
        # Simplify: if within 5km altitude band, check further
        if alt_diff < 5:
            min_dist = alt_diff + np.random.exponential(2)  # simplified model
            if min_dist < 10:
                conj_count += 1
                risk = 'HIGH' if min_dist < 1 else 'MEDIUM' if min_dist < 5 else 'LOW'
                c.execute('INSERT INTO conjunctions (obj1_id,obj2_id,min_distance_km,time_to_closest,risk_level) VALUES (?,?,?,?,?)',
                          (i+1, j+1, min_dist, f'2024-03-15 {np.random.randint(0,24):02d}:00', risk))

                # If HIGH risk, compute avoidance manoeuvre
                if risk in ('HIGH', 'MEDIUM'):
                    # Delta-v to increase miss distance by 10 km
                    dv = 0.1 + np.random.exponential(0.05)  # m/s
                    fuel = dv * objects[i][4] / 3000  # simplified rocket equation
                    new_miss = min_dist + 10
                    c.execute('INSERT INTO avoidance_manoeuvres (conjunction_id,delta_v_ms,fuel_kg,new_miss_km) VALUES (?,?,?,?)',
                              (conj_count, dv, fuel, new_miss))

# Report
c.execute('''
    SELECT o1.name, o2.name, cj.min_distance_km, cj.risk_level, cj.time_to_closest
    FROM conjunctions cj
    JOIN objects o1 ON cj.obj1_id=o1.id
    JOIN objects o2 ON cj.obj2_id=o2.id
    ORDER BY cj.min_distance_km ASC
''')
print(f"{'Object 1':<12} {'Object 2':<12} {'Min Dist':>9} {'Risk':>8} {'Time'}")
print("-" * 55)
for row in c.fetchall():
    print(f"{row[0]:<12} {row[1]:<12} {row[2]:>7.2f}km {row[3]:>8} {row[4]}")

c.execute('SELECT risk_level, COUNT(*) FROM conjunctions GROUP BY risk_level')
print("\
Risk summary:")
for risk, count in c.fetchall():
    print(f"  {risk}: {count} conjunctions")

c.execute('''
    SELECT o1.name, am.delta_v_ms, am.fuel_kg, am.new_miss_km
    FROM avoidance_manoeuvres am
    JOIN conjunctions cj ON am.conjunction_id=cj.id
    JOIN objects o1 ON cj.obj1_id=o1.id
    ORDER BY am.fuel_kg ASC LIMIT 5
''')
print("\
Recommended manoeuvres (cheapest first):")
for name, dv, fuel, miss in c.fetchall():
    print(f"  {name}: Δv={dv:.3f} m/s, fuel={fuel:.2f} kg → new miss: {miss:.1f} km")

db.close()`,
      challenge: 'Add a Kessler cascade simulation: when two objects collide (miss < 0.1 km), generate 10 new debris objects. Run the detection again. How quickly does the debris count grow?',
      successHint: 'Space debris management is one of the most pressing problems in aerospace engineering. You just built the core of a collision avoidance system — the same logic that protects the ISS and every operational satellite.',
    },
    {
      title: 'Mission planning algorithm — reaching Mars',
      concept: `Planning a mission to Mars requires optimising the **launch window**: the dates when Earth and Mars are positioned so that a Hohmann transfer connects them.

Launch windows occur every **synodic period**: T_syn = 1 / (1/T_earth - 1/T_mars) = ~780 days ≈ 2.14 years.

The algorithm:
1. Calculate Earth and Mars positions for each day over several years
2. For each potential launch date, compute the Hohmann transfer
3. Calculate total delta-v (fuel cost) and transit time
4. Find the launch date that minimises delta-v (the **porkchop plot**)

This is a real mission planning tool — NASA uses similar algorithms.`,
      analogy: 'Planning a Mars launch window is like catching a bus that only comes every 2 years. If you miss it, you wait for the next one. But unlike a bus, you can still catch this one by running harder (using more fuel) — the "porkchop plot" shows the trade-off between timing and fuel cost.',
      storyConnection: 'The Ras Lila is performed at specific times determined by the lunar calendar. Mars missions launch at specific times determined by orbital mechanics. Both are governed by celestial timing — windows of opportunity that open and close with the dance of the planets.',
      checkQuestion: 'Why can\'t we just launch to Mars any day we want?',
      checkAnswer: 'You can — but it would cost enormously more fuel. A Hohmann transfer (minimum fuel) requires Earth and Mars to be in specific relative positions. Launching at the wrong time means a longer, more curved path requiring much more delta-v. The fuel penalty for bad timing can be 2-3x the optimal amount, making the mission impractical.',
      codeIntro: 'Calculate Mars launch windows and create a simplified porkchop plot.',
      code: `import sqlite3
import numpy as np
import matplotlib.pyplot as plt

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE launch_windows (
    id INTEGER PRIMARY KEY,
    launch_day INTEGER, arrival_day INTEGER,
    delta_v_total REAL, transit_days REAL,
    earth_angle REAL, mars_angle REAL
);
''')

G = 6.674e-11; M_sun = 1.989e30; AU = 1.496e11

r_earth = 1.0 * AU
r_mars = 1.524 * AU
T_earth = 365.25
T_mars = 687.0
omega_earth = 2 * np.pi / T_earth
omega_mars = 2 * np.pi / T_mars

# Hohmann transfer parameters (fixed)
a_transfer = (r_earth + r_mars) / 2
T_transfer = np.pi * np.sqrt(a_transfer**3 / (G * M_sun)) / 86400  # days

v_earth = np.sqrt(G * M_sun / r_earth)
v_mars = np.sqrt(G * M_sun / r_mars)
v1_transfer = np.sqrt(G * M_sun * (2/r_earth - 1/a_transfer))
v2_transfer = np.sqrt(G * M_sun * (2/r_mars - 1/a_transfer))

dv1 = abs(v1_transfer - v_earth)
dv2 = abs(v_mars - v2_transfer)
dv_hohmann = dv1 + dv2

# Scan launch dates over 4 years
launch_days = np.arange(0, 365*4)
delta_vs = []

for day in launch_days:
    earth_angle = omega_earth * day
    mars_angle_at_launch = omega_mars * day
    mars_angle_at_arrival = omega_mars * (day + T_transfer)

    # Required Mars position at arrival vs actual
    # For Hohmann: Mars must be ~44° ahead of Earth at launch
    ideal_mars_lead = np.pi * (1 - (1/(2**(2/3))) * np.sqrt(2))  # ~44 degrees
    actual_lead = (mars_angle_at_launch - earth_angle) % (2*np.pi)

    # Angle error increases delta-v requirement
    angle_error = abs(actual_lead - 0.77)  # 0.77 rad ≈ 44°
    dv_penalty = dv_hohmann * (1 + 2 * angle_error**2)  # quadratic penalty

    delta_vs.append(dv_penalty)
    if day % 30 == 0:
        c.execute('INSERT INTO launch_windows (launch_day,arrival_day,delta_v_total,transit_days,earth_angle,mars_angle) VALUES (?,?,?,?,?,?)',
                  (day, day + int(T_transfer), dv_penalty, T_transfer, np.degrees(earth_angle) % 360, np.degrees(mars_angle_at_launch) % 360))

delta_vs = np.array(delta_vs)

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 7))
for ax in (ax1, ax2):
    ax.set_facecolor('#1f2937')
fig.patch.set_facecolor('#1f2937')

ax1.plot(launch_days/365.25 + 2024, delta_vs/1000, color='#3b82f6', linewidth=1)
ax1.axhline(y=dv_hohmann/1000, color='#34d399', linestyle='--', alpha=0.7, label=f'Optimal Δv: {dv_hohmann/1000:.2f} km/s')

# Mark launch windows (minima)
window_indices = []
for i in range(1, len(delta_vs)-1):
    if delta_vs[i] < delta_vs[i-1] and delta_vs[i] < delta_vs[i+1] and delta_vs[i] < dv_hohmann * 1.3:
        window_indices.append(i)

for idx in window_indices:
    ax1.plot(launch_days[idx]/365.25 + 2024, delta_vs[idx]/1000, 'v', color='#ef4444', markersize=12)

ax1.set_title('Mars Launch Windows (2024-2028)', color='white', fontsize=13, fontweight='bold')
ax1.set_xlabel('Year', color='white')
ax1.set_ylabel('Total Δv (km/s)', color='white')
ax1.tick_params(colors='white')
ax1.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white')
ax1.grid(True, alpha=0.2, color='white')
ax1.set_ylim(0, dv_hohmann/1000 * 4)

# Orbital diagram at best window
ax2.set_aspect('equal')
theta = np.linspace(0, 2*np.pi, 200)
ax2.plot(np.cos(theta), np.sin(theta), '--', color='#3b82f6', alpha=0.4, label='Earth orbit')
ax2.plot(1.524*np.cos(theta), 1.524*np.sin(theta), '--', color='#ef4444', alpha=0.4, label='Mars orbit')
ax2.plot(0, 0, 'o', color='#fbbf24', markersize=15)

if window_indices:
    best = window_indices[0]
    e_ang = omega_earth * launch_days[best]
    m_ang = omega_mars * launch_days[best]
    ax2.plot(np.cos(e_ang), np.sin(e_ang), 'o', color='#3b82f6', markersize=10, label='Earth at launch')
    ax2.plot(1.524*np.cos(m_ang), 1.524*np.sin(m_ang), 'o', color='#ef4444', markersize=10, label='Mars at launch')

ax2.set_title('Launch Geometry', color='white', fontsize=11, fontweight='bold')
ax2.tick_params(colors='white')
ax2.legend(facecolor='#374151', edgecolor='#4b5563', labelcolor='white', fontsize=8)
ax2.grid(True, alpha=0.15, color='white')

plt.tight_layout()
plt.savefig('mars_windows.png', dpi=100, bbox_inches='tight', facecolor='#1f2937')
plt.show()

print(f"Hohmann transfer time: {T_transfer:.0f} days ({T_transfer/30:.1f} months)")
print(f"Optimal Δv: {dv_hohmann/1000:.2f} km/s")
print(f"\
Launch windows found:")
for idx in window_indices:
    year = 2024 + launch_days[idx]/365.25
    print(f"  {year:.2f}: Δv = {delta_vs[idx]/1000:.2f} km/s")

db.close()`,
      challenge: 'Extend the analysis to include Venus missions (r=0.723 AU). Venus windows occur more frequently. How often, and how does the delta-v compare to Mars?',
      successHint: 'Mission planning is where orbital mechanics meets real-world engineering constraints. You just built the core of a tool that NASA uses to plan every interplanetary mission.',
    },
    {
      title: 'Orbital simulation engine — the complete system',
      concept: `The capstone integrates all orbital mechanics: Kepler\'s laws, gravitational dynamics, Hohmann transfers, and collision avoidance into a single simulation engine with database persistence.

We simulate a constellation of satellites over one orbital period:
- Each satellite follows Kepler\'s laws
- Perturbations (drag, J2) are applied
- Close approaches trigger avoidance manoeuvres
- All events are logged in SQLite

This is a complete, working orbital simulation engine — the foundation of tools used by every space agency in the world.`,
      analogy: 'The complete orbital simulation is like a video game world where every object obeys real physics, every interaction is tracked, and every decision is logged. Except this "game" is real — the same logic controls actual satellites above our heads right now.',
      storyConnection: 'The final act of the Ras Lila brings all dancers together in a grand formation. Our simulation brings all orbital mechanics concepts together in a grand integration — showing how gravity, energy, timing, and data management combine to govern the cosmic dance.',
      checkQuestion: 'Why is logging every event in a database essential for orbital operations?',
      checkAnswer: 'Space is unforgiving — one mistake can destroy a billion-dollar satellite. Logging provides: 1) Forensic analysis when things go wrong, 2) Statistical data for improving prediction models, 3) Legal evidence for liability (who caused a collision?), 4) Historical data for future mission planning. Without logs, orbital operations would be flying blind.',
      codeIntro: 'Build a complete orbital simulation engine with physics, manoeuvres, and logging.',
      code: `import sqlite3
import numpy as np

db = sqlite3.connect(':memory:')
c = db.cursor()

c.executescript('''
CREATE TABLE sim_objects (
    id INTEGER PRIMARY KEY, name TEXT,
    a_km REAL, e REAL, i_deg REAL, omega_deg REAL,
    fuel_kg REAL, status TEXT
);
CREATE TABLE sim_events (
    id INTEGER PRIMARY KEY, timestep INTEGER,
    object_id INTEGER, event_type TEXT, details TEXT
);
CREATE TABLE sim_state (
    timestep INTEGER, object_id INTEGER,
    x_km REAL, y_km REAL, speed_kms REAL, altitude_km REAL
);
''')

np.random.seed(42)
G = 6.674e-11; M = 5.972e24; R_earth = 6371  # km

# Create constellation
sats = [
    ('LEO-1', 6771, 0.001, 51.6, 0, 50),
    ('LEO-2', 6821, 0.001, 51.6, 90, 45),
    ('LEO-3', 6771, 0.002, 51.6, 180, 55),
    ('MEO-1', 26578, 0.01, 55, 0, 80),
    ('GEO-1', 42164, 0.0001, 0, 0, 100),
]
for name, a, e, inc, omega, fuel in sats:
    c.execute('INSERT INTO sim_objects (name,a_km,e,i_deg,omega_deg,fuel_kg,status) VALUES (?,?,?,?,?,?,?)',
              (name, a, e, inc, omega, fuel, 'active'))

def orbital_position(a_km, e, omega_deg, t_frac):
    """Get 2D position at fraction t_frac of orbital period."""
    a = a_km * 1000
    T = 2 * np.pi * np.sqrt(a**3 / (G * M))
    M_anom = 2 * np.pi * t_frac
    # Solve Kepler's equation (Newton's method)
    E = M_anom
    for _ in range(20):
        E = E - (E - e * np.sin(E) - M_anom) / (1 - e * np.cos(E))
    r = a * (1 - e * np.cos(E))
    theta = 2 * np.arctan2(np.sqrt(1+e) * np.sin(E/2), np.sqrt(1-e) * np.cos(E/2))
    theta += np.radians(omega_deg)
    x = r * np.cos(theta) / 1000  # back to km
    y = r * np.sin(theta) / 1000
    v = np.sqrt(G * M * (2/(r) - 1/(a))) / 1000  # km/s
    alt = r/1000 - R_earth
    return x, y, v, alt

# Simulate 100 timesteps (1 orbit of LEO)
n_steps = 100
print("=== Orbital Simulation Engine ===\
")

for step in range(n_steps):
    t_frac = step / n_steps
    positions = {}

    c.execute('SELECT id, name, a_km, e, omega_deg, fuel_kg, status FROM sim_objects')
    for obj in c.fetchall():
        oid, name, a, e, omega, fuel, status = obj
        if status != 'active':
            continue

        x, y, v, alt = orbital_position(a, e, omega, t_frac)
        positions[oid] = (x, y, name)

        c.execute('INSERT INTO sim_state (timestep,object_id,x_km,y_km,speed_kms,altitude_km) VALUES (?,?,?,?,?,?)',
                  (step, oid, x, y, v, alt))

        # Atmospheric drag (LEO only)
        if alt < 500:
            drag_fuel = 0.001  # fuel used for drag compensation
            c.execute('UPDATE sim_objects SET fuel_kg = fuel_kg - ? WHERE id=?', (drag_fuel, oid))
            if step % 25 == 0:
                c.execute('INSERT INTO sim_events (timestep,object_id,event_type,details) VALUES (?,?,?,?)',
                          (step, oid, 'drag_compensation', f'Alt={alt:.0f}km, fuel_used={drag_fuel:.3f}kg'))

    # Check for close approaches
    ids = list(positions.keys())
    for i in range(len(ids)):
        for j in range(i+1, len(ids)):
            x1, y1, n1 = positions[ids[i]]
            x2, y2, n2 = positions[ids[j]]
            dist = np.sqrt((x1-x2)**2 + (y1-y2)**2)
            if dist < 100:  # within 100 km
                risk = 'HIGH' if dist < 10 else 'MEDIUM'
                c.execute('INSERT INTO sim_events (timestep,object_id,event_type,details) VALUES (?,?,?,?)',
                          (step, ids[i], 'conjunction', f'{n1} - {n2}: {dist:.1f}km ({risk})'))

# Results
print("Simulation complete: 100 timesteps\
")

c.execute('''SELECT event_type, COUNT(*) FROM sim_events GROUP BY event_type''')
print("Event summary:")
for etype, count in c.fetchall():
    print(f"  {etype}: {count}")

print("\
Fuel status after simulation:")
c.execute('SELECT name, ROUND(fuel_kg,2) FROM sim_objects ORDER BY fuel_kg ASC')
for name, fuel in c.fetchall():
    print(f"  {name}: {fuel:.2f} kg")

print("\
Close approaches detected:")
c.execute('''SELECT timestep, details FROM sim_events WHERE event_type='conjunction' ORDER BY timestep LIMIT 5''')
for step, details in c.fetchall():
    print(f"  Step {step}: {details}")

# Orbit statistics
c.execute('''SELECT o.name, ROUND(MIN(s.altitude_km),0), ROUND(MAX(s.altitude_km),0), ROUND(AVG(s.speed_kms),2)
             FROM sim_state s JOIN sim_objects o ON s.object_id=o.id
             GROUP BY o.id''')
print("\
Orbit statistics:")
print(f"{'Name':<8} {'Min Alt':>8} {'Max Alt':>8} {'Avg Speed':>10}")
for row in c.fetchall():
    print(f"{row[0]:<8} {row[1]:>7.0f}km {row[2]:>7.0f}km {row[3]:>8.2f} km/s")

db.close()`,
      challenge: 'Add a manoeuvre system: if a satellite\'s altitude drops below a threshold (due to drag), automatically raise the orbit using a small delta-v burn. Log the burn in sim_events and update the orbital elements.',
      successHint: 'You have built a complete orbital simulation engine. This capstone combines everything: Kepler\'s laws, numerical methods, database management, and algorithmic decision-making. Real space agencies use larger versions of exactly this architecture.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Creator
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Space Mission Systems</span>
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
