import { useState, useRef, useCallback } from 'react';
import { Loader2, Compass } from 'lucide-react';
import MiniLesson from '../MiniLesson';

export default function DharmaWheelLevel3() {
  const pyodideRef = useRef<any>(null);
  const [pyReady, setPyReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState('');

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setLoading(true); setLoadProgress('Loading Python...');
    try {
      if (!(window as any).loadPyodide) { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'; document.head.appendChild(s); await new Promise<void>((r, j) => { s.onload = () => r(); s.onerror = () => j(new Error('Failed')); }); }
      setLoadProgress('Starting Python...'); const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      setLoadProgress('Installing packages...'); await py.loadPackage('micropip'); const mp = py.pyimport('micropip');
      for (const p of ['numpy', 'matplotlib']) { try { await mp.install(p); } catch { await py.loadPackage(p).catch(() => {}); } }
      await py.runPythonAsync(`import sys,io\nclass OC:\n def __init__(self):self.o=[]\n def write(self,t):self.o.append(t)\n def flush(self):pass\n def get_output(self):return''.join(self.o)\n def clear(self):self.o=[]\n_stdout_capture=OC();sys.stdout=_stdout_capture;sys.stderr=_stdout_capture\nimport matplotlib;matplotlib.use('AGG');import matplotlib.pyplot as plt;import base64\ndef _get_plot_as_base64():\n buf=io.BytesIO();plt.savefig(buf,format='png',dpi=100,bbox_inches='tight',facecolor='#1f2937',edgecolor='none');buf.seek(0);s=base64.b64encode(buf.read()).decode('utf-8');plt.close('all');return s`);
      pyodideRef.current = py; setPyReady(true); setLoading(false); setLoadProgress(''); return py;
    } catch (e: any) { setLoading(false); setLoadProgress('Error: ' + e.message); return null; }
  }, []);

  const miniLessons = [
    {
      title: 'Gyroscopic navigation — how planes know which way is up',
      concept: `A spinning gyroscope maintains its orientation in space regardless of how the vehicle around it rotates. This makes it an ideal **reference frame** for navigation.

**Mechanical gyroscopes** (used from 1900s–1990s):
1. A heavy disc spins at 20,000+ RPM inside a gimbal mount
2. The gimbals allow the case to rotate freely around the spinning disc
3. The disc maintains its orientation (angular momentum conservation)
4. Sensors measure the angle between the case (which moves with the vehicle) and the disc (which stays fixed)
5. This gives pitch, roll, and yaw — the vehicle’s attitude

**Fibre-optic gyroscopes** (modern):
- No spinning parts. Instead, two laser beams travel in opposite directions around a coil of fibre
- If the coil rotates, one beam travels a slightly longer path than the other (Sagnac effect)
- The path difference causes an interference pattern that reveals the rotation rate
- Extremely precise: can detect Earth’s rotation rate (15°/hour)

**MEMS gyroscopes** (in your phone):
- Tiny vibrating structures (micrometres) on a silicon chip
- Rotation causes Coriolis forces that deflect the vibrating mass
- Less precise but tiny, cheap, and low-power`,
      analogy: 'A gyroscope in a plane is like a compass that points not at magnetic north, but at whatever direction it was pointed when it was started. Imagine gluing a laser pointer to a spinning top and putting it on a turntable. No matter how you rotate the turntable, the laser pointer keeps pointing at the same spot on the wall. The spinning top "remembers" its original direction. That is a gyroscope.',
      storyConnection: 'Buddhist monks navigating trade routes across Asia needed reliable direction. The spinning prayer wheel they carried was, in physics terms, a primitive gyroscope — maintaining its spin axis regardless of the terrain the monk traversed. Modern navigation gyroscopes formalise the same principle with engineering precision.',
      checkQuestion: 'The Hubble Space Telescope uses gyroscopes for pointing accuracy. Why do gyroscopes work especially well in space?',
      checkAnswer: 'In space, there is no air resistance or friction to slow the spinning disc, so the gyroscope maintains its orientation for much longer without needing re-spins. Also, there is no gravity torque to cause precession (in free-fall, gravity acts equally on all parts). The result is an extremely stable reference frame. Hubble’s gyroscopes can detect rotations as small as 0.0003 arcseconds — equivalent to spotting a human hair from 1.6 km away.',
      codeIntro: 'Simulate a 3D gyroscope tracking vehicle rotations in pitch, roll, and yaw.',
      code: `import numpy as np

# Gyroscopic Navigation Simulator
print("Gyroscopic Navigation: Tracking Vehicle Attitude")
print("=" * 60)

class Gyroscope:
    def __init__(self, spin_rpm=20000, I=0.01):
        self.omega = spin_rpm * 2 * np.pi / 60
        self.I = I
        self.L = I * self.omega
        # Orientation (Euler angles in degrees)
        self.pitch = 0.0  # nose up/down
        self.roll = 0.0   # wings tilt
        self.yaw = 0.0    # heading left/right

    def apply_rotation(self, d_pitch, d_roll, d_yaw, dt=0.1):
        """External rotation applied to the vehicle."""
        # Gyroscope resists: precession = tau/L
        # Higher L = less drift
        drift_factor = 0.001 / self.L  # smaller L = more drift
        self.pitch += d_pitch + np.random.normal(0, drift_factor)
        self.roll += d_roll + np.random.normal(0, drift_factor)
        self.yaw += d_yaw + np.random.normal(0, drift_factor)

    def read(self):
        return self.pitch, self.roll, self.yaw

# Simulate a flight
gyro = Gyroscope(spin_rpm=20000)
print(f"Gyro angular momentum: L = {gyro.L:.4f} kg.m^2/s")
print()

# Flight manoeuvres
manoeuvres = [
    ("Takeoff (pitch up 15°)",     15,  0,   0),
    ("Bank right (roll 30°)",       0,  30,   0),
    ("Turn heading (yaw 90°)",      0,   0,  90),
    ("Level out (roll back)",          0, -30,   0),
    ("Descend (pitch down 10°)",  -10,   0,   0),
    ("Land (pitch level)",             -5,   0,   0),
]

print(f"{'Manoeuvre':>30} | {'Pitch':>7} | {'Roll':>7} | {'Yaw':>7}")
print("-" * 60)

for name, dp, dr, dy in manoeuvres:
    gyro.apply_rotation(dp, dr, dy)
    p, r, y = gyro.read()
    print(f"{name:>30} | {p:>6.2f}° | {r:>6.2f}° | {y:>6.2f}°")

print()

# Compare different gyro qualities
print("Drift comparison after 1 hour of flight:")
print("-" * 55)
for rpm, name in [(1000, "Cheap MEMS"), (10000, "Nav-grade"), (50000, "Strategic")]:
    g = Gyroscope(spin_rpm=rpm)
    total_drift = 0
    for _ in range(36000):  # 1 hour at 0.1s steps
        g.apply_rotation(0, 0, 0, dt=0.1)
    p, r, y = g.read()
    drift = np.sqrt(p**2 + r**2 + y**2)
    print(f"  {name:>15} ({rpm:>5} RPM): Total drift = {drift:.4f}°")`,
      challenge: 'Simulate gyro failure: at a random time during flight, reduce L to near zero (gyro stops spinning). How quickly does navigation accuracy degrade? How long until the pilot would notice?',
      successHint: 'Gyroscopic navigation is one of the most important applications of angular momentum conservation. Without it, aircraft, submarines, spacecraft, and missiles could not navigate. Your phone uses a MEMS gyroscope for screen rotation — a $0.50 chip applying the same physics.',
    },
    {
      title: 'Reaction wheels — steering spacecraft without fuel',
      concept: `Satellites cannot use propellers or wings in the vacuum of space. Instead, they use **reaction wheels** — spinning flywheels inside the spacecraft.

The principle: conservation of angular momentum. If the spacecraft + reaction wheel system has zero total angular momentum, spinning the wheel in one direction makes the spacecraft rotate in the other.

**L_wheel + L_spacecraft = constant**

If L_total = 0:
- Spin wheel clockwise → spacecraft rotates counterclockwise
- Speed up wheel → spacecraft rotates faster
- Slow wheel to zero → spacecraft stops rotating

Real satellites have **three reaction wheels** (one for each axis: pitch, roll, yaw). Some have four for redundancy.

Advantages:
- No fuel consumed (electricity from solar panels spins the wheels)
- Extremely precise pointing (arcsecond accuracy)
- Reversible (can rotate back and forth indefinitely)

Problem: **angular momentum buildup**. External torques (solar pressure, Earth’s magnetic field) gradually add angular momentum. The wheels spin faster and faster until they **saturate**. To reset, the satellite uses small thrusters to dump the excess — the only time fuel is used.`,
      analogy: 'Sit on a swivel chair holding a heavy book and spin the book in a circle above your head. You rotate in the opposite direction. Stop the book, and you stop. This is a reaction wheel — the book is the wheel, and you are the spacecraft. The total angular momentum of you + book stays zero.',
      storyConnection: 'The Dharma Wheel teaches balance and response. Reaction wheels embody this: to turn right, spin a wheel left. Every action has an equal and opposite reaction. Newton’s third law expressed through the medium of angular momentum. The spacecraft achieves grace through deliberate, balanced rotation.',
      checkQuestion: 'The Hubble Space Telescope needs to rotate 90° in 15 minutes to observe a new star. Its reaction wheel has I = 2 kg·m² and the telescope has I = 75,000 kg·m². How fast must the wheel spin?',
      checkAnswer: 'ω_telescope = 90° / 15 min = (π/2) / 900 = 0.00175 rad/s. By conservation: I_wheel × ω_wheel = I_telescope × ω_telescope. ω_wheel = 75000 × 0.00175 / 2 = 65.6 rad/s = 627 RPM. That is modest because Hubble rotates so slowly. For faster manoeuvres, the wheel would need to spin at thousands of RPM.',
      codeIntro: 'Simulate satellite attitude control using reaction wheels.',
      code: `import numpy as np

# Reaction Wheel Satellite Attitude Control
print("Satellite Attitude Control via Reaction Wheels")
print("=" * 60)

class Satellite:
    def __init__(self, I_sat=500, I_wheel=2, max_wheel_rpm=6000):
        self.I_sat = I_sat       # satellite moment of inertia
        self.I_wheel = I_wheel   # reaction wheel moment of inertia
        self.max_omega = max_wheel_rpm * 2 * np.pi / 60
        self.omega_wheel = 0     # current wheel speed
        self.angle = 0           # satellite angle (degrees)
        self.omega_sat = 0       # satellite angular velocity

    def command_rotation(self, target_angle, dt=1.0, steps=100):
        """Rotate satellite to target angle using reaction wheel."""
        target_rad = np.radians(target_angle - self.angle)
        # Simple proportional control
        log = []
        for step in range(steps):
            error = target_rad - 0
            if abs(error) < 0.001:
                break
            # Desired satellite angular acceleration
            alpha_sat = np.clip(error * 0.1, -0.01, 0.01)
            # Required wheel acceleration (equal and opposite)
            alpha_wheel = -alpha_sat * self.I_sat / self.I_wheel
            # Update wheel speed
            new_omega = self.omega_wheel + alpha_wheel * dt
            if abs(new_omega) > self.max_omega:
                print(f"  WARNING: Wheel saturated at step {step}!")
                break
            self.omega_wheel = new_omega
            self.omega_sat += alpha_sat * dt
            self.angle += np.degrees(self.omega_sat * dt)
            target_rad -= self.omega_sat * dt
            wheel_rpm = self.omega_wheel * 60 / (2 * np.pi)
            if step % 10 == 0:
                log.append((step, self.angle, wheel_rpm))
        return log

sat = Satellite()
print(f"Satellite: I = {sat.I_sat} kg.m^2")
print(f"Wheel: I = {sat.I_wheel} kg.m^2, max {6000} RPM")
print()

# Rotate to point at a star
target = 45  # degrees
print(f"Command: Rotate {target}° to observe new target")
log = sat.command_rotation(target)
print(f"{'Step':>6} | {'Sat Angle':>10} | {'Wheel RPM':>10}")
print("-" * 32)
for step, ang, rpm in log:
    print(f"{step:>6} | {ang:>9.2f}° | {rpm:>9.1f}")

print(f"\\nFinal: Satellite at {sat.angle:.2f}°, Wheel at {sat.omega_wheel*60/(2*np.pi):.0f} RPM")
print()

# Momentum budget
L_wheel = sat.I_wheel * sat.omega_wheel
L_sat = sat.I_sat * np.radians(sat.omega_sat)
print(f"Angular momentum check:")
print(f"  Wheel: {L_wheel:.4f} kg.m^2/s")
print(f"  Total should be ~0 (conservation)")`,
      challenge: 'Add external torque (solar radiation pressure = 0.0001 N·m) that gradually adds angular momentum. After how many orbits (90 min each) does the wheel saturate at 6000 RPM?',
      successHint: 'Reaction wheels demonstrate angular momentum conservation at the most practical level. Every satellite, space telescope, and space station uses them. The International Space Station has four CMGs (control moment gyroscopes) — massive 300 kg flywheels spinning at 6600 RPM.',
    },
    {
      title: 'Nutation and precession — Earth as a giant gyroscope',
      concept: `Earth itself is a spinning gyroscope, and it shows all the gyroscopic effects:

**Precession**: Earth’s axis traces a cone in space with a period of **25,772 years** (the "Great Year"). This is caused by the Sun’s and Moon’s gravitational torque on Earth’s equatorial bulge. In 13,000 years, the North Star will be Vega, not Polaris.

**Nutation**: A smaller wobble superimposed on precession, with a period of **18.6 years**, caused by the Moon’s orbital plane precessing relative to the ecliptic.

**Chandler wobble**: The spin axis itself wobbles by about 9 metres at the pole, with a period of 433 days. Caused by mass redistributions (earthquakes, ocean currents, atmospheric pressure changes).

The physics is identical to a spinning top:
- Earth’s angular momentum: L = Iω = (8.04×10³⁷ kg·m²)(7.27×10⁻⁵ rad/s) = 5.86×10³³ kg·m²/s
- Gravitational torque from Sun: τ ≈ 4.4×10²² N·m
- Precession rate: Ω = τ/L ≈ 7.7×10⁻¹² rad/s = one revolution per 25,772 years`,
      analogy: 'Earth is a top that was spun 4.5 billion years ago and has been wobbling ever since. It is running down incredibly slowly (losing about 2.3 milliseconds per century due to tidal friction). The Sun and Moon are constantly poking it sideways (gravitational torque), causing the slow precession that shifts the pole star over millennia.',
      storyConnection: 'The Wheel of Dharma turns on timescales far longer than a human life. Earth’s precession operates on a similar timescale — 25,772 years per cycle. The idea that a wheel can keep turning for thousands of years is not metaphor; it is what our planet does every day.',
      checkQuestion: 'If Earth’s rotation period decreased to 12 hours (twice as fast), what would happen to the precession period?',
      checkAnswer: 'L would double (L = Iω, and ω doubles). The precession rate Ω = τ/L would halve. So precession period would double to ~51,544 years. Faster spin = more angular momentum = more resistance to torque = slower precession. This is exactly the same physics as a spinning top that precesses more slowly when spun harder.',
      codeIntro: 'Model Earth’s precession, nutation, and Chandler wobble as gyroscopic phenomena.',
      code: `import numpy as np

# Earth as a Gyroscope
print("Earth's Gyroscopic Motion")
print("=" * 55)

# Earth's parameters
I_earth = 8.04e37       # kg.m^2
omega_earth = 7.27e-5   # rad/s (one rotation per day)
L_earth = I_earth * omega_earth

# Gravitational torque from Sun + Moon on equatorial bulge
tau_total = 4.4e22       # N.m (approximate)

# Precession rate
Omega_prec = tau_total / L_earth
T_prec = 2 * np.pi / Omega_prec  # seconds
T_prec_years = T_prec / (365.25 * 24 * 3600)

print(f"Earth's angular momentum: L = {L_earth:.2e} kg.m^2/s")
print(f"Gravitational torque:     tau = {tau_total:.2e} N.m")
print(f"Precession rate:          {Omega_prec:.2e} rad/s")
print(f"Precession period:        {T_prec_years:.0f} years")
print()

# Pole star through the ages
print("Where the North Pole Points Over Time:")
print("-" * 50)
pole_stars = [
    (0,     "Polaris (current)", 0.7),
    (3000,  "Gamma Cephei", 3),
    (7500,  "Alpha Cephei (Alderamin)", 7),
    (12000, "Vega", 13),
    (15000, "Near Vega", 24),
    (22000, "Thuban (ancient Egyptian)", 26),
    (25772, "Polaris (full cycle)", 0.7),
]

for year, star, distance in pole_stars:
    angle = 360 * year / T_prec_years
    print(f"  AD {year:>6}: {star:>30} ({distance}° from pole)")

print()

# Nutation
print("Nutation (Moon's influence):")
T_nutation = 18.6  # years
amp_nutation = 9.2  # arcseconds
print(f"  Period: {T_nutation} years")
print(f"  Amplitude: {amp_nutation} arcseconds")
print(f"  Cause: Moon's orbital plane precesses with this period")
print()

# What if Earth spun faster/slower?
print("Earth precession at different spin rates:")
print("-" * 50)
for factor in [0.25, 0.5, 1.0, 2.0, 4.0]:
    L_new = L_earth * factor
    T_new = 2 * np.pi / (tau_total / L_new)
    T_new_years = T_new / (365.25 * 24 * 3600)
    print(f"  {factor:.2f}x spin: precession = {T_new_years:,.0f} years")`,
      challenge: 'Mars has I = 2.5×10³⁶, rotates in 24.6 hours, and has negligible gravitational torque (no large moon). Calculate its precession period. Why is Mars’s axis more stable than Earth’s in some ways but less in others?',
      successHint: 'Earth’s precession is gyroscopic physics on a planetary scale. The same L = Iω and Ω = τ/L that govern a toy top govern the planet’s axis. Every ancient calendar that tracked the "Great Year" was observing angular momentum conservation.',
    },
    {
      title: 'Rotational dynamics simulation — numerical integration',
      concept: `Real rotational systems rarely have constant torque or simple geometry. To solve them, we use **numerical integration** — breaking time into tiny steps and updating the state at each step.

The Euler method for rotation:
1. Calculate net torque: τ_net = τ_applied - τ_friction
2. Calculate angular acceleration: α = τ_net / I
3. Update angular velocity: ω(t + dt) = ω(t) + α × dt
4. Update angle: θ(t + dt) = θ(t) + ω × dt
5. Repeat

This is the same approach used in real engineering simulators. The key is choosing dt small enough for accuracy but large enough for speed.

For coupled systems (two wheels connected by gears or belts), you solve the equations simultaneously:
- τ₁ = I₁α₁ + coupling forces
- τ₂ = I₂α₂ + coupling forces
- Constraint: ω₁r₁ = ω₂r₂ (meshing gears)`,
      analogy: 'Numerical integration is like navigating by dead reckoning. At each moment, you know your current speed and direction. You take a tiny step in that direction, then recalculate. If your steps are small enough, you trace the true path with high accuracy. If your steps are too large, you overshoot corners and drift off course.',
      storyConnection: 'The gradual turning of the Dharma Wheel — moment by moment, teaching by teaching — is a step-by-step process. Numerical integration models this: at each time step, the current state determines the next. No shortcuts, no jumps — just faithful, incremental progress.',
      checkQuestion: 'You simulate a spinning disc with dt = 0.1 s and get the wrong answer. When you reduce dt to 0.01 s, the answer improves. What happens at dt = 0.001 s?',
      checkAnswer: 'The answer improves further, getting closer to the true (analytical) solution. But computation time increases 10× for each 10× reduction in dt. The art of numerical simulation is finding the smallest dt that gives acceptable accuracy within acceptable compute time. Advanced methods (Runge-Kutta) achieve better accuracy with larger dt by using smarter stepping algorithms.',
      codeIntro: 'Build a numerical simulator for a wheel spinning down under friction.',
      code: `import numpy as np

# Numerical Rotational Dynamics Simulator
print("Numerical Integration: Spinning Wheel with Friction")
print("=" * 55)

class RotatingWheel:
    def __init__(self, I, omega_0, friction_coeff=0.05):
        self.I = I
        self.omega = omega_0
        self.theta = 0
        self.friction = friction_coeff
        self.time = 0

    def step(self, tau_applied, dt):
        """One Euler integration step."""
        # Friction torque (opposes motion)
        tau_friction = -self.friction * self.omega
        # Net torque
        tau_net = tau_applied + tau_friction
        # Angular acceleration
        alpha = tau_net / self.I
        # Update state
        self.omega += alpha * dt
        self.theta += self.omega * dt
        self.time += dt
        return self.omega, self.theta

# Create a wheel
wheel = RotatingWheel(I=0.5, omega_0=100, friction_coeff=0.1)

print(f"Wheel: I={wheel.I} kg.m^2, omega_0={100} rad/s")
print(f"Friction coefficient: {wheel.friction}")
print(f"No applied torque — coasting to a stop")
print()

dt = 0.1
print(f"{'Time (s)':>8} | {'omega (rad/s)':>14} | {'RPM':>8} | {'Revs':>8} | {'KE (J)':>8}")
print("-" * 55)

t_stop = None
while wheel.omega > 0.1:
    omega, theta = wheel.step(tau_applied=0, dt=dt)
    if int(wheel.time * 10) % 50 == 0:  # print every 5 seconds
        rpm = omega * 60 / (2 * np.pi)
        revs = theta / (2 * np.pi)
        KE = 0.5 * wheel.I * omega**2
        print(f"{wheel.time:>8.1f} | {omega:>14.2f} | {rpm:>8.1f} | {revs:>8.1f} | {KE:>8.1f}")
    if omega <= 0.1 and t_stop is None:
        t_stop = wheel.time

print()
print(f"Wheel stops at t = {t_stop:.1f} s")
print(f"Total revolutions: {wheel.theta / (2*np.pi):.1f}")
print(f"Energy dissipated by friction: {0.5 * 0.5 * 100**2:.0f} J")
print()
print("Exponential decay: friction proportional to speed gives")
print("omega(t) = omega_0 * exp(-friction*t/I)")
print(f"Theory: time constant = I/friction = {0.5/0.1:.1f} s")`,
      challenge: 'Add an applied torque pulse (10 N·m for the first 5 seconds, then 0). The wheel should spin up, then coast down. Plot omega vs time. How does the friction coefficient affect the peak speed?',
      successHint: 'Numerical integration is the tool that makes all of engineering possible. Every car crash simulation, every satellite orbit prediction, every weather forecast uses the same approach: break time into steps, calculate the physics at each step, update, repeat.',
    },
    {
      title: 'Coupled rotational systems — drivetrain simulation',
      concept: `Real machines have multiple rotating components connected together: engine → clutch → gearbox → driveshaft → differential → wheels.

Each component has its own moment of inertia. They are connected by **constraints**:
- Gears: ω₁N₁ = ω₂N₂ (N = number of teeth)
- Belts: ω₁r₁ = ω₂r₂ (r = pulley radius)
- Clutch: when engaged, ω₁ = ω₂; when slipping, a friction torque is transmitted

The total system equation:
**τ_engine - τ_friction - τ_road = I_total × α**

Where I_total is the **equivalent** moment of inertia, accounting for gear ratios:
I_total = I_engine + I_gearbox + I_shaft + (I_wheel + m_car × r_wheel²) / (gear_ratio²)

The gear ratio² term is crucial: it means high gear reduces the effective inertia of the car as seen by the engine (easier to accelerate at the engine), but reduces the engine torque at the wheels.`,
      analogy: 'A drivetrain is like a relay team passing a baton. The engine is the first runner (fast, powerful start). The gearbox is the hand-off zone (adapting speed for the next leg). The driveshaft is the middle runner (steady transmission). The wheels are the final runner (delivering power to the ground). If any runner drops the baton (clutch slip, gear failure), the whole chain stalls.',
      storyConnection: 'The Dharma Wheel’s teaching was transmitted through a "drivetrain" of sorts: the Buddha (engine) → the sangha of monks (gearbox, adapting the teaching for different audiences) → written sutras (driveshaft, long-distance transmission) → monasteries and schools (wheels, delivering to students). Each stage has its own "moment of inertia" and its own coupling mechanism.',
      checkQuestion: 'A car in 1st gear (ratio 4:1) can accelerate faster from a stop than in 3rd gear (ratio 1.5:1), even though 3rd gear has a higher top speed. Why?',
      checkAnswer: 'In 1st gear, the engine torque is multiplied by 4 at the wheels. The effective inertia seen by the engine is reduced by 4² = 16. Both effects help: more torque pushing the car forward, and the car "feels" 16x lighter to the engine. In 3rd gear, torque multiplier is only 1.5 and effective inertia reduction is only 2.25. So the engine struggles more to accelerate the same car, even though higher ω at the wheels gives higher top speed.',
      codeIntro: 'Simulate a complete car drivetrain: engine, gearbox, driveshaft, and wheels.',
      code: `import numpy as np

# Drivetrain Simulator
print("Car Drivetrain Simulation: 0-100 km/h")
print("=" * 55)

class Drivetrain:
    def __init__(self):
        # Engine
        self.I_engine = 0.3       # kg.m^2
        self.torque_max = 300     # N.m peak
        self.rpm_peak = 4500      # RPM at peak torque
        self.rpm_max = 7000

        # Gearbox ratios
        self.gears = [3.5, 2.1, 1.4, 1.0, 0.8]  # 5-speed
        self.current_gear = 0
        self.shift_rpm = 6000

        # Vehicle
        self.m_car = 1500         # kg
        self.r_wheel = 0.32       # m
        self.I_wheel = 1.5        # kg.m^2 (per wheel, x4)
        self.Cd = 0.3             # drag coefficient
        self.A = 2.2              # frontal area (m^2)
        self.rho_air = 1.225      # air density

        # State
        self.v = 0                # vehicle speed (m/s)
        self.rpm = 1000

    def engine_torque(self, rpm):
        """Simplified torque curve."""
        if rpm < 1000: return 100
        if rpm > self.rpm_max: return 0
        return self.torque_max * np.exp(-0.5*((rpm-self.rpm_peak)/2000)**2)

    def step(self, dt=0.01):
        ratio = self.gears[self.current_gear]

        # Engine torque at current RPM
        tau_engine = self.engine_torque(self.rpm)

        # Torque at wheels
        tau_wheel = tau_engine * ratio * 0.9  # 90% efficiency

        # Resistive forces
        F_roll = 0.015 * self.m_car * 9.81
        F_aero = 0.5 * self.rho_air * self.Cd * self.A * self.v**2
        F_resist = F_roll + F_aero

        # Net force and acceleration
        F_net = tau_wheel / self.r_wheel - F_resist
        a = F_net / self.m_car

        # Update
        self.v += a * dt
        self.v = max(0, self.v)

        # Update RPM
        omega_wheel = self.v / self.r_wheel
        self.rpm = omega_wheel * ratio * 60 / (2 * np.pi)

        # Auto-shift
        if self.rpm > self.shift_rpm and self.current_gear < len(self.gears) - 1:
            self.current_gear += 1
            self.rpm = omega_wheel * self.gears[self.current_gear] * 60 / (2*np.pi)

        return self.v, self.rpm, self.current_gear + 1

car = Drivetrain()
dt = 0.01
time = 0
target_kmh = 100
target_ms = target_kmh / 3.6

print(f"{'Time':>6} | {'Speed':>10} | {'RPM':>6} | {'Gear':>4}")
print("-" * 34)

last_print = -1
while car.v < target_ms and time < 30:
    v, rpm, gear = car.step(dt)
    time += dt
    kmh = v * 3.6
    t_int = int(time)
    if t_int > last_print:
        last_print = t_int
        print(f"{time:>5.1f}s | {kmh:>8.1f} km/h | {rpm:>6.0f} | {gear:>4}")

print(f"\\n0-100 km/h: {time:.2f} seconds")`,
      challenge: 'Add a manual gear shift mode where you control when to shift (shift_rpm = 5000 vs 6500 vs redline). What shift point gives the fastest 0-100 time? Why?',
      successHint: 'Drivetrain simulation brings together everything in rotational physics: torque, angular momentum, moment of inertia, gear ratios, friction, and energy transfer. Real automotive engineers use this exact approach, with more detailed models, to design transmissions.',
    },
    {
      title: 'Flywheel battery design project',
      concept: `You now have all the physics to design a **flywheel battery** — a device that stores electricity as rotational kinetic energy.

Design requirements:
1. Store at least 1 kWh (3.6 MJ) of energy
2. Deliver 10 kW of power for at least 6 minutes
3. Fit in a volume under 1 m³
4. Survive at least 100,000 charge/discharge cycles
5. Maximum rotor speed limited by material tensile strength

Design variables:
- **Material**: steel, titanium, or carbon fibre (strength vs cost)
- **Rotor geometry**: solid disc vs hollow cylinder vs rim-weighted
- **Size**: radius and thickness
- **Operating speed range**: max RPM to min RPM (typically 2:1 ratio, since KE drops to 25% at half speed)
- **Bearings**: mechanical (friction loss ~1%/hour) vs magnetic (loss ~0.1%/hour)
- **Motor/generator efficiency**: typically 90-95%

The optimisation challenge: maximise energy density (kWh/kg) while keeping stress below material limits and cost within budget.`,
      analogy: 'Designing a flywheel battery is like designing a water tower. You need to store enough water (energy) at sufficient height (speed) to supply a town (load) for a specified time. You choose the tank material (steel vs concrete vs fibreglass), the height (operating speed), and the pipe diameter (power delivery rate). Every choice involves tradeoffs.',
      storyConnection: 'This capstone project brings the Wheel of Dharma full circle. You take the physics of the wheel — friction, torque, angular momentum, energy storage — and apply it to a real engineering problem. The result is a device that stores energy in spinning mass, releases it on demand, and can cycle for decades. The wheel, once set in motion, keeps turning.',
      checkQuestion: 'A flywheel operates between 60,000 and 30,000 RPM. What fraction of its maximum energy is usable?',
      checkAnswer: 'KE ∝ ω². At max: KE_max ∝ 60000². At min: KE_min ∝ 30000² = (60000/2)² = KE_max/4. Usable energy = KE_max - KE_min = KE_max - KE_max/4 = 75% of KE_max. By halving the speed, you extract 75% of the energy. This is why flywheels typically operate over a 2:1 speed range.',
      codeIntro: 'Design and optimise a flywheel battery to meet the specified requirements.',
      code: `import numpy as np

# Flywheel Battery Design Tool
print("FLYWHEEL BATTERY DESIGN PROJECT")
print("=" * 60)
print("Target: 1 kWh, 10 kW, < 1 m^3, 100k cycles")
print()

def design_flywheel(material, r_outer, r_inner, thickness, speed_ratio=2):
    """Evaluate a flywheel design."""
    materials = {
        'steel':        {'rho': 7800, 'sigma': 500e6,  'cost': 2},
        'titanium':     {'rho': 4500, 'sigma': 900e6,  'cost': 25},
        'carbon_fibre': {'rho': 1600, 'sigma': 2000e6, 'cost': 50},
    }
    mat = materials[material]
    rho, sigma, cost_per_kg = mat['rho'], mat['sigma'], mat['cost']

    # Mass (hollow cylinder)
    volume = np.pi * (r_outer**2 - r_inner**2) * thickness
    mass = rho * volume

    # Moment of inertia (hollow cylinder)
    I = 0.5 * mass * (r_outer**2 + r_inner**2)

    # Maximum angular velocity (stress limit)
    omega_max = np.sqrt(sigma / (rho * r_outer**2))
    rpm_max = omega_max * 60 / (2 * np.pi)
    omega_min = omega_max / speed_ratio

    # Energy
    KE_max = 0.5 * I * omega_max**2
    KE_min = 0.5 * I * omega_min**2
    usable = KE_max - KE_min
    usable_kWh = usable / 3.6e6

    # Rim speed
    v_rim = omega_max * r_outer

    return {
        'mass': mass, 'I': I, 'rpm_max': rpm_max,
        'KE_max_kWh': KE_max/3.6e6, 'usable_kWh': usable_kWh,
        'v_rim': v_rim, 'volume': volume, 'cost': mass * cost_per_kg,
        'energy_density': usable_kWh * 1000 / mass,  # Wh/kg
    }

# Try different designs
designs = [
    ('steel',        0.5,  0.3, 0.15),
    ('steel',        0.4,  0.25, 0.25),
    ('titanium',     0.4,  0.25, 0.15),
    ('carbon_fibre', 0.3,  0.2,  0.1),
    ('carbon_fibre', 0.35, 0.25, 0.08),
]

print(f"{'Material':>14} | {'Mass':>6} | {'RPM max':>8} | {'Usable kWh':>11} | {'Wh/kg':>6} | {'Cost':>7}")
print("-" * 65)

for mat, ro, ri, t in designs:
    d = design_flywheel(mat, ro, ri, t)
    print(f"{mat:>14} | {d['mass']:>5.1f} | {d['rpm_max']:>8.0f} | {d['usable_kWh']:>11.3f} | {d['energy_density']:>5.1f} | \${d['cost']:>6.0f}")

print()

# Best design analysis
best = design_flywheel('carbon_fibre', 0.35, 0.25, 0.08)
print("Best design (carbon fibre, r=0.35m):")
print(f"  Usable energy: {best['usable_kWh']:.3f} kWh")
print(f"  Runtime at 10 kW: {best['usable_kWh'] * 60 / 10:.1f} min")
print(f"  Mass: {best['mass']:.1f} kg")
print(f"  Rim speed: {best['v_rim']:.0f} m/s ({best['v_rim']/343*100:.0f}% of sound)")
print(f"  Meets 1 kWh target? {'YES' if best['usable_kWh'] >= 1 else 'NO - need bigger'}")`,
      challenge: 'Optimise the design to minimise cost while meeting ALL requirements. Try a grid search over material, radius (0.2-0.5 m), and thickness (0.05-0.3 m). Which design wins?',
      successHint: 'You have designed a real flywheel battery using the physics of the Dharma Wheel. In Level 4, you will build the complete control system: motor drive, power electronics, safety monitoring, and integration with a renewable energy source.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Compass className="w-4 h-4" /> Level 3: Engineer
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Gyroscopic navigation, reaction wheels, Earth’s precession, and flywheel design</span>
      </div>
      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">These exercises use Python for engineering simulations. Click to start.</p>
          <button onClick={loadPyodide} disabled={loading} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />{loadProgress}</>) : (<><Compass className="w-5 h-5" />Load Python</>)}
          </button>
        </div>
      )}
      <div className="space-y-8">
        {miniLessons.map((lesson, i) => (
          <MiniLesson key={i} id={`L3-${i + 1}`} number={i + 1}
            title={lesson.title} concept={lesson.concept} analogy={lesson.analogy}
            storyConnection={lesson.storyConnection} checkQuestion={lesson.checkQuestion}
            checkAnswer={lesson.checkAnswer} codeIntro={lesson.codeIntro}
            code={lesson.code} challenge={lesson.challenge} successHint={lesson.successHint}
            pyodideRef={pyodideRef} onLoadPyodide={loadPyodide} pyReady={pyReady} />
        ))}
      </div>
    </div>
  );
}
