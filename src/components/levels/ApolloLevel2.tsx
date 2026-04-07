import { Loader2, Sparkles } from 'lucide-react';
import MiniLesson from '../MiniLesson';
import { usePyodide } from '../../contexts/PyodideContext';

export default function ApolloLevel2() {
  const { load: loadPyodide, ready: pyReady, state: pyState, loadProgress } = usePyodide();
  const loading = pyState === 'loading';

  const miniLessons = [
    {
      title: 'Vis-viva equation — calculate velocity at any point in an elliptical orbit',
      concept: `The **vis-viva equation** is the master equation of orbital mechanics:

**v = sqrt( GM (2/r - 1/a) )**

Where v is the orbital velocity, G is the gravitational constant, M is the central body's mass, r is the current distance from the centre, and a is the semi-major axis of the ellipse.

This single equation tells you the speed of a spacecraft at ANY point in its orbit — perigee (closest approach), apogee (farthest point), or anywhere in between. At perigee, r is small, so 2/r is large, so v is high — the spacecraft is moving fast. At apogee, r is large, so v is low — the spacecraft slows down.

For Apollo, this equation governed the trans-lunar injection (TLI) burn: the spacecraft needed exactly the right velocity to enter an elliptical transfer orbit that would reach the Moon 384,400 km away.

📚 *The vis-viva equation is a direct consequence of energy conservation: kinetic energy + potential energy = constant along any orbit. It works for circles, ellipses, parabolas, and hyperbolas.*`,
      analogy: 'Imagine rolling a ball up a hill. At the bottom it moves fast (high kinetic energy). As it climbs, it slows down — trading kinetic energy for gravitational potential energy. A spacecraft in an elliptical orbit does exactly the same thing: fast at perigee (bottom of the "hill"), slow at apogee (top of the "hill"). The vis-viva equation is the bookkeeping for this energy exchange.',
      storyConnection: 'Apollo\'s trans-lunar injection burn accelerated the spacecraft from 7.8 km/s (circular low Earth orbit) to 10.8 km/s — a delta-v of 3.0 km/s. The vis-viva equation told mission planners exactly what speed was needed: too slow and the spacecraft would never reach the Moon, too fast and it would fly past without being captured.',
      checkQuestion: 'A spacecraft orbits Earth (GM = 3.986 x 10^14 m^3/s^2) in a circular orbit at r = 6,571 km. What is its velocity?',
      checkAnswer: 'For a circular orbit, a = r, so v = sqrt(GM/r) = sqrt(3.986e14 / 6,571,000) = sqrt(6.066e7) = 7,789 m/s = 7.79 km/s. This is orbital velocity in low Earth orbit — the starting speed for any Moon mission.',
      codeIntro: 'Use the vis-viva equation to calculate spacecraft velocity at every point along the Apollo transfer orbit.',
      code: `import numpy as np

# Constants
G = 6.674e-11       # gravitational constant (m^3 kg^-1 s^-2)
M_earth = 5.972e24  # Earth mass (kg)
GM = G * M_earth     # standard gravitational parameter

R_earth = 6_371_000  # Earth radius (m)
R_leo = R_earth + 200_000  # low Earth orbit altitude 200 km
R_moon = 384_400_000        # average Earth-Moon distance (m)

# Vis-viva equation
def vis_viva(r, a, gm=GM):
    """Velocity at distance r in an orbit with semi-major axis a."""
    return np.sqrt(gm * (2.0 / r - 1.0 / a))

# 1. Circular LEO
v_leo = vis_viva(R_leo, R_leo)
print("=== Apollo Orbital Velocities ===")
print(f"Circular LEO (200 km): {v_leo:.0f} m/s ({v_leo/1000:.2f} km/s)")

# 2. Transfer orbit to the Moon
a_transfer = (R_leo + R_moon) / 2  # semi-major axis of transfer ellipse
v_tli = vis_viva(R_leo, a_transfer)  # velocity at perigee after TLI burn
delta_v_tli = v_tli - v_leo
print(f"\\\nTransfer orbit semi-major axis: {a_transfer/1000:.0f} km")
print(f"TLI velocity (at perigee): {v_tli:.0f} m/s ({v_tli/1000:.2f} km/s)")
print(f"Delta-v for TLI: {delta_v_tli:.0f} m/s ({delta_v_tli/1000:.2f} km/s)")

# 3. Velocity at arrival near Moon
v_arrival = vis_viva(R_moon, a_transfer)
print(f"Arrival velocity near Moon: {v_arrival:.0f} m/s ({v_arrival/1000:.3f} km/s)")

# 4. Velocity profile along the transfer orbit
print("\\\n=== Velocity Profile Along Transfer Orbit ===")
print(f"{'Distance (km)':>14} {'Altitude (km)':>14} {'Velocity (m/s)':>15} {'Velocity (km/s)':>16}")
print("-" * 61)

distances = np.linspace(R_leo, R_moon, 20)
for r in distances:
    v = vis_viva(r, a_transfer)
    alt = (r - R_earth) / 1000
    print(f"{r/1000:>13,.0f} {alt:>13,.0f} {v:>14,.0f} {v/1000:>15.3f}")

# 5. Energy analysis
print("\\\n=== Energy Budget ===")
KE_leo = 0.5 * v_leo**2
KE_tli = 0.5 * v_tli**2
KE_arrival = 0.5 * v_arrival**2
PE_leo = -GM / R_leo
PE_moon = -GM / R_moon
print(f"Specific KE in LEO:       {KE_leo/1e6:>10.2f} MJ/kg")
print(f"Specific KE after TLI:    {KE_tli/1e6:>10.2f} MJ/kg")
print(f"Specific KE at Moon:      {KE_arrival/1e6:>10.2f} MJ/kg")
print(f"Specific PE in LEO:       {PE_leo/1e6:>10.2f} MJ/kg")
print(f"Specific PE at Moon:      {PE_moon/1e6:>10.2f} MJ/kg")
print(f"Total specific energy:    {(KE_tli + PE_leo)/1e6:>10.2f} MJ/kg (constant)")`,
      challenge: 'Calculate the velocity needed for a free-return trajectory — an orbit where the spacecraft swings around the Moon and returns to Earth without any further burns. Apollo 13 used this after the oxygen tank explosion. What semi-major axis gives a free-return orbit?',
      successHint: 'The vis-viva equation is the single most important equation in orbital mechanics. With it, you can calculate the velocity at any point in any orbit around any body. Every space mission — from Sputnik to the James Webb Space Telescope — is planned using this equation.',
    },
    {
      title: 'Staging optimisation — multi-stage rocket design for minimum total mass',
      concept: `The **Tsiolkovsky rocket equation** relates velocity change (delta-v) to the mass ratio:

**delta_v = v_e * ln(m_initial / m_final)**

Where v_e is the exhaust velocity, m_initial is the mass including fuel, and m_final is the mass after fuel is burned (dry mass + payload).

A single-stage rocket carrying enough fuel for the Moon mission would be impossibly heavy — the fuel needed to accelerate the fuel needed to accelerate the fuel creates a **tyranny of the rocket equation**. The solution: **staging**. Each stage carries fuel only for its portion of the mission, then is discarded — reducing the mass the next stage must accelerate.

The Saturn V had three stages: S-IC (first stage, kerosene/LOX), S-II (second stage, hydrogen/LOX), and S-IVB (third stage, hydrogen/LOX). Each was optimised for its flight regime.

📚 *The natural logarithm (ln) in the rocket equation means mass grows EXPONENTIALLY with delta-v. Doubling delta-v doesn't double the fuel — it SQUARES the mass ratio. This is why staging is essential.*`,
      analogy: 'Imagine carrying water bottles on a hike. If you carry 10 bottles from the start, you waste energy lifting bottles you won\'t drink until later. Better approach: leave bottles at supply stations and pick them up as you pass. Staging is the same idea — carry only the fuel you need for the current phase, then drop the empty tank.',
      storyConnection: 'The Saturn V launched with a mass of 2,970,000 kg. Only 5,560 kg — the Command Module — returned to Earth. That is a mass ratio of 534:1. Without staging, the required mass ratio would be e^(delta_v / v_e) = e^(9.8/3.0) = e^3.27 = 26.3 — but that is per stage. Stacking three stages multiplied the effective ratio, making the Moon mission possible.',
      checkQuestion: 'A rocket needs delta-v = 9,400 m/s with exhaust velocity v_e = 3,000 m/s. What is the required mass ratio for a single stage?',
      checkAnswer: 'mass_ratio = e^(delta_v / v_e) = e^(9400/3000) = e^3.133 = 22.9. For every kg of payload, you need 22.9 kg at launch — 21.9 kg of which is fuel and tank. This is why single-stage-to-orbit is so difficult.',
      codeIntro: 'Optimise a multi-stage rocket design for the Apollo mission profile.',
      code: `import numpy as np

def rocket_equation(delta_v, v_exhaust, structural_fraction=0.1):
    """
    Tsiolkovsky rocket equation.
    Returns mass ratio (m_initial / m_payload) for one stage.
    structural_fraction: fraction of propellant mass that is tank/engines.
    """
    mass_ratio = np.exp(delta_v / v_exhaust)
    # Account for structural mass (tanks, engines)
    # m_initial = m_payload * mass_ratio
    # m_structural = structural_fraction * (m_initial - m_payload)
    # Effective ratio including structure:
    effective_ratio = mass_ratio / (1 - structural_fraction * (1 - 1/mass_ratio))
    return mass_ratio, effective_ratio

# Apollo mission delta-v budget
burns = [
    ("LEO insertion",        9_400, 2_800),  # S-IC + S-II, kerosene/hydrolox avg
    ("Trans-lunar injection", 3_100, 4_400),  # S-IVB, hydrolox
    ("Lunar orbit insertion",   900, 3_050),  # Service Module
    ("Lunar descent",         2_100, 3_050),  # Lunar Module descent
    ("Lunar ascent",          1_900, 3_050),  # Lunar Module ascent
    ("Trans-Earth injection",   900, 3_050),  # Service Module
]

print("=== Apollo Mission Delta-V Budget ===")
print(f"{'Burn':<26} {'Delta-v (m/s)':>14} {'v_e (m/s)':>10} {'Mass Ratio':>12} {'Eff. Ratio':>12}")
print("-" * 76)

total_dv = 0
cumulative_ratio = 1.0
for name, dv, ve in burns:
    mr, er = rocket_equation(dv, ve)
    total_dv += dv
    cumulative_ratio *= er
    print(f"{name:<26} {dv:>12,} {ve:>10,} {mr:>10.2f}x {er:>10.2f}x")

print(f"\\\nTotal delta-v: {total_dv:,} m/s")
print(f"Cumulative mass ratio: {cumulative_ratio:,.0f}x")

# Compare staging strategies
print("\\\n=== Staging Comparison ===")
total_mission_dv = 9400 + 3100  # Earth to TLI
v_e_avg = 3500  # average exhaust velocity

for n_stages in [1, 2, 3, 4, 5]:
    dv_per_stage = total_mission_dv / n_stages
    stage_ratio = np.exp(dv_per_stage / v_e_avg)
    # Total ratio = product of per-stage ratios
    # Each stage also carries structural mass (10%)
    structural = 0.10
    total_ratio = 1.0
    for s in range(n_stages):
        mr = np.exp(dv_per_stage / v_e_avg)
        effective = mr / (1 - structural * (1 - 1/mr))
        total_ratio *= effective
    print(f"{n_stages} stage(s): per-stage ratio = {stage_ratio:.1f}x, "
          f"total launch mass ratio = {total_ratio:,.0f}x")

# Payload to Moon for 3-stage Saturn V
payload_kg = 48_600  # Apollo CSM + LM
launch_mass = payload_kg * cumulative_ratio
print(f"\\\nApollo payload to TLI: {payload_kg:,} kg")
print(f"Estimated launch mass: {launch_mass/1000:,.0f} tonnes")
print(f"Actual Saturn V launch mass: 2,970 tonnes")`,
      challenge: 'Find the optimal delta-v split between stages to minimise total launch mass. Is it best to split delta-v equally between stages, or should earlier stages carry more? (Hint: the optimal split depends on each stage\'s exhaust velocity and structural fraction.)',
      successHint: 'Staging optimisation is how every launch vehicle is designed — from the Saturn V to SpaceX\'s Falcon 9. The exponential nature of the rocket equation means that small improvements in structural fraction or exhaust velocity have enormous effects on payload capacity.',
    },
    {
      title: 'Lunar descent trajectory — powered descent with throttle control',
      concept: `Landing on the Moon is the most critical phase of the mission. The Lunar Module (LM) starts in a 15 km orbit moving at 1,680 m/s and must reach the surface at near-zero velocity — a process called **powered descent**.

The descent has three phases:
1. **Braking phase**: high thrust, pitching from horizontal to ~45 degrees, shedding most of the orbital velocity
2. **Approach phase**: reduced thrust, visual navigation to the landing site
3. **Terminal descent**: near-vertical, pilot-controlled, final 150 m to touchdown

The physics is a balance between **gravity** (pulling down at 1.62 m/s^2) and **thrust** (pushing against gravity). Too little thrust and you crash. Too much thrust wastes fuel. The optimal descent uses a **gravity turn** — continuously adjusting thrust direction to minimise fuel consumption.

📚 *Powered descent is fundamentally different from landing on Earth: no atmosphere means no parachutes, no drag, no gliding. Every metre per second of velocity must be removed by burning fuel.*`,
      analogy: 'Imagine stopping a car on ice — no friction to help you. The only way to slow down is by running the engine in reverse. You must plan exactly when to start braking based on your speed and distance to the stop. Start too late and you crash into the wall. Start too early and you stop short (wasting fuel). The lunar descent is this problem in two dimensions.',
      storyConnection: 'Apollo 11\'s descent nearly ended in disaster. Armstrong saw the computer was guiding them toward a boulder field, took manual control, and flew laterally to find a clear spot — landing with only 25 seconds of fuel remaining. The descent trajectory model you\'ll build shows why fuel margins were so thin.',
      checkQuestion: 'The Lunar Module weighs 15,200 kg and its engine produces 45,000 N of thrust. What is the thrust-to-weight ratio on the Moon (g = 1.62 m/s^2)?',
      checkAnswer: 'Weight on Moon = 15,200 * 1.62 = 24,624 N. Thrust-to-weight ratio = 45,000 / 24,624 = 1.83. This means the engine can produce 1.83x the lunar gravitational force — enough to hover and to decelerate, but not with a huge margin.',
      codeIntro: 'Simulate the powered descent of the Lunar Module from orbit to touchdown.',
      code: `import numpy as np

# Lunar constants
g_moon = 1.62       # m/s^2
R_moon = 1_737_000  # m

# Lunar Module properties
m_total = 15_200     # kg (total mass at descent start)
m_dry = 2_150        # kg (empty descent stage)
m_ascent = 4_700     # kg (ascent stage, not used for descent fuel)
m_fuel = m_total - m_dry - m_ascent  # descent fuel
thrust_max = 45_040  # N (descent engine max thrust)
Isp = 311            # seconds (specific impulse)
v_exhaust = Isp * 9.81  # effective exhaust velocity

print("=== Lunar Module Descent Simulation ===")
print(f"Total mass: {m_total:,} kg | Fuel: {m_fuel:,} kg")
print(f"Max thrust: {thrust_max:,} N | Isp: {Isp} s")

# Simulation parameters
dt = 1.0  # time step (seconds)
max_time = 800  # seconds (Apollo 11 descent was ~756 s)

# Initial conditions (start of powered descent)
altitude = 15_000.0  # m (15 km orbit)
v_horizontal = 1_680.0  # m/s
v_vertical = 0.0  # m/s (initially horizontal)
downrange = 0.0
mass = float(m_total)
time = 0.0

# Descent profile: throttle and pitch angle over time
def get_throttle_and_pitch(t, alt, vh, vv):
    """Simple descent guidance law."""
    if t < 30:
        # Initial pitch-up to start braking
        return 0.95, 10.0  # 95% throttle, 10 deg from horizontal
    elif alt > 7000:
        # Braking phase: high thrust, increasing pitch
        pitch = min(45.0, 10 + (t - 30) * 0.08)
        return 0.92, pitch
    elif alt > 2000:
        # Approach phase: moderate thrust
        pitch = min(70.0, 45 + (alt - 7000) / (-5000) * 25)
        return 0.60, pitch
    elif alt > 150:
        # Terminal approach
        return 0.40, 80.0
    else:
        # Final descent — near vertical
        target_vv = -1.0  # target 1 m/s descent rate
        error = vv - target_vv
        throttle = 0.25 + error * 0.02
        return max(0.1, min(1.0, throttle)), 88.0

# Run simulation
log_times = []
log_alt = []
log_vh = []
log_vv = []
log_fuel = []

while altitude > 0 and time < max_time and mass > (m_dry + m_ascent):
    throttle, pitch_deg = get_throttle_and_pitch(time, altitude, v_horizontal, v_vertical)
    pitch_rad = np.radians(pitch_deg)

    # Thrust components
    thrust = thrust_max * throttle
    ax = -thrust * np.cos(pitch_rad) / mass  # horizontal deceleration
    ay = thrust * np.sin(pitch_rad) / mass - g_moon  # vertical: thrust up, gravity down

    # Update velocities
    v_horizontal += ax * dt
    v_vertical += ay * dt

    # Update position
    downrange += v_horizontal * dt
    altitude += v_vertical * dt

    # Fuel consumption
    dm = thrust / v_exhaust * dt
    mass -= dm

    # Log every 30 seconds
    if int(time) % 60 == 0:
        log_times.append(time)
        log_alt.append(altitude)
        log_vh.append(v_horizontal)
        log_vv.append(v_vertical)
        log_fuel.append(m_total - m_dry - m_ascent - (mass - m_dry - m_ascent))

    time += dt

fuel_used = m_total - mass
fuel_remaining = mass - m_dry - m_ascent

print(f"\\\n=== Descent Profile ===")
print(f"{'Time (s)':>9} {'Alt (m)':>10} {'V_horiz':>10} {'V_vert':>10} {'Fuel used':>10}")
print("-" * 51)
for i in range(len(log_times)):
    print(f"{log_times[i]:>8.0f} {log_alt[i]:>9.0f} {log_vh[i]:>9.1f} {log_vv[i]:>9.1f} {log_fuel[i]:>9.0f}")

print(f"\\\n=== Touchdown Summary ===")
print(f"Descent time: {time:.0f} seconds ({time/60:.1f} minutes)")
print(f"Horizontal velocity at landing: {v_horizontal:.1f} m/s")
print(f"Vertical velocity at landing: {v_vertical:.1f} m/s")
print(f"Downrange distance: {downrange/1000:.1f} km")
print(f"Fuel used: {fuel_used:.0f} kg ({fuel_used/m_fuel*100:.0f}% of total)")
print(f"Fuel remaining: {fuel_remaining:.0f} kg ({fuel_remaining/m_fuel*100:.0f}%)")
print(f"Hover time remaining: {fuel_remaining / (thrust_max * 0.25 / v_exhaust):.0f} seconds")`,
      challenge: 'Armstrong had to fly 400 m laterally to avoid boulders, using extra fuel. Add a 30-second lateral divert at altitude 200 m (10% throttle horizontally). How much fuel does this cost, and how much hover time remains? This is why Apollo 11 landed with only 25 seconds of fuel.',
      successHint: 'You just simulated a powered descent — the same type of trajectory used by every lunar and Mars lander. SpaceX\'s Starship landing uses a similar gravity-turn profile. The fundamental challenge is always the same: balance thrust against gravity while managing fuel.',
    },
    {
      title: 'Real-time systems — implement a task scheduler with priority interrupts',
      concept: `The Apollo Guidance Computer (AGC) was one of the first real-time computers — it had to run navigation, guidance, display updates, and telemetry **simultaneously** on a machine with only 74 KB of memory and a 1 MHz clock.

A **real-time task scheduler** manages multiple tasks that must run at specific times or frequencies. Each task has a **priority** — higher-priority tasks can **interrupt** lower-priority ones. The scheduler must guarantee that critical tasks (like engine control) never miss their deadline, even if the computer is busy with less urgent work.

The AGC used a **priority-based preemptive scheduler**: if a high-priority task (like navigation) was ready to run while a low-priority task (like display update) was executing, the scheduler would **preempt** (interrupt) the low-priority task, run the high-priority one, then resume the low-priority task.

📚 *Real-time computing is not about speed — it is about PREDICTABILITY. A real-time system must guarantee that critical tasks complete before their deadlines, every single time. Missing a deadline in a lunar descent could be fatal.*`,
      analogy: 'A hospital emergency room is a real-time system. When a heart attack patient arrives, they preempt the person with a sprained ankle — the doctor stops the lower-priority task and switches to the critical one. The ER scheduler (triage nurse) assigns priorities and ensures life-threatening cases are always handled first.',
      storyConnection: 'During Apollo 11\'s descent, the AGC triggered a "1202 alarm" — a task overflow warning. Too many tasks were queued because a radar switch was incorrectly set, flooding the scheduler with data. The real-time scheduler correctly shed the lowest-priority tasks and kept the critical guidance running. Without priority scheduling, the mission would have been aborted.',
      checkQuestion: 'Three tasks are ready: Navigation (priority 5, deadline 50 ms), Display (priority 2, deadline 200 ms), Telemetry (priority 3, deadline 100 ms). In what order should they run?',
      checkAnswer: 'Navigation first (highest priority, tightest deadline), then Telemetry (next priority), then Display (lowest priority, most relaxed deadline). If Navigation takes 30 ms and Telemetry takes 40 ms, Display starts at 70 ms — still well within its 200 ms deadline.',
      codeIntro: 'Build a priority-based task scheduler modelled on the Apollo Guidance Computer.',
      code: `import numpy as np

class Task:
    def __init__(self, name, priority, period_ms, exec_time_ms, deadline_ms=None):
        self.name = name
        self.priority = priority        # higher = more important
        self.period_ms = period_ms      # how often task runs
        self.exec_time_ms = exec_time_ms  # CPU time needed
        self.deadline_ms = deadline_ms or period_ms
        self.next_ready = 0             # when task is next ready
        self.time_remaining = 0         # remaining execution time
        self.completions = 0
        self.deadline_misses = 0
        self.preemptions = 0

# Apollo AGC task set
tasks = [
    Task("GUIDANCE",    priority=7, period_ms=100,  exec_time_ms=25),
    Task("NAVIGATION",  priority=6, period_ms=200,  exec_time_ms=40),
    Task("THRUST_CTRL", priority=8, period_ms=50,   exec_time_ms=10),
    Task("DISPLAY",     priority=2, period_ms=500,  exec_time_ms=30),
    Task("TELEMETRY",   priority=3, period_ms=1000, exec_time_ms=50),
    Task("RADAR_PROC",  priority=4, period_ms=250,  exec_time_ms=35),
    Task("KEYBOARD",    priority=1, period_ms=200,  exec_time_ms=5),
]

# Priority-based preemptive scheduler
sim_duration_ms = 5000
current_time = 0
active_task = None
schedule_log = []

# CPU utilisation tracking
cpu_busy_ms = 0

print("=== Apollo Guidance Computer Task Scheduler ===")
print(f"Simulation: {sim_duration_ms} ms | {len(tasks)} tasks\\\n")

print(f"{'Task':<14} {'Priority':>8} {'Period':>8} {'Exec':>6} {'Deadline':>9}")
print("-" * 47)
for t in tasks:
    print(f"{t.name:<14} {t.priority:>8} {t.period_ms:>6}ms {t.exec_time_ms:>4}ms {t.deadline_ms:>7}ms")

# Calculate CPU utilisation
total_util = sum(t.exec_time_ms / t.period_ms for t in tasks)
print(f"\\\nTotal CPU utilisation: {total_util*100:.1f}%")
if total_util > 1.0:
    print("WARNING: CPU is overloaded — deadline misses guaranteed!")

# Run scheduler
while current_time < sim_duration_ms:
    # Check for newly ready tasks
    for t in tasks:
        if current_time >= t.next_ready and t.time_remaining == 0:
            t.time_remaining = t.exec_time_ms
            t.next_ready += t.period_ms

    # Find highest priority ready task
    ready = [t for t in tasks if t.time_remaining > 0]
    if ready:
        best = max(ready, key=lambda t: t.priority)
        if active_task and active_task != best and active_task.time_remaining > 0:
            active_task.preemptions += 1
        active_task = best
        active_task.time_remaining -= 1
        cpu_busy_ms += 1

        if active_task.time_remaining == 0:
            active_task.completions += 1
            # Check deadline
            expected_done = active_task.next_ready - active_task.period_ms + active_task.deadline_ms
            if current_time > expected_done:
                active_task.deadline_misses += 1

    current_time += 1

# Results
print(f"\\\n=== Scheduler Results ({sim_duration_ms} ms) ===")
print(f"{'Task':<14} {'Completions':>12} {'Missed':>8} {'Preempted':>10} {'Success%':>9}")
print("-" * 55)
for t in tasks:
    expected = sim_duration_ms // t.period_ms
    success = (t.completions - t.deadline_misses) / max(t.completions, 1) * 100
    print(f"{t.name:<14} {t.completions:>10}/{expected:<3} {t.deadline_misses:>6} {t.preemptions:>9} {success:>8.0f}%")

print(f"\\\nCPU busy: {cpu_busy_ms/sim_duration_ms*100:.1f}% | Idle: {(1-cpu_busy_ms/sim_duration_ms)*100:.1f}%")`,
      challenge: 'Simulate the Apollo 11 "1202 alarm" scenario: add a rogue RADAR_STEAL task (priority 5, period 20 ms, exec 8 ms) that floods the scheduler. Which tasks start missing deadlines? What happens if you reduce RADAR_STEAL\'s priority to 1? This is exactly how the AGC survived — it shed low-priority tasks under overload.',
      successHint: 'Real-time scheduling is used in every embedded system: cars, aircraft, medical devices, industrial robots. The priority-based preemptive scheduler you built is the same algorithm (Rate Monotonic Scheduling) used in modern RTOS systems like FreeRTOS, VxWorks, and QNX.',
    },
    {
      title: 'Radiation environment — model cosmic ray exposure during transit',
      concept: `Outside Earth's magnetosphere, astronauts are exposed to two types of radiation: **galactic cosmic rays (GCR)** — high-energy particles from outside the solar system — and **solar particle events (SPE)** — bursts of radiation from solar flares.

GCR is a constant background: ~0.5-1.0 millisieverts per day in interplanetary space. SPE events are unpredictable: a large solar flare can deliver 1-10 sieverts in hours — a potentially lethal dose.

The total radiation dose depends on: (1) **time in transit** (longer trip = more GCR), (2) **shielding** (aluminium hull thickness), and (3) **solar activity** (during solar maximum, GCR is lower but SPE risk is higher).

Shielding effectiveness follows an exponential law: **dose = dose_0 * exp(-thickness / half_value_layer)**. Each "half-value layer" of shielding halves the dose.

📚 *A sievert (Sv) measures the biological effect of radiation. 1 Sv causes measurable health effects. 5 Sv is lethal within weeks. Annual background radiation on Earth is about 2.4 mSv.*`,
      analogy: 'Cosmic radiation is like a constant rain of invisible bullets. Earth\'s magnetic field is an umbrella that deflects most of them. In deep space, there is no umbrella. The spacecraft hull is a raincoat — it blocks some bullets, but not all. Thicker raincoat = better protection, but also heavier to carry.',
      storyConnection: 'Apollo astronauts spent 8-12 days outside the magnetosphere. Their cumulative dose was 2-11 mSv — comparable to a few chest X-rays. They were lucky: no major solar flares occurred during any Apollo mission. A 1972 solar flare (between Apollo 16 and 17) would have delivered a potentially lethal dose to astronauts in transit.',
      checkQuestion: 'An astronaut receives 0.7 mSv/day from GCR during a 9-day Moon mission. What is the total GCR dose?',
      checkAnswer: '0.7 * 9 = 6.3 mSv. This is about 2.6 times the annual background dose on Earth (2.4 mSv), compressed into 9 days. Significant but not dangerous for a single mission. The risk increases for long-duration missions: a 180-day Mars transit would accumulate 126 mSv from GCR alone.',
      codeIntro: 'Model radiation exposure during a lunar transit, including GCR background and random solar particle events.',
      code: `import numpy as np

np.random.seed(42)

# Radiation constants
GCR_RATE_MSV_DAY = 0.7    # mSv per day from galactic cosmic rays (unshielded)
SPE_PROBABILITY = 0.001    # probability of a solar particle event per day
SPE_DOSE_RANGE = (50, 5000)  # mSv from a single SPE (huge range)

# Shielding properties
def shielded_dose(dose_msv, al_thickness_cm, hvl_cm=3.0):
    """Calculate dose after aluminium shielding.
    hvl_cm: half-value layer (3 cm Al for GCR, varies for SPE)."""
    return dose_msv * np.exp(-0.693 * al_thickness_cm / hvl_cm)

# Apollo mission profile
mission_days = 9
transit_days = 6  # days outside magnetosphere
shield_cm = 2.0   # Apollo hull: ~2 cm aluminium equivalent

print("=== Lunar Mission Radiation Model ===")
print(f"Mission duration: {mission_days} days")
print(f"Time outside magnetosphere: {transit_days} days")
print(f"Hull shielding: {shield_cm} cm aluminium\\\n")

# GCR dose
gcr_unshielded = GCR_RATE_MSV_DAY * transit_days
gcr_shielded = shielded_dose(gcr_unshielded, shield_cm)
print(f"GCR dose (unshielded): {gcr_unshielded:.1f} mSv")
print(f"GCR dose (shielded):   {gcr_shielded:.1f} mSv")

# Monte Carlo SPE analysis
print(f"\\\n=== Solar Particle Event Risk (10,000 mission simulations) ===")
n_sims = 10_000
mission_doses = []

for _ in range(n_sims):
    dose = gcr_shielded  # start with GCR
    for day in range(transit_days):
        if np.random.random() < SPE_PROBABILITY:
            spe_dose = np.random.uniform(*SPE_DOSE_RANGE)
            spe_shielded = shielded_dose(spe_dose, shield_cm, hvl_cm=1.5)
            dose += spe_shielded
    mission_doses.append(dose)

doses = np.array(mission_doses)
print(f"Median mission dose:  {np.median(doses):>8.1f} mSv")
print(f"95th percentile:      {np.percentile(doses, 95):>8.1f} mSv")
print(f"99th percentile:      {np.percentile(doses, 99):>8.1f} mSv")
print(f"Maximum:              {np.max(doses):>8.1f} mSv")
print(f"Missions with SPE:    {np.sum(doses > gcr_shielded + 1):>6} ({np.mean(doses > gcr_shielded + 1)*100:.1f}%)")
print(f"Missions > 100 mSv:   {np.sum(doses > 100):>6} ({np.mean(doses > 100)*100:.2f}%)")
print(f"Missions > 1000 mSv:  {np.sum(doses > 1000):>6} ({np.mean(doses > 1000)*100:.2f}%)")

# Shielding analysis
print(f"\\\n=== Shielding Effectiveness ===")
print(f"{'Al Thickness':>14} {'GCR dose':>10} {'SPE (500 mSv)':>14} {'Total mass/m2':>14}")
print("-" * 54)
for t in [0, 1, 2, 5, 10, 20]:
    gcr = shielded_dose(GCR_RATE_MSV_DAY * transit_days, t)
    spe = shielded_dose(500, t, hvl_cm=1.5)
    mass = t * 2.7 * 10  # kg/m^2 (density * thickness in mm * conversion)
    print(f"{t:>12} cm {gcr:>8.1f} mSv {spe:>12.1f} mSv {mass:>12.1f} kg/m2")

# Career dose limits
print(f"\\\n=== Context: Dose Limits ===")
limits = [
    ("Earth background (annual)", 2.4),
    ("Chest X-ray", 0.1),
    ("Apollo mission (typical)", 6.0),
    ("NASA career limit", 600),
    ("ISS 6-month mission", 80),
    ("Mars transit (180 days)", 180 * 0.7 * 0.63),
]
for name, dose in limits:
    print(f"  {name:<32} {dose:>8.1f} mSv")`,
      challenge: 'The August 1972 solar flare would have delivered ~4,000 mSv unshielded. If Apollo 17 astronauts (December 1972) had been in transit during this event with 2 cm Al shielding, what dose would they have received? How thick would the shielding need to be to keep the dose below 100 mSv? This is the central challenge for Mars missions.',
      successHint: 'Radiation modelling is one of the hardest problems in deep space mission design. You combined deterministic physics (shielding attenuation) with stochastic events (random solar flares) using Monte Carlo simulation — the same approach NASA uses for mission radiation assessment. This problem is even more critical for Mars missions, where transit takes 6-9 months.',
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" /> Level 2: Builder
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Orbital mechanics and spacecraft engineering</span>
      </div>

      {!pyReady && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Level 2 dives into orbital mechanics, rocket staging, powered descent, real-time systems, and radiation modelling.
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
