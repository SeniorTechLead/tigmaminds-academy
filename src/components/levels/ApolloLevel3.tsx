import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ApolloLevel3() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Three-body problem — model Earth-Moon-spacecraft interactions',
      concept: `In reality, a spacecraft travelling to the Moon is influenced by **both** Earth's and the Moon's gravity simultaneously. This is the **restricted three-body problem** — one of the most famous unsolved problems in classical mechanics.

Unlike the two-body problem (which has a clean analytical solution — the vis-viva equation), the three-body problem has **no general closed-form solution**. The only way to predict the spacecraft's path is to **numerically integrate** the equations of motion step by step.

At each time step, you calculate the gravitational pull from both Earth and the Moon, sum the forces, update the velocity, and update the position. The trajectory that emerges is complex — the spacecraft doesn't follow a simple ellipse but traces a curve that bends as the Moon's influence grows.

There is a critical point called the **L1 Lagrange point** — about 326,000 km from Earth — where Earth's and the Moon's gravitational pulls balance. Beyond L1, the Moon's gravity dominates and the spacecraft falls toward it.

📚 *Henri Poincare proved in 1887 that the general three-body problem has no closed-form solution — it can exhibit chaotic behaviour where tiny changes in initial conditions lead to wildly different outcomes.*`,
      analogy: 'Imagine walking between two magnets on a table. Near the first magnet, you are pulled strongly toward it. As you walk away, its pull weakens and the second magnet\'s pull grows. At some point in the middle, both pulls are equal — that is the Lagrange point. Beyond it, the second magnet "wins" and you accelerate toward it. The three-body problem computes this tug-of-war at every point in space.',
      storyConnection: 'Apollo mission planners could not use simple elliptical orbits for the full Earth-to-Moon trajectory. They used numerical integration on IBM mainframes to compute the exact path, accounting for both Earth and Moon gravity. The mid-course corrections during transit were needed precisely because the three-body dynamics are so sensitive to initial conditions.',
      checkQuestion: 'At the L1 Lagrange point between Earth and Moon, the gravitational accelerations from both bodies are equal. If Earth\'s mass is 81x the Moon\'s, and the Earth-Moon distance is 384,400 km, approximately where is L1?',
      checkAnswer: 'At L1: GM_earth/r^2 = GM_moon/(D-r)^2, so r^2/((D-r)^2) = M_earth/M_moon = 81. Taking square roots: r/(D-r) = 9, so r = 9D/10 = 345,960 km from Earth (or 38,440 km from the Moon). The actual L1 is at about 326,000 km due to the rotating reference frame correction.',
      codeIntro: 'Numerically integrate the trajectory of a spacecraft in the Earth-Moon system.',
      code: `import numpy as np

# Constants
G = 6.674e-11
M_earth = 5.972e24
M_moon = 7.342e22
D_em = 384_400_000  # Earth-Moon distance (m)

GM_e = G * M_earth
GM_m = G * M_moon

def acceleration(pos):
    """Gravitational acceleration from Earth (at origin) and Moon (at D_em, 0)."""
    # Earth at origin
    r_earth = np.sqrt(pos[0]**2 + pos[1]**2)
    a_earth = -GM_e * pos / r_earth**3

    # Moon at (D_em, 0)
    r_moon_vec = pos - np.array([D_em, 0.0])
    r_moon = np.sqrt(r_moon_vec[0]**2 + r_moon_vec[1]**2)
    a_moon = -GM_m * r_moon_vec / r_moon**3

    return a_earth + a_moon

# Initial conditions: spacecraft in LEO, TLI velocity
r0 = np.array([6_571_000.0, 0.0])  # LEO, 200 km altitude
v_circular = np.sqrt(GM_e / r0[0])
v_tli = v_circular * 1.395  # TLI boost factor
v0 = np.array([0.0, v_tli])  # velocity perpendicular to position

print("=== Three-Body Trajectory: Earth-Moon-Spacecraft ===")
print(f"Initial position: {r0[0]/1000:.0f} km from Earth centre")
print(f"Circular velocity: {v_circular:.0f} m/s")
print(f"TLI velocity: {v_tli:.0f} m/s (delta-v = {v_tli - v_circular:.0f} m/s)")

# Numerical integration using Velocity Verlet
dt = 60.0  # 1-minute time steps
max_time = 5 * 86400  # 5 days
pos = r0.copy()
vel = v0.copy()
time = 0.0

# Track trajectory
log_interval = 3600  # log every hour
log_time = []
log_dist_earth = []
log_dist_moon = []
log_speed = []

closest_moon = float('inf')
closest_moon_time = 0

while time < max_time:
    # Velocity Verlet integration
    acc = acceleration(pos)
    pos_new = pos + vel * dt + 0.5 * acc * dt**2
    acc_new = acceleration(pos_new)
    vel_new = vel + 0.5 * (acc + acc_new) * dt

    pos = pos_new
    vel = vel_new
    time += dt

    # Distances
    d_earth = np.sqrt(pos[0]**2 + pos[1]**2)
    d_moon = np.sqrt((pos[0] - D_em)**2 + pos[1]**2)
    speed = np.sqrt(vel[0]**2 + vel[1]**2)

    if d_moon < closest_moon:
        closest_moon = d_moon
        closest_moon_time = time

    # Check for Moon crash or Earth return
    if d_moon < 1_737_000:  # Moon radius
        print(f"\
*** LUNAR IMPACT at t = {time/3600:.1f} hours ***")
        break
    if d_earth < 6_371_000 and time > 3600:  # Earth radius
        print(f"\
*** EARTH RETURN at t = {time/3600:.1f} hours ***")
        break

    # Log every hour
    if int(time) % log_interval < dt:
        log_time.append(time / 3600)
        log_dist_earth.append(d_earth / 1000)
        log_dist_moon.append(d_moon / 1000)
        log_speed.append(speed)

# Print trajectory summary
print(f"\
=== Trajectory Summary ===")
print(f"{'Time (hr)':>10} {'Earth (km)':>14} {'Moon (km)':>14} {'Speed (m/s)':>12}")
print("-" * 52)
step = max(1, len(log_time) // 15)
for i in range(0, len(log_time), step):
    print(f"{log_time[i]:>9.1f} {log_dist_earth[i]:>13,.0f} {log_dist_moon[i]:>13,.0f} {log_speed[i]:>11,.0f}")

print(f"\
Closest approach to Moon: {closest_moon/1000:,.0f} km at t = {closest_moon_time/3600:.1f} hours")

# Compare with simple two-body prediction
v_2body_at_moon = np.sqrt(GM_e * (2/D_em - 2/(r0[0] + D_em)))
print(f"\
Two-body predicted speed at Moon distance: {v_2body_at_moon:.0f} m/s")
print(f"Three-body actual speed near Moon: {log_speed[-1]:.0f} m/s")
print(f"Difference due to Moon's gravity: {abs(log_speed[-1] - v_2body_at_moon):.0f} m/s")`,
      challenge: 'Adjust the TLI velocity to achieve a free-return trajectory — one where the spacecraft swings around the Moon and returns to Earth without any burns. Try boost factors between 1.38 and 1.42. The Apollo 13 free-return trajectory saved the crew\'s lives.',
      successHint: 'You just solved the restricted three-body problem numerically — the same computation that NASA\'s trajectory designers perform for every lunar and interplanetary mission. The key insight: when analytical solutions don\'t exist, numerical integration lets you compute trajectories to arbitrary precision.',
    },
    {
      title: 'Attitude control — quaternion-based spacecraft orientation',
      concept: `A spacecraft must control its **attitude** (orientation in 3D space) with extreme precision. The Apollo Command Module used reaction control thrusters to rotate, and the guidance computer tracked orientation using **quaternions**.

**Euler angles** (pitch, yaw, roll) seem intuitive but suffer from **gimbal lock** — a singularity where two rotation axes align and one degree of freedom is lost. Quaternions avoid gimbal lock entirely.

A quaternion is a 4-component number: **q = (w, x, y, z)** where w is the scalar part and (x, y, z) is the vector part. A unit quaternion represents a rotation: the axis of rotation is (x, y, z) / ||(x,y,z)||, and the angle is 2 * arccos(w).

Quaternion multiplication composes rotations. To rotate vector v by quaternion q: **v' = q * v * q_conjugate**. This is computationally efficient and numerically stable — exactly what a guidance computer needs.

📚 *Gimbal lock caused real problems for Apollo: the spacecraft's inertial measurement unit (IMU) used three physical gimbals. If the craft pitched 90 degrees, two gimbals aligned and the IMU lost one axis of measurement. The astronauts had to avoid certain orientations to prevent this.*`,
      analogy: 'Think of describing a location on Earth. Latitude and longitude work everywhere EXCEPT at the North and South Poles, where longitude becomes meaningless — all meridians converge to a point. This is analogous to gimbal lock: at certain orientations, Euler angles become degenerate. Quaternions are like using a different coordinate system that has no poles — they work everywhere, uniformly.',
      storyConnection: 'Apollo 11\'s inertial guidance system tracked the spacecraft\'s orientation by integrating rotation rates from gyroscopes. The onboard computer used a quaternion representation to avoid gimbal lock — one of the first real-world applications of quaternion algebra in engineering. When the astronauts performed the "barbecue roll" (slow rotation for thermal balance), the quaternion math tracked it smoothly.',
      checkQuestion: 'A spacecraft needs to rotate 90 degrees around the z-axis. What quaternion represents this rotation?',
      checkAnswer: 'Rotation angle theta = 90 degrees = pi/2. Quaternion: q = (cos(theta/2), 0, 0, sin(theta/2)) = (cos(pi/4), 0, 0, sin(pi/4)) = (0.707, 0, 0, 0.707). The scalar part w = cos(45 degrees) = 0.707, and the z-component = sin(45 degrees) = 0.707.',
      codeIntro: 'Implement quaternion-based attitude control for the Apollo spacecraft.',
      code: `import numpy as np

class Quaternion:
    """Unit quaternion for 3D rotation."""
    def __init__(self, w, x, y, z):
        self.q = np.array([w, x, y, z], dtype=float)
        self._normalise()

    def _normalise(self):
        n = np.linalg.norm(self.q)
        if n > 0:
            self.q /= n

    @property
    def w(self): return self.q[0]
    @property
    def x(self): return self.q[1]
    @property
    def y(self): return self.q[2]
    @property
    def z(self): return self.q[3]

    @staticmethod
    def from_axis_angle(axis, angle_deg):
        """Create quaternion from rotation axis and angle."""
        angle_rad = np.radians(angle_deg) / 2
        axis = np.array(axis, dtype=float)
        axis = axis / np.linalg.norm(axis)
        return Quaternion(np.cos(angle_rad),
                         axis[0] * np.sin(angle_rad),
                         axis[1] * np.sin(angle_rad),
                         axis[2] * np.sin(angle_rad))

    def multiply(self, other):
        """Quaternion multiplication (composes rotations)."""
        w1, x1, y1, z1 = self.q
        w2, x2, y2, z2 = other.q
        return Quaternion(
            w1*w2 - x1*x2 - y1*y2 - z1*z2,
            w1*x2 + x1*w2 + y1*z2 - z1*y2,
            w1*y2 - x1*z2 + y1*w2 + z1*x2,
            w1*z2 + x1*y2 - y1*x2 + z1*w2)

    def conjugate(self):
        return Quaternion(self.w, -self.x, -self.y, -self.z)

    def rotate_vector(self, v):
        """Rotate a 3D vector by this quaternion."""
        v_quat = Quaternion(0, v[0], v[1], v[2])
        result = self.multiply(v_quat).multiply(self.conjugate())
        return np.array([result.x, result.y, result.z])

    def to_euler_deg(self):
        """Convert to Euler angles (roll, pitch, yaw) in degrees."""
        w, x, y, z = self.q
        # Roll (x-axis rotation)
        sinr = 2 * (w * x + y * z)
        cosr = 1 - 2 * (x**2 + y**2)
        roll = np.degrees(np.arctan2(sinr, cosr))
        # Pitch (y-axis rotation)
        sinp = 2 * (w * y - z * x)
        sinp = np.clip(sinp, -1, 1)
        pitch = np.degrees(np.arcsin(sinp))
        # Yaw (z-axis rotation)
        siny = 2 * (w * z + x * y)
        cosy = 1 - 2 * (y**2 + z**2)
        yaw = np.degrees(np.arctan2(siny, cosy))
        return roll, pitch, yaw

    def angle_to(self, other):
        """Angle between two orientations in degrees."""
        dot = np.clip(np.dot(self.q, other.q), -1, 1)
        return np.degrees(2 * np.arccos(abs(dot)))

    def __repr__(self):
        return f"Q({self.w:.4f}, {self.x:.4f}, {self.y:.4f}, {self.z:.4f})"

# === Apollo Attitude Control Simulation ===
print("=== Quaternion-Based Attitude Control ===\
")

# Initial orientation: spacecraft pointing toward Moon
current = Quaternion(1, 0, 0, 0)  # identity = reference orientation
target = Quaternion.from_axis_angle([0, 1, 0], 180)  # flip 180 deg for retrograde burn

print(f"Current orientation: {current}")
print(f"Target orientation:  {target}")
print(f"Rotation needed:     {current.angle_to(target):.1f} degrees")

# Simulate rotation manoeuvre with reaction control thrusters
# Small rotation increments (like thruster pulses)
rotation_rate_dps = 2.0  # degrees per second (typical RCS rate)
dt = 1.0  # 1-second time steps

print(f"\
=== Rotation Manoeuvre (pitch 180 deg) ===")
print(f"{'Time (s)':>8} {'Roll':>8} {'Pitch':>8} {'Yaw':>8} {'Error':>8}")
print("-" * 42)

orientation = Quaternion(1, 0, 0, 0)
step_rotation = Quaternion.from_axis_angle([0, 1, 0], rotation_rate_dps * dt)
time_s = 0

while orientation.angle_to(target) > 1.0:
    roll, pitch, yaw = orientation.to_euler_deg()
    error = orientation.angle_to(target)
    if time_s % 10 == 0:
        print(f"{time_s:>7.0f} {roll:>7.1f} {pitch:>7.1f} {yaw:>7.1f} {error:>7.1f}°")
    orientation = step_rotation.multiply(orientation)
    time_s += dt

roll, pitch, yaw = orientation.to_euler_deg()
print(f"{time_s:>7.0f} {roll:>7.1f} {pitch:>7.1f} {yaw:>7.1f} {orientation.angle_to(target):>7.1f}°")
print(f"\
Manoeuvre complete in {time_s:.0f} seconds")

# Demonstrate gimbal lock problem with Euler angles
print("\
=== Gimbal Lock Demonstration ===")
print("Rotating to 90° pitch (gimbal lock zone):")
for pitch_deg in [0, 30, 60, 85, 89, 89.9]:
    q = Quaternion.from_axis_angle([0, 1, 0], pitch_deg)
    # Apply small roll
    small_roll = Quaternion.from_axis_angle([1, 0, 0], 5)
    result = small_roll.multiply(q)
    r, p, y = result.to_euler_deg()
    print(f"  Pitch={pitch_deg:>5.1f}° + 5° roll -> Euler: ({r:>7.1f}, {p:>7.1f}, {y:>7.1f})")

print("\
Near 90° pitch, small roll causes large yaw changes in Euler angles")
print("Quaternions handle this smoothly — no singularity!")`,
      challenge: 'Implement the "barbecue roll" manoeuvre: a slow continuous rotation around the spacecraft\'s long axis (x-axis) at 1 revolution per hour. Track the orientation for 2 hours and show that the quaternion representation stays stable while Euler angles wrap around. This rotation was used on Apollo to distribute solar heating evenly.',
      successHint: 'Quaternions are used in every modern 3D application: video games, robotics, satellite control, virtual reality, and drone navigation. Understanding quaternion rotation is a crucial skill for anyone working with 3D orientation — and you just built a working implementation from scratch.',
    },
    {
      title: 'Communication delays — model 1.3-second signal delay and its effect on control',
      concept: `The Moon is 384,400 km away. Radio signals travel at the speed of light (299,792 km/s), so the one-way signal delay is:

**delay = 384,400 / 299,792 = 1.28 seconds**

Round-trip delay is 2.56 seconds. This means when Mission Control sends a command, they won't see its effect for at least 2.56 seconds. During the lunar descent, the spacecraft drops 2.7 m every second — by the time a controller sees a problem and the correction arrives, the LM has moved almost 7 metres.

This delay fundamentally changes control system design. A controller can't use simple **feedback control** (observe -> correct -> observe -> correct) because the delay makes the loop unstable. Instead, Apollo used **predictive control**: the onboard computer ran its own models and made real-time decisions autonomously, while Mission Control monitored and sent only high-level commands.

📚 *Signal delay is the reason autonomous systems are essential for deep space missions. Mars has a 4-24 minute delay. Jupiter missions: 33-53 minutes. At those delays, real-time control from Earth is impossible — the spacecraft must think for itself.*`,
      analogy: 'Imagine driving a car where the windshield shows what was outside 2.5 seconds ago, and the steering wheel takes 2.5 seconds to respond. At 60 km/h, you are blind to the next 42 metres of road. You would crash immediately trying to steer reactively. Instead, you would need to predict where the road goes and steer based on prediction — that is predictive control.',
      storyConnection: 'During Apollo 13\'s emergency, the 1.3-second delay added terrifying uncertainty. When the crew fired thrusters for a course correction, Mission Control had to wait 2.6 seconds to see if it worked. Every instruction was preceded by careful calculation on the ground, because there was no time for trial and error through a delayed link.',
      checkQuestion: 'A Mars rover receives a "stop" command 14 minutes after it was sent. If the rover is driving at 0.04 m/s toward a cliff, how far does it travel before the stop command arrives?',
      checkAnswer: '0.04 m/s x 14 x 60 = 33.6 metres. And Mission Control won\'t know the rover stopped until another 14 minutes later — 28 minutes total round-trip. This is why Mars rovers have autonomous hazard avoidance: they can\'t wait for Earth to tell them to stop.',
      codeIntro: 'Simulate the effect of communication delay on spacecraft control during lunar descent.',
      code: `import numpy as np

# Communication delay parameters
LIGHT_SPEED = 299_792  # km/s
MOON_DISTANCE = 384_400  # km
ONE_WAY_DELAY = MOON_DISTANCE / LIGHT_SPEED  # seconds
ROUND_TRIP_DELAY = 2 * ONE_WAY_DELAY

print("=== Communication Delay Analysis ===")
print(f"Earth-Moon distance: {MOON_DISTANCE:,} km")
print(f"One-way delay: {ONE_WAY_DELAY:.2f} seconds")
print(f"Round-trip delay: {ROUND_TRIP_DELAY:.2f} seconds\
")

# Simulate descent control with and without delay
g_moon = 1.62  # m/s^2
dt = 0.1       # simulation time step (seconds)
target_descent_rate = -2.0  # m/s (target vertical velocity)

class DescentController:
    """PID-like controller for descent rate."""
    def __init__(self, delay_s=0, kp=0.5, kd=0.1):
        self.delay_s = delay_s
        self.kp = kp
        self.kd = kd
        self.command_buffer = []  # (time_to_execute, throttle)
        self.observation_buffer = []  # (time_sent, state)

    def observe(self, time, altitude, velocity, throttle):
        """Ground controller receives observation after delay."""
        self.observation_buffer.append((time + self.delay_s, altitude, velocity, throttle))

    def compute_command(self, time, altitude, velocity, current_throttle):
        """Compute throttle command based on delayed observations."""
        if self.delay_s == 0:
            # No delay — direct control
            error = velocity - target_descent_rate
            d_error = -g_moon + current_throttle * 45040 / 15200 - g_moon
            throttle = 0.35 + self.kp * error + self.kd * d_error
            return np.clip(throttle, 0.1, 1.0)

        # With delay: use most recent received observation
        received = [obs for obs in self.observation_buffer if obs[0] <= time]
        if not received:
            return 0.35  # default throttle

        latest = received[-1]
        obs_alt, obs_vel, obs_throttle = latest[1], latest[2], latest[3]

        # Predict current state based on delayed observation
        age = time - latest[0] + self.delay_s  # how old is this data
        pred_vel = obs_vel - g_moon * age + obs_throttle * 45040 / 15200 * age
        pred_alt = obs_alt + obs_vel * age

        error = pred_vel - target_descent_rate
        throttle = 0.35 + self.kp * error * 0.5  # conservative with delay
        return np.clip(throttle, 0.1, 1.0)

def simulate_descent(delay_s, duration=60):
    """Simulate 60 seconds of descent with given communication delay."""
    controller = DescentController(delay_s=delay_s)
    alt = 500.0  # starting altitude (m)
    vel = -5.0   # starting descent rate (m/s)
    throttle = 0.35
    mass = 15200.0
    thrust_max = 45040.0

    log = []
    for step in range(int(duration / dt)):
        time = step * dt

        # Controller observes and computes
        controller.observe(time, alt, vel, throttle)
        throttle = controller.compute_command(time, alt, vel, throttle)

        # Physics update
        thrust_accel = throttle * thrust_max / mass
        net_accel = thrust_accel - g_moon
        vel += net_accel * dt
        alt += vel * dt

        # Fuel consumption
        dm = throttle * thrust_max / (311 * 9.81) * dt
        mass -= dm

        if int(time * 10) % 50 == 0:
            log.append((time, alt, vel, throttle))

        if alt <= 0:
            log.append((time, 0, vel, throttle))
            break

    return log

# Run with no delay
print("=== Descent Control: No Delay ===")
log_no_delay = simulate_descent(0)
print(f"{'Time (s)':>8} {'Alt (m)':>10} {'V (m/s)':>10} {'Throttle':>10}")
print("-" * 40)
for t, a, v, th in log_no_delay:
    print(f"{t:>7.1f} {a:>9.1f} {v:>9.2f} {th:>9.2f}")

# Run with 1.28s delay
print("\
=== Descent Control: 1.28s One-Way Delay ===")
log_delayed = simulate_descent(ONE_WAY_DELAY)
print(f"{'Time (s)':>8} {'Alt (m)':>10} {'V (m/s)':>10} {'Throttle':>10}")
print("-" * 40)
for t, a, v, th in log_delayed:
    print(f"{t:>7.1f} {a:>9.1f} {v:>9.2f} {th:>9.2f}")

# Compare landing velocities
v_final_no_delay = log_no_delay[-1][2]
v_final_delayed = log_delayed[-1][2]
print(f"\
=== Comparison ===")
print(f"Landing velocity (no delay):  {v_final_no_delay:.2f} m/s")
print(f"Landing velocity (1.28s delay): {v_final_delayed:.2f} m/s")
print(f"Safe landing threshold: < 3.0 m/s vertical")

# Delay comparison across solar system
print(f"\
=== Communication Delays Across the Solar System ===")
targets = [
    ("Moon", 384_400),
    ("Mars (closest)", 55_700_000),
    ("Mars (farthest)", 401_000_000),
    ("Jupiter", 588_000_000),
    ("Saturn", 1_200_000_000),
]
for name, dist in targets:
    delay = dist / LIGHT_SPEED
    print(f"  {name:<20} {delay:>8.1f}s one-way ({delay/60:>6.1f} min)")`,
      challenge: 'Implement a "prediction buffer" in the delayed controller: instead of reacting to the latest observation, predict the spacecraft state forward by the delay amount and control based on the prediction. How much does this improve landing velocity compared to naive delayed control?',
      successHint: 'Communication delay is a fundamental constraint in all remote control systems: deep space probes, underwater robots, teleoperated surgery, and even online gaming. The solution is always the same pattern: local autonomy with predictive models, and remote supervision for high-level decisions.',
    },
    {
      title: 'Thermal management — model spacecraft temperature in sunlight vs shadow',
      concept: `In space, there is no air to conduct or convect heat. The only heat transfer mechanism is **radiation**: objects absorb energy from the Sun and radiate energy into the cold of space. The equilibrium temperature depends on the balance between these two:

**Absorbed = alpha * S * A_cross / 4**
**Emitted = epsilon * sigma * T^4 * A_surface**

Where alpha is solar absorptivity, S is solar flux (1,361 W/m^2 at Earth's distance), epsilon is thermal emissivity, sigma is the Stefan-Boltzmann constant, and T is temperature.

The Sun-facing side of the Apollo spacecraft could reach 120 degrees C while the shadow side dropped to -150 degrees C. This 270 degree C gradient would warp the hull, stress joints, and damage electronics. The solution: the **Passive Thermal Control (PTC)** manoeuvre, nicknamed the "barbecue roll" — a slow continuous rotation (3 revolutions per hour) to distribute solar heating evenly.

📚 *The Stefan-Boltzmann law says radiated power scales as T^4 — doubling temperature increases radiation by 16x. This strong dependence means radiative equilibrium is self-stabilising: if an object gets too hot, it radiates much more energy and cools down.*`,
      analogy: 'Imagine standing by a campfire. Your front is roasting while your back is freezing. The solution: rotate slowly, like a rotisserie chicken. Each side gets warmed, then radiates into the cold air before overheating. The barbecue roll does exactly this — the spacecraft is the chicken, the Sun is the fire, and space is the cold air.',
      storyConnection: 'Apollo 13\'s loss of power meant the barbecue roll had to be performed manually by the crew, using timed thruster pulses. Without the PTC rotation, one side of the spacecraft would have overheated while the other froze — potentially cracking propellant lines or killing the remaining battery. The thermal model you\'ll build shows why this manoeuvre was critical.',
      checkQuestion: 'A flat plate in space faces the Sun (absorptivity = 0.3, emissivity = 0.8). What equilibrium temperature does it reach? (Solar flux = 1,361 W/m^2, Stefan-Boltzmann constant = 5.67 x 10^-8 W/m^2/K^4)',
      checkAnswer: 'At equilibrium: alpha * S = epsilon * sigma * T^4 (for a flat plate radiating from one side). T = (alpha * S / (epsilon * sigma))^0.25 = (0.3 * 1361 / (0.8 * 5.67e-8))^0.25 = (408.3 / 4.536e-8)^0.25 = (9.002e9)^0.25 = 308 K = 35 degrees C.',
      codeIntro: 'Model the thermal environment of the Apollo spacecraft during transit, including the barbecue roll.',
      code: `import numpy as np

# Physical constants
SIGMA = 5.670e-8     # Stefan-Boltzmann constant (W/m^2/K^4)
SOLAR_FLUX = 1361    # W/m^2 at 1 AU

# Apollo Command Module thermal properties
class SpacecraftThermal:
    def __init__(self):
        self.mass = 5_560        # kg (CM)
        self.specific_heat = 900  # J/kg/K (aluminium average)
        self.area_cross = 12.0   # m^2 (cross-sectional area facing Sun)
        self.area_total = 40.0   # m^2 (total surface area)
        self.absorptivity = 0.25  # solar absorptivity of white paint
        self.emissivity = 0.85    # thermal emissivity
        self.internal_power = 500  # W (electronics waste heat)

    def solar_input(self, sun_angle_deg):
        """Solar power absorbed based on angle to Sun."""
        cos_angle = max(0, np.cos(np.radians(sun_angle_deg)))
        return self.absorptivity * SOLAR_FLUX * self.area_cross * cos_angle

    def radiation_output(self, temperature_k):
        """Power radiated to space from all surfaces."""
        return self.emissivity * SIGMA * temperature_k**4 * self.area_total

    def equilibrium_temp(self, sun_angle_deg):
        """Equilibrium temperature for a given Sun angle."""
        q_in = self.solar_input(sun_angle_deg) + self.internal_power
        # q_in = emissivity * sigma * T^4 * area_total
        t4 = q_in / (self.emissivity * SIGMA * self.area_total)
        return t4**0.25

sc = SpacecraftThermal()

# Equilibrium temperatures at different Sun angles
print("=== Spacecraft Equilibrium Temperature vs Sun Angle ===")
print(f"{'Sun Angle':>10} {'Solar In (W)':>13} {'Equil. Temp':>12} {'Temp (C)':>10}")
print("-" * 47)
for angle in [0, 30, 60, 90, 120, 150, 180]:
    q_solar = sc.solar_input(angle)
    t_eq = sc.equilibrium_temp(angle)
    print(f"{angle:>8}° {q_solar:>11.0f} {t_eq:>10.1f} K {t_eq - 273.15:>9.1f}°C")

# Simulate barbecue roll vs fixed orientation
print("\
=== Thermal Simulation: Fixed vs Barbecue Roll ===")
dt = 60.0  # seconds
duration = 4 * 3600  # 4 hours
thermal_mass = sc.mass * sc.specific_heat  # J/K

# Fixed orientation (Sun-facing)
t_fixed = 280.0  # starting temp (K)
fixed_log = []

# Barbecue roll (3 rev/hour = 0.05 deg/s -> 18 deg/min)
t_bbq = 280.0
bbq_log = []
roll_rate = 360 / 1200  # degrees per second (3 rev/hr)

for step in range(int(duration / dt)):
    time_s = step * dt

    # Fixed: always facing Sun
    q_in_fixed = sc.solar_input(0) + sc.internal_power
    q_out_fixed = sc.radiation_output(t_fixed)
    dt_fixed = (q_in_fixed - q_out_fixed) / thermal_mass * dt
    t_fixed += dt_fixed

    # BBQ roll: Sun angle rotates continuously
    angle = (roll_rate * time_s) % 360
    # Effective angle (0-180, symmetric)
    effective_angle = angle if angle <= 180 else 360 - angle
    q_in_bbq = sc.solar_input(effective_angle) + sc.internal_power
    q_out_bbq = sc.radiation_output(t_bbq)
    dt_bbq = (q_in_bbq - q_out_bbq) / thermal_mass * dt
    t_bbq += dt_bbq

    if int(time_s) % 600 == 0:
        fixed_log.append((time_s / 60, t_fixed - 273.15))
        bbq_log.append((time_s / 60, t_bbq - 273.15))

print(f"{'Time (min)':>10} {'Fixed (C)':>10} {'BBQ Roll (C)':>13} {'Difference':>11}")
print("-" * 46)
for i in range(len(fixed_log)):
    t_min = fixed_log[i][0]
    t_f = fixed_log[i][1]
    t_b = bbq_log[i][1]
    print(f"{t_min:>9.0f} {t_f:>9.1f} {t_b:>12.1f} {abs(t_f - t_b):>10.1f}")

# Shadow passage (entering Moon's shadow)
print("\
=== Lunar Shadow Passage ===")
t_shadow = t_bbq + 273.15  # start from BBQ equilibrium
shadow_log = []
for step in range(int(1800 / dt)):  # 30 minutes in shadow
    time_s = step * dt
    q_in = sc.internal_power  # no solar input in shadow
    q_out = sc.radiation_output(t_shadow)
    t_shadow += (q_in - q_out) / thermal_mass * dt
    if int(time_s) % 300 == 0:
        shadow_log.append((time_s / 60, t_shadow - 273.15))

print(f"{'Time in shadow':>15} {'Temp (C)':>10} {'Cooling rate':>13}")
print("-" * 40)
for i, (t_min, t_c) in enumerate(shadow_log):
    rate = (shadow_log[i][1] - shadow_log[max(0,i-1)][1]) / 5 if i > 0 else 0
    print(f"{t_min:>13.0f} min {t_c:>9.1f} {rate:>10.2f} °C/min")`,
      challenge: 'The Apollo spacecraft had electric heaters (200 W) that could be activated during shadow passages. Add heater activation when temperature drops below 5 degrees C. How much energy (in watt-hours) do the heaters consume during a 30-minute shadow passage? Is the battery capacity sufficient?',
      successHint: 'Thermal management is one of the most critical and least visible aspects of spacecraft design. Every satellite, space station, and deep space probe must solve this same problem: managing the extreme temperature swings between sunlight and shadow. The barbecue roll is an elegantly simple solution to a complex thermal engineering challenge.',
    },
    {
      title: 'Failure mode analysis — FMEA for lunar descent systems',
      concept: `**Failure Mode and Effects Analysis (FMEA)** is a systematic method for identifying everything that can go wrong, assessing the severity and likelihood of each failure, and prioritising which risks to address.

For each potential failure, FMEA assigns three scores (1-10 each):
- **Severity (S)**: how bad is the consequence? (10 = loss of crew)
- **Occurrence (O)**: how likely is it? (10 = almost certain)
- **Detection (D)**: how hard is it to detect before it causes harm? (10 = undetectable)

The **Risk Priority Number (RPN)** = S x O x D. Higher RPN means higher priority for mitigation. The maximum possible RPN is 1000 (catastrophic, certain, undetectable).

FMEA was pioneered by NASA and the US military in the 1960s — specifically for Apollo. It has since been adopted by every major industry: automotive, aerospace, medical devices, nuclear power, and semiconductor manufacturing.

📚 *FMEA is proactive — it identifies failures BEFORE they happen. This is fundamentally different from incident investigation (reactive). The goal is to design failures OUT of the system, not to respond to them after they occur.*`,
      analogy: 'Before a road trip, you might mentally list everything that could go wrong: flat tyre (severity: 2, likelihood: 3), engine failure (severity: 8, likelihood: 1), wrong turn (severity: 1, likelihood: 7). You would carry a spare tyre (mitigates the most likely moderate-severity failure) and have roadside assistance (mitigates the low-likelihood high-severity failure). FMEA does this systematically for every component.',
      storyConnection: 'Apollo 13\'s oxygen tank explosion was a failure mode that FMEA had identified — but the mitigation (redundant tanks) was undermined by a design flaw where both tanks shared a common feed line. The investigation led NASA to require that redundant systems have truly independent failure paths. Every FMEA since Apollo includes "common cause failure" analysis.',
      checkQuestion: 'Two failure modes have the same RPN of 120. Mode A: S=10, O=3, D=4. Mode B: S=4, O=5, D=6. Which should be addressed first?',
      checkAnswer: 'Mode A — because its severity is 10 (catastrophic / loss of crew). Equal RPNs don\'t mean equal risk: a rare catastrophic failure is generally more important to mitigate than a common minor one. Many FMEA standards now prioritise by severity first, then by RPN.',
      codeIntro: 'Perform a systematic FMEA on the Apollo Lunar Module descent systems.',
      code: `import numpy as np

class FailureMode:
    def __init__(self, system, component, failure, effect, severity,
                 occurrence, detection, mitigation="None"):
        self.system = system
        self.component = component
        self.failure = failure
        self.effect = effect
        self.severity = severity      # 1-10
        self.occurrence = occurrence   # 1-10
        self.detection = detection     # 1-10
        self.mitigation = mitigation
        self.rpn = severity * occurrence * detection

    def mitigated_rpn(self, s_reduction=0, o_reduction=0, d_reduction=0):
        new_s = max(1, self.severity - s_reduction)
        new_o = max(1, self.occurrence - o_reduction)
        new_d = max(1, self.detection - d_reduction)
        return new_s * new_o * new_d

# Apollo Lunar Module Descent FMEA
failures = [
    FailureMode("Propulsion", "Descent engine", "Fails to ignite",
                "Cannot deorbit — stuck in lunar orbit",
                10, 2, 3, "Redundant igniter, pre-flight testing"),
    FailureMode("Propulsion", "Descent engine", "Thrust oscillation (pogo)",
                "Structural vibration, potential abort",
                8, 4, 5, "Pogo suppressor, throttle limits"),
    FailureMode("Propulsion", "Fuel valve", "Stuck open",
                "Cannot throttle — excessive descent rate",
                9, 3, 4, "Redundant valve, mechanical override"),
    FailureMode("Propulsion", "Fuel tank", "Leak",
                "Fuel loss, reduced hover time, potential abort",
                9, 2, 6, "Tank pressure monitoring, abort rules"),
    FailureMode("Guidance", "IMU", "Drift exceeds tolerance",
                "Navigation error, landing site miss",
                7, 4, 3, "Star sightings, radar cross-check"),
    FailureMode("Guidance", "Computer", "Program alarm (1202)",
                "Task overflow, guidance interruption",
                8, 5, 2, "Priority scheduling, restart logic"),
    FailureMode("Guidance", "Landing radar", "No lock on surface",
                "No altitude/velocity data below 10 km",
                8, 3, 4, "Backup abort, manual visual descent"),
    FailureMode("Guidance", "Landing radar", "False altitude reading",
                "Incorrect descent rate, hard landing or crash",
                10, 2, 7, "Cross-check with IMU, crew visual"),
    FailureMode("Structure", "Landing gear", "Fails to deploy",
                "Cannot land safely — tip-over risk",
                10, 2, 4, "Redundant release mechanism, EVA backup"),
    FailureMode("Structure", "Landing gear", "Leg collapses on contact",
                "Tip-over on lunar surface",
                10, 1, 8, "Crush struts absorb impact, wide stance"),
    FailureMode("Life Support", "Oxygen system", "Regulator failure",
                "Cabin pressure loss, crew incapacitation",
                10, 2, 3, "Redundant regulators, suit backup O2"),
    FailureMode("Electrical", "Battery", "Thermal runaway",
                "Fire in cabin, power loss",
                10, 1, 5, "Thermal sensors, circuit breakers"),
    FailureMode("Communication", "S-band antenna", "Misalignment",
                "Loss of Earth communication",
                6, 3, 4, "Omni-directional backup antenna"),
    FailureMode("Crew", "Commander", "Spatial disorientation",
                "Incorrect manual inputs during descent",
                8, 3, 5, "Instrument cross-check, LMP monitoring"),
    FailureMode("Crew", "Crew", "Fatigue-induced error",
                "Delayed response, incorrect procedure",
                7, 5, 6, "Checklists, Mission Control monitoring"),
]

# Print FMEA table
print("=" * 80)
print("     FAILURE MODE AND EFFECTS ANALYSIS: LUNAR MODULE DESCENT")
print("=" * 80)
print(f"{'System':<14} {'Component':<16} {'Failure Mode':<28} {'S':>2} {'O':>2} {'D':>2} {'RPN':>4}")
print("-" * 70)

for fm in sorted(failures, key=lambda f: f.rpn, reverse=True):
    print(f"{fm.system:<14} {fm.component:<16} {fm.failure:<28} "
          f"{fm.severity:>2} {fm.occurrence:>2} {fm.detection:>2} {fm.rpn:>4}")

# Risk summary
rpns = [f.rpn for f in failures]
print(f"\
=== Risk Summary ===")
print(f"Total failure modes analysed: {len(failures)}")
print(f"Average RPN: {np.mean(rpns):.0f}")
print(f"Max RPN: {max(rpns)} ({[f.failure for f in failures if f.rpn == max(rpns)][0]})")
print(f"Modes with RPN > 100: {sum(1 for r in rpns if r > 100)}")

# Categorise by risk level
print(f"\
=== Risk Categories ===")
for label, lo, hi in [("CRITICAL (RPN>200)", 200, 1001),
                       ("HIGH (100-200)", 100, 200),
                       ("MEDIUM (50-100)", 50, 100),
                       ("LOW (<50)", 0, 50)]:
    count = sum(1 for r in rpns if lo <= r < hi)
    modes = [f.failure for f in failures if lo <= f.rpn < hi]
    print(f"  {label}: {count} modes")
    for m in modes[:3]:
        print(f"    - {m}")

# Impact of mitigations
print(f"\
=== Mitigation Impact (top 5 risks) ===")
top5 = sorted(failures, key=lambda f: f.rpn, reverse=True)[:5]
for fm in top5:
    mitigated = fm.mitigated_rpn(o_reduction=2, d_reduction=2)
    reduction = (1 - mitigated / fm.rpn) * 100
    print(f"  {fm.failure}: RPN {fm.rpn} -> {mitigated} ({reduction:.0f}% reduction)")
    print(f"    Mitigation: {fm.mitigation}")`,
      challenge: 'Add "common cause failure" analysis: identify which failures could be caused by a single root cause. For example, a power bus failure could cause computer failure AND radar failure AND communication failure simultaneously. Calculate the combined RPN for these correlated failures. This is what made Apollo 13 so dangerous — the explosion affected multiple systems at once.',
      successHint: 'FMEA is used in every safety-critical industry in the world: aerospace, automotive (ISO 26262), medical devices (ISO 14971), nuclear power, and manufacturing. You just performed the same type of analysis that Apollo engineers used to identify and mitigate the risks of landing on the Moon. The systematic approach — enumerate, score, prioritise, mitigate — is applicable to any complex system.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Advanced modelling and systems analysis</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 3 covers three-body dynamics, quaternion attitude control, communication delays, thermal management, and failure mode analysis.
          </p>
          <button onClick={loadPyodide} disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
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
