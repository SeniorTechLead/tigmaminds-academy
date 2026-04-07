import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function CharminorLevel4() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {title:'Build a GPS receiver simulator',concept:`In this capstone, you will build a complete **GPS receiver simulator**: generate satellite positions in orbit, calculate pseudoranges with realistic errors (atmospheric delay, clock bias, multipath), and solve for the receiver position using iterative least squares. The simulator will show how GPS achieves metre-level accuracy from signals traveling 20,000 km.\n\nThe pipeline: (1) compute satellite positions from orbital parameters, (2) compute true ranges from satellite to receiver, (3) add errors (clock bias, ionospheric delay, tropospheric delay, multipath), (4) solve the navigation equations using linearized least squares, (5) compute the position error and dilution of precision (DOP).\n\n**Dilution of Precision** (DOP) measures how satellite geometry amplifies measurement errors into position errors. Good geometry (satellites spread across the sky) gives low DOP. Bad geometry (satellites clustered together) gives high DOP. PDOP < 3 is good; > 6 is poor.\n\n📚 *GDOP = PDOP * TDOP. PDOP (position DOP) affects 3D position accuracy. HDOP affects horizontal accuracy. VDOP affects vertical accuracy. DOP is purely a function of satellite geometry — it multiplies the ranging error to give position error.*`,analogy:'GPS accuracy depends on satellite geometry like surveying accuracy depends on instrument placement. If you triangulate from three points that are all in a line, your cross-track position is very uncertain (high DOP). If the three points surround you, your position is well-determined (low DOP). GPS receivers automatically choose the satellites that give the best geometry.',storyConnection:'If a pigeon had access to GPS, it would navigate with metre-level precision — but it would also lose the remarkable biological navigation abilities that make pigeons such fascinating creatures. Your GPS simulator models the technology that has largely replaced the need for homing pigeons as message carriers, while also revealing the mathematical elegance shared by both biological and technological navigation.',checkQuestion:'A GPS receiver has HDOP = 1.5 and the ranging error is 3 metres. What is the expected horizontal position error?',checkAnswer:'Horizontal error = HDOP * ranging_error = 1.5 * 3 = 4.5 metres. With HDOP = 4.0 (poor geometry): 4.0 * 3 = 12 metres. Geometry matters as much as measurement accuracy!',codeIntro:'Build a complete GPS receiver that simulates satellite signals and solves for position.',code:`import numpy as np

R_EARTH = 6371000
R_ORBIT = 26571000
C = 299792458

class GPSSimulator:
    def __init__(self, n_satellites=8):
        self.n_sats = n_satellites
        self.sats = self._generate_satellites()

    def _generate_satellites(self):
        """Place satellites around the sky."""
        sats = []
        for i in range(self.n_sats):
            elev = np.radians(30 + 40 * np.random.random())
            azim = np.radians(i * 360 / self.n_sats + np.random.uniform(-20, 20))
            x = R_ORBIT * np.cos(elev) * np.cos(azim)
            y = R_ORBIT * np.cos(elev) * np.sin(azim)
            z = R_ORBIT * np.sin(elev)
            sats.append(np.array([x, y, z]))
        return sats

    def compute_pseudoranges(self, receiver_pos, clock_bias_m=450,
                              iono_err_m=5, tropo_err_m=2, noise_m=1):
        """Calculate pseudoranges with realistic errors."""
        prs = []
        for sat in self.sats:
            true_range = np.linalg.norm(sat - receiver_pos)
            errors = (clock_bias_m +
                     np.random.normal(0, iono_err_m) +
                     np.random.normal(0, tropo_err_m) +
                     np.random.normal(0, noise_m))
            prs.append(true_range + errors)
        return np.array(prs)

    def solve_position(self, pseudoranges, max_iter=20):
        """Iterative least squares position solver."""
        x = np.array([0, 0, R_EARTH, 0], dtype=float)  # x, y, z, clock_bias

        for iteration in range(max_iter):
            H = np.zeros((len(pseudoranges), 4))
            residuals = np.zeros(len(pseudoranges))

            for i, (sat, pr) in enumerate(zip(self.sats, pseudoranges)):
                dx = x[:3] - sat
                r = np.linalg.norm(dx)
                H[i, :3] = dx / r
                H[i, 3] = 1.0
                residuals[i] = pr - r - x[3]

            delta = np.linalg.lstsq(H, residuals, rcond=None)[0]
            x += delta
            if np.linalg.norm(delta[:3]) < 0.001:
                break

        return x[:3], x[3], H

    def compute_dop(self, H):
        """Compute dilution of precision from geometry matrix."""
        try:
            Q = np.linalg.inv(H.T @ H)
            PDOP = np.sqrt(Q[0,0] + Q[1,1] + Q[2,2])
            TDOP = np.sqrt(Q[3,3])
            GDOP = np.sqrt(PDOP**2 + TDOP**2)
            return PDOP, TDOP, GDOP
        except np.linalg.LinAlgError:
            return 99, 99, 99

# Simulate GPS at Hyderabad
hyd_lat, hyd_lon = np.radians(17.36), np.radians(78.47)
true_pos = np.array([
    R_EARTH * np.cos(hyd_lat) * np.cos(hyd_lon),
    R_EARTH * np.cos(hyd_lat) * np.sin(hyd_lon),
    R_EARTH * np.sin(hyd_lat)
])

np.random.seed(42)
gps = GPSSimulator(n_satellites=8)

print("=== GPS Receiver Simulation ===")
print(f"True position: Hyderabad (17.36N, 78.47E)")
print(f"Satellites: {gps.n_sats}")
print()

# Single fix
prs = gps.compute_pseudoranges(true_pos, clock_bias_m=450)
est_pos, clock_est, H = gps.solve_position(prs)

pos_error = np.linalg.norm(est_pos - true_pos)
pdop, tdop, gdop = gps.compute_dop(H)

print(f"Position error: {pos_error:.2f} m")
print(f"Clock bias estimated: {clock_est:.1f} m (true: 450 m)")
print(f"PDOP: {pdop:.2f} | TDOP: {tdop:.2f} | GDOP: {gdop:.2f}")
print()

# Statistical analysis: 200 fixes
print("=== Statistical Analysis (200 fixes) ===")
errors = []
for _ in range(200):
    prs = gps.compute_pseudoranges(true_pos)
    est, _, _ = gps.solve_position(prs)
    errors.append(np.linalg.norm(est - true_pos))

errors = np.array(errors)
print(f"Mean error: {np.mean(errors):.2f} m")
print(f"Median error: {np.median(errors):.2f} m")
print(f"95th percentile: {np.percentile(errors, 95):.2f} m")
print(f"Max error: {np.max(errors):.2f} m")
print()

# Effect of number of satellites
print("=== Accuracy vs Number of Satellites ===")
print(f"{'Satellites':>10} {'Avg error (m)':>14} {'95% (m)':>9} {'PDOP':>7}")
print("-" * 42)

for n in [4, 5, 6, 8, 10, 12]:
    gps_n = GPSSimulator(n_satellites=n)
    errs = []
    pdops = []
    for _ in range(100):
        prs = gps_n.compute_pseudoranges(true_pos)
        est, _, H = gps_n.solve_position(prs)
        errs.append(np.linalg.norm(est - true_pos))
        p, _, _ = gps_n.compute_dop(H)
        pdops.append(p)
    print(f"{n:>10} {np.mean(errs):>14.2f} {np.percentile(errs, 95):>9.2f} "
          f"{np.mean(pdops):>7.2f}")`,challenge:'Simulate "urban canyon" conditions where only 4 satellites are visible and they are all clustered in one part of the sky (high DOP). Compare the position error with normal 8-satellite, evenly-spread conditions. This is why GPS is less accurate between tall buildings.',successHint:'You built a working GPS receiver from scratch — the same algorithm running in every smartphone, car navigation system, and drone. The iterative least squares solver you implemented is the standard GPS positioning algorithm used worldwide.'},
    {title:'Build a pigeon homing flight simulator',concept:`Now you will simulate a complete pigeon homing flight: release, orientation, navigation, course correction, and arrival. The simulator models the pigeon multi-sensor navigation, wind effects, and the progressive switch from magnetic/sun navigation (far from home) to visual landmark navigation (near home).\n\nThe flight model has three phases: (1) **Orientation** (first few minutes — the pigeon circles to determine its position using magnetic map and sun compass), (2) **Cruise** (steady flight toward home using compass navigation with periodic corrections), (3) **Approach** (final 20 km — visual landmark navigation with high precision).\n\nAt each time step, the pigeon: (1) estimates its position using available sensors, (2) calculates the bearing toward home, (3) adds navigation error and wind drift, (4) updates its position. The simulation runs until the pigeon is within 100 metres of home.\n\n📚 *Pigeon flight parameters: cruise speed 60-80 km/h, maximum range 1000+ km, navigation error 5-15 degrees at long range, 1-3 degrees at short range. Most pigeons released 200 km away arrive home within 3-5 hours.*`,analogy:'The simulation is like a video game where the pigeon must navigate home through uncertain conditions. The "health bar" is the pigeon energy (which decreases with distance). The "minimap" starts blurry (magnetic navigation) and sharpens as the pigeon gets closer to home (visual navigation). Random wind gusts act as obstacles that push the pigeon off course.',storyConnection:'Every year, pigeon racing competitions release thousands of pigeons from distant locations. The birds race home, and the fastest pigeon wins. Your simulator can model these races: given release location, wind conditions, and individual navigation accuracy, predict flight time and arrival precision. Competitive pigeon racing is a serious sport with significant prize money, and understanding the navigation science is key to breeding and training winning birds.',checkQuestion:'A pigeon flies at 70 km/h with a 5-degree navigation error. After 100 km, how far off course is it?',checkAnswer:'Off-course distance = 100 * sin(5 degrees) = 100 * 0.0872 = 8.72 km. The pigeon then corrects, so the total path is longer: approximately 100 / cos(5) = 100.4 km. Over 200 km with corrections every 20 km, the total extra distance is modest — maybe 2-5%.',codeIntro:'Build a pigeon homing flight simulator with multi-sensor navigation and wind effects.',code:`import numpy as np

class PigeonFlightSim:
    """Simulate a pigeon homing flight."""

    def __init__(self, home_lat=17.3616, home_lon=78.4747):
        self.home = np.array([home_lat, home_lon])
        self.speed_kmh = 70
        self.dt_min = 5  # time step

    def distance_to_home(self, pos):
        dlat = (pos[0] - self.home[0]) * 111
        dlon = (pos[1] - self.home[1]) * 111 * np.cos(np.radians(self.home[0]))
        return np.sqrt(dlat**2 + dlon**2)

    def true_bearing_home(self, pos):
        dlat = (self.home[0] - pos[0]) * 111
        dlon = (self.home[1] - pos[1]) * 111 * np.cos(np.radians(self.home[0]))
        return np.degrees(np.arctan2(dlon, dlat)) % 360

    def nav_error(self, dist_km):
        """Navigation error depends on distance (worse far away)."""
        if dist_km > 100:
            return np.random.normal(0, 8)  # 8 degree std
        elif dist_km > 30:
            return np.random.normal(0, 4)  # 4 degrees
        elif dist_km > 5:
            return np.random.normal(0, 1.5)  # visual nav
        else:
            return np.random.normal(0, 0.5)  # near home

    def wind_effect(self):
        """Random wind drift (degrees bearing shift)."""
        return np.random.normal(0, 2)  # 2 degree std from wind

    def fly(self, start_lat, start_lon, wind_bearing=None, wind_speed=0):
        """Simulate a complete homing flight."""
        pos = np.array([start_lat, start_lon])
        dt_hrs = self.dt_min / 60
        step_km = self.speed_kmh * dt_hrs

        path = [pos.copy()]
        total_dist = 0
        time_min = 0

        # Orientation phase: circle for 5 minutes
        time_min += 5

        while True:
            dist = self.distance_to_home(pos)
            if dist < 0.1:  # within 100 m
                break
            if time_min > 600:  # 10 hour max
                break

            # Navigate
            true_brg = self.true_bearing_home(pos)
            nav_err = self.nav_error(dist)
            wind_err = self.wind_effect()
            actual_brg = true_brg + nav_err + wind_err

            # Move
            brg_rad = np.radians(actual_brg)
            dlat = step_km * np.cos(brg_rad) / 111
            dlon = step_km * np.sin(brg_rad) / (111 * np.cos(np.radians(pos[0])))
            pos = pos + np.array([dlat, dlon])
            total_dist += step_km
            time_min += self.dt_min
            path.append(pos.copy())

        direct_dist = self.distance_to_home(np.array([start_lat, start_lon]))
        efficiency = direct_dist / total_dist * 100 if total_dist > 0 else 0
        final_dist = self.distance_to_home(pos)

        return {
            "path": path, "time_min": time_min,
            "total_dist": total_dist, "direct_dist": direct_dist,
            "efficiency": efficiency, "final_dist": final_dist,
            "arrived": final_dist < 0.5,
        }

sim = PigeonFlightSim()
np.random.seed(42)

# Single flight from 150 km NE
start = (18.5, 79.7)
result = sim.fly(*start)

print("=== Pigeon Homing Flight Simulation ===")
print(f"Release: ({start[0]:.2f}, {start[1]:.2f})")
print(f"Home: ({sim.home[0]:.4f}, {sim.home[1]:.4f})")
print(f"Direct distance: {result['direct_dist']:.1f} km")
print(f"Total flight: {result['total_dist']:.1f} km")
print(f"Time: {result['time_min']:.0f} min ({result['time_min']/60:.1f} hrs)")
print(f"Efficiency: {result['efficiency']:.1f}%")
print(f"Final distance from home: {result['final_dist']*1000:.0f} m")
print(f"Arrived: {result['arrived']}")
print()

# Race simulation: 20 pigeons from same release point
print("=== Pigeon Race: 20 birds from 150 km ===")
times = []
efficiencies = []

for i in range(20):
    r = sim.fly(*start)
    if r["arrived"]:
        times.append(r["time_min"])
        efficiencies.append(r["efficiency"])

print(f"Arrivals: {len(times)}/20 ({len(times)/20*100:.0f}%)")
if times:
    print(f"Fastest: {min(times):.0f} min ({min(times)/60:.1f} hrs)")
    print(f"Slowest: {max(times):.0f} min ({max(times)/60:.1f} hrs)")
    print(f"Average: {np.mean(times):.0f} min ({np.mean(times)/60:.1f} hrs)")
    print(f"Avg efficiency: {np.mean(efficiencies):.1f}%")

print()
# Effect of release distance
print("=== Homing Success vs Distance ===")
print(f"{'Distance':>10} {'Success %':>10} {'Avg time':>10} {'Avg eff':>9}")
print("-" * 41)

for d_km in [20, 50, 100, 200, 300, 500]:
    d_deg = d_km / 111
    release = (sim.home[0] + d_deg, sim.home[1])
    successes = 0
    flight_times = []
    effs = []

    for _ in range(50):
        r = sim.fly(*release)
        if r["arrived"]:
            successes += 1
            flight_times.append(r["time_min"])
            effs.append(r["efficiency"])

    pct = successes / 50 * 100
    avg_t = np.mean(flight_times) if flight_times else 0
    avg_e = np.mean(effs) if effs else 0
    print(f"{d_km:>8} km {pct:>8.0f}% {avg_t:>8.0f} min {avg_e:>7.1f}%")`,challenge:'Add realistic wind: a constant 20 km/h wind from the west. How does this affect flight times for pigeons flying east vs west? Then add variable wind that changes direction every 30 minutes. How does this compare to constant wind?',successHint:'You built a biological navigation simulator — combining magnetoreception, solar compass, visual landmark recognition, and sensor fusion into a working pigeon homing model. This kind of agent-based simulation is used in ecology, robotics, and autonomous systems research.'},
    {title:'Build a complete navigation system with magnetic + GPS',concept:`In this final capstone, you will build an integrated navigation system that combines magnetic compass navigation (like a pigeon) with GPS positioning (like a phone). The system uses GPS when available and falls back to magnetic dead reckoning when GPS is lost (inside buildings, in canyons, or during jamming).\n\nThe system maintains a **state estimate** (position, velocity, heading) that is updated by two sources: (1) GPS fixes (when available, accurate to ~5m), and (2) magnetic compass + step counting (always available, but drifts over time). A simplified **Kalman filter** optimally combines these two sources.\n\nThis is exactly how modern navigation systems work: aircraft use GPS + inertial navigation (INS). Smartphones use GPS + WiFi + accelerometer + compass. Autonomous cars use GPS + lidar + cameras + IMU. All combine multiple sensors for robustness.\n\n📚 *Dead reckoning: estimating position by tracking heading and speed from a known starting point. Errors accumulate over time (drift). GPS provides periodic "fixes" that reset the accumulated error. The Kalman filter seamlessly blends dead reckoning between fixes.*`,analogy:'Dead reckoning is like walking with your eyes closed, counting steps and trying to maintain direction. You drift off course gradually. Opening your eyes briefly (GPS fix) lets you correct your position. The Kalman filter is like partly opening your eyes — you blend your step-counting estimate with what you see, trusting whichever is more reliable at each moment.',storyConnection:'A modern "urban pigeon" — a delivery drone flying through a city — faces the same navigation challenges as a biological pigeon. It uses GPS in open sky but loses signal between tall buildings. In those GPS-denied zones, it must navigate by dead reckoning (compass + speed sensor), just as a pigeon uses its internal magnetic compass. Your integrated system solves both cases.',checkQuestion:'A drone navigates by dead reckoning for 5 minutes at 10 m/s with a 2-degree heading error. How far off course is it?',checkAnswer:'Distance traveled: 10 * 300 = 3000 m. Off-course error: 3000 * sin(2 degrees) = 3000 * 0.0349 = 104.7 m. After 5 minutes, the drone is over 100 m off course — a GPS fix is needed.',codeIntro:'Build an integrated magnetic + GPS navigation system with Kalman filtering.',code:`import numpy as np

class IntegratedNavigator:
    """Navigation system combining GPS and magnetic dead reckoning."""

    def __init__(self):
        self.pos = np.array([0.0, 0.0])  # metres
        self.heading = 0.0  # degrees
        self.pos_uncertainty = 10.0  # metres

    def gps_fix(self, true_pos, gps_noise=5.0):
        """Simulate a GPS position fix."""
        measured = true_pos + np.random.normal(0, gps_noise, 2)
        return measured, gps_noise

    def dead_reckon(self, speed, heading_true, dt, heading_noise=2.0):
        """Dead reckoning: advance position based on heading and speed."""
        heading_measured = heading_true + np.random.normal(0, heading_noise)
        heading_rad = np.radians(heading_measured)
        dx = speed * dt * np.sin(heading_rad)
        dy = speed * dt * np.cos(heading_rad)
        return np.array([dx, dy]), heading_noise

    def kalman_update(self, dr_estimate, dr_uncertainty,
                       gps_estimate=None, gps_uncertainty=None):
        """Simplified Kalman filter update."""
        # Predict step (dead reckoning)
        self.pos += dr_estimate
        self.pos_uncertainty = np.sqrt(self.pos_uncertainty**2 + dr_uncertainty**2)

        # Update step (GPS, if available)
        if gps_estimate is not None and gps_uncertainty is not None:
            K = self.pos_uncertainty**2 / (self.pos_uncertainty**2 + gps_uncertainty**2)
            self.pos = self.pos + K * (gps_estimate - self.pos)
            self.pos_uncertainty *= np.sqrt(1 - K)

        return self.pos.copy(), self.pos_uncertainty

# Simulate a drone delivery flight
nav = IntegratedNavigator()
np.random.seed(42)

# Flight plan: 2 km east, then 1 km north, then return
waypoints = [(2000, 0), (2000, 1000), (0, 0)]
speed = 10.0  # m/s
dt = 1.0  # second

print("=== Integrated Navigation Simulation ===")
print(f"Speed: {speed} m/s | GPS available: intermittent")
print()

true_pos = np.array([0.0, 0.0])
total_time = 0
gps_available = True

results = []
for wp_idx, target in enumerate(waypoints):
    target = np.array(target, dtype=float)
    print(f"--- Leg {wp_idx+1}: heading to ({target[0]:.0f}, {target[1]:.0f}) ---")

    while np.linalg.norm(true_pos - target) > 10:
        # True heading toward target
        diff = target - true_pos
        true_heading = np.degrees(np.arctan2(diff[0], diff[1])) % 360

        # Move (true position)
        heading_rad = np.radians(true_heading)
        true_pos += speed * dt * np.array([np.sin(heading_rad), np.cos(heading_rad)])
        total_time += dt

        # Dead reckoning
        dr_step, dr_unc = nav.dead_reckon(speed, true_heading, dt)

        # GPS: available 70% of time, lost in "buildings"
        gps_available = np.random.random() < 0.7
        if gps_available:
            gps_pos, gps_unc = nav.gps_fix(true_pos)
            est_pos, uncertainty = nav.kalman_update(dr_step, dr_unc * speed * dt / 57.3, gps_pos, gps_unc)
        else:
            est_pos, uncertainty = nav.kalman_update(dr_step, dr_unc * speed * dt / 57.3)

        error = np.linalg.norm(est_pos - true_pos)

        if total_time % 30 == 0:
            results.append({
                "time": total_time, "error": error,
                "uncertainty": uncertainty, "gps": gps_available,
            })

    print(f"  Arrived at waypoint in {total_time:.0f}s")

print()
print("=== Navigation Performance ===")
print(f"{'Time (s)':>9} {'Error (m)':>10} {'Uncertainty':>12} {'GPS':>5}")
print("-" * 38)

for r in results[::3]:  # every 3rd entry
    print(f"{r['time']:>9.0f} {r['error']:>10.1f} {r['uncertainty']:>12.1f} "
          f"{'Yes' if r['gps'] else 'No':>5}")

errors = [r["error"] for r in results]
print(f"\\nAverage error: {np.mean(errors):.1f} m")
print(f"Max error: {np.max(errors):.1f} m")
print(f"GPS availability: {sum(1 for r in results if r['gps'])/len(results)*100:.0f}%")

# Compare modes
print()
print("=== Navigation Mode Comparison ===")
gps_errors = [r["error"] for r in results if r["gps"]]
dr_errors = [r["error"] for r in results if not r["gps"]]
print(f"With GPS: avg error {np.mean(gps_errors):.1f} m ({len(gps_errors)} samples)")
if dr_errors:
    print(f"DR only: avg error {np.mean(dr_errors):.1f} m ({len(dr_errors)} samples)")
print(f"Combined: avg error {np.mean(errors):.1f} m (fusion always helps)")`,challenge:'Simulate a GPS jamming attack: GPS becomes unavailable for 5 continuous minutes. How far does the position estimate drift? Then simulate a pigeon-like solution: add a "magnetic map" sensor that provides a position fix every 60 seconds with 50 m accuracy. How much does this help during the GPS outage?',successHint:'You built an integrated navigation system using the same architecture as every modern vehicle, aircraft, and smartphone. The Kalman filter combining GPS with dead reckoning is the standard approach in navigation engineering. From submarine INS to Mars rover navigation, this framework is universal.'},
    {title:'Complete navigation simulator — from magnetic poles to city streets',concept:`In this final exercise, you integrate everything into a comprehensive navigation simulator that models the full stack: Earth magnetic field, satellite orbits, signal propagation, receiver processing, sensor fusion, and route navigation. The simulator answers practical questions: How accurate is navigation in different environments? What happens when GPS fails? How does a pigeon compare to GPS?\n\nThe system models three navigation modes: (1) **GPS mode** (satellite-based, 3-10 m accuracy, requires sky view), (2) **Magnetic mode** (compass + dead reckoning, 50-200 m accuracy, works everywhere), (3) **Pigeon mode** (magnetic map + sun compass + visual landmarks, 0.1-20 km accuracy depending on distance).\n\nBy comparing these modes across different scenarios (urban, rural, indoor, maritime), you can understand why modern navigation uses multi-sensor fusion — and why biological navigation, while less precise, is remarkably robust.\n\n📚 *The navigation problem has four components: (1) Position — where am I? (2) Velocity — how fast and in what direction? (3) Attitude — which way am I pointing? (4) Time — when is it? GPS provides all four. A compass provides only attitude. A magnetic map provides coarse position. Combining all sensors gives the complete picture.*`,analogy:'Think of navigation as assembling a jigsaw puzzle. GPS gives you the big picture (where you are on the globe). The compass gives you orientation (which way you are facing). Dead reckoning fills in the details between GPS fixes. Visual landmarks confirm your position. Each sensor provides a different piece of the puzzle. Together, they form a complete picture.',storyConnection:'The pigeons of Charminar and the GPS satellites overhead are both solving the same fundamental problem: determining position on the surface of a sphere using imperfect measurements. The pigeon uses biological sensors evolved over millions of years. GPS uses technology developed over decades. Both achieve remarkable accuracy by combining multiple information sources. Your simulator brings both approaches together in one unified framework.',checkQuestion:'Rank these navigation methods by accuracy: (1) GPS, (2) compass dead reckoning for 10 min, (3) pigeon at 200 km, (4) pigeon at 5 km, (5) visual landmarks.',checkAnswer:'From most to least accurate: (5) Visual landmarks: ~10 m. (1) GPS: ~5 m. (4) Pigeon at 5 km: ~200 m. (2) DR for 10 min: ~300 m. (3) Pigeon at 200 km: ~20 km.',codeIntro:'Build the ultimate navigation comparison: GPS vs compass vs pigeon across multiple scenarios.',code:`import numpy as np

class NavigationBenchmark:
    """Compare navigation methods across scenarios."""

    def __init__(self):
        self.R = 6371  # km

    def gps_accuracy(self, n_satellites, hdop, multipath=False):
        """GPS horizontal accuracy in metres."""
        base_error = 3.0  # metres
        error = base_error * hdop
        if multipath:
            error += np.random.exponential(5)
        if n_satellites < 4:
            return float('inf')
        return error + np.random.normal(0, 1)

    def compass_dr_accuracy(self, time_min, speed_ms, heading_error_deg=2):
        """Dead reckoning error after given time."""
        distance = speed_ms * time_min * 60
        cross_track = distance * np.sin(np.radians(heading_error_deg))
        along_track = distance * 0.02  # 2% speed error
        return np.sqrt(cross_track**2 + along_track**2)

    def pigeon_accuracy(self, distance_km):
        """Pigeon navigation error at given distance from home."""
        if distance_km < 5:
            return distance_km * 0.02 * 1000  # 2% of distance in metres (visual)
        elif distance_km < 50:
            return distance_km * 0.05 * 1000  # 5% (familiar territory)
        else:
            return distance_km * 0.10 * 1000  # 10% (unfamiliar, magnetic only)

    def run_scenario(self, name, conditions):
        """Run a navigation scenario and compare methods."""
        results = {}
        trials = 200

        for method, params in conditions.items():
            errors = []
            for _ in range(trials):
                if method == "GPS":
                    err = self.gps_accuracy(**params)
                elif method == "Compass DR":
                    err = self.compass_dr_accuracy(**params)
                elif method == "Pigeon":
                    err = self.pigeon_accuracy(**params)
                else:
                    err = 0
                errors.append(abs(err))

            results[method] = {
                "mean": np.mean(errors),
                "p95": np.percentile(errors, 95),
                "available": all(e < 1e6 for e in errors),
            }

        return results

bench = NavigationBenchmark()
np.random.seed(42)

scenarios = {
    "Open field (ideal GPS)": {
        "GPS": {"n_satellites": 10, "hdop": 1.2},
        "Compass DR": {"time_min": 10, "speed_ms": 1.5},
        "Pigeon": {"distance_km": 50},
    },
    "Urban canyon (poor GPS)": {
        "GPS": {"n_satellites": 5, "hdop": 3.5, "multipath": True},
        "Compass DR": {"time_min": 10, "speed_ms": 1.5},
        "Pigeon": {"distance_km": 10},
    },
    "Indoor (no GPS)": {
        "GPS": {"n_satellites": 0, "hdop": 99},
        "Compass DR": {"time_min": 5, "speed_ms": 1.5},
        "Pigeon": {"distance_km": 0.5},
    },
    "Open ocean": {
        "GPS": {"n_satellites": 12, "hdop": 1.0},
        "Compass DR": {"time_min": 60, "speed_ms": 5},
        "Pigeon": {"distance_km": 500},
    },
    "Long distance (200 km)": {
        "GPS": {"n_satellites": 8, "hdop": 1.5},
        "Compass DR": {"time_min": 120, "speed_ms": 1.5},
        "Pigeon": {"distance_km": 200},
    },
}

print("=" * 65)
print("    NAVIGATION METHOD BENCHMARK")
print("=" * 65)
print()

for scenario_name, conditions in scenarios.items():
    results = bench.run_scenario(scenario_name, conditions)
    print(f"--- {scenario_name} ---")
    print(f"{'Method':<16} {'Mean error':>12} {'95th pct':>10} {'Available':>10}")
    print("-" * 50)

    for method, r in sorted(results.items(), key=lambda x: x[1]["mean"]):
        if r["available"]:
            unit = "m" if r["mean"] < 1000 else "km"
            mean = r["mean"] if unit == "m" else r["mean"] / 1000
            p95 = r["p95"] if unit == "m" else r["p95"] / 1000
            print(f"{method:<16} {mean:>10.1f} {unit} {p95:>8.1f} {unit} {'Yes':>10}")
        else:
            print(f"{method:<16} {'N/A':>12} {'N/A':>10} {'No':>10}")

    # Winner
    available = {m: r for m, r in results.items() if r["available"]}
    if available:
        winner = min(available, key=lambda m: available[m]["mean"])
        print(f"  Best method: {winner}")
    print()

print("=== Key Findings ===")
print("1. GPS wins in open sky (3-10 m accuracy)")
print("2. Compass DR works everywhere but drifts over time")
print("3. Pigeons excel at medium range with visual landmarks")
print("4. No single method is best in ALL scenarios")
print("5. Sensor fusion (combining all methods) is always superior")
print()
print("This is why modern navigation uses GPS + INS + compass + vision.")
print("And why pigeons use magnetic + sun + landmarks + smell.")
print("The lesson: robust navigation requires multiple sensors.")`,challenge:'Add a "fused" navigation mode that combines GPS (when available) with compass DR (always available) using weighted averaging based on reliability. Show that the fused system is better than either alone in EVERY scenario. This proves the fundamental principle of sensor fusion.',successHint:'You have built a comprehensive navigation benchmark that compares biological and technological navigation across multiple scenarios. This kind of multi-method comparison is how navigation system designers evaluate technologies for specific applications — from indoor robots to interplanetary spacecraft. The universal lesson is that combining multiple imperfect sensors always beats relying on a single "perfect" one.'},
    {title:'Putting it all together — a navigation challenge course',concept:`In this final capstone exercise, you will run a comprehensive navigation challenge: a simulated agent must navigate a 50 km course through varied terrain (open fields, urban areas, tunnels, rivers) using all available navigation tools. The course tests GPS availability, compass accuracy, visual landmark detection, and the agent ability to fuse sensors and make decisions.\n\nThe challenge course has 5 segments: (1) Open highway (excellent GPS, 10 km), (2) Dense city (poor GPS, landmarks, 8 km), (3) Underground tunnel (no GPS, no landmarks, 2 km), (4) River valley (moderate GPS, magnetic anomalies, 15 km), (5) Home approach (good GPS, familiar landmarks, 15 km).\n\nScoring: position error is measured at 10 checkpoints. The final score is the RMS (root mean square) error across all checkpoints. A perfect GPS-only system would score about 5 metres. A compass-only system would score about 500 metres. Your fused system should be somewhere in between — and closer to GPS when GPS is available.\n\n📚 *RMS error = sqrt(mean(errors^2)). RMS gives more weight to large errors than simple mean, making it a good metric for navigation quality — a single large error (getting lost) should dominate the score.*`,analogy:'The navigation challenge is like an orienteering race where you must find checkpoints using map, compass, and GPS — but your GPS battery dies halfway through, and the map has some errors. The winner is not the fastest runner but the one who maintains the most accurate navigation throughout the entire course.',storyConnection:'This challenge course represents the real navigation experience of a pigeon flying across the varied landscape between Indian cities: open farmland (easy navigation), crowded cities (confusing), river crossings (useful landmarks), and the familiar home territory. Every pigeon race is essentially this challenge course — and the winning pigeon is the one that navigates most accurately across all terrain types.',checkQuestion:'A course has 10 checkpoints with errors [3, 5, 4, 50, 3, 6, 4, 5, 3, 4] metres. What is the RMS error? How does the one large error (50 m) affect the score?',checkAnswer:'RMS = sqrt((9+25+16+2500+9+36+16+25+9+16)/10) = sqrt(2661/10) = sqrt(266.1) = 16.3 m. Without the 50 m outlier: sqrt(161/9) = 4.2 m. The single large error quadrupled the RMS score. Consistency matters!',codeIntro:'Run the complete navigation challenge and score your system.',code:`import numpy as np

class NavigationChallenge:
    """50 km navigation challenge through varied terrain."""

    def __init__(self):
        self.segments = [
            {"name": "Highway", "dist_km": 10, "gps_quality": 0.95,
             "mag_anomaly": False, "landmarks": False},
            {"name": "City", "dist_km": 8, "gps_quality": 0.4,
             "mag_anomaly": False, "landmarks": True},
            {"name": "Tunnel", "dist_km": 2, "gps_quality": 0.0,
             "mag_anomaly": True, "landmarks": False},
            {"name": "River Valley", "dist_km": 15, "gps_quality": 0.7,
             "mag_anomaly": True, "landmarks": True},
            {"name": "Home Approach", "dist_km": 15, "gps_quality": 0.9,
             "mag_anomaly": False, "landmarks": True},
        ]
        self.checkpoints = 10

    def navigate_segment(self, segment, method="fused"):
        """Navigate one segment and return position errors."""
        errors = []
        n_checks = max(1, int(segment["dist_km"] / 5))

        for _ in range(n_checks):
            if method == "gps_only":
                if np.random.random() < segment["gps_quality"]:
                    err = np.random.normal(0, 5) + np.abs(np.random.normal(0, 2))
                else:
                    err = 1000  # lost
            elif method == "compass_only":
                err = segment["dist_km"] * 10 * (1 + np.random.random())
                if segment["mag_anomaly"]:
                    err *= 3
            elif method == "pigeon":
                base = segment["dist_km"] * 5
                if segment["landmarks"]:
                    base *= 0.3
                err = base * (0.5 + np.random.random())
            elif method == "fused":
                gps_err = None
                if np.random.random() < segment["gps_quality"]:
                    gps_err = abs(np.random.normal(0, 5))
                compass_err = segment["dist_km"] * 8 * (1 + 0.5*np.random.random())
                if segment["mag_anomaly"]:
                    compass_err *= 2
                landmark_err = None
                if segment["landmarks"]:
                    landmark_err = abs(np.random.normal(0, 20))

                # Fusion: weighted average of available sensors
                estimates = []
                weights = []
                if gps_err is not None:
                    estimates.append(gps_err)
                    weights.append(1 / 5**2)
                estimates.append(compass_err)
                weights.append(1 / 100**2)
                if landmark_err is not None:
                    estimates.append(landmark_err)
                    weights.append(1 / 20**2)

                total_w = sum(weights)
                err = sum(e * w for e, w in zip(estimates, weights)) / total_w
            else:
                err = 100

            errors.append(abs(err))

        return errors

    def run_challenge(self, method="fused"):
        """Run the complete challenge course."""
        all_errors = []
        segment_results = []

        for seg in self.segments:
            errors = self.navigate_segment(seg, method)
            all_errors.extend(errors)
            rms = np.sqrt(np.mean(np.array(errors)**2))
            segment_results.append({"name": seg["name"], "rms": rms,
                                     "max": max(errors), "checks": len(errors)})

        total_rms = np.sqrt(np.mean(np.array(all_errors)**2))
        return segment_results, total_rms

challenge = NavigationChallenge()
np.random.seed(42)

methods = ["gps_only", "compass_only", "pigeon", "fused"]

print("=" * 60)
print("    NAVIGATION CHALLENGE: 50 km COURSE")
print("=" * 60)
print()

method_scores = {}
for method in methods:
    segments, total_rms = challenge.run_challenge(method)
    method_scores[method] = total_rms

    print(f"--- Method: {method.upper()} ---")
    print(f"{'Segment':<18} {'RMS (m)':>9} {'Max (m)':>9} {'Checks':>7}")
    print("-" * 45)
    for s in segments:
        print(f"{s['name']:<18} {s['rms']:>9.1f} {s['max']:>9.1f} {s['checks']:>7}")
    print(f"{'TOTAL':.<18} {total_rms:.1f} m RMS")
    print()

# Final scoreboard
print("=== FINAL SCOREBOARD ===")
print(f"{'Method':<16} {'RMS Score':>10} {'Rank':>6}")
print("-" * 34)

ranked = sorted(method_scores.items(), key=lambda x: x[1])
for rank, (method, score) in enumerate(ranked, 1):
    medal = " ***" if rank == 1 else ""
    print(f"{method:<16} {score:>8.1f} m {rank:>5}{medal}")

print()
winner = ranked[0][0]
print(f"Winner: {winner.upper()}")
print(f"Sensor fusion reduces errors by combining the strengths")
print(f"of each method while compensating for their weaknesses.")`,challenge:'Add a "pigeon_fused" method that combines pigeon magnetic map with pigeon visual landmarks using weighted fusion. How does the biological fusion compare to the technological fusion? Run 100 trials and compare the score distributions.',successHint:'You have completed the full navigation journey — from Earth magnetic field to GPS satellites to pigeon biology to sensor fusion algorithms. The universal principle is clear: no single sensor is perfect, but combining multiple imperfect sensors produces remarkably accurate navigation. This principle drives all modern navigation technology, from your phone to Mars rovers.'},
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 4: Capstone
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Build a navigation simulator with magnetic + GPS</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These capstone exercises build complete navigation systems combining magnetic, GPS, and visual sensors.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
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
